---
title: Every project, opened. What each one is, what it contributes, and what to do with it
date: 2026-09-14
time: 02:38 IST
for: Sagnik, and Amit
status: the deep audit you asked for. I opened every repository you named and the ones around them, read their own READMEs and plans rather than the register, counted what could be counted, and curled what could be curled. Every number says where it came from. Where I did not open something I say so.
---

# Every project, opened

The earlier retrospective was built on git counts and the ecosystem register. You said that
was too fast and you were right. This one is built on opening each project and reading what it
says about itself. It is long because you asked for detail. The short version is in section 4,
and the thing to actually do is in section 6.

## 1. What is on this machine

Seventy-five directories under `~/Desktop/GitHub`. The register says roughly 280 repositories
across 9 owners, 33 Vercel projects and 8 Cloudflare domains. Of the 26 `*.sgnk.ai` hosts named
in the register, **21 answer 200** when curled on 14 September. Things get deployed here.
That is worth saying before anything critical, because deployment discipline is not the
problem.

The nineteen I opened, with the number that matters most for each:

| Project | What it says it is | Files | Last commit | Users who are not you |
|---|---|---|---|---|
| `sgnkai` | the portable AI operating system | 38,634 | 14 Sep | 0 |
| `md` | markdown vault, web and Mac | 11,389 | 17 Jul | 0 |
| `frontmatter` | md, forked, with a business | 773 in `src` and `docs` | 14 Sep | 0 |
| `pwa` | capability lab, 50 exhibits, pilot app | 645 | 10 Sep | 0 |
| `knowledge` | paste anything, get a synthesis note | 1,356 | 17 Jul | 0 |
| `tred` | stock screener scraper, plus decisions sites | 32,499 | 4 Sep | Amit |
| `aisoc` | client engagement, docs only, NDA | 1,394 | 28 Jul | a client |
| `sgnk-campaign` | LinkedIn content system, 37 posts | 1,014 | 12 Sep | readers, by hand |
| `content` | Markex, a social scheduler, live | 2,646 | 19 Aug | 0 known |
| `hq` | ops control plane, 34 modules, live | 2,869 | 3 Jul | 0 |
| `skills-registry` | one skills registry, many destinations | 1,667 | 19 Jun | 0 |
| `chatgpt-to-claude` | ChatGPT export to a Claude working dir | 1,026 | no git | 0 |
| `agentube` | portal over knowledge and YT analyses | 274 | 10 Aug | 0 |
| `claude-setup` | superseded into `sgnkai/archive` | 110 | 25 Jun | 0 |
| `rawl` | zero-cost web data engine | 54 | 30 Jun, 2 commits | 0 |
| `aios-site` | eight pages about the AIOS | 31 | no git | 0 |
| `sgnkos` | a Lovable scaffold, three forks | 1,513 | 11 Jun | not yours |
| `sgnk-research-reports` | your FDE résumé and market plan, PDFs | 8 | no git | n/a |
| `sgnk-pwa`, `zs-agents` | stubs, 9 and 1 files | | | |

The "users who are not you" column is the whole audit in one column. Client work has users.
Own work has one.

## 2. Each one, opened

### sgnkai, the AIOS

**What it is.** A source repository whose two submodules deploy to `~/.claude` (1,053 files:
skills, hooks, rules, the constitution) and `~/.sgnk` (1,799 files: tools, gates, evals, state,
baselines). An installer that dry-runs by default and backs up only the 1,054 files it could
touch rather than the 122,477 in the target. A typed registry, nine generated layer
directories, a causal graph, and the writing engine at the root because Vercel builds from
there. The README is careful and honest; it measured its own drift (23 of 24 archived files
identical, one already diverged) and chose submodules on that evidence.

**What is actually running, counted on 14 September.** 82 learned rules. 128 skills. 31 hooks
across 8 events. 156 scripts. 5,897 trace rows across 142 daily files. 22 non-empty eval
directories out of 31. 69 registered gates. 3,434 baselines. `calibration.json` touched at
02:24 this morning, `routing-bandit.json` at 23:58 last night. This is not a plan for a
system. It is a system, and it is on.

**Two things I have to say plainly.**

