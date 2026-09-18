# The tagline, and what fmd stands for

**Date.** 18 September 2026. Every page below was opened in this session with `curl`, unless marked.

**What this file is.** Research for founder decision D01: how the category talks, what `fmd` could
stand for, tagline candidates, and a shortlist of three with a test to choose between them.

**What it is not.** A decision. The founder picks. The public name stays frontmatter, per
`docs/pack/56-OPEN-DECISIONS.md` section 0.

**The brief, from D01.** One editor with Doc and Markdown modes. Rough ideas become concrete through
questions, then blueprints and flows. Plain text becomes other things, a command line among them.

One markdown file can be published, shared and used everywhere.

---

## 1. How the category talks today

**Method.** Each home page was fetched with `curl -sL --compressed` on 18 September 2026. The
columns hold the page's `<h1>`, and its meta description or first subheading. Quotation marks mean
the string was matched in the fetched HTML.

### 1.1 Markdown and writing editors

Product | URL | Headline, verbatim | Tagline or description, verbatim
Obsidian | https://obsidian.md/ | "Sharpen your thinking." | "The free and flexible app for your private thoughts."
Notion | https://www.notion.com/ | "Where teams and agents Think together." | "The AI workspace that works for you."
Typora | https://typora.io/ | No `<h1>`. Title: "simple yet powerful Markdown reader." | "a minimal markdown editor"; it "removes the preview window, mode switcher"
iA Writer | https://ia.net/writer | "iA Writer" | "Plain text. Total focus."
HackMD | https://hackmd.io/ | "Where teams and agents build together" | "Your Collaborative Markdown Workspace for Knowledge Sharing"
Craft | https://www.craft.do/ | "Your space for notes, tasks, and big ideas" | "A free notes and productivity app that follows you across all your devices."
Bear | https://bear.app/ | "Markdown notes you’ll love" | "a beautiful, powerfully simple Markdown note taking app"
StackEdit | https://stackedit.io/ | "Unrivalled writing experience" | Title: "In-browser Markdown editor"
Lex | https://lex.page/ | "Write something great today." | "Collaborative documents, with powerful AI editing tools"

**HackMD note.** A direct `curl` returned an Amazon Web Services bot challenge ("JavaScript is disabled"). The row
comes from the `r.jina.ai` reader proxy of the same URL, fetched the same day.

### 1.2 The three free agent-era markdown editors

Product | URL | Headline, verbatim | Tagline or description, verbatim
Ritemark | https://ritemark.app/en/ | "Markdown editor with AI agents." | "A writing environment for professionals. AI agents with direct file access."
OpenMarkdown | https://openmarkdown.dev/ | "Feather-light. Light-speed." | "A feather-light, local-first Markdown editor built for you and your agent."
OpenKnowledge | https://openknowledge.ai/ | "Beautiful, AI-native markdown editor" | "for humans and agents. Build knowledge bases, LLM wikis, and agent 2nd brains."

### 1.3 Agent-era code, docs and planning tools

Product | URL | Headline, verbatim | Tagline or description, verbatim
Zed | https://zed.dev/ | "Your last next editor" | "a high-performance, multiplayer code editor"
Cursor | https://cursor.com/ | "Cursor is your coding agent for building ambitious software." | "agents turn ideas into code"
Mintlify | https://www.mintlify.com/ | "The knowledge infrastructure agents build on" | "Self-updating documentation for startups, enterprises, and agents."
GitBook | https://www.gitbook.com/ | "The docs platform that flags outdated content. Then fixes it." | Title: "The knowledge layer for AI"
ChatPRD | https://www.chatprd.ai/ | "The AI product manager for your entire team" | "Write great product docs in minutes"
Linear | https://linear.app/ | "The product development system for teams and agents" | "Purpose-built for planning and building products with AI agents."
Kiro | https://kiro.dev/ | "Move beyond AI coding to agentic engineering" | "turn prompts into executable specs"
Tessl | https://www.tessl.io/ | "Build your software factory, one skill at a time" | Title: "Agent Enablement Platform"
Warp | https://www.warp.dev/ | "Open infrastructure for cloud software factories" | Title: "The Open Platform for Automating Development"
Feather | https://mdx.one/ | "Start a blog that humans and AI agents can read" | "Write your post, hit publish, done."

### 1.4 Ideas to blueprints, and one source to many outputs

Product | URL | Headline, verbatim | Tagline or description, verbatim
Napkin | https://www.napkin.ai/ | "Get visuals from your text" | Title: "Turn Text into AI Diagrams and Visuals"
Eraser | https://www.eraser.io/ | "AI for diagrams that matter" | "Create technical diagrams using AI."
Whimsical | https://whimsical.com/ | "The whiteboard for product builders" | "Design and document implementation with diagrams."
Heptabase | https://heptabase.com/ | "Master anything you learn. Do your best research with AI." | "an intelligent, visual knowledge base"
Quarto | https://quarto.org/ | "Welcome to Quarto" | "articles, websites, blogs, books, slides, and more"
Tana | https://tana.inc/ | "Meetings that ship" | "an agentic meeting platform"

