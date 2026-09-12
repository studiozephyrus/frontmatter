---
mdmax: 1
section: 7
title: "frontmatter the product: features, the gap, and what it needs on top of MDMAX"
slug: 07-product
lines: 880
words: 13401
forward_links: [0, 2, 3, 4, 5, 8, 9, 10, 14]
backlinks: [1, 2, 3, 8, 9, 11, 12, 13, 14]
prev: 06-conventions
next: 08-market
---

[← Index](README.md) · [← §6 Conventions](06-conventions.md) · [§8 Market →](08-market.md)

## 7. frontmatter the product: features, the gap, and what it needs on top of MDMAX

### 7.0 How to read this section

This section answers one question: **if MDMAX (the markdown capability layer specified elsewhere in this plan) were finished tomorrow, would frontmatter be a product?** The answer is no, and the reasons have nothing to do with markdown.

Everything below is verified against the source tree at `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/`, read directly during the authoring of this section on 2026-08-01, on branch `engine/plan-and-diagnostics`. Where a claim comes from research rather than from code, the research area key is named. Where two documents in this repository disagree, both are named and one is declared to govern.

**Tags used throughout, per the plan's evidence discipline:**

| tag | meaning |
|---|---|
| `[measured]` | a script or command was run and produced this number |
| `[primary]` | the source was read directly (a source file, an API discovery document, a vendor pricing page) |
| `[secondary]` | reported by another document that read the source |
| `[inference]` | reasoned from evidence, not observed |
| `[SIMULATED]` | replayed through code, not read from a live system |
| `[UNVERIFIED]` | stated in the record with no source I could reach |

**Three words are used precisely and are not interchangeable.** *DECIDED* means the founders have settled it and it is not reopened here. *RECOMMENDED* means this section proposes it and it needs a founder decision. *OPEN* means nobody has decided and the evidence does not settle it.

**The pinned corpus.** Every corpus figure in this section refers to `corpus_id sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4` — 1,084 markdown files, 25,548,765 bytes, pinned in `docs/engine/research/corpus-manifest.json`. Its three roots, read from the manifest `[measured]`:

```
root         head (12)      files    bytes
md           02c22ec47a3a     756   21,068,853
knowledge    464eb666946c     272    3,570,923
frontmatter  798ebbf3250a      56      908,989
                              ————   ——————————
                             1,084   25,548,765
```

Of those, 907 files carry YAML frontmatter. **A caveat the manifest does not yet carry:** the final-gate verifier found that 29 files (2.68% of 1,084) are byte-identical across roots by sha256, because `frontmatter/docs/*` is mirrored into `md/docs/*` (`FEATURE-GAP-REPORT.md`, `FRONTMATTER-PRODUCT-PLAN.md`, `adr/0001-…` and 26 more). Every percentage in this programme inherits that double-count. It does not change any conclusion here, but the manifest should carry a dedup note before the build phase treats these ratios as ground truth.

**What this section does NOT cover.** Engine internals (splice algorithm, anchor tiers, normalization) — those are the MDMAX sections. Go-to-market sequencing and channel strategy — that is the market section. Legal, entity, and tax structure — not addressed anywhere in this plan. Mobile *native* apps — out of scope for twelve months. And the AIOS track, which per D5 is separate.

---

### 7.1 What exists today, verified against `src/`

The repository is a Next.js 16 application, 21,415 lines of TypeScript and TSX across `src/` `[measured]`, with 83 test files under `test/` `[measured]`. It is a genuinely capable single-player markdown editor. It is also, structurally, a single-user application — and not by configuration. By construction.

#### 7.1.1 The four hard facts about identity

**Fact 1 — the allowlist is not a list.** `[measured]` `src/modules/auth/domain/allowlist.ts` is ten lines. Line 9 reads, verbatim:

```typescript
return login.trim().toLowerCase() === allowed.trim().toLowerCase();
```

The signature at line 5 is `export function isAllowed(login: string | undefined, allowed: string): boolean`. The second parameter is a **scalar string**, not an array. This is a single case-insensitive string equality. There is no data structure here that a second identity could be added to without changing the function's type.

Its only caller is `src/modules/auth/infrastructure/auth-options.ts:82`:

```typescript
return isAllowed(ghProfile?.login, authEnv.ALLOWED_GH_LOGIN);
```

And that environment variable has a hardcoded default naming a specific person — `src/config/env.ts:47` `[measured]`:

```typescript
ALLOWED_GH_LOGIN: z.string().min(1).default("sagnikmitra"),
```

`src/config/env.ts:252` synthesises a development-bypass actor from the same single string (`process.env["ALLOWED_GH_LOGIN"] ?? "dev"`). The domain type that carries the signed-in user, `src/modules/auth/domain/actor.ts`, holds `{login, name, avatarUrl}` — **no uid, no email, no organisation, no role** `[measured]`. There is nowhere in the type system for a second person to exist.

The second authentication provider does not change this. `auth-options.ts:32-66` defines a `Credentials` provider with id `sgnk-password` whose `authorize()` compares the submitted username against `process.env["SGNK_AUTH_USER"]` and the password against a scrypt hash in `SGNK_AUTH_HASH`. It is a password fallback for **the same one person**, and its comment says so at lines 76-77: *"only the configured SGNK_AUTH_USER can reach here."*

**Fact 2 — the author of every commit is a compile-time constant.** `[measured]` `src/container/dependency-container.ts:42`:

```typescript
const AUTHOR = { name: "Sagnik Mitra", email: "sagnikmitra123@gmail.com" } as const;
```

It is passed as `author: AUTHOR` into four use-case factories, at lines **66, 70, 75 and 80**:

| line | use-case | what it writes |
|---|---|---|
| 66 | `commitChanges` | every save of every document |
| 70 | `createNote` | every new document |
| 75 | `renameNote` | every rename, including the auto-relink pass |
| 80 | `uploadAttachment` | every pasted or dropped image |

Every byte this application has ever written to a git repository is attributed to one hardcoded name and one hardcoded email address. There is no code path that reads the signed-in actor and uses it for attribution. Multi-user attribution is not a missing feature; it is a missing *parameter*, and the parameter has been replaced by a literal.

**Fact 3 — there is no way to become a user.** `[measured]` `src/app/` contains 30 route files (4 pages, 26 API routes). The complete page list is:

```
src/app/(auth)/login/page.tsx
src/app/(public)/[slug]/page.tsx
src/app/(public)/p/[slug]/page.tsx
src/app/(vault)/page.tsx
```

`src/app/(workspace)/` contains one file: a zero-byte `.gitkeep`. `grep -ril 'signup\|sign-up\|register\|onboard' src/app` returns exactly one file, `layout.tsx`, and the match there is not a route. Across all of `src/`, the seven files that match those strings match them for unrelated reasons `[measured]`: `instrumentation.ts` exports Next.js's `register()` lifecycle hook; `PWARegister.tsx` calls `navigator.serviceWorker.register("/sw.js")`; `session.ts` has a comment about "the OAuth App's single registered callback URL"; and `src/modules/share/domain/slug.ts` lists `"signup"`, `"register"`, `"registration"`, `"onboarding"` in `RESERVED_SLUGS` — a blocklist of URLs that *must not* be taken by a published note, which is the strongest possible evidence that the routes do not exist, since the code is reserving the paths for a future that has not arrived.

**There is no signup route, no registration form, no invite flow, and no onboarding.** The only page a stranger can reach is `/login`, which will reject them.

**Fact 4 — the vault is one repository, reached by one server-side token.** `[measured]` `src/config/env.ts:85-87`:

```typescript
GITHUB_REPO_TOKEN: z.string().min(1),
GITHUB_REPO: z.string().min(1).default("sagnikmitra/md"),
GITHUB_BRANCH: z.string().min(1).default("main"),
```

One token, held by the server, with write access to one named repository. Not the user's token; not the user's repository. Even if a second person could log in, they would be reading and writing the founder's vault with the founder's credentials.

#### 7.1.2 `firestore.rules`: a specification nobody implemented

`firestore.rules` is 419 lines and 17,304 bytes `[measured]`. It is a careful, well-reasoned, genuinely multi-tenant data model. It declares, with real enforcement clauses and not merely in comments:

| collection | key fields | access model |
|---|---|---|
| `users/{uid}` | `email`, `providers`, `plan` (`free\|pro\|team`), `defaultVaultId`, `createdAt`, `lastSeenAt` | owner read/write; `plan` is server-owned after create; client may only ever write `'free'` (line 214) |
| `billing/{uid}` | `status`, `priceId`, `currentPeriodEnd`, `provider`, `customerId` | owner read, `allow write: if false` — Admin SDK only (line 230) |
| `usage/{uid}/months/{YYYY-MM}` | `aiTokens`, `noteCount`, `bytesUsed` | owner read, no client writes (line 243) |
| `vaults/{vaultId}` | `ownerUid`, `name`, `rev`, **`memberUids: list<string>` (≤100)**, **`roles: map<uid,"owner"\|"editor"\|"viewer">`** | members read; only the owner may change `memberUids`/`roles`/`ownerUid` (lines 284-289) |
| `vaults/{vaultId}/notes/{noteId}` | `path`, `pathLower`, `title`, `tags`, `outbound`, `backlinks`, `embeds`, `frontmatter`, `publicSlug`, `content` (≤900,000), `storagePath`, `deletedAt` | `canEditVault` gated (lines 329-338) |
| `vaults/…/notes/{noteId}/revisions/{revId}` | `noteId`, `content`, `authorUid`, `message`, `createdAt`, **`parentRev`** | members read, editors create, **`allow update: if false; allow delete: if false;`** (lines 360-361) — append-only, parent-linked |
| `shares/{slug}` | `vaultId`, `noteId`, `ownerUid`, `title`, `contentSnapshot`, `visibility` (`public\|unlisted`) | unauthenticated `get` for `visibility=='public'`; owner-only `list` (lines 393-397) |

Membership is resolved by real helper functions that read the parent vault document: `isVaultMember` (line 166), `vaultRole` (172), `canEditVault` (176), `isVaultOwner` (180).

**Two things about this file are decisive.**

First: `grep -io 'comments' firestore.rules | wc -l` returns **0** `[measured]`. The word does not appear anywhere in the file — not as a collection, not in a comment, not in the extensive data-model header. Neither does "suggestion". The one capability the entire product thesis rests on has no place to be stored.

Second: `grep -rn 'firestore()' src/ test/` returns **exactly one hit — the definition itself** `[measured]`, at `src/shared/infrastructure/firebase/client.ts:38`:

```typescript
export function firestore(): Firestore {
  return getFirestore(firebaseApp());
}
```

Zero callers. The only module in `src/` that imports from `firebase/client.ts` at all is `firebase-auth-gateway.ts`, and it imports `firebaseAuth`, not `firestore`.

**The conclusion, stated plainly.** `firestore.rules` is a promise about data that does not exist. It is a security specification for an application that was never written. Nothing in `src/` reads or writes a single one of those eight collections. The multi-tenant model is design work that has been done — which genuinely lowers the estimate for building it — and implementation work that has not started at all.

