---
mode: reference
updated: 2026-09-09
verified_against: e318ab3
---

# Environment variables

> **Method.** I ran `grep -rn "process\.env" src/` and compiled the distinct names from
> both the literal `process.env.X` / `process.env["X"]` forms and the zod schema keys in
> `src/config/env.ts`. I read `src/config/env.ts` in full, plus every file the grep
> returned: `src/proxy.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`,
> `src/app/layout.tsx`, `src/app/api/export/pdf/[...path]/route.ts`,
> `src/container/dependency-container.ts`, `src/modules/ai/infrastructure/gateway-client.ts`,
> `src/modules/auth/infrastructure/auth-options.ts`,
> `src/modules/mdmax/infrastructure/bench.ts`. I read
> `specs/harness/clean-architecture-report.mjs` and `eslint.config.mjs` to establish
> what the gates enforce, and ran `node specs/harness/clean-architecture-report.mjs`.
> I read `scripts/vercel-ignore-build.sh`, `vitest.config.ts` and `test/setup.ts`.
>
> **No value of any variable appears in this document. Names only.**
>
> **What this pass did NOT do.** It did not read `.env.example` or `.env.local` — both
> are blocked to this session (the sandbox returned `.env.example: Operation not
> permitted`), so **I cannot say whether the committed example file lists the same set
> of names this document derives from code, and it may be stale in either direction**.
> It did not open the Vercel project's environment settings, so nothing here confirms
> which variables are actually set in production, preview or development. It did not run
> the app or the build, so no claim below is an observed boot failure — each is read off
> a zod schema or a `??` default. It did not grep outside `src/` and `scripts/` for env
> reads (so a variable used only by a `docs/build/` script or a `specs/harness/` script
> is not listed).

---

## 1. How env is meant to work here

`src/config/env.ts` is the only file that is supposed to see raw `process.env` in
anything but an infrastructure adapter. It defines four zod schemas and exposes three of
them through lazy `Proxy` singletons:

| Export | Schema | Behaviour on invalid input |
|---|---|---|
| `env` | `APP_URL`, `NODE_ENV` | throws `Invalid environment: …` |
| `authEnv` | `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET`, `ALLOWED_GH_LOGIN` | throws `Invalid auth environment: …` |
| `repoEnv` | `GITHUB_REPO_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` | throws `Invalid repo environment: …` |
| `parseAiEnv` (function, not a proxy) | eleven AI keys, all optional | returns `{}` — deliberately never throws, "since AI is a non-essential enhancement and must never break boot" |
| `parseFirebaseConfig` (function) | seven `NEXT_PUBLIC_FIREBASE_*` | throws `Invalid Firebase config: …` |
| `readDevBypassFlags` (function) | `NODE_ENV`, `DEV_BYPASS_AUTH`, `ALLOWED_GH_LOGIN` | never throws |

The three proxies are lazy on purpose. Each reads `process.env` on **first property
access**, not at module import, so importing `@/config/env` during a build, a test, or a
server render costs nothing and cannot fail on a missing variable. The file says this
three times, and `src/modules/auth/infrastructure/auth-options.ts:12-19` repeats the
warning for its own case. This is a real constraint: moving any of these reads to module
scope breaks `next build`.

One deliberate exception is documented at `src/config/env.ts:202-206`: the Firebase
variables are read as **literal** `process.env.NEXT_PUBLIC_FIREBASE_X` expressions, not
through the proxy pattern, because Next.js inlines client-side variables by static text
substitution at build time and a dynamic lookup resolves to `undefined` in the browser.
Do not refactor those seven lines into a loop.

---

## 2. Every variable, by name

Thirty-four distinct names are read or declared in `src/`, plus two that only appear in
`scripts/`. The count comes from a compiled `sort -u` over the literal `process.env`
forms and the schema keys; I excluded `NEXT_PUBLIC_X`, which the grep picks up from the
explanatory comment at `src/config/env.ts:202` and is not a real variable.

### 2a. Core

