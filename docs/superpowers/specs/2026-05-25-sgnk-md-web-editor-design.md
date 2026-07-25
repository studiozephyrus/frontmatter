# sgnk-md — Web Obsidian-style Editor with GitHub Sync

- **Date:** 2026-05-25
- **Status:** Approved design (combined v1 + v1.5 + v2)
- **Author:** Sagnik Mitra (with Claude)
- **Repo:** `sagnikmitra/md` (branch `main`) — Vercel project `md`
- **Domain:** `md.sgnk.ai`

---

## 1. Goal

A full Obsidian-style markdown app — **sgnk-md** — served at `md.sgnk.ai` from the existing `md` Next.js repo. It lets the owner browse, write, render, link, search, graph, and **export** the markdown vault that lives in this repo, edit it from any browser with drafts persisted locally, and **commit changes back to GitHub**. The local machine stays in sync via a scheduled Claude routine that pulls from GitHub.

**GitHub is the single source of truth.** The browser bridges to the local machine only through GitHub: web edits → GitHub commit → local `git pull`.

### Success criteria
- Open `md.sgnk.ai`, authenticate as the owner, see the full vault folder tree.
- Edit any note with a complete markdown authoring experience; drafts persist in the browser across reloads and offline.
- Commit one or many edited notes in a single atomic GitHub commit, authored as the owner.
- Rendered preview, wikilinks, backlinks, graph view, full-text + spotlight search, command palette, tabs, themes all work.
- Export any note to PDF (vector, selectable text), HTML, or raw `.md`.
- A scheduled routine pulls web commits to the local machine and surfaces conflicts.

### Non-goals (v2 boundary, see §16)
Real-time multi-user collaboration; a plugin ecosystem; mobile-native apps. (Attachments, vault-wide export, rename auto-relinking, daily notes/templates are **in scope but later batches** — see §16.)

---

## 2. Glossary

- **Vault** — the set of `.md` files in this repo (the notes restructured into `Projects/`, `Courses/`, `Research/`, `Markets/`, `Prompts/`, `Marketing & QA/`, plus `Home.md`). `_Archive/` is browsable but excluded from the graph.
- **Snapshot** — a server-built JSON of the whole vault (tree + per-note metadata + link index + search index), cached by HEAD commit sha.
- **Draft** — an uncommitted edit to a note, stored in the browser (IndexedDB) until committed.
- **Link index** — parsed graph of `[[wikilinks]]`, frontmatter link properties (`up`, `related`), embeds, and tags across all notes.
- **MOC** — Map of Content hub note (tagged `#moc`).

---

## 3. Architecture overview

```
Browser (Next.js client: sgnk-md)
  ├─ FileTree · Editor(CodeMirror) · Preview · Backlinks · Graph · Search · Spotlight · CommandPalette · Tabs
  ├─ Draft store: IndexedDB (content) + localStorage (dirty index) + offline commit queue
  └─ calls ↓ (same-origin API, owner session only)

Next.js server (Vercel functions)
  ├─ /api/auth/*        Auth.js (GitHub OAuth, allowlist)         identity only
  ├─ /api/vault/snapshot  zipball → extract .md → build indexes   sha-cached (~2 GH calls)
  ├─ /api/vault/file     fresh single-note content + blob sha     read-before-edit
  ├─ /api/commit         GitHub App → atomic Git Data commit      authored as owner
  └─ /print/[...path]    print-CSS render route for PDF

GitHub (source of truth: sagnikmitra/md @ main)
  ▲ web commits land here     ▼ local machine pulls here
Local machine
  └─ scheduled Claude routine: git pull --rebase --autostash (+ optional push), conflict-aware
```

**Why live GitHub API (Approach A):** instant reflection of edits (no redeploy wait), least lag, cleanest convergence with the local routine. Reads are batched via the snapshot to stay well under the 5000/hr authenticated rate limit.

---

## 4. Deployment & domain

