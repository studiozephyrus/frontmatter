---
spec: 1
id: auth/sign-in
title: The front door, one tap to a session with no password, no captcha and no tour
type: surface
state: draft
prd_file: docs/mvp0/PRODUCT-PLAN.md
prd_sha256: "da29fced004ca1c5d85efc8f5911a2861debd5cae28e793b27eb9ed23cc79a6e"
prd_sections: ["3", "5", "16", "23"]
governs:
  - src/modules/auth/presentation/*.tsx
  - src/app/(auth)/**
verify:
  - node specs/harness/spec-report.mjs --id auth/sign-in
  - npx vitest run test/auth
  - "! grep -rilE 'captcha|recaptcha|hcaptcha|turnstile' src package.json"
  - "! grep -iE 'shepherd|driver.js|intro.js|joyride' package.json"
depends_on: [auth/session]
screens: [S01]
refusals: [E061, E106, E109, E562, E800]
red_proof: test/auth/sign-in/no-password-field.test.ts
budget: 3000
owner: sagnik
updated: 2026-09-20
commit: 6c44319
x:
  batch: 2
  features: [F101, F102, F103]
  acceptance: [A001, A002, A003, A004, A005, A006, A008, A505, A506, A507, A508, A509, A510, A511]
  governs_planned:
    - test/auth/sign-in/**
  founder_dependencies:
    - "Magic link, founder question 18: written to the recommendation, flag.auth.magiclink off at launch, and when on a third button, never a form"
    - "Age line, founder question 12: written to the recommendation, one line under the buttons linked to the terms, no date-of-birth field"
    - "Wordmark or mark on the card: carried with S04 D01, needs the founder (brand)"
---

# The front door

## Contract

`/login` lets a person into the product in one tap. Two providers, Google first, then GitHub, each a
single button that opens the provider and returns a session. There is no password field, no email
field, no captcha, no puzzle, no bot check and no tour, on this route or anywhere behind it
(ADR-0009, a standing founders' rule). The card never depends on the preview column, and the pages
that make its fine print checkable, `/privacy`, `/terms`, `/pricing` and `/refunds`, answer without
an account. How the provider result becomes a server session is `auth/session`; this lane owns the
door and nothing behind it.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | Zero elements of type `password` and zero captcha-vendor iframes on the route | The shipped `PasswordLoginForm` is a username and password form, which breaks the founders' rule on the one screen everybody sees | `T100` (A001), `test/auth/sign-in/no-password-field.test.ts` |
| 2 | No captcha or tour library anywhere in the source or the manifest | A launch-week abuse scare adds a widget "just for now" | `T101` and `T105` (A002, A006); the two `grep` lines in `verify:` are PROXY checks and say so |
| 3 | Exactly two sign-in controls, labelled `K.s01.google` and `K.s01.github` | A third route appears as a form and the card stops being one tap | `T102` (A003) |
| 4 | Both provider marks are inline `<svg>`, the Google mark keeps its four source fills, and no icon font is requested | A mark rendered from a web font shows ligature text or a tofu box when the font is blocked | `T505`, `T506`, `T507` (A505 to A507) |
| 5 | Focus lands on the Google button on arrival; a cancelled popup returns to the card with both buttons enabled | A cancelled sign-in leaves the card disabled and the person reloads | `T508`, `T509` (A508, A509) |
| 6 | A restored session replaces the route with `/` and the card element is never inserted | A flash of the card to a signed-in person, then a jump | `T510` (A510), mutation observer from first byte |
| 7 | At 390 px the preview column has no rendered box and there is no horizontal scroll | The phone view scrolls sideways on the front door | `T511` (A511) |
| 8 | The four public pages answer 200 signed out, checked with `curl -sI`, never `curl -sL` | A 307 to `/login` makes the fine print uncheckable, and `-L` hides it behind a 200 | `T103`, `T104` (A004, A005) |
| 9 | A provider error is shown as its catalogue id, never as the raw provider string | A Firebase error code leaks to a person as text | `test/auth/sign-in/error-ids.test.ts` against `E061`, `E109`, `E562`, `E800` |

## Interface

- Route: `src/app/(auth)/login/page.tsx`, composed from `LoginScreen` in the auth barrel.
- Port: `AuthGateway` in `src/modules/auth/application/ports.ts`, owned by `auth/session`. This lane
  calls `signInWithGoogle()` and a new `signInWithGitHub()`; the second is not on the port today
  (pattern `signInWithGoogle(): Promise<AuthUser>;` has no GitHub sibling).
- Brand marks: `docs/mvp0/screens/icons/brand-google.svg` and `brand-github.svg`, inlined. Brand
  marks are not Material Symbols; every other icon on the route is a Material Symbol as inline SVG.
- Copy ids: the `K.s01.*` set in `16-COPY-DECK.md`. The training promise text is the same copy id the
  locked row on S37 renders (A718, owned by `config/panel`).

## Behaviour

| Event | What happens |
|---|---|
| Tap Google or GitHub | One popup, both buttons disabled, the tapped one busy. Desktop uses the system browser and the protocol handler |
| Popup blocked | `E800`, buttons enabled |
| Person cancels | `E562`, back to the card, nothing apologised for |
| Offline | `E109`, nothing queued |
| Provider succeeds | Hand the ID token to `auth/session`; route to `/` only after it confirms the session |
| Session exchange fails | `E106` on the card; no half-made account (A512 belongs to `auth/session`) |
| A visitor from the European Union | Recommended, not built: the buttons are replaced by one line saying sign-ups are not open there yet, from the request's country header; nothing stored (`18-FIRST-RUN-AND-EMPTY.md` section 12) |

## Refusals

- **Any password, email or magic-link form on the card is refused at review and by invariant 1.**
  `flag.auth.magiclink` exists on S37 and stays off; when on, it adds a third button, never a field.
- **Any captcha, including an invisible widget, is refused** until the founders rule on the invisible
  Turnstile question in ADR-0009's consequences. The lane does not guess that invisible is allowed.
- **Recolouring the Google mark is refused.** It keeps its own fills.

## Red proof

`test/auth/sign-in/no-password-field.test.ts` (not yet written) renders the login route and asserts
zero `input[type=password]`. It must **fail** against the tree at `6c44319`, where
`src/modules/auth/presentation/LoginScreen.tsx` renders `<PasswordLoginForm />`. Only after it fails
may the form be removed. Invariant 6 needs its own red proof against a build that renders the card
before `observeUser` settles.

## Verification

- `npx vitest run test/auth` runs today and covers the gateway and the allowlist; the S01 tests
  above are added under `test/auth/sign-in/`.
- A008, the sixty-second stopwatch on a mid-range Android over 4G, is a manual measurement: median
  of three runs, recorded with the device and network named.
- The public-page checks run against the deployment, not localhost.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-09-20: both providers ship in batch 2 (S01 D05, resolved as proposed on 18 Sep, founder
  review). GitHub moves behind the port rather than staying on Auth.js.
- 2026-09-20: this lane owns the door only. The session, the account record and the Auth.js removal
  are `auth/session`, so the door can be rebuilt without touching authorisation.

## Open

- The age line and the magic link are written to the recommendations above and move if the
  founder answers otherwise.
- `firebase.json` enables `googleSignIn` only. GitHub must be enabled in the company-owned Firebase
  project (ADR-0013, batch 1) before invariant 3 can pass live.

## Next

    node specs/harness/spec-report.mjs --id auth/sign-in
    npx vitest run test/auth
