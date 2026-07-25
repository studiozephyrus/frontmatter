# sgnk-md Batch 2 — Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).

**Goal:** Gate the whole app behind GitHub login restricted to a single allowlisted user (`sagnikmitra`), establishing a server-resolved `ActorContext` that later batches (vault read, commit) build on.

**Architecture:** Auth.js (NextAuth v5) GitHub provider for identity only (minimal scope). Allowlist enforced in the `signIn` callback AND re-checkable in every API route. Session is a JWT cookie; the GitHub access token never reaches the client. Auth lives in the `auth` module (hexagonal): domain `ActorContext` + allowlist policy, application port, infrastructure Auth.js config, presentation session helpers + login page. Unauthenticated requests to the `(vault)` group are redirected to `/login` by `proxy.ts`.

**Tech Stack:** `next-auth@beta` (v5), Next 16 `proxy.ts`, zod env. Reference: spec §5.

**Secrets (set in Vercel env + `.env.local`; provisioned by the user — see Task 7):** `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` (GitHub OAuth App), `AUTH_SECRET` (generated), `ALLOWED_GH_LOGIN=sagnikmitra`, `AUTH_URL=https://md.sgnk.ai`.

**Conventions:** no `any`; no silent failures; `process.env` only in `config`/`infrastructure`; gate green per task. Build must NOT require auth secrets at module load (lazy access) so SSG/CI still pass without them.

---

### Task 1: Auth env (extend config, lazy)

**Files:** Modify `src/config/env.ts`; Test `test/config/env.test.ts`.

