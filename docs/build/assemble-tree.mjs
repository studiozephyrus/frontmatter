// Assemble the markdown tree into one printable document.
//
//   node docs/build/assemble-tree.mjs <output.md> [--with-research]
//
// The tree is authored as separate files because that is what an AI implementer
// needs — small, addressable, one subject each. This script produces the other
// artifact a human needs: one linear document to print.
//
// The two are not in tension. The tree is canonical; this output is derived and
// disposable, which is the same projection rule the product itself is built on.
import fs from 'node:fs'
import path from 'node:path'

const out = process.argv[2]
const withResearch = process.argv.includes('--with-research')
if (!out) {
  console.error('usage: node docs/build/assemble-tree.mjs <output.md> [--with-research]')
  process.exit(2)
}

// Part order is reading order, not file order.
//
// The first three share ONE global run (PRD §0-66, ENGINE §67-80, BUSINESS §81-87),
// so their renumbering here must be the identity map - asserted below, because a
// silent renumber would break every cross-reference the agents wrote.
// The last two carry local runs and are renumbered onto the tail on purpose.
const PARTS = [
  { file: 'docs/FRONTMATTER-PRD-v2-2026-08-29.md', verbatim: true },
  { file: 'docs/ENGINE.md', title: 'The engine', identity: true },
  { file: 'docs/BUSINESS.md', title: 'The business', identity: true },
  { file: 'docs/VERIFICATION.md', title: 'Verification', identity: true },
  { file: 'docs/PRODUCT.md', title: 'The product decision surface', identity: true },
  { file: 'docs/THESIS.md', title: 'The thesis', identity: true },
  { file: 'docs/CRITIQUE.md', title: 'The critique' },
  { file: 'docs/DEV-PLAN.md', title: 'The engineering plan' },
  { file: 'docs/REFERENCES.md', title: 'References' },
]

// H1s that are allowed to survive into the assembled document. Anything else is a
// heading that escaped demotion and would fragment the PDF.
const ALLOWED_H1 = [
  '# frontmatter - Product Requirements Document',
  '# The whole thing, in four pages',
]

