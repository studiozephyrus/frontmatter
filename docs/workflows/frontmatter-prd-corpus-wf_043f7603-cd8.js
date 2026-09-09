export const meta = {
  name: 'frontmatter-prd-corpus',
  description: 'Compress 35 research reports into dense PRD source material and fill the business/fusion gaps',
  phases: [
    { title: 'Extract', detail: '13 agents compress the 35 research reports losslessly' },
    { title: 'Gaps', detail: 'business model, internal-systems fusion, risk/legal/org' },
  ],
}

const R = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/research/agent-reports-2026-08-28/'
const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'

const COMMON = [
  'You are producing raw source material for ONE master technical PRD. You are NOT writing the PRD.',
  '',
  'OUTPUT RULES (strict):',
  '- Dense structured markdown ONLY: short H3 headings, tight bullets, and tables. NO prose paragraphs. NO preamble. NO conclusion. NO "in summary".',
  '- Preserve EVERY distinct finding, every number, every proper noun, every version string, every URL, every repo/package name, every price, every count.',
  '- Preserve evidence tags exactly as the source marks them: [measured] = executed on this machine, [fetched] = primary source opened, [SS] = unverified search summary. If a claim carries no tag in the source, tag it [SS].',
  '- Never invent a number. Never round a number. Never generalise a specific away. If the source gives a mechanism, keep the mechanism.',
  '- Keep contradictions: if two sources disagree, record BOTH and say they disagree.',
  '- Keep every actionable recommendation and every explicit anti-recommendation (things NOT to build).',
  '- Target 1800-2800 words of pure density.',
  '',
  'HARD CONSTRAINTS: Do NOT edit, write, or create any file. Do NOT run git commit, git push, or any mutating command. Read-only. If you think a destructive op is needed, stop and say so in your output.',
  '',
  'Your entire final message IS the return value. Start directly with the first H3.',
].join('\n')

const ex = (label, files, focus) =>
  'Read these files IN FULL with the Read tool: ' + files.map((f) => R + f + '.md').join(', ') + '\n\n' +
  COMMON + '\n\nADDITIONAL FOCUS for this batch: ' + focus

phase('Extract')

const BATCHES = [
  ['x1-internal-a', ['i1-content-agent', 'i2-ecosystem-products', 'i3-knowledge-base-principles'],
   'The internal content/campaign engine, the studio ecosystem product inventory (every product, its stack, status, and what is REUSABLE for frontmatter), and the knowledge-base principles. Keep every repo name and every reuse pointer.'],
  ['x2-internal-b', ['i4-aios-capabilities', 'i5-aios-pattern-language', 'i6-frontmatter-docs-delta', 'i7-research-ledger'],
   'AIOS capabilities and its pattern language (schema profiles, append-only blocks, machine-write zones, provenance chips, evidence tiers, token budget, traces, evals, bandit routing, complexity gate), the delta between frontmatter docs and reality, and the research ledger method. Keep every AIOS convention that could become a user-facing product feature, and every measured live-system number.'],
  ['x3-external-a', ['e1-verify-fetch', 'e2-home-surface', 'e3-team-india'],
   'Claim verification results, the home/dashboard surface evidence (download counts, plugin comparisons), and the India team/market evidence. Keep every download number and every price.'],
  ['x4-external-b', ['e4-agent-frontier', 'e5-importer-breakage', 'e6-naming-risk'],
   'The agent frontier (what is already commodity), importer breakage taxonomy (the full failure classes and the verification-report panel design), and the frontmatter naming/trademark risk with every install count and every mitigation option.'],
  ['x5-external-c', ['e7-fresh-community', 'e8-protocol-buyer', 'f1-fetch-findings'],
   'Fresh community signal from the last weeks (HN posts, points, comments, forum threads, competing launches), whether anyone actually BUYS a protocol layer, and the elevated fetch sweep results including which [SS] claims were upgraded to [fetched] and which conflicts were resolved.'],
  ['x6-hands-a', ['h1-design-patterns', 'h2-foreign-corpus'],
   'Design-pattern findings, and the foreign-vault corpus run: exact file counts, author count, corruption count, refusal count and percentage, the NF-1..NF-4 defect list with mechanism and fix, and the recovery percentage. This is the most load-bearing measured evidence in the whole corpus - keep every digit.'],
  ['x7-hands-b', ['h3-hubble-fmcms-teardown', 'h4-openknowledge-teardown'],
   'The three executed competitor write-path teardowns. For each: the exact input, the exact output, the exact bytes damaged, the mechanism, the source-code quote where their code contradicts their claim, and what is durable vs erodible about our advantage.'],
  ['x8-editors-a', ['ed1-writing-tools', 'ed2-ides'],
   'Writing tools and IDEs. Keep every product, every price, every feature we should TAKE, every anti-pattern we should REFUSE, and every named issue/ticket number.'],
  ['x9-editors-b', ['ed3-frameworks', 'ed4-ai-editors'],
   'Editor frameworks (CodeMirror, ProseMirror, Lexical, Tiptap, BlockNote, Milkdown - with their lossy-serialisation evidence) and AI editors. Keep every licence, every version, every named API, and every regression story.'],
  ['x10-editors-c', ['ed5-office-suites', 'aj1-agent-protocols'],
   'Office suites (Word, Google Docs, LibreOffice - track changes, suggestions, comments, API limits) and the agent protocol layer (MCP, ACP, A2A, AG-UI). Keep every API limitation, every spec revision date, every adoption number.'],
  ['x11-journey', ['aj2-chat-to-artifact', 'aj3-knowledge-formats', 'aj4-journey-home'],
   'Chat-to-artifact systems (Canvas, Artifacts, Bolt, v0 - their identity/versioning/patch design rules and their documented failure modes), knowledge formats (OKF, llms.txt, MyST, SKILL.md, prompty, AGENTS.md, OTel gen_ai semconv, Dublin Core, JSON-LD, RO-Crate and any others), and the AI-journey home concept. Keep every spec field name and every design rule.'],
  ['x12-core-a', ['c1-core-concept', 'c2-low-compute-app', 'c3-b2b-wedge'],
   'The projection law and its prior art, the computation budget map (every row, every lane, every mechanism, every ceiling), and the B2B wedge (every ICP, every vendor price, every stack-consolidation number, every anti-recommendation).'],
  ['x13-core-b', ['c4-pricing-inr', 'c5-build-refs', 'c6-screens'],
   'Pricing (every anchor price, the FX correction, the AI unit economics arithmetic, the rails comparison), the build bibliography (every package with its exact licence and any licence landmine), and the 12-screen inventory (every screen: purpose, above-the-fold, main interaction, empty state, AI placement, and every founder-mockup reconciliation).'],
]

