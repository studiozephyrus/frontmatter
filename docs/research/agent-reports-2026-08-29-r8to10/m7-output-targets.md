I mutated nothing: no repo files edited/created/committed, no git commands run — only read-only `curl`/`grep`/`node` measurements plus ephemeral Chrome profiles and one downloaded doc in `$TMPDIR`; the `~/.claude` dirt predates this subagent.

### Evidence key
`[fetched]` primary source opened via curl · `[measured]` executed on this machine 2026-08-29 · `[SS]` search summary · `[derived]` arithmetic shown · `[inference]` reasoning

### Source baseline (the thing being compiled)
- CommonMark **0.31.2 (2024-01-28)** is the current spec; prior 0.30 (2021-06-19), 0.29 (2019-04-06) `[fetched spec.commonmark.org]`
- GFM spec self-reports **Version 0.29** `[fetched github.github.com/gfm]` — five years behind CommonMark's line. Any profile targeting "degrades in a dumb renderer" is targeting 0.29-gfm in practice, not 0.31.2 `[inference]`

### HTML — the baseline target
| | |
|---|---|
| Tool | our own renderer; remark/rehype already in `node_modules` (`remark-parse`, `micromark`, `markdown-it`, `marked`, `commonmark` all present) `[measured]` |
| Represents | everything the AST has; is the substrate every other target below is derived from except Typst/LaTeX |
| Cannot | pagination, page numbers, physical measure |
| Runs | client-side and server-side |
| Licence | ours |
| Gotcha | HTML is not a target, it is the **intermediate**. Every fidelity loss downstream is introduced *after* HTML `[inference]` |

### PDF via headless Chrome — measured capability, Chrome 151.0.7922.174
Test doc: `@page{size:A5;margin:20mm; @bottom-center{content:"PG " counter(page) " / " counter(pages)} @top-left{content:string(chap)}}`, `h2{string-set:chap content()}`, `a.x::after{content:" [XREF " target-counter(attr(href), page) "]"}` `[measured]`

| Feature | Chrome 151 result |
|---|---|
| `@page` margin boxes (`@bottom-center`, `@top-right`) | **WORKS** — static strings emitted, 3 occurrences over 3 pages `[measured]` |
| `counter(page)` / `counter(pages)` | **WORKS** — `PG n / m` present in extracted text `[measured]` |
| `@page:first { … }` override | **WORKS** — `FIRSTONLY` appears exactly once `[measured]` |
| `string-set` + `string()` running headers | **FAILS** — `CSS.supports("string-set","x content()")` → `false`; chapter title absent from margin box `[measured]` |
| `target-counter(attr(href), page)` | **FAILS** — `XREF` count 0 in output; computed `::after content` is `none` `[measured]` |
| `thead { display: table-header-group }` repeat | **WORKS** — header row printed 3× across a 4-page table `[measured]` |
| `break-inside: avoid`, `break-after: column` | parse-supported `[measured]` |
| `orphans` / `widows` | parsed (computed style returns the integer) but **enforcement not reproduced**: paragraph→page assignment byte-identical at `1` vs `20` in a 6-para / 3-page doc. Per LR#68 this is *unverified*, not *proven-absent* `[measured]` |
| Font embedding | subsetted, `/FontFile2`, subset tags `AAAAAA+Georgia`, `BAAAAA+STSongti-SC-Regular` `[measured]` |
| `page.pdf({tagged:true, outline:true})` | emits `/StructTreeRoot` **and** `/Outlines` `[measured]` |
| `displayHeaderFooter` + `headerTemplate`/`footerTemplate` | works, separate mechanism from CSS; renders in an isolated document with no page CSS `[measured]` |

**Recorded disagreement.** MDN's `@page` page states only `margin`, `page-orientation`, `size` are "implemented by at least one browser" and lists `counter-reset`/`counter-increment` under properties "not supported by any user agent yet" `[fetched developer.mozilla.org]`. My measurement contradicts this for Chrome 151. Corroborating primary evidence: chromestatus feature *"Expose unprintable areas via CSS"* (`page-margin-safety`, desktop_first **milestone 150**) whose summary says authors "even want to add `@page` margin boxes (e.g. for custom headers and footers)" `[fetched chromestatus.com/api/v0]`. MDN is stale; trust the measurement.

