---
mode: reference
updated: 2026-09-09
verified_against: e318ab3
---

# Security review

> **Method.** Read in full: `src/proxy.ts`, `firestore.rules`, `next.config.ts`,
> `vercel.json`, the whole `src/modules/auth` tree (14 files), `src/config/env.ts`,
> `src/modules/preview/presentation/markdown/html-policy.ts`,
> `src/modules/share/application/resolve-public-note.ts`,
> `src/modules/vault/infrastructure/snapshot-cache.ts`, and the handlers for
> `/api/share`, `/api/commit`, `/api/vault/upload`, `/api/vault/raw/[...path]`,
> `/api/export/pdf/[...path]`, `/api/ai/complete`. Ran: `npm audit`,
> a regex secret scan over all 92 commits reachable from every ref, `npm run arch`,
> `npm run spec`, `npx vitest run`, `npm run typecheck`, `npm run lint`, and a
> one-line Node reproduction of the frontmatter-strip condition in
> `resolve-public-note.ts`.
>
> **What this pass did NOT do.** No dynamic testing: nothing was requested against a
> running server, local or deployed. No Firestore emulator run, so no rule was
> executed — the Firestore section is a reading of the file, not a test of it. The
> deployed state of `firestore.rules` on project `frontmatter-md` was not checked; I
> have no evidence the file on disk is the file in force. No penetration testing of
> the GitHub OAuth flow, no CSRF probing, no review of the Vercel project's own
> settings (deployment protection, environment scoping, log retention). No `.env`
> file was opened — the sandbox denies reads of `.env*` and I did not override it;
> environment variable NAMES were taken from `src/` and from `git show HEAD:.env.example`
> with every value suppressed. `src-tauri/` (the Rust desktop shell) was read only for
> its bundle identity, not reviewed for security. `decisions/`, `scripts/` and
> `docs/build/` were not reviewed.

---

## 1. Summary

Thirteen findings. Two are critical and both are supply-chain: the pinned
`next-auth` and `next` versions each carry an unpatched critical advisory, and in
the `next-auth` case the advisory describes precisely the failure mode this app's
auth design depends on not happening.

The application code itself is careful. Every API route that is not the Auth.js
handler gates on `getActor()` before doing anything (verified: 25 of 26 `route.ts`
files reference it; the 26th is `api/auth/[...nextauth]/route.ts`, which is the
sign-in endpoint). Request bodies are Zod-validated with explicit bounds. The
password fallback uses scrypt with a constant-time compare and runs the KDF on
every path so timing does not leak whether the credential is configured. Raw HTML
in notes goes through a hand-written element allowlist and URL-scheme filter before
render. No secret was found anywhere in the repository's history.

The weaknesses are at the seams: a security header bound to the wrong route, an
enforcement surface (Firestore) that no code uses, an SVG that can travel from
upload to same-origin execution, and no rate limit on anything.

| ID | Severity | Finding |
|---|---|---|
| S-1 | Critical | `next-auth@5.0.0-beta.31` — advisory describes auth checks failing open |
| S-2 | Critical | `next@16.2.6` — two critical RCE advisories, plus a proxy-bypass advisory |
| S-3 | High | Enforced public CSP is bound to `/p/:slug*`, a redirect stub; the real public page is `/<slug>` |
| S-4 | Medium | `firestore.rules` permits unauthenticated reads of `shares` — and no code uses Firestore |
| S-5 | Medium | SVG upload → same-origin `image/svg+xml` serve is a stored-XSS chain |
| S-6 | Medium | No rate limiting on any route, including the password login |
| S-7 | Medium | Bare-CR frontmatter survives the public-render strip and reaches the `description` meta tag |
| S-8 | Low | The GitHub login allowlist is checked at sign-in only; live sessions are never re-checked |
| S-9 | Low | Server-side headless Chromium loads mermaid and KaTeX from a CDN with no integrity attribute |
| S-10 | Low | `/api/vault/upload` accepts an unbounded base64 body |
| S-11 | Low | `js-yaml@3.14.2` reaches every note parse via `gray-matter`; four open advisories |
| S-12 | Informational | One shared repo token for all users; `GITHUB_REPO` defaults to the sibling product's repo |
| S-13 | Informational | Upstream error text is reflected to the client in AI and vault routes |

