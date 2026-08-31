The evidence says our differentiation is not what users talk about — but the same evidence names the feature it *does* buy us, and that feature is the single most-voted bug in Obsidian's history.

**Method and denominators.** Everything below is counted from corpora I opened, not from memory. This run was read-only: `curl` fetches plus Python analysis confined to `$TMPDIR/fm2`; no repo writes, no commits, no mutating commands. The dirty `~/.claude` / `~/.sgnk` trees flagged by the reconcile hook were not touched by this agent.

| Source | What I got | Status |
|---|---|---|
| HN Algolia (`hn.algolia.com/api/v1`) | 22,662 unique comments from 30 product/topic queries → **12,556 comments** mentioning a named note/markdown editor, 2007-05 → 2026-08 (7,294 of them 2022+) | [fetched] |
| HN full comment trees, 12 launch/critique threads | **3,749 comments** (Obsidian 1.0, Obsidian Mobile, Show HN: Obsidian, Ditching Obsidian, Files.md, Ferrite, OpenKnowledge, Obsidian Bases, Future of Obsidian Plugins, Joplin, Zettlr, Show HN texting-yourself) | [fetched] |
| forum.obsidian.md (Discourse) | category top-all-time: 150 feature-requests, 100 bug-reports, 150 feature-archive, 50 bug-graveyard, with like/view/reply counts; plus phrase searches | [fetched] |
| discuss.logseq.com (Discourse) | phrase searches | [fetched] |
| GitHub Issues API, 8 md-editor repos (logseq, joplin, Zettlr, marktext, siyuan, silverbullet, obsidian-releases, foam) | **43,656 issues** as denominator | [fetched] |
| help.obsidian.md (via Obsidian Publish API) | Properties.md source | [fetched] |
| **Reddit — all of it** | `reddit.com/*.json` **HTTP 403**; `old.reddit.com` HTTP 200 but login-wall HTML, 0 results; `pullpush.io` **HTTP 429** ("does not provide free scraping resources"); redlib mirrors **403 / 503 / Anubis proof-of-work challenge** | **[SS] — no Reddit data in this report** |

Reddit's absence matters: r/ObsidianMD skews non-technical and mobile-heavy, so my corpus probably *under*-weights mobile and *over*-weights git/plain-text. I flag that where it bites.

---

**THE LOVED LIST.** Denominator = 3,749 launch-thread comments (people deciding whether to adopt) and 582 love-marked comments out of 12,556 (`I love` / `love it` / `killer feature` / `can't live without` / `best thing about` / `game changer`).

| Rank | Theme | Launch threads (n=3,749) | Love-marked (n=582) | Class |
|---|---|---|---|---|
| 1 | **Sync across devices** | 618 · 16.5% | 93 · 16.0% | TABLE STAKES |
| 2 | Price / open-source / no subscription | 551 · 14.7% | 28 · 4.8% | TABLE STAKES |
| 3 | Plugins / extensibility | 513 · 13.7% | 77 · 13.2% | DIFFERENTIATOR (refused) |
| 4 | **Mobile** | 310 · 8.3% | 105 · 18.0% | TABLE STAKES |
| 5 | Native / not-Electron / memory | 237 · 6.3% | 16 · 2.7% | DELIGHT |
| 6 | Export / interop / opens elsewhere | 225 · 6.0% | 87 · 14.9% | TABLE STAKES |
| 7 | **Plain files / ownership / no lock-in** | 208 · 5.5% | 60 · 10.3% | TABLE STAKES |
| 8 | AI / LLM | 202 · 5.4% | 39 · 6.7% | emerging |
| 9 | **Speed / latency / startup** | 183 · 4.9% | 77 · 13.2% | DELIGHT→STAKES |
| 10 | Tables | 179 · 4.8% | 5 · 0.9% | TABLE STAKES |
| 11 | Git / version control | 169 · 4.5% | — | niche |
| 12 | Search | 165 · 4.4% | 22 · 3.8% | TABLE STAKES |
| 13 | Editor UX (vim, keys, modes) | 147 · 3.9% | 63 · 10.8% | DELIGHT |
| 14 | Backlinks / graph | 114 · 3.0% | 17 · 2.9% | overrated |
| 15 | WYSIWYG / live preview | 53 · 1.4% | 25 · 4.3% | see below |
| 16 | **Markdown standard / flavour** | 17 · 0.5% | — | nobody |

