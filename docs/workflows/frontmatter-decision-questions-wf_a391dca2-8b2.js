// SPAWN-GATE: q1=y q2=y q3=y  (the founder asked for 200-400 decision questions sourced from two weeks of research across 30 checklist areas; each area needs its own pass over a different slice of a 235-file corpus)
export const meta = {
  name: 'frontmatter-decision-questions',
  description: 'Extract 200-400 founder decision questions for frontmatter from two weeks of research, one agent per checklist area, in the tred decisions schema',
  phases: [
    { title: 'Extract', detail: 'one agent per checklist area, reading the local corpus' },
    { title: 'Audit', detail: 'a second agent checks every citation and de-duplicates' },
  ],
}

const REPO = '/Users/sagnikmitra/Desktop/GitHub/frontmatter'
const SOURCES = `
THE CORPUS — all local, read-only, in ${REPO}:
  docs/PRODUCT-BRIEF.md .......... the current plan, v15 (23 sections, the decisions live here)
  docs/GAPS-2026-09-08.md ........ the gap register + round-2 results (what is unsolid, what closed)
  docs/WEEK0-DECISIONS-2026-09-08.md  measurement decision + web byte path drafts
  docs/FRONTMATTER-RECORD.md ..... the full 325pp record (137 sections)
  docs/DECIDE.md, BRIEF.md, CRITIQUE.md, ENGINE.md, BUSINESS.md, PRODUCT.md, DEV-PLAN.md,
  docs/THESIS.md, VERIFICATION.md, MAP.md, REFERENCES.md
  docs/FRONTMATTER-PRD-v2-2026-08-29.md  (61 sections, 99k words)
  docs/research/**  ............... 235 agent reports across rounds r7-r26
  src/** .......................... the actual code (verify claims against it)
Use: rg/grep, sed -n, cat. Read widely. Cite file + line for every claim.
`

const SCHEMA_DOC = `
OUTPUT SCHEMA — each question is a JS object in the tred decisions format. Fields:
  id       "M1", "M2"… use YOUR AREA PREFIX (given below) + an integer
  cat      the area name (exactly as given)
  sub      a short grouping within the area, 1-3 words
  weight   "critical" | "high" | "medium"
  q        the question, ending in "?" — a real decision, not a task
  lede     one sentence on why this decision matters now
  now      what the plan/code says or does TODAY, with a file+line citation
  why      how it got that way (history, which round decided it)
  problem  what is wrong or unresolved — the tension that forces a decision
  evidence array of 1-3 blocks, each ONE of:
             {type:"stat", title, items:[[label, value, note?]…]}
             {type:"table", title, cols:[…], rows:[[…]…]}
             {type:"bars", title, note, data:[[label, number]…], unit, threshold?, thresholdLabel?}
           EVERY number must come from the corpus and carry its source in the label or note.
  options  3-4 options: {k:"a"|"b"|"c"|"d", label, impact} — impact states the consequence, honestly
  rec      the key of the recommended option
  recCase  2-4 sentences arguing for it, and naming what would change the answer
RULES:
- A question must be DECIDABLE by a founder, not a research task. "Do we ship X or Y?" not "Research X."
- Never invent a number. If the corpus does not have it, say "unmeasured" in the evidence and make the
  question about whether to measure it before deciding.
- Prefer questions where the corpus already contains the tension (two documents disagreeing, a refuted
  claim, an unbuilt promise, an unweighed alternative).
- Write in plain, direct English. No marketing words. Short sentences.
- Do NOT run any destructive command, no git writes, no network. Read-only over the local corpus.
`

