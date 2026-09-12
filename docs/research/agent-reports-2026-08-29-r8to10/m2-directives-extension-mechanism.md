I mutated nothing: this task was read-only (curl fetches, `node`/`python3` renders against existing `node_modules`, and `grep`/`ls` reads); I ran no `git`, no writes, no edits, and created no files — the reported dirt in `~/.claude` and `~/.sgnk` is not mine.

### 1. CommonMark generic directives — the proposal itself

- Thread `talk.commonmark.org/t/generic-directives-plugins-syntax/444`, opened by **mb21 2014-09-06T09:50:24Z**; **173 posts, 79,614 views, last post 2025-04-03T12:13:07Z** [fetched, 2026-08-29].
- Three levels, exactly as posted [fetched]:

```markdown
:name[content]{key=val}

:: name [content] {key=val}

::: name [inline-content] {key=val}
contents, which are sometimes further block elements
:::
```

- Original post also allows decorative trailing colons and a nameless div [fetched]:

```markdown
:::::::::::: SPOILER :::::::::::::
We're going to spoil it in three
easy steps:
::::::::::::::::::::::::::::::::::

::: {.myClass}
some markdown
:::
```

- **Status: never adopted.** `grep -ci directive` over `spec.commonmark.org/0.31.2/` returns **0** [measured]. `github.github.com/gfm/` is still **"Version 0.29-gfm", dated 2019-04-06**, with **0** hits for `alert` and **0** for `directive` [measured].
- jgm (spec author) in-thread, six posts, none endorsing the syntax [fetched]:
  - #130, 2015-02-13: "The current priority is to get a solid spec for core elements… In some cases a good option will be to impose some conventions on existing syntax… **This method has the advantage that your content would degrade nicely if the extension isn't enabled.**"
  - #143, 2015-06-03, on repurposing code fences: "requires no changes in the parser. You just need to go through the AST."
  - #120: leaf blocks "would be better to distinguish… syntactically from the starters for container blocks."
- Newest post #173 (2025-04-03, Diplodoc team) reports shipping `@diplodoc/directive` — **49,961 npm downloads, 2026-07-29→2026-08-27** [measured].

### 2. remark-directive / micromark-extension-directive / mdast-util-directive

| package | latest | published | licence | npm last-month (2026-07-29→2026-08-27) | GH stars 2026-08-29 |
|---|---|---|---|---|---|
| `remark-directive` | 4.0.0 | 2025-02-27 | MIT | **15,161,725** | 420 |
| `micromark-extension-directive` | 4.0.0 | 2025-02-27 | MIT | **29,511,394** | 39 |
| `mdast-util-directive` | 3.1.0 | 2025-01-22 | MIT | **20,157,978** | 20 |

[measured, npm + GitHub API]. Baselines: `remark-parse` 202,457,008; `remark-gfm` 153,352,767; `markdown-it` 119,163,973 [measured]. **remark-directive is 7.5% of remark-parse** (15,161,725 ÷ 202,457,008 = 0.0749) and **9.9% of remark-gfm** (15,161,725 ÷ 153,352,767) [derived].

Strict grammar, from the micromark readme [fetched]:

```markdown
Their syntax is `:name[label]{attributes}`.

::youtube[Video of a cat in a box]{vid=01ab2cd3efg}

:::spoiler
He dies.
:::
```

- Name chars: alphanumeric, `-`, `_`; `-`/`_` cannot end a name [fetched].
- `{#readme}`→`id`, `{.big}`→`class`; `{.red class=green .blue}` ≡ `{class="red green blue"}` [fetched].
- **`:red:` does not work** — a text directive with only a name may not be followed by a colon, "to allow GitHub emoji (gemoji) and directives to coexist" [fetched].
- No whitespace anywhere: `: a`, `:a []`, `:a {}`, `:a[] {}` all rejected; no trailing colons on a container open fence (`:::a:::`) [fetched].
- **"If no closing is found, the container runs to the end of its parent container (block quote, list item, document, or other container)"** [fetched] — unbounded blast radius on a deleted fence.
- remark-directive readme, Authoring: "**keep in mind that they don't work in most places**"; HTML: "If directives are not handled, they do not emit anything" [fetched].

### 3. MyST

- `mystmd` npm 13,668/mo; `myst-parser` npm 40,612/mo; PyPI `myst-parser` **5.1.0, uploaded 2026-05-13T09:38:17**; `jupyter-book/mystmd` 519 stars, MIT [measured].
- Two interchangeable fences, four option syntaxes [fetched, `docs/syntax-overview.md`]:

