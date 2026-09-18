---
id: 06-COMPETITIVE-LANDSCAPE
title: Competitive landscape
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [competitors, positioning-threats]
---

# 06. Competitive landscape

**One row per competitor: what they shipped, when, what happened to them, and which of our claims it
threatens.**

Every quotation is copied from the page named, opened on the date named, by the research round in
`docs/research/2026-09-18/raw/H-2026-launches.md`, `E-provenance.md`, `G-docs-quality.md` and
`Z2-position-taken.md`. Four quotations carry long dashes because their sources do. Our own prose
uses plain hyphens.

**Read section 6 first if you are in a hurry.** It is the list of claims we can no longer make.

## 1. The three who have taken our position, and all three are free

Product | Shipped | What happened | Price
Ritemark | Comparison page dated 2026-08-04 | Live. macOS and Windows, open source | Free
OpenKnowledge | Launched 2026-06-25, from Inkeep, a Y Combinator company | Live. **381 points, 173 comments**, the top markdown launch of 2026 | Free, open source
OpenMarkdown | Launched 2026-07-18 on Product Hunt, 190 upvotes | Live. Releases repository has 61 stars | Free, no paid tier named

**Ritemark's home page headline, verbatim:** "Markdown editor with AI agents." Its subheadline:
"Claude, Codex, and Gemini work alongside you in a visual editor. They read your files, edit them,
create new ones. You stay in control." On files: "No upload, no indexing, no copy-paste. The agent
works on the same Markdown files you do, right where they already live." And the line closest to
our projection law: "Drafts in ~/docs/q2-strategy/ stay in ~/docs/q2-strategy/."
Source: `https://ritemark.app/en/` opened 2026-09-18.

**What Ritemark does not have**, from their own pages: no MCP mention anywhere in their comparison
page, no change queue, no accept or reject of an agent edit, no byte-range splice, no refusal
behaviour. Their control story is that the terminal is visible, which is not review.

**OpenKnowledge's home page, verbatim:** "Beautiful, AI-native markdown editor", "A rich text editor
and knowledge base for you and your agents", "A Notion-like editor that's just markdown under the
hood." It lists roughly forty agent harnesses it works with. It has callouts, accordions, tabs,
Mermaid, media, embeddable HTML, templates and a per-section token count.
Source: `https://openknowledge.ai/` opened 2026-09-18.

**And the question its own thread could not answer.** User `toozitax`, verbatim:

> "the frontmatter question is the one i'd want answered before trusting it: when an agent edits a
> file does it round-trip YAML frontmatter and nested code fences cleanly, or does that stuff get
> mangled? every "wysiwyg markdown" tool i've tried falls apart there."

The founder's reply, verbatim: "Re:front-matter, we do optimistic parsing of it, haven't seen any
issues with it."

**OpenMarkdown's tagline, verbatim:** "Feather-light. Light-speed." Its subheadline: "A local-first
Markdown editor built for you and your agent." On models: "No AI inside. That's the point. It runs
on the agent you already have." Its eight MCP tools, verbatim from the FAQ: `open_file`,
`open_folder`, `reveal`, `get_context`, `execute_command`, `read_section`, `write_section`,
`wait_for_change`. Source: `https://openmarkdown.dev/faq` opened 2026-09-18.

**Its conflict rule is our refusal law, arrived at independently.** Verbatim: writes are
"section-scoped with optimistic concurrency", and "if you and the agent touch the same section at
the same time, the agent's write comes back as a `CONFLICT` so your unsaved edit is never
clobbered".

**Two ideas in it we have not had.** `wait_for_change` parks the agent until the person edits,
which turns the editor into a meeting point instead of a drop box. `reveal` scrolls the person's
window to the heading the agent is discussing, which is shared attention with no collaboration
engine behind it.

## 2. The paid incumbents, and what each meters

Prices read from each vendor's own page on 2026-09-18. Rupee prices are what the page served to an
Indian address, and none has been converted, because a converted number is an invented number.