**Second disagreement, inside one engine.** `CSS.supports("content","target-counter(attr(href url), page)")` returns **`true`** while the declaration is dropped and produces nothing `[measured]`. `CSS.supports` is not a usable capability probe for generated-content functions.

### PDF via paged.js on top of the same Chrome
- `pagedjs@0.4.3`, MIT, **1,487 stars, pushed 2026-04-23**, **189,156 npm downloads** week 2026-08-21→27 `[fetched registry.npmjs.org, api.npmjs.org, api.github.com]`
- Polyfill payload **921,161 bytes** injected via `page.addScriptTag({content})` `[measured]`
- Implements CSS Paged Media L3, GCPM, CSS Fragmentation L3 by rewriting the DOM into `.pagedjs_pages` and paginating with CSS columns `[fetched pagedjs.org/en/documentation/1-the-big-picture]`
- **Closes both Chrome gaps**, same test doc: running header `ALPHACHAP`/`BETACHAP` rendered into `@top-left` from `string(chap)`, and `target-counter` resolved to **`seeref [XREF 3]`** with `BETACHAP` genuinely on page 3 `[measured]`
- Cost: full re-layout in JS, no `@page` native fast path, must render with `margin:0` in `page.pdf()` because paged.js owns the box
- Runs client-side (polyfill) **or** server-side under our existing headless Chrome — **zero new binary** `[inference]`

### PDF via WeasyPrint — 69.0
`[fetched doc.courtbouillon.org/weasyprint/stable/api_reference.html]`, BSD-3-Clause, 9,539 stars, pushed 2026-08-25 `[fetched api.github.com]`

| Can | Cannot |
|---|---|
| "All the features" of Paged Media L3: `@page`, `:left/:right/:first/:blank`, margin boxes, page-based counters (with "known limitations #93"), `size`, `bleed`, `marks`, named pages | **Right-to-left or bi-directional text** — explicitly unsupported in the CSS 2.1 list |
| GCPM page selectors `@page:nth(2n+1)`, `@page:nth(1 of chapter)`, running elements via `element()`, **real footnotes** via `float: footnote` + `::footnote-marker`/`::footnote-call` | `element()`'s `start` parameter |
| `orphans`, `widows`, `break-before/after/inside` **for pages**, `margin-break`, `box-decoration-break` | `break-*` **for columns and regions**; multi-column spanning, constrained height, column breaks; "pagination and overflow are not seriously tested" |
| Hyphenation (`hyphens`, `hyphenate-character`), `font-variant-*`, `font-feature-settings`, `@font-face`, hb-subset subsetting | conforming font-matching algorithm (family string passed raw to Pango); `visibility: collapse` on tables; min/max height on table boxes and page-margin boxes |
| PDF bookmarks/outlines from h1–h6, attachments, PDF forms (`appearance: auto`), PDF/A and PDF/UA generation | validity of that PDF/A — docs say output "not guaranteed to be valid" |
| Grid: `fr`, line names, areas, fragmentation between rows | `inline-grid`, `grid-auto-flow: column`, subgrid, `repeat(auto-fill/auto-fit)`, auto margins |

Server-only, Python + Pango + Fontconfig. **Does not run in a Node serverless function.** `[inference]`

### PDF via Typst
- **v0.15.1, published 2026-07-17**, Apache-2.0, **55,712 stars** `[fetched api.github.com]`
- Not a markdown compiler. Bridge is `SabrinaJewson/cmarker.typ` — "Transpile CommonMark Markdown to Typst, from within Typst", **173 stars** `[fetched api.github.com/search]`
- Also reachable via pandoc's `typst` writer (listed among pandoc output formats) `[fetched pandoc MANUAL.txt]`
- Real typesetting engine: incremental compile, proper math, native footnotes/cross-refs/bibliography. Cost is a **second document language** and a second styling system with nothing to do with CSS `[inference]`
- Rust binary; server-side or WASM; no npm-native path today `[inference]`

