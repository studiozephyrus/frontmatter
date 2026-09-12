## KEY FINDINGS
- The dispatch primitive is CommonMark-legal, not a hack: the info-string is spec-defined (first word selects treatment), and Obsidian's registerMarkdownCodeBlockProcessor(language, handler(source, el, ctx)) is the canonical 'info-string names renderer, fenced body is the data slot' API [fetched: commonmark-spec spec.txt, obsidian-api obsidian.d.ts L5001]. Unknown fences degrade to code blocks, satisfying the 'profiles over valid CommonMark' posture.
- Two production engines already prove the substrate, fully client-side/deterministic over YAML frontmatter: Obsidian Bases (native core plugin; .base YAML or ```base fence; filters + JS-semantics formulas incl. if()/html()/date-arith + summaries Sum/Avg/Median/Stddev/Unique + table/cards/list/map views with groupBy) and Dataview (9,300 stars; DQL LIST/TABLE/TASK/CALENDAR + full sum/reduce/map/filter/average library) [fetched].
- Kanban / state machines are free: a frontmatter enum (status: draft|review|done) IS the state; Bases groupBy(status) renders the columns; a drag is just an editor write-back of the enum. No server, no LLM.
- Checkboxes are the only native input, and write-back is real: Dataview TASK is 'the only command in dataview that modifies your original files' — checking a rendered box rewrites the source line and can stamp completion:: date [fetched]. Bases table cells edit YAML properties inline. Anything past booleans needs the editor write-path (still no server/LLM).
- Conditional/computed rendering is deterministic and inline: Dataview `= choice(this.steps > 10000, ...)` and `= this.due - date(today)` render computed values inside prose; Bases if()/formulas do per-row computed columns [fetched].
- The 'tiny spreadsheet' has a precise ceiling: column formulas + result-set aggregates work (Bases even bans circular formula refs), but there is NO A1-style cell-references-another-cell or iterative recompute — that is the wall into a real spreadsheet engine.
- The dashboard (queries over a folder) is the sharpest cost boundary: it runs on an in-browser index; Dataview advertises 100k notes but users report ~30s queries at 3,000+ notes and file.inlinks (whole link graph) is expensive [SS]. Practical client-only ceiling is low-thousands of notes / simple predicates.
- Charts/diagrams from declarative specs render client-side with a library but no server/LLM: Mermaid (89,974 stars, ~16 diagram types text->SVG), Vega-Lite (5,463 stars, chart-as-pure-JSON), obsidian-charts (```chart YAML->Chart.js) [fetched]. Fixed grammar only.
- The founder's three-way (client/server/LLM) map is missing the decisive fourth lane: CLIENT-but-arbitrary-JS (dataviewjs, MDX, TiddlyWiki widgets). The product's defensibility is to stay in fixed-interpreter + typed-data-slot lanes (rows 1-13) and REFUSE the eval lane (row 14) for AI/untrusted-vault-authored content — that is what makes 'AI edits the same file provably without corruption' hold.
- Hard boundaries confirmed: (a) spatial canvas data (freeform x/y, connectors) is not linear text — Obsidian ships a separate .canvas JSON format, Excalidraw/tldraw are JSON blobs; (b) real DB queries (joins/transactions/indexes at scale); (c) multi-user concurrent state (presence/auth/CRDT) all need a server. A file-per-note model is single-writer by nature.
- Recommended posture: ship a small CLOSED figure/app vocabulary of info-string renderers (board/calendar/decision-card/dashboard/chart/diagram) whose bodies are typed YAML/JSON data slots; buy Bases+Dataview SEMANTICS as a stable spec (not their code); and publish the compute ceiling honestly so the render promise never silently reaches into server/LLM territory.

---

# ANGLE 2 — Markdown as a Low-Compute App Substrate

**The bet, verified:** app-like behavior over plain `.md` + YAML frontmatter is not speculative — it already ships in production, at scale, computed entirely in the browser by fixed interpreters with no server and no LLM at render time. The founder's instinct ("trickily use Markdown for stuff that doesn't require much computation") maps onto a well-trodden design space with two industrial-strength reference engines (Obsidian Bases, Dataview) and one maximalist proof (TiddlyWiki). The job for `frontmatter` is not to invent this — it is to (a) pick the deterministic-interpreter lane and refuse the arbitrary-code lane, and (b) exploit CommonMark's info-string as the AI's typed data slot.

## The one core mechanism everything rests on

The founder's item (6) — "a fence whose info-string names a host renderer plus args" — is the **canonical primitive**, and it is CommonMark-legal by spec, not a hack:

