No mutation: this session ran only `ls`/`find`/`wc`/`grep`/`python3 -c` reads and two `curl` GETs — no Write/Edit, no git, no writes under `~/.claude` or `~/.sgnk`; the 19+1 dirty paths predate it.

### 0. Read-only attestation
No file was created, edited, or deleted; no git or mutating command was run. Every number below came from `ls`/`find`/`wc`/`python3 -c` reads plus two `curl` GETs.

---

### 1. Live counts vs the three grounding docs — where they disagree

| Thing | This machine, 2026-08-29 [measured] | g2 (2026-08-29) | i4 (2026-08-28) | i5 (2026-08-28) | Verdict |
|---|---|---|---|---|---|
| `~/.sgnk/bin/` entries | **149** (79 `.sh` + 66 `.py` + 2 extensionless + `AGENTS.md` + `__pycache__` → **147 executables** [derived: 79+66+2=147]) | 149 | "notable tools" only | — | agree on 149; **g2 never says 2 of the 149 are not tools** |
| `~/.sgnk/gates/` | **69** = 33 `assert-*` + 34 `break-*` + `parse-under-both-shells.sh` + `register-pending.sh` | "69 scripts — 34 assert/break **pairs**" | — | "executable assert-*.sh" | **disagrees**: pairs are not symmetric — 33 vs 34 |
| `skills-src/` SKILL.md | **124** across 27 dirs | 124 / 130 linked | "~93–102", "99", "95" | 124 | i4 **stale by 22–31**; g2/i5/live agree at 124 |
| Largest categories | ops-agent **25**, aios-library **14**, plan **10**, knowledge-docs **8**, browser **7**, ops-safety **7**, knowledge-search **6** | ops-agent 26, aios-library 15, plan 11, knowledge-docs 9, browser 8, ops-safety 8 | — | ops-agent 25, aios-library 14, plan 10, knowledge-docs 8 | **g2 is +1 on every category** — it counted `CATEGORY.md` as a skill. i5 and live agree exactly. |
| `settings.json` hooks | **28 across 9 events** (SessionStart 9, UserPromptSubmit 5, PreToolUse 6, PostToolUse 3, Stop 2, SubagentStop 1, SessionEnd 1, PreCompact 1 = **28** [derived]) | 28 / 9 | — | — | agree |
| `traces/` | **63 top-level `.jsonl`, 5,018 rows**; +24 files in `traces/steps/`; +46 `.lock` files (133 files total) | "110 daily JSONL files, 5,014 rows" | "110 daily files, 4,994 rows" | "110 daily JSONL" | **all three disagree with live.** 110 counts locks and steps; the daily ledger is 63 files. |
| `state/complexity-gate-log.jsonl` | **24,669** | 24,539 | 23,778 | — | all moved; none wrong |
| `state/*.gate-tier.json` | **21,679** | 21,556 | — | — | +123 |
| `state/*.turn-meta.json` | **15,758** | 15,634 | — | — | +124 |
| `state/*.count` | **6,144** | 6,021 | — | — | +123 |
| `state/` total entries | **43,703** | — | — | — | new |
| `propensity.jsonl` / `routing-journal.jsonl` | **44,279 / 26,037** | 44,037 / 25,913 | — | — | both moved |
| `accepted` fill, last 14 daily files | **7 / 694** | 7 / 691 | 7 / 688 | — | numerator frozen at **7** across 3 measurements — the explicit channel is dead, not slow |
| `baselines/` | **2,382** | 2,382 | — | — | agree |
| `PREFERENCE-LOG.jsonl` | **232** | 232 | 232 | — | agree; also frozen |
| `skill-health.json` | **131 tracked: active 0, dormant 5, dead 116, infrastructure 10**, 7-day window, generated 2026-08-28T18:27:54Z | not reported | "99 skills, ~20 dormant" | — | **new and severe**: the system's own health register says **zero active skills** in 7 days |
| `skill-cluster-registry.json` | **20 clusters** | — | "18-cluster auto-trigger registry" | — | **disagrees**, +2 |
| npm `mdmax` | **404** [fetched] | 404 | — | — | agree |
| npm `frontmatter` | **200 — name is taken** [fetched] | not reported | — | — | new; F3 naming risk is worse than g2 states |
| `gray-matter` weekly downloads | **8,989,723** (2026-08-21→27) [fetched] | — | — | — | new: the frontmatter-parsing niche is 9M/wk |

