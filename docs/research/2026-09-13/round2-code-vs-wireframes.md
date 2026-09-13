# frontmatter vs md.sgnk.ai vs the two wireframes — 2026-09-13

## LAUNCHER screen

**MISSING entirely, in both repos.** There is no launcher/dashboard route. `frontmatter/src/app/(vault)/page.tsx:3-5` renders `<AppShell/>` which renders only `<VaultWorkspace/>` (`frontmatter/src/modules/app-shell/presentation/AppShell.tsx:1-5`) — the 3-pane editor workspace, straight away. `find src/app -name "page.tsx"` lists only `(auth)/login`, `(public)/[slug]`, `(public)/p/[slug]`, `(vault)/page.tsx` — no dashboard page. `(workspace)/.gitkeep` is empty, confirming it was scaffolded and never filled.

| Region | frontmatter | md | diverged? |
|---|---|---|---|
| Top bar (button/Search/2 buttons) | missing | missing | n/a |
| "Blank document/create" row | missing | missing | n/a |
| 4 template cards | missing (only `daily-notes.ts` date-template helper, unrelated) | missing | n/a |
| "Existing edits" recent-docs grid | missing — no recent-docs data model at all (`grep -rn recent src` hits only scroll-sync/get-history/ports, nothing UI) | missing | n/a |
| Status bar | missing | missing | n/a |

`grep -rln -i template src --include=*.tsx --include=*.ts` and `grep -rln -i "blank document\|new document"` both return no launcher-shaped hits.

## EDITOR screen

