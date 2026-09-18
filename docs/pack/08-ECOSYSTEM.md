---
id: 08-ECOSYSTEM
title: Ecosystem
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [accounts, repositories, domain-ownership, secrets-by-name, ownership-transfer]
---

# 08. Ecosystem

**Every account, repository, team, domain and secret this product depends on, by name.**

**No secret value appears in this file, and none may ever be added to it.** Tokens are named, never
quoted. The tokens file at `/Users/sagnikmitra/.config/codex-env/tokens.zsh` is never read, printed
or copied, and nothing in this pack was written by opening a `.env` file.

`CLAUDE.md` and `AGENTS.md` section 6b already hold most of this. This file gives it one home and
adds what was measured on 2026-09-18.

## 1. The trap that costs the most, first

**There are two Vercel homes and they are not interchangeable.**

Surface | Vercel team | Team id | Token name | Flag
The app | `zsco` | `team_RSlKvg8AqX8hr5WIuKXlNXGE` | `VERCEL_TOKEN_ZEPHYRUS` | **always** `--scope zsco`
The decisions site | (personal) | `team_CDEATPKml1m8SIZSJ0DKdEjG` | the bare `VERCEL_TOKEN` | no scope flag

**And a live inconsistency, measured in this session** `[O]`. The working tree's own Vercel link
file points the app's project name at the **other** team.

```
$ cat .vercel/project.json
{"projectId":"prj_fdlYirEdleb91svwJwnWOz7XbiNj",
 "orgId":"team_CDEATPKml1m8SIZSJ0DKdEjG",
 "projectName":"frontmatter"}
```

- `.vercel` is gitignored (`.gitignore:7`), so this is local machine state and not a committed
  defect. `git ls-files .vercel` returns nothing.
- **A bare `vercel` command run from this directory would therefore act against
  `team_CDEATPKml1m8SIZSJ0DKdEjG`**, which `CLAUDE.md` says is the decisions site's team, while the
  project name says `frontmatter`.
- UNVERIFIED: whether a separate project called `frontmatter` exists on the personal team, or
  whether this link is left over from before the migration. Resolving it needs a token this file
  does not use.
- **Until it is resolved, never run a bare `vercel` command in this repository.** Always pass
  `--scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"` for the app.

## 2. Repositories

Remote | URL | What it is
`origin` | `https://github.com/studiozephyrus/frontmatter.git` | **The repository.** A personal user account named studiozephyrus, not an organisation
`sagnik-old` | `https://github.com/sagnikmitra/frontmatter.git` | The pre-migration remote, kept as a rollback. Delete it when the migration is trusted

**Only `GH_TOKEN_ZEPHYRUS` can fetch or push it.** The general `GH_TOKEN` cannot.

**Never run `gh auth login` or `gh auth setup-git` with the Zephyrus token.** Both rebind every
repository on the machine to the wrong identity. Pass it per command instead:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && GH_TOKEN="$GH_TOKEN_ZEPHYRUS" gh <cmd>
```

**A push failing with "Repository not found" almost always means the token file was not sourced**,
and the macOS keychain answered with the personal account instead.

**Branch state, measured 2026-09-18 at 07:20 IST** `[O]`. **The branch is being committed to while
this pack is written**, so re-run every command below rather than quoting these numbers.

Measure | Value at 07:20 | Command
Current branch | `audit-response/2026-09-17` | `git rev-parse --abbrev-ref HEAD`
Head | `f237ece` | `git rev-parse HEAD`
Commits ahead of `origin/main` | **203**, and rising | `git rev-list --count origin/main..HEAD`
Date of the `origin/main` tip | **2026-07-25**, and stable | `git log -1 --format='%ci' origin/main`
Ahead of its own pushed upstream | 19, and rising | `git rev-list --left-right --count origin/audit-response/2026-09-17...HEAD`

**The one number that matters is the second-to-last row.** `origin/main` has not moved since
2026-07-25, and `main` is what deploys.

## 3. Domains, as an ownership question

**The operational home for domains is `32-DEPLOYMENT-AND-OPS.md` section 4**, which covers the id
`domains`. This section covers who holds them and what a stranger reaches today, which is the
ownership half.

### 3.1 What each host returns today

Checked on 2026-09-18 with `curl -sI`, never `curl -sL`, because a login page returns 200 after a
redirect `[O]`.

Host or path | Status | Notes
`https://frontmatter.in/` | `HTTP/2 200` | The apex, and the live brand domain
`https://www.frontmatter.in/` | `HTTP/2 307` to the apex | As designed
`https://frontmatter.sgnk.ai/` | `HTTP/2 200` | The secondary domain
`https://frontmatter.in/login` | `HTTP/2 200` | The front door
`https://frontmatter.in/privacy` | **`HTTP/2 307` to `/login`** | See below
`https://frontmatter.in/terms` | **`HTTP/2 307` to `/login`** | See below
`https://frontmatter.in/pricing` | **`HTTP/2 307` to `/login`** | See below
`https://frontmatter.in/refunds` | **`HTTP/2 307` to `/login`** | See below
`https://frontmatter.in/p/test` | `HTTP/2 200` | Public reader route
`https://frontmatter-decisions-sagnik.vercel.app/` | `HTTP/2 200` | The decisions site

