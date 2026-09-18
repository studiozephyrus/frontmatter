---
id: 23-WEB-APP-SPEC
title: Web app specification
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 6271499
covers: [web-app, page-routes, layouts, state, traps]
---

# 23. Web app specification

The Next.js App Router surface: which routes exist, which layout wraps each one, who owns which
piece of state, and the five traps that have already cost this repository time.

**Read section 23.5 before you touch the editor or `public/`.** Every trap there is a real defect
that shipped once, and each one is recorded in `AGENTS.md` because it came back.

## 23.1 The route groups

Three groups, each a folder in brackets that does not appear in the URL.

Group | Layout | Who may reach it | What it is for
`(auth)` | `src/app/(auth)/layout.tsx` | anyone | The dedicated `/login` route.
`(public)` | `src/app/(public)/layout.tsx` | anyone, no session | Published pages and the legal and commercial pages.
`(vault)` | `src/app/(vault)/layout.tsx` | a signed-in person | The editor and everything inside it.

Above all three sits `src/app/layout.tsx`, the root layout, plus `error.tsx`, `global-error.tsx`,
`loading.tsx` and `not-found.tsx`.

**`(vault)/layout.tsx` is the real auth guard.** The edge proxy in `src/proxy.ts` only makes an
optimistic redirect for page navigations. The layout calls `getActor()` and renders `<LoginScreen />`
in place of the editor when there is no session, rather than redirecting.

That is deliberate, and `src/proxy.ts:64` says why: marking `/` public stops the proxy 307-ing to
`/login` first and lets the layout own the decision. It is also what makes the front door one tap,
which is the founder's standing rule.

## 23.2 Every page route

`[O]` `node specs/harness/route-inventory.mjs` at `6271499`.

Route | File | Group | Caching directives | Notes
`/` | `src/app/(vault)/page.tsx` | `(vault)` | none | The editor. Renders the login screen when there is no session.
`/login` | `src/app/(auth)/login/page.tsx` | `(auth)` | none | Still resolves, for sign-out redirects and bookmarks.
`/[slug]` | `src/app/(public)/[slug]/page.tsx` | `(public)` | `revalidate = 60`, `dynamicParams = true` | The public note. 404 when the slug is unknown or claimed twice.
`/p/[slug]` | `src/app/(public)/p/[slug]/page.tsx` | `(public)` | `revalidate = false`, `dynamicParams = true` | A 301 to `/[slug]`. Keeps every previously shared link working.
`/pricing` | `src/app/(public)/pricing/page.tsx` | `(public)` | none | Placeholder until the text is written.
`/privacy` | `src/app/(public)/privacy/page.tsx` | `(public)` | none | Placeholder.
`/terms` | `src/app/(public)/terms/page.tsx` | `(public)` | none | Placeholder.
`/refunds` | `src/app/(public)/refunds/page.tsx` | `(public)` | none | Placeholder.

The four placeholders are due by 15 October 2026 and are listed with their owners in
`docs/mvp0/PRODUCT-PLAN.md:1601`.

The 26 API routes are in `22-API-REFERENCE.md`, which is generated and must not be hand-edited.

## 23.3 Which module renders what

Every page is thin. The screen lives in a module's presentation layer, and the route file composes
it.

Surface | Module | Entry component
The application chrome | `app-shell` | `AppShell.tsx`, `VaultWorkspace.tsx`.
The writing surface | `editor` | `EditorPane.tsx`, `CodeMirrorEditor.tsx`, `Toolbar.tsx`.
The rendered projection | `preview` | 21 files, including `Outline.tsx`.
The public page | `share` | `PublicNoteView.tsx`.
Sign-in | `auth` | `LoginScreen`, exported from the barrel.
The commit bar | `repository` | `CommitBar`, exported from the barrel.
The link graph | `graph` | 3 files.
Export controls | `export` | 5 files.
AI controls | `ai-tools` | 2 files.

## 23.4 Where state lives

There are four kinds of state, and mixing them is the cause of most of section 23.5.

Kind | Where | Survives a reload | Survives a new device
Server state | The route handler, read fresh | no | yes, it is on the server
Store state | Zustand, in the browser | only if a store persists it | no
Component state | `useState` in a component | no | no
Draft state | IndexedDB and `localStorage` | yes | no

