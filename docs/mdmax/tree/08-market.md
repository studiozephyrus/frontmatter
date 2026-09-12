---
mdmax: 1
section: 8
title: "The market — USP, what competitors lack, what we solve, what we cannot solve"
slug: 08-market
lines: 1111
words: 12515
forward_links: [0, 1, 5, 7]
backlinks: [0, 2, 7, 9, 14]
prev: 07-product
next: 09-aios
---

[← Index](README.md) · [← §7 Product](07-product.md) · [§9 AIOS →](09-aios.md)

## 8. The market — USP, what competitors lack, what we solve, what we cannot solve

### 8.0 How to read this section

This is the complete market and positioning analysis. It answers six questions the founder asked in
these words: what is the unique selling proposition against products that already exist; where do
those products fall short; how do we solve it; what exact problems do we solve; what exact problems
can we **not** solve; and what problems remain unsolved by anybody.

Three vocabulary rules apply throughout, and they are not decoration:

| word | meaning |
|---|---|
| **DECIDED** | settled. Build against it. Changing it requires re-opening a numbered decision (D1–D10) or a kill gate (the kill-gate table, K1–K7). |
| **RECOMMENDED** | the evidence points here, but a competent person could choose otherwise and be defensible. |
| **OPEN** | genuinely unresolved. Do not let a plan sentence pretend otherwise. |

Every claim carries an evidence tag: `[measured]` we ran it and the number came out of a tool;
`[primary]` we read the source document ourselves; `[secondary]` quoted from something that read the
source; `[inference]` reasoned, not observed; `[SIMULATED]` replayed through code rather than read
from a live system.

**Corpus.** Every figure about local files in this section is measured over the pinned corpus
`corpus_id sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4` — 1,084 files,
25,548,765 bytes, across three repository roots (`md` at `02c22ec4…`, 756 files; `knowledge` at
`464eb666…`, 272 files; `frontmatter` at `798ebbf3…`, 56 files). It resolved on disk with 0 missing
files and 0 sha256 drift when two independent readers rebuilt it on 2026-08-01. `[measured]`
Two caveats travel with it and must travel with every ratio derived from it: **29 files (2.68%) are
byte-identical duplicates across roots** — `frontmatter/docs/*` is mirrored into `md/docs/*` — so
every percentage inherits a small double-count; and **the `corpus_id` string itself has no generator
script in the repository**, so the label is not reproducible even though all 1,084 individual hashes
are. Any figure about local files that does *not* name this corpus id is suspect and is marked as
such below.

---

### 8.1 The USP, in one paragraph and then in one sentence

**frontmatter is the only product that gives you the Google Docs review loop — comments anchored to
text, suggestions, resolve, history, sharing — on markdown files that stay plain `.md` and stay in a
repository you own.** Every competitor has one half. HackMD has the review loop and no vault.
Moment.dev has the vault and real-time editing and does not mention comments or suggestions anywhere
in its marketing. Obsidian has the vault and states in its own documentation that it has neither
cursors nor fine-grained permissions. The one product that built the hard technical half —
content-derived comment anchoring over markdown — shipped it on 2026-07-30 and declined the teammate
model **in writing**, in its own changelog.

The customer-facing sentence is not that paragraph. It is:

> **"Your vault, in any browser. Nothing to install."**

That sentence is derived verbatim from the demand corpus — from a user in the Obsidian forum's
longest-running feature request who cannot install software on a work machine
(`forum.obsidian.md/t/obsidian-for-web/2049/246`). `[primary]` The review loop is what we *sell*;
browser access is what we *lead with*, because it is the pain the market has been shouting about for
six years and it is the one the existing codebase already answers.

**DECIDED.** D1 (frontmatter = Google Docs for markdown) is the product definition. §8.10 explains
why the lead sentence and the USP are deliberately different sentences.

---

### 8.2 The intersection table — files you own, crossed with the review loop

This is the single most important table in the market analysis. The two axes are:

- **Files you own** — the durable artifact is plain `.md`, on disk or in a repository the user
  controls, not a proprietary document the vendor stores.
- **The review loop** — comments anchored to a range of text, suggestions that can be accepted or
  rejected, and resolve, *between two humans*.

| Product | Files you own | The review loop | Evidence |
|---|---|---|---|
| **HackMD** | ✗ — server-side notes; GitHub push/pull exists but is capped at 20 pushes/month on the free tier | ✓ — the whole loop, on the **free** tier | `hackmd.io/pricing` comparison table: all four Collaboration rows (Real-time collaboration, Custom note permalink, In-line and page commenting, Suggest edit `[New]`) carry the check glyph in **all three** columns — Free, Prime, Enterprise. Twelve checks. The Free plan's own bullet list independently names "Suggest edit". Prime is $5/seat/month **billed annually** with a 3-seat floor ($15/month total); month-to-month is ~$8/seat. `[primary]`, verifier verdict **CONFIRMED** at the markup level |
| **Moment.dev** | ✓ — its own docs describe every document as a collection of plain `.md` files on your disk in git repositories, with history via Jujutsu and git | **zero occurrences of "comment" or "suggest"** | `grep -ioE "comment\|suggest"` over the fetched homepage and pricing page returns **0 matches**. Pricing verbatim: Free 1 user; Team $30/month, up to 5 users included, +$6/month per additional user; features listed are "Real-time collaborative editing / Access controls & permissions". `[primary]`, verifier verdict **CONFIRMED** against `moment.dev/pricing` |
| **Obsidian** | ✓ — the category benchmark; plain `.md` on disk | ✗ — states plainly it has none | Obsidian's own shared-vault help file: fine-grained permissions are "not supported yet", all collaborators get the vault owner's permissions, live collaborative editing on the same file is not supported and *"You will not see the other user's cursor"*, the collaborator cap is 20 users, and **every collaborator must hold an active Sync subscription** at $4/user/month billed annually ($5 monthly). `[primary]`, verifier verdict **CONFIRMED** — four of four quotes byte-exact |
| **inkeep/open-knowledge** | ✓ — markdown IDE over your own content | **Built the hard half, declined the teammate model in writing** | See below |
| **Outline** | ✗ — markdown becomes a projection; the source of truth is a ProseMirror document plus a Yjs CRDT state blob | ✓ — complete | `server/models/Comment.ts` stores `data: ProsemirrorData` with `documentId`, `parentCommentId`, `resolvedAt`; `shared/editor/marks/Comment.ts` makes the anchor a ProseMirror **mark** carried inside the document model, so re-anchoring never happens. 39,932 stars. `[primary]` |
| **Craft / Bear** | partial | ✗ | Craft's homepage contains **0** occurrences of "markdown", "comment" or "collaborat". Bear's contains 7 "markdown", **0** "comment", **0** "collaborat". `[measured]` |
| **frontmatter** | ✓ | ← **this is the product** | |

#### 8.2.1 The inkeep/open-knowledge row, in full, because it is the whole competitive picture

`inkeep/open-knowledge` — repo description "Beautiful, AI-native markdown IDE and LLM wiki", README
feature #1 promising true WYSIWYG so that editing markdown files feels like editing a Google Doc or
Notion page — is the closest thing to frontmatter that exists. Measured 2026-08-01: `[measured]`

```
stars                  3,239           (created 2026-06-03, pushed 2026-08-01)
licence                GPL-3.0
npm @inkeep/open-knowledge   14,790 downloads/week   (week 2026-07-24 .. 2026-07-30)
                             859 published versions since 2026-04-17
                             140,859 total downloads 2026-05-01 .. 2026-08-01, rising
                             (weekly buckets 6,862 -> 22,042)
HN                     381 points / 173 comments, 2026-06-25
ships                  macOS app, web UI, CLI, MCP server + skills for Claude/Codex/OpenCode,
                       git/GitHub team sharing
comment anchoring      PR #926 "Comments feature (#2944)" merged 2026-07-30T23:39:04Z
                       npm beta 0.46.0-beta.32 published 2026-08-01T02:38:33.569Z
                       ABSENT from stable 0.45.4 (published 2026-07-31T22:56:04.451Z)
```

That last line matters and it was established by a falsifier the original researcher ran against its
own headline: both tarballs were downloaded and grepped. Stable 0.45.4 contains **zero** files
matching "Add Comment", "Send to AI" or "orphaned"; beta 0.46.0-beta.32 contains all three. `[measured]`
So the correct statement is **"reached beta, absent from stable"**, not "shipped".

Their anchoring implementation (`packages/server/src/comments/anchor.ts`, 261 lines,
`sha256:9f65280c…`) is convergent with the block-identity design in the engine section to an
uncomfortable degree: the durable record is the exact quoted text plus prefix/suffix context widened
at create time until the triple is unique; the stored position is a hint only; it refuses
(`status: 'orphaned'`) rather than guessing. It cites Hypothesis's 32-character context window by
name. `[primary]`

And then, in `.changeset/comments-v1.md`, it declines the thing we are building, in one sentence:

> Comments are stored per-machine next to your content and are not committed — a comment here is
> *"a note to your own agent, not a message to a teammate."*

`[primary]`, verifier verdict **CONFIRMED**, quoted byte-exact from the changeset.

**Read that carefully, because it says three separate things.**

1. **They validated D2 independently.** Comments live outside the file, in a machine-local sidecar,
   never committed. We reached that decision by argument; they reached it by building.
2. **They did the hard engineering half and published it.** Content-derived anchoring over markdown
   is no longer an unclaimed capability. It is claimed, and readable by anyone.
3. **They explicitly declined the easy half — the teammate.** The multiplayer review loop is exactly
   what remains open.

Two mitigations, both real and both narrow. The code is **GPL-3.0**, so it cannot be copied into a
proprietary product by us *or by anyone else without reciprocity*. And their comments are
single-player by design. `[primary]`

