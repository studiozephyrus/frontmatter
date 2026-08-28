# Spec states

Six states. Every forward transition has a **mechanical entry condition that is checked, not asserted**. Only `specs/harness/spec-report.mjs` writes `state:` forward. A hand-written `state: verified` is itself a drift finding.

```
draft ──► ready ──► in-progress ──► implemented ──► verified
  │         │            │               │              │
  └─────────┴────────────┴───────────────┴──────────────┴──► superseded
```

| Transition | Entry condition — executed, never asserted |
|---|---|
| `draft → ready` | Frontmatter validates against `spec.schema.json`; `governs` and `verify` are both non-empty; every `prd_sections` anchor resolves in `prd_file` |
| `ready → in-progress` | At least one `governs` glob matches at least one file |
| `in-progress → implemented` | Every `governs` glob matches ≥1 file, and `npm run verify` is green |
| `implemented → verified` | Every `verify:` command **executed** with exit 0, **and** `red_proof` exists and fails against the unfixed code |
| `verified → implemented` | **Automatic demotion** when any governed file's sha changes, or `prd_sha256` no longer matches. The harness demotes; a human cannot re-assert |
| `* → superseded` | `superseded_by:` names a live id. **Deleting a spec file is forbidden** — the deleted spec is the one you need during the postmortem |

## Two rules that are not negotiable

**`verified` is the only state that may be cited publicly.** A fidelity number published from an `implemented` spec is a claim without a gate behind it. R0 precedes marketing any number.

**A red proof is required for `verified`.** A test on a rare fault proves nothing until it fails against the unfixed code. If you cannot make it fail, the test does not cover the bug — say so in `## Open` rather than reporting a pass.

## Why demotion is automatic

Because the alternative is a spec that claims `verified` about code that has since changed, which is the same failure as a green gate that cannot see. The harness recomputes governed-file hashes on every run; drift demotes without asking.
