Confirmed once: I mutated nothing — reads, curl fetches (all `-o` writes were sandbox-denied, zero files created), and `node -e` evaluation only; no edits, no commits, no `~/.claude` or `~/.sgnk` writes. The reported dirt is pre-existing and not mine.

### 0. The ranking function: degradation is measured, not assumed

I ran all candidate carriers through the three dumb engines vendored here — `marked@16.4.2`, `markdown-it@15.0.0` in `commonmark` preset, `commonmark@0.31.2` (matches spec **CommonMark 0.31.2**, the current spec index head) [measured 2026-08-29] [fetched]. GFM spec is still **Version 0.29-gfm** [fetched].

| carrier | dumb-renderer output (all 3 engines agree) | visible junk | verdict |
|---|---|---|---|
| `<!--fm ... -->` comment block | `Title Body.` — **HTML block type 2, fully suppressed** | **0 chars** | cleanest |
| fenced lane ` ```chart ` | YAML shown as code text, content intact | 0 sigils, contained | good |
| YAML frontmatter | `<hr><h2>render: board\nlanes: [Todo, Doing, Done]</h2>` | **an `<hr>` + an `<h2>` above your `<h1>`** | costly per key |
| `:::name` container directive | `:::kanban Todo ship it :::` | 2 leaked sigil lines/block | worst |
| `::name{k=v}` leaf directive | `::chart{type=bar}` verbatim | full line leaked | worst |
| `> [!NOTE]` GFM alert | `[!NOTE] Useful info.` | 7 chars, semantic | acceptable |
| `- [ ]` task list | marked strips box; mdit/cmark leak `[ ]` | 4 chars | acceptable |
| GFM table | marked renders; mdit/cmark leak all pipes | pipes | acceptable |
| `%%comment%%`, `==hl==`, `{#id}`, `^blockid` | all leaked verbatim | 4–11 chars | avoid |

[measured] The frontmatter result is the governing constraint and it is worse than folklore says: a **single** key `render: board` produces `<hr><h2>render: board</h2>` — a setext H2, i.e. the view definition outranks the document's own H1 in every non-frontmatter-aware renderer. [derived] 4 keys ≈ 60 chars of H2 junk; 12 keys ≈ 180. Frontmatter cost is **linear in key count**, so a sprawling view spec in frontmatter is a degradation regression, not a neutral choice.

### 0.1 The three-slot rule (falls out of the measurement)

- **Slot 1 — frontmatter: the SWITCH only.** 1–3 scalar keys. `render:` plus at most a profile name. [inference]
- **Slot 2 — a fenced lane: the VIEW SPEC.** Arbitrarily large, degrades to contained code, zero sigil leakage. This is exactly what Obsidian shipped for **Bases**: a `.base` YAML file with `views: [{type: table, name, limit, groupBy, order, filters, summaries}]`, `formulas:`, `properties:` — "embedded in a code block" [fetched: help.obsidian.md/bases/syntax].
- **Slot 3 — the body: the DATA**, in constructs that already degrade (headings, lists, tables, task items).

```markdown
---
render: board
---

```fm-view
lanes: [Todo, Doing, Done]
group: heading
card: {title: text, badge: due}
```

## Todo
- [ ] Ship the certificate  <!--fm due=2026-09-04 owner=@sagnik-->
```

[measured] That whole document degrades to: `render: board` (H2 junk) + the YAML as a code block + `## Todo` + `[ ] Ship the certificate`. The `<!--fm ...-->` per-item metadata is **invisible** in all three engines. That comment carrier is the single most under-used degradation primitive available.

### 1. Computation lanes

| lane | definition | budget verdict |
|---|---|---|
| **C0 client-pure** | parse + fixed-vocabulary layout, no dep beyond the existing lezer/CodeMirror tree | in budget |
| **C1 client+lib** | one bundled renderer with a fixed vocabulary (mermaid 89,973★, chart.js 12.9M/wk, leaflet 6.9M/wk, cytoscape 15.5M/wk) [fetched 2026-08-29] | in budget, bundle-cost gated |
| **C2 server** | anything needing an index across files, or auth | out for v1 |
| **L LLM** | generative; non-deterministic; cannot be a render lane | out — a render must be a pure function of bytes [inference] |

Write-back taxonomy: **BODY-MOVE** (splice a contiguous body span) · **KEY-SET** (rewrite one frontmatter scalar) · **CELL-SET** (rewrite one table cell) · **COMMENT-SET** (rewrite inside `<!--fm ...-->`) · **SIDECAR** (no textual home — JSON Canvas-class, 3,670★ [fetched]) · **NONE**.

### 2. The enumeration — state/board family

| surface | driver | lane | degrades to | write-back (drag rewrites) | demand proof | effort |
|---|---|---|---|---|---|---|
| **Kanban board** | `render: board` + `## Lane` + `- [ ]` | C0 | outline of headings + checkboxes — fully readable | **BODY-MOVE**: splice the list-item span between heading sections | obsidian-kanban **2,601,160 downloads**, latest `2.0.9-beta` [fetched 2026-08-29]; repo 4,483★ but **last push 2026-03-06** [fetched] | S |
| **Sprint/issue board** | `render: board` + `group: status` over `status:` in per-item comments | C0 | same | COMMENT-SET on `status=` | Linear/Jira [SS] | S (reuse) |
| **Pipeline / CRM** | `render: board` + `group: stage` | C0 | same | COMMENT-SET | no Obsidian plugin >100K [fetched] — weak signal | S |
| **Interview scorecard** | `render: scorecard` + per-criterion table + `verdict:` | C0 | table + heading | CELL-SET | Greenhouse [SS] | S |
| **Bug report / triage** | `render: issue`, keys `severity/repro/status` | C0 | prose form; readable | KEY-SET | GitHub issue forms [SS] | XS |
| **Habit tracker** | `render: heatmap` + date-keyed list | C1 | date list | COMMENT-SET | heatmap-calendar 173,664 [fetched]; habit-tracker only **10,237** [fetched] — thin | S |

### 3. Time family

| surface | driver | lane | degrades to | write-back | demand | effort |
|---|---|---|---|---|---|---|
| **Calendar** | `render: calendar`, `date:` per file or `## YYYY-MM-DD` | C0 | dated headings, chronological, readable | KEY-SET (`date:`) on drag | calendar **3,048,022**; full-calendar 455,970 [fetched] | M (vault index → C2 for multi-file) |
| **Timeline** | `render: timeline` + `date:`+`title` list | C0 | dated list | COMMENT-SET | obsidian-timeline 91,802; aprils-automatic-timelines 62,396 [fetched] — modest | S |
| **Gantt** | ` ```mermaid gantt ` (exists) **or** `render: gantt` over a task table with `start/end` | C1 / C0 | mermaid → source text (poor); table → readable table (**better**) | CELL-SET on `end` when a bar is dragged | mermaid has a first-class `gantt` diagram dir [fetched]; frappe-gantt 133,046/wk [fetched] | M |
| **Roadmap** | `render: roadmap` + `## Now/Next/Later` | C0 | headings + bullets | BODY-MOVE | ProductBoard [SS] | XS (board reskin) |
| **Changelog** | `render: changelog` + `## [1.2.0] - date` | C0 | already the Keep-a-Changelog convention, perfectly readable | NONE (append-only) | keepachangelog [SS] | XS |
| **Itinerary** | `render: itinerary` + `date:`/`time:` per stop | C0 | dated list | COMMENT-SET | no plugin signal [fetched] | S |
| **Journal / daily notes** | `render: journal` over folder+`date:` | C2 | dated files | NONE | journals 122,947; templater 5,432,178 [fetched] | S |

### 4. Tabular & document-object family

| surface | driver | lane | degrades to | write-back | demand | effort |
|---|---|---|---|---|---|---|
| **Enhanced table** | GFM table + ` ```fm-view ` for sort/width/type | C0 | plain GFM table | CELL-SET (byte-exact, column-aligned) | table-editor-obsidian **3,148,583**; sheet-plus 195,297; excel-to-md 199,788 [fetched] | S |
| **Pivot** | `render: pivot` + `rows/cols/agg` in lane | C0 (arith only) | the source table, intact | NONE (derived) | Excel [SS] | M |
| **Database view over the vault** | `render: base` + Bases-shaped `views:` | C2 | the view YAML as a code block | KEY-SET on the target file's frontmatter | dataview **4,857,171**; Obsidian shipped Bases natively [fetched] | L |
| **CV / résumé** | `render: cv` + `## Experience` + `- role @ org (dates)` | C0 | a perfectly readable résumé — the best degradation in the whole list | NONE | JSON Resume [SS]; **zero** Obsidian plugin [fetched] | XS |
| **Invoice** | `render: invoice` + line-item table + `total:` computed | C0 | table + totals | CELL-SET | **zero** plugin >1,003 downloads [fetched] — near-zero signal | S |
| **Data dictionary** | `render: dictionary` + table `field/type/nullable/desc` | C0 | table | CELL-SET | dbt docs [SS] | XS |
| **API reference** | `render: api` + `## METHOD /path` + param tables | C0 | headings + tables, readable | CELL-SET | OpenAPI/Redoc [SS] | M |
| **Glossary / brand book / style guide** | `render: glossary\|brandbook` + definition-shaped headings + swatch comments | C0/C1 | headings + hex codes as text | COMMENT-SET | style-settings 2,630,244 (theming, adjacent) [fetched] | S |

### 5. Chart, diagram, spatial

| surface | driver | lane | degrades to | write-back | demand | effort |
|---|---|---|---|---|---|---|
| **Charts** | ` ```chart ` YAML lane **over an adjacent GFM table** (data lives in the table, not the fence) | C1 chart.js | the table stays readable; the fence shows spec | CELL-SET on the table | obsidian-charts 320,106; chartsview 94,231; chart.js 12,893,359/wk [fetched] | M |
| **Dashboard / status page** | `render: dashboard` + `## Panel` sections each carrying a chart/table | C1 | sectioned document | KEY-SET | Grafana, statuspage [SS] | M |
| **Mermaid-class diagrams** | ` ```mermaid ` — already 35 diagram families incl. `flowchart, sequence, class, er, gantt, kanban, timeline, mindmap, sankey, quadrant-chart, xychart, treemap, radar, c4, requirement, packet, block, architecture, wardley, cynefin, ishikawa, eventmodeling, usecase, venn, swimlanes, railroad, agentflow` [fetched: repo tree, mermaid-js/mermaid] | C1 | **source code, not prose — the weakest degradation of any lane** | NONE | mermaid 89,973★, 15,313,390 npm/wk [fetched] | XS (adopt), L (write-back) |
| **Org chart** | `render: org` + nested list of `name — title` | C0 | an indented list of people — readable | BODY-MOVE (reparent = move the sub-list) | mermaid flowchart substitutes [fetched] | S |
| **Knowledge graph** | `render: graph` over wikilinks | C2 | the links stay as links | NONE | juggl 134,747; 3d-graph 71,000; extended-graph 68,259 [fetched] — **all small** | M |
| **Flow / canvas** | derived layout only; positions → JSON Canvas sidecar | C1 | list of nodes | SIDECAR | excalidraw **7,578,223** (largest single number here); jsoncanvas 3,670★; tldraw 50,014★ [fetched] | L |
| **Map** | `render: map` + `lat/lon` per item | C1 leaflet | list of places with coordinates | COMMENT-SET on `lat=/lon=` | map-view 165,018; leaflet-plugin 308,151 [fetched] | M |
| **Gallery** | `render: gallery` over image links | C0 | a list of images (already renders) | BODY-MOVE | [SS] | XS |

### 6. Interactive & procedural

| surface | driver | lane | degrades to | write-back | demand | effort |
|---|---|---|---|---|---|---|
| **Slides** | `render: slides` + `---` slide breaks (Marp-compatible) | C0 | continuous document split by rules — readable | NONE | advanced-slides 835,057; slidev 48,318★; marp 12,420★; reveal.js 110,842/wk; `@marp-team/marp-core` 91,989/wk [fetched] | M |
| **Checklist / SOP** | `render: sop` + `- [ ]` + `## Step` | C0 | the checklist itself | **BODY-MOVE + COMMENT-SET** (`checked` toggles the `[ ]`→`[x]` byte — a 1-byte splice) | obsidian-tasks 4,114,650 [fetched] | XS |
| **Recipe** | `render: recipe` + `## Ingredients`/`## Method` + `servings:` | C0 | a readable recipe | KEY-SET (`servings:` rescales quantities in-view only) | recipe-view only 58,041 [fetched] — small | S |
| **Meeting notes** | `render: meeting` + `attendees:`/`decisions:`/`actions:` | C0 | headed prose | KEY-SET | Granola/Notion [SS] | XS |
| **Decision record (ADR)** | `render: adr` + `status: proposed\|accepted\|superseded` + `supersedes:` | C0 | the ADR template, verbatim readable | KEY-SET on `status:` | MADR/adr-tools [SS]; **no plugin** [fetched] | XS |
| **Flashcards / SRS** | `render: cards` + `Q :: A` or `#flashcard` heading pairs | C0 + C2 (scheduling state → sidecar) | Q/A pairs as text | SIDECAR (never write intervals into the doc) | spaced-repetition 586,736; flashcards-obsidian 71,629; mdanki 888★ [fetched] | M |
| **Quiz** | `render: quiz` + task-list options with `<!--fm correct-->` | C0 | a list of questions and options | COMMENT-SET | no signal [fetched] | S |
| **Forms / surveys** | `render: form` + typed frontmatter schema | C1 | field labels as a list | KEY-SET (writes answers back into frontmatter) | modalforms 68,493 [fetched] — **weak** | M |
| **Test plan** | `render: testplan` + `- [ ] case` table with `expected/actual` | C0 | table | CELL-SET | TestRail [SS] | XS |
| **Contract / redline** | `render: redline` + CriticMarkup `{++ins++} {--del--} {~~a~>b~~}` | C0 | **leaks sigils verbatim** [inference from the `==hl==` measurement] — mitigate with the comment carrier | BODY-MOVE (accept = splice) | CriticMarkup-toolkit 848★, **last push 2021-03-04** [fetched]; `redline` plugin 588 downloads [fetched] | L |

### 7. (1) Ranked v1 shortlist

1. **Kanban board** — the only surface where the drag is a *pure body splice*, so byte-identical write-back is provable, and the incumbent is stalled: 2.6M downloads on a `2.0.9-beta` whose repo last moved **2026-03-06** [fetched]. Highest demand-to-effort ratio in the table. [inference]
2. **Enhanced table + charts over the same table** — 3.15M downloads for table editing alone [fetched]; keeping data in a GFM table (not the fence) is what makes the chart degrade to something *readable* rather than to a YAML blob. This is the design move mermaid did not make. [inference]
3. **Slides** — degradation is free (`---` is already a thematic break), Marp compatibility is a distribution channel, 835,057 downloads [fetched].
4. **SOP/checklist + meeting notes + ADR + changelog + CV + data dictionary** — a *bundle*, not six features: each is one `render:` value plus a heading convention, C0, XS effort, near-perfect degradation. Ship the profile mechanism once and these are configuration. [inference]
5. **Calendar** — 3.05M downloads [fetched], but it needs the vault index (C2), so it is the first surface that costs real architecture.

### 8. (2) v2 shortlist

Dashboard/status · Gantt-over-a-table (not mermaid) · Map · Pivot · Flashcards with sidecar scheduling · Roadmap · Org chart · Database-view-over-vault (Bases-shaped, C2, L effort — the largest v2 item and the one Obsidian just made table stakes [fetched]).

### 9. (3) The traps

- **`:::` container directives as the extension grammar.** 7,336,465 weekly `micromark-extension-directive` downloads make it look like a standard [fetched], and the CommonMark thread ("Generic directives/plugins syntax", opened **2014-09-06**, 173 posts, 79,614 views, last post **2025-04-03**) is still open after **11.6 years** [fetched] [derived]. It is not in CommonMark 0.31.2 [fetched] and it **leaks two sigil lines per block** in all three dumb engines [measured]. Use the comment carrier or a fenced lane instead.
- **Mermaid as the diagram strategy.** It degrades to *source*, which is the one thing the constraint forbids [measured pattern]. Adopt it as a lane; never let a first-party surface depend on it for degradation.
- **A canvas/whiteboard as a render.** Excalidraw's 7,578,223 downloads [fetched] make this the most tempting number on the page, and it is the trap: positions have no textual home, so it is 100% sidecar — the render carries none of the value, and the master plan already rules out "bespoke canvas as center of gravity" [fetched: docs/FRONTMATTER-MASTER-PLAN-2026-08-28.md §10].
- **Forms/surveys.** Write-back into frontmatter is elegant, but 68,493 downloads [fetched] is the weakest demand of any C1-effort surface, and multi-respondent state is a database, not a file [inference].
- **Invoices, quizzes, itineraries, habit trackers.** Zero or near-zero registry signal (budget-app 1,003; habit-tracker 10,237) [fetched]. Attractive because they demo well.
- **Knowledge graph.** Every graph plugin is small (134,747 / 71,000 / 68,259) [fetched] and the plan already names "graph-view investment" as not-to-build [fetched].
- **Rich frontmatter as the view spec.** Measured: linear H2 junk per key [measured]. The intuitive design is the degrading one.

### 10. (4) Genuinely novel — checked against a 7,020-plugin registry [fetched 2026-08-29]

Keyword sweep of the full Obsidian community-plugin stats file returned **0 plugins** matching `provenance`, `degrad`, `evidence`, or `compare`; `critic` → 2 (top: 373 downloads); `redline` → 1 (588); `cert` → 1 (an unrelated uncertainty calculator) [measured over fetched data].

1. **`render: cert` — the degradation certificate as a render surface.** The document renders its own cross-engine verdict: which constructs survive on GitHub blob / Notion import / Slack, sourced from `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/modules/mdmax/domain/targets.ts` (15 targets, `fidelity: 'local' | 'declared'`, `uncertifiableShare()`) [read locally]. No product ships this. **NOVEL** [checked, none found].
2. **`render: ink` — the provenance heatmap.** Byte ranges tinted by actor (typed / pasted / AI), degrading to the plain document because the anchors live in `<!--fm-->` comments that are invisible in all three engines [measured]. 0 registry hits for `provenance` [measured]. **NOVEL** [checked]; the master plan independently scopes the claim to "byte-anchored, document-portable, reader-visible provenance in a markdown editor" [fetched].
3. **`render: context` — the agent context-window view.** Renders what this file costs and does to a model's context: token budget per section, machine-write zones, always-on vs on-demand. Registry: `token` → 6 plugins, largest 969 downloads [measured]. **NOVEL** [checked].
4. **`render: review` — suggestions as a projection, not as bytes.** Markup/final/original as three pure renders over a sidecar of suggestion hunks. Google Docs' public API **cannot create suggestions** [fetched, per the plan's §5 citation]; CriticMarkup's toolkit last moved **2021-03-04** [fetched]. **NOVEL in markdown** [checked].
5. **`render: evidence` — the tier/freshness overlay.** `{value, source, tier, re_verify_cmd}` chips over prose. 0 registry hits for `evidence` [measured]. **NOVEL** [checked].

### 11. Recorded disagreements

- **Directive standardization.** `micromark-extension-directive` documents `:name[label]{attrs}` / `::name` / `:::name` as if settled [fetched]; CommonMark 0.31.2 contains no such construct [fetched]; the proposal thread remains open after 11.6 years [fetched]. Sources disagree on whether this is "a standard".
- **Frontmatter's degradation.** Widely treated as invisible; measured here as `<hr>` + `<h2>` in all three engines [measured]. I did not find a source that states this cost; I am recording my measurement against the common assumption rather than reconciling them.
- **Kanban demand.** 2,601,160 downloads (very high) vs a repo last pushed 2026-03-06 under an archived-org convention [fetched] — the two signals point opposite ways; I read it as an abandoned incumbent, which is a different fact from "declining demand" [inference].
- **Obsidian Bases vs Dataview.** Bases is now native with a `views:` YAML schema [fetched]; Dataview still shows 4,857,171 downloads but its repo last moved **2025-11-17** [fetched]. Whether the database-view slot is open or just closed by the platform vendor is genuinely unresolved by these two data points.