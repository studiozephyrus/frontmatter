# Obsidian as of 16 September 2026: features, releases, pricing and user demand

Obsidian is proprietary. It is free for any use, and it earns money from Sync ($4 to $10 a month), Publish ($8 to $10 a site) and optional licences. Its forum shows long-standing, unmet demand around editing, file organisation, metadata and a web version.

Every page below was fetched on 2026-09-16 with curl. For three pages (stephango.com, the roadmap and docs.obsidian.md) I used WebFetch, then checked each quote against the raw page with curl. help.obsidian.md now redirects to obsidian.md/help, which is an Obsidian Publish site, so I read its Markdown source directly.

## 1. Core features

`obsidian.md/features` returns 404. The help page on core plugins says: "Core plugins are officially built and supported by the Obsidian team, and are included within the application", and "Some core plugins are disabled by default." It lists **30 core plugins** (counted by script). Each phrase below is taken from that page.

| Core plugin | Phrase | Core plugin | Phrase |
|---|---|---|---|
| Audio recorder | "Record and save audio recordings directly in a note" | Outline | "the table of contents for the active note" |
| Backlinks | "links and unlinked mentions of a note" | Page preview | "by hovering over links" |
| Bases | "edit, sort, and filter files using their properties" | Properties view | "List all the properties in your vault" |
| Bookmarks | "Save links to notes, headings, searches, and more" | Publish | "Host your notes as a website, wiki or documentation" |
| Canvas | "an infinite space to lay out ideas" | Quick switcher | "Search, create and open notes from your keyboard" |
| Command palette | "access commands from your keyboard" | Random note | "Opens a random note in your vault" |
| Daily notes | "notes based on the current date" | Search | "Find files in your vault" |
| File explorer | "Browse files and folders inside your vault" | Slash commands | "using the `/` key" |
| File recovery | "Recover your work from regular snapshots" | Slides | "Create a presentation from your notes" |
| Footnotes view | "a list of footnotes from the current note" | Sync | "Sync your notes across devices" |
| Format converter | "Convert Markdown from other apps to Obsidian format" | Tags view | "List all the tags in your vault" |
| Graph view | "Visualize relationships between notes in your vault" | Templates | "Insert pre-defined content into your notes" |
| Note composer | "Merge two notes or split one into two" | Unique note creator | "a time-coded title" |
| Outgoing links | "all links for the active note" | Web viewer | "Open external links in Obsidian" |
| Word count | "the number of words and characters" | Workspaces | "Save layouts and switch between them" |

**Built into the app, not plugins:**
- **Properties:** "structured data such as text, links, dates, checkboxes, and numbers".
- **Obsidian CLI:** switched on under Settings → General. "Anything you can do in Obsidian you can do from the command line." It "requires the Obsidian app to be running".

**Official pieces outside the core list:**
- **Obsidian Headless:** marked "(open beta)". It is a separate npm client that needs Node.js 22, and it lets you "sync vaults from the command line without the desktop app". One stated use is to "Give agentic tools access to a vault without access to your full computer."
- **Importer and Maps:** maintained by the Obsidian team but installed from the community store. Maps is described as "Add a map view to Obsidian Bases."

**Other details:**
- **Bases:** the help documents Table, List, Cards, Map and Kanban layouts. A base is "saved as a `.base` file or embedded in code blocks".
- **Web viewer:** works "on desktop" only, and "third-party plugins have full access to cookies in Web viewer."

## 2. Releases in the last 12 months

The changelog feed has 90 entries dated 2025-09-19 to 2026-09-15. Two major features predate this window: Bases went public on 2025-08-18 (version 1.9.10) and Web viewer on 2025-01-30 (version 1.8).

