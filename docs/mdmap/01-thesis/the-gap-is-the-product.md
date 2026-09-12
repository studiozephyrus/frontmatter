---
mdmap-node: 1
title: The gap is the product
parent: MAP.md
status: written
---

# The gap is the product

If only one idea survives from all of this, it should be this one.

## The reframe

Every map ever built answers *"what is here?"* — and that is why they all end up as
wallpaper. You already know what is here. You made it.

The map that gets used answers *"what is missing?"*

The evidence is one exchange in the demand corpus, and it is the only place in thousands of
comments where a graph view is described as having earned its keep:

> "The graph view isn't useful to show me what I **already did**, instead, it shows me what
> **I haven't done yet**."

> "you weren't using graph to discover connections. you were using it to discover gaps.
> that's a completely different job, and maybe that's why it actually worked where it fails
> for most people."

And the corroboration, from someone describing the one thing they do use it for and
resenting the tool for it:

> "it's a fun toy. yes, we use it to check for orphans. no, that isn't a good way to check
> for orphans; it's just what we have. **an orphan report should be built in.**"

Orphan-hunting is the surviving real job. People are doing it *through a picture* because
nobody gave them a report.

## What changes if you take this seriously

| if the map is "what's here" | if the map is "what's missing" |
|---|---|
| a picture | a **linter** |
| looked at monthly | run on every commit |
| screenshotted, praised, closed | fails a build |
| grows with the project | **shrinks** as you close gaps |
| decorative — hence *"productivity porn"* | operational |
| success = looks impressive | success = the report is empty |

That last row is the tell. A map whose ideal state is *empty* cannot be productivity porn.
It is the same psychological contract as a test suite.

## The six gaps

Defined in [[../03-spec/gaps]]. In one line each:

- **ghost** — declared in the map, no file behind it. *The plan.*
- **broken** — an edge pointing at nothing. *The bug.*
- **orphan** — a file no map reaches. *The forgotten work.*
- **uncovered** — a region of the repo no map claims. *Terra incognita.*
- **stale** — the map's commit is behind and a referenced file changed. *The rot, caught.*
- **over-budget** — the core exceeds its token ceiling. *The bloat, caught.*

## Why nobody else can ship this

Not because it is hard, but because of what it requires: **an authored layer and a derived
layer, kept separately, and diffed.**

- Tools with only a **derived** layer (Obsidian's graph, graphify, Chorographia) have
  nothing to diff against. Everything they show is by definition current, so they can never
  say "this is missing" — only "this exists." [[../02-evidence/graphify-hairball]] measures
  where that ends: 1.76% of the navigation layer was legible.
- Tools with only an **authored** layer (MOCs, hand-drawn diagrams, `SUMMARY.md`, DITA maps)
  have nothing to check against. They rot, silently, and everyone knows it: *"their
  loadbalancer diagram was 5 years out of date when I got there."*

The reconciler is the whole invention. Everything else in this concept — the three
projections, the canvas, the recursion, the trails — is a delivery mechanism for a diff
between what a human claimed and what a machine found.

## The consequence for the roadmap

Build `mdmap check` first. Before the canvas, before semantic zoom, before the spec, before
the name is even settled.

It is a CLI that reads markdown, walks a directory, and prints six lists. It has no
rendering dependency, no design risk, and no scale ceiling. It is testable in an afternoon
against this repo, and if nobody finds its output useful, none of the rest is worth
building.

That is also the cheapest possible way to run the experiment in [[steelman]] §4 — *will
anyone actually author the semantic layer?* — because a gap report is exactly the nag that
makes someone do it.