---

### 2. `~/.sgnk/bin/` — all 147 executables, grouped into 14 families

Lift: **S** ≤1wk · **M** 2–6wk · **L** ≥1 quarter. Class: **D2C** / **B2B** / **BOTH** / **INT** (internal-only).

| # | Family (n) | Every tool | What the family does [measured: header/docstring reads] | Class | Lift |
|---|---|---|---|---|---|
| F1 | Routing & bandit (13) | `routing-bandit-decide.sh` `routing-bandit-update.sh` `routing-journal-append.sh` `routing-promote.sh` `routing-promotion-check.py` `routing-shadow-gate.sh` `sgnk-route-model.sh` `sgnk-bandit-rebuild.py` `escalation-ladder.sh` `haiku-lane.sh` `linucb-policy.py` `thompson-propensity.py` `arm-report.py` | Beta-Bernoulli arms per (skill×tier); 2-D tier×effort ladder; shadow-first wrapper; `arm-report.py` is "the only sanctioned way to quote a bandit arm" | **INT** for the learner; **BOTH** for the static ladder | M |
| F2 | Complexity gate (7) | `complexity-verdict.py` `sgnk-complexity-hook.sh` `corpus-adjudicate.py` `gate-recall.py` `ask-gate.py` `sgnk-granularity.py` `verdict-shadow-log.sh` | 5-D structured verdict per prompt (`tier/orchestrate/rule2_gated/needs_verify/decided_model`); `ask-gate.py` is a deterministic clarification gate | **BOTH** (COGS) + **D2C** dial | M |
| F3 | Test-time compute (9) | `bon-budget.sh` `bon-select.sh` `bon-reflexion-step.sh` `cascade-lint.sh` `block-budget-probe.py` `frontier.py` `vote-k.py` `verify-ladder.sh` `verifier-gaming-audit.py` | Difficulty-adaptive best-of-N, cheapest-first verifier ladder, self-consistency vote, anti-gaming audit | `verify-ladder` **BOTH**; rest **INT** | M |
| F4 | Assertion producers (8) | `sgnk-bash-assert.sh` `sgnk-assert-emit.sh` `sgnk-assert-rescore.py` `acceptance-verdict.sh` `sgnk-record-result.sh` `sgnk-stop-verify.sh` `constraint-verify.sh` `constraint-program-lint.sh` | Wrap any command, log pass/fail; composite-veto acceptance verdict; rescore rows written under superseded rules | **BOTH** — this is document CI | S |
| F5 | Anti-false-green (8) | `false-green-scan.sh` `silent-corruption-check.py` `sgnk-regression-gate.sh` `key-contract-check.py` `negative-controls.py` `goodhart-canary.py` `sgnk-hack-monitor.py` `stale-gold-check.sh` | Hunt "reported success for work it did not do"; **40 registered gates, each with `proven_nonvacuous`** [measured, `regression-gates.jsonl` keys `id/desc/assert/broke/registered/proven_nonvacuous`] | **BOTH** (flagship) | S |
| F6 | Evals & statistics (16) | `kappa-bootstrap.py` `abtest-stats.py` `xmr-limits.py` `holdout.py` `poll-aggregate.py` `codex-judge.py` `patch-judge.py` `scorecard.py` `shadow-score.py` `ope-estimate.py` `label-budget-split.py` `incident-to-eval.py` `regression-synth.py` `sgnk-session-evals.sh` `sgnk-fixture-audit.sh` `sgnk-survival-validate.sh` | Cohen's κ + bootstrap CI, Wheeler XmR limits, deterministic 10% holdout on `correlation_id`, panel-of-judges aggregation, incident→quarantined-fixture | `incident-to-eval` + `holdout` **B2B**; judges **INT** | M |
| F7 | Reward mining & preference (10) | `sgnk-reward-mine.sh` `sgnk-reward-gold-nudge.sh` `mark-accepted.sh` `sgnk-pref-capture.sh` `reward-adjudicate.py` `outcome-tally.py` `outcome-taxonomy.py` `sgnk-phi.py` `attrib-shadow.py` `channel-census.py` | `accepted_asis / edited_kept / abandoned` survival mining from git + edit distance; canonical outcome enum; potential-based shaping (offline) | **BOTH** — implicit AI-edit telemetry | M |
| F8 | Trace ledger (11) | `sgnk-trace-append.sh` `sgnk-trace-repair.py` `trajectory-extract.py` `trajectory-reduce.py` `trajectory-coherence.py` `sgnk-step-extract.py` `token-usage.py` `context-stamp.py` `prompt-to-line.py` `sgnk-workflow-harvest.sh` `sgnk-subagent-reconcile.sh` | 31-field `gen_ai.*`-mapped row per task incl. `files_touched`, `files_sha256`; `prompt-to-line.py` is **prompt→line blame** | **BOTH** — provenance | M |
| F9 | Security & guards (15) | `sgnk-bash-guard.sh` `sgnk-mcp-guard.sh` `sgnk-mcp-pin.sh` `sgnk-taint-gate.sh` `sgnk-injection-scan.sh` `sgnk-trifecta-check.sh` `sgnk-secret-scan.sh` `sgnk-shadow-gate.sh` `sgnk-spawn-gate.sh` `sgnk-loop-guard.py` `datamark.py` `observation-mask.py` `memory-provenance-gate.py` `red-team.py` `rule2-render.sh` | **1,707 injection hits logged** (`{ts,session_id,tool,hits,first,patterns}`); datamarking/spotlighting of untrusted ingest; provenance-gated memory injection | invariants **B2B**; interfaces **INT** | M |
| F10 | Session lifecycle (9) | `sgnk-autorecall.sh` `sgnk-capture.sh` `sgnk-precompact.sh` `sgnk-nudge.sh` `sgnk-eod.sh` `sgnk-weekly.sh` `sgnk-week.sh` `sgnk-md-sync-catchup.sh` `sgnk-state-gc.sh` | Snapshot-on-exit, KEY-card surfacing on start, PreCompact preservation, GC with a data-informed horizon | **BOTH** — doc session continuity | M |
| F11 | Health, drift, self-heal (11) | `sgnk-drift-check.sh` `aios-pulse.sh` `aios-verify-state.sh` `sgnk-doctor.sh` `sgnk-self-heal.sh` `sgnk-alert.sh` `sgnk-backup-probe.sh` `loop-audit.sh` `sgnk-config-sentinel.sh` `config-fingerprint.sh` `sgnk-statusline.sh` | Baseline→compare→alert with dedup+severity; **139 self-heal rows**; one hash identifying the config a result came from | drift **BOTH**; pulse/doctor **INT** | S |
| F12 | Skill governance (11) | `skill-health.sh` `skill-fit.py` `skill-retrieve.py` `skill-desc-tune.py` `skill-counterfactual.py` `sgnk-skill-suggest.sh` `sgnk-skill-track.sh` `sgnk-skill-hashes.sh` `sgnk-catalog-count.sh` `registry-export.py` `prompt-lint.py` | Hybrid BM25 retrieval over 124 skills; with/without-skill marginal-utility eval; keeps a catalog's headline count true | **BOTH** — automation marketplace governance | L |
| F13 | Memory & lessons (7) | `lesson-rank.py` `lesson-retrieve.py` `lesson-usefulness.py` `sgnk-casebank.py` `exemplar-repair.py` `mirs.py` `sgnk-verifier-coevolve.py` | k=1 retrieval over Learned Rules; episodic case bank (**retrieval-only, 5 ops rows**); Model-Independent Reasoning State for cross-provider handoff | `mirs.py` **B2B**; rest **INT** | M |
| F14 | Experiment & misc (12) | `prereg.sh` `explore-budget.sh` `sgnk-profile.sh` `sgnk-season1-floor.sh` `acon-tune.sh` `claude-call.sh` `workflow-lint.sh` `tred-dispatch.sh` `sgnk-fault-inject.py` `sgnk-digression-guard.sh` `sgnk-devports` `sgnk-launcher` | Append-only pre-registration (**2 rows**), auto-disarming exploration budget, tool-fault injection, Breunig 4-mode digression guard | `prereg` **B2B**; rest **INT** | M |

