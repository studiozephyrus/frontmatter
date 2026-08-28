### Verification sweep — method & scope (E1, GAP 1)
| Item | Value |
|---|---|
| Method | `curl` against `api.github.com` and `api.npmjs.org` only (allowlisted hosts) |
| Observation timestamp | 2026-08-28T11:47Z (verified via `date -u`) [measured] |
| npm window | last-week 2026-08-21 → 2026-08-27 |
| Outcome | 12 claim groups, ZERO UNREACHABLE; all derived ratios computed via `python3` |

### E1 — Claim-by-claim verdicts
| # | Subject | Verdict | Evidence |
|---|---|---|---|
| 1 | agents.md | CONFIRMED + new evidence | `agentsmd/agents.md`: 23,964★, created 2025-08-19T17:22:54Z, pushed 2026-08-25T16:41:55Z, open_issues 169, homepage https://agents.md, desc "AGENTS.md — a simple, open format for guiding coding agents" [fetched] |
| 1b | `openai/agents.md` | REDIRECT | Returns **Moved Permanently**; `curl -sL` resolves to `agentsmd/agents.md`. Org transfer out of `openai` into neutral `agentsmd` is [fetched]; the **Linux Foundation Agentic AI Foundation donation stays [SS]** — the API proves transfer, not donation |
| 1c | agents.md search pollution | — | `search/repositories?q=agents.md&sort=stars` total_count 4,580; top hits are unrelated string matches: VoltAgent/awesome-design-md 111,001★, google-labs-code/design.md 27,572★; the real standard is **#3 overall** [fetched] |
| 2 | obsidianmd/jsoncanvas | CONFIRMED | 3,669★, created 2024-02-28T17:20:36Z, pushed 2026-07-24T15:53:51Z, open_issues 28, homepage jsoncanvas.org [fetched] |
| 3 | obsidian-kanban | CONFIRMED + strengthened | `mgmeyers/obsidian-kanban` → Moved Permanently → **`community-archive/obsidian-kanban`**: 4,483★, created 2021-04-16, pushed 2026-03-06T17:40:01Z, open_issues **600**, archived=false. Last commit `5134c05ad` 2026-03-06 "Remove funding" (housekeeping). Latest release **2.0.51 published 2024-05-31T01:08:28Z = 26.9 months** [fetched] |
| 3b | Kanban citation nuance | ANTI-RECOMMENDATION | **Do NOT cite `pushed_at`** (looks 6-months-fresh; it is the funding-removal commit around archive transfer). Cite release date + 600 open issues + community-archive org |
| 4 | mdbase-dev/mdbase-spec | CONFIRMED (active but tiny) | 97★, created 2026-01-30, pushed 2026-08-16T08:16:59Z, open_issues 16, homepage mdbase.dev/spec/ [fetched] — consistent with standing "layer, don't compete" verdict |
| 5 | silverbulletmd/silverbullet | CONFIRMED (live rival) | 5,945★, pushed 2026-08-27T07:14:42Z, created 2022-02-16, open_issues 332, homepage silverbullet.md; desc "…personal productivity platform built on Markdown, turbo charged with the scripting power of Lua" [fetched] |
| 6 | estruyf/vscode-front-matter | CONFIRMED (name collision real) | 2,539★, created 2019-08-23, pushed 2026-08-21T14:20:26Z, homepage **frontmatter.codes**, desc "Front Matter is a CMS running straight in Visual Studio Code. Can be used with static site generators like Hugo, Jekyll, Hexo, NextJs, Gatsby, and many more..." [fetched] |
| 7 | inkeep/open-knowledge | **CHANGED 3,239 → 3,673** | +434 in 27 days ≈ **16.1★/day**; created 2026-06-03, pushed 2026-08-28 (same day), open_issues 30, homepage openknowledge.ai, desc "Beautiful, AI-native markdown IDE and LLM wiki". Release **v0.64.1 published 2026-08-27T23:26:23Z** [fetched] — v0.64.x at <3 months old; "the sweep's most competitively significant fetch" |
| 8 | jgm/djot + djot.js | CONFIRMED (alive, not thriving) | jgm/djot 2,033★, pushed 2026-07-01 (~8.5wk), 118 issues; jgm/djot.js 206★, pushed 2026-08-19 (9d), 30 issues [fetched] |
| 9 | vercel/streamdown | CONFIRMED, larger than assumed | 5,567★, created 2025-08-15T01:52:01Z, pushed 2026-08-26, homepage streamdown.ai, desc "A drop-in replacement for react-markdown, designed for AI-powered streaming." [fetched] — upgrades "AI output = markdown stream" from [SS] to [fetched] and *understated* |
| 10 | AnswerDotAI/llms-txt | CONFIRMED (vitals only) | 2,587★, created 2024-09-01, pushed 2026-08-26, homepage llmstxt.org [fetched]. The "llms.txt measurably failed" efficacy claims (Otterly, 300k-domain study) **remain [SS]** |

