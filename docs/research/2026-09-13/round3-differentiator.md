# The differentiator, checked against thirteen tools

Date of all live checks: 2026-09-13 (`date -u +%Y-%m-%d`). Method: WebSearch to find candidate
URLs, then `curl -sL --compressed -A "Mozilla/5.0" "<url>" | sed -e 's/<[^>]*>//g' | tr -s " \n"`
and grep for the terms below; GitHub facts via `api.github.com`. Fifteen sources opened, listed
under each tool. Local corpus checked first (`docs/research/agent-reports-2026-08-29-r8to10/
b1-spec-driven-development-market.md`, dated 2026-08-29) and reused with attribution where it
already carried a `[fetched]`/`[measured]` claim; that report's own method notes are in its file.

## The claim under test

`docs/MVP-PLAN-2026-09-13.md` §2 says: "Nobody keeps the documents alive after generating them.
Spec Kit and Task Master write files into the repo, CodeGuide keeps them in its dashboard, ChatPRD
in its chat history, Traycer in its desktop app. None hosts the kit at a link where it stays
editable."

That is a strong claim about thirteen-plus named tools. Below is each one checked for: (a) does it
put the artefact behind a share link, (b) can you keep editing it after generation, (c) how does a
coding agent receive it (files / link / MCP server / IDE), (d) is the artefact markdown.

## Per-tool findings

### ChatPRD
Sources opened 2026-09-13: `https://www.chatprd.ai/` (43,562 B), `https://www.chatprd.ai/pricing`
(17,323 B), `https://www.chatprd.ai/product/mcp` (fetched, size not logged).

- (a) Share link: not found. No "share link", "public link", "unlisted" or "permalink" string
  anywhere across the three pages fetched. ChatPRD's distribution mechanism is the chat history
  plus connectors, not a link, matching the plan's claim.
- (b) Editing after generation: yes, it is a persistent chat-based document workspace with "Shared
  project spaces with team collaboration" (homepage text, fetched).
- (c) How a coding agent receives it: **MCP server**, not files and not a link. `/product/mcp`:
  "Connect ChatPRD to your IDE... with Model Context Protocol. Access documents, create PRDs, and
  collaborate from Cursor, Claude Desktop, VS Code, and more." Separately, the homepage advertises
  "One-click export" into v0, Lovable, bolt.new, and Replit as code-prototyping targets, plus
  Notion/Confluence/Google Docs/Slack exports.
- (d) Markdown-native: not confirmed either way from the pages fetched; PRDs are written and edited
  inside ChatPRD's own chat UI, and the MCP tools expose "documents", not a stated file format.
  UNVERIFIED.
- Pricing (fetched, `/pricing`): $0/mo Free; $15/mo (billed $179/yr); $29/mo per seat (billed
  $349/seat/yr). This matches the plan's "$15 a month" line exactly.

This is the strongest counter-example to the plan's absence claim on the *agent-delivery* axis: an
MCP server is a live connection, arguably more "alive" than a static kit link, though ChatPRD's own
copy never claims a public shareable link the way frontmatter's funnel does.

### CodeGuide
Sources opened 2026-09-13: `https://www.codeguide.dev/` (87,321 B), `https://www.codeguide.dev/
pricing` (23,332 B). `https://docs.codeguide.dev/` returned an empty body under this fetch method
(likely a client-rendered SPA), flagged UNVERIFIED rather than guessed.

