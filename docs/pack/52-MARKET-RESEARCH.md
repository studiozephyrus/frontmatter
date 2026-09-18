---
id: 52-MARKET-RESEARCH
title: Market research
mode: explanation
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [market, demand, evidence, falsification]
---

# 52. Market research

**What this file is.** The market from primary sources, with every number attached to a page
somebody opened on a stated date.

**What it is not.** A forecast, a market size, or a willingness-to-pay study. None of those was
done and this file says so rather than implying otherwise.

**The evidence.** `docs/research/2026-09-18/raw/`, nine lenses, **178 findings**, counted at write
time `[O]`:

```
grep -c '^### F' on each lens:
A 20, B 18, C 16, D 18, E 26, F 18, G 18, H 16, I 28 = 178
```

Plus two earlier rounds, `docs/research/2026-09-09/` and `docs/research/2026-09-13/`, which are
archives and are never freshness-reviewed.

---

## 1. The four numbers that moved

These four changed what the product is for. Each is quoted from the page it came from.

### 1.1 Agents outread humans, close to two to one

> "Something major happened this year: AI agents overtook humans as the primary readers across
> Mintlify-powered sites. In August alone, agents made 257 million web requests compared to 131
> million human page loads, which means that agent traffic now outnumbers human traffic by nearly
> 2:1."

**Source** `[M]`: <https://www.mintlify.com/blog/the-state-of-knowledge-2026-highlights>, opened
2026-09-18. Recorded at `docs/research/2026-09-18/raw/H-2026-launches.md:351`.

**And the route they take**, from the same page:

> "In August, 83% of agent traffic arrived through deliberately machine-friendly routes ...
> Markdown versions of pages, llms.txt files, and agent skills. And MCP tool calls exploded that
> same month, tripling since February."

**On the ellipsis.** The source joins those two clauses with a long dash, which this pack's house
style does not carry anywhere, including inside a quotation. **The ellipsis marks the elision so
that nobody reads an altered string as verbatim.** The same applies in section 1.2 below. Re-fetch
the page before putting either sentence in a deck.

**What follows.**

- A published page that gates or redirects is invisible to the majority reader.
- The `.md` twin is not a nicety. It is the main road.
- **This is why the 18 September decision on S18 went the way it did.** No gate, no redirect, no
  probe before first paint, and `page.md` and `llms.txt` never gated at all.

**The navigation number, which is the cheapest win in the whole round**, same page:

> "Adding a link to a site's llms.txt in the Markdown versions of pages made a 20x improvement
> over HTML. The failed requests per task dropped significantly when agents were given a path to
> all the content on the site via the llms.txt file. This optimization also cut token consumption
> by up to 60%".

### 1.2 Only 9 per cent of teams let an agent publish unreviewed

> "Our survey confirms the trend: 83% of respondents say AI agents now draft documentation updates
> for their team. But humans haven't left the loop ... only 9% let agents publish without review.
> Documentation is becoming a system that reads itself and drafts its own improvements, with people
> deciding what's true and what ships."

**Source** `[M]`: the same Mintlify report, stated as "Complete survey findings from 329
respondents", opened 2026-09-18. Recorded at `docs/research/2026-09-18/raw/H-2026-launches.md:310`.

**This is the single most useful sentence in the round.** It converts the central bet from a
belief into a measured preference. 83 per cent have an agent drafting and 91 per cent insist on
review.

**And the gap it opens.** The only working review surface in the category is a pull request. A
person on a documentation team who does not use git is reviewing agent output informally or not
at all.

**Their own telemetry, on the same page**, which shows the volume behind it:

> "Between February and August 2026, users directed the Mintlify agent to update documentation
> nearly 367,000 times. By the end of that window, 95% of that volume was fully automated via
> webhooks and cron jobs, and more than 61% of the resulting pull requests were merged."

### 1.3 Documenting code and maintaining documentation are the top two AI tasks

From the Stack Overflow Developer Survey's AI section, task chart:

