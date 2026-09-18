---
id: 25-ENGINE-SPEC
title: Engine specification
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: f237ece
covers: [engine, splice, projection-law, anchors, corpus]
---

# 25. Engine specification

**This is the file that matters most.** Everything else in this pack describes a product. This
describes the one guarantee the product is sold on, and the one place where getting it wrong loses a
person's document.

## 25.1 The splice contract

Quoted in full from `specs/engine/splice-writer.md`, which is the spec of record:

> Locate the byte range of the target, replace exactly those bytes, and leave every other byte of
> the file bit-identical. Never regenerate the document from a parse tree. When the range cannot be
> located unambiguously, **return the input unchanged** and say why. Refusal is a correct outcome;
> guessing is not.

Four commitments sit inside that paragraph, and they are worth separating because each has its own
failure mode.

Commitment | What it forbids | The failure it prevents
**Locate a range** | Operating on a parse tree instead of on bytes | An offset that means something different after a reparse.
**Replace exactly those bytes** | Rewriting the file | Comments, anchors, spacing and reference links vanishing.
**Never regenerate from a tree** | A serialise step | A normalising round trip that touches every line.
**Refuse when ambiguous** | Guessing | A confident wrong answer, which is the one failure this product exists not to have.

`AGENTS.md:13` states the second half as a rule for every agent in the repository: returning the
input unchanged is a correct outcome, guessing is not, and this is the whole differentiation.

## 25.2 The projection law

**The file on disk is the only source of truth. Every view is a deterministic, stateless projection
of it.**

Read the two adjectives as tests a view must pass:

- **Deterministic.** The same bytes produce the same view, every time, on every machine. A view that
  needs a cache warm-up or a random tie-break is not a projection.
- **Stateless.** The view holds nothing the bytes do not contain. Anything a view remembers is a
  second source of truth, and a second source of truth is a future disagreement.

The law has a converse, and the converse is where the engine's remaining work lives. **A render
profile is a view whose edits write back to the bytes that produced it.** `docs/ENGINE.md` section
76.1 states the consequence plainly: with no body locator, the law holds for exactly one region of
the file.

That one region is the front matter block. Everything below it is, today, a read-only projection.

## 25.3 Two different things are called the engine

This confuses every new reader, so it goes near the top.

Name | Where | What it does | Wired into the product
**The splice writer** | `src/modules/share/domain/splice-frontmatter.ts`, 13,324 bytes | Locates a front matter key's byte span and replaces exactly those bytes | Yes, through the `share` module.
**MDMAX** | `src/modules/mdmax/`, 13 files | The rendering-equivalence certificate: does this document render the same across seven engines | Barely. See below.

`[O]` At `f237ece`, the entire wiring of `mdmax` into the product is **two imports of one symbol**:

- `src/modules/vault/application/get-snapshot.ts:13`
- `src/modules/vault/infrastructure/search-index.ts:16`

Both read `import { decodeStrict } from "@/modules/mdmax/domain/shape-gate";`. Nothing else in `src/`
imports `mdmax`, and `mdmax` is the one module of thirteen with no barrel
(`20-ARCHITECTURE.md` section 20.7).

**So "the engine is unwired" is accurate for MDMAX and wrong for the splice writer.** The splice
writer is live. Keep the two apart when reading any older document.

The `mdmax` files, with the byte size and the first line of each header:

File | Bytes | What it is
`domain/constructs.ts` | 26,859 | Layer 1, the construct corpus.
`domain/verdict.ts` | 21,838 | The verdict classifier, one block and target cell.
`infrastructure/bench.ts` | 21,139 | The pinned renderers the certificate measures.
`application/certify.ts` | 14,233 | The certificate engine, layers 2 and 3.
`domain/offsets.ts` | 13,581 | One offset unit, one boundary policy, one conversion.
`domain/fold.ts` | 15,059 | The equivalence fold, a named and versioned pure function.
`domain/cert-contract.ts` | 7,485 | The interfaces every part of the certificate shares.
`domain/shape-gate.ts` | 6,892 | Refuse hostile documents before any grammar runs.
`domain/placement.ts` | 6,867 | Every byte written into a person's file.
`domain/targets.ts` | 5,913 | The target registry of product and surface pairs.
`domain/slug.ts` | 5,231 | The heading anchor algorithm and its resolver.
`domain/frontmatter-prepass.ts` | 5,142 | The lenient front matter pre-pass.
`domain/normalize.ts` | 2,939 | `normalize/1`, the hash input for every stored anchor.