Plus one **open item** (§7) that this repository cannot close.

---

## 2. What `isPublicPath()` admits

`src/proxy.ts` lines 60-84. The function returns true — meaning no auth redirect —
for:

- `/` exactly. The home page is the login screen when unauthenticated;
  `src/app/(vault)/layout.tsx` returns `<LoginScreen />` rather than redirecting,
  so marking `/` public here lets the layout own the decision.
- `/login` exactly.
- Any single URL segment matching `/^\/([a-z0-9]+(?:-[a-z0-9]+)*)$/` that is **not**
  in `RESERVED_SLUGS`. This is the public-note URL shape.
- Anything under `/p/`.
- Anything under `/api/auth`, `/_next/static`, `/_next/image`.
- Any top-level filename matching
  `/^\/[a-z0-9._-]+\.(svg|png|jpg|jpeg|gif|ico|webp|avif|webmanifest|xml|txt|json|js|map)$/i`.
- `/opengraph-image` and anything beginning `/opengraph-image.`.

Separately, the `proxy()` function skips the redirect for **every** path beginning
`/api/` regardless of `isPublicPath()`, on the stated reasoning that API routes
self-gate and must return JSON 401 rather than an HTML redirect. That reasoning
holds only for as long as every API route actually gates. It does today.

**The single-segment slug rule is the widest admission**, and it is safe only
because of a second gate: `RESERVED_SLUGS` (in `src/modules/share/domain/slug.ts`)
covers `api`, `auth`, `login`, `logout`, `p`, every Next.js metadata route name, and
several hundred plausible future first segments. Any real page reachable at a
one-segment path is behind `src/app/(vault)/layout.tsx`, which calls `getActor()`
and shows the login screen when it returns null. I confirmed there are exactly four
`page.tsx` files: `(auth)/login`, `(public)/[slug]`, `(public)/p/[slug]`, and
`(vault)/page.tsx`. `src/app/(workspace)/` contains only a `.gitkeep`.

The dev bypass is triple-gated and I could not find a way to reach it in production:
`readDevBypassFlags()` in `src/config/env.ts` requires `NODE_ENV === "development"`
**and** `DEV_BYPASS_AUTH === "1"`, and `session.ts` additionally requires a loopback
or RFC1918 request host. `proxy.ts` mirrors all three.

---

## 3. Findings

### S-1 — Critical — `next-auth@5.0.0-beta.31` carries an advisory describing auth checks that fail open

Installed version, read from `node_modules/next-auth/package.json`: **5.0.0-beta.31**.
`npm audit` reports four advisories against it, two critical, and states
`fixAvailable: false`.

The one that matters:

> Auth.js: Configuration errors can cause existence-based auth checks to fail open
> (auth object populated with an error) — GHSA-8fpg-xm3f-6cx3, affected range
> `>=5.0.0-beta.0 <=5.0.0-beta.31`.

The pinned version is the top of the affected range. This application's authorisation
model is entirely existence-based. Every one of the 25 gated routes is shaped:

```ts
const actor = await getActor();
if (!actor) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, … });
```

and `getActor()` (`src/modules/auth/presentation/session.ts`) is:

```ts
const session = await auth();
if (!session?.user?.login) return null;
```

If a configuration error causes `auth()` to return a populated object, `session.user.login`
is the only thing standing between an anonymous request and the vault. That is a narrower
check than the advisory's worst case — it demands a `login` string specifically — but the
class of bug is exactly the one the whole app rests on.

Also present on the same version: GHSA-x445-f3h2-j279 (OAuth state, nonce and PKCE cookies
not bound to the provider that set them), which is directly relevant because this app runs
two providers, GitHub and a credentials provider.

**Recommendation.** Track the Auth.js beta line and upgrade the moment a fixed version
ships. Until then, treat this as a known accepted risk and write down who accepted it.
A beta dependency on the critical path of an application taking paid signups is a decision,
not an accident; it should be recorded as one.

