## 78. Property-based testing for a byte-preserving writer

### 78.1 The decision

Adopt **fast-check 4.9.0** with the `@fast-check/vitest` 0.4.1 binding, on the vitest 4.1.x already in `devDependencies`. Twelve properties across four new files under `test/props/`, seeded both randomly and from the pinned 8,513-file corpus, with a hard wall-clock gate.

| Candidate | Latest | Published | Verdict |
|---|---|---|---|
| `fast-check` | 4.9.0 | 2026-07-08 [fetched: `curl -s https://registry.npmjs.org/fast-check`] | **Adopt.** Native shrinking, `examples:` replay, `seed`/`path` reproduction, `fc.stringMatching`, `fc.gen` for imperative draws. |
| `@fast-check/vitest` | 0.4.1 | 2026-04-28 [fetched] | Adopt. `test.prop` binds to vitest's runner so failures report as normal test failures, not as one opaque assertion. |
| `jsverify` | 0.8.4 | 2018-10-31 [fetched] | Reject. Seven years unmaintained; no Unicode-aware string arbitraries. |
| `testcheck` | 1.0.0-rc.2 | 2017-04-26 [fetched] | Reject. Never left RC. |
| Hand-rolled fuzz loop | — | — | Reject. Shrinking is the whole product. A 4 KB random counterexample that is not shrunk is not a bug report. |

Rejected alternative worth naming: **not adding property tests and widening the corpus instead.** Rejected because the corpus is measurably blind to the exact classes that have shipped as defects — §78.2 quantifies that. Cost of being wrong: ~1.4 MB of `node_modules` and a slower CI. Falsified if, after one quarter, no property has produced a counterexample the corpus did not already contain.

### 78.2 What the corpus cannot see

Census over the pinned vendor tree, `node` walk of `test/corpus/foreign/_vendor/**/*.md` reading each file as UTF-8 [measured, 8,513 files]:

| Shape | Files in corpus | Consequence |
|---|---|---|
| Leading BOM (U+FEFF) | **0** | The BOM defect (commit `f47555f`) was unreachable from the corpus. |
| CRLF anywhere | **0** | The CRLF branch of `spliceFrontmatterValue` is corpus-untested. |
| Bare CR, no LF | **0** | See below — still broken today. |
| Unterminated frontmatter | 0 | The `closeIdx === -1` refusal is corpus-unreachable. |
| No final newline | 860 | Covered. |
| Non-BMP characters | 475 | Covered but thin. |
| `bytes === text.length` | 6,568 of 8,513 | 22.8% already diverge in the third-party set. |
| Zero-indent block sequence in frontmatter | 6,613 | The refusal driver. |
| Frontmatter key containing a space | 937 | Unaddressable under `SAFE_KEY`. |

Three of the four defects named in the brief live in rows with a corpus count of **zero**. A corpus is a sample of what people wrote; a property is a statement about what the code must do. They fail in opposite directions, which is why both ship.

Running `spliceFrontmatterValue(src, 'fm_slug', 'abc-123')` then the matching delete across all 8,513 files [measured, 309 ms]: 6,615 refusals (77.70% of all files; 6,615/7,969 frontmatter-bearing = **83.01%** [derived]), 1,898 applied, 0 locality violations — and **21 round-trip failures the existing suite does not report**, all of the same shape: a file beginning with a blank line loses 1–2 leading newlines because the no-frontmatter `set` path runs `src.replace(/^\r?\n+/, '')` and the delete path then strips one more. Example: `.../approved_files/test_add_footer.test_end_of_line_added_if_missing.approved.md`, 1014 → 1039 → 1013 bytes.

### 78.3 Generators

`test/props/arbitraries/text.ts` and `.../markdown.ts`. Every arbitrary is biased toward a boundary, because uniform generation does not find boundary bugs — §78.5 proves that with a number.

