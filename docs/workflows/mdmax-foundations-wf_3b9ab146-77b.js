export const meta = {
  name: 'mdmax-foundations',
  description: 'Research the unexplored foundations of MDMAX: package/import model, format governance, transitive doc graphs, editor frontier, AI-to-AI markdown, and an adversarial gap audit',
  phases: [
    { title: 'Research' },
    { title: 'Verify' },
    { title: 'Synthesize' },
  ],
}

const FINDINGS = {
  type: 'object',
  required: ['area', 'headline', 'findings', 'recommendation', 'unverified'],
  properties: {
    area: { type: 'string' },
    headline: { type: 'string', description: 'One sentence: the single most decision-relevant thing found' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'evidence', 'tier'],
        properties: {
          claim: { type: 'string' },
          evidence: { type: 'string', description: 'Concrete: numbers, verbatim quotes, URLs, source files' },
          tier: { type: 'string', enum: ['primary-read', 'secondary', 'search-only', 'inference'] },
        },
      },
    },
    recommendation: { type: 'string', description: 'What MDMAX should DO about this, concretely' },
    unverified: { type: 'array', items: { type: 'string' }, description: 'What you could NOT verify' },
  },
}

const GUARD = `
CRITICAL RULES: Read-only research. Write nothing outside $TMPDIR. Do NOT run git commit/push,
do NOT modify any repo file, do NOT run destructive commands. If something appears to require a
destructive op, stop and report it instead.
TOOLING: WebFetch may be blocked by a local taint gate this session. Route around it with
WebSearch and direct curl to allowlisted hosts (arxiv.org, raw.githubusercontent.com,
api.github.com, registry.npmjs.org, docs sites). Label every claim's evidence tier honestly.
Prefer reading primary source (spec text, source code, registry APIs) over blog summaries.
`

