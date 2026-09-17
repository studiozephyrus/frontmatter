Everything below came from a response I actually received. Star counts are as the GitHub API returned them on 2026-09-16.

## 1. Agent memory products and protocols (GitHub API)

| Repo | Stars | Created | Pushed | Licence | Description (verbatim, trimmed) |
|---|---|---|---|---|---|
| `mem0ai/mem0` | 65,414 | 2023-06-20 | 2026-09-16 | Apache-2.0 | "The Memory Layer for AI Agents - Drop-in memory infrastructure for AI agents and apps. Context that persists. Built for production" |
| `getzep/graphiti` | 30,935 | 2024-08-08 | 2026-09-11 | Apache-2.0 | "Build Real-Time Knowledge Graphs for AI Agents" |
| `topoteretes/cognee` | 30,728 | 2023-08-16 | 2026-09-16 | Apache-2.0 | "Cognee is the open-source AI memory platform for agents. Give your AI agents persistent long-term memory across sessions" |
| `letta-ai/letta` | 24,764 | 2023-10-11 | 2026-09-10 | Apache-2.0 | "Platform for stateful agents: AI with advanced memory that can learn and self-improve over time." |
| `letta-ai/letta-code` | 3,355 | 2025-10-25 | 2026-09-16 | Apache-2.0 | "Stateful agents that are like people, with memory, identity, and the ability to learn and adapt" |
| `khoj-ai/khoj` | 37,364 | 2021-08-16 | 2026-08-02 | AGPL-3.0 | "Your AI second brain. Self-hostable." |
| `lfnovo/open-notebook` | 38,991 | 2024-10-21 | 2026-09-13 | MIT | "An Open Source implementation of Notebook LM with more flexibility and features" |
| `basicmachines-co/basic-memory` | 3,979 | 2024-12-02 | 2026-09-16 | AGPL-3.0 | "AI conversations that actually remember. Never re-explain your project to your AI again." |
| `thedotmack/claude-mem` | 94,029 | 2025-08-31 | 2026-09-16 | Apache-2.0 | "Persistent Context Across Sessions for Every Agent" |
| `DeusData/codebase-memory-mcp` | 43,518 | 2026-02-24 | 2026-09-16 | MIT | "High-performance code intelligence MCP server. Indexes codebases into a persistent knowledge graph" |
| `Gentleman-Programming/engram` | 6,646 | 2026-02-16 | 2026-09-16 | MIT | "Persistent memory system for AI coding agents. Agent-agnostic Go binary with SQLite + FTS5, MCP server" |

No repo named `MemGPT` appears at the top of that search. letta.com carries it as ancestry: "MemGPT: The LLM Operating System OCT 2023 The original work on virtual context management — where Letta began."

Caveat on the two outliers. `thedotmack/claude-mem` (94,029) and `DeusData/codebase-memory-mcp` (43,518) are ranked by star sort, not by relevance to a named product, and both are agent-harness plumbing rather than a memory company. Read them as evidence of demand volume, not of a competitor.

**What the three largest vendors sell.**

**mem0.ai** (opened, HTTP 200). Sells to developers: "Drop-in memory infrastructure for AI agents and apps." Pricing verbatim: Hobby "Free" (10,000 add requests/month, 1,000 retrieval requests/month, 1 project); Starter "$19 / month" (50,000 add, 5,000 retrieval); Pro "$249 / month" (500,000 add, 50,000 retrieval, graph memory, "Dream (Memory Consolidation)"); Enterprise "Custom". Compliance line: "HIPAA Ready SOC 2 Type I GDPR Ready". The site's own badge reads "Star 62,590", lower than the API's 65,414, so their number is cached.

**getzep.com** (opened, HTTP 200). Sells to enterprises: "Agent memory, at enterprise scale. Memory of users, the business, and work done. Managed, governed, and served at scale." Pricing verbatim: Flex "$125 / month billed monthly", "50,000 credits included. Then $25 / 10,000 credits", 5 projects, "5 Memory MCP Server seats"; Flex Plus "$375 / month billed monthly", 200,000 credits, "Then $75 / 40,000 credits"; Enterprise "Custom". Credit rule verbatim: "1 credit per Episode up to 350 bytes; +1 credit per additional 350 bytes (or part)" and "0 credits for retrieval, storage, threads, users, and graph storage."

