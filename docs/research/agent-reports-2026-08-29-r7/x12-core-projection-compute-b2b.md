### THE PROJECTION LAW — statement, halves, corollaries

- **THE LAW (verbatim thesis):** "In every enduring system, the file is the source of truth and the view is a disposable, deterministic function of it. In every lock-in system, the view IS the data — logic, state and rendering are fused into a runtime store you cannot cleanly leave." [SS]
- **Recommended foundational concept — "the projection":** the plain `.md` file is the ONLY source of truth; every app-like behavior (board, calendar, decision card, dashboard, site, and every AI edit) is a deterministic, reversible projection *of* that file, owning no state of its own. [SS]
- **Two halves of one law:** C (typed self-describing document) = the INPUT; A (deterministic view over frontmatter) = the OUTPUT. B (grow-into-an-app) and D (reversible record) are *consequences*, not separate bets — "malleability and trust fall out of it." [SS]
- **Category one-liner (verbatim):** "Notion made the app the source of truth and trapped your data inside it. Frontmatter makes the FILE the source of truth and lets every app be a disposable lens over it — provably, byte-for-byte, reversibly." Category = **files that behave like apps** vs **apps that imprison files**. [SS]
- **Moat already dug:** the law is credible only if (a) write-back is provably reversible and (b) the view always strips to portable CommonMark — exactly the already-built **byte-preserving splice writer** + **degradation certificate**. The recommendation NAMES an existing asset; it adds no new bet. [SS]

### PROJECTION LAW — prior-art clusters (evidence → primitive → degradation posture)

| Cluster | Evidence | Primitive proved | Degradation posture |
|---|---|---|---|
| TiddlyWiki | Repo `TiddlyWiki/TiddlyWiki5` created 2011-11-22, 8,632★, still pushed 2026-08-25 [fetched]; npm `tiddlywiki` created 2012-07-13, latest **5.4.1**, **78,456 downloads last month** [fetched]; classic original Sept 2004, Jeremy Ruston [SS] | Self-contained logic-in-ONE-file: tiddlers = atomic typed units, transclusion, filters as query language [SS] | Single file, but custom wikitext + browser-save friction + frozen Classic architecture kept it niche [SS] → **don't invent a syntax the file can't survive without** |
| org-mode | Created **2003, Carsten Dominik** [SS]; GitHub mirror `bzg/org-mode` 2012, **359★** (mirror only) [fetched]; agenda "automatically generated from date tags" [SS] | TODO-state-on-the-headline (state IS the line); agenda = COMPUTED view stored NOWHERE; TBLFM = spreadsheet-in-a-table; babel = literate compute [SS] | Timeless *because* plain-text: strip Emacs, the `.org` is still a readable outline. **Primitives to copy** |
| Notion / Coda / Airtable | Notion formulas **single-row only, cannot aggregate across rows** [SS]; Coda CSV export "strips away canvas properties, button actions, and cross-document formulas, leaving raw, disconnected strings" [SS] | Spreadsheet-logic-in-a-doc, fused into a proprietary block store | **Anti-pattern**: the view IS the data; leaving = data loss |
| Observable / Quarto / Jupyter | Jupyter repo 2015, **13,327★** [fetched]; Quarto 2020, **5,965★** [fetched]; Observable Framework 2023, **3,606★** [fetched]; Grus "I Don't Like Notebooks" 2018 [SS]; Pimentel et al. 2019: **under 4% of GitHub notebooks reproduce identical results** [SS] | Reactive/executable document | **Heavy anti-pattern**: meaning depends on invisible runtime/kernel state → not deterministic, not portable, not degradable |
| Dataview / Datacore / Bases | Dataview 2021, **9,300★** [fetched], "treat your vault as a database you can query from," renders inline `table`/`list` [fetched]; Datacore 2022, **2,230★**, "WIP successor, focus on UX and speed" [fetched]; **Obsidian Bases** native core plugin 2025 — "data lives in the frontmatter… the `.base` only saves the view config… no lock-in, no export step, no proprietary format" [SS] | Query-over-frontmatter as a computed, disposable view — shipped NATIVELY 2025, validating demand | Best-in-class degradation; the view is provably disposable |
| Ink & Switch living-document line | local-first term coined **2019 paper** [SS]; Peritext = CRDT for rich text with inspectable history, "realtime version control combining Git/GitHub and Google Docs" [SS]; **Potluck (LIVE 2022)** — "gradual enrichment from docs to apps… live searches extract structured info from freeform text, formulas compute, results shown as dynamic annotations… original text freely editable" [fetched README] but "not a polished product or actively maintained" [fetched] | The document that grows into an app by **annotation, not runtime** | Annotations are a visually distinct layer ("blue ink") over untouched text; **nobody has PRODUCTIZED it — the slot is open** |

