---
id: 02-PRODUCT-AND-DOMAIN
title: The product and its domain
mode: explanation
tier: canonical
status: draft
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [problem, projection-law, splice, change-queue]
---

# 02. The product and its domain

**Why a byte-exact editor exists, written for somebody who does not write code.** If you already
know what a splice is, skip to section 6.

## 1. The problem, in the words of people who have it

Every quotation below was copied from a page opened on 2026-09-18 by the research round in
`docs/research/2026-09-18/`. None of it is ours.

**A stranger named the problem at the top of the biggest markdown launch of the year.** User
`toozitax`, on the OpenKnowledge thread at `news.ycombinator.com/item?id=48675435`, verbatim:

> "the frontmatter question is the one i'd want answered before trusting it: when an agent edits a
> file does it round-trip YAML frontmatter and nested code fences cleanly, or does that stuff get
> mangled? every "wysiwyg markdown" tool i've tried falls apart there."

The founder's reply, verbatim: "Re:front-matter, we do optimistic parsing of it, haven't seen any
issues with it." That is the honest state of the art. A hope, not a test.

**A second stranger described the failure a queue has to survive.** User `abdullin`, same thread,
verbatim:

> "There often are a multiple agents rolling out linked changesets to a bunch of documents on
> behalf of controlling humans. Eg updating compliance policy, and references and change log and
> current procedures at the same time.So changesets have to be atomic across multiple documents and
> semantic (so that agents can resolve the changes). Weak per-document versioning isn't enough here."

**A third described the human step nobody has built.** User `chrisdudek`, on the Agent Kernel
thread at `news.ycombinator.com/item?id=47486287`, verbatim: "the agent writes what happened, I
decide what actually matters."

**And the survey behind all three.** Mintlify's 2026 State of Knowledge Report, published
2026-09-16 from 329 respondents, verbatim:

> "83% of respondents say AI agents now draft documentation updates for their team. But humans
> haven't left the loop-only 9% let agents publish without review."

That quotation keeps its source punctuation, which is why it carries a long dash our own prose
never uses.

**What those four say together.** Machines now write a large share of the documents people own.
People will not let those documents ship unread. The only working review surface in the whole
market is a pull request, which is a developer's tool.

## 2. Why the bytes matter more than they look like they should

A markdown file is plain text. That makes it feel safe, and it is not.

A document carries things a reader never sees. A YAML block at the top holds the title, the tags
and the dates. A fence holds code, and a fence can hold another fence. A reference link keeps its
target at the bottom of the file. A comment holds a note the author left for themself.

**Most editors rebuild the file when they save it.** They read the text, build a tree in memory,
then write a fresh file out of that tree. Anything the tree did not model is gone. The document
still looks right, so nobody notices for weeks.

**What the research measured.** Comments, anchors, spacing and reference links disappeared in all
three competitor teardowns recorded in `specs/engine/splice-writer.md`.

**Our gate for this is a corpus of foreign files**, meaning files this project did not write. It
was run in the session that produced this document `[O]`:

```
$ npm run corpus
pinned   8513
verified 8513
changed  0
CORPUS CLEAN - 8513/8513 byte-identical
```

One changed byte in any of those 8,513 files fails the build.

## 3. The projection law

**The file on disk is the only source of truth. Every view is a deterministic, stateless
projection of it.**

In plain words: whatever you are looking at, the file is the real thing, and the screen is a
picture of it drawn fresh each time.

- **Deterministic** means the same file always draws the same picture.
- **Stateless** means the picture holds nothing of its own. Close it, reopen it, and nothing is
  lost, because there was nothing there to lose.

**Why the rule is strict.** The moment a view keeps something the file does not hold, there are
two versions of the truth. They agree on the first day. They do not agree on the hundredth.

**What follows from it.** Doc mode, Markdown mode, the flow view, the published page, the portfolio
and the Google Drive copy are all pictures of the same bytes. That is why none of them needed a
new file format.

## 4. Splice-only writing

**The engine locates a byte range and replaces exactly those bytes.**

Think of a long paper document and a very careful clerk. The clerk finds the one line you asked
about, cuts out exactly that line, and glues the new one in. The clerk never retypes the page.

**The contract**, quoted from `specs/engine/splice-writer.md`:

> "Locate the byte range of the target, replace exactly those bytes, and leave every other byte of
> the file bit-identical. Never regenerate the document from a parse tree."

**And the part people find strange.** When the clerk cannot tell which line you meant, the clerk
does nothing and says so.

> "When the range cannot be located unambiguously, **return the input unchanged** and say why.
> Refusal is a correct outcome; guessing is not."

**Refusal is the product, not a bug in it.** A tool that guesses well 99 times and wrongly once has
corrupted a document, and the person will not know which one. A tool that refuses has cost ten
seconds.

**Six invariants hold the contract**, each with an executable check, listed in the same spec.

Rule | In plain words
1 | Nothing outside the target range changes
2 | The writer never crashes. It returns the file or a new file
3 | A target it cannot find is refused, never appended and never guessed
4 | Line endings and any byte-order mark survive exactly
5 | Every operation is tested on its own, so two faults cannot cancel each other out
6 | There is exactly one splice implementation in the repository

