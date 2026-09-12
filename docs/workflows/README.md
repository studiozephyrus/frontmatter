---
mode: reference
updated: 2026-09-09
verified_against: bda4387
---

# Workflow scripts — the research apparatus

> **Method.** Every file here was rescued on 2026-09-09 from Claude Code session directories,
> where they were the only copy and would have aged out. They are recorded as history and as
> reusable machinery, not as documentation of the current system. **Not done:** none was re-run
> to confirm it still executes against today's tool API.

37 scripts. Each is a JavaScript program for the Workflow tool: it fans out subagents, forces
structured output through a JSON schema, and returns a merged result. Together they are most of
the research behind `docs/`.

## Why these are kept

The findings they produced live in `docs/`. The scripts are kept for three reasons:

1. **Reproducibility.** A number in the plan can be traced to the fan-out that produced it.
2. **Reuse.** A new round is usually an edit of an old one, not a new file.
3. **Method.** They record how a question was decomposed, which is often the more transferable
   part.

## What is here

| Group | Scripts | What they did |
|---|---|---|
| Rounds 3–6 | `round3-hands-on`, `round4-editors`, `round5-ai-journey`, `round6-final` | The early competitive and editor sweeps |
| Rounds 8–26 | `r8-aios-spec-buildplan` … `r26-brutal-critique-and-plan` | The long research arc: markdown format and rendering (r9), untouched angles (r10), build blockers (r12), engine designs (r16), the war-game (r18), the product decision layer (r19), ground truth on AI pain (r21), ecosystem and money (r22), editing craft and USP (r24), and the brutal critique (r26) |
| PRD builds | `prd-corpus`, `prd-v2-sections`, `prd-dedup`, `prd-compact` | Assembling and then compressing the PRD |
| Engine | `mdmax-foundations`, `r15-mdmax-engine` | The engine's own research |
| Gap closing | `gap-closing-round`, `solidify-round`, `r17-final-gaps`, `r25-close-the-gaps`, `internal-sweep`, `external-round` | Successive passes at what was still missing |
| Decisions | `frontmatter-decision-questions`, `pilot-scope-verification` | The first decision set, and the pilot scope check |
| **2026-09-09** | `frontmatter-untapped-research`, `frontmatter-core-docs` | The nine untapped market seams; the core documentation set |

`decisions/tools/gen-workflow.js` is the fifteenth — the area-rewrite workflow — and lives with
the other decision tooling because it is the one you will re-run.

## Two lessons these cost, worth reading before writing another

**Do not fan out one verify agent per claim.** `frontmatter-untapped-research` did exactly that:
ten research lenses completed and returned 310 findings, then its verify stage spawned roughly
150 skeptic agents at about 100k tokens each and burned a session limit. The stage was killed.
Six `curl` checks by hand afterwards found the one real fabrication in the batch, for almost
nothing. **Verify a handful of load-bearing claims yourself; fan out only where the work is
genuinely parallel and genuinely necessary.**

**Agents write their output files before they die.** When `gen-workflow.js` first ran, a session
limit killed 15 of 16 agents and the tool reported one success. **Five complete area files were
already on disk.** Always check the output directory before believing a failure count.

## Running one

```
Workflow({ scriptPath: 'docs/workflows/<name>.js', args: { … } })
```

The `-wf_<id>` suffix on each filename is the run id it was captured from; `resumeFromRunId`
only replays within the same session, so on a new session assume the cache is cold.

Every script begins with a `meta` literal naming it, describing it, and listing its phases. Read
that block first — it is the summary of what the script does.