### S-2 — Critical — `next@16.2.6`, three advisories that matter here

Installed version: **16.2.6**. `npm audit` lists ten advisories, `fixAvailable: false`
(the fixed versions are 16.2.11 and 16.3.3, which are outside the `^16.2.6` resolution
this lockfile produced).

- GHSA-2xp9-vwfh-vxw4 — **critical** — unauthenticated RCE in the Image Optimization API
  when AVIF files are used. Fixed in 16.3.3. `next.config.ts` configures
  `images.remotePatterns` for `avatars.githubusercontent.com`, so the Image Optimization
  API is in use.
- GHSA-p293-qw3h-jr36 — **critical** — unauthenticated RCE on Windows-hosted servers.
  Fixed in 16.3.3. **Not applicable** if the only host is Vercel's Linux runtime, which
  AGENTS.md §6b says it is. Named here so it is not later mistaken for an open exposure.
- GHSA-6gpp-xcg3-4w24 — **high** — middleware/proxy bypass in App Router applications.
  Fixed in 16.2.11. This is the advisory to care about: `src/proxy.ts` is the front gate,
  and a bypass of it removes the redirect for unauthenticated page navigations. The
  layout-level `getActor()` check would still hold, which is why this is a defence-in-depth
  loss rather than an authentication break — but the whole reason the layout check exists
  is that the proxy is described in its own comments as "optimistic".

**Recommendation.** Upgrade to `next@16.3.3` or later and re-run `npm run verify`. This is
a version bump, not a migration; it is the cheapest security work available in the repo.

### S-3 — High — the enforced public CSP is attached to a route that only redirects

`next.config.ts` builds a tight, enforced `Content-Security-Policy` for what its own
comment calls "the public note renderer only — untrusted, attacker-authored content shown
to anonymous visitors", and attaches it:

```ts
{ source: "/p/:slug*", headers: [{ key: "Content-Security-Policy", value: publicCsp }] }
```

But `src/app/(public)/p/[slug]/page.tsx` is nine lines long and its entire body is
`permanentRedirect(`/${slug}`)`. Its own header comment says so: "Legacy redirect:
/p/<slug> → /<slug>". The page that actually renders untrusted note content to anonymous
visitors is `src/app/(public)/[slug]/page.tsx`, at `/<slug>`, and `src/proxy.ts` gives it
only the **Report-Only** policy, which additionally allows `'unsafe-inline'` **and**
`'unsafe-eval'` in `script-src` and permits `connect-src` to `api.github.com` and
`ai-gateway.vercel.sh`.

So the anonymous public surface currently has: no enforced CSP, a report-only policy that
would allow inline script if it were enforced, and no report endpoint configured (there is
no `report-uri`/`report-to` directive, so the report-only policy produces browser console
noise and nothing else).

This is not currently exploitable on its own, because `html-policy.ts` is a real sanitiser
and I could not fault it by reading (see §5). It means the second line of defence is absent
from the one place it was written for.

**Recommendation.** Change the header source to cover `/:slug*` — or better, apply the
enforced policy in `proxy()` for paths where `isPublicSlugPath(pathname)` is true, so the
CSP and the public-path decision come from the same function and cannot drift apart again.
Add a `report-to` endpoint before enforcing anything on the authed editor.

### S-4 — Medium — `firestore.rules` permits unauthenticated reads, and nothing uses Firestore

The rule, quoted exactly from `firestore.rules` lines 389-397:

```
    match /shares/{slug} {
      // Deliberate unauthenticated read — this IS the public-note product
      // feature. Scoped to `get` so nobody can enumerate the collection, and
      // gated on visibility so unlisted shares stay link-only.
      allow get: if resource.data.visibility == 'public'
                 || (isAuthenticated() && resource.data.ownerUid == request.auth.uid);

      // Owner-only enumeration, for the share-management UI.
      allow list: if isAuthenticated() && resource.data.ownerUid == request.auth.uid;
```

