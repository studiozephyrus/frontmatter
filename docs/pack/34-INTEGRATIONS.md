---
id: 34-INTEGRATIONS
title: Integrations
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [integrations, third-party, firebase, r2-integration, github-app, drive, providers, razorpay]
---

# 34. Integrations

Every external service the product depends on or will depend on. **Read the state column first.**
Most of this file is a specification for work not yet done, and reading it as a description of a
running system would be the worst mistake it could cause.

**How state was established** `[O]`. For each service, a grep over `src/` and over
`package.json` dependencies at `0af3c90`. The command for each is given in its section.

---

## 1. The register, at a glance

Service | Criticality | State at `0af3c90` | Configured by | When it is down
Firebase Auth | **CRITICAL** | **Wired.** Google sign-in works | Seven `NEXT_PUBLIC_FIREBASE_*` variables | Nobody can sign in with Google. GitHub sign-in is unaffected
Auth.js with GitHub | **CRITICAL** | **Wired.** The primary sign-in | `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET`, `ALLOWED_GH_LOGIN` | Nobody can sign in with GitHub. Google is unaffected
GitHub Contents API | **CRITICAL** | **Wired**, as a personal token against one repository | `GITHUB_REPO_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` | **Every document read and write fails.** This is the storage layer today
Firestore | **CRITICAL** when it lands | **Initialised and unused.** A client exists; nothing calls it | The same seven variables, plus `firestore.rules` | Nothing, today
Cloudflare R2 | **CRITICAL** when it lands | **Not built.** No client, no dependency | Not yet | Nothing, today
The GitHub App | **HIGH** when it lands | **Not built.** The current integration is a token, not an App | Not yet | Write-back to a user's repository dies; exports still work
Google Drive | **MEDIUM** | **Not built** | Not yet | Sync stops. Documents are unaffected
Model providers | **MEDIUM** | **Wired**, five of them, all optional | Five key variables plus model overrides | AI features fail. Everything else works
Razorpay | **HIGH** when it lands | **Not built.** No dependency, no account | Not yet | No new subscriptions. Existing ones are unaffected
Resend, Sentry, PostHog | **LOW** to **MEDIUM** | **Not built.** None appears in `package.json` | Not yet | No mail, no error reports, no analytics

**The honest summary.** Three integrations carry the product today: Auth.js with GitHub, Firebase
Auth, and the GitHub Contents API as storage. Everything else in the plan is ahead of the code.

---

## 2. Firebase Auth

**Criticality: CRITICAL.** One of the two doors.

**State: wired.** `src/modules/auth/infrastructure/firebase-auth-gateway.ts` implements Google
sign-in through `signInWithPopup`.

Aspect | Detail
Project | `frontmatter-md`, under a studio Gmail account (`AGENTS.md` section 6b)
Client config | `src/shared/infrastructure/firebase/client.ts`, app name `frontmatter`
Configured by | `NEXT_PUBLIC_FIREBASE_API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`, and optional `MEASUREMENT_ID`
Providers enabled | Google only. `firebase.json` sets `anonymous: false` and `emailPassword: false`
Authorised domains | `localhost`, `frontmatter-md.firebaseapp.com`, `frontmatter-md.web.app`, `frontmatter.in`, `www.frontmatter.in`, `frontmatter.vercel.app`
Support email on the consent screen | `studiozephyrus@gmail.com`
Emulator | Declared in `firebase.json` on port `9099`. **No script runs it**

**Three implementation facts that are load-bearing:**

- **Everything is lazy.** Nothing touches `process.env` or contacts Firebase at import time, so a
  build, a test or a server render costs nothing.
- **`getApps()` is checked before `initializeApp()`**, because Next.js Fast Refresh re-evaluates
  modules and a second `initializeApp` with the same name throws. There is also a `try` and
  `getApp` fallback for a lost race.
- **The account chooser is forced.** `provider.setCustomParameters({ prompt: "select_account" })`
  at `src/modules/auth/infrastructure/firebase-auth-gateway.ts:35`. Without it, a user with several Google accounts is silently
  signed in as whichever the browser last used, which on a shared machine is a nasty surprise.

**When it is down.** Google sign-in fails. GitHub sign-in is a separate path and keeps working. **A
preview URL is not an authorised domain**, so Google sign-in fails there by configuration rather
than by outage. See `39-SHARING-A-BUILD.md`.

