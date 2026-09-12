---
budget: 2200
budget_covers: Tiers through Routing
updated: 2026-08-31
---

# MAP — the referential architecture

**What to read, when, and what never to read.** This file is the index. It carries no content of its own; everything here is a pointer. If a fact lives in two places, one of them is wrong — see §Canonical.

## The rule

> **Never open a lower tier when a higher tier answers the question.** Tier 3 is 374,866 words. Reading it to answer a Tier 1 question is how a context window dies.

## If you are here to decide what to build

# → Read `docs/DECIDE.md`. Twenty minutes. Nothing else.

It is the only document written as a synthesis rather than assembled from parts, and it leads with
the two beliefs the research refuted. Everything below is what it cites.

Then **`docs/PRODUCT.md` §97** It is the operating manual: what is already settled and may
not be reopened, the open decisions in dependency order, a session agenda, and a copy-pasteable
brief for handing this whole record to a fresh AI assistant.

| The question on the table | Open |
|---|---|
| **What is this product, in one paragraph?** | **`THESIS.md` §104** |
| What do we generate, and what is the kickoff prompt we hand the user? | `THESIS.md` §99 |
| Do we run the user's own Claude/OpenAI key, and where does it live? | `THESIS.md` §100 |
| How do we reach their repo and their folders? | `THESIS.md` §101 |
| Who is the wedge user we could email ten of this week? | `THESIS.md` §102 |
| Is this feature allowed to exist? | `THESIS.md` §103, the admission test |
| What does the AI actually cost us, and what can the free tier have? | `PRODUCT.md` §90 |
| Offline app, online app, or both — and how does it reach the user's files? | `PRODUCT.md` §91 |
| What does a user *do* with this to run their own product work? | `PRODUCT.md` §92 |
| Credits, quotas, and what a refusal looks like | `PRODUCT.md` §93 |
| Every feature ever proposed, including the ones we refused | `PRODUCT.md` §94 |
| Where the MVP line falls, and what gets argued back in | `PRODUCT.md` §95 |
| How to attack all of it — product, D2C, B2B, distribution, capacity | `PRODUCT.md` §96 |
| What happens when an incumbent moves | `BUSINESS.md` §88 |
| Is this number trustworthy? | **`VERIFICATION.md` §89, always** |

## Tiers

| Tier | What | Read it when | Cost |
|---|---|---|---|
| **0** | **`docs/DECIDE.md`** | **Deciding anything. The synthesis, and the refutations.** | **~4k tok** |
| **0** | `AGENTS.md` | Always. Every session, first. | ~2k tok |
| **0** | `docs/MAP.md` (this file) | Always, with AGENTS.md | ~2k tok |
| **1** | **`docs/THESIS.md`** | **"What IS this?" — the fusion, the artefact factory, the context pack, who it is for** | **§98–104; §104 is the one page** |
| **1** | **`docs/PRODUCT.md`** | **"What are we building?" — AI cost, offline vs online, every feature, the MVP line, how to attack it** | **§90–97; start at §97** |
| **1** | `docs/FRONTMATTER-PRD-v2-2026-08-29.md` | Starting any product work — why, what, for whom | §0–66; read the section, not the file |
| **1** | `docs/DEV-PLAN.md` | Starting any engineering work — stack, layers, ops | local §1–13 |
| **1** | `docs/ENGINE.md` | Touching MDMAX or the splice contract | §67–80 |
| **1** | `docs/BUSINESS.md` | Pricing, churn, refunds, comms, distribution, plugins, the war-game | §81–88 |
| **1** | `docs/VERIFICATION.md` | **Before quoting any number.** Every load-bearing claim, opened | §89 |
| **1** | `docs/REFERENCES.md` | Choosing what to read, copy, or buy before building | local §1–7 |
| **1** | `specs/SPECS.md` | Before implementing anything | ~1.3k tok, budget-enforced |
| **2** | `specs/<area>/<id>.md` | Implementing that one contract | one file, ~1–2k tok |
| **2** | `docs/adr/NNNN-*.md` | Asking "why is it this way" | one file |
| **3** | `docs/research/agent-reports-*/**` | **Only** to verify a claim you are about to publish | 105 files, 374,866 words |

## How to cite a section

