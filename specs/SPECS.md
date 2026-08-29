---
budget: 2000
budget_covers: Orientation through Index
updated: 2026-08-29
---

# SPECS

The contract layer. One spec per **contract**, never per file of code.

## Orientation

- **`id` is the path**, minus `specs/` and `.md`. `render/carrier` is `specs/render/carrier.md`. There is no lookup table to rot.
- **`state:` is written by the harness, never by hand.** A hand-written `state: verified` is itself a drift finding. See `_schema/states.md`.
- **`verified` is the only state that may be cited publicly.** A number published from an unverified spec is a claim with no gate behind it.
- **Invariants are `rule → failure mode → executable check`.** All three columns or delete the row; an invariant with no check is a wish.
- **Line numbers are banned in spec bodies.** Cite a path plus a verbatim pattern; the line moves within the week.
- Run `npm run spec` before every commit that touches `specs/` or `src/modules/`.

## Invariants of the spec system itself

| # | Rule | Enforced by |
|---|---|---|
| 1 | Two specs may never `governs:` the same path — two owners is no owner | `spec-report.mjs` → `overlap` |
| 2 | A `governs` glob matching zero files is a finding, not an empty set | → `ghost` |
| 3 | A spec claiming `verified` without a `red_proof` is refused | → `unproven` |
| 4 | A superseded spec is marked, never deleted | → `state-unsupported` |
| 5 | Gates execute; a gate that greps source is a proxy and must say so | review |
| 6 | Assert floors and hard zeros, never equalities — adding a spec must not read as a regression | `MIN_SPECS` floor |

## Index

| id | state | track | one line |
|---|---|---|---|
| `engine/splice-writer` | draft | R0 | The byte-preservation contract: locate the range, replace only those bytes, refuse rather than guess |
| `render/carrier` | draft | T2 | How a render profile is written on disk: callout for prose, fence for data, nothing else |
| `engine/nf-001-zero-indent-sequence` | draft | R0 | A zero-indent YAML block sequence must not refuse the write — 83% of foreign refusals |
| `engine/nf-003-bare-cr-fence` | draft | R0 | A bare-CR fence prepends a second frontmatter block — set-destructive, and the corpus cannot see it |

## Navigate

- Schema: `_schema/spec.schema.json` · States: `_schema/states.md`
- Gate: `node specs/harness/spec-report.mjs` (add `--id <id>` for one spec, `--json` for machine output)
- Corpus gate: `node scripts/corpus-foreign.mjs verify`
- Source of record: `docs/FRONTMATTER-PRD-2026-08-29.md` — cite it by section number, never by heading text.