const OUT_SCHEMA = {
  type: 'object', required: ['questions'],
  properties: {
    questions: { type: 'array', items: {
      type: 'object',
      required: ['id','cat','sub','weight','q','lede','now','why','problem','evidence','options','rec','recCase'],
      properties: {
        id:{type:'string'}, cat:{type:'string'}, sub:{type:'string'}, weight:{type:'string'},
        q:{type:'string'}, lede:{type:'string'}, now:{type:'string'}, why:{type:'string'}, problem:{type:'string'},
        evidence:{type:'array', items:{type:'object', properties:{
          type:{type:'string'}, title:{type:'string'}, note:{type:'string'}, unit:{type:'string'},
          threshold:{type:'number'}, thresholdLabel:{type:'string'},
          items:{type:'array', items:{type:'array', items:{type:'string'}}},
          cols:{type:'array', items:{type:'string'}},
          rows:{type:'array', items:{type:'array', items:{type:'string'}}},
          data:{type:'array', items:{type:'array'}} }}},
        options:{type:'array', items:{type:'object', required:['k','label','impact'],
          properties:{k:{type:'string'}, label:{type:'string'}, impact:{type:'string'}}}},
        rec:{type:'string'}, recCase:{type:'string'},
        sources:{type:'array', items:{type:'string'}, description:'file:line citations backing this question'}
      } } } }
}