Product | Free | Entry paid | The agent feature, and its meter
Notion | $0 | Plus $10 a seat a month | Business at $20 is the first tier with "Notion Agent". Usage is "Free to try, then $10 per 1,000 monthly Notion credits"
Confluence | Free, 10 users, no Rovo | Standard | "25 Rovo credits per user per month / 100 indexed objects per user", rising to 70/250 on Premium and 150/625 on Enterprise
Slite | Not listed | Basic $10 a user a month yearly | Pro at $20 is "An agent-powered knowledge base that stays in sync with your tools", with "50 monthly credits per seat"
Craft | ₹0, "15 credits" | Plus ₹526.7 a month monthly | "50 credits/month" on Plus. The page does not mention markdown or local files at all
Dropbox Dash | Not published | Its pricing page returns 404 | Headline is "Find answers across your work". Its four tabs are "Find", "Answer", "Organize", "Share". **There is no write or edit tab**
Superhuman Docs | ₹0 | Pro ₹983 a month per **Doc Maker**, billed annually | "Docs AI is available during Beta for Doc Makers." Bills per writer, not per seat

**A correction to any competitor list that names Coda.** `coda.io/pricing` now returns a 307 to
`superhuman.com/plans/docs`. Coda no longer exists as a brand. UNVERIFIED on the date: the rebrand
is verified by the live redirect, and the 8 July 2026 date came from a search result, not a primary
page.

**The pattern worth copying.** Superhuman bills per "Doc Maker", so a whole team reads and comments
free and only the people who create pay. For a tool where an agent writes and a person reviews,
charging the reviewer is the wrong end.

**What none of the six has built.** An accept or reject step on a machine-written change. Every one
has shipped retrieval, chat and generation. Confluence and Notion have page version history, which
answers what changed after the fact rather than may this change before it. Slite's "Doc
fact-checking with suggested fixes" is the nearest miss, and it is scoped to facts.

## 3. The adjacent tools, each of which owns one piece

Product | What it shipped, and when | What it costs | Why it matters here
Mintlify | Raised **$45M Series B at a $500M valuation** on 2026-04-14, led by a16z and Salesforce Ventures. Replaced token metering with outcome pricing on 2026-09-08. Published the 2026 State of Knowledge Report on 2026-09-16 | Starter $0, Pro $450 a month | It supplies the number the whole product rests on, and it proved the market prefers a meter that charges nothing for a refusal
CodeRabbit | Prose review on changed `.md` files since **2024-03-02**. Added Vale on changed `.md`, `.markdown` and `.txt` on **2026-08-24** | From $24 a developer a month, free on public repositories | **It is why we may not claim to be first to review markdown prose**
Promptless | Sells documentation freshness as the whole product. A separate line called Agent Instructions | Startup $500 a month up to 200 pages, rising to $2,000 to $4,000 a month | Somebody is already charging $500 a month for "your documents went stale", and a second line for instruction-file rot
Fiberplane `drift` | "We built a linter for documentation rot", published **2026-03-25** | Free, open source | It anchors a markdown spec to a code symbol with a git sha, which is the strongest single check a problems panel could carry
iA Writer | Markdown Annotations, an open spec at v0.2, published with iA Writer 7 in November 2023 | A paid app | It already built the byte-range-plus-hash authorship model, aimed it at AI authorship, and nobody adopted it
Zed Delta | Public beta from **2026-09-16**. macOS, Linux, Windows, web and a mobile browser view | Free during the beta | It is the strongest public bet against our settled no-CRDT position
Basic Memory | Live | Free locally, cloud "from $15/seat/mo" | Takes the memory half of our position, in plain markdown

**Mintlify's rationale for outcome pricing, verbatim:**

> "It solved our problem, not yours. Tokens are how we buy AI, not how teams plan to use it. The
> same automation could cost a different amount every run. The assistant charged for every message,
> including the ones it couldn't answer. The meter counted effort instead of results."

Their new prices, verbatim: "Assistant answers a question: 25 credits"; "Assistant can't answer:
0"; "Automation updates your docs: 250 credits"; "Automation finds nothing to update: 0".

**CodeRabbit's changelog, verbatim, dated 2026-08-24:** "CodeRabbit now runs Vale on changed .md,
.markdown, and .txt files, checking prose against your team's own checked-in editorial style rules
- terminology, voice, and phrasing - and reporting violations as review findings, the same way a
linter catches code issues." And dated 2024-03-02, under "Enhanced Markdown Review": "CodeRabbit
now offers a more comprehensive review of the markdown changes."