`[O]` The Zustand stores at `6271499`, found with
`grep -rln "zustand" src/`:

Store | File | Persisted as | Storage | Owns
`useEditorStore` | `src/modules/editor/presentation/editor-store.ts` | `sgnk-md-editor` (line 226) | `sessionStorage` | Open tabs, the active path, `contentByPath`, `baseShaByPath`, dirty flags.
bookmarks | `src/modules/editor/presentation/bookmarks.ts` | `sgnk-md-bookmarks` (line 31) | `localStorage` | Bookmarked paths.
editor settings | `src/modules/editor/presentation/editor-settings.ts` | `sgnk-md-editor-settings` (line 46) | `localStorage` | Editor preferences.
ghost text | `src/modules/editor/presentation/ghost-text.ts` | not persisted | memory | Inline completion state.
AI suggestion | `src/modules/editor/presentation/ai-suggestion.ts` | not persisted | memory | The pending AI proposal.

**Those three persistence keys keep the legacy `sgnk-md` prefix and may not be renamed.** Renaming
one silently orphans a person's local settings (`AGENTS.md:183`). The full list, with the IndexedDB
store and the dirty index, is in `21-DATA-MODEL.md` section 21.9.

**The one rule that keeps this honest.** The file on disk is the record. Every store above is a
cache of it or a preference about it, never a second copy of the truth. A store that starts holding
something no file can reproduce has broken the projection law.

## 23.5 The five traps

Each one has already happened here. Each has four parts: what goes wrong, why, the rule, and how to
check.

### Trap 1. A Zustand selector that builds a new object

**What goes wrong.** The page renders in an infinite loop and the tab locks up. It is not a slow
render. It never stops.

**Why.** Zustand v5 compares the selector's result with `Object.is`. A selector that returns
`new Set(...)`, `{...}` or `[...]` returns a fresh reference on every call, so the comparison is
always false, so the component re-renders, so the selector runs again.

**The rule** (`AGENTS.md:195`). **Never return a new object, array or Set from a selector.** Select
the primitives the component needs, and derive the collection with `useMemo` in the render body.

```ts
// Wrong. New Set on every call, so Object.is is always false.
const dirty = useEditorStore((s) => new Set(s.tabs.filter((t) => t.dirty).map((t) => t.path)));

// Right. Select the array reference, derive in render.
const tabs = useEditorStore((s) => s.tabs);
const dirty = useMemo(() => new Set(tabs.filter((t) => t.dirty).map((t) => t.path)), [tabs]);
```

**How to check.** `grep -rn "useEditorStore((" src/ --include='*.tsx'` and read every selector body.
A `new `, a `{` or a `[` after the arrow is the bug. At `6271499` the one `new Set(...)` in the
editor store is inside `reconcileDirtyFlags` at `src/modules/editor/presentation/editor-store.ts:208`,
which is an action and not a selector, so it is correct.

**Note for a future reader.** `useShallow` from `zustand/react/shallow` is the library's own answer
to this, and `grep -rn "useShallow" src/` returns nothing at this commit. Introducing it is a
reasonable change. Removing the `useMemo` discipline without introducing it is not.

### Trap 2. The editor tab race

**What goes wrong.** Switch quickly from note A to note B, and B's editor shows A's content. Worse,
the stale content is written into `contentByPath[B]`, so the wrong bytes are now the draft for B.

**Why.** `useNoteContent(path)` fetches asynchronously. React has already re-rendered with `path`
set to B while the state in the hook still holds A's finished load.

**The rule** (`AGENTS.md:198`). The hook **records the path each state was loaded for**, and
`toResult` returns `loading` when the recorded path does not match the current one.

`src/modules/editor/presentation/use-note-content.ts:28` is the guard. Its own comment says that
without the gate, a fast switch would briefly return A's content, and that the stale closure bound
preview, outline, backlinks and the seed-content effect to the wrong note.

Both the `error` and the `ready` branches check `s.path !== currentPath` and report `loading`
instead. There are two consumers, `src/modules/editor/presentation/EditorPane.tsx:417` and `src/modules/editor/presentation/EditorPane.tsx:680`.

**How to check.** `sed -n '20,50p' src/modules/editor/presentation/use-note-content.ts` and confirm
both branches still compare the path. A refactor that removes the `path` field from
`NoteContentState` has removed the fix.

