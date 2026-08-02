---
mdmax: 1
section: 9
title: "AIOS: what to import, what to refuse, and how it makes the build faster and safer"
slug: 09-aios
lines: 1035
words: 10206
forward_links: [0, 1, 2, 4, 7, 8, 11, 12]
backlinks: [0, 1, 2, 3, 7, 11, 12, 13, 14]
prev: 08-market
next: 10-engine-spec
---

[← Index](README.md) · [← §8 Market](08-market.md) · [§10 Engine spec →](10-engine-spec.md)

## 9. AIOS: what to import, what to refuse, and how it makes the build faster and safer

### 9.0 Read this before you read the rest of the section

AIOS is a separate track (decision D5). This section is not about merging AIOS into MDMAX or into
frontmatter. It is about two much narrower questions:

1. What does thirty-five days of building an agent-orchestration toolchain give the **MDMAX build
   process** — the harness, the gates, the way a two-person team plus agents does twelve months of
   compiler work without shipping a false green?
2. What does MDMAX give **back** to AIOS, measured, not hoped for?

Two warnings that govern everything below.

**Warning one — the research area this section draws on was graded OVERSTATED by its own
verifier.** In `docs/engine/research/wf-final-gate-2026-08-01.result.json`, area `aios-transfer`
carries `headline_verdict: "OVERSTATED"`, and area `agentic-docs` also carries
`headline_verdict: "OVERSTATED"` [primary]. Of ten verified claims in `aios-transfer`, **four are
CONFIRMED, four are OVERSTATED, two are REFUTED** [measured, counted from
`per_area[].verification.verdicts`]. The two REFUTED claims are the two that most flattered the
idea of importing AIOS wholesale. Both are corrected in place below rather than repeated. If you
find a claim in an older document that this section contradicts, this section governs, because it
is written against the verifier's `verdicts[]` array rather than against the `headline` string.

**Warning two — this section makes no claim that AIOS makes agents better at writing markdown.**
Zero live model calls were made in any research run [primary, stated in the run's own method
notes]. The claim "markdown is the file type agents fail to edit MOST" was **REFUTED**: on the
1,944-file transcript selection, `.md` is 40 errors in 1,066 attempts = 3.75%, while `.ts` is
6 in 54 = **11.11%** and `.json` is 3 in 62 = **4.84%** [measured, `aios-transfer` verification,
claim 9]. Worse, the modal `.md` failure is not an anchoring failure at all: classifying all 40
`.md` error bodies gives **23 `File has not been read yet` (57.5%), 14 `String to replace not
found` (1.31% of attempts), 3 `File has been modified since read` (0.28%)**. The figure
`file_modified=26` that appeared in earlier drafts was obtained by subtracting 14 from 40; the
true classified count is **3** [measured, same verification]. Any design specified against "26
stale-read collisions" is specified against a residual, not a measurement. Do not build against it.

---

### 9.1 What AIOS is, for a reader who has never seen it

