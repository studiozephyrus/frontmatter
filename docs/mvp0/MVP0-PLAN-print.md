---
title: frontmatter MVP 0, the build sheet
version: print edition, revision 3
date: 2026-09-16
note: Revision 3 adds the switching research, plugin parity, the engine baseline and the agent-era interfaces. The long evidenced plan is MVP0-PLAN-v3.
---

# frontmatter MVP 0: the build sheet

Approved 16 September 2026, revised the same day after a study of why people stay with Obsidian, what the agent era already demands, and what would move someone.

**Signal tags.** `[Z]` we decided it. `[M]` a market or standards page opened and quoted. `[R]` our own earlier research. `[O]` measured this session, from a public registry or our own machines. `[L]` a constraint with no choice. `[P]` follows from another decision. Estimates say so.

---

# Part one: the bet

## 1. What we are building

**An agent does better work when it is briefed properly. frontmatter writes the brief.** And it is the markdown editor you keep open all day, because a brief is worthless once the documents go stale.

Web first, with an installable app and a desktop build. Plain markdown files, always.

**Sell it as:** the best AI blueprints for your agentic development `[Z]`.

**Who first:** people who build with coding agents and start from an idea, not a repository. Then anyone who writes markdown and wants AI that respects the file `[Z]`.

**The rule for the first five minutes** `[Z]`. The editor is the landing page. No wall, no tour, no puzzle. One sign-in prompt, once, at the first action that needs it. The draft made before signing in comes along. Saving is never a button.

## 2. Why now

The second brain stopped being a personal filing habit and became the place an agent reads from and writes to. Five measurements say so, all taken this session.

- **Agents moved into the vault.** Obsidian's **Claudian** plugin, "Embeds Claude Code/Codex and other local Agents as AI collaborators in your vault", reached **2,112,607 downloads and 15,335 stars** from a repository created on **5 December 2025** `[O]`. **Copilot**, "Run AI agents such as Claude Code, Codex, and OpenCode inside your vault", has 1,900,500 `[O]`. Four million downloads in a category that did not exist two years ago.
- **Obsidian built a door for them.** It ships a headless client whose stated purpose is to "Give agentic tools access to a vault without access to your full computer" `[M]`.
- **A competitor named the position.** **Tolaria**, "A second brain for the AI era. Free forever. Organize your notes as Markdown files, with native relationships, Git, local agents, and direct AI model providers": AGPL, **19,797 stars since 14 February 2026**, desktop only, no sync, no account `[O]`.
- **The standards settled enough to build on.** `AGENTS.md` is used by over 60,000 projects and stewarded by the Agentic AI Foundation under the Linux Foundation `[M]`. The Model Context Protocol is "an open-source standard for connecting AI applications to external systems", now a Linux Foundation project with a dated specification `[M]`.
- **The incumbent's own founder is building the bridge.** Obsidian's chief executive publishes **"Agent skills for Obsidian. Teach your agent to use Obsidian CLI and open formats including Markdown, Bases, JSON Canvas"**, which has **48,440 stars since 2 January 2026** `[O]`. He is doing it personally, with the incumbent vault and the incumbent user base.

**The hole in the market.** Of the products that store a person's knowledge for an agent, the split is clean `[O]`: everything that **charges** keeps the data in its own database, priced by request, credit or seat, from $8 a month for consumers to $375 for developer tiers. Everything that keeps knowledge in **files the person owns** is free and open source. **Nobody sells the writing surface.** The place where a person actually reads and edits the file is unowned, which is exactly where we intend to sit: your own markdown, and a paid editor worth opening every day.

**What nobody has built** is the editor for that vault: one that a person enjoys using every day and an agent can read, propose into, and be supervised through. **The window is open now rather than in a year**, because the incumbent started nine months ago.

## 3. Why anyone switches

Counted, from Obsidian's own forum, the plugin registry, phone reviews, developer threads and the research literature.

### 3.1 What people love, and it is not the feature list

From 159 five-star phone reviews across five note apps `[O]`: **design 35, simplicity 34, sync 18, free 14, privacy 12**. Bear alone holds 27 of the design mentions and 27 of the simplicity mentions. Markdown itself is named 11 times.

From developer threads, the reasons people **choose** Obsidian, by mentions and distinct sources `[O]`: **plain files on disk with no lock-in 28 across 8 sources**, the plugin ecosystem 13 across 5, being agent-friendly because the files are local markdown 9 across 5, free and not funded by investors 8 across 4, offline and encrypted 6 across 4.

**So look and feel, simplicity and file ownership win the category.** Not features.

### 3.2 What Obsidian users have asked for and not received

Their forum runs 6,051 feature requests where "Likes (Hearts) = Votes" `[M]`. None of the top thirty has been implemented. Ranked by hearts `[O]`:

Request | Hearts | frontmatter | Size
---|---|---|---
Edit an embedded note in place | 1,078 | Live mode already opens any block on click; extend it to embeds | S
File explorer custom sort | 979 | Build: name, date, manual | S
**A web version** | 949 | **We are a web app.** Not on their roadmap | ships
Open links in a new tab by default | 907 | Build: modifier and setting | S
Typed links and link metadata | 822 | Later |
Mass tag add, rename, delete | 811 | Build: rename and merge | S
**A fully visual editor** | 792 | **Live mode ships** | ships
Nested YAML in properties | 790 | Later |
Ignore accents in search | 773 | Build: normalise before matching | S
Title from the H1 or a property | 712 | Build: a setting | S
Tab reuse and management | 671 | Tabs ship; add reuse | S
Choose how dates display | 657 | Later |
**Global search and replace** | 650 | Build. Obsidian still has none | M
Render block embeds inline | 554 | With the first row | S
Reminders and notifications | 554 | Later |
Open single .md files outside a vault | 550 | Desktop opens a folder; add file association | S
One settings set across vaults | 520 | Settings live on the account, ours by design | ships
Links to folders | 513 | Later |
Drawing and pen in Canvas | 509 | The drawing block covers drawing | partial
PDF annotation | 498 | Later |
Switch off auto-save | 459 | Later |
Sketching with a stylus | 434 | The drawing block | partial
Background sync on mobile | 363 | Our sync is server-side | ships
A default template for a new note | 362 | With templates | S
Auto-update links on heading rename | 351 | The link doctor is adjacent | S

