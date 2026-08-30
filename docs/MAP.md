---
budget: 2200
budget_covers: Tiers through Routing
updated: 2026-08-30
---

# MAP — the referential architecture

**What to read, when, and what never to read.** This file is the index. It carries no content of its own; everything here is a pointer. If a fact lives in two places, one of them is wrong — see §Canonical.

## The rule

> **Never open a lower tier when a higher tier answers the question.** Tier 3 is 374,866 words. Reading it to answer a Tier 1 question is how a context window dies.

## Tiers

| Tier | What | Read it when | Cost |
|---|---|---|---|
| **0** | `AGENTS.md` | Always. Every session, first. | ~2k tok |
| **0** | `docs/MAP.md` (this file) | Always, with AGENTS.md | ~2k tok |
| **1** | `docs/FRONTMATTER-PRD-v2-2026-08-29.md` | Starting any product work — why, what, for whom | 61 sections; read the section, not the file |
| **1** | `docs/DEV-PLAN.md` | Starting any engineering work — stack, layers, ops | read the section |
| **1** | `docs/ENGINE.md` | Touching MDMAX or the splice contract | read the section |
| **1** | `specs/SPECS.md` | Before implementing anything | ~1.3k tok, budget-enforced |
| **2** | `specs/<area>/<id>.md` | Implementing that one contract | one file, ~1–2k tok |
| **2** | `docs/adr/NNNN-*.md` | Asking "why is it this way" | one file |
| **3** | `docs/research/agent-reports-*/**` | **Only** to verify a claim you are about to publish | 105 files, 374,866 words |

## Routing — task to artifact

| If you are about to… | Read, in order | Then |
|---|---|---|
| Fix an engine defect | `specs/engine/<id>.md` → `docs/ENGINE.md` §audit | Red proof first |
| Build a render profile | `specs/render/carrier.md` → `specs/render/<profile>.md` | Carrier decision is settled; do not re-litigate |
| Touch the splice writer | `specs/engine/splice-writer.md` | It owns that file; defect specs own their proofs |
| Add an API endpoint | `docs/DEV-PLAN.md` §API → `specs/protocol/` | Idempotency + rate class are required fields |
| Change the schema | `docs/DEV-PLAN.md` §Data | Expand-migrate-contract; never rewrite a user file |
| Work on auth or permissions | `docs/DEV-PLAN.md` §Auth | GitHub App, never OAuth `repo` scope |
| Build any user-facing surface | PRD §14 screens → PRD §18 simplicity | Empty state is the next action, never an illustration |
| Touch sync or conflicts | `docs/DEV-PLAN.md` §Live → PRD §31 | Never a CRDT for document bytes |
| Price, package, or bill | PRD §23–25, §45 | ₹15,000/txn is an architectural constant |
| Write anything public | **PRD §58 first** | Lists what may and may not be claimed |
| Quote any number | **PRD §57 first** | Twenty numbers went stale; re-derive at write time |
| Claim a lane is done | `specs/_schema/states.md` | Only the harness writes `verified` |

## Canonical — one fact, one home

A fact stated twice will drift. These are the homes; everywhere else cross-references.

| Fact | Lives in |
|---|---|
| The projection law | PRD §5 |
| The splice contract | `specs/engine/splice-writer.md` |
| The carrier decision | `specs/render/carrier.md` |
| Corpus results and refusal rate | PRD §7.1, corpus at `test/corpus/foreign/` |
| Sync decision and its disqualifications | PRD §31.1 |
| Stack choices and costs | `docs/DEV-PLAN.md` |
| Engine internals | `docs/ENGINE.md` |
| What may not be published | PRD §58 |
| Stale numbers | PRD §57 |

## Superseded — do not read, do not cite

Kept for provenance only. Reading them will give you an answer that was true once.

| File | Superseded by |
|---|---|
| `docs/FRONTMATTER-MASTER-PLAN-2026-08-28.md` | PRD v2 |
| `docs/FRONTMATTER-PRD-2026-08-29.md` (v1.1) | PRD v2 |
| `docs/FRONTMATTER-THE-PLAN-2026-08-29.md` | PRD v2 |
| `docs/FRONTMATTER-BUILD-PLAN-2026-08-29.md` | PRD v2 §28, `docs/DEV-PLAN.md` |
| `docs/FRONTMATTER-DECISIONS-2026-08-29.md` | PRD v2 §57 |
| `docs/FRONTMATTER-PRODUCT-PLAN.md` | PRD v2 |
| `docs/FRONTMATTER-COMPLETE-RECORD-*.md` | Archive: PRD + every report concatenated. Not for reading |

## Gates

```bash
npm run spec      # contract gate — 0 errors required
npm run corpus    # 8,513 files, byte-pinned, exits 1 on one changed byte
npm run verify    # typecheck → lint → test → build → arch → spec
```

## The four rules that override everything

1. **Red proof before green.** A test on a rare fault proves nothing until it fails against unfixed code. If you cannot make it fail, say the test does not cover the bug.
2. **Refuse rather than guess.** Returning the input unchanged is a correct outcome. Guessing is not.
3. **Re-derive every number at write time.** PRD §57 is the list of what happens otherwise.
4. **Agents propose, the founder merges.** `git rev-parse HEAD` before and after every agent run, reconciled. The instruction not to commit is advisory; the reconciliation is the gate.