> **A contradiction in the record, named.** The final-gate `against` area argued the multi-tenancy floor "is not zero, because `firestore.rules` already implements vaults/roles/members/immutable revisions." The `product-gap` area (verdict **CONFIRMED**, `headline_verdicts`) argued there is exactly one user and a specified-but-unimplemented model. **`product-gap` governs.** A rules file is a declarative access-control policy evaluated by Google's servers against documents that are written by client code. There is no client code. The `against` area is right that the schema design is done; it is wrong that the floor is non-zero.

#### 7.1.3 Where the previously published claims were wrong

This plan replaces `docs/mdmax/PLAN.md` v2.0.0 and inherits research whose headline defect rate was severe: the 18-area capability run had **100% of headlines refuted by their own verifier, always in the flattering direction**; the 16-area final gate scored **5 CONFIRMED, 10 OVERSTATED, 1 REFUTED**. The following corrections apply to this section's subject matter and must not be re-propagated:

| claim as previously stated | corrected | source |
|---|---|---|
| "18.9% of a real Obsidian vault's frontmatter is invalid YAML" | 18.74% is the **whole-corpus** rate (170/907). The Obsidian vault (`md` root) is **13.75%** (91/662); the `knowledge` repo is **35.59%** (79/222); the `frontmatter` repo is **0**. Say which. | final-gate `product-gap` verification, `killed[2]` |
| "eemeli/yaml reaches 31.86% safe vs gray-matter's 3.64%" | Apples-to-apples: **22.38% vs 31.86%** under "file left untouched", or **3.64% vs 12.57% genuine + 18.74% silent refusals** under "published and byte-identical". A ~9-point gap was presented as ~28, by scoring eemeli's 170 refusals as successes and gray-matter's throws on **identically the same 170 files** as failures. The conclusion (splice is required, a library swap is not the fix) survives and is better supported by the corrected numbers. | final-gate `product-gap` verification, `killed[0]`, `killed[1]` |
| "Publish round-trips only 3.64% of the corpus" | 3.64% (33/907) is a **no-op write**. The actual publish-then-unpublish round trip is **33/907 parsed = 2.31%** (17/907 = **1.87%**). The original claim was conservative, not inflated — but any gate written against the round-trip operation must beat **1.87%**, not 3.64%. | final-gate `product-gap` verification, `new_defects[0]` |
| "171 files fail" (one failure mode) | **Two** failure modes. Exactly **170** files fail at `matter()` parse; exactly **one more**, `md/pj.md`, parses cleanly and throws at `matter.stringify`. A splice fixes the 170 by never parsing; it does not automatically fix the stringify class. | final-gate `product-gap` verification, `new_defects[2]` |
| "Docs v1 has 92 suggestion fields" | Reproduces under **none of eleven** counting rules the verifier tried. The nearest true figure is **197 suggestion-named property occurrences across 56 schemas**. The "35 suggestion-bearing schemas" figure is correct and is exactly the count of schemas whose **name** contains "Suggest", out of 170. | final-gate `product-gap` verification, `killed[3]` |
| "Drive v3 Comment has 13 fields, Reply has 10" | **14** Comment properties and **11** Reply properties. 13/10 is what you get after excluding `kind`, which is defensible but was not stated. | final-gate `product-gap` verification, `new_defects[5]` |
| "the `.doc` export is a false claim in a user-facing menu" | **Not a false claim.** `ExportMenu.tsx:158` labels it `"Export Word (.doc)"`, line 93 comments *"Word opens HTML-based .doc files natively; reuse the HTML renderer"*, line 95 sends `application/msword`, and that is a real, working Word import path that has shipped for two decades. A naming preference, not a defect. Drop it from any pre-flight list. | final-gate `product-gap` verification, `killed[6]` |
| "`isVaultEditor` helper in firestore.rules" | No such function. The helper at line 176 is **`canEditVault`**. | final-gate `product-gap` verification, `killed[4]` |
| "`package.json` has been gutted to 17 bytes; `npm run verify` cannot run" | **RESOLVED.** `[measured]` 2026-08-01: `package.json` is 3,076 bytes, `git status --short package.json` returns empty, and all 16 scripts plus 43 dependencies and 22 devDependencies are present. Fixed in commit `1bd4dad` per `docs/mdmax/PLAN.md` §9.10. Do not repeat this hazard as live. | own measurement, this session |

**Two figures nobody should quote without the caveat attached.** The **99.627% anchoring** figure has been re-derived by nobody, including every research area that cited it — it is a *block* figure and says nothing about the *range* anchoring that comments actually require. And **zero live model calls were made in any research run in this programme**; every "easier for AI" claim anywhere in the record is a prediction, not a result.

---

### 7.2 The full feature list, organised by the mockups

The mockups define four surfaces: a dashboard, an editor, a right rail, and an AI writing surface. Every row below is verified against code. Legend: **SHIPPED** = present and reachable; **PARTIAL** = present but materially incomplete against the mockup; **MISSING** = no code exists.

#### 7.2.1 The dashboard

The mockup shows a landing surface with search, a "blank document + templates" row, and a grid of recent documents.

| feature | status | verification |
|---|---|---|
| A dashboard route at all | **MISSING** | `[measured]` The only application page is `src/app/(vault)/page.tsx`, whose entire body is `return <AppShell />;`. `src/app/(workspace)/` contains only a zero-byte `.gitkeep`. There is no route that renders a document grid. |
| Search | **SHIPPED**, but as a palette not a dashboard | `[measured]` MiniSearch full-text search via `src/modules/vault/infrastructure/search-index.ts` + `/api/vault/search`, surfaced through `SearchPanel.tsx`, `CommandPalette.tsx` and `Spotlight.tsx`. Reached by keyboard, not by a landing page. |
| Blank document | **SHIPPED**, as a tree action | `[measured]` `FileTreeActions.tsx` listens for `sgnk:new-note` and opens an inline dialog. There is no "start a blank doc" card. |
| Templates | **PARTIAL** | `[measured]` `src/modules/vault/presentation/template-vars.ts` and `daily-notes.ts` exist; templates are wired to the daily-note path. `docs/FEATURE-GAP-REPORT.md` S4 lists templates as ⚠ "daily only". There is no template gallery. |
| Recents grid | **MISSING** | `[measured]` `grep -in 'template\|recent\|dashboard\|blank' src/modules/app-shell/presentation/AppShell.tsx` returns nothing. No recents model, no grid component, no thumbnail rendering. |

**A user arriving at frontmatter today lands directly in a three-pane editor with a file tree.** There is no "home". This is the single largest divergence between the mockups and the code, and it is the first screen — which makes it the first impression.

#### 7.2.2 The editor

| feature | status | verification |
|---|---|---|
| Four view modes — Live / Edit / Split / Read | **SHIPPED** | `[measured]` `src/modules/editor/presentation/editor-store.ts:21` — `export type EditorMode = "edit" \| "live" \| "reading" \| "split";`. Default is `"reading"` (line 90), persisted (line 237). Live mode is click-to-edit preview (`live/LivePreview.tsx`, `live/InlineBlockEditor.tsx`, `live/block-split.ts`), described in `FRONTMATTER-PRODUCT-PLAN.md` §3 as "Live mode v1 → harden to true Obsidian-style live preview" — so **PARTIAL** against the Obsidian bar, SHIPPED against the mockup's four-button control. |
| Project tree | **SHIPPED** | `[measured]` `src/modules/vault/presentation/FileTree.tsx` plus a nine-file `file-tree/` directory: `TreeItem.tsx`, `ContextMenu.tsx`, `InlineDialog.tsx`, `ConfirmDialog.tsx`, `FileTreeActions.tsx`, `Toast.tsx`, `path-utils.ts`, `types.ts`. Ordering in `tree-order.ts`, insertion in `tree-insert.ts`. |
| Per-project add-file and add-folder | **SHIPPED** | `[measured]` `FileTreeActions.tsx:68-69` binds `sgnk:new-note` and `sgnk:new-folder`; line 83 `newFolderIn: (folder) => …` scopes creation to a parent folder; line 153 renders `New folder in ${dialog.parentFolder}`. |
| **Multiple projects** | **MISSING** | `[measured]` There is exactly one vault: `GITHUB_REPO` defaults to `"sagnikmitra/md"` (`env.ts:86`), single-valued. `FEATURE-GAP-REPORT.md` K5 "Multiple vaults / repo switching" is listed ❌ with "(single repo)". The tree is per-*folder*, not per-*project*. |
| Document tabs | **SHIPPED** | `[measured]` `editor-store.ts:6` `export type Tab`, `:24` `tabs: Tab[]`, `:40-41` `openTab`/`closeTab`, with dirty tracking at `:144` and neighbour-selection on close at `:122-125`. |
| Two-note split | **SHIPPED** | `[measured]` `active-view.ts` tracks `{view, path}` so "toolbar/AI/find act on whichever pane" (comment, lines 5-6). Confirmed as the C7 follow-up in `FEATURE-GAP-REPORT.md`. |
| Formatting bar | **SHIPPED** — 12 controls | `[measured]` `Toolbar.tsx` defines: Bold (Mod+B), Italic (Mod+I), Strikethrough, Inline code (Mod+E), Heading 1, Heading 2, Bullet list, Task item, Blockquote, Code block, Link, Insert table. |
| Slash commands | **SHIPPED** | `[measured]` `src/modules/editor/presentation/slash-commands.ts` |
| Find and replace | **SHIPPED** | `[measured]` `@codemirror/search` wired at `CodeMirrorEditor.tsx:40, 206, 207, 231` |
| Vim keybindings | **SHIPPED** | `[measured]` `@replit/codemirror-vim ^6.3.0` in `package.json`, wired at `CodeMirrorEditor.tsx:41, 193` |
| Wikilinks, transclusion, callouts, tags, KaTeX, Mermaid, GFM tables, task toggles | **SHIPPED** | `[measured]` `remark-gfm`, `remark-math`, `rehype-katex`, `mermaid`, `katex` in `package.json`; `src/modules/preview/presentation/Markdown.tsx`, `EmbeddedNote.tsx`, `table-edit.ts`. 19 preview tests including `wikilink.test.ts`, `embeds.test.ts`, `callout.test.ts`, `html-policy-xss.test.ts`. |
| Autosave to draft | **SHIPPED** | `[measured]` `src/modules/drafts/infrastructure/draft-store.ts` (IndexedDB, `idb-keyval`), `test/drafts/draft-store.test.ts` |
| **Autosave to the durable artifact** | **MISSING — and this is the product-defining defect** | `[measured]` `src/modules/repository/presentation/CommitBar.tsx:74` `const [message, setMessage] = useState("")`; `:98` `const commitMessage = message.trim() \|\| defaultMessage;`; posting to `/api/commit`, whose Zod schema at `src/app/api/commit/route.ts:47` requires `message: z.string().min(1)`. **Saving is a manual git commit with a message box.** `FRONTMATTER-PRODUCT-PLAN.md` §2 lists "background auto-sync engine (B8 second half deferred)" under Missing/half-done. |
| Import | **PARTIAL** | `[measured]` `ImportModal.tsx:81` accepts `".md,.markdown,.txt,text/markdown,text/plain"` only. No Notion ZIP, no Evernote ENEX, no OneNote, no Apple Notes, no Google Keep. |
| Export | **SHIPPED** — 5 formats | `[measured]` `ExportMenu.tsx:156-160`: Download .md, Export HTML, Export Word (.doc), Open PDF (print), Download PDF. Plus whole-vault ZIP via `/api/export/vault` and `export-vault-zip.ts` (`fflate`). |
| Trash / soft delete | **SHIPPED** | `[measured]` `src/modules/vault/presentation/TrashModal.tsx`, `/api/vault/delete`, `/api/vault/restore` |
| PWA and desktop | **SHIPPED** | `[measured]` `PWARegister.tsx` + `src/app/manifest.ts` + `public/sw.js`; `src-tauri/` + `TauriBridge.tsx` + four `tauri:build:*` scripts in `package.json` |

