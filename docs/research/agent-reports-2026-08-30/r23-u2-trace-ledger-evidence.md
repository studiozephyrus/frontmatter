Reconcile verified (ninth firing, unchanged): `HEAD` `6e390828` / `e73dd08`, 18 pre-existing dirty paths, no writes outside `$TMPDIR/tr/`, no commits.

MEASURED, the ledger's single most product-relevant field — `skill` — is set on 13.5% of work rows and on 8 of the 182 rows that carry a human verdict, so the question "does structured context make AI output better" cannot be answered by this data at any confidence, and the honest finding is that the instrumentation to answer it was never wired to the outcome.

All numbers below come from commands run against `/Users/sagnikmitra/.sgnk/traces/*.jsonl` and the live config during this session. The ledger was being appended to while I read it (`2026-08-30.jsonl` mtime moved 02:09 → 02:15 local; a row landed at `20:45:37Z`), so row counts drift by single digits between my early and late passes. I use the final per-file count of **5,115 non-blank rows across 65 files**, timestamps spanning **2026-06-07 → 2026-08-30, 74 distinct days**.

---

**BROKEN, STALE, OR STRUCTURALLY DEAD — the useful half**

| # | Finding | Evidence | Tag |
|---|---|---|---|
| 1 | **446 rows (8.7%) are not AI work at all.** They are drift-watch diagnostics with `model:null, tokens:null, assertion_pass:false, failure_mode:"drift_detected"`. The set of `model is None` rows and the set of `failure_mode=='drift_detected'` rows are **identical** (446 = 446, set equality True). Any denominator that includes them is wrong. | `python3` set-comparison over all rows | [measured] |
| 2 | **Naively reading `assertion_pass` over all rows gives 27% pass; the true work-row figure is 73.8%.** 194 pass / 709 total vs 194 pass / 263 work rows — the 446 drift rows carry `false` and poison the numerator. This is Learned Rule #59's exact failure class, still live in the data shape. | value counts before/after the drift filter | [derived] |
| 3 | **`ttft_ms` has zero usable values in 4,669 work rows.** The main producer `sgnk-trace-append.sh` line 404 does not emit the field at all; the only writer, `sgnk-digression-guard.sh` line 146, hardcodes `-1`. Of 176 rows carrying the key, 157 are `-1` and 19 are `null`. | field scan + `grep -n ttft` over `~/.sgnk/bin/` | [measured] |
| 4 | **The complexity gate is wired live at κ=0.10 against a bar of 0.7.** `~/.sgnk/evals/complexity-kappa-2026-07-17.json`: `kappa: 0.1`, `ci95: [-0.125, 0.4]`, `n_kappa_pairs: 9`, `verdict: "FAIL — gate is NOT calibrated to Sagnik's judgment"`. It nonetheless runs on every prompt via the `UserPromptSubmit` hook `sgnk-complexity-hook.sh`. Learned Rule #4 forbids exactly this. | file read + `settings.json` hook enumeration | [fetched] |
| 5 | **κ_AB (LLM-vs-LLM) 0.863 and κ_vs_human 0.10 are two different numbers being scored against one bar.** `calibration.json` records `adversarial_after_fix.meets_kappa_bar: true` (κ_AB 0.863) while the same file's top-level `meets_kappa_bar` is `false` and `trust: "plumbing-validated-only"`. The passing number measures two raters agreeing with each other. | `calibration.json` parse | [measured] |
| 6 | **The router has never served a decision.** `decision_mode == "advisory"` in 1,751/1,751 rows that carry it; `decision_real_n == 0` in 1,751/1,751. Advised `sonnet` while actual tier was `opus` in **1,599/1,752 rows (91.3%)**. | value counts on `decision_*` | [measured] |
| 7 | **The shadow-promote ladder has one row, 42 days old.** `~/.sgnk/shadow-log.jsonl` contains a single entry dated `2026-07-19T13:54:11Z`. Learned Rule #38 requires ≥10 shadow tasks before promotion. This loop is documented and **not running**. | `cat shadow-log.jsonl` | [measured] |
| 8 | **The reward miner runs nightly and labels nothing.** Last four runs in `state/reward-mine.log` each report `labeled 0`; the drop reason is `no_files_touched` on 64–121 candidates per run. `files_touched` is non-empty on only **1,239/4,669 rows (26.5%)** — the key is present on 94.0% and empty on 3,152 of them. | log tail + field scan | [measured] |
| 9 | **Human acceptance labelling effectively stopped on 2026-08-17.** Label days in August: 08-02(6), 08-03(2), 08-04(2), 08-05(2), 08-07(3), 08-08(13), 08-09(11), 08-10(1), 08-11(1), 08-14(1), 08-15(1), 08-16(1), 08-17(5), then **nothing until a single label on 08-30**. | per-day counts of non-null `accepted` | [measured] |
| 10 | **A producer/consumer gate asymmetry is leaking ~940 files a day.** `sgnk-nudge.sh` (UserPromptSubmit) writes `<sid>.turn-meta.json` with **no** `SGNK_HOOK_DEPTH` guard; `sgnk-trace-append.sh` **line 2** exits immediately when that variable is set. Result: **15,802 orphaned turn-meta files**, of which **6,588 were created in the last 7 days**, against **1,312 distinct sessions in the entire ledger** — overlap between the two sets is **1**. `~/.sgnk/state/` holds **46,894 files** (24,288 `gate-tier`, 15,802 `turn-meta`, 6,678 `.count`). | `comm` on sorted id lists; `find -newermt` | [measured] |
| 11 | **The ledger's own integrity chain reports tamper on four day-files.** `~/.sgnk/eod.log` carries 64 `LEDGER-TAMPER` lines naming `2026-08-13`, `08-15`, `08-16`, `08-17`. Rows from those days should be treated as unattested. | `grep -c LEDGER-TAMPER` | [measured] |
| 12 | **233 rows (4.6%) are filed under the wrong day.** `2026-07-17.jsonl` holds rows timestamped `2026-06-13`, `06-17`, `06-21`, `06-27`, `06-29`, `07-02`, `07-03`. Any per-file date logic is wrong; group by `timestamp`, never filename. | filename-vs-timestamp comparison | [measured] |
| 13 | **33 of 65 files lack a trailing newline.** I checked whether this loses rows: `jq` streams concatenated objects correctly (`cat *.jsonl \| jq -c . \| wc -l` = 5,115 = per-file truth), so the drift-checker and dashboard are safe. A Python line-reader over `cat` output loses 32 rows (5,083). The dashboard's `T_RAW=$(cat \| wc -l)` reports **5,138**, over-counting blank lines by 23. Small, real, and the reason to state a denominator's derivation every time. | `tail -c1 \| xxd`, three counting methods | [measured] |
| 14 | **`aios-pulse.sh` reports skill attribution as 1,076/5,115 (21.0%); the true work-row figure is 630/4,669 (13.5%).** Its filter does not exclude the 446 `sgnk-drift-watch` rows, which are self-written diagnostics. | ran the dashboard's line verbatim, then the corrected one | [derived] |

