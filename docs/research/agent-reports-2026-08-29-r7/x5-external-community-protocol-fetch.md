### Fresh community window — scope, method, reachability

- Research date 2026-08-28; fresh window 2026-07-12 → 2026-08-28 [fetched]
- Evidence tiers as defined in source: **[fetched]** = primary source opened this session (HN Algolia API, forum.obsidian.md Discourse JSON, api.github.com, api.npmjs.org, curl); **[SS]** = WebSearch summary, unverified; **[inference]** = reasoning
- WebFetch refused by session taint gate for the entire session in BOTH e7 and e8; primary fetches done via curl against allowlisted hosts (api.github.com authenticated, raw.githubusercontent.com, api.npmjs.org) [fetched]
- Reddit unreachable by every path tried: `reddit.com/*.json` returns a JS shell, `old.reddit.com` empty, `api.pullpush.io` explicitly refuses agent scraping ("does not provide free scraping resources for agents" — refusal respected, not circumvented), Anthropic's search crawler blocked from reddit.com [fetched]. **All Reddit-specific claims in e7 are [SS]** — but f1 later CAPTURED r/ObsidianMD top-month via RSS (see fetch sweep). GitHub API rate-limited near end of e7 session, after all counts captured.
- All npm figures = last-week downloads 2026-08-21 → 2026-08-27; all GitHub figures observed 2026-08-28 [fetched]

### Obsidian 1.13 rollout anger (all [fetched], forum.obsidian.md/top.json?period=monthly)

| Thread | Views/Posts | Created | URL |
|---|---|---|---|
| "Upgrade to Obsidian 1.13 delete the Vault and replace it by an empty vault" | 289v / 10p | 2026-08-01 | forum.obsidian.md/t/116737 |
| "Opening vault from NAS stopped working with 1.13.4 network drive" | 467v / 15p | 2026-08-01 | /t/116739 |
| "Add option to disable the new image system" | 249v / 15p / 15 likes | 2026-08-01 | /t/116732 |
| "Desktop: Spellcheck is not initialized when opening a note" | 539v | 2026-08-02 | /t/116795 |
| Linux font-settings crash | 506v | Jul31–Aug14 | — |
| 1.13.4 Wayland error | 256v | — | — |
| Gnome breakage after 1.13.7 | 238v / 22p | 2026-08-14 | — |
| iOS accent colors wrong | 323v / 18p | — | — |
| iPhone 17 Pro background crashes | 89v | — | — |
| "Anyone else feel like there's no simple workflow for Tasks?" | 263v / 11p | 2026-07-28 | /t/116578 |

### Sync-trust wounds — silent corruption, not outage [fetched]

- "'Fully synced' but the final 10–15 Korean characters are missing unless the file is manually saved" — 2026-07-23, /t/116380. Silent tail-loss under a green sync indicator.
- "Files and folders disappear from MacOS" — 347v / 24p, 2026-08-10, /t/117162
- "Removing Sync and Deleting Files in the event of Lost Device" — 2026-08-09, /t/117123 (trust/blast-radius)
- These are live instances of "green sync light, corrupted data" — the class frontmatter's cert/verification story addresses [fetched + inference]

### Direct competitor launched inside the window — Hubble.md [fetched]

- Ben Holmes (Astro core dev), "Open-source notetaking app for you and your agents"; GitHub description "The best notepad for you and your agents"
- HN: **151 points / 81 comments, 2026-07-29**, news.ycombinator.com/item?id=49091730
- Repo `bholmesdev/hubble.md` — **1,441 stars**, created 2026-02-17
- Author in-thread: "The scope has increased to more agent collaboration features this past month"
- firasd: "The dual interface from the start (React UI for humans and just editing .md for the agents with skills) is … probably how a lot of new software projects will work going forward."
- Counter-sentiment same thread: "All my agents need are plain .md files" (ernsheong); "so, Obsidian?" (chaidhat); "The burden of proof is high given how many of these there are" (flippyhead)
- Closest living neighbor to frontmatter positioning: browser-rendered human UI over agent-native md files [inference]

### Review-loop wedge — independently validated twice since August [fetched]

