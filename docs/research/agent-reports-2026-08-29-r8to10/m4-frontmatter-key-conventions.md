I mutated nothing: this task was read-only (curl fetches, GitHub/npm read APIs, one Python arithmetic script, one `ls`/`grep` of the repo) — no writes, no commits, no edits to `~/.claude` or `~/.sgnk`; the reported dirt is pre-existing and not mine.

### Scope, method, evidence key

- 21 systems opened via `curl` (WebFetch gate bypassed as instructed; every host below returned HTTP 200) [measured 2026-08-29].
- `[fetched]` = primary source opened; `[measured]` = executed here; `[derived]` = arithmetic shown; `[inference]` = my reasoning; `[SS]` = search summary (used twice, both flagged).
- Key sets per system are **as documented on the pages I opened**, not exhaustive per system — the overlap counts below are a floor, not a census [inference].
- Ecosystem weight, measured 2026-08-29 via `api.github.com/repos/*` stars: hugo 89569, docusaurus 66118, astro 62126, gatsby 55941, jekyll 51657, pandoc 46052, logseq 44669, mkdocs-material 27343, eleventy 19868, vitepress 18258, zola 17382, foam 17379, nextra 13912, quartz 13119, quarto-cli 5965, gray-matter 4488, contentlayer 3537 (**last push 2024-11-07 — unmaintained**), mystmd 519 [measured].
- Parser weight, npm downloads 2026-07-29 → 2026-08-27: `js-yaml` 1,228,031,655; `gray-matter` 35,782,970; `remark-frontmatter` 20,643,064; `front-matter` 18,413,979; `vfile-matter` 5,643,638 [measured]. Eleventy and Quartz both name `gray-matter` as their parser [fetched].
- **CommonMark 0.31.2 contains 0 occurrences of "front matter"; GFM 0.29-gfm (2019-04-06) contains 0** [measured, `grep -ic`]. Frontmatter is entirely extra-spec; there is no "correct" answer to appeal to.

### Master key table — every key used by ≥2 of the 21 systems

Computed over 230 distinct keys; **49 keys appear in 2+ systems** [derived: `len(multi)` from a Python set-intersection over the fetched key lists].

