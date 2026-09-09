---
mode: reference
updated: 2026-09-09
verified_against: e318ab3
---

# LOCAL SETUP

> **Method.** I read `AGENTS.md` (221 lines), `package.json`, `vercel.json`, `.vercelignore`,
> `.nvmrc`, `.gitignore`, `vitest.config.ts`, `eslint.config.mjs`, `next.config.ts`,
> `src/config/env.ts`, `src/config/README.md`, `src/proxy.ts`, `src-tauri/tauri.conf.json`,
> `test/setup.ts` and `scripts/vercel-ignore-build.sh` in full, and `docs/PRODUCT-BRIEF.md`
> §9 and `docs/MAP.md` by line range. I then ran every gate in `npm run verify` on this
> machine at commit `e318ab3` and recorded the real output; the numbers below are from those
> runs, not from the documents.
>
> **What this pass did NOT do.** I did not read `.env.example` or `.env.local` — both are
> blocked by the sandbox's read policy (`head .env.example` returns `Operation not
> permitted`), so **the authoritative list of variables in `.env.example` is unverified**
> and the list below is reconstructed from `src/config/env.ts` and a grep of `src/` instead.
> I did not run `npm ci` from a clean tree (`node_modules/` was already present and I did
> not delete it), did not start `next dev`, did not sign in through GitHub OAuth, did not
> run `npx vercel env pull`, did not build the Tauri desktop app, and did not verify any
> claim about the sibling `sgnk-md` repo, which is not checked out here.

## 1. What you need before you clone

| Thing | Required | Verified here |
|---|---|---|
| Node | `package.json` `engines.node` says `>=24`; `.nvmrc` says `24` | `node -v` → `v24.6.0` |
| npm | not pinned | `npm -v` → `11.5.1` |
| Rust toolchain | only for the Tauri desktop shell | `cargo` and `rustc` present at `~/.cargo/bin` |
| Ruby | only for `src/modules/mdmax/infrastructure/bench.ts`, which shells out to a Ruby binary | **unverified** — I did not run the bench |
| Vercel CLI | for pulling env and for deploys | `npx vercel --version` → `50.13.2` |

`bench.ts` line 74 hard-codes `DEFAULT_RUBY_BIN = "/opt/homebrew/opt/ruby/bin/ruby"` and
line 77 lets `MDMAX_RUBY_BIN` override it. If you are not on an Apple-silicon Homebrew
layout you will need that variable set before anything that touches the bench runs.

## 2. Clone

`origin` is **not** a personal account. From `git remote -v`:

```
origin      https://github.com/studiozephyrus/frontmatter.git
sagnik-old  https://github.com/sagnikmitra/frontmatter.git
```

```bash
git clone https://github.com/studiozephyrus/frontmatter.git
cd frontmatter
```

**Trap — the wrong credential answers first.** `AGENTS.md` §6b: `.git/config` carries a
credential helper that reads `$GH_TOKEN_ZEPHYRUS` from the environment. A fetch or push that
fails with *"Repository not found"* almost always means the token file was not sourced and
the macOS keychain answered with the personal account instead. Source it in the **same**
shell invocation as the git command:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && git push
```

Never run `gh auth login` or `gh auth setup-git` with the Zephyrus token — per `AGENTS.md`
§6b both rebind every repository on the machine to the wrong identity. Pass it per command:
`GH_TOKEN="$GH_TOKEN_ZEPHYRUS" gh <cmd>`.

## 3. Install

```bash
nvm use            # reads .nvmrc → 24
npm ci             # package-lock.json is committed
```

**Trap — one dependency is not declared.** `PRODUCT-BRIEF.md` §9 row 11 says `entities` is
an undeclared dependency of the engine. I verified it: `grep '"entities"' package.json`
returns nothing, while `src/modules/mdmax/domain/verdict.ts:53` and
`src/modules/mdmax/domain/fold.ts:43` both `import … from 'entities'`. It resolves today
only because something else hoists it into `node_modules/`. A `npm ci` on a future lockfile
that drops the transitive parent will break the engine and nothing in `package.json`
records why.

## 4. Environment

Production env lives in Vercel only. Per `AGENTS.md` §6, the local flow is:

```bash
npx vercel env pull .env.local --environment=production
sed -i '' 's|^AUTH_URL=.*|AUTH_URL="http://localhost:3000"|' .env.local
```

Then register `http://localhost:3000/api/auth/callback/github` on the GitHub OAuth App
before signing in locally. Both of those lines are quoted from `AGENTS.md`; **I did not run
either**, so their current correctness is unverified.

`.gitignore` ignores `.env*` and un-ignores `.env.example`. Never commit a filled `.env`.

