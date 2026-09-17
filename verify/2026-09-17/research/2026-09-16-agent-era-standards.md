I have enough to report.

# Agent standards and interfaces, opened 2026-09-16

## 1. Model Context Protocol

**What it is**, verbatim from https://modelcontextprotocol.io/index.md: "MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems." The spec index (https://modelcontextprotocol.io/specification/2026-07-28/index.md) adds: "MCP is an open protocol that enables seamless integration between LLM applications and external data sources and tools."

**Steward.** https://modelcontextprotocol.io/community/governance.md: "Model Context Protocol has been established as **Model Context Protocol a Series of LF Projects, LLC**." Governance changes "must also be approved by LF Projects, LLC." Contributions are Apache-2.0. Change control is by SEP (Specification Enhancement Proposal).

**Current spec revision: `2026-07-28`.** Prior revision `2025-11-25`. Both enumerated in https://modelcontextprotocol.io/llms.txt.

**Primitives (2026-07-28).** Server-side: **Resources** ("Context and data, for the user or the AI model to use"), **Prompts** ("Templated messages and workflows for users"), **Tools** ("Functions for the AI model to execute"). Client-side: the spec index lists only **Elicitation** ("Server-initiated requests for additional information from users"), but the llms.txt index still carries `client/roots.md`, `client/sampling.md`, `client/elicitation.md` under 2026-07-28, so **roots** and **sampling** exist as client pages. Utilities: configuration, progress, cancellation, error reporting, caching, completion, logging, pagination. Extensions are opt-in: **Tasks** ("Asynchronous execution of long-running operations, with polling, mid-flight input, and durable handles"), **Skills over MCP**, **MCP Apps**.

**Transports**: two bindings only — `stdio` ("newline-delimited messages over the standard streams of a client-launched subprocess") and `Streamable HTTP` ("each message is an HTTP POST to a single MCP endpoint; replies arrive as a JSON object or a request-scoped SSE stream"). Custom transports permitted.

**Breaking change in 2026-07-28** (https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning.md): "There is no negotiation handshake. Every request carries its protocol version, and the server accepts or rejects each request independently." Revisions ≤ `2025-11-25` are named **Legacy** (initialize handshake); `2026-07-28`+ are **Modern**. Mismatch returns `UnsupportedProtocolVersionError`, code `-32022`.

**Registry**: https://registry.modelcontextprotocol.io/ answers ("Official MCP Registry — Discover Model Context Protocol servers"); `GET /v0/servers?limit=1` returns live JSON against schema `2025-12-11/server.schema.json`. Total server count not exposed by that endpoint — not opened.

**GitHub, via `api.github.com/orgs/modelcontextprotocol/repos`, all `updated_at` 2026-09-16**: servers 90,384 stars; python-sdk 24,312; typescript-sdk 13,409; inspector 10,888; modelcontextprotocol (spec) 9,229; registry 7,255; go-sdk 5,107; rust-sdk 3,933; java-sdk 3,695; ext-apps 2,840; php-sdk 1,611; swift-sdk 1,491; kotlin-sdk 1,457; ruby-sdk 911; **ext-skills 579**.

## 2. AGENTS.md

https://agents.md/ : "a simple, open format for guiding coding agents, used by over **60k open-source projects**." Steward, verbatim: "AGENTS.md is now stewarded by the **Agentic AI Foundation** under the Linux Foundation." No required fields — "just standard Markdown." Nesting: "the closest one takes precedence"; "the main OpenAI repo has 88 AGENTS.md files."

## 3. Agent Skills

https://agentskills.io/specification.md. A skill is "a directory containing, at minimum, a `SKILL.md` file", with optional `scripts/`, `references/`, `assets/`.

Frontmatter (YAML): `name` (required, ≤64 chars, lowercase alphanumeric + hyphens, must match parent directory name), `description` (required, ≤1024 chars), `license`, `compatibility` (≤500), `metadata` (string map), `allowed-tools` (space-separated, marked Experimental).

**Progressive disclosure**, verbatim three tiers: "**Metadata** (~100 tokens): The `name` and `description` fields are loaded at startup for all skills"; "**Instructions** (< 5000 tokens recommended): The full `SKILL.md` body is loaded when the skill is activated"; "**Resources** (as needed)". "Keep your main `SKILL.md` under 500 lines." Validator: `skills-ref validate ./my-skill`.

