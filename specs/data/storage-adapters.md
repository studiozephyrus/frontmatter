---
spec: 1
id: data/storage-adapters
title: The Firestore and R2 adapters, and a key layout that never overwrites
type: platform
state: draft
prd_file: docs/mvp0/PRODUCT-PLAN.md
prd_sha256: "da29fced004ca1c5d85efc8f5911a2861debd5cae28e793b27eb9ed23cc79a6e"
prd_sections: ["15", "18", "26"]
governs:
  - src/shared/infrastructure/firebase/**
verify:
  - node specs/harness/spec-report.mjs --id data/storage-adapters
  - npm run arch
  - npm run typecheck
depends_on: [data/firestore-rules]
refusals: [E106]
red_proof: test/shared/r2-never-overwrites.test.ts
budget: 3000
owner: sagnik
updated: 2026-09-20
commit: 6c44319
x:
  batch: 2
  features: []
  acceptance: [A525, A666, A722]
  governs_planned:
    - src/shared/infrastructure/r2/**
    - test/shared/r2-*.test.ts
    - test/shared/firestore-*.test.ts
  founder_dependencies:
    - "D03 (decided): our copy in R2 and Firestore is canonical, the mirror is not. Whether the mirror worker moves into batch 2 is uncosted (50-ROADMAP.md section 6.1); this lane assumes it does not"
    - "Batch 1: the Blaze billing account and the company-owned Cloudflare and Firebase accounts"
---

# Storage adapters

## Contract

Two stores and one rule between them (`21-DATA-MODEL.md` section 21.2): **bytes go to R2, records
go to Firestore**, and Firestore never holds a document's bytes, only a pointer, a hash and enough
metadata to list, sort and permission the thing. Batch 2 builds the two adapters behind ports that
name only domain shapes, so a use case never learns which vendor it talks to (`24-SERVER-SPEC.md`
section 24.4). The R2 adapter has one rule above all others because R2 has no object versioning:
**never overwrite a key.** Every key carries something that changes when the bytes change, so a write
either creates a new object or is a no-op on identical bytes. Every read and write is counted in a
request log the tests can read, because several batch 2 criteria are counted at the adapter.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | A version key is `v/{vaultId}/{docId}/{sha256}` and the hash is of the exact bytes written | Two different contents under one key, and the older one is gone with nothing to restore | `test/shared/r2-never-overwrites.test.ts` |
| 2 | The adapter refuses a put to an existing key whose bytes differ | A bug upstream silently destroys a good version | same test, a second put with different bytes under the same key |
| 3 | Firestore records never carry document bytes; a record over a stated cap is refused | The 1 MiB document ceiling becomes the binding constraint, and a large note fails to save | `test/shared/firestore-record-caps.test.ts` |
| 4 | Every adapter call is appended to an in-process request log with operation, path and byte count | A criterion counted "at the adapter" has nothing to count | `T525` (A525), `T666` (A666), `T722` (A722) read this log |
| 5 | Credentials and endpoints are read only in `src/config/` or `*/infrastructure/` | An env read in a use case fails the architecture gate or leaks a key to a client bundle | `npm run arch` total 0 |
| 6 | The Firebase client stays lazy: importing it initialises nothing at build time | The build needs production secrets, or a client bundle initialises Firebase on every page | `npm run build` with no Firebase variables set |
| 7 | A failed write returns a typed failure; the caller shows `E106` and claims nothing | A write that failed is reported as saved | port contract test per adapter |

## Interface

- Existing: `src/shared/infrastructure/firebase/client.ts`, which exports `getFirestore` lazily.
  `grep -rn "getFirestore\|collection(\|doc(" src/modules/` shows no use case reads or writes a
  collection today.
- Missing: any R2 client. `grep -rln "S3Client\|R2Bucket\|aws-sdk" src/` prints nothing
  (`21-DATA-MODEL.md` section 21.11).
- The bytes today live in a GitHub repository through `githubVaultReader` and `githubWriter`, wired
  in `src/container/dependency-container.ts`. This lane adds adapters beside them; it does not remove
  the GitHub path, which is batch 3's editor work.
- Key layout, verbatim from `21-DATA-MODEL.md` section 21.8: `v/`, `q/`, `u/`, `p/`, `x/` and `log/`
  prefixes, `{vaultId}` leading every tenant key so a single-tenant restore is a prefix operation.
- Wiring goes in `src/container/dependency-container.ts`, following the five steps of section 24.4.

## Refusals

- **An overwrite of a differing object is refused**, returned as a failure, and logged. The adapter
  never "fixes" it by picking a winner.
- **A record that would hold bytes is refused** at the Firestore adapter, whatever the caller says.
- **An adapter that reads `process.env` itself is refused** by the architecture gate.

## Red proof

`test/shared/r2-never-overwrites.test.ts` (not yet written) runs against an in-memory R2 double
that behaves like R2: a second put replaces the first. The test must **fail** against a naive
adapter that calls put unconditionally, and pass only once the adapter checks for an existing object
first. `UNVERIFIED:` whether R2 honours a conditional put natively, which would make the check
atomic rather than check-then-write. Not opened in this session; confirm against Cloudflare's R2
documentation and record the page and date before relying on it.

## Verification

- `npm run arch` and `npm run typecheck` run today and must stay green as the adapters land.
- The adapter tests use doubles; one live smoke test against the company R2 bucket is a founder
  action, never an agent's.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-09-20: batch 2 builds the adapters and the key layout, not the mirror. `50-ROADMAP.md`
  section 6.1 says the key layout belongs in batch 2 under any answer, and the mirror moves only if
  the founder wants a person's own storage from day one.

## Open

- Where the security log lives. `21-DATA-MODEL.md` section 21.7 puts it in R2; the founder review
  (`docs/pack/review/00-FOUNDER-REVIEW.md` section 1, the data-location row) proposes Firestore in
  `asia-south1` because R2 offers no India location. This lane writes no security log until that is
  settled.

## Next

    node specs/harness/spec-report.mjs --id data/storage-adapters
    npm run arch
