---
id: ADR-0004-r2-recovery-in-key-layout
title: R2 has no object versioning, so recovery lives in the key layout
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0004]
---

# ADR-0004. R2 has no object versioning, so recovery lives in the key layout

**Decision id:** ADR-0004. **Decided:** in PRD v2, 29 August 2026, section 32.1. **Recorded here:**
18 September 2026.

## Context

- Cloudflare R2 holds every document version and every upload. ADR-0007 fixes that stack.
- On most object stores, disaster recovery starts with a versioning switch: an overwrite keeps the
  old object, and a restore picks a point in time.
- R2 does not offer that switch. So the protection has to come from how objects are named.

## Decision

- **A key is never overwritten.** Every key contains something that changes when the bytes change,
  so a write either creates a new object or repeats an identical one.
- **Deletion is the only destructive act left**, so every deletion is delayed, confirmed and logged
  before it runs.
- **If Cloudflare ever ships versioning**, it is defence in depth on top of this layout, never a
  replacement for it.

## Evidence

Every citation below was opened with `sed -n` on 18 September 2026.

- `CLAUDE.md:124` lists the constraint under "Settled".
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:3046` records `GetBucketVersioning`, `PutBucketVersioning`
  and both object-lock calls as unsupported on R2's S3 compatibility matrix, fetched 29 August 2026.
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:3047` records `DeleteObject` as a free operation, so a
  runaway delete loop costs nothing.
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:3049` records that data-plane reads and writes are absent
  from R2's audit logs by default.
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:3052` draws the conclusion: on R2, versioning is built in
  the key layout, not bought.

## The layout, and a disagreement inside this pack

Two pack files give different layouts. **Neither is built.** Both obey the rule above.

File | Version key | Head pointer
`21-DATA-MODEL.md` section 21.8 | `v/{vaultId}/{docId}/{sha256}` | Firestore `headVersionId` and `headKey`
`37-BACKUP-AND-RECOVERY.md` section 2 | `u/{uid}/d/{docid}/v/{ts}-{sha256}` | a `HEAD` object in R2

- `37` copies the PRD's section 32.3 layout of 29 August.
- `21` follows the 17 September stack, where Firestore holds the head.
- The storage decision of 18 September agrees with `21`: R2 keyed by content
  hash, Firestore for which version is current (`docs/research/2026-09-18-storage/STORAGE-BENCHMARK.md`
  section 6.2).
- `INFERENCE:` `21` is the current one and `37` should be brought into line. **This record does not
  settle it.** The owner of `37` does, and says so there.

## Alternatives rejected and why

Alternative | Why rejected
Rely on R2's durability | R2's own page, quoted at `docs/FRONTMATTER-PRD-v2-2026-08-29.md:3050`, says durability does not prevent deletion
Mutable keys, one per document | One bad write destroys the only copy, with nothing to roll back to
Wait for a versioning toggle | `docs/FRONTMATTER-PRD-v2-2026-08-29.md:3052` warns against designing as if it will arrive
Git as the backup of customer documents | `docs/FRONTMATTER-PRD-v2-2026-08-29.md:3080` quotes GitHub: git is not designed as a backup tool

## Consequences

- A restore is a pointer move, not a copy, per `21-DATA-MODEL.md` section 21.8.
- A sweep can reconcile R2 and Firestore in either direction, because every version key ends in its
  hash.
- The deeper layers of `37-BACKUP-AND-RECOVERY.md` exist to answer deletion: a bucket lock, a second
  bucket on a separate account, and a copy at a second provider.
- Pruning history writes its log line before the delete, not after.

## What would reverse it

- Nothing on R2's side reverses the rule. A versioning switch would add a layer, not remove this one.
- Leaving R2 for a store with true object versioning would reopen the question. Nothing planned does.

## Limits of this record

- The R2 facts were fetched on 29 August 2026 and not re-fetched for this record.
- The two layouts above are unreconciled at `4de879d`.