**The risk the plan names.** If the Google OAuth app is suspended, **every Google user is locked
out**. The named fallback is an email magic link, which is founder question 10 and section 15 of
the plan (`docs/mvp0/PRODUCT-PLAN.md:1689`).

**Its future.** `docs/mvp0/PRODUCT-PLAN.md:1622` lists the `frontmatter-md` project as **retired in
phase A**, moving to a company-held project. That is an account move, not a technology change.

---

## 3. Auth.js with GitHub

**Criticality: CRITICAL.** The other door, and the primary one.

Aspect | Detail
Library | `next-auth` at `^5.0.0-beta.31`
Config | `src/modules/auth/infrastructure/auth-options.ts`
Route | `src/app/api/auth/[...nextauth]/route.ts`
Scope requested | `read:user`, and nothing more
Session | `{ strategy: "jwt" }`
Allowlist | `isAllowed()` against `ALLOWED_GH_LOGIN`, checked inside the `signIn` callback
Second provider | A username and password fallback, id `sgnk-password`, for environments where the GitHub OAuth callback is unreachable. Verified server-side against a scrypt hash in `SGNK_AUTH_HASH`

**Never reference `authEnv` or `process.env` at module load** in this file. The comment at
`src/modules/auth/infrastructure/auth-options.ts:12` records the rule: Auth.js reads the three secrets itself at request time, and
the allowlist is read inside the callback.

**The password fallback's shape matters.** It returns a user whose `login` mirrors the GitHub
provider's, so `session.user.login`, the allowlist check and the repository writer's attribution
all keep working unchanged.

**When it is down.** GitHub sign-in fails, Google is unaffected. **`ALLOWED_GH_LOGIN` defaulting to
one login means this is not a multi-tenant door yet.**

---

## 4. The GitHub Contents API, which is the storage layer today

**Criticality: CRITICAL.** Documents live in a GitHub repository, not in a database.

Aspect | Detail
Client | `src/shared/infrastructure/github/client.ts`, base `https://api.github.com`
Auth | `Authorization: Bearer ${repoEnv.GITHUB_REPO_TOKEN}`, at `src/shared/infrastructure/github/client.ts:30`
Target | `${GITHUB_REPO}` on `${GITHUB_BRANCH}`, default branch `main`
Endpoints used | `/commits/{branch}`, `/zipball/{branch}`, `/contents/{path}`, `/commits?path=`, `/git/blobs/{sha}`
Writer | `src/modules/repository/infrastructure/github-writer.ts`
Conflict handling | A remote advance throws `ConflictError`, at `src/modules/repository/infrastructure/github-writer.ts:183`
Path validation | `validateNotePath()` at `src/modules/repository/application/file-ops.ts:40`

**What `validateNotePath` actually enforces**, read at `0af3c90`: not empty, no leading `/`, no
`..` segment, ends in `.md`. **Four rules, and none of them is a directory restriction.**

**So the plan's promise is not yet true in the code.** `docs/mvp0/PRODUCT-PLAN.md:1035` says GitHub
grants the Contents permission for the **whole repository**, so the promise to write only under
`docs/` is "frontmatter's own rule, enforced server-side and tested (F034)". **`grep -c 'docs'
src/modules/repository/infrastructure/github-writer.ts` returns `0`** `[O]`. The prefix guard is
**specified, not built**.

**Where `docs/` does appear** is `src/modules/vault/infrastructure/search-index.ts:24`, in a
`NON_VAULT_PREFIXES` list that excludes `src/`, `docs/`, `specs/`, `public/`, `.github/`,
`.claude/`, `.vercel/` and `node_modules/` from the **vault scope**. That is the opposite rule: it
keeps repository machinery out of a user's document tree. The comment says it mirrors
`get-snapshot.ts` and must be kept in step.

**The zipball read has a retry**, because that endpoint "occasionally rate-limits" and a single
blip should not surface (`src/shared/infrastructure/github/client.ts:19`).

**When it is down.** **Everything stops.** There is no local cache that survives, no second copy,
and no degraded mode. That is the single largest availability risk in the current architecture, and
it is why the plan moves bytes to R2.

---

## 5. Firestore

