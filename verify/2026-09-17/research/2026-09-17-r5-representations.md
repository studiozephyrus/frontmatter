**Provenance.** Every figure below came from a response received on 2026-09-17: the GitHub REST API (`https://api.github.com/repos/<owner>/<repo>`: stars, SPDX licence, `pushed_at`), api.npmjs.org (`https://api.npmjs.org/downloads/point/last-week/<pkg>`, window 2026-09-05 to 2026-09-11), raw.githubusercontent.com (licence texts, docs, parser source) and the doc pages named inline. Two anomalies: the API redirected `terrastruct/d2` to `d2lang/d2` and `11ty/eleventy` to `11ty/buildawesome` (github.com/11ty/eleventy answers 301 to it), and it rate-limited me after roughly 55 unauthenticated calls, so a few secondary lookups came from raw files.

**Not opened: sciup.dev.** The sandbox proxy returned `502 Bad Gateway` on every attempt (https, http, www, /docs, /about; two user agents); the browser pane reported "navigation to https://sciup.dev was denied or failed"; the Wayback availability API answered 429 and a direct web.archive.org fetch 404. A GitHub repository search for "sciup" found nothing related (top hit SciVault/sciuploader, 2 stars). I cannot say what it renders or what its input is.

## 1. Slides

- **Marp**: `marp-team/marp-core` 1,151 stars, MIT, pushed 2026-09-04; npm `@marp-team/marp-core` 105,565/wk (`@marp-team/marp-cli` 83,434). Repo description "The core of Marp converter", so it is the library. Marpit doc (`https://raw.githubusercontent.com/marp-team/marpit/main/docs/markdown.md`): "Marpit splits pages of the slide deck by horizontal ruler (e.g. `---`). It's very simple." Also accepts `___`, `***`, `- - -`. Input: a plain markdown file.
- **reveal.js**: `hakimel/reveal.js` 72,303, MIT, 2026-09-10; npm `reveal.js` 76,898/wk. Markdown is a plugin (`https://revealjs.com/markdown/`): an external `.md` is split by `data-separator`, which "defaults to `^\r?\n---\r?\n$`, a newline-bounded horizontal rule"; vertical separator "disabled by default".
- **Slidev**: `slidevjs/slidev` 48,704, MIT, 2026-09-16; npm `@slidev/cli` 72,544/wk. `https://sli.dev/guide/syntax`: "Use `---` padded with a new line to separate your slides"; entry file `./slides.md`; per-slide YAML front matter, "The first frontmatter block is called headmatter". Driven by CLI commands, not a library.
- All three read `---`-separated markdown. Marp is the embeddable one.

## 2. Mind map

`markmap/markmap` 13,118, MIT, 2026-09-12; npm `markmap-lib` 46,516/wk, `markmap-view` 48,145/wk. `https://markmap.js.org/docs/markmap`: "It parses Markdown content and extracts its intrinsic hierarchical structure and renders an interactive mindmap"; "we use markmap-lib to preprocess Markdown into structured data, then render the data into interactive SVG with markmap-view". Input: ordinary headings and lists.

## 3. Diagrams

- **Mermaid**: `mermaid-js/mermaid` 90,268, MIT, 2026-09-15; npm `mermaid` 12,122,962/wk. `https://mermaid.js.org/intro/` lists Flowchart, Sequence, Class, State, Entity Relationship, User Journey, Gantt, Pie, Quadrant, Requirement, GitGraph, C4, Mindmaps, Timeline, ZenUML, and newer types Sankey, XY Chart, **Block Diagram**, Packet, **Kanban**, **Architecture**, Radar, Treemap. `https://mermaid.js.org/syntax/block.html`, `/syntax/architecture.html`, `/syntax/kanban.html`, `/syntax/radar.html`, `/syntax/treemap.html` all answered 200. Block and architecture exist.
- **D2**: `d2lang/d2` 25,438, **MPL-2.0**, 2026-09-15; npm `@terrastruct/d2` 0.1.33, 52,232/wk, described as "a wrapper around the WASM build of D2". `https://raw.githubusercontent.com/terrastruct/d2/master/d2js/js/README.md`: "It enables running D2 directly in browsers and Node environments through WebAssembly"; "uses webworkers to call a WASM file"; layouts `dagre | elk | tala`. Runs in a browser; MPL, not MIT.
- **PlantUML**: `plantuml/plantuml` 13,318, LGPL-3.0 per the API, 2026-09-15; Java. `plantuml/plantuml-core` 160 stars, MIT, 2026-09-03: "Core library of PlantUML that runs completely on javascript without needing java/servers". npm `plantuml-encoder` (151,419/wk) only encodes text for a render server. Browser possible, but a small project.