**Of the thirty most-liked open requests we answer sixteen** `[O]`.

**Three decide a switch.** A web version is their third most-liked request, 949 hearts, and is **absent from their published roadmap** `[M]`. Editing an embedded note in place is the most-liked at 1,078, and our Live mode already edits any block on click `[O]`. Global search and replace, 650 hearts, still does not exist there.

**Two more openings from their own documentation** `[M]`. Their help says markdown sync conflicts are merged with "Google's diff-match-patch algorithm" and that this "may sometimes create duplicate text or formatting problems". And "Multiplayer", their phrase for collaborative editing, sits on the roadmap as Planned, while sharing a vault today needs every collaborator to hold a Sync subscription, capped at 20 people.

### 3.3 The ten switching drivers, with counts

Mentions across distinct sources `[O]`: **own the files, 28 across 8**; setup and maintenance burden, 24 across 11; databases and a migration that does not mangle them, 23 across 8; **AI that edits your files, and AI you can switch off, 21 across 11**; price changes and credit metering, 20 across 12; sync that works without a bill or a hack, 19 across 8; speed, especially on mobile, 19 across 9; offline and longevity, 19 across 12; open source, 17 across 6; teams, comments and review, 16 across 7.

**Four demands, stated in their own words** `[O]`, which describe our product:

- "when an agent edits a file does it round-trip YAML frontmatter and nested code fences cleanly" … "every 'wysiwyg markdown' tool i've tried falls apart there"
- "The feature I am waiting for in all of these editors is integrating 'red lining' as a channel for LLM input."
- "obsidian: great for LLMs (local markdown files), bad for collaboration (no multiplayer features like multi editor, comments)"
- "The Obsidian migration path is honestly the make-or-break."

### 3.4 What the market did this year

- **Logseq split on 24 April 2026**, moving markdown files to "Logseq OG", maintenance only `[M]`. A markdown-first population is looking for a home.
- **Apple Notes now speaks markdown**, converting syntax with import and export from macOS 26 and iOS 26 `[M]`. Google Keep still has zero occurrences of the word `[M]`.
- **Sync is being given away.** Notesnook offers free unlimited end-to-end encrypted sync and charges only for attachment storage `[M]`.

### 3.5 What the research says, and what it forbids

From 37 papers pulled through scholarly APIs `[O]`:

- **People return to their own files by browsing, not searching.** Folders accounted for 56 to 68 percent of retrievals against 4 to 15 percent for search, and better search barely moved it. A 2024 follow-up found heavy searchers failed at navigation 23 percent of the time against 6. **So the tree is the main route back, kept shallow.** Tags are not the organising model.
- **Capture must not demand filing.** Categorising at capture is the cost people avoid; filers kept more and used it less. **So: an inbox, no required title, folder or tag.**
- **People over-accept AI suggestions and will not declare them.** Wrong advice is taken, an opinionated assistant shifted what people wrote and later believed, AI ideas made stories better individually but more alike, and people neither feel ownership of AI text nor disclose it. **So every AI span is marked in the file and every AI edit needs an explicit accept** `[P]`.
- **Three claims we will not make:** that saving notes improves memory; that links or a graph help you think or find things, which is untested for personal notes; that good search removes the need to organise.

### 3.6 The phone, where note systems break

From 156 low-rated reviews across five apps `[O]`: clumsy mobile editing 35, which is 22 percent and the largest class; sync counting failures, price and storage choice 26; missing features, mostly storage choice and capture, 22; slow start 13; lost data 13.

**AI in the way is the most heated complaint.** Thirteen of thirty-three low-rated Notion reviews mention AI and five make it the main complaint. None of the low-rated Obsidian, Logseq or Bear reviews mention AI, and two five-star reviews praise Obsidian for not having it `[O]`.

---

# Part two: the screens

## 4. The design system

Measured from the shipped app on 16 September `[O]`.

Element | Value
---|---
Header | 52px, panel background, 14px side padding, 1px bottom border
The mark | 26px square, 7px radius, accent fill, 13px at weight 800; wordmark at 15.2px weight 650
Columns | 264px left, flexible centre, 304px right, side panes on the subtle ground
Tabs | 38px tall, 13px at weight 450, right border, 2px accent underline when active
Toolbar | One row, 6 by 10px padding, 2px gaps, twelve buttons in a fixed order
Tool button | 28px minimum width, 26px tall, 12px mono, transparent border
Mode control | Segmented: Edit, Live, Reading, Split, 12px at weight 500
Tree row | 13px, 4 by 8px padding, 2px inset accent bar when active
Right pane | 12px padding, uppercase 12px semibold section headings
Colours | `#fafafa` ground, `#18181b` ink and accent, `#0044cc` links, `#1a1a1a` dark ground
Shadows | None

Icons are Material Symbols, inline. Desktop 1440 by 900, phone 390 by 844. Source in `docs/mvp0/screens/`, one command to re-render.

## 5. The twenty-two screens

