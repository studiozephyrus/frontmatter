// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-decisions-v2',
  description: 'Rewrite all 15 areas of the frontmatter decision set into the v2 card shape with diagrams',
  phases: [
    { title: 'Rewrite', detail: 'one agent per area: merge, rewrite, add a diagram to every card' },
    { title: 'Connect', detail: 'cross-area duplicate detection and linking' },
  ],
}

const A = (typeof args === 'string') ? JSON.parse(args) : (args || {})
const SCRATCH = A.scratch
const AREAS = A.areas || []
const BRIEF = A.brief

if (!SCRATCH || !AREAS.length || !BRIEF) {
  log('missing args: need {scratch, areas:[{cat,slug,file,n}], brief}')
}

const COMMON = `
You are rewriting ONE area of the frontmatter decision set for Studio Zephyrus.

READ THESE FIRST, in this order, in full:
1. ${SCRATCH}/CONTRACT.md   — the card shape, the voice rules, the merge rules, the ten
   diagram primitives and their limits. Every field is specified. Follow it exactly.
2. ${BRIEF}                 — what nine research lenses found in the last few hours, and
   what I personally verified against live sources. Several findings CHANGE the answers
   to existing questions. Where a card's facts are now out of date, fix the card.
3. Your area's current questions — the JSON file named below.

Then read what you need of the plan itself. Start with docs/PRODUCT-BRIEF.md (the current
plan, v15) and docs/GAPS-2026-09-08.md (the gap register and the adversarial round).
Go deeper into docs/ENGINE.md, docs/PRODUCT.md, docs/BUSINESS.md, docs/CRITIQUE.md,
docs/REFERENCES.md, docs/THESIS.md or docs/FRONTMATTER-PRD-v2-2026-08-29.md only where your
area needs it. The repo root is /Users/sagnikmitra/Desktop/GitHub/frontmatter.

HARD RULES, in priority order:

1. **Never fabricate a citation.** Every "docs/FILE.md:NNN" you write must be checked with
   \`sed -n 'NNNp' docs/FILE.md\` before you write it. If you cannot verify a line number,
   cite the file with no line number. A fabricated citation is the worst failure available
   to you here, and it is checked mechanically afterwards.
2. **Never invent a number.** Every figure in a card or a diagram must come from the corpus,
   from the research briefing, or from a source you opened. If you have no number, choose a
   diagram kind that needs none (flow, compare, screen, ba, arch).
3. **Every card gets a diagram**, and it must explain the decision rather than decorate it.
4. **Merge aggressively but not destructively.** Expect to reduce your area by 15–35%.
5. **Voice.** Short. Plain. British spelling. No marketing verbs, no LLM cadence, no
   "not just X but Y". Assume the reader wrote the source material and will notice padding.

WRITE YOUR OUTPUT TO A FILE. Use the Write tool to write valid JSON to the exact path given
below. Do not print the JSON into your reply — the file is the deliverable.

Then return a SHORT structured summary via the schema. The summary is not the work.
`

const SUMMARY = {
  type: 'object',
  additionalProperties: false,
  required: ['cat', 'written_to', 'count_before', 'count_after', 'merged', 'dropped', 'added', 'facts_changed', 'diagram_kinds', 'notes'],
  properties: {
    cat: { type: 'string' },
    written_to: { type: 'string' },
    count_before: { type: 'number' },
    count_after: { type: 'number' },
    merged: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['kept', 'absorbed', 'why'],
        properties: { kept: { type: 'string' }, absorbed: { type: 'array', items: { type: 'string' } }, why: { type: 'string' } },
      },
    },
    dropped: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'why'],
        properties: { id: { type: 'string' }, why: { type: 'string' } },
      },
    },
    added: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'q', 'why_new'],
        properties: { id: { type: 'string' }, q: { type: 'string' }, why_new: { type: 'string' } },
      },
    },
    facts_changed: {
      type: 'array',
      description: 'Cards whose facts the new research invalidated, and what changed.',
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'what_changed'],
        properties: { id: { type: 'string' }, what_changed: { type: 'string' } },
      },
    },
    diagram_kinds: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

phase('Rewrite')
const done = (await parallel(AREAS.map((a) => () =>
  agent(`${COMMON}

## YOUR AREA: ${a.cat}

Current questions (${a.n} of them): ${a.file}
Write your rewritten JSON to: ${SCRATCH}/v2/${a.slug}.json

The file must contain exactly:
{"cat": "${a.cat}", "questions": [ ...cards... ]}

${a.hint || ''}`,
    { label: `area:${a.slug}`, phase: 'Rewrite', schema: SUMMARY, effort: 'high' })
))).filter(Boolean)

log(`${done.length}/${AREAS.length} areas written · ${done.reduce((s, d) => s + d.count_before, 0)} cards in, ${done.reduce((s, d) => s + d.count_after, 0)} out · ${done.reduce((s, d) => s + d.merged.length, 0)} merges, ${done.reduce((s, d) => s + d.dropped.length, 0)} drops, ${done.reduce((s, d) => s + d.added.length, 0)} added`)

phase('Connect')
const LINKS = {
  type: 'object',
  additionalProperties: false,
  required: ['cross_area_duplicates', 'link_edges', 'orphans', 'notes'],
  properties: {
    cross_area_duplicates: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['ids', 'why', 'keep'],
        properties: { ids: { type: 'array', items: { type: 'string' } }, why: { type: 'string' }, keep: { type: 'string' } },
      },
    },
    link_edges: {
      type: 'array',
      description: 'Pairs that must be decided together but are NOT duplicates.',
      items: {
        type: 'object', additionalProperties: false,
        required: ['from', 'to', 'why'],
        properties: { from: { type: 'string' }, to: { type: 'string' }, why: { type: 'string' } },
      },
    },
    orphans: { type: 'array', items: { type: 'string' }, description: 'Cards no other card links to and which link to nothing.' },
    notes: { type: 'string' },
  },
}

const connect = await agent(`Fifteen agents each rewrote one area of the frontmatter decision set. They could not
see each other's work, so cross-area duplication and cross-area dependency are both
unhandled. That is your job.

Read every file in ${SCRATCH}/v2/*.json. For each card you only need: id, cat, q, lede,
options[].label, rec.

Return three things:

1. **cross_area_duplicates** — sets of ids in DIFFERENT areas that are the same decision.
   Two cards are the same decision when answering one settles the other. Say which to keep
   (prefer the area where the decision is actually owned: an engine mechanism belongs in
   Engine & technical even if Features asks about it too). Be strict — near-neighbours that
   have genuinely different option sets are NOT duplicates.

2. **link_edges** — pairs that must be taken together but are not duplicates. These become
   the "Decide alongside" chips. Aim for real dependency, not topical similarity. A good
   edge is one where answering A changes which option is right in B. Cap at 60 edges; give
   the strongest.

3. **orphans** — cards that link to nothing and that nothing links to. These are often
   either genuinely standalone or quietly irrelevant; flag them so a human can look.

Do not edit any file. Return the analysis only.`,
  { label: 'cross-area-connect', phase: 'Connect', schema: LINKS, effort: 'high' })

return {
  areas: done.length,
  before: done.reduce((s, d) => s + d.count_before, 0),
  after: done.reduce((s, d) => s + d.count_after, 0),
  per_area: done,
  connect,
}
