---
title: The frontmatter engine — what we are building, why, and how we will know it works
status: master document
version: 1.0.0
date: 2026-07-30
audience: Sagnik, and anyone joining cold
relationship: this is the front door. `PLAN.md` (v0.6.0, §0–§17) is the technical design of record
              and holds every measurement. Where they differ, PLAN.md governs the engineering and
              this document governs the framing.
---

# The frontmatter engine

> **One sentence.** A markdown compiler whose unit is the **block**, where a block keeps a durable
> identity across the git boundary, the source is never regenerated but only **spliced**, and the
> file on disk stays ordinary `.md` that every other tool in the world can still read.

Everything below follows from that sentence, and every number in it was measured rather than
assumed.

---

# Part I — What this actually is

## I.1 Two products, one word

| | |
|---|---|
| **frontmatter, the engine** | a standalone markdown compiler. A library and a CLI. **This document.** |
| **frontmatter, the editor** | the app. A separate track, currently a clone of `md`. |
| **The relationship** | the engine is the editor's backbone. The editor is its **first consumer, not its host**. |

The test that keeps this honest: **the engine must be useful with no editor at all.** If it is not
useful as a CLI in someone else's CI, it is not a compiler — it is a feature wearing a compiler's
name.

The word `frontmatter` names both because it names the primitive the whole thesis rests on.

## I.2 The new thing we are discussing

Three things, and they compound. Only the first is genuinely without precedent.

**1. An anchor that survives the git boundary.** Every serious document system solved block
identity — and every one solved it using a property we do not have:

| system | anchor | survives an out-of-band edit? | why it works for them |
|---|---|---|---|
| Word | zero-width sentinel pairs | yes | the artifact is XML; an invisible marker is free |
| Notion | a UUID on the block | yes | the artifact is a database |
| Overleaf | integer offsets in an OT sidecar | **no** | they own *every* write to the `.tex` |
| ProseMirror / CM6 | offsets remapped through a change map | **no** | the remap needs the op that caused the change |

Overleaf is the only published system with our exact constraint — the artifact must stay a plain
text file an external tool can read — and it survives only by owning every mutation. **We cannot.**
`git pull` yields a new string with no op stream. A `vim` edit yields no op at all.

So we use a fourth strategy nobody above uses: **content-derived re-anchoring**. It is specified,
swept over 384 parameter configurations, measured on 41,642 real block-versions, and hand-audited.

**2. A notation that is declared, not invented.** Your instinct — *"we can define structures within
Markdown; maybe only the frontmatter will know what it means"* — turned out to be the correct shape,
and the research changed our answer to it twice. It works. But it works under three hard rules
(Part IV.4) that are the opposite of what the naive design would do.

**3. Diagnostics no HTML-level tool can see.** This is the newest finding and the clearest moat.
Measured: **axe-core fires 7 of its 105 rules** on 2,286 real markdown files, and **98.5% of 11,695
violations trace to two causes in page chrome**. Every *content-level* markdown defect scores zero —
not because the defects are absent, but because markdown's grammar cannot emit the HTML shapes axe
knows how to fault. `![](x)` compiles to `alt=""`, which is *valid*; it asserts "decorative". **A
green accessibility report on markdown is a false green**, and only a markdown-aware compiler can
see through it.

## I.3 What this is NOT

Settled by measurement, recorded so it is not re-litigated:

- **Not a new format.** MDX has Vercel and reaches 3.07% of `.md` volume. Markdoc has Stripe and
  reaches 0.136%. djot has CommonMark's own author and does 693 downloads/week against
  remark-parse's 45,731,168 — a gap of **65,990×**.
- **Not a new dialect requiring its own parser.** The formal reason is stronger than the adoption
  reason: a `.md` file is a finite ordered tree over a **closed 21-label alphabet**. It cannot carry
  types, identity, null, or **any edge that is not parent-child**. That is the tree/graph boundary,
  not a syntax gap a dialect could close.
- **Not a runtime.** The moment the engine needs an interpreter to read a file, it is MDX.
  TypeScript never touched JavaScript's runtime; it only added checking. That is the model.
- **Not PKM positioning.** The demand evidence says the validated market is **feeding machines**,
  not sharing notes (Part II.3).

---

# Part II — What we have researched

## II.1 Scale

~14M subagent tokens across ~90 research agents, ~20 local experiments, and a six-area utilization
sweep — all against live libraries and three real corpora: `md` (4,117–4,244 files), `knowledge`
(272–410), and this repo (52). Every headline number was re-derived in the main loop before being
written into PLAN.md; several agent claims were **corrected** by that re-derivation, and those
corrections are recorded rather than quietly fixed.

## II.2 What is now settled by measurement

**Splice-only writing is a theorem, not a preference.** Foster et al., TOPLAS 2007, Lemma 3.9: a
total well-behaved lens whose `put` ignores the original source requires `get` to be a bijection.
"Regenerate from the AST" is definitionally such a lens. Measured: **443 of 655 CommonMark spec
examples are two distinct source strings with a byte-identical AST**. A zero-edit AST round trip of a
real 206 KB document rewrites **24.98% of lines and drops 18.94% of bytes**. **0 of 51 files** in
this repo survive `parse → stringify` byte-identically. This is mathematically excluded, not a bug to
tune away — and it is a live product hazard: DesktopCommanderMCP issue #440 (2026) documents an AI
tool silently rewriting users' `.md` through ProseMirror, **firing on read-only operations**.