### Variable names the code actually reads

Names only — no values were read. Sources: the four Zod schemas in `src/config/env.ts`, plus
`grep -rhoE "process\.env\.[A-Z0-9_]+" src/`, which found `process.env.*` reads in exactly
three files (`src/config/env.ts`, `src/modules/mdmax/infrastructure/bench.ts`,
`src/modules/vault/infrastructure/markdown-parser.ts`).

| Group | Variables | Behaviour if missing |
|---|---|---|
| Core (`schema`) | `APP_URL`, `NODE_ENV` | `parseEnv` **throws** on first access of `env` |
| Auth (`authSchema`) | `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET`, `ALLOWED_GH_LOGIN` (defaults to `sagnikmitra`) | `parseAuthEnv` **throws** |
| Repo (`repoSchema`) | `GITHUB_REPO_TOKEN`, `GITHUB_REPO` (defaults `sagnikmitra/md`), `GITHUB_BRANCH` (defaults `main`) | `parseRepoEnv` **throws** |
| AI (`aiSchema`, all optional) | `GOOGLE_GENERATIVE_AI_API_KEY`, `GROQ_API_KEY`, `CEREBRAS_API_KEY`, `MISTRAL_API_KEY`, `OPENROUTER_API_KEY`, `AI_MODEL`, `AI_GOOGLE_MODEL`, `AI_GROQ_MODEL`, `AI_CEREBRAS_MODEL`, `AI_MISTRAL_MODEL`, `AI_OPENROUTER_MODEL` | `parseAiEnv` **strips** bad keys rather than throwing — AI must never break boot |
| Firebase web client | `NEXT_PUBLIC_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID`, `_MEASUREMENT_ID` (optional) | `parseFirebaseConfig` **throws** |
| Dev bypass | `DEV_BYPASS_AUTH`, `ALLOWED_GH_LOGIN` | off unless `NODE_ENV === "development"` **and** `DEV_BYPASS_AUTH === "1"` |
| Engine | `MDMAX_RUBY_BIN` | falls back to `/opt/homebrew/opt/ruby/bin/ruby` |
| Also referenced | `AUTH_URL` (rewritten by the `sed` above; not in any schema in `env.ts`) | **unverified** — read by `next-auth`, not by our code |

Every schema is behind a lazily-initialised `Proxy`, so a missing variable does not fail at
import or build time — it fails on the first property read at runtime. That is deliberate
(`env.ts` comments say so) and it is also why a missing variable can survive `npm run build`
and surface only when a route is hit.

`process.env` reads are allowed **only** in `src/config/` and `*/infrastructure/`. The arch
gate enforces it. Never read it in domain, application, or presentation.

**If you cannot pull env at all**, you can still run everything except the app: `typecheck`,
`lint`, `test`, `arch`, `spec` and `corpus` all pass with no env set — I ran all six that way.

### The local dev auth bypass

`src/proxy.ts` `isLocalDevBypass()` and `src/config/env.ts` `readDevBypassFlags()` are triple
gated: `NODE_ENV === "development"`, `DEV_BYPASS_AUTH === "1"`, and the request host is
loopback or RFC1918 (`localhost`, `127.0.0.1`, `::1`, `192.168.*`, `10.*`, `172.16–31.*`).
With it on you never round-trip through GitHub OAuth locally. It cannot be turned on in
production, because the first gate is `NODE_ENV`.

## 5. Run

```bash
npm run dev        # next dev — port 3000 by default
```

**Trap — the first compile needs the public internet.** `src/app/layout.tsx:2` imports
`Google_Sans` from `next/font/google`, which fetches from `fonts.googleapis.com` at compile
time. I ran `npm run build` inside a network-restricted sandbox and it failed after 1m40s
with:

```
Turbopack build failed with 1 errors:
next/font: error: Failed to fetch `Google Sans` from Google Fonts.
```

The comment on `layout.tsx:9` says `next/font/google` self-hosts the woff2 to avoid a
*runtime* request; the *build-time* fetch still happens. Whether `next dev` fails the same
way is **unverified** — I did not start the dev server — but it uses the same loader, so
expect it. On an offline machine this is the first thing that will stop you.

## 6. The gate commands, and what they actually did here

Run from the repo root. Every number below is from a run at `e318ab3` on 2026-09-09.

