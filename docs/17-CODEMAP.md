---
mode: reference
updated: 2026-09-09
verified_against: 6331b1b
---

# CODEMAP

> **Method.** Generated from a real listing: `find src -type d | sort` for the directories and
> `find src -name '*.ts' -o -name '*.tsx' | sort` for the 226 files, with `wc -l` for every line
> count and a grep of each file's top-level `export` statements for its symbols. Every path and
> every number below came out of that pass. I spot-read the leading doc comment of twelve files
> whose purpose was not obvious from the exports (`instrumentation.ts`, `TauriBridge.tsx`,
> `KnowledgeUI.tsx`, `SgnkAiButton.tsx`, `ghost-text.ts`, `live-preview.ts`, `snapshot-cache.ts`,
> and five `mdmax` files — `bench.ts`, `targets.ts`, `normalize.ts`, `certify.ts`, `verdict.ts`)
> and used their own words.
> **What this pass did NOT do:** I did not read the bodies of the other 214 files, so the
> one-line descriptions are inferred from exported names, path position and layer, not from
> behaviour — a file whose export names lie will be described wrongly here. I did not check that
> the layer rule holds; `npm run arch` does that and reported `total: 0` over 208 files at this
> commit. I did not verify which files are byte-identical to the sibling `sgnk-md` repo; the
> fork figures quoted in §2 are `docs/PRODUCT-BRIEF.md` §9's, carried, not re-derived.

## 1. Shape

226 TypeScript files, 25,407 lines, under six top-level areas.

| Area | Files | What it is |
|---|---|---|
| `src/app/` | 43 | Next.js App Router — pages, layouts, 26 route handlers, metadata generators |
| `src/modules/` | 171 | The thirteen feature modules |
| `src/shared/` | 6 | Cross-module primitives — `Result`, errors, GitHub and Firebase clients, two icons |
| `src/container/` | 2 | Composition roots, server and client |
| `src/config/` | 1 | The only place `process.env` may be read outside `*/infrastructure/` |
| `src/` (root) | 3 | `auth.ts`, `proxy.ts`, `instrumentation.ts` |

The layer rule is `domain ← application ← infrastructure`, with `presentation` and `container`
above, inward only. Cross-module imports go through the module barrel `@/modules/<name>`.

Two directories exist but hold only a `.gitkeep`: `src/app/(workspace)/` and
`src/shared/application/ports/`. They are scaffolding for a shape nobody has needed yet.

## 2. The thirteen modules

Twelve carry an `index.ts` barrel. **`mdmax` does not.**

| Module | Files | Lines | Barrel | Layers present |
|---|---|---|---|---|
| `vault` | 30 | 3,164 | yes | domain, application, infrastructure, presentation |
| `editor` | 22 | 3,954 | yes | presentation only |
| `app-shell` | 21 | 2,687 | yes | presentation only |
| `preview` | 21 | 2,306 | yes | presentation only |
| `share` | 15 | 1,215 | yes | domain, application, infrastructure, presentation |
| `auth` | 14 | 884 | yes | domain, application, infrastructure, presentation |
| `mdmax` | 13 | 3,614 | **no** | domain, application, infrastructure |
| `repository` | 12 | 1,399 | yes | domain, application, infrastructure, presentation |
| `ai` | 11 | 549 | yes | application, infrastructure |
| `export` | 5 | 646 | yes | presentation only |
| `graph` | 3 | 685 | yes | presentation only |
| `ai-tools` | 2 | 590 | yes | presentation only |
| `drafts` | 2 | 176 | yes | infrastructure only |

Line totals per module come from `cat $(find src/modules/<m> -name '*.ts' -o -name '*.tsx') | wc -l`,
run once per module. `mdmax` at 3,614 lines is the figure `docs/PRODUCT-BRIEF.md` quotes for the portable engine,
and it reproduces exactly: `cat $(find src/modules/mdmax -name '*.ts') | wc -l`.

**`mdmax` is almost entirely unwired.** Only one symbol from it is imported anywhere else in
`src/`: `decodeStrict` from `domain/shape-gate.ts`, used by `vault/application/get-snapshot.ts`
and `vault/infrastructure/search-index.ts`. That is the whole external surface —
`grep -rn 'modules/mdmax' src --include='*.ts' --include='*.tsx'` outside the module itself
returns 2 lines. The certificate engine, the construct inventory, the fold, the verdict
classifier, the target registry and the bench are all present, all tested (188 written cases in
`test/mdmax/`), and reachable from no product code path.