### PDF via LaTeX (pandoc default)
- `pandoc test.txt -o test.pdf` uses LaTeX by default; alternatives `--pdf-engine`, or `-t context`, `-t html`, `-t ms` `[fetched MANUAL.txt]`
- Best-in-class hyphenation/justification/float placement; the only path with 30 years of book-production practice `[SS]`
- Costs: full TeX distribution (GB-scale), unbounded compile time, unactionable error messages for non-TeX users, CJK requires XeLaTeX/LuaLaTeX + explicit font setup `[SS]`
- **Disqualified for a Vercel serverless function** on size alone `[inference]`

### PDF via Prince
- **Prince 16.2, released January 2026** `[fetched princexml.com/download]`
- Licence: per-server **USD $3,800** one-time (5+ → $2,660/unit), **Desktop $495**, commercial site licence "start around **USD $2000 per year**", OEM case-by-case; cloud resale via DocRaptor/EuroPDF `[fetched princexml.com/purchase]`
- Reference implementation for GCPM: footnotes, cross-references with page numbers, `string-set`, generated content, PDF/A, PDF/UA. Documented CSS-support reference covers at-rules, functional expressions, media queries `[fetched princexml.com/doc]`
- **Verdict:** the fidelity ceiling and the licence floor. Only worth it if we sell a print tier recovering ≥$3.8k/server/yr `[inference]`

### Paged media: what actually works in 2026
| Capability | Chrome 151 native | paged.js 0.4.3 | WeasyPrint 69 | Prince 16.2 |
|---|---|---|---|---|
| `@page` margin boxes | yes `[measured]` | yes `[measured]` | yes `[fetched]` | yes `[fetched]` |
| `counter(page)`/`counter(pages)` | yes `[measured]` | yes `[measured]` | yes, "known limitations #93" `[fetched]` | yes `[fetched]` |
| Running header from content (`string-set`) | **no** `[measured]` | yes `[measured]` | yes (running elements) `[fetched]` | yes `[fetched]` |
| Cross-ref w/ page number (`target-counter`) | **no** `[measured]` | yes `[measured]` | yes `[fetched]` | yes `[fetched]` |
| Footnotes (`float: footnote`) | no `[inference]` | partial `[SS]` | yes `[fetched]` | yes `[fetched]` |
| `orphans`/`widows` | unverified `[measured]` | via re-layout `[SS]` | yes `[fetched]` | yes `[fetched]` |
| Repeating table header | yes `[measured]` | yes `[SS]` | yes `[fetched]` | yes `[fetched]` |

### Slides
| Tool | Repo | Licence | Source syntax | Degradation in a dumb CommonMark renderer |
|---|---|---|---|---|
| **Marp** | marp-team/marp **12,420★**, pushed 2026-07-29; `@marp-team/marp-core@4.4.0` `[fetched]` | MIT | HTML-comment directives + YAML front-matter; `---` slide break; alt-text image directives | **Clean.** `<!--\ntheme: default\npaginate: true\n-->` → passes through as an HTML comment (invisible); `---` → `<hr>`; `![bg right w:200](x.png)` → `<img alt="bg right w:200">` `[measured]` |
| **reveal.js** | 72,230★, pushed 2026-08-24 `[fetched]` | MIT | markdown inside `<section data-markdown><textarea data-template>`; external files split on `data-separator` default `^\r?\n---\r?\n$` `[fetched revealjs.com/markdown]` | markdown is **wrapped in HTML** — the `.md` file is not standalone; external mode is clean `---` splitting |
| **Slidev** | 48,318★, pushed 2026-08-25 `[fetched]` | MIT | headmatter + **per-slide front-matter between `---` fences** `[fetched docs/guide/syntax.md]` | **Corrupts.** Measured on remark-parse+GFM: `---\nlayout: center\nbackground: /bg.png\n---` renders as `<hr>` then `<h2>layout: center background: /bg.png</h2>` — the config becomes a heading `[measured]` |
| **Quarto revealjs** | quarto-cli **v1.10.18 (2026-07-24)**, 5,965★, licence `NOASSERTION` `[fetched]` | non-SPDX | pandoc-markdown + `##` slide breaks + fenced divs | pandoc-flavoured, not CommonMark; fenced divs `:::` degrade to visible `:::` junk `[inference]` |
| **Deckset** | commercial macOS/iOS app, Mac trial requires macOS Catalina 10.15+ `[fetched deckset.com]` | proprietary | plain markdown + `---` | clean, but **closed format, no CI, Mac-only** — not an export target we can drive |

