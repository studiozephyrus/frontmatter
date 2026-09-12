I mutated nothing: no repo file created, edited, staged, or committed, and no `~/.claude` or `~/.sgnk` write — the only writes this session were two ephemeral `curl` caches under `$TMPDIR`; the dirty AIOS CODE state predates me.

### Provenance and method
- Sources opened with `curl` (WebFetch blocked; `curl` unblocked — LR#70 confirmed again). Every `[fetched]` line comes from a document I retrieved this session on 2026-08-29.
- `[measured]` = executed here against this repo's installed engines: `marked@16.4.2`, `markdown-it@15.0.0`, `katex@0.17.0`, `minisearch@7.2.0`, Node `v24.6.0`.
- MDMAX's seven pinned engines, read from `src/modules/mdmax/infrastructure/bench.ts:45`: `remark-app`, `react-markdown`, `marked`, `markdown-it`, `markdown-it-html-true`, `commonmark`, `kramdown-jekyll` `[measured]`.

### Spec baselines, with dates
| Spec | Version | Date | Consequence |
|---|---|---|---|
| CommonMark | 0.31.2 | 2024-01-28 `[fetched]` | The only stable floor. No tables, footnotes, math, attrs, figures. |
| GFM | 0.29-gfm | 2019-04-06 `[fetched]` | 7y 4m stale (2026−2019 = 7y; Apr 6 → Aug 29 = 4m 23d) `[derived]`. Tables + tagfilter are in it; **footnotes are not**. |
| UAX #14 (line breaking) | Revision 55 | 2025-09-05 `[fetched]` | CJK/Brahmic break rules. |
| UAX #29 (segmentation) | Revision 47 | 2025-08-17 `[fetched]` | Word/grapheme boundaries. |
| CSS Text 3 | CR Draft | 2026-08-14 `[fetched]` | Soft-break → space is **UA-defined**. |
| WCAG | 2.2 | current `[fetched]` | Conformance obligations below. |

- GFM footnotes: `grep -ci footnote` on `github/cmark-gfm/test/spec.txt` = **1** (an intro-prose mention only); the syntax lives in `test/extensions.txt:702` `[measured]`. Footnotes are shipped, tested, and **unspecified**.

### 1. The hard-edge table

| Problem | Why markdown fails | Workaround | Cost |
|---|---|---|---|
| Nested content in table cells | GFM spec, verbatim: "Block-level elements cannot be inserted in a table." `[fetched]` | Pandoc `grid_tables` (cells "may contain arbitrary block elements") `[fetched]`, or raw HTML | Grid tables are not CommonMark: a dumb renderer emits `<p>+------+------+…</p>` — a wall of pipes `[measured]` |
| colspan / rowspan | No syntax in CommonMark or GFM | `grid_tables` only ("Cells can span multiple columns or rows"); `multiline_tables` explicitly do **not** support spans `[fetched]`; `markdown-it-multimd-table` (170,927 downloads 2026-07-29→08-28) `[measured]` | HTML fallback splits the bench: `marked` passes `<table><tr><td colspan=2>` through; `markdown-it` (html:false default) **escapes it into visible `&lt;table&gt;` text** `[measured]` |
| Table captions | No syntax | Pandoc `table_captions`: a paragraph beginning `Table:` / `table:` / `:` `[fetched]` | In a dumb renderer *after* the table it degrades **readably** (`<p>Table: My caption.</p>`); placed on the line *immediately* after, it is silently absorbed as a **data row** `<td>Table: my caption</td>` `[measured]` |
| Long cells / reflow | No wrapping control; one cell measured at 452 chars vs a 10-char sibling `[measured]` | `overflow-x` container | Violates WCAG 1.4.10 Reflow unless scrolled in one axis only `[fetched]` |
| Alignment in CJK | Source columns align by *character count*, display by *East Asian Width*: `中文标题` = 4 chars, 8 display columns `[derived]` | Width-aware formatter (UAX #11) | Every naive prettifier misaligns CJK tables |
| Pipes in cells | Splitting happens **before** inline parsing: `` `x|y` `` becomes two cells in both `marked` and `markdown-it` `[measured]`. GFM requires `\|` even inside code spans `[fetched]` | `\|` | Breaks byte-preservation: source `x\|y` renders `x|y`; a naive splice round-trip is lossy |
| Ragged rows | Silently padded/truncated to the header count in both engines `[measured]` | none | Data loss with no warning |
| Multi-column layout, floats, sidebars, pull quotes | No block-container syntax at all | Fenced divs (`:::`), HTML | `:::{note}` degrades to a literal `<p>:::{note}…:::</p>` `[measured]` |
| Figures + captions | `![alt](src)` carries alt and title only — MyST says exactly this `[fetched]` | MyST/Sphinx `{figure}` directive; Pandoc `figure_captions` | ```` ```{figure} ```` degrades to a **code block** whose body shows `:name:` / `:alt:` as literal text `[measured]` |
| Cross-references | No identifier/numbering model | Quarto `@fig-x` + `{#fig-x}`; MyST `:label:` | `{#fig-plot}` **leaks as visible text** after the image `[measured]` |
| Heading anchors | `marked` emits no `id=` by default `[measured]` | `github-slugger` (in deps) | Slug algorithms differ per engine → cross-engine link rot |
| Footnotes | Not in the GFM spec `[measured]` | `markdown-it-footnote` (2,285,935/30d) | Neither `marked` nor `markdown-it` renders `[^a]` by default — both emit literal `[^a]` and a stray paragraph `[^a]: Note text.` `[measured]`. Body survives; the link does not |
| Definition lists | Not in CommonMark | Pandoc `definition_lists` | `Term\n:   Definition` degrades to one readable paragraph `[measured]` — cheap and safe |
| Attributes on elements | Not in CommonMark | `{#id .class}` (kramdown/Pandoc) | Leaks: `<h1>Heading {#custom-id .cls}</h1>` `[measured]` |
| Reference-link non-locality | jgm (CommonMark's own author): `[foo][bar]` has four possible meanings "depending on whether the references … are defined elsewhere (perhaps later)" `[fetched]`; confirmed — same source renders as text, or `/x`, or `/y` `[measured]` | none | "Accurate syntax highlighting nearly impossible" `[fetched]` — a direct hit on a splice-editor's incremental model |
| Setext vs thematic break | CommonMark records **four** competing readings of `Foo\nbar\n---\nbaz` and picks #4 `[fetched]` | blank lines, or `* * *` | `- foo\n-----` is a list then `<hr>`; `* Foo\n* * *` breaks the list `[fetched]`+`[measured]` |
| Whitespace cliff | Nesting depends on the *content column*: indent 1 = sibling; 2–5 = nested; **6 = the bullet stops being a bullet** and becomes prose `[measured]` | lint | One space changes document structure invisibly |
| Tabs | "Tabs in lines are not expanded to spaces… tabs behave as if they were replaced by spaces with a tab stop of 4" `[fetched]` | normalize | A tab and 4 spaces are equivalent for structure but not for bytes |

### 2. Degradation matrix — measured against the CommonMark-only constraint
Verdicts from rendering each construct through `marked` with no extensions `[measured]`:

| Construct | Dumb-renderer output | Verdict |
|---|---|---|
| `Table: caption` after a blank line | `<p>Table: My caption.</p>` | **PASS** |
| `Term` / `:   Definition` | one paragraph, both parts legible | **PASS** |
| `$E=mc^2$`, `$$…$$` | TeX source visible verbatim | **PASS** (readable, not typeset) |
| `[^1]` + `[^1]: body` | `[^1]` marker leaks; body survives as a paragraph | **MARGINAL** |
| `:::{note}` … `:::` | `<p>:::{note}↵body↵:::</p>` | **MARGINAL** |
| ```` ```{figure} ```` | `<pre><code class="language-{figure}">` with `:alt:` as literal text | **MARGINAL** |
| `@fig-plot` + `{#fig-plot}` | ref unresolvable, `{#fig-plot}` visible | **FAIL** |
| `# H {#id .cls}` | brace syntax inside the heading text | **FAIL** |
| Pandoc grid table | `<p>+------+------+ \| Fruit\| Note \|…</p>` | **FAIL** |

- Rule this yields: **any profile whose sigil sits on its own line degrades to noise you can skim past; any profile whose sigil sits inline inside prose degrades to noise you cannot.** Prefer block-level, trailing, colon-prefixed forms.

### 3. Accessibility obligations for a product that publishes rendered markdown
Normative text `[fetched]` from WCAG 2.2, mapped to what markdown actually emits `[measured]`:

| SC | Normative requirement (quoted) | Markdown reality | Obligation |
|---|---|---|---|
| 1.1.1 Non-text Content (A) | "All non-text content that is presented to the user has a text alternative that serves the equivalent purpose" | This repo: **11 of 14** images have empty alt = **78.6%** `[measured]` | Author-time lint; refuse-to-publish or explicit `![](x)` decorative opt-in |
| 1.3.1 Info and Relationships (A) | structure must be programmatically determinable | GFM tables emit **no `<caption>`, no `scope=`, no `<colgroup>`** `[measured]` | Emit `scope="col"`/`scope="row"`; W3C: multi-level headers need `id`/`headers` `[fetched]` |
| 1.3.2 Meaningful Sequence (A) | "a correct reading sequence can be programmatically determined" | Source order = DOM order; fine — until CSS columns/floats are faked | Do not reorder visually |
| 1.4.10 Reflow (AA) | no scrolling in two dimensions at 320 CSS px `[fetched]` | Wide tables scroll in both axes | Single-axis `overflow-x` container with a focusable region |
| 2.4.6 Headings and Labels (AA) | "Headings and labels describe topic or purpose" | This repo: **35 heading-level skips**, **5 of 186** files with >1 `<h1>` `[measured]` | Hierarchy lint at save, not at publish |
| 3.1.1 Language of Page (A) / 3.1.2 Language of Parts (AA) | language "can be programmatically determined" | `marked` emits **no `lang=` and no `dir=` for any input** `[measured]` | Front-matter `lang:`; per-span `lang` for quoted passages |
| 4.1.2 Name, Role, Value (A) | — | GFM task lists emit `<input disabled type="checkbox">` with **no accessible name** `[measured]` | Wrap in a `<label>` or add `aria-label` from item text |
| 5.2 Conformance | "For Level AA conformance, the web page satisfies all the Level A and Level AA success criteria" `[fetched]` | — | AA is all-or-nothing; a single unlabelled image fails the page |

- Published-literature check: Crossref (`query.bibliographic=markdown accessibility screen reader`, 8 rows) and the arXiv API returned **no study of markdown-rendered accessibility specifically** — nearest hits are PDF→markdown conversion and one math-a11y tooling paper (`arXiv:2603.28494v3`) `[measured]`. Treat "markdown a11y is well-studied" as **false**; there is no citable baseline, so ship your own numbers.

### 4. Math accessibility
- `katex@0.17.0` `renderToString("E=mc^2")` emits MathML with `<semantics>`, `<annotation encoding="application/x-tex">E=mc^2</annotation>`, and `aria-` attributes `[measured]`. The TeX source survives into the a11y tree — good.
- The `$…$` delimiter is not CommonMark; degradation is legible TeX `[measured]`, which is the honest ceiling: **a screen reader gets an equation only if MathML is emitted**; a dumb renderer gets `E=mc^2` read as characters.
- Do not ship image-rendered math. That is 1.1.1 with a text alternative you cannot generate.

### 5. i18n work MDMAX specifically needs

**5a. Word counting — `countWords` at `src/modules/editor/presentation/EditorPane.tsx:31`**
```ts
function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\s+/).length;
}
```
Measured against `Intl.Segmenter(loc, {granularity:"word"})` `[measured]`:

| Locale | `countWords` | Segmenter | Undercount |
|---|---|---|---|
| zh-Hans prose | 1 | 20 | **20.00×** |
| ja | 1 | 17 | 17.00× |
| th | 1 | 12 | 12.00× |
| mixed zh/en markdown doc | 37 | 44 | 1.19× |
| ko, hi, en | 6 / 9 / 10 | 6 / 9 / 10 | 1.00× |

- **Disagreement recorded:** the brief states 1.7–2×; I measure **1.19× on a markup-heavy mixed doc and 20× on Chinese prose** `[measured]`. Both can be true — the ratio is a function of the Latin/markup fraction, not a constant. Publish it as a *range with the corpus named*, never as one number.
- Standard: UAX #29 §4.1, which says outright that "reliable detection of word boundaries in languages such as Thai, Lao, Chinese, or Japanese requires the use of dictionary lookup" and that implementations "should tailor them for particular locales… in the form of a profile" `[fetched]`. `Intl.Segmenter` is that dictionary, already in Node 24 and every current browser — zero new dependency.

**5b. Search — MiniSearch CJK**
- Default tokenizer, read from source: `const SPACE_OR_PUNCTUATION = /[\n\r\p{Z}\p{P}]+/u` (`node_modules/minisearch/dist/es/index.js:2002`) `[measured]`. Chinese has neither `\p{Z}` nor `\p{P}` between words → **an entire sentence becomes one token**.
- Measured recall over 7 queries against a 3-doc index: default **3/7 = 42.9%** overall, **1/5 = 20.0%** on CJK-only queries; swapping in an `Intl.Segmenter` tokenizer gives **7/7 = 100%** `[measured]`. Consistent with the brief's 18.1% figure on a larger corpus; my n is small — treat 20.0% as corroboration, not a replacement.
- Fix is four lines: `tokenize: (s) => [...seg.segment(s)].filter(x => x.isWordLike).map(x => x.segment)`. It must be applied to **both** index and query.

**5c. Line breaking and the CJK soft-break space**
- CSS Text 3 §4.1.3: for collapsible breaks "any remaining segment break is either transformed into a space (U+0020) or removed depending on the context before and after the break. **The rules for this operation are UA-defined in this level.**" `[fetched]`
- The spec states the requirement plainly: "In languages that have no word separators, such as Chinese, 'unbreaking' a line requires joining the two lines with no intervening space," and notes browsers "have unconditionally converted segment breaks to spaces, which has prevented content authored in languages such as Chinese from being able to break lines within the source" `[fetched]`.
- Consequence: `中文一行\n第二行` renders as `<p>中文一行↵第二行</p>` in both engines `[measured]`; whether the reader sees a spurious space is **browser-dependent and not specifiable by you**. Options: normalize CJK soft breaks at render, or emit `<wbr>`/zero-width joins — both are engine-visible and must be certified.
- Standard: UAX #14 R55 — Latin/Brahmic break at spaces or orthographic-syllable boundaries; East Asian "lines can break anywhere, except before or after certain characters", and the prohibited set "is commonly tailorable" `[fetched]`.

**5d. RTL**
- `marked` emits **no `dir=` for Arabic or Hebrew input** in paragraphs, headings, lists, links, or tables `[measured]`. Markdown has no direction primitive at all.
- Table alignment survives as `align="right"` — but *logical* start/end in RTL is the mirror of physical left/right, so `:--` means the wrong edge `[measured]`.
- Obligations: `dir="auto"` on block containers, `dir` from front matter for page level, and first-strong isolation for mixed runs (`مرحبا بالعالم MDMAX 42 שלום עולם` renders as one undelimited run) `[measured]`.

**5e. Indic and grapheme integrity** `[measured]`
| Text | UTF-16 units | Code points | Graphemes | UTF-8 bytes |
|---|---|---|---|---|
| `क्षि` (Devanagari) | 4 | 4 | 1 | 12 |
| `ক্ষ্ম` (Bengali) | 5 | 5 | 1 | 15 |
| `க்ஷ` (Tamil) | 3 | 3 | 2 | 9 |
| `ก็` (Thai) | 2 | 2 | 1 | 6 |
| `👨‍👩‍👧‍👦` | 11 | 7 | 1 | 25 |

- Any splice, truncation, or column measurement that indexes by UTF-16 unit or code point will split a Devanagari cluster. This is exactly the class of LR#68 (UTF-8 truncation) one level up: cluster boundaries, not byte boundaries. Standard: UAX #29 extended grapheme clusters, via `Intl.Segmenter(…, {granularity:"grapheme"})`.

### 6. HTML-in-markdown and the sanitisation problem
- CommonMark defines **seven** HTML block kinds by start/end condition — types 1–5 by literal prefix (`<pre`/`<script`/`<style`/`<textarea`, `<!--`, `<?`, `<!`+letter, `<![CDATA[`), type 6 by a fixed 62-name tag list, type 7 by any complete tag alone on a line `[fetched]`.
- GFM's `tagfilter` filters exactly **nine** tags — `<title> <textarea> <style> <xmp> <iframe> <noembed> <noframes> <script> <plaintext>` — by replacing `<` with `&lt;`, and states "**All other HTML tags are left untouched**" `[fetched]`. GitHub itself compensates with "additional post-processing and sanitization after GFM is converted to HTML" `[fetched]`. **The spec is not a security boundary; the platform is.**
- Measured engine divergence on six payloads `[measured]`:

| Input | `marked` default | `markdown-it` (html:false) | `markdown-it` (html:true) |
|---|---|---|---|
| `<script>alert(1)</script>` | passed through **verbatim** | escaped | passed through |
| `<img src=x onerror=alert(1)>` | passed through | escaped | passed through |
| `<details open ontoggle=alert(1)>` | passed through | escaped | passed through |
| `[click](javascript:alert(1))` | **`<a href="javascript:alert(1)">`** | left as literal text | left as literal text |
| `[a](vbscript:x)` | **`<a href="vbscript:x">`** | literal text | literal text |
| `<a href="data:text/html;base64,…">` | passed through | escaped | passed through |

- `marked` ships **no sanitiser** and **no URL-scheme filter**; `markdown-it` refuses dangerous schemes even with `html:true`. Two of MDMAX's seven bench engines (`markdown-it`, `markdown-it-html-true`) therefore disagree with each other by construction — that is a certification axis, not a bug.
- This product is already correct here: `src/modules/preview/presentation/markdown/html-policy.ts` (215 lines) holds a 12-element denylist **and** a `SAFE_HTML_ELEMENTS` allowlist, a `URL_ATTRS` set (`href, src, xlink:href, action, formaction, poster, background, ping, cite, data`), scheme validation against `javascript:`/`vbscript:`/`data:text/html` including newline-obfuscated `java\nscript:`, and a strip-every-`on*`-handler pass `[measured]`. Keep it; it is the only defence, since `rehype-raw` re-admits raw HTML upstream of it.
- `dompurify` is at 257,375,693 downloads/30d (2026-07-29→08-28) vs `rehype-sanitize` at 39,013,358 `[measured]` — if you ever externalise the policy, that is the ecosystem's answer.

### 7. Performance
`marked` vs `markdown-it`, synthetic docs of headings + inline + lists + tables `[measured]`:

| Sections | Bytes | `marked` | `markdown-it` |
|---|---|---|---|
| 200 | 27,778 | 13.2 ms | 11.6 ms |
| 2,000 | 281,778 | 38.5 ms | 49.7 ms |
| 10,000 | 1,417,778 | 173.3 ms | 229.7 ms |

- Throughput at 1.4 MB: 1,417,778 B ÷ 1,048,576 = 1.3520 MB; 1.3520 ÷ 0.1733 s = **7.80 MB/s** (`marked`), 1.3520 ÷ 0.2297 = **5.89 MB/s** (`markdown-it`) `[derived]`.
- No pathological blowup found: a 2,000-`*` run parsed in 9.9 ms; 500-deep blockquote nesting in 1.0 ms `[measured]`. `marked`'s emphasis rules did not exhibit the quadratic backtracking djot's rationale warns about — but that is one probe, not a proof.
- Implication: a 1 MB note re-parses in ~130 ms — above the 100 ms interaction budget on every keystroke. Incremental/splice parsing is not an optimisation here, it is the requirement.

### 8. Tell users these are impossible — do not fake them
1. **Merged cells.** No colspan/rowspan in any CommonMark-compatible profile. Grid tables buy them and cost you readable degradation.
2. **Block content inside a table cell.** GFM forbids it in normative text. A list in a cell is a lie.
3. **Multi-column pages, floats, sidebars, wrapped pull quotes.** No syntax exists; anything you invent renders as literal `:::` noise elsewhere.
4. **Numbered, auto-resolving cross-references.** "Figure 3" requires a numbering pass no dumb renderer will run; `{#fig-x}` leaks as visible text.
5. **Portable footnotes.** Not in the GFM spec; unsupported by default in both engines here. Promise degradation ("the note body stays readable"), not portability.
6. **A stable table caption position.** After the table with a blank line, or it becomes a data row.
7. **Guaranteed CJK line-joining.** UA-defined per CSS Text 3. You can normalise your own renderer; you cannot promise GitHub's.
8. **Correct word counts without a segmenter.** Say "approximate for Chinese, Japanese, Thai" until `Intl.Segmenter` ships.
9. **Sanitised HTML by default.** `marked` will render `<script>` and `javascript:` links as-is. Any "renders like GitHub" claim must exclude GitHub's private post-processing layer.
10. **Round-trip-exact pipes and tabs.** `\|` in a cell and tab-vs-4-space indentation are semantically equal and byte-different — a splice engine must say which it preserves.
11. **WCAG AA out of the box.** No `scope`, no `caption`, no `lang`, no `dir`, no accessible name on task-list checkboxes. Conformance is something the publisher adds, never something the format supplies.

### 9. Disagreements recorded, not resolved
- **CJK undercount factor:** brief says 1.7–2×; measured 1.19× (mixed markup doc) and 20.00× (Chinese prose). Corpus-dependent — quote a range, name the corpus `[measured]`.
- **MiniSearch CJK recall:** brief says 18.1%; measured 20.0% on 5 CJK queries / 3 docs. Small-n corroboration, not a correction `[measured]`.
- **Cross-engine table/thematic-break agreement:** `marked` and `markdown-it` agreed **structurally on 6/6** setext-vs-thematic cases and **5/5** list/indent cases; the only diffs were void-element serialisation (`<hr>` vs `<hr />`) and alignment carrier (`align=` vs `style="text-align:"`) `[measured]`. The setext ambiguity class is *specified* and *implemented consistently* — the risk is authors, not engines.
- **jgm vs CommonMark:** CommonMark's own editor publishes djot (2,033 stars, 118 open issues, pushed 2026-07-01 `[measured]`) precisely because emphasis needs "a daunting list of 17 rules" and reference links are non-local `[fetched]`. The spec's authors do not claim the format is sound; do not claim it for them.
- **Literature:** no published markdown-accessibility study located via Crossref or arXiv `[measured]`. Absence of a search hit is not proof of absence — mark any "first to measure this" claim as unverified (LR#72).