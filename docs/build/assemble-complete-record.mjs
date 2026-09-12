// Assemble the complete frontmatter record into one markdown file:
// the PRD, the spec system, and all 105 research reports.
//
//   node docs/build/assemble-complete-record.mjs <output.md>
//
// Two things make this non-trivial and both are handled here:
//
//   1. HEADING COLLISION. The PDF builder splits the document into sections on
//      `^## N.`. The research reports carry 47 H1s and 262 H2s of their own, which
//      would fragment the record into hundreds of spurious sections. Every heading
//      inside an appended document is demoted one level (capped at h6) so the only
//      H2s in the output are the ones this script writes.
//
//   2. FENCE AWARENESS. A `#` at the start of a line inside a fenced code block is
//      a comment, not a heading. Demoting it would corrupt the code. So demotion
//      tracks fence state and skips anything inside a fence.
import fs from 'node:fs'
import path from 'node:path'

const out = process.argv[2]
if (!out) {
  console.error('usage: node docs/build/assemble-complete-record.mjs <output.md>')
  process.exit(2)
}

const PRD = 'docs/FRONTMATTER-PRD-v2-2026-08-29.md'
const ROUNDS = [
  ['docs/research/agent-reports-2026-08-28', 'R1–R6', 'Internal, external, hands-on, editors, AI journey, core concept'],
  ['docs/research/agent-reports-2026-08-29-r7', 'R7', 'PRD corpus — business model, internal fusion, risk and legal'],
  ['docs/research/agent-reports-2026-08-29-r8to10', 'R8–R10', 'AIOS productisation, spec-driven development, the markdown format, untouched angles'],
  ['docs/research/agent-reports-2026-08-29-r11', 'R11', 'The gap audit, architecture decisions, features, naming, measurement'],
  ['docs/research/agent-reports-2026-08-29-r12', 'R12', 'Build blockers — DR, sync, refusal UX, accessibility, API, roles, abuse, billing'],
]

// Demote every markdown heading by one level, skipping fenced regions.
const demote = (md) => {
  const lines = md.split('\n')
  let fence = null
  return lines.map((line) => {
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line)
    if (f) {
      if (!fence) fence = f[1][0]
      else if (f[1][0] === fence) fence = null
      return line
    }
    if (fence) return line
    const h = /^(#{1,6})(\s)/.exec(line)
    if (!h) return line
    const level = Math.min(h[1].length + 1, 6)
    return '#'.repeat(level) + line.slice(h[1].length)
  }).join('\n')
}

// Strip a leading H1 title line — the section heading we write replaces it.
const stripLeadTitle = (md) => md.replace(/^\s*#{1,2}\s+.*\n+/, '')

// Hard floor. Fence-aware demotion is correct in the common case, but the reports
// contain unbalanced fences — an opening ``` with no close, or ``` nested inside
// ~~~ — which desynchronises any tracker and leaves headings undemoted. The PDF
// builder's section splitter is NOT fence-aware, so a single stray `## ` in an
// appended document fragments the record into a spurious section. This pass
// guarantees the invariant the splitter depends on: in appended content, no line
// begins with `# ` or `## `. It can over-demote a comment inside a broken fence,
// which is cosmetic; fragmenting the document is not.
const hardFloor = (md) => md.replace(/^(#{1,2})(\s)/gm, '###$2')

const titleOf = (file) => {
  const base = path.basename(file, '.md')
  // "x13-core-pricing-refs-screens" -> "x13 · core pricing refs screens"
  const m = /^([a-z]+\d+)-(.*)$/.exec(base)
  if (!m) return base.replace(/-/g, ' ')
  return `${m[1]} · ${m[2].replace(/-/g, ' ')}`
}

let n = 61 // the PRD occupies 0-60
const parts = []

// --- Part One: the PRD ------------------------------------------------------
const prd = fs.readFileSync(PRD, 'utf8')
// Keep the PRD verbatim, including its own front matter and section numbering.
parts.push(prd.trimEnd())

// --- Part Two: the spec system ---------------------------------------------
const specFiles = [
  'specs/SPECS.md', 'specs/README.md', 'specs/_schema/states.md',
  ...fs.globSync('specs/*/*.md').filter((f) => !f.includes('_schema')).sort(),
]
const seen = new Set()
let specBody = ''
for (const f of specFiles) {
  if (seen.has(f) || !fs.existsSync(f)) continue
  seen.add(f)
  // Demoted twice: the spec's own H2s must sit under the `### <path>` heading
  // this script writes, so h2 -> h4.
  const body = hardFloor(demote(demote(stripLeadTitle(fs.readFileSync(f, 'utf8'))))).trimEnd()
  specBody += `\n### ${f}\n\n${body}\n`
}
parts.push(`\n---\n\n## ${n}. The spec system — the executable contract layer\n\nThe PRD says what to build. These files say what "done" means, and a harness refuses to write a later state until the evidence exists. Reproduced verbatim.\n${specBody}`)
n += 1

// --- Part Three: the research record ---------------------------------------
// Reserve the how-to section's number BEFORE numbering the reports, so document
// order and section numbering agree. Numbering it after the loop put §167 between
// §61 and §62 in the rendered contents.
const howToNum = n
n += 1
let appendixIndex = ''
const appendixBodies = []
for (const [dir, round, blurb] of ROUNDS) {
  if (!fs.existsSync(dir)) continue
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort()
  appendixIndex += `\n**${round} — ${blurb}** · ${files.length} reports · §${n}–§${n + files.length - 1}\n`
  for (const f of files) {
    const full = path.join(dir, f)
    const raw = fs.readFileSync(full, 'utf8')
    const words = raw.split(/\s+/).filter(Boolean).length
    appendixBodies.push(
      `\n---\n\n## ${n}. ${round} · ${titleOf(full)}\n\n` +
      `> Source: \`${full}\` · ${words.toLocaleString()} words · reproduced verbatim.\n\n` +
      hardFloor(demote(stripLeadTitle(raw))).trimEnd() + '\n'
    )
    n += 1
  }
}

const totalReports = appendixBodies.length
parts.push(
  `\n---\n\n## ${howToNum}. The research record — how to read the appendix\n\n` +
  `All **${totalReports} reports**, verbatim, in round order. Nothing is summarised here; the PRD is the summary and this is what it was built from. Headings inside each report are demoted one level so the report's own structure survives without fragmenting this document.\n\n` +
  `**Read an appendix report when you want to check a claim, not when you want the answer.** The PRD carries the conclusions with their evidence tags; these carry the working.\n` +
  appendixIndex
)
// the "how to read" section must precede the reports
const howTo = parts.pop()
parts.push(howTo, ...appendixBodies)

const doc = parts.join('\n')
fs.writeFileSync(out, doc)

const words = doc.split(/\s+/).filter(Boolean).length
const h2 = (doc.match(/^## /gm) || []).length
console.log(`wrote ${out}`)
console.log(`  words     ${words.toLocaleString()}`)
console.log(`  sections  ${h2}`)
console.log(`  reports   ${totalReports}`)
console.log(`  diagrams  ${(doc.match(/```mermaid/g) || []).length}`)
