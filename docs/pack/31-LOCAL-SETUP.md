---
id: 31-LOCAL-SETUP
title: Local setup
mode: tutorial
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [local-development, onboarding, tauri, toolchain]
---

# 31. Local setup

Clone to running, for the web app and for the desktop shell. **This records the path that actually
works, including the four places it stops.** The ideal path is three commands and would be useless
to you, because you would hit the first wall in under a minute.

**Who this is for.** An agent or a person who has never seen this repository, on macOS, with no
prior credentials loaded.

---

## 0. What you need before the first command

Thing | Version here | How it is pinned | Checked with
Node | `v24.6.0` `[O]` | `.nvmrc` holds `24`; `package.json` has `"engines": {"node": ">=24"}` | `node --version`
npm | `11.5.1` `[O]` | not pinned | `npm --version`
Rust | `1.95.0` `[O]` | not pinned | `rustc --version`
Cargo | `1.95.0` `[O]` | not pinned | `cargo --version`
Git | any recent | not pinned | `git --version`

**Rust and Cargo are only for the desktop shell.** The web app needs neither. Skip section 4 and
you can ignore them.

**The versions above are what the machine that wrote this file reported**, not a requirement beyond
the Node floor. Nothing in the repository pins a Rust version.

---

## 1. Clone, and the wall you hit first

```bash
git clone https://github.com/studiozephyrus/frontmatter.git
```

**This fails with `Repository not found` on almost every machine, and the message is a lie.** The
repository exists. It is private, it lives on `studiozephyrus`, and **only `GH_TOKEN_ZEPHYRUS`
reaches it.** The general `GH_TOKEN` cannot, and on macOS the keychain answers first with the
personal account, which gets a 404 rather than a 403.

**What works:**

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && \
  GH_TOKEN="$GH_TOKEN_ZEPHYRUS" gh repo clone studiozephyrus/frontmatter
```

**Three rules around that command, and breaking any one of them costs an hour:**

1. **Source the token file in the same shell invocation as the command that needs it.** Environment
   variables do not persist between tool calls, and a separate `source` line does nothing.
2. **Never `cat`, `echo` or `printf` that file, and never print a value from it.**
3. **Never run `gh auth login` or `gh auth setup-git` with the Zephyrus token.** Both rebind
   **every** repository on the machine to the wrong identity. Pass it per command instead. This is
   in `AGENTS.md` section 6b and it has burned this repository before.

**On an existing clone**, `.git/config` already holds a credential helper that reads
`$GH_TOKEN_ZEPHYRUS` from the environment. The token itself is never written into the repository.
So on an existing clone you only need the `source` line:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && git pull
```

**Two remotes exist.** `origin` is `studiozephyrus/frontmatter`. `sagnik-old` is
`sagnikmitra/frontmatter`, the pre-migration remote, kept as a rollback. **Never push to
`sagnik-old`.**

---

## 2. Install and prove the tree is sound

```bash
npm install
npm run verify
```

`npm run verify` is six gates in one line, and its definition in `package.json` is:

```
npm run typecheck && npm run lint && npm run test && npm run build && npm run arch && npm run spec
```

Gate | Command | What it catches
`typecheck` | `tsc --noEmit` | Type errors, but **not every one Vercel catches**. See section 6
`lint` | `eslint . --max-warnings=0` | A warning fails the build. There is no warning budget
`test` | `vitest run` | The unit suite
`build` | `next build` | The strict flags local typecheck misses
`arch` | `node specs/harness/clean-architecture-report.mjs` | Layer breaches, `process.env` in the wrong layer, god folders
`spec` | `node specs/harness/spec-report.mjs` | The contract gate

Two more gates are not in `verify` and are named in `AGENTS.md` section 0.1:

```bash
npm run corpus    # 8,513 byte-pinned files; exits 1 on one changed byte
npm run spec      # the contract gate, also inside verify
```

**`npm run build` will fail at this point if you have no `.env.local`.** That is expected and it is
the next section. It is worth running `npm run typecheck && npm run lint && npm run test && npm run
arch` first, because those four need no secrets.

---

## 3. Environment, and the rewrite everybody forgets

Production values live in Vercel and nowhere else. Pull them:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && \
  npx vercel env pull .env.local --environment=production \
    --scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"
