---
mode: reference
updated: 2026-09-09
verified_against: e318ab3
---

# Third-party integrations

> **Method.** I read `AGENTS.md`, `package.json`, `next.config.ts`, `vercel.json`,
> `firebase.json`, `firestore.rules`, `src/proxy.ts`, `src/auth.ts`,
> `src/config/env.ts`, `src/instrumentation.ts`, `src/container/dependency-container.ts`,
> `src/container/client-container.ts`, `src/shared/infrastructure/github/client.ts`,
> `src/shared/infrastructure/firebase/client.ts`,
> `src/modules/auth/infrastructure/auth-options.ts`,
> `src/modules/ai/infrastructure/gateway-client.ts`,
> `src/modules/repository/infrastructure/github-writer.ts`,
> `src/app/api/export/pdf/[...path]/route.ts`, `src/app/api/ai/complete/route.ts`,
> `scripts/vercel-ignore-build.sh`, `src-tauri/tauri.conf.json` and
> `src-tauri/capabilities/default.json`, and I ran greps for `fetch(`,
> `api.github.com`, `firestore(`, `process.env`, `firebase-admin` and `cloudflare`
> across `src/`. I ran `node specs/harness/clean-architecture-report.mjs`.
>
> **What this pass did NOT do.** It did not run the app, did not make a single live
> call to GitHub, an AI provider, Firebase or Vercel, and did not render a PDF. Every
> failure mode below is read off the code path, not observed. It did not read
> `.env.example` or `.env.local` (both are blocked to this session, and reading them
> is out of scope anyway). It did not open the Vercel, Firebase or Cloudflare
> dashboards, so nothing here confirms what is actually provisioned in those accounts —
> only what the code expects. It did not audit `node_modules` for transitive network
> calls. It did not read the large `docs/` records (PRD v2, RECORD, ENGINE, CRITIQUE,
> DEV-PLAN); it read `docs/PRODUCT-BRIEF.md` only through targeted greps.

---

## 1. The shape of it

frontmatter is a Next.js app deployed on Vercel whose **single source of truth is a
GitHub repository**. There is no application database. Notes are files in a repo; reads
go through the GitHub REST API; writes go through the GitHub Git Data API as real
commits. Everything else — AI, Firebase, headless Chromium, Cloudflare, Tauri — is
either an enhancement layered on top, or infrastructure around the edges.

Counts, from commands run at `e318ab3`:

| Thing | Count | Command |
|---|---|---|
| TypeScript/TSX files under `src/` | 226 | `find src -type f \( -name '*.ts' -o -name '*.tsx' \) \| wc -l` |
| Module folders under `src/modules/` | 13 (excluding `README.md`) | `ls -1 src/modules \| grep -v README \| wc -l` |
| Test files under `test/` | 101 | `find test -type f \( -name '*.ts' -o -name '*.tsx' \) \| wc -l` |
| API route handlers | 26 | `find src/app/api -name 'route.ts' \| wc -l` |

Those last three differ from the figures in the brief I was given (14 modules, 81 test
files, 12 route handlers). I report what the commands returned. I did not investigate
when or how the counts diverged.

Outbound network calls made by application code are narrow. A grep for `fetch(` across
`src/` returns 1 call to an external host — `src/shared/infrastructure/github/client.ts:27`,
plus a near-duplicate at `src/modules/repository/infrastructure/github-writer.ts:30`.
Every other `fetch(` is a same-origin call to the app's own `/api/*` routes. The AI
providers are reached through the Vercel AI SDK rather than a hand-written `fetch`, and
headless Chromium is spawned as a process, not fetched.

---

## 2. GitHub — the one that cannot be removed

GitHub is used twice over, for two unrelated purposes, and the two use different
credentials.

### 2a. GitHub OAuth (who you are)

- **Where.** `src/modules/auth/infrastructure/auth-options.ts`, via NextAuth v5
  (`next-auth@^5.0.0-beta.31`), initialised in `src/auth.ts`, mounted at
  `src/app/api/auth/[...nextauth]/route.ts`.
- **Scope requested.** `read:user` only — `authorization: { params: { scope: "read:user" } }`
  at `auth-options.ts:29`. The OAuth identity is never used to touch the repo.
- **Gate.** The `signIn` callback runs `isAllowed(ghProfile?.login, authEnv.ALLOWED_GH_LOGIN)`.
  This is a single-tenant allowlist, not a signup flow. Anyone not on the list is refused
  at the callback.
