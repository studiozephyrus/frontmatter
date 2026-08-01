---
mdmax: 1
section: 5
title: "Rendering — functional and visual, custom rendering, custom formatting, custom parsing"
slug: 05-rendering
lines: 1197
words: 11996
forward_links: [1, 3, 4]
backlinks: [1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14]
prev: 04-representation
next: 06-conventions
---

[← Index](README.md) · [← §4 Representation](04-representation.md) · [§6 Conventions →](06-conventions.md)

## 5. Rendering — functional and visual, custom rendering, custom formatting, custom parsing

### 5.0 What this section is, in one paragraph

This is the complete rendering specification for frontmatter and MDMAX. It answers five
questions the founder asked by name: what will frontmatter render; how does custom rendering
work; how does custom formatting work; how does custom parsing work; and where is the line.
The answer, stated once so the rest of the section can be checked against it:

> **We ship a render POLICY, not a renderer zoo.** A renderer is admitted only when the HOST
> supplies its configuration, its inputs, and an upper bound on its work. Everything the
> renderer shows is a PROJECTION — regenerated on every view, never stored, never a source of
> truth. Only two things may write back into the `.md`, and both are byte-range splices.
> Everything else in the rendered view is client-side view state that never touches disk.

Every number below carries a source. Corpus numbers cite the pinned corpus id
`sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4`
(1,084 files / 25,548,765 bytes; roots `md` at head `02c22ec4` 756 files / 21,068,853 B,
`knowledge` at head `464eb666` 272 files / 3,570,923 B, `frontmatter` at head `798ebbf3`
56 files / 908,989 B — read directly from
`docs/engine/research/corpus-manifest.json`). Claims are tagged `[measured]` (we ran it),
`[primary]` (we read the source), `[secondary]`, `[inference]`, `[SIMULATED]`, or
`[unverified]`.

**Vocabulary, defined once.** A *renderer* is a library that turns a declarative payload into
visual output (mermaid, KaTeX, viz.js). A *surface* is a place a document is displayed
(GitHub's blob view, GitHub's comment box, frontmatter's preview pane, frontmatter's PDF
export). A *target* is a `(product, surface)` pair — never a product, because we measured a
single product disagreeing with itself. *Dispatch* is the act of matching a fence's info
string to a renderer. *Degradation* is what a non-participating tool shows instead. A
*projection* is any output derived from the source bytes: rendered HTML, a PDF, an SVG, the
machine view. *Splice* is a replacement of an explicit byte range in the original source,
leaving every other byte untouched.

---

### 5.1 What every serious renderer already does — the capability matrix

This is the baseline. Anything in the "everyone does it" column is table stakes and buys us
nothing; anything in the "nobody does it" column is either an opportunity or a warning that
nobody wants it.

#### 5.1.1 The headline correction: GitHub is not three surfaces, it is at least five

The v2.0.0 plan named three GitHub surfaces (blob, comment, Pages). A live measurement found
a fourth that integrators actually call and that **disagrees with the blob view on identical
bytes**:

```
POST https://api.github.com/markdown        [measured, live, final-gate/rendering-frontier C5, CONFIRMED]
  ```mermaid fence   -> <div class="highlight highlight-source-mermaid"><pre><span class="pl-k">flowchart</span>…
                        (syntax-highlighted SOURCE — no diagram)
  ```geojson fence   -> <div class="highlight highlight-source-json">   (it RELABELS the language)
  <svg viewBox="0 0 8 8"><path d="M1 1h2"/></svg>
                     -> <p></p>                                        (silently DELETED)
  <details><summary>s</summary>body</details>
                     -> unchanged                                       (passes verbatim)
```

The same four behaviours were reproduced independently by the verifier with its own
`curl`. This is the single strongest measurement in the rendering research and it is the
reason targets are modelled as `(product, surface)` pairs throughout this plan.

A fifth GitHub surface, GitHub Pages, runs **kramdown**, not cmark-gfm, and therefore
disagrees with both — most visibly on definition lists (`Term` newline `: definition`), which
kramdown renders as a real `<dl>` while GitHub blob and comment render `<p>Term<br>: definition</p>`
`[measured, final-gate/hold-more, CONFIRMED]`.

#### 5.1.2 The matrix

Evidence tier is per row and it is not uniform. Read the tier column before quoting a cell.

| target `(product, surface)` | diagrams | math | raw HTML | attributes kept | fence info string | evidence tier |
|---|---|---|---|---|---|---|
| **github-blob** | mermaid, geoJSON, topoJSON, ASCII STL — exactly four `[primary]` | rendered | 9-tag **blocklist** (`title, textarea, style, xmp, iframe, noembed, noframes, script, plaintext`) `[primary, cmark-gfm extensions/tagfilter.c:5-8]` | `id` → `user-content-` prefix; `class`/`style`/`data-*` stripped; **`title` survives with value intact** | `class="language-x"` | `[secondary]` — inherited, not re-derived this run |
| **github-comment** | same four | rendered | same blocklist | same, but `id` is **lowercased** in `gfm` mode | same | `[secondary]` |
| **github-api** (`POST /markdown`) | **none** — mermaid returned as highlighted source | n/a | inline `<svg>` **deleted** to `<p></p>` | `id` lowercased in `mode=gfm`, **case-PRESERVED in `mode=markdown`** | unknown language emits **both** `lang="fm:meta"` **and** `data-meta="v1"` | `[measured, live]` |
| **github-pages** (kramdown) | none natively | via config | kramdown rules | kramdown IAL `{#id}` consumed into a real `id` | `class="language-x"` | `[measured, 24-config bench]` |
| **GitLab** | — | — | — | — | — | **NOT MEASURED.** Named in a third-party flavour matrix (`ArchieCur/MARKDOWN_FLAVORS`, 14 flavours × 17 constructs) but we ran nothing. Treat this row as EMPTY. |
| **Obsidian** | mermaid only | yes | yes | n/a | `class="language-x"` | `[primary]` — read `obsidianmd/obsidian-help` *Advanced formatting syntax.md*; **not run** |
| **VS Code preview** | **zero diagram languages natively** | via extension | configurable | n/a | `class="language-x"` | `[primary]` — `microsoft/vscode` `extensions/markdown-language-features/package.json`; **not run** |
| **Zed** | **no diagram tag at all** | — | `HtmlBlock` tag exists | n/a | `CodeBlock` tag | `[primary]` — `crates/markdown/src/markdown.rs` tag set enumerated; **not run** |
| **Docusaurus** | mermaid **opt-in** — install `@docusaurus/theme-mermaid` and set `markdown.mermaid: true`; **off by default** | KaTeX opt-in | MDX | MDX/JSX | MDX component mapping | `[primary]` |
| **Quarto** | mermaid + graphviz, via **braced** info strings `{mermaid}` / `{dot}` | yes | yes | yes | **`{mermaid}` — incompatible with GitHub's `mermaid`** | `[primary]` |
| **VitePress** | — | — | — | — | — | **NOT MEASURED.** Named only in the "no renderer shows the reader that a diagram carried configuration" survey. Treat as EMPTY. |
| **HackMD** | — | — | — | — | — | **NOT MEASURED for rendering.** (It *was* measured for collaboration: it ships real-time collaboration, inline and page comments, and suggest-edit on the FREE tier `[primary]`.) |
| **Typora** | — | — | — | — | — | **EMPTY — CLOSED SOURCE.** Nothing was fetched. Do not fill this row from memory. |
| **Bear** | — | — | — | — | — | **EMPTY — CLOSED SOURCE.** Homepage contains 7 occurrences of "markdown", 0 of "comment", 0 of "collaborat" `[measured]` — that is a *marketing* observation, not a rendering one. |
| **Craft** | — | — | — | — | — | **EMPTY — CLOSED SOURCE.** Homepage: 0 occurrences of "markdown", "comment" or "collaborat" `[measured]`. |
| **Notion import** | — | — | — | — | — | **EMPTY — CLOSED SOURCE.** |
| **Slack / Discord** | n/a | n/a | n/a | n/a | n/a | **Not CommonMark. Model as LOSSY SINKS, never as renderers** `[primary]` |
| **frontmatter-preview** (ours) | mermaid **11.15.0**, lockfile-pinned | KaTeX 0.17.0 | 61-element allowlist + 12-element hard deny | see §5.5 | `class="language-x"` | `[measured, this session, HEAD 1bd4dad]` |
| **frontmatter-pdf** (ours) | mermaid loaded from `cdn.jsdelivr.net/npm/mermaid@11` — **unpinned** | KaTeX pinned to 0.17.0 | same | same | same | `[measured, source read]` |
| **frontmatter-export** (ours, HTML/DOCX path) | mermaid, `securityLevel` **not passed** (defaults to `strict` — measured at 11.15.0) | same | same | same | same | `[measured, this session]` |

**Read the last three rows together. Our own product is three surfaces and they do not agree.**
`src/modules/export/presentation/pdf-doc.ts:24` sets `const MERMAID_VERSION = "11";` and line 134
imports `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.esm.min.mjs`, while
`node -e "require('mermaid/package.json').version"` returns `11.15.0` and the npm registry's
`dist-tags.latest` is `11.16.0`. We did **not** fetch jsdelivr (it is not an allowed host in the
research sandbox), so "the PDF path serves 11.16.0 today" is `[inference]` from npm's semver
resolution, not an observation. What *is* observed is that the preview path is pinned and the PDF
path is not. Additionally `src/modules/export/presentation/export-doc.ts:66` calls
`mermaid.initialize({ startOnLoad: false, theme: "default" })` with **no `securityLevel`**, relying
on the library default — which we measured as `"strict"` at 11.15.0, so it is currently equivalent
but **unasserted**, and will silently diverge the day that default changes `[measured, this session]`.

#### 5.1.3 What the matrix means

1. **The floor is: CommonMark + GFM + mermaid + math.** Everything above that is opt-in
   everywhere, including at Docusaurus and Quarto.
