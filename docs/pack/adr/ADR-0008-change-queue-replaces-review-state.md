---
id: ADR-0008-change-queue-replaces-review-state
title: The change queue replaces review state
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0008]
---

# ADR-0008. The change queue replaces review state

**Decision id:** ADR-0008. **Decided:** 17 September 2026 `[Z]`, following the product reset of
13 September. **Recorded in `CLAUDE.md`:** commit `aee49d4`, 17 September 2026. **Recorded here:**
18 September 2026.

## Context

- The 9 September plan's headline was review state: a per-span read state kept in a sidecar,
  `.frontmatter/review.jsonl`, so an owner could see which parts of a file nobody had read.
- Agents now write much of what lands in a repository. The owner needs a way to see each change
  before it becomes the file, not a mark saying who has read what afterwards.

## Decision

- **Every change enters a queue.** A person's edit, an AI edit and an agent's edit alike become an
  item the owner accepts or rejects, one by one, on screen S20.
- **No silent merge, ever.** A merge the product proposes is itself a queue item.
- **The review-state sidecar is dropped.** Attribution survives as a mark in the version record.

## Evidence

Every citation below was opened with `sed -n` on 18 September 2026.

- `CLAUDE.md:24` to line 29 records the change queue as load-bearing, and review state as dropped on
  17 September.
- `docs/mvp0/PRODUCT-PLAN.md` section 3, the Review row: the change queue on S20 replaces the
  review-state sidecar, `[Z]`, from the 13 September reset.
- `docs/mvp0/PRODUCT-PLAN.md` section 17: review state never existed in the code, and it failed an
  adversarial round.
- `[O]` measured for this record: `grep -rl 'review.jsonl' src` matches 0 of the 254 files under
  `src/`.
- `docs/mvp0/PRODUCT-PLAN.md` section 5, on S31: Let AI decide proposes a merge as one change queue
  item and never writes straight to the file.

## A correction to the recorded reason

`CLAUDE.md` gives three reasons, the third being that Almanac shipped the same read receipts and
shut down.

- `06-COMPETITIVE-LANDSCAPE.md` section 5 opened Almanac's farewell page on 18 September. The shutdown
  on 31 January 2025 is real.
- **The stated cause was capacity**, a new product that took the team's time, not a verdict on read
  receipts.
- So the Almanac reason is wrong as recorded. **The decision stands on the other two**: the sidecar
  was never built, and it failed the 8 September adversarial round.

## Alternatives rejected and why

Alternative | Why rejected
Per-span review state in a sidecar | Never built, failed an adversarial round, and a sidecar is a second source of truth against ADR-0006
An unreviewed-percentage badge | The plan's section 25 records the attention literature as hostile to it. No such badge is planned
Silent merge of agent edits | Breaks the owner's control the queue exists to give

## Consequences

- Every queue item carries an author. That is why `56-OPEN-DECISIONS.md` recommends, under D12, that
  a link-edit holder must have an account.
- Queue items live in Firestore under the document, with proposed bytes inline up to 64 KiB, per
  `docs/mvp0/PRODUCT-PLAN.md` section 18.
- Edits made in a GitHub or Drive mirror come back as queue items, per ADR-0012.
- `[O]` state: S20 is `specified` in `11-SCREEN-INDEX.md` with no route. The queue is not built.
- The earlier phrase "review state" survives in old documents. Read it as superseded.

## What would reverse it

- Pilot evidence that owners accept everything unread, which would make the queue a rubber stamp.
  `INFERENCE:` the plan's section 28 counts individual accepts separately from Accept all, which is
  the measure that would show it.

## Limits of this record

- The Almanac page was opened by `06`, not re-opened here.
- `CLAUDE.md` still carries the Almanac reason. Editing it is outside this record's scope.
