---
mdmap: 1
scope: docs/mdmap/03-spec
title: Spec — the MAP.md format
parent: ../MAP.md
rank: 0.94
---

# Spec

## Orientation

`MAP.md` is a markdown file with a YAML header. The header carries the contract
(version, provenance, budget, coverage); the body carries the map in sections a human
reads top-to-bottom and a parser reads by heading. Layout coordinates live in a sidecar so
the document stays diffable. Nothing here is invented that already exists somewhere else.

## Invariants

- **Required keys: exactly one.** `mdmap: 1`. Everything else is optional and degrades.
- **All non-reserved frontmatter lives under `x:`.** Hugo's `params` rule. The alternative
  is colliding with your own future reserved keys.
- **Node IDs are human-readable slugs, never opaque numerics.** This is the first of
  Sourcegraph's four stated reasons for replacing LSIF with SCIP.
- **The edge array is called `edges`, not `links`.** NetworkX renamed exactly that across
  3.x; do not repeat it.
- **A map that exceeds `budget:` must split, not truncate its meaning.**

## Regions

| node | status | what it holds |
|---|---|---|
| [[format]] | written | the full draft-0 format, with every borrowing attributed |
| [[gaps]] | written | `mdmap check` — the six findings, and why this is the product |
| [[edge-vocabulary]] | planned | the closed set, mapped to SKOS + DCMI URIs |
| [[trails]] | planned | saved walks; heading-anchored, not line-anchored |
| [[recursion-rules]] | planned | proximity resolution, split thresholds, cycle handling |
| [[layout-sidecar]] | planned | `.mdmap/layout.json` and JSON Canvas 1.0 interop |
| [[ranking]] | planned | Aider's multipliers + PageRank, ported and justified |
| [[schema]] | planned | JSON Schema 2020-12 at a stable versioned URL |
| [[cli]] | planned | `mdmap init | show | check | open | trail` |
| [[conformance]] | planned | what a "conforming reader" must do; the llms.txt lesson |
| [[versioning]] | planned | how v2 happens without killing v1 files |

## Relations

| from | edge | to | why |
|---|---|---|---|
| format | derived-from | mdBook SUMMARY.md | ghost nodes, nested-list tree |
| format | derived-from | DITA reltable | typed non-hierarchical edges |
| format | derived-from | llms.txt | the `## Optional` budget marker |
| format | derived-from | JSON Canvas 1.0 | `file` + `subpath` fragment binding |
| format | contradicts | JSON Canvas 1.0 | coordinates belong in a sidecar, not the doc |
| gaps | supersedes | format | if only one section ships, ship this one |
| ranking | derived-from | Aider repomap.py | multipliers, sqrt damping, personalization |
| schema | depends-on | JSON Schema 2020-12 | stable; the post-2020-12 release has not shipped |

## Gaps

- `edge-vocabulary` must resolve whether authored edges are a **closed** set (validatable)
  or open (adoptable). Closed is better for a linter; open is better for adoption.
- No conformance suite exists. Without one this is a document, not a spec.

## Navigate

Read [[format]] first, then [[gaps]]. Everything else is planned.