- Same repo, same Vercel project `md`. The editor **replaces** the GVC hello-world `src/app/page.tsx`.
- Add custom domain `md.sgnk.ai` (Cloudflare CNAME → Vercel, GVC pattern). Keep any existing `md`/apex domain mapping intact.
- **Ignored Build Step (critical):** configure Vercel to skip the build when a commit touches only vault paths (`*.md`, `.obsidian/`, `docs/`) and rebuild only when app code (`src/**`, `package.json`, config) changes. Implementation: a `vercel.ts`/ignore-command that runs `git diff` against the previous deploy and exits 0 (skip) when no app paths changed. This prevents every note-save from redeploying the site.
- Node 24 runtime, Fluid Compute defaults.

---

## 5. Auth & security

- **Login:** GitHub OAuth via Auth.js (NextAuth v5), minimal scope (`read:user`). The `signIn` callback **rejects any login except `sagnikmitra`** (allowlist via env `ALLOWED_GH_LOGIN`).
- **Writes:** a **GitHub App** installed on the `md` repo only, permission `contents: read & write`. The server mints a short-lived installation token per commit request. Commits set `author`/`committer` explicitly to the owner (`Sagnik Mitra <sagnikmitra123@gmail.com>`), so history shows the owner even though the App token is used.
  - **Fallback** (simpler, if GitHub App setup is undesired): a single **fine-grained PAT** scoped to only `md` with Contents read/write, stored as a Vercel env var. Same author override.
- **Defense in depth:** allowlist enforced in `signIn` **and** re-checked in every API route. The GitHub token (App or PAT) **never** reaches the client. Auth.js CSRF protection on. All `/api/*` mutating routes require a valid owner session.
- **Secrets (Vercel env):** `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_SECRET`, `ALLOWED_GH_LOGIN`, and either (`GH_APP_ID`, `GH_APP_PRIVATE_KEY`, `GH_APP_INSTALLATION_ID`) or `GH_FINE_GRAINED_PAT`. Sourced per existing token conventions; never printed.
- "Sign in with Vercel" is intentionally **not** used — it cannot grant GitHub repo write.

---

## 6. Vault data layer (read)