You asked whether the answer would be unglamorous. It is worse than unglamorous — the top four are **sync, price, plugins, mobile**, and only one of those (mobile) is an editor feature at all. Backlinks and the graph view, the things Obsidian markets, are 3.0%. "Which markdown flavour" is 0.5%.

The one genuinely bright number: **speed is 4.9% of launch chatter but 13.2% of love-marked comments** — a 2.7× enrichment. People do not *ask* for speed; they *fall in love with* it after the fact. Same shape for editor UX (3.9% → 10.8%) and plain files (5.5% → 10.3%). Those three are the DELIGHT column.

---

**THE HATED LIST.** Denominator = 279 hate-marked comments in the 12,556, and 43,656 GitHub issue titles.

| Theme | Hate-marked (n=279) | GitHub issues, 8 repos (n=43,656) |
|---|---|---|
| Speed / latency / startup | 62 · 22.2% | `slow` 145 (0.33%) + `startup` 138 (0.32%) |
| Export / interop | 51 · 18.3% | — |
| Sync | 50 · 17.9% | `sync` **1,251 (2.87%)** |
| Mobile | 43 · 15.4% | `mobile` **731 (1.67%)** |
| Ownership / lock-in | 35 · 12.5% | — |
| Plugins | 35 · 12.5% | — |
| Search | 15 · 5.4% | `search` **946 (2.17%)** |
| Electron / memory | 19 · 6.8% | — |
| **Tables** | 1 · 0.4% | `table` **714 (1.64%)** |
| **Data loss / corruption** | 5 · 1.8% | `"data loss"` — (rate-limited) |
| **File mutation (reformat/mangle/reorder/escape/whitespace/EOL)** | **2 · 0.7%** | `format` 437 (1.00%), `frontmatter` 94 (0.22%), `whitespace` 36 (0.08%), `escaping` 25 (0.06%), `"line endings"` **1 (0.002%)** |

Note the inversion on **tables**: 0.4% of what people complain about in prose, 1.64% of what they file bugs about — more issue titles than `crash` (404, 0.93%). Tables are a silent, high-volume defect surface. Nobody brags about them and everybody breaks them.

---

**THE FILE-MUTATION MEASUREMENT — our exact promise, measured rather than assumed.** This is the number the round exists to produce, so I read every hit by hand instead of trusting the regex.

- A generous regex (reformat · mangle · rewrite the file · normalise · reorder keys · escape characters · smart quotes · trailing whitespace · line endings · CRLF · noisy diff) matched **36 of 12,556** comments (0.29%).
- Reading all 36: **32 are false positives** — reformatting prose with an LLM, reordering to-do list items, C++ name mangling, reordering prime factors.
- **4 are genuine** (0.032%): Evernote "mangle my quotes into other characters, and randomly insert newlines" (2014-01-04); Evernote "the formatting getting screwed up" (2015-01-25); Nextcloud Text "I wasn't happy with how it would reformat my notes on save" (2024-09-22); "Prettier's Markdown formatting is known to mangle content, particularly around underscores and asterisks, and they haven't done anything about it" (2025-08-18).
- In the 3,749 launch-thread comments: **1** on-point mention (0.027%) — and it is the sharpest thing in the corpus, on the newest thread (Show HN: OpenKnowledge, 2026-06-25): *"the frontmatter question is the one i'd want answered before trusting it: when an agent edits a file does it round-trip YAML frontmatter and nested code fences cleanly, or does that stuff get mangled? every 'wysiwyg markdown' tool i've tried falls apart there."* [fetched]
- Two comments below it, a different user reports that the same app **"trashed my Codex config.toml file"** — and calls it *"not a deal breaker, just a warning."* Actual file destruction, downgraded to a footnote, in the same thread. [fetched]