### 1.5 What the pattern says

- **"Teams and agents" is the crowded phrase.** Notion, HackMD and Linear all put it in the
  headline. "You and your agent" belongs to OpenMarkdown.
- **"Markdown editor" plus an AI word is taken three times.** Ritemark ("with AI agents"),
  OpenKnowledge ("AI-native") and OpenMarkdown ("for you and your agent").
- **"Ideas into code" is Cursor's.** "Prompts into executable specs" is Kiro's. "Text into
  visuals" is Napkin's.
- **Nobody leads with the file.** No headline above says the file stays yours or stays exact.
  iA Writer's "Plain text" is the nearest.
- **Typora sells the absence of a mode switcher.** Our Doc and Markdown switch is the opposite
  choice, so a line about modes should say why switching helps.

### 1.6 Phrases to avoid, because they are taken

Phrase | Owner | Source
"Markdown editor with AI agents" | Ritemark | h1, https://ritemark.app/en/
"built for you and your agent" | OpenMarkdown | meta description, https://openmarkdown.dev/
"AI-native markdown editor" | OpenKnowledge | h1, https://openknowledge.ai/
"Where teams and agents build together" | HackMD | h1, via reader proxy
"Where teams and agents Think together" | Notion | h1, https://www.notion.com/
"Your last next editor" | Zed | h1, https://zed.dev/
"agents turn ideas into code" | Cursor | meta description, https://cursor.com/
"Get visuals from your text" | Napkin | h1, https://www.napkin.ai/
"Sharpen your thinking" | Obsidian | h1, https://obsidian.md/
"Plain text. Total focus." | iA Writer | meta description, https://ia.net/writer

---

## 2. What fmd could stand for

**Method.** Each expansion was searched as an exact phrase with WebSearch on 18 September 2026. Any
GitHub repository or package found was then opened through the GitHub, npm or crates.io API with
`curl`.

"Clash" means a live thing a developer might find first.

Expansion | Clash found | Reads naturally? | Verdict
**frontmatter markdown** | None as a product. `fmd` appears as a variable name for a parsed front matter object in code samples (search summary, not opened) | Yes. It says the public name and the format | **Keep**
**from markdown** | None found for "FromMD" or "from.md" | Yes. It carries the "one file, many outputs" idea | **Keep**
**full markdown** | None as a format. Search found only "full markdown example" gists | Yes, though vague about what "full" adds | **Keep, weaker**
fluent markdown | FluentMark, an Eclipse markdown editor; a PHP "fluent API" library; Microsoft's Fluent UI | Yes | Crowded; Fluent is Microsoft's design word
flow markdown | **FlowMD**, a macOS markdown editor on the App Store; MD Flow on Google Play | Yes | **Drop.** A markdown editor already uses the name
forward markdown | `iceddev/remark`, "Forward-looking Markdown editor", last active 2014 | Awkward | Drop
formed markdown | None found | No | Drop
free markdown | Implies a price promise; "Free Manga Downloader" is the best-known FMD in software | Yes | **Drop.** It makes a pricing claim we have not decided
formula markdown | `vatravie/fmd`, "Formula Markdown", 2 stars | Yes | Drop, taken
fenceless markdown | `unlitworks/fmd`, "Fenceless Markdown", 0 stars | Yes | **Drop.** It also contradicts our settled carrier, which uses fences for data
franken markdown | `Dicklesworthstone/franken_markdown`, 101 stars, ships a CLI binary called `fmd` | No | Drop, taken, and see section 5
find markdown | `zhouer/fmd` on crates.io, "Find Markdown files by metadata" | Yes | Drop, taken

**Which rows were opened.** The npm, crates.io and GitHub rows were opened by API. FlowMD, MD Flow,
FluentMark and `iceddev/remark` come from search results only. `UNVERIFIED:` their current state.

**The three that read naturally and are clear.** frontmatter markdown, from markdown and full
markdown. Only the first two say something true about the product.

**A backronym was tried and dropped.** "From mind to document" returned only mind-map export tools.
It is free, but it is the kind of line the brief rules out.

---

## 3. Tagline candidates

**Rules applied.** Under nine words. No marketing verbs, no "revolutionise", no "seamless", no lists
of three. Nothing from section 1.6, and nothing from `docs/pack/07-CLAIMS-REGISTER.md` section 4.1.

**How the last column works.** It names the register row that governs the claim. "Not today" means
the feature is specified but not built, so the line waits for the build.

