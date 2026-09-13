---
mode: reference
updated: 2026-09-09
verified_against: 6331b1b
---

# RUNBOOK — symptom to cause

> **Method.** Every entry below is anchored to a file and line I opened, or to a command I
> ran on this machine at commit `e318ab3` on 2026-09-09. The traps in §2 through §7 are the
> ones `AGENTS.md` §1 and §9 record as having burned this repository before; I re-read the
> code behind each and, where the failure is observable from outside, reproduced it against
> the live production host with `curl`. Gate results in §8–§13 are from my own runs of
> `npm run typecheck`, `lint`, `test`, `build`, `arch`, `spec` and `corpus`.
>
> **What this pass did NOT do.** I never started `next dev`, never signed in, never deployed,
> promoted or rolled back anything, and never read a token or `.env` file. So every entry
> marked *reasoned from code* has been traced through the source but not reproduced at
> runtime — I have said so in each case rather than implying a repro. I did not check Vercel
> logs, Firebase, Cloudflare, or any error-tracking service; none is wired up that I could
> find. I did not exercise the Tauri desktop shell, the PDF export route, or the AI routes.

## 1. How to use this

Find the symptom. Each entry gives the cause, the evidence, and the fix. Where a number is
quoted it came from a command shown alongside it.

Two standing rules before anything else:

- **Verify a URL with `curl -sSI`, never `curl -sL`.** §7.
- **A green gate is not evidence unless the gate does something.** `npm run budget` is an
  `echo`. §12.

---

## 2. A file in `public/` returns a redirect instead of the file

**Symptom.** A broken image, a manifest that will not load, an unindexable `robots.txt`, or
a page that shows the login screen when it should show an asset. Status is `307` (or `308`
for a directory), not `200`.

**Cause.** `src/proxy.ts` redirects any page navigation without a session cookie to `/login`
unless `isPublicPath()` says otherwise. The static allowlist is a single regex on line 15:

```js
const PUBLIC_STATIC_RE = /^\/[a-z0-9._-]+\.(svg|png|jpg|jpeg|gif|ico|webp|avif|webmanifest|xml|txt|json|js|map)$/i;
```

`^\/[a-z0-9._-]+\.` cannot match a path containing a second `/`. So the allowlist covers
**top-level, single-segment files only**, and nothing in a subdirectory of `public/`.
`isPublicSlugPath()` likewise matches exactly one segment. This is precisely the recurring
failure `AGENTS.md` §1 describes: drop an asset, forget the proxy, get a 307 to `/login`.

**This is live on production right now.** Measured against `https://frontmatter.in` on
2026-09-09:

```
/decisions/            308
/decisions/index.html  307   → location: /login
/decisions/app.js      307
/prototype/            308
/prototype/index.html  307   → location: /login
/favicon.png           200
/markdown-bitmap.svg   200
/theme-init.js         200
```

`public/decisions/` and `public/prototype/` both exist in the repository and both are
unreachable to anyone not signed in. Commit `ad7c7df` is titled "chore: serve the pilot
prototype at /prototype on the preview deployment"; on the apex domain it does not serve.

**Fix.** For a path that is public but is not a top-level `/<name>.<ext>` URL, add it
explicitly to `isPublicPath()` — that is what the function already does for `/`, `/login`,
`/p/`, `/api/auth`, `/_next/static`, `/_next/image` and `/opengraph-image`. Two clauses:

```ts
pathname.startsWith("/decisions/") ||
pathname.startsWith("/prototype/") ||
```

For a *new extension* rather than a new path, edit **both** `PUBLIC_STATIC_RE` and the
`config.matcher` regex at the bottom of the same file, in the same commit. They mirror each
other and `AGENTS.md` §1 forbids editing one alone. Note `css` is not in the current list —
`/decisions/app.css` would fail on the extension even if it were at the top level.

