---
id: 30-ENVIRONMENT-AND-CONFIG
title: Environment and configuration
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [environment, configuration, secrets, feature-flags]
---

# 30. Environment and configuration

Every environment variable the product reads, what breaks without it, where it is set, and how
secrets are handled. The variable **names** are here. **No value is here, and none may ever be
added.** Where a value lives is named instead.

**How this list was built** `[O]`. Three commands, run at `0af3c90` in the session that wrote this
file:

```bash
grep -rhno 'process\.env\.[A-Za-z_0-9]*' src/ | sed 's/^[0-9]*://' | sort -u
grep -rhno 'process\.env\[["'"'"'][A-Za-z_0-9]*["'"'"']\]' src/ | sed 's/^[0-9]*://' | sort -u
grep -rn 'process\.env' src/ --include='*.ts' --include='*.tsx'
```

Plus a read of `src/config/env.ts`, which declares variables the greps above cannot see because
Zod reads them from a whole `process.env` object rather than by name.

---

## 1. The rule: who may read `process.env`

**`process.env` is read only in `src/config/` and in any `*/infrastructure/` folder.** Domain,
application and presentation code take configuration as an argument or through a port.

- `src/config/README.md` states it: "Only config and infrastructure read process.env."
- `src/shared/infrastructure/README.md` states it: "The ONLY place (with src/config) that reads
  process.env."
- `src/config/env.ts:251` repeats it in a comment beside the one deliberate exception.

**The gate that checks it** is `npm run arch`, which runs
`specs/harness/clean-architecture-report.mjs`. The violation id is
`process-env-outside-config-or-infrastructure`, raised at line 123 of that file.

**Measured at `0af3c90`** `[O]`: `npm run arch` prints `"total": 0` over `"filesScanned": 214`.

**The gate is narrower than the rule, and this matters.** `scanProcessEnv` returns early unless the
file's layer is `domain`, `application` or `presentation`
(`specs/harness/clean-architecture-report.mjs:122`). `layerOf` maps `src/app/**` to `app` and
returns `null` for anything outside `src/modules/<m>/<layer>/` and `src/shared/<layer>/`.

So these five files read `process.env` outside `src/config/` and outside an `infrastructure/`
folder, and the gate does not see them:

File | Line | Variable
`src/proxy.ts` | 31, 32 | `NODE_ENV`, `DEV_BYPASS_AUTH`
`src/app/robots.ts` | 3 | `NEXT_PUBLIC_SITE_URL`
`src/app/sitemap.ts` | 3 | `NEXT_PUBLIC_SITE_URL`
`src/app/layout.tsx` | 21 | `NEXT_PUBLIC_SITE_URL`
`src/app/api/export/pdf/[...path]/route.ts` | 116, 128 | `CHROMIUM_PACK_URL`, `LOCAL_CHROME_PATH`
`src/container/dependency-container.ts` | 134 | `NEXT_PUBLIC_SITE_URL`

**This is a gap in the gate, not a breach of the rule by these files.** Widening the check to `app`
and to `null` layers would fail the build at `0af3c90` on six lines. Whether to widen it, or to
write the app and container layers into the rule as exempt, is an open item for
`56-OPEN-DECISIONS.md`. It is recorded here because a reader who trusts the AGENTS.md sentence and
then reads `src/app/robots.ts` will otherwise think one of the two is lying.

---

## 2. The lazy-read discipline

Three singletons in `src/config/env.ts` are `Proxy` objects: `env`, `authEnv`, `repoEnv`. Each
parses `process.env` on **first property access**, never at module load.

**Why it is built that way.** A build-time read makes `next build` fail on a machine that has no
secrets, and makes a test file that imports one helper drag in every unrelated variable. The
comment at `src/config/env.ts:65` states the rule: "Never read from process.env at import/build
time."

**Three consequences a new reader will hit:**

- A missing required variable throws on the **first request**, not at boot. The error names the
  field and the Zod message.
- Writing to any of the three throws `env is read-only: <prop>`.
- `parseEnv`, `parseAuthEnv` and `parseRepoEnv` are exported as pure functions so a test can pass a
  literal object. Do not reach for the singleton in a test.

