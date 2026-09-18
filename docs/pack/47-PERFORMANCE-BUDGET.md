---
id: 47-PERFORMANCE-BUDGET
title: Performance budget
mode: reference
tier: canonical
status: living
verified_against: f237ece
updated: 2026-09-18
owner: sagnik
covers: [performance-budget]
---

# 47. Performance budget

Every budget, the command that measures it, and the gate that enforces it. Where there is no command
or no gate, the cell says so, because a budget nobody measures is a wish.

## 1. How to read a row

Column | Meaning
**Budget** | The number. One number, not a range
**Source** | Where the number comes from. `plan` means `docs/mvp0/PRODUCT-PLAN.md` section 21, with its line
**Measure** | The exact command, or `none` when there is not one
**Gate** | What fails when the budget is missed, or `none`
**State** | `enforced`, `measured`, or `unmeasured`

**`unmeasured` is the honest state for most of this file.** Fourteen budgets, **one enforced**, and
that one is inside a module nothing calls. Section 8 says what to build first.

## 2. The register

Id | Budget | Source | Measure | Gate | State
`PB-01` | Keystroke echo under 100 ms | plan `:1527` | none | none | unmeasured
`PB-02` | AI request acknowledged under 1 s, first token under 3 s | plan `:1528` | none | none | unmeasured
`PB-03` | A blueprint shows progress past 10 s and finishes under 3 min at Low depth | plan `:1529` | none | none | unmeasured
`PB-04` | Save under 500 ms to the server on a fourth-generation mobile connection | plan `:1530` | none | none | unmeasured
`PB-05` | Drive sync within five minutes | plan `:1531` | none | none | unmeasured
`PB-06` | Largest contentful paint under 2.5 s at the 75th percentile, interaction to next paint under 200 ms, layout shift under 0.1 | plan `:1532` | none | none | unmeasured
`PB-07` | A 10 MB document opens under 3 s, keystroke under 100 ms | plan `:1533` | none | none | unmeasured
`PB-08` | 2,000 files import under two minutes, byte-exact | plan `:1534` | `npm run corpus` covers the byte-exact half only | corpus exits 1 on drift | partly enforced
`PB-09` | **250 KB of JavaScript on the editor's first load** | plan `:1535` | `npm run budget`, **which is an echo** | **none** | unmeasured
`PB-10` | 99.5 percent availability a month | plan `:1536` | none | none | unmeasured
`PB-11` | A Durable Object round trip from Mumbai; over 250 ms is a finding | plan `:1537` | none | none | unmeasured
`PB-12` | Engine input under 4 MB, 200,000 lines, 20,000 list-marker lines | `src/modules/mdmax/domain/shape-gate.ts:23` to `:25` | `decodeStrict`, in code | **refuses the input** | **enforced** |
`PB-13` | Engine time: keystroke 250 ms, cold open 2,000 ms, batch 10,000 ms | `src/modules/mdmax/domain/shape-gate.ts:28` | none | **declared, not enforced** | unmeasured
`PB-14` | The test suite stays fast enough to run before a commit | this file | `npm run test` | none | measured

## 3. The one budget that is enforced, and the one beside it that is not

`src/modules/mdmax/domain/shape-gate.ts` is the only place in the repository where a performance limit
refuses work rather than being aspired to.

```
export const MAX_BYTES = 4 * 1024 * 1024
export const MAX_LINES = 200_000
export const MAX_LIST_MARKER_LINES = 20_000
```

A document over any of these is refused with a named reason, one of `BUDGET_BYTES`, `BUDGET_LINES` or
`BUDGET_BLOCKS`. That is the right shape: a budget that returns a refusal a caller can show.

**The time budget beside it is a declaration and not a gate**, and the source says so at
`src/modules/mdmax/domain/shape-gate.ts:27`:

```
/** Time budgets, enforced by the caller via `worker.terminate()`. Not enforced here. */
```

The three values are 250 ms for a keystroke, 2,000 ms for a cold open and 10,000 ms for a batch.
**No caller terminates a worker.** The module's own function is imported twice from outside, per
`44-TECH-DEBT-REGISTER.md` `TD-003`, and neither call site runs it in a worker.

**Two notes on the numbers themselves.** The keystroke budget here is 250 ms and the plan's is 100 ms
at `docs/mvp0/PRODUCT-PLAN.md` section 21. They measure different things, the engine against the whole
round trip, and having the inner budget be two and a half times the outer one is a contradiction
somebody should resolve deliberately.

## 4. `PB-09`, the bundle budget, specified

`npm run budget` is a single `echo` of a placeholder string. The string is not reproduced here,
because it contains an em dash and `65-CONVENTIONS.md` section 8 forbids one anywhere in this pack.
Read it with:

