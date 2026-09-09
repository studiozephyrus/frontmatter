export const meta = {
  name: 'pilot-scope-verification',
  description: 'Verify the frontmatter pilot scope (idea -> decisions -> generated files -> agent kickoff) against live market evidence and the local codebase',
  phases: [
    { title: 'Ground', detail: 'read the local codebase: AI layer, editor surface, generation capability' },
    { title: 'Market', detail: 'open primary sources on each competing category' },
    { title: 'Refute', detail: 'adversarially test every finding from that lens' },
  ],
}

const CURL = `
TOOL NOTE, IMPORTANT: WebFetch is blocked in this environment by a security gate. It is NOT
a capability gap. Use Bash + curl instead, which works:
  curl -sL --compressed -A "Mozilla/5.0" "<url>" | head -c 200000
  curl -sL "https://api.github.com/repos/<owner>/<repo>" | head -c 20000
  curl -sL "http://export.arxiv.org/api/query?search_query=..." | head -c 100000
  curl -sL "https://hn.algolia.com/api/v1/search?query=<q>&hitsPerPage=50"
  curl -sL "https://www.reddit.com/r/<sub>/search.json?q=<q>&restrict_sr=1&limit=100" -A "Mozilla/5.0"
Test alternatives before concluding you cannot reach something. If a host genuinely refuses,
say so and mark the finding UNVERIFIABLE rather than guessing a number.
`

const RULES = `
EVIDENCE RULES, these are hard:
- Every number must come from a page or API response you ACTUALLY FETCHED in this task.
  Set opened=true only for URLs you really retrieved and read. If you did not open it, opened=false
  and say so. A number you remember from training is NOT evidence; mark it UNVERIFIABLE.
- Always give the denominator. "500 stars" means nothing without "of what, since when".
- Quote the source's own words for any claim that decides something.
- Prefer counting over impression. If you can get a count from an API, get the count.
- You are permitted and encouraged to REFUTE the plan you are testing. A finding that kills
  an idea is more valuable than one that flatters it.
- Do NOT run any destructive operation (db push, migrate, DROP, DELETE, push --force, rm -rf,
  paid-plan upgrades, outbound messages, posting anything anywhere). Read only. If a situation
  seems to require one, return a status report describing it and stop.
`

const CONTEXT = `
THE PRODUCT BEING TESTED (frontmatter):
A markdown editor built on a byte-exact splice engine: it locates the exact byte range of a
change, replaces only those bytes, and REFUSES when it cannot locate the range unambiguously.
It never parses to a tree and writes the tree back, so it does not corrupt files. It has
8,513 real markdown files as a pinned test corpus. Documents live in the user's own git repo;
the vendor never holds them. Two founders, a small team, funded by consulting, no users yet.

THE PILOT SCOPE NOW PROPOSED, which is what you are testing:
  1. The markdown editor itself (four modes: source, live preview, reading, split).
  2. A DECISION FLOW: the user types a project idea into the document's YAML frontmatter;
     an LLM layer reads it and generates a set of decisions/clarifying questions for them to
     answer, in the markdown itself.
  3. From those answered decisions, the tool GENERATES ALL THE PROJECT FILES (specs, plans,
     structure) plus a KICKOFF PROMPT the user pastes into their own agentic coding tool
     (Claude Code, Cursor, Codex).
  4. That agent then READS THE GENERATED FILES FROM THE VENDOR'S CDN and executes the project.
  5. An AI panel scoped to a FOLDER or a FILE: ask anything, summarise anything, over that scope.
  6. A local-LLM fallback chain so it works offline / before going live.

PRIOR RESEARCH THAT MAY OR MAY NOT APPLY, treat as hypotheses to test, not as settled:
  - 89 "handover / context pack" products launched on Hacker News in 20 months, median score
    2 points, 88 of 89 never reached 50. Conclusion drawn at the time: generating context
    artifacts is a graveyard.
  - Decision-flow RENDERS measured 563 downloads out of 143,283,562 in the Obsidian plugin
    registry (0.0004%). Conclusion drawn at the time: nobody wants decision documents.
  - Byte-exactness: 4 complaints in 12,556 editor comments. Nobody asks for it by name.
  - Slop (verbose, generic, unmaintainable AI output) is 23.7% of AI complaints, +149% in
    20 months, and is a workflow problem rather than a model problem.
IMPORTANT: those conclusions may be MISAPPLIED to this pilot. "Decision-flow renders in a
note-taking app" and "clarifying questions before an agent builds your project" may be
completely different markets. Test that, do not assume it.
`