- **Markleft** — "Show HN: How I review Claude's Markdown plans", 2026-08-13, id=49284329; repo `martin-lysk/markleft`, **6 stars**, created 2026-08-03. In-thread user endorsement: "used it for the past days and it really improves iteration quality when working on plans and research" (hakonkrogh)
- **OzBrain** — "a shared brain for knowledge between agents and your team", **92 pts, 2026-08-21**, id=49394827, by dariusmonsef (COLOURlovers founder). Hosted llm-wiki; founder handles "the diffing, versioning and audit log of what was changed, by what agent and why" — his words in-thread. Segmentation from talking to **75 founders**: two camps — want display/UX for their .md files vs "don't want to see the markdown, it is for my agents". First commenter question: "Who pays for the diffing and versioning?"
- Adjacent: **Marvelous** — "a Markdown editor where every save is a Git commit", Jul 29, id=49103749

### Other fresh launches / entrants [fetched listings]

| Product | HN signal | Date / id | Note |
|---|---|---|---|
| Write.md | 107 pts / 78 comments | 2026-08-11, id=49258011 | Free OSS themeable macOS md editor; thread became Electron referendum — "Happy to keep my Mac Electron-free" (reaperducer); Tauri repeatedly recommended; Bear recommended as native alternative |
| Screenpipe (YC S26) | 88 pts | 2026-07-23, id=49024620 | "Record how you work and turn that into agents" |
| Mininote | 23 pts | Aug 14, id=49300129 | "plain-text note taking without tracking or lock-in" |
| Writemark | 53 pts | Jul 25, id=49051130 | dependency-free web component, inline Markdown editing |
| Hyper-Markdown | 33 pts | Aug 8, id=49226253 | knowledge graphs |
| Noteato | — | Jul 14, id=48907934 | "Notion-like notes as local Markdown files" |
| OpenMarkdown | 7 pts | Jul 15, id=48920800 | "a Markdown editor you and your agent co-edit"; releases repo **59 stars**, created 2026-07-05, pushed 2026-08-28 |
| SilverBullet | organic | — | praised as switch destination in Markdown-database thread — "very powerful ability to embed little queries … directly in a page" (jayknight) |
| "Ask HN: Does a local, Git-backed LLM 'compiler' for personal notes make sense?" | **1 pt, 0 comments** | 2026-07-19, id=48968447 | Author Chirag: "I still manage almost my entire life … in a single Markdown file. I've grown to severely distrust SaaS note-taking apps." Articulated demand, ZERO audience |

### Agent-access demand is mainstream, quantified [fetched]