- **Session.** JWT strategy (`session: { strategy: "jwt" }`); no session store, so no
  database. The proxy at `src/proxy.ts:4` looks for the cookies
  `authjs.session-token` / `__Secure-authjs.session-token`.
- **Second provider.** A `Credentials` provider with id `sgnk-password` exists as a
  fallback for environments where the OAuth callback is unreachable. It compares a
  username against `SGNK_AUTH_USER` and verifies a scrypt hash from `SGNK_AUTH_HASH`
  (`auth-options.ts:41-42`). If either variable is unset the provider returns `null` for
  every attempt, i.e. it disables itself.

**Failure mode if GitHub OAuth is unavailable.** Nobody new can sign in; existing JWT
cookies keep working until they expire. `src/proxy.ts` redirects unauthenticated page
navigations to `/login`, and API routes self-gate with `getActor()` and return JSON 401
rather than a redirect. The password provider is the intended escape hatch — but only if
its two environment variables are set. In development there is a third escape hatch,
`DEV_BYPASS_AUTH=1` under `NODE_ENV=development` on a loopback/RFC1918 host
(`src/proxy.ts:30-37`, mirrored in `src/config/env.ts:246-256`).

### 2b. GitHub REST + Git Data API (where the notes live)

- **Where.** `src/shared/infrastructure/github/client.ts` (reads) and
  `src/modules/repository/infrastructure/github-writer.ts` (writes). Base URL
  `https://api.github.com`, API version header `2022-11-28`.
- **Credential.** `GITHUB_REPO_TOKEN`, read lazily at request time through the
  `repoEnv` proxy in `src/config/env.ts`. This is a repo token, entirely separate from
  the OAuth app — the signed-in user's own GitHub identity is never used to read or
  write. One consequence worth naming: **every commit the app makes is attributed to
  the same author**, hard-coded at `src/container/dependency-container.ts:42` as
  `{ name: "Sagnik Mitra", email: "sagnikmitra123@gmail.com" }`.
- **Read endpoints used.** `GET /repos/{repo}/commits/{branch}` (HEAD sha),
  `GET /repos/{repo}/zipball/{branch}` (whole-vault snapshot, unzipped with `fflate`),
  `GET /repos/{repo}/contents/{path}` (single file), the same with `?ref={sha}`
  (a past revision), `GET /repos/{repo}/git/blobs/{sha}` (three-way-merge base), and
  `GET /repos/{repo}/commits?path=…` (history, capped at 100 per page).
- **Write endpoints used**, listed in the header comment of `github-writer.ts:7-13`:
  `GET /git/ref/heads/{branch}` → `GET /git/commits/{sha}` → `POST /git/blobs` →
  `POST /git/trees` → `POST /git/commits` → `PATCH /git/refs/heads/{branch}`. That is a
  real git commit, not the contents API.
- **Resilience.** `githubFetch` retries on network error and on 429/500/502/503/504, up
  to `MAX_ATTEMPTS = 3`, backing off 250 ms then 500 ms. 404 raises `FileNotFoundError`;
  other 4xx are not retried. Non-retryable failures log the status server-side and throw
  a generic `GitHub API error {status}` so route bodies never leak the repo layout.
- **A wrinkle.** `githubFetchNullOn404` in `github-writer.ts:30` calls `fetch` directly
  rather than going through `githubFetch`, so that one path does **not** get the retry
  and backoff behaviour the rest of the client has. That is a difference in behaviour
  between two functions in the same adapter, not a stated design decision anywhere I read.

**Failure mode if the GitHub API is unavailable.** The product is down. Not degraded —
down. There is no local cache that survives a cold server, no read replica and no queue
for pending writes. `src/modules/vault/infrastructure/snapshot-cache.ts` caches the
unzipped vault keyed by HEAD sha, so a warm server survives a brief outage for reads;
a cold one does not. Writes fail immediately. A `ConflictError` path exists in
`src/modules/repository/domain/commit.ts` for the case where HEAD moved under you,
which is the ordinary concurrent-edit failure rather than an outage.

**Rate limits are a real exposure and are unverified here.** The zipball endpoint is
pulled for a whole-vault snapshot. I did not measure how often, and I did not check
whether any code reads `X-RateLimit-Remaining` — a grep for it returns nothing, so the
app has no visibility into how close it is to a limit. **unverified**: what the actual
per-hour ceiling is for the token in use.

---

## 3. The AI providers