**letta.com** (opened, HTTP 200). Positions as a research lab, not a tool vendor: "Letta is an AI research lab in San Francisco building machines that learn." Pricing (docs.letta.com/pricing): Free "$0 /month", "Limited agents"; Pro "$20 /month", "Up to 20 stateful agents"; API Plan "$20 /month", "Unlimited agents", "$0.10 / active agent / mo", "$0.00015 / sec tool execution"; Teams Pro "$20 /seat/month". Note their Feb 2026 research line: "Context Repositories: Git-based Memory ... A rebuild of how agent memory works, using programmatic context management and git-based versioning."

## 2. Markdown as agent memory

Sorted by stars across `obsidian claude`, `obsidian mcp`, `markdown memory agent`, `second brain AI`.

| Repo | Stars | Created | Markdown-as-store? |
|---|---|---|---|
| `kepano/obsidian-skills` | 48,440 | 2026-01-02 | Yes: "open formats including Markdown, Bases, JSON Canvas" |
| `khoj-ai/khoj` | 37,364 | 2021-08-16 | Partly (indexes docs) |
| `YishenTu/claudian` | 15,335 | 2025-12-05 | Yes, vault-embedded Claude Code |
| `AgriciDaniel/claude-obsidian` | 14,998 | 2026-04-07 | Yes: "Self-organizing AI second brain for Obsidian + Claude Code" |
| `EverMind-AI/EverOS` | 12,993 | 2025-10-28 | Yes, explicitly: "local-first, Markdown-native, user-owned" |
| `Gentleman-Programming/engram` | 6,646 | 2026-02-16 | No (SQLite + FTS5) |
| `brianpetro/obsidian-smart-connections` | 5,456 | 2022-12-26 | Yes (vault notes) |
| `breferrari/obsidian-mind` | 4,641 | 2026-02-28 | Yes: "self-organizing Obsidian vault that gives AI coding agents persistent memory" |
| `eugeniughelbur/obsidian-second-brain` | 4,473 | 2026-03-24 | Yes, explicitly: "stored as plain markdown in your Obsidian vault" |
| `MarkusPfundstein/mcp-obsidian` | 4,420 | 2024-11-29 | Yes (via Obsidian REST API) |

Below the top ten and directly on point: `basicmachines-co/basic-memory` (3,979, 2024-12-02, AGPL-3.0); `zilliztech/memsearch` (2,610, 2026-02-09, "backed by Markdown and Milvus"); `iwe-org/iwe` (1,645, 2024-09-20, "Markdown knowledge graph — LSP for your editor, CLI + MCP memory for your AI agents"); `tigerless-labs/agent-memory` (930, **created 2026-09-01**, "plain Markdown as the source of truth"); `okf-memory/okf-agent-memory` (680, **created 2026-09-05**, "Git-native persistent memory ... Implements Google OKF v0.2"); `mindmuxai/brain.md` (546, 2026-06-18).

The dates are the finding. Of the sixteen markdown-as-memory repos above, eleven were created in 2026, and two were created within the last three weeks.

## 3. Personal-AI products

