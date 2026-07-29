---
mdmap: 1
scope: docs/mdmap/05-agent
title: Agent — the machine contract
parent: ../MAP.md
rank: 0.88
---

# Agent

## Orientation

The agent half of `mdmap` is where the concept either earns its existence or is overhead.
Every design choice here is forced by a measurement, not a preference. The short version:
the agent reads a ≤2,000-token flat file, ordered invariants-first, containing only what it
cannot re-derive, and it never traverses an edge.

## Invariants

**1. The agent never traverses the graph.** On graphs of **5–20 nodes**, zero-shot: counting
nodes **18.8–23.0%**, counting edges **10.2–15.0%**, listing neighbours **4.0–53.8%**
depending purely on text encoding (Talk like a Graph, 2310.04560). A model that cannot count
20 nodes will not walk your project. Rank offline with PageRank; ship a flat list.

**2. Budget is 2,000 tokens, and it is enforced at write time.** Three independent Anthropic
constants converge on the same order of magnitude: the skill-listing budget is **1% of the
model's context window**; CLAUDE.md guidance is *"target under 200 lines… Longer files
consume more context and reduce adherence"*; auto-memory loads **only the first 200 lines or
25KB** of `MEMORY.md`. Claude Code measures the index after every write and errors back if it
is over. Aider bisects to fit. A budget that is not mechanically enforced is not a budget.

**3. Never include what the code says.** Anthropic's CLAUDE.md exclude-list names
**"File-by-file descriptions of the codebase"** and **"Anything Claude can figure out by
reading code."** An agent with grep re-derives the file tree in two calls. The map carries
invariants, intent, and gaps — the three things grep cannot produce.

**4. Verbatim identifiers, never paraphrase.** On DeepMind's LIMIT benchmark, **BM25 scores
97.8 Recall@2** while state-of-the-art embedders score **under 20 Recall@100**. The map's
real function is handing the agent exact grep-able strings: `PUBLIC_STATIC_RE`,
`src/proxy.ts`, `npm run arch`.

**5. Order by position sensitivity.** Lost-in-the-Middle, 20 documents: **75.8% first /
53.8% middle / 63.2% last** against a **56.1%** closed-book baseline. Mid-context is worse
than not retrieving. Invariants first, navigation contract last, enumerable structure in the
middle where decay is cheapest.

**6. Deterministic byte-identical output.** MCP made deterministic tool ordering a SHOULD
explicitly *"to improve LLM prompt cache hit rates."* A map that reshuffles destroys the
cache prefix every session.

**7. The harness must load it — discovery does not work.** Ahrefs measured 137,210 domains:
**28% publish a valid `llms.txt`; 97% of those received zero requests in May 2026**, and
*"Zero requests came from AI bots for llms.txt files that don't exist. They never go
looking."* Google's John Mueller, on the record: *"it's comparable to the keywords meta
tag."* Ship as a skill or a `paths:`-scoped rule. Note that `@`-imports do **not** defer
loading — imported files load at launch.

**8. Below ~200k tokens, do not ship a map at all.** Anthropic, verbatim: *"If your knowledge
base is smaller than 200,000 tokens (about 500 pages of material), you can just include the
entire knowledge base in the prompt… with no need for RAG."* This repo is ~310k tokens of
source and clears the line. A 24-file repo does not, and the spec should say so.

## Regions

| node | status | what it holds |
|---|---|---|
| [[no-traversal]] | planned | the graph-reasoning evidence in full, and what to do instead |
| [[what-not-to-include]] | planned | the exclude-list, and the invariant as the unit of value |
| [[budget]] | planned | measured token costs of this repo and `md`; the enforcement loop |
| [[why-not-graphrag]] | planned | $389 vs $0.75 indexing, 331k tokens/query, and LazyGraphRAG |
| [[write-back]] | planned | permissioned agent edits to the map as a reviewable diff |
| [[scoped-directives]] | planned | region-scoped `agent:` rules — AGENTS.md with topology |
| [[navigation-contract]] | planned | the exact commands, and why they go last |
| [[mcp-surface]] | planned | resources vs tools vs prompts; the `priority` annotation |
| [[staleness]] | planned | invalidate-never-delete, borrowed from Zep/Graphiti |
| [[measurement]] | planned | the eval that would prove this beats a flat dump |

## Relations

| from | edge | to | why |
|---|---|---|---|
| no-traversal | constrains | ../03-spec/format | forces flat ranked lists over adjacency |
| budget | constrains | ../03-spec/format | forces roll-up and visible truncation |
| why-not-graphrag | contradicts | — | rules out the obvious expensive approach |
| scoped-directives | supersedes | AGENTS.md | same idea, given a topology |
| write-back | depends-on | ../03-spec/gaps | an agent proposes; the reconciler verifies |
| measurement | contradicts | this whole region | none of it is proven yet |

## Gaps

**The honest one:** nobody in this category has published a task-success delta. Aider
publishes no measurement that its repo map improves anything. Anthropic publishes none for
CLAUDE.md. The only hard figures anywhere are engineering metrics — index size, sync
latency. **That gap is the opportunity and also the risk**: [[measurement]] is unwritten,
and until it exists, every claim here is a design argument, not a result.

## Navigate

Everything in this region is planned. The invariants above are the load-bearing part and
are each traceable to a cited measurement in [[../02-evidence/MAP]].
