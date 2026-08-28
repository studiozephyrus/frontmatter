I mutated nothing: this task was read-only (curl fetches, registry reads, in-memory `node`/`ruby` renders); I created, edited, committed and pushed no files, in this repo or in `~/.claude` / `~/.sgnk` — the dirty state there predates me.

### 1 — Spec inventory (versions, dates, governance, implementers, adoption)

| Spec | Current version | Dated | Governance | Reference impls | Adoption evidence |
|---|---|---|---|---|---|
| **CommonMark** | **0.31.2** — never reached 1.0 in 12 y [fetched spec.commonmark.org, 2026-08-28] | **2024-01-28** [fetched] | 3 named stewards: John MacFarlane, Martin Woodward (GitHub), Jeff Atwood [fetched commonmark.org] | `cmark` (C, 2,025★), `commonmark.js` (1,568★) [fetched api.github.com 2026-08-28T20:26Z] | `commonmark` npm 801,083 dl/wk; spec repo 5,137★ [measured 2026-08-28] |
| **GFM** | **0.29-gfm**, the *only* version string in the doc [measured: 1 occurrence in 507,700 B] | **2019-04-06** — 88 months stale [fetched github.github.com/gfm] | GitHub, unilateral, no public process | `cmark-gfm` (1,125★, pushed 2026-07-13) [fetched] | `remark-gfm` 39,104,377 dl/wk = 76.8% of `remark-parse`'s 50,948,894 [derived] |
| **Djot** | **0.2 (2022-12-05)** is the last *released* changelog heading; everything since sits under `## [Unreleased]` [fetched raw.githubusercontent.com/jgm/djot/main/changelog.md] | 2022-12-05 | jgm, personal repo | `djot.js` (206★), `djot.lua` (80★), `jotdown` Rust (229★) [fetched] | **`@djot/djot` 1,332 dl/wk** [measured] |
| **MyST** | `myst-spec` **0.0.5**; `mystmd` CLI **1.10.1**; `myst-parser` (py) **5.1.0** [measured registry.npmjs.org + pypi.org] | pypi upload 2026-05-13 | Jupyter Book / ExecutableBooks | `mystmd` (519★, 837 open issues), `MyST-Parser` (885★) [fetched] | `mystmd` 3,730 dl/wk; `myst-parser` 10,949 dl/wk [measured] |
| **Pandoc Markdown** | **pandoc 3.10.2** [fetched pandoc.org/releases.html] | **2026-08-11** | jgm, BDFL | pandoc (46,052★) [fetched] | **82 named extensions** in MANUAL.html [measured: `id="extension-…"` anchors] |
| **MDX** | **@mdx-js/mdx 3.1.1** [measured npm] | repo pushed 2026-08-25 [fetched] | mdx-js org (19,758★, 20 open issues) | `@mdx-js/mdx` | **10,714,884 dl/wk** [measured] |
| **Quarto** | **1.10** current, **1.11** pre-release, 1.9.38 dated May 25 2026 [fetched quarto.org/docs/download] | 2026 | Posit PBC | `quarto-cli` (5,965★, 1,888 open issues) [fetched] | Pandoc-hosted: "pandoc" appears 19× on its own markdown-basics page [measured] |
| **AsciiDoc** | Language spec **State: Incubating** at Eclipse [fetched projects.eclipse.org/projects/technology.asciidoc] | — | Eclipse Foundation WG (only formal SDO here) | Asciidoctor **4.0.11** (5,209★) [measured npm] | `asciidoctor` npm 34,064 + `@asciidoctor/core` 120,968 dl/wk [measured] |
| **reStructuredText** | Docutils **0.23**; spec Revision **10391** [fetched docutils.sourceforge.io] | spec dated **2026-07-22**; docutils uploaded 2026-05-27 [measured pypi] | Docutils project, public domain | docutils | Sphinx substrate; no npm lane |

### 2 — CommonMark core vs GFM: the itemised delta

- **The core is byte-for-byte the 2019 core.** GFM = **677** conformance examples; **28** live under headings marked `(extension)`; **677 − 28 = 649** [derived], and CommonMark **0.29** has exactly **649** [measured `spec.json`]. Per-section comparison of all 26 core sections: **zero mismatches** [measured]. GFM did not modify one core rule; it appended five extension sections.
- **CommonMark moved on without GFM.** 0.29 → 0.31.2 = **+3 examples** net: Emphasis +1, HTML blocks +1, Links +3, Link reference definitions −1, Raw HTML −1 [measured]. GFM tracks none of it.

The five extensions, exact syntax and spec section:

**§4.10 Tables** (8 examples) [fetched]
```
| foo | bar |
| --- | --- |
| baz | bim |
```
Delimiter cells are hyphens plus optional leading/trailing `:` for alignment. **Block-level elements cannot be inserted in a table.** Requires `\|` escaping *inside code spans* — an explicit exception to §6.1 that GFM never wrote back into its own backslash-escape section [fetched; jgm names this defect himself, below].

**§5.3 Task list items** (2 examples) [fetched]
```
- [ ] foo
- [x] bar
```
Renders `<input disabled="" type="checkbox">`. Spec explicitly declines to define interaction.

**§6.5 Strikethrough** (3 examples) [fetched]
```
~~Hi~~ Hello, ~there~ world!
```
One *or two* tildes; three or more do not strike.

**§6.9 Autolinks (extension)** (14 examples) [fetched] — `www.` prefix, bare `http://`/`https://`/`mailto:`, recognised only at line start, after whitespace, or after `*`, `_`, `~`, `(`.

**§6.11 Disallowed raw HTML** (1 example) [fetched] — filters exactly nine tags by rewriting `<` to `&lt;`: `<title> <textarea> <style> <xmp> <iframe> <noembed> <noframes> <script> <plaintext>`.

**Rendered on github.com but absent from the GFM spec entirely** [fetched docs.github.com basic-writing-and-formatting-syntax, 2026-08-28] — footnotes `[^1]`; alerts (blockquote-based, five kinds); mermaid; `$`/`$$` math; `:emoji:`; `@mentions`; `#issue` refs; custom heading anchors; colour-model chips; `<details>`; picture element. GitHub's own docs call alerts "a Markdown extension based on the blockquote syntax":
```
> [!NOTE]
> Useful information that users should know, even when skimming content.
> [!TIP]
> [!IMPORTANT]
> [!WARNING]
> [!CAUTION]
```
- **The delta that matters most: the GFM spec is not what GitHub runs.** Everything in the paragraph above ships in production and is unspecified. Anyone "targeting GFM" is targeting a 2019 document that describes a subset of the renderer.

### 3 — What CommonMark has explicitly declined to standardise, and why

- **The spec contains no extension mechanism at all.** The word "extension" occurs **once** in the entire 0.31.2 body, and it refers to the side-by-side test syntax of `spec.txt` itself [measured]. There is no §"Extensions", no conformance level, no profile hook.
- **Tables — declined 2014, still declined.** jgm, topic 81 post #4, 2014-09-03: *"This is meant to be a specification of core markdown features. Extensions, including tables, can come later, but let's get the core settled first!"* [fetched]. Post #12: *"Tables and footnotes are not among them"* [fetched]. That topic: **190 posts, 299,304 views, last post 2023-12-04** [measured]. Twelve years, no core table.
- **The stated technical reason is a layering violation, not taste.** jgm, topic 3706 #3, 2020-11-26 [fetched]: block structure is discerned before inline structure, so `|` inside a code span cannot be distinguished from a cell separator without inline parsing; GFM's fix — requiring `\|` inside backticks — "implies an exception to the core spec (and gfm's own spec does not update the section on backslash escapes or inline code to reflect that)." Adopting tables means either accepting that exception or making `|` a context-sensitive inline "cell separator", which "would require making tables a part of the core spec."
- **Footnotes** — named alongside tables as out-of-core in 2014 [fetched]; no core proposal since. GitHub shipped them anyway (forum topic 3983, 2021-09-30, "Footnotes now supported by GitHub's web interface") [fetched].
- **Attributes** — topic 272 "Consistent attribute syntax": **143 posts, 47,466 views, opened 2014-09-04, last post 2022-07-23**, unresolved [measured]. jgm's attribute design left CommonMark and became djot.
- **Definition lists** — topic 289 "Description List", 45 posts, open since 2014-09-04 [measured]. Not in core.
- **Spoilers / callouts** — topic 767, 88 posts, open since 2014-10-06 [measured]. Catija, topic 3773 (2021-02-04): platforms diverged in the meantime, so "if CM chooses a standard, those variants will have to adjust" [fetched]. Atwood, 2021-03-03: *"tables is next on our agenda"* [fetched] — five years later, still not in the spec.
- **Front matter** — never specified; the forum's own 2026-05-22 proposal to declare flavours in front matter (topic 9064) was answered by Crissov: *"the very existence of such headers constitutes an extension to Commonmark"* [fetched]. RFC 7763/7764 register `text/markdown` with a `variant` parameter; nobody carries it in-file [fetched via that thread].
- **Encoding and bytes are explicitly out of scope.** §2.1: *"This spec does not specify an encoding; it thinks of lines as composed of characters rather than bytes."* [fetched spec.txt 0.31.2].
- **Current activity is editorial, not featural.** Master `spec.txt` vs released 0.31.2: **+84 / −21 lines, +3 examples (652 → 655)**, version field still `'0.31.2'`, date still `'2024-01-28'` [measured]. Content of the diff: `may not` → `must not`/`cannot`, "pointy brackets" → "angle brackets", one typo (`puncuation`), and three new conformance cases — `<div\n> not quoted text`, `<del\nclass="foo">`, and a non-BMP punctuation emphasis case `*𞋿*delta.` [measured]. **No new features are queued.**

