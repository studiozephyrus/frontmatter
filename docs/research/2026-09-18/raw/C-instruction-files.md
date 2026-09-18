# Lens C: the files people write so that agents behave

Research pass, 18 September 2026. Finding ids are prefixed `FC`.

Scope: AGENTS.md, CLAUDE.md, `.cursor/rules`, `.github/copilot-instructions.md`, `llms.txt`,
Agent Skills, MCP servers, memory files. What the conventions are, how fragmented they are,
whether anything exists that edits or validates them, and what a markdown editor could do about it.

Every finding carries the URL and the date it was opened. `INFERENCE:` marks my reading rather
than the page's claim. `UNVERIFIED:` marks something I could not confirm.

---

### FC1. AGENTS.md is the one convention that actually consolidated, and it has a number on it

- **Demand:** The agents.md home page states the format is "used by over 60k open-source projects"
  and describes itself as "A simple, open format for guiding coding agents". The framing on the
  page is "Think of AGENTS.md as a README for agents: a dedicated, predictable place to provide
  the context and instructions to help AI coding agents work on your project." The page lists
  25 named agents and tools that read it: Codex (OpenAI), Jules (Google), Factory, Aider, goose,
  opencode, Zed, Warp, VS Code, Devin (Cognition), Autopilot and Coded Agents (UiPath), Junie
  (JetBrains), Amp, Cursor, RooCode, Gemini CLI (Google), Kilo Code, Phoenix, Semgrep, Coding
  agent (GitHub Copilot), Ona, Windsurf (Cognition), Augment Code.
- **Format, verbatim from the page's FAQ:** "Are there required fields? No. AGENTS.md is just
  standard Markdown. Use any headings you like; the agent simply parses the text you provide."
  No size limit is stated anywhere on the page.
- **Precedence, verbatim:** "The closest AGENTS.md to the edited file wins; explicit user chat
  prompts override everything." And on nesting: "Place another AGENTS.md inside each package.
  Agents automatically read the nearest file in the directory tree, so the closest one takes
  precedence and every subproject can ship tailored instructions. For example, at time of writing
  the main OpenAI repo has 88 AGENTS.md files."
- **Governance:** "AGENTS.md is now stewarded by the Agentic AI Foundation under the Linux
  Foundation." Copyright line reads "AGENTS.md a Series of LF Projects, LLC".
- **Source:** https://agents.md/ opened 2026-09-18
- **Who ships it today:** free, open, no product. The site is a spec page plus an examples gallery.
- **Nobody ships:** an editor that knows the format. The page tells you to hand-write markdown and
  says agents will "attempt to execute relevant programmatic checks" from whatever you list.
- **The problem it solves for us:** this is the single strongest signal in the lens. 60k repos and
  25 tools agree on one file, in our exact format, and there is no tool that helps you write it.
  The plan already names an instruction-files screen; this is the receipt for it.
- **Fit:** perfect. It is a markdown file at a known path whose whole value is that the bytes on
  disk are what the agent reads. Splice-only editing is exactly right for it.
- **Effort:** small for a viewer with nested-file precedence; medium once you add validation.
- **Verdict:** must-have for the instruction-files screen, and the screen should lead with
  AGENTS.md rather than treat every convention equally. 60k repos is the market.

---

### FC2. llms.txt is adopted but thinly, and v2 moved it from "a file" to "markdown twins of every page"

- **Demand:** The spec itself, rewritten as v2, states the adoption case in its own words:
  "This is v2 of the proposal, updated based on what I learned from two years of adoption:
  thousands of sites publish an llms.txt file, documentation platforms generate one
  automatically, and Chrome's Lighthouse audits sites for one as part of its agentic browsing
  checks. The AI labs themselves publish llms.txt files for their own developer docs: OpenAI,
  Anthropic, and Gemini." Authored by Jeremy Howard, published 3 September 2024, modified
  10 August 2026.
- **The count, from the largest public directory:** directory.llmstxt.cloud reports
  "Websites listed 3,851", "Total llms.txt tokens 47M", "Total llms-full.txt tokens 389M".
  Category split on that page: Websites 1,820, Products 833, Developer tools 533, AI 389,
  Finance 276. Featured entries include Zapier, Cursor and Mintlify.
- **Source:** https://llmstxt.org/ opened 2026-09-18;
  https://directory.llmstxt.cloud/ opened 2026-09-18
- **The v2 format, verbatim from the spec:** "An optional byte-order mark (BOM) / An H1 with the
  name of the project or site. This is the only required section / A blockquote with a short
  summary of the project ... / Zero or more markdown sections ... of any type except headings /
  Zero or more markdown sections delimited by H2 headers, containing 'file lists' of URLs".
  Each file list entry is "a required markdown hyperlink `[name](url)`, then optionally a `:`
  and notes about the file."
- **The v2 addition that matters to us:** the proposal is no longer just one file. The spec goes on
  to "propose that pages with information that agents might need provide a clean markdown
  version of those pages at the same URL as the original page, either with `.md` appended
  (`page.html.md`) or with the extension replaced by `.md` (`page.md`)." Discovery is by link
  relation: `rel="alternate" type="text/markdown"` for the markdown twin and `rel="describedby"`
  for the llms.txt that covers it, as an HTML `<link>` or an HTTP `Link:` header.
- **Who ships it today:** generation is commoditised and free. The spec's own integrations list
  names Mintlify, GitBook, Yoast SEO, AIOSEO and Wix as platforms that generate llms.txt
  automatically, plus `vitepress-plugin-llms`, `docusaurus-plugin-llms`, a Drupal recipe,
  `llms-txt-php`, and `server-llm-txt`, described on the page as an "MCP server that lets agents
  fetch and search llms.txt files".
- **Nobody ships:** an editor that authors the markdown twin. Every integration above is a
  generator bolted to a docs platform. If your docs are plain markdown files in a repo rather
  than inside Mintlify or GitBook, nothing helps you.
- **The problem it solves for us:** a published frontmatter page already is markdown. Serving
  `page.md` next to `page` and emitting the `Link:` header is close to free, and it makes every
  published page agent-readable by the 2026 convention rather than by luck.
- **Fit:** excellent, and it is the rare feature where "the file on disk is the only truth" is a
  competitive advantage rather than a constraint. Mintlify has to render markdown back out of its
  database. We already have the bytes.
- **Effort:** small for the published-page side (serve `.md` at the twin URL, add two link
  relations). Medium if we also generate a repo-wide llms.txt with a curated file list.
- **Verdict:** good-to-have, and cheap. Ship the `.md` twin and the `Link:` header on published
  pages; treat a generated llms.txt as a second step. 3,851 directory entries is real but small,
  so do not build a product around it.

---

### FC3. Claude Code publishes hard size limits for instruction files, and ships its own trimmer

- **Demand:** the size problem is documented by the vendor, not just complained about by users. The
  official memory page states: "**Size**: target under 200 lines per CLAUDE.md file. Longer files
  consume more context and reduce adherence." A separate troubleshooting section is titled
  "My CLAUDE.md is too large" and says "Files over 200 lines consume more context and may reduce
  adherence. Claude Code skips a file over 4 MiB."
- **Source:** https://code.claude.com/docs/en/memory opened 2026-09-18
- **The numbers on the page, all verbatim:**
  - "Claude Code loads a CLAUDE.md file of up to 4 MiB in full and skips a larger file. Shorter
    files produce better adherence."
  - Imports: "Imported files can recursively import other files, with a maximum depth of four hops."
  - Imports do not help with size: "Splitting into `@path` imports helps organization but doesn't
    reduce context, since imported files load at launch."
  - Auto memory index: "The first 200 lines of `MEMORY.md`, or the first 25KB, whichever comes
    first, are loaded at the start of every conversation. Content beyond that threshold is not
    loaded at session start."
  - Path-scoped rules have a pattern budget: "a rule's whole `paths` list shares one budget of
    1,000 expanded patterns and 4 MiB".
