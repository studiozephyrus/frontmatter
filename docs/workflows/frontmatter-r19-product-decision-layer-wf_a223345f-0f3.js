// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r19-product-decision-layer',
  description: 'Turn the record into a founding-session substrate: the practical decisions, the full feature inventory, MVP staging, and the critique frames',
  phases: [
    { title: 'Decide', detail: 'the six practical challenges the founders will actually argue about' },
    { title: 'Features', detail: 'complete inventory, MVP staging, and how to attack each one' },
    { title: 'Session', detail: 'the pack you run the founding session from' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const REC = FM + 'docs/FRONTMATTER-RECORD.md'

const HOUSE = [
  '',
  'YOU ARE THE THIRD CO-FOUNDER. Two people are about to sit down and decide what this product IS — the MVP, MVP1, every feature. Your section is what they will argue from. It must be decision-grade: options, the real trade, a recommendation you are willing to defend, and the evidence that would change your mind.',
  '',
  'STYLE:',
  '- Open with the EXACT H2 heading given. H3 subsections.',
  '- NO preamble, NO process notes, NO conclusion paragraph. First line is the heading.',
  '- Table-first. Every option gets: what it is · what it costs · what it buys · what it forecloses.',
  '- Evidence tags: [fetched] primary source opened · [measured] executed here · [derived] arithmetic shown · [inference] reasoning · [SS] search summary only.',
  '- MAKE A RECOMMENDATION. A section that lays out three options and refuses to choose has done half the work. Name the choice, then state the strongest argument against it honestly.',
  '- Every price, limit or model name carries the date you read it and the URL.',
  '',
  'OPENING SOURCES: WebFetch is refused by a security gate here. `curl` is NOT. Test it before concluding anything is unreachable:',
  '  curl -sL --compressed -A "Mozilla/5.0" "<url>" | sed -e \'s/<[^>]*>//g\' | tr -s "\\n" | head -200',
  'If a host refuses, give the status code and try a second source. Never silently fall back to memory — an unopened claim is [SS], never [fetched].',
  '',
  'THE PRODUCT: a markdown editor. Simple surface, deep engine. THE FILE IS THE ONLY SOURCE OF TRUTH; every view is a deterministic reversible projection owning no state. The engine does byte-preserving splice edits (locate the range, replace exactly those bytes, REFUSE rather than guess) plus cross-engine degradation certification. The ambition is bigger than an editor: AI-OS features and industry automation, helping people actually get work done in files they own.',
  '',
  'SETTLED — build on these, do NOT re-litigate:',
  '- Documents live in the user git repo and never move.',
  '- Sync = git three-way merge + append-only splice journal + compare-and-swap. NEVER a CRDT for document bytes.',
  '- One Postgres as control plane holding ZERO document bytes.',
  '- No arbitrary client-side code execution, ever. The eval lane is refused.',
  '- Refuse rather than guess is the founding principle and the differentiation.',
  '',
  'THE CONSTRAINTS THAT SHAPE EVERY ANSWER: one founder plus a co-founder. India-based, selling globally. Very limited AI budget — this is a real constraint, not a preference. Cost must be near-zero at 100 users and predictable at 10,000. Every component operable by one person on call. Pricing anchors free / Rs 299 / Rs 599 per month.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands.',
  'EMIT EARLY: full section text as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL TEXT.',
  'Your entire final message IS the section text.',
].join('\n')

phase('Decide')

const DECIDE = [
  ['p1-ai-economics',
   'Write "## 90. The AI resource problem — what we can actually afford to give away".\n\n' +
   'MEASURED GAP: the record mentions "ai credit" twice, "token budget" zero times and "cost per user" zero times. The AI layer is the product\'s headline and its unit economics are undefined. Two founders with a small budget are about to promise AI features to a free tier. This section is what stops that being fatal.\n\n' +
   'Read for grounding, those sections only: ' + REC + ' §11 (the AI layer and its ranked capabilities), §24 (pricing), §25 (cost structure and funnel math), §45 (billing).\n\n' +
   'Answer, concretely:\n' +
   '- What does one "AI action" in this product actually cost? Pick the three most likely real operations (a frontmatter fill, a section rewrite, a document-wide review pass), estimate input+output tokens for a REAL document, and price them at TODAY\'S published rates. Open the pricing pages with curl: Anthropic, OpenAI, Google, and at least one cheap-inference host (Groq, Together, DeepInfra, OpenRouter). Date every number.\n' +
   '- BYO key vs platform key vs hybrid. The record has this as open decision D9. Settle it with arithmetic, not preference: what is the support cost of BYO, what is the margin exposure of platform, and what does a hybrid actually look like in the UI.\n' +
   '- The free tier: how many AI actions can a free user get before they cost more than they will ever pay? Show the arithmetic. Then propose the actual limit and the refusal UX when it is hit.\n' +
   '- Model routing: which operations genuinely need a frontier model and which are served by a small/cheap one. Be specific — a frontmatter fill is not a reasoning task.\n' +
   '- The cost ceiling mechanism: how we make it structurally impossible to get a surprise bill. Hard caps, degradation, or refusal.\n' +
   '- What we do when we have NO AI budget at all for a month. The product must still work.\n\n' +
   'Include one mermaid diagram (under 12 nodes) of the request path from keystroke to model to cost meter. Target 2200-3000 words.'],

  ['p2-offline-or-online',
   'Write "## 91. Offline, online, or both — and how the app reaches your files".\n\n' +
   'MEASURED GAP: `filesystem api` = 0 hits in the record, `directory handle` = 0, `file system access` = 1. Tauri appears 89 times but the actual FILE ACCESS decision is never made. This is the architectural fork the founders must settle before any feature list means anything.\n\n' +
   'Read for grounding: ' + REC + ' §7 (architecture and current state), §31 (sync and storage), §39 (desktop), and DEV-PLAN §3 (frontend) and §7 (live editing) inside the same file.\n\n' +
   'The question in plain terms: the user has a folder of markdown on their machine — a vault, a repo, a product\'s docs. How does our software read and write it, and what is true when there is no network?\n\n' +
   'Compare the real options with what each actually costs to build and operate:\n' +
   '- Browser + File System Access API — check CURRENT browser support with curl (caniuse or MDN). Safari and Firefox are the question. What is the fallback and is it acceptable?\n' +
   '- Tauri v2 desktop with real filesystem access — the repo already has a Tauri shell, but measure what it currently is (the record says it is a thin remote-URL wrapper pointing at a hosted URL, which is NOT a local-first app).\n' +
   '- Web app + git as the transport (clone/pull/push), documents never touched locally.\n' +
   '- A local agent/daemon the web app talks to.\n' +
   '- Hybrid: local-first desktop, web as a viewer.\n\n' +
   'For each: what works offline, what breaks, what the AI features can and cannot do without network, what it costs us in support, and what it does to the DPDP/GDPR surface (a document that never leaves the device is a fundamentally different legal product — the record\'s open decision D8).\n\n' +
   'Then RECOMMEND one, and state the strongest argument against it. Also answer directly: if it is an online app, how does it reach the user\'s local project files at all? And if it is offline-first, how do AI features work, where do credits live, and what syncs?\n\n' +
   'Include one mermaid diagram of the chosen topology. Target 2400-3000 words.'],

  ['p3-dogfooding',
   'Write "## 92. Building the product inside the product — the dogfooding case".\n\n' +
   'This section has a live example sitting in front of you and you should use it. This very repository is a product being planned entirely in a markdown tree: a router (`docs/MAP.md`), a record split across five addressable files, 50 research reports, specs that gate the build, and derived documents rebuilt by script. That IS the workflow we would be selling. Read `' + FM + 'docs/MAP.md` and `' + FM + 'AGENTS.md` and describe it honestly, including what is clumsy about it.\n\n' +
   'Then generalise: what does a user actually DO with this product to run their own product development?\n' +
   '- The artefacts a real team keeps in markdown: PRD, specs, decisions, research, meeting notes, roadmap, runbooks, changelog.\n' +
   '- Which of those benefit from a RENDER (a board, a decision card, a roadmap view) and which are just prose. Be selective — the product is not Notion and the founders have explicitly refused to build project management.\n' +
   '- The referential structure: one router, tiered reading, one fact one home, superseded marked. Why this matters MORE when an AI is the reader — cite the context-window argument.\n' +
   '- What breaks today when a human tries this without our tooling: stale cross-references, numbers that drift between documents, no way to tell derived from authored, no gate that catches a broken pointer.\n' +
   '- Concretely: which of the gates in this repo (`npm run tree`, `npm run refs`, `npm run record`, `npm run spec`) are PRODUCT FEATURES in disguise? A cross-reference checker and a derived-document builder are features, not build scripts.\n\n' +
   'Close with the sharpest version of the pitch: what a founder or a team gets on day one, in one paragraph, with no adjectives.\n\n' +
   'Target 2000-2600 words.'],

  ['p4-credits-and-limits',
   'Write "## 93. Credits, quotas and the refusal surface".\n\n' +
   'Companion to §90 (which prices AI) — this one is the MECHANISM. How a credit is defined, metered, displayed, enforced and refused, for a company that cannot absorb an overrun.\n\n' +
   'Read for grounding: ' + REC + ' §11 (AI layer), §24-25 (pricing and cost), §45 (billing), §47 (abuse), and BUSINESS §82 (churn) and §84 (refunds) inside the same file.\n\n' +
   'Answer:\n' +
   '- What IS a credit, in a unit a user understands? Tokens are a vendor concept and leak our cost structure. Actions are legible but vary 100x in cost. Pick one and defend it.\n' +
   '- The metering path: where the meter lives given the control plane holds zero document bytes, how it survives an offline session, and what happens when the client and server disagree.\n' +
   '- Enforcement: soft cap, hard cap, or degrade to a cheaper model. What the user SEES. Getting this wrong reads as a billing bug, and the record already warns that a manual repurchase wearing a subscription costume is exactly that.\n' +
   '- Abuse: one account, an automation loop, and a $4,000 bill overnight. What structurally prevents it, not what detects it afterwards.\n' +
   '- BYO key holders: do they get unlimited? What is the support and liability posture when their key leaks or their bill explodes.\n' +
   '- Rollover, expiry, and refunds on unused credits — including the Indian and EU consumer positions the record already establishes.\n' +
   '- The refusal UX. This product refuses by design; refusing an AI action for credit reasons must feel like the same product, not like a paywall. Write the actual copy for three refusal moments.\n\n' +
   'Target 2000-2600 words.'],
]

const decided = await parallel(DECIDE.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Decide' })))

phase('Features')

const FEATURES = [
  ['p5-feature-inventory',
   'Write "## 94. The complete feature inventory".\n\n' +
   'Every feature this product has ever been described as having, in one table, deduplicated, with nothing invented and nothing quietly dropped. This is the raw material the founders will cut from, so OMISSION IS THE FAILURE MODE — a feature that never makes the list cannot be considered.\n\n' +
   'Source: ' + REC + '. Sweep it for features. They are scattered across §9 (rendering), §11 (AI layer), §12-14 (the protocol, screens), §15 (the internal system productised), §17-18 (onboarding, simplicity), §28 (roadmap lanes T0-T4), §44 (publishing), §61-62 (the system as one thing, AIOS inside the product), §67-80 (engine capabilities), and the DEV-PLAN sections. Read those.\n\n' +
   'One row per feature: | # | Feature | What it does in one line | Which lane/§ it comes from | Engine-dependent? | Evidence it is wanted | Rough size XS/S/M/L/XL |\n\n' +
   'Group by surface: Editor · Engine · AI · Renders · Sync and trust · Publishing · Protocol/agent-facing · Capture · Desktop · Admin/B2B.\n\n' +
   'Rules:\n' +
   '- If two names describe one feature, merge them and say so. If one name hides two features, split it.\n' +
   '- Mark anything the record has REFUSED (the eval lane, plugins, project management, live cursors) in a separate closing table with the reason. The founders must be able to see what was ruled out and why, or they will re-propose it.\n' +
   '- "Evidence it is wanted" must be a real signal or the word NONE. Half the list will be NONE and that is the most useful column in the table.\n\n' +
   'Target 2400-3200 words. A long, complete table beats a short, curated one here.'],

  ['p6-mvp-staging',
   'Write "## 95. MVP, MVP1, and the cut lines".\n\n' +
   'MEASURED GAP: the string "MVP" appears ZERO times in the entire record. There are lanes (R0, T0-T4) and a roadmap, but nobody has ever drawn the line at what ships FIRST to a real user. That is the single most important missing artefact for the session the founders are about to run.\n\n' +
   'Read for grounding: ' + REC + ' §28 (roadmap, critical path, milestones), §16 (what no competitor has), §27 (moats), §17-18 (onboarding and simplicity), §50 (risks), and BUSINESS §82 (churn).\n\n' +
   'Define three stages and be ruthless about each:\n' +
   '- **MVP-0, the proof.** The smallest thing that proves the thesis to ONE stranger. What is the single demo that makes someone say "I need that"? Name the features, name what is deliberately absent, and state the honest answer to "why would anyone use this over a text editor plus git".\n' +
   '- **MVP-1, the first paid thing.** What must exist before we can charge Rs 299 without embarrassment. Include the non-features: billing, support channel, ToS, a way to tell users about a breaking change.\n' +
   '- **MVP-2, the wedge.** What makes it defensible rather than merely useful.\n\n' +
   'For each stage give: the feature set (referencing §94\'s numbers), the exit criterion in a form that can be OBSERVED not felt, the calendar estimate with the assumption behind it stated, and — most important — **the cut line**: the three features most likely to be argued back in, and the argument for keeping them out.\n\n' +
   'Then the hardest table in the document: **what we are betting on at each stage, and what evidence would tell us the bet is lost while there is still time to change course.**\n\n' +
   'Note honestly where the engine lane (R0, ~9 weeks before any user-visible value) sits against this, because it is the biggest tension in the plan: the differentiation is the engine, and the engine ships before anything a user can see.\n\n' +
   'Include a mermaid diagram of the three stages and their dependencies. Target 2400-3000 words.'],

  ['p7-critique-frames',
   'Write "## 96. How to attack this product — the critique frames".\n\n' +
   'The founders will use this to argue with each other productively. Your job is to build the ATTACK SURFACE: for each angle, the questions that actually expose weakness, and the answer the record currently gives (or the admission that it gives none).\n\n' +
   'Read broadly across ' + REC + ' — §3 (market), §16 (gap), §21 (segments), §24-27 (pricing, cost, GTM, moats), §50 (risks), §63-64 (personas, positioning), §88 (the war-game), and BUSINESS §81-87.\n\n' +
   'Build one frame per angle. Each frame is a table: | Question | Why it is dangerous | What the record says today | Verdict: ANSWERED / WEAK / UNANSWERED |\n\n' +
   'The angles:\n' +
   '1. **Product** — is this a feature, a product, or a company? What is the second product?\n' +
   '2. **Engineering** — the engine is nine weeks before anything visible. Is the sequencing defensible or is it hiding from the market?\n' +
   '3. **Audience** — who exactly, how many of them, and how do we reach one of them tomorrow morning?\n' +
   '4. **D2C** — the individual buyer. What makes them pay rather than use the free tier forever?\n' +
   '5. **B2B** — who signs, what is the buying trigger, and what does procurement ask that we cannot answer?\n' +
   '6. **Marketing and distribution** — every channel identified is borrowed. Which one do we own?\n' +
   '7. **Competitive** — reference §88 rather than repeating it, and add what §88 did not cover.\n' +
   '8. **Founder capacity** — two people, limited AI budget, an on-call obligation that starts at the first publish.\n' +
   '9. **The uncomfortable one** — the honest case that this product should not be built, at full strength, with no rebuttal attached. If you cannot make this argument compelling you have not understood the risk.\n\n' +
   'End with the SEVEN QUESTIONS the founders must answer in the session, ranked by how much downstream work each one unblocks.\n\n' +
   'Target 2400-3000 words.'],
]

const features = await parallel(FEATURES.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Features' })))

phase('Session')

const session = await agent(
  'Write "## 97. The founding session — how to run it, and what to decide in what order".\n\n' +
  'Two founders are going to sit down with the whole record and decide what the product is. This section is the agenda and the operating manual for that session, and it is also the file a future AI assistant loads to help them run it. Write for both readers.\n\n' +
  'You have the four decision sections and the three feature sections that were just written. Their content follows so you can reference them precisely rather than guessing what they concluded.\n\n' +
  '=== §90-93, the practical decisions ===\n' +
  decided.filter(Boolean).map((r, i) => '--- decision section ' + (i + 1) + ' ---\n' + String(r).slice(0, 9000)).join('\n\n') +
  '\n\n=== §94-96, features, staging and critique ===\n' +
  features.filter(Boolean).map((r, i) => '--- feature section ' + (i + 1) + ' ---\n' + String(r).slice(0, 9000)).join('\n\n') +
  '\n=== END ===\n\n' +
  'STRUCTURE:\n\n' +
  '97.1 **What is already settled, and may not be reopened in the session.** A table with the decision and the section that settled it. Reopening a settled question is the main way a founding session wastes a day. Be firm: these were closed on measured or fetched evidence.\n\n' +
  '97.2 **The decision queue.** Every open decision in DEPENDENCY ORDER, because some answers re-scope others. For each: the question in one sentence, the options, what the record recommends, who or what settles it, and — critically — **what it unblocks**. A decision that unblocks nothing can wait.\n\n' +
  '97.3 **The session agenda**, as a sequence with time boxes. Where to start, what to decide before lunch, what needs a whiteboard versus what needs a spreadsheet. The first decision should be the one that re-scopes the most.\n\n' +
  '97.4 **How to use this record during the session.** The routing: which file and section answers which kind of question, and the standing rule that a lower tier is never opened when a higher one answers. Include the exact commands that regenerate everything.\n\n' +
  '97.5 **How to brief an AI assistant on this record.** A copy-pasteable prompt that gives a fresh Claude the whole context: what to read first, what is settled, what is open, what tags mean, and the rules it must follow (re-derive numbers at write time, never publish an [SS] claim as fact, refuse rather than guess). This subsection is the one the founders will actually use most often — make it excellent and make it self-contained.\n\n' +
  '97.6 **The parking lot.** Questions that will come up, are genuinely interesting, and must not be answered in this session. Say why each one waits.\n\n' +
  'Target 2200-2800 words.' + HOUSE,
  { label: 'session-pack', phase: 'Session' })

return {
  decisions: decided.filter(Boolean).length,
  features: features.filter(Boolean).length,
  session: session ? String(session).length : 0,
}