**The one place that must not be lazy.** `parseFirebaseConfig()` reads each
`NEXT_PUBLIC_FIREBASE_*` variable as a **literal** `process.env.NAME` expression
(`src/config/env.ts:206` carries the warning). Next.js inlines client variables by static text
substitution at build time. A dynamic lookup, or the `Proxy` pattern used above it, resolves to
`undefined` in the browser. **Do not refactor that function into a loop.**

---

## 3. The variables

Columns: **Where set** names the environment, never a value. **Secret** says whether the value is
one; a `NEXT_PUBLIC_` variable is not, by construction, because it ships in the client bundle.

### 3.1 Application

Name | Required | Default | Read by | What breaks without it | Where set | Secret
`APP_URL` | yes | none | `src/config/env.ts:4`, through `env` | First property access on `env` throws `Invalid environment: APP_URL: Invalid url`. Must be a URL, not a bare host | Vercel project env, all three environments; `.env.local` for development | no
`NODE_ENV` | no | `development` | `src/config/env.ts:5`, `src/proxy.ts:31`, `src/config/env.ts:253` | Nothing directly. It gates the dev auth bypass, so a wrong value there silently disables the bypass | Set by the runtime, never by hand | no
`NEXT_PUBLIC_SITE_URL` | no | `https://frontmatter.in` | `src/app/robots.ts:3`, `src/app/sitemap.ts:3`, `src/app/layout.tsx:21`, `src/container/dependency-container.ts:134` | Nothing visibly. `robots.txt`, `sitemap.xml`, canonical metadata and every share URL point at production from a preview deploy | Vercel project env; leave unset locally unless testing share URLs | no

**The share-URL trap.** `NEXT_PUBLIC_SITE_URL` falls back to `https://frontmatter.in`. On a preview
deploy with the variable unset, a share link created there points at production, where the document
does not exist. Set it per preview, or expect a 404 that looks like a data bug.

### 3.2 Authentication

Auth.js v5 (`next-auth` at `^5.0.0-beta.31`) reads three of these **itself**, at request time. They
appear in the Zod schema so a missing one fails with our message rather than the library's, but our
code never passes them to the provider. `src/modules/auth/infrastructure/auth-options.ts:12` carries
the note.

Name | Required | Default | Read by | What breaks without it | Where set | Secret
`AUTH_GITHUB_ID` | yes | none | Auth.js; declared at `src/config/env.ts:44` | GitHub sign-in fails. The OAuth redirect has no client id | Vercel env; `.env.local` for development | **yes**
`AUTH_GITHUB_SECRET` | yes | none | Auth.js; declared at `src/config/env.ts:45` | The GitHub callback fails to exchange the code | Vercel env; `.env.local` | **yes**
`AUTH_SECRET` | yes | none | Auth.js; declared at `src/config/env.ts:46` | Session JWTs cannot be signed or verified. Everyone is signed out | Vercel env; `.env.local` | **yes**
`AUTH_URL` | in development | none | Auth.js, not by our code | The OAuth callback is built from the deployed origin, so local sign-in redirects to production and never returns | Not needed on Vercel, which derives it. **Rewritten by hand in `.env.local` after an env pull**, see `31-LOCAL-SETUP.md` | no
`ALLOWED_GH_LOGIN` | no | `sagnikmitra` | `src/config/env.ts:47` through `authEnv`, inside the `signIn` callback; and `src/config/env.ts:256` with a different fallback of `dev` | Nothing. The allowlist falls back to one hard-coded login, so a second person cannot sign in | Vercel env when the allowlist changes | no
`SGNK_AUTH_USER` | no | none | `src/modules/auth/infrastructure/auth-options.ts:41` | The username and password fallback provider returns `null` for every attempt. GitHub sign-in still works | Vercel env only where the GitHub callback is unreachable | no
`SGNK_AUTH_HASH` | no | none | `src/modules/auth/infrastructure/auth-options.ts:42` | Same. The password is verified against this scrypt hash server-side | Vercel env only, with `SGNK_AUTH_USER` | **yes** |
`DEV_BYPASS_AUTH` | no | none | `src/proxy.ts:32`, `src/config/env.ts:254` | Nothing in production, where it cannot take effect | Local shell or `.env.local` only. **Never set it in any Vercel environment** | no