**Why the four legal routes redirect.** The pages exist in `src/app/(public)/` on this branch. The
branch is over two hundred commits ahead of `origin/main`, whose tip is dated 2026-07-25, and `AGENTS.md`
section 7 says `main` is the branch that auto-deploys. INFERENCE, not confirmed against the Vercel
project settings: the deployment serving the apex predates the pages. **The plan's statement that
placeholder pages serve is true of the branch and false of what a stranger reaches today.**

## 4. The rest of the platform

Service | Account | State | Named in
Cloudflare | **Sagnik's personal account**, holding the zone `frontmatter.in`. A deliberate split from the studio accounts | Live | `AGENTS.md` section 6b
Cloudflare R2 | The store for document bytes | **Specified, not built.** No R2 client exists in `src/`, and no bucket name appears in any document in this repository | `docs/mvp0/PRODUCT-PLAN.md` section 15
Firebase | Project `frontmatter-md`, under a studio Gmail account | Live for Google sign-in. The plan retires the project in phase A | `AGENTS.md` section 6b
Firestore | Records and the usage ledger | **Decided on 17 September, not built.** `firestore.rules` exists as a prototype and phase A hardens it | `docs/mvp0/PRODUCT-PLAN.md` section 15
Cloudflare Durable Objects | Live editing sessions, with the Hibernation API | **Specified, not built** | `docs/mvp0/PRODUCT-PLAN.md` section 15
Razorpay | Payments, with the mandate rules | **Not opened** | `docs/mvp0/PRODUCT-PLAN.md` section 24
Resend | Email, for the notices Razorpay mandates need | Planned, free tier 3,000 a month | `docs/mvp0/PRODUCT-PLAN.md` section 15
Sentry | Errors | Planned, free tier 5,000 a month | `docs/mvp0/PRODUCT-PLAN.md` section 15
PostHog | Analytics | Planned, free tier a million events | `docs/mvp0/PRODUCT-PLAN.md` section 15
Apple Developer Program | Signing the macOS desktop build at 99 USD a year | **Not opened** | `docs/mvp0/PRODUCT-PLAN.md` section 24
Model providers | Groq, Cloudflare Workers AI, Cerebras, SambaNova for the free chain. Anthropic for Pro | **Not opened** | `docs/mvp0/PRODUCT-PLAN.md` section 14

## 5. Secrets, by name only