Two things that ARE running and should not be called dead. `sgnk-reward-mine.sh` executes nightly (cursor `last_run: 2026-08-30T18:27:42Z`) and the `__unattributed__` arm now carries real posteriors (`opus a=24.1 b=5.9`) — the fix Learned Rule #62 flagged as simulated has landed live. The calibration loop ran **today** (`last_bucket_run: 2026-08-31`) and correctly fired: high-confidence bucket correction rate **0.269 against a 0.20 threshold**, and `state/calibration-alert.flag` exists with mtime `2026-08-31 02:10`. That is a self-improvement loop actually catching itself. Per Learned Rule #51, the 115 skills marked `"dead"` in `skill-health.json` (7-day window, 7 skills invoked, 0 marked active) are **dormant on-demand tools**, not abandoned ones — the window is the artefact, not the skills.

---

**COVERAGE — what fraction of rows can answer what**

Denominator: **4,669 work rows** (5,115 minus 446 drift). "Usable" excludes `null`, `-1`, `"unknown"`, and empty containers.

| Field | Usable | % of work rows | Verdict |
|---|---:|---:|---|
| `model` / `tier` | 4,421 | 94.7% | headline-grade |
| `input_tokens` / `output_tokens` | 4,189 | 89.7% | headline-grade (volume only) |
| `latency_ms` | 4,096 | 87.7% | headline-grade, but see caveat |
| `session_class` | 4,138 | 88.6% | headline-grade |
| `gate_tier` | 2,353 | 50.4% | segment-grade |
| `task_shape` | 2,252 | 48.2% | segment-grade |
| `fresh_input_tokens` / `cache_read_tokens` | 2,337 | 50.1% | segment-grade (only since 2026-07-25) |
| `decision_real_n` | 1,753 | 37.5% | all zeros — no information |
| `files_touched` (non-empty) | 1,239 | 26.5% | blocks the reward miner |
| `skill_context` | 860 | 18.4% | too thin |
| `skill` | 630 | 13.5% | **too thin for the headline question** |
| `reasoning_effort` | 383 | 8.2% | too thin |
| `assertion_pass` | 263 | 5.6% | too thin |
| `accepted` | 182 | **3.9%** | **too thin** |
| `ttft_ms` | 0 | 0.0% | dead field |

Skill attribution restricted to interactive sessions is worse and flat: **48/1,157 = 4.1% in July, 66/1,468 = 4.5% in August**.

---

**ACCEPTANCE**