- **"Documenting code 30.8%"**
- **"Creating or maintaining documentation 24.8%"**

Both sit above "Debugging or fixing code 20.7%", above "Writing code 16.9%", and above
"Committing and reviewing code 10.2%".

**Source** `[M]`: <https://survey.stackoverflow.co/2025/ai>, opened 2026-09-18, HTTP 200.
Recorded at `docs/research/2026-09-18/raw/F-complaints.md:262`.

**Date it 2025, not 2026.** There is no 2026 Stack Overflow AI page `[O]`: re-probed on 2026-09-18
with `curl -s -o /dev/null -w '%{http_code}'`, `/2026/ai`, `/2026/` and `/2026/technology` all
returned 404, and `/2025/ai` returned 200.

**The companion number, from the same survey**, on 25,332 responses:

> "the biggest single frustration, cited by 66% of developers, is dealing with "AI solutions that
> are almost right, but not quite""

The inner pair of quotation marks is the source's own, around the phrase **"AI solutions that are
almost right, but not quite"**, which its chart prints at **66%**.

**"Almost right, but not quite" is the precise description of a document you have to read line by
line before you can believe it.** That is the change queue's reason to exist, stated by the market
rather than by us.

### 1.4 One request for a markdown file drew 6,644 reactions

**`anthropics/claude-code#6235`, "Feature Request: Support AGENTS.md."**

Measure | Value
Thumbs up | 5,161
Total reactions | **6,644** (`+1` 5,161, heart 438, rocket 361, hooray 326, eyes 289, laugh 48, confused 8, `-1` 13)
Comments | 396
Created | 2025-08-21
Closed | 2026-08-17, `state_reason: completed`

**Source** `[M]`: read off the GitHub API on 2026-09-18, recorded at
`docs/research/2026-09-18/raw/A-agent-tool-gaps.md:1000`.

**Why this matters more than its subject.** The loudest artefact in the whole round is people
asking a vendor to read a different markdown file. The instruction file is the interface, and its
fragmentation is a job somebody has to do by hand today.

---

## 2. How big the instruction-file layer actually is

Measured on 2026-09-18 with the GitHub code search API, one query a row, recorded at
`docs/research/2026-09-18/raw/Z-measured-by-me.md`.

Query | Reported count
`path:/ filename:AGENTS.md` | 547,840
`path:/ filename:CLAUDE.md` | 527,360
`filename:SKILL.md` (any path) | 6,111,232
`path:.kiro filename:requirements.md` | 33,216
`path:/ filename:GEMINI.md` | 27,072
`path:/ filename:llms.txt` | 21,120
`path:/ filename:.cursorrules` | 20,096
`path:.specify filename:spec.md` | 4,736

**Read the caveat before the numbers.** GitHub's code search returns an approximate
`total_count`, every figure came back suspiciously round, they are file counts rather than
repository counts, and only public repositories are covered. **Orders of magnitude, not counts.**

**Re-run the same day, the counts moved** `[O]`. `gh api -X GET search/code -f q='<query>' --jq
.total_count` on 2026-09-18 returned 501,760 for AGENTS.md, 532,480 for CLAUDE.md and 27,072 for
GEMINI.md. AGENTS.md fell by about 8 per cent between two runs a few hours apart.

**Three things follow.**

- The instruction file is not niche. Two of them clear half a million files at repository root.
- **AGENTS.md and CLAUDE.md are within about six per cent of each other, and which is larger
  flipped between two runs on the same day.** Neither has won, so a team using both tools maintains
  both files.
- **Our own plan's figure is stale.** `docs/mvp0/PRODUCT-PLAN.md` section 2 says AGENTS.md is used
  by over 60,000 projects. The root-level file count is eight to nine times that, across the two runs.

---

## 3. Who is on this ground already

### 3.1 Two products shipped in mid-2026 on our exact ground

**OpenMarkdown**, launched 18 July 2026 on Product Hunt with 190 upvotes. Its own words, opened
2026-09-18:

> "A local-first Markdown editor built for you and your agent."