#### 7.2.3 The right rail

The mockup shows a **tabbed** rail with seven slots: Document Outline, Tags and Bookmarks, Document History, Comment, Add File, Keyboard Shortcuts, AI Edit.

What is actually built is not a tabbed rail. `[measured]` `src/modules/preview/presentation/RightPane.tsx` is a single scrolling column of **five** `<section>` blocks, in this order: **Backlinks, Unlinked mentions, Outline, Bookmarks, Tags**. There is no tab bar, no slot for the other four items, and `grep -in 'comment' RightPane.tsx` returns nothing.

| mockup slot | status | verification |
|---|---|---|
| Document Outline | **SHIPPED** | `[measured]` `Outline.tsx` + `outline-utils.ts`, rendered as the third section of `RightPane.tsx`. `github-slugger` + `rehype-slug` for anchors. `test/preview/outline.test.ts`. |
| Tags and Bookmarks | **SHIPPED** | `[measured]` `KnowledgePanels.tsx` exports `TagsPanel` and `BookmarksPanel`; bookmark state in `src/modules/editor/presentation/bookmarks.ts`. Both are rail sections. |
| Document History | **SHIPPED as a modal, PARTIAL against the mockup** | `[measured]` `src/modules/editor/presentation/HistoryModal.tsx` lists commits from `/api/vault/history`, previews a version from `/api/vault/version`, and restores by committing the old content over HEAD with the live blob sha as `baseSha` for optimistic-concurrency safety. **It is not in the rail — it is a modal.** And `grep -cin 'diff' HistoryModal.tsx` returns **0**: there is no diff view anywhere in the product. Across all of `src/`, every `diff` hit is inside `merge3.ts::diffRegions`, used for three-way merge and never rendered. |
| **Comment** | **MISSING — no code, no storage, no schema** | `[measured]` No component, no module, no route. `firestore.rules` contains the string `comments` **zero** times. The one rail slot that requires a second human is the one with nothing behind it. |
| Add File | **SHIPPED, but in the tree** | `[measured]` `FileTreeActions.tsx` new-note / new-folder dialogs. Not a rail slot. |
| Keyboard Shortcuts | **MISSING** | `[measured]` `grep -rln 'Keyboard shortcuts\|shortcuts' src/modules/app-shell/presentation/` returns nothing; `SettingsModal.tsx` contains no `shortcut` or `hotkey` string. Hotkeys are bound in `use-hotkey.ts` but there is no surface that lists or remaps them. `FEATURE-GAP-REPORT.md` C12 lists this ❌. |
| AI Edit | **SHIPPED, as a floating menu** | `[measured]` `src/modules/editor/presentation/AIMenu.tsx` — actions `"refine" \| "summarize" \| "suggest-links"` (line 25) plus prompt presets *Refine selection / note*, *Expand*, *Shorten*, *Change tone: professional* (lines 248-251). Not a rail slot. |
| Backlinks (in code, not in the mockup) | **SHIPPED** | `[measured]` `Backlinks.tsx`, `UnlinkedMentions.tsx`, `link-index.ts` |

> **Negative worth stating.** Four of the mockup's five *content* rail slots are filled by features that work for exactly one person. The one slot that requires a second person is empty and its data model does not exist. Adding a sixth rail item before there is a second user is strictly negative work. (final-gate `product-gap`, NEGATIVE 4)

#### 7.2.4 The AI writing surface

| feature | status | verification |
|---|---|---|
| Multi-provider gateway | **SHIPPED** | `[measured]` `src/modules/ai/infrastructure/gateway-client.ts` + `provider-race.ts`; `package.json` carries `@ai-sdk/cerebras`, `@ai-sdk/google`, `@ai-sdk/groq`, `@ai-sdk/mistral`, `@openrouter/ai-sdk-provider`, `ai ^6.0.191`. `test/ai/provider-race.test.ts`. |
| Refine / expand / shorten / change tone | **SHIPPED** | `[measured]` `refine-text.ts` → `/api/ai/refine`; presets in `AIMenu.tsx:248-251` |
| Summarize | **SHIPPED** | `[measured]` `summarize.ts` → `/api/ai/summarize`; inserts a `> [!summary]` callout block (`AIMenu.tsx:192`) |
| Suggest links | **SHIPPED** | `[measured]` `suggest-links.ts` → `/api/ai/suggest-links`, `apply-wikilinks.ts` |
| Link doctor | **SHIPPED** | `[measured]` `link-doctor.ts` → `/api/ai/link-doctor`, `LinkDoctorModal.tsx` |
| Generate document | **SHIPPED** | `[measured]` `generate-document.ts` → `/api/ai/generate-doc`, `doc-prompts.ts` |
| Ghost-text inline completion | **SHIPPED** | `[measured]` `ghost-text.ts`, `ai-suggestion.ts`, `completions.ts` → `/api/ai/complete` |
| **Bring-your-own key** | **MISSING** | `[measured]` `grep` across `src/modules/ai/` finds no user-key path; all providers read server env. `FRONTMATTER-PRODUCT-PLAN.md` Pillar 6 lists BYO-AI ⬜. |
| **AI over the vault (RAG)** | **MISSING** | `[measured]` No embeddings, no vector store, no pgvector. `FEATURE-GAP-REPORT.md` G2 ❌, effort L. |

#### 7.2.5 One shipped feature that is actively harmful

`[measured]` The Publish write path corrupts the file format the company is named after.

`src/modules/share/infrastructure/share-writer.ts` lines 1-5 claim, verbatim, to be *"reading the current body via the vault reader, **splicing the key into the YAML frontmatter**, and committing through commitChanges."* Line 26 is:

```typescript
const next = matter.stringify(parsed.content, data);
```

That is a whole-document re-serialisation of the entire YAML map from a plain JavaScript object. It violates **D7 (splice-only)** in the one shipped write path, and the source comment would let a reviewer approve it.

Measured against the pinned corpus by replicating that exact code path, and independently reproduced by the final-gate verifier to the digit:

| measurement | value |
|---|---|
| files with frontmatter | 907 |
| **byte-identical after a no-op write** | **33 (3.64%)** |
| gray-matter throws (unpublishable → HTTP 502) | 171 = 170 parse failures + 1 stringify failure (`md/pj.md`) |
| bytes changed | 703 |
| **byte-identical after publish → unpublish** | **33/907 parsed = 2.31%; 17/907 = 1.87%** |
| **bare `YYYY-MM-DD` rewritten to ISO timestamp** | **624 of 736 parsed = 84.78%** |
| **`matter().data` unchanged after mangling** | **703 stable / 0 differ** |

That last row is the most decision-relevant number in this entire section. `title: 2026-05-26` becomes `title: 2026-05-26T00:00:00.000Z` — a visible title change in Obsidian, a broken Dataview filter, a broken Hugo or Jekyll build — and **every existing test that asserts on `matter().data` passes green while the bytes on disk are wrong.** The corruption is invisible to the test suite by construction.

Publish fires on every publish and every unpublish, through `setShare` → `POST /api/share`. `src/app/api/share/route.ts` returns `status: 502` with `error: "upstream_failure"` on any non-slug error, so the 171 files simply cannot be published.

> **What this is not.** It is not a library-choice problem. The repo already contains a comment-and-order-preserving path (`src/modules/preview/presentation/frontmatter.ts`, eemeli/yaml `parseDocument`, consumed by `PropertiesPanel.tsx:79`) and Publish does not use it — but ported to the same corpus it reaches only **12.57% genuine + 18.74% silent refusals published-and-byte-identical** (119/907), and it fails to parse **the same 170 files**. A swap is not the fix. A byte-range splice is.

> **UNVERIFIED, and it deserves a live check.** The 502 claim is a code-path trace, not an execution. Nobody has run the application against a live vault and confirmed that publishing one of the 171 files returns 502. Do that before quoting it externally.

#### 7.2.6 The test suite currently proves nothing

`[measured]` `npx vitest list --filesOnly` returns **247** files, of which **164 (66.40%)** are under `.claude/worktrees/` — two abandoned git worktrees (`competent-bassi-5da9a1`, `upbeat-euclid-60dbf4`) pinned at a pre-work commit — and 83 are the real suite under `test/`. `vitest.config.ts` declares **no `exclude` key at all** (verified: the file is 16 lines and sets only `environment`, `setupFiles` and a `@` alias), and vitest's default exclude covers `**/.{idea,git,cache,output,temp}/**`, which does not include `.claude`.

**Any "N tests pass" claim about this repository is currently meaningless.** The fix is one line in `vitest.config.ts` and the gate is `vitest list --filesOnly` moving 247 → 83.

---

### 7.3 The comparison matrix, organised by the review loop

Feature-by-feature comparison is the wrong frame. Every product in this table has an outline panel and a dark mode. **The only axis on which Google Docs wins, and wins so completely that people abandon markdown to reach it, is the review loop.** So the matrix is organised by that loop.

#### 7.3.1 The review loop, defined as six steps

A document goes out for review and comes back improved. Six things must happen. Each is a place a product can lose.

| # | step | the failure if it is missing |
|---|---|---|
| **R1** | **Get it in front of a reviewer** — a link, sent in a message | if this needs the reviewer to install software or clone a repo, the loop ends here |
| **R2** | **The reviewer gets in** — opens the link and can act | a login wall is the single highest-attrition step; Google explicitly engineered around it |
| **R3** | **The reviewer marks a specific passage** — an anchored comment, not "para 3 seems off" | without anchoring, review degrades to email, which is what markdown users actually do |
| **R4** | **The reviewer proposes exact wording** — a suggestion the author accepts or rejects with one click | without this, the author retypes every change by hand |
| **R5** | **Threads resolve and disappear** — resolve, reopen, assign, @mention | without resolution, a long document accretes stale commentary and review stops scaling |
| **R6** | **The artifact left behind is clean** — the file that ships carries no review residue | this is D2, and it is what every markdown-native attempt gets wrong by writing comments into the file |

#### 7.3.2 The matrix

Sourcing: rows marked `[primary]` were fetched and read directly during the final-gate research run on 2026-08-01 (`competitive-live`, verdict **CONFIRMED**; `product-gap`, verdict **CONFIRMED**). Rows marked `[secondary]` come from `docs/research/frontmatter-competitor-gapmap.md` (2026-07-12). Rows marked `[UNVERIFIED]` have no source in this record and **must be verified before this table appears in any external material.**