| Date | Release | What's new |
|---|---|---|
| 2025-11-11 | 1.10.3, public | Bases "Group by", "table summaries", a "new List view", an "initial Bases API" and a Maps plugin. The mobile app "launches significantly faster". |
| 2026-01-12 | 1.11, public | "Markdown links are now supported in text and list properties". A "Keychain" for plugin secrets. iOS and Android widgets, Siri support. On mobile, "The entire interface has been refreshed". |
| 2026-02-27 | 1.12, public | "introduces the Obsidian CLI". Images resize by dragging. Search inside Bases. An iOS "Share extension". |
| 2026-02-27 | Sync update | "Obsidian Sync now supports headless operation" |
| 2026-07-30 | 1.13, public | "a new searchable Settings panel" and "a full-screen image viewer". Obsidian links (URIs) now show a "confirmation dialog". iOS Share Sheet. Minimum iOS raised to "iOS 15". |
| 2026-08-12 and 08-20 | 1.13.7; 1.13.8 (mobile) | Fixes |
| 2026-09-02 | 1.14.0, early access | "Added color highlights". A Bases "new kanban layout". "Replaced MathJax with Temml". iOS "Native Quick Capture". |

- **Gap:** there are no entries between 2026-03-23 (1.12.7) and 2026-05-28 (1.13.0 early access).
- **Other launches on the roadmap page:** Notion and CSV import (November 2025), "Obsidian Reader" (March 2026), "Community directory" (May 2026) and "Airtable import" (August 2026).
- **Roadmap, Active:** "Kanban view for Bases", "Obsidian for Work", "Open individual Markdown files".
- **Roadmap, Planned:**
  - "Background Sync on mobile"
  - "Bases support for Publish" and "Canvas support for Publish"
  - "Calendar view for Bases"
  - "Multiplayer" ("Share notes and edit them collaboratively.")
  - "PDF annotation" ("Currently waiting for native support in PDF.js.")
  - "Sort search results by relevance"

## 3. Pricing (USD)

| Item | What the page says |
|---|---|
| The app | "Free without limits." "No sign-up required." "No strings attached." |
| Sync Standard (from /sync) | "$4" "Per user, per month, billed annually", or "$5" billed monthly. "1 synced vault", "1 GB total storage", "5 MB maximum file size", "1 month version history". |
| Sync Plus (from /sync) | "$8" billed annually, or "$10" billed monthly. "10 synced vaults", "10 GB total storage", "200 MB maximum file size", "12 month version history", "Upgradable to 100 GB storage". |
| Publish | "$8" "Per site, per month, billed annually", or "$10" billed monthly. "Hosting for your site up to 4GB", "Customizable theme and domain", "Priority email support". |
| Catalyst (supporter licence) | "$25" "One-time payment". The help page names three tiers: Insider $25, Supporter $50, VIP $100. |
| Commercial | "$50" "Per user, per year". The FAQ asks "Do I have to pay for commercial use?" and answers "No." |

- **Inconsistencies on Obsidian's own pages:**
  - `/pricing` shows Sync only at $4 or $5 and never names the two tiers.
  - The homepage promises "one year of version history for every note", but the Standard plan keeps only 1 month.
- **Sync limits:** both plans allow "Unlimited" devices. A vault can be shared "with up to 20 people", and "All collaborators must have an active Sync subscription". I found no price for Plus storage above 10 GB.
- **Publish limits:**
  - For custom domains, "CloudFlare is the only officially supported provider", and "We don't yet have a way to provision an SSL certificate on your behalf."
  - File uploads are capped "up to 50mb".
- **Other terms:**
  - A commercial licence "does not provide any functional benefits within the app".
  - Students, faculty and non-profit employees get "a 40% discount on Obsidian Sync and Publish".
  - "full refunds within 7 days" apply to Sync and Publish only.

## 4. How secure Sync is

- **Two encryption modes:**
  - "End-to-end encryption (default) offers the strongest security but requires you to safely store your encryption password."
  - The alternative, "Standard encryption", "uses an encryption key managed by Obsidian".
- **Algorithms:** "Key derivation function: scrypt with salt" and "Encryption algorithm: AES-256 using Galois/Counter Mode (GCM)".
- **Local files:** "Obsidian doesn't encrypt your local vault."
- **Servers:** "Obsidian Sync servers are hosted by DigitalOcean" in Singapore; Frankfurt, Germany; San Francisco, USA; and Sydney, Australia. "Automatic" picks one by IP address.
- **Limits Obsidian itself states:**
  - "We encrypt file hashes deterministically".
  - "Some metadata is not end-to-end encrypted: which device uploaded or deleted a file, when it was uploaded, and the mapping between encrypted file paths and encrypted content."