**What `src/` holds today.** A published page route exists at `src/app/(public)/p/[slug]/page.tsx`
and a share endpoint at `src/app/api/share/route.ts`. A search of `src/` for Doc mode, blueprint and
kickoff code returned nothing.

### 3.1 The editor

Id | Line | Words | The claim it makes | Register today
E1 | Write in Doc mode. Keep a markdown file. | 8 | Two modes over one plain file | **Not today.** Doc mode is CL208, not built. The file half is CL008, MAY SAY
E2 | Looks like a document. Saves as markdown. | 7 | A rich view whose saved form is plain markdown | **Not today**, CL208. Sameness risk: OpenKnowledge says "a Notion-like editor that's just markdown under the hood"
E3 | Your markdown, exactly as you left it. | 7 | The editor changes no byte it was not asked to | **MAY SAY** under CL001, but only with its scope printed beneath. A tagline cannot carry the coverage caveat in CL201
E4 | The markdown editor that refuses to guess. | 7 | Ambiguous edits are refused, not approximated | **MAY SAY**, CL006. A stranger may not know what is being guessed

### 3.2 The agent era

Id | Line | Words | The claim it makes | Register today
A1 | Markdown for people who write with agents. | 7 | Who it is for; no capability claim | **MAY SAY.** No row needed. Close in spirit to OpenMarkdown's "for you and your agent", not in wording
A2 | Your agent drafts. You decide what stays. | 7 | Every agent change waits for a person | **Not today**, CL207: the change queue is not built. Near CL102, which Google Docs owns
A3 | The markdown editor for the agentic era. | 7 | A category position, taken from D01 | **MAY SAY.** It asserts nothing checkable. "Agentic era" is insider language to a stranger

### 3.3 Ideas to blueprints

Id | Line | Words | The claim it makes | Register today
I1 | From rough idea to blueprint. | 5 | The editor turns a vague idea into a structured plan | **Not today.** No row, and no code in `src/`. Add a row before use
I2 | It asks the questions. You get the plan. | 8 | Questions are the mechanism, a plan is the output | **Not today**, same reason. Near ChatPRD's "Write great product docs in minutes", not in wording
I3 | Rough notes in, blueprints and flows out. | 7 | Two named outputs from loose input | **Not today**, same reason. The "X in, Y out" shape is common

### 3.4 One file, many outputs

Id | Line | Words | The claim it makes | Register today
O1 | One markdown file, everywhere it needs to go. | 8 | Publishing and sharing from the same file | **Partly.** The publish route and share endpoint exist in code. No register row yet, and the deployment was not checked
O2 | Everything starts as one markdown file. | 6 | The file is the source of every view | **MAY SAY.** It restates the projection law, which CL008 already covers
O3 | Write it once in markdown. Use it anywhere. | 8 | Portability to any destination | **MAY NOT SAY** as worded. "Anywhere" is unbounded, and no row could support it
O4 | From markdown, anything. | 3 | Any output from a markdown source | **MAY NOT SAY** as worded, for the same reason. It pairs with fmd as "from markdown"
O5 | Plain text that turns into a command. | 7 | Text becomes a runnable command line | **Not today.** No row and no code. Narrow: it names one output of many

**Fifteen lines, grouped.** Five are sayable on the day of writing: E3, E4, A1, A3 and O2. Seven wait
for a build, O1 is partly built, and O3 and O4 cannot be said as worded.

---

## 4. The shortlist of three

**How these were chosen.** One line from each of three angles, so the test compares positions rather
than wordings. Each had to avoid section 1.6 and be sayable today or at the first build.

Rank | Line | Angle | Why it made the list | What it needs first
1 | **Everything starts as one markdown file.** | One file, many outputs | Nobody in section 1 leads with the file. It is true today under CL008, and it frames publishing, sharing and generation as views of one source | Nothing. It can ship today
2 | **Looks like a document. Saves as markdown.** | The editor | It explains the Doc and Markdown switch without naming modes. It answers Typora, which sells the absence of a switcher | Doc mode built (CL208), and a wording check against OpenKnowledge's "just markdown under the hood"
3 | **From rough idea to blueprint.** | Ideas to blueprints | It is the only angle no incumbent owns in a headline. Cursor, Kiro and Napkin each own a neighbour | The idea mode built, and a register row added

**Runner-up.** E4, "The markdown editor that refuses to guess." It is sayable today and nobody else
could say it. It lost because a stranger has to be told what is being guessed.

**Pairing with fmd.** Line 1 pairs with "from markdown". Lines 2 and 3 pair with "frontmatter
markdown", which keeps the internal name tied to the public one.

### 4.1 The test that picks between them

**A five-second test, then a recall test.** Both are cheap and neither needs a built product.

