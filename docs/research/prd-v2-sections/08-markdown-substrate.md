I made no writes or commits; my task was read-only and I only read the five report files under `docs/research/agent-reports-2026-08-29-r8to10/`. The dirty AIOS state is not from me.

## 8. The markdown substrate

**Position:** frontmatter is a CommonMark editor with a profile layer. Everything below defines what the floor is, how a profile is written on disk, which extensions are in scope, which frontmatter keys we read and write, and how typed data lives in plain text without becoming a database.

### 8.1 The spec landscape and what the floor actually is

| Spec / dialect | Status and version | Governance | Extension mechanism | In our floor? |
|---|---|---|---|---|
| CommonMark | 0.31.2, released 2024-01-28; still the current release as of 2026-08 [SS] | commonmark.org spec, John MacFarlane et al. | None. Deliberately no extension syntax. | **Yes — the floor** |
| GitHub Flavored Markdown (GFM) | Living spec, versioned against CommonMark 0.29 | GitHub, `cmark-gfm` reference impl | Fixed extension set, not user-extensible | Yes — the practical floor |
| MyST | Markdown for scientific/technical docs, `myst-parser` | Executable Books / Jupyter Book | Directives + roles (colon-fence `:::`) | Profile target, not floor |
| Pandoc Markdown | Pandoc ≥ 3.x | John MacFarlane | Extensions toggled by name (`+pipe_tables`) and fenced_divs | Degradation target |
| Obsidian Flavored Markdown | Rolling, tied to app version | Obsidian (proprietary) | Callouts, wikilinks, `%%comments%%`, block refs | Degradation target |
| Markdoc | 0.4.x, Stripe | Stripe (MIT) | `{% tag %}` curly-brace tags | Studied, rejected as carrier |
| MDX | 3.x | Vercel/unified | JSX embedded in markdown | Rejected — violates the eval-lane ban |
| remark / micromark | unified collective | Extension via micromark syntax extensions + mdast utils | The implementation substrate we will use | Implementation |

**The floor is not "CommonMark" in the abstract — it is CommonMark 0.31.2 plus the four GFM extensions that every one of the seven certified engines implements: tables, task list items, strikethrough, and autolink literals.** [inference, from the engine matrix in §5]

| Floor rule | Statement | Anti-recommendation |
|---|---|---|
| F1 | Every byte frontmatter writes MUST parse as valid CommonMark 0.31.2 and MUST render as readable prose in a parser that knows nothing about us. | Do NOT emit a construct whose fallback rendering is garbage (raw `{% %}` tags, orphan `:::` colons, bare JSX). |
| F2 | Extensions live inside constructs CommonMark already defines — block quotes (§5.1), fenced code blocks (§4.5), link reference definitions, HTML blocks (§4.6). | Do NOT introduce a new block-level token. That is a new format, and a new format is settled-against. |
| F3 | GFM tables, task lists, strikethrough, autolinks are assumed present. Anything beyond those four is a profile feature and must be degradation-certified. | Do NOT assume footnotes, definition lists, or heading anchors. GFM's footnote support is not in the four-extension core. |
| F4 | We target *round-trip byte preservation*, not *round-trip AST equality*. The splice engine never reserializes an untouched region. | Do NOT adopt a normalize-on-save model. Normalizing is a whole-file rewrite and destroys the one property that distinguishes us. |

**What would falsify the floor choice:** if the degradation certificate shows that a majority of the 7 engines fail one of the four GFM core extensions on a realistic corpus, the floor drops to bare CommonMark 0.31.2 and tables become a profile feature. [inference]

**Where sources disagree:** the research reports treat "CommonMark compliance" as a binary, while the engine-certification work in this repo treats it as a per-construct matrix with partial credit; the matrix view is the one the product implements, because a certificate that says "97% compliant" is not actionable and a certificate that says "this engine drops your callout title" is. [inference]

### 8.2 The carrier decision — how an extension is written on disk

**This section corrects the earlier PRD claim that the fenced-code info string is the single dispatch mechanism for frontmatter extensions. It is not. It is one of two carriers, and it is the wrong one for anything a human is meant to read.** The correction is forced by a structural asymmetry in CommonMark itself, described in the failure-mode row below.

**Carrier scorecard.** Six candidates were evaluated against seven criteria. Scoring is per-criterion pass / partial / fail.