### S01. First run

<figure class="shot"><img src="screens/s01-first-run.png"><figcaption>S01 · The editor is the landing page.</figcaption></figure>

Opens in under two seconds, empty, box focused. Every keystroke saved to this device. Export without an account. Four chips: blueprint, clean up a paste, write a spec, notes into a plan. A second row: open from GitHub, drop a .md file, a template. **Signal:** the three editors a developer reaches for show an editor on arrival with zero sign-in words; HackMD shows sixteen `[R]`.

### S02. Sign in

<figure class="shot"><img src="screens/s02-sign-in.png"><figcaption>S02 · Shown once, at the first action that needs an account.</figcaption></figure>

Say what an account adds and what it does not change. Google first, GitHub second. The local draft moves in. "We never train on your documents". **Signal:** privacy is the fifth most praised thing on phones `[O]`.

### S03. The workspace

<figure class="shot"><img src="screens/s03-workspace.png"><figcaption>S03 · The shape everything else inherits.</figcaption></figure>

Projects, folders, files, an unread badge, custom sort. Tabs coloured by project. Modes Edit, Live, Reading, Split. Twelve formatting buttons in the shipped order. Word count, bookmark, find, history, more. Right: outline always visible, then tags and bookmarks, backlinks, history (Pro), comments; Add file, Shortcuts, AI edit, credits. **Signal:** people return to their own files by browsing a shallow tree `[O]`, so the tree is the main route.

### S04. The AI writing box

<figure class="shot"><img src="screens/s04-ai-writing.png"><figcaption>S04 · Only while the document is empty.</figcaption></figure>

Appears on an empty document, gone at the first character. The price in credits shown before anything is spent. **Signal:** AI in the way is the most heated complaint in the category `[O]`. It appears once, then leaves, and a setting hides it for good.

### S05. Idea mode

<figure class="shot"><img src="screens/s05-idea-mode.png"><figcaption>S05 · Six decisions, each with a recommendation. "Not sure" takes it.</figcaption></figure>

Four steps. Left: the idea and the files that will be written. Right: six decisions, two or three options, what each buys and costs, one marked recommendation. **Signal:** 69 percent of developers keep AI away from project planning `[R]`.

### S06. The blueprint, ready

<figure class="shot"><img src="screens/s06-blueprint-ready.png"><figcaption>S06 · A skill folder: index first, instructions, documents, specs, manifest, checksums.</figcaption></figure>

The folder in section 8. `SKILL.md` is a short index; the rest loads when the agent needs it. The rail carries the file list, the consistency result, the link, the kickoff prompt and the version. **Signal:** the skills specification sets a three-tier disclosure of roughly 100 tokens of metadata, a body under 5,000 tokens, and resources only when required `[M]`.

### S07. AI edit

<figure class="shot"><img src="screens/s07-ai-edit.png"><figcaption>S07 · A proposal in the document. Accept or reject on the span.</figcaption></figure>

AI never rewrites; it proposes. Old text struck, new text highlighted, accept and reject on the span. **Signal:** "The feature I am waiting for in all of these editors is integrating 'red lining' as a channel for LLM input" `[O]`, and people over-accept AI suggestions and will not declare them `[O]`.

### S08. Document review

<figure class="shot"><img src="screens/s08-review.png"><figcaption>S08 · Everything waiting, from people and from AI, in one list.</figcaption></figure>

Collaborator suggestions and undecided AI edits in one queue, each with who, when, what, accept, reject. **Signal:** "obsidian: great for LLMs, bad for collaboration" `[O]`.

### S09. Share

<figure class="shot"><img src="screens/s09-share.png"><figcaption>S09 · People need accounts. Publishing needs nothing.</figcaption></figure>

People by account, can edit or can suggest. Publish with a switch, the link and the count used. **Signal:** collaborative editing is only Planned in Obsidian, and sharing a vault needs every person to hold a subscription `[M]`.

### S10. A published page

<figure class="shot"><img src="screens/s10-public-view.png"><figcaption>S10 · Renders like the public page we already ship. No comments.</figcaption></figure>

`noindex` by default. A dismissable sign-in card. A made-with line on free. Open in frontmatter, download .md. No comments, ever `[Z]`. **Signal:** Obsidian Publish is $8 a site a month `[M]`; ours is five pages free.

### S11. Live collaboration

<figure class="shot"><img src="screens/s11-live-collab.png"><figcaption>S11 · Presence, named cursors, the cap as a toast rather than a wall.</figcaption></figure>

One collaborator on free. The second invite shows the upgrade.

### S12. Plan and usage

<figure class="shot"><img src="screens/s12-plan-usage.png"><figcaption>S12 · Three meters, two plans, Team and Enterprise as coming.</figcaption></figure>

AI edits with the blueprint credit beside it, cloud documents, published pages. **Signal:** eight phone complaints are about subscriptions and paid sync `[O]`, so the free tier must be usable for ever.

### S13. Offline

<figure class="shot"><img src="screens/s13-offline.png"><figcaption>S13 · A banner, not a modal. The desktop prompt on a schedule.</figcaption></figure>

Editing keeps working. Say where the text is and when it last synced. Surface a conflict; never merge. **Signal:** lost data and sync failures are 31 of 156 low-rated reviews `[O]`, and Obsidian admits its merge "may sometimes create duplicate text or formatting problems" `[M]`.

### S14. The desktop app

<figure class="shot"><img src="screens/s14-desktop.png"><figcaption>S14 · The same interface, signed, with a folder on this Mac beside the cloud projects.</figcaption></figure>

