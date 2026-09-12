### 1a. Comparison table — JS/TS engines

| Engine | Lang | CommonMark conformance | Extension API shape | Incremental | Position info | Perf (measured here) | Licence | Version (date) |
|---|---|---|---|---|---|---|---|---|
| unified + remark-parse | JS | **76.4%** 498/652 vs 0.31.2 [measured] | 3 layers: micromark syntax extensions (tokenizer), mdast-util (AST bridge), remark plugin (`Transformer` over mdast) | No | mdast `position{start,end}{line,column,offset}`, offset = **UTF-16 code units**, on every node incl. inline [measured] | 60.2 ms parse / 70.6 ms full for 67,200 B → **1.1 MB/s** [measured] | MIT | unified 11.0.5 (2024-06-19); remark-parse 11.0.0 (2023-09-18) [fetched] |
| micromark | JS | Reference-grade (CM 0.31.2 target) [SS] | `SyntaxExtension` state machines + `HtmlExtension`; construct-level, not AST-level | No | Token `start`/`end` Points + internal `_index`/`_bufferIndex` chunk coords [fetched] | (not separable from remark) | MIT | 4.0.2 (2025-02-27) [fetched] |
| markdown-it | TS (v15) | **100.0%** 652/652 on `commonmark` preset; **80.1%** 522/652 on default preset (44 HTML-block failures are `html:false`, a config choice not a defect) [measured] | `Ruler` — `md.block.ruler.before/after/at`, `md.inline.ruler`, `md.core.ruler`, `md.renderer.rules[type]`. Flat, ordered, named | No | `Token.map = [line_begin, line_end]`, 0-based half-open, **block-open + `inline` tokens only**; `_close` and every inline child are `map: null` [measured] | 5.8 ms parse / 7.0 ms render → **9.1 MB/s** [measured] | MIT | 15.0.1 (2026-08-27) [fetched] |
| marked | JS | **82.4%** 537/652 [measured] | `marked.use({extensions:[{name,level:'block'\|'inline',start,tokenizer,renderer}]})` + `walkTokens`, `hooks` | No | **None.** Tokens carry `raw: string` only [measured] | 6.1 ms → **10.5 MB/s** [measured] | NOASSERTION (MIT text) | 18.0.11 (2026-08-24) [fetched] |
| commonmark.js | JS | **100.0%** 652/652 [measured] | None. `Parser`/`HtmlRenderer` subclassing only | No | `node.sourcepos=[[l,c],[l,c]]` on **block nodes only**; every inline returns `undefined`. Columns in **characters** [measured] | 4.0 ms → **15.8 MB/s** — fastest measured [measured] | BSD-2-Clause | 0.31.2 (2024-09-19) [fetched] |
| @lezer/markdown | TS | Deliberately non-conforming: single-pass, **does not validate link references**, so `[a][b]` parses as a link with no `[b]` definition [fetched] | `MarkdownExtension`: `{parseBlock, parseInline, defineNodes, props, wrap}` | **Yes** — consumes/produces `TreeFragment` | `from`/`to` on **every** node incl. `HeaderMark`/`EmphasisMark`/`LinkMark`; JS string units; `src.slice(from,to)` round-trips exactly [measured] | 7.7 ms cold → 8.3 MB/s; 56 KB doc: full reparse 16.88 ms vs incremental 4.71 ms = **3.58×** [measured/derived] | MIT | 1.7.2 (2026-07-15) [fetched] |
| showdown | JS | Legacy regex matcher; `cmSpec` option documented on master but **unreleased** [fetched] | `showdown.extension(name, {type:'lang'\|'output', regex, replace})` — string filters | No | None [inference: no parse API, `makeHtml` only] | not benchmarked | MIT | 2.1.0 (**2022-04-21**) — master pushed 2026-08-25, 228 open issues [fetched] |

### 1b. Comparison table — native, Python, Ruby

