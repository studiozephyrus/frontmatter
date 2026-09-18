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
  **Corrected 18 September, needs founder:** true of Stripe, not of Razorpay. See the second
  disagreement below.
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
- **Settled on 18 September 2026 by opening the RBI page** `[M]`
  (`https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13374&Mode=0`): the governing text is
  the Digital Payments E-mandate Framework, 2026, RBI/DPSS/2026-27/396, 21 April 2026.
  - Paragraph 8(a): "All recurring transactions may be authorised without AFA up to ₹15,000/- per
    transaction."
  - Paragraph 11, Repeal, row 6, lists CO.DPSS.POLC.No.S-518/02.14.003/2022-23 of June 16, 2022,
    "Processing of e-mandates for recurring transactions", as repealed.
  - So the PRD is right. `34-INTEGRATIONS.md` section 10, `53-PRICING-AND-ENTITLEMENTS.md`
    section 5.2 and the plan's section 23 cite a repealed circular, and their owners should cite
    the 2026 framework instead. `INFERENCE:` RBI/2022-23/73 is the same circular, by date and
    subject.

**Where the one-attempt rule comes from.** `53-PRICING-AND-ENTITLEMENTS.md` section 5.2 attributes
it to the same RBI circular. The PRD attributes it to Stripe's documentation.

**Checked on 18 September 2026, and Razorpay does not behave the same way** `[M]`:

- The 2026 RBI framework has no "attempt" or "retry" rule in its text. The one-attempt rule is
  Stripe's, not the RBI's, so `53` section 5.2's attribution is wrong.
- Razorpay Subscriptions retry on their own: "We automatically retry the payment on the following
  day", and "If the payment fails after all retries, the Subscription will move to the halted
  state". `https://razorpay.com/docs/payments/subscriptions/payment-retries/`.
- Razorpay's card recurring API does not retry automatically, but allows a manual retry: "You can
  manually re-initiate a payment for the same order id, repeatedly, every 36 hours, until the
  payment is successful". `https://razorpay.com/docs/payments/recurring-payments/cards/faqs/`.

**What changes, needs founder.** The second decision bullet, one attempt per cycle, is true of
Stripe and false of Razorpay, the rail in the plan. The build rule survives in a narrower form:
**we build no retry scheduler of our own**, because Razorpay Subscriptions carries the retries and
the `halted` state. Dunning in `53` section 5.2 should start at Razorpay's `subscription.halted`
webhook, not at the first failure. `CLAUDE.md` lists "one payment attempt" as settled, so the
founder confirms the narrower form before either file changes.

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

- The RBI framework and two Razorpay pages were opened on 18 September 2026. Everything else is
  carried from the PRD of 29 August and the pack files named above.
- No Razorpay retry count or interval beyond the quoted lines was opened.
