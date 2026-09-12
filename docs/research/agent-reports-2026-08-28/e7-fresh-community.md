## KEY FINDINGS
- Agent access to notes has flipped to mainstream demand, not resistance: Obsidian's CEO's official agent-skills repo sits at 47,418 GitHub stars [fetched], Obsidian ships an official headless Sync CLI at 12,075 npm downloads/week [fetched], and the three main Obsidian MCP-server npm packages total 16,157 downloads/week (9,559+5,137+1,461) [fetched] — users are wiring Claude into vaults at scale, and Obsidian's strategy is 'open formats + CLI for your agent' rather than built-in AI.
- A direct new competitor in frontmatter's exact lane launched into the fresh window: Hubble.md by Ben Holmes (Astro) — 'The best notepad for you and your agents', dual React-UI-for-humans / plain-.md-for-agents design, 1,441 GitHub stars and a 151-point, 81-comment HN launch on 2026-07-29 [fetched].
- The review-loop wedge is being independently validated twice since August: Markleft ('how I review Claude's Markdown plans', Show HN 2026-08-13) and OzBrain (92-pt HN, 2026-08-21) whose founder pitches exactly 'diffing, versioning and audit log of what was changed, by what agent and why' as the paid product [fetched].
- Fresh anger on the Obsidian forum centers on the 1.13 rollout (late July-August): a reported vault wipe on upgrade, NAS vaults breaking in 1.13.4, a 'disable the new image system' backlash thread, Linux/iOS regressions — plus live sync-trust wounds ('fully synced' files silently missing final characters; files disappearing on macOS) [fetched].
- Browser-vault demand is alive in the window: the 'Obsidian for web' forum request has 254,435 views and its latest post is 2026-08-14 [fetched]; separately, Write.md's 107-pt HN launch (Aug 11) surfaced loud Electron fatigue among markdown-editor users [fetched].
- AI-protocol adjacency is trending on HN right now: 'Serve Markdown to AI Agents with Accept Headers' hit 175 points / 108 comments on 2026-08-26, and 'Markdown Database Pattern' (frontmatter-as-database) hit 44 points on 2026-08-27 [fetched].
- Pricing anger is concentrated on Notion, not Obsidian: Notion folded AI into a ~$20 Business tier, raised Business ~20% in 2026, and capped Free/Plus at 20 lifetime AI responses, with r/Notion calling it 'overpriced' and 'nearly doubled' [SS]; Obsidian pricing is stable at $4/mo Sync [SS].
- A resistance minority is articulate but small: 'Keep AI Out of Your (Obsidian) Vault' [SS], a 19-pt 'note app without AI' launch, a sandboxing demand ('an agent with write access to my files, and no way to send them anywhere'), and prompt-injection worries inside the accept-markdown thread [fetched] — the split is roughly enthusiasts-with-guardrails vs abstainers, and the guardrails ARE frontmatter's wedge.
- The no-new-format verdict held in the fresh window: a formally-specified 'successor to Markdown' (markleft-lang, Aug 7) sits at 2 GitHub stars [fetched], while Obsidian doubled down on plain Markdown with knap, an official Markdown templating engine (repo created 2026-08-21) [fetched].
- Reddit itself was unreachable by every tool available this session (JSON API returns a JS shell, pullpush.io explicitly refuses agent scraping, WebSearch cannot index reddit.com) — every Reddit-specific claim here is [SS] via secondary summaries; HN and forum.obsidian.md evidence is primary [fetched].

---

# GAP 2 — Fresh community demand since 2026-07-12

Research date: 2026-08-28. Fresh window: 2026-07-12 → 2026-08-28. Verification tiers: **[fetched]** = primary source opened this session (HN Algolia API, forum.obsidian.md Discourse JSON API, api.github.com, api.npmjs.org — all confirmed reachable by direct test); **[SS]** = WebSearch summary, unverified; **[inference]** = reasoning.

**Reachability note (LR#70 applied):** WebFetch is refused by this session's taint gate. Reddit is unreachable by every path tried: `reddit.com/*.json` returns a JS shell, `old.reddit.com` returns empty, `api.pullpush.io` explicitly refuses agent scraping ("does not provide free scraping resources for agents" — refusal respected, not circumvented), and Anthropic's search crawler is blocked from reddit.com (API error confirmed). **All Reddit-specific claims below are [SS].** Hacker News and the Obsidian forum were fully open via their JSON APIs, so the freshest primary community signal here is HN + forum.obsidian.md. GitHub API rate-limited near the end of the session (after all counts below were captured).

---

## 1. What people are angry about NOW (complaints since 2026-07-12)

**The center of gravity moved to the Obsidian 1.13 rollout.** From the forum's top-monthly list (views/posts as of 2026-08-28, all [fetched] from `https://forum.obsidian.md/top.json?period=monthly`):

- "Upgrade to Obsidian 1.13 delete the Vault and replace it by an empty vault" — 289 views, 10 posts, created 2026-08-01. A vault-wipe scare on a routine upgrade. https://forum.obsidian.md/t/116737 [fetched]
- "Opening vault from NAS stopped working with 1.13.4 network drive" — 467v/15p, 2026-08-01. https://forum.obsidian.md/t/116739 [fetched]
- "Add option to disable the new image system" — 249v/15p/15 likes, 2026-08-01 — a feature-request *against* a newly shipped feature; the classic churn complaint. https://forum.obsidian.md/t/116732 [fetched]
- "Desktop: Spellcheck is not initialized when opening a note" — 539v, 2026-08-02. https://forum.obsidian.md/t/116795 [fetched]
- Platform regressions: Linux font-settings crash (506v), 1.13.4 Wayland error (256v), Gnome breakage after 1.13.7 (238v/22p, 2026-08-14), iOS accent colors wrong (323v/18p), iPhone 17 Pro background crashes (89v). All July-31→Aug-14 threads. [fetched]

**Sync trust is still bleeding, in exactly frontmatter's register (silent corruption, not outage):**

- "'Fully synced' but the final 10–15 Korean characters are missing unless the file is manually saved" — 2026-07-23. Silent tail-loss under a green sync indicator. https://forum.obsidian.md/t/116380 [fetched]
- "Files and folders disappear from MacOS" — 347v/24p, 2026-08-10. https://forum.obsidian.md/t/117162 [fetched]
- "Removing Sync and Deleting Files in the event of Lost Device" — 2026-08-09, trust/blast-radius question. https://forum.obsidian.md/t/117123 [fetched]

**Workflow-gap complaints:** "Anyone else feel like there's no simple workflow for Tasks?" — 263v/11p, 2026-07-28. https://forum.obsidian.md/t/116578 [fetched]

**On HN, the fresh complaint themes are:** Electron fatigue in markdown editors (see Write.md below), "yet another notetaking app" fatigue ("The burden of proof is high given how many of these there are" — flippyhead on the Hubble thread [fetched]), and prompt-injection anxiety about agent-facing markdown (below). [fetched]

**Reddit [SS]:** No specific fresh r/ObsidianMD complaint thread could be opened or search-indexed this session. Secondary 2026 roundups describe r/Notion anger about AI pricing (§5) and a general "AI plugin ecosystem is fragmented across community developers with varying privacy approaches" framing (shadow.do roundup, https://www.shadow.do/blog/best-ai-plugins-for-obsidian-2026) [SS].

## 2. New tools people are discussing / switching to

**The one that matters — Hubble.md** (Ben Holmes, Astro core dev): "Open-source notetaking app for you and your agents" — **151 points / 81 comments, HN 2026-07-29** (https://news.ycombinator.com/item?id=49091730) [fetched]; repo `bholmesdev/hubble.md` at **1,441 stars**, created 2026-02-17, GitHub description "The best notepad for you and your agents" [fetched]. Author in-thread: "The scope has increased to more agent collaboration features this past month"; a commenter (firasd): "The dual interface from the start (React UI for humans and just editing .md for the agents with skills) is … probably how a lot of new software projects will work going forward." Counter-sentiment in the same thread: "All my agents need are plain .md files" (ernsheong) and "so, Obsidian?" (chaidhat) [fetched]. This is the closest living neighbor to frontmatter's positioning: browser-rendered human UI over agent-native md files.

**OzBrain** — "a shared brain for knowledge between agents and your team", **92 pts, 2026-08-21**, by dariusmonsef (COLOURlovers founder): a *hosted* llm-wiki where the founder "handle[s] the diffing, versioning and audit log of what was changed, by what agent and why" (his words in-thread). His stated segmentation from talking to 75 founders: two camps — those who want display/UX for their .md files, and those who "don't want to see the markdown, it is for my agents". https://news.ycombinator.com/item?id=49394827 [fetched]

**Write.md** — free open-source themeable macOS Markdown editor, **107 pts / 78 comments, 2026-08-11** (https://news.ycombinator.com/item?id=49258011) [fetched]. The thread became an Electron referendum: "Happy to keep my Mac Electron-free" (reaperducer); Tauri repeatedly recommended; Bear recommended as the native alternative. Relevant to frontmatter's packaging decision. [fetched]

**Screenpipe (YC S26)** — Launch HN "Record how you work and turn that into agents", 88 pts, 2026-07-23. https://news.ycombinator.com/item?id=49024620 [fetched]

**Agent-memory-on-markdown repos active in the window** (all [fetched] via GitHub API, stars as of 2026-08-28): `eugeniughelbur/obsidian-second-brain` **4,232 stars** (created 2026-03-24, pushed 2026-08-27) — "Persistent memory for Claude Code and 6 other CLI agents, stored as plain markdown in your Obsidian vault"; `huytieu/COG-second-brain` 1,134 stars (pushed 2026-08-25); `917Dhj/DeepPaperNote` 994 stars (pushed 2026-08-26); `Railly/agentfiles` 736 stars — edit AI agent files across 12 tools *from Obsidian* (pushed 2026-08-22).

**Obsidian's own new shipping (official, all in-window, [fetched] via GitHub API):** `obsidianmd/knap` — "The templating language for Markdown", an official template engine shared by Web Clipper + Importer, repo created **2026-08-21** (npm `knap` v0.2.1/0.2.2 published 2026-08-24, 447 downloads that first week); `obsidianmd/obsidian-headless` — headless Obsidian Sync/Publish CLI (`ob sync`), **12,075 npm downloads in the week 2026-08-21→27**, v0.0.14 2026-07-30; `obsidianmd/obsidian-workflows` created 2026-08-18. Note: knap is a *templating* engine (AST interpreter, no eval) — adjacent to, not overlapping, MDMAX's compile/degrade territory, but it shows Obsidian is now building official md infrastructure beyond the app [inference].

**Smaller fresh entrants (HN, [fetched] listings):** Mininote — "plain-text note taking without tracking or lock-in", 23 pts, Aug 14 (id=49300129); Writemark — dependency-free web component for inline Markdown editing, 53 pts, Jul 25 (id=49051130); Hyper-Markdown for knowledge graphs, 33 pts, Aug 8 (id=49226253); Marvelous — "a Markdown editor where every save is a Git commit", Jul 29 (id=49103749); Noteato — "Notion-like notes as local Markdown files", Jul 14 (id=48907934); OpenMarkdown — "a Markdown editor you and your agent co-edit", 7 pts, Jul 15 (id=48920800; releases repo 59 stars, created 2026-07-05, pushed 2026-08-28 [fetched]); SilverBullet praised organically as a switch destination in the Markdown-database thread ("very powerful ability to embed little queries … directly in a page" — jayknight) [fetched].

**Format-invention check:** `markleft-lang/markleft` — "a small, formally specified, ambiguity-free successor to Markdown", created 2026-08-07 — sits at **2 stars** [fetched]. The no-new-format verdict is holding in the wild [inference].

## 3. AI-in-notes sentiment — asking FOR access or resisting?

**Net: asking for it, loudly, with guardrail demands attached.** The demand side is now official and quantified:

- `kepano/obsidian-skills` (Obsidian CEO's official agent skills: Markdown, Bases, JSON Canvas, Obsidian CLI) — **47,418 stars** as of 2026-08-28, created 2026-01-02 [fetched via GitHub API]. (Third-party roundups still say "12,900+ stars" — stale [SS]; my count is primary.)
- Obsidian MCP npm demand, week 2026-08-21→27 [fetched via api.npmjs.org]: `obsidian-mcp-server` 9,559 + `obsidian-mcp` 5,137 + `mcp-obsidian` 1,461 = **16,157 downloads/week** across the three main packages.
- `obsidian-headless` at 12,075 downloads/week [fetched] — people running vault sync for agents without the desktop app.
- Fresh forum threads are *engineering* access, not debating it: "Obsidian (Windows) + Claude Code (WSL2) sharing one vault — best filesystem architecture?" (15 posts, 2026-07-13, https://forum.obsidian.md/t/116078); "MCP Connector. An MCP server that runs inside Obsidian" (2026-08-18, t/117465); "[Plugin] Token Usage — Live Claude Code token tracking in your Obsidian sidebar" (2026-07-31, t/116705); "Dispatch — The agentic ticket board" (2026-08-21, t/117575); "Rootr Sync — share one folder of your vault with your team (and with Claude/ChatGPT)" (2026-07-23, t/116378). All [fetched].
- Obsidian's official position [SS, consistent across sources]: no built-in AI; instead teach agents the open formats via Skills + CLI, per the manifesto's privacy framing (kepano CLI docs post 2026-02-12 [SS]; claudeskills.info guide [SS]; Boris Mann's writeup "productivity tools need community more than AI" [SS]).
- Hype-cycle marker [SS]: a July 2026 viral X post claimed "Anthropic's lead engineer accidentally leaked his personal Obsidian vault" (8,893 nodes) — Community Notes rated it misleading (explainx.ai fact-check, https://explainx.ai/blog/what-is-obsidian-vault-ai-agent-memory-graph-viral-2026). Vault-as-agent-memory is now big enough to attract fabricated virality [inference].

**The resistance camp — real, articulate, minority:**

- "Keep AI Out of Your (Obsidian) Vault" — ssp.sh essay arguing vault-AI is a dead end precisely *because* md sits open on disk (https://www.ssp.sh/brain/using-obsidian-with-ai/) [SS].
- "Why I'm building a note taking app without AI" — Docket, 19 pts / 16 comments, 2026-07-22 (https://news.ycombinator.com/item?id=49014798) [fetched; NB the thread derailed into vote-ring accusations, so comment sentiment is weak signal].
- "An agent with write access to my files, and no way to send them anywhere" — 2026-07-26 (id=49055579, manazir.dev) — the demand is not *no agents* but *sandboxed* agents [fetched]. 
- In the accept-markdown thread (§4): "Hm, interesting avenue for prompt injection" (a2ff6eeb0) and hnlmorg on invisible-to-humans md being an injection channel [fetched].
- The 257-pt "Note-Taking and Personal Knowledge Management" thread (2026-07-28, id=49084324) is notably AI-light: the top conversation is about learning anxiety, metadata burden, and retrieval failure ("how do I find such notes when I don't exactly remember what they were about" — galaxyLogic) — the core PKM pain is unchanged under the AI wave [fetched].

**Sentiment verdict [inference]:** the July-August split is not for-vs-against AI; it is *plain-files enthusiasts wiring agents in themselves* vs *a vocal minority demanding guardrails (sandboxing, audit, no exfiltration)*. Both halves are frontmatter's market: the first is distribution, the second is the review-loop/trust feature set.

## 4. Threads matching frontmatter's exact wedges (all posted since July)

**Review loop on md files — two independent builds in one month:**
- **Markleft** — "Show HN: How I review Claude's Markdown plans", 2026-08-13 (https://news.ycombinator.com/item?id=49284329; repo `martin-lysk/markleft`, 6 stars, created 2026-08-03 [fetched]). One real-user endorsement in-thread: "used it for the past days and it really improves iteration quality when working on plans and research" (hakonkrogh) [fetched].
- **OzBrain** (§2) monetizes exactly diff+versioning+audit of agent edits; first commenter question was "Who pays for the diffing and versioning?" [fetched].
- Adjacent: Marvelous ("every save is a Git commit", Jul 29) [fetched listing].

**Local Git-backed compile loop — asked for verbatim:** "Ask HN: Does a local, Git-backed LLM 'compiler' for personal notes make sense?" — 2026-07-19, author Chirag: "I still manage almost my entire life … in a single Markdown file. I've grown to severely distrust SaaS note-taking apps." (1 pt, 0 comments — articulated demand, zero audience) (https://news.ycombinator.com/item?id=48968447) [fetched].

**Browser vault:** the canonical "Obsidian for web" forum request — **254,435 views, 246 posts, created 2020-06-17, last post 2026-08-14** — still accumulating inside the fresh window (https://forum.obsidian.md/t/2049) [fetched]. Hubble ships a browser React UI as its human surface [fetched]. Write.md's thread shows the desktop alternative (native) is fought over on performance grounds [fetched].

**Sync trust:** §1's Korean-truncation and macOS-disappearing threads are live instances of "green sync light, corrupted data" — the exact failure class frontmatter's cert/verification story addresses [fetched + inference].

**AI protocol / serving md to agents:** "Serve Markdown to AI Agents with Accept Headers" — **175 pts / 108 comments, 2026-08-26**, acceptmarkdown.com (https://news.ycombinator.com/item?id=49454764) [fetched]. Sentiment: humans want it too ("hoping for this to get mainstream so that I can just view the pages without any ads, js and bloat" — kaangiray26), skeptics predict publisher resistance ("that is why this will not get popular" — qznc), injection worries (above). Plus "Markdown Database Pattern" — **44 pts, 2026-08-27**, wayofmarkdown.com — frontmatter-properties-as-database, with cxr's critique that it is "more like a YAML database", and rufuspollock defending on "ubiquity of markdown and markdown tooling" [fetched].

## 5. Pricing news and reactions since July

- **Notion — the anger is here [SS, consistent across ≥3 secondary sources]:** the standalone AI add-on was eliminated (May 2025) and full AI (Agents, AI Meeting Notes, Enterprise Search) folded into Business/Enterprise; Business raised roughly +20% in 2026 to ~$20/member; Free/Plus limited to **20 total AI responses** with no purchase option; custom agents metered at $10 per 1,000 credits. (costbench.com/software/ai-productivity/notion-ai/, automationatlas.io/answers/notion-pricing-explained-2026/, getpricepulse.com/blog/why-notion-raised-prices-2026-full-story.html, dev.to/kanta13jp1/notions-price-hike-in-2026-your-real-options-when-the-bill-goes-up-16jn) [all SS]. Reddit reaction [SS]: r/Notion threads call AI "overpriced" / "not worth it"; recurring lines per roundups: "Used to be free and now it's restricted", "The price nearly doubled"; common advice "stay on Plus and use ChatGPT free tier" (aitooldiscovery.com/guides/notion-ai-reddit) [SS]. Notion also acquired retrieval startup ZeroEntropy, announced 2026-07-24 (HN id=49039075, 6 pts) [fetched listing].
- **Obsidian — stable, no fresh pricing anger:** app free; Sync $4/mo annual ($5 monthly), Sync Plus $8/mo; 40% education/nonprofit discount; multiple 2026 pricing roundups report no increase (aitoolpick.org/blog/obsidian-sync-pricing-2026/, eesel.ai/blog/obsidian-pricing) [SS].
- **Craft [SS]:** Craft Plus promoted at $4.80/mo annual (regular $8/mo), unlocking "the Max AI model" — AI now a paid-tier differentiator (sollmannkann.com/project-management-and-notes/craft-vs-bear/) [SS]. No community backlash surfaced in this window.
- **Bear [SS]:** unchanged at $2.99/mo premium; no news found in the window.
- **Trend marker:** "Google Workspace will enable AI note-taking by default for some customers" — HN 2026-08-18 (id=49350432) [fetched listing]. Default-on AI in mainstream suites is the backdrop against which opt-in, guardrailed AI reads as a feature [inference].

## 6. Implications for frontmatter [inference]

1. **The review-loop wedge just got third-party validation and a clock.** Markleft (solo OSS) and OzBrain (funded founder, hosted) both shipped agent-edit review/audit for md inside four weeks. Frontmatter's differentiator is doing this *local-first with a verifiable cert* — the piece OzBrain's hosted model can't credibly offer and Markleft doesn't attempt.
2. **Hubble is the competitor to watch, not Obsidian.** Same dual-surface thesis, real HN traction, moving "to more agent collaboration features this past month" by the author's own words. Differentiation pressure lands on frontmatter's renderer quality + degradation cert + protocol story.
3. **Obsidian is arming everyone's agents (Skills, CLI, headless, knap) but still has no web app** — the 254k-view browser-vault request remains open. The browser wedge stands.
4. **1.13-style churn + silent sync corruption are the fresh trust openings**; "your files, verified, nothing silently lost" matches the exact complaints of the last six weeks.
5. **Notion's AI price-bundling backlash is a positioning gift:** "AI you asked for, at the file layer, not AI bundled into your bill."
6. **Reddit-native listening remains an open gap** — no tool this session could open reddit.com; if the founder wants literal r/ObsidianMD quotes, a human-browser pass (or logged-in scrape he runs himself) is the only clean path.

## Source ledger

**[fetched] primary (opened this session):** HN Algolia API items/searches — ids 49454764, 49258011, 49091730, 49394827, 49466988, 49284329, 48920800, 49084324, 49014798, 48968447, 49055579, 47211260 + date-filtered searches (obsidian/markdown/notion/PKM/note-taking/local-first since epoch 1783814400) via https://hn.algolia.com/api/v1/ · forum.obsidian.md Discourse JSON: /top.json?period=monthly, /search.json (claude, MCP, sync lost, web version), /t/2049.json · GitHub API: kepano/obsidian-skills, obsidianmd org repos (knap, obsidian-headless, obsidian-workflows, obsidian-releases listing), bholmesdev/hubble.md, eugeniughelbur/obsidian-second-brain, martin-lysk/markleft, markleft-lang/markleft, OpenMarkdown-dev, huytieu/COG-second-brain, 917Dhj/DeepPaperNote, Railly/agentfiles via https://api.github.com/ · npm downloads API: obsidian-headless, knap, obsidian-mcp-server, obsidian-mcp, mcp-obsidian via https://api.npmjs.org/downloads/point/last-week/.\n\n**[SS] secondary (WebSearch summaries, unopened):** dev.to Notion price-hike piece, costbench/automationatlas/getpricepulse/eesel Notion+Obsidian pricing pages, aitooldiscovery r/Notion roundup, shadow.do + systemsculpt AI-plugin roundups, ssp.sh Keep-AI-Out essay, explainx.ai viral-vault fact-check, claudeskills.info + kurtis-redux Medium on Obsidian Skills, Boris Mann on kepano's AI stance, releasebot.io Obsidian August release listing, sollmannkann Craft/Bear pricing.\n\n**Refused/unreachable this session:** WebFetch (session taint gate), reddit.com JSON, old.reddit.com, api.pullpush.io (explicit anti-agent refusal — respected).