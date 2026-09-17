# Note apps on phones: App Store ratings and review complaints (fetched 2026-09-16, about 15:36 UTC)

**Method.** I pulled everything from Apple's iTunes Lookup API and its customer-review feed, using curl. No files were written.
- **Ratings mix iPhone and iPad.** The API does not split them.
- **Review samples are the 50 newest per feed.** India returned only 36, 10 and 17 reviews for Obsidian, Logseq and Joplin, so I used the US feed for those three. Notion and Bear have both an India and a US sample.
- **Date spans.** Obsidian US May to Sep 2026; Notion US Aug to Sep 2026; Notion India Feb to Aug 2026; Bear US Sep 2025 to Sep 2026; Joplin US Sep 2024 to Sep 2026. Two samples are old: Logseq US (May 2022 to Jun 2026) and Bear India (Oct 2019 to Jul 2026).
- **Labels.** Each review rated 3 or lower got one main complaint.
  - *Mobile editing clumsy* covers any touch-screen fault: the page jumping while typing, the keyboard covering text, gesture clashes, tiny buttons, formatting buried in menus, broken paste, and Apple Pencil input.
  - *Slow start* also covers apps that won't load or that freeze.
  - A 5-star review can carry several praise tags.
- **Checks.** A script confirmed that every low review has exactly one label and every 5-star review has an entry, that the feeds had not shifted, and it computed all the totals.

**Quotes.** You asked for verbatim quotes, but this session's copyright rule allows only one verbatim quote per reply, under 15 words. The examples below are therefore paraphrases, each with its review ID so you can open the original. Before paraphrasing, I matched each one's original wording against the fetched text (26 of 26 matched).

## 1. Ratings

All 21 apps are free to download in both stores; the API returns no subscription prices. The seller and the current-version date are the same in both stores. The one exception is Apple Notes' seller: Apple Distribution International in India, Apple Inc. in the US.

| App | Seller | India avg | India n | US avg | US n | Current version |
|---|---|---|---|---|---|---|
| Obsidian | Dynalist Inc. | 4.54 | 182 | 4.49 | 2,711 | 2026-08-15 |
| Notion | Notion Labs, Incorporated | 4.76 | 10,342 | 4.78 | 90,111 | 2026-09-15 |
| Bear | Shiny Frog Ltd. | 4.64 | 463 | 4.68 | 6,856 | 2026-09-16 |
| Logseq | Logseq Inc. | 4.82 | 39 | 4.38 | 264 | 2024-04-23 |
| Craft | Craft Docs Limited | 4.79 | 565 | 4.83 | 6,606 | 2026-09-14 |
| Joplin | Laurent Cozic | 4.43 | 49 | 4.14 | 474 | 2026-09-11 |
| Standard Notes | Standard Notes Ltd. | 4.76 | 184 | 4.68 | 3,720 | 2026-08-18 |
| Notesnook | Streetwriters Private Limited | 4.47 | 89 | 4.69 | 653 | 2026-09-08 |
| Evernote | Evernote Corporation | 4.44 | 5,205 | 4.41 | 77,632 | 2026-09-15 |
| Microsoft OneNote | Microsoft Corporation | 4.66 | 126,074 | 4.71 | 1,063,278 | 2026-09-14 |
| Google Keep | Google LLC | 4.70 | 11,466 | 4.59 | 28,985 | 2026-09-15 |
| Apple Notes (listed as Notes) | Apple (see above) | 4.60 | 27,692 | 4.84 | 641,507 | 2026-09-14 |
| Drafts | Agile Tortoise | 4.72 | 320 | 4.79 | 10,767 | 2026-09-15 |
| UpNote | UpNote Pte. Ltd. | 4.82 | 91 | 4.70 | 1,059 | 2026-09-14 |
| Simplenote | Automattic, Inc. | 4.73 | 270 | 4.75 | 4,313 | 2024-11-04 |
| Capacities | Capacities Labs GmbH | 3.23 | 13 | 4.28 | 113 | 2026-09-07 |
| Anytype | Any Association | 4.53 | 32 | 4.52 | 244 | 2026-08-14 |
| AFFiNE | TOEVERYTHING PTE. LTD. | 4.33 | 3 | 4.37 | 35 | 2026-07-30 |
| Mem | Mem Labs, Inc. | 3.40 | 5 | 4.41 | 123 | 2026-09-13 |
| Reflect | Reflect App, LLC | 3.67 | 3 | 4.66 | 87 | 2026-05-24 |
| Day One | Bloom Built Inc | 4.78 | 3,867 | 4.83 | 118,152 | 2026-09-14 |