**Rule 5 has a history.** Testing set and delete together hid a real defect, because each undid
the other's damage. That defect is `specs/engine/nf-003-bare-cr-fence.md`.

## 5. The change queue

**Every change by a person, an AI edit or an agent enters a queue where the owner accepts or
rejects it one by one. No silent merge, ever.**

The nearest thing most people have seen is tracked changes in a word processor. The differences
matter.

Property | Tracked changes | The change queue
Covers a machine edit made while the file was closed | No | Yes
Survives the accept | No. Once accepted, the text is ordinary text | Yes. The decision is written into the version record
Works on a file another tool owns | No | Yes. The file is markdown on disk
Needs the person to understand a diff | Not really | It must not, and that is the hard part

**What is in the record when you accept.** The plan's format specification at
`docs/mvp0/PRODUCT-PLAN.md` section 20 names the fields: `author`, `source` with a value of person, ai or
agent, `model`, `ask`, `accepted_by` and `at`. Nothing is written into the file itself by default.

**A known gap, already recorded.** The queue reviews one change at a time. An agent that updates a
policy, its references, the changelog and the procedure has made one logical edit across four
files. Accepting three of the four leaves the vault inconsistent. The fix is a run identifier that
groups them, and it is in `06-COMPETITIVE-LANDSCAPE.md` as finding FH3, not yet in the plan.

**What this replaced.** The plan of 9 September had a per-span read state in a sidecar file at
`.frontmatter/review.jsonl`. It never existed in the code, it failed an adversarial round on
8 September, and it was dropped on 17 September. The change queue is what took its place.

## 6. What the product is not

Three decisions, each already taken, each with a reason that has been checked.

**Not a new format.** The verdict is to build a compiler and an editor. Markdown, YAML front
matter, AGENTS.md, SKILL.md and llms.txt are the formats, and not one of them is ours. Where the
plan does invent a block, the block carries a version field, a rule for unknown fields, a stated
behaviour in a plain reader, and a test.

**Not a plugin platform in year one.** Obsidian's own words, quoted in the plan: it "cannot
reliably restrict plugins to specific permissions". Visual Studio Code's: an extension runs with
"the same permissions as VS Code itself". An API and an MCP server sit in the Later column instead,
because both can be scoped.

**Not a chat app with a document attached.** The editor helps in exactly four places: the AI box on
an empty document, the AI menu on a selection, the problems panel and the instruction-file health
panel. INFERENCE: a chat window beside a document invites the model to rewrite the whole thing,
which is the behaviour splice-only writing exists to prevent.

## 7. The three audiences

Named at `docs/mvp0/PRODUCT-PLAN.md` section 1. Each row carries the sentence that person would say.
`04-PERSONAS-AND-JOBS.md` takes this further.

Audience | What they would say | Proven to pay?
Founders and product people who brief agents | "I want to hand my agent a brief it can actually build from" | No
Writers who want Google Docs comfort | "I want to write without seeing the syntax, and still own a plain file" | No
Obsidian and Notion people | "I want my notes on the web, shared, and readable by my agent" | **Yes, on the audit's reading**

**The plan says so in its own words**, at `docs/mvp0/PRODUCT-PLAN.md` section 1: "The audit's reading of
the evidence is that only the third group is proven to pay today."

**The receipts for the third group**, measured on 2026-09-18 and recorded in
`docs/research/2026-09-18/raw/Z5-numbers-refreshed.md` `[O]`.

Measure | Value
Obsidian plugins in the registry | 7,706
Total plugin downloads | 148,696,933
Plugins whose id contains agent, claude or mcp | about 95
Downloads of the top one, `realclaudian` | 2,135,277
Stars on the Obsidian chief executive's agent-skills repository | 48,515

**How to read that.** About ninety-five separate people have shipped a plugin to join an agent to
a vault. Six of them clear ten thousand downloads. Their own maker has not built it for them.

**And the warning in the same numbers.** The plan's section 6 sets a rule: a capability that is a
top add-on in three or more ecosystems ships built in. By that rule, the MCP server belongs in the
build and not in the Later column, where the plan currently puts it.

## 8. The limits of this file

**What was not assessed.** Whether any of the three audiences will pay. That is
`05-USER-EVIDENCE.md`, and today it is empty on purpose.

**What could not be verified.** The three Hacker News quotations were copied from the research
file, not re-fetched from the site in this session. UNVERIFIED on re-fetch, verified on the
research file's own record of the URL and the date it was opened.

**What is not established.** That refusal reads as a feature to a person who has never lost a
document. The plan's own principle set says every AI proposal must preview in place and undo in one
step, and nobody has watched a stranger meet a refusal.

**What would falsify this file.** A pilot in which people accept every proposal without reading it.
If the accept rate is near total, the queue is a speed bump and not a product, and the measure that
would show it is already defined at `docs/mvp0/PRODUCT-PLAN.md` section 28: proposals accepted against
rejected, individually against Accept all.