**Nothing in this section is a value. Sourcing the tokens file and printing it are different acts,
and only the first is ever allowed.**

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && <command>
```

**Machine-level tokens**, which live in that file.

Name | Reaches | Rule
`GH_TOKEN_ZEPHYRUS` | `studiozephyrus/frontmatter` | Per command only. Never `gh auth login`
`GH_TOKEN`, `GITHUB_TOKEN` | The personal accounts | **Cannot reach this repository**
`VERCEL_TOKEN_ZEPHYRUS` | The app, on team `zsco` | Always with `--scope zsco`
`VERCEL_TOKEN` | The decisions site | Never for the app
`CLOUDFLARE_API_TOKEN` | The zone and, later, R2 and Durable Objects | Personal account
`SENTRY_AUTH_TOKEN` | Errors, once wired | Not yet in use here

**Application environment variables**, read from `src/config/env.ts`. Only `src/config/` and
`*/infrastructure/` may read `process.env`, and the architecture gate enforces it.

Group | Names | Note
Core | `APP_URL`, `NODE_ENV` | Validated at boot
Auth | `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET`, `ALLOWED_GH_LOGIN` | See section 6
Repository writes | `GITHUB_REPO_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` | `GITHUB_REPO` has **no default** and fails at boot if absent
Model providers, all optional | `GROQ_API_KEY`, `CEREBRAS_API_KEY`, `MISTRAL_API_KEY`, `OPENROUTER_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY` | Each provider is opt-in by key
Model choice, all optional | `AI_MODEL`, `AI_GROQ_MODEL`, `AI_CEREBRAS_MODEL`, `AI_MISTRAL_MODEL`, `AI_OPENROUTER_MODEL`, `AI_GOOGLE_MODEL` | Overrides the default per provider
Firebase web client | `NEXT_PUBLIC_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID`, `_MEASUREMENT_ID` | Public by design, and still not printed here
Tooling | `MDMAX_RUBY_BIN` | Local only

**Production environment lives in Vercel and nowhere else.** For local work the documented step is
`npx vercel env pull .env.local --environment=production`, and the pulled file is never read into a
document, a transcript or a commit.

## 6. Two defaults that surprise people

**`GITHUB_REPO` used to default to a sibling project's vault.** It now has no default, and the
comment in `src/config/env.ts` says why: "a fallback is a write into whichever repo the fallback
names". The plan still lists this fix as phase 0 work, which is stale.

**`ALLOWED_GH_LOGIN` defaults to `sagnikmitra`.** It is checked inside the sign-in callback at
`src/modules/auth/infrastructure/auth-options.ts:82`. Left at its default, a deployment admits
exactly one GitHub login. That is correct for a private tool and wrong for a product with users,
and phase A has to change it deliberately rather than by accident.

## 7. Brand and persistence keys

**The user-visible brand is `frontmatter`.** Several persistence keys keep a legacy `sgnk-md`
prefix **on purpose**, and renaming one silently orphans a person's local drafts and settings.

Key | What it holds
IndexedDB `sgnk-md` / store `drafts` | Local drafts
`sgnk-md:dirty` | The unsaved marker
`sgnk-md-bookmarks` | Bookmarks
`sgnk-md-editor-settings` | Editor settings
`sgnk-md-editor` | Editor state
Tauri bundle id `ai.sgnk.md` | The desktop app's identity, unchanged so sign-in survives

**Change any of them only behind a real migration.** The plan schedules that migration in phase A.

**Brand accent:** `#0055ff` in light mode, `#60a5fa` in dark mode on `#0d0e11`, for contrast.

## 8. Ownership, and what has to move

From `docs/mvp0/PRODUCT-PLAN.md` section 24. **Seven of ten rows are open**, and founder question 13
is the decision that closes them.

Asset | Held by today | Moves to | By when
GitHub repository | The studio's user account | The company's organisation | Before the pilot
Vercel project | Team `zsco` | The company's team | Before the pilot
Firebase project `frontmatter-md` | A studio Gmail account | **Retired** in phase A | Phase A
Cloudflare zone `frontmatter.in` | A founder's personal account, by deliberate choice | The company | Before the first stranger
Domain registration | **Unverified** | The company | Before the first stranger
Razorpay | Not opened | The company | Before the first rupee
Apple Developer Program | Not opened | The company | Phase F
Model provider accounts | Not opened | The company | Phase B
Analytics and error accounts | **Unverified** | The company | Phase A
Intellectual property between the founders | **Unverified** | A written agreement | Before the first rupee

## 9. Two operational rules that live elsewhere and matter here

- **A new file in `public/` is allowlisted by extension** in `src/proxy.ts`, through one regular
  expression, `PUBLIC_STATIC_RE`, plus a matcher exclusion that mirrors it. **Edit both or neither.**
  The full rule and its recurring failure are in `AGENTS.md` section 1.
- **Vercel skips a redeploy when only documentation changed**, through
  `scripts/vercel-ignore-build.sh`, named as `ignoreCommand` in `vercel.json`. A documentation-only
  commit producing no deployment is that script working, not a broken integration.

## 10. The limits of this file

**What was not assessed.** Billing state, spend and quota headroom on any account. Nothing here says
whether a card is attached or a free tier is close to its ceiling.

**What could not be verified.** Four things, each needing a credential this file does not use.

- Whether `frontmatter.in` is served from `main`. Taken from `AGENTS.md` section 7.
- Whether a second Vercel project named `frontmatter` exists on the personal team, which is the
  open question in section 1.
- Who registered the domain, and where. The plan marks it unverified and so does this file.
- Which analytics and error accounts exist. The plan marks them unverified.

**What is not established.** That the accounts can move to the company at all. That is founder
question 13, and it is ownership rather than configuration, so no setting can hold it.

**What would falsify this file.** A `vercel project ls --scope zsco` showing the app is not on
`zsco`, or a redeploy of `main` that turns the four legal routes green. Either one changes a row
here on the day it happens.
