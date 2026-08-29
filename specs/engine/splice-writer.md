---
spec: 1
id: engine/splice-writer
title: The splice writer — the byte-preservation contract
type: engine
state: draft
track: R0
prd_file: docs/FRONTMATTER-PRD-2026-08-29.md
prd_sha256: "4d80021f97d8390cb33cd09e99ade24fc409ddc934b35148bcb36841ff8d0dea"
prd_sections: ["7.1", "5", "6.1", "15"]
governs:
  - src/modules/share/domain/splice-frontmatter.ts
verify:
  - node scripts/corpus-foreign.mjs verify
  - node specs/harness/spec-report.mjs --id engine/splice-writer
corpus: test/corpus/foreign
budget: 2400
owner: sagnik
updated: 2026-08-29
commit: d714fb5
x:
  ownership_rule: >-
    This spec OWNS the writer source file. Defect specs (nf-001, nf-003, ...) own their red
    proofs and depend on this one. One file, one owner — otherwise two specs go stale each
    believing the other is current.
---

# The splice writer

## Contract

Locate the byte range of the target, replace exactly those bytes, and leave every other byte of the file bit-identical. Never regenerate the document from a parse tree. When the range cannot be located unambiguously, **return the input unchanged** and say why. Refusal is a correct outcome; guessing is not. This is the single guarantee the product is sold on, and every render profile, every agent edit and every publish writes through it.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | Bytes outside the target range are bit-identical after any write | The failure we measured in all three competitor teardowns: comments, anchors, spacing and reference links disappear | corpus run: `changed = 0` |
| 2 | The writer never throws; it returns the input or a spliced result | A throw in a write path becomes data loss at the call site | corpus run: `threw = 0` |
| 3 | An unresolvable target is **refused**, never appended and never guessed | Appending a second key, or a second frontmatter block, is silent structural corruption | refusal-path tests |
| 4 | Line-ending style and any BOM are preserved exactly | A normalising "fix" rewrites every line of the file | byte-diff on untouched lines |
| 5 | Every operation is asserted **independently**; no oracle may test only set-then-delete | Two operations sharing a defect cancel it out — this is how NF-3 stayed invisible | oracle shape, enforced by `engine/nf-003-bare-cr-fence` |
| 6 | There is **one** splice implementation in the repo | Two writers means the guarantee holds in one of them | `grep -c` for a second key-scanner is a PROXY check and must be labelled one |

## Interface

- Source: `src/modules/share/domain/splice-frontmatter.ts` (13,324 bytes).
- Key addressability: `SAFE_KEY = /^[A-Za-z0-9_.$-]+$/`. Note it excludes a space, which is why `date created` is unaddressable — that is **NF-4**, a design task about Unicode key equality, not a regex widening.
- Fence detection: `FM_OPEN = /^---[ \t]*(\r?\n)/` — see **NF-3**.
- Continuation walk: the branch `} else if (text !== '' && !indented && !/^#/.test(text)) {` — see **NF-1**.
- Target destination per the wiring plan: this becomes MDMAX **seam 3**, replacing the single-key scanner so that kanban drag, calendar drag, `land()` and share all write through one implementation.

## Behaviour

| Operation | Guarantee |
|---|---|
| `set` on an existing key | Only that key's value bytes change |
| `set` on an absent key | Insert at a defined position, or refuse — never append blindly |
| `delete` | The key's span and its continuation lines are removed; nothing else |
| `rename` | Refused when the new key would need quoting |
| Any operation on unparseable frontmatter | Refused, file returned unchanged |

## Refusals

Every refusal names what was **not** changed. See the refusal-UX spec when it lands for the message template; until then the rule is: state what happened, state that the file is unchanged, state why, and give the user one next step.

## Verification

- Standing gate: `node scripts/corpus-foreign.mjs verify` (8,513 files, byte-pinned, exits 1 on any drift) followed by the writer run over the frontmatter-bearing subset.
- Exit condition for R0: **refused ≤ 2, changed = 0, threw = 0.**
- Assert a floor and hard zeros, never an equality — adding corpus coverage must never read as a regression.
- **The corpus cannot prove everything.** Measured 2026-08-29 across all 8,513 files: zero bare-CR fences, zero CRLF fences, zero BOMs. Defects in those shapes need synthetic fixtures; a green corpus run says nothing about them.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-08-29 — This spec owns the writer file; defect specs own their red proofs and depend on it. Introduced because the gate correctly refused two specs claiming the same path.
- 2026-08-29 — Correctness defects (NF-3) sequence ahead of availability defects (NF-1), even when rarer.

## Open

- NF-4's key-equality question is unanswered and blocks seam 3: does `café` in NFC equal `café` in NFD for addressing purposes? Both answers are defensible; the file's own comment flags it.

## Next

    node scripts/corpus-foreign.mjs verify
    node specs/harness/spec-report.mjs --id engine/splice-writer