## 3. Directory listing

```
src/
├── app/                          Next App Router
│   ├── (auth)/login/             sign-in route group
│   ├── (public)/[slug]/          published note, ISR
│   ├── (public)/p/[slug]/        legacy published-note redirect
│   ├── (vault)/                  the authenticated editor
│   ├── (workspace)/              .gitkeep only — unused route group
│   └── api/                      26 route handlers: ai, auth, commit, export, share, vault
├── config/                       env parsing and validation
├── container/                    composition roots
├── modules/
│   ├── ai/                       LLM use cases + provider gateway
│   ├── ai-tools/                 the floating AI button
│   ├── app-shell/                chrome: palette, spotlight, panes, toggles
│   ├── auth/                     identity: Firebase gateway + Auth.js options
│   ├── drafts/                   IndexedDB draft persistence
│   ├── editor/                   CodeMirror surface, store, toolbar, live preview
│   ├── export/                   HTML/PDF/print rendering of a note
│   ├── graph/                    force-directed link graph
│   ├── mdmax/                    the byte-exactness engine — owned, mostly unwired
│   ├── preview/                  markdown rendering, wikilinks, callouts, outline
│   ├── repository/               git write path: commit, rename, merge, upload
│   ├── share/                    public slugs, frontmatter splice, share modals
│   └── vault/                    the file tree, snapshot, search, link index
├── shared/                       Result, errors, GitHub + Firebase clients, icons
├── auth.ts                       Auth.js singleton re-export
├── instrumentation.ts            Next startup hook + onRequestError
└── proxy.ts                      auth redirect + public-asset allowlist
```

## 4. Every file

Line counts from `wc -l`. Descriptions inferred from exports and path unless the file was one of
the twelve spot-read.

### `src/` (root, 3)

| File | Lines | One line |
|---|---|---|
| `auth.ts` | 10 | Re-exports the Auth.js singleton so app code has one import site. |
| `instrumentation.ts` | 42 | Next's startup hook — exports `register()` (a no-op bootstrap today) and `onRequestError`. |
| `proxy.ts` | 141 | The auth redirect plus `PUBLIC_STATIC_RE`; exports `isPublicSlugPath`, `isPublicPath`, `proxy`, `config`. |

### `src/config/` (1)

| File | Lines | One line |
|---|---|---|
| `env.ts` | 254 | Zod-shaped parsers for every env group — `parseEnv`, `parseAuthEnv`, `parseRepoEnv`, `parseAiEnv`, `parseFirebaseConfig` — throwing loudly on invalid input; its own comment calls it a pure parser tested in isolation. |

### `src/container/` (2)

| File | Lines | One line |
|---|---|---|
| `dependency-container.ts` | 144 | The app-facing composition root, and per its own comment the only wiring module app or presentation may import; exports `container`, `shareApi`, `Container`. |
| `client-container.ts` | 22 | The browser-side counterpart, exporting only `authGateway`. |

### `src/shared/` (6)

| File | Lines | One line |
|---|---|---|
| `domain/result.ts` | 8 | The `Result` type and its four helpers `ok`, `err`, `isOk`, `isErr`. |
| `domain/errors.ts` | 12 | `FileNotFoundError`, the one error shared across modules. |
| `infrastructure/github/client.ts` | 171 | Every raw GitHub call the app makes: `githubFetch`, `getHeadSha`, `getZipball`, `getFile`, `listHistory`, `getFileAtSha`, `getBlobContent`. |
| `infrastructure/firebase/client.ts` | 40 | Lazy Firebase app, auth and Firestore handles. |
| `presentation/Icon.tsx` | 77 | Inline-SVG Material Symbol paths keyed by `IconName`; no icon font. |
| `presentation/GoogleIcon.tsx` | 66 | The Google mark for the sign-in button, inline SVG. |

### `src/app/` — pages and layouts (7)

| File | Lines | One line |
|---|---|---|
| `(auth)/layout.tsx` | 12 | Bare layout for the sign-in route group. |
| `(auth)/login/page.tsx` | 18 | The login page, rendering `LoginScreen`. |
| `(public)/layout.tsx` | 8 | Layout for unauthenticated published notes. |
| `(public)/[slug]/page.tsx` | 39 | The published note page — `revalidate = 60`, `dynamicParams = true`, plus `generateMetadata`. |
| `(public)/p/[slug]/page.tsx` | 18 | Redirect from the legacy `/p/<slug>` URL shape to `/<slug>`. |
| `(vault)/layout.tsx` | 106 | The authenticated shell — providers, session gate, workspace chrome. |
| `(vault)/page.tsx` | 5 | The vault index, five lines delegating to the workspace. |