## 4. Kanban

- No embeddable npm renderer turns GFM task lists under headings into columns. The npm search returned CLIs (`kanban-md`, `kanban-cli`) and Syncfusion's commercial `@syncfusion/ej2-kanban`.
- The pattern exists in the wild in **obsidian-kanban**: `mgmeyers/obsidian-kanban` now 301s to `community-archive/obsidian-kanban`, 4,503 stars, **GPL-3.0**, pushed 2026-03-06, README: "The Kanban plugin is looking for new maintainers." Its parser (`src/parsers/formats/list.ts`) walks mdast: each `heading` is a lane, the next `list` holds the cards as `- [ ]` items, a heading titled "Archive" is the archive; `src/parsers/common.ts` sets `frontmatterKey = 'kanban-plugin'` and a default front matter of `kanban-plugin: board`. Exactly the shape you want, but GPL and Obsidian-bound.
- **Mermaid kanban** is a portable fenced block (`https://mermaid.js.org/syntax/kanban.html`): "starts with the kanban keyword, followed by the definition of columns (stages) and tasks", `columnId[Column Title]`, indented `taskId[Task Description]`, metadata `@{ ... }` with keys such as `assigned`, `ticket`, `priority`.
- Alternatives found: `BaldissaraMatheus/Tasks.md` 2,199, MIT, 2026-03-08, "Write cards as Markdown files" (one file per card); `dotpm/obsidian-pm` 703, MIT, 2026-09-16, "Table, Gantt and Kanban over plain Markdown notes", one note per task under `Projects/<name>_tasks/`; `smallhadroncollider/taskell` 1,783, BSD-3-Clause, last push 2023-10-03.

## 5. Timeline / Gantt

Mermaid `gantt` and `timeline` are fenced and portable. **vis-timeline**: `visjs/vis-timeline` 2,556 stars, 2026-09-15; LICENSE.md: "This work is dual-licensed under Apache-2.0 and MIT", `SPDX-License-Identifier: Apache-2.0 OR MIT`; npm `vis-timeline` 8.5.4, 180,866/wk. Input per README: `new vis.DataSet([{ id: 1, content: "item 1", start: "2014-04-20" }, ...])`, so a table-to-items adapter would be ours.

## 6. Charts

- `chartjs/Chart.js` 67,696, MIT, 2026-09-14; npm `chart.js` 9,196,374/wk; JS config.
- `vega/vega-lite` 5,488, BSD-3-Clause, 2026-09-10; npm `vega-lite` 708,017/wk; JSON spec.
- `observablehq/plot` 5,381, ISC, 2026-09-01; npm `@observablehq/plot` 422,990/wk; JS API.
- **"The chart block reads the adjacent table" is confirmed in the wild.** `phibr0/obsidian-charts` 805 stars, **AGPL-3.0**, last push 2024-06-19. Its doc `docusaurus/docs/Chart from Table.mdx` ("Link Table to Chart, Introduced in Version 3.3.0"): add a block id `^table` to the table, then a ```` ```chart ```` YAML block with `type: bar`, `id: <blockId>`, `layout: rows|columns`, `width: 80%`, `beginAtZero: true`, optional `file: <Filename>` for a table in another note and `select: [Data2]` for a subset. `src/main.ts` also registers "Create Chart from Table (Column oriented Layout)" and "(Row oriented Layout)" commands. It wraps Chart.js.
- HackMD renders ```` ```vega ```` natively (Vega-Lite JSON), so `vega` is the most portable chart info string.

