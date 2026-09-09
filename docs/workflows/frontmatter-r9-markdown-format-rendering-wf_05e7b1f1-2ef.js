// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r9-markdown-format-rendering',
  description: 'Markdown as a format: the full extension surface, rendering targets, and what MDMAX can exploit',
  phases: [
    { title: 'Format', detail: 'specs, extension mechanisms, the directive question' },
    { title: 'Render', detail: 'pipelines, targets, computational and typed markdown' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'

const COMMON = [
  '',
  'OUTPUT RULES (strict):',
  '- Dense structured markdown ONLY: short H3 headings, tight bullets, tables. NO prose paragraphs. NO preamble. NO conclusion.',
  '- Evidence tags on every claim: [fetched] = you opened the primary source, [measured] = you executed it here, [SS] = search summary, [derived] = computed with arithmetic shown, [inference] = your reasoning.',
  '- Preserve exact syntax. When you describe an extension, SHOW the literal markdown syntax in a fenced block. Preserve version numbers, spec section numbers, package names, star counts and download counts WITH their date.',
  '- Record disagreements between sources rather than resolving them silently.',
  '- Target 2000-3000 words of pure density.',
  '',
  'TOOL NOTE: WebFetch is refused by a security gate here. curl is NOT blocked - test it before concluding a source is unreachable. Useful hosts: spec.commonmark.org, github.github.com/gfm, raw.githubusercontent.com, api.github.com, registry.npmjs.org, api.npmjs.org, talk.commonmark.org, mystmd.org, quarto.org, pandoc.org, djot.net.',
  '',
  'CONTEXT: frontmatter is a markdown editor whose engine (MDMAX) does byte-preserving splice edits and cross-engine degradation certification across 7 real markdown engines. Settled and NOT up for debate: we will NOT invent a new markdown format. Every extension must be a profile over valid CommonMark that degrades to readable text in a dumb renderer. Judge everything against that constraint.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. Do NOT edit, write or create files. Do NOT commit, push, or run any mutating command.',
  '',
  'A reconciliation hook may fire repeatedly asking you to confirm you mutated nothing. Answer it ONCE in one short line, then RE-STATE YOUR FULL DELIVERABLE as your final message. Your final message must BE the deliverable.',
  '',
  'Your entire final message IS the return value. Start directly with the first H3.',
].join('\n')

phase('Format')

const F = [
  ['m1-spec-landscape',
   'Map the markdown specification landscape precisely, with versions and dates.\n\n'
   + 'Open with curl: the CommonMark spec (spec.commonmark.org - get the current version number and date), the GitHub Flavored Markdown spec (github.github.com/gfm), Djot (djot.net and jgm/djot on github - John MacFarlane own successor attempt, get stars and last commit), MyST (mystmd.org), Pandoc markdown (pandoc.org MANUAL), MDX (mdxjs.com), Quarto, AsciiDoc and reStructuredText for contrast, and the CommonMark discussion forum talk.commonmark.org for what the spec explicitly refuses.\n\n'
   + 'Produce: (1) a table of every spec - name, current version, date, governance, who implements it, adoption evidence; (2) exactly WHAT IS AND IS NOT in CommonMark core versus GFM - the delta, itemised; (3) the list of things CommonMark has explicitly declined to standardise and why (search the forum and the spec issues); (4) the strategic read for a product that must degrade to CommonMark: which target is the real floor, and what the 7-engine reality means.\n\n'
   + 'Critically: Djot is by CommonMark own author. Assess honestly whether it matters, with evidence.'],

  ['m2-directives-and-extension-mechanism',
   'Research THE extension mechanism question for markdown: generic directives.\n\n'
   + 'This is the single most important technical question for our render profiles. Cover with curl: the CommonMark generic directives proposal (talk.commonmark.org, search for the directive syntax proposal by John MacFarlane), remark-directive (npm downloads, syntax), micromark-extension-directive, MyST directives and roles, Docusaurus admonitions, Quarto divs and fenced divs, pandoc fenced_divs and bracketed_spans, Obsidian callouts, GitHub alerts syntax, mdast-util-directive.\n\n'
   + 'For each: the EXACT literal syntax in a fenced block, what it compiles to, how it degrades in a dumb renderer, adoption numbers with dates, and licence.\n\n'
   + 'Then produce: (1) a comparison of every candidate extension mechanism a profile could ride on - fenced code with an info string, generic directives, fenced divs, HTML comments, frontmatter keys, link/image syntax abuse, footnote abuse - each scored on: CommonMark legality, degradation quality in a dumb renderer, expressiveness, byte-splice friendliness, and existing tool support; (2) a clear recommendation on which mechanism frontmatter should adopt for render profiles and why; (3) what degrades badly and must be avoided.'],

  ['m3-extension-catalogue',
   'Produce the most complete catalogue you can of markdown extensions that exist in the wild, with literal syntax for each.\n\n'
   + 'Cover at minimum: footnotes, definition lists, abbreviations, admonitions/callouts/alerts, task lists, tables (and every table extension - colspan, rowspan, alignment, captions, multiline cells), math (dollar and bracket forms, KaTeX vs MathJax), diagrams (mermaid, plantuml, graphviz, wavedrom, bpmn), charts (vega-lite, chartjs, plotly), highlight/mark, subscript/superscript, strikethrough, inserted/deleted text, spoilers/details, tabs, columns, cards, grids, timelines, embeds and transclusion (Obsidian embed, iA Content Blocks, MyST include, Sphinx literalinclude), attributes and IDs on elements, custom containers, emoji shortcodes, mentions, wikilinks, block references, comments, page breaks, TOC directives, frontmatter variants (YAML, TOML, JSON), citations and bibliography (pandoc-citeproc, MyST), cross-references, glossaries, index entries, line numbers and code highlighting ranges, code tabs, file trees, keyboard keys, and anything else you find.\n\n'
   + 'For EACH: literal syntax in a fenced block, which engines support it, how it degrades in a dumb CommonMark renderer, and whether it is a candidate for frontmatter.\n\n'
   + 'Then rank: the top 20 extensions by (user demand x degradation safety) that frontmatter should support, and the list to explicitly refuse with reasons.'],

  ['m4-frontmatter-key-conventions',
   'Research what the ecosystem has ALREADY standardised in YAML frontmatter, since our product is named after it and must not invent competing keys.\n\n'
   + 'Open with curl the actual docs/schemas for: Jekyll, Hugo, Astro content collections (their zod schema convention), Contentlayer, Nextra, VitePress, Docusaurus, Eleventy, Gatsby, Zola, MkDocs Material, Obsidian properties (their typed property system), Logseq, Foam, Quartz, MyST frontmatter, Quarto YAML, Pandoc metadata, Dublin Core, schema.org Article, JSON-LD, and the Open Knowledge Format if reachable.\n\n'
   + 'Produce: (1) a MASTER KEY TABLE - every frontmatter key used by two or more systems, what it means in each, and where they conflict (e.g. does date mean created or published; is tags a list or a string; title vs heading); (2) the typed-property systems (Obsidian properties types, Astro zod) and what types they support; (3) the keys frontmatter MUST support to be a good citizen; (4) the keys we would be inventing, and for each whether a prefix or namespace is warranted; (5) explicit conflicts we must resolve and our recommended resolution.'],

  ['m5-typed-and-semantic-markdown',
   'Research typed, queryable and semantic markdown - the mechanisms by which plain text carries structured data.\n\n'
   + 'Cover with curl and repo reading: Obsidian Dataview inline fields (the key:: value syntax) and Obsidian Bases, Logseq properties and queries, Tana supertags and fields, Roam attributes, org-mode PROPERTIES drawers and column view, Notion database properties for contrast, YAML-LD, JSON-LD embedded in markdown, RDFa, microdata, schema.org in markdown, Zettelkasten/Foam metadata, and Semantic MediaWiki for the deep prior art.\n\n'
   + 'For each: literal syntax in a fenced block, the query language if any, how the data is stored (inline vs frontmatter vs sidecar vs database), and how it degrades.\n\n'
   + 'Then produce: (1) the design space for typed data in markdown - inline fields vs frontmatter vs fenced data blocks vs sidecar - with tradeoffs on each of readability, splice-safety, queryability and degradation; (2) a recommendation for frontmatter with reasoning; (3) the query surface users expect, grounded in what Dataview and Bases actually offer; (4) anti-recommendations - what pollutes the text irrecoverably.'],
]

const fmt = await parallel(F.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Format' })))

phase('Render')

const R = [
  ['m6-render-pipelines',
   'Map the markdown rendering pipeline ecosystem in engineering detail, because our engine has to live inside one.\n\n'
   + 'Cover with curl and npm: unified/remark/rehype (the full plugin taxonomy, key plugin download counts and dates), markdown-it and its plugin ecosystem, marked, micromark, @lezer/markdown, cmark and cmark-gfm, pandoc readers/writers/filters, goldmark (Hugo), comrak, pulldown-cmark, markdown-rs, kramdown, Python-Markdown and markdown-it-py, mistune, showdown.\n\n'
   + 'For each: language, spec conformance, extension API shape, incremental-parsing support, position/offset information exposed (this matters enormously for byte-splice editing), performance claims with any published benchmark, licence, and current version with date.\n\n'
   + 'Produce: (1) the comparison table; (2) which parsers expose byte-accurate source positions and which do not - itemised, since this determines what an editor can safely do; (3) the honest assessment of our current stack (unified/remark/rehype in the app, @lezer/markdown in CodeMirror, plus 7 engines in the certificate bench) - is it the right stack, what is missing, what would we regret; (4) what a plugin/extension API for frontmatter render profiles should look like given all of the above.'],

  ['m7-output-targets',
   'Research every OUTPUT TARGET markdown can be compiled to, with the real tool for each and its fidelity limits.\n\n'
   + 'Cover with curl: HTML (the baseline), PDF via headless Chrome, via WeasyPrint, via Typst, via LaTeX, via Prince; paged media (paged.js, CSS Paged Media support in browsers - what actually works in 2026, page numbers, running headers, cross-references); slides (Marp, reveal.js, Slidev, Quarto revealjs, Deckset); ebooks (EPUB via pandoc, Calibre); DOCX and ODT via pandoc; email (MJML, and the markdown-to-email problem); social image cards; man pages; Confluence and Notion import formats; static site generators as a target; and print.\n\n'
   + 'For each: the tool, what it can and cannot represent, the fidelity gotchas, licence, and whether it runs client-side or needs a server.\n\n'
   + 'Then produce: (1) a target matrix - which outputs frontmatter should support in v1, v2, never, with reasoning; (2) the specific hard problems - page numbers, cross-references, widows/orphans, table splitting across pages, font embedding, CJK line breaking; (3) what our existing PDF path (puppeteer-core plus sparticuz chromium, already a dependency) can and cannot do, and what the honest limits are; (4) which targets are a genuine differentiator versus table stakes.'],

  ['m8-computational-markdown',
   'Research computational and executable markdown - the category adjacent to our refused eval lane - so the boundary is drawn from evidence, not assumption.\n\n'
   + 'Cover with curl: Jupyter and the .ipynb format, jupytext (notebooks as markdown - the exact percent and myst formats), MyST-NB, Quarto (the full computational document model), R Markdown and knitr, Observable notebooks and Observable Framework, Marimo (reactive python notebooks stored as .py), Streamlit, Pluto.jl, Org-mode babel, literate programming (Knuth, noweb), Ink and Switch Potluck, and any markdown-native computation project you find.\n\n'
   + 'For each: how the code and output are stored, whether the file stays plain text and diffable, the reproducibility story, and the security model.\n\n'
   + 'Produce: (1) the comparison table; (2) the reproducibility evidence - find the real study on notebook reproducibility rates and cite it properly rather than repeating a number; (3) THE BOUNDARY ANALYSIS: our product refuses arbitrary client-side code execution (the eval lane) because it ends the corruption guarantee and turns prompt injection into RCE. Pressure-test that decision against this evidence - what do we genuinely lose, is there a safe subset (declarative computation, sandboxed WASM, server-side execution with no document-store access), and what is the strongest argument that our refusal is wrong; (4) a recommendation on where exactly to draw the line, with the mechanism.'],

  ['m9-hard-edges',
   'Research the HARD EDGES of markdown - where it genuinely fails - so our product does not promise what the format cannot deliver.\n\n'
   + 'Cover with evidence: tables (nested content, colspan/rowspan, long cells, alignment, captions - and what every extension does about it), complex layout (columns, floats, sidebars, pull quotes), figures with captions and cross-references, RTL languages, CJK line breaking and word counting (our engine measures countWords undercounting Chinese by 1.7-2x and MiniSearch CJK recall at 18.1 percent), Indic scripts, accessibility (alt text, heading hierarchy, table headers, ARIA, reading order, WCAG conformance of rendered markdown), math accessibility, footnote and citation handling, very large documents and performance, mixed HTML in markdown and its sanitisation problem, whitespace and indentation ambiguity, list-item edge cases, and the setext-vs-thematic-break ambiguity class our engine already hit.\n\n'
   + 'Use curl for: WCAG guidance on documents, the CommonMark spec sections on the ambiguous cases, Unicode line-breaking (UAX 14) and text segmentation (UAX 29), and any published study on markdown accessibility.\n\n'
   + 'Produce: (1) the hard-edge table - the problem, why markdown fails, what workarounds exist, and what it costs; (2) the accessibility obligations for a product that PUBLISHES rendered markdown; (3) the i18n work our engine specifically needs, with the exact standards to implement against; (4) the honest list of things to tell users markdown cannot do, rather than faking it.'],

  ['m10-render-possibility-space',
   'Enumerate the FULL possibility space of what frontmatter could render from markdown - the creative brief, disciplined by degradation.\n\n'
   + 'Given the constraint (a profile over valid CommonMark that degrades to readable text) and the computation budget (fixed-vocabulary client-side rendering only, no arbitrary code), enumerate every render surface that is achievable. Go wide: documents, boards, calendars, timelines, gantt, decision records, dashboards, tables and pivots, charts, diagrams, maps, galleries, slide decks, forms and surveys, checklists and SOPs, recipes, itineraries, CVs and resumes, invoices, contracts and redlines, org charts, roadmaps, changelogs, status pages, knowledge graphs, flashcards and spaced repetition, quizzes, habit trackers, journals, meeting notes, interview scorecards, bug reports, test plans, API references, data dictionaries, brand books, style guides, and anything else you can justify.\n\n'
   + 'For EACH: the frontmatter keys or fence syntax that would drive it, what computation lane it needs (client / client+lib / server / LLM), how it degrades in a dumb renderer, whether write-back is possible and what field a drag would rewrite, an existing product that proves demand, and an effort estimate.\n\n'
   + 'Then produce: (1) the ranked shortlist for v1 and v2 with reasoning; (2) the ones that look attractive but are traps, and why; (3) any render surface that would be genuinely NOVEL - that no product currently offers - flagged as such only if you checked and could not find one.'],
]

const rnd = await parallel(R.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Render' })))

return {
  format: F.map((x, i) => ({ label: x[0], text: fmt[i] })),
  render: R.map((x, i) => ({ label: x[0], text: rnd[i] })),
}
