// Check that every cross-reference in the tree resolves.
//
//   node docs/build/check-refs.mjs [--verbose]
//
// A referential architecture is only as good as its references. A `§74` that points
// at nothing is worse than no pointer at all, because the reader goes looking and
// concludes the record is incoherent rather than that one link is broken.
//
// Two runs exist (see docs/MAP.md):
//   global §0-87  PRD 0-66 · ENGINE 67-80 · BUSINESS 81-87   — a bare §N resolves here
//   local         DEV-PLAN §1-13 · REFERENCES §1-7           — must be file-qualified
//
// Deliberately NOT flagged: `CommonMark §4.5`, `Directive ... Art. 16(m)` and other
// citations of outside documents that happen to use the section sign. A checker that
// cries wolf on correct citations trains you to ignore it.
import fs from 'node:fs'

const VERBOSE = process.argv.includes('--verbose')

const GLOBAL = [
  ['docs/FRONTMATTER-PRD-v2-2026-08-29.md', 0, 66],
  ['docs/ENGINE.md', 67, 80],
  ['docs/BUSINESS.md', 81, 88],
  ['docs/VERIFICATION.md', 89, 89],
  ['docs/PRODUCT.md', 90, 97],
  ['docs/THESIS.md', 98, 104],
]
const LOCAL = { 'DEV-PLAN': 'docs/DEV-PLAN.md', REFERENCES: 'docs/REFERENCES.md', CRITIQUE: 'docs/CRITIQUE.md' }

// DECIDE.md defines no sections of its own — it only cites. It is checked so that a
// synthesis written by hand cannot invent a section number, which is exactly the
// mistake its first draft made (§105 is "How to build from this", not the editor
// research). Cite a research report by its id; cite the record by section.
const CITERS = ['docs/DECIDE.md']

// Fence-aware line reader: example documents inside fences are not our references.
const lines = (file) => {
  if (!fs.existsSync(file)) return []
  let fence = null
  return fs.readFileSync(file, 'utf8').split('\n').map((line, i) => {
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line)
    if (f) { fence = !fence ? f[1][0] : (f[1][0] === fence ? null : fence); return null }
    return fence ? null : { line, n: i + 1 }
  }).filter(Boolean)
}

// Build the set of section ids each file actually defines.
const defined = new Map()          // 'global' | 'DEV-PLAN' | 'REFERENCES' -> Set of "12" and "12.3"
const addDef = (key, file) => {
  const set = defined.get(key) || new Set()
  for (const { line } of lines(file)) {
    const h2 = /^##\s+(\d+)\./.exec(line)
    if (h2) set.add(h2[1])
    const h3 = /^###\s+(\d+\.\d+)[ .]/.exec(line)
    if (h3) set.add(h3[1])
  }
  defined.set(key, set)
}
for (const [f] of GLOBAL) addDef('global', f)
for (const [k, f] of Object.entries(LOCAL)) addDef(k, f)

// Which file owns a global section number, for the report.
const owner = (n) => (GLOBAL.find(([, lo, hi]) => n >= lo && n <= hi) || [])[0] || '(nothing)'

// Anything immediately before a § that means "this is somebody else's numbering".
const FOREIGN = /(CommonMark|RFC\s*\d+|YAML|Directive|Regulation|Act|Rule|IT Rules|DPDP|GDPR|Art\.|Article|Schedule|clause|spec|CFR|U\.?S\.?C|USC|SEC|FINRA|Companies Act|Income[- ]tax)\s*(\d+[a-z]*\s*)?$/i

const files = [...GLOBAL.map(([f]) => f), ...Object.values(LOCAL), ...CITERS.filter((f) => fs.existsSync(f))]
let checked = 0, foreign = 0
const BROKEN = [], SUSPECT = []

// Every top-level number our runs define anywhere. A reference whose top-level number
// is not in here is somebody else's numbering - 21 CFR 11, WCAG 5.2, CSS Text 4.1 -
// and no keyword list is needed to see that. This is the rule that stops the checker
// crying wolf, which matters more than catching one extra real break.
// Declared ranges count, not just what is currently on disk: a reference to §71 is
// ours even while ENGINE.md is half-written, and silently skipping it as "external"
// would hide exactly the break we are looking for.
const OURS = new Set()
for (const [, lo, hi] of GLOBAL) for (let i = lo; i <= hi; i++) OURS.add(String(i))
for (const [k, set] of defined) if (k !== 'global') for (const id of set) OURS.add(id.split('.')[0])

for (const file of files) {
  for (const { line, n } of lines(file)) {
    const re = /(DEV-PLAN|REFERENCES)?\s*§\s*(\d+(?:\.\d+)?)/g
    let m
    while ((m = re.exec(line))) {
      const before = line.slice(0, m.index)
      const ref = m[2]
      const parent = ref.split('.')[0]
      const qualified = m[1]

      if (!qualified && (FOREIGN.test(before) || !OURS.has(parent))) { foreign++; continue }
      checked++

      const home = Object.entries(LOCAL).find(([, f]) => f === file)?.[0]
      const order = qualified ? [qualified] : home ? [home, 'global'] : ['global']
      if (order.some((k) => defined.get(k)?.has(ref))) continue

      const where = `${file}:${n}`
      const text = line.trim().slice(0, 118)
      const parentIn = order.filter((k) => defined.get(k)?.has(parent))

      if (parentIn.length && !qualified && ref.includes('.')) {
        // §N exists, §N.M does not. This is also the exact shape of an un-keyworded
        // external citation, so it is reported and not failed on.
        SUSPECT.push(`${where}  §${ref} — §${parent} exists in ${parentIn[0]}, §${ref} does not\n    ${text}`)
      } else {
        BROKEN.push(`${where}  ${qualified ? qualified + ' ' : ''}§${ref} — ` +
          (parentIn.length ? `§${parent} exists in ${parentIn[0]}, §${ref} does not`
                           : `nothing defines §${parent} in ${order.join(' or ')}`) + `\n    ${text}`)
      }
    }
  }
}

if (BROKEN.length) { console.log('BROKEN — these point at nothing\n'); for (const r of BROKEN) console.log(r + '\n') }
if (SUSPECT.length && VERBOSE) { console.log('SUSPECT — parent exists, subsection does not (often an external citation)\n'); for (const r of SUSPECT) console.log(r + '\n') }
if (VERBOSE) for (const [k, v] of defined) console.log(`  ${k}: ${[...v].length} ids defined`)

const absent = GLOBAL.filter(([f]) => !fs.existsSync(f)).map(([f]) => f)
if (absent.length) console.log(`\nnot built yet, so their sections cannot resolve: ${absent.join(', ')}`)
console.log(`\n${files.filter(fs.existsSync).length}/${files.length} files · ${checked} internal refs · ` +
  `${foreign} external citations skipped · ${BROKEN.length} broken · ${SUSPECT.length} suspect` +
  (VERBOSE ? '' : ' (--verbose to list suspects)'))
process.exit(BROKEN.length ? 1 : 0)