2. **Nobody models surfaces.** babelmark3, the closest prior art, has 38 registered providers
   of which 23 (60.5%) sit behind encrypted URLs only its maintainer holds, and contains
   essentially no product surfaces — no Obsidian, Notion, VS Code, Slack, Discord, Typora,
   Docusaurus, Hugo, Jekyll or Discourse `[primary]`. It compares *parsers on fragments*. It
   does not compare *documents across product surfaces*.
3. **VS Code shipped the user-facing control this whole area needs and nobody copied it:**
   a per-workspace render security level, exposed as the command
   `markdown.showPreviewSecuritySelector`, alongside `markdown.previewScripts` /
   `markdown.previewStyles` `[primary]`. That precedent — *the host owns render policy and the
   user can see it* — is a stronger product idea than any diagram feature.

---

### 5.2 What is renderable from a declarative spec with no runtime

Eighteen candidates, each judged on five columns, then a build decision. "Fits a fence info
string" means the language name is a single token with no space, so it survives every
renderer's `class="language-x"` transport. "Degrades to readable text" means a
non-participating renderer shows the payload as source, not as junk.

| # | language | declarative spec? | fits a fence info string? | degrades to readable text? | security surface | **DO WE BUILD IT** |
|---|---|---|---|---|---|---|
| 1 | **mermaid** | yes | yes (`mermaid`) | yes — `<pre><code>` with payload byte-intact | **11 published GitHub advisories**, 4 dated 2026-05-11, 2 dated 2025-08-19 `[primary]`. Includes a *pure-declarative* Gantt `excludes` infinite-loop DoS (GHSA-6m6c-36f7-fhxh) and CSS injection via the document's own `%%{init}%%` (GHSA-87f9-hvmw-gh4p) | **YES — already shipped.** With `%%{init}%%` stripped before dispatch and `maxEdges`/`maxTextSize` set by the host |
| 2 | **math (KaTeX)** | yes | yes (`math`, plus `$…$` / `$$…$$`) | yes | 5 npm advisories `[primary]`. Bounded by `maxExpand`; safe **only** because `trust:false` is the default | **YES — already shipped.** Assert `trust:false` in a test |
| 3 | **graphviz (viz.js / @viz-js/viz, WASM)** | yes (DOT) | yes (`dot`) | yes | **0 advisories** `[primary]`. No include directive, no network. Needs only a host node cap | **RECOMMENDED, not decided.** Only if a user asks — see the demand negative below |
| 4 | **wavedrom** | yes (JSON) | yes (`wavedrom`) | yes | **0 advisories** `[primary]`. JSON data only | **NO for now.** Zero corpus demand |
| 5 | **d2 (`@terrastruct/d2`)** | yes | yes (`d2`) | yes | not audited | **NO.** 39,961 downloads/week `[primary]` |
| 6 | **plantuml** | yes | yes (`plantuml`) | yes | **GHSA-ff3m-68vj-h86p, HIGH severity SSRF, 2023-06-27** `[primary]`; plus GHSA-hrvf-g648-rf3m stored XSS, 2026-01-16. Also requires a JVM | **NO — REFUSED.** See §5.3 |
| 7 | **vega-lite** | yes | yes (`vega-lite`) | yes | `vega` carries 8 advisories (1 high); `vega-lite` itself 0 `[primary]`. **But `UrlData.url: string` makes every chart spec a fetcher** — `vega/vega-lite` `src/data.ts:100-105` and `:125` `[primary]` | **NO as authored.** Allowable only with `data.url` rejected at policy time (inline data only) |
| 8 | **tikz / LaTeX** | yes | yes (`latex-tikz`) | yes | full TeX is a Turing-complete runtime | **NO — REFUSED.** It is a program |
| 9 | **charts (generic)** | depends on the spec | yes | yes | inherits from whichever spec | **NO.** Subsumed by vega-lite's verdict |
| 10 | **tables with formulas** | **no** — a formula is an expression to evaluate | n/a | n/a | it is an evaluator | **NO — REFUSED.** See §5.3 rule (2) |
| 11 | **timelines** | yes (mermaid `timeline`) | yes | yes | inherits mermaid's | **FREE — already covered by mermaid** |
| 12 | **maps (geoJSON / topoJSON)** | yes | yes | yes | tile fetching is a document-named remote input | **NO.** GitHub renders these; we would need a tile provider, which breaks rule (2) |
| 13 | **music notation (abcjs)** | yes | yes (`abc`) | yes | not audited | **NO.** 58,394 downloads/week `[primary]` |
| 14 | **chemistry (SMILES)** | yes | yes (`smiles`) | yes | not audited | **NO.** Zero corpus demand |
| 15 | **circuits** | yes (wavedrom / circuitikz) | yes | yes | see 4 and 8 | **NO** |
| 16 | **gantt** | yes (mermaid `gantt`) | yes | yes | **the Gantt DoS above** | **Covered by mermaid, with the host work-bound mandatory** |
| 17 | **kanban** | yes (mermaid `kanban`) | yes | yes | inherits mermaid's | **FREE — covered by mermaid** |
| 18 | **slides / forms** | forms are **not** declarative — a form is an input surface with a submit action | n/a | n/a | `form`, `button`, `select`, `textarea` are all in our 12-element hard-deny list | **NO — REFUSED** |

#### 5.2.1 The negative that governs this whole table

**Demand for the diagram zoo is absent, measured twice.**

```
PINNED CORPUS   corpus_id sha256:3a010b16…      1,084 files / 25,548,765 bytes
  total opening fences ............ 7,714
  distinct info-string first tokens .. 25
  top tokens ...................... 5,700 bash · 1,361 (none) · 200 markdown · 173 json · … · 10 mermaid
  mermaid ......................... 10  (0.13%)
  d2, graphviz, plantuml, vega-lite, wavedrom, tikz, music, chemistry .... ZERO

SECOND CORPUS   all *.md under ~/.claude/skills-src, selection_sha256 d6321d4af60256c0308d52490ab33744
  474 files / 5,013,124 bytes
  opening fences .................. 2,995
  distinct info tokens ............ 30
  diagram-ish fences .............. 0  (0.0%)

COMBINED: 10 diagram fences in 10,709.                    [measured, final-gate/rendering-frontier]
```

`docs/engine/PLAN.md` §15.1 already carries the same correction from a different corpus:
mermaid appears in **340 of 37,990 external files (0.89%)**, **0.26%** excluding mermaid's own
docs, **7 of 4,229 (0.17%)** on this repo's vaults, and **330,496 / 18,841,600 = 1.75%** against
GitHub's own `.md` proxy; all non-code diagram/math fences together are **3.45% of fences**.
Our two corpora say **0.093%** — an order of magnitude lower again.

**Adoption of the zoo is two orders of magnitude below the parsers.** Weekly npm downloads,
window 2026-07-24 to 2026-07-30, `api.npmjs.org/downloads/point/last-week` bulk endpoint
`[primary]`:

```
marked            61,032,058     mermaid           11,828,208
remark-parse      45,820,243     vega-lite            753,796
katex             19,924,866     plantuml-encoder     177,298
                                 viz.js                81,029
                                 abcjs                 58,394
                                 @terrastruct/d2       39,961
                                 vexflow               39,704
                                 wavedrom              25,307
```

Two cross-checks let us trust the rest of that list: `marked` at 61,032,058 reproduces the
figure `docs/mdmax/PLAN.md` already cites, exactly; and `markdown-it-decorate` returned 1,094,
reproducing that cited figure exactly.

**Below mermaid there is nothing with a real user base.** So the honest default is: **ship
mermaid and math, ship the POLICY, and ship no third renderer until a user asks for one by
name.** If a third is ever added, graphviz-via-WASM is first in line because it is the only
candidate that passes all three clauses of §5.3 with zero advisories.

#### 5.2.2 The cost side, so the tradeoff is visible

- **Every renderer added is a permanent advisory stream, and a renderer bug fires on VIEW** —
  the cheapest and most common operation in a collaboration product. Published advisory counts
  `[primary]`: `dompurify` 27, `marked` 18, `mermaid` 11, `vega` 8, `katex` 5, `@mdx-js/mdx` 0,
  `vega-lite` 0, `wavedrom` 0, `viz.js` 0.
- **Against that cost, the read-only benefit is already free.** Eleven unknown fence languages
  run through frontmatter's pipeline and come out with the payload **byte-intact** plus a
  `language-X` class, at a constant wrapper cost of ~46–58 bytes. That is D8 validated for
  rendering: **the info string is a free, unlimited dispatch key that costs nothing to refuse.**

  > **Correction to the research, and it matters.** The rendering-frontier report claimed
  > "12/12 unknown fence languages". The verifier reproduced the payload-intact result through
  > a *stricter* five-plugin chain, but killed the framing: **mermaid is not unknown in shipping
  > frontmatter** — `src/modules/preview/presentation/markdown/components.tsx:132-137` reads
  > `const language = /language-(\w+)/.exec(className ?? "")?.[1]; if (language === "mermaid") return <MermaidBlock …/>`,
  > so it is dispatched to a diagram and never degrades. **The honest figure is 11/12
  > unknown-and-degraded + 1 already-dispatched.** Neither probe was "frontmatter's real
  > pipeline" either: both omit ReactMarkdown's `components` override and `disallowedElements`.
  > The conclusion is untouched; the number is not 12/12. Use 11/12.

---

### 5.3 The runtime line, drawn precisely

This is the rule the founder asked for. It is **not** declarative-versus-imperative — that
distinction fails on the first example.

> **THE RULE.** A renderer stays a *renderer* if and only if the **HOST** — never the document
> — supplies all three of:
> **(1) its CONFIGURATION**, **(2) its INPUTS**, and **(3) an upper BOUND on its work.**
> Break any one and it is a *runtime*, and we refuse it.

#### 5.3.1 Why all three clauses are needed, with the measurement that forced each