| product | R1 link | R2 no-login | R3 anchored comment | R4 suggestions | R5 resolve | R6 clean plain-.md artifact | price | source |
|---|---|---|---|---|---|---|---|---|
| **Google Docs** | yes | **yes** — "anonymous animals" | yes | yes, nested, per-text-run | yes — resolve, reopen, assign | **no** — proprietary; export "supports Markdown just enough to frustrate the life out of you" | free personal; Workspace ~$7–8.40/user/mo ⚠ | `[primary]` Drive v3 rev 20260728, Docs v1 rev 20260727, support.google.com/docs/answer/2494822; price `[secondary]` |
| **HackMD** | yes | partial | **yes** — in-line and page commenting, **free tier** | **yes** — "Suggest edit", **free tier** | yes | **no** — server-side doc pad; no vault, no offline; GitHub push capped 20/mo free | Free; Prime **$5/seat/mo billed annually** (~$8 monthly), 3-seat floor = $15/mo | `[primary]` hackmd.io/pricing, parsed at markup level: all four Collaboration rows are Check/Check/Check across Free/Prime/Enterprise |
| **Notion** | yes | no | yes | limited | yes | **no** — lossy export; relations→text, rollups/views vanish | Free; Plus $10/user/mo; Business $20; AI $10 per 1,000 credits | `[secondary]` gapmap, verified from official pricing page 2026-07-12 |
| **Obsidian** | shared vault only | **no** — every collaborator needs a paid Sync seat | **no** | **no** | **no** | **yes** — plain .md on disk, the category benchmark | core free; Sync **$4/user/mo annual, $5 monthly**; Publish $8/site/mo; **20-collaborator cap** | `[primary]` obsidian-help `Collaborate on a shared vault.md`, four verbatim quotes: *"Fine-grained permissions are not supported yet"* / *"You will not see the other user's cursor"* / *"maximum … is 20 users"* / *"All collaborators must have an active Sync subscription"* |
| **Moment.dev** (2026 entrant) | yes | no | **no** — `grep -ioE "comment\|suggest"` over homepage + docs + pricing returns **zero matches** | **no** | **no** | **yes** — *"Actual files, on actual disk"*, full history via Jujutsu and git | Free 1 user; **Team $30/mo up to 5 users, +$6/user** | `[primary]` moment.dev homepage, /docs, /pricing, fetched 2026-08-01 |
| **inkeep/open-knowledge** (2026 entrant) | n/a — local | n/a | **yes**, content-derived anchoring, orphan-rather-than-guess | no | partial | **yes** — sidecar, never committed | free, **GPL-3.0** | `[primary]` 3,239★, created 2026-06-03, pushed 2026-08-01, 14,790 npm dl/wk, HN 381 pts / 173 comments. `.changeset/comments-v1.md` verbatim: *"a comment here is a note to your own agent, **not a message to a teammate**."* Merged 2026-07-30; beta `0.46.0-beta.32` at 2026-08-01T02:38:33Z; **absent from stable 0.45.4** |
| **Craft** | yes | no | `[UNVERIFIED]` | `[UNVERIFIED]` | `[UNVERIFIED]` | **no** — blocks not files; lossy md round-trip | Free (1,500 blocks); Plus $10/mo or $96/yr; Team $60/mo | `[primary]` homepage contains **0 occurrences** of "markdown", "comment" or "collaborat"; pricing `[secondary]` gapmap |
| **Bear** | Pro-gated | no | no | no | no | pseudo-markdown; Apple-locked | Free; Pro $2.99/mo or $29.99/yr | `[primary]` homepage: 7 "markdown", **0 "comment"**, **0 "collaborat"**; pricing `[secondary]` |
| **Coda** | — | — | — | — | — | **absorbed** — banner reads verbatim *"Coda is now Superhuman Docs"* | — | `[primary]` coda.io fetched 2026-08-01 |
| **Confluence** | yes | no | yes | `[UNVERIFIED]` | yes | **no** — proprietary storage format | `[UNVERIFIED]` — the segment research says only *"Confluence per-seat pricing is the incumbent budget line (exact 2026 price unverified)"* | `[UNVERIFIED]` — **no primary source anywhere in this record. Do not publish this row without fetching atlassian.com/software/confluence/pricing.** |
| **Slite** | `[UNVERIFIED]` | `[UNVERIFIED]` | `[UNVERIFIED]` | `[UNVERIFIED]` | `[UNVERIFIED]` | `[UNVERIFIED]` | `[UNVERIFIED]` | **Slite does not appear anywhere in the research corpus, the 20-app competitor matrix, or any research area. This row is a hole. It must be researched before the matrix is used externally.** |
| **Almanac** | — | — | — | — | — | — | — | `[primary]` `curl -o /dev/null -w '%{http_code}' https://app.almanac.io` → **503** (2026-08-01); almanac.io redirects to get.almanac.io whose only internal link is `/go-forward` ("A letter from our CEO"). No login, no pricing, no product links. |
| **frontmatter (today)** | **read-only public URL only** | yes for reading | **no** | **no** | **no** | **yes** — but Publish rewrites frontmatter on 84.78% of parseable files | one user | `[measured]` `POST /api/share` schema is `{path, slug}` and nothing else |
| **frontmatter (the target)** | link + roles | **OPEN — D3** | yes, sidecar | yes, patch set | yes | yes, D2-gated | Free / $4 / $50-yr / $5–8-seat | this plan |

#### 7.3.3 What the matrix says

Read the R6 column against the R3–R5 columns and the shape falls out:

- **Everything with a real review loop stores your document in its own database.** Google Docs, HackMD, Notion, Confluence.
- **Everything that leaves you plain files has no review loop.** Obsidian states it plainly. Moment.dev has zero occurrences of the word. Bear and Craft have zero occurrences of the word on their homepages. OpenKnowledge built the anchoring machinery and then declined the teammate model **in writing**.

That intersection is the wedge, and it is genuinely empty. `[primary]`

> **Two corrections to the "unclaimed combination" story that this plan previously told.** (1) `docs/FRONTMATTER-PRODUCT-PLAN.md` whitespace combination 1 is *"Real-time collab + plain markdown files + git history"* and calls it unshipped. **It is shipped.** Moment.dev ships exactly that, priced. (2) The same document's Wedge B framing implies Obsidian has "zero multiplayer". Obsidian ships shared vaults with version history — worse than Docs (no cursors, no roles, 20-user cap, every collaborator pays $4/mo) but not zero. **Reprice the wedge around comments and suggestions, not around multiplayer.**

> **And the honest threat assessment.** OpenKnowledge is three months old, has the hard half built, and is one identity-and-sync layer away from the whole loop. If they ship a teammate model, or if Moment.dev adds comments, the intersection closes. Both are **three-month risks, not three-year risks.** Re-measure both quarterly via `api.github.com` stars and `pushed_at` and `api.npmjs.org` downloads — both are reachable by `curl` and both produced the figures above.

---

### 7.4 What Google Docs does that markdown tools structurally cannot — separated from what they merely have not built

This distinction matters more than any other in this section, because conflating the two produces a roadmap full of items that cannot be delivered, and a marketing page that will be called out.

The constraints that create the boundary are this plan's own decisions: **D6** (the file stays ordinary `.md`; no dialect needing its own parser), **D2** (comments and history live outside the file), and **D7** (splice-only writing; never regenerate from the AST).

#### 7.4.1 STRUCTURALLY CANNOT — the four real ones

**S1. Docs-equivalent suggestions. This one is provable from the API.**

`[primary]` The Google Docs API v1 discovery document (revision 20260727) has **35 schemas whose name contains "Suggest"** out of 170 total. `TextRun.suggestedInsertionIds` is documented verbatim: *"A TextRun may have multiple insertion IDs if it's a nested suggested change."* `suggestionsViewMode` is an enum with four values: `DEFAULT_FOR_CURRENT_ACCESS`, `SUGGESTIONS_INLINE`, `PREVIEW_SUGGESTIONS_ACCEPTED`, `PREVIEW_WITHOUT_SUGGESTIONS`.

Suggestions in Docs are **carried inside the document model, on every text run, and they nest.** A `.md` file has no per-run identity to hang an insertion ID on. Under D6 you cannot add one — that would be a dialect requiring its own parser, which is exactly what D6 forbids.

**What this costs, concretely:** nesting (a suggestion on top of a suggestion), per-character attribution inside a run, and the "preview with all suggestions accepted" view being free — in Docs the server just filters by view mode; in frontmatter you must apply the patch set to compute it.

**What you can build instead:** suggestions as an **out-of-band patch set** — base sha, hunks, author — rendered inline in the editor, accepted by splice. This is a real, shippable feature that solves the user's actual job.

**Say so publicly.** The honest framing is stronger than the imitation, and it is the difference between "we made a deliberate architectural trade so your file stays a file" and "their suggestions are broken".

**S2. A single character-address space that survives a view-mode switch.**

Docs has **one** document model. What you see and what is stored are the same object; an anchor is an offset into that object and cannot disambiguate wrongly.

Markdown editors have **two**: the body bytes and the rendered text. The mockups ship four view modes (Live / Edit / Split / Read), so this is a day-one problem, not a later refinement.

`[primary]` OpenKnowledge hit this and wrote it down, verbatim in `packages/core/src/comments/passage-match.ts`:

> *"A comment anchor is measured against a document's markdown BODY, but the editor only ever knows RENDERED text… Converting one side to the other is not reliable — serializing a partial ProseMirror selection fabricates the block marker of whatever block the selection happens to sit in, so a pick starting mid-bullet comes back as `- 3 tbsp peanut butter` when the source line reads `- **Peanut sauce:** 3 tbsp peanut butter`."*

Their fix is a third matcher with syntax-elastic matching plus a `LINK_TAIL` skip, because *"Missing this is why a passage containing any link could not be matched at all, which in a linked wiki is most of the interesting passages."* That code is **GPL-3.0 — readable as a design reference, not copyable into a proprietary SaaS.**

No npm package solves this. `@codemirror/collab` (latest 6.1.1, modified 2026-04-13) addresses operational transform, not content-derived anchoring.

**S3. Guaranteed anchor survival.**

In Docs, an anchor is an identifier the server owns and maintains through every edit. A content-derived anchor can orphan, and there is no construction that prevents it while D6 holds.

`[measured]` The capability-run `collab-primitives` area measured this on real revision pairs. **Use the verification, not the headline** — the headline ("2.70% → 0.09%, 30×") was killed by its own verifier as orphaned from the evidence and built on roughly two raw events (Wilson 95% CI [0.024%, 0.312%]), and the count "2,332 revision pairs" was a count of simulated selections reported as revision pairs; there were **400** revision pairs. The verifier's own independent replication:

| measurement | value |
|---|---|
| naive byte-offset anchor, correct after one real revision | **62.83%** (verifier) vs 65.31% (original), n=2,400 selections over 400 pairs |
| naive byte-offset anchor, **wrong or gone** | **37.17%** (verifier) vs 34.69% (original) |
| silent mis-anchoring, unscoped → block-scoped quote | **2.58% → 0.75% (3.44×)**, not 30× |
| refusal rate, unscoped → block-scoped | **11.79% → 22.88%** — the cost that doubles alongside the benefit |

**Design consequence, which is DECIDED:** fail **SAFE** to `orphaned`, never guess, and **ship the orphan rate as a visible product metric from the first comment written.** A product that silently moves a reviewer's comment to the wrong paragraph is worse than one that says "this passage changed".

**S4. Live cursors across four view modes.**

Docs has one view, so a cursor is one position. frontmatter has Live, Edit, Split and Read, which means a cursor in Edit has no single correct rendering in Read. This is strictly harder than Docs's problem, and it is the reason presence should ship as **avatars and per-document "who is here"** before it ships as character-level cursors. Obsidian, which has the same constraint, states plainly that it does not do cursors at all.

#### 7.4.2 MERELY HAVE NOT BUILT — no structural obstacle whatsoever

Every one of these is ordinary application engineering. None of them is blocked by D2, D6 or D7. Listing them separately is what makes the roadmap honest.

| # | capability | why there is no obstacle |
|---|---|---|
| M1 | **Anonymous access for readers and commenters** | `[primary]` Google's own mechanism, stated verbatim: *"People who aren't signed in to a Google Account show up as anonymous animals in your file."* Purely an auth-policy decision — this is **D3**, currently under review |
| M2 | **Roles on a share link (viewer / commenter / editor)** | `firestore.rules` **already specifies** `roles: map<uid,"owner"\|"editor"\|"viewer">` with enforcement at lines 284-289. The schema exists; the code does not |
| M3 | **Threaded comments with resolve, reopen, assignee** | `[primary]` Drive v3 `Comment` is **14 properties** and `Reply` is **11**. That is the entire data model — `anchor`, `quotedFileContent`, `resolved`, `assigneeEmailAddress`, `Reply.action` ∈ {`resolve`, `reopen`}. It is CRUD over a sidecar collection |
| M4 | **@mentions and notification** | address-book lookup plus an email send |
| M5 | **A diff view in Document History** | `[measured]` `/api/vault/history` and `/api/vault/version` already return the data; `HistoryModal.tsx` has **0 occurrences of "diff"**. The rendering is the missing piece, and `merge3.ts::diffRegions` already computes regions |
| M6 | **Autosave without a commit message** | debounce plus a default message. The engine (atomic Git Data commits, `baseSha` 409 optimistic concurrency, three-way merge with 14 conflict-matrix tests) is **done**; only the loop that calls it is deferred |
| M7 | **Suggestions as an accept/reject patch set** | base sha + hunks + author, applied by splice |
| M8 | **Presence avatars** | a heartbeat document and a listener |
| M9 | **Offline read/write with a queued outbox** | the PWA shell already exists (`PWARegister.tsx`, `public/sw.js`, `src/app/manifest.ts`) |
| M10 | **Mobile layout** | `[inference]` 13 Tailwind responsive prefixes across 74 `.tsx` files, 3 `@media` rules in `globals.css`, 1 in `public-note.css`; two real drawers at `VaultWorkspace.tsx:170` and `:199`. Tagged **inference** because a prefix count is a proxy for layout quality, not a measurement of it — **nobody has rendered this application at a mobile viewport** |
| M11 | **Per-user commit attribution** | delete a constant at `dependency-container.ts:42` and thread the actor through four call sites |
| M12 | **Importers (Notion ZIP, ENEX, OneNote, Keep, Apple Notes)** | `[measured]` `ImportModal.tsx:81` accepts `.md`/`.markdown`/`.txt` only |

**The line to hold:** frontmatter cannot promise Docs-identical suggestions, and should never claim to. Everything else in the review loop is buildable, and the reason none of it is built is not markdown. It is that there is one user.

---

### 7.5 What frontmatter needs on top of MDMAX

MDMAX is a markdown capability layer. Per `docs/mdmax/PLAN.md` §10.4 the settled answer is that it is **a ~600-line library inside `src/modules`, subordinate to the editor, deleted when the editor stops needing it** — not a compiler programme. Nothing in this subsection is engine work, and **nothing on the critical path to revenue requires MDMAX to exist as a compiler.** (final-gate synthesis, `product-market` lens, `dependencies`)

Each item below states what it is, why the engine does not give it, what it depends on, and whether it is DECIDED, RECOMMENDED or OPEN.

#### N1 — Identity and tenancy (the gate)

**Status: DECIDED (that it must ship). The design is RECOMMENDED below.**

Implement exactly the schema `firestore.rules` already specifies. No more.

```
users/{uid}
  email, displayName, photoURL, providers[], plan, defaultVaultId, createdAt, lastSeenAt

vaults/{vaultId}
  ownerUid, name, rev, memberUids: string[<=100], roles: map<uid,"owner"|"editor"|"viewer">,
  createdAt, updatedAt
```

Then delete the three things that make a second user impossible:

1. `src/modules/auth/domain/allowlist.ts` — the single string equality
2. `src/container/dependency-container.ts:42` — the `AUTHOR` constant, threading the signed-in actor through lines 66, 70, 75, 80 instead
3. `src/config/env.ts:85-87` — the single server-side `GITHUB_REPO_TOKEN` / `GITHUB_REPO`, replaced with a per-user GitHub App installation

**The exit test, committed RED first.** From the final-gate `product-market` synthesis, and this is the form that matters:

> *A second GitHub login who is not `sagnikmitra` opens a document they do not own, writes one character, and the commit carries **their** name and email.*

It cannot be satisfied by prose, and it cannot pass while the allowlist, the single token, or the `AUTHOR` constant survive. **Per plan rule P10, the unit of progress is this test going green — not a test, that test.**

**Why it will slip, stated so it does not.** It has zero engine content. It is uninteresting. The plan's own kill-condition K3 predicts it will keep losing priority to compiler work *precisely because* it is boring, and names that as **the single most likely way this programme fails.**

**Backend choice.** Firestore. `docs/mdmax/PLAN.md` §10.1 records the open decision — Firestore is in the code (`firebase ^12.16.0`) and in the mockups, while `docs/FRONTMATTER-PRODUCT-PLAN.md` says Supabase eleven times. **Recommendation stands: pick Firestore, correct the product plan.** OPEN until a founder says so.

#### N2 — Auth and the vault binding

**Status: PARTIAL today; RECOMMENDED design below.**

Today: NextAuth v5 with GitHub OAuth (scope `read:user`) plus a scrypt password fallback, JWT sessions. That much is real and works.

Missing: a **GitHub App installation** per user, so each vault is that user's repository reached by that user's grant. `docs/FRONTMATTER-PRODUCT-PLAN.md` Phase 1 item 2 already names this — *"invisible auth, no PATs"* — and the demand corpus is emphatic that hand-pasted personal access tokens are the first wall non-developers hit.

Also missing: **multi-vault switching** (`FEATURE-GAP-REPORT.md` K5, ❌, effort M).

**Negative:** a GitHub App installation flow is a real piece of work with a review step on GitHub's side and an unavoidable second consent screen. It is not two days. Budget it as its own deliverable, not as a sub-task of N1.

#### N3 — Share links with enforced roles

**Status: MISSING. Design RECOMMENDED. D3 is OPEN.**

`[measured]` Today the entire share surface is:

```typescript
// src/app/api/share/route.ts:21
const postSchema = z.object({ path: z.string().min(1), slug: z.string().min(1).max(60) });
```

No role. No expiry. No password. No per-user grant. `PublicNoteView.tsx` renders a read-only `<article>` with zero comment affordances.

What is needed: a `shares/{slug}` document (already specified in `firestore.rules`) extended with `role ∈ {viewer, commenter, editor}`, `expiresAt`, optional `passwordHash`, and `revokedAt`; plus a server-side gate that enforces the role on every read and write, not merely in the UI.

**The D3 question, and it is the product question.** D3 as written says reviewers must log in. `[primary]` Google's own share mechanism removes exactly that step: *"Anyone with the link: Anyone who has the link can use your file, without signing in to their Google Account."*

**RECOMMENDED: reopen D3 as a tier split, not a global rule.** Anonymous read-and-comment on a share link; login required to resolve a thread or to edit. This preserves the wedge and the account model at once. **Owner and editor seats bill; commenters do not.**

**And this must be tested before it is decided.** The measurement is five people, one week, one task: watch them try to get a comment from a non-technical colleague on a markdown document. The pre-registered prediction is that the blocker they hit first is the login wall, not anchoring and not fidelity. **If four of five stall at signup, D3 must be revisited at auth, not after** — the auth decision *is* the product decision.

> **Negative worth carrying:** anonymous commenting is an abuse surface. Rate limiting, a per-link comment cap, and a one-click "require sign-in" toggle for the owner are not optional extras; they ship with it.

#### N4 — The comment data model

**Status: MISSING ENTIRELY. `firestore.rules` names it zero times. Design RECOMMENDED.**

Copy Google's own split, because it is the split **D2** already chose.

```
vaults/{vaultId}/notes/{noteId}/comments/{commentId}
  # identity
  authorUid            string | null          # null = anonymous commenter (N3 tier split)
  authorLabel          string                 # display name, or the anonymous-animal label
  createdAt            timestamp
  updatedAt            timestamp

  # anchoring — a W3C TextQuoteSelector, a Recommendation since Feb 2017. Not an invention.
  anchor:
    quote              string                 # the exact selected text — the durable record
    prefix             string                 # context before, widened AT CREATE TIME until unique
    suffix             string                 # context after, same rule
    blockId            string                 # scoping unit; cuts silent mis-anchoring (see S3)
    baseRevision       string                 # the git sha the anchor was created against
  status               "anchored" | "orphaned"

  # thread
  resolved             bool
  resolvedBy           string | null
  assigneeEmail        string | null

vaults/{vaultId}/notes/{noteId}/comments/{commentId}/replies/{replyId}
  authorUid, authorLabel, body, createdAt
  action               "resolve" | "reopen" | null
```

`[primary]` This mirrors Drive v3 field-for-field where it matters: `Comment.anchor` (*"A region of the document represented as a JSON string"*), `Comment.quotedFileContent` (*"The file content to which the comment refers, typically within the anchor region"*), `Comment.resolved`, `Comment.assigneeEmailAddress`, and `Reply.action` ∈ {`resolve`, `reopen`}. Drive's `Comment` is 14 properties and `Reply` is 11 — the whole model is small.

**The D2 carrier gate, which is DECIDED and non-negotiable:**

> Delete the entire sidecar. `git status` is clean. Every file byte-identical.

Nothing about a comment is ever written into the `.md`. This is corroborated three ways: D2 by decision; Google by architecture; and `[primary]` OpenKnowledge, who arrived at the same place independently — comments in a machine-local JSON sidecar, never committed. It is corroborated a fourth way by a competitor's changelog: Obsidian tightened its **in-file** `%%…%%` comment syntax on 2026-07-30, and that syntax is Obsidian-only, its parsing rules are still changing seven years in, and it produces visible junk in every other renderer.