**Criticality: CRITICAL once it holds records. Today it holds nothing.**

**State, measured** `[O]`. Three commands at `0af3c90`:

```bash
grep -rn 'firestore()' src/ test/          # one hit: the definition itself
grep -rn 'from "firebase/firestore"' src/  # one hit: client.ts:14
grep -rln 'firebaseAuth()' src/            # two files
```

**So a Firestore client is exported and nothing calls it.** The plan describes this exactly: the
shipped app "Initialises a Firestore client" (`docs/mvp0/PRODUCT-PLAN.md:1298`).

Aspect | Detail
Rules | `firestore.rules`, **marked PROTOTYPE in its own header**: "not yet exercised against the emulator or a live client. Harden before taking paid signups"
Indexes | `firestore.indexes.json`, seven composite indexes over `notes`, `revisions`, `vaults` and `shares`, plus six `fieldOverrides` that **exclude** large fields from indexing
Collections the rules assume | `users`, `billing`, `usage/{uid}/months`, `vaults`, `vaults/{vaultId}/notes`, `shares`
Server-owned fields | `plan` on a user document. A client may only ever write `free`. Upgrades go through the billing webhook using the Admin SDK, which bypasses the rules

**Three constraints the plan carries as build rules** (`docs/mvp0/PRODUCT-PLAN.md:1288`):

- **A Blaze billing account is required.** Phase 0, with the company card.
- **A document cannot exceed 1 MiB.** So **document bytes live in R2 and never in Firestore**; a
  Firestore document holds metadata and a content hash.
- **The free quota resets at midnight Pacific, not midnight in India.** The caps the product
  enforces are ours, in the ledger. Google's quota is a floor we stay under.

**The ledger is append-only by design**, so a balance is a sum over a collection rather than a row
two writers race for. That is how a credits ledger avoids wanting transactions.

**A contradiction to name, because two sources disagree.** Plan section 15 decides Firestore.
**Plan section 18's data-model table says "Postgres rows" for eleven of its nineteen entities**
(`docs/mvp0/PRODUCT-PLAN.md:1432` onward). Section 15 is the founders' decision of 17 September and
is newer in intent; section 18 was not rewritten to match. **Read "Postgres row" in section 18 as
"a record in the database", and the database is Firestore.** `36-DATA-MIGRATION-PLAN.md` carries
this as an open item.

**When it is down.** Nothing today. Once it holds records: sign-in still works, documents in R2
still read, but plan limits, the ledger and sharing state become unreadable. **The product should
fail closed on an entitlement it cannot read, and open on a document it can.**

---

## 6. Cloudflare R2

**Criticality: CRITICAL once it holds bytes.**

**State: not built.** `grep -rlin 'r2\|s3client\|aws-sdk' src/ package.json` returns one unrelated
file `[O]`. There is no client and no dependency.

Aspect | Plan detail
Why it wins | $0.015 a GB-month, free egress, no minimum. The 1,000-user workload never leaves the free operation tiers
Region | An **apac hint**, which is a hint. `docs/mvp0/PRODUCT-PLAN.md:1326` says plainly that the bytes sit under an apac hint, **not in India**
Upload path | **Straight to R2 with a presigned URL**, because Workers cap a request body at 100 MB
Versions | One object per save, keyed by document id and content hash
**No object versioning** | **R2 has none.** Disaster recovery is built into the key layout. Settled, and `37-BACKUP-AND-RECOVERY.md` designs around it
Growth | Full-copy saves grow 18 GB a month per 1,000 users. **Store deltas or deduplicate**; this is the only line that compounds

**When it is down.** Documents cannot be read or written. Firestore metadata still reads, so the
product can show a list of documents it cannot open, which is a worse experience than an outage
page unless it says so. **Design the refusal, do not let it happen by accident.**

---

## 7. The GitHub App

**Criticality: HIGH once it lands.** Distinct from section 4, which is a personal token.

**State: not built.** The shipped integration is `GITHUB_REPO_TOKEN` against one repository. An App
is phase E (`docs/mvp0/PRODUCT-PLAN.md:1674`).

**The four facts that shape the design** (`docs/mvp0/PRODUCT-PLAN.md:1033` onward):

