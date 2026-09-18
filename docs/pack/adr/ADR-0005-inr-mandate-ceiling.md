---
id: ADR-0005-inr-mandate-ceiling
title: ₹15,000 a transaction is an architectural constant, and an Indian card gets one attempt
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0005]
---

# ADR-0005. ₹15,000 a transaction is an architectural constant, and an Indian card gets one attempt

**Decision id:** ADR-0005. **Decided:** in PRD v2, 29 August 2026, sections 24.4 and 45. **Recorded
here:** 18 September 2026.

## Context

- frontmatter charges Indian customers a recurring subscription. Razorpay is the rail in the plan of
  record, per `34-INTEGRATIONS.md` section 10.
- A recurring card debit in India runs on an e-mandate governed by the Reserve Bank of India. The
  mandate rules cap what can be debited without the customer approving each charge again.
- Most subscription billing designs assume a retry ladder after a failed charge. That assumption
  does not hold here.

## Decision

- **₹15,000 per charge is a constant the architecture is built around, not a pricing input.** No
  Indian plan auto-renews above it.
- **An Indian card gets one attempt per cycle.** No retry scheduler is built for Indian cards. A
  failed debit becomes a person asking a person to pay again.
- The entitlement check reads our ledger, not the processor, so an outage at Razorpay never lapses
  a paid account.

## Evidence

Every citation below was opened with `sed -n` on 18 September 2026.

- `CLAUDE.md:125` lists both halves under "Settled".
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:4233` quotes paragraph 8(a): recurring transactions may be
  authorised without an additional factor up to ₹15,000 per transaction.
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:4234` records that the ₹1,00,000 tier covers insurance,
  mutual funds and card bills only. Software is not on that list.
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:4244` quotes Stripe's India page: payments from India-issued
  cards are attempted only once, whatever the retry settings.
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:4262` draws the build rule: do not build a retry scheduler
  for Indian cards, because it cannot fire.
- `docs/mvp0/PRODUCT-PLAN.md` section 3 prices Pro at ₹299 a month or ₹2,499 a year, both under the
  ceiling.

## Two disagreements in our own sources

**Which RBI instrument governs.**

Source | Instrument cited
`docs/FRONTMATTER-PRD-v2-2026-08-29.md:4225` | Digital Payments E-mandate Framework, 2026, dated 21 April 2026
`docs/FRONTMATTER-PRD-v2-2026-08-29.md:4227` | Lists a ₹15,000 ceiling of 16 June 2022 as repealed, "do not cite"
`34-INTEGRATIONS.md` section 10 and `53-PRICING-AND-ENTITLEMENTS.md` section 5.2 | RBI/2022-23/73 of 16 June 2022
`docs/mvp0/PRODUCT-PLAN.md` section 23 | RBI/2022-23/73, "re-opened by this revision"

- The figure is ₹15,000 in every source, so the decision holds either way.
- `UNVERIFIED:` whether the 2022 circular is still in force. The citation should be settled by
  opening the RBI page once. This record does not.

**Where the one-attempt rule comes from.** `53-PRICING-AND-ENTITLEMENTS.md` section 5.2 attributes
it to the same RBI circular. The PRD attributes it to Stripe's documentation.

`UNVERIFIED:` whether Razorpay behaves the same way. Nobody has opened a Razorpay page on retries for this record.

## Alternatives rejected and why

Alternative | Why rejected
An Indian annual plan above ₹15,000 on auto-renew | Legal, but every renewal needs the customer present. `docs/FRONTMATTER-PRD-v2-2026-08-29.md:4261` calls it a manual repurchase in disguise
A retry ladder, as on non-Indian rails | The rail refuses the retry, so the queue would never fire
A card-on-file trial | `53-PRICING-AND-ENTITLEMENTS.md` section 5.1 infers a free tier is safer, because a failed first charge has no retry

## Consequences

- Dunning is short and human, per `53-PRICING-AND-ENTITLEMENTS.md` section 5.2.
- A price rise above a customer's mandate maximum forces re-authentication. The billing screen must
  refuse and surface it, never retry silently.
- A pre-debit notice goes out 24 hours ahead, which is why Resend is in the stack.

## What would reverse it

- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:4261` names it: RBI raising the ceiling for software, or
  adding software to the paragraph 8(b) list.
- A published retry allowance for India-issued cards, per line 4262.

## Limits of this record

- No RBI or Razorpay page was opened for this record. Every fact is carried from the PRD of 29 August
  and the pack files named above.