**The anchoring surface nobody has scoped, and it must be budgeted explicitly.** Because the mockups ship Live / Edit / Split / Read *and* a Comment rail, the body-offset-versus-rendered-offset problem (S2) is a day-one bug. Anchor offsets are stored against the markdown **body**; the Live and Read views need a syntax-elastic matcher that skips inline emphasis, code, strikethrough, link tails `](...)`, and line-leading block markers. **Fail SAFE to `orphaned`. Never guess.**

**One correctness gate that is easy to miss and is load-bearing.** `normalize()` must strip HTML comments before hashing a block, because the sentinel write would otherwise change the identity of the block it annotates. The plan's `normalize()` is currently "NFC + collapse whitespace + lowercase". `[measured]` HTML comments appear inside 0.27% of blocks (911 of 337,410 blocks over 5,916 `.md` files across both corpora) — small, but a 0.27% silent identity corruption is not acceptable in the anchoring layer. And per plan rule **P7**, freeze and version `normalize()` **before** persisting a single anchor; changing it afterwards invalidates every anchor ever written.

**Kill condition, restated from the final-gate `product-gap` area:** if the hand-audited **false-match** rate on ranges exceeds ~0.5%, content-derived anchoring cannot be the primary mechanism, and comments must fall back to visible orphaning with a quote-plus-digest. Hand-audit 200 cases. A false match is far worse than a refusal.

#### N5 — Suggestions as an out-of-band patch set

**Status: MISSING. Design RECOMMENDED. Bounded by S1 above.**

```
vaults/{vaultId}/notes/{noteId}/suggestions/{suggestionId}
  authorUid, authorLabel, createdAt
  baseSha              string     # the blob sha the suggestion was authored against
  hunks: [ { startByte, endByte, oldText, newText } ]
  state                "open" | "accepted" | "rejected" | "stale"
```

`"stale"` fires when `baseSha` no longer matches HEAD and a hunk no longer applies cleanly. Accepting a suggestion is a **splice** — locate the byte range, replace only those bytes — never an AST regeneration (**D7**).

**The permission boundary is the enforcement point, not the UI:** a suggest-role user has **no code path that writes file bytes**. Suggestions live entirely in the sidecar until an editor accepts one.

**CriticMarkup is interchange, not storage.** If exported, emit substitutions as adjacent `{--old--}{++new++}`.

**Negative:** suggestions are the second-hardest thing in this section and they are downstream of N1, N3 and N4. If the twelve months run short, this is the first thing to cut, and comments alone still constitute a product.

#### N6 — Presence

**Status: MISSING. RECOMMENDED as avatars first.**

`[measured]` `grep -rn 'yjs\|y-websocket\|automerge\|presence\|awareness' src/ package.json` returns **nothing**. There is no realtime layer of any kind.

Ship, in order: (1) "who is in this document" avatars from a heartbeat document; (2) per-document last-seen; (3) character-level cursors **not this cycle**, per S4.

**Architecture, DECIDED:** server-authoritative sequencing over the existing `merge3` + `baseSha` engine, with session-batched commits carrying `Co-authored-by`. The live layer is ephemeral; **the file remains the document.** No peer CRDT.

> **A correction to the record that must not be re-propagated.** `docs/mdmax/PLAN.md` §8 gave reasons for this architecture; §10.3 records that **both of its stated reasons are wrong** — one rests on a struck, `%`-commented line absent from the published paper. The decision survives; justify it on the Relay bug and on adoption (73 downloads/week versus 7.2M/week), and strike the other two. Note also that `docs/FRONTMATTER-PRODUCT-PLAN.md` still has three rows specifying Yjs, which now contradicts this. **`PLAN.md` §4b governs; the product plan's Yjs rows are stale and should be edited.**

#### N7 — Billing and metering

**Status: MISSING. Specified in rules only.**

`firestore.rules` already declares `billing/{uid}` (owner-read, `allow write: if false` — Admin SDK only) and `usage/{uid}/months/{YYYY-MM}` with `aiTokens`, `noteCount`, `bytesUsed`. Zero implementation.

Needed: a payment provider, a webhook that writes `billing` and flips `users/{uid}.plan` via the Admin SDK, seat counting that bills owners and editors but **not** commenters, and a metering path for whatever the pricing model actually meters — see §7.6, where that turns out to be an unresolved contradiction.

**Negative:** the `plan` field being server-owned is already correctly enforced (`firestore.rules:214` restricts client creates to `'free'`, `:219` makes `plan` immutable on client update). That is the paywall-bypass surface and it is already closed. Good design; still zero code.

#### N8 — Offline sync

**Status: PARTIAL (PWA shell only).**

The durability model, DECIDED from the round-2 tension resolutions: **the repository is the durability layer; origin storage is a rebuildable cache; unsynced work is bounded to an aggressively-flushed outbox; never depend on iOS background execution.** PWA storage eviction is normal — make it survivable rather than pretending it will not happen.

Conflict handling, DECIDED: auto-merge non-overlapping hunks silently; on true overlap keep local visible, journal the losing version, and show a non-modal "both versions kept" notice. A blocking hunk-picker is opt-in Power mode.

**Negative:** the demand corpus's number-one feature request is *"Always-visible sync status indicator (what synced, what is pending, when last synced)"* and it does not exist. `[measured]` No sync-status component exists in `src/`. The engine is done; the trust surface a user can *see* is not — and the corpus says the visible surface is what they are asking for.

#### N9 — Mobile layout

**Status: PARTIAL. Genuinely unmeasured.**

`[inference]` 13 Tailwind responsive prefixes across 74 `.tsx` files; 3 `@media` rules in `globals.css`, 1 in `public-note.css`; two real drawer patterns (`VaultWorkspace.tsx:170` and `:199`, `fixed inset-y-0 … lg:hidden` with translate transitions).

**This is a source grep, not a rendering test. Nobody has opened this application at a mobile viewport.** The first honest mobile action is not a build task — it is to open it on a phone and take screenshots.

#### N10 — Notifications

**Status: MISSING, and unnamed anywhere in the record.**

A review loop where the author never learns a comment arrived is not a review loop. Email on comment, on reply, on @mention, on suggestion. **OPEN** — it appears in no plan document, no research area, and no roadmap. Flagging it here is the first time.

#### N11 — Test-suite hygiene

**Status: one line, blocking everything.**

Add `.claude/worktrees` to `exclude` in `vitest.config.ts`. Gate: `vitest list --filesOnly` goes 247 → 83. Until this lands, no test result in this repository means anything, and no gate written against test results can be trusted.

#### N12 — Dependency summary

```
N11 (test hygiene) ──── independent, one line, do it first
N1  (identity) ──────── the gate
 ├── N2  (auth + vault binding)
 ├── N3  (share roles)   ── also needs D3 reopened
 │    └── N4 (comments)
 │         ├── N5 (suggestions)
 │         └── N10 (notifications)
 ├── N6  (presence)
 ├── N7  (billing)
 └── N11 unblocks the gates for all of the above

Independent of N1, run in parallel:
  the frontmatter splice writer (§7.2.5) — ~1 day, fixes a live corruption bug
  N8 (offline), N9 (mobile) — both improve the single-user product too
```

---

### 7.6 Pricing: the founder's sheet, the research recommendation, and three real conflicts

#### 7.6.1 The two models on the table

**The research recommendation.** `[primary]` `docs/mdmax/PLAN.md` v2.0.0 §4.3, verbatim:

| tier | what | price |
|---|---|---|
| Free | browser vault + git sync + publish | £0 — *"Free sync. It's just git."* Marginal cost ~0 |
| Pro | unlimited documents, live editing, **AI credits** | **$4/mo annual** — exact parity with Obsidian Sync Standard, inside the forum-stated $2–4 ceiling |
| Work | same, expensable | **$50/user/year**, mirroring Obsidian Commercial |
| Teams | the review loop, seats | **$5–8/seat/mo** — under HackMD Prime at $5, far under Notion Business at $20. Not this cycle |

with **"Owner and editor seats bill. Commenters do not."**

Anchors, all `[primary]` or verified from official pricing pages in the research: Obsidian Sync **$4/user/mo annual, $5 monthly** (cut from $8 in March 2024); Obsidian Publish **$8/site/mo**; HackMD Prime **$5/seat/mo billed annually (~$8 monthly), 3-seat floor = $15/mo**; Notion Plus $10/user/mo, Business $20; Moment.dev Team $30/mo for 5 users, +$6/user; forum thread t/26329 (58 posts, 13,451 views, 256 likes) names *"maybe $2-4/month"* as acceptable; segment research reports a **$2–6/mo willingness-to-pay band** for the beachhead and **$3–5/mo plus a one-time lifetime option (~$29–39)** for the creator segment.

**The founder's own sheet — Free / Pro / Max.** The founder's tier structure is Free, Pro and **Max**, and the Max tier's intent is on record verbatim `[primary]`, from `HANDOFF-mdmax-markdown-engine-2026-08-01.md` §14 line 416:

> *"our editor on the max plan should give features that is unseen in the industry."*

**A sourcing statement that must not be skipped.** The detailed contents of that sheet — a **five-document cap on Free**, **metered AI credits**, and **GitHub sync as a Max-tier feature** — are supplied by the brief for this section. **I searched the repository for them and did not find them.** `grep -rn -i '5 document\|five document\|max plan\|max tier\|AI credits'` across `docs/`, all `HANDOFF-*.md`, `polyg.yml`, `cx.html` and the research JSON returns no pricing sheet; `docs/mdmap/06-product/MAP.md` lists `[[pricing]]` with status **"planned"** and no content. **The founder's sheet is not in the written record.** Treat the three specifics below as founder-stated and **unsourced in this repository** — the first action is to get the sheet itself into `docs/` so it can be cited. That said, all three conflicts are provable from repository sources *on the other side*, which is what makes them worth resolving now.

#### 7.6.2 Conflict 1 — metered AI credits versus "never meter AI on your own keys"

**This one does not need the founder's sheet at all. It is a contradiction between two documents already in this repository.**

`[primary]` `docs/mdmax/PLAN.md` v2.0.0 §4.3 line 201 lists **"AI credits"** as a Pro-tier feature.

`[primary]` `docs/FRONTMATTER-PRODUCT-PLAN.md` §5 line 265, verbatim:

> **Never:** metered AI credits on your own keys, export paywalls, retention cliffs, per-workspace multiplication, surprise migrations.

And the same document's Pillar 6 specifies **BYO-AI**: *"user's own Claude/OpenAI key or subscription; MCP server over the vault — with NO enterprise paywall (Notion's exact sin)"*, tagged to pain theme T3 (price backlash / subscription fatigue, ranked **third of fourteen** by severity × frequency, and the theme with the demand corpus's most visceral quotes: *"Notion AI-metering rage"*, Evernote Trustpilot ~1.3/5 on hikes).

**They are not actually incompatible, and the reconciliation is one sentence — but it has to be written down.**

> **RECOMMENDED, needs a founder yes:** meter the AI **we** pay for; never meter the AI **you** pay for. Pro includes a bundled credit allowance against server-side inference on frontmatter's keys. A user who supplies their own key gets **unlimited, unmetered, on every paid tier, forever**, and that is a headline promise not a footnote.

