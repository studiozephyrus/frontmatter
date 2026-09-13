---
title: What can be generated from plain text, and which of it is worth building
date: 2026-09-13
time: 21:13 IST
for: Sagnik and Amit
status: proposal, not plan. Argue with it before any of it moves into the card set.
---

# What can be generated from plain text

You asked two things. What can we make out of a markdown file, and where are the ideas
weak. The second half is the useful half, so it gets its own section and I have not
softened it.

## 1. The sentence

The positioning you wrote is close, and I think it wants tightening. "A markdown editor
that improves your agentic and AI operating system" describes the effect rather than the
thing, so a stranger cannot tell what they get.

What I would say instead:

> **frontmatter is where you write the documents your agents read.**

That sentence does three jobs. It says what it is, an editor. It says who it is for,
somebody running coding agents. And it says why this editor rather than any other, because
the output is aimed at a machine that will act on it.

The review layer then has an obvious home. It stops being the headline claim, which the
market has already taken apart, and becomes the thing that answers one question: which
parts of this spec has a person actually read, and which did the agent write while nobody
was looking. That is a smaller claim and a truer one.

## 2. The generation surface

Everything below starts from plain text. I have rated each on how hard it is to build,
and separately on whether it is a reason to choose us. Those two ratings are not the same
and confusing them is how a roadmap goes wrong.

### Already in the product, or close to it

| Output | Build | A reason to switch? |
|---|---|---|
| PDF | done | No. Every editor does it |
| HTML | done | No |
| Word | done | No |
| Print path in the browser | done | No |

These are table stakes. They matter because "markdown to pdf" is something people search
for, so they bring strangers in. They will not make anyone pay.

### Cheap to build, and genuinely useful

| Output | Build | A reason to switch? |
|---|---|---|
| Mermaid diagrams written from prose | days | Some. The editor already renders them |
| A kickoff prompt for their agent | days | Yes, if the kit behind it is good |
| `CLAUDE.md`, `AGENTS.md`, `.cursorrules` | days | **Yes. Nobody serves this well** |
| A glossary pulled out of the document | days | Small |
| Changelog from the git log | days | Small |
| Templates per project type | days | Yes, as perceived value |

The third row is the one I would move on first, and it is not in the plan anywhere. Every
person running Claude Code, Cursor or Codex maintains a hand-written instruction file that
their agent reads on every session. Those files are load-bearing and everybody writes them
badly, in a code editor, with no structure and no way to tell whether the agent actually
honoured them. That is an editor problem and it is ours.

### The doc kit

Your screenshot is the product. Thirty-three files from a prompt and a handful of
questions: executive summary, product and domain, architecture, data model, API reference,
frontend and backend specs, integrations, design system, environment, local setup,
deployment, security review, tech debt, testing, glossary, codemap, traceability, roadmap,
runbook, open decisions.

Build effort is weeks, not days, and the reason is not the file count.

**The hard part is that the files have to agree with each other.** Any agent will write you
thirty-three files. Getting `04-API-REFERENCE` to describe the same endpoints that
`03-DATA-MODEL` implies, with the same names, is the entire job. A kit whose files
contradict each other is worse than no kit at all, because the user hands it to their
agent and the agent builds the contradiction without noticing. That failure is silent and
it lands three weeks later.

So the kit needs a consistency pass that is part of the product, not part of the prompt.
Names extracted and checked across files. Every claim in a spec traceable to an answer the
user actually gave. That check is the defensible part. The generation is not.

### Slides

Markdown to slides is a solved problem with free, good, established tools. Marp, Slidev
and reveal.js all do it, they have mindshare, and the `---` between slides is a decade-old
convention.

**Verdict: ship it as an export, never as a headline, and spend days on it rather than
weeks.** Nobody will move editors for slides. But somebody who is already here, who has
just pasted a chat output and cleaned it up, will be glad the deck falls out for free. It
is a retention feature wearing an acquisition feature's clothes, and the mistake would be
pricing or positioning it as the latter.

The version of this I would actually build is narrower and better: not a slide editor, but
one command that turns a document into a deck on a fixed template with no options. The
whole value is that you did not have to open Keynote.

### Further out

| Output | Build | Honest note |
|---|---|---|
| Test plan from a spec | weeks | Useful, but only once the kit is trusted |
| ADRs from the decisions | days | Small audience, cheap, fine to have |
| Traceability matrix | weeks | This is the enterprise sale, not the MVP |
| Charts from tables | weeks | Low value. People paste images |

