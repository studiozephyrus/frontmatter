# AIOS as a LIVE markdown-native operating system — the existence proof

**Sweep scope:** `~/.claude/skills-src/`, `~/.claude/CLAUDE.md`, `~/.claude/imports/`, `~/.claude/projects/*/memory/`, `~/.sgnk/` (shapes only), `hq/.sgnk/` (live snapshot store), `frontmatter/docs/mdmap/`, `knowledge/knowledge.md` + `knowledge/meta/schema.md`, plus in-repo HANDOFF/PLAN/research docs. All claims carry the observed path; anything inferred is marked `[inference]`.

**Headline:** this machine already runs a working markdown-native operating system. Roughly fifteen distinct markdown file-types act as executable surface: they route models, gate permissions, persist memory, ledger history, index stores, map codebases, and hand off sessions across tools. The conventions that make each one machine-operable are consistent enough to read off as a pattern language — which is exactly the vocabulary frontmatter can productize.

---

## PART 1 — The catalogue of markdown file-types the OS runs on

### 1.1 `SKILL.md` — the executable capability unit
- **Where:** `/Users/sagnikmitra/.claude/skills-src/<category>/<skill>/SKILL.md`. Counted **124 SKILL.md files** across **27 top-level dirs** (25 real categories + `_parked`, `_tests`); per-category counts sum to 124 (largest: `ops-agent` 25, `aios-library` 14, `plan` 10, `knowledge-docs` 8). [measured via `find ... -name SKILL.md | wc -l`]
- **Purpose:** a unit of agent capability — instructions + optional `scripts/` and `references/` subdirs (observed at `skills-src/design-build/sgnk-design/` and `~/.claude/skills/gvc/` which has `agents/` and `references/`).
- **Machine-operable conventions (frontmatter keys observed):**
  - `name` — stable identity (all four read).
  - `description` — the **routing surface**: long natural-language block carrying explicit `Trigger:`, `Use when`, and `NOT for:` clauses. Claude Code's description-based auto-invocation dispatches on this text (routing contract stated in `~/.claude/CLAUDE.md` "Skill Auto-Routing"). Observed in `skills-src/plan/sgnk-complexity-gate/SKILL.md`, `skills-src/evaluation/sgnk-evals/SKILL.md`, `skills-src/ops-agent/sgnk-snapshot/SKILL.md`, `skills-src/design-build/sgnk-design/SKILL.md`. Anti-triggers ("NOT for: … use X instead") are first-class.
  - `allowed-tools` — a tool sandbox declared in frontmatter: `Bash(git:*), Bash(jq:*), … Read, Write, Glob, Grep` (`skills-src/ops-agent/sgnk-snapshot/SKILL.md` line 5).
  - `disable-model-invocation: true` — auto-fire kill-switch for destructive/outward skills, with inline comment "RULE 2 — destructive/outward; explicit invocation only" (`skills-src/deploy/ship/SKILL.md`, `~/.claude/skills/gvc/SKILL.md`).
  - `capabilities: [fs-write, net, deploy]` — declared capability scope, "(WARN-mode)" (`ship`, `gvc`).
  - `argument-hint` — CLI-style arg grammar for humans and the model (`sgnk-snapshot`).
  - `preamble-tier: 4`, `version: 1.0.0` (`ship`).
- **Body conventions:** `# name` H1, `## Overview`, "When to reach for it", explicit argument grammar sections; `sgnk-snapshot` documents a deterministic-scripts-vs-model-judgment split and an explicit failure contract ("If `manifest.refs.transcript_lines` is 0 … do not silently ship a thin snapshot", lines 37–40).
- **Notable sub-type — docs-as-skills:** the `aios-library` category (14 skills) packages reference documentation as routable skills; `skills-src/aios-library/sgnk-learning-loop-reference/SKILL.md`'s description is essentially a keyword index ("Keywords; what does separation mean, … SEPARATION_FAIL, CALIBRATION_DRIFT …") plus a read-before-editing file list. Documentation becomes retrievable capability via the same frontmatter router.