**Clause (1) — configuration.** Mermaid, the canonical "safe" example, **already breaks it as
shipped**. With the host calling `mermaid.initialize({ securityLevel: 'strict', fontSize: 16 })`,
a `%%{init}%%` directive inside the document set `fontSize` to 99 and forced `htmlLabels` to
true `[measured at mermaid 11.15.0, reproduced independently by the verifier under jsdom]`.
`MermaidConfig` has **52 top-level keys** and mermaid's `secure` list protects exactly **6**
(`secure, securityLevel, startOnLoad, maxTextSize, suppressErrorRendering, maxEdges`), so
**46 of 52 renderer-config keys are document-writable in principle** `[primary,
node_modules/mermaid/dist/mermaid.min.js and config.type.d.ts]`. The verifier added a datum the
researcher missed: **`themeCSS` is also document-settable** and accepted `"body{background:red}"`
at 11.15.0 under `securityLevel:'strict'` — the exact key named in GHSA-87f9-hvmw-gh4p.

**The honest limit of that finding, self-refuted and reported.** The researcher predicted the
override would *persist* across diagrams and that `dompurifyConfig` was document-settable. Both
are FALSE: `16 → 99 → 16` (a sibling diagram with no directive reads the host's value back), and
`dompurifyConfig` stayed `undefined` at HOST, AFTER-A and AFTER-B despite the directive
explicitly setting it `[measured; reproduced exactly by the verifier]`. So *"mermaid is a
runtime"* is too strong. **The correct, narrower claim: a document can reconfigure the renderer
FOR ITS OWN BLOCK, bounded, and mermaid's security-critical keys hold.** That is still enough to
justify stripping `%%{init}%%` before dispatch, because the fix is one line and the alternative
is trusting 46 keys.

**Clause (2) — inputs.** Two candidates break it *by their own type systems*:
`vega/vega-lite` `src/data.ts:105` declares `export interface UrlData extends DataBase { … url: string; }`
`[primary, verbatim]`, so every chart spec is a fetcher; and PlantUML's include directives
produced GHSA-ff3m-68vj-h86p, a HIGH-severity SSRF, 2023-06-27 `[primary]`.

> **Attribution correction the verifier made and we keep.** The advisory text reads only
> *"Server-Side Request Forgery (SSRF) in GitHub repository plantuml/plantuml prior to
> 1.2023.9."* It names **no mechanism**. "`!includeurl` is the vector" is `[inference]`, not
> `[primary]`. The HIGH-severity SSRF is confirmed; the mechanism is not.

**Clause (3) — work bound.** A purely declarative spec can still be a denial of service. Mermaid's
Gantt `excludes` attribute — pure declaration, no expressions — caused an infinite-loop DoS **on
render, not on parse**, through 11.14.0. GHSA-6m6c-36f7-fhxh, verbatim: *"`mermaid.parse` is
unaffected, unless you then call the `ganttDb.getTasks()` (which is called when rendering a
diagram)."* `[primary]` And every declarative renderer that survived contact with the web added
an explicit bound: KaTeX bounds macro expansion (`katex.mjs:14650-14651`: `if (this.expansionCount > this.settings.maxExpand) { throw new ParseError("Too many expansions: infinite loop or " + "need to increase maxExpand setting");` `[primary, character-for-character]`), mermaid locks
`maxTextSize` and `maxEdges` into its 6-key secure list. An attempted TeX expansion bomb produced
only **34× amplification in 1 ms** `[measured]`.

> **Context the research omitted, in the direction that cuts against it.** Both cited mermaid
> advisories list `first_patched_version: 11.15.0` — **the exact version frontmatter has
> installed** (vulnerable range `>= 11.0.0-alpha.1, <= 11.14.0`). The *structural* argument
> (declarative ≠ bounded) survives intact. Any implication that we are *currently exposed* to
> those two does not. `[verifier correction, CONFIRMED]`

#### 5.3.2 Three on each side

| side | example | which clause decides it |
|---|---|---|
| **RENDERER — admit** | **mermaid**, with `%%{init}%%` stripped and host `maxEdges`/`maxTextSize` | (1) restored by stripping; (2) inline only; (3) host caps |
| **RENDERER — admit** | **KaTeX** with `trust:false` asserted in a test | (1) host-set; (2) inline TeX only; (3) `maxExpand` |
| **RENDERER — admit** | **graphviz via viz.js WASM** | (1) no directive channel; (2) no include, no network; (3) host node cap — the only candidate that passes all three unmodified |
| **RUNTIME — refuse** | **MDX** | (1) and (2) both — it is a program. And see §5.3.3 |
| **RUNTIME — refuse** | **PlantUML** | (2) — include directives, HIGH SSRF, plus a JVM |
| **RUNTIME — refuse** | **Vega/Vega-Lite as authored** | (2) — `UrlData.url` makes every spec a fetcher |

**The borderline case is the reason clause (3) exists, and it is worth stating loudly.**
KaTeX sits on the renderer side **only because `trust:false` is the default**. Flip it — the
single line a well-meaning integrator adds to "support links in math" — and the same source
produces a live `javascript:` anchor and an `<img>` fetching an arbitrary remote URL from
inside a math block:

```
katex 0.17.0, jsdom-parsed                                   [measured; reproduced by verifier]
  trust:false  \href{javascript:alert(1)}{x}  -> {"anchors":[], "imgs":[], "errNodes":0}
               \includegraphics{https://…}    -> no <img>
  trust:true   \href{javascript:alert(1)}{x}  -> <a href="javascript:alert(1)">  (live)
               \includegraphics{https://…}    -> <img src="https://tracker.example/beacon.png">
```

**Ship an assertion, not a comment.** A test that fails if `trust` is ever truthy.

#### 5.3.3 MDX, and why it is refused on a ground independent of security

`docs/engine/PLAN.md` §15.5 states the deciding constraint, and it is not adoption:
**MDX cannot write the document back out.** Markdoc's `format()` is byte-identical and
idempotent; MDX has no equivalent and *cannot have one*, because arbitrary JavaScript
expressions do not losslessly re-serialize to source. For a product whose entire thesis is
splice-only writing (D7, Foster et al., TOPLAS 2007, Lemma 3.9), that is disqualifying.
MDX also **deletes four CommonMark constructs in three lines** (`autolink`, `codeIndented`,
`htmlFlow`, `htmlText`) and **silently miscompiles valid CommonMark**: `the set {1,2}` renders
as `the set 2`, with no warning at any stage `[primary, §15.5]`.

---

### 5.4 Custom rendering — the mechanism

This is D8 applied to the render path: **extensibility lives in the VALUE of a field, never in
the SET of node types.** For rendering, the "field" is the fence info string and the frontmatter
vocabulary. An unknown fence language round-trips byte-perfectly; an unknown *node type* throws.

#### 5.4.1 The dispatch table

One host-owned table, keyed by fence language, consulted **before** the body reaches any
renderer. This is the artefact the research could not find anywhere in the ecosystem — the
closest existing things are `rehype-sanitize` (an element allowlist with no notion of fence
dispatch, 8,423,529 downloads/week) and mermaid's own six-key `secure` list (per-renderer,
invisible to the host, not composable across renderers) `[measured, search-only evidence of
absence — the weakest kind; see §5.12]`.

```jsonc
// render-policy.json — HOST-OWNED, versioned, never written by a document.
// Every field answers one clause of the §5.3 rule.
{
  "version": 1,
  "default": {                      // what an UNREGISTERED language gets
    "action": "degrade",            // <pre><code class="language-X">, payload byte-intact
    "configSource": "none",
    "inputSource": "none",
    "workBound": "none"
  },
  "languages": {
    "mermaid": {
      "action": "render",
      "renderer": "mermaid@11.15.0",
      "configSource": "host",       // clause (1): %%{init}%% STRIPPED before dispatch
      "stripPatterns": ["^%%\\{init[\\s\\S]*?\\}%%"],
      "inputSource": "inline-only", // clause (2): no document-named remote input
      "workBound": { "maxEdges": 500, "maxTextSize": 50000, "renderTimeoutMs": 3000 }
    },
    "math": {
      "action": "render",
      "renderer": "katex@0.17.0",
      "configSource": "host",
      "assert": { "trust": false }, // clause (1), asserted in test, not assumed
      "inputSource": "inline-only",
      "workBound": { "maxExpand": 1000 }
    },
    "dot": {                        // RECOMMENDED, not decided — see §5.2
      "action": "render",
      "renderer": "@viz-js/viz",
      "configSource": "host",
      "inputSource": "inline-only",
      "workBound": { "maxNodes": 2000, "renderTimeoutMs": 3000 }
    },
    "plantuml":  { "action": "refuse", "reason": "clause-2: include directives, GHSA-ff3m-68vj-h86p" },
    "vega-lite": { "action": "refuse", "reason": "clause-2: UrlData.url makes every spec a fetcher" },
    "mdx":       { "action": "refuse", "reason": "not a renderer: cannot write the document back out" }
  }
}
```

`action` has exactly three values and they are the whole API surface:

| `action` | what the reader sees | what the file carries |
|---|---|---|
| `render` | the diagram | unchanged bytes |
| `degrade` | `<pre><code class="language-X">` with the payload **byte-intact** | unchanged bytes |
| `refuse` | `<pre><code class="language-X">` **plus a one-line host banner naming the reason** | unchanged bytes |

**`refuse` and `degrade` produce the same document. They differ only in whether we tell the
reader why.** That is what makes this design cheap to be wrong about: refusing a language costs
readable source, never junk.

#### 5.4.2 The registration API

```ts
// src/modules/preview/domain/render-policy.ts   (NEW — does not exist yet)
export type RenderAction = "render" | "degrade" | "refuse";

export interface LanguagePolicy {
  action: RenderAction;
  renderer?: string;                       // name@exact-version — never a range
  configSource: "host" | "none";           // clause (1). "document" is not a legal value.
  stripPatterns?: readonly RegExp[];       // applied to the body BEFORE dispatch
  inputSource: "inline-only" | "none";     // clause (2). "document-fetched" is not legal.
  workBound?: Record<string, number>;      // clause (3). Absent => action must not be "render".
  assert?: Record<string, unknown>;        // asserted by a test, not at runtime
  reason?: string;                         // required when action === "refuse"
}

/** Register a renderer. Throws at REGISTRATION time, never at render time, if the
 *  policy would violate the §5.3 rule. A missing workBound on a `render` action is
 *  a registration error, not a warning. */
export function registerLanguage(lang: string, policy: LanguagePolicy): void;

/** Pure lookup. Unknown language => the `default` entry => degrade. Never throws. */
export function policyFor(lang: string): LanguagePolicy;
```

