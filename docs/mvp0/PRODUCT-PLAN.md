---
title: frontmatter, the product plan
version: v4, 17 September 2026
status: for founder approval, then the dev plan
---

# frontmatter, the product plan

This is the plan to approve before anything is built. It replaces the MVP 0 build sheet of 16 September. What changed: the front door is now a sign-in, like Google Docs. Every feature is free and only quantities are capped. Idea mode has three depths. The Live editor gets a Doc mode. Google Drive, folder upload, password links, a settings page, a portfolio and a flow view are in. The stack and the pilot's AI providers were costed from their own pricing pages. Every decision carries its signal: `[Z]` founders decided, `[M]` a market or standards page opened and quoted, `[R]` our own earlier research, `[O]` measured this session, `[L]` a constraint, `[P]` follows from another decision.

# Part one. What we are building, and how we got here

## 1. The product in one page

frontmatter is a markdown editor for people whose documents are increasingly written with, and for, AI agents. It is a web app, a desktop app and a phone app on one account. A document is a markdown file that stays the person's own. The editor is the thing we sell. The files never are.

**The promise, in the founders' words.** No captchas, no puzzles, no tour. A simple tool with a great editor that feels like home `[Z]`. The acceptance test for every screen is that a person who knows Google Docs or Obsidian needs nothing explained.

**What it does, in six sentences.**

1. You sign in with Google or GitHub and land on your documents. Nothing is reachable without an account, exactly as Google Docs works `[Z]`.
2. You write in Markdown mode or Doc mode. Doc mode looks like Google Docs. The file underneath is the same markdown either way.
3. You describe an idea, answer questions at the depth you choose, and get a brief and a blueprint an agent can build from.
4. You share by link, with a password or an expiry, publish a page, or invite people to edit live.
5. You bring in a folder, a Google Doc, a Word file, a Notion export or an Obsidian vault, and push documents to GitHub or keep them in Google Drive.
6. It works offline in the browser, without limits on the desktop, and from the phone's share sheet.

**Who it is for.** Founders, product people and developers who brief agents. Writers who want Google Docs comfort with markdown files. Obsidian and Notion people who want their notes on the web, shared, and readable by their agents.

**What it is not.** Not a new format, not a plugin platform in year one, not a chat app with a document attached. Those three were decided and the reasons are in sections 6, 8 and 17.

## 2. What we researched, and what it found

Twelve research rounds since 29 August, all read from the pages named, none from memory. The counts below are the ones the plan rests on.

**Why anyone would switch** `[O]`. Obsidian's forum lists 6,051 feature requests. Of its 30 most-liked open requests, frontmatter answers 16. Its third most-liked request is a web version, at 949 hearts, and it is absent from Obsidian's published roadmap. Its most-liked request, editing an embedded note in place at 1,078 hearts, is an extension of the Live mode we already ship. Global search and replace, 650 hearts, still does not exist in Obsidian. The plugin registry lists 7,638 plugins with 147,920,815 downloads. Sixty plugins take 59.2 percent of them, and the plan builds those capabilities in. The single fastest-growing plugin is Claudian, an agent panel: 2,112,607 downloads since 5 December 2025. Obsidian's chief executive publishes an agent-skills repository with 48,440 stars since 2 January 2026.

**What people love and lack** `[O]`. Across the phone-app reviews we counted, clumsy editing was the top complaint at 35 of 156, then sync at 26, slow start at 13 and lost data at 13. Praise went to design at 35, simplicity at 34 and sync at 18. In the lowest-rated Notion reviews, unwanted AI appeared 13 times in 33. The ten switching drivers, by mentions across sources: own files 28, setup burden 24, databases and migration 23, AI edits you cannot switch off 21, price and metering 20, sync 19, speed 19, offline and longevity 19, open source 17, teams 16.

**The market split** `[O]`. Everything that stores a person's knowledge for an agent and charges for it keeps the data in its own database, at $8 to $375 a month. Everything that keeps knowledge in files the person owns is free and open source. Nobody sells the writing surface.

**The standards** `[M]`. AGENTS.md is used by over 60,000 projects. Claude Code does not read it and needs a one-line import in CLAUDE.md. The Model Context Protocol is a Linux Foundation project with a current spec dated 2026-07-28. SKILL.md is the skill format with a 500-line guide. These are the formats the blueprint ships in, and none of them is ours to invent.

**This round, nine new branches, each from primary pages opened on 17 September** `[M]`:

1. **Free tiers and metering across 40 products.** A cap of 5 free documents sits below every document cap found. The floor is 50. Local-first peers do not count documents at all. Section 13 has the table.
2. **The stack.** R2 is right for bytes on every stack. Firestore is the weak piece, for structural reasons rather than cost. Vercel's Hobby plan forbids commercial use, so the first bill is $20 a seat from user one. Section 15.
3. **Free model providers for the pilot.** Groq, Cloudflare Workers AI and Cerebras allow it and do not train on prompts. Gemini's free tier trains and asks you not to send confidential text. GitHub Models was retired on 30 July 2026. Section 14.
4. **Doc mode against Google Docs.** Of the 60 Google Docs features with a help page, 27 are plain markdown, 15 need an extension, and 18 cannot live in a text file at all. Section 7.
5. **What a markdown document can become.** Slides, mind maps and flow views need no new syntax. Kanban and charts from a table have no open renderer, so those blocks are ours. Section 8.
6. **Public APIs an editor can use.** Twenty were worth keeping, seven of them run entirely in the browser with no key. Section 11.
7. **What people bolt on elsewhere.** Twenty capabilities are top add-ons in three or more ecosystems, and the plan now ships every one of them by default. Section 6.
8. **Principles from primary sources.** Nielsen, Apple, Material, PAIR and Martin. Four of five sources argue against sign-in first, one argues for it if Google Docs is the reference class. Section 16.
9. **Sharing, folder upload, Drive and GitHub mechanics.** Password links are a paid feature at Dropbox, Figma and Loom, and Notion has none. Folder upload works in every browser since Safari 11.1 and iOS 18.4. Write-back to a folder works only in Chrome and Edge. Section 10 and 11.

## 3. The decisions, each with its signal

Where it lands | Decision | Signal
Front door | Sign in first. No anonymous editing. Google or GitHub, one tap, no password, no puzzle | `[Z]` the founders chose the Google Docs model. `[M]` four of five UX sources argue for delaying sign-in, so the sign-in must cost one tap and nothing else
Free and Pro | Every feature is free. Only quantities are capped | `[Z]`
Free caps | 50 cloud documents, 1 GB uploads, 5 published pages, 3 live collaborators, 7-day history, 1 GitHub repository with 20 pushes a month, 1 Low blueprint and 10 AI edits a month | `[M]` 50 is the market floor (Nuclino, Evernote, UpNote); 1 GB is Craft's free storage; 3 is HackMD's "3 invitees" and AFFiNE's "Up to 3 members"; 7 days is Notion's, Craft's and AFFiNE's history; 20 pushes is HackMD's exact free quota. The founders' candidates of 5, 2 and 1 are below every comparable, see section 13
Pro | ₹299 a month or ₹2,499 a year. Unlimited documents, pages and collaborators, 90-day history, password links, 5 blueprints at any depth and 100 edits on Claude, the portfolio | `[Z]` price. `[M]` the first paid tier across 15 peers clusters at $4 to $10; ₹299 is about $3.12
Idea mode | Three depths. Low is free with 10 to 15 questions and a recommendation each. Medium is Pro with 20 to 30 questions, each showing where it stands and what forces the choice. High adds a research pass with sources opened and dated | `[Z]` the founders' Low, Medium and High. `[R]` the decision-card shape is our own decisions site
Doc mode | A Google-Docs-shaped surface inside Live. Ships the 27 lossless features and 15 extensions. Refuses the 18 that cannot live in a text file | `[M]` Google's own rule when exporting to markdown: "Font colors, highlights, and text alignment are removed"
Sharing | Expiring links are free. Password links are Pro | `[M]` Dropbox, Figma and Loom sell passwords; Bitwarden gives free expiry with a 7-day default
GitHub | Free with a quota, unlimited on Pro, as a GitHub App with Contents permission only | `[M]` HackMD's exact model. `[M]` GitHub's own advice: "select the minimum permissions required"
Google Drive | Free. Two-way sync of the files the app created or you picked, with the `drive.file` scope | `[M]` the scope is non-sensitive and needs only basic verification; 30 saves a day cost 1,500 quota units against 325,000 a minute
Stack | R2 for bytes, Postgres on Supabase Pro in Mumbai for records and the ledger, Durable Objects with hibernation for live editing, Vercel Pro for the app | `[M]` costed in section 15: $65 a month at 1,000 users, against $43 for R2 plus Firestore, which needs a Blaze billing account and caps a record at 1 MiB
AI for the pilot | Free providers with no-training clauses, in a fallback chain. Claude for Pro from day one, for Free once there is revenue | `[M]` Groq, Cloudflare, Cerebras and SambaNova state no training. Gemini's free tier and Mistral's free plan train
Plugins | No in-process plugin system in year one. An API and an MCP server instead | `[M]` Obsidian: "cannot reliably restrict plugins to specific permissions". VS Code: "the same permissions as VS Code itself"
Representations | Mermaid, Excalidraw, Marp and markmap are embedded. Flow, kanban and table-to-chart are ours as `fm-` blocks | `[M]` licences and download counts in section 8
Portfolio | One markdown file with front matter, served at frontmatter.in/@handle. Pro, and late | `[Z]` late. `[M]` every site generator wants a folder and a build; a one-file page is the thing nobody offers
Phone | Every screen has a phone layout. A bottom bar with five actions, drawers for the tree and the right pane | `[M]` Material: compact width under 600 dp uses a navigation bar with three to five destinations
Engine | The twelve invariants of revision 3 stand unchanged | `[R]`