**`ALLOWED_GH_LOGIN` has two different defaults.** The Zod schema defaults it to `sagnikmitra`
(`src/config/env.ts:47`); `readDevBypassFlags()` defaults it to `dev`
(`src/config/env.ts:256`). Both are reachable. Set the variable explicitly rather than relying on
either.

**`DEV_BYPASS_AUTH` is triple-gated** and cannot be turned on remotely. All three must hold:
`NODE_ENV === "development"`, `DEV_BYPASS_AUTH === "1"`, and a loopback or RFC1918 request host
(`src/proxy.ts:33` to `:36`). The host list is `localhost`, `127.0.0.1`, `::1`, `192.168.`, `10.`
and `172.16.` to `172.31.`.

### 3.3 The repository, which is where documents live today

Name | Required | Default | Read by | What breaks without it | Where set | Secret
`GITHUB_REPO_TOKEN` | yes | none | `src/config/env.ts:85` through `repoEnv`, used at `src/shared/infrastructure/github/client.ts:30` | Every read and write of a document fails. This is the storage layer | Vercel env; `.env.local` | **yes**
`GITHUB_REPO` | yes | **none, deliberately** | `src/config/env.ts:90`; used at `src/shared/infrastructure/github/client.ts:69`, `:78`, `:91`, `:126`, `:151`, `:167` | First access to `repoEnv` throws. Must match `owner/repo` | Vercel env; `.env.local` | no
`GITHUB_BRANCH` | no | `main` | `src/config/env.ts:91` | Nothing. Reads and writes go to `main` | Vercel env when a branch other than `main` is wanted | no

**`GITHUB_REPO` has no default and that is the point.** The comment at `src/config/env.ts:86` to
`:89` records why: it used to default to a sibling product's vault, and this value feeds
`github-writer.ts`, so a deploy that forgot the variable **wrote into the wrong repository
silently**. It now fails at first access, loudly. The defect is closed in the plan's section 25 and
in `docs/mvp0/PRODUCT-PLAN.md` section 25.

**Do not reintroduce a fallback here.** A fallback on a write target is a data-loss bug wearing a
convenience hat.

### 3.4 Model providers

Every one is optional. A provider joins the fallback chain only when its key is set
(`src/modules/ai/infrastructure/gateway-client.ts:32` to `:56`). Declared at
`src/config/env.ts:128` to `:140`.

Name | Provider | Model default when unset | Where set | Secret
`GOOGLE_GENERATIVE_AI_API_KEY` | Google | `gemini-2.5-flash` | Vercel env | **yes**
`GROQ_API_KEY` | Groq | `llama-3.3-70b-versatile` | Vercel env | **yes**
`CEREBRAS_API_KEY` | Cerebras | `llama-3.3-70b` | Vercel env | **yes**
`MISTRAL_API_KEY` | Mistral | `mistral-small-latest` | Vercel env | **yes**
`OPENROUTER_API_KEY` | OpenRouter | `meta-llama/llama-3.3-70b-instruct:free` | Vercel env | **yes**
`AI_MODEL` | Overrides Google's model, kept for back-compat; also the Gateway model string when no key is set at all | `google/gemini-3.5-flash` at `src/modules/ai/infrastructure/gateway-client.ts:69` | Vercel env | no
`AI_GOOGLE_MODEL` | Per-provider model override | as above | Vercel env | no
`AI_GROQ_MODEL` | Per-provider model override | as above | Vercel env | no
`AI_CEREBRAS_MODEL` | Per-provider model override | as above | Vercel env | no
`AI_MISTRAL_MODEL` | Per-provider model override | as above | Vercel env | no
`AI_OPENROUTER_MODEL` | Per-provider model override | as above | Vercel env | no

