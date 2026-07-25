# sgnk-md Batch 4 — Editor + Drafts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).

**Goal:** Click a note in the file tree → it opens in a tab with a CodeMirror markdown editor; edits autosave to the browser (IndexedDB) and survive reload/offline, with dirty indicators in tabs and tree. No commit yet (B6), no rendered preview yet (B5).

**Architecture:** A `drafts` module (client) wraps IndexedDB (content) + a localStorage dirty index. An `editor` module holds tab/open-note state (Zustand) and the CodeMirror component. Opening a note loads its committed content from `/api/vault/file` (B3) UNLESS a draft exists, in which case the draft wins. Edits debounce-save to drafts. The tree's `onOpen` opens/activates a tab.

**Tech Stack:** CodeMirror 6 (`@codemirror/state`,`view`,`commands`,`lang-markdown`), `idb-keyval`, `zustand`, `fake-indexeddb` (tests). Reference: spec §7.2, §8.1.

**Constraints:** all client-side; no new secrets; build stays green; arch total 0; drafts cleared only on successful commit (B6) — for now they persist. Gate per task.

---

### Task B4T1: drafts store (IndexedDB + localStorage dirty index)

**Files:** Create `src/modules/drafts/infrastructure/draft-store.ts`, `src/modules/drafts/index.ts`; Test `test/drafts/draft-store.test.ts`; install `idb-keyval`, `fake-indexeddb` (dev).

- [ ] **Step 1 (TDD):** test file begins with `// @vitest-environment jsdom` and imports `"fake-indexeddb/auto"`. Test the store API:
  - `saveDraft(path, { content, baseSha })` then `getDraft(path)` returns it; `listDirtyPaths()` includes path; `hasDraft(path)` true.
  - `deleteDraft(path)` removes from IDB and from the dirty index.
  - dirty index persists in `localStorage` (assert `localStorage.getItem("sgnk-md:dirty")` contains the path).
- [ ] **Step 2:** run → fail.
- [ ] **Step 3:** implement `draft-store.ts`: `Draft = { content: string; baseSha: string; updatedAt: number }`; use `idb-keyval` (`set/get/del`) with key `draft:<path>` in a named store; maintain a `localStorage` JSON array under `sgnk-md:dirty`. Export `saveDraft`, `getDraft`, `deleteDraft`, `hasDraft`, `listDirtyPaths`. Guard against SSR (no-op/empty when `typeof window === "undefined"`). Barrel exports from `index.ts`.
- [ ] **Step 4:** run → pass. Gate (`npm run typecheck && npm run lint && npm run test && npm run arch && npm run build`).
- [ ] **Step 5:** Commit `feat(sgnk-md): draft store (IndexedDB + localStorage dirty index)`.

---

### Task B4T2: editor/tabs state (Zustand)

**Files:** Create `src/modules/editor/presentation/editor-store.ts`; Test `test/editor/editor-store.test.ts`; install `zustand`.

- [ ] **Step 1 (TDD):** test the store (plain, no React): initial `{ tabs: [], activePath: null }`. `openTab(path)` adds a tab + sets active; opening an already-open path just activates it (no dup). `closeTab(path)` removes it and picks a sensible new active (neighbor or null). `setActive(path)`. `setDirty(path, boolean)` flips a per-tab dirty flag.
- [ ] **Step 2:** run → fail.
- [ ] **Step 3:** implement `editor-store.ts` with Zustand: `Tab = { path: string; title: string; dirty: boolean }`, actions `openTab`, `closeTab`, `setActive`, `setDirty`. Title = basename without `.md`. Pure store, testable outside React.
- [ ] **Step 4:** run → pass. Gate. Commit `feat(sgnk-md): editor tab state store`.

---

### Task B4T3: CodeMirror editor + file load + autosave

**Files:** Create `src/modules/editor/presentation/use-note-content.ts`, `src/modules/editor/presentation/CodeMirrorEditor.tsx`, `src/modules/editor/presentation/EditorPane.tsx`, `src/modules/editor/index.ts`; install CodeMirror 6 packages.