# Part two. The product

## 4. The journeys

**The first five minutes.** Sign in with one tap. Land on Home with five ways to start and nothing else. Type in a blank document, or describe an idea, or drop a folder. The document saves as you type. No tour appears. A tip appears only the first time you hover a control you have not used `[M]` Nielsen: "Tutorials interrupt users, don't necessarily improve task performance, and are quickly forgotten."

**Writing.** Markdown mode for people who type markdown. Doc mode for people who type in Google Docs. One switch in the Live toolbar. Edit, Live, Reading and Split stay as they are today. The AI box on an empty document, the AI menu on a selection, the problems panel and the instruction-file health panel are the four places the editor helps.

**Ideas.** A separate tab. Ideas are listed on the left with their state. The idea, its attachments and the industry template sit in the middle. Choose a depth. Answer. The blueprint is written, checked for consistency, and published at an unlisted link with a kickoff prompt.

**Sharing.** People, a link, a published page. The link can expire, or need a password on Pro. A published page reads without an account and carries a `.md` twin for agents.

**Bringing things in.** Drop files or a whole folder. Connect GitHub or Google Drive. Import Google Docs, Word, Notion exports and Obsidian vaults. Nothing is converted unless it has to be.

**Everywhere.** Offline in the browser with the honest limits stated. The desktop app with files on disk and no document limit. The phone with a share sheet into an inbox note.

## 5. The screens

Thirty screens, each on desktop and on the phone. The phone follows the shipped code: a 52 px bar, the editor full width, and the tree and the right pane as drawers. The bottom bar is new. Every screen names what is on it and why.

### S01. Sign in

<div class="pair"><img src="screens/s01-sign-in.png"><img src="screens/s01-sign-in-phone.png"></div>

- The wordmark, one line of promise, Continue with Google, Continue with GitHub.
- The fine print says what we do not do: no password, no puzzle, no tour, no training on documents.
- The right half shows the editor once, so the page is not a wall.

**Why.** `[Z]` sign-in first. `[M]` Apple: "People often abandon apps when they're forced to sign in before they can do anything useful", so the sign-in is one tap and the page shows the product behind it. `[L]` no captcha, ever.

### S02. Home, first time

<div class="pair"><img src="screens/s02-home-first.png"><img src="screens/s02-home-first-phone.png"></div>

- Five ways to start: a blank document, from an idea, import, from GitHub, a template.
- Three tabs: Documents, Ideas, Shared with me.
- The empty state names the free caps once and says you can drop a folder anywhere.

**Why.** `[M]` Nielsen on empty states: "Provide direct pathways to getting started with key tasks." `[M]` Hick's law: five choices, one of them highlighted.

### S03. Home

<div class="pair"><img src="screens/s03-home.png"><img src="screens/s03-home-phone.png"></div>

- Recent documents with project, opened and owner. The Ideas tab carries a count.
- A quiet pill shows cloud documents used against the cap.
- The phone shows four starts and the list.

**Why.** `[M]` Apple: "Restore the previous state when your app restarts", so the most recent document is first. `[P]` the caps are visible without a plan page.

### S04. Workspace

<div class="pair"><img src="screens/s04-workspace.png"><img src="screens/s04-workspace-phone.png"></div>

- The shipped layout, measured from source: tabs, the twelve-button toolbar, the four modes, the tree and the outline rail.
- Saved state in the toolbar. Sync state in the tree footer.
- The phone keeps the toolbar to seven tools and puts the mode segment in the header.

**Why.** `[R]` this is md.sgnk.ai as shipped, with the header a Home icon richer. `[M]` Material: a single pane under 600 dp.

### S05. Doc mode

<div class="pair"><img src="screens/s05-doc-mode.png"><img src="screens/s05-doc-mode-phone.png"></div>

- The Google-Docs-shaped toolbar: style, font, size, bold, italic, underline, strikethrough, colour, highlight, alignment, lists, checklist, image, table, link, comment, page break.
- A paper surface with a ruler. Comments in the margin. Suggesting mode.
- One toast, once: Doc mode is a view, the file is still the markdown file.

**Why.** `[Z]` "Google Docs features in the doc mode so that people don't have to switch." `[M]` the honest scope in section 7 says which buttons write markdown, which write front matter, and which do not exist.

### S06. AI writing box

<div class="pair"><img src="screens/s06-ai-writing.png"><img src="screens/s06-ai-writing-phone.png"></div>

- One box on an empty document. Four chips for the common asks. A second row for the other ways to start.
- The cost is stated before the click: one edit credit, seven of ten left.
- Taking it to Ideas is a chip, not a second product.

**Why.** `[R]` the funnel is the box. `[M]` PAIR: "allow users to adapt the output to their needs, edit it, or turn it off."

### S07. AI edit

<div class="pair"><img src="screens/s07-ai-edit.png"><img src="screens/s07-ai-edit-phone.png"></div>

- Seven verbs on a selection. The suggestion appears in place with Accept and Reject next to it.
- The menu says which provider the month runs on.
- On the phone the menu is a sheet.

**Why.** `[M]` Nielsen: "reversible actions whose effects are immediately visible." `[R]` the switching driver "AI edits you cannot switch off" at 21 mentions, so nothing is applied without a click.

### S08. Custom blocks

<div class="pair"><img src="screens/s08-custom-blocks.png"><img src="screens/s08-custom-blocks-phone.png"></div>

- Split view. A table, a chart block that reads the table above it, a Mermaid flowchart, a callout, maths.
- The left pane states what each block becomes elsewhere: GitHub, Obsidian, VS Code.
- The phone shows the rendered side.

**Why.** `[R]` settled: callouts for prose, fences for data. `[M]` the table-to-chart pattern exists in the wild in obsidian-charts, whose block points at a block id on the table so the table stays a plain table.

### S09. Flow view

<div class="pair"><img src="screens/s09-flow-view.png"><img src="screens/s09-flow-view-phone.png"></div>

- View as: Page, Flow, Slides, Mind map, Kanban, Outline.
- Flow reads the document as phases and steps: an H2 is a phase, an H3 is a step, a bracketed first word is the tag, a trailing line is the reference.
- A legend for the lanes. Scrolls sideways with the arrow keys.

**Why.** `[Z]` the founders' flow site is the reference. `[M]` slides and mind maps need no new syntax: Marp splits on a rule, markmap reads the outline. `[P]` every view is a projection of the same bytes.

### S10. Problems

<div class="pair"><img src="screens/s10-problems.png"><img src="screens/s10-problems-phone.png"></div>

- Broken links, heading skips, missing alt text, table shape, and one advisory writing note.
- Fix all safe. Rules.
- Structural checks run on the device and cost nothing.

**Why.** `[M]` markdownlint has 12,180,750 installs on VS Code and Prettier 71,626,148, so a checker and a formatter are expected. `[R]` the plain-language note never blocks, as our own gate works.

### S11. Instruction files

<div class="pair"><img src="screens/s11-instruction-files.png"><img src="screens/s11-instruction-files-phone.png"></div>

- AGENTS.md with a health panel: one file imported not copied, size under the 32 KiB cap, setup commands present, claims not verified this week.
- The agents that read it.
- Tidy this file, one credit.

**Why.** `[M]` AGENTS.md is used by over 60,000 projects. `[O]` all six of our own dual-file repositories use the import, so the tool teaches the import rather than diffing two copies.

### S12. Ideas

<div class="pair"><img src="screens/s12-ideas.png"><img src="screens/s12-ideas-phone.png"></div>

- Ideas listed on the left with their state: draft, decided so far, blueprint version.
- The idea, an attached drawing, a document or a repository. An industry template, or one generated for your industry.
- The depth chooser: Low free, Medium Pro, High Pro plus credits. Start at Low and go deeper later without losing answers.

**Why.** `[Z]` a separate tab with ideas on the left. `[Z]` the three depths. `[M]` Nielsen's progressive disclosure has two levels at most, and this is the second.

### S13. Idea mode, Low

<div class="pair"><img src="screens/s13-idea-low.png"><img src="screens/s13-idea-low-phone.png"></div>

- Twelve decisions in pages of three. Each has a recommendation and Not sure takes it.
- The blueprint's files are listed before a credit is spent.
- Steps: Describe, Decide, Write, Hand off.

**Why.** `[Z]` 10 to 15 questions on the free plan. `[M]` PAIR: show alternatives rather than confidence, "Showing multiple options prompts the user to rely on their own judgement."

