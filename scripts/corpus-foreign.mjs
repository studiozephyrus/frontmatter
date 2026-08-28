// The foreign-vault fidelity corpus: fetch, verify, and report.
//
//   node scripts/corpus-foreign.mjs verify   # hash the local copy against MANIFEST.sha256
//   node scripts/corpus-foreign.mjs fetch    # clone each source at its pinned commit
//   node scripts/corpus-foreign.mjs status   # what is on disk right now
//
// Why this exists: the 8,513-file corpus that backs our only cross-author fidelity
// claim lived in a session temp directory that gets reaped, and a re-clone had already
// drifted +2 files from the number the research reported. A corpus you cannot re-derive
// byte-for-byte is not evidence. So the bytes are pinned by sha256 here, the upstream
// commits are pinned in SOURCES.json, and a mismatch is reported as a finding rather
// than silently absorbed.
//
// The content itself is NOT committed — it is third-party material under its own
// licences. `_vendor/` is gitignored; `fetch` reconstructs it from the pinned commits.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve('test/corpus/foreign')
const VENDOR = path.join(ROOT, '_vendor')
const MANIFEST = path.join(ROOT, 'MANIFEST.sha256')
const SOURCES = path.join(ROOT, 'SOURCES.json')

const cmd = process.argv[2] || 'status'

const readManifest = () => {
  if (!fs.existsSync(MANIFEST)) {
    console.error('no manifest at', MANIFEST)
    process.exit(2)
  }
  const rows = new Map()
  for (const line of fs.readFileSync(MANIFEST, 'utf8').split('\n')) {
    if (!line.trim()) continue
    // "<sha256>  <bytes>  <vault/relative/path.md>" — the path may contain spaces,
    // so split on the first two separators only and keep the remainder intact.
    const m = /^([0-9a-f]{64})\s+(\d+)\s+(.*)$/.exec(line)
    if (!m) continue
    rows.set(m[3], { sha: m[1], bytes: Number(m[2]) })
  }
  return rows
}

const walk = (dir) => {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git') continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (e.name.endsWith('.md')) out.push(p)
  }
  return out
}

if (cmd === 'status') {
  const src = JSON.parse(fs.readFileSync(SOURCES, 'utf8'))
  const present = walk(VENDOR).length
  console.log(`pinned:  ${src.totals.files} md files, ${(src.totals.bytes / 1048576).toFixed(1)} MB, ${src.vaults.length} vaults`)
  console.log(`on disk: ${present} md files under ${path.relative(process.cwd(), VENDOR)}`)
  for (const v of src.vaults) console.log(`  ${v.name.padEnd(44)} ${String(v.md_files).padStart(5)} md  @ ${v.commit.slice(0, 12)}`)
  process.exit(present === src.totals.files ? 0 : 1)
}

if (cmd === 'fetch') {
  const src = JSON.parse(fs.readFileSync(SOURCES, 'utf8'))
  fs.mkdirSync(VENDOR, { recursive: true })
  for (const v of src.vaults) {
    const tmp = path.join(VENDOR, `.clone-${v.name}`)
    if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true, force: true })
    console.log(`cloning ${v.name} @ ${v.commit.slice(0, 12)}`)
    execFileSync('git', ['clone', '--quiet', v.remote, tmp], { stdio: 'inherit' })
    execFileSync('git', ['-C', tmp, 'checkout', '--quiet', v.commit], { stdio: 'inherit' })
    for (const f of walk(tmp)) {
      const dest = path.join(VENDOR, v.name, path.relative(tmp, f))
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(f, dest)
    }
    fs.rmSync(tmp, { recursive: true, force: true })
  }
  console.log('fetched. now run: node scripts/corpus-foreign.mjs verify')
  process.exit(0)
}

if (cmd === 'verify') {
  const pinned = readManifest()
  const files = walk(VENDOR)
  let ok = 0
  const changed = []
  const missing = []
  const extra = []
  const seen = new Set()

  for (const f of files) {
    const rel = path.relative(VENDOR, f).split(path.sep).join('/')
    seen.add(rel)
    const want = pinned.get(rel)
    if (!want) { extra.push(rel); continue }
    const buf = fs.readFileSync(f)
    const got = crypto.createHash('sha256').update(buf).digest('hex')
    if (got === want.sha) ok++
    else changed.push({ rel, want: want.sha.slice(0, 12), got: got.slice(0, 12), wantBytes: want.bytes, gotBytes: buf.length })
  }
  for (const rel of pinned.keys()) if (!seen.has(rel)) missing.push(rel)

  console.log(`pinned   ${pinned.size}`)
  console.log(`verified ${ok}`)
  console.log(`changed  ${changed.length}`)
  console.log(`missing  ${missing.length}`)
  console.log(`extra    ${extra.length}`)
  const show = (label, arr, fmt) => {
    if (!arr.length) return
    console.log(`\n${label} (first 10 of ${arr.length}):`)
    for (const x of arr.slice(0, 10)) console.log('  ' + fmt(x))
  }
  show('CHANGED', changed, (c) => `${c.rel}\n    want ${c.want} (${c.wantBytes}B)  got ${c.got} (${c.gotBytes}B)`)
  show('MISSING', missing, (m) => m)
  show('EXTRA', extra, (e) => e)

  // A floor, not an equality: adding a vault must not read as a regression, but any
  // byte that moved under a pinned path is a finding.
  const clean = changed.length === 0 && missing.length === 0
  console.log(`\n${clean ? 'CORPUS CLEAN' : 'CORPUS DRIFTED'} — ${ok}/${pinned.size} byte-identical`)
  process.exit(clean ? 0 : 1)
}

console.error(`unknown command: ${cmd}\nusage: node scripts/corpus-foreign.mjs [status|fetch|verify]`)
process.exit(2)
