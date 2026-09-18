---
title: frontmatter, the screens
version: v8, 18 September 2026
status: the final screens, for printing
---

# frontmatter, the screens

# Part one. What is in the product

## 1. In one page

**frontmatter is a markdown editor for people whose documents are increasingly written with, and for, AI agents.**

- One account, on the web, the desktop and the phone.
- Every editing feature is free, with quantities capped.
- Password links, Medium and High ideas, and the portfolio are on Pro.

Area | What is in it
The door | Sign in with Google or GitHub, one tap. Home with five ways to start. Settings on the account
Writing | Markdown mode and Doc mode in one Live editor. Four modes: Edit, Live, Reading, Split. The twelve-button toolbar. Tabs. A rail with the outline, tags, backlinks and comments in it. Dark mode
Help while writing | An AI box on an empty document. Seven AI verbs on a selection, with accept and reject in place. A problems panel and a formatter. The whole set of instruction files an agent reads
Blocks and views | Tables, callouts, Mermaid, maths, a chart block that reads the table above it, an Excalidraw drawing block. A document viewed as a page, slides, a mind map, a kanban or an outline; the flow view is deferred. The project map
Ideas | A collapsed section at the foot of the workspace tree. Ideas listed with their state. An industry template. Three depths: Low free, Medium and High on Pro. A blueprint of fifteen files in a skill folder, with a consistency check, an unlisted link, a hash printed on the page and a kickoff prompt that checks it
Sharing | People with roles. Links that expire, and on Pro need a password. Published pages with a markdown twin. Live editing with one collaborator on Free. A change queue for every change by a person, an AI edit or an agent. Document history
In and out | Drop files or a whole folder. Import from Obsidian, Notion, Google Docs or Word. GitHub connected as an app, Google Drive as two-way sync. Export to markdown, HTML, Word or PDF
Everywhere | Offline in the browser. The desktop app, with files on disk and no document limit. The phone, with a bottom bar, drawers, quick capture and the share sheet
Configuration | What each plan allows, the model routing, the provider chain and four feature flags, all set from a panel rather than from the source. Founders only
Money | Free: 50 cloud documents, 1 GB of uploads, 5 published pages, 1 live collaborator, 7-day history, 1 repository with 20 pushes, 1 Low blueprint and 10 AI edits a month. Pro at ₹299 a month: unlimited, 90-day history, password links, Medium and High, 100 edits and 5 blueprints on Claude, the portfolio
Later | The portfolio at frontmatter.in/@handle, the MCP server and API, Team, a custom domain, kanban and chart blocks

## 2. Reading the screens

- **Thirty-eight screens.** Thirty-four are the product. The last four are the configuration panel, which only a founder sees. Four screens carry a second or third frame for a state the founders asked to see.
- **Each screen** shows the desktop at 1,440 by 900 beside the phone at 390 by 844, both drawn from the design tokens of the shipped app, and then lists what is on it.
- **The phone follows the shipped code and carries the desktop's theme:** the mark, the title with its project, the editor full width, and the tree and the right pane as drawers.
- **The bottom bar** carries five actions at thumb height: Home, Search, AI, Outline and More, in that order.
- **The order follows a person's day:** sign in, write, decide, share, bring things in, use it everywhere, and then the states nobody wants to see.
- **The reasons behind each screen** are in the product guide, sections 21 and 22. This sheet shows only what a person sees.

# Part two. The screens

## 3. Getting in

### S01. Sign in

<div class="pair"><img src="screens/s01-sign-in.png"><img src="screens/s01-sign-in-phone.png"></div>

- The wordmark, one line of promise, Continue with Google, Continue with GitHub.
- The fine print says what we do not do: no password, no puzzle, no tour, no training on documents, and links the provider list that makes that true.
- Privacy and Terms link to pages that serve without an account (F054). The right half shows the editor once, so the page is not a wall.

### S02. Home, first time

<div class="pair"><img src="screens/s02-home-first.png"><img src="screens/s02-home-first-phone.png"></div>

- Five ways to start: a blank document, from an idea, import, from GitHub, a template.
- Three tabs: Documents, Ideas, Shared with me.
- The empty state names the free caps once and says you can drop a folder anywhere.

### S03. Home