**Literal Marp syntax we would emit:**
```markdown
---
marp: true
theme: default
paginate: true
---

# Title slide

---

<!-- _backgroundColor: aqua -->

## Second slide

![bg right w:200](diagram.png)
```

### Ebooks
- **pandoc EPUB** — GPL-2.0, 46,052★, pushed 2026-08-28 `[fetched]`. `--split-level=N` sets the heading level that splits chapters (default 1); "only affects the internal composition of the EPUB, not the way chapters and sections are displayed"; readers get slow with large chapter files `[fetched MANUAL.txt]`. `--epub-cover-image` (recommend <1000px), `--epub-metadata` XML of Dublin Core (`dc:rights`, `dc:language`), auto `dc:title`/`dc:creator`/`dc:date` (ISO 8601)/`dc:language`/`dc:identifier` random UUID; `--epub-title-page=true|false` `[fetched]`
- EPUB 3.3 is a **W3C Recommendation** `[fetched w3.org/TR/epub-33]`
- **Calibre** — GPL-3.0, 25,750★, pushed 2026-08-28 `[fetched]`. `ebook-convert` is a *format* converter, not a markdown compiler; correct role is post-processing (EPUB→MOBI/AZW3) and validation, not primary generation `[inference]`
- Fidelity: EPUB is reflowable HTML+CSS in a zip. Page numbers do not exist. Anything authored against `@page` is meaningless here `[inference]`

### DOCX and ODT via pandoc
- `--reference-doc=FILE` is the whole styling story: "The contents of the reference docx are ignored, but its stylesheets and document properties (including margins, page size, header, and footer) are used" — get the default with `pandoc -o custom-reference.docx --print-default-data-file reference.docx` `[fetched]`
- Custom styles supported in **docx, odt and ICML** via `custom-style` on Div/Span/Table, e.g. `[Get out]{custom-style="Emphatically"}` `[fetched]`
- Math → **OMML** in docx/pptx `[fetched]`
- **The canonical fidelity statement**, quoted: pandoc's AST is "less expressive than many of the formats it converts between, one should not expect perfect conversions… Pandoc attempts to preserve the structural elements of a document, but not formatting details such as margin size. And some document elements, such as complex tables, may not fit into pandoc's simple document model." `[fetched MANUAL.txt]`
- Requires a Haskell binary (~150 MB). Not a browser target, not a Node-native target `[inference]`

### Email — MJML and the markdown-to-email problem
- `mjml@5.4.0`, MIT, **2,023,096 downloads** week 2026-08-21→27, 18,212★, pushed 2026-08-28 `[fetched]`
- MJML is a *markup language* by Mailjet that compiles to responsive table-based HTML `[fetched README]`
- The problem, stated precisely: markdown's block vocabulary has **no table-layout equivalent** that survives Outlook's Word rendering engine; MJML expects `<mj-section>/<mj-column>/<mj-text>` structure that a linear markdown AST does not produce `[inference]`
- Concrete losses: fenced code blocks (no `<pre>` fidelity, no horizontal scroll), tables (must be re-emitted as `<mj-table>`, still break <600px), footnotes, arbitrary CSS (some clients strip `<style>`) `[SS]`
- Verdict: markdown→MJML is a *lossy re-authoring*, not a compile `[inference]`

### Social image cards
- `satori@0.33.4`, **MPL-2.0**, **3,385,147 downloads/wk**; `@vercel/og@1.0.2`, MPL-2.0 `[fetched]`
- Uses the **Yoga** flexbox engine (same as React Native): "not a complete CSS implementation"; `display` defaults to `flex`, supports only `flex|block|contents|none|-webkit-box` `[fetched README]`
- Fonts: **TTF, OTF, WOFF only — WOFF2 not supported**; font data passed as ArrayBuffer/Buffer; emoji need an explicit `graphemeImages` map `[fetched]`
- No CSS Grid; "a limited subset of HTML and CSS features" `[fetched]`
- Alternative on our stack: reuse the existing headless Chrome with `page.screenshot()` — full CSS, no font-format restriction, higher cold start `[inference]`