**Clients** listed at https://agentskills.io/clients.md (46 names): Claude Code, Claude, ChatGPT & Codex, VS Code, GitHub Copilot, Cursor, Gemini CLI, Amp, Junie, Kiro, Goose, OpenCode, OpenHands, Roo Code, Letta, Factory, Ona, Qodo, Tabnine, TRAE, Spring AI, Mistral AI Vibe, Snowflake Cortex Code, Databricks Genie Code, Pulumi Neo, Laravel Boost, ZeroClaw, Firebender, nanobot, fast-agent, and others. Anthropic's post confirms the handoff: "We've published Agent Skills as an open standard for cross-platform portability. (December 18, 2025)".

## 4. llms.txt

https://llmstxt.org/ — "The /llms.txt file, **v2**", Jeremy Howard, published September 3, 2024, **modified August 10, 2026**. Proposal: "We propose adding a `/llms.txt` markdown file to websites to provide LLM-friendly content. The file can be placed at the site root, or at any path within it."

**Markdown twin recommendation**, verbatim: "pages with information that agents might need provide a clean markdown version of those pages at the same URL as the original page, either with `.md` appended (`page.html.md`) or with the extension replaced by `.md` (`page.md`)." Discovery via link relations: `rel="alternate" type="text/markdown"` and `rel="describedby"`, as HTML `<link>` or an HTTP `Link:` header. Structure: optional BOM, an H1 (the only required section), a blockquote summary, then sections of links. Adoption named on the page: "thousands of sites publish an llms.txt file", Chrome's Lighthouse "audits sites for one as part of its agentic browsing checks", and OpenAI, Anthropic and Gemini publish one for their developer docs.

## 5. A2A

https://a2a-protocol.org/latest/topics/what-is-a2a/ — "The A2A protocol is an open standard for communication between AI agents." Page author metadata: "The Linux Foundation". Repo is **a2aproject/A2A** (github.com/google/A2A redirects to it): 25,797 stars, created 2025-03-25, pushed 2026-09-16, Apache-2.0.

Two dated announcements on the project blog:
- **2026-03-12** — "A2A Protocol Ships v1.0: Production-Ready Standard for Agen…" (title truncated in the index listing).
- **2026-08-27** — "A New Chapter for A2A: Joining the Agentic AI Foundation". Verbatim: "The Agent2Agent (A2A) protocol has officially been accepted as a Growth Stage project at the Agentic AI Foundation (AAIF)." And on layering: "While the Model Context Protocol (MCP) serves as the vertical integration layer connecting agents to internal tools and databases, A2A acts as the horizontal protocol enabling peer-to-peer collaboration." Discovery mechanism is the **agent card** — "an agent can publish a structured 'agent card' detailing its capabilities and contact methods". Specific adopter names were not rendered in the fetched text — not opened.

## 6. Context engineering and memory

Anthropic engineering, dates read from each page's `datePublished`:

- **Effective context engineering for AI agents**, Sep 29, 2025 — "Context engineering refers to the set of strategies for curating and maintaining the optimal set of tokens (information) during LLM inference, including all the other information that may land there outside of the prompts."
- **Equipping agents for the real world with Agent Skills**, Oct 16, 2025 — "A skill is a directory containing a SKILL.md file that contains organized folders of instructions, scripts, and resources that give agents additional capabilities."
- **Effective harnesses for long-running agents**, Nov 26, 2025 — "The core challenge of long-running agents is that they must work in discrete sessions, and each new session begins with no memory of what came before." And: "compaction isn't sufficient." Solution: an initializer agent plus a coding agent "leaving clear artifacts for the next session."
- **Harness design for long-running application development**, **Mar 24, 2026** — "two lessons from our earlier harness work: decomposing the build into tractable chunks, and using structured artifacts to hand off context between sessions."
- **Scaling Managed Agents: Decoupling the brain from the hands**, **Apr 08, 2026** — "Harnesses encode assumptions that go stale as models improve." And: "We virtualized the components of an agent: a session (the append-only log of everything that happened), a harness…"

https://docs.claude.com/en/docs/claude-code/memory.md — two mechanisms: "**CLAUDE.md files**: instructions you write" and "**Auto memory**: notes Claude writes itself based on your corrections and preferences", the latter loaded "first 200 lines or 25KB" per session, scoped "Per repository, shared across worktrees". Guidance: "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence." And: "Because they're context rather than enforced configuration… To block an action regardless of what Claude decides, use a PreToolUse hook instead."

## 7. What the runtimes read from a repository

