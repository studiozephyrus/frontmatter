---
mdmap: 1
scope: docs/mdmap/02-evidence
title: Evidence — everything sourced
parent: ../MAP.md
rank: 0.81
generated: 2026-07-29
---

# Evidence

## Orientation

Six parallel research agents swept prior art, spec/format standards, agent-context
research, live user discussion (Reddit via OpenCLI, Hacker News via the Algolia API),
canvas/rendering engineering, and naming/domains — on 2026-07-29. Everything below is
sourced. Where a claim could not be verified, it says so rather than being smoothed over.

## Invariants

- **Every number here names its source.** A figure without one is marked unverified.
- **Simulated ≠ measured.** No number in this region comes from replaying data through
  code; all are read from a primary source or computed from live files.
- **Nothing is deleted, only superseded.**

## The seven findings that decide the design

**1. A derived-only graph produces noise, measured on Sagnik's own system.** graphify over
`~/Desktop/GitHub/knowledge` (273 files, 546,933 words) → 3,848 nodes, 3,737 edges, **341
communities of which 329 are named `Community 11` … `Community 339`**. Of the 12 with human
names, 5 are marked `(empty)` and 1 is a mangled heading-dump. **6 usable labels out of 341
= 1.76%.** `graph.json` 3.4 MB; `GRAPH_REPORT.md` 141,837 bytes. → [[graphify-hairball]]

**2. The intersection is empty and was vacated from both sides in 2026.** **Reflect Open**
(MIT, 1.4k★, shipped 2026-07-14) — plain markdown source of truth, CLI *"for scripts and
agents"*, auto-installs an agent skill — **and ships no map view.** **IWE** (Apache-2.0,
~1.3k★) — real markdown knowledge graph with LSP + CLI + MCP — **and zero visual surface.**
Two teams built one half each; neither built the other. → [[prior-art]]

**3. Users do not want a global graph, and say so at volume.** *"Local graph view, yes, very
useful. Global graph view, no, just a pretty mess to look at."* (157 upvotes) — plus the
epistemic kill-shot: *"the graph only ever shows you what you already know. it can't
surprise you."* → [[demand]]

**4. Beyond ~20 vertices, node-link is the wrong encoding.** Ghoniem, Fekete & Castagliola,
*Information Visualization* 4(2), 2005: matrices outperform node-link on most of seven
tasks; *"Only path finding is consistently in favour of node-link."* → [[hci]]

**5. LLMs cannot traverse graphs.** 5–20 node graphs, zero-shot: node count 18.8–23.0%,
edge count 10.2–15.0%. But a **deterministic** walk pays — HippoRAG 2's Personalized
PageRank with flat output gains **+9.5 F1 on 2Wiki**. → [[agent-context]]

**6. GraphRAG is a trap at this scale.** Indexing HotPotQA: **$389.12 vs $0.75** for hybrid
search. Global search reads **331,375 tokens/query** vs vanilla RAG's ~879. On checkable
questions it *loses*: HotpotQA F1 **45.16 vs 60.04**. Microsoft's own LazyGraphRAG then
shipped at *"0.1% of the costs of full GraphRAG"* and *">700× lower query cost."*
→ [[agent-context]]

**7. No open standard exists.** Nothing plays SCIP's role for a markdown corpus. The near
misses — mdBook `SUMMARY.md`, Jupyter Book `_toc.yml`, Quartz's undocumented
`contentIndex.json`, JSON Canvas (spatial only), org-roam's SQLite (Emacs-local) — each
cover one axis. → [[spec-landscape]]

## Regions

| node | status | what it holds |
|---|---|---|
| [[graphify-hairball]] | written | the 1.76% measurement, reproducible |
| [[prior-art]] | planned | 35-tool table: map surface, format, strength, fatal weakness |
| [[demand]] | planned | 15 ranked pains + 10 unshipped requests, all with URLs |
| [[agent-context]] | planned | Aider's algorithm, GraphRAG economics, budget constants |
| [[spec-landscape]] | planned | wikilinks, frontmatter, JSON Canvas, SKOS/DCMI, llms.txt |
| [[hci]] | planned | Shneiderman, Furnas, Purchase, Holten, Ghoniem, Bederson, CodeCity |
| [[rendering-numbers]] | planned | every published FPS-vs-N figure, and every missing one |
| [[naming]] | planned | collisions, npm/PyPI, RDAP domain status |
| [[deaths]] | planned | Napkin, Dendron, Sourcetrail, CodeSee, Coda, TiddlyMap |
| [[unverified]] | planned | the do-not-publish list |
| [[method]] | planned | agents, backends, commands, and what was blocked |

## Relations

| from | edge | to | why |
|---|---|---|---|
| graphify-hairball | justifies | ../01-thesis/not-a-graph-view | the compression invariant |
| demand | justifies | ../04-views/MAP | bounded-by-default, stable layout |
| agent-context | constrains | ../05-agent/MAP | every agent invariant traces here |
| hci | contradicts | ../04-views/MAP | node-link is wrong for 6 of 7 tasks; concede it |
| deaths | justifies | ../06-product/MAP | plain files as the trust product |

## Gaps

- **Reddit was hard-blocked (403) for the web-fetching agents**; the demand sweep only
  succeeded through `agent-reach` → OpenCLI with the sandbox disabled. Quotes are from
  that run.
- **The session's WebSearch budget hit 200/200 partway through**, so later claims fall
  back to WebFetch. Affected items are flagged in each agent's own ledger.
- **No trademark database could be reached** — USPTO and EUIPO are JS shells, Trademarkia
  403s. The naming section's legal reasoning is inference, not search results.
- **Nobody publishes a task-success delta for repo maps.** That absence is itself a
  finding, and the largest hole in the case for this concept.

## Navigate

[[graphify-hairball]] is the only fully written node and the most load-bearing. The rest
are planned — the source material exists in this session's research and needs transcribing.
