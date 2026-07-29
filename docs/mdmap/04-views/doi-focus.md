---
mdmap-node: 1
title: Degree of interest — the slider that replaces the depth toggle
parent: MAP.md
status: written
---

# Degree of interest

The best single piece of theory found in the entire research sweep, and it is forty years
old.

## Furnas 1986

*Generalized Fisheye Views*, CHI '86. The formula:

```
DOI(x) = API(x) − D(x, focus)
```

**A priori importance** minus **distance from the current focus**. Items below a threshold
are dropped or rendered at reduced detail. High-importance items stay visible even when
distant; low-importance items disappear as distance grows.

That is a two-line function and it solves the hairball more completely than any renderer.

## Why it matters here

Every existing tool ships a crude, binary version of this and stops:

- Obsidian: a **local graph with a depth slider** — that is `D(x, focus)` with a hard
  cutoff and `API(x)` set to zero for everything.
- frontmatter today: [GraphView.tsx](../../../src/modules/graph/presentation/GraphView.tsx)
  has a `localGraph` toggle — the same thing, binary.
- RemNote: right-click → **"Set as Center"** — focus without importance.

None of them weight by importance, which is why a hub note and a stub note are equally
likely to vanish at depth 3.

## The implementation, concretely

`API(x)` — a priori importance — is already computable from things this repo has:

| signal | source | why |
|---|---|---|
| in-degree (backlink count) | the resolved link graph | the cheapest useful prior |
| PageRank | the same graph | Aider's proven choice for exactly this problem |
| is-a-MOC / region root | `groupForTags()` in [graph-data.ts](../../../src/modules/graph/presentation/graph-data.ts) already computes a `moc` group | maps are structurally important |
| authored rank | the `rank` column in `## Regions` | **the human override, which nothing else has** |
| recency of edit | `git log` | what you are actually working on |

`D(x, focus)` — graph distance from the active node, over the union of `contains` and
`links` edges. Typed authored edges get a shorter effective distance than derived ones,
because `depends-on` is a stronger statement than "these two files mention each other."

Then: one slider. Left = just this node. Right = the whole map. **Continuous, not binary**,
and importance-weighted so hubs survive distance.

## Why this beats a depth cutoff

At depth 2 from a leaf file you get a random neighbourhood. Under DOI you get the leaf, its
immediate neighbours, **and the three hub documents that anchor the region** — because their
`API` is high enough to survive the distance penalty. That is the difference between a
subgraph and an orientation.

It also gives semantic zoom its filter for free: z0 shows only nodes above a high DOI
threshold, z3 shows everything within a short distance. One function drives both.

## Cue-based, not distortion-based

Cockburn, Karlson & Bederson's taxonomy (*ACM Computing Surveys* 41(1), 2008) separates
four families by how they separate focus from context: **overview+detail** (spatial —
minimap), **zooming** (temporal — semantic zoom), **focus+context** (embedded — fisheye),
and **cue-based** (selectively highlight or suppress).

Prefer **cue-based**. Dim and shrink low-DOI nodes; do not geometrically distort them.
`GraphView.tsx` already does hover-adjacency dimming, which is the cheapest member of the
cheapest family — and crucially, it is the only approach that **never moves anything**, so
it can never disorient. Classic fisheye distortion moves everything, which collides
head-on with the stability complaint:

> "One node moved can make neighbouring clusters explode their innards out."

## The one authored input

The `rank` column in a map's `## Regions` table is a human saying *this matters more than
that*. No derived signal can produce it, and it is the difference between a DOI function
that reflects your project's link topology and one that reflects your judgement.

That is the same pattern as the rest of the concept: **derive the reality, author the
meaning.**

---

**Sources:** Furnas, CHI '86, DOI 10.1145/22627.22342 · Cockburn, Karlson & Bederson, *ACM
Computing Surveys* 41(1), 2008, DOI 10.1145/1456650.1456652 (taxonomy verified; per-task
verdicts not) · Aider `repomap.py` · stability quote via Reddit, 2026-07-29.