Two of these are load-bearing beyond the certificate. `shape-gate.ts` exports `MAX_BYTES` of 4 MiB,
`MAX_LINES` of 200,000 and `MAX_LIST_MARKER_LINES` of 20,000, and refuses a hostile document before
any grammar runs. `normalize.ts` exports `NORMALIZE_VERSION = 'mdmax/normalize@1'` and carries its
own instruction: changing the function requires bumping the version, because a golden-file gate
depends on it.

`offsets.ts` is the one to read before touching any position. It brands three incompatible types,
`U16Offset`, `ByteOffset` and `GraphemeIndex`, so a byte offset cannot be passed where a UTF-16
offset is expected. That branding is the type-level form of the whole contract.

## 25.4 The six invariants

Transcribed from `specs/engine/splice-writer.md`. The right-hand column is what makes each one more
than a wish.

# | Rule | Executable check
1 | Bytes outside the target range are bit-identical after any write | corpus run, `changed = 0`.
2 | The writer never throws. It returns the input or a spliced result | corpus run, `threw = 0`.
3 | An unresolvable target is refused, never appended and never guessed | refusal-path tests.
4 | Line-ending style and any byte-order mark are preserved exactly | byte diff on untouched lines.
5 | Every operation is asserted independently. No oracle may test only set-then-delete | oracle shape, enforced by `engine/nf-003-bare-cr-fence`.
6 | There is one splice implementation in the repository | a `grep -c` for a second key scanner, **and the spec labels this a proxy check**.

**Invariant 2 deserves a sentence.** A writer that throws turns a refusal into data loss at the call
site, because the caller's error path was written for a network failure and not for a document it
must not corrupt. Returning the input is the only safe failure.

**Invariant 5 is the one that was learned the hard way.** A round-trip oracle that asserts
set-then-delete cancels a defect out: if `set` corrupts and `delete` un-corrupts, the pair passes.
That is exactly how NF-3 stayed invisible while NF-1 and NF-2 were found. Assert on the state after
`set` alone.

**Invariant 6 labels itself a proxy.** A grep over source text is not proof that a second
implementation does not exist, and the spec says so rather than pretending. Copy that habit.

## 25.5 What the writer may and may not touch

Operation | Guarantee
`set` on an existing key | Only that key's value bytes change.
`set` on an absent key | Insert at a defined position, or refuse. **Never append blindly.**
`delete` | The key's span and its continuation lines are removed. Nothing else.
`rename` | Refused when the new key would need quoting.
Any operation on unparseable front matter | Refused, and the file is returned unchanged.

**May not touch, in any operation:** the byte-order mark, the line-ending style, comments, blank
lines, key order, indentation of untouched lines, the closing fence, or one byte of the body.

A byte-order mark sits **before** the document and is not part of it. That is already the shipped
behaviour, and `src/modules/share/domain/splice-frontmatter.ts:126` records it: `FM_OPEN` is
anchored at index 0, so the mark has to be stepped over rather than parsed.

## 25.6 Range location

The writer is a line walker, not a YAML parser. That is deliberate: a parser gives you a tree, and a
tree gives you a serialiser, and a serialiser rewrites the file.

The shape, read from the source:

1. **Find the opening fence.** `FM_OPEN = /^---[ \t]*(\r?\n)/`, anchored at index 0, after stepping
   over a byte-order mark.
2. **Walk the block's lines**, classifying each as a top-level key line, a continuation, a comment
   or a blank.
3. **A line is top level** when it is non-empty, un-indented, not a comment, and contains a colon.
   The predicate in the red proof is
   `const isTop = text !== '' && !indented && !/^#/.test(text) && /:/.test(text)`.
4. **Everything else that is non-empty and un-indented** falls to the refusal branch,
   `} else if (text !== '' && !indented && !/^#/.test(text)) { return src }`.
5. **The key's span** runs from its line through its continuation lines, and the splice replaces
   exactly that span.

**Cite the pattern, not the line number.** Both engine specs say so explicitly, and `nf-001` records
why: the branch was at line 197 on 2026-08-29 and will not stay there.

## 25.7 The ambiguity rule

**When the range cannot be located unambiguously, return the input unchanged and say why.**

This is not error handling. It is the product. Three things follow from treating it that way:

- **A refusal is a first-class outcome with its own message.** `specs/engine/splice-writer.md` sets
  the template until the refusal-UX spec lands: state what happened, state that the file is
  unchanged, state why, and give one next step.
- **Every refusal names what was not changed.** A person who is told an operation failed will try
  again. A person who is told their file is untouched will read the reason.
- **A refusal is counted, not hidden.** The exit condition for the R0 track is
  **refused at most 2, changed 0, threw 0** over the corpus. A refusal rate is a number the team
  watches, which is what stops refusal from becoming an excuse.

The full register of reasons, with the fixture that reproduces each and its status, is
`26-ENGINE-REFUSAL-CATALOGUE.md`.

## 25.8 `SAFE_KEY` addressability

**Today**, `src/modules/share/domain/splice-frontmatter.ts:53`:

```ts
export const SAFE_KEY = /^[A-Za-z0-9_.$-]+$/
```

It excludes a space, so `date created` is unaddressable. It excludes every non-ASCII letter, so a
key in any other script is unaddressable. The writer refuses those files rather than addressing the
wrong bytes, which is correct behaviour and a large availability cost.

Both call sites refuse early and explicitly:

- `spliceFrontmatterValue`, line 124: `if (!SAFE_KEY.test(key)) return src` with the comment that
  the key cannot be addressed, so refuse rather than append.
- `spliceFrontmatterKey`, lines 244 and 245: the new key is refused when it would need quoting, and
  the old key is refused when it is unlocatable, because renaming an unlocatable key renames the
  wrong bytes.

**The design that replaces it is NF-4**, specified in `docs/ENGINE.md` section 75. It is a
specification, not code: `src/modules/share/domain/key-ref.ts` **does not exist** at `f237ece`.

The decision, from section 75.1: the character allowlist is replaced by **a predicate over what the
byte locator can find unambiguously**. A key of any Unicode string is addressable when it

- is already in Normalization Form C,
- is one line,
- carries no control character,
- has no leading or trailing whitespace,
- contains neither a colon followed by space-or-end-of-line, nor a space followed by `#`,
- and does not begin with a YAML indicator character.

**The equality rule is the subtle part, and it is the right call.** Equality is codepoint equality
after normalising **the request only**. The file is never normalised. A file whose key is not in
Normalization Form C is refused with its own distinct verdict rather than matched.

Read what that buys. Normalising the file to make a match would be a write outside the target range,
which is invariant 1. Refusing instead keeps the guarantee and hands the person a repair they can
approve. The refusal union carries the normalised form for exactly that reason, and `NOT_NFC` is the
only refusal that suggests a repair.

**Measured**, `docs/ENGINE.md` section 75.1, against the pinned corpus: the change unlocks **936 of
942** currently unaddressable files, 99.363 percent, and the 6 that stay refused are all correct
refusals.

The leading-indicator check is deliberately stricter than YAML requires. `-a` and `?a` are legal
plain keys and are refused anyway, because the locator must scan lines it did not write, a leading
`-` is the NF-1 sequence marker, and refusing them costs zero corpus files. The check is on the
first codepoint of the **key**, never of the line, so `a-b` is untouched.

## 25.9 Body-span splicing

**The gap, stated exactly** (`docs/ENGINE.md` section 76.1). `spliceFrontmatterValue` addresses one
thing: a top-level YAML key inside the block opened by `FM_OPEN`. Every write-back a render profile
needs lives below that block.

Write-back | Target span | Path today
Kanban drag to a status | a field in a list item, or a front matter key | front matter only. A card whose status is in the body has no write path.
Checkbox toggle | the three units `[ ]` inside a task marker | none.
Calendar drag to a date | a date token in a list item or a heading line | front matter only.
An accepted AI hunk | an arbitrary block range | none.
Section-level restore | a heading line through the next heading of depth at most d | none.

**The addressing model, and the measurement that decided it.** Four candidates were weighed against
the pinned corpus. The number that settled it is duplicate content.

Measurement | Result | Source
A task-list line's trimmed text is unique within its own file | 2,278 of 3,378, **67.436 percent** | `docs/ENGINE.md` section 76.2, `[measured]`
The same, with the preceding non-blank line as context | 2,554 of 3,378, **75.607 percent** | same
An ATX heading's full ancestor path is unique within its file | 37,413 of 37,489, **99.797 percent**, 76 collisions | same

A content-only anchor is therefore ambiguous for roughly one task item in four, and the checkbox
toggle is the most common write the product has. A heading path is almost never ambiguous.