| File / folder | Tool | Source |
|---|---|---|
| `CLAUDE.md`, `./.claude/CLAUDE.md`, `CLAUDE.local.md`, `~/.claude/CLAUDE.md`, `/Library/Application Support/ClaudeCode/CLAUDE.md` | Claude Code | docs.claude.com/en/docs/claude-code/memory.md |
| `.claude/rules/`, `@path` imports, auto memory | Claude Code | same |
| `.claude/skills/<name>/SKILL.md` (project, nested, `~/.claude/skills/`, enterprise) | Claude Code | docs.claude.com/en/docs/claude-code/skills.md |
| `AGENTS.md` — **not read directly**: "Claude Code reads `CLAUDE.md`, not `AGENTS.md`" (import or symlink it) | Claude Code | memory.md:129 |
| `AGENTS.md`, `~/.codex/AGENTS.md`, `~/.codex/AGENTS.override.md` (precedence chain built once per run) | Codex | developers.openai.com/codex/guides/agents-md |
| `.cursor/rules/*.mdc` (project rules, frontmatter required), `AGENTS.md`, user rules, team rules | Cursor | cursor.com/docs/context/rules |
| `GEMINI.md` — `~/.gemini/GEMINI.md`, workspace + parents, plus JIT scan of a touched directory's ancestors | Gemini CLI | github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md |
| `~/.gemini/skills/`, `~/.agents/skills/`, `.gemini/skills/`, `.agents/skills/` | Gemini CLI | docs/cli/using-agent-skills.md |
| `.github/copilot-instructions.md` (repo-wide); `.github/instructions/NAME.instructions.md` (path-specific); `AGENTS.md` anywhere, nearest wins; "Alternatively… a single `CLAUDE.md` or `GEMINI.md` file stored in the root" | Copilot coding agent | docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions |
| `AGENTS.md` (an "Include AGENTS.md file" task option) | Jules | jules.google/docs |
| `AGENTS.md`, skills | Amp | ampcode.com/manual (nav entries; body text not rendered) |
| `.kiro/steering/` (workspace), `~/.kiro/steering/` (global), AGENTS.md support ✓, inclusion modes always/fileMatch/manual | Kiro | kiro.dev/docs/steering/ |

Claude Code also reads competitors' files on import: `/init` "reads Cursor rules, in `.cursor/rules/` or `.cursorrules`, and Copilot rules, in `.github/copilot-instructions.md`"; with `CLAUDE_CODE_NEW_INIT=1` it also reads "`AGENTS.md`, `.devin/rules/`, `.windsurf/rules/` or `.windsurfrules`, and `.clinerules`."

## 8. Where the field is going (2026-dated primary pages)

1. **A2A blog, 2026-08-27**, "A New Chapter for A2A: Joining the Agentic AI Foundation" — "officially been accepted as a Growth Stage project at the Agentic AI Foundation (AAIF)."
2. **A2A blog, 2026-03-12** — "A2A Protocol Ships v1.0: Production-Ready Standard for Agen…".
3. **Anthropic, 2026-03-24**, "Harness design for long-running application development" — "using structured artifacts to hand off context between sessions."
4. **Anthropic, 2026-04-08**, "Scaling Managed Agents" — "Harnesses encode assumptions about what Claude can't do on its own. However, those assumptions need to be frequently questioned because they can go stale as models improve."
5. **llmstxt.org, modified 2026-08-10** — v2 adds the `Link:` header discovery and per-path llms.txt files.
6. **MCP spec 2026-07-28** — handshake removed; stateless per-request versioning.

---

## A. Safe to build on today, and what is too young

**Safe.** `AGENTS.md` — no schema to break, 60k projects, LF-stewarded, read by Codex, Copilot, Cursor, Jules, Kiro, Amp, Gemini CLI. Markdown twins at `.md` URLs — a CDN/header change, not an architecture. `SKILL.md` frontmatter — five fields, 46 clients, an open standard since 2025-12-18 with a reference validator. MCP **tools** and **resources** over **Streamable HTTP** — 90k stars on the servers repo alone, LF governance, SEP change control.

**Young.** MCP `2026-07-28` itself: it removed the initialize handshake weeks ago, and the spec has a word for implementations straddling both — "dual-era". Build the server dual-era or pin `2025-11-25` until SDK support settles. MCP **Tasks**, **Skills over MCP** (`ext-skills`, 579 stars), **MCP Apps** — extensions, explicitly "opt-in and require explicit support from both client and server". `allowed-tools` is marked Experimental by its own spec. **A2A** is real (v1.0 in March 2026, 25.8k stars, AAIF Growth Stage in August) but it is agent-to-agent orchestration, not document access — a markdown editor has no A2A-shaped problem yet. `llms.txt` remains a proposal by one author, not a standards-body deliverable, though Lighthouse now audits for it.

## B. Interfaces an editor must expose for five years