The belief stated in the task briefing is correct: **the file does design unauthenticated
public reads of content snapshots.** A `shares` document carries `contentSnapshot`, bounded
at 900,000 characters (line 383), which is the note body. Any anonymous caller who knows a
slug can read it if `visibility == 'public'`.

Three things make this a Medium rather than a High:

1. It is the deliberate product feature, scoped correctly. `get` is allowed but `list` is
   not, so the collection cannot be enumerated; an `unlisted` share is readable only by its
   owner through this rule.
2. Slug guessing is the residual risk, and the slug space is user-chosen and up to 60
   characters (`SLUG_MAX_LEN`), so short slugs are guessable. "Unlisted" is not a security
   boundary here in the way a random 128-bit token would be — but note that under this rule
   `unlisted` is in fact owner-only, which is *stricter* than the header comment's
   "link-only" wording suggests. The comment and the rule disagree; the rule is the safer
   of the two. Worth reconciling before anyone builds a feature on the comment.
3. **No application code reads or writes Firestore.** Verified: `grep -rl firebase src/`
   returns four files. `src/shared/infrastructure/firebase/client.ts` exports `firestore()`,
   and grepping for callers of it and of that module returns exactly one importer —
   `src/modules/auth/infrastructure/firebase-auth-gateway.ts` — which imports `firebaseAuth`,
   not `firestore`. `firestore()` is dead code. The live share path writes a `public_slug`
   into the note's YAML frontmatter in the GitHub repository
   (`src/modules/share/infrastructure/share-writer.ts`) and the public page reads it back
   from GitHub (`resolve-public-note.ts`). There is no `shares` collection in production
   because nothing creates one.

The rules file is honest about its own status — lines 7-9 say "PROTOTYPE… not yet exercised
against the emulator or a live client. Harden before taking paid signups."

Two further observations from reading the file:

- The `KNOWN GAP` comment at lines 134-148 is accurate. Firestore rules have no list
  iteration, so `isBoundedList` can bound only the element count, and a caller may put a
  single 100 KB string or arbitrary types into `tags`. Element validation would need a
  Cloud Function or an Admin-SDK write path.
- `isVaultMember`, `vaultRole` and `isVaultOwner` each perform a `get()` against the parent
  vault document. A note write therefore costs multiple rule-evaluation document reads. That
  is a cost and latency issue rather than a security one, but it is the kind of thing that
  gets "optimised" later by loosening a rule.

**Recommendation.** Decide, and write the decision down: either Firestore becomes the store
(in which case run the rules against the emulator before any signup, and delete nothing),
or it does not (in which case delete `firestore.rules`, `firestore.indexes.json`,
`firebase.json`, `.firebaserc`, `src/shared/infrastructure/firebase/client.ts`, the unused
`firestore()` export, and the `firebase` dependency). A rules file nobody exercises is a
document that will be trusted later by someone who assumes it is enforced. **Unverified:**
whether these rules are currently deployed to project `frontmatter-md`. If they are not, the
project's own default rules apply, and Firebase's defaults are either locked or open
depending on how the project was created — this is worth one minute in the console.

### S-5 — Medium — an uploaded SVG can be served back as executable same-origin content

Two facts that are individually reasonable:

- `src/app/api/vault/upload/route.ts` line 28-32 allows the extension `svg`.
- `src/app/api/vault/raw/content-type.ts` maps `svg` to `image/svg+xml`, and
  `src/app/api/vault/raw/[...path]/route.ts` returns the bytes with that content type from
  the application's own origin.

An SVG served as `image/svg+xml` and opened directly in a browser tab executes any
`<script>` it contains, in the origin's context. `X-Content-Type-Options: nosniff` (set
globally in `next.config.ts`) does not help — the type is not being sniffed, it is being
declared. `X-Frame-Options: DENY` prevents framing but not direct navigation.

Both endpoints require a session, so today the attacker and the victim are the same person:
the single allowlisted GitHub login. The chain matters because of where the product is going
— the plan in `docs/PRODUCT-BRIEF.md` is multi-user and repository-shared, and at that point
"a collaborator uploads an SVG, another user clicks the raw link" is a session-stealing
cross-site scripting bug against `frontmatter.in`.