<div class="pair"><img src="screens/s03-home.png"><img src="screens/s03-home-phone.png"></div>

- Recent documents with project, opened and owner. The Ideas count sits on the home tabs; in the workspace, ideas are a section of the tree.
- A quiet pill shows cloud documents used against the cap.
- The phone shows four starts and the list.

## 4. Writing

### S04. Workspace

<div class="pair"><img src="screens/s04-workspace.png"><img src="screens/s04-workspace-phone.png"></div>

- Tabs at the top, then one toolbar row, then the document. Share is an icon. The workspace carries the mark and not the wordmark, because the wordmark is for the front door and the published page.
- **The left rail is where things are made and put.** Two buttons, Add file and Add idea. Upload lives inside Add file, next to New document and Import from, and the whole tree is a drop target with the hint always visible. There is no third button competing with those two (F073).
- **Ideas is a collapsed section at the foot of the tree**, the way the outline sits on the right. Notes stays open, Ideas stays shut until it is wanted `[Z]`.
- **Every collapsible is at the top of the right rail**, closed, so the outline takes the height and the AI panel has room to open below `[Z]`.
- Shortcuts is gone. The tree shows all fifteen blueprint files (F019). The history row reads "7 days" on Free (F018).
- The phone keeps the toolbar to seven tools and puts the mode segment in the header.
- **The AI launch works like Notion's.** A small Ask AI button floats at the bottom right of the document, and Space on an empty line does the same. It opens the AI box over the workspace, anchored under the block being worked on, rather than taking a row of the layout. The rail keeps only the credit meter `[Z]`.

<div class="pair"><img src="screens/s04-workspace-add.png"><img src="screens/s04-workspace-add-phone.png"></div>

- **The Add file menu:** New document, Upload files, Upload a folder, and Import from. On the phone it is a sheet with Add idea at the foot.

<div class="pair"><img src="screens/s04-workspace-ai.png"><img src="screens/s04-workspace-ai-phone.png"></div>

- **The AI box open over the workspace.** The paragraph it will touch is tinted, the first line names the document and the section, and the common verbs sit under the input with their cost.

### S05. Doc mode

<div class="pair"><img src="screens/s05-doc-mode.png"><img src="screens/s05-doc-mode-phone.png"></div>

- The Google-Docs-shaped toolbar's first level: style, bold, italic, underline, strikethrough, lists, checklist, image, table, link, comment, page break. **Font face and size sit on this first level**, a short list of fonts and a size stepper `[Z]`. Colour, highlight and alignment sit behind More (F020).
- A paper surface with a ruler. Comments in the margin. Suggesting mode.
- One toast, once: Doc mode is a view; the file is still 00-BRIEF.md; page setup lives in its front matter; colours and fonts render here and export to PDF only.

### S06. AI writing box

<div class="pair"><img src="screens/s06-ai-writing.png"><img src="screens/s06-ai-writing-phone.png"></div>

- **The box names its target on its own first line**, so there is never a question about what is about to be touched: writing a new document, editing a named one, or working on a named idea. Change is one click away `[Z]` (F074).
- When an idea is in progress that line is pinned and does not scroll away `[Z]`.
- The box anchors to the content, below it when there is room and to the right when there is not `[Z]`.
- One box on an empty document. Four chips for the common asks. A second row for the other ways to start.
- The cost is stated before the click: one edit credit, seven of ten left. The rail counts are zero on an empty document (F022).
- Taking it to Ideas is a chip, not a second product.

<div class="pair"><img src="screens/s06-ai-writing-idea.png"><img src="screens/s06-ai-writing-idea-phone.png"></div>

- **Beside the content, on an idea.** On a page that already has text the box opens to the right of it. Working on an idea, the first line reads Idea and the idea's name, and it stays pinned while the idea is open. The idea itself is open from the Ideas section of the tree.

### S07. AI edit

<div class="pair"><img src="screens/s07-ai-edit.png"><img src="screens/s07-ai-edit-phone.png"></div>

- Seven verbs on a selection. The suggestion appears in place with Accept and Reject of equal weight next to it.
- The menu says which provider the month runs on.
- On the phone the menu is a sheet.

### S08. Custom blocks

<div class="pair"><img src="screens/s08-custom-blocks.png"><img src="screens/s08-custom-blocks-phone.png"></div>

