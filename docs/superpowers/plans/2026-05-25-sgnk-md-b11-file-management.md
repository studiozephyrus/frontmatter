# sgnk-md Batch 11 — File Management (Create / Rename+Relink / Delete) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).
> **Browser-confirm gate** before "live". **Stable Zustand selectors only**. Reuse the existing GitHub writer + auth.

**Goal:** Create, rename (with **auto-relinking** of inbound `[[wikilinks]]`), and delete notes from the file tree — each as an atomic GitHub commit authored as the owner.

**Scope note:** Remaining pure-v2 items (image/attachment upload, daily notes + templates, server-side Chrome PDF, vault-wide zip export) are left as optional follow-ons.

**Architecture:** Reuse `repository` (the GitHub Git Data writer + `makeCommitChanges`). Add three auth-gated routes: `/api/vault/create`, `/api/vault/delete`, `/api/vault/rename`. Rename is server-side: read the zipball (sha-cached), rewrite inbound links across the vault, and commit (delete old + create new + update linkers) atomically. The file tree gets new/rename/delete actions; after an op the client refreshes the snapshot (full reload, like commit) so the tree/links update.

**Tech Stack:** existing writer/auth/github-client + fflate (unzip for rename scan). Reference: spec §9, §16 (v2).

---

### B11T1: file-ops use-cases + routes

**Files:** Create `src/modules/repository/application/file-ops.ts` (pure helpers), `src/modules/repository/application/rename-note.ts`, `src/app/api/vault/create/route.ts`, `src/app/api/vault/delete/route.ts`, `src/app/api/vault/rename/route.ts`; extend the writer/container as needed. Tests (pure + mocked).
- [ ] **Pure relink helper** `file-ops.ts`: `rewriteWikilinks(content: string, oldBasename: string, newBasename: string): { content: string; changed: boolean }` — rewrite `[[oldBasename]]`, `[[oldBasename|alias]]`, `[[oldBasename#h]]`, `![[oldBasename]]` (and the full-path variants) to use `newBasename`, preserving alias/heading; **skip occurrences inside fenced/inline code**; also handle frontmatter `up:`/`related:` wikilinks. Return whether anything changed. Unit-test thoroughly (basic, alias, heading, embed, code-fence-skip, no-match).
  - Also `validateNewPath(path)`: must end `.md`, no leading `/`, no `..`, non-empty segment(s). 
- [ ] **Create route** `/api/vault/create` (POST `{path, content?}`): `getActor` gate; validate path; via the writer: if `getBlobSha(path)` !== null → `409 {error:"exists"}`; else commit a new file (default content = a minimal frontmatter template `---\ntitle: <basename>\ntags: []\n---\n\n# <basename>\n` if no content) authored as owner. Return `{commitSha, path}`. Invalidate snapshot cache.
- [ ] **Delete route** `/api/vault/delete` (POST `{path, baseSha}`): `getActor` gate; commit a deletion (tree item sha:null) with baseSha conflict check (reuse commit-changes deletions). Return `{commitSha}`. Invalidate cache.
- [ ] **Rename use-case** `rename-note.ts`: `makeRenameNote({ reader, writer, author })` → given `{oldPath, newPath}`: read zipball (reader) → for each vault `.md`: if it's `oldPath` → schedule create `newPath` with its content (links inside it rewritten too) + delete `oldPath`; else `rewriteWikilinks(body, oldBase, newBase)` and if changed → schedule update. Build ONE commit (blobs/tree with creates+updates+the deletion) → return `{commitSha, relinkedCount}`. Conflict: base on current HEAD (server-read), no client baseSha. **Unit test with a mocked reader (in-memory zip)**: renaming `A.md`→`B.md` updates a note containing `[[A]]`→`[[B]]`, deletes A, creates B, leaves unrelated notes untouched; relinkedCount correct.
- [ ] **Rename route** `/api/vault/rename` (POST `{oldPath, newPath}`): `getActor` gate; validate both paths; call the use-case; return `{commitSha, relinkedCount}`; 409 if newPath exists; invalidate cache.
- [ ] Wire `container.createNote/deleteNote/renameNote`. Gate. Commit `feat(sgnk-md): file create/delete/rename(+relink) use-cases + routes`.

### B11T2: file tree CRUD UI

**Files:** Modify `src/modules/vault/presentation/FileTree.tsx` (+ small dialog components). 
- [ ] **New note:** a "＋" button at the top of the tree (and/or per-folder on hover) → a small inline prompt/dialog for the note name (+ target folder, default root or the folder context) → `POST /api/vault/create {path}` → on success refresh (reload) and open the new note. Validate the name client-side too.
- [ ] **Rename:** a per-file action (hover icon or right-click menu) → prompt for the new name (prefilled) → `POST /api/vault/rename {oldPath, newPath}` → on success show a brief "relinked N notes" + reload. Warn it rewrites inbound links.
- [ ] **Delete:** a per-file action → confirm dialog ("Delete <name>? This commits a deletion to GitHub.") → `POST /api/vault/delete {path, baseSha}` (baseSha from the snapshot/file) → on success close any open tab for it + reload.
- [ ] Keep it keyboard-accessible + themed; errors surfaced (409 exists, conflict, etc.). Stable selectors. (Operations reload the app like commit; that's acceptable and consistent.)
- [ ] RTL test: clicking New note with a name calls `fetch("/api/vault/create", ...)` with the right path (mock fetch); delete confirm calls the delete endpoint; no render-loop.
- [ ] Gate. Commit `feat(sgnk-md): file tree create/rename/delete actions`.

### B11T3: cutover + browser confirm

- [ ] Merge B11 → main → deploy. Controller verifies build/health + the three routes 401 logged-out.
- [ ] **Browser-confirm gate (required):** New note → it appears in the tree + opens; type + Commit → lands on GitHub. Rename a note that others link to → inbound `[[links]]` are rewritten (check a linker) + the file moved on GitHub. Delete a note → gone from tree + a deletion commit on GitHub.
- [ ] Mark B11 done in roadmap; cleanup worktree. (sgnk-md v1+v1.5+core-v2 complete.)

---

## Self-Review
- Spec §9 (create/rename/delete) + §16 rename auto-relinking → B11T1/B11T2. Other v2 (attachments, daily notes, server PDF, vault zip) explicitly deferred. ✅
- Atomic commits via the existing writer; rename rewrites inbound links server-side from the zipball. ✅
- Create guards against overwrite (409 exists); delete uses baseSha conflict; rename bases on HEAD. ✅
- Reuses auth + writer + cache-invalidation patterns; no new secrets. Stable selectors. ✅
- Type consistency: `rewriteWikilinks`, `validateNewPath`, `makeRenameNote`, `container.createNote/deleteNote/renameNote` consistent. ✅

## Definition of done
`npm run verify` green; browser-confirmed: create, rename (with inbound-link rewrite), and delete notes from the tree, each committing to GitHub; live on md.sgnk.ai.
