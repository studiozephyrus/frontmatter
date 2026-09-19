---
spec: 1
id: entitlements/limits-for
title: One read path for every cap, the usage ledger, and a downgrade that never deletes
type: platform
state: draft
prd_file: docs/mvp0/PRODUCT-PLAN.md
prd_sha256: "da29fced004ca1c5d85efc8f5911a2861debd5cae28e793b27eb9ed23cc79a6e"
prd_sections: ["13", "15", "18", "19", "30"]
governs: []
verify:
  - node specs/harness/spec-report.mjs --id entitlements/limits-for
  - npm run arch
depends_on: [config/panel, data/storage-adapters, auth/session]
screens: [S29, S33]
refusals: [E070, E078]
red_proof: test/entitlements/downgrade-never-deletes.test.ts
budget: 3200
owner: sagnik
updated: 2026-09-20
commit: 6c44319
x:
  batch: 2
  features: [F257, F258, F259, F260, F261, F265]
  acceptance: [A140, A141, A142, A143, A149, A150, A151, A669, A670, A671, A672, A695, A696, A697, A698]
  governs_planned:
    - src/modules/entitlements/**
    - test/entitlements/**
  screen_spec_pointers: "S29 names billing/plan-and-usage and S33 names billing/over-the-cap; both are folded into this lane, one contract"
  founder_dependencies:
    - "A697, the precedence of S33 over S32 when over the cap and the chain is down: 19-ACCEPTANCE-CRITERIA.md still marks it not yet checkable; S33 was corrected on 18 Sep to say S33 wins. This lane is written to S33's correction"
    - "policy.ai.refill: continuous (file 28) against calendar month (file 53). The panel row decides; this lane reads it and assumes neither"
---

# One read path for every cap

## Contract

**A single function resolves every limit:** `limitsFor(account)` in
`src/modules/entitlements/application/limits-for.ts` (`28-CONFIGURATION-PANEL-SPEC.md` section 9).
It reads the account's plan row, applies a running experiment's variant if the account is enrolled,
then any unexpired exception, and returns the limit set. **An exception always wins.** Nothing else in
the product reads a cap, and a cap literal anywhere else is a defect the architecture gate catches.
Each check runs against the usage ledger, which is append-only; the balance is a sum, and the
sharded counter is a cache of that sum that loses to the ledger when they disagree. **Going over a cap
refuses creation and nothing else.** Every document stays readable, editable and exportable, and no
limit change deletes anything except `limits.history.days`, after its grace (file 28 section 10.2).

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | No cap is read outside the entitlements module; `limitsFor` is the only symbol compared against a usage count | A hard-coded 50 in an import route that the panel can never move | `T191` (A140), a cap-literal rule added to `specs/harness/clean-architecture-report.mjs` and run by `npm run arch` |
| 2 | If the configuration store is unreachable, `limitsFor` fails **closed** to the Free row's shipped defaults and logs which path served the value | A read error returns unlimited, the worst bug on this surface | `test/entitlements/fail-closed.test.ts` |
| 3 | `null` means unlimited and is never compared as zero or as a large number | An unlimited Pro row blocks every action, or a zero row allows everything | `test/entitlements/null-is-unlimited.test.ts` |
| 4 | Order: plan row, then experiment variant for an eligible account, then unexpired exception; an expired exception is ignored on the next read | A lapsed exception keeps a person on a limit nobody granted | `T195` (A151) |
| 5 | At the document cap a new cloud document is refused with `E070`; every existing document opens, exports and stays | The cap becomes a trap, and the export that is the way out is blocked | `T040` (A141) |
| 6 | A downgraded or lowered account keeps every document and byte, and renders S33 on its next request | A founder deletes somebody's work by moving a number | `T048` (A142), `T696` (A696), which must fail against a build that trims to the cap |
| 7 | A published page never goes dark for a cap; over `limits.pages.published` only new publishing stops | A stranger's link breaks because the owner is over a limit | `T695` (A695) |
| 8 | On a shared document the **owner's** limits apply | A Free collaborator is blocked on a Pro owner's document, or unlocks Pro for free | `T034` (A143) |
| 9 | Exactly one ledger entry per model call, with account, kind, delta, model and cost; a failed call's delta is zero | Charged for a failure, or a call with no record | `T194` (A149), `T051` (A150) |
| 10 | Meters and the S38 figures are read from the ledger's value; no component sums ledger rows | Two components compute two balances | `T723` (A723, owned by `config/panel`, reading this module) |
| 11 | A monthly cap shows a reset date from the ledger's period; a standing cap shows none | An invented reset date from the client's clock | `T698` (A698) |
| 12 | A meter at 100 per cent names the plan that lifts it, and every control on the screen stays enabled | "Full" reads as broken, and the person cannot reach their own work | `T669` (A669) |
| 13 | The plan route has zero card-number, expiry or security-code inputs; Team and Enterprise are shown and not buyable | A card field on our own page makes card data our liability | `T671` (A671) |

## Interface

- Read path: `limitsFor(account): Limits`, exported from the entitlements barrel. Screens read it
  through `EntitlementsReader.forAccount()` (S02, S03) or `LimitsReader.forAccount()` (S28); both
  are thin names over this one function, never a second resolver.
- Entitlement ids and their values: `53-PRICING-AND-ENTITLEMENTS.md` section 3. **This lane holds no
  cap value.** Shipped defaults live once, as a typed constant in the entitlements module, and are
  seeded into the configuration store by `config/panel`.
- Ledger and counter: `usage/{uid}/ledger/{entryId}` and `usage/{uid}/months/{YYYY-MM}/shards/{n}`
  (`21-DATA-MODEL.md` section 21.5). Server writes only.
- Cache: in-process with a short time to live, keyed on the `configVersion` the panel bumps on every
  save, so a save takes effect on the next read without a deploy (A668, owned by `config/panel`).
- Experiment bucketing: `src/modules/entitlements/application/experiment-bucket.ts`, a stable hash of
  experiment id and account id (file 28 section 10.3). Specified, not built; no experiment runs in
  batch 2.

## Refusals

- **Creation over a cap is refused** with the entitlement named, `E070` for documents, `E078` after a
  downgrade. Nothing else is refused.
- **Deleting, hiding, unpublishing or trimming anything because of a cap is refused**, including
  after a grace period. The one exception, `limits.history.days`, prunes old versions only, 30 days
  after the change, never on save.
- **Presenting the entitlement message as an outage is refused.** Over the cap is S33, never S32,
  and when both apply S33 wins because the cap refused the call before any provider was asked.
- **Guessing a limit when the store is unreadable is refused** in favour of the Free defaults, with
  the path logged.

## Red proof

`test/entitlements/downgrade-never-deletes.test.ts` (not yet written) seeds an account with more
documents than a lowered cap, lowers it, and asserts the count and every byte are unchanged. It must
**fail** against a build whose over-cap handler trims to the cap, which is the build A696 names.
Invariant 2's test must fail against a resolver that returns `null` on a read error.

## Verification

- `npm run arch` runs today; the cap-literal rule is added to it in this batch, and its own red
  proof is a planted `if (count > 50)` outside the module that the gate must catch.
- A670 (past-due line) and A672 (mandate at or under ₹15,000) need checkout, which is batch 7.
  They are not yet checkable in batch 2. `19-ACCEPTANCE-CRITERIA.md` does not say so yet, and the
  batch gate lets a criterion pass only as met or marked, so its owner should mark both.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-09-20: S29 and S33 fold into this lane. They are two surfaces of one contract, what an
  account may do and what happens at the edge, and splitting them would let the edge drift from the
  read path.

## Open

- The cache time to live is unmeasured (file 28 section 14). It is stated on the panel row once
  chosen, not invented here.

## Next

    node specs/harness/spec-report.mjs --id entitlements/limits-for
    npm run arch
