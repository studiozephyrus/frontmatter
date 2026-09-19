---
spec: 1
id: data/firestore-rules
title: Firestore rules from prototype to product, for the batch 2 records
type: platform
state: draft
prd_file: docs/mvp0/PRODUCT-PLAN.md
prd_sha256: "da29fced004ca1c5d85efc8f5911a2861debd5cae28e793b27eb9ed23cc79a6e"
prd_sections: ["15", "18", "26", "30"]
governs:
  - firestore.rules
  - firestore.indexes.json
  - firebase.json
verify:
  - node specs/harness/spec-report.mjs --id data/firestore-rules
refusals: [E106]
red_proof: test/firestore-rules/server-owned-fields.test.ts
budget: 3000
owner: sagnik
updated: 2026-09-20
commit: 6c44319
x:
  batch: 2
  features: []
  acceptance: [A145, A512, A707, A716, A724]
  governs_planned:
    - test/firestore-rules/**
  tooling_missing: >-
    Neither firebase-tools nor @firebase/rules-unit-testing is a dependency and `which firebase`
    prints nothing, so no rule in this lane can be executed today. Adding them is the first step.
  founder_dependencies:
    - "The configuration, audit and exception collection names are not in 21-DATA-MODEL.md; the names below are proposals until that file adopts them"
    - "Batch 1: the company-owned Firebase project (ADR-0013) that these rules deploy to"
---

# Firestore rules for batch 2

## Contract

`firestore.rules` is marked PROTOTYPE in its own header ("not yet exercised against the emulator
or a live client. Harden before taking paid signups") and assumes document **bytes** live in
Firestore (`content: string (required, <=900000)`). The plan of record puts bytes in R2 and records
in Firestore (ADR-0007, `21-DATA-MODEL.md` section 21.1), so the rules change, not the plan. For
batch 2 the rules must guard the records this batch creates: the account, the usage counter and
ledger, and the configuration store with its audit log. Every rule is proved on the emulator
before it is deployed. **Default deny stays the last match.** A collection renamed with the old
rules attached is an open database, so the prototype-to-product mapping of `21-DATA-MODEL.md`
section 21.11 is carried over path by path.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | `users/{uid}`: owner read only; `plan`, `superAdmin`, `email` and `createdAt` never client-writable; a client create, if kept at all, only with `plan == 'free'` | A person upgrades themselves or grants themselves the panel | `test/firestore-rules/server-owned-fields.test.ts` on the emulator |
| 2 | A server-owned field added by the Admin SDK does not break the owner's permitted updates | The prototype's `isValidUser` uses `hasOnlyAllowedFields` over eight names, so the first `superAdmin` the server writes makes every owner update fail | same file, a case that writes `superAdmin` with the Admin SDK and then updates `lastSeenAt` as the owner |
| 3 | `billing/{uid}` and everything under `usage/{uid}`, including `ledger` and `shards`, have no client write at all | Metering a person can edit is not metering | `test/firestore-rules/usage-no-client-write.test.ts` |
| 4 | The configuration rows, the exception records and the audit log have **no client read or write**; the panel reaches them only through server routes that check super admin | A disabled button treated as the gate; a leaked row of every account's exceptions | `T037` (A145) server side, plus `test/firestore-rules/config-closed.test.ts` |
| 5 | The audit log is append-only even to the server path: no update and no delete route exists, and the rules deny both | A config change whose history can be edited did not happen, per section 11 of file 28 | `T724` (A724) |
| 6 | Default deny `match /{document=**}` is the last block and is never widened | A new collection ships readable by anybody signed in | `test/firestore-rules/default-deny.test.ts`, one unknown path read and written |
| 7 | No rule references `content`, `storagePath` or any byte-bearing field | Bytes creep back into Firestore past the 1 MiB ceiling | a `grep` for those names in `firestore.rules` is a PROXY check and says so |

## Interface

- Paths guarded, from `21-DATA-MODEL.md` sections 21.3 to 21.5: `users/{uid}`, `billing/{uid}`,
  `usage/{uid}/months/{YYYY-MM}`, `usage/{uid}/months/{YYYY-MM}/shards/{n}`,
  `usage/{uid}/ledger/{entryId}`.
- Proposed, `INFERENCE:` not yet in `21-DATA-MODEL.md`: `config/{rowKey}` for a panel row with its
  value and version, `configAudit/{rowId}` for the audit record of file 28 section 11, and
  `exceptions/{id}` for the record of `53-PRICING-AND-ENTITLEMENTS.md` section 5.4. All three
  closed to clients.
- The vault, document, version, queue and share paths belong to later batches. This lane does not
  harden them; it keeps them no looser than today.
- Emulator config: `firebase.json` already declares the Auth and Firestore emulator ports.

## Refusals

- **A rule that cannot be exercised on the emulator is not deployed.** The prototype's own header
  is the warning; this lane does not repeat it.
- **Opening a configuration collection to clients "read only" is refused.** The panel is two people
  and a server route; a readable config tree tells an attacker every limit and every exception.
- **Deleting an audit row is refused**, by the rules and by the absence of a route.

## Red proof

`test/firestore-rules/server-owned-fields.test.ts` (not yet written) seeds a user document through
the Admin SDK with `superAdmin: true`, then attempts an owner update of `lastSeenAt`. Against the
prototype at `6c44319` it must **fail**, because `hasOnlyAllowedFields` rejects the extra key; that
is invariant 2's defect, found by reading the rules and not yet run. A second case, a client write of
`plan: 'pro'`, must be refused both before and after, which proves the test can see a refusal.

## Verification

- Today only the spec gate runs. The emulator suite joins `verify:` the day `firebase-tools` and
  `@firebase/rules-unit-testing` are added; until then this lane cannot leave `draft`.
- A deploy is a founder action against the company project, never an agent's.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-09-20: batch 2 hardens only the records batch 2 creates. Hardening the vault tree waits for
  the batch that writes it, so no rule is written for a shape that is not yet decided.

## Open

- Whether the account record is created by the client at all, or only by the server at the session
  exchange (`auth/session` proposes the server). If only the server, the client `create` rule is
  removed rather than kept.

## Next

    node specs/harness/spec-report.mjs --id data/firestore-rules
