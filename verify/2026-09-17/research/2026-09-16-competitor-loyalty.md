Pulled 2026-09-16, 15:35 to 16:40 UTC. Everything below came from a page or API response opened in this session; forum numbers are Discourse `vote_count` where the vote plugin exists, otherwise likes on the first post (`op_like_count`); GitHub numbers are total reactions on open issues sorted by reactions. Quoted strings are short headline or price labels copied from the page named; longer passages are paraphrased.

## Table A: leads with / sync / mobile / source

| Product | (a) What its own site leads with (verbatim) | (b) Sync, E2EE, price | (c) Mobile | (d) Open source, stars |
|---|---|---|---|---|
| **Logseq** (logseq.com) | "Connect your notes, increase understanding."; then the feature grid, in order: "Open source", "Privacy first", "Mobile apps" (also "Markdown files") | Logseq Sync, still invite-only beta. The 2026-04-24 split post (logseq.io/p/e3YDyX5AYr) says data is encrypted locally with your password and is "end-to-end encrypted (E2EE)"; TestFlight and Sync invites went to Open Collective sponsors at "$15/mo". Open Collective tiers: Backers $5/month ("exclusive access to Logseq DB Sync soon"), Sponsors $15/month. Self-hosted sync is listed as shipped. **The product split on 2026-04-24: markdown files moved to "Logseq OG" (maintenance only, security and Electron updates), and logseq/logseq is now the database version.** | iOS and Android (site); DB-version iOS via TestFlight invites | AGPL-3.0. logseq/logseq **44,935**; logseq/og **291**; logseq/db-test 28 |
| **Joplin** (joplinapp.org) | "Free your notes"; sections "Multimedia notes", "Work together", "Save web pages as notes", "100% your data" | Free sync via Dropbox, OneDrive and others. Site: "Uses End-To-End Encryption (E2EE)". Joplin Cloud (joplinapp.org/plans): Basic **2.99€/month** or 2.40€/month yearly (28.69€/year), 2 GB; Pro **5.99€/month** (4.79 yearly, 57.48€/year), 30 GB; Pro 100 GB 9.99€/month; Teams 7.99€/month. Basic includes web app and "Joplin Cloud AI (beta)" but not notebook sharing. Cloud is hosted in France | Android, iOS, plus Windows/macOS/Linux and a terminal app | AGPL-3.0-or-later by default, per-directory exceptions (packages/server). **56,392** |
| **Anytype** (anytype.io) | "A safe haven for digital collaboration"; three pillars "Private & Secure", "Offline & Online", "Work & Play" | P2P local-network sync, plus backup nodes. Docs (doc.anytype.io, Privacy & Encryption): objects encrypted at rest, keys generated on device and never sent to Anytype; FAQ calls it zero-knowledge and E2E. Pricing: Free **100 MB** remote storage; Plus **$4 per month** (1 GB); Pro **$8** (10 GB); Ultra **$16** (100 GB); "Yearly -20%"; self-hosting needs no membership | iOS and Android (native) | "Any Source Available License 1.0" (non-commercial, or commercial in Allowed Networks), so source-available, not OSI open source. anytype-ts **8,824**; anytype-heart 416 |
| **AFFiNE** (affine.pro) | "Write, Draw, Plan, All at Once. With AI."; three blocks "Write your way to better productivity", "Draw and visualise with ease and creativity", "Plan, track, and collaborate efficiently" | Cloud sync. Free tier "Local FOSS + Cloud Basic": **10 GB cloud storage**, 3 members, 7-day version history, 3 devices. Pro **$6.75 per month** (page toggle set to "Billed Annually"), 100 GB. Team **$10 per seat/month**. Believer **$499.99** one-off, 1 TB. **No E2EE claim on the home, pricing or FAQ pages I opened**; "Encryption for local storage" is the #2 open issue by reactions | iOS, Android, desktop, browser, Docker | MIT for editor and most code; `packages/backend` under the AFFiNE Enterprise Edition licence (review only without a commercial agreement). **72,673** |
| **SiYuan** (b3log.org/siyuan) | "From thought to insight, with agents"; badge line "WYSIWYG Block Ref E2EE Sync Privacy-first"; then "Block editing" | Homepage: "End-to-end encrypted data sync". Pricing page: PRO features one-off **$64 Lifetime** (struck-through $96), third-party S3 and WebDAV sync, storage not included; official cloud card, labelled Subscription, **$148 Lifetime** (struck-through $296) with **8 GB** official storage; FAQ refers to an annual subscription, so the card labels are inconsistent. Docker self-host available | Android, iPhone/iPad (App Store plus TestFlight), HarmonyOS NEXT | AGPL-3.0. **46,394**. Note: documents are stored as `.sy` JSON, not markdown files (its own download-page FAQ) |
| **Notesnook** (notesnook.com) | "Open source · End-to-end encrypted"; "Notes only you can read."; "Write freely" strapline; sync section "Start it on your laptop, finish it on your phone" | Sync is free and unlimited on every device; paid plans buy attachment storage. Pricing meta: "Paid plans from US$1.67/month add attachment storage." Page localised to INR here: Free 50 MB/month; Essential ₹225.29/month or ₹188.59/month billed annually (₹2,263.02); Pro ₹791.32/month, 50% off yearly at ₹330.09/month; 5-year Pro ₹33,961.06. Claims 300,000+ users | Windows, macOS, Linux, Android, iOS, web | GPL-3.0. **14,598** (site says 14.3K); sync server repo 904 | 
| **Bear** (bear.app) | "Markdown notes you'll love"; sections "Seamless Markdown", "Organize easily", "Universal beauty", "Private security" | iCloud sync, marked PRO. **$2.99/month** or **$29.99/year** after a 7-day trial. Site: "Apple's Advanced Data Protection supported", and notes are between you and iCloud. Its #1 forum request is still full E2EE | Mac, iPhone, iPad. Forum has a "Bear Web" category (226 topics) saying Bear now runs in the browser, testing caveat; web.bear.app returns 200 | Closed. No source link on bear.app; developer account `shinyfrog` has 21 public repos, none the app |
| **Notion** (notion.com) | "Where teams and agents Think together."; "AI where your team works."; "Bring everything into one system of record."; "Keep work moving 24/7 with agents." | Cloud-native, no E2EE claim: security pages state AES-256 at rest and TLS 1.2+ in transit. Free $0; Plus **$10 per member / month**. Offline (help guide): all users can download individual pages on desktop or mobile; Business and Enterprise auto-download recent and favourited pages; databases download the first 50 rows | Desktop, web, mobile | Not open source (not separately verified) |
| **Apple Notes** | not in scope | not in scope | iOS/iPadOS/macOS | Closed |
| **Google Keep** | not in scope | not in scope | Android/iOS/web | Closed |
| **Tolaria** (tolaria.md) | "A second brain for the AI era. Free forever."; "Just files on your disk"; "Writes like Notion, saves as Markdown"; "Fully integrated Git client" | No sync service. Git is the sync story, committed and pushed from inside the app. Free, no account | **None shipped**: README says desktop macOS, Windows, Linux; open issues reference an in-development `apps/mobile` | AGPL-3.0-or-later. **19,797** (the site badge still says 9,946) |