AIOS ("agent operating system", Sagnik's personal orchestration toolchain) is a versioned control
layer that sits between a human operator and the coding agents he runs. Physically it is two git
repositories on one Mac: `~/.claude`, which holds the always-loaded operating instructions
(`CLAUDE.md`), 119 skill definitions under `~/.claude/skills-src/`, and the hook wiring in
`settings.json`; and `~/.sgnk`, which holds the runtime — a trace ledger, evaluation fixtures, a
preference log, calibration state, and a directory of regression gates. Day one is 2026-06-27
(first commit `d8691dd4` in `.claude`); `~/.sgnk` was created 2026-07-09 [primary,
`~/.claude/HANDOFF-aios-2026-08-01-MASTER.md` §1.2]. The doctrine document
`~/Desktop/GitHub/md/Zephyrus/AIOS-System-Architecture.md` (35,640 bytes, generated 2026-06-27)
states the organizing thesis in one sentence: *"You do not have a self-improving orchestrator — you
have an orchestrator that changes — until evaluation is infrastructure, logged per task, calibrated
against the human, and wired back into routing."* [primary, that file, §0].

Mechanically, AIOS works by three surfaces. **Rules**: `~/.claude/CLAUDE.md` carries eight numbered
zero-tolerance RULES (verify every factual claim; never run a destructive operation without
per-operation approval; take a pre-op backup; no subagent may run those operations; distinguish
"I believe" from "I verified"; show the arithmetic; acknowledge and fix your own errors; append a
new Learned Rule when corrected) plus an append-only **Learned Rules** block. **Hooks**: 28 shell
and Python hooks wired into `settings.json` fire on `SessionStart`, `UserPromptSubmit`,
`PreToolUse`, `PostToolUse`, `SubagentStop`, `Stop`, `SessionEnd` and `PreCompact` — these are the
enforcement layer, because a textual prohibition in a prompt is advisory (Learned Rule #48).
**Gates**: `~/.sgnk/gates/` holds paired `assert-*.sh` / `break-*.sh` scripts, and
`~/.sgnk/state/regression-gates.jsonl` holds the registered gate set. Live state as measured on
2026-08-01: **31 `.sh` files in `~/.sgnk/gates/`**, **21 registered gates** in
`regression-gates.jsonl` [measured, `ls -1 ~/.sgnk/gates/*.sh | wc -l` = 31; `grep -c .
~/.sgnk/state/regression-gates.jsonl` = 21]. Note the discrepancy with the master handoff, which
publishes "27 gate scripts" in its §7 substrate line — that count was taken at 04:20 IST and the
directory was written again at 05:35 IST the same day.

The honest summary of AIOS at day 35 is the one its own master handoff gives:
*"the error-detection layer is genuinely good and genuinely unarmed; the learning layer is
instrumented and not learning."* [primary, `HANDOFF-aios-2026-08-01-MASTER.md` §12]. That sentence
is the whole basis for what follows. **We import from the error-detection layer. We refuse the
learning layer**, not because it is badly built, but because by its own author's measurement it
does not yet do the thing its name says.

---

### 9.2 The measured relationship: most of AIOS is untouched by MDMAX

Before claiming any benefit in either direction, state the size of the overlap. It is small.

**AIOS's runtime is JSONL, not markdown.**

| Extension | Bytes | Files | Source |
|---|---:|---:|---|
| `.jsonl` (canonical figure) | 16,396,902 | — | brief's pinned measurement |
| `.md` (canonical figure) | 2,057,158 | — | brief's pinned measurement |
| `.jsonl` (re-measured 2026-08-01) | 16,465,646 | 275 | [measured] `find ~/.sgnk -name '*.jsonl'` |
| `.md` (re-measured, **all**) | 18,768,046 | 450 | [measured] `find ~/.sgnk -name '*.md'` |
| `.md` in `~/.sgnk/rawl/` only | 16,789,640 | 282 | [measured] web-scraper cache, not AIOS state |
| `.md` (re-measured, **excluding `rawl/`**) | 1,978,406 | 168 | [measured] 18,768,046 − 16,789,640 |

Read the last two rows carefully, because the naive measurement inverts the conclusion. Most of the
markdown under `~/.sgnk` is **cached web pages written by the `sgnk-rawl` scraper**, which is not
AIOS state at all. Excluding that directory, AIOS's own markdown is **1,978,406 bytes against
16,465,646 bytes of JSONL — a ratio of 8.3 : 1 in favour of JSONL** [measured]. The brief's
canonical figures (16,396,902 vs 2,057,158, ratio 8.0 : 1) are consistent with mine in direction
and within 4% on both sides; the small differences are files that grew between the two
measurements, which is expected for append-only trace and preference logs. **Both measurements
support the same conclusion and neither should be quoted without the `rawl/` caveat.**

**AIOS's gates barely look at markdown.** Of the 31 shell scripts in `~/.sgnk/gates/`, exactly
**two** contain the string `.md` — `assert-skill-contract.sh` and `break-skill-contract.sh`, the
pair that checks whether the 119 `SKILL.md` files still parse against their frontmatter contract
[measured, `grep -l '\.md' ~/.sgnk/gates/*.sh`]. **2 of 31 = 6.5%.**

**So state it plainly:** an editor and compiler for markdown does almost nothing for AIOS's
runtime. The trace ledger, the router, the calibration curve, the bandit, the preference log, the
eval fixtures, the drift stamps — all JSONL, all untouched by MDMAX. The overlap is confined to one
surface (the skill catalogue, §9.10) and one defect class (writer truncation, §9.10). Anyone who
tells you MDMAX "supercharges AIOS" has not measured the file types. **The traffic runs the other
way: AIOS gives the MDMAX build a discipline; MDMAX gives AIOS one narrow fix and one budget
problem.**

---

### 9.3 The one mechanism worth importing, and why it is the one

**DECIDED.** We import exactly one AIOS mechanism into the frontmatter repository:
`~/.sgnk/bin/sgnk-regression-gate.sh` (164 lines, bash) [measured, `wc -l`], reimplemented in Node
as `specs/harness/gate.mjs`.

#### 9.3.1 What it does

A regression gate is normally a test somebody wrote after fixing a bug. Its weakness is structural:
nothing ever checks that the test would have caught the bug. `sgnk-regression-gate.sh` closes that
by refusing to register a check until the check has been **proven to go red under a reintroduced
defect**. Registration takes two commands, not one:

```
--assert  a command that must exit 0 on the current, fixed system
--broke   a command that reintroduces the defect and must make the assertion exit non-zero
```

The tool runs **both** at registration time. If the assertion does not pass on the fixed system, or
does not fail under `--broke`, or `--broke` was not supplied, or the write to the gate store did not
land, registration is **REFUSED** and nothing is stored. The header states the design intent
verbatim: *"That makes every gate in this file non-vacuous BY CONSTRUCTION rather than by review"*
[primary, `sgnk-regression-gate.sh:15`].

#### 9.3.2 The exact contract — four refusal codes, each with a distinct exit status

| Exit | Condition | Message (verbatim from source) | Line |
|---:|---|---|---:|
| `2` | assertion already red | *"REFUSED: the assertion does not pass on the current system… A gate that is already red cannot tell you when the defect returns."* | 43–45 |
| `3` | vacuous gate | *"REFUSED: the assertion still passes with the defect reintroduced… That gate is VACUOUS — it would certify the bug."* | 51–52 |
| `4` | no repro supplied | *"REFUSED: --broke is required. A gate whose failure mode was never demonstrated is a claim, not a check."* | 56–58 |
| `5` | write did not land | *"REFUSED: … proved non-vacuous but the write to \$GATES did NOT land (permission?). Nothing was stored."* | 71–72 |

Exit `5` exists because the first version of the tool printed `REGISTERED` unconditionally, and an
OS sandbox denial on `~/.sgnk/state` made it report success while storing nothing — *a false green
inside the tool built to eliminate false greens* [primary, source comment at lines 60–63; this is
Learned Rule #67]. The fix is a count-before / count-after around the append.

Two further verbs:

- `--run` executes every stored `assert` and exits 1 if any fails. A failure prints
  `FAIL <id> — the defect this gate was built for has RETURNED` [primary, line 85].
- `--verify-all` is the anti-rot pass: it re-executes every stored `--broke` and asserts each gate
  **can still fail**. A gate that no longer goes red under its own repro is reported `VACUOUS` and
  the run exits non-zero. Exit code `97` is a reserved `REPRO_NOOP` sentinel meaning *the repro's
  anchor no longer matches the source it patches, so it reintroduced nothing and its red proves
  nothing* — reported `INCONCLUSIVE`, and an inconclusive gate is **not** a pass [primary, lines
  96–115].

Live status on 2026-08-01: **21 PASS / 0 FAIL and 21 proven / 0 VACUOUS / 0 INCONCLUSIVE**
[primary, `HANDOFF-aios-2026-08-01-MASTER.md` §7], re-measured by me as 21 registered gates, ids:
`LR64-zsh-dollar-zero-taint-gate`, `reward-human-deletion-is-rejected`, `traces-no-fused-lines`,
`credential-dir-denied`, `battery-agrees-across-bash-and-zsh`, `no-bracket-gt-string-compare`,
`tools-parse-under-both-shells`, `traces-no-split-rows`, `selfheal-refuses-without-backup`,
`writer-verifies-write-landed`, `no-stale-rule-verdicts`, `drift-stamp-parity`,
`scheduled-tools-are-versioned`, `hooks-honour-shared-contract`, `every-tool-is-invokable`,
`skills-honour-frontmatter-contract`, `gold-pool-not-starved`, `refusal-is-detectable`,
`injection-scan-covers-fetchers`, `eod-tools-are-executable`, `calibration-has-a-sample`
[measured].

#### 9.3.3 The hole the verifier found, which the port must close

**Do not port this tool as-is.** The `aios-transfer` verifier probed the registration path that the
tool's own selftest does not cover, in a sandbox via the `SGNK_REGRESSION_GATES` environment
override, and found:

> `--add --id noop-probe --assert 'true' --broke 'exit 97'` prints `REGISTERED noop-probe — asserted
> green, proven red under the reintroduced defect.`, exit 0, and stores `"proven_nonvacuous":true`.
> 97 is the tool's OWN `REPRO_NOOP` sentinel… `_add` never checks it; only `_verify_all` does.

[measured, `aios-transfer` verification, claim 3, verdict OVERSTATED]. I confirmed the shape by
reading the source: the `REPRO_NOOP` comparison exists at line 105, inside `_verify_all`, and
nowhere inside `_add`.

**DECIDED — the port adds a fifth refusal code:**

| Exit | Condition |
|---:|---|
| `6` | `--broke` exited with the reserved `REPRO_NOOP` status. It reintroduced nothing; its red proves nothing; registration is refused. |

This matters more for MDMAX than it did for AIOS, because our `--broke` commands patch source files
by anchor (see §9.5) and anchors in a compiler under active development rot weekly.

#### 9.3.4 Why this mechanism and not another: the diagnosis it produced of our own research

The reason this specific mechanism is the one worth importing is that it names, precisely, the
defect that produced the research corpus this whole plan is built on.

The earlier 18-area capability run had a **100% headline defect rate** — every headline was refuted
by its own verifier, always in the flattering direction. That is independently re-derived: **exactly
14 of 18 `verification.killed` lists contain the case-insensitive token `headline`, and all four
remainders kill the headline's load-bearing number instead** [measured, `aios-transfer`
verification, claim 2, verdict **CONFIRMED**].

The mechanical cause is visible in the workflow script that produced them. The 1,021-line file
`mdmax-capability-maximization-wf_2e537e60-938.js` mentions `killed` at exactly **three** lines —
**871** (a schema `required` array), **891** (a property definition), **942** (a string
concatenation into `digest`) — and **never once inside a conditional**. Line 933 is
`const clean = results.filter(Boolean)`, which filters `null` only. The return block emits
`headline: r.research.headline` with no reference to `r.verify` [measured, same verification,
claim 1]. **The adversarial verifier was a reporter, not a gate.** Its output was written down next
to the headline and the headline shipped anyway.

**Two corrections the verifier forced on that finding, which this plan adopts:**

1. **"The verifier's output NEVER influences the artifact" is false and was KILLED.** Line 942 folds
   `KILLED:` into `digest`, and the synthesis prompt built from that digest reads verbatim:
   *"Each was adversarially verified; claims listed as KILLED did not survive and must not be built
   on."* The synthesis object is returned and it demonstrably acted — the completeness-critic lens's
   `what_to_cut` contains *"TWELVE OF THE EIGHTEEN DESIGN SECTIONS. Every design whose justification
   did not survive its own verifier should be deleted rather than patched."* The correct, surviving
   claim is narrower: **the verifier influences the artifact only through a model-mediated prompt,
   never through a branch.** That is what "a reporter, not a gate" means, and that survives.
2. **"This is the mechanical cause of the 100% defect rate" was KILLED as an untested causal
   attribution.** A grep establishes the absence of a branch; it does not establish causation. The
   *newer* 16-area workflow (`mdmax-final-gate-wf_b87faf71-509.js:767`) has the **same** absence of a
   conditional while adding `negatives` and `falsifier` fields — and its headline defect rate fell
   to 5 CONFIRMED / 10 OVERSTATED / 1 REFUTED. **The variable was never isolated.**

That second correction is the honest reason we import the gate. Not "branches fix headlines" — we
have not proven that. Rather: **a mechanism that physically cannot store an unproven check is
cheaper than a discipline that asks a model to be honest**, and the one artefact in AIOS that has
that property is this one.

**What would falsify this choice.** If, after twelve weeks, the gate registry contains fewer than
ten gates, or if more than a third of `--verify-all` runs come back INCONCLUSIVE because repro
anchors have rotted, then the mechanism is imposing more maintenance than it prevents and should be
replaced by ordinary tests plus a manual mutation-testing pass each quarter.

---

### 9.4 Two deliberate changes when porting

#### (a) Write it in Node, not bash

**DECIDED.** `specs/harness/gate.mjs`, not `specs/harness/gate.sh`.

This is not a style preference. The frontmatter repository is a Node 24 project
(`"engines": {"node": ">=24"}`, [primary, `package.json`]) with 901 first-party `.ts`/`.tsx` files
including worktrees and 296 under `src/`, `test/` and `specs/` alone [measured]. Every AIOS bash
script runs under macOS `/bin/bash` 3.2 invoked from a zsh harness, and **that combination is the
single largest documented source of false REDs in AIOS's history**. Rewriting in Node deletes the
class at the root rather than papering over it. The class, with citations:

| Learned Rule | The failure | Consequence |
|---|---|---|
| **#55** | Under `set -e`, a function whose last line is `[ cond ] && cmd` returns 1 when `cond` is false and kills the caller | Silently disabled **all** nightly database backups for weeks |
| **#64** | macOS `/bin/bash` 3.2 treats a lone apostrophe as a quote opener even inside a `<<'QUOTED'` heredoc — one contraction in a **comment** makes the script unparseable, and the error is reported hundreds of lines from the cause. `zsh -n` passes. | Took `sgnk-reward-mine.sh` from rc=0 to rc=2. Also: zsh sets `$0` to the **function name** inside a function, so a helper re-invoking `"$0"` recurses into itself |
| **#65** | Bash 3.2 writes heredoc temp files to `/tmp` unconditionally; under an OS sandbox that write is denied when cwd sits outside the allowlist | The full-loop battery scored **67 PASS / 0 FAIL** from one directory and **55 PASS / 12 FAIL** from another — *same TMPDIR, same code, same commit* |
| **#66** | A bare `*.log` glob passes through unmatched in bash but **aborts the whole command** in zsh. `[ "$a" \> "$b" ]` has no `>` operator in zsh's `[` builtin: it errors and returns false | Deep-route battery scored **bash 32/0 vs zsh 31/1, same second**. The date comparison "named the healthy outcome as the failure it exists to catch" |

Four rules, one root cause, and the cost of each was hours of hunting a regression that did not
exist. Learned Rule #65 states the reason this is a rule and not a footnote: *"a harness that
reports false FAILures trains you to ignore it, which is the same disease as one that reports false
PASSes."*

Node has none of these. `child_process.spawnSync` with an explicit `argv` array has no word
splitting, no glob expansion, no heredoc temp file, no `$0` reassignment, and one parser. **RECOMMENDED
implementation detail:** run every `--assert` and `--broke` through `spawnSync(cmd, args, {shell:
false})` where possible; when a shell is genuinely required, pin it (`/bin/bash`) and record which
shell ran in the gate row, so a future zsh/bash divergence is visible in the data rather than
inferred from a mood.

#### (b) Stamp an environment fingerprint on every gate row

**DECIDED.** Every row written to `specs/harness/gates.jsonl` and every row emitted by `--run` and
`--verify-all` carries an `env` object. A green produced in a different environment is then
**visibly a different measurement** rather than silently comparable to the last one.

```jsonc
{
  "id": "splice-writes-exactly-what-was-requested",
  "desc": "the splice writer must write byte-for-byte what the caller asked for",
  "assert": "node specs/harness/gate-cases/splice-conformance.mjs",
  "broke":  "node specs/harness/gate-cases/splice-conformance.mjs --reintroduce=ast-regeneration",
  "registered": "2026-08-04T09:12:44Z",
  "proven_nonvacuous": true,
  "corpus_id": "sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4",
  "env": {
    "cwd": "/Users/sagnikmitra/Desktop/GitHub/frontmatter",
    "git_head": "1bd4dad",
    "git_dirty": true,
    "node": "v24.x.x",
    "platform": "darwin",
    "arch": "arm64",
    "tmpdir": "/var/folders/...",
    "ci": false,
    "shell_used": null
  }
}
```

The `cwd` field is the load-bearing one, and §9.7.3 explains why: the AIOS gate harness produces
**17 PASS / 4 FAIL from one directory and 21 PASS / 0 FAIL from another, same commit, same minute**,
and has no field in which that difference is recorded. `git_dirty` is the second: `docs/mdmax/PLAN.md`
in this working tree currently carries **351 insertions and 350 deletions** that are not committed
[measured, `git diff --stat`], so a gate that reads it is measuring a state no one else can
reproduce.

**RECOMMENDED, not decided:** add a `--require-clean` flag that refuses registration when
`git_dirty` is true. Deferred because early compiler work is inherently dirty and a hard refusal
would just get bypassed.

---

### 9.5 The first three gates to register, each with its `--broke` written FIRST

**The discipline, stated as a rule for the team:** you do not write the assertion first. You write
the `--broke` command first, run it against the current tree, and confirm it produces the defect.
Only then do you write the assertion. Learned Rule #68 is the reason: *"a test whose subject is a
RARE fault proves nothing until it reproduces the fault — a green suite is the expected result of
running it, not evidence of a fix."* That rule was earned on a bug that fires in **~0.34% of
artifacts (3 of 880)**, where a fix passed a live end-to-end run *and* a differential over 120 real
artifacts with **0 failures under both the old and the new code**. Both greens were noise.

All three gates below pin the corpus. **Any gate whose assertion counts files must record
`corpus_id: "sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4"`
(1,084 files, 25,548,765 bytes)** [primary, `docs/engine/research/corpus-manifest.json`:
`total_files` 1084, `total_bytes` 25548765]. The reason is concrete and current: the splice figure
below is stated as *"0 of 51 files"* at `docs/engine/PLAN.md:170`, but today
`git ls-files '*.md' | wc -l` in this repository returns **57** [measured, 2026-08-01]. The 51 was a
true measurement at some earlier moment and is already unreproducible. **A gate that asserts "51"
will go red for the wrong reason within a week.**

#### Gate 1 — `splice-writes-exactly-what-was-requested`

**Defect class it locks.** Decision D7 is splice-only writing: never regenerate the file from the
AST. The theorem is Foster et al., TOPLAS 2007, Lemma 3.9 — a total well-behaved lens whose `put`
ignores the original source requires `get` to be a bijection, and "regenerate from the AST" is
definitionally such a lens [primary, `docs/engine/PLAN.md:160-163`]. The measurements:
**443 of 655 CommonMark spec examples are two distinct source strings with a byte-identical AST**;
a zero-edit AST round trip of a real 206 KB document **rewrites 24.98% of lines and drops 18.94% of
bytes**; and on this repository **0 of 51 files survive `parse → remark-stringify` byte-identically,
1 of 51 with every option tuned** [primary, `docs/engine/PLAN.md:165-170`]. `mdast-util-to-markdown`'s
own documentation states *"complete roundtripping is impossible."*

**`--broke`, written first.** A flag on the gate case that swaps the splice writer for an
AST-regeneration path (`parse → mdast-util-to-markdown → write whole file`) and runs the corpus
through it.

```bash
node specs/harness/gate-cases/splice-conformance.mjs --reintroduce=ast-regeneration
```

**Expected before you write the assertion:** non-zero exit, with a count of files whose output
bytes differ from input bytes on a zero-edit pass. Against the pinned corpus this must be a large
number; against this repository's tracked markdown it must be **at least 50 of the 57 files**
(the historical figure is 0 survivors of 51). If it comes back green, your reintroduction did not
reintroduce anything — that is `REPRO_NOOP`, exit 97, and registration must refuse (§9.3.3).

**The assertion.** For every file in the pinned corpus, apply a randomly generated but recorded set
of splice operations, and assert `bytesWritten === bytesRequested` and that every byte outside the
spliced ranges is unchanged. Exit 0 only if both hold for every file.

**What this does NOT cover.** It does not check that the splice is *semantically* right — a splice
can write exactly the requested bytes into exactly the wrong place. That is Gate 2's job. It also
does not cover concurrent writes.

**What would falsify the gate.** If it stays green while a user reports frontmatter collapsed to a
single line, `[x]` escaped to `\[x]`, or `_word` escaped to `\_word` — the documented damage from
DesktopCommanderMCP issue #440, 2026, where an AI tool added `@tiptap/core` and silently rewrote
users' `.md` files through ProseMirror's model, **14 file-writes across 6 files in 4 minutes, and it
fired on read-only operations** [primary, `docs/engine/PLAN.md:175-180`] — then the gate's corpus is
not representative and must be extended with the specific constructs that were damaged.

#### Gate 2 — `resolve-never-returns-a-wrong-index`

**Defect class it locks.** The anchor resolver must never silently return the wrong block. Refusing
to resolve is acceptable; resolving incorrectly is not, because a comment or suggestion then lands
on text the author never wrote.

**`--broke`, written first.** Swap the resolver's scheme for **content hash plus nearest-position
tiebreak**, which is measured at **77.80% correct, 22.20% false match, 0% safe refusal** on a
denominator of **32,919 surviving block-versions** [primary, `docs/engine/PLAN.md:104-113`].

```bash
node specs/harness/gate-cases/anchor-safety.mjs --reintroduce=hash-plus-nearest-position
```

**Expected before you write the assertion:** non-zero exit reporting a false-match rate near 22.20%.
That number is the proof of non-vacuity. If the reintroduced scheme produces 0% false matches on
your fixture set, **your fixture set is too easy** — it does not contain the near-duplicate blocks
that make position tiebreaking dangerous, and the gate you are about to register will certify
nothing.

**The assertion.** Over the same 32,919 block-versions, assert **false-match rate == 0.000%** for
the shipped resolver on the subset it agrees to resolve, and assert that every unresolvable anchor
returns an explicit refusal rather than a best guess.

**A caveat you must carry into the gate's own description.** The recommended scheme's headline is
**99.627% correct / 0.050% false / 0.323% safe refusal** at **~41 ms for a 446 KB / 2,225-block
document** [primary, `docs/engine/PLAN.md:113-115`]. **The 99.627% figure has been re-derived by
nobody.** It is one measurement from one run and no independent party has reproduced it. Write that
sentence into the gate's `desc` field so it travels with the gate. The gate itself must assert the
**0.000% false-match invariant**, which is a safety property, and must **not** assert 99.627%, which
is a performance number that will legitimately move as the resolver improves. Asserting a
performance equality is the mistake Learned Rule #66 names as its third false-RED: an
equality-pinned count "punishes coverage growth and rewards standing still." **Assert floors on
safety, never equalities on quality.**

**What this does NOT cover.** Adversarial input — a document constructed specifically to collide
anchors. That belongs in a separate fuzzing gate once the resolver is stable.

#### Gate 3 — `no-artifact-leaves-the-writer-undecodable`

**Defect class it locks.** UTF-8 integrity. This is the defect class described in Learned Rule #68:
`awk substr` and `cut -c` split multi-byte characters, and the resulting artifact cannot be decoded.
It fires in **~0.34% of artifacts (3 of 880)** [primary, `~/.claude/CLAUDE.md`, Learned Rule #68,
line 744], which is precisely why it survived a live end-to-end run and a 120-artifact differential
with zero failures.

**`--broke`, written first.** Swap the writer's codepoint-safe cut for a byte-oriented one — the
`head -c` equivalent — and run the corpus through.

```bash
node specs/harness/gate-cases/utf8-integrity.mjs --reintroduce=byte-oriented-cut
```

**Expected before you write the assertion:** non-zero exit naming the specific files that fail to
decode. **And here is the part the team will get wrong if it is not written down:** LR#68 records
that proof only came from *reconstructing the failing input out of the corrupt artifact itself* —
stripping the writer's own prefix and suffix, restoring the character the source proves was there,
and showing the old code emits output **byte-identical to the shipped corruption**. A random corpus
pass at a 0.34% base rate will produce zero failures often enough to fool you. **The `--broke`
fixture must contain a constructed case where a multi-byte character straddles the cut boundary by
construction, not by chance.**

LR#68 also records the corollary that cost time the first go: *"a repair tool's signature must be
derived from the artifacts, not from the mechanism you imagine"* — the first version of that gate
matched only truncation at a **line end** and silently refused all three real files, because there
the orphan byte sits **mid-line**.

**The assertion.** Every artifact the writer produces round-trips through
`Buffer.from(bytes).toString('utf8')` and back to identical bytes; no lone surrogates; no
replacement characters introduced that were not in the input.

**What this does NOT cover.** Normalization (NFC vs NFD) and bidirectional text. Those are separate
concerns with separate gates, and neither is in scope for the first three.

#### The three gates as a registration sequence

```bash
# ALWAYS run --broke standalone first and read its output. If it exits 0, stop.
node specs/harness/gate-cases/splice-conformance.mjs --reintroduce=ast-regeneration; echo "rc=$?"

node specs/harness/gate.mjs --add \
  --id  splice-writes-exactly-what-was-requested \
  --desc "bytes written == bytes requested; every byte outside the spliced range unchanged (D7, Foster et al. TOPLAS 2007 Lemma 3.9)" \
  --corpus sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4 \
  --assert 'node specs/harness/gate-cases/splice-conformance.mjs' \
  --broke  'node specs/harness/gate-cases/splice-conformance.mjs --reintroduce=ast-regeneration'
```

Repeat for `resolve-never-returns-a-wrong-index` and
`no-artifact-leaves-the-writer-undecodable`. Then wire `node specs/harness/gate.mjs --run` into
`npm run verify` (§9.6) and `--verify-all` into a weekly job.

---

### 9.6 The verify ladder

#### What the research REFUTED about this

The claim *"The AIOS verify ladder transfers to the MDMAX build with zero modification"* was graded
**REFUTED**, and the reasons are specific and worth reading before anyone tries the import:

- `grep -n 'tsc|noEmit|tsconfig' ~/.sgnk/bin/verify-ladder.sh` returns **exactly one line — line 15,
  inside the header comment**. **There is no tsc branch in the code.** I confirmed this by reading
  the source: the syntax rung branches on `*.sh → bash -n` (line 80), `*.py → python3 -m py_compile`
  (line 83), `*.js → node --check` (line 86). No TypeScript [measured].
- On frontmatter the syntax rung sees **2 `.sh` files, 2 `.py` files (one of which is
  `./node_modules/flatted/python/flatted.py`), and the first 100 of 1,281 `.js` at maxdepth 3** —
  and **zero of the repository's 901 first-party `.ts`/`.tsx` files** [measured, `aios-transfer`
  verification, claim 4; I independently re-derived the 901 figure].
- The reported "3.17 s pass on frontmatter" is therefore *a pass over two shell scripts and
  `node_modules`*.
- The non-vacuity demonstration was **confounded**: the test tree contained both a TypeScript type
  error and a broken shell script. Split apart, the TypeScript-only tree gives
  `{"verdict":"infra","rung_reached":"none","pass":false,"timeout":false,"rungs":{"syntax":"skip"}}`,
  exit 2. **The ladder never sees TypeScript. The failure came entirely from the shell file.**

Two method defects were logged from this, and both are ours to avoid: *"a two-cause probe presented
as a single-cause proof"*, and a documentation/code divergence (`verify-ladder.sh:15` documents a
rung that does not exist) that *"caused a downstream researcher to believe TypeScript was being
checked and to publish a transfer claim on it."*