### `src/app/` — app-level Next surfaces (9)

| File | Lines | One line |
|---|---|---|
| `layout.tsx` | 78 | Root layout; its comment pins a single typeface across the app (Google Sans) and exports `metadata` and `viewport`. |
| `error.tsx` | 61 | Route-level error boundary. |
| `global-error.tsx` | 89 | Whole-app error boundary, rendered when the root layout itself throws. |
| `loading.tsx` | 34 | Route-level loading state. |
| `not-found.tsx` | 38 | The 404 page. |
| `manifest.ts` | 20 | The PWA web app manifest. |
| `opengraph-image.tsx` | 96 | Edge-rendered OG image for link previews. |
| `robots.ts` | 25 | `robots.txt` generator. |
| `sitemap.ts` | 30 | `sitemap.xml` generator. |

### `src/app/api/` — 26 route handlers plus one helper

AI (6). All six export `runtime`, `dynamic`, `maxDuration` and a single `POST`.

| File | Lines | One line |
|---|---|---|
| `ai/complete/route.ts` | 61 | Inline continuation for the editor's ghost text. |
| `ai/generate-doc/route.ts` | 64 | Whole-document generation from an idea and a document kind. |
| `ai/link-doctor/route.ts` | 73 | Batch wikilink repair across notes. |
| `ai/refine/route.ts` | 55 | Rewrite of a selection. |
| `ai/suggest-links/route.ts` | 60 | Wikilink suggestions for a note. |
| `ai/summarize/route.ts` | 52 | Summary of a note. |

Vault (14 handlers + 1 helper).

| File | Lines | One line |
|---|---|---|
| `vault/snapshot/route.ts` | 47 | `GET` the whole-vault snapshot the UI renders from. |
| `vault/file/route.ts` | 66 | `GET` one note's content. |
| `vault/raw/[...path]/route.ts` | 60 | `GET` a raw blob (images, attachments) by vault path. |
| `vault/raw/content-type.ts` | 24 | `inferContentType` — the extension-to-MIME map for the raw route; not a handler. |
| `vault/create/route.ts` | 97 | `POST` a new note. |
| `vault/delete/route.ts` | 101 | `POST` a deletion (to trash). |
| `vault/rename/route.ts` | 90 | `POST` a rename, rewriting inbound wikilinks. |
| `vault/folder/route.ts` | 145 | `POST` folder create, rename and move — the largest vault handler. |
| `vault/merge/route.ts` | 66 | `POST` a three-way merge of a note against its remote. |
| `vault/restore/route.ts` | 69 | `POST` a restore from trash or from a past version. |
| `vault/history/route.ts` | 43 | `GET` a note's commit history. |
| `vault/version/route.ts` | 51 | `GET` one past version of a note. |
| `vault/search/route.ts` | 52 | `GET` search results from the MiniSearch index. |
| `vault/unlinked/route.ts` | 41 | `GET` unlinked mentions for a note. |
| `vault/upload/route.ts` | 99 | `POST` an attachment upload. |

Everything else (6).

| File | Lines | One line |
|---|---|---|
| `auth/[...nextauth]/route.ts` | 3 | The Auth.js catch-all, three lines. |
| `commit/route.ts` | 115 | `POST` a batch of file changes and deletions as one git commit. |
| `share/route.ts` | 83 | `GET`, `POST` and `DELETE` a note's public slug. |
| `share/conflicts/route.ts` | 28 | `GET` the list of slug collisions in the vault. |
| `export/vault/route.ts` | 39 | `GET` the whole vault as a zip. |
| `export/pdf/[...path]/route.ts` | 190 | `GET` a note as PDF via headless chromium — the largest handler in the app. |

