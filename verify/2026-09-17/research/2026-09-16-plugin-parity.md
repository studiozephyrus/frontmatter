# Plugin parity: every widely used Obsidian plugin, and what frontmatter ships instead

"Ships today" was checked against the source on 16 September 2026 (component and helper
names given). Downloads from the Obsidian registry the same day.

## Already in the app

| Plugin (downloads) | frontmatter today | Evidence in code |
|---|---|---|
| Advanced Tables (3,193,578) | Editable tables | `preview/markdown/editable-table.tsx`, `preview/table-edit.ts` |
| Editing Toolbar (1,891,756) | The twelve-button toolbar | `editor/Toolbar.tsx` |
| Admonition (968,150) | Callouts | `preview/markdown/callout.tsx`, slash command "Callout" |
| Various Complements (593,733) | Wikilink and tag completion, AI ghost text | `editor/completions.ts`, `editor/ghost-text.ts` |
| Quick Switcher++ (474,516), partly | Cmd K switcher, Cmd P command palette, fuzzy match | `app-shell/Spotlight.tsx`, `CommandPalette.tsx`, `fuzzy.ts` |
| Hider (459,258), partly | Focus mode, line numbers, scrollbar toggle | `editor-settings.ts`, `ScrollbarToggle.tsx` |
| Pandoc Plugin (553,114), partly | Export .md, HTML, Word (.doc), PDF | `export/ExportMenu.tsx` |
| Better Word Count (613,575), partly | Word count and reading time | `EditorPane.tsx` status bar |
| Outliner (1,408,848), partly | Folding | `editor/CodeMirrorEditor.tsx` |
| Calendar and Periodic Notes, partly | Daily-note paths and a template | `vault/daily-notes.ts` |
| Templater (5,599,853), partly | Variables `{{date}}` `{{datetime}}` `{{time}}` `{{title}}` | `vault/template-vars.ts` |
| Git (3,143,722), partly | Version history, the GitHub commit bar | `editor/HistoryModal.tsx`, `repository/CommitBar.tsx` |
| Text Generator (582,200) | AI verbs on a selection | `editor/AIMenu.tsx` |
| Importer (1,671,435), partly | Import .md files only | `app-shell/ImportModal.tsx` |
| Also shipping, no plugin needed | Graph view, transclusion, unlinked mentions, link doctor, properties, trash, vim, spellcheck, slash commands (14) | `graph/GraphView.tsx`, `preview/EmbeddedNote.tsx`, `UnlinkedMentions.tsx`, `LinkDoctorModal.tsx`, `PropertiesPanel.tsx`, `vault/TrashModal.tsx`, `editor/slash-commands.ts` |

## Missing: build in MVP 0

| Plugin (downloads) | What we build | Where | Size |
|---|---|---|---|
| Excalidraw (7,974,073) | Draw inside a note: an `fm-draw` block backed by the MIT Excalidraw component, saved as data in the file | In the document | L |
| Templater (5,599,853) | A template picker, template folders, prompts for values, the variables we already have | Empty document, Cmd P | M |
| Tasks (4,243,906), TaskNotes (1,528,439), Checklist (458,452) | One tasks view across every note: open, due, done, by project; due dates as plain text | Right pane, new panel | M |
| Calendar (3,104,301), Periodic Notes (758,172) | A month calendar in the right pane; daily, weekly and monthly notes | Right pane | M |
| QuickAdd (2,113,472) | Quick capture: one box from anywhere, into an inbox or today's note; the phone share sheet | Global shortcut, PWA share target | M |
| Omnisearch (1,879,201) | Ranked full-text search with headings and a preview | Header search | M |
| Importer (1,671,435) | Import from Notion, Evernote, Apple Notes, Bear, Google Docs and Word | First run, Cmd P | L |
| Style Settings (2,683,101), Minimal Theme Settings (1,802,634) | Appearance: accent colour, font, line width, density | Settings | S |
| Iconize (2,223,098) | Material Symbols on files and folders | Tree | S |
| Outliner (1,408,848) | Move list items, zoom into a bullet | Editor | S |
| Homepage (1,332,645) | Choose a start page | Settings | S |
| Recent Files (1,188,494) | A recent section in the tree and in Cmd K | Tree | S |
| Tag Wrangler (1,092,388) | Rename and merge tags | Tags panel | S |
| Notebook Navigator (971,308) | A notes list with title, first line and date, like Apple Notes | Tree toggle | M |
| Hover Editor (589,500) | Page preview on hovering a link | Editor | S |
| Highlightr (719,616) | Highlight colours | Toolbar | S |
| Paste URL into selection (495,249) | Paste a URL over selected text to make a link | Editor | S |
| Natural Language Dates (519,742) | "next friday" becomes a date | Slash menu | S |
| Image Converter (527,403) | Compress and resize an image on paste | Editor | S |
| Better Word Count (613,575) | Count for the selection | Status bar | S |
| Advanced URI (650,384) | Deep links into a note, for the desktop app | Desktop | S |

## MVP 1

| Plugin (downloads) | What we build | Size |
|---|---|---|
| Dataview (4,967,706), make.md (868,019), Meta Bind (529,929) | Views: tables and lists over notes filtered by properties and tags | L |
| Kanban (2,668,372) | An `fm-kanban` block over a task list | M |
| Claudian (2,112,607), Copilot (1,900,500) | An agent panel in the desktop app that runs the user's own agent against the project | L |
| Smart Connections (1,201,036) | Related notes by meaning | M |
| Local REST API with MCP (725,676) | The MCP server and API | M |
| Mind Map (885,474), Markmind (601,664) | A note's outline as a mind map | M |
| Advanced Slides (836,896) | Slides from a note, one template | M |
| Commander (707,683) | A customisable toolbar | S |

## Later, not in the plan's first year

Advanced Canvas (822,469), PDF++ (793,682), Annotator (597,009), Zotero Integration (557,388),
Spaced Repetition (597,238), Latex Suite (594,976), Day Planner (885,989), Full Calendar (461,523),
Buttons (456,477), Self-hosted LiveSync (934,122), Remotely Save (2,232,028; our own sync replaces it),
BRAT (1,042,157; there is no plugin system to test).

## What it costs

MVP 0 parity adds two L, six M and thirteen S items: 12 to 20, 18 to 30 and 13 to 26 days,
so 43 to 76 engineering days. The Google Docs and Word import line already in phase F (M, 3 to 5)
folds into the importer, so the net addition is 40 to 71 days. The whole plan moves from
115 to 196 days to 155 to 267.
