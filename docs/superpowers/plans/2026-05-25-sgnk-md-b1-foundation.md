# sgnk-md Batch 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the hexagonal Next.js skeleton for sgnk-md with all architecture gates green, the spine (typed env, security proxy, composition root, shared kernel), Tailwind theming, an sgnk-md app shell replacing the GVC hello-world, and the `md.sgnk.ai` deployment configured so vault-only commits don't redeploy.

**Architecture:** Hexagonal modular monolith per `sgnk-next` (domain ← application ← infrastructure; presentation; container; thin `app`). Greenfield path: scaffold the tree, apply turnkey gates/assets, write the spine, keep the gate green from the first commit.

**Tech Stack:** Next.js (App Router, existing), TypeScript (strict), Vitest, ESLint + eslint-plugin-boundaries, Tailwind CSS, Zod. Reference scaffold/assets: `/Users/sagnikmitra/.claude/skills/sgnk-next`.

**Conventions for every commit in this batch:** no `any`; no silent failures; `process.env` only in `src/config` + `*/infrastructure`; gate green before moving on.

---

### Task 1: Branch, install, confirm Next version

**Files:**
- Modify: (none — environment setup)

- [ ] **Step 1: Create a feature branch**

```bash
cd /Users/sagnikmitra/Desktop/GitHub/md
git checkout -b feat/sgnk-md-b1-foundation
```

- [ ] **Step 2: Install existing deps**

Run: `npm install`
Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Record the installed Next version and read its docs**

Run: `node -e "console.log('next', require('next/package.json').version)"`
Then list: `ls node_modules/next/dist/docs 2>/dev/null || echo "no bundled docs"`
Expected: prints a version (e.g. `next 15.x`/`16.x`). **Read any `proxy.ts` vs `middleware.ts` and caching notes before writing `proxy.ts`/`next.config.ts` later** — APIs differ by version.

- [ ] **Step 4: Commit the lockfile**

```bash
git add package-lock.json
git commit -m "chore(sgnk-md): install deps, pin lockfile for batch 1"
```

---

### Task 2: Scaffold the hexagonal skeleton

**Files:**
- Create: `src/modules/`, `src/shared/`, `src/container/`, `src/config/`, `specs/harness/`, `docs/adr/` (via scaffold script)

- [ ] **Step 1: Run the sgnk-next scaffold**

Run: `node /Users/sagnikmitra/.claude/skills/sgnk-next/scripts/scaffold.mjs`
Expected: creates the canonical tree (`src/modules`, `src/shared/{domain,application,infrastructure,presentation}`, `src/container`, `src/config`), per-layer READMEs, and copies the gate scripts into `specs/harness/`.

- [ ] **Step 2: Verify the gate scripts landed**

Run: `ls specs/harness/`
Expected: `clean-architecture-report.mjs`, `import-boundary-report.mjs`, `server-folder-blocklist.mjs`, `route-inventory.mjs` (names per sgnk-next `scripts/`).

- [ ] **Step 3: Run the clean-architecture gate on the empty skeleton**

Run: `node specs/harness/clean-architecture-report.mjs`
Expected: total violations `0` (clean skeleton).

- [ ] **Step 4: Commit**

```bash
git add src specs docs
git commit -m "chore(sgnk-md): scaffold hexagonal skeleton + gate scripts"
```

---

### Task 3: Apply turnkey assets (scripts, strict TS, CI, eslint boundaries)

**Files:**
- Modify: `package.json`, `tsconfig.json`
- Create: `.github/workflows/ci.yml`, `.nvmrc`, `eslint.config.mjs`, `docs/adr/0001-adopt-hexagonal-architecture.md`

- [ ] **Step 1: Merge package scripts**

Open `/Users/sagnikmitra/.claude/skills/sgnk-next/assets/package-scripts.json` and merge its `scripts` and `engines` blocks into `package.json`. Ensure these scripts exist:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings=0",
    "test": "vitest run",
    "arch": "node specs/harness/clean-architecture-report.mjs",
    "verify": "npm run typecheck && npm run lint && npm run test && npm run build && npm run arch"
  },
  "engines": { "node": ">=24" }
}
```

- [ ] **Step 2: Apply strict TS options**

Merge `/Users/sagnikmitra/.claude/skills/sgnk-next/assets/tsconfig.strict.json` `compilerOptions` into `tsconfig.json` (adds `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, etc.). Keep existing `paths` and `plugins`.

- [ ] **Step 3: Copy CI, ADR template, .nvmrc**

