---
mdmax: 1
section: 3
title: "What MDMAX is: every capability, specified"
slug: 03-capabilities
lines: 1646
words: 14820
forward_links: [1, 2, 4, 5, 7, 9, 10]
backlinks: [1, 2, 5, 6, 7, 10, 11, 12, 13, 14]
prev: 02-chronology
next: 04-representation
---

[← Index](README.md) · [← §2 Chronology](02-chronology.md) · [§4 Representation →](04-representation.md)

## 3. What MDMAX is: every capability, specified

**MDMAX is the capability layer underneath `frontmatter`.** It is a library that lives in
`src/modules`, is subordinate to the editor, and is deleted the moment the editor stops needing it.
It is not a compiler programme, not a format, not a spec, and not a standalone product. It has
exactly one public artifact (`mdmax cert`, §3.3) and one public promise (splice-only writing, §3.1).

This section specifies seven capabilities. For each one it states what it does, why it exists, the
measurement that justifies it, how it works mechanically, its command-line or programming interface,
how it fails, and the single observation that would kill it. Nothing here is optional reading — a
capability whose kill condition is not written down is a capability nobody can stop.

### 3.0 How to read the numbers in this section

Every figure about our own files carries a corpus id. There is exactly one:

```
corpus_id  sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
files      1,084
bytes      25,548,765
roots      md          @02c22ec47a3a73fb25a14b11be233ad3d00a8b48   756 files   21,068,853 B
           knowledge   @464eb666946c8cb4ccf42c68f4464613e5fc4999   272 files    3,570,923 B
           frontmatter @798ebbf3250a5b2a53785859d79ae15f55ebebeb    56 files      908,989 B
policy     all *.md case-insensitive; skip .git .next .obsidian .trash .venv __pycache__
           build dist node_modules at any depth; skip any dot-directory;
           skip top-level Mirrors/ and Paste/ per root
manifest   docs/engine/research/corpus-manifest.json
```
`[primary — read from the manifest file]`

**Three honest caveats on that corpus, stated once here so they are not repeated seven times.**

1. **The corpus id itself is unverifiable today.** The kill audit tried three plausible
   constructions over the sorted `(path, sha256)` list and got `1a00525b…`, `561187d3…` and
   `5aad2ccb…` — none matching. No derivation script exists in the repo (`grep -rl corpus_id` over
   `scripts/` and `docs/` finds only the manifest). The **file list and all 1,084 sha256 values were
   independently re-verified with 0 mismatches**, so the data is sound and only the label is
   uncheckable. **Fix, half an hour: commit the ~10-line script that derives the id.** `[measured,
   kill audit]`
2. **The corpus is contaminated and every corpus-wide percentage inherits it.** The two largest
   files are `md/_Archive/Satinath Content JSON (raw source).md` at 1,491,757 B — verified by
   reading it, it is JSON in a `.md` wrapper — and `md/graphify-out/GRAPH_REPORT.md` at 1,466,025 B,
   a generated report. Together **11.58%** of the corpus bytes. `graphify-out` contributes
   1,607,862 B = **6.29%**. Four files are 0 bytes. `[measured]`
3. **It double-counts across roots.** 28 non-empty cross-root duplicate sha256 groups, 29 redundant
   copies, 440,139 bytes = **1.72%** (e.g. `docs/research/frontmatter-pain-playbook.md` at 93,259 B
   appears in both the `md` and `frontmatter` roots). `[measured]`

**Claim tiers**: `[measured]` we ran it · `[primary]` we read the source · `[secondary]` ·
`[inference]` · `[SIMULATED]` replayed through code, not read from a live system.

**Zero live model calls were made in any of the three research runs.** The one live-model number in
this section is external (§3.5, the OKF benchmark). Every other "easier for AI" statement is a
**prediction**.

### 3.0.1 The seven capabilities at a glance

| # | capability | status | effort | depends on |
|---|---|---|---|---|
| 1 | **The splice writer** | **DECIDED** | 0.5–1 day | nothing |
| 2 | **Block identity / content-derived re-anchoring** | **DECIDED** as tier 3 of a ladder; tier-3 ship date **OPEN** | tiers 1–2: 2–3 days · tier 3: 2–3 weeks incl. benchmark `[inference]` | §3.8 offset model, §3.8 `normalize/1` |
| 3 | **The degradation certificate — `mdmax cert`** | **DECIDED** to ship; scope **RECOMMENDED** | **2 days hard cap** (plan) vs ~3 weeks (research design) — contradiction resolved in §3.3.8 | nothing; parse only |
| 4 | **The near-miss reference checker** | **RECOMMENDED** | symbol table 2–3 weeks · classifier ~1 day of code plus a labelled set | §3.8 `slug/1` pinned |
| 5 | **Budgeted projection (index / outline / full)** | index + outline **RECOMMENDED**; the budget knapsack **OPEN** | fence-aware split/join ~2 days · knapsack unscoped | §3.4 symbol table |
| 6 | **Provenance** | **DECIDED** — emit OKF v0.2 §5; per-span method/confidence **OPEN** | 1–2 days for read + emit | §3.3 (cert carries the columns) |
| 7 | **The container — `pack` / `unpack`** | **RECOMMENDED, SEQUENCED after 1 and 2** | high | §3.1 splice, §3.2 identity |

---

### 3.1 Capability 1 — THE SPLICE WRITER

#### 3.1.1 What it does

One function is permitted to write bytes into a user's `.md` file. It replaces a byte range and
copies everything else verbatim. It never re-serialises a document from a syntax tree.

#### 3.1.2 Why it exists

Because regenerating markdown from an AST is **mathematically excluded**, not merely lossy. Foster,
Greenwald, Moore, Pierce & Schmitt, *Combinators for bidirectional tree transformations*, ACM TOPLAS
29(3), 2007, **Lemma 3.9**: a total well-behaved lens whose `put` ignores the original source
requires `get` to be a bijection. "Regenerate from the AST" is definitionally such a lens, and `get`
is nowhere near injective: **443 of 655 CommonMark spec examples are two distinct source strings with
a byte-identical AST** `[measured, docs/engine/PLAN.md §1.2]`. This is decision **D7**.

#### 3.1.3 The measurement that justifies it — and it says the writer already works

```
Identity splice through stock mdast-util-from-markdown node.position.start/end.offset,
over every top-level block:

  files              1,080
  blocks           107,287
  spliceIdentityOK   1,080
  spliceBad              0
```
`[measured, corpus_id sha256:3a010b16…, final-gate TECHNICAL synthesis lens]`

(1,080 rather than 1,084 because four corpus files are zero bytes.)

The negative control is equally strong. **Nothing survives the AST round trip:**

| selection | round trip | byte-identical |
|---|---|---|
| 51 files in this repo | `parse → remark-stringify` | **0 of 51** (1 of 51 after tuning every option) `[measured, engine PLAN §1.2]` |
| 60 files, 2,000 < bytes < 20,000, nearest 8 KB, all three roots | `mdast-util-from-markdown` + `mdast-util-to-markdown` + GFM | **0 of 60** `[measured, founder-thesis]` |
| 120 files, seeded pseudo-random (seed 20260801), all sizes, all three roots | same | **0 of 120**, 0 errors `[measured, founder-thesis verifier — CONFIRMED]` |

Three independent selections, three zeroes. `mdast-util-to-markdown`'s own documentation states
*"complete roundtripping is impossible."* `[primary]`

#### 3.1.4 Two shipped code paths violate D7 today, on every Publish

**Violation 1 — `src/modules/share/infrastructure/share-writer.ts:26`.** Verified verbatim:

```ts
const next = matter.stringify(parsed.content, data);
```

The file's own header comment reads *"…splicing the key into the YAML frontmatter…"*. **The comment
is false.** `node_modules/gray-matter/index.js:161`, verified verbatim:

```js
matter.stringify = function(file, data, options) {
  if (typeof file === 'string') file = matter(file, options);
  return stringify(file, data, options);
};
```

`parsed.content` **is** a string, so `matter()` re-parses it. Any body that opens with a `---` block
is consumed as front matter and **silently lost**. This fires on every Publish and every Unpublish.
`[primary — both files read this session]`

**Violation 2 — `src/modules/preview/presentation/frontmatter.ts:47`** (and again at line 59),
verified verbatim:

```ts
const yaml = doc.toString().replace(/\n$/, "");
```

Measured against every front-matter block in the pinned corpus: **170 of 907 blocks throw** under
gray-matter, and **only 33 survive byte-identical (3.64%)**. `[measured, corpus_id sha256:3a010b16…]`

**The app is named `frontmatter` and it mangles front matter in the only two write paths that ship.**
Every argument about whether a splice writer is worth building collapses the moment you notice it has
two callers already broken in production.

#### 3.1.5 WARNING — do not take the `yaml`-library shortcut

The obvious fix is to swap `gray-matter` for the already-installed `yaml` package's `Document` API.
It is not good enough. Measured over every front-matter block in the pinned corpus with
`yaml` 2.9.0 (version read from `node_modules/yaml/package.json`), and **reproduced 4/4 by the
independent kill audit**:

| outcome | blocks | share |
|---|---|---|
| byte-identical no-edit round trip | **119** | 13.12% |
| drift | 618 | 68.14% |
| **fails to parse at all** | **170** | 18.74% |
| total front-matter blocks | 907 | 100% |

Typical drift: `tags: [daily]` → `tags: [ daily ]`. Typical no-parse: an unquoted `[[wikilink]]` or a
bare `@`. `[measured, kill audit — PERFECT REPRODUCTION, 4/4 numbers]`

**Note the two nearby numbers are not the same number.** 171 is the count of blocks `gray-matter`
throws on; 170 is the count `yaml` cannot parse. Different parsers, different failures. Do not merge
them. Note also that v2.0.0 of this plan wrote "170 **files** do not parse"; the audited figure is
170 **blocks** of 907. With one block per file they coincide, but quote the block figure.

#### 3.1.6 How it works — the specification

```ts
// src/modules/mdmax/splice.ts   — the ONLY function permitted to write document bytes

export type U16Offset = number & { readonly __brand: "U16Offset" };

export interface SpliceReceipt {
  readonly range:        { start: U16Offset; end: U16Offset };
  readonly beforeSha256: string;   // sha256 of the whole source
  readonly afterSha256:  string;   // sha256 of the whole result
  readonly prefixSha256: string;   // sha256 of src.slice(0, start)      — proves untouched
  readonly suffixSha256: string;   // sha256 of src.slice(end)           — proves untouched
  readonly replacedBytes: number;
  readonly insertedBytes: number;
}

export function splice(
  src:         string,
  range:       { start: U16Offset; end: U16Offset },
  replacement: string,
): { bytes: string; receipt: SpliceReceipt };
```

Algorithm, in full — there is no more to it:

```
1. ASSERT 0 <= start <= end <= src.length                       else throw E-RANGE
2. ASSERT start and end do not fall inside a UTF-16 surrogate pair
     (src.charCodeAt(i) in [0xDC00,0xDFFF] with a high surrogate at i-1)
                                                                 else throw E-SURROGATE
   — never round an offset to a legal one; refuse it.
3. out = src.slice(0, start) + replacement + src.slice(end)
4. ASSERT out.slice(0, start)                     === src.slice(0, start)
   ASSERT out.slice(start + replacement.length)   === src.slice(end)
5. return { bytes: out, receipt: { … } }
```

The frontmatter caller is a byte scan, not a parse — which is the entire point, because it must work
on the 171 blocks no YAML parser can read:

```ts
spliceFrontmatterValue(src: string, key: string, value: string | null): string
// 1. locate the opening delimiter: /^---\r?\n/ at offset 0, else there is no block — refuse.
// 2. locate the closing delimiter: the next line that is exactly "---" (or "...") at column 0.
// 3. inside [openEnd, closeStart), scan lines for /^\s*<key>\s*:/ at indent 0.
// 4. value === null  -> splice(src, {start: lineStart, end: nextLineStart}, "")
//    else if found   -> splice(src, {start: valueStart, end: lineEnd}, serialiseScalar(value))
//    else            -> splice(src, {start: closeStart, end: closeStart}, `${key}: ${v}\n`)
// NO YAML PARSER IS INVOKED ON ANY PATH.
```