```ts
import fc from 'fast-check'

/** All three terminators, weighted AWAY from the corpus's 100%-LF reality. */
export const eol = fc.oneof(
  { arbitrary: fc.constant('\n'),   weight: 4 },
  { arbitrary: fc.constant('\r\n'), weight: 3 },
  { arbitrary: fc.constant('\r'),   weight: 3 },   // 0 files in the corpus
)

/** Chunks chosen so bytes, UTF-16 units and graphemes all disagree. */
export const unicodeChunk = fc.oneof(
  { arbitrary: fc.stringMatching(/^[ -~]{1,24}$/),                              weight: 8 },
  { arbitrary: fc.constantFrom('é', 'ü', 'ß', '日', '한', 'ي', 'Ω'),             weight: 3 },
  { arbitrary: fc.constantFrom('😀', '𝄞', '🇮🇳', '👩‍👩‍👦', '🏳️‍🌈'),                weight: 3 },
  { arbitrary: fc.constantFrom('e\u0301', 'é'),                                 weight: 2 }, // NFD vs NFC
  { arbitrary: fc.constantFrom('\uFEFF', '\u200B', '\u00A0', '\u2028', '\u3000'), weight: 2 },
  { arbitrary: fc.constantFrom('\uD83D', '\uDE00'),                             weight: 1 }, // lone surrogates
)

/**
 * Text with a surrogate pair placed so its LOW unit lands on a BLOCK boundary.
 * BLOCK = 512 in src/modules/mdmax/domain/offsets.ts. This is the ONLY generator
 * that reproduces the off-by-three; a uniform one does not (§78.5).
 */
export const boundaryStraddlingText = fc
  .tuple(fc.integer({ min: 505, max: 520 }), fc.integer({ min: 0, max: 3 }), fc.nat({ max: 400 }))
  .map(([pad, k, tail]) => 'a'.repeat(pad + k * 512) + '😀' + 'b'.repeat(tail))
```

```ts
/** Frontmatter block bodies, including every shape the writer must REFUSE. */
export const fmLine = fc.oneof(
  { arbitrary: fc.tuple(safeKey, scalar).map(([k, v]) => `${k}: ${v}`),  weight: 10 },
  { arbitrary: fc.tuple(safeKey, fc.array(scalar, { maxLength: 4 }))
      .map(([k, xs]) => `${k}: [${xs.join(', ')}]`),                      weight: 4 },
  { arbitrary: fc.tuple(safeKey, fc.array(scalar, { minLength: 1, maxLength: 4 }))
      .map(([k, xs]) => `${k}:\n${xs.map((x) => `- ${x}`).join('\n')}`),  weight: 4 }, // ZERO indent
  { arbitrary: fc.tuple(unsafeKey, scalar).map(([k, v]) => `${k}: ${v}`), weight: 3 }, // "date created"
  { arbitrary: fc.constantFrom('a: |', 'b: >', 'c: &anch x', 'd: *anch', '? explicit', '<<: *base'), weight: 2 },
  { arbitrary: fc.constantFrom('# a comment', '', '  indented: cont'),    weight: 3 },
)

export const document = fc.record({
  bom:  fc.boolean(),
  fm:   fc.option(fc.array(fmLine, { maxLength: 12 }), { nil: undefined }),
  body: markdownBody,          // fences (closed, unclosed, tilde, ~~~~ nesting), lists to depth 8,
  eol,                         // setext underlines, tables, `<<<<<<< HEAD` conflict markers,
  finalNewline: fc.boolean(),  // an embedded `---` block, HTML comments, indented code
}).map(assemble)               // assemble() joins with `eol` and applies bom/finalNewline
```

Deliberately in scope, because each has shipped a defect or is a stated risk: `<<<<<<< `/`=======`/`>>>>>>> ` conflict markers in the body (the sync design puts them there), a body that itself opens with `---`, lists nested to depth 8 with mixed markers, and fences opened but never closed. Deliberately out of scope: documents above the 4 MB `MAX_BYTES` gate — that is `shape-gate.ts`'s job and generating them costs seconds per draw.