| Key | n | Systems | Semantic split |
|---|---|---|---|
| `title` | 19 | Astro, Contentlayer, Docusaurus, DublinCore, Eleventy, Foam, Gatsby, Hugo, Jekyll, Logseq, MkDocs-Material, MyST, Nextra, OKF, Pandoc, Quarto, Quartz, VitePress, Zola | **body-mutating vs not** — MyST *removes* the H1 from content when `title` is absent; Docusaurus *inserts* an H1 when absent; Foam/Logseq only override the filename |
| `description` | 15 | Astro, Contentlayer, Docusaurus, DublinCore, Hugo, MkDocs-Material, MyST, Nextra, OKF, Obsidian, Quarto, Quartz, schema.org, VitePress, Zola | Hugo: "*Conceptually different than the page `summary`*"; Quartz splits `description` vs `socialDescription` |
| `date` | 14 | Contentlayer, Docusaurus, DublinCore, Eleventy, Gatsby, Hugo, Jekyll, MkDocs-Material, MyST, Nextra, Pandoc, Quarto, Quartz, Zola | **the worst conflict** — see §Conflicts |
| `tags` | 14 | Astro, Contentlayer, Docusaurus, Eleventy, Foam, Hugo, Jekyll, Logseq, MkDocs-Material, MyST, Nextra, OKF, Obsidian, Quartz | list vs space-string vs comma-string vs objects |
| `keywords` | 7 | Docusaurus, Foam, Hugo, MyST, Pandoc, Quarto, schema.org | Hugo `[]string`; Docusaurus `string[]`; Foam parses **comma OR space** out of a scalar |
| `slug` | 7 | Astro, Contentlayer, Docusaurus, Gatsby, Hugo, MkDocs-Material, Zola | Hugo: last path segment only; Zola: overridden by `path`; Astro: overrides generated `id` |
| `author` | 6 | Astro, Docusaurus, Nextra, Pandoc, Quarto, schema.org | Docusaurus marks `author`/`author_*` deprecated in favour of `authors` |
| `draft` | 5 | Docusaurus, Hugo, MkDocs-Material, Quartz, Zola | uniformly boolean, uniformly build-flag-gated (`--buildDrafts`, `--drafts`) |
| `abstract` | 4 | DublinCore, Pandoc, Quarto, schema.org | Pandoc parses it **as Markdown** into a template variable |
| `alias` / `aliases` | 4 / 4 | Foam, Logseq, Obsidian, Quartz / Hugo, Obsidian, Quartz, Zola | **same word, two meanings**: Hugo/Zola = *redirect URLs*; Obsidian/Logseq/Foam = *synonym note names* |
| `authors` | 4 | Docusaurus, MkDocs-Material, MyST, Zola | MyST author object carries `orcid`, `roles` (CRediT), `affiliations` |
| `id` | 4 | Astro, Docusaurus, Logseq, MyST | Logseq `id` is a **block** UUID; Astro `id` is collection-scoped; MyST `id` is project-only |
| `image` | 4 | Docusaurus, Obsidian, Quartz, schema.org | all og:image-ish |
| `layout` | 4 | Eleventy, Hugo, Jekyll, VitePress | Jekyll `none`/`null` special-cased since 3.5.0 |
| `license` | 4 | DublinCore, MyST, Quarto, schema.org | MyST accepts object or SPDX-ish string |
| `permalink` | 4 | Eleventy, Jekyll, Obsidian, Quartz | Eleventy's is the **only one that accepts template syntax** |
| `subtitle` | 4 | MkDocs-Material (9.6.0, experimental), MyST, Pandoc, Quarto | |
| `type` | 4 | DublinCore, Foam, Hugo, OKF | **Hugo reserves it and refuses custom `type`**; OKF makes it the only REQUIRED key |
| `icon` | 3 | Logseq, MkDocs-Material (9.2.0, experimental), Nextra | MkDocs `material/emoticon-happy`; Nextra `FileIcon` (a React identifier) |
| `modified` | 3 | DublinCore, Hugo (alias→`lastmod`), Quartz | |
| `published` | 3 | Hugo, Jekyll, Quartz | **Jekyll = boolean, Hugo = date (alias→`publishDate`), Quartz = date** |
| `references` | 3 | DublinCore, MyST, Pandoc | Pandoc = inline CSL bibliography; MyST = intersphinx config |
| `template` | 3 | Logseq, MkDocs-Material, Zola | Logseq: marks the page *as* a template; others: select one |
| `bibliography`, `categories`, `citation`, `contributor`, `copyright`, `cover`, `created`, `creator`, `cssclass`, `cssclasses`, `funding`, `identifier`, `isPartOf`, `lang`, `lastmod`, `publish`, `publishDate`, `publisher`, `resources`, `status`, `subject`, `tag`, `updated`, `url`, `weight` | 2 each | — | see §Conflicts for `publish`/`published`, `status`, `resources` |

### Where the shared keys actually disagree

- **`date` fallback chains are engine-specific and non-commutative.** Hugo's documented default sequence: `date` → `publishdate` → `pubdate` → `published` → `lastmod` → `modified`; aliases `expiryDate`←`unpublishdate`, `lastmod`←`modified`, `publishDate`←`pubdate`/`published` [fetched, hugoDocs `configuration/front-matter.md`]. Quartz maps `date` into **both** `created` **and** `published`, and `modified` ← `modified`/`lastmod`/`updated`/`last-modified` [fetched, `docs/plugins/Frontmatter.md`]. Hugo calls `date` "*typically the creation date*"; Docusaurus blog calls it "*The blog post creation date*"; Zola pairs `date`+`updated`; Jekyll's `date` is a sort/URL key with format `YYYY-MM-DD HH:MM:SS +/-TTTT` [all fetched]. Dublin Core refuses the ambiguity outright with `created`, `issued`, `modified`, `available`, `valid`, `dateSubmitted`, `dateAccepted`, `dateCopyrighted` [fetched, DCMI Metadata Terms, Date Issued **2020-01-20**]. schema.org Article: `dateCreated`, `datePublished`, `dateModified` [fetched].
- **`tags` has four incompatible surface shapes**, all valid YAML:
  ```markdown
  ---
  tags: [a, b]          # Astro, Nextra, Docusaurus, MyST, OKF
  tags:                 # Obsidian (Tags type is list-only)
    - a
    - b
  tags: a b             # Jekyll: "YAML list or a space-separated string"
  tags: a, b            # Foam: "treat both spaces and commas as the separators"
  ---
  ```
  Docusaurus additionally allows `Tag = string | {label: string; permalink: string}` and resolves bare strings against a `tags.yml` file [fetched].