### E1 — npm weekly downloads (all [fetched], window 2026-08-21→27)
| Package | Downloads/week | Verdict vs prior |
|---|---|---|
| @djot/djot | **1,332** | CHANGED (~848 → 1,332) |
| djot (unscoped) | **package not found** | **REFUTED as a package name** — cite `@djot/djot` only |
| remark-parse | 50,948,894 | CHANGED (~44.6M → 50.9M) |
| micromark | 56,793,570 | [fetched], no prior |
| marked | 71,970,387 | [fetched] |
| markdown-it | 30,053,020 | [fetched] |
| unified | 54,815,190 | [fetched] |
| gray-matter | 8,989,723 | [fetched] |
| yjs | 8,428,245 | [fetched] |
| automerge (legacy) | 7,970 | [fetched] — legacy, misleading alone |
| @automerge/automerge | 46,348 | [fetched], added for fairness |
| streamdown | **6,551,190** | [fetched] — new hard evidence |
| mermaid | 15,313,390 | [fetched] |

### E1 — GitHub topic counts + computed ratios (RULE 6 work shown)
| Metric | Old → New | Delta |
|---|---|---|
| topic:agent-skills | 12,804 → **18,187** | +5,383 = **+42.0%** [fetched] |
| topic:claude-skill | 4,043 → **4,793** | +750 = **+18.6%** [fetched] |
| djot gap | 52,610× → **38,250×** | 50,948,894 ÷ 1,332 = 38,249.9 — headline CHANGED, *conclusion* (4+ orders of magnitude, no-new-format) fully CONFIRMED |
| CRDT gap | — | 8,428,245 ÷ 46,348 = **181.8×**; vs legacy automerge = misleading **1,057.5×** |
| inkeep velocity | — | 3,673 − 3,239 = 434 over 27 days = 16.1/day |
| kanban release age | — | 2026-08-28 − 2024-05-31 = **819 days = 26.9 months** |

### E1 — Mandatory doc corrections (actionable)
1. Replace "52,610×" with **38,250×** (or "~4.6 orders of magnitude"); name the package **@djot/djot**.
2. Replace 12,804 → **18,187**; 4,043 → **4,793**, dated 2026-08-28 (thesis doc line 108 named).
3. obsidian-kanban: cite community-archive org + release 2024-05-31 (26.9mo) + 600 open issues; **not** pushed_at.
4. agents.md now `agentsmd/agents.md`; org transfer citable [fetched]; LF donation still [SS].
5. streamdown paragraph upgrades [SS]→[fetched]: 6.55M/wk, 5,567★, ~1yr old.
6. inkeep/open-knowledge framing must carry ~16★/day + release 2026-08-27.

### E2 — Home surface, method caveat
- WebFetch refused by session taint gate; primary fetches limited to api.github.com + raw.githubusercontent.com [measured constraint]. Everything else [SS]. GitHub unauthenticated rate limit exhausted after core numbers — a handful of secondary star counts NOT fetched (stated gap).
- All plugin download numbers retrieved 2026-08-28 from `https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json`; **cumulative totals**, not weekly.

### E2 — Obsidian plugin download counts [fetched, 2026-08-28]
| Plugin (id) | Downloads | Role |
|---|---|---|
| templater-obsidian | **5,432,178** | largest adjacent behavior |
| dataview | **4,857,171** | de-facto dashboard engine |
| obsidian-tasks-plugin | **4,114,650** | tasks |
| calendar | **3,048,022** | daily/periodic |
| obsidian-kanban | **2,601,160** | boards |
| quickadd | **2,042,716** | capture |
| recent-files-obsidian | **1,170,981** | recency = top retrieval path |
| **homepage** (mirnovov) | **1,294,057** | the home-surface winner |
| obsidian-day-planner | 870,900 | — |
| periodic-notes | 747,418 | — |
| obsidian-memos | 416,874 | — |
| beautitab | **63,715** | best bespoke new-tab dashboard |
| new-tab-default-page | 49,317 | — |
| daily-notes-editor | 41,977 | — |
| hearth | 24,281 | "home screen — dashboard, launchpad, mission control" |
| project-browser | 19,478 | new tab → cards of files/folders |
| new-tab-plus | 14,176 | — |
| start-page | 10,700 | pinned + recent notes |
| banyan | 8,947 | card homepage, multi-tag filtering |
| dashboards | 2,097 | — |
| project-cockpit | 615 | — |
| mission-control | 250 | — |