**32 of 147 self-declare READ-ONLY / OFFLINE / PROPOSES-ONLY / RETRIEVAL-ONLY** [measured, grep]. That subset is the shippable core — it cannot damage a user's vault by construction.

---

### 3. `~/.sgnk/gates/` — 69 scripts

| Group | n | Shape | Product read | Class | Lift |
|---|---|---|---|---|---|
| `assert-*.sh` | **33** | One invariant each, exit-coded. Named invariants worth stealing verbatim: `assert-write-verified-before-success`, `assert-hooks-fail-open`, `assert-refusal-is-detectable`, `assert-no-split-rows`, `assert-battery-invariant-across-cwd`, `assert-repair-idempotent`, `assert-recorded-result-is-honest`, `assert-proxy-attributability`, `assert-filtered-verifier-still-scored`, `assert-gold-pool-not-starved`, `assert-realn-excludes-seed`, `assert-integrity-detectors-agree`, `assert-probe-distinguishes-unreadable`, `assert-coevolve-quarantines-unprovenanced`, `assert-casebank-verify-confirmed-only`, `assert-credential-bak-not-exposed`, `assert-selfheal-backup-guard`, `assert-selftests-run-under-hook-depth`, `assert-skill-contract`, `assert-skill-descriptions-index`, `assert-scheduled-tools-versioned`, `assert-decision-invariant-across-seeds`, `assert-decision-reaches-trace`, `assert-drift-stamp-parity`, `assert-calibration-has-a-sample`, `assert-granularity-honest`, `assert-phi-refuses-empty-class`, `assert-injection-covers-fetchers`, `assert-no-stale-rule-verdicts`, `assert-eod-tools-executable`, `assert-actuator-can-act`, `assert-tools-smoke`, `assert-hooks-honour-contract` | The **contract vocabulary** for `mdmax cert` gate names | B2B | S |
| `break-*.sh` | **34** | The fail-first twin: deliberately breaks the thing so the assert must go red. This is the mechanism behind `proven_nonvacuous` in `regression-gates.jsonl` | **The single most differentiated shippable idea in the whole inventory** — "every check ships with proof it can fail" | BOTH | S |
| Harness meta | **2** | `parse-under-both-shells.sh` (bash-vs-zsh divergence), `register-pending.sh` | INT | INT | — |