- **Where.** `src/modules/ai/infrastructure/gateway-client.ts`, exported as
  `gatewayLlmClient` through the module barrel `src/modules/ai/index.ts:24`, wired into
  five use-cases at `src/container/dependency-container.ts:116-120` (refine, summarise,
  suggest-links, link-doctor, generate-document) and used directly by
  `src/app/api/ai/complete/route.ts:46` for inline ghost text.
- **Six route handlers** under `src/app/api/ai/`: `complete`, `generate-doc`,
  `link-doctor`, `refine`, `suggest-links`, `summarize`. All require an authenticated
  actor and return 401 otherwise.
- **Providers, from `package.json`.** `@ai-sdk/google`, `@ai-sdk/groq`,
  `@ai-sdk/cerebras`, `@ai-sdk/mistral`, `@openrouter/ai-sdk-provider`, on top of
  `ai@^6`.

The design is a fallback chain, not a single provider. A provider joins the chain only
if its API key variable is set (`configuredProviders()` at `gateway-client.ts:31-56`),
so adding keys adds resilience. Two orderings exist: `SPEED_ORDER`
(groq, cerebras, google, mistral, openrouter) for ghost text, and `QUALITY_ORDER`
(google, groq, cerebras, mistral, openrouter) for everything else
(`gateway-client.ts:58-59`). Ghost text hedges two providers concurrently under a
6-second timeout; quality tasks run one at a time under 15 seconds
(`gateway-client.ts:98-102`).

**The zero-key path.** If no provider key is set, `configuredProviders()` returns an
empty list and the client falls through to the **Vercel AI Gateway**, passing the bare
string `process.env["AI_MODEL"]?.trim() || "google/gemini-3.5-flash"` as the model
(`gateway-client.ts:69`). The code's own comment says this is credit-gated and "502s on
the free tier". So on a bare deploy with no keys, every AI feature returns
`{"error":"ai_failed"}` with a 502 — the failure is graceful and confined to AI, but it
is a failure. The gateway host `https://ai-gateway.vercel.sh` is allowlisted in the
report-only CSP at `src/proxy.ts:120`.

**Failure mode if all providers are unavailable.** The six `/api/ai/*` routes return 502
with `{"error":"ai_failed", detail}`. Editing, reading, committing, sharing, search,
graph and export are untouched. This is the one integration whose loss is genuinely
partial.

**What is not built.** There is **no bring-your-own-key path**. Keys are read from the
server's own environment only; a grep for `process.env` shows no request-scoped key,
and there is no field in any route body that carries one. Every AI request bills the
operator. `docs/PRODUCT-BRIEF.md` line 219 lists this as known problem 6. Also unbuilt:
the typed `parseAiEnv` / `configuredAiProviders` / `hasAnyAiProvider` helpers in
`src/config/env.ts:124-175` have **zero callers in `src/`** — a grep finds them only in
`test/config/ai-env.test.ts`. The gateway client reads `process.env` directly instead.
So the validation exists, is tested, and is not in the request path.

---

## 4. Vercel

Vercel is the deployment target and, incidentally, the fallback AI vendor (§3).

- **`vercel.json`** sets `framework: nextjs`, an `ignoreCommand` of
  `bash scripts/vercel-ignore-build.sh`, and a per-function override for
  `src/app/api/export/pdf/[...path]/route.ts`: `memory: 1769`, `maxDuration: 60`. That
  memory figure is the size the headless-Chromium function needs.
- **`scripts/vercel-ignore-build.sh`** reads `VERCEL_GIT_PREVIOUS_SHA` and
  `VERCEL_GIT_COMMIT_SHA` and diffs a fixed allowlist of paths (`src`, `public`,
  `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`,
  `eslint.config.mjs`, `postcss.config.mjs`, `vercel.json`, the script itself, `.nvmrc`).
  Exit 0 skips the build, exit 1 proceeds. It fails **open** — a missing or unresolvable
  previous sha builds anyway. That is the right direction to fail in.
- **`.vercelignore`** excludes `src-tauri`, `test` and `specs` from the deployment.
- **Ownership**, per `AGENTS.md` §6b: Vercel team `zsco`, project `frontmatter`.
  Deploys must pass `--scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"`, never the bare
  personal token. I did not verify any of this against the Vercel account.

**Failure mode if Vercel is unavailable.** The hosted product is down; nothing in the
codebase provides an alternative host. The app is not statically exportable — 26 route
handlers, `force-dynamic` on several, and middleware in `src/proxy.ts`. A Tauri desktop
build would not save you either, because that shell loads a remote URL rather than
bundling the app (§7).