### 4 — Djot: does it matter? (honest, with evidence)

**Yes, technically.** jgm's own diagnosis of CommonMark is unusually damning and it is on the record: *"There are 17 principles governing emphasis… I despair, at times, of getting to a spec that is worth calling 1.0"* (topic 2787, 2018-04-17) [fetched]. Djot's stated goals — linear-time no-backtracking parse; **local** inline parsing (CommonMark's `[foo][bar]` meaning depends on definitions that may appear *later*, which "makes accurate syntax highlighting nearly impossible"); no expressive blind spots; no magic indentation thresholds [fetched README]. Every one of those is a real, live constraint for a live-preview editor.

**No, in the market. The numbers are not close.**

| Metric | Djot | Comparator | Ratio |
|---|---|---|---|
| npm dl/wk (2026-08-21→27) | `@djot/djot` **1,332** | `remark-parse` **50,948,894** | **38,250×** [derived] |
| npm dl/wk | **1,332** | `marked` **71,970,387** | **54,032×** [derived] |
| Share of 4-way JS parser total | 1,332 / 152,973,633 | — | **0.00087%** [derived] |
| Released version | **0.2, 2022-12-05** (3 y 9 mo ago) | pandoc 3.10.2, 2026-08-11 | — |
| Stars | 2,033 (spec), 206 (djot.js) | markdown-it 21,857 | — |
| Site's own claim | *"Djot isn't completely stable yet, minor future changes to the syntax are expected"* [fetched djot.net] | — | — |

- **It is not abandoned** — `djot.js` last commit 2026-08-19 (`Close fenced div on CRLF input (#149)`), spec repo 2026-07-01, 118 open issues [measured]. But the spec repo's own changelog says *"Note that current development is focused on djot.js"* and *"Move all the Lua code to new djot.lua repository"* [fetched] — consolidation, not expansion.
- **It has no MIME type** (`text/x-djot` "may be used", unofficial) [fetched README §MIME type].
- **Verdict for frontmatter: djot matters as a design source, not as a target.** Adopting it would violate the settled constraint (it *is* a new format, by its author's own framing — "an entirely new project under a new name" [fetched, topic 2787 #1]). Steal from it instead: (a) local inline resolution — never let a splice's meaning depend on a definition later in the file; (b) no indentation thresholds; (c) `{...}` attributes as the extension carrier. Note the trap: djot's attribute syntax `{.class}` **does not exist in CommonMark**, so borrowing the *syntax* breaks degradation even though borrowing the *principle* does not.

### 5 — Strategic read for a product that must degrade to CommonMark

**Measured degradation, unanimous across 4 installed engines** (`marked@16.4.2`, `markdown-it@15.0.0`, `commonmark@0.31.2`, `remark-parse@11` core; [measured 2026-08-28T20:34Z]):

| Extension source | CommonMark-only output | Class |
|---|---|---|
| `Text[^1]` + `[^1]: note` | `<p>Text<a href="note">^1</a></p>` | **SILENT MISRENDER** — the footnote label is a valid link label, the definition is a valid link reference definition. Text becomes a hyperlink to `note`. |
| `---`/`title: T`/`---` | `<hr> <h2>title: T</h2> <p>Body</p>` | **SILENT MISRENDER** — front matter is a thematic break plus a setext H2. |
| `> [!NOTE]` | `<blockquote><p>[!NOTE] body</p></blockquote>` | **GRACEFUL** — readable, marker visible |
| `term` / `: def` | `<p>term : def</p>` | **GRACEFUL** |
| ` ```{note} ` | `<pre><code class="language-{note}">body</code></pre>` | **SEMI** — body preserved, becomes code |
| `::: warning` / `::: {.callout-note}` | literal `:::` lines in a paragraph | **LEAK, readable** |
| `$$x^2$$`, `[[Page]]` | literal | **LEAK, readable** |
| `~~gone~~` | `<del>` (marked) / `<s>` (markdown-it) / literal `~~gone~~` (commonmark.js, remark) | **DISAGREEMENT — 3 outcomes** |

- **The real floor is not GFM and not CommonMark-the-spec. It is `commonmark.js`/remark-core behaviour on a *reference-definition-hostile* document.** The two catastrophic cases above are both cases where a marker is *already valid CommonMark meaning something else*. Any profile must be screened against that specific hazard class, not against "does it render".
- **Rule that falls out directly: never carry a profile marker inside `[` … `]` at line start, and never carry one as `---`.** `[^…]`, `[[…]]`, `[!…]`, `---` are all pre-taken. Markers that survive: leading `>` blockquote (alerts prove it), fenced info strings, `:::` runs, and `:` continuation lines — each degrades to visible-but-readable text in all four engines [measured].
- **The 7-engine bench is a JS/Ruby-lane bench, and its coverage claim should say so.** `bench.ts` fixes: `remark-app, react-markdown, marked, markdown-it, markdown-it-html-true, commonmark, kramdown-jekyll` [measured `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/modules/mdmax/infrastructure/bench.ts:46-52`]. Five of seven are `remark`/`markdown-it`/`marked`/`commonmark.js`; the seventh is kramdown 2.5.2 + kramdown-parser-gfm 1.1.0 [measured via `ruby`]. **Absent: `cmark-gfm` — the engine github.com actually runs** — plus goldmark (Hugo), comrak, pulldown-cmark (mdBook/docs.rs), MD4C, and Pandoc. `remark-app` and `react-markdown` share a parser, so the seven engines represent **four** distinct parser families, not seven [inference from that file's own comment that they are "two pipelines built on the same parser"].
- **Highest-value additions, ranked by what they'd newly catch:** (1) `cmark-gfm` — closes the "certified for GitHub" gap that currently rests on a 2019 spec; (2) `pandoc` — substrate under Quarto and the only engine with 82 declared extensions, so it is where a profile marker is most likely to be *claimed* by something else; (3) `goldmark` — the Hugo/static-site lane. `commonmark.js` is already the strictest floor and needs no companion.
- **Version drift is live in this repo:** installed `marked@16.4.2` vs npm latest `18.0.11`; `markdown-it@15.0.0` vs `15.0.1` [measured 2026-08-28]. A certificate stamped on 16.4.2 does not describe what a 2026 consumer runs; the `benchId` sha256-over-options design already anticipates this — the gap is refresh cadence, not mechanism.
- **Target GFM-the-renderer, certify against CommonMark-the-spec, and say which of the two each claim refers to.** They are 88 months and 28 examples apart, and the renderer is the larger of the two.

### Disagreements recorded, not resolved

- **`~~x~~`:** GFM §6.5 mandates `<del>`; `marked` emits `<del>`, `markdown-it` emits `<s>` [measured]. Both are shipped defaults.
- **Tables as block vs inline:** jgm holds tables are "conceptually block structure"; cben (topic 3706) argues cell separators "behave more like inline marks". jgm concedes the inline treatment is "certainly an approach worth considering" but that it forces tables into *core* [fetched]. Unresolved after 6 years.
- **Flavour declaration:** murz proposes `flavors:` in front matter; Crissov counters that front matter is itself a non-CommonMark extension and therefore "the wrong place in the stack" [fetched, 2026-05-22]. Unresolved.
- **Djot's scope:** yne (topic 4229 #18) argues first-class LaTeX math and a ~2,000-line emoji table make every conforming renderer heavy; jgm replies math can pass through verbatim and the emoji requirement is deliberately vague [fetched]. Unresolved; relevant to any profile that inherits either.

### Method and limits

- Every row tagged `[fetched]` came from `curl` against the primary host (`spec.commonmark.org`, `github.github.com`, `raw.githubusercontent.com`, `talk.commonmark.org`, `docs.github.com`, `pandoc.org`, `mystmd.org`, `quarto.org`, `mdxjs.com`, `djot.net`, `docutils.sourceforge.io`, `projects.eclipse.org`), 2026-08-28 20:26–20:34 UTC. WebFetch is gated here; `curl` is not — tested first (LR#70).
- `[measured]` = executed locally: `spec.json` parsing, `spec.txt` diffing, npm/PyPI registry reads, `node --input-type=module` renders against this repo's installed engines, `ruby -e` for kramdown. No files written, no repo state touched.
- `api.github.com` hit its unauthenticated 60-req/h limit mid-run; star/push figures for jgm/djot, cmark, cmark-gfm, pandoc, mystmd, MyST-Parser, mdx, quarto-cli, asciidoctor, markdown-it, remark, micromark, commonmark-spec, commonmark.js, jotdown, djot.js, djot.lua **were** captured before the limit at 2026-08-28T20:26Z; `releases/latest` for pandoc/quarto/mdx/myst/asciidoctor was **not** — those versions come from pandoc.org, quarto.org and the npm/PyPI registries instead.
- Not verified: GitLab GLFM (host not probed), Babelmark 3's current implementation count (commonmark.org says "20+" [fetched]; I did not run it), and whether `cmark-gfm`'s shipped behaviour matches the 0.29-gfm document (I read the spec, not the binary).