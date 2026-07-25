# sgnk-md — Feature Gap Report

> **Implementation status (2026-06-03):** Shipped — M1–M5, S1–S7,
> C1, C2, C4, C5, C6, C8, C9, C11, C12, G1, G3, G6, K1, **plus C7 two-note
> split**. (C2 unlinked mentions, G1 AI ghost-text, C7 two-note split landed
> as the "major" follow-up pass.)
>
> **Deferred (L-effort / needs product decision):** C3 block refs, C10 comments,
> G5 outline reorder, G7 share password/expiry, K2 workspaces, K5 multi-vault,
> K6 custom pane layout.
>
> **Deferred (XL / architectural):** B1 Canvas, B2 databases, B3 Dataview,
> B4 real-time multiplayer, B5 Excalidraw, K4 plugin API, G2 vault RAG chat.

---


_Benchmarked against Obsidian, Notion, Typora, Logseq, iA Writer, VS Code._
_Date: 2026-06-03. Status reflects code actually present in `src/`._

---

## 0. Baseline — what you ALREADY have

So the gaps below are fair, here's the current capability set (verified in code):

**Editor (CodeMirror 6, source mode)**
- Line-wrapping, undo/redo history
- Format shortcuts: bold `Mod-B`, italic `Mod-I`, inline-code `Mod-E`
- Toolbar: bold, italic, strike, inline-code, H1, H2, bullet, task, quote, code-block, link, table (Material SVG icons)
- Autocomplete: `[[wikilink]]` + `#tag`
- Image **paste & drag-drop → auto-upload** to repo, inserts `![]()`
- Autosave drafts (IndexedDB, 400ms debounce) + dirty tracking
- Multi-note **tabs**; modes **edit / reading / split** (persisted)

**Rendering & knowledge**
- GFM: tables (**inline-editable**), task lists (**interactive toggle**), strikethrough, autolinks, footnotes
- Code syntax highlighting (highlight.js), **KaTeX math**, **Mermaid diagrams**
- Callouts `> [!note]`, heading anchors/slugs
- Wikilinks `[[a]]`, `[[a|alias]]`, `[[a#heading]]`; **transclusion** `![[note]]` (with cycle-depth guard)
- **Outline / TOC**, **Backlinks** panel (linked mentions), **Graph view** (force-graph, tag-colored, hover-focus)

**Vault / data / platform**
- File tree: create note/folder, rename, delete, **move** (via menu/modal)
- **Full-text search** (MiniSearch) + title/tag/folder scopes
- **Command palette** + **Spotlight** quick-switcher
- **Daily notes**
- **Publish note → public URL** (slug + conflict handling)
- **Export**: Markdown, HTML, PDF (server/Chromium), whole-vault ZIP
- **AI**: refine, summarize, suggest-links, link-doctor (Vercel AI Gateway)
- Storage: GitHub repo via API (commit flow + OCC conflict 409)
- **PWA** + **Tauri** native app; light/dark themes; GitHub OAuth **+ username/password** login

That's a strong base. The gaps are mostly **editing ergonomics**, **knowledge-graph depth**, and **versioning/collab**.

---

## MUST HAVE
_Table-stakes for any serious markdown editor. Their absence is felt every session._

