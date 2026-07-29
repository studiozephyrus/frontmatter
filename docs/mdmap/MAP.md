---
mdmap: 1
scope: docs/mdmap
title: mdmap — a markdown project's structural map
generated: 2026-07-29T02:35:00Z
commit: 8eb4de2
coverage: 0.247
budget: 2000
status: concept
---

# mdmap

One markdown file that makes an entire project legible to a human eye and an agent's
context window at the same time. Tree, graph, and canvas are three projections of it.
Working name; see [[07-open/naming]].

## Orientation

A project's structure exists in three places today and none of them talk: the folder
tree (real but dumb), the link graph (derived and untyped), and whatever diagram
someone drew once (accurate for a week). Agents get a fourth, separate thing — a flat
context dump. `mdmap` is one authored, diffable, budget-enforced markdown file that
carries all four, and a reconciler that tells you where it has drifted from reality.

It is **not** a prettier graph view. Every graph view ever shipped is universally
described by its own users as decoration. The thesis is in [[01-thesis/not-a-graph-view]].

## Invariants

Break any of these and this stops being the thing.

1. **The map is markdown, not JSON.** Layout coordinates live in a sidecar. A map with
   no coordinates must still render. — [[03-spec/format]]
2. **The map compresses.** Always-on core ≤ 2,000 tokens (~1% of a 200k window). If the
   map is bigger than the thing it maps, it is a hairball. Verified failure:
   [[02-evidence/graphify-hairball]]
3. **The agent never traverses edges.** LLMs score 10–23% counting nodes in a ≤20-node
   graph. Rank offline, ship a flat list. — [[05-agent/no-traversal]]
4. **The global view is opt-in.** Bounded by default: one region, depth 2. Unbounded is
   wallpaper. — [[02-evidence/demand]]
5. **Layout never moves on its own.** New nodes get placed; existing nodes never shift.
   A map that rearranges destroys the spatial memory that makes it worth having.
6. **Unresolved links are findings, not noise.** Today [graph-data.ts:132](../../src/modules/graph/presentation/graph-data.ts#L132)
   silently drops them. The gap report is the product. — [[03-spec/gaps]]
7. **Deterministic output.** Same input → byte-identical file. Reshuffling destroys the
   agent's prompt cache prefix.
8. **Never restate what the code says.** File-by-file descriptions are explicitly on
   Anthropic's CLAUDE.md exclude-list. The map carries what cannot be re-derived:
   invariants, intent, gaps. — [[05-agent/what-not-to-include]]

## Entry points

- Never seen this: [[01-thesis/pitch]]
- Want the format: [[03-spec/format]]
- Want to build it: [[06-product/phases]]
- Want the proof: [[02-evidence/MAP]]
- Sceptical: [[01-thesis/steelman]]

## Regions

| region | rank | what it holds |
|---|---|---|
| [[01-thesis/MAP]] | 1.00 | what it is, why it isn't a graph view, why now, the steelman |
| [[03-spec/MAP]] | 0.94 | the file format, edge vocabulary, gap report, trails |
| [[05-agent/MAP]] | 0.88 | the agent contract, token budget, what to exclude |
| [[02-evidence/MAP]] | 0.81 | sourced research: prior art, demand, measurements |
| [[04-views/MAP]] | 0.77 | tree/graph/canvas projections, semantic zoom, UI |
| [[06-product/MAP]] | 0.70 | how it lands in frontmatter, pricing, phases |
| [[07-open/MAP]] | 0.52 | open spec strategy, naming, domains, risks |

## Relations

| from | edge | to | why |
|---|---|---|---|
| 03-spec | implements | 01-thesis | the format is the thesis made concrete |
| 05-agent | constrains | 03-spec | token budget dictates section order and size |
| 02-evidence | justifies | 01-thesis | every claim traces to a source |
| 04-views | projects | 03-spec | three renderings of one file |
| 06-product | depends-on | 03-spec, 04-views | nothing ships before the format is fixed |
| 07-open | supersedes | — | naming is unresolved; MD3 killed |
| 01-thesis | contradicts | 02-evidence/demand | users say they do not want a graph; §steelman answers it |

## Gaps

Generated 2026-07-29 by counting, not by estimating. **81 nodes declared, 20 exist,
coverage 0.247.**

| region | declared | exists | ghosts |
|---|---|---|---|
| 01-thesis | 11 | 7 | 4 |
| 02-evidence | 11 | 1 | **10** |
| 03-spec | 11 | 2 | 9 |
| 04-views | 11 | 3 | 8 |
| 05-agent | 10 | 0 | **10** |
| 06-product | 11 | 0 | **11** |
| 07-open | 9 | 0 | 9 |
| *region maps* | 7 | 7 | 0 |

- **ghosts: 61.** Every one is a real intent, not filler — the sources exist in this
  session's research and need transcribing.
- **broken: 0.**
- **orphans: 0.**
- **uncovered:** `docs/research/*` (4 files) and `docs/adr/*` are not reachable from this map.
- **stale: 0** — built at `commit: 8eb4de2`, which is HEAD.

This section was wrong on first write — it claimed 61 declared / 37 existing from
estimation. Counting corrected it to 81 / 20. That is the entire argument for
[[03-spec/gaps]] happening to itself on day one.

## Recipes

- **Add a region** → create `NN-name/MAP.md`, add a row to `## Regions`, add its edges to
  `## Relations`, re-run coverage.
- **Kill a claim** → find it in `02-evidence`, mark `superseded-by`, never delete.
- **Check the budget** → the core (Orientation → Regions) must stay under `budget:`.

## Navigate

- Deeper into a region: open its `MAP.md`.
- Everything sourced: [[02-evidence/MAP]].
- Nothing here is built yet. This is a concept document, dated 2026-07-29.