### S14. Idea mode, Medium and High

<div class="pair"><img src="screens/s14-idea-medium.png"><img src="screens/s14-idea-medium-phone.png"></div>

- A decision card: where it stands, what forces the choice, options with gains and costs, evidence rows with their source and date, the recommendation.
- The answer is recorded in DECISIONS.md with its evidence.
- High adds a research pass before this step, run in the background.

**Why.** `[Z]` "proper insights and all evidence." `[R]` the card is the shape of our decisions site, which the founders have used for 204 decisions.

### S15. Blueprint ready

<div class="pair"><img src="screens/s15-blueprint-ready.png"><img src="screens/s15-blueprint-ready-phone.png"></div>

- Fourteen files in a skill folder: SKILL.md loads first, AGENTS.md, the numbered documents, specs, DECISIONS.md, MAP.md, the manifest and checksums.
- A consistency check ran before you saw it. An unlisted link. A kickoff prompt for Claude Code, Cursor or Codex.
- Edit, then publish v2.

**Why.** `[Z]` the kit is a skill-shaped folder. `[M]` SKILL.md and AGENTS.md are the two formats agents read today.

### S16. The map

<div class="pair"><img src="screens/s16-map.png"><img src="screens/s16-map-phone.png"></div>

- The documents, what each governs, the decisions behind them, and the instruction file, as a graph.
- Rebuilt on every save from the files, so it costs no credits.
- MAP.md and graph.json ship inside the kit.

**Why.** `[R]` our own knowledge graph in advox: 4,600 nodes so an agent can query the structure instead of reading 46,000 lines. `[P]` the map is a projection, never a second source of truth.

### S17. Share

<div class="pair"><img src="screens/s17-share.png"><img src="screens/s17-share-phone.png"></div>

- People, with a role. Three live collaborators on Free.
- A link that can read, expire, or need a password on Pro.
- The published page toggle, with pages used against the cap.

**Why.** `[Z]` password-protected sharing. `[M]` password is paid at Dropbox, Figma and Loom; expiry is free at Bitwarden with a seven-day default.

### S18. Published page

<div class="pair"><img src="screens/s18-public-view.png"><img src="screens/s18-public-view-phone.png"></div>

- Reads without an account. Download the markdown. Open in frontmatter. A quiet card offers sign-in once.
- The `.md` twin is linked in the footer for agents.
- The phone shows the password gate a reader meets on a protected link.

**Why.** `[R]` the published page is the funnel. `[M]` llms.txt and the `.md` twin pattern are what Anthropic, Cloudflare, Stripe and Vercel serve.

### S19. Live collaboration

<div class="pair"><img src="screens/s19-live-collab.png"><img src="screens/s19-live-collab-phone.png"></div>

- Presence avatars, a named cursor, the other person's text highlighted as it lands.
- The toast states the free limit once.
- On the phone, presence sits in the header.

**Why.** `[M]` Obsidian's "Multiplayer" is Planned, not shipped. `[R]` sync is git-merge plus a splice journal, never a CRDT.

### S20. Document review

<div class="pair"><img src="screens/s20-review.png"><img src="screens/s20-review-phone.png"></div>

- Changes waiting, each with who made it: a person, an AI edit you asked for, or an agent through the API.
- Accept, Reject, Reply, Accept all.
- Changed spans highlighted in the document.

**Why.** `[R]` the proposal is a first-class object: agents propose, people accept. `[M]` iA Writer now leads with authorship display, so the market has caught up with the need.

### S21. Document history

<div class="pair"><img src="screens/s21-history.png"><img src="screens/s21-history-phone.png"></div>

- Every version with its author, including the AI edit and the blueprint write.
- A diff against the current version. Restore, or copy as a new document.
- Seven days on Free, 90 on Pro.

**Why.** `[R]` every save is a new immutable key. `[M]` Notion, Craft and AFFiNE give 7 days free and 30 paid, so 90 is a visible reason to pay.

### S22. Import

<div class="pair"><img src="screens/s22-import.png"><img src="screens/s22-import-phone.png"></div>

- Drop files or a folder. A folder keeps its structure and becomes a project.
- Six sources: a folder, GitHub, Google Drive, Google Docs, Word, a Notion export.
- The progress panel says what was kept byte for byte, what was uploaded, and what needs a look.

**Why.** `[Z]` file and folder upload. `[M]` folder input works everywhere since Safari 11.1 and iOS 18.4. `[M]` Word converts in the browser with mammoth, so nothing is uploaded.

### S23. Connections

<div class="pair"><img src="screens/s23-connections.png"><img src="screens/s23-connections-phone.png"></div>

- Google Drive: the folder, the scope, the conflict rule. Change folder, pause, disconnect.
- GitHub: the repositories, the permission, pushes used, revocable on GitHub.
- Your agents: tokens that may read and propose but never apply.

**Why.** `[Z]` connect Drive and GitHub with the user's authorisation. `[M]` GitHub Apps carry "narrow, specific permissions" and tokens that "expire after 1 hour". `[R]` permissions attach to the operation.

### S24. Offline

<div class="pair"><img src="screens/s24-offline.png"><img src="screens/s24-offline-phone.png"></div>

- A banner, last synced time, changes waiting.
- The desktop card: files on disk, fully offline, no document limit.
- The phone shows the same banner.

**Why.** `[Z]` offline in the browser with browser storage. `[M]` Safari deletes script-writable storage after seven days without a visit unless the app is installed, so the banner is honest and the desktop app is promoted.

### S25. Desktop app

<div class="pair"><img src="screens/s25-desktop.png"><img src="screens/s25-desktop-phone.png"></div>

- Cloud projects and folders on this Mac in one tree. Saved to disk.
- The same header, tabs and toolbar as the web.
- The phone page emails you the download link.

**Why.** `[Z]` the offline app is the one promoted. `[L]` Microsoft's signing service excludes India and Linux needs a CI build, both known.

### S26. Quick capture

<div class="pair"><img src="screens/s26-quick-capture.png"><img src="screens/s26-quick-capture-phone.png"></div>

- A global shortcut opens one box that saves into an inbox note. No credits.
- On the phone, the share sheet from any app lands in the same inbox.
- The install card appears once.

**Why.** `[R]` QuickAdd has 2,113,472 downloads, fast capture is named in 4 or 5 of the 9 note-taking methods we read. `[M]` the share target works only in installed Chromium apps, so the phone card asks to install.

### S27. Dark mode

<div class="pair"><img src="screens/s27-workspace-dark.png"><img src="screens/s27-workspace-dark-phone.png"></div>

- The same workspace on the dark tokens from globals.css.
- One toggle in the header, remembered on the account.

**Why.** `[R]` design praised 35 times in the reviews we counted, and dark mode is expected of every editor.

### S28. Settings

<div class="pair"><img src="screens/s28-settings.png"><img src="screens/s28-settings-phone.png"></div>

- Ten sections, from Account and Appearance through Editor, Writing, AI, Connections and Sharing to Data and export, Shortcuts and Plan and usage.
- Settings live on the account, so every device agrees.
- The AI section has the off switch and the mark-AI-text toggle.

**Why.** `[Z]` a proper settings page. `[M]` the sections are the union of Notion's and Obsidian's. `[M]` Obsidian's request for one settings set across vaults has 520 hearts, and ours is by design.

### S29. Plan and usage

<div class="pair"><img src="screens/s29-plan-usage.png"><img src="screens/s29-plan-usage-phone.png"></div>

- Four meters: edits, blueprints, cloud documents, published pages.
- Free and Pro side by side. Team and Enterprise named as coming.
- UPI and cards, cancel any time, top-ups.

**Why.** `[Z]` Team and Enterprise are shown from day one. `[L]` Razorpay mandates are capped at ₹15,000 and Indian cards get one attempt.

### S30. Portfolio

<div class="pair"><img src="screens/s30-portfolio.png"><img src="screens/s30-portfolio-phone.png"></div>

- One file, portfolio.md. The front matter is the profile, the H2 sections are the page, the writing folder is the blog.
- Published at frontmatter.in/@handle, served from the stored file, no build step.
- Pro, and late.

**Why.** `[Z]` a portfolio in Pro, like the reference site. `[M]` sayak.dev is Quarto markdown plus a config file and a build on GitHub Pages. Every generator opened wants a folder and a build. A one-file page is the gap.

## 6. Built in by default, so nobody needs a plugin

The rule: if a capability is a top add-on in three or more of the ecosystems we counted, it ships built in. Twenty pass `[M]`.

