---
mode: reference
updated: 2026-09-09
verified_against: e318ab3
---

# Frontend specification

> **Method.** I read `AGENTS.md`, `package.json`, `next.config.ts`, `eslint.config.mjs`,
> `src/proxy.ts`, every file under `src/app/`, every barrel under `src/modules/*/index.ts`,
> and in full: `editor-store.ts`, `use-note-content.ts`, `KnowledgeUI.tsx`, `TauriBridge.tsx`,
> `AppShell.tsx`, `LoginScreen.tsx`, `client-container.ts`, `export-doc.ts`, `pdf-doc.ts`,
> `Icon.tsx`, `draft-store.ts`, and the four route-group layouts. I skimmed `EditorPane.tsx`,
> `VaultWorkspace.tsx`, `FileTree.tsx` and `ExportMenu.tsx` by symbol map plus targeted
> `sed` ranges. Every count in this file came from a command run against working tree
> `e318ab3`; the commands are quoted where the number appears. I ran `npx vitest run`
> (100 files, 1581 passed, 6 expected-fail, 11.76s), `node specs/harness/clean-architecture-report.mjs`
> (208 files scanned, 0 violations), and `npx eslint` on individual files including four
> temporary probe files carrying deliberate layer violations, which I deleted afterwards
> (`git status --porcelain src/` empty). The probe results are in `06-BACKEND-SPEC.md` §4.1.
>
> **What this pass did NOT do.** I did not run `next build`, so no statement here about
> what actually lands in a browser bundle is verified — bundle-graph claims are marked.
> I did not start a dev server, load a page, or issue a single HTTP request, so no
> rendered behaviour, no response header, and no runtime performance figure was observed.
> I did not read `EditorPane.tsx`, `CodeMirrorEditor.tsx`, `AIMenu.tsx`, `CommandPalette.tsx`,
> `Spotlight.tsx`, `GraphView.tsx`, `LinkDoctorModal.tsx` or `SgnkAiButton.tsx` line by line —
> together those are 4,091 lines (973+462+506+399+241+481+440+589) and I read their imports, exported symbols and the
> specific regions cited below, not their bodies. I did not open the Tauri shell, run
> a Lighthouse or accessibility audit, or check any CSS beyond confirming that
> `src/app/globals.css` is byte-identical to the sibling repo's. I did not review
> `docs/FRONTMATTER-PRD-v2-2026-08-29.md` or any of the large records.

---

## 1. Shape of the frontend

Next.js 16.2.6 App Router, React 19.2.6, TypeScript 6.0.3, Tailwind 4.3.0 (all from
`package.json`). No component library; layout is hand-written inline styles plus a small
set of `sgnk-*` utility classes defined in `src/app/globals.css`.

```
find src/app \( -name '*.ts' -o -name '*.tsx' \) | wc -l   →  43
grep -rl '"use client"' src --include='*.tsx' --include='*.ts' | wc -l   →  63
```

43 TypeScript files under `src/app/`, of which 26 are `route.ts` API handlers (covered in
`06-BACKEND-SPEC.md`). 63 files across `src/` carry the `"use client"` directive — that is
28% of the 226 TypeScript files in `src/`, and it is the whole interactive surface: the
editor, the shell, the preview pane, the file tree, every modal.

There is exactly one server-rendered page that a signed-in user ever sees. `src/app/(vault)/page.tsx`
is five lines:

```tsx
import { AppShell } from "@/modules/app-shell";
export default function Home() { return <AppShell />; }
```

`AppShell.tsx` is itself five lines and renders `VaultWorkspace`. So the application is a
single-page client app with a server layout above it, not a multi-route Next application.

---

## 2. Route groups

Four route groups under `src/app/`. One of them is empty.

### `(auth)` — 2 files

| File | Lines | What it does |
|---|---|---|
| `(auth)/layout.tsx` | 12 | Pass-through fragment. Deliberate: the chrome lives in `LoginScreen`. |
| `(auth)/login/page.tsx` | 18 | Server component. Calls `getActor()`; redirects to `/` if signed in, otherwise renders `<LoginScreen />`. |

`/login` is retained for sign-out redirects, error landings and bookmarks. It is not the
primary sign-in surface.

### `(vault)` — 2 files, the whole authenticated app