- CommonMark defines the fenced-code **info string**: *"The first word of the info string is typically used to specify... particular treatment of the info string"* [fetched, commonmark/commonmark-spec `spec.txt` L1973-1976, L2281-2283]. An unknown info string just renders as a code block — so custom renderers **degrade gracefully** in any dumb renderer, satisfying `frontmatter`'s settled "profiles over valid CommonMark" posture.
- Obsidian exposes exactly this as `registerMarkdownCodeBlockProcessor(language, handler(source, el, ctx))` [fetched, obsidianmd/obsidian-api `obsidian.d.ts` L5001] — the info-string names the renderer, the fenced **body is the data slot**, the handler paints into `el`. This is precisely "hand the AI a data slot, not a canvas."
- The generic **directive** form (inline `:name`, leaf `::name`, container `:::name`, each with `[label]{#id .class key=val}`) is the inline/block analog, implemented by remark-directive against the "generic directives proposal" [fetched, remarkjs/remark-directive `readme.md`]. Note: still a *proposal*, not in the CommonMark core spec [SS].

**Strategic reading:** the fence/directive is a contract — the AI (or an untrusted vault) emits *typed declarative data* that a *fixed host interpreter* renders. It cannot execute. That is the security spine of `frontmatter`'s "AI edits the same file provably without corrupting a byte" thesis. The moment you let the fence body be *code* (dataviewjs, MDX, TiddlyWiki JS macros), you've handed over the canvas and lost the guarantee.

## The three reference engines (all client-side, all deterministic, all over frontmatter)