One codebase, bundled. A local folder as a project. Files on disk written by the splice engine. **Signal:** portable plain files is the most common requirement across nine note-taking methods, 5 of 9 `[O]`, and the most cited reason people choose a markdown app, 28 mentions `[O]`.

### S15. Document history

<figure class="shot"><img src="screens/s15-history.png"><figcaption>S15 · Pro. Every save is a version; a version is a diff you can restore.</figcaption></figure>

Who, when, which were AI edits, a diff, restore, copy. Ninety days on Pro. **Signal:** Obsidian keeps one month at $4 and twelve months only at $8 `[M]`.

### S16. Custom blocks

<figure class="shot"><img src="screens/s16-custom-blocks.png"><figcaption>S16 · A plain table, a chart block that reads it, Mermaid, a callout, maths.</figcaption></figure>

Split view, source left, render right, and a note on how each block looks elsewhere. **Signal:** diagrams and maths are a top request in four of seven competitor trackers `[O]`.

### S17. The phone

<figure class="shot"><img src="screens/s17-mobile.png"><figcaption>S17 · Read, edit, outline, AI on a selection, share. Nothing else.</figcaption></figure>

The cursor stays visible while typing, the page never jumps, and it launches ready to type by saving locally first. **Signal:** clumsy mobile editing is the single largest complaint class in the category, 35 of 156 `[O]`.

### S18. Dark

<figure class="shot"><img src="screens/s18-workspace-dark.png"><figcaption>S18 · The dark ground the app already ships.</figcaption></figure>

Both themes, with accent, font, width and density. **Signal:** design and simplicity are the two most praised things on phones, 35 and 34 of 159 `[O]`.

### S19. Instruction files

<figure class="shot"><img src="screens/s19-instruction-files.png"><figcaption>S19 · The instructions file with a health panel and the agents that read it.</figcaption></figure>

See and edit every instruction file in the tree. Health panel: one file rather than two, size against the caps each runtime states, setup commands present, claims not verified recently. **Signal:** the runtimes publish size limits, "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence", and "Keep rules under 500 lines" `[M]`. The tool teaches the `@AGENTS.md` import; it does not diff two copies `[O]`.

### S20. The problems panel

<figure class="shot"><img src="screens/s20-problems.png"><figcaption>S20 · Structural problems with line numbers, and one advisory writing note.</figcaption></figure>

Broken wiki links, heading skips, missing alt text, table column mismatches, unknown front-matter keys. Checks run on the device. **Signal:** markdownlint has 12,172,880 VS Code installs and no note app ships a linter `[O]`.

### S21. A drawing on the idea

<figure class="shot"><img src="screens/s21-idea-drawing.png"><figcaption>S21 · Attach a sketch, screenshot or repository before the questions.</figcaption></figure>

Read once, described in words, never sent again. **Signal:** Excalidraw is the most downloaded Obsidian plugin at 7,974,073, and drawing or handwriting tops six of seven competitor trackers `[O]`.

### S22. The map

<figure class="shot"><img src="screens/s22-map.png"><figcaption>S22 · What governs what, and which decision explains which spec.</figcaption></figure>

Documents as nodes, what each governs as edges, decisions attached to the specs they explain. `MAP.md` for a person, `graph.json` for an agent, rebuilt from the files at no credit cost. **Honest note:** the research does not show graphs help people find or think `[O]`, so the map is sold to the agent, not as a thinking aid.

---

# Part three: what it does

## 6. Free and Pro

Free is free to try, and usable for ever. Pro is do it properly. Every cap is server-side `[Z]`.

**All free, no cap.** Four modes. Twelve formatting buttons. Export to .md, HTML, Word and PDF. Tree with projects, folders, custom sort, unread badge. Tabs. Search with replace. Outline, tags, bookmarks, backlinks, properties. Shortcuts. Light and dark with accent, font, width and density. Autosave. Problems panel. Drawing. Templates. Tasks view. Calendar and daily notes. Quick capture. Importers. Hover preview. Highlights. The map.

Capped | Where | Free | Pro
---|---|---|---
Documents in the cloud | Tree | 10 | Unlimited
Image uploads | In the document | 5 MB a file, 100 MB an account | 25 MB, 5 GB
Document history, diff, restore | S15 | No | 90 days
AI edits, eight verbs | S07 | 10 a month | 100 a month
Blueprints | S05, S06 | 1 a month | 5 a month
Top-ups | S12 | 50 edits ₹99, 3 blueprints ₹149 | Same
Live collaborators a document | S11 | 1 | Unlimited
Published pages | S09, S10 | 5 | Unlimited
Custom slug | S10 | No | Yes
Made-with line | S10 | Shown | Removed
GitHub repositories, pushes | S01, S06 | 1 repo, 20 pushes a month | Unlimited

**Not in MVP 0.** Code review. Per-span read state, back in MVP 1 as a diff over history. Multi-column layouts through raw HTML. Any image puzzle `[Z]`. A student tier `[Z]`. A community beyond an opt-in index. Two-way GitHub sync, a glossary, views, an agent panel, a reverse blueprint and a signed Windows build, all MVP 1.

## 7. Built in, so nobody needs a plugin

The instruction: every widely used plugin's capability ships in the product `[Z]`. Rankings are the Obsidian registry by downloads, where 7,638 plugins hold 147,920,815 downloads and the top 60 hold 59.2 percent `[O]`.

**Already in the app** `[O]`: editable tables (Advanced Tables, 3,193,578), the toolbar (Editing Toolbar, 1,891,756), callouts (Admonition, 968,150), wikilink and tag completion plus AI ghost text (Various Complements, 593,733), the switcher and command palette (Quick Switcher++, 474,516), focus mode (Hider, 459,258), export (Pandoc, 553,114), word count, folding, template variables, version history, AI verbs, and a graph view, transclusion, unlinked mentions, a link doctor, properties, trash, vim mode and fourteen slash commands that need no plugin at all.

