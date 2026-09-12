---
title: The frontmatter engine — plan
status: draft
version: 0.6.0
date: 2026-07-30
decides: what we build, what we refuse to build, and in what order
supersedes: PLAN.md v0.5.0 (same path)
evidence: ~14M subagent tokens across 90 research agents + 20 local experiments, 2026-07-28/30
---

# The frontmatter engine

> A markdown compiler whose unit is the **block**, not the file — where a block keeps a
> **durable anchor across the git boundary**, the source is never regenerated but only
> spliced, the schema is inferred rather than demanded, and the compiler reports where a
> document's claims and the repository's reality have diverged.

This document is the plan. No code is written until it is agreed.

**What changed in v0.2** — every item is a measured result, not a reconsideration:
the invention is now located precisely (the *anchor*, not "block identity" in the abstract,
§1.1); the container is repositioned from PKM to the LLM lane on demand evidence (§6);
provenance is demoted to an explicit bet (§7); the delimiter is settled by experiment (§5);
Volar's virtual-file model is adopted (§3); the tree/graph boundary gives an independent
derivation of the no-new-format verdict (§2.1); and Obsidian's YAML handling is identified
as the wedge (§1.5).

**What changed in v0.3** — the header had drifted three sections behind the body:
**§1.1a** specifies the re-anchoring algorithm (99.627% correct / 0.050% false over 41,642
block-versions; withdraws v0.2's rigid k=2 fingerprint, which gets *worse* as k grows);
**§11a** establishes the block as the unit of **identity, not of meaning** (a heading is
almost exactly as good a topic boundary as a blank line, AUC 0.508 — but H1 is 0.701 and H4
is 0.350); **§12** corrects two token-cost claims this project had repeated ("entropy floor"
refuted; ~91% of markdown's apparent token win is not markdown); **§8** reverses the diff3
claim — excluding blank lines, markdown *beats* TypeScript on Theorem 4.1.1's precondition;
**§13** records the editor bugs as fixed in `58322f7` and names the one defect left open on
purpose; and **§14** folds in the graph-engineering research, whose only additive residue is
an AI-review orchestrator that is genuinely absent from the codebase.

---

## 0. Scope

| | |
|---|---|
| **This project** | the **engine** — a standalone markdown compiler, shipped as a library and a CLI |
| **Not this project** | `frontmatter` the editor, a separate track and a clone of `md` |
| **Relationship** | the engine becomes the editor's backbone. The editor is its first consumer, not its host. |
| **Name** | `frontmatter`, for both. The word names the primitive the thesis rests on. |
| **Dogfood corpus** | `md` — 4,117 real markdown files, plus `knowledge` (273) and this repo (52). |

The engine must be useful **with no editor at all**. If it is not useful as a CLI in someone
else's CI, it is not a compiler, it is a feature.

---

## 1. The invention

### 1.1 An anchor that survives the git boundary — THE thing

Not "block identity" in the abstract. Every serious document system solved anchoring, and
**each solved it using a property we do not have**:

| system | anchor | survives an out-of-band edit? | why it works for them |
|---|---|---|---|
| **Word** | zero-width sentinel pairs (`commentRangeStart`/`End` + shared id) | yes | the artifact is XML; an invisible marker is free |
| **Notion** | a UUID on the block | yes | the artifact is a database |
| **Overleaf** | integer offsets in an OT-transformable sidecar | **no** | they own *every* write to the `.tex` |
| **ProseMirror / CM6** | offsets remapped through a change map | **no** | the remap needs the op that caused the change |

Overleaf is the only published system with our exact constraint — the artifact must stay a
plain text file an external tool can read — and it survives only by owning every mutation.
We cannot: `git pull` yields a new string with no op stream; a `vim` edit yields no op at all.

**The fourth strategy — content-derived re-anchoring — is used by no system above, and is
therefore the one with no precedent to lean on.** It is now specified and measured; see §1.1a.

### 1.1a The re-anchoring algorithm — specified, swept, and hand-audited

Measured over **41,642 block-versions** from 294 consecutive real revision pairs across `md`,
`knowledge` and this repo. Parameters chosen by a **384-configuration sweep**.

```
resolve(block i, new document) -> index | AMBIGUOUS | LOST

  gate:  anchorable(i)? else NO_IDENTITY          # 14.2% of blocks have no identity
  S1     exact: blake2b-64 over normalize(text)
         exactly one match            -> return it          # resolves 87.0%
  S2     several exact matches: score by softctx; unique argmax > 0 -> it, else AMBIGUOUS
  S3     no exact match (edited): candidates = blocks sharing any 3-gram shingle
         keep jaccard >= TAU; score = jaccard + W * softctx
         top1 - top2 <= DELTA -> AMBIGUOUS, else argmax

  softctx(i,j,K) = distance-weighted 1/d agreement of the K neighbours either side
  anchorable    = not a rule, not punctuation-only, >= 3 tokens
```

| parameter | value | why |
|---|---|---|
| normalize | NFC + collapse whitespace + lowercase | recovers reflow and case edits free |
| K (context radius) | **3** | 1→97.88%, 3→98.13%, 5→98.21%; K=3 captures the gain |
| TAU (Jaccard floor) | **0.20** | 0.20→99.14% vs 0.70→96.47% correct at **no** false-match cost |
| W (context weight) | **1.0** | best on both axes — weight context as heavily as content |
| DELTA (tie margin) | **0.05** | lowest false rate; below it, refuse |

**Results (denominator = 32,919 surviving block-versions):**

| scheme | correct | **false match** | safe refusal |
|---|---|---|---|
| byte offset | 36.93% | **62.12%** | 0.95% |
| block index | 44.43% | **55.50%** | 0.08% |
| content hash alone | 83.36% | 0.00% | 16.64% |
| content hash + nearest-position tiebreak | 77.80% | **22.20%** | 0% |
| **rigid context fingerprint k=1 / k=2 / k=3** | 90.65 / 88.68 / 87.22% | 0.25% | 9–13% |
| content-defined chunking (rolling hash) | 18.92% | **67.30%** | 13.79% |
| **recommended, anchorable blocks only** | **99.627%** | **0.050%** | **0.323%** |

Cost: **~41 ms** for a 446 KB / 2,225-block document.

**Three things this overturns.**

1. **Rigid context fingerprints are the wrong shape** — and they get *worse* as k grows
   (90.65 → 88.68 → 87.22). A ±k window straddles a moved section's boundary, so the
   guaranteed failure fraction is `min(2k, L)/L` — for k=2, L≈10 that is 40%, and 39.9% was
   measured. Neighbour edits then degrade it as `(1−p)^{2k}`. **Score context softly; never
   hash it rigidly.** (This supersedes the k=2 fingerprint recommendation in v0.2.)
2. **Content-defined chunking is the wrong granularity.** Median block is 84 bytes; a 512 B
   chunk spans ~6 blocks, so "the chunk moved here" cannot say *which* block. It is a decent
   coarse *region* filter (0.3% wrong-region) and a terrible block identifier.
3. **Every position-based tiebreak made things dramatically worse** — content-hash plus
   nearest-position goes from 0.00% to **22.20%** false. **Refusing is cheap; a silently
   wrong anchor is not.**

**The `anchorable()` gate is the highest-leverage single line in the design.** It moves the
false rate from 0.349% → **0.050%** by declining to answer unanswerable questions: **88.9% of
raw false matches are `---` horizontal rules.** 14.2% of blocks are identity-free (short
headings, rules, short list items) and must be positionally interpolated between their
anchorable neighbours, never anchored.

**When two candidates tie — the question §2.4 requires an answer to.** 12.9% of blocks present
more than one candidate, and on that subpopulation the resolver scores 94.94% correct / 2.66%
false — **50× the single-candidate error rate**. Hence DELTA: within 0.05 after context
weighting, **return AMBIGUOUS**. Removing that refusal produced 183 extra false matches.

**All 14 false matches on anchorable blocks were hand-audited, not sampled.** 4 are oracle
artifacts (byte-identical duplicate headings — indistinguishable by construction), 6 are a bulk
markdown→HTML migration, 3 are homogeneous-list drift, 1 a table rewrite. **Genuine substantive
errors: 10 in 28,170 = 0.036%.**

**The known adversarial input, and it is in this corpus.** `knowledge` scores 8× worse (0.280%
false) because `knowledge.md` is one enormous homogeneous index list where every entry shares a
template. Low inter-item distinctiveness defeats content hashing, shingle Jaccard *and* context
simultaneously. **List items should carry a structural key — position within the parent list
plus the parent's identity — rather than relying on text alone.**

*Caveats: the oracle is itself an algorithm and shares a candidate generator with the resolver
(the full hand-audit is the defence, and it found 4 of 14 errors to be oracle artifacts). Move
figures are **SIMULATED** — real history contained zero multi-block moves, 138 singletons only.
Concurrent edits from two sources were not tested, so nothing here validates a merge path.*

### 1.2 Splice-only writing — now a theorem

Foster et al., TOPLAS 2007, Lemma 3.9: a total well-behaved lens whose `put` ignores the
original source requires `get` to be a bijection. "Regenerate from the AST" is definitionally
such a lens.

**Measured:** 443 of 655 CommonMark spec examples are two *distinct source strings* with a
byte-identical AST. `get` is nowhere near injective. A zero-edit AST round trip of a real
206 KB document rewrites **24.98% of lines and drops 18.94% of bytes**. On this repo:
**0 of 51 files** survive `parse → remark-stringify` byte-identically; tuning every option
reaches 1 of 51. `mdast-util-to-markdown`'s own documentation states *"complete roundtripping
is impossible."*

**This is not a bug to tune away. It is mathematically excluded.**

Corroboration that this is a live product hazard, not a theoretical one — DesktopCommanderMCP
issue #440, 2026: an AI tool added `@tiptap/core` and began silently rewriting users' `.md`
files through ProseMirror's model. Documented damage: YAML frontmatter collapsed to single
lines, `[x]` → `\[x]`, `~/path` → `\~/path`, `_word` → `\_word`, blank lines stripped —
**and it fired on read-only operations**, 14 file-writes across 6 files in 4 minutes.

**Alignment, which splice-only alone does not give us:** CodeMirror's `ChangeSet` satisfies
the Edit Lenses (Hofmann/Pierce/Wagner, POPL 2012) module laws — 5,000/5,000 property tests.
That layer is already in a dependency both repos ship.

### 1.3 Inferred schema — proposed, never demanded

Shipman & Marshall, *Formality Considered Harmful* (CSCW 8(4) 1999), concluding prescription
verbatim: *"Systems should provide services based on inferred structure in informally
represented information."* Four named reasons users refuse to formalize: cognitive overhead,
tacit knowledge, premature structure, situational structure.

Honest prior: only **7%** of 9,655 real Python projects ever adopted type annotations.
Design for the 93%.

**Open risk, stated plainly.** Our inference experiment reported a 4.4% held-out flag rate,
but the adversarial verifier voided it: the "585 human-authored documents" it rested on were
**27.2% vendored third-party docs and 24.4% LLM-pipeline output**. It measured a script's
consistency, not a person's messiness. **Inference precision on genuinely human corpora is
unmeasured.** Phase 3's gate exists to settle it.

Also unresolved: the flagship `status: activ` demo had **zero real instances in 3,228
documents**. The diagnostic may be correct and still have no compelling live example.

### 1.4 The reconciler

Software Reflexion Models — Murphy, Notkin & Sullivan, FSE 1995; SIGSOFT Retrospective
Impact Award 2011. Three arc types, no fourth: **convergence · divergence · absence.**

Proven at scale on Microsoft Excel: ~1.2M lines of C, a 170-line map written in a few hours,
first result in 20 minutes — 15 convergences, 83 divergences, 4 absences, 61% of calls
covered. Never applied to prose-versus-code.

Design for a brutal first report: divergences outran convergences **5.5:1** on the first run,
and 61% coverage was still useful.

Do not call it "reflexion" — the knowledge base already holds `paper-shinn-reflexion.md`.

### 1.5 The wedge: Obsidian destroys YAML and has declined to fix it

`processFrontMatter` and the Properties UI destructively rewrite frontmatter — strips quoting,
**deletes YAML comments outright**, destroys explicit type tags (`!!timestamp`), converts
inline arrays to block style. Community summary: *"Calling processFrontMatter will destroy all
previous formatting, and most YAML features/syntax."* Obsidian's answer is that it is
deliberate: *"The decision we made is for plugins to be able to interact with frontmatter easily."*

And their own type declaration:

```typescript
export interface FrontMatterCache { [key: string]: any; }
```

Every property in every note, in the market-leading markdown app, is `any`.

Demand ratio: Dataview **4.6M** downloads against Propsec (the best-maintained frontmatter
validator) at **2,000** — 2,300×. Four people independently built a frontmatter type checker
for Obsidian; the most complete is archived at 1 star.

**A frontmatter editor that splices YAML in place, preserving comments, quoting, tags and
inline-flow form, is a Phase-1 differentiator the incumbent has publicly refused to build.**

---

## 2. Invariants

### 2.1 The file stays `.md` — now derived twice, independently

**From adoption:** MDX has Vercel and reaches 3.07% of `.md` volume; Markdoc has Stripe and
reaches 0.136%; djot has CommonMark's own author and does 693/wk against remark-parse's
45,731,168 — a gap of **65,990×**.

**From formal-language grounds, which is the stronger derivation.** Markdown carries exactly
one data structure: a finite, ordered, rooted tree over a **closed 21-label alphabet** with
Unicode-string leaves, three attribute channels, and one flat document-scoped string→URL table.
It cannot carry types, identity, null, or **any edge that is not parent-child**.

> The boundary is not a syntax gap a dialect could close. It is the **tree/graph boundary**.
> Adding syntax inside one file cannot create a scope larger than one file.

Frontmatter is not the escape hatch: a YAML alias *"refers to the most recent event in the
serialization"*, and the serialization is that file. **No anchor scope larger than a file,
therefore no relation larger than a file.** What crosses the boundary is a resolver with more
than one file in scope — a linker.

*(Emblem, verified locally: to a conforming CommonMark parser, `---\ntitle: Hello\n---` is a
`thematicBreak` followed by an `h2` whose text is your YAML. The most widely deployed data
channel in the ecosystem is not in the spec.)*

### 2.2 The extension mechanism lives in the resolver, not the syntax

**MyST — the most mature markdown extension mechanism that exists — formally voted to retreat
from its own syntax.** MEP-0002 (Accepted 2023-03-03) replaces `` {ref}`my-id` `` with
`[](#my-id)`, `` {doc}`my-doc` `` with `[](my-doc.md)`. Stated reason: **"graceful degradation"**
on GitHub and Jupyter.

And why no amount of standards work fixes it, from jgm:

> *"Guaranteeing that any extension is compatible with any other one is not feasible, as two
> extensions may want to interpret the same character for two different purposes."*

That is **character-namespace exhaustion** — resource exhaustion, not governance. Markdown has
~32 punctuation extension points. **Adding a sigil spends a non-renewable resource.**

The only mechanism to reach scale (`remark-directive`, 6.95% of remark-parse) won as a
**plugin to the incumbent parser**, and its own README says do not use it *"if you don't know
who authors content, what tools handle it, and where it ends up"* — which is precisely our case.

### 2.3 Tiering — nothing above tier 3 reaches disk

| tier | lives in | a dumb viewer sees |
|---|---|---|
| 0 | prose | the document |
| 1 | frontmatter | nothing |
| 2 | code-fence info strings | a normal code block |
| 3 | HTML comments | nothing |
| 4 | **nowhere — always derived** | graphs, outlines, live components, the site map |

### 2.4 Others

- **Projections are never stored.** Storing one is how a format rots.
- **No runtime.** The moment the engine needs an interpreter to read a file, it is MDX.
  TypeScript never touched JavaScript's runtime; it only added checking.
- **Never escape the payload.** Both dead container ideas died from payload transformation
  (base64 at 0.90 tok/byte; the polyglot at +81% inflation and 82,957 U+FFFD).
  **Move the boundary; never touch the bytes.**
- **Specify broken-anchor behaviour before it is needed.** Word: a `commentRangeStart` with no
  matching end *"shall be considered the single anchor point."* Notion concedes its two pointer
  directions can diverge. Every production system needed a defined degradation. Ours must state
  what happens when a fingerprint finds **no** match, and — more dangerous — when it finds **two**.

---

## 3. Architecture

```
1  parse       .md → AST + byte positions        incremental
2  identify    mint / recover block anchors      ← the invention
3  interface   frontmatter → module signature    schema INFERRED
4  resolve     bind every cross-reference        unresolved = diagnostic, never a silent drop
5  index       symbol table + reverse index      → outline, tags, backlinks
6  check       schema · links · drift            → the confidence ladder
7  project     outline · graph · site · tokens   never stored
```

### 3.1 Adopt Volar's virtual-file model for passes 4–6

One physical document → N `VirtualCode`s with **offset mappings** → each embedded language
served by its own language service → diagnostics mapped back to container offsets. This is how
Vue, Astro, Svelte and Angular all get language support from one abstraction, at 14M+
downloads/week combined.

It is the only piece of this design with a precedent at that scale, and it makes the container
(§6) **a natural consequence of the compiler rather than a bolted-on format**: a virtual-file
edit is a byte range in the container.

### 3.2 Pass 1 — parse
`@lezer/markdown` for the incremental path (agent-measured at 9.06× faster cold than remark on
800 KB and 423× on a keystroke; **unreplicated — treat as indicative**). Both repos already ship
CodeMirror 6, so the Lezer tree is in memory and currently discarded.

Independently verified: parser speed tracks **architecture, not language** — MD4C (streaming
callbacks) 1.174s · pulldown-cmark (pull iterator) 2.179s · comrak (builds an AST) 11.113s.
Comrak's **5.10×** penalty is the price of the AST.

**Hazards, recorded so they are not surprises.** Wagner & Graham (TOPLAS 1998) prove incremental
reparsing guarantees fail when *"the interpretation of the yield of a sequence depends on its
context"* — exactly setext headings, lazy continuation, link reference definitions, fence state.
Invalidation must key on what a rule **examined**, not consumed (Dubroy & Warth, SLE 2017).
And CommonMark is linear-in-practice, **quadratic under adversarial input**, patched case by case
(cmark #373, #389, CVE-2023-22484) — a compiler will be fed hostile documents.

### 3.3 Pass 2 — identify

**Carrier, decided by experiment.** A naive inline trailing anchor destroys **100% of fenced code
blocks** (the ` ^id` after a closing fence invalidates it and swallows the rest of the file:
`AGENTS.md` went 52 blocks → 32), **150/150 thematic breaks**, and **74/74 tables**. A carrier
that goes inline for prose but **blank-line-isolated for code, tables, rules and HTML** corrupts
**0 of 1,765**. All anchors then survive remark-stringify and prettier at 100%.

**But carrying the anchor in the source is necessary and not sufficient.** An LLM rewriting a
block preserved its trailing anchor **10.0% of the time unprompted (3/30)** and **86.7% when
instructed (26/30)** — self-measured, and the verifier correctly flagged this as the one number
in that experiment that was never independently measured. Even at 86.7%, **1 write in 7 is wrong**.
⇒ **the editor must re-anchor mechanically on every write.**

**And the shipped-design critique to respect**, from a practitioner:
> *"block IDs... have to be shoehorned into the markdown format, while being hidden by the editor —
> which can be error prone as those IDs can move around. In Obsidian you end up with explicit
> `^jnflds` ID markers all over the place at line ends, which is quite awful."*

Seven Obsidian forum topics document block references breaking when their target changes.
**The capability is wanted; the visible, in-band, mutable marker is the part everyone hates.**

**Therefore prefer iA Writer's model over an ID.** Their open *Markdown Annotations* spec (v0.2):
- ranges in **grapheme-cluster indexes**, explicitly *"to ensure that annotations remain valid
  regardless of environment or file encoding"* — which also resolves our UTF-16-vs-byte hazard;
- a **mandatory SHA-256 validating hash** over the referenced range, so an external edit makes
  the anchor **detectably stale rather than silently wrong**. That is Grønbæk & Trigg's "case 4"
  being detected instead of suffered, and it is the answer to §2.4's broken-anchor requirement.

**And the negative result that constrains any ID scheme**: Logseq issue #7362 — an inline-text
UUID is not sufficient if the index resolves references by internal handle. External edit →
`reset-file!` deletes and recreates blocks → incoming references are deleted even though the
block survives. Closed as not planned.

**Encoding hazard, measured:** CodeMirror and mdast offsets are UTF-16 code units; a git blob
offset is bytes. **103 of 2,314 files (4.5%)** in these vaults contain non-BMP characters. Inside
JS this is consistent; the bug appears at every boundary where a byte offset enters (git blob,
`Buffer`, a content hash over a byte range, a Rust impl, an LSP that negotiated `utf-8`).

### 3.4 Pass 3 — interface
Frontmatter promoted from metadata to a module signature. **Schema class:** the *regular*
tree-language class (RELAX NG / XDuce) is the only one closed under union, intersection **and**
difference; DTD and XSD are closed under intersection only. Martens et al. (TODS 2006) measured
that real XSDs barely use the power they have. **Small regular-class surface.**

### 3.5 Pass 4 — resolve
`file.md#heading` already resolves in plain markdown and on GitHub. **No new syntax needed.**
Missing is the build step that notices when the target moves.

Adopt AsciiDoc's transclusion **semantics** but not its mechanism: `tags=name` (named regions),
never `lines=1..10` (positional addressing provably breaks — Rönnau, DocEng 2008). Resolve at
link time into the AST, never as a preprocessor: AsciiDoc's own docs record the permanent price
— *"the preprocessor lacks structural awareness"*, escaping required even inside verbatim blocks.

**Cycle detection is mandatory and XInclude specifies where it goes**: a fatal error keyed on the
inclusion chain (location + xpointer).

Today `graph-data.ts:132` reads `if (targetPath === undefined) continue; // unresolved — drop`.
In a compiler that is a diagnostic.

### 3.6 Pass 6 — check
See §4.

### 3.7 Pass 7 — project
- **The agent never sees an edge list.** LLMs score 18.8–23.0% counting nodes and 10.2–15.0%
  counting edges on 5–20 node graphs. A deterministic walk pays: HippoRAG 2's PageRank is worth
  +12.5 where the LLM's contribution is 0.7 of 87.1. **Rank offline, ship flat.**
- **Do not emit a generated overview.** Measured to *not* improve task success while costing
  **>20% more inference**. Emit procedures and preserved structure instead.
- Structure is worth up to ~20 accuracy points; **the syntax carrying it has no stable winner**
  across models. Markdown's edge is token-economic, not structural: a markdown table costs
  **37.9% of JSON's tokens** for 0.4 accuracy points less *(inherited from the improvingagents
  benchmark against **pretty-printed** JSON; like-for-like it is 46.2%, and against columnar JSON
  only 9.7% — see §12.2)* — but HTML beats markdown on table
  size-detection **67.00% vs 40.67%**. It keeps its advantage by staying dumb.

### 3.8 The editor's live preview (for the consumer, not the engine)
Governing constraint, verbatim from CodeMirror: *"Decorations that significantly change the
vertical layout... must be provided directly, since indirect decorations are only retrieved after
the viewport has been computed."* ⇒ **inline syntax → ViewPlugin; block height → StateField.**

Obsidian's shipped API confirms the whole design: `editorLivePreviewField: StateField<boolean>`
and `livePreviewState: ViewPlugin<{mousedown: boolean}>`. Live Preview is **not a second editor** —
one boolean on the same instance. They track mid-click as first-class state to stop decoration
churn; two independent open implementations hit the same bug and shipped the same guard.
Hide markers with `max-width:0; opacity:0`, not `display:none`; feed the same `RangeSet` to
`EditorView.atomicRanges`; key `WidgetType.eq()` on the source slice.

---

## 4. The confidence ladder

| tier | qualifies | behaviour | CI |
|---|---|---|---|
| **E — Enforce** | mechanically decidable, zero interpretation, **and** human-accepted | error | fails the build |
| **W — Warn** | mechanically decidable but plausibly deliberate | warning | never fails |
| **I — Inform** | semantic, requires judgment; carries a confidence score and a reason | advisory | never fails |

> **A diagnostic may only reach tier E if a human accepted the constraint that produced it.**
> Inferred schemas start at W. Accepting the proposal promotes them to E.

A wrong inference can never break a build; accepting a proposal is what converts advice into a
guarantee; and nothing at 0.62 precision (the best engineered drift detector) may ever gate CI.

**Detection over repair** — CCISolver: detection F1 89.54% vs fix success 65.33%.
**Watch saves, not repos** — post-hoc drift detection without a diff is near-unsolved (a trivial
token-overlap heuristic scores F1 68.0, beating every post-hoc neural model at 66.3–67.2); handed
the edit, neural reaches F1 77–81. **The editor sees the save. Nobody else does.**

**When byte-identity is impossible, assert semantic equivalence mechanically.** `mdformat`
formats, re-renders, and asserts the HTML is unchanged, aborting otherwise. No editor does this.

**Sobering scope check.** A compiler run over 833 authored files found 365 true problems touching
only **112 files (13.4%)** — a random note has an **86.6%** chance of an empty panel, and one file
held 56% of everything. Broken wikilinks were 84% of raw output at 2–25% precision, because an
unresolved `[[link]]` is a *legitimate Obsidian authoring primitive*. ⇒ **a vault-level `check`
command is earned by this data; a persistent Problems panel is not.**

---

## 5. The container — `pack` / `unpack`

**Delimiter, settled by experiment.**

| carrier | dumb viewer | remark round-trip | verdict |
|---|---|---|---|
| **HTML comment** `<!-- fm:file path="a/b.md" -->` | invisible (marked, react-markdown, cmark, GitHub, Obsidian) | survives | **default** |
| link reference definition `[fm:file]: a/b.md "…"` | invisible **everywhere**, incl. MDX and strict markdown-it | **byte-identical** | portability profile |
| code fence with path in info string | monospace body | survives; nests via backtick count | LLM transport profile |
| `:::` container | visible colons on GitHub | probably survives | reject |
| heading carrying the path | fully visible; heading-level collision | — | reject as delimiter |
| bracketed span `[x]{.c}` | visible | **`[` → `\[`, destroyed** | never |

**The decider, measured.** With no blank line before the delimiter:
`html-comment → paragraph, html, heading` (interrupts; boundary survives) versus
`linkref → paragraph, heading` (**swallowed; boundary silently lost**). HTML comments are type-2
HTML blocks and may interrupt a paragraph; link reference definitions may not.

**Known hole:** `markdown-it` defaults to `html: false` and renders the comment as visible escaped
text (verified). Most applications set `html: true`. Document it; do not design around it.
**MDX is a hard no** — use the linkref profile there.

**Structure:** frontmatter manifest (spec version, ordered path list, **per-file digest**) +
explicit `fm:file` / `fm:endfile` markers. Three components — lexical boundary, out-of-band
manifest, per-part digest — which is shar (1982), MIME (1996) and TextBundle (2013) recombined.

**Flatten; never nest.** `tar`, `zip`, `cpio`, `shar`, `git fast-import`, MIME, repomix,
TextBundle — every one is a flat sequence with the tree in the path string. Fifty years, no
exceptions. A container inside a container is refused in v1 with a diagnostic.

**Splitting must be a CommonMark block-level scanner, not a regex** — HTML-block start conditions
cannot fire inside a fenced or indented code block, and a delimiter counts only at container-prefix
depth 0.

**Measured cost:** 6 real files, 62,690 bytes → 63,310 bytes. **+0.99% overhead, 6/6 recovered
byte-identical, 12/12 delimiters surviving a remark round-trip.**

---

## 6. Positioning — corrected by demand evidence

> **The folder stays canonical. The container is a lossless, human-readable,
> dumb-viewer-renderable serialisation — `frontmatter pack` / `frontmatter unpack`.**

Make it canonical and you inherit shar's death (no partial extraction, no merge granularity —
and "every save is a commit" becomes a category error when two people editing *different*
contained files conflict) plus MHTML's death (needs a special reader).

**The organizing law:** every text container that people *edited* survived; every one only
*produced* died or stayed machine-only. shar, MHTML, repomix → dead or disposable.
`.vue` (14.2M/wk), `.svelte` (5.3M/wk), `.astro` (4.1M/wk), jupytext (62.3M total) → won.
**SingleFile beat MHTML (22k★) on one property: the container is a valid document in the dumb viewer.**

**And the demand correction — this is the most important change in v0.2.**

| lane | evidence |
|---|---|
| **LLM context** | ~16 independently-built tools; repomix 27,491★ + gitingest 15,249★ = **42,740★**; eight competing tools posted by their own authors in a single HN thread |
| **PKM / vault sharing** | *"Is there a place where people share vaults?"* — **score 12, 10 comments.** Searching `export` in r/ObsidianMD tops out at **score 9**. |

**The validated market is feeding machines, not sharing notes.** Do not position this as PKM.

**Two threats to carry:**
1. Agentic CLIs may be eating the use case: *"I used to do it with repomix… after using Claude
   Code with Opus 4.5, it's IMHO not worth it anymore."*
2. repomix issue #71 is an open request to **split the single file back into several**, because
   *"at a certain number of lines of code, LLMs tend not to be able to see the rest."*
   **The single-file property that is the premise is what its closest neighbours' users want removed.**

**The unclaimed part is the round trip.** repomix, gitingest, files-to-prompt, code2prompt,
bundle-md, stitchmd — **every one is one-way**; `stitchmd`'s docs describe no reverse operation.
And the highest-leverage user ask in the entire demand sweep is its dual:

> *"allow the user to **map changes in the concatenated file back to the original files** — if an
> LLM edits the concatenated file, I would want it to return the corresponding filenames and line
> numbers."*

That is Volar's offset mapping (§3.1), pointed at the container. One mechanism, two features.

**Be liberal on read:** `curran/llm-code-format` exists solely to parse **nine** different
conventions LLMs use for multi-file output — and **none is an HTML comment**. Accept all nine;
emit one.

---

## 7. Explicit bets — ahead of demand, not responses to it

Labelled so they are never mistaken for validated needs.

1. **Provenance / AI-authorship marking.** The demand sweep found **zero** threads requesting it.
   What exists is refusal: *"I don't get why I'd want to pollute my notes with AI slop"*,
   *"seeing these AI slop paragraphs makes me distrust… all info in these posts."* iA Writer's
   `@`/`&`/`*` sigils remain a good design; the demand for them is unevidenced.
2. **The reconciler.** Nobody asked for prose↔code drift detection. The academic ancestor is
   strong; the market signal is absent.
3. **Real-time collaboration.** Architecturally available (§8) but Upwelling found writers
   disliked always-on realtime — the *"fishbowl effect"* — and disabled autosave to escape it.

---

## 8. Collaboration — available, with one concession

**Eg-walker (Gentle & Kleppmann, EuroSys '25):** the event graph is needed *only* to merge
concurrent changes or reconstruct old versions — **not to load, not to edit locally**. So on the
common path the `.md` **is** the working representation and the sidecar sits cold. Cost when
needed: 20%–3× the final text size.

**Braid `simpleton`:** a peer holding only text + a version string — *"zero history overhead…
as little as 50 lines of code"* — still converges, because the hub rebases for it. **A `git clone`,
a CI job, `vim`, or an agent is a participant, not a degraded case.**

**Bounded loss:** Peritext (CSCW '22) demolishes control-character approaches with three worked
counterexamples, and markdown's `**`, `_`, `` ` `` *are* control characters. Concurrent overlapping
bolds converge to bytes that render as the inverse of both intents. Bound it in the UI; do not try
to fix it with delimiter counting.

**Do not commit on every save during a live session.** Overleaf generates git commits *just in time*
on pull/fetch. Commit granularity is a product decision, not an algorithm one.

**Git's diff3 is the async fallback, never the concurrency mechanism.** Theorem 4.1.1 requires a
uniquely-occurring line in an untouched separator — and its counterexample shows separator *size*
buys nothing, only uniqueness does.

**Correction to v0.2: markdown is NOT intrinsically worse than code here.** Re-measured:

| corpus | all lines unique | **non-blank lines unique** |
|---|---|---|
| markdown (`md`) | 64.6% | **84.8%** |
| markdown (`knowledge`) | 68.4% | **94.2%** |
| TypeScript | 70.6% | 78.1% |

Excluding blank lines, markdown **beats** TypeScript. Blank lines are the entire deficit, and they
are non-unique by definition. **A block-structured representation that never emits a bare blank
line as an alignable atom removes the deficit completely** — which is another argument for
diffing blocks rather than lines.

What remains true: reflow changes every line in a paragraph, destroying line-level matching before
the theorem is reachable. And measured on 294 real revision pairs, **43.3% of deleted lines are
≥0.80 similar to a line in the same hunk** — light edits reported as a full delete plus insert.
**The lever for prose is granularity, not algorithm:** myers, minimal, patience and histogram
produce byte-identical output on **289 of 294 pairs (98.3%)**, differing in total churn by 0.08%.

**Schema evolution:** adopt Cambria's (Litt, van Hardenberg & Henry, PaPoC 2021) **read-time lens
translation** — store the lens *in the document*, translate on read, no mass rewrite of the corpus.
Composes with the ChangeSet/edit-lens result because both are patch-level.

---

## 9. Phases and kill-gates

**Phase 1 — `core/` · splice + anchors.** Splice writer with byte-fidelity assertions;
blank-line-isolated carrier; fingerprint recovery with a validating digest; mechanical re-anchor
on every write. **Also ships the wedge: in-place YAML splicing that preserves comments and quoting.**
*Gate:* 100% byte-fidelity on untouched regions across 50 real files, verified by an **independent
oracle** — the current 100% was produced by a check that recomputes the span using the writer's own
code path and is structurally incapable of catching an offset bug.

**Phase 2 — `resolve/` + `check/`.** Linker, symbol table, tier-E/W diagnostics, `frontmatter check`.
*Gate:* true problems in `md`'s 4,117 files with spot-checked precision per class.

**Phase 3 — `schema/`.** Infer → propose → accept; accepting promotes W→E.
*Gate:* held-out false-positive rate **on a corpus verified to be human-authored**. Above ~0.4 and
users disable it permanently.

**Phase 4 — `pack`/`unpack`.** Container, aimed at the LLM lane, with the round trip as the headline
and edit-mapping back to source files.
*Gate:* byte-identical unpack proven by per-file digests.

**Phase 5 — the reconciler.** Tier I only at first.

---

## 10. Settled — do not re-litigate

> **⚠ Two rows in this table were CORRECTED on 2026-07-29 — see §15.** "No new extension" was
> refuted by measurement; "no new sigil" is narrower than it reads. The rest stands.

| decision | evidence |
|---|---|
| No new **format** (a dialect requiring its own parser) | MDX 3.07%; Markdoc 0.136%; djot 65,990× behind — **and** the tree/graph boundary (§2.1). **This survives, strengthened.** |
| ~~No new extension~~ → **extend via dispatch, never via dialect** | **REFUTED as written — see §15.1.** Fence dispatch is markdown's winning extension mechanism: 330,496 `.md` files carry a ```` ```mermaid ```` fence against 259,136 `.mdx` files in existence. |
| ~~No new sigil~~ → **no sigil that REDEFINES an existing one** | **NARROWED — see §15.2.** Novel sigils are safe; redefining `#`/`*`/`[]()` fails measurably (GPT-4: 98.2% base-10 → 38.6% base-9 *with the rule stated in the prompt*). |
| No base64 binary | 0.91 tok/byte measured (o200k); 200 KB JPEG = 93% of a 200K window. **Not an "entropy floor"** — see §12.1 |
| **No polyglot ZIP tail** | UTF-8 round trip → 82,957 U+FFFD, +81% bytes; `.gitattributes` `*.md text` corrupted the archive in one checkin (`unzip -t`: *bad zipfile offset*); git binary-detects below an 8,000-byte head and line-merges above it |
| "MDX but polyglot" is not novel | org-babel, JSS 46(3) 2012, 40 language backends |
| MD3 and MDZ both dead | MD3 = Material Design 3; `.mdz` = an existing compressed-markdown extension with 4 live projects |
| No WebContainers | requires `COEP: require-corp` page-wide — breaks GitHub avatars and OAuth popups |
| No runtime cross-file reactivity | Observable built it and removed it. Take the linking, refuse the reactivity. |
| Content-hash-only identity | Θ(n) rebuild per O(1) edit (Hammer et al., OOPSLA 2015). Names, not hashes. |
| Demanding declared schemas | settled 1992 (Aquanet) and generalized 1999 (Formality Considered Harmful) |
| Large typed-link vocabularies | nine is the measured ceiling (gIBIS, TOIS 6(4) 1988) |
| Never regenerate from the AST | TOPLAS 2007 Lemma 3.9 + 443/655 spec examples |
| In-band trust markers as a defense | Spotlighting 1% ASR static → **>95%** adaptive |
| Route around mdbase and IWE | no seam to layer on — mdbase's body is opaque in four models at once |

**Retired claims — previously believed, now false:**
- *"Nobody will tell you `status: activ` is not in your enum."* mdbase does; `mdbase-lsp`
  (`callumalpass/mdbase-lsp`, 13★, Rust, `src/diagnostics.rs`) ships it. **What it cannot do is put
  a diagnostic range in the body** — every range it emits is confined to the frontmatter block.
- *"Nobody has typed cross-file references."* mdbase has them at **file** level. **Block level is open.**
- *"No editor ships diagnostics."* VS Code's markdown LS ships six link codes including
  `link.no-such-header-in-file`. **CommonMark only, zero frontmatter awareness.**
- *"Markdown is ~40% fewer tokens than HTML."* Apples-to-apples: **9.1%**.
- *ObjectGraph, arXiv 2604.27820* — **the arXiv API returns no entry for that ID.** Do not cite.
- *Obsidian "4.3M users"* — **unverified**, and inconsistent with the ~1.5M third-party estimate.
  Obsidian publishes no figure.
- *Every Reddit quote in the handoff* — Reddit is blocked to WebSearch/WebFetch; only the
  `agent-reach` browser path reaches it. Treat as unverified.

---

## 11. The steelman, kept in view

> *"Markdown won because it was **simple**… People could implement Markdown themselves in an hour
> or two… **reStructuredText is way more technically sound.** It's more capable, and there's none
> of the wild and incompatible fragmentation. **But reStructuredText is heavy to implement.**"*

**Technical superiority historically loses to implementability.** The counter is that we are not
asking anyone to adopt a format — we are asking them to run a tool over files they already have.
That is the only version of this that survives the argument.

Also live: *"Markdown is good enough. It will take an order-of-magnitude difference to unseat it"*;
*"folders limit thinking? Nonsense"*; and graph views as *"productivity porn."*

---

## 11a. The block is the unit of IDENTITY, not of MEANING

The most important measurement in the project, because it constrains what we may *claim*.
A TextTiling implementation was validated first on a known-answer Choi-style task (P_k 0.296
vs 0.481 chance — a 38.6% error reduction), so the null results below are a property of
markdown, not a broken instrument. All conclusions come from **paired** comparisons.

**A markdown heading is almost exactly as good a topic boundary as a blank line.**
Per-document AUC of heading-vs-plain-paragraph depth: **0.508** (0.478 on a clean
human-prose subset). Cohen's d = +0.064.

**But heading LEVEL carries real, monotone signal**, position-matched against plain paragraph
breaks within ±15 gaps:

| level | position-matched AUC | reading |
|---|---|---|
| **H1** | **0.701** | a genuine topic boundary |
| H2 | 0.534 | weakly one |
| H3 | 0.507 | indistinguishable from a blank line |
| **H4** | **0.350** | **significantly WORSE than a plain paragraph break** |

A deep heading systematically marks a place where the vocabulary is *continuing* — it
subdivides one coherent discussion. **A chunker that splits on every heading splits at the
wrong place most of the time.** Prefer H1/H2 as hard splits; treat H3+ as merge candidates.

**Headings interrupt discourse; they do not reset it.** The paragraph immediately after a
heading is **1.50× more likely** to open with an anaphor or connective than a mid-section
paragraph (6.48% vs 4.33%, z = +14.71, n = 95,896). If headings were resets this would be
well below 1. Writers add a heading and carry straight on with "This means…", "However…".

### Why the block still wins — from the direction the field never looks

Replace 60 content tokens mid-document with off-topic text, **holding token count constant**
so the segmenter's grid cannot re-phase:

| | topic segmenter | markdown block |
|---|---|---|
| remote units unchanged | 96.0% | **99.3%** |
| **documents with ≥1 spurious REMOTE change** | **89.6%** | — |
| identity on raw text (after reflow) | — | 30.0% |
| identity on **whitespace-normalised** text | — | **89.0%** |

**Mechanism, and it generalises:** TextTiling's cutoff is `mean(depth) − sd(depth)/2`, a
**document-global statistic**. Edit any paragraph and the threshold moves and boundaries flip
*everywhere*. C99's rank matrix and U00's dynamic program are global too. This is inherent to
"how many segments does this document have" being a global decision.

> **A topic segmenter cannot be an identity anchor.** Block boundaries are decided by local
> syntax — a blank line, a `#`, a fence — computable in one left-to-right pass.

The 30% → 89% row independently confirms §12's canonicalization requirement from a second
direction: **normalise whitespace before hashing, or reflow invalidates everything.**

### Both candidate units fail as retrieval chunks, for opposite reasons

Measured on 424,419 blocks (independently re-derived; the research agent's own splitter gave
the same shape):

```
list items 48.0%  ·  paragraphs 30.3%  ·  headings 15.2%  ·  fences 4.6%
words: p25=4  p50=9  p75=18  p90=33  p95=48  p99=129  max=91,165
Gini of token mass 0.647 — the top 1% of blocks hold 22.5% of all content
```

A median of 9 words is not retrievable under any embedding model; and a fraction of a percent
of blocks holds a sixth of all content and will blow any fixed budget.

> **The chunker's real job is packing, not boundary-finding. Test on the p99, not the mean.**

And the literature has said so for thirty years: **Hearst & Plaunt (1993) found no significant
difference between motivated subtopic segments and arbitrary blocks of the same length**, and
**Moffat et al. (1994) found author-supplied sectioning gave *worse* retrieval than automatic
subdivision.** Confirmed recently — Qu, Tu & Bao (NAACL 2025 Findings): *"the computational
cost of semantic chunking is not justified by consistent performance gains."*

**Where the measured wins actually are: self-containedness, not boundaries.** Anthropic's
contextual retrieval cuts top-20 failure by 35% → 49% → 67% — and the mechanism is *prepending
document context to each chunk*, i.e. an admission that a chunk alone is not self-contained.
Dense X (EMNLP 2024) wins with *propositions*, defined by self-containedness rather than syntax.

**Our free win:** the **heading path** is an exact, author-supplied context prefix. Prepending
it is contextual retrieval at zero LLM cost — a structural advantage generic RAG does not have.

**Design consequence:** blocks own identity; retrieval chunks are a **derived, rebuildable
projection** that nothing durable points at, and are therefore allowed to be unstable. If a
semantic layer is ever added, make a segment a *set of block IDs* — re-segmentation then changes
grouping without invalidating a single anchor.

*Limits: token figures in the source experiment were chars/4 estimates (pypi TLS blocked);
TextTiling is a noisy oracle (F1 0.459 even on known boundaries); and this is one author's
heading-dense, list-heavy corpus — stratification hinted headings track topic better at
200+ words/section (n=35, directional only).*

---

## 12. Token-cost claims, corrected

Two figures this project has repeated were wrong or wrongly explained. Both are now
independently re-measured with `tiktoken` `o200k_base`; the raw numbers survive, the
*mechanisms and comparisons* do not.

### 12.1 "Entropy floor" is refuted — the number is right, the explanation was wrong

base64 measures **0.912 tok/source-byte** (o200k, random bytes) — confirmed. But it is **not**
an entropy floor. The information-theoretic counting bound is `8 / log2(200019)` = **0.4543**,
so the measured value sits at **2.01×** the bound, never at it.

The decisive test — encode in base-2 and vary entropy from maximal to zero:

```
base2 of random bytes    : 5,334 tokens   gzip(raw) = 2,023 B
base2 of all-zero bytes  : 5,334 tokens   gzip(raw) =    35 B
```

**Identical token counts across a 58× difference in compressibility.** A quantity that does not
move when entropy goes from maximum to zero is not set by entropy.

**The real mechanism is two-stage and neither part is information-theoretic:**
1. **The pre-tokenization regex.** No token may cross a pre-token boundary, and o200k caps digit
   runs at `\p{N}{1,3}`. That alone predicts the pure-digit encodings exactly with no entropy
   term: base2 = 8/3 = 2.6667 (measured 2.6667); base8 = 3/3 = 1.0000 (measured 1.0000).
   Pearson **r = +0.942** between *percent digits in the alphabet* and tok/source-byte.
2. **Merge-table coverage.** Only vocabulary entries composed entirely of the encoding's alphabet
   are reachable — hex **0.66%** of the vocab, base64 **19.91%**, ASCII letters+space **53.0%**.
   On base64 BPE emits just 1,465 distinct tokens at 8.77 bits/token against a nominal 17.61.
   That ratio *is* the 2× gap.

**Also corrected:** the encodings are *not* all within a few percent. base64/85/91/58 span 2.8%,
but **hex is 24.8% higher** (1.137 tok/byte, 2.50× the bound) because it is 62.6% digits and
thrashes the digit/letter boundary.

**Cite instead:** Zouhar et al., *A Formal Perspective on Byte-Pair Encoding* (ACL Findings 2023,
arXiv 2306.16837) — greedy BPE provably achieves only `(1/σ)(1−e^(−σ))` of optimal compression
utility, empirical lower bound ≈ 0.37. Say *"~2× the counting bound, set by pre-tokenization and
merge coverage"*, never *"entropy floor"*.

### 12.2 Markdown's token advantage is real, small, and mostly not markdown's

The 37.9% figure is **inherited, not measured here**, from the improvingagents benchmark — whose
tokenizer is unstated and whose denominator is **pretty-printed** JSON. Against JSONL from the
same table it is **46.2%**. And CSV in that same table is **22.3% cheaper than markdown**: the
benchmark cited to praise markdown's economy puts markdown second.

Independent ladder over identical data (60 rows × 6 cols, o200k), each rung removing one thing:

```
json pretty      4,339  100.0%
json minified    3,020   69.6%   ← -30.4% is JSON's indentation
markdown table   1,506   34.7%   ← -51.1% is PER-ROW KEY REPETITION
json columnar    1,668   38.4%   ← same removal, still JSON
csv              1,461   33.7%   ← markdown's pipes are a net loss
```

**~91% of the apparent win is not markdown**: 41.4% is JSON's indentation, 49.3% is JSON-of-records
repeating every key per row — a *data-modeling* difference — and markdown's own syntax is a 1.4%
**loss**. Hold the data model fixed (columnar JSON) and markdown saves **9.7%**. Against CSV/TSV it
loses by 3–6%. And on **hierarchical** data a nested markdown list costs **157% of minified JSON**.

> **Markdown is a good tabular encoding and a bad tree encoding.**

### 12.3 Three findings that go the other way

- **Indentation is nearly free, and the old worry is obsolete.** In o200k/cl100k, **2 through 64
  spaces all cost exactly 2 tokens**, and `\n`, `\n\n`, `\n\n\n` all cost **1**. Indentation costs
  1 token per indented line regardless of depth; de-indenting the entire real corpus saves
  **0.67%**. The "markdown pays for whitespace" intuition is an r50k/GPT-2-era artifact.
- **gzip does not predict token count** — r=0.92 vs r=0.96 for raw bytes, with CV 36.9% vs 15.7%.
  DEFLATE has LZ77 backreferences and dedupes repeated JSON keys; BPE is a static dictionary with
  none, so gzip systematically mis-ranks formats. **Raw byte count is the better cheap proxy.**
- **Box-drawing glyphs are half-and-half**: `├ │ ─` cost 1 token, `└ ┌ ┐ ┘ ┬ ┴ ┼` cost 2. But the
  useful number is that **plain 2-space indentation is 42.9% cheaper than any tree-drawing glyphs**.

### 12.4 One actionable asset finding

gzip-then-base64 of the vault's SVG: **0.060 tok/byte — 1,313 tokens against 9,419 raw and 19,002
base64.** A **14×** reduction for any asset the model must carry but never edit. This project's own
measurement table already contains that number and files it as a footnote; it deserves to be a rule.

---

## 13. Editor bugs found during this research — both FIXED in `58322f7`

Kept as a record of what the audit found and what it cost to fix, not as an open worklist.

- `src/modules/vault/infrastructure/search-index.ts` — stripped fenced code blocks **and** inline
  code before indexing, so ~30% of content tokens were unfindable. **Fixed:** code is extracted into
  its own MiniSearch field rather than kept in `body`, because `body` also backs unlinked-mention
  scanning where a title inside a code sample is a false positive, not a mention.
- `src/modules/graph/presentation/graph-data.ts` — unresolved links silently dropped. **Fixed:**
  `buildGraph` now returns `unresolved: UnresolvedLink[]` alongside nodes and links. Graph edges are
  unchanged and the existing tests asserting zero edges still pass.
- **A third bug surfaced while writing the test.** The `target-excluded` branch was unreachable:
  `basenameToPath` is built from included notes only, so anything it resolves is included by
  construction. A note that existed but opted out of the graph was indistinguishable from one that
  did not exist. Fixed with a diagnosis-only map; resolution semantics untouched.

Verified at fix time: typecheck clean, **2,366 tests passing across 164 files** (8 new), architecture
gate 0 violations.

**One defect remains open, deliberately — it is a product decision, not a bug fix.**
`searchNotes` runs `prefix: true, fuzzy: 0.2`, which admits edit distance 2 on any 8-character term
(`maxDistance = min(6, round(len × 0.2))`). Measured against a relevance set built from the vault's
own wikilinks: on a sentence lifted verbatim from a note, the live configuration ranks that note
first **0.33% of the time**; exact-only is 16× better on MRR at **−90% latency**. `combineWith: 'AND'`
alone was worth 10×. Not applied, because it changes search *relevance behaviour* rather than
correcting a logic error.

---

## 14. Folded in from the graph-engineering research (2026-07-30)

Source: `HANDOFF-graph-engineering-research-2026-07-30.md` (untracked, repo root), from an analysis
of YouTube `H7t3uUp3HVw`. **That handover complements this plan and does not supersede it** — its own
Part III.B is the supersession table, and it is correct. Only the additive residue is recorded here.

### 14.1 The correction worth keeping

*"Graph engineering"* is a **community coinage that trended mid-July 2026, not an Anthropic release.**
The patterns it names — parallelization, orchestrator-workers, evaluator-optimizer — are from
Anthropic's *Building Effective Agents* (December **2024**); LangChain publicly argued the concept is
nothing new. Anything citing it as a 2026 product launch is repeating marketing.

### 14.2 The one durable engineering lesson

> **"The node that does the judging is the one place where saving tokens costs you everything."**

Observed concretely: a Haiku reviewer returned a long list of issues that were mostly *intentional*;
Opus flagged fewer, all real. This is the empirical case for §4's rule that **a strong model judges**,
and it converges with §4's precision argument from the opposite direction — a weak judge does not
merely miss defects, it manufactures false ones, which is the failure mode that gets a checker
disabled permanently (§9, Phase 3 gate).

### 14.3 Agent-graph vs knowledge-graph — and why §2.1 is the rigorous version

The research thread's pivot was noticing two different graphs share one name: an **agent** graph
(nodes = agents, edges = data flow) versus a **knowledge** graph (nodes = notes/blocks, edges =
links). Agent-graph ideas belong to the editor's AI features; knowledge-graph ideas belong to the
engine.

**§2.1 already states this rigorously and more usefully:** a single `.md` file is a tree over a
closed 21-label alphabet and **cannot carry any edge that is not parent-child**, so cross-file
relations live in a resolver, never in syntax. The informal distinction is a special case of the
tree/graph boundary.

### 14.4 What is genuinely additive — verified, and narrower than claimed

The handover flagged one candidate as `[UNVERIFIED]`: an editor-side **AI-review orchestrator**
(fan-in-at-barrier, multi-lens, judge-model routing). **Verified against the code: it is absent.**
What exists is adjacent but differently shaped —

| shipped | what it actually is |
|---|---|
| `ai/application/suggest-links.ts` | edge suggestion, **untyped** — `{phrase, basename}`, no relation, no confidence, no provenance, no pending state |
| `ai/application/link-doctor.ts` | a **batch runner** over paths at concurrency 3 — not a multi-lens review |
| `ai/infrastructure/provider-race.ts` | races providers for **latency**: *"the first non-empty success wins and the losers are aborted"* |

**A race is first-wins; a barrier is wait-for-all-then-synthesise. They cannot be the same code
path.** So the orchestrator is additive, and should be built *on* `ports.ts`'s `LlmClient` and the
race primitive rather than beside them. Constraints if built: deterministic lenses first and free
(schema, links, structure — 0 tokens, 0 false positives), model lenses only after, **disjoint** by
LR#20, strong judge per §14.2, findings entering at tier **W** per §4.

### 14.5 A gap between shipped code and this plan

`suggest-links.ts` returns bare suggestions with **no tier**. §1.3 and §4 require an inferred
constraint to start at **W** and reach **E** only by human acceptance. The shipped path has no such
state, so an AI suggestion is currently indistinguishable from an accepted fact. **Closing that is a
prerequisite to Phase 3**, not an enhancement.

### 14.6 Reconciliation against `docs/FRONTMATTER-PRODUCT-PLAN.md` and `FEATURE-GAP-REPORT.md`

Read in full 2026-07-29. The product plan is **demand-side** research (92 sourced pain points, 20-app
competitor matrix, 2026-07-12/13); this plan is **engine-side**. They were produced independently and
mostly converge — which is the strongest evidence either of them has.

**Convergences, and they matter because the methods were independent:**

- **Splice-only, decided twice.** Product plan §4b, 2026-07-13: *"**Single CodeMirror 6 engine** for
  WYSIWYG … NOT a second ProseMirror engine — **byte-identical no-edit round-trip (R-FIDELITY)
  becomes a permanent CI gate**."* That is §1.2's requirement, locked from product reasoning **two
  weeks before** the TOPLAS 2007 lens proof was found. Independent derivation.
- **The wedge, decided twice.** Product plan Pillar 1: *"Round-trip-sacred frontmatter … (the app is
  NAMED frontmatter — this is the credibility signal)"*, and Phase 0 item 6 makes YAML-preserving
  property edits a shipping gate. §1.5 reached the same place from Obsidian's `processFrontMatter`
  source and its 4.6M-vs-2,000 demand ratio. **Pain theme T13 is the market-side evidence for it.**
- **Stand-off annotations.** Product plan §4b: *"Comments/suggestions live in Supabase sidecar but
  with guaranteed materialization … deleting the Supabase layer must leave a valid markdown repo."*
  That is the only model TEI's overlapping-hierarchy result leaves open (§14.3, and the CONCUR
  removal in XML 1.0). Same conclusion, different literature.
- **`suggest-links` is listed ✅ shipped** in the product plan's head-start inventory, confirming
  §14.5's finding — and making the missing tier a live gap in *shipped* code, not a planning gap.

**A CONFLICT that needs a product decision — flagged, not resolved here.**

| document | position |
|---|---|
| `FRONTMATTER-PRODUCT-PLAN.md` §4b (2026-07-13, "tension resolutions") | **"No peer CRDT.** Server-authoritative sequencing over the existing merge3 + baseSha engine; session-batched commits with `Co-authored-by`; live layer ephemeral, file remains the document." |
| this plan, §8 | Collaboration via **Eg-walker / Braid `simpleton`** — a CRDT whose event graph is disposable and git-ignored |

**These are different architectures.** Server-authoritative is legitimate — it is Overleaf's, which §8
itself cites approvingly — but §8 currently reads as if the choice is open when the product plan
closed it earlier. Anyone building from §8 alone would build the wrong thing.

Note also an unresolved tension *within* the product plan: Pillar 3 lists "CRDT merge (Yjs/Loro)" and
Pillar 5 lists "Multiplayer editing (CRDT, Yjs + Supabase Realtime)" as planned, while §4b says no
peer CRDT. §4b is later and is explicitly a resolution, so it presumably governs — but the feature
tables were never updated.

**Until Sagnik rules:** treat §8 as *"what the CRDT literature makes available"*, and
`PRODUCT-PLAN §4b` as *"what this product has chosen."* Where they differ, the product plan governs
the editor track and §8 governs only what the engine must not preclude.

**Feature-gap cross-check (`FEATURE-GAP-REPORT.md`):** C10 comments ❌, B4 multiplayer ❌ (XL), G2
vault-RAG ❌ (L) — so §14.4's verdict stands: no AI-review orchestrator anywhere in the planned
surface. S3 "Properties / frontmatter UI" ⚠️ *parsed, no UI* is the concrete ticket the §1.5 wedge
must be built behind.

### 14.7 Deliberately not adopted

The handover's Part II proposed a `Markdown++` superset with a typed-link sigil `[[id | rel]]`, a
`content_hash` identity column, stored community/centrality, and remark-based extraction. Each is
superseded by §10, §1.1a, §2.3/§2.4 and §3.2 respectively; the handover's own Part III.B says so.
Recorded here only so the decision is not re-opened by someone reading Part II in isolation.

---

## 15. CORRECTION — markdown is far more extensible than §10 claimed

Added 2026-07-29 after five agents re-examined the extensibility question **openly**, briefed to
build the strongest case FOR extending markdown rather than to confirm the prior. Three of the
findings overturn positions this document previously stated as settled. All headline numbers below
were re-verified in the main loop before being written here.

### 15.1 Fence dispatch is the winning mechanism, and §10 called it a negative result

CommonMark, verbatim: *"Although this spec doesn't mandate any particular treatment of the info
string, the first word is typically used to specify the language."* **That refusal to define
semantics IS the extension point.** A renderer matches one string and replaces the node; every
non-participating tool degrades to a code block. Coordination cost: zero.

Measured on GitHub code search, same method, same day, re-verified in the main loop:

| | files |
|---|---|
| `.md` files containing a ```` ```mermaid ```` fence | **330,496** |
| `.mdx` files that exist at all | 259,136 |
| 13 fence languages summed | 475,190 (**1.83×** the entire MDX corpus) |

npm/week: `mermaid` **11,733,880** · `@mdx-js/mdx` 8,848,466 · `@djot/djot` **693** (16,932×).
Mermaid renders natively on **30 platforms** that never coordinated. GitHub shipped it 2022-02-14
with a purely operational rationale — **there is no standardisation story because there was no
standardisation.**

> **⚠ CORRECTION — the absolute counts above are real; the RATE is not high.** Measured directly on
> a 42,643-file corpus: mermaid appears in **340 of 37,990 external files (0.89%)**, and **0.26%**
> excluding mermaid's own docs. On this repo's vaults: **7 of 4,229 (0.17%)** and 0 of 410. Against
> GitHub's own `.md` proxy, 330,496 / 18,841,600 = **1.75%**. All non-code diagram/math fences
> together are **3.45% of fences**.
>
> So what fence dispatch demonstrates is that **the mechanism works permissionlessly** — 30
> uncoordinated platforms — **not that it is widely used.** Do not cite the absolute count as
> evidence of penetration; that was an error in the first draft of this section.

**And the fence is a real container primitive, not a code-display feature.** Tested: fence widths
3→500 backticks all parse; a **13-level recursive nest** unwrapped with the innermost payload
byte-identical; a fence body containing YAML frontmatter, an HTML comment, its own fence, a GFM
table and a link came back as one `code` node with `value` byte-identical to input.

### 15.2 Declare, never redefine — the rule with experimental backing on both sides

| regime | evidence | verdict |
|---|---|---|
| **Declare a NEW notation** (no prior) | MTOB: Gemini 1.5 Pro given a Kalamang grammar book in context scored **58.3 chrF vs a human learner's 57.0** | **works at human level** |
| **Redefine an EXISTING notation** (strong prior) | Wu et al., *Reasoning or Reciting?*: GPT-4 two-digit addition **98.2% base-10 → 38.6% base-9**, with the base stated in the prompt and the comprehension check still high | **collapses** |

**The above was too strong, and a fifth experiment corrected it within the hour.** A deliberately
prior-conflicting notation — `` `code` `` means a *person*, `**bold**` means a *date*, `> quote` is
the title and comes *after* the metadata, dependency lists written in **reverse order** — scored
**140/140 on generation** and 120/120 on parsing, with a negative control catching 10/10 injected
faults, so the harness demonstrably works.

**Reconciling the two:** they measure different things.

| | example | result |
|---|---|---|
| Redefine a **procedure** — the model must *compute* differently | `+` now works in base 9 | **collapses** (98.2% → 38.6%) |
| Redefine a **denotation** — the model must *label* differently | `` `x` `` now marks a person | **holds** (140/140) |

Markdown notation is denotation, not procedure. **So the design is safer than the base-9 result
implies.** The revised rule:

> Redefining what a symbol **denotes** is safe. Redefining how an operation **computes** is not.
> A read error is recoverable — the file on disk is still correct. **A write error corrupts the
> user's file.** Gate the write path, not the vocabulary.

Prefer novel sigils (`?>`, `=>>`, `::decision`, `@@`, `..`) anyway — not because models can't handle
reuse, but because reuse costs the *human* reader and forfeits existing markdown tooling.

**And the familiarity argument is weaker than assumed.** Table Meets LLM (WSDM 2024) spans just
**1.66 points** across five serializations — HTML 65.43%, XML 65.33%, JSON 64.33%, Markdown 63.77%.
Pretraining familiarity buys single digits. It does not carry an argument.

### 15.3 The cost of a construct is ~139 lines, not a format-scale project

Built end to end this session — a `==highlight==` inline construct absent from CommonMark and GFM
and not expressible as a directive:

```
micromark syntax extension    85 lines
mdast from/to handlers        34
unified + rehype glue         20
                             139   ← compiler side, 13/13 round-trip cases stable
@lezer/markdown (CodeMirror)  14   ← editor side
                             153   total, both parsers
```

**That is roughly two orders of magnitude below what "don't build a format" implied.** And the large
fixed cost is already paid: `remark-directive` (**3,176,157 downloads/week**) ships `:::name{k=v}`,
`::leaf`, `:text[x]` with full attribute grammar and lossless round-trip — ~1,945 lines you do not
write. *Most of a "custom format" is just remark-directive plus chosen names.*

**Correction to a claim this project previously reported:** the `[` → `\[` corruption in directive
round-trips happens **only when the extension is registered on parse but not on stringify**. With
both halves registered — which we control — it is byte-identical. Half-registered fails *loudly*.

### 15.4 The constraints that survive, and they are the real design inputs

- **The fence body is opaque to every markdown tool.** Verified: a link inside a fence does not
  appear in the mdast link inventory; frontmatter inside a fence produces no `yaml` node. No link
  checking, no backlinks, no search indexing, no diagnostics, no rename propagation. **Every fence
  is a hole in the graph a linker is trying to build.**
- **The info-string meta dies at HTML serialization.** mdast keeps it, hast keeps it in a non-standard
  side channel, HTML emits only `class="language-x"`. Only the first word has standardised transport.
- **`node.data` never reaches disk.** Confirmed empirically *and* by zero `.data` hits in
  `mdast-util-to-markdown/lib/`. `hName`/`hProperties`/`hChildren` survive into hast only. Metadata
  must be syntax or sidecar — it cannot ride on a node.
- **Two parsers, forever.** micromark for the compiler, Lezer for CodeMirror. A per-construct tax,
  small but permanent, and they disagree at the edges. Every construct needs a shared conformance
  fixture run against both.
- **Silent-disable failure modes.** Four spaces of indentation, or one backtick in a backtick-fence
  info string, disables dispatch with no error anywhere.

### 15.5 The deciding constraint against the MDX path — and it is not adoption

**MDX cannot write the document back out.** Markdoc's `format()` is byte-identical and idempotent;
MDX has no equivalent and cannot have one, because arbitrary JavaScript expressions do not
losslessly re-serialize to source. For a product that edits and saves, that is disqualifying — and
it is independent of market share entirely.

MDX also *deletes* four CommonMark constructs in three lines (`autolink`, `codeIndented`, `htmlFlow`,
`htmlText`) and **silently miscompiles valid CommonMark**: `the set {1,2}` renders as `the set 2`,
with no warning at any stage.

### 15.6 Independent convergence: GitHub shipped this architecture

**GitHub Agentic Workflows** (`gh-aw`, technical preview 2026-02-13) compiles `workflow.md` →
`workflow.lock.yml`, and *"GitHub Actions executes the lock file while referencing the markdown for
instructions."* Rich deterministic frontmatter; natural-language body; **Safe Outputs** so the agent
has no write access and a separate permissioned job applies changes.

That is the compiler-plus-lock-file architecture this plan converged on independently, shipped by
GitHub, in production. It is the strongest external validation the thesis has.

### 15.7 What this changes

**Keep:** no new dialect requiring its own parser (§10 row 1, strengthened). Keep splice-only, the
anchor, the confidence ladder, and every measured result in §11a and §12.

**Change:** extension is not forbidden — it is *cheap*, and it must go through **dispatch** (fence
info string, directive name, frontmatter vocabulary) rather than through a new dialect. Add one hard
rule: **never redefine a symbol CommonMark already defines.**

**Add to the build:** edges belong in a **manifest**, never in prose — every serious system measured
does this (`gh-aw`'s `.lock.yml`, Obsidian's `.canvas`, Logseq's `.edn`, Altari's app-side catalog).
Note that Obsidian and Logseq, the two vendors most committed to markdown-as-substrate, both
invented a **non-markdown sidecar** when they needed an editable graph — Obsidian went as far as
publishing JSON Canvas as an open standard rather than encode it in markdown. **No shipping product
writes graph layout back to markdown.** Write-back exists only for identity operations: rename →
relink, and block-reference → ID injection.

### 15.8 The three rules that actually govern a declared notation

From a dedicated experiment (four notation arms × read / write / edit-under-load, 1,200 field
judgments, plus a 10/10 negative control) and the instruction-following literature.

**Rule 1 — declare by EXAMPLE, not by rule. This is the highest-value finding in §15.**

Aycock et al. (arXiv 2409.19151) ablated MTOB and found *"almost all improvements stem from the
book's parallel examples rather than its grammatical explanations"*, and — flatly — *"we find no
evidence that long-context LLMs can make effective use of grammatical explanations."* Replicated
across Kalamang, Nepali and Guarani.

The naive frontmatter design states rules (*"`..` means due-date"*). The evidence says models take
their competence from **worked examples**. So a `vocab` entry must carry two or three annotated
instances of each construct, not a sentence describing it. Nearly free, and it targets the exact
mechanism the design depends on.

**Rule 2 — cap the vocabulary in the single digits, and enforce the cap in the product.**

IFScale (arXiv 2507.11538, 20 models, seven providers): *"even the best frontier models only achieve
68% accuracy at the max density of 500 instructions."* Reasoning models hold near-perfect through
~100–150 then threshold-decay; mid-size decay linearly; small models exponentially. There is also
**primacy bias** — early instructions are honoured more reliably than late ones.

A declared notation *is* a set of standing instructions, and the geometry is unfavourable: the
declaration sits at the top of the file where compliance is highest, but the constructs must fire in
the fortieth note, where it is lowest. **Construct count is the parameter that decides whether this
works, and a feature inviting users to declare their own syntax will violate it by default.**

**Rule 3 — the renderer is already a parser. Make it the write gate. Do NOT use constrained decoding.**

Grammar-constrained decoding fails exactly where a user-declared notation lives — empirical coverage
on complex ("GitHub Hard") schemas: **Guidance 41%, llama.cpp 39%, XGrammar 28%, Outlines 3%**. And
Grammar-Aligned Decoding (NeurIPS 2024) shows naive masking *"distorts the output distribution"* —
you get strings that are grammatical and low-likelihood, i.e. valid and bad.

Validate-and-repair gets the same guarantee at no distribution cost, and it is the **cheapest
applicable verifier** per §4's ladder. Every AI write passes through the parser before touching disk;
a parse failure or a semantic round-trip mismatch triggers repair, never a silent save.

**The failure mode this prevents, stated precisely.** JSON fails *loudly* — a parser throws, a retry
fires. A private prose notation fails *quietly*: the model writes `~ doing` instead of `~doing`, or
falls back to `**doing**` under load, the renderer does not match, and **the field silently
vanishes**. The document still looks like a document. Nothing throws. The next agent to read the file
sees a note with no status and treats the absence as information.

**Two supporting results:**
- **Declared syntax is 31% smaller** than the equivalent in ordinary markdown; the declaration costs
  ~593 bytes once and saves ~52 bytes per note — **break-even at about 11 notes.** So terseness is a
  real argument for a private notation, independent of expressiveness.
- **Constrained decoding's reputational hit is model-specific, not universal.** "Let Me Speak Freely?"
  reports Claude-3-Haiku −63.1pp on GSM8K under JSON mode but **Gemini-1.5-Flash −0.1pp**, and
  JSONSchemaBench finds the *opposite sign* (+3.3 to +3.7pp) with Guidance. Do not cite a single
  number here as settled.

**The measurement that has NOT been made, and it is the one that decides the operating point:**
every number above is Opus-class, five constructs, one task at a time, with the declaration in
immediate context. The model that will actually write into a user's file in an editor is smaller and
faster, and every published curve says that is precisely where format adherence collapses. **The
experiment establishes a ceiling, not an operating point.** Re-run the harness against the production
model before shipping a notation feature.

---

## §16 — The utilization sweep: what the plugin ecosystems reveal

Added v0.5.0, 2026-07-30. §15 argued markdown is *extensible*. §16 asks a different and more
useful question: **extensible toward what?** The answer is not a matter of opinion — six ecosystems
have been voting with implementations for a decade, and the votes are counted.

Method: the Obsidian community catalogue is a ranked, download-weighted list of things markdown
cannot do. Every plugin is a person who wanted something badly enough to build it. Read as revealed
preference, the catalogue is the most honest requirements document available for this project.

### 16.1 The headline, and it replicates three times

Live catalogue, re-verified 2026-07-30 (the file updates daily, so exact totals drift):

```
stats entries=6118   catalogue entries=6112   matched=6047
total cumulative downloads=132,834,339   median=628
top10 share=27.5%   top300 share=83.9%
```

Classifying the **top 300** (83.9% of all demand) into five gap classes — FORMAT (markdown cannot
express it), RENDER (can express, cannot present), ERGONOMICS (expressible but hostile to
hand-editing), APP (editor behaviour), EXTERNAL (sync/AI/import):

| gap class | n | cumulative | share |
|---|---|---|---|
| **F — markdown cannot express it** | 78 | 44,622,998 | **40.1%** |
| R — can express, cannot present | 23 | 3,747,303 | 3.4% |
| E — syntax exists, hostile to hand-edit | 14 | 6,720,063 | 6.0% |
| A — app/editor only | 118 | 34,592,652 | 31.0% |
| X — external service | 67 | 21,727,694 | 19.5% |
| **FORMAT IMPLICATED (F+R+E)** | **115** | **55,090,364** | **49.4%** |

**Two-fifths of revealed demand is markdown failing to express something.** The app-gap column is
real and large, and it is *smaller* than the format column — the opposite of what "markdown is fine,
the apps are just limited" predicts.

The number replicates across three populations that share no mechanism:

| dataset | weight | hard format gap | F+R+E |
|---|---|---|---|
| Obsidian plugins, top 300 | 111.4M downloads | **40.1%** | 49.4% |
| Obsidian forum feature requests, top 45 | 22,042 likes | **39.0%** | 48.1% |
| VS Code markdown extensions, top 45 | 68.2M installs | **35.4%** | **85.9%** |

What people *build*, what people *ask for*, and what people *install in a code editor* converge on
35–40%. VS Code's F+R+E is far higher for a structural reason worth naming: **VS Code has no PKM app
layer to be missing**, so app gaps barely register. Strip the app layer and markdown's share of the
complaint rises toward 86%.

> **Metric caveat, load-bearing.** Obsidian's `downloads` field sums over *every release*, so it
> rewards release frequency, not adoption. Median release count in the top 300 is 31; median
> cumulative/peak ratio 2.7. Excalidraw is #1 on cumulative and **not top-30 on peak installs**.
> Recomputed on peak-single-version the F share is 33.3% and F+R+E is 45.8% — the conclusion holds
> on either metric, which is the only reason to trust it.

### 16.2 The Logseq natural experiment — the causal evidence

Logseq's *format* natively has block IDs, `key:: value` properties, a query language, task states
with `SCHEDULED:`/`DEADLINE:`, and spaced repetition. Obsidian's does not. Compare cluster sizes:

| capability | Obsidian plugins | Logseq plugins | Logseq native? |
|---|---|---|---|
| spaced repetition / flashcards | **70** | **2** (both merely Anki *sync*) | yes |
| query / database | 46 | 20 (mostly UI over the native query) | **yes** |
| task management | 149 | 30 | **yes** |
| kanban / board | 63 | 6 | no |
| tables / spreadsheet | 128 | 12 | no |

Logseq is a *worse app* than Obsidian by most measures, yet every cluster corresponding to a native
format feature is **10–35× smaller**, and the clusters where neither format helps (kanban, tables)
stay proportionally large. **When the format absorbs a capability, the plugin cluster collapses.**
That is as close to a controlled experiment as this domain offers, and it is the strongest available
answer to "are these format gaps or app gaps?"

(Logseq publishes no download counts. This is an ordinal presence/absence signal, deliberately
unweighted — it is not comparable to the Obsidian and VS Code percentages above.)

### 16.3 The datapoint that cuts against extending markdown

Faced with the largest format gap in its own ecosystem — Dataview, a 4.65M-download query DSL living
in a fence — **Obsidian did not extend markdown. It shipped two new file formats.**

- **`.base`** (YAML): `filters` with nested `and`/`or`/`not` and functions (`file.hasTag()`),
  `formulas` with an expression language, `properties`, `views` (`type: table`, `groupBy`, `order`,
  `limit`), `summaries` (`values.mean().round(3)`).
- **`.canvas`** (JSON, open spec v1.0, 2024-03-11): `nodes` with x/y/z-index, and **`edges` —
  directed, labelled, typed.**

The two things markdown provably cannot express — **spatial arrangement and typed relations** — each
got a non-markdown sidecar file. A third plugin generation is already growing on top: **78 Bases
plugins, 396,460 downloads**, and the kanban gap reappeared *immediately* on the new substrate
(232 forum likes for "Bases: kanban view", plus four independent Bases board plugins).

**This is genuine counterevidence to this project's direction and it is recorded as such.** The
best-resourced actor in the ecosystem examined the same gaps this section catalogues and concluded
markdown was the wrong place to put them. Any decision to extend markdown instead must be made
knowing that — not in ignorance of it.

The absorption pattern is otherwise consistent, and every absorption is the vendor conceding a
format gap: Admonition (934k) → native callouts. Footnotes → native. Block refs → native `^id`.
Properties UI → native. Query → `.base`. Canvas → `.canvas`.

### 16.4 The ranked gap list

Severity weights, not a partition — a plugin may serve more than one primitive, so these do not sum.

| # | missing primitive | install weight |
|---|---|---|
| 1 | **Embedded freehand graphics** (drawing, whiteboard, diagram as content) | 8,791,289 |
| 2 | **Task semantics beyond a binary checkbox** (due, scheduled, recurring, status, priority) | 8,543,855 |
| 3 | **A queryable relation over documents** (data model + query language) | 7,222,563 |
| 4 | **Templating, variables, computed content** | 7,162,433 |
| 5 | **Page-level presentation metadata** (icon, banner, per-document chrome) | 4,924,973 |
| 6 | **A cell grid with formulas; tables that merge and nest** | 3,821,379 |
| 7 | **Board / non-linear spatial arrangement of blocks** | 3,545,560 |
| 8 | **Alternative output projections from one source** (slides, print, pagination) | 2,459,584 |
| 9 | **Addressing into external documents** (PDF page/region, media timecode) | 2,398,025 |
| 10 | **Semantic block types** (a callout with declared meaning) | 1,607,696 |
| … | inline text attributes · calendar/event semantics · interactive widgets and data binding · charts and maps from document data · inline syntax CommonMark omits (emoji, footnotes, extended math) · user-defined record types · **typed directed links** · review/scheduling state · **multi-file composition** · executable blocks · grid layout · figure/caption semantics · per-block encryption | 880k–1.5M each |

**Four cross-cutting absences have no row because no plugin can implement them.** They surface in the
forum data instead, and they are the ones that matter most here:

1. **Stable identity.** Rename a heading and every link to it dies (340 likes). A note's identity
   *is* its filename (711 likes). Every refactoring plugin in the ecosystem — Tag Wrangler at 1.0M,
   Consistent Attachments and Links at 131k, Filename Heading Sync at 68k — exists to paper over
   this. **This is the gap §1.1a's re-anchoring algorithm addresses, and the ecosystem confirms it is
   real, load-bearing, and unaddressed.**
2. **Composability.** Constructs do not nest. A checkbox inside a table cell is unexpressible
   (299 likes); Dice Roller advertises working inside a table cell as a *feature*.
3. **An extension mechanism with a namespace.** See §16.5.
4. **A place for mutable machine state.** See §16.5.

### 16.5 Six placement strategies, all in production, all colliding

Every plugin that extends markdown must choose where to put its syntax. All six choices are in use at
scale, which is itself the finding — there is no convention, only an unmanaged commons.

1. **A fence with an invented mini-language** — the dominant choice, and therefore an *ad-hoc
   namespace registry with no coordination*: `dataview`, `chart`, `leaflet`, `button`, `ad-tip`,
   `col`, `tx`, `meta-bind`, `column-settings`.
2. **Inline sigils in prose** — `key::` (Dataview), `📅 2022-12-17` (Tasks), `::`/`?`/`??` (SR),
   `dice: 1d20`, `` `= expr` ``, `` `#: expr` ``. **This is where the collisions live.**
3. **Frontmatter as a typed record store** — and it is doing enormous unintended work. TaskNotes puts
   RFC-5545 recurrence rules in it (`recurrence: "FREQ=WEEKLY;BYDAY=MO"`); Metadata Menu builds a
   *class system* on it; Breadcrumbs hoists a typed graph into it; Longform declares a manuscript
   tree in it. The #3 forum request (781 likes) is literally *"let frontmatter nest."*
4. **Comments as a private data channel** — Kanban writes JSON config into `%% … %%`; Spaced
   Repetition writes **mutable scheduling state** into `<!--SR:!2023-09-02,4,270-->`. Both are
   smuggling machine state through a channel designed to be discarded, because the format offers
   nowhere legitimate to put it.
5. **Overloading an existing construct** — Kanban: `##` = lane, `***` = archive boundary, literal
   `**Complete**` = done-lane flag. Multi-Column: `---` = region delimiter (already thematic break
   *and* frontmatter fence). SR: `==highlight==` = cloze. Image Captions: the wikilink alias slot.
   **Every one produces a file that silently corrupts when edited as ordinary markdown** — Kanban's
   board breaks if you add an H2.
6. **A separate file format** — Excalidraw's `.excalidraw.md`, and decisively Obsidian's own `.base`
   and `.canvas` (§16.3).

**The collisions are live, not hypothetical.** Spaced Repetition's single-line card separator is
`::`. Dataview's inline field syntax is `key:: value`. Both are top-50 plugins (569k and 4.65M) and
they occupy the same two characters. This is what an extension mechanism without a namespace looks
like at scale — and it is a direct argument for §15's conclusion that any notation this project
introduces must be **namespaced and declared**, never a bare sigil.

### 16.6 Two designs to steal outright

- **Excalidraw's dual encoding.** The authoritative payload is opaque compressed JSON, but the file
  *also* carries a plain-text `## Text Elements` projection so grep, vault search, and any dumb
  markdown reader still see the content. It is the only design in the 6,047-plugin catalogue that
  solves rich content **without making the file illegible to every other tool** — which is exactly
  the constraint §2's invariants impose. Adopt the pattern: opaque payload plus searchable projection,
  same file.
- **Spaced Repetition's inline-or-sidecar toggle for mutable state.** The same scheduling data can
  live in a comment beside the card or in a separate location, user's choice, because locality vs.
  diff-cleanliness genuinely has no single right answer. Make it a declared option, not a hardcoded
  assumption.

### 16.7 Tables are an ergonomics gap, not a format gap

The clearest single misdiagnosis this sweep corrects. Markdown *has* tables. **3,057,811 downloads
went to Advanced Tables purely to make the existing syntax survivable**, plus 193k for Excel-paste
conversion, 116k for a table editor, 61k for a generator. Only 391k went to genuine expressiveness
gaps (formulas, merged cells). Category mix: **90% ERGONOMICS, 10% FORMAT.**

**The lesson is not "markdown needs tables." It is that a syntax requiring manual column alignment
spawns a tool ecosystem regardless of its expressiveness.** Any construct this project adds must be
checked against that: *is it writable by hand without a tool?* If not, it will grow a plugin whether
or not the semantics are right.

### 16.8 The two supply-starved gaps — and why they matter most here

Almost every gap in §16.4 has many competing implementations. Two do not, and the asymmetry is the
most interesting finding in the sweep.

**Typed links: 820 forum likes — #2 request overall, #1 pure-format request — against 5
implementations above 5k downloads**, led by Breadcrumbs at 240k. Compare "board" (16 implementations,
2.99M) or "mindmap" (12, 2.06M).

**Multi-file composition: 449 likes** for a Gingko-style document-as-tree-of-cards and **174** for
"Document Spanning" — both in the forum's most-liked plugin ideas, **both unbuilt**, while nearly
every other top idea in that category eventually shipped.

Enormous demand, near-zero supply. **That is the signature of a gap a plugin cannot close.** A board
can be faked by overloading headings; a mindmap can be rendered from lists. But a typed link needs
*the link itself* to carry the relation, and Breadcrumbs' only available workaround hoists every edge
into frontmatter — so the relation no longer lives at the point of reference. Users can feel the
workaround is wrong, which is why they keep asking instead of installing.

**These are therefore the highest-leverage things a format-level project can offer that no plugin
ecosystem will ever provide.** Obsidian conceded exactly this: `.canvas` has `edges` because markdown
could not.

### 16.9 What §16 changes

- **Confirms the project's core bet.** Stable identity is the #1 cross-cutting absence, it is what
  340 + 711 forum likes are asking for, and it is what §1.1a's re-anchoring algorithm delivers at
  99.627%. The ecosystem independently ranks this project's central invention as its top unmet need.
- **Names the two additive targets** — typed links and multi-file composition (§16.8) — as
  supply-starved rather than merely unbuilt, which is a much stronger reason to build them.
- **Hardens §15's namespace requirement** from a design preference to a measured necessity: `::` is
  contested between two top-50 plugins *today* (§16.5).
- **Adds a hand-writability gate** to any new construct (§16.7).
- **Adds the dual-encoding pattern** to the invariants toolkit (§16.6).
- **Records real counterevidence** (§16.3). Obsidian chose sidecar files over markdown extensions,
  twice, for the two hardest gaps. That does not settle the question, but it must be answered rather
  than ignored — and the honest form of the answer is that this project's differentiator is *identity
  across edits*, which a sidecar file cannot provide, not *expressiveness*, which one can.

---

## §17 — The utilization sweep, part 2: what breaks outside English

Added v0.6.0, 2026-07-30. §16 asked what markdown cannot express. §17 asks a narrower question with
sharper answers: **for the constructs markdown DOES have, where do they stop working?** Three sweeps
— security, accessibility, internationalization — each measured against live libraries and this
repo's own vaults. Every number below was re-derived locally before being written here.

### 17.1 The finding that most changes the plan: normalization

**§2's canonicalization rule is independently confirmed, and it is not implemented.**

The plan already says: normalize for the HASH ONLY, never the bytes written, because NFC on a Bengali
file produces a phantom diff via composition exclusions. An independent sweep measured exactly that,
on a real file in the `md` vault (`Research/Satinath Chattoraj/Satinath - Poems.md`, 14,187 bytes):

```
U+09DC BENGALI RRA  NFC -> U+09A1 U+09BC   NFC == raw?  false
U+09DF BENGALI YYA  NFC -> U+09AF U+09BC   NFC == raw?  false
U+09DD BENGALI RHA  NFC -> U+09A2 U+09BC   NFC == raw?  false

lines changed by NFC:            77 of 437
headings whose bytes change:      3 of 11
Bengali words in file:           462 unique
normalization-sensitive:          45  (9.7%)
```

These three are **composition exclusions**: NFC *decomposes* them rather than composing. So "just run
NFC on everything" rewrites 77 lines of the user's own poetry and changes bytes he did not author.
That is why the rule is *normalize for comparison, leave storage byte-exact* — and the sweep arrived
at the identical wording from the opposite direction. **Convergent derivation of §2's most subtle
decision. Treat it as settled.**

What is new is the consequence, measured on this repo's shipped code:

```
grep -rn "normalize(" src/    ->  ZERO HITS
```

The rule is specified in the plan and performed nowhere. Two live effects, both verified against the
real modules:

- **Search.** The same visible Bengali word in two normalization forms: in-file form → 1 hit; NFC
  form → **0 hits**. They render pixel-identically, so nothing in the UI can ever explain the
  failure. Paste Bengali from a browser, another editor, or a different keyboard and search silently
  returns nothing for a word plainly present in the file.
- **Anchors.** `github-slugger` performs no normalization, so `[[Note#১. সাদা শাড়ী]]` resolves only
  if the link was typed in the same form as the heading. This bears directly on `file.md#heading`
  cross-file resolution.

**Action for the engine: `.normalize("NFC")` on the comparison key in slug generation, link-fragment
matching, and the search `processTerm` — indexing both forms — while the splice writer continues to
touch no byte it was not asked to change.** This is §2's invariant applied at three call sites, and
it is the cheapest high-value fix identified anywhere in the sweep.

### 17.2 Anchors are not stable under i18n, which undercuts §1's premise

§1 bets on durable identity. `github-slugger` is three operations — lowercase, strip `\p{P}|\p{S}`,
replace U+0020 with `-` — and each one leaks:

| class | example | both slug to | measured in vault |
|---|---|---|---|
| **CJK punctuation** | `搜索，笔记` / `搜索。笔记` | `搜索笔记` | collision by construction |
| **fullwidth space** | `中文 标题` (U+0020) vs `中文　标题` (U+3000, what a CJK IME emits) | `中文-标题` / `中文标题` | same heading, different anchor |
| **emoji** | `🎉 Release` / `🚀 Release` | `-release` | **252 emoji headings** |
| **Arabic** | `كتاب` / `كِتَاب` / `كــتاب` (tatweel) | three different anchors | presentational elongation changes identity |
| **Turkish** | `İSTANBUL` → `i̇stanbul` (stray U+0307) | untypeable anchor | locale-independent `toLowerCase()` |

In CJK, punctuation is the *only* separator, and the slugger deletes separators while converting
spaces to hyphens — so the collision is not an edge case, it is the common case. Emoji-prefixed
headings collide 100% of the time and disambiguate **positionally** (`-release`, `-release-1`), so
inserting a heading above renumbers every anchor below it. That is anchor *instability*, which is
worse than a hard failure: it breaks links that used to work.

Vault scan: 82,090 non-empty headings, 10,578 non-ASCII, **188 files with 189 colliding slugs**
(all ASCII case/hyphen collisions today, so this is latent rather than live — but the mechanism is
proven).

> One good result worth preserving: `extractOutline()` and `rehype-slug` **agree on all 8 i18n
> probes**, so the dual-slug design in `outline-utils.ts` is sound. The bug is in the slugger both
> of them share, not in the duplication.

### 17.3 Emphasis: markdown's own grammar fails outside Latin

The failure condition is narrower and sharper than "CJK has no spaces". `**粗体**中文` works fine.
What breaks is **punctuation inside the delimiter with a letter or ideograph outside it** — in Latin
the space after `**Note:**` satisfies right-flanking; CJK has no space there, so the run is neither
left- nor right-flanking and the delimiter cannot close:

```
**注意：**该文档已过期        -> literal ** in ALL FOUR engines
**সাদা শাড়ী।**আজও ভিজে      -> literal ** in ALL FOUR engines  (Bengali danda)
**ملاحظة:**النص              -> literal ** in ALL FOUR engines  (Arabic)
```

Tested against remark/micromark, markdown-it, commonmark.js, and cmark-gfm as GitHub actually runs
it. `commonmark/commonmark-spec#650` has been **open since 2020-05-26** with no assignee and no
linked PR.

Two consequences the plan must absorb:

1. **A live WYSIWYG divergence with GitHub.** CommonMark 0.31.2 widened "punctuation" to include the
   `S` symbol categories; micromark and commonmark.js ship `/\p{P}|\p{S}/u`, **cmark-gfm has not
   adopted it.** So `**price¥**tag`, `**A→B**next`, `**©2026**note` bold on GitHub and do *not* bold
   in this repo's preview. The vault is stored on GitHub. Same bytes, two renderings.
2. **The ecosystem's fix is CJK-only.** `remark-cjk-friendly` fixes 6 of 6 CJK cases with 0 Latin
   regressions — and **0 of 2** Bengali/Arabic cases, because the rule is gated on East Asian Width.
   Indic and Arabic have no fix, in-tree or out. For a project whose own corpus contains 19+ Bengali
   files, adopting the CJK plugin is not a solution, it is a partial one that must be labelled as
   such.

### 17.4 Bidi: markdown's delimiters are the wrong alphabet, and Trojan Source is live

Checked `\p{Bidi_Mirrored}` against markdown's syntax alphabet:

```
MIRRORS in RTL:      [  ]  (  )  <  >  {  }
does NOT mirror:     *  _  -  +  #  |  `  ~  !  :  =  \  ^  .
```

**Markdown's entire link and blockquote syntax is built from bidi-mirroring, bidi-neutral
characters.** In `[موقع](https://example.com)` the `](` boundary sits between an RTL and an LTR run;
as neutrals its resolved direction comes from context and the glyphs flip, so the source line's
visual order stops matching its logical order. That is *why* cursor placement becomes unpredictable —
the caret moves logically through text laid out visually. It is not a renderer bug and no parser
cleverness fixes it; it is what happens when a format uses paired brackets as delimiters and has no
direction channel. **This is a structural argument that belongs in §11's steelman, not a bug.**

And the security consequence is live in this repo, verified:

```
fenced code block   controls surviving into HTML: U+202E U+202C
inline code span    controls surviving into HTML: U+202E U+202C
link text           controls surviving into HTML: U+202E U+202C
heading             controls surviving into HTML: U+2067 U+2069

grep -rniE "202e|bidi_control" src/   ->  ZERO HITS
```

Trojan Source (CVE-2021-42574) inside a fenced code block that a human is reading in order to make a
decision. `let access = "user"; /*<RLO> } if (admin) {<PDF>*/` reaches the DOM with the override
intact, so the reviewer sees different logic than the bytes contain. **The engine should escape
`\p{Bidi_Control}` or render a visible marker; a compiler that silently passes them through is
actively harmful.**

### 17.5 Column ≠ character, and the product already gets this wrong

| script | codepoints | ASCII spaces | `Intl.Segmenter` words | display columns |
|---|---|---|---|---|
| English | 43 | 8 | 9 | 43 |
| Chinese | 21 | **0** | 15 | **42 (2×)** |
| Japanese | 19 | **0** | 13 | **38 (2×)** |
| Thai | 32 | **0** | 8 | 32 |
| Khmer | 29 | **0** | 5 | 29 |
| Bengali | 42 | 6 | 7 | 42 |

Three separate results, and they do not reduce to one another:

- **A space-based wrapper cannot wrap CJK at all** — zero break opportunities. UAX #14 permits a
  break between essentially any two ideographs, so the correct answer is the opposite extreme.
  `proseWrap` is not "slightly off" for CJK; **it is undefined**, and no format can decide it. This
  retires "reflow to 80 columns" as a candidate engine feature for anything but Latin.
- **Thai and Khmer are class SA — dictionary-only.** `Intl.Segmenter` is the only JS facility that
  does it and it works. The information is not in the document, so any word-boundary feature requires
  a runtime dictionary.
- **Graphemes ≠ columns.** `Intl.Segmenter` gives correct *cursor* movement; a UAX #11 width table
  gives correct *width*. Two different problems, two different tables. A table "aligned" by character
  count reads aligned in the source (18/20/18/20) and **misaligned on screen** (20/20/21/20).

Live in shipped code: `countWords` splits on `/\s+/`, so a 42-character Chinese paragraph counts as
**one word** (`Intl.Segmenter`: 30). Whole-file undercount on the vault's real Chinese files is
**1.7×–2.0×**, and reading time inherits it.

### 17.6 Tokenization: CJK search is prefix-only, measured on this repo's index

MiniSearch tokenizes on `/[\n\r\p{Z}\p{P}]+/u`, so a Chinese sentence splits into *clause*-sized
tokens, up to 17 characters as a single indexed term. Measured against the real `buildSearchIndex`
and the three-pass search this session shipped:

```
小红书      (clause-initial)  hits=1  found
再用对应    (clause-initial)  hits=1  found
有三个后端  (mid-clause)      hits=0  *** NOT FOUND ***
三个后      (mid-clause)      hits=0  *** NOT FOUND ***
命令组      (clause-final)    hits=0  *** NOT FOUND ***
```

Full-population recall (249 pairs, every query literally present in its own document):

| query position | finds its own document |
|---|---|
| Chinese, clause-initial | **100.0%** |
| Chinese, whole clause | **100.0%** |
| Chinese, clause-final | **35.7%** |
| Chinese, **mid-clause** | **18.1%** |
| *Latin control, whole word* | **100.0%** |

**A user cannot find a Chinese heading by searching the words in it** — the indexed token is
`通用注意事项` and the query `注意事项` is not a prefix. The rescuer is the prefix pass added this
session; the fuzzy pass cannot help, because `fuzzy: 1` is one absolute edit and the gap is 3.

This is a direct hit on §6's positioning. Search is the feature the vault-scale story rests on, and
outside Latin it degrades from 100% to 18%.

### 17.7 Automated a11y checkers cannot see markdown's failures — which is the wedge

On 2,286 real vault files rendered through this repo's actual pipeline onto its actual publish
surface, **axe-core 4.12.1 fired 7 of its 105 rules**, and **98.5% of 11,695 violation nodes trace to
two root causes in page chrome** (a missing landmark, an unlabelled GFM checkbox). Every
*content-level* markdown defect produced **zero** violations.

Not because they are absent — because markdown's grammar cannot emit the HTML shapes axe knows how to
fault. `![](x)` compiles to `alt=""`, which is **valid**: it asserts *decorative*. Missing and
decorative are the same bytes. A green axe report on markdown is a false green.

Two results make this a differentiator rather than a complaint:

- **Cross-validation held exactly.** A source-level (mdast) checker vs axe: `heading-skip` 81
  nodes/40 files vs `heading-order` 81/40; `table-empty-header-cell` 20/15 vs `empty-table-header`
  20/15. Two independent mechanisms, identical counts.
- **`remark-math` is this project's thesis turned on its own repo.** Default `$…$` delimiters swallow
  prose between two dollar signs — verified: `$0.02 per million CPU-ms, $0.30` yields
  `inlineMath: "0.02 per million CPU-ms, "` — and KaTeX then wraps the visible text in
  `aria-hidden="true"`. **36 captures in 20 of 272 files, and axe reported zero violations on all
  20.** A *parser mis-tokenization* produced a serious accessibility defect that only a
  markdown-aware compiler could ever detect. That is the argument for the engine, found by accident.

**The container caveat is the sharpest constraint the sweep produced.** A `no-top-heading` check fires
on **81% of files** — and is *false at publish scope*, because `PublicNoteView` injects the `<h1>`
from frontmatter, so body `h2`s nest correctly. **Heading diagnostics are only sound when evaluated
against the composed outline, never against the file.** That is precisely the transclusion and
container-format problem §5 creates, and shipping the check file-scoped would emit 515 false warnings
and train the user to ignore the panel — LR#65's disease, in the product.

One more constraint on the diagnostics layer, self-reported by the sweep and worth inheriting: a
checker scoped to mdast node types **silently ignores the raw-HTML escape hatch**, which is exactly
where authors go when markdown cannot express something. It missed 58 nodes of raw-HTML `<a>`
wrapping a badge `<img>`.

### 17.8 The escape hatch is frontmatter, and CommonMark closed the alternative on purpose

A `lang` syntax was proposed on talk.commonmark.org by a Web Accessibility Technical Advisor for the
Government of Canada, citing WCAG 3.1.2 directly. It was **rejected**: markdown "is designed
specifically for readability by human eyes… with zero accommodations for metadata, presentation
attributes." jgm redirected to Pandoc's bracketed spans (explicitly not a CommonMark extension) or
embedded HTML.

**That door is closed by design and will not open.** Which makes frontmatter-as-escape-hatch a
structural advantage rather than a workaround, and it converges with §15/§16's namespace conclusion:
every gap CommonMark closed deliberately — `lang`, table captions, long descriptions, decorative
intent — is expressible in typed frontmatter that the compiler reads and the renderer honours.

`language:` is **already present in 111 of 272** knowledge notes, and `layout.tsx` hardcodes
`<html lang="en">` and throws it away.

### 17.9 What §17 changes

- **§2's canonicalization rule is confirmed by independent derivation** (17.1) and promoted from a
  design decision to a settled one. Its three comparison call sites — slug, link fragment, search
  term — are now named, and the storage path is explicitly excluded.
- **§1's identity bet needs a normalization-aware slug** (17.2). Content-derived anchoring is sound;
  the *heading* slug it interoperates with is not, and emoji headings make it positionally unstable.
- **Adds a structural entry to §11's steelman** (17.4): markdown's link syntax is built from
  bidi-mirroring neutrals, so source visual order cannot be made to match logical order in RTL
  without a different delimiter alphabet. This is a real limit of the format, not of an implementation.
- **Retires `proseWrap`/reflow as a general engine feature** (17.5) — undefined for CJK by UAX #14.
- **Constrains §6's search positioning** (17.6): 100% → 18% outside Latin. Tokenization is a
  first-class requirement, not polish.
- **Names the diagnostics wedge and its hardest constraint** (17.7): a markdown-aware compiler sees a
  class of defect no HTML-level checker can reach — but heading and structure checks MUST take the
  composed outline as input, and must cover raw-HTML nodes, or they will train the user to ignore them.
- **Confirms frontmatter as the sanctioned escape hatch** (17.8) with the CommonMark rejection as
  evidence, converging with §15 and §16.
- **The engine must escape `\p{Bidi_Control}`** (17.4). Silently passing Trojan Source through a code
  fence is the one finding in the sweep that makes a compiler actively harmful rather than merely
  incomplete.
