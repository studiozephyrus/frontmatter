---
mdmax: 1
section: 10
title: "The engine specification: passes, offset model, robustness, and the hazards that will bite"
slug: 10-engine-spec
lines: 1357
words: 13903
forward_links: [1, 3, 5]
backlinks: [0, 1, 2, 3, 7, 11, 12, 13, 14]
prev: 09-aios
next: 11-execution
---

[← Index](README.md) · [← §9 AIOS](09-aios.md) · [§11 Execution →](11-execution.md)

## 10. The engine specification: passes, offset model, robustness, and the hazards that will bite

This section is the implementable specification. Everything above it in this document argues about
*what* to build; this section says *how*, in enough detail that an engineer who has never seen the
project can open an editor and start typing without asking a question. Where a decision is made, it
says **DECIDED**. Where a judgement is offered that the founders may overrule, it says
**RECOMMENDED**. Where nobody knows yet, it says **OPEN**.

### 10.0 How to read the evidence in this section

Every number carries a tag and a source. The tags mean exactly this:

| tag | meaning |
|---|---|
| `[measured]` | a program was run and this number came out of its output |
| `[primary]` | read directly from a source file, a specification, or a paper |
| `[secondary]` | reported by a source we read, but not re-derived |
| `[inference]` | reasoned from other facts; nobody measured this |
| `[SIMULATED]` | produced by replaying data through code rather than read from a live system |

**The pinned corpus.** Any figure in this section described as "the corpus" refers to
`corpus_id sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4`, defined in
`docs/engine/research/corpus-manifest.json`. Its shape, quoted exactly from that file `[primary]`:

```
total_files   1084
total_bytes   25548765
roots
  md            head 02c22ec47a3a73fb25a14b11be233ad3d00a8b48   756 files   21068853 bytes
  knowledge     head 464eb666946c8cb4ccf42c68f4464613e5fc4999   272 files    3570923 bytes
  frontmatter   head 798ebbf3250a5b2a53785859d79ae15f55ebebeb    56 files     908989 bytes
policy        all *.md, case-insensitive; skip listed dirs at any depth; skip any dot-directory;
              skip listed top-level dirs per root   (exclude_toplevel: Mirrors, Paste)
```

Four of the 1,084 files are zero bytes, so the non-empty count is **1,080** `[measured, this
section, re-derived from the manifest's own `bytes` fields]`. That single fact reconciles two
figures that appear in the record and look like a contradiction: the parse-robustness area reports
"only 71 of 1,084 files (6.55%) have bytes == UTF-16 == code points == graphemes", and the technical
synthesis reports "only 67 of 1,080 files have bytes == UTF-16 == code points". `71 - 4 = 67`. They
are the same measurement over different denominators. **Both are correct; quote the 1,084 form.**

**Any figure about local files that does not cite that corpus id is suspect.** Seven irreproducible
corpus counts were published before the corpus was pinned. Where this section repeats one, it says so.

**The pinned toolchain.** Every timing in this section was produced on `node v24.6.0 darwin arm64`
against this repository's own `node_modules` `[measured]`:

```
micromark                4.0.2      yaml (eemeli)        2.9.0
mdast-util-from-markdown 2.0.3      js-yaml              3.14.2    <- 3.x, i.e. YAML 1.1
remark-parse             11.0.0     gray-matter          4.0.3
unified                  11.0.5     github-slugger       2.0.0
@lezer/markdown          1.6.3      minisearch           7.2.0
@lezer/common            1.5.2      @codemirror/state    6.6.0
marked                   16.4.2     @codemirror/lang-markdown  6.5.0
cmark / cmark-gfm / pandoc          NOT INSTALLED  (`which` -> not found)
```

Timings do not transfer between machines. Where this section quotes a ratio between two machines'
wall-clock, it says the ratio is invalid and gives the absolutes instead.

**One standing caveat that applies to the whole engine.** Zero live model calls were made in any
research run behind this plan. Every sentence anywhere in this document of the form "easier for AI"
is a **prediction, not a result**. Nothing in this section depends on one.

---

### 10.1 The pass pipeline — and the correction that reorganises it

#### 10.1.1 The seven passes, as the record states them

`docs/engine/PLAN.md` §3 defines the engine as seven passes `[primary]`:

```
1  parse       .md -> AST + byte positions        incremental
2  identify    mint / recover block anchors       <- the invention
3  interface   frontmatter -> module signature    schema INFERRED
4  resolve     bind every cross-reference         unresolved = diagnostic, never a silent drop
5  index       symbol table + reverse index       -> outline, tags, backlinks
6  check       schema / links / drift             -> the confidence ladder
7  project     outline / graph / site / tokens    never stored
```

That list is right about the *work*. It is wrong about the *shape*, and the wrongness is the single
most consequential structural correction the research produced.

#### 10.1.2 The correction: these are two pipelines, not one

The seven passes are drawn as a linear chain, which implies every consumer walks all seven. No
consumer does. There are exactly two consumers, and **they barely overlap**.

- **The editor lane** (frontmatter the product: open a file, type, comment, suggest, publish) needs
  pass 1 and pass 2 above everything. Pass 2 — mint and recover block anchors — is the only thing
  that lets a comment stay attached to a paragraph after somebody edits the paragraph above it.
  The editor lane never needs pass 7 (project). It renders one document into one view.
- **The packing / AI lane** (`mdmax pack`, `mdmax cert`, index and outline projections for a model's
  context window) needs pass 7 above everything, and needs pass 2 **not at all**. A projection is
  generated on demand, consumed once, and discarded. It has no persisted anchors, so there is
  nothing to re-anchor. The record itself already settled that the container is an **ephemeral read
  transport**, never the write surface — which is precisely the property that makes identity
  unnecessary in that lane.

Drawing them as one chain has already cost this project real time: it is why the container was ever
proposed as a durable artifact, and why the incremental build system got specified (§10.7) for a
lane whose outputs are thrown away.

**DECIDED. Draw the engine as two pipelines sharing a parser and a normalizer.**

```
                        +-----------------------------------+
                        |  SHARED FLOOR                     |
   bytes on disk  --->  |  gate()      shape refusal        |
                        |  decode()    strict UTF-8, BOM    |
                        |  parse()     pass 1               |
                        |  OffsetMap   one unit, one map    |
                        |  normalize/1 slug/1  (versioned)  |
                        +------------+----------+-----------+
                                     |          |
              +----------------------+          +----------------------+
              |  PIPELINE A - EDITOR                                   |
              |                                     PIPELINE B - PACK  |
              v                                                        v
    2 identify   mint / recover anchors            3 interface  frontmatter -> signature
    3 interface  frontmatter -> signature          4 resolve    bind cross-references
    4 resolve    bind cross-references             5 index      symbol + reverse index
    5 index      symbol + reverse index            7 project    outline / index / bundle
    6 check      the confidence ladder
    W splice     THE ONLY WRITER OF BYTES          (never writes a byte; output is a projection)
```

#### 10.1.3 Per-pass contract

Read this table as the interface specification. "May not" is binding: a pass that does a thing in
its "may not" column is a bug even if the output looks right.

| # | pass | lane | input | output | may | MAY NOT |
|---|---|---|---|---|---|---|
| 0 | `gate` | both | raw bytes, budget | `{ok, src}` or a named refusal | refuse by byte count, line count, list-marker count, invalid UTF-8 | parse; repair invalid UTF-8; throw |
| 1 | `parse` | both | decoded string | block tree with `U16Offset` start/end per top-level block | run a grammar; run in a worker | mutate the string; normalise; emit HTML |
| 2 | `identify` | **A only** | block tree + prior anchor set | `RESOLVED \| AMBIGUOUS \| LOST` per anchor | call `normalize/1`; refuse | break a tie by position (measured: position tiebreak takes false matches 0.00% -> 22.20%) |
| 3 | `interface` | both | frontmatter block bytes | typed field map + a per-field defect list | degrade a value it cannot parse | fail the user's action on a parse error; rewrite the block |
| 4 | `resolve` | both | interface + link extraction | resolved edges + diagnostics | emit `AMBIGUOUS` | silently drop an unresolved reference (`graph-data.ts:132` does this today) |
| 5 | `index` | both | resolved edges | symbol table, reverse index | cache keyed on content sha | persist anything an anchor keys on without a version stamp |
| 6 | `check` | **A only** | everything above | tiered diagnostics E / W / I | warn | reach tier E without a human having accepted the constraint |
| 7 | `project` | **B only** | index + budget | outline, index, bundle — on stdout | refuse above the target's context window | write to disk; be treated as durable |
| W | `splice` | **A only** | `(src, {byteStart, byteEnd}, replacement)` | `{bytes, receipt}` | assert boundaries | regenerate any region it was not asked to change |

**The splice writer is not pass 8.** It is the only component in the entire system permitted to
write bytes, and it sits outside the pass numbering deliberately so that nobody adds a second writer
by adding a pass. Its correctness is already established: stock `mdast` `position.offset` spliced
**107,287 top-level blocks across 1,080 files of the pinned corpus byte-identically, 0 failures**
`[measured]`. D7 is therefore not an aspiration; it is a function that exists and that two shipped
code paths bypass (§10.6).

#### 10.1.4 What this section does not cover

Passes 3–6 are specified here only at their interface. The *content* of pass 6 (the confidence
ladder E/W/I) and the *tiers* of the resolver (`ChangeSet.mapPos` -> diff3 -> content-derived) are
specified elsewhere in this plan and are not re-derived here. This section covers pass 0, pass 1,
the offset model, `normalize/1`, `slug/1`, the frontmatter value slot, the robustness regime, and
the incremental question.

---

### 10.2 The offset model, specified end to end

**This is where a shipped bug already came from, and it is the cheapest item in the whole
programme.** Learned Rule 68 in this workspace records a UTF-8 truncation bug in an unrelated tool
caused by `awk substr` splitting a multi-byte character. The same class is latent here at every
boundary where a byte offset meets a UTF-16 offset.

#### 10.2.1 What was actually measured

Over the pinned corpus `[measured, reproduced to the digit by an independent verifier]`:

```
files                                       1084
all four units equal (bytes==u16==cp==gr)     71   (6.55%)   -> 67 of the 1,080 non-empty
bytes != UTF-16 code units                  1013   (93.45%)
UTF-16 units != code points  (non-BMP)        38   (3.51%)
code points != grapheme clusters              42   (3.87%)

corpus totals   bytes      25548765
                utf16      24699622
                codepoints 24699360
                graphemes  24573891
byte<->UTF-16 skew  849143  (3.324% of bytes)
largest single-file skew  533366 units, in md/_Archive/Satinath Content JSON (raw source).md
```

**Two claims in the record must be dropped, and this section drops them.**

1. *"93.4% already diverge, so the boundary risk is 21x what the engine PLAN says."* The verifier
   independently counted files containing at least one non-ASCII character and got **exactly 1,013**
   — identical to `bytes != UTF-16`. So that statistic is not a discovered hazard, it is the
   definition of "this file is not pure ASCII" `[measured]`. **REFUTED. Do not use the 93.4% as a
   risk figure.**
2. The comparison to `docs/engine/PLAN.md` §3.3's "103 of 2,314 files (4.5%)" is invalid: that
   figure counts non-BMP characters over a different 2,314-file selection, and non-BMP on the
   pinned corpus is **3.51%, which is LOWER than 4.5%, not 21x higher** `[measured]`. The two
   documents are not in conflict; the multiplier was arithmetic over mismatched denominators.

