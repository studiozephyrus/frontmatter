---
mdmap-node: 1
title: Recursion — maps of maps, and the bound that stops the hairball
parent: MAP.md
status: written
---

# Recursion

The original ask was: one markdown, containing seven markdowns, each containing ten or
eleven, each of which can contain more, without limit. That instinct is right, and it turns
out to be the load-bearing structural decision — not because infinite depth is a feature,
but because **bounded breadth is**.

## The shape

```
MAP.md                          root — 7 regions
├── 01-thesis/MAP.md            11 nodes
│   ├── pitch.md
│   ├── not-a-graph-view.md
│   └── …
├── 03-spec/MAP.md              11 nodes
│   └── format.md
└── src/modules/MAP.md          12 modules
    └── editor/MAP.md           9 files, 3 invariants
```

A `## Regions` row either names a leaf document or names another map. That is the only
recursion rule. It is `SUMMARY.md`'s nested list, DITA's *"topicrefs can reference DITA
topics, other maps, and non-DITA resources"*, and a filesystem — all of which are the same
idea, and all of which work.

Resolution is proximity-based, exactly like `AGENTS.md`: **the closest `MAP.md` above a
file wins.**

## The bound is the point

**A map that exceeds its budget must split, not truncate its meaning.**

That single rule is the entire defence against every failure mode in this category:

- **The hairball never renders**, because no map ever contains 4,000 nodes. Obsidian's own
  staff put the practical graph ceiling at 25,000 files; Cytoscape measures 3 FPS at 3,200
  nodes. Neither number matters if the largest thing you ever draw is ~30 nodes.
- **The token budget holds automatically.** ≤2,000 tokens per map, and depth costs one tool
  call each — which is the progressive-disclosure pattern Anthropic's own Skills use:
  name and description always loaded, body on demand, bundled files navigated only if
  needed.
- **Legibility is preserved at every level.** Ghoniem et al. put node-link's failure at ~20
  vertices. A bounded map lives on the right side of that line by construction; a global
  graph never can.

The recursion is what converts an unbounded problem into a stack of bounded ones. It is the
same reason a road atlas is a book of pages rather than one enormous sheet.

## What each level answers

| level | question | typical size |
|---|---|---|
| root | "what is this project?" | 5–9 regions |
| region | "what is in this area, and what is missing?" | 8–15 nodes |
| leaf map | "what are the invariants here?" | 5–12 nodes, 2–5 invariants |
| document | the actual content | — |

If a level cannot answer its question in one screen, it is the wrong level and should split.

## The disorientation risk, and the fix

Nesting has a documented cost. From HN, on nested canvases:

> "Each time you zoom into a canvas, the transition causes a lost sense of place and space,
> akin to walking into a doorway to a room and wondering why you walked there to begin
> with."

And Bederson — who built Pad++ and Piccolo, i.e. the person with the most standing to be
optimistic — concluded in 2011 that *"the grand vision of a zoomable desktop has never been
broadly achieved."*

Three mitigations, all cheap:

1. **A persistent breadcrumb** across every projection: `frontmatter › src/modules › editor`.
2. **Back/forward moves through nodes, not views**, so the trail is continuous even when
   you switch between tree, graph, and canvas.
3. **Named saved viewports before real nesting.** Apple Freeform's "scenes" — capture a
   framing, name it, rename/replace/reorder, step through with back and forward — give
   roughly 80% of tour mode and breadcrumbs at about 5% of the cost of true nested canvases.
   Ship scenes; nest only if demand is real.

## The failure mode to watch

Over-nesting. Seven regions × eleven nodes × eleven again is 847 files, and nobody
maintains 847 files. The real structure will be shallow and lopsided: two or three regions
carrying most of the weight, the rest as single maps with no children.

`coverage` and the gap report are what keep that honest. A map with three regions and 91%
coverage is healthier than one with forty regions and 30% — and the report says so out
loud rather than leaving it to taste.
