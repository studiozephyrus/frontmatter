# frontmatter — Pain-Point Taxonomy
*Synthesized from 11 research slices: r/ObsidianMD, r/Notion, r/Evernote, r/OneNote, r/PKMS, Hacker News, Product Hunt, Kickstarter/indie, review sites (Trustpilot/G2/Capterra), git-md-sync issue trackers, gdocs-collab threads, and the current md repo state.*

Severity scale: **KILLS ADOPTION** (people refuse/quit over it) > **CHURNS USERS** (drives paying users out) > **ANNOYS** (tolerated, but weakens loyalty).

---

## T1. Sync silently destroys data

**Severity: KILLS ADOPTION** — one silent-overwrite incident ends trust permanently; users say so explicitly.
**Apps suffering:** Obsidian (iCloud, paid Sync, obsidian-git), OneNote, Simplenote, Joplin, GitJournal, SilverBullet, Evernote, Notion (30-day trash cliff).
**Estimated frequency:** The single most-hit theme in the corpus — 561/3,220 HN comments matched sync/conflict keywords (~3x the next theme); recurring data-loss threads on every vendor's own forum (9+ on forum.obsidian.md alone); a pinned ALL-CAPS PSA on r/OneNote; multi-year GitHub issues on every git-sync tool.

> "I am CONSISTENTLY having obsidian sync erase my work" — https://forum.obsidian.md/t/obsidian-sync-on-iphone-overwrites-newer-data-causing-data-loss/85214

> "DO NOT LOG IN/OUT OR REINSTALL APP. YOU WILL LOSE YOUR DATA." — https://www.reddit.com/r/OneNote/comments/1spyf90/psa_if_you_are_having_issues_with_android_onenote/

> "the app forced a logout and re-login, causing all non-synced data since July 2022 to be lost" — https://forums.simplenote.com/forums/topic/lost-2-years-of-data-after-updating-app/

> "iCloud on Windows is known to cause file duplication and corruption issues. We highly suggest avoiding using this combination." — https://www.reddit.com/r/ObsidianMD/comments/128zjss/serious_bug_data_loss_note_i_was_working_on/

**OPPORTUNITY:** Make "never loses a byte" the brand promise. CRDT-grade merge on top of git commits (git = durable history, Supabase = live layer), always-visible per-file sync status, loud failure states (never silent read-only), keep-both-on-conflict with a one-click side-by-side merge, and default-on version history with no 30-day cliff. frontmatter already has merge3.ts + baseSha 409 detection — extend it into a visible, trustworthy sync surface.

---

## T2. Trust collapse: shutdown fear, enshittification, "file over app"

**Severity: KILLS ADOPTION** — plain-file ownership is now a *purchase criterion*, not a nice-to-have.
**Apps suffering:** Evernote (Bending Spoons), Notion, Anytype, Mem, Stashpad (dead), Napkin (dead), Dropbox Paper (dead), Logseq (abandonware fear), Skiff.
**Estimated frequency:** Pervasive across every slice; 131 HN keyword hits; 3 of 16 PH-slice apps died within ~3 years; the exit-plan meme recurs across all three big subreddits.

> "I am terrified of losing years of hard work if a company suddenly shuts down." — https://www.reddit.com/r/NoteTaking/comments/1ui8fn7/need_recommendations_fast_free_futureproof_and/

> "They’re my notes on your platform. And I don’t know whether your platform will die tomorrow." — https://news.ycombinator.com/item?id=23514682

> "Files are just text, so my notes can outlive Obsidian itself." — https://news.ycombinator.com/item?id=33190983

> "When I go to paper.dropbox.com, where there use to be thousands of docs, there's now nothing." — https://news.ycombinator.com/item?id=45186011

**OPPORTUNITY:** frontmatter's architecture *is* the answer: the vault is a plain .md GitHub repo the user owns — if frontmatter vanishes tomorrow, the user still has a working Obsidian vault in git. Market this loudly ("your repo is the product; we're just the editor"). One-click full-vault ZIP export (already built) and zero proprietary format, ever.

