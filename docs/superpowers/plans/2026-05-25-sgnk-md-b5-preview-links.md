# sgnk-md Batch 5 — Preview + Authoring + Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).
> **Browser-confirm gate:** a green build is NOT proof. Before declaring B5 live, the controller (or user) must browser-smoke the authenticated happy path (open note → preview renders → click wikilink → backlinks show). See `feedback_client-ui-verification`.

**Goal:** Make sgnk-md *feel like Obsidian*: rendered markdown preview with edit⇄reading⇄split modes, clickable `[[wikilinks]]`, a backlinks panel + outline, and an authoring toolbar with task checkboxes — math/mermaid/code all rendered, heavy renderers lazy-loaded.

**Architecture:** A `preview` module renders a note's markdown to React via react-markdown + remark/rehype, with a custom wikilink transform that resolves `[[target]]` against the snapshot's basename→path map and opens tabs on click. `EditorPane` gains a per-tab mode (edit/reading/split). The right pane renders backlinks (from the snapshot link index) + an outline (headings of the active note). The editor gets a toolbar + clickable task checkboxes.

**Tech Stack:** `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`, `katex`, `rehype-highlight` (or `highlight.js`), `mermaid` (lazy). Reuse B3 snapshot/link-index + B4 editor store. Reference: spec §7, §10.

**Constraints:** lazy-load mermaid/katex/highlighter (dynamic import) to protect first paint; client-only; no new secrets; arch 0; build green. Each Zustand selector must return a STABLE reference (no `new` in selectors — see B4 incident). Gate per task.

---

### B5T1: markdown rendering pipeline (Preview)

**Files:** Create `src/modules/preview/presentation/Markdown.tsx`, `src/modules/preview/presentation/mermaid-block.tsx`, `src/modules/preview/index.ts`; Test `test/preview/markdown.test.tsx` (jsdom + React Testing Library — install `@testing-library/react`, `@testing-library/jest-dom`).
- [ ] Install `react-markdown remark-gfm remark-math rehype-katex katex rehype-highlight mermaid`; dev: `@testing-library/react @testing-library/jest-dom`.
- [ ] **Test FIRST (RTL, jsdom):** render `<Markdown content="# Hi\n\n- [x] done\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n> [!note] hello" />` and assert: an `<h1>` "Hi", a checked checkbox, a table, and a callout container render. (This RTL render test also guards against render-loops/crashes — the B4 class of bug.)
- [ ] Implement `Markdown.tsx` (`"use client"`): react-markdown with `remarkPlugins=[remark-gfm, remark-math]`, `rehypePlugins=[rehype-katex, rehype-highlight]`, custom `components` for: GFM task list checkboxes (rendered, and clickable in B5T4), callouts (`> [!type]` blockquote → styled callout), code blocks (``mermaid`` → `<MermaidBlock>`; others → highlighted). Lazy-load katex CSS + mermaid only when needed. Theme tokens.
- [ ] `mermaid-block.tsx`: client component that dynamically `import("mermaid")` on mount and renders the diagram into a ref; error-state on parse failure (no silent fail).
- [ ] Gate (typecheck/lint/test/arch/build — build must not SSR-crash; dynamic import mermaid with `ssr:false` or mount-in-effect). Commit `feat(sgnk-md): markdown rendering pipeline (gfm/math/code/mermaid/callouts)`.

### B5T2: modes (edit/reading/split) + clickable wikilinks

