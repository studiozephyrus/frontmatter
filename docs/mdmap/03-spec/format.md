---
mdmap-node: 1
title: The MAP.md format — draft 0
parent: MAP.md
status: written
---

# `MAP.md` — format, draft 0

Not a spec yet. A draft with every borrowed decision attributed, so it can be argued
with rather than admired.

## 0. Design rules

1. **Markdown, not JSON.** The map is prose a human maintains. Anything that is not prose
   goes in the YAML header or a sidecar.
2. **Borrow, never invent.** Every construct below comes from something that already
   works. Where nothing exists, say so.
3. **Compress or die.** Always-on core ≤ `budget:` tokens, default 2,000.
4. **Degrade gracefully.** A `MAP.md` with no header, no tables, and no coordinates is
   still a valid map — a nested list of links, exactly like `SUMMARY.md`.
5. **Namespace user keys.** All non-reserved frontmatter goes under `x:`. This is Hugo's
   `params` rule, learned the hard way — Hugo's docs say outright *"you cannot create a
   custom field named `type`."*

## 1. File anatomy

Section order is not cosmetic. Lost-in-the-Middle (Liu et al., 2307.03172) measures
GPT-3.5-Turbo over 20 documents at **75.8% first / 53.8% middle / 63.2% last**, against a
**56.1%** closed-book baseline — mid-context is *worse than not retrieving at all*. So the
non-derivable content goes first, the enumerable structure goes in the middle where decay
costs least, and the thing the agent acts on next goes last.

```
---
mdmap: 1                    # spec version — required, and the only required key
scope: src/modules/editor   # what this map covers
title: …
parent: ../MAP.md           # null at root
generated: 2026-07-29T02:35:00Z
commit: 8eb4de2             # provenance: the tree state this was true for
coverage: 0.78              # fraction of files under scope reachable from this map
budget: 2000                # token ceiling for the core, enforced at write time
x:                          # everything non-reserved lives here, forever
  team: editor
---

# <name> — <one line>

## Orientation      ~120 tok   3–5 sentences. Non-derivable only.
## Invariants       ~600 tok   rule → failure mode → executable check   ← the payload
## Entry points     ~250 tok   where execution or reading actually starts
## Regions          ~700 tok   ranked, rolled up, visibly truncated
## Relations        table      typed edges, one per line
## Gaps             generated  ghosts, orphans, broken, stale, uncovered
## Recipes          ~200 tok   "to do X: touch A→B→C, verify with `cmd`"
## Optional         —          drop this first under budget pressure
## Navigate         ~80 tok    the exact commands to get more.  LAST.
```

`## Optional` is lifted verbatim from `llms.txt` — the one genuinely good idea in that
spec that nothing else has, and it is exactly right here.

## 2. `## Invariants` — the section that justifies the file

Anthropic's own CLAUDE.md exclude-list names **"File-by-file descriptions of the
codebase"** and **"Anything Claude can figure out by reading code."** That ban is correct.
An agent with grep re-derives your file tree in two tool calls.

What it can never re-derive is the invariant. The unit is **rule → failure mode →
executable check**:

```markdown
- **Any new file in `public/` is auto-allowlisted by extension in `src/proxy.ts`.**
  Failure: agent adds an asset, forgets the proxy, auth 307s the URL to `/login`,
  browser shows a broken image.
  Check: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/<asset>` → 200.
  307 means you broke it.
```

That example is not invented — it is this repo's own [AGENTS.md](../../../AGENTS.md), and
it was independently identified in research as the best exhibit of the pattern found
across the whole survey. It is worth 100× its token weight, and no ranking algorithm can
produce it.

**Invariants are never deleted, only invalidated** — Zep/Graphiti's discipline. A
superseded invariant keeps its line and gains `invalidated: <date>` so the agent sees the
correction rather than a silent rewrite.

## 3. `## Regions` — ranked, rolled up, visibly truncated