- **Conflicting edits:**
  - "Markdown files: Obsidian Sync merges the changes using Google's diff-match-patch algorithm."
  - Other files, including canvases, follow "last modified wins".
  - The default merge "may sometimes create duplicate text or formatting problems".
- **Security audits** (all listed on the /security page):
  - Cure53, December 2023: the desktop and mobile apps.
  - Cure53, October 2024: the Sync API, server and cryptography.
  - Cure53, December 2024: the apps, with "particular attention to hardening the Web viewer plugin".
  - Trail of Bits, December 2025: Sync, where "All findings were addressed via remediations and disclosures validated by the auditors."
- **Privacy:** "our apps do not collect telemetry data, and we never sell user data."

## 5. Platforms

- **Mobile:** iOS from the App Store; Android from Google Play or as an APK. The Android help says it "supports Android versions 5.1 and above."
- **Desktop:** Windows "Universal" and Mac "Universal" installers.
- **Linux:** AppImage, Snap, Deb, "AppImage (AArch64, ARM64)", and Flatpak, marked "Community maintained".
- **Browser extension:** Web Clipper is available for Chrome, Safari, Firefox, Edge, Brave, Arc, Orion and Vivaldi.
- **Current version:** the download page shows "Last updated" 2026-08-12 and links to version 1.13.7/1.13.8.
- **Sync page claim:** "Mac, Windows, Linux, iOS, Android, and even headless on a server."
- **No web version:** the download page lists no browser version of the app.

## 6. Obsidian's stated principles

- **The /about "Manifesto"** has five headings: Yours, Durable, Private, Malleable, Independent. Key lines:
  - "we use simple, open file formats that prevent lock-in"
  - "your data is stored on your device, inaccessible to us"
  - "tools should adapt to your way of thinking, not the other way around"
  - "we are 100% supported by our users, not investors."
- **The team:** "We're a small team". The page lists eight people, with Steph Ango as "CEO".
- **Steph Ango's essay "File over app"** (stephango.com, July 1, 2023):
  - "File over app is a philosophy: if you want to create digital artifacts that last, they must be files you can control, in formats that are easy to retrieve and read."
  - "Apps are ephemeral, but your files have a chance to last."
  - On Obsidian itself: "it's a delusion to think it will last forever."
- **The help site:** you can "switch to another app easily if you ever need to."

## 7. Licence and openness

**Obsidian is not open source.**
- The /license page (updated February 20, 2025) says "Obsidian is free for all purposes, including personal, commercial, and non-profit use." It also says "We own and reserve rights to our content, including text, images, and code in the app".
- The /terms page says "Any Software is licensed and not sold." Users may not "create derivative works based on or otherwise modify the Services or Software", or "reverse engineer or decompile … or otherwise attempt to discover the source code".
- I searched all 176 Markdown help pages and none calls the app open source. Six side projects are MIT-licensed: JSON Canvas, Knap, Importer, Maps, Web Clipper and Defuddle.

**The plugin API is public.**
- The homepage mentions "our open API".
- The `obsidian` npm package (type definitions, v1.13.2) is MIT-licensed.
- docs.obsidian.md opens with: "Welcome to the official Obsidian Developer Documentation, where you can learn how to build plugins and themes for Obsidian."

**Plugin and theme counts.** `obsidian.md/plugins` redirects to community.obsidian.md, which says "Browse 7,694 plugins and 758 themes built by the community." Obsidian's registry files on GitHub hold 7,693 and 759 entries.

**Plugin safety.**
- "By default, Obsidian runs in Restricted Mode to prevent third-party code execution."
- "Due to technical limitations, Obsidian cannot reliably restrict plugins to specific permissions or access levels."
- Every plugin version is scanned automatically, and "Manual reviews continue for popular, featured, and flagged plugins."

## 8. What forum users ask for, counted

**The two categories:**
- "Feature requests" (category id 8) has 6,051 topics and is described as "Suggest features to be added to core Obsidian. Likes (Hearts) = Votes."
- "Feature archive" (id 11) is described as "Implemented features."

