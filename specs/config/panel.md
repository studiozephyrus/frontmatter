---
spec: 1
id: config/panel
title: The configuration panel, the only writer of limits, routing and flags, with an append-only audit
type: surface
state: draft
prd_file: docs/mvp0/PRODUCT-PLAN.md
prd_sha256: "da29fced004ca1c5d85efc8f5911a2861debd5cae28e793b27eb9ed23cc79a6e"
prd_sections: ["14", "29", "30"]
governs: []
verify:
  - node specs/harness/spec-report.mjs --id config/panel
  - npm run arch
depends_on: [auth/session, data/firestore-rules, data/storage-adapters, entitlements/limits-for]
screens: [S35, S36, S37, S38]
refusals: [E090, E106]
red_proof: test/config/save-is-atomic-with-audit.test.ts
budget: 3400
owner: sagnik
updated: 2026-09-20
commit: 6c44319
x:
  batch: 2
  features: [F266, F267, F268, F269, F270, F271, F272, F273, F274, F275]
  acceptance: [A144, A145, A146, A147, A148, A668, A705, A706, A707, A708, A709, A710, A711, A712, A713, A714, A715, A716, A717, A718, A719, A720, A721, A722, A723, A724, A725]
  governs_planned:
    - src/modules/config/**
    - test/config/panel/**
  screen_spec_pointers: "S35 to S38 name config/plans-and-limits, config/models-and-providers, config/features-and-flags and config/accounts-and-usage; all four are folded into this lane, one writer contract"
  founder_dependencies:
    - "flag.auth.magiclink ships false (founder question 18, recommendation)"
    - "legal.age.floor ships at eighteen and locks at the first signup (founder question 12)"
    - "flag.publish.indexed default and per-page shape (S37 D92, needs founder); this lane ships the file 28 default and changes only the row"
    - "Whether turning off bring-your-own key revokes stored keys (S37 D86, needs founder); flag.byok ships false, so batch 2 is unaffected"
    - "A monthly per-inviter ceiling for policy.invite.credits (S17 D38) needs a new row in file 28 first"
---

# The configuration panel

## Contract

Four founder-only screens, S35 to S38, set what every tier allows **at run time, without a deploy**
(`28-CONFIGURATION-PANEL-SPEC.md`). The invariant the whole panel serves is written on S35 itself:
**this row is what the product reads, and there is no second copy in the source.** The panel is the
only writer of limits, routing, provider switches, flags, exceptions and pilot thresholds; every
reader goes through `limitsFor(account)` or the one flag gate. Every row ships with a value, so
nobody decides anything before batch 2 starts. Every save is checked server side for the super-admin
flag, shows its blast radius before writing, compares against the version it was read at, and writes
the value and its audit row in one transaction or writes neither. Two rows look like switches and are
locked: the training promise and, after the first signup, the age floor.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | Every write checks super admin in the route handler, server side | A hidden control treated as the gate | `T037` (A145) |
| 2 | Value and audit row are written in one transaction; if either fails, neither is written | A change with no history, or history of a change that never happened | `T707` (A707), `T192` (A146) |
| 3 | A save carries the version each row was read at; a stale save is refused and names the row | Two founders editing one cap and the last write silently wins | `T706` (A706) |
| 4 | Before a lowering is written, the panel shows the count and the named accounts it moves over the cap, and exactly those move | "12 accounts affected" with no names, or a count that disagrees with who moved | `T049` (A144), `T705` (A705) |
| 5 | A saved limit, routing cell or flag is live on the next request with the same deployment id | A setting that needs a deploy is a constant with a form in front of it | `T668` (A668) |
| 6 | A provider whose terms were never opened, or whose stored terms permit training on inputs, cannot be enabled, through the screen or a direct write | A training provider enters the chain and the sign-in page's promise becomes false | `T060` (A147), `T708` (A708), red proof against a real clause in plan section 14 |
| 7 | The training-promise row and, once any account exists, the age-floor row refuse every write, with the reason on the row | A number is changed that re-consent or the sign-in copy depended on | `T193` (A148), `T716` (A716), `T718` (A718), `T720` (A720) |
| 8 | A chain of zero enabled providers cannot be saved | An outage configured by hand | `T712` (A712) |
| 9 | Routing cost is computed from the token shape and the stored price; no cost literal in the component; the pool cell is the ledger's count | A typed cost that drifts from the price, or a provider probe that spends the pool it reports | `T709` (A709), `T710` (A710) |
| 10 | Every availability check reads the one flag gate; a flag turned off answers 200 with the explanation, and a running session survives | A screen decides its own availability, or a link to a switched-off feature is a 404 | `T715` (A715), `T717` (A717), `T719` (A719) |
| 11 | An exception without an expiry, or past 365 days, is refused; S38 never writes a plan row | A permanent exception is a plan change in disguise | `T721` (A721), `T722` (A722) |
| 12 | The audit log refuses update and delete through the panel and through a direct server call | History that can be edited did not happen | `T724` (A724) |
| 13 | Account search returns an exact match or nothing | Acting on the wrong person's account | `T725` (A725) |
| 14 | The panel never renders a default when the stored value could not be read | A guessed table invites a save of guesses | `test/config/panel/unreadable-shows-error.test.ts` |

## Interface

- Module: `src/modules/config/` (S35's data contract says it does not exist). Ports named by S35:
  `PlanConfigReader`, `PlanConfigWriter`, `ConfigAuditReader`, `ConfigAuditWriter`,
  `LimitsImpactReader`.
- Audit shape: `ConfigAuditRow` in file 28 section 11, including `configVersion`, `accountsMoved`
  computed never typed, and `at` from the server clock.
- Stores: proposed `config/{rowKey}`, `configAudit/{rowId}`, `exceptions/{id}`, closed to clients by
  `data/firestore-rules`.
- Seed: the shipped defaults are the typed constant in `entitlements/limits-for`; the panel seeds the
  store from it once and never holds a second copy.
- Not the super-admin flag: `ALLOWED_GH_LOGIN` in `src/config/env.ts`, pattern
  `ALLOWED_GH_LOGIN: z.string().min(1).default("sagnikmitra")`.

## Refusals

- **Editing from a phone is refused.** A change here reaches other people's accounts.
- **Moving one account from S35 is refused**; that is an exception on S38.
- **Saving an entitlement id not in `53-PRICING-AND-ENTITLEMENTS.md` section 3 is refused.** A
  free-text key is how a typo becomes a silent no-op.
- **Raising a locked row through an exception is refused.**
- **Showing a directory of every account, or any document text, on S38 is refused.** Counts and the
  ledger only.

## Red proof

`test/config/save-is-atomic-with-audit.test.ts` (not yet written) makes the audit write fail and
asserts the setting row is unchanged, then makes the setting write fail and asserts no audit row
exists. It must **fail** against a save path that writes the value and then the audit row as two
separate calls. Invariant 3's test must fail against a last-write-wins save.

## Verification

- `npm run arch` runs today; the cap-literal rule it gains belongs to `entitlements/limits-for`.
- A713 and A714 need the router and S32, which land with the AI batches. They are not yet
  checkable in batch 2 and are kept here because S36 is built now.
- The batch 2 use gate: both founders change one limit, one routing cell and one flag and see each
  take effect (`50-ROADMAP.md` section 3.2).

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-09-20: S35 to S38 fold into one lane. The contract is one writer with one audit, and four
  lanes would each be tempted to write its own save path.

## Open

- File 28 section 2 counts ten absorbed questions where the plan says eleven. This lane builds ten
  rows' worth and does not invent a row for question 16.

## Next

    node specs/harness/spec-report.mjs --id config/panel
    npm run arch