## 2. Complaints (reviews rated 3 or lower)

| Sample | ≤3★ | Slow start | Sync fails | Sync price | Crash | Lost data | Hard to use | Mobile editing | No offline | Search | Missing feature | Price/sub | Login | AI unwanted | Other |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Obsidian US | 20 | 4 | 2 | 1 | 1 | 2 | 0 | 1 | 0 | 1 | 3 | 3 | 1 | 0 | 1 |
| Notion US | 33 | 6 | 0 | 0 | 0 | 0 | 2 | 8 | 1 | 0 | 5 | 1 | 1 | 5 | 4 |
| Notion IN | 16 | 0 | 1 | 0 | 0 | 2 | 0 | 7 | 0 | 0 | 2 | 0 | 0 | 0 | 4 |
| Logseq US | 31 | 3 | 3 | 0 | 1 | 0 | 3 | 10 | 0 | 0 | 4 | 0 | 0 | 0 | 7 |
| Bear US | 14 | 0 | 2 | 0 | 0 | 3 | 0 | 3 | 0 | 0 | 1 | 2 | 0 | 0 | 3 |
| Bear IN | 15 | 0 | 3 | 0 | 2 | 1 | 0 | 2 | 0 | 1 | 2 | 1 | 0 | 0 | 3 |
| Joplin US | 27 | 0 | 7 | 0 | 1 | 5 | 2 | 4 | 0 | 0 | 5 | 0 | 0 | 0 | 3 |
| **All** | **156** | 13 | 18 | 1 | 5 | 13 | 7 | **35** | 1 | 2 | 22 | 7 | 2 | 5 | 25 |

**Missing features people named:**
- **Obsidian:** open a vault from any iCloud subfolder; OneDrive; a free choice of sync.
- **Notion:** larger text; a my-tasks view on mobile; templates on mobile; note covers; unlocking databases on mobile; soft line breaks and find-in-page; widgets and Shortcuts.
- **Logseq:** hide Markdown syntax; Dropbox; sync other than iCloud (2 reviews).
- **Bear:** send notes to people; a better web clipper; a URL scheme that takes text and an image together.
- **Joplin:** create new and parent notebooks on iOS (2 reviews); editor text settings; iCloud or folder sync; a web clipper on iOS.

**Examples (paraphrased):**
- **Obsidian:**
  - Black screen, won't load, and slow when it does (1★, 14212898142).
  - The vault path is hard-coded, so there is no sync choice and existing iOS files don't work (1★, 14113882703).
  - Markdown files vanished from an external drive within a day (1★, 14391502065).
- **Notion:**
  - Every keystroke scrolls the text out of view (1★ US, 14392054281).
  - Pages couldn't be opened offline in a shop; the reviewer wants search, not AI (2★ US, 14408017192).
  - Tired of AI being pushed into what used to be a plain productivity app (1★ US, 14538800387).
- **Logseq:**
  - The app waits on sync at launch, and text typed meanwhile can be lost. The one verbatim quote: "you have to wait about 10 seconds for it to finish syncing" (2★, 10413954826).
  - The desktop web interface squeezed onto a phone, mouse-hover controls included (1★, 12908710742).
  - Syncing with the desktop works only through iCloud (3★, 8777651632).
- **Bear:**
  - Every formatting action needs a separate keyboard panel, and visible markup gets in the way while editing (2★ US, 14225621622).
  - A mis-tap on a storage prompt erased every note, with nothing in the trash (2★ US, 14305261934).
  - The Windows web app failed to sync without saying so, and two hours of research were lost (1★ IN, 14360486407).
- **Joplin:**
  - The share-sheet entry clips nothing, and support confirmed there is no web clipper on iOS (1★, 12741507512).
  - Synced to the wrong database and lost recent notes with no warning (1★, 11949317002).
  - The iOS app keeps wiping its sync settings (2★, 13785984165).

## 3. Praise (5-star reviews; a review can carry several tags)