- **It asks for the Contents permission, read and write, and nothing else.**
- **GitHub grants that for the whole repository.** There is no path-scoped permission. **So the
  promise to write only under `docs/` is ours to enforce server-side, and to test.** That is F034,
  and section 4 above records that it is not enforced yet.
- **Installation tokens expire after one hour**, and carry their own 5,000 requests an hour. So the
  token is fetched per operation or cached with an expiry, never held.
- **Every update sends the file's blob sha and treats a 409 as a re-read.** That is the splice
  engine's compare-and-swap rule in GitHub's words, and `src/modules/repository/infrastructure/github-writer.ts:183` already implements
  the conflict half.

**Limits by plan.** Free: one repository, 20 pushes a month. Pro: unlimited.

**When it is down, or suspended.** Write-back to a user's repository dies. The plan's stated
mitigation is that **exports never need a connection**, so nobody's work is trapped
(`docs/mvp0/PRODUCT-PLAN.md:1689`).

---

## 8. Google Drive

**Criticality: MEDIUM.** A sync convenience, not a storage layer.

**State: not built.** Phase E.

Aspect | Detail and why
Scope | `drive.file` only. It covers files the app created or the person picked, and needs only basic verification. Both `changes.list` and `files.watch` accept it
**Poll, do not subscribe** | A change channel lasts a week at most, has no automatic renewal, and carries no content. So the app polls the change list from a stored page token
Poll interval | Five minutes
Quota arithmetic | 30 saves a day at 50 units is 1,500. A five-minute poll is 288 calls at 100 units, so 28,800. **Total 30,300 a day per user**
What that buys | Google's daily project threshold is 400,000,000 units. 400,000,000 / 30,300 = **13,201 connected users** before a quota increase, which the limits page says is billed
Why not one minute | 145,500 units a day, serving 2,749 users. **That is why S23 promises "within a few minutes"**
Conflicts | **Never merged silently.** Both versions are kept and the person chooses on S31

**When it is down.** Sync stops. Documents are unaffected, because Drive is a mirror and not the
record. **The one thing that must not happen is a silent merge**, and the design already refuses
one.

---

## 9. Model providers

**Criticality: MEDIUM.** AI is an enhancement. The plan is explicit that **most of what the editor
does in a day touches no model**: structural checks, the formatter, search, the map, tables to
charts, word counts, spellcheck, optical character recognition, the dictionary, citations,
currency, link previews, folder import and every representation.

### 9.1 What is wired

Five adapters, all optional, in `src/modules/ai/infrastructure/gateway-client.ts`:

Provider | Key variable | Default model | Model override
Google | `GOOGLE_GENERATIVE_AI_API_KEY` | `gemini-2.5-flash` | `AI_GOOGLE_MODEL`, then `AI_MODEL`
Groq | `GROQ_API_KEY` | `llama-3.3-70b-versatile` | `AI_GROQ_MODEL`
Cerebras | `CEREBRAS_API_KEY` | `llama-3.3-70b` | `AI_CEREBRAS_MODEL`
Mistral | `MISTRAL_API_KEY` | `mistral-small-latest` | `AI_MISTRAL_MODEL`
OpenRouter | `OPENROUTER_API_KEY` | `meta-llama/llama-3.3-70b-instruct:free` | `AI_OPENROUTER_MODEL`

**Ordering is task-aware**, at `src/modules/ai/infrastructure/gateway-client.ts:59`:

- **Quality order:** Google, Groq, Cerebras, Mistral, OpenRouter.
- **Speed order**, used for ghost text: Groq, Cerebras, Google, Mistral, OpenRouter.

**Hedging, at `src/modules/ai/infrastructure/gateway-client.ts:96`.** Ghost text races two providers under a 6 second timeout, so
a cold provider never stalls inline completion. Quality tasks try one at a time under 15 seconds,
to keep free-tier usage lean. **Either way a hung provider cannot block the chain.**

**Fallback when no key is set.** The Vercel AI Gateway, credit gated, which the comment says
"502s on the free tier".

### 9.2 What the plan routes, which is not this

`docs/mvp0/PRODUCT-PLAN.md:1189` routes differently, and **explicitly excludes two providers the
code includes**:

Call | Order the plan tries
An edit | Groq gpt-oss-120b, then Cloudflare Workers AI qwen3-30b, then Cerebras while the trial lasts, then SambaNova
A document | Cloudflare first, then Groq
A blueprint | Cerebras while the trial lasts, then Cloudflare, then paid Cloudflare neurons
On the desktop | A local model, with nothing leaving the machine

