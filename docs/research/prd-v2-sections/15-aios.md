I mutated nothing: this session ran only `Read` on the five report files; the `~/.claude` (19) and `~/.sgnk` (1) dirty paths predate it, and no git, Write, Edit, or shell command was run at all.

## 15. The internal system, productised

| QUESTION | VERDICT | FALSIFIED BY |
|---|---|---|
| Sell the orchestrator (AIOS) as its own product? | **No.** The substrate has **zero tenancy fields** in the trace ledger and **2 of 151 files** containing any HTTP-listener code [measured] | ≥1 tenant field in the schema, ≥1 non-self paying customer, and ≥10,000 chained ledger rows — all three, not any one |
| Embed part of it in frontmatter? | **Yes — the artifact-facing half.** Ship what is about *the document*; keep what is about *the agent* | A user-visible feature whose value survives without a claim about how the AI learns |
| Keep the rest internal? | **Yes.** It is real QA value aimed at frontmatter's own code, and a trust liability aimed at users | An internal loop that has actually fired, been attributed, and been calibrated against human labels |

**The whole productisation reduces to one filter: an internal asset ships if its output is a fact about the user's file, and stays internal if its output is a claim about the software's own intelligence.**

---

### 15.1 What already runs, measured

All counts read from live files on this machine on 2026-08-29, read-only.

| STORE / SURFACE | LIVE COUNT | TAG |
|---|---|---|
| `~/.sgnk/bin/` entries | **149** → **147 executables** (79 `.sh` + 66 `.py` + 2 extensionless; `AGENTS.md` and `__pycache__` are not tools) | [measured] / [derived: 79+66+2=147] |
| `~/.sgnk/bin/` total bash+python lines | **21,481** | [measured] |
| — of which self-declare READ-ONLY / OFFLINE / PROPOSES-ONLY / RETRIEVAL-ONLY | **32 of 147** | [measured, grep] |
| `~/.sgnk/gates/` scripts | **69** = 33 `assert-*` + 34 `break-*` + 2 harness meta | [measured] |
| `~/.claude/skills-src/` SKILL.md | **124** across **27** category dirs | [measured] |
| `~/.claude/skills/` SKILL.md (incl. plugin-vendored) | **309** | [measured] |
| `settings.json` hooks | **28 across 9 events** (SessionStart 9, UserPromptSubmit 5, PreToolUse 6, PostToolUse 3, Stop 2, SubagentStop 1, SessionEnd 1, PreCompact 1) | [derived: 9+5+6+3+2+1+1+1=28] |
| `traces/` daily ledger | **63 `.jsonl` files, 5,018 rows**, 30 keys/row | [measured] |
| — `accepted` non-null | **181 / 5,018 = 3.607%** | [derived] |
| — `skill: "unknown"` | **3,946 / 5,018 = 78.637%** | [derived] |
| `state/complexity-gate-log.jsonl` | **24,669 rows**, 2026-07-17T21:01:09Z → 2026-08-28T20:20:22Z = 42 days = **587.357 rows/day** | [measured] / [derived] |
| — floor / strong | **95.1194% / 4.8806%** (23,465 / 1,204) | [derived] |
| — single / workflow | **99.1163% / 0.8837%** (24,451 / 218) | [derived] |
| — `rule2_gated: true` | **10,191 = 41.311%** | [derived] |
| — floor **and** guarded | **38.068%** (9,391 / 24,669) | [derived] |
| `state/` total entries | **43,703** (21,679 `.gate-tier.json` + 15,758 `.turn-meta.json` + 6,144 `.count` = 43,581 of them) | [measured] / [derived] |
| Machine-fed stores | propensity **44,279** · subagent-reconcile **29,081** · routing-journal **26,037** · trifecta-decisions **8,088** · session-evals-rc **6,476** · injection-hits **1,707** | [measured] |
| Human-fed stores | assertions **725** · trigger-log **388** · spawn-log **255** · `PREFERENCE-LOG.jsonl` **232** · self-heal **139** · routing-shadow **83** · ledger-chain **59** · regression-gates **40** · casebank-ops **5** · prereg **2** · shadow-log **1** | [measured] |
| `PREFERENCE-LOG.jsonl` composition | **188 accepted / 44 rejected = 81.034% / 18.966%**; **223/232 = 96.121% carry no skill attribution** | [derived] |
| `regression-gates.jsonl` | **40 rows, 40 `proven_nonvacuous: true`**, last registered 2026-08-13T01:41:14Z — **16 days stale** | [measured] / [derived] |
| `assertions.jsonl` | **725 rows: 386 true / 339 false = 53.2414% pass**; test:py 393 · build:js 201 · test:js 75 · typecheck:ts 26 · lint:js 16 · typecheck:py 8 · lint:py 6 | [derived] / [measured] |
| `injection-hits.jsonl` | **1,707** — Bash 1,667 · WebFetch 34 · WebSearch 6 | [measured] |
| `calibration.json` (2026-08-28T20:10:09Z) | low n=14 rate 0.0 · mid n=0 · high n=26 **rate 0.269** vs a 0.20 bar → CALIBRATION_DRIFT condition met | [measured] / [derived] |
| `skill-health.json` (2026-08-28T18:27:54Z, 7-day window) | 131 tracked: **active 0**, dormant 5, dead 116, infrastructure 10 — contradicted by **446 trace rows** for `sgnk-drift-watch` in the same window | [measured] |
| mdmax engine | **13 files / 3,614 lines**; **15 targets**, **19 constructs**; `uncertifiableShare()` = **8 of 15 (53.3%) not locally probeable**; benchId `51947c2e88127bfcd80125c705404f0b9f4c54165b95c8cbd4f19fdfe071d360`; fold `mdmax/fold@1` | [measured] |
| mdmax live run on `docs/mdmap/MAP.md` | 24 blocks × 7 local targets = **168 cells: PASS 104 · STRIP 2 · CORRUPT 13 · VOID 49** | [measured] |
| mdmax histogram over `docs/mdmap` | **21 files, 517 blocks, 259 with BROKEN = 50.10%, 21/21 files affected** | [measured] |
| Other markdown assets | `knowledge/` 5 scripts / 709 lines, **203 notes, 0 errors, 94 warnings**; `sgnk-campaign/` 16 py files / 5,807 lines (7 generators, 6 gates, 3 infra); `docs/mdmap` 21 `.md` / **0 lines of code**; fm `preview/` 21 files / 2,306 lines; fm `export/` 5 files / 646 lines; graphify 0.7.9, **3,848 nodes / 3,737 links** | [measured] |
| npm names | `mdmax` **404 (free)** · `frontmatter` **200 (taken)** · `aios` **200 (taken)** · `sgnk` **404** · `frontmatter-cert` **404** · `gray-matter` **8,989,723 weekly downloads** (2026-08-21→27) | [fetched] |

