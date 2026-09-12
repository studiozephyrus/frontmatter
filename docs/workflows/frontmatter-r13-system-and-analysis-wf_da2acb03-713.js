// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r13-system-and-analysis',
  description: 'Unified system view, AIOS deep integration, personas/JTBD, positioning, markdown thesis, remaining-unknowns register',
  phases: [{ title: 'Synthesis', detail: 'six sections that make it a product analysis, not a topic list' }],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const PRD = FM + 'docs/FRONTMATTER-PRD-v2-2026-08-29.md'
const R8 = FM + 'docs/research/agent-reports-2026-08-29-r8to10/'
const R11 = FM + 'docs/research/agent-reports-2026-08-29-r11/'

const HOUSE = [
  '',
  'YOU ARE WRITING A FINISHED SECTION OF A PRODUCT REQUIREMENTS DOCUMENT that will be printed and read by a founder and his team. Not a research summary.',
  '',
  'HOUSE STYLE, follow exactly:',
  '- Open with the exact H2 heading you are given. Use H3 subsections.',
  '- Table-first. Bullets second. Prose only where a mechanism needs explaining, max 3 sentences.',
  '- NO preamble, NO "this section covers", NO conclusion, NO commentary about your own process.',
  '- Evidence tags on factual claims: [measured] executed here, [fetched] primary source opened, [SS] search summary which may NOT be published as fact, [derived] with arithmetic shown, [inference] reasoning.',
  '- Preserve exact numbers, names, versions, dates. Never invent, never round.',
  '- Every recommendation carries its anti-recommendation. Decisions carry what would falsify them.',
  '- Bold at most ONE load-bearing sentence per section.',
  '- Include at least one mermaid diagram where a structure or flow needs one. Keep diagrams under 12 nodes so they stay legible in print.',
  '',
  'PRODUCT CONTEXT (stay consistent; do not re-explain it in your output):',
  'frontmatter is a markdown editor with a deliberately SIMPLE surface and a deep engine. THE PROJECTION LAW: the file is the only source of truth; every view (board, calendar, decision card, published site, agent context) is a deterministic, reversible projection owning no state. The engine, MDMAX, does byte-preserving splice edits — locate the byte range, replace only those bytes, REFUSE rather than guess — plus cross-engine degradation certification over 7 markdown engines. Measured: 8,513 third-party files with 0 corruption and 0 throws; but 83 percent publish-refusals today from one YAML defect. Solo founder, India, selling globally.',
  'SETTLED, do not re-litigate: no new markdown format; no tree-of-record; no plugin marketplace; no arbitrary client-side code execution; not a Notion-style project-management tool; sync is git-merge plus a splice journal plus compare-and-swap, never a CRDT; the render carrier is a blockquote callout for prose and a fenced code block for opaque data.',
  'AIOS is the existing markdown-native orchestrator on the founder machine: 124 SKILL.md automations, an 892-line self-amending constitution, 5,014 trace rows, 24,539 complexity-gate decisions, a routing bandit, eval and calibration loops, 69 gate scripts, 149 bin tools.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands.',
  'EMIT EARLY: full section text as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL TEXT.',
  '',
  'Your entire final message IS the section text. Start with the H2 heading.',
].join('\n')

phase('Synthesis')

