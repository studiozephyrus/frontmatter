# sgnk-md Batch 12 — v2 Extras Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).
> **Browser-confirm gate** before "live". **Stable Zustand selectors only** (B4 incident). Avoid unsafe DOM HTML-injection APIs. Reuse existing auth + GitHub writer + snapshot.

**Goal:** Ship the remaining v2 items: a **shared snapshot provider + no-reload** commits/file-ops, **image/attachment upload**, **daily notes + templates**, **vault-wide zip export**, **in-preview editable tables**, and **server-side one-click PDF**.

**Architecture:** Each is additive to the existing hexagonal modules. The shared provider replaces the 3 independent `useSnapshot()` calls and exposes `refresh()`, letting commit/file-ops update the UI without a full page reload. Attachments + zip + server-PDF add auth-gated routes reusing the GitHub client/writer.

**Tech Stack:** `jszip` (vault export), `@sparticuz/chromium` + `puppeteer-core` (server PDF). Reference: spec §14, §16.

---

### B12T1: shared SnapshotProvider + no-reload

**Files:** Create `src/modules/vault/presentation/SnapshotProvider.tsx`; rewrite `use-snapshot.ts` to read context; wrap the `(vault)` UI; update CommitBar + FileTree ops to `refresh()` instead of `window.location.reload()`.
- [ ] `SnapshotProvider` (`"use client"`): fetches `/api/vault/snapshot` once, holds `{loading,error,snapshot,refresh}` in context; `refresh()` re-fetches. `useSnapshot()` becomes `useContext` (same return shape) + a `useSnapshotRefresh()` hook.
- [ ] Wrap the authed UI in the provider so FileTree, EditorPane, RightPane, CommitBar all share ONE fetch + one refresh. (A client `<VaultWorkspace>` island under AppShell that includes the provider + the three panes; CommitBar in the header also needs it — host the provider high enough, or expose `refresh` via a `window` event the provider listens to: `window.dispatchEvent(new CustomEvent("sgnk:vault-changed"))` → provider refreshes. Use the event approach so the header CommitBar (outside the provider tree) can trigger refresh without prop drilling.)
- [ ] **CommitBar:** on successful commit → clear committed drafts + `setDirty(false)` + dispatch `sgnk:vault-changed` (provider refreshes) + reset the committed notes' `contentByPath` baseline so open editors show committed content — **no `window.location.reload()`**, tabs preserved.
- [ ] **FileTree create/delete/rename:** on success → dispatch `sgnk:vault-changed` (+ open/close tabs as needed) instead of reload.
- [ ] RTL test: provider fetches once; two consumers share it; refresh re-fetches. Gate. Commit `feat(sgnk-md): shared snapshot provider + no-reload commit/file-ops`.

### B12T2: image / attachment upload

