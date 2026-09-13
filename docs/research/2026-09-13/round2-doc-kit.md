## Document kit catalogue — what exists in this repo today

### A. The numbered doc set (`docs/[0-9][0-9]-*.md`)

All 16 files verified with `wc -l docs/[0-9][0-9]-*.md` (total 7,395 lines / ~355 KB). Each carries `mode:`/`updated:`/`verified_against:` frontmatter (checked `docs/10-LOCAL-SETUP.md:1-4`).

| File | Lines | Purpose | Agent-buildable? |
|---|---|---|---|
| `00-EXECUTIVE-SUMMARY.md` | 249 | One-page orientation | No acceptance criteria of its own; points elsewhere |
| `01-PRODUCT-AND-DOMAIN.md` | 422 | Domain model, entities, product framing | Mostly narrative |
| `03-DATA-MODEL.md` | 587 | Schema/entities | Some criteria (2 hits) |
| `04-API-REFERENCE.md` | 712 | Endpoint contracts | Reference shape, thin on criteria |
| `05-FRONTEND-SPEC.md` | 553 | UI/screen spec | 3 acceptance-criteria hits |
| `06-BACKEND-SPEC.md` | 658 | Backend spec | 9 hits — most agent-actionable of the narrative docs |
| `07-INTEGRATIONS.md` | 457 | Third-party integrations | Thin |
| `09-ENVIRONMENT.md` | 387 | Env vars | 0 acceptance-criteria hits; reference-only |
| `10-LOCAL-SETUP.md` | 339 | Dev setup | Method-stamped: states it read every real config file + ran `npm run verify` at a pinned commit (`10-LOCAL-SETUP.md:1-9`) — this is the strongest verified-not-guessed pattern in the set |
| `11-DEPLOYMENT.md` | 368 | Deploy steps | Thin |
| `12-SECURITY-REVIEW.md` | 598 | Security audit | 5 hits |
| `13-TECH-DEBT.md` | 176 | Known gaps | Narrative |
| `14-TESTING.md` | 352 | Test strategy | 20 hits — richest for verify commands |
| `15-GLOSSARY.md` | 460 | Terms | Reference-only |
| `17-CODEMAP.md` | 479 | File-by-file map | Reference-only |
| `29-RUNBOOK.md` | 598 | Ops runbook | 18 hits |

**Key finding: these are derived, not hand-written.** `AGENTS.md:16-24` and `docs/MAP.md:77-89` state Tier-1 docs are projected from `docs/research/` agent reports via `npm run tree` — a hand edit is reverted by the next build. A generator producing this shape for a new project would need the same discipline: generate from a structured source, not free-text.

### B. ADRs (`docs/adr/`)
Only `0001-adopt-hexagonal-architecture.md` exists (verified `ls docs/adr/`). Shape: Status/Date/Deciders → Context → Decision → Alternatives (`docs/adr/0001-adopt-hexagonal-architecture.md:1-35`). Short, decision-record format — good template for "why did we choose X" in a generated kit. Not a build-from document by itself; it's a rationale record.

### C. `specs/` — the only true agent-buildable layer found
- `specs/SPECS.md` (README/index, budget-tagged 2000 tokens)
- `specs/_schema/states.md` — six-state lifecycle (`draft→ready→in-progress→implemented→verified→superseded`), each transition has a **mechanical, executed** entry condition (`specs/_schema/states.md:9-15`)
- `specs/engine/splice-writer.md` — full worked example. Carries `governs:` (file globs it owns), `verify:` (literal shell commands: `node scripts/corpus-foreign.mjs verify`, `node specs/harness/spec-report.mjs --id engine/splice-writer`), a Contract/Invariants/Interface/Behaviour/Refusals/Verification/Decisions section order, and an explicit exit condition ("refused ≤ 2, changed = 0, threw = 0") (`specs/engine/splice-writer.md:1-16, "Exit condition for R0"` line).
- `specs/harness/*.mjs` — the actual gate scripts (`spec-report.mjs`, `clean-architecture-report.mjs`, `import-boundary-report.mjs`, `route-inventory.mjs`, `server-folder-blocklist.mjs`, `restamp-prd.mjs`, `analyze.mjs`) that execute the specs — this is the piece that makes a spec agent-buildable rather than agent-readable.

