# sgnk-md Batch 9 — Authoring Polish (v1.5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).
> **Browser-confirm gate** before "live". **Stable Zustand selectors only** (B4 incident). No silent failures.

**Goal:** Two authoring niceties that make sgnk-md feel like Obsidian: **`[[` and `#` autocomplete** in the editor, and **`![[Note]]` embeds/transclusion** rendered inline in the preview.

**Scope note:** In-preview *editable tables* (from the original §7.3 list) are deferred to v2 — tables render in preview and are fully editable in the raw editor; click-to-edit-cell write-back is complex and low-essential.

**Architecture:** Autocomplete = a CodeMirror 6 `@codemirror/autocomplete` completion source fed by the snapshot's note basenames + tag set (passed from EditorPane). Embeds = a preview-side component that detects `![[target]]`, resolves it (basename→path), fetches the target note's content, and renders it inline as nested `<Markdown>`, with a depth/cycle guard.

**Tech Stack:** `@codemirror/autocomplete` (CM6), existing snapshot + `/api/vault/file`. Reference: spec §7.3.

---

### B9T1: wikilink + tag autocomplete (CodeMirror)

**Files:** Create `src/modules/editor/presentation/completions.ts`; Modify `CodeMirrorEditor.tsx` (add autocompletion extension + source), `EditorPane.tsx` (pass completion data). Install `@codemirror/autocomplete`. Test (pure source).
- [ ] Install `@codemirror/autocomplete`.
- [ ] `completions.ts` (pure-ish, TDD): `makeVaultCompletionSource(getData: () => { noteNames: string[]; tags: string[] }): CompletionSource`. Behavior:
  - When the text before the cursor matches an open `[[` with a partial (regex `/\[\[([^\]\n]*)$/`), return note-name completions (label = basename, apply inserts `basename]]` and places cursor after). Filter by the partial.
  - When it matches `#` starting a tag (`/(?:^|\s)#([\w/-]*)$/`), return tag completions (apply inserts the tag).
  - Else return null (no completion).
  Unit-test the source by constructing a `CompletionContext` over an `EditorState` with doc `"see [[HQ"` → returns options including `HQ PRD` etc. (or test the matching logic via a small exported helper `matchTrigger(textBefore)` returning `{type:"wikilink"|"tag", query} | null` and unit-test THAT thoroughly; wire it into the CM source).
- [ ] `CodeMirrorEditor.tsx`: accept a new optional prop `completionData?: { noteNames: string[]; tags: string[] }`; add `autocompletion({ override: [makeVaultCompletionSource(() => completionDataRef.current)] })` to the extensions (keep the ref updated so the source sees the latest data without recreating the view). Keep existing keymaps/behavior.
- [ ] `EditorPane.tsx`: build `{ noteNames, tags }` from the snapshot (memoized — noteNames = basenames of `snapshot.notes`; tags = unique sorted tags) and pass to `CodeMirrorEditor`. Stable selectors.
- [ ] Gate. Commit `feat(sgnk-md): [[wikilink]] + #tag autocomplete in the editor`.

### B9T2: embeds / transclusion (`![[Note]]`)

**Files:** Create `src/modules/preview/presentation/EmbeddedNote.tsx`; Modify `Markdown.tsx` (render `![[...]]` as `<EmbeddedNote>`). Test (RTL).
- [ ] In `Markdown.tsx`, extend the text transform: detect `![[target]]` / `![[target#heading]]` (embed) SEPARATELY from `[[link]]`. For an embed, render `<EmbeddedNote target={inner} basenameToPath depth={currentDepth} />` instead of a link. (Ensure the `!` is consumed — current `WIKILINK_RE` leaves `!` as text; add an embed regex `/!\[\[([^\]]+)\]\]/g` handled before/around the link regex.)
- [ ] `EmbeddedNote.tsx` (`"use client"`): props `{ target, basenameToPath, depth }`.
  - Resolve `target` (strip `#heading`/`|alias`) → path via `resolveWikilink`. If unresolved → render a dim "‌!\[\[target]] (unresolved)".
  - If `depth >= 2` → render a link instead of expanding (cycle/runaway guard).
  - Fetch the target's content: `fetch("/api/vault/file?path="+encodeURIComponent(path))` on mount (loading/error states). On success render a bordered "embed" container with the target title + `<Markdown content={embeddedContent} basenameToPath depth={depth+1} />` (pass depth through so nested embeds are bounded). If a `#heading` was given, best-effort slice the content to that section (optional; if hard, render the whole note).
  - `Markdown` gets an optional `depth` prop (default 0) threaded to embeds.
- [ ] RTL test `test/preview/embedded-note.test.tsx`: mock fetch → returns content; render `<Markdown content="![[HQ]]" basenameToPath=Map(HQ→Projects/HQ/HQ.md) />` → asserts the embedded content renders inside an embed container; unresolved target renders the dim fallback; depth guard stops at 2.
- [ ] Gate. Commit `feat(sgnk-md): ![[embeds]] transclusion in preview`.

### B9T3: cutover + browser confirm

- [ ] Merge B9 → main → deploy. Controller verifies build/health.
- [ ] **Browser-confirm gate (required):** in the editor type `[[` → a note suggestion list appears; pick one → inserts `[[Name]]`. Type `#` → tag suggestions. In a note containing `![[SomeNote]]`, Reading mode shows that note's content embedded inline (bordered). 
- [ ] Mark B9 done in roadmap; cleanup worktree.

---

## Self-Review
- Spec §7.3: autocomplete (B9T1), embeds/transclusion (B9T2). Editable tables explicitly deferred to v2 (documented). ✅
- Embeds bounded by depth guard (no infinite recursion on cyclic links). ✅
- Autocomplete source fed by live snapshot data via a ref (no view recreation). ✅
- Stable selectors; no new server endpoints (reuse `/api/vault/file`). ✅
- Type consistency: `makeVaultCompletionSource`, `matchTrigger`, `EmbeddedNote`, `Markdown depth` prop consistent. ✅

## Definition of done
`npm run verify` green; browser-confirmed: `[[`/`#` autocomplete works in the editor; `![[Note]]` transcludes the target inline in preview (depth-guarded); live on md.sgnk.ai.