| Engine | Lang | Conformance | Extension API | Incremental | Position info | Licence | Version (date) |
|---|---|---|---|---|---|---|---|
| cmark | C | Reference impl of CM 0.31.2 | None public beyond `cmark_node_*` tree surgery + custom renderers | No | `cmark_node_get_start_line/start_column/end_line/end_column`; `CMARK_OPT_SOURCEPOS` emits `data-sourcepos` on **block elements only**; columns in **bytes** [fetched cmark.h L408-420, L601-603] | BSD-2 (NOASSERTION) | 0.31.2 (2026-02-14), 2,025★ [fetched] |
| cmark-gfm | C | CM 0.29 + 5 GFM extensions: `autolink, strikethrough, table, tagfilter, tasklist` [fetched] | `cmark_syntax_extension` — open/match/postprocess callbacks | No | Same as cmark | BSD-2 (NOASSERTION) | **0.29.0.gfm.13 (2023-07-21)** — 3 y stale, 135 open issues [fetched] |
| goldmark | Go | "compliant with CommonMark 0.31.2" [fetched README L11] | `parser.BlockParser` / `InlineParser` / `ASTTransformer` / `NodeRenderer` interfaces + `WithExtensions`. Built-ins: Table, Strikethrough, Linkify, TaskList, GFM, DefinitionList, Footnote, Typographer, CJK | No | **`text.Segment{Start, Stop, Padding, ForceNewline}` — byte offsets into the source `[]byte`, Stop exclusive** [fetched text/segment.go] | MIT | **v2.0.0 (2026-08-27)** — Hugo master still pins **v1.8.5** [fetched go.mod] | 
| comrak | Rust | cmark-gfm-compatible incl. sourcepos parity | `ExtensionOptions` flags + `Plugins` for syntax highlighting; no user block parsers | No | `Sourcepos{start,end}` of `LineColumn{line,column}`, 1-based; **column in UTF-8 bytes by default, matching cmark**; `parse.sourcepos_chars` switches to char count [fetched nodes.rs L890-906] | NOASSERTION (BSD-2) | 0.54.0 (2026-07-12); 7,222,326 total dl, 1,974,184 last-90d [fetched] |
| pulldown-cmark | Rust | "goal is 100% compliance" [fetched README L19]; `no_std` + opt-in SIMD scanners since 0.5 | Pull-parser events; extension = consume/rewrite the `Event` stream. No parser plugins | No | **`into_offset_iter()` → `(Event, Range<usize>)` byte range into the input for every event, block and inline** [fetched parse.rs L333] | MIT | 0.13.4 (2026-05-20); **142,120,888 total dl, 42,632,672 last-90d** [fetched] |
| markdown-rs | Rust | CM + GFM + MDX, port of micromark | Compile-time `Constructs` toggles; no user extensions | No | `unist::Point{line, column, offset}` on every mdast node — docstring says offset is a **"character"** index, which disagrees with Rust `&str` byte indexing; **unresolved, do not assume bytes** [fetched unist.rs L15] | MIT | 1.0.0 (2025-04-23) — repo untouched since [fetched] |
| pandoc | Haskell | 43 readers / 50 writers [fetched]; `commonmark` reader is CM-conformant, `markdown` reader is its own dialect | Lua filters (`Pandoc`/`Block`/`Inline` walkers), JSON filters, custom readers/writers | No | `sourcepos` extension, **commonmark reader only**: `data-pos` attribute on elements that accept attributes, others wrapped in a `Div`/`Span` [fetched MANUAL] | GPL-2.0 | 3.10.2 (2026-08-12), 46,052★ [fetched] |
| kramdown | Ruby | GFM via `kramdown-parser-gfm`; not CM-conformant | `Kramdown::Parser` subclassing; converters | No | `element.options[:location]` = **start line number only** [fetched element.rb L27] | MIT | 2.5.2 (2026-01-19); 250,077,481 total dl [fetched] |
| Python-Markdown | Python | Not CM-conformant (Markdown.pl lineage) | 5 ordered stages: `preprocessors` → `blockprocessors` → `inlinePatterns` → `treeprocessors` → `postprocessors` [fetched core.py L152-156] | No | **None** — ElementTree carries no source location at any stage [fetched] | BSD-3-Clause | 3.10.3 (2026-07-30) [fetched] |
| markdown-it-py | Python | Port of markdown-it; `commonmark` preset | Same `Ruler` API as markdown-it; `mdit_py_plugins` | No | `Token.map = [line_begin, line_end]`, same limits as JS [inference: direct port] | MIT | 4.2.0 (2026-05-07) [fetched] |
| mistune | Python | Not CM-conformant | `md.use(plugin)` — regex + `parse_method`, plus `::: directive` blocks | No | **None** — token dicts `{"type", "raw", "attrs"}`; `raw` only on some block tokens [fetched block_parser.py] | BSD-3-Clause | 3.3.4 (2026-07-22) [fetched] |

### 1c. Plugin ecosystem — npm downloads, week ending 2026-08-27 [fetched]

