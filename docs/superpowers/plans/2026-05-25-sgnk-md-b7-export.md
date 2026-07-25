# sgnk-md Batch 7 — Export (PDF / HTML / Markdown) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).
> **Browser-confirm gate:** before declaring live, confirm in-browser: export .md downloads, Export HTML downloads a styled standalone file, Print/PDF opens a clean print view → Save as PDF works. (See `feedback_client-ui-verification`.)

**Goal:** Export the active note (draft-aware) to **PDF** (via a clean print view), **standalone HTML**, or **raw `.md`** — all client-side so unsaved edits are included; no server round-trip.

**Architecture:** A small `export` module with pure helpers (render the note's markdown to a standalone HTML document string; trigger a browser download; open a print view). An `ExportMenu` dropdown in the editor reuses the existing `@/modules/preview` `Markdown` component via `react-dom/server` `renderToStaticMarkup` to produce HTML, wraps it with inline print CSS, and: downloads `.md`/`.html`, or opens the HTML in a new tab (via a Blob URL) and calls `print()` for a vector, selectable-text PDF. Vault-wide export + server-side Chrome PDF are deferred to v2/B11.

**Tech Stack:** `react-dom/server` (already available via react-dom), the existing `Markdown` component + markdown CSS. Reference: spec §14.

**Constraints:** client-only; draft-aware (use the active note's current content = store `contentByPath[path]` ?? loaded); no new deps if avoidable; no `any`; arch 0; stable Zustand selectors. **Do NOT use `document.write()`** (XSS/perf — use Blob URLs + DOM APIs). Gate per task.

---

### B7T1: export helpers (pure, TDD)

**Files:** Create `src/modules/export/presentation/export-doc.ts`, `src/modules/export/index.ts`; Test `test/export/export-doc.test.tsx`.
- [ ] `renderNoteHtmlDocument(markdown: string, title: string): string` — render `<Markdown content={markdown} />` (from `@/modules/preview`) via `renderToStaticMarkup`, then wrap in a full standalone HTML5 document: `<!doctype html><html><head><meta charset><title>{escaped title}</title><style>{PRINT_CSS}</style></head><body class="markdown-body">{rendered}</body></html>`. `PRINT_CSS` = a self-contained copy of the `.markdown-body` typography (headings, lists, tables, code, blockquote, callouts) using concrete light-theme colors (NOT CSS vars — must render standalone), plus `@page { margin: 2cm }` and print-friendly sizing. HTML-escape the title.
- [ ] `triggerDownload(filename: string, content: string, mime: string): void` — create a `Blob` → `URL.createObjectURL` → a temporary `<a download>` (`createElement`/`appendChild`/`click`/`remove`) → `URL.revokeObjectURL`. SSR-guard (`typeof document !== "undefined"`). **No `document.write`.**
- [ ] `openPrintView(htmlDocument: string): void` — create a `Blob` of type `text/html` → `URL.createObjectURL` → `const w = window.open(url, "_blank")` → on the new window's `load` event call `w.print()` (fallback: a short `setTimeout` to call print); revoke the URL after a delay. SSR-guard + null-window guard (popup blocked → no throw). **No `document.write`.**
- [ ] **Test (jsdom)** `export-doc.test.tsx`: `renderNoteHtmlDocument("# Hi\n\n- a\n- b", "My Note")` returns a string containing `<!doctype html`, `<title>My Note</title>`, `markdown-body`, an `<h1>` with "Hi", and a `<ul>`. (Don't test window.open/print — thin wrappers.)
- [ ] Gate. Commit `feat(sgnk-md): export helpers (standalone HTML doc + download + print view)`.

### B7T2: ExportMenu in the editor

**Files:** Create `src/modules/export/presentation/ExportMenu.tsx`; export from `@/modules/export`; wire into `EditorPane.tsx` (near the mode toggle / tab bar).
- [ ] `ExportMenu` (`"use client"`): a small "Export ▾" button opening a menu: **Download .md**, **Export HTML**, **Print / PDF**. Disabled when no active note.
- [ ] Compute the active note's content + title from stable selectors: `path = activePath`; `content = contentByPath[path]` ?? "" ; `title = basename(path)` without `.md`. (Active notes are seeded into `contentByPath` on open by EditorPane, so content is present.)
- [ ] Actions:
  - **Download .md** → `triggerDownload(\`${title}.md\`, content, "text/markdown")`.
  - **Export HTML** → `triggerDownload(\`${title}.html\`, renderNoteHtmlDocument(content, title), "text/html")`.
  - **Print / PDF** → `openPrintView(renderNoteHtmlDocument(content, title))`.
- [ ] Theme tokens; click-outside closes the menu; Escape closes; keyboard accessible. Stable selectors only.
- [ ] Wire `<ExportMenu />` into `EditorPane` header area (next to the mode toggle). Keep it a client island.
- [ ] **RTL test** `test/export/export-menu.test.tsx`: seed store with an active note + content; render `<ExportMenu>`; assert it renders without crash/loop; clicking "Download .md" calls a mocked `triggerDownload` with `name.md` + the content. (Mock the export-doc helpers.)
- [ ] Gate. Commit `feat(sgnk-md): ExportMenu (md / HTML / print-to-PDF)`.

### B7T3: cutover + browser confirm

- [ ] Merge B7 → main → deploy. Controller verifies build/health.
- [ ] **Browser-confirm gate (required):** signed-in, open a note → Export ▾ →
  - Download .md → a `.md` file with the note's content downloads.
  - Export HTML → a `.html` file opens standalone in a browser, fully styled (headings/tables/code), no app chrome.
  - Print / PDF → a new tab opens showing only the rendered note; Save as PDF produces a clean, selectable-text PDF.
  - Edit the note first (don't commit) → export includes the unsaved edit (draft-aware).
- [ ] Mark B7 done in roadmap; cleanup worktree.

---

## Self-Review
- Spec §14 v1 (per-note PDF via print, HTML, raw md; draft-aware) → B7T1/B7T2. Server-Chrome PDF + vault-wide zip export → deferred (B11). ✅
- Client-side → unsaved drafts included; no new secrets. ✅
- Standalone HTML uses concrete colors (not CSS vars) so it renders outside the app. ✅
- No `document.write` (Blob URLs + DOM APIs only). ✅
- Stable selectors + RTL test (B4 lesson). ✅
- Type consistency: `renderNoteHtmlDocument`, `triggerDownload`, `openPrintView`, `ExportMenu` consistent. ✅

## Definition of done
`npm run verify` green; browser-confirmed: active note (incl. unsaved edits) exports to a downloaded `.md`, a styled standalone `.html`, and a clean print-to-PDF; live on md.sgnk.ai.