| File | Lines | What it does |
|---|---|---|
| `(vault)/layout.tsx` | 106 | Server component. Calls `getActor()`; renders `<LoginScreen />` inline when there is no actor, otherwise a 52px sticky header (`SidebarToggle`, brand mark, `CommitBar`, `GraphButton`, `RightPaneCycle`, `ThemeToggle`, avatar, sign-out server action) and `{children}`. |
| `(vault)/page.tsx` | 5 | Renders `<AppShell />`. |

The auth gate is the layout, not the middleware. `src/proxy.ts` marks `/` public precisely so
the layout can own the decision and the unauthenticated visitor sees the login screen at `/`
without a 307 hop. The middleware redirect is described in its own comment as "optimistic";
the real guard is `(vault)/layout.tsx` for pages and `getActor()` in each route handler for APIs.

The brand mark rendered in that header is the two characters `sg`, not `fm`
(`(vault)/layout.tsx`, the `<span aria-hidden>` at the left of the header). The word
`frontmatter` sits next to it.

### `(public)` — 3 files, unauthenticated

| File | Lines | What it does |
|---|---|---|
| `(public)/layout.tsx` | 8 | Pass-through fragment. No shell, no auth gate. |
| `(public)/[slug]/page.tsx` | 39 | The public note renderer. `revalidate = 60`, `dynamicParams = true`. Resolves via `shareApi.resolvePublicNote(slug)`, 404s on unknown or conflicted slugs, emits `generateMetadata`. |
| `(public)/p/[slug]/page.tsx` | 18 | Legacy `/p/<slug>` → `/<slug>` permanent redirect. |

`(public)/[slug]` is a dynamic segment at the **root** of the routing tree, so it competes
with every other top-level path. Two mechanisms keep it from swallowing the app: Next resolves
static segments before dynamic ones, and `src/proxy.ts` filters candidate slugs against
`RESERVED_SLUGS` imported from `@/modules/share/domain/slug`, which is the same list the
slug validator uses. That single-source-of-truth arrangement is the right call and it is
documented in the file.

### `(workspace)` — empty

```
ls -la 'src/app/(workspace)'   →  .gitkeep only, 0 bytes
git log --oneline -- 'src/app/(workspace)'   →  0c1b427 feat: clone md app into frontmatter (product base)
```

The `(workspace)` route group contains nothing but a `.gitkeep` and has contained nothing but
a `.gitkeep` since the fork commit on 2026-07-17. It defines no routes. `src/app/(public)/.gitkeep`
and `src/app/api/.gitkeep` are the same artefact of the original scaffold. **This is designed
and unbuilt**, not partially built: there is no page, layout, or template file in it.

### Root-level files

`layout.tsx` (78), `error.tsx` (61), `global-error.tsx` (89), `loading.tsx` (34),
`not-found.tsx` (38), `manifest.ts` (20), `robots.ts` (25), `sitemap.ts` (30),
`opengraph-image.tsx` (96), `globals.css` (865), `icon.png`.

The root layout loads `Google_Sans` via `next/font/google`, imports `./globals.css`, and
mounts two invisible client islands: `<PWARegister />` and `<TauriBridge />`.

---

## 3. The editor module

`src/modules/editor` — 22 files, 3,954 lines, **all of them in `presentation/`**. There is no
`domain/`, no `application/`, no `infrastructure/` directory in this module. That is
consistent with what it is: a CodeMirror wrapper and its UI, with all state either in a
Zustand store or in the editor's own document.

| File | Lines | Role |
|---|---|---|
| `EditorPane.tsx` | 973 | The module's whole composition. Contains 11 top-level functions including `EditorStatusBar`, `ModeToggle`, `SyncedSplitScroll`, `PreviewPending`, `NoteView`, `SplitPane`, `TwoPaneView` and the exported `EditorPane`. |
| `AIMenu.tsx` | 506 | AI action menu. |
| `CodeMirrorEditor.tsx` | 462 | The CodeMirror 6 host. One of only two files in `editor`+`app-shell` that differ from the sibling repo. |
| `toolbar-transforms.ts` | 291 | Pure text transforms (wrap selection, prefix lines, table snippet, task toggle). |
| `editor-store.ts` | 241 | The Zustand store. See §4. |
| `HistoryModal.tsx` | 187 | Version history. |
| `Toolbar.tsx` | 181 | Formatting toolbar. |
| `ghost-text.ts` | 163 | Inline AI completion decoration. |
| `use-note-content.ts` | 146 | Content loading with the path guard. See §5. |
| `live/block-split.ts`, `live/InlineBlockEditor.tsx`, `live/LivePreview.tsx` | 93 + 89 + 80 | The "live" mode: preview-first, click a block to edit that block's source in place. |
| `slash-commands.ts`, `completions.ts`, `live-preview.ts`, `split-scroll-sync.ts`, `ai-suggestion.ts`, `bookmarks.ts`, `editor-settings.ts`, `active-view.ts`, `path-rename.ts` | 91, 86, 87, 61, 66, 33, 50, 29, 27 | Supporting behaviours. |
| `index.ts` | 12 | Barrel. |

