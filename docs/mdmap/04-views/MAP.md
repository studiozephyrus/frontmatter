---
mdmap: 1
scope: docs/mdmap/04-views
title: Views — tree, graph, canvas
parent: ../MAP.md
rank: 0.77
---

# Views

## Orientation

One `MAP.md` renders three ways. They are not three features — they are three visual
encodings, each correct for a different job, sharing one selection state and one history.
Switching between them animates rather than cuts, because the animation is what teaches
you they are the same thing.

## Invariants

- **Bounded by default.** A view shows one map. Never the whole vault unless asked twice.
- **Nothing moves on its own.** New nodes get placed; placed nodes keep their coordinates
  until a human drags them.
- **Cull with `display:none`, never unmount.** Obsidian Canvas degrades at ~40 nodes on
  low-end hardware, ~140 on an M1 Max / 64 GB, and ~200 on a Ryzen 9 5900X + RTX 3060 —
  and the thread's own diagnosis is that it happens *"when some elements appear/disappear
  from the viewport."* Panning with everything already mounted causes no freezes.
- **Never make the human walk what a computer can rank**, and never make the model walk
  anything at all.

## The three jobs

| view | encoding | the one job it wins | evidence |
|---|---|---|---|
| **Tree** | `d3.pack()` circle-packing / `d3.tree()` tidy tree over `contains` | hierarchy, overview, "where does this live" | #1 user request verbatim: *"Prioritize folder structure as the graph structure. Like, show connections as a secondary function or layer."* CodeCity's controlled experiment (41 participants, ICSE 2011) found a spatial overview beat a file-tree baseline by **+24.26% correctness / −12.01% time** — and it was a city/treemap, **not** node-link |
| **Graph** | bounded node-link from a focus node, depth 2 | **path finding** — and only that | Ghoniem et al. 2005: past ~20 vertices, matrices beat node-link on most of seven tasks; *"Only path finding is consistently in favour of node-link"* |
| **Canvas** | authored coordinates, persisted | spatial *authoring* — meaning you put there yourself | The category's honest conclusion: the canvas is worth building because **authoring** spatially is valuable, not because **viewing** a graph is |

## Regions

| node | status | what it holds |
|---|---|---|
| [[rendering]] | written | the library stack, verified ceilings, what to build vs buy |
| [[semantic-zoom]] | written | the Google-Maps ladder, and the debounce that makes it cheap |
| [[doi-focus]] | written | Furnas 1986 as a slider, replacing the binary local-graph toggle |
| [[trails-ui]] | planned | breadcrumbs, back/forward, saved scenes, tour mode |
| [[gap-visuals]] | planned | ghosts dashed, broken red, uncovered as terra incognita |
| [[search-in-view]] | planned | Excalidraw's zoom-only-if-illegible rule |
| [[transitions]] | planned | tree ↔ graph ↔ canvas as animated re-layout, not a cut |
| [[cards]] | planned | reference-don't-own; per-instance presentation |
| [[minimap]] | planned | canvas-element, click-in-to-drag, click-out-to-recenter |
| [[keyboard]] | planned | the whole map without a mouse |
| [[mobile]] | planned | what survives on a phone; probably tree + trails only |

## Relations

| from | edge | to | why |
|---|---|---|---|
| rendering | contradicts | trails-ui | DOM cards cap ~1–2k; graph mode must be a different renderer |
| doi-focus | supersedes | graph depth toggle | the principled version of the same idea |
| semantic-zoom | depends-on | rendering | LOD tiers must read debounced zoom, never live |
| cards | derived-from | Heptabase | *"Whiteboards don't own cards; they reference them from the Library"* |
| gap-visuals | implements | ../03-spec/gaps | the report, made spatial |

## Gaps

- **No maintained library gives both high-scale WebGL and true compound (nested) nodes.**
  Compound-capable engines top out in the low thousands; high-scale engines have no
  containment primitive. This is why tree and graph are two modes, not one hybrid.
- Mobile is unresolved and probably should be scoped out of v1 entirely.

## Navigate

[[rendering]] for the build decision. [[semantic-zoom]] and [[doi-focus]] for the two
mechanics that decide whether it feels like a map or a mess.