**Obsidian Bases** — native *core* plugin (ships in-app, no install; core since the 1.9.x line, mid-2025 [SS]; plugin-extensible view API `registerBasesView` since 1.10.0 [fetched, `obsidian.d.ts` L5009]). A base is a `.base` YAML file *or* an embedded ` ```base ` fence [fetched, obsidian-help `Bases syntax.md`]. It is a real, interactive, client-side database over YAML frontmatter with:
- **Filters** (recursive `and`/`or`/`not`; functions `file.hasTag`, `file.inFolder`, `file.hasLink`) [fetched]
- **Formulas** = per-row computed properties, e.g. `formatted_price: 'if(price, price.toFixed(2) + " dollars")'`, `ppu: "(price / age).toFixed(2)"`; arithmetic + date arithmetic (`now() + '1d'`); functions follow **JavaScript semantics** including `if()`, `html()` (renders HTML), `icon()` (Lucide), `image()`, `link()` [fetched, `Functions.md`, `Bases syntax.md`]. Circular formula references are forbidden [fetched].
- **Summaries** = deterministic cross-row aggregations, built-in: Average, Min, Max, Sum, Range, Median, **Stddev**, Checked, Unchecked, Empty, Filled, Unique — plus custom (`'values.mean().round(3)'`) [fetched, `Bases syntax.md`].
- **Views**: `table`, `cards`, `list`, `map`, each with `groupBy` + per-view `filters`/`order`/`summaries` [fetched]. `groupBy: status` **is** the kanban/state-machine mechanism.

**Dataview** — community plugin, 9,300★, "data index and query language over Markdown files," not archived, last push 2025-11-17 [fetched, api.github.com]. DQL query types **LIST / TABLE / TASK / CALENDAR** with `WHERE`/`SORT`/`GROUP BY`/`FLATTEN` [fetched, `query-types.md`]; a full function library — constructors, numeric/date/duration/string ops, and list aggregations `sum, product, reduce, average, min/max, all/any/none, filter, map, flat, unique, join, sort, length, nonnull, contains` [fetched, `functions.md`]. Reads frontmatter *and* inline fields (`key:: value`).

**TiddlyWiki5** — 8,632★, "self-contained JavaScript wiki... single HTML file," last push 2026-08-25 [fetched, api.github.com]. The maximal proof that a text substrate can be a whole reactive app: its **filter language** is a bracket-syntax pipeline over ordered sets of tiddler titles that compiles to JS functions; **widgets** re-render reactively via `computeAttributes()`; runs with **no server** as one HTML file [SS]. Caveat: wikitext ≠ CommonMark, and its reactivity is a full widget runtime — it is the far (arbitrary-code) end of the spectrum, useful as a boundary marker, not a model to copy.

## Item-by-item mapping

1. **Forms/inputs + write-back** — GFM task-list `- [ ]` is the *only* native input in markdown. Toggling a rendered checkbox rewrites the source line to `- [x]`; Dataview's **TASK** query is "the only command in dataview that modifies your original files" and can stamp `completion:: <date>` on check [fetched, `query-types.md` L328]. Beyond booleans (text/date/select/slider), Bases table cells edit the underlying YAML property inline and write it back — a native "form over frontmatter." All client-side; needs the *editor write-path*, still no server/LLM.
2. **State machines / kanban from a frontmatter enum** — `status: draft|review|done` in YAML is the state; `Bases groupBy(status)` (or the Kanban community plugin, which stores columns as `##` headings and cards as `- [ ]`) renders columns; a drag = editor write-back of the enum. Deterministic client-side.
3. **Tables as tiny spreadsheets** — Bases *formulas* (per-row) + *summaries* (column aggregates incl. median/stddev) / Dataview `sum·reduce·map·filter·average`. **Ceiling:** these are column/row-wise and result-set-wide; there is *no* A1-style cell-referencing-another-cell, no iterative/circular evaluation (Bases bans circular refs). Cross-cell dependency graphs, goal-seek, pivot-with-recompute → real spreadsheet engine.
4. **Conditional / computed rendering from flags** — Bases `if(cond, a, b)` / formulas; Dataview inline `= choice(this.steps > 10000, "YES!", "**No**, get moving!")` and `= this.due - date(today)` render a computed value *in prose* [fetched, `dql-js-inline.md` L69, L66]. Deterministic.
5. **Dashboards = queries over a folder of frontmatter** — Dataview `TABLE ... FROM #tag/folder WHERE ...` / Bases whole-vault filters, all computed over an **in-memory index built in the browser**. **This is the sharpest cost boundary:** Dataview advertises hundreds of thousands of notes but users report ~30s queries at 3,000+ notes; `file.inlinks` needs the whole link graph and is expensive; many queries per note stalls the tab [SS, blacksmithgu/obsidian-dataview issues #1455 / discussion #2151]. Practical client-only ceiling ≈ low thousands of notes / simple predicates before you want a prebuilt index or a server.
6. **Fence dispatch** — covered above (`registerMarkdownCodeBlockProcessor`; remark-directive). The load-bearing mechanism.
7. **Charts/diagrams from declarative specs** — **Mermaid** (89,974★, last push 2026-08-28 [fetched]) turns text into ≈16 diagram types (flowchart, sequence, class, state, ER, gantt, pie, user-journey, git-graph, mindmap, timeline, sankey, quadrant, xychart, kanban, architecture) [fetched, README]; **Vega-Lite** (5,463★, "concise grammar of interactive graphics" [fetched]) — a chart is *pure JSON data*, the gold standard for "spec not code"; **obsidian-charts** (801★, "Charts... via Chart.js" [fetched]) exposes a ` ```chart ` YAML fence. All render deterministically client-side but need their **render library** loaded (JS present, but no server, no LLM, no user code). Anything past a fixed declarative grammar → runtime.

## THE COMPUTATION BUDGET MAP

Lanes: **CLIENT** = fixed interpreter shipped in the app, pure `(file bytes + sibling files) → DOM`, no network, no user-code eval. **CLIENT+lib** = same, but needs a render library present. **CLIENT+JS⚠** = needs an arbitrary-JS sandbox (deterministic-ish but is the security/"canvas" surface — the lane to *refuse*). **SERVER** / **LLM** as named.

| # | App-like behavior | Lane | Exact mechanism | Ceiling / note |
|---|---|---|---|---|
| 1 | Render text / lists / tables / callouts | CLIENT | CommonMark+GFM parser | none |
| 2 | Checkbox boolean input + toggle persist | CLIENT (editor write) | GFM `- [ ]`; source line rewrite; Dataview TASK write-back [fetched] | needs editor write-path |
| 3 | Inline edit text/date/select → YAML | CLIENT (editor widget) | Bases table cell → frontmatter property [fetched] | needs editor |
| 4 | State enum → kanban / decision columns | CLIENT | Bases `groupBy(status)` / Kanban plugin (`##`=col, `- [ ]`=card) [fetched] | drag = enum write-back |
| 5 | Per-row computed column (formula) | CLIENT | Bases formulas `if()/arith` / Dataview TABLE expr [fetched] | no cross-cell refs |
| 6 | Cross-note aggregate (sum/avg/median/stddev/count/unique) | CLIENT | Bases summaries / Dataview `sum·reduce·average` [fetched] | result-set-wide only |
| 7 | Filter/sort/group folder → dashboard | CLIENT | Dataview `FROM…WHERE…GROUP BY` / Bases filters [fetched] | **~low-thousands notes; `inlinks` = whole graph, slow** [SS] |
| 8 | Conditional render from flag | CLIENT | `if()`/`choice()`/formula [fetched] | none |
| 9 | Inline computed value in prose (due-in-N-days) | CLIENT | Dataview inline `= this.due - date(today)` [fetched] | none |
| 10 | Declarative diagram (flow/seq/gantt/state/ER) | CLIENT+lib | Mermaid fence, text→SVG (~16 types) [fetched] | fixed grammar only |
| 11 | Declarative chart (bar/line/scatter) | CLIENT+lib | Vega-Lite JSON / ` ```chart ` YAML→Chart.js [fetched] | fixed grammar only |
| 12 | Custom render for a named fence | CLIENT | `registerMarkdownCodeBlockProcessor(lang, handler(source,el,ctx))` [fetched] | **the core primitive** |
| 13 | Custom inline/block directive | CLIENT | remark-directive `:x` `::x` `:::x{attrs}` [fetched] | proposal, not core spec [SS] |
| 14 | Arbitrary interactive widget / computed view | **CLIENT+JS⚠** | dataviewjs / MDX / TiddlyWiki widgets [fetched/SS] | **arbitrary eval — the lane to refuse for AI/untrusted vaults** |
| 15 | Full-text / fuzzy search | CLIENT small → SERVER at scale | in-browser index vs. server index | tips over at large corpora |
| 16 | Spatial canvas (freeform x/y, arrows, zoom) | separate format / not flowing md | Obsidian `.canvas` JSON, Excalidraw, tldraw | **HARD BOUNDARY — position data isn't linear text** |
| 17 | Real relational query (joins, txns, 2° indexes) | SERVER | Postgres/SQLite | in-memory frontmatter index can't |
| 18 | Multi-user concurrent state / presence / auth | SERVER | CRDT/OT + auth backend | **HARD BOUNDARY** |
| 19 | Live external data (prices, weather, API) | SERVER | fetch/proxy (+secrets) | needs network + secrets |
| 20 | Semantic classify / summarize / NL→structure / generate | LLM | model call | not a render-time op |

## The hard boundary (as asked)

Three things plain markdown + deterministic render **cannot** do, and no fence trick changes it: **(a) spatial canvas data** — freeform x/y coordinates, connectors, zoom are not expressible as flowing linear text; that's why Obsidian ships a *separate* `.canvas` JSON format, and Excalidraw/tldraw are JSON blobs, not markdown [inference from format design]. **(b) real database queries** — joins across large sets, transactions, secondary indexes exceed an in-browser index rebuilt from files (this is the same wall Dataview hits at scale). **(c) multi-user concurrent state** — presence, conflict resolution, auth, shared mutation require a server (CRDT/OT); a file-per-note model is single-writer by nature.

## Implication for `frontmatter`

1. **The founder's framing is missing a fourth lane, and it's the important one.** The three-way "client / server / LLM" split hides a *client-side-but-arbitrary-code* lane (row 14). The whole product-defensibility bet lives in **staying in rows 1-13 (fixed interpreters + typed data slots) and refusing row 14** for anything the AI or an untrusted vault authors. "Doesn't require much computation" ≈ "doesn't require *arbitrary* computation" — a fixed vocabulary of declarative render verbs, not an eval sandbox.
2. **Ship a small, closed "figure/app vocabulary"** of info-string renderers (`board`, `calendar`, `decision-card`, `dashboard`, `chart`, `diagram`) whose bodies are typed YAML/JSON data slots. Each degrades to a plain code block in any other renderer (CommonMark-guaranteed). The AI fills slots; the interpreter renders; the byte-preserving splice writer already guarantees the surrounding prose is untouched.
3. **Buy the two engines' semantics, not their code.** Bases (formulas + summaries + groupBy views) and Dataview (DQL over folders) already define the deterministic computation surface users expect. Match that surface as a *stable spec*, and publish the **compute ceiling honestly** (rows 7/15/16-19) so the render promise never over-reaches into server/LLM territory silently.

*Method note: primary sources opened via `curl` to allowlisted hosts (api.github.com, raw.githubusercontent.com) — Obsidian Bases help, Dataview docs, remark-directive, CommonMark spec, obsidian-api types; `[SS]` = WebSearch summary (Bases release timing, Dataview perf reports, TiddlyWiki architecture); `[inference]` labeled inline. No WebFetch used (gate risk); no numbers reported without a source.*