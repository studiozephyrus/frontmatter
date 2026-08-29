---
spec: 1
id: engine/nf-001-zero-indent-sequence
title: NF-1 — a block sequence at zero indentation must not refuse the write
type: engine
state: draft
track: R0
prd_file: docs/FRONTMATTER-PRD-2026-08-29.md
prd_sha256: 4d80021f97d8390cb33cd09e99ade24fc409ddc934b35148bcb36841ff8d0dea
prd_sections: ["24", "7.1", "26.1"]
governs:
  - test/corpus/foreign/nf-001-red-proof.test.ts
depends_on: [engine/splice-writer]
verify:
  - node scripts/corpus-foreign.mjs verify
  - node specs/harness/spec-report.mjs --id engine/nf-001-zero-indent-sequence
defect_id: NF-1
corpus: test/corpus/foreign
red_proof: test/corpus/foreign/nf-001-red-proof.test.ts
budget: 2200
owner: sagnik
updated: 2026-08-29
commit: 5e0d5a5
x:
  blast_radius: 6613 of 6614 foreign refusals, 83.10% aggregate across 7,959 files
---

# NF-1 — zero-indent block sequence

## Contract

A YAML block sequence written at column zero is spec-valid, is PyYAML's default output shape, and is idiomatic in real vaults. The splice writer currently refuses every file containing one. It must instead recognise a `-` item at column zero as a continuation of the preceding `key:` line, so the key's span extends across its items. This is an **availability** fix, not a corruption fix: nothing is currently written wrongly, it is simply not written at all.

```yaml
tags:
- alpha
- beta
```

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | A `-` item at column 0 following a `key:` line belongs to that key's span | The writer refuses the file, so publish silently never happens | `test/corpus/foreign/nf-001-red-proof.test.ts` |
| 2 | The fix changes **availability only**: bytes outside the target key stay identical | An availability fix that rewrites neighbouring bytes is a corruption bug wearing a fix's clothes | corpus verify: `changed = 0` |
| 3 | A file the writer still cannot address is **refused**, never guessed | Guessing YAML is how the competitors lose comments and anchors | `test/render/carrier/degrade.test.ts` pattern, applied to the writer |
| 4 | Post-fix refusals over the pinned corpus are **≤ 2 of 7,959** | If the residual is above 2, NF-1 was never one bug and the estimate is wrong | corpus runner, reported count |
| 5 | The corpus is re-hashed before the gate runs | A corpus that drifted is not evidence; the clone already drifted +2 once | `node scripts/corpus-foreign.mjs verify` exits 0 |

## Interface

- Site: `src/modules/share/domain/splice-frontmatter.ts`, the branch
  `} else if (text !== '' && !indented && !/^#/.test(text)) {` whose body is `return src`.
  A `- alpha` line is non-empty, un-indented and not a comment, so it lands here and the
  whole write is refused. Cite the pattern, not the line — it was line 197 on 2026-08-29.
- Related but **separate** specs, do not fix them here:
  - `FM_OPEN = /^---[ \t]*(\r?\n)/` misses a bare `---\r` → **NF-3**, set-destructive.
  - `SAFE_KEY = /^[A-Za-z0-9_.$-]+$/` excludes a space, so `date created` is unaddressable → **NF-4**.

## Behaviour

| Input shape | Today | After NF-1 |
|---|---|---|
| `tags:\n- a\n- b` | refuse whole write | key span covers both items; splice proceeds |
| `tags:\n  - a` (indented) | already works | unchanged |
| `tags: [a, b]` (flow) | already works | unchanged |
| `tags:\n- a\n]` (flow close at col 0) | refuse | still refused — that is **NF-2** |

## Refusals

| Condition | Message |
|---|---|
| Key still unaddressable after the fix | "Refused: could not locate `<key>` safely. File unchanged." |
| Frontmatter does not parse strictly | "Cannot write to `<path>`: frontmatter did not parse. File unchanged." |

## Verification

- **Red proof first.** `test/corpus/foreign/nf-001-red-proof.test.ts` must fail against the
  current writer before it may certify anything. The assertion is a *set* operation on a
  real corpus file with a zero-indent sequence — set-then-delete would cancel out and hide
  the defect, which is exactly how NF-3 stayed invisible.
- Gate: `node scripts/corpus-foreign.mjs verify` (8,513 files, exit 1 on any drift) then the
  writer run over the 7,959 frontmatter-bearing subset.
- Exit condition, PRD §24: refused ≤ 2 of 7,959, **changed = 0, threw = 0**.
- Assert a floor and a hard zero, never an equality: `refused <= 2 && changed == 0 && threw == 0`.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-08-29 — Corpus pinned by sha256 manifest and upstream commit before any fix, because
  the measurement is the deliverable and the clone had already drifted +2 files.
- 2026-08-29 — NF-1, NF-2, NF-3 and NF-4 are four specs, not one. They share a file and
  nothing else; bundling them would make the red proof unattributable.

## Open

- The "recovers 99.98%" figure is an inference from bucketing refusal causes, **not a
  measured result of the patched writer**. It must be re-derived after the fix, and the
  PRD's use of it should be downgraded until then.

## Next

    node scripts/corpus-foreign.mjs verify
    node specs/harness/spec-report.mjs --id engine/nf-001-zero-indent-sequence