const extracted = await parallel(
  BATCHES.map((b) => () => agent(ex(b[0], b[1], b[2]), { label: b[0], phase: 'Extract' }))
)

phase('Gaps')

const G1 = [
  'Research and produce the BUSINESS MODEL section source material for the frontmatter PRD. frontmatter is a markdown editor + AI document workspace built by a solo founder in India (Zephyrus Studio), free tier + INR 299/mo + a top tier, world tiers around $5/$10, BYO-API-key plus small metered hosted AI.',
  '',
  'First read for grounding: ' + R + 'c4-pricing-inr.md, ' + R + 'c3-b2b-wedge.md, ' + R + 'e3-team-india.md.',
  '',
  'Then produce, as dense tables and bullets:',
  '1. UNIT ECONOMICS per tier: gross revenue, payment fees, GST treatment, inference cost ceiling, net contribution margin. Show the arithmetic inputs so a reader can audit it.',
  '2. COST STRUCTURE at 100 / 1,000 / 10,000 users: hosting, storage, egress, inference, support, payment rails. State assumptions explicitly.',
  '3. FUNNEL MATH: what visitor-to-free and free-to-paid conversion rates the plan needs at each revenue milestone (INR 1L/mo, 5L/mo, 20L/mo MRR), and whether those rates are typical for dev tools. Give the benchmark rates with sources.',
  '4. REVENUE MODEL OPTIONS compared: subscription, flat perpetual licence (Obsidian model), usage/credits, seat-based B2B, marketplace/templates, services. For each: fit, risk, and what it does to support load.',
  '5. MOAT AND DEFENSIBILITY: rank each candidate moat (byte-fidelity engine, degradation certificate, provenance, file-native data, community/plugin, brand, switching cost) by how long it holds and what erodes it.',
  '6. COMPETITIVE PRICING TABLE: every named competitor with its current price and what the buyer gets.',
  '7. KEY BUSINESS RISKS with a mitigation for each.',
  '8. WHAT WOULD MAKE THIS FAIL COMMERCIALLY - the honest list.',
  '',
  'Use curl for any live figure you need (curl works even where WebFetch is refused - test it before concluding you cannot reach a source). Tag every number [fetched] if you opened the source, [SS] if it is a search summary, [derived] if you computed it, and SHOW the computation for anything [derived].',
  '',
  COMMON,
].join('\n')

