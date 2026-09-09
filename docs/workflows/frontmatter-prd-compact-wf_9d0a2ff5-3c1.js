// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-prd-compact',
  description: 'Compress PRD v2.0 to ~40% while preserving every distinct finding',
  phases: [{ title: 'Compress', detail: '7 agents, disjoint section ranges' }],
}

const PRD = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/FRONTMATTER-PRD-v2-2026-08-29.md'

const RULES = [
  '',
  'THIS IS COMPRESSION, NOT SUMMARISATION. The difference matters and I will check it:',
  '- Summarisation drops facts. Compression drops WORDS and keeps every fact.',
  '- EVERY distinct number, date, price, version, package name, star/download count, source, decision, recommendation, anti-recommendation, falsifier and evidence tag MUST survive verbatim.',
  '- If you are unsure whether something is a distinct finding, KEEP IT.',
  '',
  'WHAT TO CUT — in this order:',
  '1. Repetition ACROSS sections. If a fact appears in an earlier section, replace it with a cross-reference like "(§7.1)" instead of restating. The corpus numbers, the 83% refusal rate, the MDMAX file counts and the projection law are each stated many times — state each ONCE where it belongs and cross-reference after.',
  '2. Restated context. Agents each re-established the product framing. Delete every re-establishment.',
  '3. Verbose table cells. A cell should be at most ~12 words. "This is important because X might happen and therefore we should Y" becomes "X -> Y".',
  '4. Columns that do not earn their width. If a column is nearly the same for every row, delete it and state the constant once above the table.',
  '5. Sub-section headings that split fewer than ~4 rows. Merge them up.',
  '6. Prose paragraphs. Maximum TWO sentences anywhere, and only where a mechanism genuinely needs explaining. Everything else becomes a table row or a bullet.',
  '7. Hedging and connective tissue: "it is worth noting", "importantly", "as discussed above".',
  '',
  'WHAT TO KEEP, always:',
  '- Every H2 section heading with its EXACT existing number and title. Do not renumber. Do not drop a section.',
  '- The single bolded load-bearing sentence per section, if one exists.',
  '- All mermaid diagram blocks, unchanged.',
  '- Every evidence tag on the claim it belongs to.',
  '- Every anti-recommendation and every "what would falsify this".',
  '',
  'TARGET: 40% of the input word count for your range. If a section is already dense (mostly tight table rows), leave it near its original length and say so rather than damaging it. Report your before/after word count per section at the very end as a small table.',
  '',
  'FORMAT: return the compressed sections, in order, starting with the first ## heading. No preamble, no commentary except the final word-count table.',
  '',
  'HARD CONSTRAINTS: read-only. No file writes, no commits.',
  'EMIT EARLY: full output as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL OUTPUT.',
].join('\n')

const job = (lo, hi) =>
  'Read ' + PRD + ' and extract sections §' + lo + ' through §' + hi + ' inclusive (they are H2 headings of the form "## N. Title").\n\n'
  + 'Compress those sections and return them.' + RULES

phase('Compress')

const RANGES = [[0, 8], [9, 15], [16, 22], [23, 31], [32, 39], [40, 49], [50, 60]]
const out = await parallel(RANGES.map(([lo, hi]) => () =>
  agent(job(lo, hi), { label: `c-${lo}-${hi}`, phase: 'Compress' })))

return RANGES.map(([lo, hi], i) => ({ range: `${lo}-${hi}`, text: out[i] }))