### Man pages
- pandoc has a `man` writer (roff man) `[fetched MANUAL.txt]`
- Representable: `.SH` sections, `.TP` definition lists, bold/italic, literal blocks. **Not representable:** images, tables beyond simple, colour, links (become literal URLs), nesting beyond two levels `[SS]`
- Only meaningful if frontmatter documents CLI tools `[inference]`

### Confluence and Notion
- **Confluence storage format** is "XHTML-based… Technically, it's XML, since the storage format doesn't fully comply with the XHTML definition… Confluence includes custom elements for macros". A Storage Format Source Editor ships from **version 10.2.3**, disabled by default `[fetched confluence.atlassian.com/doc/confluence-storage-format-790796544.html]`
- Implication: every rich element (callouts, code blocks with language, expand, TOC) is an `ac:structured-macro`, not HTML. A generic HTML export imports as flat prose `[inference]`
- **Notion** imports directly: `.txt`, **`.md`, `.markdown`**, `.docx`, `.csv`, `.html`, `.pdf`, `.zip`; multi-file import allowed for PDF/HTML/Markdown/docx/txt `[fetched notion.com/help/import-data-into-notion]`
- Implication: **Notion needs no new target from us.** Confluence does, and it is an XML dialect `[inference]`

### Static site generator as a target
- SSG consumption is "emit a directory of `.md` + YAML front-matter + assets with a config file" — no compiler, only a **convention adapter** per SSG `[inference]`
- Quarto already demonstrates the shape with dedicated `GitHub (GFM)`, `Hugo`, `Docusaurus` markdown output formats `[fetched quarto.org nav]`
- Fidelity risk is inverted: the SSG re-parses our markdown with *its* engine — exactly the MDMAX cross-engine degradation problem we already certify `[inference]`

### Print (physical)
- Needs: `bleed` + `marks: crop cross`, CMYK, PDF/X-1a or PDF/X-4, ICC profile, ≥300 dpi rasters, embedded+subset fonts
- Chrome emits **RGB only**, no bleed/marks, no PDF/X `[inference from measured output: no `/OutputIntent`, RGB colorspace]`
- WeasyPrint supports `bleed`/`marks` and PDF/A|PDF/UA generation but disclaims validity `[fetched]`
- Prince is the only realistic commercial-print path `[inference]`

---

### (1) Target matrix

| Target | Tier | Reasoning |
|---|---|---|
| **HTML (styled, standalone)** | **v1** | Already the intermediate; zero marginal cost; the artifact every share link needs `[inference]` |
| **PDF via existing Chrome + `@page` margin boxes** | **v1** | Page numbers and static running heads are *already available in the binary we ship* and we use none of them `[measured]` |
| **PDF via Chrome + paged.js** | **v1 (flagged)** | 921 KB script, MIT, no new binary, and the only thing giving running heads from content and page-numbered cross-references `[measured]` |
| **Marp slides** | **v1** | Directives are HTML comments; **measured to degrade to invisible** in a plain CommonMark renderer — the only slide format satisfying the profile constraint without inventing syntax `[measured]` |
| **Social cards** | **v1** | Reuse `page.screenshot()`; avoids satori's Yoga/WOFF2/Grid restrictions `[fetched + inference]` |
| **DOCX via pandoc** | **v2** | Highest-demand business format, but needs a Haskell binary off the serverless path; `--reference-doc` makes brand-styling tractable `[fetched]` |
| **EPUB via pandoc** | **v2** | Well-specified (EPUB 3.3 REC), `--split-level` the only real decision; small audience `[fetched]` |
| **reveal.js / Quarto revealjs** | **v2** | reveal.js needs an HTML wrapper; Quarto's licence is `NOASSERTION` and its markdown is pandoc-flavoured, not CommonMark `[fetched]` |
| **Confluence storage XML** | **v2** | Real enterprise pull, but an XML macro dialect — a writer, not an export `[fetched]` |
| **SSG bundles (Hugo/Docusaurus/GFM)** | **v2** | Cheap adapters; directly exercises MDMAX's cross-engine certification as a selling point `[inference]` |
| **ODT** | **never** | DOCX covers the demand; pandoc's own lossiness statement applies equally and the audience is a fraction `[fetched]` |
| **Slidev** | **never** | Per-slide front-matter **measurably corrupts** into `<h2>layout: center…</h2>` under plain CommonMark — a direct violation of the degradation constraint `[measured]` |
| **Deckset** | **never** | Proprietary Mac app, no headless driver, nothing to compile *to* `[fetched]` |
| **MJML / email** | **never (as a compile target)** | Requires re-authoring into `mj-section/mj-column`; a lossy transform mis-sold as an export `[inference]` |
| **Man pages** | **never** | Only relevant if we document CLIs; roff drops images, tables, links `[SS]` |
| **Prince / LaTeX / Typst / WeasyPrint** | **never (in-product)** | Each is a second layout engine with its own styling language; $3,800/server, GB-scale TeX, or a Python/Pango runtime. Reserve as an *optional external hook* `[fetched]` |
| **Notion** | **never (no work needed)** | Notion already imports `.md` and `.markdown` natively `[fetched]` |
| **PDF/X commercial print** | **never (v1–v2)** | Requires CMYK + PDF/X + ICC, which Chrome cannot emit `[inference]` |