**There is no CI.** `ls -a .github` returns "no such directory", and a repo-wide search
for workflow YAML finds only `docs/research/sources/aider-polyglot-benchmark-results.yml`.
Every gate in `AGENTS.md` §0.1 and §4 — `typecheck`, `lint`, `test`, `build`, `arch`,
`spec`, `corpus` — runs only when a human runs it. The Vercel build is the sole automatic
check on `main`, and it runs `next build` alone, not the verify chain.

---

## 5. Firebase

Firebase is **configured but not wired**. This is the largest gap between what the repo
looks like it does and what it does.

What exists:

- `firebase@^12.16.0` in `package.json`.
- `src/shared/infrastructure/firebase/client.ts` — lazy `firebaseApp()`, `firebaseAuth()`,
  `firestore()` singletons under the app name `"frontmatter"`.
- `src/modules/auth/infrastructure/firebase-auth-gateway.ts` — a Google `signInWithPopup`
  gateway implementing the `AuthGateway` port.
- `src/container/client-container.ts` — a browser-side composition root exporting
  `authGateway()`.
- `firebase.json` — Firestore rules/indexes pointers, an `auth.authorizedDomains` list
  (`localhost`, `frontmatter-md.firebaseapp.com`, `frontmatter-md.web.app`,
  `frontmatter.in`, `www.frontmatter.in`, `frontmatter.vercel.app`), Google sign-in
  configured with support email `studiozephyrus@gmail.com`, and emulator ports.
- `firestore.rules` — 400+ lines describing collections `users`, `billing`,
  `usage/{uid}/months`, `vaults`, `vaults/{id}/notes`, `.../revisions` and `shares`,
  with append-only revisions and an unauthenticated `get` on public shares.

What does not exist:

- **Nothing imports `authGateway()`.** A grep for `client-container` and `authGateway`
  across `src/` returns only the four lines inside `src/container/client-container.ts`
  itself. The browser composition root has no consumer.
- **Nothing calls `firestore()`.** A grep for `firestore()` and `firebase/firestore`
  across `src/` returns only the two lines inside
  `src/shared/infrastructure/firebase/client.ts` that define it. There are zero Firestore
  reads and zero Firestore writes in the application.
- **`firebase-admin` is not a dependency.** `grep -c firebase-admin package.json` returns
  0, and `node_modules/firebase-admin` does not exist. The rules file repeatedly defers
  privileged writes to "the Admin SDK, which bypasses these rules" — that SDK is not
  installed.
- The rules file's own header says so: "PROTOTYPE… not yet exercised against the
  emulator or a live client. Harden before taking paid signups."

The live product does not hold documents in Firestore. Sharing is implemented by
splicing frontmatter into the markdown file itself and committing it to GitHub —
`src/modules/share/domain/splice-frontmatter.ts`,
`src/modules/share/infrastructure/share-writer.ts`, wired at
`src/container/dependency-container.ts:123-143` on top of `commitChanges` and
`getSnapshot`. So the `shares` collection in `firestore.rules` describes a second,
parallel design that is not the one running.

This matches `docs/PRODUCT-BRIEF.md` line 365, which flags the question and states
"Verified **unbuilt today** (zero Firestore writes across 226 source files)". My greps
agree.

**Failure mode if Firebase is unavailable.** Nothing happens. No code path reaches it.
The one caveat: `parseFirebaseConfig()` (`src/config/env.ts:206-224`) **throws** on a
missing or malformed `NEXT_PUBLIC_FIREBASE_*` variable, so if a future change does wire
`firebaseApp()` into a rendered path, absent config becomes a hard error rather than a
degraded feature. Today that throw is unreachable, because `firebaseApp()` has no live
caller.

---

## 6. Cloudflare

Cloudflare appears **nowhere in the application code**. A case-insensitive grep across
`src/`, `scripts/`, `next.config.ts` and `vercel.json` returns exactly one hit — a
string comparison inside `scripts/categorize-skills.mjs:22`, an unrelated utility.

Per `AGENTS.md` §6b, Cloudflare holds the DNS zone `frontmatter.in` on Sagnik's personal
account (a deliberate split from the Zephyrus-owned GitHub and Vercel surfaces). That is
the whole of the integration: name resolution, plus whatever proxy settings the zone
carries, which I did not check.

**Failure mode if Cloudflare is unavailable.** `frontmatter.in` stops resolving and the
product is unreachable at its public name, even though Vercel is still serving. The
Vercel-assigned hostname would still work if you know it. `AGENTS.md` §8 also records
`frontmatter.sgnk.ai` as an attached secondary domain, which is on a different zone and
would give an independent path in. **unverified**: whether that secondary is currently
live and whether it is proxied.