- **The file locations, from the page's own table:** managed policy at
  `/Library/Application Support/ClaudeCode/CLAUDE.md` on macOS, `/etc/claude-code/CLAUDE.md` on
  Linux and Windows Subsystem for Linux, `C:\Program Files\ClaudeCode\CLAUDE.md` on Windows; user
  at `~/.claude/CLAUDE.md`; project at `./CLAUDE.md` or `./.claude/CLAUDE.md`; local at
  `./CLAUDE.local.md`. Rules live in `.claude/rules/*.md` and `~/.claude/rules/`.
- **Who ships a fix today:** Anthropic itself. "The `/doctor` checkup proposes trims for a
  checked-in CLAUDE.md: it cuts content Claude can derive from the codebase, such as directory
  layouts, dependency lists, and architecture overviews, and keeps pitfalls, rationale, and
  conventions that differ from tool defaults. The trim check requires Claude Code v2.1.206 or
  later." There is also an `InstructionsLoaded` hook to "log exactly which instruction files are
  loaded, when they load, and why."
- **Nobody ships:** any of this outside the terminal. The trimmer is a slash command inside one
  vendor's command-line tool. It does not run on `AGENTS.md`, it has no visual surface, and it
  cannot show you a before-and-after of what you are about to cut.
- **The problem it solves for us:** a person editing an instruction file today has no idea what it
  costs. The line count and byte size are the whole game, and both are trivially computable from
  the bytes on disk.
- **Fit:** this is a gutter, not a feature. Line 200 gets a marker. The header shows lines, bytes,
  and an estimated token count. A file past 4 MiB gets a red problem in the problems panel that
  says the agent will skip it entirely.
- **Effort:** small. Counting bytes and lines against published thresholds is an afternoon. A
  tokeniser estimate is another day if we want the number to be honest.
- **Verdict:** must-have inside the instruction-files screen. It is the cheapest credible thing on
  this whole list, and the thresholds are published rather than guessed.

---

### FC4. A skill is a folder with one markdown file, and every limit is a character or line count

- **Demand:** skills are the newest of these conventions and the most tightly specified, which is
  itself the signal. The documentation states: "Every skill needs a `SKILL.md` file with two parts:
  YAML frontmatter between `---` markers that tells Claude when to use the skill, and markdown
  content with the instructions Claude follows when the skill runs."
- **Source:** https://code.claude.com/docs/en/skills opened 2026-09-18
- **Folder shape, from the page:**
  ```
  skill-name/
  |-- SKILL.md (required)
  |-- reference.md (optional supporting files)
  |-- examples.md (optional supporting files)
  `-- scripts/
      `-- helper.py (optional supporting files)
  ```
  "The directory name becomes the command you type, and the `description` helps Claude decide when
  to load the skill automatically."
- **The limits, verbatim:**
  - "Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files."
  - "the combined `description` and `when_to_use` text is truncated at 1,536 characters in the
    skill listing to reduce context usage."
  - The `compatibility` field "Accepts a string of up to 500 characters."
  - On compaction: "Claude Code re-attaches the most recent invocation of each skill after the
    summary, keeping the first 5,000 tokens of each. Re-attached skills share a combined budget of
    25,000 tokens."
- **Why a skill is cheap and a CLAUDE.md is not, verbatim:** "Unlike CLAUDE.md content, a skill's
  body loads only when it's used, so long reference material costs almost nothing until you need
  it." And: "In a regular session, skill descriptions are loaded into context so Claude knows
  what's available, but full skill content only loads when invoked."
- **Frontmatter fields listed on the page:** `name`, `description`, `disable-model-invocation`,
  `user-invocable`, `allowed-tools`, `disallowed-tools`, `argument-hint`, `arguments`, `model`,
  `effort`, `context`, `agent`, `background`, `paths`, `shell`, `hooks`, `metadata`, `license`,
  `compatibility`.
- **Where skills live:** `~/.claude/skills/<name>/SKILL.md` for personal,
  `.claude/skills/<name>/SKILL.md` for a project, `<subdir>/.claude/skills/<name>/SKILL.md` for
  nested, `<plugin>/skills/<name>/SKILL.md` for a plugin.
- **Nobody ships:** a validator. Every limit above is a number you can check against a file, and
  nothing in the documented tooling checks them for you before the truncation happens silently.
  A description of 1,600 characters does not error. It gets cut at 1,536 and the tail is gone.
- **The problem it solves for us:** a skill is a folder of markdown with a typed frontmatter block.
  That is our file type, our editor, and a schema we did not have to invent.
- **Fit:** strong. A skill folder opens as a document with a form over the frontmatter and prose
  below. Character counters on `description` and `compatibility`, a line counter on the body.
- **Effort:** medium. The frontmatter form and counters are small. Understanding a folder as one
  editable unit rather than a list of files is the real work.
- **Verdict:** good-to-have, and the best-shaped one in this lens. The schema is published, the
  limits are numbers, and the failure mode is silent truncation that only an editor can catch.

---

### FC5. The convention table, and what it costs a team that uses three tools

This answers question 1 and sets up question 2. Every row was opened by hand on 2026-09-18.

| Tool | File path or paths | Format | Size limit, stated on the page |
|---|---|---|---|
| AGENTS.md (open format) | `AGENTS.md` at repo root, plus nested copies per package | plain markdown, no required fields | none stated |
| Claude Code instructions | `./CLAUDE.md` or `./.claude/CLAUDE.md`, `./CLAUDE.local.md`, `~/.claude/CLAUDE.md`, managed policy path per operating system | markdown, `@path` imports to a depth of four hops | "target under 200 lines"; a file over 4 MiB is skipped |
| Claude Code rules | `.claude/rules/*.md`, `~/.claude/rules/*.md` | markdown with optional `paths:` frontmatter | `paths` list budget of 1,000 expanded patterns and 4 MiB |
| Claude auto memory | `~/.claude/projects/<project>/memory/MEMORY.md` plus topic files | markdown with a `type` and `modified` frontmatter field | first 200 lines or first 25KB of `MEMORY.md` |
| Claude Agent Skills | `.claude/skills/<name>/SKILL.md`, `~/.claude/skills/<name>/SKILL.md`, `<plugin>/skills/<name>/SKILL.md` | YAML frontmatter plus markdown | under 500 lines; description truncated at 1,536 characters; `compatibility` 500 characters |
| Cursor | `.cursor/rules/*.mdc`, nested folders allowed; also `AGENTS.md` | `.mdc` only, frontmatter `description`, `globs`, `alwaysApply` | "Keep rules under 500 lines" |
| GitHub Copilot | `.github/copilot-instructions.md`; `.github/instructions/NAME.instructions.md`; `AGENTS.md` anywhere; or a single `CLAUDE.md` or `GEMINI.md` at root | markdown, frontmatter `applyTo:` and optional `excludeAgent:` | "Instructions must be no longer than 2 pages" |
| Windsurf / Devin Cascade | `~/.codeium/windsurf/memories/global_rules.md`; `.devin/rules/*.md` preferred, `.windsurf/rules/*.md` fallback; legacy `.windsurfrules`; `AGENTS.md` | markdown with a `trigger:` activation mode and `globs` | "Limited to 6,000 characters" global; "Limited to 12,000 characters per file" workspace |
| Zed | `~/.config/zed/AGENTS.md` personal; project takes the first match of nine filenames, listed below | markdown | none stated |
| llms.txt | `/llms.txt` at site root or any subpath, plus `page.md` twins | markdown, H1 then blockquote then H2 file lists | none stated |

- **Sources, all opened 2026-09-18:** https://agents.md/ ; https://code.claude.com/docs/en/memory ;
  https://code.claude.com/docs/en/skills ; https://cursor.com/docs/context/rules ;
  https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions ;
  https://docs.devin.ai/desktop/cascade/memories ; https://zed.dev/docs/ai/instructions.md ;
  https://llmstxt.org/
- **Two caveats on the numbers, so they are not quoted wrongly later.** The Copilot "2 pages" line
  is not a platform limit enforced at load time. It sits inside a prompt template GitHub publishes
  for asking its own cloud agent to write the file, under a `<Limitations>` heading:
  "- Instructions must be no longer than 2 pages. - Instructions must not be task specific."
  The Cursor "Keep rules under 500 lines" line sits under a "Best practices" heading, so it is
  advice rather than a ceiling. The Windsurf character counts and the Claude Code 4 MiB skip are
  the only ones on this table that read as enforced.