```

**The scope and the token are both required and they are not the defaults.** The app lives on team
`zsco` (`team_RSlKvg8AqX8hr5WIuKXlNXGE`). The bare `VERCEL_TOKEN` belongs to a different team and
reaches the decisions site instead. `32-DEPLOYMENT-AND-OPS.md` carries the full split.

### 3.1 Then rewrite `AUTH_URL`, immediately

```bash
sed -i '' 's|^AUTH_URL=.*|AUTH_URL="http://localhost:3000"|' .env.local
```

**What happens if you skip it.** `AUTH_URL` came down holding the production origin. Auth.js builds
the OAuth callback from it. You click sign in on `localhost:3000`, GitHub sends you to
**production**, and you land signed in to the live app with no idea why local still shows a login
screen. Nothing errors. That is what makes it expensive.

**The `''` after `-i` is macOS BSD `sed`, not a typo.** GNU `sed` takes `-i` alone and this command
is wrong on Linux.

### 3.2 Register the callback before you try to sign in

The local sign-in cannot work until
`http://localhost:3000/api/auth/callback/github` is registered on the **GitHub OAuth App**. Add it
there first. The route it maps to is `src/app/api/auth/[...nextauth]/route.ts`.

**Two more things gate a successful sign-in**, and both are silent when they fail:

- `ALLOWED_GH_LOGIN` must contain your GitHub login. It defaults to `sagnikmitra`
  (`src/config/env.ts:47`). The check runs inside the `signIn` callback, so a wrong login gets a
  clean rejection rather than an error.
- `AUTH_SECRET`, `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` must all be present. Auth.js reads them
  itself at request time.

### 3.3 Or skip sign-in entirely, in development only

```bash
DEV_BYPASS_AUTH=1 npm run dev
```

**It is triple-gated and cannot be turned on remotely** (`src/proxy.ts:31` to `:36`). All three must
hold:

1. `NODE_ENV === "development"`.
2. `DEV_BYPASS_AUTH === "1"`, that exact string.
3. The request host is loopback or a private address: `localhost`, `127.0.0.1`, `::1`, `192.168.`,
   `10.`, or `172.16.` to `172.31.`.

**Never set `DEV_BYPASS_AUTH` in any Vercel environment.** It cannot take effect there, and its
presence in a dashboard invites somebody to try.

### 3.4 One more, if you touch PDF export

```bash
export LOCAL_CHROME_PATH=/path/to/your/chrome
```

Read at `src/app/api/export/pdf/[...path]/route.ts:128`. Without it, local PDF export cannot find a
browser binary. Everything else in the app works fine.

---

## 4. Run the web app

```bash
npm run dev
```

That is `next dev`, on `http://localhost:3000`.

**What you should see.** The home page **is** the login screen when signed out. `/` is marked public
in the proxy on purpose, so `(vault)/layout.tsx` owns the auth decision rather than the proxy
307-ing you to `/login` first (`src/proxy.ts:60` to `:64`).

**Routes that work signed out**, from `isPublicPath()` at `src/proxy.ts:59`:

Path | Why it is public
`/` and `/login` | The sign-in surface
`/privacy`, `/terms`, `/pricing`, `/refunds` | A stranger must read them before signing in. Placeholders until the texts land
`/<slug>` | A published note, one segment, filtered against `RESERVED_SLUGS`
`/p/<slug>` | The legacy published URL, 301 redirected by the handler
`/api/auth/*` | The sign-in round trip
`/decisions` and `/decisions/*` | The decisions site copy served out of `public/`
`/prototype` and `/prototype/*` | Static prototype pages
`/opengraph-image` and `/opengraph-image.*` | Crawlers and image consumers

**API routes are never redirected.** They self-gate and return a JSON 401, because a redirect would
hand a `fetch()` call HTML where it expected an error.

---

## 5. Run the desktop shell, and understand what it shows you

```bash
npm run tauri:dev
```

**Read this before you run it, because the result is confusing otherwise.**

`src-tauri/tauri.conf.json` sets `"devUrl": "https://md.sgnk.ai"` and
`"frontendDist": "https://md.sgnk.ai"`, with an empty `beforeDevCommand` and an empty
`beforeBuildCommand`. So:

- **The desktop shell loads a remote site. It does not build or serve this repository.**
- `npm run dev` running on port 3000 is **not** what the window shows.
- The window title and the product name are `sgnk-md`, the bundle identifier is `ai.sgnk.md`, and
  the version is `0.1.0`.

**That is the shipped state, not a bug**, and `AGENTS.md` section 8 explains why the identifier
stays: renaming it orphans a user's local state. But **the desktop build is currently a shell over
the previous product's domain**, and the plan moves it onto the new stack in phase F
(`docs/mvp0/PRODUCT-PLAN.md:1670`).

**To point it at your local app**, change `devUrl` to `http://localhost:3000` in
`src-tauri/tauri.conf.json` and run `npm run dev` in a second terminal. **Do not commit that
change.**

