### 0. Ground truth — measured on this machine, 2026-08-29

| Fact | Value | Tag |
|---|---|---|
| Repo HEAD | `a485326` on `engine/plan-and-diagnostics` — the session snapshot said `9e84628`; **they disagree, both are recorded** | [measured] `git rev-parse` |
| PRD size | 130,232 bytes · 20,174 words · **35,175 tokens** (cl100k_base) · 35 H2 · 62 H3 | [measured] tiktoken |
| `docs/mdmap/MAP.md` | 5,345 bytes · **1,544 tok** whole file; **780 tok** for Orientation→Regions; declares `budget: 2000` | [measured] |
| `AGENTS.md` | **2,063 tok** | [measured] |
| `docs/adr/0001-…md` | **613 tok**; only ADR in the repo; `docs/adr/` holds 1 file + `.gitkeep` | [measured] |
| `specs/` today | one dir, `harness/`, 5 `.mjs` files, 482 lines; `npm run arch` points at it | [measured] |
| `src/modules/` | **175 files** across 13 modules; `src/app` has 26 `route.ts` + 4 `page.tsx` | [measured] |
| kanban code | **0 files** match `kanban` under `src/ scripts/ test/` | [measured] `grep -ril` |
| MCP code | **0 files** match `modelcontextprotocol` | [measured] |
| `components.tsx` | `/language-(\w+)/` is at **line 133** today — PRD §9.2's blocking prerequisite | [measured] `grep -n` |
| MADR frontmatter | `status`, `date`, `decision-makers`, `consulted`, `informed`, all optional | [fetched] raw.githubusercontent.com/adr/madr |
| obsidian-kanban | `community-archive/obsidian-kanban`, **GPL-3.0**, 4,483★, latest release **2.0.51 published 2024-05-31**, `pushed_at` 2026-03-06, `archived: false` | [fetched] api.github.com |
| PRD §9.2 vs GitHub | PRD says "26.9 months since last release" — release date confirms it; PRD's "archived" reading is the **org name**, the repo flag is false. **Both recorded** | [derived] 2024-05-31→2026-08-29 |
| `@modelcontextprotocol/sdk` | **1.30.0**, MIT | [fetched] registry.npmjs.org |
| Lost in the Middle | arXiv **2307.03172**, title confirmed | [fetched] export.arxiv.org |

`curl` reaches raw.githubusercontent.com, api.github.com, registry.npmjs.org, export.arxiv.org, llmstxt.org. WebFetch is refused; curl is not. [measured]

### 1. Root and directory layout — exact paths

Root is **`specs/`**, not `docs/specs/`. `specs/harness/` already holds the executable gates and `package.json` already wires `arch` to it [measured] — the repo has already decided that `specs/` is where machine-checkable contracts live. A second root fragments it.

```
specs/SPECS.md                      index, budget-enforced. THE ONLY ALWAYS-ON FILE
specs/README.md                     ≤40 lines: how to read, how to add, the 6 states
specs/_schema/spec.schema.json      JSON Schema 2020-12 for the frontmatter
specs/_schema/states.md             the state machine, one file, referenced by id
specs/_drift/report.md              GENERATED. machine-write only
specs/_drift/coverage.json          GENERATED. per-spec governs/verify/prd hashes
specs/engine/nf-001-zero-indent-sequence.md
specs/engine/nf-003-bare-cr-fence.md
specs/engine/splice-writer.md
specs/engine/certificate.md
specs/render/kanban.md
specs/render/decision.md
specs/render/calendar.md
specs/render/fence-dispatch.md
specs/protocol/mcp-server.md
specs/protocol/land.md
specs/protocol/session-interchange.md
specs/surface/review-hunks.md
specs/surface/home-md.md
specs/surface/doc-health.md
specs/platform/ci.md
specs/platform/tenancy.md
specs/harness/spec-report.mjs       NEW. joins the 5 existing gates
```

- **`id` == path minus `specs/` and `.md`.** `render/kanban` resolves to `specs/render/kanban.md` by rule. Kills link rot, makes the id a verbatim grep string, and drops the index row cost from 51 to 20 tokens [measured, §6].
- ADRs stay at `docs/adr/`. Do not migrate ADR-0001 — moving the one existing artifact to tidy a convention is pure churn. Specs cite it as `adr/0001`.
- One spec per file. No `specs/render/all-profiles.md`.
- `_schema/` and `_drift/` sort first and are underscore-prefixed so an agent globbing `specs/*/` sees intent dirs, not plumbing.

### 2. Spec types — exact frontmatter keys and body sections