Four editor modes are declared in `editor-store.ts`: `edit`, `live`, `reading`, `split`.
The persisted default is `reading`.

`EditorPane.tsx` imports from six other modules — `preview`, `vault`, `drafts`, `export`,
`share`, `shared/presentation` — and from `@/modules/vault/domain/link-index` by deep path
rather than through the `vault` barrel. See §7.

---

## 4. State management

Three separate mechanisms hold client state. All three are live; none of them knows about
the others.

### 4.1 Zustand stores — three of them

```
grep -rn "zustand" src --include='*.ts' --include='*.tsx'
```

Only three files call `create` from zustand, and all three are in `src/modules/editor/presentation/`:

| Store | File | Persistence key | Storage |
|---|---|---|---|
| `useEditorStore` | `editor-store.ts` | `sgnk-md-editor` | `sessionStorage` |
| `useEditorSettings` | `editor-settings.ts` | (see file) | `localStorage`-class via `createJSONStorage` |
| `useBookmarks` | `bookmarks.ts` | `sgnk-md-bookmarks` | as above |

`useEditorStore` holds `tabs`, `activePath`, `secondaryPath`, `mode`, `contentByPath`,
`baseShaByPath`, `reloadByPath`. Its `partialize` persists only the first four; `contentByPath`
is explicitly excluded with the reason given in the file — it is large, stale across commits,
and re-seeded from `/api/vault/file` on load. Both persisted stores are SSR-guarded by a
`noopStorage` fallback so `persist` never touches a browser API during a server render.

### 4.2 The Zustand selector-stability constraint — honoured

`AGENTS.md` §9 states the constraint: never return a new object, array or `Set` from a
selector, because Zustand v5 compares by `Object.is` and an inline `new Set(...)` gives a new
reference every render, which re-renders, which re-derives, forever.

```
grep -rn "useEditorStore(" src --include='*.tsx' --include='*.ts' | wc -l   →  28
```

I read all 28 call sites. Every one returns a primitive, `null`, or a stable store reference
(an array field or an action function). The two that come closest to constructing something
are:

- `ExportMenu.tsx:40-42` — a conditional returning `string | undefined`, with the comment
  "Stable primitive selectors — no object returned" immediately above it.
- `Outline.tsx:19` — `(s) => (activePath ? (s.contentByPath[activePath] ?? "") : "")`, a string.

The derived `Set` that would have caused the loop is built outside the selector, in render,
under `useMemo` (`FileTree.tsx:71-74`), with the rule restated in a comment at the point of
use. **The constraint is respected everywhere I checked, and it is enforced only by comments** —
there is no lint rule, no test, and no gate that would catch a regression. A new selector
returning `new Set(...)` would pass `npm run verify` and hang the app at runtime.

### 4.3 The editor tab race — the guard is present and load-bearing

`AGENTS.md` §9 states: `useNoteContent` records the path each state was loaded for, and
`toResult` returns `loading` when the recorded path differs from the current one.

Verified in `src/modules/editor/presentation/use-note-content.ts`. The state union carries
`path` on both the `ready` and `error` variants. `toResult(s, currentPath)` compares them and
returns the loading shape when they diverge. The file's own comment names the failure it
prevents: a fast A→B tab switch would otherwise briefly return A's content while React has B
as the current prop, and "that stale closure caused other consumers (preview, outline,
backlinks, the seed-content effect) to bind to the wrong note".

The effect additionally guards with a `cancelled` flag and an `AbortController`, checked after
every `await`. There are seven `if (cancelled) return;` checkpoints in the 90-line effect body.

This is a genuine live constraint, and it is defended in exactly one place. `toResult` is a
module-private function; nothing outside the file can call it, and nothing tests it directly
by name. **The guard is a comment-plus-convention arrangement, same as §4.2** — deleting the
`s.path !== currentPath` comparison would not fail typecheck, lint, or any assertion I found.