First: **the preference log holds zero pairs.** Learned Rule 34 says the accept-or-reject pair
per task is the one signal that beats every synthetic benchmark, and it is the input the whole
loop was built to learn from. The nervous system is wired and the one sensory channel that
matters is empty. Everything downstream, the calibration, the bandit, the drift baselines, is
running on traces and assertions, which are real, but not on the thing Rule 34 says is the
point.

Second: **43 of the 128 skills are about running the system itself.** 28 in `ops-agent`, 15 in
`aios-library`. Against that, 10 in `knowledge-docs`, 5 in `design-build`, 4 in `client`. A
third of the workshop is tooling for the workshop. That is normal for something built by one
person over five months and it is also the reason nobody else can pick it up.

**Verdict.** The best-engineered thing in the portfolio and a workshop, not a kit. It is why
your agent output is good. It is not something a stranger installs.

**What it gives frontmatter.** Three things, as templates rather than as the orchestrator. The
learned-rule format: never X, because Y, verified on a date. The file gate that checks for the
things you have banned, which caught me three times this session. The skill file shape, which
is a markdown file an agent reads, the same artefact as everything else. Nothing else from it
ships.

### The writing engine, which you called SGNK write

**What it is.** `src/` and `gate/` and `scoring/` inside `sgnkai`. `gate.py`, `patterns.py`,
`style_score.py`, `rhythm_lint.py`, `slop_scan.py`, `test_gate.py`, `bands.json` at version 2.
A plan written on 13 September that decides, on four independent literatures with opened
sources, **not to fine-tune** and to build retrieval, in-context prompting and an evaluation
instead. The numbers it cites are the right kind: retrieval beat parameter tuning by 14.92
against 1.07 points across seven LaMP datasets; in-context personalisation works below ten
examples; sequential adapter stacking collapsed to 1.6 after fifteen updates.

**What it is measured against.** The corpus audit in `bands.json` is dated 11 September:
**2,710 dictation entries, 196,522 cleaned words, six months of spoken instruction from March
to September 2026, 78.6 percent of it addressed to Claude desktop.** Plus seven composed
long-forms in the writer skill's corpus file, roughly 8,400 words. The bands were derived from
that, and the audit records what the corpus is not: it is your instruction-giving register, not
your public prose, and it says so.

**Verdict.** This is the most unusual asset you have and I do not think you see it that way. A
196,000 word measured personal register with a working gate that fires on real text is not a
thing many people possess. It is evidence-based in a way nothing else in the portfolio is.

**What it gives frontmatter.** Directly, as a feature: *does this read like you.* An editor that
can tell you a paragraph drifted into machine cadence, with the specific tell named, is a
feature no markdown editor has. And it is already built.

### md, the editor

**What it is.** 416 commits between 13 May and 17 July. Thirteen modules, `proxy.ts`, an arch
gate, a Tauri build with mac-arm, mac-intel and universal targets. CodeMirror with vim mode,
live preview with math and mermaid, graph view, full-text search, five AI endpoints across four
providers, version history. Benchmarked in its own gap report against Obsidian, Notion, Typora,
Logseq, iA Writer and VS Code, with real-time multiplayer, a plugin API and vault RAG chat
consciously deferred as architectural.

**What the vault holds.** Of 4,634 markdown files: 2,780 in `Mirrors`, 1,097 in `.sgnk`
snapshots, 369 in `Skills`, 218 in `Research`. Your own notes, `Brain`, `Projects`,
`Zephyrus`, are about seventy files. The vault is mostly machine output.

**It has no README.** Two months dormant. The screenshot you sent at two in the morning is this.

**Verdict.** The front door, ninety percent built, nobody home since July.

**What it gives frontmatter.** The editor. It is the same code, 202 of 228 files identical.
Revive it at `/` with no login and it is Phase 0.

### frontmatter

I have spent the whole weekend inside this one and will not repeat it. 139 commits since 13
July. Fourteen modules. 208 decisions on the site, 65 blocking the MVP. Zero users, no
interviews, 1.21 engineering days a week, one author on 80 of 80 commits. Two of five exports
send the document to our server. The home page is the login screen.

### pwa

