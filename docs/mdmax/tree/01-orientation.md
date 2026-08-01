---
mdmax: 1
section: 1
title: "Orientation — what we are building, why now, what is settled, and how to read this"
slug: 01-orientation
lines: 760
words: 7231
forward_links: [2, 3, 4, 5, 7, 9, 10, 14]
backlinks: [2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14]
prev: null
next: 02-chronology
---

[← Index](README.md) · [§2 Chronology →](02-chronology.md)

## 1. Orientation — what we are building, why now, what is settled, and how to read this

This section is the front door. A reader who has never seen this project should be able to finish
it and know four things: what the product is, what fact makes it worth twelve months, which
questions are already closed, and where to go next. Everything asserted here is repeated in more
detail somewhere later in the plan; nothing here depends on anything later.

---

### 1.1 The thesis in one sentence

**frontmatter is Google Docs for markdown — comments anchored to text, suggestions, version
history and sharing, over files that stay ordinary `.md` — and MDMAX is the small library
underneath it that makes writing to those files safe.**

The founder's own words, verbatim, from the session record:

> *"we need a Google Doc for Markdown."*
> — `HANDOFF-mdmax-markdown-engine-2026-08-01.md` §14 `[primary]`

Restated in this planning round as *"Google Docs for markdown, as simple as that."* That
restatement was spoken in the round that produced this document and is not on disk in a file; the
on-disk verbatim is the line above. `[primary for §14; the restatement is attributed to this round]`

---

### 1.2 The thesis in one paragraph

Markdown's dominant reader stopped being a human and became a model, while the format itself
stopped shipping. CommonMark's last three releases all landed on the same day, 2024-01-28, and
there has been none since; GitHub's own renderer, `cmark-gfm`, last released on 2023-07-21 and is
still pinned to CommonMark 0.29, whose specification is dated 2019-04-06. Against that frozen
substrate, markdown is now the single most-read file type inside an agent's tool loop — 23.51% of
file reads, ahead of `.tsx` and `.ts` — 94.1–94.3% of the markdown created in our own pinned
corpus in June 2026 was created inside an agent session, and `AGENTS.md` went from nonexistent to
30.67% of the 300 most-starred repositories on GitHub in about fifteen months. That asymmetry — a
frozen format with a multiplied and different consumer — is the opportunity, and it is the only
part of the "new era" story that survived adversarial verification. What it is **not** is a volume
story: the claim that markdown's share of repository trees is growing, and the claim that it is
shrinking, are both unproven, and neither belongs in the pitch. So MDMAX is not a compiler
programme. It is a small library, subordinate to the editor, and the product it serves is the
review loop over files people own — an intersection that no shipping product currently occupies.
None of it is reachable until a second person can log in, because the application today admits
exactly one user, hardcoded. Research is closed. The plan below is a build order.

---

### 1.3 The three things, and how they relate

Three names appear throughout this document. They are different things with different owners,
different lifespans and different success conditions. Confusing them is the most common failure of
every previous draft.

| | **frontmatter** | **MDMAX** | **AIOS** |
|---|---|---|---|
| **What it is** | A browser-first markdown editor with a Google-Docs-style review loop over files the user owns | A capability library that makes safe, byte-exact writes and stable references into ordinary `.md` files | A personal agent-orchestration toolchain (skills, gates, traces, evaluation loops) |
| **Status** | Shipping, single-tenant, one hardcoded user | Zero lines written | Running, 119 `SKILL.md` files on disk `[measured]` |
| **Who it is for** | Paying users | frontmatter, and nobody else | Sagnik's own working environment |
| **Where it lives** | `src/` in this repository | `src/modules/` in this repository, subordinate to the editor | `~/.claude/` and `~/.sgnk/`, outside this repository |
| **Public surface** | The web app, share links, publish | One command, `mdmax cert`, and nothing more | None |
| **Business model** | Free / Pro / Work / Teams tiers | **None.** It is a library, not a product | None |
| **Success condition** | A second person logs in and writes to a document | The editor stops corrupting files | Out of scope for this plan |
| **Kill condition** | See the kill-gates section | If the editor stops needing it, delete it | Out of scope for this plan |

**How they relate, stated as rules:**

1. **frontmatter depends on MDMAX. MDMAX does not depend on frontmatter's roadmap.** MDMAX exists
   because two shipped write paths in frontmatter destroy user data today. If those paths were
   safe, MDMAX would be optional.
2. **MDMAX is subordinate, not parallel.** It has no separate release cadence, no separate
   versioning story, no separate repository and no separate business model. Decision D10.4 in the
   open-decisions section settles this: *"Does MDMAX have a business model? No."*
3. **AIOS is a separate track (decision D5).** It is *not* part of this plan's scope, budget or
   sequence. It benefits from MDMAX in exactly one direction — agent-written markdown is the
   input distribution MDMAX is designed for — and it contributes one thing back: the discipline
   that a check must be proven to fail before it is trusted.

**What AIOS actually transfers, stated honestly.** The research area `aios-transfer` claimed a
broad transfer and its headline verdict was **OVERSTATED**. What survived verification is one
mechanism and one number:

- `sgnk-regression-gate.sh` refuses to register a check until that check has been proven to go red
  against a reintroduced defect. Four distinct refusal exit codes confirmed in source at lines
  45, 53, 58 and 73; selftest 10 of 10; 21 gates live. `[measured, upheld by the kill audit]`
- What was **killed**: *"the AIOS verify ladder transfers to the MDMAX build with zero
  modification."* On this repository the ladder inspects 2 `.sh` files, 2 `.py` files (one inside
  `node_modules`) and some `node_modules` JavaScript — and **0 of 901 first-party `.ts`/`.tsx`
  files**. `tsc --noEmit` appears only in a comment. It does not transfer as a useful verifier.
  `[measured, killed by the verifier]` — note that the 901 figure counts the whole working tree
  including `test/` and two abandoned git worktrees; `src/` alone holds **212** `.ts`/`.tsx` files
  `[measured, this session]`. The two numbers count different sets and do not conflict, and neither
  carries a committed derivation script.