Three properties make this safe to hand to a team:

1. **It fails at registration, loudly.** Per Learned Rule #67 and §15.8 Rule 3, the gate is the
   parser/registrar, not a runtime check that can be skipped.
2. **`policyFor` never throws.** An unknown language is not an error condition; it is the
   default path, and the default path is `degrade`.
3. **There is no way to express "the document configures the renderer".** `configSource` has two
   legal values and `"document"` is not one of them. The rule is enforced by the type, not by
   review.

#### 5.4.3 The fallback, and what a non-participating renderer shows

| tool | what it shows for an unregistered ```` ```dot ```` fence |
|---|---|
| frontmatter with `dot` registered | the rendered graph |
| frontmatter with `dot` unregistered | `<pre><code class="language-dot">` — payload byte-intact |
| GitHub blob / comment | syntax-highlighted source (or plain, if unrecognised) |
| GitHub API `POST /markdown` | `<div class="highlight highlight-source-dot">` |
| Obsidian / VS Code / Zed | a code block |
| Quarto | a code block — Quarto needs `{dot}`, braced, and **`dot` ≠ `{dot}`** |
| prettier 3.8.3 | **does not reformat an unknown-language body**; it *does* rewrite a known-language body (`const a=1;` → `const a = 1;`), which invalidates any content hash committed to that block `[measured]` |

**That last row is a real design constraint, not trivia.** If we ever hash a fence body, the
hash is stable for unknown languages and unstable for known ones.

#### 5.4.4 The defect that blocks this today — FIX BEFORE ANY SECOND LANGUAGE

`src/modules/preview/presentation/markdown/components.tsx:133` extracts the language with
`/language-(\w+)/`. **`\w` excludes `-`.** Therefore:

```
class="language-vega-lite"  -> captures "vega"     WRONG
class="language-latex-tikz" -> captures "latex"    WRONG
class="language-fm-meta"    -> captures "fm"       WRONG
```

remark itself emits the full `language-vega-lite` class — verified — so **the defect is
entirely in the consumer regex** `[measured, verifier ND2]`. Every hyphenated language collides
with its prefix. The dispatch table above is unimplementable until this is
`/language-([\w.:-]+)/` or equivalent. It is a one-character-class fix and it is a
**prerequisite**, not a nice-to-have.

---

### 5.5 Custom formatting — how the visual layer works without shipping appearance

#### 5.5.1 The hard constraint, measured and corrected

The brief states it as: *GitHub strips class, style and data-\*; only `id` survives, namespaced
AND lowercased in gfm mode.* **That is right in substance and incomplete in two ways that change
design decisions** `[measured, final-gate/hold-more C4, CONFIRMED — all six responses
byte-identical]`:

| attribute | `POST /markdown` `mode=gfm` | `mode=markdown` | note |
|---|---|---|---|
| `id` | `id="user-content-payload7q"` — prefixed **and LOWERCASED** | `id="user-content-PAYLOAD7Q"` — prefixed, **case PRESERVED** | **Any case-sensitive identifier (base64url, nanoid, ULID) COLLAPSES when a document passes through the comment box.** |
| `title` | **survives with its value intact** on `<span>` and `<a>` | survives | A second surviving attribute nobody had recorded |
| `class` | stripped | stripped | |
| `style` | stripped | stripped | |
| `data-*` | stripped | stripped | |

Independently re-verified against **GitHub production** (not just the API):
`<div id="x" class="c" style="color:red" data-k="v">hi</div>` → `<div id="user-content-x">hi</div>`
`[measured, capability-run/degradation-certificate verifier]`.

> **THE LAW:** **YOU CAN SHIP STRUCTURE. YOU CAN NEVER SHIP APPEARANCE.**
> A `.md` that carries appearance is a `.md` that renders differently everywhere, which is the
> exact failure this product exists to eliminate.

#### 5.5.2 How frontmatter renders richly anyway

The file carries **structure and names**. The host carries **appearance**. Three layers, in
strict order:

1. **Structure in the markdown.** Headings, lists, tables, fences, blockquotes, task items,
   GFM alerts — all standard, all already portable. Nothing custom.
2. **Names in the frontmatter, per D9 (a document NAMES a capability, never CARRIES one).**
   A document may say `theme: technical-note` or `mdmax: { integrity: strict }`. It may **never**
   say `--accent: #1a5cff`. The name is a lookup key into a host-owned stylesheet; if the host
   does not know the name, the document renders in the default theme and loses nothing but
   polish.
3. **Appearance in the host stylesheet, keyed on structure and on the theme name.** All of it
   lives in our CSS. None of it lives in the file. This is also why frontmatter's own preview
   can look far better than GitHub's without the file becoming non-portable: we are styling
   `.markdown-body h2`, not `#user-content-whatever`.

**The `title`-attribute finding gives us one extra, legitimate channel** — a tooltip-bearing
`<span title="…">` survives GitHub's sanitizer intact and is byte-stable through remark +
prettier. Use it for **link-scoped facts only**, never for block identity: it is
availability-bound (1,838 links against 142,802 paragraphs in the pinned corpus) and it is
dropped entirely by `remark-rehype` without `rehype-raw` `[measured, hold-more Tier 2]`.

#### 5.5.3 Our own renderer's formatting policy — measured at HEAD `1bd4dad`, and it disagrees with the research

I read the source directly this session. **The research says 62 allowed elements and 13
denied; I count 61 and 12.** The integrity area's verifier also counted 61. **My measurement
governs** — it is first-hand, at a named commit, and independently corroborated:

```
src/modules/preview/presentation/markdown/html-policy.ts
  DISALLOWED_RAW_HTML_ELEMENTS  = 12   base, button, embed, form, iframe, link, meta,
                                       object, script, select, style, textarea
                                       -> children.splice(i, 1)   SILENTLY DELETED
  SAFE_HTML_ELEMENTS            = 61   a abbr b blockquote br caption cite code col colgroup
                                       dd del details dfn div dl dt em figcaption figure
                                       h1-h6 hr i img input ins kbd li mark ol p pre q rp rt
                                       ruby s samp section small span strong sub summary sup
                                       table tbody td tfoot th thead time tr u ul var
  everything else               ->     replaced by a TEXT node carrying the literal source
                                       (html-policy.ts:183-186)   VISIBLE RAW MARKUP
```

**Two different refusal behaviours, and nobody documented the split.** The practical
consequences:

- `<video>`, `<audio>`, `<canvas>`, `<picture>`, `<progress>`, `<meter>` and — most awkwardly —
  **inline `<svg>`** all appear to the reader as raw markup, e.g.
  `<p>&#x3C;svg viewBox="0 0 24 24">&#x3C;path d="M1 1h2"/>&#x3C;/svg></p>` `[measured]`.
  Our own house icon standard mandates inline SVG; **our own renderer cannot render it.**
- `bdi`, `bdo` and `wbr` are absent from the 61 `[measured, this session]`, which matters because
  they are the standard remedy for bidirectional-text problems.
- **We are already stricter than GitHub at the markdown layer.** GitHub's cmark-gfm ships a
  **nine-tag blocklist** (`extensions/tagfilter.c:5-8`, verbatim: `static const char *blacklist[] = { "title", "textarea", "style", "xmp", "iframe", "noembed", "noframes", "script", "plaintext", NULL, };`)
  `[primary]`. We ship a 61-element allowlist plus a 12-element hard deny. Integrators enable raw
  HTML more often than they sanitize it, by **1.70:1** (`rehype-raw` 14,287,197/wk vs
  `rehype-sanitize` 8,423,529/wk) `[primary]` — so a host-owned allowlist is a genuine
  differentiator.

#### 5.5.4 Two live defects in our formatting layer

**(a) The `style` ATTRIBUTE is not filtered at all — only the `style` ELEMENT is.**
`sanitizeProperties` (`html-policy.ts:145-164`) deletes keys beginning `on` and unsafe URL
schemes for a fixed `URL_ATTRS` set (`href, src, xlink:href, action, formaction, poster,
background, ping, cite, data`). **`style` is in neither set.** So
`<div style="position:fixed;inset:0;background:url(https://tracker.example/p.gif)">` passes
through intact `[measured]`. This is a **rendering-integrity** hole, not a script hole: a shared
document can beacon on open (a read receipt) and can cover the rendered page with a
full-viewport layer — the document renders one thing and looks like another, using only allowed
markup.

> **Correction to the research, found this session.** The integrity area claims
> *"test/preview/html-policy-xss.test.ts (327 lines) has zero coverage of style/hidden/bidi/
> zero-width."* **That is wrong on `style`.** The file (328 lines by my count) contains two
> explicitly named tests — **F-2 "passes the style attribute through untouched (overlay
> phishing)"** and **F-2b "style attribute can beacon the reader's IP via background url()"** —
> which assert the *current* behaviour with a comment explaining it is deliberate and
> unaddressed. The claim is correct on `hidden` (0 occurrences), bidi (`202e`: 0) and
> zero-width (`200b`: 0) `[measured, this session]`. **This is documented, tested, known
> behaviour, not an undiscovered bug** — which changes the fix from "we missed it" to "we decided
> not to, and now we are deciding again."

**Blast radius, measured, and it is zero today:** across a 4,823-file / 91,394,509-byte corpus,
**0 of 24,063 raw-HTML AST nodes carry `style=` or `hidden=`** `[measured,
capability-run/integrity verifier]`. So this is a latent hole, correctly prioritised below the
write-back defect in §5.9.

**(b) The sanitizer is not the last stage of its own pipeline.**
`src/modules/preview/presentation/Markdown.tsx` sets the rehype chain as
`rehypeRaw → createRehypeHtmlPolicy(content) → rehypeKatex → rehypeHighlight → rehypeSlug`
(the `useMemo` spans lines 53–62; the five plugin entries are lines 55–59 — the research cites
both ranges and both are correct at different granularity). **Anything KaTeX or the highlighter
injects is never seen by the policy.** The observable consequence: an author-written `<math>`
element is escaped to visible source text, while KaTeX's generated `<math xmlns=…>` renders —
**the same element, two verdicts, decided purely by plugin order** `[measured]`.