const AREAS = [
  {
    key: 'package-model',
    prompt: `Research question for MDMAX, a markdown compiler project. THE PROPOSED IDEA: markdown gains a
LIBRARY/IMPORT system, like Python. A document declares an import; the compiler then understands
constructs that library defines (e.g. charts). Without the import, nothing special happens — the file
is plain markdown. Libraries would be hosted by the vendor.

QUESTION: Does a document format ever successfully acquire a package ecosystem, and what governs it?

Research with PRIMARY sources:
1. **LaTeX / CTAN** — the most successful document-format package ecosystem ever. How many packages? How
   does \\usepackage resolve? What is the CTAN governance model? What happens when a package is missing
   (error? degradation?). What is the versioning story, and why is it famously painful?
2. **Typst packages** — the modern redesign. #import "@preview/name:0.1.0". Get the exact syntax, the
   registry model, the namespace (@preview vs @local), version pinning, and the SECURITY model (Typst
   plugins are WASM, pure, sandboxed — get the exact contract).
3. **Racket collections + #lang** — a file names a language; the language is installed. How does
   resolution work, what is the restricted grammar of a #lang name, what error on unknown?
4. **R Markdown library() and Quarto _extensions/** — the closest markdown-adjacent analogue. How does
   Quarto's extension system work? Where do extensions live? Can a .qmd declare one, or must the project?
5. **Pandoc filters** — supplied on the COMMAND LINE, never embedded. Find Pandoc's stated reason.
6. **npm / PyPI supply-chain security** — typosquatting, dependency confusion, post-install scripts,
   the xz/event-stream class of attack. What would a markdown package registry inherit?
7. **Anything else**: Sphinx extensions, MkDocs plugins, Obsidian plugins, VS Code extensions, Homebrew taps.

ANSWER DIRECTLY:
(a) Has a DOCUMENT format (not a programming language) ever successfully acquired a package ecosystem?
    Name the cases and the mechanism. If the answer is "only LaTeX", say so.
(b) What is the minimum viable registry design — namespacing, versioning, resolution, offline behaviour?
(c) What MUST happen when the library is absent? Enumerate options and recommend one.
(d) What is the security surface, concretely? Be specific about what a malicious markdown library could do.
(e) Is "vendor-hosted libraries" a moat or a liability? Argue both sides with evidence.
${GUARD}`,
  },
  {
    key: 'governance',
    prompt: `Research question for MDMAX, a markdown compiler project. QUESTION: HOW DOES A FORMAT OR LANGUAGE
ACTUALLY GET IMPROVED, and why has markdown stopped improving?

The project wants to "improve markdown for the whole world" rather than fork it. That requires
understanding the machinery by which languages evolve.

Research with PRIMARY sources:
1. **C++ / ISO WG21** — the paper process, study groups, the 3-year train model, how a feature gets in.
   What does it cost in time? Who can propose?
2. **Python / PEP** — the PEP process, BDFL then the Steering Council. Get the PEP 1 process description.
   How long does a typical PEP take? What kills a PEP?
3. **Rust RFC** — the RFC repo, FCP, why they chose it.
4. **TC39 stages 0-4** — the staging model for JavaScript. What is the bar for each stage? Cite the process doc.
5. **WHATWG living standard vs W3C** — HTML abandoned versioned specs. Why? What did that change?
6. **CommonMark itself — THE CRITICAL CASE.** The spec is 0.31.2. Find: when was the last substantive
   change? What is the actual governance? Look at the talk.commonmark.org threads on generic attributes
   and directives (both ran ~10 years, ~316 combined posts, no resolution). Look at the commonmark-spec
   GitHub repo: commit frequency, open issue count, maintainer activity. IS COMMONMARK DEAD OR DORMANT?
   Get evidence, not opinion.
7. **GFM** — GitHub's spec is still v0.29 and does not document GitHub's own alerts. What does that say
   about how markdown actually evolves in practice?
8. **How did GFM alerts, mermaid, and frontmatter ACTUALLY spread?** Not via spec. Trace the mechanism.

ANSWER DIRECTLY:
(a) Is there any viable path to changing CommonMark itself? Evidence-based yes/no.
(b) If not, what is the actual mechanism by which a markdown convention spreads? State it as a repeatable
    playbook with named preconditions.
(c) What governance model should MDMAX adopt for its own constructs — and how does it avoid becoming
    another dead dialect?
(d) Is there prior art for "improve the format WITHOUT owning the spec"? Name it.
${GUARD}`,
  },
  {
    key: 'doc-graph',
    prompt: `Research question for MDMAX, a markdown compiler project. THE GOAL: a SINGLE root markdown file that
transitively references hundreds of markdown files, each of which may reference hundreds more — so that
handing someone ONE file hands them the entire corpus. A "markdown content dashboard."

QUESTION: What is the prior art, what breaks, and what is the right design?

Research with PRIMARY sources:
1. **Obsidian MOCs (Maps of Content)** and Zettelkasten hub notes — the community pattern. How deep do
   people actually go? What are the documented failure modes (link rot, orphans, hub bloat)?
2. **mdBook SUMMARY.md**, **Sphinx toctree**, **Docusaurus sidebars.js**, **Jekyll collections**,
   **GitBook**, **Nextra _meta.json** — every static-site generator's table-of-contents mechanism. For
   each: is the tree declared in ONE file or distributed? Nested or flat? What happens to an unlisted file?
3. **llms.txt** — explicitly designed as a root file pointing at a corpus for LLMs. Get the spec, and get
   the honest adoption evidence.
4. **sitemap.xml + sitemap index files** — the web's answer to exactly this problem, including the
   50,000-URL / 50MB limit and the sitemap-of-sitemaps pattern. What are the actual limits and why?
5. **Repomix / gitingest** — one file containing many. Already researched, so only cover what's NEW:
   specifically whether any of them emit a NAVIGABLE index vs a flat concatenation.
6. **Transclusion**: AsciiDoc include::, Sphinx .. include::, Markdown's lack of one, Obsidian ![[embed]].
   What are the cycle-detection and depth-limit stories?

ANSWER DIRECTLY:
(a) When you hand an LLM a root file with links, does it FOLLOW them? Find evidence. This is the crux —
    if models do not traverse, the dashboard idea needs the content inlined, not linked.
(b) What is the max useful depth and breadth before the structure stops working? Any evidence?
(c) Should the root be an INDEX (links) or a CONTAINER (inlined content) or both? Recommend with evidence.
(d) What metadata must each entry carry so a consumer can decide whether to fetch it?
(e) How do you prevent cycles and unbounded expansion?
${GUARD}`,
  },
  {
    key: 'editor-frontier',
    prompt: `Research question for MDMAX, which will ship as an editor called "frontmatter" (a markdown editor with
a Free/Pro/Max tier). QUESTION: WHAT MARKDOWN EDITOR FEATURES DO NOT EXIST ANYWHERE IN THE INDUSTRY?

The brief is explicit: the Max tier should offer features unseen in the industry. So find the frontier
and the gaps.

Research with EVIDENCE (feature lists, changelogs, forum requests, issue trackers):
1. **Survey what the best editors actually ship**: Obsidian, Notion, Typora, iA Writer, Bear, Craft,
   Logseq, Roam, Zettlr, Marktext, HackMD/CodiMD, Dropbox Paper, Coda, Anytype, Capacities, Reflect,
   Tana, Amplenote. For each, the ONE thing it does that others do not.
2. **What do users repeatedly ask for that NOBODY ships?** Mine forum/issue evidence: Obsidian forum
   feature requests, Notion community, r/ObsidianMD, Logseq issues. Look specifically for high-vote
   requests that remain unbuilt across ALL products — those are the real gaps.
3. **AI features in editors today** — what does Notion AI / Obsidian Copilot / Cursor-for-docs actually do?
   Where is it thin?
4. **Editor features from OTHER domains that have never crossed into markdown**: IDE features (go-to-
   definition, find-references, refactor-rename, call hierarchy, inline diagnostics, code lens,
   breakpoints), spreadsheet features (formulas, dependency graphs, what-if), CAD (constraints),
   DAW (non-destructive editing, versioned takes), Figma (multiplayer, components, variants, auto-layout).
   Which of these have a natural markdown analogue that nobody has built?
5. **What is genuinely impossible today and would need a compiler?** e.g. rename a heading and have every
   link across 4,000 files update; find all references to a block; "what changed semantically since
   last week"; type-check frontmatter across a vault.

ANSWER DIRECTLY:
(a) List the 10 highest-value features that DO NOT EXIST in any markdown editor today, ranked by
    (user demand evidence) x (requires-a-compiler-to-build). Be specific and concrete.
(b) For each, say what makes it impossible without a compiler.
(c) Which of these would a user pay for, and what is the evidence?
(d) What is the single most defensible "unseen in the industry" feature?
${GUARD}`,
  },
  {
    key: 'ai-to-ai',
    prompt: `Research question for MDMAX. THE USER'S CORE MOTIVATION, in their words: "if we can improve the
communication between one AI and another AI — my manager generates output from his AI, gives it to me,
I ask my AI to summarize and do this task. The communication should be proper."

QUESTION: How do AI systems actually exchange documents/context today, and is markdown the right carrier?

Research with PRIMARY sources:
1. **Agent-to-agent protocols**: Google A2A (Agent2Agent), MCP (Model Context Protocol), IBM/Linux
   Foundation ACP, AGNTCY, Microsoft's agent frameworks. For EACH: what is the actual payload format
   (JSON? markdown? opaque?). Read the spec/schema, not the marketing. Does ANY of them carry markdown?
2. **MCP specifically** — the content block types, resources, prompts. Is markdown privileged anywhere?
   Get the schema.
3. **Handoff formats in multi-agent frameworks**: LangGraph state, CrewAI task output, AutoGen messages,
   OpenAI Swarm/Agents SDK handoffs. What is passed between agents, in what format?
4. **Context/memory formats**: how do agent memory systems serialize? mem0, Letta/MemGPT, Zep. Markdown?
5. **The "AI output becomes AI input" loop** — is there ANY research on degradation when model output
   is fed to another model? Look for: model collapse literature, but specifically the FORMAT angle —
   does repeated round-tripping through markdown lose information?
6. **Human-in-the-loop handoff** — the user's actual scenario is a HUMAN pasting one AI's output into
   another AI. Is there any research or tooling for that? What is lost?

ANSWER DIRECTLY:
(a) Do agent protocols use markdown? Evidence. If not, what do they use and why?
(b) Is there a real, unserved need for a document format designed for AI-to-AI handoff, or is this
    already solved by JSON payloads in protocols?
(c) What specifically is LOST when AI output is pasted into another AI as markdown? Be concrete.
(d) Is there prior art for "provenance-carrying document that survives multiple AI hops"?
(e) HONEST ASSESSMENT: is this a real product opportunity or a solution looking for a problem?
${GUARD}`,
  },
  {
    key: 'gap-audit',
    prompt: `ADVERSARIAL AUDIT for MDMAX, a markdown compiler project. Your job is to find what the research
program MISSED. Be genuinely critical; a clean bill of health is a failure of this task.

The project has already researched, across ~14 prior agents: block anchoring/identity, splice-only
writing (lens theory), markdown carriers and covert channels, container/packing formats, extension
mechanisms (fence dispatch, directives, attributes), declared-vocabulary prior art, renderer contracts,
plugin ecosystems as revealed preference, security/sanitization, accessibility, internationalization,
token economics of representation, prompt-cache-aware layout, chunking/retrieval, agent-harness edit
formats, formatting bias in judges, instruction/data separation, and the "markdown in training data"
folklore (traced and refuted).

YOUR TASK — find the holes. Specifically hunt for:
1. **Whole research areas never touched.** Think: markdown's history and why specific design choices were
   made (Gruber's original intent, the "email conventions" origin); typography/readability research;
   legal/compliance (is markdown acceptable for regulated documents? eIDAS, 21 CFR Part 11, records
   retention); archival/preservation (is markdown a preservation format? what do LOC/national archives say);
   markdown in education; markdown for non-technical users; the economics of document formats; patent
   landscape; localization industry (XLIFF, TMX) and whether markdown fits translation workflows;
   accessibility law beyond WCAG; markdown in scientific publishing (JATS, Manubot); markdown and
   e-book formats (EPUB); print/typesetting quality.
2. **Claims the project holds that were never verified.** Read /Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/engine/PLAN.md
   and README.md. Find assertions with no cited measurement, or measurements whose method is suspect.
   Quote them.
3. **Methodological weaknesses** in what WAS researched. Single-corpus results, single-vendor results,
   simulated rather than observed data, results that would not replicate.
4. **Contradictions** between different parts of the plan.
5. **Anything the project decided NOT to do — was that decision justified by evidence, or by assumption?**

ANSWER DIRECTLY:
(a) List every research area that was never touched, ranked by how much it could change the plan.
(b) List every unverified claim currently load-bearing in the plan, with the file and line.
(c) What is the single biggest methodological weakness in the research program?
(d) What would a hostile expert reviewer attack first?
${GUARD}`,
  },
]

