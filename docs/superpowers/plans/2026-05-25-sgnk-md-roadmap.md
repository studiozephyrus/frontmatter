# sgnk-md — Implementation Roadmap

> Master index for building **sgnk-md** (the web Obsidian editor at `md.sgnk.ai`).
> Spec: [`../specs/2026-05-25-sgnk-md-web-editor-design.md`](../specs/2026-05-25-sgnk-md-web-editor-design.md)
> Architecture reference: `sgnk-next` (hexagonal modular monolith, gates green from commit 1).

**How we execute:** small batches. Each batch has its own detailed bite-sized plan in this folder, written **just before** it runs (so it absorbs lessons from the previous batch). Every batch ends green on the full gate. We never start batch N+1 with a red gate.

---

## The gate (must stay green after every batch)

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # eslint --max-warnings=0 (boundaries rules)
npm run test          # vitest
npm run build         # next build
npm run arch          # node specs/harness/clean-architecture-report.mjs  → total 0
```
Plus the sgnk-next boundary gates wired into `specs/harness/`:
`clean-architecture-report.mjs`, `import-boundary-report.mjs`, `server-folder-blocklist.mjs`, `route-inventory.mjs`.

A red gate means **stop and fix before the next batch** — never let violations accumulate.

---

## Hexagonal module map (target `src/` tree)

```txt
src/
  app/
    (auth)/login/                 # login page
    (vault)/                      # authenticated editor shell + routes
    api/auth/[...nextauth]/       # Auth.js
    api/vault/snapshot/           # GET snapshot (sha-cached)
    api/vault/file/               # GET single file + sha
    api/commit/                   # POST atomic commit
    print/[...path]/              # print-CSS render route (PDF source)
  modules/
    auth/            # GitHub OAuth, allowlist, ActorContext resolution
    vault/           # Note/WikiLink/LinkIndex domain; snapshot+file read; markdown+link parsing
    repository/      # write side: atomic Git Data commit, conflict detection, file CRUD
    drafts/          # client: IndexedDB draft store + localStorage dirty index + offline queue
    editor/          # CodeMirror editor, tabs, modes, authoring toolbar
    preview/         # rendering pipeline (gfm, wikilinks, callouts, math, mermaid)
    graph/           # graph data + force-graph view
    search/          # full-text index, spotlight, command palette
    export/          # print/PDF/HTML/md export
    app-shell/       # layout, theme, sidebars, status bar
  shared/
    domain/          # Result, ids, errors
    application/      # ActorContext, ports/*, pagination
    infrastructure/  # github client (octokit), markdown utils, browser storage
    presentation/    # ui/, lib/ (format, utils), theme tokens
  container/
    dependency-container.ts       # composition root (only wiring import for app)
  config/
    env.ts                        # typed server env (only process.env reader besides infra)
  proxy.ts                        # auth gate + security headers