**The decision is a triple, resolved as a cascade**, specified as
`src/modules/share/domain/body-address.ts`, which **does not exist** at `f237ece`:

```ts
export type SpanKind =
  | 'task-marker'      // the 3 code units `[ ]`, the only mutable part of a checkbox
  | 'list-item-text'   // the item's own text, excluding its marker and its children
  | 'inline-field'     // `key:: value` or `key: value` inside a list item
  | 'fenced-block'     // open fence line through close fence line, indivisible
  | 'callout-body'     // the payload of a `> [!kind]` container
  | 'heading-section'  // heading line through the next heading of depth <= d

export interface BodyAddress {
  readonly kind: SpanKind
  readonly path: readonly string[]      // ATX heading chain, NFC, case-folded. Empty = preamble
  readonly ordinal: number              // 0-based among same-kind spans under `path`
  readonly digest: Digest128            // over the span's own UTF-8 bytes
  readonly contextDigest: Digest128     // previous non-blank line + span + next non-blank line
  readonly docVersion: Digest128        // the document's content hash. The CAS token
}
```

Read the three fields together. The **path** survives an edit above it, because it is structural
rather than positional. The **ordinal** disambiguates duplicates, which is what the 67 percent
number demands. The **digest** detects that the target itself changed, which is what turns a stale
address into a refusal instead of a wrong write.

`fenced-block` is marked indivisible on purpose. An unclosed fence swallows the rest of the
document, which is the settled reason the render carrier is a `> [!kind]` callout for prose and a
fence only for opaque data (`CLAUDE.md:120`).

## 25.10 The anchor system

An anchor is what lets a comment, a proposal or a queue item still point at the right bytes after
the document has been edited. `docs/ENGINE.md` section 77.1 defines it as a **content-derived,
document-scoped, refusal-capable pointer to a byte range**. It stores no line numbers, no offsets of
record and no parse-tree path.

`src/modules/mdmax/domain/anchor.ts` **does not exist** at `f237ece`. What follows is the design.

```ts
export const ANCHOR_VERSION = 'mdmax/anchor@1'

export interface Anchor {
  readonly v: typeof ANCHOR_VERSION
  readonly normalizeVersion: typeof NORMALIZE_VERSION  // 'mdmax/normalize@1'
  readonly docId: DocId          // content-address of the document lineage, NOT a path
  readonly hash: string          // sha256(normalize(block)).slice(0, 16)
  readonly multiplicity: number  // same-hash blocks in the doc AT ANCHOR TIME
  readonly ordinal: number       // 0-based index among those
  readonly quote: string         // normalize(block), head 160 + tail 160 if longer
  readonly prefix: string        // last 64 normalized units before the block
  readonly suffix: string        // first 64 normalized units after the block
}
```

**Four decisions, each with the measurement that forced it**, from section 77.1:

Decision | Rejected | Why, and the number
Identity is a hash plus quote, context and multiplicity | an mdast node path such as `root.children[7].children[2]` | A path is invalidated by any insertion above it. Every anchor in a vault would detach on the first paragraph added at the top.
Scope is bound to `docId`, never to a path, never resolvable across documents | resolve wherever the text is found | Anchors from one corpus file resolve into a **different** file **35.1 percent** of the time `[measured]`.
The ladder is exact, verify, disambiguate, fuzzy, orphan, each able to decline | one fuzzy pass with one threshold | The expensive errors live in the exact lane, not the fuzzy one. **115 of 141** ablation false positives came from exact-hash, 81.56 percent `[measured]`.
Threshold `T = 0.76`, `MARGIN = 0.12` | accept the best match always | A browser annotation landing in the wrong paragraph is a shrug. Ours proposes an **edit**.

**The `multiplicity` field is the one people delete to simplify, and it is the one that prevents the
worst failure.** Recording how many same-hash blocks existed when the anchor was minted is what lets
the resolver know the difference between one match because there is one block and one match because
the other three were deleted. The second case must decline.

**`normalizeVersion` is stored in every anchor**, and `src/modules/mdmax/domain/normalize.ts:14`
carries the matching instruction: changing `normalize` requires bumping `NORMALIZE_VERSION`. An
anchor minted under version 1 and resolved under version 2 is a different question being asked of
the same data.

## 25.11 Incremental parsing, and the lezer decision