### `src/modules/ai/` (11 files, 549 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 24 | Barrel. |
| `application/ports.ts` | 12 | The `LlmClient` port — the only thing the use cases below know about models. |
| `application/summarize.ts` | 18 | `makeSummarize` — summarise a note. |
| `application/refine-text.ts` | 27 | `makeRefineText` — rewrite a selection. |
| `application/generate-document.ts` | 29 | `makeGenerateDocument` — produce a whole document from an idea. |
| `application/apply-wikilinks.ts` | 42 | `applyWikilinkSuggestion` — apply one suggested link to note text. |
| `application/doc-prompts.ts` | 50 | The five document kinds (`DOC_KINDS`) and their prompts. |
| `application/suggest-links.ts` | 64 | `makeSuggestLinks` — propose wikilinks for a note. |
| `application/link-doctor.ts` | 83 | `makeLinkDoctor` — batch link repair with a per-note result and error type. |
| `infrastructure/provider-race.ts` | 96 | `raceProviders` — first-good-answer across configured providers, with concurrency and timeout defaults. |
| `infrastructure/gateway-client.ts` | 104 | `gatewayLlmClient` — the `LlmClient` implementation over the AI SDK providers. |

### `src/modules/ai-tools/` (2 files, 590 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 1 | Barrel, one line. |
| `presentation/SgnkAiButton.tsx` | 589 | Per its own comment, the floating bottom-right ⌘J trigger opening a Notion-AI-style popover. |

### `src/modules/app-shell/` (21 files, 2,687 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 16 | Barrel; its comment flags `RightPaneToggle` as kept for back-compat. |
| `presentation/AppShell.tsx` | 5 | Five-line composition of the shell. |
| `presentation/VaultWorkspace.tsx` | 265 | The three-pane workspace: tree, editor, right pane. |
| `presentation/CommandPalette.tsx` | 399 | ⌘K palette over commands, notes and actions. |
| `presentation/Spotlight.tsx` | 241 | The quick-open overlay. |
| `presentation/SearchPanel.tsx` | 263 | Full-text search results panel. |
| `presentation/fuzzy.ts` | 79 | `fuzzyFilter` — the ranking used by the palette and spotlight. |
| `presentation/LinkDoctorModal.tsx` | 440 | The review UI for batch wikilink repair. |
| `presentation/ImportModal.tsx` | 101 | Import an external vault or file set. |
| `presentation/SettingsModal.tsx` | 82 | Editor and app settings. |
| `presentation/KnowledgeUI.tsx` | 130 | Container for the tags and bookmarks panels. |
| `presentation/RightPaneCycle.tsx` | 152 | Cycles the right pane between its modes; exports `RightPaneMode`. |
| `presentation/RightPaneToggle.tsx` | 50 | The older two-state right-pane toggle, kept for back-compat. |
| `presentation/SidebarToggle.tsx` | 26 | Show/hide the file tree. |
| `presentation/ScrollbarToggle.tsx` | 66 | Show/hide scrollbars. |
| `presentation/ScrollIndicator.tsx` | 144 | The reading-position indicator. |
| `presentation/ThemeToggle.tsx` | 46 | Light/dark switch. |
| `presentation/GraphButton.tsx` | 25 | Opens the link graph. |
| `presentation/PWARegister.tsx` | 69 | Registers the service worker. |
| `presentation/TauriBridge.tsx` | 60 | Per its own comment, translates native Tauri menu and shortcut events into the DOM CustomEvents the web app already listens for, so no behaviour forks. |
| `presentation/use-hotkey.ts` | 28 | `useHotkey` — the keyboard-binding hook everything above uses. |

### `src/modules/auth/` (14 files, 884 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 9 | Barrel; its comment names Firebase Auth as the path replacing Auth.js. |
| `domain/actor.ts` | 10 | `ActorContext` — who is acting, passed inward. |
| `domain/auth-user.ts` | 21 | The `AuthUser` shape. |
| `domain/allowlist.ts` | 10 | `isAllowed` — the ten-line access predicate. |
| `application/ports.ts` | 33 | The `AuthGateway` port. |
| `infrastructure/auth-options.ts` | 118 | Auth.js configuration: providers, callbacks, session shape. |
| `infrastructure/firebase-auth-gateway.ts` | 61 | `makeFirebaseAuthGateway` — the `AuthGateway` over Firebase. |
| `infrastructure/password.ts` | 99 | `verifyPassword` for the credentials path. |
| `infrastructure/next-auth.d.ts` | 24 | Module augmentation for Auth.js session types; declarations only. |
| `presentation/session.ts` | 83 | `getActor` and `requireActor` — the server-side session read. |
| `presentation/LoginScreen.tsx` | 159 | The sign-in screen. |
| `presentation/GoogleSignInButton.tsx` | 105 | Google OAuth button. |
| `presentation/PasswordLoginForm.tsx` | 101 | Email-and-password form. |
| `presentation/sign-in-password.ts` | 51 | `signInWithPassword` and its `PasswordSignInState`. |