**Built for MVP 0:**

Need, and the plugin that proves it | What we ship | Size
---|---|---
Excalidraw 7,974,073, the most downloaded of all, and drawing tops six of seven competitor trackers | A drawing block inside a note | L
Templater 5,599,853 | Template picker, folders, prompts for values | M
Tasks 4,243,906 and TaskNotes 1,528,439 | One tasks view across every note | M
Calendar 3,104,301 and Periodic Notes 758,172 | A month calendar; daily, weekly, monthly notes | M
QuickAdd 2,113,472, and capture is the second most common method requirement | Quick capture into an inbox or today's note | M
Omnisearch 1,879,201, plus 773 hearts for ignoring accents | Ranked full-text search, headings, accent-insensitive | M
650 hearts, absent from Obsidian | Global find and replace with a preview | M
Importer 1,671,435, and "the migration path is the make-or-break" | Notion, Evernote, Apple Notes, Bear, Obsidian, Google Docs, Word | L
Style Settings 2,683,101 and Minimal 1,802,634, and design is the most praised thing on phones | Accent, font, width, density | S
Iconize 2,223,098 | Icons on files and folders | S
Outliner 1,408,848 | Move list items, zoom into a bullet | S
Homepage 1,332,645 | A chosen start page | S
Recent Files 1,188,494 | Recent in the tree and the switcher | S
Tag Wrangler 1,092,388, 811 hearts | Rename and merge tags | S
Notebook Navigator 971,308 | A notes list with title, first line, date | M
Hover Editor 589,500 | Page preview on hovering a link | S
Highlightr 719,616 | Highlight colours | S
Obsidian's most-liked request, 1,078 hearts | Edit an embedded note in place | S
Small things people install plugins for | Paste a URL over a selection, natural-language dates, image compress on paste, selection word count, deep links, custom sort, new-tab default, title from the H1 | S each

**MVP 1.** Dataview 4,967,706 becomes views over properties and tags (L). Kanban 2,668,372 becomes a block over a task list (M). **Claudian 2,112,607 and Copilot 1,900,500 become an agent panel** that runs the user's own agent against the project (L). Smart Connections 1,201,036 becomes related notes by meaning (M). Local REST API with MCP 725,676 becomes our MCP server (M). Mind Map 885,474 (M). Advanced Slides 836,896 (M). Commander 707,683 becomes a customisable toolbar (S).

**Later.** Canvas, PDF annotation, citations, spaced repetition, LaTeX snippets, day planning, calendar events, self-hosted sync, a plugin system. Sync needs no plugin: ours is built in, which removes the 6,309,872 downloads people spend routing around paid sync `[O]`.

## 8. The blueprint

Shaped for how agents actually load context `[M]`: a short index, a body under five thousand tokens, and detail behind links one level deep.

````
booking-blueprint/
  SKILL.md              a short index: what this is, when to load what. Under 500 lines
  AGENTS.md             house rules. Under 200 lines, because the runtimes cap it
  00-BRIEF.md           the project in one page, the first user, the one metric
  01-PRODUCT.md         what ships first, what is cut
  02-DATA-AND-API.md    entities, relationships, operations
  03-ARCHITECTURE.md    one short decision record per structural choice
  04-SETUP.md           environment, local setup, the commands that gate a commit
  specs/booking.md      files governed, verify commands, a numeric exit condition
  specs/payments.md
  MAP.md + graph.json   what governs what, which decision explains which spec
  MANIFEST.json + SHA256SUMS
````

**Three rules taken from the runtimes' own guidance** `[M]`: reference files rather than copying them, because copies go stale; keep references one level deep from the index; and never let two rules contradict, because "if two rules contradict each other, Claude may pick one arbitrarily".

**We emit the whole instruction set, not one vendor's file** `[M]`. Claude Code does not read `AGENTS.md`, so a `CLAUDE.md` carrying `@AGENTS.md` ships beside it, along with `.github/copilot-instructions.md`, `GEMINI.md` and `.cursor/rules/*.mdc`. Generating one filename makes us a second-class citizen in half the runtimes.

**Delivery.** A content-addressed, immutable URL per version, with a checksummed manifest, `noindex`, `no-referrer`, revocable. A free kit unvisited for 30 days expires. `curl` needs no account. The kit also carries `llms.txt` and `Link` headers with `rel="alternate"` and `rel="describedby"`, because an unguessable URL with no link relations is invisible to the discovery path the field is standardising on `[M]`.

## 9. The engine baseline

Twelve invariants. Each is something that, if we get it wrong now, forces a rewrite when agents get more capable.

