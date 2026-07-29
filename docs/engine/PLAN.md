---
title: The frontmatter engine — plan
status: draft
version: 0.2.0
date: 2026-07-29
decides: what we build, what we refuse to build, and in what order
supersedes: PLAN.md v0.1.0 (same path, same day)
evidence: ~14M subagent tokens across 78 research agents + 12 local experiments, 2026-07-28/29
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
therefore the one with no precedent to lean on.** We have measured it. On 27,092 real
block-versions across this repo's own git history:

| scheme | false-match rate (silently wrong) |
|---|---|
| byte offset | 40.33% |
| block index | 25.80% |
| content hash | 2.69% |
| **k=2 context fingerprint** | **8 matches, all 8 oracle artifacts on hand audit** |

*(Verifier correction: "27,092 block-versions" is 330 files / 771 edits, and one file is
27.4% of the denominator. Drop it and positional falls 26.17% → 13.09%. **Direction confirmed,
magnitude roughly halved.** Fingerprints still win.)*

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
  **37.9% of JSON's tokens** for 0.4 accuracy points less — but HTML beats markdown on table
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
uniquely-occurring line in an untouched separator; measured on these vaults, markdown lines are
61.0–68.4% unique vs TypeScript's 70.6% — a real but modest gap. **The sharper mechanism: the
separator between edited regions in prose is a blank line (43,526 of them, 22% of all lines), which
is by definition non-unique.** Plus reflow changes every line, destroying line matching before the
theorem is reachable.

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

| decision | evidence |
|---|---|
| No new format or extension | MDX 3.07%; Markdoc 0.136%; djot 65,990× behind — **and** the tree/graph boundary (§2.1) |
| No new sigil | character-namespace exhaustion, stated by jgm |
| No base64 binary | 0.90 tok/byte entropy floor; 200 KB JPEG = 93% of a 200K window |
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

## 12. Two confirmed bugs in the editor, unfixed

- `src/modules/vault/infrastructure/search-index.ts:59` — strips fenced code blocks **and** inline
  code before indexing. Code and table nodes are 9.2% of nodes but **29.8% of content tokens**.
- `src/modules/graph/presentation/graph-data.ts:132` — unresolved links silently dropped.