| Command | What it is | Result here | Wall time |
|---|---|---|---|
| `npm run typecheck` | `tsc --noEmit` | pass, no output | 1.7 s |
| `npm run lint` | `eslint . --max-warnings=0` | **FAIL — 71 problems (71 errors, 0 warnings)** | 10.1 s |
| `npm run test` | `vitest run` | pass — **100 test files, 1581 passed, 6 expected fail (1587 total)** | 11.3 s |
| `npm run build` | `next build` | **failed in this sandbox** on the Google Fonts fetch (see §5) | 1 m 40 s |
| `npm run arch` | `specs/harness/clean-architecture-report.mjs` | `{"total": 0, "filesScanned": 208, "violations": []}` | 0.16 s |
| `npm run spec` | `specs/harness/spec-report.mjs` | `SPECS OK — 4 scanned, 0 errors, 0 warnings`; also reports `ungoverned 169 of 171 module files` | 0.17 s |
| `npm run corpus` | `scripts/corpus-foreign.mjs verify` | `CORPUS CLEAN — 8513/8513 byte-identical` | 0.52 s |
| `npm run verify` | the chain: typecheck → lint → test → build → arch → spec | **red at `e318ab3`, because lint is red** | — |

### `npm run verify` does not pass on this commit

This is the single most important thing to know before you start. `npm run lint` fails at
`e318ab3` with 71 errors across 9 files, and because `verify` is a `&&` chain with `lint`
second, `verify` cannot reach `test` or `build`. The 9 files, from parsing eslint's own
output:

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

None of them is under `src/`. They are the static decisions site, three document-build
scripts, and two scratch probes — all of them tracked in git (`git ls-files` confirms).
The errors are `no-undef` for `console`/`process`, `no-unused-vars`, and `no-empty`.

The mechanism is in `eslint.config.mjs`. Its block 4 grants Node globals to
`["specs/**/*.mjs", "scripts/**/*.{mjs,js}", "docs/**/build/**/*.{mjs,js}"]`. That last
pattern does not match `docs/build/check-refs.mjs` — the errors on that file include
`@typescript-eslint/no-unused-vars`, which block 4 explicitly switches off, which proves the
block never applied to it. Block 1 ignores `public/**` and `.scratch-*.mjs` but not
`decisions/**` or `test/scratch/**`. So: the config's file globs and the repository's actual
layout have drifted apart. Whoever fixes it should add `docs/build/**` alongside
`docs/**/build/**`, and decide deliberately whether `decisions/**` (browser JS, needs
`window`/`document`, not Node globals) and `test/scratch/**` are linted at all.

Until that is fixed, run the gates individually rather than through `verify`.

### Two scripts that are not what their names suggest