182 labelled rows, **156 accepted / 26 rejected = 85.7%**, spanning 2026-06-30 → 2026-08-30 across 39 distinct days. Monthly: July 110/131 (84%), August 45/50 (90%).

| Split | n | accepted | rate |
|---|---:|---:|---|
| `claude-opus-4-8` | 70 | 60 | 85.7% |
| `claude-opus-5` | 65 | 54 | 83.1% |
| `claude-opus-4-7` | 32 | 31 | 96.9% |
| `claude-fable-5` | 12 | 10 | 83.3% |
| `claude-sonnet-5` | 2 | 0 | **n<10 — not reportable** |
| tier `opus` | 167 | 145 | 86.8% |
| `session_class=interactive` | 170 | 152 | 89.4% |
| `gate_tier=floor` | 52 | 43 | 82.7% |
| `gate_tier=strong` | 9 | 7 | **n<10 — not reportable** |
| `reasoning_effort=unknown` | 181 | 155 | 85.6% |
| `reasoning_effort=xhigh` | **1** | 1 | **unanswerable** |
| `skill` set (any) | **8** | 5 | **unanswerable** |

The 96.9% for `claude-opus-4-7` on n=32 is the only cross-model gap that looks like signal, and it is confounded with calendar time — that model dominated a specific two-week stretch, not a randomised arm.

---

**FAILURE MODES — the field with the least in it**

`failure_mode` has exactly **one** non-null value in 5,115 rows: `"drift_detected"`, 446 times, written by `sgnk-drift-check.sh` about itself. The taxonomy Learned Rule #36 specifies — `{distraction, confusion, clash, scope-creep}` — is produced by `sgnk-digression-guard.sh` line 146 from an LLM classifier, and `grep` for any of those four strings across all 65 files returns **zero matches**. The digression guard fires on every UserPromptSubmit and has never once written a classified failure.

So the most product-relevant field in the ledger contains no product signal. There is no measured taxonomy of how AI-assisted work fails here. Claiming otherwise would be the exact flattery this audit exists to avoid.

The nearest real failure signal is the machine gate: **263 assertion rows, 194 pass / 69 fail (73.8%)**, all `assertion_source: "machine-gate"`, 152 of them `assertion_rescored: "last-wins-ce9bcf4"`, spanning 2026-07-16 → 2026-08-30, total 716 individual assertions.

---

**COST**

The producer fuses two very differently priced quantities: `sgnk-trace-append.sh` line 145 sets `input_tokens = usage.input_tokens + usage.cache_read_input_tokens`. Its own comment concedes this "supports a VOLUME claim and never a SPEND claim." Fresh and cache-read were split out from 2026-07-25, giving **2,333 priceable rows over 35 days**. `cache_creation_input_tokens` — billed at 1.25× — is captured by `token-usage.py` but **not** by the trace appender, so every figure below is a **lower bound**.

| Quantity | n | median | p90 | p99 | max |
|---|---:|---:|---:|---:|---:|
| `input_tokens` (fused) | 4,189 | 427,405 | 889,757 | 985,600 | 997,411 |
| `cache_read_tokens` | 2,337 | 500,607 | 904,688 | 987,776 | 997,126 |
| `fresh_input_tokens` | 2,337 | **2** | 2 | 2 | 41 |
| `output_tokens` | 4,189 | 12,357 | 80,675 | 201,555 | 438,205 |

Priced at list ($5/$25 opus·fable, $3/$15 sonnet, cache reads at 0.1×):

- **Total: $2,293.52 over 35 days.** Median day **$65.22**, mean $65.53, max $173.01.
- Per turn: median **$0.6849**, p75 $1.3848, p90 $2.3270, p99 $4.6525, max $8.7612.
- **Cost composition: output tokens 75.8% ($1,737.81), cache reads 24.2% ($555.69), fresh input 0.001% ($0.02).**
- On the 61 rows that are both priceable and labelled: 50 accepted (median $1.81, sum $104.53), 11 rejected (median $2.05, sum $27.84) → **$2.65 of spend per accepted unit of work**, n=61.

The 75.8% figure is the one that matters for frontmatter and it is robust across 2,333 rows: **spend is generation, not context.** A 500k-token context read costs a quarter of what a 12k-token answer costs. That inverts the intuition the entire "context pack" thesis rests on — sending more context is cheap; the thing to ration is how much the model writes back.

---

**LATENCY**

`ttft_ms` is dead (0/4,669). `latency_ms` is `now − turn_start_s` from the turn-meta marker; the code comment states it "honestly includes human read time." It is turn wall-clock, **not** model latency.

| `session_class` | n | p25 | median | p75 | p90 | p99 |
|---|---:|---:|---:|---:|---:|---:|
| interactive | 2,623 | 93 s | **245 s** | 545 s | 1,149 s | 3,347 s |
| scheduled | 1,111 | 12 s | **14 s** | 21 s | 160 s | 3,421 s |