**What survives, and it is enough.** 3.51% of files carry a character where a UTF-16 offset can
split a surrogate pair. 3.87% have code-point boundaries that are not grapheme boundaries. One file
diverges by 533,366 units between two of the units in play. Any of those three is sufficient
justification for the model below.

There is a nice illustration of the problem inside the research itself: the parse-robustness area
calls `md/graphify-out/GRAPH_REPORT.md` (1,466,025 bytes) "the largest corpus file", while the
largest file by bytes is actually `md/_Archive/Satinath Content JSON (raw source).md` at 1,491,757
bytes `[measured, this section, from the manifest]`. Both statements are defensible — Satinath is
larger in bytes, GRAPH_REPORT is larger in UTF-16 units, because Satinath carries the 533,366-unit
skew. **A sentence about "the largest file" is ambiguous unless it names its unit.** That is the
entire argument for this subsection, in miniature.

#### 10.2.2 The specification

**DECIDED — ONE UNIT.** Every offset inside MDMAX is a **UTF-16 code unit index** into the document
string. Rationale: CodeMirror 6, Lezer and mdast are all natively UTF-16, `str.length` is free
(0 ms over the whole 25.5 MB corpus `[measured]`), and a code-point walk costs 52 ms for the same
bytes `[measured]`. Choosing bytes would require converting on every editor interaction; choosing
code points would require converting on every parser interaction.

**DECIDED — ONE BOUNDARY POLICY.** An offset is a UTF-16 index into the string obtained by decoding
the file's bytes as **strict UTF-8** with a leading BOM stripped and **no normalisation applied**.

- An offset **may never fall inside a surrogate pair.** A range whose `start` or `end` would split
  one is **rejected at construction** by `assertBoundary()`, never silently rounded. Rounding is
  how you get a corrupted character; refusing is how you get a bug report.
- Grapheme boundaries are **not** enforced on internal offsets. They are enforced only on offsets
  that cross out to an external annotation format (§10.2.3, row 5).
- Invalid UTF-8 is **refused, never repaired**. A repair changes bytes, and D4 and D7 both say we
  do not change bytes we were not asked to change.

**DECIDED — ONE CONVERSION POINT.** A single `OffsetMap` object per open document. It holds:

```ts
class OffsetMap {
  // built eagerly at open: Uint32Array prefix table, UTF-16 index -> byte offset
  toByte(u: U16Offset): ByteOffset
  fromByte(b: ByteOffset): U16Offset        // throws if b is not a UTF-8 boundary

  // built lazily on first use: Intl.Segmenter grapheme boundary bitset
  toGrapheme(u: U16Offset): GraphemeIndex
  fromGrapheme(g: GraphemeIndex): U16Offset

  assertBoundary(u: U16Offset): void        // throws if u splits a surrogate pair
}
```

Costs, all measured on the pinned corpus `[measured]`:

| operation | cost |
|---|---|
| build the `Uint32Array` UTF-16 -> byte prefix table for the largest file | **4 ms, 5.8 MB** |
| `Buffer.byteLength` over the whole 25.5 MB corpus | 14 ms |
| `str.length` over the whole corpus | 0 ms |
| code-point iteration over the whole corpus | 52 ms |
| `Intl.Segmenter` grapheme segmentation over the whole corpus | 893 ms = **28.6 MB/s** |
| implied grapheme cost for a 100 KB document | **~3.5 ms** |

Four milliseconds per document, paid once, removes an entire bug class. There is no performance
argument against this.

#### 10.2.3 What crosses each boundary

This table is the contract. Every arrow is a call into `OffsetMap` and nowhere else.

| # | boundary | their unit | our unit | conversion | hazard if you skip it |
|---|---|---|---|---|---|
| 1 | git blob / `Buffer` / HTTP `Range` / content hash over a range | **bytes** | UTF-16 | `OffsetMap.fromByte` / `toByte` | a hash keyed on a byte range and an anchor keyed on a UTF-16 range describe different text on 93.45% of files |
| 2 | CodeMirror 6 `EditorState.doc`, `ChangeSet.mapPos` | **UTF-16** | UTF-16 | **none — identity** | none. This is why UTF-16 was chosen |
| 3 | mdast `node.position.*.offset`, Lezer `SyntaxNode.from/to` | **UTF-16** | UTF-16 | **none — identity** | none |
| 4 | a Python, Rust or Go implementation | **code points** (Py) / **bytes** (Rust, Go) | UTF-16 | at the process boundary, once per call | this is the documented kill condition for the whole decision (§10.2.5) |
| 5 | iA Writer Markdown Annotations v0.2; any exported external anchor | **grapheme clusters** | UTF-16 | `toGrapheme` / `fromGrapheme` | 3.87% of files have `codepoint != grapheme`; an annotation exported in the wrong unit lands in the wrong place |
| 6 | disk | **UTF-8 bytes** | UTF-16 | decode once at open, encode once at write | the splice writer takes `ByteOffset` — see below |
| 7 | Language Server Protocol | **negotiated** utf-8 / utf-16 / utf-32 | UTF-16 | negotiate utf-16, else convert at the boundary | LSP is the one protocol that already treats this as a negotiation, which is the strongest external evidence that a single declared unit is the right design |

Note row 6 carefully. The **splice writer takes byte offsets**, because it writes bytes. Every other
component takes UTF-16. The conversion happens in exactly one place: the call site that hands a
range to `splice()`. That is the single most dangerous line in the codebase and it should be the
only one of its kind.

#### 10.2.4 Enforcement

**DECIDED.** Three mechanisms, all cheap:

1. **Branded types.** `type U16Offset = number & {__u16: true}`, likewise `ByteOffset`,
   `GraphemeIndex`. The three cannot be assigned to one another without going through `OffsetMap`.
   TypeScript catches every mix at compile time and costs nothing at runtime.
2. **A lint rule.** An eslint `no-restricted-syntax` rule forbids `Buffer.byteLength`,
   `TextEncoder`, `codePointAt`, `new Intl.Segmenter`, and `.slice()` **on a document string**
   anywhere outside `src/modules/mdmax/offsets.ts`. If a second file needs one of those, that is a
   design conversation, not a diff.
3. **A CI assertion.** Round-trip every one of the 1,084 corpus files through
   `fromByte(toByte(u)) === u` at 100 sampled offsets per file, and assert `assertBoundary` throws
   on a synthetic offset placed inside a surrogate pair.

#### 10.2.5 What would falsify this, and what would kill it

- **KILL CONDITION.** The UTF-16 decision dies the moment a second MDMAX implementation exists in a
  language that indexes bytes (Rust, Go) or code points (Python) at a hot boundary. At that point
  the single-unit rule becomes a per-call conversion and the 4 ms table becomes a per-request cost.
  **Trigger: the first non-JS MDMAX implementation.** Until then, UTF-16 is right because every
  library we already depend on is UTF-16.
- **FALSIFIER.** If `assertBoundary` never throws across a full year of production traffic, the
  surrogate-pair risk was theoretical and the branded types are ceremony. Instrument it: count the
  throws. Report the count. A design that cannot be shown to have caught anything should be cut.
- **NOT COVERED.** Bidirectional text ordering. Offsets are *logical*; a document containing bidi
  controls has a visual order that does not match its logical order, and no offset model fixes that
  (`docs/engine/PLAN.md` §17.4 argues this at length and is correct). Cursor placement in RTL runs
  is a rendering problem, out of scope for the engine.

---

### 10.3 `normalize/1` — frozen and versioned before any anchor is persisted

#### 10.3.1 Why this is urgent rather than tidy

The flagship re-anchoring result — **99.627% correct / 0.050% false match / 0.323% safe refusal**,
over 32,919 surviving block-versions drawn from 41,642 block-versions across 294 consecutive real
revision pairs — was produced by a **384-configuration parameter sweep** whose winning configuration
includes a specific hash input: **NFC, then collapse whitespace, then lowercase**
`[primary, docs/engine/PLAN.md §1.1a]`.

`docs/mdmax/PLAN.md` states the risk in one line and then does not act on it `[primary]`:

> The 99.627% was swept over 384 configurations under NFC + collapse whitespace + lowercase. If the
> hash input changes later, every stored anchor silently re-keys while the published number keeps
> describing code that no longer exists.

That is a **silent data-loss bug, not a crash**. Every comment in every document detaches at once,
with no error, on a commit that looks like a refactor.

Two further caveats belong in the same breath, because they govern how the number may be used:

- **Nobody has re-derived 99.627%.** Not one research area that quoted it recomputed it. Eight areas
  cite it. Treat it as `[secondary]` until it is re-run, and **do not publish it externally** until
  it is re-derived on a corpus this team did not write.
- **It is a BLOCK figure.** Comments and suggestions anchor **ranges**. The one replication of the
  range case gives a 3.44x improvement over baseline, not 30x, with refusal roughly doubling
  `[primary, docs/mdmax/PLAN.md §5.2]`.

#### 10.3.2 The specification

**DECIDED.** `src/modules/mdmax/normalize.ts` exports exactly this and nothing else:

```ts
export const NORMALIZE_VERSION = "mdmax/normalize@1";

/** The hash input for block identity. Pure. No I/O. No configuration. */
export function normalize(text: string): string {
  return text
    .normalize("NFC")           // 1. Unicode canonical composition
    .replace(/\s+/gu, " ")      // 2. collapse every whitespace run to one space
    .trim()                     // 3. strip leading/trailing whitespace
    .toLowerCase();             // 4. locale-independent lowercase
}
```

Four rules govern it, and they are binding:

1. **`normalize()` is for COMPARISON ONLY. It never touches the bytes we write.** This is not a
   style preference, it is measured. Running NFC over `md/Research/Satinath Chattoraj/Satinath -
   Poems.md` (14,187 bytes) changes **77 of 437 lines** and **3 of 11 headings**, because Bengali
   U+09DC, U+09DF and U+09DD are Unicode **composition exclusions**: NFC *decomposes* them
   `[measured, docs/engine/PLAN.md §17.1]`. Of 462 unique Bengali words in that file, **45 (9.7%)**
   are normalization-sensitive. "Just run NFC on everything" rewrites 77 lines of the user's own
   poetry. The splice writer touches no byte it was not asked to change; `normalize()` never reaches
   it.
2. **Every persisted anchor stamps the version.** The anchor record is:
   ```json
   { "schema": 1,
     "normalize": "mdmax/normalize@1",
     "slug": "mdmax/slug@1",
     "id": "...", "quote": "...", "prefix": "...", "suffix": "..." }
   ```
   An anchor whose stamp does not match the running engine is **STALE, not LOST**: it is re-resolved
   through the content-derived ladder and re-stamped, and a migration counter is incremented.
3. **The re-sweep trigger.** Changing `normalize()` in any way — adding a step, removing a step,
   changing the order, changing the whitespace class — requires **all three** of: (a) bump
   `NORMALIZE_VERSION`; (b) re-run the 384-configuration sweep and republish the correct / false /
   refusal triple, because the published triple describes the old function; (c) ship a migration
   that re-resolves and re-stamps every stored anchor. Any change that skips (c) silently detaches
   every comment in the product.
4. **A CI assertion makes (a) impossible to forget.** A 200-case golden file of
   `input -> normalize(input)` pairs is checked in. If any output changes and `NORMALIZE_VERSION`
   did not, the build fails. This is the mechanism; the rule alone is not.