const JOBS = [
  ['s1-unified-system',
   'Write "## 61. The system as one thing".\n\n'
   + 'Every other section describes a layer. This one describes how they COMPOSE, because a reader who has read section 7 (architecture), 8 (markdown substrate), 9 (rendering), 11 (AI layer), 15 (AIOS) and 31 (sync) still cannot draw the whole system on one page.\n\n'
   + 'Read for grounding: ' + PRD + ' sections 5, 7, 8, 9, 11, 15, 31.\n\n'
   + 'Produce: (1) ONE mermaid diagram of the complete system — the file at the centre, the engine around it, the projections above, the agent surface beside, the sync and publish edges. Under 12 nodes. (2) A layer contract table: LAYER | OWNS | MUST NOT | TALKS TO | FAILS BY. (3) The three end-to-end traces that prove the composition works: follow one byte through a human edit, an agent edit via land(), and a kanban drag — each a numbered step list naming the actual module or file at each hop. (4) The seams where one layer hands to the next, and what is asserted at each seam. (5) What breaks if a layer is removed. (6) The one sentence that explains the whole system in 20 seconds.'],

  ['s2-aios-deep-integration',
   'Write "## 62. AIOS inside the product — orchestration as a user feature".\n\n'
   + 'Section 15 answers which internal assets become features. This answers the harder question: what does it look like when a USER has their own orchestration layer, and where is the line between useful and creepy.\n\n'
   + 'Read: ' + R8 + 'a1-aios-tool-inventory.md, ' + R8 + 'a2-aios-loops-as-product.md, ' + R8 + 'a4-skills-as-automation-format.md, and ' + PRD + ' section 15.\n\n'
   + 'Produce: (1) The user-facing model — what an orchestration layer IS in the user vocabulary, never ours. (2) A mermaid diagram of the user loop: document to agent action to gate to review to trace to next action. (3) Which loops run PER USER, which PER WORKSPACE, which only for us. (4) The progressive-disclosure ladder: what a beginner sees (probably nothing), what appears at week two, what a power user can reach. (5) The trust boundary — exactly what the system may observe, what it may act on unasked, what always needs a human. (6) The anti-section: which AIOS capabilities would be actively harmful shipped to users, and why. (7) What would falsify this whole direction.'],

  ['s3-personas-jtbd',
   'Write "## 63. Who this is for — personas and jobs to be done".\n\n'
   + 'The document has ICPs and segments but no persona or jobs-to-be-done frame, which is the spine of a product analysis.\n\n'
   + 'Read: ' + PRD + ' sections 2, 21, 22, 24, 26, and ' + R11 + 'c4-onboarding-activation.md.\n\n'
   + 'Produce: (1) Four to six named personas, each with: who they are, the tool they use today, the job in job-story form (when ___, I want to ___, so I can ___), the moment of pain, what makes them switch, what makes them leave, and willingness to pay with an evidence tag. Cover at least the solo developer/prosumer, the dev-tool startup team, the agency, the AI-heavy knowledge worker, and one anti-persona we are deliberately NOT for. (2) A table mapping each persona to the sections that serve them. (3) The ONE persona to build v1 for, with the strongest argument against that choice. (4) Switching-cost analysis per persona: what they must give up to move. (5) Anti-recommendations: personas that look attractive and are traps.'],

  ['s4-positioning-messaging',
   'Write "## 64. Positioning, messaging and objections".\n\n'
   + 'Read: ' + PRD + ' sections 3, 5, 19, 21, 26, 27, 52.\n\n'
   + 'Produce: (1) The positioning statement in canonical form: for X who Y, frontmatter is a Z that W, unlike V. (2) A messaging hierarchy — the one-liner, three pillars, the proof point under each, and which pillar leads for which persona. (3) The category question: enter an existing category, rename one, or create one, with evidence and the strongest counter-argument. Note that every Show HN named "markdown editor" becomes a thread of free alternatives. (4) An objection-handling table with the 10 objections a buyer will actually raise, including why not just Obsidian, why not Notion, this is a feature not a product, you are one person, markdown is for developers, and I already have Cursor — each with the honest answer and its evidence. (5) The claims we may NOT make, cross-referencing section 58. (6) What the product name must communicate, given section 52.'],

  ['s5-markdown-thesis',
   'Write "## 65. The markdown thesis — every role the format plays".\n\n'
   + 'Sections 8 and 9 cover the substrate and rendering. This consolidates the THESIS: markdown as document, as schema carrier, as agent contract, as ledger, as an application substrate, and where that stops.\n\n'
   + 'Read: ' + R8 + 'm3-extension-catalogue.md, ' + R8 + 'm5-typed-semantic-markdown.md, ' + R8 + 'm10-render-possibility-space.md, ' + R8 + 'm9-markdown-hard-edges.md, and ' + PRD + ' sections 8, 9.\n\n'
   + 'Produce: (1) The six escalating roles markdown plays here, each with the enabling mechanism and a real example in a fenced block. (2) A mermaid diagram: one file, six roles. (3) The maximisation table — per role: what we exploit, what the ceiling is, and the measured evidence for that ceiling. (4) The hard boundary as a rule a builder can apply: what belongs in the text, in frontmatter, in a sidecar, in a database, and the test that decides. (5) What markdown genuinely CANNOT do, and what we tell users instead of faking it. (6) The strongest argument that this thesis over-reaches, and the answer.'],

  ['s6-remaining-unknowns',
   'Write "## 66. What we still do not know".\n\n'
   + 'This is the pre-print honesty register. A reader about to commit months of work deserves an explicit list of what is unverified.\n\n'
   + 'Read: ' + PRD + ' sections 55, 57, 58, and ' + R11 + 'c1-research-gap-audit.md.\n\n'
   + 'Then MEASURE, do not estimate: count the [SS]-tagged claims in ' + PRD + ' with grep, and sample at least 15 to classify.\n\n'
   + 'Produce: (1) The exact measured count of [SS] claims. (2) A triage table of the LOAD-BEARING ones: CLAIM | SECTION | WHY IT MATTERS | WHAT WOULD CLOSE IT | COST TO CLOSE | RISK IF WRONG, ranked by risk if wrong. (3) The decorative ones that can stay unverified, one line each. (4) Anything nobody has researched at all, if any remains. (5) Things only a human can close: two bot-gated verifications, a visual design pass blocked by a session security gate, professional confirmation on GST and DPDP, and any others. (6) The single most dangerous unverified assumption in the entire document, named, with what it would cost to be wrong. Be blunt; this section protects the reader.'],
]

const out = await parallel(JOBS.map((j) => () => agent(j[1] + HOUSE, { label: j[0], phase: 'Synthesis' })))
return JOBS.map((j, i) => ({ label: j[0], text: out[i] }))