#### 3.1.7 API and CLI surface

There is **no CLI**. This is a library function. It ships as `src/modules/mdmax/splice.ts` (~40 lines
with the boundary assertions) plus a `vitest` suite that replays all 907 front-matter-bearing files.
`[final-gate TECHNICAL synthesis, item P-W, `ships_as`]`

#### 3.1.8 Dependency note that will bite you

`mdast-util-from-markdown` is **not** in `package.json` `dependencies`. It is present in
`node_modules` at **2.0.3**, pulled in transitively via `remark-parse ^11.0.0`
(`mdast-util-to-markdown` is likewise present at 2.1.2, transitively). The research repeatedly says
"already a dependency"; that is true only transitively. **Add an explicit direct dependency and pin
it before the splice writer relies on `position.offset`,** or a transitive bump silently changes the
offsets you are splicing on. `[primary — package.json and node_modules read this session]`

#### 3.1.9 Failure modes

| failure | cause | behaviour |
|---|---|---|
| `E-RANGE` | offsets out of bounds or inverted | throw before any write |
| `E-SURROGATE` | an offset falls inside a surrogate pair | throw; **never round** |
| No front-matter block | file does not open with `---` | refuse, return the source unchanged; **never synthesise a block** |
| Unterminated block | opening `---` with no closing delimiter | refuse; the file is passed through untouched |
| CRLF | 1 file in 1,084 uses CRLF `[measured]` | the byte scan must accept `\r?\n`; the receipt proves nothing was normalised |
| Offset-unit confusion | a byte offset from git, `Buffer`, or a content hash enters the function | prevented by the branded type in §3.8.1, not by care |

#### 3.1.10 The gate, and it must go RED first

> **Publish-then-unpublish over all 907 front-matter-bearing files of
> `corpus_id sha256:3a010b16…` is byte-identical, INCLUDING the 171 that `gray-matter` cannot read
> and the 170 that `yaml` cannot read — verified by an oracle sharing no code with the writer.**
>
> Per Learned Rule #68: run the assertion against the **current** writer first and watch it fail. A
> green suite on an unfixed system is the expected result of running it, not evidence of a fix.

#### 3.1.11 Kill condition

There is no kill condition. This capability is a **bug fix for a live data-corruption defect** with a
proven implementation. If the gate cannot reach 907/907 the defect is in our implementation, not in
the approach — the 1,080/1,080 identity-splice result already proves the approach.

#### 3.1.12 What this does NOT cover

Splice-only writing gives fidelity. It does **not** give *alignment* — knowing where a stored anchor
moved to after someone else's edit. That is §3.2. CodeMirror's `ChangeSet` satisfies the Edit Lenses
module laws (Hofmann, Pierce & Wagner, POPL 2012) under 5,000/5,000 property tests, and
`@codemirror/state ^6.6.0` is already a direct dependency `[primary, package.json]` — that is where
alignment comes from inside the app, not from the splice writer.

---

### 3.2 Capability 2 — BLOCK IDENTITY AND CONTENT-DERIVED RE-ANCHORING

#### 3.2.1 What it does

Given a block from an old revision of a document and the new document, return the block's new
position, or refuse. Refusal is a first-class answer.

#### 3.2.2 Why it exists — and the honest position, stated first

Every serious document system solved anchoring using a property we do not have: Word puts
zero-width sentinel pairs in XML; Notion puts a UUID on a database row; Overleaf and ProseMirror/CM6
remap integer offsets through the operation that caused the change, which requires **owning every
write**. `[primary, engine PLAN §1.1]` We cannot own every write: a `git pull` yields a new string,
a `vim` edit yields no operation at all.

**But the honest position, which v1 of this plan got wrong: content-derived re-anchoring is the
VERIFIER and the FALLBACK, not the primary mechanism** — because in this product a previous version
essentially always exists. In-app edits give a CodeMirror `ChangeSet`; offline sync, AI Edit and
external sync all give a before **and** an after. The plan's own §4.1 already conceded this; the
build sequence must match the concession.

**Correction to a load-bearing justification we published.** We justified this capability with
*"a git pull yields no op stream."* It yields two blobs and a merge base, **and a diff is an op
stream**. The 294-revision-pair corpus was itself built from git history — the diff was in hand for
all 41,642 block-versions and was never used as a baseline. `[v2.0.0 §9.4]`

#### 3.2.3 The algorithm, complete

From `docs/engine/PLAN.md §1.1a`, reproduced in full because it is the specification:

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

Parameters, chosen by a **384-configuration sweep**:

| parameter | value | why |
|---|---|---|
| `normalize` | NFC + collapse whitespace + lowercase | recovers reflow and case edits free |
| `K` (context radius) | **3** | 1 → 97.88%, 3 → 98.13%, 5 → 98.21% |
| `TAU` (Jaccard floor) | **0.20** | 0.20 → 99.14% vs 0.70 → 96.47% correct at **no** false-match cost |
| `W` (context weight) | **1.0** | best on both axes |
| `DELTA` (tie margin) | **0.05** | lowest false rate; below it, refuse |

#### 3.2.4 The measurements

Over **41,642 block-versions** from **294 consecutive real revision pairs**; denominator **32,919
surviving block-versions**:

| scheme | correct | **false match** | safe refusal |
|---|---|---|---|
| byte offset | 36.93% | **62.12%** | 0.95% |
| block index | 44.43% | **55.50%** | 0.08% |
| content hash alone | 83.36% | 0.00% | 16.64% |
| content hash + nearest-position tiebreak | 77.80% | **22.20%** | 0% |
| rigid context fingerprint k=1 / k=2 / k=3 | 90.65 / 88.68 / 87.22% | 0.25% | 9–13% |
| content-defined chunking (rolling hash) | 18.92% | **67.30%** | 13.79% |
| **recommended, anchorable blocks only** | **99.627%** | **0.050%** | **0.323%** |

Cost: **~41 ms** for a 446 KB / 2,225-block document. `[measured, engine PLAN §1.1a]`

Supporting facts that matter more than the headline:

- **The `anchorable()` gate is the highest-leverage single line in the design.** It moves the false
  rate 0.349% → **0.050%**; **88.9% of raw false matches are `---` horizontal rules.**
- **12.9% of blocks present more than one candidate**, and on that subpopulation the resolver scores
  94.94% correct / **2.66% false — 50× the single-candidate error rate**. Removing the `DELTA`
  refusal produced **183 extra false matches**.
- **All 14 false matches on anchorable blocks were hand-audited, not sampled**: 4 oracle artifacts,
  6 from a bulk markdown→HTML migration, 3 homogeneous-list drift, 1 table rewrite. **Genuine
  substantive errors: 10 in 28,170 = 0.036%.**
- **The known adversarial input is already in the corpus.** `knowledge` scores **8× worse (0.280%
  false)** because `knowledge.md` is one enormous homogeneous index list. **List items must carry a
  structural key — position within the parent list plus the parent's identity — rather than relying
  on text alone.**

#### 3.2.5 The adversarial baseline, and why it does not kill the capability

A **30-line LCS diff** — no shingles, no context scoring, no sweep — was executed against the same
corpus:

| run | pairs | anchorable block-versions | LCS matched | unique-text | hash-alone-unique |
|---|---|---|---|---|---|
| original | 394 | — | **86.658%** | 77.297% | 77.297% |
| independent verifier | **494** | **31,149** | **85.036%** | 76.346% | 76.352% |

`[measured, final-gate `against` area + its verifier — headline verdict OVERSTATED]`

**Both are far below 99.627%, and the gap is not the argument.** The argument is that
`diff3`-assisted resolution is available whenever a previous version exists, which is almost always.
**Two facts stop LCS from being the whole answer:**

1. **LCS makes a silent order-based tiebreak on duplicate text.** Of 2,707 duplicate-text LCS
   matches, **111 (4.10%) have neither neighbouring block matching** — 0.356% of all anchorable
   block-versions, **~7× the 0.050% false rate the tuned resolver books.** That is the same trade the
   sweep already measured at 0.00% → 22.20% false for position tiebreaks.
2. **The benchmark cannot adjudicate this on the pinned corpus.** **86.6% of `.md` file-revisions in
   its largest root delete zero lines**, so S1 resolves by construction and the number is a property
   of an append-dominated corpus. Tier 3 must be measured on a stratum restricted to revisions
   deleting more than two lines — and **that stratum may be too small to measure, which is itself the
   finding.**

#### 3.2.6 The most useful result in the whole area — token stratification

All residual risk lives in short blocks. Independent verifier run, 494 pairs, `corpus_id
sha256:3a010b16…` (`{matched, at-risk}`):

| block length | matched | at-risk | at-risk rate |
|---|---|---|---|
| 3–5 tokens | 5,329 | 2,360 | **44.28%** |
| 6–9 tokens | 3,899 | 337 | 8.64% |
| 10–19 tokens | 3,298 | 10 | 0.30% |
| **20+ tokens** | 13,962 | **0** | **0.00%** |

**2,697 of 2,707 at-risk block-versions (99.63%) are ≤ 9 tokens.** `[measured — verdict CONFIRMED,
"the most valuable thing in the submission"]`

**Scope note, not a defect:** this is an *ambiguity* rate, not an *error* rate. Neither run has
ground truth for "false" on this stratification.

#### 3.2.7 Five caveats that must travel with the 99.627% figure, every time

1. **Nobody has re-derived it.** Not one of the research areas that quoted it, including the ones
   that built their design on it. **Do not publish it externally until it is re-derived on a corpus
   this team did not write.**
2. **It is a BLOCK figure. Comments anchor RANGES.** The one replication of the range case gives
   **3.44×, not 30×**, with refusal roughly doubling.
3. **~1 heading in 4 cannot carry an anchor** (18.3% / 25.4% / 24.7% of headings are under 3 tokens
   across the three roots) — and headings are what everything points at.
4. **Move figures are `[SIMULATED]`.** Real history contained **zero multi-block moves, 138
   singletons only.**
5. **The oracle shares a candidate generator with the resolver.** The full hand-audit is the defence,
   and it found 4 of 14 "errors" to be oracle artifacts.

#### 3.2.8 How it ships — a three-tier ladder, in this order

```
tier 1   ChangeSet.mapPos          @codemirror/state, already a direct dependency,
                                   exact by construction, in-app edits only
tier 2   diff3-assisted            whenever a previous version exists (almost always)
tier 3   content-derived S1/S2/S3  ONLY when neither is available:
                                   offline-sync reconciliation, an external edit,
                                   a git pull with no merge base
```
Tier 3 returns `RESOLVED | AMBIGUOUS | LOST` and **never breaks a tie by position.**
`[final-gate TECHNICAL synthesis, item P4]`

**For comments specifically, use the W3C `TextQuoteSelector`** (Web Annotation Data Model, a W3C
Recommendation since February 2017): `{ exact, prefix, suffix }`. It is not an invention and must not
be described as one.

**Do not vendor `dom-anchor-text-quote` as the substrate.** Read in full (158 lines on `master`; the
research said 182 — a self-report error): every search is `dmp.match_main(root.textContent, pattern,
loc)`, a DiffMatchPatch bitap with a location hint. **There is no exact path, no candidate array, no
scoring, and the only returns are `null` or one `{start, end}`** — it cannot express `AMBIGUOUS`.
Adopting it wholesale would ship a regression against the refusal discipline that is the entire
point. Also: it is **not** in production at Hypothes.is — `hypothesis/client`'s `package.json` lists
`approx-string-match ^2.0.0` and neither `dom-anchor-text-quote` nor `diff-match-patch`.
`[measured, kill audit — every clause reproduced]`

**The live competitor.** `inkeep/OpenKnowledge` shipped content-derived anchoring on 2026-07-30
(3,239★, GPL-3.0): `anchor.ts`, 261 lines, exact-quote plus widened context plus
orphan-rather-than-guess, on npm at `0.46.0-beta.32`. **Its server path returns `{status:'orphaned'}`
on a tie while its app path returns `best[0]` — two different policies in one product — and it
publishes no accuracy number.** `[secondary, tarball-verified]` **What MDMAX can own is not the
algorithm. It is the refusal and the published false-match rate.**