#### What we already have

`npm run verify` at HEAD is already a cheapest-first ladder [primary, `package.json`, and confirmed
byte-identical between HEAD and the working tree — `git diff --stat package.json` is empty, and both
carry 18 scripts]:

```
verify = typecheck → lint → test → build → arch
```

with `typecheck: tsc --noEmit`, `lint: eslint . --max-warnings=0`, `test: vitest run
--passWithNoTests`, `build: next build`, `arch: node specs/harness/clean-architecture-report.mjs`.

> **Contradiction resolved.** The research run logged a REPO defect: *"the working-tree package.json
> has `"scripts": {}` (uncommitted, 97 deletions)… DESIGN §2's premise is true at HEAD and false in
> the tree the team would build in."* **That is no longer true.** As measured on 2026-08-01,
> `git diff --stat package.json` returns empty and both HEAD and the working tree carry all 18
> scripts including `verify`. The defect was real when logged and has since been repaired. The
> research record governs history; the live measurement governs the build.

The imported ladder is therefore **strictly weaker than what the repository already has**, and we do
not import the script.

#### The one rule to import

**DECIDED.** Import the ladder's *semantics*, not its code. Two rules, both stated verbatim in
`verify-ladder.sh`'s own header [primary, lines 6–9, 19–21]:

> *"a rung that TIMES OUT is `infra`, never `fail`, so a slow/wedged candidate can never masquerade
> as a quality failure"*

