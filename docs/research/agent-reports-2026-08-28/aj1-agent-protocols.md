## KEY FINDINGS
- No session-interchange standard exists anywhere: OpenAI exports a proprietary branching node-tree (mapping/current_node), Claude exports a different proprietary chat_messages shape, and every cross-tool exporter is a reverse-engineered browser extension [fetched]. The missing 'AI journey continuity' wire IS frontmatter's opening — build per-tool import adapters plus an open markdown-native session format.
- ACP (Agent Client Protocol) quietly became the bring-your-own-agent standard: its registry lists 40 agents including an Anthropic-coauthored Claude adapter, Codex, Gemini CLI (first-party), Cursor (first-party 'cursor-agent acp'), GitHub Copilot, Devin, and Goose; SDK does ~23.5M npm downloads/month; protocol v1 stable with monthly releases [fetched].
- Direct answer on ACP: yes, frontmatter should speak it — but sequenced after MCP, and only once frontmatter has a local/desktop surface, because ACP agents are local stdio subprocesses a pure web app cannot spawn. The obsidian-agent-client plugin (2,377 stars) pre-validates exactly this 'agents inside a markdown knowledge app' path, and ACP's session/load/resume/list is the only shipped multi-vendor session-continuity semantics found anywhere [fetched+inference].
- MCP's 2026-07-28 revision is a major breaking restructure: the protocol went stateless (initialize handshake and sessions removed), Roots/Sampling/Logging are deprecated, tasks moved to an extension, and list results became cacheable — the spec is consolidating around tools as the lowest common denominator [fetched changelog]. Frontmatter's MCP server should be tools-first, built on the official SDK (~209.7M npm downloads/month), targeting current stable versions.
- MCP registry is still pre-GA (preview 2025-09-08, API frozen at v0.1 since 2025-10-24, GA 'later' per README as of today); A2A hit v1.0.1 under the Linux Foundation with six active SDKs but no verifiable consumer production traffic — real spec, unproven usage [fetched].
- Verdict table: MCP = implement now (server); ACP = implement next (client, when local surface exists); A2A = ignore; AG-UI = watch; session interchange = build your own open format.

---

# AREA 2 — Agent Communication Protocols: the wire layer around documents

Research date: 2026-08-28 (UTC, verified). All [fetched] claims come from live GitHub API / raw.githubusercontent / api.npmjs.org pulls made today. [SS] = secondhand knowledge not opened today. [inference] = my reasoning on top of fetched facts.

---

## 1. MCP — Model Context Protocol

**Version cadence** [fetched — schema/ and docs/specification/ dirs of modelcontextprotocol/modelcontextprotocol]: five published revisions plus a draft: 2024-11-05 → 2025-03-26 (~4.7 mo) → 2025-06-18 (~2.7 mo) → 2025-11-25 (~5.2 mo) → 2026-07-28 (~8.1 mo). Cadence is roughly two revisions a year and slowing as it matures. Spec repo: 9,072 stars, pushed today.