**Markdown in the two default apps.** Apple: support.apple.com/en-us/102223 says that in macOS Tahoe 26, iOS 26, iPadOS 26 and later, Notes converts Markdown syntax to rich text. The Mac guide has File > Import Markdown, Export as > Markdown and Edit > Copy as Markdown; the iPhone guide has "Export a note as a Markdown file" in the iOS 26 and iOS 27 versions of the page and **not** in the iOS 18 version. Google Keep: the "Create or edit a note" help page (Android and Computer) has **zero** occurrences of "markdown"; formatting is a Format button with bold, italic, underline and headings.

## Table B: most-voted open requests, counted

| Product | Tracker | Top items (count) |
|---|---|---|
| Logseq | discuss.logseq.com votes (GitHub redirects feature requests here) | epub support **285**; customisable TODO keywords **263**; longform writing **248**; Vim mode **221**; PDF annotation on mobile **200**; plugins on iOS/Android **147**; sync on iOS with OneDrive/Dropbox/Google Drive/iCloud **130** |
| Logseq | github logseq/logseq reactions | XDG config dirs **79**; alias duplication **60**; edit clocked time **41**; Android cannot pick a Nextcloud folder **36**; i18n weekdays **29** |
| Joplin | github reactions | F-Droid **176**; hierarchical tags **168**; flatpak **116**; multiple instances **99**; copy-code button **61**; local encryption **23**; mutual TLS **22** |
| Joplin | forum likes on first post | drawing with a pen **42**; inline PDF **34**; note-link syntax **31**; tabs **26**; WYSIWYG **22**; kanban **20**; trash **19**; sharing notebooks **18** |
| Anytype | community.anytype.io votes, implemented excluded | apply template to existing object **561**; formulas **535**; calendar/timeline view **431**; bi-directional links and rollups **382**; whiteboard **366**; synced blocks **301**; handwritten notes **263**; web client **164**; plugins **156** |
| AFFiNE | github reactions | Notion-style columns **54**; encryption for local storage **25**; RTL **21**; math and mermaid **20**; drawio embeds **19**; public doc share with edit rights **15** |
| SiYuan | github reactions (only **13** open issues in total) | card whiteboard **197**; database calendar view **24**; global attributes **15**; support Anthropic API **6**; database list view **4** |
| Notesnook | github reactions | mermaid **24**; Excalidraw **22**; collaborative notes **21**; notebook sharing **14**; side-by-side notes **12**; slash commands **10** |
| Bear | community.bear.app likes on first post (no vote plugin) | end-to-end encryption **36**; note revision history **28**; per-tag sorting **25**; LaTeX **23**; more tag icons **17**; note versioning **13** |
| Tolaria | github reactions | too thin to rank: 22 open issues, top is macOS spellcheck at **2** |
| Notion / Apple / Google | no public vote tracker opened | n/a |