### 4.4 React context — one provider

```
grep -rn "createContext" src --include='*.tsx' --include='*.ts'
```

Exactly one: `SnapshotContext` in `src/modules/vault/presentation/SnapshotProvider.tsx` (275
lines), consumed through `useSnapshot()` (a 14-line indirection module kept in place so
`vi.mock` targets keep working — `AGENTS.md` §4 warns against removing it).

### 4.5 The window-event bus — the third mechanism

```
grep -rhoE 'window\.dispatchEvent\(new (Custom)?Event\("[^"]+"' src ... | sort | uniq -c
grep -rhoE 'window\.(add|remove)EventListener\("sgnk:[^"]+"' src ... | sort -u
```

12 distinct channels are dispatched; 15 distinct channels are listened for. All are
string-keyed `CustomEvent`s on `window`, all under the legacy `sgnk:` prefix. The busiest by
far is `sgnk:vault-changed` — 12 dispatch sites, and it is what makes the file tree, the
dirty markers and the snapshot refresh after a save or commit.

The three channels with listeners but no in-app dispatcher — `sgnk:command-palette`,
`sgnk:spotlight`, `sgnk:new-folder` — are dispatched **only** by `TauriBridge.tsx`, which
translates native macOS menu ids into these events and is a no-op outside Tauri. In a browser
the command palette and spotlight are reachable by hotkey only (`mod+p`, `mod+k`, registered
in `KnowledgeUI.tsx:56-58`). The code says so in a comment: "Native (Tauri) menu →
palette/spotlight, which are otherwise hotkey-only." That is correct and intentional, not a gap.

This bus is untyped. No channel has a payload type, no registry lists the channels, and a
typo in a channel name is silent in both directions. It is the least defended of the three
state mechanisms and the one most likely to rot.

### 4.6 Draft persistence

`src/modules/drafts` is 2 files, 176 lines. `draft-store.ts` writes note drafts to IndexedDB
(via `idb-keyval`) and keeps a synchronous dirty-path index in `localStorage` under the key
`sgnk-md:dirty`. It caches the parsed index keyed on the raw `localStorage` string so repeated
`listDirtyPaths()` calls are cheap.

The three legacy persistence keys — `sgnk-md-editor`, `sgnk-md-bookmarks`, `sgnk-md:dirty` —
are deliberately unrenamed. `AGENTS.md` §8 gives the reason: renaming one silently orphans a
user's local drafts and settings.

---

## 5. The fork

The editor shell is not this product's code.

```
# 43 files under src/modules/editor + src/modules/app-shell, compared byte-for-byte
# against /Users/sagnikmitra/Desktop/GitHub/md at HEAD e318ab3
identical = 41   differs = 2   only-here = 0
```

The two that differ are `app-shell/presentation/LinkDoctorModal.tsx` and
`editor/presentation/CodeMirrorEditor.tsx`. **Zero files in those two modules are unique to
frontmatter.** Extending the comparison to the whole of `src/`:

```
identical_to_sibling = 181   differs = 25   only_in_frontmatter = 20   total = 226
```

`src/app/globals.css` (865 lines) is byte-identical to the sibling's as well. Of the 20 files
that exist only here, 13 are `src/modules/mdmax` and 5 are the unreachable Firebase auth path
described in §6.

These numbers re-derive the ones in `docs/PRODUCT-BRIEF.md` §9 row 0 exactly (41/43,
181/226, 25 diverged). Two caveats travel with them. The sibling repository's working tree is
dirty and its HEAD is `02c22ec4` dated 2026-07-17 — the same day as the fork commit here
(`0c1b427`, "feat: clone md app into frontmatter (product base)", 2026-07-17 00:40 +0530) —
so this comparison is against a snapshot that has not moved, and it says nothing about where
upstream would be today. And byte-identity is a lower bound on shared design, not an upper
one: the 25 diverged files diverged from a common ancestor and still share their structure.

---

## 6. Dead and unreachable frontend code

Four files under `src/` are never named in any import specifier anywhere in `src/`, `test/`,
`specs/` or `scripts/`:

```
src/container/client-container.ts                              22 lines
src/modules/preview/presentation/markdown/editable-table.tsx  165 lines
src/shared/presentation/Icon.tsx                               77 lines
src/modules/auth/infrastructure/next-auth.d.ts                 24 lines   (not dead — ambient .d.ts)
```