| Name | Read at | Required? | Notes |
|---|---|---|---|
| `APP_URL` | `src/config/env.ts:4` (schema), reached via `parseEnv(process.env)` at `:30` | Required **by the schema**, but see below | `z.string().url()`, no default |
| `NODE_ENV` | `src/config/env.ts:5` (schema, default `development`), `:249` (literal), `src/proxy.ts:31` | Set by the runtime | Guards the dev bypass |

**`APP_URL` is validated by a schema no production code reads.** A grep for
`from "@/config/env"` across `src/` returns six importers, and every one of them imports
`repoEnv`, `authEnv`, `parseFirebaseConfig` or `readDevBypassFlags` — **none imports
`env`**. The only importer of `env` is `test/config/env.test.ts`. So the `APP_URL`
requirement is enforced nowhere at runtime: a deploy missing it boots fine. Whether that
is a latent trap (the day someone imports `env`) or dead weight to delete is a call for
the founder; I am recording the fact, not the verdict.

### 2b. Authentication

| Name | Read at | Required? |
|---|---|---|
| `AUTH_GITHUB_ID` | `src/config/env.ts:44` (schema) | Required for GitHub sign-in |
| `AUTH_GITHUB_SECRET` | `src/config/env.ts:45` (schema) | Required for GitHub sign-in |
| `AUTH_SECRET` | `src/config/env.ts:46` (schema) | Required — JWT signing |
| `ALLOWED_GH_LOGIN` | `src/config/env.ts:47` (schema, default `sagnikmitra`), `:252` (literal, default `dev`) | Optional, but see the default clash below |
| `SGNK_AUTH_USER` | `src/modules/auth/infrastructure/auth-options.ts:41` | Optional |
| `SGNK_AUTH_HASH` | `src/modules/auth/infrastructure/auth-options.ts:42` | Optional |
| `DEV_BYPASS_AUTH` | `src/config/env.ts:250`, `src/proxy.ts:32` | Optional, development only |

Three points worth reading twice.

**The first three are consumed by NextAuth, not by our code.** `auth-options.ts:13-15`
records that `clientId` / `clientSecret` / `secret` are auto-read from
`AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` / `AUTH_SECRET` by NextAuth at request time.
Our `authSchema` declares them anyway — which means the first access of
`authEnv.ALLOWED_GH_LOGIN` (inside the `signIn` callback) validates all four, and
**throws if any of the three NextAuth variables is missing**, even though nothing in our
code would otherwise have read them. That is a coupling: an environment configured for
the password provider alone, with no GitHub OAuth app, still needs the three GitHub
variables present or `signIn` throws.

**`ALLOWED_GH_LOGIN` has two different defaults.** `authSchema` defaults it to
`sagnikmitra` (`env.ts:47`); `readDevBypassFlags` defaults it to `dev` (`env.ts:252`).
The two are read by different paths — the schema by the OAuth allowlist check, the
literal by the dev bypass — so on a machine with the variable unset, the OAuth path
allows one login and the dev bypass impersonates a different one. Neither default is
wrong on its own; they are simply not the same, and nothing in the file says the
divergence is intended.

**`SGNK_AUTH_USER` and `SGNK_AUTH_HASH` are an all-or-nothing pair.** `authorize()`
returns `null` immediately if either is absent (`auth-options.ts:43`), which disables the
password provider cleanly. `SGNK_AUTH_HASH` holds a scrypt hash, verified by
`src/modules/auth/infrastructure/password.ts`; the plaintext never leaves the handler.

**`DEV_BYPASS_AUTH` is triple-gated** and cannot be turned on in production: it needs
`NODE_ENV === "development"` **and** the value `"1"` **and**, in the proxy, a
loopback/RFC1918 request host (`src/proxy.ts:30-37`).

### 2c. GitHub vault access

| Name | Read at | Required? |
|---|---|---|
| `GITHUB_REPO_TOKEN` | `src/config/env.ts:85` (schema) | **Required.** No default. The product cannot read or write a note without it |
| `GITHUB_REPO` | `src/config/env.ts:86` (schema, default `sagnikmitra/md`) | Optional, but the default is the sibling's vault |
| `GITHUB_BRANCH` | `src/config/env.ts:87` (schema, default `main`) | Optional |

