## Switching signals: Hacker News + Reddit (collected 2026-09-16)

**Method and limits.** HN via the Algolia API (`tags=story`, `hitsPerPage=1000`, re-sorted by points locally). Phrase-quoted queries return 0 hits, so all queries are unquoted word-matches over title + URL + body, which pulls in off-topic stories ("Notion" fuzzy-matches "national"). Reddit's own JSON is blocked; RSS and a third-party archive answered. **Every count below is a hand tally of comments/posts I actually opened and read — a lower bound, not a corpus-wide count.**

### 1. Hacker News — top 5 by points per query

Item URL = `https://news.ycombinator.com/item?id=<id>`. Format: title — points/comments — date — id.

| Query (hits) | Top 5 by points |
|---|---|
| switched from Obsidian (9) | Show HN: Edna, notes for developers 331/91 2024-07-01 `40846242` · Launch HN: Screenpipe 88/67 2026-07-23 `49024620` · Ask HN: text-editing shortcuts 14/10 2022-02-23 `30445418` · Gemini Document Processor 11/2 2025-04-26 `43803143` · "switched over from Mem to Obsidian" 3/1 2023-04-07 `35488339` |
| leaving Obsidian (7) | NotesOllama 156/31 2024-02-21 `39456113` · Pizza Bot 53/33 2026-09-15 `49713894` · Screen.garden (sync/web for Obsidian) 6/2 2025-04-02 `43560344` · Reyn 6/0 2026-06-17 `48577880` · Notion Calendar in Superhuman 3/0 2026-08-20 `49378903` |
| Obsidian alternative (37) | **Files.md 730/356 2026-05-18 `48179677`** · Defuddle 418/68 2025-05-22 `44067409` · **OpenKnowledge 381/173 2026-06-25 `48675435`** · Eidos 276/90 2024-06-21 `40746773` · OpenWork 231/60 2026-01-14 `46612494` |
| switched from Notion (45) | all five are body-text noise: Remora 304/196 `26412624` · Modernbanc 123/113 `43414405` · Routine 90/92 `26565629` · BT 3G 42/59 `37656002` · "I am concerned about the future" 35/82 `44127032` |
| leaving Notion (163) | all five are noise ("nation"/"national"): NSA talent 824/514 `16057449` · Redfin/NAR 448/366 `37746717` · Egypt email 238/56 `2170560` · Military suicide 237/83 `8715077` · Dex 189/141 `20699923` |
| Notion alternative (168) | **Docs (OSS) 1952/454 2025-03-16 `43378239`** · Focalboard 694/175 `26499062` · **Docmost 551/217 `40832146`** · **Anytype 414/273 `36799548`** · OpenKnowledge 381/173 `48675435` |
| Logseq (116) | Logseq privacy-first 276/118 2022-10-15 `33218561` · Logseq 209/40 2020-11-14 `25090176` · **After Obsidian and Logseq, Dendron 129/159 `32248543`** · **Logseq 2.0 DB beta 101/85 2026-07-13 `48896229`** · Decentralized social w/ Logseq 101/53 `31721927` |
| local-first notes (138) | Athens 340/152 `26316793` · Rowboat 219/99 `48819808` · Rowboat 205/56 `46962641` · Notes on local-first dev 190/88 `37488034` · Muse 2.0 178/153 `31494498` |
| markdown notes app (370) | Khoj 565/150 `36933452` · Building a Markdown app for 3 years 533/269 `20103589` · Reor 411/102 `39372159` · **Apple Notes markdown export 350/204 2025-06-05 `44191558`** · Athens 340/152 `26316793` |

**Threads opened (13):** `44022448` Ditching Obsidian and building my own (471/559 comments, the strongest leaving-Obsidian thread), plus the bolded ones above, `30394713`, `40846242`, `28617596`.

**Reason counts across the HN comments I read** (mentions / distinct threads):

| Reason | Count |
|---|---|
| Plain files, markdown on disk, no lock-in (pull toward Obsidian-likes) | 22 / 6 |
| Not open source / proprietary editor | 15 / 5 |
| Notion slow or heavy | 11 / 4 |
| Setup + maintenance burden, learning curve, tinkering | 12 / 5 |
| Databases/tables (what stops people leaving Notion) | 12 / 4 |
| Sync friction (DIY sync unreliable, mobile/iOS) | 11 / 3 |
| AI: files must stay agent-readable/editable | 9 / 5 |
| Longevity / company risk / enshittification | 9 / 4 |
| Sync **cost** (paid Obsidian Sync as a grievance) | 8 / 3 |
| No real-time collaboration / "doesn't do team" | 8 / 3 |
| Electron / not native | 8 / 4 |
| Apple Notes export/lock-in | 8 / 1 |
| No web version (Obsidian, Logseq, Anytype) | 7 / 4 |
| Notion offline / outage | 7 / 5 |
| Mobile app slow or weak (Obsidian) | 6 / 3 |
| Plugins break, get abandoned, or are a security risk | 6 / 3 |
| Notion export / lock-in | 5 / 3 |
| Migration path mangles content | 5 / 3 |
| AI unwanted / distrusted | 5 / 2 |
| Notion pricing / no small-team free tier | 4 / 3 |