| Carrier | Literal form | Valid CommonMark? | Degrades to readable? | Unclosed-state failure | Human-editable | Nesting | Ecosystem precedent | Verdict |
|---|---|---|---|---|---|---|---|---|
| **Blockquote callout** | `> [!NOTE]` + `> body` | Yes — §5.1 block quote with a text first line | Yes — renders as an indented quote with a visible `[!NOTE]` label | **Structurally impossible — a block quote has no closing marker; it ends when the `>` prefix stops** [measured] | Yes — every line is prose | Partial — nesting requires `> >`, which is legal but ugly | Very high — GitHub, Obsidian, Bear, Zed, Docusaurus | **ADOPT — prose carrier** |
| **Fenced code block** | ` ```fm-data ` + payload + ` ``` ` | Yes — §4.5 fenced code block with an info string | Yes — renders as a code block; content is visible, inert, and copy-pasteable | **Catastrophic — an unclosed fence "runs until the end of the containing block" per CommonMark §4.5, swallowing the remainder of the document** [fetched, spec §4.5] | No — payload is machine-shaped | No — fences do not nest (only outer-fence tricks) | Very high — Mermaid, PlantUML, math, `mermaid`/`dot`/`vega` all dispatch on info string | **ADOPT — opaque-data carrier only** |
| Colon fence / directives (`:::`) | `:::note\nbody\n:::` | No — bare CommonMark renders `:::note` as a literal paragraph | Partial — orphan colons visible as text | Same swallow risk as fences in implementations that treat it as a fence | Yes | Yes — the best nesting story of any candidate | Medium — MyST, Docusaurus, `remark-directive`, the un-merged CommonMark generic-directives proposal | REJECT as primary; accept on *input* |
| Curly tags (Markdoc `{% %}`) | `{% callout type="note" %}` | No | No — raw `{% %}` visible as noise | Unclosed tag corrupts the block | Partial | Yes | Low outside Stripe | REJECT |
| HTML block | `<div class="fm-callout">` | Yes — §4.6 | No — stripped or escaped by most sanitizers; renders as nothing or as raw tags | Unclosed tag consumes until blank line (§4.6 condition 6) | No | Yes | High but declining | REJECT |
| Link reference definition abuse | `[fm:note]: #` | Yes | Yes — invisible (definitions are not rendered) | None | No | No | None | REJECT — invisible is worse than ugly |

**The asymmetry that decides it.** A block quote is delimited by a per-line prefix, so there is no state to leave open — the construct terminates the moment the prefix stops, and a truncated or half-typed callout costs exactly the lines that carry `>`. A fenced code block is delimited by a matching closing fence, and CommonMark §4.5 specifies that if none is found the block runs to the end of the containing block; a single dropped backtick line therefore turns the rest of a 4,000-line vault note into code. [fetched, CommonMark §4.5]

**Decision.**