- [ ] **Step 1:** `use-note-content.ts` (client hook): given `path`, returns `{ loading, error, initialContent, baseSha }`. Logic: if `getDraft(path)` exists → use its content+baseSha (loading=false immediately); else `fetch("/api/vault/file?path=...")` → `{content, sha}` (sha = baseSha). Handle 401/404/errors (typed, no silent failure).
- [ ] **Step 2:** `CodeMirrorEditor.tsx` (`"use client"`): props `{ path, initialContent, baseSha }`. Mounts a CodeMirror 6 EditorView with `markdown()` + line wrapping + a minimal theme using CSS vars. On doc change (debounced ~400ms): `saveDraft(path, { content, baseSha })` and `editorStore.setDirty(path, true)`. Recreate state when `path` changes (one editor instance per active tab, or key by path). No SSR (guard mount in `useEffect`).
- [ ] **Step 3:** `EditorPane.tsx` (`"use client"`): reads `editorStore`; renders a **tab bar** (active highlight, dirty dot, close ✕) + the editor for the active tab via `use-note-content` + `CodeMirrorEditor`. Empty state when no tabs ("Select a note"). Theme tokens.
- [ ] **Step 4:** Export `EditorPane` + `editorStore` from `src/modules/editor/index.ts`.
- [ ] **Step 5:** Gate (build must pass; CM is client-only — ensure no SSR errors, e.g. dynamic import or `useEffect` mount). Commit `feat(sgnk-md): CodeMirror editor with file load + autosave drafts`.

---

### Task B4T4: wire tree → editor + dirty badges in shell

**Files:** Modify `src/modules/app-shell/presentation/AppShell.tsx`, `src/modules/vault/presentation/FileTree.tsx`.

- [ ] **Step 1:** AppShell center pane: render `<EditorPane />` (client island) instead of the "Editor mounts in Batch 4" placeholder. Keep left = FileTree, right = backlinks placeholder.
- [ ] **Step 2:** Wire FileTree `onOpen(path)` → `editorStore.openTab(path)`. Since both are client, FileTree can import `editorStore` directly (or AppShell passes a handler — prefer FileTree calling the store to keep AppShell a server component). If FileTree needs the store, make the wiring a small client wrapper.
- [ ] **Step 3:** Dirty badges: FileTree shows a dot next to files whose path is in `listDirtyPaths()` (subscribe/refresh on focus or via a small dirty-state hook). Tabs already show dirty dots from the store.
- [ ] **Step 4:** Manual verify (`npm run dev`, with `GITHUB_REPO_TOKEN` in `.env.local` for local read): sign in → click a note → it opens in a tab, content loads in CodeMirror → type → dirty dot appears on tab + tree → reload page → draft persists (content still there, dirty dot remains). Open a second note → second tab. Close a tab.
- [ ] **Step 5:** Full `verify` green. Commit `feat(sgnk-md): wire file tree to editor + dirty badges`.

---

### Task B4T5: cutover (merge + deploy + verify)

- [ ] **Step 1:** Merge B4 → main → push (deploys; `src/**` changed).
- [ ] **Step 2:** Verify on md.sgnk.ai (signed in): open a note → edits autosave → reload keeps the draft. Logged-out still redirects. Vault-only commit still skips build.
- [ ] **Step 3:** Mark B4 done in roadmap; remove worktree/branch.

---

## Self-Review
- Spec §7.2 (CodeMirror editor, tabs) → B4T2/B4T3/B4T4. §8.1 (IndexedDB drafts + localStorage dirty index, offline-persist) → B4T1/B4T3. ✅
- Draft-wins-over-committed on open (B4T3 use-note-content) preserves unsaved edits. ✅
- No commit/clear-draft yet (that's B6). ✅
- Type consistency: `Draft`, `saveDraft/getDraft/deleteDraft/hasDraft/listDirtyPaths`, `Tab`, `openTab/closeTab/setActive/setDirty`, `editorStore`, `EditorPane` consistent. ✅
- No new secrets; client-only; arch 0. ✅

## Definition of done
`npm run verify` green; signed-in user clicks a note → CodeMirror opens it in a tab → edits autosave to IndexedDB → reload persists the draft with a dirty indicator; multiple tabs; deployed to md.sgnk.ai.