#### 10.3.3 The normalization the product is missing today

`normalize()` is specified in the plan and **performed nowhere**. Re-verified in this repository on
2026-08-01 `[measured]`:

```
grep -rn "normalize("            src/  ->  0 hits
grep -rnE "NFC|NFD|NFKC"         src/  ->  0 hits
grep -rn "Segmenter"             src/  ->  0 hits
grep -rn "localeCompare"         src/  ->  4 hits
   KnowledgePanels.tsx:27 · SearchPanel.tsx:116 · tree-order.ts:34 · list-conflicts.ts:29
```

Two live consequences, both verified against the shipped modules `[measured]`:

- **Search.** The same visible Bengali word in two normalization forms: in-file form gives 1 hit,
  NFC form gives **0 hits**. They render pixel-identically, so nothing in the UI can explain the
  failure to the user.
- **Anchors.** `github-slugger` performs no normalization, so `[[Note#১. সাদা শাড়ী]]` resolves only
  if the link was typed in the same form as the heading.

**DECIDED.** Apply `.normalize("NFC")` at exactly three read-side call sites — slug generation,
link-fragment matching, and the search `processTerm` (indexing both forms) — and nowhere else.

**Do not send this upstream as a micromark patch.** CommonMark mandates exactly one Unicode
operation, case-folding reference-link labels, and micromark implements it as
`.replace(/[\t\n\r ]+/g," ").replace(/^ | $/g,'').toLowerCase().toUpperCase()` — normalization-blind,
so `[Café]` in NFD does not resolve `[Café]: /url` in NFC `[primary, node_modules/micromark-util-normalize-identifier/index.js;
measured end-to-end through the real parser]`. It is tempting to fix. Two facts kill the temptation:
cmark's `normalize_reference` does the same thing (`cmark_utf8proc_case_fold` + trim + normalize
whitespace, **no Unicode normalization**) `[primary]`, so patching micromark would make our render
diverge from GitHub's on the same bytes; and this is a **five-year-old known spec issue**,
`commonmark/commonmark-spec#695`, open since 2021-11-11, with the identical composed-vs-decomposed
`é` example `[primary]`. **RECOMMENDED: fix it in MDMAX's own read-side `key()`, where it degrades
correctly and touches nothing another engine sees; file a comment on #695; do not open a micromark PR.**

---

### 10.4 `slug/1` — pinned

#### 10.4.1 The measurement that makes this the highest-leverage line in the linker

The same 392 intra-document `[text](#heading)` anchors in the pinned corpus, scored under three
slug algorithms `[measured, by an independent verifier who swept them specifically because two
adjacent claims in one report had silently used two different algorithms]`:

| slug algorithm | anchors resolving | rate |
|---|---|---|
| `github-slugger` 2.0.0 (lowercase, strip `\p{P}\|\p{S}`, space -> `-`) | 86 of 392 | **21.94%** |
| a loose `[^a-z0-9]+ -> -` slug | 116 of 392 | 29.59% |
| a **dash-collapsing** slug (as above, then collapse runs of `-`) | 388 of 392 | **98.98%** |

**Anchor health swings 77.04 percentage points on a one-line difference in the slug function.**
The mechanism is visible in the misses: `md/Zephyrus/ecosystem.md` links to
`#2-the-studio-people-structure` while its heading reads `## 2. The Studio — people & structure`,
which `github-slugger` renders `2-the-studio--people--structure` — the em dash and the ampersand
each leave a **doubled** hyphen `[measured]`. It resolves only under a matcher that collapses runs.

**DECIDED.** `src/modules/mdmax/slug.ts` exports `SLUG_VERSION = "mdmax/slug@1"` and implements
**github-slugger's algorithm plus NFC plus dash-collapsing**:

```ts
export const SLUG_VERSION = "mdmax/slug@1";

export function slug(headingText: string): string {
  return headingText
    .normalize("NFC")                 // 1. see 10.3 — comparison key only
    .toLowerCase()                    // 2. locale-independent
    .replace(/[\p{P}\p{S}]/gu, "")    // 3. github-slugger's strip
    .replace(/\s/gu, "-")             // 4. github-slugger's space rule
    .replace(/-{2,}/g, "-")           // 5. THE ONE-LINE DIFFERENCE. 21.94% -> 98.98%
    .replace(/^-+|-+$/g, "");         // 6. trim
}
```

Rationale for step 5 rather than adopting `github-slugger` verbatim: 98.98% versus 21.94% on the
founders' own corpus is not a close call, and the divergence from GitHub's rendered anchor is
**visible and diagnosable** (`mdmax cert` reports it as a per-target row) rather than silent. The
cost of the choice is one documented divergence; the cost of not choosing is that three-quarters of
intra-document links do not resolve.

**DECIDED — headings are NOT exported symbols.** `github-slugger` disambiguates **positionally**:
`while (own.call(self.occurrences, result)) { self.occurrences[originalSlug]++; result =
originalSlug + '-' + self.occurrences[originalSlug] }` `[primary, node_modules/github-slugger/index.js]`.
Renaming heading #1 therefore silently changes the anchor of heading #2. Over the pinned corpus
`[measured]`:

```
headings total                                        29082
distinct slugs                                        12361
heading instances whose slug is NOT globally unique   20741  (71.3%)
WITHIN-file duplicate slugs                             534  in 96 files (8.9%)
CROSS-file colliding slugs                             4020  (32.5% of distinct)
worst collisions   connections x382 · tldr x367 · key-ideas x315 · capabilities x197
```

A heading is a **within-unit coordinate**, resolved by the unit's own local table under the pinned
`slug/1`. It is never a cross-file exported symbol. The `{#id}` escape hatch that would make it one
is **REFUSED under D6**: it is not CommonMark, and this programme's own 24-renderer measurement
classes it as degrading to visible junk.

#### 10.4.2 What the slugger cannot fix, recorded so nobody re-discovers it

`docs/engine/PLAN.md` §17.2 measured five failure classes that no slug function repairs `[primary]`:

| class | example | both slug to | corpus evidence |
|---|---|---|---|
| CJK punctuation | `搜索，笔记` / `搜索。笔记` | `搜索笔记` | collision by construction — punctuation is CJK's only separator, and the slugger deletes separators |
| fullwidth space | `中文 标题` (U+0020) vs `中文　标题` (U+3000, what a CJK IME emits) | `中文-标题` / `中文标题` | same heading, different anchor |
| emoji | `Release` prefixed by two different emoji | `-release` | **252 emoji headings** in the vault |
| Arabic | `كتاب` / `كِتَاب` / `كــتاب` (tatweel) | three different anchors | presentational elongation changes identity |
| Turkish | `İSTANBUL` -> `i̇stanbul` (stray U+0307) | an untypeable anchor | locale-independent `toLowerCase()` |

Vault-wide: 82,090 non-empty headings, 10,578 non-ASCII, **188 files with 189 colliding slugs** —
all ASCII case/hyphen collisions today, so the mechanism is proven but the damage is latent
`[measured]`. Emoji-prefixed headings collide 100% of the time and disambiguate positionally, so
inserting a heading above renumbers every anchor below it. That is anchor *instability*, which is
worse than a hard failure because it breaks links that used to work.

**RECOMMENDED.** Ship the slug divergence as a `mdmax cert` column rather than trying to fix it.
A per-target SLUGGER column costs nothing and is the only honest answer.

---

### 10.5 Parse robustness

#### 10.5.1 The brief's own hazard list, checked

Three claims were handed to this programme as established. Two are wrong. Correcting them matters
because each one, if believed, buys a different architecture.

| claim as briefed | verdict | what was actually measured |
|---|---|---|
| "remark-parse CRASHES THE PROCESS on 20 KB of nested blockquotes" | **REFUTED** | micromark parsed 20,480 nested `>` in **257 ms**, 50,000 in **2,166.5 ms**, 100,000 in **8,704 ms** and 200,000 in **28,328 ms** — no crash at any depth. Across 45 hostile cases x 5 parsers, micromark and mdast produced **zero** process aborts. The one process abort observed belonged to **`marked`**, not remark `[measured, researcher and independent verifier, agreeing]` |
| "remark-parse takes 8.6 seconds on an 80 KB adversarial file (CVE-2023-22484 shape)" | **REFUTED as an absolute; the hazard is 3-4.5x WORSE** | On 40,000 `[` + `a` + 40,000 `]` (80,001 bytes): micromark **34,209.7 ms** (researcher) / **38,540.4 ms** (verifier); mdast **26,488.0** / **25,700.5**; Lezer **1,110.2** / **1,042.5**; marked **19.0** / **17.4** (marked does not implement the construct) `[measured]`. Report the absolutes with the hardware; a cross-machine ratio is not a valid inference |
| "markdown-it does both in ~12 ms because it has `maxNesting: 100`; remark has no equivalent" | **UNVERIFIED for markdown-it JS; the `maxNesting` half is CONFIRMED** | markdown-it (JS) is not installed. The Python port markdown-it-py 4.2.0 measured **41.7 ms** on 20k blockquotes and **1,370.5 ms** on a 5,000-deep indented list `[measured]` — not 12 ms, and Python-vs-JS timings are not comparable in absolute terms. `maxNesting` default is 100 in both, and micromark / remark / marked have **no limit of any kind** `[primary]` |
| "remark-parse is quadratic (k=1.91) on the CVE shape" | **partially** | Nested-bracket exponent measured at k=1.77 (researcher) and k=1.90 over n=2000..8000 (verifier) — same class `[measured]` |

**The real headline hazard is different from all of them, and it is not adversarial.**

#### 10.5.2 The flat bullet list — the hazard that ships in ordinary content

`mdast-util-from-markdown` is **super-linear on flat bullet lists** while being linear on paragraphs
of identical byte count. Three independent runs `[measured]`:

| items | bytes | mdast (researcher) | mdast (verifier) | micromark | Lezer |
|---:|---:|---:|---:|---:|---:|
| 20,000 | 588,890 | 1,129 ms | 1,101.3 ms | 392 / 379.2 ms | 61 / 57.6 ms |
| 50,000 | 1,488,890 | 5,554 ms | 5,675.3 ms | 842 / 854.9 ms | 133 / 135.7 ms |
| 100,000 | 2,988,890 | 20,626 ms | 22,504.7 ms | 1,821 / 1,806.7 ms | 241 / 246.8 ms |
| 200,000 | 6,088,890 | 196,096 ms | **359,959.2 ms** | 3,835 / 4,971.3 ms | 460 / 452.4 ms |

**Read the 200,000 row as a warning about measurement, not about markdown.** Two runs of identical
code on the same hardware disagree by **1.8x**. Rerunning at `--max-old-space-size=12288` gave
337,172.9 ms, only 6% faster than the 4,288 MB default, so the cost is algorithmic and not garbage
collection — but at a fitted exponent of **k = 3.2 to 4.0** above 100,000 items, **the word
"quadratic" is wrong** `[measured]`. The honest statement is:

> `mdast-util-from-markdown` 2.0.3 is super-linear on list items with a measured exponent of
> **1.79 to 1.99 between 20,000 and 100,000 items**, degrading to **k ~= 3.2-4.0 above 100,000**,
> with a machine-dependent absolute cost of **196-360 seconds at 200,000 items**.