**The anchor works, and the numbers are specific.**

```
resolve(block i, new document) -> index | AMBIGUOUS | LOST
  gate:  anchorable(i)?  else NO_IDENTITY        # 14.2% of blocks have no identity
  S1     exact: blake2b-64 over normalize(text)  → resolves 87.0%
  S2     several exact matches: score by soft context; unique argmax > 0, else AMBIGUOUS
  S3     no exact match: candidates share a 3-gram shingle; jaccard >= TAU;
         score = jaccard + W*softctx;  top1 - top2 <= DELTA -> AMBIGUOUS
  anchorable = not a rule, not punctuation-only, >= 3 tokens
```

| scheme | correct | **false match** | safe refusal |
|---|---|---|---|
| byte offset | 36.93% | **62.12%** | 0.95% |
| block index | 44.43% | **55.50%** | 0.08% |
| content hash alone | 83.36% | 0.00% | 16.64% |
| rigid context fingerprint k=1/2/3 | 90.65 / 88.68 / 87.22% | 0.25% | 9–13% |
| **ours, anchorable blocks only** | **99.627%** | **0.050%** | **0.323%** |

~41 ms for a 446 KB / 2,225-block document. Three results overturned our own earlier design: rigid
context fingerprints get *worse* as k grows; content-defined chunking is the wrong granularity;
and **every position-based tiebreak made things dramatically worse** (content-hash + nearest-position
goes 0.00% → 22.20% false). **Refusing is cheap. A silently wrong anchor is not.**

The `anchorable()` gate is the highest-leverage line in the design — it moves false matches
0.349% → 0.050%, because **88.9% of raw false matches are `---` horizontal rules.**

**All 14 false matches were hand-audited, not sampled.** 4 are oracle artifacts, 6 a bulk
markdown→HTML migration, 3 list drift, 1 a table rewrite. Genuine substantive errors: **10 in
28,170 = 0.036%.**

**The carrier is decided by experiment.** A naive inline trailing anchor destroys **100% of fenced
code blocks**, 150/150 thematic breaks, 74/74 tables. Inline for prose but **blank-line-isolated for
code, tables, rules and HTML** corrupts **0 of 1,765**.

**And carrying the anchor is necessary, not sufficient.** An LLM rewriting a block preserved its
anchor **10.0% of the time unprompted, 86.7% when instructed**. Even at 86.7%, **1 write in 7 is
wrong** ⇒ the editor must re-anchor **mechanically** on every write, never trust the model.

**The container costs +0.99%.** 6 real files, 62,690 → 63,310 bytes, 6/6 recovered byte-identical,
12/12 delimiters surviving a round trip. HTML comment is the delimiter, decided by a specific
measurement: with no blank line before it, an HTML comment **interrupts a paragraph and the boundary
survives**; a link reference definition is **swallowed and the boundary is silently lost**.

**Markdown is not intrinsically worse than code for merging** — this corrected our own v0.2 claim:

| corpus | all lines unique | **non-blank lines unique** |
|---|---|---|
| markdown (`md`) | 64.6% | **84.8%** |
| markdown (`knowledge`) | 68.4% | **94.2%** |
| TypeScript | 70.6% | 78.1% |

Excluding blank lines, markdown **beats** TypeScript. Blank lines are the entire deficit.

## II.3 What the demand evidence says

| lane | evidence |
|---|---|
| **LLM context** | ~16 independently-built tools; repomix 27,491★ + gitingest 15,249★ = **42,740★** |
| **PKM / vault sharing** | *"Is there a place where people share vaults?"* — **score 12** |

**The validated market is feeding machines, not sharing notes.** And the unclaimed part is the
**round trip** — repomix, gitingest, files-to-prompt, code2prompt, bundle-md, stitchmd are **every
one one-way**, while the highest-leverage ask in the whole sweep is its dual: *"map changes in the
concatenated file back to the original files."* That is Volar's offset mapping pointed at the
container. One mechanism, two features.

**The wedge, from the incumbent's own source.** Obsidian's `processFrontMatter` destructively
rewrites frontmatter — strips quoting, **deletes YAML comments outright**, destroys explicit type
tags. Their own type declaration:

```typescript
export interface FrontMatterCache { [key: string]: any; }
```

Every property in every note, in the market-leading markdown app, is `any`. Demand ratio: Dataview
**4.6M** downloads against the best frontmatter validator at **2,000** — 2,300×. Obsidian has
publicly declined to fix it. **A frontmatter editor that splices YAML in place, preserving comments,
quoting, tags and inline-flow form, is a Phase-1 differentiator the incumbent has refused to build.**

## II.4 The six-area utilization sweep (2026-07-30)

Six independent deep sweeps. Two changed what gets built; four changed how it must behave.

**Construct frequency.** 95% of real markdown is **10 constructs**; 99% is 16. Code spans are the
**#2 construct overall**, bigger than headings or lists. TOML frontmatter: **zero of 42,643 files**.
The extension surface is ~8 mutually incompatible ecosystem dialects, with GFM callouts
(`> [!NOTE]`, 24/40 repos) the only cross-ecosystem one.

**Plugin ecosystems, read as revealed preference.** 6,047 Obsidian plugins, 132,834,339 cumulative
downloads. Classifying the top 300 (83.9% of all demand):

| gap class | share of demand |
|---|---|
| **FORMAT — markdown cannot express it** | **40.1%** |
| RENDER / ERGONOMICS | 9.4% |
| APP (editor behaviour) | 31.0% |
| EXTERNAL (sync/AI/import) | 19.5% |