**Never in the chain, per the plan:** Gemini's unpaid tier, Mistral Free, any OpenRouter endpoint,
and anything whose terms were not opened.

**Why those exclusions.** Google's terms say "Google uses the content you submit to the Services
and any generated responses to provide, improve, and develop Google products", and the free plan's
training row on Mistral is ticked with no opt-out. **This is a promise on the sign-in page, not a
tuning choice**, and the configuration panel deliberately **cannot** change it
(`docs/mvp0/PRODUCT-PLAN.md:1843`).

**So the code as shipped can be configured into a state the product's own promise forbids.** Adding
`GOOGLE_GENERATIVE_AI_API_KEY` or `MISTRAL_API_KEY` in production puts a training-permitted
provider in the chain. **That is a real gap between the code and the plan, and it is the most
consequential one in this file.**

### 9.3 Terms, verbatim, from the plan's own reading

Provider | Trains on prompts
Groq | No: "Groq is not permitted to use Inputs or Outputs for training"
Cloudflare Workers AI | No: "Cloudflare does not use your Customer Content to (1) train any AI models made available on Workers AI or (2) improve any Cloudflare or third-party services"
Cerebras | No
SambaNova | No
OpenRouter | "Each provider on OpenRouter has its own data handling policies"
Gemini unpaid | **Yes**
Mistral Free | The free plan's training row is ticked with no opt-out
Ollama on the desktop | No. It runs locally
GitHub Models | Not applicable. "fully retired" on 30 July 2026

**Terms are re-read monthly and the date recorded.** That is a standing task, not a one-off
(`docs/mvp0/PRODUCT-PLAN.md:1687`).

### 9.4 The pool problem, and what is missing

**Every free provider meters at the organisation level.** Groq says so explicitly. So one abuser
drains the pool for every free user, and per-user fairness has to be ours.

**The five defences the research recommends for phase A**, none of which exists at `0af3c90`
`[R]` (`docs/research/2026-09-18-llm/raw/L2-abuse-guardrails.md`, FL2-31):

1. A pre-flight per-account budget on a token bucket, decremented **before** the provider call.
2. A service-wide hourly circuit breaker across all free accounts.
3. A usage row per call: account, timestamp, model, tokens in, tokens out, computed cost.
4. A starting allowance that rises with account history.
5. **Refuse rather than bill.** A free user must not be able to generate a bill.

**Pin the field names for item 3 in one place.** The research names this workspace's own recurring
bug: a producer writes one key, a consumer reads another, and a wrong number is published for
weeks.

**When a provider is down.** The chain advances silently on a 429, a 5xx or a timeout. **The caller
sees an error only when every configured provider fails.** S32 is the screen for that, and it
offers a standard question set rather than an apology.

---

## 10. Razorpay

**Criticality: HIGH once money moves.**

**State: not built.** No dependency, and `docs/mvp0/PRODUCT-PLAN.md:1626` records the account as
"not opened". Phase H.

**Four constraints, and they are architectural rather than preferences:**

- **₹15,000 per transaction is an architectural constant**, from RBI/2022-23/73 of 16 June 2022.
- **Indian cards get one payment attempt.** Design the retry as a new attempt, not a silent one.
- **A refund and cancellation page is required before the first rupee.**
- **Card entry stays on Razorpay's own checkout.** Cloudflare's self-serve agreement, clause
  2.2.1(h), forbids processing or collecting card information "on any web property that is
  receiving Free Services", so either the checkout is Razorpay's or the zone moves to a paid plan.

**Mandate notices need email**, within 24 hours, which is why Resend is on the list.

**When it is down.** No new subscriptions and no renewals. **Existing entitlements must not lapse
because a payment processor is unreachable**, so the entitlement check reads the ledger, not
Razorpay.

---

## 11. The supporting three, none of them built

Service | Purpose | Free allowance the plan cites | State
Resend | The 24-hour notices Razorpay mandates need | 3,000 a month | Not built
Sentry | Errors | 5,000 a month | Not built. **No Sentry code in `src/`**
PostHog | Analytics | A million events | Not built

