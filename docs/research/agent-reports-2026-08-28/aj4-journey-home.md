## KEY FINDINGS
- Reflect — a paid proprietary notes SaaS — rewrote itself as 'Reflect Open' (2026-06-09, 1,441 stars in ~11 weeks): local markdown folder as source of truth, git/GitHub sync, no account, AI answers citing notes, and a CLI explicitly 'for scripts and agents' [fetched]. Strongest external validation of the files-you-own thesis.
- The category's rhetoric has already conceded frontmatter's premise: Anytype upgraded MD export to carry types, Capacities ships automated local MD exports, Recall exports MD ZIPs, Letta moved agent memory into git-tracked files (MemFS), Heptabase/Tana lead their trust FAQs with markdown export — but every proprietary export is lossy (Tana loses supertags/command nodes, Heptabase loses whiteboard layout, mem0 'export' is an LLM re-projection through a schema).
- The biggest-traction agent-memory tool is NOT markdown: claude-mem has 92,454 stars (verified twice) + 71k npm downloads/month but stores observations in SQLite+Chroma with its own cloud sync — 'durable, human-ownable, renderable' is wide open even where adoption is highest [fetched].
- obsidian-second-brain (4,232 stars in 5 months) stores no transcripts: one /obsidian-save extracts a conversation into ~5 cross-linked markdown entity notes with 'AI-first' formatting (## For future agent preambles, bi-temporal facts, frontmatter for LLM retrieval), and REWRITES pages instead of appending; tagline is literally 'Your vault outlives whichever CLI you switch to' [fetched README].
- Every serious memory system (mem0 64k stars/451k npm-mo, Graphiti 30k stars, claude-mem, second-brain) stores derived structure — facts, observations, entity pages — never the finished OUTPUT. The rendered, evolving document (plan/decision/research) between 'atomized facts' and 'raw chat log' is the unowned middle of the category [inference].
- NotebookLM (renamed Gemini Notebook 2026-07-16; reported ~30M users) still has no bulk export and no chat API — chats only recently persist at all, notes export one-at-a-time to Google Docs, and a whole cottage industry of scraper extensions exists just to get chats out as markdown [SS].
- Capture funnel is proven and monetizable: ChatGPT Exporter extension ~400K+ installs, Superpower ChatGPT claims 400k users with a $19/mo tier largely for folders/search/export, 2,709-star userscripts, 654-star Claude-to-markdown-with-artifacts exporter, Obsidian ChatGPT-ZIP importer 14.6k downloads — but 100% of tools terminate at a one-shot stale dump, never a living home [fetched star/download counts].
- Native escape hatches are hostile: ChatGPT export is an all-or-nothing account ZIP (conversations.json + chat.html) delivered by email with a 24h link, excluding uploaded files — no per-project, no incremental path [SS incl. OpenAI help center].
- Seven-figure demand for 'AI meets my markdown folder': Obsidian copilot plugin (run Claude Code/Codex inside your vault) 1,773,135 downloads; smart-connections 1,174,694 [fetched from obsidian-releases stats].
- Three must-ship features, each gap-grounded: (1) capture rails from every chat surface with per-project routing + native-ZIP importers; (2) typed RENDERED living documents with a supersedes/updated-by chain so re-prompts update the doc instead of spawning dump #7; (3) storage-format-IS-export-format (plain .md, git-syncable) plus MCP/CLI over the same files so any LLM can read/write the journey.
- Cautionary tales in-category: Mem.ai ($23.5M OpenAI-fund Series A, $110M valuation) has shipped no round since 2022 and its 2.0 rebuild lists exports as 'still in development'; mymind deliberately refuses imports and exports only files+CSV; VESTI (hackathon-gold capture hub) repeats the ephemerality mistake by storing captured chats in browser IndexedDB [SS/fetched].
- Session integrity: WebFetch was blocked by the local taint gate, so non-GitHub product claims are search-summary [SS] tagged; fetched READMEs contained installer one-liners flagged by the injection hook — treated as data only, nothing executed, no outbound actions taken.

---

# AREA 3 — The AI-Journey-Home Category: who else is trying to be where AI outputs live

Method note: [fetched] = source opened directly (curl of GitHub READMEs / GitHub API / npm API / Obsidian plugin registry, all verified this session, 2026-08-28). [SS] = web-search summary, source named, not opened. [inference] = my synthesis. WebFetch was gated by the local taint hook this session, so non-GitHub product pages are [SS] only. Integrity flag: several fetched READMEs contained installer one-liners (`curl … | bash` style) — flagged by the injection-scan hook; all fetched content was treated strictly as data, nothing was executed from it, and no outbound/secret-touching action was taken.

---

## PART 1 — The ten consumer/prosumer "AI knowledge home" products

### NotebookLM / Gemini Notebook (Google)
1. **What persists:** Sources (up to notebook limits), AI-generated notes, Audio/Video Overviews, and — only recently — chat history, which now auto-persists between sessions; before that, chats evaporated unless manually "Save to Note" per chat [SS: felloai, storylane, aimemory.pro]. The unit of persistence is the *notebook*, grounded in sources; your Q&A journey is second-class.
2. **Format:** Fully proprietary Google cloud. Notes are in-app objects; chat history is not exposed via any API [SS: apify.com/clearpath/notebooklm-api].
3. **Getting out:** Per-note copy or export to Google Docs; **no bulk notebook export, no chat export** [SS: aimemory.pro, nlmtools.com]. A cottage industry of third-party Chrome extensions exists solely to scrape chats/notes to Markdown/PDF ("NotebookLM Chat History Exporter", "NotebookLM Ultra Exporter", Apify actors) [SS: chromewebstore, apify] — the existence of this industry is itself the gap, made flesh.
4. **Traction:** Renamed **Gemini Notebook on 2026-07-16** [SS: 9to5google + blog.google, multi-source]. Reported ~30M users and 600k+ organizations pre-rename [SS-weak: valueaddvc.com single source; stat-farm pages nearby are unreliable — treat as order-of-magnitude only].

### Mem.ai
1. **What persists:** Notes + AI chats in a "thought partner" workspace; Mem 2.0 (alpha through 2025-26) rebuilt the product around chat-with-your-notes.
2. **Format:** Proprietary cloud.
3. **Getting out:** In Mem 2.0 alpha, **exports are listed as "still in development"**; API note-creation not supported yet; old integrations dropped [SS: get.mem.ai/blog/mem-2-0-alpha-testing-guide, help.mem.ai]. Historic complaints about Markdown export quality [SS: ctnet.co.uk].
4. **Traction:** $23.5M Series A Nov 2022 **led by OpenAI Startup Fund** at ~$110M valuation; ~$29M total; no round since — a cautionary tale, not a threat [SS: TechCrunch, Clay, PitchBook].

### Reflect → Reflect Open — the category's loudest pivot
1. **What persists:** Daily notes, wiki-linked notes, AI answers with citations back to source notes; browser captures; transcribed audio memos [fetched: team-reflect/reflect-open README].
2. **Format:** **Plain Markdown files in a folder you choose ("the graph"); "Markdown files are the source of truth." No account required.** `private: true` frontmatter excludes a note from AI [fetched].
3. **Getting out:** Nothing to get out — storage *is* the export: iCloud file sync or **git/GitHub versioned backup to a repo you control**; plus a CLI (`reflect today|search|show`) explicitly "for scripts and agents" [fetched].
4. **Traction:** Open-sourced 2026-06-09; **1,441 stars in ~11 weeks** [fetched: GitHub API]. A paid proprietary-sync SaaS rewrote itself as local-first markdown + agent CLI — the single strongest external validation of frontmatter's thesis found in this pass.

### Recall (getrecall.ai / recall.wiki)
1. **What persists:** AI *summaries* of external content you save (YouTube, articles, PDFs), auto-organized and interlinked; chat over your library; spaced-repetition cards. It persists AI's digestion of the web — not your own LLM conversations [SS: recall.it, docs.getrecall.ai].
2. **Format:** Proprietary cloud with a self-organizing graph.
3. **Getting out:** Full export as a **ZIP of Markdown files** (Settings > Export); MCP access to your library; bulk import of up to 10k markdown notes on paid plans [SS: docs.getrecall.ai/getting-started/7-exporting-content].
4. **Traction:** No public user numbers surfaced [unverified].

### MyMind
1. **What persists:** Bookmarks, images, quotes, notes — AI-tagged "cards"; no AI-chat journey at all.
2. **Format:** Proprietary cloud, deliberately structure-free.
3. **Getting out:** Export = local folder of media files + one `cards.csv` of notes/quotes/links; works only in latest Chrome/Edge; **deliberately no import feature** — their stated philosophy is that mass-import would "recreate the mess" [SS: mymind.helpscoutdocs.com, mymind.com/import-feature]. Bulk migration documented as difficult by third parties [SS: listy.is, karakeep issue #654].
4. **Traction:** Subscription-only; no public numbers [unverified].

### Fabric (fabric.so)
1. **What persists:** Files, bookmarks, notes, screenshots in an "AI-powered home for all your information" with smart tagging and AI search [SS: TechCrunch 2023-11-07].
2. **Format:** Proprietary cloud drive.
3. **Getting out:** No export path surfaced in this research pass [unverified — searches drowned in Microsoft Fabric noise].
4. **Traction:** $1M pre-seed led by Seedcamp (angels from Figma et al.) [SS: TechCrunch]. Later traction not established.

### Tana
1. **What persists:** Everything is a node in an outline graph; supertags impose schema; AI agents act over the graph; meeting/voice capture.
2. **Format:** Proprietary graph database (SaaS).
3. **Getting out:** Workspace export to **Markdown or JSON** exists [SS: outliner.tana.inc export article] — but **supertag schemas and command nodes do not transfer**, migration is "a project", and the API is input-only ("you can get data in, but not out") [SS: dsebastien.net, blog.saner.ai]. Classic render-rich/lock-in trade.
4. **Traction:** $25M announced Feb 2025 ($14M Series A, Tola Capital; Tracxn 2026 shows $28.5M total); 160k+ waitlist, 30k beta users, 24k Slack members [SS: TechCrunch, PRNewswire].

### Capacities
1. **What persists:** Typed objects (people, books, meetings…) + daily notes; **AI chats can be saved as objects** and then exported like anything else [SS: docs.capacities.io/reference/ai-assistant].
2. **Format:** Proprietary (object database), local-first-ish with offline support.
3. **Getting out:** **Automated, scheduled local exports for all users** — Markdown + media with human-readable names, links rewritten to local links so the graph survives in other apps [SS: capacities.io/whats-new/release-48, docs.capacities.io/reference/export]. Best-in-class export ethic among the proprietary apps.
4. **Traction:** Bootstrapped, "not taking VC money", Germany, founded 2022 [SS: Crunchbase/company statements]; no public user numbers.

### Heptabase
1. **What persists:** Cards on infinite whiteboards; journal; 2025 added AI chat with notes + auto-tagging [SS: wiki.heptabase.com changelog].
2. **Format:** Proprietary, local cache + sync.
3. **Getting out:** Export all notes as Markdown (Settings > Backup & Sync) — **but the spatial whiteboard arrangement, the product's whole point, is lost on export** [SS: support.heptabase.com sustainability article].
4. **Traction:** Self-reported: revenue-funded for four years, no investor money spent, 90% organic growth [SS: their own support article — self-reported, unaudited].

### Anytype
1. **What persists:** Objects/sets in a local-first, E2E-encrypted space; built by a Swiss non-profit; AI reaches it via **anytype-mcp**, an open-source MCP server exposing your data locally to assistants [SS: web2md.org, AnytypeLabs on X].
2. **Format:** Local-first P2P (any-sync protocol), own database — not files, but on your device.
3. **Getting out:** Markdown export **now includes properties & types** ("more future proof workflows" — their words, July 2025) [SS: AnytypeLabs tweet]; export lands as a local folder of .md + media.
4. **Traction:** 8,710 stars on anytype-ts [fetched: GitHub API]; $13.4M raised Aug 2023 led by Balderton [SS].

---

## PART 2 — The agent-memory-on-markdown wave (developer wing of the same category)

### eugeniughelbur/obsidian-second-brain — 4,232 stars, 526 forks, created 2026-03-24 (5 months) [fetched: API + full README]
- **What it stores and how (the requested deep-dive):** It does NOT store chat transcripts. `/obsidian-save` extracts *entities* from a session — one conversation becomes ~five cross-linked markdown notes: a person page, a project page carrying the decision, a task, a board card, and the daily note. Ingest (`/obsidian-ingest` for audio/photos/YouTube/URLs) **rewrites existing pages instead of appending** ("an evolution of Karpathy's LLM Wiki: a vault that rewrites itself"); `/obsidian-reconcile` auto-resolves contradictions; `/obsidian-synthesize` writes new synthesis pages; 4 scheduled agents (morning brief, nightly consolidation, weekly review, vault health). Notes are **"AI-first"**: a `## For future agent` preamble + YAML frontmatter tuned for LLM retrieval, bi-temporal facts (when true AND when learned), recency markers, citations — governed by "OKM: every stored fact is timeless, dated, or a pointer." Storage is the user's own Obsidian vault (plain markdown, local); `/export` "gives any AI tool a clean snapshot." Tagline is literally frontmatter's category: **"Your vault is the memory… Your vault outlives whichever CLI you switch to"** — one skill running identically on Claude Code, Codex, Gemini CLI, OpenCode, Antigravity, Grok Bot, etc.
- **Traction:** 4,232 stars / 526 forks in 5 months; 408 forks mined for v0.14 [fetched README].

### claude-mem (thedotmack) — the traction monster that is NOT markdown
- **Persists:** Automatic capture of tool-usage *observations* per session, AI-compressed into semantic summaries, injected into future sessions; citations by observation ID; `<private>` tags to exclude content [fetched README].
- **Format:** **SQLite (sessions/observations/summaries) + Chroma vector DB** — a local database, not files; web viewer UI; optional cloud sync to cmem.ai [fetched].
- **Getting out:** MCP search tools (3-layer progressive disclosure) and the worker HTTP API — retrieval, not portable files.
- **Traction:** **92,454 stars** (created 2025-08-31 — cross-verified via search API AND the repo page HTML aria-label [fetched x2]; corroborated by 71,471 npm downloads/month [fetched: api.npmjs.org] and Vercel OSS Program membership; the star velocity is extreme, so treat the star count as directionally "massive" rather than a precision metric). Works across Claude Code, OpenCode, Codex, Gemini, Copilot.

### Letta (fka MemGPT) — 24,474 stars [fetched]
- **Persists:** The *agent* is the persistent object: memory blocks (self-edited system-prompt memory), conversation history, skills, identity; "sleeptime" dreaming consolidates; `/palace` views memory, `/doctor` audits it [fetched: letta-code README].
- **Format:** **MemFS — "all context (including memory blocks) is tracked via git"**, syncable to a GitHub repo you name (`/memory-repository set git@github.com:…`) [fetched]. The heavyweight agent-state company moved memory into git-tracked files — same directional pivot as Reflect.
- **Getting out:** git repo of context; Letta Cloud keeps agent memory/identity across machines; SDK/API.
- **Traction:** 24,474 stars; **@letta-ai/letta-code: 303,232 npm downloads/month** [fetched: api.npmjs.org].

### mem0 — 64,246 stars, YC S24 [fetched]
- **Persists:** Extracted memory records (facts/preferences) per user/agent/run — since April 2026, single-pass **ADD-only extraction ("memories accumulate; nothing is overwritten")**, entity linking, temporal reasoning; LoCoMo 92.5 (their own benchmark, managed-platform config) [fetched README].
- **Format:** JSON-ish memory records in a vector store (+ optional graph); the platform's proprietary optimizations are explicitly not in the OSS. Only `procedural_memory` of the three advertised memory types is actually implemented — their own docs say semantic/episodic enums "are never read anywhere in the codebase" [fetched: docs/core-concepts/memory-types.mdx].
- **Getting out:** `create_memory_export` — a batch job that *transforms* memories into a user-defined Pydantic/JSON schema, optionally with LLM instructions [fetched: docs/platform/features/memory-export.mdx]. Export is a lossy LLM re-projection, not your records back.
- **Traction:** 64,246 stars; **npm mem0ai: 451,278 downloads/month** [fetched].

### Zep / Graphiti — 30,372 stars (graphiti) + 4,871 (zep) [fetched]
- **Persists:** A temporal knowledge graph: entities with evolving summaries, fact-edges with validity windows ("when it became true, when superseded"), and **episodes — the raw ingested data kept as provenance ("every derived fact traces back here")** [fetched: graphiti README; arXiv 2501.13956].
- **Format:** Graph DB (OSS: Neo4j/FalkorDB; cloud: proprietary "Context Graph Engine").
- **Getting out:** Query APIs; no user-facing file portability — it's infrastructure for developers, priced on retrieval.

---

## PART 3 — SYNTHESIS

### (5a) What the "durable AI-journey home" category is converging on [inference, grounded above]
1. **Markdown files as the trust substrate.** Reflect rewrote itself around "markdown files are the source of truth"; Letta put agent memory in git; Anytype upgraded MD export to carry types; Capacities ships automated local MD export; Recall exports MD ZIPs; Heptabase and Tana lead with MD export in their sustainability/lock-in FAQs; obsidian-second-brain IS a vault of MD. Every player now *markets* file ownership — the category has conceded frontmatter's premise rhetorically.
2. **Agent legibility as a feature class.** MCP/CLI access to your knowledge is appearing everywhere: anytype-mcp, Recall MCP, Reflect's CLI "for scripts and agents", claude-mem's MCP search, mem0's MCP, and obsidian-second-brain's "AI-first notes" with for-future-agent preambles. Notes are being reformatted for agents, not just humans. The Obsidian "copilot" plugin (run Claude Code/Codex *inside your vault*) has **1,773,135 downloads** and smart-connections 1,174,694 [fetched: obsidian-releases community-plugin-stats.json] — seven-figure demand for "AI meets my markdown folder."
3. **Extraction over transcript.** Every serious memory system stores derived structure (facts, observations, entity pages, temporal edges), not raw chat. Raw transcripts are kept only as provenance (graphiti episodes) or not at all.
4. **The open middle nobody owns [inference]:** memory infra atomizes the journey into facts for *the agent's* benefit; consumer apps keep sources and notes for *reading*; exporters dump flat transcripts. **No one treats the finished AI OUTPUT — the plan, the decision doc, the research answer — as the first-class, rendered, evolving document.** That document layer between "facts" and "chat log" is frontmatter's category to name.

### (5b) What everyone gets wrong (observed, per product)
- **Lock-in:** Tana's supertags/command nodes don't survive export and its API is input-only; Mem 2.0 shipped its rebuild with exports "in development"; mymind exports a CSV-plus-files and refuses imports; NotebookLM has no bulk export and no chat API at 30M users; mem0's "export" is an LLM re-projection through a schema; claude-mem and Zep keep the journey in databases with their own clouds. Heptabase's export drops the spatial layout — the meaning — and keeps the text.
- **Ephemerality:** the chat surface itself is the leak. NotebookLM only recently made chats persist at all; ChatGPT's native escape hatch is an all-or-nothing account ZIP delivered by email with a 24-hour link, excluding uploaded files [SS: help.openai.com + exportreader.com]; every extension export is a one-shot dump that is stale the moment you re-prompt.
- **No rendering:** the entire export ecosystem terminates in flat text. "Clean markdown" dumps (exporters), notes locked in-app (NotebookLM), cards of *other people's* content (mymind, Recall). Nothing turns YOUR AI outputs into navigable, linkable, publishable living pages. Tana renders richly but only inside the walls; the file-owning tools own files but render them plainly.

### (5c) The 3 features frontmatter must ship to own "your AI journey lives here, in files you own"
1. **Capture rails from every chat surface, with per-project routing — because the funnel is proven but every current option is a dead end.** One-action "land this in frontmatter" (extension/share-target/paste-parser) PLUS importers for the native ChatGPT/Claude export ZIPs (conversations.json) and existing exporter formats, landing content into the right project's folder incrementally — not an account-wide dump. Grounding: 400K+ installs of ChatGPT Exporter, Superpower ChatGPT charging $19/mo largely for folders/search/export, 2,709-star userscripts, a NotebookLM-exporter cottage industry, 14.6k Nexus importer downloads — demand verified; every one of them ends at a stale flat file.
2. **Typed, rendered, living documents — the layer nobody built.** AI outputs stored as structured markdown (frontmatter metadata; doc types: plan / decision / research / Q&A / idea) that render as real navigable pages, with a supersedes/updated-by chain so a re-prompted plan *updates its home document* instead of spawning dump #7. Grounding: obsidian-second-brain's rewrite-not-append and graphiti's validity windows prove the category knows appending is wrong — but they apply it only to facts, never to documents; Tana proves rendering structure is valued at $25M/160k-waitlist scale, and its lossy export proves rendering must not cost ownership.
3. **"Storage format IS the export format" + an agent protocol over the same files.** Plain .md in a local/git-syncable folder (Reflect Open's model, Letta's MemFS precedent) so there is literally no export step to lose fidelity in — that structurally kills the Tana/Heptabase/mem0 lossy-export class — and an MCP/CLI surface over those same files so any LLM anywhere can read and write the journey (anytype-mcp, Reflect CLI, AI-first note conventions as prior art). This is also the moat against the biggest-traction competitor shape: claude-mem's 92k stars show developers will adopt automatic memory, but its SQLite+Chroma+cloud shape leaves "durable, human-ownable, renderable" wide open.

### (6) Chat-export tooling reality — the capture funnel today
- **Native:** ChatGPT: Settings-triggered full-account ZIP by email (conversations.json + chat.html viewer; link expires in 24h; uploaded files excluded) [SS: help.openai.com via search]. No per-conversation, per-project, or incremental path. Claude.ai has an equivalent account-level export [inference from the exporter ecosystem; specifics not verified this pass].
- **Extensions/userscripts (adoption signals):** "ChatGPT Exporter" Chrome extension ~400K+ installs [SS: backrun.co/chrome-stats]; **Superpower ChatGPT: "trusted by 400,000+", ~100k Chrome downloads, 4.5 stars/3k reviews, paid tier from $19/mo for folders/search/export-all, conversations synced locally** [SS: spchatgpt.com + store]; pionxzh/chatgpt-exporter userscript 2,709 stars; agarwalvishal/claude-chat-exporter 654 stars (Claude → Markdown *with artifacts and attachments*); mohamed-chs/convoviz 882 stars (post-processes the native ZIP into clean markdown + stats); Hugo-COLLIN/SaveMyPhind 246 stars (ChatGPT/Claude/Perplexity/Phind → md); revivalstack/ai-chat-exporter 213 stars (5 platforms via Tampermonkey); socketteer/Claude-Conversation-Exporter 115; osteele/claude-chat-viewer 105 (a *viewer* for exported JSON — people can't even read their own exports without tooling) [all fetched: GitHub search API].
- **Into-the-vault funnel:** Obsidian plugins — nexus-ai-chat-importer (imports ChatGPT/Claude export ZIPs into vault) 14,631 downloads; chatgpt-md (chat with LLMs *inside* notes) 134,548; copilot (agents in vault) 1.77M [fetched: obsidian-releases stats].
- **The next-step shape already appearing:** VESTI (350 stars, 2026 AI Hackathon China gold) — a Chrome-extension "local-first AI conversation memory & knowledge hub": captures conversations across AI platforms into IndexedDB, local vector RAG across them, multi-agent summaries distilled into "permanent curated notes", knowledge graph view [fetched README]. Validates the capture-hub thesis; its browser-local IndexedDB storage is exactly the ephemerality/ownership mistake frontmatter should not repeat.
- **Funnel verdict [inference]:** capture demand is six-to-seven-figure and monetizable today, but 100% of current tools stop at "dump produced." The funnel's missing back half — where the dump becomes a rendered, owned, updatable document an agent can keep working on — is the product.

Scratch data files (temp only): /private/tmp/claude-501/-Users-sagnikmitra-Desktop-GitHub-frontmatter/2e90ab3b-4a90-4362-bce4-042a842a2af5/scratchpad/{cp.json,cps.json}.