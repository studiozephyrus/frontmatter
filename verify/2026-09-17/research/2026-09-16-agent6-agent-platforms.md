I have everything I need. Writing up now.

## 1. GitHub Copilot Spaces

`https://docs.github.com/en/copilot/concepts/spaces` redirects to `/en/copilot/concepts/context/spaces` (opened, HTTP 200).

**What a Space is**, verbatim: "Copilot Spaces let you organize the context that Copilot uses to answer your questions. Spaces can include repositories, code, pull requests, issues, free-text content like transcripts or notes, images, and file uploads."

**What it holds** (from the create page, opened): exactly two kinds of context — "**Instructions**: Free text that describes what Copilot should focus on within this space" and "**Sources**". Sources are added four ways: "Add files and repositories", "Link files, pull requests, and issues", "Upload a file", "Add text content". Attached repos are searched, not loaded; attached individual files have "full contents loaded into Copilot's context window and considered for every query".

**Plans**: "Anyone with a Copilot license, including Copilot Free, can create and use Spaces."

**Shareable**: yes. Org-owned spaces grant "admin, editor, viewer". For personal spaces: "under 'General access', select **Anyone with link**. Then, copy the link to the space and share it with others." Caveat, verbatim: "Publicly shared spaces are view-only by default, and viewers can only see sources that they have access to."

**Does it generate documents? No.** Nothing on either page describes a Space producing an artefact. It is a container you fill by hand, then ask questions against. Usage: "Questions you submit in a space count as Copilot Chat requests and consume AI credits."

**Coding agent** (`/en/copilot/how-tos/agents/coding-agent`, opened): now titled "GitHub Copilot cloud agent" — "Find out how Copilot can research a repository, plan and make code changes, and create pull requests for you to review." No page in that section describes writing a plan or spec file. A cookbook entry named "Implementation planner" exists in the nav; not opened.

**github.com/pricing** (opened), Copilot line verbatim: "**GitHub Copilot** — Get started for free with up to 2,000 completions per month."

## 2. Cursor

**Plan Mode** (`cursor.com/docs/agent/planning`, opened): "Plan Mode creates detailed implementation plans before writing any code. Agent researches your codebase, asks clarifying questions, and generates a reviewable plan you can edit before building." The flow: "Creates a comprehensive implementation plan / **You review and edit the plan through chat or markdown files** / Click to build the plan when ready." So yes — a markdown plan file.

**Rules and AGENTS.md** (`cursor.com/docs/context/rules`, opened): "Project rules live in `.cursor/rules` as `.mdc` files and are version-controlled." And: "AGENTS.md is a simple markdown file for defining agent instructions. Place it in your project root as an alternative to `.cursor/rules`... Cursor supports AGENTS.md in the project root and subdirectories." Nested AGENTS.md is supported, "combined with parent directories, with more specific instructions taking precedence."

**2026-dated** (changelog, opened): **Sep 10, 2026 — Cursor Projects**: "The coordinator agent in a project doesn't write code itself; it plans the work, delegates it to agents that implement it." Its shared context is the relevant part: "Each Project maintains a set of files that sync across every cloud and local machine its agents use. Agents add research and artifacts, along with what they learn about the codebase and how you prefer work to be done." Also **Aug 17, 2026 — Origin Code Hosting**: "Cursor can now host your code," early beta on all paid plans.

## 3. Claude Code

**Plan mode** (`permission-modes.md`, opened): "Plan mode tells Claude to research and propose changes without making them. Claude reads files, runs shell commands to explore, and **writes a plan**, but does not edit your source." The plan is approved in-session; the page does not say it writes a plan file to disk.

**CLAUDE.md** (`memory.md`, opened): "instructions you write to give Claude persistent context," loaded every session, at managed-policy, user (`~/.claude/CLAUDE.md`), or project (`./CLAUDE.md`) scope. Paired with "**Auto memory**: notes Claude writes itself based on your corrections and preferences."

**Skills shareable?** Yes, verbatim: "Where you save a skill decides which sessions load it. Save it under your home directory to get it in every project, **commit it to a repository to share it with everyone who works there**, or distribute it through a plugin or managed settings to reach a whole team." And: "Claude Code skills follow the [Agent Skills](https://agentskills.io) open standard, which works across multiple AI tools."