---

## 7. The PDF / Chromium path

This is the most fragile integration in the repo and the one with the most machinery
around it.

- **Route.** `src/app/api/export/pdf/[...path]/route.ts` — `runtime = "nodejs"`,
  `dynamic = "force-dynamic"`, `maxDuration = 60`, auth-gated, 401 without a session.
- **Packages.** `puppeteer-core@^25.0.4` drives the browser; `@sparticuz/chromium@^148`
  supplies a Linux Chromium binary as a brotli pack.
- **Platform branch** at `route.ts:105`: `process.platform === "linux"` decides between
  the bundled binary and the developer's locally installed Chrome. The comment explains
  why platform and not a `VERCEL` env flag — a local `.env.local` may define `VERCEL`
  for other reasons. That is a considered choice and it is the right one.
- **Two escape hatches, both env-driven.** `CHROMIUM_PACK_URL` loads the brotli pack
  from a remote tar instead of the traced binary (`route.ts:116`); `LOCAL_CHROME_PATH`
  overrides the auto-discovered stable channel on a dev machine (`route.ts:128`).
- **Build plumbing.** `next.config.ts` lists both packages in `serverExternalPackages`
  so the bundler does not relocate them and strip the native binary, and adds
  `outputFileTracingIncludes: { "/api/export/pdf/**": ["./node_modules/@sparticuz/chromium/**"] }`.
  The comment records that a narrower `bin/**` glob previously failed to land the binary
  in the lambda. `vercel.json` then gives the function 1769 MB and 60 seconds.
- **Two CDN dependencies inside the rendered page.**
  `src/modules/export/presentation/pdf-doc.ts:132` pulls
  `https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css`, and line 134 imports
  `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs`. The route then
  waits a fixed 2000 ms for mermaid to render (`route.ts:147`) and awaits
  `document.fonts.ready` for the web fonts.

**Failure modes, in order of likelihood.**

1. **Local development.** On macOS or Windows the branch takes the `channel: "chrome"`
   path, which needs a real Chrome installed. Without one, `puppeteer.launch` throws and
   the route returns 502 with a `hint` telling the user to use Print / PDF instead. The
   in-browser print path is the fallback and it does not touch this route at all.
2. **The traced binary goes missing again.** The comments in `next.config.ts` say this
   has already happened once (`runtime: ".../bin does not exist"`). Symptom: 502
   `pdf_render_failed` in production only. `CHROMIUM_PACK_URL` exists precisely for this.
3. **jsdelivr unreachable, or blocked by network policy.** Maths renders unstyled and
   mermaid diagrams do not render at all; the PDF still comes back, silently wrong. The
   route has no check that mermaid actually ran — it waits a fixed two seconds and
   snapshots whatever is on the page. A slow CDN produces a diagram-free PDF with a 200
   status.
4. **A document heavy enough to exceed 60 seconds** returns a Vercel timeout rather than
   the route's own 502.

Note the tension `docs/PRODUCT-BRIEF.md` line 67 already names: this export path
"needs a Vercel Linux chromium binary, which contradicts this row's own offline claim".
A desktop-first product cannot render its PDFs on a serverless Linux function.

---

## 8. The Tauri desktop shell

`src-tauri/` is present and `@tauri-apps/api@^2.11` is a dependency, used in exactly one
place: `src/modules/app-shell/presentation/TauriBridge.tsx:38` dynamically imports
`@tauri-apps/api/event` to listen for native events.

The configuration still belongs to the sibling product, and more completely than
`AGENTS.md` §8 and `docs/PRODUCT-BRIEF.md` line 104 record. From
`src-tauri/tauri.conf.json`:

| Field | Value at `e318ab3` |
|---|---|
| `productName` | `sgnk-md` |
| `identifier` | `ai.sgnk.md` |
| `build.frontendDist` | `https://md.sgnk.ai` |
| `build.devUrl` | `https://md.sgnk.ai` |
| `app.windows[0].url` | `https://md.sgnk.ai` |
| `app.windows[0].title` | `sgnk-md` |
| `bundle.shortDescription` | "Your Markdown HQ — a GitHub-backed markdown workspace." |

`src-tauri/src/lib.rs:3` states the strategy plainly: "thin native shell that loads
https://md.sgnk.ai inside a" webview. `src-tauri/capabilities/default.json` is likewise
described as "Default capability set for the sgnk-md desktop shell".