### 1.2 `CLAUDE.md` — the policy kernel / boot config
- **Where:** `/Users/sagnikmitra/.claude/CLAUDE.md` — **871 lines** [measured].
- **Purpose:** always-on constitution: skill routing table, token-handling policy, RULE 1–8 (zero-tolerance rules), and the learning loop.
- **Machine-operable conventions:**
  - **Numbered rule constitution:** `## RULE 1` … `## RULE 8` at lines 77–211 [grep of headings] — rules are addressable by number and cited by number everywhere else in the system.
  - **`## Learned Rules` (line 231): an append-only, numbered ledger** currently reaching **rule 73**, with italic date markers `_Seeded 2026-06-27 …_`, `_Appended 2026-07-17 …_` etc. at lines 254, 348, 430, 458, 581, 657, 709, 770. Each rule is imperative, carries `(verified <date>)`, and cites provenance via `[[wiki-link]]` tags (e.g. `[[self-improving-orchestrator-2026-06]]`, `[[paper-du-multiagent-debate]]`).
  - **Attention-budget governance:** LR#28 — new CLAUDE.md content "must earn its tokens"; enforced by offloading the 9 skill-description blocks into an import (see 1.3).
  - **Self-modification protocol:** RULE 8 defines when and how the file appends to itself (on correction + periodic rollup behind a human gate); routing-rule edits go through a shadow-promote ladder (LR#38), never edit-then-live.
- This file is the strongest single proof that markdown is the OS's *code*: it is executed by every session, versioned, appended by protocol, and self-referential.

### 1.3 Import modules — `@`-referenced deferred context
- **Where:** `/Users/sagnikmitra/.claude/imports/sgnk-skills.md`, referenced from CLAUDE.md as `@~/.claude/imports/sgnk-skills.md` with the stated reason "to lighten the always-on context payload (per Learned Rule #28)".
- **Convention:** markdown files including other markdown files by `@path` reference — a module system with lazy loading, motivated explicitly by token budget. [observed in `~/.claude/CLAUDE.md` head]

### 1.4 Project memory — `MEMORY.md` index + frontmattered memory files
- **Where:** `/Users/sagnikmitra/.claude/projects/<sanitized-launch-cwd>/memory/`. Observed populated dirs for `content`, `frontmatter`, `gearup` (10 files), `hq` (9 files), `inw-lovable`; ~40 project dirs total listed.
- **`MEMORY.md`:** a human/machine index — one bullet per memory file: `[Title](file.md) — one-line description` (`projects/-…-hq/memory/MEMORY.md`).
- **Memory-file frontmatter schema** (observed identically in `projects/-…-frontmatter/memory/mdmax-cert-audit-handoff.md` and `projects/-…-hq/memory/sagnik-writing-voice.md`):
  ```yaml
  name: <slug>
  description: "<one-line, dated>"
  metadata:
    node_type: memory
    type: project | reference
    originSessionId: <uuid>
    modified: <ISO timestamp>   # present on the frontmatter one
  ```
- **Link conventions:** supersession expressed with wiki-links in prose — "Supersedes [[mdz-markdown-format-handoff]] only for CODE state; the format verdict still stands" (`mdmax-cert-audit-handoff.md` line 16). Memory files point at governing repo docs by absolute path.

### 1.5 `.sgnk/` snapshot store — the numbered card set (per repo)
- **Where (live example):** `/Users/sagnikmitra/Desktop/GitHub/hq/.sgnk/` — contains `JOURNAL.md`, `LATEST` (pointer file holding one snapshot id), `LATEST-KEY.md`, `snapshots/`. Same shape at `md/.sgnk/`. The frontmatter repo itself has **no** `.sgnk/` dir [measured: `ls` empty].
- **Snapshot dir contents** (`hq/.sgnk/snapshots/20260828T081249Z_eod_2026-08-28_7bc9/`): `00-KEY.md`, `01-context.md`, `02-tasks.md`, `03-runtime.md`, `04-codebase.md`, `05-features-and-issues.md`, `06-conversation.md`, `derived.json`, `manifest.json` — **numbered markdown cards + JSON sidecars**.
- **Card frontmatter** (observed in `02-tasks.md`): true YAML frontmatter `id / head_sha / branch / utc / kind: live-derived`; `LATEST-KEY.md` carries the same fields in a fenced ```yaml block with `kind: eod-daily`. `kind` is a lifecycle discriminator.
- **Fixed numbered sections as card API:** `02-tasks.md` → `## 1. Verbatim user prompts … ## 6. Dirty paths at snapshot time`; `06-conversation.md` → sessions index + "Compaction summaries — every context window that scrolled off", each summary itself following a fixed 9-section schema (`## 1. Primary Request and Intent` … `## 9. Optional Next Step`). [grep of headings]
- **JSON sidecar division:** `manifest.json` top-level keys: `codebase, contracts, dependencies, id, knowledge_graph, mode, monorepo, peers, provenance, refs, remote, runtime, schema_version, session_activity, substrate, toolchain, utc, vcs, verify`; `refs` includes `transcript_lines`, `transcript_matched_sessions` — the machine-checkable "did discovery fail" signal named in the SKILL.md contract. [jq keys only]
- **ID convention:** `YYYYMMDDTHHMMSSZ_<kind>_<label>_<4-hex>` — sortable, unique, dated (LR#69's unique-filename rule made structural).

### 1.6 `JOURNAL.md` — append-only ledger inside markdown
- **Where:** `hq/.sgnk/JOURNAL.md` — 147 lines [measured].
- **Format:** header line `# SGNK Journal — append-only snapshot log`, then pipe-delimited rows: `timestamp|actor|snapshot-id|mode|head_sha|note` (e.g. `2026-08-28T08:13:00Z|claude/eod|20260828T081249Z_eod_2026-08-28_7bc9|auto|bb72df66877a|EOD daily archive (2026-08-28)`). Actors are namespaced (`claude/sagnik`, `claude/eod`, `claude/unknown`); even *skipped* captures are journaled. A CSV-grade ledger living in a `.md` so it stays human-readable in any renderer.

### 1.7 `GLOBAL-REGISTRY.md` — machine registry as markdown
- **Where:** `/Users/sagnikmitra/.sgnk/GLOBAL-REGISTRY.md`.
- **Format:** title line + tab-delimited rows `repo-path <TAB> latest-snapshot-id <TAB> utc <TAB> actor`. Consumed programmatically by `sgnk-snapshot all` (per `skills-src/ops-agent/sgnk-snapshot/SKILL.md` lines 69, 75–77).

### 1.8 `MAP.md` / mdmap — the budget-bounded structural map (frontmatter's own invention)
- **Where:** `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/mdmap/MAP.md` + 7 region dirs (`01-thesis` … `07-open`), each with its own `MAP.md` (recursive).
- **Root frontmatter:** `mdmap: 1` (format version), `scope`, `title`, `generated`, `commit: 8eb4de2` (staleness anchor), `coverage: 0.247` (measured, machine-written), `budget: 2000` (token budget), `status: concept`. **Region frontmatter** (`01-thesis/MAP.md`): `mdmap, scope, title, parent: ../MAP.md, rank: 1.00`.
- **Fixed sections:** `Orientation / Invariants / Entry points / Regions (rank table) / Relations (typed-edge table) / Gaps / Recipes / Navigate`.
- **Typed edges in a plain table:** `implements, constrains, justifies, projects, depends-on, supersedes, contradicts` with a `why` column (lines 72–82).
- **Gap report as product:** counted (not estimated) `81 nodes declared, 20 exist, coverage 0.247`, ghosts per region, `broken: 0`, `orphans: 0`, `uncovered:`, `stale: 0` — including a self-demonstrating correction note that the first write estimated wrongly and counting fixed it (lines 84–109).
- **Eight invariants** are the productizable spec (lines 29–50): markdown-not-JSON with coordinates in a **sidecar**; always-on core ≤ 2,000 tokens; agents never traverse edges (rank offline, ship a flat list); global view opt-in; layout never moves on its own; **unresolved links are findings, not noise**; deterministic byte-identical output (prompt-cache preservation); never restate what code says.
- **Wiki-links as node addresses** throughout (`[[03-spec/format]]`), mixed with a real code deep-link (`[graph-data.ts:132](../../src/modules/graph/...#L132)`).

### 1.9 Knowledge base — schema-backed notes + regenerated master index
- **Where:** `/Users/sagnikmitra/Desktop/GitHub/knowledge/` — `knowledge.md` (232 lines [measured]), `meta/schema.md`, `categories/<cat>/<type>/<slug>.md`, `layers/{concepts,entities,questions,maps}`.
- **`meta/schema.md` is a full metadata contract written as markdown tables:** required `id (YYYYMMDD-slug), title, type (synthesis|concept|entity|question|map), status (queued|processing|done|failed|skipped), created, updated`; synthesis-required `item_type` (14-value enum), `category`; recommended `content_hash` ("**Dedup key**"), `fidelity` enum (`full|verbatim|ocr|auto-transcribed|partial|summary-only` — trustworthiness of the read), `relevance 1–5`, hierarchical `tags`, `aliases`, `entities [[…]]`, `key_terms`, `related [[…]]`, and **typed `relationships`** with edge vocabulary `builds-on, extends, contradicts, supports, applies, prerequisite-of, part-of, references, related`.
- **Live instance:** `categories/ai/article/article-anthropic-building-effective-agents.md` carries every one of those fields including `content_hash: "c127a15e936bb9c3"`, `fidelity: verbatim`, `relevance: 10`, 8 `related` wiki-links.
- **`knowledge.md` index:** hand-authored shell with **machine-regenerated regions fenced by HTML comment markers** — `<!-- CATEGORIES:START --> … <!-- CATEGORIES:END -->`, `<!-- RECENT:START/END -->` — regenerated by `scripts/build_catalog.py` (named in the file). Category counts inline ("AI — 171 items"); a JSON twin exists (`index/catalog.json`, referenced in the header).

### 1.10 `HANDOFF-*.md` — dated session-handoff documents with supersession chains
- **Where:** repo root, e.g. `/Users/sagnikmitra/Desktop/GitHub/frontmatter/HANDOFF-mdmax-cert-and-audit-2026-08-03.md` (also `HANDOFF-graph-engineering-research-2026-07-30.md`, `HANDOFF-mdz-markdown-format-2026-07-29.md` per git status and the doc's own references).
- **Conventions:** date in the filename; bold header block pinning `repo / branch / HEAD sha / push state`; explicit supersession semantics in prose — "**This supersedes `HANDOFF-mdmax-markdown-engine-2026-08-01.md`.** … Do not delete it — it holds the research provenance this one does not repeat" — i.e. retain-and-index, never delete, chain by name.

### 1.11 `ecosystem.md` — §-numbered sections as a stable API
- **Where:** `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md`. Headings observed: `## 4.5 Capability matrix`, `## 4.8 Replication effort + indicative pricing`, `## 4.13 Q&A`, etc. [grep]
- **Machine-operable convention:** skills address it by section number as if calling an API — `sgnk-proposal` "prices from §4.8", reads "§4.5/4.7/4.8/4.9/4.13" (skill description in `~/.claude/CLAUDE.md` routing table and the skills listing). Section numbers are the stable anchor contract.

### 1.12 `PLAN.md` — the mega-document with a build pipeline
- **Where:** `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/mdmax/PLAN.md` — **1,193,234 bytes** (~1.19 MB single markdown file) [measured via `ls -la`]; sibling artifacts `MDMAX-plan-v2.1.0.pdf`, `plan.print.html`, `site/`, `build/`, `tree` — one markdown source compiled to PDF/print-HTML/site. Referenced across the system by §-number (memory file cites "PLAN §10.4", "§6.9").

### 1.13 Research docs — verification-tagged claims
- **Where:** `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/research/frontmatter-product-thesis-research-2026-08-28.md`.
- **Conventions:** a **"Verification statement, read first"** header defining inline claim-status tags — `[measured]` vs `[SS]` (search-summary, unverified) — plus a verification-debt ledger (§12) and a "Settled verdicts … (do not re-litigate)" block. Claim provenance is part of the document format, not an afterthought.

### 1.14 `~/.sgnk/` operational substrate — the JSON/markdown division (shapes only, per instruction)
- `traces/` — **110 daily append-only JSONL files** `YYYY-MM-DD.jsonl` [count only].
- `state/` — per-session JSON sidecars keyed by uuid: `<uuid>.gate-tier.json`, `<uuid>.turn-meta.json`, `<uuid>.count` [names only].
- `evals/` — per-skill dirs (`sgnk-design/`, `gvc/`, …) + JSONL gold sets + **one markdown human surface**: `LABELING-SHEET-2026-06-30.md`.
- `gates/` — executable `assert-*.sh` checks (not markdown — the enforcement layer is shell).
- `baselines/` — timestamped JSON `20260828T…Z_<label>_<hex>.json`; plus `calibration.json`, `PREFERENCE-LOG.jsonl`, `shadow-log.jsonl` at root.
- Markdown at this level: `GLOBAL-REGISTRY.md`, `README.md`, `AGENTS.md` (a `<claude-mem-context>`-wrapped memory block written by the claude-mem plugin).
- The governing rule is written down: **LR#11** in `~/.claude/CLAUDE.md` — "Prefer JSON over Markdown for state files the agent must NOT rewrite … Reserve Markdown for narrative the agent SHOULD restructure." The directory layout is that rule made physical.

---

## PART 2 — The pattern language of a markdown-native OS

Thirteen recurring conventions, each observed in ≥2 independent subsystems above. This is the design vocabulary frontmatter can productize.

1. **Frontmatter-as-contract.** Every operable file opens with YAML declaring identity, routing, permissions, and lifecycle: SKILL.md (`name/description/allowed-tools/capabilities/disable-model-invocation`), memory files (`metadata.node_type/type/originSessionId`), snapshot cards (`id/head_sha/kind`), mdmap (`mdmap: 1/scope/parent/rank/coverage/budget/commit/status`), knowledge notes (full catalog schema). The file *is* the record; the frontmatter *is* its API surface. Machine-written fields (`coverage`, `modified`, `content_hash`) coexist with authored ones.

2. **Description-as-dispatch.** Routing is semantic match on a natural-language `description` field with explicit `Trigger:` / `Use when` / **`NOT for:` anti-trigger** clauses (every SKILL.md; the CLAUDE.md intent→skill table). The negative space is first-class: mis-routing is designed against in the schema itself.

3. **Budget-bounded always-on context.** Token budgets are structural, not aspirational: mdmap `budget: 2000` with the core sections required to fit; CLAUDE.md's attention-budget acceptance check (LR#28) plus `@`-reference imports to defer payload; snapshot `quick` mode as the cheap tier. A markdown file that knows its own token cost is a distinct file-class here.

4. **Append-only ledgers, supersede-never-delete.** Learned Rules ("append-only, numbered, newest at the bottom", now at #73); `JOURNAL.md` ("append-only snapshot log", pipe rows); traces JSONL; mdmap recipe "Kill a claim → mark `superseded-by`, never delete"; HANDOFF chains ("supersedes X … do not delete it"). History is monotone; correction is a new entry pointing at the old one. (The one named exception is secrets — LR#71 reconciles rotation-first against retain-everything.)

5. **Index files above every store.** `MEMORY.md` over memory files, `knowledge.md` over notes, `MAP.md` over regions, `GLOBAL-REGISTRY.md` over repos, `LATEST`/`LATEST-KEY.md` over snapshots. Each index row = link + one-line description. The index is small, always-on; the store is deep, on-demand — the same two-tier memory shape at every scale.

6. **Generated regions inside authored documents.** `<!-- CATEGORIES:START/END -->` markers in `knowledge.md` fence the zones a script may rewrite, leaving the authored shell untouched — safe machine-write zones inside a human document. (The mdmax splice writer in this repo is the same idea industrialized. [inference from memory file `mdmax-cert-audit-handoff.md` naming the splice writer])

7. **Wiki-links as stable addresses; unresolved links as findings.** `[[slug]]` is the universal pointer: memory supersession, knowledge `related`/`entities`, mdmap node addresses, even Learned-Rule provenance tags. mdmap invariant 6 upgrades dangling links from noise to product: "Unresolved links are findings … The gap report is the product" — ghosts/broken/orphans/stale are counted classes.

8. **Typed edges in plain tables.** Relations carry verbs, not just arrows: mdmap `implements/constrains/justifies/projects/depends-on/supersedes/contradicts` (+ a mandatory `why` column); knowledge `builds-on/extends/contradicts/supports/applies/prerequisite-of/part-of`. A markdown table is the edge store; no graph database exists anywhere in this OS.

9. **Fixed numbered sections as machine API.** Consumers address documents by section number: skills price "from §4.8" of ecosystem.md; memory cites "PLAN §10.4"; snapshot cards have fixed numbered sections (`## 1. Verbatim user prompts`…); compaction summaries follow a fixed 9-section schema. Section numbering turns prose into an addressable interface.

10. **The JSON/markdown division of labor (LR#11).** JSON(L) for state machines must not rewrite (manifest.json, traces, gate-tier sidecars, catalog.json); markdown for narrative machines should restructure (cards, KEY, plans, notes). They travel in pairs: `manifest.json` beside `00-KEY.md`; `catalog.json` beside `knowledge.md`; mdmap's layout-coordinates **sidecar** beside the map. The pair — narrative file + machine sidecar — is itself the pattern.

11. **Determinism and cache-friendliness.** mdmap invariant 7: "Same input → byte-identical file. Reshuffling destroys the agent's prompt cache prefix"; snapshot collectors are "deterministic, bounded, secret-safe" and idempotent (`sgnk-write-cards.sh` skips richer hand-authored cards). Stable slugs/IDs everywhere (`YYYYMMDD-slug`, sortable snapshot ids).

12. **Provenance and claim-status as inline format.** `(verified <date>)` on every learned rule; `[measured]` vs `[SS]` tags in the research doc; `fidelity:` enum + `content_hash` in knowledge notes; RULE 5's "I believe vs I verified" distinction. Trust metadata is written *into* the text at claim granularity — a markdown-native citation/verification layer.

13. **Unique dated identities; pointer files for "current".** LR#69 (unique filename with version+date+time, never overwrite a delivered path), snapshot IDs, dated HANDOFF filenames — plus a tiny `LATEST` pointer file so "current" is one indirection, not an overwrite. Version-by-new-file, current-by-pointer.

**Meta-observation:** the OS also demonstrates the *lifecycle* of these documents — skills carry permission tiers (`disable-model-invocation`), routing changes go through offline→shadow→promote (LR#38), and every store has both a human reading path and a machine reading path from the same bytes. That dual-audience property — one file legible to "a human eye and an agent's context window at the same time" (MAP.md line 14–15, stated as the mdmap goal) — is the single sentence that describes the whole system, and it is frontmatter's thesis already written down.

---

## PART 3 — Limits of this sweep
- `~/.sgnk/state/`, `traces/`, `baselines/` were inventoried by directory/file-name shape only, per instruction; no state-file contents were read.
- `~/.claude/imports/sgnk-skills.md` and `~/.claude/CLAUDE.md` content was observed via the system-context injection carrying those exact paths; heading structure of CLAUDE.md was independently verified by grep against the file.
- The frontmatter repo has no `.sgnk/` snapshot dir of its own [measured empty `ls`]; the live snapshot evidence comes from `hq/.sgnk/` and `md/.sgnk/`.
- `ecosystem.md` was read at heading level only; `PLAN.md` at size/dir level only (1.19 MB — targeted-read rule).
- 4 of 124 SKILL.md files were read in depth (sgnk-snapshot, sgnk-complexity-gate, sgnk-evals, sgnk-design) plus 3 frontmatter-only reads (ship, gvc, sgnk-learning-loop-reference); the frontmatter-field inventory generalizes from these 7. [inference for the remaining 117]

## FRONTMATTER HOOKS (structured)

- **SKILL.md frontmatter routing: name/description-with-Trigger-and-NOT-for/allowed-tools/capabilities/disable-model-invocation — natural-language dispatch plus per-file permission gating, live across 124 skills** -> The AI-protocol layer: typed frontmatter keys on any document declaring how AI may operate on it (triggers, permitted operations, tool scope, auto-invocation on/off) — the document becomes self-describing to agents, exactly as skills already are  
  evidence: `/Users/sagnikmitra/.claude/skills-src/ops-agent/sgnk-snapshot/SKILL.md`
- **mdmap: a budget-bounded (budget: 2000), coverage-measured (coverage: 0.247), deterministic markdown map with typed relations, rank tables, and a counted gap report (ghosts/broken/orphans/stale), recursive via parent/rank region frontmatter** -> The project-map view: one diffable markdown file rendering as tree/graph/canvas, with the gap report as the headline feature and a token-budget meter enforcing the always-on core — already spec'd with 8 invariants in-repo  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/mdmap/MAP.md`
- **Machine-regenerated regions fenced by HTML comment markers (<!-- CATEGORIES:START/END -->) inside a hand-authored index, regenerated by script while the authored shell is untouched** -> Safe machine-write zones: editor-enforced splice targets where AI may rewrite content between markers but never outside them — the UI affordance for the existing splice writer  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/knowledge.md`
- **Append-only numbered ledger in markdown: ## Learned Rules with dated _Appended_ markers, imperative numbered entries, verified-dates, wiki-link provenance; plus pipe-row JOURNAL.md ledgers** -> Append-only blocks: a section type the editor lets humans/AI append to but never rewrite in place, with automatic numbering, date-stamping, and supersede-not-delete semantics — for decision logs, changelogs, lab notebooks  
  evidence: `/Users/sagnikmitra/.claude/CLAUDE.md`
- **Two-tier memory: MEMORY.md index (link + one-line description per row) over frontmattered memory files (name/description/metadata.node_type/originSessionId/modified), with [[wiki-link]] supersession** -> Auto-generated index pages: any folder gets an index regenerated from its children's frontmatter name+description; supersession chains rendered as document lineage  
  evidence: `/Users/sagnikmitra/.claude/projects/-Users-sagnikmitra-Desktop-GitHub-frontmatter/memory/mdmax-cert-audit-handoff.md`
- **Snapshot card sets: numbered markdown cards (00-KEY..06-conversation) with YAML frontmatter (id/head_sha/branch/utc/kind) + JSON manifest sidecar + LATEST pointer file + sortable dated IDs** -> Document sessions/versions as a product: version-by-new-file with a current-pointer, lifecycle states in a frontmatter kind key, and a machine manifest beside every human narrative — the data model for frontmatter's version timeline and handoff export  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/hq/.sgnk/snapshots/20260828T081249Z_eod_2026-08-28_7bc9/02-tasks.md`
- **Full metadata contract written as markdown tables: required/recommended frontmatter fields, 14-value item_type enum, fidelity enum, content_hash dedup key, and a typed-relationship edge vocabulary (builds-on/contradicts/supersedes/...)** -> Schema profiles for documents: user-definable frontmatter schemas (with enums, required fields, typed link vocabularies) that the editor validates and the AI protocol reads — meta/schema.md is the working prototype of a frontmatter 'profile' file  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/knowledge/meta/schema.md`
- **Stable numbered-section addressing used as an API: skills cite ecosystem.md §4.5/§4.8/§4.13 and memory cites PLAN §10.4 by number; snapshot cards and compaction summaries use fixed numbered section schemas** -> Stable section anchors: rename-safe section IDs and deep-links agents can cite (and the renderer resolves), turning any long document into an addressable interface  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md`
- **Inline claim-status tagging as document format: [measured] vs [SS] tags with a verification-debt ledger, (verified <date>) on rules, fidelity/content_hash on notes — RULE 5's believe-vs-verified distinction made syntactic** -> Provenance chips: inline claim-status annotations rendered as UI (verified/unverified/measured/simulated) plus the researched citable-content linter — a differentiator no competing editor has  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/research/frontmatter-product-thesis-research-2026-08-28.md`
- **The JSON/markdown division of labor (LR#11) embodied: JSON(L) sidecars for must-not-rewrite state (manifest.json, traces, catalog.json) beside markdown for should-restructure narrative; mdmap invariant 1 puts layout coordinates in a sidecar so the map renders without them** -> The sidecar data model: frontmatter documents pair a .md narrative with machine sidecars (layout, state, index) that degrade gracefully when absent — the architecture answer for canvas coordinates, view state, and AI state without polluting the markdown  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/hq/.sgnk/snapshots/20260828T081249Z_eod_2026-08-28_7bc9/manifest.json`
- **Docs-as-skills: the aios-library category (14 skills) packages reference documentation with keyword-rich descriptions so documentation is semantically routable and fires before risky edits ('read BEFORE editing run_calibration.py...')** -> Retrievable docs: a frontmatter key that registers a document's trigger conditions with the AI, so the right doc self-loads into agent context when relevant files or topics are touched — documentation that routes itself  
  evidence: `/Users/sagnikmitra/.claude/skills-src/aios-library/sgnk-learning-loop-reference/SKILL.md`
- **Deterministic byte-identical regeneration as a stated invariant ('Reshuffling destroys the agent's prompt cache prefix') and idempotent card writers that skip richer hand-authored content** -> Cache-stable rendering/compile: frontmatter's generated outputs (maps, indexes, exports) guarantee byte-identical output for unchanged input — a concrete, testable engineering promise that also makes documents diff-clean and agent-cache-friendly  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/mdmap/MAP.md`
