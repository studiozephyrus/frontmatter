---
spec: 1
id: drafts/legacy-migration
title: Local drafts under the legacy sgnk-md keys move into the account without losing one
type: platform
state: draft
prd_file: docs/mvp0/PRODUCT-PLAN.md
prd_sha256: "da29fced004ca1c5d85efc8f5911a2861debd5cae28e793b27eb9ed23cc79a6e"
prd_sections: ["15", "18", "25"]
governs:
  - src/modules/drafts/**
verify:
  - node specs/harness/spec-report.mjs --id drafts/legacy-migration
  - npx vitest run test/drafts
depends_on: [auth/session, data/storage-adapters]
refusals: [E106, E109]
red_proof: test/drafts/migration-keeps-local-until-confirmed.test.ts
budget: 2600
owner: sagnik
updated: 2026-09-20
commit: 6c44319
x:
  batch: 2
  features: [F247, F250]
  acceptance: [A642]
  governs_planned:
    - test/drafts/migration-*.test.ts
    - test/drafts/legacy-key-names.test.ts
---

# Legacy draft migration

## Contract

The shipped app keeps unsynced drafts in IndexedDB under the legacy `sgnk-md` database and `drafts`
object store, with a `localStorage` dirty index under `sgnk-md:dirty`. Batch 2 owes those drafts a
migration into the signed-in account (plan section 15, carried as A33 in section 25). **A migration
reads the store and writes versions. It does not rename the keys** (`21-DATA-MODEL.md` section 21.9).
A local draft is removed only after its version is confirmed written, compared by content hash. If
anything is uncertain, the local draft stays and the migration says so. A draft that never reached
R2 is the one class of data this product can lose, so the migration errs toward keeping two copies,
never toward keeping none.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | A local draft is deleted only after the written version's hash equals the draft's hash | The upload failed quietly and the only copy was deleted | `test/drafts/migration-keeps-local-until-confirmed.test.ts` |
| 2 | The persistence names are unchanged at their use sites: IndexedDB `sgnk-md` with store `drafts`, `sgnk-md:dirty`, `sgnk-md-editor-settings`, `sgnk-md-bookmarks`, `sgnk-md-editor`, and the Tauri id `ai.sgnk.md` | A rename silently orphans every person's local drafts and settings | `T642` (A642), `test/drafts/legacy-key-names.test.ts`, which must fail on a planted rename |
| 3 | The IndexedDB store is the record and the `localStorage` array is the index; a corrupt index is rebuilt from IndexedDB, never returned empty | An empty index hides every unsaved draft | `npx vitest run test/drafts` over `readDirtyIndex` and `rebuildDirtyIndexFromIDB` |
| 4 | The migration is idempotent: run twice, it writes each draft once | A retry after a dropped connection makes duplicate documents | `test/drafts/migration-idempotent.test.ts` |
| 5 | Offline, the migration does nothing and loses nothing; it resumes on the next signed-in load | A migration started offline marks drafts as moved | `test/drafts/migration-offline.test.ts` against `E109` |
| 6 | A draft whose base no longer matches the account's head becomes a separate version or a queue item, never a silent overwrite of the head | A stale local draft replaces newer work | `test/drafts/migration-stale-base.test.ts` |

## Interface

- Store: `src/modules/drafts/infrastructure/draft-store.ts`, patterns
  `const DIRTY_KEY = "sgnk-md:dirty";` and `createStore("sgnk-md", "drafts")`. Each entry is
  `{ content, baseSha, updatedAt }` keyed `draft:{path}`.
- The other three `localStorage` names sit in the editor module (`editor-settings.ts`,
  `editor-store.ts`, `bookmarks.ts`). This lane does not govern those files; invariant 2's test reads
  them so a rename anywhere fails.
- Writes go through the storage adapters of `data/storage-adapters`, keyed by content hash, so a
  repeated write of identical bytes is a no-op by construction.

## Refusals

- **Deleting a local draft on any signal weaker than a hash match is refused.**
- **Renaming a legacy key "to match the brand" is refused.** A rename is a new key plus a
  migration, and this lane is the migration, not the rename.
- **Overwriting a newer head with an older local draft is refused.**

## Red proof

`test/drafts/migration-keeps-local-until-confirmed.test.ts` (not yet written) makes the version
write fail after the request is sent and asserts the local draft is still in IndexedDB. It must
**fail** against a migration that deletes the draft when the write call returns without throwing.
The key-name test must fail when any one of the six names is changed in a scratch copy of the source.

## Verification

- `npx vitest run test/drafts` runs today over `test/drafts/draft-store.test.ts`.
- The migration's doubles are `idb-keyval` over fake IndexedDB and the storage adapter's in-memory
  double; no live store is touched by a test.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-09-20: migrate, keep the names. The contradiction between "migrated off the legacy keys" in
  `50-ROADMAP.md` section 3.2 and A642 "each appear at their use site" resolves as: data moves off,
  names stay, because the same device may still hold drafts the migration has not reached.

## Open

- When, if ever, the legacy store is emptied and its code removed. That needs a count of devices
  still holding drafts, which nothing measures today.

## Next

    node specs/harness/spec-report.mjs --id drafts/legacy-migration
    npx vitest run test/drafts
