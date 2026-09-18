---
id: ADR-0014-free-cap-as-tested-panel-value
title: The Free document cap is a panel value, A/B tested before it is fixed
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0014]
---

# ADR-0014. The Free document cap is a panel value, A/B tested before it is fixed

**Decision id:** ADR-0014. **Open decision closed:** D11 in `56-OPEN-DECISIONS.md`. **Decided:**
18 September 2026 `[Z]`. **Pack commit:** `2bfe2f1`, 18 September.

## Context

`56-OPEN-DECISIONS.md` section 4, D11, found three lines in the plan that cannot all be true:

- `docs/mvp0/PRODUCT-PLAN.md` section 13 caps Free at 50 cloud documents.
- Section 28 qualifies a pilot participant as having a vault of at least 200 files.
- Section 28 scripts step 2 of the first five minutes as importing a vault.

So half the pilot cohort would meet the cap in the first five minutes.

## Decision

- **The Free document cap, `limits.docs.cloud`, is set from the configuration panel.** It is not a
  constant in code.
- **It is A/B tested on real accounts before its value is fixed.** Any `limits.*` row can run the
  same way.

## Evidence

- `56-OPEN-DECISIONS.md` section 1, the D11 row, records the answer, `[Z]`.
- `28-CONFIGURATION-PANEL-SPEC.md` section 10.3 specifies the experiment. `specified, not built`.

Rule, from section 10.3 | What it means
Only new accounts are enrolled | Starting an experiment never lowers anybody's cap
Cohort by a stable hash of experiment id and account id | The same account always sees the same variant, and nothing random is stored
Variants, values and shares lock once running | A change means ending the experiment and starting a new id
The primary measure defaults to `plan.upgrade.completed` | Conversion per variant
The guardrail is document creation and the active user | A variant that converts better and loses active users is not a winner

- `53-PRICING-AND-ENTITLEMENTS.md` section 3 holds the current value: 50 on Free, unlimited on Pro.

## Alternatives rejected and why

The four options in `56` section 4, and why the founder's answer differs:

Option | Status
Give pilot accounts Pro | Not chosen. The pilot would never test the free tier
Exempt an import from the cap | The recommendation in `56`. Not what was decided. See the gap below
Count imported files at a discount | Not chosen. Arbitrary and hard to explain on S33
Raise the cap outright | Not chosen as a fixed step. The experiment may arrive at a higher value by measurement

## Consequences

- An account over a lowered cap keeps every document. It opens, edits and exports, and only a new
  cloud document is refused, per `28-CONFIGURATION-PANEL-SPEC.md` section 10.2.
- Ending an experiment is a lowering for accounts above the winning value. It goes through the save
  flow of section 10.1, with the count, the named accounts and a second confirmation.
- Every start, end and edit writes an audit row, per section 11.
- **The pilot contradiction is not closed by this decision.** Section 10.2 says an import over the
  cap is refused.
- `INFERENCE:` unless the pilot cohort runs with a cap of 200 or more, or the import
  exemption is also adopted, a pilot recruit still meets the wall at step 2.
- The founder should say which, before the pilot recruits anybody.

## What would reverse it

- An experiment that cannot reach a readable result at pilot scale. The cap would then be fixed by
  judgement, which is a new decision.
- `INFERENCE:` the traffic needed for a meaningful A/B result was not derived anywhere in the pack.

## Limits of this record

- No sample size or run length for the experiment exists yet.
- The interaction with the pilot is named here, not settled.