### 78.4 The properties

`REFUSED` is not currently observable: `spliceFrontmatterValue` signals refusal by returning the input, which is indistinguishable from a successful no-op splice. P2 and P3 cannot be stated without it. Decision: add a traced sibling in the same file, and leave the existing signature untouched so no call site changes.

```ts
export type SpliceTrace =
  | { readonly kind: 'APPLIED'; readonly out: string; readonly start: number; readonly end: number; readonly inserted: string }
  | { readonly kind: 'REFUSED'; readonly out: string; readonly reason: SpliceRefusal }

export function spliceFrontmatterValueTraced(
  src: string, key: string, value: string | number | boolean | string[] | null,
): SpliceTrace
```

| # | Property | Statement |
|---|---|---|
| P1 | Round-trip identity | For `k` absent from `src`: `del(set(src, k, v), k) === src`, byte-for-byte. |
| P2 | Splice locality | `t.kind === 'APPLIED'` ⟹ `t.out === src.slice(0, t.start) + t.inserted + src.slice(t.end)`, and `[t.start, t.end)` lies strictly inside the frontmatter block. |
| P3 | Refusal safety | `t.kind === 'REFUSED'` ⟹ `Buffer.compare(Buffer.from(t.out, 'utf8'), Buffer.from(src, 'utf8')) === 0`. Not `===` on the string: a string compare cannot see a re-encoding of a lone surrogate. |
| P4 | Idempotence | `splice(splice(src, k, v), k, v) === splice(src, k, v)`. |
| P5a | Commutativity, both keys present | `k1 ≠ k2`, both located ⟹ `set(set(s,k1,a),k2,b) === set(set(s,k2,b),k1,a)`. Their ranges are disjoint, so this must hold byte-for-byte. |
| P5b | Commutativity, keys absent | Both absent ⟹ byte equality must **fail**; the honest invariant is that the two results have equal line multisets and byte-identical bodies after the closing fence. Asserted in that weaker form, plus an assertion that P5a's strong form does not hold — a property that silently strengthens is a property that will be quietly broken. |
| P6 | Offset-map consistency | `∀ i` valid: `map.toByte(i) === utf8Length(text.slice(0, i))`; `map.toU16(map.toByte(i)) === { ok: true, value: i }`; `toByte` monotone non-decreasing; `toByte(0) === 0`; `toByte(len) === lengthBytes`; a byte interior to a multi-byte sequence returns `ok: false`; `isGraphemeBoundary(0) && isGraphemeBoundary(len)`; `toGrapheme` monotone. |
| P7 | Brand separation | `u16(text, n)` refuses every `n` that `splitsSurrogatePair` reports true for, and never repairs: no returned value differs from its input. |
| P8 | Construct coverage | `⋃ skipRegions(s) ⊆ ⋃ inventory(s).values()`. |
| P9 | EOL-invariant line count | `shapeGate(s).lines` is equal under `\n`, `\r\n` and `\r` renderings of the same logical document. |
| P10 | Normalize idempotence | `normalize(normalize(x)) === normalize(x)`, plus the existing digest pin against `NORMALIZE_VERSION`. |
| P11 | Prepass never writes | `verdict.kind === 'CLEAN'` ⟹ `verdict.yaml === block`; `'REPAIRED'` ⟹ removing the inserted quote pairs recovers `block` exactly. |
| P12 | Conflict-marker containment | A body containing `<<<<<<< ` / `>>>>>>> ` is either refused or spliced with those bytes at unchanged offsets. |

### 78.5 Which property would have caught which shipped defect

Every row below was executed. Pre-fix sources were extracted with `git show <sha>^:<path>` into `$TMPDIR` and imported through a Node 24 type-stripping resolver hook.