> **DO NOT "FIX" THIS THE OBVIOUS WAY.** The research's own design item (3) — "move the policy
> to the end of the chain" — is **self-destructive as written** `[verifier ND1, serious]`.
> `scrubHtmlNode` replaces any element not in the 61-element set with a TEXT node, and KaTeX
> 0.17.0 emits `math, semantics, mrow, msup, mfrac, mi, mn, annotation` — **none of which are in
> that set** — plus ~13 inline `style=` attributes per expression carrying its entire layout.
> Running the policy last would **text-ify every MathML node**; worse, KaTeX-generated nodes have
> no `position`, so `literalSourceForNode` returns `undefined` and the fallback emits
> `<math>…</math>` as escaped literal junk. **The reorder and the `style` filter must BOTH be
> preceded by (i) allowlisting the MathML element set and (ii) exempting KaTeX-generated spans
> from the style filter, or math rendering breaks outright.**

---

### 5.6 Custom parsing — the pass pipeline and where a recogniser hooks in

#### 5.6.1 The passes

MDMAX's compiler is a pass pipeline over the source bytes. Rendering consumes passes 1–3 and 7;
it never mutates them.

| pass | name | what it does | rendering's relationship to it |
|---|---|---|---|
| 1 | **parse** | source bytes → mdast, via micromark/remark. Byte offsets preserved on every node. | reads |
| 2 | **identify** | assigns a durable, content-derived anchor to every block | reads (the render policy reports per-block) |
| 3 | **interface** | extracts the document's public surface — headings, links, tags, frontmatter keys | reads (feeds the right rail, §5.10) |
| — | **RECOGNISE** | **the hook.** Pure, additive, read-only tree decoration. **No bytes are written.** | **this is where custom parsing lives** |
| 4 | **resolve** | resolves links and wikilinks against the project | reads |
| 6 | **check** | diagnostics, on the E/W/I confidence ladder (`docs/engine/PLAN.md` §4) | reads |
| 7 | **project** | emits a projection: rendered HTML, PDF, the machine view | **this is rendering** |

#### 5.6.2 Why recognisers beat new syntax

**Section 4 of this plan reaches the same conclusion from the carrier side: the honest top-5 is
ONE new carrier plus FOUR recognisers.** The rendering evidence is independent and agrees:

- A recogniser's **degradation is exactly what the construct does today in every renderer,
  because nothing changed.** That is a zero-risk deployment with the largest coverage available.
- New block or inline syntax is **visible literal junk on GitHub** in every proposal tested —
  `{#id}` leaks its literal text into the rendered heading in **21 of 24** engine configurations
  (only kramdown ×2 and pulldown-cmark with `ENABLE_HEADING_ATTRIBUTES` consume it)
  `[measured, 24-config bench; reproduced exactly at 21/24 by the verifier]`.
- And the strain that is largest in the corpus is precisely the one where adding syntax is most
  clearly wrong: `Term` newline `: definition` renders as `<p>Term<br>: definition</p>` on GitHub
  blob **and** comment while rendering as a real `<dl>` on GitHub Pages, because kramdown
  implements it. **Shipping it makes the same file correct on one GitHub surface and broken on
  another — the (product, surface) problem, self-inflicted** `[measured]`.

#### 5.6.3 The four recognisers, with their measured coverage

All four are **read-only tree decoration**. None writes a byte. All four render exactly as they
render today in every other tool.

| # | recogniser | what it lifts into the tree | measured coverage in the pinned corpus |
|---|---|---|---|
| R1 | **description list** | `- **Term** — definition` → a `descriptionList` node | **7,938 unambiguous** instances (18,462 including the weaker bold-run form). Verifier's AST-native re-derivation is **higher**: 19,402 bold-open list items (21.94%) and 8,044 with a separator, across 539 files |
| R2 | **placeholder / metavariable** | bare angle-bracket tokens that are not valid HTML5 elements, or that are but read as metavariables | **1,431 tokens, 186 distinct names, in 219 of 1,084 files (20.2%)**. Verifier reproduced 1,418–1,431 in 201–219 files |
| R3 | **inline-code role** | classify `inlineCode` spans into filepath / command / identifier / cli-flag / constant / prose | **76,118 spans** doing ≥13 jobs (exact; the 13-bucket breakdown sums to 77,516) |
| R4 | **typed relation** | resolve `[[wikilink]]` against the project, with a certificate line | **13,028 wikilinks in 501 files**, rendering as literal visible junk on GitHub |

**R2 is the highest-severity finding in the whole corpus and the cheapest fix in the report.**
GitHub *deletes* these tokens from rendered output, and there are three distinct failure modes in
the same document, with no renderer agreeing with another `[measured, GitHub API mode=gfm]`:

```
IN : Run the tool with `--flag` on <target-file> and then <name> is bound.
OUT: <p>Run the tool with <code class="notranslate">--flag</code> on  and then  is bound.</p>
                                                                   ^^ both placeholders GONE

IN : Filed <C> new issue<s>, added <E> comment<s> on existing issues.
OUT: <p>Filed  new issue<s>, added  comment<s> on existing issues.</s></s></p>
                                                                   ^^ <s> opened a strikethrough
                                                                      GitHub auto-closes at the
                                                                      paragraph end — ACTIVE MARKUP

IN : Set <title> and <base> before the run.
OUT: <p>Set &lt;title&gt; and  before the run.</p>
          ^^ <title> ESCAPED, <base> DELETED — two verdicts, one line

Collision counts in the pinned corpus:  <base> 66 · <title> 32 · <source> 20 · <s> 4
```

The remediation is verified and requires no new syntax:
`` `<target-file>` `` → `<code>&lt;target-file&gt;</code>` (preserved); `\<target-file\>` →
`&lt;target-file&gt;` (preserved). **R2 is a warning plus a one-click fix, not a construct.**

#### 5.6.4 The five constraints on custom parsing that survive

From `docs/engine/PLAN.md` §15.4, all verified:

1. **The fence body is opaque to every markdown tool.** A link inside a fence does not appear in
   the mdast link inventory; frontmatter inside a fence produces no `yaml` node. No link
   checking, no backlinks, no search indexing, no rename propagation. **Every fence is a hole in
   the graph a linker is trying to build.**
2. **`node.data` never reaches disk.** Confirmed empirically and by zero `.data` hits in
   `mdast-util-to-markdown/lib/`. **Metadata must be syntax or sidecar — it cannot ride on a
   node.**
3. **Two parsers, forever.** micromark for the compiler, Lezer for CodeMirror. Every construct
   needs a shared conformance fixture run against both.
4. **Silent-disable failure modes.** Four spaces of indentation, or one backtick inside a
   backtick-fence info string, disables dispatch **with no error anywhere**.
5. **The info-string meta dies at HTML serialization** — mdast keeps it, hast keeps it in a
   non-standard side channel, HTML emits only `class="language-x"`.

> **A CONTRADICTION, NAMED.** Constraint 5 (`docs/engine/PLAN.md` §15.4) says HTML emits only the
> class. The hold-more research measured that **GitHub's renderer emits BOTH `lang="fm:meta"` and
> `data-meta="v1"`** into its sanitized HTML for an *unknown* language, dropping the meta and
> re-tokenising for a *known* one `[measured, CONFIRMED]`. **Both are true and neither governs the
> other — they are different surfaces.** §15.4 governs *our* remark/rehype pipeline. The hold-more
> measurement governs *GitHub*. This is a textbook `(product, surface)` fact and it belongs in the
> certificate, not in a footnote. Do not write "the meta is always dropped"; write "the meta is
> dropped by remark-rehype and preserved by GitHub for unknown languages."

**Cost of a construct, for calibration:** a full `==highlight==` inline construct — absent from
CommonMark and GFM, not expressible as a directive — was built end to end in **139 lines**
compiler-side plus **14 lines** for CodeMirror's Lezer parser = **153 total**, with 13/13
round-trip cases stable `[measured, §15.3]`. And `remark-directive` (3,176,157 downloads/week)
already ships `:::name{k=v}` with a full attribute grammar and lossless round trip — ~1,945 lines
you do not write. **The cost of a construct is not the reason to avoid one. The reason is
degradation.**

---

### 5.7 The artifact question — a block that renders to a downloadable PDF or image

The founder raised this directly. Here is the contract, in four clauses.

> **THE ARTIFACT CONTRACT**
> 1. **The round trip is SOURCE-TO-SOURCE, never artifact-to-source.** We parse `.md` → tree,
>    and we write `.md` → `.md` by splice. We never parse a PDF, an SVG, a PNG or rendered HTML
>    and write markdown from it.
> 2. **Projections are never stored.** Not in the file, not in a sidecar, not in a cache that
>    anything reads as truth.
> 3. **The artifact is regenerated on every request**, from the source bytes plus the pinned
>    render policy.
> 4. **Every artifact carries a RECEIPT.**

Clauses 1–3 are already honoured by shipping code, and that is worth stating plainly:
`src/app/api/export/pdf/[...path]/route.ts` builds the HTML, renders it headless, and returns
the bytes in the `Response`. **Nothing is written to disk** `[primary, confirmed by the
verifier]`.

**Clause 4 is the one the prior research missed, and it is the reason the contract needs a
fourth clause at all.** The projection is **non-deterministic**:

```
src/app/api/export/pdf/[...path]/route.ts:150-157      [primary, verbatim]
  // Give the mermaid CDN module time to download and render diagrams.
  await new Promise<void>((resolve) => setTimeout(resolve, 2000));
  const pdfBytes = await page.pdf({ format: "A4", printBackground: true, … });
```