#### 3.2.9 API and CLI surface

```
mdmax resolve <file> --anchor @anchor.json [--explain]
    → RESOLVED  {start,end}  tier=1|2|3  rung=S1|S2|S3  candidates=N
    → AMBIGUOUS  candidates=[{start,end,score}, …]      exit 4
    → LOST                                              exit 3
```
`--explain` **must** print which tier and which stage fired. Refusal-with-a-reason is the product
difference against a competitor that silently returns `best[0]`.

Stored anchor record, versioned (see §3.8.2):

```json
{ "schema": 1,
  "normalize": "mdmax/normalize@1",
  "slug": "mdmax/slug@1",
  "id": "blk_7f3a",
  "quote": "…", "prefix": "…", "suffix": "…" }
```

#### 3.2.10 Failure modes

| failure | behaviour |
|---|---|
| Block is not anchorable (14.2% of blocks) | `NO_IDENTITY` — positionally interpolate between anchorable neighbours; **never anchor** |
| Two candidates within `DELTA` | `AMBIGUOUS` — surface it; **never guess** |
| Homogeneous list corpus (the `knowledge.md` case) | 8× worse false rate; mitigated only by the structural key for list items |
| `normalize/1` changes | **every stored anchor silently re-keys.** See §3.8.2 — this must be settled before the first anchor is persisted |
| Heading slugger unpinned | anchor health swings **77 percentage points** on the choice. See §3.8.2 |

#### 3.2.11 Kill conditions

- **K3** — the re-derived anchor number is materially below 99.627%, **or** the LCS diff baseline
  matches it on the >2-lines-deleted stratum → the anchor is a fallback only; re-scope the claim and
  **never publish the number**.
- **K4** — the *range* resolver's hand-audited false-match rate exceeds ~0.5% → comments cannot use
  it; fall back to quote-plus-digest with **visible** orphaning.
- If the >2-lines-deleted stratum is too small to measure at all, **say so and ship tiers 1–2 only.**

#### 3.2.12 What this does NOT cover

Concurrent edits from two sources were never tested. **Nothing in §3.2 validates a merge path.**
Nothing here addresses multi-human co-editing, which is the product's whole premise — the corpus that
produced these numbers is 416 commits by exactly one author over 80 days.

---

### 3.3 Capability 3 — THE DEGRADATION CERTIFICATE (`mdmax cert`)

#### 3.3.1 What it does

For one document, report per block, per construct, per **(product, surface)** target, what a real
renderer does to it. Not a prediction. A differential run against pinned renderers.

#### 3.3.2 Why it exists

It is the **only** capability in this programme that survived adversarial prior-art search with no
incumbent found for the per-document layer, and the only dataset that **decays** (renderers change,
so a stale certificate is visibly stale). It is therefore the capped give-away and the credibility
instrument. **It is not the spearhead — it targets pains ranked 13th and 14th of 14.**

#### 3.3.3 The measurement — and the premise it kills

A differential harness was built and run across renderer configurations, plus live probes of
GitHub's production renderers. Engines: `cmark-gfm 0.29.0.gfm.13` compiled from GitHub's source at
SHA `499789b`, `kramdown 2.5.2` + `kramdown-parser-gfm 1.1.0`, `goldmark 1.8.5` (Hugo),
`pulldown-cmark 0.13` with `ENABLE_HEADING_ATTRIBUTES` (mdBook), `comrak 0.39`, `markdown-it 15.0.0`
at both `html:false` and `html:true`, `marked 16.4.2`, `commonmark.js 0.31.2` as the spec oracle, and
the app's own remark pipeline.

**Defect you must not propagate: the enumerated bench sums to 23, not 24.** Re-derived:
`1 + 3 + 1 + 4 + 2 + 3 + 3 + 2 + 2 + 2 = 23`. **Every headline ratio in that research divides by 24.**
`[measured, degradation-certificate verifier]` The rates below are quoted as `n/24` because that is
how they were reported and independently reproduced at that denominator; **the denominator itself is
unreconstructible from the stated engine list.** Fix it before publishing a single row.

**The finding that changes the design: "GitHub" is not one target. It is three renderers that
disagree on identical bytes.**

| surface | reachable how | behaviour |
|---|---|---|
| `github-comment` | `POST /markdown` | **contested** — `mode=gfm` emitted no heading anchor, while `mode=markdown` emitted the full `<div class="markdown-heading">…<a id="user-content-…" class="anchor">` structure that rendered comments visibly have. Treat as **declare-and-date**, not as locally runnable |
| `github-blob` | `GET /repos/…/contents/X.md` with `Accept: application/vnd.github.html` — **requires the content to already be pushed** | **deletes HTML comments outright** (nodejs/node README: 5 standalone `<!--` lines in source, **0** in the 91,223-byte rendered blob); renders front matter as an HTML table; prefixes `id="x"` → `id="user-content-x"`; strips `class`, `style`, `data-*` |
| `github-pages` | Jekyll + kramdown | strips front matter **before** kramdown runs; `1) first / 2) second` renders as a **paragraph**, not an `<ol>`, where all 15 other engines produce `<ol>` |

`[measured; the github-blob comment deletion and the `1)` case both reproduced exactly by the
verifier]`

**Carrier verdicts that reproduced exactly under an independently built bench:**

| carrier | verdict |
|---|---|
| YAML front matter | **VISIBLE in 23/24** configurations |
| HTML comment | renders as **visible escaped text in 2/24** (`markdown-it 15` default, `react-markdown 10` default); **deleted outright by GitHub's blob renderer**; 9 distinct outputs across the bench |
| `{#id}` heading attribute | **LEAKS as literal text in 21/24** — only kramdown ×2 and pulldown-cmark with `ENABLE_HEADING_ATTRIBUTES` consume it |
| link reference definition | **invisible in 24/24** |
| `[//]: #` idiom | **invisible in 24/24** — but does **not survive a write** (parens become quotes) |

**Live GitHub, re-verified independently:** `<div id="x" class="c" style="color:red" data-k="v">hi</div>`
→ `<div id="user-content-x">hi</div>`. `[measured]`

#### 3.3.4 Five claims from that research that its own verifier killed — do not repeat them

1. **"`a**€**b` bolds on GitHub only."** Refuted. It bolds on GitHub production **and** on
   `cmark-gfm 0.29.0.gfm.13`. It does **not** bold on `commonmark.js 0.31.2` — the designated spec
   oracle — nor on `markdown-it 15`, `marked 16`, remark/micromark or `react-markdown`. **The real
   finding is that the `github-comment` proxy and the spec oracle disagree on the cited example.**
2. **"`\|` is de-escaped when tables are off"** as a render divergence. Zero divergence in all 17
   local configurations and on GitHub production. It is a source round-trip concern, not a render one.
3. **"kramdown/GFM → github-pages exactly."** Jekyll ships **nine** kramdown options
   (`lib/jekyll/configuration.rb:67–77`), and `kramdown-parser-gfm` defaults `hard_wrap` **ON** where
   Jekyll sets it **OFF**. Measured on `Line one\nLine two`: researcher config →
   `<p>Line one<br />\nLine two</p>`; Jekyll defaults → `<p>Line one\nLine two</p>`. **Every soft line
   break in every document would be a false MUTATE.** The rule is sharper than "record the engine
   version": **a certificate without the target's full option set is a lie.**
4. **"Only frontmatter's own app hides front matter."** Hugo, Docusaurus, Astro, Eleventy, Jekyll and
   GitHub's blob viewer all consume it upstream of the engine.
5. **The entire performance budget** ("87% of wall time", "~43 ms for a typical 4 KB file", "15.5 min
   for a 4,317-file vault"). Internally inconsistent: `31.3/(31.3+5.9) = 84.1%`, not 87%; 43 ms sits
   **below** the report's own 3-spawn floor of 93.9 ms; `4,317 × 43 ms = 3.09 min`, not 15.5.
   **Re-derive the budget from scratch before quoting any of it.**

Also unresolved: the **equivalence fold** is claimed to have moved the divergence rate from
**43.71% to 4.28%** — but with **no corpus, no artifact, and no denominator**. It is the
load-bearing component of the whole design and it is currently a rate without a population.

#### 3.3.5 How it works — three layers, forced by measurement

- **Layer 1 — per-CONSTRUCT capability table**, built offline from synthetic minimal pairs. Required
  because whole-file correlation cannot attribute cause: in a 300-file run every feature co-occurred
  with every other and all showed "100% divergent", which is information-free. `[measured,
  self-caught negative result]`
- **Layer 2 — per-FILE certificate**: inventory which Layer-1 constructs the file contains, at which
  byte offsets, joined to the table.
- **Layer 3 — per-file differential RUN**, because the table does not predict everything (the
  tilde/strikethrough case was found by the differential, not by any construct list anyone wrote).

**The verdict vocabulary — four values, not three.** v2.0.0 §5.4 specified `PASS · STRIP · CORRUPT`.
The founder-thesis area measured a fourth that the three-valued matrix has no cell for:

| verdict | meaning | measured example |
|---|---|---|
| `PASS` | semantically equivalent output after the versioned fold | — |
| `STRIP` (`DEGRADED`) | output differs, payload invisible, **no source character lost** | tail-placed orphan link reference definition: 0 bytes of HTML in 24/24 |
| `CORRUPT` (`BROKEN`) | `LEAK` (payload becomes visible text) · `DESTROY` (a source character is deleted or substituted) · `MUTATE` (same bytes, different structure) | front matter LEAKs in 23/24; `<cat>` deleted; `1)` MUTATEs on kramdown |
| **`VOID`** | **the content was by reference and the reference did not resolve — the payload was never in the file** | `![[Some Note]]` → `<p>![[Some Note]]</p>` under `marked 16.4.2`, reproduced byte-for-byte by the verifier, versus ```` ```mermaid ```` → `<pre><code class="language-mermaid">…` with the payload intact |

**`VOID` is the verdict that decides which capabilities D6 permits.** Additive capabilities (an
unknown fence language) are free; any capability whose payload is *by reference* cannot degrade at
all. **RECOMMENDED: ship four verdicts.**

#### 3.3.6 The equivalence fold — ship it as a named, versioned function

It folds: full HTML entity decode (use `entities.decodeHTML`, not a hand-rolled five-entity replace —
that was the original bug); smart punctuation (`’‘ → '`, `“” → "`, `– → -`, `— → --`, `… → ...`);
void-element spelling (`<hr>` / `<hr />` / `<hr/>`); trailing and inter-block whitespace; and `id`
prefixing (`x` → `user-content-x`). **Everything the fold does is a documented, testable
normalisation; everything it does not do is a real finding.**

#### 3.3.7 CLI surface

```
mdmax cert <file>                        # human table: block × target × verdict
mdmax cert <file> --json                 # the artifact (schema below)
mdmax cert <glob> --fail-on=BROKEN       # CI gate; exit 1 on any BROKEN
mdmax cert --targets=github-blob,hugo    # subset
mdmax cert --bench-info                  # every engine + version + SHA + FULL OPTION SET
mdmax cert --explain <construct>         # the minimal pair and its per-config matrix
mdmax cert --cover <targets>             # minimal engine subset covering those targets
mdmax bench build | bench verify         # compile/pin the vendored engines, verify hashes
```

Artifact (JSON sidecar — **never written back into the `.md`**; per Learned Rule #11 the agent must
not rewrite it):

```json
{ "bench":   { "version": "…", "engines": [ { "name": "…", "version": "…", "sha": "…", "options": {} } ] },
  "file":    { "path": "…", "sha256": "…" },
  "targets": [ "github-blob", "github-pages", "hugo", "…" ],
  "summary": { "pass": 0, "strip": 0, "corrupt": 0, "void": 0 },
  "blocks":  [ { "anchor": "blk_7f3a", "type": "paragraph", "byteRange": [1204, 1251],
                 "verdicts": { "github-blob": { "verdict": "CORRUPT", "class": "DESTROY",
                                               "before": "Array<string>", "after": "Array" } } } ] }
```

**How it fails: loudly and specifically.** Not *"this may not render everywhere"* but *"block
blk_7f3a, bytes 1204–1251: on github-blob the text `Array<string>` renders as `Array` (DESTROY); 6 of
9 targets agree with github."* **A verdict with no before/after pair is not a verdict.** Per Learned
Rule #67, a missing engine must be a **hard refusal**, never a silently smaller matrix reporting
green.

#### 3.3.8 The effort contradiction, named and resolved

Two sources disagree and the disagreement is 10×.

- `docs/mdmax/PLAN.md` v2.0.0 §4.4 and §7 item 5: **"two days, hard cap"** — because cert is a
  distribution budget, not a product.
- The `degradation-certificate` research design: **"~3 weeks for a shippable v1 with 9 locally
  runnable targets"** (bench 1–2 days, fold 2–3 days, construct corpus 2 days, per-file engine 1
  week, cover/caching/WASM 3–4 days, CLI 2–3 days).