- Corroboration: obsidianstats.com reports ~**1,291,115** for Homepage (vs 1,294,057 [fetched]) — sources give slightly different figures; also dates the plugin ~5 years old, all-time daily download record ~**3K on Jan 14, 2026**, still growing [SS].
- Key ratio [inference]: Homepage 1.29M ≈ **20× Beautitab 64K** — revealed preference is "home = a markdown note I control, rendered well and opened for me," not a hardcoded widget screen.

### E2 — Category flood counts [fetched, community-plugins.json]
| Metric | Value |
|---|---|
| Total community plugins | **7,039** |
| Match home/homepage/dashboard/start-page/landing-page/new-tab in name+description | **131** |
| Contain "dashboard" | **101** |
| Contain "homepage" | **11** |
| Carry "not been manually reviewed" marker | **115 of 131** → [inference] category submitted recently (2025–2026); demand is fresh, not legacy |

### E2 — Repo vitals [fetched]
| Repo | Numbers |
|---|---|
| mirnovov/obsidian-homepage | 710★, pushed 2026-06-03, open_issues 22; description confirms it overrides Obsidian's restore-most-recent default |
| logseq/logseq | 44,661★, pushed 2026-08-27 |
| kepano/obsidian-skills | **47,418★** ("teach your agent to use Obsidian CLI and open formats") |
| blacksmithgu/obsidian-dataview | 9,300★ |

### E2 — Homepage plugin feature teardown [fetched, README]
- Home can be **any note, canvas, workspace, or Base — or a random file, the graph, or a Daily/Periodic Note**.
- **Three old-tab policies: keep / replace last / remove all.**
- Choice of view mode; **run any command on open**; explicit support for "advanced landing pages" built with Dataview or Bases.

### E2 — Competitor home teardowns
| App | Evidence |
|---|---|
| Notion Home (2024) | Widgets: greeting, My Tasks, Upcoming Events, Recently Visited, Suggested for you, Templates, Learn, later Database-view widgets. Individually hideable via ••• **except Recents, which "is always a part of Home and cannot be hidden"** [SS]. Mobile adds Recents widget + AI shortcuts (chat, camera, voice) [SS] |
| Notion 3.0 | Sep 18, 2025 — recentered on AI Agents with per-user memory/instructions pages [SS] |
| **Notion 3.4** | **March 26, 2026** — first-class **Dashboards** (charts/KPIs/metrics), positioned as better than "a page of linked views"; 4-tab sidebar revamp (pages / agent chats / meetings / notifications), sections toggleable, **optional at launch**; presentation mode; dashboard view for databases. **Dashboards gated to Business & Enterprise plans** [SS notion.com/releases/2026-03-26] |
| Capacities | "every day starts with a blank daily note," but Day view wraps it: quick actions to create objects dated today, list of all objects with that date property, then the daily note below; daily notes have their own sortable/filterable database. Mobile explicitly capture-first + OS home-screen widgets [SS] |
| Craft | Home = all documents with Starred below; Craft 3 (Nov 2024) added tasks/collections/styling; daily notes get templates + Calendar view (Apple Reminders in Daily Note); Craft 3.1.6 (July 2025) navigation redesign [SS] |
| Bear / Ulysses | **No home at all.** Bear = three-pane notes list; Ulysses = Library (groups/projects) + sheets. Praised for exactly this ("Bear's very simplicity is why it beats Ulysses") [SS] — a real null hypothesis for single-stream writers |
| Obsidian core | Default = restore-most-recent state; Homepage exists explicitly to open a chosen surface "on startup, instead of the most recent one" [fetched] |

