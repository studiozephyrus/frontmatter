---
mdmap-node: 1
title: Three projections of one file
parent: MAP.md
status: written
---

# Three projections

The structural claim: **tree, graph, and canvas are not three features. They are three
visual encodings of one file**, and the switch between them is animated so that you learn
they are the same object.

```
                        MAP.md
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
      TREE              GRAPH            CANVAS
   contains edges   links + typed     authored (x,y)
   d3.pack /        bounded, depth 2  from sidecar
   d3.tree          from a focus node persisted, stable
        │                 │                 │
   "where does        "how does        "what did I
    this live"        this connect"     decide here"
        └─────────────────┼─────────────────┘
                          │
                    FLAT RANKED TEXT
                      (the agent)
                    never an edge list
```

## Why three and not one

Each wins exactly one job, and the evidence for the split is stronger than the evidence for
any hybrid.

**Tree wins hierarchy.** The single most-upvoted concrete request in the demand corpus:
*"Prioritize folder structure as the graph structure. Like, show connections as a secondary
function or layer."* And the only controlled experiment in this whole space — CodeCity,
41 participants across 3 countries, ICSE 2011 — found a spatial overview beat a file-tree
baseline by **+24.26% correctness and −12.01% time**, using a **city/treemap** encoding, not
node-link.

**Graph wins path-finding, and nothing else.** Ghoniem, Fekete & Castagliola (2005) is
unambiguous: past ~20 vertices matrices beat node-link on most of seven tasks, and *"Only
path finding is consistently in favour of node-link."* So the graph projection exists to
answer "how does this reach that," bounded, from a focus, at depth 2. It is not the home
screen.

**Canvas wins authoring.** Not viewing — authoring. Meaning you place there yourself,
persisted, that no algorithm could have derived. This is the half that Heptabase, Scrintal,
and Muse got right and that every file-based tool lacks.

**And the agent gets a fourth projection that is not visual at all**: a flat ranked list.
It never sees an edge, because models score 10–23% counting edges in a 20-node graph.

## The mechanic that makes it feel like one thing

**Shared selection and shared history.** Select `editor` in the tree, switch to graph, and
`editor` is the focus node. Switch to canvas, and the camera is already centred on
`editor`'s card. Back/forward move through *nodes*, not through views — so the trail is
continuous across projections.

The transition is an animated re-layout, never a cut. That animation is doing real work: it
is the only cheap way to teach that the folder you were looking at and the cluster you are
now looking at are the same set of documents.

## The engineering consequence

You cannot build this as one view. **No maintained library offers both high-scale rendering
and true compound (nested) nodes** — compound-capable engines cap in the low thousands, and
high-scale engines have no containment primitive. That constraint is not an obstacle; it is
confirmation that folders and links are two visualizations, and the honest architecture is
two renderers over one data model. See [[../04-views/rendering]].

## What this is not

It is not "a graph view with tabs." The tabs are the cheap part. The claim is that one
authored, budget-enforced markdown file is a rich enough source that three genuinely
different encodings can be projected from it *and* an agent can read it — and that no
existing artifact clears that bar. `.canvas` has coordinates but no hierarchy. `SUMMARY.md`
has hierarchy but no edges. `resolvedLinks` has edges but no types and no positions. Each
one is a projection missing its source.
