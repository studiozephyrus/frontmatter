# sgnk-md Batch 8 — Knowledge UI (Graph + Search + Spotlight + Palette) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).
> **Browser-confirm gate** before "live" (see `feedback_client-ui-verification`). **Stable Zustand selectors only** (B4 incident). Avoid unsafe DOM HTML-injection APIs.

**Goal:** The signature Obsidian knowledge features: a **graph view** (force-directed, tag-colored), **Cmd/Ctrl+K spotlight** quick-switcher, **Cmd/Ctrl+P command palette**, and **full-text search**.

**Architecture:** Graph + spotlight + palette are client-only and reuse the existing snapshot (`notes[]` with path/title/tags/outbound/backlinks). Full-text search needs note bodies (not in the snapshot), so a new server route `/api/vault/search?q=` builds a MiniSearch index from the zipball bodies, sha-cached like the snapshot, and returns ranked results. A small `app-shell`/`search` module hosts the modals + graph.

**Tech Stack:** `react-force-graph-2d` (graph), `minisearch` (server search index), existing snapshot/link-index. Reference: spec §11, §12.

**Constraints:** lazy-load the graph (heavy canvas lib) so first paint isn't blocked; modals are keyboard-first (Esc closes, arrow/enter navigate); reuse the `.obsidian/graph.json` tag color scheme. Gate per task.

---

### B8T1: Cmd+K spotlight + Cmd+P command palette

**Files:** Create `src/modules/app-shell/presentation/CommandPalette.tsx`, `src/modules/app-shell/presentation/Spotlight.tsx`, a shared `src/modules/app-shell/presentation/use-hotkey.ts`; wire global key handlers into the shell. Tests (RTL).
- [ ] `use-hotkey.ts`: a small hook registering a global keydown for a combo (e.g. `mod+k`, `mod+p`) that calls a handler + `preventDefault`; cleans up. (`mod` = metaKey on mac, ctrlKey elsewhere.)
- [ ] **Spotlight** (Cmd/Ctrl+K): a centered modal with a fuzzy filter input over `useSnapshot().snapshot.notes` (match title + path); arrow keys to move, Enter to `openTab(path)` + close; Esc closes; click-outside closes. Show top ~20 matches. Pure fuzzy-match helper (`fuzzyFilter(items, query)`) unit-tested.
- [ ] **Command palette** (Cmd/Ctrl+P): same modal pattern over a static command registry: `{ id, label, run }[]` — e.g. New tab focus, Toggle mode (edit/reading/split), Open graph, Open search, Commit (focus CommitBar), Export current note, Sign out. Each `run` calls the relevant store action / dispatches an event. Fuzzy-filter the labels.
- [ ] Mount both (hidden until hotkey) in a client shell wrapper rendered inside `(vault)` (e.g. a `<KnowledgeUI/>` island in AppShell). Stable selectors.
- [ ] RTL tests: spotlight filters notes + Enter opens a tab (mock store); palette runs a command; both close on Esc; no render-loop.
- [ ] Gate. Commit `feat(sgnk-md): Cmd+K spotlight + Cmd+P command palette`.

### B8T2: graph view

**Files:** Create `src/modules/graph/presentation/GraphView.tsx`, `src/modules/graph/presentation/graph-data.ts`, `src/modules/graph/index.ts`; add a graph toggle (toolbar/command). Install `react-force-graph-2d`. Tests (graph-data pure).
- [ ] `graph-data.ts` (pure, TDD): `buildGraph(notes): { nodes: {id,label,group}[], links: {source,target}[] }` from snapshot `notes[]` (id=path, label=title, group=primary tag area → map tag→color group matching `.obsidian/graph.json`: moc/project/course/research/markets/prompts/marketing-qa). Exclude `excludeFromGraph` notes. Links from `outbound` resolved to existing note ids (basename resolve; drop unresolved). Dedupe links. Unit-test node/link/group derivation + archive exclusion.
- [ ] `GraphView.tsx` (`"use client"`): lazy-load `react-force-graph-2d` (dynamic import, `ssr:false`); render nodes colored by group (the gold/blue/green/... palette), labels on hover/zoom, click a node → `openTab(path)` + close graph. Full-screen modal or a dedicated pane. Loading state while the lib loads.
- [ ] Open via a command (palette) + a toolbar/header button. Close with Esc.
- [ ] Gate (build must not SSR the graph lib). Commit `feat(sgnk-md): force-directed graph view (tag-colored)`.

### B8T3: full-text search

**Files:** Create `src/modules/vault/infrastructure/search-index.ts`, `src/modules/vault/application/search-notes.ts` (+ port method), `src/app/api/vault/search/route.ts`; a `src/modules/app-shell/presentation/SearchPanel.tsx`. Install `minisearch`. Tests (mocked).
- [ ] Extend the snapshot/reader path to expose note bodies for indexing: a sha-cached server **search index** built from the zipball (reuse `getZipball` + the same vault-scope filter + strip frontmatter/code for indexing). `searchNotes(query): {path,title,snippet}[]` via MiniSearch (fields: title, tags, body; store path+title). Cache the built index by HEAD sha (like the snapshot) so it's built once.
- [ ] `/api/vault/search/route.ts` (`force-dynamic`): `getActor` gate → parse `?q=` (zod, min 1) → return ranked results (cap ~30) with a short snippet around the match. 401/400/502 as usual.
- [ ] `SearchPanel.tsx` (`"use client"`): an input (debounced) → `fetch("/api/vault/search?q=")` → list results (title + path + snippet), click → `openTab(path)`. Open via command palette / a sidebar search icon. Loading/empty states.
- [ ] Tests: `search-index` unit (mocked zip → indexes 2 notes → query returns the right one); route 401/200 (mocked).
- [ ] Gate. Commit `feat(sgnk-md): full-text search (/api/vault/search + panel)`.

### B8T4: cutover + browser confirm

- [ ] Merge B8 → main → deploy. Controller verifies build/health + `/api/vault/search` 401 logged-out.
- [ ] **Browser-confirm gate (required):** Cmd+K → type a note name → Enter opens it; Cmd+P → run "Open graph" → graph renders with colored clusters → click a node opens the note; search panel → type a word → results → click opens; Esc closes modals.
- [ ] Mark B8 done in roadmap; cleanup worktree.

---

## Self-Review
- Spec §11 (graph: global, tag colors, click-open) → B8T2. §12 (full-text search, Cmd+K spotlight, Cmd+P palette) → B8T1/B8T3. ✅
- Graph/spotlight/palette reuse the existing snapshot (no new server load); full-text search adds a sha-cached server index (bodies not in snapshot). ✅
- Lazy-load graph lib; modals keyboard-first; stable selectors. ✅
- Type consistency: `buildGraph`, `searchNotes`, `fuzzyFilter`, command registry shape consistent. ✅

## Definition of done
`npm run verify` green; browser-confirmed: spotlight (Cmd+K), command palette (Cmd+P), tag-colored graph with click-to-open, and full-text search all work; live on md.sgnk.ai.