- **Obsidian's `tags` is a dedicated property *type***, not just a name: "*This property type cannot be assigned to other properties*" [fetched].
- **Singular/plural doublets are load-bearing, not cosmetic.** Obsidian deprecated `tag`/`alias`/`cssclass` in 1.4 and **dropped support in 1.9**; Quartz still accepts both [fetched]. Foam uses `alias` singular as its documented spelling [fetched].
- **Hugo forbids arbitrary top-level custom keys by name.** "*The field names below are reserved. For example, you cannot create a custom field named `type`. Create custom fields under the `params` key*" [fetched].

### Typed property systems

**Obsidian Properties** — 7 types, and the type is bound to the property *name* **vault-wide**: "*Once a property type is assigned to a property name, all properties with that name across your vault will use the same type*" [fetched].

| Type | Literal |
|---|---|
| Text | `title: A New Hope` — no Markdown rendering; internal links must be quoted: `link: "[[Episode IV]]"` |
| List | `cast:` then `  - Mark Hamill` |
| Number | `year: 1977` / `pie: 3.14` — literal only, "*not an expression with operators*" |
| Checkbox | `favorite: true`; a bare `last:` is "*Indeterminate value; often treated as false*" |
| Date | `date: 2020-08-21` |
| Date & time | `time: 2020-08-21T10:30:00` |
| Tags | list-only, `tags` only |

Hard limits [fetched]: **nested properties not supported**; **Markdown in properties not supported** ("*an intentional limitation*"); bulk editing unsupported; JSON frontmatter is accepted but **"read, interpreted, and saved as YAML"** — i.e. Obsidian will rewrite a JSON block, which is a byte-preservation hazard for MDMAX. Defaults: `tags`, `aliases`, `cssclasses`; Publish adds `publish`, `permalink`, `description`, `image`, `cover`.

**Astro content collections (zod v4 via `astro/zod`)** [fetched]:
```ts
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});
```
Types: `z.string`, `z.number`, `z.boolean`, `z.date`, `z.coerce.date`, `z.array`, `z.enum`, `z.object`, `z.email`, `z.url`, `.min()`, `.optional()`, `.default()`, `.transform()`, `.refine()`, plus Astro's `image()` and `reference("collection")`. Documented limitation: "*performing custom validation checks on images using `image().refine()` is unsupported*" [fetched]. `slug` in frontmatter overrides the loader-generated `id` [fetched].

**Contentlayer** field-type union, read from source `packages/@contentlayer/core/src/schema/field.ts` [fetched]: `string | number | boolean | json | date | markdown | mdx | image | enum | nested | list | reference`. Repo last pushed **2024-11-07** [measured] — treat as dead prior art, not a target.

**Docusaurus** structured types [fetched]: `type FrontMatterLastUpdate = {date?: string; author?: string};` and `type Tag = string | {label: string; permalink: string};`.

**Eleventy** [fetched]: `eleventyDataSchema` for validation; frontmatter language is pluggable — `---json`, `---js` (arbitrary JS, exports top-level bindings), default `yaml`.

**OKF v0.2** [fetched, `GoogleCloudPlatform/open-knowledge-format/SPEC.md`]: only `type` is required; `status: draft|stable|deprecated` (absent ⇒ `stable`); "*Every timestamp-valued key in OKF is an ISO 8601 datetime with an explicit UTC offset*"; `generated: {by, at}`, `verified: [{by, at}]` (bare mapping MUST be read as one-element list), `sources: [{resource, id, title, author, usage_count, last_modified}]`, `stale_after`, `resource`, `usage_window`. Extension rule: "*Consumers SHOULD preserve unknown keys when round-tripping and MUST NOT reject documents with unrecognized fields.*"