A fixed 2,000 ms sleep, then snapshot whatever exists. **There is no failure if a diagram did
not render, no version receipt, and no float pin.** Combined with the unpinned
`mermaid@11` CDN import at `pdf-doc.ts:134` (while the preview is lockfile-pinned to 11.15.0 and
the registry's `latest` is 11.16.0), the same document can produce different PDFs on two
consecutive days. **"We never store it" does not fix that — it makes it worse, because you
cannot even diff two runs to notice.** Note that `pdf-doc.ts:24` pins `KATEX_VERSION = "0.17.0"`
for the stylesheet, so **the PDF path is half-pinned and the unpinned half is the renderer.**

**Quarto has already solved the artifact question, and its answer costs a browser.** Diagram
format is chosen **by target**: JavaScript for HTML, a `mermaid` code block for GFM, a
rasterized PNG (via headless Chrome) for pdf/docx/epub — *"a PNG image is created using Chrome"*
`[primary, quarto-dev/quarto-web docs/authoring/diagrams.qmd]`. It also uses **braced** info
strings, so the identical diagram needs `mermaid` for GitHub and `{mermaid}` for Quarto. **One
language, two incompatible carriers, decided by the consumer.** Quarto pins nothing about which
Chrome.

**What ships:**

```
mdmax export <file> --to pdf|png|svg|html
  1. resolve render-policy.json (version-stamped)
  2. render with LOCALLY BUNDLED renderers — no CDN import on any export path
  3. assert per-diagram render-complete; FAIL the export if any block did not render
     (replaces the setTimeout(2000))
  4. emit a receipt alongside the artifact, never inside it:
     { source_sha256, renderer: "mermaid@11.15.0", policy_sha256,
       resolved_config_sha256, output_sha256, generated_at, blocks_rendered: "14/14" }
```

The receipt is a **sidecar or an HTTP header, never a byte written into the `.md`** — §15.7's
manifest rule and D2 both forbid the alternative. This artefact — *{source sha256, renderer
name + exact version, resolved config sha256, output sha256, plus an explicit did-every-block-render
assertion}* — is one of the four things the research searched for and could not find anywhere in
the ecosystem.

---

### 5.8 Dual rendering — the human view and the machine view

#### 5.8.1 The law

> **Any channel that nobody can compare against the thing it describes decays to one of three
> states: absent, a filename, or a lie.**

**The evidence for this law, stated at its true strength — which is weaker than the brief
states it.**

- **`[measured, own corpus, underpowered]`** Of 21 markdown images in the pinned corpus,
  **ZERO carry alt text of three or more words**: 4 empty (19.0%), 6 equal to the filename
  (28.6%), 11 under three words (52.4%). All 11 raw `<img>` tags carry **no `alt` attribute at
  all**. That is **32 of 32 degenerate**. The direction is unambiguous; **n is 21 and 11. Do not
  publish 100% as a rate.**
- **`[secondary]`** *"WebAIM Million 2026 found pages USING ARIA average MORE errors than pages
  without."* Quoted from the capability run's provenance-boundary journal entry. **We did not
  fetch WebAIM.** Treat as secondary until re-derived.
- **`[secondary]`** *"PDF/UA, where 136 failure conditions and 47 conceded to human judgment
  produced 53.1% tagged-with-errors."* Same journal entry, same tier.
- **`[UNSOURCED — DO NOT USE]`** The figures **"PDF 9.5% fully accessible"** and **"85% of TAGGED
  files defective"** appear in the brief for this section but **could not be located in any
  source read for it** — not in the two research result JSONs, not in their journals, not in
  `docs/engine/PLAN.md`. Per the corpus's own known failure mode (seven irreproducible counts
  reported before the corpus was pinned), **these two numbers are suspect and must not be
  repeated until someone re-derives them with a citation.** The law does not need them: 32/32
  and 53.1% carry it.

**Our own repo supplies the sharpest instance of the law.** `docs/engine/PLAN.md` §17.7:
axe-core 4.12.1, run over 2,286 real vault files through this repo's actual pipeline onto its
actual publish surface, **fired 7 of its 105 rules**, and **98.5% of 11,695 violation nodes
trace to two root causes in page chrome**. Every *content-level* markdown defect produced
**zero** violations — not because they are absent, but because `![](x)` compiles to `alt=""`,
which is **valid**: it asserts *decorative*. **Missing and decorative are the same bytes. A
green axe report on markdown is a false green.**

#### 5.8.2 What is safe and what rots

| channel | safe or rots | why |
|---|---|---|
| **Rendered HTML for humans** | **safe** | continuously compared — the author looks at it |
| **The `.md` source** | **safe** | it *is* the document; D6 |
| **A projection regenerated on view** (§5.7) | **safe** | cannot drift from its source by construction |
| **alt text** | **rots** | nobody sees it; 32/32 degenerate in our corpus |
| **`aria-*` attributes** | **rots** | WebAIM: pages using ARIA average *more* errors `[secondary]` |
| **PDF tagging** | **rots** | 53.1% tagged-with-errors `[secondary]` |
| **`llms.txt` and any AI-only sidecar** | **rots** | same mechanism: the author never sees the second rendering |
| **A stored machine view** | **would rot** | which is exactly why we never store one |

#### 5.8.3 The mitigation: one keystroke, two panes, never one rendering

**The tool's non-negotiable invariant is: NEVER SHOW ONE RENDERING.** Divergence is only stable
while exactly one rendering is displayed. Two panes or it does not ship.

```
mdmax explain FILE --as <consumer>
```

A **differ**, not a linter. It emits the exact byte string a named consumer delivers to a model,
plus the delta against what a human sees. Four channel classes and only four:

- **HIDDEN** — in MACHINE, not in HUMAN (frontmatter, comments, link destinations, HTML
  attributes, invisibles).
- **LOST** — in HUMAN, not in MACHINE (images, indentation a RAG hop stripped, lines past a cap).
- **ADDED** — in neither the file nor the render (line numbers, pack preambles, fence wrappers).
- **RESHAPED** — same content, different segmentation.

**Consumer profiles are pure functions `bytes -> delivered string`**: `human` (the rendered
baseline, the only non-machine profile), `claude-code`/`read-tool`, `repomix`, `gitingest`,
`rag:langchain-header`, `rag:recursive-char`, `mcp-resource`, `http`, `chat-paste`.

**`--emit` is what makes it verifiable**: it prints the literal delivered bytes to stdout, so you
can pipe MDMAX's prediction into `diff` against the real tool's output — which is how a user can
prove us wrong.

#### 5.8.4 The numbers in the machine-view research, at their VERIFIED strength

This area's headline had **no verifier verdict recorded**, and the capability run it belongs to
had a **100% headline defect rate** — every headline refuted by its own verifier, always in the
flattering direction. Use only the per-claim verdicts:

| claim | verdict | what to actually say |
|---|---|---|
| Read-tool line numbering costs **+14.991%** tokens over the file's own bytes | **CONFIRMED** — reproduced to the digit (n=1984, 888,223 lines, rawTok 11,894,041 → lnTok 13,677,024, bytesPerTok 3.877) | Quote it, with two riders: it is **format-specific** to Claude Code's unpadded `N\t` (the padded `%6d\t` variant measures **29.926%**, exactly 2×), and the measurement did **not** apply the 2,000-line cap (59 files, 2.974%, exceed it) |
| "hard-wrapped prose is **materially** more expensive to an agent" | **REFUTED** | measured **1.0–1.3%**, an order of magnitude below the headline it was attached to. **Drop "materially."** |
| "and no tool surfaces this" | **REFUTED** | Claude Code ships `/context` — *"Visualize current context usage as a colored grid…"* `[primary]`. The defensible claim is narrower: **no tool attributes the surcharge to the line-number prefix or lets you diff it against the file's own bytes.** |
| "**2.924%** of tokens a model receives are invisible in the rendered document" | **OVERSTATED, 4.7×** | arithmetic reproduces exactly, semantics fail for 94.7% of the total: 61.59% of "hidden" link-destination tokens belong to links whose visible label **is** the destination, and frontmatter visibility is renderer-dependent. **The honest number is ~0.626%.** |
| "~200× larger than the Unicode-injection channel" | **REFUTED** | no derivation; the same numbers give **28,989×**. Either say 28,989× or delete the comparison. |
| naive invisible-character detector "fires on 4.94% of files with a **0% true-positive rate**" | **REFUTED as stated** | counts replicate (114/2308 = 4.9393%, 375 occurrences, 0 malicious) but **TPR is undefined on a corpus with zero known positives**, and the corpus is self-authored — the wrong population for an injection detector. **Say: "375 fires, 0 malicious, on a 2,308-file self-authored corpus with a zero base rate — this bounds nuisance volume, not detector precision."** |
| LangChain's markdown splitter destroys indentation on **34.61%** of fenced-code lines and deletes the Unicode Tag block | **NOT VERIFIED** — headline only | Label `[unverified]` until re-derived. |
| `.md` twin vs HTML = **17× bytes**; editing block 92 of `docs/engine/README.md` discards **54%** of the cached prefix | **NOT VERIFIED** — headline only | Label `[unverified]`. |

**The invisible-character UI, corrected.** Not a red badge. A **neutral, always-on chip**
rendering every invisible codepoint inline (`⟨ZWNJ⟩`), in three tiers: **expected** (variation
selector after an emoji or keycap base; ZWJ/ZWNJ within 2 codepoints of a complex-script
character; BOM at offset 0) rendered grey and uncounted; **unusual** (invisible inside a run of
pure Basic Latin) rendered amber; **never-legitimate** (the Unicode Tag block U+E0000–E007F,
bidi overrides U+202A–202E and U+2066–2069) rendered red, decoded to plaintext, **and this tier
alone may fail CI**. Measured cost of the middle tier: **11 of 4,823 files (0.228%)**. HTML
comments stay silent and counted — **909 occurrences in 457 files = 9.475%**; anything that fires
on one file in ten is a nag, not a signal. **Injection detection is not phrasing-based.** The
tool's honest claim is *"here is everything present that you cannot see"*, never *"this is an
attack."*

---

### 5.9 Interactivity without a runtime — exactly what writes back

#### 5.9.1 The write-back allowlist, closed by construction

> **Only two things may write to the file from the rendered view. Both are byte-range splices.
> Everything else is client-side view state that never touches disk.**