**The plan governs.** Ship the research's own **"cheapest useful slice"** inside the two-day cap:
freeze the fold at a naive version, run a **3-engine cover** (the app's remark pipeline +
`react-markdown` + kramdown, all installable in one `npm`/`gem` step) over the existing vault, and
publish the **BROKEN-class frequency histogram**. That histogram alone decides kill condition (4)
below, which is the one most likely to fire. The 3-week bench is a research instrument; build it only
if the histogram says it is needed.

**Build hazard, measured:** `cmark-gfm 0.29.0.gfm.13`'s `CMakeLists.txt` declares
`cmake_minimum_required` below 3.5 and modern CMake refuses with *"Compatibility with CMake < 3.5 has
been removed."* It needs `-DCMAKE_POLICY_VERSION_MINIMUM=3.5`. **The bench-build command and the
CMake version belong in the pinned manifest alongside the engine SHAs** — a pinned offline bench
whose build recipe is version-fragile is self-refuting.

#### 3.3.9 Prior art — narrow the novelty claim

"No prior art" is true only for the **per-document** layer. Uncited but on point:
`karlcow/markdown-testsuite` (102★; `tests/` + `run-tests.py` + a per-implementation stdin driver),
`babelmark/babelmark-proxy` (MIT, self-hostable), cmark's own `spec_tests.py`, and
`ArchieCur/MARKDOWN_FLAVORS` (created 2025-10-21, 7★, exactly 14 flavour rows × 17 construct columns
in `markdown-flavors.csv`). `[measured, kill audit]` **Build Layer 1 on an existing suite's fixtures
rather than on a construct list we write by hand** — that is exactly the failure mode the tilde case
exposed.

Note also that babelmark's registry is **38 entries, 15 with plaintext endpoints, 23 encrypted** —
so babelmark's *hosted dispatch* is not self-hostable, but every entry carries a plaintext `Repo`
link and the *implementations* are. The research's "structurally impossible" was an overstatement.

#### 3.3.10 Kill conditions — four, any one of which ends it

1. **The fold swallows everything.** If semantic BROKEN verdicts on a neutral corpus fall below ~1%
   of blocks and below ~15% of files, the certificate is a curiosity. The honest own-corpus figure
   was **4.28%, not 43.71%** — and 4.28% is not a large number.
2. **The uncertifiable surface is the only one anyone cares about.** `github-blob` cannot be probed
   without pushing content; Obsidian, Notion, Typora, Bear, Slack, Discord and the chat renderers
   cannot be probed at all — **7 of ~12 surfaces**. Kill unless declared-contract-plus-canary is
   accepted as honest.
3. **The market is "pick one renderer."** If the dominant workflow is single-target, the correct
   product is a single-target linter, which `markdownlint` and `remark-lint` already are at zero
   marginal cost.
4. **It is a lint rule, not a certificate.** If the minimal cover collapses to one engine, or if >80%
   of BROKEN verdicts come from fewer than five constructs, the apparatus reduces to a static rule
   set running in 2 ms. **The own-corpus data leans this way:** six constructs (angle brackets, lone
   tilde, front matter, HTML comment, pipe-in-prose, `{#id}`) account for most of what was found.
5. **Product gate K5** — fewer than 5 of 30 probed users say they would install it → cut it.

#### 3.3.11 What this does NOT cover

Obsidian, Notion, Typora, Bear, Slack and Discord are **declare-and-date** rows, refreshed on a
schedule against a canary, stamped with a last-verified date. Slack and Discord are not CommonMark
and must be modelled as **lossy sinks**, not renderers. Do not attempt UI automation to certify them.

---

### 3.4 Capability 4 — THE NEAR-MISS REFERENCE CHECKER

#### 3.4.1 What it does

Classify every unresolved reference in a corpus into three buckets and report **only one of them**.

#### 3.4.2 Why it exists — the two-tier link problem

Markdown carries two reference syntaxes that behave nothing alike, and **no tool implements the
semantics that difference demands**:

| syntax | resolves | source |
|---|---|---|
| `[text](path.md)` | **85.71%** (546 / 637) | v2.0.0 §3.2 `[measured]` |
| `[[Name]]` | **27.65%** (2,754 / 9,962) | v2.0.0 §3.2 `[measured]` |
| | **a 58-point gap on identical files** | |

**A path link that does not resolve is a mistake. A wikilink that does not resolve is a legitimate
Obsidian authoring primitive.** Treating them identically is why naive link checking runs at
**2–25% precision** and gets switched off `[measured, engine PLAN §4]`.

**CONTRADICTION, named.** Three research passes produced three number sets for the same claim:

| source | wikilinks | resolve | path links | resolve |
|---|---|---|---|---|
| v2.0.0 §3.2 | 9,962 | 27.65% | 637 | 85.71% |
| `markdown-base` headline | 9,077 | 25.50% | 624 | 88.62% |
| `markdown-base` **verifier** | **13,026** in the pinned corpus | 29.53% on the frontmatter-stripped basis, **24.93%** including front matter | 624 (reproduced to the digit) | 88.62% (reproduced) |

The verifier found the headline census **silently stripped YAML front matter**, removing **3,850
links (29.6% of all wikilinks)** carried by `entities:` (2,283), `related:` (1,407) and `up:` (49)
keys. Those front-matter wikilinks resolve at **13.95%** — *worse* than body links — so including
them lowers the headline and, if anything, strengthens the SOFT classification. **Which governs: the
verifier.** Quote 13,026 as the wikilink population, state that the resolution rate depends on
whether front-matter links are counted, and quote the **gap** rather than either percentage: the
verifier's own summary is that the structural finding *"survives at a 58-point gap rather than 63."*

**Narrow the novelty claim.** "No existing tool does this" is contestable by the research's own
primary source: `facebook/docusaurus` `configValidation.ts` already ships tiered defaults across four
link classes with two severities — `onBrokenLinks: 'throw'`, `onBrokenAnchors: 'warn'`, and at lines
124–125 `onBrokenMarkdownLinks: 'warn'` against `onBrokenMarkdownImages: 'throw'` — at **1,513,550
weekly downloads**. `[primary]` The defensible claim is narrower: **the wikilink-versus-path-link
split specifically**.

#### 3.4.3 The measurement that justifies shipping it

Across two corpora, with hand verification:

| class | rule | count | reported by default |
|---|---|---|---|
| **BREAK** | a file exists with ≥ 0.85 normalised name similarity | **95, hand-verified real broken links** | **yes** |
| **DRIFT** | case- or punctuation-only mismatch | 52 | yes |
| **GHOST** | no similar name anywhere | 5,777 | **no — silent**, available behind `--ghosts` as an authoring backlog ranked by inbound demand |

`[measured, impact-preview area]`

**The default output must be near-empty.** A vault-level compiler run over 833 authored files found
365 true problems touching only **112 files (13.4%)** — a random note has an **86.6%** chance of an
empty panel, and one file held 56% of everything `[measured, engine PLAN §4]`. **A checker that
reports 3,442 problems is uninstalled the same day.**

**Two figures in that area were killed by its own verifier and must not be repeated:**
"3,491 dangling md-vault refs against 3,129 total md-vault refs" (more dangling than total, in both
corpora), and "97% are intentional placeholders" — **intent was never measured**; what was measured is
the *absence of a near-name match*.

#### 3.4.4 How it works — the symbol table

Five relations, all cheap:

```
defs      (file, kind ∈ {heading, block, fm-key, tag}, name, level, byte-range)
refs      (file, byte-offset, kind, raw-target, resolved-target | NULL)
by-name   basename → [file]                 # resolves ghosts and near-misses
reverse   resolved-target → [(file, offset)]  # the impact query
ghosts    unresolved-name → [(file, offset)]  # the novel relation; nobody stores this
```

Measured: **69,805 rows for 78 MB**; the whole index serialises to **607 KB for a 78 MB vault
(0.74%)**. Incremental maintenance re-parses **only the changed file** — 0.254 ms median, 1.567 ms
p90 in Python — and patches the four indexes by key: `O(symbols in that file)`, never `O(vault)`.
Cold build is the expensive path: the research said 10.7–26.1 s for a 20,000-file vault; **its
verifier corrected that to ~10.6–15.7 s** because the original applied small-file throughput to a
large-file corpus. Either way it must be **lazy, persisted, and off the keystroke path.**

**Resolution rules, decided:**

- **Symbol = a file. Canonical key = the root-relative path.** Basename is a convenience alias with a
  measured **25-instance (1.1% of resolving wikilinks)** ambiguity set; **on ambiguity report
  `AMBIGUOUS` and refuse — never guess.**
- **HARD `[text](path.md)`** — checked. Broken is an error surfaced in the editor.
- **SOFT `[[Name]]`** — resolve-if-present, **never an error, no diagnostic, no squiggle.** A soft
  reference that later acquires a target simply starts resolving.
- **A third population exists and the two-tier design has no cell for it:** front-matter wikilinks
  (3,850 of them). `related:` and `up:` are hand-authored file references; `entities:` is `graphify`
  output naming *concepts*, not files. **OPEN: classify front-matter wikilinks as a third tier or
  fold them into SOFT. Do not leave it undocumented.**
- **Headings are NOT exported symbols.** **71.3% of heading instances have a globally non-unique
  slug**; **8.8–8.9% of files contain a within-file duplicate**; and `github-slugger`'s
  disambiguation is **positional** — `while (occurrences[result]) result = original + '-' + ++occurrences[original]`
  `[primary, source read]` — so an exported heading id changes when an unrelated heading is edited.
  Headings are within-unit coordinates resolved by the unit's own local table under the pinned
  `slug/1` (§3.8.2).
- **`{#id}` is refused.** It is not CommonMark (D6) and it **LEAKS as visible text in 21/24** bench
  configurations (§3.3.3). This means the "author-given heading id" escape hatch proposed by the
  `markdown-base` area **has no legal carrier** and must be dropped or re-carried.

#### 3.4.5 CLI surface

```
mdmax check [PATH…]              # BREAK + DRIFT only. Default output is near-empty.
            --ghosts             # the authoring backlog, ranked by inbound demand
            --json
mdmax refs <file> --scope ./docs # reverse dependency query. An UNSCOPED query is not well-formed.
mdmax rename <old> <new>         # DRY-RUN BY DEFAULT. Terraform-shaped header line first
                                 # ("Plan: 6 references to update in 4 files, 1 conflict"),
                                 # then per-site rows, every row individually EXCLUDABLE,
                                 # conflicts to a separate confirm step. File-level only in v1.
```

Writing stays splice-only: `mdmax rename` computes byte-range edits against the `refs` index and
splices them; a file with an unresolved anchor is **passed through untouched**, never regenerated.

#### 3.4.6 Failure modes

| failure | behaviour |
|---|---|
| Similarity threshold too low | BREAK fills with ghosts; the tool is uninstalled. **Precision, not recall, is the product.** |
| Ambiguous basename | `AMBIGUOUS`, refuse |
| Cross-root reference (244 exist, 2.69% of unresolved wikilinks) | require an **explicit alias declaration**; never implicit cross-root search |
| Cold index on a 20,000-file vault | the editor must be **fully usable while the index is still building** |

#### 3.4.7 Kill conditions

- **BREAK-class precision cannot be pushed above 0.90** anywhere on the 0.70–0.95 similarity sweep,
  **or** fix-acceptance is under 50% → cut it. At 97% ambient ghost noise there is no room for a
  mediocre classifier: a 70%-precise checker is worse than none, because users disable it and lose
  the 3% that was real.
