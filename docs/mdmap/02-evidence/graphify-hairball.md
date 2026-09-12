---
mdmap-node: 1
title: The graphify hairball — 1.76% of a map was legible
parent: MAP.md
status: written
measured: 2026-07-29
---

# The graphify hairball

The strongest argument for `mdmap` is not a competitor's failure. It is a measurement of
Sagnik's own knowledge graph, taken today.

## What was measured

Source: `~/Desktop/GitHub/knowledge/graphify-out/GRAPH_REPORT.md`, built from commit
`464eb666` on 2026-07-23.

```
corpus     273 files · ~546,933 words
graph      3,848 nodes · 3,737 edges · 341 unique communities
artifacts  GRAPH_REPORT.md 141,837 bytes  (~35,000 tokens)
           graph.json    3,414,569 bytes
           graph.html    3,519,469 bytes
```

Community labels, counted directly:

| kind | count | share |
|---|---|---|
| auto-numbered `Community 11` … `Community 339` | **329** | 96.5% |
| human-named | 12 | 3.5% |
| — of which marked `(empty)` | 5 | |
| — of which a mangled heading-dump string | 1 | |
| **named, non-empty, meaningful** | **6** | **1.76%** |

The six that work: *Applied ML & MLOps*, *Generative & Vision Deep Learning*, *Layers
Overview*, *LLMs NLP & Agents*, *ML Ops & Eval Concepts*, *Systems Edge & IoT*.

The one that does not is worth quoting in full, because it is what happens when a label is
derived from headings with no human in the loop:

```
_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE: true), Connections, Demos / frameworks / commands,
How I'd apply this to my Claude Code env, Key ideas, Open questions / contradictions,
Timeline map, TL;DR
```

## Reproduce it

```bash
cd ~/Desktop/GitHub/knowledge/graphify-out
grep -o "_COMMUNITY_[^|]*" GRAPH_REPORT.md | sort -u | wc -l                        # 341
grep -o "_COMMUNITY_Community [0-9]*" GRAPH_REPORT.md | sort -u | wc -l              # 329
grep -o "_COMMUNITY_[^|]*" GRAPH_REPORT.md | sort -u | grep -v "Community [0-9]"     # the 12
```

## What it proves

**A map must compress. This one expands.** 273 documents became 3,848 nodes — a 14×
inflation — and the navigation layer built on top of them is 96.5% unlabeled. The artifact
meant to make the corpus legible is larger than a context window and less navigable than
the folder tree it was built from.

This is not a criticism of graphify, which does exactly what it says: extract entities and
relations, cluster with community detection, report. It is a demonstration that **community
detection is not meaning.** Leiden or label-propagation will happily find 341 clusters in
anything. Naming them is the hard part, and 96.5% of the time nothing named them.

Microsoft hit the same wall from the other direction and published the correction:
GraphRAG's *dynamic community selection* — a cheap model pre-filtering community reports —
achieved a **77% token-cost reduction with no statistically significant quality
difference**, taking 1,500 level-1 reports down to 470. Then **LazyGraphRAG** deferred all
LLM use to query time and reported *"indexing cost identical to vector RAG and 0.1% of the
costs of full GraphRAG"* at comparable quality. When the authors of a method publish a
variant that deletes its defining expensive step and it wins, the expensive step was not
carrying the quality.

## The invariants this forces

1. **The map must be smaller than the thing it maps.** Ceiling: 2,000 tokens for the
   always-on core, roughly 1% of a 200k window — Anthropic's own budget for its skill
   listing.
2. **Every region must be named by a human, or not exist.** No auto-numbered clusters.
   If a region cannot earn a name, it is not a region.
3. **Roll up; never enumerate.** For a 4,726-file vault the file-path list *alone* is
   ~91,100 tokens — half a context window carrying zero semantics.
4. **Authored semantics are the product.** Derived structure is free and should be
   computed continuously; it is just never sufficient on its own.

---

*Measured 2026-07-29 from live files. Reproduction commands above. Microsoft figures from
the GraphRAG dynamic-community-selection and LazyGraphRAG posts.*