**Why it matters more than it looks.** The demand corpus's third-ranked pain is priced betrayal, and metered AI is the exact mechanism users name. Getting this wrong does not lose a feature argument; it loses the trust position the whole free tier is built on. **Both documents must be edited to say the same thing.**

#### 7.6.3 Conflict 2 — the five-document free cap versus "unlimited on your own repo"

The founder's sheet caps Free at five documents. `[primary]` Three repository sources say the opposite:

- `docs/FRONTMATTER-PRODUCT-PLAN.md` §5: *"**Free forever:** full editor, **unlimited vaults on your own GitHub**, sync, version history, export, publish (fair-use), single-user. *Costs us ~nothing; it's their repo.*"*
- The same document, Pillar 8: *"**Free git-backed sync forever** (user's own repo = backend; **marginal cost ~0**) — undercuts every $4–10/mo sync add-on"*
- `docs/mdmax/PLAN.md` §4.3: Free = *"browser vault + git sync + publish"*, with `Pro` selling *"unlimited documents"* — which **implies a document cap on Free** and is the one place the two models nearly touch

**The economic argument against the cap is unusually strong.** A document cap only makes sense if documents cost money. On the free tier they do not — the bytes live in the user's own GitHub repository. The cap would be pure artificial scarcity on a marginal cost of approximately zero, applied to the exact audience (Obsidian power users with 5,000–20,000-note vaults) the segment research ranks as **beachhead #1**. `[primary]` That audience *"judges in the first minute on their own vault"*. A five-document ceiling does not merely fail to convert them — it makes the product unevaluable, because they cannot open their vault at all.

**The counter-argument, stated fairly.** A free tier with no ceiling has no natural upgrade trigger. Notion's block cap and Craft's 1,500-block cap exist for that reason.

> **RECOMMENDED, needs a founder yes:** no document cap. Gate on **capability**, not on **count**. Free is unlimited documents on your own repository, single-user, with publish under fair use. Pro buys collaboration, hosted convenience, server-side AI and priority sync. This is exactly the *"paid tier = genuinely costly things only"* line the product plan already commits to, and it preserves the acquisition hook — *"Free sync. It's just git"* — that the segment strategy identifies as the entire top of funnel.

#### 7.6.4 Conflict 3 — GitHub sync as a Max feature versus "your repo IS the vault"

The founder's sheet places GitHub sync in Max. `[primary]` The repository record places it in Free, three times over: `PLAN.md` §4.3 Free = *"browser vault + git sync"*; `PRODUCT-PLAN.md` Pillar 8 = *"Free git-backed sync forever"*; segment strategy line 128 = *"free tier = browser vault + git sync (that IS the acquisition hook — 'Free sync. It's just git')"*.

**And this conflict is deeper than pricing, because it collides with an architecture decision.** Today, GitHub is not a sync *feature* — it is the **storage substrate**. `[measured]` There is no other backend: `getSnapshot`, `getFile`, `getNoteHistory`, `getNoteVersion`, `exportVaultZip`, `commitChanges`, `createNote`, `renameNote`, `mergeNote`, `uploadAttachment` — every use-case in `dependency-container.ts` is wired to `githubVaultReader` or `githubWriter`. **Putting GitHub sync behind Max would mean the free tier has nowhere to store a document.** It would require building a second, hosted storage backend that does not exist, whose marginal cost is not zero, funded by the tier that pays nothing.

**There is a fourth conflict hiding underneath this one, and two research areas independently flagged that it is logged nowhere.**

- `docs/FRONTMATTER-PRODUCT-PLAN.md` line 171 sells *"user's own repo = backend"*.
- **D4** states the durable artifact is plain markdown and explicitly **not** *"your git repo is the backend"*.

> **RESOLUTION, RECOMMENDED and needing a founder yes this week** (from the final-gate `product-market` synthesis, contradiction 5): **keep D4 as the durability guarantee — what happens if frontmatter dies — and keep repo-as-backend as the free-tier economics.** They conflict only if you conflate the storage substrate with the escape hatch. **Write that distinction down.** It is the difference between a free tier whose marginal cost is zero and one that has to be funded.

#### 7.6.5 The reconciled model

**RECOMMENDED. Every row needs a founder yes. Nothing here is DECIDED.**

| tier | who | what | price | rationale |
|---|---|---|---|---|
| **Free** | one person, own repo | full editor, unlimited documents, git sync, version history, export, publish (fair use), BYO-AI key unmetered | **$0** | marginal cost ≈ 0; it is their repository. This is the acquisition hook and the whole top of funnel |
| **Pro** | one person | hosted convenience, mobile/offline polish, bundled server-side AI allowance, publish extras, priority sync | **$4/mo billed annually** | exact parity with Obsidian Sync Standard; inside the forum-stated $2–4 ceiling and the segment-measured $2–6 band |
| **Work** | one person, expensable | Pro, on a commercial licence | **$50/user/year** | mirrors Obsidian Commercial; aimed at the measured pain *"cannot install software on a work machine, can expense a licence"* |
| **Max** | one person | the founder's tier. **Contents OPEN** — see below | OPEN | the intent is on record; the contents are not |
| **Teams** | 2+ people | **the review loop** — share roles, comments, suggestions, presence | **$5–8/seat/mo. Owners and editors bill; commenters do not.** | under HackMD Prime ($5 annual / ~$8 monthly, 3-seat floor); far under Notion Business ($20). Not this cycle |

**On Max, stated plainly rather than papered over.** The founder's stated intent for Max is *"features that is unseen in the industry"*. `[measured]` The demand evidence does not support novelty as a purchase driver — see §7.7 — and the research recommendation has no Max tier at all, using **Work** to fill the same slot. This section does not resolve it. **It is OPEN, and it needs the founder's sheet in the repository before it can be resolved.** The one thing that should be settled now is negative: **Max must not be where GitHub sync or basic document count lives**, because those are the free tier's reason to exist.

> **The one pricing fact this plan cannot yet state, and should say so.** `[measured]` Across the entire research record — 92 pain points, 89 feature requests, 18 segment agents, 16 research areas, ~2.4M tokens — there are **zero user interviews and zero willingness-to-pay probes conducted by this team.** Every price above is an *anchor* to a competitor's published price, not a measurement of what anyone will pay frontmatter. **Five conversations would change that.** They are the cheapest, highest-value measurement available and nobody has had them.

---

### 7.7 What the founder wants that the evidence says users do not

This subsection exists because the plan is worthless if it only argues its own case. Each item is a founder-stated want, followed by the measurement that contradicts it.

#### 7.7.1 The mother-markdown container and the transclusion tree

**The want:** one mother markdown file connected to hundreds of markdowns, each connected to hundreds.

**The measurement,** on `corpus_id sha256:3a010b16…`, body-only, frontmatter entity arrays excluded `[measured]`:

| measurement | value |
|---|---|
| wikilinks in the corpus | **10,097** |
| resolving to no file in the corpus | **72.4%** |
| median out-degree | **0** |
| median in-degree | **0** |
| files with zero resolvable outbound links | **58.9% (638/1,084)** |
| files with zero backlinks | **54.6% (592/1,084)** |
| p90 out-degree | **5** |
| **`![[transclusion]]` occurrences across 1,084 files and 25.5 MB** | **45** |
| **of those 45, genuine content transclusions** | **ZERO** — all 45 are syntax documentation |
| size of the "mother file" if built | **24.4 MB** |

The structure does not exist in the founder's own vault, and the primitive it rests on is used forty-five times in twenty-five megabytes — all of them teaching the feature, none of them using it.

**The honest caveat:** this is one operator's vault, which is exactly the weakness the plan's own W1 flags. A second corpus (`~/.claude/skills-src`, 474 files, 5,013,124 bytes, a second author) would test it and **has not been run.** Treat this as strong for this vault and unproven in general.

**Verdict: this is the clearest founder-want with no user behind it.** The `founder-thesis` area's headline was **REFUTED** — its supporting statistic (37.2% of files already being hand-built bundles) turned out to be **92.3% a machine-generated YAML title-prepend** in the `md/Skills/**` sync tree; the honest figure is ~2.2% of files. Do not build the container.

#### 7.7.2 "Features unseen in the industry" on the Max tier

**The want,** verbatim `[primary]`: *"our editor on the max plan should give features that is unseen in the industry."*

**The measurement.** Two independent counts, over different denominators. **Both are reported because they disagree in scope, and the disagreement matters.**

Count A `[measured]` — over the **89 sourced feature requests** in `docs/research/frontmatter-raw-corpus.json`, counting only the `feature` and `why` fields (URL fields excluded, because Reddit permalinks inflate "comment"):

```
sync 62 · offline 18 · export 17 · collab 15 · pricing/subscription 14 · mobile 13
wysiwyg 7 · real-time 7 · suggest 5 · multiplayer 3 · presence 2 · vim 1 · graph 0
```

**Request #1 is:** *"Always-visible sync status indicator (what synced, what is pending, when last synced)."*

Count B `[measured]` — over **2,559 non-URL string leaves across both demand corpora**:

```
sync 358 · mobile 245 · realtime/collab 120 broad, 108 tight
unambiguous review-loop family (suggestion mode, suggested edit, track changes, annotate, redline) 25
conformance 11 · provenance 5
```

**They use different denominators and are not comparable row-to-row. Do not average them.** What they agree on is the shape: **the top of the list is table stakes, and nothing novel appears at the top.**

**The strongest single piece of evidence against novelty as a strategy** `[measured]`, re-verified live from `api.npmjs.org` during the final-gate run:

| package | design | downloads/week |
|---|---|---|
| `markdown-it-attrs` | degrades to **visible junk** in other renderers | **280,897** |
| `markdown-it-decorate` | **perfect silent invisibility**, unshipped since 2017 | **1,094** |

**A 257× adoption gap in favour of the objectively worse design.** Novelty is not what buys adoption in this category.

**Verdict:** the Max tier can exist, but it should be *depth* on things users named — offline that genuinely works on a plane, a 10k-note vault that opens in under a second, unmetered BYO-AI, a review loop nobody else has — not *novelty* for its own sake. **The one thing on the roadmap that is genuinely unseen in the industry is the review loop on files you own,** and it is unseen because it is hard, not because it is exotic.

#### 7.7.3 The graph view

**The want:** it is shipped, and it carries a runtime dependency.

**The measurement** `[measured]`: `react-force-graph-2d ^1.29.1` is in `package.json` (verified). `src/modules/graph/` and `GraphButton.tsx` are built. `FEATURE-GAP-REPORT.md` lists it under shipped "Rendering & knowledge".

And: across the **89 sourced feature requests the string "graph" appears 0 times**; across the 92 pain points it appears 3 times; in the round-2 corpus (`frontmatter-r2-raw-corpus.json`) the phrase **"graph view" appears 0 times**. Combined with a median node degree of 0, **the graph is decorative in this product.**

**Verdict:** it is already built, so deleting it is not urgent. But it should not receive another hour of work, and it should not appear in marketing.

