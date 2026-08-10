#!/usr/bin/env node
/**
 * THE SLUG DECISION — measured, not assumed. (PLAN §3.8.2)
 *
 * The plan says anchor health swings 77 percentage points on the choice of slug algorithm, and
 * that one research report used two different algorithms in adjacent claims without noticing.
 * A number that load-bearing gets re-derived before it decides anything.
 *
 * This extracts every intra-document anchor link (`[text](#anchor)`) and every heading from the
 * pinned corpus, then reports what fraction of those anchors resolve under each candidate.
 *
 *   node scripts/slug-decision-audit.mjs
 *
 * corpus_id sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
 */
import path from 'node:path'
import GithubSlugger from 'github-slugger'
// Re-hashes every loaded file against the manifest's own pinned sha256 instead of trusting a
// stale byte count — see scripts/lib/corpus-hash.mjs and PLAN.md §6.7 finding 4.
import { loadVerifiedCorpus } from './lib/corpus-hash.mjs'

const ROOTS = {
  md: path.join(process.env.HOME, 'Desktop/GitHub/md'),
  knowledge: path.join(process.env.HOME, 'Desktop/GitHub/knowledge'),
  frontmatter: process.cwd(),
}
const { man, files: corpusFiles, drifted } = loadVerifiedCorpus('docs/engine/research/corpus-manifest.json', ROOTS)

// ---- candidates ------------------------------------------------------------------

/** What rehype-slug / GitHub itself produce. The renderer's own answer. */
function ghSlug(text, slugger) {
  return slugger.slug(text)
}

/**
 * Dash-collapsing: same as GitHub but runs of `-` collapse to one and edges are trimmed.
 * This is what most hand-written anchors in prose actually look like.
 */
function collapseSlug(text, slugger) {
  return slugger
    .slug(text)
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * TOLERANT: emit BOTH forms per heading and resolve against either.
 *
 * The two candidates above are not competing theories of one population -- they describe two
 * DIFFERENT populations of author. `#2-personas--use-cases` fails dash-collapsing precisely
 * because its double dash is github-slugger's own output for `&`, faithfully copied from a
 * rendered page. `#claude` fails github-slugger because a human typed it. Picking one algorithm
 * discards one population; a resolver that accepts either serves both, and a WRITER can still
 * emit exactly one canonical form.
 */
const CANDIDATES = {
  'github-slugger (rehype-slug, GitHub)': ghSlug,
  'dash-collapsing': collapseSlug,
}
const TOLERANT = 'tolerant (accept either form)'

// ---- extraction ------------------------------------------------------------------

const HEADING = /^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/gm
const ANCHOR_LINK = /\[(?:[^\]\\]|\\.)*\]\(#([^)\s]+)\)/g
const FENCE = /^(?:```|~~~)/

/** Strip fenced code so a `# comment` inside a bash block is not read as a heading. */
function stripFences(src) {
  const out = []
  let inFence = false
  for (const line of src.split('\n')) {
    if (FENCE.test(line.trim())) {
      inFence = !inFence
      out.push('')
      continue
    }
    out.push(inFence ? '' : line)
  }
  return out.join('\n')
}

let files = 0
let anchorsTotal = 0
const ALL = [...Object.keys(CANDIDATES), 'tolerant (accept either form)']
const perCandidate = Object.fromEntries(ALL.map((k) => [k, { resolved: 0 }]))
const unresolvedExamples = Object.fromEntries(ALL.map((k) => [k, []]))
const perFile = []

for (const { path: relPath, src } of corpusFiles) {
    const body = stripFences(src)
    const headings = []
    HEADING.lastIndex = 0
    let m
    while ((m = HEADING.exec(body)) !== null) headings.push(m[2])
    const anchors = []
    ANCHOR_LINK.lastIndex = 0
    while ((m = ANCHOR_LINK.exec(body)) !== null) anchors.push(decodeURIComponent(m[1]).toLowerCase())
    if (anchors.length === 0) continue
    files++
    anchorsTotal += anchors.length

    {
      const slugger = new GithubSlugger()
      const both = new Set()
      for (const h of headings) {
        const g = ghSlug(h, slugger)
        both.add(g)
        both.add(g.replace(/-{2,}/g, '-').replace(/^-+|-+$/g, ''))
      }
      for (const a of anchors) {
        if (both.has(a)) perCandidate[TOLERANT].resolved++
        else if (unresolvedExamples[TOLERANT].length < 6)
          unresolvedExamples[TOLERANT].push(`${relPath} -> #${a}`)
      }
      perFile.push({ f: relPath, n: anchors.length })
    }
    for (const [name, fn] of Object.entries(CANDIDATES)) {
      // a fresh slugger per document: GitHub de-duplicates within a page, not across
      const slugger = new GithubSlugger()
      const produced = new Set(headings.map((h) => fn(h, slugger)))
      for (const a of anchors) {
        if (produced.has(a)) perCandidate[name].resolved++
        else if (unresolvedExamples[name].length < 5)
          unresolvedExamples[name].push(`${relPath} → #${a}`)
      }
    }
}

console.log(`corpus_id  ${man.corpus_id}${drifted.length ? '  (' + drifted.length + ' file(s) drifted from pin — tested against live content)' : '  (verified: every file matches its pinned sha256)'}`)
console.log(`files carrying at least one intra-document anchor   ${files}`)
console.log(`intra-document anchor links found                   ${anchorsTotal}\n`)
console.log(`  ${'algorithm'.padEnd(38)} ${'resolved'.padStart(10)}  ${'rate'.padStart(8)}`)
console.log(`  ${'-'.repeat(60)}`)
const rates = {}
for (const [name, s] of Object.entries(perCandidate)) {
  const rate = anchorsTotal ? (s.resolved / anchorsTotal) * 100 : 0
  rates[name] = rate
  console.log(`  ${name.padEnd(38)} ${String(s.resolved).padStart(10)}  ${rate.toFixed(2).padStart(7)}%`)
}

console.log(`\n  CONCENTRATION -- how much of this sample is one file:`)
perFile.sort((a, b) => b.n - a.n)
for (const r of perFile) console.log(`    ${String(r.n).padStart(4)}  ${(r.n / anchorsTotal * 100).toFixed(1).padStart(5)}%  ${r.f}`)

// Destructuring `[best, worst]` off a sorted array takes the top TWO, not the top and the
// bottom -- it reported a 3.31pt spread between the two best. Take the ends explicitly.
const ranked = Object.entries(rates).sort((a, b) => b[1] - a[1])
const best = ranked[0]
const worst = ranked[ranked.length - 1]
console.log(`\n  spread (best to worst): ${(best[1] - worst[1]).toFixed(2)} percentage points`)
console.log(`  best:  ${best[0]}  ${best[1].toFixed(2)}%`)
console.log(`  worst: ${worst[0]}  ${worst[1].toFixed(2)}%`)

// The headline is worthless without this. One file is most of the sample.
const top = perFile[0]
console.log(`\n  CAVEAT: ${(top.n / anchorsTotal * 100).toFixed(1)}% of these anchors come from a`)
console.log(`  SINGLE file (${top.f}). This measures a handful of`)
console.log(`  authoring habits in ${files} files, not a population. Treat the ranking as a`)
console.log(`  tie-breaker, not as evidence about markdown at large.`)
for (const [name, ex] of Object.entries(unresolvedExamples)) {
  if (ex.length === 0) continue
  console.log(`\n  unresolved under ${name}:`)
  for (const e of ex) console.log(`    ${e}`)
}
