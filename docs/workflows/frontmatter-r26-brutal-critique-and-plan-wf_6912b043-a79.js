// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r26-brutal-critique-and-plan',
  description: 'Uncompromising critique of every angle, then the plan the evidence actually supports',
  phases: [
    { title: 'Demolition', detail: 'premise, market, competition, features, execution' },
    { title: 'Business', detail: 'economics, D2C, B2B, capacity, and the kill case' },
    { title: 'Reconstruction', detail: 'what to build instead, and the plan' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const REC = FM + 'docs/FRONTMATTER-RECORD.md'
const DEC = FM + 'docs/DECIDE.md'
const R = FM + 'docs/research/agent-reports-2026-08-30/'

const EVIDENCE = [
  '',
  'THE EVIDENCE BASE. Ninety-seven research reports live in ' + R + '. Read the ones relevant to your angle — do not re-research what is already counted. The record is ' + REC + ' (125 sections) and the synthesis is ' + DEC + '.',
  '',
  'THE FINDINGS THAT ALREADY REFUTE THIS PRODUCT. Every one is counted from primary sources. You may not treat any of them as debatable without new evidence:',
  '',
  '1. **Zed already ships our MVP-0 demo, verbatim.** "You can accept or reject each individual change hunk, or the whole set of changes made by the agent." [fetched zed.dev/docs/ai/agent-panel 2026-08-31]. 16 of MVP-0\'s 38 points build a documented, shipped feature of a funded competitor. (`r25-w2`)',
  '2. **Byte-exactness is not a felt need.** 4 complaints in 12,556 HN editor comments; 1 in 3,749 launch comments; the entire vocabulary appears ONCE in 1,000 unbiased Reddit posts (0.1%); "line endings" in 1 of 43,656 GitHub issues; one formatting-caused switch in eleven years. (`r24-v2`, `r25-w1`)',
  '3. **Price is the #1 weekly complaint in our target market — 15.7% of posts.** (`r25-w1`)',
  '4. **We priced an entire editor below what the category leader charges for one feature.** Obsidian: editor free, sync $4/mo. Us: Rs 299 = $3.13. 56 of 60 HN comments about paying Obsidian are about sync. (`r25-w3`)',
  '5. **The context-pack wedge is table stakes.** 89 such products launched on HN in 20 months, median 2 points, 88 of 89 never reached 50. (`r21-s1`)',
  '6. **Decision-record renders are the least-demanded render measurable** — 563 of 143,283,562 Obsidian registry downloads (0.0004%), 3 plugins of 7,079, 0 of 1,600 Reddit posts. (`r21-s6`)',
  '7. **Slop is the fastest-growing complaint: 23.7% of all, +149% in 20 months** — classified WORKFLOW (durable, ours to solve) — and the product does not touch it. (`r21-s1`)',
  '8. **Sync is #1 loved, #3 hated, #1 switching trigger** (1,251 of 43,656 issues) and the record declared it out of scope. (`r24-v2`)',
  '9. **62% of the record\'s own load-bearing claims needed correction** when someone opened a primary source: 13 confirmed, 13 revised, 5 refuted, 3 unverifiable. (`r18-ledger-synthesis`)',
  '10. **The learning loop is not running**: 6,884 routing decisions in 7 days, 1 reward label (0.01%). (`r23-u1`)',
  '11. **2,219,390 words of documentation against 25,407 lines of source** — 87 words per line. [measured]',
  '12. **Zero users, zero revenue, zero paying customers, and no CI.**',
  '',
  'THE EVIDENCE THAT STILL SUPPORTS IT, so the critique is fair rather than merely harsh:',
  '- Cursor staff, 2026-08-28: doubled blank lines and destroyed carriage returns on CRLF files are "a known issue we\'re tracking" on full-file rewrite. The incumbents genuinely have the defect. (`r24-v3`)',
  '- Nested-construct live preview is the most-voted bug in Obsidian history: 501 likes, plus 96+82+50+36+33 on siblings. (`r24-v2`)',
  '- Broken links on rename: 86 likes. A vault-wide refactor with a reviewable diff is a real, asked-for capability. (`r24-v2`)',
  '- The engine is real and tested: 8,513-file pinned corpus, byte-identical verification, 98 test files, 1,575 tests.',
  '- frontmatter IS sgnk-md — 202 of 228 source files byte-identical — so this is not a greenfield bet; it is a rename of something that exists. (`r22-t2`)',
  '',
  'THE CONSTRAINTS: One founder, or two — THE RECORD CONTRADICTS ITSELF and §53 says "One person. This is the binding constraint on everything above." India-based, selling globally. Very small AI budget. 54-78 client hours/month currently fund the whole nut. No outside capital. (`r22-t3`)',
].join('\n')

const HOUSE = [
  '',
  'YOU ARE A BRUTAL, COMPETENT CRITIC — the operator or investor who has seen five hundred of these and tells the founder the truth on the first call rather than the fifth. The founder has explicitly asked to be told what is wrong. Flattery is the failure mode; there is no penalty for harshness and a large one for hedging.',
  '',
  'RULES OF THE CRITIQUE:',
  '- **Attack the strongest version of the idea**, never a strawman. Steelman first in one paragraph, then take it apart.',
  '- **Every criticism must be falsifiable.** Say what evidence would change your mind. A criticism with no falsifier is a preference.',
  '- **Rank by severity: FATAL / SEVERE / SERIOUS / MINOR.** Reserve FATAL for things that end the company. Inflating severity is as dishonest as hiding it.',
  '- **Quantify.** "This will be hard" is worthless. "This needs 63,056 visitors/month forever at 5% churn" is a critique.',
  '- **Name what is GOOD too**, specifically and briefly. A critique that finds nothing good is not credible and will be dismissed.',
  '- **Cite.** Use the evidence base and the reports. Where you need a framework or a benchmark, open a source with curl and date it.',
  '- Do not repeat findings from other angles; reference them by number and move on.',
  '',
  'SOURCES: WebFetch is gate-refused; `curl` is not. `curl -sL --compressed -A "Mozilla/5.0" "<url>" | sed -e \'s/<[^>]*>//g\' | tr -s "\\n" | head -300`. HN via hn.algolia.com/api/v1. arXiv via export.arxiv.org/api/query. Report status codes on refusal.',
  '',
  'STYLE: NO H2 heading, NO section number — you return a CRITIQUE REPORT for synthesis. Open with your single most damaging finding in one sentence. Tables over prose. Evidence tags [fetched] [measured] [derived] [inference] [SS].',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No writes, no commits, no mutating commands.',
  'EMIT EARLY: full report as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL REPORT.',
  'Your entire final message IS the report. Target 3000-4000 words — this is a deep audit, not a summary.',
].join('\n') + EVIDENCE

phase('Demolition')

const DEMO = [
  ['c1-premise',
   'CRITIQUE THE PREMISE ITSELF. Is there a product here, or is there an engine in search of one?\n\n' +
   'The chain of reasoning to test: (a) markdown files are the right substrate → (b) byte-exact editing is the right differentiator → (c) people building software with AI are the right buyer → (d) an editor is the right form factor → (e) a subscription is the right model. **Attack each link separately.** A chain fails at its weakest link and the record has never tested them independently.\n\n' +
   'Then the questions that decide whether to continue at all:\n' +
   '- Is this a **feature, a product, or a company**? Argue all three and pick.\n' +
   '- If byte-exactness is not felt (finding 2) and the demo is already shipped by Zed (finding 1), **what exactly is left that is ours?** Answer concretely; if the honest answer is "the engine, which is a library not a product", say so.\n' +
   '- The founder has spent months and 2.2 million words on this. **Sunk cost is the largest bias in the room.** Name where it shows in the record.\n' +
   '- Is "refuse rather than guess" a principle users want, or an engineering aesthetic the founder finds beautiful? These are different and the record conflates them.\n' +
   '- What would this product have to become for the evidence to support it?'],

  ['c2-market-fit',
   'CRITIQUE MARKET FIT AND POSITIONING. Grade against real frameworks, not vibes.\n\n' +
   'Read `r25-w5` for the frameworks and use them properly: Kano, JTBD, Sean Ellis 40%, the hair-on-fire / hard-fact / future-vision segmentation, and the developer-tool benchmarks it assembled.\n\n' +
   '- **Apply the Sean Ellis test as a thought experiment**: would 40% of users be very disappointed without this? Given finding 2, argue the honest answer.\n' +
   '- **Kano-classify every major feature.** Which are must-be, which performance, which delight, which indifferent? Predict that most are INDIFFERENT and prove or refute it against the evidence.\n' +
   '- **Which segment is on fire?** The record names six personas. Rank them by how badly they hurt, and be willing to say none of them are burning.\n' +
   '- **Positioning**: "byte-exact markdown editor" is a category nobody searches for. What category does this compete in as far as a buyer is concerned, and who owns that category already?\n' +
   '- **The TAM problem**: how many people plausibly exist who (i) build software with AI, (ii) keep markdown in git, (iii) are bothered enough to switch editors, and (iv) will pay? Derive the number and show the arithmetic. If it is small, say how small.'],

  ['c3-competitive',
   'CRITIQUE COMPETITIVE SURVIVAL, in the light of finding 1 — Zed ships our demo already.\n\n' +
   'Read `r25-w2` (the AI-editor teardown) and `r24-v2`, and BUSINESS §88 (the war-game).\n\n' +
   '- **Re-run the competitive position now that the demo is not novel.** What, if anything, is still differentiated? Be specific and be willing to answer "nothing that a user can perceive in the first session".\n' +
   '- **The asymmetry**: Cursor, Zed, GitHub and Anthropic have engineering teams, distribution and capital. We have one or two people. Enumerate what they would have to do to erase us, and how long it would take them. If the answer is "one sprint", that is the finding.\n' +
   '- **Obsidian is the incumbent for the substrate.** It is free, beloved, and has a plugin ecosystem we have refused to build. What happens to us if it ships better markdown-aware AI editing?\n' +
   '- **The "we are more correct" defence** has a poor track record in consumer and prosumer tools. Find real precedents where technically superior tools lost, and say what they had in common.\n' +
   '- Where is the genuine wedge, if one exists? Judge it against the incumbents rather than in isolation.'],

  ['c4-features',
   'AUDIT THE FEATURES ONE BY ONE, brutally, for usability and for whether anyone will use them.\n\n' +
   'Read `PRODUCT.md` §94 (the inventory), §95 (MVP staging), `r24-v1` (table stakes) and `r24-v4` (AI-native editing).\n\n' +
   '- **Score every feature**: who uses it, how often, what it replaces, what it costs to build, and whether its absence is disqualifying. Kill anything that cannot name a user and a frequency.\n' +
   '- **The table-stakes gap is the real story.** `r24-v1` measured what a credible editor must have against what we have. Quantify how far from credible we are and what it costs to close. A reviewer who cannot find quick-switch stops writing the review.\n' +
   '- **Attack the usability of the flagship interaction.** Per-hunk accept/reject over an AI edit: how many clicks, how much reading, what happens with a 40-hunk change? Diff review is *work*, and the record treats it as a feature. Is our version better than `git add -p`, which is free?\n' +
   '- **The refusal UX.** A tool that refuses is a tool that says no to a paying user. Model the actual moment: what does the user do next? If the answer is "edit it by hand", we have added a step, not removed one.\n' +
   '- **What is missing entirely** that a user would expect on day one.'],

  ['c5-execution',
   'CRITIQUE TECHNICAL FEASIBILITY AND EXECUTION RISK, unsparingly and specifically.\n\n' +
   'Read `ENGINE.md` §67-80 (the engine audit and design), `DEV-PLAN.md`, and `r23-u1` (the AIOS audit).\n\n' +
   '- **Grade the codebase honestly.** 25,407 lines, 98 test files, 1,575 tests, NO CI, one symbol of a thirteen-file engine reaching product code, a dead table editor that destroys bytes, a spec harness that has reported green while blind. What does this say about the team\'s ability to ship?\n' +
   '- **The engine audit found real defects** — D1 through D11 in §67. Assess their severity and what they imply about the quality bar.\n' +
   '- **The 41-day MVP-0 estimate.** Test it. 38 points at 1.09 calendar days per point, by a founder who also does 54-78 hours of client work monthly. Derive the real elapsed time and state the multiple.\n' +
   '- **The engine-before-value sequencing**: nine weeks of engine work before a user sees anything. Argue whether that is discipline or avoidance.\n' +
   '- **Single points of failure**: one person, one machine, unrotated credentials, no CI, no on-call rotation. Rank by what breaks first.\n' +
   '- **What in this plan is beyond the team\'s demonstrated capability?** Answer specifically, with evidence from the repo.'],
]

const demolition = await parallel(DEMO.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Demolition' })))

phase('Business')

const BIZ = [
  ['c6-unit-economics',
   'CRITIQUE THE BUSINESS MODEL AND UNIT ECONOMICS. Arithmetic, not narrative.\n\n' +
   'Read `PRODUCT.md` §90 (AI economics), §93 (credits), `r25-w3` (willingness to pay), `r22-t3` (money), and BUSINESS §82 (churn).\n\n' +
   '- **Derive the real unit economics** at 100, 1,000 and 10,000 users: infrastructure, inference, payment fees, support hours, and the founder\'s time priced at its opportunity cost (client work at Rs 1,400-2,000/hour). Show every step.\n' +
   '- **The pricing is likely wrong in both directions** (finding 4). Argue: is Rs 299 too low to be believed, and is any per-seat subscription the wrong axis for a tool whose files live on the user\'s disk? Propose what is right and price it.\n' +
   '- **The AI cost trap**: a free tier with AI features on a very small budget. Model the worst case — what does one abusive user cost, and what does the median free user cost per month?\n' +
   '- **Payback and LTV/CAC.** With no paid channel and every organic channel borrowed, what is CAC even made of? If CAC is founder-hours, price them.\n' +
   '- **The break-even table**: paying users needed at each price point to cover the nut, and the visitor volume implied at plausible conversion. State how long that takes at a realistic growth rate.\n' +
   '- **Verdict**: is there a business here at ANY price, and if so at which one?'],

  ['c7-d2c',
   'CRITIQUE THE D2C MOTION. Why would an individual pay, and what does the evidence say they actually do?\n\n' +
   'Read `r25-w3`, `r25-w4` (retention and growth), `r21-s5`, and PRD §63-64 (personas and positioning).\n\n' +
   '- **The free-tier gravity problem.** Obsidian is free and beloved. What has EVER successfully charged individuals in this category, and for what? If the answer is "sync, and almost nothing else", say what that means for us.\n' +
   '- **Retention with zero lock-in.** We made exit free by design — files stay on the user\'s disk. That is ethically right and commercially hostile. Quantify the churn implication and say whether any mitigation is honest.\n' +
   '- **The conversion arithmetic.** Developer free-to-paid is the hard half of freemium. Take the record\'s own numbers and derive what volume is needed for a living wage.\n' +
   '- **The first hundred users, concretely.** Not a channel list — a plan for Monday morning. If there isn\'t one, that is the finding.\n' +
   '- **The India-selling-globally question**: does a rupee price signal cheapness to a global developer audience? Find comparable companies and what they did.\n' +
   '- **Verdict** on D2C: viable, marginal, or a distraction from B2B.'],

  ['c8-b2b',
   'CRITIQUE THE B2B MOTION, including the counter-intuitive finding that the closest analogue runs a large B2B business with zero B2B features.\n\n' +
   'Read `r21-s5`, `r22-t3`, PRD §21 (segments), §51 (legal and compliance), BUSINESS §85.\n\n' +
   '- **Who signs, and why this quarter?** Not who benefits — who has budget and urgency. If you cannot name a trigger, B2B is a hope.\n' +
   '- **The procurement wall**, priced: SOC 2, security questionnaires, SSO, DPAs, insurance, an Indian entity selling to EU and US enterprises. What does each cost in money and founder-months, and at what deal size does each start to bite?\n' +
   '- **The support obligation.** One person on call. What SLA can honestly be offered, and what happens to the product roadmap the first time an enterprise customer has an incident?\n' +
   '- **The Obsidian precedent**: a $50/user/year commercial licence and no enterprise features. Is that replicable for us, or does it depend on a beloved free product with millions of users that we do not have?\n' +
   '- **The genuine B2B asset**: documents already live in the customer\'s repo, so data residency and exit are solved architecturally. Is that worth money, or is it worth nothing without SOC 2?\n' +
   '- **Verdict**: B2B first, D2C first, or neither yet.'],

  ['c9-capacity',
   'CRITIQUE FOUNDER CAPACITY AND THE EXECUTION MODEL — the constraint that binds everything else.\n\n' +
   'Read `r22-t3` (money), PRD §46 (founder capacity), §53 (execution capacity), BUSINESS §85, and `r23-u1`.\n\n' +
   '- **Resolve or expose the contradiction**: this plan says two founders; §53 says "One person. This is the binding constraint on everything above." Every calendar and cost figure derives from one or the other. Work out what changes under each and say which the evidence supports.\n' +
   '- **The time budget, added up honestly.** Client work 54-78 h/month to fund the nut, plus support, plus ops, plus engineering, plus the on-call obligation that starts at first publish. Total it against 160-198 hours and report the deficit.\n' +
   '- **The AIOS distraction.** 131 skills, 149 scripts, 69 gates, a book, and a learning loop that is not running (finding 10). How many founder-months went into infrastructure for the founder rather than product for a customer? Estimate it and name it for what it is.\n' +
   '- **The documentation ratio** (finding 11): 87 words per line of code. Diagnose what this behaviour indicates about how the founder spends time under uncertainty.\n' +
   '- **Bus factor and burnout.** What happens if the founder is ill for three weeks after the first paying customer?\n' +
   '- **What would have to change** about how this founder works for any version of this plan to ship.'],

  ['c10-kill-case',
   'MAKE THE CASE THAT THIS SHOULD NOT BE BUILT. Full strength. **No rebuttal, no balance, no "on the other hand" — those belong in other sections.** If you cannot make this argument compelling, you have not understood the risk, and the founder cannot make an informed decision.\n\n' +
   'Build the strongest possible prosecution:\n' +
   '- The differentiator is not felt (finding 2), the demo is already shipped by a funded competitor (finding 1), the wedge is table stakes (finding 5), the flagship render is the least wanted (finding 6), and the pricing is below the category leader\'s single-feature price (finding 4).\n' +
   '- The team is one person who has built 131 skills, a book and 2.2 million words of documentation, and zero users.\n' +
   '- The category leader is free.\n' +
   '- The one thing users actually want — sync — was declared out of scope.\n' +
   '- 62% of the plan\'s own load-bearing claims were wrong when checked.\n\n' +
   'Then answer, ruthlessly: **what is the opportunity cost?** What could this founder build in six months, with these skills and this evidence, that has a materially better chance? Be concrete — name candidate products, including ones from the existing ecosystem, and say why each is a better bet.\n\n' +
   'End with the single sentence you would say to this founder if you had one sentence.'],
]

const biz = await parallel(BIZ.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Business' })))

phase('Reconstruction')

const critiques = [...demolition, ...biz].filter(Boolean)
const CTX = '\n\n=== THE CRITIQUE, ALL TEN ANGLES ===\n\n' +
  critiques.map((r, i) => '--- critique ' + (i + 1) + ' ---\n' + String(r).slice(0, 8000)).join('\n\n') + '\n=== END ===\n'

const recon = await parallel([
  () => agent(
    'THE CRITIQUE IS DONE. Now find what SHOULD be built — the reconstruction.' + CTX + '\n' +
    'You are not defending the original plan. You are answering: given a real byte-exact markdown engine, a founder who can ship, an existing codebase, and everything the evidence says, **what is the highest-expected-value thing to build?**\n\n' +
    'Generate and score at least six genuinely different options. For each: what it is, who pays, why now, what of the existing asset is reused, time to first revenue, and the strongest objection.\n\n' +
    'Candidates that must be considered, and there may be better ones:\n' +
    '- **Narrow to the one asked-for capability**: vault-wide refactor with reviewable diffs and refusal on ambiguity (86 likes on broken-links-on-rename).\n' +
    '- **Attack slop directly** — 23.7% of complaints, +149%, and nobody is on it. What would a product that made AI output reviewable actually look like?\n' +
    '- **Sync done provably safely** — the #1 loved feature, #1 switching trigger, and a competitor whose sync duplicates file sections.\n' +
    '- **The engine as a library or an MCP server**, not an editor — feed the agents people already use rather than competing with them.\n' +
    '- **Document CI** — gates over markdown in a repo, sold to teams. We already run four such gates on ourselves.\n' +
    '- **Nested-construct live preview** as an Obsidian plugin — the 501-like bug, shipped where the users already are.\n' +
    '- **Services productised** — the founder already funds the nut with client work.\n' +
    '- **Abandon and redeploy** to a different product entirely.\n\n' +
    'Score each on: evidence of demand · time to revenue · defensibility · fit with one founder · reuse of the existing engine · and honest probability of reaching Rs 1L/month within twelve months. Show the scoring.\n\n' +
    'Then RECOMMEND ONE, with the strongest argument against your own recommendation stated fully.\n\n' +
    'Target 3200-4000 words.' + HOUSE,
    { label: 'c11-what-to-build', phase: 'Reconstruction' }),

  () => agent(
    'WRITE THE PLAN. Given the critique, produce the executable plan for the next 90 days — what to do on Monday, not a strategy deck.' + CTX + '\n' +
    'Assume the founder reads this and starts. It must be concrete enough to act on and honest enough to abandon.\n\n' +
    'STRUCTURE:\n\n' +
    '**A. The decision.** What is being built and what is being stopped. Name what dies, explicitly — a plan that kills nothing is an addition, not a plan.\n\n' +
    '**B. The two weeks before any code.** The cheapest tests that could invalidate the whole thing. The evidence says byte-exactness is not felt and the demo is already shipped, so the first move is almost certainly a demand test rather than a build. Design it: what exactly is put in front of whom, and what result kills the idea.\n\n' +
    '**C. The 90 days, week by week.** What ships, what is measured, what the exit criterion is for each phase. Every week must have an observable outcome.\n\n' +
    '**D. The numbers.** Revenue target, cost ceiling, hours available after client work, and the break-even point — with arithmetic shown.\n\n' +
    '**E. The kill switches.** Specific, dated, observable conditions under which the founder stops. A plan without these is a wish.\n\n' +
    '**F. What we do with the existing asset** — the engine, the corpus, the tests, the 2.2 million words. Reuse, archive, or abandon, item by item.\n\n' +
    '**G. The one-founder version and the two-founder version**, because the record contradicts itself and both must be executable.\n\n' +
    'Target 3200-4000 words. Concrete, dated, arithmetic shown.' + HOUSE,
    { label: 'c12-the-plan', phase: 'Reconstruction' }),
])

return {
  demolition: demolition.filter(Boolean).length,
  business: biz.filter(Boolean).length,
  reconstruction: recon.filter(Boolean).length,
}
