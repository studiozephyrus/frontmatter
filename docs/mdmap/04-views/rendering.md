---
mdmap-node: 1
title: Rendering — the stack, with verified ceilings
parent: MAP.md
status: written
---

# Rendering

## The finding that decides the architecture

**No maintained open-source library gives you both (a) tens-of-thousands-of-nodes WebGL
rendering and (b) true compound nodes — a node that contains other nodes.** Compound-capable
engines (Cytoscape.js, G6 Combos, ReactFlow subflows) top out in the low thousands;
high-scale engines (cosmos.gl, Sigma, force-graph) model a flat node/edge list with no
containment primitive at all.

That is not a gap to engineer around. It is the signal that **"folders + links in one
view" is two visualizations wearing a trench coat.** Build them as two modes over one data
model.

## Verified ceilings

Almost nobody in this space publishes an FPS-vs-N curve. Cytoscape is the exception, on an
M1 MacBook Pro / Chrome:

| graph | Canvas2D | WebGL |
|---|---|---|
| ~1,200 nodes / ~16,000 edges | **20 FPS** | 100+ FPS |
| ~3,200 nodes / ~68,000 edges | **3 FPS** | **10 FPS** |

Read the second row carefully: even with WebGL, 3.2k nodes at 68k edges is 10 FPS, and it
is **edge**-dominated.

| approach | ceiling | source |
|---|---|---|
| Chrome Lighthouse DOM audit | warns ~800 elements, **errors ~1,400** | developer.chrome.com |
| ReactFlow official stress example | **450 nodes** | reactflow.dev |
| ReactFlow, maintainer, 10k nodes | *"React Flow is DOM based and therefore not the best choice… use a canvas based solution like react-force-graph"* | xyflow#3044 |
| ReactFlow, maintainer, 70k nodes with culling already on | *"React Flow is not made for apps like this. You would need to use a webgl/canvas based renderer"* | xyflow#5117 |
| tldraw default | `maxShapesPerPage: 4000` | tldraw source |
| Obsidian Canvas, real hardware | ~40 low-end · ~140 M1 Max/64GB · ~200 Ryzen 9 + RTX 3060 | forum.obsidian.md/t/68609 |
| vis-network, own docs | *"a few thousand nodes and edges"* | vis docs |
| ngraph.forcelayout, own README | *"a few thousand nodes… at 60 FPS"* | repo |
| cosmos.gl | 475k nodes / 1M edges demoed — **no FPS, no hardware stated** | vendor |

Treat every unbenchmarked vendor number as a claim. If a hard scale target becomes real,
build a synthetic 50k-note fixture and measure.

## The recommendation

### Mode 1 — Canvas: build it, don't buy it

**Do not adopt tldraw or Excalidraw as the engine.** Both are shape-drawing engines whose
value is freehand and geometry you do not need. You need cards that are *live CodeMirror
documents* — which means DOM, which means React, which means you get markdown rendering,
text selection, and accessibility for free.