### `src/modules/drafts/` (2 files, 176 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 13 | Barrel. |
| `infrastructure/draft-store.ts` | 163 | IndexedDB draft persistence — `saveDraft`, `getDraft`, `deleteDraft`, `hasDraft`, `listDirtyPaths`. The store key keeps the legacy `sgnk-md` prefix on purpose (AGENTS.md §8). |

### `src/modules/editor/` (22 files, 3,954 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 12 | Barrel. |
| `presentation/EditorPane.tsx` | 973 | The editor pane — tabs, modes, split view, save wiring. The largest file in the codebase. |
| `presentation/AIMenu.tsx` | 506 | The in-editor AI verb menu. |
| `presentation/CodeMirrorEditor.tsx` | 462 | The CodeMirror 6 instance: extensions, keymaps, completion wiring. |
| `presentation/toolbar-transforms.ts` | 291 | Pure text transforms behind every toolbar button — wrap, prefix, task toggle, table and link insertion. |
| `presentation/editor-store.ts` | 241 | The Zustand store: `Tab`, `EditorMode`, `useEditorStore`. |
| `presentation/HistoryModal.tsx` | 187 | Version history browser for the open note. |
| `presentation/Toolbar.tsx` | 181 | The toolbar itself. |
| `presentation/ghost-text.ts` | 163 | Per its own comment, Cursor/Copilot-style inline continuation: after an idle, fetches from `/api/ai/complete` and renders faint. |
| `presentation/use-note-content.ts` | 146 | `useNoteContent` — records the path each state was loaded for and returns `loading` on mismatch, which is the tab-race guard AGENTS.md §9 warns against breaking. |
| `presentation/live/block-split.ts` | 93 | `splitIntoSegments`, `reassemble`, `replaceSegment` — the block model behind live editing. |
| `presentation/slash-commands.ts` | 91 | `makeSlashCommandSource` — the `/` command completion source. |
| `presentation/live-preview.ts` | 87 | Per its own comment, Obsidian-style concealment of markdown markers on lines the cursor is not on. |
| `presentation/completions.ts` | 86 | `matchTrigger` and `makeVaultCompletionSource` — `[[` wikilink completion over the vault. |
| `presentation/live/InlineBlockEditor.tsx` | 89 | The inline editor for a single live-preview block. |
| `presentation/live/LivePreview.tsx` | 80 | The live-preview surface composing those blocks. |
| `presentation/ai-suggestion.ts` | 66 | The CodeMirror state field holding an AI suggestion range and its show/clear commands. |
| `presentation/split-scroll-sync.ts` | 61 | `shouldSyncScroll` and `createSplitScrollSync` — intent-windowed scroll linking between panes. |
| `presentation/editor-settings.ts` | 50 | `useEditorSettings` — persisted editor preferences. |
| `presentation/bookmarks.ts` | 33 | `useBookmarks`. |
| `presentation/active-view.ts` | 29 | Module-level handle on the focused CodeMirror view and its path. |
| `presentation/path-rename.ts` | 27 | `applyPathRename` — updates open tabs when a note moves. |

### `src/modules/export/` (5 files, 646 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 9 | Barrel. |
| `presentation/ExportMenu.tsx` | 187 | The export menu. |
| `presentation/print-css.ts` | 156 | `PRINT_CSS`, page margin and head font links shared by both renderers. |
| `presentation/export-doc.ts` | 153 | `renderNoteHtmlDocument`, `triggerDownload`, `openPrintView` — the HTML export path. |
| `presentation/pdf-doc.ts` | 141 | `renderPdfHtmlDocument` — the document handed to chromium by the PDF route. |

### `src/modules/graph/` (3 files, 685 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 7 | Barrel. |
| `presentation/GraphView.tsx` | 481 | The force-directed graph canvas. |
| `presentation/graph-data.ts` | 197 | `buildGraph` and `groupForTags` — the pure node/link/colour derivation, tested separately from the canvas. |

### `src/modules/mdmax/` (13 files, 3,614 lines) — no barrel