> "No AI inside. That's the point. It runs on the agent you already have."

Its eight tools for an agent, quoted from its FAQ: `open_file`, `open_folder`, `reveal`,
`get_context`, `execute_command`, `read_section`, `write_section`, `wait_for_change`.

**And its conflict rule, which is our refusal law arrived at independently**, quoted:

> writes are "section-scoped with optimistic concurrency", and "if you and the agent touch the
> same section at the same time, the agent's write comes back as a `CONFLICT` so your unsaved edit
> is never clobbered"

**OpenKnowledge**, described by Tech Times on 27 June 2026 as a free, open-source editor wiring
Claude Code, Codex and Cursor into a local markdown editor. **It uses a conflict-free replicated
data type.**

**Checked 18 September** `[O]`: the repository is `github.com/inkeep/open-knowledge`, GPL-3.0,
4,251 stars, created 3 June 2026 and pushed the same day as this check
(`gh api repos/inkeep/open-knowledge`). It carries `packages/app/src/editor/utils/get-ydoc.ts`, and
a code search for `yjs` in the repository returns 323 hits, so the CRDT is Yjs.

**What neither has**, and it is the whole hard half of our plan: no web app, no account, no
sharing, no publishing, no live collaboration, no import, no idea mode, no doc mode, no phone, no
history, no tiers, no business model.

**Full record:** `docs/research/2026-09-18/raw/Z2-position-taken.md`.

### 3.2 Zed Delta, two days before this round

Public beta on **16 September 2026**, from <https://zed.dev/blog/delta-public-beta>. Their problem
statement, quoted, which is ours with the word code in it:

> "But with agents generating so much code, the diffs we're asking each other to review have
> mushroomed."

> "Last week, we crossed a key milestone: we disabled pull requests on Delta's own repository."

Their own usage figure, quoted: "33 of us have landed 570 changes to main since we turned off
pull requests."

**They build on a conflict-free replicated data type**, which is the position our plan rules out.
The rebuttal is owed and is now owed against two names rather than one.

### 3.3 Google published a format, and nobody built the editor for it

Date | What | Source
2026-06-13 | **Open Knowledge Format v0.1.** Knowledge as a directory of markdown files with YAML front matter | <https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/>
2026-07-25 | **v0.2 added trust signals**: `generated`, `verified`, `sources`, `stale_after`, `status` | <https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals>

Both opened 2026-09-18. Recorded at `docs/research/2026-09-18/raw/H-2026-launches.md:729`.

**Why this is the cheapest strategic item found.** The format is markdown plus front matter, which
is what the engine already promises not to mangle. Writing `verified` into a YAML block when a
person accepts a change in the queue is a small splice. **It also rehabilitates authorship
marking**, which was cut, and it is D06 in `56-OPEN-DECISIONS.md`.

### 3.4 Obsidian's own ecosystem is bolting agents on by hand

Measured 2026-09-18 by filtering the live plugin registry for ids containing agent, claude or mcp.
**About 95 plugins match.** Recorded at `docs/research/2026-09-18/raw/Z5-numbers-refreshed.md`.

Downloads | Plugin id
2,135,277 | `realclaudian`
267,218 | `agent-client`
79,408 | `claude-sidebar`
36,197 | `mcp-tools-istefox`
23,012 | `semantic-vault-mcp`
16,982 | `claude-code-ide`
10,601 | `ai-agent`

**Six of the top seventeen exist for one purpose**, to expose a person's notes to an agent over
the Model Context Protocol: `vault-as-mcp`, `mcp-tools`, `semantic-vault-mcp`,
`local-rest-api-second-brain-mcp-extension`, `cli-rest-mcp`, `mcp-rest`.

**Our own plan sets the rule this breaks.** `docs/mvp0/PRODUCT-PLAN.md` section 6 says a capability that
is a top add-on in three or more ecosystems ships built in. Ninety-five people shipped a plugin to
join an agent to a vault, and our plan has that capability in the Later column.