**Disagreements, recorded not reconciled:**

- `bin/` count: **149** entries under one exclusion rule vs **151** non-`__pycache__` files / **133** executable under another [both measured]. Neither is wrong. Do not publish a single number without stating the rule.
- Floor rate: CLAUDE.md LR#35 says **90% / 10%** at n=2,064 (2026-07-28); the master plan §4 L2 says **90% floor** at 23,778; live is **95.1194%** at 24,669 [derived]. **Do not quote "90% floor" anywhere externally** — re-derive at write time.
- Trace-ledger schema: a **31-field** row in one report vs a **32-key union across rows ranging 16–30 keys** in another [measured]. The rows are sparse JSONL; "the schema" is not a fixed row shape.
- `baselines/`: **2,382** vs **2,381** [both measured] — one file's drift between two reads on the same day.
- "110 daily trace files" appears in three prior grounding docs. It counts 46 `.lock` files and a `steps/` subdir. **The daily ledger is 63 files.** Any deck quoting 110 is quoting lockfiles.
- Engine count in mdmax: **6 engine implementations pinned** (unified 11.0.5, react-markdown 10.1.0, marked 16.4.2, markdown-it 15.0.0 ×2 configs, commonmark 0.31.2, kramdown 2.5.2 + kramdown-parser-gfm 1.1.0) across **7 local targets** of 15 declared [measured]. Where product copy says "7 engines" it means 7 local targets.

The single structural fact this section establishes: **machine-fed stores all exceed 1,000 rows; every human-fed store is under 250** — roughly 176,000 machine rows against 232 preference rows [derived]. Build nothing whose value depends on the user rating something.

---

### 15.2 Internal asset to product feature

Lift: **S** ≤1 week · **M** 2–6 weeks · **L** ≥1 quarter.

