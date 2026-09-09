// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r8-aios-spec-buildplan',
  description: 'AIOS utilization, spec-driven-development market, research gap audit, and build-plan inputs',
  phases: [
    { title: 'AIOS', detail: 'how the sgnkai AIOS becomes product for B2B and D2C' },
    { title: 'SpecDD', detail: 'spec-driven development market and the document canon' },
    { title: 'Audit', detail: 'research gaps, unmade architecture decisions, feature completeness' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const R6 = FM + 'docs/research/agent-reports-2026-08-28/'
const R7 = FM + 'docs/research/agent-reports-2026-08-29-r7/'
const PRD = FM + 'docs/FRONTMATTER-PRD-2026-08-29.md'

const COMMON = [
  '',
  'OUTPUT RULES (strict):',
  '- Dense structured markdown ONLY: short H3 headings, tight bullets, tables. NO prose paragraphs. NO preamble. NO conclusion.',
  '- Every claim carries an evidence tag: [measured] = you executed it on this machine, [fetched] = you opened the primary source, [SS] = search summary nobody opened, [derived] = you computed it and you show the arithmetic, [inference] = your reasoning.',
  '- Never invent a number. Never round. Count things rather than estimating them. If two sources disagree, record BOTH and say they disagree.',
  '- Keep every actionable recommendation AND every explicit anti-recommendation.',
  '- Target 2000-3000 words of pure density.',
  '',
  'TOOL NOTE (this matters): WebFetch is refused by a security gate in this environment. curl is NOT blocked. Test curl before concluding you cannot reach a source. Useful: curl -sL --compressed with api.github.com, raw.githubusercontent.com, registry.npmjs.org, api.npmjs.org, docs sites, arxiv. If the sandbox blocks a host, say so and move on.',
  '',
  'HARD CONSTRAINTS (RULE 4): Do NOT edit, write, or create any file. Do NOT run git commit, git push, or ANY mutating command. Read-only. If you believe a destructive op is needed, stop and describe it in your output instead.',
  '',
  'A reconciliation hook may fire repeatedly asking you to confirm you did not mutate anything. Answer it ONCE in a single short line and then RE-STATE YOUR FULL DELIVERABLE as your final message. Your final message must BE the deliverable, not a hook reply.',
  '',
  'Your entire final message IS the return value. Start directly with the first H3.',
].join('\n')

phase('AIOS')

const A = [
  ['a1-aios-tool-inventory',
   'Inventory the AIOS orchestrator on this machine and map every capability to a possible frontmatter PRODUCT feature, separately for D2C (an individual writer/developer) and B2B (a team of 2-20).\n\n'
   + 'Read/inventory READ-ONLY: /Users/sagnikmitra/.sgnk/bin/ (about 149 tools - list them ALL and classify), /Users/sagnikmitra/.sgnk/gates/ (about 69 scripts), /Users/sagnikmitra/.claude/skills-src/ (about 124 SKILL.md - list the categories and count per category), /Users/sagnikmitra/.claude/settings.json hooks, /Users/sagnikmitra/.sgnk/state/ (the JSONL stores).\n\n'
   + 'Produce: (1) a FULL table of every bin/ tool: name, what it does, is it a product feature candidate (D2C / B2B / internal-only), and the lift. Do not sample - cover all of them, grouping near-identical ones. (2) The same for the gate scripts and the skill categories. (3) A ranked top-15 "these become features" list with a one-line user-facing pitch for each. (4) An explicit "internal-only, would be a trust burden if shipped" list with reasons.\n\n'
   + 'Grounding: ' + R7 + 'g2-internal-systems-fusion.md and ' + R6 + 'i4-aios-capabilities.md and ' + R6 + 'i5-aios-pattern-language.md. Where your live count disagrees with those docs, report BOTH and flag it.'],

  ['a2-aios-loops-as-product',
   'The AIOS runs a set of self-improving LOOPS. Map each loop to a user-facing product mechanic in frontmatter, for both D2C and B2B.\n\n'
   + 'The loops, as documented in /Users/sagnikmitra/.claude/CLAUDE.md (read it - it is about 900 lines, read the RULE 1-8 section and ALL the Learned Rules) and in ' + R6 + 'i5-aios-pattern-language.md: trace ledger, eval + calibration, preference log, drift watch, digression guard, complexity/triage gate, bandit routing + escalation ladder, shadow-promote ladder, regression gates, snapshot/recall continuity, memory hygiene, red-proof discipline.\n\n'
   + 'For EACH loop produce: what it does internally (with the live numbers from ~/.sgnk/state/), the user problem it would solve in a document product, the concrete UI or file-level expression of it, D2C value, B2B value, lift, and whether it should ship or stay internal AND WHY. Be specific about what a user would actually see - a panel, a frontmatter key, a report, a gate, a badge.\n\n'
   + 'Then: which loops are DANGEROUS to ship (over-claiming, creepy, or unfalsifiable) and what the honest version of each looks like.'],

  ['a3-aios-as-b2b-surface',
   'Assess whether the AIOS orchestration layer itself is a sellable or embeddable B2B surface, distinct from frontmatter-the-editor.\n\n'
   + 'Consider: multi-tenant agent orchestration, team-level model routing and cost control, agent audit trails, eval/quality gates as a service, prompt/skill registries, agent observability. Read ' + R6 + 'i4-aios-capabilities.md and ' + R7 + 'g2-internal-systems-fusion.md for what exists.\n\n'
   + 'Then research the market with curl: who already sells this (LangSmith, Braintrust, Langfuse, Helicone, Portkey, W&B Weave, Arize Phoenix, OpenAI/Anthropic native tooling, agent observability startups). For each: what they do, price if published, and whether our layer is differentiated or duplicative.\n\n'
   + 'Produce: a verdict with reasoning on (a) sell AIOS separately, (b) embed AIOS capabilities inside frontmatter as features, (c) keep internal. Include the strongest argument AGAINST your verdict. Name the specific slice, if any, that is genuinely differentiated.'],

  ['a4-skills-as-automation-format',
   'Design research: SKILL.md-style markdown documents as frontmatter USER-authorable automations.\n\n'
   + 'Read the real format on this machine: several files under /Users/sagnikmitra/.claude/skills-src/ (read at least 6 across different categories), and note the exact frontmatter keys used (name, description, allowed-tools, capabilities, disable-model-invocation and any others).\n\n'
   + 'Then research with curl the competing conventions: anthropics/skills repo structure, AGENTS.md, CLAUDE.md convention, Cursor .mdc rules, .github/copilot-instructions.md, OpenAI custom GPT instructions, MCP prompts. Get adoption numbers where you can (github stars, npm downloads).\n\n'
   + 'Produce: (1) the exact SKILL.md anatomy as practised here; (2) a comparison table of the competing conventions with adoption; (3) a design for how a NON-technical frontmatter user authors, tests, shares and runs an automation as a markdown document - the frontmatter keys, the safety model, the failure modes; (4) the anti-recommendations (what makes this become a plugin marketplace, which is banned).'],

  ['a5-markdown-processing-assets',
   'Inventory every markdown PROCESSING and RENDERING capability that already exists across this machine and could be absorbed into frontmatter.\n\n'
   + 'Inspect READ-ONLY: /Users/sagnikmitra/Desktop/GitHub/knowledge/ (the pipelines/ and scripts/ dirs - read build_catalog.py, validate.py, _fm.py, scan_paste.py and the pipelines/*.md), /Users/sagnikmitra/Desktop/GitHub/sgnk-campaign/ (make-deck.py, make-carousel.py, make-onefile.py, build-brilliant.py, the 6 check-*.py gates, figures.json), ' + FM + 'docs/mdmap/, ' + FM + 'scripts/, ' + FM + 'src/modules/preview/ and src/modules/export/, and the graphify skill at /Users/sagnikmitra/.claude/skills/graphify/.\n\n'
   + 'For each capability produce: what it does, its input and output, the exact file path, whether it is markdown-in/markdown-out, and what frontmatter feature it becomes. Count things - number of generators, number of gates, number of pipeline stages.\n\n'
   + 'Then: the list of markdown transformations frontmatter should support that NONE of these cover yet, derived from the gaps you see.'],
]

const aios = await parallel(A.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'AIOS' })))