**Check, every time you add anything to `public/`:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/<asset>   # must be 200
```

---

## 3. Infinite render loop, or "Maximum update depth exceeded"

**Symptom.** The editor locks up; React throws an update-depth error; the CPU pegs.

**Cause.** A Zustand selector returned a freshly constructed object, array or `Set`. Zustand
v5 compares selector output with `Object.is`, so a new reference every render means a new
state every render. `AGENTS.md` §9 lists this first among the recurring traps.

**Fix.** Selectors return primitives or stable references only. Derive collections in a
`useMemo` in the component's render, not inside the selector.

```ts
// wrong — new Set each call
const tags = useStore((s) => new Set(s.tags));
// right
const tagList = useStore((s) => s.tags);
const tags = useMemo(() => new Set(tagList), [tagList]);
```

*Reasoned from `AGENTS.md` §9 and the Zustand v5 equality contract; not reproduced in this
pass.*

---

## 4. The wrong note's content appears after switching tabs

**Symptom.** Switch from note A to note B quickly and, for a frame or two, B's pane shows A's
text — or worse, A's content is written into `contentByPath[B]` and persists.

**Cause and existing guard.** `src/modules/editor/presentation/use-note-content.ts` records
the path each state was loaded for, and `toResult()` (line 28) returns `loading` whenever the
recorded path does not equal the current path. Its own comment says what breaks without it:
"a fast tab switch A→B would briefly return A's content while React has B as the current
`path` prop — that stale closure caused other consumers (preview, outline, backlinks, the
seed-content effect) to bind to the wrong note."

**So this is a regression symptom, not a new bug.** If you see it, someone removed or
weakened the `s.path !== currentPath` checks in the `error` and `ready` branches of
`toResult`. Restore them. Do not "fix" it downstream in the preview or outline — those are
four separate consumers and the guard exists so there is one place to be correct.

---

## 5. A route behaves as though it is not cached, or is cached when it should not be

**Symptom.** Stale public note pages; or a page that should be static re-rendering on every
request; or a Next build warning about conflicting route segment config.

**Cause.** `force-dynamic` and `revalidate` exported from the same route segment are a
contradiction — `AGENTS.md` §9. Pick one.

**The intended settings.** `/p/[slug]` is ISR-cached: `revalidate = 60`, `dynamicParams =
true`. If a public note is not updating within a minute, check that those two are still
what the file exports and that nothing has added `force-dynamic` beside them.

*Reasoned from `AGENTS.md` §9; I did not open the route segment config in this pass.*

---

## 6. `next build` fails on a server-only package, or PDF export 500s in production only

**Symptom (build).** A client bundle pulls in `react-dom/server`, chromium or
`puppeteer-core` and the build fails or the bundle balloons.

**Symptom (runtime, production only).** `/api/export/pdf/...` returns 500 with a message
about a path under `.../bin` not existing. Works locally, fails on Vercel.

**Cause.** Two different halves of the same problem.

For the bundle: import server-only dependencies **dynamically, inside the server route
handler**, never at module top level (`AGENTS.md` §9).

For the lambda: `@sparticuz/chromium` resolves its brotli-packed binary by runtime path,
which Next's file tracing cannot detect. `next.config.ts` compensates with both
`serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"]` and

```ts
outputFileTracingIncludes: {
  "/api/export/pdf/**": ["./node_modules/@sparticuz/chromium/**"],
}
```

The comment above it records the earlier failure: a narrow `bin/**` glob with a bracketed
route key did not land the binary in the lambda, and the runtime said `.../bin does not
exist`. The current form uses a glob route key and the whole package deliberately. `vercel.json`
separately gives that one function `memory: 1769` and `maxDuration: 60`.

If you change any of those four settings, the failure will not appear locally. It appears in
production, on that one route.

*Reasoned from `next.config.ts` and `vercel.json`; I did not invoke the PDF route.*

---

## 7. A URL check says 200 but the thing is broken

**Symptom.** A deploy verification, a smoke test or an agent reports success on an asset that
is in fact redirecting to the login page.

**Cause.** `curl -sL` follows redirects and reports the status of wherever it landed. A login
page returns 200. So `-L` converts every auth-redirect failure into a green check.

**Demonstrated on this repo's own production host, 2026-09-09:**

```
$ curl -sSI https://frontmatter.in/prototype/index.html | grep -iE '^HTTP|^location'
HTTP/2 307
location: /login

$ curl -sSL -o /dev/null -w 'final=%{http_code} url=%{url_effective}\n' \
    https://frontmatter.in/prototype/index.html
final=200 url=https://frontmatter.in/login
```

One URL, two commands, opposite verdicts. The second is wrong.

**Rule.** Assert on the first status line with `-sSI`, and when it is a 3xx also assert on
the `location` header. If you genuinely must follow redirects, print `%{url_effective}` and
assert on that too — a check that does not look at where it ended up is not a check.

