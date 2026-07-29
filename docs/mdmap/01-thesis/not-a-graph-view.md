---
mdmap-node: 1
title: Why this is not a graph view
parent: MAP.md
status: written
---

# Why this is not a graph view

Graph views have been shipped by Obsidian, Logseq, Roam, RemNote, Foam, org-roam, Anytype,
Juggl, and a dozen others. Their own users describe them the same way everywhere. That
consistency is data, and it should be read as a spec for what *not* to build.

## The six failure modes, in users' words

**1. Unbounded is wallpaper.** Top comment of the largest thread on the subject, 157 upvotes:

> "Local graph view, yes, very useful. Global graph view, no, just a pretty mess to look at."

> "global graph is the showroom, local graph is the workshop."

**2. A hand-linked graph is a mirror, not a lens.** The epistemic objection, and the one
that actually kills the category:

> "you make the links yourself, so the graph only ever shows you what you already know. it
> can't surprise you. the one thing it should be best at, showing connections you missed,
> is the one thing it literally can't do because everything in it is manual."

**3. It answers no question anyone had.** Users repeatedly cannot name the job:

> "I'm struggling to imagine how it's useful in any context tbh. Isn't it just an aesthetic
> thing? Like what can you do other than appreciate the evolving shape of things?"

**4. Force layout destroys spatial memory.**

> "With many nodes in the graph, when they interact via the forces, the whole arrangement
> is quite unstable and chaotic. One node moved can make neighbouring clusters explode
> their innards out."

**5. It is read-only.**

> "If there's no way to actually interact with the graph view (create notes, links, etc.),
> it's just for aesthetics."

**6. It carries reputational cost.**

> "It's just productivity porn."
> "It's like those led strips behind a desk, looks nice in photos but doesn't actually
> improve my workflow."

## The structural reason, not the aesthetic one

The failures above are usually blamed on rendering. They are not rendering problems.

Obsidian's entire link index is one type:

```ts
MetadataCache.resolvedLinks: Record<string, Record<string, number>>
//                                  source path → target path → count
```

Source file → target file → a count. That is the ceiling. `[[Note#Heading]]` and
`[[Note#^block]]` both collapse into the same file→file edge. **Headings are not nodes.
Blocks are not nodes. Edges have no type.** No amount of WebGL fixes a data model with
one edge type and no hierarchy.

And there is a hard research result that should end the argument about prettier layouts.
Ghoniem, Fekete and Castagliola (*Information Visualization* 4(2), 2005) ran a controlled
comparison of node-link diagrams against adjacency matrices:

> **beyond roughly twenty vertices, matrix-based representations outperform node-link
> diagrams on most of the seven tasks tested. Only path finding is consistently in favour
> of node-link.**

Twenty. Every real vault passes that on day one. A node-link picture of a whole project is
the wrong visual encoding for six of seven jobs, and no library choice changes that.

## What mdmap does instead

| Failure | mdmap's answer |
|---|---|
| Unbounded hairball | Bounded by construction. A map covers one region. Depth is recursion into another map, never more nodes on one screen. |
| Mirror, not lens | Edges are **derived AND authored**. Derived edges are free and always fresh; authored typed edges (`depends-on`, `supersedes`, `decided-in`) carry the meaning a link cannot. |
| No job | The job is stated: **find what is missing.** Orphans, ghosts, broken edges, uncovered regions, stale entries — a generated report, not a picture. |
| Layout instability | Coordinates persist in a sidecar. New nodes are placed; **existing nodes never move.** |
| Read-only | The map is a document. You edit it. So can an agent, as a reviewable diff. |
| Productivity porn | The headline surface is a **gap report**, not a screenshot. It is closer to a linter than to wallpaper. |

## The honest concession

Node-link wins at exactly one task: **path finding**. So that is the one thing the graph
projection is for — "how does this connect to that," bounded, from a focus node, depth 2.
The tree does hierarchy. The canvas does authored spatial meaning. The graph does paths.
Three tools, not one picture pretending to do everything.

---

**Sources:** user quotes gathered via Reddit (r/ObsidianMD) and Hacker News, 2026-07-29 —
see [[../02-evidence/demand]] for URLs. `resolvedLinks` type from
`docs.obsidian.md/Reference/TypeScript+API/MetadataCache/resolvedLinks`. Ghoniem et al.
via *Information Visualization* 4(2), 2005.