## 3. Where I think the ideas are weak

You asked for the critique, so here it is straight.

**Live collaborative editing is the wrong thing to build and I would drop it.**

Two people editing the same document in real time means either operational transforms or
CRDTs, and the repo settled against CRDTs on evidence, for good reasons that have not
changed. Building live multiplayer would reopen a settled architectural decision, cost
months, and compete directly with Google Docs and Notion on the one axis where they are
strongest.

What the product actually needs is much cheaper. Share a link. Let the other person read
it, comment on it, and suggest an edit you accept or refuse. For a document kit that gets
reviewed before it goes to an agent, asynchronous review beats live cursors, and it costs
a fraction. If you want a free-tier hook, make it "share with two people" on a read and
comment link rather than on live editing.

The Google login and share by email or username are fine and cheap. Keep those.

**The PDF conversion cannot be the headline.**

Pandoc is free and every editor exports PDF. It brings search traffic and it should be on
the landing page, but a person does not adopt a new editor to get a PDF. The thing worth
leading with is the one you described almost in passing: paste what the model gave you and
get something you can hand to a person. That is a daily irritation with no good answer
today, and it needs no explanation to anyone who uses these tools.

**GitHub and local machine access on the top plan is the riskiest item in the whole list.**

Two problems. It reopens every legal question in `L1`, because holding a customer's code
makes us an intermediary with duties we have costed at seventy-four founder hours and have
not paid. And it puts us in direct competition with Claude Code, Cursor and Codex, which
already live on the local machine and are very good at it.

I am not saying never. I am saying it is the last thing to build, not a plan item, and the
version worth doing is narrow: read the repository to write better documents about it.
Never write to it. Reading is a different legal and product proposition from writing, and
the whole value is on the reading side anyway.

**"Features they do not know they need" is the right instinct and the wrong plan.**

You wrote that users should only have to write or talk and we handle the rest. I agree
with the ambition. The risk is that it describes a product with no visible edges, and a
product with no visible edges is one a stranger cannot evaluate in thirty seconds, cannot
describe to a colleague, and will not pay for. The way this gets built in practice is one
narrow thing that works perfectly, and then the next. Paste a chat output, get a clean
document. Then the kit. Then the instruction files. The magic accumulates; it cannot be
the opening move.

**One more, and it is the one I am least sure about.**

We now have an editor, a converter, a kit generator, a template system, a sharing layer, a
presentation generator, a review layer, an offline mode and a GitHub connector. That is
nine products. At the measured pace of 1.21 engineering days a week, with one person
building, this list is not a roadmap. It is a wish. `FF14` asks exactly this question and
it is still open, and I think it is the most important card in the set right now, more
than `L1`.

## 4. What I would actually build first

**MVP zero, the thing a stranger meets.** The editor with the md.sgnk.ai look, paste and
clean up, export to PDF and Word. No account. This is the front door and it should be
genuinely excellent and very plain.

**MVP one, the reason to come back.** The document kit from a prompt and a few questions,
at an unlisted link, with a kickoff prompt to paste into their agent. Twenty of these made
by hand first, which is already the gate in the plan.

**MVP two, the reason to pay.** The instruction files for their agents, and the consistency
check across a kit. This is where the review layer earns its place, because the question
"has a person read this, or did the agent write it and nobody looked" is exactly the one
that matters when the document is the input to a build.

**After, in this order.** Share and comment. Templates by project type. Slides as a
one-command export. Offline with their own key. Repository reading, read only.

## 5. What this does to the question set

This changes what the cards are about, so the set needs work before you sit with it. Three
things, and I have not done them yet:

1. **Cards written against the old headline need rewriting.** `P2` is the clearest case.
   It asks whether review state stays the headline, and the answer is now no, so the card
   should ask where the review layer belongs instead.
2. **The new surface has no cards at all.** Sharing and its free tier shape, presentations,
   templates by project type, the instruction files, the consistency check, repository
   reading. Each of those is a decision nobody has written down.
3. **The voice pass has to run again afterwards**, because rewriting cards is how the AI
   patterns get back in.

Doing this properly means rewriting perhaps thirty cards and adding ten to fifteen. That
is the next block of work and I would rather do it against a direction you have agreed than
against my reading of one message.