**The build targets**, all four from `package.json`:

Script | Target
`npm run tauri:build` | The host platform
`npm run tauri:build:mac-arm` | `aarch64-apple-darwin`
`npm run tauri:build:mac-intel` | `x86_64-apple-darwin`
`npm run tauri:build:mac-universal` | `universal-apple-darwin`

**Signing is not configured.** `src-tauri/tauri.conf.json` has `"signingIdentity": null`,
`"providerShortName": null` and `"entitlements": null`. Bundle targets are `dmg` and `app`, and the
minimum macOS is `11.0`. The Apple Developer Program is "not opened" per
`docs/mvp0/PRODUCT-PLAN.md:1625`, so a locally built `.dmg` is unsigned and Gatekeeper will say so.

**The capability surface is deliberately small.** `src-tauri/capabilities/default.json` grants
`core`, `event`, `window`, `webview`, `shell`, `os`, `process`, `dialog`, and clipboard read and
write. Nothing else. Adding a permission there is a security change, not a convenience.

---

## 6. The traps, in the order they bite

### 6.1 Vercel is stricter than your local typecheck

The production `tsconfig.json` has `strict`, `noUncheckedIndexedAccess` **and**
`exactOptionalPropertyTypes`. `npm run typecheck` can pass while the Vercel build fails.

**The rule.** An optional property that can be explicitly `undefined` is declared
`?: T | undefined`, not bare `?: T`. Under `exactOptionalPropertyTypes` the bare form rejects
`undefined` as a passed value.

**`npm run build` locally catches these**, which is why it is inside `verify`. Run `verify`, not
`typecheck`, before a push.

### 6.2 A new file in `public/` that 307s to `/login`

Drop `og.png` into `public/` and it works. Drop `styles.css` and it redirects to the login page.

**The rule** is one regex at `src/proxy.ts:15`. Allowed extensions today:

```
svg png jpg jpeg gif ico webp avif webmanifest xml txt json js map
```

**Fourteen extensions, one top-level segment.** Neither `.css` nor `.html` is in the list, and a
nested path does not match. That is why `/decisions/` and `/prototype/` are named explicitly in
`isPublicPath()`.