**What changed, in plain language** [fetched — both changelogs opened]:
- **2025-11-25**: icons on tools/resources/prompts, OpenID Connect discovery, URL-mode elicitation (server can hand the user a link to complete something), tool calling inside sampling, experimental "tasks" (long-running work you poll), formal governance (working groups, SDK tiers).
- **2026-07-28 is a major break**: MCP became **stateless**. The initialize handshake and protocol sessions are gone; every request self-describes its version and capabilities. Server-initiated requests (sampling, elicitation, roots) are replaced by a "the server answers: I need more input, retry with it" pattern (MRTR). Tasks moved out of core into an extension. And three whole features — **Roots, Sampling, and Logging — are deprecated** with migration advice like "integrate directly with LLM provider APIs instead of Sampling."
- **Resources vs Tools semantics**: Resources survive but got reshaped: `resources/subscribe` was removed in favor of one long-lived `subscriptions/listen` stream, and all list/read results now carry required cache fields (`ttlMs`, `cacheScope`). Tools gained deterministic ordering guidance specifically to improve LLM prompt-cache hits. [inference] The direction of travel is unambiguous: the spec is being optimized around the features hosts actually use — tools first — and pruning the client-side features that never got adopted. Practical rule for anyone shipping an MCP server: treat **tools as the lowest common denominator**, expose resources as a bonus. (Host support for resources lagging tools is [SS], but the deprecations themselves are the spec's own admission.)

**Registry state** [fetched — modelcontextprotocol/registry README + repo meta]: launched in preview 2025-09-08, API freeze at v0.1 announced 2025-10-24, and the README still says GA "will follow later" — no GA announcement as of today, though the repo is active (pushed 2026-08-26, 7,197 stars). It is positioned as "an app store for MCP servers" feeding subregistries. [inference] Discovery in practice still happens through per-client marketplaces; the registry is real but pre-GA.

**Adoption scale** [fetched — api.npmjs.org, last-month downloads on 2026-08-28]: `@modelcontextprotocol/sdk` = **209,674,967 downloads/month**. Caveat: npm counts include CI and transitive installs, but the order of magnitude settles the question — MCP is the default wire for "app exposes capabilities to an AI host."

---

## 2. A2A — Agent2Agent (Google → Linux Foundation)

**Spec state** [fetched — a2aproject/A2A repo, releases, README]: v1.0.0 shipped 2026-03-12, v1.0.1 on 2026-05-28. 25,529 stars, homepage a2a-protocol.org, Linux Foundation packaging (the v1.0 release notes literally include "Add LF prefix to the package"). v1.0 was a large breaking cleanup: separated the application protocol from transport bindings (JSON-RPC / gRPC / REST), modernized OAuth (removed implicit/password flows, added device code + PKCE), added `tasks/list` with filtering/pagination, multi-tenancy on gRPC. Agent Cards remain the discovery unit (an agent publishes a card describing capabilities and auth; an "extended agent card" moved under AgentCapabilities in v1.0).

**Adoption reality vs press** [fetched org listing + npm]: the machinery is genuinely alive — six SDKs (python 2,110 stars, js 596, java 480, go 443, dotnet 256, rust 68) all pushed within the last week, plus a test-compatibility kit, an inspector, a gateway, and a DeepLearning.AI course co-taught with Google Cloud and IBM. `@a2a-js/sdk` shows 7,922,995 npm downloads/month (same transitive-install caveat). What I could NOT verify anywhere in this research: consumer-facing products actually routing user traffic over A2A. Its center of gravity is enterprise agent meshes and vendor announcements (Microsoft, SAP, Salesforce et al. — [SS]). [inference] Real spec, real v1.0, real SDK investment; production traffic remains the unproven claim.

**Naming collision note** [SS]: IBM/BeeAI's "Agent Communication Protocol" was also abbreviated ACP and was folded into the A2A orbit under the Linux Foundation in 2025. The living ACP today is Zed's Agent Client Protocol (next section). Do not confuse the two when reading older articles.

---

## 3. ACP — Agent Client Protocol (the direct question)

**Where it lives now**: the repo moved out of zed-industries into its own org: `agentclientprotocol/agent-client-protocol` [fetched — 4,092 stars, pushed today; the old zed-industries path 404s on the API]. Protocol version **1 is stable**; releases are monthly-ish (v1.5.0 2026-07-20, v1.6.0 2026-07-21, v1.7.0 2026-08-20), with a schema v2.0.0-alpha.3 in progress. Five official SDKs: TypeScript (`@agentclientprotocol/sdk`), Rust, Python, Java, Kotlin. Apache 2.0, no CLA.

**What it standardizes** [fetched — extracted the wire methods from schema/v1/schema.json]: JSON-RPC between a *client* (an editor or any interactive host) and a *coding agent* (a local subprocess, typically launched via npx or a binary, speaking over stdio). The method surface: `session/new`, `session/load`, `session/resume`, `session/list`, `session/close`, `session/delete`, `session/prompt`, `session/cancel`, `session/update` (streamed progress: message chunks, plans, tool calls), `session/request_permission` (the agent must ask before dangerous actions), `session/set_mode`, `session/set_config_option`, plus client-provided `fs/read_text_file`, `fs/write_text_file`, and a full `terminal/*` lifecycle. Note what that list contains: **a persistent session model with load/resume/list** — durable agent sessions are first-class in the protocol.

**Who implements it** [fetched — the agentclientprotocol/registry repo, updated hourly by CI]: the registry holds **40 agent entries**, and the roster is essentially every major coding agent: `claude-acp` (authors field: "Anthropic, Zed Industries, JetBrains" — Anthropic co-authors its own adapter), `codex-acp`, `gemini` (Gemini CLI ships first-party ACP — verified in google-gemini/gemini-cli source: packages/cli/src/acp/*), `cursor` (first-party `cursor-agent acp` subcommand, documented at cursor.com/docs/cli/acp), `github-copilot`, `github-copilot-cli`, `cline`, `goose`, `devin`, `junie` (JetBrains), `amp-acp`, `antigravity-acp`, `opencode`, `qwen-code`, `kimi`, `mistral-vibe`, `grok-build`, `factory-droid`, `poolside`, and more. Client side: Zed, VS Code extension (vscode-acp, 368 stars), Emacs (acp.el), a headless CLI client (openclaw/acpx, 3,183 stars), and — most relevant — **obsidian-agent-client (2,377 stars): "Bring AI agents into Obsidian via ACP, such as Claude Code, Codex and Gemini CLI."** npm downloads for the SDK: **23,488,631/month** [fetched] — about 1/9th of MCP's, an order of magnitude beyond niche.

**Should frontmatter speak ACP (the OpenKnowledge path)? Cost/benefit** [inference on fetched facts]:

*Benefits*:
1. One integration buys every major agent living **inside** frontmatter. The user's journey is then born in frontmatter rather than imported after the fact — the strongest possible version of the thesis.
2. ACP delivers the journey as structured events (plans, tool calls, message chunks, permission decisions), not as scraped chat scroll. That maps directly onto frontmatter's structured-markdown documents.
3. `session/load` + `session/resume` + `session/list` are the only shipped, multi-vendor session-continuity semantics found anywhere in this research. A frontmatter document per ACP session is a natural fit.
4. Users bring their own agent subscriptions and auth (the registry CI-verifies every agent returns valid authMethods) — frontmatter never proxies model inference.
5. The Obsidian plugin proves the "agents inside a markdown knowledge app" demand exists and that a small team can build it.

*Costs*:
1. **ACP agents are local subprocesses over stdio.** A purely web-hosted frontmatter cannot spawn them. This is the deciding constraint: ACP requires a desktop app, a CLI companion, or a server-side sandboxed runner (acpx demonstrates headless ACP hosting is feasible).
2. Client obligations are real UI work: permission prompts, streamed tool-call rendering, optional terminal display, file-access mediation. Mitigated by a mature TypeScript SDK and three open reference clients to copy from.
3. Scope is chartered as "code editors ↔ coding agents"; frontmatter's knowledge-work sessions fit anyway because prompts/updates are generic content blocks, and fs/terminal are optional capabilities — but expect some coding-flavored edges.
4. Churn risk is modest (protocol v1 stable, additive minors) but schema v2 is in alpha — pin the SDK, follow releases.

*Verdict*: **Yes — but sequenced.** MCP server first (works with frontmatter as a web product today, catches outputs from everywhere), ACP client second, the moment frontmatter has any local surface. ACP is where "durable home for the journey" stops meaning "importer" and starts meaning "venue."

---

## 4. AG-UI and other agent-UI protocols

[fetched — ag-ui-protocol/ag-ui repo + README]: real and sizable (15,596 stars, pushed today; `@ag-ui/core` 6,582,101 npm downloads/month). It standardizes the *other* wire: an agent **backend** streaming ~16 standard event types to a user-facing **frontend**, transport-agnostic (SSE/WebSocket/webhooks), with middleware and loose event matching. Driven by CopilotKit; integrations target agent frameworks (LangGraph, CrewAI, ADK, Mastra — [SS] for the exact roster). [inference] AG-UI matters if frontmatter builds its own chat UI over third-party agent frameworks server-side. It standardizes the ephemeral stream, not the durable document — adjacent to, not on, frontmatter's critical path. No other agent-UI protocol surfaced with comparable substance.

---

## 5. Conversation/session interchange — the "AI journey continuity" wire

**Direct answer: no standard exists.** Evidence:
- **OpenAI export** [fetched — convoviz source]: `conversations.json` where each conversation is `{ mapping: dict[node_id → Node], current_node }` — a proprietary branching node-tree you must walk parent-to-child to reconstruct the visible thread.
- **Claude export** [fetched — osteele/claude-chat-viewer schema doc]: a completely different proprietary shape — conversations with `uuid, name, created_at, chat_messages[]`, message content as typed blocks (`text`, `thinking`, `tool_use`, `tool_result`, `voice_note`), artifacts riding inside `tool_use`.
- The entire export ecosystem is **reverse-engineered third-party tooling** — browser extensions and userscripts (chatgpt-exporter 2,709 stars; Claude-Conversation-Exporter; SaveMyPhind; chat-export) [fetched repo listings]. Nobody's export reads anybody else's.
- **Claude Code** stores sessions as local JSONL under ~/.claude/projects/<cwd-slug>/ (verified locally in this workspace).
- Nearest de-facto formats are lossy message lists: the OpenAI messages array and the ShareGPT fine-tuning shape [SS] — they carry turns, not provenance, branching, artifacts, or tool traces.
- The one attempt at portable agent state, **Letta's Agent File (.af)** [fetched]: 1,197 stars, last pushed 2026-03-24 — niche and quiet. SpecStory (saves Cursor/Claude Code sessions to markdown) exists but is a closed-source product with small open repos [fetched org listing].
- The only live, multi-vendor session-continuity semantics shipped anywhere are **ACP's session/load/resume/list** — continuity within one client, not portability between tools.

[inference — thesis implication]: this absence is not a gap to wait out; it IS frontmatter's opening. Chat scroll evaporates precisely because no wire standard preserves it. The move: per-tool import adapters (ChatGPT zip, Claude zip, Claude Code JSONL, ACP session streams) landing in one open, documented, markdown-native session format that frontmatter defines and publishes. Whoever documents the open shape becomes the schelling point.

---

## 6. Verdict table

| Protocol | What it standardizes | Maturity (as fetched 2026-08-28) | Frontmatter posture |
|---|---|---|---|
| **MCP** | App ↔ AI-host context: tools, resources, prompts, auth; stateless HTTP as of 2026-07-28 | 5 revisions; latest is breaking (stateless, Roots/Sampling/Logging deprecated); SDK ~209.7M npm dl/mo; registry pre-GA (v0.1 freeze) | **IMPLEMENT NOW** — ship a frontmatter MCP server (save_document, append_to_journey, search_my_docs). Tools-first, resources as bonus; build on the official SDK so version negotiation and the 2026-07-28 migration are its problem, not yours |
| **ACP** (Agent Client Protocol) | Host ↔ local agent: persistent sessions (new/load/resume/list), prompt turns, streamed plans/tool calls, permission gating, fs, terminals | Protocol v1 stable; monthly releases (v1.7.0 2026-08-20); 5 official SDKs; registry of 40 agents incl. Anthropic-coauthored Claude adapter, Codex, Gemini, Cursor, Copilot, Devin; SDK ~23.5M npm dl/mo | **IMPLEMENT NEXT** — as soon as frontmatter has a desktop/local/companion surface. One integration = every major agent working inside frontmatter; sessions map 1:1 to journey documents. This is the OpenKnowledge path, pre-validated by obsidian-agent-client (2,377 stars) |
| **A2A** | Opaque agent ↔ agent over HTTP/gRPC/REST: Agent Cards, tasks, artifacts, push notifications | v1.0.1 (2026-05-28), Linux Foundation, 6 active SDKs, 25.5k stars; enterprise-mesh oriented; no verifiable consumer production traffic | **IGNORE** for now. Revisit only if frontmatter ever exposes "ask my knowledge base" as an agent into enterprise meshes |
| **AG-UI** | Agent backend → frontend UI event stream (~16 event types), transport-agnostic | 15.6k stars; ~6.6M npm dl/mo; CopilotKit-driven | **WATCH**. Relevant only if frontmatter builds custom chat UI over third-party agent frameworks; it standardizes the stream, frontmatter's value is the document |
| **Session interchange** | Nothing — no standard; both major exports are proprietary and mutually unreadable; parsers are reverse-engineered | OpenAI node-tree vs Claude chat_messages [both fetched]; Letta .af niche/quiet; ACP sessions = continuity within one client only | **BUILD** — per-tool import adapters plus frontmatter's own open, documented, markdown-native session format. The missing wire is the product thesis |

Working notes and raw fetch outputs are in this session only; no files were written outside the scratchpad. No destructive operations were performed; all access was read-only against the allowlisted hosts.