1. **The file is the record.** Markdown bytes are the truth; every view is a projection. No proprietary store. Buys: any future agent reads the corpus with no adapter.
2. **Splice-only writes.** An edit locates a byte range, replaces exactly those bytes, and **refuses when the range is ambiguous**. Buys: an agent's edit is reviewable and reversible. This is what a switcher asked for in section 3.3. **Where we stand: one branch refuses a column-zero list item in front matter, which is 83 percent of real vaults, estimated at four days to fix; and a trailing `# comment` is deleted on a set, measured. Both are fixed before any public claim** `[R]`.
3. **Content-addressed versions.** Every save writes a new immutable key carrying its hash. Buys: history, rollback, provenance, and an agent that can cite the exact version it read.
4. **Every change carries an author and an intent.** Person or agent, the model, the task. Buys: "who wrote this" stays answerable, which the research says people will not do themselves `[O]`.
5. **A proposal is a first-class object.** A change exists before it is applied. Buys: agents propose, people accept, which is the only safe way to let an agent touch a document.
6. **Everything has a stable address** that survives a rename: file, heading, block, property. Buys: an agent can be told to edit one block rather than a file.
7. **Machine-readable exits.** Every document and kit is retrievable as raw markdown by `Accept: text/markdown` and by a `.md` twin, with `Link` relations, an `llms.txt`, and a checksummed manifest over immutable URLs `[M]`.
8. **A capability surface, not a screen surface.** Every action exists as a named operation: open, read, search, propose, apply, publish, export. Buys: an MCP server, a command line and an API are thin adapters, not parallel implementations.
9. **Permissions attach to the operation.** Read, propose, apply and publish are separate rights, and the protocol requires it: "Hosts must obtain explicit user consent before invoking any tool" `[M]`. Buys: an agent token that may propose but never apply.
10. **Budgets and breakers at the operation layer.** Every model call is metered, attributed and stoppable centrally. Buys: an agent loop cannot spend the month.
11. **Deterministic rendering.** The same bytes render the same everywhere, and any block we invent degrades to readable text elsewhere. Buys: the file stays portable, the most cited reason people choose a markdown app `[O]`.
12. **No silent merge, ever.** Conflicting versions are shown and chosen between `[R]`.

**What this makes the product.** The vault is the agent's memory. The map is its index. The instruction files are its policy. The blueprint is its brief. The review queue is how it is supervised. None of those is bolted on; each follows from the twelve.

## 10. What agents read and write

Safe to build on now `[M]`: `AGENTS.md`, over 60,000 projects, Linux Foundation stewarded; markdown twins at `.md` URLs; the skills format, whose frontmatter is five fields with a reference validator and 46 clients; and the Model Context Protocol's tools and resources over its HTTP transport.

Too young to depend on `[M]`: the protocol's newest revision removed the initialisation handshake and its own specification calls straddling implementations "dual-era", so our server declares both revisions or pins the older one; its Tasks, Skills-over-protocol and Apps extensions are opt-in and need support on both sides; and `llms.txt` is still one author's proposal, although Chrome's Lighthouse now audits for it.

**Our MCP server, when it ships in MVP 1**, exposes documents and the manifest as resources with change subscriptions; the splice write, search and **a structured refusal** as tools, because a refusal must be a machine-readable error and not prose; review and kickoff as prompts; roots to learn which vault was granted; **elicitation to ask the user when a span is ambiguous instead of guessing**; completion for path and heading arguments; and pagination on every list. Authorisation is OAuth 2.1 with per-tool consent, and agent identity stays separate from human identity on every write.

## 11. AI, credits, cost

Two credit types. An **edit credit** buys one AI edit, one generated document, one summary, one link suggestion. A **blueprint credit** buys one blueprint with its questions, writing and consistency pass.

Sonnet 5 is $2 and $10 per million tokens; Haiku 4.5 is $1 and $5 `[M]`. At ₹95.96 to the dollar. Token counts are assumed, so every line is an estimate.

Task | Tokens in / out | Sonnet | Haiku
---|---|---|---
One edit | 4,000 / 800 | ₹1.54 | ₹0.77
One document | 2,000 / 1,500 | ₹1.82 | ₹0.91
One blueprint, eleven files plus a review pass | 60,000 / 23,000 | ₹33.6 | ₹16.8
Blueprint, mixed: Haiku questions, Sonnet writing | 20,000 / 3,000 then 40,000 / 20,000 | ₹30.2 |

Edits run on Haiku by default with a two-credit careful option. Prompt caching applies to the instructions, question set and templates. At full use a free user costs about ₹37.9 a month and a Pro seat about ₹228, both estimates. Re-derive after month one.

**Ships with the credits:** a daily spend breaker per user and one global, a per-task token ceiling, rate limits, and the AI routes behind sign-in and metering.

## 12. Rendering

A callout for prose, a fenced block for data, non-standard kinds prefixed `fm-` `[R]`. No custom marker pairs.

````
| Channel   | Bookings |
|-----------|---------:|
| Instagram |      312 |
| WhatsApp  |      186 |

```fm-chart
kind: pie
table: above
```
````

Here the chart draws and the table folds. Anywhere else the table is still a table and the block is two lines of code. Kinds: pie, bar, line. "Convert to Mermaid" writes the portable version.

We also read Obsidian's dialect unchanged, because that is what a switcher's vault contains: `[[link]]`, `[[link|alias]]`, `[[link#heading]]`, `![[embed]]`, `==highlight==` and `^block-id` `[O]`.

## 13. Storage

R2 is the bucket, Firestore is the database, never the reverse `[L]`.

Thing | Where | Shape
---|---|---
Document bytes, every version | R2 | `u/<uid>/d/<docId>/v/<n>-<sha256>.md`, never overwritten
Uploads | R2 | `u/<uid>/a/<sha256>.<ext>`
Kit files, map, tarball | R2 | `k/<kitId>/v<n>/…` plus checksums
Users, plan, credits ledger | Firestore, Mumbai | One ledger row per credit
Index, projects, shares, publishes, comments | Firestore | Records only
Live session state | Durable Objects, one per open document | While the session lives
Security logs, 180 days | Mumbai | Legal floor

Move the R2 bucket to a Studio Zephyrus account before the first stranger's document lands in it `[L]`.

## 14. Offline, sync, live editing, desktop

**Offline.** This device first, cloud second. Saving compares versions: if the cloud moved, both are shown and the person chooses `[R]`. Safari deletes script-writable storage after seven days without interaction, so on Safari the promise holds only for the installed app `[M]`.