**Verify every new public asset:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/<asset>
```

**200 is correct. 307 means the proxy is redirecting and you broke the rule.**

**If you need an extension that is not in the list, edit both `PUBLIC_STATIC_RE` and the matcher
regex in `config` at `src/proxy.ts:153` in the same commit.** They mirror each other and a
one-sided edit is worse than no edit, because the middleware stops running while the allowlist
still claims the path is public.

### 6.3 Tests mock the deep path, not the barrel

The suite mocks `@/modules/vault/presentation/use-snapshot`, not `@/modules/vault`. **Keep that
indirection module in place when refactoring barrels**, or the mocks silently stop applying.

`vitest.config.ts` excludes `**/.claude/**`, and the comment records why: two abandoned agent
worktrees under `.claude/` were being collected and inflated the suite by 66.4 percent with
duplicate runs of a pre-work commit.

### 6.4 Cross-module imports go through the barrel

`@/modules/<name>`, never `@/modules/<name>/presentation/foo`. **Not even for types.** Add new
exports to the barrel. `npm run arch` and `eslint-plugin-boundaries` both check this.

Three folders are banned outright: `src/server/`, `src/lib/`, `src/components/`. So are imports from
`@/server/*`, `@/lib/*` and `@/components/*`.

### 6.5 Zustand selectors must be stable

Never return a new object, array or `Set` from a selector. Zustand v5 compares by `Object.is`, and
an inline `new Set(...)` triggers an infinite render loop. Derive sets in `useMemo` during render.

---

## 7. What is configured but has no script

**The Firebase emulators.** `firebase.json` declares them: auth on port `9099`, Firestore on `8080`,
with the emulator UI enabled. **No npm script starts them, and the Firebase CLI is not a
dependency.** `UNVERIFIED:` whether anybody has run them against this repository.

To use them you need the Firebase CLI installed separately, then `firebase emulators:start` from the
repository root. **That is not part of any documented flow yet**, and `firestore.rules` is still
marked `PROTOTYPE` in its own header, "not yet exercised against the emulator or a live client".

**The authorised domains** in `firebase.json` are `localhost`, `frontmatter-md.firebaseapp.com`,
`frontmatter-md.web.app`, `frontmatter.in`, `www.frontmatter.in` and `frontmatter.vercel.app`.
Google sign-in from any other origin, including a Vercel preview URL, will be rejected by Firebase.
See `39-SHARING-A-BUILD.md`.

---

## 8. Every script, so nothing sends you to `package.json`

Twenty-six, listed with
`node -e 'const p=require("./package.json"); for(const [k,v] of Object.entries(p.scripts)) console.log(k+" :: "+v)'` `[O]`.

Script | Command | When you want it
`dev` | `next dev` | Daily
`build` | `next build` | Before a push, inside `verify`
`start` | `next start` | Serving a production build locally
`typecheck` | `tsc --noEmit` | Fast feedback; **not sufficient alone**
`lint` | `eslint . --max-warnings=0` | Before a push
`test` | `vitest run` | Before a push
`test:watch` | `vitest` | While writing a test
`format` | `prettier --write .` | Before a large diff
`format:check` | `prettier --check .` | In review
`arch` | `node specs/harness/clean-architecture-report.mjs` | After moving a file between layers
`verify` | the six-gate chain above | **Before any commit**
`budget` | `echo 'No bundle budget configured yet - skipping'` | Never. It is a placeholder
`spec` | `node specs/harness/spec-report.mjs` | The contract gate
`corpus` | `node scripts/corpus-foreign.mjs verify` | After any engine change
`tauri` | `tauri` | Raw passthrough
`tauri:dev` | `tauri dev` | The desktop shell, section 5
`tauri:build` | `tauri build` | A local bundle
`tauri:build:mac-arm` | `tauri build --target aarch64-apple-darwin` | Apple silicon
`tauri:build:mac-intel` | `tauri build --target x86_64-apple-darwin` | Intel
`tauri:build:mac-universal` | `tauri build --target universal-apple-darwin` | Both
`tree` | `node docs/build/build-tree.mjs` | Rebuild the derived Tier-1 documents
`doc` | `node docs/build/assemble-tree.mjs docs/FRONTMATTER-RECORD.md` | Assemble the whole record
`pdf` | `node docs/build/build-final.mjs` | The printable record
`refs` | `node docs/build/check-refs.mjs` | Citation check
`record` | `node docs/build/check-record.mjs` | Record check
`decide` | `node docs/build/build-prd-pdf.mjs docs/DECIDE.md ...` | The decision document

**`npm run budget` is an echo.** It is recorded as a known gap in `docs/PRODUCT-BRIEF.md` section 9,
and the plan puts a real 250 KB first-load budget behind it
(`docs/mvp0/PRODUCT-PLAN.md:1524`). **Do not treat a passing `budget` as a passing budget.**

**`mdmax cert` is not among the twenty-six**, despite appearing in older documents. The script that
exists is `scripts/mdmax-cert.mjs`, run directly with `node`.

---

## 9. The shortest path that actually works

For an agent that wants the list without the reasoning:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && \
  GH_TOKEN="$GH_TOKEN_ZEPHYRUS" gh repo clone studiozephyrus/frontmatter
cd frontmatter
npm install
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && \
  npx vercel env pull .env.local --environment=production \
    --scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"
sed -i '' 's|^AUTH_URL=.*|AUTH_URL="http://localhost:3000"|' .env.local
npm run verify
DEV_BYPASS_AUTH=1 npm run dev
```

**The bypass on the last line is the fastest way in.** Use the real sign-in only when you are
testing sign-in, and register the callback first.

---

## 10. Limits of this file

**What was not assessed.**

- The Linux and Windows paths. Every command here is macOS, and section 3.1 is BSD `sed`.
- Whether `npm install` completes cleanly from an empty cache. The tree was already installed.
- The Firebase emulator flow, section 7. Nothing in the repository drives it.
- `npm run corpus`, `npm run spec` and `npm run verify` were **not run** in the session that wrote
  this file. Only `npm run arch` was, and it printed `"total": 0` over 214 files.

**What could not be verified.**

- That the GitHub OAuth App currently has `http://localhost:3000/api/auth/callback/github`
  registered. That is a dashboard fact and needs a login.
- Whether `.env.local` exists on any given machine, or what it holds. The sandbox denies reads of
  every `.env` file, correctly.
- The exact Rust version the Tauri build requires. Nothing pins one.

**What is not established.**

- Whether the desktop shell pointing at `md.sgnk.ai` is intended to stay until phase F or is simply
  stale. The plan says phase F; the config says nothing.

**What would falsify this file.**

- A fresh clone and run on a clean machine hitting a wall that is not in section 6.
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/<a new public asset>` returning 307
  for an extension that **is** in the fourteen.
- `npm run tauri:dev` opening a window showing `localhost:3000` without an edit to
  `src-tauri/tauri.conf.json`.
