// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r20-ai-fusion-thesis',
  description: 'The product thesis: markdown editor as the artifact factory whose output is context an AI can act on, with BYO provider keys and real repo access',
  phases: [
    { title: 'Thesis', detail: 'the fusion, the artifact factory, and the kickoff prompt as the product' },
    { title: 'Mechanics', detail: 'provider keys, repo access, and who this is actually for' },
    { title: 'Discipline', detail: 'what we refuse to build, and the one-paragraph product' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const REC = FM + 'docs/FRONTMATTER-RECORD.md'

const HOUSE = [
  '',
  'YOU ARE THE THIRD CO-FOUNDER, and this round is the product thesis itself. Two founders are about to decide what to build. Your section has to be sharp enough to argue with: a claim, the evidence, the cost, and the honest case against.',
  '',
  'STYLE:',
  '- Open with the EXACT H2 heading given. H3 subsections.',
  '- NO preamble, NO process notes. First line is the heading.',
  '- Table-first. Concrete over abstract: real file names, real prompts, real API shapes, real prices with the date you read them.',
  '- Evidence tags: [fetched] primary source opened · [measured] executed here · [derived] arithmetic shown · [inference] reasoning · [SS] search summary only.',
  '- MAKE A RECOMMENDATION and state the strongest argument against it.',
  '- **Feature discipline is a hard rule in this round.** The founders explicitly do not want users buried in features nobody uses. Every feature you propose must name the specific person who uses it and how often. If you cannot, cut it and say you cut it.',
  '',
  'OPENING SOURCES: WebFetch is refused by a security gate here. `curl` is NOT. Test it first:',
  '  curl -sL --compressed -A "Mozilla/5.0" "<url>" | sed -e \'s/<[^>]*>//g\' | tr -s "\\n" | head -200',
  'docs.claude.com, platform.openai.com, docs.github.com, modelcontextprotocol.io and raw.githubusercontent.com are all reachable. If a host refuses, give the status code and try another. An unopened claim is [SS], never [fetched].',
  '',
  'THE PRODUCT AS IT STANDS: a markdown editor. Simple surface, deep engine. THE FILE IS THE ONLY SOURCE OF TRUTH; every view is a deterministic reversible projection owning no state. The engine does byte-preserving splice edits — locate the range, replace exactly those bytes, REFUSE rather than guess — plus cross-engine degradation certification.',
  '',
  'THE THESIS THIS ROUND EXISTS TO TEST, in the founder\'s own words: the editor produces the artefacts of product development — handovers, decision records, flows, kickoff documents — and then hands the user a **kickoff prompt they paste into Claude (or Codex, or whatever they use) so that their AI produces materially better output**. For teams, we connect to their own provider keys and run the models inside the editor. The product is the fusion of a markdown editor and AI-assisted product development.',
  '',
  'SETTLED — do NOT re-litigate: documents live in the user git repo and never move · sync is git three-way merge plus a splice journal plus compare-and-swap, never a CRDT · one Postgres control plane holding zero document bytes · no arbitrary client-side code execution, ever · refuse rather than guess.',
  '',
  'CONSTRAINTS: two founders. India-based, selling globally. Very small AI budget — a real constraint. Near-zero cost at 100 users, predictable at 10,000. Everything operable by one person on call. Free / Rs 299 / Rs 599 per month.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands.',
  'EMIT EARLY: full section text as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL TEXT.',
  'Your entire final message IS the section text.',
].join('\n')

phase('Thesis')

const THESIS = [
  ['q1-the-fusion',
   'Write "## 98. The fusion — what an AI-native markdown editor actually is".\n\n' +
   'State the product thesis in a form the founders can defend or reject. Not a vision statement: a claim with a mechanism.\n\n' +
   'Read for grounding: ' + REC + ' §5 (the projection law), §11 (the AI layer), §13 (the protocol), §15 (the internal system productised), §62 (AIOS inside the product), §65 (the markdown thesis).\n\n' +
   'Answer these directly:\n' +
   '- What is the DIFFERENCE between "a markdown editor with AI features bolted on" and "an AI-native markdown editor"? Most products claiming the second are the first. Give the test that separates them.\n' +
   '- Why markdown specifically, for AI? Be concrete about the mechanism: token efficiency versus rich formats, the fact that models are trained on it, the fact that a diff is reviewable, the fact that a file is addressable. Measure where you can — take a real document and compare token counts across markdown, HTML and JSON representations.\n' +
   '- The three-way fusion the founders named: markdown editing + AI automation + product development. What is the LOOP? Draw it. Where does a human sit in it and where must they sit for the output to be trustworthy?\n' +
   '- The category question, answered honestly: is this an editor, an AI workspace, a context layer, or a product-development tool? The answer determines the competitor set and the buyer. Pick one and live with it.\n' +
   '- What this is NOT, stated crisply: not Notion, not a project manager, not a chat wrapper, not an IDE.\n\n' +
   'Include one mermaid diagram of the loop, under 12 nodes. Target 2200-2800 words.'],

  ['q2-artifact-factory',
   'Write "## 99. The artefact factory — the documents the product makes, and the prompt it hands you".\n\n' +
   'This is the sharpest and least-researched idea in the whole record, so treat it as the centre of the product rather than a feature.\n\n' +
   'The claim: a team doing product development with AI keeps producing the same artefacts — a handover, a decision record, a flow, a spec, a kickoff brief. Today they write them badly or not at all, and then paste a vague request into Claude and get vague output. The product generates those artefacts properly FROM the work already in the vault, and then hands the user a **kickoff prompt** — a self-contained context pack — that makes their own AI produce materially better output.\n\n' +
   'Read for grounding: ' + FM + 'docs/MAP.md and ' + FM + 'AGENTS.md — this repository is a live worked example of exactly this, and you should describe what it actually does. Also ' + REC + ' §13 (the protocol), §15, §62.\n\n' +
   'Deliver:\n' +
   '- **The artefact catalogue.** Which documents genuinely recur in product work: handover, decision record (ADR), spec, flow, kickoff brief, research note, changelog, runbook, meeting note. For each: who writes it today, why it is usually bad, what the product generates, and what it generates it FROM. Cut anything that does not recur — feature discipline applies here hardest.\n' +
   '- **The kickoff prompt, concretely.** Write a REAL one, in full, for a real task ("implement the auth lane"). What goes in it: which files, which sections, which constraints, what is settled, what must not be re-litigated, what the AI must refuse. Then explain each part. This is the product\'s output — it must be worth paying for on its own.\n' +
   '- **Why a generated context pack beats a human paste.** Research and cite what is actually known about context quality and model output: context rot, lost-in-the-middle, the effect of irrelevant context on accuracy, why a curated pack beats a whole repo. Open primary sources with curl — arXiv is reachable via `curl -sL "http://export.arxiv.org/api/query?search_query=..."`.\n' +
   '- **The existing conventions we must interoperate with**, opened and dated: AGENTS.md, CLAUDE.md, `.cursorrules`, MCP. Do not invent a format that competes with a convention that already has adoption.\n' +
   '- **The measurable claim.** What would we have to measure to say "documents from frontmatter make Claude produce better output"? Design the experiment. Without it this is marketing.\n\n' +
   'Target 2600-3200 words. This section carries the product.'],

  ['q3-provider-keys',
   'Write "## 100. Running the user\'s own model — provider keys, and AI inside the editor".\n\n' +
   'The founders want teams to connect their own Claude or OpenAI or Codex keys so the models run inside frontmatter. This solves the AI-budget constraint and creates a security surface. Both halves need engineering, not enthusiasm.\n\n' +
   'Read for grounding: ' + REC + ' §11 (AI layer), §51 (legal, compliance, security), §47 (abuse), and PRODUCT §90 and §93 if present in the record.\n\n' +
   'Answer:\n' +
   '- **The provider matrix.** Anthropic, OpenAI, Google, and the OpenAI-compatible tail. Open each one\'s API docs with curl and give: current model ids and prices, whether a browser-origin call is possible at all (CORS), rate-limit shape, and whether BYO is permitted by their terms for a product like ours. The CORS answer is decisive for the offline/local architecture — check it, do not assume it.\n' +
   '- **Where the key lives.** Browser localStorage, OS keychain via Tauri, our server encrypted, or never stored. Each has a real failure mode: name it. If a key ever transits our server we inherit a liability we may not want.\n' +
   '- **The three deployment shapes**: fully local (desktop holds the key, calls the provider directly), proxied (our server holds it), and hybrid. What each costs us, what each means for the user\'s data leaving the device, and which one the DPDP/GDPR posture actually prefers.\n' +
   '- **Codex, Claude Code, and the CLI-agent question.** Many target users already run an agent in their terminal. Is our play to REPLACE it or to FEED it? Argue it out. Feeding it is cheaper and may be the whole product; replacing it is a fight with well-funded incumbents.\n' +
   '- **MCP.** Should frontmatter be an MCP server the user\'s existing agent connects to, rather than a chat window that duplicates one? Open modelcontextprotocol.io. State the recommendation.\n' +
   '- **What breaks when the user has no key and no budget.** The product must still be worth opening.\n\n' +
   'Include one mermaid diagram of the chosen key/topology. Target 2400-3000 words.'],
]

const thesis = await parallel(THESIS.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Thesis' })))

phase('Mechanics')

const MECH = [
  ['q4-repo-and-folders',
   'Write "## 101. Reaching the work — GitHub, folders, and what the product is allowed to touch".\n\n' +
   'Read for grounding: ' + REC + ' §7, §31 (sync), §39 (desktop), and DEV-PLAN §6 (auth and permissions) inside the same file.\n\n' +
   'The user\'s work lives in a folder, usually a git repo, often on GitHub. Answer precisely how we reach it:\n' +
   '- **The GitHub App**, opened and dated from docs.github.com: which permissions we need for read, for write, for a PR-based flow; what installation tokens can and cannot do; what a user sees on the consent screen and how alarming it is. The consent screen is a conversion surface, not just a security control — say what ours will read like.\n' +
   '- **PR-based writing versus direct commits.** For a product whose whole promise is not corrupting files, proposing a PR is architecturally honest and may be the better default. Argue it.\n' +
   '- **Local folders without GitHub.** Not everyone has a repo. What does the product do with a plain folder — and what does the File System Access API actually permit today (open caniuse or MDN with curl and check Safari and Firefox specifically).\n' +
   '- **The folder structure we expect and the one we impose.** The product should read an existing vault as-is; any structure we require is a migration cost and a reason not to adopt. State the minimum: what must exist for the product to be useful, and what is merely conventional.\n' +
   '- **Monorepo, multi-vault, and submodules** — the messy real cases.\n' +
   '- **The permission ladder**: read a file · read the tree · write one file · write many · create a branch · open a PR. Map each product capability to the least permission that achieves it, and say which capabilities we refuse because the permission is too broad.\n\n' +
   'Include one mermaid diagram of the access topology. Target 2200-2800 words.'],

  ['q5-audience',
   'Write "## 102. Who this is for, now that we know what it is".\n\n' +
   'The record already has personas (§63) and segments (§21), written BEFORE the artefact-factory thesis existed. Read them, then revise honestly — a sharper product usually has a narrower buyer, and pretending otherwise is how positioning dies.\n\n' +
   'Read: ' + REC + ' §21 (segments and ICPs), §63 (personas and JTBD), §64 (positioning), §26-27 (GTM and moats), and BUSINESS §87 if present.\n\n' +
   'Deliver:\n' +
   '- **Who has this problem badly enough to pay**, given the product is now "generate the artefacts and the context pack that make your AI produce better work". Rank the candidates: the solo builder shipping with Claude Code; the two-to-five person startup with no PM; the agency handing projects between people and clients; the platform/DX team maintaining docs; the enterprise with compliance-driven documentation. For each: the trigger that makes them look, who signs, what they compare us to, and what they will not pay for.\n' +
   '- **D2C versus B2B**, decided rather than described. Same product, different motion, or genuinely two products? What changes in the surface, the pricing and the support load. The record already warns that the two-motion strategy rests on a claim nobody verified — name that.\n' +
   '- **The wedge user.** ONE person, described specifically enough that we could find ten of them this week and email them. Vague ICPs are how a launch gets no replies.\n' +
   '- **Where they already are.** Which communities, which repos, which tools. Open at least two of them with curl and give real sizes with the date read.\n' +
   '- **Who this is explicitly NOT for**, and why saying so makes the product better.\n\n' +
   'Target 2200-2800 words.'],
]

const mech = await parallel(MECH.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Mechanics' })))

phase('Discipline')

const disc = await parallel([
  () => agent(
    'Write "## 103. Feature discipline — what we refuse to build, and why the refusal is the product".\n\n' +
    'The founders were explicit: do not bury the user in features nobody uses. This section makes that enforceable instead of aspirational.\n\n' +
    'Read for grounding: ' + REC + ' §18 (simplicity as an engineering discipline), §6 (principles and non-goals), §17 (onboarding), §11.4 (the AI layer\'s explicit refusals), and PRODUCT §94 (the feature inventory) if present in the record.\n\n' +
    'Deliver:\n' +
    '- **The admission test.** A written rule any proposed feature must pass, applied so a disagreement between two founders can be settled by the rule rather than by who argues longer. Draft it, then TEST it against ten features from the inventory — including two the founders are emotionally attached to. Show the rule rejecting something good; a rule that never rejects anything is not a rule.\n' +
    '- **The refusal list**, with the reason and what would reverse it: project management, plugins/eval, live cursors, a chat sidebar that duplicates the user\'s existing agent, template galleries, dashboards, anything with its own configuration surface.\n' +
    '- **The surface budget.** A hard number: how many top-level concepts a new user may meet in the first session, and what we cut when the budget is exceeded. Cite what is actually known about interface complexity and abandonment, opened with curl where possible.\n' +
    '- **The "one more feature" failure mode**, with named examples of products that died of it. Be specific and fair.\n' +
    '- **What earns a place anyway**: the small number of things so load-bearing they justify their surface. Name them and defend each in one sentence.\n\n' +
    'Target 2000-2600 words.' + HOUSE,
    { label: 'q6-feature-discipline', phase: 'Discipline' }),

  () => agent(
    'Write "## 104. The product in one page — the statement we execute against".\n\n' +
    'Everything above is analysis. This is the commitment: the single page a founder reads to know what they are building, what they are not, and what has to be true.\n\n' +
    'You have the thesis and mechanics sections just written. Read them, plus ' + REC + ' §16 (what no competitor has), §27 (moats), §64 (positioning), BUSINESS §88 (the war-game) if present.\n\n' +
    'The sections just written, for reference:\n\n' +
    thesis.filter(Boolean).map((r, i) => '--- thesis ' + (i + 1) + ' ---\n' + String(r).slice(0, 7000)).join('\n\n') +
    '\n\n' + mech.filter(Boolean).map((r, i) => '--- mechanics ' + (i + 1) + ' ---\n' + String(r).slice(0, 7000)).join('\n\n') +
    '\n\n=== END ===\n\n' +
    'STRUCTURE:\n\n' +
    '104.1 **The product, in one paragraph.** No adjectives, no "seamless", no "powerful". What it is and who it is for. If a stranger cannot repeat it back after one read, rewrite it.\n\n' +
    '104.2 **The one thing it does that nothing else does.** One sentence. Then the evidence that it is true, and the evidence that anyone wants it — including the honest admission if that second evidence does not exist yet.\n\n' +
    '104.3 **The shape of the thing**: what the user installs or opens, where their files live, what happens on first run, what happens when they have no network, and what happens when they have no AI key. Four sentences, four answers.\n\n' +
    '104.4 **What has to be true for this to work.** The load-bearing assumptions, ranked, each with the cheapest test that would falsify it. This is the most useful subsection in the document — a founder should be able to spend one week testing the top three.\n\n' +
    '104.5 **What we are deliberately not doing**, and the cost of each refusal. A refusal with no cost is not a real refusal.\n\n' +
    '104.6 **The first ninety days**, given two founders, a small AI budget and an engine lane that ships before anything visible. Week-level, not day-level. Name what gets sacrificed.\n\n' +
    'Target 1800-2400 words. Every sentence has to earn its place — this is the page that gets read most and skimmed least.' + HOUSE,
    { label: 'q7-one-page', phase: 'Discipline' }),
])

return {
  thesis: thesis.filter(Boolean).length,
  mechanics: mech.filter(Boolean).length,
  discipline: disc.filter(Boolean).length,
}
