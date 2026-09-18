---
id: ADR-0015-one-live-collaborator-on-free
title: One live collaborator on Free
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0015]
---

# ADR-0015. One live collaborator on Free

**Decision id:** ADR-0015. **Decided:** 18 September 2026 `[Z]`, in the founders' screen review.
**Recorded here:** 18 September 2026.

## Context

- Live editing, screen S19, puts two or more people in one document at once. It runs on a Durable
  Object held open for the session, per ADR-0007.
- Revision 6 of the plan recommended three live collaborators on Free, matching the market.
- The founders' earlier candidate had been one.

## Decision

- **Free: one live collaborator per document, besides the owner.** Pro: unlimited.
- The value is the panel row `limits.collab.live`, so it can change without a release.

## Evidence

Every citation below was opened with `sed -n` on 18 September 2026.

- `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:157` records the instruction, `[Z]`: Free gets one
  collaborator, Pro gets several.
- `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:305` records the confirmation: one collaborator on Free, on
  cost grounds, and section 13 of the plan changes to match.
- `53-PRICING-AND-ENTITLEMENTS.md` section 3 gives the reason in full. A live session holds a Durable
  Object open for as long as two people are in it. That is the one free-tier cost that scales with
  time rather than with calls.
- `docs/mvp0/PRODUCT-PLAN.md` section 3, the Free caps row, now reads one live collaborator and names
  it the founders' decision of 18 September.

## Alternatives rejected and why

Alternative | Why rejected
Three, the market figure | `53` section 3 cites HackMD's "3 invitees" and AFFiNE's "Up to 3 members". The founders chose cost over parity
Two | Never on the table. `[O]` the plan's section 13 table lists the founders' candidate, 1, and the market's figure, 3, and `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:305` confirms 1. No record names two, so there is no reason for rejecting it to cite. `INFERENCE:` the cost argument applies to two as it does to three
Zero, live editing as Pro only | Not considered in the record. Free would lose the only way to show live editing

## Consequences

- `28-CONFIGURATION-PANEL-SPEC.md` section 10.2: over the cap, a session already open finishes, and
  no new session starts.
- Sharing by link, comments and the change queue are not live sessions, so this cap does not bound
  them. `INFERENCE:` the plan's section 27 leans on those to carry collaboration if live editing is
  thin.
- Live editing sits in batch 4 of `50-ROADMAP.md`, behind `flag.collab.live`, which defaults to off.

## What would reverse it

- Durable Object cost at pilot scale turning out small enough that three costs little more than one.
  `UNVERIFIED:` no per-session cost measurement exists in the pack. needs: Cloudflare's Durable
  Object duration billing read for the pilot's live sessions, once `flag.collab.live` is on.
- Pilot evidence that one collaborator stops Free users from trying the product with a colleague.

## Limits of this record

- The cost argument is qualitative in its sources. No number was derived for it here.
