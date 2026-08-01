---
mdmax: 1
section: 2
title: "The complete chronological record: what we researched, in order, and what each round concluded"
slug: 02-chronology
lines: 1093
words: 12605
forward_links: [1, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14]
backlinks: [1, 3, 4, 7, 9, 11, 12, 13, 14]
prev: 01-orientation
next: 03-capabilities
---

[← Index](README.md) · [← §1 Orientation](01-orientation.md) · [§3 Capabilities →](03-capabilities.md)

## 2. The complete chronological record: what we researched, in order, and what each round concluded

This section is the programme's memory. It exists so that a person who has never seen this project — a
new engineer, a new co-founder, a smaller model asked to continue the work, or either of us in six
months — can reconstruct **how** every decision in this plan was reached and **why** it is still held,
without opening another file. Nothing here is summarised away. Where a round produced a number, the
number is here. Where a round was wrong, the error is here, with the measurement that caught it.

There is a second reason this section is long. Twice in this programme a conclusion was re-derived from
scratch because nobody could find the evidence for the first derivation, and once a claim was published
that three sources already on disk refuted. A written chronology is the cheapest defence against both.

---

### 2.0 How to read this section

**Evidence tags.** Every factual claim below carries one:

| tag | meaning |
|---|---|
| `[measured]` | a command was executed and the number is its output |
| `[primary]` | the source document, source file, or API response was read directly |
| `[secondary]` | reported by another document that read the source; not re-checked |
| `[inference]` | reasoning over things that were read; not itself measured |
| `[SIMULATED]` | replayed through code rather than read from a live system |

**Timezone rule.** Two clocks appear in the record and they are 5 hours 30 minutes apart. Conversation
transcripts stamp events in **UTC** (suffix `Z`). Git stamps commits in the founder's local time,
**IST = UTC + 5:30** (suffix `+05:30`). Every timestamp below is labelled. Where a conversion matters
the arithmetic is shown inline, e.g. `2026-07-31T20:43:37Z → 2026-08-01 02:13:37 IST`. This is not
pedantry: the programme's most important night of work spans a date boundary in one clock and not the
other, and reading the record in a single timezone makes it look as if events happened on the wrong day.

**The pinned corpus.** Every figure in this plan that describes local markdown files cites:

```
corpus_id    sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
total_files  1,084
total_bytes  25,548,765
roots        md          head 02c22ec47a3a73fb25a14b11be233ad3d00a8b48   756 files   21,068,853 B
             knowledge   head 464eb666946c8cb4ccf42c68f4464613e5fc4999   272 files    3,570,923 B
             frontmatter head 798ebbf3250a5b2a53785859d79ae15f55ebebeb    56 files      908,989 B
policy       all *.md, case-insensitive; skip .git .next .obsidian .trash .venv __pycache__
             build dist node_modules at any depth; skip any dot-directory;
             skip top-level Mirrors/ and Paste/ per root
manifest     docs/engine/research/corpus-manifest.json  (5,466 lines, committed in 1bd4dad)
```

`[primary — read from the manifest file]`. **The corpus was pinned on 2026-08-01 and not before.** Any
figure about local files produced earlier in this record does not cite it and should be treated as
unreproducible. Section 2.8 lists the seven specific counts that are known to be irreproducible.

**A note on what "we" means.** The programme has one human founder in the transcript record — Sagnik
Mitra. Amit, the co-founder, is named by Sagnik on 2026-08-01 (§2.4) but does not appear in any
session. Everything else labelled "we" is a Claude session or a research subagent working under
instruction. This matters because §2.8's failure list is almost entirely machine-generated error that a
human did not catch for days.

---

### 2.1 The timeline

#### Phase 0 — the repository, before there was a research programme

*2026-07-13 → 2026-07-25. No research. Four commits. The thing being researched did not exist yet.*

| when (IST) | commit | what |
|---|---|---|
| 2026-07-13 16:33:44 | `b9ddcfe` | `Hello frontmatter` — the repository's first commit |
| 2026-07-13 16:37:26 | `5dbb1ab` | `fix: pin typescript to 5.9.3, scope turbopack root` |
| 2026-07-17 00:40:41 | `0c1b427` | `feat: clone md app into frontmatter (product base)` |
| 2026-07-25 18:13:59 | `8eb4de2` | `feat: Firebase backend foundation, product docs, Tauri shell, frontmatter rebrand` |

`[measured — git log --format='%H|%ad|%s' --date=iso-strict]`

Two facts from this phase govern everything after it.

**First: frontmatter is a clone.** `0c1b427` says so in its own subject line. The editor was not designed
from scratch; it was lifted from `md`, an existing personal markdown app, and rebranded. That is why
§2.8's editor-bug list is long and why the product-gap research in §2.1.5 found exactly one hardcoded
user — the code was never written for a second person.

**Second: `main` has not moved since 2026-07-25.** `8eb4de2` is still the tip of `main` and of
`origin/main` at the time of writing `[measured — git branch -a -v]`. Everything in this plan lives on
`engine/plan-and-diagnostics`.

The session that produced `8eb4de2` ran 2026-07-25T11:27:33Z → 2026-07-25T12:59:39Z (16:57 → 18:29 IST),
92 minutes `[measured — transcript a09c1a4c-c1d6-492c-bad2-aa3b171be394.jsonl, first and last event
timestamps]`. Its opening instruction, verbatim:

> *"This is basically the Markdown Project, the MD project, and we are reshaping such front matter for
> commercial selling and subscription purposes. For that, we are setting up a Firestore database at the
> backend. Vercel and GitHub are something that we'll use with Google sign-in and GitHub sign-in."*
> — 2026-07-25T11:28:22Z `[primary — transcript]`

That commit also landed `docs/FRONTMATTER-PRODUCT-PLAN.md` (271 lines) and `docs/research/` (4 files,
1,097 lines). The product plan records its own method verbatim: *"11 parallel research agents swept
Reddit … Hacker News (Algolia API, 3,220+ comments keyword-scored), Product Hunt, Kickstarter/Indiegogo/
indie launches, review sites … GitHub issue trackers of every git-sync tool … and 20 competitors'
official pricing pages"*, yielding **92 sourced pain points, 89 feature requests, a 20-app competitor
matrix** `[primary — docs/FRONTMATTER-PRODUCT-PLAN.md:6]`. This is the **demand-side** research base. It
predates the entire engine programme and it is the only research in the corpus that talked to users
rather than to registries. It governs the editor track.

> **A discrepancy, named.** The brief for this section asks for a timeline beginning **2026-07-12**. The
> earliest artifact I can find is `b9ddcfe` at 2026-07-13T16:33:44+05:30, and `.vercel/project.json`
> with a filesystem mtime of `13 Jul 16:39` `[measured — ls -la]`. **Nothing dated 2026-07-12 exists in
> this repository.** The git record governs. If something happened on 2026-07-12 it happened outside
> version control and outside every transcript in `~/.claude/projects/`.

---

#### Round 1 — the mdmap / MD3 / MDZ session

*Session `e98d6e0f-f1fc-42ab-b8fb-e4c972dbd687`. 2026-07-28T21:05:45Z → 2026-07-29T03:30:27Z
(2026-07-29 02:35 → 09:00 IST). 6h 25m. Produced `docs/mdmap/` (untracked) and
`HANDOFF-mdz-markdown-format-2026-07-29.md`. Zero commits.* `[measured — transcript span]`

**What triggered it.** The founder asked for a "Markdown Map" — a recursive tree of markdown files, each
containing seven more, each of those containing ten or eleven, interconnected like Obsidian's graph,
readable end-to-end by a human or an AI. Verbatim, 2026-07-28T21:05:46Z:

> *"From everything that we saw, I need one Markdown. There can be 10 Markdows, which is perfectly fine,
> but what I want you to create today, from this time onwards, is a set of Markdown structures, like a
> Markdown tree. We can call it MDMAP, maybe, or Markdown Map. … Every single Markdown will have a
> graph, and they can be interconnected. … The naming can be decided later, but I want to create this
> concept."* `[primary — transcript]`

**What ran.** Four waves, all recorded with mechanically-sourced token counts read from task-notification
usage blocks:

| wave | agents | subagent tokens | tool uses | duration |
|---|---:|---:|---:|---|
| Round-1 fan-out (graph/PKM prior art, markdown graph specs, AI codebase maps, Reddit/HN pain sweep, canvas rendering, naming/trademark) | 6 | 1,164,842 | 352 | — |
| Workflow `w3f3hmo9k` (`wf_b8d494a7-c15`) — markdown as container | 17 | 3,155,872 | 954 | ~51 min |
| Workflow `w24o7rxuc` (`wf_9cc55917-109`) — the compiler thesis | 14 | 2,693,995 | 873 | ~82 min |
| Academic literature sweep (8 delivered of 11 dispatched) | 8 | 1,457,736 | 421 | — |
| **total** | **45** | **8,472,445** | **2,600** | — |

`[secondary — HANDOFF-mdz-markdown-format-2026-07-29.md §4 "research spend", figures stated there as
read from task-notification usage blocks]`. Arithmetic check: 1,164,842 + 3,155,872 + 2,693,995 +
1,457,736 = **8,472,445** `[measured — python3]`. The handoff's own total reproduces exactly.

**What it concluded.** Eight things, in the order they were established:

1. **Do not build a new markdown format.** Every format that added power lost adoption. `MDX` — Vercel-
   backed, Next.js-native, 9,426,793 npm downloads/week — is **3.07% of `.md` volume, one file in 33**.
   `Markdoc` (Stripe) is **0.136%, one in 736**. Obsidian's own `.base`, in an app with millions of
   users, is **0.028%**. `djot`, written *by CommonMark's own author* and technically superior, gets
   **848 downloads/week against remark-parse's 44,612,912 — a factor of 52,610**. Meanwhile `AGENTS.md`,
   which has **no schema at all**, exists in **175,424 files on GitHub**, and `SKILL.md`, which has two
   frontmatter fields, has **44 cross-vendor clients**, with Cursor shipping `/migrate-to-skills` to
   deprecate its own format into it. `[secondary — HANDOFF-mdz §2.1]`
2. **Base64 binary inside markdown is arithmetically dead.** Five independent measurements across two
   tokenizer families converged on **0.90 tokens per byte**: the session's own run on three real repo
   images gave 0.70–0.87 tok/byte (o200k_base, tiktoken); three workflow agents gave 0.8966–0.9198,
   0.9101 and 0.920; an adversarial re-computation over 600 B / 50 KB / 1 MiB gave 0.9033–0.9104.
   Consequence: **a 200 KB JPEG consumes 93.1% of a 200K context window**; 1 MB ≈ 944,000 tokens. A real
   Jupyter notebook is **98.3% base64 by tokens — 227,352 tokens, 114% of a 200K window**.
   `[secondary — HANDOFF-mdz §2.2; the 0.70–0.87 leg is [measured] by that session]`