**How I ranked:**
- I sorted with `latest.json?order=likes` and confirmed the order is strictly descending across two pages.
- I did not use the `top.json?period=all` list you suggested, because it is not in like order: its first entry has 712 likes.

**What the numbers mean.** I checked both fields on two threads by adding up the likes on each post:
- **Likes** is the total hearts on every post in the thread.
- **OP** is the hearts on the opening post only.

**Status.** All 30 threads below are still in Feature requests, meaning none has been moved to the implemented archive, and all are open and unarchived. 28 of them carry "valuable", a tag only staff can apply and that has no public description; the "Other tags" column shows the rest. The Roadmap column is my own matching of titles against the roadmap page; a blank cell means the request is not on it.

| # | Request (forum title, verbatim) | Likes | OP | Posts | Opened | Other tags | Roadmap |
|---|---|---|---|---|---|---|---|
| 1 | Edit transcluded (embedded) notes (blocks) in place (likely requires WYSWYG first) | 1,078 | 279 | 207 | 2021-03-26 | | |
| 2 | File Explorer Custom Sort | 979 | 250 | 298 | 2020-06-11 | | |
| 3 | Obsidian for web | 949 | 273 | 247 | 2020-06-17 | sync, publish, commercial | |
| 4 | Click links/files to open in new tab by default | 907 | 289 | 277 | 2020-10-21 | | |
| 5 | Add support for link types, link info, link metadata | 822 | 183 | 213 | 2020-07-03 | graph-view | |
| 6 | Tag Mass Action: Add, Rename, and Delete a tag in multiple files (Tag Wrangler) | 811 | 290 | 190 | 2020-05-27 | tags | |
| 7 | Fully visual editor mode (WYSIWYG / WYSWYG) | 792 | 81 | 189 | 2022-08-07 | | |
| 8 | Properties & Bases: Support multi-level YAML (Mapping of Mappings, nested attributes, nested properties) | 790 | 293 | 182 | 2023-07-27 | bases, properties | |
| 9 | Ignore accents/diacritics in link suggestion, quick switcher, find in file and global search | 773 | 158 | 153 | 2020-06-11 | search, i18n | |
| 10 | Use H1 or YAML property "title" instead of or in addition to filename as display name | 712 | 386 | 149 | 2020-05-28 | | |
| 11 | IDE style navigation (tab reuse on link opening, tab management, switch to already open note) | 671 | 239 | 162 | 2022-10-31 | | |
| 12 | Properties: let the user customize the way Dates/Times are displayed (independently from OS) | 657 | 197 | 153 | 2023-07-31 | ui-ux, properties, yaml | |
| 13 | Global (Mass / Vault-wise) search & replace | 650 | 267 | 140 | 2020-08-15 | | |
| 14 | A proposal for rendering block embeds inline | 554 | 210 | 107 | 2021-11-14 | | |
| 15 | Reminders/Notifications in Obsidian | 554 | 86 | 117 | 2020-11-20 | | |
| 16 | Have Obsidian be the handler of .md files / Add ability to use Obsidian as a markdown editor on files outside vault (file association) | 550 | 114 | 168 | 2020-05-23 | | Active |
| 17 | Global Settings / Same settings, themes, and plugins across multiple vaults | 520 | 148 | 161 | 2022-08-13 | | |
| 18 | Allow [[links]] to folders | 513 | 203 | 115 | 2020-05-31 | | |
| 19 | Canvas — Drawing and Pencil or Pen support | 509 | 186 | 108 | 2022-12-21 | canvas | |
| 20 | Highlighting / annotation of PDFs as a core feature of Obsidian (annotate) | 498 | 113 | 107 | 2022-01-21 | pdf-viewer | Planned |
| 21 | Canvas: Links in Cards and Outgoing Arrows in Graph View | 469 | 164 | 108 | 2022-12-14 | canvas | |
| 22 | Disable auto-save or change frequency | 459 | 69 | 134 | 2021-03-08 | none at all | |
| 23 | Drawing/Sketching support for users who use styluses / tablets / pen / pencil | 434 | 162 | 107 | 2020-07-11 | | |
| 24 | Properties Wrangler: Add a way to "Insert", "Rename" and "Remove" properties and values in all files | 431 | 210 | 68 | 2023-07-26 | ui-ux, properties | |
| 25 | View Structure of Nested Tags on Graph | 396 | 92 | 91 | 2021-01-13 | ui-ux, graph-view (no "valuable") | |
| 26 | Make Obsidian Sync work in background (on Mobile) | 363 | 108 | 125 | 2021-10-20 | mobile, sync | Planned |
| 27 | Default template for new note (cltr-n, click to non-existing note) | 362 | 202 | 90 | 2020-12-22 | | |
| 28 | Add support for Definition Lists | 357 | 147 | 90 | 2020-05-22 | | |
| 29 | Password protect / lock folder / Encryption at rest | 352 | 83 | 121 | 2020-06-13 | | |
| 30 | Automatic/inline update of links to headings and blocks when they are modified (rename header with no extra dialog window) | 351 | 136 | 80 | 2021-10-09 | ui-ux | |