```markdown
:::{note}
Here is a note!
:::

```{directivename} arg1 arg2
:key1: metadata1
:key2: metadata2

My directive content.
```

```{directivename .class-name #label key="value"}
My directive content.
```

Some content {rolename}`and here is my role's content!`
```

- MyST's own degradation guidance, footnote `[^colon-or-fence]` [fetched]: "**The colon-fence has better fallback when the contents of the directive includes Markdown in non-MyST renderers (like GitHub).** The backtick-fence should be used when the contents of the directive is code-like."
- MyST is **not** the CommonMark proposal: the name goes in braces `{note}` after the fence, not bare after the colons. Three ecosystems, three incompatible grammars, all called "directives" [inference].

### 4. Docusaurus admonitions

- `facebook/docusaurus` 66,118 stars, MIT; `@docusaurus/core` **5,992,673 npm/mo** [measured]. `docusaurus-mdx-loader@3.10.1` depends on `remark-directive: ^3.0.0` and `mdast-util-directive: 3.1.0` [fetched].

```markdown
:::note[Your Title **with** some _Markdown_ `syntax`!]

Some **content** with some _Markdown_ `syntax`.

:::

:::note[With css classes]{.padding--lg .text--italic}

Note the padding and the italicized text.

:::

:::::info Parent

Parent content

::::danger Child

Child content

:::tip Deep Child
```

- Docusaurus accepts the **loose** `:::::info Parent` space-title form that micromark rejects [fetched] — a documented divergence inside the same dependency.
- **Tooling hazard, from Docusaurus's own docs** [fetched]:

```md
<!-- Prettier changes this -->
:::note
Hello world
:::

<!-- to this -->
::: note Hello world:::
```

### 5. Quarto, pandoc `fenced_divs`, `bracketed_spans`

- `jgm/pandoc` 46,052 stars, GPL-2.0; `quarto-dev/quarto-cli` 5,965 stars, licence `NOASSERTION` [measured]. Pandoc MANUAL.txt lines 5937 (`fenced_divs`) and 5981 (`bracketed_spans`) [fetched].

```
::::: {#special .sidebar}
Here is a paragraph.

And another.
:::::

::: Warning ::::::
This is a warning.

::: Danger
This is a warning within a warning.
:::
::::::::::::::::::

[This is *some text*]{.class key="val"}
```

- Pandoc rules [fetched]: "**Opening fences are distinguished because they *must* have attributes**"; "Fences without attributes are always closing fences"; closing colon count need not match. **"Note: the `commonmark` parser doesn't permit colons after the attributes"** — pandoc disagrees with itself between its `markdown` and `commonmark_x` readers.
- Quarto rides pandoc divs and puts the title in a **heading**, not an attribute [fetched]:

```markdown
::: {.callout-note}
Note that there are five types of callouts.
:::

::: {.callout-caution collapse="true"}
## Expand To Learn About Collapse
This is an example of a 'folded' caution callout.
:::

::: {.callout-tip title="Tip with Title"}
This is a callout with a title.
:::
```

- That heading convention is jgm #130's advice made real: on GitHub live, `::: {.callout-note}\n## Title\nBody\n:::` renders `<p>::: {.callout-note}</p><h2>Title</h2><p>Body<br>:::</p>` — the title survives as a real H2 [measured, api.github.com/markdown].

### 6. Obsidian callouts

```markdown
> [!info] Here's a callout title
> Here's a callout block.
> It supports **Markdown**, [[Wikilinks]], and ![[Engelbart.jpg]]

> [!faq]- Are callouts foldable?
> Yes! In a foldable callout, the contents are hidden.

> [!question] Can callouts be nested?
> > [!todo] Yes!, they can.
> > > [!example]  You can even use multiple layers of nesting.
```

[fetched, `obsidianmd/obsidian-help/en/Editing and formatting/Callouts.md`]. Custom types are **open-ended** via CSS `.callout[data-callout="custom-question-type"]` [fetched]. `+`/`-` after the type sets fold state; body may be omitted for a title-only callout [fetched].

### 7. GitHub alerts

```markdown
> [!NOTE]
> Useful information that users should know, even when skimming content.
```

Five types: NOTE, TIP, IMPORTANT, WARNING, CAUTION. GitHub docs: "**a Markdown extension based on the blockquote syntax**… **Alerts cannot be nested within other elements**" [fetched, `github/docs`]. **Unspecified**: 0 hits in the GFM spec [measured]. Live render output is `<div class="markdown-alert markdown-alert-note"><p class="markdown-alert-title">[octicon svg]Note</p>…` [measured].

### 8. Measured degradation matrix — dumb renderers

Rendered with `commonmark@0.31.2`, `markdown-it@15.0.0` (commonmark preset), `marked@16.4.2`, `micromark@4.0.2` from this repo's `node_modules`, plus GitHub live [measured, 2026-08-29]. Four local engines agreed on every row except the two noted.

| source | dumb-renderer output | verdict |
|---|---|---|
| `:::note\nBody **b**\n:::` | `<p>:::note\nBody <strong>b</strong>\n:::</p>` | prose renders; **fence text visible** |
| `:::note\nP1.\n\nP2.\n:::` | `<p>:::note\nP1.</p><p>P2.\n:::</p>` | **container splits**; closer glues to last para |
| `::youtube[Cat]{vid=abc}` | `<p>::youtube[Cat]{vid=abc}</p>` | **raw payload dumped as prose** |
| `A :abbr[HTML]{title="x"}` | `A :abbr[HTML]{title=&quot;x&quot;}` | brace soup in body text |
| `::: {.note}` … `:::` | `<p>::: {.note}\n…\n:::</p>` | same, +4 bytes noise |
| `> [!NOTE]\n> Body **b**` | `<blockquote><p>[!NOTE]\nBody <strong>b</strong></p></blockquote>` | **correct container, 7 stray chars** |
| `> [!FIGURE]` (unknown type) | GitHub live: `<blockquote><p>[!FIGURE]<br>Body</p></blockquote>` | **unknown types degrade cleanly** |
| ` ```note title="x" ` | `<pre><code class="language-note">Body **b**\n</code></pre>` | markers hidden, **markdown not rendered** |
| ` ```note title="x" ` | GitHub live: `<pre lang="note" data-meta="title=&quot;x&quot;">` | **meta survives into the DOM** |
| `<!-- fm:note -->` | `html:true` → passthrough; **`html:false` → `&lt;!-- fm:note --&gt;` visible text** | splits the engine matrix |
| `[red text]{.warn}` | `<p>A [red text]{.warn} here.</p>` | brace soup |
| `[Body](fm:note)` | cmark/mdit/marked keep `href="fm:note"`; **micromark4 emits `href=""`** | protocol filter disagreement |
| `Body[^p1]` + `[^p1]: profile=note` | `<p>Body<a href="profile=note">^p1</a></p>` | **config leaks into an href** |
| `---\ntitle: x\n---` | `<hr /><h2>title: x</h2>` | **metadata printed as a heading** |
| `:::{note}` (MyST) | `<p>:::{note}…</p>` | fence text visible |
| ` ```{note} ` (MyST) | `<pre><code class="language-{note}">` | markers hidden, body escaped |

### 9. Measured splice hazards (deleted closing marker, dumb renderer)

| mechanism | blast radius |
|---|---|
| unclosed ` ```note ` | **swallows the entire rest of the document** into `<pre>` [measured; CommonMark §4.5 mandates this: "If the end of the containing block (or document) is reached and no closing code fence has been found, the code block contains all of the lines after the opening code fence"] |
| unclosed `:::note` | dumb renderer: **none** (degrades to `<p>`). Directive-aware renderer: **runs to end of parent container** [measured + fetched] |
| unclosed `<!-- … -->` | none in dumb renderer [measured]; hides content in `html:true` engines [inference] |
| `> [!NOTE]` | **structurally impossible — no closing marker exists** [measured] |

Marker byte cost, UTF-8 [measured]: directive container 11 B · directive leaf 11 B · text directive 12 B · pandoc div 15 B · fenced-code+info 15 B · alert marker 12 B (+2 B/line for `> `) · HTML comment pair 34 B.

### 10. Scorecard (0–5; CM-legal = valid CommonMark, unmodified)

| mechanism | CM-legal | degradation | expressive | splice-safe | tool support |
|---|---|---|---|---|---|
| fenced code + info string | **5** (§4.5) | 3 (opaque but contained) | 3 | **2** (unclosed = doc-wide) | **5** (universal, GitHub keeps `data-meta`) |
| blockquote alert / callout | **5** (§5.1) | **5** | 2 | **5** (no closer) | 4 (GitHub 5 types, Obsidian open set; unspecified) |
| generic directives `:::` | **5** (parses as `<p>`) | **1** | **5** | 2 | 4 (29.5M/mo, Docusaurus, Diplodoc) |
| pandoc fenced divs | **5** | **1** | 4 | 2 | 3 (pandoc, Quarto; two grammars) |
| HTML comments | 4 (§4.6) | **0** with `html:false` | 3 | 4 | 2 (splits `markdown-it` vs `markdown-it-html-true`) |
| frontmatter keys | **0** (not in spec) | **0** (`<hr>`+`<h2>`) | 2 (doc-level only) | 4 | 4 (`remark-frontmatter` 20.6M/mo) |
| link/image abuse | **5** | 2 (nonsense link; micromark blanks href) | 1 | 3 | 1 |
| footnote abuse | 4 (GFM ext) | **1** (config in an href) | 1 | 2 | 3 |
| bracketed spans `[x]{.c}` | **5** | 2 | 3 | 4 | 3 (pandoc, djot, markdown-it-attrs 1.1M/mo) |

### 11. Recommendation for frontmatter render profiles

- **Prose-bearing block profiles → blockquote-callout shape.** `> [!kind]` with the profile name in the bracket. It is the only container that scored 5 on both degradation and splice-safety [measured]. Reuse GFM's five names verbatim to get free native rendering on GitHub; namespace everything else as `> [!fm-<kind>]`, which is measured to degrade to a plain blockquote on GitHub live rather than erroring. Parameters go on the marker line, which degrades to visible text — so keep them to one short token, and put anything longer in a sidecar.
- **Opaque / code-like block profiles → fenced code with a structured info string.** First word = the profile id (becomes `class="language-<id>"` everywhere); remainder = the parameter string (GitHub preserves it as `data-meta`) [measured]. This is jgm's own #143 recommendation and needs no parser change. Use `~~~` fences when the payload may contain backticks [CommonMark §4.5].
- **Titles → a heading inside the container, Quarto-style.** Measured to survive as a real `<h2>` in every engine including GitHub, where an attribute-borne title is invisible.
- **Directives as *authoring sugar only*.** Accept `:::note` on input for paste-compatibility with Docusaurus/MyST content, then normalize to the carrier above on save. Do not make `:::` the on-disk representation.
- **No inline profile mechanism in v1.** Every inline candidate degrades to brace soup or a fake link [measured]; the expressiveness gain does not pay for it.
- Rationale in one line: the spec author's own guidance — "impose some conventions on existing syntax… your content would degrade nicely if the extension isn't enabled" [fetched, #130] — and his own successor language chose divs+spans, not `:name[]{}`.

### 12. What degrades badly and must be avoided

- **Frontmatter as the carrier for block-level profiles.** Not CommonMark at all; renders as `<hr>` + `<h2>title: x</h2>` [measured]. Document-level config only, and only because MDMAX strips it first.
- **HTML comments.** Printed verbatim as visible text under `html:false`, which is the default in `react-markdown`, `micromark`, and plain `markdown-it` — three of the seven engines in `BENCH_ENGINE_IDS` [measured]. Guarantees a split certification matrix.
- **Footnote and link/image abuse.** Config strings land in `href` attributes; `micromark@4` blanks unknown-scheme hrefs while three other engines keep them [measured].
- **Multi-paragraph `:::` containers.** The closing fence attaches to the final paragraph and the block silently splits [measured].
- **Any fenced construct spliced without treating the open/close pair atomically.** A dropped ` ``` ` swallows the remainder of the file [measured, spec-mandated].
- **`:::` as the on-disk form if Prettier is anywhere in the toolchain** — Docusaurus documents Prettier rewriting `:::note\nHello world\n:::` to `::: note Hello world:::` [fetched].

### 13. Source disagreements, recorded not resolved

- **GitHub docs vs GitHub implementation:** docs show only uppercase types; the live renderer accepts `> [!note]` and emits a full alert [measured].
- **Titles:** Obsidian supports `> [!tip] Custom title`; GitHub renders that as a plain blockquote with the marker visible [measured]. Same syntax, incompatible semantics.
- **Nesting:** Obsidian nests callouts arbitrarily; GitHub docs say alerts "cannot be nested within other elements", confirmed live inside a list item [fetched + measured].
- **Pandoc internal:** the `markdown` reader permits trailing colons after div attributes, the `commonmark` reader does not [fetched].
- **Directive grammars:** micromark forbids whitespace between `:::` and the name; Docusaurus documents `:::::info Parent`; pandoc requires attributes (braced or a bare word) on the opening fence; MyST puts the name in `{}`. Four "directive" dialects [fetched].
- **Fence choice:** MyST states the colon fence degrades better than the backtick fence in non-MyST renderers [fetched]; measured, the backtick fence hides its markers entirely while the colon fence exposes them — the two claims are about different failure modes (markdown fidelity vs marker visibility), not the same axis.
- **jgm never endorsed the proposal.** In djot (2022, his own successor), the block form is pandoc's `::: warning` and the inline form is `[read the manual]{.big .red}` — not `:name[label]{attrs}` [fetched].