// Heading demotion, fence-aware, with a hard floor. The floor is not optional:
// the reports contain unbalanced fences (an opening ``` with no close, ``` nested
// inside ~~~) which desynchronise any tracker, and the PDF builder splits sections
// on `^## N.` without fence awareness. One stray `## ` fragments the document.
const demote = (md) => {
  let fence = null
  return md.split('\n').map((line) => {
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line)
    if (f) {
      if (!fence) fence = f[1][0]
      else if (f[1][0] === fence) fence = null
      return line
    }
    if (fence) return line
    const h = /^(#{1,6})(\s)/.exec(line)
    return h ? '#'.repeat(Math.min(h[1].length + 1, 6)) + line.slice(h[1].length) : line
  }).join('\n')
}
const hardFloor = (md) => md.replace(/^(#{1,2})(\s)/gm, '###$2')
const stripLead = (md) => md.replace(/^\s*#{1,2}\s+.*\n+/, '')
const stripSuperseded = (md) => md.replace(/^>\s*\*\*SUPERSEDED[\s\S]*?\n\n/, '')

let n = 0
const chunks = []
const push = (heading, body) => chunks.push(`\n---\n\n## ${n++}. ${heading}\n\n${body.trimEnd()}\n`)

// --- Part one: the PRD, verbatim, keeping its own 0..N numbering ------------
const prdRaw = fs.readFileSync(PARTS[0].file, 'utf8')
chunks.push(prdRaw.trimEnd())
// continue numbering after the PRD's highest section
const prdNums = [...prdRaw.matchAll(/^##\s+(\d+)\./gm)].map((m) => Number(m[1]))
n = Math.max(...prdNums) + 1

// --- Parts two onward: each file becomes one numbered section --------------
for (const part of PARTS.slice(1)) {
  if (!fs.existsSync(part.file)) { console.error('MISSING (skipped):', part.file); continue }
  const raw = stripSuperseded(fs.readFileSync(part.file, 'utf8'))
  // These files carry their own `## N.` sections; lift each into the global run.
  // JS has no inline (?m) flag — use the /m flag on the literal, or this throws.
  const secs = [...raw.matchAll(/^##\s+\d+\.\s*(.+)$/gm)]
  if (secs.length === 0) {
    push(part.title, hardFloor(demote(stripLead(raw))))
    continue
  }
  // Split on the file's own H2s and renumber into the global sequence.
  // FENCE-AWARE, and this is not optional: DEV-PLAN ships an incident runbook whose
  // template lives inside a fence and begins `## 0. Is this real?`. A naive split
  // turns those eight comment lines into eight phantom sections and blows a hole in
  // the numbering — which is precisely what the missing/monotonic gate caught.
  const blocks = []
  {
    let fence = null, cur = []
    for (const line of raw.split('\n')) {
      const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line)
      if (f) { fence = !fence ? f[1][0] : (f[1][0] === fence ? null : fence) }
      else if (!fence && /^##\s+\d+\./.test(line) && cur.length) { blocks.push(cur.join('\n')); cur = [] }
      cur.push(line)
    }
    if (cur.length) blocks.push(cur.join('\n'))
  }
  for (const block of blocks) {
    const m = /^##\s+(\d+)\.\s*(.+)$/m.exec(block)
    if (!m) continue
    // When a LOCAL-run section moves (DEV-PLAN §3 -> §90), its subsections and every
    // reference to them must move with it, or the printed record shows "§90" containing
    // "3.1" and reads as broken. Only `### N.x` headings and `§N.x` references are
    // rewritten - a bare `3.6` in prose or a version string is left alone.
    const renumberBody = (text, from, to) => from === to ? text : text
      .replace(new RegExp(`^(###+\\s+)${from}\\.(\\d+)`, 'gm'), `$1${to}.$2`)
      .replace(new RegExp(`§\\s*${from}\\.(\\d+)`, 'g'), `\u00a7${to}.$1`)

    if (part.identity && Number(m[1]) !== n) {
      console.error(`FATAL ${part.file}: authored \u00a7${m[1]} would be renumbered to \u00a7${n}.`)
      console.error('  These files share the global run; renumbering breaks every cross-reference.')
      process.exit(1)
    }
    push(m[2].trim(), renumberBody(block.slice(block.indexOf('\n') + 1), Number(m[1]), n))
  }
}

// --- Optional appendix: the full research corpus ---------------------------
if (withResearch) {
  const dirs = [
    ['docs/research/agent-reports-2026-08-28', 'R1–R6'],
    ['docs/research/agent-reports-2026-08-29-r7', 'R7'],
    ['docs/research/agent-reports-2026-08-29-r8to10', 'R8–R10'],
    ['docs/research/agent-reports-2026-08-29-r11', 'R11'],
    ['docs/research/agent-reports-2026-08-29-r12', 'R12'],
  ]
  push('The research appendix — how to read it',
    'Every report, verbatim, in round order. The document above is the synthesis; this is what it was built from.\n\n' +
    '**Open one of these to check a claim, never to find an answer.**')
  for (const [dir, round] of dirs) {
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
      const full = path.join(dir, f)
      const raw = fs.readFileSync(full, 'utf8')
      const label = path.basename(f, '.md').replace(/^([a-z]+\d+)-/, '$1 · ').replace(/-/g, ' ')
      push(`${round} · ${label}`,
        `> Source: \`${full}\` · ${raw.split(/\s+/).filter(Boolean).length.toLocaleString()} words · verbatim.\n\n` +
        hardFloor(demote(stripLead(raw))))
    }
  }
}

const doc = chunks.join('\n')
fs.writeFileSync(out, doc)

// --- integrity: numbering must be gapless AND monotonic in document order ---
// Every scan below is FENCE-AWARE. The PRD legitimately shows example ADR,
// CHANGELOG and spec files inside fences, and five of those carry `## ` headings.
// A naive scan counts them as stray headings and reports a failure that is not
// real - and a harness that cries wolf gets ignored, which is the same disease
// as one that passes silently.
const scan = () => {
  const nums = [], stray = [], h1 = []
  let fence = null
  doc.split('\n').forEach((line) => {
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line)
    if (f) { fence = !fence ? f[1][0] : (f[1][0] === fence ? null : fence); return }
    if (fence) return
    if (/^# /.test(line)) h1.push(line)
    const m = /^##\s+(\d+)\./.exec(line)
    if (m) nums.push(Number(m[1]))
    else if (/^## /.test(line)) stray.push(line)
  })
  return { nums, stray, h1 }
}
const { nums, stray, h1: h1s } = scan()
const mono = nums.every((v, i) => i === 0 || nums[i - 1] < v)
const missing = []
for (let i = nums[0]; i <= nums[nums.length - 1]; i++) if (!nums.includes(i)) missing.push(i)
const dupes = [...new Set(nums.filter((v, i) => nums.indexOf(v) !== i))]
const strayH1list = h1s.filter((l) => !ALLOWED_H1.includes(l.replace(/[\u2014\u2013]/g, '-')))
const strayH1 = strayH1list.length
const unnumbered = stray.length

console.log(`wrote ${out}`)
console.log(`  words        ${doc.split(/\s+/).filter(Boolean).length.toLocaleString()}`)
console.log(`  sections     ${nums.length}  (${nums[0]}..${nums[nums.length - 1]})`)
console.log(`  diagrams     ${(doc.match(/```mermaid/g) || []).length}`)
console.log(`  monotonic    ${mono}`)
console.log(`  missing      ${missing.length ? missing.join(',') : 'none'}`)
console.log(`  duplicates   ${dupes.length ? dupes.join(',') : 'none'}`)
console.log(`  H1 total     ${h1s.length} (${ALLOWED_H1.length} expected)`)
console.log(`  stray H1     ${strayH1} (must be 0)${strayH1 ? ' -> ' + strayH1list.join(' | ') : ''}`)
console.log(`  unnumbered   ${unnumbered} (must be 0 — these would fragment the PDF)${unnumbered ? ' -> ' + stray.slice(0, 5).join(' | ') : ''}`)
process.exit(mono && !missing.length && !dupes.length && strayH1 === 0 && unnumbered === 0 ? 0 : 1)
