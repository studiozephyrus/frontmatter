---
mdmap-node: 1
title: The pitch
parent: MAP.md
status: written
---

# The pitch

A project's structure lives in four places that do not talk to each other:

- the **folder tree** — real, but says nothing about meaning
- the **link graph** — derived, untyped, and unreadable past a few hundred nodes
- the **diagram** someone drew once — accurate for about a week
- the **context dump** an AI agent reads — a flat wall of text with no shape at all

`mdmap` is a single markdown file, `MAP.md`, that carries all four and stays honest about
its own drift.

**For the human**, it renders three ways from the same file — a tree, a bounded graph, and
a spatial canvas you author and that never moves on its own. Zoom out and you see named
regions; zoom in and you see documents; zoom in further and you are editing the document
in place.

**For the agent**, it is a ≤2,000-token flat text file, ordered so the non-derivable
things come first: the invariants that will break production if violated, the entry
points, then a ranked and *truncated* list of regions with a navigation contract at the
bottom telling it exactly how to fetch more. It never asks the model to walk a graph,
because models cannot.

**For both**, the same file answers the one question a map should answer and no existing
map does: **what is missing.** Nodes that were planned and never written. Links that
point at nothing. Regions of the repo no map covers. Edges whose target moved. That
report is generated, not maintained — which is the only way a map survives contact with a
real project.

It is recursive. `MAP.md` at the root points at region maps, which point at their own.
Each map is bounded to what fits on one screen and in one context budget. That bound is
the entire defence against the hairball.

It is plain markdown with a YAML header, so it renders on GitHub today, diffs line by
line, merges three ways, and survives the app that made it.

---

**The one-liner:** *markmap maps a document. `mdmap` maps a project.*

**The uncomfortable version:** every graph view ever shipped shows you what you already
did. This one shows you what you haven't done yet.