**What breaks when all five keys are unset.** Nothing throws. `configuredProviders()` returns an
empty list and the call falls through to the Vercel AI Gateway
(`src/modules/ai/infrastructure/gateway-client.ts:64` to `:73`), which is credit gated. The comment at `src/modules/ai/infrastructure/gateway-client.ts:22`
says it "502s on the free tier". **So the failure is a 502 at request time, not a boot error, and
it looks like a provider outage rather than a missing key.**

**The helper that tells you which is which** is `hasAnyAiProvider()` at `src/config/env.ts:178`,
built on `configuredAiProviders()` at `:164`, which returns the **names** of the set keys and never
a value. Use it for the operator warning in `33-RUNBOOK.md`; it is safe to log.

**A malformed AI value never throws.** `parseAiEnv` at `src/config/env.ts:150` returns `{}` on a
parse failure rather than raising, because "AI is a non-essential enhancement and must never break
boot". A typo in one key therefore disables **every** AI variable in that schema, silently. Check
`configuredAiProviders()` before assuming a provider is in the chain.

**The plan's chain is not this chain.** `docs/mvp0/PRODUCT-PLAN.md` section 14 routes an edit through
Groq, then Cloudflare Workers AI, then Cerebras, then SambaNova, and puts Gemini's unpaid tier and
Mistral Free explicitly **outside** the chain. The shipped code has no Cloudflare or SambaNova
adapter, and does include Google and Mistral. **The plan is the target; the code is where it is
today.** Reconciling the two is phase B work, and the provider order becomes a row in the
configuration panel rather than a constant (`docs/mvp0/PRODUCT-PLAN.md` section 30).

### 3.5 Firebase, on the client

Read as literals by `parseFirebaseConfig()` at `src/config/env.ts:212` to `:228`. Declared at
`:186` to `:194`.

Name | Required | What breaks without it | Secret
`NEXT_PUBLIC_FIREBASE_API_KEY` | yes | `parseFirebaseConfig()` throws `Invalid Firebase config`. Google sign-in and every Firestore read fail | no
`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | yes | Same | no
`NEXT_PUBLIC_FIREBASE_PROJECT_ID` | yes | Same | no
`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | yes | Same | no
`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | yes | Same | no
`NEXT_PUBLIC_FIREBASE_APP_ID` | yes | Same | no
`NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | no | Nothing. Analytics is not initialised | no

**None of these is a secret**, and the doc comment at `src/config/env.ts:199` to `:204` explains
why: "Firebase web config ships inside the client bundle by design, and access is governed by
Firestore security rules, not by hiding the API key." They are variables so a staging project can
be swapped in without a code change.

**The consequence for security review.** A leaked `NEXT_PUBLIC_FIREBASE_API_KEY` is not an
incident. A permissive `firestore.rules` is. That file is marked **PROTOTYPE** in its own header
(`firestore.rules:7` to `:9`): "not yet exercised against the emulator or a live client. Harden
before taking paid signups." Hardening it is phase A, `docs/mvp0/PRODUCT-PLAN.md` section 15.

### 3.6 PDF export

Both read at `src/app/api/export/pdf/[...path]/route.ts`.

Name | Line | Required | What breaks without it | Where set
`CHROMIUM_PACK_URL` | 116 | no | The route falls back to the brotli pack bundled from `@sparticuz/chromium`. Set it only to point at a remote pack | Vercel env, if ever
`LOCAL_CHROME_PATH` | 128 | on macOS locally | PDF export in local development cannot find a Chrome binary | Local shell or `.env.local`

**Why the bundled pack is fragile.** `next.config.ts` keeps `@sparticuz/chromium` and
`puppeteer-core` in `serverExternalPackages`, and force-includes the whole package into the
function trace through `outputFileTracingIncludes`. The comment there records the failure it fixes:
a narrower `bin/**` glob left the lambda reporting `".../bin does not exist"`. The function is also
given `1769` MB and a `60` second `maxDuration` in `vercel.json`. **Do not trim any of those four
settings without proving a PDF still renders on a deploy.**

