I did not mutate anything: this task was read-only (ls/find/wc/jq/grep/curl/Read only), no writes, no git commands, no commits — the reported `~/.claude` and `~/.sgnk` dirt is pre-existing and not mine.

### Measurement basis

- All `[measured]` numbers read from live files on this machine on **2026-08-29**, read-only. Counting method stated inline; nothing estimated.
- `[derived]` = arithmetic shown. `[fetched]` = opened over the network. `[inference]` = my reasoning. `[SS]` = search summary nobody opened — **used zero times here.**
- Tool note: `curl` works. `curl -sL --compressed registry.npmjs.org/mdmax` → **HTTP 404** (name unregistered, confirms the master plan's collision-clean claim) and `export.arxiv.org/api/query` → **HTTP 200** [fetched].
- `jq '.x // "NONE"'` silently converts `false` → NONE (LR#59 trap). Every boolean below counted with `has()` instead [measured].
- Lift scale: **S** ≤1 wk · **M** 2–4 wk · **L** 1–3 mo · **XL** >3 mo, plus named prerequisite.

### Recorded disagreement (RULE 1 — both sources kept)

| Source | Gate rows | floor / strong | single / workflow | floor AND guarded |
|---|---|---|---|---|
| CLAUDE.md LR#35, dated 2026-07-28 | 2,064 | 90% / 10% | 96% / 4% | 29% (602/2064) |
| `FRONTMATTER-MASTER-PLAN` §4 L2 `[live-verified]` | 23,778 | 90% floor | — | — |
| My count, `complexity-gate-log.jsonl`, 2026-08-29 | **24,669** | **95.1194% / 4.8806%** (23,465 / 1,204) | **99.1163% / 0.8837%** (24,451 / 218) | **38.068%** (9,391/24,669) |

These **disagree**. The 891-row delta vs the master plan is one extra logging day; the 90%→95.12% floor shift and 29%→38.07% guarded shift are **not** explained by that [derived]. Do not quote "90% floor" in marketing until re-derived.

---

### 1. Trace ledger

| | |
|---|---|
| **Internals** | 63 daily JSONL files, **5,018 rows** total; 30 keys/row incl. `correlation_id`, `files_touched`, `files_sha256`, `input/output/cache_read_tokens`, `latency_ms`, `accepted`, `assertion_pass` [measured]. |
| **Live health** | `accepted` non-null on **181/5,018 = 3.607%** [derived]. `skill:"unknown"` on **3,946/5,018 = 78.637%** [derived]. Ledger covers **5,018/24,669 = 20.341%** of gate decisions [derived] — the ledger is the thinnest layer of the stack. |
| **User problem** | "Which paragraphs did the AI write, when, from what prompt, and did I keep them?" No editor answers this. |
| **Surface** | Per-document `.frontmatter/trace.jsonl` sidecar + a **"Show AI ink"** toggle rendering byte-ranged authorship to any reader; hover chip = `{contributor, model, promptDigest, sessionRef, kept/reverted}`. |
| **D2C** | Provenance you can show an editor, a professor, or a client. Ships the master plan's §4 L2 byte-anchored provenance with real data behind it. |
| **B2B** | The audit artifact. `files_sha256` before/after per agent edit is the evidence a compliance reviewer actually accepts; exportable as the review record. |
| **Lift** | **M**. Prereq: splice writer (already shipped per memory `f47555f…9e84628`). |
| **Verdict** | **SHIP.** The one loop whose output is intrinsically user-facing rather than a self-assessment. |

### 2. Eval + calibration

| | |
|---|---|
| **Internals** | `calibration.json` updated 2026-08-28T20:10:09Z; buckets **low n=14 correction_rate 0.0 · mid n=0 · high n=26 correction_rate 0.269**; thresholds high 0.85 / mid 0.55; `judge_health: OK` [measured]. 23 per-skill eval dirs, 96 calibration-run files, `session-evals-rc.jsonl` 6,476 rows with rc=0 on **6,429 = 99.2743%** [derived]. |
| **Honesty flag** | LR#33 fires CALIBRATION_DRIFT when the top bucket corrects >20%; measured **0.269 > 0.20** [derived] — tripped. `alert-state.json` is `{}` and `calibration-alert.flag` is 0 bytes [measured]; fired-and-cleared is indistinguishable from never-fired from files alone [inference]. |
| **The gold problem** | `sgnk-complexity-gate` eval: n=20, kappa 1.0, `gold_status: "synthetic-unverified"`, `meets_kappa_bar: false`, self-labelled **"IN-DISTRIBUTION / TAUTOLOGICAL"** [measured]. Adversarial re-run: n=16, kappa_AB **0.863**, meets bar true [measured]. |
| **User problem** | "Is this document good enough to send?" — asked constantly, answered by nobody. |
| **Surface** | **Document quality GATES, never a score** (master plan §4 L4 already says this). A pre-publish checklist: every unresolved suggestion adjudicated · every `verified.until` in date · zero broken anchors · every `[claim]` carries a source. Pass/fail with the failing lines linked. |
| **D2C** | "Ready to publish" is a checklist you can read, not a number you must trust. |
| **B2B** | Document CI: the same gate runs in GitHub Actions, blocks merge, prints the failing checks — the sellable `$29–99/repo/mo` motion named in master plan §11. |
| **Lift** | **M** for the gate; **XL** and unwise for any judged score. |
| **Verdict** | **SHIP the gate. DO NOT SHIP the judge score.** A kappa of 1.0 that the file itself calls tautological cannot back a user-visible quality number. |

### 3. Preference log

| | |
|---|---|
| **Internals** | 232 rows, 2026-06-28T00:55:26Z → 2026-08-26T02:54:15Z [measured]. **188 accepted / 44 rejected = 81.034% / 18.966%** [derived]. Source: 131 machine · 83 human · 2 bon-demo · 16 absent [measured]. Skill attribution: 182 `"unknown"` + 41 null = **223/232 = 96.121% unattributed** [derived]. |
| **Known-bad label** | `epochs.jsonl` records the measured label quality over 85 machine rows: **precision[accepted] = 70/77 = 0.909, precision[rejected] = 0/8 = 0.000** — "every rejection this system has ever emitted was wrong"; the rejection branch now abstains by default [measured, verbatim from the epoch entry]. |
| **User problem** | The editor never learns which AI edits you keep, so it re-offers the same rejected shape forever. |
| **Surface** | Local-only `accept / reject / partial / edit-distance-after-accept` per AI surface, exposed as an **editable "What I've learned about your edits" panel** with per-row delete and one-click export. Never silent. |
| **D2C** | Ghost-text and inline-edit suggestions stop repeating rejected patterns; a visible off switch. |
| **B2B** | Per-workspace signal on which AI surfaces are worth their seat cost; feeds the vendor's roadmap, not the customer's dashboard. |
| **Lift** | **S** to log, **M** for the panel. |
| **Verdict** | **SHIP the logging (local-first, visible, deletable). DO NOT SHIP any inference drawn from it** until a human-gold precision exists — this system's own measurement puts the negative class at precision 0.000. |

### 4. Drift watch

| | |
|---|---|
| **Internals** | **2,381 baseline files** in `~/.sgnk/baselines/` [measured]. Newest (`20260828T194528Z_auto-other_9704.json`): `avg_routing_confidence 0.5884 · skill_hit_rate 0.0433 · eval_pass_rate 0.6974 · user_correction_frequency 0.1728`, window 30d, samples 3,979 / 1,409 / 76 / 191 [measured]. LR#37 alert bar: >15% drift at SessionStart. |
| **Contradiction** | `skill-health.json` (2026-08-28, 7-day window): total 131, **active 0**, dormant 5, dead 116, infrastructure 10 [measured] — while the trace ledger carries **446 rows with `skill:"sgnk-drift-watch"`** in the same period [measured]. The health metric and the ledger disagree about whether anything ran [derived]. |
| **User problem** | Documents rot silently: dead links, stale `verified:` dates, a spec that no longer matches the code it describes. |
| **Surface** | **Doc Health** four-surface diagnostic (master plan §4 L0): status count → panel → inline mark → F8 cycling, over **deterministic** checks only — broken link, broken anchor, duplicate heading, `verified.until` expired, unreviewed AI edit, file newer than the doc that cites it. |
| **D2C** | The vault tells you what decayed while you were away, per file, with a fix action. |
| **B2B** | Docs-team SLA: "0 stale pages in `/policies`" as a CI gate. This is the ticket-deflection wedge in `c3` expressed as a check. |
| **Lift** | **M**. Prereq: link graph + `verified:` key schema. |
| **Verdict** | **SHIP the deterministic checks. DO NOT SHIP an aggregate "vault health score"** — a scalar over 2,381 baselines that your own two ledgers disagree about is unfalsifiable in the user's hands. |

### 5. Digression guard

| | |
|---|---|
| **Internals** | `~/.sgnk/bin/sgnk-digression-guard.sh` — UserPromptSubmit hook, fires **only** when `~/.sgnk/state/<session>.contract.json` exists; detached background `claude -p` on Sonnet; recursion-guarded; fail-open; refocus surfaces on turn N+1 [measured, read header]. |
| **Live state** | **0 `*.contract.json` files** in `state/` and **0 trace rows containing "digression"** across all 63 trace files [measured]. In the retained record **this loop has never fired.** |
| **User problem** | Real in writing: a draft drifts from its own brief, and nothing notices. |
| **Surface** | A **`brief:` frontmatter key the user writes themselves** (goal + done-condition), rendered as a pinned card; a manual "does this still match the brief?" action. |
| **D2C** | Optional, user-authored, zero background inference. |
| **B2B** | Template compliance: "this SOW must contain sections 1–7" as a deterministic structural check. |
| **Lift** | **S** for the deterministic form; **L** and inadvisable for the model-judged form. |
| **Verdict** | **STAY INTERNAL.** An unfired loop cannot be productized honestly, and a background model call that judges a user's prose against a goal it inferred is both a cost line and a paternalism problem. |

### 6. Complexity / triage gate

| | |
|---|---|
| **Internals** | 24,669 rows, 2026-07-17T21:01:09Z → 2026-08-28T20:20:22Z = 42 days = **587.357 rows/day** [derived]. Distribution in the disagreement table above. `rule2_gated:true` on **10,191 = 41.311%**; `needs_verify` 244 = 0.9891%; `needs_clarification` 24 = 0.0973% [derived]. Sidecars: 21,679 `.gate-tier.json` + 15,758 `.turn-meta.json` + 6,144 `.count` = **43,581 of 43,703 files** in `state/` [derived]. |
| **User problem** | AI features either cost too much or feel dumb, and the user never knows which model ran. |
| **Surface** | The **visible AI meter** already specified in master plan §11 — dollars, not credits — plus a per-action line: *"answered on the small model · 0.4¢ · [redo on the large model]"*. |
| **D2C** | This is the mechanic that makes ₹299/$4–8 with bundled inference survive (`c4` §2). 95.1194% floor-tier is the COGS story, stated as a user benefit rather than a boast. |
| **B2B** | Per-workspace spend caps and a model-tier policy (`never send this folder to a hosted model`) — the procurement conversation. |
| **Lift** | **S** for the meter, **M** for policy enforcement. |
| **Verdict** | **SHIP as a cost meter with a manual override. DO NOT SHIP the tier label as a judgment** ("we decided your request was simple") — it invites an argument the product cannot win. |

### 7. Bandit routing + escalation ladder

| | |
|---|---|
| **Internals** | `routing-journal.jsonl` **26,037 rows** [measured]. `routing-bandit.json`: 10 arms; **3 of them** (`sgnk-amc`, `sgnk-proposal`, `sgnk-supabase-migration`) carry `"seeded": "offline-0.5x"` — synthetic, not live evidence [measured]. Largest arm is **`__unattributed__` opus a=24.1 b=5.9 → posterior mean 0.80333** [derived]. Ladder is deterministic, 7 rungs: `sonnet/medium → sonnet/high → opus/medium → opus/high → opus/xhigh → opus/max → fable/high` [measured, read script]. |
| **User problem** | "The AI got this wrong — try harder" has no button. |
| **Surface** | A literal **"Try harder"** action on any AI result: one rung up the ladder, cost delta shown before it runs, the two outputs diffed side by side. |
| **D2C** | Escalation as an explicit user act. No claim about learning. |
| **B2B** | Escalation policy per document class ("contracts always start two rungs up"). |
| **Lift** | **S** for the ladder button; **XL** for anything bandit-learned. |
| **Verdict** | **SHIP the ladder. DO NOT SHIP the bandit.** The biggest arm is literally named `__unattributed__` and 3/10 arms are offline seeds — "we learn which model is best for you" is unsupportable. |

### 8. Shadow-promote ladder

| | |
|---|---|
| **Internals** | `routing-shadow.jsonl` **83 rows**; `shadow-log.jsonl` **1 row** dated 2026-07-19T13:54:11Z [measured]. Newest shadow row (2026-08-28T19:24:10Z): `real_n: 0`, `served: "unchanged"`, `tier_override_applied: false`, `policy: "explore"`, `propensity 0.8704 (thompson)` [measured]. LR#38 requires ≥10 shadow tasks, then 20 held at pass ≥0.8. |
| **User problem** | A prompt/template change silently degrades every future document made from it. |
| **Surface** | **Template & rules versioning**: `.frontmatter/rules/*.md` and templates get `version:` + a **"preview against your last 10 documents"** action that renders the diff before the change goes live. |
| **D2C** | Editing your own AI rules stops being a leap of faith. |
| **B2B** | Governance: a workspace prompt/template change is a PR with a rendered impact preview. Directly the `c3` compliance story. |
| **Lift** | **M**. Prereq: deterministic render (mdmap invariant 7, byte-identical output). |
| **Verdict** | **SHIP as versioned templates with preview. DO NOT SHIP the auto-promote threshold** — 83 shadow rows and 1 promotion event over 40 days is not enough evidence to hand an automatic decision to. |

### 9. Regression gates

| | |
|---|---|
| **Internals** | `regression-gates.jsonl` **40 rows**, all `proven_nonvacuous: true` [measured], registered 2026-07-29T01:46:59Z → 2026-08-13T01:41:14Z — **16 days since the last registration** [derived]. 69 `*.sh` files in `~/.sgnk/gates/` [measured]. Row schema `{id, desc, assert, broke, registered, proven_nonvacuous}` — **`broke` is a command that must make the gate FAIL**, i.e. LR#68 mechanized: a test that cannot fail is not registered. |
| **User problem** | "We fixed that" is a claim nobody can check next quarter. |
| **Surface** | **Append-only decision/incident blocks** (master plan §4 L3) where each entry carries an executable or checkable `broke:` field, plus a **"this check has never failed — unproven"** badge on any check with no falsification proof. |
| **D2C** | Marginal. Most individuals will not author gates. |
| **B2B** | High. Runbooks, SOPs, incident postmortems where "we added a check" must be provable. The `broke:` field is a genuinely novel document primitive — **no competing editor has it** [inference from `ed1–ed5`, `i5`]. |
| **Lift** | **M** for the block type; **L** for executable gates in CI. |
| **Verdict** | **SHIP, B2B-first.** Highest-differentiation / lowest-risk loop in the set: it is a discipline expressed as a file, not a claim about the software. |

### 10. Snapshot / recall continuity

| | |
|---|---|
| **Internals** | `GLOBAL-REGISTRY.md`: 59 lines = 1 header + **58 repo rows**, tab-delimited `path → snapshot-id → utc → actor` [measured]. Snapshot dir = numbered cards `00-KEY.md … 06-conversation.md` + `manifest.json` sidecar + `LATEST` pointer; IDs `YYYYMMDDTHHMMSSZ_<kind>_<label>_<4hex>` [measured via `i5`, itself `[measured]`]. `eod.log` 446,525 bytes [measured]. |
| **User problem** | Every AI chat that produced real thinking dies in a scrollback nobody can retrieve. This is the **T4 capture funnel** in the roadmap. |
| **Surface** | **Sessions as documents**: version-by-new-file with a `LATEST` pointer, `kind:` lifecycle key in frontmatter, machine manifest beside the human narrative, and the **verification report** on import (reconciliation table counted from the OUTPUT filesystem — count parity is provably insufficient). |
| **D2C** | The ChatGPT/Claude ZIP importer where the verification report *is* the demo. Strongest acquisition surface in the whole stack. |
| **B2B** | Handoff/continuity across contractors and agents; the only shipped multi-vendor session-continuity semantics anywhere (`aj1`). |
| **Lift** | **L**. Prereq: importer + verification report (already spec'd, seven panels). |
| **Verdict** | **SHIP.** Caveat below on secrets. |

### 11. Memory hygiene

| | |
|---|---|
| **Internals** | 11 weekly `rules-hygiene-*.md` reports, 2026-07-02 → 2026-08-24 [measured]. Latest parsed **69 rules**; live `CLAUDE.md` holds **74** (892 lines; LR#74 appended 2026-08-29) → the report is **5 rules stale** [derived]. Latest findings: **0** near-duplicates (Jaccard ≥0.6), **0** opposing directives, **69/69 zero-citation** rules [measured]. `auto-memories.jsonl` 22 rows [measured]. Report-only — the file is never auto-edited (RULE 8). |
| **User problem** | AI "memory" accumulates invisibly, contradicts itself, and cannot be audited or pruned. |
| **Surface** | **Memory as an ordinary markdown file** the user opens and edits, plus an **auto-generated index page** (`MEMORY.md` shape: link + one-line description per row) and a hygiene report showing duplicate/contradictory/never-used entries — **as a review prompt, never an auto-prune** (LR#51: dormant ≠ dead). |
| **D2C** | The honest answer to "what does it remember about me": a file, in your repo, that you can delete. |
| **B2B** | Data-residency and right-to-deletion satisfied structurally — the memory *is* the customer's file in the customer's git remote. |
| **Lift** | **S** for file + index; **M** for the hygiene pass. |
| **Verdict** | **SHIP.** Cheapest credibility win available, and it converts a privacy liability into a feature. |

### 12. Red-proof discipline

| | |
|---|---|
| **Internals** | `assertions.jsonl` 725 rows: **386 true / 339 false = 53.2414% pass** [derived]. Kinds: test:py 393 · build:js 201 · test:js 75 · typecheck:ts 26 · lint:js 16 · typecheck:py 8 · lint:py 6 [measured]. `verdict_source`: output 393 / null 332 [measured]. `bash-guard-hits.log` 37,768 B, `bash-guard-catastrophic-hits.log` 6,545 B [measured]. `injection-hits.jsonl` 1,707 rows — Bash 1,667 · WebFetch 34 · WebSearch 6 [measured]. |
| **User problem** | Green checkmarks that mean nothing. LR#65: a harness that reports false REDs trains you to ignore it — the same disease as false greens. |
| **Surface** | **Provenance chips + evidence-tier fields** as document format: `{value, source, tier, re_verify_cmd}`, rendered inline as `[measured]` / `[fetched]` / `[unverified]` / `[SIMULATED]` chips, with a linter that flags a number carrying no source. |
| **D2C** | Research, journalism, dissertations: the citation layer nobody has. |
| **B2B** | Regulated writing (finance, legal, clinical) where a number must carry a re-verification command. The `[SIMULATED]` chip is LR#62 made syntactic. |
| **Lift** | **M** for chips + linter; **L** for `re_verify_cmd` execution. |
| **Verdict** | **SHIP.** Master plan §4 L3 already flags it: no competing editor has an evidence layer. |

---

### Dangerous to ship — and the honest version of each

| Loop | The danger | Honest version |
|---|---|---|
| **Bandit routing** | **Over-claiming.** "It learns which model suits you." Largest arm is `__unattributed__` (a=24.1/b=5.9, mean 0.80333 [derived]); 3/10 arms are `offline-0.5x` seeds; 96.121% of preference rows carry no skill [derived]. The claim has no attributable evidence behind it. | A **manual escalation button** on a deterministic 7-rung ladder, with the cost delta shown before the run. Zero learning claim. |
| **Eval judge score** | **Unfalsifiable.** kappa 1.0 on gold the file itself calls `"synthetic-unverified"` and `"TAUTOLOGICAL"` [measured], `meets_kappa_bar: false`. A number the user cannot dispute. | **Binary gates with linked failing lines.** LR#4: binary pass/fail + critique, never Likert. If a judge is used, its precision/recall/kappa ship with every verdict (LR#5). |
| **Preference / implicit telemetry** | **Creepy + wrong.** Silent per-keystroke accept/reject with prompt hashes; and the system's own measurement puts precision[rejected] at **0/8 = 0.000** [measured]. Acting on a 100%-noise negative signal is worse than acting on nothing. | **Local-first, visible, deletable, exportable.** Positive signal only until a human-gold precision at n≥20 exists. Global AI kill switch, loudly marketed. |
| **Digression guard** | **Paternalistic + unfired.** A background model call judging whether your writing has drifted from a goal it inferred. **0 contracts, 0 trace rows** — never ran here [measured]. | A **`brief:` key the user writes**, checked on request, deterministic structure only. |
| **Trifecta / injection detector** | **Unfalsifiable.** `trifecta-decisions.jsonl` 8,088 rows, `E=true P=true U=true` on **8,088/8,088 = 100%** [derived]. A detector that has never once said "no" cannot back a security badge. | Ship **injection hits as a counted log** (1,707 rows: Bash 1,667 · WebFetch 34 · WebSearch 6 [measured]) with a per-hit reason. Never a green "you are safe" shield. |
| **Drift watch score** | **Unfalsifiable aggregate.** `skill-health` reports **active 0 / 131** [measured] while 446 trace rows show that same window's activity [measured]. Two internal ledgers disagree; a user-facing scalar hides the disagreement. | **Named deterministic checks**, each independently clickable, each with a fix action. No composite. |
| **Complexity tier label** | **Over-claiming, argument-inviting.** And the published number is already wrong: 90% floor (LR#35, master plan) vs **95.1194%** measured [derived]. | A **cost meter in currency** plus manual override. Never surface the tier word. |
| **Snapshot / recall content** | **Secret leakage.** LR#46 and LR#71 are in direct conflict: retain-and-index vs rotate-and-erase. Transcripts and vault imports carry pasted credentials. | **Redact at write time in the collector**, gate redaction on the token actually looking secret (a digit + ≥7 chars) so prose like "password login flow" survives; rotation-first if one lands. Name the exception in the retain policy. |
| **Regression gates** | Mild: a gate that has never failed reads as proof. | Ship the **`proven_nonvacuous` badge** itself — an unproven check is displayed as unproven. 40/40 rows carry it here [measured]; 16 days since the last registration [derived], so also surface staleness. |

### Consolidated anti-recommendations

- **Do not ship any composite health/quality score** — drift score, vault health, document grade, routing confidence. Every scalar in this stack is contradicted by at least one other ledger in the same stack.
- **Do not ship the bandit, the auto-promote threshold, or the judge score.** Three loops, one reason: insufficient attributable evidence (96.121% unattributed preference rows, 83 shadow rows, synthetic gold).
- **Do not ship a security badge or "safe" indicator** off a detector with a 100% fire rate.
- **Do not market "self-improving."** LR#32 forbids it unless an eval loop is running *and feeding routing*; here the top calibration bucket corrects at 0.269 against a 0.20 bar [derived] and the alert state is empty.
- **Do not re-quote "90% floor" / "23,778 decisions."** Re-derive at write time (LR#60); the live count is 24,669 / 95.1194%.
- **Do not auto-prune anything** — memories, rules, dormant templates (LR#51).
- **Do not run a background model call on the user's prose without an explicit, user-authored trigger.**
- **Ship order, by evidence quality:** memory hygiene (S) → complexity-gate cost meter (S) → escalation button (S) → trace-ledger provenance (M) → red-proof chips (M) → doc-health deterministic checks (M) → regression-gate blocks, B2B (M) → template versioning with preview (M) → snapshot/recall importer (L).