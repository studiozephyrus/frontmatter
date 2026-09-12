Verified read-only: zero commits in `~/.claude` or `~/.sgnk` in the last 3 hours; all 19 dirty paths pre-date this audit.

---

The cost router — the capability the brief calls "directly the AI-budget answer" — has never once routed anything: across 1,727 decisions it recorded `decision_mode: "advisory"` 1,726 times, recommended the cheap model on 98.784% of them, and the model that actually ran matched its advice 51 times, or 2.953% [measured, `cat ~/.sgnk/traces/*.jsonl | python3` cross-tab of `decided_model` × `tier`].

---

**BROKEN, STALE, OR NEVER-RAN — read this half first**

| # | THING | LIVE STATE | COMMAND | TAG |
|---|---|---|---|---|
| 1 | **Model router compliance** | `decision_mode` = `advisory` on 1,726/1,727; `decided_model`=sonnet 1,706 (98.784%); advice honoured 51/1,727 = **2.953%**. Of the 1,706 sonnet recommendations, opus-class ran 1,576 times | python3 counter over `~/.sgnk/traces/*.jsonl` | [measured]/[derived] |
| 2 | **The "did the AI help" field** | `sgnk-trace-append.sh:404` writes **`"accepted":null` on every row, unconditionally**; back-filled only by a later prompt classifier. Result: 182/5,049 non-null = **3.605%**, of which 156 true / 26 false | `grep -n accepted ~/.sgnk/bin/sgnk-trace-append.sh` | [measured] |
| 3 | **Skill attribution** | `skill:"unknown"` on 3,993/5,049 = **79.084%**. Add infrastructure rows (`sgnk-drift-watch` 349, `workflow` 398) and only **227 rows, 4.496%, name a real skill** | python3 counter | [derived] |
| 4 | **Ledger integrity** | 5,135 lines → 5,049 parse, **32 unparseable** (0.630%), all `Extra data: line 1 column 381` — two rows concatenated by a racing append. There is a `.lock` file per day AND a dedicated `assert-no-split-rows.sh` gate, and the corruption is still in the store | python3 json.loads loop | [measured] |
| 5 | **The eval loop** | Last write to `~/.sgnk/evals/` = 2026-08-03 = **27 days stale**. It is not empty (LR#32's test) — 11 dated run files for `sgnk-complexity-gate`, 10 for `sgnk-proposal`, ~350KB each — it simply stopped | `ls -lT ~/.sgnk/evals/**` | [measured] |
| 6 | **The one human-labelled agreement measurement** | `complexity-kappa-2026-07-17.json`: **kappa 0.1 against a 0.7 bar, CI95 [-0.125, 0.40], n=9, raw agreement 3/9, verdict "FAIL"**, self-noted as confirmation-assisted so κ could only be inflated. Its own `next:` field says re-run blind. **44 days later, no re-run exists** | `cat ~/.sgnk/evals/complexity-kappa-2026-07-17.json` | [measured] |
| 7 | **Bandit** | `~/.sgnk/state/routing-bandit.json` mtime 2026-08-20 = **10 days stale**; 3 of 10 arms carry `"seeded":"offline-0.5x"`; largest arm is still literally `__unattributed__` (opus a=24.1 b=5.9) | `ls -lT`, `python3 json.load` | [measured] |
| 8 | **Regression gates** | 40 rows, last registered **2026-08-13 = 17 days stale**. `prereg.jsonl` = 2 rows, last 2026-07-26 | `wc -l`, `stat -f %Sm` | [measured] |
| 9 | **`~/.sgnk/insights/`** | **Does not exist.** The RULE-8 global rollup that is supposed to feed Learned Rules has no output directory after 14 months | `ls -d ~/.sgnk/insights` → No such file | [measured] |
| 10 | **`skill-health.json`** | 132 tracked: **active 0, dormant 7, dead 115, infrastructure 10**. Only 7 skills fired in 7 days = **5.303%**. The tool labels an on-demand skill `dead` at 0 invocations — a live, running violation of the founder's own LR#51 | `python3` over `skill-health.json` | [measured] |
| 11 | **Trifecta detector** | 8,269 rows, **`decision` key absent on 8,269/8,269** — the field the record cites as 100%-allow is not even present. A detector with no recorded refusal | python3 counter | [measured] |

What *is* running, freshly, today: `complexity-gate-log.jsonl` (27,391 rows, 2026-07-17→2026-08-30, **622.5 rows/day** [derived: 27,391÷44]), `routing-journal.jsonl` (28,856), `trifecta-decisions.jsonl` (8,269), `injection-hits.jsonl` (1,743), `assertions.jsonl` (737), `PREFERENCE-LOG.jsonl` (241), `calibration.json` (mtime today), and snapshot capture. Machine-fed rows counted here total **66,259**; human-fed total **283** (241 preference + 40 gates + 2 prereg) — a **234:1** ratio [derived]. Build nothing whose value depends on the user supplying a signal.

---

**DOES §15 SURVIVE CONTACT WITH THE CURRENT THESIS**

Mostly yes, and it is the most honest document in the repo — §15.4 and §62.6 already refuse the things a flattering audit would have shipped. Three corrections:

| §15 CLAIM | LIVE | CONSEQUENCE |
|---|---|---|
| §15.2: complexity gate "**routes** each call to the cheapest sufficient model" | It does not route. `decision_mode` is advisory on 100% of rows; 97.047% of its advice is overridden | The "visible AI meter in currency" is still shippable as a **spend display**. It is not shippable as a **saving**, because the saving has never occurred once. Delete the word *routes*. |
| §15.1: 63 trace files / 5,018 rows; floor 95.1194% | 65 files / 5,049 rows / **32 corrupt**; gate log now 27,391 rows, floor **95.1955%** | Numbers drift ~600/day. §15's own instruction to re-derive at write time is correct and was needed within 48 hours. Also: the ledger's corrupt-row rate is a **product** defect, since the sidecar is the shipping artefact. |
| §15.2: session lifecycle → "Sessions as documents", lift **L** | **1,803 manifests across 21 repos**, of which **1,731 (96.007%) are machine-triggered** (`eod` 1,064, `auto-other` 661, `auto-near-limit` 4, `session-start` 2) and only **72 (3.993%)** are human-named. Written 47× vs read 7× (`sgnk-snapshot`:`sgnk-recall` = **6.71:1**) | The artefact factory produces at industrial rate and is barely consumed **by the one person it was built for**. This materially weakens it as the strongest candidate. |

Where §15 does not survive at all is its implicit ordering. It ranks by lift and evidence quality; the current thesis — *generate the artefacts, hand the user a context pack their own AI acts on* — has a harder filter: **does the capability still work when the user has no AI budget and no interest in the machinery?** Only the deterministic, zero-model-call half passes that.

---

**CANDIDATES**

| CAPABILITY | FOR THE FOUNDER | NORMAL USER HAS THIS PROBLEM? | SHIPPABLE SHAPE | WHO / HOW OFTEN | SIZE | VERDICT |
|---|---|---|---|---|---|---|
| **Gates + assertions → document CI** | 69 scripts (33 `assert-` + 34 paired `break-`); `assertions.jsonl` **398 pass / 339 fail = 54.0%** — the only store in the stack that discriminates | **Yes.** "It looked fine in my editor and broke on GitHub" is a universal, weekly, self-evident failure. Needs no vocabulary | `fm check` / `npx mdmax cert`, exit-coded, failing line linked; a check renders **unproven** until a paired failing fixture exists | Anyone publishing a doc anywhere but their own editor; **every publish** | S — 10 mdmax test files already in the repo | **SHIP** |
| **Snapshot / recall / handover → artefact factory** | 1,803 manifests; `00-KEY.md`…`06-conversation.md` + `manifest.json`; handover invoked 30× by hand | **Split.** "I need to hand this to another AI/person without losing context" — yes, real, but **episodic** (job change, contractor handoff, model switch), not weekly. "Auto-snapshot every session exit" — no; 96% machine-made, 6.71:1 write:read is the founder's own disuse | **Export a context pack on demand**, as ordinary markdown files in the folder. Never a background capture | Someone handing work off; **monthly at most**, spiky | M for on-demand; L for the importer | **SHIP the on-demand export · KILL the auto-capture** |
| **Complexity gate / model router** | 27,391 rows, 95.1955% floor, 41.663% `rule2_gated`; advisory only | **Half.** "What is this costing me" — yes, acute at ₹299. "Which tier did it pick" — no, and §62.1 bans the word | Corner meter in currency; per-action line; the deterministic **7-rung "try harder"** button with the cost delta shown *before* it runs | Every paying user, **passively, always visible**; the button maybe weekly | S | **SHIP the meter + button · KILL the auto-routing claim until compliance > 0%** |
| **Trace ledger → "did the AI help?"** | 5,049 rows, 30 keys, `files_sha256` 41.0% filled, `files_touched` 92.2% | **No, as framed.** The founder cannot answer it either: `accepted` is 3.605% populated because it is written null and back-filled by a prompt classifier. A feature that answers "did it help?" from a 3.6% signal is a fabrication | Narrow it to **"who wrote this"**: a `.frontmatter/trace.jsonl` sidecar, hover chip reading *unattributed* when it does not know — which will be most of the time | Reviewer/compliance reader; rare but high-stakes | M | **LATER** — after `files_sha256` coverage exceeds ~90% |
| **Eval loop + judge → quality gates on documents** | Real pipeline, 21 dated run files, and its only human-agreement number is **κ=0.1 vs a 0.7 bar** | **No.** A normal user disputing a machine quality verdict has no recourse, and by LR#5 every judged verdict must ship its own precision/recall/κ — which here is a failing number | — | — | — | **INTERNAL-ONLY** (aim it at frontmatter's own code, per §15.4) |
| **Skills → templates / generators** | 131 installed; **7 fired in 7 days = 5.303%**; 115 labelled dead | **No.** The founder's own gallery is 94.697% unused. A normal user's would be worse, and the record has already refused template galleries | — | — | — | **KILL** |
| **Hooks → user-authored automation triggers** | 28 hooks across 8 events; 5 of 5 `UserPromptSubmit` hooks are interruptions | **No.** 28 interruption points in a text editor is the ambient-coach pattern §62 already bans. And the honest answer to "should a user author one?" is no — the founder authored 28 and 3 of them are stale or contradictory | Ship a `brief:` key the user writes and checks **on request** | — | — | **KILL user authoring · INTERNAL-ONLY for ours** |
| **Learned-Rules mechanism → project accumulates rules** | **76 rules / 892 lines** live; the hygiene report parsed 69, so the auditor is 7 rules stale; `~/.sgnk/insights/` never existed, so the rollup half was never built | **No.** The value here is a markdown file a human writes — which frontmatter already is. The AIOS *mechanism* (agent-authored rules about the user, mined from transcripts) adds only the liability | `.frontmatter/rules/*.md` — a file the user owns, edits, deletes. That is not an AIOS capability, it is a file | Any user; rarely | S (it is a directory) | **KILL the mechanism · the file needs no port** |

---

**ONLY USEFUL TO THIS FOUNDER — never ship**

1. **The bandit and every learning claim.** 10 arms, 3 seeded synthetic, largest named `__unattributed__`, state 10 days stale. "It learns which model suits you" is unbacked, and three of the founder's own Learned Rules (#60, #62, #63) are records of calling this loop live prematurely.
2. **`skill-health.json` as any screen.** It tells you 115 of your 132 automations are dead, on a 7-day window, contradicted by 349 trace rows for one of the "dead" ones in the same window.
3. **Debate panels, consensus, reflexion, best-of-N.** Each multiplies model calls per user action. At ₹299 with bundled inference this is COGS suicide, and LR#16 already holds that a converged panel carries no authority — the user pays for deliberation that cannot decide anything.
4. **The raw `traces/` store.** Zero tenancy fields; `cwd` carries absolute paths into client repositories. Syncing it exfiltrates client identity before it delivers a feature.
5. **`break-*.sh` as a user action.** 34 scripts that deliberately corrupt the artefact. Ship the *property* (a check is unproven without a paired failure), never the button.
6. **The 5 `UserPromptSubmit` interruption hooks**, `sgnk-digression-guard` foremost — 0 of 5,049 trace rows carry its name.
7. **Exploration routing** (`explore-budget.sh`). Randomly routing a paying user's document to a non-default model for counterfactual signal is indefensible under any UI label.
8. **The trifecta badge.** 8,269 decisions, no recorded refusal on any of them.
9. **Any composite scalar** — vault health, document grade, routing confidence. Every scalar here is contradicted by another ledger in the same stack.
10. **The Learned-Rules ledger itself.** 76 rules, zero citations, its own auditor 7 rules behind. Defensible as a founder's private file; indefensible the moment a user disputes an entry.

---

**THE ONE: the deterministic check that refuses with a byte range**

Ship `fm check` — the assert/break gate pair expressed as document CI, exit-coded, failing line linked, and a check displayed as *unproven* until a paired failing fixture is recorded.

It wins on the only evidence that matters here: **it is the single AIOS capability whose live output is not all-green.** 398 pass / 339 fail across 737 assertion rows [measured], written to today. Set that against `trifecta-decisions.jsonl` at 8,269 rows with no recorded refusal, and against `regression-gates.jsonl` at 40/40 `proven_nonvacuous` but frozen 17 days. A check that has never said no is decoration; this one says no 46% of the time.

Against the artefact factory, which the brief nominates: the factory is real and it runs, but it is written 6.71× more often than it is read, 96.007% of its output is machine-triggered, and its consumer — `sgnk-recall` — fired 7 times in 65 days. A capability the founder's own hands barely consume cannot carry an MVP. Its on-demand half should still ship; it is just not first.

Against the cost meter: the meter is genuinely S-lift and genuinely the ₹299 answer, but its underlying claim is currently false. Shipping a meter is one afternoon *after* the check exists; shipping it first would ship the one number this audit proved has never once been acted on.

Against the trace chip: `files_sha256` is 41.0% filled and `skill` is 79.084% unknown. The chip would read *unattributed* on most paragraphs, which is honest and useless.

The check needs zero model calls, so it costs nothing at ₹299 and works with the AI switched off entirely. It matches the engine's law verbatim — locate the range, replace only those bytes, refuse rather than guess. It is already half-built: 10 `test/mdmax/*.test.ts` files including `certify.test.ts` and `verdict.test.ts` [measured, `find . -path "*mdmax*"`]. And the person is unambiguous: **anyone who publishes a markdown file somewhere other than the editor that wrote it, on every publish** — which, per the record's own mdmax histogram, breaks 50.10% of the time.