- Split view. A table, a chart block that reads the table above it, a Mermaid flowchart, a callout, maths.
- The left pane states what each block becomes elsewhere: GitHub, Obsidian, VS Code.
- The phone shows the rendered side.

### S09. Flow view

<div class="pair"><img src="screens/s09-flow-view.png"><img src="screens/s09-flow-view-phone.png"></div>

- **Deferred to Later by the founder, 18 September.** Drawn for the record, not built in MVP 0 `[Z]`.
- View as: Page, Flow, Slides, Mind map, Kanban, Outline.
- Flow reads the document as phases and steps: an H2 is a phase, an H3 is a step, a bracketed first word is the tag, a trailing line is the reference.
- A legend for the lanes. Scrolls sideways with the arrow keys.

### S10. Problems

<div class="pair"><img src="screens/s10-problems.png"><img src="screens/s10-problems-phone.png"></div>

- **A filter across the top: All, Checks, Writing**, so a deterministic finding and a model's opinion are never mixed into one list `[Z]`.
- Broken links, heading skips, missing alt text, table shape, and one advisory writing note, each true of the document shown (F022).
- **Spelling with a project dictionary, and a front matter schema check**, because those are the two most-installed checks in the world and neither needs a model `[O]`.
- Fix all safe. Rules.
- **Structural checks run on the device and cost nothing.** That is the sales line: eleven separate tools, four package managers and nine configuration files to get this elsewhere, or open the file `[O]`.

### S11. Instruction files

<div class="pair"><img src="screens/s11-instruction-files.png"><img src="screens/s11-instruction-files-phone.png"></div>

- **The whole instruction-file set, not one file** `[Z]`: AGENTS.md as the source, CLAUDE.md as a one-line import, and the copies for Copilot, Cursor and Gemini, each with the tools that read it.
- A copy that has drifted from the source is flagged, and a missing one is named. The tree shows the full kit (F019).
- The panel says a file is correct. It never claims that tidying it makes an agent better, because two studies found these files do not raise task success `[O]`.
- Tidy this file, one credit.

## 5. Ideas

### S12. Ideas

<div class="pair"><img src="screens/s12-ideas.png"><img src="screens/s12-ideas-phone.png"></div>

- **Inside the workspace.** Ideas is the collapsed section at the foot of the tree; opening it lists the ideas with their state (draft, decided so far, blueprint version), and a new idea opens as a tab like a document `[Z]`.
- One centred column and one input, the way Claude and ChatGPT start. No step breadcrumb.
- The idea, an attached drawing, a document or a repository. An industry template, or one generated for your industry. The drawing is described in the frontend spec the kit now carries (F025).
- The depth chooser: Low free, Medium Pro, High Pro plus credits. Start at Low and go deeper later without losing answers.

### S13. Idea mode, Low

<div class="pair"><img src="screens/s13-idea-low.png"><img src="screens/s13-idea-low-phone.png"></div>

**The question set is generated, and it changes as you answer.** New on 18 September `[Z]`.

- **Ten to fifteen questions**, the count set by how complex the idea is, **four to a page at most**.
- **The whole set is generated once**, from the idea, in one call, so the first page appears with everything already planned and nothing to wait for.
- **Each question carries a branching flag.** Only an answer to a branching question rewrites the later pages. Most answers do not, so most page turns are instant and cost nothing.
- **When a rewrite fires, the affected card blurs and says why**, naming the answer that caused it. It means something because it is rare (F075).
- Rewrites are capped at three a blueprint on Free and unbounded on Pro. Costed in section 14.
- **Skip and Choose the recommendation on every page. Skip all from page two**, behind a modal that says plainly that every remaining question takes its recommendation, and that the brief, the blueprint and the kickoff prompt all follow those defaults `[Z]`.
- Only the recommended option carries its reason. Not sure is a quiet link, not a third option in every card.
- Not sure records the question as open and takes the recommendation for now; DECISIONS.md carries it as open, not as decided.
- The blueprint's fifteen files are listed before a credit is spent.
- **Use a standard question set** is a switch under the page controls, off by default. It is the fallback when the model layer is degraded or the rewrites are spent, and it shows how many rewrites are left on Free.
- **The phone carries the same controls as the desktop**: Skip and Choose recommendation, then Next, pinned to the foot of the screen, with Skip all added from page two.