const AREAS = [
  { key:'product',    prefix:'P',  cat:'Product & definition', n:18, brief:`The product definition itself. §1 of the plan was attacked on 2026-09-08 and did not survive as written — read that section and docs/GAPS-2026-09-08.md round 2 in full. Questions on: what the one-sentence definition is now; whether review state stays the headline, narrows to working-tree-with-no-PR, or is demoted; the four abandoned headlines (byte-exactness, authorship, answer-in-place, generator) and whether any should return; what "not in the product" must contain; the demo; the projection law and its costs; the seven-concept surface budget; what the product refuses and what each refusal costs.` },
  { key:'features',   prefix:'F',  cat:'Features', n:26, brief:`Exhibit 1 (F1-F13) plus everything cut or deferred. One question per feature on scope, stage and evidence class, plus: which of F5/F6/F7 survive without founder test notes; whether answer-in-place stays now that the Q:→A: half is cut; whether attribution is promoted given Google SELLS span-level authorship; the repo docs scan's differentiators after Zensical Studio shipped link repair; comments as a sidecar (v1.5); bookmarks (cut); share (open); export (already built, unverified); sync; MCP; the hide-all-AI switch; the two AI verbs.` },
  { key:'flow',       prefix:'FL', cat:'Flow & interaction', n:12, brief:`How a user moves through the product. The six flows in the record, onboarding minute-by-minute, the first five minutes, review fatigue on a 40-hunk change, what happens when someone returns after a week, the teammate handoff, conflict, refusal UX (inline note vs modal), keyboard model (j/k/a/r/s), what the counter counts, and the intuitivity tests including the five-second tint test.` },
  { key:'engine',     prefix:'E',  cat:'Engine & technical', n:26, brief:`docs/ENGINE.md and src/modules/mdmax. NF-1..NF-4; the 83% refusal rate and that the corpus is seven Obsidian vaults with one wiki at 77%; the OffsetMap D1 defect at 512-multiples; the certificate's modal-consensus bug (3/2/2 splits report PASS; GFM task lists mark correct engines MUTATE); the CLI that cannot start and is in none of the 26 npm scripts; ENGINE.md's own kill condition (99.8%, DESTROY zero times in 10,176 blocks, "the honest product is a 200-line linter"); non-locality as an undeclared refusal; the 19 constructs with 6 marked "invented"; incremental parsing; the byte↔UTF-16 seam; the undeclared 'entities' dependency; 2 engine call sites; CI absent; the byte budget echo.` },
  { key:'access',     prefix:'AC', cat:'Access, offline & install', n:14, brief:`§3 of the plan and docs/WEEK0-DECISIONS. Web vs desktop; File System Access API on Chrome/Edge only; api.github.com CORS; the web byte path draft (browser-side only, server FTS dropped); what the user downloads; Tauri identity still ai.sgnk.md; notarisation $99 and Windows signing $150-400 with a hardware token; the auto-updater before first release; offline capability per feature; what someone gets if they never download; local model deferred and why (PhantomFill fabrication).` },
  { key:'formfactor', prefix:'FF', cat:'Form factor & surfaces', n:12, brief:`Decision 6 in the plan. Standalone editor vs VS Code extension vs both from one core. The measured facts: an extension CAN write byte-exactly (94/94 and 156/156 bytes, two harnesses, VS Code 1.135.0); no view-zone API so Live mode is standalone-only; the raw-write data-loss path when an agent writes while a human types is UNTESTED; VS Code gives the model picker and MCP free; the review-state niche there is empty at ceiling 400 installs; the editor shell is a FORK (41 of 43 files byte-identical to sgnk-md, 25 diverged). Also: Obsidian plugin (cut), Chrome extension (cut), mobile (not v1).` },
  { key:'market',     prefix:'MK', cat:'Market & competition', n:22, brief:`Exhibit 3 and the two verification rounds. spec-kit (11,072 repos, ~1,660 active), superpowers (75-85k repos, 22-30k active), Kiro, plan mode; Claude Code 2.1.70 plan-as-markdown and its persisted unread state; the 13 markdown-review extensions at 1,217 installs total; GitHub Viewed state free and per-person; Google Docs 2015 "see new changes" free and span-level authorship SOLD; Reviewable and Graphite free tiers; Obsidian/Notion/Cursor/Zed; mdown.ai; Zensical Studio; the Obsidian forum vote (0 likes for review state vs 501 for the rendering bug); the three withdrawn numbers (62,976 / 496,000 stars / "uncopyable").` },
  { key:'pricing',    prefix:'PR', cat:'Pricing & tiers', n:18, brief:`§11. Free/Pro/Max; the inversion applied in v15 (Pro = retention + enforcement); the retained splice journal at 90 days; gates as a required GitHub Action; the $4 GitHub anchor being a first-12-months price with no published steady state; Obsidian Sync $4 and its 1mo→12mo retention step; HackMD $5; Confluence $6.70; the sub-$50 ARPA retention band (60-70% top quartile, 23% AI-native); 114 seats withdrawn; the monthly nut ₹1.09L; hosted AI metered; refunds; what happens on downgrade; whether ANY tier is sellable before a human is asked.` },
  { key:'gtm',        prefix:'G',  cat:'Go-to-market & channels', n:20, brief:`§12. The three headline arms; the Obsidian plugin channel CUT (depth-1 tree, 115-install analogue vs a 200 kill line); superpowers first and alone (only the architectural path writes a document); spec-kit reframed on agent self-certification (354 of 355 boxes ticked); Kiro dropped; plan mode demoted; Chrome extension cut; Show HN (Zed 43, Cursor 9); Product Hunt; published research as a channel; exported pages with a mark (not a channel until a deploy count exists); whether maintainer PRs are even acceptable (untested, outbound); positioning by refusals; what we never say.` },
  { key:'business',   prefix:'B',  cat:'Business & operations', n:16, brief:`docs/BUSINESS.md, §9 and §22. One person or two (80/80 and 416/416 commits, single author) — the load-bearing input to every schedule; velocity 1.21 eng-days/week measured, 7.0 required, both "ten weeks" and "2.5x" withdrawn; the fork tax; the services engagement funnel from the docs scan; 78 hours/month consulting cap; support at ~90 founder-hours at 10k users; the free tier with no SLA; how users are told anything (the notice ledger); email only on an obligation; what we refuse to measure.` },
  { key:'legal',      prefix:'L',  cat:'Legal, privacy & data', n:16, brief:`The ten operating rules added in v15, and the contradiction under them. DPDP §§3-17 and penalties commence 2027-05-13; the live regime is IT Act §43A + SPDI Rules 2011; CERT-In's SIX-HOUR breach clock binds today with no size floor; 180-day log residency; the Annexure II Point of Contact filing missing everywhere; §8(5)'s ₹250 crore ceiling; grievance officer within one month; SPDI Rule 7 cross-border making processor agreements due TODAY; GDPR Art 3(2) and the Art 27 representative; GST RCM with no floor. And decision 7: firestore.rules designs 900KB note bodies with unauthenticated public reads while the plan says zero document bytes — three committed files disagree, and every legal rule depends on the answer.` },
  { key:'design',     prefix:'D',  cat:'Design, UI & attention', n:16, brief:`§16 and the nine prototype screens. The tint (no border, no icon, ignorable at rest) and the five-second test; the hover card and what it says when no prompt exists; the review panel and the counter; the collapsed AI panel and the hide-all switch; the launcher's unreviewed bars; S13's "what we read" rail; the F-pattern placement rules; Tang et al. 2024 (provenance awareness improves validation, raises workload); the design system (Google Sans, one accent, square corners, inline SVG icons only); the shipped globals.css being a sibling project's; the Mobbin benchmark still unrun; accessibility (WCAG 2.2 AA, body-faint failing at 1.984:1) and CJK.` },
  { key:'plan',       prefix:'PL', cat:'Plan, scope & sequencing', n:14, brief:`§8, §9, §14. MVP-0/1/2 contents; the fix-first table (now 11 rows) and its order; what must exist before a stranger touches it (BYO key, structured output, CI); the exit test "6 of 10 keep it" and the measurement decision that makes it observable; the ninety days; the two-week tests and how their arms changed when the headline failed; the kill conditions; what gets cut if the tests fail; whether to build at all before decision 1 is answered.` },
  { key:'research',   prefix:'R',  cat:'Research & evidence', n:14, brief:`docs/GAPS-2026-09-08.md and VERIFICATION.md. The 15 still-open items after round 2 (out-of-band write anchor test; the extension raw-write data-loss path; does export run; Cursor/forks honouring the VS Code model APIs; the superpowers architectural-path fraction; Kiro persistence; Zensical trajectory; sgnk-md's users; Mobbin; performance vs Obsidian; outside security review; the FRONTMATTER EU word mark reported-not-reproduced); zero user interviews across the whole programme; the three withdrawn numbers; the evidence-class labels; whether desk research should continue at all or stop until humans are asked.` },
  { key:'naming',     prefix:'N',  cat:'Name & identity', n:8, brief:`The name collision. Front Matter CMS at 82,265 installs, alive (v10.12.0, 2026-08-21), 5.0 from 20 ratings; "Frontmatter Studio" taken 2026-09-07; the @frontmatter npm scope belongs to the incumbent; gray-matter + front-matter = 50,830,320 monthly npm downloads so the word is a FIELD NAME; .com/.io/.tech/.codes all live businesses, only .sh unregistered; a reported EU/UK word mark FRONTMATTER (EUTM 018221807) that could not be reproduced from five blocked registries. Questions on: keep/rename/scope; who decides; when it becomes expensive; whether to split a format spec name from a product name.` },
]

