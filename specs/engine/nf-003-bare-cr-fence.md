---
spec: 1
id: engine/nf-003-bare-cr-fence
title: NF-3 — a bare-CR frontmatter fence must not prepend a second block
type: engine
state: draft
track: R0
prd_file: docs/FRONTMATTER-PRD-2026-08-29.md
prd_sha256: "4d80021f97d8390cb33cd09e99ade24fc409ddc934b35148bcb36841ff8d0dea"
prd_sections: ["24", "25", "26.1"]
governs:
  - test/corpus/foreign/nf-003-red-proof.test.ts
verify:
  - node specs/harness/spec-report.mjs --id engine/nf-003-bare-cr-fence
defect_id: NF-3
corpus: test/corpus/foreign
red_proof: test/corpus/foreign/nf-003-red-proof.test.ts
depends_on: [engine/splice-writer, engine/nf-001-zero-indent-sequence]
budget: 2000
owner: sagnik
updated: 2026-08-29
commit: d714fb5
x:
  severity: set-destructive AND oracle-blind — the shipped BOM bug's sibling
---

# NF-3 — bare-CR frontmatter fence

## Contract

A file whose frontmatter fence ends in a bare carriage return (`---\r`, no line feed) is not recognised as an open fence. The writer therefore believes the file has no frontmatter and **prepends a second frontmatter block**, leaving the document with two. This is not an availability defect like NF-1: it **destroys the document's structure on a single set**. It must be fixed, and the round-trip oracle that failed to see it must be fixed with it.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | A fence terminated by a bare CR opens the frontmatter block | Writer prepends a second block; the file now has two | `test/corpus/foreign/nf-003-red-proof.test.ts` |
| 2 | A `set` on such a file produces **exactly one** frontmatter block | Silent structural corruption that survives to publish | count `^---` occurrences after set == 2 (open + close) |
| 3 | The oracle asserts on **set alone**, never on set-then-delete | Set-then-delete cancels the defect out — this is precisely why NF-3 was invisible while NF-1 and NF-2 were found | red proof asserts post-set state only |
| 4 | Line-ending style is preserved: a CRLF file stays CRLF, a CR file stays CR | An "encoding fix" that normalises line endings rewrites every line of the file | byte-diff of untouched lines == 0 |
| 5 | If the fence cannot be resolved unambiguously, **refuse** | Guessing the fence is guessing the document | refusal path test |

## Interface

- Site: `src/modules/share/domain/splice-frontmatter.ts`, the pattern
  `const FM_OPEN = /^---[ \t]*(\r?\n)/`.
  `\r?\n` **requires** a line feed. A bare `\r` (classic Mac line ending, and what some
  exporters emit) does not match, so `FM_OPEN.exec(src)` returns null and the caller takes
  the no-frontmatter branch. Cite the pattern, not the line.
- Same family, already fixed and shipped: the BOM defect, where a byte-order mark before
  the fence broke the same index-0 anchor. The fix there was to treat the BOM as sitting
  *before* the document rather than in it. NF-3 is the line-ending analogue.
- Sibling specs sharing this file and nothing else: `engine/nf-001-zero-indent-sequence`,
  NF-2, NF-4.

## Behaviour

| Input | Today | After NF-3 |
|---|---|---|
| `---\n…\n---\n` (LF) | recognised | unchanged |
| `---\r\n…\r\n---\r\n` (CRLF) | recognised | unchanged |
| `---\r…\r---\r` (bare CR) | **not recognised → prepends a second block** | recognised; one block; CR preserved |
| `﻿---\n…` (BOM) | recognised (already fixed) | unchanged |

## Refusals

| Condition | Message |
|---|---|
| Two frontmatter blocks already present in the input | "Refused: `<path>` has two frontmatter blocks. File unchanged." |
| Fence delimiter cannot be resolved unambiguously | "Refused: could not identify the frontmatter fence. File unchanged." |

## Verification

- **Red proof, and it must be written first.** `test/corpus/foreign/nf-003-red-proof.test.ts`
  performs a **set only** on a bare-CR fixture and asserts the resulting document contains
  exactly one frontmatter block. It must **fail** against the current writer.
- The general lesson this defect teaches, which the oracle now encodes: a round-trip oracle
  that only ever asserts on `set` followed by `delete` is blind to any defect that both
  operations share. Assert on each operation independently.
- Corpus: `node scripts/corpus-foreign.mjs verify` must exit 0 before the gate runs.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-08-29 — NF-3 is sequenced **before** NF-1 despite being rarer, because it is the only
  one of the four that destroys structure rather than refusing to write. Availability defects
  can wait behind correctness defects.
- 2026-08-29 — Fixing the oracle is part of this spec, not a follow-up. A fix whose gate
  cannot see the defect is not a fix.

## Open

**Answered 2026-08-29, and the answer changes how this spec must be verified.**

Measured over all 8,513 pinned corpus files:

| Fence termination | Count |
|---|---|
| LF | 7,969 |
| CRLF | **0** |
| **bare CR** | **0** |
| Files with a BOM | **0** |

So the corpus blast radius of NF-3 is **zero**, and the corpus gate **cannot** red-prove this defect or protect against its regression. That is not a reason to drop the fix — it is the reason the fix needs a **synthetic fixture**, held in-repo and hashed, rather than a corpus row. A rare fault that a corpus never exhibits is exactly the case where a passing suite is the expected result of running it, not evidence of correctness.

Consequences, both now binding:

- The red proof is a hand-built bare-CR fixture, not a corpus file.
- `npm run corpus` passing says **nothing** about NF-3. Do not cite it as coverage.

Also recorded: the corpus holds **7,969** files whose opening `---` fence is LF-terminated, while the PRD reports **7,959** frontmatter-bearing files — a **+10** discrepancy that is probably definitional (a leading `---` that is a thematic break, not frontmatter). Reconcile the definition before either number is published.

## Next

    node scripts/corpus-foreign.mjs verify
    node specs/harness/spec-report.mjs --id engine/nf-003-bare-cr-fence