| File | Lines | One line |
|---|---|---|
| `domain/constructs.ts` | 618 | `CONSTRUCTS` — the per-construct capability table built offline from minimal pairs, plus `inventory` and `skipRegions`. |
| `infrastructure/bench.ts` | 538 | Per its own comment, the pinned renderers `mdmax cert` measures against; does IO and spawns a Ruby subprocess, so nothing in `src/app` or any React tree may import it. |
| `domain/fold.ts` | 430 | The versioned equivalence fold — `FOLD_RULES`, `fold`, `foldEqual`, `foldStamp`. |
| `domain/verdict.ts` | 411 | Per its own comment, the pure classifier for one (block, target) cell, returning a `CellVerdict` with `before` and `after`. |
| `application/certify.ts` | 375 | Per its own comment, layers 2 and 3 of the certificate engine — `splitBlocks`, `certify`, `brokenHistogram`. |
| `domain/offsets.ts` | 315 | The offset algebra: `U16Offset`, `ByteOffset`, `GraphemeIndex`, `OffsetMap`, `splitsSurrogatePair`, `utf8Length`. |
| `domain/shape-gate.ts` | 174 | `shapeGate` and `decodeStrict` with the byte, line and time budgets — the only part of `mdmax` anything else imports. |
| `domain/cert-contract.ts` | 168 | The certificate types: `Verdict`, `CellVerdict`, `Engine`, `Target`, `CertBlock`, `Certificate`. |
| `domain/placement.ts` | 154 | `safeInsert`, `blockSkeleton`, `nearSetextUnderline` — where a write may land without changing the parse. |
| `domain/targets.ts` | 133 | Per its own comment, the (product, surface) registry, shaped that way because "GitHub" is three renderers that disagree on identical bytes. |
| `domain/slug.ts` | 115 | Heading-anchor slugging and resolution, versioned. |
| `domain/frontmatter-prepass.ts` | 121 | `prepassFrontmatter` and `extractWikilinks`. |
| `domain/normalize.ts` | 62 | Per its own comment, the frozen hash input for every stored anchor — NFC, collapse whitespace, lowercase — versioned because the 99.627% re-anchoring figure was swept under exactly this definition. |

### `src/modules/preview/` (21 files, 2,306 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 8 | Barrel. |
| `presentation/EmbeddedNote.tsx` | 238 | Renders an embedded `![[note]]` transclusion. |
| `presentation/PropertiesPanel.tsx` | 235 | The frontmatter properties editor. |
| `presentation/markdown/html-policy.ts` | 215 | `createRehypeHtmlPolicy`, `DISALLOWED_RAW_HTML_ELEMENTS`, `getAnchorTargetProps` — the raw-HTML sanitiser. |
| `presentation/table-edit.ts` | 190 | `findGfmTables` and `setTableCell` — pure table editing over source text. |
| `presentation/markdown/components.tsx` | 191 | `buildComponents` — the react-markdown component map. Governed by `specs/render/carrier.md`. |
| `presentation/markdown/editable-table.tsx` | 165 | The editable table component sitting on `table-edit.ts`. |
| `presentation/markdown/wikilinks.tsx` | 144 | `renderTextWithWikilinks` and `transformChildren`. |
| `presentation/markdown/embeds.tsx` | 103 | `detectEmbed` and `MediaEmbed` for images, audio, video. |
| `presentation/markdown/callout.tsx` | 97 | `CALLOUT_REGEX`, `parseCalloutHeader`, `CalloutBox` — the `> [!kind]` carrier. |
| `presentation/KnowledgePanels.tsx` | 89 | `TagsPanel` and `BookmarksPanel`. |
| `presentation/outline-utils.ts` | 87 | `extractOutline` — headings to a nested entry list. |
| `presentation/UnlinkedMentions.tsx` | 82 | Panel listing mentions that are not yet links. |
| `presentation/Markdown.tsx` | 76 | The renderer itself, assembling the unified pipeline. |
| `presentation/Backlinks.tsx` | 74 | Backlinks panel. |
| `presentation/Outline.tsx` | 70 | Outline panel. |
| `presentation/frontmatter.ts` | 66 | `parseFrontmatter`, `stringifyFrontmatter`, `stringifyFrontmatterDoc` — the read path, distinct from the splice writer. |
| `presentation/wikilink.ts` | 64 | `resolveWikilink` and `stripWikilinkDecorations`. |
| `presentation/mermaid-block.tsx` | 56 | Lazy mermaid diagram block. |
| `presentation/RightPane.tsx` | 40 | The right pane container. |
| `presentation/markdown/image-src.ts` | 16 | `rewriteVaultImageSrc` — vault-relative image paths to the raw route. |