### (2) The specific hard problems
| Problem | Status in the path we can actually ship |
|---|---|
| **Page numbers** | **Solved today, unused.** `@page { @bottom-center { content: counter(page) " / " counter(pages) } }` works in Chrome 151 `[measured]`. `displayHeaderFooter` + `<span class="pageNumber">` is a second, CSS-independent mechanism `[measured]` |
| **Running headers** | **Static: solved.** Content-derived: **requires paged.js** — `string-set` is absent from Chrome (`CSS.supports` → `false`, no output) `[measured]` |
| **Cross-references with page numbers** | **Requires paged.js.** Native Chrome silently drops `target-counter`, and `CSS.supports` lies about it `[measured]` |
| **Widows / orphans** | **Unknown in Chrome.** Parsed, not observed to repaginate; my test never produced a straddling paragraph, so it did not exercise the feature — reporting *unverified*, not *unsupported* `[measured, LR#68]`. Guaranteed in WeasyPrint/Prince `[fetched]` |
| **Table splitting across pages** | **`thead` repeat works** — header emitted 3× over a 4-page table `[measured]`. Unsolved: `break-inside: avoid` on `<tr>`, column-width stability across the break, a "continued" caption |
| **Font embedding** | **Works locally**: subset `/FontFile2`, tags `AAAAAA+Georgia` `[measured]`. **Breaks in production**: `@sparticuz/chromium` README — "The AWS Lambda runtime is not provisioned with any font faces… this package ships with Open Sans, which supports: Latin, Greek, Cyrillic" `[fetched]`. Fonts must arrive via `/var/task/.fonts`, `/opt/fonts`, `/tmp/fonts` per its `fonts.conf` `[fetched]` |
| **CJK line breaking** | Chrome 151: `line-break` ∈ {auto, strict, loose, normal} all produced identical box height (132.0 px) on a Japanese sample; only `anywhere` changed it (106.0 px) `[measured]`. `word-break: auto-phrase` ✅, `text-spacing-trim` ✅, **`hanging-punctuation` ❌** `[measured]`. Locally CJK fell back to `STSongti-SC-Regular`, a **macOS system font** `[measured]` — on Lambda that font does not exist and the same document renders as tofu `[derived: Open-Sans-only runtime ∧ no CJK coverage ⇒ .notdef]`. WeasyPrint additionally cannot do **RTL/bidi at all** `[fetched]` |