### S14. Idea mode, Medium and High

<div class="pair"><img src="screens/s14-idea-medium.png"><img src="screens/s14-idea-medium-phone.png"></div>

**The same layout as Low, deliberately.** There is no second route to learn `[Z]`.

- The same progress line, the same selector pill, the same Skip, Choose the recommendation and Next.
- A decision card: where it stands, what forces the choice, options with gains and costs, evidence rows, the recommendation. On Medium the web rows are labelled as the template's sources with the date they were last checked; only High opens pages (F037).
- The answer is recorded in DECISIONS.md with its evidence.
- High adds a research pass before this step, run in the background.

### S15. Blueprint ready

<div class="pair"><img src="screens/s15-blueprint-ready.png"><img src="screens/s15-blueprint-ready-phone.png"></div>

- Fifteen files in a skill folder: SKILL.md loads first, AGENTS.md, the numbered documents including the frontend spec, specs, DECISIONS.md, MAP.md, graph.json, the manifest and checksums.
- A consistency check ran before you saw it. An unlisted link. A kickoff prompt for Claude Code, Cursor or Codex that verifies the tarball against the hash printed on this page before it unpacks, and reads before it builds (F028).
- Edit, then publish v2.

### S16. The map

<div class="pair"><img src="screens/s16-map.png"><img src="screens/s16-map-phone.png"></div>

- The documents, what each governs, the decisions behind them, and the instruction file, as a graph. The map counts twelve markdown documents; the three data files are not nodes (F038).
- Rebuilt on every save from the files, so it costs no credits.
- MAP.md and graph.json ship inside the kit.

## 6. Sharing

### S17. Share

<div class="pair"><img src="screens/s17-share.png"><img src="screens/s17-share-phone.png"></div>

- People, added **by their frontmatter email address**, with a role from the matrix in section 19.
- **If the address is not a frontmatter account, the screen says so and offers an invite.** Both sides get 5 AI credits when the invited person signs in for the first time. The same modal is reused for referrals afterwards `[Z]`.
- **One live collaborator on Free**, several on Pro `[Z]`. The free number is a cost decision, and section 13 carries it.
- A link that can read, expire, or need a password on Pro.
- The published page toggle, with pages used against the cap.

<div class="pair"><img src="screens/s17-share-referral.png"><img src="screens/s17-share-referral-phone.png"></div>

- **The same modal after sign-up.** The invited person lands on the shared document with a welcome that says both sides got the credits, and a field to invite someone of their own. Nothing is sent until they press Send `[Z]`.

### S18. Published page

<div class="pair"><img src="screens/s18-public-view.png"><img src="screens/s18-public-view-phone.png"></div>

- **The page renders first, with no gate, no redirect and no probe.** It reads without an account.
- **After it has painted, a dismissible bar offers where to open it**: the desktop app when the app has registered its protocol handler, frontmatter on the web otherwise, or stay here. It is an offer, and dismissal is remembered `[Z]`.
- **`page.md` and `llms.txt` are never gated, never redirected and never given an interstitial.** That rule is absolute and covers every non-HTML route (F076).
- **The sign-in boundary is editing, not reading.** A reader who presses Edit meets sign-in, which costs nothing at the top of the funnel.
- The footer carries Report, Privacy, Terms and the `.md` twin (F033).
- On the phone the same bar opens out into the ladder: open in the app, open in frontmatter, or continue in browser `[Z]`.

<div class="pair"><img src="screens/s18-public-view-password.png"><img src="screens/s18-public-view-password-phone.png"></div>

- **A password link**, which is Pro: the gate a reader meets on a protected link, with the same footer. The published page itself never has one.

### S19. Live collaboration

<div class="pair"><img src="screens/s19-live-collab.png"><img src="screens/s19-live-collab-phone.png"></div>

- Presence avatars, a named cursor, the other person's text highlighted as it lands.
- The toast states the free limit once: **one live collaborator on Free**, several on Pro `[Z]`.
- On the phone, presence sits in the header.

### S20. Document review

<div class="pair"><img src="screens/s20-review.png"><img src="screens/s20-review-phone.png"></div>