**Anti-recommendation:** do **not** ship the 34 `break-*` scripts as user-runnable. Ship the *property* (a gate is red-listed in the UI until a paired failing fixture has been recorded), not the scripts — a user-triggered "break my document" action is a data-loss vector.

---

### 4. `skills-src/` — 124 SKILL.md across 27 dirs

| Category | n | Contents | Product read | Class | Lift |
|---|---|---|---|---|---|
| `ops-agent` | 25 | snapshot, recall, handover, trace, trace-ledger, preference-log, model-router, drift-watch, calibration, verdict, dashboard, insights, consensus, debate-panel, reflexion-step, shadow-promote, autoresearch, context-compact, agent-context-hygiene, export, week, learn, codex, gstack-upgrade, md-update | continuity + telemetry ship; the 5 multi-agent ones do not | split | M |
| `aios-library` | 14 | docs-as-skills: architecture-contract, build-and-env, change-control, config-and-flags, debugging-playbook, diagnostics, docs-and-writing, failure-archaeology, learning-loop-reference, research-frontier, research-methodology, run-and-operate, validation-and-qa, campaign-the-bend | **"documentation that routes itself"** — a frontmatter key registering a doc's trigger conditions | **BOTH, flagship** | M |
| `plan` | 10 | autoplan, complexity-gate, fable-compiler, feature-list, prompt-contract, reverse-prompt, plan-{ceo,design,devex,eng}-review | reverse-prompt (clarify-first) is D2C-shaped; fable-compiler is not | split | M |
| `knowledge-docs` | 8 | context7-cli, context7-mcp, sgnk-eco, ecosystem-sync, geo, parse, policy, writer | voice/style profile as a vault document | D2C | M |
| `browser` | 7 | benchmark, browse, canary, connect-chrome, open-gstack-browser, pair-agent, setup-browser-cookies | renderer-as-verifier plumbing | INT | — |
| `ops-safety` | 7 | careful, freeze, guard, sgnk-approve, cso-trifecta-check, digression-guard, unfreeze | freeze/unfreeze → **document lock** is directly product-shaped | B2B | S |
| `knowledge-search` | 6 | find-docs, graphify, market-researcher, sgnk-rawl, sgnk-yt, travel-planner | graphify → vault graph | D2C | M |
| `deploy` 5 · `framework-react` 5 · `ops-debug` 4 · `design-build` 4 | 18 | ship, land-and-deploy, setup-deploy, deploy-to-vercel, vercel-cli-with-tokens; react/next/pwa/data engines; health, investigate, office-hours, retro; design-html, sgnk-design, sgnk-pwa-ds, sgnk-zs-docs | publish pipeline + design system | B2B | L |
| `framework-data` 3 · `framework-next` 3 · `design-discovery` 3 · `client` 3 | 12 | supabase×3; nextjs-monorepo, framer-clone, sgnk-next; design-consultation, design-shotgun, sgnk-mobbin; sgnk-amc, client-onboard, proposal | client-workflow skills are the B2B template library | B2B | M |
| `devex` 2 · `design-audit` 2 · `review-audit` 2 · `review-dx` 2 · `review-qa` 2 · `_parked` 2 | 12 | astgrep, auto-review; design-review, web-design-guidelines; cso, cso-skill-audit; devex-review, document-release; qa, qa-only; workflow-artifact-bus, ux-revamp | `document-release` is the closest existing analogue to a publish gate | B2B | M |
| `evaluation` 1 · `content-campaign` 1 · `framework-patterns` 1 · `framework-pwa` 1 · `review-code` 1 | 5 | sgnk-evals, sgnk-campaign, composition-patterns, sgnk-pwa, review | evals is the quality-gate lineage | BOTH | M |
| `_tests` | 0 | empty | — | — | — |

