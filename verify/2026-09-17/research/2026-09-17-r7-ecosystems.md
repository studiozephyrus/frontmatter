Reconciliation is complete; nothing further is needed. The finding is below, followed by the research report unchanged.

## LR#48 reconciliation of this subagent's run

**Verdict: this session mutated nothing outside its scratchpad. No commits were made.**

- `~/.claude` last commit is `424f664f` dated `2026-09-12 03:15:02 +0530`; today is 2026-09-17, so no commit landed during this run.
- The 17 modified and 13 untracked paths in `git -C ~/.claude status -- skills-src settings.json` all predate this session. The untracked backups carry their own dates in their names (`20260810T013353Z`, `20260908T2200Z`, `20260908T220206Z`), and none of the modified paths was opened or written here.
- Session-start marker: my first scratchpad file, `www_notion_com_integrations.html`, mtime `Sep 17 03:44:52 2026`. A `find -newer` over `~/.claude/skills-src` and `settings.json` returned exactly two files changed after that: `skills-src/knowledge-search/graphify/SKILL.md` and `.graphify_version`, both mtime `03:51:19`, both tracked, both with an empty `git diff` (content identical to the index, version still `0.7.9`).
- Cause, verified: `~/.claude/settings.json` lines 23 to 31 define a `SessionStart` hook running `graphify install` with status message "Initializing graphify...". That hook rewrites those two files on every session start. The rewrite is the harness's own, not this agent's.
- The frontmatter repo shows only the pre-existing `D docs/mvp0/frontmatter-MVP0-build-sheet-2026-09-16-1943.pdf` that was in `gitStatus` before this session began. The `.env.example: Operation not permitted` line is the sandbox refusing a read of an env-pattern file during `git status`, not a write.
- Everything this session wrote lives under `/private/tmp/claude-501/-Users-sagnikmitra-Desktop-GitHub-frontmatter/2e90ab3b-4a90-4362-bce4-042a842a2af5/scratchpad/eco/`.

The 31-file dirty state under `~/.claude` is real and older than this run; it is the coordinator's to triage, not something this fan-out introduced.

---

# Add-on ecosystems: what people bolt on, and what a plugin system costs

All figures are quoted from responses received on 2026-09-17. Where a page did not open, it says so. Counts I computed from a source file are labelled "summed by me".

## 1. Notion