**Common keys, every type.** Exactly one is required — `spec: 1` — borrowing mdmap's rule that everything else must degrade [fetched, `docs/mdmap/03-spec/format.md`].

| Key | Type | Purpose |
|---|---|---|
| `spec` | `1` | **Required.** Format version, the only required key |
| `id` | slug | Stable identity == path. Human-readable, never numeric (SCIP's reason, per mdmap) |
| `title` | string | One line |
| `state` | enum | §4. Written by the harness, never by hand |
| `track` | `R0\|T0..T6` | PRD §24 lane |
| `prd_file` | path | `docs/FRONTMATTER-PRD-2026-08-29.md` — dated filename, LR#69 |
| `prd_sha256` | hex | Hash of that file at authoring time. Mismatch = `stale-prd` |
| `prd_sections` | array | `["9.2","5","13-L1"]` — numbers, not heading text |
| `governs` | array of globs | The code this spec owns |
| `verify` | array of shell | Executed, never grepped |
| `depends_on` | array of ids | |
| `budget` | int | Token ceiling, enforced at write |
| `updated` / `commit` | date / sha | Provenance |
| `superseded_by` | id | Set only with `state: superseded` |
| `x` | map | **All non-reserved keys live here.** Hugo's `params` rule [fetched, mdmap format §0.5] |

**Type-specific keys.**

| Type | Extra keys |
|---|---|
| `render` | `profile`, `fence`, `reads_keys[]`, `writes_keys[]`, `degrade_to`, `writeback: none\|splice`, `oracle` |
| `protocol` | `transport`, `tools[]`, `tool_cap`, `verdicts[]`, `refusals[]` |
| `engine` | `defect_id`, `corpus`, `corpus_sha256`, `red_proof` (path to the test that fails against unfixed code) |
| `surface` | `screens[]` (PRD §14 row numbers), `keys[]` (§14.1), `empty_state` |
| `platform` | `gates[]`, `floor` (minimum files a gate must scan) |

**Body sections — fixed order, fixed names.** Ordering follows measured position sensitivity: 75.8% first / 53.8% middle / 63.2% last against a 56.1% closed-book baseline [fetched, arXiv 2307.03172 title confirmed; percentages inherited from `docs/mdmap/05-agent/MAP.md`]. Non-derivable content first, enumerable structure in the middle, the next action last.

| # | Section | Budget | Contains |
|---|---|---|---|
| 1 | `## Contract` | ~120 tok | 3–5 sentences. What must be true. Nothing grep can re-derive |
| 2 | `## Invariants` | ~600 tok | **The payload.** `rule → failure mode → executable check`, one row each |
| 3 | `## Interface` | ~300 tok | Verbatim identifiers, paths, signatures. BM25 scores 97.8 R@2 on exact strings vs <20 R@100 for embedders [inherited, mdmap 05-agent] |
| 4 | `## Behaviour` | ~500 tok | Tables and state. The only place prose is allowed to be long |
| 5 | `## Refusals` | ~200 tok | What it refuses and the exact message. Refusal is a product outcome (PRD §6.1) |
| 6 | `## Verification` | ~250 tok | The commands, the red-proof, the corpus sha |
| 7 | `## Drift` | generated | `<!-- SPEC:DRIFT:START -->…<!-- SPEC:DRIFT:END -->`. **Machine-write zone** |
| 8 | `## Decisions` | append-only | Dated one-liners. Never edited, never deleted |
| 9 | `## Open` | — | Unresolved. First to be dropped under budget |
| 10 | `## Next` | ~80 tok | Exact commands. **LAST** |

Machine-write markers copy a prototype already running in this estate: `knowledge.md`'s `<!-- CATEGORIES:START/END -->` regions written by `build_catalog.py` [fetched, PRD §13 L3].

### 3. Referencing the PRD, and referencing code

**PRD binding — three grains, all machine-checkable.**

| Grain | Mechanism | Detects |
|---|---|---|
| File | `prd_file` + `prd_sha256` | A new PRD was issued; every spec flags at once |
| Section | `prd_sections: ["9.2"]` + per-section sha in the `## Drift` zone | §9.2's bytes changed under a spec that claims to implement it |
| Claim | Quote ≤15 words verbatim into `## Contract`, tagged with the PRD's own evidence tag | A `[SS]` claim silently promoted to fact |

- Reference by **section number**, never heading text. The PRD's own prose already cites `§9.2`, `§13 L0`, `§24 T2` [fetched, PRD]. Headings get reworded; the numbering is the stable surface.
- The PRD filename carries its date. A spec never points at a mutable `PRD.md`.

**Code binding.**

- `governs: ["src/modules/render/kanban/**", "src/modules/preview/presentation/markdown/components.tsx"]`.
- **Line numbers are banned.** Cite `path` + a verbatim `symbol` or `pattern`; the harness re-derives the line. `/language-(\w+)/` is at line 133 today [measured] — that number will be wrong within a week.
- Coverage is symmetric and uses mdmap's existing vocabulary verbatim — do not invent a second one [fetched, `docs/mdmap/03-spec/gaps.md`]: **ghost** (glob matches 0 files), **ungoverned** (file under scope matched by no spec), **broken** (dead `depends_on`), **orphan**, **stale**, **over-budget**.
- Two specs may never `governs:` the same path. Overlap is a hard failure, not a warning.

### 4. State machine

```
draft ──► ready ──► in-progress ──► implemented ──► verified
  │         │            │               │              │
  └─────────┴────────────┴───────────────┴──────────────┴──► superseded
```

| Transition | Mechanical entry condition — checked, not asserted |
|---|---|
| `draft → ready` | Frontmatter validates against `spec.schema.json`; `governs` and `verify` both non-empty; every `prd_sections` anchor resolves in `prd_file` |
| `ready → in-progress` | ≥1 `governs` glob matches ≥1 file |
| `in-progress → implemented` | Every `governs` glob matches ≥1 file; `npm run verify` green |
| `implemented → verified` | Every `verify:` command **executed** with exit 0, **and** `red_proof` exists and fails against the unfixed code. PRD §25: a test on a rare fault proves nothing until it fails first |
| `verified → implemented` | **Automatic demotion** when any governed file's sha changes or `prd_sha256` mismatches. The harness demotes; a human cannot re-assert |
| `* → superseded` | `superseded_by:` set to a live id. **Deleting a spec file is forbidden** |

- Only `spec-report.mjs` writes `state:` forward. A human writing `state: verified` by hand is itself a drift finding.
- `verified` is the only state that may be cited in marketing. PRD §29: R0 precedes marketing any number.

### 5. Drift detection

`specs/harness/spec-report.mjs`, run by `npm run spec`, joining the five gates already in `specs/harness/` [measured].

| Finding | Rule |
|---|---|
| `stale-prd` | `sha256(prd_file) ≠ prd_sha256` |
| `stale-section` | per-section sha in `## Drift` ≠ live |
| `stale-code` | governed file sha ≠ recorded → demote `verified` |
| `ghost` | `governs` glob matches 0 files |
| `ungoverned` | file under `src/modules/**` matched by no `governs` |
| `unverifiable` | `state: verified` and any `verify` command exits non-zero or is missing |
| `overlap` | two specs claim one path |
| `over-budget` | file exceeds `budget:` |
| `unproven` | `state: verified` with no `red_proof` |

Hard rules the harness itself must obey, each from a defect this estate has already shipped:

- **Execute, never grep.** A check that greps source is a proxy and must print `PROXY`. Four gates in this repo could report green while blind [fetched, PRD §25].
- **Count before, count after.** Refuse if a machine-zone write did not land — `>>` fails silently under a sandbox denial (LR#67).
- **Floors, not equalities.** Assert `specs_scanned ≥ N and failures == 0`. Equality-pinned counts punish adding a spec (LR#66).
- **Accept every key the producers write.** A missing key is UNKNOWN and skipped, never coerced to falsy (LR#59).
- **`bash -n`, not `zsh -n`.** The harness is `.mjs`; any shell in `verify:` is parsed by bash 3.2 (LR#64).

### 6. The index, and its token budget

`specs/SPECS.md`. Same section order as a spec. Row shape measured three ways [measured, tiktoken cl100k_base]:

| Row shape | tok/row | 30 rows | 45 rows |
|---|---|---|---|
| id + state + track + prd + governs + verify (linked) | **51** | 1,530 | 2,295 |
| id + state + track + prd + one-line | **39** | 1,170 | 1,755 |
| **`id` (bare, path-derivable) + state + track + one-line** | **20** | **600** | 900 |

**Derived budget.** Core = orientation ~120 + invariants **175 measured** + table header **28 measured** + 30 rows × 20 = 600 + navigate ~80 = **1,003 tokens**. Claude's tokenizer differs from cl100k and produces ~30% more tokens for the same text [fetched, PRD §19.3]; 1,003 × 1.3 = **1,304**. Set `budget: 2000`, matching mdmap's enforced ceiling [fetched], which leaves 696 Claude-tokens of headroom — room for ~34 more rows before a split is forced.

- `governs` and `verify` are **not** in the index. They live in the spec; putting them in the index is what pushes 30 rows from 600 to 1,530 tokens.
- **Pin the referent.** `docs/mdmap/MAP.md` declares `budget: 2000` but does not say whether it means the core or the file. Measured: core 780, file 1,544 [measured]. Both pass; the ambiguity does not. `SPECS.md` states: budget covers Orientation→Regions.
- Enforced at write time. A budget that is not mechanically enforced is not a budget [fetched, mdmap 05-agent].
- The index carries **no file-by-file description.** Anthropic's CLAUDE.md exclude-list names exactly that [inherited, mdmap 05-agent]. An agent with grep re-derives the tree in two calls.
- Below ~200k tokens of source, ship no index at all. This repo clears the line at ~310k [inherited, mdmap 05-agent].

### 7. Worked example — `specs/render/kanban.md`, complete

```markdown
---
spec: 1
id: render/kanban
title: Kanban render profile
type: render
state: draft
track: T2
prd_file: docs/FRONTMATTER-PRD-2026-08-29.md
prd_sha256: <sha256 at authoring; re-derive, do not copy this placeholder>
prd_sections: ["9.2", "5", "13-L1", "14#5", "24-T2", "33"]
governs:
  - src/modules/render/kanban/**
  - src/modules/preview/presentation/markdown/components.tsx
depends_on: [render/fence-dispatch, engine/splice-writer]
profile: kanban
fence: kanban
reads_keys: [status, type, title, due, tags]
writes_keys: [status]
writeback: splice
degrade_to: unstyled-fenced-code-block
oracle: test/render/kanban/zero-dirty.test.ts
verify:
  - npm run test -- test/render/kanban
  - node specs/harness/spec-report.mjs --id render/kanban
budget: 1200
owner: sagnik
updated: 2026-08-29
commit: a485326
x:
  licence_landmine: obsidian-kanban GPL-3.0 — read the convention, copy zero code
---

# Kanban render profile

## Contract

Columns are the values of one frontmatter key across a folder of files. Dragging a card
rewrites that key in that file and nothing else. The board owns no state: delete every
board artifact and the files are unchanged. PRD §5, verbatim: "every app-like thing …
owning no state of its own."

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | A no-op interaction dirties **zero files** | Board rewrites YAML on open; user's git shows noise | `npm run test -- test/render/kanban/zero-dirty.test.ts` |
| 2 | Write-back goes through `splice-frontmatter.ts`, never gray-matter | Regeneration strips comments, anchors, leading zeros — the exact failure measured in Front Matter CMS | `grep -rL "splice-frontmatter" src/modules/render/kanban/**/*write*` must be empty |
| 3 | Unregistered or unparseable → **DEGRADE**, never throw | A board fence becomes a blank area in a dumb renderer | `npm run test -- test/render/kanban/degrade.test.ts` |
| 4 | Board reads only `reads_keys`; writes only `writes_keys` | Silent mutation of `updated:` or key reordering | zero-dirty oracle, key-set assertion |
| 5 | A card with no `status:` renders in an explicit **Unset** column | Cards vanish; user believes files were lost | `test/render/kanban/unset-column.test.ts` |
| 6 | Column order comes from the schema enum, never from encounter order | Columns reshuffle between loads | `test/render/kanban/column-order.test.ts` |
| 7 | Zero lines of obsidian-kanban source enter this tree | GPL-3.0 contamination | licence gate in `spec-report.mjs` |

## Interface

- Fence: ` ```kanban ` — dispatched by `render/fence-dispatch`.
  **Blocking prerequisite:** `src/modules/preview/presentation/markdown/components.tsx`
  matches `/language-(\w+)/`; `\w` excludes `-`, so every hyphenated fence language
  collides with its prefix. Fix before any profile ships (PRD §9.2). Cite the pattern,
  not the line — it was line 133 on 2026-08-29 [measured].
- Writer: `src/modules/share/domain/splice-frontmatter.ts` (13,324 bytes, exists) [measured].
- Board file convention adopted from obsidian-kanban: `## Lane` headings + `- [ ]` items,
  de-facto standard read by ≥3 plugins (PRD §9.2).

## Behaviour

| Interaction | Effect on the file |
|---|---|
| Drag card between columns | Splice `status:` value in that one file |
| Drag within a column | **No write.** Order is a view concern; a sidecar or nothing |
| Edit card title | Splice `title:`; body untouched |
| Add card | Create file from the `type:` template; never mutate the board fence |
| Archive | Splice `status: archived`. Never delete a file |

Degradation: unregistered renderer → plain code block, valid CommonMark everywhere.

## Refusals

| Condition | Message |
|---|---|
| `status:` absent from the schema enum | "Column `<v>` is not in `<schema>`. Add it to the schema or pick an existing value." |
| Frontmatter fails strict YAML | "Cannot write to `<path>`: frontmatter did not parse. File unchanged." |
| Splice cannot locate the key byte range | "Refused: could not locate `status:` safely. File unchanged." |
| Bare-CR fence (NF-3) present | "Refused pending `engine/nf-003-bare-cr-fence`." |

## Verification

- Red-proof: `test/render/kanban/zero-dirty.test.ts` must **fail** against the pre-fix
  write path before it may certify anything (PRD §25).
- Corpus: 20 pinned board files, sha256-verified before each run.
- Exit condition (PRD §24 T2): "Kanban write-back dirties zero files on a no-op."

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-08-29 — Adopt the obsidian-kanban file convention; copy zero code. GPL-3.0,
  4,483★, latest release 2.0.51 published 2024-05-31 [fetched api.github.com].
- 2026-08-29 — Intra-column ordering is out of scope for v1. No sidecar until asked twice.

## Open

- Does `Unset` sort first or last?
- Multi-key boards (group by `status`, swimlane by `type`) — v1 or v2?

## Next

    node specs/harness/spec-report.mjs --id render/kanban
    npm run test -- test/render/kanban
```

### 8. Anti-recommendations — what makes a spec system rot

| Never | Why |
|---|---|
| **A `specs/all.md`** | The 35,175-token PRD is already the long document. A second one is read by nobody and drifts twice as fast [measured] |
| **Line-number citations** | `components.tsx:133` is true today and wrong next week [measured] |
| **`state:` edited by hand** | An asserted state is a claim; only an executed gate is evidence (PRD §25) |
| **A gate that greps instead of executing** | Four gates in this repo reported green while blind (PRD §25) |
| **Deleting a superseded spec** | mdmap's rule: mark `superseded-by`, never delete. The deleted spec is the one you need during the postmortem |
| **A second finding vocabulary** | mdmap already defines ghost/broken/orphan/uncovered/stale/over-budget. Two vocabularies means neither gets a linter |
| **Numbers copied forward** | PRD §32 lists 20 stale counts including five different counts for one corpus. Re-derive at write time |
| **Prose-only invariants** | An invariant with no executable check is a wish. `rule → failure mode → check`, all three or delete the row |
| **`governs` overlap** | Two owners = no owner; both specs go stale believing the other is current |
| **A budget with no enforcement** | mdmap's own `budget: 2000` does not state whether it covers core or file — measured 780 vs 1,544 [measured] |
| **Free-text `prd:` references** | "see the rendering section" survives no rewrite |
| **A spec per file of code** | Anthropic's CLAUDE.md exclude-list names file-by-file description explicitly. One spec per **contract** |
| **Machine writes outside the marked zone** | The moment a tool edits human prose, humans stop trusting the file and stop reading it |
| **Starting with 20 specs** | Ship `SPECS.md` + `spec-report.mjs` + **one** verified spec. An index over drafts is an index over fiction |
| **A spec system with no CI** | `.github/` does not exist in this repo (PRD §7.2). An unrun harness is documentation of a harness |

### 9. Bootstrap order

1. `specs/harness/spec-report.mjs` + `npm run spec` — the gate before the content (LR#43: build in hierarchy order).
2. `specs/_schema/spec.schema.json` + `specs/_schema/states.md`.
3. `specs/SPECS.md` with **one** row.
4. `specs/render/fence-dispatch.md` — it is the blocking prerequisite for every render profile (PRD §9.2) and the smallest thing that can reach `verified`.
5. `specs/engine/nf-001-zero-indent-sequence.md` — R0, the defect gating every fidelity number (PRD §24).
6. Only then `specs/render/kanban.md` above.
7. Add `npm run spec` to the `verify` chain in `package.json` beside `arch`.

### 10. Not done here

- **No file was created, edited, or deleted; no git command other than `rev-parse`, `branch`, `log` was run.** The layout, schema and worked example above are proposals to be written by the founder or a follow-up session.
- `prd_sha256` in the worked example is a placeholder — compute it at authoring time; a copied hash is the exact failure §32 catalogues.
- Not measured: whether `spec-report.mjs`'s coverage pass is fast enough over 175 module files. Measure before wiring it into `npm run verify`.