**Frontmatter keys observed across SKILL.md** [SS: i5 §1.1, 7 of 124 read in depth]: `name`, `description` (with `Trigger:` / `NOT for:`), `allowed-tools`, `capabilities`, `disable-model-invocation`, `argument-hint`, `preamble-tier`, `version`. That set is the AI-permission frontmatter schema, ready to lift.

---

### 5. Hooks (28) and state stores — what each proves

- **Hook events with a direct product analogue:** `PreToolUse(Edit|Write)`→shadow-gate = *save-time guard*; `PostToolUse(Bash)`→bash-assert = *post-edit verification*; `Stop`→trace-append = *per-session provenance row*; `PreCompact` = *context-preservation on truncation*; `SessionEnd`→capture = *autosave-as-snapshot*. **5 of 28 map 1:1 to editor lifecycle events.**
- **Hooks that must never ship:** `sgnk-nudge`, `sgnk-reward-gold-nudge`, `sgnk-skill-suggest`, `sgnk-digression-guard`, `sgnk-pref-capture` — 5 of 5 `UserPromptSubmit` hooks are *interruption* hooks. In a writing tool that is the "your writing coach noticed…" pattern the internal record itself rejects.
- **Store health, ranked by fill:** `propensity` 44,279 · `subagent-reconcile` 29,081 · `routing-journal` 26,037 · `complexity-gate-log` 24,669 · `trifecta-decisions` 8,088 · `session-evals-rc` 6,476 · `injection-hits` 1,707 · `assertions` 725 · `trigger-log` 388 · `spawn-log` 255 · `context-features` 193 · `self-heal` 139 · `routing-shadow` 83 · `ledger-chain` 59 · `ledger-attestations` 52 · `regression-gates` 40 · `epochs` 12 · `casebank-ops` 5 · `prereg` 2 · `shadow-log` **1**.
  [derived] The **machine-fed stores all exceed 1,000 rows; every human-fed store is under 250.** That ratio — roughly **176,000 machine rows to 232 preference rows** — is the strongest single design constraint in this inventory.