**Live editing.** The document of record stays markdown bytes, one version per save. A live session exists only while two people have the file open. It never owns the bytes, never decides a conflict between versions, never touches files on disk.

**Desktop.** Bundle the frontend, scope the file-system capability, set a content policy, rename the identifier, sign and notarise. macOS at $99 a year. Linux needs no certificate but needs a Linux CI runner `[M]`. Windows waits for MVP 1.

## 15. Accounts, sharing, publishing

Google first, GitHub second. Everyone who edits or comments needs an account, which is what makes suggestions attributable `[Z]`. Editing without an account exists for the local draft and export. A published page is readable by anyone with the link, `noindex` by default, five free, custom slug on Pro.

## 16. Money

₹299 a month, ₹2,499 a year, India first `[Z]`. About $3.12.

Comparable | Price
---|---
Obsidian Sync Standard | "$4" a month billed annually: 1 vault, 1 GB, 5 MB per file, 1 month history
Obsidian Sync Plus | "$8": 10 vaults, 10 GB, 12 month history
Obsidian Publish | "$8" per site a month
Obsidian commercial licence | "$50" per user a year
Bear Pro | "$2.99/month" or "$29.99/year"
Notesnook | Free unlimited encrypted sync; paid adds attachment storage
Anytype | Free 100 MB, then $4, $8, $16
Joplin Cloud | 2.99€ a month
Tolaria | Free for ever, open source, desktop only
ChatGPT Go and Google AI Plus, India | ₹399 each
Zoho Workplace Standard | "₹99 /User /Month"

**The read.** We sit under Obsidian Sync Standard while giving unlimited documents, 90-day history, 5 GB of uploads and publishing, with no separate commercial licence. We sit above India's productivity suites. Two competitors give the core away, so **the free tier has to be genuinely good and the paid tier has to be about the work, not about permission to sync** `[P]`. Note what we are not charging for: we do not meter storage or retrieval the way the memory vendors do, at $8 to $375 a month, and we do not keep the data. **We charge for the editor and the brief, and the files stay the customer's** `[Z]`.

**What ₹299 nets.** A consumer price includes GST at 18 percent: 299 ÷ 1.18 = ₹253.39. The gateway takes 2 percent plus GST, ₹7.06. **Net about ₹246**, about ₹172 on the annual plan.

**Payments** `[L]`. Card mandates register up to ₹15,000 without fresh authorisation. UPI AutoPay needs a notice at least 24 hours before every debit. An Indian card gets one attempt. International payments need bank approval, video identity checks and four published policy pages.

## 17. Before the first stranger

Due before launch | What
---|---
Privacy policy, terms, consent | The 2011 rules are live now; the newer act's penalties start 13 May 2027
Named grievance officer | The page and the address
Breach contact filed, six-hour runbook | Six hours from noticing, no size floor
Security logs, 180 days, in India | Minimal append-only log
Processor agreements | Cloudflare, Google, Anthropic, the payment gateway
Report form, 24-hour acknowledgement, takedown, preservation log, moderation page | Public pages by strangers make us an intermediary, about 74 founder-hours, all before the first stranger publishes
Retention table, 18-plus line | One sentence now, awkward later
Four policy pages for international payments | Terms, privacy, refund and cancellation, shipping
EU sign-ups blocked | A representative costs €39 to €160 a month
GST position confirmed by a chartered accountant | Reverse charge on imported AI services
R2 bucket moved to the company | Section 13

Never train on documents. Free kits expire. Delete on request.

## 18. Security

We render untrusted markdown, run a model over private documents, and write to GitHub. That is all three legs of the prompt-injection problem `[R]`, and it gets worse when the documents are an agent's memory. A memory vendor put it plainly this month: "One poisoned message, web page, or document can shape every later session that reads the same memory. Persistent memory makes prompt injection durable" `[M]`. Their answer is policy inside their own database. Ours is better suited to it: the person can read, span by span, what an agent changed in their own files. Six controls ship in MVP 0.

1. **Untrusted content is never instruction.** Document text reaches the model inside a delimited data block, and inbound tool annotations are treated as untrusted `[M]`.
2. **No silent outbound fetch from a document.** Remote images in a shared document are proxied or click-to-load; the published page allows no third-party image or script origin.
3. **The AI proposes, never acts.** No AI-initiated share, push or publish, ever.
4. **A GitHub push is always explicit**, always to a branch, never a merge.
5. **The daily spend breaker** bounds an injection loop.
6. **No puzzle at the door** `[Z]`. Abuse checks run invisibly.

---

# Part four: how we build it

## 19. What we already have

Already built | What it saves
---|---
Complete payment integration: order verification, webhook signing, refunds, a browser test | Most of the payments item
The credit engine: plans, entitlements, billing tables, a three-tier AI cost model, kill switches | The ledger and server-side caps
A ten-primitive inline SVG renderer, one already a bar chart | Most of the chart block
19 browser-side PDF tools, no uploads | The browser export path
Two scoring engines, standard library only | The problems panel
A named-app auth client with a refresh guard | Sign-in
A numbered document convention proved on three sets, 61 files | The kit spine
A map of a whole system, rebuilt from files at no token cost | S22
A public skills registry with 184 skills | The community route

Genuinely new: the offline outbox, live editing, the GitHub App, the kit writer, the consistency check, and the parity work in section 7.

## 20. The build

**S** is 1 to 2 engineering days, **M** 3 to 5, **L** 6 to 10.