1. Show a stranger a plain page with the name, one line and one screenshot, for five seconds.
2. Ask: "What does this product do?" Record the answer word for word.
3. The next day, ask the same person which line they remember. Record it word for word.

**What counts as a pass.** The first answer names a markdown or document editor. The recall answer
reproduces the line closely enough that a search for it would find the page.

**Who to ask.** People from the pilot cohort who have not seen the plan. Each person sees one line
only, so answers are not contaminated by comparison.

**How many.** `UNVERIFIED:` no sample size has been derived for this. Choose the number before the
test starts, and write it down, so the result cannot be read to fit a favourite.

**What would override the test.** If line 1 and another tie, take line 1, because it is the only one
that is true on the day it is published.

---

## 5. Name checks for fmd

**Method.** Registry APIs opened with `curl` on 18 September 2026, unless marked "search only".

Where | What is there | Opened how | Risk to us
npm `fmd` | "Factory Module Definition", version 0.1.0, created 2013-04-23. 823 downloads from 2026-08-18 to 2026-09-16 | `registry.npmjs.org/fmd`, `api.npmjs.org` | Low. Old and small, but the name is not available
npm `fmd-cli` | Created 2021-03-22, all versions unpublished 2021-07-08 | `registry.npmjs.org/fmd-cli` | Low. Unpublished names can carry npm restrictions; `UNVERIFIED:` whether it can be claimed
npm `@fmd/core`, `fmdjs` | Not found | `registry.npmjs.org` | None
PyPI `fmd` | "Download Taiwan financial market data via FMD API", 0.6.1, last upload 2025-03-06 | `pypi.org/pypi/fmd/json` | Low. Unrelated field
crates.io `fmd` | "Find Markdown files by metadata", keywords include `frontmatter` and `markdown`, 88 downloads | `crates.io/api/v1/crates/fmd` | **Medium.** Same words, same field, though tiny
GitHub `franken_markdown` | Ships a CLI binary named **`fmd`**, a markdown renderer. Release v0.4.5 dated 2026-09-15, 101 stars, repository created 2026-06-27 | GitHub API and its README | **High for any binary.** A command called `fmd` on a developer's command path would collide
GitHub user `fmd` | Fareed Dudhia, 97 public repositories, since 2012 | GitHub API | Blocks `github.com/fmd`
GitHub `fmdapp` | A user account created 2025-12-02, one repository | GitHub API | Blocks that handle
GitHub `fmd-app`, `getfmd` | Not found | GitHub API | Available on 18 September
GitHub, other `fmd` repositories | `riderkick/FMD`, Free Manga Downloader, 741 stars. `ccgus/fmdb`, 13,829 stars, a different name one letter longer | GitHub search API | Low, but "fmd" autocompletes to them
Homebrew `fmd` | No formula, no cask (HTTP 404) | `formulae.brew.sh/api` | None
File extension `.fmd` | Microsoft Access templates before 2007, MotionArtist documents, FARSITE fuel model data | Search only | Low. None is a text format
Android "FMD" | Find My Device, an open-source Android app on F-Droid | Search only | Low for a developer, real for a general search
`fmd.dev` | Answered HTTP 403 | `curl` | `UNVERIFIED:` who holds it. A 403 says only that something answers
`fmd.app` | No response within 20 seconds | `curl` | `UNVERIFIED:` whether it is registered

**The conclusion.** `fmd` is safe as an internal name. It is not safe as a command, an npm package or
a public handle, because each is taken or collides with a live markdown tool.

**The recommendation that follows.** Never ship a binary, a package or a public repository named
`fmd`. If a command line is built, name it after the public name.

**What was not checked.** Medical and veterinary uses of FMD. `UNVERIFIED:` they exist and would
dominate a general search, but no page was opened for them.

---

## 6. Limits of this file

**What was opened.** The 28 home pages in section 1, by `curl`, one of them through a reader proxy.
Docmost and Sudowrite were fetched and left out as off-brief. Registry APIs for npm, PyPI,
crates.io, GitHub and Homebrew.

**What came from search results only.** FlowMD, MD Flow, FluentMark, `iceddev/remark`, the `.fmd`
extension meanings, and the Android FMD app. Their rows are marked.

**What a home page cannot show.** A headline is a snapshot. Several of these sites rotate hero text
or render it with JavaScript, which `curl` does not run. Gamma's page returned a challenge and is
left out.

**What was not assessed.** Trademark, in India or anywhere. D05 and legal row L09 own that. No line
here is cleared for use as a mark.

**What no stranger has seen.** Every judgement about which line "reads naturally" is the author's.
The test in section 4.1 exists because that judgement is not evidence.

**What would falsify the shortlist.** A competitor publishing a file-first headline before we do, or
the five-second test showing strangers cannot say what line 1 means.