Capability | Where it is a top add-on | Where it lives in frontmatter
AI assistant and agent access | Docs, VS Code, Joplin, Logseq, Craft, Notion | The AI box, the AI menu, the agents card, the MCP server
Maths and LaTeX | Docs 52M+ installs, VS Code, Joplin, Typora | KaTeX in every mode
Diagrams | VS Code 5.3M, Docs 47M+, Joplin, Logseq | Mermaid in every mode, Excalidraw as a block
Tasks and to-do views | Joplin, Logseq, Craft, Notion, VS Code | Checklists, the tasks panel, the kanban view
Templates | Joplin, Logseq, Craft, Notion 70,000+ | Home, the slash menu, the idea templates
Editable tables | Joplin, Typora, Notion, Bear | Shipped today
Outline and table of contents | Joplin, Typora, VS Code, Notion | The rail, a `[toc]` marker
Export | VS Code 4.1M, Bear, Typora, iA | Markdown, HTML, Word, PDF, and the `.md` twin on every page
Themes | Joplin, Typora, Bear, Logseq, VS Code | Appearance settings, dark mode
Calendar and daily notes | Joplin, Logseq, Craft | The month panel, daily notes
Kanban | Joplin, Notion, Obsidian 2,668,372 | View as Kanban
Backlinks and link graph | Joplin, Logseq, Typora, Notion | Shipped today, plus the map
Tags | Joplin, Bear, Craft, Logseq | Shipped today, rename and merge added
Lint, style and spelling | VS Code 12.2M and 71.6M, Docs, iA | The problems panel, the formatter, browser spellcheck
Image paste and resize | VS Code, Typora, Bear, Notion | Paste, resize, compress
Note tabs | Joplin, Logseq, VS Code, Obsidian | Shipped today
Slides | VS Code, Joplin, Obsidian | View as Slides
Drawing | Joplin, Craft, Bear, Obsidian 7,974,073 | The Excalidraw block
Version history and diff | Joplin, Craft, Notion, Docs | Document history
Citations | Logseq, Docs, VS Code | A DOI lookup in the slash menu

**What the earlier plan did not mention, now placed** `[O]`: a table of contents marker, footnotes, emoji input, link previews for external links, OCR search inside images and PDFs through Tesseract.js, a formatter, an accessibility check on the document, and a stated API rate limit. Meeting notes and a sandboxed HTML block are refused, the second because the plan bans third-party scripts on published pages.

**Notion's block inventory as a checklist** `[M]`. Notion's API lists 32 block types. frontmatter covers 26 in plain markdown or a shipped block: paragraph, three heading levels and a fourth, bulleted and numbered items, to-do, toggle as a details block, quote, callout, code, divider, table and rows, image, video and file as links, PDF as a link, bookmark as a link preview, equation, table of contents, breadcrumb from the tree, child page and database as links, embed as a link, template as a template. Not covered on purpose: column lists, synced blocks, transcription, and the unsupported form and button types, because none survives a plain markdown reader.

**Obsidian's plugins.** The parity table of revision 3 stands: 15 plugin capabilities already ship, 21 are built in MVP 0, 8 in MVP 1. The Excalidraw block, templates, tasks, calendar, quick capture, ranked search and the importer are the big six.

## 7. Doc mode, the honest scope

Google's own help lists 60 features we could find a page for `[M]`. Each sits in one of three columns.

**Plain markdown, ships lossless (27).** Bold, italic, strikethrough, capitalisation, headings, bulleted, numbered and nested lists, checklists, tables with column alignment and sorting, inline images, links, emoji and special characters, custom building blocks as snippets, and every tool that leaves the file alone: find and replace, word count, spelling, personal dictionary, autocorrect, translate, voice typing, screen reader, offline, templates, download formats.

**Needs an extension, ships with a note (15).** Underline, superscript and subscript, font family and size, text colour, highlight as `==text==`, title and subtitle as front matter, alignment, borders and shading as a fenced div, column widths, image resize, equations, footnotes, table of contents, bookmarks and internal links, citations, variable chips as front-matter keys. The note reads: renders here, exports to PDF, plain elsewhere. Colour, font and alignment stay out of the default toolbar's first level, because Google removes them on `.md` export and Typora warns they become plain text in Word.

**Cannot live in a text file, refused (18).** Line and paragraph spacing, indentation and tab stops, custom bullet glyphs, merged cells, cell colours and borders, pinned header rows, text wrap around images, crop, drawings, linked charts, page numbers, headers and footers, page and section breaks, margins and orientation, columns, pages mode, watermarks, line numbers, smart chips, dropdowns, building blocks, document tabs, comments as file content, suggesting as file content, version history as file content, task assignment, e-signature. The substitutes: a page-break marker and page setup as front matter honoured only by export, comments and suggestions in the review sidecar keyed by content hash, versions in history, tabs as files.

**The refusal rule** `[P]`. Doc mode carries a feature only if a stranger's plain markdown parser, with no editor and no export theme, still shows the author's meaning from the bytes on disk.

**What the rich editors admit** `[M]`. Tiptap's markdown extension is "a early release" and says "Comments are not supported yet". Typora: "Custom fonts in Typora are set by CSS." Google's markdown export: "Smart chips change to text or links." We are not inventing a limit. We are naming the one every tool has.

## 8. What a document can become

Representation | Renderer | Licence | Signal | Ships
Flow view | Ours: H2 as phase, H3 as step, bracketed tag, trailing reference | Ours | `[Z]` the founders' flow site | MVP 0
Diagrams | Mermaid, 90,268 stars, 12,122,962 weekly downloads, block, architecture and kanban types now exist | MIT | Renders on GitHub, Obsidian and HackMD | Ships today
Drawing and canvas | Excalidraw, 132,141 stars, saved beside the note as JSON Canvas 1.0 | MIT | 7,974,073 plugin downloads | MVP 0
Slides | Marp core, splits on a horizontal rule, no new syntax | MIT | 836,896 plugin downloads | MVP 0
Mind map | markmap, reads the outline, no new syntax | MIT | 885,474 plugin downloads | MVP 0
Kanban | Ours: headings as columns, task items as cards, the obsidian-kanban shape | Ours | 2,668,372 downloads, no open renderer | MVP 1
Charts from a table | Ours: an `fm-chart` block that points at the table above it | Ours | 324,208 downloads | MVP 1
Portfolio | Ours: one file with front matter at frontmatter.in/@handle | Ours | No comparable | Late, Pro
Maths | KaTeX, 18,887,573 weekly downloads | MIT | Universal | Ships today
Music | abcjs | MIT | HackMD renders it | Later
PDF and print | Paged.js for the browser, Pandoc on the server | MIT, GPL | Universal | MVP 0

Two things we will not embed `[M]`: tldraw, whose licence forbids production use without a key and phones home, and D2, which is MPL and duplicates Mermaid. Database views over front matter, as Obsidian's Bases, have no open renderer and wait.

## 9. Idea mode, three depths

Depth | Who | Questions | What each answer carries | What it costs us
Low | Free | 10 to 15 | A recommendation and one line of reason | About eleven model calls per blueprint on a free provider
Medium | Pro | 20 to 30 | Where it stands, what forces the choice, options with gains and costs, evidence from the person's own documents and the template's sources | The same calls on Claude, plus a retrieval pass over the project
High | Pro, 3 blueprint credits | 20 to 30 | Medium, plus a research pass before the questions: sources opened, dated and quoted, a decision record you can publish | A background job of about an hour, with web fetches

**Templates** `[Z]`. Seven industry templates ship: local service business, SaaS, marketplace, internal tool, mobile app, content site, agency. Each carries its question bank, its comparables and its sources. Generate one for my industry writes a new template from the idea and marks it as generated.

**What a template holds** `[R]`. The question order, the recommendation rules, the file list, the consistency checks, and the sources a Medium answer may cite. Templates are markdown files in a folder, so a person can read, edit and share them.

**The rule that keeps it honest** `[P]`. Low never shows evidence it did not read. Medium cites only the person's documents and the template. High cites only pages it opened, with the date. A recommendation is never a percentage `[M]` PAIR: do not show confidence when "The confidence level isn't impactful".

## 10. Sharing, publishing, portfolio

**The four ways out.** People with a role. A link with read or edit, an expiry, and on Pro a password. A published page at frontmatter.in/p/slug with a `.md` twin and a Made with frontmatter line on Free. The portfolio at frontmatter.in/@handle on Pro.

**Password links** `[M]`. Dropbox: "add a password to a shared link" on Professional and above, not on Basic or Plus. Figma: "Available on all paid plans". Loom: "Business, Business + AI, or Enterprise". Notion: "Can I password protect a page? Unfortunately, not at the moment." We store a hash, ask once per browser, and put it on Pro.

**Expiring links** `[M]`. Bitwarden gives every user a deletion date with a default of seven days. Google Drive allows expiry only on Workspace editions and never on anyone-with-the-link. Ours is free, with a seven-day default and no upper bound.

**Published pages** `[M]`. No product opened caps public pages at a small number. Notion says "Unlimited published pages" and gates one custom domain. The market's gate is the domain and the branding. Ours is five pages on Free with the line, unlimited and unbranded on Pro, and a custom domain later.

**Portfolio** `[M]`. sayak.dev is a Quarto project: one `.qmd` per page, a `_quarto.yml`, a build, GitHub Pages. Astro wants a content folder and a schema. We serve the stored file. The front matter keys are name, handle, title, links and theme, all ignorable by any other tool, so the file stays portable.

## 11. Bringing things in and out