- The symbol table cannot be maintained under **5 ms p99 per keystroke** on a 20,000-file vault →
  move it off the keystroke path to an explicit command.

#### 3.4.8 Contradiction in the record, named

The final-gate `against` area's design says: *"DROP ENTIRELY — … the near-miss reference checker."*
The `impact-preview` area calls it *"the genuinely shippable feature hiding in the same symbol
table."* v2.0.0 §5.3 keeps it. **The `against` headline was graded OVERSTATED; §5.3 governs. Keep the
checker, at RECOMMENDED status, gated on the precision number.**

#### 3.4.9 What this does NOT cover

**Impact preview on heading and block anchors is out of scope for v1.** The census that motivated it
enumerated only Obsidian wikilink syntax and **never counted `[text](#heading)` or
`[text](file.md#heading)`**, so its 130:1 and 1014:1 ratios are unusable; its "zero heading-rename
breakages" null came from a test with **~11–13% statistical power** (`P(observe zero | effect fully
real) = 87–92%`). **Both the ratio and the null are uninformative.** The correct v1 scope is
file-level rename plus the near-miss checker; heading and block relations wait for a census that
counts every reference syntax.

---

### 3.5 Capability 5 — BUDGETED PROJECTION (index / outline / full)

#### 3.5.1 What it does

Emit one of three projections of a document tree at a stated byte or token budget, and say what was
omitted.

```
--index     one line per document: path, title, one-line summary          (default)
--outline   headings only, nested, plus per-document frontmatter keys
--inline    the full text, joined with the FENCE-STATE-AWARE SEPARATOR
--budget N  inline greedily to N bytes, degrade the remainder to index lines
```

**Projections are never stored.** Storing one is how a format rots `[engine PLAN §2.4]`.

#### 3.5.2 The ratios — four numbers for one claim, and none of them means what it looks like

| ratio | numerator vs denominator | source |
|---|---|---|
| **242×** | container 25,548,765 B vs one-line-per-doc index 105,538 B | v2.0.0 §3.1 `[measured, corpus id]` |
| **110.1×** | container 25,776,700 B vs described index 234,119 B | `container-thesis` `[measured, corpus id]` |
| **168.8×** | Anthropic docs: inlined 6,556,407 B vs index 38,847 B / 174 links | HANDOFF-mdmax §7.3 `[measured]` |
| **101.1×** | llms.txt-style index over a 21.9 M-token corpus | `token-cost-tier` headline — **its own verifier: "the headline's 101.1× anchor has no source anywhere in the repo or the scratch"** |

**They differ because "index" means four different artifacts.** Quote one, define it in the same
sentence, and cite its script. **Do not quote a range "25–168×"** — v2.0.0 §3.3 already struck that
phrasing.

#### 3.5.3 The caveat that must appear beside every one of those ratios

**They are ARTIFACT-SIZE ratios. They are not task-token savings.** The only live-model measurement
of task tokens that exists went the **wrong way**:

> *"**The bundle arm cost more, not less.** 5.2% more tokens over six questions, and it opened more
> files, not fewer."*
> — `https://raw.githubusercontent.com/scaccogatto/okf-skills/main/benchmark/results.md`, verbatim
> `[primary]`

Totals: **257,602 tokens with `.okf/` vs 244,805 without.** Correctness **22/26 (85%) vs 20/26
(77%)** — two wins, one loss, three ties. **Their own caveat, verbatim:** *"Eight points on
twenty-six, at n=1 per cell, is not a result anyone should quote as a headline."*

**Say "compression" or say nothing.** `[v2.0.0 §3.3]`

#### 3.5.4 How big the prize actually is

Measured over the 1,200 most recent agent transcripts on this machine:

```
all markdown Read calls carrying an explicit offset/limit          82.5%
  restricted to the FIRST touch of each (session, file) pair:
    windowed                                        214/362 = 59.1%
    WHOLE FILE                                      148/362 = 40.9%
byte-weighted, of 134 whole first-touch reads still on disk (2,063,984 B):
    median file                                            5,260 B
    reads of files > 20 KB     12 = 9.0% of whole reads, 3.5% of all 343 first-touch opens
    …carrying                                              63.9% of whole-read bytes
```
`[measured, agentic-docs area — the researcher's own pre-registered falsifier PARTIALLY FIRED and
they reported it against themselves]`

**Honest verdict: the projection tier is not dead. It is small and concentrated — a win on roughly
1 markdown open in 29.**

#### 3.5.5 The one component that is unambiguously worth building

**The fence-state-aware separator.** Joining documents with a naive `\n\n` is **not**
structure-preserving; a separator that tracks fence state is **exactly** structure-preserving
(structural delta **0**, identical structure TRUE, four contaminated adjacent pairs, cause histogram
`{odd_fence_count_in_A: 4}`, and the same four named files — **a four-way exact match under
independent reproduction**).

**The loss figure attached to it does not reproduce and must not be quoted.** The headline said
"809 of 291,278 block tokens (0.28%)". The verifier could not reproduce either numerator or
denominator under any token definition: top-level blocks excluding `space` give **250 lost of
107,212 (0.23%)**, and a raw top-level count *including* `space` shows the naive join **gaining 609
tokens**. **Quote the delta-0 result, which is exact; do not quote the loss figure.**

This separator carries the breakpoint marker the container needs (§3.7), so the split is exact and
mechanical rather than heuristic. **It is the same component in both capabilities.** Build it once.

#### 3.5.6 CLI surface

```
mdmax project <dir> [--index | --outline | --inline] [--budget <bytes|tokens>] [--json]
    → the projection on stdout
    → a trailing OMISSION BREADCRUMB naming every document degraded to a link and why
mdmax project <dir> --explain     # per-document: bytes, tier chosen, reason
```

#### 3.5.7 Failure modes

| failure | behaviour |
|---|---|
| Budget below the index size | refuse; print the index size and the budget |
| A member ends inside an unclosed fence (4 files, 0.369% of the corpus) | the fence-state-aware separator handles it; a naive join does not |
| Anyone stores a projection | **forbidden**; §2.4 |
| Anyone quotes a size ratio as a token saving | **forbidden**; §3.5.3 |

#### 3.5.8 Kill conditions

- Index + selective read does **not** beat naive truncation at 8K and 32K budgets → ship good
  filenames and let the consumer grep. This is Anthropic's own stated design: `CLAUDE.md` is *"naively
  dropped into context"* and everything else is glob and grep, *"effectively bypassing the issues of
  stale indexing."* `[primary]`
- The gap is already **< 3 pp at 128K** → the whole selection apparatus buys nothing for any corpus
  under ~1M tokens; ship a packer with a byte counter, not a compiler with a priority function.
- **Ranked selection ties random selection at the same budget** → the ranking is decoration; ship
  budget enforcement, near-duplicate collapse and honest omission breadcrumbs, and nothing else.

#### 3.5.9 What this does NOT cover

**No priority function is specified here, and none should be built until it beats random.** The
graph-based half of any ranking is dead on arrival for this corpus: median out-degree **zero**, 597
files (55.1%) with zero outbound resolved edges, 502 files (46.3%) fully isolated `[measured, v2.0.0
§3.2]`. Also out of scope: any claim about model distraction from near-miss content. The "up to 65%"
GSM-NoOp collapse was re-tested at n=117 with an audited drop of 0–2 pp — **but that null cannot
exclude a true 6–12 pp effect (MDE at 80% power is 5.8–14.2 pp)**, and the audit deleted the
independent variable. **Neither direction is established. Do not build on either.**

---

### 3.6 Capability 6 — PROVENANCE

#### 3.6.1 What it does

Record where a document's content came from, when it was generated, when it was last verified, and
when it goes stale — **using someone else's vocabulary**.

#### 3.6.2 The decision

> **DECIDED: emit Open Knowledge Format (OKF) v0.2 §5 fields — `sources`, `generated`, `verified`,
> `status`, `stale_after` — and read them back. Do not invent a provenance vocabulary.**

`[v2.0.0 §3.3 and §10.5; final-gate `moat` and `agentic-docs` areas]`

#### 3.6.3 Why — the slot is occupied by a well-resourced incumbent

**Open Knowledge Format v0.2**, `GoogleCloudPlatform/knowledge-catalog`, file `okf/SPEC.md`:

```
size        37,544 bytes           (verified by direct fetch, HTTP 200)
licence     Apache-2.0
stars       8,134
created     2026-05-04T16:36:24Z
pushed      2026-07-29T07:04:35Z
```
`[primary — fetched and read in full by at least three independent agents]`

Its §1, verbatim: *"OKF v0.2 makes provenance, trust, lifecycle, and attestation first-class while
keeping the format minimally opinionated."*

| section | field | content |
|---|---|---|
| §5.1 | `sources` | `resource`, `id`, `title`, `author`, `usage_count`, `last_modified`, `usage_window` |
| §5.2 | `generated` / `verified` | `generated: {by, at}` · `verified: [{by, at}]` |
| §5.3 | trust tiers | `unverified` / `machine-confirmed` / `human-reviewed` |
| §5.4 | `status` | lifecycle |
| §5.5 | `stale_after` | an **absolute date**, not a TTL |
| §10 | attested computations | — |

**Its §5.1 rationale is our own anchoring rationale, verbatim:** *"Labels are keyed rather than
positional (`sources[0]`) because agents constantly rewrite these documents: a positional index
misattributes silently the moment the list is reordered, whereas a stable `id` survives reordering."*
Its per-claim carrier is an **ordinary markdown footnote whose label is a `sources[].id`** —
`The `events_` table is sharded daily as `events_YYYYMMDD`.[^ga4-schema]`. `[primary]`

**Ecosystem, and the clone-latency lesson.** GitHub repo search for the exact phrase
`"Open Knowledge Format"`: **total_count 287**. Third-party toolkit `scaccogatto/okf-skills` was
created **2026-06-14T11:15:31Z — one day after Google's 2026-06-13 announcement** — and now has 206
stars and 22 forks; `serradura/okf-gem` 115 stars, created 2026-07-11. Creation windows: 69 / 66 / 89
/ 59. **The empirical clone latency for a big-company markdown convention is under 24 hours.**
`[measured, kill audit — "CONFIRMED and strengthened", every figure reproduces]`

**And the thing nobody wrote down:** the same eight days produced competitors for the **product**, not
just the convention — `activetwist/OnyxWriter` (*"Local-first editor for Open Knowledge Format
bundles"*) and `pothos-dev/sunstone` (*"a lightweight markdown editor with first-class Open Knowledge
Format"* support). `[primary, kill audit]`

#### 3.6.4 The limit of OKF, which must be decided rather than absorbed

**OKF has zero confidence fields and zero method fields.** A case-insensitive grep over the canonical
37,544-byte `SPEC.md` returns: `span` **0**, `"character offset"` **0**, `"byte range"` **0**,
`per-paragraph` **0**, `"inline annotation"` **0**, `confidence` **0**. `[measured, kill audit —
PERFECT REPRODUCTION]` §5.1 explicitly *declines* to store a credibility score, calling it
*"subjective, unportable across consumers, and goes stale."*

Its glossary, verbatim: *"Credibility signal: An objective, per-source fact (`author`,
`usage_count`, `last_modified`) used to infer trust; OKF records the signals, not a verdict."*

**Its unit is a bundle, not a document** (§3: *"A bundle is a directory tree of markdown…"*), **its
identity is the file path**, and it has **no block identity, no range anchoring, and no splice
guarantee.** Its conformance bar is two predicates — parseable front matter, non-empty `type` — and
**our corpus is already ~59–73.6% conformant with nobody having read the spec.**

> **OPEN DECISION.** Emitting OKF verbatim **silently descopes per-span provenance** — the "which
> source, which page, which method, at what confidence" dimension. Choose explicitly:
> **(a)** emit OKF for document-level provenance **and** keep a separate per-span
> `{method, confidence}` sidecar record, or **(b)** state plainly that per-span provenance is cut to
> what OKF covers. **Do not do it by accident.**

If (a) is chosen, the per-span record obeys three rules derived from measurement:

- **`method` is mandatory whenever `confidence` is present** — lifted verbatim from ITS 2.0's
  `annotatorsRef` requirement: a score with no annotator is refused.
- **Split VERIFIABLE from ASSERTED.** The block anchor and the quoted span are verifiable by
  recomputation. `method`, `confidence`, `agent`, `timestamp` are **attestations**: emitted only by
  the producing tool, **immutable downstream** — a hand-edited confidence is a lie the format cannot
  detect, so the CLI must refuse to write one.
- **Never emit what you did not observe.** No default values. An absent field means UNKNOWN, never
  zero, never true. Learned Rule #59: `bool(None)` is False and is indistinguishable from a real
  negative. Report `unattributed` counts as a first-class number.

#### 3.6.5 Why C2PA §A.9 front matter is unusable

C2PA 2.4 §A.9 is the one place a standard privileges markdown, and it **cannot be used as
specified**:

1. Its `-----BEGIN C2PA MANIFEST-----` armour **is not valid YAML** — two parsers throw on it.
2. It **collides with the `---` fence**, so `gray-matter` (**7.49M weekly downloads**) silently drops
   **all** front matter and **leaks the manifest URL into the rendered body**.
3. It **renders as a visible `<h2>` with a clickable link** in GFM.
4. It permits **at most one manifest per file**, bound to a **whole-file byte hash** — which a
   splice-only editor invalidates on every keystroke.
5. **Zero implementations exist.**

`[measured + primary, provenance-boundary area]` C2PA has had a public specification repo since
2021-11-12 and `c2pa-rs` was pushed 2026-08-01, so this is not a dead standard — it is a live
standard whose markdown binding is unusable. **Signing, if it ever ships, is a whole-file external
C2PA manifest emitted beside the document (`mdmax prov c2pa --emit FILE.c2pa`), never the front-matter
armour.**

#### 3.6.6 The anti-decay mechanism — why this channel would stay honest here

The governing law is that a channel nobody can compare against reality decays to whatever is cheapest
to emit. Measured: **547 of 547 self-declared `updated:` dates in a real, automation-heavy repo are
stale, 32.9% by more than a week.** `[measured]`

The answer is **not** a stricter schema. It is that **MDMAX's product is the editor**: a gutter chip
on every block carrying a record — `text-layer`, `ocr 0.62`, `model 0.71`, `you` — clickable to the
source. PDF tagging, ARIA and llms.txt all rot because the author never sees the second rendering.
**No other provenance standard has the editor.** `[inference — this is a design argument, not a
measurement]`

#### 3.6.7 CLI surface

```
mdmax prov check [PATH…]   # verify anchors, quotes, source hashes, confidence-without-method
                --strict   # exit 1 on any REFUSED or unattributed-with-confidence
                --json
mdmax prov cover [PATH…]   # coverage: blocks with/without records, by method
mdmax prov strip [PATH…]   # remove all records — the escape hatch, always available
mdmax prov c2pa  --emit FILE.c2pa   # whole-file, external reference form only
```

**`mdmax prov strip` existing and being one command is load-bearing: a format you cannot leave is a
format nobody adopts.**

#### 3.6.8 Carrier

- **Document level:** OKF's own carrier — YAML front matter. It is **visible in 23/24** bench
  configurations (§3.3.3), and that is **acceptable here** because OKF is a declared, human-meaningful
  vocabulary, not a machine payload. Say so; do not pretend it is invisible.
- **Per-span (only if the OPEN decision above resolves to (a)):** the **tail-placed orphan link
  reference definition** — invisible in 24/24, byte-identical through `remark-stringify 11.0.0` and
  `prettier 3.8.3`, and 0 bytes of HTML in `remark-rehype` raw **and** safe, `marked 16.4.2`, and
  GitHub in both `gfm` and `markdown` modes. **Not** the HTML comment: GitHub's blob renderer deletes
  it (§3.3.3). **Risk register entry:** as of 2026-07-30 `markdown-it` (27M downloads/week) gives the
  link reference definition a first-class token with a `map: [startLine, endLine]` source range behind
  `core.ruler.disable('strip_references')` — so its invisibility is now a **default**, not a property
  of the format. **Pin `markdown-it@^15` and add a regression test asserting identical rendered output
  with the rule enabled and disabled.**

#### 3.6.9 Kill condition

If the product needs per-span `{method, confidence}` and neither option (a) nor (b) is chosen and
written down within the first month, **cut provenance entirely** rather than shipping a vocabulary
that silently answers a different question than the one it was built for.

#### 3.6.10 What this does NOT cover

No signing in v0.1. No runtime — records are data; nothing is evaluated. No new node types — every
record is an existing `html` or `definition` node, and extensibility lives **entirely in the value**
(D8). And do not repeat the figure "127 open OKF spec issues": the audit found
`is:issue is:open` = 93 and `is:issue` all-time = 97, so **127 exceeds the all-time issue ceiling and
cannot be an issue count under any filter.**

---

### 3.7 Capability 7 — THE CONTAINER (`mdmax pack` / `mdmax unpack`)

#### 3.7.1 What it does

Serialise many `.md` files into **one** `.md` file with machine-recoverable breakpoints, and split it
back apart byte-identically.

#### 3.7.2 Status: SEQUENCED, not cut

> **RECOMMENDED, and sequenced AFTER capabilities 1 and 2. Not in the MVP.** It ships as a **bounded,
> read-only, machine-facing transport** — never a durable committed artifact, never the write
> surface, and never a "pack my whole vault" button.

The founder's image, verbatim from the session transcript (`role=user`, re-extracted independently
from the 58,919,587-byte session `jsonl`, verdict **CONFIRMED**):

> *"…whether the user should download one zip file of all the Markdowns or one single mother
> Markdown, which will be very long. Whenever frontmatter or the AI reads that, I will know these are
> the breakpoints, which means different files, and it can split that Markdown automatically while
> parsing into different files."*

**The verbs are transport verbs — download, split, read, parse — not retrieval verbs.** That is what
makes this a container question rather than an index question.

#### 3.7.3 The measured design

**Round trip, whole pinned corpus:**

```
n = 1,084   raw 25,548,765 B   container 25,776,700 B   overhead +0.892%
byte-identical 1084/1084        pack 96 ms              unpack 169 ms
overhead decomposes as: manifest 169,706 B (62.9% of overhead) + framing 92.5 B/file
```
`[measured, corpus_id sha256:3a010b16… — replicates the earlier 6-file +0.99% result at 180× the
file count]`

**Single file, not zip — on evidence, not taste:**

| property | folder | container (single `.md`) | zip |
|---|---|---|---|
| git storage of ONE one-line edit (272-file corpus) | 66 B | **263 B** | **31,590 B — 120×** |
| `git diff` | text | **text, reviewable** | *"Binary files differ"* |
| gzipped | — | **7,874,098 B (30.8%)** | 9,310,058 B (36.4%) — 15.4% worse |
| index position | — | **head, byte 127,394 of 25,776,700 = 0.49%** | tail, 9,200,529 of 9,310,058 = 98.8% |
| 500 MB build (21,680 files / 510,975,300 B) | — | **1.91 s (270 MB/s)** | 9.7 s |
| partial extract of one file | — | 38.48 ms | **2.94 ms** |

`[measured, corpus_id sha256:3a010b16…]` Zip wins exactly one thing — random access — which neither
lane needs. **Ship a zip too, but as a different product: the D4 escape-hatch export, one-shot, never
versioned, plain files, no manifest.** That is what a departing human actually wants.

**Carrier — the authoritative path goes in the FENCE INFO STRING, never in heading prose.**

Measured: a `## File: <path>` heading survives as a *breakpoint*, but **13 of 60 path strings were
corrupted by one pass through a standard markdown writer** — e.g.
`md/Skills/Printing Press/Pp Docker Hub/workflow.md` → `…workflow\.md`.

> **CORRECTION TO THE BRIEF, and it matters.** The claim that this corruption is **non-local** —
> that the identical heading is byte-stable in isolation and unstable inside the bundle — was
> **REFUTED** by the verifier. The cause is purely local: `mdast-util-gfm-autolink-literal/lib/index.js`
> lines 61–63, read verbatim, give `character: '.'`, `before: '[Ww]'`, `after: '[\-.\w]'` — a
> **one-character lookbehind** guarding against `www.` autolink formation. So `workflow.md` escapes
> (a `w` precedes the dot) and `skill.md` in the same directory does not; `x/wow.md`, `x/sow.md` and
> `x/Now.md` all escape. The original control reproduced "OK" **only with the GFM extension
> disabled** — two different library configurations were compared and the difference attributed to
> context. **The Wagner & Graham (TOPLAS 1998) context-dependence citation is unsupported by this
> evidence.** The design conclusion — the path belongs in the fence info string — **survives on plain
> fidelity grounds (13/60)** and on the verifier's own check that the info string preserved all four
> test paths intact.

**Delimiter — a computed backtick run.**

| measurement | value |
|---|---|
| fence lines in the corpus, **all exactly three backticks** | **15,435** |
| tilde fences | **0** |
| **line-initial** backtick runs ≥ 4 | **0** |
| **any-position** backtick runs = 4 | **4** (all inline, `docs/engine/PLAN.md` lines 652 and 1042) |

`[measured, corpus_id sha256:3a010b16… — the container-thesis and founder-thesis areas measured two
different things and the founder-thesis verifier flagged the collision]`

> **State the rule precisely: `N = max(4, max LINE-INITIAL backtick run over every contained byte + 1)`.**
> For this corpus that is **4, and it is provable**. The looser wording "max backtick run + 1"
> computes **5** on the same corpus and contradicts its own conclusion. Prior art:
> repomix `src/core/output/outputGenerate.ts:60`, verbatim —
> `const maxBackticks = contents.flatMap(c => c?.match(/`+/g) ?? []).reduce(...); return "`".repeat(Math.max(3, maxBackticks + 1));`
> — which uses max run **anywhere**. **Adopt it, credit it, and document the difference.**

**Per-entry metadata, all mandatory, each justified by a measured failure:**

| field | why | measurement |
|---|---|---|
| `path` (**JSON-quoted**) | a whitespace-delimited info string breaks on the majority of the corpus | **598 of 1,084 paths (55.2%) contain a space**; 18 path characters are em-dashes; `maxpathlen` 134 |
| `sha256` | the only per-file authority | 1084/1084 byte-identical proven per file |
| `bytes` | the fast path and the tamper detector | — |
| `nl: 0\|1` | naive concatenation silently welds file N's last line to file N+1's first | **288 of 1,084 files (26.57%) have no trailing newline** |
| — | zero-byte members need their own sentinel | 4 files are 0 bytes; 1 uses CRLF |

Use git's own `\ No newline at end of file` sentinel. With the sentinels in place the round trip is
**1084/1084 byte-identical**.

**Manifest: YAML front matter, ONE LINE PER FILE.** Not cosmetic — **a 47× reduction in diff size**:
a compact single-line JSON manifest makes every content edit rewrite the whole 169 KB manifest line
(**86,252 diff bytes**); one line per file makes the manifest hunk name the changed file (**1,833
diff bytes, 2 hunks**). `[measured]`

**Pack-time refusals, each a named error with a fix:**

- **Unterminated fence in a member.** **7 files (0.65%) contain an odd number of ``` delimiters** —
  each is a poison pill that swallows every following breakpoint. Separately, **4 files (0.369%) end
  inside an unclosed fence** — e.g. `md/Brain/20-projects/proj-advox-frontend.md`, whose line 32 is
  literally truncated mid-word (`# Rea`). These are two different tests; report both. **Refuse, do
  not guess.**
- A path that is not representable: absolute, drive-lettered, `..`-bearing, non-canonical, containing
  a control character, or a **case-folded duplicate** (APFS is case-insensitive by default; the
  corpus is clean today — 1,084 distinct NFC, 1,084 distinct case-folded NFC, 0 collisions, 0
  NFD-vs-NFC differing paths — **so the check must exist before it is needed**).
- **`E-RUN-UNDERDECLARED`**: a contained body holds a run ≥ the declared fence. This is the hole the
  research's own verifier had — its "fence run lie" fixture returned OK because the reader
  **hardcoded** the run instead of deriving it from the header **and** cross-checking it against the
  contained bytes. **A header field that is trusted is a capability handed to whoever wrote the
  header.**