**Phase 0, weeks 0 to 2, before code.** Settle section 23. Move the R2 bucket. File the breach contact, publish the policy, terms and grievance pages, sign the processor agreements, ask the accountant, publish the four payment policy pages. Fix the repository default that still points at the sibling's vault. **Fix the two engine defects in section 9, invariant 2.** Publish the pace every Friday. Make twenty blueprints by hand for twenty people outside the studio and watch whether five run the kickoff.

Phase | Contents | Days
---|---|---
A, the launch core | Editor at the root, sign-in, per-user storage, projects and tabs, right pane, AI writing box, export, published page, moderation apparatus, markdown twins, problems panel | 27 to 46
B, AI and credits | Suggestion mode, the ledger and caps, model routing and prompt caching, injection controls | 11 to 19
C, the blueprint | Six decisions, the kit writer and consistency check, the skill folder and the whole instruction set, the map, storage and links, kickoff prompt, drawing attach, the GitHub App | 30 to 51
D, sharing | Share dialog, comments, suggestions, live editing | 15 to 25
E, offline and desktop | Outbox, PWA, desktop nudge, macOS signing, Linux targets | 15 to 26
F, Pro | Subscriptions, plan page, history, chart block, instruction-file editor, retention and EU block | 14 to 24
**G, parity** | **Section 7: drawing, templates, tasks, calendar, capture, search and replace, importers, and fifteen smaller items** | **43 to 76**
| **Everything** | **155 to 267**

**The launch core**, what a stranger meets on day one, is A, B, C, payments and the plan page: **72 to 123 days**.

At this pace | Launch core | Everything
---|---|---
1.21 days a week, the measured rate `[R]` | 60 to 102 weeks | 128 to 221 weeks
3 days a week | 24 to 41 weeks | 52 to 89 weeks
5 days a week | 14 to 25 weeks | 31 to 53 weeks

**Say this plainly.** Parity alone is 43 to 76 engineering days. At the measured pace the whole plan is two and a half to four years; at five days a week it is under a year. **The scope now exceeds what two part-time founders can build, so either the pace changes or phase G ships in stages.** If it ships in stages, the launch keeps drawing, templates, capture and search, because those are what a switcher notices in the first hour.

## 21. Risks, and where we stop

Risk | Kill line
---|---
Nobody keeps a blueprint alive after the first build | Fewer than two of ten pilot users edit a kit after its first build: keep the editor, stop the generator
**Tolaria takes the agent-plus-markdown position, free and open source** | It is desktop only, with no sync, sharing or phone. If it ships a web app and sync, we compete on the blueprint, collaboration and India pricing
**Obsidian ships a web version** | Their third most-liked request, not on their roadmap. If it appears, our opening narrows to AI, collaboration and the blueprint
**Obsidian takes the agent position itself** | Its chief executive's agent-skills repository has 48,440 stars in nine months. We cannot win on the vault; we win on the editor a person pays to open, on collaboration, and on the brief. If Obsidian ships an agent panel and a web app in the same year, reconsider the whole plan
**Apple Notes speaks markdown now** | It has no links, no plugins, no agents. If Apple adds wiki links, the casual half stops being winnable
Parity sinks the schedule | If phase G passes 40 days with the launch core unfinished, cut it to drawing, templates, capture and search
**We build scaffolding the models make redundant** | Anything built because today's agents cannot do it is dead weight within a release. Keep the abstractions, session, file, manifest, refusal; drop the hand-holding
Free AI costs more than assumed | Model cost per active free user over ₹60 in a month: halve the free caps that week
Pro loses money at full use | Measured cost per Pro seat over ₹200: ₹399 for new seats
AI in the way drives people off | If AI is named in more than one in ten complaints, make it fully hideable
Injection through a shared document | One confirmed leak: sharing goes invite-only until fixed
Pace | Launch core not done in 30 weeks: cut blueprint automation, launch the editor with hand-made kits

## 22. What we measure

The funnel: visits, documents created, sign-ups, blueprints started, finished, kickoff copied, kit fetched by an agent, **kit edited again within seven days**, pages published, second collaborator invited, Pro.

**The one number: blueprints edited after their first build, per week.**

**Also:** the acceptance rate of AI suggestions, accepted against proposed. And **how many new accounts arrive with an imported vault**, since an import is the clearest sign someone is moving rather than trying.

**The pilot passes** when three of ten strangers name the problem unprompted, two of ten are still editing at day 30, one call is booked, and five of ten run the kickoff.

**Published every Friday:** engineering days, the running rate, the re-forecast date, model cost per active user, suggestion acceptance, and conversion once it exists.

## 23. Answer before phase 0 ends

1. **The pace, and who builds.** The scope no longer fits two part-time founders. At 1.21 days a week the whole plan is two and a half to four years. Everything else waits on this.
2. **Does parity ship at launch or in stages?** Default: drawing, templates, capture and search at launch, the rest after.
3. **₹299 or ₹399**, against two competitors that give the core away free.
4. **The name.** No trademark search has succeeded. Free if we coin: `getfrontmatter.com`, `usefrontmatter.com`, `mdmax.in`, `mdmax.ai`, and the `mdmax` package name.
5. **Windows:** the PWA now, a certificate in MVP 1?
6. **EU sign-ups** blocked for MVP 0?
7. **The templates source.** No "box project" repository exists on this machine. Default is the kit in section 8.
8. **The free caps** as written, given that sync is free elsewhere?
9. **Who makes the twenty hand-made blueprints, and by when.**
10. **Which of the 184 skills may be public.**
11. **Does the kickoff prompt tell the agent to read the map first?**
12. **Whether an installed web app can join the iPhone share sheet or place a widget.** Unverified, and capture on phones depends on it.
