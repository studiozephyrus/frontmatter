# Knowledge-base sweep: product-relevant principles feeding frontmatter

**Researcher scope:** the personal knowledge base at `/Users/sagnikmitra/Desktop/GitHub/knowledge`. Read in full: the master index (`knowledge.md`) plus 11 synthesis notes — the three context-engineering notes, writing-tools-for-agents, effective-harnesses, agent-SDK, agentic-coding-expertise, 12-factor-agents, dont-build-multi-agents, applied-llms (the only PMF-adjacent note; Business & Startup category verified at 0 items), and two bonus notes with direct product relevance (agent-skills, code-execution-with-MCP). Product implications grounded against `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/research/frontmatter-product-thesis-research-2026-08-28.md` (read in full, 198 lines). Every claim below carries its source path; anything inferred is marked `[inference]`.

**Headline finding:** the KB's agent-engineering cluster and frontmatter's product thesis converge to a striking degree — several thesis decisions (renderer-as-verifier, verdict-first dispatch, the JSON boundary, MCP-as-table-stakes) are independently ratified by the notes, and one product surface (the ≤2,000-token MAP.md agent contract) is a direct application of the KB's attention-budget doctrine. The KB is strong on how agents consume documents and tools, and empty on the editor/format/business science frontmatter also needs (§3).

---

## 1. The 15 principles that constrain frontmatter's product design

**P1 — Context is a depletable attention budget; find the smallest set of high-signal tokens.**
Source: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-effective-context-engineering.md` (ideas 2, 3, 24 — context rot is a measured gradient in all models; "every new token depletes this budget").
Product implication: budget-bounded always-on docs are a *feature*, not a limitation — MAP.md's ≤2,000-token agent contract (thesis §5) is the correct shape, and the editor should surface a live token-count/"agent cost" metric on any agent-facing file (AGENTS.md, SKILL.md, MAP.md).

**P2 — Just-in-time retrieval via lightweight identifiers beats pre-loading; filesystem structure and metadata are themselves agent API.**
Source: same note (ideas 10, 11, 13) + `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-building-with-claude-agent-sdk.md` (ideas 3–4: agentic search over semantic search; "the folder and file structure of an agent [is] a form of context engineering").
Product implication: frontmatter's vault MCP should return paths, wikilink identifiers, and heading-anchored *slices* — never whole documents by default — and the vault's folder/filename conventions should be documented as agent-readable signal.

**P3 — Progressive disclosure is the scaling mechanism: L1 name+description → L2 body → L3 bundled files; bundled context becomes "effectively unbounded".**
Source: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-agent-skills.md` (ideas 2, 3, 18) + `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-code-execution-with-mcp.md` (idea 4).
Product implication: the YAML frontmatter block is literally the product's L1 disclosure layer — profiles keyed on one frontmatter field (thesis §3.2 rule 2, "Frontmatter is the renderer switch") mirror exactly how skills key on name+description; `mdmax cert --skill-generate` must emit spec-conformant SKILL.md anatomy, and the vault MCP should offer a frontmatter-only listing tool before any body read.