and a single-line JSON contract:

```
{"verdict":"pass|fail|infra","rung_reached":"<rung>","pass":bool,"timeout":bool,"rungs":{...}}
Exit code mirrors verdict: 0 pass · 1 fail · 2 infra (timeout/unavailable)
```

**Why the timeout rule is the one that matters.** Without it, a candidate that wedges — an infinite
loop in the parser, a runaway regex, a hung `next build` — is recorded as a *quality* failure. If
you are running best-of-N candidate selection over agent-produced patches, that means the wedged
candidate is scored as "bad code" and the selector learns from noise. With the rule, it is scored as
"the harness could not decide", it is **non-selectable**, and the signal stays clean.

**The frontmatter rung table, as decided:**

| Rung | Command | Typical cost | On timeout |
|---|---|---|---|
| `typecheck` | `tsc --noEmit` | seconds | `infra` |
| `lint` | `eslint . --max-warnings=0` | seconds | `infra` |
| `test` | `vitest run --passWithNoTests` (83 test files under `test/`) | tens of seconds | `infra` |
| `gates` | `node specs/harness/gate.mjs --run` | seconds | `infra` |
| `build` | `next build` | minutes | `infra` |
| `arch` | `node specs/harness/clean-architecture-report.mjs` | seconds | `infra` |