3. **The intersection this product wants was vacated from both sides in 2026.** *Reflect Open* (MIT,
   1.4k stars, shipped 2026-07-14) keeps plain markdown as source of truth and ships a CLI *"for scripts
   and agents"* — **and ships no map view**. *IWE* (Apache-2.0, ~1.3k stars) is a real markdown knowledge
   graph with LSP, CLI and MCP — **and has zero visual surface**. `[secondary — HANDOFF-mdz §1.4]`
4. **A map must be smaller than the thing it maps.** Measured against the founder's own live knowledge
   graph: 273 files / ~546,933 words produced **3,848 nodes, 3,737 edges, 341 communities**, of which
   **329 were auto-named "Community 11"…"Community 339"** and only **6 of 341 (1.76%) carried a usable
   label**; the report artifact alone was 141,837 bytes (~35k tokens) and `graph.json` 3,414,569 bytes.
   `[measured — that session ran the greps; the handoff records that its own first estimate was wrong
   and was corrected by counting]`
5. **A direct competitor exists.** `mdbase-dev/mdbase-spec` — "Typed Markdown Collections Specification",
   v0.3.0, 88 stars, 17 spec chapters, org created 2026-01-30, pushed 2026-07-28 — ships a CLI, a
   TypeScript implementation, an **LSP**, a Rust implementation, an Obsidian plugin and `mdbase.dev`. Its
   feature list is this thesis nearly verbatim, *including the plain-markdown constraint*. Its gap:
   identity is **record-level** (one ULID in one file's frontmatter). **No concept of a block.**
   `[secondary — HANDOFF-mdz §3.4]`. **It was found by accident while checking domain availability.**
6. **The academic ancestor is 30 years old.** Software Reflexion Models (Murphy, Notkin & Sullivan,
   FSE 1995; TSE 27(4) 2001; SIGSOFT Retrospective Impact Award 2011). Its Excel case study: ~1.2M lines
   of C, 77,746 calls in the source model, a **170-line map written in a few hours**, first model
   computed in **20 minutes**, first result **15 convergences / 83 divergences / 4 absences**. The
   engineer's counterfactual estimate for the same insight by other means was **up to two years**; it
   took four weeks. `[secondary — HANDOFF-mdz §3.7]`
7. **Structure that users must declare has been failing since 1992.** Aquanet (Hypertext '91) shipped
   typed objects with typed relations and user-defined schemas — the exact design being proposed —
   and its own two-year postmortem, *"Two Years before the Mist"* (ECHT '92), reports verbatim:
   *"we observed far less use of relations than we had anticipated… Instead of articulating how different
   types of objects were related, users conveyed implicit relational structures through the use of
   spatial layout"* and *"the tool coerced us into prematurely schematizing our domain"*. gIBIS (TOIS
   6(4) 1988), from a deployed 32-user / 2,091-node trial: *"there are nine link types, and the feeling
   is that we are near the limit of people's ability to reliably perform the [color] mapping."*
   **Nine is the measured ceiling for an unaided type vocabulary.** `[secondary — HANDOFF-mdz §3.14]`
8. **Identity must be a name, not a hash.** *Incremental Computation with Names* (Hammer et al., OOPSLA
   2015) states that structural, hash-consed matching *"recomputes and reallocates a linear number of
   output elements for each O(1) input change"* while nominal matching *"need not rebuild the prefix."*
   **Content-hash identity is Θ(n) per edit; stable names are O(1)/O(log n).** This is an asymptotic
   requirement, not an optimisation. `[secondary — HANDOFF-mdz §3.16]`

**Artifacts.** `docs/mdmap/` — 21 files, **16,906 words** `[measured — find | wc -l and cat | wc -w,
re-run at write time; both reproduce the handoff's figures exactly]`. It declares 81 nodes of which 20
exist (61 "ghosts"). A published interactive artifact at
`https://claude.ai/code/artifact/3d22ae8a-2293-462a-b800-85d5f53a2309`, HTTP 200 at write time
`[secondary]`.

**What went wrong in this round.** Three agents were still in flight when the handoff was written and
their findings were never collected. One agent (`a3822aff54512c4cb`) **returned empty** — it fanned out
to sub-agents and returned a status note instead of findings, wasting **129,126 tokens**; it had to be
re-dispatched with an explicit no-further-fan-out instruction. `[secondary — HANDOFF-mdz §1.14]`

---

#### Round 1b — the graph-engineering contribution

*A separate session, launched from a different working directory; its transcript is not in this
project's `~/.claude/projects/` folder. Recorded only as
`HANDOFF-graph-engineering-research-2026-07-30.md`, 675 lines. Zero commits of its own.*

**What triggered it.** The founder pasted a YouTube URL (`H7t3uUp3HVw`, "Anthropic Just Fixed Graph
Engineering's Greatest Flaw", channel AI LABS, 847 s, uploaded 2026-07-29, 2,249 views at fetch) with:

> *"check this detailed and end to end way and let me know the detailed summary of this. So dig deep
> inside this graph engineering because I am planning to build an upgraded version of Markdown and also
> build front matter, which will be a Markdown editor."*
> `[primary — HANDOFF-graph-engineering §1.1, quoted verbatim there]`

**What it concluded.** Three things survived; one is the reason the document is in the record at all.

1. **The video's central claim is marketing.** *"Anthropic just released a fix"* is false: "graph
   engineering" is a **community coinage that trended mid-July 2026**, and the patterns it describes
   (parallelisation, orchestrator-workers, evaluator-optimizer) are from Anthropic's *Building Effective
   Agents*, **December 2024**. `[primary — verification searches recorded in §1.4 of that handoff]`
2. **Two different graphs were being conflated.** The video's graph has **agents as nodes and data flow
   as edges**. A markdown editor needs a graph with **notes/blocks as nodes and links as edges**. These
   are unrelated problems and the conflation would have produced the wrong architecture. Agent-graph
   ideas were routed to the editor's AI features; knowledge-graph ideas to the engine.
   `[primary — §1.3]`
3. **The judge-model lesson, kept.** Verbatim from the video: *"The node that does the judging is the
   one place where saving tokens costs you everything."* A Haiku reviewer returned a long list of issues
   that were mostly intentional; Opus flagged fewer, all real. `[secondary — the video is the source]`

**How it entered the record.** The founder pasted it as a payload on 2026-07-29T19:40:08Z and again at
2026-07-29T20:26:54Z `[primary — transcript 2e90ab3b]`. It was folded into `docs/engine/PLAN.md` as §14
by commits `575768e` and `c847f62` on 2026-07-30. Its own author's verdict, in its opening: *"`docs/
engine/PLAN.md` v0.2.0 … is CANONICAL and more advanced than the design in Part II of this document. Do
not merge Part II's proposals into PLAN.md."* `[primary — that file's header]`

**Its one durable contribution beyond the correction:** it flagged a **live architecture conflict** —
`docs/FRONTMATTER-PRODUCT-PLAN.md` §4b says "No peer CRDT — server-authoritative" while
`docs/engine/PLAN.md` §8 specifies Eg-walker/Braid. That conflict was opened 2026-07-30 and stayed open
for two days. It is resolved in §10 of this plan.

---

#### Round 2 — the engine plan session

*Session `2e90ab3b-4a90-4362-bce4-042a842a2af5`. 2026-07-29T02:34:35Z → 2026-07-31T23:18:20Z
(2026-07-29 08:04 IST → 2026-08-01 04:48 IST). **68 hours 44 minutes**, 36 human prompts. Produced 16
commits and `HANDOFF-mdmax-markdown-engine-2026-08-01.md`.* `[measured — transcript span; human prompt
count from a transcript parse excluding task notifications and local-command echoes]`

This is the longest single session in the programme and it contains three of the four founder
interventions that changed the project.

**2026-07-29T03:31:36Z (09:01 IST) — the scope correction.** Answering a structured question set, the
founder wrote, verbatim:

> *"Front Matter we are building separately. This will be the backbone of frontmatter. Front Matter is
> just an editor. Check the MD project first. Front Matter will be just a clone of that. This is the
> markdown engine that we are gonna build, okay? The new markdown, basically, as I mentioned. Before
> building anything, let us just have the plan sorted properly: what exactly we are gonna build."*
> `[primary — transcript 2e90ab3b, tool_result of an AskUserQuestion at 2026-07-29T03:31:36Z]`

Three further answers arrived in the same turn: drift handling = *"Both, gated by confidence"*;
competitors (mdbase, IWE) = *"Route around both"*; naming = *"No separate name — it's just frontmatter"*
(later revised, §2.5). **This is the founding constraint of the programme.** Everything after it treats
the engine and the editor as separate tracks. It is decision **D5** in this plan's terms, one round
before AIOS was even discussed.

**2026-07-29T21:26:51 IST — the first four commits.** `5ff90a4` (mdmap tree + engine plan v0.2) and
`58322f7`, which fixed **two real bugs in shipped code**: `extractBodyText` was deleting every fenced
code block and table before indexing, and `graph-data.ts` was silently dropping unresolved links
(`if (targetPath === undefined) continue`). Then `33d1b3c` (§12 token corrections), `57411a1` (§11a, the
block is the unit of identity not of meaning) and `ae81971` (§1.1a, the re-anchoring algorithm).
`[measured — git log]`

**2026-07-29T21:19:59Z (2026-07-30 02:49 IST) — the extensibility question.** The founder pushed back on
the "no new extension mechanism" position:

> *"I'm unable to understand one thing. If Markdown is just the pre-processor of the representation, so
> a table is represented in a certain way, and JavaScript and MDX are represented in a certain way, why
> can't we find more such representations? Why can't we have a new version of Markdown with a folder
> tree, self-including files, and a file tree I am mentioning multiple times? Why can't we do that?
> First, tell me that."* `[primary — transcript]`

**2026-07-29T21:32:22Z (2026-07-30 03:02 IST) — the sentence that changed the project.**

> *"No, before doing that fix, I guess we are still doing way less research than we should be. … Just
> check that, research more deeply, and research more openly. **Don't just form an opinion just because
> you have to. I am absolutely fine with being proven wrong that we can't do, but at least let's push
> and improve how we pass Markdown.** … People still think it is just for AI and can't be done more than
> that, but I think several maps can be done through Markdown."* `[primary — transcript, verbatim]`

In the same message he sketched the mechanism that would eventually become D8: *"we can define
structures within Markdown. Maybe only the front matter will know that this means that. … We can have
our own language that the system will write, and the front matter will understand while rendering."*

**What ran in response.** Five agents were briefed to argue **for** extension, against the standing
prior. The result was `f60eac0` — §15, *"markdown is far more extensible than §10 claimed"* — which
**overturned §10's own "no new extension mechanism" row**. Fence dispatch was found to be markdown's
real, permissionless extension mechanism, validated across 30 uncoordinated platforms:
**330,496 `.md` files carry a ```` ```mermaid ```` fence against 259,136 `.mdx` files in existence**
`[secondary — PLAN.md §10, §15.1]`. Within the same session the claim was **self-corrected**: 330,496 is
a real absolute count but the **rate is 0.89%** (0.26% excluding mermaid's own docs, 0.17% on the
founder's own vault) — *"it validates the mechanism, not its penetration"* `[primary — README.md II.5]`.

**2026-07-29T22:34:07Z — the six-area utilization sweep.** The founder: *"Yeah, then research completely
and very deeply around those six areas. Okay, I'm perfectly fine to do that."* Six independent sweeps:
construct frequency · plugin ecosystems · security · accessibility · internationalisation · domain
conventions. Token counts for these agents are **not recorded in any artifact**; they are inside the
"~26 earlier agents" bucket (§2.2). Outputs, all committed 2026-07-30:

| commit | IST | what it established |
|---|---|---|
| `c565be9` | 04:30:10 | §16 — plugin demand read as revealed preference. 6,047 Obsidian plugins, **132,834,339 cumulative downloads**; classifying the top 300 (83.9% of demand) gives **FORMAT 40.1% · APP 31.0% · EXTERNAL 19.5% · RENDER/ERGONOMICS 9.4%**. It replicates on three populations sharing no mechanism: plugins 40.1%, forum requests 39.0%, VS Code extensions 35.4% |
| `eadbf6f` | 04:36:52 | A DOM-verified XSS regression corpus, **55 payloads, proven to fail 28/55 against a deliberately neutered policy** before being trusted — the discipline of making a test fail against unfixed code |
| `525ad98` | 04:42:00 | §17 — what breaks outside English. **`NFC` decomposes Bengali `ড়`/`য়`/`ঢ়`** (Unicode composition exclusions), so "just normalize everything" rewrites **77 of 437 lines** of a real poem file. Markdown's link syntax is built **entirely from bidi-mirroring neutral characters**, so RTL source visual order structurally cannot match logical order. **axe-core fires only 7 of its 105 rules** on 2,286 rendered markdown files, and 98.5% of 11,695 violations trace to two causes in page chrome |
| `9055884` | 05:40:15 | `docs/engine/README.md`, the 789-line master plan |

`[measured — git log; figures [secondary] from PLAN.md §16–§17 and README II.4]`

**2026-07-31 evening — the dossier, and a warning sign.** Three commits (`8c0a426`, `88a92f4`,
`798ebbf`) produced and then cosmetically fixed a 12-page PDF. `798ebbf` is worth one line because it
was done correctly: page overflow was **measured, not eyeballed** — a Puppeteer script reported
per-page clearance and found **page 11 at −258px and page 7 at −33px**; the fix split the overflowing
section rather than deleting the benchmark table `[secondary — HANDOFF-mdmax §2.8]`. It is also the
moment the programme's own later self-assessment identifies as the turn: *"three of four recent commits
were cosmetic PDF fixes. Honesty was being converted into inertia."*
`[primary — docs/mdmax/PLAN.md:441-442]`

**2026-07-31T20:43:37Z (2026-08-01 02:13 IST) — the MDMAX reframe.** In a single 1,100-word message the
founder produced the product's name, its thesis, and the "Google Doc" framing. Verbatim excerpts, in the
order they appear in that message:

> *"The utmost utilization of Markdown, as you mentioned, is not a format problem. **Maybe we can't
> invent a new Markdown, maybe we can't invent a new format, but we definitely can invent a new style of
> utilization of Markdown, how more Markdown can be utilized.**"*

> *"we generally share let's say PDF or markdowns or PDF or PPT or let's say what documents, a different
> file, different format, different document. … AI need to process those PDFs. So why can we have this
> custom rendered markdowns which will be rendered as that defined in that particular whatever desired
> file?"*

> *"**we need a Google Doc for Markdown.** We need a simplified format for writing Markdowns so people
> can write markdowns and then Markdowns will be rendered as let's say define formats"*

> *"**this is markdown maxing okay this is uh nothing but markdown maxing so mdmax is something I'm also
> thinking as a name rather than md3** so this is markdown maximize so maximize use of markdown"*

`[primary — transcript 2e90ab3b, all four excerpts verbatim from one message]`

> **Contradiction, named.** `HANDOFF-mdmax` §2.9 renders this as *"we generally share PDF or markdowns
> or PPT... AI need to process those PDFs. So why can we have this custom rendered markdowns... one
> single file for everything... this is markdown maxing... MDMAX."* That is a **compression with
> ellipses of two separate messages**, not a verbatim quote — "one single file for everything" comes
> from the 2026-07-31T22:35:50Z message, not this one. Where they differ, **the transcript governs**;
> the handoff's version is a paraphrase and should not be quoted as verbatim.

**2026-07-31T22:35:50Z (2026-08-01 04:05 IST) — the library idea and the naming request.** Same night,
two hours later:

> *"How we can develop this Markdown System? **It can be called MDMAX? Just check if MDMAX is something
> we can use.** Because we are just maxing the Markdown usage. Utilizing the to the max. … The file
> format will be dot md only but how we can utilize the maximum number of owned representations?"*

> *"how markdown can markdown also libraries like Python can we import a library mark content those
> functions those instruction I would say and then we can refer resurface that and using by using that
> we can maybe generate charts in markdown and if I say import let's say a markdown library then
> markdown will know that okay this library is hosted let's say SGNK only … **one single file for
> everything** that's what I want I want the features to be there in one single file **I don't want to
> be over jargon but if it is a library importing things and people are not jargon at all they can use
> features that they want to in Python there are thousand libraries people might use hundreds only**"*

> *"we are building a markdown editor so **our editor on the max plan should give features that is
> unseen in the industry** that's it"*

`[primary — transcript 2e90ab3b, verbatim]`

**What ran in response.** The **25-agent MDMAX foundations workflow**, `wf_3b9ab146-77b`:
**25 agents · 3,059,467 subagent tokens · 736 tool uses · 1,872,350 ms · 0 errors**
`[secondary — HANDOFF-mdmax §2.11, figures read from the completion notification]`. Six areas: package/
import model · format governance · transitive doc graphs · editor frontier · AI-to-AI · adversarial gap
audit. Findings preserved at `docs/engine/research/wf-findings-2026-08-01.md` (454 lines) — rescued from
`/tmp` before it was cleaned.

**What it concluded**, in four results that still stand:

1. **The library model is viable and has a named blueprint — but it costs you your identity.** Only
   **two** document formats ever acquired a package ecosystem: **LaTeX** (7,021 CTAN packages, 35 years)
   and **Typst** (1,481 packages in ~3 years). *Both are Turing-complete languages whose surface syntax
   happens to be documents.* Everything markdown-adjacent — Quarto, Sphinx, MkDocs, Pandoc, R Markdown —
   **deliberately refused** document-declared registry resolution. MDX has real `import` statements and
   built **no registry at all**. The agent's own words: *"acquiring a package ecosystem means becoming a
   programming language, or admitting you are a thin shell over one. Decide which, explicitly, before
   designing syntax."* Typst's own vendor blog says its registry was *"a minimum viable package manager
   that a single person could build in a week."* `[secondary — HANDOFF-mdmax §7.1]`
2. **CommonMark is frozen — do not spend a week on it.** **Zero net new conformance examples** between
   0.30 (2021-06-20) and 0.31.2 (2024-01-28); the entire 0.31 changelog is typos and link fixes. 81 of
   1,848 commits since 2020, **44% by one person**. No `CONTRIBUTING`, no `GOVERNANCE`. The 1.0 blocker
   list opened in 2015 still says "[6 remaining]", last edited 2019. Two IETF principals offered to
   formalise the spec — **no maintainer reply in four years**. Its own author built **djot** in 2022
   rather than amend it. `[secondary — HANDOFF-mdmax §7.2]`
3. **For a document graph, ship an INDEX, not a container.** Anthropic ships both from one corpus: index
   **38,847 B / 174 links**; inlined container **6,556,407 B** — **168.8×**, ~1.64M tokens, larger than
   any context window. Index plus three selectively-read docs ≈ 17K tokens, a **96× saving**. And
   **LLMs do not traverse passively**: 97% of published `llms.txt` files got **zero requests**; AI
   retrieval bots were 1%; **coding agents with Read/Fetch tools were 10%** — the largest AI slice. For
   `CLAUDE.md`, Anthropic **gave up on traversal entirely and eagerly inlines imports at launch**.
   `[secondary — HANDOFF-mdmax §7.3]`
4. **Do not build a new AI-to-AI format.** *"Markdown"* appears **zero times** in all six MCP schema
   versions and in A2A. Every protocol wraps an **opaque** text blob in a typed envelope; they carry
   **zero** provenance, confidence, attribution or lineage. The one standard that *does* privilege
   markdown is **C2PA §A.9.3.2**, which says claim generators SHOULD PREFER **YAML front matter in a
   Markdown file** for a signed manifest — and **§A.8**, drafted for *"content intended for copy-paste
   operations across different systems"*, is still marked "under review". `[secondary — §7.4]`

**A failure inside this workflow, recorded because it recurs:** its synthesis agent returned a status
note — *"Reconciliation clean. No mutations or commits by this subagent. Deliverable delivered."* —
**instead of its synthesis**. The real content was only recoverable from the journal. Free-text agent
returns exhibit this; schema-forced agents did not. `[primary — HANDOFF-mdmax §2.11]` This is the second
instance of the same failure in the programme; the first was `a3822aff54512c4cb` in Round 1.

**2026-07-31T23:14:15Z — the round ends.** *"Ok, as my tokens are almost over on this account, I want you
to give a complete detailed brief and hand over to the other account."* `[primary — transcript]` The
result is `HANDOFF-mdmax-markdown-engine-2026-08-01.md`, 420 lines. Its most important content is §6:
**two load-bearing claims refuted on 2026-08-01 that the plan files still contained** (see §2.7 items 6
and 7).

---

#### Round 3 — the MDMAX consolidation session

*Session `9e5a4a9f-8c4a-4758-b560-0afea2b30447`. 2026-07-31T23:23:37Z → ongoing (2026-08-01 04:53 IST →).
24 human prompts. Produced commit `1bd4dad`, the first push in the programme's history, and this plan.*
`[measured — transcript span and prompt parse]`

**How it opened.** The founder pasted the handoff, then ~50 screenshots of the previous account's
conversation across six batches, then, 2026-07-31T23:37:50Z:

> *"Done. These are all the conversations. I took so much effort to screenshot all the conversations and
> send them to you so that you don't miss out on even a single thing that we discussed there. … Go
> through everything very deeply again … no scheme, every single line properly read … understood about
> the different pathways we took, understood about where we collided, where we had different opinions"*
> `[primary — transcript]`

**What that deep read found (2026-07-31T23:41:05Z), and it is a method failure worth its own line.** The
programme's test-count claim was inflated and had been for two days:

```
2026-07-29 08:12 IST   worktree claude/competent-bassi-5da9a1 created   82 test files
2026-07-29 21:27 IST   commit 58322f7 lands
                       PLAN.md §13 records "2,366 tests passing across 164 files"
                       82 (test/) + 82 (worktree) = 164          <- exact match
2026-07-29 22:07 IST   worktree claude/upbeat-euclid-60dbf4 created     82 more -> 247
```

Executed at read time: `vitest list --run --filesOnly` → **247 files, 3,484 tests**, of which
**164 files / 2,314 tests (66.4%) are two abandoned worktrees pinned at `8eb4de2`** — the commit
*before* all 16 commits of work. `vitest.config.ts` sets no `exclude` and the default does not cover
`.claude/worktrees/**`. `[measured — that session executed it]`. Both worktree branches still exist
`[measured — git branch -a -v, re-run at write time: `claude/competent-bassi-5da9a1` and
`claude/upbeat-euclid-60dbf4`, both at `8eb4de2`]`.

> **Contradiction, named and resolved.** `HANDOFF-mdmax` §0.7 states *"Test suite is green: **65 test
> files**, 3,484 tests collected (66.4% of them abandoned worktrees) at last full run."* The measured figure is **247 files / 3,484 tests, of
> which 164 files / 2,314 tests are stale duplicates**. **The measurement governs.** The number written
> into `PLAN.md` §13 as the evidence that commit `58322f7` was safe was already inflated when it was
> written. Neither "65" nor "3,484" should be repeated.

**2026-08-01T01:52:55Z (07:22 IST) — the 39-agent capability run lands.**
**39/39 agents, 0 errors, 7,864,147 subagent tokens, 2,159 tool uses, 105 minutes.**
`[primary — the assistant's own report in the transcript, quoting the completion notification]`
Shape: 18 research areas, each with a dedicated adversarial verifier, plus 3 synthesis lenses
(google-docs, ai-native, critic). Preserved at `docs/engine/research/wf-mdmax-capability-2026-08-01.*`
(raw 1.49 MB, journal 1.38 MB, normalized result 1,420,260 B) `[measured — os.path.getsize]`.

Area keys, for anyone citing it: `edit-format`, `cache-layout`, `ai-dialect`, `token-cost-tier`,
`retrieval-shape`, `degradation-certificate`, `multi-format-ingest`, `provenance-boundary`,
`collab-primitives`, `impact-preview`, `model-view`, `integrity`, `normalization-i18n`,
`unit-of-exchange`, `missing-constructs`, `adjacent-transplant`, `budget-knapsack`,
`governance-and-moat` `[primary — parsed from the result JSON]`.

**What it concluded — and the reason its headlines must never be quoted.** Its own completeness critic,
verbatim:

> *"18 of 18 area headlines were materially refuted by their own adversarial verifier. Not qualified —
> refuted. The sentence a reader would remember from every area was wrong, and it was wrong in the
> flattering direction every time (0.155%→0.0204%, 51,620→17,065, 12/12→11/12, 30×→3.44×,
> 8,603:1→1,067:1, "zero implementations"→two shipping packages found in one query, "the surface does
> not exist"→15.1× larger once the excluded construct is counted). That is not a research corpus with
> some errors in it; that is a measured, program-wide optimism bias with a 100% headline defect rate,
> and it means the verified residue — not the headlines — is the only asset here."*
> `[primary — wf-mdmax-capability-2026-08-01.result.json, synthesis[2].thesis]`

**Use `per_area[].verification`, never `per_area[].headline`.** This is a standing rule for anyone
reading that file.

**2026-08-01T02:08:39Z (07:38 IST) — the product is settled in one sentence.**

> *"FrontMatter is something which is still under planning. The screenshot that you saw, mostly that
> will be the UI. In the back, everything, how it would be, how it would behave, we can decide later.
> Initially, that was me and Amit, our co-founder. **Our plan for FrontMatter, I would say, will be
> Google Docs for markdown, as simple as that.**"* `[primary — transcript, verbatim]`

This is **D1**. It is the only sentence in the corpus that fixes what the product is, and it arrived
after 27 million tokens of research about what it could be.

**2026-08-01T02:12:38Z (07:42 IST) — the thinking agent returns.** A single deep-reasoning agent,
**291,528 subagent tokens · 44 tool uses · 795,308 ms** `[primary — the task-notification usage block in
the transcript]`. Its verdict, verbatim: *"The research produced one genuinely valuable, hand-audited,
unclaimed primitive and a great deal of excellent negative knowledge. Both are worth more than the
document they are currently trapped in."*

**2026-08-01T02:14:39Z (07:44 IST) — four decisions in one message.** The founder answered the open
architecture questions directly. Verbatim, lightly segmented:

> *"AIOS will go in a separate because AIOS is a much bigger concept where we are trying to improve plot
> code, but definitely front matter or MDMAX will definitely benefit AIOS, that for sure."* → **D5**

> *"The comments and everything will definitely be there, but to see those, you need to use this front
> matter … If you download the PDF, what will happen? You will not be able to see the comments, right?
> … How will you process whenever you export or copy something? Only the latest edits and all will be
> visible, nothing else."* → **D2**

> *"Can I review your command without an account? No, he has to log in with front matter auth. It will
> be mostly Google auth or GitHub auth. Auth is secondary as of now."* → **D3**

> *"if front matter dies, we'll give the full option to give the complete thing for you to migrate and
> also the Max plan that is there. Anyway, we are giving you offline access."* → **D4**

`[primary — transcript, verbatim]`

**2026-08-01T04:41:47Z (10:11 IST) — the 40-agent final gate lands.**
**40/40 agents, 0 errors, 7,858,804 tokens, 2,173 tool uses, 134 minutes.**
`[primary — the assistant's report in the transcript]`
Shape: 16 areas + per-area adversarial verification + a **kill audit** (four independent auditors
re-deriving the verifiers' kills from primary sources) + 4 synthesis lenses (era-and-vision,
product-market, technical, premortem-integrator). Preserved at
`docs/engine/research/wf-final-gate-2026-08-01.*` (result 1,364,043 B) `[measured]`.

Area keys: `the-era`, `founder-thesis`, `container-thesis`, `markdown-base`, `custom-pointers`,
`hold-more`, `rendering-frontier`, `parsing-robustness`, `product-gap`, `moat`, `market-and-gift`,
`aios-transfer`, `agentic-docs`, `competitive-live`, `against`, `premortem` `[primary — result JSON]`.

**Headline verdicts — 5 CONFIRMED, 10 OVERSTATED, 1 REFUTED** `[primary — headline_verdicts array]`:

| verdict | areas |
|---|---|
| **CONFIRMED** (5) | `custom-pointers`, `hold-more`, `rendering-frontier`, `product-gap`, `competitive-live` |
| **OVERSTATED** (10) | `the-era`, `container-thesis`, `markdown-base`, `parsing-robustness`, `moat`, `market-and-gift`, `aios-transfer`, `agentic-docs`, `against`, `premortem` |
| **REFUTED** (1) | `founder-thesis` |

The improvement from 18/18 refuted to 5/16 confirmed is real and is the result of three specific process
changes made between the runs: the corpus was pinned, verifiers were given primary-source access, and a
kill audit was added above the verifiers.

**The kill audit — how much to trust a kill.** Four auditors independently re-derived a sample of the
verifiers' kills. Their measured false-kill rates:

| auditor | sampled | upheld | overturned | false-kill rate |
|---|---:|---:|---:|---|
| A | 29 | 24 | 5 | **17.24%** |
| B | 29 | 28 | 1 | **3.4%** |
| C | 21 | 17 | 4 | **19.0%** |
| D | 26 | 26 | 0 | **0.0%** — *but 5 of 26 (19.2%) upheld kills carry a supporting figure the auditor could not reproduce* |

`[primary — wf-final-gate-2026-08-01.result.json, kill_audit[].false_kill_rate, quoted exactly]`

Auditor A's note states the operating rule: *"The verification layer is roughly 5x more reliable than
the research layer it audits (that layer ran a 100% headline defect rate), so it should be kept and
trusted — but not trusted blindly."* **A kill is strong evidence, not proof.** Auditor C explicitly left
8 of 29 kills unaudited *"rather than guess"*.

**The five findings that survived everything** — the CONFIRMED areas, in their own words, quoted exactly:

- `custom-pointers`: *"99.69% of the 4,538 `:::` directives in Docusaurus's own repo are among its 9
  vendor-shipped keywords and all 14 exceptions are the three tutorial strings that teach the feature,
  and 847 independently-authored npm docs use exactly GitHub's 5 built-in callout types with zero
  inventions … MDMAX should ship no declaration syntax, no registry and no library import, and instead
  ship the inverse — vocabulary inference and drift detection over values that already exist."*
- `hold-more`: *"the top invisible carrier (orphan link reference definition) has EXACTLY ZERO uses in
  the 1,084-file pinned corpus … 1,431 bare angle-bracket placeholders in 219/1,084 files that GitHub
  silently DELETES from rendered output, and 13,028 wikilinks GitHub renders as literal junk … the
  'authors reach for raw HTML' premise is refuted at 37/1,084 files (3.4%)."*
- `rendering-frontier`: *"the read-only side already works (12/12 unknown fence languages survive
  byte-intact through frontmatter's own pipeline) — it is blocked by write-back: the one WIRED rendered-
  editing surface, the properties panel, re-emits YAML through a serializer and changes bytes in 623 of
  737 frontmatter-bearing files (84.5%, of which 197 change the document's LINE COUNT) with zero edits
  made."*
- `product-gap`: *"there is exactly one user (`isAllowed()` compares a login to a single
  `ALLOWED_GH_LOGIN` string; `firestore()` has zero callers; `firestore.rules` declares a members/roles
  model and no `comments` collection), so every review-loop item in the mockups is unreachable, while
  the one collaboration-adjacent write path that already ships (Publish) round-trips only 3.64% of the
  pinned corpus byte-identically."*
- `competitive-live`: *"the threat is not OKF — it is inkeep/OpenKnowledge (GPL-3.0, 3,239 stars, 14,790
  npm dl/wk), which on **2026-07-30** merged a content-derived comment-anchoring system for markdown
  (exact quote + auto-widened prefix/suffix context, orphan-rather-than-guess …) that reached the npm
  BETA channel at 0.46.0-beta.32 on **2026-08-01T02:38:33Z** but is absent from stable 0.45.4; MDMAX
  §4.1 is therefore no longer an unclaimed capability, only an unclaimed *measured* one."*

`[primary — all five quoted from per_area[].headline in the result JSON]`

**2026-08-01T07:44:38Z (13:14 IST) — the push.** The founder: *"yes, restore it and push everything / i
give you elevated permissions."* `[primary — transcript]` Two minutes later, `1bd4dad`
(2026-08-01T13:16:12+05:30), 13 files, **+28,147 / −4 lines** `[measured — git log --stat]`:

```
HANDOFF-graph-engineering-research-2026-07-30.md         675 +
HANDOFF-mdmax-markdown-engine-2026-08-01.md              420 +
HANDOFF-mdz-markdown-format-2026-07-29.md                829 +
docs/engine/research/corpus-manifest.json              5,466 +
docs/engine/research/wf-final-gate-*.{journal,raw,result}  9,665 +
docs/engine/research/wf-findings-2026-08-01.md           454 +
docs/engine/research/wf-mdmax-capability-*.{journal,raw,result} 10,126 +
docs/mdmax/PLAN.md                                       501 +
src/modules/vault/infrastructure/search-index.ts          15 +/− 3
```

`origin/engine/plan-and-diagnostics` now exists at `1bd4dad` `[measured — git branch -a -v]`. **Before
this commit, the entire programme existed on one laptop with no remote copy.** That is 19 days from
`b9ddcfe`.

---

### 2.2 Every research round, tabulated

| # | date | round | method | agents | subagent tokens | outcome |
|---|---|---|---|---:|---:|---|
| R0 | 2026-07-25 | Demand research | 11 parallel agents over Reddit / HN Algolia / Product Hunt / review sites / GitHub issues / 20 pricing pages | 11 | not recorded | 92 pain points, 89 feature requests, 20-app matrix → `docs/FRONTMATTER-PRODUCT-PLAN.md` |
| R1a | 2026-07-28/29 | Graph/PKM prior art fan-out | Agent tool, 6 parallel | 6 | **1,164,842** | The intersection is empty and was vacated from both sides in 2026 |
| R1b | 2026-07-29 | Workflow `w3f3hmo9k` — markdown as container | Workflow tool, 17 agents, ~51 min | 17 | **3,155,872** | Base64 dead at 0.90 tok/byte; no new format |
| R1c | 2026-07-29 | Workflow `w24o7rxuc` — the compiler thesis | Workflow tool, 14 agents, ~82 min | 14 | **2,693,995** | Compiler thesis supported; mdbase found; the primitive is identity-on-write |
| R1d | 2026-07-29 | Academic literature sweep | Agent tool, 11 dispatched, 8 delivered, 3 abandoned | 8 | **1,457,736** | Reflexion Models; Aquanet/Formality; Dexter; DocEng; incremental computation |
| R1e | 2026-07-29/30 | Graph-engineering contribution | 1 session, video + 3 verification searches | — | not recorded | "Anthropic just fixed" is marketing; agent-graph ≠ knowledge-graph |
| R2a | 2026-07-30 | Extensibility challenge | 5 agents briefed to argue *against* the prior | 5 | not recorded | **§10 overturned.** Fence dispatch is the real extension mechanism |
| R2b | 2026-07-30 | Six-area utilization sweep | 6 independent deep sweeps | ~6 | not recorded | §16 (40.1% FORMAT demand) and §17 (NFC/bidi/a11y) |
| R2c | 2026-07-30/31 | Second research wave | Agent tool, 7 agents | 7 | not recorded | Token economics, dual-view, AI-emitted markdown, cache layout, folklore trace |
| **R3** | **2026-08-01** | **MDMAX foundations** — workflow `wf_3b9ab146-77b` | 25 agents, 736 tool uses, 1,872,350 ms, 0 errors | **25** | **3,059,467** | Library model viable but costs you your identity; CommonMark frozen; index not container; no new AI-to-AI format |
| **R4** | **2026-08-01** | **MDMAX capability run** | 18 areas + per-area adversarial verify + 3 synthesis lenses. 2,159 tool uses, 105 min, 0 errors | **39** | **7,864,147** | **100% headline defect rate.** Verified residue is the asset |
| **R5** | **2026-08-01** | **Final gate** | 16 areas + verify + kill audit + 4 lenses. 2,173 tool uses, 134 min, 0 errors | **40** | **7,858,804** | 5 CONFIRMED / 10 OVERSTATED / 1 REFUTED; false-kill 0–19% |
| R6 | 2026-08-01 | Deep-reasoning thinking agent | 1 agent, 44 tool uses, 795,308 ms | 1 | **291,528** | One valuable primitive + a great deal of negative knowledge |

**Sources for the token columns.** R1a–R1d `[secondary — HANDOFF-mdz §4]`; R3 `[secondary — HANDOFF-mdmax
§2.11]`; R4, R5, R6 `[primary — read from the completion notifications in transcript
9e5a4a9f]`. Rows marked *not recorded* have no token figure in any artifact; do not invent one.

**Mechanically-sourced total: 27,546,391 subagent tokens across 150 agents.**
`[measured — 8,472,445 + 3,059,467 + 7,864,147 + 7,858,804 + 291,528 = 27,546,391; 45 + 25 + 39 + 40 + 1
= 150]`

> **Three published totals disagree with each other. Here is the reconciliation.**
>
> | source | claim |
> |---|---|
> | `HANDOFF-mdz` §4 | *"45 completed agents · ~8,472,445 subagent tokens"* |
> | `docs/engine/PLAN.md` frontmatter + `README.md` II.1 | *"~14M subagent tokens across ~90 research agents + 20 local experiments"* |
> | `HANDOFF-mdmax` §0.4 | *"~2.4M tokens of research across ~26 agents + one 25-agent workflow"* |
>
> These are not three estimates of one thing; they are three different scopes. `HANDOFF-mdz` counts
> **Round 1 only**. `HANDOFF-mdmax` §0.4 counts **Round 2's own agents only** (the ~26 that produced
> §15–§17 and the second wave), stated *separately from* the 25-agent workflow. `PLAN.md`'s ~14M is the
> **cumulative through the 25-agent workflow**: 8,472,445 + ~2,400,000 + 3,059,467 ≈ **13,931,912**,
> which rounds to ~14M, and 45 + ~26 + 25 = 96, which rounds to ~90. `[inference — the arithmetic is
> mine; no artifact states this reconciliation]` The three are consistent once scoped, and the
> apparent contradiction is a labelling failure, not a counting one.
>
> **But `HANDOFF-mdmax` §0.4 does contradict its own §2.11**: §0.4 says *"~2.4M tokens … across ~26
> agents + one 25-agent workflow"* while §2.11 reports that workflow alone at **3,059,467 tokens**. If
> §0.4 is read as an inclusive total it is wrong by more than 600,000 tokens. **§2.11 governs** — it
> quotes the completion notification.
>
> **Cumulative through 2026-08-01: ≈ 29.9M subagent tokens.**
> `[measured — 13,931,912 + 7,864,147 + 7,858,804 + 291,528 = 29,946,391]` The `~2,400,000` term is the
> only soft input; every other term is quoted from a completion notification.

---

### 2.3 Every name we tried, and what killed it

Five names, four dead. The pattern is identical in every case and it is worth stating before the table:
**none of them died on availability. Every one died on occupancy** — the word was free, the slot was
taken.

#### MD3 — died 2026-07-29

- **142 of 142 npm packages matching `md3` are Material Design 3.** `[secondary — HANDOFF-mdz §3.5]`
- **5,611 GitHub repositories** carry the name.
- `.md3` is already the **Quake III model file extension**.
- And the disqualifier nobody expected: it **collides with the founder's own global Learned Rule #52**,
  which mandates Google Material Symbols — the Material Design 3 icon set — as the only sanctioned icon
  language across every surface he builds. `[primary — ~/.claude/CLAUDE.md, Learned Rule 52]`

The founder had asked whether to buy `md3.in` for $20 / 3 years. It was verified **AVAILABLE** via the
authoritative RDAP bootstrap (a first attempt returned `000`, a connection failure, and was re-run
rather than reported as an answer) `[measured — that session ran it]`. It was not bought.

#### MDZ ("MD Zephyrus") — died 2026-07-29

- As a **word** it is clean: 1,610 GitHub repos, but 54% are personal initials — scattered noise, not a
  brand.
- **As a format slot it is occupied.** `.mdz` is *already* the established extension for a compressed
  markdown package, with **four live projects in exactly that slot**: `wflixu/mdz` ("Markdown Zip"),
  `mdz-format/mdz`, `mdzip-project/mdzip-spec`, and npm `@mdzip/editor` at **582 downloads/week**.
- **All four `mdz.` TLDs are taken** (.dev / .in / .ai / .org).
- npm `mdz` returns HTTP 200 but has **zero versions and no description** — an unpublished placeholder
  last modified 2026-05-18.

`[secondary — HANDOFF-mdz §3.5; the npm and RDAP checks are [measured] by that session]`

The verdict recorded at the time: **"Clean as a word, polluted as a format — precisely backwards."**

#### mdmap / MDMAP — never a product name; retired as a concept

`mdmap` was the founder's own first coinage (2026-07-28T21:05:46Z, verbatim above). It named a
**deliverable**, not a product: `docs/mdmap/`, 21 files, 16,906 words `[measured]`. It was retired
because the concept it named was measured out of existence on the founder's own vault:

```
median out-degree      ZERO                    mean 2.27, p90 5
597 files (55.1%)      zero outbound resolved edges
502 files (46.3%)      FULLY ISOLATED — no in, no out
511 connected components; the largest holds 40.1%
transclusion ![[…]]    45 occurrences in 25.5 MB — all 45 are syntax documentation
                       genuine content transclusion: ZERO
```

`[measured, corpus_id sha256:3a010b16…; primary — docs/mdmax/PLAN.md §3.2, re-derived and matching]`

*"A single markdown connected to hundreds of markdowns, and those hundreds connected to hundreds each"*
**is the opposite of this corpus.** Four independent agents plus the synthesizer agreed. The directory
survives, committed in `1bd4dad`, as a record. The graph view was cut with it: **zero occurrences of
"graph" across 89 sourced feature requests** and zero in the round-2 corpus.

`docs/mdmap/` also earned its keep in an unintended way. Its own root `MAP.md` declares
`commit: 8eb4de2` and states *"stale: 0 — built at commit 8eb4de2, which is HEAD."* HEAD was `798ebbf`,
16 commits later. **A document asserting a fact about the repository that the repository contradicts,
occurring inside the artifact that proposes the reconciler.** `[measured — that session compared the
frontmatter to `git rev-parse HEAD`]` That is the product's best free demo and it happened twice.

#### markedmax — proposed and killed on 2026-07-31, inside two minutes

The founder, 2026-07-31T23:44:47Z (2026-08-01 05:14 IST), verbatim:

> *"markedmax hwo about this name for this md enhancmenet ? or you suggest something else"*
> `[primary — transcript 9e5a4a9f]`

Availability was checked live and was **completely clean**:

```
npm    markedmax · marked-max · markmax · mark-max · mdmax · md-max · maxmd
       markdownmax · markdown-max                          ALL FREE
PyPI   markedmax · marked-max · markmax · mdmax            ALL FREE
GitHub repos named "markedmax"                             0
```

`[measured — that session ran `curl` against `registry.npmjs.org` and `pypi.org` for each candidate;
raw tool output in the transcript]`

**It was rejected anyway, on three grounds:**

1. **`marked` is a markdown parser with 61,032,058 downloads per week** `[measured — api.npmjs.org
   last-week point query, run in that session]` — and it is **one of the exact four toolchain families
   the plan says MDMAX must ship ports for** (remark/rehype, markdown-it, **marked**, markdig). Naming
   the format after one of your four ports asserts that you are a fork of it. You are not: the stack is
   micromark/remark plus `@lezer/markdown`.
2. **"marked" is not "markdown."** It is a past participle and it is a third party's brand for a
   *renderer*. The founder's own coinage was *"this is markdown maxing"* — the subject of that sentence
   is markdown. `markedmax` drops the subject.
3. **It needs a disambiguation sentence every time it is spoken.** "em-dee-max" is three syllables and
   works as a CLI verb (`mdmax build --index`).

#### MDMAX — kept, and its one real weakness named

Verified live 2026-08-01 `[measured — HANDOFF-mdmax §9, curl against both registries]`:

```
npm     mdmax · md-max · markdown-max · mdx-max   →  ALL FREE
PyPI    mdmax · markdown-max                      →  FREE
GitHub  repos named mdmax: 13, all 0-star noise
        github.com/mdmax → taken (dormant personal account)
```

Only footnote: "MD" means molecular dynamics in chemistry, so `MDmax` appears in one unrelated physics
repository.

**The weakness, stated rather than hidden: "Max" implies *more*, and the programme's central finding is
that more is worse.** Structure added without compression costs **−6.6 to −15.7 points**; padding a
table costs **30–35% for zero semantic gain**. The honest product claim is *fewer tokens, one parse
strategy, declared provenance* — explicitly **not** better comprehension. A name meaning "maximum"
fights that.

It survives because the founder's own framing resolves it: **MAX = maximal utilisation of what markdown
already is**, not more syntax. *"we can't invent a new markdown, we can't invent a new format, but we
definitely can invent a new style of utilization"* `[primary — transcript, 2026-07-31T20:43:37Z]`.

**Two naming slots, both filled, and conflating them is what made this wobble four times:**

| slot | the thing | name |
|---|---|---|
| the **product** | the editor plus the compiler — the thing people run | **`frontmatter`** — *"the word names the primitive the thesis rests on"* |
| the **capability** | the container, the representations, the CLI, the certificate | **MDMAX** |

Same shape as Quarto and `.qmd`. This is **D10**.

---

### 2.4 Every idea we abandoned, and the specific measurement that killed it

Nothing in this table may be re-opened without a new measurement that beats the one in the right-hand
column. That is the whole purpose of the table.

| # | idea | the measurement that killed it | tier | when |
|---|---|---|---|---|
| 1 | **Base64 binary inside markdown** | **0.90 tok/byte**, five independent measurements across two tokenizer families (own run 0.70–0.87 o200k; three agents 0.8966–0.9198, 0.9101, 0.920; adversarial 0.9033–0.9104). A 200 KB JPEG = **93.1% of a 200K window**; a real Jupyter notebook is **98.3% base64 by tokens = 227,352 tokens = 114% of a 200K window**. Also: CommonMark's reference implementation silently empties `data:` URIs to `src=""`, and line-wrapping base64 destroys the image syntax outright | `[measured]` + `[secondary]` | 2026-07-29 |
| 2 | **Polyglot ZIP tail** (a real ZIP archive appended to a `.md`) | UTF-8 round trip produced **82,957 U+FFFD replacement characters and +81% bytes**; a `.gitattributes` `*.md text` rule **corrupted the archive in one checkin** (`unzip -t`: *bad zipfile offset*); git binary-detects below an 8,000-byte head and line-merges above it | `[secondary — PLAN.md §10]` | 2026-07-29 |
| 3 | **A new dialect requiring its own parser** | MDX **3.07%** of `.md` volume (1 in 33) with Vercel behind it; Markdoc **0.136%** (1 in 736) with Stripe behind it; Obsidian's own `.base` **0.028%**; djot, by CommonMark's own author, **52,610× behind remark-parse**. Against: `AGENTS.md`, with no schema at all, at **175,424 files on GitHub** | `[secondary]` | 2026-07-29 |
| 4 | **MDX as the base** | MDX **cannot write the document back out**. Verified directly: the MDX writer emits `{1 + 1}` from a program whose parsed body is empty — it follows the raw string and ignores the AST. The moment the engine needs an interpreter, it is MDX, and MDX has no `put` | `[primary — the writer was executed]` | 2026-07-30 |
| 5 | **A runtime / execution layer (WebContainers)** | `@webcontainer/api@1.6.4` is MIT but is a **176.5 KB postMessage client that boots an iframe at `https://stackblitz.com/headless`**; StackBlitz ToS caps paid plans at **500 sessions/month**. The real veto is **COOP/COEP**: it requires `Cross-Origin-Embedder-Policy: require-corp` **page-wide**, which breaks GitHub avatars and OAuth popups. Sandpack is dead (last commit 2025-02-14) and its `@codesandbox/nodebox@0.1.8` ships the **non-commercial Sustainable Use License** that scanners miss | `[secondary — HANDOFF-mdz §3.10]` | 2026-07-29 |
| 6 | **Runtime cross-file reactivity** | It shipped and was **removed by the people who invented reactive notebooks**: Observable Framework lets only pages declare reactive variables; cross-page sharing is plain non-reactive ES modules. marimo allows only top-level functions/classes; Pluto has none. Excel is the counter-precedent — cross-workbook links are its most notorious failure, and human inspection catches only ~**60%** of spreadsheet errors (Panko). **Take the linking, refuse the reactivity** | `[secondary — HANDOFF-mdz §3.12]` | 2026-07-29 |
| 7 | **Changing CommonMark** | **Zero net new conformance examples** between 0.30 (2021-06-20) and 0.31.2 (2024-01-28); **81 of 1,848 commits since 2020, 44% by one person**; no `CONTRIBUTING`, no `GOVERNANCE`; the 1.0 blocker list opened 2015 still says "[6 remaining]", last edited 2019; the two extension threads MDMAX would need have run **316 posts over a decade**, still open; two IETF principals offered to formalise the spec with **no maintainer reply in four years**; its own author built **djot** in 2022 rather than amend it. Re-derived independently in the final gate: spec commits 2019=48, 2020=15, 2021=14, 2022=15, 2023=12, 2024=12, 2025=7, 2026=6 (partial) | `[secondary]` + `[measured — the kill auditor re-ran the GitHub API]` | 2026-08-01 |
| 8 | **The graph view** | **Median out-degree ZERO** on the pinned corpus; **46.3% of files fully isolated**; **511 connected components**; **zero genuine content transclusions in 25.5 MB**. Plus **zero occurrences of "graph" across 89 sourced feature requests**. And the demand-side kill-shot from r/ObsidianMD: *"you make the links yourself, so the graph only ever shows you what you already know. it can't surprise you."* | `[measured, corpus_id sha256:3a010b16…]` | 2026-08-01 |
| 9 | **The notation library / vocabulary registry / declared-vocabulary syntax** | Measured **user-invention rate 0.31%**, and **all of it is tutorial content teaching the feature**. Concretely: **99.69% of the 4,538 `:::` directives in Docusaurus's own repo** are among its 9 vendor-shipped keywords, and all 14 exceptions are the three tutorial strings; **847 independently-authored npm docs use exactly GitHub's 5 built-in callout types with zero inventions**. And where a spec *forced* declaration, it produced drift, not vocabulary: four real OKF bundles gave 5/0/5/21 `type` values, ≥8 of the 21 in mutual collision, four incompatible naming conventions, and **0 of 4 declaring `okf_version`** | `[primary + measured — final gate `custom-pointers`, CONFIRMED]` | 2026-08-01 |
| 10 | **The doc-tree folder compiler and its incremental engine** | **Cold full build ~1 second**; **maximum transitive blast radius 54 of 1,084 files (5%)**. There is no separate-compilation problem to solve | `[measured — final gate technical lens]` | 2026-08-01 |
| 11 | **The "mother markdown" — one file containing many, split on read** | Container **25,548,765 B** vs a one-line-per-document index at **105,538 B** → **242×**. At 3.6 bytes/token a 200K window holds **2.82% of the container and 682% of the index**; even a 1M window holds **14.1%**; mean file 23,569 B, so a 200K pack carries about **thirty average files**. And the round trip is not unclaimed: `llm-code-format` already ships pack **and** unpack with zero dependencies at **387 downloads/month against repomix's 327,543 — 846:1**. The Obsidian forum thread asking to export a vault to a single file: **9,010 views, 1 like, 3 posts in 26 months** | `[measured, corpus_id sha256:3a010b16…]` + `[primary]` | 2026-08-01 |
| 12 | **In-band instruction/data separation as a prompt-injection defence** | A ``` fence around untrusted data moved attack success rate **51% → 50%**; the sandwich defence made it **worse, 55%**. Tool filtering — an architectural control, not an in-band one — got **6.8%**. Spotlighting: 1% ASR static → **>95% adaptive** | `[secondary]` | 2026-07-30 |
| 13 | **Typographic steganography** (hiding identity in list markers, emphasis delimiters, setext headings) | **One `remark-stringify` pass normalizes all of them.** Dead on first contact with any tool in the ecosystem | `[secondary — PLAN.md §10]` | 2026-07-30 |
| 14 | **Content-hash-only block identity** | Hammer et al., OOPSLA 2015: structural matching *"recomputes and reallocates a linear number of output elements for each O(1) input change"*. **Θ(n) per edit vs O(1)/O(log n) for names** | `[secondary]` | 2026-07-29 |
| 15 | **Demanding that users declare schemas or typed links** | Settled 1992 (Aquanet's own postmortem) and generalised 1999 (*Formality Considered Harmful*, Shipman & Marshall, CSCW 8(4)). Four named reasons: cognitive overhead, tacit knowledge, premature structure, situational structure | `[secondary]` | 2026-07-29 |
| 16 | **A large typed-link vocabulary** | **Nine is the measured ceiling**, from gIBIS's deployed 32-user / 2,091-node field trial (TOIS 6(4) 1988) | `[secondary]` | 2026-07-29 |
| 17 | **"Markdown is ~40% fewer tokens than HTML"** | Apples-to-apples — markdown source against *its own* rendered HTML — is **9.1% aggregate** (4.9–23.7% per document). The 78.5–97.2% figures use raw served production HTML that is 52–81% div soup as the denominator. A hostile fact-check found one agent's *"41.8% — safe to publish"* verdict **wrong** | `[measured — re-computation]` | 2026-07-29 |
| 18 | **"Markdown is easier for AI because it's in the training data"** | **Folklore, traced to origin.** MarkItDown's README says *"This suggests…"* and cites nothing; it was added **2025-03-06, nine months after the claim was already circulating**. And Llama 3's paper states the opposite verbatim: *"We find markdown is harmful to the performance of a model that is primarily trained on web data compared to plain text, so we remove all markdown markers."* | `[primary — both sources read]` | 2026-07-30 |
| 19 | **MDMAX as a business model** | It is a library subordinate to the editor. Base rate for the alternative: **markdownlint ran 11 years 4 months to 2.89M downloads/week and zero dollars** | `[primary — final gate product-market lens]` | 2026-08-01 |
| 20 | **Further research fan-out of any kind** | Cut by the programme itself, until one committed assertion goes red to green. Justification: **0 lines of engine code, 19 days after the first commit, with 12 of 20 commits being `docs`** | `[measured — final gate critic lens + git log]` | 2026-08-01 |

---

### 2.5 Every time research overturned our own position

A plan that never contradicts itself was never tested. There are **nine** recorded reversals, not five.
The first five are `docs/engine/README.md` §II.5 verbatim; four more came from the two 2026-08-01 runs.

**From `README.md` §II.5 (as of 2026-07-30):**

1. **"No new extension mechanism"** → **refuted.** Fence dispatch is real, permissionless and validated
   across 30 uncoordinated platforms. §10 had called a positive result negative. *(Triggered by the
   founder's push-back, §2.1 Round 2.)*
2. **"Rigid context fingerprint, k=2"** → **refuted by our own sweep.** Rigid fingerprints get *worse*
   as k grows: k=1/2/3 gives 90.65% / 88.68% / 87.22% correct. **Score context softly.**
3. **"Markdown merges worse than code"** → **refuted.** All lines unique: markdown 64.6–68.4% vs
   TypeScript 70.6%. **Non-blank lines unique: markdown 84.8–94.2% vs TypeScript 78.1%.** Excluding
   blank lines markdown *beats* TypeScript; blank lines are the entire deficit.
4. **The "entropy floor" explanation for base64 token cost** → **refuted.** The number (0.90 tok/byte)
   is right; the mechanism was wrong.
5. **"Redefining a symbol is safe if declared"** → **refined within an hour of being written.**
   Redefining a **denotation** is safe (140/140). Redefining a **procedure** is not: GPT-4 goes
   **98.2% base-10 → 38.6% base-9 *with the rule stated in the prompt***.

`[primary — docs/engine/README.md §II.5]`

**Four more, from the 2026-08-01 runs:**

6. **"Content-derived re-anchoring is used by no system above, and is therefore the one with no
   precedent to lean on"** → **FALSE. There is 25 years of prior art.** `[primary]`
   - **Brush & Bargeron, "Robustly Anchoring Annotations Using Keywords", MSR-TR-2001-107** — title
     verified live at microsoft.com/en-us/research. Its anchor is **anchor text + start/end context +
     lowest-document-frequency keywords**. That is our design. Its user study concluded low-confidence
     matches should be orphaned with a best guess — **that is our AMBIGUOUS/DELTA rule.**
   - **US7747943B2** (Bargeron/Brush/Gupta, Microsoft, filed 2001, granted 2010, expired 2024-03-26).
   - **W3C Web Annotation Data Model** — a Recommendation, with `TextQuoteSelector`.
   - **Hypothes.is** in production with published failure data: **about 22% of 20,953 annotations can no
     longer attach** `[secondary — arXiv 1512.06195, NOT read directly; verify before citing]`.
   - Grep of both plan documents at the time: `Brush` 0 · `Bargeron` 0 · `Web Annotation` 0 ·
     `TextQuote` 0 · `Hypothes` 0 · `diff-match-patch` 0 · `robust anchor` 0 `[measured]`.
   - **And the process failure is worse than the error:** the 2026-07-29 research run **physically
     downloaded** `w3c-anno.html` — 284,185 bytes, `<title>Web Annotation Data Model</title>` — into
     `/tmp/claude-501`, and none of it reached the plan. **Retrieval-to-synthesis loss, not a search
     failure. The source was in hand.**
   - **Converted into an asset:** implement `TextQuoteSelector` and Keyword Anchoring as two more
     baselines in benchmark B1. Beating a W3C Recommendation and a Microsoft patent on a published
     corpus is a stronger claim than "nobody tried this," and it is the only version that survives
     review.
7. **§16.2's Logseq "causal proof"** → **over-generalised; retracted.** The plan claimed *"every cluster
   corresponding to a native format feature is 10–35× smaller"* — **and never reported the
   denominator.** Recomputed live 2026-08-01: Obsidian 6,222 plugins, Logseq 607 packages → **baseline
   ratio 10.25×**:

   | cluster | raw ratio | ÷ baseline | verdict |
   |---|---|---|---|
   | spaced repetition | 35.00× | **3.41×** | REAL (Logseq native) |
   | query/database | 2.30× | **0.22×** | **INVERTS** (Logseq native) |
   | task management | 4.97× | **0.48×** | **INVERTS** (Logseq native) |
   | kanban *(control)* | 10.50× | 1.02× | no effect |
   | tables *(control)* | 10.67× | 1.04× | no effect |

   **Only 1 of 3 native-feature clusters shows an effect; two go the wrong way.** The two controls land
   at 1.02× and 1.04×, so the method is sound and the conclusion was over-generalised from the single
   case that worked. §16.2 was the only **causal** leg under a **correlational** 40.1%.
   `[measured — HANDOFF-mdmax §6.1]`
8. **"He already hand-builds bundles across 37.2% of files" (the container's entire empirical case)** →
   **REFUTED, and it is the single worst failure in the record because a pre-registered falsifier
   fired and was recorded as passing.** Re-measured over `corpus_id sha256:3a010b16…`: `md/Skills/**`
   alone is **369 files (34.04%) and 11,115,842 B (43.51%)** — **92.3% of the claimed share is one
   machine-generated sync tree**. **340 of 340 files carrying `source: claude` sit inside
   `md/Skills/**`**; 368 carry `last_synced: 2026-05-26`. Honest figure ≈ **2.2%**. The area's own
   falsifier fired and the area recorded *"FAILED TO REFUTE, and in the founder's favour."*
   `[measured — kill auditor's independent re-derivation, final gate]`
9. **"The demand evidence favours real-time collaboration over commenting 6.9:1"** → **REVERSED. It is
   1.78:1 the other way.** The 6.9:1 was a regex artifact from asymmetric counting; symmetric counting
   over the founders' own scraped demand corpus gives **review-loop 169 leaves to collaboration 95**.
   The final gate's own verdict lens: *"That single correction is the difference between 'build Yjs'
   and 'build comments'."* `[primary — final gate premortem-integrator lens]`

**A tenth, which is a design reversal rather than a factual one, and which matters for anything already
built on it:** the container's **carrier** flipped. `PLAN.md` §5 and `README.md` II.2 record the HTML
comment as the delimiter, chosen by a specific measurement (*"with no blank line before it, an HTML
comment interrupts a paragraph and the boundary survives; a link reference definition is swallowed and
the boundary is silently lost"*), at **+0.99% overhead, 6/6 files recovered byte-identical**. Two later
measurements broke it:

- **It silently loses a boundary whenever a contained file ends inside an open fence** — 4 of 1,084
  pinned files (**0.369%**), which under an i.i.d. survival curve means **98.2% of vault-scale packs
  fail**. `[measured — final gate container-thesis; the kill auditor reproduced the exact four files,
  all in `md/Brain/20-projects/`]`
- **GitHub deletes HTML comments in both rendering modes**, and the degradation-certificate area
  measured the HTML comment carrier **visible in 2 of 12 outputs and payload-destroyed in 10**.
  `[measured — capability run degradation-certificate]`

**The replacement, decided:** a backtick fence with run `N = max(4, max line-initial backtick run over
every contained byte + 1)`, declared in the manifest and **re-derived and cross-checked on read**. Prior
art is repomix's `calculateMarkdownDelimiter`; adopt it and credit it. Note the algorithms differ on
this exact corpus: repomix matches backtick runs **anywhere** (max any-position run = 4 → emits 5) while
the line-initial rule emits 4 `[measured — kill auditor's own histogram]`.

**Five designs in the capability run were built on the HTML-comment carrier after it had already been
measured broken.** That is failure #6 in §2.6 and the reason for process rule P3.

---

### 2.6 The method failures

These are stated plainly because the alternative — quietly fixing them — is how the programme got a
100% headline defect rate in the first place. Each is followed by the rule adopted in response.

**1. A 100% headline defect rate, one-directional.** All **18 of 18** area headlines in the 39-agent
capability run were materially refuted by their own adversarial verifiers, **always in the flattering
direction**: 0.155%→0.0204%, 51,620→17,065, 12/12→11/12, 30×→3.44×, 8,603:1→1,067:1, *"zero
implementations"*→two shipping packages found in one query, *"the surface does not exist"*→15.1× larger
once the excluded construct is counted. `[primary — capability run synthesis[2].thesis]`
**A 100% one-directional defect rate is a reward function, not noise.**
→ *Rule: read `per_area[].verification`, never `per_area[].headline`. The verified residue is the asset.*

**2. Seven irreproducible corpus counts.** Before the corpus was pinned, the 18 areas variously reported
the same vault as **4,312 · 4,317 · 4,710 · 4,823 · 5,981 · 5,986 · 2,586** files, and the critic
measured **5,563 / 3,245 / 1,989 / 756 / 4,131** depending on exclusion policy — *"and not one of those
seven numbers is reproducible under any policy I could construct, on a corpus that
provenance-boundary measured drifting mid-session. Every rate in this program divides an unstated
numerator by an unreproducible denominator."* `[primary — capability run critic lens, verbatim]`
→ *Rule P1: every figure names a `corpus_id`. The manifest was written and committed the same day.*
**Any figure in the older documents that does not cite `sha256:3a010b16…` is suspect; say so rather
than repeating it.**

**3. Five designs built on a carrier two measurements had already broken.** Documented in §2.5's tenth
item. The parallel fan-out had no reconciliation gate, so five areas each independently specified an
HTML-comment region primitive while two other areas were measuring it destroyed.
`[primary — docs/mdmax/PLAN.md §9 item 6]`
→ *Rule P3: parallel work only over disjoint artifacts, through one reconciliation gate.*

**4. Zero live model calls.** After 18 areas explicitly serving the goals *"easier for AI to consume"*
and *"trivially understandable to any AI"*, **not one live model call was made against any
representation by any area.** `[primary — capability run critic lens]`
**Every "easier for AI" claim in this entire corpus — roughly 1.09 MB of documentation — is a
pre-registered prediction, not a result.**
→ *Rule P9: a replayed number says `SIMULATED` in the same sentence.*

**5. The flagship number has been re-derived by nobody.** The **99.627% correct / 0.050% false /
0.323% refusal** anchoring result over 41,642 block-versions from 294 revision pairs is the strongest
claim in the programme and **every area that quoted it quoted it; none re-ran it.**
`[primary — docs/mdmax/PLAN.md §3.3]` An adversarial baseline built during the final gate — a **30-line
LCS diff** over the same normalised block text — lands at **86.658% resolved with 77.297 percentage
points provably unambiguous**, and *additionally eliminates the entire ambiguous-duplicate class
(9.727% of block-versions) that the plan's S2 soft-context scorer exists to handle*; one similarity
gap-fill pass takes it to **90.17%**. `[measured — final gate, `$TMPDIR/mdxopp/diffarm.mjs`, output
quoted exactly: `{"lcs_matched":25319,"pct_matched":86.658,
"lcs_matched_on_UNIQUE_text_cannot_be_wrong":22584,"pct_of_total":77.297}`]`
**Always caveat the 99.627% figure. Do not publish it before it is independently re-derived, and
publish the LCS baseline next to it when you do.**

**6. `package.json` was destroyed to 17 bytes by a research subagent.** A subagent ran `npm install`
from the repository root instead of `$TMPDIR`, against an explicit "no writes outside `$TMPDIR`" guard.
The working-tree file was reduced to `{"type":"module"}` — **17 bytes against the committed 3,076 bytes
with 47 dependencies and 18 scripts**. `npm run verify` could not run. **The repository was unbuildable
for an unknown period, on a branch with no upstream, with the entire plan untracked.** Restored
2026-08-01 under an explicit RULE-2 confirmation. `[measured — the restore was performed and the byte
counts stated in the transcript; primary — docs/mdmax/PLAN.md §9 item 10]`
This is the same class as `arx.xml` (14 bytes, contents: `Rate exceeded.`, an arXiv throttle response)
and `cx.html` (134,860 bytes) being written into the repository root by agents in Round 1.
**Prompt-level write guards are advisory, not enforced.**

**7. The entire programme lived untracked on one laptop until 2026-08-01.** `docs/mdmax/`,
`docs/engine/research/`, all three handoffs, and the corpus manifest were `??` in `git status` on a
branch **16 commits ahead of an unpushed `origin/main` at `8eb4de2`**. The final gate's own words:
*"the entire plan and the pinned corpus manifest exist on one laptop only … the only item whose failure
mode is total and irreversible."* Fixed by `1bd4dad` and the first push, **19 days after `b9ddcfe`**.
`[measured — git log, git branch -a -v]`
→ *Rule P11: push before you think.*

**8. Verifier false-kill rates of 0–19%.** §2.1's kill-audit table. A kill is strong evidence, not
proof; one auditor left 8 of 29 unaudited rather than guess.
→ *Rule P4: verifier kills get sampled and re-audited before anything is removed.*

**9. Two agents returned status notes instead of findings.** `a3822aff54512c4cb` in Round 1 (**129,126
tokens wasted**) and the 25-agent workflow's synthesis agent in Round 3 (*"Reconciliation clean. No
mutations or commits by this subagent. Deliverable delivered."*). **Both were free-text returns.
Schema-forced agents did not exhibit this.**
→ *Rule: schema-force every agent whose output is load-bearing.*

**10. Two tooling guards report false failures.** `workflow-lint.sh` inverts on files larger than the
pipe buffer (`grep -q` plus `pipefail` → SIGPIPE 141), and the session loop-guard reported denials for
calls that had succeeded. `[primary — docs/mdmax/PLAN.md §9 item 9; the loop-guard misfire recurred
while this section was being written]` **A harness that reports false failures trains you to ignore it,
which is the same disease as one that reports false passes.**

**11. Two session guards blocked legitimate work.** The prompt-injection taint gate fired twice
(20:45:43Z and 20:47:06Z on 2026-07-30) and blocked `WebFetch` **for all subagents for the rest of the
session** — it is session-scoped, so its own advertised remedy ("use a read-only subagent") does not
work. Likely trigger: one research topic *was* prompt injection, so the fetched pages legitimately
contained *"IGNORE ALL PREVIOUS INSTRUCTIONS."* Separately, the bash guard blocked a `git commit`
because the commit **message** contained the word "drop" (matching its `DROP TABLE` rule) — it scans
heredoc prose as if it were a command. `[primary — HANDOFF-mdmax §10]`

**12. The document became the product.** `PLAN.md` reached v0.6.0 with a changelog and a supersession
chain; three of the four most recent commits before the consolidation were **cosmetic PDF fixes**.
`[measured — git log]` The programme's own diagnosis: *"Honesty was being converted into inertia."*
And the sentence one research area wrote about itself, which is true of more of this programme than one
area: *"this entire area was a code review wearing a research costume and should be re-run as one."*
`[primary — docs/mdmax/PLAN.md §9]`

---

### 2.7 What this section does not cover, and what would falsify it

**Not covered:**

- **The content of the research**, beyond what is needed to explain a decision. Sections 3 onward carry
  the capability specification, the engine design, and the build sequence. This section carries only the
  provenance.
- **The AIOS track.** It is a separate programme (D5). The final gate's `aios-transfer` area is
  **OVERSTATED** and nothing from it is load-bearing here.
- **The graph-engineering session's own transcript**, which was launched from a different working
  directory and is not in `~/.claude/projects/-Users-sagnikmitra-Desktop-GitHub-frontmatter/`. Only its
  written handoff is available. Anything attributed to it is `[secondary]` at best.
- **Token counts for R1e, R2a, R2b and R2c.** No artifact records them. They are inside the "~26 agents"
  bucket and cannot be separated.
- **The three Round-1 literature agents that were still in flight when its handoff was written**
  (`a7c9d985624ab0386` end-user programming, `a6934717fa9769bee` LLM document representation 2025-26,
  `afaf2a3a55a66d46b` type theory / gradual typing / CUE lattices). **Their findings were never
  collected and are not in any document.** The first could still change a recommendation: if
  Blackwell's attention-investment model says what §3.14 of that handoff predicts, the type layer must
  be **inferred and proposed, never declared** — which is where the `custom-pointers` area independently
  landed on 2026-08-01 anyway.
- **The ~50 screenshots** the founder supplied on 2026-07-31. They were read into one session's context
  and are not preserved as files. Any claim sourced only to them is unrecoverable.

**What would falsify this section:**

1. **A commit, transcript, or artifact dated before 2026-07-13T16:33:44+05:30.** The timeline claims
   nothing existed before `b9ddcfe`. One artifact would refute it.
2. **A token figure in a completion notification that differs from the table in §2.2.** Every number
   there is quoted from one; if a journal file disagrees with the notification, the journal governs and
   this section is wrong.
3. **An independent re-derivation of the 99.627% anchoring result.** If someone re-runs it and gets a
   materially different number, §2.6 item 5 becomes the most important paragraph in this plan rather
   than a caveat.
4. **Evidence that any of the four dead names is actually available in the slot as well as the word** —
   for instance, if the four `.mdz` projects are dead and the extension is genuinely free. That would
   not resurrect MDZ (MDMAX is settled) but it would mean the kill reasoning was weaker than stated.
5. **A live model call showing markdown *is* easier for a model to consume than the alternatives.**
   §2.6 item 4 says every such claim is a prediction. One measurement converts it into a result — or
   kills it.
6. **A user.** Every demand claim in this record is inferred from download counts, forum threads,
   plugin ecosystems and issue trackers. **Zero people outside the two founders have used this product.**
   The `product-gap` area found exactly one hardcoded login. The first real second user will falsify or
   confirm more of this record in a week than 29.9 million tokens did in nineteen days.


---

---

### Links

**This section references:** [§1 Orientation](01-orientation.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§5 Rendering](05-rendering.md) · [§6 Conventions](06-conventions.md) · [§7 Product](07-product.md) · [§8 Market](08-market.md) · [§9 AIOS](09-aios.md) · [§10 Engine spec](10-engine-spec.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

**Referenced by:** [§1 Orientation](01-orientation.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§7 Product](07-product.md) · [§9 AIOS](09-aios.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