**The decision** (`docs/ENGINE.md` section 79.1): keep remark and micromark as the engine's only
parse layer. Keep `@lezer/markdown` where it already is, inside CodeMirror serving decorations, and
make the boundary one-way and typed so that **no position produced by the editor's tree can reach
`splice-frontmatter.ts` or any anchor resolver**.

The sentence that frames it, quoted:

> Two trees of the same document are not the hazard; two trees of two different revisions treated as
> one is, and that is a provenance problem, not a parser-choice problem.

**The premise that did not survive measurement.** The proposal for lezer rested on "byte-accurate
SyntaxNode positions". Section 79.3 measured it: lezer parses a JavaScript string, so its offsets
index UTF-16 code units, which is the same unit mdast reports. There was no byte accuracy to gain.

**The cost that was accepted**, from the same section, over 8,513 files:

Parse layer | Cost | Ratio
lezer | 566 ms | 1x
remark and micromark, today and chosen | 4,849 ms | **8.57x**

The slower option was chosen because lezer misparses front matter, is not bare-CR safe, and emits no
HTML, so it cannot join the seven-engine certificate. Speed was the only column it won.

**The current state is already one-directional in fact, and not enforced.** Section 79.2 records
that the engine's live lezer usage is three presentation files:
`src/modules/editor/presentation/live-preview.ts`, `CodeMirrorEditor.tsx` and
`live/InlineBlockEditor.tsx`. No engine file imports lezer. The work is roughly 60 lines and one
lint rule to make the fact a guarantee.

**So the answer on incremental parsing is: the editor has it, the engine does not, and the engine
does not get it.** A full reparse at 4,849 ms over 8,513 files is 0.57 ms a file, which is not the
constraint. Correctness is.

## 25.12 The corpus gate

`[O]` Run on 2026-09-18 at `f237ece`:

```
$ npm run corpus

> frontmatter@0.1.0 corpus
> node scripts/corpus-foreign.mjs verify

pinned   8513
verified 8513
changed  0
missing  0
extra    0

CORPUS CLEAN - 8513/8513 byte-identical
```

**8,513 files, byte-pinned, and the command exits 1 on one changed byte.** The corpus lives at
`test/corpus/foreign/_vendor/` with a `MANIFEST.sha256` beside it, and the spec puts its size at
19,047,891 bytes.

**Why re-hash before every run.** `specs/engine/nf-001-zero-indent-sequence.md` invariant 5 says a
corpus that drifted is not evidence, and records that the clone already drifted by two files once.

**Assert a floor and hard zeros, never an equality.** The spec says it, and it is the same
correction that had to be applied three times elsewhere in this workspace: an equality-pinned pass
count goes red the moment a check is added, so the assertion punishes coverage growth.

**The corpus cannot prove everything, and the spec says so in bold.** Measured on 2026-08-29 across
all 8,513 files: **zero bare-CR fences, zero CRLF fences, zero byte-order marks.** Defects in those
shapes need synthetic fixtures. A green corpus run says nothing about them.

That is the single most important sentence in the engine's verification story. NF-3 is a bare-CR
defect, it destroys a document on one `set`, and the corpus is structurally incapable of seeing it.

## 25.13 The spec harness and the red proofs

`[O]` `npm run spec` at `f237ece`:

```
specs scanned   4
errors          0
warnings        0
ungoverned      169 of 171 module files (INFO while bootstrapping)
states          draft=4

SPECS OK - 4 scanned, 0 errors, 0 warnings
```

The four: `specs/engine/splice-writer.md`, `specs/engine/nf-001-zero-indent-sequence.md`,
`specs/engine/nf-003-bare-cr-fence.md`, `specs/render/carrier.md`. **All four are `draft`.** None has
reached `verified`, and `AGENTS.md:38` says only the harness writes that state, and only after every
`verify:` command exits 0 **and** a red proof exists.

**169 of 171 module files are ungoverned by any spec.** The harness reports it as information while
bootstrapping. Treat it as the coverage number it is.

**One file, one owner.** `specs/engine/splice-writer.md` owns
`src/modules/share/domain/splice-frontmatter.ts`. The defect specs own their red proofs and depend
on the writer spec. The rule exists because the gate correctly refused two specs claiming the same
path, and without it two specs go stale each believing the other is current.

**The red proofs, and how to read them.** `[O]` `npx vitest run test/corpus/foreign/`:

```
Test Files  2 passed (2)
     Tests  6 passed | 6 expected fail (12)
```