**Two-fifths of revealed demand is markdown failing to express something**, and the app column is
*smaller* — the opposite of "markdown is fine, the apps are limited." It replicates on three
populations sharing no mechanism: plugins 40.1%, forum feature requests 39.0%, VS Code extensions
35.4%.

**The causal evidence is Logseq.** Its format natively has block IDs, properties, a query language,
task states and SRS. Obsidian has **70 spaced-repetition plugins; Logseq has 2**, and both are merely
Anki bridges. Query 46 vs 20. Tasks 149 vs 30. Kanban, which neither format helps: 63 vs 6. Logseq is
a *worse app*, yet every cluster matching a native format feature is **10–35× smaller**. **When the
format absorbs a capability, the plugin cluster collapses.**

**Security.** 76 payloads × 9 renderer configurations = 684 runs, DOM-verified. The CommonMark spec
has **no security section** — six lines total, all about `U+0000`. `marked` with default options
scores identically to no sanitizer at all. Our own pipeline: **EXEC=0** end-to-end, but four
confirmed gaps and one that goes live on publish.

**Accessibility.** The axe-core blindness result (I.2), plus its cause: markdown's grammar cannot
express the distinction. And the sharpest constraint the whole sweep produced — a heading check fires
on **81% of files and is false at publish scope**, because the `<h1>` is injected from frontmatter.
**Structure diagnostics are only sound against the composed outline, never the file.**

**Internationalization.** The most consequential single confirmation in the project: `NFC`
**decomposes** Bengali `ড়`/`য়`/`ঢ়` (composition exclusions), so "just normalize everything" rewrites
**77 of 437 lines** of a real poem file — measured independently, arriving at the rule PLAN.md
already stated from the opposite direction. Also: markdown's link syntax is built **entirely from
bidi-mirroring neutral characters**, so RTL source visual order cannot be made to match logical
order — a structural limit of the format, not an implementation bug.

## II.5 The five times research overturned our own position

Recorded because a plan that never contradicts itself was never tested.

1. **"No new extension mechanism"** → refuted. Fence dispatch is real, permissionless, and
   validated across 30 uncoordinated platforms. §10 called a positive result negative.
2. **"Rigid context fingerprint, k=2"** → refuted by the sweep. Score context *softly*.
3. **"Markdown merges worse than code"** → refuted. Excluding blank lines it merges better.
4. **"Entropy floor" explanation for token cost** → refuted. Number right, mechanism wrong.
5. **"Redefining a symbol is safe if declared"** → refined within an hour of being written.
   Redefining a **denotation** is safe (140/140); redefining a **procedure** is not (98.2% → 38.6%).