**Injection is closed by construction, not by escaping.** An attack file containing a literal
`` ````text fm:file 99 "../../../.ssh/authorized_keys" `` forces the packer to escalate to a
5-backtick fence. A reader **pinned to the declared run** recovers exactly 3 files, the evil file
byte-identical, **0 forged paths**. A naive `` `{3,} `` line scanner accepts the forged path. **The
spec must mandate the pinned run and forbid any-fence scanning.** `[measured]`

**A "How to read this file" preamble is mandatory.** It is what lets a model with no MDMAX installed
unpack correctly, and it is the degradation story. Precedent, verbatim from repomix's
`markdownStyle.ts`: `## File Format` … *"5. Multiple file entries, each consisting of:"* / *"a. A
header with the file path (## File: path/to/file)"* / *"b. The full contents of the file in a code
block"*, plus `# Directory Structure`. `[primary]`

**Collision check:** **0 files in the corpus contain a literal `## File: x` line** — the repomix
breakpoint convention is collision-free here. **Exactly 1 file contains the literal token
`fm:file`/`fm:endfile` — our own `docs/engine/PLAN.md`.** The computed fence run makes both inert.

**Nesting is free.** The fence run is itself a nesting counter: packing a container inside a container
auto-escalates 4 → 5 → 6 and recovers byte-identically at three levels. **Delete `docs/engine/PLAN.md`
§5's "a container inside a container is refused in v1"** — the tar/shar/MIME "flatten, never nest" law
is about the **path tree**, not about container-in-container, and it was over-applied.

#### 3.7.4 The D6 argument, and it is the reason this is not a dialect

> **A bundle invents a CONVENTION — what a sequence of ordinary constructs means — not a DIALECT —
> new syntax a parser must understand in order to read the document.**
> `tar` did not invent a filesystem. MIME multipart did not invent email.

Nothing in the container requires a new parser. A bundle opened by any markdown tool is a document of
headings and code blocks; pasted into a chat box it is the whole corpus; opened in `frontmatter` it
is a project.

**The honest cost of that, measured:** under the fence carrier the container **stops rendering**.
**285 of 288 rendered characters land inside `<pre><code>`, with 0 headings, 0 links, 0 tables, 0
bold, 0 list items**, versus a fully rendered document under the HTML-comment carrier. `[measured,
marked 16.4.2]` Mitigation, verified: a visible `#### \`docs/a.md\`` line above each fence renders as
`<h4><code>docs/a.md</code></h4>` — an anchored, navigable, human-visible label whose **authority is
still the manifest**. **Delimiter ≠ label.** If a model mangles the label nothing is lost.

#### 3.7.5 The counter-evidence, stated in full

This is the capability with the strongest case against it in the entire programme. All of it must be
in the plan.

1. **The founder's own corpus does not show him doing this by hand.** The claim that 403 of 1,084
   files (37.2%) / 12,193,061 of 25,548,765 bytes (47.7%) are hand-built multi-document bundles was
   **REFUTED**: **372 of the 403 (92.3%) are files with exactly two H1s whose first H1 is a
   machine-generated YAML `title:` field**, and **365 of 403 live in one machine-synced subtree,
   `md/Skills/**`** (`source: claude`, `last_synced: 2026-05-26`). **Honest figure: ~2.2% of files
   and ~2.0% of bytes.** The area's own pre-registered falsifier fired and was recorded as *"FAILED
   TO REFUTE, in the founder's favour."*
2. **The market voted for pack and against unpack** — repomix **27,551 stars** (created 2024-07-13,
   pushed 2026-08-01) with **no unpack subcommand**, against a sole zero-star unpacker.
   **BUT that "27,551 to 0" was itself REFUTED:** Aider (**47,848 stars**) already ships the return
   trip. `aider/coders/wholefile_prompts.py` specifies the format verbatim — *"First line: the
   filename with any originally provided path… Second line: opening {fence[0]}… entire content of the
   file… Final line: closing {fence[1]}"* — and `wholefile_coder.py::get_edits()` parses it back and
   writes each file to disk, already stripping `*`, `:`, backticks and leading `#` from the locator
   with a `len(fname) > 250` guard. `base_coder.py::choose_fence()` already computes a
   collision-proof delimiter. `gpt-engineer` (55,173★) and `smol-ai/developer` (12,182★) are the same
   category. **The unpack half is a re-implementation, not greenfield, and the delimiter rule is
   pre-empted.**
3. **The one library that ships both halves gets no users.** `llm-code-format` v3.1.0 (published
   2025-09-20, zero dependencies, TypeScript, *"From source code to Markdown to LLMs and back
   again"*, `parseMarkdownFiles` / `formatMarkdownFiles`, a streaming parser, nine recognised LLM
   output conventions): **387 downloads/month against repomix's 327,543. 846:1.** `[primary]`
4. **The incumbent is strengthening, not weakening.** repomix npm downloads went **119,678 (2025-07)
   → 327,053 (2026-07), 2.73× year on year, the highest month in the package's history.**
5. **Revealed maintainer priority is the inverse of our premise.** repomix issue **#226 "Support for
   unpack"**: opened 2024-12-29, **still open, 6 comments, 0 reactions** after 19 months. Issue
   **#71 "Splitting code into several files"**: 12 comments, **8 reactions**, produced PR #113 — and
   repomix **shipped** `src/core/output/outputSplit.ts`. The maintainer's own conclusion (#226,
   2024-12-31): *"If you're using a JSON output or something similar, then unpacking would probably
   be easy, but otherwise, the format would be difficult to define, so it might be hard."*
6. **The human lane is dead on its own forum.** `forum.obsidian.md` t/81878 *"How do I export an
   entire Vault to a Single File?"* — created 2024-05-15, **9,010 views, 1 like, 3 posts in 26
   months**. t/96068 — 849 views, 1 like, 4 posts. For contrast, the "Share Note plugin" thread has
   **172 posts**. **9,010 views says people look; 1 like and 3 posts say nobody wanted it enough to
   reply.**
7. **A vault-scale container fits in no context window.** Container **25,776,700 B** vs described
   index **234,119 B = 110.1×**. A 200K-token budget holds **2.79%** of the container and **308%** of
   the index; a 2M-token budget holds 27.9%. Mean file 23,568 B, so a 200K pack carries about **thirty
   average files**. (The 3.6 bytes/token constant is an assumption — no tokeniser was available — but
   the conclusion is robust across 3.0–4.0 B/tok.) **If MDMAX ships a "pack my whole vault" button, it
   ships a button that manufactures disappointment.**
8. **The container is not a durable artifact.** A **4-backtick wrapper DOWNGRADES to 3** through
   `mdast-util-to-markdown`, and **496 of 1,084 corpus files (45.76%) contain a ``` fence**, so any
   member with an internal fence **terminates the wrapper early after a single normalising pass
   through any third-party markdown tool** — which is exactly where the artifact is supposed to
   travel. Aider avoids this by **re-deriving the fence at emit time** rather than trusting a
   delimiter written into a stored file. **⇒ the container is an EPHEMERAL READ TRANSPORT, generated
   on demand, never committed.**

#### 3.7.6 Boundary destruction — refuse and localise, never repair

Detection is certain and cheap: delimiter count vs manifest length, dense-index check, path
agreement. **Repair is not.**

| condition | result |
|---|---|
| Digest recovery when at least one neighbour is unedited, p(edited)=0.5, n=400 | **exact 303/400 = 75.8%** — matching the theoretical `1 − 0.5² = 75%` |
| Both neighbours edited | bracketing always contains the true split, but the window is **median 17,309 B, p90 71,206 B** — correct and vacuous |
| Model rewrites across the boundary (`merge_across`), n=120 | **119/120 WRONG** |
| Model elides unchanged regions (`elide_unchanged`), n=120 | **119/120 WRONG** |
| Model reorders, n=120 | **120/120 WRONG** |
| Truncation, n=120 | 47/120 destroyed outright |
| Clean delimiter deletion, n=120 | 63 exact, 50 within a window, **7 WRONG** |

**"WRONG" means it returns a confident boundary position that does not contain the true split — i.e.
silent corruption.** `[measured, seed 20260801]`

**The researcher's own first measurement of this flattered the design by 99 percentage points** (200/200
recovery under a benign destruction model) and they reported the reversal against themselves. **Anyone
who re-derives the earlier "diff-and-rebase" prototype's numbers should assume they are benign-case
numbers until a hostile fixture proves otherwise.**

**Therefore the behaviour is:**

> *"The boundary between A and B was destroyed. The manifest byte count puts it near line X — within
> 10 lines with 78% confidence. Here are the two candidate splits. Confirm."*

The best available localiser is the manifest byte-count prior: **median 3 lines, p90 18, max 192;
within 0 lines 13%, within 3 lines 52%, within 10 lines 78%.** A suggestion, never a repair.

**Prevention beats repair, and this is the product decision.** **Never hand a model a pack and ask
for the pack back.** Ask for per-file whole-file listings in Aider's shape — path line, fence, full
body, fence — which is the format models are most reliably well-formed in: on Aider's polyglot
leaderboard the `whole` format is well-formed at **median 99.6% (min 92.9, max 100.0, n=15)** while
`diff` is **median 94.2% with a min of 64.4% (n=47)**. `[measured, `aider/website/_data/polyglot_leaderboard.yml`, 69 rows]`
That shape is structurally identical to one entry of our own container, so **one scanner serves
both**, and the manifest then validates the return: every returned path must be in the manifest,
every unreturned file is unchanged by definition, a returned file whose digest equals its pre-edit
digest is a no-op.

#### 3.7.7 Split contract and CLI surface

```
manifest    YAML front matter: fmpack: 1 · fence: N · root: · then ONE LINE PER FILE
            - {i: 0, bytes: 5864, sha256: "61397d27…", path: "AGENTS.md", nl: 1}
open        <F>text fm:file <i> <json-quoted-path>     at column 0
close       <F>                                        at column 0
ordering    manifest order == physical order == index order, dense 0..n-1
```

```
mdmax pack <paths…> --budget <tokens|bytes> [--root DIR] [-o FILE]
    → refuses above the target model's window and prints the index size instead
mdmax unpack <FILE> --into DIR [--dry-run] [--json]
    → per-file verdict: clean | edited | reframed | framing-damaged
    → TRANSACTIONAL: verify everything, then write, never partial