phase('SpecDD')

const B = [
  ['b1-spec-driven-market',
   'Research the SPEC-DRIVEN DEVELOPMENT market as of August 2026. This is a category we have never researched and it is directly adjacent to frontmatter.\n\n'
   + 'Cover at minimum, using curl against github, npm and the vendors docs: GitHub Spec Kit (github/spec-kit), AWS Kiro, Tessl, OpenSpec, BMAD-METHOD, agent-os, Cursor rules/.mdc, AGENTS.md, Claude Code plan mode and its spec conventions, Devin, Factory, Cline memory bank, Roo Code, and any others you find.\n\n'
   + 'For each: what it is, the artifact it produces, the file format and location convention, stars/downloads with the date, licence, whether the spec is markdown, and whether the spec is machine-verified against the code.\n\n'
   + 'Then produce: (1) the shape of the category - what all of them do the same way; (2) what NONE of them do (the gap); (3) whether a markdown editor is a credible home for this workflow or whether the IDE owns it; (4) the honest verdict on whether frontmatter should enter this category at all, including the strongest argument against.'],

  ['b2-document-type-canon',
   'Establish the canonical structure of every project document type frontmatter might generate or render, so we can ship real templates rather than invented ones.\n\n'
   + 'Cover: PRD, FRD, TRD/SRS, ADR (MADR and Nygard forms), RFC (IETF and company-internal forms such as Rust RFCs, Oxide RFDs, Squarespace/Uber style), design doc (Google style), test plan (IEEE 829), runbook, incident postmortem (Google SRE form), user story and acceptance criteria (Gherkin/Given-When-Then), OpenAPI as a spec artifact, and changelog (Keep a Changelog).\n\n'
   + 'Use curl to open the actual canonical sources - the MADR repo, the Keep a Changelog spec, the Google SRE book postmortem chapter, IETF RFC 7322, the Rust RFC template, the Oxide RFD process, Gherkin docs.\n\n'
   + 'For each type produce: the canonical section list, whether a machine-readable standard exists, the frontmatter keys it needs, its status/state machine if any, and which render profile it maps to. Flag which types have NO canonical form and would be us inventing one.'],

  ['b3-prompt-and-context-as-document',
   'Research prompts, context files and instruction files as DOCUMENTS - the input side of the AI build loop.\n\n'
   + 'Cover with curl: .prompty (Microsoft), Promptfile, PromptLayer/Langfuse/Braintrust prompt management, DSPy signatures, Jinja-templated prompts, OpenAI prompt caching and structured outputs, Anthropic prompt caching and tool-use schemas, llms.txt, AGENTS.md, context-window packing conventions, and prompt versioning/testing tools (promptfoo, Braintrust evals, LangSmith).\n\n'
   + 'For each: file format, whether it is markdown, versioning model, testing model, adoption numbers with dates, licence.\n\n'
   + 'Then produce: (1) what a prompt document should look like in frontmatter - exact frontmatter keys, body structure, how variables are declared, how it is tested; (2) how prompt documents relate to spec documents and skill documents (three artifacts, one substrate - or are they the same thing?); (3) the anti-recommendations.'],

  ['b4-ai-build-loop',
   'Map how the leading AI coding systems structure the build loop, and identify where a document product fits.\n\n'
   + 'Research with curl: Claude Code (plan mode, CLAUDE.md, skills, subagents, hooks), Cursor (rules, agent mode, memories), GitHub Copilot Workspace and coding agent, AWS Kiro (spec mode), Devin, Windsurf cascade, Cline/Roo memory bank, OpenAI Codex/Managed Agents, Google Jules/Antigravity if reachable.\n\n'
   + 'For each: the phases they name (e.g. spec, plan, implement, verify), which artifacts PERSIST to disk vs live only in chat, the file conventions, and the documented failure modes users complain about.\n\n'
   + 'Then produce: (1) the common phase model across all of them; (2) exactly which artifacts persist as files today and which evaporate - this is the frontmatter opening; (3) a concrete design for frontmatter as the durable home of that loop: prompt document to spec document to plan document to verification record, with the frontmatter keys and the state machine; (4) whether this competes with or complements the IDE, and the honest risk that the IDE simply absorbs it.'],

  ['b5-spec-conformance-verification',
   'Research how anyone verifies that generated code or generated output actually conforms to a written spec - the verification half of spec-driven development.\n\n'
   + 'Cover with curl where possible: tests-as-specification practice, acceptance-criteria linting, property-based testing (Hypothesis, fast-check, QuickCheck), contract testing (Pact), OpenAPI schema validation and drift detection, JSON Schema, formal methods lite (TLA+, Alloy) usage in industry, LLM-as-judge for spec conformance and its measured reliability, mutation testing, and any tool that claims spec-to-code traceability.\n\n'
   + 'Also research requirement traceability matrices as practised in regulated industries, and whether any modern tool implements them.\n\n'
   + 'Produce: (1) a table of every verification mechanism with what it can and cannot prove; (2) the honest state of the art on "does this code match this spec" - is it solved, partially solved, or unsolved; (3) what frontmatter could credibly offer given we own the DOCUMENT side not the code side; (4) explicit anti-recommendations - what would be over-claiming.'],
]