The scheduled median of 14 s is the closest thing here to a machine-only latency, because no human is reading. The 17× gap between the two medians is the size of the human-in-the-loop term, and it means the interactive number cannot be quoted as a product latency.

---

**THE BIG ONE: structure versus outcome**

The cleanest available test is `skill_context` set versus unset on the 182 labelled rows.

- set: **71/80 = 88.8%**
- unset: **85/102 = 83.3%**
- Fisher exact two-sided **p = 0.394**

Direction is favourable, magnitude is 5.5 points, and it is indistinguishable from noise. To detect that effect at 80% power you need **621 per arm**; there are 80 and 102. The strict `skill` field gives 5/8 versus 151/174 (p = 0.089) on an n of eight — a number that must not be quoted.

Reasoning effort is worse. 357 `xhigh` rows exist, but **254 of them (71%) come from `session_class=workflow`**, where the Workflow tool sets effort explicitly, and exactly **one** carries a human verdict. Descriptively, xhigh produces median 32,200 output tokens against 12,136 for unknown (2.65×) at median 259 s versus 134 s. That is a cost measurement, not a quality one. Whether it earns the cost is **unanswerable from this ledger**.

The one genuinely interesting relationship runs the wrong way. On the 39 rows carrying both a gate verdict and a human verdict:

| | accepted | rejected | rate |
|---|---:|---:|---|
| `assertion_pass = True` | 19 | 6 | 76% |
| `assertion_pass = False` | **14** | **0** | **100%** |

Every single turn the machine gate failed was accepted by the human. n=14 is small and I will not call it an inversion, but it does say the gate and the human are not measuring the same thing — and the calibration loop independently agrees, reporting a 26.9% correction rate in its own high-confidence bucket.

This is observational data from one operator, non-randomised, with labels assigned after the fact and 96.1% missing. The correct conclusion is that no causal claim about structure and outcome survives it.

---

**PUBLISH / INTERNAL / EXPERIMENT**

**Publishable, with denominators attached.** (a) Cost composition: output tokens are 75.8% of spend across 2,333 measured turns; context is nearly free, generation is not. (b) The `-1`/`null`/`"unknown"` sentinel problem — that a field present in 100% of rows can be usable in 0% of them, demonstrated on `ttft_ms`. (c) The producer/consumer gate asymmetry that silently drops 96% of sessions: this is a general lesson about instrumenting agent harnesses and it is worth a post. (d) Turn wall-clock median 245 s interactive versus 14 s scheduled, labelled as including human time.

**Internal only.** Every acceptance rate (n=182, 3.9% coverage, one rater, not blind). The 85.7% headline especially — it is a self-report about one's own work. All per-model and per-skill splits. The κ=0.10 finding, which is a governance issue rather than a result. The $65/day figure, which is a personal spend number.

**The experiment the ledger suggests but cannot settle.** Randomise `skill_context` at prompt time — coin-flip whether the skill preamble loads — and label every turn in both arms, blind to the assignment. The ledger says you need **621 labelled turns per arm** to detect the 5.5-point effect it hints at; at the observed labelling rate of roughly 3 per active day that is years, so the labelling has to be forced, not opportunistic: a two-key prompt at Stop on a random 1-in-8 sample would reach n=1,242 in about four months. Everything else in the loop — bandit, shadow ladder, reward miner — is starved by the same missing input, so this one fix unblocks all three.

---

**FOR FRONTMATTER — one thing to ship, three cuts recorded**

**Ship: the acceptance keystroke.** At the end of a turn where frontmatter's engine proposed a splice, one keypress records accept/reject against the exact byte range. **Who uses it:** the writer who just accepted or rejected an edit. **How often:** every proposed edit, which for a working session is 10–40 times a day. It is the only feature here that turns the product's own usage into the dataset this audit proved is missing — and it costs one keystroke, not a screen.

**Cut, recorded.** A failure-mode taxonomy UI: the ledger proves the classifier never fires and there is no evidence anyone would read the output. **Cut:** a token/cost dashboard inside the editor — the useful finding (output dominates) is a one-time design constraint on how much the engine writes back, not a number a writer needs daily. **Cut:** per-model quality reporting — n=182 with 96.1% missing labels cannot support it, and shipping it would publish a number the data does not carry.

Frontmatter's AI economics follow directly from the 75.8% figure: the engine should read the whole file freely and be strictly rationed on what it emits. At a median of 12,357 output tokens per turn on opus, the observed **$0.68 median turn** does not fit ₹299/month at any meaningful volume — a ₹299 plan supports roughly five opus-median turns a month at list price. Either the emit path runs on a cheap tier with the splice verifier as the quality gate, or the price is wrong. That is the number the plan currently leaves undefined, and it is the one the ledger can actually settle.