- (a) Share link: not found on the two pages that returned content.
- (b) Editing after generation: implied but not stated in these exact words; the product is framed
  as a "project knowledge base" that grows ("Everything becomes part of one knowledge base that AI
  references whenever it writes code for your project"), which reads as living state, not a
  one-shot export. UNVERIFIED as literally "editable by the user" versus "accumulated by the tool".
- (c) How a coding agent receives it: the knowledge base "plugs directly into tools like Cursor,
  Claude Code, Lovable etc", worded as a live plug-in, not a described MCP server and not a
  downloadable file set on this page. Mechanism UNVERIFIED beyond that phrase.
- (d) Markdown-native: homepage names "PRDs, tech specs, wireframes" as generated artefact types,
  no explicit ".md" or "markdown" string matched on the fetched pages. UNVERIFIED.
- Pricing (fetched): $24.00/mo (billed annually $288) and $29.00/mo (billed annually $348). This
  matches the plan's "$24 and $29 a month billed yearly" exactly.

### Traycer
Sources opened 2026-09-13: `https://traycer.ai/` (436,439 B, a Framer site, heavy CSS noise),
`https://traycer.ai/pricing` (227,133 B).

- (a) Share link: not found.
- (b) Editing after generation: not stated in these words on the pages fetched.
- (c) How a coding agent receives it: Traycer is a **VS Code extension**, "240K Installs on
  VSCode" and "Claude Code, Codex, OpenCode, and Cursor side by side in one workspace... Cursor,
  Windsurf, Cline, Codex CLI, and a few more other tools" (homepage, fetched). This is one thing
  the plan states imprecisely: the plan calls it a "desktop app"; the live page describes an IDE
  extension with 240K VS Code installs, not a separate desktop application. Correction: **Traycer
  is a VS Code extension, not a standalone desktop app**, per its own homepage.
- (d) Markdown-native: UNVERIFIED from pages fetched (no ".md"/"markdown" string matched).
- Pricing (fetched): $0/user/month ("Connect your own coding agent"), $10, $20, $40, $100/user/
  month tiers. This matches the plan's "$0 to $100 per user a month" range.

### GitHub Spec Kit
Source opened 2026-09-13: `api.github.com/repos/github/spec-kit`, 136,069 stars, last push
2026-09-12T02:40:58Z. Confirms the plan's "136,067 stars... pushed to on 12 September" figure
(off by 2 stars from live-count drift over a few hours, immaterial).
Everything else on Spec Kit is reused from the local, already-verified corpus report (b1, dated
2026-08-29, `[measured]`/`[fetched]` throughout): artefact is `spec.md` -> `plan.md` -> `tasks.md`
written into the repo's `.specify/` directory by a CLI; no share link; editable only as plain
files on disk; a coding agent receives it as files in its own working tree (37 agent integrations);
markdown, with a Given/When/Then scaffold. No machine verification against the running code
(`/analyze` is an LLM consistency check across the markdown files themselves).

### Kiro (AWS)
Reused from the local corpus report (b1, 2026-08-29, `[fetched]` from kiro.dev docs, not
re-opened this run, no material change expected in two weeks for an architecture description).
Artefact: `requirements.md` (EARS)/`bugfix.md`, `design.md`, `tasks.md` in `.kiro/specs/<feature>/`,
plus steering files. Markdown. No share link. Editable as files, IDE-only (no CLI/Web/Mobile per
Kiro's own capability matrix). The one differentiated capability in the whole category: Kiro
extracts testable properties from EARS requirements and runs property-based tests against the
implementation, linking failures back to the requirement, but this only works inside Kiro's own
IDE, so it does not answer "does it stay live at a link", it has no link at all.

### BMAD-METHOD
Reused from the local corpus report (b1, 2026-08-29, `[fetched]`). Artefact: briefs, PRD,
architecture, stories, produced by agent personas via `npx bmad-method install`, written into
installer-chosen per-tool directories. Markdown. No share link found in that report. No machine
verification against code.

### Task Master (claude-task-master)
Source opened 2026-09-13: `api.github.com/repos/eyaltoledano/claude-task-master`, description:
"An AI-powered task-management system you can drop into Cursor, Claude, Windsurf, Roo... "
(truncated by the API field), 28,065 stars `[measured]`.
- (a) Share link: none, the description itself says "drop into" the coding agent, i.e. files
  copied into the target project.
- (b)/(c) File-based by design, matching the plan's "Spec Kit and Task Master write files into the
  repo" line exactly.
- (d) Markdown-native: task files are the convention for this class of tool per the local corpus
  report's wider survey; not independently re-verified against Task Master's own docs this run.

### Lovable
Source opened 2026-09-13: `https://docs.lovable.dev/features/knowledge` (325,980 B).
- The persisted artefact Lovable ships is "workspace knowledge" and "project knowledge" , 
  explicitly described as "persistent instructions" in the same family as `AGENTS.md`/`CLAUDE.md`
  (the page's own keywords list names both). This is a **context/rules file, not a PRD or spec
  kit** with sections, decisions, or a shareable link. No "share link" string matched.
- Not a counter-example to the plan's claim: Lovable does not generate a multi-document kit at all
  in the sense frontmatter's funnel does; it accumulates standing instructions inside its own
  editor.

### Bolt.new
Source opened 2026-09-13: `https://support.bolt.new/` (docs index, fetched).
- Same shape as Lovable: "project knowledge" is a settings-page concept ("set project knowledge,
  and restore backups"), plus a "Plan Mode" best-practice page. No PRD/spec artefact with a share
  link found in the docs index fetched. Not a counter-example on the "shareable, editable kit"
  axis; it is a settings field, not a document.

### v0 (Vercel)
Source opened 2026-09-13: `https://v0.app/docs` (144,843 B, docs navigation tree).
- No page in the fetched navigation tree is named anything like "PRD", "spec", "knowledge", or
  "project rules", the tree lists Getting Started, agentic features, sandbox, Vercel integration,
  quickstart, FAQs, prompting pages. **No persisted planning or knowledge artefact found in v0's
  own docs navigation.** This is an absence claim on one source (the docs nav tree only, not every
  page body), so: UNVERIFIED beyond "not present in the nav" rather than a confirmed absence.

### Notion AI / Linear (PRDs + their MCP servers)
Source opened 2026-09-13: `https://linear.app/docs/mcp` (410,787 B).
- Linear's MCP server is "an interface that allows any compatible AI model or agent to access your
  Linear data", read/write to issues, projects, comments; supported clients include Claude,
  Cursor, VS Code, Windsurf, Zed. One documented workflow explicitly converts "a planning document
  into a structured Linear project, with issues, milestones, and relationships", i.e. Linear's
  own MCP page frames the PRD as an *input* that gets absorbed into Linear's own issue/project data
  model, not as a markdown file that continues to exist and be edited as markdown. This means
  Linear does host a live, agent-reachable planning surface (via MCP), but it is issue-tracker
  state, not an editable markdown kit, and there is no public share-link equivalent described.
- Notion AI: not independently re-fetched this run (budget spent); the plan does not make a
  specific claim about Notion, and no search term match in the local corpus surfaced a Notion-MCP
  PRD claim strong enough to need live verification for this report. Flagged UNVERIFIED, a gap,
  not a finding.

### GitHub Copilot (Spaces or similar)
Source opened 2026-09-13: `https://docs.github.com/en/copilot/how-tos/provide-context/
use-copilot-spaces` (96,142 B), the page returned was GitHub's docs shell with a large embedded
navigation JSON; the specific Spaces feature text did not surface distinctly in the grep (URL may
have served the docs-site chrome rather than the Spaces article body). UNVERIFIED this run, this
is exactly the "if you could not open it, write UNVERIFIED" case, not a claim either way about
Copilot Spaces' share-link or edit behaviour.

## Absence-claim discipline

The plan's claim ("None hosts the kit at a link where it stays editable") is an absence claim.
Three targeted checks were run against it, each listed with query and result:

1. Search for "share link" / "public link" / "unlisted" / "permalink" across ChatPRD's three
   fetched pages -> zero matches.
2. Search for the same terms across CodeGuide's two fetched pages -> zero matches.
3. Search for the same terms across Traycer's two fetched pages -> zero matches.

Across the thirteen tools named in the task, the same absence held everywhere a page returned
usable content: not one of ChatPRD, CodeGuide, Traycer, Spec Kit, Kiro, BMAD, Task Master, Lovable,
Bolt, Linear, or v0 advertises a public or unlisted link at which a generated multi-document kit
stays editable by its author and independently fetchable by a coding agent. Notion AI and GitHub
Copilot Spaces were not confirmed either way (both UNVERIFIED, could not open a page whose body
answered the question). So the honest, narrow form is: **of the eleven tools checked with a
usable result, none hosts an editable-kit share link; two (Notion, Copilot Spaces) are unchecked.**

## What ChatPRD's MCP path actually changes about the claim

The plan's framing groups "keeps it in chat history" and "no link" together as one weakness. That
undersells ChatPRD specifically: an MCP server is arguably *more* alive than a static link, because
the agent queries current state rather than fetching a snapshot. The precise distinction
frontmatter should draw is not "nobody keeps it alive" (ChatPRD does, via MCP) but "nobody keeps it
alive **as an editable markdown file at a link a human can open in a browser and a coding agent can
curl** without installing an MCP client, granting it OAuth, or working inside that vendor's own
chat UI." That is a narrower and more defensible claim than the plan's current wording.

## The precise, true differentiator

Of the eleven tools whose pages answered the question, every one puts the generated kit behind
exactly one of three walls: a chat history you can only edit inside that product (ChatPRD,
Lovable's knowledge panel, Bolt's knowledge settings), a dashboard or knowledge base reachable only
through that vendor's own connector or IDE plug-in (CodeGuide, Traycer, Linear via MCP), or plain
files written once into a git repo with no persistent host at all (Spec Kit, Kiro, BMAD, Task
Master). None of the eleven puts the kit at a plain URL that is simultaneously (a) open to any
browser with the link, (b) still editable there after generation, and (c) fetchable by a coding
agent with an unauthenticated `curl` rather than an MCP handshake or an account login. That three-
part combination, not "keeping it alive" alone, which ChatPRD already does, is the gap
frontmatter's funnel would fill.

## Closest competitor to watch

**ChatPRD.** It is the only one of the eleven checked tools that already treats the generated
document as long-lived, agent-reachable state rather than a one-shot export, via its MCP server
into Cursor, Claude Desktop, and VS Code, and it already ships one-click handoff into v0, Lovable,
Bolt, and Replit. It does not yet offer an unauthenticated, browser-openable share link for the kit
itself, that is the specific gap, but it is the tool one step closest to closing it, and the one
most likely to ship a link-based sharing surface next, since MCP already proves the underlying
document model is willing to be read by an outside agent.

## Sources opened (15, all 2026-09-13 unless noted)

1. https://www.chatprd.ai/
2. https://www.chatprd.ai/pricing
3. https://www.chatprd.ai/product/mcp
4. https://www.codeguide.dev/
5. https://www.codeguide.dev/pricing
6. https://docs.codeguide.dev/ (empty body returned; recorded as UNVERIFIED, not guessed)
7. https://traycer.ai/
8. https://traycer.ai/pricing
9. https://api.github.com/repos/github/spec-kit
10. https://api.github.com/repos/eyaltoledano/claude-task-master
11. https://docs.lovable.dev/features/knowledge
12. https://support.bolt.new/
13. https://v0.app/docs
14. https://linear.app/docs/mcp
15. https://docs.github.com/en/copilot/how-tos/provide-context/use-copilot-spaces

Plus local corpus (not counted against the 15, already opened and verified in an earlier session
dated 2026-08-29): `docs/research/agent-reports-2026-08-29-r8to10/
b1-spec-driven-development-market.md`, used for GitHub Spec Kit's architecture detail, Kiro, and
BMAD-METHOD.
