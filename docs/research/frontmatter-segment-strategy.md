# frontmatter — Segment Strategy
*Synthesized 2026-07-13 from 8 segment studies + 2 market studies. Product today: browser vault + git sync + publish. Collab: later.*

---

## 1. Segment Scorecards

### 1.1 Obsidian power users

| Dimension | Assessment |
|---|---|
| **Pain intensity** | **Extreme, 6 years unanswered.** "Obsidian for web" is the forum's most-viewed suggestion: 246,568 views / 244 posts / 928 likes, still active in 2026 (https://forum.obsidian.md/t/obsidian-for-web/2049). Workaround absurdity proves it: 414,917 Docker pulls of linuxserver/obsidian (streaming a whole desktop over VNC into a browser tab), obsidian-git at 11,540 stars with a README that warns mobile git is "very unstable" (https://github.com/Vinzent03/obsidian-git). "Of cource it would. I can not install any program at my work pc, how do you spect that i use obsidian??" (t/2049/246). |
| **Reachability** | **Best of all segments, near-zero cost.** The exact askers are enumerable: t/2049 thread, r/ObsidianMD (~343k, +49% YoY), Obsidian Discord (193,021 members, sanctioned #content-update channel), Share & showcase forum category (3,327 topics), obsidian-git/obsidian-remote issue threads. HN reliably front-pages this shape: Files.md 730 pts, headless Sync client 587 pts. Constraint: Obsidian Code of Conduct requires the "integrates with your vault" framing, not "Obsidian competitor". |
| **Willingness to pay** | **Moderate, band is $2–6/mo.** Anchors: Obsidian Sync $4/$8 per user/mo (verified https://obsidian.md/sync); users pay Working Copy $19.99 / Polygit $2/mo just to move commits on iOS; forum pricing thread names "$2-4/month" as acceptable (https://forum.obsidian.md/t/26329). Hard free-only DIY faction exists — they convert via collab/iOS reliability, not sync. |
| **Fit with codebase today** | **Highest.** Browser vault onto an existing git repo IS the product. Their #1 job (locked-down work laptop; GitHub.com reachable where Dropbox is firewalled) needs zero features frontmatter doesn't have. Collab is their 5th pain, not their 1st. Risks: Obsidian-dialect fidelity (wikilinks, frontmatter, callouts, clean diffs) and 5–20k-note performance are pass/fail in the first minute. |
| **Honest verdict** | **Beachhead #1.** Largest verified pain signal in the corpus, cheapest reach, exact product-shape match. Caveat: skews free-first — treat as acquisition + evangelism engine more than revenue engine. |

### 1.2 Content creators / git-blog publishers

| Dimension | Assessment |
|---|---|
| **Pain intensity** | **High and daily.** "I'm tired of the git workflow. I yearn for a CMS for my Jekyll." (https://news.ycombinator.com/item?id=43771645). Publishing is chained to a desktop terminal; phone publishing is Termux/iSH/Working Copy Rube Goldberg (obsidian-git issue #57, 131 comments). "free publish alternative" forum thread: 15,831 views (https://forum.obsidian.md/t/29540). Obsidian Publish resented at $96/yr (https://obsidian.md/publish; https://theowinter.ch/%E2%9C%8D%EF%B8%8F-Thoughts/My-Obsidian--and--Quartz-Workflow). |
| **Reachability** | **Excellent, cheap.** digitalgarden plugin 80,601 downloads = direct intent proxy; obsidian-git 2,843,447 downloads; Quartz 12,740 stars + Discord + showcase; Hugo discourse mobile-publish threads; forum Share & showcase (where mkdocs-publisher, Verdant, Markbase all launched); "How I blog with Obsidian, Hugo…" hit 336 HN pts. |
| **Willingness to pay** | **Free center of gravity, but proven $ for convenience:** Working Copy $19.99, Verdant Pro $19, HugoNest $9.99, Polygit $10/yr all purchased to remove one friction step. Ceiling = Obsidian Publish $8/mo; segment demonstrably prefers one-time/lifetime. |
| **Fit with codebase today** | **Very high.** Browser edit of the repo + publish is the whole loop; they already own the repo and the mental model ("publish: true — and it's live"). Gaps: mobile-browser editing polish, image paste→compress→commit pipeline, hard public/private boundary. Must sit alongside their SSG, never replace it. |
| **Honest verdict** | **Beachhead #2.** Smaller than segment 1 (tens of thousands) but the publish feature that already exists is exactly their dream product; every user is a public backlink. |

### 1.3 Notion/Evernote refugees

| Dimension | Assessment |
|---|---|
| **Pain intensity** | High but episodic — spikes at each price hike (Evernote $69.99→$129.99/yr; Notion Business $15→$20). Migration failure is the wedge: "I'm code illiterate… every time i try to run N2O.py it just flashes a python window blackscreen" (https://forum.obsidian.md/t/2728, 69,410 views). |
| **Reachability** | Good but timing-dependent: r/Evernote alternatives megathread, HN churn events (Evernote layoffs 1,025 pts/614 comments), Google intent "notion to obsidian". |
| **Willingness to pay** | Traumatized payers: $20–60/yr or one-time (UpNote $39.99 lifetime is the loved anchor); >$100/yr re-triggers the exit. Large free-only contingent. |
| **Fit with codebase today** | **Medium-low.** Browser access fits; but they need a no-terminal importer with a verification report ("536 in, 536 out"), true WYSIWYG (a chunk rejected Obsidian "due to markdown etc"), attachments/PDF handling, and fully invisible git ("As i am in marketing, not IT — how do I commit?" t/2049). None of that exists yet. |
| **Honest verdict** | **Second wave.** Revisit when (a) WYSIWYG editor and (b) upload-your-export importer ship. Then it's a large, motivated inflow triggered on every incumbent price event. |

### 1.4 Developers / docs-as-code teams

| Dimension | Assessment |
|---|---|
| **Pain intensity** | High and articulate — they've spec'd frontmatter in public: "It'd be nice to implement the non-technical workflow as producing a pull request via a branch" (https://news.ycombinator.com/item?id=40836847); "pressure to move to Confluence… because some non-technical users did not want to use git" (https://news.ycombinator.com/item?id=40917358). |
| **Reachability** | Excellent (HN, r/selfhosted, Write the Docs) but the self-host crowd (Outline 39.7k stars, Docmost 21k) is free-only. |
| **Willingness to pay** | **The real money:** HackMD ~$5/user/mo, GitBook ~$113/mo for 5 seats, Mintlify $150–550/mo. Explicit intent: "would gladly purchase a team sync account for that feature" (https://forum.obsidian.md/t/6058). Cautionary: Dendron "was unable to find product market fit" selling to solo devs (https://github.com/dendronhq/dendron/discussions/3890) — the money is teams, not individuals. |
| **Fit with codebase today** | **Medium.** Git-backed browser editing + publish-on-merge fits; but real-time co-editing + inline comments are a documented purchase dealbreaker ("almost unanimously, that landed as a dealbreaker in the Pugh matrix", t/6058) — and that is the deferred collab layer. |
| **Honest verdict** | **The monetization wave — revisit the quarter collab + comments ship.** Do not pitch teams before then; you'd be GitHub's web editor with extra steps. |

### 1.5 Writers & editors

| Dimension | Assessment |
|---|---|
| **Pain intensity** | High and specific: no track changes in any markdown tool. "Markdown won't have a prayer of competing with .docx files… without this feature" (https://forum.obsidian.md/t/18485). But the counterparty (editor/agent) dictates docx/GDocs and "cannot really ask him to change for me" (https://talk.automators.fm/t/ulysses-to-google-docs/5498). |
| **Reachability** | Good (r/writing ~3.4M, Scrivener forum, novelWriter HN 369 pts) but hobbyist/free-heavy. |
| **Willingness to pay** | $40–100/yr or beloved one-time $50–150 (Ulysses $39.99/yr, Scrivener ~$49, Atticus $147). They pay editors hundreds per manuscript, so friction has monetary weight. |
| **Fit with codebase today** | **Low.** The entire JTBD is suggestion mode + no-login commenter links + docx round-trip — all collab-layer or export features that don't exist yet. |
| **Honest verdict** | **Ignore for now; revisit when suggestion mode + share-link commenting + clean docx export exist.** Then it's a genuinely unserved "track changes for markdown, finally" category. |

### 1.6 Students & academics

| Dimension | Assessment |
|---|---|
| **Pain intensity** | Real (supervisor Word round-trip, Zotero plugin fragility, locked-down lab machines) — "collaboration with this involves printing the document, hand writing notes on it and me transcribing" (https://academia.stackexchange.com/questions/131341). |
| **Reachability** | Good (r/GradSchool ~936k, r/PhD ~252k, forum Research megathread 59k views, PKM YouTube). |
| **Willingness to pay** | **Near zero for students.** Notion is free with .edu; Obsidian Sync has a 40% edu discount; they engineer around Zotero's free 300MB. Only proven paid escape: Overleaf's collaborator cap. |
| **Fit with codebase today** | Low-medium. Browser vault on lab machines fits today; but citations (Zotero/BibTeX), equation numbering, and the supervisor collab loop are all missing and all named as hard blockers. |
| **Honest verdict** | **Ignore as a paid segment; revisit post-collab as a free .edu growth loop** (mirrors Notion/GitHub Student Pack) once citations + suggestion mode exist. |

### 1.7 Small teams / startups

| Dimension | Assessment |
|---|---|
| **Pain intensity** | High: Notion pricing creep ("Notion is the only one that keeps moving the goalposts", https://www.reddit.com/r/Notion/comments/1kli8c4/), lock-in dread, and the split-brain — "I iterate on the doc… then export it to notion (via MCP) and publish that for feedback" (https://news.ycombinator.com/item?id=47535363). |
| **Reachability** | Good (HN — Docs 1,952 pts; r/Notion ~400k+; Docmost/Outline communities), churn cohorts mint on every Notion price event. |
| **Willingness to pay** | Proven $50–200/mo per team (Notion $10–20/seat; Outline $10/mo flat for 10). Flat/cheap team pricing with the repo as escape hatch is the winning shape. |
| **Fit with codebase today** | **Medium.** Repo-wiki + browser editing fits engineers; but "commenting and discussion on a file has so much more friction than Google Docs" (HN 47535363) is the single most-cited reason git-doc workflows die for mixed teams — collab-gated. |
| **Honest verdict** | **Revisit with developers-docs when collab + comments ship** — same buyer motion (technical champion, ops/founder decision-maker), highest ARPU in the corpus. |

### 1.8 Non-technical normals

| Dimension | Assessment |
|---|---|
| **Pain intensity** | Real (Apple Notes shared-note sync corruption: "🐱 Boys fed 1005105 ampmpm", https://discussions.apple.com/thread/255116585) but solved-enough by free platform defaults. |
| **Reachability** | Enormous (Keep 1B+ downloads) but frontmatter is structurally invisible to them: no GitHub account, no willingness to create one. |
| **Willingness to pay** | $0 default; $10–40/yr per household ceiling (AnyList $14.99/yr household). |
| **Fit with codebase today** | **None.** GitHub sign-in fatal, phone-first native-grade realtime required, any visible markdown/git vocabulary is instant abandonment. The corpus's own words: "this segment is NOT reachable by frontmatter v1." |
| **Honest verdict** | **Explicitly ignore. Phase 3+ ambition at best**, via the tech-adjacent-partner Trojan horse, only after WYSIWYG, invisible-git email/Google signup, and flawless mobile realtime all exist. |

---

## 2. Beachhead Ranking

### Win first

**#1 — Obsidian power users (specifically: blocked-at-work + git-vault sub-segments).**
Reasoning: the strongest verified pain artifact in the entire corpus (t/2049: 246,568 views, six years, zero official movement, users creating forum accounts just to ask); the workarounds they already run (414,917 Docker pulls to stream a desktop; $19.99 iOS apps to push a commit) prove they will adopt something 10x simpler; the product as it exists today — browser vault + git sync — is the literal answer with no missing feature for the core job; and the watering holes accept a demo link directly into the asking thread. GitHub.com is reachable on corporate networks where Dropbox is firewalled — the structural gap frontmatter slots into ("Our team is looking into using GitHub + Obsidian exactly because of this scenario", t/2049).

**#2 — Content creators / git-blog publishers.**
Reasoning: second-best today-fit (publish already ships), the sharpest daily-loop pain ("dropping down into the terminal to use git to publish a blog post seems like too much work", HN 43771645), heavy overlap with beachhead #1 (same vault, same repo, same forums — one GTM motion serves both), and every converted user publishes a public site that markets the product. Smaller than #1 but the highest word-of-mouth yield per user.

These two share a single honest framing the market corpus says is the ONLY admissible one in the big Obsidian watering holes: *"your Obsidian vault, editable anywhere on the web — plain Markdown in, plain Markdown out"* — integrates-with, not competes-with.

### Explicitly ignore (and when to revisit)

| Segment | Status | Revisit trigger |
|---|---|---|
| Non-tech normals | **Ignore indefinitely** | Phase 3+: WYSIWYG + Apple/Google signup with invisible repo + native-grade mobile realtime all shipped and proven |
| Writers & editors | Ignore | Suggestion mode (accept/reject UI) + no-login commenter share links + clean docx export ship |
| Students & academics | Ignore as revenue; passive free adoption fine | Collab ships + citation (Zotero/BibTeX) and equation-numbering stories exist; then launch .edu free tier as growth loop |
| Small teams / startups | Ignore | Real-time co-editing + inline comments ship (wave-2 monetization, alongside developers-docs) |
| Developers / docs teams | Seed awareness only (they overlap HN launch) | Same trigger: collab + comments; then this is the per-seat revenue engine |
| Notion/Evernote refugees | Ignore | WYSIWYG + browser-based export importer with verification report ship; then ambush the next incumbent price-hike news cycle |

---

## 3. Mini GTM Plays — Top 2 Beachheads

### Play A: Obsidian power users

**Positioning line (their words):** *"Your vault, in any browser. Nothing to install."* — the direct answer to "I can not install any program at my work pc, how do you spect that i use obsidian??" (t/2049/246).

**Three channels, concrete first moves:**
1. **forum.obsidian.md, thread t/2049 itself + Share & showcase.** First move: post a working demo link and a 60-second GIF into https://forum.obsidian.md/t/obsidian-for-web/2049 framed as "how I edit my vault from the browser" (workflow post, per Code of Conduct: "participate more than you promote"). The 244 posters are the warmest leads on the internet.
2. **Companion Obsidian plugin + Discord #content-update.** First move: ship a minimal "Open in frontmatter" vault-bridge plugin as a PR to obsidianmd/obsidian-releases, then announce in #content-update (193,021-member Discord, sanctioned promo channel). Precedent: Relay, a commercial collab service, distributed exactly this way — 172,544 plugin downloads.
3. **Show HN.** First move: "Show HN: frontmatter – edit your Obsidian vault repo from any browser" with the first-person itch story and ownership framing (repo stays on YOUR GitHub, client-side rendering). Pattern proven: Files.md 730 pts, headless Sync client 587 pts, Heynote 1,063 pts. Author answers every comment.

**The ONE feature gap to close first:** **Obsidian round-trip fidelity at real-vault scale** — wikilinks/frontmatter/callouts/embeds render correctly, desktop Obsidian sees zero mangled files or noisy diffs, and a 5–20k-note vault opens and searches in seconds. The corpus is explicit: "they will judge the product in the first minute on their own vault," and any dialect breakage = "instant rejection as 'just another markdown editor'."

**Price:** free tier = browser vault + git sync (that IS the acquisition hook — "Free sync. It's just git"); paid **$4/mo** individual (matches Obsidian Sync Standard, sits inside the stated "$2-4/month" acceptable band from forum t/26329) for iOS reliability, sharing, and publish extras.

### Play B: Content creators / git-blog publishers

**Positioning line (their words):** *"Tired of the git workflow? Your blog is still a repo you own — now it edits like a doc."* — from "I'm tired of the git workflow. I yearn for a CMS for my Jekyll." (https://news.ycombinator.com/item?id=43771645).

**Three channels, concrete first moves:**
1. **forum.obsidian.md Share & showcase.** First move: launch post in the exact category where mkdocs-publisher (15,831-view thread), Verdant, and Markbase launched — "publish: true and it's live: my vault-to-blog workflow without a terminal," priced-against-Obsidian-Publish comparison included.
2. **Quartz ecosystem.** First move: write a "frontmatter + Quartz" guide (edit in frontmatter → publish via Quartz), post it in the Quartz Discord (discord.gg/cRFFHYye7t) and submit the workflow to the showcase (quartz.jzhao.xyz/showcase); the 12,740-star Quartz crowd already tools up around a vault.
3. **Hugo discourse + mobile-publish threads.** First move: reply with the demo in the standing threads — https://discourse.gohugo.io/t/publish-from-mobile/9606 and https://discourse.gohugo.io/t/how-can-i-upload-posts-from-a-phone/42564 — where people are literally copy-pasting from phones "when I get to a computer."

**The ONE feature gap to close first:** **mobile-browser draft→publish flow, including the image pipeline** (paste a photo → compressed → committed to the repo → correct path on the published site). The segment's defining sentence is "The bugbear being that it wasn't easy to publish if I wasn't at my desktop"; images are the repeatedly-requested, never-solved step ("It's such a pain to do it manually that I don't bother most of the time").

**Price:** free solo publish (the acquisition hook; this crowd routes around anything less); convenience layer at **$3–5/mo, priced visibly under Obsidian Publish's $8/mo**, plus a **one-time lifetime option (~$29–39)** — the corpus shows this segment demonstrably prefers Working-Copy/UpNote-style one-time purchases.

---

## 4. Market Numbers Table

| Metric | Value | Confidence | Source |
|---|---|---|---|
| "Obsidian for web" thread engagement | 246,568 views / 244 posts / 928 likes over 6 years | verified | https://forum.obsidian.md/t/obsidian-for-web/2049 |
| linuxserver/obsidian browser-streaming container | 414,917 Docker pulls | verified (2026-07-13) | hub.docker.com API |
| obsidian-git plugin | 11,540 GitHub stars; 2,843,447 downloads | verified | github.com/Vinzent03/obsidian-git; obsidian-releases community-plugin-stats.json |
| digitalgarden plugin downloads (vault-to-website intent proxy) | 80,601 | verified | obsidianmd community-plugin-stats.json |
| Obsidian Sync pricing | $4/mo Standard (cut from $8 in Mar 2024), $8/mo Plus | verified | https://obsidian.md/sync; https://obsidian.md/blog/standard-plan/ |
| Sync price-complaint thread; stated WTP | 58 posts / 13,451 views / 256 likes; "maybe $2-4/month" | verified | https://forum.obsidian.md/t/26329 |
| Obsidian Publish pricing | $8/mo per site, billed annually | verified | https://obsidian.md/publish |
| Obsidian users / revenue | 1–1.5M+ users; $2M ARR vs $25M/yr (12x divergence); ~7 staff bootstrapped | unverified (team size verified) | fueler.io; getlatka; eu.36kr.com; Ango LinkedIn |
| Notion users / ARR / valuation | 100M users (2024); ~4M paying (estimate); $400M 2024 → ~$600M ARR (estimate); $10–11B | mixed (users/valuation verified; paying/ARR estimate) | super.so/blog/notion-stats; taptwicedigital.com/stats/notion |
| Notion pricing | Plus $10/user/mo, Business $20/user/mo; free-team 1,000-block cap | verified | https://www.notion.com/pricing; https://www.notion.com/help/understanding-block-usage |
| Evernote at acquisition / repricing | 250M registered, ~$100M ARR; personal $69.99→$129.99/yr; subscriber decline admitted in F-1 | verified | TechCrunch/Forbes; sec.gov Bending Spoons F-1 |
| Note-taking app market size 2025 | $1.18B / $1.35B / $11.02B / $17.19B depending on firm (10x divergence); CAGR 11–22% | unverified | Business Research Insights; DataIntelo; TBRC; MRFR |
| r/ObsidianMD vs r/Notion growth | 343k (+49% YoY) vs 464k (+13% YoY) | estimate | gummysearch.com (2026-07-10/12) |
| Obsidian Discord members | 193,021 | estimate | discord.com/invite/obsidianmd via search |
| HN comparables | Files.md 730 pts; headless Sync client 587; Heynote 1,063; Obsidian's own Show HN 1,087; SilverBullet 311; Obsidian+Hugo blog workflow 336 | verified | HN Algolia API |
| Companion-plugin distribution precedents | Self-hosted LiveSync 781,378; Readwise 235,917; Relay 172,544 downloads | verified | obsidian-releases community-plugin-stats.json |
| Quartz | 12,740–12,741 stars | verified | GitHub API |
| Team-tool price anchors | HackMD ~$5/user/mo; GitBook ~$113/mo (5 seats); Mintlify $150–550/mo; Outline Cloud $10/mo flat (1–10 users) | verified/estimate mix | hackmd.io blog; ferndesk.com; docsio.co; getoutline.com/pricing |
| Personal-tool WTP anchors | UpNote $39.99 lifetime (loved); Bear $29.99/yr (benchmark); Reflect $10/mo no free tier (resented) | verified (Reflect reception), estimate (UpNote/Bear revenue) | getupnote.com; getlatka; toolfinder.com |
| Dendron (solo-dev git-notes cautionary) | "unable to find product market fit"; maintenance mode 2023; 7,450 stars | verified | https://github.com/dendronhq/dendron/discussions/3890 |
| Live-collab purchase intent | 43,541-view feature request; "would gladly purchase a team sync account for that feature" | verified | https://forum.obsidian.md/t/6058 |
| iOS folder-access request | 34,390 views / 78 posts; user offered in-app-purchase payment | verified | https://forum.obsidian.md/t/28266 |
| "free publish alternative" thread | 15,831 views | verified | https://forum.obsidian.md/t/29540 |

---

## 5. Messaging Bank

Each hook is derived from a verbatim user quote in the corpus (quote + URL given).

1. **"Your vault, in any browser. Nothing to install."** — from "I can not install any program at my work pc, how do you spect that i use obsidian??" (https://forum.obsidian.md/t/obsidian-for-web/2049/246) — *obsidian-power-users*
2. **"Stop streaming a whole Linux desktop over VNC to read your own notes."** — from "Kasm and VNC and remote desktop gateways + browser are really the only way to access" (https://forum.obsidian.md/t/obsidian-for-web/2049/233) — *obsidian-power-users*
3. **"Git sync without the mobile pain — no Termux, no iSH, no $19.99 helper app."** — from "It should probably be mentioned that Working Copy costs $19.99 to use." (https://github.com/Vinzent03/obsidian-git/issues/57) — *obsidian-power-users*
4. **"Paying for sync? You should at least get a browser view of your own notes."** — from "Paying for Obsidian Sync, the service already has all the notes on the back-end anyway. I would expect it to let me at least view the notes from the browser." (https://forum.obsidian.md/t/obsidian-for-web/2049/241) — *obsidian-power-users*
5. **"Tired of the git workflow? Your blog is still a repo you own — now it edits like a doc."** — from "I'm tired of the git workflow. I yearn for a CMS for my Jekyll." (https://news.ycombinator.com/item?id=43771645) — *content-creators-ghblog*
6. **"Stop copy-pasting from your phone into Hugo when you get to a computer."** — from "I use a markdown editor on my phone, sync it with icloud and copy paste into hugo when I get to a computer." (https://discourse.gohugo.io/t/publish-from-mobile/9606) — *content-creators-ghblog*
7. **"Obsidian Publish ease, on YOUR GitHub repo, without the $96/year."** — from "That simplicity has a price though, to the tune of 96$/year and a fair amount of restrictions" (https://theowinter.ch/%E2%9C%8D%EF%B8%8F-Thoughts/My-Obsidian--and--Quartz-Workflow) — *content-creators-ghblog*
8. **"Import your old notes in the browser — no Python, no terminal, no ModuleNotFoundError."** — from "I'm code illiterate… every time i try to run N2O.py it just flashes a python window blackscreen" (https://forum.obsidian.md/t/notion-2-obsidian-migration-instructions/2728) — *notion-evernote-refugees*
9. **"Your PM can finally edit the docs — every save is a commit, every edit can be a PR."** — from "It'd be nice to implement the non-technical workflow as producing a pull request via a branch" (https://news.ycombinator.com/item?id=40836847) — *developers-docs* (wave 2)
10. **"Send your editor a link, not a .docx — one draft, not draft1_ed_FINAL_v2."** — from "He has tons of processes and automation around this, so I cannot really ask him to change for me." (https://talk.automators.fm/t/ulysses-to-google-docs/5498) — *writers-editors* (post-collab)

---

*Method note: all quotes, URLs, and numbers above are taken directly from the supplied corpus; confidence tags preserved as given. No quotes invented. Segments 1.3–1.8 verdicts follow the corpus's own countervailing evidence (Dendron PMF failure, Pugh-matrix collab dealbreaker, non-reachability of normals) rather than optimistic sizing.*