**Files:** Modify `src/modules/editor/presentation/editor-store.ts` (add `mode` per tab or global), `EditorPane.tsx`; Create `src/modules/preview/presentation/wikilink.ts` (resolver) + wire into `Markdown.tsx`. Test `test/preview/wikilink.test.ts`.
- [ ] **Test FIRST:** `resolveWikilink("HQ", basenameMap)` → returns the full path `Projects/HQ/HQ.md` when unique; returns null/unresolved for unknown; handles `[[path|alias]]`/`#heading` (strip). Pure function, unit-tested.
- [ ] Add a `mode` to the editor store (`"edit"|"reading"|"split"`, default `"reading"` or `"split"`; per active tab is fine, or a single global mode) with a `setMode` action. STABLE selectors only.
- [ ] EditorPane: a small mode toggle (Edit / Reading / Split) in the tab bar area. Edit = CodeMirror; Reading = `<Markdown>` of the current content (draft-aware); Split = both side by side.
- [ ] In `Markdown.tsx`, render `[[wikilinks]]` as clickable: a remark/regex transform → custom `<a data-wikilink>` whose onClick resolves via the snapshot basename map (from a `useSnapshot`-backed context or prop) and calls `useEditorStore.getState().openTab(resolvedPath)`. Unresolved links render dimmed/non-clickable (Obsidian-style).
- [ ] Gate + browser-confirm prep. Commit `feat(sgnk-md): edit/reading/split modes + clickable wikilinks`.

### B5T3: backlinks panel + outline (right pane)

**Files:** Create `src/modules/preview/presentation/Backlinks.tsx`, `src/modules/preview/presentation/Outline.tsx`; Modify `AppShell.tsx` (right pane). Test `test/preview/outline.test.ts` (heading extraction).
- [ ] **Test FIRST:** `extractOutline(markdown)` → array of `{ depth, text, slug }` for `#`/`##`/`###` (ignoring code fences). Pure, unit-tested.
- [ ] `Backlinks.tsx` (client): for the active note path, read the snapshot's `notes` to find entries whose `outbound` includes the active note's basename (or use precomputed `backlinks`), list them as clickable links (openTab). Empty state "No backlinks".
- [ ] `Outline.tsx` (client): headings of the active note's current content (draft-aware), clickable to scroll (best-effort) — at least render the outline list.
- [ ] AppShell right pane: render Backlinks + Outline (replace the "Backlinks/outline — Batch 5" placeholder). Stable store selectors.
- [ ] Gate. Commit `feat(sgnk-md): backlinks panel + outline`.

### B5T4: authoring toolbar + task checkboxes + keybindings

**Files:** Create `src/modules/editor/presentation/Toolbar.tsx`; Modify `CodeMirrorEditor.tsx` (keymap), `Markdown.tsx` (checkbox toggle writes back).
- [ ] Toolbar above the editor (edit mode): buttons for bold/italic/heading/list/task/quote/code/link/table — each applies a CodeMirror transaction to the active view (wrap selection / insert). Obsidian keybindings (Cmd+B/I, etc.) via CodeMirror keymap.
- [ ] Reading-mode task checkboxes: clicking a `- [ ]`/`- [x]` in `<Markdown>` toggles the source line and `saveDraft`s (write-back). Keep it correct (find the right line).
- [ ] Gate. Commit `feat(sgnk-md): authoring toolbar + task checkboxes + keybindings`.

### B5T5: cutover + browser confirm

- [ ] Merge B5 → main → deploy. Controller verifies build/health.
- [ ] **Browser-confirm gate (required):** signed-in, open a note → Reading mode renders (headings, tables, a callout, math/mermaid if present); toggle Split; click a `[[wikilink]]` → it opens the target; backlinks list populates; toolbar bold works; a task checkbox toggles and persists. Only after this passes is B5 "live".
- [ ] Mark B5 done in roadmap; cleanup worktree.

---

## Self-Review
- Spec §7 (preview, modes, toolbar, tasks, callouts, math, mermaid, wikilinks, backlinks, outline) + §10 (rendering pipeline, lazy) → B5T1–B5T4. ✅
- Lazy heavy renderers (mermaid/katex) → B5T1. ✅
- No new-ref Zustand selectors (B4 incident) — explicit constraint. ✅
- RTL render test added to catch client render-loops/crashes pre-deploy. ✅
- No new secrets; arch 0. ✅

## Definition of done
`npm run verify` green; browser-confirmed: rendered preview (gfm/math/mermaid/callouts), edit/reading/split modes, clickable wikilinks, backlinks panel, outline, toolbar, toggleable task checkboxes — live on md.sgnk.ai.