| Package | Weekly dl | Package | Weekly dl |
|---|---|---|---|
| marked | 71,970,387 | markdown-it | 30,053,020 |
| micromark | 56,793,570 | rehype-raw | 18,465,692 |
| unified | 54,815,190 | remark-mdx | 12,461,956 |
| remark-parse | 50,948,894 | rehype-sanitize | 10,136,308 |
| mdast-util-to-markdown | 50,696,988 | remark-math | 8,517,043 |
| remark-rehype | 43,763,874 | rehype-stringify | 8,034,284 |
| remark-gfm | 39,104,377 | remark-frontmatter | 5,189,330 |
| remark-stringify | 38,382,673 | @lezer/markdown | 4,682,108 |
| — | — | remark-directive | 3,878,616 |
| markdown-it-anchor | 3,128,654 | rehype-highlight | 2,037,754 |
| showdown | 1,417,755 | commonmark | 801,083 |
| markdown-it-emoji | 724,814 | markdown-it-footnote | 586,762 |
| markdown-it-container | 583,539 | markdown-it-attrs | 291,408 |
| markdown-it-texmath | 50,992 | — | — |

- Keyword-scoped package counts, 2026-08-29 [fetched]: `keywords:remark-plugin` **535**, `keywords:rehype-plugin` **267**, `keywords:markdown-it-plugin` **878**, `keywords:micromark-extension` **92**, `keywords:unified` **1,497**. Unscoped full-text totals (`"remark-"` → 4,160, `"markdown-it-"` → 2,480,821) are fuzzy-match noise and must not be quoted as ecosystem size [measured].
- Adoption of *attribute-carrying* extensions is marginal: `remark-directive` / `remark-gfm` = 3,878,616 / 39,104,377 = **9.9%**; `markdown-it-attrs` / `markdown-it` = 291,408 / 30,053,020 = **0.97%** [derived].
- Taxonomy shape of unified: **syntax layer** (`micromark-extension-*`, 92) → **AST layer** (`mdast-util-*`, `hast-util-*`) → **plugin layer** (`remark-*` 535, `rehype-*` 267). A construct that needs new *syntax* costs three packages; one that only needs a *transform* costs one. Every competing engine collapses these into one layer.

### 2. Byte-accurate source positions — itemised

**Tier A — a byte range you can splice directly, no index needed**
- **pulldown-cmark** — `into_offset_iter()` yields `(Event, Range<usize>)`, byte range into the input `&str`, on **every** event including inline. This is the only engine surveyed where the position API *is* the splice API [fetched].
- **goldmark** — `text.Segment{Start, Stop}` byte offsets into the source `[]byte`, `Stop` exclusive, on block `Lines()` and inline `Text` nodes. `Padding` records synthetic indentation stripped from container children — you must add it back or splices inside blockquotes/lists drift [fetched].

**Tier B — byte columns, but you must build the line index yourself**
- **comrak** — `Sourcepos.start/end.column` counted in UTF-8 bytes by default, explicitly "matching cmark behavior"; `ö` advances the column by 2, `好` by 3. `parse.sourcepos_chars` flips to char counting — a silent, global, per-parse switch that changes the meaning of every stored anchor [fetched].
- **cmark / cmark-gfm** — `cmark_node_get_start_column` etc. are byte columns, but `CMARK_OPT_SOURCEPOS` only surfaces them on **block** elements. No inline positions at all [fetched].

**Tier C — exact but in code units, not bytes**
- **@lezer/markdown** — `from`/`to` on every node including `HeaderMark`, `EmphasisMark`, `LinkMark`, `URL`; UTF-16 code units; verified `src.slice(from,to)` reproduces the exact source text [measured].
- **unified/remark (mdast)** — `position.{start,end}.offset` in UTF-16 code units. Measured on `"# Héllo 好\n\nA *bold* 😀 word [l](u).\n"`: root end offset **36** = `src.length`, while UTF-8 length is **41**. The 5-unit gap is exactly the multibyte content [measured].

**Tier D — line granularity only**
- **markdown-it / markdown-it-py** — `Token.map = [line_begin, line_end]`, 0-based half-open. Measured: `heading_open map=[0,1]`, `inline map=[0,1]`, `heading_close map=null`, and **all 9 inline children of the paragraph had `map: null`** [measured].
- **commonmark.js** — `sourcepos` on block nodes; every inline node reported `NO-SOURCEPOS`. Columns counted in **characters**, where C cmark counts **bytes** — a direct disagreement between the reference implementation and its own JS sibling [measured].
- **kramdown** — `options[:location]`, start line only [fetched].
- **pandoc** — `sourcepos` extension, commonmark reader only, `data-pos` line:col ranges, and elements that cannot hold attributes get wrapped in a synthetic `Div`/`Span`, which changes the tree shape you are measuring [fetched].