### Degradation baseline (measured, not assumed)

Posted to `POST api.github.com/markdown` (`mode: markdown` and `mode: gfm`) — a frontmatter-unaware CommonMark/GFM renderer [measured 2026-08-29]:

```markdown
---
title: T
tags: [a, b]
---

# Body
```
→ `<hr>` + `<h2>title: T<br>tags: [a, b]</h2>` + `<h1>Body</h1>`.

Single-key case `---\ntitle: T\n---\n\nBody` → `<hr>` + `<h2>title: T</h2>` + `<p>Body</p>` [measured].

- **Mechanism**: opening `---` is a thematic break; the key lines are a paragraph; the closing `---` is a **setext H2 underline** for them [inference from the measured output].
- **Consequences for the profile**: (a) frontmatter is *never invisible* in a dumb renderer, it is a heading; (b) the **first key line becomes the heading text**, so lead with a human-meaningful key (`title`); (c) every additional key lengthens that heading; (d) a `+++` TOML block does **not** get this treatment and degrades to a literal paragraph of `+++`; (e) a `---json` fence degrades worse still.
- Pandoc's rules make this harder, not easier: a YAML block "*may occur anywhere in the document*", "*A document may contain multiple metadata blocks*" with **later blocks winning**, and may close with `...` — but under `commonmark`/`gfm`/`commonmark_x` "*The YAML metadata block must occur at the beginning of the document (and there can be only one)*" [fetched, MANUAL.txt §`yaml_metadata_block`].

### Keys `frontmatter` MUST support to be a good citizen

Tiered by measured cross-system count; support = read, round-trip byte-identically, and never silently reshape.

- **Tier 0 (n≥14, non-negotiable)**: `title`, `description`, `date`, `tags`.
- **Tier 1 (n 5–7)**: `keywords`, `slug`, `author`/`authors`, `draft`.
- **Tier 2 (n=4, plus their singular doublets)**: `aliases`(+`alias`), `id`, `image`, `layout`, `license`, `permalink`, `subtitle`, `type`, `abstract`, `cssclasses`(+`cssclass`), `tag`.
- **Tier 3 (n=2–3, but cheap and expected by one large vault ecosystem each)**: `created`, `modified`, `updated`, `lastmod`, `published`, `publishDate`, `publish`, `cover`, `lang`, `status`, `weight`, `categories`, `template`, `url`, `subject`, `publisher`, `identifier`, `citation`, `funding`, `copyright`, `bibliography`, `contributor`, `creator`, `isPartOf`, `resources`.
- **Format tolerance that is part of citizenship**: TOML `+++` (Hugo, Zola, Quartz `language: toml`), JSON `---` + `{...}` (Obsidian, Hugo, Eleventy `---json`), JS `---js` (Eleventy 3.0.0-alpha.18), configurable delimiters (Quartz `delimiters: ["---","~~~"]`), and closing `...` (Pandoc). Eleventy's parser is `gray-matter`; matching its alias table is the cheapest compatibility win [all fetched].

### Keys we would be inventing — and whether a namespace is warranted

MDMAX-specific concepts (byte-preserving splice, 7-engine degradation certification) with **no ecosystem precedent** [inference]:

| Concept | Bare name we might reach for | Bare name safe? | Verdict |
|---|---|---|---|
| Which CommonMark profile the file targets | `profile` | unclaimed but generic | **namespace** |
| Engines the file is certified against | `engines`, `targets` | `engines` collides with `package.json` mental model | **namespace** |
| Degradation certificate hash / result | `cert`, `certificate` | unclaimed | **namespace** |
| Extension set in use | `extensions`, `features` | `features` is VitePress home-layout | **namespace** |
| Canonical byte form / offset-map version | `version` | **taken** — schema.org Article `version` | **namespace** |
| Source/origin of the doc | `source`, `resource`, `sources` | **taken** — DC `source`, OKF `resource`/`sources` | **namespace** |
| Verification state | `verified`, `status` | **taken** — OKF `verified`, OKF+MkDocs `status` | **namespace, or adopt OKF verbatim** |
| Editor/document identity | `id` | **taken** ×4 | **namespace** |
| Splice-safety / do-not-reformat flag | `preserve`, `frozen` | unclaimed | **namespace** |