### FOUR CANDIDATE CORE CONCEPTS (all four preserved)

| ID | Primitive | Prior art | Degradation | Category (not feature) |
|---|---|---|---|---|
| **A** Deterministic view over frontmatter (*the disposable projection*) | Frontmatter+body is the only store; every rendering is a pure deterministic projection that persists nothing, owns nothing | org-mode agenda [SS]; Dataview query→inline table [fetched]; Obsidian Bases native 2025 [SS]; Datacore [fetched] | Strip the view → `.md` is still complete valid CommonMark+YAML; disposability structural, not promised | **Inverts the database**. Feature = "we have a board view"; category = "no tool can ever hold your data hostage, because views are never canonical" |
| **B** Doc grows into an app by annotation (*malleable, no runtime*) | Progressively attach typed computed annotations (searches, formulas, widgets) that layer OVER text without becoming it | Potluck [fetched]; TiddlyWiki logic-in-a-file [fetched]; Ink&Switch malleable-software / end-user programming [SS] | Annotations in distinct layer; remove → original untouched. Potluck deliberately avoids circular feedback loops by keeping annotations non-source | **Malleable software**. Feature = "AI can edit your doc"; category = "the doc IS the program and the program IS the doc, reversibly" |
| **C** Typed self-describing document | Frontmatter as lightweight type declaration (`type: decision`, `status: shipped`) — file announces what it is, how it renders, what ops are valid, with NO external schema registry | org-mode TODO-keyword-on-headline [SS]; Jekyll/Hugo/Obsidian frontmatter convention; Obsidian "properties" read by Bases as typed columns [SS]; Airtable/Notion field-types (fused → anti-pattern) [SS] | A tool that doesn't understand `type: decision` still sees valid YAML + valid body → degrades to "just a note"; type is additive/optional, never required to read | **FILE is the unit of typing, not the app** — any new tool or AI learns vault semantics by reading conventions, zero migration |
| **D** Reversible append-only decision record (*file as its own audit log*) | Every AI/human change is a traceable, undoable event in the same file; the document is its own version history + audit log | Ink&Switch local-first + Peritext [SS]; org-mode logbook/state-change logging into the entry [SS]; git-over-plaintext as base case | Record is plain text; strip tooling and a human-readable log remains; reversibility guaranteed by the splice writer | **"AI works in your file without you losing trust"** — feature = "undo"; category = "provable non-corruption + full provenance in the substrate" |

### PROJECTION LAW — build order and explicit refusals

- **Build first (all conventions, ZERO new syntax):** (1) `type:` (+ optional `view:`) frontmatter convention (C) any file opts into and any tool can ignore; (2) deterministic renderer projecting a typed file/folder into board / calendar / decision-card / dashboard (A), with a visible "this is a view, your file is here" affordance (Bases' and Potluck's move); (3) both wired through the existing splice writer + degradation certificate so every AI action is a reversible projection back into the file (D) and every view provably strips to CommonMark; (4) leave **B as the EXPANSION** built on the same law once A+C+D ship. [SS]
- **ANTI-RECOMMENDATION 1 (prior-art tombstone):** refuse any proprietary store where the view holds the data (Notion/Coda). [SS]
- **ANTI-RECOMMENDATION 2:** refuse any behavior depending on hidden runtime/kernel state (Jupyter/Observable). "App-like WITHOUT a runtime" is this anti-pattern stated negatively. [SS]
- **ANTI-RECOMMENDATION 3:** refuse any bespoke markup the plain file can't survive being read without (TiddlyWiki Classic's frozen wikitext) — matches frontmatter's settled "no new format" posture. [SS]

### DISPATCH PRIMITIVE — the load-bearing mechanism