- **Prose that a human reads → blockquote callout.** `> [!NOTE]`, `> [!DECISION]`, `> [!TASK]`. Recognized by GitHub, Obsidian, Zed, Docusaurus; degrades to a labelled indented quote everywhere else. **Anti-recommendation: do NOT put machine payloads in a callout** — one stray unprefixed line silently ends the block and orphans the rest of the payload as body prose.
- **Opaque machine data → fenced code block with an info string.** ` ```fm-board `, ` ```fm-query `, ` ```fm-schema `. **Anti-recommendation: do NOT put reader-facing prose in a fence** — it renders monospaced, is excluded from search and word count in most tools, and is not editable in a WYSIWYG surface.
- **Accept `:::` directives on input, never emit them.** They arrive from MyST and Docusaurus vaults and must not be corrupted; converting them to our carriers on write would be a whole-file rewrite and violates the splice law.

| Failure mode | Blockquote carrier | Fence carrier | Mitigation we ship |
|---|---|---|---|
| Unclosed construct | Impossible [measured] | Swallows rest of document [fetched §4.5] | Fence writer emits open + close in one splice, never two; validator refuses a file with an odd fence count |
| Lazy continuation | A non-`>` line ends the quote; body text below is orphaned but visible | N/A | Writer prefixes every emitted line; reader treats first unprefixed line as terminator |
| Nested inside a list | Legal (`- > [!NOTE]`); indentation-sensitive | Legal; fence must be indented to the list content column | Splice computes the container indent from the byte range, never assumes column 0 |
| Engine strips the marker | Renders as an ordinary quote — content survives | Renders as a code block — content survives | Both are certified as *lossy-but-readable*, never *destructive* |
| Tab/space indent in container | Callout body may fall out of the quote | Fence close may not match | REFUSE and surface the byte offset rather than guess |

**What would falsify this decision:** if a measured sweep of real-world vaults shows callout-marker recognition below roughly half of the certified engines *and* those engines mangle rather than merely ignore the `[!NOTE]` line, the prose carrier moves to plain bold-labelled blockquotes with no marker. The fence decision is falsified only if a future CommonMark release changes §4.5 unclosed-fence behaviour, which would be a breaking spec change and is not expected. [inference]

### 8.3 The extension catalogue — what we support, what we refuse

Ranked by (ubiquity across the 7 certified engines) × (value to the projection law). Tier 1 ships in v1; Tier 2 is profile-gated; Tier 3 is input-tolerated only; the refusal list is permanent.

**Tier 1 — ship in v1, assumed present in the floor**

| # | Extension | Literal syntax | Why it earns v1 |
|---|---|---|---|
| 1 | GFM tables | ` ```\n\| Col \| Col \|\n\| --- \| --- \|\n\| a \| b \|\n``` ` | The board and the decision-card projections both read tabular rows; tables are the only tabular construct with universal support |
| 2 | Task list items | ` ```\n- [ ] open\n- [x] done\n``` ` | The task projection's entire state lives in one byte (` ` vs `x`) — the cleanest possible splice target |
| 3 | YAML frontmatter | ` ```\n---\nkey: value\n---\n``` ` | Document-level typed data; see §8.4 |
| 4 | Blockquote callouts | ` ```\n> [!NOTE] Optional title\n> Body line.\n``` ` | The prose carrier from §8.2 |
| 5 | Fenced code with info string | ` ```` ```fm-board\n{"group":"status"}\n``` ```` ` | The opaque-data carrier from §8.2 |
| 6 | Strikethrough | ` ```\n~~struck~~\n``` ` | GFM core; free |
| 7 | Autolink literals | ` ```\nhttps://example.com\n``` ` | GFM core; free |

**Tier 2 — profile-gated, degradation-certified before enable**

| # | Extension | Literal syntax | Gate |
|---|---|---|---|
| 8 | Footnotes | ` ```\nText[^1]\n\n[^1]: Note.\n``` ` | GFM + Pandoc + Obsidian yes; not in CommonMark. Certify per-engine before a projection depends on it |
| 9 | Wikilinks | ` ```\n[[Note Title]]\n[[Note\|alias]]\n``` ` | Obsidian/Logseq/Foam native; renders as literal brackets elsewhere. Enable only in a vault profile |
| 10 | Definition lists | ` ```\nTerm\n: Definition\n``` ` | Pandoc/kramdown yes, GFM no. Degrades to two paragraphs — acceptable |
| 11 | Math | ` ```\n$inline$ and $$display$$\n``` ` | GitHub and Obsidian yes; degrades to visible TeX source, which is readable |
| 12 | Mermaid / diagram fences | ` ```` ```mermaid\ngraph TD; A-->B;\n``` ```` ` | Already an info-string fence; costs us nothing and validates the carrier |
| 13 | Heading IDs | ` ```\n## Title {#custom-id}\n``` ` | kramdown/Pandoc syntax; GFM auto-generates instead. Conflict — see below |
| 14 | Highlight | ` ```\n==marked==\n``` ` | Obsidian/Pandoc; renders as literal `==` in GFM |

**Tier 3 — parse on input, never emit**

| # | Extension | Literal syntax | Rule |
|---|---|---|---|
| 15 | Colon-fence directives | ` ```\n:::note\nbody\n:::\n``` ` | Preserve byte-for-byte; project as a callout in our UI; write back unchanged |
| 16 | Obsidian block references | ` ```\nSome text ^block-id\n``` ` | Preserve; never rewrite the id |
| 17 | Obsidian comments | ` ```\n%%hidden%%\n``` ` | Preserve; treat as content, not metadata |
| 18 | Embeds/transclusion | ` ```\n![[Note#Heading]]\n``` ` | Preserve; do not resolve on write |
| 19 | Markdoc tags | ` ```\n{% callout %}…{% /callout %}\n``` ` | Preserve; never generate |
| 20 | Front-of-line HTML blocks | ` ```\n<details><summary>x</summary>…</details>\n``` ` | Preserve; never generate |

**Permanent refusals, with the reason each is refused**

| Refused | Reason | Settled by |
|---|---|---|
| MDX / JSX in markdown | Requires arbitrary client-side evaluation | The eval-lane ban |
| Any new block token of our own | Would constitute a new markdown format | "No new markdown format" |
| A tree-of-record / AST-as-truth model | Contradicts the projection law | "No tree-of-record" |
| Third-party syntax plugins at runtime | Contradicts the no-plugin-marketplace decision, and makes degradation certification impossible (an uncertified syntax cannot be certified) | "No plugin marketplace" |
| Normalizing rewriters (prettier-on-save style) | Whole-file rewrite defeats byte-preserving splice | Splice law |
| Setext headings on *output* | `===`/`---` underlines collide with frontmatter delimiters and thematic breaks; ATX (`#`) is unambiguous. Parse on input, never emit | [inference] |