**P4 — Build few consolidated, intent-named tools; each tool a distinct strategy; ~20-tool practical ceiling; namespace by service/resource.**
Source: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-writing-tools-for-agents.md` (ideas 2, 13–17) + `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-willison-fix-your-context.md` (ideas 3, 6, 12 — Llama 3.1 8B fails at 46 tools/succeeds at 19; DeepSeek-v3 degrades >30).
Product implication: frontmatter's MCP server ships a handful of consolidated tools (e.g. search-vault, read-slice, splice-edit, cert-check) with a common prefix, hard-capped far under 20 — never a 1:1 wrap of every internal endpoint.

**P5 — Tool-response ergonomics: high-signal fields, `response_format: concise|detailed`, token caps with truncation *steering*, actionable errors with example calls, semantic IDs over opaque offsets.**
Source: writing-tools note (ideas 18–24; Claude Code's 25,000-token default response cap; "ValueError: invalid_parameter" anti-pattern).
Product implication: MCP responses anchor on heading paths/line context, not byte offsets alone; a refused splice must name the violated allowlist rule and show a corrected example call; truncated search results carry a "refine with…" steering line.

**P6 — Descriptions ARE the routing logic; description-only edits produced SOTA gains; tool sets must be developed eval-first with held-out test sets.**
Source: writing-tools note (ideas 5–12, 25–27) + agent-skills note (ideas 7–8).
Product implication: the descriptions of frontmatter's MCP tools and generated skills are load-bearing product surfaces to be eval-tested against realistic multi-call tasks (composable with the existing `sgnk-evals` harness), not documentation afterthoughts.

**P7 — JSON for state agents must NOT rewrite; Markdown for narrative agents SHOULD restructure.**
Source: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-effective-harnesses-long-running.md` (idea 5 — "the model is less likely to inappropriately change or overwrite JSON files").
Product implication: this is the agent-side ratification of the thesis's two boundary rules (§1.2 JSON Canvas boundary, §3.2 rule 6/7 — compute the view, config out of the body). It also hands frontmatter its sharpest marketing sentence `[inference]`: markdown is the format agents are *supposed* to rewrite — which is exactly why the splice guarantee (only the intended bytes change) is the missing safety layer for the rewritable format.

**P8 — Long-running agents are bottlenecked by the harness, not the model: durable on-disk artifacts (progress file, feature list, init, git) bridge context windows; git is the agent's undo stack; every session starts with a get-up-to-speed protocol.**
Source: effective-harnesses note (ideas 1–4, 8, 11).
Product implication: frontmatter's git-native vault + background auto-sync (the thesis's #1 demand signal) is not merely sync — it is the persistence/undo layer agent workflows structurally require; MAP.md and progress docs are the "shift-change" surface an agent reads at session start, which turns the mdmap thread into harness infrastructure.

**P9 — Agents prematurely declare victory; verification must be cheapest-applicable-first (rules-based → visual → LLM-judge), and a deterministic renderer/linter is the highest-signal rules-based verifier.**
Source: effective-harnesses note (ideas 9–10) + agent-SDK note (ideas 11–14).
Product implication: directly ratifies thesis §4.4's generate-freely → validate-with-renderer loop (UICoder pattern): frontmatter's renderer, `mdmax cert`, and the no-op-dirties-zero-files oracle ARE the rules-based verifier tier — sell the verifier, never constrained decoding.

**P10 — Share full traces, not summaries; parallel agents over one creative target diverge on implicit decisions; subagents default to sequential and read-only.**
Source: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-cognition-dont-build-multi-agents.md` (ideas 3–8, 10).
Product implication: byte-attributed AI-edit provenance (thesis §4.3, the category first) is the *document-level full trace* that makes agent edits auditable; and the agent-edit path needs a written concurrency policy — agent edits on one document are sequential or provably splice-disjoint, never two agents restyling the same body in parallel.

**P11 — Agents are stateless reducers over externally-owned state; structured outputs put a categorical natural-language intent enum first; compact errors before re-injecting.**
Source: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/video/video-horthy-12-factor-agents.md` (ideas 2, 10, 11, 15).
Product implication: "the file IS the state" is frontmatter's stateless-reducer story — everything an agent needs to resume lives in the .md + git; and the verdict-first shape (thesis §3.1's `render`/`degrade`/`refuse` dispatch table) already matches the intent-enum-first rule — carry it through to the differ and every MCP response.

**P12 — Own every prompt token as version-controlled .md files; scaffold-and-own (shadcn) beats wrapper frameworks; frameworks should remove the *other* hard parts.**
Source: 12-factor note (ideas 8, 16, 17).
Product implication: prompt/instruction files (AGENTS.md, `.mdc`, SKILL.md, CLAUDE.md) are a growing, markdown-native file class whose workflow is exactly "hand-edit every token under git" — frontmatter is the natural editor for it `[inference]`; and built-in owned profiles (not a plugin marketplace) is the shadcn-side of that axis, matching the thesis's plugin-fatigue answer.