**File conventions in the repo it writes.** `AGENTS.md` at root and nested, nearest-wins. `CLAUDE.md` containing `@AGENTS.md` (Claude Code does not read AGENTS.md). `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md`. `GEMINI.md`. `.cursor/rules/*.mdc` with frontmatter. `.kiro/steering/`. Skills as `<dir>/SKILL.md` + `scripts/` + `references/` + `assets/`, emitted into `.claude/skills/`, `.gemini/skills/` and the vendor-neutral `.agents/skills/`.

**HTTP surfaces.** Every served document also at `page.md` (and `index.md` for directory URLs). An `llms.txt` at the root and at each section path. `Link: </x.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"` as a response header, so non-HTML resources carry it too. A checksummed manifest at a stable path. Content-addressed, immutable URLs per version — a manifest of checksums is worthless if the URL it names mutates.

**MCP server primitives.** `resources` for documents and the manifest (with subscriptions for change). `tools` for the splice write, for search, and for the refusal path — a refusal must be a structured error, not prose. `prompts` for the review and kickoff workflows. `roots` to learn which vault the client has granted. `elicitation` to ask the user when a span is ambiguous instead of guessing. `completion` for path and heading argument autocomplete. `pagination` on every list. Ship **Streamable HTTP** for the hosted server and **stdio** for the desktop build; declare both `2026-07-28` and `2025-11-25`. Register in the official registry.

**Identity and permission.** OAuth 2.1 per the spec's authorization chapter, with authorization-server discovery and dynamic client registration. Per-tool consent — "Hosts must obtain explicit user consent before invoking any tool" — and treat inbound tool annotations as untrusted. Human identity distinct from agent identity on every write, since attribution is the product.

## C. How to structure a document set, cited

Three-tier progressive disclosure, from agentskills.io/specification.md: ~100-token metadata loaded for everything at startup; the body loaded on activation, "< 5000 tokens recommended"; resources loaded "only when required". Size ceilings are stated, not implied: "Keep your main `SKILL.md` under 500 lines"; Claude Code says "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence"; Cursor says "Keep rules under 500 lines". Nesting beats length — "the nearest AGENTS.md file in the directory tree will take precedence" (GitHub), and Gemini CLI JIT-scans a touched directory's ancestors. Reference, don't inline: Cursor — "Reference files instead of copying their contents—this keeps rules short and prevents them from becoming stale as code changes". Keep the chain flat: "Keep file references one level deep from `SKILL.md`. Avoid deeply nested reference chains." And prune: "if two rules contradict each other, Claude may pick one arbitrarily."

## D. What will not age well

**A monolithic preprocessing bundle.** A seven-file kit delivered as one payload fights every guidance above. The unit that survives is a tiny discoverable header plus links fetched on demand — llms.txt's "The file itself stays small enough to fit in context. The detail lives behind the links", and the 100/5000/on-demand tiering.

**A single unlisted URL as the delivery mechanism.** llms.txt v2's whole discovery story is `rel="describedby"` and `rel="alternate"` headers and path-scoped files. An unguessable URL with no link relations is invisible to the audit Chrome's Lighthouse now runs.

**Pinning to one vendor's filename.** CLAUDE.md, GEMINI.md, `.cursor/rules`, `.kiro/steering` and `.github/instructions` all persist alongside AGENTS.md; Claude Code reads Cursor's and Copilot's files on `/init`. Generate the set, or be a second-class citizen in half the runtimes.

**HTML-only rendering.** The editor's own documentation and any served document need `.md` twins; the labs already publish them for their own docs.

**Assuming a handshake.** If an MCP server is written against the `initialize` flow only, it is Legacy as of `2026-07-28` — the spec names it that.

**A manifest of checksums over mutable URLs.** Anthropic's 2026-04-08 framing is the right warning: "Harnesses encode assumptions about what Claude can't do on its own… those assumptions… go stale as models improve." Anything the plan builds because today's agents cannot do it (hand-holding through a kit, prescriptive question flows) is dead weight within a release; the durable parts are the abstractions — session, file, manifest, refusal — not the scaffolding.

---

## Not opened

- `https://modelcontextprotocol.io/specification/` bare path — HTTP 404; the dated revision index at `/specification/2026-07-28/` is what resolves.
- Total MCP registry server count — the `/v0/servers` API paginates without a total.
- A2A's named adopters and the March 12, 2026 v1.0 post body — only the blog-index summary line rendered; the post page's body did not extract.
- Amp's AGENTS.md documentation body — ampcode.com/manual returned navigation only.
- OpenAI/Microsoft/Google 2026 announcement pages beyond the A2A blog — not attempted individually; no search tool was used, so no OpenAI or Microsoft primary page is cited here.
- Full Agentic AI Foundation site (agentic.foundation) — returned "Enable JavaScript and cookies to continue"; AAIF stewardship is cited from agents.md and the A2A blog instead.