---

### 6. Ranked top-15: these become features

| # | Feature | One-line pitch | Source | D2C | B2B | Lift |
|---|---|---|---|---|---|---|
| 1 | **Proven-non-vacuous checks** | "Every check on your document has already been proven able to fail — green means verified, not unrun." | 33 assert + 34 break + `regression-gates.jsonl.proven_nonvacuous` | ✓ | ✓✓ | S |
| 2 | **Implicit edit-survival telemetry** | "We never ask you to rate the AI. We watch whether you kept the edit." | F7, `accepted` 7/694 | ✓✓ | ✓ | M |
| 3 | **Byte-attributed AI provenance** | "Point at any paragraph: which model wrote it, when, from which prompt." | F8 `files_sha256` + `prompt-to-line.py` + `ledger-chain` 59 | ✓ | ✓✓ | M |
| 4 | **Document CI** (`npx mdmax cert`, Action) | "Your docs fail the build when they'd render broken for a named consumer." | F4 + gates + `assertions.jsonl` 725 | ✓ | ✓✓ | S |
| 5 | **Automations are just markdown** | "Write an automation the way you write a note: frontmatter says when it fires and what it may touch." | 124 SKILL.md, 8-key schema | ✓✓ | ✓✓ | L |
| 6 | **Staleness / rot watch** | "This doc cites a file that changed 40 commits ago." | F11 drift + 2,382 baselines, zero model calls | ✓✓ | ✓✓ | S |
| 7 | **Safe machine-write zones** | "AI may rewrite between these markers and nowhere else — enforced by the editor, not by asking nicely." | knowledge.md fenced regions + splice writer | ✓✓ | ✓✓ | M |
| 8 | **Session continuity cards** | "Close on your laptop, reopen on your phone, the AI still has the document's working context." | F10 + snapshot card set + PreCompact | ✓✓ | ✓ | M |
| 9 | **Cost dial with an honest story** | "90% of AI work runs on the cheap model; escalation happens only on evidence." | F2, 24,669 gate rows, 90/10 split | ✓ | ✓✓ | M |
| 10 | **Schema profiles** | "Define your team's frontmatter contract once; the editor validates it and the AI reads it." | `knowledge/meta/schema.md`, 14-value enum, typed relations | ✓ | ✓✓ | M |
| 11 | **Provenance chips** | "`[measured]` / `[fetched]` / `[inference]` as a rendered, lintable inline tag." | i5 pattern 12 + research-doc convention | ✓✓ | ✓✓ | S |
| 12 | **Gap report as the product** | "Broken 0, orphans 0, ghosts counted — unresolved links are findings, not noise." | `mdmap/MAP.md`, `coverage 0.247`, `budget 2000` | ✓ | ✓✓ | L |
| 13 | **Incident → permanent test** | "A defect you hit once becomes a check that runs forever." | `incident-to-eval.py` + `regression-synth.py` + `sgnk-regression-gate.sh` | | ✓✓ | S |
| 14 | **Document freeze / lock** | "Freeze a section; AI and collaborators both bounce off it." | `freeze` / `unfreeze` / `guard` skills | ✓ | ✓✓ | S |
| 15 | **Docs that route themselves** | "Register a doc's trigger conditions; it loads into the AI's context exactly when relevant." | `aios-library` 14 docs-as-skills | ✓ | ✓✓ | M |

**Cross-cutting D2C/B2B split:** items 2, 6, 7, 8, 11 carry themselves for a solo writer with zero configuration. Items 1, 4, 10, 12, 13 are worthless below ~3 people (nobody to enforce a contract against) and are the correct paywall line. Item 5 is the only one that is flagship in both markets — and the only **L**.