### 2. Reddit — blocked, then routed around

| Request | Result |
|---|---|
| `www.reddit.com/r/ObsidianMD/top.json?t=year&limit=50` | **403**, 189,908-byte page: "You've been blocked by network security." Same 403 with both a descriptive UA and a browser UA. |
| `www.reddit.com/r/Notion/search.json?q=switched...` | **403** (both UAs) |
| `www.reddit.com/r/ObsidianMD/search.json?q=switched%20from...` | **403** (both UAs) |
| `www.reddit.com/r/PKMS/top.json?t=year&limit=50` | **403** (both UAs) |
| `old.reddit.com/...json` | **302 → /login/?reason=lor2** |
| `api.reddit.com/...` | **403** |
| **`www.reddit.com/...rss`** | **200** — works, but rate-limits hard (429 on back-to-back calls) and truncates; no scores in the feed |
| `api.pullpush.io` | **429** |
| **`arctic-shift.photon-reddit.com`** (third-party archive) | **200** — gives score, num_comments, selftext, comments by post id |

**Caveat on Reddit numbers:** scores come from the Arctic Shift archive, whose `retrieved_on` equals the post date in every row I pulled, so they are **capture-day lower bounds**, not final scores. Live verification is impossible while Reddit returns 403. Archived *comment* scores are almost all 1 and are worthless.

Top posts, r/Notion "switched" (top, past year) and r/ObsidianMD/r/PKMS top:

| Post | Sub | Score/comments | Date |
|---|---|---|---|
| Officially moved from Notion to Obsidian | ObsidianMD | 1430/81 | 2025-10-11 |
| AI boosterism is ruining this community | ObsidianMD | 1409/98 | 2026-02-16 |
| Bro what, how is this app free? | ObsidianMD | 1047/111 | 2026-01-17 |
| After AWS' crash/hack, we switched from Notion to Obsidian | ObsidianMD | 664/64 | 2025-10-25 |
| Terribly angry about what Notion did (data wiped) | Notion | 289/101 | 2026-06-11 |
| I migrated 1.8GB from Notion — existing tools failed | ObsidianMD | 244/19 | 2025-10-05 |
| Why I have finally had enough and will cancel | Notion | 180/90 | 2026-07-25 |
| I was one of Notion's biggest fans...everything is wiped | Notion | 150/155 | 2026-03-28 |
| PETITION: Notion Custom Agents credit pricing UNSUSTAINABLE | Notion | 97/49 | 2026-02-26 |
| A review of all PKMS apps in 2025 | PKMS | 100/84 | 2025-12-27 |
| Tried to Switch to Obsidian, Experienced Hell | Notion | 24/120 | 2026-09-06 |
| Anyone else exhausted from building their knowledge system | PKMS | 50/34 | 2025-12-17 |

### 3. What Obsidian lacks (and why people pick it)

| Leaves because | Mentions/sources | Chooses because | Mentions/sources |
|---|---|---|---|
| Sync: paid, or DIY is fragile on mobile | 19 / 8 | Plain .md files on disk, no lock-in | 28 / 8 |
| Setup burden: "a plugin for everything" | 15 / 6 | Plugin ecosystem | 13 / 5 |
| Closed source | 17 / 6 | Free, non-VC business model | 8 / 4 |
| No team/multiplayer, no comments | 8 / 3 | Agent-friendly (Claude/Codex edit the files) | 9 / 5 |
| Mobile app: slow launch, poor quick capture | 7 / 4 | Offline + E2EE | 6 / 4 |
| Electron, not native; no web version | 11 / 5 | Graph, backlinks, Excalidraw, Canvas | 6 / 3 |
| Plugins break / get abandoned | 6 / 3 | | |
| Doesn't look good out of the box | 6 / 2 | | |

### 4. What Notion lacks (and why people stay)

| Leaves because | Mentions/sources | Stays because | Mentions/sources |
|---|---|---|---|
| Speed: heavy desktop, worse mobile, worse as it grows | 19 / 9 | Databases/tables/views | 18 / 5 |
| AI pushed in + AI credit pricing | 12 / 9 | Collaboration, comments, suggestions, history | 8 / 4 |
| Offline: brick without internet; outages | 8 / 7 | Looks good with no work | 5 / 2 |
| Export / lock-in / broken markdown import | 7 / 6 | "Good enough" at everything in one place | 3 / 2 |
| Price, tiers, 1,000-block limit, no small-team free tier | 8 / 6 | | |
| Data loss and support failure | 4 / 4 | | |
| Maintenance becomes the work | 5 / 5 | | |
| US-cloud/privacy, no local storage below Enterprise | 5 / 2 | | |