**2026-dated**: Week 15 (April 6–10, 2026) shipped **Ultraplan**, research preview: "Kick off plan mode in the cloud from your terminal, then review the result in your browser. Claude drafts the plan in a Claude Code on the web session while your terminal stays free; when it's ready you comment on individual sections, ask for revisions, and choose to execute remotely or send it back to your CLI."

## 4. OpenAI Codex

`developers.openai.com/codex/` resolves to ChatGPT Learn. The AGENTS.md guide opened: "**Codex reads `AGENTS.md` files before doing any work.**" Precedence is global (`~/.codex/AGENTS.override.md`, else `AGENTS.md`), then project root walking down to cwd, merged root-first, capped at `project_doc_max_bytes` (32 KiB default). `AGENTS.override.md` wins over `AGENTS.md` per directory; fallback filenames are configurable. A `## Code Review Rules` section drives Codex code review in GitHub. Whether Codex writes plan files: **not opened**.

## 5. Kiro

`kiro.dev/docs/specs/` opened. Verbatim: "Every spec generates three key files that form the foundation of your specification: **`requirements.md`** (or `bugfix.md`) — Captures user stories, acceptance criteria, or bug analysis in structured notation; **`design.md`** — Documents technical architecture, sequence diagrams, and implementation considerations; **`tasks.md`** — Provides a detailed implementation plan with discrete, trackable tasks."

**They live in the repo.** From the best-practices page (opened), the layout is `.kiro/specs/` with one directory per feature (`user-authentication/`, `product-catalog/`, …). Requirements use "EARS (Easy Approach to Requirements Syntax) notation". Three-phase workflow (Requirements → Design → Tasks); **Quick Spec** generates all three "in one pass without approval gates". Steering files live at `.kiro/steering/` — `product.md`, `tech.md`, `structure.md` — and "Kiro supports providing steering directives via the AGENTS.md standard." Kiro pricing tier: **not opened**.

## 6. Antigravity / Jules / others

**Google Antigravity** (`antigravity.google/docs/artifacts`, opened): "An Artifact is a structured deliverable created by the agent to accomplish its task and communicate its progress and thinking to the human user. Artifacts include **rich markdown plans (Implementation Plans)**, code diffs, architecture diagrams, images, and browser recordings." And: "Artifacts are primarily generated during the agent's Planning Mode."

**Jules** (`jules.google/docs`, opened): "Click **Give me a plan**. Once you submit a task, Jules will generate a plan. You can review and approve it before any code changes are made." Also: "Jules now automatically looks for a file named AGENTS.md in the root of your repository... Jules uses this file to better understand your code and generate more relevant plans and completions."

**Gemini CLI, Amp, Devin, Factory**: docs **not opened**. They appear on agents.md's adopter list only.

## 7. AGENTS.md as a standard

Opened. Tagline verbatim: "A simple, open format for guiding coding agents, **used by over 60k open-source projects**." Also "View 60k+ examples on GitHub". Positioning: "Think of AGENTS.md as a README for agents."

**Backing**, verbatim: "AGENTS.md emerged from collaborative efforts across the AI software development ecosystem, including OpenAI Codex, Amp, Jules from Google, Cursor, and Factory." And: "**AGENTS.md is now stewarded by the Agentic AI Foundation under the Linux Foundation.**"

Listed adopters include Codex, Jules, Factory, Aider, goose, opencode, Zed, Warp, VS Code, Devin, UiPath, Junie, Amp, Cursor, RooCode, Gemini CLI, Kilo Code, Phoenix, Semgrep, **Coding agent from GitHub Copilot**, Ona, Windsurf, Augment Code. Nested files are supported: "at time of writing the main OpenAI repo has 88 AGENTS.md files."

---

## A. Who already generates planning/spec documents

Four do, and one does not.

- **Kiro** is the closest competitor by a wide margin: three files, named, in the repo at `.kiro/specs/<feature>/` — `requirements.md`, `design.md`, `tasks.md`, with a Quick Spec mode that produces all three in one pass without approval gates.
- **Cursor** Plan Mode produces a reviewable, editable markdown plan file.
- **Antigravity** produces "rich markdown plans (Implementation Plans)" as reviewable Artifacts.
- **Claude Code** plan mode "writes a plan" for approval; Ultraplan drafts it in a cloud session reviewable in a browser.
- **Jules** generates a plan you approve before code changes.
- **Copilot Spaces generates nothing.** It is a context container you fill by hand. This is the single most useful finding: the one platform flagged as unchecked turns out not to be in this business at all.