```bash
mkdir -p .github/workflows docs/adr
cp /Users/sagnikmitra/.claude/skills/sgnk-next/assets/ci.yml .github/workflows/ci.yml
cp /Users/sagnikmitra/.claude/skills/sgnk-next/assets/adr-template.md docs/adr/0001-adopt-hexagonal-architecture.md
printf '24\n' > .nvmrc
```
Then fill `docs/adr/0001-adopt-hexagonal-architecture.md` recording: decision = hexagonal modular monolith for sgnk-md, context = spec, consequences = gates in CI.

- [ ] **Step 4: Install dev tooling + ESLint boundaries**

```bash
npm i -D vitest eslint eslint-plugin-boundaries @eslint/js typescript-eslint prettier
```
Create `eslint.config.mjs` spreading the sgnk-next boundaries config (layer rules start at `warn` for B1):

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";
// Spread from: /Users/sagnikmitra/.claude/skills/sgnk-next/scripts/eslint-boundaries.config.mjs
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // ...boundaries element-types + rules (copy from the sgnk-next config; severity "warn")
);
```

- [ ] **Step 5: Add `.DS_Store` and Next/IDE noise to gitignore if missing**

Ensure `.gitignore` contains `node_modules`, `.next`, `out`, `.env*`, `.DS_Store`, `coverage`, `*.tsbuildinfo`. (Most already present — add the missing ones.)

- [ ] **Step 6: Gate**

Run: `npm run typecheck && npm run lint`
Expected: typecheck passes; lint passes (warnings allowed at this stage, no errors).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json eslint.config.mjs .nvmrc .gitignore .github docs/adr
git commit -m "chore(sgnk-md): turnkey scripts, strict TS, CI, eslint boundaries"
```

---

### Task 4: Shared kernel — `Result` type (TDD)

**Files:**
- Create: `src/shared/domain/result.ts`
- Test: `test/shared/result.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// test/shared/result.test.ts
import { describe, it, expect } from "vitest";
import { ok, err, isOk, isErr } from "@/shared/domain/result";

describe("Result", () => {
  it("ok wraps a value", () => {
    const r = ok(42);
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value).toBe(42);
  });
  it("err wraps an error", () => {
    const r = err("boom");
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBe("boom");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/shared/result.test.ts`
Expected: FAIL — module `@/shared/domain/result` not found.

- [ ] **Step 3: Implement the Result type**

```ts
// src/shared/domain/result.ts
export type Ok<T> = { readonly kind: "ok"; readonly value: T };
export type Err<E> = { readonly kind: "err"; readonly error: E };
export type Result<T, E = Error> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ kind: "ok", value });
export const err = <E>(error: E): Err<E> => ({ kind: "err", error });
export const isOk = <T, E>(r: Result<T, E>): r is Ok<T> => r.kind === "ok";
export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => r.kind === "err";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/shared/result.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/shared/domain/result.ts test/shared/result.test.ts
git commit -m "feat(sgnk-md): shared Result type"
```

---

### Task 5: Typed environment config (TDD)

**Files:**
- Create: `src/config/env.ts`
- Test: `test/config/env.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// test/config/env.test.ts
import { describe, it, expect } from "vitest";
import { parseEnv } from "@/config/env";

describe("parseEnv", () => {
  it("accepts a valid APP_URL", () => {
    const env = parseEnv({ APP_URL: "https://md.sgnk.ai" });
    expect(env.APP_URL).toBe("https://md.sgnk.ai");
  });
  it("throws on a missing/invalid APP_URL", () => {
    expect(() => parseEnv({ APP_URL: "not-a-url" })).toThrow();
    expect(() => parseEnv({})).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/config/env.test.ts`
Expected: FAIL — `@/config/env` not found.

- [ ] **Step 3: Install Zod and implement env parsing**

```bash
npm i zod
```

```ts
// src/config/env.ts
import { z } from "zod";

const schema = z.object({
  APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof schema>;

/** Pure parser — tested in isolation. Throws (fails loud) on invalid env. */
export function parseEnv(raw: NodeJS.ProcessEnv | Record<string, string | undefined>): Env {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid environment: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  }
  return result.data;
}

/** The validated env singleton for the running server. */
export const env: Env = parseEnv(process.env);
```

> Note: set `APP_URL=https://md.sgnk.ai` in `.env.local` (and Vercel env) so the singleton resolves at runtime. Tests use `parseEnv` directly and never touch `process.env`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/config/env.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Create `.env.local` and `.env.example`**