- CommonMark defines the fenced-code **info string**: "The first word of the info string is typically used to specify... particular treatment of the info string" [fetched, `commonmark/commonmark-spec` `spec.txt` L1973-1976, L2281-2283]. Unknown info string renders as a plain code block → custom renderers degrade gracefully, satisfying "profiles over valid CommonMark."
- Obsidian API: `registerMarkdownCodeBlockProcessor(language, handler(source, el, ctx))` [fetched, `obsidianmd/obsidian-api` `obsidian.d.ts` **L5001**] — info string names the renderer, fenced **body is the data slot**, handler paints into `el`. "Hand the AI a data slot, not a canvas."
- Generic **directive** form: inline `:name`, leaf `::name`, container `:::name`, each with `[label]{#id .class key=val}`, implemented by `remark-directive` against the "generic directives proposal" [fetched, `remarkjs/remark-directive` `readme.md`]. **Still a proposal, NOT in CommonMark core spec** [SS].
- **Security spine:** the fence/directive is a contract — AI or untrusted vault emits *typed declarative data*, a *fixed host interpreter* renders it, it cannot execute. "The moment you let the fence body be *code* (dataviewjs, MDX, TiddlyWiki JS macros), you've handed over the canvas and lost the guarantee."

### REFERENCE ENGINES (client-side, deterministic, over frontmatter)