## A. End-to-end encrypted sync, and the price

Five claim it. **Notesnook**: free, unlimited notes on unlimited devices, paid plans only add attachment storage, "from US$1.67/month". **Joplin**: E2EE on any backend, free with your own Dropbox/OneDrive, or Joplin Cloud at 2.99€/month. **Anytype**: free tier with 100 MB remote storage, then $4/$8/$16 per month. **SiYuan**: "End-to-end encrypted data sync", $148 for the 8 GB official cloud card or $64 one-off for the third-party S3/WebDAV route. **Logseq**: E2EE described in the April 2026 split post, but still invite-gated to $15/month Open Collective sponsors, with $5/month backers promised access. **Bear** is the edge case: iCloud only, $2.99/month, "Apple's Advanced Data Protection supported", and its single most-liked request is still real E2EE. **AFFiNE** and **Notion** make no E2EE claim on any page I opened.

## B. Open source and stars

AFFiNE 72,673 (MIT editor, source-available backend); Joplin 56,392 (AGPL); SiYuan 46,394 (AGPL); Logseq 44,935 plus OG 291 (AGPL); Khoj 37,364 (AGPL); Tolaria 19,797 (AGPL); Notesnook 14,598 (GPL-3.0) plus sync server 904; Anytype 8,824 (source-available, not OSI); Reor 8,556 (AGPL, **archived**, last push 2025-05-13); Smart Connections 5,456 (bespoke non-compete licence). Closed: Bear, Notion, Apple Notes, Google Keep.

## C. What recurs across the trackers (of 7 products with a usable tracker)