**Anti-recommendation for the whole catalogue:** do NOT enable a Tier 2 extension because one engine supports it well. The gate is the degradation certificate across all 7, and a projection may only depend on a construct that has a certified fallback. **The falsifier for any Tier 2 promotion is a single certified-destructive result — lossy is acceptable, destructive is not.**

### 8.4 Frontmatter key conventions — being a good citizen

We read the ecosystem's keys and we write a namespaced subset. The rule is: **read broadly, write narrowly, never reformat a key we did not write.**

**Master key table**

| Key | Type | Origin ecosystem | We read | We write | Notes |
|---|---|---|---|---|---|
| `title` | string | Universal (Jekyll, Hugo, Obsidian, Astro, Zola, Eleventy) | Yes | Only if absent and user asks | The single most portable key |
| `date` | date | Jekyll, Hugo, Eleventy | Yes | No | Format conflict — see below |
| `tags` | list\<string\> | Universal | Yes | Yes | Accept both flow (`[a, b]`) and block (`- a`) styles; preserve the style found |
| `aliases` | list\<string\> | Obsidian, Hugo | Yes | No | Obsidian-critical; never reorder |
| `draft` | bool | Hugo, Astro, Zola | Yes | No | Hugo's canonical publish gate |
| `published` | bool | Jekyll (`published: false`) | Yes | No | Jekyll's inverse of `draft` — conflict below |
| `description` | string | Astro, Hugo, Docusaurus | Yes | No | |
| `slug` | string | Hugo, Astro, Docusaurus | Yes | No | |
| `author` / `authors` | string \| list | Hugo (`authors`), Jekyll (`author`) | Yes | No | Singular/plural conflict — below |
| `categories` | list | Jekyll, Hugo | Yes | No | |
| `layout` | string | Jekyll, Eleventy | Yes | No | |
| `permalink` | string | Jekyll, Eleventy | Yes | No | |
| `weight` | number | Hugo, Docusaurus (`sidebar_position`) | Yes | No | |
| `cssclasses` | list | Obsidian | Yes | No | |
| `publish` | bool | Obsidian Publish | Yes | No | Third spelling of the same concept |
| `id` | string | Docusaurus, Logseq | Yes | No | |
| `sidebar_position` | number | Docusaurus | Yes | No | |
| `status` | string | Convention, not spec | Yes | Yes | Our primary board-grouping key |
| `due` | date | Convention (Tasks plugin, Dataview) | Yes | Yes | ISO 8601 date only |
| `fm.profile` | string | **Ours** | Yes | Yes | Which frontmatter profile governs this file |
| `fm.version` | string | **Ours** | Yes | Yes | Profile schema version |
| `fm.projections` | list\<string\> | **Ours** | Yes | Yes | Which views this file opts into |
| `fm.cert` | string | **Ours** | Yes | Yes | Degradation-certificate id for this file's constructs |

**Named conflicts — where ecosystems disagree and we must not silently pick**

| Conflict | Ecosystem A | Ecosystem B | Our rule |
|---|---|---|---|
| Publish gate | Hugo/Astro: `draft: true` means unpublished | Jekyll: `published: false` means unpublished; Obsidian Publish: `publish: true` means published | Read all three. Never write any of them. If two disagree in one file, REFUSE and surface both. |
| Author cardinality | Jekyll: `author: Name` (scalar) | Hugo: `authors: [A, B]` (list) | Read both; normalize in-memory to a list; write back the shape found. |
| Date format | Jekyll accepts `2026-08-28 10:00:00 +0530`; Hugo prefers RFC 3339 `2026-08-28T10:00:00+05:30`; YAML 1.1 auto-typing turns unquoted dates into timestamps | Obsidian users routinely write `2026-08-28` plain | Preserve the literal bytes. Parse permissively for projection; never rewrite the serialization. |
| Tag delimiter | YAML list | Obsidian also allows inline `#tag` in body, and space-separated strings in some vaults | Read the frontmatter list as canonical; index body `#tags` as secondary; write only to the list. |
| Heading anchors | GFM auto-slugs headings | kramdown/Pandoc use explicit `{#id}` | Never generate anchors into the file. Projections compute them. |
| Delimiter | `---` … `---` (YAML) is universal | TOML `+++` (Hugo, Zola); JSON `{ }` (some Eleventy) | Support `---` fully; detect `+++`/JSON and REFUSE to write rather than convert. |
| Key casing | `snake_case` dominant | `camelCase` appears in Astro content collections | Preserve the casing found. Our own keys are always lowercase, dot-namespaced. |