const G2 = [
  'Produce the INTERNAL SYSTEMS FUSION inventory for the frontmatter PRD. The founder wants AIOS fused with his other internal systems (he referred to one by a name that transcribed as "SGM-CHI" - resolve this by inventory, and cover the SUPERSET of internal systems so nothing is missed) and with MDMAX.',
  '',
  'Inventory these READ-ONLY and report what each one already has that frontmatter can absorb as a product feature:',
  '- AIOS, the orchestrator: /Users/sagnikmitra/.claude/ (CLAUDE.md Learned Rules, skills-src/, hooks in settings.json, rules/) and /Users/sagnikmitra/.sgnk/ (traces/, state/, gates/, baselines/, evals). Report the actual mechanisms: trace ledger schema, complexity gate, bandit routing, eval loop, calibration, drift/digression guards, shadow-promote ladder, snapshot/recall continuity, preference log.',
  '- sgnk-md, the existing markdown app: /Users/sagnikmitra/Desktop/GitHub/md/ (and its Tauri build). What features exist there that frontmatter lacks or duplicates.',
  '- MDMAX, the engine inside frontmatter: ' + FM + 'src/modules/mdmax/. Report every module and what capability it exposes.',
  '- The rest of frontmatter: ' + FM + 'src/modules/ - list every module and one line on what it does.',
  '- The knowledge base: /Users/sagnikmitra/Desktop/GitHub/knowledge/ - structure and whether it is a product feature candidate.',
  '- The campaign/content engine and the design system, if you can locate them.',
  '',
  'Then produce:',
  '1. A table: INTERNAL ASSET | WHAT IT DOES TODAY | PRODUCT FEATURE IT COULD BECOME | LIFT (S/M/L) | SHIP OR KEEP-INTERNAL.',
  '2. An explicit DO-NOT-SHIP list: internal machinery that would be a trust burden or confusing as consumer UI, with the reason.',
  '3. The DUPLICATION map: what exists in BOTH sgnk-md and frontmatter and therefore has to be fixed twice today.',
  '4. Any concrete file path a builder would need as a starting point.',
  '',
  'Use exact paths and exact module names. Count things rather than estimating them.',
  '',
  COMMON,
].join('\n')

const G3 = [
  'Produce the RISK, COMPLIANCE and EXECUTION-CAPACITY section source material for the frontmatter PRD. Context: solo founder, India (Pvt Ltd studio), building a markdown editor + AI workspace that stores user documents, publishes pages, connects to GitHub, and calls LLM APIs.',
  '',
  'Produce, as dense tables and bullets:',
  '1. RISK REGISTER: technical, market, legal, operational, key-person. Each row: risk | likelihood | impact | early-warning signal | mitigation | who owns it.',
  '2. LEGAL AND COMPLIANCE for an India-based product selling globally: GST on SaaS and the export-of-services position, India DPDP Act obligations for user documents, GDPR exposure for EU customers, what a merchant-of-record actually absorbs vs what the founder still owes, and the data-residency question. Note where a claim needs a CA or lawyer rather than an agent.',
  '3. SECURITY POSTURE for the product: BYO-API-key storage, OAuth scopes for GitHub, published-page access control and revocation, LLM prompt-injection exposure when an agent reads untrusted documents, and the eval/arbitrary-code lane that must be refused.',
  '4. EXECUTION CAPACITY: realistic solo-founder throughput, what MUST be hired or bought vs built, and the sequencing consequence.',
  '5. OPEN DECISIONS a founder must make before development starts, each phrased as a question with the options and the consequence of each.',
  '',
  'Use curl to check any regulatory figure or threshold you cite; mark anything you could not verify as [SS] and say plainly that it needs professional confirmation. Do not give definitive legal or tax advice - frame as issues to confirm.',
  '',
  COMMON,
].join('\n')

const gaps = await parallel([
  () => agent(G1, { label: 'g1-business-model', phase: 'Gaps' }),
  () => agent(G2, { label: 'g2-internal-fusion', phase: 'Gaps' }),
  () => agent(G3, { label: 'g3-risk-legal-capacity', phase: 'Gaps' }),
])

return {
  extracted: BATCHES.map((b, i) => ({ label: b[0], text: extracted[i] })),
  gaps: [
    { label: 'g1-business-model', text: gaps[0] },
    { label: 'g2-internal-fusion', text: gaps[1] },
    { label: 'g3-risk-legal-capacity', text: gaps[2] },
  ],
}