**This is the one document type in the whole kit that an AI coding agent can build from mechanically**: it names the files it governs, the exact verify commands, and a numeric exit condition, and a harness script enforces state transitions rather than trusting the agent's self-report.

### D. `decisions/v2/CONTRACT.md` (211 lines) — the question-card generator's own spec
Defines the exact JSON shape the funnel's "decision questions" step would need: `id, cat, sub, weight, q, lede, visual{kind,...}, stakes, state[], tension[], evidence[], options[{k,label,what,gains,costs,system,screens,money}], rec, recCase[], flip, linked[], sources[]` (`decisions/v2/CONTRACT.md:26-52`). Ten diagram primitives are enumerated with exact shape and size constraints (`decisions/v2/CONTRACT.md:122-145`). This is directly reusable as the schema for "the product asks decision questions" step of the new funnel.

### E. `docs/HANDOVER-ANSWERS-2026-09-09.md` (787 lines) — a real kickoff/answers round
Line 347-349: the founder's own repeated description of the wanted end-to-end loop: *"we generate all the files and give the kickoff prompt to your choice of agent tool. It reads through the CDN files and executes the projects."* — named explicitly as **not yet built** ("Partially present as F5/F6 but not as this end-to-end loop", `docs/HANDOFF-ANSWERS-2026-09-09.md:343`). This confirms the new-direction funnel is aimed at a gap the founder has already named three times (2026-08-28, 2026-09-06, and again in this handover), not a fresh idea.

### F. `sgnk-next` / `sgnk-react` skills
`~/.claude/skills/sgnk-next/references/` and `sgnk-react/references/` (verified via `ls`) hold: `project-starter.md`, `architecture-rules.md`, `code-patterns.md`, `code-quality-standards.md`, `deployment-readiness.md`, `phase-1/2/3-*.md`, `portability.md`, `production-readiness.md`, `saas-commercialization.md`, `target-structure.md`. These are **engine playbooks for scaffolding code**, not for generating a project's document kit — `project-starter.md:1-11` describes bootstrapping a Next.js repo (create-next-app → scaffold → connect → build), with `scripts/scaffold.mjs` copying gates into `specs/harness/`. They are the closest existing analogue to "generate a working codebase from a spec," but they generate **code scaffolding**, not the **document kit** the new funnel needs to produce first. No doc-kit generator script was found in either skill's `scripts/`.

## What made our own kickoff prompts work or fail here

- **Worked:** `docs/10-LOCAL-SETUP.md:1-9` — a doc that states its own method ("I read X, Y, Z in full... then ran every gate... the numbers below are from those runs, not from the documents") is the strongest pattern found. It is auditable by re-running the same commands.
- **Worked:** `specs/engine/splice-writer.md`'s `verify:` array of literal shell commands plus a numeric exit condition — an agent can mechanically check whether it succeeded.
- **Failed:** the Tier-1 narrative docs (00, 01, 03-07 etc.) mostly lack acceptance criteria or verify commands, so an agent reading only them would have to guess when to stop.
- **Failed / caution:** `AGENTS.md §0` and `docs/MAP.md:169-174` both had to be written specifically to stop agents from hand-writing `state: verified` and from re-litigating settled facts — i.e. our own kickoff prompts needed explicit "do not do X" guardrails added after agents did X. Also, `CLAUDE.md` records that a 2026-09-09 research pass fabricated quotes while getting facts right (repo `CLAUDE.md`, "Trust research substance, not its quotation marks" section) — a caution for any generated kit that includes cited sources.

## Proposed minimal kit for a new project (7 files)

