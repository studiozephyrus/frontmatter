---
mdmap: 1
scope: docs/mdmap/01-thesis
title: Thesis — what mdmap is and why it isn't a graph view
parent: ../MAP.md
rank: 1.00
---

# Thesis

## Orientation

Three separate things are true at once, and their intersection is empty:

1. Every knowledge tool that stores plain markdown either has **no map at all** or has a
   graph view its own users call decoration.
2. Every tool with a genuinely good spatial surface stores its data in a **proprietary
   database**, not files.
3. Every artifact that makes a project legible to an **agent** is invisible text with no
   human surface, and every artifact that is legible to a **human** is a picture no agent
   can use.

`mdmap` is one file that closes all three. Not by being a better renderer — by being a
different kind of object: an **authored, compressing, self-checking** map that a human
reads as a picture and an agent reads as a ranked list, from the same bytes.

## Invariants

- The thesis is not "graph views are bad." It is **"derived-only maps cannot carry meaning,
  and authored-only maps rot."** mdmap is derived *and* authored, with a reconciler between.
- If the map is not smaller than the thing it maps, it has failed. See [[../02-evidence/graphify-hairball]].
- The map's job is to show you **what is missing**, not what you already made.

## Regions

| node | status | what it argues |
|---|---|---|
| [[pitch]] | written | the 200-word version |
| [[not-a-graph-view]] | written | why every graph view failed and why this isn't one |
| [[steelman]] | written | the strongest case against building this, answered |
| [[three-projections]] | written | tree / graph / canvas as views of one file |
| [[why-now]] | written | the 2026 window, and why it is narrow |
| [[recursion]] | written | maps of maps, and the bound that stops the hairball |
| [[the-gap-is-the-product]] | written | the single reframe the whole thing rests on |
| [[markdown-as-substrate]] | planned | why markdown and not JSON, YAML, or SQLite |
| [[naming-the-object]] | planned | is it a map, an atlas, an index, or a contract |
| [[failure-conditions]] | planned | what would prove this wrong |
| [[prior-thinkers]] | planned | Bush's trails, Nelson's transclusion, Engelbart's view control |

## Relations

| from | edge | to | why |
|---|---|---|---|
| not-a-graph-view | depends-on | ../02-evidence/demand | the critique is quoted, not asserted |
| steelman | contradicts | pitch | deliberately; the pitch must survive it |
| three-projections | implements | ../03-spec/format | one file, three renderers |
| the-gap-is-the-product | supersedes | not-a-graph-view | the positive claim beats the negative one |

## Navigate

Start at [[pitch]]. If you are already sceptical, start at [[steelman]].