- `kepano/obsidian-skills` (Obsidian CEO's official agent skills: Markdown, Bases, JSON Canvas, Obsidian CLI) — **47,418 stars**, created 2026-01-02. **Contradiction:** third-party roundups still cite "12,900+ stars" — stale [SS]; the 47,418 count is primary [fetched].
- Obsidian MCP npm, week 2026-08-21→27: `obsidian-mcp-server` **9,559** + `obsidian-mcp` **5,137** + `mcp-obsidian` **1,461** = **16,157 downloads/week**
- `obsidianmd/obsidian-headless` (headless Sync/Publish CLI, `ob sync`) — **12,075 npm downloads/week**, v0.0.14 on 2026-07-30
- `obsidianmd/knap` — "The templating language for Markdown", official template engine shared by Web Clipper + Importer, repo created **2026-08-21**; npm `knap` v0.2.1/0.2.2 published 2026-08-24, **447 downloads** first week. AST interpreter, no eval — adjacent to, not overlapping, MDMAX compile/degrade territory, but shows Obsidian building official md infrastructure beyond the app [inference]
- `obsidianmd/obsidian-workflows` created 2026-08-18
- Agent-memory-on-markdown repos: `eugeniughelbur/obsidian-second-brain` **4,232 stars** (created 2026-03-24, pushed 2026-08-27) — "Persistent memory for Claude Code and 6 other CLI agents, stored as plain markdown in your Obsidian vault"; `huytieu/COG-second-brain` **1,134 stars** (pushed 2026-08-25); `917Dhj/DeepPaperNote` **994 stars** (pushed 2026-08-26); `Railly/agentfiles` **736 stars** — edit AI agent files across 12 tools *from Obsidian* (pushed 2026-08-22)
- Forum threads engineering access, not debating it [fetched]: "Obsidian (Windows) + Claude Code (WSL2) sharing one vault — best filesystem architecture?" (15 posts, 2026-07-13, /t/116078); "MCP Connector. An MCP server that runs inside Obsidian" (2026-08-18, /t/117465); "[Plugin] Token Usage — Live Claude Code token tracking in your Obsidian sidebar" (2026-07-31, /t/116705); "Dispatch — The agentic ticket board" (2026-08-21, /t/117575); "Rootr Sync — share one folder of your vault with your team (and with Claude/ChatGPT)" (2026-07-23, /t/116378)
- Obsidian official position: no built-in AI; teach agents the open formats via Skills + CLI [SS, consistent across sources — kepano CLI docs post 2026-02-12, claudeskills.info guide, Boris Mann "productivity tools need community more than AI"]
- Hype marker [SS]: July 2026 viral X post claimed "Anthropic's lead engineer accidentally leaked his personal Obsidian vault" (**8,893 nodes**) — Community Notes rated it misleading (explainx.ai fact-check)

### Resistance camp — real, articulate, minority

- "Keep AI Out of Your (Obsidian) Vault" — ssp.sh essay: vault-AI is a dead end *precisely because* md sits open on disk [SS]
- "Why I'm building a note taking app without AI" — Docket, **19 pts / 16 comments**, 2026-07-22, id=49014798 [fetched; thread derailed into vote-ring accusations → comment sentiment is weak signal]
- "An agent with write access to my files, and no way to send them anywhere" — 2026-07-26, id=49055579, manazir.dev — demand is not *no agents* but *sandboxed* agents [fetched]
- Prompt-injection worries inside the accept-markdown thread: "Hm, interesting avenue for prompt injection" (a2ff6eeb0); hnlmorg on invisible-to-humans md as an injection channel [fetched]
- The **257-pt** "Note-Taking and Personal Knowledge Management" thread (2026-07-28, id=49084324) is notably AI-light: top conversation is learning anxiety, metadata burden, retrieval failure — "how do I find such notes when I don't exactly remember what they were about" (galaxyLogic). Core PKM pain unchanged under the AI wave [fetched]
- Sentiment verdict [inference]: the split is NOT for-vs-against AI; it is plain-files enthusiasts wiring agents in themselves vs a vocal minority demanding guardrails (sandboxing, audit, no exfiltration). Both halves are frontmatter's market.

### AI-protocol adjacency trending on HN right now [fetched]

- "Serve Markdown to AI Agents with Accept Headers" — **175 pts / 108 comments, 2026-08-26**, acceptmarkdown.com, id=49454764. Humans want it too: "hoping for this to get mainstream so that I can just view the pages without any ads, js and bloat" (kaangiray26). Skeptics predict publisher resistance: "that is why this will not get popular" (qznc)
- "Markdown Database Pattern" — **44 pts, 2026-08-27**, wayofmarkdown.com — frontmatter-properties-as-database. cxr's critique: it is "more like a YAML database". rufuspollock defends on "ubiquity of markdown and markdown tooling"

### No-new-format verdict held in the fresh window [fetched]

- `markleft-lang/markleft` — "a small, formally specified, ambiguity-free successor to Markdown", created 2026-08-07 — **2 stars**. No-new-format verdict holding in the wild [inference]
- Contrast: Obsidian doubled down on plain Markdown with official knap engine

### Browser-vault demand still live [fetched]

- Canonical "Obsidian for web" forum request /t/2049 — **254,435 views, 246 posts**, created 2020-06-17, **last post 2026-08-14** — still accumulating inside the fresh window
- Hubble ships a browser React UI as its human surface; Write.md thread shows the native-desktop alternative is fought over on performance grounds

### Pricing news since July

- **Notion — anger concentrated here** [SS, consistent across ≥3 secondary sources]: standalone AI add-on eliminated (May 2025); full AI (Agents, AI Meeting Notes, Enterprise Search) folded into Business/Enterprise; Business raised ~**+20% in 2026 to ~$20/member**; Free/Plus limited to **20 total AI responses** with no purchase option; custom agents metered at **$10 per 1,000 credits**. Sources: costbench.com, automationatlas.io, getpricepulse.com, dev.to/kanta13jp1. Reddit reaction [SS]: r/Notion calls AI "overpriced"/"not worth it"; recurring lines "Used to be free and now it's restricted", "The price nearly doubled"; common advice "stay on Plus and use ChatGPT free tier" (aitooldiscovery.com)
- Notion acquired retrieval startup **ZeroEntropy**, announced 2026-07-24 (HN id=49039075, 6 pts) [fetched listing]
- **Obsidian — stable, no fresh pricing anger** [SS in e7]: app free; Sync $4/mo annual ($5 monthly), Sync Plus $8/mo; 40% education/nonprofit discount → **upgraded to [fetched] by f1** (see fetch sweep)
- **Craft** [SS]: Craft Plus at $4.80/mo annual (regular $8/mo), unlocking "the Max AI model" — AI as paid-tier differentiator (sollmannkann.com). No backlash surfaced in window
- **Bear** [SS]: unchanged at $2.99/mo premium; no news in window
- Trend marker: "Google Workspace will enable AI note-taking by default for some customers" — HN 2026-08-18, id=49350432 [fetched listing]. Default-on AI in mainstream suites is the backdrop against which opt-in guardrailed AI reads as a feature [inference]

### PROTOCOL BUYER — the brutal headline

- **The standalone AI-protocol buyer does not exist yet.** Zero products found selling "agent-document compatibility guarantees" as such; zero budget lines named for it. Every llms.txt / AI-readability checker found — Rankability, MRS Digital, llmstxtvalidator.dev, IA-QA, an Apify auditor actor — is FREE, an SEO-agency lead magnet; Spindora gates at 3 free checks/week before signup [SS]. The wedge frontmatter would sell is currently given away as marketing collateral.
- What DOES exist: four live adjacent budget lines (docs-platform seats, CI quality gates, agent-tool usage, AEO monitoring), a 20-year-durable precedent, and sell-side payment rails built ahead of demand [inference]

### MCP layer: enormous distribution, ~zero direct monetization [fetched]

- `@modelcontextprotocol/sdk` — **51,758,066 downloads/week**
- `modelcontextprotocol/servers` — **89,926 stars**; `punkpeye/awesome-mcp-servers` (Glama founder) — **92,935 stars**
- Official **MCP Registry is free** — self-described "app store for MCP servers," API-freeze v0.1 since 2025-10-24, no payment layer anywhere
- Free wrappers at scale with $0 attached: `@upstash/context7-mcp` **918,346/wk**; `firecrawl-mcp` **43,091/wk**. Money is in the API behind the wrapper (Firecrawl, Exa, Browserbase subscriptions), not the wrapper [inference]

### Where agent money actually changes hands

| Vendor | Pricing | Adoption | Tag |
|---|---|---|---|
| Composio (ComposioHQ/composio, **29,914 stars** [fetched]) | Free (20K–100K calls/mo — sources conflict) / **Pro $29/mo** 200K calls, ~$0.299/1K overage / **$229/mo** 2M calls, ~$0.249/1K / Enterprise custom | `@composio/core` **670,923 dl/wk** [fetched] | pricing [SS] |
| Zapier MCP | Not separately priced — bundled into task quota. 1 successful MCP call = **2 tasks**; free 100 tasks ≈ **50 calls/mo**; paid from **$19.99/mo** (750 tasks) | — | [SS] |
| Apify | Pay-per-event (`Actor.charge()`), **80% rev share**, claimed **$1.2M/month** developer payouts (covers all actors, not MCP-only; MCP is a distribution channel onto the same catalog). Rental model retiring **Oct 2026** | — | [SS] |
| Smithery | claimed **$30/mo creator fee, $0 rev share** (mcpize.com — a competitor/aggregator, LOW confidence) | `@smithery/cli` only **7,821 dl/wk** [fetched] | [SS] |
| Glama | hosted MCP gateway **$0–80/mo**, creator monetization "coming soon" | — | [SS] |
| MCPize | promises 80% rev-share; embryonic | — | [SS] |

- Sub-answer: developers pay for agent **actions** (usage-metered), nobody pays for agent **legibility**. The protocol layer is free everywhere it appears.

### Sell-side rails precede buyers [fetched]

- Stripe AI repo (stripe/agent-toolkit → now **stripe/ai**, **1,772 stars**): remote MCP server at `mcp.stripe.com`, ships `@stripe/token-meter` + `@stripe/ai-sdk` for billing LLM/agent usage, plus agent-skills plugins for Claude Code/Codex/Cursor
- **x402** (x402-foundation/x402, **6,552 stars**): open payment standard with shipping `@x402/mcp` package — payment-gated tool calls
- No evidence of material document-access GMV moving over either [inference from absence]

### Docs platforms already SELL AI-renderability in-seat

| Platform | Anchor | Tag |
|---|---|---|
| Doctave | from **$59/mo**, markdown-in-git → CI deploy; sells "docs CI" as hosting-with-checks, not as a gate product | [SS] |
| GitBook | Premium **$65/site/mo + $12/user/mo**; Ultimate **$249/site/mo**; "LLM-ready docs", auto llms.txt/llms-full.txt, per-page .md outputs, docs MCP server, GEO guide, "Open in AI tool" buttons | [SS] |
| ReadMe | Startup **$99/mo** / Business **$399/mo** / Enterprise ~**$2,000/mo**; AI "Owlbert" suite gated to Business+ | [SS] |
| Mintlify | historic Pro **$150/mo** / Growth **$550/mo**; mid-2026 restructure; now reportedly Pro **~$450/mo annual ($540 monthly)** — **CONFLICTING across sources, flag before quoting**; actively in flux, re-verify at quote time | [SS] |

- Mintlify AI-renderability verified at primary source [fetched — raw.githubusercontent.com/mintlify/docs/main/ai/llmstxt.mdx and /ai/mintlify-mcp.mdx]: docs repo ships `ai/llmstxt.mdx` with frontmatter keywords `["llms.txt", "LLM indexing", "AEO", "GEO", "content discovery"]`; auto-hosted `llms.txt` + `llms-full.txt` (also at `/.well-known/llms.txt`); HTTP `Link` headers advertising llms.txt, an API catalog, an **MCP server card**, an **agent card** (`/.well-known/agent-card.json`), an **agent-skills index**; three productized MCP servers (Admin at mcp.mintlify.com with write/PR access, per-site Search MCP, cross-customer Index MCP at index.mintlify.com); a whole `agent-context/` package with SKILL.md files
- Docs-as-code CI motion measurable [fetched — api.npmjs.org]: ReadMe `rdme` CLI **151,681 dl/wk**; Mintlify CLIs **170,884 + 362,475/wk**
- Sub-answer: teams pay $59–550+/mo for docs where "AI can read this correctly" is a headline feature — the budget line exists but is owned by hosting platforms, which give AI-legibility away inside the seat. A standalone vendor must sell *to* these platforms or sell the part they can't do (cross-platform verification) [inference]

### Format-compatibility precedent — 20 years durable, iron split

**Free, sponsor-funded DATA layer (business models verified from READMEs [fetched]):**
- `caniemail` — **939 stars**, sponsored by a single vendor, **Resend**
- `browserslist` — **13,559 stars**, **195.4M npm dl/wk**; `caniuse-lite` — **199.7M/wk**; funded by Open Collective sponsors + Tidelift commercial-support subscription
- `caniuse` — **5,869 stars**, "## Sponsor" donation section

**Paid TESTING layer (all [SS]):**
- **Litmus** — Basic was $99/mo, Plus $199 → hiked to **$500/mo** (~151% increase, Basic eliminated), enterprise ~$5,000/yr+
- **Email on Acid** — **$74–134/mo**. Category has monetized ~20 years because a broken render costs a campaign
- **Chromatic** — free 5,000 snapshots → **$179/mo** (35K) → **$399/mo** (85K), **$0.008/extra snapshot**
- **Percy** (BrowserStack) — **$149–649/mo**
- **BrowserStack** Live from **$29–39/mo** ($30/user team); at 100 parallel sessions **$50–75k/yr**
- **Sauce Labs** **$39–199/mo** entry; at 100 parallel sessions **$80–120k/yr**
- **Nobody makes the markdown/agent analogy yet.** No product or essay found positioning "Litmus/Chromatic for markdown renderers or agent surfaces." The analogy slot is empty — simultaneously the opportunity and the warning [inference]

### Markdown QA — highest-adoption zero-revenue market in the study

- npm weekly downloads [all fetched]: `markdownlint` **3,111,881**; `markdownlint-cli2` **1,618,958**; `markdownlint-cli` **1,174,775**; `cspell` **1,620,679**; `remark-lint` **329,640**; `textlint` **225,435**
- Stars [fetched]: DavidAnson/markdownlint **6,306**; vale-cli/vale **6,038**; textlint **3,175**; vale-action **249**
- **No paid tier found anywhere in this stack.** Vale README [fetched]: "*I'm @jdkato, the sole developer of Vale*" — funded by GitHub Sponsors/Open Collective donations, with **Mintlify listed as a named sponsor** (a docs platform paying the markdown linter's rent — closest thing to an infra budget line the category has)
- **Cautionary tale:** Vale Server — the one direct attempt to sell prose/markdown linting as a product (paid desktop app, introduced 2019, jdkato.medium.com [SS]) — is gone: both `errata-ai/vale-server` and `jdkato/vale-server` return **404** [fetched]. Successors (Vale Studio; hosted "Vale CMS" at cms.vale.sh) show **no public pricing** [SS]
- Market-clearing price of markdown QA today: **~$0**

### Adjacent paid categories proving the buyer CAN pay

- **Langfuse** [fetched — raw.githubusercontent.com/langfuse/langfuse-docs/main/md-override/pricing.md]: Hobby free (50K units) / **Core $29/mo** / **Pro $199/mo** + **Teams add-on $300/mo** / **Enterprise $2,499/mo**; overage **$8/100K units**; self-claims "50,000+ companies"; repo **33,856 stars** [fetched]
- **LangSmith** Plus **$39/seat/mo** (10K base traces/seat) [SS]; **Braintrust** Pro **$249/mo** flat, unlimited users [SS]
- **SonarQube Cloud** Team from **$32/mo** (100K LOC, scaling to 1.9M) [SS]; **Snyk** from **$25/contributing dev/mo** annual, Team min 5 devs ⇒ **~$125/mo entry**, list often $52–98/dev/mo [SS]
- **Profound** (brand-side AEO monitoring, the marketing twin of agent-legibility): Lite ~**$499/mo** (3 seats, 24K responses analyzed), enterprise **$2,000+/mo**; AEO agency retainers **$2,000–8,000/mo** mid-market [SS]
- **Acrolinx** (enterprise content governance): custom, "typically starts in the low five figures annually" [SS]

### Price-anchor summary table (verbatim from e8)

| Budget line | Entry | Team/scale | Tag |
|---|---|---|---|
| CI quality gate (SonarQube/Snyk) | $25–32/mo | $125+/mo | [SS] |
| Render-diff CI (Chromatic/Percy) | free 5K snaps | $149–649/mo | [SS] |
| Email render testing (EoA/Litmus) | $74–99/mo | $500/mo–$5K/yr | [SS] |
| Docs hosting w/ AI-legibility | $59–99/mo | $249–550+/mo | [SS] |
| Agent observability | $29–39/mo | $199–2,499/mo | Langfuse [fetched], rest [SS] |
| Agent-tool usage (Composio/Zapier/Apify) | $19.99–29/mo | $229/mo + usage | [SS] |
| AEO monitoring (Profound + agencies) | ~$499/mo | $2K–8K/mo | [SS] |
| Enterprise content governance (Acrolinx) | — | low five figures/yr | [SS] |
| Markdown QA today (markdownlint/Vale) | $0 | $0 (donations) | [fetched] |

### Earliest sellable wrapper — evidence-ranked recommendations

1. **A render/agent-compat CI gate on the Chromatic motion, priced into the CI line.** Free for OSS/public repos (markdownlint installed base is the funnel: 3.1M weekly downloads with no owner monetizing it); paid **~$29–99/repo/mo** for private/team — deliberately between SonarQube's $32 and Chromatic's $179, usage-capped like Langfuse's $8/100K-unit overage. Sellable artifact is NOT "lint passed" but the **certificate** — "this document degrades gracefully across GitHub/Obsidian/chat-UI/agent-context targets" — exactly the mdmax `cert` shape already built. Precedent says the certificate/report is what Litmus and Chromatic customers actually buy [inference on fetched+SS anchors]
2. **Sell THROUGH platforms and agencies before selling to end teams.** Mintlify already sponsors Vale [fetched] — docs platforms fund markdown-QA infrastructure before any end team does; AEO agencies ($2–8K/mo retainers) need an evidence artifact to justify fees and currently hand out free llms.txt checks. An embeddable verification layer (OEM/API) rides both without needing the nonexistent end-buyer [inference]

### Explicit ANTI-recommendations (do NOT build)

- **Do NOT sell the protocol.** Zero demand rows exist for protocol-as-product. Every protocol-shaped artifact is free and its stewards intend it to stay free: MCP registry [fetched]; **AGENTS.md** (agentsmd/agents.md, **23,964 stars**, "a simple, open format") [fetched]; **llms.txt** (AnswerDotAI/llms-txt, **2,587 stars**) [fetched]. Monetization attaches to metering (Stripe/x402/Apify) or hosting/observability — never to the spec
- **Do NOT create a "markdown lint" budget line.** 10 years of evidence says nobody funds it; attach to SonarQube/Snyk/Chromatic lines already paying $25–179/mo [inference]
- **Do NOT invent a new format.** markleft at 2 stars; Obsidian doubling down on plain Markdown [fetched]

### Honesty ledger / what would change the verdict

- **Nobody pays today; this is a pre-demand market.** Strongest counter-signal to building for this buyer now: Vale Server's death, the $0-revenue markdownlint installed base, free llms.txt validators as far as the eye can see
- **Demand trigger to watch:** the first documented incident where an agent misreading a markdown document costs a company money publicly (email-market equivalent of a broken campaign), OR the first docs platform charging separately for AI-render verification. Either converts the free-lead-magnet layer into a Litmus-shaped market roughly overnight [inference]
- **Data reliability:** every dollar figure except Langfuse's is [SS]; the docs-pricing SERP is dominated by AI-generated comparison farms (ferndesk.com, docsio.co, bunnydesk.ai, checkthat.ai) — an ironic confirmation that answer-engine-mediated content is where the money is moving. Treat exact dollars as directionally right; spot-check before external quoting

### F1 elevated fetch sweep — [SS] → [fetched] upgrades (2026-08-28, main-loop curl, sandbox-disabled per founder grant)

All read-only GETs; pages treated as data, facts extracted only.

| Claim | Was | Now |
|---|---|---|
| Obsidian pricing | [SS] | **CONFIRMED [fetched]**: Sync **$4/user/mo annual ($5 monthly)**, Publish **$8/site/mo annual ($10 monthly)**, Commercial **$50/user/yr**, Catalyst **$25 one-time**, **40% edu/NPO discount** — obsidian.md/pricing |
| iA Writer prices — CONFLICT $19.99-vs-$49.99 iOS | conflicting [SS] | **RESOLVED [fetched]**: Mac **$49.99**, Windows **$29.99**, iPhone & iPad **$49.99** (App Store only), one-time per platform, **20% edu** — ia.net/writer/pricing |
| Typora model | [SS] | **Model CONFIRMED [fetched]**: one-time license, **3 devices**, **15-day trial**, no subscription. Exact price renders via store JS → **figure stays [SS]** — store.typora.io |
| Craft credits | [SS] | **CONFIRMED [fetched]**: **15 credits** free tier, **50 credits/month** paid — craft.do/pricing (the credit benchmark our Pro tier prices against) |
| HackMD | [SS] | **CONFIRMED [fetched]**: Free (up to **3 teammates**) / Prime **$5/seat/mo** / Enterprise — hackmd.io/pricing |
| Mintlify | conflicting [SS] | **RESTRUCTURED [fetched]**: Starter **$0** (5 editor seats, custom domain, **MCP server INCLUDED**) / Pro (JS-rendered figure, **unverified**) / Enterprise. "MCP server" is a **literal pricing-table row** — AI-legibility sold in-seat; primary-confirms the protocol-buyer verdict — mintlify.com/pricing |
| Front Matter CMS installs | unverifiable | **80,527 installs [fetched]** — VS Code Marketplace page (the name-collision senior user's real installed base) |
| arXiv 2411.10541 | authors uncorroborated | **VERIFIED [fetched]**: "Does Prompt Formatting Have Any Impact on LLM Performance?" — He, Rungta, Koleczek, Sekhon, Wang, Hasan (Microsoft) |
| arXiv 2501.15000 | authors uncorroborated | **VERIFIED [fetched]**: "MDEval: Evaluating and Enhancing Markdown Awareness in LLMs" — Chen, Liu, Shi, Chen, Zhao, Ren |
| r/ObsidianMD top-month | Reddit unreachable | **CAPTURED via RSS [fetched]**: 25 titles. Signals: **3 of top 25** = user-built dashboards/home pages; an **E2EE sync plugin launch**; **"You All Say the Graph Is Useless"** (community's own words); **1.13 release thread**; daily-notes scroll UX. Follow-up subreddits rate-limited (**429**) — respected, stopped |
| AGENTS.md → Linux Foundation | [SS] | **STILL [SS]**: openai.com **403** (bot-gate), linuxfoundation.org press path **404**. Org transfer to `agentsmd` IS [fetched]; the LF-donation naming needs one human click |
| Otterly .md-zero-citations | [SS] | **STILL [SS]**: challenge page on both attempts. One human click |

### Cross-source contradictions on record

- **Mintlify pricing disagrees with itself across the corpus:** e8 [SS] reports historic Pro $150/mo, Growth $550/mo, "now reportedly Pro ~$450/mo annual ($540 monthly)", flagged as conflicting; f1 [fetched] reports the live table as **Starter $0 / Pro (JS-rendered, unverified) / Enterprise**. Both recorded; they disagree. Mintlify's 2026 pricing is actively in flux — re-verify at quote time.
- **kepano/obsidian-skills star count:** 47,418 [fetched, this session] vs third-party roundups' "12,900+" [SS, stale]. They disagree; the fetched count wins.
- **Obsidian pricing tier naming:** e7 [SS] says "Sync Plus $8/mo"; f1 [fetched] says Publish $8/site/mo annual and does not name a "Sync Plus" tier at that price. Recorded as a discrepancy.
- **Composio free-tier call allowance:** "20K–100K tool calls/mo, sources conflict" [SS] — unresolved.
- **Reddit reachability:** e7 concluded Reddit unreachable by every path and tagged all Reddit claims [SS]; f1 then reached r/ObsidianMD top-month **via RSS**. The e7 conclusion is superseded for the RSS path (LR#70 pattern: a blocked path is one tool's policy, not the machine's reach).

### Implications carried forward [inference, from e7 §6]

1. Review-loop wedge got third-party validation and a clock — Markleft (solo OSS) and OzBrain (funded founder, hosted) both shipped agent-edit review/audit for md inside four weeks. Frontmatter's differentiator: local-first with a verifiable cert — the piece OzBrain's hosted model can't credibly offer and Markleft doesn't attempt
2. **Hubble is the competitor to watch, not Obsidian** — same dual-surface thesis, real HN traction, author moving "to more agent collaboration features this past month". Differentiation pressure lands on renderer quality + degradation cert + protocol story
3. Obsidian is arming everyone's agents (Skills, CLI, headless, knap) but **still has no web app** — the 254,435-view browser-vault request remains open. Browser wedge stands
4. 1.13-style churn + silent sync corruption are the fresh trust openings: "your files, verified, nothing silently lost" matches the exact complaints of the last six weeks
5. Notion's AI price-bundling backlash is a positioning gift: "AI you asked for, at the file layer, not AI bundled into your bill"
6. **Reddit-native listening remains an open gap** — a human-browser pass (or a logged-in scrape the founder runs himself) is the only clean path for literal r/ObsidianMD quotes beyond the RSS top-25

### Source ledger (e7)

- **[fetched] primary:** HN Algolia API items/searches — ids 49454764, 49258011, 49091730, 49394827, 49466988, 49284329, 48920800, 49084324, 49014798, 48968447, 49055579, 47211260 + date-filtered searches (obsidian/markdown/notion/PKM/note-taking/local-first since epoch **1783814400**) via hn.algolia.com/api/v1/ · forum.obsidian.md Discourse JSON: /top.json?period=monthly, /search.json (claude, MCP, sync lost, web version), /t/2049.json · GitHub API: kepano/obsidian-skills, obsidianmd org repos (knap, obsidian-headless, obsidian-workflows, obsidian-releases), bholmesdev/hubble.md, eugeniughelbur/obsidian-second-brain, martin-lysk/markleft, markleft-lang/markleft, OpenMarkdown-dev, huytieu/COG-second-brain, 917Dhj/DeepPaperNote, Railly/agentfiles · npm downloads API: obsidian-headless, knap, obsidian-mcp-server, obsidian-mcp, mcp-obsidian
- **[SS] secondary (unopened):** dev.to Notion price-hike; costbench/automationatlas/getpricepulse/eesel Notion+Obsidian pricing; aitooldiscovery r/Notion roundup; shadow.do + systemsculpt AI-plugin roundups (shadow.do/blog/best-ai-plugins-for-obsidian-2026 — "AI plugin ecosystem is fragmented across community developers with varying privacy approaches"); ssp.sh Keep-AI-Out essay; explainx.ai viral-vault fact-check; claudeskills.info + kurtis-redux Medium on Obsidian Skills; Boris Mann on kepano's AI stance; releasebot.io Obsidian August release listing; sollmannkann Craft/Bear pricing
- **Refused/unreachable:** WebFetch (session taint gate), reddit.com JSON, old.reddit.com, api.pullpush.io (explicit anti-agent refusal — respected)