**Red proof, and this one matters.** The race needs a fetch to land after a tab switch, so an
ordinary click test passes with the guard removed. Prove the test fails against the unguarded code
before trusting it. `AGENTS.md:10` is the general form of this rule.

### Trap 3. `force-dynamic` and `revalidate` together

**What goes wrong.** The page is not cached when you meant it to be, or Next refuses the
combination. `force-dynamic` says render on every request. `revalidate` says cache and regenerate
after N seconds. They contradict each other.

**The rule** (`AGENTS.md:201`). **Pick one.**

**What the code actually does**, and it does not match what `AGENTS.md` says:

Route | Directives at `6271499`
`/[slug]` | `revalidate = 60`, `dynamicParams = true`
`/p/[slug]` | `revalidate = false`, `dynamicParams = true`, and the body is a `permanentRedirect`

`AGENTS.md:202` says "`/p/[slug]` is ISR-cached (`revalidate = 60`, `dynamicParams = true`)". **That
sentence is stale.** The public note moved off the `/p/` prefix to the root, `/p/[slug]` became a 301
to `/[slug]`, and the ISR settings went with the content. The rule is right and the example names
the wrong route.

The comment at `src/app/(public)/[slug]/page.tsx:15` is the history: `force-dynamic` was previously
set on that route, conflicted with `revalidate`, and was dropped so the CDN could cache.

**How to check.**

```bash
grep -rn "force-dynamic" src/app --include='page.tsx'   # expect no output
grep -rn "export const revalidate\|export const dynamic" src/app --include='page.tsx'
```

A page file that shows both is the bug. `force-dynamic` on a **route handler** is a different thing
and is correct: 24 of the 26 API routes set it.

### Trap 4. A server-only dependency in a client bundle

**What goes wrong.** Either the client bundle grows by a browser engine, or the PDF export fails in
production with the chromium binary missing from the lambda while it worked locally.

**Why.** `react-dom/server`, `puppeteer-core` and `@sparticuz/chromium` are server-only.
`@sparticuz/chromium` is worse than server-only: it resolves a brotli-packed binary by runtime path,
which file tracing cannot see, so the bundler ships the JavaScript and leaves the binary behind.

**The rule** (`AGENTS.md:203`). Three things, and all three are needed:

- **Import it dynamically, inside the server route handler.** Not at module top level.
- **List it in `serverExternalPackages`**, so the bundler does not relocate it and strip the native
  binary.
- **List it in `outputFileTracingIncludes`**, so the binary ships with the function.

`next.config.ts` does both of the config halves:

```ts
serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
outputFileTracingIncludes: {
  "/api/export/pdf/**": ["./node_modules/@sparticuz/chromium/**"],
},
```

The comment above the second block records the failure it fixes: a narrow `bin/**` glob with a
bracketed route key did not land the binary, and the runtime error was that the `bin` directory does
not exist. The glob route key plus the whole package is what works.

**How to check.** `grep -rn "puppeteer\|chromium" src/` and confirm every match sits inside
`src/app/api/export/pdf/` and is a dynamic `await import(...)`. Then check both config keys are still
present in `next.config.ts`. The only real proof is a deployed PDF export, because this failure does
not reproduce locally.

### Trap 5. The `PUBLIC_STATIC_RE` allowlist, which lives in two places

**What goes wrong.** You drop a file into `public/`, the browser shows a broken image or a failed
manifest, and the URL 307s to `/login`. `AGENTS.md:53` records this as having burned the team three
or more times.

**Why.** `src/proxy.ts` redirects any path that is not public to `/login`. Static assets are
allowlisted **by extension**, not by name, so a new file is covered automatically only if its
extension is on the list.

The regex at `src/proxy.ts:15`:

```
/^\/[a-z0-9._-]+\.(svg|png|jpg|jpeg|gif|ico|webp|avif|webmanifest|xml|txt|json|js|map)$/i
```

Fourteen extensions, and **one top-level segment only**. Neither `.css` nor `.html` is on the list.

**The rule.** Three parts:

- **Do not add a file name to the proxy.** A new asset with a listed extension is already allowed.
- **If you need a new extension, edit both `PUBLIC_STATIC_RE` and the `matcher` regex in
  `config`, in the same commit.** They mirror each other, and `src/proxy.ts:152` says so in the
  source. Editing one leaves the middleware running on an asset it should skip, or skipping one it
  should gate.
- **A public route that is not `/name.ext` goes in `isPublicPath()` explicitly.** That is why
  `/decisions`, `/decisions/*`, `/prototype`, `/prototype/*` and `/opengraph-image` are listed by
  hand: their assets are nested paths such as `/decisions/app.css`, and the regex matches neither a
  nested path nor `.css`.

**How to check**, from `AGENTS.md:64`:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/<asset>
# 200 is correct. 307 means the proxy is redirecting and you broke the rule.
```

**And check it against the deployment, not only locally.** `CLAUDE.md:104` records that three real
defects in the decisions site were invisible locally. Use `curl -sI`, never `curl -sL`, because a
login page returns 200 after a redirect.

**What is in `public/` today.** `[O]` 14 entries at `6271499`:

Entry | Covered by
`favicon.ico`, `favicon.png`, `mdx-dark.png`, `mdx-light.png`, `sgnkai.png`, `sgnkai-light.png` | the regex, `.ico` and `.png`.
`markdown-bitmap.svg`, `markdown-bitmap.light.svg`, `markdown-bitmap.brand.svg` | the regex, `.svg`.
`llms.txt` | the regex, `.txt`.
`sw.js`, `theme-init.js` | the regex, `.js`.
`decisions/` | an explicit `isPublicPath()` entry, because its assets are nested and include `.css`.
`prototype/` | an explicit `isPublicPath()` entry, for the same reason.

Both directory names are also in `RESERVED_SLUGS`, so a published note cannot shadow them.

## 23.6 The Content Security Policy, and why there are two

This is not a trap, but it surprises people, so it belongs here.

Where | Mode | Why
Every dynamic route, set in `src/proxy.ts` | `Content-Security-Policy-Report-Only` | The authed editor is a single trusted tenant, and CodeMirror plus mermaid need `unsafe-inline` and `unsafe-eval` today.
`/p/:slug*`, set in `next.config.ts` `headers()` | **enforced** | Attacker-authored content shown to anonymous visitors, and no editor there, so no `unsafe-eval` is needed.

`nosniff`, `X-Frame-Options: DENY` and `Referrer-Policy` are set globally in `next.config.ts` so
they cover static assets too, which the proxy matcher skips.

**UNVERIFIED:** the enforced header is written for `/p/:slug*`, and the public note now lives at
`/[slug]`. Whether the tight policy still reaches the page a stranger actually loads was not tested
against a deployment in this session. It is worth one `curl -sI` against production before the
pilot.

## 23.7 How to check any claim in this file

Claim | Command
The route list | `node specs/harness/route-inventory.mjs`
Caching directives on pages | `grep -rn "export const revalidate\|export const dynamic" src/app --include='page.tsx'`
The Zustand stores | `grep -rln "zustand" src/`
The tab-race guard | `sed -n '20,50p' src/modules/editor/presentation/use-note-content.ts`
The proxy allowlist | `sed -n '1,30p' src/proxy.ts` and `sed -n '148,158p' src/proxy.ts`
Public assets | `ls public/`
The chromium config | `grep -n "serverExternalPackages\|outputFileTracingIncludes" next.config.ts`
Everything | `npm run verify`

## 23.8 Limits of this file

- **What was not assessed.** Rendering behaviour, bundle size and any of the performance targets in
  `docs/mvp0/PRODUCT-PLAN.md:1512`. `npm run budget` is still an `echo` with no real budget, which
  `CLAUDE.md:76` records as a known gap.
- **What could not be verified.** Anything that only fails in production: the chromium binary in the
  lambda, and whether the enforced Content Security Policy reaches `/[slug]`. Both are flagged above
  rather than assumed.
- **What is not established.** That the five traps are the only five. They are the five that were
  written down because they recurred. A sixth is likely and belongs here when it is found.
- **What would falsify this file.** A `force-dynamic` appearing in a `page.tsx` beside a
  `revalidate`, a selector returning a fresh collection, or a new `public/` extension added to one
  of the two regexes and not the other.
- **Freshness.** Pinned to `6271499`. Re-derive every count before quoting it.