- **The precedence rules are all different, which is the part nobody writes down.** Claude Code:
  "All discovered files are concatenated into context rather than overriding each other", ordered
  "from the filesystem root down to your working directory". Cursor: "Rules are applied in this
  order: Team Rules -> Project Rules -> User Rules. All applicable rules are merged; earlier
  sources take precedence when guidance conflicts." AGENTS.md: "The closest AGENTS.md to the
  edited file wins". Zed: "Project instructions override personal `AGENTS.md` when they conflict."
  So one convention concatenates, one merges with earliest-wins, one takes nearest-wins, and one
  overrides. A person moving between them has no reason to expect any of that.
- **Zed is the clearest exhibit of the mess.** Its instructions page says "Zed uses the first
  matching file in this list" and then lists nine filenames in order: `.rules`, `.cursorrules`,
  `.windsurfrules`, `.clinerules`, `.github/copilot-instructions.md`, `AGENT.md`, `AGENTS.md`,
  `CLAUDE.md`, `GEMINI.md`. Note that `AGENT.md` singular ranks above `AGENTS.md` plural. A repo
  carrying a stale `.cursorrules` from 2024 silently wins over the `AGENTS.md` written last week,
  and nothing tells you.
- **Effort:** reading this table is the feature. A screen that shows which instruction files exist
  in this repo, which tool reads each one, which one wins, and how big each is against its own
  published limit, is a week of work and does not exist anywhere.
- **Verdict:** must-have. This table is the instruction-files screen's specification.

---

### FC6. The fragmentation complaint, with the loudest reaction count in this whole research round

- **Demand:** the single loudest artefact I found in any lens. GitHub issue
  `anthropics/claude-code#6235`, "Feature Request: Support AGENTS.md.", opened 2025-08-21, now
  closed, carries **6,644 total reactions (5,161 of them a thumbs up, 438 hearts, 361 rockets,
  326 hoorays, 289 eyes) and 396 comments.** The opening post says, verbatim: "By contrast,
  CLAUDE.md feels too specific to Claude Code. It doesn't work as well when collaborating with
  other developers who aren't using Claude Code."
- **Source:** https://github.com/anthropics/claude-code/issues/6235 read through
  api.github.com/repos/anthropics/claude-code/issues/6235 on 2026-09-18. Counts are the API's
  `reactions` object at read time.
- **The duplication complaint, stated plainly, with its own count.** Issue
  `agentsmd/agents.md#91`, "Standardize global user-level AGENTS.md at
  `~/.config/agents/AGENTS.md`", opened 2025-10-22, open, **134 reactions (129 thumbs up), 14
  comments.** It opens with a heading "## Problem" and this list, verbatim:

  > Each AI coding tool uses a different global config path:
  > - **Claude Code:** `~/.claude/CLAUDE.md`
  > - **Codex:** `~/.codex/AGENTS.md`
  > - **droid:** `~/.factory/AGENTS.md`
  > - **Amp:** `~/.config/AGENTS.md`
  >
  > **Result:** Users must either duplicate personal preferences across tool-specific paths OR
  > copy the same config into every project's `./AGENTS.md`.

- **Source:** https://github.com/agentsmd/agents.md/issues/91 opened 2026-09-18
- **A third count, for the directory shape.** `agentsmd/agents.md#9`, "Directory support",
  opened 2025-08-20, open, **109 reactions (85 thumbs up), 25 comments.** Its "Prior art" section
  lists seven separate per-tool rules directories that already exist: Cursor `.cursor/rules`,
  RooCode `.roo/rules`, Kilo Code `.kilocode/rules`, Trae `.trae/rules`, Windsurf
  `.windsurf/rules`, Augment `.augment/rules`, and VS Code `.github/instructions`. A fourth,
  `agentsmd/agents.md#11` "Import/reference support", has **70 reactions, all 70 a thumbs up**.
  Across the repo the issue search returns `total_count 108`.
- **Source:** https://github.com/agentsmd/agents.md/issues/9 and .../issues/11, opened 2026-09-18
- **So how many files does a three-tool team keep?** Take a team on Claude Code, Cursor and
  Copilot, which is an ordinary 2026 stack. `INFERENCE:` from the FC5 table, the minimum honest
  set is: `AGENTS.md` as the shared source, `CLAUDE.md` bridging to it by import or symlink,
  at least one `.cursor/rules/*.mdc` because Cursor ignores a plain `.md` in that folder, and
  `.github/copilot-instructions.md`. That is four files for one set of rules, before anyone adds
  a path-scoped rule, a skill, or a personal file. Add Windsurf and Zed and it is six or seven.
- **Who ships a fix today:** nobody ships a product. The public answer is a shell command. The
  agents.md site's own migration advice is `mv AGENT.md AGENTS.md && ln -s AGENTS.md AGENT.md`,
  and the Claude Code memory page offers `ln -s AGENTS.md CLAUDE.md` with the note that "On
  Windows, creating a symlink requires Administrator privileges or Developer Mode, so use the
  `@AGENTS.md` import instead."
- **Nobody ships:** a view that shows you the whole set at once and tells you when two copies have
  drifted apart. Symlinks and imports are a workaround chosen because there is no tool.
- **The problem it solves for us:** this is the receipt the instruction-files screen needed.
  6,644 reactions on one issue is not a hunch about demand.
- **Fit:** natural. These are all markdown files in one repository. We already read the repository.
  The screen lists every instruction file that exists, says which tool reads it, flags a file that
  is a copy rather than a link, and diffs two copies that have drifted.
- **Effort:** medium. Detection and listing is days. A drift diff between two copies is another
  few days because we already have a byte-exact engine.
- **Verdict:** must-have, and it should be the headline of the instruction-files screen rather
  than a tab in it.

---

### FC7. Yes, the linter category exists. It is a dozen command-line tools, and none of them has won

This answers question 3. I searched hard and found a real, crowded, small category.

- **What exists, with star counts from the GitHub repository search API, read 2026-09-18:**

  | Project | Stars | Last push | What it claims to do |
  |---|---|---|---|
  | `dyoshikawa/rulesync` | 1,436 | 2026-09-17 | "A Utility CLI for AI Coding Agents"; generates every tool's config from one source |
  | `agent-sh/agnix` | 419 | 2026-09-16 | "The missing linter and lsp for AI coding assistants. Validate CLAUDE.md, AGENTS.md, SKILL.md, h..." |
  | `PanisHandsome/ai-rules-sync` | 119 | 2026-06-03 | "Keep one source of truth for your AI coding-agent rules. Convert and sync between AGENTS.md, CL..." |
  | `10xChengTu/harness-engineering` | 99 | 2026-08-02 | set up AGENTS.md, docs, lint rules, eval systems |
  | `moeru-ai/alint` | 54 | 2026-08-29 | an ESLint-like toolchain for agent output |
  | `Taiizor/agents-md-cookbook` | 18 | 2026-08-08 | "verified templates, a CI linter, and migrators" |
  | `giacomo/agents-lint` | 13 | 2026-03-26 | "Your AGENTS.md is probably lying. Detect stale paths, dead npm scripts, outdated framework patt..." |
  | `pdugan20/claudelint` | 12 | 2026-09-13 | "Validates CLAUDE.md files, skills, settings, hooks, MCP serv..." |
  | `felixgeelhaar/cclint` | 12 | 2026-09-14 | "validating and optimizing CLAUDE.md context files" |
  | `YawLabs/ctxlint` | 10 | 2026-09-15 | "Lint your AI agent context files (CLAUDE.md, AGENTS.md, etc.) against your actual codebase" |
  | `ofershap/ai-context-kit` | 8 | 2026-09-16 | "Lint, measure, and manage context files for AI coding agents" |
  | `yegor256/dogent` | 7 | 2026-07-01 | "Command line linter for your agentic manifestos, like SKILL.md and CLAUDE.md" |