- **A filter across the top: All, People, AI and agents.** Human work and machine work are never combined into one undifferentiated list `[Z]`.
- Changes waiting, each with who made it: a person, an AI edit you asked for, or an agent that edited the file on disk through the desktop folder.
- Accept, Reject and Reply of equal weight. Accept all applies only to a named person's edits and asks you to confirm the count first; AI and agent items are accepted one by one with the diff shown (F029).
- Changed spans highlighted in the document.

### S21. Document history

<div class="pair"><img src="screens/s21-history.png"><img src="screens/s21-history-phone.png"></div>

- Every version with its author, including the AI edit and the blueprint write.
- A diff against the current version. Restore, or copy as a new document.
- Seven days on Free, 90 on Pro.
- **A People and AI filter**, the same as S20's, because history mixes the two `[Z]`.

## 7. Bringing things in and out

### S22. Import

<div class="pair"><img src="screens/s22-import.png"><img src="screens/s22-import-phone.png"></div>

- Drop files or a folder. A folder keeps its structure and becomes a project.
- Six sources: a folder, GitHub, Google Drive, Google Docs, Word, a Notion export. A Google Doc over 10 MB is refused with the reason (F024).
- The progress panel says what was kept byte for byte, what was uploaded, and what needs a look. On the phone, sharing from another app is offered after install on Android and said plainly to be absent on iOS (F036).

### S23. Connections

<div class="pair"><img src="screens/s23-connections.png"><img src="screens/s23-connections-phone.png"></div>

- Google Drive: the folder, the scope, the conflict rule, "a change in Drive shows up here within a few minutes" (F027). Change folder, pause, disconnect.
- GitHub: "GitHub grants this app the whole repository; frontmatter only ever writes under docs/" (F034). Pushes used, revocable on GitHub.
- Your agents: marked Later, with the MCP server (F035).

## 8. Everywhere

### S24. Offline

<div class="pair"><img src="screens/s24-offline.png"><img src="screens/s24-offline-phone.png"></div>

- A banner, last synced time, changes waiting.
- AI edit is disabled with a one-line reason; on the desktop the local model takes over (F039).
- The desktop card: files on disk, fully offline, no document limit.

### S25. Desktop app

<div class="pair"><img src="screens/s25-desktop.png"><img src="screens/s25-desktop-phone.png"></div>

- Cloud projects and folders on this Mac in one tree. Saved to disk.
- The same header, tabs and toolbar as the web.
- The phone page emails you the download link: Mac now, Linux unsigned, Windows coming (F047).

### S26. Quick capture

<div class="pair"><img src="screens/s26-quick-capture.png"><img src="screens/s26-quick-capture-phone.png"></div>

- A global shortcut opens one box that saves into an inbox note. No credits.
- On the phone, the share sheet from any app lands in the same inbox, on Android after install.
- The install card appears once.

### S27. Dark mode

<div class="pair"><img src="screens/s27-workspace-dark.png"><img src="screens/s27-workspace-dark-phone.png"></div>

- The same workspace on the dark tokens from globals.css.
- One toggle in the header, remembered on the account.

## 9. Account

### S28. Settings

<div class="pair"><img src="screens/s28-settings.png"><img src="screens/s28-settings-phone.png"></div>

- Ten sections, from Account and Appearance through Editor, Writing, AI, Connections and Sharing to Data and export, Shortcuts and Plan and usage.
- Spellcheck says it is the browser's own (F048). Two AI switches: ghost text as you type, off by default, and AI on a selection or in the box (F049). Mark AI text in the version record.
- Settings live on the account, so every device agrees.

### S29. Plan and usage

<div class="pair"><img src="screens/s29-plan-usage.png"><img src="screens/s29-plan-usage-phone.png"></div>

- Four meters: edits, blueprints, cloud documents, published pages. "Allowances reset 1 October" (F053).
- Free and Pro side by side, the price marked GST inclusive (F051). Team and Enterprise named as coming.
- UPI and cards, cancel any time, top-ups.

### S30. Portfolio

<div class="pair"><img src="screens/s30-portfolio.png"><img src="screens/s30-portfolio-phone.png"></div>