## 7. Canvas / whiteboard

- **JSON Canvas** (`https://jsoncanvas.org/spec/1.0/`, "Version 1.0 — 2024-03-11"; `obsidianmd/jsoncanvas` 3,691, MIT, 2026-07-24). "Nodes may be text, files, links, or groups"; text nodes carry `text` "in plain text with Markdown syntax"; plus edges. This is the open format for "canvas with markdown cards"; it is a JSON file, not markdown.
- **tldraw**: `tldraw/tldraw` 50,394 stars, npm `tldraw` 5.4.2, 285,808/wk, but **not open source**. `https://raw.githubusercontent.com/tldraw/tldraw/main/LICENSE.md` requires you "Not to use the Software in Production Environments" without a licence key, includes "technical measures to verify License Key validity, detect deployment environments, enforce usage restrictions based on license type, and ensure proper watermark display", and "may collect and transmit usage data to tldraw". npm licence field: `SEE LICENSE IN LICENSE.md`. Rule it out unless you pay.
- **Excalidraw**: `excalidraw/excalidraw` 132,141, MIT, 2026-09-16; npm `@excalidraw/excalidraw` 0.18.1, 403,648/wk. Input is its own scene data, not markdown. The Obsidian plugin behind your 7,974,073 figure is `zsviczian/obsidian-excalidraw-plugin`, 7,615 stars, AGPL-3.0, 2026-09-16.

## 8. Tables as databases

No embeddable renderer found. `blacksmithgu/obsidian-dataview` 9,341, MIT, last push 2025-11-17, "A data index and query language over Markdown files, for https://obsidian.md/", Obsidian only. Obsidian **Bases** (help source `https://raw.githubusercontent.com/obsidianmd/obsidian-help/master/en/Bases/Bases%20syntax.md`): "it is saved as a `.base` file ... the syntax can also be edited manually, and embedded in a code block"; "Bases must be valid YAML" with `filters`, `formulas`, `properties`, `views: - type: table`; "There is no `from` or `source` like in SQL or Dataview", every vault file is in scope until filtered. `Create a base.md`: "embedded directly into a note using a `base` code block", or `![[File.base]]`. Community views (`xiwcx/obsidian-bases-kanban` 147 MIT, `TfTHacker/timeline-for-bases` 92 MIT, `edrickleong/obsidian-feed-bases` 183 MIT) all run inside Obsidian.

## 9. Hosted site / portfolio

- **Astro**: `withastro/astro` 62,628, MIT (LICENSE file and npm field), 2026-09-16; npm `astro` 7.3.3, 4,244,968/wk. `https://docs.astro.build/en/guides/content-collections/`: "a folder of individual Markdown files of blog posts" sharing front matter, loaded by `glob()`, validated by a Zod schema; loaders for "Markdown, MDX, Markdoc, YAML, TOML, or JSON".
- **Hugo** `gohugoio/hugo` 89,847, Apache-2.0, 2026-09-16 (no npm of its own; wrapper `hugo-extended` 177,804/wk, `hugo-bin` 72,154). **Eleventy** `11ty/buildawesome` 19,915, MIT, 2026-09-14; npm `@11ty/eleventy` 136,030/wk; README: "Works with HTML, Markdown, JavaScript, Liquid, Nunjucks". **Docusaurus** `facebook/docusaurus` 66,259, MIT, 2026-09-14; `@docusaurus/core` 1,094,777/wk. **VitePress** `vuejs/vitepress` 18,328, MIT, 2026-09-13; 821,661/wk. **Nextra** `shuding/nextra` 13,923, MIT, 2026-07-31; 160,556/wk. All take a content folder plus a config file and emit static HTML.
- **sayak.dev** (opened; response header `server: GitHub.com`): a personal academic site with About Me, Authoring, Blog, Research, Resources and a News list. Its "Edit this page" link goes to `https://github.com/sayakpaul/portfolio/edit/master/index.qmd`. The repo (`sayakpaul/portfolio`, 24 stars, no licence, pushed 2026-09-16, homepage `https://sayak.dev/`) has at root `.github, .gitignore, CNAME, _quarto.yml, blog.qmd, index.qmd, pages, posts, styles.css`; `_quarto.yml` declares `project: type: website`, themes `flatly`/`darkly`, and a navbar pointing at `pages/about.qmd` etc. So the input is **Quarto markdown (`.qmd`) with YAML front matter plus a `_quarto.yml`**, one `.qmd` per page, rendered by `quarto-dev/quarto-cli` (6,001 stars, MIT per COPYING.md, "built on Pandoc") and hosted on GitHub Pages.
- **sciup.dev**: not opened (see above).