---

## T3. Price backlash & subscription fatigue

**Severity: CHURNS USERS** — mass-exodus scale (Evernote), and blocks adoption of paid sync add-ons.
**Apps suffering:** Evernote (2.5x hikes → Trustpilot ~1.3/5), Notion (AI credit metering, $20+ MCP gating), Obsidian Sync/Publish (~$96-100/yr add-ons), Standard Notes, Logseq Sync, reMarkable Connect, Typora.
**Estimated frequency:** Every top r/Evernote thread 2024-25 is a departure post (57-79 comments each); a 433-upvote Obsidian repricing thread; "one-time purchase" is the most-praised attribute of rising indie apps (Octarine, UpNote).

> "Due to the crazy price increase, I am leaving Evernote after more than a decade of being a user and fanboy." — https://www.reddit.com/r/Evernote/comments/1g91we4/due_to_the_crazy_price_increase_i_am_leaving/

> "Obsidians sync price is nutty. $15/mo for logseq is equally nutty." — https://news.ycombinator.com/item?id=33219781

> "Gating MCP filter queries behind $20 is insane." — https://www.reddit.com/r/Notion/comments/1uqnfgq/frustrated_with_pricing_for_home/

> "That's three price increases for the same capability." — https://www.reddit.com/r/Notion/comments/1rh8j1w/final_feedback_from_a_business_customer_youre/