phase('Research')

const results = await pipeline(
  AREAS,
  (area) => agent(area.prompt, { label: `research:${area.key}`, phase: 'Research', schema: FINDINGS }),
  (res, area) => {
    if (!res) return null
    const top = (res.findings || []).slice(0, 3)
    if (!top.length) return { area: area.key, report: res, verdicts: [] }
    return parallel(
      top.map((f) => () =>
        agent(
          `You are an adversarial verifier. A research agent working on a markdown compiler project made ` +
          `this claim. Try to REFUTE it. Default to refuted=true if you cannot confirm it from a primary source.\n\n` +
          `AREA: ${area.key}\nCLAIM: ${f.claim}\nTHEIR EVIDENCE: ${f.evidence}\nTHEIR TIER: ${f.tier}\n\n` +
          `Check it against primary sources yourself. Report whether it holds, is overstated, or is wrong. ` +
          `Be specific about what you checked. If the claim is directionally right but the number/attribution ` +
          `is wrong, say exactly how.\n${GUARD}`,
          { label: `verify:${area.key}`, phase: 'Verify', schema: {
            type: 'object',
            required: ['refuted', 'verdict', 'what_i_checked'],
            properties: {
              refuted: { type: 'boolean' },
              verdict: { type: 'string', enum: ['holds', 'overstated', 'wrong', 'unverifiable'] },
              what_i_checked: { type: 'string' },
              correction: { type: 'string' },
            },
          } })
          .then((v) => ({ claim: f.claim, ...(v || {}) }))
      )
    ).then((verdicts) => ({ area: area.key, report: res, verdicts: verdicts.filter(Boolean) }))
  }
)