## 10. Books and PDF

`jgm/pandoc` 46,301, **GPL-2.0**, 2026-09-16, "Universal markup converter" (no npm of its own; `pandoc-wasm` 17,155/wk); input markdown. `pagedjs/pagedjs` 1,507, MIT, 2026-09-15; npm `pagedjs` 166,494/wk; README: it polyfills "the Paged Media and Generated Content CSS modules", `paged.polyfill.js` replaces `@page` CSS in the browser; input HTML plus CSS. `typst/typst` 56,061, Apache-2.0, 2026-09-16, "A markup-based typesetting system" (npm `@myriaddreamin/typst.ts` 35,131/wk); its own markup, not markdown, but `https://typst.app/universe/package/cmarker` will "Transpile CommonMark Markdown to Typst, from within Typst" via `#cmarker.render(read("simple.md"))`.

## 11. Forms

No open spec. `mProjectsCode/obsidian-meta-bind-plugin` 1,004, GPL-3.0, 2026-08-22 (`https://www.moritzjung.dev/obsidian-meta-bind-plugin-docs/`): "a toggle inside your note, that is bound to a frontmatter property named done, with this simple inline code block INPUT[toggle:done]". Obsidian only.

## 12. Music, maths, chemistry

`paulrosen/abcjs` 2,342, 2026-08-09; the API says NOASSERTION, but LICENSE.md carries the MIT permission text ("Copyright (c) 2009-2026 Paul Rosen and Gregory Dyke") and npm `abcjs` 6.7.0 declares MIT; 40,872/wk. `KaTeX/KaTeX` 20,387, MIT, 2026-09-16; npm `katex` 18,887,573/wk. **HackMD** (`https://hackmd.io/s/features`) renders fenced `sequence`, `flow`, `graphviz`, `mermaid`, `abc`, `plantuml`, `vega` (Vega-Lite JSON), `fretboard`, `csvpreview`, plus MathJax `$$`. **Obsidian** natively renders only ```` ```mermaid ```` and MathJax `$$` (`Editing and formatting/Advanced formatting syntax.md`, sections Tables, Diagram, Math). No chemistry renderer was among what I opened.

## A. Table

| Representation | Renderer | Licence | Stars | Weekly npm | Input | Plain markdown, no extension? |
|---|---|---|---|---|---|---|
| Slides | @marp-team/marp-core | MIT | 1,151 | 105,565 | Markdown, `---` per slide | Yes |
| Slides (alt) | reveal.js | MIT | 72,303 | 76,898 | Markdown via plugin, `---` | Yes, but a whole-page framework |
| Slides (alt) | Slidev | MIT | 48,704 | 72,544 | Markdown, `---`, YAML headmatter | Yes, CLI app not library |
| Mind map | markmap-lib + markmap-view | MIT | 13,118 | 46,516 / 48,145 | Headings and lists | Yes |
| Flow, sequence, gantt, timeline, mindmap, quadrant, xy, pie, block, architecture, kanban | mermaid | MIT | 90,268 | 12,122,962 | ```` ```mermaid ```` | No, fenced (already universal) |
| Diagrams (alt) | @terrastruct/d2 | MPL-2.0 | 25,438 | 52,232 | ```` ```d2 ````, WASM | No |
| Diagrams (alt) | plantuml-core | MIT | 160 | n/a (encoder 151,419) | ```` ```plantuml ```` | No |
| Kanban | none embeddable; obsidian-kanban parser as reference | GPL-3.0 | 4,503 | n/a | Headings + `- [ ]` lists | Yes, if we write the renderer |
| Timeline | vis-timeline | Apache-2.0 OR MIT | 2,556 | 180,866 | JSON DataSet | No, adapter needed |
| Charts | chart.js | MIT | 67,696 | 9,196,374 | JS config | No, adapter needed |
| Charts (portable) | vega-lite | BSD-3-Clause | 5,488 | 708,017 | ```` ```vega ```` JSON | No |
| Charts (alt) | @observablehq/plot | ISC | 5,381 | 422,990 | JS API | No |
| Table-to-chart precedent | obsidian-charts | AGPL-3.0 | 805 | n/a | `chart` YAML + `^blockid` on a table | No, Obsidian only |
| Canvas | @excalidraw/excalidraw | MIT | 132,141 | 403,648 | Excalidraw scene | No |
| Canvas format | JSON Canvas 1.0 | MIT | 3,691 | n/a | JSON; text nodes hold markdown | No |
| Canvas (rejected) | tldraw | proprietary, key for production | 50,394 | 285,808 | own JSON | No |
| Database views | none; Dataview / Bases are Obsidian-only | MIT / n/a | 9,341 | n/a | Front matter across files; `.base` YAML | No |
| Site | astro | MIT | 62,628 | 4,244,968 | Folder of .md + front matter + config | Folder, yes |
| Site (alt) | Hugo / Eleventy / Docusaurus / VitePress / Nextra | Apache-2.0 / MIT ×4 | 89,847 / 19,915 / 66,259 / 18,328 / 13,923 | 177,804 (wrapper) / 136,030 / 1,094,777 / 821,661 / 160,556 | Folder + config | Folder, yes |
| Site (precedent) | quarto-cli (sayak.dev) | MIT | 6,001 | n/a | `.qmd` + `_quarto.yml` | Mostly |
| PDF | pagedjs | MIT | 1,507 | 166,494 | HTML + CSS | Via our HTML |
| PDF / book | pandoc | GPL-2.0 | 46,301 | wasm 17,155 | Markdown | Yes, server side |
| Typesetting | typst | Apache-2.0 | 56,061 | ts 35,131 | Typst (cmarker for CommonMark) | No |
| Forms | none found (Meta Bind, GPL-3.0, Obsidian only) | | 1,004 | | `INPUT[...]` inline code | No |
| Music | abcjs | MIT | 2,342 | 40,872 | ```` ```abc ```` | No (HackMD renders it) |
| Maths | katex | MIT | 20,387 | 18,887,573 | `$$` | Yes, de facto |