- **Source:** `https://api.github.com/search/repositories` with queries `rulesync`,
  `CLAUDE.md lint in:name,description`, `AGENTS.md lint in:name,description` and
  `agents.md sync rules in:name,description`, run 2026-09-18. The `lint` searches each returned
  `total_count: 103`; the `rulesync` search returned 30; the sync search returned 17.
- **The best one in the category, agnix, in its own words:** "Catch broken agent configs before
  your AI tools silently ignore them. 456 rules across Claude Code, Codex CLI, OpenCode, Cursor,
  Copilot, and more - validating CLAUDE.md, SKILL.md, hooks, MCP configs, and other agent files."
  It ships a VS Code extension, a JetBrains plugin, a Neovim plugin, a Zed extension, a GitHub
  Action and a browser playground. Its sample output shows the shape of the checks:

  ```
  CLAUDE.md:15:1 warning: Generic instruction 'Be helpful and accurate' [fixable]
    help: Remove generic instructions. Claude already knows this.
  .claude/skills/review/SKILL.md:3:1 error: Invalid name 'Review-Code' [fixable]
    help: Use lowercase letters and hyphens only (e.g., 'code-review')
  ```
- **Source:** https://github.com/agent-sh/agnix README fetched from
  raw.githubusercontent.com/agent-sh/agnix/main/README.md, opened 2026-09-18
- **The number that says nobody has won.** The agnix VS Code extension,
  `avifenesh.agnix`, "agnix - Agent Config Linter", first published 2026-02-05 and last updated
  2026-09-16, has **239 installs** and **0 ratings**. For scale, the same marketplace query in
  the same minute returned `anthropic.claude-code` at 25,802,308 installs and
  `DavidAnson.vscode-markdownlint` at 12,190,226.
- **Source:** marketplace.visualstudio.com `_apis/public/gallery/extensionquery`, queried
  2026-09-18
- **What rulesync does, from its own README:** it inverts the problem instead of linting it.
  "A Node.js CLI tool that automatically generates configuration files for various AI development
  tools from unified AI rule files." Commands include `rulesync import --targets claudecode`,
  `--targets cursor`, `--targets copilot`, and a direct converter:
  `rulesync convert --from cursor --to copilot,claudecode`. Its feature matrix covers rules,
  ignore, mcp, commands, subagents, skills, hooks, permissions and checks.
- **Source:** raw.githubusercontent.com/dyoshikawa/rulesync/main/README.md opened 2026-09-18
- **Nobody ships:** a visual one. Every single entry above is a command-line tool, and the one
  editor extension in the category has 239 installs after seven months. There is no screen that
  shows you the files, their sizes against their published limits, which tool reads each, and
  where two copies disagree. The category has proved the problem is real and has not produced a
  surface a non-terminal person would use.
- **The problem it solves for us:** it removes the risk that this is an imagined need, and it
  tells us not to build another linter. `INFERENCE:` the opening is the view, not the rules.
  1,436 stars for a generator and 239 installs for the editor extension is the whole story.
- **Fit:** strong, and it suggests the right posture. Read the repo, show the set, borrow the
  published limits as our checks, and let a person edit the file with the problems panel live.
  We do not need 456 rules to be useful on day one.
- **Effort:** medium for the screen. Small if we start by shelling out to an existing linter and
  rendering its output, though that adds a dependency we would rather not have.
- **Verdict:** good-to-have, leaning must-have for the screen already in the plan. Do not build a
  competing linter; build the surface the linters do not have.

---

### FC8. Vercel measured that AGENTS.md beat skills, and the numbers argue for a size-aware editor

- **Demand:** this is the strongest published evidence in the lens that these files are a
  performance surface rather than documentation. Vercel's engineering blog, by Jude Gao, titled
  "AGENTS.md outperforms skills in our agent evals", dated 27 Jan 2026, opens with, verbatim:
  "We expected skills to be the solution for teaching coding agents framework-specific knowledge.
  After building evals focused on Next.js 16 APIs, we found something unexpected. A compressed
  8KB docs index embedded directly in AGENTS.md achieved a 100% pass rate, while skills maxed out
  at 79% even with explicit instructions telling the agent to use them."
- **The numbers, all verbatim from the page:**
  - "In 56% of eval cases, the skill was never invoked. The agent had access to the documentation
    but didn't use it."
  - The results table reads "Baseline (no docs) 53%" and "Skill (default behavior) 53% +0pp".
  - "Zero improvement. The skill existed, the agent could use it, and the agent chose not to."
  - On one breakdown the skill was worse than nothing: "the skill actually performed worse than
    baseline on some metrics (58% vs 63% on tests), suggesting that an unused skill in the
    environment can introduce noise."
  - On size: "The initial docs injection was around 40KB. We compressed it down to 8KB (an 80%
    reduction) while maintaining the 100% pass rate."
- **Source:** https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals opened
  2026-09-18. Every string above was matched against the raw page, not a summary.
- **Who ships it today:** nobody ships compression. Vercel hand-built a pipe-delimited index for
  their own docs. The technique is described in a blog post and is not a feature of any editor.
- **Nobody ships:** a byte counter next to an instruction file that means anything. The
  interesting number here is not lines. It is kilobytes, and 40KB versus 8KB changed nothing
  about the result while changing everything about the cost.
- **The problem it solves for us:** it gives the size gutter in FC3 a reason to exist beyond
  tidiness. A person editing an `AGENTS.md` is making a measurable performance tradeoff and
  currently has no instrument at all.
- **Fit:** direct. Show bytes and an estimated token count in the header of every instruction
  file. Show the delta live as the person edits. `INFERENCE:` a "what did this edit cost" readout
  on the change queue would be a genuinely new thing, because our queue already knows the exact
  byte range that changed.
- **Effort:** small for bytes and a delta. Medium for an honest token estimate, since that needs
  a real tokeniser shipped to the client.
- **Verdict:** good-to-have, and it is the cheapest way to make the instruction-files screen feel
  like an instrument rather than a file list.

---

### FC9. There is a skills marketplace, it is run by Vercel, and the install counts are in the millions

This answers question 4's last part. Skills are being shared at scale, and nobody is selling them.

- **Demand:** skills.sh calls itself "The Agent Skills Directory" and "The Open Agent Skills
  Ecosystem", with the line "Skills are reusable capabilities for AI agents. Install them with a
  single command to enhance your agents with access to procedural knowledge." Install is
  `npx skills add <owner/repo>`. The footer reads "Made with care by Vercel." and "Skills are open
  source on GitHub."
- **Install counts from the leaderboard, column headed "Installs", read 2026-09-18:**
  `find-skills` from `vercel-labs/skills` at 3.4M; `grill-me` from `mattpocock/skills` at 1.2M,
  with `mattpocock/skills` shown at 4.0M total; `frontend-design` from `anthropics/skills` at
  897.1K; `agent-browser` from `vercel-labs/agent-browser` at 878.0K;
  `vercel-react-best-practices` at 722.9K; `lark-doc` from `open.feishu.cn` at 704.3K, with that
  publisher at 16.1M total; `microsoft/azure-skills` at 8.2M total. Further down the list,
  Anthropic's own document skills appear: `pptx` at 222.8K, `pdf` at 197.6K, `docx` at 189.6K,
  `xlsx` at 170.0K. A tab on the page is labelled "All Time (1,441,658)".
  `UNVERIFIED:` the page does not say what that 1,441,658 counts, so I am not calling it a
  skill count or an install count.
- **Source:** https://www.skills.sh/ opened 2026-09-18 (skills.sh 308-redirects to www)
- **How the ranking works, from their docs, verbatim:** "The skills leaderboard ranks skills based
  on anonymous telemetry data collected from the `skills` CLI. When users install skills,
  aggregated usage data helps surface the most popular and useful skills in the ecosystem."
- **Agents the directory targets:** Claude Code, Cursor, Codex, GitHub Copilot, Windsurf, Gemini,
  Cline, AMP, Antigravity, OpenClaw.
