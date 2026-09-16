---
title: frontmatter, the screens
version: v4, 17 September 2026
status: companion to the product plan
---

# frontmatter, the screens

Thirty screens, each on desktop and on the phone, and what is on every one of them. The argument for each decision is in the product plan. This sheet is the product as a person will meet it: sign in, write, decide, share, bring things in, and use it everywhere.

# Part one. What is in the product

## 1. In one page

frontmatter is a markdown editor for people whose documents are increasingly written with, and for, AI agents. One account on the web, the desktop and the phone. Every feature is free. Only quantities are capped.

Area | What is in it
The door | Sign in with Google or GitHub, one tap. Home with five ways to start. Settings on the account
Writing | Markdown mode and Doc mode in one Live editor. Four modes: Edit, Live, Reading, Split. The twelve-button toolbar. Tabs. A rail with the outline, tags, backlinks and comments in it. Dark mode
Help while writing | An AI box on an empty document. Seven AI verbs on a selection with accept and reject in place. A problems panel and a formatter. A health panel for instruction files
Blocks and views | Tables, callouts, Mermaid, maths, a chart block that reads the table above it, an Excalidraw drawing block. View a document as a page, a flow, slides, a mind map, a kanban or an outline. The project map
Ideas | A separate tab. Ideas listed with their state. An industry template. Three depths: Low free, Medium and High on Pro. A blueprint of fourteen files in a skill folder, with a consistency check, an unlisted link and a kickoff prompt
Sharing | People with roles. Links that expire, and on Pro need a password. Published pages with a markdown twin. Live editing with three people on Free. A review queue for every change by a person, an AI edit or an agent. Document history
In and out | Drop files or a whole folder. Import from Obsidian, Notion, Google Docs or Word. Connect GitHub as an app and Google Drive as two-way sync. Export to markdown, HTML, Word or PDF
Everywhere | Offline in the browser. The desktop app with files on disk and no document limit. The phone with a bottom bar, drawers, quick capture and the share sheet
Money | Free: 50 cloud documents, 1 GB of uploads, 5 published pages, 3 live collaborators, 7-day history, 1 repository with 20 pushes, 1 Low blueprint plus 10 AI edits a month. Pro at ₹299 a month: unlimited, 90-day history, password links, Medium and High, 100 edits and 5 blueprints on Claude, the portfolio
Later | The portfolio at frontmatter.in/@handle, the MCP server and API, Team, a custom domain, kanban and chart blocks

## 2. Reading the screens

Each screen shows the desktop at 1,440 by 900 and the phone at 390 by 844, rendered from the same design tokens as the shipped app. The phone follows the shipped code: a 52 px bar, the editor full width, and the tree and the right pane as drawers. The bottom bar carries five actions, Home, Search, AI, Outline and More, at thumb height.

# Part two. The screens

## 3. Getting in

### S01. Sign in

<div class="pair"><img src="screens/s01-sign-in.png"><img src="screens/s01-sign-in-phone.png"></div>

- The wordmark, one line of promise, Continue with Google, Continue with GitHub.
- The fine print says what we do not do: no password, no puzzle, no tour, no training on documents.
- The right half shows the editor once, so the page is not a wall.


### S02. Home, first time

<div class="pair"><img src="screens/s02-home-first.png"><img src="screens/s02-home-first-phone.png"></div>

- Five ways to start: a blank document, from an idea, import, from GitHub, a template.
- Three tabs: Documents, Ideas, Shared with me.
- The empty state names the free caps once and says you can drop a folder anywhere.


### S03. Home

<div class="pair"><img src="screens/s03-home.png"><img src="screens/s03-home-phone.png"></div>

- Recent documents with project, opened and owner. The Ideas tab carries a count.
- A quiet pill shows cloud documents used against the cap.
- The phone shows four starts and the list.


## 4. Writing

### S04. Workspace

<div class="pair"><img src="screens/s04-workspace.png"><img src="screens/s04-workspace-phone.png"></div>

- The shipped layout, measured from source: tabs, the twelve-button toolbar, the four modes, the tree and the outline rail.
- Saved state in the toolbar. Sync state in the tree footer.
- The phone keeps the toolbar to seven tools and puts the mode segment in the header.


### S05. Doc mode

<div class="pair"><img src="screens/s05-doc-mode.png"><img src="screens/s05-doc-mode-phone.png"></div>

