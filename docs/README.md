---
mode: explanation
updated: 2026-09-09
verified_against: e318ab3
---

# frontmatter — documentation index

| Field | Value |
|---|---|
| Analysis date | 2026-09-09 |
| Commit analysed | `e318ab3` — *feat(decisions): all fifteen areas rewritten* (branch `engine/plan-and-diagnostics`) |
| Method | Nine agents on disjoint files, each required to read the code before writing, plus two documents written by the coordinator. Every quantitative claim comes from a command recorded in the document that makes it. |
| Analyst | Claude (Opus 5), session 2e90ab3b |

<!-- docs-verified-against: e318ab3 -->

**Not done in this pass:** no production probe, no live boot of the desktop build, no call
requiring a credential, no comparison against the sibling `sgnk-md` repo, and no re-measurement
of the NF-1 and NF-3 engine defects. Anything resting on those is marked `**unverified**` where
it appears.

## Start here

`docs/MAP.md` is the routing document — what to read for which question, and what never to open.
It predates this set and still governs the older material.

**If you are new**, read in this order:

1. **`00-EXECUTIVE-SUMMARY.md`** — what this is, what state it is really in, what to worry about
2. **`PRODUCT-BRIEF.md`** — the current plan, v15, 560 lines
3. **`13-TECH-DEBT.md`** — what is owed, sequenced, re-verified at this commit
4. **`10-LOCAL-SETUP.md`** — how to run it

## The set

### Product and domain
| File | What it answers |
|---|---|
| `00-EXECUTIVE-SUMMARY.md` | What frontmatter is and what state it is in |
| `01-PRODUCT-AND-DOMAIN.md` | The domain language, the entities, the core loop |
| `15-GLOSSARY.md` | Terms a newcomer will not know, including MDMAX, SAFE_KEY, splice, carrier |

### The system
| File | What it answers |
|---|---|
| `03-DATA-MODEL.md` | Every persisted shape and where it lives |
| `04-API-REFERENCE.md` | All twelve route handlers, and `src/proxy.ts` |
| `05-FRONTEND-SPEC.md` | Route groups, the editor, state management constraints |
| `06-BACKEND-SPEC.md` | Module by module, and the composition root |
| `07-INTEGRATIONS.md` | Every third party and what breaks without it |
| `17-CODEMAP.md` | Every file, one line each |

### Running and shipping
| File | What it answers |
|---|---|
| `09-ENVIRONMENT.md` | Every variable, by name only |
| `10-LOCAL-SETUP.md` | Clone to running, with the traps |
| `11-DEPLOYMENT.md` | How the app ships, how the decisions site ships, how to roll back |
| `29-RUNBOOK.md` | Symptom to cause |

### State of the thing
| File | What it answers |
|---|---|
| `12-SECURITY-REVIEW.md` | Findings with severity, including open inherited items |
| `13-TECH-DEBT.md` | What is owed, sequenced, with the command that verified each item |
| `14-TESTING.md` | What is covered and what deliberately is not |

### Research and decisions
| File | What it answers |
|---|---|
| `PRODUCT-BRIEF.md` | The plan, v15 |
| `GAPS-2026-09-08.md` | The gap register and the adversarial round |
| `research/2026-09-09/BRIEFING.md` | Nine untapped market seams, researched 2026-09-09 |
| `research/2026-09-09/VERIFIED-2026-09-09.md` | What was opened and checked by hand — **overrides the briefing where they disagree** |
| `../decisions/v2/` | 201 open decisions, one JSON file per area |

## Two rules for reading this set

**Do not open the large documents.** `FRONTMATTER-PRD-v2-2026-08-29.md` is 760 KB,
`FRONTMATTER-RECORD.md` is 2.1 MB, `FRONTMATTER-COMPLETE-RECORD-2026-08-30.md` is 3.4 MB, and
`ENGINE.md`, `CRITIQUE.md` and `DEV-PLAN.md` are around 250 KB each. Use `grep -n` for the term
and `sed -n 'A,Bp'` for the surrounding lines. A single read of any of them ends a session.

**Where two documents disagree, the newer provenance stamp wins**, and the one with a
`verified_against` marker outranks one without. If a fact lives in two places, one of them is
wrong — `MAP.md` names which files are superseded.