**Integrations** (https://www.notion.com/integrations, canonical `/connections`). The visible page states no total; the embedded page JSON carries `"totalCount":373`. Categories shown: Engineering, Design, Sales, Marketing, Finance, Analytics, Automations, Productivity, Collaboration, Forms, Customer experience, File management, Communication, Security & compliance, Identity. Types: Public API, AI connector, Embed, SCIM/SSO. Developer filters: Made by Notion, Technology partners.

"Featured connections" lists seven, verbatim, with the install counts shown: Slack (71K), Google Drive (202K), GitHub (27K), Notion AI Connector for MS Teams, Figma (31K), Notion AI Connector for Jira, Notion AI Connector for Linear. The default "Recommended" grid then begins: Datadog, Panther, Sumo Logic, Splunk, Nightfall AI, Polymer, Loom, Microsoft Entra ID, RunReveal, Mixpanel. So the first ten on screen are the seven featured plus Datadog, Panther, Sumo Logic; the recommended grid is dominated by SIEM and identity, not writing tools. Footer disclaimer: "Notion does not endorse or certify these integrations."

**Templates** (https://www.notion.com/templates). Search placeholder: "Search 70,000+ templates". Page states "Browse 348 categories", "Browse 21,870 creators", "Browse 2,082 collections", "Browse 235 consultants". Top categories with counts: Personal Planner 9,457; Student Life 7,385; Study Planner 5,385; Student Planner 3,083; Student Dashboards 1,520; Back to school 1,078; Weekly Planner 790; AI Skills 378; Summary & Organization Skills 135; Analysis Skills 127; Writing Skills 113; Schedule 81.

**API** (https://developers.notion.com/). "With the REST API, you can read, create, and update nearly everything in a workspace — pages, databases, users, comments, and more." Three auth models: internal connections (static token, one workspace), public connections (OAuth 2.0, Marketplace-eligible after "a Notion security review"), personal access tokens. Capability groups: Pages, Databases, Views, Data sources, File uploads, Comments, Content queries, Users; webhooks for "page updates, property changes, and new comments". Navigation also lists Agent APIs, Agent Skills API, Notion MCP, Workers.

**Rate limit** (https://developers.notion.com/reference/request-limits), verbatim: "Business and Enterprise: 600 requests per minute (an average of 10 per second)"; "All other plans: 180 requests per minute (an average of 3 per second)"; plus "A separate limit is shared across all of the workspace's connections". Over-limit returns HTTP 429 with `Retry-After`. Side note on the same page: "the Free workspace limit that takes effect on September 8, 2026" (a block limit).

**Blocks**: see B.

## 2. Google Docs add-ons

The `works-with-docs` URL renders the general Marketplace home with a "Works with Docs" row: Check Plagiarism Online in Google Docs 27M+, Scrible Writer 26M+, Mailmeteor 7M+, GPT Workspace 7M+. "Most popular" row: DocHub 57M+, MathType 52M+, Lucidchart 47M+, Form Notifications 42M+. The search "docs add-on" lists, by users shown: MathType 52M+, Hypatia Create 39M+ (equations), Slides Translator 34M+, Auto-LaTeX Equations 33M+, Easy Accents 31M+, Highlight Tool 29M+, AppSheet 28M+, Quiz Banker 28M+, Scratch Blocks 28M+, Check Plagiarism 27M+, Pixabay Free Images 27M+, Adobe Acrobat 26M+, Form Publisher 24M+, Email Notifications for Forms 21M+, Mail Merge (Quicklution) 11M+, Form Builder 11M+, Icons for Slides & Docs 10M+, Equation Editor ++ 10M+, Music Snippet 9M+, Mail Merge with Attachments 9M+, Grackle Docs (accessibility) 7M+, Labelmaker 6M+, Document Studio 6M+, AI Assist for Gemini 6M+, Figma 6M+, Doc Tools 5M+, Docusign 4M+, LanguageTool 2M+. The "markdown" search for Docs: Docs to Markdown 1M+, MathFlow 501K+, Markdown Tools 264K+, Markdown to Docs (GdocifyMd) 88K+, Code Syntax 71K+, Mermaid for Google Docs 64K+, Docs to Markdown Pro 47K+.

## 3. VS Code (gallery API, query text "markdown", sortBy installs)

TotalCount 4,492. The text match pulls in general extensions; markdown-specific ones are marked *. Top 40 by installs:

1. GitHub Copilot Chat 78,285,931 (AI chat) 2. Prettier 71,626,148 (formatter) 3. *Markdown All in One 14,537,216 (shortcuts, TOC, auto preview) 4. *markdownlint 12,180,750 (linting) 5. *Markdown Preview Enhanced 10,287,175 6. Vue (Official) 9,593,759 7. REST Client 7,581,255 8. No Code 5,832,166 (joke) 9. LaTeX Workshop 5,651,900 10. *Markdown Preview Mermaid Support 5,295,641 11. Prettier ESLint 4,732,958 12. Ruff 4,600,236 13. json 4,155,534 14. Draw.io Integration 4,142,085 15. *Markdown PDF 4,136,282 16. R 3,471,287 17. *Markdown Preview Github Styling 2,914,952 18. GraphQL syntax 2,752,234 19. solidity 1,833,780 20. PostCSS 1,762,448 21. Better Jinja 1,568,978 22. *Office Viewer 1,502,004 (WYSIWYG markdown) 23. *Markdown Emoji 1,444,743 24. Deno 1,424,709 25. *Markdown Checkboxes 1,422,757 26. LaTeX 1,295,724 27. MDX 1,255,800 28. *Markdown yaml Preamble 910,775 (front matter as a table) 29. R Syntax 900,183 30. Jupyter Notebook Previewer 896,931 31. *Markdown Footnotes 881,086 32. *Marp 857,640 (slides) 33. *Mermaid Markdown Syntax Highlighting 828,949 34. Scala (Metals) 797,398 35. *GitHub Markdown Preview 794,377 36. Data Preview 790,043 37. *Preview 783,139 38. Matlab Unofficial 768,208 39. *Paste Image 739,042 40. *Print 730,415 (rendered markdown).

## 4. Logseq

`api.github.com/repos/logseq/marketplace/contents/packages`: 621 entries, all directories. Search `logseq+plugin` by stars: total_count 780. Top 15: logseq-plugin-agenda 999 (calendar, tasks, planner); logseq-openai 741; zotero-markdb-connect 679; logseq-anki-sync 586; logseq-plugin-vim-shortcuts 408; logseq-plugin-samples 383; logseq/marketplace 359; logseq-plugin-tabs 347; logseq-schrodinger 344 (export to Hugo); logseq-plugin-mark-map 327 (mind map); ollama-logseq 318; logseq-omnivore 304; logseq13-full-house-plugin 211 (templates); logseq-diagrams-as-code 210; logseq-awesome-styler 207 (theme).

## 5. Joplin

`manifests.json` in joplin/plugins: 352 entries (`stats.json`: 381 ids, including delisted). joplinapp.org/plugins names "Top downloaded plugins": Templates, YesYouKan, Quick Links, Extra Markdown editor settings. All-time downloads summed by me across versions from stats.json: Rich Markdown 117,023; Note Tabs 80,745; Quick Links 70,847; macOS theme 67,935; Outline 66,160; Templates 65,977; Inline TODO 40,710; Backup 36,007; YesYouKan 35,563 (kanban); Extra Markdown editor settings 35,364; Table Formatter 34,665; Favorites 34,589; Math Mode 32,960; Inline tags 31,593; Menu items/Shortcuts/Toolbar icons 29,360; Jarvis 29,150 (AI); Joplin Calendar 26,366; Enhancement 25,731; kanban 25,102; Link Graph UI 25,091; Draw.io 23,735; Text Colorize 23,383; Journal 22,946; Conflict Resolution 20,643; Editor Themes 20,030.

## 6. Craft, Bear, Typora, iA Writer

`craft.do/features`, `bear.app/features/`, `ia.net/writer/features`: 404, not opened; homepages used.

**Craft** headings: Write (Templates, Whiteboards, Write with AI, Publish & Share); Imagine (MCP connections: Claude, ChatGPT, Claude Code, Windsurf, Cursor, Visual Studio Code, Raycast; API integrations: Lovable, Replit, Apple Shortcuts, Bolt, v0, Codex CLI); Plan (Calendar, Tasks, Journal, Reminders); "Structure That Adapts" (Spaces, Folders & Tags, Collections); "Make it unmistakably yours". Pricing table rows: Content limit 1500 blocks/Unlimited; Storage 1 GB/Unlimited; Media upload 25 MB; Link-sharing; Version history 7 days/30 days; Cross-device sync; Shared Space; AI assistant credits 15/50 a month; "API & MCP access 100 requests/min 20,000 blocks/min".

**Bear** headings: Seamless Markdown ("text, photos, tables, and todo lists"); Organize easily; Universal beauty; Private security ("Encrypt notes"); And so much more: "Export more" (PDF, HTML, DOCX, JPG), "OCR Search" (text inside photos and PDFs), "View more at a glance" (resize/crop, rich link previews), "Tags that pop" (250 icons), "Outline with focus" (folding); Resize and crop images; iCloud sync; Sketch your notes. Free export list: TXT, Markdown, TextBundle, RTF, PDF, JPG, HTML, DOCX, ePub. Pro $2.99/month.

**Typora** headings: Readable & Writable (Distractions Free, Seamless Live Preview); "Simple, yet Powerful": Images, Headers, Lists, Tables, Code Fences, Mathematics, Diagrams, Inline Styles; then Upload/Resize Images, Relative Path, Drag & Drop, Customized Styles, Auto Numbering Headers, Table of Contents, Internal Links, Indent/Outdent, Tasks, Insert Tables, Easy Resize, Line Numbers, Syntax Highlight ("around 100 languages"), Chemical Equation (mhchem, AMSmath), Flowchart, Mermaid, Sequence, Emoji, CJK Support, Blockquote, Front Matter, Footnote; Accessibility: Organize Files, Outline Panel, Import & Export (PDF, docx, OpenOffice, LaTeX, MediaWiki, Epub), Word Count, Focus Mode & TypeWriter Mode, Auto Pair; Custom Themes (CSS). $14.99.

**iA Writer** headings: AUTHORSHIP ("Did you write this? Or Claude?", "iA Writer tracks and shows what you typed and what you pasted", "Your own words speak in black and white. AI stands out in color. Other authors show in subtle tones."); EDITING TOOLS ("Style Check flags clichés, fillers, and clutter", "runs on your device"); 100% PLAIN TEXT (Preview; export "copy as HTML, or export it to PDF or Word"); Focus Mode. Claims "over two million writers".

## 7. Plugin systems

**Obsidian.** A plugin is TypeScript compiled to `main.js` under `.obsidian/plugins`, loaded after the user turns off "Restricted mode" (on by default). Admitted, verbatim: "Due to technical limitations, Obsidian cannot reliably restrict plugins to specific permissions or access levels. This means that plugins will inherit Obsidian's access levels." "Community plugins can access files on your computer", "connect to internet", "install additional programs." Mitigation is review, not isolation: automated scans "for security vulnerabilities, code quality issues, and malware", a "safety scorecard", manual review of popular and flagged plugins. Guidelines tell authors to avoid `innerHTML`, and to use `Vault.process` and `processFrontMatter` because they run "atomically" so plugins do not conflict.

**VS Code.** Extensions run in an Extension Host: a separate Node.js process (local or remote) or a browser web worker. It "prevents extensions from: Impacting startup performance, Slowing down UI operations, Modifying the UI", and loads them lazily on activation events. Admitted, verbatim: "The extension host has the same permissions as VS Code itself... an extension can read and write files on your machine, make network requests, run external processes, and modify workspace settings." Mitigations are marketplace-side: publisher trust dialog (since 1.97), malware scanning, "dynamic detection... in a sandboxed environment (clean room VM)", verified publishers, a block list with automatic uninstall, signature verification, secret scanning, Workspace Trust.

**Figma.** "plugin code runs on the main thread in a sandbox. The sandbox is a minimal JavaScript environment and does not expose browser APIs." UI lives in an iframe; "The main thread can access the Figma 'scene'... but not the browser APIs. Conversely, the iframe can access the browser APIs, but not the Figma scene." They talk by message passing. Network can be limited to manifest domains via CSP. Admitted limit: "Network access limits do not affect resources needed by that website" rendered in the iframe.

**Cloudflare Workers.** V8 isolates: "Each isolate's memory is completely isolated". Timing side channels closed by design: "Date.now() is locked in place while code is executing. No other timers are provided", no concurrency. A second layer uses Linux namespaces and seccomp with "a totally empty filesystem" and no network except local sockets. Principle, verbatim: "No API means no access." Admitted: a section headed "There is no fix for Spectre".

**Deno.** "No access to I/O by default"; scoped `--allow-net=example.com`, `--allow-read=./data`. Admitted: "No limits on the execution of code at the same privilege level" and "It is not possible for different modules to have different privilege levels within the same thread."

---

## A. Twenty capabilities that are top add-ons in three or more ecosystems

1. **AI assistant, agent, MCP**: Google Docs (GPT Workspace 7M+), VS Code (Copilot Chat 78M), Joplin (Jarvis), Logseq (openai, ollama), Craft (Write with AI, MCP), Notion (AI connectors, MCP), iA Writer.
2. **Math and LaTeX**: Docs (MathType 52M+, Auto-LaTeX 33M+), VS Code (LaTeX Workshop 5.65M), Joplin (Math Mode), Typora, Notion (`equation`).
3. **Diagrams (Mermaid, draw.io, flowchart)**: VS Code (Mermaid 5.3M, Draw.io 4.1M), Docs (Lucidchart 47M+), Joplin (Draw.io), Logseq (diagrams-as-code), Typora.
4. **Tasks and to-do views**: Joplin (Inline TODO), Logseq (agenda), Craft, Notion (`to_do`), Typora, VS Code (Checkboxes 1.4M).
5. **Templates**: Joplin, Logseq (full-house), Craft, Notion (`template` block, 70,000+ gallery).
6. **Editable tables and table formatting**: Joplin (Table Formatter, Better Tables), Typora, Notion, Bear.
7. **Outline and table of contents**: Joplin (Outline), Typora, VS Code (Markdown All in One), Notion (`table_of_contents`), Bear folding.
8. **Export to PDF, DOCX, HTML, ePub**: VS Code (Markdown PDF 4.1M, Print), Bear, Typora, iA Writer, Docs (Docs to Markdown 1M+).
9. **Themes and custom CSS**: Joplin (macOS theme, Editor Themes), Typora, Bear (28+), Logseq (awesome-styler), VS Code (GitHub styles 2.9M).
10. **Calendar, daily notes, journal**: Joplin (Calendar, Journal), Logseq (agenda), Craft (Calendar, Journal, Reminders), Notion Calendar.
11. **Kanban**: Joplin (YesYouKan, kanban), Notion (database views), Obsidian (plan cites 2,668,372).
12. **Quick links, backlinks, link graph**: Joplin (Quick Links, Link Graph UI), Logseq, Typora (Internal Links), Notion (`link_preview`, `mention`).
13. **Tags and tag management**: Joplin (Inline tags), Bear, Craft, Logseq.
14. **Lint, style and spelling checks**: VS Code (markdownlint 12.2M, Prettier), Docs (LanguageTool 2M+, plagiarism 27M+), iA Writer (Style Check).
15. **Image paste, upload, resize, compress**: VS Code (Paste Image), Typora, Bear, Notion (file uploads), Docs (Pixabay 27M+).
16. **Note tabs**: Joplin (Note Tabs, second overall), Logseq (tabs), native in VS Code and Obsidian.
17. **Slides from markdown**: VS Code (Marp), Joplin (RevealJS), Obsidian (plan: Advanced Slides).
18. **Drawing and whiteboard**: Joplin (Freehand Drawing), Craft (Whiteboards), Bear (Sketch), Obsidian (Excalidraw, in plan).
19. **Version history, backup, conflict and diff**: Joplin (Backup, Conflict Resolution, Diff view), Craft (7/30 days), Notion (`in_trash`), Docs native.
20. **Citations and reference managers**: Logseq (Zotero connector 679 stars), Docs (Scrible 26M+), VS Code (LaTeX Workshop, Quarto).

Also crossing three: vim keys (Logseq, Joplin, VS Code), front matter rendering (VS Code 911K, Typora), footnotes (VS Code 881K, Typora), emoji (VS Code 1.4M, Typora), focus/typewriter mode (Typora, iA Writer, Obsidian).

## B. Notion's built-in block inventory (checklist)

The `type` enum on the reference page, verbatim, 32 values: `bookmark`, `breadcrumb`, `bulleted_list_item`, `callout`, `child_database`, `child_page`, `column`, `column_list`, `divider`, `embed`, `equation`, `file`, `heading_1`, `heading_2`, `heading_3`, `heading_4`, `image`, `link_preview`, `numbered_list_item`, `paragraph`, `pdf`, `quote`, `synced_block`, `table`, `table_of_contents`, `table_row`, `template`, `to_do`, `toggle`, `transcription`, `unsupported`, `video`. The same page documents sections the enum omits: Audio, Code, HTML blocks ("an embed backed by an uploaded HTML file... rendered in a sandboxed iframe", created by `/html` "and that agents create through Notion MCP"), Meeting notes (`transcription` renamed `meeting_notes` in API 2026-03-11), Mention, Tab. `unsupported` carries `block_type` such as `"form"` and `"button"`, so those exist in the app without API support. Child-bearing blocks: bulleted/numbered list item, callout, child database/page, column, headings 1 to 4 when toggleable, meeting notes, paragraph, quote, synced block, table, template, to do, toggle. The page warns: "Do not rely on a fixed set of values."

## C. What a plugin system costs

Three isolation models were opened. **Same-privilege in-process** (Obsidian, VS Code's host): the plugin has everything the app has; both vendors say so in writing, and both compensate with scanning, signing, publisher trust and block lists, which catch known-bad code after the fact. **Split sandbox** (Figma): logic runs in a minimal JS environment with no browser APIs and sees only the document model; UI runs in an iframe that sees no document; the two exchange messages; network is allow-listed by manifest. **Isolate plus capability** (Cloudflare, Deno): memory-isolated V8 contexts, no I/O unless an API or `--allow-*` grants it, timers removed to blunt side channels. Even these admit residuals: Deno cannot give modules on one thread different privileges; Cloudflare says there is no fix for Spectre, only mitigation; Figma's domain limit stops at the first-party page.

The minimum a safe system needs, from those pages: a manifest that declares capabilities before install; an execution boundary where the document model is the only thing exposed and "no API means no access"; a message-passing UI surface rather than DOM access; atomic write primitives so plugins cannot half-write a file (Obsidian's `Vault.process` exists because plugins conflicted); marketplace-side scanning, signing and a block list with auto-uninstall; an explicit user gate that defaults to off.

**Recommendation: no in-process plugin system in year one.** For frontmatter specifically, the same-privilege model is incompatible with the projection law: a plugin with file access can rewrite a document around the splice engine, and the review sidecar cannot tell a plugin's bytes from a person's. The only compatible model is the split sandbox, whose "document API" is exactly the splice, search and refusal surface the plan already schedules as the MCP server in MVP 1. Notion (373 connections, no in-app plugins) and Craft (MCP plus an API at 100 requests/min) show a hosted document product extends through an API and integrations gallery instead. Ship the API and MCP first; treat "a plugin system" as the plan already does, under "Later".

## D. What the plan does not mention

Grepped across `docs/mvp0/MVP0-PLAN-v3.md`, `MVP0-PLAN-print.md`, `docs/MVP-PLAN-2026-09-13.md` and `docs/PRODUCT-BRIEF.md`; zero hits unless noted:

- **Table of contents** and **footnotes** (VS Code 881K to 14.5M installs; Typora; Notion block): 0.
- **Emoji** input (VS Code 1.4M; Typora): 0.
- **Math and equations**: one line, "LaTeX snippets" under "Later", against 52M+ and 39M+ Docs installs and Notion's `equation` block.
- **Synced blocks**, **breadcrumb**, **link preview/unfurl** (Notion blocks; Bear rich previews): 0 each. The plan's hover preview covers internal links only.
- **Mail merge and labels** (11M+, 7M+, 6M+ on Docs): 0. **E-signature** (DocHub 57M+): 0; the one "signature" hit is unrelated.
- **OCR search inside images and PDFs** (Bear): 0.
- **Plagiarism and AI detection** (27M+ on Docs): 0. **Accessibility checking** (Grackle 7M+, axe linter): one WCAG line about the app's own contrast, nothing about checking documents.
- **Formatter** (Prettier 71.6M, markdownlint 12.2M): 0 for a formatter; lint appears 8 times.
- **Meeting notes / transcription block** (Notion's newest block): 0.
- **HTML block in a sandboxed iframe**, made for agents via MCP: 0; the plan's `[Z]` policy already bans third-party scripts on published pages, so this is a deliberate gap worth writing down.
- **Per-plan API rate limits** stated as numbers (Notion 180 and 600 rpm; Craft 100 rpm): the plan mentions rate limits twice, only for AI credits.
- **iA Writer's authorship display** ("what you typed and what you pasted", AI in colour): authorship appears 5 times in the plan; the prior memory says it was demoted as "shipped-and-unsold", and iA's page now leads with it against Claude by name.