| INTERNAL ASSET | WHAT IT DOES TODAY | PRODUCT FEATURE | LIFT | D2C or B2B or INTERNAL |
|---|---|---|---|---|
| Trace ledger, 11 tools, 5,018 rows, `files_touched` + `files_sha256` + `prompt-to-line.py` [measured] | One `gen_ai.*`-mapped row per task, machine-local | **AI ink**: per-document `.frontmatter/trace.jsonl` sidecar; hover any paragraph for `{contributor, model, promptDigest, sessionRef, kept/reverted}` | M | BOTH |
| `ledger-chain.jsonl`, 59 rows [measured] | Hash chain over ledger entries | **Tamper-evident AI-edit export**: the review artifact a compliance reader accepts | M | B2B |
| 33 `assert-*` + 34 `break-*` + `regression-gates.jsonl` 40/40 `proven_nonvacuous` [measured] | Every registered check has a recorded command that makes it fail | **Proven-non-vacuous badge**: a check with no falsification proof renders as *unproven*, not green | S | BOTH |
| F4 assertion producers (8 tools), `assertions.jsonl` 725 rows [measured] | Wrap any command, log pass/fail, composite-veto verdict | **`npx mdmax cert` + GitHub Action + `--fail-on=BROKEN`**: docs fail the build when they render broken for a named consumer | S | B2B |
| mdmax, 13 files / 3,614 lines, 15 targets × 19 constructs, `mdmax/fold@1` [measured] | 4-verdict differential across engines; missing engine = hard refusal | **The degradation certificate itself** — the one capability with no competitor in the surveyed field | S (shipped) | B2B |
| Complexity gate, 24,669 rows, 95.1194% floor [derived] | 5-D verdict routes each call to the cheapest sufficient model | **Visible AI meter in currency** + per-action line ("small model · 0.4¢ · [redo on the large model]") | S | D2C surface, B2B policy |
| `escalation-ladder.sh`, 7 deterministic rungs [measured] | `sonnet/medium → sonnet/high → opus/medium → opus/high → opus/xhigh → opus/max → fable/high` | **"Try harder"** button: one rung up, cost delta shown before it runs, both outputs diffed | S | D2C |
| F7 reward mining, `accepted_asis / edited_kept / abandoned` survival verdicts [measured] | Mines git + edit distance for whether an AI edit survived | **Edit-survival telemetry** — never a rating prompt; local-first, visible, deletable, exportable | M | D2C |
| `PREFERENCE-LOG.jsonl`, 232 rows [measured] | Accept/reject pairs, 96.121% unattributed | **"What I've learned about your edits"** panel: per-row delete, one-click export, global off switch | S log / M panel | D2C |
| F11 drift-watch + 2,382 baselines [measured] | Baseline → compare → alert with dedup and severity | **Doc Health**, deterministic checks only: broken link, broken anchor, duplicate heading, expired `verified.until`, unreviewed AI edit, cited file newer than the doc | M | BOTH |
| F10 session lifecycle (9 tools) + snapshot cards `00-KEY.md…06-conversation.md` + `GLOBAL-REGISTRY.md` 58 repo rows [measured] | Snapshot-on-exit, KEY on start, PreCompact preservation | **Sessions as documents** + ChatGPT/Claude ZIP importer where the *verification report* is the demo | L | D2C |
| 11 weekly `rules-hygiene-*.md` reports; `MEMORY.md` index shape [measured] | Report-only; the rules file is never auto-edited | **Memory as an ordinary markdown file** the user opens, edits, deletes — plus a hygiene *review prompt*, never an auto-prune | S file / M hygiene | BOTH |
| `aios-library`, 14 docs-as-skills [measured] | A doc declares the conditions under which it should be read | **Docs that route themselves**: a frontmatter key registering trigger conditions | M | BOTH |
| `freeze` / `unfreeze` / `guard` skills [measured] | Breadth-limit an agent's write authority | **Document freeze**: lock a section; AI and collaborators both bounce off it | S | B2B |
| `knowledge/scripts/validate.py`: 6 required keys, 5 enums, 14 `item_type` values, 203 notes / 0 errors / 94 warnings [measured] | Hard vs soft findings, exit-coded | **`fm lint --schema`**: user-declarable frontmatter contract, validated in-editor and in CI | M | B2B |
| `build_catalog.py:146 replace_block`, `<!-- CATEGORIES:START -->…END` [measured] | Regenerates blocks inside a hand-edited file | **`<!-- fm:generated:x -->` regions**: byte-stable, survive concurrent human edits, refuse on drift | M | BOTH |
| `apply-patches.py`: NOT FOUND / AMBIGUOUS / NO-OP refused, APPLIED re-read from disk [measured] | Four-verdict find/replace applier | **The refusal contract for every AI edit and toolbar transform** — this is the splice writer's missing verdict vocabulary | S | INTERNAL → BOTH |
| 6 campaign gates: `check-render.py` (COLLISION/EDGE/CLIPPED), `check-overflow.py`, `check-clarity.py` [measured] | Measure *rendered* pixels, not source opinions | **Export gates** on frontmatter's own PDF/HTML path, which today has none | M | B2B |
| `check-provenance.py` hard rule [measured] | Every numeric token in the derived artifact must appear in a source | **Numeric-provenance linter** over any transform: excerpt, summary, share snapshot, AI rewrite | S | BOTH |
| Red-proof evidence discipline (`[measured]`/`[fetched]`/`[SIMULATED]`) [measured] | Convention in prose, enforced by nobody | **Provenance chips** as a rendered, lintable inline tag with `{value, source, tier, re_verify_cmd}` | M chips / L execution | BOTH |
| `scan_paste.py` 44-extension triage + `type-handlers.md` 14-format extraction matrix with an honest `fidelity` field [measured] | Classifies an arbitrary folder tree | **Vault import triage**: drag a folder in, get a typed plan before anything is written | M | D2C |
| `incident-to-eval.py` + `regression-synth.py` + `sgnk-regression-gate.sh` [measured] | Turns a defect into a permanent, registered check | **Incident → permanent check block** with an executable `broke:` field — a document primitive no competing editor has | M block / L CI | B2B |
| `sync_to_md.py` link rewriter + `slug-decision-audit.mjs` [measured] | The only working slug↔title link rewriter here; the audit measures anchor swing but applies nothing | **`fm rewrite --dialect obsidian\|github\|commonmark`** with splice-level byte-identity proof on untouched bytes | M | BOTH |
| `injection-hits.jsonl`, 1,707 rows [measured] | Counts injection-shaped patterns per tool | **Counted paste/import risk log** with a per-hit reason — never a green "you are safe" shield | S | B2B |
| F1 bandit (13 tools), F3 test-time compute (9), debate/consensus/reflexion, `skill-health.json`, 5 `UserPromptSubmit` hooks, raw `traces/` store, `explore-budget.sh` | See 15.4 | **None** | — | INTERNAL |

