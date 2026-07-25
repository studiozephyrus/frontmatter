# sgnk-md Batch 3 — Vault Read Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).

**Goal:** Read the private `md` vault live from GitHub behind a sha-cached snapshot, expose it through auth-gated API routes, and render the real folder tree in the left pane.

**Architecture:** A shared GitHub read client (fine-grained PAT in env) lives in `shared/infrastructure/github`. The `vault` module owns: domain (Note/LinkIndex types), application (VaultReader port + GetSnapshot/GetFile use-cases returning DTOs), infrastructure (zipball reader → unzip → markdown/link parser → snapshot builder + sha cache). Routes `/api/vault/snapshot` and `/api/vault/file` require an authenticated actor. The file tree is a client component fed by the snapshot DTO.

**Tech Stack:** `@octokit/rest` (or fetch) + `fflate` (unzip), zod, Next 16 route handlers. Reference: spec §6.

**Key constraints:** snapshot = ≤2 GitHub calls/load (HEAD sha + zipball), cached by HEAD sha. Link parser ignores `[[...]]` inside code fences/inline code; parses frontmatter `up`/`related` wikilinks; `_Archive/` indexed but flagged `excludeFromGraph`. All routes `requireActor`. Build must pass without `GITHUB_REPO_TOKEN` (lazy env). Gate green per task.

---

### Task VT1: repo-token env + GitHub read client (shared infra)

**Files:** Modify `src/config/env.ts`; Create `src/shared/infrastructure/github/client.ts`; Test `test/config/env.test.ts`.

- [ ] **Step 1 (TDD):** add `parseRepoEnv` test — requires `GITHUB_REPO_TOKEN` (min 1), `GITHUB_REPO` default `"sagnikmitra/md"`, `GITHUB_BRANCH` default `"main"`; throws when token missing.
- [ ] **Step 2:** run → fail.
- [ ] **Step 3:** implement `parseRepoEnv` + lazy `repoEnv` Proxy (mirror `authEnv`). Implement `src/shared/infrastructure/github/client.ts`: `githubFetch(path, init?)` helper that calls `https://api.github.com{path}` with `Authorization: Bearer ${repoEnv.GITHUB_REPO_TOKEN}` + `Accept` + `X-GitHub-Api-Version: 2022-11-28`, reading the token at CALL time (not module load). Export `getHeadSha()` → latest commit sha of the branch; `getZipball()` → ArrayBuffer of the repo zip at the branch.
- [ ] **Step 4:** run → pass. Gate. Commit `feat(sgnk-md): repo-token env + github read client`.

---

### Task VT2: markdown + link-index parser (domain/infra, TDD with fixtures)

**Files:** Create `src/modules/vault/domain/note.ts`, `src/modules/vault/domain/link-index.ts`, `src/modules/vault/infrastructure/markdown-parser.ts`; Test `test/vault/markdown-parser.test.ts`.

- [ ] **Step 1 (TDD):** fixtures covering: a note with frontmatter (`title`, `tags`, `up: "[[HQ]]"`, `related: ["[[A]]","[[B]]"]`), body `[[wikilink]]`, `[[link#heading]]`, `[[link|alias]]`, embed `![[Note]]`, inline `#tag`, AND a `[[ghost]]` inside a ```code fence``` + inline `` `[[x]]` `` that MUST be ignored. Assert the parser extracts: title, tags (frontmatter + inline, no code), outbound links (incl. frontmatter up/related, excl. code-fenced), embeds — and that the code-fenced `[[ghost]]` is NOT a link.
- [ ] **Step 2:** run → fail.
- [ ] **Step 3:** implement types (`Note`, `ParsedNote`, `LinkRef`, `LinkIndex`) + `parseMarkdown(path, raw): ParsedNote` (frontmatter via a tiny YAML parse or `gray-matter`; strip code fences/inline code before scanning `[[ ]]`/`#tags`; resolve wikilink target by basename). Add `buildLinkIndex(notes): LinkIndex` (outbound + backlinks; `_Archive/` → `excludeFromGraph: true`). Pure, no IO.
- [ ] **Step 4:** run → pass. Gate (arch: these are domain/infra-pure, no `process.env`). Commit `feat(sgnk-md): markdown + link-index parser`.

---

### Task VT3: snapshot builder + reader + GetSnapshot use-case + route

**Files:** Create `src/modules/vault/infrastructure/vault-reader.ts`, `src/modules/vault/infrastructure/snapshot-cache.ts`, `src/modules/vault/application/ports.ts`, `src/modules/vault/application/get-snapshot.ts`, `src/modules/vault/presentation/schemas.ts`, `src/app/api/vault/snapshot/route.ts`; install `fflate`; Test `test/vault/get-snapshot.test.ts`.