**What it is.** Two surfaces on one origin. A gallery of 50 exhibits in four rooms that you
touch, each with a live stage and an honest support line. A capability lab with 67 probes that
run on your device. And `/pilot`: a first-run, six real tasks with a verdict each, a feedback
form that queues offline with a shrunk screenshot, a builds view with a timed log, three
serverless functions into a private Blob store, and a laptop mode with an inspector. Zero
runtime dependencies. No framework, no bundler, no CDN.

**Verdict.** A demonstration of craft, and a good one. Not a product. `/ship` returns 307.

**What it gives frontmatter.** Something I did not expect. **The pilot app is exactly what
Phase 0 needs.** Twenty named people, six tasks, a verdict each, feedback that works offline,
the build they are holding. You built the instrument for running a pilot while building a
different product. Lift it.

### knowledge, and the paste work

**What it is.** Drop anything in `Paste/`, say "go", get a synthesis note filed under a
category, indexed in `knowledge.md`, mirrored into the vault. 181 notes under `ai`, 13 under
`computer-science`, one each under six other categories. Two items sitting in the inbox.
Dormant since 17 July, the same day as `md`.

**Verdict.** A personal reading base with a clean loop and one subject.

**What it gives frontmatter.** The loop's shape, paste, read fully, synthesise, file, is the
kit generator's shape. And the 181 AI notes ground research, which they did this week. Keep
using it. It is not a product.

### agentube

A static portal in the design system over the knowledge base and the YouTube analyses. Twelve
commits across two days in August. **Verdict:** a view onto `knowledge`. Archive.

### tred

**What it is.** A Python and Playwright app that logs into Chartink, scrapes screener tables
from Chartink and TradingView, refreshes at four in the afternoon after the Indian close, and
shows every result stock tagged by screener. A monorepo now: `apps/` holds `flow`, `pwa`, and
`decisions` through `decisions-v6` plus `decisions-perccent`; `services/` holds `api` and
`legacy`. 772 commits, the most of anything in the table. The trading is Amit's domain.

**Verdict.** A working tool in a domain that is not frontmatter's, which incubated the
decisions-site pattern through six versions.

**What it gives frontmatter.** The decisions site. Already lifted; the rail you got tonight
came from `decisions-perccent`. Nothing else.

### aisoc

A client engagement, an MSSP in Mumbai, under an NDA signed 23 July. Its own `CLAUDE.md` says it
is a documentation and analysis repository with an unused Next.js scaffold and no product code.
57 real documents; the other 919 markdown files are snapshots. I did not open anything under
`docs/10-client-inputs/` and will not.

**What it gives frontmatter.** Only a shape: RFP in, issues register, revised plan out. That is
a document kit template for a services engagement.

### sgnk-campaign

**What it is.** 37 posts drafted across `batch1`, `batch2`, `brilliant` and `brilliant2`, build
scripts for assets, and an `audit/` directory with fifteen files including `numbers-refuted.json`
and `NUMBERS-REFUTED.md`. A sync document dated 10 September records a ten-layer sweep of 22
agents and 1,085 tool calls that established 333 facts, then **killed 52 candidate questions
because the repository already answered them** and left 30. Posting is by hand, by rule.

**Verdict.** A content system with audit discipline that most content systems do not have.

**What it gives frontmatter.** It is the only thing in the portfolio pointed at strangers. It is
the distribution channel, and it works.

### content, which is Markex

A mobile-first scheduler aligning content, marketing and admin on what to post and when, with
Google Drive assets. Live at `content.sgnk.ai`. **Verdict:** a separate product with no known
user. Park with a date.

### hq

**What it is.** Thirty-four modules. Among them `billing`, `workspace`, `public-api`, `plugins`,
`mcp`, `connectors`, `automations`, `flags`, `incidents`, `webhooks`. Pulls from GitHub,
Vercel, Cloudflare, Supabase, Sentry, Render, Netlify, Notion and Google Workspace. Live at
`hq.sgnk.ai` behind a PIN. The register says the multi-tenant SaaS spine is "built behind
feature flags, ready to onboard external customers". 352 commits. Dead since 3 July.

**Verdict.** The most-built, least-used thing here. A full SaaS spine with zero tenants,
built for one operator, then abandoned when the next thing started.