**Every invented key warrants a namespace. Zero exceptions.** Reasoning: 49 of 230 observed keys are already contested, the ecosystem has no registry, and Hugo *errors* on reserved-name collisions while Obsidian *silently retypes a name vault-wide* — both failure modes are invisible to the author [derived + fetched].

**Namespace precedent actually present in the ecosystem** [all fetched]:

| Mechanism | System | Literal |
|---|---|---|
| Reserved sub-map for user keys | Hugo | `params:` |
| Reserved sub-map for user keys | Zola | `[extra]` |
| Reserved sub-map for user keys | Docusaurus | `sidebar_custom_props:` |
| Vendor prefix on flat keys | Eleventy | `eleventyComputed`, `eleventyNavigation`, `eleventyImport`, `eleventyDataSchema`, `eleventyExcludeFromCollections` |
| **Spec-sanctioned ignore marker** | Pandoc | "*Fields with names ending in an underscore will be ignored by pandoc. (They may be given a role by external processors.)*" |
| "preserve unknown keys" contract | OKF §4.1 | consumers "MUST NOT reject documents with unrecognized fields" |

**Recommendation**: one reserved top-level key, nested.
```markdown
---
title: The real title stays first
tags: [markdown, tooling]
fm:
  profile: commonmark-0.31.2+gfm-tables
  cert: sha256:9f2c…
  engines: [cmark, cmark-gfm, marked, markdown-it, remark, goldmark, pulldown-cmark]
  preserve: bytes
---
```
- One name claimed instead of nine; `fm` is unclaimed across all 21 systems [derived].
- Costs, stated honestly: **Obsidian does not support nested properties** (recommends source mode) so `fm:` is inert in its property UI; **Logseq has no nesting at all** — its syntax is `key:: value`, newline-delimited, "*a property value can't have newlines*" [fetched].
- Therefore also accept a flat mirror, and prefer `-` over `_`: **Logseq renames `_` to `-`** ("*`done_at` is renamed to `done-at`*") [fetched], so `fm_cert` silently becomes `fm-cert` there.
  ```markdown
  ---
  fm-profile: commonmark-0.31.2+gfm-tables
  fm-cert: sha256:9f2c…
  ---
  ```
- Do **not** use Pandoc's trailing-underscore form (`cert_:`) as the canonical spelling — it is spec-sanctioned in exactly one system and is a collision magnet with Logseq's rename rule [inference].

### Explicit conflicts we must resolve, and the recommended resolution