### 3.7 Tooling, not the product

Name | Read by | Notes
`MDMAX_RUBY_BIN` | `src/modules/mdmax/infrastructure/bench.ts:77` | Path to a Ruby binary for the mdmax comparison bench. Falls back to `DEFAULT_RUBY_BIN`. Not needed to run the app
`VERCEL_GIT_PREVIOUS_SHA` | `scripts/vercel-ignore-build.sh:23` | Set by Vercel at build time. Empty means "build anyway"
`VERCEL_GIT_COMMIT_SHA` | `scripts/vercel-ignore-build.sh:24` | Set by Vercel at build time. Falls back to `HEAD`

---

## 4. Where each environment gets its values

Environment | Source of truth | How it is populated | Who can change it
Production | **Vercel project env on team `zsco` only.** Nothing is committed | The Vercel dashboard, or `vercel env add --scope zsco` | Both founders
Preview | Vercel project env, preview scope | Same | Both founders
Development | `.env.local`, untracked | `npx vercel env pull .env.local --environment=production`, then rewrite `AUTH_URL` by hand | The developer, locally
Test | Whatever `vitest` inherits | Nothing is pulled. Tests call `parseEnv` and friends with literal objects | n/a
Tauri desktop | **None today** | The shell loads a remote URL and holds no configuration of its own. See `31-LOCAL-SETUP.md` section on the desktop | n/a

**`.env.local` is untracked and sandbox-denied.** The agent sandbox this pack was written under
denies reads of `./.env`, `./.env.*`, `**/.env*`, `**/tokens.zsh`, `~/.ssh`, `~/.aws` and
`~/.config/codex-env`. **That is the correct posture and it must not be relaxed to write
documentation.** Every name in section 3 was derived from source code, never from an environment
file.

**Adding a variable is a four-step change:**

1. Add it to the right Zod schema in `src/config/env.ts`, with `.optional()` unless the product
   genuinely cannot boot without it.
2. Read it only from `src/config/` or an `*/infrastructure/` file.
3. Add a row to section 3 of this file, with the reading line number.
4. Set it in Vercel for all three environments **before** the commit that reads it lands on `main`.

Step 4 is the one that gets skipped, and it fails at first request rather than at build.

---

## 5. Secret handling

**Five rules, and they are absolute.**

1. **No value is ever written to a file in this repository**, including this one, including a
   commented-out example, including a rotated value.
2. **Production values live in Vercel and nowhere else.** `AGENTS.md` section 6 states it.
3. **Machine tokens live in `/Users/sagnikmitra/.config/codex-env/tokens.zsh`**, sourced in the same
   shell invocation as the command that needs one. **Never `cat`, `echo`, `printf` or otherwise
   print that file or any value from it.**
4. **`GH_TOKEN_ZEPHYRUS` is the only token that reaches `studiozephyrus/frontmatter`.** The general
   `GH_TOKEN` cannot fetch it. Pass it per command. **Never run `gh auth login` or
   `gh auth setup-git` with it**, because both rebind every repository on the machine to the wrong
   identity. `32-DEPLOYMENT-AND-OPS.md` carries the full trap.
5. **`.git/config` holds a credential helper that reads `$GH_TOKEN_ZEPHYRUS` from the environment.**
   The token is never written into the repository. A push failing with `Repository not found`
   almost always means the token file was not sourced, and the macOS keychain answered with the
   personal account instead. See `33-RUNBOOK.md`.

**Which of the named variables are secret.** From the tables above: `AUTH_GITHUB_ID`,
`AUTH_GITHUB_SECRET`, `AUTH_SECRET`, `SGNK_AUTH_HASH`, `GITHUB_REPO_TOKEN`, and the five provider
API keys. Eleven in total. Everything else is configuration.