### E2 — Demand evidence
- Forum requests, old and unresolved in core [SS]: "Define a specific page as start page / landing page" (Nov 2021, /t/26983); "Starting Obsidian with Homepage note" (Jan 2022, /t/31039, explicitly for MOC users); "[feature] homepage on mobile" (Apr 2021, /t/17076, "I find myself lost when starting the application… open on an index.md"); "Creating a central homepage as a complete newbie" (/t/95951); "The all-encompassing Obsidian homepage template" (/t/30378).
- DIY dashboard content is a genre [SS]: thesweetsetup.com "Creating a Home Note Dashboard in Obsidian"; XDA Dataview live-dashboard pieces; Medium Canvas-homepage walkthroughs; Obsibrain "Your Vault's Command Center."
- Blank-first-launch pain [SS]: "Obsidian's hardest moment is minute one: an empty vault, a blinking cursor, and a plugin directory with 1,500 options. Most abandoned vaults die right there." / "No guided setup, no starter template, no 'here's what to do first.'"
- Notion template economy [SS]: Notion ~**100M users** (2024), revenue **$31M → $600M (2021→2025)**; template sellers typically **$500–$2K/month**, top decile **$10K+/month**, Easlo at **$239K/year**, Thomas Frank ~**$1M cumulative**.

### E2 — Daily-note-as-home: loved or abandoned
| Source | Finding |
|---|---|
| Roam | "the blank page problem in all its glory"; users "dropped into the deep water… only a daily-titled entry on a blank canvas"; "the sheer emptiness of the daily notes page"; standard community fix = **templates** ("a silver bullet… you always have something to write off of") [SS] |
| Logseq | Journal is "the system's beating heart." Migration-away discourse (2024–2026) blames **performance, sync reliability, mobile hangs, outdated Electron, "glacial development pace"** — **not** journal-first design; "note-keeping needs expanded past daily journaling" is a secondary driver only [SS]. Repo alive: 44,661★, pushed 2026-08-27 [fetched] |
| Obsidian | Voluntary high-volume adoption: "Open daily note on startup" is a first-class Homepage mode [fetched]; Periodic Notes 747,418 + Calendar 3,048,022 [fetched] |
| Verdict [inference] | Daily-note-first is a beloved **chosen** configuration and a risky **imposed default**. Borrow Capacities' softened version — as a block, not the landing |