`next-auth.d.ts` is an ambient declaration file; TypeScript picks it up by inclusion, so it is
correctly uncited. The other three are dead.

- **`Icon.tsx`** exports `ICON_PATHS`, `IconName` and `Icon`. `grep -rn "<Icon"` returns
  nothing; `grep -rn "shared/presentation/Icon"` returns nothing. The icon actually in use is
  `GoogleIcon` from the same directory, imported by `EditorPane.tsx` and `ExportMenu.tsx`.
- **`editable-table.tsx`** exports `EditableTable`. Zero references in `src/` or `test/`. The
  live table editing path is `preview/presentation/table-edit.ts` (190 lines), which
  `PropertiesPanel` and the markdown renderer use.
- **`client-container.ts`** is the browser composition root. See below.

### The Firebase auth path — built, exported, never rendered

Five files, 260 lines, form a complete second identity system:

| File | Lines | Reachable from |
|---|---|---|
| `src/container/client-container.ts` | 22 | nothing |
| `src/modules/auth/infrastructure/firebase-auth-gateway.ts` | 61 | `client-container.ts` and a test |
| `src/shared/infrastructure/firebase/client.ts` | 40 | `firebase-auth-gateway.ts` |
| `src/modules/auth/application/ports.ts` | 33 | barrel, `client-container.ts`, `GoogleSignInButton` |
| `src/modules/auth/presentation/GoogleSignInButton.tsx` | 105 | the `auth` barrel only |
| `src/modules/auth/domain/auth-user.ts` | 21 | the `auth` barrel only |

`grep -rn "<GoogleSignInButton"` returns zero render sites. The `auth` barrel comments the
Firebase exports as "the identity system that replaces Auth.js", but the live login screen
(`LoginScreen.tsx`, 159 lines) imports only `signIn` from `@/auth` and `PasswordLoginForm`,
and `auth-options.ts` configures exactly two Auth.js providers: GitHub OAuth and a credentials
provider with id `sgnk-password`. **The replacement is designed and unwired.** `firebase`
12.16.0 is a production dependency of this package and is reachable only through code nothing
imports.

### Barrel exports with no render site

`RightPaneToggle.tsx` (50 lines) and `ScrollbarToggle.tsx` (66 lines) are exported from
`@/modules/app-shell` and rendered nowhere. `grep -rn "<RightPaneToggle\|<ScrollbarToggle"`
matches only a CSS comment in `globals.css` and a JSDoc line in `RightPaneCycle.tsx`, which
says it "replaces the previous separate `<RightPaneToggle />` and `<ScrollbarToggle />`
buttons". The barrel keeps them "for back-compat" — but this application has no external
consumers, so there is nothing to be compatible with.

Dead or unreachable total across the frontend: **640 lines in 10 files**
(22 + 165 + 77 + 61 + 40 + 21 + 33 + 105 + 50 + 66).

---

## 7. Module-boundary drift in the presentation layer

`AGENTS.md` §2: "Cross-module imports go through the module barrel (`@/modules/<name>`), never
the deep path. Add new exports to the barrel; don't deep-import even for types."

```
# imports matching @/modules/<X>/<layer>/... from a file outside src/modules/<X>/
38 total
```

22 of those 38 are in `src/container/dependency-container.ts`, where deep imports are
structurally correct — a composition root must reach infrastructure, and the barrel
deliberately does not export it. Two more are in `client-container.ts` and one in
`src/auth.ts`, also composition. That leaves **13** deep imports that are not composition
(38 − 22 − 2 − 1), of which two are unavoidable because `mdmax` has no barrel (§8). These
are the ones in the frontend or its delivery layer:

| From | To |
|---|---|
| `src/app/(public)/[slug]/page.tsx` | `@/modules/share/presentation/PublicNoteView` |
| `src/modules/ai-tools/presentation/SgnkAiButton.tsx` | `@/modules/editor/presentation/active-view` |
| `src/modules/editor/presentation/EditorPane.tsx` | `@/modules/vault/domain/link-index` |
| `src/modules/graph/presentation/graph-data.ts` | `@/modules/vault/domain/link-index` |
| `src/modules/preview/presentation/PropertiesPanel.tsx` | `@/modules/share/domain/splice-frontmatter` |
| `src/proxy.ts` | `@/modules/share/domain/slug` |