**Fiberplane's mechanism, because the mechanism is the finding.** An anchor is three parts, a path,
an optional symbol and an optional git sha, written as
`src/auth/provider.ts#AuthConfig@a1b2c3d`. It lives in the markdown front matter under a `drift:`
key, or inline in the prose. **Its own author states the limit:** "drift helps with detection, not
the review itself."

**iA Writer's licence position, recorded verbatim because it is load-bearing:** "While the format is
open, avoid cloning our work. Draw inspiration from what we made. Change it. Improve it. Design it
yourself. Work on it until it is substantially better. If you can't beat our design, then let it be
and do something else." The repository `iainc/Markdown-Annotations` has 124 stars, 3 forks and
5 open issues, created 2023-11-30 and last pushed 2025-11-05.

**What the research measured about their end block**, in three parsers, in that session. With a
blank line before the closing `---`, all three render a horizontal rule and a visible paragraph of
offsets. **Without the blank line, all three turn the last line of the document into a heading.**

**Zed's claim, verbatim from the DeltaDB post:** "Because DeltaDB embeds conflict-free replicated
worktrees, many people and agents can edit the same files at once across different machines." And
from the public beta post: "Delta is built on DeltaDB, which extends Git's content-based versioning
with incremental versions based on deltas. A commit remains the checkpoint you push, pull, and
build from."

**How to read Zed against our settled position.** INFERENCE, from
`docs/research/2026-09-18/raw/E-provenance.md`: Zed did not contradict the position, it partitioned
it. Their CRDT governs the live session, git governs the durable artefact, and the worktree is
mounted to disk as real files. That is structurally the same split we make, with a CRDT where we
put a splice journal.

**The rebuttal we owe now names two products, not one.** OpenKnowledge is described by Tech Times on
2026-06-27 as using "a dual-observer CRDT architecture" so the agent can "write directly to the
markdown file". UNVERIFIED: that article gives no repository link, and the project's own pages were
not opened.

## 4. Obsidian, which is the one that matters

**What they have.** 7,706 plugins and 148,696,933 downloads, counted 2026-09-18. 6,051 open feature
requests. About 95 plugins whose id contains agent, claude or mcp, the largest at 2,135,277
downloads.

**What they are building back.** Their published roadmap lists **Multiplayer as Planned** and
**Obsidian for Work as Active**.

**What their chief executive is doing.** `kepano/obsidian-skills`, created 2026-01-02, **48,515
stars** on 2026-09-18. Its description, verbatim: "Agent skills for Obsidian. Teach your agent to
use Obsidian CLI and open formats including Markdown, Bases, JSON Canvas."

**What they do not have**, and the plan's opening rests on it.

Their gap | Hearts on the request
A web version | 949, and absent from their published roadmap
Global search and replace | 650, and still does not exist

**The honest read.** The plan carries "Obsidian takes the agent position" as a risk at
`docs/mvp0/PRODUCT-PLAN.md` section 27. It is not a future risk. Their command line exists, their chief
executive publishes the skills that drive it, and 48,515 people have starred that.

## 5. The Almanac correction

**Our record cites a cause the source does not state.** `CLAUDE.md` says the per-span read state was
dropped partly because "Almanac shipped the same read receipts and shut down".

**The shutdown is real.** Verbatim from Almanac's own farewell page: "We've made the decision to
shut down Almanac on January 31, 2025."

**The reason is not the one we recorded.** Verbatim, in order, from the same page:

> "Last year, we saw an opportunity to use our platform to help many more people-small teams without
> the skills or resources of our larger customers-generate content and grow faster through the magic
> of AI."

> "Our new product, Blaze, has since taken off, growing to tens of thousands of users in a matter of
> months-and it's consumed all of our small team's time and energy to serve these customers well."

> "Ultimately, we've decided we don't want to offer a product in Almanac whose quality we no longer
> have the capacity to maintain or improve."

The same page says Almanac "has been adopted by many of the world's best remote companies".
Source: `https://get.almanac.io/go-forward` opened 2026-09-18.