| affordance | writes to the `.md`? | mechanism |
|---|---|---|
| **Task checkbox** `- [ ]` ↔ `- [x]` | **YES** | single-line in-place replacement — a genuine splice (`src/modules/editor/presentation/toolbar-transforms.ts:112-124`) |
| **Frontmatter property edit** | **YES, after the fix in §5.9.2** | byte-range splice over the YAML scalar |
| `<details>` open/closed | no | client state |
| Tabs | no | client state |
| Sortable table column order | no | client state |
| Collapsed sections / outline fold | no | client state |
| Semantic-zoom level, pan, selection | no | client state |
| Diagram pan/zoom | no | client state |
| **Table cell edit** | **NO — DELETED, not fixed** | see §5.9.3 |
| Any form input | no | `form`, `button`, `select`, `textarea` are in the 12-element hard deny |

#### 5.9.2 The write-back defect — THIS IS THE HIGHEST-PRIORITY ITEM IN THE SECTION

**frontmatter's only wired rendered-editing surface is not byte-faithful.**

```
A NO-OP round trip: parseFrontmatter -> stringifyFrontmatterDoc, NO EDIT MADE
corpus_id sha256:3a010b16…                       [measured; CONFIRMED by independent re-implementation]

  files with an editable frontmatter map ......... 737
  files CHANGED by the no-op round trip .......... 623   = 84.5%
  total |byte delta| ............................. 46,732
  taxonomy:  YAML respaced, same line count ...... 421     tags: [daily] -> tags: [ daily ]
             YAML REFLOWED, line count changes ... 197
             separator/body only ................. 5
                                                   ---
                                                   623   (421+197+5 = 623, checks)

  VERIFIER CORRECTION, ANTI-FLATTERING: the researcher UNDERSTATED it.
  "moves line numbers in 26.7%" counts only YAML-block reflow (197/737).
  The WHOLE-FILE line count changes in 226/737 = 30.7%, because
  stringifyFrontmatterDoc also normalizes the separator to `---\n\n${body}`,
  shifting lines in 29 further files.
```

**It is wired, not dead code.** `src/modules/editor/presentation/EditorPane.tsx:647` renders
`<PropertiesPanel content={previewSource} onEdit={handleEdit} />` with **no feature flag**;
`handleEdit` (`EditorPane.tsx:498-502`) calls `setContent(path, newContent)` + `setDirty(path, true)`
+ `saveDraft(...)`; the emitter is `PropertiesPanel.tsx:79`
`onEdit(stringifyFrontmatterDoc(parsed.doc, parsed.body))`, reached from
`setValue`/`renameKey`/`removeKey`/`addProperty`. The serializer is
`src/modules/preview/presentation/frontmatter.ts:46`:
`export function stringifyFrontmatterDoc(doc: Document, body: string): string { const yaml = doc.toString()…`

**This is the exact defect this plan cites as an EXTERNAL cautionary tale, reproduced
internally.** `docs/mdmax/PLAN.md` §4.2 (line 121), verbatim: *"DesktopCommanderMCP issue #440
(2026): an AI tool added a rich-text model and began silently rewriting users' `.md` — YAML
collapsed to single lines, `[x]` → `\[x]`, blank lines stripped — **and it fired on read-only
operations.**"* **Our properties panel does the YAML half of that, at 84.5%, in shipping code,
reached through the RENDERED view.**

**THE FIX, verified feasible:** replace `stringifyFrontmatterDoc` with a range splice. The
`yaml` package (2.9.0, already a dependency) exposes `node.range` on every AST node. For
`title: A\ntags: [daily]\nn: 3\n` the verifier obtained `tags -> val.range [15,22,23]` and
`src.slice(15,22)` returned exactly `"[daily]"`. **Compute the edited scalar's byte range and
replace only that range in the original source. Never call `doc.toString()`.**

> **GATE — and this one should stop the team.** The no-op round trip must dirty **0 of 737**
> files, down from 623. **If a splice cannot get there, the properties panel must be made
> READ-ONLY before comments ship, not after.** At 84.5% dirty and 30.7% of files changing line
> count, the panel is currently incompatible with **both** D7 (splice-only) **and** durable block
> identity — you cannot anchor a comment in a document whose line count moves when someone edits
> a tag.

#### 5.9.3 The table writer — delete it, do not fix it

`setTableCell` re-serializes the whole table. Editing one cell rewrote 3 of 5 lines of an aligned
table, **corrupted a cell containing an escaped `\|` into two cells destroying content**, and
added pipes to a pipe-less table:

```
IN : "| Cmd | Meaning |\n| --- | --- |\n| a \\| b | alternation |\n"
OUT: "| Cmd | Meaning |\n| --- | --- |\n| a \\ | X | alternation |\n"        [measured]

Over the corpus, a NO-OP cell write (writing the same value back):
  45 of 335 table-bearing files dirtied = 13.4%, touching 199 lines
  7 corpus tables contain `\|`
  92 of 1,240 detected "tables" (7.4%, 36 files) START INSIDE a fenced code block
    — the detector is FENCE-BLIND
```

> **NEGATIVE, from the researcher's own pre-registered falsifier, and it fired.**
> **`EditableTable` is DEAD CODE.** `grep -rn "EditableTable" src/ | grep -v editable-table.tsx`
> returns **empty** (I re-ran it this session: **0 hits**), and
> `src/modules/preview/presentation/markdown/components.tsx:36` declares its callback as unused
> `_onEdit`. **Anyone quoting 13.4% as a live defect is wrong.** It is a **specification for what
> not to build**. **DO NOT PROCEED PAST THE NEXT PHASE WITH `EditableTable` IN THE TREE** — it is
> dead code today, which is the only reason its no-op dirty rate and its `\|` corruption are not
> already a live data-loss bug.

#### 5.9.4 The checkbox is a splice, with one qualification the design must state

`toggleTaskAtLine` (`toolbar-transforms.ts:112-124`) is a genuine single-line splice. Two riders,
both latent:

1. **It normalizes case.** `/- \[x\]/gi` → `- [ ]`, then `- [ ]` → `- [x]` lowercase. **A double
   toggle on `- [X]` is NOT the identity.** Measured over the pinned corpus: **0 occurrences of
   `- [X]` in 0 files** (44 `- [x]` in 12 files). Latent, not live.
2. **It uses a global per-line replace**, so a line carrying a literal `- [ ]` inside inline code
   toggles too.

Both are one-line fixes. **State them; do not assert "already a true line splice" without the
qualification** `[verifier ND3]`.

---

### 5.10 The visual specification for frontmatter itself

Derived from the three wireframes the founder shared (recorded in
`HANDOFF-mdz-markdown-format-2026-07-29.md` §1.12). Reproduced here as a spec, with the
engineering consequences attached.