**Tier E — nothing**
- **marked** (`raw` string only), **Python-Markdown** (ElementTree, no location at any of its 5 stages), **mistune** (token dicts), **showdown** (regex substitution) [measured/fetched].
- **markdown-rs** is unclassifiable until resolved: `Point.offset` is documented as a character index while the parser operates on `&str`. Record as **disputed**, not as Tier A [fetched].

### 3. Honest assessment of the current stack

**What is right**
- `offsets.ts` already picked the only defensible internal unit. UTF-16 code units is what CodeMirror reports, what mdast emits, and what `String.length` counts; bytes appear only at git-blob and hash edges. Branded `U16Offset`/`ByteOffset`/`GraphemeIndex` with a single `OffsetMap` conversion point is stricter than any engine in this survey ships [measured, repo].
- `@lezer/markdown` in the editor and `unified` in the preview is the correct split. Lezer is the **only** JS parser giving exact offsets on inline marks *and* incremental reparse — measured 3.58× on a 56 KB doc with a one-character insert [measured].
- Splitting `markdown-it` into two targets (`html:false` / `html:true`) is validated by measurement: the same library at its default preset scores **80.1%** and at `commonmark` preset **100.0%** on the same 652 tests. That 19.9-point gap is configuration, not conformance, and a certificate keyed on library name would have hidden it [measured].

**What is wrong, with numbers**
- **The preview pipeline is the least conformant thing in the product.** Bare remark+rehype-raw: 498/652 = 76.4%. The shipped app pipeline (`remark-gfm` + `remark-breaks`): 439/652 = **67.3%**. Isolated: `remark-gfm` costs 2 tests, **`remark-breaks` costs 57 tests = 8.7 points** [derived: 498−441]. The app is certifying seven engines against a preview that agrees with CommonMark less often than any engine it certifies.
- **remark is 15× slower than the reference implementation.** 67,200 B, 10 runs: commonmark.js 4.0 ms, marked 6.1 ms, markdown-it 5.8 ms, **remark-parse 60.2 ms**, unified full pipeline 70.6 ms. 60.2/4.0 = **15.05×**; 60.2/6.1 = **9.87×** [measured, derived]. At the 4 MB shape-gate ceiling that extrapolates to ~3.6 s per preview render [derived, linear extrapolation — unverified at that size].
- **The bench is 6/7 JavaScript.** `remark-app, react-markdown, marked, markdown-it, markdown-it-html-true, commonmark, kramdown-jekyll` [fetched targets.ts, bench.ts]. Absent: **cmark-gfm** (what GitHub blob and comments actually run), **goldmark** (Hugo), **comrak** and **pulldown-cmark** (rustdoc, mdBook, crates.io — pulldown-cmark alone is 42.6 M downloads in 90 days), **Python-Markdown / markdown-it-py** (MkDocs, Sphinx/MyST). The certificate says "7 real markdown engines"; it currently measures **4 distinct parsers** — micromark, markdown-it, marked's own, and cmark — since `remark-app` and `react-markdown` share micromark, and `commonmark` is cmark's own algorithm in JS.
- **`github-blob` is `fidelity: requires-push` and mapped to `engineId: 'remark-app'`.** The declared surfaces (Obsidian, Notion, Typora, Bear, Slack, Discord) also all point at `remark-app`. A declared row backed by a *different engine's* output is a placeholder, not a model [fetched targets.ts L92-115].

**What we would regret**
- **`@lezer/markdown` has left GitHub.** Its README now reads only: the repository has moved to `code.haverbeke.berlin` [fetched]. 147 stars, single maintainer, npm still publishing (1.7.2, 2026-07-15). It is load-bearing for the editor and has no substitute with equivalent position fidelity. Vendor the parser or budget for owning a fork.
- **`markdown-rs` has not been touched since 2025-04-23** — 16 months — and its offset unit is ambiguous. It is the obvious "Rust engine that matches our AST" and it is the wrong bet [fetched].
- **`cmark-gfm` last released 2023-07-21 with 135 open issues.** Certifying against GitHub means certifying against an unreleased-for-3-years C library. Pin the exact tag in the certificate or the row rots invisibly [fetched].
- **`goldmark` shipped v2.0.0 on 2026-08-27 and Hugo master still pins v1.8.5** [fetched]. Any Hugo row must record the *goldmark* version, not "Hugo".

### 4. What the render-profile extension API should look like

**Constraint restated as a test.** Every construct must (a) parse as valid CommonMark, (b) round-trip through byte-splice edits, (c) degrade to something a reader tolerates in the 7 bench engines. (c) is measurable, so measure it.

**Measured degradation of the four candidate syntaxes** across marked / markdown-it (default) / commonmark.js / remark+gfm [measured]:

```markdown
:::note
Body text here.
:::
```
→ all four render `<p>:::note Body text here. :::</p>` — colons **visible**, body preserved.