**Folder upload** `[M]`. The folder input works in Chrome 7, Edge 13, Firefox 50, Safari 11.1, iOS Safari 18.4 and Android Chrome 132. Drag-and-drop of a folder works on desktop through the entries API. Writing back to the person's own folder works only in Chrome and Edge through the directory picker, and MDN marks that API as not baseline. So: every browser imports, Chromium browsers can keep a live folder, and everyone else gets Drive, GitHub or a download for the way back. An Obsidian vault imports as it is. Its `.obsidian` folder is read for the daily-note path and the templates folder and nothing else.

**Google Drive** `[M]`. The `drive.file` scope covers files the app created or the person picked, and needs only basic verification. `changes.list` and `files.watch` accept it. A change channel lasts a week at most, with no automatic renewal, and carries no content, so the app polls the change list from a stored page token. Cost at 30 saves a day: 1,500 quota units per user per day, against 325,000 per user per minute. The daily project threshold of 400,000,000 units covers 266,666 users at that rate. Conflicts are never merged silently. Both versions are kept and the person chooses.

**GitHub** `[M]`. A GitHub App, not a personal token. It asks for Contents read and write and nothing else. Installation tokens expire after an hour and carry their own 5,000 requests an hour. Every update sends the file's blob sha and treats a 409 as a re-read, which is the splice engine's compare-and-swap rule in GitHub's words. Free: one repository and 20 pushes a month. Pro: unlimited.

**Google Docs and Word** `[M]`. Drive exports a Google Doc as `text/markdown`. Word converts in the browser with mammoth, so the file never leaves the machine. Google's own loss statement applies to both: colours, highlights and alignment are removed.

**Notion** `[M]`. The export zip imports as a project. The API allows 180 requests a minute on a non-business workspace, which is enough to pull a workspace page by page as a later feature.

**The twenty public APIs worth using** `[M]`. Seven run entirely in the browser with no key and send no text anywhere: KaTeX, Mermaid, Tesseract.js for OCR, pdf.js and pdf-lib, the DiceBear library, and self-hosted Google Fonts. Key-less and remote, sending only the query: Wikipedia and Wiktionary at 200 requests a minute with a user agent, the Free Dictionary, Datamuse at 100,000 requests a day until 2027, Crossref and OpenAlex for a DOI, Open Library for an ISBN, arXiv at one request every three seconds, Frankfurter for currency. Behind our proxy because they need a secret: Unsplash at 50 an hour in demo and 1,000 after approval with attribution and a download ping, Pexels at 200 an hour, DeepL's developer plan at a million characters, iframely at 2,000 previews a month. Never sent document text: Semantic Scholar, whose licence lets it use what you send to improve the API, and LanguageTool's public endpoint, which says "Do not send automated requests" and caps a request at 20 KB. Grammar beyond spelling waits for a self-hosted LanguageTool.

## 12. Offline, desktop, phone

**In the browser** `[M]`. Every keystroke goes to IndexedDB or the origin private file system, which has been baseline since March 2023. Chrome allows an origin about 60 percent of the disk. Firefox allows the smaller of 10 percent or 10 GiB. Safari allows about 60 percent since macOS 14 and iOS 17, and deletes all script-writable storage after seven days of Safari use without a visit, unless the app is on the home screen. Background sync and the share target exist only in Chromium. The one rule: never let the browser be the only copy. Persist is requested inside a user gesture, and the first connection pushes everything to the server.

**The desktop app** `[Z]`. Files on disk, no document limit, fully offline, agents can read the folder. It is the one we promote, and the web app stays.

**The phone** `[M]`. Material: under 600 dp use a navigation bar with three to five destinations and one pane. Ours has five: Home, Search, AI, Outline, More. The tree and the right pane are drawers, as the shipped code does. Fitts's law sets the targets at 64 px wide.

## 13. Free and Pro

**The founders' candidates and the market** `[M]`. Forty pricing pages opened on 17 September.

Cap | Founders' candidate | Market | Recommendation
Cloud documents on Free | 5 | Unlimited at Google Docs, Notion for one person, Obsidian, HackMD, Bear and 15 others. Metered by size at Craft (1,500 blocks, 1 GB), Anytype (100 MB), AFFiNE (10 GB), Nuclino (2 GB). Counted at 50 by Nuclino, Evernote and UpNote. Figma's 3 files is the only lower number, and it comes with unlimited drafts | 50, and 1 GB of uploads. A blueprint alone is 14 files and an imported vault is hundreds, so 5 would block both funnels on the first day
Published pages on Free | 2 | No product caps public pages at a small number. Notion: "Unlimited published pages". The market gates the custom domain and the branding | 5 with the Made with line. Pro unbranded and unlimited
Live collaborators on Free | 1 | HackMD "3 invitees", AFFiNE "Up to 3 members per Workspace", Notion 10 guests, Confluence 10 users | 3 people per document
History on Free | none | Notion, Craft and AFFiNE 7 days free and 30 paid | 7 days free, 90 on Pro
AI on Free | credits | Every free tier with AI puts a number on it: Kiro 50 credits, Tana 50 queries, Mem 25 messages, Canva 20 uses, Craft 15 credits, GitBook 10 messages a week, ChatPRD 3 chats | 10 edits and 1 Low blueprint a month, top-ups on Pro
GitHub on Free | open question | HackMD: free with "20 GitHub pushes per month", unlimited at $5. GitBook: Git Sync free. Notion gates GitHub to Business at $20 | Free with 20 pushes and 1 repository. Pro unlimited. The connection is the product, so it cannot sit behind a higher tier
Password links | asked for | Paid at Dropbox, Figma and Loom. None at Notion | Pro
Google Drive | asked for | Notion gates Drive to Plus at $10. It is the person's own storage and costs us nothing | Free

**Pricing** `[Z]` `[M]`. Free at ₹0. Pro at ₹299 a month or ₹2,499 a year, which is about $3.12 at ₹95.96 to the dollar. The first paid tier across peers: Obsidian Sync $4, Anytype $4, HackMD $5, Confluence $5.42, Docmost $6, AFFiNE $6.75, Craft $7.99, Nuclino $8, Mem $9, Capacities $9.99, then Notion, Slite, Outline, Linear and Reflect at $10. AI-forward tools sit at $15 to $20. We sit under all of them with more in the box. Top-ups: 50 edits for ₹99, 3 blueprints for ₹149. Team, with seats and one bill, after Pro. Enterprise later. No student tier `[Z]`.

**What Pro buys, in one line** `[P]`. Unlimited documents, pages and collaborators, 90-day history, password links, Medium and High ideas, 100 edits and 5 blueprints on Claude, the portfolio, no branding.

## 14. AI for the pilot, and after

**The three tasks** `[R]`. An edit on a selection is about 4,000 tokens in and 800 out. A document is 2,000 in and 1,500 out. A blueprint is about 60,000 in and 23,000 out across eleven calls.

**Who allows a free pilot, verbatim from their pages** `[M]`.

Provider | Free models | Free limits | Trains on prompts
Groq | gpt-oss-120b, gpt-oss-20b, qwen3.8-27b, compound | 30 requests a minute, 1,000 a day, 8,000 tokens a minute, 200,000 a day, per organisation | No: "Groq is not permitted to use Inputs or Outputs for training"
Cloudflare Workers AI | Any non-gated model, qwen3-30b among them | 10,000 neurons a day, 300 requests a minute | No: "Cloudflare does not use your Customer Content to train"
Cerebras | gpt-oss-120b, qwen-3.8-27b | $5 of credit for 30 days after a payment method, 5 requests a minute, 1,000,000 tokens a day | No
SambaNova | DeepSeek-V3.1, Llama 3.3 70B, gpt-oss-120b | 20 requests a day per model | No
OpenRouter free endpoints | 24 of 444 models at zero, served by Google AI Studio or Nvidia | 20 a minute, 50 a day, 1,000 a day once $10 has ever been bought | Depends on the endpoint's provider
Gemini API | Ten Flash and Pro models | Per-model numbers not public | Yes: "Google uses the content you submit to the Services and any generated responses to provide, improve, and develop Google products", and "Do not submit sensitive, confidential, or personal information to the Unpaid Services"
Mistral Free | $10 a month of credit | In the admin panel only | The free plan's training row is ticked with no opt-out
GitHub Models | none | "fully retired" on 30 July 2026 | n/a
Ollama on the desktop | llama3.2:3b at 2.0 GB, qwen3:4b at 2.5 GB, gemma3:4b at 3.3 GB, qwen3:8b at 5.2 GB fit an 8 GB machine | None | No: runs locally

**The routing** `[P]`. Edits go to Groq gpt-oss-120b first, then Cloudflare qwen3-30b, then Cerebras, then OpenRouter's Nvidia-served free endpoints, then SambaNova. Documents go to Cloudflare first, then Groq. Blueprints go to Cerebras first, then OpenRouter, then Cloudflare. The desktop app offers a local model for edits, with nothing leaving the machine. Never in the chain: Gemini's unpaid tier, Mistral Free, and anything whose terms were not opened.

**Where each free pool runs out, arithmetic shown** `[M]`. Groq's 200,000 tokens a day at 4,800 per edit is 41 edits a day for the whole organisation, and its 8,000 tokens a minute means one edit a minute. Cloudflare's 10,000 neurons a day at 42.9 per edit is 233 edits, or 181 documents at 55 neurons, or 10 blueprints at 978. Cerebras' 1,000,000 tokens a day at 83,000 per blueprint is 12 blueprints a day, and its $5 buys about 130 at $0.0383 each. So the free chain carries roughly 270 edits, 180 documents and 20 blueprints a day. Past that, the cheapest paid step is Cloudflare's overage at $0.011 per 1,000 neurons.

