# sgnk-md Batch 6 — Write Path (Commit) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).
> **Browser-confirm gate:** before declaring live, controller/user must browser-smoke: edit → Commit → commit appears on GitHub → drafts cleared. (See `feedback_client-ui-verification`.)

**Goal:** A **Commit** button that pushes the browser's uncommitted drafts to GitHub as a single atomic commit (authored as the owner), with per-file conflict detection, then clears those drafts and refreshes the vault. This closes the core loop: edit in browser → GitHub → (local `git pull`).

**Architecture:** A `repository` module: application port `RepositoryWriter` + `CommitChanges` use-case; infrastructure adapter over the **GitHub Git Data API** (get ref → base tree → create blobs → create tree → create commit with explicit author → update ref). `/api/commit` (auth-gated) validates the payload, runs the use-case, returns the new sha or `409` on conflict. A `CommitBar` UI gathers dirty drafts, takes a message, commits, clears drafts on success, and refreshes the snapshot.

**Tech Stack:** GitHub Git Data REST API via the existing `githubFetch` client (uses `GITHUB_REPO_TOKEN`, Contents R/W). zod. Reference: spec §8.2, §9.

**Constraints:** commit author/committer = `Sagnik Mitra <sagnikmitra123@gmail.com>` (set explicitly so history shows the owner even though a PAT authenticates). Atomic (all-or-nothing). Conflict = `409` (no partial writes), draft preserved. Invalidate snapshot cache + client refresh after commit. No new secrets. Stable Zustand selectors. Gate per task.

---

### B6T1: commit planning + conflict logic (application, TDD)

**Files:** Create `src/modules/repository/application/ports.ts`, `src/modules/repository/application/commit-changes.ts`, `src/modules/repository/domain/commit.ts`; Test `test/repository/commit-changes.test.ts`.
- [ ] Define types in `domain/commit.ts`: `FileChange = { path: string; content: string; baseSha: string }`, `Deletion = { path: string; baseSha: string }`, `CommitRequest = { files: FileChange[]; deletions?: Deletion[]; message: string }`, `CommitResult = { commitSha: string }`, `ConflictError` (carries the diverged paths).
- [ ] Define `RepositoryWriter` port (`application/ports.ts`): `getHeadCommit(): Promise<{ commitSha: string; treeSha: string }>`; `getBlobSha(path: string): Promise<string | null>` (current sha of a file at HEAD, null if absent); `createBlob(content: string): Promise<string>`; `createTree(baseTreeSha, items): Promise<string>` where items = `{path, sha|null}` (null = delete); `createCommit(message, treeSha, parentSha, author): Promise<string>`; `updateRef(commitSha): Promise<void>`.
- [ ] `CommitChanges` use-case `makeCommitChanges({ writer, author })`: 
  1. `getHeadCommit()`.
  2. **Conflict check:** for each file/deletion, `getBlobSha(path)` and compare to `baseSha`; collect mismatches; if any → throw `ConflictError(divergedPaths)` (no writes).
  3. create blobs for files → tree items (`{path, sha}`); deletions → `{path, sha:null}`.
  4. `createTree(headTreeSha, items)` → `createCommit(message, newTree, headCommit, author)` → `updateRef(commitSha)`.
  5. return `{ commitSha }`.