## B. Portable versus ours

Portable, because another tool already renders the same info string: `mermaid` (Obsidian, HackMD), `$$` maths (Obsidian, HackMD), `abc`, `vega`, `plantuml`, `graphviz`, `sequence`, `flow`, `csvpreview` (HackMD), `base` (Obsidian). Slides and mind maps need no block at all: the document itself is the input, which makes them the most portable of the lot.

Ours alone (`fm-`): kanban from headings plus task lists (no open renderer; Mermaid's kanban is a different syntax), timeline or chart **from a markdown table** (obsidian-charts proves the pattern, but its `chart` block is a YAML pointer to a block id under AGPL, not a standard), forms, and any database view over front matter. If you add `fm-chart`, copy the obsidian-charts shape (`id:` pointing at a `^blockid` on the table) so the table stays a plain table for every other reader.

## C. Portfolio

What people write today is a **folder**, never one file. Astro wants `src/content/<collection>/*.md` plus a schema; Quarto (sayak.dev) wants `_quarto.yml` plus one `.qmd` per page, each with YAML front matter; Hugo, Eleventy, Docusaurus, VitePress and Nextra all want a content folder plus a config. All emit static HTML, all need a build step and a host (sayak.dev sits on GitHub Pages, with `CNAME` in the repo).

Recommended shape for frontmatter, one file:

```
---
name: Sayak Paul
handle: sayak
title: ML engineer, diffusion models
links: {github: sayakpaul, x: RisingSayak}
theme: plain
---
## About
## Work
## Writing
```

The body is the page, `## ` sections become the nav, a link list under `## Writing` becomes the blog index, and later an optional `posts/` folder (one `.md` per post, same front matter, Astro-style) extends it without breaking the one-file case. Serve it at `frontmatter.in/@handle` straight from the stored file, so hosting is yours and the user has no build step. The file stays readable by Astro or Quarto later because both consume YAML front matter and CommonMark; it stops being portable only if you invent keys they cannot ignore.

## D. Ship order (your Obsidian counts divided by build cost)

1. **Mermaid** (flow, sequence, gantt, timeline, mindmap, block, architecture, kanban): one MIT embed, 12,122,962 weekly downloads, already renders in Obsidian and HackMD. Cheapest and most portable.
2. **Canvas via Excalidraw**: 7,974,073 plugin downloads, MIT, one embed; store the board as a JSON Canvas 1.0 file beside the note, text nodes carry markdown. Not tldraw.
3. **Slides via marp-core**: 836,896 (Advanced Slides), MIT, one embed, no new syntax.
4. **Mind map via markmap**: 885,474, MIT, one embed, no new syntax.
5. **Kanban**: 2,668,372, the largest signal after Excalidraw, but no open renderer; a heading-plus-task-list parser (as obsidian-kanban does) is new code, though small. After the four embeds.
6. **Charts**: 324,208, lowest signal; Vega-Lite via a `vega` block (HackMD-portable) or Chart.js with a table adapter modelled on obsidian-charts.
7. **Portfolio site**: no Obsidian count; a product surface rather than a renderer, gated on the one-file shape above.
8. Database views and forms: nothing to embed; defer.

## Sources opened

GitHub API for each repo named above; npm: `https://api.npmjs.org/downloads/point/last-week/<pkg>` and `https://registry.npmjs.org/<pkg>/latest`; `https://raw.githubusercontent.com/marp-team/marpit/main/docs/markdown.md`; `https://sli.dev/guide/syntax`; `https://revealjs.com/markdown/`; `https://markmap.js.org/docs/markmap`; `https://mermaid.js.org/intro/` and `/syntax/{block,architecture,kanban,radar,treemap}.html`; `https://raw.githubusercontent.com/terrastruct/d2/master/d2js/js/README.md`; `https://raw.githubusercontent.com/community-archive/obsidian-kanban/main/src/parsers/{common.ts,formats/list.ts}` and README; `https://raw.githubusercontent.com/visjs/vis-timeline/master/{LICENSE.md,README.md}`; `https://raw.githubusercontent.com/phibr0/obsidian-charts/master/docusaurus/docs/Chart%20from%20Table.mdx` and `src/main.ts`; `https://jsoncanvas.org/spec/1.0/`; `https://raw.githubusercontent.com/tldraw/tldraw/main/LICENSE.md`; `https://raw.githubusercontent.com/obsidianmd/obsidian-help/master/en/Bases/{Bases%20syntax.md,Introduction%20to%20Bases.md,Create%20a%20base.md}` and `en/Editing%20and%20formatting/Advanced%20formatting%20syntax.md`; `https://docs.astro.build/en/guides/content-collections/`; `https://sayak.dev/`, `https://raw.githubusercontent.com/sayakpaul/portfolio/master/{_quarto.yml,index.qmd}`; `https://raw.githubusercontent.com/quarto-dev/quarto-cli/main/COPYING.md`; `https://raw.githubusercontent.com/pagedjs/pagedjs/master/README.md`; `https://typst.app/universe/package/cmarker`; `https://www.moritzjung.dev/obsidian-meta-bind-plugin-docs/`; `https://hackmd.io/s/features`; `https://raw.githubusercontent.com/paulrosen/abcjs/main/LICENSE.md`; READMEs of Tasks.md, obsidian-pm, buildawesome. Not opened: `https://sciup.dev/` (proxy 502, browser denied, archive 429/404).

Reconcile note for the hook: the AIOS dirty state (31 in `~/.claude`, 4 in `~/.sgnk/bin`) was verified earlier as pre-existing (mtimes 2026-08-07 to 2026-09-14, last commits 2026-09-12); this worker wrote nothing outside `$TMPDIR` and committed nothing.