```bash
python3 -c "import json;print(json.load(open('package.json'))['scripts']['budget'])"
```

It always exits 0. This section says what it should do instead. It is the one budget the plan already
committed to measuring in continuous integration.

### 4.1 What it should measure

**Not the whole build.** The number that matters is the JavaScript a browser must download, parse and
run before the editor is usable on a first visit, with an empty cache.

Entry | Budget | Why this number
The editor route's first load, compressed | **250 KB** | The plan's figure, `docs/mvp0/PRODUCT-PLAN.md` section 21
The published page's first load, compressed | **100 KB** | It is a read-only render with no editor. Proposed here, not in the plan. **INFERENCE**
The sign-in route's first load, compressed | **100 KB** | A person who has not signed in should not download an editor. Proposed here. **INFERENCE**
Any single chunk, compressed | **300 KB** | A chunk larger than the whole editor budget is a packaging mistake. Proposed here. **INFERENCE**

**Three of the four numbers are proposed by this file and are not founder decisions.** They are marked
so they can be argued with.

### 4.2 What it should do, step by step

1. **Read the build's own manifest** rather than measuring the directory. Next writes the per-route
   first-load set; use that, so the number means what the plan means.
2. **Measure compressed bytes**, with the compression a browser would receive, not the bytes on disk.
   An uncompressed number is roughly three times the real one and will make every budget look broken.
3. **Compare against a committed baseline file**, one line per entry, so the failure message can say
   what grew and by how much.
4. **Exit 1 when an entry is over budget**, and exit 1 when an entry grows by more than 10 percent
   even while under budget, because that is the change worth looking at.
5. **Print the table either way.** A gate that prints nothing on success teaches nobody anything.
6. **Write the measured numbers to a file the build keeps**, so a trend exists.

### 4.3 What it must not do

- **Never measure `.next/` with `du`.** That directory holds the server build, source maps and cache,
  and none of it reaches a browser.
- **Never let a missing manifest pass.** A build that did not run must fail the gate, not skip it.
  That is the fault the current echo has.
- **Never set the baseline from the first run without a person looking at it.** A baseline recorded
  from a bad build makes the bad build the standard.

### 4.4 What the current build suggests, with its caveat

A build output exists at `.next/`. **It is dated 14 September, four days before this file, so every
number from it is stale and is reported as a signal rather than as a measurement.**

Measured | Value
Date of the build | 14 September 2026
Total `.next/static` on disk, uncompressed | 14 MB
Largest single JavaScript chunk, uncompressed | **2,540 KB**
Dependencies in `package.json` | 47

**The largest chunk alone is about ten times the whole first-load budget, uncompressed.** Whether it
is on the editor's first load is not established, and several dependencies are the kind that should be
loaded on demand rather than up front: the diagram renderer, the force-directed graph, the maths
typesetter and the code highlighter. Four of the 47 dependencies are model-provider clients, which
belong on the server and should not appear in a browser bundle at all.

**None of that is a finding yet.** It is the reason `PB-09` is worth building first.

## 5. Latency budgets, and how to make them measurable

`PB-01` to `PB-07` are all about what a person feels, and none has a command. They fall into two
groups, and the groups need different machinery.

### 5.1 The ones a synthetic run can measure

Budget | How
`PB-06`, the web vitals | A Lighthouse run against a deployed preview, on a throttled mobile profile, in continuous integration. The plan's figures are already the standard thresholds
`PB-07`, a 10 MB document | A fixture document of exactly 10 MB, opened in a driven browser, with the time from navigation to first keystroke recorded
`PB-01`, keystroke echo | The same driven browser, typing into that fixture, measuring the delay to the character appearing

**All three need a browser harness that does not exist.** `45-UX-AUDIT.md` records the same gap from
the other side: the screen renderer never looks at what it rendered.

### 5.2 The ones only real use can measure

Budget | Why a synthetic run will not do
`PB-02`, AI acknowledgement and first token | It depends on which provider answered and what its queue looked like. A synthetic number is a number about one moment
`PB-03`, a blueprint | Fifteen model calls against a shared free pool. The plan's own section 14 notes one provider makes a blueprint a fourteen-minute job
`PB-04`, save latency on mobile | Depends on the person's connection
`PB-05`, Drive sync | Depends on a third party
`PB-10`, availability | Only time measures this
`PB-11`, the Mumbai round trip | The plan already says measured in the pilot

**So these need the instrumentation, not a test.** Each one is a timing recorded on a real request and
reported at a percentile. **That instrumentation does not exist**, and it is the same absent thing that
`42-SECURITY-REVIEW.md` `SEC-006` records as a missing audit log. **One mechanism serves both**, which
is the argument for building it before either.