And one correction to a claim made to you directly: I cited mermaid's 330,496 `.md` files as
evidence fence dispatch is *widely used*. That is a real absolute count, but the **rate is 0.89%**
(0.26% excluding mermaid's own docs, 0.17% on your `md` vault). It validates the **mechanism**, not
its penetration.

---

# Part III — The capabilities

Grouped by what earns them. Each traces to evidence above.

## III.1 Tier 1 — the capabilities only this engine can have

| capability | why nobody else has it |
|---|---|
| **Block identity that survives `git pull`, `vim`, and an LLM rewrite** | requires content-derived re-anchoring; no shipping system does it |
| **Byte-exact splice writing** | requires refusing to regenerate; every WYSIWYG editor regenerates |
| **YAML frontmatter edited in place, comments and quoting preserved** | Obsidian has publicly declined; 2,300× unmet demand ratio |
| **Diagnostics on defects no HTML checker can see** | requires markdown-awareness; axe sees 7 of 105 rules |
| **Container round trip with edits mapped back to source files** | all 6 competitors are one-way |
| **Drift detection at save time** | post-hoc without a diff is near-unsolved (F1 68 heuristic beats neural 66–67); **handed the edit, neural reaches 77–81. The editor sees the save. Nobody else does.** |

## III.2 Tier 2 — capabilities the compiler makes cheap

- **`file.md#heading` that stays correct when the heading moves.** The syntax already resolves in
  plain markdown and on GitHub. What is missing is the build step that *notices*.
- **Transclusion with named regions** (`tags=name`, never `lines=1..10` — positional addressing
  provably breaks, Rönnau DocEng 2008), resolved at link time into the AST, never as a preprocessor,
  with **mandatory cycle detection**.
- **An inferred frontmatter schema** — proposed, never demanded. Shipman & Marshall, *Formality
  Considered Harmful*: *"provide services based on inferred structure in informally represented
  information."* Honest prior: only **7%** of 9,655 Python projects ever adopted type annotations.
  **Design for the 93%.**
- **A symbol table** — outline, tags, backlinks, unresolved-link diagnostics. Today
  `graph-data.ts` reads `if (targetPath === undefined) continue; // unresolved — drop`. In a compiler
  that is a **diagnostic**.
- **Projections**: outline, graph, site map, token count. **Never stored** — storing a projection is
  how a format rots.
- **Normalization-correct anchors and search.** Three call sites, currently zero: slug generation,
  link-fragment matching, search `processTerm`. Normalize the **comparison key**, never the bytes.

## III.3 Tier 3 — declared constructs (the answer to your notation question)

Constructs a user or a team declares in frontmatter, which the engine understands and every other
tool degrades gracefully on. Governed by the three rules in Part IV.4. Cost of a construct: **~139
lines**, not a format-scale project.

## III.4 Explicitly bets, not validated needs

Labelled so they are never mistaken for demand: **provenance / AI-authorship marking** (the demand
sweep found *zero* threads requesting it, and active refusal — *"I don't get why I'd want to pollute
my notes with AI slop"*); **the reconciler** (strong academic ancestor, absent market signal);
**real-time collaboration** (architecturally available, but Upwelling found writers disliked
always-on realtime — the *"fishbowl effect"*).

---

# Part IV — What can fuse into markdown

This is the direct answer to *"why can't we have folder trees, self-including files, new
representations?"* — and the answer is **yes, but through dispatch, never through new syntax.**

## IV.1 The four channels that exist

| tier | channel | a dumb viewer sees | proven by |
|---|---|---|---|
| 1 | **frontmatter** | nothing | universal; TOML 0 of 42,643 files — YAML is the only vocabulary |
| 2 | **fence info string** | a normal code block | 30 uncoordinated platforms render mermaid |
| 3 | **HTML comment** | nothing | nodejs/node ships 4,310 `<!-- YAML` instances |
| 4 | **derived, never stored** | — | graphs, outlines, site maps |

**CommonMark's own words are the licence**: *"Although this spec doesn't mandate any particular
treatment of the info string, the first word is typically used to specify the language."* **That
refusal to define semantics IS the extension point.** A renderer matches one string and replaces the
node; every non-participating tool degrades to a code block. Coordination cost: zero.

## IV.2 What can fuse — ranked by measured demand

From the plugin sweep, weighted by installs. These are the things markdown users have already voted
for with 44.6M downloads of workarounds:

| rank | primitive | install weight | our channel |
|---|---|---|---|
| 1 | embedded freehand graphics | 8,791,289 | fence + sidecar payload |
| 2 | task semantics beyond a checkbox | 8,543,855 | frontmatter + inline vocabulary |
| 3 | a queryable relation over documents | 7,222,563 | **resolver**, not syntax |
| 4 | templating / computed content | 7,162,433 | **out of scope — that is a runtime** |
| 5 | page-level presentation metadata | 4,924,973 | frontmatter |
| 6 | cell grids with formulas | 3,821,379 | fence |
| 7 | board / spatial arrangement | 3,545,560 | **manifest sidecar** |
| 8 | alternative output projections | 2,459,584 | pass 7 |
| 9 | addressing into external documents | 2,398,025 | resolver |
| 10 | semantic block types | 1,607,696 | GFM callouts (the one cross-ecosystem convention) |
| — | **typed links** | 880,999 but **820 forum likes, #1 pure-format request** | **resolver + manifest** |
| — | **multi-file composition** | 449 + 174 likes, **unbuilt** | **container + transclusion** |

**The last two are the ones that matter most**, because they are *supply-starved*: enormous demand,
near-zero supply. That is the signature of a gap a plugin **cannot** close. A board can be faked by
overloading headings; a typed link needs *the link itself* to carry the relation, and no plugin can
retrofit that. Obsidian conceded exactly this — `.canvas` has directed, labelled `edges` because
markdown could not.

## IV.3 What cannot fuse, and why

- **Anything needing an edge that is not parent-child.** A `.md` file is a tree. Cross-file relations
  live in a **resolver with more than one file in scope** — a linker. Frontmatter is not the escape
  hatch either: a YAML alias *"refers to the most recent event in the serialization"*, and the
  serialization is that one file. **No anchor scope larger than a file ⇒ no relation larger than a
  file.**
- **A new sigil.** Markdown has ~32 punctuation extension points. From jgm himself: *"Guaranteeing
  that any extension is compatible with any other one is not feasible, as two extensions may want to
  interpret the same character for two different purposes."* That is **character-namespace
  exhaustion** — resource exhaustion, not governance. And it is live: Spaced Repetition's card
  separator is `::`; Dataview's inline field is `key:: value`. Two top-50 plugins, same two
  characters, today.
- **A runtime.** See I.3.
- **Reflow / `proseWrap` as a general feature.** UAX #14 permits a break between nearly any two
  ideographs, so for CJK it is **undefined**, not approximate.
- **RTL source that reads correctly.** Markdown's `[ ] ( ) < > { }` are all `Bidi_Mirrored`; `* _ - #`
  are not. Source visual order cannot match logical order without a different delimiter alphabet.

## IV.4 The three rules that govern a declared notation

From a dedicated experiment — four notation arms × read/write/edit-under-load, 1,200 field
judgments, plus a 10/10 negative control.

**Rule 1 — declare by EXAMPLE, not by rule.** Aycock et al. ablated MTOB and found *"almost all
improvements stem from the book's parallel examples rather than its grammatical explanations"*, and
flatly: *"we find no evidence that long-context LLMs can make effective use of grammatical
explanations."* Replicated across three languages. **So a `vocab` entry carries two or three
annotated instances of each construct, not a sentence describing it.** The naive design — *"`..`
means due-date"* — is the wrong shape.

**Rule 2 — cap the vocabulary in the single digits, and enforce the cap in the product.** IFScale
(20 models, seven providers): *"even the best frontier models only achieve 68% accuracy at the max
density of 500 instructions."* There is also **primacy bias** — and the geometry is unfavourable:
the declaration sits at the top of the file where compliance is highest, but the constructs must fire
in the fortieth note, where it is lowest. **Construct count is the parameter that decides whether
this works at all**, and a feature inviting users to declare their own syntax violates it by default.

**Rule 3 — the renderer is already a parser. Make it the write gate. Do NOT use constrained
decoding.** Grammar-constrained decoding fails exactly where a user-declared notation lives —
coverage on complex schemas: **Guidance 41%, llama.cpp 39%, XGrammar 28%, Outlines 3%**. And naive
masking *"distorts the output distribution"* — valid strings that are bad. **Validate-and-repair gets
the same guarantee at no distribution cost.**

**And the failure mode this prevents, stated precisely.** JSON fails *loudly* — a parser throws, a
retry fires. A private prose notation fails **quietly**: the model writes `~ doing` instead of
`~doing`, the renderer does not match, and **the field silently vanishes**. The document still looks
like a document. Nothing throws. The next agent reads a note with no status and treats the absence as
information.

**Plus one hard rule from §15:** **never redefine a symbol CommonMark already defines.** Declaring a
new **denotation** is safe (140/140). Redefining a **procedure** is not (98.2% → 38.6%).

**And the measurement that decides the operating point has NOT been made.** Every number above is
Opus-class, five constructs, declaration in immediate context. The model that will actually write
into a user's file is smaller and faster, and every published curve says that is precisely where
format adherence collapses. **The experiment establishes a ceiling, not an operating point.**

---

# Part V — How frontmatter becomes the exclusive editor and parser

The honest answer, and it is better than lock-in: **exclusivity comes from capability, not from
captivity.** The files stay portable on purpose. What needs the compiler is the moat.

## V.1 The mechanism

```
                       ┌─────────────────────────────────────────┐
   a .md file          │  frontmatter declares the vocabulary    │
   ───────────         │  ---                                    │
                       │  fm:vocab:                              │
   opened in ANY       │    due:  {examples: ["~2026-08-01", …]} │
   markdown tool  ───► │  ---                                    │ ◄─── opened in frontmatter
        │              └─────────────────────────────────────────┘              │
        ▼                                                                       ▼
   renders as ordinary markdown.                              the compiler reads the declaration,
   The notation is inert text.                                binds the constructs, type-checks
   Nothing breaks. Nothing is lost.                           them, and projects graph/outline/site.
```

The same bytes. Two experiences. **Degradation is the feature**, not a compromise — it is why the
format survives contact with GitHub, `vim`, Obsidian, and the next tool nobody has written yet.

## V.2 Why the capability gap is durable

1. **Identity is the moat, not expressiveness.** A sidecar file can add expressiveness — Obsidian
   proved it twice with `.base` and `.canvas`. **A sidecar cannot give you identity across an
   out-of-band edit.** That requires the compiler to re-derive the anchor from content, and that is
   the one thing no competitor has built.
2. **The editor sees the save.** Drift detection without a diff is near-unsolved (F1 68 for a
   *trivial heuristic*, beating every post-hoc neural model). Handed the edit, neural reaches 77–81.
   **Nobody else is handed the edit.**
3. **The wedge is publicly refused.** Obsidian's answer on frontmatter destruction is that it is
   deliberate: *"The decision we made is for plugins to be able to interact with frontmatter easily."*
   Competitors do not accidentally close a gap they have declared they do not want to close.
4. **The diagnostics require markdown-awareness by construction.** `remark-math` swallowing prose
   between two `$` signs — 36 captures in 20 of 272 files — produced **zero** axe violations. A
   parser mis-tokenization creating an accessibility defect that only a markdown-aware compiler can
   detect. That is the whole thesis, found by accident in our own repo.

## V.3 The constraint this places on us

**We must be liberal on read.** `curran/llm-code-format` exists solely to parse **nine** different
conventions LLMs use for multi-file output, and **none is an HTML comment**. Accept all nine; emit
one. The same discipline applies everywhere: read what the ecosystem writes, write what the ecosystem
can read.

---

# Part VI — The engine and the compiler

## VI.1 Seven passes

```
1  parse       .md → AST + byte positions        incremental
2  identify    mint / recover block anchors      ← the invention
3  interface   frontmatter → module signature    schema INFERRED, never demanded
4  resolve     bind every cross-reference        unresolved = diagnostic, never a silent drop
5  index       symbol table + reverse index      → outline, tags, backlinks
6  check       schema · links · drift            → the confidence ladder
7  project     outline · graph · site · tokens   never stored
```

**Passes 4–6 adopt Volar's virtual-file model**: one physical document → N `VirtualCode`s with
**offset mappings** → each embedded language served by its own service → diagnostics mapped back to
container offsets. This is how Vue, Astro, Svelte and Angular all get language support from one
abstraction, at 14M+ downloads/week combined. **It is the only piece of this design with a precedent
at that scale**, and it makes the container a *consequence* of the compiler rather than a bolted-on
format: a virtual-file edit is a byte range in the container.

**Pass 1 uses two parsers, permanently.** micromark for the compiler, `@lezer/markdown` for the
incremental editor path (both repos already ship CodeMirror 6, so the Lezer tree is in memory and
currently discarded). Parser speed tracks **architecture, not language**: MD4C (streaming callbacks)
1.174s · pulldown-cmark (pull iterator) 2.179s · comrak (builds an AST) 11.113s — comrak's **5.10×**
penalty is the price of the AST. **Every construct needs a shared conformance fixture run against
both parsers**, because they disagree at the edges.

**Recorded hazards, so they are not surprises.** Wagner & Graham (TOPLAS 1998) prove incremental
reparsing guarantees fail when *"the interpretation of the yield of a sequence depends on its
context"* — exactly setext headings, lazy continuation, link reference definitions, fence state.
Invalidation must key on what a rule **examined**, not consumed. And CommonMark is linear in
practice, **quadratic under adversarial input** — we measured `remark-parse` taking **8.6 seconds on
an 80 KB file** of the shape that earned cmark-gfm CVE-2023-22484, and **crashing the process** on
20 KB of nested blockquotes. markdown-it does both in ~12 ms because it has `maxNesting: 100`.
**remark has no equivalent limit. A compiler will be fed hostile documents.**

## VI.2 The confidence ladder — the rule that keeps it usable

| tier | qualifies | behaviour | CI |
|---|---|---|---|
| **E — Enforce** | mechanically decidable, zero interpretation, **and human-accepted** | error | fails the build |
| **W — Warn** | mechanically decidable but plausibly deliberate | warning | never fails |
| **I — Inform** | semantic, needs judgment; carries a confidence score and a reason | advisory | never fails |

> **A diagnostic may only reach tier E if a human accepted the constraint that produced it.**
> Inferred schemas start at W. **Accepting the proposal is what converts advice into a guarantee.**

Nothing at 0.62 precision — the best engineered drift detector — may ever gate CI. **Detection over
repair**: CCISolver detection F1 89.54% vs fix success 65.33%.

**And the scope check that keeps us honest.** A compiler run over 833 authored files found 365 true
problems touching only **112 files (13.4%)** — a random note has an **86.6% chance of an empty
panel**, and one file held 56% of everything. Broken wikilinks were 84% of raw output at 2–25%
precision, because an unresolved `[[link]]` is a *legitimate authoring primitive*. ⇒ **a vault-level
`check` command is earned by this data; a persistent Problems panel is not.**

**One hard constraint the a11y sweep added:** structure diagnostics (heading order, outline
integrity) must take the **composed outline** as input, never the file — a file-scoped check fires on
81% of files and is false at publish scope. Ship it file-scoped and it emits 515 false warnings and
trains the user to ignore the panel.

## VI.3 The container

> **The folder stays canonical. The container is a lossless, human-readable,
> dumb-viewer-renderable serialisation — `frontmatter pack` / `frontmatter unpack`.**

Make it canonical and you inherit shar's death (no partial extraction, no merge granularity) plus
MHTML's death (needs a special reader). **The organizing law**: every text container people *edited*
survived; every one only *produced* died. shar, MHTML, repomix → dead or disposable. `.vue`
(14.2M/wk), `.svelte` (5.3M/wk), `.astro` (4.1M/wk), jupytext → won. **SingleFile beat MHTML on one
property: the container is a valid document in the dumb viewer.**

**Flatten; never nest.** `tar`, `zip`, `cpio`, `shar`, `git fast-import`, MIME, repomix, TextBundle —
every one is a flat sequence with the tree in the path string. Fifty years, no exceptions.

---

# Part VII — How we build it

## VII.1 Phases and kill-gates

Each phase has a gate that can **stop** it. A phase without a falsifiable gate is a wish.

**Phase 1 — `core/` · splice + anchors.** Splice writer with byte-fidelity assertions;
blank-line-isolated carrier; fingerprint recovery with a validating digest; mechanical re-anchor on
every write. **Also ships the wedge**: in-place YAML splicing preserving comments and quoting.
> **Gate:** 100% byte-fidelity on untouched regions across 50 real files, verified by an
> **independent oracle**. The current 100% was produced by a check that recomputes the span using the
> writer's own code path and is *structurally incapable* of catching an offset bug.

**Phase 2 — `resolve/` + `check/`.** Linker, symbol table, tier-E/W diagnostics, `frontmatter check`.
> **Gate:** true problems across `md`'s 4,117 files with spot-checked precision **per class**.

**Phase 3 — `schema/`.** Infer → propose → accept; accepting promotes W→E.
> **Gate:** held-out false-positive rate **on a corpus verified to be human-authored**. Above ~0.4
> and users disable it permanently. *(This gate exists because our own inference experiment was
> voided by its verifier: the "585 human-authored documents" were 27.2% vendored third-party docs
> and 24.4% LLM output. It measured a script's consistency, not a person's messiness.)*

**Phase 4 — `pack`/`unpack`.** Container, aimed at the LLM lane, with the round trip as the headline
and edit-mapping back to source files.
> **Gate:** byte-identical unpack proven by per-file digests.

**Phase 5 — the reconciler.** Tier I only at first.

## VII.2 The method that produced everything above

Keep it, because it is why the numbers are trustworthy:

1. **Measure before deciding.** Every settled row in PLAN.md cites a number, not an intuition.
2. **Re-derive agent claims in the main loop.** Several were wrong. Two of mine were wrong.
3. **Make the test fail against unfixed code before trusting a pass.** A green suite on a rare fault
   is the expected result of running it, not evidence of a fix.
4. **Verify with a DOM/parser, never a substring grep.** Our first security corpus reported six
   failures and all six were detector bugs.
5. **Hand-audit the errors.** All 14 anchor false-matches were read individually; 4 turned out to be
   oracle artifacts.
6. **Record the corrections in place.** §15 exists because §10 was wrong.

---

# Part VIII — Industry-level benchmarks

The weakest part of the plan until now, and the part that decides whether this is taken seriously.
**We must pass the benchmarks that exist, and publish the ones that do not.**

## VIII.1 Conformance — benchmarks that already exist

| suite | what it proves | target |
|---|---|---|
| **CommonMark spec suite** (0.31.2) | we parse markdown correctly | **100%.** Non-negotiable. We measured 443/655 examples are AST-ambiguous — we must still pass all of them. |
| **GFM spec suite** | tables, task lists, strikethrough, autolinks | 100% |
| **babelmark3 differential** | where we disagree with cmark/markdown-it/commonmark.js | every divergence **explained or fixed**; none silent |
| **Differential fuzz vs `cmark-gfm`** | no input where our HTML differs unintentionally | zero unexplained divergences over ≥10M generated inputs |

**One known divergence must be a documented decision, not a bug:** CommonMark 0.31.2 widened
"punctuation" to include Unicode `S` categories; **cmark-gfm has not adopted it**. So `**price¥**tag`
bolds on GitHub and not under micromark. We store our vaults on GitHub. **Pick a side, document it,
and warn on affected lines.**

## VIII.2 Performance — public baselines to be measured against

| baseline | published/measured number | our target |
|---|---|---|
| MD4C (streaming) | 1.174 s | reference floor |
| pulldown-cmark (pull iterator) | 2.179 s | — |
| comrak (builds an AST) | 11.113 s | **we build an AST; this is our honest peer** |
| `markdown-it` on pathological input | ~12 ms | **we must not be 700× slower** |
| `remark-parse` on the same input | **8,607 ms** | the number we must not inherit |
| anchor resolution | **41 ms / 446 KB / 2,225 blocks** | keep it sub-100 ms at 1 MB |

**And a hard DoS gate, because we found the failure live.** A 60-case adversarial corpus with
per-case process isolation. `remark-parse` is **quadratic** on the cmark-gfm CVE shape (k=1.91
measured) and **crashes the process** on 20 KB of nesting — uncatchable in-process, a dead worker in
a route handler.
> **Gate:** every case in the DoS corpus completes under a fixed wall-clock budget with a
> **nesting-depth cap** (markdown-it's `maxNesting: 100` is the reference) enforced in a **worker or
> child process**, because a V8 stack overflow cannot be caught in-process.

## VIII.3 The benchmarks we must invent — this is the moat play

**No public benchmark exists for any of the following, because no shipping system does the thing.**
Publishing them is how a compiler becomes an industry reference rather than a product feature.

**B1 — Anchor durability. The flagship.**
```
corpus:   N consecutive real revision pairs from public markdown repos
measure:  correct / FALSE MATCH / safe refusal, per anchoring scheme
baseline: byte offset · block index · content hash · rigid fingerprint · CDC · ours
ours:     99.627% correct / 0.050% false / 0.323% refusal  (41,642 block-versions, 294 pairs)
```
This is a benchmark **nobody has published**, on a problem every document tool has, with six
baselines already measured. It should ship as a public repo with a runner, a corpus manifest, and a
leaderboard. **The false-match column is the headline** — it is the number that matters and the one
naive schemes fail catastrophically on (62.12% for byte offsets).

**B2 — Splice fidelity (R-FIDELITY).**
```
assert:  for every write, every byte outside the edited span is unchanged
verify:  by an INDEPENDENT oracle, not the writer's own span computation
target:  100%, permanent CI gate
```
The product plan independently locked this as a CI gate two weeks before we found the TOPLAS proof.
Publish the harness: **0 of 51 files in this repo survive an AST round trip**, and that number is
reproducible for any tool.

**B3 — Semantic round-trip equivalence.** Where byte-identity is impossible, assert it mechanically:
format, re-render, and assert the HTML is unchanged, aborting otherwise. `mdformat` does this. **No
editor does.**

**B4 — Diagnostic precision, per class.** Not an aggregate. Per class, on a human-authored corpus,
with the scope check applied: what fraction of a random note's panel is real? Our own data says
broken wikilinks run at **2–25% precision** and would poison an aggregate.

**B5 — i18n conformance.** A corpus the sweep already produced: CJK emphasis flanking, Bengali
composition exclusions, bidi controls, fullwidth-space slugs, emoji anchor collisions, astral
punctuation classification. **`commonmark-spec#650` has been open since 2020-05-26.** A public
conformance suite here is a contribution nobody has made.

**B6 — Renderer security corpus.** Already built: **55 payloads, DOM-verified, proven to fail 28/55
against an unprotected pipeline.** Generalize it across renderers and publish. The recurring failure
mode is **regression under maintenance** — `mdast-util-to-hast` lost its info-string sanitization to a
refactor; `marked` deleted its `sanitize` option rather than replacing it; DOMPurify's mXSS fix needed
its own fix.

**B7 — Container round trip.** `pack → unpack` byte-identical, per-file digests, plus the unclaimed
capability: **edits made in the packed file map back to source file + line.**

## VIII.4 The rule that governs every benchmark here

**A benchmark whose subject is a rare fault proves nothing until it reproduces the fault.** A green
suite is the expected result of running it, not evidence of correctness. Every gate above must be
demonstrated to **fail against the unfixed or unprotected implementation** before its pass is
reported. We have already been burned by this twice in one session.

---

# Part IX — What still needs research, and what needs a decision

## IX.1 Open research — ranked by whether it can stop us

| # | question | status | blocks |
|---|---|---|---|
| 1 | **Does the notation hold at the production model size?** | **unmeasured.** All results are Opus-class, 5 constructs, declaration in context. | any notation feature |
| 2 | **Inference precision on a genuinely human corpus** | **voided.** The 585-doc corpus was 27.2% vendored + 24.4% LLM output. | Phase 3 |
| 3 | **Concurrent-edit merge path** | **untested.** Nothing in the anchor result validates a merge. | Phase 5, collaboration |
| 4 | **Multi-block moves** | **SIMULATED.** Real history had zero; 138 singletons only. | anchor confidence claims |
| 5 | **Homogeneous-list adversarial input** | known failure: `knowledge` scores **8× worse** (0.280% false) because one enormous index list defeats hashing, shingles *and* context simultaneously. **Fix proposed** (structural key: position in parent list + parent identity), **unimplemented**. | anchor robustness |
| 6 | **Incremental reparse invalidation** | hazard documented (Wagner & Graham), design not written | pass 1 |
| 7 | CJK tokenization strategy — `Intl.Segmenter` vs bigram indexing | measured problem (18.1% mid-clause recall), unmade choice | search |

## IX.2 Decisions only you can make

**1. The CRDT conflict — two canonical documents disagree.**

| document | position |
|---|---|
| `FRONTMATTER-PRODUCT-PLAN.md` §4b | **"No peer CRDT."** Server-authoritative sequencing; live layer ephemeral. |
| `PLAN.md` §8 | Eg-walker / Braid `simpleton` — a CRDT whose event graph is disposable |

These are **different architectures**. Server-authoritative is legitimate — it is Overleaf's, which
§8 itself cites approvingly. But anyone building from §8 alone would build the wrong thing. There is
also an unresolved tension *inside* the product plan: Pillars 3 and 5 list CRDT merge as planned
while §4b says no peer CRDT.

**2. Does the notation feature ship at all?** Part IV.4 says it works under three rules and that the
deciding measurement has not been made. It is legitimate to defer it entirely and ship Phases 1–2
without it.

**3. Ten verified bugs in shipped editor code** — found during the sweep, none fixed (RULE 2). Six
are mechanical one-liners; four are real decisions (normalization call sites, CJK tokenization,
`data:` URL policy, `remark-math` delimiters). **Highest severity: Trojan Source bidi controls survive
into fenced code blocks, with zero bidi handling anywhere in `src/`.**

**4. Branch and repo hygiene.** `engine/plan-and-diagnostics` is 8 commits ahead of `main`; two
handoff docs and `arx.xml`/`cx.html` are untracked.

---

# Part X — What happens from here

## X.1 The sequence

```
NOW ──► decide: CRDT architecture · notation yes/no · bug batch
   │
   ├─► Phase 1  core/     splice writer + anchor + YAML wedge
   │            gate: independent-oracle byte fidelity, 50 files
   │            ships: the differentiator Obsidian refused to build
   │
   ├─► Phase 2  resolve/ + check/     linker, symbol table, `frontmatter check`
   │            gate: per-class precision on 4,117 files
   │            ships: the CLI that makes this a compiler and not a feature
   │
   ├─► publish B1 (anchor durability) + B2 (splice fidelity)
   │            ← this is where it becomes an industry artifact
   │
   ├─► Phase 3  schema/   infer → propose → accept
   │            gate: FP rate on a verified-human corpus
   │
   ├─► Phase 4  pack/unpack + edit-mapping back to source
   │            gate: byte-identical unpack
   │            ships: the round trip all 6 competitors lack
   │
   └─► Phase 5  the reconciler, tier I only
```

## X.2 What it looks like when it works

A file in your vault is ordinary markdown. GitHub renders it. `vim` edits it. Obsidian opens it. An
LLM rewrites a paragraph in it. You `git pull` a colleague's changes into it.

And through all of that, **the compiler still knows which block is which** — 99.627% of the time,
refusing rather than guessing the rest. So the outline stays correct, the backlinks stay pointed at
the right paragraph, the comment thread stays attached, the drift check knows what changed, and the
`file.md#heading` link that pointed at a section three edits ago **still points at that section**.

Nothing in the file announces any of this. That is the design.

## X.3 The honest risk

Recorded because a plan that only argues its own case is marketing.

**Obsidian, holding every advantage, looked at these same gaps and shipped sidecar files — twice.**
`.base` for the data model, `.canvas` for typed edges and space. The best-resourced actor in this
ecosystem concluded markdown was the wrong place to put them.

**The answer, and it has to be this one:** our differentiator is **identity across edits**, which a
sidecar cannot provide — not **expressiveness**, which a sidecar provides perfectly well. If we ever
find ourselves competing on expressiveness, we have lost, because `.canvas` already won that fight.
Everything in Part III.1 exists precisely because a sidecar cannot do it.

---

## Appendix — where things live

| document | role |
|---|---|
| **`docs/engine/README.md`** | this document. The front door. |
| **`docs/engine/PLAN.md`** | technical design of record, v0.6.0, §0–§17. Every measurement. |
| `docs/FRONTMATTER-PRODUCT-PLAN.md` | demand-side research; 92 sourced pain points, 20-app matrix. **Governs the editor track.** |
| `docs/FEATURE-GAP-REPORT.md` | editor feature inventory vs Obsidian/Notion/Typora/Logseq |
| `test/preview/html-policy-xss.test.ts` | benchmark B6, live. 55 payloads, DOM-verified. |
| `HANDOFF-mdz-markdown-format-2026-07-29.md` | the origin handoff (untracked) |
| `HANDOFF-graph-engineering-research-2026-07-30.md` | graph-engineering research, folded into §14 (untracked) |