None of these is caught by any gate. `eslint.config.mjs` configures `eslint-plugin-boundaries`
against layer *types* — `domain`, `application`, `infrastructure`, `presentation`, `container`,
`config`, `app`, `middleware` — with rules on the direction between layers. There is no rule
keyed on the module name, so `presentation → presentation` across two different modules is
allowed by the config even though `AGENTS.md` forbids it. `specs/harness/clean-architecture-report.mjs`
reports `{"total": 0, "filesScanned": 208}` and does not check barrels either.

More than that: `06-BACKEND-SPEC.md` §4.1 proves with probe files that the
`boundaries/dependencies` rule emits no diagnostics at all — a deliberate
`application → infrastructure` import and a deliberate `domain → infrastructure` import were
both missed by eslint, in the same run where `no-restricted-imports` correctly flagged an
`@/lib/*` import in the same file. So the layer rules are enforced only by
`clean-architecture-report.mjs`, which does not check `domain` and does not check barrels.

The last one is the most consequential: `src/proxy.ts` is edge middleware and it imports
`RESERVED_SLUGS` from a domain module. The eslint config's `middleware` rule permits
`application`, `infrastructure`, `shared-application`, `shared-infrastructure` and `config` —
**not `domain`**. That import should be a lint error. `npx eslint src/proxy.ts` reports
nothing, and the probes in `06-BACKEND-SPEC.md` §4.1 show why: the boundaries rule is silent
for every layer pair tested.

`src/modules/mdmax` has no `index.ts` at all, so the two files that use the engine
(§8) *cannot* import it through a barrel. That is a missing barrel, not a violation of choice.

---

## 8. What the frontend does with the engine

Nothing directly.

```
grep -rn "mdmax" src --include='*.ts' --include='*.tsx' | grep -vc '^src/modules/mdmax/'   →  2
```