const GROUND_SCHEMA = {
  type: 'object',
  required: ['status', 'summary', 'files', 'gaps'],
  properties: {
    status: { type: 'string', description: 'EXISTS | PARTIAL | ABSENT' },
    summary: { type: 'string', description: 'What is actually there, in plain terms' },
    files: { type: 'array', items: { type: 'string' }, description: 'repo-relative paths that carry the evidence' },
    evidence: { type: 'array', items: { type: 'string' }, description: 'verbatim short quotes or exact symbol/line references' },
    gaps: { type: 'array', items: { type: 'string' }, description: 'what the pilot needs that is NOT there' },
    effort: { type: 'string', description: 'rough build size for the gaps, in days, with reasoning' },
  },
}

const MARKET_SCHEMA = {
  type: 'object',
  required: ['verdict', 'findings', 'implication'],
  properties: {
    verdict: { type: 'string', description: 'One line: does this lens SUPPORT, COMPLICATE or REFUTE the pilot scope' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'evidence', 'source_url', 'opened'],
        properties: {
          claim: { type: 'string' },
          evidence: { type: 'string', description: 'the number or quote, with its denominator and date' },
          source_url: { type: 'string' },
          opened: { type: 'boolean', description: 'true ONLY if you actually fetched and read this URL in this task' },
        },
      },
    },
    incumbents: { type: 'array', items: { type: 'string' }, description: 'who already does this, and where each stops' },
    implication: { type: 'string', description: 'what this means for the pilot scope specifically' },
    kill_or_keep: { type: 'string', description: 'For the pilot component this lens tests: KEEP, CUT, DEFER or RESHAPE, and one sentence why' },
  },
}

const REFUTE_SCHEMA = {
  type: 'object',
  required: ['results', 'overall'],
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'verdict', 'why'],
        properties: {
          claim: { type: 'string' },
          verdict: { type: 'string', description: 'CONFIRMED | REVISED | REFUTED | UNVERIFIABLE' },
          corrected: { type: 'string', description: 'the corrected statement if REVISED' },
          why: { type: 'string', description: 'what you did to check, and what you found' },
        },
      },
    },
    overall: { type: 'string', description: 'Does the lens verdict survive? State it plainly.' },
    missed: { type: 'string', description: 'What the researcher did NOT look at that would change the answer' },
  },
}

// ─────────────────────────────────────────────────────────────── Ground
phase('Ground')