### E2 — Anti-patterns (things NOT to build)
1. **Never displace work state.** VS Code Welcome tab produced years of "make it stop" issues — welcome page reappearing despite `workbench.startupEditor: none` [SS: microsoft/vscode#227327, #20739, #30997; dev.to "Five VS Code defaults you should turn off"]. frontmatter's persona overlaps VS Code users heavily.
2. **No unremovable widgets.** Notion's non-hideable Recents is a complaint magnet [SS].
3. **Tab displacement is already litigated** — Homepage ships three policies precisely because no single behavior satisfies users; it must be a setting [fetched].
4. **No feed-ification.** Notion's Home → AI suggestions → agent surfaces slide. No direct Notion-Home complaint corpus captured this session (searches surfaced neutral how-to-hide guides) — stated gap. AI-suggested content on home must be **strictly opt-in**; local-first markdown audience is the most feed-averse segment.
5. **Empty home = empty vault.** A recents grid with no recents / a never-used template row reproduces minute-one abandonment; home must be seeded.

### E2 — Three candidate designs + recommendation
| Candidate | Shape | Supporting | Contradicting |
|---|---|---|---|
| **A — Recents-grid home** (Craft/Notion-Home archetype) | Search bar top; Blank + Templates row; recents grid; pinned/starred; new-tab surface, optional on startup | Craft ships exactly this; Notion's most-used widgets are recents+tasks+templates; Recent Files 1.17M [fetched]; blank+templates is the documented blank-page cure; newbie forum threads ask for it | Bear/Ulysses thrive with no home; VS Code evidence says forced start surface gets disabled by this exact persona; a pure widget screen is **app-chrome, not markdown** — weakens "everything is a markdown file" and is least differentiated (Notion productized Dashboards in 3.4) |
| **B — Daily-note-first** (Logseq/Capacities) | Today's note as landing, wrapped with dated context + recents rail | Periodic Notes 747K, Calendar 3.05M, Day Planner 871K [fetched]; "open daily note on startup" is a first-class mode of the 1.29M Homepage plugin [fetched]; Capacities proves the softened version works | Roam blank-page abandonment is the best-documented home-surface failure in the research; frontmatter's segments are document/project-centric; Logseq's journal identity didn't prevent migration; imposing it violates the no-new-format/no-imposed-workflow thesis. **Right as a toggle/block, wrong as default** |
| **C — MAP.md as home** (file-native; **no competitor ships it**) | Home is a real markdown file (MAP.md / HOME.md) rendered by MDMAX with custom-render blocks: recents, search/command, templates, optional daily-note + tasks, plus user prose/links. Portable, diffable, git-committable; same entry-point doc an AI agent reads first | Revealed-preference winner in segment #1 (Homepage 1.29M = 20× Beautitab 64K [fetched]); community already hand-builds "advanced landing pages" in Dataview/Bases (README's own words [fetched]) with Dataview at 4.86M [fetched]; 2022 forum request ties start-page to MOC practice; kepano/obsidian-skills 47.4K★ [fetched] evidences agent-reads-your-vault convergence; dogfoods the renderer; only design no app in the 20-app matrix ships | Inherits blank-page problem for new users unless seeded (empty MAP.md = empty vault); Dataview-style dynamic blocks are among the most-cited complexity barriers for newcomers; action discoverability worse in a document than dedicated chrome unless render blocks are genuinely interactive; query blocks must stay readable as plain text on GitHub or portability breaks (degradation-certificate territory) |

**Recommendation: Architecture C, default-template A, pattern B as a block.**
1. MAP.md rendered by MDMAX, seeded on workspace creation from a starter template whose content IS Candidate A (search/command block, blank+templates row, recents-grid block, pinned links). New/empty workspaces land here by default; existing workspaces get home as the **new-tab surface with startup opt-in**.
2. Default startup for a non-empty workspace stays **restore-last-session**; home-on-startup is a setting with explicit old-tab policy (Homepage's three-policy design is the proven spec [fetched]).
3. Daily-note is **one template block** (today's note + today's edited files + due tasks), never the imposed landing.
4. Every block degrades to legible plain markdown outside frontmatter (links list, plain headings) — converts the home surface from a UI feature into part of the AI protocol.

### E3 — Team/docs-as-code buyer: review themes
| Tool | Praise | Complaints |
|---|---|---|
| **HackMD** [SS g2.com] | "cozy" editor, fast sharing/publishing, seamless real-time collab, book mode + slide mode, GitHub repo sync, self-hostable | not mobile-friendly, Android keyboard issues, "development resources are limited." **Meta-finding: G2 says not enough reviews for buying insight — essentially one verified review.** Community edition `hackmdio/codimd` last pushed 2025-10-02 (a year stale), 10,136★ [fetched]; fork **HedgeDoc active: 7,383★, pushed 2026-08-28** [fetched] |
| **GitBook** [SS Trustpilot/eesel/G2 ~176 reviews] | — | Dominant cluster = **reliability**: "frequent collaboration sync issues," "slow and buggy," **lost work**, breakage after updates, half-finished features, editor-to-published formatting differences, weak AI search, intrusive GitBook banner. Pricing outrage: repricing "denies access to updates to your site unless you upgrade to a paid plan that costs over $70/month per website"; reviewer charged **$384 Team plan (May 2025), auto-switched and charged $585 (June 2025) despite cancelling** |
| **Mintlify** [SS G2] | same-day support; **web editor lets non-technical colleagues contribute**; seamless GitHub sync; preview builds; local + live preview; AI search; custom CSS/JS + white-labeling | "after the first year, there was a drastic price hike, although they were willing to negotiate"; occasional docs-site downtime (reimbursed). Read: best-loved DX; **the complaint is the bill, not the product** |
| **Outline** [SS G2/Capterra] | **4.4/5 from 31 reviews**, predominantly small-business; Ease of Use 9.3, Knowledge Sharing 9.1; "best-looking interface among all open source alternatives" | [fetched] outline/outline#6802 (Apr–May 2024, 3 participants) requests a **one-time-payment lifetime license for self-hosters**, citing plane.so/one — small n, but primary evidence of one-time-license appetite relevant to frontmatter's non-subscription options |

### E3 — Pricing table (all [SS]; pricing pages could not be opened directly)
| Tool | Model | Numbers |
|---|---|---|
| HackMD | per-seat | Free; Prime Team **$8/member/mo monthly, $4/mo annual ($48/yr)**; earlier price point **$5** |
| GitBook | **per-site + per-user** | Premium **$65/site/mo + $12/user**; Ultimate **$249/site/mo + $12/user** (AI answers on Ultimate, **500/mo cap**); 5-person team on Premium = **$125/mo** |
| Mintlify | flat platform + seats/credits | Starter free (5,000 AI credits); **Pro $450/mo annual / $540/mo monthly** (10,000 credits); Enterprise custom. Earlier-2026 snapshot: **$20/mo per extra editor, $0.25/AI message overage**; 2025 snapshot: **Pro $150/mo** |
| Outline | flat cloud tiers | **$10/mo up to 10 users; $79/mo up to 100; $249/mo up to 200 — SSO included**; self-hosted free (license NOASSERTION/BSL-family, not OSI [fetched]) |
| Confluence Cloud | per-seat | **Standard $5.42/user/mo; Premium $10.44/user/mo** |
| Nuclino | per-seat | Starter **$6–8/user/mo**; Business **$10–12.50** |
| Slite | per-seat | **$8/user/mo** Standard (annual); **$20** Knowledge Suite (min 10 users); **free plan removed at June 2026 relaunch** |
| Obsidian | per-seat, optional | Commercial license **optional since 2025-02-20**, **$50/user/yr (~$4.17/mo)** for support/early access |

**CONTRADICTION:** Mintlify pricing showed **three mutually inconsistent snapshots** across 2025–2026 sources ($150/mo Pro; $20/seat add-ons; $450–540/mo Pro) — volatile; verify on mintlify.com/pricing before quoting.

### E3 — Churn evidence
- **Atlassian raises**: notified 2025-08-19, effective **2025-10-15** — Confluence **Standard +5%, Premium +7.5%, Enterprise +7.5–10%**, on a historical **12–18-month raise cadence**, justified by AI (Rovo) investment [SS, incl. Atlassian's own Fiscal-2026 Cloud Pricing notice PDF].
- **Exit tooling** [fetched 2026-08-28]: `Spenhouet/confluence-markdown-exporter` **529★, pushed 2026-08-17**; **77 repos** match "confluence markdown export"; **160 repos** match "notion export markdown"; `yannbolliger/notion-exporter` **188★**.
- **Where churners land** [fetched]: Outline **40,359★**; **Docmost 21,499★** (AGPL Confluence/Notion replacement, pushed 2026-08-27, repeatedly named "best self-hosted wiki in 2026" [SS]); Wiki.js **28,812★**; BookStack **19,005★**; AppFlowy **76,026★**; AFFiNE **71,968★**.
- **Notion push factor** [SS]: markdown export documented as lossy — database relations break, inline DBs become CSV snapshots, toggles flatten; lock-in complaint current, 2026.
- **Obsidian pull gap** [SS]: shared vaults support **max 20 collaborators, no live co-editing on the same file, every collaborator needs a paid Sync subscription**; Peerdraft fills the gap. Wave-2 team wedge out of the Obsidian segment is structurally open.
- **Reverse direction**: markdown→Confluence push tools (go-markdown2confluence, GitHub Actions) show docs-as-code teams publishing INTO Confluence for their org — a live two-system pain [SS].

### E3 — Docs-as-code market proxies
| Signal | Value |
|---|---|
| npm weekly [fetched, 2026-08-21→27] | `@docusaurus/core` **1,566,992**; `vitepress` **1,063,321**; `nextra` **214,554**; `mintlify` **170,884**; `docsify` **71,632**; `gitbook-cli` (abandoned OSS) **9,982** |
| GitHub stars [fetched 2026-08-28] | docusaurus **66,111**; mkdocs-material **27,340**; mkdocs **22,384** |
| Job postings (directional ONLY) | "**63%** of technical writing job postings in Q4 2025 listed Git (vs <10% in Q4 2022)" [SS gitdoc.ai]; "**72% of 1,247** remote technical-writer postings (Jun 2025–Mar 2026) required Git + ≥1 docs-as-code tool (Markdown, Docusaurus, MkDocs, Hugo)"; title drift to "Documentation Engineer" [SS]. **Both vendor blogs, no published methodology — directional, not citable.** Write the Docs 2024 salary survey surfaced no docs-as-code percentage (honest gap) |
| Money | Mintlify **$18M Series A led by a16z (Sep 2024), $21M total**; **$10M ARR end-2025, 10× from $1M end-2024, 150% NRR, >10,000 companies onboarded (vs ~1,000 late 2023), 20M devs reached annually** [SS Sacra]. GitBook est. **$3.9M revenue 2025, ~35 employees** [SS getlatka, low trust]; claims **2M+ users**. Mintlify outgrowing GitBook ~**2.5×** on revenue while 10×-ing |

### E3 — PART A verdict (the $5–8/seat Wave-2 thesis)
1. **Holds, with a fork.** Internal team-wiki buyer: $5–8/seat sits inside the demonstrated band (Confluence 5.42 / Nuclino 6–12.5 / Slite 8 / HackMD 4–8 / Obsidian-commercial ~4.17). **Attacked from below** by Outline flat tiers (~**$0.79–1.00 effective/seat**; ~$1/seat at $10/mo for 10 users) and free self-hosted Docmost — $5–8 must be justified by what self-hosting can't cheaply give: **zero-ops, guaranteed-lossless collaborative editing, AI protocol**.
2. **Published-docs buyer has repriced per-SITE, not per-seat.** If frontmatter ever sells publishing, **price the site, not the seat. Do NOT blend the two buyers into one plan.**
3. **Procurement unlock = SSO/SAML + SOC 2 artifacts + audit logs** [SS WorkOS/Scalekit/KnowledgeOwl]; "mid-market+ buyers expect SAML out of the box." Pricing pages weaponize this as the "SSO tax": GitBook gates AI+advanced at Ultimate; Mintlify gates AI at Pro/Enterprise; **Outline includes SSO in its cheapest $10/mo plan — the undercut precedent.** Evidence favors cheap-SSO early as switching trigger, gating only at enterprise tier.
4. **Named switching triggers**: Atlassian's recurring raises; GitBook's forced repricing + billing behavior; Mintlify's post-year-one hikes; Notion's lossy export/lock-in; GitBook's data-loss-grade editor bugs. Composite ownable story: *markdown files you can always leave with + an editor that provably never loses a keystroke (MDMAX degradation certificate) + SSO without the tax*.
5. **Fresh white space**: Mintlify's ladder now jumps **$0 → $450/mo** — documented gap for small teams priced out of Pro, and its own G2 reviews name the hike as the complaint.

### E3 — PART B: India / PPP evidence
| Signal | Value |
|---|---|
| Consumer app spend | **$345M in Q2 2026, +35% YoY** [SS TechCrunch 2026-07-31] |
| IAP revenue trajectory | **$520M (2021) → $1B+ (2025) → $1.25B projected (2026)** [SS] |
| Mix shift | Non-gaming = **68% of H1 2026 revenue** (vs **58%** three years earlier); AI + productivity leading; **ChatGPT + Claude ≈ 83% of India AI-app revenue in Q2**; Google One top-grossing app [SS] |
| Payments | Apple restored card payments for Apple Account purchases in India **July 2026, after a four-year hiatus** [SS TechCrunch 2026-07-06] |
| Developer base | Octoverse 2025 — India overtook the US as largest base of open-source contributors; **+5.2M new developers in 2025 (14% of all new GitHub accounts); 21.9M India vs 28M US; projected 57.5M by 2030** [SS] |
| **Category WTP** | **NOT FOUND — honest negative result.** No India-specific willingness-to-pay data for markdown/note/writing tools across six searches |
| Price-sensitivity instead | Notion has **no India regional pricing** (bills USD via US entity, no Indian GST invoice; ~**₹670–830/user/mo** equivalent); public parity demand — "Notion really needs to enable price parity for India. **$10/user/month** will not work for most startups in India" (Vaibhav Sisinty); grey-market resellers selling **"Notion Plus at $30/yr"** — leakage that only exists where list price exceeds local WTP [SS] |
| PPP precedents | JetBrains prices India in INR: IntelliJ IDEA Ultimate individual ~**₹4,499/yr (≈$54)**; **sources conflict** — another shows **₹1,043/mo**; exact figures unverified [SS] |
| Indie PPP cases (vendor-published, bias flag) | One creator **+15% total revenue** from enabling PPP; a course creator **+320% revenue over 7 months** (low-PPP countries were **6% of sales** before); vendor claim of "**20–70%** sales increase from lower-PPP regions" [SS]. Josh Comeau's specific numbers **not retrieved** (searched; not found — [SS] gap) |
| Payment mechanics | "international payment gateways lose **30–40% of Indian customers at the checkout page** when UPI and domestic card support aren't available" [SS PayU, vendor-biased]; UPI processes **20B+ transactions/month**; India SaaS projected **$50B ARR by 2030** [SS BVP] |
| Community | **No organized India-specific markdown/Obsidian community surfaced** (negative result). Global only: r/ObsidianMD **200k+ members**, Obsidian Discord **110k+** [SS]. r/developersIndia threads not retrievable — reddit under-indexed; coverage gap, **not** absence of demand |

### E3 — PART B verdict (India/PPP)
1. **DEFER building PPP for launch.** India macro is inflecting now, but **every WTP datapoint is consumer app-store, AI-subscription, IDE, or course revenue — zero category-specific evidence** that Indian individuals or teams pay for markdown editors/wikis at any price today.
2. Flip on **processor-level geo-pricing** (Paddle / Lemon Squeezy / ParityDeals toggle) on the **individual tier only**, at **~40–60% off** — near-zero engineering, reversible.
3. **UPI-capable checkout matters more than the discount** — a merchant-of-record supporting UPI/RuPay is the actual India decision at launch.
4. **Do NOT regional-price the future team/seat tier now**: no India team-seat WTP evidence; Notion's refusal to parity-price hasn't stopped its India usage growth; seat-tier PPP invites geo-arbitrage on multi-region teams. Revisit only when a Wave-2 team product exists and India signups are measurable.
5. Treat India at launch as **top-of-funnel** (21.9M-dev base, 5.2M new devs/yr) feeding the free/local-first tier — monetization follows the documented paid-conversion curve rather than leading it.

### Cross-source contradictions to preserve
| Item | Disagreement |
|---|---|
| Homepage plugin downloads | community-plugin-stats.json **1,294,057** [fetched] vs obsidianstats.com **~1,291,115** [SS] |
| Mintlify Pro price | **$150/mo** (2025) vs **$450/mo annual / $540 monthly** (latest) vs **$20/mo per extra editor + $0.25/AI msg overage** (earlier 2026) — three inconsistent [SS] snapshots |
| JetBrains India price | **₹4,499/yr** vs **₹1,043/mo** — sources conflict [SS] |
| djot gap ratio | Thesis headline **52,610×** vs re-measured **38,250×** [fetched] — number CHANGED, conclusion unchanged |
| obsidian-kanban freshness | `pushed_at` 2026-03-06 (looks fresh) vs last release 2024-05-31 (26.9 months) — metrics disagree; release date is the honest one |
| automerge citation | legacy `automerge` 7,970 → misleading **1,057×** vs modern `@automerge/automerge` 46,348 → correct **181.8×** |
| Logseq churn cause | Blamed on performance/sync/mobile/Electron/dev pace, **not** journal-first design — contradicts a naive "daily-note-first killed Logseq" reading [SS] |
| HackMD review base | Strong product love vs G2's "not enough reviews for buying insight — essentially one verified review" |

### LR#48 reconciliation — re-verified [measured] 2026-08-29
| Check | Result |
|---|---|
| This agent's tool use | 3 `Read` calls + 2 read-only `git status`/`git log` invocations. **Zero writes, zero commits, zero mutating commands.** |
| `git -C ~/.claude status --porcelain -- skills-src settings.json` | **18 entries** (10 modified, 8 untracked): settings.json, sgnk-pwa refs, sgnk-zs-docs, sgnk-pwa-ds, sgnk-framer-clone, sgnk-yt, `sgnk-handover/SKILL.md.bak-20260810T013353Z`. HEAD unchanged at `6e390828`. **None of these paths were touched by this agent** — pre-existing dirt. |
| `~/.sgnk` bin | ` M bin/sgnk-precompact.sh` — 1 modified file, matches the hook's "sgnk bin:1"; **not authored here** (this agent never wrote to `~/.sgnk`). |
| frontmatter HEAD | `57d0cfa` ("docs(plan): the plan, rewritten around the product + rendered to PDF") over `35b998d` ("docs(frontmatter): master plan v2.0 + full research corpus (5 rounds, 29 agents)"), vs session-start `9e84628`. **Both commits authored outside this agent's run** — flagged for orchestrator reconciliation, not authored here. |
| Note | `.env.example: Operation not permitted` in frontmatter status is the sandbox deny-list, not a repo fault. |