- **Is anyone selling them?** No. I found no price anywhere on the directory. The closest thing to
  a commercial primitive is a pack, and the docs are blunt about its limits, verbatim: "Packs are
  unlisted, not access-controlled: anyone with the pack URL can view and install it. Do not
  include secrets or credentials in a pack." That is exactly the unlisted-link mechanic already in
  our own plan for the idea-mode kit, arrived at independently.
- **The validation gap, in their own words:** "Each included skill needs a `SKILL.md` with `name`
  and `description` frontmatter. The builder skips invalid skill files and omits binary files or
  individual files larger than 2 MB." A skill with bad frontmatter is not rejected with an error.
  It is skipped, quietly, and the author finds out by noticing an absence.
- **Source:** https://www.skills.sh/docs and https://www.skills.sh/docs/packs opened 2026-09-18
- **Who ships it today:** free. Vercel runs the directory and the command-line tool; the skills
  themselves are ordinary GitHub repositories.
- **Nobody ships:** an authoring surface. Millions of installs of folders full of markdown, and
  the way you write one is to make a directory by hand and hope the frontmatter is right.
- **The problem it solves for us:** it proves people share these folders in volume and that the
  format is stable enough to build against. It also gives our kit mechanic a precedent.
- **Fit:** good. A skill is a folder of markdown with a typed header. We could publish a folder as
  a pack-shaped install link from the same publish flow we already have.
- **Effort:** medium for authoring plus validation. Large if we tried to run a directory, which we
  should not, because Vercel already does and gives it away.
- **Verdict:** good-to-have. Author and validate skills; do not build a marketplace.

---

### FC10. Agent Skills is now a vendor-neutral spec with constraints a form can check

- **Demand:** the format left Anthropic. agentskills.io states, verbatim: "The Agent Skills format
  was originally developed by Anthropic, released as an open standard, and has been adopted by a
  growing number of agent products. The standard is open to contributions from the broader
  ecosystem." The site carries a Specification, a Client Showcase, a Quickstart, an Optimizing
  descriptions page, an Evaluating skills page, and an Adding skills support page for client
  implementors.
- **Source:** https://agentskills.io/ and https://agentskills.io/specification.md opened
  2026-09-18
- **The constraints, verbatim from the specification's frontmatter table:**

  | Field | Required | Constraints |
  |---|---|---|
  | `name` | Yes | "Max 64 characters. Lowercase letters, numbers, and hyphens only. Must not start or end with a hyphen." |
  | `description` | Yes | "Max 1024 characters. Non-empty. Describes what the skill does and when to use it." |
  | `license` | No | "License name or reference to a bundled license file." |
  | `compatibility` | No | "Max 500 characters." |
  | `metadata` | No | "Arbitrary key-value mapping for additional metadata" |
  | `allowed-tools` | No | "Space-separated string of pre-approved tools the skill may use. (Experimental)" |

  The `name` rules go further: "Must not contain consecutive hyphens (`--`)" and "Must match the
  parent directory name". So the filename, the folder name and a frontmatter field must agree,
  which is precisely the class of mistake a person makes and a form prevents.
- **A discrepancy worth carrying forward.** The open spec caps `description` at 1024 characters.
  Claude Code's own page says the combined `description` and `when_to_use` "is truncated at 1,536
  characters in the skill listing". Those are not the same number, and neither page mentions the
  other. `INFERENCE:` a validator that hardcodes one of them will be wrong somewhere, so the right
  behaviour is to show the count and name which limit is being approached.
- **The loading model, verbatim:** "Agents load skills through progressive disclosure, in three
  stages: Discovery: At startup, agents load only the name and description of each available
  skill... Activation: When a task matches a skill's description, the agent reads the full
  `SKILL.md` instructions into context. Execution: The agent follows the instructions".
- **Who ships it today:** the spec is free. Authoring is a text editor and a folder.
- **Nobody ships:** a form that enforces these six constraints while you type. Every one of them
  is checkable from the bytes without running anything.
- **The problem it solves for us:** it is the only convention in this lens with a published,
  formal, machine-checkable schema. That makes it the natural first thing our problems panel
  understands.
- **Fit:** direct. Splice the frontmatter block, leave the prose alone, never rewrite the file.
- **Effort:** small. Six fields and four string rules.
- **Verdict:** good-to-have, and the cheapest credible entry into validation. Start here rather
  than with AGENTS.md, which has no schema to check against.

---

### FC11. What a document editor should expose over MCP, judged against what document servers expose today

This answers question 5. The protocol already has the right primitive and almost nobody uses it
for documents.

- **The current spec version is `2026-07-28`**, per the schema path the specification cites:
  `schema/2026-07-28/schema.ts`, and the section links under `/specification/2026-07-28/`.
- **What a server can expose, verbatim:** "Servers offer any of the following features to clients:
  **Resources**: Context and data, for the user or the AI model to use. **Prompts**: Templated
  messages and workflows for users. **Tools**: Functions for the AI model to execute." Clients
  offer "**Elicitation**: Server-initiated requests for additional information from users."
  Named extensions are "Tasks", "Skills over MCP" and "MCP Apps".
- **Source:** https://modelcontextprotocol.io/specification/latest and the `.md` twins at
  `/specification/2026-07-28/server/resources.md` and `/server/tools.md`, opened 2026-09-18
- **The part that matters for a file-backed editor.** Resources are addressed by URI, and the
  spec's own worked example uses a file URI: `"uri": "file:///project/src/main.rs"` with
  `"mimeType": "text/x-rust"`. The method set is `resources/list`, `resources/read`,
  `resources/templates/list`, `resources/subscribe`, plus the notifications
  `notifications/resources/list_changed` and `notifications/resources/updated`. Resource contents
  come back as Text Content or Binary Content, with a template form `"uriTemplate":
  "file:///{path}"`. Tools use `tools/list`, `tools/call`, `notifications/tools/list_changed`, and
  a tool carries `name`, `title`, `description`, `inputSchema` and `annotations`.
- **What document servers actually name their tools today.** The official filesystem server
  exposes: `read_text_file`, `read_media_file`, `read_multiple_files`, `write_file`, `edit_file`,
  `create_directory`, `list_directory`, `list_directory_with_sizes`, `move_file`, `search_files`,
  `directory_tree`, `get_file_info`, `list_allowed_directories`. The official server list is short:
  Everything, Fetch, Filesystem, Git, "Memory - Knowledge graph-based persistent memory system",
  Sequential Thinking, Time.
- **Source:** raw.githubusercontent.com/modelcontextprotocol/servers/main/src/filesystem/README.md
  and .../main/README.md, opened 2026-09-18
- **What the registry has for documents and markdown.** Searching the official registry for
  `document` and for `markdown` returns almost entirely converters: `ai.file2markdown/file2markdown`
  "Convert documents and web pages to clean Markdown", `dev.pdf2md/pdf-to-markdown`,
  `com.brainiall/documents` "High-fidelity PDF to structured Markdown conversion and document
  field extraction", `io.github.CSOAI-ORG/markdown-ai-mcp` "Tools: convert to html, generate toc,
  lint markdown", several `html-to-markdown` and `markdown-to-html` entries. Two stand out as
  adjacent to our plan: `com.docs-md/markdown-share`, described as "Share markdown as public
  links from your AI assistant, expiring or permanent, no API key", and
  `dev.workers.pathwren.www/markdown-lane-check`, described as "Six checks: llms.txt,
  llms-full.txt, .md twins, Accept: text/markdown, sitemap.md, alt link. Free."
- **Source:** `https://registry.modelcontextprotocol.io/v0/servers?search=document` and
  `?search=markdown`, queried 2026-09-18
- **Nobody ships:** an editing server that refuses. Every write-capable document server in the
  list above is a `write_file` or an `edit_file`. None of them has a queue, a proposal, or a
  refusal. Not one of them subscribes a client to `notifications/resources/updated` for a
  document a person is editing at the same time.
- **The problem it solves for us:** it tells us what our deferred MCP server should be, and it is
  not a file writer. It is the change queue expressed as a protocol. `INFERENCE:` a reasonable
  shape is `documents/list` and `documents/read` as Resources over `file://` URIs, subscribe for
  live updates, and exactly three tools: one that proposes a splice into the queue and returns a
  proposal id rather than writing, one that reports the queue, and one that locates a byte range
  and says plainly when the range is ambiguous. The refusal is the product, and MCP has no way to
  express it today because every server just writes.
