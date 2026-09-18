---
id: 04-PERSONAS-AND-JOBS
title: Personas and jobs
mode: explanation
tier: canonical
status: draft
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [personas, jobs-to-be-done, audiences]
---

# 04. Personas and jobs

**Four readers. The fourth is not a person.** Three are the audiences the plan names at
`docs/mvp0/PRODUCT-PLAN.md` section 1. The fourth is the agent, which reads more of the published web
than people do and has no patience at all.

**Read section 6 before acting on any of this.** Not one of the four has been interviewed.

## 1. The four at a glance

Id | Who | The one sentence they would say | Proven to pay?
P1 | Founders and product people who brief agents | "I want to hand my agent a brief it can actually build from" | No
P2 | Writers who want Google Docs comfort | "I want to write without seeing the syntax, and still own a plain file" | No
P3 | Obsidian and Notion people | "I want my notes on the web, shared, and readable by my agent" | **Yes, on the audit's reading**
P4 | The agent | "Give me the markdown and tell me where everything is" | It does not pay. It decides whether P1 to P3 get value

## 2. P1, the person briefing an agent

**Their sentence:** "I want to hand my agent a brief it can actually build from."

**The job.** Turn a half-formed idea into a set of files an agent can read and build against, without
spending two days writing them, and without the agent inventing the parts that were never decided.

Question | Answer
What they use today | Claude Code, Cursor or Codex, plus an AGENTS.md or CLAUDE.md they hand-maintain
What frontmatter offers | Idea mode: a depth, 10 to 30 questions, and a fifteen-file blueprint published at an unlisted link with a kickoff prompt
Which screens | S12 to S16, plus S11 for the instruction files
What would make them switch | The brief is better than the one they would have written, and it took twenty minutes
What would make them leave | The questions feel like a form. The plan's own answer is that a recommendation sits under every question and Skip all exists from page two
Evidence it is a real job | GitHub's approximate code-search count shows about 547,840 files named AGENTS.md at repository root and 527,360 named CLAUDE.md, measured 2026-09-18
Evidence it is a **thin** job | Public repositories carrying the GitHub Spec Kit file layout number about 4,736, against 137,619 stars on the Spec Kit repository

**How to read those last two rows together.** The instruction file is universal. The written spec
is admired and rarely used. INFERENCE, from `docs/research/2026-09-18/raw/Z5-numbers-refreshed.md`:
that is the best moment to sell a nicer way to write a spec, and the worst moment to bet the
company on it.

**A caution the plan does not carry, and should.** Two independent studies find instruction files do
not raise task success, one measuring over 20 per cent added cost. The screen must not imply that
tidying the file makes the agent cleverer. The source is
`docs/mvp0/SCREEN-CHANGES-2026-09-18.md`, the S11 note.

## 3. P2, the writer who wants Google Docs comfort

**Their sentence:** "I want to write without seeing the syntax, and still own a plain file."

**The job.** Write and format a document the way a word processor lets you, without accepting that
the document then lives inside somebody's database.

Question | Answer
What they use today | Google Docs, Notion or a word processor, with the file in somebody else's store
What frontmatter offers | Doc mode: a Google-Docs-shaped surface over a markdown file, plus sharing, comments and a published page
Which screens | S05 for Doc mode, S17 to S21 for sharing, review and history
The honest scope | Of 64 Google Docs features classified from Google's own help pages, 20 are plain markdown, 15 need an extension and 29 cannot live in a text file
What the 29 are | Everything that needs a canvas rather than a stream of text. The product refuses them rather than faking them
What would make them switch | It looks like the tool they know, and the file is theirs
What would make them leave | The AI writes when they did not ask. In the lowest-rated Notion reviews, unwanted AI appeared 13 times in 33
The rule that follows | Ghost text is off by default, and the settings have an off switch. The source is the principle set at `docs/mvp0/PRODUCT-PLAN.md` section 16

**The one measurement Google gives us for free.** Their own rule when exporting a document to
markdown is that "Font colors, highlights, and text alignment are removed". That is the boundary,
published by the largest incumbent, and Doc mode sits exactly on it.

## 4. P3, the Obsidian or Notion person

**Their sentence:** "I want my notes on the web, shared, and readable by my agent."

**The job.** Reach a vault that currently only exists on one machine, from a browser, and let other
people and other agents read it without giving up the files.

Question | Answer
What they use today | Obsidian with plugins, or Notion, or both
What frontmatter offers | Import a whole vault byte for byte, then the web, sharing, publishing and an agent that reads it
Which screens | S22 for import, S04 for the workspace, S17 and S18 for sharing
What would make them switch | The three things Obsidian's own forum asks for loudest
What would make them leave | A lossy import. One mangled file in a two-thousand-file vault ends the trial
Proven to pay | **Yes.** The plan says so in its own words at `docs/mvp0/PRODUCT-PLAN.md` section 1

**What their own forum asks for**, from the plan's research round. 6,051 feature requests are open,
and frontmatter answers sixteen of the thirty most-liked.