So the AIOS contribution to this plan is a working practice, not a toolchain. It appears in the
working-practices section as the rule *make the gate go red first*, and nowhere else.

---

### 1.4 The opportunity — one fact, with both halves measured

> **Markdown's dominant reader stopped being a human and became a model, while the format froze.**

This is the entire commercial argument. It is one sentence with two halves, and both halves are
measured. Everything else in the "new era" story was either overstated or refuted, and is excluded
below.

The research area that produced this is keyed `the-era` in
`docs/engine/research/wf-final-gate-2026-08-01.result.json`. **Its headline verdict is
`OVERSTATED`.** That is not a reason to discard it — it is a reason to quote only the legs the
verifier confirmed. Those legs follow.

#### 1.4a The frozen half

```
COMMONMARK — the specification
  0.29     dated 2019-04-06     649 conformance examples
  0.30     dated 2021-06-19     652 conformance examples
  0.31.0   dated 2024-01-28     652 conformance examples
  0.31.2   dated 2024-01-28     652 conformance examples
  → ZERO net new released conformance examples in five years.
  → The last three releases (0.31.0, 0.31.1, 0.31.2) ALL landed on 2024-01-28. None since.
  → master HEAD today still declares version 0.31.2 / date 2024-01-28 but carries 655 examples:
    +3 sitting unreleased for 2.5 years.

CMARK-GFM — GitHub's own renderer
  latest release   0.29.0.gfm.13,  published 2023-07-21T15:22:23Z
  preceding        0.29.0.gfm.12   2023-07-13
                   0.29.0.gfm.11   2023-04-06
  The tag pins CommonMark 0.29, whose spec.txt is dated 2019-04-06.
  Repository is NOT archived (archived: false), open_issues_count 135.
  Recent commits are build-system housekeeping ("Update cmake minimum requirement", 2025-12-19).
  → GitHub renders the world's markdown against a specification from 2019.

SPEC-REPOSITORY ACTIVITY  (commits per year, commonmark/commonmark-spec)
  2019  48
  2020  15
  2021  14
  2022  15
  2023  13     (a second, independent count says 12 — see the contradiction note below)
  2024  11     (a second, independent count says 12 — see the contradiction note below)
  2025   7
  2026   6     (seven months, partial)
```

`[primary]` — the example counts were produced by pulling `spec.txt` at tags 0.29 / 0.30 / 0.31.0 /
0.31.2 from `raw.githubusercontent.com` and counting 32-backtick example fences; the release dates
came from `api.github.com/repos/github/cmark-gfm/releases`. The verifier reproduced all of it
independently and recorded verdict **CONFIRMED**, calling it *"the single most decisive fact in the
area."*

**Two honesty notes on this block, both of which must travel with it.**

1. **Do not say "declining every single year."** That adjective is false against the researcher's
   own table: 2021 = 14 rises to 2022 = 15. The verifier flagged it; the kill audit independently
   reproduced the counter-example to the unit and found a second break (2023 → 2024 flat) plus a
   third under a narrower definition counting only commits touching `spec.txt` (2021 = 9 → 2022 =
   10). Say **"declining, with two breaks"** or say **"a third of its 2019 rate."** The conclusion
   is untouched; the word "every" is wrong. `[measured, killed]`
2. **The 2023 and 2024 counts disagree between two sources.** The research area reports
   `48/15/14/15/13/11/7/6`; kill-audit agent 0, re-running the same census on
   `api.github.com`, reports `48/15/14/15/12/12/7/6`. **Both agree on 2019, 2020, 2021, 2022, 2025
   and 2026, and both refute the monotonic-decline adjective.** They differ only on how 2023 and
   2024 split. Neither has a committed derivation script. **Governing rule: quote the years both
   sources agree on (48 in 2019 falling to 7 in 2025) and do not quote 2023 or 2024 individually
   until a script is committed.** `[contradiction, unresolved]`

One further frozen-side finding, included because it is the sharpest single illustration and
excluded from the pitch because it was not independently re-verified: `remark-parse`, the most-used
markdown parser in the JavaScript ecosystem, last released version 11.0.0 on 2023-09-18 and has
shipped nothing in 2024, 2025 or 2026, while its downloads went from 36,005,792 (2024-08) to
161,511,318 (2026-06), a factor of 4.49. `markdown-it` shipped zero releases in all of 2025 and had
a 31-month gap between 14.0.0 (2023-12) and 15.0.0 (2026-07-30).
`[measured, area-level own-measurement, NOT independently re-verified — use with the caveat]`

#### 1.4b The changed-reader half

Four claims. All four were re-derived independently by the area's verifier and recorded
**CONFIRMED**.

**(1) Markdown is the #1 file type an agent reads.**

```
Read tool calls carrying a path, across 13,968 .jsonl transcripts under ~/.claude/projects:
  total 36,846
  .md    8,663  = 23.51%   rank 1
  .png          = 20.82%
  .tsx          = 16.51%
  .ts           = 11.10%
  .py           =  6.01%

Write / Edit / MultiEdit calls: total 19,416
  .tsx          = 25.44%   rank 1
  .md    4,791  = 24.68%   rank 2
```

`[measured]` — the verifier's own independent scan, which it recorded as matching the researcher's
figures *"to the decimal."* Note this is explicitly **not** the pinned corpus; it is one
workspace's complete Claude Code transcript set, a different and separately-stated selection.

**(2) Essentially all new markdown in the pinned corpus is created inside an agent session.**