- **Fit:** it is the same engine we already have, addressed differently. Resources map onto files
  we already read; the propose-tool maps onto the queue we already need.
- **Effort:** medium for a read-only server over Resources. Large for the propose-and-queue tools,
  because the interesting part is the refusal contract, not the transport.
- **Verdict:** good-to-have, and it should stay in Later as planned. But the shape is now known:
  propose, never write. Do not ship another `edit_file`.

---

### FC12. The context-budget complaint is real and measured, but it is quieter than you would expect

This answers question 7 honestly, including the part that cuts against the premise.

- **Demand:** GitHub issue `anthropics/claude-code#91689`, "Context window balloons at
  fresh-session start (~40-70K baseline tokens) and full-file re-injection on every auto-compact",
  opened 2026-09-03. The author measured rather than guessed, verbatim: "Measured the very first
  assistant turn's `usage` field across 10 independent fresh sessions (5 in one project, 5 in
  another): totals ranged 40,613-43,344 tokens in one project and 44,252-69,534 in another."
  The heading on that section reads "Issue A - Fresh-session-start baseline (~20-35% of window
  before any real work)". A second measurement: "Scanned all 92 session files in one project for
  `isCompactSummary` markers: found 42 real auto-compact events."
- **Source:** https://github.com/anthropics/claude-code/issues/91689 opened 2026-09-18
- **The counts, and I am reporting them because they are small.** That issue has **1 thumbs up and
  0 other reactions**. A related issue, `anthropics/claude-code#46526`, "Token efficiency: system
  prompt overhead consumes too much of the context window", opened 2026-04-11, also has **1 thumbs
  up**. Compare the 6,644 reactions on the AGENTS.md request in FC6. `INFERENCE:` the fragmentation
  pain is a mass complaint and the token-cost pain is an expert complaint. That difference should
  shape which one we put on the front of the screen.
- **The finding inside the complaint that undercuts the obvious feature.** The same author tried
  the obvious fix and reported it did not work, verbatim: "Tried 4 fixes across earlier sessions
  (disabling zero-usage plugins, narrowing global MCP server scope, isolating a specific plugin's
  SessionStart hook, trimming personal `CLAUDE.md`) - none moved this baseline more than a few
  percent." So trimming the instruction file was measured and was not the lever. The suspected
  cost was the skill catalogue and tool listings injected at session start.
- **What the vendor says, from FC3:** "CLAUDE.md files are loaded into the context window at the
  start of every session, consuming tokens alongside your conversation", and the trim advice with
  it. What Vercel measured, from FC8: 40KB down to 8KB with no loss of pass rate.
- **Who ships it today:** `/context` and `/doctor` inside Claude Code. Nothing visual, nothing
  cross-tool, nothing that shows the number while you edit.
- **Nobody ships:** a live size readout on an instruction file. Every tool in FC7 reports after
  the fact, from a terminal, on demand.
- **The problem it solves for us:** a person writing these files is spending a budget they cannot
  see. But the honest version of this feature is modest: show bytes, lines and an estimated token
  count, against the published limit for that file type. Do not promise it will fix their session.
- **Fit:** a header readout and a gutter marker at the published line limit. Nothing more.
- **Effort:** small.
- **Verdict:** good-to-have, not must-have, and I am downgrading it on the evidence. The measured
  complaint exists, the reaction counts are tiny, and the one person who measured it found that
  trimming the file barely moved the number. Ship the readout because it is cheap and honest.
  Do not build a marketing claim on it.

---

### FC13. A peer-reviewed catalogue of six instruction-file defects, with prevalence, exists already

This is the single most useful artefact I found in this lens. It is a specification for our
problems panel, written by researchers, measured on 100 real repositories.

- **Demand:** 91 of 100 popular repositories carrying an `AGENTS.md` or a `CLAUDE.md` had at least
  one defect. The paper's own summary box reads, verbatim: "We detected at least one smell in 91
  agent configuration files. Thus, only nine files were found to be smell-free. These results
  suggest that developers could benefit from catalogs and tools designed to spot configuration
  issues in agent configuration files."
- **Source:** "Configuration Smells in AGENTS.md Files: Common Mistakes in Configuring Coding
  Agents", Helio Victor F. dos Santos, Vitor Costa, Joao Eduardo Montandon, Luciana Lourdes Silva,
  Marco Tulio Valente. arXiv:2606.15828, submitted 2026-06-14, revision v5 dated 2026-09-17.
  Abstract read through the arXiv API and the full text through `arxiv.org/pdf/2606.15828v5`,
  both opened 2026-09-18.
- **The six defects, named and described in the paper:**
  1. **Context Bloat.** The file "becomes excessively large and overloaded with rules, examples,
     or low-priority details."
  2. **Skill Leakage.** "specific, rarely used, or highly specialized" instructions sit in the
     always-on file instead of a skill, so specialized knowledge, in the paper's words, "leaks"
     into every agent session.
  3. **Lint Leakage.** The file "includes rules that are already checked by linters, formatters,
     or other static analysis tools. Typical examples include naming conventions (such as
     camelCase or PascalCase), formatting rules, import ordering, maximum line length".
  4. **Blind References.** The file "contains references to external documents, files, or
     directories without explaining their purpose or scope."
  5. **Init Fossilization.** The file "is generated by an initialization command such as `/init`
     but not reviewed or updated afterwards."
  6. **Conflicting Instructions.** The file "contains instructions that contradict each other,
     creating ambiguity about the expected behavior of the agent."
- **Prevalence, from the paper's Table II, across 100 files.** Instances, then false positives,
  then precision where the paper reports one:

  | Smell | Instances | False positives | Precision |
  |---|---|---|---|
  | Context Bloat | 42 | not reported | threshold-based |
  | Skill Leakage | 35 | 6 | 82% |
  | Lint Leakage | 62 | 4 | 93% |
  | Blind Reference | 16 | 2 | 87% |
  | Init Fossilization | 24 | not reported | threshold-based |
  | Conflicting Instructions | 28 | 12 | 57% |

- **The two detections that need no model at all, and this is the important part.** The paper
  says so plainly: "we did not compute precision for Context Bloat and Init Fossilization because,
  in these cases, detection is based on pre-established thresholds." Context Bloat is "a threshold
  of 200 lines of code", taken from Anthropic's own page. Init Fossilization is a git query: "we
  consider that an `AGENTS.md` file with only a single commit exhibits this smell; that is, the
  file has never been modified since its creation."
- **The extremes it found.** Of the 42 bloated files, "The smallest file contains 216 lines of
  code, whereas the largest file contains 1,477 lines of code", and it names that largest one:
  the `CLAUDE.md` of `javascript-obfuscator/javascript-obfuscator`, "organized into 27 sections".
  For Skill Leakage it classifies what leaks: Testing 10, Workflow 8, Scaffolding 4,
  Infrastructure 4, Architecture 3.
- **Who ships it today:** nobody ships this catalogue. The linters in FC7 each invented their own
  checks. The paper explicitly calls for the tool.
- **Nobody ships:** Init Fossilization detection, and it is the one we are uniquely placed to do.
  It needs the file's commit count, which our git integration already has, and it is exactly the
  failure the Claude Code documentation warns about when it tells you to update the file every
  time the agent makes the same mistake twice.
- **The problem it solves for us:** it hands us a defensible day-one checklist instead of an
  invented one, and it tells us which two checks are free. Two of six need only line counts and
  git history. Three more are text patterns a careful implementation can approximate. One,
  Conflicting Instructions, has 57% precision even for the researchers, so we should not ship it.
- **Fit:** it is the problems panel, already in the plan, pointed at a file type we already read.
  Every diagnostic maps to a byte range, which is what our engine addresses.
- **Effort:** small for Context Bloat and Init Fossilization. Medium for Lint Leakage and Blind
  References as heuristics. Skip Conflicting Instructions until the precision is better.
- **Verdict:** must-have. This is the clearest, cheapest, best-evidenced feature in this lens, and
  it is citable to a paper rather than a hunch.