specs/harness/                    # gate scripts (copied from sgnk-next)
test/                             # vitest specs
docs/adr/                         # decision records
```

Provider clients (Octokit) live in `shared/infrastructure/github`; each module depends on a **port**, never the SDK directly. The container wires adapters into use-cases.

---

## Batches (small, sequential, each shippable + green)

| # | Batch | Outcome | Spec § |
|---|---|---|---|
| **B1** | **Foundation** | Hexagonal scaffold + gates green; spine (env, proxy, container, shared kernel); Tailwind; sgnk-md app shell replaces hello-world; `md.sgnk.ai` live; Vercel ignored-build-step | 4, 17, 18 |
| **B2** | **Auth** | GitHub OAuth + allowlist; `ActorContext`; protected `(vault)` routes; login page | 5 |
| **B3** | **Vault read** | Octokit client (shared); `vault` module: snapshot (zipball→indexes, sha-cache), single-file read, link-index parser (code-fence aware, frontmatter links); `/api/vault/*`; file tree UI | 6 |
| **B4** | **Editor + drafts** | CodeMirror editor, tabs, open/close notes; `drafts` module (IndexedDB + localStorage dirty index); dirty badges | 7.2, 8.1 |
| **B5** | **Preview + authoring + links** | Rendering pipeline (gfm/wikilinks/callouts/math/mermaid, lazy); edit⇄reading⇄split modes; authoring toolbar + keybindings + task checkboxes; backlinks; outline; properties editor | 7, 10 |
| **B6** | **Write path** | `repository` module; `/api/commit` atomic multi-file + `baseSha` 409 conflict; offline queue flush; file CRUD (create/rename/delete) with rename "references to update" list | 8.2, 9 |
| **B7** | **Export** | `/print/[...path]` + print CSS; per-note PDF (print) / HTML / raw `.md` export | 14 |
| **B8** | **Knowledge UI** | Graph view (global + local, tag color groups from `.obsidian/graph.json`); full-text search; Cmd+K spotlight; Cmd+P command palette; bookmarks/recent/tag pane | 11, 12 |
| **B9** | **Authoring polish (v1.5)** | Wikilink/tag autocomplete; embeds/transclusion `![[...]]`; in-preview editable tables; split-view refinements | 7.3 |
| **B10** | **Local sync** | Scheduled local Claude routine (`git pull --rebase --autostash`, conflict-aware, optional push) + launchd fallback; cadence configured | 15 |
| **B11** | **v2 extensions** | Server one-click PDF (`@sparticuz/chromium`); vault/folder zip export; rename auto-relinking; attachments/images; daily notes + templates | 14, 16 |

**Dependency order:** B1→B2→B3→B4→B5→B6 are strictly sequential (each builds on the last). B7 needs B5 (preview). B8 needs B3 (link/search index). B9 needs B5. B10 is independent of the app (can run any time after B6). B11 is last.

**Per-feature shape (every batch follows this):** `domain → port → use-case (+mocked-port test) → infra adapter + mapper → Zod schema → thin route/page/action → UI → gate`. Vertical slices, never horizontal sprawl.

---

## Detailed batch plans

- [x] Roadmap (this file)
- [x] **B1 — Foundation** → [`2026-05-25-sgnk-md-b1-foundation.md`](2026-05-25-sgnk-md-b1-foundation.md) — shipped & live at md.sgnk.ai
- [x] **B2 — Auth** → [`2026-05-25-sgnk-md-b2-auth.md`](2026-05-25-sgnk-md-b2-auth.md) — shipped & live (GitHub login, allowlist sagnikmitra)
- [x] **B3 — Vault read** → [`2026-05-25-sgnk-md-b3-vault-read.md`](2026-05-25-sgnk-md-b3-vault-read.md) — shipped & live (snapshot, file tree, /api/vault/*)
- [x] **B4 — Editor + drafts** → [`2026-05-25-sgnk-md-b4-editor-drafts.md`](2026-05-25-sgnk-md-b4-editor-drafts.md) — shipped & live (CodeMirror, tabs, IndexedDB drafts, dirty badges)
- [x] **B5 — Preview + authoring + links** → [`2026-05-25-sgnk-md-b5-preview-links.md`](2026-05-25-sgnk-md-b5-preview-links.md) — shipped & live (preview, modes, wikilinks, backlinks, outline, toolbar, tasks)
- [x] **B6 — Write path (commit)** → [`2026-05-25-sgnk-md-b6-write-path.md`](2026-05-25-sgnk-md-b6-write-path.md) — shipped & live (Commit → atomic GitHub commit, 409 conflict; web commits confirmed landing)
- [x] **B7 — Export (PDF/HTML/md)** → [`2026-05-25-sgnk-md-b7-export.md`](2026-05-25-sgnk-md-b7-export.md) — shipped & live (per-note draft-aware export: .md / standalone HTML / print-to-PDF)
- [x] **B8 — Knowledge UI** → [`2026-05-25-sgnk-md-b8-knowledge-ui.md`](2026-05-25-sgnk-md-b8-knowledge-ui.md) — shipped & live (Cmd+K spotlight, Cmd+P palette, tag-colored graph, full-text search)
- [x] **B9 — Authoring polish** → [`2026-05-25-sgnk-md-b9-authoring-polish.md`](2026-05-25-sgnk-md-b9-authoring-polish.md) — shipped & live ([[/# autocomplete, ![[embeds]] transclusion; editable tables deferred to v2)
- [x] **B10 — Local sync routine** → done (`scripts/sgnk-md-sync.sh` conflict-safe pull/push; hourly Claude scheduled task `sgnk-md-sync`; launchd blocked by macOS TCC on ~/Desktop — needs Full Disk Access for always-on)
- [x] **B11 — File management** → [`2026-05-25-sgnk-md-b11-file-management.md`](2026-05-25-sgnk-md-b11-file-management.md) — shipped & live (create / rename+auto-relink / delete notes from the tree; /api/vault/create|delete|rename)

- [x] **B12 — v2 extras** → [`2026-05-25-sgnk-md-b12-v2-extras.md`](2026-05-25-sgnk-md-b12-v2-extras.md) — shipped & live (shared snapshot provider + no-reload commits/file-ops; image/attachment upload + authed raw serving; daily notes + templates; vault-wide zip export; in-preview editable tables; server-side chromium PDF)

**sgnk-md FULLY COMPLETE — every planned batch (B1–B12) + QA + vault restructure shipped and live at md.sgnk.ai.** (Server-PDF runs only on Vercel — local dev returns a 502 hint to use client Print/PDF.)

**Post-B7 QA fixes** (shipped): flush-on-unmount (no keystroke loss), outline scroll, export guard, task-toggle code-fence safety, dirty-count freshness, persist open tabs/active/mode, export mermaid+katex, snapshot frontmatter resilience.