**OPPORTUNITY:** Git-backed sync costs frontmatter ~nothing to deliver — make sync free (the user's own GitHub repo is the backend) and charge only for genuinely costly things (collab/hosting). Simple, stable personal pricing; regional (PPP) tiers; BYO-AI keys without an enterprise paywall (multi-provider gateway already exists). Never rug-pull.

---

## T4. Slow at scale: mobile startup, Electron bloat, big-vault performance

**Severity: KILLS ADOPTION / CHURNS** — multi-minute launches are explicit quit reasons.
**Apps suffering:** Obsidian mobile (1-5 min vault loads), Evernote v10 (Electron), Notion (big databases), Joplin.
**Estimated frequency:** Multiple dedicated quit threads (r/ObsidianMD "I'm quitting" 33c; "becoming unusable" 80pts/101c); the most-cited churn reason in the 614-comment Evernote-layoffs HN thread; a dedicated Obsidian forum bug thread with independent reproducers.

> "It takes 2+ minutes to launch the app." — https://www.reddit.com/r/ObsidianMD/comments/13nquf8/im_quitting_obsidian/

> "since a few days Obsidian on mobile needs around 5min to load during loading workspace" — https://forum.obsidian.md/t/android-large-vault-slow-to-load-on-with-all-plugins-disabled/90828

> "clipping (capturing notes) on android takes AGES! around 10-30 seconds." — https://www.reddit.com/r/Evernote/comments/1k9528c/leaving_evernote_its_android_app_is_so_slow/

> "for any meaningful large document it's utterly slow" — https://news.ycombinator.com/item?id=33627145

**OPPORTUNITY:** Instant-open is Obsidian's weakest surface and a web app's natural strength: server-side index + lazy vault loading means a 10k-note vault opens in seconds in any browser. Treat cold-start time as a headline metric (frontmatter's snapshot-zipball + sha cache is the right foundation; keep it sub-second).

---

## T5. Lock-in: lossy export & proprietary formats

**Severity: KILLS ADOPTION** (for the plain-text crowd) / **CHURNS** (Notion escapees).
**Apps suffering:** Notion (relations→text, rollups vanish, CSV databases), Evernote (ZIP dumps), OneNote (proprietary format), Craft, Anytype (protobuf), Google Keep (no export at all), Apple Notes.
**Estimated frequency:** 157 HN keyword hits; a 479-pt "Notion is withholding my company data" thread; an entire third-party backup ecosystem (notionbackups, BackupLABS) exists to patch it.

> "notion export is a nightmare. I cant get my data out cleanly and importing it back is even worse." — https://www.reddit.com/r/Notion/comments/1uladm0/why_cant_i_export_my_notion_data_properly/

> "you request to export all your data on Notion, and you're supposed to receive a link to download it. But the link never arrives." — https://news.ycombinator.com/item?id=27612894

> "Compared to https://obsidian.md/, I can't just use raw Markdown or CSV file with Anytype." — https://news.ycombinator.com/item?id=36800736

**OPPORTUNITY:** frontmatter never needs an "export" feature — the data already lives as .md in the user's GitHub repo. Add the offense side: one-click importers from Evernote ENEX, Notion ZIPs (fix UUID filenames/broken links), and OneNote — migration friction is the #1 force keeping refugees hostage.

---

## T6. Offline failures in cloud-first apps

**Severity: KILLS ADOPTION** — the #1 stated reason for Notion→Obsidian switches.
**Apps suffering:** Notion (2025 offline mode judged a half-measure: manual page-marking, no browser support, 50-row DB cap), Evernote, Google Keep web, Tana, Capacities.
**Estimated frequency:** Offline was Notion's most-requested roadmap feature for years (per Notion's own release notes); dominates the 242-pt/183-comment HN offline-mode thread; top-2 con in every Notion G2/Capterra roundup.

> "I had a bunch of pages set offline for an international flight and well, nothing was loading or available for offline use" — https://www.reddit.com/r/Notion/comments/1ts1k0i/does_anyone_still_have_issues_with_notions/

> "Yeah, thanks, I’m good. Obsidian it is then." — https://news.ycombinator.com/item?id=44958572

> "i used to use Notion, but the lack of offline mode, even after all these years, made me decide to look for alternatives" — https://news.ycombinator.com/item?id=41622351

**OPPORTUNITY:** Offline-first PWA with *visible* cache state (user can SEE what's available before the flight), full read/write offline, queued sync on reconnect. A browser-based editor that works offline is an unoccupied position — Notion's offline explicitly excludes the browser.

---

## T7. Real-time collaboration is impossible in markdown-land

**Severity: KILLS ADOPTION** for teams/pairs; the one thing switchers concede Notion/Google Docs still win.
**Apps suffering:** Obsidian (no first-party answer after years of requests), all folder-of-md apps; HackMD/HedgeDoc solve co-editing but abandon local files/offline; markdown itself has no comments or suggest mode.
**Estimated frequency:** Same question re-asked continuously for years (6+ distinct r/ObsidianMD threads); recurring "Ask HN: collaborative markdown editor like Google Docs" (2024, 2026); a cluster of indie projects (CollabMD, Peerdraft, Relay, colibri) exists purely to fill the gap.

> "I love Markdown but collaboration is a pain. Whenever I work on a document with others, I end up switching to Google Docs" — https://news.ycombinator.com/item?id=47221706

> "collaborating with others usually means dealing with Git merge conflicts or abandoning local files to use a proprietary SaaS" — https://www.reddit.com/r/selfhosted/comments/1rys7b1/collabmd_turn_local_markdown_folders_and_obsidian/

> "I have bought obsidian sync. What do I do next?" — https://www.reddit.com/r/ObsidianMD/comments/176pzfe/how_do_i_collaborate_with_another_person/

> ".md misses annotations, discsusions, Richttext that everybody (also non techies) know how to work with" — https://news.ycombinator.com/item?id=47221706

**OPPORTUNITY:** This is frontmatter's headline wedge: Google-Docs-grade multiplayer (live cursors, threaded comments anchored to text ranges, suggest mode, anonymous-animal viewer access, viewer/commenter/editor share links) where the .md files in git stay the source of truth. Nobody ships this combination — HedgeDoc and SilverBullet are both only "considering" CRDTs.

---

## T8. Too complex for normal people

**Severity: KILLS ADOPTION / CHURNS** — tinkering replaces writing; the easy apps lack power, the powerful apps lack ease.
**Apps suffering:** Obsidian (plugin rabbit hole, raw markdown), Notion (databases), Anytype/Tana/Capacities (object-model learning curves), HackMD (split-pane syntax).
**Estimated frequency:** Headline theme of the 93-upvote r/PKMS "exhausted" thread; "learning curve" is the single most recurrent con across PH review pages; a 460-pt HN thread on why non-devs won't touch visible markdown.

> "Only some developers like markdown, the rest of the world just expect things to work like Word." — https://news.ycombinator.com/item?id=36446045

> "My productive days became configuring my vault instead of using it." — https://www.reddit.com/r/PKMS/comments/1posk4o/anyone_else_exhausted_from_building_their/

> "the setup time it takes to configure  a bunch of plugins  to make the obsidian app useful for me takes so much time i just gaveup halfway" — https://www.reddit.com/r/Notion/comments/1rethsc/please_just_stop/

> "If I obsidian had a native setting to switch to rich text, I could use it daily. If Craft had tags, boom." — https://www.reddit.com/r/PKMS/comments/1lapk5e/help_need_to_get_out_of_the_rabbit_hole_for_notes/

**OPPORTUNITY:** WYSIWYG-by-default (markdown fully hidden) for normal humans, with a live-preview/source toggle for power users — modes, not compromise. Sane defaults, zero plugin hunt, guided onboarding. frontmatter's Live mode v1 is the seed; the bar is "my co-founder's non-technical client can edit a note without knowing what markdown is."

---

## T9. Platform gaps: no browser access, no Android, locked-down machines

**Severity: KILLS ADOPTION** — a missing platform disqualifies the app at evaluation.
**Apps suffering:** Obsidian (NO web app at all; uninstallable on corporate laptops), Bear (Apple-only), Craft (no Android), UpNote (no web), Strflow/NotePlan (Apple-only), SilverBullet (self-host required).
**Estimated frequency:** A dedicated 43-pt/63-comment r/PKMS thread asks for exactly "Obsidian but in the browser"; Bear's own FAQ has a page for the complaint; Craft's Android absence is its most repeated PH review request.

> "I don't understand why Obsidian or third party haven't already made a business out of making vaults accessible via browser anywhere." — https://www.reddit.com/r/PKMS/comments/1ucfmib/something_like_obsidian_but_with_online_access/

> "Everyone has built a half-baked version of that for themselves with dropboxes and syncthings" — https://www.reddit.com/r/PKMS/comments/1ucfmib/something_like_obsidian_but_with_online_access/

> "The problem with Bear is that it isn't available for Windows users" — https://stephenjzeoli.medium.com/the-problem-with-bear-is-that-it-isnt-available-for-windows-users-either-as-a-web-app-or-a-cbb4da02fac9

**OPPORTUNITY:** frontmatter *is* the productized answer to the 63-comment thread: an Obsidian-compatible vault fully editable in any browser, no self-hosting, no install — works on locked-down work machines, Android, Linux, iPads. Zero-install is the moat versus every desktop-first incumbent.

---

## T10. Git-as-sync fails non-engineers

**Severity: CHURNS USERS** (high severity, narrower population) — mobile git silently overwrites; conflicts require a terminal.
**Apps suffering:** obsidian-git (isomorphic-git can't merge conflicts on mobile), GitJournal (overwrite bug open since 2020), StackEdit, generic git clients.
**Estimated frequency:** Recurring GitHub issues across 3+ years (#340/#558/#803/#819/#906); users report "spent months, gave up" setting up git sync on mobile.

> "if you commit the changes, it overwrites any changes from the other device." — https://github.com/Vinzent03/obsidian-git/issues/558

> "resolving them usually means I have to open up a terminal and run complex Git commands" — https://github.com/Vinzent03/obsidian-git/issues/803

> "The git plugin is dangerously broken. I've had pushes from different computers overwrite one another." — https://news.ycombinator.com/item?id=36610268

> "I have been trying to set up Obsidian Git off and on for months, and I just cannot get it to work." — https://www.reddit.com/r/ObsidianMD/comments/10lunm7/does_obsidian_git_on_mobile_still_require_working/

**OPPORTUNITY:** frontmatter does git server-side, so mobile-git failure modes vanish by construction. Ship: invisible auth (OAuth device flow, never hand-pasted PATs), an in-app non-terminal conflict UI (per-file mine/theirs/merge — the exact modal obsidian-git #803 spells out), auto-pull-before-edit, and app-state files kept out of the sync path. obsidian-git's issue tracker is the free product spec.

---

## T11. Capture is easy, retrieval is impossible (organization at scale)

**Severity: CHURNS USERS** — inboxes become graveyards; the system collapses past ~2,000 notes.
**Apps suffering:** Obsidian (graph "hairball"), Notion, Evernote, Logseq, Roam; also OneNote (broken search, no dates).
**Estimated frequency:** Core thesis of the 93-upvote r/PKMS thread; a wave of AI-resurfacing startups pitching in its comments; "graveyard" is repeated vocabulary across threads.

> "Capturing is too easy. Synthesis is too hard." — https://www.reddit.com/r/PKMS/comments/1posk4o/anyone_else_exhausted_from_building_their/

> "A few thousand notes later, it's just an unreadable hairball." — https://www.reddit.com/r/PKMS/comments/1posk4o/anyone_else_exhausted_from_building_their/

> "Right now, capturing information feels easy  finding it later feels impossible." — https://www.reddit.com/r/PKMS/comments/1qjv6oz/struggling_to_find_one_tool_for_everything/

**OPPORTUNITY:** Automatic resurfacing over manual linking: "you saved this idea 4 times — merge?", context-based related-note surfacing, dedup, and search that actually works at 10k notes. frontmatter's AI gateway + backlink index + suggest-links action is the substrate; server-side embeddings (the future Supabase layer) make this feasible where local-first apps struggle.

---

## T12. Capture friction

**Severity: CHURNS USERS** — people fall back to WhatsApp self-chats and Apple Notes for the moment of capture.
**Apps suffering:** Obsidian (slow open), Notion (decide-where-first), Evernote v10, Capacities; the gap Strflow/Heynote/Google Keep exist to fill.
**Estimated frequency:** The 219-pt Strflow Show HN is entirely premised on it; the 85-pt "one tool for everything" thread is about scattered capture; a dozen HN commenters independently described self-texting workflows.

> "not one app let's me open and start writing a critical note in less than 500ms" — https://news.ycombinator.com/item?id=40925906

> "I'm tired of deciding where to write something before I even write it." — https://www.reddit.com/r/PKMS/comments/1qjv6oz/struggling_to_find_one_tool_for_everything/

> "Every new idea required me to first decide if this is a project, a specific insight or something else entirely. By the time I figured that out, the idea was gone." — https://www.reddit.com/r/PKMS/comments/1posk4o/anyone_else_exhausted_from_building_their/

**OPPORTUNITY:** Zero-decision quick capture: one default inbox note, sub-500ms open (PWA shortcut / share-sheet target), hotkey capture, organize-later. Because frontmatter is a URL, capture can be "open a bookmark, type" on any device.

---

## T13. Markdown/frontmatter mangling

**Severity: ANNOYS → CHURNS** (deal-breaker for the plain-text purists who are the early-adopter base).
**Apps suffering:** Obsidian (processFrontMatter destroys YAML comments/quoting/order), Joplin/Logseq/Bear (pseudo-markdown, %2F filenames), Notion/Vrite (lossy export), attachments handled as loose sidecar files.
**Estimated frequency:** Two multi-page forum.obsidian.md threads since 2023; a community plugin exists solely to preserve YAML round-trips; recurring sub-thread in the 1,329-pt Obsidian 1.0 HN thread.

> "Calling processFrontMatter will destroy all previous formatting, and most YAML features/syntax." — https://forum.obsidian.md/t/yaml-properties-api-processfrontmatter-removes-alters-string-quotes-comments-types-formatting/65851

> "it breaks the workflow of a number of academics like myself" — https://forum.obsidian.md/t/bug-using-the-properties-menu-deletes-yaml-comments-from-the-frontmatter/69048

> "I complained to the author that his markdown files weren't true markdown" — https://news.ycombinator.com/item?id=36616397

**OPPORTUNITY:** The app is literally named frontmatter — round-trip preservation must be sacred. Property-UI edits never reorder keys, strip comments, or requote untouched YAML; standard CommonMark/GFM only; clean diffs (critical because gratuitous rewrites create phantom git conflicts). This is a small engineering cost and a disproportionate credibility signal.

---

## T14. Publishing & sharing friction

**Severity: ANNOYS** — but a visible differentiator and demand is proven.
**Apps suffering:** Obsidian Publish ($8-10/site/mo, called overpriced by design), free plugin alternatives (slow/janky), Google Docs (the default only because of share links), UpNote (no web publish).
**Estimated frequency:** 19-pt "overpriced?" thread with a 65-pt agreeing top comment; several community projects building free Publish clones; one-click revocable share links named as the unfilled gap in the self-hosting Ask HN.

> "Just my 2 cents, but yes I think they're overpriced" — https://www.reddit.com/r/ObsidianMD/comments/107gqka/is_obsidian_publish_overpriced_any_paid_users/

> "it doesn't seem to work very well. First, the export incredibly slow." — https://www.reddit.com/r/ObsidianMD/comments/12g3gnx/what_are_some_simple_ways_to_share_a_vault_with/

> "My usage for Google Docs is little more than pastebin + formating + access control." — https://news.ycombinator.com/item?id=39712573

**OPPORTUNITY:** Publishing from a web app is nearly free to deliver: one-click note/folder → public URL (already shipped via public_slug), plus revocable links, password/expiry options, and per-link Viewer/Commenter/Editor roles. Bundle it free or cheap — it undercuts a resented $96/yr add-on.

---

## Ranking (severity × frequency)

| # | Theme | Severity | Frequency | Score rationale |
|---|-------|----------|-----------|-----------------|
| 1 | T1 Sync silently destroys data | Kills adoption | Highest (3x next theme on HN; every vendor's forum) | Universal + fatal |
| 2 | T2 Trust collapse / shutdown fear | Kills adoption | Very high (every slice; 3 apps died in PH slice alone) | Now a purchase criterion |
| 3 | T3 Price backlash & subscription fatigue | Churns (at exodus scale) | Very high (Evernote Trustpilot 1.3/5; 433-pt threads) | Drives whole migrations |
| 4 | T4 Slow at scale / mobile startup | Kills adoption | High (dedicated quit threads on 3 apps) | Explicit quit-driver |
| 5 | T5 Lock-in / lossy export | Kills adoption | High (157 HN hits; 479-pt thread) | Disqualifying for target users |
| 6 | T7 Collaboration impossible in markdown | Kills adoption (teams) | High (years of re-asked threads; product cluster) | The unclaimed combination |
| 7 | T6 Offline failures | Kills adoption | High (Notion's #1 requested feature for years) | Half-fixed by incumbents |
| 8 | T8 Too complex for normal people | Kills adoption (mainstream) | High (93-pt thread; #1 PH con) | Blocks the bigger market |
| 9 | T9 No browser access / platform gaps | Kills adoption | Medium-high (dedicated threads; Bear/Craft top complaint) | Core wedge, narrower voice |
| 10 | T10 Git-as-sync fails non-engineers | Churns (severe) | Medium (3+ yrs of issues, niche population) | Fatal within the git-sync niche |
| 11 | T11 Capture easy, retrieval hard | Churns | Medium (top PKM meta-thread theme) | Slow-burn abandonment |
| 12 | T12 Capture friction | Churns | Medium (219-pt Show HN premise) | Partially served by Keep/Apple Notes |
| 13 | T13 Markdown/frontmatter mangling | Annoys→churns purists | Medium (multi-page forum threads) | Small pop., loud + influential |
| 14 | T14 Publishing friction | Annoys | Medium (19-65-pt threads; clone projects) | Cheap win, not a killer |

---

## Top 10 Unmet Needs (no current app satisfies well)

1. **An Obsidian-grade markdown vault fully usable in the browser, zero self-hosting.** Users beg for it by name and hand-roll Dropbox/Syncthing/docker hacks; SilverBullet requires a server, Obsidian has no web client at all. (https://www.reddit.com/r/PKMS/comments/1ucfmib/something_like_obsidian_but_with_online_access/)

2. **Google-Docs-grade real-time collab — live cursors, anchored comments, suggest mode, share-link roles — on plain .md files that stay the source of truth.** HackMD abandons the vault/local files; Obsidian has zero multiplayer; every indie attempt (CollabMD, Relay, colibri) is unproductized. (https://news.ycombinator.com/item?id=47221706)

3. **Sync that provably never loses data:** CRDT merge layered over git history, visible per-file sync state, loud failures, keep-both conflict copies with one-click merge. Every incumbent — including paid Obsidian Sync — has documented silent-loss stories. (https://github.com/silverbulletmd/silverbullet/issues/1728)

4. **Git/GitHub sync that non-engineers can survive:** no PAT pasting, no terminal, an in-app conflict-resolution UI. obsidian-git and GitJournal prove the demand and the failure. (https://github.com/Vinzent03/obsidian-git/issues/803)

5. **WYSIWYG-by-default with a power-user source toggle** — serving both the "won't touch anything looking like code" majority and the live-preview devotees via modes, not compromise. (https://news.ycombinator.com/item?id=36446045)

6. **Instant open at scale, everywhere:** sub-second cold start on a 10k-note vault in a mobile browser — directly attacking Obsidian mobile's 1-5-minute loads and Notion's heavy pages. (https://forum.obsidian.md/t/android-large-vault-slow-to-load-on-with-all-plugins-disabled/90828)

7. **True offline-first in a web app with visible cache state** — see what's available before the flight, full read/write offline, queued sync. Notion's offline excludes the browser entirely. (https://www.reddit.com/r/Notion/comments/1ts1k0i/does_anyone_still_have_issues_with_notions/)

8. **Default-on version history with no 30-day cliff and per-page restore** — git gives frontmatter infinite history for free; Notion/OneNote/Evernote victims all converge on this exact ask. (https://www.reddit.com/r/Notion/comments/1ujq97t/i_lost_2_months_of_notion_work_and_couldnt/)

9. **Round-trip-sacred frontmatter and markdown:** property editing that never reorders keys, strips YAML comments, or rewrites untouched text — no app with a properties UI does this today. (https://forum.obsidian.md/t/yaml-properties-api-processfrontmatter-removes-alters-string-quotes-comments-types-formatting/65851)

10. **Trust-aligned economics:** free git-backed sync, cheap one-click publishing, BYO-AI (user's own keys/subscription, no enterprise paywall), regional pricing, and a structural exit plan (the vault is the user's own repo) — the exact opposite of the Evernote/Notion patterns driving the current exodus. (https://www.reddit.com/r/Notion/comments/1uqnfgq/frustrated_with_pricing_for_home/)

---

*Cross-cutting note for positioning:* the corpus shows the market is **not** asking for another PKM philosophy — it is asking for the boring intersection nobody ships: **files I own + sync I can trust + a browser I already have + collaboration my non-technical collaborators can use + a price that won't betray me.** frontmatter's existing repo (GitHub-as-vault, merge engine, publish, AI gateway) already covers unmet needs 1, 8, and half of 3/4/10; the biggest gaps to close are multiplayer (need 2), offline PWA (need 7), and WYSIWYG polish (need 5).