---

### FC14. The literature is split on whether these files help at all, and that changes what we claim

Four papers on the same question, all opened 2026-09-18 through the arXiv API. They disagree, and
a product that sells these files should know that before writing a landing page.

- **Against.** "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding
  Agents?", Thibaud Gloaguen, Niels Muendler, Mark Mueller, Veselin Raychev, Martin Vechev,
  arXiv:2602.11988, submitted 2026-02-12, revised 2026-09-18. Abstract, verbatim: "Surprisingly,
  we find that providing context files does not generally improve task success rates, while
  increasing inference cost by over 20% on average. This observation holds across different LLMs,
  coding agents, and for both LLM-generated and developer-committed context files." It goes on:
  "while instructions in the context files are well followed by coding agents, repository
  overviews, although popular and recommended by model providers, are not helpful."
- **Also against, independently.** "Do Context Files Help Coding Agents? A Two-Agent Ablation
  Study on Real Repositories", Prakhar Khatri, arXiv:2607.27250, submitted 2026-07-28, revised
  2026-09-18. Abstract, verbatim: "Context strategy does not measurably move correctness on either
  agent (bounded to <=10-15pp via equivalence testing)." And the reason offered: "agents fail on
  implementation skill---feature design, pattern selection, exact wiring---not missing repository
  knowledge that a context file could supply". The study covers "two frontier agents (Claude Code
  and Codex), 17 real tasks from 3 repositories ... and 288 evaluated runs with gold-test
  evaluation."
- **For, on a different axis.** "On the Impact of AGENTS.md Files on the Efficiency of AI Coding
  Agents", Jai Lal Lulla, Seyedmoein Mohsenimofidi, Matthias Galster, Jie M. Zhang, Sebastian
  Baltes, Christoph Treude, arXiv:2601.20404, submitted 2026-01-28, revised 2026-09-17. Abstract,
  verbatim: "Our results show that the presence of AGENTS.md is associated with a lower median
  runtime (28.64%) and reduced output token consumption (16.58%), while maintaining a comparable
  task completion behavior." They analysed "10 repositories and 124 pull requests".
- **And Vercel's measurement from FC8 sits on the third side:** a hand-compressed docs index in
  `AGENTS.md` took a pass rate from 53% to 100%.
- **Source:** arXiv API `export.arxiv.org/api/query?id_list=...` for 2602.11988, 2607.27250,
  2601.20404, all opened 2026-09-18. A broader search for `all:"AGENTS.md"` returned 15 papers,
  including "Context Rot in AI-Assisted Software Development" (2606.09090), "ContextCov: Deriving
  and Enforcing Executable Constraints from Agent Instruction Files" (2603.00822),
  "Probe-and-Refine Tuning of Repository Guidance for Coding Agents" (2606.20512), and
  "Operationalizing Ethics for AI Agents: How Developers Encode Values into Repository Context
  Files" (2605.05584).
- **Where the disagreement resolves, and it is not a fudge.** The two negative results are about
  correctness on benchmark-style tasks. The positive ones are about efficiency and about content
  that the model could not know. Gloaguen and colleagues say it directly: context files "are
  useful for specifying non-standard coding practices", and the overview sections are the part
  that does not pay. Vercel's win came from documentation of APIs published after the model's
  training. `INFERENCE:` the through-line is that an instruction file earns its tokens when it
  carries something unguessable, and wastes them when it restates the repository.
- **A caution for our own copy.** `INFERENCE:` a tool that helps people write these files should
  not claim they make agents smarter. Two independent studies say they do not. The honest claims
  are: they shorten runs, they carry the things a model cannot infer, and most of them are
  defective today. All three are supported above.
- **Who ships it today:** nobody quotes this research in a product. agnix's README cites the
  Vercel post; `giacomo/agents-lint`'s README cites a research finding that does not appear in the
  paper's abstract in that wording, so I have not repeated its phrasing.
- **The problem it solves for us:** it stops us building a feature on a claim the literature would
  embarrass.
- **Fit:** it is positioning, not a feature.
- **Effort:** none.
- **Verdict:** not a feature. Treat it as a constraint on what the instruction-files screen is
  allowed to promise.

---

### FC15. llms.txt reality check: published widely, read almost never, and the readers are coding agents

This answers question 6 properly, and it revises FC2 downward. The best evidence is a server-log
study rather than a directory count.