| Request | Products in top 15 | Where |
|---|---|---|
| Whiteboard, canvas, drawing, handwriting | **6** | SiYuan (#1), Joplin forum (#1), Anytype, Notesnook, AFFiNE, Bear |
| Mobile-specific fixes or parity | **6** | Logseq, Joplin, Anytype, AFFiNE, SiYuan, Bear |
| Diagrams and maths (mermaid, LaTeX) | **4** | Notesnook (#1), AFFiNE, Logseq, Bear |
| Linux/Android packaging (F-Droid, flatpak, Flathub, XDG, Accrescent) | **4** | Joplin, AFFiNE, Logseq, Notesnook |
| Databases, views, formulas | **3** | Anytype, AFFiNE, SiYuan |
| Encryption | **3** | Bear (#1), AFFiNE (#2), Joplin |
| Collaboration or sharing | **3** | Notesnook, Joplin, AFFiNE |
| Plugin/extension API | **3** | Logseq, Anytype, Notesnook |
| Tabs, windows, split view | **3** | Joplin, Notesnook, SiYuan |
| RTL and i18n | **3** | Joplin, AFFiNE, Logseq |
| PDF and ebook annotation | **2** | Logseq, Joplin |
| Version history | **1** | Bear (two separate entries) |
| Web version | **1** | Anytype |
| **AI** | **1** | SiYuan ("Support Anthropic API", 6 reactions) |
| Tables as such | **0** | none |

Two caveats. Vote-sorted lists favour old threads: **79 of the 133 items across these nine lists were opened before 2024**, and some are already shipped (Logseq's search and mermaid threads are tagged done). And SiYuan's tracker has only 13 open issues in total, so its rows below rank 3 have 6 reactions or fewer.

## D. New open-source markdown apps gaining stars fastest (created after 2024-01-01)

Stars are cumulative since creation; the rate is stars divided by days to 2026-09-16, not a windowed gain.

- **refactoringhq/tolaria** 19,797, created 2026-02-14, pushed 2026-09-12, AGPL, 214 days, **92.5/day**.
- **codexu/note-gen** 12,811, created 2024-08-06, pushed 2026-09-14, GPL-3.0, 16.6/day.
- **Achilng/floral-notepaper** 5,209, created 2026-04-26, 36.4/day (markdown sticky notes).
- **inkeep/open-knowledge** 4,230, created 2026-06-03, 40.3/day, "AI-native markdown IDE and LLM wiki".
- **gamosoft/NoteDiscovery** 2,804, created 2025-11-05; **ZenNotes/zennotes** 2,456, created 2026-04-11, 15.5/day; **erictli/scratch** 1,576, created 2026-01-31, no licence detected; **team-reflect/reflect-open** 1,475, created 2026-06-09, MIT; **bholmesdev/hubble.md** 1,470; **tianma-if/edgeever** 1,424, 17.4/day; **zhitongblog/solomd** 1,061.
- Adjacent and larger, but not standalone note apps: **lfnovo/open-notebook** 38,989 (2024-10-21) and **AgriciDaniel/claude-obsidian** 14,997 (2026-04-07, 92.6/day), an Obsidian plus Claude Code kit. The pattern in both searches is agent-memory-in-markdown, not new editors.
- Of the four named AI-native apps: Khoj is alive (37,364, pushed 2026-08-02), Smart Connections alive (5,456, pushed 2026-09-15, non-compete licence), **Reor is archived**, Tolaria is the breakout.

## Not opened

Logseq's own sync pricing page (logseq.com/pricing redirects to the home page; the only prices found were Open Collective tiers and the blog post). AFFiNE's monthly, non-annual Pro price. Whether SiYuan's $148 card is annual or perpetual. Notesnook's USD plan table (page geolocated to INR; only the meta description carried a dollar figure). Apple Notes and Google Keep sync, pricing and loyalty. Notion's licence page. Bear's iOS/macOS release notes for any E2EE change after the 2024 staff replies. Star history windows for question D. One side note worth flagging: tolaria.md/download/ auto-starts a download when opened; the network log recorded only the HTML request and no installer landed in ~/Downloads, and I clicked nothing.