Two numbering runs exist, and mixing them sends a reader to the wrong document.

| Run | Files | Cite as |
|---|---|---|
| **Global §0–104** | PRD (§0–66) · `ENGINE.md` (§67–80) · `BUSINESS.md` (§81–88) · `VERIFICATION.md` (§89) · `PRODUCT.md` (§90–97) · `THESIS.md` (§98–104) | a bare `§74` — it resolves to exactly one place |
| **Local** | `DEV-PLAN.md` (§1–13) · `REFERENCES.md` (§1–7) | **always file-qualified**: `DEV-PLAN §5`, `REFERENCES §3` |

The three global-run files were written as one continuous document and split by subject, so
every cross-reference an agent wrote still resolves. `docs/build/assemble-tree.mjs` asserts
that their numbers survive assembly unchanged and exits 1 if any would be renumbered.

## How the tree is built

Tier-1 files are **derived**, not hand-edited. The sources are the agent reports under
`docs/research/`; `docs/build/build-tree.mjs` projects them into the files above.

```bash
npm run tree      # rebuild DEV-PLAN / ENGINE / BUSINESS / REFERENCES from the reports
npm run doc       # assemble the whole tree into one printable markdown document
```

If a section is wrong, fix the report and re-run — editing the derived file by hand means
the next run silently reverts you. That is the projection law (PRD §5) applied to our own
documentation, and it is deliberate.

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
| Change a price or a plan | `BUSINESS.md` §83 → PRD §45 | ₹15,000/txn is an architectural constant |
| Tell users anything at all | `BUSINESS.md` §81 | There is no channel yet; that is a defect, not a gap |
| Argue about plugins | `BUSINESS.md` §86 | The ban and the community moat are in genuine tension |
| Quote any number | **PRD §57 first** | Twenty numbers went stale; re-derive at write time |
| Claim a lane is done | `specs/_schema/states.md` | Only the harness writes `verified` |
| Argue about a feature | `PRODUCT.md` §94 → §96 | §94 says whether anyone asked for it; §96 is how to attack it |
| Decide what ships first | `PRODUCT.md` §95 | The cut line is the section, not the feature list |
| Spend money on inference | `PRODUCT.md` §90 | The free tier has an arithmetic limit, not a policy one |
| Propose a new feature | `THESIS.md` §103 first | It must name the person who uses it and how often, or it is cut |
| Explain the product to anyone | `THESIS.md` §104.1 | One paragraph, no adjectives |

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
| Engine internals | `docs/ENGINE.md` §67–80 |
| Churn, refunds, pricing experiments, comms | `docs/BUSINESS.md` §81–87 |
| What to read / copy / buy | `docs/REFERENCES.md` |
| What may not be published | PRD §58 |
| Stale numbers | PRD §57 |
| Whether a claim was ever sourced | `VERIFICATION.md` §89 |
| Feature list, MVP staging, cut lines | `PRODUCT.md` §94–95 |
| AI unit economics and the credit mechanism | `PRODUCT.md` §90, §93 |
| Offline/online and local file access | `PRODUCT.md` §91 |
| What the product IS, in one page | `THESIS.md` §104 |
| The artefact catalogue and the kickoff prompt | `THESIS.md` §99 |
| Provider keys, MCP, and the CLI-agent question | `THESIS.md` §100 |
| GitHub App scopes and the permission ladder | `THESIS.md` §101 |
| Whether a proposed feature is allowed | `THESIS.md` §103 |

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
npm run tree      # rebuild the derived Tier-1 docs from the agent reports
npm run doc       # assemble the tree into one printable document, with integrity gates
npm run record    # prove the assembled record carries every tree file, line for line
npm run pdf       # tree -> refs -> assemble -> record -> render, in that order
```

## The four rules that override everything

1. **Red proof before green.** A test on a rare fault proves nothing until it fails against unfixed code. If you cannot make it fail, say the test does not cover the bug.
2. **Refuse rather than guess.** Returning the input unchanged is a correct outcome. Guessing is not.
3. **Re-derive every number at write time.** PRD §57 is the list of what happens otherwise.
4. **Agents propose, the founder merges.** `git rev-parse HEAD` before and after every agent run, reconciled. The instruction not to commit is advisory; the reconciliation is the gate.