```bash
printf 'APP_URL=https://md.sgnk.ai\n' > .env.local
printf 'APP_URL=https://md.sgnk.ai\n' > .env.example
```
(`.env.local` is gitignored; commit only `.env.example`.)

- [ ] **Step 6: Commit**

```bash
git add src/config/env.ts test/config/env.test.ts package.json package-lock.json .env.example
git commit -m "feat(sgnk-md): typed, fail-loud env config"
```

---

### Task 6: Composition root + security proxy + next config

**Files:**
- Create: `src/container/dependency-container.ts`, `src/proxy.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Empty composition root to grow into**

```ts
// src/container/dependency-container.ts
// THE app-facing composition root. The only wiring module app/presentation may import.
// Grows in later batches (auth resolver, vault reader, repository writer).
export const container = {} as const;
export type Container = typeof container;
```

- [ ] **Step 2: Security proxy (no auth yet — added in B2)**

> First confirm `proxy.ts` vs `middleware.ts` for the installed Next version (Task 1, Step 3). If this version uses `middleware.ts`, name the file `src/middleware.ts` with the same body.

```ts
// src/proxy.ts  (or src/middleware.ts depending on Next version)
import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // CSP is added Report-Only in a later batch once asset origins are known.
  return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
```

- [ ] **Step 3: next.config.ts — keep behavior, set image/runtime baseline**

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // cacheComponents / 'use cache' decision deferred to SCALE; off for now.
};

export default nextConfig;
```

- [ ] **Step 4: Gate**

Run: `npm run typecheck && npm run build`
Expected: build succeeds; security headers present (spot-check later in browser).

- [ ] **Step 5: Commit**

```bash
git add src/container/dependency-container.ts src/proxy.ts next.config.ts
git commit -m "feat(sgnk-md): composition root, security proxy, next config baseline"
```

---

### Task 7: Tailwind + theme tokens

**Files:**
- Create: `postcss.config.mjs`, `tailwind.config.ts`, `src/shared/presentation/theme.css`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Install Tailwind**

```bash
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p   # creates tailwind.config + postcss.config
```

- [ ] **Step 2: Configure content globs**

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/modules/**/*.{ts,tsx}", "./src/shared/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 3: Theme tokens + Tailwind layers in globals.css**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #f7f4ee; --fg: #161616; --muted: #6b6b6b;
  --accent: #6c5ce7; --border: #e3ddd2; --panel: #ffffff;
}
.dark {
  --bg: #1a1a1a; --fg: #e8e6e1; --muted: #9a9a9a;
  --accent: #8b7cf0; --border: #2c2c2c; --panel: #222222;
}
html, body { margin: 0; background: var(--bg); color: var(--fg); }
* { box-sizing: border-box; }
```

- [ ] **Step 4: Gate**

Run: `npm run build`
Expected: build succeeds with Tailwind processed.

- [ ] **Step 5: Commit**

```bash
git add postcss.config.mjs tailwind.config.ts src/app/globals.css src/shared/presentation/theme.css package.json package-lock.json
git commit -m "feat(sgnk-md): tailwind + theme tokens (light/dark)"
```

---

### Task 8: sgnk-md app shell (replace hello-world)

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `src/modules/app-shell/presentation/AppShell.tsx`, `src/modules/app-shell/index.ts`

- [ ] **Step 1: App shell component (static placeholder panes)**

```tsx
// src/modules/app-shell/presentation/AppShell.tsx
export function AppShell() {
  return (
    <div className="grid h-screen grid-cols-[260px_1fr_300px]">
      <aside className="border-r p-3" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
        <div className="text-sm font-semibold">sgnk-md</div>
        <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>File tree — Batch 3</div>
      </aside>
      <main className="overflow-auto p-6">
        <h1 className="text-xl font-semibold">sgnk-md</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Editor mounts in Batch 4. Foundation is live.
        </p>
      </main>
      <aside className="border-l p-3" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
        <div className="text-xs" style={{ color: "var(--muted)" }}>Backlinks / outline — Batch 5</div>
      </aside>
    </div>
  );
}
```

```ts
// src/modules/app-shell/index.ts
export { AppShell } from "./presentation/AppShell";
```

- [ ] **Step 2: Layout metadata → sgnk-md**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sgnk-md",
  description: "Your Obsidian on the web — synced to GitHub.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Page renders the shell**

```tsx
// src/app/page.tsx
import { AppShell } from "@/modules/app-shell";

