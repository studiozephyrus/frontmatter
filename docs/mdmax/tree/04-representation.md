---
mdmax: 1
section: 4
title: "Representation — what a markdown file can be made to hold, convey and mean"
slug: 04-representation
lines: 1262
words: 12716
forward_links: [0, 1, 2, 5]
backlinks: [1, 2, 3, 5, 6, 7, 9, 11, 12, 13, 14]
prev: 03-capabilities
next: 05-rendering
---

[← Index](README.md) · [← §3 Capabilities](03-capabilities.md) · [§5 Rendering →](05-rendering.md)

## 4. Representation — what a markdown file can be made to hold, convey and mean

This is the carrier and capability inventory. It answers one question exhaustively: **given that
the file must remain an ordinary `.md` file (decision D6), what can be put into it, where, how much,
who sees it, and what destroys it?**

It is written to be used as a lookup table during implementation. If you are about to write bytes
into a user's markdown file, the answer for your construct is in §4.4, and the reason it is that
answer is in §4.5 through §4.9. If you are about to *recognise* something already in the file
rather than write to it, go to §4.7.

**Read §4.3 first.** It contains the single finding that reframes everything else in this section,
and it is uncomfortable.

---

### 4.1 How to read the evidence in this section

Every claim below carries a tag. The tags are not decoration; several conclusions in this section
reverse when you notice which tier a number sits at.