So the bundle identifier is not the only thing that needs re-identifying. **If you build
`npm run tauri:build` today, you ship a desktop app that opens the sibling product**, not
frontmatter. The brief describes the desktop app as containing "the editor, the engine,
a git client, the MCP server and the search index"; the current config bundles none of
those — it is a window pointed at a remote URL. `.vercelignore` excludes `src-tauri`, so
none of this reaches the web deployment.

`AGENTS.md` §8 is explicit that the bundle id `ai.sgnk.md` is deliberately unchanged, in
the same family as the deliberately-legacy IndexedDB keys. The three `md.sgnk.ai` URLs
are a separate matter and I found no note saying they are deliberate.

---

## 9. Error reporting and observability

There is none, and the code says so.

`src/instrumentation.ts` registers Next's instrumentation hook. `register()` is an empty
function with a comment reserving it for OpenTelemetry or Sentry init.
`onRequestError` logs to `console.error` with a `"[sgnk-md]"` prefix — the sibling's
name, still. The file's own comment: "swap the console call for
`Sentry.captureException(...)` once `SENTRY_DSN` is set in the environment". `SENTRY_DSN`
is not read anywhere; it appears only in that comment.

So in production, server errors go to Vercel's function logs and nowhere else. There is
no alerting, no error grouping, and no client-side reporting.

---

## 10. Everything else is a library, not a service

Worth stating because several of these look like integrations and are not. All are
bundled and make no network call of their own: CodeMirror 6 (editor), `mermaid@^11` and
`katex@^0.17` (bundled in the app — the CDN copies in §7 are only for the server-side PDF
document), `minisearch` (search index, built in-process from the vault zipball),
`react-force-graph-2d` (graph view), `gray-matter` + `yaml` (frontmatter parsing),
`fflate` (unzipping the GitHub zipball), `idb-keyval` (local drafts in IndexedDB under
the deliberately-legacy `sgnk-md` store name), `zod` (env and payload validation),
`zustand` (client state), and `material-symbols`.

One external image host is allowed: `next.config.ts` permits remote images from
`avatars.githubusercontent.com`, which is the signed-in user's avatar.

---

## 11. Summary — what breaks without each

| Integration | Loss | Blast radius |
|---|---|---|
| GitHub REST / Git Data API | Total. No reads, no writes, no fallback store. A warm snapshot cache covers reads briefly | The product |
| GitHub OAuth | No new sign-ins; existing JWTs survive. Password provider is the hatch if its two vars are set | Access |
| Vercel | Hosted product down; no alternative host in the repo | The product |
| Cloudflare | `frontmatter.in` stops resolving; Vercel still serving | The public name |
| AI providers (all five) | Six `/api/ai/*` routes return 502; everything else works | AI features only |
| Vercel AI Gateway | Only matters when no direct key is set — then all AI is dead | AI features only |
| `@sparticuz/chromium` / jsdelivr | Server PDF 502s, or renders silently without diagrams and maths | One export path |
| Firebase | Nothing. Zero live callers | None today |

---

## 12. Defects found while writing this

1. **The Tauri shell points at the sibling product's live site.** Three fields in
   `src-tauri/tauri.conf.json` (`frontendDist`, `devUrl`, `windows[0].url`) and the
   strategy comment in `src-tauri/src/lib.rs:3` all name `https://md.sgnk.ai`. A desktop
   build today ships a window onto sgnk-md. `AGENTS.md` §8 and the brief mention only the
   identifier.
2. **`githubFetchNullOn404` bypasses the retry client.**
   `src/modules/repository/infrastructure/github-writer.ts:30` calls `fetch` directly
   rather than `githubFetch`, so this one write-path call gets no retry on a 502 or 429
   while its siblings do.
3. **The PDF route cannot tell a rendered diagram from an unrendered one.** It waits a
   fixed 2000 ms (`route.ts:147`) and snapshots. A slow or blocked jsdelivr yields a
   200 response containing a PDF with missing diagrams and unstyled maths.
4. **The AI env schema is dead code.** `parseAiEnv`, `configuredAiProviders` and
   `hasAnyAiProvider` (`src/config/env.ts:124-175`) have zero callers in `src/`; the
   gateway client reads `process.env` directly. The tests pass and validate nothing that
   runs.
5. **`src/instrumentation.ts` logs under the prefix `[sgnk-md]`** — the sibling's name in
   production log lines.
6. Env-rule violations are catalogued separately in `docs/09-ENVIRONMENT.md` §5.