1. **`date` = created | published | modified.** Resolution: MDMAX **never writes bare `date`**; it writes `created` / `published` / `updated`. On read it resolves with Hugo's documented chain (`date`→`publishdate`→`pubdate`→`published`→`lastmod`→`modified`) *only as a display heuristic*, never as a rewrite, and surfaces the ambiguity in the UI. Byte-preservation means an existing `date:` is left exactly as found.
2. **`published` boolean (Jekyll) vs date (Hugo alias, Quartz).** Resolution: type-sniff, refuse to coerce, and treat a `published: false` alongside a `publishDate` as a hard authoring error surfaced to the user. Never emit `published`.
3. **`publish` (Obsidian/Quartz boolean) vs `published`.** Resolution: read both, emit neither; `draft` is the only publication-gate key MDMAX writes (5 systems, uniformly boolean, uniformly build-flag-gated).
4. **`tags` shape.** Resolution: parse all four shapes; **on splice, re-emit the shape that was there**. Only offer shape normalisation as an explicit, previewed user action. Refuse to write a scalar `tags: a b` into a vault that Obsidian types as List.
5. **`title` vs first H1 — a body mutation, not a metadata question.** MyST *removes* the heading; Docusaurus *inserts* one; MkDocs uses a four-step inference. Resolution: MDMAX's splice engine **never touches the body when editing `title`**, and the degradation certificate gets a dedicated class — `title-source-divergence` — asserting whether a given target engine will add, remove, or duplicate an H1.
6. **Singular/plural doublets (`tag`/`tags`, `alias`/`aliases`, `cssclass`/`cssclasses`).** Resolution: read both; write plural only; warn (do not auto-migrate) on singular, because Obsidian dropped singular support in 1.9 while Quartz still honours it — auto-migration would silently break a Quartz site pinned to old files.
7. **`aliases` = redirects (Hugo, Zola) vs synonyms (Obsidian, Logseq, Foam).** Resolution: unresolvable by renaming; disambiguate by **vault kind**, detected from sibling config (`hugo.toml`/`config.toml` vs `.obsidian/`), and record the detected kind in `fm.profile`. Never rewrite `aliases` cross-kind.
8. **`image` / `cover` / `socialImage` / `thumbnail` / `banner` / `thumbnailUrl`.** Resolution: read all six, write the one the detected profile uses, and treat the others as pass-through.
9. **`slug` / `permalink` / `path` / `url` / `id`.** Resolution: pass-through only. Astro's `slug` overrides an auto-generated `id`; Zola's `path` overrides both `slug` and filename; Eleventy's `permalink` alone accepts template syntax — a "URL" abstraction across these is a lie [inference].
10. **Obsidian's vault-global name→type binding.** Resolution: before writing any new key into an Obsidian vault, scan sibling notes for that key's existing type; refuse a write that would change it. This is the one place where a correct local edit corrupts a *remote* file's rendering.
11. **JSON frontmatter round-trip.** Obsidian re-saves JSON blocks as YAML [fetched] — flag JSON frontmatter as **byte-preservation-hostile** in the certificate rather than pretending it round-trips.
12. **Multi-block / mid-document YAML (Pandoc).** Resolution: MDMAX's profile is CommonMark-first, so adopt the `commonmark_x` restriction — exactly one block, at position 0 — and have the certificate report `pandoc-markdown` divergence rather than supporting the general case.

### Disagreements between sources, recorded not resolved

- **Custom top-level keys in Hugo**: the docs say create custom fields under `params` and that listed names are reserved [fetched], but do not state whether an *unreserved* top-level custom key is dropped or lands in `.Params`. I did not verify runtime behaviour — **unverified**.
- **`type`**: Hugo reserves it as content-type routing; OKF makes it the single REQUIRED key with free-form values; Dublin Core scopes it to the DCMI Type vocabulary; Foam uses it for graph styling. Four incompatible readings of one four-letter word.
- **`status`**: MkDocs Material treats it as a user-defined identifier configured in `mkdocs.yml` (`new`, `deprecated` predefined, "experimental" since 9.2.0); OKF fixes a closed enum `draft|stable|deprecated`.
- **`description` vs `summary`**: Hugo explicitly says they are "conceptually different"; most other systems collapse them.
- **Author singular/plural**: Docusaurus deprecates `author`/`author_*` in favour of `authors`; Quarto explicitly blesses both ("*Both of these keys can be specified using a singular (`author` and `affiliation`) or plural form*"). Direct contradiction.
- **Open Knowledge Format identity**: `openknowledgeformat.org` is a parked Namecheap domain (HTTP 000 on apex, 200 on `www` serving a domain-auction page) [measured]; the actually-reachable spec is `GoogleCloudPlatform/open-knowledge-format` v0.2 (150 stars) while the largest OKF-labelled repos are third-party toolkits (`zosmaai/pi-llm-wiki` 534, `scaccogatto/okf-skills` 346) [measured]. Which of these is canonical is **unresolved** — I opened the Google spec, not a governance statement.
- **DCMI Metadata Terms** carries "Date Issued 2020-01-20" [fetched]; its "Latest Version" field rendered empty in the scraped HTML, so I cannot assert 2020-01-20 is current — **unverified**.