| # | Feature | Who has it | Current | Effort |
|---|---------|-----------|---------|--------|
| M1 | **In-note Find & Replace** (Cmd-F / Cmd-H, match-case, regex) | Everyone | ❌ none in editor | S — add `@codemirror/search` |
| M2 | **Auto-pair + auto-continue** — close `**`/`` ` ``/`[`/`(`, continue bullet/numbered/checkbox lists on Enter, Tab/Shift-Tab indent | Obsidian, Notion, Typora | ❌ | S–M |
| M3 | **Editor syntax styling** — real markdown token highlighting + active-line + bracket match in EDIT mode (today edit surface is near-plain) | Everyone | ⚠️ minimal | S — `syntaxHighlighting`+theme |
| M4 | **Drag-and-drop** file/folder reorder & move in the tree | Obsidian, Notion, VS Code | ❌ (menu-move only) | M |
| M5 | **Trash / soft-delete + restore** (delete today is a hard commit) | Notion, Obsidian | ❌ | M |

---

## SHOULD HAVE
_Strong expectations from any Obsidian/Notion migrant._

| # | Feature | Who has it | Current | Effort |
|---|---------|-----------|---------|--------|
| S1 | **Live Preview / WYSIWYG-while-typing** (bold, headings, lists, links render in place; raw shown only on the active line) | Obsidian Live Preview, Typora, Notion | ❌ source-only | **L** — biggest "feels less polished" gap |
| S2 | **Slash commands** (`/` → insert heading, table, callout, code, embed…) | Notion, Logseq | ❌ | M |
| S3 | **Properties / frontmatter UI** (edit YAML as typed fields, not raw text) | Obsidian Properties, Notion props | ⚠️ parsed, no UI | M |
| S4 | **Templates** (general templates + variable insertion; today only daily-note) | Obsidian Templater, Notion | ⚠️ daily only | M |
| S5 | **Version history UI** — browse git commits per note, diff, restore (commits happen, but no way to view/roll back) | Notion history, Obsidian Sync | ❌ | M (data already in git) |
| S6 | **Smart paste** — paste URL over selection → `[sel](url)`; paste rich/HTML → markdown | Notion, Obsidian | ⚠️ image-paste only | S–M |
| S7 | **Tag pane** — hierarchical tag tree with counts (today tags are searchable only) | Obsidian | ⚠️ search-only | S |

---

## COULD HAVE
_Common in mature editors; meaningful polish._

| # | Feature | Who has it | Current | Effort |
|---|---------|-----------|---------|--------|
| C1 | **Local graph** (per-note neighborhood view) | Obsidian | ⚠️ global only | S |
| C2 | **Unlinked mentions** (find notes that name this note without linking) | Obsidian | ❌ | M |
| C3 | **Block references** `[[note#^block-id]]` + embed a block | Obsidian | ⚠️ heading only | M |
| C4 | **Code folding + line numbers** (toggle) in editor | VS Code, Obsidian | ❌ | S |
| C5 | **Word count / reading time / selection stats** statusbar | iA Writer, Obsidian | ❌ | S |
| C6 | **Bookmarks / starred / pinned** notes & pinned tabs | Notion, Obsidian | ❌ | S |
| C7 | **Two-note split** (different notes side-by-side; today split = editor+preview of same note) | Obsidian, VS Code | ⚠️ partial | M |
| C8 | **PDF / video / audio / iframe embeds** (YouTube, tweets, PDF preview in note) | Notion, Obsidian | ❌ | M |
| C9 | **Import** from Obsidian/Notion/markdown-zip | Notion, Obsidian | ❌ | M |
| C10 | **Comments / annotations** on a note | Notion | ❌ | M |
| C11 | **Spellcheck** with custom dictionary | Typora, Obsidian | ⚠️ browser default | S |
| C12 | **Settings panel** + **hotkey remapping** UI | Everyone | ❌ | M |

---

## GOOD TO HAVE
_Differentiators; more build, clear value._

| # | Feature | Who has it | Current | Effort |
|---|---------|-----------|---------|--------|
| G1 | **AI: continue-writing / ghost-text autocomplete** inline | Notion AI, Cursor | ❌ | M |
| G2 | **AI chat over your vault** (RAG across notes, cited answers) | Notion Q&A, Mem | ❌ | L |
| G3 | **More AI selection actions** (translate, change tone, expand, table-ify) | Notion AI | ⚠️ refine only | S–M |
| G4 | **Focus / typewriter / zen mode** | iA Writer, Typora | ❌ | S |
| G5 | **Outline drag-to-reorder sections** + breadcrumbs | Notion | ❌ | M |
| G6 | **Export to DOCX / Pandoc formats** | Typora, Obsidian | ⚠️ MD/HTML/PDF | M |
| G7 | **Public-page polish** — password-protected/expiring shares, custom theme | Notion sites | ⚠️ basic publish | M |

---

## BETTER TO HAVE
_Advanced / heavy; premium-tier capabilities._

| # | Feature | Who has it | Current | Effort |
|---|---------|-----------|---------|--------|
| B1 | **Canvas / whiteboard** (spatial node board) | Obsidian Canvas | ❌ | L |
| B2 | **Databases / Bases** (table/board/gallery views over note properties) | Notion DBs, Obsidian Bases | ❌ | L |
| B3 | **Query language** (Dataview-style live queries over vault) | Obsidian Dataview | ❌ | L |
| B4 | **Real-time multiplayer editing** (CRDT, shared cursors) | Notion, Google Docs | ❌ | XL — needs new sync layer |
| B5 | **Excalidraw / freehand drawing** blocks | Obsidian, Notion | ❌ | L |

---

## CAN HAVE
_Niche or lowest-priority; nice if cheap._

| # | Feature | Who has it | Current | Effort |
|---|---------|-----------|---------|--------|
| K1 | **Vim / Emacs keybindings** mode | Obsidian, VS Code | ❌ | S (`@replit/codemirror-vim`) |
| K2 | **Workspaces / saved layouts** | Obsidian | ❌ | M |
| K3 | **Presence indicators** (who's viewing) | Notion | ❌ | M (needs B4) |
| K4 | **Plugin / extension API** for third-party add-ons | Obsidian | ❌ | XL |
| K5 | **Multiple vaults / repo switching** | Obsidian | ❌ (single repo) | M |
| K6 | **Tabbed sidebars / customizable panes layout** | Obsidian | ⚠️ fixed | M |

---

## Suggested reading of the buckets

- **Highest leverage for "feels professional like Obsidian":** S1 Live Preview, M2 auto-pair/list-continue, M3 editor syntax styling, M1 find-replace. These four change the *minute-to-minute feel* more than anything else.
- **Highest leverage for "knowledge tool":** S3 properties UI, C1 local graph, C2 unlinked mentions, S5 version history.
- **Cheapest wins (S-effort):** M1, M3, S7, C4, C5, C6, K1 — several could land in one batch.
- **Biggest bets (XL):** B4 multiplayer, K4 plugin API — only if that's the product direction.

Effort key: **S** ≈ <1 day · **M** ≈ 1–3 days · **L** ≈ ~1 week · **XL** ≈ multi-week / architectural.
