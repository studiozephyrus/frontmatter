---
id: ADR-0012-canonical-copy-with-mirror
title: Our copy is canonical, and the person's GitHub or Drive holds a full mirror
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0012]
---

# ADR-0012. Our copy is canonical, and the person's GitHub or Drive holds a full mirror

**Decision id:** ADR-0012. **Open decision closed:** D03 in `56-OPEN-DECISIONS.md`. **Decided:**
18 September 2026 `[Z]`, after the storage benchmark. **Pack commit:** `4de879d`, 18 September.

## Context

- The founder's first answer was that a person's documents live in their own storage: GitHub for a
  GitHub sign-in, Google Drive for a Google sign-in, with a synced copy on our side.
- He asked for the industry benchmark before deciding. It is
  `docs/research/2026-09-18-storage/STORAGE-BENCHMARK.md`.
- The question under it: can the person's drive be the canonical copy, given what the change queue,
  history, offline and refusal each need?

## Decision

- **R2 holds every version and upload, and Firestore holds the head. That copy is canonical.**
- A GitHub sign-in gets a full mirror in one repository, through a GitHub App. A Google sign-in gets
  one in a visible `frontmatter` Drive folder, through the `drive.file` scope only.
- **The full `drive` scope is never requested.** Both plans get the mirror.
- Edits made in the mirror come back as change queue items, never as a silent overwrite.
- **Over the storage cap, a soft cap.** Text always saves. New uploads stop, with three ways out:
  prune history, move uploads to the Drive mirror, or upgrade.
- Before the Drive mirror ships, the benchmark's two falsification tests run.

## Evidence

- `56-OPEN-DECISIONS.md` section 0, D03, records the decision, `[Z]`, and keeps the earlier answer
  below it as written.
- The benchmark's section 4.3 tests each canonical choice against the plan's mechanisms:

Mechanism | Our R2 canonical | GitHub canonical | Drive canonical
Refuse when the base is not the head | Local and exact | Holds, a stale `sha` returns 409 | **Breaks.** No write precondition found in the v3 reference
History, one version per save | Every save | Only as fine as our commits | Drive's own revisions: non-head ones typically kept 30 days, fewer past 100 revisions `[M]`
Refuse rather than guess | At every step | Possible, because of 409 | Only after a read, with a race window

- The retention cell was checked on 18 September 2026 against
  `https://developers.google.com/workspace/drive/api/guides/manage-revisions`: "Purgeable revisions
  are typically preserved for 30 days, but can be purged earlier if a file has 100 revisions". A
  Drive-canonical history would be 30 days at best, which strengthens the decision.
- Section 4.4 concludes that the change queue, per-save history, offline and refusal all need one
  place where the head is decided, and it must allow compare-and-swap.
- Section 6.3 explains the scope: full `drive` would bring a yearly CASA security assessment.

## Alternatives rejected and why

Alternative, from section 6.6 | Why rejected
Their drive canonical, our copy a cache | We still store every byte, so it saves nothing. Drive's race stays open. Reading files we did not create needs full `drive`
Our canonical, no mirror, export on request | Cheapest to build. It loses the founder's promise that documents live in the person's own storage

## Consequences

- The R2 key layout of ADR-0004 and the stack of ADR-0007 carry the canonical copy.
- A mirror worker for two providers, and a `connections` record per provider in `21-DATA-MODEL.md`.
- Uploads never go to GitHub. The benchmark cites GitHub's 100 MiB file block and its advice to stay
  under 5 GB.
- Past 10 GB on Pro, storage is sold in blocks priced from the configuration panel. The benchmark's
  section 4.2 puts our cost at ₹14.39 a month per 10 GB.
- `50-ROADMAP.md` section 6.1 records how this answer may change batch 2.

## What would reverse it

The benchmark's section 6.7 names two tests, each runnable in a day:

1. **Byte round trip.** Write each file of the 8,513-file corpus to Drive as `text/markdown`, read it
   back, compare SHA-256. One changed byte and the Drive half of this design falls.
2. **Concurrent edit.** Interleave 100 edits from our app and from Drive's own interface. Any edit
   lost without a queue item means the read-before-write guard is not enough.

And one finding would reopen a Drive-canonical design: Drive v3 `files.update` shown to honour an
`If-Match` precondition.

## Limits of this record

- `UNVERIFIED:` whether Drive preserves a markdown upload byte for byte. needs: falsification test 1,
  `T-67-drive-byte-roundtrip` in `67-SYNC-AND-CONFLICT.md` section 14.1, run against a test Drive.
- The mirror cadences in the benchmark's section 6.4 are marked `INFERENCE:` there, proposals for the
  founder. The decision in `56` does not fix them.