**What it gives frontmatter.** Nothing now. If a Team tier ever needs billing and workspaces,
the modules exist. Taking them earlier would be the same trap again.

### skills-registry, claude-setup, aios-site

All three superseded by `sgnkai`. Its README says so for two of them. Archive.

### chatgpt-to-claude

**What it is.** Pure standard-library Python that turns a ChatGPT data export into a Claude
Code working directory: every conversation as markdown, every upload under its real name, a
classified index, a seeded `CLAUDE.md`, a migration report. Reads only. No git.

**Verdict.** Small, real, and it works on a problem people have.

**What it gives frontmatter.** More than its size suggests. "Paste what a model gave you, get a
clean document" is the front door use case, and this is a working converter for one large
source of exactly that. Lift the conversion.

### rawl, sgnkos, sgnk-research-reports, sgnk-pwa, zs-agents

Two commits in one day; a Lovable scaffold with three forks that is not yours; your résumé and
an FDE market plan as PDFs; a nine-file stub; a one-file stub. Archive, except the résumé,
which is not a project.

## 3. Cross-cutting findings

These are the things you cannot see from inside any one repository.

**Snapshots have written 15,349 markdown files into 21 repositories.** `tred` carries 1,268 of
them at 38 MB, `md` 1,097, `aisoc` 919, `content` 881. This is the clutter you are feeling. It
inflates every document count, every "what is in this repo" read, and every agent's first
impression of a codebase. The snapshot system is doing its job; it is doing it into the wrong
place. Either it writes outside the repositories or it is ignored by git. That is one change and
it removes most of the noise.

**There is one codebase, forked, plus hq.** The hexagonal template with `src/modules`,
`proxy.ts` and an arch gate lives in exactly three repositories: `frontmatter`, `md` and `hq`.
`frontmatter` and `md` are 202 of 228 files identical. So the architecture is not spread
across the portfolio. It is in one place, twice, and in `hq` once with 34 modules.

**The pattern, stated once.** You build a tool for yourself. It works. You love it. It becomes
a product in the plan before anyone else has touched it. It gets forked or superseded by the
next one. The original dies. The successor has zero users. Then again. `md` into `frontmatter`.
`hq` into a SaaS spine. `skills-registry` and `claude-setup` and `aios-site` into `sgnkai`.
Five months, eleven own repositories, one user. The standard of the work is not the issue. The
number of people who have seen it is.

**Deployment is not the bottleneck.** 21 of 26 registered hosts answer. Things ship. What they do
not do is get shown to a person who is not you.

## 4. What frontmatter can package from all of it

This is the answer to your question about putting things together without clutter. Each
project contributes exactly one thing, and nothing contributes twice.

| From | The one thing it gives | Where it lands |
|---|---|---|
| `md` | the editor, revived at `/` with no login | Phase 0 |
| `chatgpt-to-claude` | paste a chat export, get a clean document | Phase 0 |
| `pwa` | the pilot app: twenty people, six tasks, offline feedback | Phase 0, running the pilot |
| the writing engine | *does this read like you*, with the tell named | Phase 1 |
| AIOS | the learned-rule format, the file gate, the skill shape, as templates | Phase 1 |
| `knowledge` | the paste, read, synthesise, file loop, as the kit's shape | Phase 2 |
| `tred` | the decisions site | already lifted |
| `sgnk-campaign` | the way anyone hears about it | every phase |
| `aisoc` | one kit template, for a services engagement | Phase 2, if at all |
| `hq` | nothing now; billing and workspaces if a Team tier ever needs them | not in the plan |

That is the whole portfolio, folded into one product, and it is not cluttered because each row
is a single lift with a phase beside it.

### 4.1 Concepts, which are finer than projects

You asked whether I had checked every project for things that would help. The table above is
at the level of projects. These are the concepts inside them, and one of these I had wrongly
filed under archive.

**One source, many agent formats.** From `skills-registry`, which I marked superseded. The
repository is; the concept is Phase 1. One canonical file, mirrored to every destination that
reads a different shape. `apache/airflow` did this by hand with a symlink. LibreChat did not and
its two files drifted 3x apart. The registry proved the mechanism for skills across Claude,
Codex and Antigravity. The same mechanism across `AGENTS.md`, `CLAUDE.md` and `.cursorrules` is
the product.