export default function Home() {
  return <AppShell />;
}
```

- [ ] **Step 4: Manual run + visual check**

Run: `npm run dev` then open `http://localhost:3000`
Expected: three-pane sgnk-md shell renders (no hello-world checks list). Confirm light theme tokens apply.

- [ ] **Step 5: Full gate**

Run: `npm run verify`
Expected: typecheck + lint + test + build + arch all green (`arch` total `0`).

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx src/modules/app-shell
git commit -m "feat(sgnk-md): app shell replaces hello-world"
```

---

### Task 9: Deploy config — domain + ignored build step

> This task touches Vercel/Cloudflare (shared infra). Source tokens per the repo convention; **confirm with the owner before running deploy/domain commands.** Never print token values.

**Files:**
- Create: `vercel.ts` (ignored build step + project config)

- [ ] **Step 1: Add ignored-build-step so vault-only commits don't redeploy**

Create a build-ignore command that skips the build when no app paths changed. Using `vercel.ts` (recommended over `vercel.json`):

```ts
// vercel.ts
import type { VercelConfig } from "@vercel/config/v1";

// Build only when app code changes; skip for vault-only (*.md / .obsidian / docs) commits.
export const config: VercelConfig = {
  framework: "nextjs",
  ignoreCommand:
    "git diff --quiet HEAD^ HEAD -- src package.json package-lock.json next.config.ts tsconfig.json tailwind.config.ts eslint.config.mjs vercel.ts; test $? -eq 0 && exit 0 || exit 1",
};
```
Install config types: `npm i -D @vercel/config`.

> Semantics: `ignoreCommand` exit 0 = **skip build**, exit 1 = **build**. The `git diff --quiet` is true (exit 0) when app paths are unchanged → skip.

- [ ] **Step 2: Push the branch and open a PR (owner confirms merge)**

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && gh auth setup-git
git push -u origin feat/sgnk-md-b1-foundation
gh pr create --title "sgnk-md Batch 1 — foundation" --body "Hexagonal scaffold, gates, spine, Tailwind, app shell, deploy config."
```

- [ ] **Step 3: Add the `md.sgnk.ai` domain (after merge to main)**

With the owner's confirmation, add the domain to the Vercel `md` project and the Cloudflare CNAME (GVC pattern). Verify the deployed site shows the sgnk-md shell at `https://md.sgnk.ai`.

- [ ] **Step 4: Verify ignored-build-step**

Make a trivial vault-only commit (e.g. edit a note) on main and confirm Vercel **skips** the build; make an app commit and confirm it **builds**.

---

## Self-Review

**Spec coverage (B1 scope = spec §4, §17, §18):**
- Hexagonal scaffold + gates → Tasks 2, 3. ✅
- Spine (env, proxy, container, shared kernel) → Tasks 4, 5, 6. ✅
- Tailwind/theming → Task 7. ✅
- sgnk-md shell replaces hello-world → Task 8. ✅
- `md.sgnk.ai` + ignored-build-step → Task 9. ✅
- Least-privilege auth, vault read, drafts, commit, graph, search, export → **out of B1 scope**, covered by B2–B8 (roadmap). ✅

**Placeholder scan:** No TBD/TODO; every code step shows real code; commands have expected output. ✅

**Type consistency:** `Result`/`ok`/`err`/`isOk`/`isErr` (Task 4) consistent; `parseEnv`/`Env`/`env` (Task 5) consistent; `AppShell` exported via `app-shell/index.ts` and imported in `page.tsx` (Task 8) consistent; `container` (Task 6) matches roadmap. ✅

**Notes / assumptions to confirm at execution:**
- Exact contents of sgnk-next `assets/package-scripts.json`, `tsconfig.strict.json`, `eslint-boundaries.config.mjs`, and `scaffold.mjs` output are applied as-is; if a script name differs, adjust the gate commands to match what `scaffold.mjs` actually copies into `specs/harness/`.
- `proxy.ts` vs `middleware.ts` is version-dependent (Task 1 Step 3 decides).
- `@vercel/config` `ignoreCommand` field name verified against installed version before relying on it; fallback is the Vercel dashboard "Ignored Build Step" git-diff command.

---

## Definition of done (Batch 1)

`npm run verify` green; sgnk-md shell live locally and (post-merge) at `md.sgnk.ai`; ignored-build-step proven (vault-only commit skips build); branch merged. Ready for **B2 — Auth**.
