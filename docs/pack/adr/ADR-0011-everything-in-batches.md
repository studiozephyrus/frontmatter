---
id: ADR-0011-everything-in-batches
title: Build everything, one batch at a time, each used internally before the next
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0011]
---

# ADR-0011. Build everything, one batch at a time, each used internally before the next

**Decision id:** ADR-0011. **Open decision closed:** D02 in `56-OPEN-DECISIONS.md`. **Decided:**
18 September 2026 `[Z]`. **Roadmap commit:** `f3569a9`, 18 September.

## Context

- The plan's default, `docs/mvp0/PRODUCT-PLAN.md` section 26, built phases 0, A, B, D and H, and left
  E, F and G in Later.
- `56-OPEN-DECISIONS.md` section 2 pointed out that phase C, the blueprint funnel, was not in that
  default at all.
- The old spine let several phases run in parallel after phase B.

## Decision

- **Every phase is built**, including the ones the default left in Later, and phase C with them.
- **One batch at a time.** A batch is built, used and tested internally, its issues fixed, and only
  then does the next start.

## Evidence

- `56-OPEN-DECISIONS.md` section 0, D02, records the answer, `[Z]`.
- `50-ROADMAP.md` section 2 turns it into twelve batches, run strictly in sequence, with the pilot
  between batch 5 and batch 6.
- `50-ROADMAP.md` section 3.0 is the gate every batch from 2 onward shares:

Check | How it is run
The build is green | `npm run verify`
The contract gate is clean | `npm run spec` reports 0 errors
The engine has not moved a byte | `npm run corpus` exits 0
The batch's criteria pass | Every criterion named for the batch passes, or is marked not yet checkable
No serious defect is open | Zero `CRITICAL` and zero `HIGH` against the batch
The founders used it | Both founders did real work in the batch for the use window

## What it costs

`50-ROADMAP.md` section 5.4 re-derives the calendar:

```
build, low:  (120 + 20) days  / 1.21 = 115.7 weeks
build, high: (135 + 34.5) days / 0.93 = 182.3 weeks
use windows: 8 batches (2 to 9) x 1 week = 8 weeks
the pilot:   at least 2 weeks
total:       125.7 to 192.3 weeks
```

- So the nine priced batches take about **126 to 192 calendar weeks**, roughly 2.4 to 3.7 years.
- The old default was about 60 to 79 calendar weeks, per `50-ROADMAP.md` section 1.
- **It is a floor.** Batches 10, 11 and 12 have no appetite, and about thirty days of content
  writing sit on top.

## Alternatives rejected and why

Alternative | Why rejected
The default, five phases | Leaves phase C unbuilt, so Phase 0's twenty-kit gate has nothing downstream to gate
Everything, in parallel phases | The founders chose one batch at a time, each used before the next
Everything, without the internal use step | The founders asked for each batch to be used and fixed first. `INFERENCE:` otherwise defects found late span several batches

## Consequences

- `50-ROADMAP.md` section 2.1 records each ordering choice. The change queue comes before ideas, and
  import comes before the pilot, because the pilot's scripted step 2 is importing a vault.
- Live editing is built, not deferred. Plan question 8 now decides only when.
- Each extra week of use window adds eight calendar weeks across batches 2 to 9.
- `INFERENCE:` the use window of one week per batch is the roadmap's proposal, not the plan's. The
  founder can change it.

## What would reverse it

- The calendar becoming unaffordable. The founder could then return some batches to Later, which
  would be a new decision, recorded as a new ADR that supersedes this one.
- `50-ROADMAP.md` section 7 lists what would change the order within this decision.

## Limits of this record

- The pace figures, 1.21 and 0.93, are the roadmap's, not re-measured here.
- The 18 September additions to each batch are appetites, a budget set rather than measured.
  `50-ROADMAP.md` section 2 now says so and points at its section 5.2; it no longer tags them
  unverified (`grep -c UNVERIFIED docs/pack/50-ROADMAP.md` returned 0 on 18 September). There is
  nothing to verify until a batch is built.