**P13 — Context failures have a diagnostic vocabulary (poisoning / distraction / confusion / clash) and a mitigation taxonomy (Write/Select/Compress/Isolate); what a document does to an agent's context is measurable.**
Source: willison note (ideas 1–4) + `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-martin-context-engineering.md` (ideas 3, WSCI framework).
Product implication: `mdmax explain --as <consumer>` with its HIDDEN/LOST/ADDED/RESHAPED channels is the document-side instrument for this vocabulary — position it as "see exactly what your file does to an agent's context," the diagnostic no competitor has (thesis §4.1).

**P14 — Domain expertise, not coding proficiency, predicts agent success (every top-10 occupation within 7 points of SWE); the expert prompt = precise direction + verification ask + correction loop; competence-not-mastery captures most of the benefit.**
Source: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-agentic-coding-expertise.md` (ideas 1–5, 11, 14).
Product implication: empirical backing for the two-funnel GTM — non-developer domain experts are a real agent-era ICP; profiles should scaffold the expert-prompt triad (a `type: decision` doc makes direction and verification explicit by structure), and onboarding should target novice→intermediate fast via opinionated defaults.

**P15 — The model is the least durable component; the moat is the system around it (evals + guardrails + caching + data flywheel); deterministic workflows beat free-roaming agents; don't build what providers will inevitably ship.**
Source: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/web/web-applied-llms.md` (ideas 10, 38, 39, plus 27–28 on HITL feedback UX).
Product implication: ratifies thesis §4's ordering — the vault MCP server is commodity table stakes while the differ, provenance, and cert *dataset* are durable system-around-model assets; add a standing commoditization check to the feature list, and design every AI surface with an accept/edit/reject path that feeds the flywheel.