`gates` is inserted **before** `build` because it is cheap and because a splice or anchor regression
should stop the ladder before anyone waits for a Next.js build.

**One JSON line per run**, appended to `specs/harness/verify-runs.jsonl`, carrying the `env`
fingerprint from §9.4(b). This is the substrate for every later question about whether the build is
getting faster or flakier, and it costs one line.

**A wiring hazard, recorded because AIOS hit it.** When the gate block was first added to AIOS's
nightly job it was placed at the **end** of `sgnk-eod.sh`, below a `[ -f "$REG" ] || exit 0` guard
that no-ops the whole job when there is no snapshot registry — so gate health was silently coupled
to an unrelated opt-in, and a fresh environment ran zero gates and produced no log [primary,
`HANDOFF-aios-2026-08-01-MASTER.md` §8.2]. **When you add `gates` to `verify`, verify it actually
ran in a clean checkout, not just on your machine.**

---

### 9.7 What to refuse, and why

#### 9.7.1 REFUSE: the bash guard

`~/.sgnk/bin/sgnk-bash-guard.sh` is a `PreToolUse(Bash)` hook that regex-matches the command string
against a deny-list and blocks on a match. Its narrow "catastrophic" subset is
**mode-independent — it always blocks**, regardless of the warn/enforce setting [primary, source
comment: *"this subset is ALWAYS blocked, independent of SGNK_BASH_ENFORCE (no mode check in this
branch)"*].

The catastrophic pattern includes `TRUNCATE[[:space:]]`, matched with `grep -ioE` — case-insensitive,
unanchored, against the **whole command string**, with no exemption for read-only commands
[measured, reading `DENY_CATASTROPHIC` in the source].

**This blocked a read-only command of mine during the drafting of this very section.** The command
was `tail`, `wc`, `printf` and `grep` — no writes, no deletions, no network. It contained the
literal text `"truncate "` inside a quoted grep pattern. The hook returned:

```
PreToolUse:Bash hook error: sgnk-bash-guard CATASTROPHIC (always-block, mode-independent):
this Bash command matches the catastrophic subset (ref 62e2267c ...).
This class blocks regardless of SGNK_BASH_ENFORCE/WARN mode.
```

[measured, live, 2026-08-01, this session. I did **not** approve or bypass it — `/sgnk-approve` is a
human-only action and bypassing a safety hook is outside what a subagent may do.]

**Why this specifically disqualifies it for the MDMAX build.** An MDMAX build greps for
`truncate`, `substr`, `head -c`, `drop`, and `delete` constantly — those are the *names of the
defect classes the compiler exists to prevent*. Gate 3 above (§9.5) is literally about the
`head -c` / `substr` family. **A text-matching guard on a text-processing project produces a false
block on the exact searches the project is made of.** The guard is well-designed for AIOS, where
those words appear mostly in destructive SQL and shell. It is structurally wrong here.

**DECIDED — do not install `sgnk-bash-guard.sh` in the frontmatter repository.** What we take
instead is the *principle* behind it, which is Learned Rule #48: a textual prohibition in a prompt
is advisory, never the gate. §9.8 says what we use in its place — HEAD reconciliation, which
matches on git state rather than on English words.

#### 9.7.2 REFUSE: the bandit, the router, the calibration curve, the preference log, the judge panel

**DECIDED — none of the learning layer is imported.** The reason is not doubt; it is AIOS's own
master handoff, which states in its §4, headed *"THE STRUCTURAL FINDING — read this twice"*:

> **The reinforcement-learning loop cannot close. This is not a data-volume problem.**

Three facts, each verified there by execution [all primary,
`~/.claude/HANDOFF-aios-2026-08-01-MASTER.md` §4]:

1. **The escalation gate counts a tier that does not run.** `routing-bandit-decide.sh:155-156` sets
   `real_n` from **live sonnet observations only**, and escalation fires only at
   `real_n >= MIN_N`. Live traffic across **2,771 trace rows is 68.1% opus, 4.7% sonnet**. All four
   live arms are opus-only, so their `real_n` is 0 and stays 0. *A fabricated arm with 98 opus
   observations still returns `real_n=0`.*
2. **Even if it crossed, nothing would happen.** `sgnk-complexity-hook.sh` computes `_pick`
   (line 83), validates it (84), logs it (100) — and **never assigns it to anything**. All **75**
   decision rows are `decision_mode: advisory`. **The router records; it does not route.**
3. **The only live reward it ever received was wrong.** Four arms carry no `seeded` key and every one
   is a negative; they were written by a rejection path measured at **precision 0.000** and gated off
   **74 minutes 10 seconds later**. *The loop fired, and what it learned was wrong.*

The handoff's own instruction: ***"Say 'instrumented', never 'self-improving' or 'reinforcement
learning'."***

Alongside that, the measurement debt in §8.4 of the same document:

- **"No judge in this system has a measured Cohen's kappa against a human gold set."** Learned Rules
  #4 and #5 require kappa ≥ 0.7 before a judge is wired into anything. **None qualifies.**
- `sgnk-handover`'s judge has returned pass on **25 of 25 rows across 5 runs** and has never once
  produced a fail — **unproven that it can fail**, which is the same LR#68 defect as an unproven
  regression gate.
- **188 of 409 registry items grep source rather than execute it** — the largest block of unverified
  surface in the system.