**Rotation.** There is no rotation procedure today. Confirmed on 2026-09-18 `[O]`: `git grep -n -i
rotat` outside `docs/pack` and the research finds no schedule, owner or runbook. It does find two
personal access tokens recorded as exposed and still unrotated, at `HANDOFF-frontmatter-2026-09-13.md:109`.
**Resolved (proposed 18 Sep, founder review):** rotate on a suspected leak (rotate first, erase
second), when a person with access leaves, and once a year otherwise; the owner is the owner of the
security-log row in plan section 23. Rejected: no schedule. **Needs founder** for the two exposed
tokens, which only he can rotate. Writing one belongs with the
phase 0 legal-floor rows in `docs/mvp0/PRODUCT-PLAN.md` section 23, and the trigger list belongs in
`38-INCIDENT-AND-SEVERITY.md`.

---

## 6. The configuration that is not an environment variable

**The plan moves most tunable numbers out of the environment entirely** `[Z]`
(`docs/mvp0/PRODUCT-PLAN.md` section 30). The founders decided on 17 September that what a tier allows is
set from a panel, read at run time, with no deploy.

What the panel holds | Read by
Plan limits: documents, published pages, live collaborators, history days, upload size and total, AI edits, blueprints, repositories, pushes | Every cap check, through one function
Prices, monthly and annual, per plan, plus top-ups | The plan page and the Razorpay call
Model routing per plan | The AI router
Provider chain order, and whether each provider is enabled | The free-tier router
Feature flags: live editing, bring your own key, the email magic link, the indexing default | The feature gate
Pilot thresholds | The measurement dashboard
Per-account exceptions, with an expiry | The same cap check

**One read path.** A single function, `limitsFor(account)`, resolves a plan row plus any exception.
**Nothing else in the product reads a cap, and a number that appears anywhere else is a defect.**
The plan names `npm run arch` as the place to catch it, "the same way it already catches a
`process.env` read outside config and infrastructure".

**Status: specified, not built.** `limitsFor` does not exist at `0af3c90`. `grep -rn "limitsFor"
src/` returns nothing. The panel is screens S35 to S38 and phase A work.

**Two things follow for anyone adding a variable.**

- **A cap, a price, a model choice or a flag does not become an environment variable.** It waits for
  the panel, or it is a constant with a comment naming the panel row that will replace it.
- **An environment variable is for a secret, an endpoint, or a value that differs between
  deployments.** Nothing else.

**Three things the panel deliberately cannot set** (`docs/mvp0/PRODUCT-PLAN.md` section 30): the training
promise, the age floor once somebody has signed up under it, and whether bytes are held at all.
Those are claims and architecture, not rows.

---

## 7. Limits of this file

**What was not assessed.**

- No environment file was opened, in any environment. The sandbox denies them and the brief forbids
  it. Every name here comes from source code.
- Whether each name in section 3 is actually **set** in Vercel for production, preview and
  development. That needs `vercel env ls --scope zsco`, which was not run.
- The Tauri shell's configuration surface beyond `src-tauri/tauri.conf.json`. The Rust side was read
  only for the package name and version.

**What could not be verified.**

- `AUTH_URL` appears in `AGENTS.md` section 6 and in no file under `src/`. It is read by Auth.js
  itself. The order, read in the installed library on 2026-09-18 `[O]`
  (`node_modules/next-auth/package.json` says `5.0.0-beta.31`): `process.env.AUTH_URL ??
  process.env.NEXTAUTH_URL` at `node_modules/next-auth/lib/env.js:6`, then the request's
  `x-forwarded-host` or `host` when neither is set, at `node_modules/@auth/core/lib/utils/env.js:81`.
- Whether `SGNK_AUTH_USER` and `SGNK_AUTH_HASH` are set in any live environment.
- Rotation history for any secret.

**What is not established.**

- Whether the `npm run arch` gap in section 1 is a bug or an intended exemption. Both readings fit
  the code.
- Whether the shipped provider set in section 3.4 or the plan's chain wins. The plan is newer; the
  code is real.

**What would falsify this file.**

- A `grep -rn 'process\.env' src/` at a later commit returning a name that has no row in section 3.
- `npm run arch` returning a non-zero `total`, which would mean a layer rule was breached after
  `0af3c90`.
- A value, of any kind, appearing anywhere in this file.