| tag | means |
|---|---|
| `[measured]` | executed in the research run, output quoted |
| `[verified]` | re-executed by an independent adversarial verifier in the same run, and it reproduced |
| `[primary]` | read from the authoritative source (a spec, a vendor's own docs, an installed source file) |
| `[secondary]` | read from a non-authoritative but credible source |
| `[inference]` | deduced from measurements, not observed directly |
| `[SIMULATED]` | replayed through code rather than read from a live system |

**The corpus.** Every "in the corpus" figure in this section is over the pinned corpus:

```
corpus_id   sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
manifest    docs/engine/research/corpus-manifest.json
size        1,084 files · 25,548,765 bytes
roots       md          756 files · 21,068,853 B · head 02c22ec47a3a73fb25a14b11be233ad3d00a8b48
            knowledge   272 files ·  3,570,923 B · head 464eb666946c8cb4ccf42c68f4464613e5fc4999
            frontmatter  56 files ·    908,989 B · head 798ebbf3250a5b2a53785859d79ae15f55ebebeb
policy      all *.md case-insensitive; skip .git .next .obsidian .trash .venv __pycache__
            build dist node_modules at any depth; skip any dot-directory; skip top-level
            Mirrors/ and Paste/
integrity   re-read and re-hashed during verification: verified=1084 sha_mismatch=0 missing=0
```
`[verified]`

Seven different local-file counts were reported across eighteen research areas before this manifest
existed and **none of them reproduced.** Any figure about local files in any earlier document that
does not cite `sha256:3a010b16…` should be treated as unreproducible until it is re-derived. This
section cites the corpus id on every corpus figure and names the denominator on every rate.

**A second corpus exists and it matters.** One research area measured a different, independently
selected corpus — referred to throughout the research as **Corpus B**: every `*.md` under this
repository's `node_modules` to depth 3, **847 files / 7,733,433 bytes**, i.e. published
documentation written by roughly 850 unrelated third-party authors. `[measured]` Its numbers
disagree with the pinned corpus's numbers sharply and in one case decisively (§4.10, C-1). Where
they disagree, this section reports both.

**One class of claim is absent from this section entirely.** Zero live model calls were made in any
research run. Every statement of the form "this carrier is easier for an AI to read" is a
**prediction**, not a result, and is labelled as such. Nothing here has been measured against a
language model.

**Tool versions**, so a reader can reproduce: `remark-parse` 11.0.0, `remark-stringify` 11.0.0,
`remark-gfm` 4.0.1, `remark-frontmatter` 5.0.0, `remark-rehype` 11.1.2 (both `allowDangerousHtml`
and safe modes), `marked` 16.4.2, `prettier` 3.8.3, and `POST https://api.github.com/markdown` in
both `mode=gfm` and `mode=markdown`. Every one of those except `marked` is already a dependency of
this repository (`package.json`), so the matrix is re-runnable from a clean checkout.

---

### 4.2 What this section does NOT cover

Stated up front, because the gaps change how much weight the table can carry.

1. **GitHub's blob renderer was never measured.** The GitHub Markdown API's `mode=markdown` is
   *not* the blob renderer. Proof that they diverge: GFM alerts render as styled callouts on
   github.com READMEs and as a plain blockquote with a literal `[!NOTE]` through the API's markdown
   mode. `[measured]` An attempt to confirm via `Accept: application/vnd.github.html+json` on two
   repository READMEs returned 0 `markdown-alert` occurrences, but neither README demonstrably uses
   an alert, so that probe is **inconclusive, not negative**. **Treat every "GitHub blob" cell in
   §4.4 as covering the API's `markdown` mode only.** The comment-box (`gfm` mode) results are
   solid — that surface *is* what the API serves.
2. **GitHub Pages was never executed.** The gem install of `kramdown` + `kramdown-parser-gfm` into
   a temporary `GEM_HOME` failed. Every Pages/kramdown cell is a **`[primary]` read of
   `gettalong/kramdown` `doc/syntax.page`** (which documents definition lists, "Attribute List
   Definitions", and `{::comment}`), and the specific statement "`Term` / `: definition` renders as
   a real `<dl>` on GitHub Pages" is **`[inference]`** from that document.
3. **No clipboard was measured.** No browser was driven. The `text/plain` claims (carriers survive,
   because that flavour is the raw source) and the `text/html` claims (invisible carriers are
   deleted, because they render to zero bytes) both follow deductively from measured HTML output,
   but **neither was observed**. This is the weakest column in the table and it is the column §4.8's
   open problem depends on.
4. **Four of the six comparison vocabularies were not read.** DocBook, JATS, DITA and OOXML.
   `docbook/docbook` on GitHub now contains only `['MovedToCodeberg', 'README.md']` and Codeberg is
   outside the research harness's network allowlist; the DITA code-search API returned 401.
   **Do not repeat any DocBook, JATS, DITA or OOXML claim from memory.** §4.9 states only what was
   actually established: TEI (`[primary]`, read verbatim) and HTML5 (`[measured]`, via GitHub's live
   sanitizer).
5. **One corpus, two authors and one AI.** The pinned corpus was written by two people and an agent
   stack. Its 0 link reference definitions, its 0 GFM alerts, its 13,028 wikilinks and its 73.9%
   bash-fence share are all plausibly the signature of one Obsidian-based workflow rather than
   properties of markdown authors. §4.11 specifies the second-corpus experiment that would settle
   this, with pre-registered predictions.
6. **Link-label matching rules are stated but only half-verified.** See §4.6, A1, hazard 6.
7. **The 99.627% re-anchoring figure is quoted twice in this section and has been re-derived by
   nobody** — not by any of the sixteen final-gate areas, not by any of the eighteen capability
   areas, not here. Every use of it below carries that caveat inline.

---

### 4.3 The finding that reframes the whole section

**The best carrier by every objective metric has exactly zero users.**

The orphan link reference definition — a line of the form `[label]: /destination "title"` that no
link in the document actually references — wins on capacity, wins on invisibility, and wins on
survival through both writers. And:

```
mdast `definition` nodes in 1,084 files / 25,548,765 bytes ........ 0
mdast `linkReference`  ............................................ 0
mdast `imageReference` ............................................ 0
mdast `footnoteDefinition` ........................................ 0
mdast `footnoteReference` ......................................... 0
definition-SHAPED lines found by a loose regex over raw bytes ..... 9
  ...of which are actually prose ("  [Topic]: Review said X.") ..... 9
```
`[verified]` — the verifier re-derived the full 21-type AST histogram over all 1,084 sha256-checked
files and every count matched digit-for-digit, then confirmed that `remark` *can* emit a
`definition` node (a synthetic 999-character test produced `paragraph,definition`), so the absence
is a property of the corpus and not an artifact of the harness.

This is the **second independent replication of the same pattern.** The first is
`markdown-it-decorate` — a carrier design the record describes as correct — at **1,094
downloads/week** against `markdown-it-attrs` at **280,897 downloads/week**, a ratio of 257×.
`[measured, api.npmjs.org, last-week window, re-measured 2026-08-01: markdown-it-decorate 1,094
exactly]`

The research area that produced this finding pre-registered its own falsifier — "my headline is
wrong if some carrier scores top on all four axes AND has non-zero live usage" — worked the
candidates one at a time, disclosed a near-miss that cut against itself, and found no counterexample.
The verifier then tested the one candidate the researcher had missed (the `[//]: #` idiom, which the
prior record named as the *other* carrier invisible in 24 of 24 renderer configurations): **0
occurrences in 0 files.** CriticMarkup: **0**. `:::` directives: **0**. `{#id}`: 9 occurrences in 4
files. `[verified]`

**The implication, stated verbatim from the research because it should not be softened:**

> Any carrier MDMAX ships will be read by MDMAX and by nothing else, forever, so it must be
> justified by what MDMAX alone does with it, never by ecosystem uptake.

Three consequences follow directly, and they govern every later subsection:

- **"This carrier is elegant" is not an argument.** The most elegant carrier available has zero
  adoption after a decade of availability. Elegance predicts nothing about uptake.
- **"Other tools will preserve it because it is well-behaved" is not an argument either.** Nothing
  downstream is motivated to preserve a construct nobody recognises. The linkref's greatest
  strength (zero collision risk, because nobody uses it) and its greatest weakness (no author
  recognises it, so no tool has a reason to protect it) are **the same fact.**
- **Therefore prefer a recogniser over a carrier wherever a recogniser is possible.** A recogniser
  writes zero bytes, so it has no degradation story to defend, no round-trip hazard, and no adoption
  requirement. Four of the five additions in §4.6 are recognisers for exactly this reason.

---

### 4.4 The ranked carrier inventory

Ranked on **capacity × invisibility × survival × legibility**. All cells measured against the tool
versions in §4.1 unless the cell says otherwise.

#### 4.4.1 Master table

`∅` = zero bytes reach the rendered output. `TEXT` = the payload appears as literal visible text.
`DEL` = the payload is deleted and nothing takes its place. `RT` = round-trip.

| # | Carrier | Tier | Capacity (measured) | GitHub comment box (`gfm`) | GitHub API `markdown` mode | remark-rehype safe | marked 16.4.2 | remark-stringify RT | prettier RT | Legible raw? | Uses in pinned corpus |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Orphan link reference definition | **1** | label ≤999 / ≤1000; destination and title ≥1,000,000 B locally; 10,000-B title accepted by GitHub | ∅ | ∅ | ∅ | ∅ | byte-identical (single record) | byte-identical | no | **0** |
| 2 | Unknown-language fence + info-string meta | **1** | body 50,000 B verified through GitHub; meta 1,000,000 B locally | body visible; **meta preserved** as `data-meta=` | same | body visible; meta dropped | body visible; meta dropped | byte-identical, 14/14 hazards | byte-identical, body NOT reformatted | **yes** | 0 fences carry meta (of 7,714) |
| 3 | Link / image title on an existing link | **1** | ≥1,000,000 B locally; 10,000 B through GitHub | preserved verbatim in `title=` | preserved | preserved | preserved | identical **only** with `"` delimiter | identical only with `"` delimiter | semi | 23 occupied of 1,838 links |
| 4 | `<span title>` / `<a title>` | 2 | attribute-length bound, not probed | **preserved, value intact** | preserved | **dropped entirely** (no `rehype-raw`) | passes through | byte-stable | byte-stable | yes | 5 |
| 5 | YAML frontmatter | 2 | unbounded | rendered as a table | rendered | rendered | rendered | stable | stable | yes | 907 files (83.67%) |
| 6 | HTML comment | **3** | unbounded | **DEL** | **DEL** | passes through (invisible) | passes through | identical standalone; **NOT identical as a delimited region** | as remark | yes | **330** in 160 files |
| 7 | `id` attribute | **3** | short | survives but namespaced `user-content-` **and lowercased** | survives, namespaced, **case preserved** | dropped without `rehype-raw` | passes | stable | stable | yes | not separately counted |
| 8 | `class` / `data-*` | **3** | — | **stripped** | stripped | dropped | passes | stable | stable | yes | not separately counted |
| 9 | `{#id}` (attribute syntax) | **3** | short | **TEXT** | TEXT | TEXT | TEXT | n/a (not a construct) | n/a | yes | 9 in 4 files |
| 10 | `{: #id .cls}` (kramdown IAL) | **3** | short | **TEXT** (`<p>Paragraph.<br>\n{: #b1 .cls}</p>`) | TEXT | TEXT | TEXT | n/a | n/a | yes | not separately counted |
| 11 | `:::directive` | **3** | unbounded | **TEXT** (`<p>:::note{#b1}<br>\nbody<br>\n:::</p>`) | TEXT | TEXT | TEXT | identical only with the extension registered on **both** parse and stringify | — | yes | **0** |
| 12 | `{{shortcode}}` | **3** | unbounded | **TEXT**, HTML-escaped (`{{&lt; note &gt;}}`) | TEXT | TEXT | TEXT | n/a | n/a | yes | **0** |
| 13 | CriticMarkup `{>>note<<}` | **3** | unbounded | **TEXT**, escaped (`{&gt;&gt;note&lt;&lt;}`) | TEXT | TEXT | TEXT | n/a | n/a | yes | **0** |
| 14 | `[text]{#id}` (bracketed span) | **3** | short | **TEXT** (`<p>Paragraph [text]{#b1} more.</p>`) | TEXT | TEXT | TEXT | n/a | n/a | yes | 0 |
| 15 | Definition list (`Term` / `: def`) | **3** | unbounded | **TEXT** (`<p>Term<br>\n: definition</p>`) | TEXT | TEXT | TEXT | n/a | n/a | yes | 1 |
| 16 | Unicode Tag block (U+E0000–E007F) | **3 — THREAT** | unbounded | **passes through byte-identically** | passes | passes | passes | byte-identical | byte-identical | **no — invisible** | **0** (84 zero-width chars separately) |
| 17 | `[//]: #` comment idiom | **3** | as linkref | ∅ | ∅ | ∅ | ∅ | **CORRUPTED**: `( … )` → `" … "` | — | semi | **0** |
| 18 | GFM alert `> [!KIND]` | **3** | one line | renders as an alert | plain blockquote, `[!NOTE]` visible | plain blockquote | plain blockquote | **CORRUPTED**: `> [!NOTE]` → `> \[!NOTE]` | preserves it | yes | **0** |

`[measured]` for every cell above except rows 9/10/15 Pages behaviour (see 4.4.2) and the
`remark-rehype safe` column for rows 4 and 7, which is `[measured]` as `html_safe_has_payload=False`.

#### 4.4.2 The two columns that are not measurements

These are separated out deliberately rather than folded into the table above, because burying weak
evidence inside a strong-looking grid is how a reference table becomes a lie.

| # | Carrier | GitHub Pages (kramdown) | clipboard `text/plain` | clipboard `text/html` |
|---|---|---|---|---|
| 1 | Orphan linkref | ∅ `[inference]` | survives `[inference]` | **deleted** `[inference]` |
| 2 | Unknown fence | body visible `[inference]` | survives `[inference]` | body survives, meta lost `[inference]` |
| 6 | HTML comment | `{::comment}` is kramdown's own form; HTML comment behaviour not read | survives `[inference]` | **deleted** `[inference]` |
| 9/10 | `{#id}` / `{: #id}` | **implemented as an Attribute List Definition — renders correctly** `[primary]` read of `gettalong/kramdown` `doc/syntax.page` | survives | becomes a real `id` |
| 15 | Definition list | **implemented — renders as a real `<dl>`** `[inference]` from the same primary read | survives | becomes a real `<dl>` |
| 16 | Unicode Tag block | not read | survives `[inference]` | survives `[inference]` |

**The consequence of rows 9, 10 and 15 is the single most awkward fact in the inventory and it has
a name: GitHub is not one target.** The same bytes are correct on GitHub Pages (Jekyll's default
engine is kramdown, which implements both the IAL and the definition list) and broken on the GitHub
blob view and in the GitHub comment box. Shipping any of those three constructs means **shipping a
file that is correct on one GitHub surface and visibly broken on another.** Render targets must
therefore be modelled as **`(product, surface)` pairs**, not as products.

Three further disagreements *inside GitHub's own public API* were measured, which is the strongest
available evidence that the pair model is necessary rather than fastidious:

| construct | `mode=gfm` | `mode=markdown` |
|---|---|---|
| `id="PAYLOAD7Q"` | `id="user-content-payload7q"` — **lowercased** | `id="user-content-PAYLOAD7Q"` — **case preserved** |
| `> [!NOTE]` | rendered as a `markdown-alert` div | plain `<blockquote>` with `[!NOTE]` visible |
| `$$…$$` math | routed to the math renderer | literal |

`[verified]` — all six API responses byte-identical to the researcher's on independent re-probe.

#### 4.4.3 Per-carrier hazards, measured

Every hazard listed here **fails silently**. That is the property that makes them worth a page.

**Carrier 1 — orphan link reference definition.**

- *It cannot interrupt a paragraph.* `Alpha.\n[k]: /a "t"` is **one paragraph**, and the definition
  becomes visible text. It must be preceded by a blank line. `[measured]`
- *A raw `"` inside the title destroys the definition*, and `remark` then emits a **visible escaped
  line**: `[fm:k]: /a "{"a":1,"b":[2,3]}"` → `parsedAsDef=false` → output
  `Alpha.\n\n\[fm:k]: /a "{"a":1,"b":\[2,3]}"\n`. `[verified]`
- *A blank line inside the title does the same.* `[verified]`
- *`remark` and `prettier` normalise the delimiter to different canonical forms.*
  `[fm:k]: /u ({"id":"c3","n":1})` → remark emits double-quoted-with-backslashes, prettier emits
  single-quoted; `[a](/u "he said \"hi\"")` → prettier rewrites to `[a](/u 'he said "hi"')`. **A
  repository running prettier in CI and remark in the app will ping-pong those bytes forever.**
  `[verified]`
- *The only payload encodings stable through both writers* are **base64url**, **percent-encoding**,
  and **backslash-escaped JSON**: `[fm:k]: /u "eyJpZCI6ImMzIn0"` and
  `[fm:k]: /u "%7B%22id%22%3A%22c3%22%7D"` both give `remarkID=true prettID=true`. `[verified]`
- *The 999/1000 trap.* GitHub's `cmark-gfm` caps link labels at **1000** characters; CommonMark and
  micromark cap them at **999**. At exactly 1000, a link reference definition is **invisible on
  GitHub and visible junk in every conformant renderer** — a one-character-wide trap in the
  highest-ranked carrier. Sources verified at the exact lines claimed:
  `commonmark-spec spec.txt:7997` "label can have at most 999 characters inside the square
  brackets"; `github/cmark-gfm src/parser.h:13` `#define MAX_LINK_LABEL_LENGTH 1000`;
  `micromark-factory-label/dev/index.js:17` "labels in markdown are capped at 999 characters in the
  string." `[primary, all three re-read at the stated line numbers; the micromark line was re-read
  again while writing this section from this repository's own node_modules]` Behaviour measured both
  ways: GitHub `gfm` returns 8 bytes (`<p>x</p>`, definition consumed) at 998/999/1000 and visible
  junk at 1001+; `remark-parse` gives `paragraph,definition` at 998/999 and `paragraph,paragraph` at
  1000+. **This is the best-sourced finding in the entire carrier corpus.**
- *A multi-record tail block is not byte-stable through `remark-stringify` — regardless of label
  uniqueness.* `remark-stringify` inserts a **blank line between consecutive definitions**.
  Prettier, by contrast, **preserves** the multi-record form. So a repository running both will
  ping-pong the tail block exactly as it ping-pongs the title delimiter. **Correction to the
  research's own stated reason:** the original report attributed the failure to `remark-stringify`
  *dropping duplicate labels*; the verifier proved that is false — five identical labels go in and
  five come out — by showing that three *unique* labels fail byte-identity in exactly the same way.
  The rule ("one record per document") is right; the mechanism given for it was wrong. `[verified,
  REFUTED as originally stated]`

**Carrier 2 — unknown-language fence.**

- *The discriminator is language recognition, not the meta slot.* ```` ```fm:meta v1 ```` yields
  `<pre lang="fm:meta" data-meta="v1" class="notranslate">`; ```` ```js fm=PAYLOAD7Q ```` yields
  `<div class="highlight highlight-source-js">` with **the meta gone** and the body re-tokenised
  into `pl-*` spans. `[verified]`
- *Prettier reformats a known-language body and does not reformat an unknown-language one.*
  ```` ```js\nconst a=1;\n``` ```` survives remark byte-identically but prettier emits
  `const a = 1;`. **Any content hash committed over a known-language fence body is invalidated by a
  prettier run.** `[verified]`
- *The reserved-word list is real, enumerable — and the version of it in the research is wrong.*
  `github-linguist/linguist` `lib/linguist/languages.yml`, fetched 2026-08-01, 162,266 bytes:
  **816 language entries + 424 aliases = 1,240 distinct tokens.** The cardinality is correct.
  **The membership is not:** Linguist keys its alias index on `name.downcase.gsub(/\s/,'-')`, and
  **191 of the 816 names contain a space**, so the naively lowercased set contains 191 members that
  are *not* reserved and omits 191 tokens that *are* — a **15.4% error rate, erring in the dangerous
  direction.** Live probe: ```` ```vim-script foo=1 ````, which the naive set reports as free,
  routes to `highlight-source-viml` and **destroys the meta**. Same exposure for `abap-cds`,
  `ant-build-system`, `answer-set-programming`, `adblock-filter-list` and 187 others.
  `[verified, REFUTED as originally stated]`
  **Verified free:** `mdmax`, `mdmax-decision`, `mdmax.record`, `decision`, `dataview`, `base`,
  `canvas`, `record`, `meta`, `plaintext`. **Verified reserved:** `json`, `yaml`, `text`, `md`,
  `mermaid`, `console`, `jsonc`, `vim-script`.
- *`lang` on `<pre>` is the BCP 47 natural-language attribute.* `lang="mdmax.record"` is an invalid
  language tag, which GitHub itself hedges by adding `class="notranslate"`. Harmless today; it is
  the kind of thing a future sanitizer tightens. `[verified]`
- *Four spaces of indentation, or one backtick inside a backtick-fence info string, disables fence
  dispatch with no error anywhere.* `[measured, docs/engine/PLAN.md §15.4]`
- *Occupancy varies by 2,400× across corpora.* Fence meta is occupied in **0 of 7,714** fences in
  the pinned corpus, **1 of 5,007 (0.02%)** in Corpus B (the value is `npm2yarn`), and **6,201 of
  12,916 (48.01%)** in the Docusaurus repository, dominated by `title="docusaurus.config.js"`
  (2,136), `npm2yarn` (1,012), `title="sidebars.js"` (408). **`title=` already owns this channel in
  Docusaurus-shaped repositories, so any MDMAX use must be namespaced (`fm:`).** `[measured]`
- *Every fence is a hole in the graph a linker is trying to build.* A link inside a fence does not
  appear in the mdast link inventory; frontmatter inside a fence produces no `yaml` node. No link
  checking, no backlinks, no search indexing, no rename propagation inside a fence. **A design in
  which the important structure has migrated into fences has recreated MDX's problem with extra
  steps.** `[measured, docs/engine/PLAN.md §15.4]`

**Carrier 3 — link / image title.**

- *It is availability-bound, and that is what disqualifies it for block identity.* The pinned corpus
  has **1,838 inline links** (CommonMark-only parse) against **142,802 paragraphs** and **88,434
  list items** — a ratio of **77.7 paragraphs to 1 link.** You cannot attach a durable name to most
  of a document through a slot that only exists where the author happened to write a link.
  `[verified]`
- *It is not semantics-free, and the research's claim that it is has been refuted.*
  `@types/mdast/index.d.ts` lines 103–107, verbatim: *"Advisory information for the resource, such
  as would be appropriate for a tooltip."* `html.spec.whatwg.org/multipage/dom.html`, verbatim:
  *"Relying on the title attribute is currently discouraged as many user agents do not expose the
  attribute in an accessible manner as required by this specification…"* And **pandoc has already
  burned a magic prefix in this exact slot** — its changelog records adding `fig:` as a title for
  images with captions, consumed as a control signal, for a decade. `[verified, REFUTED as
  originally stated]`
- *Consequently "zero visual noise" is false.* A populated title produces a **hover tooltip on every
  typed link**, which is keyboard- and touch-inaccessible per the specification quoted above.
  `[verified]`
- *Round-trip identity holds only for the double-quote delimiter.* `[a](./x.md '@rel')` and
  `[a](./x.md (@rel))` both normalise to the double-quoted form. `[verified]`
- *Occupancy: three different denominators are in circulation.* See §4.10, C-2. Do not quote
  "99.94% unoccupied" without stating which one.

**Carrier 6 — HTML comment.** See §4.5, correction (a). Additional measured hazard: the
**standalone** comment round-trips byte-identically, but the **delimited-region** form
(`<!-- open -->` … content … `<!-- /close -->`) does **not** — `remark-stringify` inserts blank
lines around both markers. `[verified]` Any design that uses comment-delimited regions for
transclusion or generated blocks inherits that instability.

**Carrier 7 — `id`.** GitHub namespaces it to `user-content-*` **and lowercases it in `gfm` mode
while preserving case in `markdown` mode.** Any case-sensitive identifier — base64url, nanoid, ULID
— **collapses when a document passes through the comment box.** `[verified]` This alone disqualifies
`id` as an identity carrier for this product, independently of every other argument.

**Carrier 16 — the Unicode Tag block.** See §4.5, correction (c).

---

### 4.5 The three corrections

Each of these overturns a belief that is stated somewhere in the prior record. Each is written as a
correction rather than as a finding, because a reader who has read the earlier documents will
otherwise carry the old belief forward.

#### (a) The HTML comment is TIER 3 — DO NOT USE. Correcting "invisible, therefore safe."

**Prior belief**, recorded in the earlier consolidated plan's 24-renderer matrix
(`docs/mdmax/PLAN.md` v1.0.0 §4.3): the HTML comment produces *"8 distinct outputs — visible in 2,
payload destroyed in 10, including GitHub's blob renderer which deletes it outright."* That framing
places the failure in the *blob view* and implicitly leaves the comment usable elsewhere. The
broader ecosystem belief is stronger still: HTML comments are markdown's de-facto machine channel,
used for lint pragmas (`markdownlint-disable`), generated-region boundaries
(`all-contributors-list`, `vim-markdown-toc`, `prettier-ignore-start/end`), and — in two shipping
Obsidian plugins — for mutable machine state, with Spaced Repetition writing scheduling data into
`<!--SR:!2023-09-02,4,270-->`. `[measured]`

**Correction, measured:** GitHub **deletes the HTML comment in BOTH API modes**, not only in blob
view.

```
POST api.github.com/markdown
  "Alpha text.\n\n<!-- PAYLOAD7Q -->\n\nBeta text."
    mode=gfm      -> "<p>Alpha text.</p>\n\n<p>Beta text.</p>"
    mode=markdown -> identical, plus a trailing newline
  "- item\n  <!-- PAYLOAD7Q -->\n- item2"
    mode=gfm      -> "<ul>\n<li>item\n\n</li>\n<li>item2</li>\n</ul>"
```
`[verified]`

`mode=gfm` **is the comment box.** So a comment written into a document and then pasted into a pull
request or an issue is **destroyed silently, in the surface where review actually happens** — which
is the exact surface this product exists to serve.

**And there are already 330 of them in the pinned corpus**, across 160 files. `[measured]` The
verifier's independent AST-native classification gives 313 occurrences in 156 files (14.4%);
`[verified]` the two counts differ by masking policy, not by phenomenon.

**Why this matters beyond the carrier question:** it re-derives decision **D2** (*comments and
history live OUTSIDE the file*) from a completely different direction. D2 was reached as a product
decision. It is now also a *rendering* fact: there is no in-file annotation channel that survives
the review surface. **Do not build an in-file comment or annotation carrier.** The honest answer for
per-block comments, per-span provenance and revision history is a **sidecar**.

#### (b) The `title` attribute SURVIVES GitHub's sanitizer with its value intact. Correcting "only `id` survives."

**Prior belief**, stated in the record: *"GitHub strips class, style and data-* entirely; only `id`
survives, namespaced."*

**Correction, measured — it is incomplete in two ways, and both change design decisions.**

```
mode=gfm
  <span title="PAYLOAD7Q">x</span>          -> <p><span title="PAYLOAD7Q">x</span></p>
  <a href="/a" title="PAYLOAD7Q">x</a>      -> survives with title intact
  Alpha <span data-fm="PAYLOAD7Q">x</span>  -> <p>Alpha <span>x</span> text.</p>     (data-* gone)
  Alpha <span class="…">x</span>            -> class identically stripped
  Alpha <span id="PAYLOAD7Q">x</span>       -> id="user-content-payload7q"           (LOWERCASED)
mode=markdown
  Alpha <span id="PAYLOAD7Q">x</span>       -> id="user-content-PAYLOAD7Q"           (case PRESERVED)
```
`[verified — all six responses byte-identical on independent re-probe]`

A second, independent research area extended the same probe and produced the full surviving and
stripped sets:

| GitHub **preserves** | GitHub **strips** |
|---|---|
| `title`, `lang`, `dir`, `align`, `width`, `height`, `colspan`, `rowspan`, `cite`, `itemprop` | `rel`, `target`, `aria-label`, `role`, `download`, `loading`, `itemscope`, `itemtype` |

`[verified — re-probed live 2026-08-01, byte-for-byte]`

**The asymmetry is the finding.** The semantically *correct* channel for a typed link — HTML `rel` —
is destroyed. The semantically *vacuous* one — `title` — survives untouched. The general principle,
and it inverts the obvious approach:

> **The channels that survive sanitisation are exactly the ones the specification assigns no meaning
> to. Ride semantics-free slots; never ride the semantically correct attribute.**

Two caveats attach to this correction and neither is optional. First, `title` is *low-occupancy*,
not *semantics-free* (§4.4.3, carrier 3) — it is the advisory/tooltip channel, the HTML
specification discourages relying on it, and pandoc already consumed a prefix in it. Second,
`<span title>` is **dropped entirely by `remark-rehype` without `rehype-raw`** (`measured` as
`html_safe_has_payload=False`), so it does not reach a consumer that renders through the safe HTML
path — which is most of them.

#### (c) The Unicode Tag block is NOT stripped by GitHub. It is a threat to FILTER, not a carrier.

**Prior belief**, produced by this research programme's own first pass: "GitHub strips the Unicode
Tag block."

**That reading was a harness artifact and the researcher caught and disclosed it mid-run.** The
first pass searched for the *ASCII* string inside output that contained *tag characters*, and
reported `has=False`. The verifier re-tested: **9 tag characters sent through
`api.github.com/markdown`, all 9 survived intact, in both modes.** `[verified]` The Tag block also
passes `remark-stringify` and `prettier` byte-identically and renders to nothing visible anywhere.

**So the earlier, more pessimistic reading was right and the correction ran in the unflattering
direction.** A block of Unicode Tag characters is a perfectly invisible, perfectly surviving,
completely illegible channel that any text can carry through this product, GitHub, and both clipboard
flavours without a single visible artifact.

**Ruling: DO NOT USE, and FILTER.** MDMAX must strip or flag U+E0000–U+E007F on ingest and on paste.
Reasons, in order of severity:

1. It is the standard prompt-injection smuggling channel for text destined for a language model.
   This product's entire premise is that documents are read by models.
2. It is invisible to the human reviewer by construction, so no amount of care at the review surface
   catches it.
3. The pinned corpus contains **`tagblock_chars=0`** — so filtering costs nothing today — alongside
   **84 zero-width characters**, which are the same class of problem one severity level down.
   `[measured]`

This is the one place in this section where the recommendation is to **remove** a capability rather
than add one, and it should be in the ingest path before the first external document is imported.

---

### 4.6 The refuted premise: authors do NOT reach for raw HTML

Every "markdown needs more constructs" argument in this project's history has rested on an
unexamined premise: that when markdown fails an author, the author reaches for raw HTML, and
therefore the HTML in a corpus is a readout of the missing-construct list.

**In the pinned corpus that premise is false.**

```
files containing real HTML5 tags in prose ...... 37 of 1,084  (3.4%)   [researcher]
                                            ...... 24 of 1,084  (2.2%)  [verifier, AST-native]
total occurrences .............................. 3,583
```

And the distribution is **degenerate**:

| what | count | where |
|---|---|---|
| `<strong>` | **1,833** | **ONE file** — `md/Zephyrus/ecosystem.md` |
| `<br>` | 936 of 987 | **two near-duplicate skill files** (`Pp Klaviyo/skill.md` and `…/workflow.md`), 468 each; the remaining 51 in one further file |
| `<sub>` | 184 | one file |
| `<details>` | **3** | across the entire 25,548,765 bytes |

`[verified]` — with one correction the verifier insisted on: the two `<br>`-heavy files are **near
duplicates, not byte-identical** (sha256 prefixes `7bf5015a47e2df93` and `c7dfc2f44bb0e557`). The
concentration is exact; the word "identical" was not.

The verifier attacked this finding and **made it stronger rather than weaker.** Its first suspicion
was that the number was a kill: the AST reports `html` nodes in **245 files (22.6%)**, six times the
claimed 37. Classifying all **7,720** `html` nodes by kind resolved it:

| kind of `html` node | occurrences | files |
|---|---|---|
| real HTML5 tags | 5,989 | **24 (2.2%)** |
| angle-bracket placeholders | 1,418 | **201 (18.5%)** |
| HTML comments | 313 | 156 (14.4%) |

**The 245-file figure is dominated by placeholders and comments, not by raw HTML.** `[verified]`

**What authors actually strain against**, in this corpus, ranked:

| # | strain | measured | what it wants |
|---|---|---|---|
| 1 | **bold-run list items** (description-list shape) | **18,462** of 88,434 list items (20.9%); verifier's AST-native recount **19,402 (21.94%)**, of which **8,044** carry a separator, across 539 files | a **recogniser** |
| 2 | **wikilinks** | **13,028** exactly, in 501 files | a **resolver** |
| 3 | **angle-bracket placeholders** | **1,431** tokens, 186 distinct names, in **219 of 1,084 files (20.2%)** | a **linter** |

`[verified — wikilinks reproduce EXACTLY at 13,028; description-list counts reproduce higher than
claimed, so the reported figure is the conservative one]`

**Placeholder notation appears in six times more files than real HTML** (219 vs 37 by the
researcher's counts, 8.4× by the verifier's stricter 201 vs 24).

**Two of the three want a recogniser and the third wants a linter. None of them wants a construct.**
That is the empirical basis for §4.7's shape: one carrier, four recognisers.

**What has essentially zero demand in this corpus**, which is at least as useful to know, because
several of these have been proposed:

```
GFM alerts (> [!NOTE]) ................. 0
bold-text admonitions .................. 1
checkboxes inside table cells .......... 0        (4 in 114,762 cells across the 8-corpus sample)
footnote references the parser sees .... 0
math blocks ............................ 8        (inline math: 1,244)
multi-line table cells via <br> ........ 51       (great majority in three files)
fences carrying an info-string meta .... 0        of 7,714 fences (bash: 5,700 = 73.9%; mermaid: 10)
Unicode Tag block characters ........... 0        (zero-width characters: 84)
::: directives ......................... 0
CriticMarkup ........................... 0
Hugo shortcodes ........................ 0
emoji used as status .................. 15,764 characters
```
`[measured]`

**The strain is not where the theory said it would be.** The construct with the largest install-
weighted demand in the plugin ecosystems (semantic block types, callouts) has **zero** instances
here; the construct with no plugin at all (the description list) has **eighteen thousand**.

---

### 4.7 The top five additions: ONE new carrier and FOUR recognisers

Ranked by (strain evidence) × (rideable without new syntax) × (a plugin cannot close it).

Three of these five write **zero bytes** into any user file. That is not modesty; it is the direct
consequence of §4.3. A recogniser has no degradation story because nothing changed on disk.

---

#### A1 — The tail record. The only new carrier.

**Status: RECOMMENDED, with an unresolved collision (see §4.9). Not decided.**

**What it is.** A single link reference definition, blank-line isolated, placed at the end of the
file, carrying an encoded identity cache:

```markdown
…the last paragraph of the document.

[fm:b1]: #fm "v1.<base64url payload>"
```

**What it writes.** Roughly `20 + len(payload)` bytes, once per document. Nothing else in the file
changes, ever.

**What it holds.** The block-anchor cache: for each anchorable block, the identity the engine
already computed, so a cold read does not have to recompute anchors over the whole document.

**Degradation, measured end to end:**

| consumer | result |
|---|---|
| GitHub API `mode=gfm` (the comment box) | **0 bytes** |
| GitHub API `mode=markdown` | **0 bytes** |
| `remark-rehype` safe | **0 bytes** |
| `remark-rehype` with `allowDangerousHtml` | **0 bytes** |
| `marked` 16.4.2 | **0 bytes** |
| Obsidian / VS Code preview | nothing rendered |
| `remark-stringify` 11.0.0 | **byte-identical** |
| `prettier` 3.8.3 | **byte-identical** |

`[verified — the verifier re-ran the shipped single-record form itself and reproduced all eight
cells]`

**The eight rules. Every one of them exists because breaking it fails SILENTLY.**

1. **One record per document.** Multi-record tail blocks are not byte-stable through
   `remark-stringify` (blank-line reflow), while prettier preserves them — a CI ping-pong.
2. **Blank-line isolated, tail-placed.** A definition that follows text without a blank line is
   absorbed into the paragraph and becomes visible.
3. **Label ≤ 999 characters, and in practice ≤ 64.** At exactly 1000, GitHub and every conformant
   renderer disagree.
4. **Title delimiter is `"` only.** Never `'…'`, never `(…)`.
5. **Payload is base64url or percent-encoded.** Never raw JSON, never a raw `"`, never a blank line.
6. **Lowercase, whitespace-free labels.** micromark normalises a link identifier by collapsing
   markdown whitespace, trimming, then `.toLowerCase().toUpperCase()` —
   `node_modules/micromark-util-normalize-identifier/dev/index.js`, read from this repository this
   session. `[primary]` So `[fm:B1]` and `[fm:b1]` are **the same label**, and a label containing a
   newline or tab is folded for matching. *This rule is derived from the normaliser's source, not
   from an executed collision test; the collision itself is `[inference]` and should be pinned by a
   fixture before A1 ships.*
7. **Never a backtick inside a backtick-fence info string, and never four-space indentation.** Both
   silently disable dispatch.
8. **Strip on export.** See §4.9 — this is the rule with no clean answer.

**What A1 is NOT.** It is a **cache over content-derived re-anchoring, never a replacement for it.**
The anchoring algorithm (`docs/engine/PLAN.md` §1.1a) measured 99.627% correct / 0.050% false /
0.323% refusal over 41,642 block-versions — *a figure that no research area has re-derived, that is a
BLOCK figure while comments anchor RANGES (the one range replication gives 3.44×, not 30×), and
which the current plan says must not be published until it is re-derived on a corpus this team did
not write.* A1 must be correct-by-construction under the assumption that its own contents are
**absent or stale**, because on every exported document they will be.

**What would kill A1**, taken from the research's pre-registered kill conditions:

- The second corpus shows link reference definitions in active use above ~**0.5 per file** —
  collision risk appears and the "empty slot" argument dies. **This condition is arguably already
  tripped: see §4.10, C-1.**
- The clipboard measurement shows `text/plain` also dropping them — then the carrier has no path
  through the copy/paste loop that is this product's whole point.
- The export guarantee (D4) requires stripping tail records on export — in which case A1 is a cache
  with a 100% miss rate on every exported document and should be deleted rather than shipped.

---

#### A2 — Description-list recogniser. Zero bytes.

**Status: RECOMMENDED. Largest coverage, lowest risk in the inventory.**

**What it does.** Lifts the shape `- **Term** — definition` (and `- **Term**: definition`) into a
`descriptionList` node in the tree. **The source file is not touched.**

**Coverage.** 7,938 unambiguous instances (bold run followed by an explicit separator: em dash, en
dash, hyphen or colon), 18,462 including the weaker bold-run-without-separator form, out of 88,434
list items (20.9%). `[measured]` The verifier's AST-native recount — which removes a
numerator/denominator mismatch in the original method — gives **19,402 (21.94%) bold-opening list
items, of which 8,044 (9.10%) carry a separator, across 539 files**, so the shipped figure is the
conservative one. `[verified]`

**Degradation.** Exactly what it is today in every renderer, because nothing changed. There is no
degradation to describe. This is the entire argument for recognisers.

**Precision is the real engineering problem, and a second research area measured it.** Over a
different (8-corpus, 4,074-file) sample, splitting the same predicate by which sub-rule fired:

| sub-rule | count | is it a record? |
|---|---|---|
| bold run then `:` | 5,729 | **yes, unambiguous** |
| bold text itself ending in `:` | 11,336 | **yes, unambiguous** |
| bold run then em/en dash or hyphen | 12,951 | **mixed** |
| bold text ending in `.` | 5,764 | **NO — false positive** |

`[verified]` The `.`-terminated bucket is a **bolded lead sentence**, not a record — verbatim
samples: *"**Stable Zustand selectors only.** Never return a new object/array/Set from a selector"*.
The dash bucket is genuinely mixed: *"**Up to ₹5,000** — UPI app prompts biometric"* is a record;
*"**Full redesign of the landing page** — modern, credible, conversion-focused"* is prose apposition.

**Therefore A2 must not fire on `**Sentence.** rest`,** and its dash rule needs a hand-labelled
precision gate before it drives anything user-visible.

**Two honesty caveats on the coverage number.** (1) Description-list strain is **4.89× higher in
AI-authored text than in human-authored text** in the 8-corpus sample — 34.43 per 1,000 lines versus
7.03 — and the pinned corpus is 93.7% AI-authored on this metric. `[verified]` (2) Some of it is not
strain at all but **template output**: the vault's `proj-*.md` files are emitted by a snapshot script
that prints `**Last commit:** …`, `**Commits:** …`, `**Remote:** …`. **Generated markdown counted as
authored strain is a defect**, and the count above has not been deduplicated by generator template.

---

#### A3 — Placeholder recogniser and certificate warning. Zero bytes.

**Status: RECOMMENDED. The highest-severity finding in the corpus and the cheapest fix in the
report.**

**The problem.** Markdown has no construct for *"a thing you substitute."* So authors write
`<target-file>`, and CommonMark classifies it as raw HTML, and **GitHub deletes it.**

```
POST api.github.com/markdown mode=gfm
  "Run the tool with `--flag` on <target-file> and then <name> is bound."
  -> "<p>Run the tool with <code class=\"notranslate\">--flag</code> on  and then  is bound.</p>"
     BOTH placeholders gone, replaced by nothing.
```
`[verified — reproduced byte-for-byte, then extended: 'A <N> B <one-line> C <concise> D <command>
E <capability> F <api-slug> G <dim> H <skill> I.' -> '<p>A  B  C  D  E  F  G  H  I.</p>', so
hyphenated and capitalised names are deleted too]`

**Scale.** 1,431 tokens, 186 distinct names, in **219 of 1,084 files (20.2%)**. `[measured]` Two
independent replications: AST-native gives 1,418 / 176 / 201 files (18.5%); a line-based regex gives
1,155 / 174 / 217 (20.0%). `[verified]` **The top tokens match exactly across methods** —
`<one-line>` 102, `<concise>` 92, `<command>` 87, `<capability>` 69 — with `<n>` at 223 in 113 files,
`<name>` 47, `<url>` 27. The occurrence count and the deletion behaviour are solid; the file count is
the softest number, at 201–219 depending on masking.

**There are three failure modes, not one, and no renderer agrees with another.** The headline
"GitHub silently deletes them" undersells the finding:

| input | GitHub `gfm` output | mode |
|---|---|---|
| `Filed <C> new issue<s>, added <E> comment<s> on existing issues.` | `<p>Filed  new issue<s>, added  comment<s> on existing issues.</s></s></p>` | **`<s>` opens a strikethrough GitHub auto-closes at paragraph end — active markup that corrupts the rest of the paragraph** |
| `Set <title> and <base> before the run.` | `<p>Set &lt;title&gt; and  before the run.</p>` | **`<title>` ESCAPED and visible; `<base>` DELETED — in one line** |
| `You mentioned <Source A>, <Source B>, and <Source C>.` | `<p>You mentioned <source>, <source>, and <source>.</p>` | attributes stripped, content deleted |

`[verified — all three reproduce verbatim, including the trailing `</s></s>` auto-close]`

Collision counts in the pinned corpus: `<base>` **66**, `<title>` **32** (verifier: 31), `<s>` **4**.
One correction the verifier made and it should be carried: **`<source>` 20 does not belong in that
list** — bare `<source>` occurs **0** times; those 20 are real `<source …>` tags with attributes in 2
files, a different construct. `[verified]`

**The remediation is one character and it is verified.**

```
`<target-file>`     -> <code>&lt;target-file&gt;</code>    preserved
\<target-file\>     -> &lt;target-file&gt;                 preserved
```
`[measured]`

**What A3 does.** Detects bare angle-bracket tokens that are either (i) not valid HTML5 element
names, or (ii) valid element names being used as metavariables, and emits:
*"GitHub will DELETE these N tokens from rendered output; wrap them in backticks."*

**Nothing else does this.** `markdownlint`'s only relevant rule is **MD033 / `no-inline-html`**
(`raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md` line 1364), which fires on
**all** inline HTML including legitimate `<br>` and `<details>` — the same low-precision failure that
gets a naive broken-link checker switched off. `[primary]` The npm registry returned
`{"error":"Not found"}` for `markdown-it-placeholder`, `remark-lint-no-angle-placeholder` and
`markdown-placeholder-lint`. `[measured]`

**Pre-registered gate.** Precision must exceed **90%** against a 200-document hand-labelled ground
truth. **Below 80%, A3 does not ship** — it will be switched off exactly as the naive link checker
was.

---

#### A4 — Inline-role recogniser over `inlineCode`. Zero bytes.

**Status: RECOMMENDED.**

**The problem.** Markdown offers exactly **one** inline semantic slot, and the corpus is using it for
at least **13 distinct jobs**. `inlineCode` is the second-most-common leaf node in the entire corpus
at **76,118 occurrences.** `[verified — exact]`

Measured classification over 77,516 spans with fenced code masked (the 1,398 delta from the AST count
is spans inside constructs the line-based masker does not reach):

| role | count | share |
|---|---|---|
| other (**unclassified**) | 19,695 | 25.4% |
| identifier | 17,792 | 23.0% |
| filepath | 13,805 | 17.8% |
| prose in backticks | 10,220 | 13.2% |
| constant / environment variable | 5,652 | 7.3% |
| filename | 2,717 | 3.5% |
| command | 2,547 | 3.3% |
| CLI flag | 2,219 | 2.9% |
| data literal | 1,598 | 2.1% |
| function call | 729 | 0.9% |
| numeric value | 337 | — |
| URL | 171 | — |
| empty | 34 | — |

**The buckets sum to exactly 77,516**, so the internal arithmetic is clean. `[verified]`

**But one row of that table is OVERSTATED and must not be quoted.** The verifier could not replicate
**"prose in backticks 10,220 (13.2%)"**. The entire plausible prose pool — spans with ≥2
whitespace-separated words — is **21,398 (27.6%)**; a seeded random sample of 30 drawn from it
contained roughly **5** genuine prose spans (~17%), implying **≈3,600 spans ≈ 4.6%**, about a third
of the claim. A seeded random 30 from the single-word pool (72.3% of all spans) contained **zero**
prose. There is also a **denominator swap**: 13.2% is 10,220/77,516 while the headline count is
stated as 76,118 (10,220/76,118 = 13.4%). `[verified, OVERSTATED]`

**What survives and what to write down:** *76,118 `inlineCode` spans carry many distinct roles, and
a quarter of them are unclassified.* Drop "13.2% are not code at all"; the independent estimate is
**4–5%**. **A4 is unaffected**, because a role recogniser does not depend on the prose share.

**What A4 does.** Classifies each `inlineCode` span into a role in the tree — filepath, command,
identifier, CLI flag, constant, prose — so that search, cross-reference and any model-facing
projection can treat a filepath as a filepath. **No bytes written, so there is no degradation to
describe.**

---

#### A5 — Typed-relation resolver for wikilinks. Zero bytes.

**Status: RECOMMENDED, with a prior-art correction that weakens the strategic case (below).**

**The problem, measured as damage rather than as theory.** **13,028 wikilinks** in the pinned corpus,
across 501 files, **render as literal visible junk on GitHub.** `[verified — count reproduces
EXACTLY; `See [[Some Page]] and [[dir/Other|alias]].` → `<p>See [[Some Page]] and
[[dir/Other|alias]].</p>`]` That is the largest single body of already-written markdown in this
corpus that is broken outside one renderer.

**What A5 is.** **Not syntax.** A resolver with more than one file in scope, plus a certificate line
stating that these 13,028 constructs are literal text outside Obsidian. The two-tier resolution
semantics already exist in the plan: `[text](path.md)` resolves at **85.71%**, `[[Name]]` at
**27.65%** — a 58-point gap on identical files, and no tool implements the semantics that gap
demands, because *a path link that does not resolve is a mistake while a wikilink that does not
resolve is a legitimate authoring primitive.* `[measured, docs/mdmax/PLAN.md §5.3]`

This is the *"hundreds of markdowns connected to hundreds"* capability the founder describes,
delivered as **resolution** rather than as a carrier.

**The prior-art correction, and it must be carried forward because the prior record states the
opposite.** `docs/engine/PLAN.md` §16.8 argues that typed links are *supply-starved* — 820 forum
likes, #2 request overall, only 5 implementations above 5k downloads — and that the reason is that
*"Breadcrumbs' only available workaround hoists every edge into frontmatter — so the relation no
longer lives at the point of reference."* **A verifier read Breadcrumbs' own README and refuted
that.** `michaelpporter/breadcrumbs`, 806 stars, verbatim: *"Breadcrumbs lets you add _typed links_
to your notes"*, and under "Ways to define relationships": *"Frontmatter properties (typed links),
tags, and **Markdown lists**"* plus Dataview queries — i.e. **it already reads typed edges from the
body, at the point of reference.** `Querulantenkind/obsidian-typed-links-plugin` also exists.
`[verified, REFUTED]`

**So "a plugin cannot close this" is false as stated.** The defensible residual argument for MDMAX is
**block identity across the git boundary**, not novelty. Make that argument; do not make the refuted
one. And note the general defect it exemplifies: *any "nobody has built this" claim must cite the
search that was run* — this one was falsified by a single repository search.

---

### 4.8 What must NOT be built, with the measurement for each

| # | Do not build | Measurement that decides it |
|---|---|---|
| 1 | **Any in-file comment or annotation carrier** | GitHub deletes HTML comments in **both** API modes, including the comment box; **330 already exist** in the corpus. Independently re-derives **D2**. `[verified]` |
| 2 | **Any appearance-based or `id`-based identity** | `id` is **lowercased** in `gfm` mode, so base64url / nanoid / ULID collapse through the comment box. `[verified]` Separately, byte offset is **62.12% false** and block index **55.50% false** over 41,642 block-versions. `[measured, docs/engine/PLAN.md §1.1a]` |
| 3 | **Any new block or inline syntax** | All six tested proposals render as **visible literal junk** on GitHub: `Term`/`: def`, `{: #b1 .cls}`, `:::note{#b1}`, `{{< note >}}`, `{>>note<<}`, `[text]{#b1}`. `[measured, verbatim outputs in §4.4.1]` This is a **rendering** fact and therefore stronger than the adoption argument. |
| 4 | **The Unicode Tag block** | Survives GitHub, remark and prettier byte-identically and invisibly. **Filter it, do not use it.** `[verified]` |
| 5 | **Merged-cell / block-content tables** | The apparent evidence — kubernetes/website writes 1,037 raw `<table>` against 42 markdown tables, 24.69× — **does not support the causal claim**: 1,626 of 1,632 colspans (99.6%) are the identical `colspan="2"`, 1,126 (69.0%) sit in generated `reference/kubectl/**`, and **exactly one** appears in a hand-authored page. It is evidence about two documentation *generators*, not about humans needing merged cells. `[verified, OVERSTATED]` Any GFM-table extension is a new dialect, which violates **D6**. Teach the editor to author an HTML table well; GitHub preserves `colspan`, `rowspan` and `align`. |
| 6 | **Checkbox inside a table cell** | **4 of 114,762 table cells (0.003%)** across the 8-corpus sample; **0** in the pinned corpus. `[measured]` Confirmed unexpressible: `\| - [ ] task \| x \|` → `<td>- [ ] task in cell</td>` verbatim. Note this is a **silence** signal, not proof of no demand (299 forum likes ask for it) — when a construct is unexpressible *and* has no adjacent workaround, users stop trying and the demand only ever surfaces in a forum. Do not build for it; do not conclude nobody wants it. |
| 7 | **Inline typed annotation** (`dfn`, `abbr`, `cite`, `time`, `data`, `var`, `kbd`, `mark`) | GitHub **strips** `abbr`, `dfn`, `cite`, `time`, `data`, `small`, `bdi`, `bdo` — so even the HTML escape hatch fails. `[measured]` And markdown has exactly three inline channels, with every candidate sigil contested: `::` is live-contested between two top-50 Obsidian plugins **today** (Dataview 4.65M, Spaced Repetition 569k). `[measured, docs/engine/PLAN.md §16.5]` |
| 8 | **Spatial / board / canvas layout** | **No shipping product writes graph layout back to markdown.** Obsidian conceded and shipped `.canvas` (JSON, open spec) and `.base` (YAML). `[primary, docs/engine/PLAN.md §15.7, §16.3]` Sidecar. |
| 9 | **Figure + caption + number** | `<figure>`, `<figcaption>` and the Rust Book's private `<listing>` element (used **848** times) are all **stripped to bare text by GitHub**. `[measured]` There is no carrier to design. The caption is a paragraph; the **number is a projection**, computed at render time and never stored. |
| 10 | **A stored section boundary from `---`** | **82.8% of thematic breaks (7,171 of 8,663) immediately precede a heading.** `[measured]` That is a request for a *visible boundary*, which is a rendering concern; the section is already derivable from the heading tree. Infer it, render it, **write nothing to disk**. |
| 11 | **A disclosure construct** | `<details>` / `<summary>` already survives GitHub untouched (1,716 / 1,710 uses in the top-300 README corpus). Solved. Add nothing. |
| 12 | **A declared-vocabulary syntax, registry, or library-import mechanism** | Given syntax permitting an arbitrary type name, ~850 independent third-party authors invented **zero** types — they used the five GitHub ships and stopped. **99.69%** of the 4,538 `:::` directives in Docusaurus's own repository are among its 9 vendor-shipped keywords, and all 14 exceptions are the tutorial strings that teach the feature. `[measured, area `custom-pointers`, headline verdict CONFIRMED]` Ship the **inverse**: vocabulary *inference and drift detection* over values that already exist. |
| 13 | **A recogniser that writes bytes** | A recogniser that emits source **is a construct wearing a disguise** and falls under every negative in this section. This is the kill condition for A2, A4 and A5: they die if and only if they start writing. |

**One thing that must be built and is not a carrier at all: the degradation certificate.** Per
document, per **`(product, surface)`** pair, per construct: **PASS · STRIP · CORRUPT**. This section
*is* the specification for its rule table. The prior record already establishes there is no
published equivalent — four independent adversarial searches found no incumbent, one returning
`total_count 0/0/1`. `[measured, docs/mdmax/PLAN.md §5.4]` But it targets pains ranked **13th and
14th of 14** in the demand research, so it is a credibility instrument and a distribution channel:
**two days, hard cap, never the spearhead.**

---

### 4.9 The collision this section creates with D2 and D4 — an OPEN problem

This is the one place where the carrier work contradicts a decision the founders have already made,
and it is stated as an open problem rather than resolved, because the research could not resolve it
and neither can this document.

**D2** says comments and history live **outside** the file: *export or copy yields clean markdown,
latest content only.* **D4** says the durable artifact is plain markdown, and if the product dies a
full export and migration ships.

**A1 puts machine state inside the `.md`.** Three concrete conflicts follow.

**Conflict 1 — a clean export must strip the tail record, and stripping it destroys the exported
copy's identity.** If export strips A1, then every exported document arrives at its destination with
a **100% cache miss**, and content-derived re-anchoring is doing all the work anyway. If export does
*not* strip it, then "export yields clean markdown" is false: the exported file carries a line of
opaque base64 that only this product can read, which is exactly the lock-in D4 exists to prevent.

**Conflict 2 — one copy produces two different documents.** The tail record survives the
`text/plain` clipboard flavour (that flavour is the raw source) and is **deleted** from the
`text/html` flavour (it renders to zero bytes). So **pasting into Google Docs or Word silently drops
it while pasting into a text editor keeps it.** `[inference — no browser was driven; both halves
follow deductively from measured HTML output, and neither was observed]` That is precisely the
*divergence between a human view and a machine view* failure this programme warns about, produced by
our own design.

**Conflict 3 — the argument that killed the in-file comment applies to A1 too.** §4.5(a) rules out
in-file annotation because GitHub destroys it at the review surface. A1 is not an annotation, and it
survives where the comment dies — but it is still machine state written into a file the product
promises to leave ordinary. The distinction is real and it is thin.

**The three options, stated so a decision can be made rather than deferred indefinitely:**

| option | what it costs | what it buys |
|---|---|---|
| **(i) Do not ship A1** | every read recomputes anchors (~41 ms for a 446 KB / 2,225-block document, `[measured]`) | zero bytes in user files; D2 and D4 hold without qualification; §4.3's "nobody will ever read our carrier" ceases to be a problem because we did not build one |
| **(ii) Ship A1 as a cache with an explicit export-strip step** | a documented 100% miss rate on exported documents; the clipboard divergence in Conflict 2 remains and is user-visible | fast cold reads inside the product |
| **(iii) Move the record to a sidecar keyed by the content-derived anchor** | the differentiator collapses from *"identity across edits"* to *"we have a good anchor"* — a smaller and much less defensible product | perfect D2/D4 compliance; the same capability; and it is what Obsidian did **twice** (`.base`, `.canvas`) when it hit exactly this wall |

**Option (iii) is the honest kill condition for the whole carrier programme**, and the research
states it plainly: *if the anchor is good enough to key a sidecar, the claim collapses into "we have
a good anchor."* The anchor is measured at **99.627%**, which is plenty good enough to key a sidecar —
so this is a genuine risk, not a rhetorical one.

**Recommendation: default to (i) for v1** and revisit only if a measured cold-read latency problem
appears in the product. **This is a recommendation, not a decision. The founders decide.**

---

### 4.10 Where two sources contradict, and which governs

Twelve contradictions were found while assembling this section. Each is named, both sides are given,
and one is nominated to govern. **Do not quote either side of these without checking here first.**

**C-1 — Link reference definition occupancy. This is the important one.**
Area `hold-more` measured **0** definitions in the pinned corpus (mdast `definition` absent; the 9
definition-shaped lines are prose, quoted verbatim). Area `custom-pointers` reported **9 occurrences
in 9 files (0.83%)** for the same corpus — it counted the same 9 prose lines by regex. **`hold-more`
governs for the pinned corpus**, because it parsed rather than matched and the verifier read all 9
lines.
**But `custom-pointers` also measured Corpus B — 847 third-party npm documentation files — at 5,079
definitions in 198 files (23.38%).** `[measured]` **5,079 / 847 = 5.997 definitions per file.** A1's
own pre-registered kill condition is *"link reference definitions in active use above ~0.5 per
file."* **On its face that condition is already tripped, by a measurement taken inside the same
research programme, and nobody connected the two.** Mitigations exist — the `fm:` label prefix makes
collision essentially impossible, and Corpus B is package documentation rather than the
pre-registered top-200-GitHub-repos corpus — but **A1 must not ship until this is adjudicated
explicitly.** It is recorded here as the most likely reason A1 does not survive.

**C-2 — Link title occupancy: four denominators are in circulation, and one of them cannot be
reconciled.** `hold-more`: 23 titles in **1,838** links (CommonMark-only parse, pinned corpus).
`custom-pointers`: 23 in **2,035** inline links (1.13%) pinned, and 253 in 19,462 (1.30%) in Corpus
B. The AST histogram with GFM enabled reports **link=5,453** for the same corpus (autolinks
included). The capability run reports **40 titles in 67,790 links = 0.059%**, i.e. "99.94%
unoccupied", over an 8-corpus 4,074-file sample. **The 67,790 figure has not been reconciled to
anything**, and the researcher who found the discrepancy flagged it rather than papering over it:
*"I cannot tell whether the 67,790 figure used a corpus, an exclusion policy, or a definition of
'link' that reproduces."* **Governing rule: never quote a link-title occupancy rate without its
denominator, and treat "99.94%" as unverified.** Note also that across all three
`Resource`-bearing node types the same run gives **99.898%**, not 99.94%.

**C-3 — The size of markdown's alphabet: 21 or 25?** `docs/engine/PLAN.md` §2.1 says a **"closed
21-label alphabet."** The capability run corrects this from a primary read: `@types/mdast`
`RootContentMap` has **exactly 25 keys** (26 with `root`), and 18 (19 with `root`) for CommonMark
alone. **Both are right and they measure different things**, and the arithmetic reconciles exactly:

```
defined content labels (CommonMark + GFM + frontmatter) ........ 25
plus root ...................................................... 26
minus the 5 node types absent from the pinned corpus ............ -5
  (definition, linkReference, imageReference,
   footnoteDefinition, footnoteReference)
                                                                 ---
observed distinct node types in 1,084 files .................... 21   ✔ matches the AST histogram
```
`[inference over two measurements — the 25-key read is `[primary]`, the 21-type histogram is
`[verified]`, the subtraction is mine]` **Governing: 25 is the defined alphabet; 21 is what this
corpus uses; §2.1's "21" should be relabelled as the observed count.** The *substance* of §2.1 —
closed, tiny, no typed values, no non-tree edges — survives intact and is stronger than the wrong
number suggested.

**C-4 — HTML comment count: 330 in 160 files, or 313 in 156 (14.4%)?** Regex versus AST-native
classification. Same phenomenon; the difference is masking policy. Either is quotable **with its
method stated**.

**C-5 — Frontmatter prevalence: 83.67% or 84.73%?** The AST reports `yaml=907` nodes over 1,084 files
= **83.67%** `[computed: 907 ÷ 1,084 = 0.836716… = 83.67%]`. `custom-pointers` reports **84.73%**
with no stated denominator (84.73% of 1,084 would be 918.5 files). **Governing: 907 of 1,084 =
83.67%**, because the numerator is an AST node count over a hash-pinned file list.

**C-6 — Frontmatter blocks that are not valid YAML: 170 of 907, or 18.91%?** `docs/mdmax/PLAN.md`
§5.5 says **170 of 907** (= 18.74% `[computed]`); `custom-pointers` says **18.91%** (= 171.5 of 907).
Immaterial; **quote 170 of 907**, which names its numerator and denominator. The root cause is agreed
by both: `[[wikilink]]` inside a YAML flow sequence, plus the silent variant where `[[[A]], [[B]]]`
parses to a nested array and **destroys the links with no error.**

**C-7 — `{#id}` occurrences in the pinned corpus: 9 in 4 files, or 6 in 3?** Two own-measurements
from the same programme with different regexes. **Single digits either way**; the design conclusion
(no live usage) is unaffected.

**C-8 — `remark-directive` weekly downloads: 3,176,157 or 3,153,286?** `docs/engine/PLAN.md` §15.3
versus a re-measurement on 2026-08-01. **The later measurement governs**, and the general rule is
that npm weekly figures drift — **always restate the fetch date beside the number.** (Same run:
`remark-parse` 45,820,243; `marked` 61,032,058; `markdown-it` 27,323,922; `gray-matter` 7,492,225;
`markdown-it-attrs` 280,897; `markdown-it-decorate` 1,094.)

**C-9 — Breadcrumbs and typed links.** `docs/engine/PLAN.md` §16.8 states the workaround hoists every
edge into frontmatter; the plugin's own README says it also reads from Markdown lists and Dataview
inline fields. **The README governs** (primary read of the vendor's own documentation). §16.8's
supply-starvation argument is weakened accordingly — see §4.7, A5.

**C-10 — Raw-HTML file share: 37 files (3.4%) or 24 (2.2%)?** The verifier's AST-native
classification is stricter and **strengthens** the refutation. **Report 37 / 3.4%** as the
conservative figure and note 24 / 2.2% as the stricter replication.

**C-11 — Description-list counts: 18,462 / 7,938, or 19,402 / 8,044?** The verifier's AST-native
recount is **higher**, so the researcher's figure is the conservative one. **Quote 18,462 / 7,938**
and note the replication ran higher.

**C-12 — The `[//]: #` idiom.** The prior 24-renderer matrix (`docs/mdmax/PLAN.md` v1.0.0 §4.3) names
it as one of only two carriers **invisible in 24 of 24 renderer configurations.** A later measurement
found it **does not survive a write**: `[//]: # (fm:vocab sgnk/v1)` → `[//]: # "fm:vocab sgnk/v1"` —
parentheses become quotes. `[verified]` **The write test governs.** A carrier that does not survive a
write is not a carrier for a product whose entire job is writing. It is removed from Tier 1 and
recorded in §4.4.1 row 17 as Tier 3.

**One further contradiction of a different kind, recorded because it bears on how much of this
section to trust.** The 16-area final gate carries 5 CONFIRMED, 10 OVERSTATED and 1 REFUTED headline
verdicts; the 18-area capability run had a **100% headline defect rate**, every headline refuted by
its own verifier, always in the flattering direction. **This section's primary source, area
`hold-more`, is one of the five CONFIRMED**, and its verifier's own summary is that the researcher
"disclosed a near-miss that cuts against itself" and "self-corrected in the un-flattering direction."
That is why it carries this section. Its secondary source, area `missing-constructs`, is from the
100%-defect run: **eight of its claims were REFUTED or OVERSTATED by its own verifier**, and every
figure this section takes from it is one the verifier CONFIRMED. Verifiers themselves have a measured
false-kill rate of 0–19%, so a kill is strong evidence, not proof.

---

### 4.11 What markdown structurally cannot hold

Derived from the alphabet, not from a wish list. This is the boundary that decides what belongs in
the file and what belongs in a sidecar.

#### 4.11.1 The alphabet

**25 content labels (26 with `root`)** for CommonMark + GFM + frontmatter; **18 (19 with `root`)**
for CommonMark alone. `[primary — `@types/mdast` `RootContentMap`]` The full set:

```
blockquote  break  code  definition  delete  emphasis  footnoteDefinition  footnoteReference
heading  html  image  imageReference  inlineCode  link  linkReference  list  listItem
paragraph  strong  table  tableCell  tableRow  text  thematicBreak  yaml
```

The six GFM types are `delete`, `footnoteDefinition`, `footnoteReference`, `table`, `tableCell`,
`tableRow`; `yaml` is frontmatter and **is not in the CommonMark specification at all** — to a
conforming CommonMark parser, `---\ntitle: Hello\n---` is a `thematicBreak` followed by an `h2`
whose text is your YAML. **The most widely deployed data channel in the ecosystem is not in the
spec.** `[primary, docs/engine/PLAN.md §2.1]`

#### 4.11.2 The five things it cannot carry

1. **Types.** There are **exactly three** non-string value domains in the entire format:
   `ListItem.checked: boolean | null | undefined`, `Heading.depth: 1|2|3|4|5|6`, and
   `List.start: number | null`. **Everything else is `string`.** `[primary]`
2. **Identity.** No node carries a durable name. And `node.data` **never reaches disk** — confirmed
   empirically and by zero `.data` hits in `mdast-util-to-markdown/lib/`. `hName` / `hProperties` /
   `hChildren` survive into hast only. **Metadata must be syntax or sidecar; it cannot ride on a
   node.** `[measured, docs/engine/PLAN.md §15.4]`
3. **Null distinguished from absent.** There is no way to say "this field is deliberately empty."
4. **Any edge that is not parent–child — with exactly one exception.** The only node-to-node
   reference in the format is the footnote: `footnoteReference.identifier → footnoteDefinition.identifier`.
   (`linkReference`/`imageReference → definition → url` is node-to-*string*, not node-to-node.)
   **That one edge channel is spec'd, GFM-parsed, fully rendered by GitHub — and unused: 6
   definitions + 10 references = 16 nodes in 1,293,322 lines across the 8-corpus sample, and 0 in the
   pinned corpus.** `[primary + measured]`
5. **Any scope larger than one file.** Frontmatter is not the escape hatch: a YAML alias *"refers to
   the most recent event in the serialization"*, and the serialization is that file. **No anchor
   scope larger than a file, therefore no relation larger than a file.** `[primary,
   docs/engine/PLAN.md §2.1]`

**The boundary is not a syntax gap a dialect could close. It is the tree/graph boundary.** What
crosses it is not a construct but **a resolver with more than one file in scope — a linker.** That is
the formal reason A5 is a resolver and not a syntax, and it is independent of every adoption
argument.

#### 4.11.3 Attribute channels: there are three, and they are all string-typed

| channel | reaches | free-form? |
|---|---|---|
| `Resource.title` on `link`, `image`, `definition` | the DOM, verbatim, on GitHub | yes — CommonMark assigns it no meaning |
| the fenced-code **info string** | `lang=` + `data-meta=` on GitHub for unknown languages only | yes — *"this spec does not mandate any particular treatment of the info string"* |
| **frontmatter** | nothing (it is pre-parser, not parser) | yes, but the value slot is YAML and 170 of 907 blocks already fail to parse |

Plus **one flat document-scoped string→URL table** — the link reference definitions.

CommonMark explicitly permits backslash escapes and character references inside titles and info
strings, verbatim: *"Entity and numeric character references are recognized in any context besides
code spans or code blocks, including URLs, link titles, and fenced code block info strings."*
`[primary, spec.commonmark.org/0.31.2]` That is what makes both channels able to carry arbitrary
structured strings — subject to every hazard in §4.4.3.

#### 4.11.4 Composability: constructs do not nest

Measured, and it is the cross-cutting absence no plugin can implement: a checkbox inside a table cell
is unexpressible (`<td>- [ ] task in cell</td>` verbatim), and nesting a construct inside a table
cell, a footnote inside a heading, or a fence inside a table is either impossible or renderer-
specific. `[measured]`

#### 4.11.5 The DocEng eleven patterns — and exactly how much of this is verified

The framing this section's structural claim rests on is Di Iorio, Peroni, Poggi and Vitali,
**DocEng 2012, DOI 10.1145/2361354.2361374** — *"a schema-independent theory based on eleven
structural patterns"* — with the 2014 JASIST follow-up (DOI 10.1002/asi.23088) describing *"a formal
theory of 8 plus 3 structural patterns for XML elements"* derived *"by examining the characteristics
of elements as they are used, rather than as they are defined."* **Both abstracts were fetched
verbatim.** `[primary]`

**Now the honesty, because this is the weakest link in the section's most sweeping claim.** The
*count* and the *framing* are primary-read. **The NAMES of eight of the eleven patterns are NOT.**
Only "block", "container" and "inline element" were recovered verbatim from the 2012 abstract; the
other eight (Marker, Atom, Field, Record, Table, Milestone, Meta, Popup) are the researcher's recall
of Di Iorio's vocabulary and are tier `[inference]`. The open-access copy at
`hdl.handle.net/11380/1199166` returned HTTP 403.

**Therefore the mapping below is `[inference]` built on a partially verified vocabulary. It is the
researcher's conclusion, not the paper's, and it must be re-derived against the full text before it
is published anywhere outside this plan.**

| pattern | markdown's coverage |
|---|---|
| Marker | `thematicBreak`, `break` |
| Atom | `inlineCode`, `code` |
| Field | `heading`, `paragraph` |
| Block | `listItem`, `blockquote` |
| Inline | `emphasis`, `strong`, `link`, `image`, `delete` |
| Container | `list`, `table` |
| Table | `table` (GFM, **no merge**) |
| Popup | footnote (GFM) |
| **Record** — named heterogeneous fields on a block | **ABSENT** |
| **Meta**, block-scoped — metadata attached to a *block* rather than the document | **ABSENT** |
| **Milestone**, inline — a point marker inside text | **ABSENT** |

**The three absences are the three additions in §4.7 that people keep trying to build**: the Record
is the 18,462 bold-run list items (A2), the block-scoped Meta is what the 330 HTML comments and every
`{#id}` attempt are reaching for, and the inline Milestone is what the 1,431 angle-bracket
placeholders and the 76,118 overloaded `inlineCode` spans are approximating (A3, A4).

#### 4.11.6 The cross-format check: TWO of six completed

**Completed:**

- **TEI**, `[primary]`, read verbatim from
  `raw.githubusercontent.com/TEIC/TEI/dev/P5/Source/Specs/att.global.responsibility.xml`:
  a **global attribute class** — available on **every element** — that *"provides attributes
  indicating the agent responsible for some aspect of the text, the markup or something asserted by
  the markup, and the degree of certainty associated with it"*, with `@cert` (*"certainty"*,
  gloss dated 2009-11-02) and `@resp` (*"responsible party"*, same date). `att.global.source` is
  also present (HTTP 200).
  **The consequence for this build:** the per-span provenance capability MDMAX wants to invent —
  source, method, confidence — has been a **global attribute class in TEI since at least 2009**.
  **Adopt TEI's field names (`@cert`, `@resp`, `@source`) rather than invent our own**, so the
  vocabulary has a citable definition on day one. This is the same shape of correction as the
  annotation-anchoring prior art the plan already records.
- **HTML5**, `[measured]`, via GitHub's live sanitizer over 27 distinct real elements plus the
  attribute matrix in §4.5(b). Additional measured strippings: `<figure>`, `<figcaption>`, `<aside>`
  and arbitrary custom elements (`<custom-el foo="bar">custom element</custom-el>` → `<p>custom
  element</p>`) are reduced to bare text, while `<section id="s1">` survives.

**NOT completed: DocBook, JATS, DITA, OOXML.** `docbook/docbook` on GitHub now contains only
`['MovedToCodeberg', 'README.md']`; Codeberg was outside the harness's network allowlist; the DITA
code-search API returned 401; TEI and DITA element inventories were fetched (HTTP 200) but not
parsed. **Every DocBook/JATS/DITA/OOXML statement was omitted rather than asserted from memory, and
this document does the same.** In particular, the claim that *"markdown collapses ~40 DocBook inline
semantic roles into one `inlineCode` node"* appears in the research **only as its measured half** —
13 roles inferred from 77,516 real spans. **The DocBook denominator is not verified. Do not use it.**

---

### 4.12 What would falsify this section, and the one experiment that settles it

**The experiment: a carrier survival matrix against a real second corpus and real consumers.**
Everything above rests on one corpus and one renderer family, and that is the section's largest
weakness.

**Corpus.** Pin a **second corpus of 1,000+ `.md` files not authored by this workspace** — top-200
GitHub repositories by stars with a README plus `/docs` — sha256-manifested with its own
`corpus_id`. Re-run: definition count, wikilink count, bare-placeholder count, bold-run list-item
rate, `inlineCode` role mix, real-HTML file share.

**Pre-registered predictions, so this can refute rather than confirm:**

| prediction | if it fails |
|---|---|
| link reference definitions **>0 but <0.5 per file** | A1's empty-slot argument dies (and note Corpus B already reads **5.997 per file** — see §4.10, C-1) |
| bare placeholders present in **>10% of files** | A3's scale claim is workspace-specific |
| bold-run description-list items **>12% of list items** | A2's coverage claim is workspace-specific |
| real-HTML file share **HIGHER than 3.4%** | the researcher expects to be at least partly wrong here, and said so |

**Tasks: 32 carriers × 12 consumers = 384 cells**, each a deterministic pass/fail, no judge needed.
**Consumers must include the four this research could not reach:**

1. **GitHub Pages** via a real `kramdown` + `kramdown-parser-gfm` install (the gem install into a
   temporary `GEM_HOME` failed).
2. **The real GitHub blob renderer** — the API's `mode=markdown` is **not** it.
3. **Both clipboard flavours driven through a real browser** — `text/plain` versus `text/html`,
   pasted into Google Docs **and** into VS Code. This is the column §4.9's open problem turns on.
4. **One non-GitHub sanitizer** — Discourse or Slack.

**Verifiers, cheapest first:** (1) byte-equality after `remark-stringify` and after `prettier` —
rules-based, already built; (2) payload-present and payload-visible in rendered HTML — rules-based,
already built; (3) a DOM diff for the clipboard round trip.

**Separately and smaller: a 200-document precision trial for A3** against hand-labelled ground truth.
Prediction **>90%**; **below 80% it does not ship.**

**And one measurement nobody in this programme has made: none of this has been tested against a
language model.** Zero live model calls were made in any research run. Before any carrier or
recogniser is claimed to help an AI read a document, run the read / write / **edit-under-load** trial
against the **production** editor model, not an Opus-class ceiling — the stated failure mode is that
a private notation fails *quietly* under load, the renderer stops matching, and the field silently
vanishes while the document still looks like a document.

**The kill conditions, restated as a checklist:**

- **Kill A1** if the second corpus shows linkrefs above ~0.5 per file; **or** if `text/plain` also
  drops them; **or** if D4's export guarantee requires stripping them (100% miss rate → delete
  rather than ship).
- **Kill A3** if precision <80% on the 200-document ground truth.
- **Kill A2, A4, A5** *only* if they start writing bytes.
- **Kill the whole carrier programme** if content-derived re-anchoring is successfully re-derived on
  an external corpus **and** the 30-line LCS diff baseline (measured at 86.658%, its own verifier
  reproducing 85.036%) beats it in the product's real conditions — because then identity needs no
  in-file bytes at all and every carrier above is dead weight on a plain `.md` file.
- **Never ship** any carrier whose payload contains a raw double quote, a blank line, a backtick
  inside a backtick-fence info string, a link label of exactly 1000 characters, or a case-sensitive
  identifier. **Each of those is a measured, reproducible, silent failure.**

---

### 4.13 Summary: DECIDED · RECOMMENDED · OPEN

**DECIDED** (these follow from D2, D4, D6, D7, D8, D9 plus a measurement, and should not be
re-litigated):

- The file stays ordinary `.md`. No dialect needing its own parser.
- **No in-file comment or annotation carrier.** GitHub deletes HTML comments in both API modes.
- **No new block or inline syntax.** All six tested proposals are visible literal junk on GitHub.
- **No appearance-based or `id`-based identity.** `id` is lowercased in `gfm` mode.
- **Filter the Unicode Tag block** on ingest and on paste.
- **Render targets are `(product, surface)` pairs**, never products.
- Extensibility lives in the **value** of a field, never in the set of node types (D8); a document
  **names** a capability, never carries one (D9).

**RECOMMENDED** (an engineer can build these tomorrow; a founder can still say no):

- **A2** description-list recogniser · zero bytes · largest coverage · lowest risk.
- **A3** placeholder linter · zero bytes · **highest severity, cheapest fix, 20.2% of files** ·
  gated at 80% precision.
- **A4** inline-role recogniser over 76,118 `inlineCode` spans · zero bytes.
- **A5** typed-relation resolver over 13,028 wikilinks · zero bytes · make the **block-identity**
  argument, not the refuted "no plugin can close it" argument.
- Adopt **TEI's `@cert` / `@resp` / `@source`** names for provenance rather than inventing a
  vocabulary.
- Ship the **degradation certificate** rule table from §4.4 — two days, hard cap, never the
  spearhead.
- Default to **not shipping A1** in v1.

**OPEN** (nobody should pretend these are settled):

- **A1's collision with D2 and D4** (§4.9) — three options, none free.
- **Whether A1's kill condition is already tripped** by Corpus B's 5.997 definitions per file
  (§4.10, C-1). **Adjudicate before writing any tail-record code.**
- **The clipboard column** — entirely `[inference]`; one afternoon with a browser settles it.
- **The GitHub blob renderer and GitHub Pages** — never executed.
- **Whether any of this transfers off a corpus written by two people and an agent stack** (§4.12).
- **The 99.627% anchoring figure**, re-derived by nobody, quoted here twice with that caveat, and
  under a standing instruction in the current plan not to publish until it is re-derived on a corpus
  this team did not write.


---

---

### Links

**This section references:** [§0 Status](00-status.md) · [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§5 Rendering](05-rendering.md)

**Referenced by:** [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§5 Rendering](05-rendering.md) · [§6 Conventions](06-conventions.md) · [§7 Product](07-product.md) · [§9 AIOS](09-aios.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