`test/corpus/foreign/nf-001-red-proof.test.ts` and `nf-003-red-proof.test.ts` use `it.fails`. They
assert the **correct** behaviour, so today they pass by failing. When the defect is fixed they go
red, and the `it.fails` is flipped in the same commit. Six expected failures is the healthy reading
today.

**Each red proof carries both a fixture and a corpus assertion, and the spec explains why neither is
sufficient alone.** The fixture proves the mechanism deterministically in one line. The corpus
assertion proves the scale, and scale is why NF-1 is ranked first.

## 25.14 The two defects that gate a public claim

`docs/mvp0/PRODUCT-PLAN.md` section 17 says two measured defects are fixed before any public claim.
Both are in the refusal catalogue with their fixtures; here is what each one is.

Defect | Class | Blast radius | Why it is ranked there
`nf-001-zero-indent-sequence` | **availability** | 6,613 of 6,614 foreign refusals; 6,613 of 7,969 frontmatter-bearing files, **82.984 percent** | Nothing is written wrongly. It is simply not written at all.
`nf-003-bare-cr-fence` | **set-destructive** | rare, and invisible to the corpus | One `set` prepends a second front matter block. The document now has two.

**Correctness sequences ahead of availability, even when rarer.** That is a recorded decision in
`specs/engine/splice-writer.md`, dated 2026-08-29.

**A note on the blast-radius figure**, because two numbers are in circulation. The front matter of
`specs/engine/nf-001-zero-indent-sequence.md` says "83.10% aggregate across 7,969 files". The red
proof's own header says 82.98 percent. Re-derived here:

```
$ python3 -c "print(6613/7969*100)"
82.98406325762329
```

**82.984 percent is right and 83.10 is not.** The ratio is unambiguous; one of the two records has
drifted. Neither number changes the ranking.

## 25.15 How to check any claim in this file

Claim | Command
The corpus is intact | `npm run corpus`
The specs are valid | `npm run spec`
The red proofs are in their expected state | `npx vitest run test/corpus/foreign/`
The contract text | `sed -n '/^## Contract/,/^## Invariants/p' specs/engine/splice-writer.md`
`SAFE_KEY` and `FM_OPEN` today | `grep -n "SAFE_KEY\|FM_OPEN" src/modules/share/domain/splice-frontmatter.ts`
That the NF-4, body-address and anchor files are still unwritten | `ls src/modules/share/domain/key-ref.ts src/modules/share/domain/body-address.ts src/modules/mdmax/domain/anchor.ts`
Where `mdmax` is wired | `grep -rn "modules/mdmax" src/ \| grep -v '^src/modules/mdmax'`
The engine sections of the record | `grep -n '^## 7[0-9]\.' docs/ENGINE.md` then `sed -n 'START,ENDp'`

**Never open `docs/ENGINE.md` with a Read.** It is about 250 KB. Use `grep -n` for the section, then
`sed -n 'START,ENDp'` for the lines.

## 25.16 Limits of this file

- **What was not assessed.** The engine's behaviour on any document not in the pinned corpus, and
  every performance figure quoted from `docs/ENGINE.md`, which were measured on 2026-08-29 and not
  re-run here. The corpus gate and the spec gate **were** re-run, and their output is quoted above.
- **What could not be verified.** The anchor measurements: the 35.1 percent cross-document resolve
  rate, the 115 of 141 ablation false positives, and the `T = 0.76` threshold. All are marked
  `[measured]` in `docs/ENGINE.md` section 77, and none has a runnable command in this repository,
  because the resolver does not exist yet.
- **What is specified and not built.** `key-ref.ts`, `body-address.ts` and `anchor.ts` are all
  designs in `docs/ENGINE.md`. None is code. Anything in sections 25.8 to 25.10 that reads like an
  implementation is a specification for one.
- **What is not established.** That NF-1 is a single bug. Invariant 4 of its spec makes this
  falsifiable: if post-fix refusals over the corpus exceed 2 of 7,969, NF-1 was never one bug and
  the four-day estimate is wrong.
- **What would falsify this file.** `npm run corpus` exiting non-zero, a second splice
  implementation appearing in the repository, a parse tree reaching the writer, or a spec reaching
  `verified` without a red proof beside it.
- **The open question nobody has answered.** `specs/engine/splice-writer.md` leaves NF-4's key
  equality question open and says it blocks seam 3. Section 25.8 states the answer the engine
  document proposes. Until a founder or the harness records that decision, it is a proposal.