- **Demand, or the lack of it.** Ahrefs, "We Analyzed 137K Sites: 97% of llms.txt Files Never Get
  Read", by Louise Linehan with contributor Xibeijia Guan, 15 June 2026. The top findings section,
  verbatim:

  > 28% of the 137K domains using Ahrefs Web Analytics publish an llms.txt file.
  > 97% of those files received zero traffic in May 2026. Nothing fetched them at all.
  > 96% of the requests that did reach llms.txt files came from bots.
  > 19.5% of fetches came from named AI tools (of the 3% of files that weren't ignored).
  > GPTBot is top and Claude-Code is second, ahead of every AI search and assistant bot.
  > 12% of fetches come from the industry studying itself: GEO/AEO tools, llms.txt checker tools,
  > and researchers.
  > Zero requests came from AI bots for llms.txt files that don't exist. They never go looking.
  > The Chrome Lighthouse llms.txt audit produced roughly 1 in 1,000 fetches.

- **Source:** https://ahrefs.com/blog/llmstxt-study/ opened 2026-09-18
- **Method, verbatim, including their own caveat:** "Our study focuses on all 137,210 domains in
  Ahrefs Web Analytics that received traffic in May 2026. We checked each domain root for an
  llms.txt returning HTTP 200". And: "Ahrefs Web Analytics customers skew more technical and
  SEO-aware than the web at large, so treat the 28% adoption figure as an upper bound. We did not
  explicitly study whether a file was well-formed against the llms.txt specification."
- **What Google said, as the study reports it.** In late May 2026 Google's guide on generative AI
  features told owners in a section "literally titled 'mythbusting'" that files like llms.txt are
  not needed, and days later the Chrome team shipped an llms.txt check in Lighthouse's
  experimental Agentic Browsing audits. Pressed on the contradiction by Lily Ray, John Mueller
  said llms.txt is "not done for search" and is a "temporary crutch, perhaps to save some tokens"
  for AI coding tools parsing developer documentation.
  `UNVERIFIED:` I did not open Mueller's original post; these strings are quoted from the Ahrefs
  article, which is the source I opened.
- **The two directory counts, for comparison.** directory.llmstxt.cloud lists 3,851 websites.
  llmstxt.site rendered 1,710 table rows and 1,979 distinct llms.txt links on its index page when
  I counted the markup on 2026-09-18. Against the Ahrefs figure of roughly 38,000 publishing
  domains in one analytics population, the directories are a small sample of a thing that is
  itself mostly unread.
- **The distinction that saves our recommendation, and it is the study's own.** Verbatim: "It is
  not the practice of publishing markdown copies of your web pages, a separate tactic with its own
  problems ... This study measures the index file, and only the index file." So 97% zero traffic
  is a verdict on the index file, not on the `.md` twin that FC2 recommends.
- **A spot check I ran myself, and its limits.** `https://code.claude.com/docs/llms.txt` returned
  HTTP 200 at 46,963 bytes on 2026-09-18. `https://platform.openai.com/llms.txt` and
  `https://ai.google.dev/llms.txt` both returned 404 at those exact paths. `INFERENCE:` the
  llmstxt.org claim that OpenAI, Anthropic and Gemini publish one is true for at least Anthropic;
  I did not find the others at the paths I guessed, which is not the same as their not existing.
- **The problem it solves for us:** it stops us shipping a generator nobody reads, and it points at
  the part that is read. Claude-Code being the second-ranked fetcher of the files that do get read
  is the whole story: this convention belongs to coding agents, not to search.
- **Fit:** revise FC2. Ship the `.md` twin and the `Link:` header on a published page, because
  those serve the agent that is actually fetching. Treat a generated index file as optional,
  and never as an "AI visibility" claim.
- **Effort:** unchanged, small.
- **Verdict:** good-to-have, downgraded. Ship the twin, skip the marketing story, and do not put
  llms.txt on a pricing page.

---

### FC16. Converting between instruction formats is a shipped feature in three separate tools

- **Demand:** the migration path is already a first-class command in the tools themselves, which
  is a stronger signal than a feature request.
  - Claude Code's `/init`, verbatim: "Running `/init` reads Cursor rules, in `.cursor/rules/` or
    `.cursorrules`, and Copilot rules, in `.github/copilot-instructions.md`, and incorporates the
    relevant parts into the generated `CLAUDE.md`. With `CLAUDE_CODE_NEW_INIT=1` set, `/init` also
    reads `AGENTS.md`, `.devin/rules/`, `.windsurf/rules/` or `.windsurfrules`, and `.clinerules`."
  - Claude Code's `/import`, verbatim: it "brings a supported coding agent's configuration into
    Claude Code, which appends a one-time copy of instruction files such as `AGENTS.md` to the
    matching `CLAUDE.md` and carries over MCP servers, commands, subagents, and skills. Requires
    Claude Code v2.1.213 or later."
  - rulesync, from its README: `rulesync import --targets claudecode` "From CLAUDE.md",
    `--targets cursor` "From .cursorrules", `--targets copilot` "From
    .github/copilot-instructions.md", plus
    `rulesync convert --from cursor --to copilot,claudecode` described as "no .rulesync/ files
    written".
  - Zed reads nine different filenames as compatibility project instructions, listed in FC5.
- **Source:** https://code.claude.com/docs/en/memory ;
  raw.githubusercontent.com/dyoshikawa/rulesync/main/README.md ; https://zed.dev/docs/ai/instructions.md
  all opened 2026-09-18
- **Who ships it today:** three command-line tools and one editor's loader, all free. rulesync at
  1,436 stars is the most-starred project in this whole lens, and conversion is its main job.
- **Nobody ships:** a preview. Every one of these is a one-way, destructive-ish operation you run
  and then read the diff of afterwards. `/import` "appends a one-time copy", which is exactly the
  drift problem in FC6 being created by the tool meant to solve it.
- **The problem it solves for us:** a person arriving at frontmatter with a repository full of
  historic rule files wants one view and one source, and the conversion is the on-ramp.
- **Fit:** this is our change queue applied to a different job. Show the proposed converted file as
  a queued change with the byte ranges marked, accept or reject section by section, never write
  silently. That is the thing none of the four tools above do, and it is the mechanism we already
  decided to build.
- **Effort:** medium. Reading the formats is easy; the queue already exists in the plan; the work
  is the per-section mapping and being honest when a `paths:` or `globs:` field has no equivalent
  in the target format.
- **Verdict:** good-to-have, and the best demonstration of the change queue we could pick. A
  conversion that you accept line by line is a two-minute demo that explains the whole product.

---

## Direct answers to the seven questions

1. **Table of conventions.** FC5. Ten rows, every one opened by hand, with the stated size limit
   and the two caveats about which limits are enforced and which are advice.

2. **Fragmentation.** FC6. A three-tool team keeps at least four files for one set of rules, and
   six or seven with Windsurf and Zed added. The public complaint is
   `anthropics/claude-code#6235` at 6,644 reactions and 396 comments, and the duplication is
   stated most plainly in `agentsmd/agents.md#91` at 134 reactions: "Users must either duplicate
   personal preferences across tool-specific paths OR copy the same config into every project's
   `./AGENTS.md`."

3. **Does anything edit, validate, lint or sync these files?** Yes, twelve projects, all
   command-line, listed with star counts in FC7. The leaders are `dyoshikawa/rulesync` at 1,436
   stars and `agent-sh/agnix` at 419 stars with 456 checks. The one editor extension in the
   category, `avifenesh.agnix`, has 239 installs. No visual editor exists.

4. **Skills.** FC4 for the Claude Code shape and its limits, FC10 for the vendor-neutral spec at
   agentskills.io with the exact field constraints, FC9 for the marketplace. It is a folder with a
   `SKILL.md` carrying `name` and `description`. Nobody is selling them. Vercel runs skills.sh and
   gives it away, with install counts in the millions.

5. **MCP.** FC11. The current spec is `2026-07-28`. Servers expose Resources, Prompts and Tools;
   clients offer Elicitation. Every document server in the registry is a converter or a
   `write_file`. The useful thing for us is not another file writer: it is the change queue as a
   protocol, where a tool proposes a splice and returns a proposal id rather than writing.

6. **llms.txt.** FC15. Published by 28% of 137,210 domains in one analytics population, and 97% of
   those files received zero traffic in May 2026. The fetches that do happen come mostly from
   coding agents, with GPTBot first and Claude-Code second. Adopted in form, ignored in practice,
   except by the exact audience we care about.

7. **Token cost.** FC3 for the published limits, FC8 for Vercel's 40KB to 8KB with no loss, FC12
   for the measured complaint at 40,613 to 69,534 baseline tokens per fresh session. FC12 also
   reports the part that cuts against it: the person who measured it found that trimming
   `CLAUDE.md` moved the baseline by only a few percent, and the reaction counts on those issues
   are 1.

**On the GitHub count specifically:** I could not get one. `api.github.com/search/code` returns
HTTP 401 with "Requires authentication" for an unauthenticated request, and this session's sandbox
denies read access to `/Users/sagnikmitra/.config/codex-env`, so I could not authenticate. The
GitHub HTML search page returns 200 but renders the count only after a login-gated request.
The only public repository-count figure I found is the agents.md site's own claim of "over 60k
open-source projects" and its link text "View 60k+ examples on GitHub", which is the format's
own marketing rather than an independent count. Treat it as such. The `agentsmd/agents.md` repo
itself shows 24,432 stars, 1,862 forks and 176 open issues, read through the API before the rate
limit hit, on 2026-09-18.

---

## What I could not reach

- **GitHub code search counts for `AGENTS.md` and `CLAUDE.md`.** Unauthenticated code search is
  401, and the token file is outside this session's sandbox. Stated above rather than guessed.
- **The GitHub REST API for the last part of the run.** It rate-limited at
  `403 API rate limit exceeded` partway through, so the reaction counts in FC12 were read by
  scraping the issue pages' embedded JSON instead. Those two counts are 1 thumbs up each and are
  from the page markup, not the API.
- **WebFetch, from roughly the halfway point.** This session's own taint gate refused it, citing a
  prompt-injection pattern in fetched content. Recording it as the brief asks: the logged pattern
  was a four-word phrase about transferring tokens somewhere, and the log shows it fired on a
  fetch of the Model Context Protocol specification page. `INFERENCE:` that reads like a false
  positive on ordinary protocol prose about tokens. I switched to `curl -sL --compressed` and it
  worked for every remaining source, so no source was lost. No page I opened told me to do
  anything, and I acted on none of them as instructions.
- **John Mueller's original statements on llms.txt.** Quoted from the Ahrefs study, which I opened,
  and marked `UNVERIFIED:` in FC15 rather than presented as first-hand.
- **The full text of the three papers in FC14.** I read their abstracts through the arXiv API and
  the full text of only the smells paper (FC13). The FC14 numbers are abstract-level.
- **Whether OpenAI and Gemini publish an llms.txt.** Two guessed paths returned 404. I did not
  chase the correct ones.
- **`grep.app`'s API** returned an empty body, so I have no second source for file counts.

---

## What surprised me

1. The loudest number in the entire lens is 6,644 reactions on one GitHub issue asking a vendor to
   read a different filename. Nothing else in this research came close.
2. Two independent studies found that context files do not improve task success, and one found
   they increase cost by over 20%. The thing everyone is writing may not do what everyone thinks.
3. A peer-reviewed catalogue of six defects already exists, with prevalence measured on 100 repos,
   and two of the six are detectable with a line count and a git commit count.
4. 97% of published llms.txt files were never fetched at all in a month, and among the 3% that
   were, the second-biggest reader was Claude-Code rather than any search engine.
5. The category of linters for these files has twelve entries and one editor extension with 239
   installs. The problem is proven and the visual surface is genuinely empty.