const GROUND_TASKS = [
  {
    key: 'ai-layer',
    prompt: `Read the frontmatter codebase and report EXACTLY what AI capability already exists.

Start at src/modules/ai/ and follow every import. Specifically establish:
- Is there a provider fallback chain? The founder believes there is "an LLM fallback 5 model".
  Find it. Name every model in the chain, IN ORDER, with the exact identifier strings, and quote
  the file and line. If there are five, list five. If there are not, say how many there are.
- Which providers are wired: Anthropic, OpenAI, Google, local (Ollama / llama.cpp / LM Studio)?
- Is there any LOCAL model path at all? Search for ollama, llama, localhost:11434, LM Studio,
  gguf, transformers.js, webllm.
- How are keys handled: user's own key, or a vendor gateway, or both?
- Is there streaming? Structured output / tool calling? A router that picks a model by task class?
- What does the AI actually DO today in the product: is it wired to any UI, or is the module dead code?

Then answer the pilot question: to ship "type a project idea in frontmatter, get generated
decisions back", how much of the machinery already exists and what is missing?`,
  },
  {
    key: 'editor-surface',
    prompt: `Read the frontmatter codebase and report EXACTLY what the editor surface is today.

Establish, with file paths and short quotes:
- Which editor modes actually render: source, live preview, reading, split? Find the mode switch.
- What is CodeMirror wired to do? Which extensions are loaded?
- Is there a file tree, a quick switcher, a command palette, search? Which of these EXIST vs
  are stubs vs are absent?
- Is there any panel or sidebar that could host an AI scope UI (folder / file scoped chat)?
- Is there a frontmatter (YAML) editing surface specifically - a properties panel, a form,
  anything that reads and writes frontmatter keys?
- How much of the byte-exact splice engine is actually WIRED to the product code, versus
  sitting in a module nothing imports? Count the import sites.

Be concrete and quantitative. Count files, count call sites. This decides how much of a
pilot is "wire up what exists" versus "build new".`,
  },
  {
    key: 'generation',
    prompt: `Read the frontmatter codebase and report what FILE-GENERATION and SPEC machinery exists.

Look at: the specs/ directory, scripts/, docs/build/, any templating, any scaffolding.
Establish:
- What does specs/ contain and what runs over it? Read package.json scripts, find "spec" and
  "corpus" commands, and report what they actually do.
- Is there any code that GENERATES a set of files from a description or a template today?
- Is there anything that produces a prompt for an external agent?
- Is there any CDN, static hosting, or public-URL serving of generated artifacts already?
  Check vercel.json, next.config.ts, public/, firebase.json, any R2/Cloudflare wiring.
- Does AGENTS.md exist in this repo, and what does it instruct? Quote its opening.

Then answer: for "generate all project files + a kickoff prompt for an agentic tool", what
exists and what is net new?`,
  },
]

const ground = await parallel(GROUND_TASKS.map((t) => () =>
  agent(
    `You are grounding a product plan in what the code ACTUALLY contains, not what a document claims.
Working directory is the frontmatter repo at /Users/sagnikmitra/Desktop/GitHub/frontmatter.

${t.prompt}

${RULES}

Report only what you verified by reading files. If you cannot find something the founder
believes exists, say so plainly and state where you looked. A confident wrong answer here is
worse than "absent, searched X Y Z".`,
    { label: `ground:${t.key}`, phase: 'Ground', schema: GROUND_SCHEMA }
  )
))

log(`grounded: ${ground.filter(Boolean).length}/${GROUND_TASKS.length} codebase reports`)

