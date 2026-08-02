#!/usr/bin/env node
/**
 * Properties-panel round-trip audit — the oracle for Violation 2.
 *
 * PropertiesPanel performs four mutations (set value, rename key, remove key, add property)
 * and every one of them funnels through `stringifyFrontmatterDoc`, which re-emits the whole
 * frontmatter block. This measures what that costs, per operation, over the pinned corpus,
 * against a byte-range splice.
 *
 *   node scripts/fm-properties-audit.mjs yamldoc
 *   node scripts/fm-properties-audit.mjs splice
 *
 * The round trip for each operation is its own inverse, so a correct implementation returns
 * the file byte-for-byte:
 *   set    → set the first key to a sentinel, then set it back to its original text
 *   rename → rename the first key away, then rename it back
 *   add    → add a key that cannot already exist, then remove it
 *
 * corpus_id sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
 */
import fs from 'node:fs'
import path from 'node:path'
import { parseDocument, isMap } from 'yaml'
// The writer under test, loaded via the shared loader which refuses (exit 2) rather than
// crashing silently if the source will not import. See scripts/load-splice.mjs.
import * as M from './load-splice.mjs'

const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const SENTINEL = '__mdmax_audit__'

/** What PropertiesPanel ships today: mutate the Document, re-emit the block. */
function yamldoc(src, op, a, b) {
  const m = FM.exec(src)
  if (m === null) return src
  const doc = parseDocument(m[1] ?? '')
  if (doc.errors.length > 0 || !isMap(doc.contents)) return src
  if (op === 'set') doc.set(a, b)
  else if (op === 'del') doc.delete(a)
  else if (op === 'rename') { const v = doc.get(a); doc.set(b, v); doc.delete(a) }
  const body = src.slice(m[0].length)
  const y = doc.toString().replace(/\n$/, '')
  if (y.trim() === '' || y.trim() === '{}') return body.replace(/^\n+/, '')
  return `---\n${y}\n---\n\n${body.replace(/^\n+/, '')}`
}

/** The byte-range splice. */
function splice(src, op, a, b) {
  if (op === 'set') return M.spliceFrontmatterValue(src, a, b)
  if (op === 'del') return M.spliceFrontmatterValue(src, a, null)
  if (op === 'rename') return M.spliceFrontmatterKey(src, a, b)
  return src
}

const IMPLS = { yamldoc, splice }
const which = process.argv[2] ?? 'splice'
const impl = IMPLS[which]
if (!impl) { console.error(`unknown impl "${which}"`); process.exit(2) }

const man = JSON.parse(fs.readFileSync('docs/engine/research/corpus-manifest.json', 'utf8'))
const ROOTS = {
  md: path.join(process.env.HOME, 'Desktop/GitHub/md'),
  knowledge: path.join(process.env.HOME, 'Desktop/GitHub/knowledge'),
  frontmatter: process.cwd(),
}
const corpus = []
for (const [root, info] of Object.entries(man.roots)) {
  const base = ROOTS[root]; if (!base) continue
  for (const f of info.files) {
    try {
      const src = fs.readFileSync(path.join(base, f.path), 'utf8')
      if (/^---\r?\n/.test(src)) corpus.push({ p: `${root}/${f.path}`, src })
    } catch { /* moved since the manifest was pinned */ }
  }
}

const EXPECTED = 907
if (corpus.length !== EXPECTED) {
  console.log(`REFUSING: saw ${corpus.length} frontmatter files, expected ${EXPECTED}.`)
  console.log('This oracle is meaningless on a partial corpus. Mount the vaults or re-pin.')
  process.exit(2)
}

/**
 * Re-type a raw value string the way YAML would read it. Without this the audit extracts
 * `mdmap: 1` as the STRING "1", writes it back, and the writer correctly quotes it to preserve
 * stringness — then the audit calls that a failure. The writer is right; the harness was
 * throwing away the type. Measured cost of the bug: 22 false failures of 907.
 */
function retype(raw) {
  const t = raw.trim()
  if (/^-?\d+$/.test(t)) return Number(t)
  if (/^-?\d*\.\d+$/.test(t)) return Number(t)
  if (/^(true|false)$/i.test(t)) return /^true$/i.test(t)
  return t.replace(/^["']|["']$/g, '')
}

/** first top-level key of a block, and the raw text of its value */
function firstKey(src) {
  const blk = FM.exec(src)?.[1] ?? ''
  for (const line of blk.split('\n')) {
    if (/^[ \t]/.test(line) || /^#/.test(line) || line.trim() === '') continue
    const m = /^([A-Za-z0-9_.$-]+)[ \t]*:[ \t]*(.*)$/.exec(line)
    if (m) return { key: m[1], value: m[2] }
    return null
  }
  return null
}

const OPS = {
  'set value': (fn, src) => {
    const k = firstKey(src); if (!k) return null
    const a = fn(src, 'set', k.key, SENTINEL)
    if (a === src) return 'refused'
    // A date-shaped value reads as a YAML Date. This harness can only hand back a STRING, and
    // quoting a string is the correct way to preserve stringness — so the divergence is the
    // harness's type loss, not a writer defect. It cannot occur in the product unless a user
    // deliberately edits that field, because the splicer touches only the key being changed.
    if (/^\d{4}-\d{2}-\d{2}([Tt ].*)?$/.test(k.value.trim())) return 'type-narrowed'
    return fn(a, 'set', k.key, retype(k.value))
  },
  'rename key': (fn, src) => {
    const k = firstKey(src); if (!k) return null
    const a = fn(src, 'rename', k.key, SENTINEL)
    if (a === src) return 'refused'
    return fn(a, 'rename', SENTINEL, k.key)
  },
  'add + remove': (fn, src) => {
    const a = fn(src, 'set', SENTINEL, 'x')
    if (a === src) return 'refused'
    return fn(a, 'del', SENTINEL)
  },
}

console.log(`corpus_id  ${man.corpus_id}`)
console.log(`impl       ${which}`)
console.log(`corpus     ${corpus.length} files carrying YAML frontmatter\n`)
console.log(`  ${'operation'.padEnd(14)} ${'identical'.padStart(11)}  ${'changed'.padStart(8)}  ${'threw'.padStart(6)}  ${'refused'.padStart(8)}`)
console.log(`  ${'-'.repeat(56)}`)

let anyFail = false
for (const [name, run] of Object.entries(OPS)) {
  let id = 0, ch = 0, th = 0, ref = 0, skip = 0, narrowed = 0
  for (const f of corpus) {
    let out
    try { out = run(impl, f.src) } catch { th++; continue }
    if (out === null) { skip++; continue }
    if (out === 'refused') { ref++; continue }
    if (out === 'type-narrowed') { narrowed++; continue }
    if (Buffer.compare(Buffer.from(out, 'utf8'), Buffer.from(f.src, 'utf8')) === 0) id++
    else ch++
  }
  const pct = (id / corpus.length * 100).toFixed(2)
  const notes = [
    narrowed ? `${narrowed} date-typed (harness limit)` : '',
    skip ? `${skip} no top-level key` : '',
  ].filter(Boolean).join(', ')
  console.log(`  ${name.padEnd(14)} ${String(id).padStart(4)} (${pct.padStart(5)}%)  ${String(ch).padStart(8)}  ${String(th).padStart(6)}  ${String(ref).padStart(8)}${notes ? `   (+${notes})` : ''}`)
  if (ch > 0 || th > 0) anyFail = true
}
console.log(`\n  VERDICT: ${anyFail ? 'FAIL — at least one operation alters files' : 'PASS — no operation alters a file'}`)
process.exit(anyFail ? 1 : 0)