phase('Synthesize')

const clean = results.filter(Boolean)
const summary = clean.map((r) => {
  const bad = (r.verdicts || []).filter((v) => v.verdict === 'wrong' || v.verdict === 'overstated')
  return `## ${r.area}\nHEADLINE: ${r.report.headline}\nRECOMMENDATION: ${r.report.recommendation}\n` +
    `FINDINGS:\n${(r.report.findings || []).map((f) => `- [${f.tier}] ${f.claim}\n    ${f.evidence}`).join('\n')}\n` +
    `UNVERIFIED: ${(r.report.unverified || []).join('; ')}\n` +
    `VERIFIER CORRECTIONS: ${bad.length ? bad.map((v) => `${v.verdict.toUpperCase()}: ${v.claim} → ${v.correction || v.what_i_checked}`).join(' | ') : 'none'}`
}).join('\n\n')

const synth = await agent(
  `You are synthesizing research for MDMAX, a markdown compiler + editor product (the editor is called ` +
  `"frontmatter"). Below are ${clean.length} research reports with adversarial verification results.\n\n` +
  `${summary}\n\n` +
  `Produce a synthesis that answers, concretely:\n` +
  `1. Is the LIBRARY/IMPORT model for markdown viable? Yes/no/qualified, with the design if yes.\n` +
  `2. Is there a viable path to improving markdown for everyone, or only for our own users?\n` +
  `3. Should the "one root markdown referencing thousands" deliverable be links or inlined content?\n` +
  `4. What are the top 5 editor features that are genuinely unseen in the industry AND need a compiler?\n` +
  `5. Is AI-to-AI markdown handoff a real opportunity or not?\n` +
  `6. What did the research program MISS that most needs fixing?\n` +
  `7. What should be BUILT FIRST, and what should explicitly NOT be built?\n\n` +
  `Be decisive. Where verifiers refuted a claim, say so and adjust. Flag anything still unverified.`,
  { label: 'synthesis', phase: 'Synthesize' }
)

return { areas: clean.length, synthesis: synth, detail: clean }