const specdd = await parallel(B.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'SpecDD' })))

phase('Audit')

const C = [
  ['c1-research-gap-audit',
   'Audit the ENTIRE research corpus for gaps, as the last check before development starts.\n\n'
   + 'Read the PRD at ' + PRD + ' in full. Then list the report files in ' + R6 + ' and ' + R7 + ' and read enough of each to know what it covers (the headings are usually enough - do not read all 196k words).\n\n'
   + 'Produce: (1) a COVERAGE TABLE - every topic area a product of this kind needs researched, marked COVERED (with which report), PARTIAL, or MISSING; (2) the MISSING list ranked by build risk, with what specifically to research and why it matters; (3) topics researched but where the evidence is weak (mostly [SS], stale, or single-source); (4) claims in the PRD that are load-bearing but rest on [SS] - these are the ones that could embarrass us; (5) anything in the PRD that is internally contradictory.\n\n'
   + 'Candidate areas to check coverage on, at minimum: onboarding and activation, accessibility, performance and scale benchmarks, offline and sync architecture, data model and migrations, API design, mobile, search, real-time collaboration, observability, testing strategy, i18n and CJK, error handling and recovery, backup and disaster recovery, SEO for published pages, email and notifications, analytics and privacy, support tooling, documentation, licensing and open-source strategy, community building, competitive moats, and anything else you judge necessary.'],

  ['c2-architecture-decisions',
   'Enumerate every ARCHITECTURE decision that is still unmade or under-specified for frontmatter, and give a recommendation with reasoning on each.\n\n'
   + 'Read ' + PRD + ' sections 7, 8, 24, 28, 30, and inspect the codebase READ-ONLY: ' + FM + 'src/modules/ (14 modules), ' + FM + 'src/app/ (30 routes), ' + FM + 'package.json, ' + FM + 'specs/harness/.\n\n'
   + 'Cover at minimum: offline-first and sync (server-authoritative vs CRDT vs git-as-sync - the PRD has an unresolved contradiction here, resolve it with reasoning), the data model and where state lives, multi-tenancy, storage (git repo vs object store vs both), search architecture at scale, real-time collaboration, the API surface and its versioning, background jobs, caching, the desktop/Tauri story, mobile, migrations, and the boundary between the MDMAX engine and the app.\n\n'
   + 'For each: the options, the tradeoffs, a recommendation, what it costs to change later, and what evidence would change the recommendation. Use curl to check any library or service claim.'],

  ['c3-feature-completeness',
   'Build a FEATURE COMPLETENESS matrix for frontmatter and find what is missing entirely.\n\n'
   + 'Read ' + PRD + ' section 13 (feature inventory) and section 14 (screens). Then enumerate, from your own knowledge and from curl research on the competitors (Obsidian, Notion, Craft, Bear, Ulysses, iA Writer, Typora, HackMD, GitBook, Outline, AppFlowy, AFFiNE, SiYuan, Logseq, Docmost), the full feature space of a markdown document product.\n\n'
   + 'Produce a table: FEATURE | IN OUR PRD? | COMPETITOR PARITY (who has it) | USER DEMAND EVIDENCE | EFFORT S/M/L | PRIORITY for v1 / v2 / never. Cover the unglamorous ones people actually churn over: search quality, keyboard shortcuts, undo/redo, find-and-replace across vault, bulk operations, templates, snippets, tables editing, image handling and paste, attachments, PDF export fidelity, print, mobile editing, offline, backlinks, tags, saved searches, sorting, file management, trash and restore, duplicate detection, encryption, sharing permissions, and anything else.\n\n'
   + 'Then: (1) the MISSING-ENTIRELY list - features not in our PRD at all that a user would expect; (2) the features in our PRD that no competitor has (our real differentiators); (3) the honest v1 minimum feature set to not embarrass ourselves.'],

  ['c4-onboarding-activation',
   'Research ONBOARDING, ACTIVATION and RETENTION for developer and prosumer document tools - an area our corpus barely covers.\n\n'
   + 'Research with curl where possible: published activation-rate benchmarks for developer tools and PLG SaaS, time-to-value benchmarks, the documented onboarding flows of Obsidian, Notion, Linear, Figma, Vercel, Supabase, Raycast; empty-state design; sample/demo content strategies; import as an activation lever; and what specifically causes abandonment in note-taking apps (the Obsidian "never get past the first note" claim needs a real source or a downgrade to [SS]).\n\n'
   + 'Produce: (1) benchmark numbers with sources for signup-to-activation and activation-to-retention in this category; (2) a concrete activation definition for frontmatter (what single action predicts retention) with reasoning; (3) the first-run flow designed against the evidence; (4) the retention mechanics that are honest (not streaks or badges, which are banned); (5) what to instrument to measure it, consistent with our implicit-telemetry-only rule.'],

  ['c5-spec-file-system-design',
   'Design the SPEC FILE SYSTEM that will live in the frontmatter repo and that an AI will read while building the product. This is the artifact the founder will actually build from.\n\n'
   + 'Read: ' + PRD + ' (all of it - this is the source), ' + FM + 'docs/mdmap/ (the existing map convention), ' + FM + 'specs/harness/, ' + FM + 'src/modules/README.md if present, and /Users/sagnikmitra/.claude/CLAUDE.md for the working rules the AI must obey.\n\n'
   + 'Produce a concrete design: (1) the directory layout under a specs/ or docs/specs/ root, with exact paths; (2) for each spec file TYPE, the exact frontmatter keys and the body section list; (3) how a spec references the PRD section it implements, and how it references the code it governs; (4) the state machine (draft, ready, in-progress, implemented, verified, superseded); (5) how specs stay in sync with code and what detects drift; (6) the index/map file that lets an agent find the right spec without reading everything, and its token budget; (7) a WORKED EXAMPLE - write out one complete spec file for a real frontmatter feature (pick the kanban render profile or the MCP server) so the format is concrete, not abstract.\n\n'
   + 'Ground it in what actually works for agents: small files, explicit paths, budget-bounded indexes, machine-write zones, append-only decisions. Anti-recommendations: what makes a spec system rot.'],

  ['c6-build-plan-inputs',
   'Produce the raw inputs for a real DEVELOPMENT PLAN for frontmatter, built by one founder using AI assistance.\n\n'
   + 'Read ' + PRD + ' sections 7, 13, 23, 24, 26, 29, 30 and inspect the codebase READ-ONLY to establish what already exists vs what must be built.\n\n'
   + 'Produce: (1) a WORK BREAKDOWN - every deliverable from now to a public v1, as discrete units with a size (XS/S/M/L/XL), its dependencies, and whether it is engine, product, infra, or go-to-market; (2) the CRITICAL PATH through them; (3) a milestone structure with a名-free, concrete DEFINITION OF DONE per milestone that is testable, not aspirational; (4) what can be parallelised by an AI agent vs what needs the founder serially; (5) realistic calendar estimates given the PRD says about one substantial surface per 2-3 weeks solo, and state your assumption explicitly; (6) the top 10 things most likely to blow the estimate, each with an early-warning signal.\n\n'
   + 'Be concrete about the R0 engine work (NF-1 through NF-4, CI, wiring MDMAX in - it is currently imported by zero product files) since that is the declared first lane. Do not invent features that are not in the PRD.'],
]

const audit = await parallel(C.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Audit' })))

return {
  aios: A.map((x, i) => ({ label: x[0], text: aios[i] })),
  specdd: B.map((x, i) => ({ label: x[0], text: specdd[i] })),
  audit: C.map((x, i) => ({ label: x[0], text: audit[i] })),
}