**Ship order, by evidence quality:** memory-as-a-file (S) → cost meter (S) → "Try harder" (S) → proven-non-vacuous badge (S) → `mdmax cert` CI (S) → trace provenance (M) → provenance chips (M) → Doc Health checks (M) → regression blocks, B2B (M) → schema lint (M) → importer (L).

**Anti-recommendation:** do not ship any composite score — vault health, document grade, routing confidence, quality number. Every scalar in this stack is contradicted by at least one other ledger in the same stack: `skill-health.json` says **active 0 of 131** while the trace ledger records **446 rows** of that same window's activity [measured]. A user-facing scalar hides that disagreement instead of resolving it.

---

### 15.3 User-authorable automations as markdown documents

| CONSTRAINT | MEASURED / FETCHED VALUE | DESIGN CONSEQUENCE |
|---|---|---|
| Official SKILL.md spec keys | **6**: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` [fetched] | Editor writes only these |
| Keys in use locally | **20 distinct** across 124 files [measured] | 14 of them are decoration |
| Files that would fail packaging today | **54 / 124 = 43.5%** [derived: 124 − 70 spec-clean] | Non-spec keys are a **hard error**, not a warning: `Unexpected key(s) in SKILL.md frontmatter: argument-hint. Allowed properties are: allowed-tools, compatibility, description, license, metadata, name` [fetched] |
| Inert keys with zero readers anywhere | `preamble-tier` **28 files**, `gbrain` **6**, `benefits-from` **4**, `triggers` **36**, `version` **36** [measured] | No free-form frontmatter — comments belong in the body |
| The one home-grown key with a real consumer | `capabilities` → `sgnk-skill-track.sh:48` [measured] | Ship it as a **logged product feature**, not as a key users maintain |
| Hard caps | `name` ≤64, `description` ≤1024, `compatibility` ≤500 [fetched] | Enforce at the keystroke with a live counter, not at export |
| Over-cap files locally | **17 / 124**; `sgnk-mobbin` at **1,885 chars is visibly truncated with `…` in this session's own listing** [measured] | The failure is live, not theoretical |
| Listing budget | description + `when_to_use` truncated at **1,536** combined chars; total listing budget = **1% of the model context window**; least-invoked skills lose their descriptions first [fetched] | Put the *when* before the *what*; surface a listing-budget meter; cap library size per user |
| Body size | n=124, min **36**, median **266**, max **3,058** lines [measured] | Recommend 266 lines as the split-to-`references/` threshold |
| Negative scoping | **70 / 124** descriptions carry `NOT for:` naming the sibling to use instead [measured] | The editor generates this clause; it is the only collision-prevention mechanism in a large listing |
| Inline triggers | **21 / 124** open with a literal `Trigger:` list, while the separate `triggers:` key is inert [measured] | Triggers go in prose, in `description` |
| Shell injection | **0 / 124** use the `` !`cmd` `` syntax [measured] | Refusing it in imported documents costs this corpus nothing and closes arbitrary execution on open |
| Invocation locks | **11 / 124** set `disable-model-invocation: true`, and every one is destructive or outward (`sgnk-approve`, `sgnk-md-update`, `ship`, `land-and-deploy`, `deploy-to-vercel`, `vercel-cli-with-tokens`) [measured] | That ratio is the design pattern: outward or destructive ⇒ never auto-fires |
| Name/dir integrity | **3** `name` ≠ parent-directory violations locally, which the spec forbids [measured] | Rename key and folder atomically |
| Tool-grant lifetime | `allowed-tools` is **experimental, support varies between implementations**, and Claude Code **clears the grant on the user's next message** [fetched] | The UI must say "for this turn"; the host permission system is the boundary, never the key |

**The authoring model, three tiers:**

- **Typed by the user (2 keys + 1 selector):** `name`, `description`, and a *Run mode* selector. Run mode compiles to `disable-model-invocation: true` for the local runtime and is **dropped on export**, because that key is a Claude Code extension, not spec [fetched].
- **Written by the editor, never hand-typed:** `allowed-tools` (space-separated, generated from checkboxes — the spec says space-separated; **37 local files use YAML-list form and 4 use commas** [measured], and only the space form survives export), `metadata`, `compatibility`.
- **Refused by the editor:** every other key. This removes all 54 export-failures, all 17 cap violations, and all 3 name/dir violations at once.

**Three gates a non-programmer can run:**

1. **Lint** — 6 keys, two length caps, the `^[a-z0-9]+(-[a-z0-9]+)*$` name regex, name == dirname. Deterministic, zero model calls.
2. **Trigger test** — the author writes 3 phrases that should fire it and 3 that should not; the harness checks selection against the *whole* existing listing. This is the only failure mode an author cannot self-diagnose, because it depends on everyone else's descriptions rather than on theirs.
3. **Dry run** — execute under a read-only tool grant and show the transcript. Never a first run with write tools.

**Sharing is file-out, file-in, peer-to-peer.** Export a directory (`SKILL.md` + optional `scripts/ references/ assets/`) as a zip; on import, disclose the `allowed-tools` grant and every path the body references, and default imported automations to manual-only for the first N runs. Imported document text is data, never instruction — a shared SKILL.md is untrusted third-party content, and body text asserting authority or pre-authorization is the primary attack surface the moment sharing exists.

**Anti-recommendations — each names the mechanism that converts a document format into the banned marketplace:**

- No central index, gallery, or search over other users' automations. Discovery-of-strangers'-code *is* the marketplace. Local symlink promotion (`~/.claude/skills/<name>` → `skills-src/<category>/<name>`, no build step [measured]) is the correct ceiling.
- No install-by-identifier. The moment a user obtains an automation without reading it, a package manager has replaced the document.
- No versioning, upgrade, or dependency resolution. **36/124 files carry `version:` and nothing reads it** [measured] — making it functional means resolvers, lockfiles, and transitive trust.
- No `requires` / `parent` / `composes-with` typed edges. A dependency graph needs a registry to resolve it.
- No ratings, download counts, verification badges, or "featured" surface. Reputation primitives only make sense when the population is strangers.
- No executable payload by default. The corpus already ships **119 committed `.pyc` files** [measured] — unreadable by the person consenting. If `scripts/` is supported at all, it is opt-in per import, per file, source shown.
- No paid tiers or entitlement fields in `metadata`, which the spec explicitly offers for "entitlement or catalog fields" [fetched] — an invitation to decline.

**The line to hold: a user may write an automation, run it, and hand the file to a specific person; a user may not browse, install, rate, depend on, or update someone else's.** [inference]

---

### 15.4 What must stay internal, and why

| ASSET | LIVE STATE [measured] | WHY IT IS A TRUST BURDEN IF SHIPPED |
|---|---|---|
| **Learned-rules ledger** (RULE 1–8 + numbered rules) | **74 rules / 892 lines** in the live `CLAUDE.md`; the latest of 11 weekly hygiene reports parsed **69**, so the report is **5 rules stale** [derived]; **69/69 carry zero citations**; a second count puts it at 76 — recorded, not reconciled | The user-facing sentence is "the AI keeps a private file of rules about you, and its own auditor is out of date about what is in it." A ledger whose every entry is uncited cannot be defended when a user disputes one, and no demand signal for it exists anywhere in the record. Ship *memory as a file the user owns and can delete* (15.2) — never an agent-authored ruleset about the user. |
| **The bandit's learning claim** (F1, 13 tools) | 10 arms; **3 of 10 carry `"seeded": "offline-0.5x"`** — synthetic, not live evidence; largest arm is literally named **`__unattributed__`** (opus a=24.1 b=5.9 → posterior mean **0.80333** [derived]); `shadow-log.jsonl` **1 row**; `prereg.jsonl` **2 rows**; `routing-shadow.jsonl` 83 rows; **96.121% of preference rows carry no skill attribution** | "It learns which model suits you" is a claim with no attributable evidence behind it, and the record contains three documented incidents of prematurely calling this loop live (LR#60/#62/#63). The moment a user asks "learned from what?", the honest answer is an arm named `__unattributed__`. The negative class is worse: the system's own epoch entry measures **precision[rejected] = 0/8 = 0.000** — every rejection it has ever emitted was wrong — so acting on it is worse than acting on nothing. Ship the **deterministic 7-rung ladder as a button**; ship zero learning claims. |
| **Debate panels and multi-agent adjudication** (`sgnk-consensus`, `sgnk-debate-panel`, `sgnk-reflexion-step`, `bon-*` ×5, `poll-aggregate`, `codex-judge`, `red-team`, `sgnk-fault-inject`) | Excellent against frontmatter's own code; **`~/.sgnk/insights/` does not exist after 14 months** — infrastructure built and then never fed is this system's documented failure mode | Every one of these multiplies model calls per user action, which is COGS a bundled-inference consumer tier cannot absorb, and each adds a latency and an explanation the user did not ask for. Worse, LR#16 already holds that debate convergence is not correctness — so a converged panel cannot authorise anything, which means the user is paying for deliberation that carries no authority. |
| **Raw `traces/` as a data store** | 30 keys per row over a **32-key union**, rows ranging **16–30 keys**, including **`cwd` — absolute filesystem paths into client repositories**; **zero tenancy fields** (no `tenant`/`org`/`user`/`account`/`workspace`/`team` key exists across 45 sampled rows) | Publishing or syncing this store exfiltrates client identity through directory names before it delivers a single feature, and there is no column to scope a redaction to. Ship the **schema and the per-document sidecar**; the machine-local store never leaves the machine. Retrofitting tenancy later means re-keying 24,669 gate rows, 44,279 propensity rows, 26,037 routing-journal rows and 2,382 baseline files that are currently addressed by filesystem path and machine-local session UUID. |
| **`skill-health.json` as a dashboard** | 131 tracked: **active 0, dormant 5, dead 116, infrastructure 10** — while the trace ledger shows **446 rows** for one of the "dead" skills in the same 7-day window | Correct internally (dormant ≠ dead, LR#51) and catastrophic as a screen a customer sees about their own automations: it tells a paying user that 116 of the 131 things they built are dead, on the strength of a metric another ledger in the same system contradicts. |
| **The 5 `UserPromptSubmit` interruption hooks** (`sgnk-nudge`, `sgnk-reward-gold-nudge`, `sgnk-skill-suggest`, `sgnk-digression-guard`, `sgnk-pref-capture`) | **5 of 5** prompt-submit hooks are interruption hooks; `sgnk-digression-guard` has **0 `*.contract.json` files** and **0 trace rows** across all 63 trace files — it has never fired here | This is the ambient-writing-coach pattern the master plan §10 already bans, and 28 hooks in an editor is 28 chances to interrupt a sentence. A loop that has never fired cannot be productised honestly, and a background model call judging a user's prose against a goal it inferred is both a cost line and a paternalism problem. Ship a **`brief:` key the user writes themselves**, checked on request. |
| **`break-*.sh` as a user-runnable action** | 34 scripts that deliberately break the thing so the paired assert must go red | Ship the *property* — a check is displayed as unproven until a paired failing fixture is recorded — never the button. A user-triggered "break my document" action is a data-loss vector. |
| **Exploration routing on customer work** (`explore-budget.sh`) | Auto-disarms internally; gated OFF for P0 and client tasks | Randomly routing a paying user's document to a non-default model to gather counterfactual signal is indefensible, whatever it is called in the UI. |
| **Trifecta / injection detector as a badge** | `trifecta-decisions.jsonl` **8,088 rows**, `E=true P=true U=true` on **8,088/8,088 = 100%** [derived] | A detector that has never once said "no" cannot back a security badge. Ship the **counted hit log** (1,707 rows, Bash 1,667 · WebFetch 34 · WebSearch 6) with a per-hit reason; never a green shield. |
| **Any judged quality score** | `sgnk-complexity-gate` eval: n=20, **kappa 1.0**, `gold_status: "synthetic-unverified"`, `meets_kappa_bar: false`, self-labelled **"IN-DISTRIBUTION / TAUTOLOGICAL"**; adversarial re-run n=16, kappa_AB **0.863**; calibration's top bucket corrects at **0.269 against a 0.20 bar** [derived] | A number the user cannot dispute, backed by gold the file itself calls tautological. Ship **binary gates with the failing lines linked** (LR#4), and if a judge is ever used, its precision / recall / kappa ship with every verdict (LR#5). Never a Likert writing score — schema-rejected internally at every layer. |

---

### 15.5 Is the orchestration layer itself sellable?

**Verdict: no. Do not build, package, or sell AIOS as an observability, routing, eval, or agent-orchestration product.** Embed the five document-facing hooks named in 15.2 and interoperate with the incumbents by emitting OTel to *their* endpoints.

| VENDOR | ENTRY PAID TIER | FREE TIER | TAG |
|---|---|---|---|
| Langfuse | Core **$29/mo** (100k units, +$8/100k); Pro **$199/mo**; Teams add-on **$300/mo**; Enterprise **$2,499/mo** | Hobby, **50,000 units/mo** | [fetched] |
| Laminar | Starter **$30/mo** (3GB, +$2/GB); Pro **$150/mo** (10GB, 6-mo retention) | 1GB, 7-day, 1 seat | [fetched] |
| LangSmith | Plus **$39/seat/mo** (10k base traces); LCU $1.50, LSU $1.00 | Developer $0, 1 seat, **5,000 traces** | [fetched] |
| Portkey | Production **$49/mo** (100k logs, +$9/100k) | 10k logs/mo | [fetched] |
| Arize AX | Pro **$50/mo** (50k spans, 10GB, 30-day) | 25k spans, 1GB, 15-day | [fetched] |
| W&B Weave | Pro **from $60/mo** | $0/mo | [fetched] |
| Helicone | Pro **$79/mo**; Team **$799/mo** | 10k requests, 1GB, 1 seat | [fetched] |
| Galileo | Pro **$100/mo** (billed yearly) | $0/mo, unlimited users | [fetched] |
| Braintrust | Pro **$249/mo** ($249 credits, 5GB, 50k scores, 30-day) | Starter $0 ($10 credits, 1GB, 10k scores, 14-day) | [fetched] |
| HoneyHive · Maxim · AgentOps | **no price extractable** — JS-rendered pages; unmeasured ≠ absent | — | [fetched] |

- **Median entry paid tier = $50/mo.** Values {29, 30, 39, 49, 50, 60, 79, 100, 249}, n=9, median = 5th value [derived].
- **9 of 9 priced vendors ship a free tier** [derived from the table]. Price floor is **$29/mo** against a **$0** self-hostable option at **33,864 stars**.
- **Scale check 1.** The entire lifetime complexity-gate log is 24,669 rows. Langfuse's *free* tier includes 50,000 units/month. 24,669 ÷ 50,000 = **0.49338 — 49.338% of one month of one vendor's free allowance** [derived].
- **Scale check 2.** The entire trace ledger is 5,018 rows. LangSmith Developer (free) includes 5,000 traces/month. 5,018 ÷ 5,000 = **1.0036 — the whole ledger is one month of a free tier** [derived].
- **Distribution gap.** LiteLLM 57,495 stars; Langfuse 33,864; Portkey gateway 12,845; Phoenix 11,227. npm last-month: `langsmith` **26,474,529**, `@langfuse/core` **8,735,327**, `langfuse` **8,003,800**, `braintrust` **5,951,758** [fetched].
- **The model vendor has absorbed four of the six candidate capabilities** [fetched, docs.claude.com]: org / group / member spend limits with daily CSV export; `claude.ai/analytics/claude-code` plus a Claude Code Analytics API and an Enterprise Analytics API; `CLAUDE_CODE_ENABLE_TELEMETRY=1` exporting OTel metrics, logs and traces (beta) to any OTLP endpoint; `GET /v1/skills` with `source=custom|anthropic` and **Versions**; and a multi-tenant nav listing Managed Agents, Environments, Sessions, Deployments, Vaults, Memory Stores, Workspaces, Service Accounts, Federation, Rate Limits and Tunnels. Their published benchmark is **~$13 per developer per active day, $150–250 per developer per month, below $30 per active day for 90% of users**.

**The strongest argument against this verdict, stated at full strength.** The compliance wedge is separable, has a regulatory forcing function, and embedding it caps its addressable market. Anthropic's analytics give *aggregates* — spend per user, per model, CSV, daily [fetched]. They do not give **byte-level attribution of which bytes in a repository a model wrote**, nor a tamper-evident chain over that record. Both primitives already exist here: `files_sha256` and `files_touched` in the trace row, and `ledger-chain.jsonl` as a hash chain [measured]. **No vendor in the eleven-row table above sells "prove which bytes an agent wrote, and prove the log was not edited"** — that is a real, named, unoccupied gap in a well-funded field, and an enterprise forced to answer *"which of these commits are model-authored, under which policy, and can you prove the log is intact"* will pay more than $249/mo and will not care that the answer arrives inside a markdown editor. Embedding it therefore shrinks the buyer set from *every regulated engineering org* to *frontmatter users*. That is the honest case for selling it separately, and it is not weak.

**Why the verdict survives it.** `ledger-chain.jsonl` holds **59 rows** — a prototype, against a free tier that ingests 50,000 units a month [measured/derived]. There are **zero tenancy fields** in the schema, and a compliance buyer's first question is "scoped to which org" [measured]. **2 of 151 files contain any HTTP-listener code**; this is a filesystem-coupled single-operator rig, not a service [measured]. The compliance checklist — SOC-2 Type II, HIPAA, SAML SSO, RBAC, audit logs, data residency, DPA, BAA, uptime SLA — appears in the Langfuse, Helicone, Braintrust, Arize and Portkey feature tables and in none of ours [fetched]. And the precedent is inside our own record: `shadow-log.jsonl` = 1 row, `~/.sgnk/insights/` absent after 14 months [measured]. Building infrastructure and then not feeding it is this system's documented failure mode, and a compliance SaaS is the most expensive possible instance of it.

**Falsification bar, in Rule #32 shape.** Reopen this decision only when all three hold: ≥1 tenant/workspace field in the trace schema, ≥1 non-self paying customer, ≥10,000 chained ledger rows. Until then the compliance product is a hypothesis, not a roadmap item.

**Recommendations, with their anti-recommendations:**

- **Ship the artifact-conformance slice as the product surface** — `npx mdmax cert`, `--fail-on=BROKEN`, GitHub Action, priced as document CI. Position against nobody, because every vendor above instruments *the call* — prompts, tokens, latency, spans, scores — and **none certifies the artifact against downstream renderers** [inference from the eleven pricing and feature pages opened]. **Anti-recommendation:** do not price or position it as observability; that puts it beside a $29 floor with a free self-hostable alternative.
- **Register `mdmax` on npm now** — `registry.npmjs.org/mdmax` returns **404** [fetched]. **Anti-recommendation:** do not claim `frontmatter` as an npm name; it returns **200** and is taken [fetched].
- **Add a tenant/workspace field to the trace schema now if the compliance wedge is even a maybe.** It is cheap today — the rows are sparse JSONL already varying 16–30 keys [measured] — and expensive after 100,000 rows.
- **Emit OTel from frontmatter's agent layer to the customer's existing endpoint.** Interoperate with Langfuse, Phoenix, Braintrust; do not compete with them. **Anti-recommendation:** do not build a storage or trace-viewing UI of our own.
- **Keep the complexity gate as an unmarketed internal COGS mechanism.** Its value is margin on frontmatter's own AI calls, and it is what makes a bundled-inference consumer tier survivable — not a SKU. **Anti-recommendation:** do not sell model routing or a gateway; LiteLLM is free at 57,495 stars and Portkey bundles it at $49/mo [fetched/measured].
- **AIOS's real contribution to the shippable slice is discipline, not code** — fail-first gate validation, floors rather than equality pins, preflight-the-environment, producer/consumer field-name contracts. That discipline is *why* a green certificate can be trusted, and that is the product claim [inference].