### `src/modules/repository/` (12 files, 1,399 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 39 | Barrel. |
| `domain/commit.ts` | 41 | `FileChange`, `Deletion`, `CommitRequest`, `CommitResult`, `CommitAuthor`, `ConflictError`. |
| `domain/merge3.ts` | 183 | `merge3` and its conflict markers — the three-way merge. |
| `application/ports.ts` | 30 | `RepositoryWriter` and `TreeItem`. |
| `application/commit-changes.ts` | 102 | `makeCommitChanges` — batch a set of edits into one commit. |
| `application/create-note.ts` | 50 | `makeCreateNote`. |
| `application/rename-note.ts` | 122 | `makeRenameNote`, including inbound wikilink rewriting. |
| `application/merge-note.ts` | 52 | `makeMergeNote`. |
| `application/upload-attachment.ts` | 64 | `makeUploadAttachment` and `formatTimestamp`. |
| `application/file-ops.ts` | 175 | `validateNotePath`, `rewriteWikilinks`, `defaultNoteContent`, and the `InvalidPathError`/`NoteExistsError` pair. |
| `infrastructure/github-writer.ts` | 188 | `githubWriter` — the `RepositoryWriter` over the GitHub contents and git APIs. |
| `presentation/CommitBar.tsx` | 353 | The commit bar: dirty files, message, push. |

### `src/modules/share/` (15 files, 1,215 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 8 | Barrel. |
| `domain/splice-frontmatter.ts` | 282 | `spliceFrontmatterValue`, `spliceFrontmatterKey`, `SAFE_KEY` — the byte-preserving frontmatter writer. This is the file NF-1 and NF-3 are about, and the only source file `specs/engine/splice-writer.md` governs. |
| `domain/slug.ts` | 261 | `validateSlug`, `suggestSlug`, `publicHref`, `RESERVED_SLUGS`, and the invalid/conflict error pair. |
| `application/ports.ts` | 18 | `ShareWriter` and `ShareSnapshotPort`. |
| `application/set-share.ts` | 45 | `makeSetShare` — publish a note under a slug. |
| `application/remove-share.ts` | 13 | `makeRemoveShare` — unpublish. |
| `application/list-conflicts.ts` | 31 | `makeListConflicts` — slug collisions across the vault. |
| `application/resolve-public-note.ts` | 70 | `makeResolvePublicNote` — slug to note, for the public page. |
| `infrastructure/share-writer.ts` | 36 | `makeShareWriter`. |
| `infrastructure/share-snapshot-port.ts` | 20 | `makeShareSnapshotPort`. |
| `presentation/ShareModal.tsx` | 151 | The share dialogue. |
| `presentation/DuplicateConflictModal.tsx` | 147 | Resolution UI when two notes want one slug. |
| `presentation/ShareMenu.tsx` | 55 | The share entry point in the toolbar. |
| `presentation/PublicNoteView.tsx` | 35 | What an unauthenticated visitor sees. |
| `presentation/use-share-conflicts.ts` | 46 | `useShareConflicts`. |
| `presentation/public-note.css` | — | Stylesheet for the public view; not TypeScript, not in the 226. |

### `src/modules/vault/` (30 files, 3,164 lines)