```
SELECTION: the 991 of 1,084 corpus files that are git-tracked at each root's pinned head
           (md 691/756, knowledge 249/272, frontmatter 51/56)
CRITERION: the creating commit (git log --diff-filter=A --root --no-renames) carries an AI marker

  overall     578/991 = 58.3%   (verifier re-derives 577/991 = 58.2%)
  2026-05      69/450 = 15.3%   (the human legacy vault import)
  2026-06     448/475 = 94.3%   (verifier re-derives 448/476 = 94.1%)
  2026-07      61/66  = 92.4%   (verifier re-derives 61/67  = 91.0%)
```

`[measured, corpus_id sha256:3a010b16…]` — the verifier reproduced this *"to within one file out of
991"* and confirmed the manifest's `corpus_id` matches. **The 94.1–94.3% range is not a rounding
choice; it is the spread between the researcher's denominator (475) and the verifier's (476).**
Quote the range, never a single point.

**The negative that must travel with this number:** *"AI-marked"* means the creating commit mentions
Claude, not that a model wrote the prose. A human typing every word inside an agent session gets the
same marker. The honest reading is **"created inside an agent session,"** which is an upper bound on
machine authorship in the strict sense and a lower bound in the loose sense (agent-written files
committed by hand are missed).

**(3) `AGENTS.md` went from nothing to roughly a third of the most-starred repositories in fifteen
months.**

```
CENSUS 2026-08-01: GitHub search stars:>30000 sorted by stars, 300 repos,
root tree via api.github.com/repos/{r}/git/trees/HEAD. All 300 fetched, zero errors.

  AGENTS.md        92/300 = 30.67%
  CLAUDE.md        76/300 = 25.33%
  .claude/         45/300 = 15.00%
  README.md       278/300 = 92.67%

Apples-to-apples on the top 215 by star rank:  AGENTS.md 69/215 = 32.09%
Earliest AGENTS.md creation month in the sample: 2025-05  → about 15 months.
```

`[measured]` — this is the **verifier's** census, not the researcher's. The researcher reported
26.51% on a 215-repo sample with an unexplained 85-repo loss; the verifier fetched all 300 cleanly
and got a **higher** number. The researcher's figure was conservative, and its sample loss remains
unexplained.

**(4) Convention births mostly die — the same measuring stick, applied to the alternatives.**

```
Same full-300 census, 2026-08-01:
  llms.txt          1/300 = 0.33%
  .cursorrules      2/300 = 0.67%
  GEMINI.md         7/300 = 2.33%
  AGENT.md          0/300 = 0.00%
  .windsurfrules    0/300 = 0.00%
  CONTRIBUTING.md 168/300 = 56.00%   (a fifteen-year-old convention, for contrast)
```

`[measured]` — CONFIRMED on a larger sample than the researcher used. This is the honest frame for
claim (3): `AGENTS.md` at 30.67% is currently the exception among agent conventions, not the rule.

**(5) A supporting leg, structural rather than volumetric.** Generic markdown parsers grew only
**1.44×** faster than the npm registry baseline over 2024-08 → 2026-06: eight-parser median
**4.0495**, fourteen-package non-markdown control median **2.8145**, excess **1.4388**. `[measured]`
The verifier re-fetched all 22 packages and every raw figure *"reproduces to the digit,"* and noted
the contamination runs in the conservative direction — `marked`, `unified` and `remark-parse` are
all direct `streamdown` dependencies, so the true generic-parser excess is lower still.

The clean illustration the verifier recommended leading with, because neither package is a
`streamdown` dependency and both do the same job in the same ecosystem:

```
react-markdown    11,786,121  →  103,114,261   ×8.75
markdown-to-jsx   22,908,372  →   18,185,739   ×0.79   ← an absolute DECLINE
```

`[measured]`

#### 1.4c What must leave the pitch — three claims, excluded

These are not soft caveats. They are exclusions. Do not put any of them in a deck, a landing page,
a README, or a sentence spoken to an investor.

**EXCLUDED 1 — markdown's share of repository file trees, in BOTH directions.**

The area's headline leg said markdown's share of repository trees **fell** 12.68% → 10.41%
(2024-08 → 2026-06, 12 repos). The verifier recorded **REFUTED** on two independent grounds:
unreproducible as published (the 12 repos are never named, no `corpus_id` is cited), and
directionally reversed on a fully specified test.

```
VERIFIER, 12 named major OSS repos (2 skipped as truncated), commit nearest 2024-08-01
vs nearest 2026-06-30:
  pooled md share    2.39% (4,460/186,903)  →  2.74% (6,556/239,656)   ROSE
  md files ×1.47  against total files ×1.28
  median per-repo share  1.15% → 1.90%;  share fell in only 3 of 10

KILL AUDIT, a THIRD and different named sample — 8 repos (microsoft/vscode, golang/go,
nodejs/node, pytorch/pytorch, django/django, rails/rails, vercel/next.js, pandas-dev/pandas),
last commit before 2022-08-01 vs HEAD:
  pooled md share    1.142% (908/79,491)  →  1.460% (1,739/119,082)    ROSE
  md files ×1.92 against total files ×1.50;  share fell in only 1 of 8
```

`[measured, twice, on two disjoint named samples]`

Both the verifier and the auditor also observed that the original **12.68% baseline is roughly five
times higher than any real code repository either could find** (the auditor's range across 8 major
repos: 0.13%–2.59%). Whatever those twelve repositories were, they were not representative code
repositories.

**Governing statement: the direction is unproven in both directions, and the claim is excluded.**
Two named, specified samples say it rose; one unnamed, unspecified sample says it fell. That is not
enough to say either. It is *more* than enough to say neither. The pitch is that markdown's
**reader** changed, and that is measured five independent ways above.

**EXCLUDED 2 — "a new streaming-markdown tooling category."** There is no category. There is one
vendor.

