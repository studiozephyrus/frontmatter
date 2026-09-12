Reconcile verified; result unchanged on every check: zero writes, zero commits, `~/.claude` HEAD `6e390828` and `~/.sgnk` HEAD `e73dd08` unmoved, and the 19+1 dirty paths pre-date this session as part of the 44 / 1,473 uncommitted totals reported below.

---

The instrumentation is alive and the learning is not: in the last seven days the complexity gate made **6,884 routing decisions** and exactly **one** of them came back carrying a reward label — a 0.01% closure rate — which means every claim that AIOS "learns from its own traces" is currently false at the arithmetic level, not the architectural one.

---

**How this was measured.** Every number below comes from a command run against the live installation on 2026-08-31 between 02:07 and 02:15 IST. Nothing was written. Six gate scripts were executed after reading them for write operations first.

---

### Subsystem verdicts

| Subsystem | What it claims | What is measurably true | Verdict |
|---|---|---|---|
| **Hooks** | 27 hooks, 8 events | 28 hooks / 8 events [measured: `jq '[.hooks[][] .hooks[]] \| length'`]; 26 distinct scripts, **all present**, 25 executable, 1 (`sgnk-reward-gold-nudge.sh`) not — harmless, invoked as `bash <path>`. `graphify` resolves to `/opt/homebrew/bin/graphify`. No LR#49 orphan. | **LIVE** |
| **Trace ledger** | one row per task, OTel-mapped | 65 day-files, 5,136 rows, last written 2026-08-30 20:29 UTC. But **78.6% carry `skill: "unknown"`** (4,037/5,136) and **96.0% carry `accepted: null`** (4,931/5,136). | **PARTIAL** |
| **Complexity gate** | triage before every call | 27,391 rows, appended during this audit. Live shape **95.8% floor / 4.3% strong**, **99.8% single / 0.2% workflow** (last 2,000 rows). CLAUDE.md LR#35 documents 90/10 and 96/4 — the floor number has drifted. | **LIVE** |
| **Reward mining** | nightly, feeds the bandit | 107 LIVE runs; **20 produced any label, 87 produced zero**. Last productive run **2026-08-18** — 13 days ago. Drop reason on every recent run: `no_files_touched` (121, 64, 92). | **DORMANT** |
| **Bandit / routing** | Thompson posteriors updated from rewards | `routing-bandit.json` mtime **2026-08-20 23:58** — 10 days frozen. Its largest arm is `__unattributed__` (opus α=24.1, β=5.9): the dominant learned arm is *the absence of attribution*. 21 scripts read it. | **PARTIAL** |
| **Eval loop** | `sgnk-evals`, kappa ≥ 0.7 | 31 entries, 252 files. Last real run **2026-08-03** (`run-2026-08-03.jsonl` × 5 skills) — 28 days. `state/eval-due.flag` pending since **2026-08-24**, unactioned. | **DORMANT** |
| **Calibration** | bucket → correction rate, alert >20% | `calibration.json` written **02:07 today**; 102 run-files. Global buckets carry real data: low n=14 (0.0), high **n=26, correction rate 0.269**. Per-skill: **all three skills report low=0 mid=0 high=0**. | **PARTIAL** |
| **Preference log** | accept/reject pairs | `PREFERENCE-LOG.jsonl`, 241 rows, last 2026-08-30T20:16Z, mode 0600. Keys include `correction_text`, `label`, `orphan` — but **no `accepted` field**; 239/241 rows carry no verdict key. | **PARTIAL** |
| **Drift watch** | baseline + >15% alert at SessionStart | 2,470 baselines, newest **02:12 today**. Fires every session; `sgnk-drift-watch` is the single most-traced skill name (446 of 5,136 rows). | **LIVE** |
| **Digression guard** | tag + one refocus line | Hook present, wired to UserPromptSubmit. **No output file anywhere under `~/.sgnk`** — `find -name '*digress*' -type f` returns only the script and one 2026-06-30 backup. Unfalsifiable. | **DORMANT** |
| **Shadow → promote** | offline → shadow ≥10 → auto-promote | `routing-shadow.jsonl` 90 lines, written today. `shadow-log.jsonl` holds **one row, dated 2026-07-19** — 43 days. **Nothing has ever been promoted.** | **DORMANT** |
| **Regression gates** | 69 assertions | 33 `assert-*`, 34 `break-*`, 2 helpers. **40 registered** in `regression-gates.jsonl`; registry last grew **2026-08-13**. Run nightly by `sgnk-eod.sh` (launchd `ai.sgnk.eod`, 23:55). | **LIVE** |
| **Nightly EOD** | the only scheduler | `ai.sgnk.eod` at 23:55 is the **only** AIOS launchd job; the other 14 sgnk plists are `tred` (trading) and `devports`. Last run 2026-08-30 23:57. | **LIVE** |
| **Skills** | 131 installed | 131 installed (123 symlinks into `skills-src`), 124 authored SKILL.md across 27 categories. **101 have never appeared in the trace ledger in 65 days.** | **PARTIAL** |
| **`sgnk-insights`** | periodic global rollup (RULE 8) | `insights-last-run.json` = `{"started_at":"2026-08-03T07:23:34Z","finished_at":null,"status":"running"}`. **Stuck "running" for 28 days.** No liveness check caught it. | **DEAD** |
| **Weekly review** | reviews dir | `2026-08-24-week.md` written 08:00, `.surfaced` marker 09:15. Cadence held. | **LIVE** |