---

## 8. `npm run verify` fails and you did not touch anything

**Symptom.** `npm run verify` exits non-zero on a clean checkout.

**Cause.** `npm run lint` is red at `e318ab3` and `verify` is a `&&` chain with `lint`
second, so it never reaches `test` or `build`. My run:

```
✖ 71 problems (71 errors, 0 warnings)
```

Nine files, none of them under `src/`:

```
decisions/app.js
decisions/diagram.js
decisions/questions.js
decisions/tools/gen-workflow.js
docs/build/build-brief-pdf.mjs
docs/build/build-prd-pdf.mjs
docs/build/check-refs.mjs
test/scratch/carrier-probe.mjs
test/scratch/lossy-probe.mjs
```

The errors are `no-undef` on `console` and `process`, `no-unused-vars`, and `no-empty`.

**Why.** `eslint.config.mjs` block 4 grants Node globals to
`["specs/**/*.mjs", "scripts/**/*.{mjs,js}", "docs/**/build/**/*.{mjs,js}"]`. That third
pattern does not match `docs/build/check-refs.mjs`: the errors reported on that file include
`@typescript-eslint/no-unused-vars`, which block 4 turns off, so the block demonstrably never
applied. Block 1's `ignores` covers `public/**`, `.scratch-*.mjs`, `.claude/**`, `md/**`,
`src-tauri/**` and `**/*.md`, but not `decisions/**` or `test/scratch/**` — and the
`decisions/` files are browser JavaScript, which needs `window`/`document`, not Node globals.

**Fix.** Add `docs/build/**/*.{mjs,js}` alongside the existing pattern, and make a deliberate
decision about `decisions/**` (either a browser-globals block or an ignore) and
`test/scratch/**`. **Until then, run the gates individually rather than through `verify`.**

**What actually passes at `e318ab3`,** each from my own run:

| Gate | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run test` | 100 files, 1581 passed, 6 expected fail (1587) |
| `npm run arch` | `{"total": 0, "filesScanned": 208, "violations": []}` |
| `npm run spec` | `SPECS OK — 4 scanned, 0 errors, 0 warnings` |
| `npm run corpus` | `CORPUS CLEAN — 8513/8513 byte-identical` |

---

## 9. `npm run build` fails on a font

**Symptom.**

```
Turbopack build failed with 1 errors:
next/font: error: Failed to fetch `Google Sans` from Google Fonts.
```

Possibly preceded by `Error while requesting resource … https://fonts.googleapis.com/css2?family=Google+Sans…`.

**Cause.** `src/app/layout.tsx:2` imports `Google_Sans` from `next/font/google`, which fetches
the face definition from `fonts.googleapis.com` at **compile** time. The comment on line 9
says the loader self-hosts the woff2 so there is no *runtime* request; that is true and
separate. No network at build time, no build.

**Reproduced here**: the build ran 1m40s inside a network-restricted sandbox and failed
exactly this way.

**Fix.** Build with network access. If the machine genuinely cannot reach Google Fonts,
the options are to vendor the font as a local `next/font/local` face or to run the build
somewhere with egress. Whether `next dev` fails identically is **unverified** — I did not
start it — but it uses the same loader.

**Adjacent, and a sandbox artefact rather than a repo defect:** the same run printed
`Failed to load env from .env.local Error: EPERM`. That is the sandbox denying a read of
`.env.local`, not a Next.js problem. On a normal shell it does not occur.

---

## 10. `node scripts/mdmax-cert.mjs` will not start

**Symptom.**

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  '/…/src/modules/mdmax/domain/offsets'
  imported from /…/src/modules/mdmax/application/certify.ts
