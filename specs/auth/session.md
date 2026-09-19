---
spec: 1
id: auth/session
title: One session model on Firebase Auth, the account record, and the move off Auth.js
type: platform
state: draft
prd_file: docs/mvp0/PRODUCT-PLAN.md
prd_sha256: "da29fced004ca1c5d85efc8f5911a2861debd5cae28e793b27eb9ed23cc79a6e"
prd_sections: ["3", "15", "18", "24", "30"]
governs:
  - src/modules/auth/{domain,application,infrastructure}/**
  - src/modules/auth/presentation/*.ts
  - src/modules/auth/index.ts
  - src/auth.ts
  - src/app/api/auth/**
verify:
  - node specs/harness/spec-report.mjs --id auth/session
  - npx vitest run test/auth test/proxy.test.ts
  - npm run arch
depends_on: [data/firestore-rules, data/storage-adapters]
refusals: [E061, E106]
red_proof: test/auth/session/first-write-atomic.test.ts
budget: 3000
owner: sagnik
updated: 2026-09-20
commit: 6c44319
x:
  batch: 2
  features: [F101, F102]
  acceptance: [A512, A145]
  governs_planned:
    - test/auth/session/**
  founder_dependencies:
    - "Batch 1: every account moved to the company (D10, ADR-0013). The Firebase project frontmatter-md is held by a studio Gmail account; ADR-0007 records the contradiction and infers a company-owned project replaces it"
    - "The super-admin field name on users/{uid} is not in 21-DATA-MODEL.md; superAdmin below is a proposal until that file adopts it"
---

# One session model

## Contract

There is exactly **one** session mechanism: a Firebase Auth identity, verified on the server. The
browser signs in through `AuthGateway` (Google or GitHub), sends the Firebase ID token to one
server route, and the server verifies it, creates the account record on first sign-in, and only then
sets the session. `getActor()` reads that session and nothing else. The shipped app has **three**
paths that grant different things (`24-SERVER-SPEC.md` section 24.7): Auth.js GitHub, the
`sgnk-password` username and password provider, and a browser-only Firebase Google path that no
server verifies. This lane removes the first two and finishes the third. Two session systems is how
authorisation bugs are made, so the lane refuses to leave both standing.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | The server verifies the Firebase ID token before any session exists | A browser-held token that nothing checks is a session anybody can forge | `test/auth/session/verify-token.test.ts`: a token with a bad signature is refused |
| 2 | First sign-in writes `users/{uid}` **before** the session cookie is set; if the write fails, no cookie and zero account records | A half-made account: a session with no record, or a record nobody can sign into | `T512` (A512), `test/auth/session/first-write-atomic.test.ts` |
| 3 | No Auth.js and no password provider remain in `src/` | Two session models, one of which admits one hard-coded GitHub login | `test/auth/session/single-mechanism.test.ts`; a `grep` for `next-auth` and `sgnk-password` under `src/` is a PROXY check and says so |
| 4 | `plan`, `superAdmin` and every billing field on the account are server-owned; a client may only ever write `plan: 'free'` at creation | A person upgrades themselves, or makes themselves a super admin | owned jointly with `data/firestore-rules`, emulator test there |
| 5 | Super admin is a flag on the account, checked server side on every configuration write, never in the browser and never from `ALLOWED_GH_LOGIN` | A hidden button is mistaken for a gate; a single GitHub login default becomes the admin model | `T037` (A145), `test/auth/session/super-admin-server-only.test.ts` |
| 6 | The dev bypass keeps all three gates, in both copies, and the copies agree | A bypass reachable in production, or a local developer bounced through a provider | `npx vitest run test/proxy.test.ts` plus a new test asserting `session.ts` and `src/proxy.ts` accept and refuse the same hosts |
| 7 | The proxy's cookie list names the new session cookie and no Auth.js cookie | Every signed-in person is 307'd to `/login` by the optimistic redirect | `test/proxy.test.ts` extended with the new cookie name |

## Interface

- Port: `AuthGateway` in `src/modules/auth/application/ports.ts`. Add `signInWithGitHub(): Promise<AuthUser>`.
  `getIdToken` is declared and implemented today and has no caller; this lane gives it one.
- Server verification: `firebase-admin` is **not a dependency** today (`grep -rn "verifyIdToken\|firebase-admin" src/ package.json`
  prints nothing). Proposed mechanism: the Admin SDK's session cookies, `createSessionCookie` then
  `verifySessionCookie`. **Not opened in this session**; confirm against the Firebase Admin
  documentation before building, and record the page and date here.
- Session read: `getActor()` in `src/modules/auth/presentation/session.ts`, pattern
  `import { auth } from "@/auth";`, which is the Auth.js dependency to remove.
- Auth.js today: `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`,
  `src/modules/auth/infrastructure/auth-options.ts` (pattern `isAllowed(ghProfile?.login, authEnv.ALLOWED_GH_LOGIN)`),
  `password.ts`, `sign-in-password.ts`, `next-auth.d.ts`.
- Proxy: `src/proxy.ts`, pattern `const SESSION_COOKIE_NAMES = ["authjs.session-token", "__Secure-authjs.session-token"];`
  and `function isLocalDevBypass(`. The proxy is ungoverned; this lane proposes the two edits and
  whichever lane later owns the proxy accepts them.
- Account record: `users/{uid}` per `21-DATA-MODEL.md` section 21.4, written through the Firestore
  adapter of `data/storage-adapters`.

## Behaviour

| Step | Server does | On failure |
|---|---|---|
| 1 | Receive the ID token on one route | 401, nothing written |
| 2 | Verify signature, audience, expiry and revocation | 401, nothing written |
| 3 | First sign-in only: write `users/{uid}` with `plan: 'free'`, `providers`, `createdAt`, `lastSeenAt` | `E106`, no cookie, zero records |
| 4 | Set the session cookie | the record exists and the person retries; the next exchange finds it and does not write a second |
| 5 | `getActor()` on every route returns the actor from the verified cookie | null, and the route answers 401 |

## Refusals

- **A token the server cannot verify is refused**, never trusted because the browser says so.
- **A second account record for one uid is refused.** Creation is idempotent on the uid.
- **Keeping Auth.js "for now" beside Firebase is refused** (S01 D05, resolved as proposed 18 Sep).
- **Reusing `ALLOWED_GH_LOGIN` as the super-admin check is refused** (`28-CONFIGURATION-PANEL-SPEC.md`
  section 12). It is one GitHub login with a default, not a decision.

## Red proof

`test/auth/session/first-write-atomic.test.ts` (not yet written) makes the `users/{uid}` write fail
and asserts no session cookie and zero records. It must **fail** against a build that sets the
cookie before the write. Invariant 1's test must fail against the tree at `6c44319`, where no server
code verifies a Firebase token at all.

## Verification

- `npx vitest run test/auth test/proxy.test.ts` runs today over the existing auth and proxy tests.
- `npm run arch` stays at total 0: the Admin SDK is imported only under `infrastructure/`, and its
  environment reads only in `src/config/` or `*/infrastructure/`.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-09-20: one mechanism, Firebase Auth verified on the server, chosen over issuing an Auth.js
  session from a Firebase token, because S01 D05's resolution rejects Auth.js as a second session
  system and ADR-0007 names Firebase Auth.
- 2026-09-20: the account record is created by the server at the session exchange, not by the
  browser, so A512's "no cookie and zero records" is one transaction boundary on one machine.

## Open

- Session length and revocation on sign-out are not specified anywhere in the pack. They need a
  number from the founder or `43-THREAT-MODEL.md`, not a guess here.
- The trial fields of D08 are written at account creation in batch 7. This lane must not preclude
  them; it does not write them.

## Next

    node specs/harness/spec-report.mjs --id auth/session
    npx vitest run test/auth test/proxy.test.ts