| Product | Claim (verbatim) | User-owned files? | Price (verbatim) |
|---|---|---|---|
| limitless.ai | "Limitless has been acquired by Meta" | Export offered: "We just launched a feature to make it easy to export all of your data" | "You'll no longer need to pay a subscription, and existing customers get the Unlimited Plan for free." Pendant not sold since 2025-12-05 |
| rewind.ai | "Try every AI tool. Free to start right now." 400+ tools, 580+ models | No. Unrelated to the old recall product | "5,000 tokens/day, free forever"; "GPT-6, Claude, Veo + 520+ premium models from $5" |
| personal.ai | "The AI Memory Platform that remembers, connects, and evolves." | Not stated | No public price. "MODEL-4 is deployed on your own network under a single agreement covering deployment, licensing, and support — scoped to each operator." "Book a Carrier Briefing" |
| reflect.app | "Reflect builds you a second brain that you can reference anytime." | Encrypted, not files: "The contents of your notes are end-to-end encrypted ... Our export and API keeps your notes accessible" | /pricing returned HTTP 404 |
| get.mem.ai | "Your AI chief of staff." "Mem Agent builds a living picture of your tasks, projects, and goals" | No, hosted workspace | Free (25 messages, 25 notes/month); "Mem Plus $9 / month" |
| saner.ai | "AI Personal Assistant for ADHDers" | No | "Free $0 /month"; "Starter $8 /month"; "Standard $16 /month"; yearly "-20%" |

Two of these are effectively gone as personal knowledge stores. Limitless is inside Meta and sunsetting non-Pendant functionality, including Rewind, and left Brazil, China, the EU, Israel, South Korea, Turkey and the UK on 2025-12-05. rewind.ai now serves a completely different product.

## 4. Notebook-style AI over your documents

NotebookLM has been renamed. `notebooklm.google` redirects to `notebook.google`, and `support.google.com/notebooklm` redirects to `support.google.com/gemininotebook`. It is now **Gemini Notebook**.

What it does with documents, verbatim: "Gemini Notebook answers questions based on the information provided in your uploaded sources. If the answer isn't in the source material, it won't provide a response."

Limits, verbatim: "Starting on September 2, 2026, Gemini Notebook will have compute-based usage limits ... quota refreshes every 5 hours until you reach your weekly limit". Tiers: "Without a plan / Standard limits; AI Plus / Two times higher than standard limits; AI Pro / Four times higher than standard limits; AI Ultra / 5x or 20x higher than AI Pro".

Data handling on feedback, verbatim: "Retained for up to 3 years. Reviewed feedback, included content, and related data are retained for up to 3 years, disconnected from your Google Account." Workspace and Education users are excluded from human review and model training.

Microsoft and OpenAI equivalents: not opened.

## 5. The phrase "second brain"

buildingasecondbrain.com is Tiago Forte's business, footer "© Forte Labs, LLC". It sells courses, a membership, books, a Notion template and an app.

Prices verbatim: BASB Foundation "$499", "Access for the lifetime of the course". Membership "$269 per quarter OR $799 per year (saves $277)". Also verbatim: "I've charged between $25,000 and $50,000 to teach this system to elite professionals". Payment plans "through Klarna and Afterpay/Clearpay".

Trademark status: **not opened**. The USPTO search endpoint I tried returned HTTP 404, and no ® or ™ appeared next to "Building a Second Brain" on the pages I opened. Treat the phrase as an unresolved legal question, not a clear one. What is certain is that it is a strong commercial brand with an active course business and a named owner.

## 6. Funding, only from pages opened

| Company | Amount | Date | Investor | Source |
|---|---|---|---|---|
| Letta | "$10 million in seed money" at "a $70 million post-money valuation" | 2024-09-23 | "led by Felicis' Astasia Myers" | techcrunch.com |
| Mem0 | No amount on the page | No date | Lan Xuezhao, "Founding Partner": "We backed Mem0 since the earliest days even before YC ... We're thrilled to double down today". Angel list includes Thomas Dohmke, Olivier Pomel, Paul Copplestone, Dharmesh Shah, Philip Rathle (CTO, Neo4j) | mem0.ai/investors |
| Zep | No funding figure found | — | S&P Global Market Intelligence, April 2026, quoting Melissa Incera: "We can easily see Zep becoming a de facto partner in this layer of the enterprise agent stack." | getzep.com |

Letta also lists backers on its home page: "Backed by Jeff Dean, Clem Delangue, Cris Valenzuela, Jordan Tigani, Tristan Handy, Barry McCardel, Robert Nishihara, Sunflower Capital, Essence VC, and Felicis Ventures."

---

## A. Crowded, empty, or early?