Supporting (folded, not numbered): code-execution-with-MCP's intermediate-data rule — data the model isn't transforming must not round-trip through context (150k→2k tokens measured) — argues for `mdmax` staying an agent-invocable CLI/library (npx/MCP/Action per thesis §4.5) that computes deterministically and returns only small verdict payloads. Source: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-code-execution-with-mcp.md` (ideas 2, 5, 9).

---

## 2. Which principles AIOS already implements (live existence proof)

The user-global CLAUDE.md Learned Rules were seeded *from these exact notes* and cite them inline (observed in this session's system context at `/Users/sagnikmitra/.claude/CLAUDE.md`):

| Principle above | AIOS implementation | Evidence |
|---|---|---|
| P1 attention budget | LR#28 — every CLAUDE.md/skill addition must "earn its tokens"; acceptance check in force (this very session's skills catalog was moved out of always-on context under it) | CLAUDE.md LR#28, citing `article-anthropic-effective-context-engineering` |
| P4 tool ceiling | LR#26 — per-subagent tool cap at 20, loadout routing beyond | CLAUDE.md LR#26, citing `article-willison-fix-your-context` |
| P5/P6 tool ergonomics | LR#17 — every new skill/MCP wrapper must ship response_format control, token cap with steering, actionable errors | CLAUDE.md LR#17, citing `article-anthropic-writing-tools-for-agents` |
| P7 JSON/Markdown split | LR#11 — JSON for state files the agent must not rewrite; Markdown for narrative | CLAUDE.md LR#11, citing `article-anthropic-effective-harnesses-long-running` |
| P8 harness artifacts | `sgnk-snapshot`/`sgnk-recall` skills (shift-change bridge) + `sgnk-feature-list` skill (the features.json contract) — all present in this session's skills listing | skills listing this session; harnesses note §"How I'd apply" |
| P9 verifier ladder | LR#25 — rules-based first → visual → judge-panel only for fuzzy criteria | CLAUDE.md LR#25, citing `article-anthropic-building-with-claude-agent-sdk` |
| P10 traces/parallelism | LR#20 (parallel branches must be disjoint, explicitly-specified artifacts) + LR#21 (subagents read/advisory by default; write authority requires the full trace) | CLAUDE.md LR#20–21, citing `article-cognition-dont-build-multi-agents` |
| P11 intent-enum + error compaction | LR#18 (categorical NL intent enum atop every structured-output schema) + LR#19 (≤200-char NL error hints, garbage-collect stale errors) + shipped skill `sgnk-agent-context-hygiene` | CLAUDE.md LR#18–19, citing `video-horthy-12-factor-agents`; skills listing |
| P13 failure modes | LR#36 — divergence tagged with Breunig modes {distraction|confusion|clash|scope-creep} in the digression guard | CLAUDE.md LR#36 |
| P14 expert triad + autonomy dial | LR#24 (expert-prompt triad in every skill) + LR#23 (tight ~8 / loose ~16 actions-per-turn autonomy slider) | CLAUDE.md LR#23–24, citing `article-anthropic-agentic-coding-expertise` |
| P15 evals-as-moat | `sgnk-evals` (binary pass/fail + kappa ≥0.7 judges, LR#4–6), `sgnk-model-router` + LR#35 complexity gate (smallest-sufficient routing), LR#37–39 (drift baselines, shadow promotion, exploration) | CLAUDE.md LR#4–6, #32–39; skills listing |
| P3 progressive disclosure | The entire 74-skill SKILL.md estate + the ToolSearch deferred-tools pattern (the martin note itself names ToolSearch as the in-house tool-description-RAG analog) | martin note §"How I'd apply"; this session's deferred-tools mechanism |
| Mid-session compaction (P1 adjunct) | `sgnk-context-compact` skill exists — the exact proposal the context-engineering note made | skills listing this session |

**Why this matters for frontmatter:** the AIOS is a running, battle-tested implementation of the same principles frontmatter will encode as product. Two direct transfers: (a) `sgnk-evals` can be pointed at frontmatter's MCP tool descriptions and `--skill-generate` output as the eval harness P6 demands; (b) the AIOS's own always-on markdown files under an enforced attention budget (LR#28) are the dogfooding evidence for the "budget-bounded agent-facing markdown" product claim `[inference]`.

---

## 3. Gaps: what the KB does NOT cover that frontmatter needs (ingestion candidates)

Verified by index read + grep over `categories/` and `layers/` (2026-08-28):

1. **Business/PMF/pricing — category empty.** `categories/business-startup/index.md` shows 0 notes. Everything in thesis §7–§8 (freemium AI-margin evidence, Craft credit benchmark, Inkdrop ceiling, MoR rails, category-renaming positioning) rests on `[SS]` external sweeps with no KB grounding. Candidates: prosumer-SaaS pricing literature, the Inkdrop/Takuya essays, AI-margin sources, devtool GTM writing.
2. **Editor & format science — zero coverage.** Grep for `commonmark`, `projectional`, `structure editor`, `peritext`, `CRDT`, `local-first` returns no dedicated note (one incidental video mention of CRDT). The thesis's own §9 reading list (Peritext, Berger FSE 2016, tylr, Boomerang lenses, the CommonMark no-formal-grammar record, Notion data-model blog, mbeddr retrospective) is entirely un-ingested — the highest-priority paste batch, since the product quotes these as `[SS]`.
3. **Prompt-format-impact literature.** No note covers the format-vs-performance papers the thesis leans on (arXiv 2411.10541, 2310.11324, 2408.02442, 2406.07739, 2501.15000 / MDEval). This is frontmatter's core "markdown as LLM tongue — narrowed" claim (§1.2 correction 3); it needs first-party grounding in the KB.
4. **AGENTS.md / agent-instruction-file standardization.** Mentioned only incidentally in course videos; no dedicated note on the standardization event (the Linux Foundation donation is flagged as top verification debt in thesis §12). Same for Obsidian Skills, `.mdc`, and `Accept: text/markdown` content negotiation.
5. **AEO/GEO.** No KB note on answer-engine optimization, the Princeton GEO work, the llms.txt null results, or the Otterly experiment — all load-bearing `[SS]` for the §6 verdict.
6. **Sync/collaboration engineering.** No notes on conflict resolution, file-sync architectures, or GitHub-App auth patterns, despite sync being the thesis's #1 demand signal and an open founder-level item (OAuth scope).
7. **Renderer security.** No note on sanitizing/rendering untrusted markdown (XSS surface of custom renders and published sites); the KB's security note (`article-willison-lethal-trifecta`) covers agent-side injection, not renderer-side.
8. **MCP server-authoring spec depth.** The KB's MCP notes are consumption-oriented (code-execution pattern, setup videos); no note on the spec's resources-vs-tools-vs-prompts model or annotations — the exact design decision (documents=resources, edits=tools) thesis §4.2 makes.
9. **Design & content-marketing categories both empty** (0 items each) — funnel 2 (aesthetic-productivity, vertical-video) and the editor's design language have no KB substrate. Related-but-unread: `article-mem0-state-of-agent-memory.md` exists in the KB and likely bears on agent-memory interop `[inference — note not read this sweep]`.

---

## Caveats

- All 11 notes and the thesis doc were read in full; the ~160 other KB notes (mostly YouTube-course syntheses) were only scanned by title/grep — a principle hiding exclusively in one of those would be missed.
- The KB notes are syntheses (mostly `fidelity: verbatim` of ~1.5–3k-word sources); numbers quoted here (25k-token cap, 150k→2k, 46-vs-19 tools, 70/20 split) are quoted from the notes, not re-verified against the original articles this session (RULE 5: attributed, not independently verified).
- Product implications marked `[inference]` are my mappings, not statements found in either the notes or the thesis.

## FRONTMATTER HOOKS (structured)

- **Attention-budget doctrine: context is a depletable resource, context rot is measured, and always-on docs must earn their tokens (already enforced in AIOS as Learned Rule #28)** -> Token budgets as product features: the MAP.md <=2,000-token agent contract, plus a live token-count / 'agent cost' indicator in the editor for agent-facing files (AGENTS.md, SKILL.md, MAP.md) and budget-bounded always-on doc profiles  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-effective-context-engineering.md`
- **Just-in-time context via lightweight identifiers; agentic search over embeddings; folder/file structure and metadata as agent API** -> Vault MCP returns paths, wikilinks, and heading-anchored slices instead of whole documents; vault folder/naming conventions documented as agent-readable signal; no embedding index required for v1  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-building-with-claude-agent-sdk.md`
- **Progressive disclosure (L1 name+description -> L2 body -> L3 bundled files) makes bundled context effectively unbounded; SKILL.md anatomy with YAML frontmatter is the canonical contract** -> YAML frontmatter as the product's literal L1 disclosure layer: one frontmatter key activates each render profile; mdmax cert --skill-generate emits spec-conformant SKILL.md; MCP exposes a frontmatter-only listing tool before body reads  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-agent-skills.md`
- **Tool-design playbook: few consolidated intent-named tools, namespacing, response_format concise|detailed enum, ~25k-token response caps with truncation steering, actionable errors with example calls, semantic IDs over opaque identifiers (codified in AIOS as LR#17)** -> The shape of frontmatter's MCP server: a small namespaced tool set (search-vault / read-slice / splice-edit / cert-check), concise-vs-detailed response modes, steering messages on truncation, and splice-refusal errors that name the violated rule with a corrected example call  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-writing-tools-for-agents.md`
- **Tool-count ceiling (~20 practical max; measured degradation past 30) and tool-loadout routing** -> Hard cap on the vault MCP server's tool count; never wrap internal endpoints 1:1; if the surface grows, add a discovery/search tool rather than more tools  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-willison-fix-your-context.md`
- **Eval-first tool development: realistic multi-call eval tasks, held-out test sets, descriptions as the routing logic (description-only edits produced SOTA SWE-bench gains); AIOS already ships sgnk-evals with binary-pass/kappa-gated judges** -> Frontmatter's MCP tool descriptions and generated skills are eval-tested product surfaces — reuse the sgnk-evals harness to score whether agents pick and sequence the vault tools correctly before shipping  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-writing-tools-for-agents.md`
- **Empirical JSON-vs-Markdown rule: agents rewrite Markdown readily and respect JSON (AIOS LR#11); harness artifacts contract (init/progress/feature-list/git); git as the agent's undo stack** -> Agent-side ratification of the thesis's storage boundaries (JSON Canvas sidecars, view-config out of body) plus the marketing frame 'markdown is the format agents are supposed to rewrite — the splice guarantee makes that safe'; git-native vault + auto-sync positioned as the agent persistence/undo layer  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-effective-harnesses-long-running.md`
- **Cheapest-verifier ladder (rules-based -> visual -> LLM-judge, AIOS LR#25) and the premature-victory failure mode; deterministic feedback layers are the highest-signal verifier** -> Renderer + mdmax cert + the no-op-dirties-zero-files oracle sold as the deterministic verifier in the generate-freely -> validate-with-renderer loop the thesis already adopted (UICoder pattern, thesis section 4.4)  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-building-with-claude-agent-sdk.md`
- **Full-trace sharing and the implicit-decision doctrine: parallel agents over one creative target diverge on unstated defaults; subagents sequential and read-only by default (AIOS LR#20/21)** -> Byte-attributed AI-edit provenance as the document-level full trace (auditable from git history), plus a written agent-edit concurrency policy: edits to one document are sequential or provably splice-disjoint  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-cognition-dont-build-multi-agents.md`
- **Stateless-reducer agents over externally-owned state; NL-intent enum first in every structured output (AIOS LR#18); error compaction (LR#19)** -> 'The file IS the state' as frontmatter's pause/resume story, and verdict-first API shape everywhere: the render/degrade/refuse dispatch verdict leads every response from the dispatch table, the differ, and the MCP tools  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/video/video-horthy-12-factor-agents.md`
- **Own-your-prompts discipline (every token hand-written, version-controlled .md) and scaffold-and-own (shadcn) over wrapper frameworks** -> Prompt/instruction files (AGENTS.md, .mdc, SKILL.md, CLAUDE.md) treated as a first-class markdown file family frontmatter edits and renders; built-in owned render profiles instead of a plugin marketplace — the shadcn answer to plugin fatigue  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/video/video-horthy-12-factor-agents.md`
- **Named context-failure vocabulary (poisoning / distraction / confusion / clash) and the Write/Select/Compress/Isolate taxonomy for what enters an agent's window** -> mdmax explain --as positioned as the document-side context-integrity diagnostic — HIDDEN/LOST/ADDED/RESHAPED channels show 'what your file does to an agent's context', a category no competitor occupies  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-martin-context-engineering.md`
- **Empirical finding that domain expertise (not coding skill) drives agent success — every top-10 occupation within 7 points of software engineers; the expert-prompt triad (direction + verification + correction); competence-not-mastery** -> Validation for the two-funnel GTM (non-developer domain experts are a real agent-era ICP) and for profiles that scaffold the triad structurally — e.g. the type:decision ADR profile makes direction and verification explicit fields  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-agentic-coding-expertise.md`
- **Strategic moat doctrine: the model is the least durable component; durable advantage = evals + guardrails + caching + data flywheel + the system around the model; strategic procrastination on commoditizing features; HITL accept/edit/reject feedback UX** -> Ratifies thesis section 4 ordering: vault MCP = commodity table stakes, while the differ, provenance, and the cert dataset are the durable moat; add a standing commoditization check to the roadmap and an accept/edit/reject path on every AI surface to feed the flywheel  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/web/web-applied-llms.md`
- **Code-execution-over-context pattern: data the model is not transforming must not round-trip through its context (measured 150k -> 2k tokens); filter/aggregate before returning; progressive tool discovery** -> mdmax stays an agent-invocable deterministic CLI/library (npx / MCP / GitHub Action per thesis section 4.5) that computes cert/differ/mdmap verdicts in code and returns only small verdict payloads, never document dumps  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/ai/article/article-anthropic-code-execution-with-mcp.md`