- The Google-Docs-shaped toolbar: style, font, size, bold, italic, underline, strikethrough, colour, highlight, alignment, lists, checklist, image, table, link, comment, page break.
- A paper surface with a ruler. Comments in the margin. Suggesting mode.
- One toast, once: Doc mode is a view, the file is still the markdown file.


### S06. AI writing box

<div class="pair"><img src="screens/s06-ai-writing.png"><img src="screens/s06-ai-writing-phone.png"></div>

- One box on an empty document. Four chips for the common asks. A second row for the other ways to start.
- The cost is stated before the click: one edit credit, seven of ten left.
- Taking it to Ideas is a chip, not a second product.


### S07. AI edit

<div class="pair"><img src="screens/s07-ai-edit.png"><img src="screens/s07-ai-edit-phone.png"></div>

- Seven verbs on a selection. The suggestion appears in place with Accept and Reject next to it.
- The menu says which provider the month runs on.
- On the phone the menu is a sheet.


### S08. Custom blocks

<div class="pair"><img src="screens/s08-custom-blocks.png"><img src="screens/s08-custom-blocks-phone.png"></div>

- Split view. A table, a chart block that reads the table above it, a Mermaid flowchart, a callout, maths.
- The left pane states what each block becomes elsewhere: GitHub, Obsidian, VS Code.
- The phone shows the rendered side.


### S09. Flow view

<div class="pair"><img src="screens/s09-flow-view.png"><img src="screens/s09-flow-view-phone.png"></div>

- View as: Page, Flow, Slides, Mind map, Kanban, Outline.
- Flow reads the document as phases and steps: an H2 is a phase, an H3 is a step, a bracketed first word is the tag, a trailing line is the reference.
- A legend for the lanes. Scrolls sideways with the arrow keys.


### S10. Problems

<div class="pair"><img src="screens/s10-problems.png"><img src="screens/s10-problems-phone.png"></div>

- Broken links, heading skips, missing alt text, table shape, and one advisory writing note.
- Fix all safe. Rules.
- Structural checks run on the device and cost nothing.


### S11. Instruction files

<div class="pair"><img src="screens/s11-instruction-files.png"><img src="screens/s11-instruction-files-phone.png"></div>

- AGENTS.md with a health panel: one file imported not copied, size under the 32 KiB cap, setup commands present, claims not verified this week.
- The agents that read it.
- Tidy this file, one credit.


## 5. Ideas

### S12. Ideas

<div class="pair"><img src="screens/s12-ideas.png"><img src="screens/s12-ideas-phone.png"></div>

- Ideas listed on the left with their state: draft, decided so far, blueprint version.
- The idea, an attached drawing, a document or a repository. An industry template, or one generated for your industry.
- The depth chooser: Low free, Medium Pro, High Pro plus credits. Start at Low and go deeper later without losing answers.


### S13. Idea mode, Low

<div class="pair"><img src="screens/s13-idea-low.png"><img src="screens/s13-idea-low-phone.png"></div>

- Twelve decisions in pages of three. Each has a recommendation and Not sure takes it.
- The blueprint's files are listed before a credit is spent.
- Steps: Describe, Decide, Write, Hand off.


### S14. Idea mode, Medium and High

<div class="pair"><img src="screens/s14-idea-medium.png"><img src="screens/s14-idea-medium-phone.png"></div>

- A decision card: where it stands, what forces the choice, options with gains and costs, evidence rows with their source and date, the recommendation.
- The answer is recorded in DECISIONS.md with its evidence.
- High adds a research pass before this step, run in the background.


### S15. Blueprint ready

<div class="pair"><img src="screens/s15-blueprint-ready.png"><img src="screens/s15-blueprint-ready-phone.png"></div>

- Fourteen files in a skill folder: SKILL.md loads first, AGENTS.md, the numbered documents, specs, DECISIONS.md, MAP.md, the manifest and checksums.
- A consistency check ran before you saw it. An unlisted link. A kickoff prompt for Claude Code, Cursor or Codex.
- Edit, then publish v2.


### S16. The map

<div class="pair"><img src="screens/s16-map.png"><img src="screens/s16-map-phone.png"></div>

- The documents, what each governs, the decisions behind them, and the instruction file, as a graph.
- Rebuilt on every save from the files, so it costs no credits.
- MAP.md and graph.json ship inside the kit.


## 6. Sharing

### S17. Share