`GITHUB_REPO` defaulting to `sagnikmitra/md` means a deploy that forgets to set it does
not fail loudly — it silently serves the sibling product's vault, assuming the token has
access. A missing required variable is a better failure than a wrong default, and this is
the wrong default for a product named frontmatter. Recorded as a defect in §6.

### 2d. AI providers — all optional, all opt-in

| Name | Declared at | Read at runtime |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | `src/config/env.ts:125` | `gateway-client.ts:34` |
| `GROQ_API_KEY` | `:126` | `gateway-client.ts:38` |
| `CEREBRAS_API_KEY` | `:127` | `gateway-client.ts:42` |
| `MISTRAL_API_KEY` | `:128` | `gateway-client.ts:46` |
| `OPENROUTER_API_KEY` | `:129` | `gateway-client.ts:50-51` |
| `AI_MODEL` | `:130` | `gateway-client.ts:35`, `:69` |
| `AI_GOOGLE_MODEL` | `:131` | `gateway-client.ts:35` |
| `AI_GROQ_MODEL` | `:132` | `gateway-client.ts:39` |
| `AI_CEREBRAS_MODEL` | `:133` | `gateway-client.ts:43` |
| `AI_MISTRAL_MODEL` | `:134` | `gateway-client.ts:47` |
| `AI_OPENROUTER_MODEL` | `:135` | `gateway-client.ts:52` |

Every one is optional. A provider joins the fallback chain only when its key is present.
With zero keys, the client falls through to the Vercel AI Gateway using
`AI_MODEL` or a hard-coded default string, which the code's own comment says 502s on the
free tier.

Note the split: the schema in `src/config/env.ts` declares these eleven, but
`gateway-client.ts:32` does `const env = process.env` and reads them directly. The
schema, `parseAiEnv`, `configuredAiProviders` and `hasAnyAiProvider` have **zero callers
in `src/`** — a grep finds them only in `test/config/ai-env.test.ts`. So the AI
validation is tested and unused.

### 2e. Firebase web client (public by design)

`NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`,
`NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`,
`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID` — all
required by `firebaseSchema`; `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is optional. All
seven are read literally at `src/config/env.ts:210-216`.

The file's own comment is correct and worth preserving: these are **not secrets**.
Firebase web config ships inside the client bundle by design, and access is governed by
`firestore.rules`, not by hiding the API key. They live in env vars so a staging project
can be swapped in without a code change.

`parseFirebaseConfig()` throws on a missing one — but it is called only by
`firebaseApp()` in `src/shared/infrastructure/firebase/client.ts`, which has no live
caller anywhere in the app (see `docs/07-INTEGRATIONS.md` §5). So today these seven can
all be absent with no effect.

### 2f. Site URL

`NEXT_PUBLIC_SITE_URL` — optional. Read in four places, each with the same inline
default `"https://frontmatter.in"`:

- `src/app/sitemap.ts:3`
- `src/app/robots.ts:3`
- `src/app/layout.tsx:21`
- `src/container/dependency-container.ts:134` (the public base URL handed to `setShare`)

Four copies of one default is four places to update. It belongs in `src/config/env.ts`
with the rest.

### 2g. PDF / Chromium

| Name | Read at | Required? |
|---|---|---|
| `CHROMIUM_PACK_URL` | `src/app/api/export/pdf/[...path]/route.ts:116` | Optional. Loads the brotli pack from a remote tar instead of the traced binary — the escape hatch for when file-tracing loses `bin/` again |
| `LOCAL_CHROME_PATH` | `src/app/api/export/pdf/[...path]/route.ts:128` | Optional, development only. Overrides the auto-discovered stable Chrome channel |

Only one is consulted per request: the `process.platform === "linux"` branch at
`route.ts:105` decides which.

### 2h. Engine benchmarking

`MDMAX_RUBY_BIN` — optional, read at `src/modules/mdmax/infrastructure/bench.ts:77`,
defaulting to `/opt/homebrew/opt/ruby/bin/ruby`. Its purpose, per the comment, is that
"ruby is not at the same path on CI as it is on this Mac". Callers of `bench.ts` are
`test/mdmax/bench.test.ts` and `scripts/mdmax-cert.mjs` — nothing in the running
application. This variable exists for the Jekyll/kramdown differential harness, not for
the product. (There is no CI to be different from; see `docs/07-INTEGRATIONS.md` §4.)

### 2i. Injected by Vercel, read only in `scripts/`

`VERCEL_GIT_PREVIOUS_SHA` and `VERCEL_GIT_COMMIT_SHA`, both read by
`scripts/vercel-ignore-build.sh`. Neither is read anywhere in `src/`. `CUR` falls back to
`HEAD`; an empty or unresolvable `PREV` makes the script build rather than skip, which is
the safe direction.

### 2j. Named in a comment, never read

`SENTRY_DSN` and `OTEL_EXPORTER_OTLP_ENDPOINT` appear in `src/instrumentation.ts` as
what a future reporter would be gated on. Neither is read. Setting them today does
nothing.

---

## 3. Where secrets live

Per `AGENTS.md` §6, production environment lives **in Vercel only** and nothing is
committed. Local development is expected to pull it:

```
npx vercel env pull .env.local --environment=production
sed -i '' 's|^AUTH_URL=.*|AUTH_URL="http://localhost:3000"|' .env.local
```

Two observations on that snippet, offered as facts rather than corrections:

- It rewrites `AUTH_URL`, which is **not** among the 34 names read in `src/`. NextAuth
  reads it directly, so the variable is real, but it will not appear in any grep of our
  own source.
- The pull is `--environment=production`, so a local machine following `AGENTS.md`
  literally holds production secrets on disk.

`AGENTS.md` §6b adds that a `git push` needs `$GH_TOKEN_ZEPHYRUS` sourced from the
machine's token file, that `.git/config` holds a credential helper reading it from the
environment rather than the token itself, and that `gh auth login` / `gh auth setup-git`
must never be run with that token because both rebind every repo on the machine.

---

## 4. Tests

`vitest.config.ts` declares no `env` block and `test/setup.ts` sets no variable — it only
calls Testing Library's `cleanup()` after each test. Tests that need env set it
themselves, before importing the module under test, precisely because the proxies are
lazy: `test/auth/auth-options.test.ts:12-15` sets the four auth variables, and
`test/shared/github-client.test.ts:5-7` sets the three repo ones. Those are literal
test values in the test files, not real credentials.

---

## 5. The `process.env` boundary — verifying `AGENTS.md` §6

`AGENTS.md` §6 states: "`process.env` reads ONLY in `src/config/` and `*/infrastructure/`.
Never in domain, application, or presentation."

That is two rules, and only the second is enforced.

**What I ran.**

```
grep -rln "process\.env" src/ | grep -v '\.md$'
```

returns 14 files. Four of them mention `process.env` only in a comment asserting that
they do not use it — `src/modules/vault/infrastructure/{markdown-parser,search-index,vault-reader}.ts`
and `src/shared/infrastructure/firebase/client.ts`. That leaves **10 files with a real
read**.

Filtering those to the ones outside the two permitted locations:

```
grep -rln "process\.env" src/ | grep -v '\.md$' | grep -v '^src/config/' | grep -v 'infrastructure/'
```

returns **6 files**:

| File | Line(s) | Variable(s) |
|---|---|---|
| `src/proxy.ts` | 31, 32 | `NODE_ENV`, `DEV_BYPASS_AUTH` |
| `src/app/sitemap.ts` | 3 | `NEXT_PUBLIC_SITE_URL` |
| `src/app/robots.ts` | 3 | `NEXT_PUBLIC_SITE_URL` |
| `src/app/layout.tsx` | 21 | `NEXT_PUBLIC_SITE_URL` |
| `src/app/api/export/pdf/[...path]/route.ts` | 116, 128 | `CHROMIUM_PACK_URL`, `LOCAL_CHROME_PATH` |
| `src/container/dependency-container.ts` | 134 | `NEXT_PUBLIC_SITE_URL` |

**These six are violations of the rule as `AGENTS.md` §6 writes it.** None is in
`src/config/`; none is in an `infrastructure/` folder.

**Why no gate catches them.** `specs/harness/clean-architecture-report.mjs:120-125`:

```js
function scanProcessEnv(text, file, layer) {
  if (!["domain", "application", "presentation"].includes(layer)) return;
  ...
}
```

The check only fires for three layers. `layerOf()` at line 58 maps `src/app/**` to the
layer `"app"`, and returns `null` for `src/proxy.ts` and everything under
`src/container/` — and a `null` layer is skipped by `continue` before any scan runs. So
the harness implements §6's *second* sentence ("never in domain, application, or
presentation") and is structurally blind to its *first* ("ONLY in `src/config/` and
`*/infrastructure/`"). `eslint.config.mjs` adds nothing here: its only `no-restricted-*`
rule bans the three deleted god-folder import paths.

Running the gate confirms it is green:

```
$ node specs/harness/clean-architecture-report.mjs
{ "total": 0, "filesScanned": 208, "summary": {}, "violations": [] }
```

Zero violations, 208 files scanned — with all six reads above sitting in the tree. The
gate is not broken; it is narrower than the rule it is understood to enforce, which is
worse, because a green gate reads as compliance.

**How defensible is each of the six?** Two groups, and they deserve different answers.

- `src/proxy.ts` is Next.js middleware. It runs on the edge runtime, cannot import the
  container, and `eslint.config.mjs:142-146` gives `middleware` its own layer allowed to
  import `config`. `src/config/env.ts:246-256` already exports `readDevBypassFlags()` for
  exactly this, with a comment saying "Direct env access lives only in src/config and
  src/\*\*/infrastructure per the clean-architecture gate. Presentation imports this
  helper." The proxy could call it and does not; the two reads are duplicated inline
  instead. That one is a straightforward fix.
- The four `NEXT_PUBLIC_SITE_URL` reads and the two Chromium reads have no config helper
  to call. They are not sloppiness so much as an unfinished boundary: nobody wrote the
  accessor. The PDF route's two are the least troubling — they are runtime-launch details
  in a route that is already `force-dynamic` and Node-only — but `AGENTS.md` §3 is
  explicit that "App routes never import infra directly (use the composition root)", and
  reading a launch flag out of the process environment in a route handler is the same
  category of leak.

**Recommendation, in one line:** either move all six behind helpers in `src/config/`, or
amend `AGENTS.md` §6 to state the rule the harness actually enforces and add `app`,
`container` and `middleware` as named exceptions. What should not persist is a written
rule, a green gate, and six files that satisfy the gate but not the rule.

---

## 6. Defects found while writing this

1. **The `AGENTS.md` §6 env rule is violated in six files and no gate catches it.**
   Detail and evidence in §5 above. The specific structural cause is
   `scanProcessEnv`'s three-layer allowlist plus `layerOf()` returning `null` for
   `src/proxy.ts` and `src/container/**`.
2. **`GITHUB_REPO` defaults to `sagnikmitra/md`** (`src/config/env.ts:86`) — the sibling
   product's vault. A deploy that forgets to set it silently serves the wrong repository
   rather than failing. For a variable this load-bearing, no default is safer than a
   plausible one.
3. **`ALLOWED_GH_LOGIN` has two different defaults in one file** — `sagnikmitra` at
   `env.ts:47`, `dev` at `env.ts:252`. Same variable, two code paths, two answers.
4. **`APP_URL` is required by a schema nothing imports.** `env` has zero consumers in
   `src/` (only `test/config/env.test.ts`), so the requirement is enforced nowhere at
   runtime.
5. **`NEXT_PUBLIC_SITE_URL`'s default `"https://frontmatter.in"` is copied into four
   files.** Four places to update, and three of them are also §5 violations.
6. **The eleven-key AI schema, `parseAiEnv`, `configuredAiProviders` and
   `hasAnyAiProvider` have no caller in `src/`.** The gateway client reads
   `process.env` directly. Validated in tests, unused in production.
7. **`authEnv` couples the password-only deployment to GitHub OAuth.** The first access
   of `authEnv.ALLOWED_GH_LOGIN` validates `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` /
   `AUTH_SECRET` as required, so a deployment intending to use only the `sgnk-password`
   provider still throws in `signIn` without all three.

**unverified**: whether `.env.example` lists the same 34 names — the file is unreadable
to this session. Someone with access should diff it against §2 before trusting it as
onboarding documentation.
