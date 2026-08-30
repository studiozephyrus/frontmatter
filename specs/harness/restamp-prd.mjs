// Re-stamp each spec's `prd_sha256` after a reviewed PRD change.
//
//   node specs/harness/restamp-prd.mjs --check     # verify only, exit 1 if any citation is broken
//   node specs/harness/restamp-prd.mjs             # verify, then re-stamp the specs that pass
//
// The `stale-prd` warning exists so that a PRD edit forces a human to re-read the
// specs that cite it. Re-stamping without reading turns that warning into a rubber
// stamp — which is worse than no warning, because it looks like review happened.
//
// So this refuses to stamp a spec whose `prd_sections` no longer resolve. A broken
// citation is an ERROR, not something to paper over with a fresh hash.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const CHECK = process.argv.includes('--check')
const ROOT = 'specs'

const specs = []
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) { if (!e.name.startsWith('_') && e.name !== 'harness') walk(p) }
    else if (e.name.endsWith('.md') && e.name !== 'SPECS.md' && e.name !== 'README.md') specs.push(p)
  }
}
walk(ROOT)

// Minimal frontmatter reader — enough for the four scalar/array fields we need, and
// deliberately not a YAML parser: an all-digit sha256 must stay a string.
const fm = (text) => {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text)
  if (!m) return null
  const out = {}
  for (const line of m[1].split('\n')) {
    const kv = /^([a-z_0-9]+):\s*(.*)$/.exec(line)
    if (kv) out[kv[1]] = kv[2].trim()
  }
  return out
}

// A section resolves if the PRD has `## N.` (and `### N.M` when a subsection is cited).
const resolves = (prd, ref) => {
  const s = String(ref).replace(/^§/, '')
  if (s.includes('.')) {
    const top = s.split('.')[0]
    return new RegExp(`^## ${top}\\.`, 'm').test(prd) &&
           new RegExp(`^### ${s.replace('.', '\\.')}[ .]`, 'm').test(prd)
  }
  return new RegExp(`^## ${s}\\.`, 'm').test(prd)
}

let broken = 0, stamped = 0, fresh = 0
for (const file of specs) {
  const text = fs.readFileSync(file, 'utf8')
  const f = fm(text)
  if (!f?.prd_file || !f.prd_sha256) continue
  if (!fs.existsSync(f.prd_file)) { console.log(`ERROR  ${file}: prd_file missing — ${f.prd_file}`); broken++; continue }

  const prd = fs.readFileSync(f.prd_file, 'utf8')
  const live = crypto.createHash('sha256').update(prd).digest('hex')
  const recorded = f.prd_sha256.replace(/^["']|["']$/g, '')

  const refs = (f.prd_sections || '').replace(/^\[|\]$/g, '')
    .split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
  const bad = refs.filter((r) => !resolves(prd, r))

  if (bad.length) {
    console.log(`ERROR  ${file}`)
    console.log(`       cites §${bad.join(', §')} — not present in ${f.prd_file}`)
    console.log(`       fix the citation; a fresh hash would hide this, not solve it.`)
    broken++
    continue
  }
  if (recorded === live) { fresh++; continue }
  console.log(`${CHECK ? 'STALE ' : 'STAMP '} ${file}  \u00a7${refs.join(' \u00a7')} all resolve`)
  if (!CHECK) {
    // Match the whole line, not the recorded value: half these files quote the hash
    // and half do not, and a value-anchored regex silently misses the quoted ones.
    // ALWAYS write it quoted — an all-digit sha256 parses as a number otherwise.
    const next = text.replace(/^prd_sha256:.*$/m, `prd_sha256: "${live}"`)
    if (next === text) { console.log(`       WRITE FAILED — no prd_sha256 line replaced`); broken++; continue }
    fs.writeFileSync(file, next)
    // Verify the write LANDED. A tool that writes and does not read back is
    // reporting its intention, not its effect.
    const back = fm(fs.readFileSync(file, 'utf8'))
    if (back?.prd_sha256?.replace(/^["']|["']$/g, '') !== live) {
      console.log(`       WRITE DID NOT LAND — on-disk value is still ${back?.prd_sha256}`)
      broken++; continue
    }
    stamped++
  }
}

console.log(`\n${specs.length} specs · ${fresh} already current · ${CHECK ? 0 : stamped} stamped · ${broken} broken citations`)
process.exit(broken ? 1 : 0)