**Recommendation.** Serve `.svg` from `/api/vault/raw` as `text/plain` or
`application/octet-stream` with `Content-Disposition: attachment`, or add a
`Content-Security-Policy: sandbox` header to that route's responses. Keep the upload
allowed — SVGs are legitimate note content and the preview path already sanitises them.

### S-6 — Medium — nothing is rate limited, including the password login

`grep -rn "rateLimit\|rate-limit\|ratelimit\|throttle" src/` returns six matches, all of
them either comments about upstream 429s or a client-side debounce. There is no server-side
limiter.

The consequences, in order of severity:

1. **Online password guessing.** The `sgnk-password` credentials provider
   (`src/modules/auth/infrastructure/auth-options.ts`) can be called without limit. Auth.js
   provides CSRF protection on the callback but no attempt throttle. The password is a
   single shared secret for the whole application.
2. **CPU exhaustion.** Each attempt runs scrypt at `N=16384, r=8, p=1` with
   `maxmem: 128 MiB`, and `verifyPassword` deliberately runs the KDF even when the hash is
   absent or malformed so that timing does not leak configuration state. That is the right
   call for timing, and it makes an unauthenticated caller able to force expensive work on
   every request. On a serverless runtime this is a billing problem before it is an
   availability problem.
3. **AI spend.** The six `/api/ai/*` routes each call a paid provider and are gated only by
   session. A single authenticated client can loop them.

The mitigation today is that only one GitHub login is allowlisted, so (3) is bounded by
trust. (1) and (2) are reachable by anyone who can reach the deployment.

**Recommendation.** Put a limiter in front of `/api/auth/callback/credentials` first — that
is the unauthenticated one. Vercel's firewall rules or a small KV-backed counter both work;
the point is that the current count of limiters is zero.

### S-7 — Medium — bare-CR frontmatter is not stripped, and reaches the page description

`src/modules/share/application/resolve-public-note.ts` strips YAML frontmatter before public
render with:

```ts
if (body.startsWith("---")) {
  const end = body.indexOf("\n---", 4);
  if (end !== -1) body = body.slice(end + 4).replace(/^\n+/, "");
}
```

A document whose line endings are bare carriage returns has no `\n---` to find. Verified by
running the two expressions on `"---\rtitle: Secret\rprivate_note: do-not-publish\r---\rBody.\r"`:
`startsWith("---")` is `true`, `indexOf("\n---", 4)` is `-1`. The strip does not fire and the
frontmatter stays in the returned `content`.

The rendered body is **safe**. I ran the same input through `remark-parse` →
`remark-frontmatter` → `remark-rehype` → `rehype-raw` → `rehype-stringify` (the same plugin
order `Markdown.tsx` uses) and the output was `<p>Body.</p>`; the frontmatter was parsed into
a `yaml` node and dropped. So the visible page does not leak.

The metadata does. `src/app/(public)/[slug]/page.tsx` builds:

```ts
description: note.content.slice(0, 160).replace(/\s+/g, " "),
```

from the same un-stripped `content`. `\r` is whitespace, so the frontmatter collapses into a
single line of the `<meta name="description">` tag and into the page's Open Graph preview —
visible to anyone with the link, to crawlers, and in every chat app that unfurls it. Note
frontmatter is where users and agents put private keys, statuses and internal identifiers.

This is the same root cause as NF-3 in `docs/PRODUCT-BRIEF.md` §9 — a frontmatter fence
matcher that assumes a line feed — surfacing in a second file. **Unverified:** I did not run
Next.js and observe the emitted tag; this is a reading of the two files plus a reproduction
of the strip condition.

**Recommendation.** Fix the fence detection once, in one place, and have both
`resolve-public-note.ts` and the splice writer use it. Derive the description from the parsed
body, never from the raw string.

### S-8 — Low — the allowlist is a sign-in check, not a session check