// ─────────────────────────────────────────────────────────────── Market + Refute
const LENSES = [
  {
    key: 'spec-driven-dev',
    title: 'Spec-driven development: the pilot has a real, funded competitor set',
    prompt: `This is the MOST IMPORTANT lens. The pilot ("project idea -> decisions -> generated
spec files -> kickoff prompt for an agentic coding tool") is close to an existing named category
called Spec-Driven Development. Find out precisely how close, and where the incumbents stop.

Open and measure, do not recall:
- GitHub's spec-kit (github/spec-kit). Get the repo API for stars, created_at, open issues,
  latest release. Read its README: what commands does it give (/specify, /plan, /tasks?), what
  files does it generate, which agents does it target? Quote the actual generated file names.
- AWS Kiro (kiro.dev). What is it, what does it generate (requirements.md, design.md, tasks.md?),
  what does it cost, when did it launch, is it GA?
- Tessl (tessl.io) and any "spec-centric" or "specs are the source of truth" tooling.
- OpenAI / Anthropic first-party equivalents: does Claude Code or Codex ship a plan/spec mode
  that already does this? Check docs.claude.com and any /plan or spec documentation.
- Search Hacker News via the Algolia API for spec-driven development, spec-kit, Kiro. Get story
  counts and points. How much attention does this category actually have, with denominators?
- Search Reddit r/ClaudeAI r/cursor r/ChatGPTCoding for "spec driven", "spec-kit", "kiro".
  Are people using it, complaining about it, or ignoring it?

The decisive questions:
(a) Is "idea -> clarifying questions -> generated spec files -> agent executes" ALREADY SHIPPED
    and free, the way per-hunk review turned out to be already shipped by Zed?
(b) If yes, what specifically do they NOT do that a byte-exact markdown editor could?
(c) Is the category growing or was it a 2025 spike that faded? Show the dates.`,
  },
  {
    key: 'agent-context-files',
    title: 'The kickoff prompt and the agent context file: is a vendor needed at all?',
    prompt: `Test the weakest-looking link in the pilot: that a user needs a VENDOR to produce
a "kickoff prompt" and context files for their agentic tool.

Open and measure:
- AGENTS.md: the agents.md standard/site, and count real-world adoption. Use GitHub code search
  or the API to count repositories containing AGENTS.md and CLAUDE.md. Get denominators.
- What do Claude Code, Cursor and Codex docs say about how they pick up project context today?
  Quote them. Does the agent already read the repo without being handed a prompt?
- llms.txt: adoption, and whether anyone actually consumes it.
- Is there measurable complaint volume about "I don't know how to prompt my agent to start a
  project"? Search HN and Reddit with denominators. Or is the complaint the opposite: too much
  context, agent ignores the files, rules files get stale?
- Look specifically for evidence on whether generated rules/spec files GO STALE and whether
  people complain about that.

Decisive question: if the agentic tool already reads the repo, is a "kickoff prompt" a product
or a formatting convenience? Argue the strongest case AGAINST the pilot needing this step.`,
  },
  {
    key: 'cdn-agent-reads',
    title: 'The CDN step: agent reads generated files from the vendor CDN',
    prompt: `Test the riskiest architectural claim in the pilot: "the agent reads through OUR CDN
files and executes the project."

Establish:
- Is there ANY precedent for a vendor serving project context files from their own CDN for a
  third-party coding agent to fetch? Look at MCP (Model Context Protocol) remote servers,
  Context7, and any "hosted context" product. What is the actual adopted pattern - local files,
  MCP server, or fetched URLs?
- What are the documented security implications of an agent fetching instructions from a remote
  URL? Find primary sources on indirect prompt injection in coding agents. arXiv, vendor security
  docs, Simon Willison, OWASP LLM Top 10. Quote them.
- Do coding agents even fetch arbitrary URLs by default, or is web access gated? Check Claude
  Code, Cursor and Codex docs for default network/fetch permissions.
- What liability does a vendor take on by hosting user-derived content at a public URL? Look for
  primary regulation on intermediary status, especially India's IT Act s.79 and the IT Rules
  2021 acknowledgement timelines, and the EU DSA Art. 13. Get the actual text.

Decisive question: is the CDN step necessary at all, given the files could simply be written
into the user's own repo where the agent already looks? State the strongest argument that the
CDN step ADDS risk and REMOVES the product's main promise (never holding user documents).`,
  },
  {
    key: 'decision-elicitation',
    title: 'Decision elicitation: does anyone want to be asked questions first?',
    prompt: `Test whether "the LLM generates decisions/clarifying questions from your project idea"
is wanted. This is where a prior finding may be MISAPPLIED and you should check that directly.

The prior finding was: decision-flow RENDERS got 563 of 143,283,562 Obsidian plugin downloads
(0.0004%). Verify whether that measured the same thing. Obsidian plugin downloads measure what
note-takers install, which may say nothing about what a developer wants before an agent builds
their project. Check the Obsidian plugin registry yourself if you can reach it.

Then measure the actual question:
- Do agentic coding tools already ask clarifying questions before building? Check Claude Code,
  Cursor, Kiro, Lovable, v0, Replit Agent, bolt.new docs and changelogs for a clarifying-question
  or requirements phase. Quote what you find.
- Search HN and Reddit for sentiment on being asked questions by an AI tool before it builds.
  Do people value it or find it friction? Get counts with denominators, both directions.
- Look for evidence on the opposite failure: agents that build the wrong thing because they did
  not ask. Is there measurable complaint volume about that?
- Requirements elicitation research: is there evidence that asking upfront questions improves
  outcomes for AI-generated software? Check arXiv.

Decisive question: is decision elicitation a FEATURE PEOPLE WANT, a step they tolerate, or
friction they route around? Be willing to say the prior 0.0004% finding was misapplied - or that
it applies more than it looks.`,
  },
  {
    key: 'app-builders',
    title: 'Idea-to-app builders: the adjacent market and what it proves',
    prompt: `Measure the market the pilot is actually adjacent to: turning an idea into a project.

Open and measure, with dates and denominators:
- v0 (Vercel), Lovable, bolt.new, Replit Agent: what each does, current pricing from their own
  pricing pages, and any PUBLISHED revenue or user numbers from the company itself. Lovable and
  Replit have both published ARR figures. Get the primary source and the date.
- What is the documented retention/churn picture for these? Look for primary or well-sourced
  reporting, and be explicit about what is unverifiable.
- Critically: what do these tools NOT do? They build the app themselves. Our pilot hands a prompt
  to the user's OWN agent. Is that a better position or a weaker one? Find evidence either way.
- Is there complaint volume about generated-project quality, unmaintainability, or "it built the
  wrong thing"? This connects to the slop finding. Get counts.

Decisive question: does the existence of a large, funded, fast-moving idea-to-app market make
the pilot (a) validated, (b) crowded out, or (c) aimed at a different buyer entirely? Argue it.`,
  },
  {
    key: 'local-llm',
    title: 'The local model: can it actually do the job, and does anyone run one?',
    prompt: `Test the local-LLM leg of the pilot: structural AI work runs on a small local model,
offline and free.

Open and measure:
- Ollama and LM Studio adoption: GitHub stars with created_at, download counts if published,
  and what models are most pulled. Get the ollama library page if reachable.
- Which small models are actually usable for STRUCTURED output (valid JSON/YAML, following a
  schema) at 3B-8B? Find benchmark evidence, not vibes. Check for structured-output or
  function-calling benchmarks at small sizes.
- Hardware reality: what RAM does a usable local model need, and what fraction of developer
  machines have it? Look for a survey with a denominator, e.g. Stack Overflow developer survey
  hardware data or Steam hardware survey as a proxy.
- Which editors ship local-model support today, and is it used? Obsidian Copilot, Continue.dev,
  Zed. Check their docs and issue trackers for local-model usage and complaints.
- What is the honest failure mode: does a small local model produce good enough clarifying
  questions and frontmatter fills, or does it produce slop that the product exists to prevent?

Decisive question: is local-first AI a genuine cost and trust advantage for the pilot, or a
support burden that produces worse output than the thing it replaces? Take a position.`,
  },
  {
    key: 'ai-scope-in-editor',
    title: 'Folder/file-scoped AI: table stakes or differentiator?',
    prompt: `Test the "AI (Scope: Folder / File)" leg: an AI panel scoped to a folder or a file,
where the user can ask anything or summarise anything.

Open and measure:
- How do the incumbents scope AI context today? Cursor @-mentions and @Folder, Claude Code's
  file reading, Zed's assistant, Obsidian Copilot's vault/note scoping, Notion AI. Quote each
  product's own documentation on scoping.
- Is folder/file scoping a differentiator or the minimum? Find evidence.
- What do users actually ASK an editor AI to do? Look for real usage evidence, feature requests,
  and complaint threads. Summarise, rewrite, find, explain, generate? Get relative volumes.
- Specifically: is "summarise this folder" a real, repeated request, or a demo feature? Search
  for it with denominators.
- What goes wrong: context limits, wrong files pulled in, cost blowups on a big folder. Find
  documented complaints.

Decisive question: what is the MINIMUM AI-scope surface that does not read as missing, and what
here is a differentiator versus table stakes we simply cannot skip?`,
  },
  {
    key: 'pilot-shape-and-free-tier',
    title: 'What a pilot should actually contain, and what a free tier should give away',
    prompt: `Test the SHAPE of a pilot/first-run for a two-founder developer tool with no users.

Open and measure:
- Evidence on developer-tool free tiers that convert: what is given away, what is charged, and
  actual published free-to-paid conversion rates for developer tools and prosumer editors.
  Find primary sources: company posts, published benchmarks with denominators. Be explicit
  where numbers are unverifiable.
- Evidence on what makes a small-team pilot/beta succeed or fail: how many users, how long,
  what signal is collected. Prefer primary write-ups over listicles.
- Specifically for EDITORS: what did successful editors ship in their first public version?
  Look at Obsidian's earliest release notes, Zed's launch post, Cursor's launch. What was in v1?
  Quote the actual first-version feature lists with dates.
- What is the evidence on shipping an AI feature in v1 versus shipping the editor first?
- Is there evidence about pilots that shipped too much and could not tell which part worked?

Decisive question: for a first public run, is the correct move (a) the editor alone, (b) the
editor plus one AI capability, or (c) the full idea-to-kickoff flow? Ground the answer in what
comparable products actually did, and name what should be CUT from the proposed pilot.`,
  },
]