Two things that cut against us and must be said. First, the competitive sweep that found this
**would have missed it**: registry sweeps across six lane keywords over 180 npm packages found
nothing, and four of five GitHub topic/phrase searches returned `total_count 0`. The finding came
from a six-week-old Show HN post, and the anchoring inside it was only visible after reading a merged
pull request's file list. **A competitive watch tuned to package registries and spec repositories is
structurally blind to capability shipped inside an application — which is exactly where a
"Google Docs for markdown" competitor will always ship.** `[measured]` Second, "we have the idea" is
no longer a position we hold alone, and today we hold **zero** of it in code: `grep -rli mdmax src test`
returns nothing, and `src/` is 21,415 lines of product shell. `[measured]`

**DECIDED.** The intersection — files you own × a human review loop — is the product. **OPEN:** how
long the intersection stays empty. §8.8 puts a number on it.

#### 8.2.2 The category is consolidating and dying around us

Context, measured on 2026-08-01: `[measured]`

- `curl -o /dev/null -w '%{http_code}' https://app.almanac.io` → **503**. `almanac.io` redirects to
  `get.almanac.io`, whose only internal link is a farewell letter from its CEO. No login, no pricing,
  no product links.
- `coda.io` carries a banner announcing that Coda is now Superhuman Docs.
- **Dendron** — the most technically innovative markdown-native entrant in the category (hierarchical
  namespaces, local-first, open source, 244 contributors, 7,459 stars) — has **0 commits in 52 weeks**.
  Its README says active development has ceased. Its founder's stated cause, quoted verbatim in the
  announcement discussion, was that they *"were ultimately not able to find product market fit for a
  venture backed business."* Zero technical content in that sentence. `[primary]`
- Meanwhile the four single-player first movers were **never overtaken**: iA Writer (Mac App Store
  first release 2013-12-19) shipped 8.0.5 on 2026-07-17; Ulysses shipped 40.2 on 2026-07-13; Bear
  shipped 2.9.2 on 2026-07-28; Craft shipped 3.5.3 on 2026-07-30. `[measured]`

**The category has produced neither a winner nor a graveyard. It has produced a stable, small,
fragmented market in which capability has never decided anything.** That is the most important
market-history fact in this document and §8.8 builds on it.

---

### 8.3 The demand reversal — the single most consequential correction in the corpus

#### 8.3.1 What happened

An earlier research area measured the founders' own demand corpus (two JSON files, 550,131 bytes
total: `docs/research/frontmatter-raw-corpus.json` 210,828 B / 1,853 string leaves, and
`docs/research/frontmatter-r2-raw-corpus.json` 339,303 B / 1,951 string leaves) and reported:

> real-time collaboration 138 string leaves vs commenting/track-changes 20 — **6.9:1** in favour of
> real-time collaboration.

That number was load-bearing. It was the finding that licensed deferring comments behind Yjs, and it
was cited to declare the area's own pre-registered falsifier ("the demand corpus evidences commenting
at rough parity with real-time collaboration") **REFUTED**.

**Its own adversarial verifier killed it.** `[measured]` The instrument was asymmetric: the
collaboration side used a broad three-alternative stem — `real[- ]time|multiplayer|collaborat` — of
which the bare stem `collaborat` alone matched 114 of the 138 hits; the commenting side used a narrow
multi-word-phrase whitelist requiring literals like "leave a comment" or "suggestion mode". On a
symmetric instrument, de-confounded by dropping URL leaves (Reddit permalinks all contain
`/comments/` — 144 of them) and stripping "N pts / N comments" score metadata:

> **review loop 169 leaves : collaboration 95 leaves — 1.78:1 the OTHER WAY.**

The verifier's own words: *"F3 FIRED and was declared REFUTED by an asymmetric instrument."*

#### 8.3.2 The honest complication, stated because a section that only argues its own case is marketing

There is a **third** measurement of the same corpus, from the integrating synthesis lens, and it
disagrees with the verifier. It reproduces the verifier's symmetric count almost exactly (1.81:1),
then inspects what drives the numerator and finds that the word "comment" in this corpus is
overwhelmingly **thread metadata rendered into prose** — "a 60-comment resignation letter", a
"614-comment Evernote thread", "a 105-upvote top comment". A strict metadata regex catches 34.2% of
the 155 comment-bearing leaves, and 8 of 8 sampled residuals were also metadata. On the unambiguous
review-loop family with no possible confound — *suggestion mode, suggested edit, track changes,
annotate, redline* — the count is **25 leaves against 108** for realtime/collaboration, i.e. **4.3:1
back in the original direction**. `[measured]`

A fourth instrument, over the 89 **structured** feature requests (counting only the `feature` and
`why` fields, which excludes the URL fields that inflate "comment"), gives: sync 62, offline 18,
export 17, collab 15, mobile 13, pricing/subscription 14, wysiwyg 7, real-time 7, suggest 5,
multiplayer 3, presence 2, vim 1. `[measured]`

**Four measurements, one corpus. Here is what governs and why.**

| reading | figure | status |
|---|---|---|
| Original area, asymmetric instrument | 6.9:1 for collaboration | **DEAD.** Killed by its own verifier; the asymmetry is demonstrated, not alleged. Do not quote it again. |
| Verifier, symmetric word-match, URL- and score-de-confounded | **1.78:1 for the review loop** | **GOVERNS as the published figure.** It is the only reading produced by an adversarial reader whose job was to attack, and it is the reading recorded in the product section's demand-reversal subsection. |
| Integrator, strict semantic family excluding the word "comment" | 4.3:1 for collaboration | **The strongest counter-argument, and it is not refuted.** It is a narrower instrument on a cleaner numerator. |
| Structured feature requests, `feature`+`why` fields only | collab-family 27 : suggest 5 | consistent with the integrator |

**What all four agree on, and this is the durable finding:** (a) **sync is the largest demand signal
by a wide margin** — 358 leaves out of 2,559 non-URL leaves, and 62 of the 89 structured feature
requests; (b) the review loop and real-time collaboration are within a **small factor** of each
other, **not 7:1 apart**; (c) **provenance (5 leaves) and conformance (11 leaves) are near zero.**

#### 8.3.3 What it changes

**DECIDED: build comments, not Yjs, this cycle.** The decision is unchanged; the *justification*
changes, and the founders must know which one they are standing on.

- It was justified as **demand-led**. Under the governing 1.78:1 reading it still is. Under the
  integrator's reading it is not.
- It is justified **regardless** on three grounds that no reading of the corpus disturbs:
  1. **Defensibility.** The review loop is the empty intersection (§8.2). Real-time collaboration is
     occupied — Moment.dev ships it on git-backed `.md` today at $30/month for five seats. `[primary]`
  2. **Architecture cost.** Real-time co-typing fights D7 (splice-only). Outline solves the entire
     loop by making the comment a ProseMirror mark inside a Yjs document and markdown a *projection* —
     at which point re-anchoring vanishes as a problem and D4/D6 vanish as guarantees. Refusing that
     trade is defensible; it must be paid for knowingly. `[primary]`
  3. **Buildability.** Comments are a sidecar keyed by a W3C TextQuoteSelector — a Recommendation
     since February 2017, not an invention. Real-time collaboration is the largest remaining build in
     the plan.
- **What must change in the prose:** stop citing the review loop as demand-led without also citing
  the integrator's contamination analysis. The product section states the 1.78:1 correctly; it does
  not yet carry the caveat. Add it.

**The 6.9:1 figure must never appear in a pitch, a deck, or a commit message again.** It is the
clearest instance in this programme of a measurement that flattered the conclusion its own author
preferred.

---

### 8.4 The fourteen pain themes, ranked, and which ones we serve

The demand research yielded **92 sourced pain points, 89 feature requests and a 20-app competitor
matrix**, every claim carrying a verbatim quote and a URL, clustered into 14 themes ranked by
severity × frequency (`docs/FRONTMATTER-PRODUCT-PLAN.md` §1;
`docs/research/frontmatter-pain-taxonomy.md`). `[primary]`

**A naming hazard you will hit within an hour.** The taxonomy's theme *identifiers* (T1…T14) are not
the same as the *ranks*. Theme **T7** ("Real-time collaboration is impossible in markdown-land")
ranks **6th**; theme **T6** ("Offline failures") ranks **7th**. `docs/FRONTMATTER-PRODUCT-PLAN.md`
mislabels these against each other in seven consecutive rows — line 116 uses taxonomy IDs correctly
while lines 125–142 use rank numbers, so the offline and collaboration citations are swapped inside a
single document. `[measured]` **The table below uses RANK. When you read "T6" anywhere in the older
docs, check which convention that line is using.**