### 5. What would make someone switch — stated demands

- "The one thing I need in a solution like this is multi-player mode" with track-changes "that I can collaborate with my AI on these docs" — `48180649`
- "when an agent edits a file does it round-trip YAML frontmatter and nested code fences cleanly" … "every 'wysiwyg markdown' tool i've tried falls apart there" — `48678838`
- "The feature I am waiting for in all of these editors is integrating 'red lining' as a channel for LLM input." — `48682519`
- "What I really want is the AI to live IN the app, like VS Code" — `48680870`
- "I'd love to switch to this but I definitely need my relational database features." — `43379286`
- Checklist: "(a) git versioned (b) CRDTs (c) WYSIWYG but Markdown (esp GFM) (d) front matter + markdown able to be SSGd (e) comfortable UI for not-devs" — `43379989`
- "two killer features to leave a Notion or Confluence" = @-mention notifications + comments on documents — `43388675`
- "The Obsidian migration path is honestly the make-or-break." — `48681476`; "Switching costs are usually what keeps people locked in." — `48675741`
- "The first real Obsidian alternative would allow use of existing Obsidian plugins." — `48181381`
- "Figure out encryption at rest or encrypted note storage / clean self hosting" — `48185160`
- "I wish there was something as lightweight and as well integrated as Apple Notes. Just support MD, sync well and have a search function." — `44024014`
- "I just want a good markdown editor. For me, this is all I need." — r/ObsidianMD `1vsopeo`, 274 pts

### The ten switching drivers

1. **Sync that just works, cross-device, without a bill or a hack** — 19/8. "$4/month is a lot for something that only sometimes syncs." `44024862` · "git works for obsidian but it is absolutely hack-ey and NOT seamless." (r/Notion `1w9a9ko`)
2. **Own the files: markdown on disk, no lock-in** — 28/8. "There's no lock in. 'Migration' isn't really a thing - it's some files in a folder system." `44023100` · "I only use Obsidian and Joplin because the information is local" (r/Notion `1uj225g`)
3. **Speed, especially on mobile and at scale** — 19/9. "Notion is the single biggest frustration of any workplace tool I've ever used in my entire software career" `36800376` · "after a few pages of notes, notion uses 100% of a core and input lags considerably" `43390107`
4. **AI that edits your files — and AI you can turn off** — 21/11. "I was so tired of Notion shoving AI into everything" (r/ObsidianMD `1o3xo6g`) · "obsidian: great for LLMs (local markdown files), bad for collaboration (no multiplayer features like multi editor, comments)" `48682303`
5. **Price changes and credit metering** — 20/12. "Notion killed fair use. its a model aggregator and fancy version of Obsidian now." (r/Notion `1v5ytjd`) · "to get ai you need business which is almost double" (r/Notion `1ss1rzr`)
6. **Setup and maintenance burden** — 24/11. "I literally need to install a Community Plugin for everything" (r/Notion `1w9a9ko`) · "I spent more time building dashboards and relational databases than actually writing." (r/PKMS `1posk4o`)
7. **Open source / not proprietary** — 17/6. "Obsidian may not be open source, but its file format is definitely more open than Joplin's. Which is why I switched to it." `48186158` · "Obsidian is not free and not open source" `44027922`
8. **Teams: multiplayer, comments, review** — 16/7. "Obsidian doesn't do team." `48682726` · "two killer features to leave a Notion or Confluence" `43388675`
9. **Offline, outages, data loss, longevity** — 19/12. "Without internet, Notion is essentially a brick" `43381180` · "I would not want to lose access to my notes if the company folds" (r/Notion `1uj225g`)
10. **Databases, and a migration that doesn't mangle them** — 23/8. "I'd love to switch to this but I definitely need my relational database features." `43379286` · "I migrated 1.8GB from Notion to Obsidian - existing tools failed" (r/ObsidianMD `1nyw5c4`)

### Not opened / blocked

- `www.reddit.com/*.json` (all four requested URLs, both UAs) — **403**, network-security block page
- `api.reddit.com` — **403**; `old.reddit.com` — **302 to login**
- `api.pullpush.io` — **429**
- Reddit RSS — **200 but rate-limited**: one search feed returned **429** on first attempt, succeeded on retry ~50s later; three of four responses arrived truncated (`IncompleteRead`) and were parsed from the partial body
- Arctic Shift title-search on r/ObsidianMD — **"Timeout. Maybe slow down a bit"** (the archive refuses keyword search on high-volume subreddits); ID lookups and comment fetches worked
- Live Reddit scores could not be verified; archive scores are capture-day values