---
mdmap: 1
scope: docs/mdmap/06-product
title: Product — how mdmap lands in frontmatter
parent: ../MAP.md
rank: 0.70
---

# Product

## Orientation

`mdmap` is not a new product. It is a feature of frontmatter that happens to also be a
portable file format — which means it can be shipped incrementally, tested cheaply, and
open-sourced later without changing the app. The existing product plan already has
"Canvas / whiteboard" as a deferred XL item in Phase 5. This reframes it as something much
smaller that starts much earlier.

## Invariants

- **Ship the CLI before the canvas.** `mdmap check` has no rendering dependency, no design
  risk, and no scale ceiling. If its output is not useful, nothing downstream is.
- **Never upload the vault.** The willingness-to-pay signal came with this condition
  attached, explicitly: *"I definitely want a sturdy legal agreement in place before I ship
  IP off to someone's systems."* Map generation is local and deterministic. That is a
  feature, not a limitation.
- **Sell to developers and docs teams, not to PKM hobbyists.** The corpus is unambiguous:
  hobbyists pay for the editor and treat the graph as a free toy; developers pay for
  navigation with a local-first guarantee.
- **The free tier must include the gap report.** It is the adoption surface. Paywalling the
  linter kills the loop.

## The four phases

**Phase A — `mdmap check` (days, not weeks).** A CLI that walks a directory, parses
`MAP.md` files, resolves links, and prints six lists. Run it on this repo. Run it on `md`
(4,726 files). If the output is boring, stop here — the concept is disproven cheaply.

**Phase B — `MAP.md` in the editor.** Render the map file as a tree in the existing
three-pane layout. Reuse [GraphView.tsx](../../../src/modules/graph/presentation/GraphView.tsx)
for the bounded graph projection, with the local-graph toggle flipped to default-on and the
layout moved to a worker. No new renderer yet.

**Phase C — the canvas.** DOM cards with a hand-rolled camera, `display:none` culling,
semantic zoom, persisted coordinates. Emits and ingests JSON Canvas 1.0 for Obsidian
interop. This is the deferred B1 item, now with a spec behind it.

**Phase D — the agent surface.** `MAP.md` as a skill or `paths:`-scoped rule; permissioned
write-back so an agent can propose map edits as a reviewable diff. Nothing here works
without Phase A's reconciler.

## Regions

| node | status | what it holds |
|---|---|---|
| [[phases]] | planned | the four phases with exit criteria and effort |
| [[pricing]] | planned | what is free, what is paid, and why the linter must be free |
| [[positioning]] | planned | "the map your repo checks itself against" |
| [[buyer]] | planned | devs and docs teams; the local-first purchase condition |
| [[fit-with-plan]] | planned | how this reorders B1/Phase 5 in the existing product plan |
| [[distribution]] | planned | published maps as the growth loop; the Obsidian plugin path |
| [[competition]] | planned | Windsurf Codemaps, Chorographia, md2map, DeepWiki |
| [[metrics]] | planned | did anyone author an invariant? the only metric that matters early |
| [[risks]] | planned | Obsidian ships it; context windows eat it; nobody authors |
| [[naming-in-product]] | planned | is it a feature name or a separate brand |
| [[obsidian-interop]] | planned | JSON Canvas round-trip, and the plugin as distribution |

## Relations

| from | edge | to | why |
|---|---|---|---|
| phases | depends-on | ../03-spec/gaps | Phase A *is* the gap report |
| pricing | contradicts | distribution | the free linter is the distribution; do not paywall it |
| positioning | derived-from | ../01-thesis/the-gap-is-the-product | linter, not wallpaper |
| fit-with-plan | supersedes | FRONTMATTER-PRODUCT-PLAN §Phase 5 "canvas, deferred XL" | smaller, earlier, spec-first |
| risks | contradicts | phases | item 1 (Obsidian ships it) invalidates the whole sequence |
| distribution | derived-from | Relay's Obsidian-plugin path | 172,544 downloads via "integrates with your vault" |

## Gaps

- **`metrics` is the most important unwritten node here.** The early question is not usage
  or revenue — it is whether a single human ever writes an invariant into a `MAP.md` that
  the generator did not put there. Everything else is downstream of that.
- No pricing number is defensible yet. The existing plan anchors individual paid at
  **$4/mo** and team seats at **$5/seat**; where a map feature sits against those is unknown.

## Navigate

[[phases]] is the actionable node and is unwritten. The one-line version: **build
`mdmap check` this week, against this repo, and see whether the output makes you want to
fix something.**