None of them produces anything resembling a seven-file set, and **no page I opened mentions checksums or a manifest**.

## B. Is it fetchable from a URL by a different agent?

Essentially no.

- Kiro, Cursor, Codex: files land **in the repo**, fetchable only with repo access.
- Claude Code Ultraplan is reviewable in a browser but inside an authenticated Claude Code on the web session.
- **Copilot Spaces is the only public-link surface**: "Anyone with link", view-only. But two limits bite — it is a chat interface rather than a document set, and "viewers can only see sources that they have access to", so the contents are access-gated per viewer. A stranger's agent cannot curl a Space and get documents. Spaces are also reachable in an IDE "using the GitHub MCP server", which is an auth'd path, not a plain URL.

## C. Is there a shared standard?

Yes, and it is stronger than expected. **AGENTS.md**, "used by over 60k open-source projects", "now stewarded by the Agentic AI Foundation under the Linux Foundation", with ~23 named adopters including every platform in this report — Codex, Cursor, Jules, Kiro, Copilot's coding agent, Gemini CLI, Devin, Factory, Amp. A second standard, **Agent Skills** (agentskills.io), covers packaged capabilities: "a skill is a folder containing a SKILL.md file"; Claude Code declares it follows that standard.

Note what this means for the kickoff prompt: `AGENTS.md` is the one filename every one of these agents already reads unprompted. A kit that does not emit one is fighting the current.

## D. The gap

Every platform generates plans **for the repo you already have, inside the tool, for the person already holding the licence** — none produces a self-contained, checksummed multi-document kit from a described idea at an unauthenticated URL that any agent, on any platform, can fetch cold with one curl.

The honest reading: the differentiator is not "generates documents" (four platforms do that free) nor "six questions" (Cursor Plan Mode "asks clarifying questions"; Antigravity ships `/grill-me`: "Before starting to implement, ask questions back to align on the specific details of the plan"). It is **transport and portability** — no repo, no licence, no account, agent-agnostic.

## E. What a founder launching in six months must know

1. **Kiro is the direct competitor, not Copilot.** Three named files in the repo, EARS-notation requirements, dependency-graph parallel task execution in "waves". Kiro docs pages updated Aug 4 and Aug 27, 2026 — actively maintained.
2. **AGENTS.md went institutional.** Linux Foundation stewardship plus 60k projects means the "instructions for agents" slot is taken and free. Emit one; do not invent a rival filename.
3. **Cursor Projects (Sep 10, 2026)** is the strategic threat: a coordinator agent with per-project synced files where "agents add research and artifacts" that persist "over months of work". That is the seven-file kit's job, absorbed into the tool and growing itself.
4. **Cursor Origin (Aug 17, 2026)** — Cursor now hosts code, and Aug 27 added "Start from scratch, without a repo" with browser preview and Vercel publish. The no-repo cold start is being closed.
5. **Copilot Spaces reaches Copilot Free users** and syncs automatically ("an evergreen expert in your project"). It is not a document generator today, but it is the distribution rail that would carry one, and public link sharing already works.
6. **Claude Code Ultraplan** (April 2026, research preview) already does terminal-to-browser plan handoff with per-section comments. The review-a-plan-in-a-browser interaction is not novel.

## Not opened

- `docs.github.com/.../use-copilot-spaces/creating-and-using-copilot-spaces` — 404; the two working Spaces how-to pages were opened instead.
- Whether OpenAI Codex writes plan files (only the AGENTS.md guide opened; `developers.openai.com/codex/index.md` 404).
- GitHub's "Implementation planner" cookbook prompt.
- Kiro pricing and free-tier eligibility.
- Gemini CLI, Amp, Devin, Factory docs — these appear only on the agents.md adopter list, which is a claim by agents.md, not by them.
- `docs.claude.com/en/docs/claude-code/plan-mode.md` and `/llms.txt` — 404; `code.claude.com/docs/en/permission-modes.md` and `/llms.txt` opened instead.
- `antigravity.google/docs/artifacts/plan` — 404; the artifacts overview opened.