**One constraint applies to all three.** An append-only security log must be kept **180 days in
Indian jurisdiction** (CERT-In directions of 28 April 2022, as the audit read them). **Sentry's and
PostHog's free tiers may not pin to India**, so the log store is its own line: R2 in Mumbai
(`docs/mvp0/PRODUCT-PLAN.md:1345`, F069). **Do not treat an error tracker as the security log.**

---

## 12. The key-less integrations, which are the cheap half

**Seven run entirely in the browser, with no key, and send no text anywhere:** KaTeX, Mermaid,
Tesseract.js for optical character recognition, pdf.js, pdf-lib, the DiceBear library, and
self-hosted Google Fonts.

**Key-less and remote, sending only the query:**

Service | Limit on its page
Wikipedia and Wiktionary | 200 requests a minute, with a user agent
The Free Dictionary | none stated
Datamuse | 100,000 a day until 1 January 2027, then a key is mandatory; customer-facing use needs prior contact
Crossref and OpenAlex | for a digital object identifier
Open Library | for an international standard book number
arXiv | one request every three seconds
Frankfurter | for currency

**Behind our proxy, because they need a secret:** Unsplash (50 an hour in demo, 1,000 after
approval, with attribution and a download ping), Pexels (200 an hour, 20,000 a month), DeepL
developer plan (a million characters), iframely (2,000 hits a month, billed once an hour per URL).

**Two that must never receive document text:**

- **LanguageTool's public endpoint** says "Do not send automated requests" and caps a request at
  20 KB. **Grammar beyond spelling waits for a self-hosted LanguageTool.**
- **Semantic Scholar** receives digital object identifiers and titles only, as good practice.

---

## 13. Adding an integration

**Six steps, and skipping step 5 is how a promise gets broken by a deploy.**

1. **Write the port first**, in `application/`. The adapter goes in `infrastructure/`. Application
   code never imports infrastructure.
2. **Wire it in `src/container/dependency-container.ts`**, never directly from a route.
3. **Add its variables to the right Zod schema** in `src/config/env.ts`, optional unless the
   product cannot boot without it, and add a row to `30-ENVIRONMENT-AND-CONFIG.md`.
4. **Decide the degraded behaviour before the happy path.** What does the product do when this is
   down? Write that into the port's contract, not into a `catch`.
5. **Check it against the promises.** The training promise, the never-send-document-text list, the
   180-day Indian log, and the write-only-under-`docs/` rule. **A new provider can breach a
   sentence on the sign-in page without touching a single number.**
6. **Add a row to section 1 of this file**, with its real state.

---

## 14. Limits of this file

**What was not assessed.**

- **No external service was called.** Nothing here was verified against a live provider, a
  dashboard or a quota page in the session that wrote it.
- Whether any provider key is actually set in production. That needs `vercel env ls --scope zsco`.
- The Firebase console: project state, quota, billing tier, the real authorised-domain list beyond
  what `firebase.json` declares.
- Rate-limit behaviour in practice for the GitHub Contents API under real load.

**What could not be verified.**

- **Every number in sections 8, 9.3 and 12 is quoted from the plan, which quotes a page it opened
  on 17 or 18 September.** They were not re-fetched here. **RE-DERIVE BEFORE QUOTING ONE
  EXTERNALLY.** Provider limits and prices change, and the plan itself says terms are re-read
  monthly.
- `UNVERIFIED:` whether `firestore.rules` as written would pass an emulator run. Its own header
  says it has never been exercised.
- `UNVERIFIED:` the state of the Google OAuth consent screen's verification.

**What is not established.**

- Whether the shipped provider set in 9.1 or the plan's chain in 9.2 governs. **Section 9.2 names
  this as the most consequential gap in the file and does not resolve it**; it is a founders'
  question (plan question 3), not an engineering choice.
- Whether section 18 of the plan or section 15 wins on the database. Section 5 states the
  contradiction.

**What would falsify this file.**

- `grep -rn 'from "firebase/firestore"' src/` returning more than one hit, which would mean
  Firestore stopped being unused and section 5 is stale.
- A `docs/` prefix check appearing in `github-writer.ts`, which would close the F034 gap in
  section 4.
- Any of the state values in section 1 being wrong when checked with the command in that service's
  section. **That is the check to run first when picking this file up.**