**Early, and splitting into two markets that are not the same market.**

The infrastructure half is crowded and funded. Four repos above 24,000 stars, three founded 2023 to 2024, all with paid tiers and enterprise motions. That race is over for a small studio.

The half the founders care about, a durable personal store an agent reads and writes, is early. The evidence is the dates: of sixteen markdown-as-memory repos, eleven were created in 2026, two within three weeks of today, and the largest (`kepano/obsidian-skills`, 48,440 stars) was created 2026-01-02. Nine months old and already the most-starred thing in the category. That is a market forming, not one that has formed.

The consumer personal-AI half is not crowded, it is thinning. Limitless was acquired by Meta and is sunsetting features. rewind.ai is a different product now. personal.ai has left consumer pricing entirely for carrier deployments. reflect.app's pricing page 404s.

## B. Files the user owns, or someone else's database?

**Plain files the user owns:** the Obsidian cluster (`kepano/obsidian-skills`, `claudian`, `claude-obsidian`, `obsidian-mind`, `obsidian-second-brain`, `mcp-obsidian`), `EverOS` ("local-first, Markdown-native, user-owned"), `basic-memory`, `iwe`, `brain.md`, `tigerless-labs/agent-memory`, `okf-agent-memory` (git-native). All are open source, mostly MIT.

**Vendor database:** mem0, Zep (Konig, their own graph database service), cognee, Letta cloud, get.mem.ai, saner.ai, Gemini Notebook, personal.ai. Reflect is the in-between case, a vendor database that is end-to-end encrypted with an export and an API.

The split is clean and it maps onto money. Everything that charges keeps the data. Everything that keeps the data in your files is free and open source.

## C. What they charge, and for what

Three distinct models. Developer metering: mem0 $19 and $249 per month on add and retrieval request counts; Zep $125 and $375 per month on credits sized by bytes ingested, with retrieval free; Letta $20 per month plus $0.10 per active agent and $0.00015 per second of tool execution. Consumer subscription: mem.ai $9, saner.ai $8 and $16. Education: Forte Labs $499 for a course, $799 a year for membership, and $25,000 to $50,000 for corporate teaching.

Nobody in the list charges for the editor.

## D. What is missing that a markdown editor could provide

Four gaps, each supported by something opened above.

**1. Nobody sells the writing surface.** Every paid product sells storage, retrieval or teaching. The vendors charge per request, per credit or per seat on infrastructure; Forte Labs charges for the method. The place where a person actually reads and edits the file is free and open source in every case, which means it is also unowned.

**2. Ownership and capability do not currently come together.** Section B shows a hard split: the user-owned side has no revenue, the funded side has no files. A product that gives people their own markdown and charges for the editing experience sits in a gap nobody occupies.

**3. Review of what the agent wrote.** Zep's own 2026-09-02 post frames the risk: "One poisoned message, web page, or document can shape every later session that reads the same memory. Persistent memory makes prompt injection durable." Their answer is policy controls inside their database. Nobody opened here offers a human a per-span reading of what an agent changed in their own files. That is frontmatter's existing claim, and the market has now named the problem in its own words.

**4. Portability across agents is stated as a need, not solved by the file layer.** Zep on 2026-08-19: "A knowledge worker's agents don't share what they know: Claude and ChatGPT often can't reach company context, and the agents you build never see what Claude and ChatGPT learn." Their fix is a hosted MCP server with seats. A file on disk is the other answer to the same complaint, and it does not need seats.

One caution the founders should carry into the meeting. `kepano/obsidian-skills` reaching 48,440 stars in nine months means Obsidian is moving into exactly this position with the incumbent vault and the incumbent user base. The window is open, and it is open now rather than in a year.

**Not opened:** USPTO trademark records for "second brain" (endpoint 404); Microsoft and OpenAI notebook equivalents; reflect.app pricing (404); a Zep funding amount; a Mem0 funding amount or date; personal.ai list pricing; mem.ai tiers above Plus; the full saner.ai and Gemini Notebook plan grids beyond what is quoted.