---

### The broken half, in order of cost

**1. The outcome layer captures 1 in 19 decisions, and 1 in 6,884 rewards.**

```
gate rows since 2026-08-24 : 6884   [jq over complexity-gate-log.jsonl]
trace rows, same window    :  362   [wc -l over 2026-08-2[4-9]+30.jsonl]
of those, accepted != null :    1
```
[derived] 362/6884 = 5.3%; 1/6884 = 0.01%. In that same window only 108 of 364 rows carried a real skill name and 69 carried `assertion_pass`.

This is one causal chain, not five problems. No attribution → `reward-mine` finds nothing to label (87 of its last 107 runs labeled zero) → the bandit gets no posterior updates → `routing-bandit.json` freezes → per-skill calibration reports n=0 across all three skills, exactly as its own `bucket_basis` field admits: *"verdict-bearing turns are Skill-less."* The system has diagnosed itself correctly inside its own state file, and the diagnosis has sat there.

By the founder's LR#32, the loop is **not self-improving today**. The evals directory is not empty — it is 28 days stale, which is the same failure with better optics.

**2. The nightly alert has been red long enough to be furniture.**

Last EOD run (2026-08-30 23:57), verbatim from `eod.log`:
```
regression-gates: 38 PASS  1 FAIL  1 n/a
  FAIL  season1-floor-intact — the defect this gate was built for has RETURNED
  VACUOUS integrity-detectors-agree no longer fails under its own repro
full-loop-battery: RESULT: PASS=67 FAIL=3
  FAIL  4 chained trace file(s) drifted with NO attestation — possible tamper
LEDGER-TAMPER: traces/2026-08-13.jsonl … 08-15 … 08-16 … 08-17
```
Four unattested hash drifts, standing since 2026-08-13 — 18 days. This is precisely the disease LR#65 names: *"a harness that reports false FAILures trains you to ignore it."* Whether these four are real tampering or a repair tool that stopped attesting is unknown, and the integrity gate that would tell you has itself gone VACUOUS.

Separately, `state/calibration-alert.flag` was regenerated at **02:10 today**. The global high bucket corrects at **0.269**, above LR#33's 0.20 miscalibration bar. The SessionStart hook prints the alert and `rm`s the flag. It fires, it is cleared, the rubric is unchanged, it fires again. That is a loop, but not a learning one.

**3. Skill health labels 115 skills "dead" in direct violation of the founder's own LR#51.**

`skill-health.json` (generated 2026-08-30T18:27:44Z, 7-day window):
```
total 132 | active 0 | dormant 7 | dead 115 | infrastructure 10
```
The measurement is *correct* — I cross-checked it against the traces independently and the seven names match exactly (`humanizer` 2, `sgnk-handover` 2, `market-researcher`/`sgnk-mobbin`/`sgnk-pwa`/`sgnk-snapshot`/`sgnk-writer` 1 each; the 08-24→08-30 trace files give the same seven). The **label** is what is wrong. `sgnk-proposal`, `sgnk-client-onboard`, `gvc`, `cso`, `sgnk-debate-panel` are on-demand tools that legitimately fire zero times in a quiet week. LR#51 was written after this exact mistake, and the tool that made it was never corrected.

Over the full 65 days: **101 of 131 installed skills have never appeared in the ledger**, including **44 authored `sgnk-*` skills** — among them `sgnk-insights`, `sgnk-calibration`, `sgnk-preference-log`, `sgnk-digression-guard`, `sgnk-learning-loop-reference`. Five skills named as the learning loop's own instruments have never been invoked by name. Some run as hooks instead, which is fine; but then the skill file is documentation wearing a skill's clothes.

Honest classification of the 131:

| Class | n | Basis |
|---|---|---|
| Actively invoked (7d) | 7 | trace ledger + skill-health agree |
| Invoked at some point in 65d | 30 | `comm -12` installed × traced |
| Never traced, legitimately on-demand | ~57 | vendor/plugin skills, `gvc`, `cso`, client skills |
| Never traced, superseded or absorbed into hooks | ~44 | the `sgnk-*` list above |

I will not call any of them abandoned on invocation count alone — LR#51 forbids it and the founder is right. The ones I *will* name as genuinely abandoned meet a stricter test (superseded AND never traced AND self-authored): `sgnk-learning-loop-reference` (a reference doc with a SKILL.md), `sgnk-workflow-artifact-bus` and `ux-revamp` (already sitting in `_parked/`), and `sgnk-trace` alongside `sgnk-trace-ledger` (two skills, one subsystem, neither invoked).

**4. State hygiene has quietly failed.**

