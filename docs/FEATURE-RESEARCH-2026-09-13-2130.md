---
title: User-facing features, and which of them anybody is actually short of
date: 2026-09-13
time: 21:30 IST
for: Sagnik and Amit
status: research. Every figure below was fetched on 2026-09-13 and is cited to the page it came from.
---

# What features to have

You asked whether the research was done. It was not, and I said so. What I had given you
before was reasoning with one measurement attached. This is the pass.

Everything with a number in it was fetched on 2026-09-13. Where I could not verify something
I have said so rather than filling the gap.

## 1. The finding that changes the plan

I proposed generating the instruction files that agents read, and I proposed it on instinct.
It turns out to be much better founded than I knew, and it is now the strongest single item
in this document.

**`AGENTS.md` is an open standard with real adoption.** From agents.md, fetched 2026-09-13:

- used by **over 60,000 open-source projects**
- stewarded by the **Agentic AI Foundation under the Linux Foundation**, so it is governed
  rather than owned by one vendor
- read by roughly two dozen agents including Codex, Cursor, Jules, Aider, goose, Zed, Warp,
  VS Code, Devin, Junie, Gemini CLI, GitHub Copilot's coding agent, Windsurf and Amp
- **nested**: agents read the nearest file up the directory tree, and the page states that
  the main OpenAI repository has **88 `AGENTS.md` files**

**`CLAUDE.md` has four scopes and documented failure modes.** From the Claude Code memory
doc, fetched 2026-09-13: a managed policy file deployed org-wide by IT, a user file, a
project file, and a local one, plus imports, path-specific rules under `.claude/rules/`, and
symlinks to share rules across projects.

The part worth reading twice is that page's own troubleshooting list:

- Claude is not following my `CLAUDE.md`
- my `CLAUDE.md` is too large
- instructions seem lost after `/compact`

That is a vendor documenting, in its own manual, that the file people hand-write is often too
big, often ignored, and does not survive compaction. Those three lines are a product brief.

**Why this is ours.** Eighty-eight hierarchical markdown files, written by hand, in a code
editor. No way to see which one wins for a given path. No way to tell whether what you wrote
is too large. No way to know whether the agent honoured it. That is an authoring and review
problem in markdown. It is the most precise fit between what this
product already is and something a large number of people are visibly short of.

It also gives review state an honest job. Not "what percentage of the repo is unreviewed",
which the market took apart, but "this instruction file was written by an agent and no person
has read it, and it is what your agents are about to obey".

## 2. What is table stakes

Do not spend build weeks here. These bring search traffic and they will not win anyone.

| Feature | Who has it |
|---|---|
| Markdown to PDF, HTML, Word | everyone, and pandoc is free |
| Live preview | every editor in the comparison |
| Markdown to slides | Marp, Slidev, reveal.js, all free and established |
| Syntax highlighting, tables, mermaid | everyone |
| Dark mode | everyone |

## 3. What the market charges for

Checked on the two closest paid products, fetched 2026-09-13.

**Obsidian.** The editor is free. The paid products are **Sync** and **Publish**, with a
separate **commercial licence**. Prices on the page include $8, $5, $4 and $50, and I did not
open enough of the page to bind each number to its exact product, so treat the pairing as
unverified and the shape as solid.

**HackMD.** Tiers are Free, Prime and Enterprise, with $15 appearing on the page.

**The shape is consistent and it corroborates `PR24`.** Nobody charges for the editor. They
charge for where the files live and who can see them. That is what `PR24` already proposes,
and it is the one pricing position in the set I would now call well founded rather than
argued.

## 4. What a stranger can do before signing up

Measured by fetching each landing page and counting sign-in, sign-up, log-in and
create-account in the HTML with script blocks stripped.

| | Sign-in words | Editor on arrival |
|---|---|---|
| dillinger.io | 0 | yes, Monaco in the landing HTML |
| stackedit.io | 0 | yes |
| excalidraw.com | 0 | yes |
| hackmd.io | 16 | no |
| typst.app | 8 | behind a canvas |
| **frontmatter** | **the page is the login screen** | **no** |

Already card `AC20`.

## 5. The feature inventory

Rated twice, because build cost and reason-to-switch are different things and confusing them
is how a roadmap goes wrong.

### Worth building, in this order

| Feature | Build | Why |
|---|---|---|
| Editor open with no account | days | Nothing in the plan works without it |
| Paste a chat output, get a clean document | days | The daily irritation, needs no explanation |
| One sample in the empty state | a day | Shows generation, which is the different part |
| `AGENTS.md` and `CLAUDE.md` authoring | weeks | 60k projects, 88 files in one repo, documented failure modes |
| The document kit, with a consistency pass | weeks | The consistency pass is the defensible half |
| Review state, scoped to instruction files | weeks | Gives the claim a job nobody has taken |
| Share and comment on a link | weeks | Not live editing. Reasoning in the generation doc |

### Worth having, later, cheap

Templates by project type. Slides as one command with no options. Mermaid written from
prose. A glossary pulled out of a document. Changelog from the git log. ADRs from the
decision set.

### Worth being careful about

**Offline with the user's own key.** Fits the privacy claim and the zero-bytes rule, and it
is a real differentiator against everything in section 3. It is also a second runtime to
build and support, so it belongs after the pilot rather than in it.

**Repository reading.** Strong on value, heavy on risk, and it should stay read only
whenever it arrives. Writing to a customer's repository reopens every question in `L1`.

**Live collaborative editing.** I would still drop it. Reasoning unchanged from the
generation document.

## 6. What I did not verify

- I did not bind each Obsidian price to its exact product. The shape is verified, the
  pairing is not.
- **Closed, partly.** I said I could not measure whether these files are maintained. I sampled
  eight repositories through the GitHub API on 2026-09-13 and they are, heavily: 77 commits
  touching `AGENTS.md` in `openai/codex`, 64 in `apache/airflow`, 35 in `vercel/next.js`. The
  files are substantial, up to 36,577 bytes, roughly 6,100 words. `apache/airflow` and
  `vercel/next.js` both keep `CLAUDE.md` as a git symlink to `AGENTS.md`, mode 120000, while
  `danny-avila/LibreChat` keeps two real files that have drifted to 7,415 against 23,170 bytes.
  That drift is the problem, visible in public. The sample is a convenience sample of large
  active projects, so it says what happens in a live repository rather than what a median
  project does. A random sample is still worth taking.
- I have no evidence on willingness to pay for any of this. Nobody has been asked. That gap
  is already recorded in the gap register and none of the above closes it.
- Slide tooling: I confirmed Marp and Slidev exist and are reachable. I did not compare
  their output quality against what we would build.

## 7. What this changes

Three things.

1. **The instruction files move up.** They were sixth in the 17.5 order on instinct. On this
   evidence they belong right after the kit, and possibly before it.
2. **`PR24` is better founded than the card says.** Both comparable products give the editor
   away and charge for sync and publish. The card can state that as measured rather than
   argued.
3. **Review state gets a specific job.** Scoped to the files agents obey, the claim stops
   competing with four free tools and starts answering a question nobody else is answering.