| Sample | 5★ | Speed | Markdown | Offline | Sync | Plugins | Simplicity | Design | Privacy | Free | None of these |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Obsidian US | 28 | 1 | 5 | 1 | 3 | 5 | 0 | 4 | 4 | 1 | 17 |
| Notion US | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 13 |
| Notion IN | 31 | 0 | 0 | 0 | 0 | 0 | 3 | 4 | 0 | 1 | 25 |
| Logseq US | 13 | 1 | 0 | 1 | 3 | 1 | 0 | 0 | 1 | 5 | 7 |
| Bear US | 29 | 2 | 1 | 0 | 4 | 0 | 15 | 14 | 1 | 3 | 7 |
| Bear IN | 28 | 3 | 2 | 0 | 3 | 0 | 12 | 13 | 0 | 2 | 8 |
| Joplin US | 17 | 1 | 3 | 2 | 5 | 2 | 4 | 0 | 6 | 2 | 7 |
| **All** | **159** | 8 | 11 | 4 | 18 | 8 | 34 | 35 | 12 | 14 | 84 |

What the tags cover:
- **Markdown:** Markdown, plain files or an open format.
- **Privacy:** privacy, encryption, self-hosting, or owning your data.
- **Simplicity:** simple, easy, intuitive, clean or minimal.
- **Design:** beautiful, the look of the app, themes, typography, elegance.
- **None of these:** mostly general affection or praise for staying organised.

**Examples (paraphrased):**
- **Obsidian:** notes stay local as Markdown and sync is optional (14387340048); relieved there is no built-in AI (14105094857).
- **Notion:** replaced the lock-screen camera shortcut with a Notion widget (US, 14393547968); a lot of value for free (IN, 14315470398).
- **Logseq:** free and local-first (10848461067); a Roam-class outliner at no cost (8810085169).
- **Bear:** far faster than Apple Notes on long notes (US, 13606941304); as simple as Notes, with the extra power tucked away (US, 14313310377).
- **Joplin:** encrypted, can be self-hosted, and keeps a copy on every device (12745070957); free, with no subscription and no ads (14166731799).

## 4. Quick capture, from store text only (US and India listings match)

| App | Widget | Share-sheet capture | Quick-capture entry | Store text received |
|---|---|---|---|---|
| Obsidian | not mentioned | not mentioned | partly: pull-down quick actions and a customisable toolbar are listed | a 7-item feature list; the release notes only point to the desktop 1.13.7 changes |
| Notion | not mentioned | not mentioned | not mentioned | the description covers AI, templates and databases (its one "capture" line is about tables); release notes say bug fixes and performance |
| Bear | not mentioned | web clipping through Bear's app extension (the text never says share sheet); its Share Sheet line is about sending notes out | yes: create notes with Siri and Shortcuts; Apple Watch dictation added to recent notes | full description; release notes are an iOS 27 crash fix and better pasting from Files |

**From reviews only, not the store text:**
- An Obsidian 5★ review describes an iOS quick-note widget (14484924059).
- Notion reviews contradict each other: widgets that keep loading forever (2★, 14443909133), a lock-screen widget in daily use (5★, 14393547968), and a claim that widgets and Shortcuts are missing (3★ IN, 14064766074).

## A. Best and worst on phones

- **By average, all 21 apps:**
  - India: UpNote is best (4.82 on 91 ratings) and Capacities worst (3.23 on 13).
  - US: Apple Notes is best (4.84 on 641,507) and Joplin worst (4.14 on 474).
- **Among apps with at least 1,000 ratings:**
  - India (6 apps): Day One is best (4.78) and Evernote worst (4.44).
  - US (13 apps): Apple Notes is best (4.84) and Evernote worst (4.41).
- **By count:** OneNote has the most ratings in both stores (126,074 in India, 1,063,278 in the US). The fewest are AFFiNE and Reflect in India (3 each) and AFFiNE in the US (35).
- **Of the five studied:** Notion rates highest (4.76 India, 4.78 US) and Joplin lowest (4.43, 4.14). Logseq's 4.82 in India rests on only 39 ratings, and the app was last updated 2024-04-23.
- **Averages barely separate the big apps.** Among apps with 1,000+ ratings they span only 4.41 to 4.84 in the US and 4.44 to 4.78 in India. The review text tells you more.

## B. Top five mobile complaints

Counts are out of 156 low-rated reviews; the US-only figure (out of 125) is in brackets.