| Rank | Theme (taxonomy ID) | Severity, verbatim | Do we serve it? | How |
|---:|---|---|---|---|
| 1 | Sync silently destroys data (T1) | Kills adoption | **Partly** | 3-way merge engine (`merge3.ts`, 14 conflict-matrix tests) + `baseSha` 409 optimistic concurrency are shipped. The background auto-sync engine and the always-visible sync-status indicator are **not**. See §8.6. |
| 2 | Trust collapse / shutdown fear (T2) | Kills adoption | **Yes** | D4. The durable artifact is plain `.md` in the user's own repository; whole-vault ZIP export shipped. |
| 3 | Price backlash / subscription fatigue (T3) | Churns at exodus scale | **Yes** | Free git-backed sync — marginal cost ≈ 0 because the user's own repository is the storage. Pro at $4/mo, exact parity with Obsidian Sync Standard. |
| 4 | Slow at scale / mobile startup (T4) | Kills adoption | **No, unproven** | Server-side index + lazy load is the theory. Nothing is measured at 10k notes. See §8.6. |
| 5 | Lock-in / lossy export (T5) | Kills adoption | **Yes** | There is nothing to export from; the data is already `.md` in git. Export `.md`/HTML/PDF/ZIP shipped. |
| 6 | **Real-time collab impossible in markdown-land (T7)** | **Kills adoption (teams)** | **This is the USP** | The review loop (§8.5). Real-time co-typing is explicitly **not** this cycle. |
| 7 | Offline failures (T6) | Kills adoption | **Deferred** | Offline is a Max-tier promise (D4). Not built. |
| 8 | Too complex for normal people (T8) | Kills mainstream adoption | **No** | Live/WYSIWYG mode v1 exists. The bar — a non-technical collaborator editing without knowing markdown exists — is not met. |
| 9 | **No browser access / platform gaps (T9)** | **Kills at evaluation** | **Yes — this is the lead** | The product *is* a URL. Obsidian has no web client at all. |
| 10 | Git-as-sync fails non-engineers (T10) | Churns (severe, niche) | **Yes, structurally** | git runs server-side, so every mobile-git failure mode vanishes by construction. |
| 11 | Capture easy, retrieval impossible (T11) | Churns | **No** | MiniSearch + backlinks + AI suggest-links exist. Resurfacing and dedup do not. |
| 12 | Capture friction (T12) | Churns | **Partly** | A URL is a low-friction capture surface. Sub-500ms open is unmeasured. |
| 13 | **Markdown/frontmatter mangling (T13)** | **Churns the purist early adopters** | **Yes — and today we are a *cause* of it** | §8.5, item 6. |
| 14 | Publishing/sharing friction (T14) | Annoys | **Yes** | `public_slug` publish shipped; undercuts a resented $8/site/month add-on. |

**Be honest about rank 13.** The engine capability the programme was most excited about —
round-trip-sacred frontmatter — serves the **13th of 14** themes. That is a fact and it should stay
in the plan.

**But two corrections to the way that fact has been used.** `[measured]`

1. **Its severity has been misquoted downwards.** One research area described T13's severity as
   "ANNOYS". `docs/FRONTMATTER-PRODUCT-PLAN.md` line 42 says **"Churns the purist early adopters"**;
   "Annoys" is line 43, which is T14. The label was shifted exactly one band, in the direction that
   strengthened that area's own recommendation. The correct reading is narrower and more useful:
   **T13 churns exactly the early-adopter segment a developer tool recruits first.**
2. **The compiler does not map only to rank 13.** The plan maps the engine to the review loop, which
   is **rank 6, "Kills adoption (teams)"**. An area that mapped it solely to 13 had that mapping
   killed by its verifier.

**RECOMMENDED framing:** the engine work is justified by rank 6 (it is what makes anchored comments
possible) and pays a rank-13 dividend on the way (it stops us corrupting frontmatter). It is not
justified by rank 13 alone, and it must never be *marketed* from rank 13 — see §8.9.

---

### 8.5 What we solve — the explicit list, each with mechanism and evidence

Each item states the pain it answers, the mechanism, the evidence, and its build state.

**1. You cannot open your notes on a machine you do not control.** (rank 9, "Kills at evaluation")

- **Mechanism.** The editor is a web application; the vault is a GitHub repository reached through
  the GitHub API. Nothing is installed. GitHub.com is reachable on corporate networks where Dropbox
  is firewalled.
- **Evidence.** `forum.obsidian.md/t/obsidian-for-web/2049` — the forum's most-viewed suggestion:
  246,568 views / 244 posts / 928 likes as of 2026-07-13, re-read at **249,616 views** on 2026-08-01.
  `[primary]` The workaround absurdity proves the intensity: **414,917 Docker pulls** of
  `linuxserver/obsidian`, a container whose job is to stream an entire Linux desktop over VNC into a
  browser tab. `[secondary — from the segment study, verified 2026-07-13]`
- **State.** Shipped: CodeMirror 6 editor with edit/reading/split + Live mode v1, the full Obsidian
  dialect (wikilinks with alias and heading, transclusion, callouts, tags, KaTeX, Mermaid, GFM
  tables, task toggles), MiniSearch full-text search, command palette, daily notes, PWA + Tauri.
  Blocked on: **the second user** (§8.6, item 1).

**2. Git-as-sync destroys non-engineers' work.** (rank 10)

- **Mechanism.** git runs server-side. There is no `isomorphic-git` on a phone, no pasted personal
  access token, no terminal. Conservative 3-way merge (`src/modules/repository/domain/merge3.ts`,
  14 conflict-matrix tests) plus `baseSha` optimistic concurrency returning 409 on every commit.
- **Evidence.** `obsidian-git` issues #558 ("if you commit the changes, it overwrites any changes
  from the other device"), #803 (conflict resolution requires a terminal), #819. `obsidian-git` has
  **2,934,409 cumulative downloads** in `community-plugin-stats.json` as of 2026-08-01. `[measured]`
  *(Note: the field is literally named `downloads`, and it is cumulative across all versions. An
  earlier draft called these "installs" and derived a "+4,800/day" rate; that rate is **not
  derivable** — the file carries no time series. Do not repeat it.)*
- **State.** Merge engine shipped. The in-app conflict UI and the background sync engine are not.

**3. Subscription fatigue and sync add-on pricing.** (rank 3)

- **Mechanism.** The user's own repository is the storage, so sync has a marginal cost of
  approximately zero and can be free forever. Paid tiers charge only for things that actually cost
  money — hosting the review loop, AI credits, seats.
- **Evidence.** Live prices fetched 2026-08-01: `[primary]` Obsidian Sync $4/user/month billed
  annually ($5 monthly); Obsidian Publish $8/site/month billed annually ($10 monthly); Obsidian
  Catalyst $25 one-time; **Obsidian Commercial $50 per user per year**; Notion Free $0 / Plus $10 /
  Business $20 per member/month, then $10 per 1,000 Notion credits; HackMD Prime $5/seat/month billed
  annually, $15/month total at the 3-seat floor. The forum's own stated acceptable band is
  *"maybe $2-4/month"* (`forum.obsidian.md/t/26329`, 58 posts / 13,451 views / 256 likes).
- **State.** Pricing decided (see the pricing table in the product section, restated at §8.10.5).
  The **Work licence at $50/user/year** mirroring Obsidian Commercial is the under-used instrument:
  it is aimed precisely at the population rank 9 defines — people who cannot install software on a
  work machine and *can* expense a licence.

**4. Lock-in, lossy export, and shutdown fear.** (ranks 5 and 2)

- **Mechanism.** D4. There is no proprietary format and therefore no export problem. If frontmatter
  dies, the user still has a working Obsidian vault in a git repository.
- **Evidence.** The demand corpus's most repeated reason switchers stay switched is plain-file
  ownership; three products in one Product Hunt slice died within about three years.
- **State.** Shipped (export `.md`/HTML/PDF/whole-vault ZIP). **One correction to the marketing:**
  the "Export Word (.doc)" menu item emits **HTML with a `.doc` extension** and an
  `application/msword` content type — a real, twenty-year-old Word import path, not OOXML and not
  pandoc. An area called this a user-facing falsehood; its verifier disagreed and was right. It is a
  labelling preference, not a defect. Do not spend a pre-flight slot on it; do not claim "Pandoc
  formats" either.

**5. Publishing friction.** (rank 14)

- **Mechanism.** `public_slug` in frontmatter → a public URL, with slug-conflict handling.
- **Evidence.** Obsidian Publish at $8/site/month is called overpriced in a 19-point thread with a
  65-point agreeing top comment; a "free publish alternative" forum thread has 15,831 views.
- **State.** Shipped — and it is currently the **cause** of item 6.

**6. Frontmatter and markdown mangling — and we currently cause it.** (rank 13)

- **The defect.** `src/modules/share/infrastructure/share-writer.ts` has a header comment claiming it
  *splices* the key into the YAML frontmatter. Line 26 is `const next = matter.stringify(parsed.content, data);`
  — a whole-document re-serialisation of the entire YAML map from a plain JavaScript object. That is
  a **D7 violation in the only shipped write path**, and it fires on every publish and every unpublish
  of every note. `[primary]`
- **Measured damage** over the pinned corpus, reproduced independently by a verifier to the digit:
  `[measured]`

  ```
  files with frontmatter                              907
  byte-identical after a NO-OP write                   33   =  3.64%
  gray-matter throws outright                         171   = 18.85%  -> POST /api/share returns 502
  bytes changed                                       703
  publish-then-unpublish round trip byte-identical     17 / 736 parsed = 2.31%   (17/907 = 1.87%)
  a bare YYYY-MM-DD became an ISO timestamp       624 / 736 parsed = 84.78%
  re-parsing the mangled output: js data stable       703,  differs 0
  ```

  The last line is the most decision-relevant number in the whole engine record: **every existing
  test that asserts on `matter().data` passes green while the bytes on disk are wrong.**
  `title: 2026-05-26` becomes `title: 2026-05-26T00:00:00.000Z` — a visible title change in Obsidian,
  a broken Dataview filter, a broken Hugo or Jekyll build.
- **The mechanism that fixes it.** A byte-range splice: locate the byte range of the `public_slug`
  key (or the insertion point after the last key) and replace only those bytes. Never call
  `matter.stringify`.
