---
id: ADR-0013-accounts-to-the-company
title: Every account moves to the company before the first stranger's document is stored
mode: explanation
tier: canonical
status: decided
verified_against: d9a142d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0013]
---

# ADR-0013. Every account moves to the company before the first stranger's document is stored

**Decision id:** ADR-0013. **Open decision closed:** D10 in `56-OPEN-DECISIONS.md`. **Decided:**
18 September 2026 `[Z]`. **Pack commit:** `dd048fe`, 18 September.

## Context

- The product's accounts grew up on whatever was to hand: a studio user account, a studio Gmail
  account, a founder's personal Cloudflare account.
- Once a stranger's document is stored, whoever holds those accounts holds that document. A
  personal account is hard to explain to a regulator, a customer or an investor afterwards.

## Decision

**All of them.** Every account in `docs/mvp0/PRODUCT-PLAN.md` section 24 moves to the company before
the first stranger's document is stored.

## Evidence

- `56-OPEN-DECISIONS.md` section 0, D10, records the answer, `[Z]`.
- `56-OPEN-DECISIONS.md` section 2, D10, gave the recommendation: holding a stranger's documents on a
  personal account is the row hardest to explain afterwards.
- `docs/mvp0/PRODUCT-PLAN.md` section 24 is the inventory, read on 18 September:

Asset | Held by today | Plan's date to move
GitHub repository `studiozephyrus/frontmatter` | the studio's user account | before the pilot
Vercel project | team `zsco` | before the pilot
Firebase project `frontmatter-md` | a studio Gmail account | retired in phase A
Cloudflare zone `frontmatter.in` | a founder's personal account, by choice | before the first stranger
Domain registration | Registrar GoDaddy, registered 2026-06-24, expires 2029-06-24 `[M]`. The registrant is redacted, so `UNVERIFIED:` which account holds it. needs: the GoDaddy account owner to confirm | before the first stranger
Razorpay | not opened | before the first rupee
Apple Developer Program | not opened | phase F
Model provider accounts | not opened | phase B
Analytics and error accounts | None in the code `[O]`: no Sentry, PostHog or Vercel Analytics package in `package.json`. Nothing to move yet; each is opened in the company's name when added | phase A
Intellectual property between the founders | `UNVERIFIED:` no written agreement is in the repository. needs: the founders to confirm whether one exists, which is a legal document this record cannot check | before the first rupee, as a written agreement

- `54-COMPLIANCE-AND-LEGAL.md` carries this as legal row `L03`, widened on 18 September by D10 to
  every account in section 24, due 15 October 2026. `L10` is the founders' agreement on
  intellectual property, due before the first rupee.

## Alternatives rejected and why

Alternative | Why rejected
Move only the accounts that hold documents | The founder answered "all of them"
Move accounts as each phase needs them | The plan's own per-row dates stay as deadlines, but none may fall after the first stranger's document
Keep the Cloudflare zone personal, by design | `AGENTS.md` section 6b records the split as deliberate. This decision overrides it for the move

## Consequences

- **The decision tightens the plan's dates.**
- The plan lets the Apple account wait for phase F and the
  intellectual property agreement wait for the first rupee. Under D10, anything that holds or serves a
  stranger's document must have moved first.
- `INFERENCE:` accounts not yet opened, such as Razorpay and Apple, are opened in the company's name
  from the start rather than moved.
- The repository's credentials in `AGENTS.md` section 6b change when GitHub and Vercel move, and so
  does every deploy command that names `zsco`.
- **A contradiction to settle.** Section 24 says the Firebase project is retired in phase A, while
  ADR-0007 keeps Firebase Auth and Firestore. `INFERENCE:` a company-owned Firebase project replaces
  it. The plan does not say so.

## What would reverse it

- Nothing expected. Moving an account back to a person would need its own decision and its own
  legal reason.

## Limits of this record

- Three rows of the inventory were unverified in the plan itself. Checked on 18 September 2026:
  - Domain: `curl -sL https://rdap.org/domain/frontmatter.in` returns the registrar and dates in the
    table. The registrant is redacted.
  - Analytics and errors: `grep -i -E '"(@sentry|posthog|@vercel/analytics|@vercel/speed)' package.json`
    returns nothing. `grep -rli "sentry\|posthog" src` finds two files,
    `src/instrumentation.ts` and `src/app/error.tsx`, and both only reserve a hook in comments.
  - Intellectual property: cannot be checked from the repository. It stays unverified, as the
    table says.
- Whether the company exists as a legal entity able to hold each account was not checked here.