- [ ] **Step 1: Add a separate `parseAuthEnv` (so the existing `APP_URL` env stays independent and build doesn't require auth secrets).** Write failing test:
```ts
import { parseAuthEnv } from "@/config/env";
describe("parseAuthEnv", () => {
  it("parses auth secrets", () => {
    const e = parseAuthEnv({ AUTH_GITHUB_ID: "id", AUTH_GITHUB_SECRET: "s", AUTH_SECRET: "x", ALLOWED_GH_LOGIN: "sagnikmitra" });
    expect(e.ALLOWED_GH_LOGIN).toBe("sagnikmitra");
  });
  it("throws when a required auth var is missing", () => {
    expect(() => parseAuthEnv({})).toThrow();
  });
});
```
- [ ] **Step 2:** Run → fails.
- [ ] **Step 3:** Implement `parseAuthEnv` with a zod schema (`AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET` all `z.string().min(1)`, `ALLOWED_GH_LOGIN` default `"sagnikmitra"`). Export `authEnv` as a lazy Proxy (same pattern as `env`) so it only throws on access, never at import/build.
- [ ] **Step 4:** Run → passes. Gate `npm run typecheck && npm run lint && npm run test`.
- [ ] **Step 5:** Commit `feat(sgnk-md): auth env config`.

---

### Task 2: Allowlist policy (domain, TDD)

**Files:** Create `src/modules/auth/domain/allowlist.ts`, `src/modules/auth/domain/actor.ts`; Test `test/auth/allowlist.test.ts`.

- [ ] **Step 1: Failing test:**
```ts
import { isAllowed } from "@/modules/auth/domain/allowlist";
describe("isAllowed", () => {
  it("allows the configured login (case-insensitive)", () => {
    expect(isAllowed("sagnikmitra", "sagnikmitra")).toBe(true);
    expect(isAllowed("SagnikMitra", "sagnikmitra")).toBe(true);
  });
  it("rejects anyone else", () => {
    expect(isAllowed("someone", "sagnikmitra")).toBe(false);
    expect(isAllowed(undefined, "sagnikmitra")).toBe(false);
  });
});
```
- [ ] **Step 2:** Run → fails.
- [ ] **Step 3:** Implement `isAllowed(login: string | undefined, allowed: string): boolean` (case-insensitive compare). Add `ActorContext` type in `actor.ts`: `{ login: string; name: string | null; avatarUrl: string | null }` (NO token — token stays in the encrypted JWT, never in ActorContext exposed to UI).
- [ ] **Step 4:** Run → passes.
- [ ] **Step 5:** Commit `feat(sgnk-md): auth allowlist policy + ActorContext`.

---

### Task 3: Auth.js config (infrastructure)

**Files:** Create `src/auth.ts` (root Auth.js instance), `src/modules/auth/infrastructure/auth-options.ts`; install `next-auth@beta`.

- [ ] **Step 1:** `npm i next-auth@beta`.
- [ ] **Step 2:** Implement `auth-options.ts`: NextAuth config with `GitHub` provider (`clientId`/`clientSecret` from `authEnv`, `authorization: { params: { scope: "read:user" } }`). Callbacks:
  - `signIn({ profile })` → `return isAllowed(profile?.login, authEnv.ALLOWED_GH_LOGIN)` (reject non-allowlisted).
  - `jwt({ token, profile, account })` → on first sign-in store `token.login = profile.login`, `token.name`, `token.picture`; (do NOT expose `account.access_token` to the client session — keep it only if needed server-side later, B6 uses the GitHub App instead).
  - `session({ session, token })` → attach `session.user.login = token.login`.
  - `pages: { signIn: "/login" }`, `session: { strategy: "jwt" }`, `secret: authEnv.AUTH_SECRET`.
- [ ] **Step 3:** `src/auth.ts`: `export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);`
- [ ] **Step 4:** Add module-augmentation types so `session.user.login` and `token.login` are typed (no `any`).
- [ ] **Step 5:** Gate `npm run typecheck && npm run lint && npm run build` (build must pass without secrets — confirm lazy `authEnv` doesn't run at build).
- [ ] **Step 6:** Commit `feat(sgnk-md): Auth.js GitHub provider with allowlist`.

---

### Task 4: Route handler + session helper (presentation/delivery)

**Files:** Create `src/app/api/auth/[...nextauth]/route.ts`, `src/modules/auth/presentation/session.ts`, `src/modules/auth/index.ts`.

- [ ] **Step 1:** `route.ts`: `export const { GET, POST } = handlers;` (from `@/auth`).
- [ ] **Step 2:** `session.ts`: `getActor(): Promise<ActorContext | null>` — calls `auth()`, maps the session to `ActorContext` or null. `requireActor()` — throws/redirects if null.
- [ ] **Step 3:** `index.ts` barrel exports `getActor`, `requireActor`, `ActorContext`.
- [ ] **Step 4:** Gate.
- [ ] **Step 5:** Commit `feat(sgnk-md): auth route handler + session helpers`.

---

### Task 5: Login page + protected (vault) group

**Files:** Create `src/app/(auth)/login/page.tsx`, `src/app/(auth)/layout.tsx`; MOVE `src/app/page.tsx` → `src/app/(vault)/page.tsx`; add `src/app/(vault)/layout.tsx` (server-guards via `getActor`).

- [ ] **Step 1:** Login page: a centered "Sign in with GitHub" button that calls a server action invoking `signIn("github")`. Themed with Tailwind tokens. If already authed, redirect to `/`.
- [ ] **Step 2:** Move the home page (AppShell) into `(vault)/page.tsx`. Add `(vault)/layout.tsx` that calls `getActor()`; if null → `redirect("/login")`. Render a small top-bar user chip (name/avatar) + sign-out button (server action `signOut`).
- [ ] **Step 3:** Confirm route URLs unchanged (`/` still the shell when authed; `/login` for sign-in). Run `npm run build` and check route output.
- [ ] **Step 4:** Gate (full `verify`).
- [ ] **Step 5:** Commit `feat(sgnk-md): login page + protected vault route group`.

---

### Task 6: proxy.ts auth gate

**Files:** Modify `src/proxy.ts`.

- [ ] **Step 1:** Add an optimistic gate: read the session cookie (Auth.js `authjs.session-token` / `__Secure-authjs.session-token`); if absent and the path is not `/login`, `/api/auth/*`, or static, redirect to `/login`. Keep the security headers. (Optimistic only — the `(vault)/layout.tsx` server check from Task 5 is the real guard; proxy just avoids flashing the shell.)
- [ ] **Step 2:** `npm run build`; confirm `ƒ Proxy (Middleware)` still listed and headers still applied (curl on prod start).
- [ ] **Step 3:** Gate. Commit `feat(sgnk-md): proxy auth gate + headers`.

---

### Task 7: Live cutover (USER-PROVISIONED SECRETS — pauses for input)

> GitHub OAuth Apps can't be created via API. The user creates one; controller wires env + verifies.

- [ ] **Step 1 (user):** Create a GitHub OAuth App at https://github.com/settings/developers → New OAuth App:
  - Application name: `sgnk-md`
  - Homepage URL: `https://md.sgnk.ai`
  - Authorization callback URL: `https://md.sgnk.ai/api/auth/callback/github`
  - Generate a client secret. Provide **Client ID** + **Client Secret** to the controller.
- [ ] **Step 2 (controller):** Generate `AUTH_SECRET` (`openssl rand -base64 32`). Set Vercel env (production) via API: `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET`, `ALLOWED_GH_LOGIN=sagnikmitra`, `AUTH_URL=https://md.sgnk.ai`. (Never print values.)
- [ ] **Step 3 (controller):** Redeploy (the merge/push triggers a build since `src/**` changed). Verify: visiting `https://md.sgnk.ai/` while logged-out redirects to `/login`; signing in as `sagnikmitra` reaches the shell; a different GitHub account is rejected.
- [ ] **Step 4:** Commit any env-doc updates (`.env.example` already lists the keys).

---

## Self-Review
- Spec §5 coverage: OAuth login (T3), allowlist (T2/T3 signIn), least-privilege scope `read:user` (T3), ActorContext (T2/T4), defense-in-depth allowlist re-check available via `getActor`/`requireActor` (T4), protected routes (T5/T6), no token to client (T3 jwt/session). ✅
- Build-without-secrets: lazy `authEnv` (T1/T3) keeps CI/SSG green. ✅
- GitHub App for commits is B6, not here (B2 = identity only). ✅
- Placeholder scan: none. Type consistency: `ActorContext`, `getActor`, `requireActor`, `isAllowed`, `authEnv`, `parseAuthEnv` consistent across tasks. ✅

## Definition of done
`npm run verify` green; logged-out → `/login`; only `sagnikmitra` can sign in; shell shows user chip + sign-out; secrets in Vercel; live login works at md.sgnk.ai.