- **Do not take the shortcut.** Swapping in the already-installed `yaml` library's Document API is
  **not** the fix. Measured on the same corpus: `yaml` leaves 114 of 907 blocks byte-identical
  (12.57% genuine + 18.74% silent refusals), refuses 170 outright, and changes 618. And in the publish path a refusal is **not safe** —
  it is a 502 and an unpublishable note. `[measured]`
  A contrast of "31.86% safe vs 3.64%" circulated in the research; **its verifier killed it** because
  it scored `yaml`'s 170 refusals as successes while scoring gray-matter's throws on the *identically
  same 170 files* as failures. Apples-to-apples the figures are **22.38% vs 31.86%** (file left
  untouched) or **3.64% vs 12.57% genuine + 18.74% silent refusals** (published and byte-identical). Never quote 3.64% vs 31.86%.
- **Evidence of demand.** Obsidian's own forum: calling `processFrontMatter` destroys previous
  formatting and most YAML features; a community plugin exists solely to undo it. `[primary]`

**7. The review loop — the USP.** (rank 6, "Kills adoption (teams)")

- **Mechanism.** Threaded comments and suggestions as **sidecar** threads (D2), keyed by
  `(noteId, revisionId, quote, prefix, suffix)` — a W3C TextQuoteSelector, a Recommendation since
  February 2017. Block-scoped: resolve the block first, then the quote inside it. Orphan visibly;
  never guess.
- **Evidence that block-scoping is the right primitive,** measured over 2,332 simulated comment
  selections of 3–12 words drawn from 400 randomly sampled real revision pairs: `[measured]`

  | anchoring strategy | correct | refused / gone | **silently AMBIGUOUS** |
  |---|---:|---:|---:|
  | byte-offset range (what Google's public comment API uses) | 65.31% | — | 34.69% wrong-or-gone |
  | global quote match (the Hypothes.is exact stage) | 85.12% | 12.18% gone | **2.70%** |
  | **block-scoped quote match** | **87.48%** | 8.45% block-refused + 3.99% quote-gone | **0.09%** |

  Block-scoping cuts silent mis-anchoring **30×**, and converts most of the remaining failure into an
  explicit, safe refusal: of the 197 refusals, 196 were blocks genuinely deleted or rewritten, and
  exactly **1 of 2,332 (0.04%)** was a resolver failure on a surviving block.
  **Caveat, stated plainly:** this is one corpus, from one author, and the 99.627% headline anchoring
  figure quoted elsewhere in this plan **has been re-derived by nobody** and is a *block*-level figure
  that does not transfer to *ranges*. Treat both as provisional until kill gate K3 closes.
- **Evidence that it is unclaimed.** §8.2, and specifically the OpenKnowledge changeset sentence.
- **The commercial argument nobody else can make.** OpenKnowledge publishes **no** correct/false/
  refusal rate anywhere in its source, tests or changeset. Nobody in the competitive sweep publishes
  one. **A published false-positive rate is a purchasing argument in a way that an algorithm is
  not** — and it is the part of the differentiator that survives a competitor reading our code.
- **State.** Not built. `firestore.rules` declares users, billing, usage, vaults, notes, revisions,
  shares and months — and contains the string `comments` **zero** times. `[primary]` The data model
  does not exist yet.

**8. Version history without a 30-day cliff.**

- **Mechanism.** git. `/api/vault/history|version|restore` shipped, plus immutable parent-linked
  revisions already specified in `firestore.rules`.
- **Honest gap.** There is **no diff view**: `grep -cin 'diff' src/modules/editor/presentation/HistoryModal.tsx`
  = 0, and every `diff` hit in `src/` is inside `merge3.ts::diffRegions`, used for merging and never
  rendered. `[measured]` The `FEATURE-GAP-REPORT` claims "browse git commits per note, diff, restore"
  as shipped. It overclaims. With no diff, the history a user sees is a list of commit-message
  strings — including the literal machine-generated ones this codebase writes, like
  `share: set public_slug=… on …`.

---

### 8.6 What we CANNOT solve — the explicit list

This list is longer than the one above and that is correct.

**1. Comments cannot survive in the file. DECIDED (D2), and it is not a limitation we are apologising
for.**

Comments and history live **outside** the `.md`. Export or copy yields clean markdown, latest content
only. Nothing about a comment is ever written into the file.

- **Why it is right.** Google's own architecture is the same shape: Drive API v3 (discovery revision
  20260728) models a comment as a sidecar with an `anchor` — described as a region of the document
  represented as a JSON string — plus `quotedFileContent` as the fallback, `resolved`, and a reply
  `action` of resolve/reopen. `[primary]` OpenKnowledge reached the same design independently.
  HedgeDoc's issue #657 has been open from 2020 to 2026, doctrinally deadlocked in **both**
  directions — in-file CriticMarkup was rejected because it pollutes every other pipeline and makes
  comment-only permission impossible; out-of-file was vetoed as metadata that is not part of the
  markdown. Users left for HackMD and Google Docs. `[secondary — quoted from this programme's own
  prior research; re-read issue #657 before using it in a pitch]`
- **What it costs us, concretely.** A comment cannot be read by any other tool. Open the same file in
  Obsidian, VS Code or `cat` and the conversation is invisible. A collaborator who pulls the git
  repository gets the text and none of the review. We cannot ship "your comments travel with the
  file", and we must never imply it.
- **The compensating promise, which must be a shipped feature and not a sentence:** a full export of
  every thread, in an open format, at any time, plus a documented migration. D4 says it; someone has
  to build it.

**2. Any capability whose payload is BY REFERENCE cannot degrade. This is a hard structural limit and
it deletes several "features unseen in the industry" from the possible set.**

The whole degradation doctrine (D6) rests on one property: an unknown construct in a `.md` file must
still render as *something honest* in a renderer that does not understand it. An unknown fence
language round-trips byte-perfectly. An unknown frontmatter key is ignored. That works because the
payload is **inline** — it is *in* the bytes.

**It fails completely when the payload is elsewhere.** `![[X]]` in a renderer that does not implement
transclusion renders as the literal string `![[X]]`, with the content of X **absent**. Not degraded —
absent, and replaced by a piece of syntax noise. The reader gets a five-character token where a
section of prose should be.

Therefore the following are **excluded** from the set of things we can ship as
degrading-gracefully-everywhere:

| capability | why it cannot degrade |
|---|---|
| **Transclusion / embed** (`![[X]]`) | the payload is another file. A non-implementing renderer shows the literal reference. |
| **Cross-file reactive state** (a value in file A that updates when file B changes) | the payload is a computation over other files. Nothing is in the bytes. |
| **Sidecar-resolved block metadata** (a block that carries meaning stored outside the file) | by definition the meaning is not in the file. |

Two further measurements make this a cheap loss rather than a painful one: `[measured]`

- **`![[transclusion]]` appears 45 times across 1,084 files and 25.5 MB of the pinned corpus.** The
  mechanism the "mother markdown" vision was built on is a rounding error in the founder's own vault.
- The graph the vision assumed does not exist: 10,097 wikilinks of which **72.4% resolve to no file**;
  median out-degree 0 and median in-degree 0; 58.9% of files (638/1,084) have zero resolvable
  outbound links; 54.6% (592/1,084) have zero backlinks; p90 out-degree is 5.
- **Caveat, stated as the researcher stated it:** this is one operator's vault, which is the exact
  weakness the plan's own W1 flags. A second corpus could overturn it.

**DECIDED:** D9 — a document *names* a capability, it never *carries* one. This limit is the reason.

**3. Real-time co-typing fights D7, and the cheapest complete substitute requires abandoning D4/D6.**

Splice-only writing (D7) means we never regenerate a document from its abstract syntax tree (Foster
et al., TOPLAS 2007, Lemma 3.9). A live CRDT is the opposite discipline: the document model is
authoritative and the text is derived from it. Outline resolves the entire review loop by making the
comment a ProseMirror mark inside a Yjs document, at which point **re-anchoring never happens** — the
anchor is transported by the same edit machinery that moves the text. It is the cheapest and most
complete substitute for our whole thesis, and it is open source at 39,932 stars. `[primary]`

The price of that path is that **markdown becomes a projection rather than the source of truth**,
which is exactly the D4/D6 trade. **Refusing it is defensible. It must be paid for knowingly, not by
omission.** Real-time collaboration is explicitly **not this cycle** (item 7 of the sequence).

Related architectural evidence, for whoever eventually builds it: `[primary]`
- The event-graph literature's own asynchronous benchmark traces **are git traces**, and operational
  transform is catastrophic on them — 3,664,266 ms and 6.76 GB peak on trace A2 versus 23.47 ms for
  the event-graph merge.
- The chosen engine in an earlier plan (`diamond-types-node`) has **73 npm downloads/week** against
  `yjs` at 7,244,115 and `loro-crdt` at 71,344; its Rust crate has not been published since
  2022-08-25. Applying the plan's own adoption test to its own collaboration choice rejects that
  choice.
- The event-graph paper's own source notes that its central optimisation **does not hold** for
  Peritext-style concurrent annotations — and comments and formatting marks are exactly
  Peritext-shaped.

**4. "Easier for AI" and "improves comprehension" are unproven. Zero live model calls were made in
any research run.**

Every claim that a projection, a normalisation or a view makes a model perform better is a
**prediction**, not a result. Label it that way in every artifact. The one live measurement that
exists in the record went the **wrong way**, at **+5.2% tokens**. The "25–168× fewer tokens" promise
is an **artifact-size ratio**, not a task-token measurement, and it is additionally contested:
one area measured a headings-only index at **14.9×** corpus-wide (11.7× median per file), and its
verifier replied that headings-only is the *outline* tier, not the *index* tier, and that a
211–250 bytes-per-document index yields **94.6–112.1×**, inside the published 61–152× band. `[measured]`
**Both readings cannot be quoted. Neither should be quoted as a benefit to an AI consumer until a
live model call measures the task.**

**5. Anonymous commenting, as D3 is currently written.**