```markdown
::chart{src=a.csv}
```
→ all four render `<p>::chart{src=a.csv}</p>` — the whole directive is **visible noise** with no fallback content.

```markdown
# Title {#anchor .big}
```
→ all four render `<h1>Title {#anchor .big}</h1>` — braces **visible** inside the heading.

```markdown
<!--fm: profile=x-->
```
→ marked, commonmark.js, remark all emit the comment (invisible). **markdown-it at its default `html:false` escapes it to `&lt;!--fm: profile=x--&gt;` — fully visible.**

```markdown
Text[^1]

[^1]: note
```
→ without GFM footnotes, marked / markdown-it / commonmark.js all produce `<p>Text<a href="note">^1</a></p>` — a **silently wrong link**, not degraded text. This is the worst failure mode in the set and it is what a naive footnote profile would ship.

**Therefore:**

1. **Two-tier construct model, enforced at registration.**
   - *Tier 1 — content-bearing.* Must use the container form (`:::name` … `:::`) so the body survives as a paragraph. Fence markers leak; that is the accepted cost and must be stated in the certificate, not hidden.
   - *Tier 2 — metadata-only.* Must be carried in an HTML comment, and the profile must declare that markdown-it-at-default renders it visibly. No metadata construct may be Tier 1.
   - **Ban leaf directives (`::name{...}`) outright** — they degrade to pure noise with zero fallback content.

2. **Every construct declares a `fallback` string and the bench asserts it.** Registration shape:
   ```ts
   defineConstruct({
     id: 'callout',
     tier: 'content',
     open: /^:::(note|warn|tip)\s*$/,
     fallback: (raw) => raw.body,          // what a dumb renderer must still show
     degradeClass: 'marker-visible' | 'invisible' | 'corrupting',
   })
   ```
   `degradeClass: 'corrupting'` fails registration. The `[^1]`-becomes-a-link case is exactly what that gate exists to catch.

3. **Positions are the contract, not a convenience.** Every construct must return `{ open, body, close }` as three `U16Offset` ranges, never a reconstructed string. Rationale: only `@lezer/markdown` (editor) and mdast (preview) can supply inline-level ranges among our engines; `markdown-it` gives `map: null` on every inline, so any profile that needs inline positions **cannot** be validated on the `markdown-it` targets and must declare itself block-only.

4. **Do not invent attribute syntax.** `talk.commonmark.org/t/consistent-attribute-syntax/272` opened **2014-09-04**, last post **2022-07-23**, 143 posts, 47,466 views, 24 participants — **unresolved after 12 years** [fetched]. goldmark's own README still warns "This syntax may possibly change in the future" [fetched]. Adopt `micromark-extension-directive`'s existing grammar verbatim (`:name[label]{attrs}` / `::name` / `:::name`, names `[A-Za-z0-9_-]` not ending in `-`/`_`, `{#id}`→`id=`, `{.x}`→`class=`, closing fence ≥ opening colon count, unclosed container runs to end of parent) rather than defining a fifth dialect. It is the only attribute grammar with a real npm install base (3,878,616/wk) *and* a written spec.

5. **Profiles are declarative data, not code, and pin engine versions.**
   ```yaml
   profile: fm.callouts
   constructs: [callout, spoiler]
   requires: { commonmark: "0.31.2" }
   degrades:
     marked@18.0.11: marker-visible
     markdown-it@15.0.1(html:false): marker-visible
     commonmark@0.31.2: marker-visible
     kramdown@2.5.2(jekyll): unmeasured
   ```
   Version-pinning is not ceremony: `markdown-it` 15.0.0 (2026-07-30) added `reference_definition` tokens and changed linkify defaults, and `goldmark` v2.0.0 landed 2026-08-27 — a profile certified last month is certified against different software this month [fetched CHANGELOG].

6. **Add three engines to the bench before adding any construct**: `cmark-gfm` pinned at `0.29.0.gfm.13`, `goldmark` pinned at `v1.8.5` (Hugo's actual pin) *and* `v2.0.0`, and `pulldown-cmark` `0.13.4`. Reason beyond coverage: pulldown-cmark's `into_offset_iter()` byte ranges and goldmark's `text.Segment` byte offsets give an **independent oracle for the splice machinery** — a second implementation that disagrees about where a construct starts is a bug report the JS-only bench structurally cannot produce.

7. **Fix `remark-breaks` before shipping profiles.** It costs 57 of 652 spec tests. Make it a render-time preview toggle that the certificate records as a declared deviation, or drop it — a preview 8.7 points off CommonMark cannot be the reference the profile system validates against.