`isAllowed()` (`src/modules/auth/domain/allowlist.ts`) is called from exactly one place: the
`signIn` callback in `auth-options.ts`. Sessions use `strategy: "jwt"`, and neither the `jwt`
nor the `session` callback re-checks the allowlist. So changing `ALLOWED_GH_LOGIN` — the
revocation mechanism — does not revoke anyone already signed in. It stops the next sign-in.
The token lives until it expires (Auth.js default, 30 days) or the user clears cookies.

The allowlist also compares against a single login, not a list: `login.trim().toLowerCase()
=== allowed.trim().toLowerCase()`. The variable name is singular and so is the behaviour.
Anyone reading `ALLOWED_GH_LOGIN` as a comma-separated list would be wrong.

**Recommendation.** Move the `isAllowed` check into the `session` callback as well, so
revocation takes effect within one session read.

### S-9 — Low — server-side Chromium pulls scripts from a CDN with no integrity check

`src/modules/export/presentation/pdf-doc.ts` line 134 emits
`import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.esm.min.mjs";`
into the HTML that `/api/export/pdf` loads in headless Chromium on the server. Line 132 and
`export-doc.ts` line 98 do the same for KaTeX CSS. `print-css.ts` loads Google Fonts.

The version is pinned, and jsDelivr's npm paths are immutable per version, so the practical
risk is a CDN compromise rather than a tag being moved. There is no `integrity` attribute, and
for a bare ES module import there could not be one — the fix is to bundle, not to add an
attribute. Mermaid is already a direct dependency (`mermaid ^11.15.0` in `package.json`), so
it is being fetched from the network despite being on disk.

**Recommendation.** Serve mermaid and KaTeX from the app's own origin in the PDF document,
using the copies already in `node_modules`. That removes a network dependency from a
60-second serverless function as well.

### S-10 — Low — unbounded upload body

`src/app/api/vault/upload/route.ts`:

```ts
const bodySchema = z.object({
  filename: z.string().min(1).max(200),
  dataBase64: z.string().min(1),
});
```

`filename` is bounded, sanitised against `/^[\w.-]+$/` after stripping path separators, and
extension-allowlisted — that part is careful. `dataBase64` has no maximum. Compare
`/api/commit`, which bounds content at 10 MB per file, 500 files, and 5 KB of message, and
explains why in a comment. The platform's own body limit will stop the extreme case; the
route should stop the ordinary one.

### S-11 — Low — `js-yaml@3.14.2` parses every note

`gray-matter@4.0.3` depends on `js-yaml ^3.13.1`; the installed version is 3.14.2.
`src/modules/vault/infrastructure/markdown-parser.ts` imports `gray-matter` and it runs over
every note when the vault snapshot is built. `npm audit` lists four advisories on this line,
three of them high, all quadratic-CPU: GHSA-5p4m-2wfm-xmqj (`!!omap` resolution, fix not
backported to 3.x), GHSA-2883-xcg3-v3hh, GHSA-52cp-r559-cp3m, GHSA-h67p-54hq-rp68 (merge-key
chains). `fixAvailable: false` — the fixes are in 3.15.x and gray-matter's range does not
reach them.

A single note with a crafted merge-key chain can therefore make a snapshot build burn CPU.
The note author is the tenant today; in the shared-repository product they need not be.
`src/modules/preview/presentation/frontmatter.ts` already uses `yaml` (eemeli) instead, and
`yaml ^2.9.0` is a direct dependency — the migration path exists.

### S-12 — Informational — one repository token, and a default pointing at the sibling product

`src/config/env.ts` lines 84-88:

```ts
const repoSchema = z.object({
  GITHUB_REPO_TOKEN: z.string().min(1),
  GITHUB_REPO: z.string().min(1).default("sagnikmitra/md"),
  GITHUB_BRANCH: z.string().min(1).default("main"),
});
```

Two notes. First, there is one server-side token with write access to the vault repository,
shared by every request; user identity is used for attribution
(`AUTHOR` in the container) but not for authorisation against GitHub. That is correct for a
single-tenant deployment and is the thing that has to change first for a multi-user one —
GitHub's own permissions are currently not part of the security model.