**So the shutdown is an attention story, not a feature verdict.** The read-receipt idea was retired
on a reason its own evidence does not carry. That does not make read receipts right. It makes our
stated reason wrong, and it has to be corrected wherever it appears.

**Two traps in the same finding.**

- `almanac.io/go-forward` now 307-redirects to a live marketing page with no shutdown notice, so a
  casual check of the obvious URL returns the opposite impression.
- **There are now two Almanacs.** `usealmanac.com` is a Y Combinator S26 company whose headline
  reads, verbatim, "Meet Almanac, The agent with a second brain." It posted to Hacker News on
  2026-08-31 and scored 59 points.

## 6. Which of our claims each competitor threatens

**This is the section to read before writing any public sentence.** The full register with the
artefact behind each claim is `07-CLAIMS-REGISTER.md`.

Our claim | Who threatens it | The verdict
"A markdown editor where agents edit your files" | Ritemark, OpenKnowledge, OpenMarkdown | **Taken, three times over, by products that charge nothing.** Ritemark's headline is our sentence
"Accept or reject every AI change, one by one" | Google Docs | **Table stakes.** Google's help page ships Accept suggestion, Accept all and Reject all for Gemini edits
"Nobody reviews AI-written prose" | CodeRabbit | **False as stated since March 2024.** True only for someone not doing a pull request
"We mark what a machine wrote" | iA Writer | Shipped in 2023, with an open spec, and not adopted. The claim is available; the demand is unproven
"Span attribution" | Zed Delta | Their anchor survives edits, which is the harder half and not the half we care about. Rebut the anchor paragraph, never the Xanadu sentence
"Sync is never a CRDT" | Zed Delta, OpenKnowledge | Outnumbered in public, two shipped products to none. The position may still be right and is no longer uncontested
"Our documents never go stale" | Promptless, Fiberplane, GitBook, Mintlify | Four products shipped freshness in 2026. The open ground is doing it deterministically, in an editor, free
"Byte-exact round-tripping" | **Nobody** | The category's top thread asked for it and got "optimistic parsing". We have 8,513 pinned files and have never said so in public

## 7. What nobody has built

Five holes, in order of how defensible each looks, from
`docs/research/2026-09-18/raw/H-2026-launches.md`.

Rank | The hole | The receipt
1 | A review step for a machine edit, outside git | 83 per cent of surveyed teams have agents drafting and only 9 per cent let them publish unreviewed, so 91 per cent are reviewing something, and the only working surface is a pull request
2 | A guarantee of byte-exactness | The highest-value question in a 381-point launch thread was answered with a hope
3 | A price that rewards the agent doing nothing | Every incumbent meters. One company changed that on 2026-09-08
4 | An editor for the agent's memory | Five funded memory vendors sell an API. Four have no file a person can open, and the fifth has no editor
5 | A prose writing tool that has entered the agent era | Lex still names Claude 3.5 Sonnet as the best model for writing and mentions no file. Sudowrite is priced around fiction

**The shape of the opportunity, in one sentence.** The free tools took "an agent can edit your
markdown". The paid tools took "ask your documents a question". Both crowds skipped the step in
between, which is a person saying yes.

## 8. The limits of this file

**What was not assessed.** Revenue, headcount and retention for any competitor. Nothing here says
whether any of them is a good business.

**What could not be verified.** The research pass records five gaps in its own evidence.

- **Product Hunt** rendered nothing to curl, and the browser tool was refused by a session gate. No
  Product Hunt evidence is in the source file.
- **The Y Combinator company directory** returned no hits to its public endpoint, so that evidence
  comes from Launch posts on Hacker News, which under-counts companies that never posted one.
- **Box and Confluence dollar prices** render in JavaScript and were not captured.
- **The Coda to Superhuman Docs announcement page** returned 403.
- **Superhuman's acquisition of Rows**, February 2026, is a search result with no primary page.

**What is not established.** That any of the three free products is a commercial threat. None
charges, and `Z2-position-taken.md` reads both OpenMarkdown and OpenKnowledge as warnings about
sequencing rather than about revenue.

**What would falsify this file.** Any of the three free products shipping a web app with accounts
and sharing. Every one of them today is a desktop editor plus an agent bridge, and the whole hard
half of frontmatter is still empty ground.