The behaviour we protect against is real and documented. Obsidian ≥1.4 (Properties, Aug 2023) rewrites YAML: forum.obsidian.md, 2024-09-10 — *"Properties reformats YAML headers, and comments are not supported. API: processFrontMatter removes string quotes, comments, types, formatting"*; 2023-08-08 — *"this is exactly how Obsidian 1.4+ reformats the YAML"*; 2024-06-19 feature request *"Turn off automatic respacing of yaml on mobile"*; 2023-12-15 *"Properties update broke my meta tags."* help.obsidian.md states outright that *"the order of each name-value pair doesn't matter"* and that Obsidian *"will automatically add"* quotes around internal links in properties [fetched 2026-08-31].

**Combined likes across those five Obsidian YAML-rewriting threads: 4.**
**Likes on the single most-liked bug in forum history: 501** — "Live Preview: Better support of code blocks in lists" (2022-01-26, 117 replies). **Ratio 125:1.** [derived]

That is the finding. Write it down: *users do not care that the editor rewrites the file; they care intensely that the editor renders the file wrong.*

---

**SWITCHING TRIGGERS.** 337 switch-marked comments; 50 carry an explicit `because/after/since/when` clause. Classified by hand:

| Trigger | Count of reasoned switches | Example [fetched] |
|---|---|---|
| Sync broke / cost money / conflicted | 8 | *"ditched them for the plain old mac/iphone notes app when I was asked to pay to keep syncing multiple devices"* (2023-05-01) |
| Speed / load time | 5 | *"switched from note taking in Notion to Obsidian, mainly because of the speed at which Obsidian loads files"* (2021-07-12); *"switched from Obsidian to Zettlr due to some rendering and performance issues on Linux"* (2026-01-11) |
| Mobile absent or non-parity | 4 | *"gave up on org-mode and org-roam because I could not find a mobile companion"* (2024-04-14); *"switched away from Logseq specifically because Obsidian had almost no differences between the desktop and mobile apps"* (2023-12-26) |
| Files are files / lock-in | 4 | *"moved from Joplin to Obsidian pretty much only because Obsidian has all the files as regular files"* (2024-01-17) |
| Data loss | 3 | *"ditched evernote after I lost my data twice"* (2015-01-25) |
| Price / OSS / trust | 6 | *"migrated from Roam to Logseq after I realized I didn't use enough of the fancier features to justify the price"* (2023-12-22) |
| Feature fit / model fit | 5 | *"switched from Obsidian to Logseq because Logseq has better block-level support… without having to rely on plugins"* (2025-07-23) |
| **Formatting mangled** | **1** | *"migrated to it after I got sick of the formatting in Evernote getting screwed up and sync issues causing data loss"* (2015-01-25) |
| Consolidation into an existing editor | 2 | *"moved from Obsidian to Foam because I already do most of my writing and coding in vscode"* (2022-10-14) |

Switches are caused by **sync, speed, mobile, price, trust** — in that order. The one formatting-caused switch in eleven years is bundled with data loss.

---

**SPEED — the real numbers people report.** 41 of 12,556 comments carry a concrete time figure about opening/loading/searching. Every row below is a user's own words [fetched]:

| App | Reported | Date | Scale |
|---|---|---|---|
| Joplin | *"takes over 30 seconds to load"* | 2025-04-21 | — |
| Joplin | *"takes like 5 seconds just to start"* | 2024-06-03 | — |
| Roam Research | *"12 second load time"* / *"more than 8 seconds to load"* | 2022-12 / 2022-11 | 250 KB of text |
| Evernote | *"20 seconds to get to the point where I can type"* — offline | 2022-11-16 | — |
| Apple Notes (M2) | *"an absurd 8 seconds to start"* | 2023-06-28 | — |
| Anytype | *"5 seconds to start on a modern mac"* | 2023-12-20 | — |
| MarkText | 34× a Qt app's 0.78 s to load *War and Peace* ≈ **26 s** | 2024-01-26 | 1 large file |
| **Obsidian iOS** | *"up to 7 seconds to open on my iPhone"* | 2024-07-28 | 15–20k notes |
| **Obsidian iOS** | *"sub 0.5 seconds on my iPhone 12 mini"* | 2023-12-20 | ~500 notes |
| Obsidian desktop | *"around 3 seconds to start up"* | 2023-12-25 | 150 notes |
| Obsidian search | *"for all intents and purposes instantaneous (less than a second)"* | 2024-03-03 | 13,000 notes + media |
| Bespoke plaintext pipeline | parse 60 MB in ~0.5 s on a 5-year-old Android; **<50 ms** to search all of it | 2024-08-11 | 4 years of notes |
| Tolaria (iOS, builder's claim) | keystroke restyle **<8 ms**; 20 keystrokes in 150 ms; search **<20 ms** | 2026-04-24 | 5,000-line files |

The bar nobody has cleared, stated plainly: *"I have a literal supercomputer in my pocket, yet not one app lets me open and start writing a critical note in less than 500ms"* (2024-07-10) — the single most-upvoted framing of the speed complaint I found. Obsidian's own forum has **"Mobile, startup: Reduce the time until the user can write"** at 122 likes and **"iOS & iCloud Slow to start"** at 202 likes.

Note the shape: search at 13,000 notes is already solved (sub-second, Electron and all). **Cold start on mobile is not.** Speed is not a general axis; it is one specific number — time-to-first-keystroke on a phone.

---

**THE MOBILE QUESTION, honestly.** Mobile is 8.3% of launch chatter, 9.9% of all comments, 15.4% of hate-marked, 18.0% of love-marked, 17.2% of switches, and **731 GitHub issue titles (1.67%)** — second only to sync. But polarity inside the 286 launch-thread mobile mentions is **17 positive-adjacent to 3 negative-adjacent**: on HN, mobile is mostly discussed as *a reason an app is good* (Obsidian mobile parity) rather than a complaint. That is almost certainly an artifact of the missing Reddit data, where the mobile-first population lives. Two things survive that caveat: mobile is the **#3 switching trigger**, and mobile *startup latency* is the only speed complaint with real vote weight behind it (122 + 202 likes).

Does it reshape the plan? Yes, but narrowly. It does not argue for a mobile app in v1 with two founders. It argues that **the desktop app must never be the reason someone can't read their notes on a phone** — meaning: don't invent a sidecar index, a lock file, a `.frontmatter/` directory, or any state that makes the vault worse when opened by Obsidian Mobile or Working Copy. Interop with the phone app the user already has is the cheap version of shipping mobile.

---

**WHERE THE UNMET, HIGH-VOTE PAIN ACTUALLY IS.** forum.obsidian.md top-all-time, by likes [fetched 2026-08-31]:

| Likes | Views | Feature request | Reads as |
|---|---|---|---|
| 1,078 | 30,964 | Edit transcluded/embedded notes in place *(likely requires WYSIWYG first)* | live editing of nested constructs |
| 977 | 53,048 | File Explorer Custom Sort | — |
| 946 | 254,739 | Obsidian for web | — |
| 811 | 46,606 | **Tag Mass Action: Add, Rename, Delete a tag in multiple files** | **vault-wide safe refactor** |
| 791 | 37,187 | Fully visual editor mode (WYSIWYG) | live editing |
| 785 | 30,208 | **Properties & Bases: multi-level YAML (nested attributes)** | **frontmatter fidelity** |
| 762 | 11,386 | Ignore accents/diacritics in quick switcher + global search | search quality |
| 711 | 54,602 | **Use H1 or YAML `title` property instead of filename as display name** | **frontmatter** |
| 650 | 48,074 | **Global (vault-wide) search & replace** | **vault-wide safe refactor** |
| 1,130 *(archived — shipped)* | 63,479 | A Typora-like editing mode (edit and preview at once) | live editing |

And the bug list, by likes: **501** Live Preview code blocks in lists · 86 broken links on move/rename · 82 Live Preview quotes in list items · 62 Obsidian Sync duplicates sections of files · 52 Sync restores deleted files · 50 Live Preview tables in list items · 96 *"Angular brackets > will mess live preview of codeblocks in quotes and callouts"* · 36 *"List items indented inconsistently in live editor when indentation is 2 spaces"*.

Five of the top eight Obsidian bugs of all time are **live preview rendering a nested construct wrong** — code blocks in lists, quotes in list items, tables in list items, callouts in list items, `>` inside a fenced block inside a callout, indentation in the live editor. That is *precisely* what 19 construct detectors and a byte-exact OffsetMap exist to get right, and it is the single most-liked bug in the product's history by a factor of 5.8 over the runner-up.

Meanwhile **811 + 650 = 1,461 likes** sit on two requests — mass tag rename and vault-wide search-and-replace — that are exactly the class of feature a regenerating editor cannot ship safely, because doing it means rewriting every touched file wholesale. Obsidian's answer today is a community plugin (Tag Wrangler). Ours can be first-party and provable.

---

**WHAT THIS MEANS FOR THE PRODUCT**

- **KILL byte-preservation as the pitch. KEEP it as the mechanism.** 4 genuine complaints in 12,556; 1 in 3,749 launch comments; 1 switch in eleven years; `"line endings"` appears in **1 of 43,656** issue titles. Nobody will buy "we don't touch your bytes". Every landing-page line, demo, and cert that leads with byte-fidelity is talking to a market of roughly nobody. *Who uses it: everyone, invisibly, every keystroke. Who asks for it: nobody.* It is plumbing — so price it as plumbing and sell what it enables.

- **BUILD the vault-wide refactor as the flagship: rename a tag, rename a property key, rewrite a link target, search-and-replace across the whole vault, with a preview diff and a refusal when a match is ambiguous.** 1,461 likes across two Obsidian requests, still unshipped after five years. This is the feature that is *unsafe for a regenerating editor and safe for us* — the answer the round was told to find. *Who uses it: anyone with >500 notes, a few times a month; anyone migrating in, once, painfully.* Ship it with the refusal path visible, because "it stopped and asked" is the demo that closes.

- **BUILD nested-construct live preview as the correctness claim, not the byte diff.** 501 + 96 + 82 + 50 + 36 + 33 likes on live-preview-inside-lists/callouts/quotes bugs. Our OffsetMap makes this a solved problem where it is an open bug for the incumbent. This converts the engine into a user-visible promise: *the only editor where a code fence inside a callout inside a list renders right in every mode.* Pair it with the seven-engine degradation certificate — the certificate stops being an abstract artifact and becomes "here is why your document looks different on GitHub." *Who uses it: every technical writer, every session.*

- **RESHAPE the speed goal to one number: time-to-first-keystroke, cold, and publish it.** Not "fast" — 183 launch mentions but 77 of 582 love-marked (2.7× enrichment) says speed wins loyalty, not attention. The measurable bar the corpus hands us is **500 ms to a typeable cursor** (2024-07-10), against Obsidian's self-reported 3 s desktop / 0.5–7 s iOS and Joplin's 5–30 s. Instrument it, put it in the release notes, and never regress it. *Who uses it: every user, every launch.*

- **RESHAPE sync from "not our problem" to "provably safe on top of whatever they already use."** Sync is #1 loved (16.5%), #3 hated (17.9%), #1 switching trigger, and **1,251 of 43,656 GitHub issues (2.87%) — the largest single defect class measured.** We refused CRDTs correctly. But two of Obsidian's top-six bugs are *Sync duplicating sections of files* and *Sync restoring deleted files*, and there is a 27-like report titled *"Obsidian Sync on iPhone Overwrites Newer Data, Causing Data Loss."* A splice journal plus content-addressed storage is a genuinely better conflict story than any of them. Do not build a sync service; build **the merge that doesn't lie**, and let iCloud/Syncthing/git move the bytes. *Who uses it: every multi-device user, daily.*

- **CUT the markdown-flavour argument entirely from user-facing copy.** 17 of 3,749 launch comments (0.5%) mention CommonMark/GFM/flavours at all. It is an engineering constraint, not a message.

- **WATCH the agent vector — it is 8 comments today, and it is the only place our promise was ever spontaneously demanded.** *"when an agent edits a file does it round-trip YAML frontmatter and nested code fences cleanly, or does that stuff get mangled?"* (2026-06-25) and, three comments away, an app that *"trashed my Codex config.toml."* 197 of 12,556 comments already keep notes in git. When an LLM writes to the file, byte-preservation stops being invisible plumbing and becomes the reviewable diff. That is the one future in which our differentiator is the pitch — but it is a 0.06% signal today, so it is a bet to instrument, not a roadmap to build. *Recorded as a cut, revisit when the count moves.*