**Rules for the build team**

- Namespace every key we invent under `fm.` — do NOT add bare top-level keys, because a bare `status` or `type` collides with three existing ecosystems and makes our writes indistinguishable from the user's.
- Preserve key order, comments, blank lines, quoting style, and indentation on every write. A frontmatter edit is a splice into the value bytes, not a YAML re-dump. **Anti-recommendation: do NOT use a load-then-dump YAML round trip, even a "round-trip-safe" one — it normalizes quoting and folds long lines, which is a whole-file rewrite by another name.**
- On a duplicate key, REFUSE. YAML 1.1 parsers disagree on last-wins vs error, so any choice we make is wrong somewhere.
- On an unparseable frontmatter block, treat the file as having no frontmatter and edit only the body. Never repair.

### 8.5 Typed and queryable data in plain text

Three layers, in strict precedence order. A projection reads from the highest layer present and never writes to a layer it did not create.

| Layer | Where it lives | Literal syntax | Scope | Typed? | Query cost |
|---|---|---|---|---|---|
| L1 — Document metadata | YAML frontmatter | ` ```\n---\nstatus: doing\ndue: 2026-09-01\nfm.profile: board\n---\n``` ` | Whole file | Yes, via profile schema | O(1) per file |
| L2 — Block metadata | Inline key-value on the line | ` ```\n- [ ] Ship the parser (due:: 2026-09-01) (owner:: sagnik)\n``` ` | One block | Yes, via profile schema | O(lines) |
| L3 — Opaque payload | Fenced block with info string | ` ```` ```fm-query\nfrom: tasks\nwhere: status == "doing"\n``` ```` ` | Where the fence sits | Yes, schema-validated | O(1) per fence |

**Design rules**

- **The file is the database. There is no index of record.** Any cache we build is a projection: derivable from the bytes, discardable, and rebuilt without asking the user. If a cache and a file disagree, the file wins and the cache is wrong. [projection law]
- L2 syntax follows Dataview's `key:: value` inline field convention because it is the largest existing installed base for typed inline data in markdown and it degrades to visible parenthesised text. **Anti-recommendation: do NOT invent a shorter inline syntax** — a novel sigil is a new format, and the settled position forbids one.
- Queries are **declarative and non-Turing-complete**. A query is a filter + sort + group over parsed fields, evaluated by our engine. Do NOT ship a query language with function calls, arbitrary expressions, or user-supplied code — that is the eval lane by another name, and it is settled against.
- Type coercion is explicit and lossless-or-refuse: a value that does not parse as its declared type is surfaced as a typed error on that byte range, not coerced to null and not silently skipped. A silently-skipped row is indistinguishable from a real negative. [Learned Rule #59 class]

**Type set** (deliberately small)

| Type | Literal | Refusal condition |
|---|---|---|
| `string` | any scalar | never |
| `number` | `42`, `3.14` | non-numeric text |
| `bool` | `true` / `false` | any other spelling, including `yes`/`no` — YAML 1.1 coerces these and YAML 1.2 does not, so we refuse rather than pick |
| `date` | ISO 8601 `2026-09-01` | any other format |
| `datetime` | RFC 3339 with offset | naive datetimes without an offset |
| `list<T>` | YAML sequence or flow | mixed element types |
| `enum` | value from the profile's declared set | value outside the set |
| `link` | `[text](target)` or `[[wikilink]]` | unresolvable target is *not* a refusal — it is a warning; links to non-existent notes are legitimate in vaults |

**Anti-recommendation for the layer:** do NOT promote L2 inline fields into L1 frontmatter automatically "for queryability". That is a rewrite of lines the user did not edit, it changes the rendered output, and it is the exact behaviour that makes users distrust editors that touch their files.

**What would falsify this design:** if profiling shows that a full-corpus L2 scan over a realistic vault (order 10⁴ notes) cannot complete inside an interactive budget, L2 gains a persisted index — still a projection, still discardable, still with the file as the sole source of truth, but materialized. That is a performance change, not a change to the law. [inference]