```
streamdown              github.com/vercel/streamdown   packages/streamdown
remend                  github.com/vercel/streamdown   packages/remend
rehype-harden           github.com/vercel-labs/markdown-sanitizers
harden-react-markdown   github.com/vercel/harden-react-markdown

streamdown@2.5.0 dependencies contain an EXACT pin:  "remend": "1.3.0"
                                             and:    "rehype-harden": "^1.1.8"

Monthly series showing the dependencies tracking the parent within ~10%:
  2026-04   streamdown 10,809,649 · remend 9,723,249 · rehype-harden 10,315,499
  2026-02   streamdown  3,791,087 · remend 2,920,598 · rehype-harden  3,461,931
```

`[primary]` — verdict **REFUTED**, and upheld by the kill audit on the mechanism.

Adding a package to its own pinned dependency from the same monorepo counts one install base up to
four times. **The design section built on "~30.7M downloads/month across streamdown+remend" is void.**

**And the replacement number is itself contested — do not quote any downloads figure for this
stack.** Three different substitutes exist in the record:

| source | replacement figure | basis |
|---|---|---|
| the verifier | "~16M downloads/month for one dependency closure" | 2026-06 point downloads |
| the kill audit | "~23.2M/month" — and calls ~16M wrong, being *below `streamdown`'s own standalone count* | `api.npmjs.org` 2026-07-01..2026-07-30: streamdown 18,538,484, remend 23,223,550 |
| `PLAN.md` v2.0.0 §2 | "roughly 8% of `marked` alone" | weekly figures: streamdown 4,691,299/wk, remend 6,173,301/wk, marked 61,032,058/wk |

**Governing rule: quote the structure, never the number.** The defensible sentence is *"Vercel
shipped a model-output markdown stack whose packages are pinned dependencies of one another"* — and
nothing about its size, because three sources in our own record give three different sizes on three
different windows and none carries a committed derivation script. `[contradiction, unresolved]`

**EXCLUDED 3 — "nobody has served incremental markdown parsing below the presentation layer."**
Verdict **REFUTED**, upheld by the kill audit with all three artifacts confirmed real and correctly
dated.

- `@lezer/markdown` — npm package created 2021-08-11, description verbatim *"Incremental Markdown
  parser that consumes and emits Lezer trees."* It is what CodeMirror 6 runs on — and CodeMirror 6
  is already in this repository's dependency tree.
- `tree-sitter-markdown` — `ikatyang/tree-sitter-markdown` created 2019-09-30; tree-sitter is
  incremental by construction.
- `micromark` — the CommonMark reference implementation underneath remark/unified — ships a
  documented duplex streaming API, `import {stream} from 'micromark/stream'`.

`[primary]` And `micromark`'s own README states the fundamental limit verbatim, which belongs in any
design that touches this area: *"Some of the work to parse markdown can be done streaming, but in
the end buffering is required."*

#### 1.4d What would falsify §1.4

Pre-registered, so it can be checked rather than argued.

| # | falsifier | threshold | what to do if it fires |
|---|---|---|---|
| F-ERA-1 | The model-facing npm stack falls back toward the baseline | Excess growth ratio drops below **1.5×**. It is **3.1×** today (react-markdown ×8.75 ÷ control median ×2.81) | Stop saying "new era" out loud. The 2025–2026 spike was AI-application churn, not a durable consumer shift |
| F-ERA-2 | The frozen half thaws | A CommonMark release with new conformance examples, **or** a `cmark-gfm` release that moves off CommonMark 0.29 | The asymmetry closes. Re-argue the opportunity from scratch |
| F-ERA-3 | The reader claim fails to replicate off one workspace | A second, independently-owned transcript corpus puts markdown outside the top 3 read file types | The 23.51% is an artifact of this workspace. Drop it and rest the case on the `AGENTS.md` census, which is already external |

**The single largest weakness in §1.4, stated plainly:** the two strongest reader-side numbers
(23.51% of reads; the machine-write-to-machine-read share) come from **one person's transcripts over
a three-month window**, in a workspace whose owner spent June and July 2026 building a markdown
compiler. The area's own third-strongest negative says exactly this. A confound control that drops
every markdown-research project directory (11,475 of 13,947 transcripts kept) preserves the trend —
6.06% → 17.04% → 24.71% of reads across 2026-05 → 2026-06 → 2026-07 — but cannot remove the fact
that this person's own work shifted toward documentation over exactly those months. **The
`AGENTS.md` census and the CommonMark/cmark-gfm freeze are the two legs that are external to us.
Lead with those.**

**One more number that was corrected downward and must be quoted in its corrected form.** The area
claimed *"nearly half (44.2%) of all markdown an agent reads is markdown an agent itself wrote."*
Verdict **OVERSTATED**. The arithmetic was flawless; the definition was not — the "written" set
unioned `Write` with `Edit`/`MultiEdit`, and the agent harness *requires* a `Read` before any
`Edit`, so it manufactures read-then-write pairs on files the agent never authored. Splitting them:
paths reaching a genuine `Write` (creation) account for **552 paths and 3,120 read calls = 36.0%**.
**Quote 36.0%, "just over a third." Never 44.2%.** `[measured, corrected]`

---

### 1.5 Decisions already made — D1 through D10

These are closed. They are listed here so that nobody spends a week re-opening one, and so that a
new reader can tell the difference between a decision and an opinion. Where a decision is under
review, that is stated in the row; **one is (D3)**.

The "settled" column gives the date the decision was recorded in a file in this repository. Several
were derived earlier, in the research waves of 2026-07-29 and 2026-07-30, and only written down on
2026-08-01; where that is true the row says so.