Second, the default value is `sagnikmitra/md`, the sibling product's repository. A deployment
that omits `GITHUB_REPO` silently reads and writes the other product's vault. Zod's `.default()`
makes an absent variable a success rather than a failure. Given that `GITHUB_REPO_TOKEN` has no
default and boot fails without it, the failure mode is narrow, but the default is the wrong
one to have.

**Recommendation.** Remove the default and let the parse throw.

### S-13 — Informational — upstream error text is reflected

`/api/ai/*` returns `{ error: "ai_failed", detail: err.message }` and several vault routes
return `{ error: "upstream_failure", detail: message }`. I checked the GitHub client
(`src/shared/infrastructure/github/client.ts`): its thrown messages are
`GitHub API error ${res.status}` and `GitHub request failed`, with no URL and no token. The AI
SDK's messages are not under this repository's control and may name providers, models or
account state. All these routes require a session.

---

## 4. Secret scan of the repository history

**What I ran.** Two `git grep` passes across every object reachable from every ref
(`$(git rev-list --all)` — **92 commits**, counted with `git rev-list --all --count`).

Pass one, token shapes:
`ghp_`, `gho_`, `ghu_`, `ghs_`, `github_pat_`, `AKIA[0-9A-Z]{16}`, `xox[baprs]-`,
`-----BEGIN … PRIVATE KEY-----`, `sk-[A-Za-z0-9]{32,}`, `AIza[0-9A-Za-z_-]{35}`.

Pass two, assignment shapes:
`(secret|token|password|api[_-]?key|passwd)["']?\s*[:=]\s*["'][A-Za-z0-9_/+=-]{16,}["']`.

**Result: two hits, both false positives, named below.**

1. `.env.example:8` — `NEXT_PUBLIC_FIREBASE_API_KEY` matches `AIza…`. **Not a secret.** A
   Firebase web API key is shipped in the client bundle by design; the file's own comment
   says so and points at `firebase-tools apps:sdkconfig` to fetch a fresh copy. Access to
   Firebase is meant to be enforced by `firestore.rules`, which is finding S-4. I confirmed
   the four genuinely secret keys in that file are empty placeholders by reading their value
   lengths through `git show HEAD:.env.example` without printing any value:
   `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET` and `GITHUB_REPO_TOKEN` are each
   two characters long, i.e. `""`.