**Cost when the free pools are gone, 1,000 free users at their caps, per month** `[M]`. Input 100 million tokens, output 31 million. Cloudflare qwen3-30b $15.49. Groq gpt-oss-20b $16.80. Gemini 2.5 Flash-Lite paid, which does not train, $22.40. gpt-oss-120b on Groq or Together $33.60. Anthropic Haiku 4.5 $255. Sonnet 5 $510, or half with batch processing. Pro runs on Claude from day one because Pro pays for it: 100 edits and 5 blueprints on Sonnet 5 cost about ₹120 of a ₹299 month at list price, less with caching and batch.

**Work that never touches a model** `[P]`. Structural checks, the formatter, search, the map, table-to-chart, word counts, spellcheck, OCR, dictionary, citations, currency, link previews, folder import and every representation. That is most of what the editor does in a day, and it costs nothing per use.

**Security** `[R]` `[M]`. We render untrusted markdown, run a model over private documents, and write to GitHub. A memory vendor said it this month: "Persistent memory makes prompt injection durable." Six controls ship: no third-party scripts on published pages, agent tokens that may propose but never apply, a per-account budget and breaker on every model call, every model call attributed and logged, documents sent to a model only when the person asks, and the review queue so every agent change is read before it lands.

## 15. The stack, costed

**The question** `[Z]`. Cloudflare R2 with a Firestore database: is it free to start, does it scale, and what is the perfect stack?

**Three stacks at 1,000 users, per month** `[M]`. Assumptions: 10 documents of 20 KB each, 30 saves a day stored as full immutable copies, 100 MB of uploads each, 200 live sessions a day of an hour with two people, two developer seats on Vercel.

Stack | Month one | Where it stops being free | Hard limits
R2 plus Firestore in Mumbai, Firebase Auth, Durable Objects, Vercel Pro | $43.07 with WebSocket hibernation, $85.57 without | R2 at 100 users, Firestore at 333 users and then only on a Blaze billing account | 1 MiB per Firestore document, quotas reset at midnight Pacific, storage at $0.165 a GiB-month against R2's $0.015
R2 plus Supabase Pro in Mumbai for records, ledger and auth, Durable Objects, Vercel Pro | $65.19 | Supabase Pro is $25 from day one; its Free tier pauses "after 1 week of inactivity" and holds 1 GB of files | 8 GB disk then $0.125 a GB, 100 GB of files included, 100,000 monthly active users
Cloudflare only: R2, D1, Durable Objects, Workers | $1.49 to $6.49, plus $40 if the app stays on Vercel | Workers Paid at $5 for any splice over 10 ms of CPU | D1 is 10 GB per database and single-threaded, so tenants shard from the start, and Next.js would have to move to Workers

**The verdict** `[M]`. R2 is right for the bytes on every stack: $0.015 a GB-month, free egress, no minimum, and the 1,000-user workload never leaves its free operation tiers. Firestore is the weak piece. Its cost at this scale is about $1.58 a month, so cost is not the objection. The objections are structural: it needs a Blaze billing account, and Google's own FAQ links a page for when an Indian card is not accepted; a record cannot exceed 1 MiB, so content and large diffs can never live in one; its free quota resets at midnight Pacific rather than at midnight in India; and a credits ledger plus version history are relational, transactional data that our other repositories already model in Postgres. Supabase Pro at $25 buys a Mumbai Postgres, 100 GB of object storage, auth for 100,000 users, daily backups and Realtime. The gap of $22 a month is the price of one database the team already knows instead of two services it does not.

**So: R2 for bytes, Supabase Pro in Mumbai for records, ledger and auth, Durable Objects with the Hibernation API for live sessions, Vercel Pro for the app.** The first bill is $20 for one Vercel seat plus $25 for Supabase. It is not free to start, because Vercel writes: "Our Hobby plan is for personal, non-commercial use." A product that charges through Razorpay is commercial from its first rupee.

**Constraints the plan must respect whichever stack is chosen** `[M]`: budget a Vercel seat from day one; use the Durable Object Hibernation API, because without it live sessions are the largest line at $42.50 and the free plan fails at 28 sessions a day; send 100 MB uploads straight to R2 with a presigned URL, because Workers cap a request body at 100 MB; store deltas or deduplicate versions, because full-copy saves grow 18 GB a month per 1,000 users and that is the only line that compounds.

**The rest of the stack** `[M]`. Auth through Supabase, with Google and GitHub as providers. Email through Resend, 3,000 a month free, for the 24-hour notices Razorpay mandates need. Errors through Sentry's free 5,000 a month. Analytics through PostHog's free million events. Search in Postgres full text first, Typesense later. Live editing through Yjs on Durable Objects, with Liveblocks as the fallback if we want a vendor, at 10 connections a room free.

## 16. Principles, applied

Every rule below is quoted from the page it came from, and each names the screen it governs `[M]`.

- **Progressive disclosure, two levels at most.** Nielsen: "designs that go beyond 2 disclosure levels typically have low usability". The toolbar has its twelve buttons and one More. The AI box has four chips and one second row. Settings has ten sections and no sub-sections.
- **No tour.** Nielsen: "Tutorials interrupt users, don't necessarily improve task performance, and are quickly forgotten." Apple: "Consider providing a collection of context-specific tips instead of a single onboarding flow." A tip appears on the first hover of a control, once.
- **Empty states are pathways.** Nielsen: "Do not default to totally empty states." Home shows five starts. The review queue, when empty, says what would appear.
- **Sign-in first, named honestly.** Apple: "Delay sign-in for as long as possible." Nielsen: "Users want to start using the product right away." Jakob's law is the one source that supports the founders' choice: "users prefer your site to work the same way as all the other sites they already know", if the reference class is Google Docs and Notion. It is. So the sign-in is one tap, the page shows the editor, and published pages need no account.
- **Reversible, visible, confirmable.** Nielsen's direct manipulation: "reversible actions whose effects are immediately visible on the screen." Every AI proposal previews in place, applies on a click, and undoes in one step.
- **No confidence numbers.** PAIR: do not show confidence when "The confidence level isn't impactful"; prefer alternatives, which "prompts the user to rely on their own judgement". Idea mode shows options and a recommendation, never a percentage.
- **An off switch.** PAIR: "allow users to adapt the output to their needs, edit it, or turn it off." Settings has it.
- **Speed.** Nielsen: 0.1 seconds feels instant, 1.0 second keeps the flow, 10 seconds needs a progress bar. Keystrokes echo under 0.1 seconds, the AI box acknowledges under one second, a blueprint shows progress. Web pages at LCP 2.5 seconds, INP 200 milliseconds, CLS 0.1.
- **Phone.** Material: a navigation bar with three to five destinations under 600 dp, "Don't use navigation bars for desktop layouts." Apple: "show no more than two levels of hierarchy in a sidebar", and do not hide it by default on desktop.
- **Appetite, not estimate.** Shape Up: "Appetites start with a number and end with a design." Each phase in section 18 carries an appetite in weeks.
- **SOLID, as it applies here.** Martin: "Gather together the things that change for the same reasons." Each block kind is its own module. Adding a block or an AI verb is a registration, never an edit to the splicer. Every block honours one contract: parse a byte range, render, serialise byte-exact, report its splice range. Ports are small and client-specific. The engine depends on abstract ports for storage, the model and the review sidecar, and the R2, Supabase, GitHub and model adapters depend on those ports, which is the repository's existing rule.

## 17. The engine baseline

The twelve invariants of revision 3 stand `[R]`. The file is the record. Splice-only writes that refuse when a range is ambiguous. Content-addressed versions. Every change carries an author and an intent. A proposal is a first-class object. Everything has a stable address. Machine-readable exits: `Accept: text/markdown`, a `.md` twin, a manifest and checksums. A capability surface, not a screen surface, so the MCP server, the command line and the API are thin adapters. Permissions attach to the operation. Budgets and breakers sit at the operation layer. Deterministic rendering, and any block we invent degrades to readable text. No silent merge, ever.

Two measured defects are fixed before any public claim `[O]`: a column-zero list item in front matter refuses 83 percent of real vaults, about four days of work, and a trailing comment is deleted on a set.

**What this makes the product** `[P]`. The vault is the agent's memory. The map is its index. The instruction file is its policy. The blueprint is its brief. The review queue is how it is supervised. Doc mode, the flow view, the portfolio and Drive sync are all projections and adapters over the same bytes, which is why none of them needed a new format.

# Part three. After approval

## 18. The build, in appetites

The dev plan follows approval. Its shape, in fixed-time phases with variable scope `[M]` Shape Up:

Phase | Appetite | What ships
A. The door and the home | 2 weeks | Sign-in, Home, settings, plan page, the free caps and the ledger, Supabase and R2 adapters
B. The editor as shipped, plus Doc mode | 4 weeks | The workspace on the new stack, Doc mode with the 27 and the 15, problems and formatter, the AI box and menu on the free chain
C. Ideas | 4 weeks | The ideas tab, Low, the blueprint writer, the consistency check, the unlisted link, the kickoff prompt, the map
D. Sharing | 3 weeks | People, links with expiry, published pages with the `.md` twin, live editing on Durable Objects, review queue, history
E. In and out | 3 weeks | Folder upload, Obsidian and Notion import, Google Docs and Word, the GitHub App, Google Drive sync
F. Everywhere | 3 weeks | Offline in the browser, the desktop app on the new stack, the phone layouts, quick capture, dark mode
G. Views and blocks | 3 weeks | Flow, slides, mind map, Excalidraw, Mermaid types, KaTeX, templates, tasks, calendar
H. Pro | 2 weeks | Razorpay, Medium and High, Claude routing, password links, 90-day history
Later | | Kanban and table-to-chart blocks, the portfolio, the MCP server and API, Team, a custom domain, Notion API import

Twenty-four weeks of appetite at full time. At the founders' measured pace of about 1.2 days a week it is far longer, and the honest sentence from revision 3 stands: the scope exceeds two part-time founders, so either the pace changes or the later column grows.

## 19. Risks

Risk | What we do
Sign-in first costs sign-ups | Measure the drop between the sign-in page and the first save. If it is over a third, publish an editor-first path for shared pages only
Obsidian ships a web version | Their third most-liked request, not on their roadmap. Our opening narrows to AI, collaboration and the blueprint
Obsidian takes the agent position | Its chief executive's skills repository has 48,440 stars. We win on the editor a person pays to open, on collaboration, and on the brief
A free provider changes its terms | The chain has five providers and the desktop has a local model. Terms are re-read monthly and the date is recorded
Free-tier abuse of the model pools | Pools are per organisation, so one abuser drains everyone. Per-account budgets, a breaker, and sign-in first, which is one thing the front door buys
Safari evicts local drafts | The banner says so, persist is requested, the first connection pushes, the home-screen install exempts the app
Firestore stays and the ledger outgrows it | The port boundary means Postgres replaces it without touching the application layer, but it is cheaper to start there
The scope is too large for the pace | The later column is the release valve. Nothing in phases A to D is optional

## 20. What we measure

Signed in to first save under two minutes. Documents per active user. Blueprints started and finished, by depth. Imported vaults, and the share of files that imported byte for byte. Published pages and the sign-ups they bring. Free to Pro conversion, and which cap tripped first. AI proposals accepted against rejected. Model spend per active user against the pools. Sync conflicts shown against merges attempted.

## 21. Questions for the founders

1. The free caps: 50 documents, 5 pages, 3 collaborators, or your 5, 2 and 1. The market evidence is in section 13.
2. Firestore or Supabase for records. The costs are in section 15.
3. Pro on Claude from day one, or on the free chain until revenue.
4. Whether High ideas run web research from day one, or after Medium proves out.
5. Whether the desktop app ships before or after Drive sync.
6. The pace, and therefore which of phases E to H move to Later.

## 22. Sources

Every page below was opened on the date shown and quoted verbatim in this plan.