Both consumers are server-side, in the `vault` module: `application/get-snapshot.ts` and
`infrastructure/search-index.ts`, and both import the same single symbol, `decodeStrict`, from
`domain/shape-gate.ts`. No file under `src/app/`, no `"use client"` file, and no component
imports anything from `src/modules/mdmax`. **The byte-exact engine has no presence in the
client at all.** This is `docs/PRODUCT-BRIEF.md` §9 row 4 ("one symbol from one of thirteen
files reaches product code"), and it re-derives: 1 symbol, 1 of 13 files, 2 call sites.

The byte-exact write path that the product's differentiation rests on is
`src/modules/share/domain/splice-frontmatter.ts` (282 lines), which lives in the **share**
module, not in `mdmax`. It is reached from the frontend by `PropertiesPanel.tsx`, which calls
`spliceFrontmatterValue` and `spliceFrontmatterKey` when a user edits a property. The two
open engine defects — NF-1 (zero-indent block sequence) and NF-3 (bare-CR fence) — are
defects in that file, and their red proofs
(`test/corpus/foreign/nf-001-red-proof.test.ts`, `nf-003-red-proof.test.ts`) import from it
directly. Those six `it.fails` assertions are the 6 expected-fail results in the suite run.

---

## 9. Public renderer: the enforced CSP is bound to the old URL

`next.config.ts` builds a tight, enforced `Content-Security-Policy` — no `unsafe-eval`,
`object-src 'none'`, `frame-ancestors 'none'` — and attaches it to exactly one source:

```ts
{ source: "/p/:slug*", headers: [{ key: "Content-Security-Policy", value: publicCsp }] },
```

The public note renderer is no longer at `/p/<slug>`. `(public)/p/[slug]/page.tsx` is now an
18-line `permanentRedirect` to `/<slug>`, and the actual renderer is `(public)/[slug]/page.tsx`.
A header source of `/p/:slug*` does not match `/<slug>`.

What the public page does get is `src/proxy.ts`'s header, which is
`Content-Security-Policy-Report-Only` and includes `'unsafe-eval'` — appropriate for the
authenticated editor it was written for, and not a control on an anonymous page rendering
content that may have been written by an agent. The comment in `proxy.ts` still says "The
public /p/* renderer gets an ENFORCED tight CSP via next.config.ts headers()", which was true
before the URL moved.

The base headers from `next.config.ts` (`X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options: DENY`) do apply to `/:path*` and therefore to the public page.

**unverified at runtime** — I did not build or serve the app and did not observe a response
header. The finding is read off `next.config.ts`, `src/proxy.ts` and the two page files, all
at `e318ab3`.

---

## 10. `react-dom/server` in the client component graph

`src/modules/export/index.ts` carries this note:

> `renderPdfHtmlDocument` is NOT exported here — it uses `react-dom/server` and must only be
> imported directly in server-side routes, never via this index (which is imported by client
> component trees).

`pdf-doc.ts` does not use `react-dom/server`. Its own header says so twice: "no
react-dom/server, no `use client` imports" and "No react-dom/server, no `use client` component
imports". It is a `unified`/`remark`/`rehype` pipeline. The file that *does* import
`react-dom/server` is `export-doc.ts`, at line 1:

```ts
import { renderToStaticMarkup } from "react-dom/server";
```

and `export-doc.ts` **is** exported from the barrel (`renderNoteHtmlDocument`,
`triggerDownload`, `openPrintView`), and is imported by `ExportMenu.tsx`, which opens with
`"use client"`.

So the barrel's stated protection is attached to the wrong file. The reason given for
excluding `pdf-doc` does not apply to `pdf-doc`, and it does apply to something the barrel
exports.

**unverified** — whether `react-dom/server` actually ships in a browser bundle depends on what
Turbopack does with `renderToStaticMarkup` in a client boundary, and I did not run
`next build`. The misattribution in the comment is verified by reading the three files.

---

## 11. What has no gate

Everything in this section passes `npm run verify` today.

| Constraint | Where it is stated | What enforces it |
|---|---|---|
| Stable Zustand selectors | `AGENTS.md` §9, comments at 3 call sites | nothing |
| The `useNoteContent` path guard | `AGENTS.md` §9, a comment in the file | nothing |
| Cross-module imports via barrel | `AGENTS.md` §2 | nothing (13 non-composition deep imports; 11 avoidable) |
| Layer direction (`domain ← application ← infrastructure`) | `AGENTS.md` §3, `eslint.config.mjs` | `clean-architecture-report.mjs` only — the eslint boundaries rule emits nothing, and the harness does not check `domain` (proof: `06-BACKEND-SPEC.md` §4.1) |
| `process.env` only in `config/` and `infrastructure/` | `AGENTS.md` §6 | nothing (8 live reads elsewhere: `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `proxy.ts` ×2, `api/export/pdf` ×2, `dependency-container.ts`) |
| Bundle size | `package.json` `budget` script | `echo 'No bundle budget configured yet — skipping'` |
| Anything, on push | — | no `.github/` directory exists in this repo |

```
ls .github   →  ls: .github: No such file or directory
node -e 'console.log(require("./package.json").scripts.budget)'
             →  echo 'No bundle budget configured yet — skipping'
```

The gates that do exist are green and real: 100 test files / 1,581 passing assertions in
11.76s, `clean-architecture-report.mjs` at 0 violations over 208 files, and
`spec-report.mjs` at 4 specs / 0 errors. The specs governing frontend behaviour: there are
none. `spec-report.mjs` reports **169 of 171 module files ungoverned**, and all 4 specs
(`nf-001-zero-indent-sequence.md`, `nf-003-bare-cr-fence.md`, `splice-writer.md`, and the
schema) are `state: draft` — none has reached `verified`.

---

## 12. Summary for a reader deciding what to do next

The frontend is a competent, finished-feeling single-page markdown editor. It is also, at the
byte level, someone else's: 41 of 43 files in its two core modules and 181 of 226 files across
`src/` are identical to the sibling repo, and its stylesheet is identical too. Nothing in the
client touches this product's engine.

The three things I would put in front of the founder from this pass, in order:

1. **The enforced CSP protects a URL that redirects** (§9). The page that renders
   agent-written content to anonymous visitors runs under report-only policy with
   `unsafe-eval`. Two lines in `next.config.ts`.
2. **Three live constraints are defended by comments alone** (§4.2, §4.3, §7). Each is a
   documented past bug. Each would survive `npm run verify` if reintroduced — and so, it turns
   out, would a `domain → infrastructure` import, because the eslint boundaries rule emits no
   diagnostics at all (`06-BACKEND-SPEC.md` §4.1, proven with probe files).
3. **640 lines of dead frontend code**, including a complete second identity system
   (§6) that keeps `firebase` in the dependency tree.
