---
mdmap-node: 1
title: The gap report — the feature the whole thing rests on
parent: MAP.md
status: written
---

# The gap report

Everything else in `mdmap` is table stakes. This is the part nobody ships.

## The reframe

The only quote in the entire demand corpus where a graph view earned its keep:

> "The graph view isn't useful to show me what I **already did**, instead, it shows me what
> **I haven't done yet**."

and the reply that named why:

> "you weren't using graph to discover connections. you were using it to discover gaps.
> that's a completely different job, and maybe that's why it actually worked where it
> fails for most people."

A map of what exists is decoration. A map of **what is missing** is a linter. Linters get
run; wallpaper gets screenshotted once.

## `mdmap check` — six findings

| finding | definition | why it matters |
|---|---|---|
| **ghost** | a node declared in a map with no file behind it | the plan, made visible. mdBook's `[Draft]()`. |
| **broken** | an edge whose target does not exist | today [graph-data.ts:132](../../../src/modules/graph/presentation/graph-data.ts#L132) silently drops these |
| **orphan** | a file with no inbound edge from any map | the one job people actually use graph views for — *"an orphan report should be built in"* |
| **uncovered** | a file under `scope:` reachable from no map | the honest measure of `coverage:` |
| **stale** | the map's `commit:` is behind, and a referenced file changed | the anti-rot mechanism |
| **over-budget** | the core exceeds `budget:` | a budget that is not enforced is not a budget |

Output is markdown, so it lands in a PR comment, a CI log, or an agent's context
unchanged:

```
mdmap check .

  ghosts      24   crdt-multiplayer, notion-importer, +22
  broken       3   docs/adr/0002 ← referenced by 03-spec/format
  orphans      7   src/modules/ai-tools/*, no inbound edge
  uncovered   41   docs/research/* not reachable from any map
  stale        2   src/modules/editor/MAP.md @ 3f21a9 → HEAD 8eb4de2
  over-budget  0

  coverage 0.61  (237/392 files)
```

## Why this is the anti-rot mechanism

Docs rot is the universal objection to every visual artifact, and the corpus states it
plainly:

> "It is extremely hard to keep documentation up to date without a full time technical
> writer (GitHub had none). … a great example was how their loadbalancer diagram was 5
> years out of date when I got there."

> "No one likes to maintain diagrams. We should turn this around somehow: the code should
> 'be' architecture diagrams."

There are only two known answers and both are partial:

1. **Fully derive it.** Then you get graphify's outcome: 273 files → 3,848 nodes and 341
   communities, **329 of them named `Community 11` … `Community 339`**. Fresh and
   meaningless. See [[../02-evidence/graphify-hairball]].
2. **Fully author it.** Then it rots, exactly as quoted above.

`mdmap check` is the third answer: **author the meaning, derive the reality, and publish
the difference.** The map is allowed to be wrong; it is not allowed to be *silently*
wrong. Every finding above is a diff between a human claim and a machine fact.

Windsurf Codemaps takes the adjacent position — *"codemaps are based on snapshots of your
code when you run them; technically there's nothing to maintain, because you just rerun
them if you need to."* That works when the artifact is disposable. It does not work when
the artifact carries authored invariants worth keeping. The reconciler is what lets you
keep the authored layer *and* rerun.

## Gaps are first-class nodes, not a report footer

A ghost renders on the canvas as a dashed outline in its intended position. A broken edge
renders red. An uncovered region renders as grey unclaimed territory at the edge of the
map — literally *terra incognita*.

That is the visual language, and it is the one thing a map can do that a list cannot:
**show you the shape of the hole.**

## CI contract

```yaml
- run: mdmap check --max-broken 0 --max-over-budget 0 --min-coverage 0.6
```

A map that cannot fail a build is a map nobody updates.

---

**Sources:** demand quotes gathered 2026-07-29, URLs in [[../02-evidence/demand]] ·
graphify figures measured from `~/Desktop/GitHub/knowledge/graphify-out/GRAPH_REPORT.md`,
built from commit `464eb666` · Windsurf Codemaps quote via Hacker News.