**And the ecosystem's owner is on the same ground.** `kepano/obsidian-skills`, **48,515 stars**,
created 2026-01-02, measured 2026-09-18. Its description, verbatim: "Agent skills for Obsidian.
Teach your agent to use Obsidian CLI and open formats including Markdown, Bases, JSON Canvas."

### 3.5 The plan's own figures, re-derived on 18 September

Plan says | Measured 2026-09-18 | Verdict
7,638 plugins, 147,920,815 downloads | 7,706 plugins, 148,696,933 downloads | Holds
48,440 stars on `kepano/obsidian-skills` | 48,515 | Holds
2,112,607 downloads for Claudian | 2,135,277 | Holds
AGENTS.md "used by over 60,000 projects" | about 547,840 root-level files | **Stale by roughly nine times**

---

## 4. What people ask for that nobody ships

The demand side, from the loudest threads in the round.

Want | Evidence | Who ships it
**One readable spec plus a history, rather than a trail of specs** | `github/spec-kit` discussion #152, 72 upvotes and 132 comments, the most-replied thread on that board, unresolved | **Nobody**
**Review the agent's whole change set before any of it lands** | Lens A, finding FA3 | Partly, in developer tools
**Undo the agent, including files git never saw** | Lens A, finding FA1 | Nobody
**Lock a file so the agent cannot touch it** | Lens A, finding FA8 | Nobody
**One instruction file, composable, that every tool reads** | 6,644 reactions, section 1.4 | Nobody
**Obsidian in a browser** | Forum topic 2049, opened 2020-06-17, **257,898 views**, 273 opening-post likes, the most-read request on that forum | Nobody

**The spec-drift thread is worth reading in full.** Its author states the failure precisely: you
now have to read two documents to know one truth. Recorded at
`docs/research/2026-09-18/raw/A-agent-tool-gaps.md:499`.

**Splice-only writing plus an accept-or-reject queue plus a version record is the machinery for
that.** Nothing about it is specific to code.

### 4.1 The tools that check documents are small, and that is good news

Repository | Stars, measured 2026-09-18
`DavidAnson/markdownlint` | 6,345
`errata-ai/vale` | 6,109
`lycheeverse/lychee` | 3,918
`runmedev/runme` | 2,168

**Nobody has built a business here.** These are utilities. Bundling them into the problems panel
costs little and there is no incumbent to out-market.

---

## 5. Not established

Everything in this section is a thing we do not know. It is here so that nobody later reads a
silence as a finding.

### 5.1 Not measured at all

Question | Why it is not established
**Will anybody pay 299 rupees a month for this?** | No willingness-to-pay study was run. The pilot of twenty is the first test and it has not happened
**What is the market size?** | Not estimated, from any source, at any point
**What does customer acquisition cost?** | The plan's own note is that 20 lakh rupees a month implies 1.26 million visitors, and there is no channel that produces them
**Do the three user groups in `51-PRODUCT-PLAN.md` exist as segments?** | They are reasoned from feature demand, not from interviews
**Does a non-developer actually use a change queue?** | Nobody has been watched doing it. It is the product's central assumption

### 5.2 Measured, but the measure is contested

Claim | The problem
**Spec-driven development is popular** | `github/spec-kit` has 137,619 stars, and about 4,736 public repositories carry its file layout. Either people star it and never run it, or they run it privately, or the search count is unreliable. `INFERENCE:` the idea is popular and the practice is thin
**Instruction files make agents better** | Two independent studies find they do not raise task success, one measuring over 20 per cent added cost. So the S11 screen must not imply that tidying the file makes the agent smarter
**Developers are slowed down by AI** | The METR 19 per cent slowdown figure has been **withdrawn by its own authors**. Do not quote it
**Stack Overflow's trust number** | The survey page publishes 33 per cent and the blog 29 per cent for what appears to be the same measure. Cite the page, and do not treat them as interchangeable

### 5.3 Opened but not verified