```markdown
| region | rank | what it holds |
|---|---|---|
| [[editor/MAP]] | 0.94 | CodeMirror 6 engine, modes, live preview |
| [[repository/MAP]] | 0.91 | GitHub as vault, merge3, baseSha concurrency |
| … 14 more — run `mdmap show --scope src/modules` |
```

Three rules, each with a reason:

- **Roll up, never enumerate.** For a 4,726-file vault, the file-path list *alone* is
  ~91,100 tokens — half a context window for a listing with zero semantic content.
- **Rank with a real algorithm.** Port Aider's multipliers wholesale: identifiers ≥8 chars
  and multi-word ×10, `_`-prefixed ×0.1, defined in >5 files ×0.1, reference counts
  `sqrt`-damped, then PageRank with personalization toward what you are working on. They
  are pure string statistics, cost nothing, and encode real taste about what is
  *project-specific* rather than ambient.
- **Truncate visibly.** Always end with `… N more — run <command>`. SWE-agent's ablation
  measures the alternative: a summarized exhaustive result scores **18.0%**, an iterative
  one-at-a-time browser **12.0%** — a 6-point penalty for making the agent walk.

## 4. `## Relations` — typed edges as table rows

This is the DITA relationship table, in markdown.

```markdown
| from | edge | to | why |
|---|---|---|---|
| editor | depends-on | vault | reads NoteMeta and the link index |
| repository | implements | adr-0001 | hexagonal ports |
| share | supersedes | publish-v1 | replaced 2026-06 |
| merge3 | tested-by | merge3.test.ts | 14-case conflict matrix |
| B4-crdt | decided-in | pain-playbook#tensions | "no peer CRDT" |
```

**One edge per line** is the whole point: it diffs, it three-way-merges, and it reads as a
flat table rather than as a graph the model has to walk. This is the gap nobody fills —
`.canvas` is JSON with absolute pixel coordinates, and Obsidian Sync's documented policy
for non-markdown files is *last modified wins*.

### Edge vocabulary

**Derived** — computed, never authored, always fresh:
`contains` (filesystem / heading nesting) · `links` (wikilink, import, href) ·
`embeds` (transclusion) · `tagged` (shared tag)

**Authored** — the semantic layer that makes it a knowledge map:
`depends-on` · `implements` · `decided-in` · `tested-by` · `supersedes` /
`superseded-by` · `contradicts` · `derived-from` · `next` / `prev` · `owns`

**Ghost** — the states everything else throws away:
`planned` (a node with no file yet) · `broken` (an edge whose target does not exist)

Map the hierarchy pair onto **SKOS** (`skos:broader` / `skos:narrower` / `skos:related`,
W3C Recommendation since 2009) and containment onto **DCMI Terms** (`dcterms:hasPart` /
`isPartOf` — ISO 15836-1:2017). Both already mean exactly this. Reusing their URIs makes a
map a valid thesaurus for free and costs nothing. Extension follows **JSON-LD 1.1**'s
`@context` pattern: mint terms in your own namespace, no central registry, and the file
still parses for consumers that ignore semantics.

## 5. Ghost nodes — stolen from mdBook

mdBook's `SUMMARY.md` allows `[Draft Chapter]()` — a link with an empty target, meaning
*declared but not written*. That is the single best idea in the ToC-format lineage.

```markdown
- [[crdt-multiplayer]] — planned, Phase 3
- [Importer: Notion ZIP]() — planned, no owner
```

Today, frontmatter's graph does the opposite: `graph-data.ts:132` reads

```ts
if (targetPath === undefined) continue; // unresolved — drop
```

Unresolved links are silently deleted. In a map, an unresolved link is the **most
interesting** thing on screen — it is either a plan or a bug, and both are findings.

## 6. Layout lives in a sidecar

`.mdmap/layout.json`, never in `MAP.md`.

```json
{ "mdmap-layout": 1, "for": "MAP.md",
  "nodes": { "editor": {"x": 0, "y": 0, "w": 320, "h": 200 } } }
```

Three reasons: coordinates are noise in a diff; a map with no coordinates must still
render (auto-layout fills in); and the HN critique of JSON Canvas — *"This isn't human
readable either (long opaque id strings dominate the syntax)"* — is a warning about
exactly this mixing.