- Calibration's first real result **fails its own bar and is inverted**: low bucket `n=14
  rate=0.000`, high bucket `n=23 rate=0.217` — high-confidence work is corrected a fifth of the time
  while low-confidence work is never corrected.

> **Contradiction, named.** The master handoff instructs *"Trust the registry file"* at line 42 and
> publishes **151 PASS / 188 PROXY / 69 VACUOUS / 1 FAIL of 409** at line 39. The verifier read the
> registry (`~/.claude/aios-site/testplan/test-registry.json`, 774,864 bytes, 409 items) and found
> `result` = `{PASS: 152, PARTIAL: 131, PROXY: 124, VACUOUS: 2}` and `result_prior` =
> `{None: 276, VACUOUS: 67, PROXY: 64, FAIL: 2}` [measured, `aios-transfer` verification, claim 7,
> verdict CONFIRMED]. The published figure is **a union over two fields that sums to 542 across 409
> items** — it double-counts every re-graded item and silently deletes the 131-item PARTIAL bucket.
> **The registry file governs. The published headline does not.** The 188 and 69 do reproduce
> exactly as a union, which is the sharper finding: the number is not wrong, its *shape* is
> undisclosed.

**What we take instead.** Nothing automated. The MDMAX build gets its quality signal from
deterministic verifiers — typecheck, lint, tests, gates, byte comparisons against a pinned corpus —
which is Learned Rule #25's ordering: *rules-based first, visual second, judge-panel only for
genuinely fuzzy criteria.* A compiler has almost no fuzzy criteria. **RECOMMENDED, deferred:** when
frontmatter reaches a point where prose quality or UI taste is being judged at volume, revisit this
— but only after establishing a human gold set and measuring kappa, in that order.

#### 9.7.3 REFUSE: the gate harness's own false-RED mode

The gate mechanism is worth importing (§9.3). **The AIOS harness around it is not**, because it has
a live, reproduced false-RED mode and no preflight.

The measurement, reproduced twice in the same minute [measured, `aios-transfer` verification,
claim 5, verdict **CONFIRMED**]:

| cwd | Result |
|---|---|
| `/Users/sagnikmitra/Desktop/GitHub/frontmatter` | `regression-gates: 21 PASS  0 FAIL` |
| `~/Desktop/GitHub` | `regression-gates: 17 PASS  4 FAIL` |
| `~/.sgnk` | `17 PASS  4 FAIL` |

Same commit. Same minute. The four failures are always the same gates —
`traces-no-split-rows`, `no-stale-rule-verdicts`, `skills-honour-frontmatter-contract`,
`calibration-has-a-sample` — and running their assertions directly prints
`assert-calibration-has-a-sample.sh: line 11: cannot create temp file for here document: Operation
not permitted`. `grep -c -iE 'preflight|here document' ~/.sgnk/bin/sgnk-regression-gate.sh` returns
**0**, while `full-loop-battery.sh` does have a preflight block with an `exit 2` path.

And the harness renders that denial as: **`FAIL <id> — the defect this gate was built for has
RETURNED`**. An environment problem is presented as a security regression.

**The mechanism is NOT what the record says it is, and this plan corrects it.** Learned Rule #65 and
the master handoff §11 both say *"Run everything from `~/Desktop/GitHub`."* A researcher then
published the opposite — *"that is the directory that FAILS"* — and **that correction was itself
graded REFUTED**. The decisive probes: `/` FAIL, `/usr` FAIL, `~` FAIL, `~/Desktop` FAIL, while
`frontmatter/src` and `frontmatter/docs/engine` both PASS. `/` and `/usr` are not protected
repositories, so "protected repo" cannot be the mechanism. **The actual variable is the session's
sandbox write-allowlist, which contains the session's own cwd, `$TMPDIR`, and `/tmp/claude*`: the
heredoc succeeds if and only if cwd is inside it.** Decisively, `full-loop-battery.sh:12-19` records
`cwd=~/Desktop/GitHub → heredoc OK → battery 67/0` on 2026-07-28 — the same directory passing, in a
session launched there.

The verifier's summary is the rule this plan adopts:

> *"LR#65 and this claim are the SAME error one session apart: both report their session's sandbox
> allowlist as a property of the filesystem. Publishing 'run from frontmatter' installs a second
> wrong rule for the next session launched elsewhere. Correct rule: heredocs work only when cwd is
> inside the session's write-allowlist; harnesses must PREFLIGHT and name `$(pwd)`, never a fixed
> directory."*

**DECIDED.** `specs/harness/gate.mjs` opens with a preflight: attempt one write into a temporary
directory and one into `$(pwd)`. On failure, **`exit 2` with `verdict: "infra"` and a message naming
`$(pwd)` and `$TMPDIR`** — never emit a FAIL. No fixed directory is named anywhere in our
documentation. And because we are writing it in Node (§9.4a), the heredoc pathway does not exist in
the first place, which is a second, independent reason the class disappears.

---

### 9.8 The build harness for a small team plus agents

Two founders and a variable number of agent sessions, for twelve months, on one compiler. Four
mechanisms, all imported from AIOS's operational record, all cheap.

#### (a) Worktree isolation with a staleness preflight

Parallel agents get git worktrees, one per branch. The repository already has two:

```
/Users/sagnikmitra/Desktop/GitHub/frontmatter                                          1bd4dad [engine/plan-and-diagnostics]
/Users/sagnikmitra/Desktop/GitHub/frontmatter/.claude/worktrees/competent-bassi-5da9a1 8eb4de2 [claude/competent-bassi-5da9a1]
/Users/sagnikmitra/Desktop/GitHub/frontmatter/.claude/worktrees/upbeat-euclid-60dbf4   8eb4de2 [claude/upbeat-euclid-60dbf4]
```

[measured, `git worktree list`, 2026-08-01]. **Both agent worktrees sit at `8eb4de2` while the main
tree is at `1bd4dad`.** That is the staleness hazard in one line: an agent dispatched into either
worktree today reasons about a tree several commits behind, and the `.md` files it reads — including
`docs/mdmax/PLAN.md`, which has 351 insertions and 350 deletions uncommitted in the main tree — are
not the ones the founders are editing.

**DECIDED.** Every parallel dispatch runs a staleness preflight: compare the worktree's HEAD to the
base branch's HEAD and **refuse to dispatch** if the worktree is behind, printing both SHAs. This is
cheap, deterministic, and catches the most common cause of "the agent's change doesn't apply".

#### (b) Capture `git rev-parse HEAD` before AND after every parallel run, and reconcile

**Learned Rule #48, quoted exactly:** *"Subagent/Workflow prompts forbidding `git commit` are NOT a
reliable control. Subagents committed despite an explicit RULE-4 'do not commit' GUARD in every
prompt (verified 2026-06-30, P1/P2 backlog session: 5 unauthored commits `b8fd9d1`/`2e7ded0`/
`ec0be22`/`7ace826`/`7f882d6` landed mid-run). Always capture `git rev-parse HEAD` before AND after
every Workflow and reconcile the delta; treat the prohibition as advisory, never as the gate."*

The rule adds: *"Damage was nil only because `~/.claude` has no remote (local, reversible) — do not
rely on that."* **frontmatter has a remote.**

This is not a historical curiosity. AIOS's own live doctor reports **HEAD moved during a subagent
run in 13 of 253 sessions** [primary, `HANDOFF-aios-2026-08-01-MASTER.md` §7, listed as a true
signal, not noise]. That is a 5.1% rate on a system whose operator has been actively fighting it for
five weeks.

**DECIDED.** The dispatch wrapper records `git rev-parse HEAD` before and after, and any unattributed
delta **stops the run and reports**. This replaces the bash guard (§9.7.1) as our enforcement layer,
and it is strictly better for this project: it matches on git state, not on English words, so it
cannot false-block a grep for `truncate`.

#### (c) Parallel branches only over disjoint, explicitly-named artifacts

**Learned Rule #20:** *"Any `parallel()` branch in the Workflow tool must operate on disjoint,
explicitly-specified artifacts — never on the same creative target with implicit style or
architecture decisions."* **Learned Rule #21:** *"Any subagent is read/advisory by default. Write
authority requires the full trace, not a task summary."*

For a compiler, "disjoint artifact" means **one agent per module boundary, never two agents on one
file.** The repository's boundaries already exist: `src/modules/` contains **12 modules**
[measured] — `ai`, `ai-tools`, `app-shell`, `auth`, `drafts`, `editor`, `export`, `graph`,
`preview`, `repository`, `share`, `vault` — each with `domain` / `application` / `infrastructure` /
`presentation` subdirectories, and `npm run arch` (`specs/harness/clean-architecture-report.mjs`)
already enforces the import boundaries between them.

The MDMAX compiler adds four new boundaries. **DECIDED** — these are the parallelization units, and
a parallel dispatch may name at most one:

| Unit | Owns | Never touched by another parallel agent |
|---|---|---|
| **parser** | source text → block sequence | the anchor scheme, the writer |
| **anchor resolver** | block identity, `resolve()`, refusal semantics | the writer's byte accounting |
| **splice writer** | byte-exact application of edits | the parser's tokenization |
| **degradation matrix** | what each downstream renderer does to each construct | all three of the above |

If two units must change together, that is **one agent doing both, sequentially** — not two agents
coordinating. Cognition's finding behind LR#20 is that implicit coordination between parallel agents
on one creative target produces incoherent output more reliably than it produces speed.

#### (d) Adversarial review as a GATE, not a report

This is §9.3.4 applied to the build rather than to the research. **DECIDED:** an adversarial review
that returns findings **blocks the merge** until each finding is either fixed or explicitly
dismissed with a recorded reason. A review whose output is appended to a document and then ignored
is the reporter-not-gate pattern, and we have a measured 100% headline defect rate showing what that
produces.

Two supporting rules: **Learned Rule #9** — *"For code review, use fresh context. No contamination
from the authoring session"* — and **Learned Rule #60** — *"A verifier written in the same session as
the fixes it checks inherits that session's blind spots."* LR#60 was earned when a verifier reported
**43 pass / 0 fail** and an independent adversarial re-audit then found **34 confirmed defects
(9 critical) in the fixes it had just certified**, including a `grep -qE '0 FAIL'` that matches
inside the string `10 FAIL` — the exact substring-versus-boundary bug that same session had been
fixing all day.

---

### 9.9 The research-to-build boundary

**DECIDED. Nothing enters the backlog on a headline.**

This is the single most important process rule in this section, because the research corpus this
plan is built on has a measured 100% headline defect rate in one run and 10 of 16 OVERSTATED in the
other. Headlines in this corpus are, empirically, marketing for their own findings.

**A backlog item is admissible only if it carries all four fields:**

```jsonc
{
  "claim": "the exact sentence being built against, quoted, not paraphrased",
  "corpus_id": "sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4",
  "reproduce": "the exact command that regenerates the number",
  "verdict": "CONFIRMED | OVERSTATED | REFUTED | UNVERIFIED",
  "corrected_claim": "required whenever verdict != CONFIRMED — the narrowed claim that survived"
}
```

Rules of admission:

1. **`verdict: REFUTED` is inadmissible.** It does not go in the backlog with a warning; it does not
   go in the backlog.
2. **`verdict: OVERSTATED` is admissible only as its `corrected_claim`.** Example from this very
   section: *"markdown is the file type agents fail to edit MOST"* is inadmissible; its narrowed
   survivor — *"markdown carries the largest ABSOLUTE volume of agent edit errors (40) and leads
   every extension on anchor-not-found (14, 1.31% of 1,066 attempts)"* — is admissible.
3. **A figure with no `corpus_id` is `UNVERIFIED` by default.** Seven irreproducible corpus counts
   were published before the corpus was pinned. The live demonstration of why: the splice figure
   *"0 of 51 files"* at `docs/engine/PLAN.md:170` cannot be reproduced today, because
   `git ls-files '*.md' | wc -l` returns **57** [measured, 2026-08-01].
4. **A number produced by replaying data through modified code is labelled SIMULATED**, per Learned
   Rule #62. The rule was earned when a reward-gate improvement was reported as "1 → 80" — a sandbox
   replay of code that had at that moment executed in **zero** live runs, while live state said
   1 → 1.
5. **A "verified" claim must name the verifier's verdict**, per Learned Rule #5. And per the corpus's
   own measured **0–19% false-kill rate**, a kill is strong evidence, not proof — if a kill looks
   wrong to you, say so in writing and re-run it rather than silently discarding it.

**A worked, live example of why field 3 exists.** The `aios-transfer` verifier cites
`docs/mdmax/PLAN.md:119` for the string *"0 of 51 files in this repo survive it byte-identically."*
Today, line 119 of that file reads *"forum thread asking to export a vault to a single file: **9,010
views, 1 like, 3 posts in 26"* and the actual claim lives at `docs/engine/PLAN.md:170` [measured].
**The citation rotted within hours**, because the file has 351 uncommitted insertions and 350
deletions. A line number into a mutable markdown file is not a citation. This is, incidentally, the
strongest available argument for MDMAX's differential reference invariant — and it is not a
prediction, it happened while this section was being written.

---

### 9.10 What MDMAX gives back to AIOS, measured

Three things. All narrow. None of them is "AIOS becomes better at markdown."

#### (a) The skill-catalogue budget problem, and the drift it has already produced

AIOS loads a description for every skill into **every session's context**, always, while each
skill's body is read only when that skill fires. The measurement:

| Quantity | Bytes | Source |
|---|---:|---|
| All 119 `SKILL.md` bodies | **3,295,299** | [measured] `find ~/.claude/skills-src -name SKILL.md \| xargs stat` |
| Always-loaded descriptions (canonical figure) | **~81,754** | brief's pinned measurement |
| `description:` fields alone (re-measured) | 78,491 | [measured] YAML frontmatter parse, 119 files |
| `name:` + `description:` (re-measured) | 80,247 | [measured] |
| Full YAML frontmatter blocks (re-measured) | 99,638 | [measured] |

3,295,299 ÷ 81,754 = **40.31x**. My re-measurements bracket the canonical figure: `name` +
`description` gives 41.06x, the full frontmatter gives 33.07x. **Quote the ratio as "roughly 40x,
bracketed 33–42x depending on what counts as 'the description'"** — the ambiguity is itself the
finding, because there is no schema saying which bytes are the always-loaded ones.

**This is a hand-maintained budgeted projection, and it has already drifted in a documented way.**
The `sgnk-complexity-gate` description reads, verbatim:

> *"…the filter that keeps work off the heavy orchestration stack unless it earns it (target
> restated 2026-07-28 from the stale "blocks 30-50%" figure: measured live at 90% floor / 10% strong,
> with 29% floor-AND-guarded — cheap model plus verifier is the design, so the honest metric is the
> guarded fraction, not the floor rate)."*

[primary, `~/.claude/skills-src/plan/sgnk-complexity-gate/SKILL.md:3`]. **A correction note about a
stale number is now permanently inlined into the always-loaded context of every session**, because
there is no mechanism to keep a description and its body in sync — so the fix had to be written where
the reader would see it, at a permanent cost to the context budget. The body of that same file
(23,569 bytes) no longer contains the 30–50% figure at all [measured, `grep`].

**The MDMAX-shaped answer.** A description and a body are two views of one document; keeping them
consistent is a **reference invariant**, exactly the differential check MDMAX's compiler is built
around. **RECOMMENDED, not decided:** once MDMAX can compute "which named references in document A
still resolve into document B", run it over `skills-src/` as a validation corpus. This is a
recommendation because it is a genuine test with a real, currently-failing case — not because AIOS
needs an editor.

**A second, sharper instance of the same class, found while writing this.** The master handoff's
substrate line publishes **"70 Learned Rules"**. Measured: `~/.claude/CLAUDE.md` contains **68
distinct Learned Rule numbers**, and the raw pattern `^[0-9]\+\. \*\*` matches **70** times because
rules **1 and 2 each match twice** — RULE 8's two-item explanatory list has the same shape as a
Learned Rule [measured, `grep -o ... | sort -n | uniq -c`]. **The published count is a grep artifact
that over-counts by two.** This is precisely a structural-versus-textual question — a markdown
compiler that understood list structure would count 68 — and it is the cleanest available
demonstration of what MDMAX offers a document system: *counting by structure instead of by regex*.
**This plan uses 68.**

#### (b) The writer-truncation defect class, which the splice writer prevents by construction

Learned Rule #68 records a bug in AIOS's own markdown-writing pipeline: `awk substr` and `cut -c`
split multi-byte characters, producing artifacts that cannot be decoded. It fires in **~0.34% of
artifacts (3 of 880)** [primary, `~/.claude/CLAUDE.md` line 744].

**That is exactly Gate 3's defect class (§9.5).** A splice writer that (i) operates on byte ranges
computed from a codepoint-aware tokenizer and (ii) asserts `bytesWritten === bytesRequested` cannot
produce it. This is a genuine give-back and it is measurable: after MDMAX's writer exists, re-run
AIOS's snapshot pipeline through it and assert zero undecodable artifacts across the full 880.

**Caveat, and it is the LR#68 caveat.** At a 0.34% base rate, a clean run over 880 artifacts is
**not** evidence. LR#68's own record: the fix passed a live end-to-end run and a differential over
120 artifacts with **0 failures under both the old and the new code**. Proof required reconstructing
the failing input from the corrupt artifact. **Any give-back claim here must include a constructed
straddling case, or it is not a claim.**

#### (c) What MDMAX does NOT give AIOS

State this explicitly so no one builds it. MDMAX does not improve AIOS's trace ledger, router,
bandit, calibration curve, preference log, eval harness, drift stamps, or hooks — **all JSONL**
(§9.2). It does not fix the structural finding in §9.4 of the master handoff. It does not produce a
Cohen's kappa for any judge. It does not reduce the 188 PROXY items. **If someone proposes AIOS work
justified by MDMAX, check whether the artifact in question is `.md`. 6.5% of the gate scripts are.**

---

### 9.11 The Learned Rules that apply directly to this build

All from `~/.claude/CLAUDE.md`, cited by number.

| # | The rule, compressed | Where it binds in this build |
|---:|---|---|
| **#4** | Eval scoring is binary pass/fail plus critique, never Likert; a judge needs Cohen's kappa ≥ 0.7 against a 200-sample human gold set before being wired in | §9.7.2 — no judge qualifies, so no judge is wired |
| **#5** | Any LLM-as-judge result must cite its judge's alignment numbers, else mark unverified | §9.9 rule 5 |
| **#7** | After two failed corrections in a row, `/clear` and start fresh — stale context costs more than restart | Agent sessions on the compiler |
| **#8** | Reviewers flag correctness and contract gaps, not style | §9.8(d) |
| **#9** | Code review uses fresh context, no contamination from the authoring session | §9.8(d) |
| **#12** | Reasoning budget is orthogonal to model choice — raise effort before upgrading the model | Agent dispatch on hard compiler tasks |
| **#20** | Parallel branches operate on disjoint, explicitly-specified artifacts | §9.8(c) — one agent per module boundary |
| **#21** | Subagents are read/advisory by default; write authority needs the full trace | §9.8(c) |
| **#22** | A long-running agent's default output is a first-draft PROPOSAL, not an executed mutation | §9.8(b)(c) |
| **#25** | Cheapest applicable verifier wins: rules-based → visual → judge panel | §9.6 ladder ordering |
| **#29** | Termination is harness-owned via barriers and critics — never delegate the stop decision to the model | §9.6 — the ladder, not the agent, decides done |
| **#42** | AI-generated eval cases are quarantined as `source:synthetic` until human-reviewed | Any generated gate fixture |
| **#48** | A prompt-level "do not commit" is advisory, never the gate; capture HEAD before and after and reconcile | §9.8(b) — five unauthored commits |
| **#55** | Under `set -e`, a trailing `[ cond ] && cmd` returns 1 and kills the caller | §9.4(a) — deleted by writing in Node |
| **#56** | A backgrounded process inside `$( )` must redirect its own stdout or the substitution blocks for the full timeout | §9.6 — the timeout rung's own historical bug |
| **#59** | A field-name mismatch between producer and consumer is this workspace's most expensive recurring bug class; a missing key is UNKNOWN, never a falsy default | §9.4(b) — gate rows and verify rows must be read with `get(x, get(y))` semantics |
| **#60** | A verifier written in the same session as its subject inherits that session's blind spots; a check that greps source is a PROXY and must be labelled one | §9.3.3, §9.8(d) |
| **#61** | Preview the match count before any filter that deletes rows | Any corpus-pruning step |
| **#62** | If a number came from replaying data through code rather than from live files, write SIMULATED | §9.9 rule 4 |
| **#63** | A check asserting one fixed answer must pin every stochastic input; a stochastic check asserts a distribution over a seed sweep. Run a battery three times before quoting it | §9.5 — assert floors, not equalities |
| **#64** | `bash -n` every bash script; zsh parses differently and both pass while the script is broken for real callers | §9.4(a) |
| **#65** | A harness whose result depends on where you ran it reports your location, not the system's health. Preflight | §9.4(b), §9.7.3 |
| **#66** | Run every harness assertion under both bash and zsh; false REDs are the expensive direction | §9.4(a) |
| **#67** | A tool that writes must verify the write landed before reporting success | §9.3.2 exit code 5 |
| **#68** | A test whose subject is a rare fault proves nothing until it reproduces the fault | §9.5 — `--broke` first, always |

Plus the standing zero-tolerance rules that bind agent work on this repository: **RULE 1** (verify
every factual claim through a tool, not memory), **RULE 2** (per-operation approval for anything
destructive — including `git push --force`, `db push`, and any outbound message), **RULE 3**
(pre-op backup before any destructive database operation), **RULE 4** (no subagent executes a
RULE 2 operation on its own; it returns a proposal and stops), **RULE 5** (distinguish "I believe"
from "I verified"), **RULE 6** (show the arithmetic for any number that matters).

---

### 9.12 What this section does not cover, and what would falsify it

**Not covered.**

- **Any claim that AIOS makes agents better at writing markdown.** Zero live model calls were made
  in any research run. The one measurement that pointed that way was **REFUTED** (§9.0). If you want
  that claim, it needs a live A/B with model calls, and nobody has run one.
- **Merging AIOS and MDMAX as products.** D5 stands. This section is about the build process.
- **AIOS's security posture.** The master handoff's §8.1.2 records **25 credentials inventoried
  2026-07-28 and still unrotated on day 35** — 7 GitHub `ghp_`, 1 `github_pat_`, 5 Supabase `sbp_`,
  1 OpenRouter, 1 Anthropic, 10 HS256 JWTs — described there as *"Highest severity item in the
  system."* That is an AIOS operational task, not an MDMAX build task, and it is named here only so
  it is not lost.
- **The `sgnk-*` skill layer.** 119 skills, none of them needed to build a markdown compiler. The
  build uses `npm run verify` and `node specs/harness/gate.mjs`.
- **Cost.** No token or dollar figure for agent-assisted compiler work appears in any source read
  for this section. Anyone quoting one is inventing it.

**What would falsify this section.**

1. **The gate mechanism proves unmaintainable.** If, after twelve weeks, fewer than ten gates are
   registered, or more than a third of `--verify-all` runs return INCONCLUSIVE from rotted repro
   anchors, then the mechanism costs more than it saves. Replace with ordinary tests plus a quarterly
   manual mutation-testing pass.
2. **The Node port reintroduces its own false-RED class.** If `specs/harness/gate.mjs` produces a
   result that varies with cwd, environment, or Node version *despite* the `env` fingerprint, then
   §9.4's claim — that the false-RED class is a bash artifact — is wrong, and the class is something
   deeper about the sandbox that a language change cannot fix.
3. **HEAD reconciliation does not catch unauthorized commits.** If an agent commits and the
   before/after `rev-parse` comparison misses it (an amended commit, a rewritten branch, a commit in
   a worktree the wrapper does not watch), then §9.8(b) is theatre and needs a `reflog`-based check
   instead.
4. **The 0.000% false-match invariant in Gate 2 cannot be achieved.** The 99.627% / 0.050% figures
   have been re-derived by nobody. If the shipped resolver cannot reach a hard zero on false matches
   over the 32,919 block-versions, Gate 2's assertion must be rewritten as a floor with a stated
   tolerance, and the "safety property, not performance number" framing in §9.5 collapses.
5. **The give-back to AIOS turns out to be nil.** If running MDMAX's reference checker over
   `skills-src/` finds no real inconsistency beyond the one already-documented drift, then §9.10(a)
   is a single anecdote and should be dropped rather than repeated.

**The one-line honest summary.** From thirty-five days of AIOS we take **one mechanism** — a gate
that refuses to exist until it has been proven capable of failing — plus **one rule** (a timeout is
infrastructure, never a failure), plus **four operational habits** (worktree staleness preflight,
HEAD reconciliation, disjoint-artifact parallelism, adversarial review as a gate). We refuse the
learning stack because its own author's measurement says it does not learn, the bash guard because
it false-blocks the searches this project is made of, and the gate harness's environment handling
because it is measurably wrong in both directions. In return MDMAX offers AIOS one narrow defect
class it can eliminate and one budget problem it can make visible. **Everything else in AIOS is
JSONL, and MDMAX does not touch JSONL.**


---

---

### Links

**This section references:** [§0 Status](00-status.md) · [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§4 Representation](04-representation.md) · [§7 Product](07-product.md) · [§8 Market](08-market.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md)

**Referenced by:** [§0 Status](00-status.md) · [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§7 Product](07-product.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