<div class="pair"><img src="screens/s17-share.png"><img src="screens/s17-share-phone.png"></div>

- People, with a role. Three live collaborators on Free.
- A link that can read, expire, or need a password on Pro.
- The published page toggle, with pages used against the cap.


### S18. Published page

<div class="pair"><img src="screens/s18-public-view.png"><img src="screens/s18-public-view-phone.png"></div>

- Reads without an account. Download the markdown. Open in frontmatter. A quiet card offers sign-in once.
- The `.md` twin is linked in the footer for agents.
- The phone shows the password gate a reader meets on a protected link.


### S19. Live collaboration

<div class="pair"><img src="screens/s19-live-collab.png"><img src="screens/s19-live-collab-phone.png"></div>

- Presence avatars, a named cursor, the other person's text highlighted as it lands.
- The toast states the free limit once.
- On the phone, presence sits in the header.


### S20. Document review

<div class="pair"><img src="screens/s20-review.png"><img src="screens/s20-review-phone.png"></div>

- Changes waiting, each with who made it: a person, an AI edit you asked for, or an agent through the API.
- Accept, Reject, Reply, Accept all.
- Changed spans highlighted in the document.


### S21. Document history

<div class="pair"><img src="screens/s21-history.png"><img src="screens/s21-history-phone.png"></div>

- Every version with its author, including the AI edit and the blueprint write.
- A diff against the current version. Restore, or copy as a new document.
- Seven days on Free, 90 on Pro.


## 7. Bringing things in and out

### S22. Import

<div class="pair"><img src="screens/s22-import.png"><img src="screens/s22-import-phone.png"></div>

- Drop files or a folder. A folder keeps its structure and becomes a project.
- Six sources: a folder, GitHub, Google Drive, Google Docs, Word, a Notion export.
- The progress panel says what was kept byte for byte, what was uploaded, and what needs a look.


### S23. Connections

<div class="pair"><img src="screens/s23-connections.png"><img src="screens/s23-connections-phone.png"></div>

- Google Drive: the folder, the scope, the conflict rule. Change folder, pause, disconnect.
- GitHub: the repositories, the permission, pushes used, revocable on GitHub.
- Your agents: tokens that may read and propose but never apply.


## 8. Everywhere

### S24. Offline

<div class="pair"><img src="screens/s24-offline.png"><img src="screens/s24-offline-phone.png"></div>

- A banner, last synced time, changes waiting.
- The desktop card: files on disk, fully offline, no document limit.
- The phone shows the same banner.


### S25. Desktop app

<div class="pair"><img src="screens/s25-desktop.png"><img src="screens/s25-desktop-phone.png"></div>

- Cloud projects and folders on this Mac in one tree. Saved to disk.
- The same header, tabs and toolbar as the web.
- The phone page emails you the download link.


### S26. Quick capture

<div class="pair"><img src="screens/s26-quick-capture.png"><img src="screens/s26-quick-capture-phone.png"></div>

- A global shortcut opens one box that saves into an inbox note. No credits.
- On the phone, the share sheet from any app lands in the same inbox.
- The install card appears once.


### S27. Dark mode

<div class="pair"><img src="screens/s27-workspace-dark.png"><img src="screens/s27-workspace-dark-phone.png"></div>

- The same workspace on the dark tokens from globals.css.
- One toggle in the header, remembered on the account.


## 9. Account

### S28. Settings

<div class="pair"><img src="screens/s28-settings.png"><img src="screens/s28-settings-phone.png"></div>

- Ten sections, from Account and Appearance through Editor, Writing, AI, Connections and Sharing to Data and export, Shortcuts and Plan and usage.
- Settings live on the account, so every device agrees.
- The AI section has the off switch and the mark-AI-text toggle.


### S29. Plan and usage

<div class="pair"><img src="screens/s29-plan-usage.png"><img src="screens/s29-plan-usage-phone.png"></div>

- Four meters: edits, blueprints, cloud documents, published pages.
- Free and Pro side by side. Team and Enterprise named as coming.
- UPI and cards, cancel any time, top-ups.


### S30. Portfolio

<div class="pair"><img src="screens/s30-portfolio.png"><img src="screens/s30-portfolio-phone.png"></div>

- One file, portfolio.md. The front matter is the profile, the H2 sections are the page, the writing folder is the blog.
- Published at frontmatter.in/@handle, served from the stored file, no build step.
- Pro, and late.

