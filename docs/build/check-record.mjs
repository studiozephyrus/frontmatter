// Prove the assembled record carries every tree file, unchanged.
//
//   node docs/build/check-record.mjs
//
// The assembler renumbers and re-separates; it must never edit. This asserts that
// every content line of every tree file appears in the record, in order, unchanged.
// Blank lines and `---` rules are formatting the assembler inserts, so they are
// excluded — everything else is the document, and a single differing line fails.
//
// Section COUNTS are not evidence. A heading can survive while its body is dropped,
// which is exactly the failure a count check waves through.
import fs from 'node:fs'

const RECORD = 'docs/FRONTMATTER-RECORD.md'
const TREE = [
  ['docs/FRONTMATTER-PRD-v2-2026-08-29.md', 'PRD'],
  ['docs/ENGINE.md', 'ENGINE'],
  ['docs/BUSINESS.md', 'BUSINESS'],
  ['docs/VERIFICATION.md', 'VERIFY'],
  ['docs/PRODUCT.md', 'PRODUCT'],
  ['docs/THESIS.md', 'THESIS'],
  ['docs/CRITIQUE.md', 'CRITIQUE'],
  ['docs/DEV-PLAN.md', 'DEV-PLAN'],
  ['docs/REFERENCES.md', 'REFERENCES'],
]

// Fence-aware section split: a `## N.` inside a fence is example text, not a heading.
const sections = (text) => {
  let fence = null, cur = null
  const out = new Map()
  const num = new Map()
  for (const line of text.split('\n')) {
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line)
    if (f) { fence = !fence ? f[1][0] : (f[1][0] === fence ? null : fence); if (cur) out.get(cur).push(line); continue }
    const h = /^##\s+(\d+)\.\s*(.+)$/.exec(line)
    if (!fence && h) { cur = h[2].trim(); out.set(cur, []); num.set(cur, Number(h[1])); continue }
    if (cur) out.get(cur).push(line)
  }
  out.num = num
  return out
}
const content = (a) => a.filter((l) => l.trim() !== '' && l.trim() !== '---')

// A local-run file's sections are renumbered on assembly (DEV-PLAN §3 -> §90), and its
// subsections and §-references move with them. Apply the same map before comparing, or
// this reports a difference that is the assembler doing its job.
const remap = (linesArr, from, to) => from === to ? linesArr : linesArr.map((l) => l
  .replace(new RegExp(`^(###+\\s+)${from}\\.(\\d+)`), `$1${to}.$2`)
  .replace(new RegExp(`\u00a7\\s*${from}\\.(\\d+)`, 'g'), `\u00a7${to}.$1`))

if (!fs.existsSync(RECORD)) { console.error(`${RECORD} not built — run npm run doc`); process.exit(2) }
const rec = sections(fs.readFileSync(RECORD, 'utf8'))

let files = 0, secs = 0, lines = 0
const fail = []
for (const [file, label] of TREE) {
  if (!fs.existsSync(file)) { fail.push(`${label}: ${file} does not exist`); continue }
  const src = sections(fs.readFileSync(file, 'utf8'))
  let ok = 0, n = 0
  for (const [title, body] of src) {
    const there = rec.get(title)
    if (!there) { fail.push(`${label} §"${title}" — absent from the record`); continue }
    const from = src.num.get(title), to = rec.num.get(title)
    const a = remap(content(body), from, to).join('\n'), b = content(there).join('\n')
    if (a !== b) {
      // name the first differing line so the fix is one look, not a bisect
      const A = remap(content(body), from, to), B = content(there)
      let i = 0; while (i < Math.min(A.length, B.length) && A[i] === B[i]) i++
      fail.push(`${label} §"${title}" — differs at content line ${i + 1} of ${A.length}\n` +
        `        tree:   ${JSON.stringify((A[i] ?? '<end>').slice(0, 90))}\n` +
        `        record: ${JSON.stringify((B[i] ?? '<end>').slice(0, 90))}`)
      continue
    }
    ok++; n += content(body).length
  }
  files++; secs += ok; lines += n
  console.log(`  ${ok === src.size ? 'OK  ' : 'FAIL'}  ${label.padEnd(11)} ${String(ok).padStart(3)}/${String(src.size).padEnd(3)} sections · ${n.toLocaleString()} content lines identical`)
}

if (fail.length) { console.log('\nFAILURES\n'); for (const f of fail) console.log('  ' + f) }
console.log(`\n${files}/${TREE.length} tree files · ${secs} sections · ${lines.toLocaleString()} content lines carried through unchanged · ${fail.length} failures`)
process.exit(fail.length ? 1 : 0)