- **`npm run budget` is an `echo`.** Verbatim from `package.json`:
  `"budget": "echo 'No bundle budget configured yet — skipping'"`. It exits 0 and measures
  nothing. `PRODUCT-BRIEF.md` §9 row 5 lists this as a known problem ("Byte budget is an
  `echo` → no correctness gate"). Do not treat a green `budget` as evidence of anything.
- **`mdmax cert` is not a script.** `node -e` over `package.json` counts **26** scripts and
  `cert` is not among them. `PRODUCT-BRIEF.md` §9 row 10 says the file exists but was never
  wired to a runnable command; I confirmed both halves:

  ```
  $ node scripts/mdmax-cert.mjs --bench-info ; echo $?
  Error [ERR_MODULE_NOT_FOUND]: Cannot find module
    '.../src/modules/mdmax/domain/offsets'
    imported from .../src/modules/mdmax/application/certify.ts
  1
  ```

  Note the module it cannot find is `domain/offsets`, an extensionless relative import that
  Node's ESM loader will not resolve from a `.ts` file — not the `entities` package. Both
  problems are real; they are different problems.

## 7. Repository shape, counted

| Measure | Count | Command |
|---|---|---|
| TypeScript files under `src/` | 226 | `find src -name "*.ts" -o -name "*.tsx" \| wc -l` |
| Modules under `src/modules/` | 13 | `ls -d src/modules/*/ \| wc -l` |
| API route handlers | 26 | `find src/app/api -name "route.ts" \| wc -l` |
| Test files | 100 | `find src test -name "*.test.ts*" \| grep -v node_modules \| wc -l` |
| Tests under `src/` | 0 | same, restricted to `src` — every test lives in `test/` |
| npm scripts | 26 | `node -e "…Object.keys(scripts).length"` |
| Files the arch gate scans | 208 | `npm run arch` output |
| Pinned corpus files | 8,513 | `npm run corpus` output |

The 13 modules are `ai`, `ai-tools`, `app-shell`, `auth`, `drafts`, `editor`, `export`,
`graph`, `mdmax`, `preview`, `repository`, `share`, `vault`.

Two of those counts disagree with figures in circulation: the brief handed to this pass said
81 test files and 12 API route handlers. At `e318ab3` the commands say 100 and 26. I have
not tried to find the commit at which the older numbers were true.

## 8. Tests

`vitest.config.ts`: node environment, setup file `./test/setup.ts`, alias `@` → `./src`,
and an exclude list of `**/node_modules/**`, `**/dist/**`, `**/.claude/**`. That last entry
carries a comment recording why — two abandoned agent worktrees under `.claude/` were being
collected and inflated the suite by 66.4% with duplicate runs of a pre-work commit. Do not
remove it.

`test/setup.ts` is four lines: an `afterEach` that calls Testing Library's `cleanup`. No env,
no fixtures, no database.

Per `AGENTS.md` §4, tests mock at the **deep** path
(`@/modules/vault/presentation/use-snapshot`), not at the module barrel. Keep the indirection
module in place when refactoring barrels or the mocks stop taking effect.

The 6 "expected fail" results are `xfail`-style markers, not breakage; vitest reports them
separately from passes and the run still exits 0.

## 9. TypeScript strictness — local is weaker than Vercel

From `AGENTS.md` §5: production `tsconfig` has `strict`, `noUncheckedIndexedAccess` **and**
`exactOptionalPropertyTypes`. A local `npm run typecheck` can pass while the Vercel build
fails. The rule: an optional property that can legitimately be `undefined` must be declared
`?: T | undefined`, not bare `?: T`, because under `exactOptionalPropertyTypes` the bare form
rejects `undefined` as a passed value.

The practical consequence for local work: `npm run typecheck` is necessary but not
sufficient. `npm run build` is the one that reproduces Vercel.

## 10. The desktop shell

```bash
npm run tauri:dev
npm run tauri:build              # or :mac-arm / :mac-intel / :mac-universal
```

`src-tauri/tauri.conf.json` at `e318ab3` reads `"productName": "sgnk-md"`,
`"identifier": "ai.sgnk.md"`, and both `frontendDist` and `devUrl` point at
`https://md.sgnk.ai`. So a desktop build today **builds and ships the sibling product, not
this one** — it loads the sibling's live site in a window. That is
`PRODUCT-BRIEF.md` §9 row 9, still open. `AGENTS.md` §8 separately warns that the bundle id
`ai.sgnk.md` is unchanged on purpose and that several persistence keys keep the legacy
`sgnk-md` prefix (the IndexedDB store `sgnk-md`/`drafts`, `sgnk-md:dirty`,
`sgnk-md-bookmarks`, `sgnk-md-editor-settings`, `sgnk-md-editor`) because renaming them
silently orphans a user's local drafts. The identity fix and the key rename are two separate
decisions; do not do them in one commit.

I did not run any Tauri command.

## 11. Things that will bite you in the first hour

1. **`npm run verify` is red.** See §6. It is lint, it is not your change, and it is not in
   `src/`.
2. **`npm run build` needs network.** `next/font/google` fetches Google Sans at build time.
3. **There is no CI.** `.github/` does not exist (`ls .github` → `No such file or
   directory`), and `find . -path "*workflows*" -name "*.yml"` returns nothing. Every gate is
   run by hand or not at all. This is `PRODUCT-BRIEF.md` §9 row 3, "No CI; four gates have
   reported green while blind".
4. **New files in `public/` need a proxy check.** `AGENTS.md` §1 exists because this has
   burned the repo three or more times. `src/proxy.ts` `PUBLIC_STATIC_RE` only allowlists
   *top-level, single-segment* paths — `/^\/[a-z0-9._-]+\.(svg|png|jpg|jpeg|gif|ico|webp|avif|webmanifest|xml|txt|json|js|map)$/i`.
   Anything in a subdirectory of `public/`, and any extension outside that list, is redirected
   to `/login`. Verify with `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/<asset>`
   and require `200`. This is currently broken in production for two directories — see
   `docs/29-RUNBOOK.md` §2.
5. **Zustand selectors must be stable.** `AGENTS.md` §9: never return a new object, array or
   `Set` from a selector. Zustand v5 compares with `Object.is` and an inline `new Set(...)`
   gives an infinite render loop. Derive sets in a `useMemo` in render.
6. **`force-dynamic` and `revalidate` together is a contradiction.** Pick one.
   `/p/[slug]` is ISR-cached (`revalidate = 60`, `dynamicParams = true`).

## 12. What a clean session looks like

```bash
cd /Users/sagnikmitra/Desktop/GitHub/frontmatter
nvm use
npm ci

npm run typecheck
npm run test
npm run arch
npm run spec
npm run corpus
# npm run lint — expect 71 errors at e318ab3, see §6
# npm run build — needs network for Google Fonts

npm run dev
```

Then, per `AGENTS.md` §0 rule 4: capture `git rev-parse HEAD` before and after any agent run
and reconcile the delta. The instruction not to commit is advisory; the reconciliation is
the gate.