```

Exit code 1 (checked separately from the pipeline: `node scripts/mdmax-cert.mjs --bench-info
>/dev/null 2>&1; echo $?` → `1`).

**Cause.** `certify.ts` imports `./offsets` without a file extension. Node's ESM loader will
not resolve an extensionless relative specifier, and `mdmax-cert.mjs` loads the TypeScript
source directly via `await import()` rather than through a bundler that would resolve it.

**Context.** `docs/PRODUCT-BRIEF.md` §9 row 10 records this as a known open problem —
"`mdmax cert` was never wired to a runnable command", 37 days after a commit message claiming
it landed. `cert` is not one of the 26 entries in `package.json` `scripts`
(`grep '"mdmax-cert"' package.json` returns nothing; only `corpus` matches a `scripts/`
reference). Both halves are true and I confirmed both.

**Do not confuse this with the other engine dependency problem.** §11 is a different fault.

---

## 11. The engine imports a package that is not declared

**Symptom.** A fresh install, a different package manager, or an attempt to drop the engine
into another host fails to resolve `entities`.

**Cause.** Verified:

```
$ grep '"entities"' package.json          → no match
$ grep -rn "from 'entities'" src/modules/mdmax/
src/modules/mdmax/domain/verdict.ts:53:import { decodeHTML } from 'entities'
src/modules/mdmax/domain/fold.ts:43:import { decodeHTML, escapeText } from 'entities'
```

It resolves today only because something else in the tree hoists it into `node_modules/`.
`PRODUCT-BRIEF.md` §9 row 11 states the consequence plainly: any claim that the engine drops
into another host unchanged fails here first.

**Fix.** Add `entities` to `dependencies` with an explicit version. Half a day at most, and
it removes a silent dependency on hoisting order.

---

## 12. A gate is green and it means nothing

**`npm run budget`** is, verbatim from `package.json`:

```json
"budget": "echo 'No bundle budget configured yet — skipping'"
```

It exits 0 and measures nothing. `PRODUCT-BRIEF.md` §9 row 5 lists it as a known problem.
Never cite it as evidence.

**There is no CI.** `ls .github` → `No such file or directory`; a search for workflow YAML
finds none. Every gate runs only when a human runs it. `PRODUCT-BRIEF.md` §9 row 3 puts it
as "four gates have reported green while blind".

**`npm run spec` says more than "OK".** Its output at `e318ab3` includes
`ungoverned 169 of 171 module files (INFO while bootstrapping)`. Four specs govern two files.
A green spec gate covers a very small fraction of the module surface, and the harness says so
in its own output — read the whole thing, not the last line.

---

## 13. Local typecheck passes, Vercel fails

**Symptom.** `npm run typecheck` is clean; the Vercel build reports a TypeScript error,
usually about `undefined` not being assignable.

**Cause.** `AGENTS.md` §5: the production `tsconfig` has `strict`,
`noUncheckedIndexedAccess` **and** `exactOptionalPropertyTypes`, and the local run is weaker.
Under `exactOptionalPropertyTypes`, a property declared `?: T` rejects an explicitly passed
`undefined`.

**Fix.** Declare optional properties that may legitimately be `undefined` as
`?: T | undefined`.

**Prevention.** `npm run build` reproduces Vercel; `npm run typecheck` does not. Run the
build before pushing anything that touches types.

---

## 14. An import is refused by lint or by the arch gate

**Symptom.** `no-restricted-imports`, an `eslint-plugin-boundaries` error, or a non-zero
`total` from `npm run arch`.

**Causes, in the order they occur.**

1. **A god-folder import.** `eslint.config.mjs` line 155 bans `@/server/*`, `@/lib/*` and
   `@/components/*` outright — the comment calls it a "forever-ban on the deleted
   god-folders". Do not create `src/server/`, `src/lib/` or `src/components/` either;
   `specs/harness/server-folder-blocklist.mjs` exists to keep that empty.
2. **A deep cross-module import.** `AGENTS.md` §2: cross-module imports go through the module
   barrel `@/modules/<name>`, never `@/modules/<name>/presentation/foo` — including for
   types. Add the export to the barrel instead.
3. **A layer violation.** The direction is inward only:
   `domain ← application ← infrastructure`, with `presentation` and `container` above.
   Application must never import infrastructure; use a port. App routes must never import
   infrastructure directly; go through the composition root at
   `src/container/dependency-container.ts`.
4. **`process.env` outside its two homes.** Reads are permitted only in `src/config/` and
   `*/infrastructure/`. At `e318ab3` exactly three files read it: `src/config/env.ts`,
   `src/modules/mdmax/infrastructure/bench.ts` and
   `src/modules/vault/infrastructure/markdown-parser.ts`.

`npm run arch` scans 208 files and must stay at `total: 0`.

---

## 15. A test mock stops taking effect after a refactor

**Symptom.** A previously passing test now exercises the real implementation.

**Cause.** `AGENTS.md` §4: tests mock at the **deep** path
(`@/modules/vault/presentation/use-snapshot`), not at the barrel. Collapsing the indirection
module into the barrel during a refactor makes every deep-path mock miss.

**Fix.** Keep the indirection module in place. If you must move it, update the mocks in the
same commit.

---

## 16. The test suite suddenly has far more tests than it should

**Symptom.** Test-file count jumps; the same test appears to run twice; timings inflate.

**Cause.** Abandoned agent worktrees under `.claude/` get collected. `vitest.config.ts` names
the incident in a comment: two such worktrees "were being collected, inflating the suite by
66.4% with duplicate runs of a pre-work commit". The exclude list is
`["**/node_modules/**", "**/dist/**", "**/.claude/**"]`.

**Fix.** Do not remove `**/.claude/**` from `exclude`. If the count moves, check
`.claude/worktrees/` before you look anywhere else. The correct count at `e318ab3` is **100
test files, 1581 passed, 6 expected fail**.

---

## 17. A missing environment variable does not fail the build — it fails a request

**Symptom.** The app builds and deploys, then a specific route throws
`Invalid environment: …` or `Invalid auth environment: …` the first time it is hit.

**Cause, and it is deliberate.** Every schema in `src/config/env.ts` sits behind a lazily
initialised `Proxy`. The comment says it outright: "Never read from process.env at
import/build time — only on first property access." So a missing `AUTH_SECRET` or
`GITHUB_REPO_TOKEN` cannot be caught by a build.

**Which ones throw, and which do not.** `parseEnv`, `parseAuthEnv`, `parseRepoEnv` and
`parseFirebaseConfig` all throw. `parseAiEnv` does not — it strips offending keys and returns
`{}`, because AI is a non-essential enhancement and "must never break boot". So a broken AI
key produces a degraded AI feature and a silent config, never a crash.

**Diagnostic.** `configuredAiProviders()` in the same file returns the names of the provider
keys currently set. `hasAnyAiProvider()` is false when none is — and its comment warns that
without one, the app falls back to the credit-gated Vercel AI Gateway, "which 502s on the
free tier".

**So: an AI route returning 502 with no error in your logs is most likely no provider key.**

---

## 18. Firebase config is `undefined` in the browser

**Symptom.** Client-side Firebase initialisation fails with an undefined `apiKey`, in the
browser only.

**Cause.** Next inlines `NEXT_PUBLIC_*` variables into the client bundle by **static text
substitution** at build time. A dynamic lookup (`process.env[key]`, or the `Proxy` pattern
used everywhere else in `src/config/env.ts`) resolves to `undefined` in the browser.

`parseFirebaseConfig()` therefore reads each of the seven variables as a literal
`process.env.NEXT_PUBLIC_FIREBASE_…` expression, and carries a `CRITICAL` comment saying "Do
not refactor these into a loop."

**Fix.** If someone has looped them, unloop them. This is the one place in the file where the
repetition is load-bearing.

---

## 19. A push to `main` produced no deployment

**Symptom.** The commit is on `origin/main` and Vercel shows nothing new.

**Cause, most likely.** `scripts/vercel-ignore-build.sh` skipped it. The script's contract is
inverted: **exit 0 skips, exit 1 builds.** It builds only when the diff between
`VERCEL_GIT_PREVIOUS_SHA` and the current commit touches one of:

```
src  public
package.json  package-lock.json
next.config.ts  tsconfig.json
eslint.config.mjs  postcss.config.mjs
vercel.json  scripts/vercel-ignore-build.sh
.nvmrc
```

Commits touching only `docs/`, `decisions/`, `specs/`, `test/`, `src-tauri/` or `AGENTS.md`
are skipped by design. The build log line to look for is
`[ignore] no watched-path changes — skipping build.`

**Cause, if the deploy did not appear at all — no build, no failure, no dashboard entry.**
That is not the ignore step. An invalid `vercel.json` makes a git-triggered deployment vanish
without a record: the webhook produces nothing and the dashboard shows nothing. The CLI names
the error in about a second where the webhook is silent. So when a push produces *no
deployment entry whatsoever*, run a CLI deploy before touching the git integration or the
project link — it validates the config and prints the reason.

*The ignore-step behaviour is read straight from the script. The invalid-`vercel.json` failure
mode is carried from a prior incident on a sibling project and is **unverified on this
repository**.*

---

## 20. `git push` fails with "Repository not found"

**Symptom.** Push or fetch against `origin` fails as though the repository does not exist.

**Cause.** `origin` is `https://github.com/studiozephyrus/frontmatter.git` — not a personal
account. Per `AGENTS.md` §6b, `.git/config` carries a credential helper that reads
`$GH_TOKEN_ZEPHYRUS` from the environment (I did not open `.git/config`). If the token file was not sourced in that shell, the macOS keychain answers with
the personal identity, which has no access, and GitHub returns "not found" rather than
"forbidden".

**Fix.** Source in the same invocation:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && git push
```

**Do not** run `gh auth login` or `gh auth setup-git` with the Zephyrus token — `AGENTS.md`
§6b says both rebind every repository on the machine to the wrong identity. Pass it per
command: `GH_TOKEN="$GH_TOKEN_ZEPHYRUS" gh <cmd>`. Same shape for Vercel: always
`--scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"`, never the bare `VERCEL_TOKEN`.

---

## 21. A Vercel command reports the project does not exist

**Symptom.** `vercel ls`, `vercel promote` or an API call returns a not-found for a project
you can see in the dashboard.

**Two causes, and they look identical.**

1. **The token was not sourced**, or the bare `VERCEL_TOKEN` was used instead of
   `VERCEL_TOKEN_ZEPHYRUS`. See §20.
2. **The wrong team id.** There is an unresolved contradiction in this repository:
   `AGENTS.md` §6b names team `zsco` as `team_RSlKvg8AqX8hr5WIuKXlNXGE`, while
   `.vercel/project.json` for project `frontmatter` records
   `"orgId":"team_CDEATPKml1m8SIZSJ0DKdEjG"`, and
   `HANDOFF-decisions-v2-2026-09-09.md` §5.4 gives the same
   `team_CDEATPKml1m8SIZSJ0DKdEjG` for `frontmatter-decisions`. Both cannot be right.
   I could not call the API to settle it, so **which one is wrong is unverified**.

**Fix.** Settle the team id once — `vercel teams ls` with a sourced token will print slug and
id together — and correct `AGENTS.md` §6b in the same commit. Note that `.vercel/` is
gitignored, so a fresh clone has no project link at all and needs `vercel link` first.

---

## 22. The desktop build produces the wrong application

**Symptom.** `npm run tauri:build` yields an app called **sgnk-md** that opens
`https://md.sgnk.ai`.

**Cause.** That is what `src-tauri/tauri.conf.json` says at `e318ab3`:
`"productName": "sgnk-md"`, `"identifier": "ai.sgnk.md"`, and both `frontendDist` and
`devUrl` set to `https://md.sgnk.ai`. The desktop shell has not been repointed at this
product. `PRODUCT-BRIEF.md` §9 row 9 tracks it as open, one day of work.

**Before you change it, read `AGENTS.md` §8.** The bundle id `ai.sgnk.md` is unchanged *on
purpose*, and several persistence keys deliberately keep the legacy `sgnk-md` prefix — the
IndexedDB store (`sgnk-md`/`drafts`), `sgnk-md:dirty`, `sgnk-md-bookmarks`,
`sgnk-md-editor-settings`, `sgnk-md-editor`. Renaming any of them silently orphans a user's
local drafts and settings. The product identity fix and the storage-key rename are two
different decisions with two different risk profiles. Do not do them in one commit, and do
not do the second without a migration.

---

## 23. Where to look when nothing here fits

- `AGENTS.md` — the operating rules. §0 for the four that override everything, §1 for public
  assets, §9 for the recurring traps.
- `docs/MAP.md` — the index of which document answers which question, and which documents
  never to open. Its rule: never open a lower tier when a higher tier answers the question.
- `docs/PRODUCT-BRIEF.md` §9 — the eleven known technical problems, with days attached.
- `docs/10-LOCAL-SETUP.md` — install, env, gate results.
- `docs/11-DEPLOYMENT.md` — the three deployed surfaces, and rollback.

**There is no error tracking, no uptime monitor and no log aggregation wired into this
repository that I could find.** Production diagnosis today means `curl` and the Vercel
dashboard. Treat that as the largest gap in this runbook: every entry above is a symptom
someone has to notice first.