### (3) Our existing PDF path — honest limits
Repo state `[measured]`:
- `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/app/api/export/pdf/[...path]/route.ts` calls exactly `page.pdf({ format: "A4", printBackground: true, margin: {…} })` — **no `displayHeaderFooter`, no `tagged`, no `outline`**
- `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/modules/export/presentation/print-css.ts` is **156 lines** whose only paged rule is `@page { margin: ${PRINT_PAGE_MARGIN} }`. Zero occurrences of `break-inside`, `orphans`, `widows`, `counter`, `running`, `table-header-group`
- Zero occurrences of `pagedjs`, `@bottom-center`, `counter(page)`, `headerTemplate` anywhere in `src/`, `docs/`, `test/`
- Deps: `puppeteer-core ^25.0.4` (installed 25.0.4; latest **25.9.0**, Apache-2.0, **20,899,318 dl/wk**), `@sparticuz/chromium ^148.0.0` (v148.0.0 released **2026-04-27**; latest **149.0.0**, 2026-05-27, MIT, **1,903,805 dl/wk**) `[fetched]`

| Can do today, for free | Cannot do, honestly |
|---|---|
| Page numbers, page counts, `@page:first`, static running heads via margin boxes `[measured]` | Chapter-name running heads (`string-set` absent) `[measured]` |
| Repeating table headers `[measured]` | Page-numbered cross-references (`target-counter` dropped) `[measured]` |
| Tagged PDF `/StructTreeRoot` + `/Outlines` bookmarks — one flag away from a11y-usable output `[measured]` | Footnotes at page bottom; PDF/A or PDF/UA declaration |
| Font subsetting and embedding `[measured]` | Any non-Latin/Greek/Cyrillic script in production without a font layer `[fetched sparticuz README]` |
| Full modern CSS (Grid, flex, custom properties, `text-spacing-trim`) — the thing WeasyPrint and Prince each partially lack `[measured + fetched]` | CMYK, bleed, crop marks, ICC — no commercial print `[inference]` |

Three shipped fragilities `[measured, route.ts]`:
1. `waitUntil: "load"` then a **fixed `setTimeout(2000)`** for the mermaid CDN — a wall-clock race, not a readiness signal
2. `document.fonts.ready` depends on **Google Sans downloading from the network inside the lambda**; blocked egress or cold DNS silently changes the typeface
3. `maxDuration = 60`; local dev never exercises the Linux binary (`process.platform === "linux"` gate falls back to `channel: "chrome"`), so **the production renderer is never the one developers see** — different font set, different failure mode

### (4) Differentiator vs table stakes
| | Targets | Why |
|---|---|---|
| **Table stakes** | HTML, PDF (any quality), DOCX, EPUB, Notion (already free) | Every editor from Typora to Obsidian to Bear ships these; absence is a bug, presence wins nothing `[inference]` |
| **Weak differentiator** | Marp slides, SSG bundles, social cards | Marp/Slidev/Quarto exist standalone; the value is only *integration*, and it decays as competitors add it `[inference]` |
| **Genuine differentiator** | **(a)** PDF with real page numbers, running heads and page-numbered cross-references from *plain CommonMark* with no LaTeX, no $3,800 licence, no Python runtime — measured achievable with paged.js on the binary we already ship `[measured]`. **(b)** A **per-target degradation certificate**: MDMAX already certifies across 7 engines; extending the same instrument to *output targets* — "this footnote survives HTML and PDF, degrades to a bracketed link in DOCX, is dropped in EPUB" — is a claim no competitor makes `[inference]`. **(c)** Byte-preserving splice means an export never rewrites the source, so a round-trip through DOCX/Confluence can be *diffed* rather than trusted `[inference]` |
| **Trap** | Prince, LaTeX, Typst, WeasyPrint, MJML | Each buys fidelity by adding a second layout engine with its own styling language, contradicting "a profile over valid CommonMark that degrades in a dumb renderer" — extension authors would have to reason about CSS *and* Typst *and* TeX `[inference]` |

**One-line judgment against the settled constraint:** the target set should be exactly those whose *authoring syntax is already valid CommonMark* (Marp comments ✅; MyST `[Sec. %s](#target)` ✅ with visible `%s` junk; MyST `(my-section)=` ❌ visible junk; Slidev per-slide front-matter ❌ measured corruption) — and the *rendering* fidelity should be bought entirely inside the browser we already ship `[measured + inference]`.