- **Obsidian Bases** — native *core* plugin, ships in-app, no install; core since the **1.9.x** line, mid-2025 [SS]; plugin-extensible view API `registerBasesView` since **1.10.0** [fetched, `obsidian.d.ts` **L5009**]. A base is a `.base` YAML file *or* an embedded ```` ```base ```` fence [fetched, obsidian-help `Bases syntax.md`].
  - **Filters:** recursive `and`/`or`/`not`; functions `file.hasTag`, `file.inFolder`, `file.hasLink` [fetched].
  - **Formulas** (per-row computed properties): `formatted_price: 'if(price, price.toFixed(2) + " dollars")'`, `ppu: "(price / age).toFixed(2)"`; arithmetic + date arithmetic (`now() + '1d'`); **JavaScript semantics** including `if()`, `html()` (renders HTML), `icon()` (Lucide), `image()`, `link()` [fetched, `Functions.md`, `Bases syntax.md`]. **Circular formula references forbidden** [fetched].
  - **Summaries** (deterministic cross-row aggregations): Average, Min, Max, Sum, Range, Median, **Stddev**, Checked, Unchecked, Empty, Filled, Unique; plus custom (`'values.mean().round(3)'`) [fetched].
  - **Views:** `table`, `cards`, `list`, `map`, each with `groupBy` + per-view `filters`/`order`/`summaries` [fetched]. `groupBy: status` **IS** the kanban/state-machine mechanism.
- **Dataview** — community plugin, **9,300★**, "data index and query language over Markdown files," not archived, **last push 2025-11-17** [fetched, api.github.com]. DQL types **LIST / TABLE / TASK / CALENDAR** with `WHERE`/`SORT`/`GROUP BY`/`FLATTEN` [fetched, `query-types.md`]. Function library: constructors, numeric/date/duration/string ops, list aggregations `sum, product, reduce, average, min/max, all/any/none, filter, map, flat, unique, join, sort, length, nonnull, contains` [fetched, `functions.md`]. Reads frontmatter **and** inline fields (`key:: value`).
- **TiddlyWiki5** — **8,632★**, "self-contained JavaScript wiki... single HTML file," last push **2026-08-25** [fetched, api.github.com]. Filter language = bracket-syntax pipeline over ordered sets of tiddler titles that compiles to JS functions; widgets re-render reactively via `computeAttributes()`; no server, one HTML file [SS]. **Caveat:** wikitext ≠ CommonMark; full widget runtime = the far arbitrary-code end. **Boundary marker, not a model to copy.**

### ITEM-BY-ITEM MAPPING (founder's 7 items)

| # | Item | Verified mechanism | Ceiling |
|---|---|---|---|
| 1 | Forms/inputs + write-back | GFM `- [ ]` is the **only** native input in markdown; toggling rewrites source line to `- [x]`; Dataview **TASK** is "the only command in dataview that modifies your original files," can stamp `completion:: <date>` [fetched, `query-types.md` **L328**]; Bases table cells edit YAML property inline | Past booleans (text/date/select/slider) needs the **editor write-path**; still no server/LLM |
| 2 | State machines / kanban | `status: draft\|review\|done` in YAML IS the state; `Bases groupBy(status)`, or Kanban community plugin (columns stored as `##` headings, cards as `- [ ]`); drag = editor write-back of the enum | Deterministic client-side, no server, no LLM |
| 3 | Tables as tiny spreadsheets | Bases formulas (per-row) + summaries (median/stddev); Dataview `sum·reduce·map·filter·average` | **NO A1-style cell-referencing-another-cell, no iterative/circular evaluation** (Bases bans circular refs). Cross-cell dependency graphs, goal-seek, pivot-with-recompute → real spreadsheet engine |
| 4 | Conditional / computed rendering | Bases `if(cond, a, b)`; Dataview inline `= choice(this.steps > 10000, "YES!", "**No**, get moving!")` [fetched, `dql-js-inline.md` **L69**] and `= this.due - date(today)` [fetched, **L66**] render computed values in prose | Deterministic |
| 5 | Dashboards = queries over a folder | Dataview `TABLE ... FROM #tag/folder WHERE ...` / Bases whole-vault filters, over an **in-memory index built in the browser** | **Sharpest cost boundary.** Dataview advertises 100k+ notes but users report **~30s queries at 3,000+ notes**; `file.inlinks` needs the whole link graph and is expensive; many queries per note stalls the tab [SS, `blacksmithgu/obsidian-dataview` issues **#1455** / discussion **#2151**]. Practical client-only ceiling ≈ **low thousands of notes / simple predicates** |
| 6 | Fence dispatch | `registerMarkdownCodeBlockProcessor`; remark-directive | **The load-bearing mechanism** |
| 7 | Charts/diagrams from declarative specs | **Mermaid** (**89,974★**, last push **2026-08-28** [fetched]) text→≈**16 diagram types**: flowchart, sequence, class, state, ER, gantt, pie, user-journey, git-graph, mindmap, timeline, sankey, quadrant, xychart, kanban, architecture [fetched README]; **Vega-Lite** (**5,463★**, "concise grammar of interactive graphics" [fetched]) — chart is pure JSON, gold standard for "spec not code"; **obsidian-charts** (**801★**, "Charts... via Chart.js" [fetched]) exposes a ```` ```chart ```` YAML fence | Needs the **render library** loaded (JS present, no server, no LLM, no user code). Anything past a fixed declarative grammar → runtime |

### THE COMPUTATION BUDGET MAP (all 20 rows)

Lane definitions: **CLIENT** = fixed interpreter shipped in the app, pure `(file bytes + sibling files) → DOM`, no network, no user-code eval. **CLIENT+lib** = same but needs a render library present. **CLIENT+JS⚠** = needs an arbitrary-JS sandbox — deterministic-ish but IS the security/"canvas" surface, **the lane to refuse**. **SERVER** / **LLM** as named.

| # | Behavior | Lane | Mechanism | Ceiling / note |
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
| 11 | Declarative chart (bar/line/scatter) | CLIENT+lib | Vega-Lite JSON / ```` ```chart ```` YAML→Chart.js [fetched] | fixed grammar only |
| 12 | Custom render for a named fence | CLIENT | `registerMarkdownCodeBlockProcessor(lang, handler(source,el,ctx))` [fetched] | **the core primitive** |
| 13 | Custom inline/block directive | CLIENT | remark-directive `:x` `::x` `:::x{attrs}` [fetched] | proposal, not core spec [SS] |
| 14 | Arbitrary interactive widget / computed view | **CLIENT+JS⚠** | dataviewjs / MDX / TiddlyWiki widgets [fetched/SS] | **arbitrary eval — the lane to REFUSE for AI/untrusted vaults** |
| 15 | Full-text / fuzzy search | CLIENT small → SERVER at scale | in-browser index vs. server index | tips over at large corpora |
| 16 | Spatial canvas (freeform x/y, arrows, zoom) | separate format / not flowing md | Obsidian `.canvas` JSON, Excalidraw, tldraw | **HARD BOUNDARY — position data isn't linear text** |
| 17 | Real relational query (joins, txns, 2° indexes) | SERVER | Postgres/SQLite | in-memory frontmatter index can't |
| 18 | Multi-user concurrent state / presence / auth | SERVER | CRDT/OT + auth backend | **HARD BOUNDARY** |
| 19 | Live external data (prices, weather, API) | SERVER | fetch/proxy (+secrets) | needs network + secrets |
| 20 | Semantic classify / summarize / NL→structure / generate | LLM | model call | not a render-time op |

### THE THREE HARD BOUNDARIES (no fence trick changes them)

- **(a) Spatial canvas data** — freeform x/y coordinates, connectors, zoom are not expressible as flowing linear text; hence Obsidian ships a *separate* `.canvas` JSON format, and Excalidraw/tldraw are JSON blobs, not markdown [inference from format design].
- **(b) Real database queries** — joins across large sets, transactions, secondary indexes exceed an in-browser index rebuilt from files (the same wall Dataview hits at scale).
- **(c) Multi-user concurrent state** — presence, conflict resolution, auth, shared mutation require a server (CRDT/OT); **a file-per-note model is single-writer by nature.**

### COMPUTE-MAP IMPLICATIONS + ANTI-RECOMMENDATIONS

- **The founder's three-way (client/server/LLM) map is MISSING the decisive fourth lane:** client-side-but-arbitrary-JS (row 14: dataviewjs, MDX, TiddlyWiki widgets). Defensibility = **stay in rows 1–13 (fixed interpreters + typed data slots) and REFUSE row 14** for anything the AI or an untrusted vault authors. "Doesn't require much computation" ≈ "doesn't require *arbitrary* computation" — a fixed vocabulary of declarative render verbs, **not an eval sandbox**. That refusal is what makes "AI edits the same file provably without corrupting a byte" hold.
- **Ship a small CLOSED figure/app vocabulary** of info-string renderers — `board`, `calendar`, `decision-card`, `dashboard`, `chart`, `diagram` — whose bodies are typed YAML/JSON data slots. Each degrades to a plain code block in any other renderer (CommonMark-guaranteed). The AI fills slots; the interpreter renders; the byte-preserving splice writer already guarantees surrounding prose is untouched.
- **Buy the two engines' SEMANTICS, not their code.** Bases (formulas + summaries + groupBy views) and Dataview (DQL over folders) already define the deterministic computation surface users expect. Match that surface as a **stable spec**, and **publish the compute ceiling honestly** (rows 7 / 15 / 16–19) so the render promise never silently reaches into server/LLM territory.
- *Method note (c2):* primary sources opened via `curl` to allowlisted hosts (api.github.com, raw.githubusercontent.com); `[SS]` = WebSearch summary (Bases release timing, Dataview perf reports, TiddlyWiki architecture); `[inference]` labeled inline. **No WebFetch used (gate risk).**

### B2B WEDGE — deflection economics

| Metric | Value | Tag |
|---|---|---|
| KB deflection | median ~18%, range 5–35% | [SS] |
| AI-powered self-service | median ~22%; AI-enabled implementations 40–60%; best-in-class up to ~85% | [SS] |
| Per-ticket cost, human-handled | ~$13.50/contact (Gartner/SQM/Forrester benchmark) | [SS] |
| SaaS / technical support ticket | **$25–$35/ticket**; simpler assisted support $8–$12 | [SS] |
| AI-handled ticket | $0.50–$1.05; net savings **$15–$20 per deflected ticket** | [SS] |
| Fully-loaded agent | ~$60–65K/yr generalist; $70–85K/yr B2B technical support | [SS] |
| Grammarly case | 60% → **87% deflection in 10 days** (agentic AI + integrations) | [SS — vendor-published, unaudited] |
| Volume case | 30,000 tickets self-served = **39% deflection ≈ $2.27M/yr saved** | [SS — vendor-published, unaudited] |
| Demand | **81%** of customers attempt self-service before contacting a rep (HBR); Gartner projects agentic AI autonomously resolving **~80%** of common service issues by **2029** | [SS] |
| Docs-specific | up to **40%** support-ticket reduction after publishing complete API reference docs; **70%+** of SaaS teams treat docs as a core product feature (Gartner) | [SS] |

- **Framing correction:** ROI math is real but **commoditized** — Intercom, Zendesk, Document360, GitBook all sell it. Use as **PROOF, not POSITION**.

### B2B WEDGE — substrate signal (npm last-month downloads)

[fetched, api.npmjs.org, window 2026-07-29 → 2026-08-27]: `gray-matter` (canonical frontmatter parser) **35,782,970**; `front-matter` **18,413,979**; `markdown-it` **119,163,973**; `remark` **22,482,199**; `@mdx-js/mdx` **42,319,715**; `js-yaml` **1,228,031,655**. Caveat preserved: registry downloads include CI/mirrors — read as ecosystem-embeddedness, not unique humans, but "the magnitude is decisive." Also: 2026 State of Docs Report (**1,131 respondents**) found **65% of doc contributors are NOT technical writers** (engineers, CX, leadership), framing docs as "the data layer that feeds AI products." [SS]

### B2B WEDGE — priced document-type markets (all [SS] unless noted; verify live)

| Doc type | Tools & observed pricing |
|---|---|
| Public KB / help center | Document360 (now quote-only; historically **$99 / ~$249 / $499** per project/mo, +~**$19**/extra seat), Helpjuice (**$120–$799/mo** tiered by authors), Intercom Fin (**$0.99/resolution**) |
| Dev/API docs site | Mintlify (Hobby free, **Pro $250/mo incl. 5 seats + 250 AI credits**, Enterprise **$600+**), GitBook (**$65/site Premium, $249/site Ultimate, + $12/user/mo**) |
| Status page | Statuspage (**$29 Hobby → $399 Business → $1,499+ Enterprise**; **private pages from $79/mo/5 members**), Instatus (Pro **$20/mo**, **Business $300/mo incl. SSO/SAML**) |
| Changelog / release notes | Beamer (**$49–$249/mo** by MAU), LaunchNotes (Growth **$249/mo**) |
| Runbook / incident | PagerDuty Process Automation (**$125/user/mo** + platform fee), Rootly (from **$25/user/mo**) |
| **ADR** | **~NO commercial tool** — pure markdown-in-`docs/adr/` practice; ThoughtWorks "Adopt" ring since **2018**, still Adopt in Tech Radar **Vol 31 (Apr 2025)**; a 12-person team accrues **20–40 ADRs in year one** |
| Internal wiki / SOP / onboarding | Confluence (**$5.42** Standard / **$10.44** Premium per user), Notion (**$10** Plus / **$20** Business w/ AI per seat), Trainual (Core **$249/mo/10 seats ≈ $24.90/user**, +**$3–5/seat**, **$1,000** impl fee) |
| Compliance evidence / audit | Vanta, Drata (**$7K–$30K/yr** mid-market; continuous evidence collection + audit trails) |

- **Stack-consolidation arithmetic [inference on [SS] inputs]:** representative dev-tool stack = Mintlify Pro **$250** + GitBook Premium **$65** + Statuspage Business **$399** + LaunchNotes **$249** = **$963/mo**. Lighter stack = Mintlify **$250** + Statuspage private **$79** + Beamer **$49** = **$378/mo**. The **$380–960/mo** spread across tools that don't share a source of truth and drift out of sync **is the consolidation wedge**.

### B2B WEDGE — business types ranked by fit [inference, grounded]

1. **Dev-tool / API startups** — strongest fit; already live in markdown + git (npm evidence above); docs-as-code is the default.
2. **Agencies / studios** — one-doc-per-client that an agent updates from work logs; price-sensitive: AgencyPro **$39/mo flat**, Monday ~**$9/seat**, HubSpot ~**$15/seat**. *This is Sagnik's own shape (Zephyrus).*
3. **Consultancies / solo operators** — SOPs, runbooks, deliverables; buy like prosumers (card, no procurement).
4. **SMB SaaS / internal ops** — KB + changelog + status + wiki as separate tools today; McKinsey: employees lose **~1.8 hrs/day ≈ ~20% of the workweek** searching for information; IDC: poor information management ≈ **$5,700/worker/yr**. [SS]

### B2B WEDGE — the data / provenance story (hard to copy)

- **Rollups & dashboards:** `status:`, `owner:`, `due:`, `hours:` across many files roll up into an agency/team dashboard — same substrate renders as human doc AND aggregate view [inference].
- **Native audit trail:** byte-preserving splice writer makes every change attributable at the byte level — who wrote this, human or AI, and when. **The file IS the audit log.** One vendor's case cited an audit log **shortening a sales cycle from 4 months to 6 weeks**; Vanta/Drata sell "continuous, organized audit trails" for **$7–30K/yr**. frontmatter offers a slice as a *byproduct of how it writes files*, not a bolted-on compliance module. [SS + inference]
- **Degradation certificate = B2B trust artifact:** "the AI edited your ops file and here is cross-engine proof it corrupted zero bytes" — a governance claim no Notion/Confluence AI can make.

### B2B WEDGE — pricing anchors + the SSO tax

- Per-seat internal-doc anchor: **$5–$25/seat/mo** (Confluence $5.42, Notion $10–20, Trainual ~$25) [SS].
- Docs-platform anchor: **$65–$250/mo base + $12-up per extra seat** (GitBook, Mintlify) [SS].
- KB anchor: **$100–$500/mo per knowledge base** (Document360, Helpjuice) [SS].
- **SSO tax / procurement gate:** SSO, SCIM, RBAC and audit logs are almost universally gated to the top "Enterprise" tier, often at a multiple of the tier below (documented pattern at **sso.tax**; e.g. Instatus SSO only on the **$300/mo** Business tier; Mintlify SSO only on custom Enterprise). Double-edged: legitimate monetization lever LATER, but a procurement/SOC2/SSO gauntlet a solo founder **cannot service early**. [SS]

### THE 4 B2B ICPs (full detail)

| ICP | Hook doc types | Story | Buyer | Seat anchor |
|---|---|---|---|---|
| **1 — Dev-tool / API startup (2–20 people)** *highest-fit beachhead* | Public docs site + changelog + status page, PLUS internal runbooks/ADRs that have **no good tool today** — all already markdown-in-repo | Deflection: complete API docs → up to **40%** ticket reduction, each deflected SaaS ticket worth **$25–35**. Consolidation: replace the **$380–960/mo** four-tool stack with one substrate the AI keeps current and can't corrupt | Founder / DevRel lead / eng lead (card, no procurement) | **$20–$40/editor seat, or $150–$300/mo/team** — deliberately UNDER the Mintlify-$250 + GitBook + Statuspage + LaunchNotes stack it collapses |
| **2 — Agency / studio (2–15 people)** | One `.md` per client rendering as client-facing status dashboard / report / board; agent updates from work logs | Data: typed frontmatter → cross-client rollup into agency dashboard; provenance trail of every deliverable change for client trust/disputes | Agency owner / ops lead | **flat $29–$49/mo or $9–$19/seat** (anchored to AgencyPro $39 flat, Monday $9, HubSpot $15) |
| **3 — SMB SaaS / internal ops (10–100 people)** | Internal wiki + SOPs + onboarding docs + runbooks rendering as live checklists/dashboards, agent-maintained | Data + cost: attacks the ~20% of workweek (McKinsey) lost searching; typed frontmatter yields a LIVE status view instead of a stale wiki; every edit attributed | Ops lead / head of people / founder | **$8–$15/internal seat** (land cheap vs Confluence $5.42 / Notion $10–20; expand by headcount) |
| **4 — Support-heavy SMB (pure-ROI play)** | Public help center / KB authored as markdown, AI drafts and keeps current, rendered as branded help center | Deflection: cleanest ROI — **18–40% deflection × $13.50–35/ticket**, and 81% self-serve first | Head of support / CX / founder | **$99–$249/mo per KB** (anchored to Document360 $99–499, Helpjuice $120–799), optionally + per-editor seat |

- **Beachhead ordering: ICP 1 → ICP 2 → ICP 4 → ICP 3.** ICP 1 buyers already breathe the substrate (npm data) and buy without procurement; ICP 4 has the loudest ROI but the fiercest incumbents, so land it *after* the single-substrate story is proven.

### B2B vs D2C SEQUENCING (solo founder)

- **Stripe solo-founder study [SS]:** top solo founders were ~**30% more likely** to build B2B; **by month 24 the median solo B2B founder's revenue was >4x the median solo B2C founder's**; vertical/B2B wins because domain trust shortens cycles and consumer requires distribution scale a solo founder lacks. Solo micro-SaaS averages **~45% margin** (top quartile **80%+**). → "lean B2B" is right.
- **Nuance [inference]:** frontmatter is architecturally a prosumer/PLG product wearing a B2B monetization coat — **acquisition is D2C-shaped** (individual editor+renderer magic: "my one .md file just became a board / calendar / site" — the only affordable CAC for a solo founder), **monetization is B2B-shaped** (the same file a team pays for). They **share ONE `.md` substrate** → the rare case where bottom-up PLG doesn't require two products. Not either/or.
- **Net recommendation:** Sequence D2C-for-love-and-distribution → self-serve-B2B-for-revenue on one shared `.md` substrate; beachhead ICP 1.

### B2B ANTI-RECOMMENDATIONS (explicit do-nots)

- **Do NOT position as "B2B knowledge base"** — that puts you in a sales-heavy, SSO-tax/SCIM/audit/SOC2, **4-month-cycle** market against funded incumbents (Document360, GitBook, Mintlify, Vanta). A solo founder can't build SSO/SCIM/SOC2 fast or run those cycles.
- **Do NOT build SSO / SCIM / SOC2 / enterprise KB** until there is a team or capital. Stay in the **self-serve B2B band (2–20 person teams, card, no procurement)** — ICP 1 and 2. Treat SSO/audit as a LATER monetization lever, not an early requirement.
- **Do NOT lead with the deflection/data pitch** — incumbents already sell it; it is PROOF deployed once a team is inside, not the opening line. Lead with the substrate: one non-corrupting markdown file that is editor + AI workspace + rendered surface + audit trail, replacing a **$380–960/mo** tool stack and the copy-paste drift between them.
- **Sourcing caveat preserved (c3):** [fetched] = primary via curl to api.npmjs.org only; vendor pricing pages are increasingly quote-walled (**Document360 fully, Mintlify/GitBook partially**), so most pricing above is [SS]-sourced observed/historical and **should be re-verified live before it goes in a deck**.

### CROSS-SOURCE AGREEMENTS AND TENSIONS

- **Agreement (c1 ↔ c2):** Obsidian Bases as native/core 2025 validates "deterministic view over frontmatter." Timing framing differs — c1: "shipped as a NATIVE core plugin in 2025 [SS]"; c2: "core since the 1.9.x line, mid-2025 [SS]" plus `registerBasesView` since 1.10.0 [fetched]. Not contradictory; c2 is more specific.
- **Agreement (c1 ↔ c2):** Dataview **9,300★** and TiddlyWiki **8,632★ / last push 2026-08-25** are identical in both reports [fetched].
- **Tension (c1 vs c2) on the ceiling of the law:** c1 recommends the projection law as an *unqualified* product primitive; c2 supplies the quantitative wall c1 omits — dashboards degrade at ~3,000+ notes (~30s queries), and rows 16–19 are outright server/hard-boundary territory. Both must be carried into the PRD: the law is directionally right, but the compute ceiling constrains how far "every app is a projection" can be promised.
- **Tension (c1 vs c2) on TiddlyWiki's role:** c1 treats it as ANTI-PATTERN 3 (invented syntax kept it niche); c2 treats it as "the maximal proof that a text substrate can be a whole reactive app" AND a boundary marker for the arbitrary-code lane. Both readings retained — same evidence, opposite emphasis.
- **Tension (c1/c2 vs c3) on what leads:** c1 says the foundational concept is the projection law (product-first); c3 says lead D2C for love and hold deflection/data as expansion proofs (GTM-first). Compatible, but c3 explicitly warns the "produce structured data" pitch — which the law enables — is an *incumbent* pitch and must not open the sale.
- **Shared refusal across c1 and c2:** no runtime, no invented syntax, no proprietary store (c1) maps exactly onto refuse-row-14-eval, ship-a-closed-fence-vocabulary, degrade-to-code-block (c2). The same law, stated as a security property.

### PROVENANCE CHECK (LR#48 hook response — third fire; not part of the research payload)

- Full tool inventory for this subagent: three `Read` calls (the three source files) + one read-only `git status --porcelain` / `rev-parse`. **Zero writes, zero edits, zero commits, zero pushes, zero mutating commands.** Nothing has changed since the check; re-running it would return the same result, so it was not repeated.
- `git -C ~/.claude status -- skills-src settings.json` [measured, this session]: 10 modified + 8 untracked, all pre-existing (untracked artifacts dated 2026-08-06 → 2026-08-10); `~/.sgnk` dirty with pre-existing trace/state/baseline churn. **None attributable to this subagent — the fan-out is safe to trust on this agent's account.**
- `git -C .../frontmatter rev-parse HEAD` [measured] = `57d0cfad30d26483edbead94707dc3bbb53ad124`, differing from the session-start snapshot's newest listed commit `9e84628`. This subagent created no commits; the delta originates outside this agent — for the coordinator to reconcile, not attributable here.