Build the camera yourself: one CSS `transform: matrix(...)` on a single wrapper, written
**outside React** (tldraw's `useQuickReactor` pattern) so panning causes zero re-renders.

Ceiling: **~1,000–2,000 cards** with culling and overscan — 5–10× Obsidian Canvas, and far
above any hand-authored canvas.

Steal from tldraw, all read from source:
- **R-tree spatial index** for O(log n) viewport queries
- **`display:none` culling, never unmount**, excluding selected and editing shapes
- **debounced zoom** above a 500-shape threshold, settling 64 ms after the camera stops —
  every LOD decision reads the stale value, so a pinch-zoom never thrashes React
- **frame labels divided by zoom** so titles stay constant on-screen size
- minimap on a **`<canvas>` element**, not DOM — click inside the viewport rect to
  drag-pan preserving grab offset, click outside to recenter

### Mode 2 — Graph: keep what you have, move layout off-thread

**Keep `react-force-graph-2d`.** 54 KB gzip, MIT, actively maintained, already wired into
[GraphView.tsx](../../../src/modules/graph/presentation/GraphView.tsx), and Canvas2D
handily covers a personal vault.

The highest-value single change is **not** the renderer — it is moving layout into a Web
Worker. `d3.forceManyBody()` is Barnes–Hut O(n log n) with the quadtree **rebuilt every
tick**, and default convergence is 300 ticks. d3's own docs prescribe the fix:
`simulation.stop(); simulation.tick(300);` off the main thread. Layout, not raster, is the
bottleneck — which is why the most advanced engine in the field (cosmos.gl) moved layout
onto the GPU rather than optimizing its renderer.

If you ever exceed ~5k nodes, migrate to **Sigma.js v3 + graphology** — 26 KB gzip, the
smallest serious WebGL option, and graphology hands you centrality and communities on the
same structure plus the only clean out-of-the-box worker layout in the field. Reserve
cosmos.gl for a >50k whole-org story that may never exist.

### Mode 3 — Tree: the one that will actually get used

**`d3-hierarchy`.** `d3.pack()` for the folder overview, `d3.tree()` (Reingold–Tilford) for
the tidy tree. Zero dependencies, deterministic, no simulation, no worker.

Overlay **hierarchical edge bundling** for the wikilinks. Holten 2006 (IEEE TVCG
12(5):741–748) is *literally about this data shape* — its opening line: *"A compound graph
is a frequently encountered type of data set where relations are given between items and a
hierarchy is defined on the items as well."* That is a markdown vault: folders are the
hierarchy, wikilinks are the adjacency. Bundling also surfaces implicit parent-level
adjacency for free — "folder A talks to folder B" emerges from child links.

This is precisely what GitHub Next's repo-visualization looked like, plus the edge layer it
never got. That project is **still labelled a prototype five years on**, and connection
mapping is explicitly listed as undeveloped — the hard part is exactly the part we are
adding.

**Caveat, stated honestly:** Holten's own evaluation was *"informal user studies… with
researchers and graduate students."* Bundling deliberately destroys individual edge
traceability to buy cluster legibility — and path-following is the one task node-link
reliably wins. **Ship bundling as a toggle, unbundled as an option.**

If compound layered layout is ever needed, **elkjs** with
`hierarchyHandling: INCLUDE_CHILDREN` is the only maintained JS engine that does real
nested-container layout, and it ships a worker build.

## Where to spend the layout budget

Purchase 1997 (Graph Drawing '97, LNCS 1353:248–261) tested which aesthetics actually
affect human understanding: **minimising edge crossings is "by far the most important."**
Minimising bends and maximising symmetry matter less. **Angular resolution and orthogonal
grid alignment were not statistically significant.**

So: spend on crossing reduction — which is what ELK's layered algorithm optimises — and
nothing on prettifying angles. And do not run a general force simulation on tree-shaped
data; that is 300 ticks of quadtree rebuild solving a problem the folder hierarchy already
answers.

## Next.js specifics

Every candidate is client-only and needs `dynamic(() => import(...), { ssr: false })` —
[GraphView.tsx](../../../src/modules/graph/presentation/GraphView.tsx) already does this
correctly. Bundle sizes make code-splitting mandatory: G6 400 KB gzip, Reagraph 385 KB,
PixiJS 251 KB, Cytoscape 135 KB, **Sigma 26 KB**. Never in the shared chunk.

One recorded constraint: `@pixi/react@8` has a hard `react >=19.0.0` peer dependency. Fine
here, but note it.

`OffscreenCanvas` has been Baseline widely available since March 2023 — right for the
**graph** mode, wrong for the **card** mode, because it has no DOM access and constrained
text measurement.

## The bonus anti-pattern, and the one most likely to be ignored

The 2026 state of the art in "give me an overview of this codebase" is **Aider's repo map**
— tree-sitter plus graph ranking, rendered as ranked **text** in a 1k-token budget. Not a
picture. GitHub's circle-pack visualization is still a prototype. Sourcetrail, the most
serious commercial attempt at interactive code-structure visualization, was discontinued in
September 2021 and open-sourced.

Budget accordingly. **The canvas is worth building because authoring spatially is valuable,
not because viewing a graph is.**

---

**Sources:** Cytoscape WebGL post (blog.js.cytoscape.org, 2025-01-13) · Lighthouse DOM-size
audit · xyflow discussions #3044 and #5117 · forum.obsidian.md/t/68609 · tldraw source
(`options.ts`, `constants.ts`, `NoteShapeUtil.tsx`, `DefaultMinimap.tsx`) · d3-force and
d3-hierarchy docs · Holten 2006 · Purchase 1997 · Wettel & Lanza, ICSE 2011 · Ghoniem,
Fekete & Castagliola, *Information Visualization* 4(2), 2005 · aider.chat/docs/repomap.html
· githubnext.com/projects/repo-visualization.