**Files:** Create `src/app/api/vault/raw/[...path]/route.ts` (authed binary stream), `src/app/api/vault/upload/route.ts` (commit binary), editor paste/drop handling, preview image rendering via the raw route.
- [ ] **Raw route** `/api/vault/raw/[...path]`: `getActor` gate → fetch the file bytes from GitHub (contents API or raw) → stream with the right content-type. (Serves private-repo images to the authed browser.)
- [ ] **Upload route** `/api/vault/upload` (POST, multipart or JSON base64) `{filename, dataBase64}`: `getActor` gate → commit the binary to `_attachments/<timestamp>-<filename>` (writer `createBlob` with `encoding:"base64"`) → return `{path}`. Invalidate snapshot cache (attachments aren't notes, but keep consistent).
- [ ] **Editor:** on paste/drop of an image in CodeMirror → upload → insert `![alt](/_attachments/...)` (or `![[_attachments/...]]`) at the cursor. 
- [ ] **Preview:** render `<img>` whose `src` for vault-relative paths points to `/api/vault/raw/<path>` (so private images load for the authed user).
- [ ] Tests (mocked). Gate. Commit `feat(sgnk-md): image/attachment upload + authed raw serving`.

### B12T3: daily notes + templates

**Files:** Create `src/modules/vault/presentation/daily-notes.ts` (path/template helpers), template support; command-palette + button entries.
- [ ] **Daily note:** a command + button "Open today's daily note" → path `Daily/YYYY-MM-DD.md`; if it doesn't exist, create it (via `/api/vault/create` with a daily template) then open; else open. Pure date→path helper unit-tested.
- [ ] **Templates:** read template files from a `Templates/` vault folder (snapshot) → an "Insert template" command lists them → inserts the chosen template's content at the cursor (fetch its content via `/api/vault/file`). 
- [ ] Tests (date→path, template list). Gate. Commit `feat(sgnk-md): daily notes + templates`.

### B12T4: vault-wide zip export

**Files:** Create `src/app/api/export/vault/route.ts` (or client jszip). 
- [ ] Server route `/api/export/vault` (`getActor` gate): build a zip of all vault `.md` (reuse the zipball/vault-scope) → stream as `application/zip` with `Content-Disposition: attachment; filename="sgnk-md-vault.zip"`. (Simplest: re-zip the filtered `.md` set, or pass through the GitHub zipball filtered.) An "Export vault" command/button triggers a download.
- [ ] Test (mocked). Gate. Commit `feat(sgnk-md): vault-wide zip export`.

### B12T5: in-preview editable tables

**Files:** Modify `Markdown.tsx` (table component) + a table-edit helper.
- [ ] In reading/split mode, render GFM tables with editable cells (contentEditable or input on click). On cell edit → recompute the markdown table for that table block and write back via `onToggleTask`-style `onEdit(newContent)` (reuse the draft-write path). Map the rendered table back to its source table block (by order/position).
- [ ] Pure helper `setTableCell(content, tableIndex, row, col, value): string` unit-tested. Keep scope to GFM pipe tables; degrade gracefully on complex tables.
- [ ] Gate. Commit `feat(sgnk-md): in-preview editable table cells`.

### B12T6: server-side one-click PDF

**Files:** Create `src/app/api/export/pdf/[...path]/route.ts`, a `/print/[...path]` render page (if not present). Install `@sparticuz/chromium puppeteer-core`.
- [ ] A minimal `/print/[...path]` page (auth-gated) renders a note with print CSS (reuse the export-doc HTML/CSS). 
- [ ] `/api/export/pdf/[...path]` (`getActor` gate, Node runtime): launch headless chromium (`@sparticuz/chromium`), navigate to the print page (or set its HTML), `page.pdf()` → stream as `application/pdf` download. Flag the function's memory/maxDuration appropriately. Add an Export-menu "Download PDF (server)" item.
- [ ] Verify build/bundle size acceptable. Gate. Commit `feat(sgnk-md): server-side one-click PDF`.

### B12T7: cutover + browser confirm

- [ ] Merge B12 → main → deploy. Verify build/health + new routes 401 logged-out.
- [ ] **Browser-confirm gate (required):** commit/file-ops no longer full-reload (tabs stay); paste an image → it uploads + renders; "today's daily note" opens; insert a template; export vault zip downloads; edit a table cell in preview → persists; server PDF downloads.
- [ ] Mark B12 done in roadmap; cleanup worktree.

---

## Self-Review
- Covers all deferred v2 items + the reload smoothing. ✅
- Shared provider (B12T1) is foundational and enables no-reload. ✅
- Attachments need authed raw serving (private repo) — included. ✅
- Server PDF is heavy (chromium) — isolated route, flagged. ✅
- Stable selectors; auth-gated routes; reuse writer/snapshot. ✅

## Definition of done
`npm run verify` green; browser-confirmed: no-reload commits, image upload+render, daily notes, templates, vault zip, editable tables, server PDF — live on md.sgnk.ai.