D3 says reviewers must log in (Google or GitHub). Google's own share loop works the other way — its
help documentation states plainly that people who are not signed in show up as anonymous animals in
your file, and that "anyone with the link" can use a file without signing in. `[primary]` Our current
public surface is strictly weaker than either: `PublicNoteView.tsx` renders a read-only `<article>`
with zero comment affordances (`grep -c comment` = 0), and `POST /api/share` accepts only
`{path, slug}` — no role, no expiry, no password, no per-user grant. `[measured]`

**OPEN (the open decision on D3, anonymous commenters). RECOMMENDED: reopen D3 as a tier split** —
anonymous read-and-comment on a share link; login required to resolve or to edit. That preserves the
wedge and the account model at once. Owner and editor seats bill; commenters do not.

**6. We cannot reach non-technical normals. Explicitly out of scope.**

The segment study's own words: this segment is not reachable by frontmatter v1. GitHub sign-in is
fatal; any visible markdown or git vocabulary is instant abandonment; the requirement is phone-first
native-grade real-time. **DECIDED: ignore indefinitely.** Revisit only when WYSIWYG, an
Apple/Google signup with an invisible repository, and flawless mobile real-time all exist.

**7. We do not yet solve rank 1 — sync that provably never loses data — and we must not claim we do.**

The merge engine is real; the trust surface is not. The background auto-sync engine is deferred. There
is no always-visible sync-status indicator, which the corpus names as its most concrete trust ask.
And the single largest first-ten-minutes defect is not a missing feature at all: **saving is a manual
git commit with a message box.** `CommitBar.tsx:74` holds a `message` state, line 98 falls back to a
default, and `/api/commit` requires `message: z.string().min(1)`. `[measured]` **A "Google Docs for
markdown" that asks you to write a commit message loses in the first sixty seconds.**

**8. Performance at scale, and mobile, are unproven.**

`src/` carries **13** Tailwind responsive prefixes (`sm:|md:|lg:|xl:`) across 74 `.tsx` files, plus 3
`@media` rules in `globals.css` and 1 in `public-note.css`; two real drawers exist in
`VaultWorkspace.tsx`. `[measured, tagged inference by its own author: a prefix count is a proxy for
layout quality, not a measurement of it — the app was never rendered at mobile widths]` No cold-start
or search latency has been measured on a 10k-note vault. Rank 4 is a "Kills adoption" theme and we
have no evidence on it either way.

**9. Retrieval at scale (rank 11), capture friction (rank 12), and "too complex for normal people"
(rank 8) are not addressed by anything in this plan.** They are real, ranked above 13, and out of
scope this cycle. Say so rather than implying coverage.

**10. Writers and editors — the segment that most wants "track changes for markdown" — cannot be
served without a `.docx` round trip we do not have.** Their counterparty dictates the format. We
cannot change that.

**11. We cannot change markdown, and we would not want to.** CommonMark's last three releases
(0.31.0, 0.31.1, 0.31.2) all landed on 2024-01-28 and there have been none since; `cmark-gfm`'s last
release was 2023-07-21, still pinned to CommonMark 0.29 from 2019. `[primary]` GitHub renders the
world's markdown against a seven-year-old specification. **D6 makes that a constraint we exploit
rather than a problem we solve.** The format war is over and getting more over: `@djot/djot` was at
693 downloads/week when the plan first cited it and is at **485** now, against `marked` 61,032,058
and `remark-parse` 45,820,243. `[measured]`

**12. We cannot stop a closed renderer changing under us.** `github/markup` shipped v5.0.0 and
v5.0.1 on 2024-06-17 and **v6.0.0 on 2026-05-05**. `[measured]` Every closed-target row in a
degradation certificate has a shelf life; a competitor who re-measures once is level in a week. That
is why certificate rows must carry an `observed_at` and expire rather than silently claim PASS.

---

### 8.7 What problems remain — the ones nobody solves, ours or theirs

These are gaps in the *market*, not in our roadmap. Some are opportunities; some are warnings; all
are unfilled as of 2026-08-01.

**1. Suggestions — accept/reject over plain markdown, with a clean-export guarantee.** Nobody ships
it. Every Obsidian commenting or review plugin either writes into the `.md` (`review-comments` 410
downloads, `review-critic` 200, `tandem-comments` 814, `document-comments` 1,318) or is PDF/EPUB
annotation. HackMD has "Suggest edit" but no vault. The demand corpus says it verbatim: no track
changes or suggestion mode in any markdown or writing-focused tool. `[measured]`

**2. A comment anchor that survives the markdown-body ↔ rendered-text boundary in a mode-switching
editor.** This is a problem our own plan had not named and which we hit on day one, because the
mockups ship Live/Edit/Split/Read *plus* a comment rail. An anchor measured against the markdown
**body** cannot be applied to **rendered** editor text, and converting between them is unsound —
serialising a partial ProseMirror selection fabricates the block marker of whatever block the
selection happens to sit in, so a pick starting mid-bullet comes back with the wrong prefix.
OpenKnowledge had to write a third matcher with syntax-elastic matching plus a link-tail skip,
because otherwise a passage containing any link could not be matched at all — and in a linked wiki
that is most of the interesting passages. **Their solution is GPL-3.0: a design reference, not a
dependency.** No npm package solves it; `@codemirror/collab` (6.1.1) addresses operational transform,
not content-derived anchoring. `[primary]`

**3. A published false-positive rate for markdown re-anchoring.** Nobody publishes one. This is the
slot that survives the OpenKnowledge finding and it is worth more than the algorithm.

**4. A wikilink-tolerant YAML frontmatter parser.** `related: [[a]], [[b]]` is the Obsidian idiom and
it is not valid YAML — YAML reads `[[a]]` as a closed nested sequence. Measured on the pinned corpus:
**170 files fail to parse under `gray-matter`/`js-yaml`, and `eemeli/yaml` parses 0 of those same 170**
(the set overlap was measured; the failing sets are identical). One further file, `md/pj.md`, parses
cleanly and throws at stringify — so 171 path failures is **two** failure modes, not one. Rates by
root: **13.75% (91/662) of the Obsidian vault**, 35.59% (79/222) of the knowledge repo, 0% of the
frontmatter repo, **18.74% (170/907) across the pinned corpus**. `[measured]` *A widely-circulated
"18.9% of a real Obsidian vault" figure attaches the whole-corpus rate to the vault denominator; say
which number you mean.* Obsidian itself accepts these files. **Anyone claiming Obsidian round-trip
fidelity needs a parser nobody publishes**, and our read path currently degrades **silently** —
`markdown-parser.ts` catches and sets `fm = {}`, so tags, aliases and frontmatter wikilinks vanish
from search, the tag pane and the graph with no user-visible signal. `[primary]`

**5. Container round trip with edit mapping** — edit a DOCX- or PDF-derived document as markdown and
write the change back into the original container at the right offsets. The largest genuinely open
slot found in the sweep. The converter industry is enormous and **one-directional**:
`microsoft/markitdown` 170,545 stars, `docling` 64,082, `marker-pdf` 2.0.0 released 2026-07-20,
`mineru` 3.4.4 released 2026-07-30 — **not one of them writes back**. GitHub searches for the round
trip return `total_count 0` and 2 trivial repositories. `[measured]`

**6. Cache-aware document layout** — ordering and chunking a document set so a prompt-cache prefix
stays stable across edits. Effectively unclaimed at any level of adoption: the category leader,
`repomix`, has a `--token-budget` guard and per-glob inclusion levels, but its only file ordering is
a size-descending sort for **worker load balancing**, an internal scheduling concern. `[primary]`

**7. Near-miss reference checking** — a link that *almost* resolves, pointing at a renamed heading or
a filename one character off. Closest adjacent art finds near-duplicate *pages*, not near-miss
*references*.

**8. Onboarding a non-technical collaborator without an account.** Google solved it with anonymous
animals. Everyone in the markdown category either requires an account (us, under D3 as written;
Obsidian, which requires a paid Sync subscription per collaborator) or has no collaborators at all.
This is the gap most likely to decide whether the review loop is used or admired.

**A warning attached to this whole subsection.** GitHub **code search** was unavailable to the
researcher who produced most of these gaps — `search/code` returned `total_count 0` even for queries
known to match. Every "nobody has built X" here therefore rests on **repository and topic search plus
npm/PyPI/crates search**. Read each as *"not found by repository and registry search"*, never as
*"proven absent"*. The measured false-kill rate of the verifiers in this programme is 0–19%, so a
kill is strong evidence, not proof.

---

### 8.8 Defensibility — separating a LEAD from a MOAT, capability by capability

**Definitions, because the two words have been used interchangeably in this programme and they are
not the same thing.**

- A **LEAD** is time. It is measured in weeks or months, it decays whether or not you do anything,
  and it can be closed by any competent team that decides to spend the weeks.
- A **MOAT** is structural. It gets *harder* to cross as time passes — because a dataset compounds,
  because switching costs accumulate, or because a network effect exists per document.

**The headline finding, and it is uncomfortable: five of six engine capabilities are LEADS measured
in weeks. That research headline was itself judged OVERSTATED by its verifier, but the corrections
made it *worse* for us, not better.** `[measured]`