- One file, portfolio.md. The front matter keys are name, handle, title, links, projects, writing and theme, the same list section 10 specifies (F052). The H2 sections are the page, the writing folder is the blog.
- Published at frontmatter.in/@handle, served from the stored file, no build step. No Follow button; there is no social feature in this plan.
- Pro, and late.

## 10. The states nobody wants, drawn anyway

### S31. Conflict

<div class="pair"><img src="screens/s31-conflict.png"><img src="screens/s31-conflict-phone.png"></div>

- Two versions of the same document side by side, each with its author, device and time. Nothing was merged.
- Keep left, keep right, or keep both as two files. The other version is always in history.
- **Let AI decide** is offered alongside those, not hidden. It proposes a merge, and that proposal enters the change queue like any other, to be accepted or rejected span by span `[Z]`. It never writes straight to the file, because no silent merge is a law and this is exactly the case it exists for.
- The same screen serves a Drive edit against a web edit and a desktop edit against a GitHub change.
- The phone carries Let AI decide beside Keep both, so it is not hidden there either.

### S32. AI unavailable

<div class="pair"><img src="screens/s32-ai-unavailable.png"><img src="screens/s32-ai-unavailable-phone.png"></div>

- The AI box when every provider in the chain has refused or timed out: the document is untouched, nothing was charged, try again in a minute, or on the desktop use the local model.
- The status of each provider in the chain, in its real order with OpenRouter in it, so the person knows it is not their document.
- For an idea, one more path: use the standard question set, which needs no model.

### S33. Over the cap

<div class="pair"><img src="screens/s33-over-cap.png"><img src="screens/s33-over-cap-phone.png"></div>

- What happened: the 50th cloud document, or the tenth edit, or the fifth page. What still works: every document opens, edits and exports.
- What to do: delete or export something, wait for the reset, or move to Pro. The desktop app has no cap and is named.
- A downgraded account meets the same screen: nothing is deleted, nothing new is created until under the cap.

### S34. Ideas, empty

<div class="pair"><img src="screens/s34-ideas-empty.png"><img src="screens/s34-ideas-empty-phone.png"></div>

- The Ideas section before the first idea, drawn in the workspace like S12: the same centred column and input with the depth selector, what a blueprint is in one line, and no step breadcrumb.
- The empty state says in plain words that a folder of notes can be dropped here to start from.
- One hand-made example kit to open and read, so the person sees the fifteen files before spending a credit.

## 11. The configuration panel, which only a founder sees

### S35. Configuration, plans and limits

<div class="pair"><img src="screens/s35-config-plans.png"><img src="screens/s35-config-plans-phone.png"></div>

- Every limit in one table, Free against Pro, each cell editable. This row is what the product reads; there is no second copy in the source.
- Saving says how many accounts the change moves over their cap, and names them, before it writes.
- Each row carries its own last change: who, from what, to what, and when.
- **Three rows from the review of 18 September:** question rewrites a blueprint (3 on Free, unlimited on Pro), invite credits to each side (5), and the standard question set, which is the fallback and on for both plans.

### S36. Configuration, models and providers

<div class="pair"><img src="screens/s36-config-models.png"><img src="screens/s36-config-models-phone.png"></div>

- The free chain in fallback order, each provider on or off, with what is left of today's pool beside it.
- Routing per call type and per plan: an edit, a document, a blueprint, each naming its model and what one call costs.
- A provider whose terms nobody has opened cannot be switched on. The control is disabled and says so on the row.

### S37. Configuration, features and flags

<div class="pair"><img src="screens/s37-config-flags.png"><img src="screens/s37-config-flags-phone.png"></div>

- Four flags: live editing, bring-your-own key, the email magic link, and whether a published page is indexed by default.
- Each flag names the screens it turns on or off and the plans it reaches, so nobody has to guess what a switch does.
- Two rows are shown and locked: the training promise and the age floor. The reason sits on the row rather than in a document nobody opens.

### S38. Configuration, accounts and usage

<div class="pair"><img src="screens/s38-config-accounts.png"><img src="screens/s38-config-accounts-phone.png"></div>

- Find one account, see it against every limit, and grant a time-boxed exception without moving the plan for everyone else.
- That account's ledger: what it spent, on which model, and what it cost us.
- The audit log across every setting, newest first, read-only in the panel.