**A probe attached to an instruction.** From `pwa`'s 67 capability probes: does this browser
support the thing, run it on the device and see. Transferred: was this instruction obeyed, run
it and see. The card `F35` calls this "show what was obeyed" and has no mechanism behind it.
This is one. Untested as a transfer, and worth a week in Phase 1.

**The decision card as the ADR template.** From `tred`, through six versions, into 208 cards
here: the question, where it stands, what forces a choice, options with gains and costs, a
recommendation, what would flip it, the evidence. That is a document shape, proven at scale,
and the kit's `adr/` folder should be written in it rather than in the generic form.

**Raw alongside synthesis.** From `knowledge`, which files the original under `_raw/` next to
every note, and from Learned Rule 71. The kit keeps the user's answers next to the generated
files, so every claim in a spec traces back to an answer. That is what `F34`'s check runs on.

**Refuted numbers kept as a log.** From `sgnk-campaign`'s `numbers-refuted.json`: every figure
in a published thing checked, and the refutations kept rather than silently corrected. The
kit's consistency pass has a working precedent, and the precedent says keep the refutations
visible.

**Every edit leaves one trace line.** From the AIOS ledger, 5,897 rows of it: which tool, which
task, accepted or not. Review state's substrate is the same line for a span: which span, which
agent, when, read by a person or not. The ledger already does this for tool calls; the product
does it for spans.

**The answers file is the source and the plan is a projection.** From `tred`'s decisions site:
answers exported to a file, the spec generated from the file, never from the conversation.
Frontmatter's own plan already works this way, and it is the projection law applied to planning.
The final plan will be written that way too.

Seven concepts. None of them is a new build; each is a thing that already works somewhere on
this machine, pointed at a different file.

## 5. What to archive, with a date

Not delete. Archive means: mark it in the register, stop counting it, stop opening it.

`agentube`, `skills-registry`, `claude-setup`, `aios-site`, `rawl`, `sgnkos` and its forks,
`sgnk-pwa`, `zs-agents`. `hq` and `content` parked with a date rather than archived, because
both are live and one of them may be wanted later.

What remains after that is five things: `frontmatter`, the product. `sgnkai`, the workshop,
private. `sgnk-campaign`, the distribution. `knowledge`, the reading. Client work, which pays.

## 6. The plan, with each asset named

Same three phases as the retrospective, now with the lift written next to each.

**Phase 0, four weeks.** Revive `md` as `frontmatter` at `/`. No account until the first save.
Paste and clean up, with the `chatgpt-to-claude` converter behind it. Export to PDF and Word,
with the browser print path wired. One sample in the empty state. Run the twenty people through
`pwa`'s pilot app with six tasks. **Judged by** ten of twenty exporting something.

**Phase 1, four weeks.** Point it at a repository. Every `AGENTS.md` and `CLAUDE.md` in the
tree, which one wins for a path, each file's size against the point the vendor says it stops
being obeyed, what an agent changed that no person read. The learned-rule format as a
template. And the writing gate as a feature: this paragraph drifted, here is the tell.
**Judged by** three people on a team saying the which-file-wins view told them something.

**Phase 2, eight weeks.** Share and comment. Storage and sync. Your own key. The kit generator
as "start from here", built on the paste-and-synthesise loop, never as the claim. **Judged by**
one team paying.

**Before any of it, two hygiene changes that cost a day.** Move snapshots out of the
repositories. Archive the list in section 5. The portfolio goes from seventy-five directories
that all look alive to five that are.

## 7. What I did not open

The client inputs under `aisoc/docs/10-client-inputs/`, by the NDA. The 2,780 files under
`md/Mirrors`. The 38,634 files in `sgnkai` beyond its README, plan, registry and gate. Every
directory in `~/Desktop/GitHub` that is a client build, a stub, or a fork of someone else's
repository. The six `decisions` app versions in `tred` beyond the one whose rail I ported. The
contents of the 15,349 snapshot files. I read what each project says about itself and counted
what it holds; I did not read every file, and this document should not be mistaken for that.

And the one thing nobody has opened is still the same: a conversation with a person who might
pay. Every verdict above is inferred from what is on disk. That gap does not close from here.