| # | Decision | Settled | Recorded in | Consequence — what it obliges or forbids |
|---|---|---|---|---|
| **D1** | **frontmatter is Google Docs for markdown.** | 2026-08-01 | `HANDOFF-mdmax-markdown-engine-2026-08-01.md` §14; `docs/FRONTMATTER-PRODUCT-PLAN.md` §1 names the same thing as "Wedge B — Google Docs for markdown you own" (dated 2026-07-12) | The thing we sell is the **review loop**, not the editor and not the compiler. Every feature is judged against "does a second person use this?" |
| **D2** | **Comments and version history live OUTSIDE the file.** Export or copy yields clean markdown, latest content only. Nothing about comments is ever written into the `.md`. | 2026-08-01 | This plan's sequence section, item "the review loop"; `docs/mdmax/PLAN.md` v2.0.0 §7 | Obliges a hard gate: **remove the sidecar store → `git status` clean, every file byte-identical.** Forbids any marker, anchor comment, HTML comment or invisible character written into user files |
| **D3** | **Reviewers must log in (Google or GitHub).** Mechanism deferred. **UNDER REVIEW as a tier split.** | 2026-08-01 | `docs/mdmax/PLAN.md` v2.0.0 §7 item 4 and §10.2 | The recommendation under review: anonymous **read-and-comment** on a share link; **login required to resolve or to edit**. Owner and editor seats bill; commenters do not. Until it is settled, build the share link so that both models remain reachable |
| **D4** | **The durable artifact is plain markdown.** If frontmatter dies we ship a full export and a migration. Max tier gets offline access. **NOT** "your git repo is the backend." | 2026-08-01 | `docs/mdmax/PLAN.md` v2.0.0 §3.1 and §4 | The export is a **ZIP of clean `.md` files**, because that is what a departing human actually wants. Forbids shipping a single-file container as the export format |
| **D5** | **AIOS is a separate track.** | 2026-08-01 | This plan, §1.3 above | AIOS work does not consume this plan's sequence, budget or attention. It contributes one working practice (make the gate go red first) and nothing else |
| **D6** | **The file stays ordinary `.md`. Degradation is the feature. No dialect needing its own parser.** | 2026-08-01 (derived in the 2026-07-29 wave) | `HANDOFF…§1` — *"The invariant that governs everything"* — and §5 item 2 | An unknown **fence language** round-trips byte-perfectly; an unknown **node type** throws. Therefore: additive, fence-carried capability is free; **capability whose payload is by reference is impossible** — `![[Some Note]]` renders as the literal string with the referenced content absent |
| **D7** | **Splice-only writing. Never regenerate from the AST.** | 2026-08-01 (derived 2026-07-29) | `HANDOFF…§1` and §5 item 1; theorem cited as Foster et al., *TOPLAS* 2007, Lemma 3.9 | Forbids `matter.stringify`, `doc.toString()` and any `parse → stringify` round trip on a user's file. Two shipped code paths violate this today; fixing them is an early item in the sequence |
| **D8** | **Extensibility lives in the VALUE of a field, never in the SET of node types.** | 2026-08-01 | `HANDOFF…§5` item 4 — extension goes through **dispatch** (fence info string, frontmatter vocabulary), never a new sigil | Forbids inventing a sigil. Character-namespace exhaustion is real: `::` is already contested between two top-50 Obsidian plugins. Obliges treating the YAML value slot as a hazard, not a free field |
| **D9** | **A document NAMES a capability, never CARRIES one.** | 2026-08-01 | `HANDOFF…§7.1` — every self-declaring document format that succeeded (JSON-LD `@context`, the shebang line, Racket's `#lang`) names a vocabulary and never carries the definition | No runtime inside the document. The moment the engine needs an interpreter it is MDX, which cannot write the document back out |
| **D10** | **The name is MDMAX.** | 2026-08-01, verified live | `HANDOFF…§9` | `npm`: `mdmax`, `md-max`, `markdown-max`, `mdx-max` — all free. PyPI: `mdmax`, `markdown-max` — free. GitHub: 13 repositories named `mdmax`, all zero-star noise. Only footnote: "MD" means molecular dynamics in chemistry |

**Three consequences of this table that are easy to miss.**

1. **D6 and D8 together bound the Max tier much more tightly than "features unseen in the
   industry" implies.** Any capability whose payload is *by reference* — transclusion, cross-file
   reactive state, sidecar-resolved block metadata — is void under D6, because the reference renders
   as literal text with the payload absent everywhere else. Know the shape of that roadmap before
   selling it.
2. **D7 is not an aspiration; it is a four-line function with two callers already broken in
   production.** The argument about whether a splice writer is worth building ends the moment you
   notice it has to be written anyway.
3. **D2 makes the hardest anchoring problem moot for comments.** If nothing is written into the
   file, no marker can be corrupted by another tool. That is why D2 is a decision and not a
   preference.

**And the founder's own design rule, which is D6 and D8 stated before either existed:**

> *"we can't invent a new markdown… but we can invent a new style of utilization"*
> — quoted in `docs/mdmax/PLAN.md` v2.0.0 §2 `[primary]`

The measurement proves the rule: an unknown fence language round-trips byte-perfectly; an unknown
node type throws. **Utilization is the only available move, and it was found by reasoning rather
than by measuring.**

---

### 1.6 Where the code actually stands, in one screen

A cold reader needs the starting line, not just the destination. All of the following was measured
in the working tree on 2026-08-01.

```
branch          engine/plan-and-diagnostics
HEAD            1bd4dad  docs(mdmax): consolidate the plan, pin the corpus, commit the research base
main            untouched by this programme

src/            212 .ts / .tsx files                                    [measured]
src/modules/    ai · ai-tools · app-shell · auth · drafts · editor ·
                export · graph · preview · repository · share · vault   [measured]
engine code     NONE. There is no core/ directory anywhere in the tree. [measured]
tests           83 test files under `test/`                                           [measured]
                3,484 tests collected (66.4% of them abandoned worktrees) at last full run                    [primary, HANDOFF §10,
                                                                         not re-run this session]
package.json    3,076 bytes, intact, name/version/engines present       [measured]
```

**The single fact that governs the whole sequence:** the application admits exactly one user, and
that user is hardcoded.

```
src/modules/auth/domain/allowlist.ts:9
    return login.trim().toLowerCase() === allowed.trim().toLowerCase();

src/container/dependency-container.ts:42
    const AUTHOR = { name: "Sagnik Mitra", email: "sagnikmitra123@gmail.com" } as const;
```

`[measured, read live from the working tree this session]` — an equality against a single login, and
a constant author identity fed into four use-cases. Nothing downstream of those two lines is a
Google Doc, and no compiler makes it one. This is developed fully in the section on the second user.

**One historical note, because two records disagree.** `docs/mdmax/PLAN.md` v2.0.0 §9 item 10
records that `package.json` was *"destroyed to 17 bytes by a research subagent"*;
`HANDOFF…§10` records a **different** `package.json` incident — an unwanted `+1 line:
"@anthropic-ai/tokenizer"` from a subagent that ran `npm install` from the repository root. These
are two separate incidents on the same file, not two accounts of one. **Both are now moot: the live
file is 3,076 bytes and intact as of `1bd4dad`.** `[measured]`

---

### 1.7 How to read this plan

**Section numbers follow the table of contents. Where this section points at another part of the
plan it names the subject rather than only the number, so a renumbering cannot silently break the
reference.**

| You are… | Read, in this order | Why | Roughly |
|---|---|---|---|
| **A co-founder, or anyone cold** | this orientation → the opportunity → the product and the market → the sequence → the kill gates | That is what is being built, why it is worth doing, in what order, and the test that decides whether this is a company | 20–30 minutes |
| **Building it** | everything above, plus the engine section, the week-one hazards, and the working practices | The engine section tells you what to write; the hazards section tells you what will bite you before you finish writing it | 90 minutes, then keep it open |
| **Challenging it** | this orientation's §1.4c and §1.8 → what we abandoned → what we got wrong → open decisions | §1.4c is what is excluded from the pitch and why. "What we abandoned" is what we stopped doing and what killed it. "What we got wrong" is the error log, kept on purpose | 45 minutes |
| **Deciding whether to fund it** | this orientation → the product and the market → the kill gates → what we got wrong | And nothing from §1.4c's excluded list, which exists precisely so that a hostile reader with an `npm` terminal finds nothing to catch | 30 minutes |
| **Picking up the work cold, months from now** | this orientation → the working practices → the sequence, and then read the research JSON directly using the recipes in §1.8 | The research artifacts outlive this prose. §1.8 tells you how to interrogate them without trusting a summary | as long as it takes |

**Where the supporting evidence lives.** This plan is the executive document. It sits on top of a
larger record, and every one of these is on disk in this repository:

| path | what it is |
|---|---|
| `docs/engine/PLAN.md` | 1,748 lines, v0.6.0. The technical design of record and every early measurement. Note: this plan supersedes it where they disagree |
| `docs/engine/README.md` | 789 lines. The readable master plan / front door for the engine track |
| `docs/FRONTMATTER-PRODUCT-PLAN.md` | Demand-side research, dated 2026-07-12. **92 sourced pain points, 89 feature requests, a 20-app competitor matrix**, every claim carrying a verbatim quote and a URL. Governs the editor track |
| `docs/FEATURE-GAP-REPORT.md` | Feature-by-feature benchmark against Obsidian, Notion, Typora, Logseq, iA Writer and VS Code, dated 2026-06-03, reflecting code actually present in `src/` |
| `docs/research/` | Six files: the pain taxonomy (14 ranked themes with quotes), the competitor gap map, the segment strategy, the pain playbook, and two raw-corpus JSON files |
| `docs/mdmap/` | Eight entries — the earlier concept tree (`01-thesis` … `07-open` plus `MAP.md`). Historical; superseded by this plan |
| `docs/engine/research/` | The machine-readable research record. Four workflow artifacts plus the pinned corpus manifest. **This is the primary source for every research number in this plan** |
| `HANDOFF-mdmax-markdown-engine-2026-08-01.md` | The session record that closed the research phase, including the founder's own framing verbatim in §14 |
| `HANDOFF-mdz-markdown-format-2026-07-29.md`, `HANDOFF-graph-engineering-research-2026-07-30.md` | Superseded handoffs. Kept because this record cites them |

---

### 1.8 Evidence conventions, and why they are strict

Two conventions govern every number in this document. They exist because of a measured failure, not
because of a preference for rigour.

#### 1.8a The tier tag

Every claim carries one of five tags. If a claim has no tag, it is a defect and it should be
deleted or downgraded.

| tag | means | the test |
|---|---|---|
| `[measured]` | We ran it in this programme, and the command, script or scan is nameable | Could another person re-run it from what is written here? |
| `[primary]` | We read the source itself — a specification file, a package's own README or registry metadata, an API response | Did we read the artifact, or someone's description of it? |
| `[secondary]` | Someone else's report of a measurement whose source we did not read | Named, and never used to carry a decision on its own |
| `[inference]` | A reading of measured facts, which is not itself measured | The facts underneath are tagged separately |
| `[SIMULATED]` | Replayed through code, not read from a live system | A dry run against live files is a measurement; a replay through modified code is a **prediction** |

The research artifacts use their own two labels, `own-measurement` and `primary-read`, which map to
`[measured]` and `[primary]` respectively.

**One consequence, and it is load-bearing.** **Zero live model calls were made in any research run
in this programme.** Every claim of the form *"this is easier for an AI to consume"* or *"this saves
the model tokens"* is therefore a **prediction, not a result**, and must be tagged `[inference]`.
The only live measurement of task tokens that exists anywhere in the record went the **wrong way, at
+5.2%**. Say "compression", with the denominator named, or say nothing.

#### 1.8b The corpus id rule

**Every number about our own files cites the corpus id.** A number about our files with no corpus id
is not a measurement.

```
corpus_id   sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
manifest    docs/engine/research/corpus-manifest.json

root          files      bytes        pinned head
------------  -----   -----------     ----------------------------------------
md              756    21,068,853     02c22ec47a3a73fb25a14b11be233ad3d00a8b48
knowledge       272     3,570,923     464eb666946c8cb4ccf42c68f4464613e5fc4999
frontmatter      56       908,989     798ebbf3250a5b2a53785859d79ae15f55ebebeb
------------  -----   -----------
TOTAL         1,084    25,548,765

selection rule   all *.md, case-insensitive; skip .git .next .obsidian .trash .venv
                 __pycache__ build dist node_modules at any depth; skip any dot-directory;
                 skip top-level Mirrors and Paste per root
id recipe        sha256 over the sorted "root/path:sha256" list, joined by newlines,
                 with NO trailing newline
```

`[measured — the roots sum exactly: 756+272+56 = 1,084 and 21,068,853+3,570,923+908,989 =
25,548,765, verified this session]`

**Why this is a rule.** Before the corpus was pinned, **seven irreproducible file counts** were
reported, with exclusion policies flipping *within* a single research area. Any figure about local
files in any earlier document that does not cite this corpus id is suspect, and should be treated as
unverified rather than repeated.

**And the recipe needs a committed script.** Three separate agents reported they could not reproduce
the corpus id — one declared *"MATCH: NONE"* after 64 variants — while the synthesis agent
reproduced it exactly from the prose recipe above. A ten-line derivation script under
`scripts/derive/` ends that class of false alarm permanently. **This is RECOMMENDED and not yet
done.**

#### 1.8c The 100% headline defect rate, stated plainly

This is the reason the conventions above exist, and it should be read before any number in this
document is trusted.

**The 18-area capability research run** (`docs/engine/research/wf-mdmax-capability-2026-08-01.result.json`)
**had a 100% headline defect rate. Every one of its eighteen headlines was refuted, overstated or
unsupported by its own adversarial verifier — and the correction always ran in the flattering
direction.**

Two independent derivations of that:

- The `aios-transfer` research area re-derived it and the verifier upheld the derivation: *"exactly
  14/18 killed-lists contain the literal token 'headline'; all four remainders kill a
  headline-load-bearing number (verified by reading each headline in full against its killed
  list)."* `[measured, upheld]`
- My own parse of the same artifact this session, over `per_area[].verification.verdicts`:

```
18-area capability run — 203 claim-level verdicts
  CONFIRMED     46   =  22.66%
  OVERSTATED    64
  REFUTED       79
  UNSUPPORTED   14
  → 157 of 203 = 77.34% of claim-level verdicts are defective
```

`[measured, this session, re-derivable with:]`

```bash
python3 -c "import json,collections;d=json.load(open('docs/engine/research/wf-mdmax-capability-2026-08-01.result.json'));print(collections.Counter(x.get('verdict') for a in d['per_area'] for x in a['verification']['verdicts']))"
```

**Contradiction, and it must be recorded.** `docs/mdmax/PLAN.md` v2.0.0 §9 item 1 states *"Eighteen
of eighteen headlines refuted in the previous run."* **"Refuted" is too strong for what the artifact
records.** The artifact records a mixture of `REFUTED`, `OVERSTATED` and `UNSUPPORTED`, and at least
one headline leg is recorded `CONFIRMED` on a primary read — the `model-view` area's finding that
*"this repo's own AGENTS.md — which opens 'Read this before' — was never loaded into the agent
reading it."* **The governing statement is: eighteen of eighteen headlines were DEFECTIVE — each
carried at least one leg refuted, overstated or unsupported — and always in the flattering
direction.** Use "defective". Do not use "refuted". `[contradiction, resolved in favour of the
artifact]`

**What changed in the second run.** The final gate
(`docs/engine/research/wf-final-gate-2026-08-01.result.json`) added four structural fixes —
mandatory negatives, pre-registered falsifiers, a mandatory corpus id, and an audit of the verifiers
themselves. The result:

```
16-area final gate — headline verdicts
  CONFIRMED     5    ·   OVERSTATED   10    ·   REFUTED   1

16-area final gate — 206 claim-level verdicts
  CONFIRMED   117   =  56.80%
  OVERSTATED   51
  REFUTED      29
  UNSUPPORTED   9
```

`[measured, this session]`

**The confirmed share of claim-level verdicts went from 22.66% to 56.80%.** That is the honest
measure of what the structural fixes bought. It is a large improvement and it is nowhere near
sufficient to trust a headline without reading its verification block.

#### 1.8d The kill-audit rule — a kill is strong evidence, not proof

The final gate produced **115 killed items** across its 16 areas. Four independent auditors then
re-checked **105** of them, and tried to overturn each kill:

| auditor | sampled | upheld | overturned | overturn rate |
|---|---|---|---|---|
| 1 | 29 | 24 | 5 | **17.24%** |
| 2 | 29 | 28 | 1 | **3.4%** |
| 3 | 21 | 17 | 4 | **19.0%** |
| 4 | 26 | 26 | 0 | **0.0%** |
| **pooled** | **105** | **95** | **10** | **9.52%** |

`[measured, this session, re-derivable from the kill_audit array]`

**Two things follow, and one correction.**

1. **A kill is strong evidence, not proof.** Between 0% and 19% of kills were themselves wrong,
   depending on the auditor. If a kill in this document looks wrong to you, say so — that is a
   supported position, not heresy.
2. **Even an upheld kill may carry a wrong supporting figure.** Auditor 4 reported: *"5/26 = 19.2%
   of upheld kills carry at least one supporting figure I could not reproduce or found to be
   wrong."* The `~16M downloads/month` substitute in EXCLUDED 2 above is exactly such a case — the
   kill stands, its replacement number does not.
3. **Correction to v2.0.0.** `docs/mdmax/PLAN.md` v2.0.0 §0 states the verifiers are *"roughly 88%
   reliable."* That figure is not derivable from the four audits. The pooled upheld rate is
   **95/105 = 90.48%**, and the unweighted mean across the four auditors is **90.08%**. Neither
   rounds to 88%. **Use 90.5% pooled, and always state the 0%–19.0% range alongside it, because the
   spread is the more informative number.** `[measured, corrects v2.0.0]`

#### 1.8e How to check any research number in this document yourself

Every research claim in this plan traces to one of two JSON artifacts and one manifest. You do not
have to trust a summary. Read the verification block. All four commands below were run from the
repository root and produce output.

```bash
# 1. What verdict did an area's headline actually get?
python3 -c "import json;d=json.load(open('docs/engine/research/wf-final-gate-2026-08-01.result.json'));print(*[(a['area'],a['verification']['headline_verdict']) for a in d['per_area']],sep='\n')"

# 2. What did the verifier KILL in a given area?  (area keys are listed below)
python3 -c "import json;d=json.load(open('docs/engine/research/wf-final-gate-2026-08-01.result.json'));a=[x for x in d['per_area'] if x['area']=='the-era'][0];print(*a['verification']['killed'],sep='\n\n')"

# 3. What SURVIVED in that area?  (this is what you are allowed to quote)
python3 -c "import json;d=json.load(open('docs/engine/research/wf-final-gate-2026-08-01.result.json'));a=[x for x in d['per_area'] if x['area']=='the-era'][0];print(*a['verification']['survived'],sep='\n\n')"

# 4. Confirm the pinned corpus totals
python3 -c "import json;d=json.load(open('docs/engine/research/corpus-manifest.json'));print(d['corpus_id'],d['total_files'],d['total_bytes'])"
```

**Area keys, 16-area final gate** (`wf-final-gate-2026-08-01.result.json`):
`the-era` · `founder-thesis` · `container-thesis` · `markdown-base` · `custom-pointers` ·
`hold-more` · `rendering-frontier` · `parsing-robustness` · `product-gap` · `moat` ·
`market-and-gift` · `aios-transfer` · `agentic-docs` · `competitive-live` · `against` · `premortem`

**Area keys, 18-area capability run** (`wf-mdmax-capability-2026-08-01.result.json`):
`edit-format` · `cache-layout` · `ai-dialect` · `token-cost-tier` · `retrieval-shape` ·
`degradation-certificate` · `multi-format-ingest` · `provenance-boundary` · `collab-primitives` ·
`impact-preview` · `model-view` · `integrity` · `normalization-i18n` · `unit-of-exchange` ·
`missing-constructs` · `adjacent-transplant` · `budget-knapsack` · `governance-and-moat`

**The four synthesis lenses in the final gate**, at `synthesis[0..3]`: *era-and-vision*,
*product-and-market*, *technical*, *the-verdict*.

**Reading order inside an area, and this is not optional:** read `verification` **before** you read
`headline`. The headline is the researcher's claim; `verification.survived` and
`verification.killed` are what is left of it.

---

### 1.9 What this section does not cover, and what would make it wrong

**Not covered here.** Each has its own section, and this one deliberately does not pre-empt them:

- What was abandoned and what killed it — the mother-markdown container, and markdown-as-a-graph.
- The engine itself: the splice writer, block identity, the two-tier link resolver, `mdmax cert`.
- The product, the competitive intersection, the pricing, and the give-away budget.
- The second-user problem in full, which is the thing that actually decides this.
- The build sequence, the kill gates, the open decisions and the error log.

**What is NOT established, anywhere in this document.** Repeating any of these as fact is a defect:

| claim | status |
|---|---|
| markdown's share of repository trees is growing | **unproven** — two named samples say it rose, one unnamed sample says it fell |
| markdown's share of repository trees is shrinking | **unproven** — same evidence, same reason |
| the size of the streaming-markdown install base | **three conflicting figures in our own record**; quote the structure, not a number |
| "markdown is easier for an AI to consume" | **prediction, not result** — zero live model calls in any research run |
| the 99.627% content-derived re-anchoring figure | **re-derived by NOBODY**, including every research area that quoted it. Do not publish it until an independent re-derivation lands |
| "there is a new streaming-markdown category" | **refuted** — one vendor, one pinned dependency closure |
| CommonMark spec commits "declined every single year" | **refuted** — 2021 = 14 rises to 2022 = 15 |

**What would falsify this section.** F-ERA-1, F-ERA-2 and F-ERA-3 in §1.4d are pre-registered with
thresholds. Beyond those:

- **If the reading guide sends the wrong reader to the wrong section**, that is a defect in this
  section, not in theirs. It is measurable: ask Amit, after he reads the co-founder path, to state
  the one fact and the one kill gate. If he cannot, §1.7 is wrong.
- **If a builder has to ask a question that this section should have answered** — what is MDMAX,
  what is AIOS, is D3 open — this section failed at its only job.
- **If any number in this section is quoted downstream without its tag or its corpus id**, the
  conventions in §1.8 are not being enforced, and the next research programme will reproduce the
  100% defect rate exactly.

**And the honest limit of §1.8.** The conventions above are the fixes that took the confirmed share
of claim-level verdicts from 22.66% to 56.80%. They did not take it to 100%, and there is no reason
to think a third round would. **The correct posture toward every number in this plan is: it is
probably right, its direction is probably right, and its exact value should be re-derived before it
is published.**


---

---

### Links

**This section references:** [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§5 Rendering](05-rendering.md) · [§7 Product](07-product.md) · [§9 AIOS](09-aios.md) · [§10 Engine spec](10-engine-spec.md) · [§14 Verification](14-verification.md)

**Referenced by:** [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§5 Rendering](05-rendering.md) · [§8 Market](08-market.md) · [§9 AIOS](09-aios.md) · [§10 Engine spec](10-engine-spec.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