| Capability | Clone time for a competent team | What they need that is hard to get | Trend over time | Verdict |
|---|---|---|---|---|
| **Block / range re-anchoring** | ~1 weekend to 2 weeks | Nothing. Two public reference implementations now exist: Hypothes.is's own `match-quote.ts` (163 lines, MIT) over `approx-string-match@2.0.0`, and OpenKnowledge's `anchor.ts` (261 lines, GPL-3.0). The design is a W3C standard (TextQuoteSelector) with prior art to Microsoft Research MSR-TR-2001-107. | **Easier.** There was one readable reference; now there are two. | **LEAD, weeks** |
| **Splice-only writing** | ~1 day | Nothing. `mdast-util-from-markdown` — already a transitive dependency — hands you `node.position.offset`. The whole writer is four lines and is byte-identical on **1,080 of 1,080** parseable files. | flat | **Not even a lead — table stakes we currently fail** |
| **Budgeted projection** | hours | Nothing. Taken by `llms.txt` in September 2024: `AnswerDotAI/llms-txt`, 2,541 stars, created 2024-09-01, mentioned in 1,659 repositories. | taken | **TAKEN** |
| **Declared provenance** | — | Taken twice. Google's OKF SPEC.md v0.2 (37,544 bytes, `GoogleCloudPlatform/knowledge-catalog`, 8,134 stars) makes provenance, trust, lifecycle and attestation first-class in markdown + YAML frontmatter. C2PA has had a public specification since 2021-11-12. | taken | **TAKEN — with one narrow survivor, below** |
| **Near-miss reference checking** | ~1 weekend | Nothing found | flat | **LEAD, weeks** |
| **The (product, surface) degradation certificate** | a weekend for the code; the **dataset** is the asset | A continuously re-measured observation series against **closed** renderers, with dated snapshots. That is operational discipline, not an algorithm. | **Compounds slowly** — `github/markup` v5.0.1 (2024-06-17) → v6.0.0 (2026-05-05) proves the target moves | **WEAK MOAT — months of freshness** |
| **The review loop over files you own** | a quarter or more for a team that already has an editor | (a) a second-user system with enforced roles; (b) an anchor with a **published** false-match rate; (c) a clean-export guarantee anyone can verify | **Harder, but only after documents have two people on them** | **LEAD until the first shared document; then switching costs** |
| **Multi-tenancy / accounts / share links** | weeks | Nothing | flat | **A GATE, not a moat** |
| **Reputation: "has never corrupted a byte of your file"** | cannot be cloned; must be earned | A public, continuously-running byte-fidelity CI over a **public** corpus, green for a long time | **Compounds — and is destroyed by one incident** | **The only asset a weekend cannot copy** |

#### 8.8.1 Corrections that the research's own verifier forced, and which change the conclusions

These matter because the first draft of the defensibility case was wrong in specific, checkable ways.

1. **`dom-anchor-text-quote` is NOT in production at Hypothes.is.** The claim that our core mechanism
   is "182 lines of code shipping in production today" is false against the primary source:
   `hypothesis/client`'s `package.json` depends on `approx-string-match@^2.0.0`, with no
   `dom-anchor-text-quote` and no `diff-match-patch`; that package was last published 2017-02-10.
   And reading all 182 lines shows it never performs an exact match, never enumerates candidates,
   never scores them and has no AMBIGUOUS return — it is location-hinted fuzzy bitap, i.e. exactly
   the position-biased family our own measurements put at 22.20% false. **Consequence: do not vendor
   it.** The true reference implementation is `hypothesis/client`'s own 163-line
   `src/annotator/anchoring/match-quote.ts` — exact-first over all occurrences, then approximate
   search, then a weighted score (quote 50 / prefix 20 / suffix 20 / position 2, position explicitly
   commented as a tie-breaker). *It still has no AMBIGUOUS state: it sorts by score and returns the
   top match unconditionally.* **That absence is our differentiator.** `[primary]`
2. **"No prior art exists for the degradation certificate" is REFUTED** by one query the researcher
   did not run. `ArchieCur/MARKDOWN_FLAVORS` is a 14-flavour × 17-construct matrix shipping a CSV and
   a compatibility PDF; `babelmark` exists at 115 stars; 31 repositories sit under
   `markdown conformance`; and `mattcone/markdown-guide` (4,090 stars, created 2017-01-31, pushed
   2026-07-21) ships **70 tools × 28 constructs** with y/partial/no/unknown verdicts. `[primary]`
   **What survives is narrower and still real:** those 28 tracked construct ids contain **zero** of
   frontmatter, wikilink, callout, mermaid, math, directive, attribute or embed — while **90.5–90.8%**
   of the pinned corpus carries at least one of them — and the 70 tracked tools include **no**
   `github.md`, `gitlab.md`, `confluence.md`, `teams.md`, `discourse.md` or `jira.md`. `[measured]`
   The novel slice is therefore **(product, surface) scoping + executable PASS/STRIP/CORRUPT +
   expiry**, not "a compatibility matrix".
3. **OKF does not take all of provenance.** `grep -ic confidence` over the 37,544-byte specification
   returns **0**, and §5.1 states that it deliberately does not store a credibility score. So
   document-level provenance is taken; **per-span source/method/confidence is not.** Emitting OKF's
   fields verbatim would silently descope that. Do it deliberately or not at all. `[primary]`
4. **"The only durable moat is multi-tenancy" was killed.** It carried zero evidence across ten
   claims and — as the verifier put it — accounts, workspaces and role-enforced share links are the
   most commoditised layer in SaaS. **Multi-tenancy is the gate on everything (K7) and is worth doing
   first for that reason. It is not a moat. Do not sell it as one.**
5. **The corpus is 65 days old, not 80.** First commit 2026-05-13, last 2026-07-17, verified with
   `date -j`. An 18.8% overstatement in the flattering direction. And the "1,000× the bytes" claim
   for public corpora compares GitHub's `size` field — repository disk usage in KB including packed
   history and binaries — against 25,548,765 bytes of plain markdown. The arithmetic is right; the
   units are not. `[measured]` **There is no corpus moat.** `MicrosoftDocs/azure-docs` (created
   2016-11-02), `mdn/content` (over 14,000 pages) and `kubernetes/website` are one `git clone` away
   and give a competitor a larger, older, **multi-author** anchoring corpus for free, against our
   416 commits by exactly one author.

#### 8.8.2 How fast a clone actually arrives — the measured base rate

`scaccogatto/okf-skills` was created **2026-06-14T11:15:31Z**, roughly **one day** after Google
Cloud's OKF announcement of 2026-06-13. It now has 206 stars, 22 forks and 32 commits. A GitHub
repository search for the exact phrase "Open Knowledge Format" returns `total_count` **287**, windowed
by creation date: `[measured]`

```
2026-06-13 .. 2026-06-20    69 repos     (the first eight days)
2026-06-21 .. 2026-06-30    66
2026-07-01 .. 2026-07-15    89
2026-07-16 .. 2026-08-01    59
```

**And the part nobody wrote down until the verifier found it:** the same eight days produced
**product** competitors, not just convention wrappers — `activetwist/OnyxWriter`, a local-first
editor for OKF bundles, and `pothos-dev/sunstone`, a lightweight markdown editor with first-class OKF
support. `[measured]` **Empirical clone latency for a published convention is under 24 hours, and the
ecosystem produces roughly 70 independent implementations in the first week — including direct
product competitors.** Plan the public artifacts accordingly: **publish the certificate's dataset
before, or instead of, the certificate's design.** The design is a weekend. The dated observation
series is not.

#### 8.8.3 Answering the Obsidian argument

The strongest argument against everything in this plan is: *the best-resourced actor in the ecosystem
faced exactly these gaps, and its answer was to ship sidecar files — twice. Why would our answer be
different?*

**The premise is true and must be conceded.** `[primary]`

- **JSON Canvas** (`obsidianmd/jsoncanvas`, created 2024-02-28, 3,632 stars, spec 1.0 dated
  2024-03-11) is a new file format for infinite-canvas data. That is a true sidecar for something
  markdown structurally cannot hold — **spatial arrangement** — and this plan already concedes
  it was the right call.
- **Bases** is Obsidian's core answer to typed relations and queries (i.e. to Dataview, at 4,669,090
  downloads). It ships a `.base` file.