- [ ] **Test (mocked writer):** happy path (2 files → blobs/tree/commit/ref called in order, returns sha); conflict (one file's current sha ≠ baseSha → throws ConflictError listing that path, NO createCommit called); deletion path (sha null in tree). Write tests first → fail → implement → pass.
- [ ] Gate. Commit `feat(sgnk-md): commit-changes use-case + conflict detection`.

### B6T2: GitHub Git Data adapter + /api/commit route

**Files:** Create `src/modules/repository/infrastructure/github-writer.ts`, `src/app/api/commit/route.ts`; extend `shared/infrastructure/github/client.ts` if needed; wire `container.commitChanges`. Test `test/repository/github-writer.test.ts` (mock `githubFetch`).
- [ ] `github-writer.ts` implements `RepositoryWriter` over Git Data API:
  - `getHeadCommit`: `GET /repos/{repo}/git/ref/heads/{branch}` → commit sha → `GET /git/commits/{sha}` → tree sha.
  - `getBlobSha(path)`: `GET /repos/{repo}/contents/{path}?ref={branch}` → `sha` (404 → null).
  - `createBlob`: `POST /git/blobs` `{content, encoding:"utf-8"}` → sha.
  - `createTree`: `POST /git/trees` `{base_tree, tree:[{path, mode:"100644", type:"blob", sha}|{path, sha:null}]}` → sha. (sha:null deletes.)
  - `createCommit`: `POST /git/commits` `{message, tree, parents:[parent], author, committer}` → sha.
  - `updateRef`: `PATCH /git/refs/heads/{branch}` `{sha, force:false}`.
  - Throw on non-2xx (typed). 
- [ ] `/api/commit/route.ts` (`export const dynamic = "force-dynamic"`): `POST` — `getActor()` → 401 if null; parse body with zod (`files:[{path,content,baseSha}]`, optional `deletions`, `message` non-empty); call `container.commitChanges(request)`; on success return `{ commitSha }`; on `ConflictError` → `409 { error:"conflict", paths }`; other → `502`. Author = `{ name:"Sagnik Mitra", email:"sagnikmitra123@gmail.com", date: new Date().toISOString() }` (wire in container).
- [ ] Invalidate snapshot cache after a successful commit (e.g., the route clears `snapshotCache` or the use-case takes a cache-invalidate callback) so the next snapshot rebuilds at the new HEAD.
- [ ] Wire `container.commitChanges = makeCommitChanges({ writer: githubWriter, author })`.
- [ ] Tests (mock githubFetch): writer calls the right endpoints; 409 maps correctly. Gate. Commit `feat(sgnk-md): github git-data writer + /api/commit`.

### B6T3: CommitBar UI

**Files:** Create `src/modules/repository/presentation/CommitBar.tsx`, `src/modules/repository/index.ts`; Modify the `(vault)` layout or AppShell top bar to include it; use `@/modules/drafts` (`listDirtyPaths`, `getDraft`, `deleteDraft`).
- [ ] `CommitBar` (`"use client"`): shows the uncommitted count (from `listDirtyPaths()`, reactive — refresh on the editor store dirty changes + on mount). A message input (default e.g. `"Update N notes from sgnk-md"`) + a **Commit** button (disabled when count 0 or in-flight).
- [ ] On Commit: gather each dirty path's draft (`getDraft` → `{content, baseSha}`) → `POST /api/commit {files, message}`. On 200: `deleteDraft(path)` for each committed path, `setDirty(path,false)` + clear from `contentByPath` baseline as needed, show a brief success, and **refresh the snapshot** (re-fetch `/api/vault/snapshot`). On 409: show which paths conflict + a "Reload latest" action (drafts preserved). On error: show message, keep drafts.
- [ ] Place CommitBar in the top bar (right of the user chip, or above the editor). Stable selectors.
- [ ] RTL test `test/repository/commit-bar.test.tsx`: renders with a seeded dirty draft; clicking Commit calls fetch with the right payload (mock fetch); on 200 clears the draft. Also asserts no render-loop.
- [ ] Gate. Commit `feat(sgnk-md): CommitBar — commit drafts to GitHub`.

### B6T4: cutover + browser confirm + local-sync note

- [ ] Merge B6 → main → deploy. Controller verifies build/health + `/api/commit` returns 401 logged-out.
- [ ] **Browser-confirm gate (required):** signed-in — edit a note (dirty dot) → CommitBar shows count 1 → enter a message → Commit → success; verify on GitHub that a new commit by "Sagnik Mitra" landed changing that file; the draft/dirty dot clears; reload shows the committed content (no stale draft). Try a conflict (optional) by editing the file on GitHub then committing → 409 surfaced.
- [ ] **Local sync note:** after a web commit, the Mac gets it via `git pull` — confirm `git -C /Users/sagnikmitra/Desktop/GitHub/md pull --rebase` brings the web commit down. (The automated scheduled routine is B10.)
- [ ] Mark B6 done in roadmap; cleanup worktree.

---

## Self-Review
- Spec §8.2 (atomic multi-file commit, baseSha 409 conflict, author override, cache invalidation) → B6T1/B6T2. §9 deletions supported (CRUD create/rename UI is a fast-follow). ✅
- Drafts cleared only on commit success (B6T3); conflict preserves drafts. ✅
- No new secrets (uses GITHUB_REPO_TOKEN Contents R/W). ✅
- Stable selectors + RTL test (B4 lesson). ✅
- Type consistency: `FileChange/Deletion/CommitRequest/CommitResult/ConflictError`, `RepositoryWriter`, `makeCommitChanges`, `container.commitChanges` consistent. ✅

## Definition of done
`npm run verify` green; browser-confirmed: edit → Commit → atomic commit authored as owner lands on GitHub, drafts clear, snapshot refreshes; conflict returns 409 with drafts intact; `git pull` brings it to the Mac. Live on md.sgnk.ai.