**Interop:** emit and ingest **JSON Canvas 1.0** for the canvas projection so Obsidian can
open it. Use its `file` + `subpath` fields — `subpath` begins with `#` and targets a
heading or `#^block`, which is the only existing precedent anywhere for binding a graph
node to a *fragment* of a document. Keep every mdmap extension in the sidecar; do not
pollute `.canvas`.

## 7. Recursion, and the bound

```
MAP.md                      root — 7 regions
└── src/modules/MAP.md      12 modules
    └── editor/MAP.md       9 files, 3 invariants
```

A map's `## Regions` entries either name a leaf or name another map. **A map that exceeds
its budget must split, not truncate its meaning.** The bound is what stops the hairball:
you never render 4,000 nodes because no map ever contains 4,000 nodes.

Resolution is proximity-based, exactly like `AGENTS.md`: the closest `MAP.md` above a file
wins.

## 8. Trails — a saved walk

```markdown
---
mdmap-trail: 1
title: How a keystroke becomes a commit
---
1. [[editor#dispatch]] — CodeMirror transaction
2. [[drafts#autosave]] — IndexedDB, debounced 400ms
3. [[repository#commit]] — Git Data API, baseSha 409 on conflict
```

CodeTour (Microsoft, 4,553 stars) proved people want this. Its `.tour` JSON anchors steps
to **file + line number**, which rots on the first refactor. Anchoring to headings and
block IDs instead does not. Trails are markdown, so they diff, publish, and can be handed
to an agent as an ordered reading plan.

## 9. What is deliberately NOT in the format

- **No diagram syntax.** Mermaid renders natively on GitHub and GitLab; DOT has the only
  formal grammar in the category. A Canvas→Mermaid converter already exists.
- **No new AST.** `mdast` v5 is versioned and already used by both remark and MyST.
- **No RDF authoring.** RDF 1.2 is still Candidate Recommendation (2026-04-07) and its
  Turtle serialization is a Working Draft (2026-07-23). Cite RDF 1.1 Turtle if anything.
- **No dependence on `[[wikilink]]` being portable.** GFM does not parse it, CommonMark
  declined it on the record, `micromark-extension-wiki-link` has been untouched since
  2021, Logseq's DB version just broke `(())`, and Obsidian's own CEO has had
  [Pandoc PR #11135](https://github.com/jgm/pandoc/pull/11135) open since 2025-09-12 trying
  to fix this. **The map records the resolved link graph precisely because the inline
  syntax is not dependable.**
- **No opaque numeric IDs.** Sourcegraph's stated reasons for replacing LSIF with SCIP
  were: no machine-readable schema, heavy in-memory graph structures, opaque numeric IDs
  that are undebuggable and constrain incremental indexing, and 4–5× larger payloads.
  Node IDs are human-readable slugs.
- **No `links` as the edge-array name.** NetworkX renamed exactly that to `edges` across
  3.x. Use `edges`.

## 10. Open questions

- Is `## Relations` a table or inline `key:: value` annotations on list items? The table
  diffs better; inline reads better while authoring.
- Does `coverage` measure files, tokens, or ranked mass? Files is easiest, tokens is
  honest, ranked mass is right and hardest.
- Should heading-level nodes exist in v1, or only file-level? Sub-file granularity is the
  #2 unfilled gap in the whole survey, and also the largest cost.
- Does the root map get a reserved filename or is `MAP.md` merely conventional?

---

**Attribution:** section order from Liu et al. 2307.03172 · `## Optional` from llms.txt ·
ghost nodes from mdBook `SUMMARY.md` · relations table from DITA reltables (OASIS, 2005) ·
edge vocabulary from SKOS (W3C Rec 2009) + DCMI (ISO 15836) · extensibility from JSON-LD
1.1 · ranking from Aider's `repomap.py` · truncation penalty from SWE-agent
(2405.15793) · `params` namespacing from Hugo · ID rules from SCIP's LSIF postmortem ·
canvas interop from JSON Canvas 1.0.