**But the second example cuts the other way, and this is the answer.** Obsidian's own documentation
states that **all the data in Bases is stored in your Markdown files and their properties**; what
lives in the `.base` file is the **view definition** — and that view definition can *alternatively*
be embedded in a fenced ` ```base ` code block **inside a `.md` file**. `[primary]`

That is **decision D8 — extensibility lives in the VALUE of a field, never in the SET of node types —
validated by the best-resourced actor in the ecosystem.** Obsidian shipped exactly **one** true
sidecar, for the one thing markdown genuinely cannot carry, and kept everything else in the
markdown files.

**A third Obsidian datapoint, and it is the one that most directly competes with us.** Obsidian's
answer to block identity was to write a **declared** id **into** the markdown — `[[2023-01-01#^37066d]]`
— the exact opposite of a derived anchor, shipped since 2020 and autocompleted on a keystroke.
Measured on the pinned corpus: **0** `^blockid` declarations across 1,084 files, and **0** headings
carrying a `{#id}` attribute. `[measured]` *(The denominator for headings does not reproduce: a
widely-quoted "31,630 ATX headings" comes out at 28,194 under an mdast parse, 28,158 under a regex
excluding fenced code and 31,983 including it. The numerator — zero — reproduces under every
definition, so the finding survives and the ratio does not.)*

**That zero cuts both ways and both cuts matter.**

- **For us:** the "a competitor just declares ids and wins" threat has **no observed adoption**
  whatsoever.
- **Against us:** a mechanism the market leader has shipped for six years, and which costs one
  keystroke, was used **zero** times in a 756-file vault. **That is evidence that authors do not feel
  block-identity pain. Only the app feels it.** Which is precisely why block identity is
  infrastructure for the review loop, and must never be marketed as a feature.

**And the market history is the closer.** The category winner was **not first** — Obsidian launched
in 2020, after Ulysses, iA Writer, Bear and Roam, and simultaneously with Dendron — and its
fastest-moving repository is its **plugin registry**: `obsidian-releases`, 20,328 stars, 1,934 commits
in 52 weeks with **1,181 of them in the last 13** (a 3.5× acceleration) in a repository whose only job
is accepting third-party plugins. `[measured]` **The winner won on a distribution channel and a
business model, not on format capability. Nothing in this section should be read as promising
otherwise.**

#### 8.8.4 The honest summary of defensibility

**RECOMMENDED, stated plainly so nobody has to infer it:**

1. There is **one weak moat** (the certificate's decaying dataset, worth months of freshness, and
   only while continuously re-measured), **one switching-cost moat that does not exist yet** (shared
   documents with threads), and **one brand asset** ("has never corrupted a byte", earned by a public
   green CI over a public corpus).
2. Everything else is a lead of days to weeks.
3. **Today the lead is zero**, because there is no engine code at all.
4. Therefore the defensible plan is **not** "build a better algorithm". It is: get to two users, get
   documents with threads in them, publish a false-match rate nobody else publishes, and never
   corrupt a byte.

---

### 8.9 The give-away half, treated as a distribution budget

The founder's constraint is that helping is 50% of the point. **DECIDED: treat that as a distribution
budget, not a sentiment — and recognise that half of it is already spent.**

**Free git-backed sync IS the give-away.** The user's own repository is the backend, marginal cost is
approximately zero, and it undercuts every $4–10/month sync add-on in the category. That is the
expensive half of the 50%, and it is already committed in the pricing table.

**DECIDED: cap the second give-away at one artifact, two days, one channel, one kill number.**

- **Artifact:** `mdmax cert` (specified in the engine section) — and nothing else. Not a conformance
  suite *and* a hostile-input corpus *and* a benchmark *and* a matrix. One.
- **Two days.** A working five-configuration prototype was built in a single script against packages
  **already in this repository** with no `npm install`, and an independent verifier rebuilt it from
  scratch and reproduced every headline verdict. `[measured]` The cost is the **target harness**, not
  the code. If it balloons past two days, the cost has moved to the targets and the cap has been hit.
- **One channel.** See §8.10.
- **One kill number:** K5 — fewer than 5 of 30 probed users say they would install it → cut it.

#### 8.9.1 The base rate, given honestly

Of the free artifacts checked, **2 of 9** produced an organic commercial entity for the giver — and
"base rate" is the wrong term for nine self-selected repositories, so read it as a sample, not a
population. `[measured]` *(An earlier draft said "2 of 11"; its own evidence enumerated nine. 2/9 =
22.2%, not 18.2%.)*

- **markdownlint** — the artifact closest in kind, a free markdown quality tool by a solo maintainer —
  repository created **2015-03-15**, i.e. **11 years 4 months**, now at **2,886,431 npm downloads/week**,
  with a `FUNDING.yml` that reads exactly `github: DavidAnson`. **Zero dollars.**
- **mermaid** — the best outcome in the set — npm package created 2014-12-02, commercial organisation
  Mermaid-Chart created 2022-11-07. **95 months = 7 years 11 months.** And its monetisation is
  enterprise placement (Jira, Confluence, IntelliJ, VS Code plugins), not selling the free thing.
- **No commercial entity:** prettier, `DavidAnson/markdownlint`, editorconfig, semver,
  `commonmark/commonmark-spec`, repomix, `AnswerDotAI/llms-txt`.

**Two founders with no README, no public repository and zero users cannot spend an eight-year option.**

#### 8.9.2 The revealed-demand warning, and a unit contradiction you must resolve before quoting it

`curran/llm-code-format` v3.1.0 (published 2025-09-20, zero dependencies, TypeScript) already ships
the exact round trip this programme called unclaimed — source to markdown to LLM and back — exposing
`parseMarkdownFiles` and `formatMarkdownFiles`, a streaming parser, and recognition of nine LLM output
conventions.

> **llm-code-format: 387 downloads/month. repomix: 327,543. A ratio of 846:1 against the round trip.**
> `[measured]`

**Contradiction, named as required.** Two later restatements of this figure in the research record say
"downloads/**week**". The original measurement says "downloads/**month**", and monthly is the reading
that is arithmetically consistent with the independently verified `repomix` figure of **75,342
downloads/week** (75,342 × 4.35 ≈ 327,738). **The monthly reading governs.** The ratio — which is the
load-bearing part — is unaffected either way.

Corroborating: `repomix` issue #71 (file splitting) has been open **23 months** and its own
effectiveness check failed in the contributor's words; issue #226 (unpack) has **0** reactions after
19 months. **The round trip is not unclaimed. It is claimed and unwanted.**

#### 8.9.3 What must NOT be given away, and the three ways the give-away can go wrong

**Do not publish the anchoring benchmark before kill gate K3 closes.** Nobody has re-derived the
99.627% figure; it is a block-level number that does not transfer to ranges; K2/K3 commit us to
publishing whatever comes out including a worse number; and there is no prior benchmark to be
compared against, so publishing is pure downside with no category to win. `[measured]`

Three ways this backfires, all real:

1. **Publishing a matrix that mostly shows AGREEMENT markets against the thesis.** A five-configuration
   replication found disagreement in only 2 of 15 constructs; an independent rebuild got 3 of 15.
   Both samples are JavaScript CommonMark-descended libraries, which is *one language's corner of one
   ecosystem*, and the wider 24-configuration finding — the HTML comment alone producing 8 distinct
   outputs, with GitHub's blob view deleting it — shows the real spread lives at the product/surface
   layer. **The differentiating cost is the target corpus and the non-JavaScript engines, not the
   code.**
2. **A published machine-readable (product, surface) × construct matrix is a specification for the Max
   tier's differentiator, given away free** to HackMD, GitHub, Obsidian and every agent-tool author in
   a directory that currently holds 12,804 repositories under `topic:agent-skills`.
3. **Producing a public good is the failure mode the "what we got wrong" list already diagnosed —
   *"the document became the product"* — wearing a growth hat.** Four artifacts that can be *written*
   rather than *shipped* are indistinguishable from the disease at the moment of authoring them.
   The standing rule in "how we work now" governs: no further research fan-out until one committed
   assertion has gone red to green against engine code.

#### 8.9.4 One demo correction that would otherwise sink the launch

The proposed 30-second demo was "drop in your own README and see what breaks". **Its verifier refuted
the transfer claim directly:** it fetched 40 READMEs from major repositories via `api.github.com` —
including the markdown ecosystem's own (`marked`, `markdown-it`, `remark`, `unified`, `mermaid`,
`pandoc`, `commonmark-spec`, `markdownlint`, `hugo`, `jekyll`, `docusaurus`, `mkdocs-material`) — and
found **0 with YAML frontmatter and 0 with a wikilink** (all three `[[` hits were false positives on
link syntax and a JavaScript array). `[measured]`

The 83.67% / 56.75% frontmatter-prevalence rates come from two populations where frontmatter is
**structurally mandated** — an Obsidian vault (the properties UI writes it) and Claude Agent Skill
files (the format requires it) — so they do not transfer to a README.

**DECIDED: the demo input is "your note or vault file", not "your README".** A visitor dropping in a
README would see a tool whose pitch is "see exactly what breaks" report that nothing breaks. That is
the worst possible first impression.

---

### 8.10 Positioning and distribution

#### 8.10.1 The one sentence, and why it is not the USP sentence

| audience | sentence |
|---|---|
| **The product, to a user** | **"Your vault, in any browser. Nothing to install."** |
| **The product, to an investor or a partner** | "Google Docs for markdown, as simple as that." (the founder's own words) |
| **The free tool** | "Paste a markdown file. See exactly what breaks on GitHub, in Obsidian, and in an LLM's context — before you publish it." |

The lead sentence targets ranks **9 and 1**, not rank 13. The USP sentence describes rank 6. They are
different sentences on purpose: the review loop is what we *sell* and what defends us, but browser
access is the pain the market has been shouting about for six years and the one the existing codebase
already answers.

**A hard constraint on the wording.** Obsidian's community Code of Conduct requires an
"integrates-with-your-vault" framing rather than an "Obsidian competitor" framing, and the norm in its
forums is to participate more than you promote. **The only admissible framing in the largest watering
hole is: *your Obsidian vault, editable anywhere on the web — plain markdown in, plain markdown out.***
Breaking that gets the launch removed, not criticised.

#### 8.10.2 Who it is for

**DECIDED — two beachheads, everyone else explicitly ignored with a written revisit trigger.**

**Beachhead #1 — Obsidian power users, specifically the blocked-at-work and git-vault sub-segments.**
Largest verified pain signal in the corpus; cheapest reach (the exact askers are enumerable); exact
product-shape match with zero missing features for the core job. Willingness to pay is **moderate**,
band **$2–6/month**. Honest caveat: this segment skews free-first — treat it as an acquisition and
evangelism engine more than a revenue engine.

**Beachhead #2 — content creators and git-blog publishers.** Second-best fit today because publish
already ships; the sharpest daily-loop pain; heavy overlap with beachhead #1 (same vault, same
repository, same forums — one go-to-market motion serves both); and **every converted user publishes
a public site that markets the product**. `digitalgarden` at 84,873 downloads is the direct intent
proxy. `[measured]`

| Segment | Status | Revisit trigger |
|---|---|---|
| Non-technical normals | **Ignore indefinitely** | WYSIWYG + Apple/Google signup with an invisible repository + native-grade mobile real-time, all shipped |
| Writers & editors | Ignore | Suggestion mode with accept/reject + no-login commenter links + clean `.docx` export ship |
| Students & academics | Ignore as revenue | Collaboration ships, plus citations (Zotero/BibTeX) and equation numbering; then a `.edu` free tier as a growth loop |
| Small teams / startups | Ignore | Real-time co-editing **and** inline comments ship — highest ARPU in the corpus |
| Developers / docs-as-code | Seed awareness only | Same trigger. **This is the per-seat revenue engine.** Cautionary: Dendron failed selling to *solo* developers; the money is teams |
| Notion / Evernote refugees | Ignore | WYSIWYG + a browser-based importer with a verification report ("536 in, 536 out"); then ambush the next incumbent price-hike news cycle |

#### 8.10.3 The proof point in the first thirty seconds

**The demo is the visitor's own vault, not a marketing page.** In order:

1. **Open their repository in the browser.** No install, no server, no VNC.
2. **Their own notes render correctly** — wikilinks, frontmatter properties, callouts, transclusion,
   KaTeX, Mermaid. The segment study is explicit that they judge in the first minute on their own
   vault, and any dialect breakage means instant rejection as "just another markdown editor".
3. **Edit one line and show the diff is clean** — one line changed, frontmatter untouched, key order
   preserved, YAML comments intact.

**Step 3 is the whole engine's public face, and today it fails.** Until the splice writer lands, a
publish rewrites 84.78% of parseable files' dates and leaves only 1.87% byte-identical across a
publish/unpublish round trip. **The demo cannot be given before §8.5 item 6 is fixed.** That is the
strongest possible argument for sequencing the splice writer into the first week.

#### 8.10.4 How a markdown tool actually gets discovered in 2026

**RECOMMENDED, in this order.** The evidence says the agent-tool surface has replaced Show HN as the
distribution channel for a markdown CLI, and that the product and the tool have different channels.

1. **The exact threads where the askers already are.** `forum.obsidian.md/t/obsidian-for-web/2049`
   (244 posters, the warmest leads on the internet), the Share & showcase category, and the
   `obsidian-git` issue threads. First move: a working demo link and a 60-second recording, framed as
   a workflow post.
2. **A companion Obsidian plugin**, submitted as a pull request to `obsidianmd/obsidian-releases`,
   then announced in the sanctioned Discord channel. **Precedent: Relay, a commercial collaboration
   service, distributed exactly this way and reached 176,247 cumulative downloads.** `[measured]`
   *(The field is `downloads`, cumulative across versions — not "installs".)* Comparable:
   Self-hosted LiveSync 829,285; Readwise 238,596; digitalgarden 84,873.
3. **The agent-tool directories, for `mdmax cert` only.** Ship it three ways from one binary, because
   `repomix` has already proven the packaging: `npx mdmax cert <file>`; `--mcp` so an agent can call
   it mid-edit; `--skill-generate` producing a Claude Agent Skill; plus a GitHub Action that fails a
   pull request when a README construct will CORRUPT on Pages. The directory is enormous and less than
   a year old: `topic:agent-skills` = **12,804** repositories, leader at 165,486 stars;
   `topic:claude-skill` = 4,043. `[measured]` **Not a website** — that is markdownguide's game and
   they have nine years of search-engine authority.
4. **Show HN last, framed as the product, not the tool.** The ceiling for a markdown-editor Show HN is
   ~240–471 points (OverType 471, an open-source collaborative WYSIWYG markdown editor 460, Ferrite
   241); Obsidian's own Show HN at 1,087 and Canvas at 1,380 are the absolute ceiling and they are a
   *product*, not a tool. **And points do not predict adoption:** `llms.txt` scored **206** points and
   is now in 9,640 GitHub code-search hits. `[measured — read as ordinal only; GitHub code search
   indexes a subset of repositories and caps estimates, so these counts are severe undercounts]`

#### 8.10.5 Pricing, restated with its anchors

| Tier | What | Price | Anchor, verified live 2026-08-01 |
|---|---|---|---|
| Free | browser vault + git sync + publish + the CLI | $0 | Marginal cost ≈ 0. *"Free sync. It's just git."* |
| **Pro** | unlimited documents, live editing, AI credits | **$4/month billed annually** | Exact parity with Obsidian Sync Standard ($4/user/month annual, $5 monthly); inside the forum-stated $2–4 band |
| **Work** | same, expensable | **$50/user/year** | Mirrors Obsidian Commercial ($50 USD per user per year) — aimed at the population rank 9 defines |
| **Teams** | the review loop, seats. *Not this cycle* | **$5–8/seat/month** | Under HackMD Prime ($5/seat/month annual, 3-seat floor); far under Notion Business ($20/member/month) |

**Owner and editor seats bill. Commenters do not.** That single rule is what makes the review loop a
growth mechanism rather than a seat tax, and it is why the D3 tier-split decision is on the
critical path for revenue, not just for user experience.

---

### 8.11 What this section does NOT cover, and what would falsify it

**Required by the standard: a section that only argues its own case is marketing.**

#### 8.11.1 What is missing from the evidence base

1. **Zero users. Zero interviews. Zero willingness-to-pay probes.** Across roughly a million bytes of
   design and 16 research areas, no one has spoken to a prospective customer. Every price in §8.10.5
   is anchored to a **competitor's pricing page**, not to a probe. This is the single largest hole in
   the market analysis and no amount of corpus work closes it.
2. **Market sizing is unusable.** Four firms give 2025 note-taking market sizes of $1.18B, $1.35B,
   $11.02B and $17.19B — a **10× divergence**. `[secondary, self-tagged unverified]` **No claim in
   this section depends on it.** Do not put a market size in a deck.
3. **No live model call was made in any research run.** Every "easier for AI" statement in this
   programme is a prediction.
4. **The flagship 99.627% anchoring figure has been re-derived by nobody**, including every area that
   quoted it, and it is a block-level figure that does not transfer to ranges.
5. **Seven irreproducible corpus counts** were reported before the corpus was pinned. Any figure about
   local files that does not cite the corpus id is suspect; several such figures were quietly
   corrected during verification (the 80-vs-65-day corpus age, the 31,630 heading denominator, the
   "612 files" sub-claim which is actually 0, the "127 open issues" which exceeds the repository's
   all-time issue count of 97).
6. **The competitive sweep's method is known-broken.** It found its own most important item via a
   six-week-old Show HN post rather than through any of its registry or topic queries. **Replace
   registry sweeps with a watch on named application changelogs and merged-PR feeds** —
   `inkeep/open-knowledge`, `iwe-org/iwe`, `yamadashy/repomix`, `mdbase-dev/mdbase-spec`, `obsidianmd`,
   `GoogleCloudPlatform/knowledge-catalog`, `markdown-it`, `marked`.
7. **Verifier false-kill rate is 0–19%.** Several kills quoted in this section are strong evidence, not
   proof. Where a kill looked wrong it is flagged in place (the `.doc` export label is the clearest
   example — the kill was itself killed, correctly).
8. **Not covered here at all:** legal and licensing exposure (GPL-3.0 clean-room boundaries need a
   lawyer, not a researcher — see §8.11.3); enterprise procurement, SOC 2 or data-residency; regional
   or purchasing-power pricing beyond a note that the segment study recommends it; and any
   channel-partner or reseller motion.

#### 8.11.2 What would falsify this section

| # | If this happens | Then |
|---|---|---|
| F1 | A probe of 30 users returns fewer than 8 naming the review loop as a reason they would pay, and more than 20 naming browser access or sync trust | The USP in §8.1 is wrong as a *purchase* driver. Keep the review loop for defensibility; lead and price on Wedge A. |
| F2 | inkeep/open-knowledge — or anyone — ships **teammate** comments in a stable release | The intersection closes. The USP becomes "the one that keeps files plain and publishes its false-match rate", which is a much weaker sentence. Re-plan within the week. |
| F3 | The range resolver's hand-audited false-match rate exceeds ~0.5% (**K4**) | Comments cannot use it. Fall back to quote-plus-digest with visible orphaning, and the review loop ships with a visible orphan rate as a product metric. |
| F4 | Obsidian ships a web application | Wedge A collapses to a feature. The review loop becomes the only differentiator overnight, before it is built. |
| F5 | No second GitHub login has written to a document by 2026-08-31 (**K1**) | This is a library, not a company. Say so out loud. |
| F6 | Fewer than 5 of 30 probed users would install `cert` (**K5**) | Cut the give-away entirely and put the two days into the second user. |
| F7 | A third party ships a target-scoped markdown conformance matrix before we do | Given a measured clone latency under 24 hours, assume this is possible the week after we describe the idea in public. **Corollary and standing rule: do not publish the certificate's design before its dataset.** |
| F8 | The head-to-head puts a clean-room reimplementation of OpenKnowledge's published behaviour within 0.5 percentage points on false rate and 3 points on correct rate | The algorithm is a commodity a competitor gives away under GPL. The moat must be the multiplayer loop plus the published measurement — never the resolver. |

#### 8.11.3 One process risk that belongs in this section and nowhere else

The research record now **quotes GPL-3.0 source verbatim and at length** (`anchor.ts`,
`anchor-search.ts`, `thread-store.ts`) while simultaneously mandating that any implementation be
specified from *published behaviour, never from their source*. Those two facts are in tension. **Before
any implementation of the resolver begins, write down a provenance boundary:** which artifacts an
implementer may read, and a behaviour-only specification derived by someone who has **not** read
`anchor.ts`. This is a process risk, not a research error, and it is the kind of thing that is cheap
now and expensive later.


---

---

### Links

**This section references:** [§0 Status](00-status.md) · [§1 Orientation](01-orientation.md) · [§5 Rendering](05-rendering.md) · [§7 Product](07-product.md)

**Referenced by:** [§0 Status](00-status.md) · [§2 Chronology](02-chronology.md) · [§7 Product](07-product.md) · [§9 AIOS](09-aios.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