**Record percentiles, never averages.** An average hides the slow tail, and the slow tail is the
experience somebody complains about. The plan already says the 75th percentile for `PB-06`; use the
50th, 75th and 95th everywhere.

## 6. `PB-14`, the one budget already being met

The suite has to be fast enough that a person runs it before a commit. Measured 2026-09-18 with
`npm run test`, the reported duration line:

```
   Duration  5.00s (transform 4.83s, setup 10.20s, import 17.20s, tests 9.44s, environment 14.47s)
```

Five seconds wall clock over 100 test files and 1,604 tests.

**A budget worth writing down: 30 seconds.** Past that a person starts skipping it, and a gate people
skip is not a gate. There is no enforcement, and enforcing it would be counterproductive, because a
slow suite is a symptom to look at rather than a build to fail. **Watch the number and act when it
doubles.**

## 7. Query and cold-start budgets

**`PB-12` is the only query-shaped budget that exists, and the product has no database.**

The plan's data model describes a records store and `42-SECURITY-REVIEW.md` `SEC-012` records that
nothing in the code reads or writes one. So there is no query to budget. Everything the application
reads comes from the GitHub contents API, which is a third party with its own latency and its own rate
limit.

**That makes the real budget an upstream-call budget**, and nobody has written one. Three proposals,
all `INFERENCE`, all to be argued with:

Proposed budget | Value | Why
Upstream calls per page load | at most 3 | Beyond that the page's latency is the third party's variance, not ours
A vault snapshot, cached | at most 1 archive fetch a minute | The cache already exists in the container
Cold start of a serverless function | under 1 s at the 95th percentile | Below the plan's own acknowledgement budget, `PB-02`, so the function is never the reason a request feels slow

**On cold starts specifically.** `src/app/api/export/pdf/[...path]/route.ts` launches headless
Chromium, which is the slowest cold start in the application by a wide margin, and it waits a further
two seconds for a diagram script. It carries `maxDuration = 60`. Four other routes carry no
`maxDuration` at all, listed in `42-SECURITY-REVIEW.md` `SEC-021`.

## 8. What to build, in order

Order | Build | Unblocks
1 | **The timing instrumentation**, one record per request with a correlation id | `PB-02`, `PB-04`, `PB-10`, `PB-11`, and the audit log in `42-SECURITY-REVIEW.md` `SEC-006`
2 | **`PB-09`, the real bundle budget**, per section 4 | The only budget the plan already committed to enforcing
3 | **A browser harness**, driven, against a deployed preview | `PB-01`, `PB-06`, `PB-07`, and the visual checks `45-UX-AUDIT.md` needs
4 | **A `maxDuration` on every route** | Bounds the worst case before anything measures the typical one
5 | **The engine's time budget, actually enforced** in a worker with a terminate | `PB-13`, which is declared today and does nothing
6 | **The upstream-call budget**, per section 7 | Turns a third party's latency into a number we own

**Steps 1 and 2 are the whole of the near-term work.** Everything else waits on one of them.

## 9. Limits of this file

**What was not assessed.**

- **Nothing was profiled.** No flame graph, no trace, no render measurement, no memory profile. There
  is no statement anywhere in this file about where time is actually spent.
- **`npm run build` was not run in this session**, so the bundle figures in section 4.4 come from a
  four-day-old artefact and are labelled as such.
- **No deployed environment was measured.** No Lighthouse run, no field data, no real user timing.
  Every latency budget is a target with no observation beside it.
- **Database and cache behaviour**, because there is no database. If one lands, section 7 is the
  section that has to be rewritten rather than extended.
- **The desktop build.** `src-tauri/` was not opened, and a desktop shell has a different cold start,
  a different storage path and no network budget at all.
- **Cost as a budget.** The plan's section 14 has the model economics. Money is not treated as a
  performance budget here, and arguably should be, because a rate limit and a spend limit are the same
  control seen twice.

**What could not be verified.**

- **Whether the 2,540 KB chunk is on the editor's first load.** It is the largest chunk in a stale
  build. That is all this file claims.
- **Whether any latency budget is currently met.** None was measured. A reader should assume nothing
  either way.
- **Whether `PB-12` fires in practice.** The limits are in code and the refusal path is tested. Whether
  a real document ever reaches them is unknown.

**What would falsify this file.**

- A fresh `npm run build` producing a per-route first-load figure, which replaces every number in
  section 4.4 and should.
- `npm run budget` doing anything other than echoing, which moves `PB-09` out of `unmeasured`.
- A caller of `decodeStrict` running it in a worker with a terminate, which moves `PB-13`.
- Any plan line in section 2 moving, which means the plan was revised and every `Source` cell should
  be re-checked. The plan moved twice during the session that wrote this pack.