### 6.1 Snapshot — `GET /api/vault/snapshot`
1. Resolve `main` HEAD sha (1 GH call).
2. If a cached snapshot exists for that sha, return it.
3. Else download the repo **zipball** for that sha (1 GH call), extract `.md` files server-side, then build:
   - **tree** (folders + files, with each file's blob sha),
   - **per-note metadata** (title, tags, frontmatter `up`/`related`, headings/outline),
   - **link index** (outbound links, backlinks, embeds, tag membership),
   - **search index** (MiniSearch serialized: path, title, tags, body tokens).
4. Cache the result keyed by HEAD sha (in-memory LRU per Fluid-Compute instance for warm starts; optionally persisted to **Vercel Blob** — note: Vercel KV is no longer offered). Invalidate on our own commits (§8).

Result: vault load = ~2 GitHub calls regardless of note count; graph/backlinks/search are instantly available.

### 6.2 Single file — `GET /api/vault/file?path=`
Returns the **current** raw markdown + blob sha for one note (1 GH call). Called when opening a note for editing to capture the freshest `baseSha` for conflict detection, even if the snapshot is slightly stale.

### 6.3 Link-index parsing rules
- Parse `[[wikilink]]`, `[[link#heading]]`, `[[link|alias]]`, embeds `![[note]]` / `![[note#heading]]`.
- Parse wikilinks inside **frontmatter** values (`up`, `related`) so MOC/hierarchy edges count.
- **Ignore** `[[...]]` inside fenced code blocks and inline code (fixes the mermaid `[[2,4,2]]` ghost-node case).
- Resolve targets by filename (Obsidian-style, path-independent); record unresolved links distinctly.
- Tags parsed from frontmatter `tags` and inline `#tag` (excluding code).
- `_Archive/` notes are indexed for browse/search but flagged `excludeFromGraph`.

---

## 7. Editor & authoring (full writer toolkit)

### 7.1 Shell layout
- **Left sidebar:** collapsible folder tree (dirty/uncommitted badges), tag pane, bookmarks/starred, recent files.
- **Center:** tabbed editor area with split-view support; each tab in one of three modes — **edit**, **reading**, **split (live preview)**.
- **Right sidebar:** backlinks panel + document outline.
- **Top bar:** vault name "sgnk-md", branch `main`, sync/online status, uncommitted count, **Commit** button, theme toggle, export menu.

### 7.2 Editor engine
CodeMirror 6 with `@codemirror/lang-markdown`: syntax highlighting, fold, multi-cursor, smart lists/indent.

### 7.3 Authoring features
- **Formatting toolbar + Obsidian keybindings:** bold (Cmd+B), italic (Cmd+I), strikethrough, highlight `==`, headings, ordered/unordered/task lists, blockquote, inline + fenced code, insert link/wikilink, insert table, hr.
- **Clickable task checkboxes** in preview (`- [ ]`/`- [x]`) toggle and write back to the note text.
- **Tables:** insert + a markdown table formatter; in-preview editable table UI (v1.5).
- **Callouts:** `> [!note] / [!warning] / [!tip] / [!info] …` rendered Obsidian-style.
- **Footnotes, math (KaTeX), mermaid diagrams, code highlighting, full GFM.**
- **Frontmatter/properties editor:** structured UI for `title`/`tags`/`up`/`related` with a raw-YAML toggle.
- **Wikilink + tag autocomplete:** typing `[[` or `#` opens a fuzzy suggest list from the link index (v1.5).
- **Embeds/transclusion:** `![[Note]]` / `![[Note#heading]]` inline-render the target (v1.5).
- **Editor niceties:** word/char count, reading time, outline, paste-as-markdown.

---

## 8. Draft storage & commit (write)

### 8.1 Drafts
- Note **content** drafts persist in **IndexedDB** (`idb-keyval`), keyed by path, each storing `{content, baseSha, updatedAt}`.
- A lightweight **dirty index** in `localStorage` lists which paths have drafts (fast UI badges without reading IndexedDB).
- Drafts autosave on edit (debounced), survive reload/offline, and are cleared **only** after their commit succeeds.
- **Offline queue:** if offline, "Commit" enqueues the batch; it flushes automatically when back online.

### 8.2 Commit — `POST /api/commit`
Payload: `{ files: [{path, content, baseSha}], message, deletions?: [{path, baseSha}] }`.
Server (owner session required) using the GitHub App/PAT token:
1. Get `main` ref → current commit → base tree.
2. **Conflict check:** for each file, if GitHub's current blob sha ≠ `baseSha`, abort with `409 conflict` listing the diverged paths (no partial writes).
3. Create blobs → create a new tree (additions + deletions) → create one commit (author/committer = owner, message) → fast-forward update `main`.
4. Invalidate the snapshot cache for the new HEAD.
Response: new commit sha + updated per-file shas. Client clears the committed drafts and refreshes state.

Atomic: one commit for the whole batch; either all changes land or none.

---

## 9. File CRUD

- **Create** note/folder, **rename/move**, **delete** — all expressed as additions/deletions in a single commit via the Git Data tree API.
- **Rename caveat (honest):** v1 renames the file but does **not** auto-rewrite inbound `[[wikilinks]]`; instead it shows a "references to update" list from the link index. **Auto-relink on rename** is a v2 batch.

---

## 10. Rendering pipeline

`react-markdown` + `remark-gfm` + custom `remark-wikilink` (clickable internal nav, unresolved styling) + `remark-callouts` + `rehype-katex` (math) + code highlighting (Shiki with the language set actually present, or `highlight.js` if bundle pressure) + **mermaid** (client-only). Heavy renderers (mermaid, KaTeX, highlighter) are **lazy-loaded on first use** to protect first paint.

---

## 11. Graph view

Force-directed graph (`react-force-graph-2d`) built from the link index:
- **Global graph** and **per-note local graph** (neighbors at depth N).
- **Tag color groups reuse the scheme already in `.obsidian/graph.json`** (MOC gold, Projects blue, Courses green, Research purple, Markets orange, Prompts cyan, Marketing/QA pink).
- `_Archive` excluded; unresolved links optionally shown as ghost nodes (toggle).
- Click node → open note; hover → highlight neighbors. Controls for forces/labels mirroring Obsidian.

---

## 12. Search, spotlight, command palette

- **Full-text search** panel (MiniSearch index from the snapshot): matches across title/tags/body with snippet results that jump to the match; tag-filter support.
- **Spotlight quick-switcher (Cmd/Ctrl+K):** fuzzy jump to any note by name.
- **Command palette (Cmd/Ctrl+P):** run editor/app commands (toggle mode, export, commit, new note, theme, open graph, etc.).

---

## 13. App-shell parity

- **Tabs + split view** for multiple open notes.
- **Themes:** dark/light + accent color, matching Obsidian's look; persisted per browser.
- **Edit ⇄ reading ⇄ split** mode toggle per tab.
- **Bookmarks/starred** and **recent files**.

---

## 14. Export & PDF

- **Per-note PDF (primary):** a `/print/[...path]` route renders the note with a dedicated **print stylesheet** (vector, selectable text, real page breaks; mermaid/KaTeX rendered in DOM first) → `window.print()` → Save as PDF. Highest fidelity, zero server cost.
- **Per-note export:** PDF / standalone HTML / raw `.md`.
- **Server one-click PDF (optional, v2):** Vercel function using `@sparticuz/chromium` + Puppeteer renders `/print/...` to a downloadable PDF. Flagged opt-in (bundle/cold-start cost).
- **Vault/folder export (v2):** zipped bundle of HTML or PDF.

---

## 15. Local sync (Claude routine)

- A **scheduled Claude Code routine that runs locally in this repo** (`schedule` skill) every N minutes (default proposal: 15 min; owner confirms cadence): `git fetch` → `git pull --rebase --autostash`, bringing web commits down to the Mac.
- It **surfaces conflicts** (push notification / report) instead of force-resolving, and optionally `git add -A && git commit && git push` for local-origin edits so local↔web converge.
- **launchd fallback:** a plain background `git -C <repo> pull --rebase --autostash` LaunchAgent if a pure no-LLM background job is preferred.
- **Conflict policy:** single-user makes conflicts rare; web-side `baseSha` checks (§8.2) + local `--rebase --autostash` + explicit notification keep both ends safe and never silently drop work.

---

## 16. Batches (combined v1 + v1.5 + v2)

Built and shipped in order; each batch is independently usable.

### Batch 1 — Foundation & read
- Replace hello-world; sgnk-md shell + theming.
- Auth.js GitHub login + allowlist; secrets wired.
- `/api/vault/snapshot` + `/api/vault/file`; link-index + parsing rules.
- File tree, tabs, CodeMirror editor (raw editing), open/close notes.
- Draft store (IndexedDB + localStorage dirty index).
- Vercel ignored-build-step; `md.sgnk.ai` domain live.

### Batch 2 — Authoring & preview
- Formatting toolbar + keybindings, task checkboxes, callouts, tables insert, footnotes.
- Rendering pipeline: GFM, wikilinks (clickable + unresolved), math, mermaid, code highlight (lazy-loaded).
- Edit ⇄ reading ⇄ split modes; outline; properties editor; word count.
- Backlinks panel.

### Batch 3 — Write path
- `/api/commit` atomic multi-file commit (GitHub App/PAT), author override.
- Conflict (409) detection + UI reload-merge; snapshot invalidation.
- Offline commit queue.
- File CRUD (create/rename/delete) with rename "references to update" list.

### Batch 4 — Export
- `/print/[...path]` + print CSS; per-note PDF/HTML/.md export.

### Batch 5 — Knowledge UI
- Graph view (global + local, tag color groups).
- Full-text search; Cmd+K spotlight; Cmd+P command palette.
- Bookmarks/starred, recent files, tag pane.

### Batch 6 — Authoring polish (v1.5)
- Wikilink/tag autocomplete; embeds/transclusion; in-preview editable tables.
- Split view refinements.

### Batch 7 — Local sync
- Scheduled local Claude routine (pull/push, conflict-aware) + launchd fallback; cadence configured.

### Batch 8 — v2 extensions
- Server-side one-click PDF; vault/folder zip export.
- Rename auto-relinking (rewrite inbound wikilinks).
- Attachments/images (upload → commit to vault, render).
- Daily notes + templates.

---

## 17. Tech stack

- Next.js (App Router, existing) + TypeScript, Node 24, Fluid Compute.
- Auth.js (NextAuth v5) GitHub provider; Octokit (`@octokit/rest` + App auth) server-side.
- CodeMirror 6 (`@codemirror/lang-markdown`, view, state, commands).
- `react-markdown`, `remark-gfm`, custom remark plugins (wikilink, callout), `rehype-katex`, `katex`, `mermaid`, Shiki or `highlight.js`.
- `react-force-graph-2d` (graph), `minisearch` (search), `idb-keyval` (drafts).
- State: Zustand (editor/tabs/draft state). Styling: **Tailwind CSS** (added for this app), with CSS variables for theming.
- Export: print CSS (primary); `@sparticuz/chromium` + `puppeteer-core` (v2 server PDF); `jszip` (v2 vault export).

---

## 18. Non-functional requirements

- **Performance:** vault load ≤ ~2 GitHub calls; heavy renderers lazy-loaded; snapshot sha-cached; first paint not blocked by mermaid/KaTeX/graph.
- **Offline:** last snapshot cached in IndexedDB → app opens offline (read last-known vault); commits queue until online.
- **Bundle:** code-split graph/export/print routes; limit highlighter languages to those present.
- **Security:** §5 (least-privilege token, allowlist defense-in-depth, no client token).
- **Accessibility/keyboard-first:** command palette, full shortcut coverage, focus management.
- **Data safety:** drafts never cleared before commit success; commits atomic; conflicts surfaced, never silently overwritten.

---

## 19. Testing

- **Unit:** wikilink/embed parser (incl. code-fence exclusion + frontmatter links), link-index + backlinks builder, draft store, commit-payload builder, frontmatter parse, search index build.
- **API (mocked Octokit):** `/api/commit` success / 409 sha-conflict / auth-reject; `/api/vault/snapshot` cache hit/miss; allowlist rejection.
- **E2E (Playwright, mocked auth):** login gate → open note → edit → preview renders (wikilink/mermaid/math) → commit calls API and clears draft → graph renders → spotlight/command palette → print route renders.
- **CI:** typecheck + lint + unit + Playwright on the repo.

---

## 20. Risks & mitigations

- **Every save redeploys the site** → Vercel ignored-build-step (§4).
- **Read rate limits / slowness** → snapshot zipball + sha-cache (§6).
- **localStorage too small / janky** → IndexedDB drafts (§8).
- **PDF fidelity** → print-CSS vector PDF primary; server-Chrome optional (§14).
- **Wikilink ghost nodes from code** → parser excludes code (§6.3).
- **Cloud routine can't reach local machine** → routine runs locally in-repo; launchd fallback (§15).
- **Rename breaks inbound links** → v1 shows references list; v2 auto-relink (§9, §16).
- **GitHub App setup friction** → fine-grained PAT fallback (§5).

---

## 21. Defaults (confirmed)

- Web commits target **`main`**.
- **GitHub App** for writes (PAT fallback available).
- Attachments/images, vault-wide export, rename auto-relinking, daily notes/templates → **later batches** (6-8), not v1.
- Local-sync cadence default **15 min** (adjustable at Batch 7).
