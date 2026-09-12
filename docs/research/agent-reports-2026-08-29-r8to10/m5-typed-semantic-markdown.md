### Evidence key + what was opened

- `[fetched]` primary source opened via `curl` this session (2026-08-29); `[measured]` executed locally; `[SS]` search-summary; `[derived]` arithmetic shown; `[inference]` reasoning.
- Opened: Dataview docs + `src/data-import/inline-field.ts`; Obsidian Help raw Markdown via `publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/…` (Bases syntax, Functions, Views, Create a base, Properties, Search); Logseq `docs/pages/{Properties,Queries,Advanced Queries}.md`; org manual 9.8; Tana `outliner.tana.inc/learn/…`; Notion `developers.notion.com/reference/property-object`; W3C YAML-LD ED; WHATWG HTML §5 Microdata; W3C RDFa Lite; Semantic MediaWiki via `api.php?action=parse&prop=wikitext`; Foam `note-properties.md`; pandoc MANUAL; CommonMark 0.31.2; GFM spec. `WebFetch` refused; `curl` unblocked throughout (LR#70 confirmed again).
- Nothing was written, edited, committed or pushed.

### CommonMark's silence is the load-bearing fact

- CommonMark **0.31.2 (2024-01-28)** contains the strings "front matter" 0×, "frontmatter" 0×, "YAML" 0×, "metadata" 0× `[measured]`. GFM spec: same three at 0× `[measured]`.
- Consequence: **every** typed-data mechanism below is an out-of-spec profile. There is no "compliant" option, only options that degrade well vs badly `[inference]`.
- pandoc defines `yaml_metadata_block` as an *extension*: opened by `---`, closed by `---` **or `...`**; may occur **anywhere** in the document if preceded by a blank line; multiple blocks allowed, later wins; field names ending in `_` are ignored; names interpretable as YAML numbers/booleans (`yes`, `True`, `15`) are forbidden `[fetched]`.

### Obsidian Dataview — inline fields (`key:: value`)

```markdown
# Markdown Page

Basic Field:: Some random Value
**Bold Field**:: Nice!

I would rate this a [rating:: 9]! It was [mood:: acceptable].
- [ ] Send an mail to David about the deadline [due:: 2022-04-05].
This will not show the (longKeyIDontNeedWhenReading:: key).
```

- Storage: **inline, in the prose stream**; also reads YAML frontmatter. Bracket form is the *only* way to attach a field to one list item/task `[fetched]`.
- Parser mechanics (`inline-field.ts`) `[fetched]`: wrappers are exactly `{"[":"]", "(":")"}`; `findSeparator` = `line.indexOf("::")`; a key containing any wrapper char fails the match; `findClosing` tracks nesting and `\` escapes; overlapping fields are dropped by a post-sort filter keeping only non-overlapping spans.
- Lossy normalization `[fetched]`: `Basic Field` → `basic-field`; `**Bold Field**` → `bold-field` (formatting tokens stripped from the key); keys lowercased. Index keys **cannot reconstruct source bytes**.
- Types by literal shape `[fetched]`: `2021-02-26T15:15` → Date; `2021-04-17 18:00` → **Text**. Multiline values impossible inline (newline terminates value); only frontmatter `|` gives multiline.
- Query surface: DQL fenced ` ```dataview `, four query types **TABLE / LIST / TASK / CALENDAR**; data commands `FROM` (tag / `"folder"` / `[[link]]` / `outgoing()`, composed with `and`/`or`/`-`), `WHERE`, `SORT`, `GROUP BY`, `FLATTEN … AS`, `LIMIT`; plus inline DQL `` `= this.file.name` `` (exactly one value, no query types) and `dataviewjs` `[fetched]`.
- Health: 9,300 stars, latest release **0.5.70 (2025-04-07)**, last push **2025-11-17T20:51:35Z**, 662 open issues `[fetched 2026-08-29]`. `[derived]` 2026-08-29 − 2025-04-07 ≈ 16.7 months without a release.

### Obsidian Bases — frontmatter + sidecar query file

```yaml
filters:
  or:
    - file.hasTag("tag")
    - and:
        - file.hasTag("book")
        - file.hasLink("Textbook")
    - not:
        - file.hasTag("book")
        - file.inFolder("Required Reading")
formulas:
  formatted_price: 'if(price, price.toFixed(2) + " dollars")'
  ppu: "(price / age).toFixed(2)"
properties:
  status: { displayName: Status }
summaries:
  customAverage: 'values.mean().round(3)'
views:
  - type: table
    name: "My table"
    limit: 10
    groupBy: { property: note.age, direction: DESC }
    order: [file.name, file.ext, note.age, formula.ppu]
```

- Data lives **only in frontmatter properties + file metadata**; the query lives in a `.base` sidecar, or embedded as a fenced block `[fetched]`:

```markdown
```base
filters:
  and:
    - file.hasTag("example")
views:
  - type: table
    name: Table
```
```

- Embed also via `![[File.base]]` / `![[File.base#View]]` `[fetched]`.
- **No `FROM`/`source`** — "By default a base includes every file in the vault… There is no `from` or `source` like in SQL or Dataview" `[fetched]`. Direct disagreement with Dataview's model.
- Namespaces: `note.*` (frontmatter, default when unprefixed), `file.*`, `formula.*` `[fetched]`.
- Expression language is JS-shaped: `==  != > < >= <=`, `! && ||`; globals `date() duration() file() html() if() image() icon() link() list() max() min() now() number() today() random() escapeHTML()`; typed method sets for Any/Date/String/Number/List/Link/File/Object/Regex `[fetched]`.
- Layout availability by app version: Table 1.9, Cards 1.9, List 1.10, Map 1.10 `[fetched]`.
- Obsidian core Properties explicitly **does not support**: nested properties, bulk editing, and **Markdown inside property values** — "an intentional limitation as properties are meant for small, atomic bits of information that are both human and machine readable" `[fetched]`. Bases nonetheless documents `property.subprop` access `[fetched]` — an internal disagreement between the Properties page and the Bases page.
- Type disagreement worth recording: Bases `date()` wants `YYYY-MM-DD HH:mm:ss` `[fetched]`; Dataview reads that exact literal as **Text** and only ISO-8601 `T`-form as Date `[fetched]`.

### Logseq — block-level properties, Datalog underneath

```markdown
- [[How to take smart notes]]
  type:: [[book]]
  author:: [[sönke ahrens]]
  price:: 10
  tags:: motor, steering wheel
  description:: "[[Logseq]] is the fastest #triples #[[text editor]]"
```

- Page properties = properties in the **first block**; block properties = anywhere else `[fetched]`.
- Normalization `[fetched]`: names case-insensitive and **lower-cased**; `_` **renamed to** `-` (`done_at` → `done-at`); values may not contain newlines; `property:: ` with no value is invisible and non-queryable; quoting the value suppresses link extraction.
- Values are **link-typed by default** — page refs, tags and comma-separated multi-values (`:property/separated-by-commas`) `[fetched]`.
- Query surface, two tiers `[fetched]`: simple `{{query (property type book)}}` with operators `and`/`or`/`not` and filters `between`, `page`, `property`, `page-property`, `page-tags`, `task`; advanced = raw Datalog over DataScript:

```clojure
{:title  [:h2 "Your query title"]
 :query  [:find (pull ?b [*])
          :where ...]
 :inputs [...]
 :result-transform (fn [query-result] ...)
 :group-by-page? true}
```

- 44,669 stars, pushed 2026-08-28 `[fetched]`.

### Tana — supertags and fields (not a markdown format)

- Model: supertag = "is a" (turns a node into an object); field = "has a" (column). Fields are created by typing `>` on an empty line; supertags by `#` `[fetched]`.
- Storage is a **graph database**, not text. The text-facing surface is **Tana Paste**, "loosely modelled on Markdown" `[fetched]`:

```markdown
%%tana%%
- Wes Anderson movie night #meeting
  - Attendees:: [[Wes Anderson #person]]
  - [[Topics]]::
    - Rushmore
    - The Life Aquatic
  - %%view:table%%
```

- Rules `[fetched]`: header literal `%%tana%%`; nodes are `- ` + indentation; refs `[[ ]]`, id-pinned `[[name^nodeID]]`; fields `name:: value`, multi-value via `- [[field]]::` + indented children; tags `#bug` / `#[[my ideas]]` / `#bug^nodeID`; views `%%view:table|cards|tabs|calendar%%`; `%%search%%` makes a live search node.
- Explicitly **create-only** — "It can only create new content, not update existing nodes" `[fetched]`. Live search caps at **2,500 nodes** `[fetched]`.

### Roam — attributes

- Literal syntax is `Attribute:: value` as the whole block string. Obsidian's official importer pins the grammar exactly `[fetched]`:

```
/^([^\n[\]{}:]{1,80})::([^\n]*)$/
```

- i.e. key ≤ 80 chars, may not contain `[ ] { } :` or newline; value is the rest of the line. Roam's own help is a SPA and returned a 1,530-byte shell `[measured]` — the regex above is the strongest primary artifact reachable; Roam's own documentation of the rule is `[SS]`.
- Query surface: `{{[[query]]: {and: [[a]] {or: [[b]] [[c]]}}}}`, translated by the importer into `and`→space-join, `or`→` OR `, `not`→`-term` `[fetched]`.

### org-mode — PROPERTIES drawers + column view (org 9.8)

```org
* CD collection
** Classic
*** Goldberg Variations
    :PROPERTIES:
    :Title:     Goldberg Variations
    :Composer:  J.S. Bach
    :NDisks:    1
    :Genres+:   Baroque
    :END:
```

- Drawer must sit **immediately below the headline** (after any planning line); keys are **case-insensitive**; buffer-level properties go above the first headline `[fetched]`.
- Schema-ish features no markdown ecosystem has: `:Xyz_ALL:` declares the **allowed value set** and is inherited; `#+PROPERTY: var foo` / `#+PROPERTY: var+ bar` appends; `Genres+:` appends within a drawer — multiple entries **without** `+` are explicitly **undefined behaviour** `[fetched]`.
- Query surface: column view overlays a table on the outline, works in agenda buffers "where queries have collected selected items, possibly from a number of files" `[fetched]`; plus inheritance controlled by `org-use-property-inheritance` `[fetched]`.

### Notion — the contrast case (properties are database columns)

- 21 property types `[fetched]`: `checkbox, created_by, created_time, date, email, files, formula, last_edited_by, last_edited_time, multi_select, number, people, phone_number, place, relation, rich_text, rollup, select, status, title, unique_id, url`.
- Every property object carries `id` (opaque, e.g. `"fy:{"`), `name`, `description`, `type`, plus a type-config object `[fetched]`.
- Storage: **database-native, no text representation**. Schema is defined on the data source and "rendered as columns in the Notion UI"; row values are a separate *page property values* API `[fetched]`.
- Degradation: none — there is no plain-text artifact to degrade to. Renaming a property is safe because identity is the opaque `id`, not the name `[inference]`. This is the one capability markdown structurally cannot copy without a sidecar id map.

### YAML-LD, JSON-LD-in-markdown, RDFa, microdata

- **YAML-LD** (W3C ED, JSON-LD WG; editors Scherbakov, Kellogg †2025-09-06, Polli) `[fetched]`: media type `application/ld+yaml`; extensions `.yaml`, `.yamlld`; `profile` parameter per RFC 6906 with `http://www.w3.org/ns/json-ld#extended` defined for the Extended Profile; HTML embedding via `<script type="application/ld+yaml">` with whitespace **preserved as-is**; multi-document YAML streams treated as separate scripts.
- YAML-LD's stated conformance hazard, verbatim in effect: YAML 1.1 parsers hit the "Norway problem" (`no`, `No`, `NO`, `yes`, `on`, `off` coerced to booleans) and "**are not compliant**" `[fetched]`. This is a direct warning for any frontmatter profile that ships a 1.1-era loader `[inference]`.
- `yaml-ld` is **not published on npm** (`{"error":"package yaml-ld not found"}`) `[measured]`.
- **JSON-LD in markdown** = raw HTML block:

```markdown
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Person","name":"Ada"}
</script>
```

- **RDFa Lite 1.1** (W3C Rec 2012-06-07, editorial revision): exactly five attributes — `vocab`, `typeof`, `property`, `resource`, `prefix`; upward-compatible with full RDFa 1.1 `[fetched]`.
- **Microdata** (WHATWG HTML Living Standard, last updated 28 August 2026, §5): `itemscope` creates an item, `itemprop` adds a property, values default to element text, URL-valued properties ride `a[href]`/`img[src]`, machine-readable values ride `<data value>`; "markup without the microdata-related attributes does not have any effect on the microdata model" `[fetched]`.
- Both are HTML-attribute mechanisms; markdown has no attribute syntax in CommonMark, so both force raw HTML into the file `[inference]`.

### Semantic MediaWiki — the deep prior art (629 stars, pushed 2026-08-27)

```wikitext
Berlin is the capital of [[Is capital of::Germany]].
[[Is capital of::Germany| ]]            <!-- hidden annotation -->

{{#set:
 Has population=2,229,621
 |Located in country=France
}}

{{#ask:
 [[Category:City]]
 [[Located in::Germany]]
 |?Population
 |?Area#km² = Size in km²
}}
```

- The design insight nothing else states as plainly `[fetched]`: "**The syntax for asking for pages that satisfy some condition is exactly the syntax for explicitly asserting that this condition holds.**"
- Properties are first-class wiki pages (`Property:` namespace), case-sensitive, subject to `$wgCapitalLinks`; conditions juxtaposed = AND; `|?X` are printout statements; typed values (Number ignores thousands separators) `[fetched]`.
- `#set` exists *because* in-text annotation pollutes prose; and SMW itself warns in-text annotation "might be deprecated" under Parsoid `[fetched]`. Twenty years of prior art ending at: **separate the assertion from the sentence**.

### Measured degradation matrix (dumb renderers, no plugin)

Run against `commonmark 0.31.2`, `markdown-it 15.0.0` (defaults), `marked 16.4.2` `[measured]`:

| Input | commonmark | markdown-it | marked |
|---|---|---|---|
| `---`⏎`title: x`⏎`---`⏎`Body.` | `<hr /><h2>title: x</h2><p>Body.</p>` | identical | identical |
| `---`⏎`title: x`⏎`...`⏎`Body.` | `<hr /><p>title: x ⏎ … ⏎ Body.</p>` | identical | identical |
| `Basic Field:: Some random Value` | `<p>Basic Field:: Some random Value</p>` | same | same |
| `a [rating:: 9]! [mood:: acceptable].` | literal text preserved | same | same |
| `(longKey:: key)` | literal text preserved | same | same |
| `:PROPERTIES:` drawer | one paragraph, 3 lines | same | same |
| `[[Is capital of::Germany]]` | literal `[[…]]` | same | same |
| ` ```base ` block | `<pre><code class="language-base">` | same | same |
| `<script type="application/ld+json">` | passes through as HTML | **escaped, rendered visible** | passes through |
| Tana `%%tana%%` + `- x #tag` + `Attendees:: [[Jane]]` | `<p>%%tana%%</p>` + nested `<ul>` | same | same |

- Headline `[derived]`: **3/3 engines turn a bare frontmatter block into `<hr>` + an `<h2>` heading of the first key.** The `---` closer is consumed as a setext underline. Closing with `...` (pandoc-legal) degrades to a paragraph instead — strictly less destructive, and free.
- Headline 2 `[derived]`: JSON-LD-in-HTML is the **only** mechanism tested that fails *visibly* (markdown-it default `html:false` escapes it into body text).

### (1) The design space

| Axis | Frontmatter (`---` … `---`) | Inline fields (`k:: v`) | Fenced data block (` ```yaml-ld `) | Sidecar (`.base`, `.json`) |
|---|---|---|---|---|
| Readability in source | Good; one block, skimmable, sorted | Poor at density; keys interleave with prose | Good; visually quarantined | Perfect (invisible) |
| Readability in dumb render | **Bad** — `<hr>` + `<h2>` | Leaks as literal text into sentences | Renders as a code block (honest) | Invisible |
| Splice-safety | **Best** — one contiguous byte range at offset 0, two fixed sentinels, boundaries independent of inline parse state | **Worst** — span depends on bracket nesting + `\` escapes + overlap resolution; an unrelated edit earlier on the line shifts and can invalidate the field | Good — fence boundaries are block-level, but info-string collisions and nested-fence escaping bite | Best for the `.md`; but the edit is no longer atomic with the note |
| Queryability | Whole-file granularity only | Sub-file: list item, task, sentence | Whole-block; can carry graphs/arrays | Whole-file; query language can be richer |
| Multi-value / nesting | Native YAML lists + maps | Impossible (newline terminates value) | Native | Native |
| Degradation | Ugly but *localized* and reversible | **Irreversible**: field text is indistinguishable from prose; a reflow/wrap destroys it | Graceful: visible, labelled, byte-preserved | Silent divergence: rename/move desyncs |
| Identity stability | Key string = identity; renames are lossy | Key string, further mangled by sanitization | Key string | Can carry opaque ids (Notion model) |

### (2) Recommendation — frontmatter, with three qualifications

- **Use YAML frontmatter as the sole authoritative typed-data surface.** Reasoning, in priority order:
  - Splice-safety dominates for MDMAX: a delimited block at byte 0 has boundaries computable **without** running an inline parser, so a typed-data write never has to reason about bracket nesting, escapes, or overlapping spans — the three things Dataview's own parser has to resolve heuristically `[fetched]` `[inference]`.
  - Degradation is *localized*: measured `<hr>` + `<h2>` is ugly, but it is confined to the top of the document and is losslessly recoverable, because the bytes are untouched `[measured]`.
  - Every engine in the 7-engine cert matrix already has a frontmatter mode or a documented extension (`yaml_metadata_block` in pandoc; Properties in Obsidian; frontmatter in Foam/MyST) `[fetched]` — so this is a profile over an existing convention, not an invention.
  - Inline fields are ecosystem-abandoned at the top: Obsidian shipped Bases as a **core** plugin reading frontmatter only, while Dataview has not cut a release in ~16.7 months `[derived]`.
- Qualification A — **close with `...`, not `---`, when emitting**. Measured: 3/3 dumb engines degrade to a paragraph rather than a heading; pandoc explicitly permits it `[fetched]`. Accept `---` on read.
- Qualification B — **pin YAML 1.2 Core Schema**. YAML-LD names 1.1 boolean coercion as a conformance failure `[fetched]`; a `status: no` field silently becoming `false` is exactly the class of cross-engine divergence the certificate exists to catch.
- Qualification C — **one escape hatch only: a fenced data block with a reserved info string** for the cases frontmatter cannot express (per-block data, graphs, JSON-LD). Measured degradation is a labelled code block in 3/3 engines — the best-behaved of every mechanism tested.

### (3) The query surface users expect

Grounded in what Dataview and Bases actually ship — the union is the expectation, the intersection is the floor:

- **Output shapes**: table, list, cards/gallery, task list, calendar, map. Dataview ships TABLE/LIST/TASK/CALENDAR `[fetched]`; Bases ships table 1.9, cards 1.9, list 1.10, map 1.10 `[fetched]`. Ship table + list first.
- **Filter**: boolean tree (`and`/`or`/`not`, nestable — Bases models it as recursive YAML objects `[fetched]`); comparisons `== != > < >= <=`; existence and null (`[aliases:null]` in Obsidian search `[fetched]`); tag / folder / link predicates (`file.hasTag()`, `file.inFolder()`, `file.hasLink()` `[fetched]`; `FROM #tag`, `FROM "folder"`, `FROM [[note]]`, `FROM outgoing([[note]])` `[fetched]`).
- **Sort / group / limit**: `SORT f1 ASC, f2 DESC`, `GROUP BY`, `LIMIT` `[fetched]`; Bases `groupBy: {property, direction}`, `limit` `[fetched]`.
- **Derived columns**: named formulas referencing other formulas with cycle detection, output type inferred (`formatted_price: 'if(price, price.toFixed(2) + " dollars")'`) `[fetched]`. Dataview's equivalent is expression columns + `FLATTEN … AS` `[fetched]`.
- **Aggregation**: column summaries with user-defined formulas (`customAverage: 'values.mean().round(3)'`) and defaults `[fetched]`.
- **Date arithmetic as a first-class type**: `now() + "1 hour"`, `today() + "7d"`, `duration('5h') * 2` (duration must be on the left), date−date → milliseconds `[fetched]`; Dataview `date(today) - dur(1 day)` `[fetched]`.
- **Single-value inline interpolation**: `` `= this.file.name` ``, `` `= [[secondPage]].due - date(today)` `` — expressions only, no query types `[fetched]`. Users expect this and it is *not* a table.
- **Two authoring modes**: point-and-click filter builder plus a raw-syntax editor for "complex functions that cannot be displayed using the point-and-click interface" `[fetched]`. Both Obsidian and Tana ship a builder as the primary surface; the text syntax is the escape hatch, not the front door `[fetched]`.
- **Escape hatch beneath the DSL**: Dataview → `dataviewjs`; Logseq → raw Datalog `:find (pull ?b [*]) :where` `[fetched]`. Expect to need one.
- **A result cap**: Tana hard-caps live search at 2,500 nodes and refuses rather than truncating `[fetched]`; Dataview docs warn a bare `LIST` "can take long and even freeze Obsidian" `[fetched]`. Refuse loudly, do not silently truncate.

### (4) Anti-recommendations — what pollutes irrecoverably

- **Bare `Key:: Value` on its own line in body prose.** Measured: renders as ordinary paragraph text in 3/3 engines. Once it is a paragraph, any tool that re-wraps, re-flows, translates, or summarizes destroys the field with no signal. Dataview compounds it by sanitizing the key (`**Bold Field**` → `bold-field`), so the index can never write back the source bytes `[fetched]`. This is the single worst option on both degradation and splice-safety.
- **The parenthesis form `(key:: value)`.** Dataview *hides the key* in Reader mode `[fetched]` — the reader sees text that is not in the file, and every other renderer shows the key. Deliberate render/source divergence; never emit it, and flag it on read.
- **Overloading link syntax (`[[Prop::Value]]`).** Measured: literal `[[Is capital of::Germany]]` in dumb engines; in any wikilink-aware engine it resolves to a nonexistent page named `Prop::Value`. SMW invented `{{#set:}}` to escape its own in-text form and now warns the in-text form may be deprecated under Parsoid `[fetched]`.
- **Raw `<script type="application/ld+json">` (and RDFa/microdata attributes) in the body.** Measured: markdown-it with default `html:false` escapes it and renders the JSON **visibly to the reader**. Any HTML-attribute mechanism also requires raw HTML that CommonMark cannot express — a permanent hostage to each engine's HTML setting `[measured]` `[inference]`.
- **Non-CommonMark block sigils** — org `:PROPERTIES:` drawers, MyST `:::` directives, Tana `%%tana%%` / `%%view:table%%`. Measured: drawers collapse into a single three-line paragraph; `%%tana%%` becomes a visible paragraph. All are noise a reader must be told to ignore.
- **Inline fields inside table cells.** Measured: `[due:: 2026-01-01]` survives as literal text in a `<td>` under GFM tables, but commonmark (no tables) renders the whole table as one paragraph — the same bytes have two different block structures across the matrix, which is a splice-boundary hazard, not just a render difference `[measured]`.
- **A sidecar as the *only* home for note-level data.** Bases' own model is the right shape (data in frontmatter, *query* in the sidecar) `[fetched]`. Inverting it — data in the sidecar — breaks on rename/move/copy and makes the `.md` non-self-describing.
- **Reusing the key string as identity.** Notion avoids every rename hazard by keying on an opaque `id` `[fetched]`; Logseq lowercases and rewrites `_`→`-` `[fetched]`; Dataview sanitizes to lowercase-with-dashes `[fetched]`; org keys are case-insensitive `[fetched]`. Four different normalizations for the same conceptual field — do not assume any of them, and never round-trip a key through a normalizer.
- **Markdown inside property values.** Obsidian bans it deliberately `[fetched]`; pandoc *does* interpret all YAML string scalars as Markdown `[fetched]`. Direct, unresolved disagreement between two engines in the cert matrix — pick one, state it in the profile, and certify the other as a known divergence.

### Recorded disagreements (not resolved here)

- **Source selection**: Dataview requires/permits `FROM`; Bases explicitly has none `[fetched]` — a Dataview→Bases migration cannot be total.
- **Frontmatter position**: pandoc allows a metadata block anywhere in the document `[fetched]`; Obsidian, Foam and MyST require the very top `[fetched]`.
- **Date literal typing**: `2021-04-17 18:00` is Text to Dataview, a valid `date()` input to Bases `[fetched]`.
- **Nested properties**: unsupported per Obsidian Properties, addressable per Bases syntax `[fetched]`.
- **YAML version**: YAML-LD requires 1.2.2 semantics and declares 1.1 parsers non-compliant `[fetched]`; which shipped libraries default to 1.1 was **not verified here** — `js-yaml` at 1,228,031,655 downloads in 2026-07-29→2026-08-27 `[measured]` makes that the highest-value thing to test next.
- Comparators, same window `[measured]`: `gray-matter` 35,782,970; `jsonld` 823,967; `microdata-node` 231,909. `[derived]` gray-matter/jsonld ≈ 43.4× — frontmatter parsing outweighs linked-data parsing by more than an order of magnitude in the JS ecosystem.