- OpenKnowledge is now checked against its own repository, section 3.1. Its licence is GPL-3.0,
  so no code from it may enter this repository.
- `UNVERIFIED:` every GitHub code search count in section 2. Re-running three of them moved one
  by 8 per cent, so no exact figure can be verified. needs: nothing more; quote them as orders of
  magnitude only, which the file already does.
- Notesnook's India page **confirmed below 299 rupees** `[M]`. Opened 18 September 2026 at
  `https://notesnook.com/pricing`, served in rupees: Essential at "₹225.20 / month including tax",
  or ₹188.52 a month billed annually. Pro is ₹791.04 a month. So one peer does sit under our price.

### 5.4 A standing warning about quotations

A research pass on 2026-09-09 **fabricated quotations** from VS Code's documentation while getting
the underlying facts right. Roughly one quotation in three across that run was a paraphrase inside
quotation marks.

**So: before any quotation from this file goes into a deck, a card or a public page, re-fetch the
page and match the string.** The 2026-09-09 round is an archive for that reason, and
`docs/research/2026-09-09/VERIFIED-2026-09-09.md` overrides it where they disagree.

---

## 6. The falsification test for our position

The position is in `51-PRODUCT-PLAN.md`: **frontmatter is the review surface for agent-written
documents, for people who do not use git.**

A position that cannot be wrong is not a position. Here is what would prove this one wrong, in the
order it would arrive.

### 6.1 The cheap tests, which the pilot runs

Test | Falsified if | Where it is measured
**Does anybody use the queue?** | Fewer than three of twenty accept or reject a single item individually in week one | `55-MEASUREMENT-AND-EVENTS.md`, `doc.change.accepted`
**Is Accept all the only button used?** | Individual accepts are under 10 per cent of all accepts | The same event, with `mode: individual` against `mode: all`
**Do the blueprints get used?** | Fewer than two of ten kit recipients run the kickoff | `docs/mvp0/PRODUCT-PLAN.md section 28`
**Can a person name the problem?** | Fewer than three of twenty name it unprompted | The same section

### 6.2 The structural tests, which the market runs

Test | Falsified if
**Somebody builds a non-developer review surface** | GitHub, Notion or Google ships an accept-and-reject queue for agent-written prose that a non-developer can use. The gap closes and we are late
**The 9 per cent rises** | If teams stop insisting on review, the whole product is solving a problem that went away. Watch the same survey next year
**Agents stop reading over the web** | If the traffic shape reverses, the markdown route and the published page stop mattering and Doc mode has to carry the product alone
**Obsidian ships a web version** | Their third most-liked request. Our opening narrows to AI, collaboration and the brief
**A conflict-free replicated data type is shown to preserve byte-exactness** | Our sync position is wrong, not merely contested, and the engine's shape changes

### 6.3 What would *not* falsify it

- **A competitor shipping the refusal law.** OpenMarkdown already has, and it confirms the law
  rather than taking the ground.
- **Low conversion in the pilot.** Twenty people is too few to measure a rate.
- **Somebody shipping an MCP server for markdown.** About ninety-five people already have, inside
  Obsidian. The server is table stakes and the review surface is the product.

---

## 7. Limits of this file

**What was not assessed.**

- Pricing sensitivity, market size, acquisition cost and channel. None of the four was researched
  in any round.
- Anything outside English-language sources.
- Anything behind a login. Every source here is a public page.
- The two earlier rounds, 2026-09-09 and 2026-09-13, were not re-read line by line for this file.
  They are archives and the newer round supersedes them where they touch.

**What could not be verified.**

- Section 5.3 lists it. The GitHub search counts are the largest single unverifiable block, and
  three of this file's claims rest on them.
- Every Mintlify figure comes from one vendor's report on its own customers. It is the best
  available measure of agent reading and it is not a neutral one.

**What would falsify it.**

- Section 6. The cheapest of those tests costs twenty people and one week.
- Any of the four numbers in section 1 failing to reproduce when the page is re-fetched. They were
  read once, on 2026-09-18, and none has been read twice.