| Defect | P1 round-trip | P2 locality | P3 refusal | P4 idempotence | P6 offset map |
|---|---|---|---|---|---|
| **BOM** (`f47555f`) | **PASS on the bug** | **FAIL — catches it** | n/a | PASS on the bug | n/a |
| **OffsetMap off-by-three** (`cc1d451`) | n/a | n/a | n/a | n/a | **FAIL — catches it, 600 wrong answers** |
| **Zero-indent sequence** (open) | PASS | PASS | PASS | PASS | n/a |
| **Bare CR** (open, live today) | n/a | **FAIL — catches it** | n/a | n/a | n/a |

BOM, measured on `'\uFEFF---\ntitle: A\n---\nbody\n'` with key `fm_slug`: pre-fix, `set` returns `"---\nfm_slug: x\n---\n\n\uFEFF---\ntitle: A\n---\nbody\n"` — a second frontmatter block prepended, the author's block demoted into the body. Round-trip identity is `true`, and idempotence is `true`, on that output. **Only locality catches the BOM bug, and it catches it on the first draw, because the longest common prefix of input and output is zero bytes while the writer claims an insert inside the block.** This is the same cancellation the source comment already confesses to: set and delete undo each other, so a round-trip oracle sees nothing. Post-fix, all four properties hold.

OffsetMap: a uniform generator (`i % 7` emoji, `i % 3` accented, lengths 400–2000, 4,966 offsets checked) reports **0 failures against the unfixed code**. `boundaryStraddlingText` reports **600 failures out of 9,363**, first at `pad = 511, i = 513`, `got 518 want 515`, delta exactly `+3`; the fixed code reports 0 over the same 9,363. That gap is the entire argument for biased generators, and it is LR#68 restated: a property that has never failed against the unfixed code has not been shown to cover the bug.

Zero-indent sequence: no property catches it, and that is correct. The writer's `return src` on a bare top-level line is the specified behaviour; the defect is that the specification is wrong for 83.01% of real frontmatter. Properties encode the contract, so they cannot find a wrong contract. This is where the corpus is the only instrument, and it is why §78.7 keeps both.

Bare CR, run against the shipped code today: input `'---\rtitle: A\rslug: old\r---\rbody\r'`, output `'---\nslug: new\n---\n\n---\rtitle: A\rslug: old\r---\rbody\r'` [measured]. `FM_OPEN` is `/^---[ \t]*(\r?\n)/` and does not match a bare CR, so the no-frontmatter branch prepends a block — byte-for-byte the BOM failure mode, unfixed, and reachable from any file pasted out of a legacy tool. P2 fails on it immediately. Two neighbours fall out of the same generator: `inventory('# H\r\r```js\rcode\r```\r\rpara\r')` returns an **empty map** while `skipRegions` on the same string returns `[[5, 19]]` — P8 refuted [measured] — and `shapeGate` reports `lines: 1` for that seven-line document, so `MAX_LINES` is blind to CR — P9 refuted [measured].

### 78.6 Shrinking, seeds, and regression promotion

fast-check shrinks integers toward zero and arrays toward empty, so a `.map()`-built document shrinks through its *record fields*, not its bytes. That is the design constraint: build documents from small structured parts so the shrunk counterexample reads as `{ bom: true, fm: ['a: 1'], eol: '\r' }` rather than 3 KB of noise. Never generate a document with `fc.string()` and post-process it — the shrinker then has nothing to bite on.

```ts
fc.configureGlobal({
  numRuns: Number(process.env.FC_RUNS ?? 300),
  seed: Number(process.env.FC_SEED ?? 0x5EED0000),   // fixed in CI, overridable locally
  endOnFailure: true,
  interruptAfterTimeLimit: 20_000,
  markInterruptAsFailure: true,
})
```

CI pins the seed so a red build is reproducible from the log line alone; a nightly job runs with `FC_SEED=$RANDOM FC_RUNS=5000` and files any counterexample. On failure, fast-check prints `seed`, `path` and the shrunk counterexample. The shrunk value — not the seed — is promoted by hand into `test/props/regressions.ts` and replayed first, deterministically, before any random run:

```ts
test.prop([document, safeKey, scalar], { examples: REGRESSIONS.spliceLocality })('P2 locality', ...)
```

Decision: regressions are stored as literal counterexamples, not as `{ seed, path }` pairs. Rejected alternative: replaying by seed, which is what the fast-check docs make easiest. Rejected because a seed reproduces a failure only against the exact generator that produced it, so the first time anyone edits `document` the entire regression set silently stops testing anything — the LR#59 field-mismatch class, wearing a different hat. Cost of being wrong: literals are more verbose. Falsified if a promoted literal ever stops compiling against the arbitrary's type, which is a compile error, which is the point.

### 78.7 Corpus × properties

The corpus stops being a fidelity oracle and becomes a *seed source*. Same properties, real inputs:

```ts
// test/props/corpus-seeded.property.test.ts — skipped unless _vendor/ is present
const CORPUS = loadCorpus()   // 8,513 strings, or [] when the vendor tree is absent
test.skipIf(CORPUS.length === 0).prop([fc.constantFrom(...CORPUS), safeKey, scalar])('P1∧P2∧P3 on real files', ...)
```

That combination is what surfaced the 21 leading-newline round-trip failures in §78.2: neither instrument alone reports them. The corpus alone has no oracle beyond "does not throw"; the properties alone never generate a file that opens with a blank line and no frontmatter. The pairing does.

`npm run corpus` stays the byte-pin gate. The property files degrade to skipped, never failed, when `_vendor/` is absent — the tree is gitignored third-party content and a fresh clone does not have it.

### 78.8 Suite specification and CI budget

| File | Properties | `numRuns` | Budget |
|---|---|---|---|
| `test/props/splice.property.test.ts` | P1–P5b, P12 | 300 | 2.4 s |
| `test/props/offsets.property.test.ts` | P6, P7 (+ `boundaryStraddlingText` at 1,000 runs) | 300 / 1,000 | 1.8 s |
| `test/props/constructs.property.test.ts` | P8, P9, P10, P11 | 300 | 1.6 s |
| `test/props/corpus-seeded.property.test.ts` | P1, P2, P3 over 8,513 real files | full sweep | 1.2 s |
| **Added total** | 12 | — | **7.0 s** |
| Existing engine suite (`test/mdmax` + `test/share/frontmatter-splice`) | 320 tests, 11 files | — | 1.34 s [measured] |
| **Gate** | — | — | **fail the build above 12 s** |

Derivation of the 7.0 s: the corpus sweep of two splices plus a locality diff over 8,513 real files (mean 2,237 B) ran in 309 ms [measured] — 36.3 µs per case; three properties over the same set is ≈1.2 s with assertion overhead [derived]. For generated cases, 12 properties × ~350 mean runs ≈ 4,200 draws; structured-record generation dominates splice execution and is taken at 250 µs per draw [inference], giving ≈1.1 s, tripled to 3.3 s for shrink attempts and the 1,000-run boundary sweep, plus ≈2.5 s of vitest transform and import for four new files [derived from the measured 818 ms transform across 11 files]. The generation constant is the soft number here; it is not load-bearing because the gate is a wall-clock assertion, not a prediction — if generation is slower than assumed, CI says so on the first run and `FC_RUNS` absorbs it.

Rejected alternative for the budget: running the properties only in the nightly job to keep the pull-request loop under two seconds. Rejected because three of the four shipped defects were byte-destructive and two of them reached `main`; a gate that runs after merge is a report, not a gate. Cost of being wrong: about seven seconds per pull request. Falsified if the property files' p95 wall clock exceeds 12 s for two consecutive weeks without a counterexample, at which point the corpus-seeded file — the slowest and the most redundant with `npm run corpus` — moves to nightly first.