#### 7.7.4 MDMAX as a compiler programme

**The want:** a compiler with a spec, a format profile, a versioned `normalize()`, a published benchmark, and a CLI.

**The measurement:** four of six proposed capabilities had **working substitutes executed and measured in a single session** — mdast `node.position.offset` splices byte-perfectly on 1,080/1,080 files; CodeMirror `ChangeSet.mapPos` is exact by construction and already a dependency; cross-revision anchoring is a ~30-line LCS diff at 85.0–86.7%; provenance is OKF v0.2 §5 fields, already specified by Google.

`docs/mdmax/PLAN.md` §10.4 already records the answer: **"No. It is a library subordinate to the editor."**

**Verdict:** settled. This is noted here only because §7.5's dependency graph depends on it — **nothing on the critical path to revenue requires MDMAX to exist as a compiler.**

#### 7.7.5 The uncomfortable summary

Ranked by severity × frequency, the demand corpus's fourteen pain themes put **markdown/frontmatter mangling at #13** and **publishing/sharing friction at #14**. MDMAX serves #13. The container serves nothing measurable. The graph serves nothing measurable.

`[primary]` The founders' own demand research, written before the engine programme started, ranked the wedges **A > C > B** and said of Wedge A (*"Your markdown vault, in any browser"*): *"Nearly sellable from the existing codebase once multi-tenancy lands."*

**Sixteen research areas and roughly 5 MB of evidence later, the nearly-sellable thing is still not sellable, for one reason: there is exactly one user.** That is not a research question. It never was.

> **The founder's own standard, quoted because it is what makes this subsection publishable** `[primary]`: *"I am absolutely fine with being proven wrong."*

---

### 7.8 What a user notices in the first ten minutes

This is the list ranked by what actually bites, not by build cost. Every item is verified against code.

**Minute 0 — they cannot get in.**
`[measured]` There is no signup route anywhere in `src/app`. `isAllowed()` compares their GitHub login to one string that defaults to `"sagnikmitra"`. **The product admits one person. This is not a soft launch problem; it is a total gate.**

**Minute 1 — there is no home.**
`[measured]` The only application page renders `<AppShell />` — a three-pane editor with a file tree. No dashboard, no recents, no templates gallery, no blank-document card. `src/app/(workspace)/` is an empty directory with a `.gitkeep`.

**Minute 2 — saving asks for a commit message.**
`[measured]` `CommitBar.tsx:74` holds a message input; `/api/commit` **requires** `message: z.string().min(1)`. **A Google Docs competitor with a commit-message field loses in the first sixty seconds.** Autosave exists — but only to an IndexedDB draft, not to the durable artifact.

**Minute 3 — sharing produces one read-only URL.**
`[measured]` `POST /api/share` accepts `{path, slug}`. No role, no expiry, no password, no per-user grant, **no comment box**. `PublicNoteView.tsx` renders a read-only `<article>` with zero comment affordances. Compare the thing they are switching from: *"Anyone with the link can use your file, without signing in."*

**Minute 4 — publishing silently rewrites their dates, or 502s.**
`[measured]` 84.78% of parseable files get a bare `YYYY-MM-DD` rewritten to an ISO timestamp on publish. 170 of 907 files cannot be published at all. For the beachhead segment — Obsidian power users who *"judge in the first minute on their own vault"* — **one mangled file is rejection**, and the app is named frontmatter.

**Minute 5 — Document History is a list of strings.**
`[measured]` `grep -cin 'diff' HistoryModal.tsx` = **0**. There is no diff view anywhere in the product. And because `share-writer.ts` generates its own commit messages, the history a user actually sees contains entries like `share: set public_slug=gear-up-issues on …`.

**Minute 6 — nothing tells them anyone else is there.**
`[measured]` No presence, no awareness, no cursors, no avatars, no realtime layer of any kind. `grep -rn 'yjs\|automerge\|presence\|awareness' src/ package.json` returns nothing.

**Minute 7 — they cannot comment.**
`[measured]` The Comment rail slot has no component, no route, and no backing collection. `firestore.rules` contains `comments` zero times. **This is the feature the entire pitch is built on.**

**Minute 8 — nothing syncs on its own, and nothing tells them what did.**
`[measured]` `docs/FRONTMATTER-PRODUCT-PLAN.md` §2 lists background auto-sync as deferred; sync today is manual buttons plus a local cron script. And the demand corpus's **#1 feature request** is the always-visible sync-status indicator, which does not exist.

**Minute 9 — the phone.**
`[inference]` 13 responsive prefixes across 74 components and two drawers. Nobody has rendered the application at a mobile viewport. This is unmeasured, not measured-and-fine.

**Minute 10 — import is `.md` only.**
`[measured]` `ImportModal.tsx:81` accepts `.md`, `.markdown`, `.txt`. A Notion or Evernote refugee has nothing to do here.

**Notice what is not on this list.** Not one of these ten is a markdown-engine problem. Two of them (publish corruption at minute 4, and the frontmatter half of minute 5) are fixed by the splice writer, which is roughly one day of work. The other eight are application engineering, and eight of the ten are downstream of one user table.

---

### 7.9 What would falsify this section, and what could go wrong

Per the plan's own standard: a section that only argues its own case is marketing.

#### 7.9.1 What this section does not cover

- **Go-to-market sequencing, channels, launch copy.** Named in the market section; deliberately absent here.
- **The engine's internals.** Splice algorithm, anchor tier design, `normalize()` specification, the certificate format. Those are the MDMAX sections.
- **Native mobile applications.** Out of scope for twelve months. PWA and browser only.
- **Enterprise concerns** — SSO, SCIM, audit logs, data residency, SOC 2. No research exists on any of them in this record.
- **Accessibility.** Not audited. Not measured. Not mentioned in any research area. **This is a genuine hole and someone should own it.**
- **Internationalisation of the product UI** (as distinct from Unicode handling in the engine). Zero coverage.
- **Legal and entity structure, terms of service, privacy policy, data-processing agreements.** Required before taking a paid signup; absent from this plan entirely.
- **Confluence and Slite in §7.3.2.** Both rows are `[UNVERIFIED]`. Slite appears nowhere in the corpus at all.

#### 7.9.2 What would falsify this section

| # | falsifier | how to run it | if it fires |
|---|---|---|---|
| **F1** | **The login wall is not the primary blocker.** This section asserts, following the research, that reviewers stall at signup before they stall at anchoring or fidelity. | Five people who have shared a markdown document for review in the last month. One task: get a comment from a non-technical colleague. Observe where they stall. | If they stall on something else, §7.5's ordering is wrong and D3 is not the urgent decision. |
| **F2** | **Nobody wants comments; they want multiplayer.** The demand record is genuinely contradictory here. | The same five conversations, plus a symmetric re-count on a corpus this team did not write. | If it fires, the review-loop wedge is defensibility-led with no demand behind it, and real-time collaboration should move up. |
| **F3** | **The splice cannot reach 907/907.** | Replay the full pinned corpus through publish-then-unpublish under an **independent oracle** — a byte comparator sharing no code with the writer (LR#60). Baseline to beat: **1.87%** (17/907), not 3.64%. **Restate the gate correctly:** publish→unpublish byte-identical on 907/907, AND publish succeeds (no 502) on all 171. "100% byte-identity on publish" is unsatisfiable, since inserting `public_slug` necessarily changes bytes. | If the splice cannot round-trip the 170 files no YAML parser reads, **strike "round-trip-sacred frontmatter" from every document.** The app is named frontmatter and the beachhead judges on it in the first minute. |
| **F4** | **Range anchoring false-matches above ~0.5%.** | Sample 2,000 character ranges stratified by length, by whether they contain inline emphasis / code / a link, and by whether they sit in a list item or heading. Mutate by one real git revision. Report correct / FALSE / refusal separately. **Hand-audit 200.** | Content-derived anchoring cannot be the primary mechanism; fall back to visible orphaning with quote-plus-digest. |
| **F5** | **The corpus is one person's vault.** Every corpus figure here — link topology, transclusion counts, frontmatter failure rates — comes from one operator's files plus this repository. | Run the identical measurements on the second corpus the plan already names: `~/.claude/skills-src`, 474 files, 5,013,124 bytes, a second author. **This has not been done.** | The graph negative (§7.7.1) is the finding most exposed. A second corpus could overturn it. |
| **F6** | **`.md` files are actually broken in Obsidian too.** §7.2.5 assumes the 170 unparseable files are valid for Obsidian and only invalid for standard YAML parsers. **Nobody launched Obsidian to check.** | Open three of the 170 in Obsidian. Confirm tags, aliases and frontmatter wikilinks render. | If Obsidian also fails, "Obsidian round-trip fidelity" needs restating — the vault is already partly broken and the fidelity promise is aimed at a standard nothing meets. |
| **F7** | **A competitor closes the intersection.** | Quarterly: `api.github.com` stars and `pushed_at` for `inkeep/open-knowledge`; `api.npmjs.org` weekly downloads; fetch moment.dev/pricing and `grep -ioE 'comment\|suggest'`; re-fetch hackmd.io/pricing. | If OpenKnowledge ships a teammate model — they already have `anchor.ts`, `passage-match.ts`, `comment-scrub.ts` and a shipped comment UI; only sync and identity are missing — or Moment.dev adds comments, **the last unclaimed intersection closes.** Three-month risks, not three-year. |

#### 7.9.3 How this section could be wrong even if every fact in it is right

**The verifiers are not oracles.** The measured false-kill rate on this programme's verifiers is **0–19%** (plan rule P4). A kill is strong evidence, not proof. Two kills in this section look right to me and I have re-derived both by hand from the underlying numbers — the eemeli-versus-gray-matter accounting asymmetry, and the 18.9%-denominator error. But I did not re-run either measurement.

**A gap analysis that outputs a longer build list makes things worse.** The final-gate `product-gap` area argued against its own premise, and the argument is sound: the biggest measurable defects are in things **already shipped**. Publish fires a destructive frontmatter rewrite on every note. Document History lists commits with no diff. The test suite reports 247 files of which 164 are abandoned worktrees. **The highest-value output of this section is a shorter list, not a longer one** — and §7.5 has twelve items in it, which is a risk this section carries knowingly. If only three ship, they should be **N11** (one line), **the splice writer** (one day), and **N1** (the second user).

**The document itself is a failure mode.** `docs/mdmax/PLAN.md` reached v0.6.0 with a changelog and a supersession chain, and three of four recent commits were cosmetic PDF fixes. **Honesty was being converted into inertia.** This section is long because the brief asked for completeness, and length is not the same as progress.

**The single hardest thing to argue with, restated so the twelve months have a spine:**

> **Research is closed. If a second login has not written a document by 31 August, this is a library and not a company, and we say so out loud.**


---

---

### Links

**This section references:** [§0 Status](00-status.md) · [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§5 Rendering](05-rendering.md) · [§8 Market](08-market.md) · [§9 AIOS](09-aios.md) · [§10 Engine spec](10-engine-spec.md) · [§14 Verification](14-verification.md)

**Referenced by:** [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§8 Market](08-market.md) · [§9 AIOS](09-aios.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