**Free tiers and metering, 17 September.** [Google Docs](https://workspace.google.com/products/docs) · [Google storage](https://support.google.com/drive/answer/2375123) · [Notion pricing](https://www.notion.com/pricing) · [Superhuman Docs](https://superhuman.com/plans/docs) · [Craft](https://www.craft.do/pricing) · [Bear](https://bear.app) · [Obsidian](https://obsidian.md/pricing) · [HackMD](https://hackmd.io/pricing) · [Dropbox Paper](https://help.dropbox.com/organize/dropbox-paper-faqs) · [Slite](https://slite.com/pricing) · [Nuclino](https://www.nuclino.com/pricing) · [Outline](https://www.getoutline.com/pricing) · [Docmost](https://docmost.com/pricing) · [GitBook](https://www.gitbook.com/pricing) · [Confluence](https://www.atlassian.com/software/confluence/pricing) · [Anytype](https://anytype.io/pricing) · [AFFiNE](https://affine.pro/pricing) · [Notesnook](https://notesnook.com) · [Joplin Cloud](https://joplinapp.org/plans) · [Simplenote](https://simplenote.com) · [Standard Notes](https://standardnotes.com/plans) · [Capacities](https://capacities.io/pricing) · [Mem](https://get.mem.ai/pricing) · [Tana](https://tana.inc/pricing) · [Reflect](https://reflect.app) · [UpNote](https://getupnote.com) · [Evernote](https://evernote.com/compare-plans) · [Tolaria](https://tolaria.md) · [CodeGuide](https://codeguide.dev/pricing) · [ChatPRD](https://www.chatprd.ai/pricing) · [Kiro](https://kiro.dev/pricing) · [Cursor](https://cursor.com/pricing) · [Claude](https://claude.com/pricing) · [ChatGPT](https://chatgpt.com/pricing) · [Canva](https://www.canva.com/pricing) · [Figma](https://www.figma.com/pricing) · [Linear](https://linear.app/pricing) · [Vercel](https://vercel.com/pricing) · [Loom](https://www.loom.com/pricing)

**The stack, 17 September.** [R2 pricing](https://developers.cloudflare.com/r2/pricing/) · [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) · [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/) · [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [Firestore pricing](https://cloud.google.com/firestore/pricing) · [Firestore quotas](https://firebase.google.com/docs/firestore/quotas) · [Firebase pricing](https://firebase.google.com/pricing) · [Supabase pricing](https://supabase.com/pricing) · [Supabase regions](https://supabase.com/docs/guides/platform/regions) · [Neon](https://neon.tech/pricing) · [Turso](https://turso.tech/pricing) · [PlanetScale](https://planetscale.com/pricing) · [Vercel Hobby](https://vercel.com/docs/plans/hobby) · [Vercel Blob](https://vercel.com/docs/vercel-blob/usage-and-pricing) · [Clerk](https://clerk.com/pricing) · [Auth.js](https://authjs.dev) · [Liveblocks](https://liveblocks.io/pricing) · [PartyKit](https://www.partykit.io) · [Algolia](https://www.algolia.com/pricing) · [Meilisearch](https://www.meilisearch.com/pricing) · [Typesense](https://cloud.typesense.org/pricing) · [Resend](https://resend.com/pricing) · [Sentry](https://sentry.io/pricing/) · [PostHog](https://posthog.com/pricing)

**Model providers, 17 September.** [Groq rate limits](https://console.groq.com/docs/rate-limits) · [Groq models](https://console.groq.com/docs/models) · [Groq data](https://console.groq.com/docs/your-data) · [Groq services agreement](https://console.groq.com/docs/legal/services-agreement) · [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) · [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) · [Gemini terms](https://ai.google.dev/gemini-api/terms) · [OpenRouter limits](https://openrouter.ai/docs/api-reference/limits) · [OpenRouter models](https://openrouter.ai/api/v1/models) · [OpenRouter privacy](https://openrouter.ai/privacy) · [GitHub Models](https://docs.github.com/en/github-models) · [NVIDIA build](https://build.nvidia.com) · [NVIDIA terms](https://developer.nvidia.com/legal/terms) · [Cerebras rate limits](https://inference-docs.cerebras.ai/support/rate-limits) · [Cerebras terms](https://cerebras.ai/terms-of-service) · [Together pricing](https://www.together.ai/pricing) · [Together privacy](https://www.together.ai/privacy) · [Mistral pricing](https://mistral.ai/pricing) · [Mistral usage limits](https://docs.mistral.ai/admin/billing-usage/usage-limits) · [Mistral terms](https://legal.mistral.ai/terms/commercial-terms-of-service) · [Hugging Face providers](https://huggingface.co/docs/inference-providers/pricing) · [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) · [Workers AI limits](https://developers.cloudflare.com/workers-ai/platform/limits/) · [Workers AI data](https://developers.cloudflare.com/workers-ai/platform/data-usage/) · [SambaNova rate limits](https://docs.sambanova.ai/docs/en/models/rate-limits) · [SambaNova pricing](https://cloud.sambanova.ai/plans/pricing) · [Anthropic pricing](https://claude.com/pricing) · [Anthropic rate limits](https://platform.claude.com/docs/en/api/rate-limits) · [Ollama](https://ollama.com) · [Ollama FAQ](https://docs.ollama.com/faq)

**Doc mode, 17 September.** [Google Docs help](https://support.google.com/docs/topic/9046002) · [Google Docs formatting not supported in Markdown](https://support.google.com/docs/answer/18289341) · [CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/) · [GFM](https://github.github.com/gfm/) · [Pandoc manual](https://pandoc.org/MANUAL.html) · [Tiptap extensions](https://tiptap.dev/docs/editor/extensions) · [Tiptap markdown](https://tiptap.dev/docs/editor/markdown) · [Typora support](https://support.typora.io) · [Bear Lettera](https://lettera.md) · [Milkdown](https://github.com/Milkdown/milkdown) · [tui.editor](https://github.com/nhn/tui.editor) · [Obsidian editing modes](https://help.obsidian.md/edit-and-read)

**Representations, 17 September.** [Marp core](https://github.com/marp-team/marp-core) · [Marpit markdown](https://github.com/marp-team/marpit/blob/main/docs/markdown.md) · [reveal.js markdown](https://revealjs.com/markdown/) · [Slidev](https://sli.dev/guide/syntax) · [markmap](https://markmap.js.org/docs/markmap) · [Mermaid](https://mermaid.js.org/intro/) · [Mermaid kanban](https://mermaid.js.org/syntax/kanban.html) · [D2](https://github.com/terrastruct/d2) · [obsidian-kanban](https://github.com/community-archive/obsidian-kanban) · [vis-timeline](https://github.com/visjs/vis-timeline) · [Chart.js](https://github.com/chartjs/Chart.js) · [Vega-Lite](https://github.com/vega/vega-lite) · [obsidian-charts](https://github.com/phibr0/obsidian-charts) · [JSON Canvas](https://jsoncanvas.org/spec/1.0/) · [tldraw licence](https://github.com/tldraw/tldraw/blob/main/LICENSE.md) · [Excalidraw](https://github.com/excalidraw/excalidraw) · [Obsidian Bases](https://help.obsidian.md/bases) · [Astro content collections](https://docs.astro.build/en/guides/content-collections/) · [sayak.dev](https://sayak.dev/) · [sayakpaul/portfolio](https://github.com/sayakpaul/portfolio) · [Quarto](https://github.com/quarto-dev/quarto-cli) · [Pandoc](https://github.com/jgm/pandoc) · [Paged.js](https://github.com/pagedjs/pagedjs) · [Typst](https://github.com/typst/typst) · [abcjs](https://github.com/paulrosen/abcjs) · [KaTeX](https://github.com/KaTeX/KaTeX) · [HackMD features](https://hackmd.io/s/features)

**Public APIs, 17 September.** [public-apis](https://github.com/public-apis/public-apis) · [free-apis](https://free-apis.github.io/) · [Unsplash](https://unsplash.com/documentation) · [Pexels](https://www.pexels.com/api/documentation/) · [Openverse](https://api.openverse.org/v1/) · [Pixabay](https://pixabay.com/api/docs/) · [Wikimedia rate limits](https://www.mediawiki.org/wiki/Wikimedia_APIs/Rate_limits) · [Free Dictionary](https://dictionaryapi.dev) · [Datamuse](https://www.datamuse.com/api/) · [LanguageTool API](https://dev.languagetool.org/public-http-api) · [DeepL](https://developers.deepl.com/docs/api-reference/usage-and-quota) · [LibreTranslate](https://libretranslate.com) · [Crossref](https://github.com/CrossRef/rest-api-doc) · [OpenAlex](https://github.com/ourresearch/openalex-docs) · [Open Library](https://openlibrary.org/developers/api) · [arXiv terms](https://info.arxiv.org/help/api/tou.html) · [Semantic Scholar](https://www.semanticscholar.org/product/api) · [Zotero](https://www.zotero.org/support/dev/web_api/v3/basics) · [Google Fonts](https://developers.google.com/fonts/docs/developer_api) · [Gravatar](https://docs.gravatar.com/api/avatars/) · [DiceBear](https://www.dicebear.com/how-to-use/http-api/) · [Frankfurter](https://frankfurter.dev) · [OSM policies](https://operations.osmfoundation.org/policies/) · [OCR.space](https://ocr.space/ocrapi) · [Tesseract.js](https://github.com/naptha/tesseract.js) · [QuickChart](https://quickchart.io/documentation/faq/) · [iframely](https://iframely.com/pricing) · [Google Docs API](https://developers.google.com/workspace/docs/api/how-tos/overview) · [Google Docs API limits](https://developers.google.com/workspace/docs/api/limits) · [Notion request limits](https://developers.notion.com/reference/request-limits) · [Confluence REST v2](https://developer.atlassian.com/cloud/confluence/rest/v2/intro/)

**Ecosystems, 17 September.** [Notion integrations](https://www.notion.com/integrations) · [Notion templates](https://www.notion.com/templates) · [Notion API](https://developers.notion.com/) · [Notion blocks](https://developers.notion.com/reference/block) · [Workspace Marketplace](https://workspace.google.com/marketplace) · [VS Code marketplace](https://marketplace.visualstudio.com/) · [Logseq marketplace](https://github.com/logseq/marketplace) · [Joplin plugins](https://joplinapp.org/plugins/) · [Craft](https://www.craft.do) · [Bear](https://bear.app) · [Typora](https://typora.io) · [iA Writer](https://ia.net/writer) · [Obsidian plugin security](https://help.obsidian.md/plugin-security) · [VS Code extension host](https://code.visualstudio.com/api/advanced-topics/extension-host) · [Figma plugin sandbox](https://www.figma.com/plugin-docs/how-plugins-run/) · [Cloudflare isolates](https://developers.cloudflare.com/workers/reference/security-model/) · [Deno permissions](https://docs.deno.com/runtime/fundamentals/security/)

**Principles, 17 September.** [Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) · [Ten heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) · [Empty states](https://www.nngroup.com/articles/empty-state-interface-design/) · [Onboarding tutorials](https://www.nngroup.com/articles/onboarding-tutorials/) · [Direct manipulation](https://www.nngroup.com/articles/direct-manipulation/) · [Response times](https://www.nngroup.com/articles/response-times-3-important-limits/) · [Laws of UX](https://lawsofux.com/) · [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) · [Material breakpoints](https://m3.material.io/foundations/layout/breakpoints/overview) · [Material navigation bar](https://m3.material.io/components/navigation-bar/guidelines) · [Web Vitals](https://web.dev/articles/vitals) · [Shape Up](https://basecamp.com/shapeup/1.2-chapter-03) · [Jobs to be done](https://www.christenseninstitute.org/theory/jobs-to-be-done/) · [PAIR explainability](https://pair.withgoogle.com/chapter/explainability-trust/) · [PAIR feedback and controls](https://pair.withgoogle.com/chapter/feedback-controls/) · [PAIR errors](https://pair.withgoogle.com/chapter/errors-failing/) · [Principles of OOD](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod) · [SOLID relevance](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html)

**Sharing, upload, Drive and GitHub, 17 September.** [Dropbox link permissions](https://help.dropbox.com/share/set-link-permissions) · [Drive sharing](https://developers.google.com/workspace/drive/api/guides/manage-sharing) · [Drive permissions](https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions) · [Notion public pages](https://www.notion.com/help/public-pages-and-web-publishing) · [Figma link passwords](https://help.figma.com/hc/en-us/articles/5726720100247) · [Loom passwords](https://support.loom.com/hc/en-us/articles/360002235698) · [HackMD permissions](https://hackmd.io/@docs/note-permission-en) · [Craft sharing](https://support.craft.do/hc/en-us/articles/360019332337) · [Bitwarden Send](https://bitwarden.com/help/create-send/) · [webkitdirectory](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory) · [webkitGetAsEntry](https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry) · [showDirectoryPicker](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker) · [caniuse directory input](https://caniuse.com/input-file-directory) · [caniuse file system access](https://caniuse.com/native-filesystem-api) · [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) · [StorageManager](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager) · [Storage for the web](https://web.dev/articles/storage-for-the-web) · [Storage quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) · [WebKit seven days](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) · [Background Sync](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) · [share_target](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target) · [Drive push](https://developers.google.com/workspace/drive/api/guides/push) · [Drive changes](https://developers.google.com/workspace/drive/api/guides/manage-changes) · [Drive scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth) · [Drive limits](https://developers.google.com/workspace/drive/api/guides/limits) · [Drive Picker](https://developers.google.com/workspace/drive/picker/reference/picker.docsview) · [GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps) · [GitHub App rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) · [Contents API](https://docs.github.com/en/rest/repos/contents) · [Notion settings](https://www.notion.com/help/account-settings) · [Obsidian settings](https://help.obsidian.md/settings)

**Carried from revision 3, opened 15 and 16 September.** [Obsidian feature requests](https://forum.obsidian.md/c/feature-requests/8) · [Obsidian plugin stats](https://github.com/obsidianmd/obsidian-releases) · [Obsidian roadmap](https://obsidian.md/roadmap) · [Obsidian sync help](https://help.obsidian.md/sync) · [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) · [Claudian](https://github.com/YishenTu/claudian) · [Tolaria](https://github.com/refactoringhq/tolaria) · [AGENTS.md](https://agents.md/) · [MCP specification](https://modelcontextprotocol.io/specification/2026-07-28) · [Skills guide](https://docs.claude.com/en/docs/agents-and-tools/agent-skills) · [llms.txt](https://llmstxt.org/) · [mem0 pricing](https://mem0.ai/pricing) · [Zep pricing](https://www.getzep.com/pricing) · [Anthropic API pricing](https://claude.com/pricing) · [Razorpay pricing](https://razorpay.com/pricing/) · [Razorpay subscriptions and mandates](https://razorpay.com/docs/payments/subscriptions/) · [mammoth](https://www.npmjs.com/package/mammoth) · [Drive export formats](https://developers.google.com/workspace/drive/api/guides/ref-export-formats)
