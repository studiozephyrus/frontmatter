// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-prd-dedup',
  description: 'Find genuine cross-section duplication in PRD v2.1 and produce exact removal instructions',
  phases: [
    { title: 'Map', detail: 'build the duplication map across all 61 sections' },
    { title: 'Cut', detail: 'produce exact, verifiable edits' },
  ],
}

const PRD = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/FRONTMATTER-PRD-v2-2026-08-29.md'

const BASE = [
  '',
  'THE DOCUMENT: a 100,076-word, 61-section product requirements document. It is ~95% tables. A previous pass asked agents to "compress to 40%" and they correctly refused, reporting that the content is at its irreducible length and further squeezing would delete findings. THAT IS NOT YOUR TASK. Do not compress prose.',
  '',
  'YOUR TASK IS NARROWER AND CHECKABLE: find places where THE SAME FACT IS STATED MORE THAN ONCE in different sections, and say exactly which occurrence to keep and which to replace with a cross-reference.',
  '',
  'A fact counts as duplicated when the same number, the same measurement, the same decision, the same anti-recommendation or the same competitor finding appears in two or more sections in substantially the same form. Known repeat offenders to check first: the 8,513-file corpus result, the 83% refusal rate, the MDMAX 13-files/3,614-lines counts, the projection law, the three competitor teardowns, the CRDT disqualifications, the R2-has-no-versioning finding, the RBI Rs.15,000 ceiling, the FX correction, the developer-median 5% conversion rate, the 46.4 founder-hours support figure, the "no CI exists" fact, and the unsourced-Obsidian-claim warning.',
  '',
  'FOR EACH DUPLICATION, output a row: FACT | SECTIONS IT APPEARS IN | KEEP IN | REPLACE-WITH (the exact short cross-reference text to substitute, e.g. "see §7.1") | WORDS SAVED (estimate).',
  '',
  'RULES:',
  '- The canonical home is the section where the fact is FIRST explained in depth, not merely first mentioned.',
  '- Never propose removing the LAST remaining statement of a fact. Every fact must survive somewhere in full.',
  '- A fact restated in the four-page digest at the top of the document is NOT a duplication — the digest is deliberately redundant. Ignore it entirely.',
  '- A number repeated inside a table where it is the subject of that row is NOT duplication. Only flag genuine restatement.',
  '- If two sections state the same fact but for DIFFERENT purposes and both need it locally, say KEEP BOTH and explain in five words.',
  '',
  'Also report, separately: any section that could be MERGED into another because it is substantially the same subject, and any table with a column whose value is nearly constant across all rows (that column should become a sentence above the table).',
  '',
  'HARD CONSTRAINTS: read-only. No file writes, no commits, no mutating commands.',
  'EMIT EARLY: full output as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL OUTPUT.',
  'Output dense markdown tables only. No preamble.',
].join('\n')

phase('Map')

const RANGES = [[0, 15], [16, 31], [32, 45], [46, 60]]
const maps = await parallel(RANGES.map(([lo, hi]) => () => agent(
  'Read ' + PRD + '. Focus on sections §' + lo + ' through §' + hi + ', but you MUST also skim the whole document so you can tell whether a fact in your range is stated elsewhere outside it.\n'
  + BASE, { label: `map-${lo}-${hi}`, phase: 'Map' })))

phase('Cut')

const cut = await agent(
  'Read ' + PRD + ' in full.\n\n'
  + 'Four analysts have produced duplication maps for sections 0-15, 16-31, 32-45 and 46-60. Their findings:\n\n'
  + maps.map((m, i) => `--- ANALYST ${i + 1} (sections ${RANGES[i][0]}-${RANGES[i][1]}) ---\n${m}`).join('\n\n')
  + '\n\nYour job: consolidate these into ONE deduplicated, conflict-free removal plan, then estimate the total saving honestly.\n\n'
  + 'Resolve disagreements: if two analysts propose different canonical homes for the same fact, pick one and say why in five words.\n'
  + 'Discard any proposal that would leave a fact stated nowhere in full.\n'
  + 'Discard any proposal targeting the four-page digest.\n\n'
  + 'Output, in this order:\n'
  + '1. A table: FACT | KEEP IN §| REMOVE FROM §| REPLACEMENT TEXT | WORDS SAVED.\n'
  + '2. A table of proposed section MERGES, with the merged heading and why.\n'
  + '3. A table of near-constant table columns to collapse into a sentence, naming the section and table.\n'
  + '4. An honest TOTAL estimated word saving, and what percentage of 100,076 that is.\n'
  + '5. A short list of things you considered and REJECTED as not genuine duplication, so the reader can see the line you drew.\n\n'
  + 'Be conservative. A false positive here deletes a finding from a document that must not lose findings.'
  + BASE, { label: 'consolidate', phase: 'Cut' })

return { maps: RANGES.map((r, i) => ({ range: r.join('-'), text: maps[i] })), plan: cut }