The control is what makes this load-bearing: mdast on **paragraphs at matched byte counts** is
linear (k = 0.789 then 0.966) `[measured]`. It is **19.4x slower on lists than on paragraphs at the
same 2.99 MB**. Content-independent, list-specific: uniform text k=1.82, random text k=1.85, ordered
lists k=1.99, blank-line-separated k=1.86 `[measured]`.

**And this is the shape AI writes.** This plan's own measurement of 68,798 messages found that
model-generated markdown is a narrow nine-construct dialect in which **48.3% of list items open with
a bold run** `[secondary]` — models write long flat lists. The pathological shape is the product's
most important input class.

#### 10.5.3 The two live quadratics in our own code — and a third that nobody found

**(a) `WIKILINK_RE`, `src/modules/vault/infrastructure/markdown-parser.ts:12** `[primary]`:

```ts
const WIKILINK_RE = /(!?)\[\[([^\]]+)\]\]/g;
```

On `n` unclosed `[[` `[measured, two independent runs]`:

| n `[[` | bytes | run A | run B |
|---:|---:|---:|---:|
| 20,000 | 40 KB | 589.2 ms | 577.4 ms |
| 40,000 | 80 KB | 2,315.9 ms | 2,282.5 ms |
| 80,000 | 160 KB | 9,071.0 ms | 9,258.1 ms |
| 160,000 | 320 KB | **36,865.0 ms** | — |

Successive ratios 3.93 / 3.92 / 4.06 on 2x input give **k = 1.98**; the second run gives k = 1.983
and 2.020. **Strictly quadratic.** The realistic variant is worse: 40,000 lines of `- see [[Note N`
(749 KB, a half-typed vault) takes **11,012.9 ms** `[measured]`.

**Correction to the location, and it changes the fix.** The record says this "runs synchronously on
the browser main thread for every file in the vault snapshot". **That is refuted.** `parseMarkdown`
is imported in exactly two places — `src/container/dependency-container.ts:11` and
`src/modules/vault/infrastructure/search-index.ts:15` — both server-only composition, and **no
`"use client"` file in `src/` imports any of them** `[primary, verified by enumeration]`. It blocks
the **shared Node event loop** inside `/api/vault/snapshot`, `/api/vault/folder`, `/api/share` and
the search index. That makes it a **single-request server denial-of-service affecting every
concurrent user**, not client-side jank. The fix is unchanged (index scan, not backtracking regex);
the isolation prescription now has to be about the server process.

**FIX, DECIDED.** Replace with a bounded index scan:

```ts
function extractWikilinks(text: string): string[] {
  const out: string[] = [];
  let i = 0;
  while ((i = text.indexOf("[[", i)) !== -1) {
    const close = text.indexOf("]]", i + 2);
    if (close === -1) break;                 // unclosed: stop, do not backtrack
    if (close - i <= MAX_WIKILINK_LEN) out.push(text.slice(i + 2, close));
    i = close + 2;
  }
  return out;
}
```
Regression gate: **k <= 1.05 at 80,000 unclosed `[[`.**

The neighbouring regexes in the same file are **linear and must not be "fixed"**. `stripCode`'s lazy
quantifiers were the predicted culprit and are innocent: 16,000 unmatched fences (229 KB) strip in
**0.3 ms**; 80,000 unmatched backticks (240 KB) in **0.8 ms**; 200,000 unmatched backticks in
**1.8 ms** `[measured]`. The lesson generalises and belongs in the process, not the code:
**reading regexes for danger is not a method.** Budget `eslint-plugin-redos` in CI plus timed
scaling sweeps; do not budget a code review.

**(b) `mdast-util-from-markdown` on the shape above, reachable from ordinary content.**
Measured against this repository's own `node_modules` `[measured]`: 10k=372 ms, 20k=1,003 ms,
40k=3,356 ms, 80k=12,429 ms on 2.55 MB, against a paragraph control at identical byte counts of
148 / 265 / 463 / 821 ms (k ~= 0.82) and micromark on identical list input at 177 / 332 / 580 /
1,207 ms (k ~= 0.94). **10.3x at 80,000 items, widening.**

**(c) NEW — and this one is on the browser main thread.** Neither the researcher nor its verifier
checked the editor's own call chain. Verified by primary read this session:

```
src/modules/editor/presentation/live/LivePreview.tsx:1    "use client"
src/modules/editor/presentation/EditorPane.tsx:595        mounts <LivePreview …/>
src/modules/editor/presentation/live/LivePreview.tsx:35   useMemo(() => splitIntoSegments(content), [content])
src/modules/editor/presentation/live/block-split.ts:47    processor.parse(source)
src/modules/editor/presentation/live/block-split.ts:34-38 unified().use(remarkParse).use(remarkFrontmatter).use(remarkGfm).use(remarkMath)
node_modules/remark-parse/package.json                    "mdast-util-from-markdown": "^2.0.0"  (2.0.3 installed)
```
`[primary]`

So `mdast-util-from-markdown` **does** run synchronously on the browser main thread, in a `useMemo`
keyed on `content`, every time the Live-mode document changes. Timing that exact processor
`[measured, this section, node v24.6.0 darwin arm64]`:

```
items=10000  bytes=288890   parse=468.6 ms
items=20000  bytes=588890   parse=1359.1 ms
items=40000  bytes=1188890  parse=4160.6 ms
   ratios 2.90x and 3.06x on 2x input  =>  k = 1.54 then 1.61
```

And it already fires on real content. Parsing **all 1,084 pinned-corpus files** through that same
processor `[measured, this section]`:

```
filesParsed 1084 · totalMs 27390 · meanMs 25.27 · over 250 ms: 3 · over 2000 ms: 1

  31162.5 / 28799.5 / 19197.0 ms   1491757 B   blocks=1     md/_Archive/Satinath Content JSON (raw source).md
    723.6 ms                       1466025 B   blocks=7755  md/graphify-out/GRAPH_REPORT.md
    345.7 ms                        451785 B   blocks=1527  md/Zephyrus/ecosystem.md
    200.9 ms                        267187 B   blocks=779   md/Untitled.md
```

Three things to take from that block, in order of importance.

1. **A real, non-adversarial file in the founders' own vault costs 19 to 31 seconds** in the exact
   parser the Live editor calls on the main thread. It is a raw JSON dump saved as `.md`: 16,646
   lines, longest line 66,298 bytes, and it parses to **one** top-level block. Opening it in Live
   mode freezes the tab.
2. **The same file was timed three times and gave 19,197.0 / 28,799.5 / 31,162.5 ms** — a 1.62x
   spread. Per this workspace's Learned Rule 63, one run is an anecdote. **Report the band, never a
   single draw.**
3. **`md/Zephyrus/ecosystem.md` at 345.7 ms already exceeds the proposed 250 ms keystroke budget**,
   and it is the studio's own source-of-truth document. The budget will fire on real content on
   day one. That is a calibration fact the false-refusal experiment (§10.5.8) must absorb.

#### 10.5.4 The hostile-input corpus

**DECIDED.** A checked-in fixture directory, `test/fixtures/hostile/`, with a generator, a manifest
recording `{shape, generator params, expected class}` per case, and a runner emitting one JSON row
per `(case, parser, status, ms, rss)` diffed against a checked-in baseline. Eleven families:

| family | contents |
|---|---|
| **H1 pathological nesting** | blockquote depth 20k and 100k; indented list depth 5,000; emphasis; **nested brackets (CVE-2023-22484)**; link destinations; raw HTML |
| **H2 quadratic shapes** | unclosed shortcut refs; `![` x50k; alternating emphasis; unmatched backticks; a 5,000-column table; autolink backtrack; 50k-line setext flip; 200k reference definitions |
| **H3 amplification** | refdef reuse; **YAML 9-level alias bomb**; 200k entities |
| **H4 unicode** | astral plane; 20k combining marks on one base; Trojan-Source bidi overrides; lone surrogate; invalid UTF-8; U+0000; mixed CR/CRLF/LF; BOM at start and mid-document; zero-width joiners; Bengali NFC composition exclusion |
| **H5 malformed frontmatter** | unterminated; tabs; 50k keys + duplicate; `!!python/object/apply`; 10k-deep flow; not at byte 0; **bare `[[wikilink]]` runs**; a `@`-initial plain scalar |
| **H6 huge artifacts** | 10 MB on one line; 2M blank lines; no trailing newline |
| **H7 unclosed constructs** | a fence swallowing 200k lines; nested fence markers; 1 MB unclosed HTML comment; 1 MB info string; 1,000 tabs |
| **H8 combined** | pairwise combinations of the above |
| **H9 flat lists** | **20k / 50k / 100k / 200k items** — the highest-value family, and it was not in the original brief |
| **H10 indented lists** | 2.56 MB, measured at micromark 39,611 ms |
| **H11 near-duplicate blocks** | N identical-modulo-noise blocks at N = 500 / 1,000 / 2,000 / 4,000 — the shingle quadratic |

**Rank the corpus by demonstrated blast radius and gate only the top tier pre-merge.** Of the 45
generated cases in the research run, **5 produced a finding that changed a design decision** (flat
list, indented list, bracket bomb, blockquote depth, YAML alias bomb). The other 40 — bidi controls,
lone surrogates, invalid UTF-8, U+0000, BOM mid-document, zero-width joiners, huge single lines,
unclosed fences, unclosed HTML comments, 1 MB info strings, 5,000-column tables, 200k refdefs,
entity runs — **all parsed in under 500 ms across every parser with zero crashes** `[measured]`.
Shipping them as a nightly CI gate is cheap and correct; spending engineering time hardening against
them is not.

Unicode specifically is a non-event for the parsers and entirely an offset-and-policy problem: all
10 unicode cases parsed in **0.9 to 28.1 ms** across five parsers with zero throws, and the pinned
corpus contains **0 files with bidi controls, 0 with U+0000, 0 with a BOM, 1 with mixed CRLF/LF, and
2 with tab indentation** `[measured]`.

#### 10.5.5 The isolation architecture

**Runs in a worker:** parse, tree build, re-anchor, shingle index build and query, projection, YAML
frontmatter parse.
**Runs on the main thread / request thread:** nothing that touches untrusted document bytes.

**DECIDED — the isolation unit is a `worker_threads` pool**, size `hardwareConcurrency - 1` (min 1),
each worker long-lived, each holding at most one document. In the browser, the same contract over a
Web Worker.

**The time guard works, and it is the load-bearing fact of this design.** `worker.terminate()`
interrupts synchronous, non-yielding JavaScript. Across 9 hostile shapes including an infinite
`for(;;)` spin at a 250 ms budget, every worker was reclaimed at **251.3 to 255.4 ms** wall — max
overshoot **5.4 ms (2.2%)** — and the main thread survived every time, including the case that
hard-aborts the process when run bare `[measured]`. Independently reproduced: the infinite spin
reclaimed at 253.9 ms on a 250 ms budget and 1,002.9 ms on a 1,000 ms budget; micromark on the
6.09 MB flat list reclaimed at 254.1 ms `[measured]`.

**The memory guard is a design parameter, not a best-effort footnote, and the record gets it
backwards.** The research reported that `resourceLimits.maxOldGenerationSizeMb: 32` "did nothing" —
that a worker reached `heapUsed` 3,382 MB under a declared 32 MB cap. **REFUTED.** The independent
re-run found the limit **fires**: mdast on a 12,000,030-byte / 400,001-paragraph file under
`resourceLimits: {maxOldGenerationSizeMb: 32}` terminated at **85.6 ms**, exit code 1, and the
parent's `'error'` handler received `Error: Worker terminated due to reaching memory limit: JS heap
out of memory`. Same for micromark on the 6.09 MB flat list, at 78.2 ms `[measured]`. The reported
3,382 MB was **self-confirming instrumentation** — the `limits` field was echoed from `workerData`,
not read from an applied limit.

**The inversion is the finding, and it is a constant somebody must choose:**

| `maxOldGenerationSizeMb` | outcome |
|---|---|
| **32 (TIGHT)** | fires at 78-86 ms with a **clean, catchable** parent `'error'` event |
| **256 (LOOSE)** | `rc=134`, V8 `FATAL ERROR: Reached heap limit Allocation failed`, **kills the parent process** |

**DECIDED: `maxOldGenerationSizeMb: 32`, `stackSizeMb: 4`, pinned and regression-tested.** The
constant is the difference between an exception and a SIGABRT.

**And there is one uncatchable abort that no worker option prevents.** `mdast-util-from-markdown` on
an 11,888,898-byte / 400,001-paragraph file **SIGABRTs (`rc=134`, "Allocation failed") at every
`--max-old-space-size` from 256 through 2048 MB**, in a bare Node process, on a file containing no
adversarial construct at all `[measured]`. That is why the shape gate exists.

#### 10.5.6 The shape gate and the limits

**DECIDED — `gate()` runs BEFORE any grammar, and refuses by shape:**

```ts
export type GateResult =
  | { ok: true;  src: string }
  | { ok: false; reason: RefusalReason; at?: { line: number; col: number } };

const LIMITS = {
  MAX_BYTES:         4_000_000,   // 4 MB
  MAX_LINES:           200_000,
  MAX_LIST_MARKERS:     20_000,   // lines opening with a bullet or ordered marker
} as const;
```

Every constant is derived from a measurement, not chosen:

| constant | derivation |
|---|---|
| `MAX_BYTES = 4 MB` | mdast heap amplification is **119-513 MB per MB of input** (paragraph-dense 392.3 / 356.4 / 303.2 at 20k/80k/200k blocks; one-block 188.8 / 123.2 / 118.9; list items **512.7 / 380.5 / 373.2**) `[measured]`. A 4 MB cap bounds peak heap at roughly 2 GB worst case. The largest pinned-corpus file is 1,491,757 bytes, comfortably inside it |
| `MAX_LINES = 200,000` | the 2M-blank-line and 200k-refdef shapes; also bounds the line-number table |
| `MAX_LIST_MARKERS = 20,000` | the flat-list blowup crosses 20 seconds at roughly 100,000 items; 20,000 is a 5x margin. **This is the specific shape of AI-generated markdown**, which is why it gets its own counter rather than relying on the byte cap |

Also in `gate()`, before the counters: **strict UTF-8 decode (refuse, never repair)** and **BOM
strip**.

**DECIDED — the refusal enum, named before any route handler consumes it.** Without this, every call
site grows its own `try/catch`.

```ts
type RefusalReason =
  | "BUDGET_TIME"      // worker.terminate() fired
  | "BUDGET_BYTES"     // > MAX_BYTES
  | "BUDGET_LINES"     // > MAX_LINES
  | "BUDGET_BLOCKS"    // > MAX_LIST_MARKERS
  | "INVALID_UTF8"     // strict decode failed
  | "PARSER_THREW"     // a catchable throw inside the worker
  | "WORKER_DIED";     // exit without a result — the SIGABRT case
```

**The parent must be written to expect all four worker outcomes**, not one: a clean result, a
catchable `'error'` (the `RangeError` and `ERR_WORKER_OUT_OF_MEMORY` cases), an `'exit'` with a
non-zero code (the V8 fatal case), and a timeout with no event at all.

**DECIDED — the timeout budget:**

| context | budget | on expiry |
|---|---|---|
| keystroke reparse | **250 ms** | `terminate()`, replace the worker, keep the last good tree, mark anchors STALE |
| cold document open | **2,000 ms** | `terminate()`, render as a plain `<pre>` with a banner naming the reason |
| batch index build | **10,000 ms** per document | skip the document, record it in the index's defect list |

**How failure surfaces: never as an exception in a route handler.** A route renders the document as
plain `<pre>` with a banner naming the reason and the offending offset. The editor **keeps the last
good tree and marks anchors STALE, never LOST**.

#### 10.5.7 The shingle stage — bound the cost, do not attack the accuracy

The S3 candidate-generation stage of the resolver is **exactly quadratic in near-duplicate block
count**: postings touched 2,083,334 / 8,333,334 / 33,333,334 / **133,333,334** at N = 500 / 1,000 /
2,000 / 4,000 — precisely 64x for 8x blocks, **k = 2.00** — costing 26.4 / 88.1 / 361.0 /
1,525.5 ms `[measured]`. The real-corpus baseline is 103,548 blocks, 1,120,486 distinct 3-gram
shingles, index build 1,798 ms, average candidate set 186, and its own longest posting lists are
already `"how to use:"` x2,324 and `"2>/dev/null || true"` x1,048 — **boilerplate, not attack**
`[measured; note that an audit flagged the 2,324 and 186 figures as published without a corpus id —
they come from the same pinned-corpus run, but re-derive them before publishing]`.

**DECIDED — three caps:**

- Cap the S3 candidate set at **256** (real-corpus average is 186, so a 1.4x headroom) and return
  `AMBIGUOUS` when exceeded. Refusal is already the design's cheap outcome.
- Cap per-block token count at **4,096** before shingling.
- Cap any posting list at **512** entries and drop over-cap shingles from the index entirely, like a
  stopword list derived at build time. **This cap fires on real content, and that is correct** — a
  shingle appearing 2,324 times carries no discriminating information.
- Reject the whole S3 stage when block count exceeds **20,000**.

**And the negative result that redirects effort.** Nobody could find a hostile input that makes
re-anchoring return a **wrong** answer. The measurable failure mode is **cost, not correctness**, and
cost is bounded by refusal `[measured]`. **Effort spent adversarially attacking the anchor's accuracy
is likely wasted; effort spent bounding its candidate-set size is not.**

#### 10.5.8 The one experiment this regime needs, and what would kill it

Everything above measures the failure side. **Nothing measures the false-refusal rate** — whether
budgets refuse so often that the product is unusable. That is the open question.

**The experiment.** Three arms: the pinned corpus (1,084 files) as BENIGN; the hostile corpus
(51 files) as MALIGN; and **500 documents sampled from AI output**, which nobody has built and which
is the arm that matters. Five tasks per document: T1 cold parse under a 2,000 ms budget; T2 100
single-character edits under a 250 ms budget; T3 incremental tree versus full tree byte-equality;
T4 splice round-trip byte-equality; T5 anchor resolve after each edit. All verifiers rules-based
(spec-suite equality, tree equality, byte equality, budget-status enum) — **no judge, no model
call**. Roughly 40 minutes of wall clock on one machine.

**Pre-registered predictions, stated so they can be wrong:**

| # | prediction | basis |
|---|---|---|
| P1 | BENIGN false-refusal on T1 **<= 0.5%** (<= 6 of 1,084) | largest corpus file is 1,491,757 bytes, under the 4 MB cap |
| P2 | MALIGN refusal on T1 **>= 20%** (>= 11 of 51) | 11 hostile cases exceeded 2 s |
| P3 | AI-output refusal on T1 between **0% and 3%** — **the risky one** | if AI documents routinely carry >20,000 list items, the precheck fires on the product's most important input class and the constants must move |
| P4 | T3 incremental == full on **100.0%** of ~163,500 edits | 7 of 7 on hand-built lookahead cases. Any failure is a Lezer soundness bug and is blocking |
| P5 | T4 splice byte-identity **100.0%** by construction | a single failure means the writer is not splice-only |
| P6 | T2 p99 **< 50 ms** with micromark/Lezer and **> 250 ms** (budget-refused) with mdast on the AI arm | this is the measurement that confirms or kills the parser prescription |

**One prediction is already in doubt.** §10.5.3 measured `ecosystem.md` at 345.7 ms through the
editor's real processor — above the 250 ms keystroke budget, on a benign, important, real file. P1
concerns cold open at 2,000 ms and survives; **P6's keystroke half is at risk on real content, not
just AI content.**

**KILL CONDITIONS.**

- **Kill the whole robustness programme's priority** if measured benign false refusal exceeds **3%**.
  At that point budgets hurt more users than hostile documents do, and the correct move is to raise
  every cap until refusal is under 0.5% and accept that a determined attacker can hang one worker —
  survivable, because the main thread is not the worker.
- **Kill the worker architecture** if `terminate()` ever fails to reclaim within 2x budget on any
  input, **or** if structured-clone transfer cost exceeds parse cost. This is closer than it looks:
  transferring an mdast tree of `docs/engine/PLAN.md` measured **71.0 ms total against 35.5 ms
  parse** `[measured]` — transfer already costs as much as parsing. If transfer dominates on larger
  documents, the answer is a `SharedArrayBuffer` flat-tree encoding, which is a materially different
  and more expensive design.
- **Kill the "consume micromark events, never build mdast" prescription** if reconstructing block
  boundaries and normalized block text from micromark's event stream requires materialising an
  mdast-equivalent structure anyway. **Test:** implement `blocksFromEvents(micromark.events(src))`,
  assert its output equals `fromMarkdown(src).children.map(n => ({type, start, end}))` on all 1,084
  corpus files, then time it. If it is within 2x of mdast's time, the prescription is dead.

**Which brings us to the one place where two research areas directly contradict each other.**

> **CONTRADICTION.** The parse-robustness area concludes *"do not build an mdast tree — consume
> micromark's event stream or Lezer's tree."* The opposition area concludes *"stock mdast offsets
> splice byte-perfectly on 1,080 of 1,080 files; use them."*
>
> **RULING: both are right about different call sites, and mdast governs v1.** mdast parsed 107,287
> blocks across all 1,080 real corpus files with **0 splice failures**, and took 12,429 ms on an
> 80k-item flat list where micromark took 1,207 ms. **Ship mdast for v1 per-document offsets, behind
> the shape gate and the worker budget** — the gate's list-marker threshold exists precisely to
> catch mdast's one pathological shape. **Do not build the micromark event-to-block reconstruction
> first**; the parse-robustness area's own kill condition concedes that if it needs an
> mdast-equivalent structure the advantage evaporates, and nobody has tested that. **Port when the
> gate starts firing on real user content, not before.**
>
> Two facts that keep this ruling honest. **micromark is NOT uniformly linear** — it measured
> **k = 2.42 on nested blockquotes** between depth 20,480 and 50,000, and **k = 1.46** on the flat
> list between 100k and 200k items, not the k = 1.08 the headline quotes `[measured]`. So "consume
> micromark events" is not a free correctness win. **Only Lezer stayed near-linear on every shape
> tested**: 452.4 ms at 200,000 list items, 21.6 ms at blockquote depth 50,000, 1,042.5 ms on the
> bracket bomb `[measured]`.

---

### 10.6 The YAML value slot, which D8 rests on and which is broken today

D8 says extensibility lives in the **VALUE** of a field, never the **SET** of node types. The rule is
correct and survives. **Its carrier does not survive contact with the founders' own vault.**

#### 10.6.1 The loud failure

Over the pinned corpus `[measured, researcher and independent verifier agreeing to the digit]`:

```
files                                        1084
files carrying a frontmatter block            907
parsed by js-yaml 3.14.2 (via gray-matter)    737
parsed by yaml 2.9.0 (eemeli)                 737       <- the SAME 737; 0 asymmetric acceptances
rejected by BOTH                              170       15.68% of files · 18.74% of frontmatter blocks

reason histogram
  "end of the stream or a document separator is expected"        148
  "missed comma between flow collection entries"                  10
  "can not read a block mapping entry"                             6
  "incomplete explicit mapping pair"                               6
                                                          total  170
```

Re-derived independently this session over the manifest's own path set (1,084 present, 0 missing):
**`jsThrow = 170`, `eeErr = 170`** `[measured, this section]`. It reproduces exactly.

The cause is `related: [[a]], [[b]]` and `entities: [[[A]], [[B]]]` — Obsidian wikilinks are not
valid YAML flow syntax. **That puts markdown's grammar inside YAML's, which is exactly the failure
mode D8 exists to prevent, occurring in D8's own carrier.**

**Two corrections to how this has been reported.** Both matter for the spec below.

1. **The attribution is not 100% wikilinks.** Of the 170 throws, the source line js-yaml points at
   contains `[[` in **148** cases and does **not** in **22** `[measured, this section]`. So the
   wikilink story covers **148 of 170 (87.1%)**, and 22 files fail for other reasons.
2. **The exemplar cited in the record is the wrong line.** The research quotes
   `md/Research/Knowledge Base/AI/18 Claude Code Token Hacks in 18 Minutes.md` and attributes the
   throw to its `entities: [[[Claude Code]], [[Anthropic]], …]` line. Parsing that file's actual
   frontmatter block `[measured, this section]`:
   ```
   js-yaml : missed comma between flow collection entries at line 23, column 73
   eemeli  : Plain value cannot start with reserved character @ at line 23, column 73
   YAML line 23 = key_terms: [/clear, /compact, /context, /cost, /status-line, plan mode, @filename, MCP, …]
   ```
   Both parsers point at the **same position**, and that position is **`@filename`** — `@` is a YAML
   reserved indicator. The `entities:` line parses **cleanly in both parsers in isolation**. The
   research attached the right error message to the wrong line. **The engineering consequence: the
   lenient pre-pass must handle reserved-indicator scalars as well as bare wikilinks.**

#### 10.6.2 The quiet failure, which is worse and which nobody had counted

`entities: [[[A]], [[B]]]` is **valid YAML**. It parses, silently, to
`{"entities": [[["A"]], [["B"]]]}` — a nested array. The wikilinks are destroyed with **no error at
all** `[measured, verified in both parsers this session]`.

Nobody had measured how often. Over the pinned corpus `[measured, this section, new]`:

```
files with a frontmatter value parsing to a nested array   96   of 1084   (8.86%)
value occurrences                                         117
  of depth >= 3  (the [[[A]], [[B]]] shape)               116
  of depth == 2                                             1
by key   related 95 · entities 21 · target 1

examples
  md/Research/Knowledge Base/AI/12-Factor Agents (Dex Horthy).md :: related
  md/Research/Knowledge Base/AI/3D Data Science with Python.md :: entities
```

**Combined, the frontmatter value slot is broken on 266 of 1,084 files — 24.54% of the corpus, and
29.33% of the 907 files that carry frontmatter at all.** The two sets are disjoint: a file that
throws cannot also be silently corrupted.

| class | files | of 1,084 | of 907 with frontmatter | user-visible? |
|---|---|---:|---:|---|
| LOUD — YAML throws | 170 | 15.68% | 18.74% | yes, as an HTTP 502 |
| **QUIET — parses to a nested array, links destroyed** | **96** | **8.86%** | **10.58%** | **no. Nothing to catch** |
| **total broken** | **266** | **24.54%** | **29.33%** | |

#### 10.6.3 What the product does with these files today

| code path | behaviour | consequence |
|---|---|---|
| `markdown-parser.ts:111-120` | wraps `matter(raw)` in `try/catch`; the comment reads *"A single bad note must NEVER crash the whole vault snapshot"* | degrades correctly. This is the good path |
| `share-writer.ts:19` | calls `matter(file.content)` **bare, no `try/catch`** | the throw is caught one level up by the generic handler in `src/app/api/share/route.ts`, which returns **HTTP 502 `{error:'upstream_failure'}`**. So **18.7% of a real vault is unpublishable**, with a misleading upstream error |
| `share-writer.ts:26` | `const next = matter.stringify(parsed.content, data);` | **regenerates the YAML from an object.** Over the corpus: 737 run, **695 frontmatter blocks changed (94.30%)**, 33 byte-identical, 8 trailing-newline-only, **0 bodies changed** `[measured]`. Modal damage is a quoting flip: `up: "[[Home]]"` -> `up: '[[Home]]'`. A live **D7 violation on every Publish**, in a file whose own doc comment at line 3 claims it works by *"splicing the key into the YAML frontmatter"* |
| `gray-matter/index.js:161` | `matter.stringify = function(file, data, options) { if (typeof file === 'string') file = matter(file, options); … }` | **it re-parses its string argument.** `share-writer.ts` passes `parsed.content`, a raw string, so **the BODY is re-parsed as if it had its own frontmatter**. On `md/pj.md` this throws from inside `matter.stringify`; for any body opening with a `---` delimited block it will **silently consume that block and drop it**. This is why the reported triple does not sum: 33 + 8 + 695 = 736, not 737 `[primary + measured]`. It converts "cosmetic quoting churn" into **possible silent body truncation**, which is the one thing D4 and D7 exist to prevent |
| `preview/presentation/frontmatter.ts:47` | `const yaml = doc.toString()` | the `yaml` library's no-edit round trip is byte-identical on only **114 of 907** blocks `[measured]` |

**Do NOT take the shortcut of swapping gray-matter for the `yaml` library.** 114 of 907 is not a fix.

#### 10.6.4 A second, independent divergence: the two shipped parsers disagree on TYPE

The product ships **two YAML parsers** and they return different types for the same field on 84.8%
of real files `[measured, verified to the digit]`:

```
both parse             737 of 907   (they agree on WHICH 737)
files with a VALUE divergence   625  = 84.80% of 737
field occurrences               973
divergence classes                1   <- exactly one, no others
   js-yaml  YAML 1.1 implicit !!timestamp  ->  JS Date
   eemeli   YAML 1.2 core schema           ->  string
example  md/Daily/2026-05-26.md :: title: Date(Tue May 26 2026 05:30:00 GMT+0530) vs string("2026-05-26")
```

The topology is in the source: gray-matter/js-yaml at `markdown-parser.ts:112` (server, vault index)
and eemeli/yaml at `src/modules/preview/presentation/frontmatter.ts:17` via `parseDocument`, consumed
on the browser main thread by `PropertiesPanel.tsx:55` `[primary]`. The installed js-yaml is
**3.14.2** — gray-matter pins `^3.13.1`, i.e. the YAML 1.1 line `[primary]`. That is the whole
mechanism.

#### 10.6.5 The specification

**DECIDED — five rules.**

1. **WRITES NEVER PARSE.** The splice writer locates `public_slug:` (or any key) by **byte scan
   inside the delimiter block** and splices, or appends. It never invokes a YAML parser. This is the
   real fix, and it is what makes the 170 unparseable files **writable at all**. `matter.stringify`
   and every other YAML re-emitter is **forbidden**, enforced by an eslint rule on the import.
   **Gate:** publish-then-unpublish over all 907 frontmatter-bearing files is byte-identical,
   including the 170.
2. **READS USE A LENIENT PRE-PASS.** `src/modules/mdmax/frontmatter-lenient.ts` runs before the YAML
   parser and quotes two things: bare `[[…]]` runs, and plain scalars opening with a YAML reserved
   indicator (`@`, backtick). It changes **zero bytes in any user file** — it operates on a copy fed
   to the parser. D2, D4, D6 and D7 compatible by construction.
3. **A HARD REFUSAL FOR THE SILENT CASE.** When a frontmatter value parses to an array of depth >= 2
   **and** its leaf strings look like wikilink targets, the interface pass emits a **`WIKILINK_IN_FLOW_SEQ`**
   defect rather than accepting the nested array. The value is surfaced to the user as broken. It is
   never silently indexed as `[["A"]]`. 96 files hit this today.
4. **A FRONTMATTER PARSE FAILURE MAY NEVER FAIL A USER ACTION.** Share, Publish, Rename, Export and
   Search all degrade. The 502 path is a bug, not a policy.
5. **ONE PARSER, DECLARED.** `yaml` 2.9.0 (eemeli), YAML 1.2 core, everywhere. Reasons, in order:
   it makes dates stay strings, which removes the 84.8% type divergence at a stroke; it **refuses
   the YAML alias bomb at parse time** (`ReferenceError: Excessive alias count indicates a resource
   exhaustion attack`) where js-yaml accepts it `[measured]`; and it is browser-safe. `gray-matter`
   and `js-yaml` are removed from `src/`. **Regression gate: `grep -rn "gray-matter\|js-yaml" src/`
   returns 0.**

**MDMAX's own emission rule, DECIDED.** Anything MDMAX writes into frontmatter is emitted as a
**double-quoted scalar or a block sequence of double-quoted scalars**, never a flow sequence. That
one rule makes every value MDMAX produces immune to the class above.

**A latent hazard, correctly re-filed.** A 337-byte 9-level YAML alias bomb parses in gray-matter in
**1.7 ms**, survives `structuredClone` in **0.0 ms**, and then costs `JSON.stringify` **4,612.2 ms
at 1,082 MB RSS** before throwing `RangeError: Invalid string length` `[measured]`. The record
claimed this **freezes the browser tab today** via `SnapshotProvider.tsx:78`. **REFUTED**: the
snapshot DTO that gets stringified is `VaultSnapshot = {sha, generatedAt, tree, notes: NoteMeta[]}`
and `NoteMeta` (`dto.ts:35-43`) carries **no frontmatter field**; the projection at
`get-snapshot.ts:196-209` discards it, and `grep -rn '\.frontmatter' src` returns exactly one
consumer outside the parser (`get-snapshot.ts:199`, reading `public_slug` as a string). Independently,
`src/app/api/vault/snapshot/route.ts` stringifies on the **server** first, and JSON has no aliases
`[primary]`. **File it as a latent hazard, not a shipped defect** — and note that rule 5 above
removes it anyway, plus **ban `JSON.stringify` on any object derived from document bytes** (use
`structuredClone` into IndexedDB rather than `localStorage`) and add a depth-and-node-count guard on
any parsed frontmatter object regardless.

#### 10.6.6 What this does not fix

The lenient pre-pass makes broken frontmatter **readable**. It does not make the vault **correct**.
`mdmax vocab` — read-only, roughly two days — reports the three defect classes it cannot repair:
case and morphology drift in a controlled vocabulary, prose sitting in an enum slot, and an
unparseable value slot. **That is a report, not a rewrite.** Nothing in MDMAX ever edits a user's
frontmatter to make it parse.

---

### 10.7 Incremental architecture — the theory, and how much of it to build

#### 10.7.1 What the literature actually requires

`HANDOFF-mdz-markdown-format-2026-07-29.md` §3.16 is the most rigorous section in the record and it
must be read before any compiler work `[primary]`. Its five load-bearing results:

1. **Build Systems à la Carte** (Mokhov, Mitchell, Peyton Jones, ICFP 2018) frames the design space
   as **scheduler x rebuilder**: 12 cells, **8 inhabited** (Make, Excel, Ninja, Shake, CloudBuild,
   Bazel, Buck, Nix). Pick a cell deliberately.
   - The recommended cell is **suspending scheduler + verifying traces** — Shake's cell. It is the
     **minimum retained state that buys all three** of dynamic dependencies, minimality, and early
     cutoff: per key, `(hash of each dependency, hash of result)`.
   - **Make's cell provably cannot do early cutoff.** Early cutoff is exactly what you want when
     somebody fixes a typo and 400 files reference that document.
   - **Applicative tasks let you extract dependencies without running them; monadic tasks provably
     do not** (`Const` has no `Monad` instance). **Cross-file reference resolution that decides what
     to read based on what it just read IS monadic — which rules out a topological scheduler.**
2. **Incremental Computation with Names** (Hammer et al., OOPSLA 2015), verbatim: structural
   (hash-consed) matching means Adapton *"recomputes and reallocates a linear number of output
   elements for each O(1) input change"*, whereas nominal (named) matching *"need not rebuild the
   prefix."* So **content-hash identity implies Θ(n) per edit; stable names give O(1) or O(log n).**
   Identity is an **asymptotic** requirement, not a nicety. This retires "just content-address the
   blocks".
3. **Wagner & Graham** (TOPLAS 1998), verbatim: *"The central requirement for actual incremental
   behavior — balancing of lengthy sequences — has been ignored in all previous approaches."* A flat
   block sequence gives **O(n) for edits at the beginning or end** no matter how good the engine.
   **Unbounded sequences must be stored as balanced trees.**
   **And the escape hatch that breaks the guarantee applies directly to markdown:** it fails when
   *"the interpretation of the yield of a sequence depends on its context"* — which is **exactly
   setext headings, lazy continuation, link reference definitions, and fence state**. This is the
   single most concerning theoretical result for a markdown compiler.
4. **Incremental packrat parsing** (Dubroy & Warth, SLE 2017): invalidation must key on what a rule
   **examined**, not what it **consumed** (`examinedLength`). **A naive "invalidate overlapping
   ranges" rule is silently wrong** for a language with unbounded lookahead. Markdown is such a
   language. Measured there: reparse after a keystroke **mean 6.2 ms**, ~12% memory overhead.
5. **Ramalingam & Reps** (TCS 158, 1996): a proven hierarchy separating polynomially bounded,
   inherently exponentially bounded, and unbounded problems. **Some problems cannot be made cheap
   per edit no matter how much state you retain.**

The cost of incrementality, also measured in that literature: self-adjusting computation is
**4-10x slower on the cold build** to be **~1000x faster on update**; Adapton is **1.5-3.5x slower**
than traditional incremental computation when *all* output is demanded. **You are always trading
cold-build time for warm-edit time.**

#### 10.7.2 The honest verdict: this is over-specified for markdown at our scale

Every one of those results is correct. **Almost none of them earns its implementation here**,
because the workload they optimise does not exist in this corpus. Measured `[measured]`:

```
cold full lex of all 25.5 MB                                1,056 ms
maximum transitive blast radius                             54 files (5.0%),  mean 8.77
files participating in ZERO resolved edges                  507 of 1,084 (46.8%)
link reference definitions in the corpus                    0    (mdast: 0 `definition`,
                                                                  0 `linkReference`, 0 `imageReference`)
Lezer TreeFragment.applyChanges == full reparse             7 of 7 hand-built lookahead cases
```

Read those five lines together. **A build system's entire value is avoiding work over a large
dependency closure.** Here the closure is tiny and the full build is one second. And the construct
the incremental-parse literature is *about* — the link reference definition, the canonical unbounded
lookahead case — occurs **zero times in 25.5 MB of the founders' own markdown**, verified two
independent ways (an mdast parse of all 1,084 files finding 0 `definition` nodes, and a
`grep -rlE '^\[[^]]+\]: '` finding exactly 2 files, both under `md/Mirrors/`, which the corpus policy
excludes at top level) `[measured]`.

Microsoft says the same thing about its own dependency engine, in writing `[primary,
learn.microsoft.com]`: *"For some complex workbooks, the time taken to build and maintain the
dependency trees needed for Smart Recalculation is larger than the time saved by Smart
Recalculation."*

One more correction, because it removes the last argument for early cutoff. The record puts the
early-cutoff yield at 69.1% of revisions. Measured over git history restricted to **human** edits
(commits touching <= 60 `.md` files, modifications only), the exported interface survives
**41.54% of revisions in `knowledge` and 19.71% in `md`** — not 69.1% `[measured]`. The 69.1% figure
is dominated by bulk machine-generated commits (a 2,706-file mirrors import, three 240-file
recategorisations that are pure renames, a 742-file share migration) where nothing structural could
change. **A 3.5x correction, in the flattering direction.**

#### 10.7.3 BUILD / DELETE

**DECIDED.**

| component | verdict | reason |
|---|---|---|
| Lezer `TreeFragment.applyChanges` for the editor | **BUILD** — adopt, do not write | CodeMirror 6 is already a dependency and the Lezer tree is already in memory and currently discarded. Sound on 7 of 7 hand-built unbounded-lookahead cases |
| a property test asserting `incremental === full` | **BUILD** | 100 sampled single-character edits per file, over all 1,084 files. Any failure is a Lezer soundness bug and is blocking |
| `Map<path, {contentSha, blockIds}>` invalidated on sha change | **BUILD** — roughly 20 lines | this is the entire corpus-level cache |
| the **anchor** invalidation rule | **BUILD** | see below. This is a different thing from parse invalidation and is where the cost actually is |
| a bespoke examined-vs-consumed invalidation rule | **DELETE** | re-deriving something CodeMirror already gets right, for a construct that occurs 0 times |
| the Ninja/Shake **cell**, the topological **scheduler**, the verifying-trace **rebuilder** | **DELETE** | monadic reference resolution rules out the topological scheduler anyway; the closure is 5% and the cold build is 1 second |
| **durability-stratified key space**, escalation-to-suspending-scheduler plan | **DELETE** | machinery for work that does not exist |
| a **lock file as a build artifact** | **DELETE** | there is no build |
| **balanced named trees** for unbounded block sequences | **DEFER** | Wagner & Graham's requirement is real and asymptotic. It becomes load-bearing only when a single document routinely exceeds a few thousand blocks. The corpus's largest is `md/graphify-out/GRAPH_REPORT.md` at 7,755 top-level blocks `[measured, this section]` — one file. Revisit when the p99 document exceeds ~2,000 blocks |

**The anchor invalidation rule, which IS ours to write:**

- An anchor is invalidated when the block's **normalized text hash** changes. **NOT when its offsets
  change** — 80 of the 83 corpus divergences between our two parsers are offset-only (§10.9).
- **Mass invalidation is a NORMAL event, not an error.** Inserting five characters (an opening
  fence, `` ```\n\n ``) after paragraph 3 of a 40-paragraph document collapses **37 of 40 top-level
  blocks into a single `FencedCode@129-1754`** `[measured]`. The anchor layer must **batch-refuse,
  mark STALE, and re-resolve lazily on view**. It must never treat this as a failure.
- **Semantic (inline-resolved) indexes key on document version, never on block version.** Appending
  `[foo]: /url` at end-of-file leaves block 1's **bytes unchanged and its top-level type unchanged**,
  while its mdast inline children go from `[text]` to `[linkReference, text]` `[measured]`. This is
  Dubroy & Warth's hazard, and it is real — but it lives in the **inline** layer and is **invisible
  at the byte level**. A content hash over a block's raw text is **stable** across that edit (the
  anchor survives, which is what we want); any index over resolved inline semantics is invalidated
  by an arbitrarily distant edit (so that index must key on the whole document, which is expensive
  — another reason not to build one).

---

### 10.8 Differential testing

**DECIDED — four tiers.**

| tier | when | contents | PASS BAR | on failure |
|---|---|---|---|---|
| **A** | blocking, every PR | CommonMark **0.31.2** spec suite, 652 examples, against the reference parser; plus the GFM extension suite (tables, task lists, strikethrough, autolinks) | **652/652** and **100%** GFM | build fails |
| **B** | blocking, every PR | **self-differential** over all 1,084 pinned files: (i) micromark block segmentation == Lezer block segmentation modulo a documented tolerance; (ii) Lezer incremental == Lezer full for every single-character edit at 100 sampled positions per file; (iii) splice round trip byte-identical | (i) baseline 997/1,080 with the documented tolerance; (ii) **100.0%**; (iii) **100.0%** | build fails |
| **C** | blocking, every PR | the hostile corpus with budgets asserted | every case returns `ok` **or a NAMED budget refusal** within **2x** the budget; **zero** process aborts | build fails |
| **D** | nightly, non-blocking | fuzzing: a three-way vote among micromark, markdown-it-py 4.2.0 and Lezer on generated documents, reporting any 2-1 split | report only | file an issue |

**Tier A's numbers are UNVERIFIED here and must be tagged `[secondary]` until the suite is vendored.**
The claim is micromark 4.0.2 at **652/652 (100.0%)** and marked 16.4.2 at **531/652 (81.4%)** — 121
divergences concentrated in Images (19), Links (17), Setext headings (16), Entity references (12),
Thematic breaks (12), Hard line breaks (8). The arithmetic is internally consistent (531/652 =
81.44%, 652 - 531 = 121) but **no CommonMark 0.31.2 spec suite is present in this repository**
(`find . -name spec.json` outside `node_modules` returns nothing) and an independent verifier could
not check it `[measured, this section]`. **First task in tier A: vendor `spec.json` at a pinned
version and re-derive both numbers.**

**Tier B's documented divergence, DECIDED.** A block **start** offset may differ by up to the
block's leading-whitespace run **when both parsers agree on type and end offset**. Everything else
fails the build. This is not a fudge; it is the measured shape of the disagreement (§10.9).

**Tier B's denominator is 1,080, not 1,084, and here is why.** An audit flagged "997/1,080 (92.31%)"
as using a denominator four short of the pin with no explanation. The four missing files are the
**four zero-byte files** in the corpus `[measured, this section]`. Counting them as trivially
identical gives 1,001/1,084 = 92.34%. **State the denominator and the reason in the fixture header
so nobody re-flags it.**

**Tier D's oracle, honestly.** `cmark-gfm` and `pandoc` are **not installed** on this machine and
there is no Homebrew formula present. Every statement anywhere in this plan about the CVE-2023-22484
shape is measured against **JavaScript parsers only**; the comparison to the C reference
implementation is **search-only** `[measured]`. Building `cmark-gfm` as a fuzzing oracle is the one
piece of tier D worth a build step, and it should be a separate, optional CI job.

**EXPLICITLY OUT: `marked` as a conformance target.** It scores 531/652 and, with default options,
emits `<script>alert(1)</script>` verbatim and `href="javascript:alert(1)"` `[measured]`. It is a
**degradation target** in the `mdmax cert` matrix with its 121 known divergences enumerated. It is
never a correctness oracle.

**One thing that does not exist and that we would be first to ship.** `npm search 'babelmark'`
returns **total: 0**; `npm search 'commonmark differential'` returns 1,396 results whose top hits are
parsers, not harnesses; babelmark3 is a hosted web service with no published package and no corpus
`[measured]`. **Nobody ships "here is a pinned hostile corpus plus a runner plus a divergence
report" for markdown.** Nor does a markdown parse budget exist: markdown-it has `maxNesting` (a depth
cap, not a time cap), and micromark, remark and marked have **no limit of any kind**. A
`parseWithBudget(src, {ms, bytes, blocks})` returning `{ok | BUDGET_EXCEEDED}` instead of hanging
**does not exist on npm** `[measured]`.

And the reason it does not exist is worth recording, because it explains why nobody upstream will
fix this for us. **The CommonMark specification's entire security surface is two sentences plus one
clause, in a 9,811-line document, and both are about U+0000.** Line 479 is `## Insecure characters`;
`grep -n -i "security|sanitiz|denial of service|untrusted"` over the whole spec text returns exactly
**2** hits `[primary, spec.txt version 0.31.2]`. **There is no section on resource exhaustion,
nesting depth, sanitisation, or untrusted input.** A compiler will be fed hostile documents and the
specification is silent about all of it.

---

### 10.9 Two parsers, permanently

**DECIDED.** MDMAX runs two markdown parsers forever and this is not a defect to be resolved:

- **micromark 4.0.2 (via `mdast-util-from-markdown` / `remark-parse` in v1) for the compiler.** It is
  the conformance reference (652/652, once vendored) and the source of the per-document byte offsets
  the splice writer consumes.
- **`@lezer/markdown` 1.6.3 for CodeMirror.** It is already in memory because CodeMirror 6 is already
  a dependency, it is the only parser that stayed near-linear on every shape tested, and it carries
  the incremental reparse the editor needs.

Replacing either with the other is not on the table. CodeMirror cannot consume mdast, and the splice
writer cannot consume a Lezer tree without a mapping layer that would itself need conformance tests.

**The good news, measured.** The two agree far more than "two parsers" suggests, and where they
disagree it is an **offset** problem, not a **structure** problem `[measured, over the corpus]`:

```
non-empty files compared                 1080
byte-identical top-level segmentation     997   (92.31%)
divergent files                            83
   start-offset divergence                 80
   end-offset divergence                    3
   TYPE divergence                          0
total top-level blocks   mdast 107317   lezer 107315   (0.0019% apart)
block COUNT differs on                      2 files (0.19%)
modal case: a 2-character start offset on a `list` whose leading indent Lezer includes and mdast
excludes — e.g. md/Courses/WithArin Claude Code/WithArin Claude Code.md, mdast list [40,103] vs
lezer list [38,103]
```

**DECIDED — the shared conformance fixture.** Every construct MDMAX understands gets one fixture
file run against **both** parsers:

```
test/fixtures/constructs/<construct>/
  input.md              the source, byte-exact, with a trailing-newline marker in the manifest
  expect.blocks.json    [{type, start, end}]  in U16Offset, the agreed segmentation
  expect.notes.md       any DOCUMENTED divergence, with the reason and the date it was accepted
```

The runner asserts `micromark(input) == expect.blocks` and `lezer(input) == expect.blocks` modulo
the documented tolerance, and **fails on any type divergence unconditionally**. A construct without
a fixture in both parsers does not ship.

**The negative, stated plainly.** This regime protects **block segmentation**. It does **not**
protect inline semantics, where the two parsers have never been compared, and where the
examined-not-consumed hazard lives (§10.7.3). If comments ever anchor to inline ranges rather than
block ranges, this section is insufficient and needs an inline conformance tier that does not
currently exist.

---

### 10.10 What is over-specified and should be deleted; what is under-specified and will bite

#### 10.10.1 Delete these. They are machinery for work that does not exist.

| delete | evidence |
|---|---|
| **The incremental build system** — Ninja/Shake cell, topological scheduler, verifying-trace rebuilder, durability-stratified key space, escalation plan, lock file as a build artifact | cold full lex 1,056 ms; max transitive blast radius 54 files (5.0%); 46.8% of files in zero edges; 0 link reference definitions in 25.5 MB; monadic resolution rules out a topological scheduler anyway `[measured]` |
| **A bespoke examined-vs-consumed invalidation rule** | Lezer `TreeFragment.applyChanges` is sound on 7 of 7 hand-built cases including a mid-document open-fence insertion that collapses 37 blocks `[measured]` |
| **Hardening the frontmatter delimiter grammar** | gray-matter and the preview's `FM_RE` disagree on **9 of 12 synthetic edge shapes** and on **0 of 1,084 real files** — both accept the same 737 and reject the same 170. Hardening it would have caught **zero real bugs**. Build the 12-case table later as a **regression fence**, after the real defects are fixed `[measured]` |
| **Adversarially attacking the re-anchor's accuracy** | no hostile input was found that makes it return a **wrong** answer; the measurable failure mode is cost, and cost is bounded by refusal `[measured]` |
| **Hardening against 40 of the 45 hostile shapes** | all 40 parsed under 500 ms across every parser with zero crashes. Gate them nightly; do not engineer for them `[measured]` |
| **The `EditableTable` / `setTableCell` write path** | delete it, do not fix it. Imported by nothing (`components.tsx:36` names the callback `_onEdit`), corrupts `\|` cells, 7.4% of what it detects as tables are inside code fences, dirties 13.4% of files on a no-op. It is dead code today, which is the only reason it is not already a live data-loss bug `[measured]` |
| **`mdmax unpack` in v1** | pack is a read transport and needs no inverse. `llm-code-format` ships pack+unpack at 387 downloads/week against repomix's 327,543 — an **846:1** revealed-demand ratio against the reverse operation `[measured]` |
| **The 384-configuration sweep as something to re-run or withhold** | it produced three scalars (3-gram shingles, jaccard >= 0.20, margin <= 0.05). **Publish them.** Withholding buys nothing — a competitor re-sweeps in an afternoon on a bigger public corpus — and costs the credibility of an unverifiable 99.627% |

#### 10.10.2 These are under-specified and will bite. Ranked by when.

| # | hazard | when it bites | the fix, and its size |
|---|---|---|---|
| 1 | **The offset model** (§10.2) | the first time a byte offset meets a UTF-16 offset — i.e. the first content hash over a range | `offsets.ts` + branded types + one lint rule. **Half a day.** Must land **before** the splice writer's second caller, because retrofitting branded types after four call sites is a refactor rather than a decision |
| 2 | **`share-writer.ts:26` and `frontmatter.ts:47`** (§10.6.3) | **every Publish and every properties-panel edit, today** | replace both with `splice()` in the same commit. **~40 lines** with the boundary assertion, plus a vitest suite that replays 907 files. `gray-matter`'s `matter.stringify` re-parsing its argument makes this a **silent body-truncation** risk, not cosmetic churn |
| 3 | **The YAML value slot** (§10.6) | 266 of 1,084 files today — 170 loudly as a 502, **96 silently with no error at all** | byte-scan splice for writes + lenient pre-pass for reads + the `WIKILINK_IN_FLOW_SEQ` refusal. Must ship in the **same PR** as item 2 or the 170-file case stays broken |
| 4 | **`normalize/1` and `slug/1` unversioned** (§10.3, §10.4) | the first time either function changes **after** an anchor is persisted. Before that it is free; after that it is a migration | two files, two `VERSION` constants, a 200-case golden file, one CI assertion. **One afternoon.** Anchor health swings **77 percentage points** on the slug choice alone |
| 5 | **`WIKILINK_RE`** (§10.5.3a) | the first vault containing 160 KB of unclosed `[[`, which a half-typed vault produces without an adversary. **36,865 ms**, blocking the shared server event loop | replace the regex with a bounded index scan. **~10 lines.** Regression gate: k <= 1.05 at 80,000 `[[` |
| 6 | **`LivePreview` parses on the browser main thread** (§10.5.3c) | **today**, on a real file already in the founders' vault: **19-31 seconds** on `md/_Archive/Satinath Content JSON (raw source).md` | move `splitIntoSegments` behind the shape gate and into a Web Worker, or precheck bytes/lines before calling it. This defect was found by neither the researcher nor its verifier |
| 7 | **The `resourceLimits` constant** (§10.5.5) | whenever somebody "tunes" it upward. 32 MB gives a catchable error; 256 MB gives a SIGABRT that kills the parent | pin it, comment it with the measurement, and regression-test both outcomes |
| 8 | **The refusal enum** (§10.5.6) | the moment the second route handler consumes a parse result | half a day of naming. If it is not named first, every call site grows its own `try/catch` and the discriminated union never happens |
| 9 | **Bidi controls reaching the DOM** | already live: U+202E and U+202C survive into HTML from fenced code blocks, inline code spans and link text; U+2067/U+2069 from headings; `grep -rniE "202e\|bidi_control" src/` returns **zero hits** `[measured]` | escape `\p{Bidi_Control}` or render a visible marker. A compiler that silently passes them through is actively harmful, and this is a code reviewer reading a fenced block to make a decision |
| 10 | **The frontmatter wikilink population is a THIRD reference kind** | as soon as the link resolver ships | 2,283 `entities:`, 1,407 `related:`, 49 `up:` wikilinks resolve at **13.95%** — worse than body links — and the two-tier HARD/SOFT design has no third tier for them. **OPEN: is a frontmatter wikilink hard, soft, or a concept name?** It is a third of all wikilinks and it is undocumented |

#### 10.10.3 OPEN questions this section cannot close

1. **Is a frontmatter wikilink a link or a concept name?** (row 10 above). Needs a founder decision,
   not a measurement.
2. **Does the budget-and-refuse architecture have an acceptable false-refusal rate on AI-generated
   documents?** (P3 in §10.5.8). The 500-document AI arm does not exist. This is the single most
   valuable unbuilt fixture in the programme.
3. **Does `blocksFromEvents(micromark.events(src))` avoid materialising an mdast-equivalent
   structure?** If not, the "never build mdast" prescription is dead and the answer is Lezer for
   everything. Nobody has tested it.
4. **Is 99.627% real?** Nobody has re-derived it. Eight research areas cite it. **No build item in
   this plan is allowed to depend on it**, and that is deliberate.
5. **Does the transfer cost of a parsed tree across the worker boundary dominate the parse?** At
   `docs/engine/PLAN.md` scale it already ties (71.0 ms transfer against 35.5 ms parse). At 20x that
   size it may dominate, which would replace the worker-with-a-message-boundary design with a
   `SharedArrayBuffer` flat-tree encoding.

#### 10.10.4 The honest stop condition for this whole section

Three of the four highest-value findings here — the `WIKILINK_RE` quadratic, the YAML Date-versus-string
divergence, and the `share-writer` regeneration — are **defects in code that already exists**, not in
a compiler that does not. A fourth, the `LivePreview` main-thread parse, is the same. **If the team
fixes those four and finds that the mdast quadratic does not reproduce on their machine, this entire
section was a code review wearing a research costume, and it should be re-run as one.** That would be
a good outcome, not a bad one: it would mean the engine's remaining risk is smaller than the record
implies, and the work is editor work.


---

---

### Links

**This section references:** [§1 Orientation](01-orientation.md) · [§3 Capabilities](03-capabilities.md) · [§5 Rendering](05-rendering.md)

**Referenced by:** [§0 Status](00-status.md) · [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§7 Product](07-product.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