phase('Extract')
const results = await pipeline(
  AREAS,
  (a) => agent(`You are extracting founder DECISION QUESTIONS for the frontmatter product from two weeks of research, so they can be answered one by one on a decisions website.

YOUR AREA: ${a.cat}   (id prefix "${a.prefix}", target ${a.n} questions — go over if the material supports it, never pad)

WHAT THIS AREA COVERS:
${a.brief}

${SOURCES}
${SCHEMA_DOC}

Read the corpus for your area FIRST — widely, not just the plan. Then write ${a.n}+ questions. Every question must be one a founder can answer in a meeting, and every number must be traceable. Set weight honestly: "critical" only where a wrong answer costs the product or the company.`,
    { label: `extract:${a.key}`, phase: 'Extract', schema: OUT_SCHEMA }),
  (res, a) => {
    if (!res || !res.questions?.length) return null
    return agent(`You are auditing decision questions before they go on a website the founders will use to decide.

AREA: ${a.cat}
QUESTIONS:
${JSON.stringify(res.questions, null, 2)}

For EACH question, check against the corpus at ${REPO}:
1. Is every number real and correctly quoted? Open the cited file and line. Fix or remove any that is not.
2. Is it a DECISION (answerable in a meeting) rather than a research task? Rewrite or drop it if not.
3. Are the options genuinely distinct, and is each impact honest about the downside?
4. Does the recommendation follow from the evidence shown, and does recCase name what would change it?
5. Remove duplicates and near-duplicates.
Return the CORRECTED full set in the same schema. Keep everything that survives; do not shrink the set to be safe. Read-only: no writes, no git, no network.`,
      { label: `audit:${a.key}`, phase: 'Audit', schema: OUT_SCHEMA })
      .then(v => ({ area: a.key, cat: a.cat, prefix: a.prefix, questions: (v && v.questions?.length ? v.questions : res.questions) }))
  }
)

const areas = results.filter(Boolean)
const total = areas.reduce((n, a) => n + a.questions.length, 0)
log(`areas ${areas.length}/${AREAS.length} · questions ${total}`)
return { areas, total }