- **Age and activity:** 15 of the 30 were opened in 2020. 29 had a reply in 2026, the latest on 2026-09-16.
- **Partial overlap with #24:** version 1.10.3 added "The Global Properties view can now delete a property across all your notes", but #24 also asks for insert and rename.
- **Ranking by opening-post hearts** swaps six threads:
  - Dropping out: #7, #15, #22, #25, #26 and #29.
  - Coming in:
    - "Support checkboxes in tables" (178)
    - "Bases: New With Template (for 'New' Button)" (144, opened 2025-07-05)
    - "Obsidian Run in Portable Mode?" (127)
    - "Canvas: Process / Support tags in cards" (115)
    - "Manage Obsidian Trash from within the app" (114)
    - "Save Node Positions in Graph View" (110)
  - On this measure #10 ranks first, with 386.

## What Obsidian users love, and what they still ask for

1. The plugin ecosystem is large: 7,694 plugins and 758 themes.
2. The most-liked requests already delivered are about editing: "A Typora-like editing mode" (1,130 likes), "Block reference" (845) and pop-out windows (706).
3. Releases are frequent: 90 changelog entries in 12 months, and Bases gained groups, summaries, list and map views, an API, search, and kanban (early access).
4. The plain-files promise appears in the manifesto, in the help, and in the CEO's "File over app" essay.
5. Sync is end-to-end encrypted by default (AES-256-GCM), has passed four audits, and starts at $4 a month for 1 GB.
6. The most-liked open request is editing embedded notes in place (1,078). A fully visual editor (792) is also still open.
7. Users want help organising files: custom sort (979), mass tag changes (811), global search and replace (650), mass property changes (431).
8. Users want richer metadata: typed links (822), nested YAML in properties (790), a title taken from the H1 or a property (712), and control over date display (657).
9. Users want reach beyond the desktop vault: a web version (949, not on the roadmap), opening single .md files (550, Active), and background Sync on mobile (363, Planned).
10. Users want better tabs: open links in a new tab by default (907), and IDE-style tab reuse (671).
11. Users want pen input: drawing in Canvas (509), PDF annotation (498, Planned), and sketching (434).
12. Users want more control: reminders (554), switching off auto-save (459), and locked or encrypted folders (352). Obsidian's own help also admits it "cannot reliably restrict plugins".

## Pages not opened or not verified

- `obsidian.md/features`: returned 404.
- The community.obsidian.md `/plugins` and `/themes` pages only render in a browser, so the plugin and theme counts came from the directory's home page.
- The Cure53 and Trail of Bits audit PDFs, and the blog post on verifying Sync's encryption: linked from /security, but not opened.
- The /privacy, /enterprise, /mobile, /canvas and /cli pages: not opened.
- The changelog entries for 1.9.14, 1.10.6, 1.11.5, 1.11.7, 1.12.7, 1.13.6 and 1.13.7: I read only their titles and dates.
- The price of Plus storage between 10 and 100 GB, and minimum desktop OS versions: not stated on any page I opened.
- Forum threads: I read list data only, plus two threads (101040 and 20647) opened to check the like counts.