| # | File | Why an agent needs it | Questions to ask the user (question-card style) |
|---|---|---|---|
| 1 | `00-BRIEF.md` | One-page orientation + the kickoff prompt itself, modelled on `docs/00-EXECUTIVE-SUMMARY.md` and the founder's own described loop (`docs/HANDOVER-ANSWERS-2026-09-09.md:347-349`) | `q: "What is this product, in one paragraph?"`, `q: "Who is the first user, and what do they do with it today?"` |
| 2 | `01-PRODUCT.md` | Domain model + feature list + MVP cut line, modelled on `docs/01-PRODUCT-AND-DOMAIN.md` | `q: "What ships first, what is explicitly cut?"`, `q: "What is the one metric that proves it worked?"` |
| 3 | `02-DATA-AND-API.md` | Merge of `03-DATA-MODEL.md` + `04-API-REFERENCE.md` — an agent needs the schema and contract before writing code | `q: "What are the core entities and their relationships?"`, `q: "Which operations must be idempotent / rate-limited?"` |
| 4 | `03-ARCHITECTURE.md` | One ADR-shaped file per major structural choice, modelled on `docs/adr/0001-adopt-hexagonal-architecture.md` | `q: "Monolith or services? What layer rules apply?"` |
| 5 | `04-SETUP-AND-ENV.md` | Merge of `09-ENVIRONMENT.md` + `10-LOCAL-SETUP.md` — the one doc type that worked (method-stamped, ran the real gates) | `q: "What are the required env vars and where do they live?"`, `q: "What commands must pass before any commit?"` |
| 6 | `specs/<area>.md` (one or more) | The only agent-buildable layer found: `governs`, `verify:` commands, numeric exit conditions, six-state lifecycle — modelled on `specs/engine/splice-writer.md` and `specs/_schema/states.md` | `q: "What is the one guarantee this system is sold on, and what breaks it?"`, `q: "What is the executable check for each invariant?"` |
| 7 | `MANIFEST.json` | The unguessable-link index (see below) | n/a — generated, not asked |

Kept to 7 (within the 6-10 target) by merging pairs that had thin content alone (`03`+`04`, `09`+`10`) and dropping reference-only files (`15-GLOSSARY.md`, `17-CODEMAP.md`, `29-RUNBOOK.md`, `13-TECH-DEBT.md`) from the MVP kit — they're additive, not load-bearing for a first build.

## Manifest format for the unguessable link

```json
{
  "guid": "<opaque id, not sequential>",
  "created": "<ISO 8601, from a live date command, not memory>",
  "project": "<name>",
  "files": [
    { "path": "00-BRIEF.md", "purpose": "orientation + kickoff prompt", "sha256": "<hash>", "bytes": 0 },
    { "path": "specs/engine.md", "purpose": "verify commands + exit condition", "sha256": "<hash>", "bytes": 0 }
  ],
  "kickoff_prompt": "The documents for this project are at <link>, in this structure. Read them in order and build against specs/*.md's verify commands."
}
```

Modelled on `specs/engine/splice-writer.md`'s own frontmatter pattern (`prd_sha256`, `commit`, `governs`) — content-hashing each file the same way lets a coding agent (or the frontmatter engine itself) detect drift between what the manifest promised and what's actually at the link, the same demotion mechanism `specs/_schema/states.md:12` uses ("Automatic demotion when any governed file's sha changes").

## Not found
- No doc-kit **generator script** in `sgnk-next`/`sgnk-react` `scripts/` — both only contain code-scaffolding tools (`scaffold.mjs`, `analyze.mjs`, architecture-gate `.mjs` files).
- No file matching `docs/sgnk-react-workflow.md` under this repo's `docs/` — not found (the react workflow doc lives in the `sgnk-react` skill as `WORKFLOW.md`/`WORKFLOW-MAP.md`, not in this repo).
- `mdmax cert` — confirmed absent from the 26 npm scripts per `CLAUDE.md`'s own "two known gaps" note; not independently re-verified against `package.json` in this pass.