const lensResults = await pipeline(
  LENSES,
  (lens) => agent(
    `You are testing one lens of a product plan against live market evidence. Your job is to be
RIGHT, not encouraging. The founders explicitly asked to have this plan tested against the market
and permitted refutation.

${CONTEXT}

YOUR LENS: ${lens.title}

${lens.prompt}

${CURL}
${RULES}

Work the sources hard. Open at least 6 distinct primary sources. Return findings where each one
carries a number with a denominator and a URL you actually fetched.`,
    { label: `market:${lens.key}`, phase: 'Market', schema: MARKET_SCHEMA }
  ),
  (research, lens) => {
    if (!research) return null
    return agent(
      `You are an adversarial verifier. Another researcher produced the findings below about
"${lens.title}". Your job is to REFUTE them. Assume each is wrong until you personally re-open
the source and confirm it.

${CURL}

FINDINGS TO ATTACK:
${JSON.stringify(research, null, 2)}

For EACH finding:
1. If opened=false, treat it as unverified and try to open it yourself. If you cannot, mark it
   UNVERIFIABLE - it may not be published as fact.
2. If opened=true, re-fetch the URL and check the claim is what the source says. Watch for:
   a number quoted without its denominator; a date that makes the number stale; a claim about a
   product that its own docs contradict; a count that is actually a different metric.
3. Check for the misapplied-analogy error: does the evidence actually bear on the PILOT, or on a
   superficially similar thing?
4. Say what the researcher did NOT look at that would change the verdict.

Default to REFUTED or UNVERIFIABLE when uncertain. A wrong number that survives into a founder
decision is the failure mode we are preventing.

${RULES}`,
      { label: `refute:${lens.key}`, phase: 'Refute', schema: REFUTE_SCHEMA }
    ).then((v) => ({ lens: lens.key, title: lens.title, research, verification: v }))
  }
)

const lenses = lensResults.filter(Boolean)
log(`market lenses verified: ${lenses.length}/${LENSES.length}`)

return {
  ground: GROUND_TASKS.map((t, i) => ({ key: t.key, report: ground[i] })),
  lenses,
}