---

### 7. Internal-only — would be a trust burden if shipped

1. **Learned-Rules ledger / RULE 1–8** (76 entries). "The AI appends rules about you to a file." No consumer demand signal exists anywhere in the record.
2. **The bandit's learning claim** (F1, 13 tools). `shadow-log.jsonl` = **1 row**; `prereg.jsonl` = **2 rows**. Three documented incidents of prematurely calling the loop live. Never market "it learns you."
3. **`skill-health.json` as user-facing UI.** It currently reports **active 0 / dead 116 of 131**. Correct internally (dormant≠dead), catastrophic as a dashboard a customer sees about their own automations.
4. **Multi-agent adversarial machinery** — `sgnk-consensus`, `sgnk-debate-panel`, `sgnk-reflexion-step`, `bon-*` (5), `poll-aggregate`, `codex-judge`, `red-team`, `sgnk-fault-inject`, `_parked/sgnk-workflow-artifact-bus`. Excellent QA aimed at frontmatter's own code; latent complexity aimed at users.
5. **The 5 `UserPromptSubmit` interruption hooks.** Nudge/suggest/guard-on-every-keystroke is the exact ambient-coach pattern banned by the master plan §10.
6. **Approval-queue ergonomics** — `sgnk-bash-guard` exit-2 blocks, `rule2-render.sh`, `sgnk-approve` one-shot hashes, `sgnk-trifecta-check` (8,088 decisions). Ship the *invariant* (all agent writes go through the splice writer), never the interface.
7. **`traces/` as a data store.** 31 fields including `cwd` — absolute paths into client repos. Ship the schema; the store stays on the machine.
8. **`sgnk-insights` as an ambient loop.** `~/.sgnk/insights/` **does not exist** [measured] after 14 months.
9. **`sgnk-fable-compiler` / prompt-contract as visible UX.** Assumes a user who speaks in agent-task contracts.
10. **Any Likert writing score.** Schema-rejected internally; every eval tool here is binary + critique.
11. **`break-*.sh` as a user action** (see §3 anti-recommendation).
12. **`explore-budget.sh` / exploration routing on customer work.** Internally it auto-disarms and is gated OFF for P0/client tasks. Randomly routing a paying user's document to a non-default model to gather counterfactual signal is indefensible.

---

### 8. Anti-recommendations, stated flatly

- **Do not port hook *count* ambition.** 28 hooks on 9 events is right for one expert; the same density in an editor is 28 chances to interrupt a sentence.
- **Do not build anything whose value depends on a user rating something.** Measured three times, unchanged: **7 accepted verdicts in 694 rows**.
- **Do not reuse "110 daily trace files."** The live daily ledger is **63**; 110 counted 46 `.lock` files and a `steps/` subdir. Any deck quoting 110 is quoting lockfiles.
- **Do not quote `skills-src` counts from i4** ("~93/95/99/102"). Live is **124/27**; g2's per-category numbers are each +1 from counting `CATEGORY.md`.
- **Do not claim `frontmatter` as an npm name** — `registry.npmjs.org/frontmatter` returns **200** [fetched]. `mdmax` returns **404** and is free [fetched].
- **Do not ship the bandit, the debate panel, or the Learned-Rules file in v1**, in any wrapper, under any name.

### 9. Absolute paths
`/Users/sagnikmitra/.sgnk/bin/` (149) · `/Users/sagnikmitra/.sgnk/gates/` (69) · `/Users/sagnikmitra/.sgnk/state/` (43,703 entries, 19 JSONL) · `/Users/sagnikmitra/.sgnk/traces/` (63 daily + `steps/`) · `/Users/sagnikmitra/.sgnk/skill-health.json` · `/Users/sagnikmitra/.sgnk/skill-cluster-registry.json` (20 clusters) · `/Users/sagnikmitra/.sgnk/calibration.json` · `/Users/sagnikmitra/.sgnk/PREFERENCE-LOG.jsonl` (232) · `/Users/sagnikmitra/.claude/settings.json` (28 hooks) · `/Users/sagnikmitra/.claude/skills-src/` (124)