`~/.sgnk/state` holds **46,895 entries, of which 46,807 are session-scoped ephemera** (`.count`, `.gate-tier.json`, `.turn-meta.json`, `.session-skill`). Last night's GC reported *"APPLIED: 896 ephemeral file(s) older than 14d (44 KB)"* — collecting roughly 2% of what accumulates. Meanwhile four durable ledgers have grown unbounded: `propensity.jsonl` 13.3 MB, `routing-journal.jsonl` 8.9 MB, `complexity-gate-log.jsonl` 7.8 MB, `subagent-reconcile.jsonl` 7.0 MB — all appended during this audit.

`~/.sgnk` carries **1,473 uncommitted changes** against a last commit of 2026-08-13; `~/.claude` carries 44 against 2026-08-27. Both have remotes. Eighteen days of substrate work is unpushed.

---

### What is genuinely, verifiably good

Worth stating plainly, because the failures above are concentrated in one layer and the rest is real.

- **All 26 hook scripts resolve.** Given LR#49's history I expected at least one dangling path. There is none.
- **The gates execute and pass.** I ran six read-only assertions after grepping each for write operations:

| Gate | Result |
|---|---|
| `assert-eod-tools-executable` | PASS |
| `assert-no-split-rows` | PASS |
| `assert-hooks-fail-open` | PASS |
| `assert-skill-descriptions-index` | PASS |
| `assert-injection-covers-fetchers` | PASS |
| `assert-refusal-is-detectable` | PASS |

These are not text-greps. `assert-hooks-fail-open` builds a sandbox `HOME` under `mktemp -d` and exercises the hooks inside it — the LR#49/LR#60 lesson, mechanized.
- **The registry is a real registry.** Each of the 40 rows carries `assert`, `broke`, and `proven_nonvacuous`. Row 1 encodes the zsh `$0` bug from LR#64 as an executable repro. Gate rot is *detected and reported*, not hidden.
- **`bin/` is not a graveyard.** Of 149 scripts, exactly **3** are referenced by nothing (`sgnk-devports`, `sgnk-launcher`, `tred-dispatch.sh` — all other-project tooling).
- **`epochs.jsonl` is the most honest artefact in the system.** It records `precision[rejected] = 0/8 = 0.000` and gates the negative-reward branch off because of it, with an explicit falsifiable `revisit_when`. That is a founder writing down that his own signal is noise.

---

### The three most worth fixing

**1. Make `skill` and `accepted` land on the Stop hook.** *Who uses it: Sagnik, every turn — ~980 turns/week [derived: 6,884 gate rows ÷ 7].* One edit at one seam unblocks the whole chain: reward-mine gets candidates, the bandit resumes updating, per-skill calibration leaves n=0. Everything downstream is already built and waiting on this field. This is the third instance of LR#59's producer/consumer field-name class; the fix is the same — accept every key the producers actually write, and treat missing as UNKNOWN, never as falsy.

**2. Adjudicate the four LEDGER-TAMPER files and the `season1-floor-intact` FAIL.** *Who uses it: Sagnik, nightly.* A red that has been red for 18 days has stopped being information. Either attest the four drifts or accept the chain is broken and re-anchor it — but decide, because right now the tamper detector's output is indistinguishable from noise. Un-vacuum `integrity-detectors-agree` in the same pass.

**3. Add a liveness timeout to `insights-last-run.json`.** *Who uses it: Sagnik, monthly.* A job stuck `"running"` for 28 days is not a stalled job, it is an absent one — and RULE 8's rollup, the mechanism that proposes new Learned Rules, is the thing that stalled. One `started_at` age check in the EOD run turns a silent 28-day gap into a one-line nightly alert.

### The three most worth deleting

**1. The `"dead"` tier in `skill-health.json`.** A label that violates LR#51 on 115 skills and trains you to distrust the report. Collapse it to `on-demand`, keeping only `dormant-and-superseded` as a review prompt. Cut recorded: nothing is pruned on this signal today, so removing the tier costs zero capability.

**2. The shadow → promote ladder, or its claim.** One log row in 43 days; nothing ever promoted. LR#38 says no change goes dev→live without shadow evidence — but the mechanism has produced no evidence in six weeks, so either the rule is being bypassed or the ladder is decorative. Delete the ladder and admit promotion is manual, or wire it. Do not keep both the machinery and the belief.

**3. The 60 superseded `AIOS-*.md` / `HANDOFF-aios-*.md` at `~/.claude` root** (44 + 16 files, **1.25 MB**) and the three `.bak.*` directories inside `AIOS-BOOK` (5.0 MB of a 124 MB tree). Not `rm` — LR#71 is right that the raw record is not deletable on a whim. Move them under `~/.claude/archive/` behind one index. They currently share a namespace with `CLAUDE.md`, and per LR#28 each one competes for the attention budget of whichever agent reads that directory next.

---

**One caution on this report.** I measured a live system that was writing to itself throughout — `complexity-gate-log.jsonl` grew while I counted it, and `calibration.json` was rewritten at 02:07 mid-audit. All counts are single-run. LR#63 says one run is an anecdote, and I did not re-run any count three times. The structural findings (frozen mtimes, null-field rates, stuck job status) are robust to that; the exact ratios are not.