mdmax pack --explain          # which fence run was computed, and why
```

**Rejoin contract — dual authority.** Byte count is the fast path and the tamper detector; the fence
is the human-editable frame. Agreement → `clean`. Digest matches the byte-count slice only →
`framing-damaged`. Digest matches the fence slice only → `reframed` (a human edited the file and the
count is stale — accept and rewrite the manifest). Neither → `edited`.

**E-codes refuse the entire unpack and write nothing:** `E-NOHEADER`, `E-UNTERMINATED-MANIFEST`,
`E-EMPTY-MANIFEST`, `E-COUNT-MISMATCH`, `E-INDEX-NOT-DENSE`, `E-INDEX-RANGE`, `E-PATH-DISAGREE`,
`E-ABSOLUTE-PATH`, `E-TRAVERSAL`, `E-NONCANONICAL`, `E-DUP-PATH`, `E-CASE-OR-NORM-COLLISION`,
`E-CTRL-IN-PATH`, `E-UNCLOSED-FINAL-FENCE`, `E-RUN-UNDERDECLARED`.
**W-codes unpack but quarantine the file:** `W-EDITED`, `W-REFRAMED`, `W-FRAMING-DAMAGED`.

#### 3.7.8 The experiment that gates the build

**E1 — the round trip. No model calls. One day.** Write the **unpacker first**, from the written spec,
by a person or agent who has **not seen the packer** (Learned Rule #60). Then, for all 1,084 files of
`corpus_id sha256:3a010b16…` and 5 bundle sizes (20/50/100/200/400 members, 3 random draws each, seeds
recorded), assert `unpack(pack(S)) == S` byte-identically for every member — **and then assert it
still holds after the bundle has passed through one `fromMarkdown`/`toMarkdown` round trip.**

Pre-registered predictions: (a) heading-carried paths fail at 15–25% of members after the round trip
(measured point 13/60 = 21.7%); (b) fence-info-carried paths fail at 0%; (c) trailing-newline loss is
the second-largest defect class and is invisible without the `nl` flag; (d) the 7 unterminated-fence
files are the only pack-time refusals in the corpus.

**Make it go RED first (Learned Rule #68):** the heading-carried arm must reproduce the
`workflow.md → workflow\.md` corruption before any green result is trusted.

#### 3.7.9 Kill conditions — five, any one of which fires

1. An **independently written** unpacker cannot reach **100.00% byte-identical recovery per file** on
   the pinned corpus at every phase gate. **Not 99.9%.** 1084/1084 is achievable today with a 96 ms
   packer, so any regression below it is a defect, not a trade-off.
2. Any shipped unpacker can be induced to write a path outside the target root by content inside a
   contained file. **One instance kills the feature** until the run-pinning invariant is proven by a
   fixture that **fails against the unfixed reader** — the naive-reader test is that fixture and it
   must stay in CI.
3. Boundaries survive at ≥ 90% for 100-file packs **and** repomix ships an unpack inside the build
   window → the differentiated part is gone; we are re-implementing a 27,551-star incumbent.
4. The product ships a **"pack my whole vault"** affordance → it manufactures a 25 MB artifact of
   which 2.79% fits a 200K window and which is 110× more expensive than the index answering the same
   question.
5. Six months after launch, **unpack invocations are under 5% of pack invocations** → that is
   `llm-code-format`'s 846:1 reproduced in our own telemetry. Keep pack, delete unpack, stop paying
   for the manifest.
6. **K-D, and it costs one conversation:** if, shown the four constructions side by side, the founder
   says the export he meant was always *"a zip of clean `.md` files"* and never a single artifact,
   then the mother-markdown was a metaphor and four sessions of hearing it were four sessions of
   hearing what we wanted.

#### 3.7.10 What this does NOT cover

No transclusion. No `fm:vocab:`. No cross-file reactive state. **No capability whose payload is by
reference** — those measure `VOID` under plain rendering (§3.3.5) and are therefore excluded by D6
until someone decides D6 has an exception and writes it down. And the container is explicitly **not**
D4's escape-hatch export: that is a plain zip of plain files, one-shot, never versioned.

---

### 3.8 Cross-cutting prerequisites — smaller and more boring than any capability above

These are not capabilities. They are the things that will bite in week one, and three of them must
land **before** the first anchor is persisted.

#### 3.8.1 The offset model — one unit, one boundary policy, one conversion point

**Only 67 of 1,080 files have `bytes == UTF-16 code units == code points`. 93.8% already diverge.**
`[measured, corpus_id sha256:3a010b16…]` Separately, **103 of 2,314 files (4.5%)** in these vaults
contain non-BMP characters `[measured, engine PLAN §3.3]`.

```
UNIT            UTF-16 code units (what CodeMirror and mdast use)
BOUNDARY        an offset may NEVER fall inside a surrogate pair.
                Reject at construction. NEVER round.
CONVERSION      exactly one place: a per-open-document OffsetMap holding a
                Uint32Array UTF-16→byte prefix table plus a lazy
                Intl.Segmenter grapheme bitset.
TYPES           branded: U16Offset | ByteOffset | GraphemeIndex — they cannot mix.
LINT            an eslint no-restricted-syntax rule forbidding Buffer.byteLength,
                TextEncoder, codePointAt and raw .slice on a document anywhere else.
```

The bug appears at **every boundary where a byte offset enters**: a git blob, a `Buffer`, a content
hash over a byte range, a Rust implementation, or an LSP that negotiated `utf-8`.

#### 3.8.2 Version the two pure functions everything else keys on

```
normalize/1   NFC + collapse whitespace + lowercase   → "mdmax/normalize@1"
slug/1        the heading anchor algorithm            → "mdmax/slug@1"
```

Both are **published, pinned, and stamped into every stored anchor and every certificate row.**

- **`normalize/1`:** the 99.627% was swept over 384 configurations under exactly NFC + collapse
  whitespace + lowercase. **If the hash input changes later, every stored anchor silently re-keys
  while the published number keeps describing code that no longer exists.** This must land **before
  the first anchor is persisted**; afterwards it is a migration.
- **`slug/1`:** **anchor health swings 77 percentage points on the choice.** The same corpus's 392
  intra-document anchors resolve **86 under `github-slugger`** and **388 under a dash-collapsing
  slugger** — and one research report used both algorithms in two adjacent claims without noticing.
  **"Pick and publish the anchor algorithm" is the single highest-leverage decision in the linker and
  it costs one afternoon.**

CI assertion: **the `VERSION` constant must change whenever the function's output over a 200-case
golden file changes.**

#### 3.8.3 The YAML value slot that D8 rests on

D8 says extensibility lives in the **value** of a field. **The value slot is broken in the founders'
own vault:**

- **170 of 907 front-matter blocks are not valid YAML**, because `related: [[a]], [[b]]` puts
  markdown's grammar inside YAML's.
- The quiet variant `[[[A]], [[B]]]` **parses successfully into a nested array and destroys the links
  with no error.**

`[measured, corpus_id sha256:3a010b16…]`

**Required: a lenient front-matter pre-pass that quotes bare `[[…]]` runs before handing the block to
YAML, a hard refusal for the silent-corruption case, and a rule that a front-matter parse failure may
NEVER fail a user action.** Note that §3.1's splice path avoids the parser entirely, which is exactly
why it is the fix for the 171 unreadable blocks.

#### 3.8.4 The shape gate, the worker budget, and two live quadratics

Two quadratics are shipped and measured, both against this repo's own `node_modules`:

| site | measurement |
|---|---|
| `WIKILINK_RE` | k = 1.98 — **36,865 ms on 320 KB of `[[`** |
| `mdast-util-from-markdown` on flat bullet lists | **12,429 ms vs micromark's 1,207 ms on identical bytes — a 10.3× gap that widens** |

`[measured]` And CommonMark is linear in practice but **quadratic under adversarial input**, patched
case by case (cmark #373, #389, CVE-2023-22484) `[primary, engine PLAN §3.2]`. **A compiler will be
fed hostile documents.**

Before any grammar runs: strict UTF-8 decode (**refuse invalid, never repair**), BOM strip, and refuse
by **shape** if `bytes > 4 MB` **or** `lines > 200,000` **or** `list-marker lines > 20,000`. All
parsing happens in a long-lived `worker_threads` pool with a **250 ms keystroke / 2,000 ms cold-open
/ 10,000 ms batch** budget enforced by `worker.terminate()`. Failure surfaces as a discriminated
union — `{ok: false, reason: 'BUDGET_TIME'|'BUDGET_BYTES'|'BUDGET_BLOCKS'|'PARSER_THREW'|'WORKER_DIED', at: {line, col}}`
— **never as an exception in a route handler.**

#### 3.8.5 A placement fixture, before any byte is written into a user's file

**Measured defect in a design proposed by this research, found by its own verifier:** inserting a
marker adjacent to a setext heading **silently changes the document's meaning, and blank-line
isolation does not prevent it.** Verified with this repo's own parser:

```
"Heading\n---"                              → heading(depth=2)
"Heading\n<!-- mdmax:begin id=k -->\n---"   → paragraph, html, thematicBreak
"Heading\n\n<!-- mdmax:begin id=k -->\n\n---" → paragraph, html, thematicBreak   ← SAME CORRUPTION
```

**An `h2` becomes a paragraph plus a horizontal rule.** Any CLI verb specified purely on byte ranges
is directly exposed to this. **Every byte written into a user's file passes a placement fixture
first** — this is house rule P5, and it exists because of this exact case.

---

### 3.9 What MDMAX is NOT — the cut list, so nobody re-opens it

| cut | why |
|---|---|
| MDMAX as a compiler **programme** — a spec, a format profile, a published benchmark, a CLI beyond `cert` | it is a ~600-line library subordinate to the editor |
| A notation library, a vocabulary registry, any declared-vocabulary syntax | measured user-invention rate **0.31%**, and **all of it is tutorial content teaching the feature**. 99.69% of the 4,538 `:::` directives in Docusaurus's own repo are among its 9 vendor-shipped keywords; 847 independently authored npm docs use exactly GitHub's 5 built-in callout types with **zero** inventions |
| The doc-tree folder compiler and its incremental engine | cold full build **~1 second**; maximum transitive blast radius **54 of 1,084 files** |
| **Markdown as a graph**, and the graph view | median out-degree **zero**; 502 files (46.3%) fully isolated; 511 connected components; genuine content transclusion **ZERO** in 25.5 MB (all 45 `![[…]]` occurrences are syntax documentation). Zero occurrences of "graph" across 89 sourced feature requests |
| A provenance vocabulary of our own | §3.6 |
| The "fewer tokens" promise to AI consumers | §3.5.3 |
| Publishing 99.627% before it is re-derived | §3.2.7 |
| `EditableTable` / `setTableCell` | dead code, imported by nothing, 13.4% no-op dirty rate, silent pipe-escape corruption. **Remove rather than fix** |
| Multi-agent concurrency control | 29 of 724 written files (4.0%) touched by more than one session ever; **0 files by two sessions within 60 minutes** across 1,200 transcripts. **CAVEAT — do not over-cut:** that population is one operator's *agent* sessions and structurally cannot contain the multi-**human** co-editing D1 exists to serve. Cut agent-vs-agent concurrency; **do not cite it against human presence** |

**One correction to the record while cutting.** The founder-thesis area justified a "program-wide
blind spot" by quoting `src/modules/graph/presentation/graph-data.ts:132` as
`if (targetPath === undefined) continue; // unresolved — drop`. **That line does not exist.** The
real branch is at line 176 and the comment above it reads, verbatim (re-read this session):

```ts
// Unresolved links are not edges — there is no node to point at — but
// they are a diagnostic, so they are reported rather than dropped.
```

The module already ships a typed `UnresolvedLink[]`, a `reportUnresolved()` function, and a `reason`
field discriminating `"target-excluded"` from `"no-such-note"`. The `— drop` comment quoted exists at
line 188, on the **duplicate-link** branch. **The paraphrased-as-verbatim code quote is itself a
defect, and the artifact cited does the opposite of what the claim asserted.**

---

### 3.10 How this section could be wrong

1. **The verifiers that produced most of the corrections above have a measured false-kill rate of
   0–19%** (105 kills sampled across four audits: 17.2% / 3.4% / 19.0% / 0%). A kill is strong
   evidence, not proof. Where a kill in this section looks wrong to a builder, re-derive it rather
   than deferring to it.
2. **The corpus is one team's writing.** 416 commits by one author over 80 days. Every resolution
   rate, every carrier prevalence, every fence statistic is a property of that corpus. **The
   two-tier link split (§3.4) and the anchor number (§3.2) both need a second corpus this team did
   not write before either is published.**
3. **Numeric drift is one-directional across the whole research base.** Six independent numeric
   non-reproductions in the `markdown-base` area alone all moved in the direction that flattered the
   thesis; the `founder-thesis` verifier found the same pattern four times out of four on
   interpretive labels. The structural conclusions in this section reproduced under independent
   re-derivation; **the percentages did not, consistently. Re-derive every percentage before quoting
   it downstream** (house rule P2: no headline without a committed derivation script and its output).
4. **The single highest-value falsification available is cheap.** Capability 1's gate
   (907/907 byte-identical publish-then-unpublish) either goes green or it does not, in half a day,
   against real bytes. **If it does not, every other capability in this section is downstream of a
   writer that does not work,** and the correct response is to stop and fix the writer rather than
   to proceed to capability 2.


---

---

### Links

**This section references:** [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§4 Representation](04-representation.md) · [§5 Rendering](05-rendering.md) · [§7 Product](07-product.md) · [§9 AIOS](09-aios.md) · [§10 Engine spec](10-engine-spec.md)

**Referenced by:** [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§5 Rendering](05-rendering.md) · [§6 Conventions](06-conventions.md) · [§7 Product](07-product.md) · [§10 Engine spec](10-engine-spec.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