| File | Lines | One line |
|---|---|---|
| `index.ts` | 23 | Barrel. |
| `domain/note.ts` | 30 | `ParsedNote` and `LinkRef`. |
| `domain/link-index.ts` | 126 | `buildLinkIndex` and `setBasenameEntry` — the wikilink resolution index. |
| `application/ports.ts` | 40 | `VaultReader`, `NoteParserFn`, `VaultHistoryEntry`. |
| `application/dto.ts` | 72 | The wire shapes and their Zod schemas: `TreeNode`, `NoteMeta`, `VaultSnapshot`. |
| `application/get-snapshot.ts` | 248 | `makeGetSnapshot` and its `SnapshotCache` — the whole-vault read, and one of the two callers of `mdmax`'s `decodeStrict`. |
| `application/get-file.ts` | 65 | `makeGetFile`, with `InvalidPathError` and the re-exported `FileNotFoundError`. |
| `application/get-history.ts` | 21 | `makeGetNoteHistory`. |
| `application/get-version.ts` | 27 | `makeGetNoteVersion`. |
| `application/export-vault-zip.ts` | 70 | `makeExportVaultZip`. |
| `infrastructure/search-index.ts` | 345 | `buildSearchIndex`, `searchNotes`, `findUnlinkedMentions` over MiniSearch; the other caller of `decodeStrict`. |
| `infrastructure/markdown-parser.ts` | 186 | `parseMarkdown` — frontmatter, headings, links and tags out of a note. |
| `infrastructure/snapshot-cache.ts` | 40 | Per its own comment, a module-level LRU capped at 3 entries. |
| `infrastructure/vault-reader.ts` | 25 | `githubVaultReader` and `githubMergeReader`. |
| `presentation/SnapshotProvider.tsx` | 275 | The snapshot context and its three hooks — `useSnapshot`, `useSnapshotRefresh`, `useSnapshotMutate`. |
| `presentation/use-snapshot.ts` | 14 | The indirection module tests mock at the deep path; AGENTS.md §4 says keep it. |
| `presentation/FileTree.tsx` | 190 | The tree component and `dispatchVaultChanged`. |
| `presentation/file-tree/FileTreeActions.tsx` | 379 | Create, rename, move and delete, plus `openNewNoteDialog`. |
| `presentation/file-tree/TreeItem.tsx` | 324 | One row: selection, drag, context menu, and `moveNote`. |
| `presentation/file-tree/InlineDialog.tsx` | 136 | In-tree rename and create prompt. |
| `presentation/file-tree/ConfirmDialog.tsx` | 85 | Destructive-action confirmation. |
| `presentation/file-tree/ContextMenu.tsx` | 73 | The right-click menu. |
| `presentation/file-tree/Toast.tsx` | 24 | Transient notice. |
| `presentation/file-tree/types.ts` | 30 | The tree's shared interfaces, including the window-attached actions handle. |
| `presentation/file-tree/path-utils.ts` | 13 | `buildPath` and `folderOf`. |
| `presentation/TrashModal.tsx` | 142 | Deleted-note browser and restore. |
| `presentation/tree-insert.ts` | 54 | `insertNodeIntoTree`. |
| `presentation/tree-order.ts` | 38 | `orderTree` — folders first, then case-insensitive name. |
| `presentation/daily-notes.ts` | 24 | `dailyNotePath` and `dailyNoteTemplate`. |
| `presentation/template-vars.ts` | 45 | `substituteTemplateVars` over a `TemplateContext`. |

## 5. Files under `src/` that are not TypeScript

Twenty-two, none counted in the 226.

| File | What it is |
|---|---|
| `src/app/globals.css` | The global stylesheet. `docs/PRODUCT-BRIEF.md` §9 records that this is the sibling `sgnk-md` file rather than this product's design system; I did not re-verify that. |
| `src/app/icon.png` | The favicon Next serves from the app directory. |
| `src/modules/share/presentation/public-note.css` | Styles for the public note view. |
| `src/config/README.md`, `src/container/README.md`, `src/modules/README.md`, `src/shared/application/README.md`, `src/shared/domain/README.md`, `src/shared/infrastructure/README.md`, `src/shared/presentation/README.md` | Layer notes left by the scaffold. |
| `src/app/(public)/.gitkeep`, `src/app/(workspace)/.gitkeep`, `src/app/api/.gitkeep`, `src/config/.gitkeep`, `src/container/.gitkeep`, `src/modules/.gitkeep`, `src/shared/application/ports/.gitkeep`, `src/shared/domain/.gitkeep`, `src/shared/infrastructure/.gitkeep`, `src/shared/presentation/.gitkeep` | Directory placeholders. |
| `src/.DS_Store`, `src/modules/.DS_Store` | macOS artefacts, tracked by accident. |

## 6. Reproducing this page

```bash
find src -type d | sort                                   # the tree in §3
find src -name '*.ts' -o -name '*.tsx' | sort | wc -l      # 226
cat $(find src -name '*.ts' -o -name '*.tsx') | wc -l      # 25407
cat $(find src/modules/mdmax -name '*.ts') | wc -l         # 3614
find src/app/api -name 'route.ts' | wc -l                  # 26
for m in $(ls -d src/modules/*/ | xargs -n1 basename); do \
  echo "$m $(find src/modules/$m -name '*.ts' -o -name '*.tsx' | wc -l)"; done
grep -rn 'modules/mdmax' src --include='*.ts' --include='*.tsx' | grep -v '^src/modules/mdmax'
```

The last command is the one to re-run before anyone describes `mdmax` as wired. Today it returns
two lines.