**Top bar** — exists, but shaped differently from the wireframe. Built in `frontmatter/src/app/(vault)/layout.tsx:16-106` (identical structure in md, though the file itself differs — see divergence table). Present: logo ("sg" + "frontmatter", lines 33-65), `SidebarToggle` (menu icon), `CommitBar` (`src/modules/repository/presentation/CommitBar.tsx`, 353 lines — commit/sync menu), `GraphButton`, `RightPaneCycle`, `ThemeToggle`, avatar + name (`layout.tsx:78-89`), Sign out. **Missing from the header itself**: a dedicated "Search" button (search lives as Cmd+K/Cmd+F via `KnowledgeUI.tsx` + `SearchPanel.tsx`, not a header icon) and "Share" (it's in the tab-bar controls cluster, not the app header — see below). Verdict: **partial**.

**Six coloured document tabs** — tabs exist (`EditorPane.tsx:918-959`, `.sgnk-tab` class) but **no colour coding**: `sed -n '344,406p' src/app/globals.css` shows only hover/active states via `--accent` underline, no per-tab hue. Verdict: **partial** (tabs: yes: colour: no).

**Left: file tree** — exists (`src/modules/vault/presentation/FileTree.tsx`, `file-tree/TreeItem.tsx`), with new-folder and new-note dialogs (`file-tree/FileTreeActions.tsx:22,64-72,151-182`; `FileTree.tsx:376-378` `+ New` header buttons). **No "projects" concept** — `grep -rn -i "\bproject\b" src/modules/vault` returns nothing; the tree is a single flat vault (one GitHub repo), so there is no "new-project" button and can't be, architecturally, until multi-vault/multi-repo is built. Verdict: **partial** (files/folders yes, projects no).

**Centre — mode switch** — exists and matches: Edit / Live / Reading / Split (`EditorPane.tsx:162-167,169-206`, `ModeToggle`). **Exists.**
**Formatting toolbar** — exists, `src/modules/editor/presentation/Toolbar.tsx`. **Exists.**
**Download/export button** — exists, `src/modules/export/presentation/ExportMenu.tsx`; PDF via `/api/export/pdf/[path]` (`export-doc.ts:18`) and raw `.md` download (`export-doc.ts:77`). **Exists.**
**AI writing box "like Google Docs/Claude/Gemini", bottom of document, only on load** — **not present as specified.** What exists is `SgnkAiButton.tsx` (`src/modules/ai-tools/presentation/SgnkAiButton.tsx:116-441`): a floating bottom-right circular trigger (fixed, `right:18,bottom:18`) that opens a Notion-AI-style popover panel, persistent across the whole session (not "only on load"), with preset chips (Summarize/Continue/Improve/Action items/Explain) plus five "Idea → doc" chips (PRD/FRD/BRD/product-note/spec, lines 77-83, 216-249). Verdict: **partial** — the AI-writing capability exists, but as a floating popover, not an inline bottom box, and it isn't load-only.

**Right rail** — `src/modules/preview/presentation/RightPane.tsx:11-40`: Backlinks, Unlinked mentions, Outline, Bookmarks, Tags, in that order. All five sections are **plain `<section>` blocks, not collapsible** (no `<details>`/accordion markup found). **Document history** is not a right-rail section — it's a modal (`HistoryModal`) triggered from a status-bar icon (`EditorPane.tsx:109-116,127`). **Comments** — no such feature exists anywhere (`grep -rln -i comment` hits only literal `//` code comments in unrelated files, e.g. `mdmax/domain/*.ts`, `share/infrastructure/share-writer.ts`). **"Add file" button in the right rail** — not found (`grep -rn "Add file"` empty). **Keyboard-shortcuts help panel** — not found (`grep -rln -i shortcut` hits only `TauriBridge.tsx`, native-menu wiring, not a help surface). **"AI edit" in the right rail** — the closest equivalent is the `AIMenu` dropdown in the tab-bar controls cluster (refine/summarize/suggest-links, `src/modules/editor/presentation/AIMenu.tsx:1-24`), not in the right rail. Verdict: **partial-to-missing** — outline and tags/bookmarks exist but not collapsible; history/comments/add-file/shortcuts/AI-edit are absent from this rail.

## md vs frontmatter divergence

Core editor/workspace files are **byte-identical**: `diff -q VaultWorkspace.tsx AppShell.tsx` → no output (identical) in both repos. Module directory lists under `src/modules/` are identical except frontmatter adds `ai-tools` and `mdmax` (md has neither). A full `diff -rq frontmatter/src md/src` found **27 differing files** and files present **only in frontmatter** (md has no counterparts):

- `src/container/client-container.ts`
- `src/modules/auth/application/*`, `src/modules/auth/domain/auth-user.ts`, `src/modules/auth/infrastructure/firebase-auth-gateway.ts`, `src/modules/auth/presentation/GoogleSignInButton.tsx`
- `src/modules/mdmax/` (whole module)
- `src/modules/share/domain/splice-frontmatter.ts`
- `src/shared/infrastructure/firebase/`

Differing-but-present-in-both (27 files) include `env.ts`, `dependency-container.ts`, `proxy.ts`, `(vault)/layout.tsx`, `robots.ts`/`sitemap.ts`/`manifest.ts`, `LoginScreen.tsx`, `CommitBar.tsx`, `PropertiesPanel.tsx`, `CodeMirrorEditor.tsx`, `PublicNoteView.tsx`, `share/domain/slug.ts`, `share/infrastructure/share-writer.ts`, `get-snapshot.ts`, `search-index.ts`, `graph-data.ts`, `LinkDoctorModal.tsx` — these are the branding/rename and per-app config edits, not the wireframe-relevant editor internals.

## Auth today

Single-user, allowlist-of-one, in code, not a real multi-tenant model:
- `src/modules/auth/domain/allowlist.ts:5-10` — `isAllowed` does a **string equality** (`login === allowed`, case-insensitive), not a membership check against a list.
- `src/config/env.ts:47` — `ALLOWED_GH_LOGIN: z.string().min(1).default("sagnikmitra")` — one login.
- `src/modules/auth/infrastructure/auth-options.ts:26-118` — two NextAuth providers: GitHub OAuth (gated by the allowlist, line 82) and a `sgnk-password` Credentials provider (line 32-66) gated on `SGNK_AUTH_USER`/`SGNK_AUTH_HASH` env vars — also single user, not a user table.
- Firebase/Google sign-in exists in code (`GoogleSignInButton.tsx`, `firebase-auth-gateway.ts`) but is **dead**: `LoginScreen.tsx` (the only screen actually rendered, `(vault)/layout.tsx:13`) imports `signIn` and `PasswordLoginForm` only — no `GoogleSignInButton` import (`grep -n GoogleSignInButton src/modules/auth/presentation/LoginScreen.tsx` → no match).

**What multi-user signup needs**: replace the equality-check allowlist with a real users table/collection; replace the single global `GITHUB_REPO_TOKEN`/`GITHUB_REPO` pair (below) with a per-user repo/token or a shared multi-tenant storage layer with per-user path scoping; wire an actual user record somewhere (Firestore is initialized but has zero reads/writes today — see below) to hold plan tier, storage location, and repo/GUID ownership.

## Storage today

- **GitHub repo as vault** — the vault's single source of truth. `src/config/env.ts:84-88`: `GITHUB_REPO_TOKEN` (one PAT), `GITHUB_REPO` defaulting to `"sagnikmitra/md"`, `GITHUB_BRANCH` defaulting to `"main"`. One repo for the whole app, not per-user.
- **Firestore** — initialized (`src/shared/infrastructure/firebase/client.ts:20-27`, `getFirestore(firebaseApp())`) but **zero collections are read or written anywhere in `src`**: `grep -rln "getFirestore\|setDoc(\|addDoc(\|updateDoc(\|collection("` across all of `src` returns only `client.ts` itself (the `getFirestore` init call, no actual document I/O). Firestore exists purely to back Firebase Auth's client SDK, which (see above) is itself unwired/dead.
- **IndexedDB** — real and used: `src/modules/drafts/infrastructure/draft-store.ts:10,17,82-146`, via `idb-keyval`, for local unsaved drafts (dirty-flag tracking, offline edits).
- **R2 / any object storage** — none found: `grep -rln -i "R2_\|S3Client\|@aws-sdk"` across `src` and `package.json` returns nothing.

## AI today

Five providers, chained with fallback, in `src/modules/ai/infrastructure/gateway-client.ts:31-104`: Google (Gemini, default `gemini-2.5-flash`), Groq (`llama-3.3-70b-versatile`), Cerebras (`llama-3.3-70b`), Mistral (`mistral-small-latest`), OpenRouter (`meta-llama/llama-3.3-70b-instruct:free`). Each provider only joins the chain if its own env-var API key is set (lines 34-54); if none are set, falls back to the Vercel AI Gateway (`AI_MODEL` env, line 69). Task-aware ordering: speed-first (Groq→Cerebras→Google→OpenRouter) for ghost-text, quality-first (Google→Groq→Cerebras→Mistral→OpenRouter) otherwise (lines 58-59, 76).

**Features wired to routes** (`src/app/api/ai/*`): `complete` (ghost-text autocomplete), `generate-doc` (single-kind PRD/FRD/BRD/product-note/spec generator, `src/modules/ai/application/generate-document.ts:21-28` + `doc-prompts.ts:16-42`), `link-doctor`, `refine`, `suggest-links`, `summarize`. `generate-doc` is exposed in the UI only as five chip buttons inside `SgnkAiButton`'s popover (`SgnkAiButton.tsx:77-83,218-249`) — **it is a single-shot, single-document generator, not the founder's described funnel** (no decision-question loop, no 00-29 numbered doc kit, no GUID storage, no kickoff-prompt output).

## Share / publish today

Public route is `/[slug]` (`src/app/(public)/[slug]/page.tsx:1-35`); the legacy `/p/[slug]` 301-redirects to it (`.../p/[slug]/page.tsx:1-16`). Storage: not a separate DB — a `public_slug:` frontmatter field written back into the note file in the GitHub repo (`src/modules/share/application/set-share.ts:1-41`, `deps.writer.writeSlug`). ISR-cached 60s (`revalidate = 60`). **Indexed**: `src/app/robots.ts:14-24` sets `allow: ["/", "/login"]`, `disallow: ["/api/","/_next/","/(vault)"]`, and `generateMetadata` sets `robots: { index: true, follow: true }` for every resolved slug (`[slug]/page.tsx:22-29`) — so a shared slug is crawlable/indexable by default (findable if linked from anywhere), not merely "unlisted" in the sense of blocked from indexing.

## Two known defects — confirmed / refuted

1. **`GITHUB_REPO` defaults to `"sagnikmitra/md"`** — **CONFIRMED**, `src/config/env.ts:86`: `GITHUB_REPO: z.string().min(1).default("sagnikmitra/md")`.
2. **Direct Firestore write inside `KnowledgeUI.tsx`** — **REFUTED / not found.** `src/modules/app-shell/presentation/KnowledgeUI.tsx` (130 lines) has no Firestore import and no `firestore`/`doc(`/`setDoc`/`addDoc`/`collection(` string anywhere in it. `git log --oneline -- src/modules/app-shell/presentation/KnowledgeUI.tsx` shows exactly one commit (`0c1b427`, the initial clone-from-md commit) — the file has never had a Firestore call in this repo's history. As the codebase stands today, **no file anywhere in `src` performs a Firestore write** (see Storage section) — the claim appears to be wrong-path, same failure class as LR#2.

## Tests and gates

Job's exact command (`find src -name "*.test.*" | wc -l`) returns **0 in both repos** — tests do not live under `src/`. Repo-wide (excluding `node_modules`, `.claude`): **frontmatter: 100** test files under `test/`; **md: 81**. Did not run `npm run verify`/`spec`/`corpus` per the read-only constraint — status not re-verified this session; treat any prior "green" claim in memory as unconfirmed by this pass.

## Smallest change list, MVP for ten strangers

1. **Build a LAUNCHER route** at `(vault)` root (move today's editor to `/edit` or similar) — top bar, blank-doc + 4 template cards, recent-docs grid. New files under `src/app/(launcher)/` + a new `src/modules/launcher/` (or extend `app-shell`); reads `snapshot.notes` from `src/modules/vault` for the recent-docs grid.
2. **Fix `GITHUB_REPO` default** — `src/config/env.ts:86` — drop the personal-account default or make it required with no default, so a new deploy can't silently write into `sagnikmitra/md`.
3. **Convert single-user allowlist to a real user model** — `src/modules/auth/domain/allowlist.ts`, `src/config/env.ts:44-48`, `src/modules/auth/infrastructure/auth-options.ts:73-83` — needed before "ten strangers" can each sign in.
4. **Give right-rail sections collapse state** — `src/modules/preview/presentation/RightPane.tsx:11-40` — wrap each `<section>` in a disclosure; add Document History and Comments sections (History already has a working modal — `HistoryModal` — just needs a rail entry point; Comments needs a new module).
5. **Remove or finish dead Firebase/Google auth code** — `src/modules/auth/presentation/GoogleSignInButton.tsx`, `src/modules/auth/infrastructure/firebase-auth-gateway.ts`, `src/shared/infrastructure/firebase/` — currently unreferenced from the live login flow; either wire it in or delete it so the auth story matches what's real.
6. **Add colour to document tabs** — `src/app/globals.css:344-406`, `src/modules/editor/presentation/EditorPane.tsx:918-959` — CSS-only change to match the wireframe's six-coloured-tabs look.
7. **Move Share/Search into the app header** — `src/app/(vault)/layout.tsx:16-106` (header) and `src/modules/editor/presentation/EditorPane.tsx:870-908` (where Share/AI/Export currently live) — relocate `ShareMenu` and expose a header Search trigger to match the wireframe's top-bar layout.
