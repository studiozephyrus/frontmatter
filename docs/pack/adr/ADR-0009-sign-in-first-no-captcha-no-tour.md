---
id: ADR-0009-sign-in-first-no-captcha-no-tour
title: Sign in first, with no captcha and no tour
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0009]
---

# ADR-0009. Sign in first, with no captcha and no tour

**Decision id:** ADR-0009. **Decided:** by the founders `[Z]`, carried in `docs/mvp0/PRODUCT-PLAN.md`
section 3. **Recorded here:** 18 September 2026. **First written into the plan:** 17 September 2026,
commit `7b49f84` ("mvp0: product plan v4"). `[O]` the earliest commit under `docs/` returned by
`git log --reverse -i -S "Sign in first"` and by the same search for "no captcha". Git dates the
text; the founders' spoken choice may be earlier and is not recorded anywhere.

## Context

- Many editors let a stranger type before signing in, then ask for an account to save.
- This product holds a person's private documents, and every change in the queue needs an author.
  See ADR-0008.
- It also serves free AI calls, so an anonymous visitor would be a cost with no name attached.
- The founders' promise is a tool that needs nothing explained to someone who knows Google Docs.

## Decision

- **Sign in first. No anonymous editing.** Google or GitHub, one tap, no password.
- **No captcha and no puzzle, ever.** Abuse is bounded by budgets behind the sign-in, not by
  challenges in front of it.
- **No tour.** A tip appears once, the first time a person hovers a control they have not used.

## Evidence

- `docs/mvp0/PRODUCT-PLAN.md` section 1 gives the promise in the founders' words: no captchas, no
  puzzles, no tour.
- `docs/mvp0/PRODUCT-PLAN.md` section 3, the Front door row: sign in first, the Google Docs model,
  `[Z]`.
- The same row records the counter-evidence honestly: four of five UX sources argue for delaying
  sign-in. So the sign-in must cost one tap and nothing else.
- `docs/mvp0/PRODUCT-PLAN.md` section 5, S01: the sign-in page shows the editor once, so the page is
  not a wall, and its fine print lists what we do not do.
- `docs/mvp0/PRODUCT-PLAN.md` section 16 quotes Nielsen on why tutorials fail, and Apple on
  context-specific tips over one onboarding flow.
- `27-MODEL-ROUTING-SPEC.md` section 9.1: one uncapped account costs 9.1 times the whole honest free
  population's month. A captcha inspects the honest majority. A budget bounds the abusive tail.

## Alternatives rejected and why

Alternative | Why rejected
Anonymous editing, sign in to save | Every queue item needs an author, and free AI calls need an account to bound
A captcha or puzzle at sign-in | The founders' rule. `27-MODEL-ROUTING-SPEC.md` section 9.2 also scores it as paid by every honest user
A card on the free tier | The most effective abuse control on that list, and very high friction in India. Rejected in section 9.2
Device fingerprinting | Needs a consent modal on the front door, per section 9.2
A guided tour | The plan's section 16 sources: tutorials interrupt and are quickly forgotten

## Consequences

- There is no signup form, so there is no address field to check.
- Abuse control is a stack of budgets behind sign-in, listed in `27-MODEL-ROUTING-SPEC.md`
  section 9.2: a per-account token bucket, a service-wide breaker, and an allowance that grows with
  account age.
- `56-OPEN-DECISIONS.md` recommends under D12 that a link-edit holder also needs an account, because
  the front door forbids anonymous editing.
- **One founder ruling is owed.** `27-MODEL-ROUTING-SPEC.md` section 9.4 asks whether an invisible
  Cloudflare Turnstile widget, which shows nothing and asks nothing, counts as a captcha under this
  rule. The managed widget is banned because it can show a checkbox.

## What would reverse it

- Pilot data showing sign-in-first loses most visitors before they see the editor. The plan's own
  sources lean that way, which is why the page shows the product behind the button.
- An abuse pattern the budgets cannot bound. Even then the plan's answer is a tighter budget, not a
  puzzle.

## Limits of this record

- The plan tags "no captcha, ever" on S01 as `[L]`, an external constraint. It reads as a founders'
  rule, `[Z]`. `INFERENCE:` the tag is a slip, and the plan's owner should say which.
- No UX source was re-opened for this record.
