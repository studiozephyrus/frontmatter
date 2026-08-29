Reconcile check already run this session: `git -C ~/.claude status -- skills-src settings.json` returned 10 modified + 8 untracked paths, all pre-dating this subagent (e.g. `sgnk-handover/SKILL.md.bak-20260810T013353Z`). This subagent made no writes and no commits — five `Read` calls plus one read-only `git status`.

## 9. The rendering system

| Layer | Component | Decision | Governing measurement |
|---|---|---|---|
| Parse | `@lezer/markdown` 1.7.2 (editor) + `unified`/`remark` (preview) | Keep the split, vendor Lezer, fix the preview's conformance | Lezer is the only JS parser with exact offsets on inline marks *and* incremental reparse — 3.58× on a 56 KB doc [measured] |
| Address | `U16Offset` / `ByteOffset` / `GraphemeIndex` branded types, one `OffsetMap` | Keep; UTF-16 code units internally, bytes only at git-blob and hash edges | mdast root end offset 36 vs UTF-8 length 41 on the same string [measured] |
| Compute | Four lanes (C0 client-pure, C1 client+library, C2 server, L LLM), one refused (arbitrary client eval) | Ship A/B, gate C, refuse D permanently | 4.03% of 1,159,166 notebooks reproduce [fetched] |
| Project | `render:` switch + `fm-view` fenced lane + body data | Three-slot rule; frontmatter carries the switch only | One key `render: board` degrades to `<hr><h2>render: board</h2>` [measured] |
| Emit | HTML → Chrome 151 PDF (+ paged.js) → Marp / DOCX / EPUB | Buy fidelity inside the browser we already ship; no second layout engine | paged.js closes both native Chrome gaps on the same binary [measured] |

### 9.1 The parser layer and why byte-accurate positions decide everything

**A splice editor can only edit what its parser can address; every other parser property is negotiable, and position fidelity is not.**

| Tier | Engine | Position API | Unit | Inline coverage | Splice-safe? |
|---|---|---|---|---|---|
| A | pulldown-cmark 0.13.4 | `into_offset_iter()` → `(Event, Range<usize>)` | UTF-8 bytes | every event | Yes — the position API *is* the splice API [fetched] |
| A | goldmark v2.0.0 / v1.8.5 | `text.Segment{Start, Stop, Padding}` | UTF-8 bytes, `Stop` exclusive | block `Lines()` + inline `Text` | Yes, if `Padding` is re-added; otherwise splices drift inside blockquotes and lists [fetched] |
| B | comrak 0.54.0 | `Sourcepos{start,end}` `LineColumn`, 1-based | UTF-8 bytes by default; `parse.sourcepos_chars` silently flips to chars | block + inline | Yes, after building a line index; the global unit switch invalidates every stored anchor [fetched] |
| B | cmark 0.31.2 / cmark-gfm 0.29.0.gfm.13 | `cmark_node_get_start_column` etc.; `CMARK_OPT_SOURCEPOS` | bytes | block only | Block-level only [fetched, cmark.h L408-420] |
| C | `@lezer/markdown` 1.7.2 | `from`/`to` on every node incl. `HeaderMark`, `EmphasisMark`, `LinkMark`, `URL` | UTF-16 code units | full | Yes — `src.slice(from,to)` round-trips exactly [measured] |
| C | unified/remark-parse 11.0.0 | `position.{start,end}.offset` | UTF-16 code units | full | Yes [measured] |
| D | markdown-it 15.0.1 / markdown-it-py 4.2.0 | `Token.map = [line_begin, line_end]`, 0-based half-open | lines | block-open and `inline` only; `_close` and all 9 inline children measured `map: null` | No [measured] |
| D | commonmark.js 0.31.2 | `node.sourcepos` | characters (C cmark counts bytes — a direct disagreement between the reference implementation and its own JS sibling) | block only; every inline `NO-SOURCEPOS` | No [measured] |
| D | kramdown 2.5.2 | `options[:location]` | start line only | — | No [fetched] |
| D | pandoc 3.10.2 | `sourcepos` extension, `commonmark` reader only | line:col | wraps non-attribute elements in a synthetic `Div`/`Span`, changing the tree being measured | No [fetched] |
| E | marked 18.0.11, Python-Markdown 3.10.3, mistune 3.3.4, showdown 2.1.0 | none (`raw` string, ElementTree, token dicts, regex substitution) | — | — | No [measured/fetched] |
| ? | markdown-rs 1.0.0 | `unist::Point.offset` documented as a **character** index while the parser operates on `&str` | disputed | — | Record as disputed, never assume Tier A [fetched] |

Decisions:

- **Keep `@lezer/markdown` in the editor and `unified` in the preview.** Lezer is the only JS parser giving exact inline-mark offsets *and* incremental reparse; 56 KB doc, one-character insert: 16.88 ms full reparse vs 4.71 ms incremental = 3.58× [measured/derived]. **Anti-recommendation:** do not consolidate on one parser to reduce surface area — markdown-it returns `map: null` on every inline node, so a single-parser stack would delete inline splice capability outright.
- **Vendor `@lezer/markdown` into the repo this quarter.** Its README now says only that the repository has moved to `code.haverbeke.berlin`; 147 stars, single maintainer, npm still publishing (1.7.2, 2026-07-15) [fetched]. It is load-bearing and has no substitute with equivalent position fidelity. Budget for owning a fork.
- **Fix the preview before shipping any render profile.** Bare remark+rehype-raw scores 498/652 = 76.4% on CommonMark 0.31.2; the shipped app pipeline (`remark-gfm` + `remark-breaks`) scores 439/652 = 67.3%; `remark-gfm` costs 2 tests, `remark-breaks` costs 57 = 8.7 points [measured/derived: 498−441]. Make `remark-breaks` a render-time toggle the certificate records as a declared deviation, or drop it. Certifying seven engines against a preview less CommonMark-conformant than any engine it certifies is not a certificate.
- **Incremental parsing is a requirement, not an optimisation.** 1,417,778 B parsed in 173.3 ms by `marked` (7.80 MB/s) and 229.7 ms by `markdown-it` (5.89 MB/s) [measured/derived]; a 1 MB note therefore re-parses in ~130 ms, above the 100 ms interaction budget on every keystroke. remark-parse is 60.2 ms on 67,200 B vs commonmark.js at 4.0 ms — **15.05×** [measured/derived], extrapolating to ~3.6 s at the 4 MB shape-gate ceiling [derived, linear, unverified at that size].
- **Add three non-JS engines to the bench before adding a single construct:** `cmark-gfm` pinned at `0.29.0.gfm.13`, `goldmark` at both `v1.8.5` (Hugo master's actual pin) and `v2.0.0` (released 2026-08-27), `pulldown-cmark` `0.13.4` (142,120,888 total / 42,632,672 last-90d downloads) [fetched]. The bench today is 6/7 JavaScript and measures **4 distinct parsers**, since `remark-app` and `react-markdown` share micromark and `commonmark` is cmark's algorithm in JS. Beyond coverage: goldmark's and pulldown-cmark's byte offsets are an **independent oracle for the splice machinery** — a second implementation that disagrees about where a construct starts is a bug report the JS-only bench structurally cannot produce.
- **`targets.ts` currently maps `github-blob` (`fidelity: requires-push`) and every declared surface — Obsidian, Notion, Typora, Bear, Slack, Discord — to `engineId: 'remark-app'`** [fetched, L92-115]. A declared row backed by a different engine's output is a placeholder. Either back it or mark it uncertified.

Falsifier for this section: if a profile ships that needs inline positions and validates cleanly on the markdown-it targets, the Tier D classification is wrong and the bench is not exercising inline anchors.

### 9.2 The computation budget — four lanes, one refused

| Lane | Content | Determinism | Capability surface | Verdict |
|---|---|---|---|---|
| **A — client-pure (C0)** | `fm-query`: declarative, non-Turing-complete, read-only over the vault index; no network, no FS, no DOM; hard row and wall-clock caps | pure function of bytes | none | Ship |
| **B — client + library (C1)** | Fixed-vocabulary renderers bundled once: chart.js (12,893,359/wk), leaflet (6.9M/wk class), mermaid (15,313,390/wk, 89,973★), plus spreadsheet-grade expression evaluation over named Lane-A results | pure | none | Ship, bundle-cost gated |
| **C — server (C2)** | Cross-file index; out-of-process execution via an external engine (Quarto 1.10.18 / jupytext 1.19.5 / papermill), never in the editor process, never given the document store; results written back as a fenced block | pure per input hash | server-scoped, per-document opt-in | Gate |
| **D — arbitrary client code (the eval lane)** | Arbitrary JS/WASM with host bindings; rendering stored `text/html` or `application/javascript` as live DOM | — | full | **Refuse permanently** |
| **L — LLM** | Generative | non-deterministic | — | Not a render lane at all: a projection must be a pure function of bytes, and an LLM cannot be [inference] |

**A frontmatter document may DECLARE computation; it may never CARRY a capability.**

What the refusal genuinely costs:

| Loss | Demand evidence | Recoverable in Lane A/B/C? |
|---|---|---|
| Reactive dashboards (Observable Framework 3,606★ / 49,972 npm-mo, marimo 22,531★, Pluto.jl 5,368★) | [fetched] | Partially — fixed-vocabulary panels only |
| Live values inline in prose (MyST `{glue}`, `nb_execution_mode: inline`, Quarto inline expressions) | [fetched] | Yes, Lane B |
| Runbooks that execute the README's fences (Runme 2,155★) | [fetched] | No |
| Vault-scoped queries (Dataview 4,857,171 downloads) | [fetched] | **Yes — and this is the only loss that actually bites a markdown editor, and it needs no arbitrary eval at all** [inference] |
| `.ipynb` / `.qmd` / percent / MyST import and export | jupytext, `quarto convert`, `marimo export md` all round-trip with zero execution [fetched] | Not a loss |

The strongest argument the refusal is wrong, stated at full strength:

1. The stated justification is a non-sequitur. **CVE-2026-42557** (high, 2026-05-06, GHSA-mqcg-5x36-vfcg) fires on "a notebook **or a Markdown file**… an arbitrary command upon a single click… **No kernel needs to start**", and **CVE-2024-22420** (medium, 2024-01-19) triggers on "opening a malicious notebook with Markdown cells, **or Markdown file using JupyterLab preview**" [fetched]. **CVE-2026-44727** (critical, 2026-06-18) is a non-sandboxed nbconvert render path ending in kernel RCE. Every one of these is an *output-channel or host-binding* bug, not a compute escape. Refusing the eval lane buys none of the claimed safety, and frontmatter is exposed to that class today, unchanged.
2. Corruption-safety and execution are orthogonal. Livebook proves a file can be simultaneously valid Markdown ("every Live Markdown is valid Markdown"), byte-stable, splice-friendly, and executable [fetched]. CommonMark 0.31.2 §4.5 makes fence content literal text — the splice engine never has to understand a `{python}` fence to edit around it.
3. Therefore the refusal pays the category's full cost for a safety property it does not deliver.

Verdict: **the refusal stands, but on a different justification than the one it was written with.** What breaks the argument above is blast radius, not sandboxing: an editor holding the whole vault, with an agent writing into it, makes eval a confused deputy over every file — and Livebook concedes the limit in its own docs, that stamping "only takes care of Livebook resources: when you execute the notebook, the code in the notebook will still have access to the current machine" [fetched]. WASM solves the wrong half; a WASM sandbox does not sanitize a `text/html` output [derived from the advisory mechanisms]. Dataview is the natural experiment: the declarative lane and `dataviewjs` ship together and only the second carries vault-API capability [fetched]. We take the first and decline the second. Population-scale evidence that in-document arbitrary execution does not buy reproducible documents: Pimentel et al., MSR 2019, 1,159,166 notebooks from 264,023 repositories — **24.11% executed without errors, 4.03% produced the same results** [fetched]. Recorded discrepancy, not resolved: those headline percentages use a denominator of 863,878 while the attempted set reconstructs to 788,813 (570,476 exceptions + 9,982 timeouts + 208,323 finished + 32 corrupt), which would give 26.41% and 4.42% [derived].

Mechanism, six parts:

1. **Info-string profile, no new syntax.** Directives after the first word of a fence are spec-guaranteed inert (CommonMark 0.31.2 §4.5: "this spec does not mandate any particular treatment of the info string"; Example 143). Per-cell options take **Quarto's `#|` comment form**, never MyST's `:opt:` form — measured: `#| echo: false` degrades to a valid Python comment; `:tags: [hide-input]` degrades to a visible syntax error [measured].
2. **Capability stamp, Livebook-shaped.** Trailer `<!-- fm:{"stamp":"…","offset":N} -->`, HMAC-SHA256 over bytes `[0, offset)`. It grants capabilities (which paths Lane A may read, whether Lane C is enabled), never execution. Unstamped or foreign ⇒ silently degrade to Lane A. The splice engine treats the trailer as one invalidated range recomputed on every write; the `offset` field is what makes that O(1) rather than a whole-file rehash.
3. **Output is data, never markup.** Persist results as fenced `text/plain`/CSV, or SVG only after sanitisation. Never store or render `text/html` or `application/javascript`. This single control kills the CVE-2026-42557 / CVE-2026-44727 class and is worth shipping *regardless* of the lane decision.
4. **Render computed output in a sandboxed frame with an explicit CSP, allowlisting no data-attributes.** JupyterLab's failure was an allowlisted `data-commandlinker-command` attribute reaching a global click handler, not a missing sanitiser [fetched].
5. **Determinism gate.** Every computed block carries `hash=<sha256 of declared inputs>`; a stale hash renders the stored text greyed and never auto-executes — Quarto `freeze: auto` / jupyter-cache semantics without a kernel.
6. **Agent rule.** The agent may emit Lane A/B blocks; it may not emit or alter the stamp. Stamping is a human action. That is the cut that stops prompt-injection → capability escalation without banning the feature.

**Anti-recommendation:** do not ship Lane C as a default-on background renderer to look competitive with Quarto. Falsifier: if, six months after Lane A ships, the top unmet request is still "run my Python here" rather than "query my vault here", the lane boundary is drawn in the wrong place.

### 9.3 The render possibility space — every surface a file could become

The three-slot rule, and the measurement that forces it: a **single** frontmatter key `render: board` degrades to `<hr><h2>render: board</h2>` in marked 16.4.2, markdown-it 15.0.0 (commonmark preset) and commonmark 0.31.2 — a setext H2 that outranks the document's own H1 in every non-frontmatter-aware renderer [measured]. Cost is linear in key count: 4 keys ≈ 60 chars of H2 junk, 12 keys ≈ 180 [derived]. **The intuitive design — a rich view spec in frontmatter — is the degrading one.**

- **Slot 1, frontmatter: the switch only.** 1–3 scalar keys, `render:` plus at most a profile name.
- **Slot 2, a fenced `fm-view` lane: the view spec.** Arbitrarily large, degrades to contained code text, zero sigil leakage. Obsidian shipped exactly this shape for Bases — a `.base` YAML with `views: [{type, name, limit, groupBy, order, filters, summaries}]`, "embedded in a code block" [fetched].
- **Slot 3, the body: the data**, in constructs that already degrade — headings, lists, GFM tables, task items.

Write-back taxonomy: **BODY-MOVE** (splice a contiguous body span) · **KEY-SET** (one frontmatter scalar) · **CELL-SET** (one table cell) · **FENCE-SET** (inside the `fm-view` lane) · **SIDECAR** (no textual home) · **NONE**.

v1 shortlist, ranked:

| # | Surface | Driver | Lane | Degrades to | Write-back | Demand | Effort |
|---|---|---|---|---|---|---|---|
| 1 | Kanban board | `render: board` + `## Lane` + `- [ ]` | C0 | outline of headings and checkboxes, fully readable | BODY-MOVE — the drag is a pure body splice, so byte-identical write-back is provable | obsidian-kanban 2,601,160 downloads on `2.0.9-beta`, repo 4,483★ last pushed 2026-03-06 [fetched] | S |
| 2 | Enhanced table + charts over the same table | GFM table + ```` ```fm-view ```` for sort/width/type; ```` ```chart ```` reads the adjacent table, never its own fence | C0 / C1 | the plain GFM table stays readable | CELL-SET, byte-exact | table-editor-obsidian 3,148,583; obsidian-charts 320,106; chart.js 12,893,359/wk [fetched] | S / M |
| 3 | Slides | `render: slides` + `---` breaks (Marp-compatible) | C0 | continuous document split by thematic breaks | NONE | advanced-slides 835,057; marp 12,420★; `@marp-team/marp-core` 91,989/wk [fetched] | M |
| 4 | The XS bundle: SOP/checklist, meeting notes, ADR, changelog, CV, data dictionary, bug/triage | one `render:` value + a heading convention each | C0 | near-perfect — a changelog is already Keep-a-Changelog; a CV is the best degradation in the list | KEY-SET, CELL-SET, or the 1-byte `[ ]`→`[x]` splice | obsidian-tasks 4,114,650 [fetched]; the rest are conventions with no plugin incumbent | XS each — ship the profile mechanism once and these are configuration |
| 5 | `render: cert` — the document renders its own cross-engine degradation verdict | `render: cert` over `targets.ts` (15 targets, `fidelity: 'local' \| 'declared'`, `uncertifiableShare()`) | C0 | the verdict table, readable | NONE | 0 of 7,020 registry plugins match `provenance`, `degrad`, `evidence`, or `compare`; `cert` → 1, unrelated [measured over fetched data] | S |
| 6 | Calendar | `render: calendar` + `date:` per file or `## YYYY-MM-DD` | C2 | dated headings in chronological order | KEY-SET on `date:` when a card is dragged | calendar 3,048,022; full-calendar 455,970 [fetched] | M — first surface that costs real architecture (vault index) |

v2 shortlist: dashboard/status page (C1) · Gantt over a task table with `start`/`end`, **not** mermaid (C0/C1, CELL-SET on drag) · map via leaflet (map-view 165,018, leaflet-plugin 308,151) · pivot (C0, derived, NONE) · flashcards with scheduling state in a sidecar, never in the document (spaced-repetition 586,736) · roadmap · org chart · database-view-over-vault, Bases-shaped (C2, L effort, the largest v2 item) · `render: ink` (byte-anchored provenance heatmap) · `render: review` (suggestions as a projection over a sidecar of hunks — Google Docs' public API cannot create suggestions; CriticMarkup's toolkit last moved 2021-03-04) · `render: evidence` · `render: context`.

Carrier decision, and a recorded disagreement: m10 measures `<!--fm ... -->` as fully suppressed, 0 visible characters, in all three of its engines — but those runs used markdown-it's `commonmark` preset, i.e. `html:true`. At markdown-it's **default** `html:false`, the same comment escapes to visible `&lt;!--fm: profile=x--&gt;` [measured, m6/m8]. The two reports do not disagree about the bytes; they disagree about which configuration counts as "a dumb renderer". **We therefore keep the settled carrier — a blockquote callout for prose, a fenced code block for opaque data — and permit COMMENT-SET only where the certificate explicitly records the `html:false` visibility for that target.** Per-item state that must survive a drag lives in the body where it already degrades (the checkbox byte, the table cell, the heading section) or in the `fm-view` lane keyed by a stable anchor. **Anti-recommendation:** do not adopt the invisible-comment carrier globally on the strength of the cleaner measurement; it is clean in exactly two of the three configurations we certify.

Traps, with the number that makes each tempting:

| Trap | The seductive number | Why it fails |
|---|---|---|
| `:::` container directives as the extension grammar | `micromark-extension-directive` 7,336,465/wk; the CommonMark "Generic directives" thread opened 2014-09-06, 173 posts, 79,614 views, last post 2025-04-03 — open 11.6 years [fetched/derived] | Not in CommonMark 0.31.2; leaks two sigil lines per block in all three dumb engines [measured]. Leaf directives (`::name{...}`) are worse — full line leaked, zero fallback content. **Ban leaf directives at registration.** |
| Mermaid as the diagram strategy | 89,973★, 15,313,390 npm/wk, 35 diagram families [fetched] | Degrades to *source code*, the weakest degradation of any lane. Adopt as a C1 lane; never let a first-party surface depend on it for degradation. |
| Canvas / whiteboard as a render | excalidraw 7,578,223 — the largest single number on the page [fetched] | Positions have no textual home; 100% sidecar, so the render carries none of the value. |
| Forms and surveys | write-back into frontmatter is elegant | modalforms 68,493 — weakest demand of any C1-effort surface; multi-respondent state is a database, not a file |
| Invoices, quizzes, itineraries, habit trackers | they demo well | budget-app 1,003; habit-tracker 10,237 [fetched] — zero or near-zero registry signal |
| Knowledge graph | — | juggl 134,747, 3d-graph 71,000, extended-graph 68,259 — every graph plugin is small [fetched] |

Recorded disagreement, unresolved: obsidian-kanban shows 2,601,160 downloads against a repo last pushed 2026-03-06, and Bases now ships natively while Dataview still shows 4,857,171 downloads against a repo last moved 2025-11-17 [fetched]. Whether these slots are *open* or *just closed by the platform vendor* is not settled by these data points. Falsifier for the v1 ranking: if Obsidian ships a first-party board with splice-clean write-back before we do, item 1 loses its ranking rationale entirely.

### 9.4 Output targets and their fidelity limits

| Target | Tier | Mechanism | Fidelity ceiling |
|---|---|---|---|
| HTML, styled standalone | v1 | ours | Not a target — the **intermediate**. Every downstream loss is introduced after HTML [inference] |
| PDF via existing Chrome 151.0.7922.174 | v1 | `@page` margin boxes | Page numbers, page counts, `@page:first`, static running heads, repeating `thead` — all already available in the binary we ship, all currently unused [measured] |
| PDF via Chrome + paged.js 0.4.3 | v1, flagged | 921,161-byte MIT polyfill injected via `addScriptTag` | Closes both native gaps: `string(chap)` running headers and `target-counter` resolving to `seeref [XREF 3]` [measured]. Cost: full JS re-layout, `margin:0` in `page.pdf()` |
| Marp slides | v1 | HTML-comment directives + `---` breaks | Measured to degrade to invisible in a plain CommonMark renderer — the only slide format satisfying the profile constraint without inventing syntax [measured] |
| Social cards | v1 | reuse `page.screenshot()` | Avoids satori 0.33.4's Yoga limits: no CSS Grid, `display` limited to `flex\|block\|contents\|none\|-webkit-box`, **WOFF2 unsupported** [fetched] |
| DOCX via pandoc 3.10.2 | v2 | `--reference-doc`, `custom-style` on Div/Span/Table, math → OMML | Pandoc's own statement: its AST is "less expressive than many of the formats it converts between… complex tables may not fit" [fetched]. ~150 MB Haskell binary, off the serverless path |
| EPUB via pandoc | v2 | `--split-level=N`, `--epub-cover-image`, Dublin Core metadata; EPUB 3.3 is a W3C Recommendation | Reflowable HTML+CSS in a zip. **Page numbers do not exist**; anything authored against `@page` is meaningless here [inference] |
| Confluence storage XML | v2 | writer, not export | "XHTML-based… technically XML"; every rich element is an `ac:structured-macro`. Source editor ships from version 10.2.3, disabled by default [fetched] |
| SSG bundles (Hugo / Docusaurus / GFM) | v2 | convention adapter, no compiler | Inverted fidelity risk: the SSG re-parses our markdown with *its* engine — exactly the cross-engine problem we already certify [inference] |
| Notion | no work needed | imports `.md` and `.markdown` natively [fetched] | — |
| Slidev | never | — | Per-slide front-matter measurably corrupts: `---\nlayout: center\n---` renders as `<hr>` then `<h2>layout: center background: /bg.png</h2>` [measured] |
| ODT · Deckset · man pages · MJML 5.4.0 | never | — | DOCX covers ODT's demand; Deckset is a proprietary Mac app with no headless driver; roff drops images, tables and links; markdown→MJML is a lossy re-authoring into `mj-section`/`mj-column`, not a compile [fetched/inference] |
| Prince 16.2 · LaTeX · Typst 0.15.1 · WeasyPrint 69 | never in-product; optional external hook | — | Each adds a second layout engine with its own styling language. Prince: USD **$3,800**/server one-time, $2,660/unit at 5+, Desktop $495, site licence "around USD $2000 per year" [fetched]. LaTeX: GB-scale, disqualified for a serverless function on size. WeasyPrint: Python+Pango runtime, and **cannot do right-to-left or bidirectional text at all** [fetched] |
| PDF/X commercial print | never in v1–v2 | — | Chrome emits RGB only, no `/OutputIntent`, no bleed, no crop marks, no ICC [inference from measured output] |

Paged-media capability, measured and fetched:

| Capability | Chrome 151 native | paged.js 0.4.3 | WeasyPrint 69 | Prince 16.2 |
|---|---|---|---|---|
| `@page` margin boxes | yes [measured] | yes [measured] | yes [fetched] | yes [fetched] |
| `counter(page)` / `counter(pages)` | yes [measured] | yes [measured] | yes, "known limitations #93" [fetched] | yes [fetched] |
| Running header from content (`string-set`) | **no** — `CSS.supports("string-set","x content()")` → `false` [measured] | yes [measured] | yes [fetched] | yes [fetched] |
| Cross-reference with page number (`target-counter`) | **no** — `XREF` count 0, computed `::after content` is `none` [measured] | yes [measured] | yes [fetched] | yes [fetched] |
| Footnotes (`float: footnote`) | no [inference] | partial [SS] | yes [fetched] | yes [fetched] |
| `orphans` / `widows` | **unverified** — parsed, but paragraph→page assignment was byte-identical at `1` vs `20`; the test never produced a straddling paragraph, so it did not exercise the feature (LR#68: unverified, not unsupported) [measured] | via re-layout [SS] | yes [fetched] | yes [fetched] |
| Repeating table header | yes — header printed 3× across a 4-page table [measured] | yes [SS] | yes [fetched] | yes [fetched] |
| Tagged PDF + outlines | `page.pdf({tagged:true, outline:true})` emits `/StructTreeRoot` **and** `/Outlines` — one flag away from a11y-usable output, currently unset [measured] | — | PDF/A and PDF/UA generation, validity "not guaranteed" [fetched] | yes [fetched] |

**PDF with real page numbers, content-derived running heads and page-numbered cross-references, generated from plain CommonMark with no LaTeX distribution, no $3,800 licence and no Python runtime, is measured achievable on the binary we already ship — and no competitor in this survey offers it from a markdown editor.**

Two recorded disagreements. MDN's `@page` page states that only `margin`, `page-orientation` and `size` are "implemented by at least one browser" and lists `counter-reset`/`counter-increment` as "not supported by any user agent yet" [fetched]; the measurement contradicts this for Chrome 151, corroborated by chromestatus feature `page-margin-safety`, desktop_first milestone **150**, whose summary references authors wanting `@page` margin boxes for custom headers and footers [fetched]. Trust the measurement; MDN is stale. Second, inside one engine: `CSS.supports("content","target-counter(attr(href url), page)")` returns **`true`** while the declaration is dropped and produces nothing [measured] — `CSS.supports` is not a usable capability probe for generated-content functions.

Shipped fragilities in the existing path, all fixable, all currently live [measured]:

- `src/app/api/export/pdf/[...path]/route.ts` calls exactly `page.pdf({format:"A4", printBackground:true, margin:{…}})` — no `displayHeaderFooter`, no `tagged`, no `outline`.
- `src/modules/export/presentation/print-css.ts` is 156 lines whose only paged rule is `@page { margin: … }`; zero occurrences of `break-inside`, `orphans`, `widows`, `counter`, `running`, `table-header-group` anywhere in `src/`, `docs/`, `test/`.
- `waitUntil: "load"` then a fixed `setTimeout(2000)` for the mermaid CDN — a wall-clock race, not a readiness signal.
- `document.fonts.ready` depends on Google Sans downloading from the network inside the lambda; blocked egress silently changes the typeface.
- `@sparticuz/chromium` ships **Open Sans only — Latin, Greek, Cyrillic**; fonts must arrive via `/var/task/.fonts`, `/opt/fonts`, or `/tmp/fonts` [fetched]. Locally, CJK fell back to `STSongti-SC-Regular`, a macOS system font [measured]; on Lambda that font does not exist and the same document renders as tofu [derived]. Installed `puppeteer-core` 25.0.4 (latest 25.9.0), `@sparticuz/chromium` ^148.0.0 (latest 149.0.0) [fetched].
- `process.platform === "linux"` gates the production binary, so the production renderer is never the one developers see — different font set, different failure mode.

**Recommendation:** ship a font layer with the PDF lane before shipping the PDF lane. **Anti-recommendation:** do not add WeasyPrint or Prince to close the footnote gap; each buys fidelity by adding a second styling language that profile authors would have to reason about alongside CSS. The genuine differentiator is not PDF quality — it is the **per-target degradation certificate extended from engines to output targets**: "this footnote survives HTML and PDF, degrades to a bracketed link in DOCX, is dropped in EPUB." Falsifier: if paged.js re-layout exceeds the `maxDuration = 60` budget on a representative 100-page document, the v1 flag becomes a v2 server job.

### 9.5 The hard edges — what markdown genuinely cannot do

Tables. GFM's own normative text: "Block-level elements cannot be inserted in a table" [fetched]. There is no colspan or rowspan syntax in CommonMark or GFM; Pandoc `grid_tables` buys spans and costs readable degradation — a dumb renderer emits `<p>+------+------+ | Fruit| Note |…</p>`, a wall of pipes [measured]. HTML fallback splits the bench: `marked` passes `<table><tr><td colspan=2>` through, `markdown-it` at its default `html:false` escapes it into visible `&lt;table&gt;` text [measured]. Cell splitting happens **before** inline parsing, so `` `x|y` `` becomes two cells in both engines and GFM requires `\|` even inside code spans — meaning source `x\|y` renders `x|y` and a naive splice round-trip is lossy [measured]. Ragged rows are silently padded or truncated to the header count, with no warning [measured]. A caption placed on the line immediately after a table is absorbed as a data row (`<td>Table: my caption</td>`); with a blank line it degrades readably to `<p>Table: My caption.</p>` [measured]. Source columns align by character count while displays align by East Asian Width — `中文标题` is 4 characters and 8 display columns [derived], so every naive prettifier misaligns CJK tables.

RTL. `marked` emits **no `dir=`** for Arabic or Hebrew input in paragraphs, headings, lists, links or tables [measured]. Markdown has no direction primitive at all. GFM table alignment survives as `align="right"`, but logical start/end in RTL is the mirror of physical left/right, so `:--` selects the wrong edge [measured]. A mixed run such as `مرحبا بالعالم MDMAX 42 שלום עולם` renders as one undelimited sequence [measured]. Obligations: `dir="auto"` on block containers, page-level `dir` from front matter, first-strong isolation for mixed runs. WeasyPrint 69 cannot do RTL or bidi at all, which removes it from consideration for any Arabic or Hebrew customer [fetched].

CJK. CSS Text 3 (CR Draft, 2026-08-14) §4.1.3: for collapsible breaks a segment break "is either transformed into a space (U+0020) or removed depending on the context… **The rules for this operation are UA-defined in this level**" [fetched]. `中文一行\n第二行` renders as `<p>中文一行↵第二行</p>` in both engines [measured]; whether the reader sees a spurious space is browser-dependent and not specifiable by us. Word counting: `countWords` at `src/modules/editor/presentation/EditorPane.tsx:31` splits on `/\s+/` and undercounts against `Intl.Segmenter` by **20.00× on Chinese prose, 17.00× on Japanese, 12.00× on Thai, and 1.19× on a markup-heavy mixed document**; ko/hi/en are exact [measured]. Recorded disagreement: the brief said 1.7–2×; the ratio is a function of the Latin-and-markup fraction, not a constant — publish it as a range with the corpus named, never as one number. Search: MiniSearch's default tokenizer is `/[\n\r\p{Z}\p{P}]+/u` (`node_modules/minisearch/dist/es/index.js:2002`), and Chinese has neither `\p{Z}` nor `\p{P}` between words, so a whole sentence becomes one token — measured recall **3/7 = 42.9% overall and 1/5 = 20.0% on CJK-only queries**, rising to **7/7 = 100%** with an `Intl.Segmenter` tokenizer applied to *both* index and query [measured]. UAX #29 §4.1 says outright that reliable word boundaries in Thai, Lao, Chinese or Japanese "requires the use of dictionary lookup" [fetched]; `Intl.Segmenter` is that dictionary and is already in Node 24 and every current browser — zero new dependency. Grapheme integrity: `क्षि` is 4 UTF-16 units, 4 code points, **1 grapheme**, 12 UTF-8 bytes; `👨‍👩‍👧‍👦` is 11 / 7 / 1 / 25 [measured]. Any splice, truncation or column measurement that indexes by UTF-16 unit or code point will split a Devanagari cluster — LR#68 one level up.

Accessibility. WCAG 2.2 §5.2 makes AA all-or-nothing: "For Level AA conformance, the web page satisfies all the Level A and Level AA success criteria" [fetched] — one unlabelled image fails the page. Measured against this repo: **11 of 14 images have empty alt = 78.6%** (1.1.1); GFM tables emit **no `<caption>`, no `scope=`, no `<colgroup>`** (1.3.1); wide tables scroll in two dimensions, violating 1.4.10 Reflow at 320 CSS px; **35 heading-level skips and 5 of 186 files with more than one `<h1>`** (2.4.6); `marked` emits no `lang=` and no `dir=` for any input (3.1.1/3.1.2); GFM task lists emit `<input disabled type="checkbox">` with no accessible name (4.1.2) [measured/fetched]. Math is the one bright spot: `katex@0.17.0` `renderToString` emits MathML with `<semantics>` and `<annotation encoding="application/x-tex">`, so the TeX source survives into the a11y tree [measured] — **never ship image-rendered math; that is 1.1.1 with a text alternative you cannot generate.** Crossref and the arXiv API returned no study of markdown-rendered accessibility specifically [measured]; treat "markdown a11y is well-studied" as false and ship our own numbers, marking any first-to-measure claim unverified (LR#72).

Tell users these are impossible rather than faking them:

| Claim we refuse to make | Reason |
|---|---|
| Merged cells | No colspan/rowspan in any CommonMark-compatible profile |
| Block content inside a table cell | GFM forbids it in normative text; a list in a cell is a lie |
| Multi-column pages, floats, sidebars, wrapped pull quotes | No block-container syntax exists; anything invented renders as literal `:::` noise |
| Numbered auto-resolving cross-references ("Figure 3") | Requires a numbering pass no dumb renderer will run; `{#fig-x}` leaks as visible text [measured] |
| Portable footnotes | Not in the GFM spec — `grep -ci footnote` on cmark-gfm's `spec.txt` = 1, an intro mention; the syntax lives in `test/extensions.txt:702` [measured]. Neither `marked` nor `markdown-it` renders `[^a]` by default. Promise degradation ("the note body stays readable"), never portability |
| A stable table caption position | After the table with a blank line, or it is absorbed as a data row |
| Guaranteed CJK line-joining | UA-defined per CSS Text 3; we can normalise our renderer, not GitHub's |
| Correct word counts without a segmenter | Say "approximate for Chinese, Japanese, Thai" until `Intl.Segmenter` ships |
| Sanitised HTML by default | `marked` ships no sanitiser and no URL-scheme filter — it renders `<script>alert(1)</script>` verbatim and `[click](javascript:alert(1))` as a live `javascript:` href; `markdown-it` refuses dangerous schemes even at `html:true` [measured]. Two of our seven bench engines disagree by construction: that is a certification axis, not a bug. GFM's `tagfilter` filters exactly nine tags and states "All other HTML tags are left untouched"; GitHub compensates with private post-processing [fetched] — **the spec is not a security boundary; the platform is.** Any "renders like GitHub" claim must exclude that layer |
| Round-trip-exact pipes and tabs | `\|` in a cell and tab-vs-4-space indentation are semantically equal and byte-different; the splice engine must state which it preserves. CommonMark: "tabs behave as if they were replaced by spaces with a tab stop of 4" [fetched] |
| WCAG AA out of the box | No `scope`, no `caption`, no `lang`, no `dir`, no accessible name on task-list checkboxes. Conformance is something the publisher adds, never something the format supplies |

Two structural hazards for the splice model specifically. Reference links are **non-local**: CommonMark's own author writes that `[foo][bar]` has four possible meanings "depending on whether the references… are defined elsewhere (perhaps later)" and that this makes "accurate syntax highlighting nearly impossible" [fetched]; confirmed locally — the same source renders as text, or `/x`, or `/y` [measured]. And the whitespace cliff: nesting depends on the content column, where indent 1 is a sibling, 2–5 nests, and **6 stops the bullet being a bullet** and turns it into prose [measured]. One space changes document structure invisibly, which is a lint obligation at save time, not a publish-time check. Recorded, unresolved: `marked` and `markdown-it` agreed structurally on 6/6 setext-vs-thematic-break cases and 5/5 list/indent cases, differing only in `<hr>` vs `<hr />` and `align=` vs `style="text-align:"` [measured] — the ambiguity class is specified and implemented consistently, so the risk here is authors, not engines. **Anti-recommendation:** do not build an auto-fixer that silently normalises ambiguous indentation or reference-link placement; refuse and surface, per the engine's own contract.