- [ ] **Step 1:** define `VaultReader` port (`getHeadSha()`, `getZipball()`) in `application/ports.ts`; `GetSnapshot` use-case `makeGetSnapshot({ reader, cache })` returning a `VaultSnapshot` DTO `{ sha, tree, notes: {path,title,tags,outbound,backlinks}[], generatedAt }`. **Unit test with a mocked reader + in-memory zip fixture** (use fflate `zipSync` to build a tiny zip of 2 md files in the test) asserting: cache miss builds + caches by sha; cache hit returns without re-fetching (spy the reader).
- [ ] **Step 2:** run → fail.
- [ ] **Step 3:** implement: `vault-reader.ts` (implements port over the github client from VT1); `snapshot-cache.ts` (module-level `Map<sha, snapshot>` LRU, size 3); `get-snapshot.ts` (HEAD sha → cache or zipball→unzip via fflate→filter `.md`→parseMarkdown each→buildLinkIndex→tree→DTO). `schemas.ts` DTO zod types. Route `/api/vault/snapshot/route.ts`: `requireActor()` then return the snapshot DTO as JSON (401 if no actor — but requireActor redirects; for an API use `getActor` and return 401 JSON if null).
- [ ] **Step 4:** run → pass. Gate. Commit `feat(sgnk-md): vault snapshot reader + /api/vault/snapshot`.

---

### Task VT4: GetFile use-case + /api/vault/file route

**Files:** Create `src/modules/vault/application/get-file.ts`, `src/app/api/vault/file/route.ts`; extend port; Test `test/vault/get-file.test.ts`.

- [ ] **Step 1 (TDD):** `GetFile` use-case `makeGetFile({ reader })` → given a path, returns `{ path, content, sha }` via the GitHub Contents API (fresh content + blob sha). Mock the reader; assert returns content+sha, and errors on missing path.
- [ ] **Step 2:** run → fail.
- [ ] **Step 3:** add `getFile(path)` to the port + `vault-reader` (Contents API: `GET /repos/{repo}/contents/{path}?ref={branch}`, decode base64). Implement use-case. Route `/api/vault/file/route.ts`: `getActor` gate → parse `?path=` (zod) → return `{path,content,sha}` or 404.
- [ ] **Step 4:** run → pass. Gate. Commit `feat(sgnk-md): vault single-file read + /api/vault/file`.

---

### Task VT5: file tree UI (left pane)

**Files:** Create `src/modules/vault/presentation/FileTree.tsx`, `src/modules/vault/presentation/use-snapshot.ts`, `src/modules/vault/index.ts`; Modify `src/modules/app-shell/presentation/AppShell.tsx`.

- [ ] **Step 1:** `use-snapshot.ts` client hook: fetch `/api/vault/snapshot` once, hold `{loading,error,snapshot}`. `FileTree.tsx` client component: render the tree DTO as collapsible folders + files (sorted, folders first; `_Archive` shown last/dimmed), selecting a file calls an `onOpen(path)` prop (logs/sets state for now — editor mounts in B4). Use theme tokens.
- [ ] **Step 2:** wire `FileTree` into `AppShell` left pane (replace the "File tree — Batch 3" placeholder). Keep it a client island; the shell stays a server component.
- [ ] **Step 3:** Manual verify with a real token (see VT6 local): `npm run dev`, sign in, confirm the real folder tree (Projects/Courses/Research/… + Home.md) renders in the left pane and `_Archive` appears dimmed. Confirm an unauthenticated `/api/vault/snapshot` returns 401.
- [ ] **Step 4:** Full `verify` green. Commit `feat(sgnk-md): vault file tree in left pane`.

---

### Task VT6: live cutover (PAT) + deploy

- [ ] **Step 1 (user):** create fine-grained PAT (Contents R/W on `sagnikmitra/md`), provide it.
- [ ] **Step 2 (controller):** set Vercel prod env `GITHUB_REPO_TOKEN` (+ `GITHUB_REPO=sagnikmitra/md`, `GITHUB_BRANCH=main` if not defaulted). For LOCAL integration testing, put the token in the worktree `.env.local` (gitignored) and confirm snapshot/tree work against the real private repo before deploy.
- [ ] **Step 3:** merge B3 → main → push → deploy. Verify on md.sgnk.ai: signed in, the real vault tree renders; `/api/vault/snapshot` returns 401 when logged out; a vault-only commit still skips the build (ignored-build-step).
- [ ] **Step 4:** mark B3 done in roadmap.

---

## Self-Review
- Spec §6 coverage: snapshot zipball+sha-cache (VT3), single-file fresh read (VT4), link-index rules incl. code-fence exclusion + frontmatter links + `_Archive` flag (VT2), auth-gated routes (VT3/VT4), file tree UI (VT5). ✅
- Build-without-secrets: lazy `repoEnv`; routes only run at request. ✅
- ≤2 calls/load: HEAD sha + zipball, sha-cached (VT3). ✅
- Type consistency: `VaultSnapshot`, `VaultReader`, `ParsedNote`, `LinkIndex`, `parseMarkdown`, `buildLinkIndex`, `makeGetSnapshot`, `makeGetFile`, `repoEnv` consistent across tasks. ✅
- Placeholders: none.

## Definition of done
`npm run verify` green; signed-in user sees the real vault folder tree from GitHub; snapshot is sha-cached (≤2 calls); `/api/vault/*` 401 without auth; deployed to md.sgnk.ai; vault-only commits still skip redeploy.