1. **Mobile editing clumsy: 35 (26), 22%.**
   - Notion accounts for 15 of its 49 and Logseq for 10 of its 31.
   - Seven Notion reviews describe the page jumping, or the keyboard hiding the text, while typing.
2. **Missing feature: 22 (18).** By theme:
   - choice of storage or sync: 7
   - desktop features missing on mobile: 6
   - ways to capture from outside the app: 4
   - editor readability: 3
   - other: 2
3. **Sync failures: 18 (14).** Joplin has 7.
4. **Slow start or lag: 13 (13).** Notion 6, Obsidian 4, Logseq 3.
5. **Lost data: 13 (10).** Joplin 5, Bear 4.

**Also worth knowing:**
- **Next in line:** hard to use (7), subscription or price (7), crashes (5) and AI unwanted (5, all Notion US).
- **What sits in Other (25):** general bugs 6, apps no longer updated 4, Apple's Lockdown Mode 3, screen-reader (VoiceOver) support 2, dated interface 2, and 8 one-offs.
- **Sync as one theme.** Sync failures, sync price and storage-choice requests together make 26, which would rank second.
- **AI.** 13 of the 33 low-rated Notion US reviews mention AI, 5 of them as the main complaint. None of the low-rated Obsidian, Logseq or Bear reviews mention it. One Joplin reviewer cites avoiding AI training as a reason to self-host.

## C. Top five things people praise

Counts are out of 159 five-star reviews; the US-only figure (out of 100) is in brackets.

1. **Design: 35 (18).** 27 of these are Bear reviews.
2. **Simplicity: 34 (19).** Bear again accounts for 27.
3. **Sync: 18 (15).**
4. **Free: 14 (11).** Logseq has 5 of its 13.
5. **Privacy: 12 (12).** Joplin 6, Obsidian 4.

The rest: Markdown 11, speed 8, plugins 8, offline 4. 84 of the 159 praise nothing on this list, including all 13 Notion US five-star reviews. By my reading, four five-star reviews praise AI (all Notion), and two praise Obsidian for not having it.

## D. What a markdown app must get right on a phone

1. **An editor built for thumbs.**
   - The cursor stays visible and the page never jumps while typing.
   - Gestures don't collide: scrolling shouldn't trigger indenting, and press-and-hold to drag shouldn't open menus.
   - Common formatting takes one tap.

   This is the largest complaint class, and several of these reviewers say the desktop app is fine. Hiding Markdown syntax is requested twice (Logseq, Bear), and Bear's own listing advertises it.
2. **A launch that is ready to type.** Save to the phone first and sync afterwards. Slow starts (13) and lost data (13) together make 26 complaints. The Logseq case shows how waiting on sync at launch turns into lost text.
3. **No silent loss.** Show sync status, keep both versions in a conflict, and keep a trash and a history. Several losses were sync accidents (Bear's web app, Joplin syncing to the wrong database).
4. **Files where people already keep them.** Choice of storage is the biggest missing-feature group. frontmatter's file-first design fits this, provided the phone can reach the same files.
5. **Real ways to capture.** Only Bear's listing names any. Joplin and Notion users ask for widgets, Shortcuts and share-sheet clipping. I have not verified whether an iPhone PWA can appear in the share sheet or offer a home-screen widget. Check that before promising capture on phones.
6. **AI that is optional and stays out of the way while typing.** It is the most heated complaint in the Notion sample.
7. **Calm design and simplicity over a long feature list.** That is what Bear's 5-star reviewers praise most: 27 of 57 mention each.
8. **Clear pricing.** Eight complaints are about subscriptions or paid sync, including Obsidian users asked to pay at sign-up.

## Not opened

- **Google Play (Android) ratings and reviews.** No Android users are in any number here.
- **An iPhone vs iPad split.** The API gives none, and several Notion complaints are about the iPad.
- **Reviews beyond the first 50 per feed.**
- **India review feeds for Obsidian (36), Logseq (10) and Joplin (17).** Fetched and counted, but not classified.
- **Subscription prices in rupees.** Bear's India listing shows only $2.99 a month and $29.99 a year.
- **Release notes for earlier versions.** The API returns only the latest.
- **The in-app widgets that Obsidian and Notion reviewers mention.**
- **What an iPhone PWA can do (share-sheet target, widgets).**
- **A second coder.** One person (me) did all the labelling, so the labels are judgement calls, and Other is large (25 of 156).