Request | Hearts | Where it stands
Editing an embedded note in place | 1,078 | Their most-liked. An extension of the Live view we already ship
A web version | 949 | Absent from Obsidian's published roadmap
Global search and replace | 650 | Still does not exist in Obsidian

**What they complain about**, across 156 phone-app reviews: clumsy editing 35, sync 26, slow start
13, lost data 13. **What they praise** in the same set: design 35, simplicity 34, sync 18.

**What ninety-five of them have already built.** Filtering the live plugin registry on 2026-09-18
for ids containing agent, claude or mcp returns about 95 plugins. The largest, `realclaudian`, has
2,135,277 downloads. Six of the top seventeen exist to expose a person's notes to an agent over
MCP.

**The risk in the same fact.** Obsidian's chief executive publishes an agent-skills repository with
48,515 stars, created 2026-01-02. The plan carries "Obsidian takes the agent position" as a future
risk at `docs/mvp0/PRODUCT-PLAN.md` section 27. It is not a future risk. It is in progress.

## 5. P4, the agent

**Its sentence:** "Give me the markdown and tell me where everything is."

**Why it is in this file.** In August 2026, on Mintlify-powered sites, agents made 257 million web
requests against 131 million human page loads. That is close to two to one. The same report says
83 per cent of agent traffic arrived through deliberately machine-friendly routes: markdown
versions of pages, `llms.txt` files and agent skills.

**It is a reader with no patience**, and the measurements say so.

What it wants | What the measurement says | What we owe it
The raw markdown, not the rendered page | 83 per cent of agent traffic takes the machine route | `page.md` beside every published page
An index it can reach in one hop | Linking `llms.txt` from the markdown page made a 20x improvement in navigation, and cut token use by up to 60 per cent | A generated `llms.txt`, linked from the markdown
No gate, no redirect, no interstitial | A gate is invisible to an agent, which does not click | The rule is already absolute at `docs/mvp0/PRODUCT-PLAN.md` section 5
A file it can write into without breaking it | The top thread of the year asked whether front matter and nested fences survive an agent edit, and got "optimistic parsing" as the answer | Splice-only writing, and a refusal when the range is ambiguous

**Why this is mechanically cheaper for us than for anyone else.** Every rival stores blocks and has
to generate markdown from them. Our source of truth is already the markdown file, so serving the
raw bytes at `page.md` is a route rather than a converter.

**And the reason the agent decides whether the others get value.** Quoted on Mintlify's page and
attributed to Sarah Deaton, Technical Content Engineer for Claude Code at Anthropic:

> "The same page that misled one developer now misleads an unknowable number of agents, which then
> propagate that misunderstanding to downstream users."

That quotation keeps its source punctuation.

## 6. Which one is proven to pay

**Only P3.** The plan's words at `docs/mvp0/PRODUCT-PLAN.md` section 1: "The audit's reading of the
evidence is that only the third group is proven to pay today."

**The pilot is weighted to match**, at `docs/mvp0/PRODUCT-PLAN.md` section 28.

Group | How many | The qualifier
Obsidian users | 10 | A vault of at least 200 files, and a post in the web-version or sync threads
Founders and product people | 5 | Have run Claude Code, Cursor or Codex on a project in the last month
Google Docs writers | 5 | Write there and share by link

**What "proven to pay" rests on**, and it is worth stating plainly. It rests on a paid
single-purpose tool already selling to this group, and on 148,696,933 plugin downloads showing they
install things. It does not rest on anyone saying they would pay us.

## 7. The ten reasons people switch

Ranked by mentions across every source the plan's research read. P3 is the group that names most of
them.

Driver | Mentions | Which persona
Own files | 28 | P3
Setup burden | 24 | P2 and P3
Databases and migration | 23 | P3
AI edits you cannot switch off | 21 | P2
Price and metering | 20 | All three
Sync | 19 | P3
Speed | 19 | All three
Offline and longevity | 19 | P3
Open source | 17 | P3
Teams | 16 | P1 and P2

**Two of those ten are things we must not do to them.** An AI edit they cannot switch off is the
fourth most-cited reason people leave, and price metering is the fifth. The plan's answers are an
off switch in settings with ghost text off by default, and a cost stated before the click.

## 8. The limits of this file

**What was not assessed.** Whether any of P1 to P3 exists in the numbers claimed. Every figure here
is about a population, not about a named person who has used this product.

**What could not be verified.** The Obsidian forum figures (6,051 requests, and the hearts on three
of them) come from the plan's own research rounds and were not re-fetched in this session.
UNVERIFIED on re-fetch. The plugin-registry and star counts were re-measured on 2026-09-18 and are
recorded in `docs/research/2026-09-18/raw/Z5-numbers-refreshed.md` `[O]`.

**What is not established.** That P1 and P2 are separate people. INFERENCE: a founder who briefs an
agent and a writer who wants Doc mode may be the same person on different days, and the pilot is
the cheapest way to find out.

**What would falsify this file.** A pilot in which the Obsidian ten are the least active group. P3
carries the whole payment case, and if the people with the largest vaults are the ones who stop
opening it, the case moves to P1 and the build order changes with it.