2. `docs/research/sources/nng-progressive-disclosure.html:880` — an Algolia application ID in
   a saved copy of a Nielsen Norman Group web page under `docs/research/sources/`. **Not
   ours**, and an Algolia app ID is public by design (it appears in that site's own HTML).

**Also checked.** `.gitignore` line 4 is `.env*` with line 5 `!.env.example`. `git ls-files |
grep -i '\.env'` returns only `.env.example`. `git log --all -- .env .env.local
.env.production` returns nothing — no environment file other than the example has ever been
committed. `SGNK_AUTH_HASH` appears only as an env-var name in code and prose; no scrypt hash
value is committed.

**What this scan does not cover.** It matches known token shapes and assignment syntax. It
would not catch a secret pasted as prose, a base64 blob, or a credential in a binary or a PDF
under `docs/`. It also says nothing about secrets that existed in a *rewritten* history — this
repository has 92 commits, which is small enough that a rewrite is plausible, and I did not
check reflogs or the remote.

---

## 5. Checked and found sound

Recording these so the next reviewer does not repeat the work.

- **Every API route gates.** All 26 `route.ts` files under `src/app/api` were listed and
  grepped; 25 reference `getActor`, the 26th is the Auth.js handler.
- **Password verification** (`src/modules/auth/infrastructure/password.ts`). scrypt with
  encoded parameters, `timingSafeEqual` for the compare, KDF run on every path including
  malformed and absent hashes, plain text never persisted. The generation recipe is in a
  comment and correctly says "never in app code".
- **Commit route bounds** (`/api/commit`). 1024-byte paths, 10 MB per file, 500 files per
  commit, 5 KB message, all Zod-enforced, with the reasoning written down. Optimistic
  concurrency via `baseSha` returns 409 on conflict.
- **Raw-HTML sanitiser** (`html-policy.ts`). Element allowlist of 60 tags plus an explicit
  deny list containing `script`, `iframe`, `style`, `form`, `base`, `link`, `meta`, `object`,
  `embed`; every attribute beginning `on` is deleted; URL-bearing attributes are checked
  against a scheme allowlist that strips whitespace and control characters before comparing,
  which defeats the `java\nscript:` wrapping trick; `data:` is permitted only for
  `image/(png|jpe?g|gif|webp|svg+xml)`. Disallowed-but-not-deny-listed tags are turned back
  into literal text rather than dropped, which preserves bytes — consistent with the product's
  own refusal principle. External anchors get `rel="noopener noreferrer"`.
- **CSRF.** No custom `cookies` configuration anywhere in `src/`, so Auth.js defaults apply
  (`SameSite=Lax`, `httpOnly`, `__Secure-` prefix over HTTPS). A cross-site form POST will not
  carry the session cookie.
- **Global headers.** `X-Content-Type-Options: nosniff`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `X-Frame-Options: DENY` on `/:path*`.
- **Gates at e318ab3.** `npm run typecheck` exits 0. `npm run arch` reports 0 violations over
  208 files scanned. `npx vitest run` is 100 files, 1,581 passed and 6 expected-fail. `npm run
  lint` is **red** — 71 errors — but every one is in `decisions/`, `docs/build/` or
  `test/scratch/`, none in `src/`; see `docs/13-TECH-DEBT.md` §D-12.

---

## 6. What is left over from a store that was never built

Worth stating plainly because it affects how the rules file should be read.
`firestore.rules` is 419 lines describing seven collections — `users`, `billing`,
`usage/{uid}/months`, `vaults`, `vaults/*/notes`, `vaults/*/notes/*/revisions`, `shares` —
with plan enforcement, roles, membership and append-only revision history. **None of it
exists in the running product.** There is no billing, no plan field, no vault membership, no
revision collection. The product stores notes in a GitHub repository and drafts in the
browser's IndexedDB.

Related unwired code found while reading the auth module: `GoogleSignInButton` is exported
from `src/modules/auth/index.ts` and `authGateway()` from `src/container/client-container.ts`,
and neither is referenced anywhere else in `src/`. `LoginScreen.tsx` offers GitHub OAuth and
the password form only. So a Google sign-in, if it were reachable, would establish a Firebase
session that grants nothing — `getActor()` reads the Auth.js session, not Firebase. That is
the safe direction for a half-finished migration to fail in, and it should be finished or
removed rather than left ambiguous.

---

## 7. Open item — two GitHub personal access tokens, unrotated

**Status: open. Only the founder can close it. Not verifiable from this repository.**

Two GitHub personal access tokens were pasted into a chat window and have not been rotated.
This is inherited from earlier sessions; it is recorded here so it stops living only in
conversation.

What I can say from the repository: the history scan in §4 found no GitHub-token-shaped
string in any of the 92 commits, so the tokens are not *in this repo*. That does not clear
them. A token pasted into a chat interface is exposed wherever that conversation is stored —
the provider's servers, any local transcript on disk, any export or backup — and none of
those are inside this repository's blast radius.

Why it matters here specifically: `AGENTS.md` §6b documents that this project is on a
separate GitHub account (`studiozephyrus`) with a token read from `$GH_TOKEN_ZEPHYRUS`, and
that `GITHUB_REPO_TOKEN` has write access to the vault repository. A leaked token with repo
scope on either account is write access to the product's data store.

**Action, for the founder, in this order:**

1. Revoke both tokens at github.com → Settings → Developer settings → Personal access tokens.
   Revoke first; the audit can wait, the exposure cannot.
2. Issue replacements as fine-grained tokens scoped to the single repository each one needs,
   with an expiry date set.
3. Update `GITHUB_REPO_TOKEN` in the Vercel project (team `zsco`, project `frontmatter`) and
   the local token file. Neither value should be typed into this or any other chat.
4. Check github.com → Settings → Security log for pushes or token uses that were not yours,
   over the whole window the tokens existed.

Record the completion date somewhere durable. Until then this item stays open in every
security review of this repository.