#### 5.10.1 Layout

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ fm logo │ menu icons │ [ coloured document tabs ] │        share │ search │ profile   │
├───────────────┬──────────────────────────────────────────────┬───────────────────────┤
│ PROJECT TREE  │            EDITOR CANVAS                     │      RIGHT RAIL       │
│               │  ┌────────────────────────────────────────┐  │                       │
│  Project      │  │ Live │ Edit │ Split │ Read │ format… ⭳ │  │  Document Outline     │
│   └ Folder    │  ├────────────────────────────────────────┤  │  Tags & Bookmarks     │
│      └ File   │  │                                        │  │  Document History     │
│               │  │             the document               │  │   (backlinks)         │
│  [f+]  [F+]   │  │                                        │  │  Comment              │
│               │  └────────────────────────────────────────┘  │  AI Edit              │
│               │  ── AI writing section (on load only) ─────   │                       │
└───────────────┴──────────────────────────────────────────────┴───────────────────────┘
```

#### 5.10.2 The four modes

| mode | what it is | rendering rule |
|---|---|---|
| **Read** | the projection only | full §5.4 dispatch. **Write-back allowlist applies (§5.9.1).** |
| **Edit** | CodeMirror 6 source only | no renderers run |
| **Split** | source and projection side by side, scroll-synced | the projection is a pure function of the source; **never the reverse** |
| **Live** | Obsidian-style live preview — the block under the cursor shows source, every other block renders | the hard one; see below |

**Live mode's governing constraint, verbatim from CodeMirror** `[primary,
docs/engine/PLAN.md §3.8]`: *"Decorations that significantly change the vertical layout… must be
provided directly, since indirect decorations are only retrieved after the viewport has been
computed."*

⇒ **inline syntax → `ViewPlugin`; block height → `StateField`.** Obsidian's shipped API confirms
the whole design: `editorLivePreviewField: StateField<boolean>` and
`livePreviewState: ViewPlugin<{mousedown: boolean}>`. **Live Preview is not a second editor —
it is one boolean on the same instance.** They track mid-click as first-class state to stop
decoration churn; two independent open implementations hit the same bug and shipped the same
guard. Four concrete rules that fall out:

- Hide markers with `max-width:0; opacity:0`, **never `display:none`**.
- Feed the same `RangeSet` to `EditorView.atomicRanges`.
- Key `WidgetType.eq()` on the **source slice**.
- Track mid-click in a `ViewPlugin` and suppress re-decoration while it is true.

**Split and Live share one invariant with §5.7:** the rendered pane is a projection. A user edit
in the rendered pane is only legal if it maps to a splice on the allowlist.

#### 5.10.3 The right rail IS the compiler's output

This is the structural observation from the handoff, and it is the reason the rail is a spec
item rather than a design flourish:

| rail panel | what it is, in compiler terms | which pass produces it |
|---|---|---|
| **Document Outline** | the symbol table | pass 3 (interface) |
| **Tags & Bookmarks** | the tag index | pass 3 |
| **Document History** (backlinks) | the reverse-reference index | pass 4 (resolve) |
| **Comment** | the annotation overlay — **sidecar, D2: nothing about comments is ever written into the `.md`** | outside the file entirely |
| **AI Edit** | a proposed splice, shown as before/after, never applied silently | pass 7 + the write gate |
| **Problems** ← **MISSING** | the diagnostics panel | pass 6 |

> **THE MISSING PANEL IS `Problems`, and without it every diagnostic the format layer produces
> has nowhere to appear.** Everything in §5.6.3 (recognisers), §5.8 (`explain`), the render
> policy's `refuse` banner and `mdmax cert` all emit findings with no home in the current
> wireframe.
>
> **But it must be a COMMAND, not a persistent panel, and the data says so.** A compiler run over
> 833 authored files found **365 true problems touching only 112 files (13.4%)** — a random note
> has an **86.6%** chance of an empty panel, and **one file held 56% of everything**. Broken
> wikilinks were **84% of raw output at 2–25% precision**, because an unresolved `[[link]]` is a
> *legitimate* authoring primitive `[measured, docs/engine/PLAN.md §4]`. **⇒ a project-level
> `check` command is earned by this data; a persistent Problems panel is not.**
>
> And the sharpest constraint on it: a `no-top-heading` check fires on **81% of files** and is
> **false at publish scope**, because the published view injects the `<h1>` from frontmatter so
> body `h2`s nest correctly. **Heading diagnostics are only sound when evaluated against the
> COMPOSED OUTLINE, never against the file** — shipping it file-scoped would emit **515 false
> warnings** and train the user to ignore the panel `[measured, §17.7]`.

#### 5.10.4 The AI Edit panel and the write gate

**Every AI write passes through the parser before touching disk.** A parse failure or a semantic
round-trip mismatch triggers repair, never a silent save `[docs/engine/PLAN.md §15.8 Rule 3]`.
Do **not** use grammar-constrained decoding: empirical coverage on complex schemas is
**Guidance 41%, llama.cpp 39%, XGrammar 28%, Outlines 3%**, and Grammar-Aligned Decoding
(NeurIPS 2024) shows naive masking *"distorts the output distribution"* — you get strings that
are grammatical and low-likelihood, i.e. valid and bad.

**The failure mode this prevents, stated precisely.** JSON fails *loudly* — a parser throws, a
retry fires. A private prose notation fails *quietly*: the model writes `~ doing` instead of
`~doing`, the renderer does not match, and **the field silently vanishes**. The document still
looks like a document. Nothing throws.

`AI Edit`, `sync` and external sync all give **before/after** — this is already the plan's rule
and it is a rendering requirement, because the "before" is a projection of the stored source and
the "after" is a projection of a *proposed* source that has not been written.

#### 5.10.5 One thing the right rail must NOT try to render

**The agent never sees an edge list.** LLMs score **18.8–23.0%** counting nodes and
**10.2–15.0%** counting edges on 5–20 node graphs; a deterministic walk pays (HippoRAG 2's
PageRank is worth **+12.5** where the LLM's contribution is **0.7 of 87.1**). **Rank offline,
ship flat.** And **do not emit a generated overview** — measured to *not* improve task success
while costing **>20% more inference** `[docs/engine/PLAN.md §3.7]`. The backlinks panel shows a
ranked flat list to the human and hands the model procedures and preserved structure, never a
graph.

---

### 5.11 What ships, in dependency order, with gates

| # | item | why it is in this position | gate |
|---|---|---|---|
| **1** | **Fix the frontmatter write-back** — range splice, never `doc.toString()` | 84.5% of files dirtied by a no-op; blocks D7 and blocks comments | no-op round trip dirties **0 of 737** |
| **2** | **Delete `EditableTable` / `setTableCell`** | dead code today, data-loss tomorrow | `grep -rn EditableTable src/` returns empty *and* the file is gone |
| **3** | **Fix the dispatch regex** `/language-(\w+)/` → `/language-([\w.:-]+)/` | every hyphenated language currently collides with its prefix | `language-vega-lite` captures `vega-lite` |
| **4** | **Ship `render-policy.json` + `registerLanguage`** | the actual deliverable of this section | `mdmax render-policy` prints the {config, inputs, bound} table for every dispatched language |
| **5** | **Strip `%%{init}%%` before mermaid dispatch; set host `maxEdges`/`maxTextSize`; assert KaTeX `trust:false`** | clauses (1) and (3) | tests fail if a document changes `fontSize` or `themeCSS` |
| **6** | **Allowlist the MathML element set, then reorder the rehype chain, then filter `style`** | in **this** order — reordering first breaks math (ND1) | math still renders; `<div style="position:fixed">` no longer passes |
| **7** | **Pin the PDF projection + emit the receipt** | bundle mermaid locally; replace `setTimeout(2000)` with a per-diagram render-complete assertion | ten renders of the same document, 24 h apart, produce **one** output sha256 |
| **8** | **`mdmax cert --render`** | per document, per fence language, per `(product, surface)`: PASS · STRIP · CORRUPT | the **first row it prints is our own product failing its own consistency check** (preview 11.15.0 vs PDF `mermaid@11`) |
| **9** | **`mdmax explain --as <consumer>`** | §5.8; two panes or it does not ship | `--emit` output is byte-identical to the real tool's output |
| **10** | **The four recognisers (R1–R4)** | read-only, zero degradation risk, largest coverage | no bytes written; render output unchanged |

**Certificate target set — fixed here because the research contradicted itself twice in four
lines** `[verifier ND4]`. The research prose said "SIX GitHub-adjacent surfaces" then listed six
of which two are not GitHub-adjacent, and its own CLI example used a *different* six. **The
governing list is:**

```
mdmax cert <file> --render \
  --targets github-blob,github-comment,github-pages,github-api,frontmatter-preview,frontmatter-pdf \
  --fail-on CORRUPT
```

Four GitHub surfaces plus our own two. `quarto-html` / `quarto-pdf` are **optional extras**, not
part of the default set. And **`github-blob` cannot be probed without pushing content** — the
blob renderer is only reachable via `GET /repos/.../contents/X.md` with
`Accept: application/vnd.github.html`. **Model `github-blob` as a DECLARED, DATED contract**
(frontmatter → table; HTML comments → deleted; `id` → `user-content-` prefixed; `class`/`style`/
`data-*` → stripped), refreshed on a schedule with a canary repo. **Never pretend it is a live
check.**

---

### 5.12 What this section does NOT cover

1. **GitLab, VitePress, HackMD, Typora, Bear, Craft and Notion import as RENDERERS.** Four are
   closed source and nothing was fetched; three simply were not measured. Their rows in §5.1.2
   are **EMPTY**, not "renders the basics".
2. **Obsidian, VS Code and Zed as RUNNING SOFTWARE.** Those rows are `[primary]` reads of docs
   and source. **None of the three was run.** A doc can lag its renderer.
3. **github-blob / github-comment / github-pages verdicts.** Only the **github-api** surface was
   measured live in the rendering research. The "GitHub is five surfaces" claim rests on one new
   measurement plus three inherited.
4. **Any exploit.** No exploit was constructed or run. Every security finding is advisory text
   plus source reading, with exactly one negative own-measurement (`dompurifyConfig` is not
   document-settable).
5. **Token cost of any projection**, beyond KaTeX's measured 123.7× byte amplification on
   `\frac{a}{b}`. **Zero live model calls were made in any research run.** Every "easier for AI"
   statement anywhere in this section is a **prediction, not a result** `[inference]`.
6. **Real-time collaborative rendering.** Multi-cursor, presence and CRDT/OT merge are out of
   scope here.
7. **The 99.627% anchoring figure**, which appears elsewhere in this plan and **has been
   re-derived by NOBODY**. It is not used in this section and must not be quoted without that
   caveat.
8. **The absolute fence census.** The 7,714 figure uses the researcher's own fence parser (open
   on three-or-more backticks/tildes at up to three spaces of indent, close on the same character
   at ≥ length, empty info). It is **not CommonMark-exact** — indented-code-block context is
   absent. **The RANKING is robust; the absolute number is not.**
9. **The "nobody has built X" claims.** They rest on `registry.npmjs.org` keyword search, whose
   `total` field is the size of the registry rather than a match count. **Search-only evidence of
   absence — the weakest kind.** GitHub code search required authentication and returned
   `"Requires authentication"` unauthenticated.

### 5.13 What would falsify this section

| # | falsifier | consequence |
|---|---|---|
| **F1** | **A conformance sweep finds fewer than 3 languages with ≥4 distinct verdicts across 7 surfaces** — i.e. the surfaces broadly agree | Degradation is not a differentiator. **Cut `mdmax cert` to a single lint rule.** (We would be surprised: github-api and github-blob already disagree on mermaid on identical bytes, measured live.) |
| **F2** | **The range splice cannot get the frontmatter no-op round trip to exactly 0 dirty files** | **STOP.** Make the properties panel read-only before comments ship. |
| **F3** | **After mermaid and math, no fourth language both (a) appears in a real user corpus and (b) passes the {host config, host inputs, host bound} test** | The renderer roadmap is over. This section's deliverable is `mdmax cert --render` + `mdmax render-policy` **and nothing else.** Our two corpora say the count today is **ZERO**. |
| **F4** | **Ten PDF renders of the same document, 24 h apart, produce one digest under the CURRENT unpinned code** | The determinism argument in §5.7 is weaker than stated; the receipt is still worth shipping but the urgency drops. |
| **F5** | **A user, when shown the machine view, does not change the document** | §5.8's mitigation does not work and the whole dual-rendering argument is decorative. **This is the only falsifier here that requires a human, and it is the most important one.** |
| **F6** | **Registering a second renderer produces a support/advisory load exceeding one engineer-day per quarter** | The policy is right and the zoo stays at two forever. |

**One meta-caveat, and it applies to every number in this section.** The 16-area final gate
returned 5 CONFIRMED, 10 OVERSTATED, 1 REFUTED; the 18-area capability run had a **100% headline
defect rate**, every headline refuted by its own verifier, always in the flattering direction.
The rendering-frontier area is one of the five CONFIRMED, and its verifier called its falsifier
discipline *"the strongest in this program"* — three pre-registered falsifiers, one survived, two
fired and were reported as findings rather than dropped. **That is why this section leans on it.**
The verifiers themselves have a measured false-kill rate of 0–19%, so **a kill is strong evidence,
not proof.** Where a kill looked wrong to me — the integrity area's claim that the XSS test file
has zero `style` coverage, when it contains two explicitly named `style` tests — **I said so in
§5.5.4 and my own measurement governs.**


---

---

### Links

**This section references:** [§1 Orientation](01-orientation.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md)

**Referenced by:** [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§6 Conventions](06-conventions.md) · [§7 Product](07-product.md) · [§8 Market](08-market.md) · [§10 Engine spec](10-engine-spec.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
