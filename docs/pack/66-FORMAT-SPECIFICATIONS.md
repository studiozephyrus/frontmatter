---
id: 66-FORMAT-SPECIFICATIONS
title: Format specifications
mode: reference
tier: canonical
status: draft
verified_against: d5cda79
updated: 2026-09-18
owner: sagnik
covers: [formats, file-formats, block-formats, page-twin, llms-txt, blueprint-kit]
---

# 66. Format specifications

Every byte format the product reads, writes, serves or ships, as a contract a builder can test.
This is the file `10-FEATURE-REGISTER.md` section 8 records as missing.

**How to read a row.** Each rule carries one of three states.

State | Meaning
`built` | Read from the source at `d5cda79` in this session, and in several places run
`specified, not built` | Required by the plan or a screen spec, and absent from `src/`
`resolved (proposed 18 Sep, founder review)` | Was open. Decided on the evidence named beside it, for the founder to confirm or reverse. Never `[Z]`
`needs founder` | A recommendation is written, and only the founder can make it binding

**No open marker remains.** Every earlier one was resolved on 18 September; the log is
`docs/pack/review/66-formats.md`, one row per item.

**Most of this file is `specified, not built`.** The dialect and front matter sections describe real
code. The block kinds are half real. The published twin, `llms.txt` and the kit do not exist yet.

---

## 0. Sources, and where they disagree

Source | What it gives this file
`docs/mvp0/PRODUCT-PLAN.md` section 20 | The four parts every format carries, and the format table
`docs/mvp0/PRODUCT-PLAN.md` sections 7, 8, 9, 10, 11 | Doc mode carriers, the block list, the fifteen-file kit, publishing, import
`specs/render/carrier.md` | The two permitted carriers and their refusals
`specs/engine/splice-writer.md`, `nf-001`, `nf-003` | The front matter writer's contract and its named defects
`25-ENGINE-SPEC.md`, `26-ENGINE-REFUSAL-CATALOGUE.md` | Range location, `SAFE_KEY`, the refusal register
`17-ERROR-AND-REFUSAL-CATALOGUE.md` | Every `E` id cited below
`12-screens/S08.md`, `S15.md`, `S18.md` | Blocks, the kit, the published page
`CLAUDE.md`, "Settled" | Callout for prose, fence for data; a compiler and an IDE, not a new format

**The sources disagree in fourteen places.** Each is carried at the row it affects and collected here,
so nobody picks silently.

# | What disagrees | Where | This file's position
1 | A published page's URL: `/p/<slug>` in the plan, `/<slug>` in S18 with `/p/<slug>` as legacy | plan section 10; `12-screens/S18.md` | `/<slug>` is canonical. Resolved (proposed 18 Sep, founder review): S18 is newer, the founders passed it "fine as drawn", and both routes already ship that way. Section 5.1
2 | The twin's name: `page.md` in the plan, `/<slug>.md` in S18 | plan section 5, S18; `12-screens/S18.md` | `/<slug>.md` is the route. "`page.md`" is the plan's name for it
3 | An unknown callout kind: refused on write (`specs/render/carrier.md`), a plain blockquote (`E503`, S08), a neutral note box (the shipped `callout.tsx`) | section 4.2 | Render as a blockquote. The shipped code is a defect against `A556`
4 | The drawn chart example writes the info string `fm-chart`, without the version | `docs/mvp0/screens/gen.mjs:1170` | The version is required. The drawing is wrong
5 | Doc mode's "paragraph borders and shading" use a Pandoc fenced div, `:::`, which the carrier spec forbids on disk | plan section 7; `specs/render/carrier.md` invariant 6 | Resolved (proposed 18 Sep, founder review): Doc mode drops the div, and a callout is offered instead. Section 4.10
6 | `F128` is `shipped` with "nested YAML included"; the panel shows nested values read-only | `10-FEATURE-REGISTER.md`; `src/modules/preview/presentation/PropertiesPanel.tsx` | Nested editing is `specified, not built`
7 | The kit manifest shape in S15 carries `rootHash`, but the root hash is taken over the tarball that contains the manifest | `12-screens/S15.md` | `rootHash` lives in the server record only. Section 6.3
8 | `F241` exports "every document and attachment"; the shipped vault zip holds `.md` files only and skips `README.md` | `10-FEATURE-REGISTER.md`; `src/modules/vault/application/export-vault-zip.ts` | Section 7 records what ships
9 | The drawing block: "saved beside the note as JSON Canvas 1.0" in the plan, Excalidraw's own surface in S08 | plan section 8; `12-screens/S08.md` | Resolved (proposed 18 Sep, founder review): an Excalidraw scene file, because JSON Canvas cannot hold a drawing. Section 4.5
10 | The kit was seven files on 13 September and is fifteen now | `docs/MVP-PLAN-2026-09-13.md`; plan section 9 | Fifteen. The seven-file kit is superseded
11 | The writer promises not to touch blank lines, and deletes one | `25-ENGINE-SPEC.md` section 25.5; section 3.6 below | A defect, measured in this session
12 | A callout's title: a heading inside the container (`specs/render/carrier.md` invariant 5), or text on the marker line (S08's drawing) | section 4.2 | Both are read. The heading form is written. Resolved (proposed 18 Sep, founder review): GitHub drops the alert when text follows the marker
13 | The inline AI mark is "invisible when rendered" in the plan; the carrier spec measured HTML comments printed as text in three of seven engines | plan section 20; `specs/render/carrier.md` | Section 4.9 records both
14 | PDF by Paged.js and Pandoc in the plan; headless Chromium in the code | plan section 8; `src/app/api/export/pdf/` | Headless Chromium is the target. Resolved (proposed 18 Sep, founder review). Section 7.1

---

## 1. The four parts every format carries

`[P]` Plan section 20: every format the plan invents or adopts carries a version field, a rule for
unknown fields, a stated degradation in a plain markdown reader, and a test.

Format | Version field | Unknown fields | In a plain reader | Test | Section
Any `fm-` fenced block | the info string, `fm-chart@1` | ignored, kept byte for byte | a code block | a fixture per block, byte-exact round trip, `A046`, `A555` | 4.3
Doc mode front matter keys | `frontmatter: 1` | ignored, kept | front matter, invisible in most renderers | export fixtures | 3.9
Flow view conventions | none, they are headings | n/a | headings and lists | a fixture document | 4.6
`MANIFEST.json` | `"version": 1` | ignored | a JSON file | a schema test | 6.3
`SHA256SUMS` | the format's own | n/a | a text file | verified on every publish | 6.4
`DECISIONS.md` | `decisions: 1` in front matter | ignored | one heading per decision, an `open` marker for Not sure | a fixture | 6.2
`MAP.md` and `graph.json` | `graph: 1` | ignored | a document and a JSON file | rebuilt from files, compared to the fixture | 6.2
The AI mark | in the version record, not the file | ignored | nothing, or an HTML comment if inline marking is on | with and without inline marking | 4.9
Portfolio front matter | `portfolio: 1` | ignored | front matter; the page renders as a document | a fixture | 3.9
The kit tarball | `MANIFEST.json` version | n/a | a folder | the kickoff test, plan section 28 | 6.5

**Two formats are not ours.** `SKILL.md` follows the skills guide and `AGENTS.md` follows agents.md,
both checked on S11 (plan section 20). This file does not restate them.

**The plan says the full text of each lives in `specs/formats/` from phase A.** That directory does
not exist at `d5cda79` (`ls specs` returns `_schema`, `engine`, `harness`, `render`). Until it does,
this file is that text.

**When a format changes after files exist** (plan section 20): the version rises, the old version is
still read, and the map shows which version a kit carries.

---

## 2. The markdown dialect

**The product accepts CommonMark plus six GitHub extensions, maths and front matter, and writes
nothing a stranger's parser cannot read.** That is the settled verdict: a compiler and an IDE over
markdown, not a new format (`CLAUDE.md`, "Settled").

### 2.1 The parser stack, as built

`[O]` Read from `package.json` and `node_modules/*/package.json` at `d5cda79`.

Stage | Package and version | What it adds | Where it is wired
Tokeniser | `micromark` 4.0.2 | CommonMark; its readme claims 100 per cent compliance | under `remark-parse`
Parse | `remark-parse` 11.0.0 | mdast | `src/modules/preview/presentation/Markdown.tsx`
Front matter | `remark-frontmatter` 5.0.0, default options | a leading YAML block only; its default is `'yaml'` | same, and `src/modules/export/presentation/pdf-doc.ts`
GFM | `remark-gfm` 4.0.1 over `micromark-extension-gfm` 3.0.0 | autolink literals, footnotes, strikethrough, tables, tag filter, task list items | same
Soft breaks | `remark-breaks` 4.0.0 | every soft line break renders as a `<br>` | same
Maths | `remark-math` 6.0.0 | `$...$` inline and `$$...$$` display; single-dollar inline maths is on by default | same, rendered by `rehype-katex`
Raw HTML | `rehype-raw` 7.0.0, then the product's own `createRehypeHtmlPolicy` | parses HTML in the source, then filters it | `src/modules/preview/presentation/markdown/html-policy.ts`
Headings | `rehype-slug` 6.0.0 | an `id` on every heading | `Markdown.tsx`
Diagrams | `mermaid` 11.15.0 | a `mermaid` fence drawn as SVG, `securityLevel: "strict"` | `src/modules/preview/presentation/mermaid-block.tsx`

**The same stack parses for the live editor's block split** (`src/modules/editor/presentation/live/block-split.ts`)
and for PDF export, so the three views agree on where a block starts and ends.

### 2.2 What is accepted

Construct | Syntax on disk | Standard | Rendered | State
Headings, paragraphs, emphasis, lists, links, images, code, block quotes, thematic breaks | CommonMark | CommonMark | yes | `built`
Tables with alignment | GFM pipe table | GFM | yes, editable in place (`F131`) | `built`
Task list items | `- [ ]`, `- [x]` | GFM | yes, the box toggles by splice | `built`
Strikethrough | `~~text~~` | GFM | yes | `built`
Autolink literals | `https://...`, `www.` | GFM | yes | `built`
Footnotes | `[^1]` and `[^1]: text` | GFM extension, not in the GFM spec proper (plan section 7) | yes | `built`; export is `F143`, `building`
Maths | `$x$`, `$$x$$` | none; remark-math | yes, KaTeX | `built`
Callouts | `> [!kind] title` | GitHub alerts and Obsidian callouts | yes | `built`, with defect 3 of section 0
Mermaid | a fence with info string `mermaid` | none; renders on GitHub | yes | `built`
Wikilinks and embeds | `[[target]]`, `![[target]]` | Obsidian | yes, resolved against the vault | `built`
Raw HTML | inline or block | CommonMark | only elements on the allowlist | `built`
`fm-` data blocks | a fence with info string `fm-<name>@<n>` | ours | no | `specified, not built`
Highlight | `==text==` | none; plan section 7 | no | `specified, not built`
Underline, superscript, subscript, attributes | Pandoc `[text]{.underline}`, `^x^`, `~x~`, `{width=}` | Pandoc; plan section 7 | no | `specified, not built`
Table of contents marker | `[toc]` on its own line | none; `F142` | no | `specified, not built`

**Two rows need care.**

- `~x~` subscript collides with GFM strikethrough, which accepts a single tilde by default.
  `[O]` `micromark` with `gfm()` renders `H~2~O` as `<p>H<del>2</del>O</p>` in this session.
- So the shipped renderer strikes through what Doc mode would mean as a subscript.
- **Resolved (proposed 18 Sep, founder review): Doc mode writes `<sub>` and `<sup>`**, never `~x~`
  or `^x^`. Both elements are on `SAFE_HTML_ELEMENTS` in `html-policy.ts`, so they render today.
- `[O]` GitHub's `POST /markdown` API, gfm mode, on 2026-09-18, returned `H<sub>2</sub>O` as a
  subscript and `H~2~O` as `H<del>2</del>O`. The HTML form survives GitHub; the Pandoc form does not.
- Rejected: turning off single-tilde strikethrough, which would change how every existing `~x~` in a
  person's files renders. The Pandoc row above is therefore superseded for these two marks.
- `[toc]` is an ordinary CommonMark shortcut reference with no definition, so a plain parser shows the
  literal text `[toc]`. That is the degradation, and it passes plan section 7's refusal rule.

### 2.3 Where rendering departs from CommonMark

**`remark-breaks` renders a soft line break as a hard break.** CommonMark renders it as a space, and so
does GitHub on a `.md` file. The bytes are untouched, so this is a view difference, not a write.

- A hard-wrapped paragraph therefore looks different in frontmatter and on GitHub.
- **Resolved (proposed 18 Sep, founder review): the published page keeps `remark-breaks`**, the same
  pipeline as the preview. The author must see what the reader sees, and the page is a projection of
  the same bytes through the same renderer.
- Agents are not affected: they read the twin, `/<slug>.md`, and apply their own parser to the bytes.
- Rejected: CommonMark breaks on the published page only. The page would then differ from the preview
  the author approved, which is the surprise the rule exists to prevent.

### 2.4 Raw HTML

`[O]` `src/modules/preview/presentation/markdown/html-policy.ts` names twelve elements that never
render: `base`, `button`, `embed`, `form`, `iframe`, `link`, `meta`, `object`, `script`, `select`,
`style`, `textarea`. Everything else passes only if it is on `SAFE_HTML_ELEMENTS` in the same file.

- **A disallowed element is dropped from the rendering, never from the file.** The bytes are the
  truth; the view is a projection.
- **A sandboxed HTML block is never rendered** (`12-screens/S08.md`, "What this screen must never do"),
  because published pages carry no third-party script (`A107`).

### 2.5 What is refused rather than guessed

**The product refuses in two places: before a parse, and before a write.** A render failure is not a
refusal; it shows the source in place (section 4).

Condition | Where | What happens | `E` id | State
The file is over 4 MiB (`MAX_BYTES = 4 * 1024 * 1024`) | shape gate | not parsed, not written | `E016` | `built`
Over 200,000 lines (`MAX_LINES`) | shape gate | same | `E017` | `built`
Over 20,000 list-marker lines (`MAX_LIST_MARKER_LINES`) | shape gate | same | `E018` | `built`
Not valid UTF-8 | shape gate | same, with the line and column | `E019` | `built`
The parse runs past its time budget | shape gate | same | `E020` | `built`
The parser threw, or its worker died | shape gate | same | `E021`, `E022` | `built`
A body splice cannot locate its range unambiguously | body writer | the edit is refused | `E026` | `specified, not built`
The document changed after a range was captured | body writer | refused; reopen against current bytes | `E027` | `specified, not built`
A fenced block has no closing fence | body writer | the block's edit is refused | `E028` | `specified, not built`
A table row's cell count differs from its header | table editor | that edit is refused | `E500` | `specified, not built`

The three limits are read from `src/modules/mdmax/domain/shape-gate.ts:23` to `:25`.

**A renderer never refuses a table.** GFM tolerates a short or long row when it renders. Only the
table editor refuses, because an edit to a misshapen row has no single right answer.

### 2.6 Fixtures for this section

Fixture | Input | Expected
`dialect/soft-break.md` | `a\nb\n` | the bytes round-trip unchanged; the render holds one `<br>`
`dialect/html-script.md` | `<script>x</script>\n\ntext\n` | no `script` element in the render; the bytes are unchanged
`dialect/over-budget.md` | a generated file of 4 MiB plus one byte | `E016`, and the file is unchanged
`dialect/toc-plain.md` | `[toc]\n` | a plain CommonMark parser renders the paragraph text `[toc]`

---

## 3. Front matter

**One YAML block at the top of the file, read by a real YAML parser and written by a line walker that
never re-serialises it.**

The walker is `src/modules/share/domain/splice-frontmatter.ts`, 13,324
bytes (`wc -c`), and it is the only writer (`specs/engine/splice-writer.md` invariant 6).

### 3.1 Recognising the block

`[O]` Read from the source, and each shape run through `spliceFrontmatterValue` in this session with
`node --experimental-strip-types`.

Shape at byte 0 | Recognised | Rule | State
`---` then LF | yes | `FM_OPEN = /^---[ \t]*(\r?\n)/`, at `splice-frontmatter.ts:30` | `built`
`---` then CRLF | yes | same | `built`
A byte-order mark, then `---` | yes | the mark sits before the document and is written back unchanged | `built`
`---` then a bare CR | **no, and it corrupts** | the writer prepends a second block | `E011`, `built` and wrong
`+++` (TOML) | no | `remark-frontmatter` default is YAML only, so the block is body text | `built`
Anything else at byte 0 | no block | a `set` prepends one; a `delete` does nothing | `built`

**The closing fence** is the first later line that is exactly `---` or `...`, after a trailing CR is
stripped. With none, the write is refused (`E002`).

**The line ending of every line the writer emits is the opening fence's own**, CRLF or LF. A file
that mixes endings keeps its other lines as they were.

### 3.2 The subset the writer can address

The walker addresses **one top-level key at a time**. It classifies each line in the block as a key,
a continuation, a comment or a blank, and refuses anything else (`25-ENGINE-SPEC.md` section 25.6).

Input | Outcome | `E` id | State
A key outside `SAFE_KEY = /^[A-Za-z0-9_.$-]+$/`, such as `date created` or `título` | refused | `E001`, `E012` | `built`
No closing fence | refused | `E002` | `built`
The same top-level key twice | refused | `E003` | `built`
The target key opens a block scalar, anchor, alias, tag or explicit key (`|`, `>`, `&`, `*`, `!`, `? `) | refused | `E004` | `built`
A non-key line at column 0, such as a scalar document or a `%` directive | refused | `E005` | `built`
A rename to a key that would need quoting | refused | `E006` | `built`
A rename onto a key that exists, or appears twice | refused | `E007`, `E008` | `built`
A block sequence at column 0 under a key (NF-1) | refused | `E009` | `built`; to be fixed
A flow sequence closed at column 0 (NF-2) | refused | `E010` | `built`
The block does not parse strictly | refused | `E013` | `specified`; the panel checks, the walker does not
Two front matter blocks already present | refused | `E014` | `specified, not built`
The fence cannot be resolved unambiguously | refused | `E015` | `specified, not built`

`SAFE_KEY` is exported from `src/modules/share/domain/splice-frontmatter.ts:53`, and the properties
panel refuses the same shapes at the point of typing (`E040`).

### 3.3 What a write may change

Operation | Bytes that change | State
`set` on a present key | that key's line and its continuation lines, and nothing else | `built`, with defect 3.6.1
`set` on an absent key | one new line, inserted immediately before the closing fence | `built`
`set` with no block in the file | a new block is prepended: `---`, the key line, `---`, one blank line | `built`, with defect 3.6.2
`delete` of a present key | that key's span. If it was the only key, the whole block and one blank line after it | `built`
`delete` of an absent key | nothing | `built`
`rename` | the key's own bytes | `built`

**Never touched by any operation** (`25-ENGINE-SPEC.md` section 25.5): the byte-order mark, the line
ending style, comments, key order, the indentation of other lines, the closing fence, and the body.

### 3.4 How a value is written

`[O]` `emitValue` and `emitScalar` in the same file. A value is a string, a number, a boolean, a
list of those, or `null` for delete. **A map, or a list of maps, cannot be written today.**

A string is written plain unless the plain form would read back as something else. It is quoted
with double quotes, backslash-escaped, when any of these hold:

- it is empty, or has a leading or trailing space;
- its first character is one of `` - ? : , [ ] { } # & * ! | > ' " % @ ` ``;
- it contains `: ` or ` #`, or a line break;
- it reads as a boolean, null or YAML 1.1 word (`true`, `false`, `null`, `yes`, `no`, `on`, `off`, `~`, any case);
- it reads as a complete number, a date or timestamp (`YYYY-MM-DD...`), or starts `0x`, `0o` or `0b`.

**A list keeps the shape it already has.** Flow stays flow (`[a, b]`). Block stays block, at the
indent already in use, two spaces by default.

A new list key is written in flow form, which the
source comment measures at 90.1 per cent of the pinned corpus.

### 3.5 Fixtures, each run in this session

Every row below is an input and the output `spliceFrontmatterValue` returned at `d5cda79`. They are
the fixtures, with the two defect rows marked.

Input | Call | Output
`---\na: 1\nb: 2\n---\nbody\n` | set `c` to `new` | `---\na: 1\nb: 2\nc: new\n---\nbody\n`
`---\ntags: [a, b]\n---\n` | set `tags` to `[a, b, c]` | `---\ntags: [a, b, c]\n---\n`
`---\ntags:\n  - a\n---\n` | set `tags` to `[a, c]` | `---\ntags:\n  - a\n  - c\n---\n`
`---\ntags:\n- a\n---\n` | set `tags` to `[a, c]` | unchanged, `E009`
`---\ndate created: 1\n---\n` | set `date created` to `2` | unchanged, `E012`
`---\nt: 1\n---\n` | set `t` to `yes` | `---\nt: "yes"\n---\n`
`---\nt: 1\n---\n` | set `t` to `a: b` | `---\nt: "a: b"\n---\n`
BOM, `---\r\nt: 1\r\n---\r\n` | set `t` to `2` | BOM, `---\r\nt: 2\r\n---\r\n`
`---\rt: 1\r---\r` | set `t` to `2` | **`---\nt: 2\n---\n\n---\rt: 1\r---\r`**, a second block, `E011`
`---\na: 1\n\nb: 2\n---\nbody\n` | set `a` to `5` | **`---\na: 5\nb: 2\n---\nbody\n`**, defect 3.6.1
`\n\nHello\n` | set `title` to `x` | **`---\ntitle: x\n---\n\nHello\n`**, defect 3.6.2

### 3.6 Two defects this section found

Neither is in `26-ENGINE-REFUSAL-CATALOGUE.md` or `17-ERROR-AND-REFUSAL-CATALOGUE.md`. Both are
writes outside the target range, which is invariant 1 of `specs/engine/splice-writer.md`.

1. **A `set` deletes the blank lines that follow the key.** The continuation walk counts an
   empty line as part of the key's span, and the replacement writes one line. The fixture loses one
   byte.
   - Severity `HIGH`: the product's one guarantee breaks on an ordinary file.
2. **A `set` on a file with no block strips the body's leading blank lines** (`src.replace(/^\r?\n+/, '')`),
   then adds one. Two leading LFs become one. Severity `MEDIUM`: rarer, and the body's meaning survives.

**Both need a red proof before a fix**, per `AGENTS.md` section 0 rule 1. The two defect fixtures in
3.5 are those red proofs. `[O]` Both still reproduce at `e0f6f89`, rerun with
`node --experimental-strip-types` on 18 September.

**Resolved (proposed 18 Sep, founder review): neither gets an `E` id.** An `E` id names a refusal,
and these are wrong writes, not refusals. The fix makes each a correct write with nothing to show.

- Each is a defect, so it belongs in `44-TECH-DEBT-REGISTER.md` as a `TD-` entry with the fixture as
  evidence. That file's owner adds the two rows.
- **The fix for 3.6.1:** the continuation walk stops before a blank line, so blank lines after the
  key's last continuation line are outside the span and are never rewritten.
- **The fix for 3.6.2:** the prepended block is followed by exactly one LF, and the body's own bytes,
  leading blank lines included, follow unchanged.
- Rejected: new `E` ids. A refusal id for a write that should simply succeed would teach the product
  to refuse ordinary files.

### 3.7 `SAFE_KEY` today, and the rule that replaces it

**Today** a key is addressable only if it matches `SAFE_KEY`. A space or any non-ASCII letter makes it
unaddressable, and the file is refused rather than guessed.

**Specified, not built** (`25-ENGINE-SPEC.md` section 25.8, NF-4).

A key of any Unicode string is addressable when it:

- is already in Normalization Form C, and is one line;
- has no control character, and no leading or trailing whitespace;
- contains neither `: ` nor ` #`, and does not begin with a YAML indicator character.

The request is normalised; the file never is.

### 3.8 Nested keys

**`built`:** a nested value is parsed and shown read-only, labelled "edit in source"
(`src/modules/preview/presentation/PropertiesPanel.tsx`). The writer cannot emit a map.

**`specified, not built`:** `12-screens/S05.md` requires the panel to edit nested YAML and never
flatten it (`A540`). The contract this file sets for that work:

- **A nested edit is a `set` on the top-level ancestor key.** Its whole span is replaced, and every
  byte outside that span is unchanged.
- **Inside the replaced span, untouched sibling lines keep their bytes**, comments and indentation
  included. A nested edit that re-serialises its siblings fails `A540`.
- **A value that needs a block scalar, an anchor or an alias is refused** (`E004`), as at top level.

### 3.9 Keys the product reserves

**Each is ordinary YAML that any other tool ignores.** None is required, and unknown keys beside them
are kept byte for byte (`A675`).

Format | Keys | Version key | Value shapes | Source
Doc mode page setup | `title`, `subtitle`, `page`, `margins` | `frontmatter: 1` | `title`, `subtitle` strings; `page`, `margins` scalar strings, below | plan sections 7 and 20
Portfolio | `name`, `handle`, `title`, `links`, `projects`, `writing`, `theme` | `portfolio: 1` | `links` a map; `projects` a list of maps with a title and a line; `writing` a folder path; the rest strings | `12-screens/S30.md`
Decision record | per the kit | `decisions: 1` | section 6.2 | plan section 20
Project map | per the kit | `graph: 1` | section 6.2 | plan section 20
Trust stamp | `verified` | none | a list of `{by, at}` | `56-OPEN-DECISIONS.md` D06, section 3.10

**`links` and `projects` are nested**, so the portfolio cannot be edited from the panel until 3.8 is
built. It can be written in the source pane today.

**`page` and `margins`. Resolved (proposed 18 Sep, founder review).** Both are one-line scalars, so
the writer can emit them today and the panel can edit them without the nested work in 3.8.

Key | Shape | Default | Examples
`page` | a paper size, then optionally a space and `landscape` | `A4` | `A4`, `Letter landscape`
`margins` | one to four CSS lengths in `cm`, `mm` or `in`, in CSS shorthand order | `1.6cm` | `2cm`, `2cm 1.5cm`

- **The paper sizes are the ones the PDF engine accepts**: `A3`, `A4`, `A5`, `Letter`, `Legal`,
  `Tabloid`, matched without regard to case. `[O]` `PaperFormat` in
  `node_modules/puppeteer-core/lib/types.d.ts` lists those among its values.
- **The defaults are what ships.** `[O]` The PDF route passes `format: "A4"` and
  `PRINT_PAGE_MARGIN = "1.6cm"` from `src/modules/export/presentation/print-css.ts`.
- **A value outside the shape is ignored and the default used.** The bytes are never rewritten, and
  the problems panel names the key.
- Rejected: a nested `margins: {top, right, bottom, left}` map, which the writer cannot emit
  (section 3.4) and which would lock page setup behind the nested-edit work.

### 3.10 The `verified` stamp

**Status: answered 18 September `[Z]`, D06: stamp on accept.** Before that answer: D06 in `56-OPEN-DECISIONS.md` was a founder decision and is not among
the four answered on 18 September. **Recommendation, as D06's: stamp on accept, in phase D.** The
contract below is written so phase D can build it the day D06 is answered yes.

The shape is Google's Open Knowledge Format v0.2. `[M]` Opened 2026-09-18 at
https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals. The page's own
example writes `verified` as a list of one-line maps, `- { by: human:kliu@acme, at: <RFC 3339> }`.
It derives a trust tier from `by`: "confirmation by a human:<id> actor is human-reviewed".

If D06 is decided yes, the contract is:

```yaml
---
title: Booking flow
verified:
  - { by: human:sagnik, at: 2026-09-18T10:00:00Z }
---
```

- **An accept in the change queue appends one entry** at the end of the `verified` list. Nothing
  else in the block changes.
- **The list is block form, each entry one line**, two-space indent, as OKF's own example writes it.
  An append is a one-line insertion before the closing fence or the next key, and a diff reads cleanly.
- **The writer cannot do this today.** `emitValue` has no map type. The narrow addition is an append
  of one flow-map line to a block list; it does not need the whole of 3.8.
- **What `by` holds: `needs founder`.** Recommendation: `human:<handle>`, the person's public
  frontmatter handle. The `human:` prefix is what OKF reads as human-reviewed, and the handle is
  already public on a portfolio page.
- Rejected: an email, which would publish an address with every page; and a uid, which leaks nothing
  but means nothing to a reader. It needs the founder because it is published with the page.

---

## 4. Block kinds

### 4.1 The carrier rule

**Two carriers, and no others** (`specs/render/carrier.md`, settled in `CLAUDE.md`).

- **Prose a person would read takes a callout**, `> [!kind]`. It has no closing marker, so an
  unclosed callout cannot exist.
- **Data a machine reads takes a fence** with a structured info string. An unclosed fence swallows
  the rest of the document, so a fence's open and close are spliced as one unit.
- **Everything else is refused as an on-disk carrier**: `:::` directives, HTML comments, front matter
  used as a block, link or footnote tricks, and any inline mechanism.

**A block that cannot render shows its source and the reason, never an empty space**
(`12-screens/S08.md`). The bytes are never changed by a render.

Kind | Carrier | Component | Feature | Render failure | State
Table | GFM table | `C045` | `F131` | none; a renderer never refuses a table | `built`
Callout | `> [!kind]` | `C044` | `F176` | unknown kind, `E503` | `built`, one defect
Chart | fence, `fm-chart@1` | `C102` | `F180` | `E502` | `specified, not built`
Drawing | fence, `fm-draw@1`, plus a stored file | `C103` | `F179` | missing file, `E042` | `specified, not built`
Mermaid | fence, `mermaid` | `C043` | `F174` | `E501` | `built`
Maths | `$...$`, `$$...$$` | `C034` | `F175` | `E501` | `built`

### 4.2 Callouts

**Grammar.** A callout is a CommonMark block quote whose first line matches the header rule.

```text
callout     = header-line *body-line
header-line = ">" [" "] "[!" kind "]" [fold] [" " title] line-end
kind        = 1*( letter / digit / "_" / "-" )
fold        = "+" / "-"
title       = the rest of the line, trimmed
body-line   = ">" [" " text] line-end, or a lazy continuation line
```

- **The header rule is built**: `CALLOUT_REGEX = /^\[!([\w-]+)\]([+-]?)\s*(.*)/` at
  `src/modules/preview/presentation/markdown/callout.tsx:8`. The kind is lower-cased before lookup.
- **A callout ends where its block quote ends.** CommonMark's lazy continuation applies, so an
  unprefixed line directly after a paragraph inside the callout still belongs to it.
- **The fold marker** `+` or `-` is Obsidian's. It is read and kept; nothing folds yet.

**Kinds.**

Kind | Who writes it | Rendered as
`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION` | the product, upper case, verbatim | a callout; GitHub renders these natively
`fm-<name>` | the product, for its own prose kinds | a callout, once the name is registered
The rest of `CALLOUT_COLORS` in `callout.tsx`, such as `abstract`, `todo`, `bug`, `example`, `quote` | imported Obsidian vaults; never the product | a callout
Any other kind | nobody the product controls | **a plain block quote, with the marker's text kept** (`E503`, `A556`)

**The product never writes an unnamespaced kind outside the GFM five** (`specs/render/carrier.md`
invariant 3). A future GitHub alert name would otherwise collide with ours.

**The defect.** The shipped `CalloutBox` draws an unknown kind as a neutral note box, per the comment
at `callout.tsx` line 5.

`A556` requires a plain block quote. The test for `A556` will fail against
`d5cda79`, which makes it its own red proof.

**Titles disagreed; resolved below.** The carrier spec requires a title to be a heading inside the
container, because an attribute title is invisible on GitHub. S08 draws the title on the marker line.

```markdown
> [!TIP] Deposits
> A refundable deposit cut no-shows to 6 in 100.
```

```markdown
> [!TIP]
> ### Deposits
> A refundable deposit cut no-shows to 6 in 100.
```

- **Both are read.** The first is what imported files carry, and the parser above takes it.
- **Resolved (proposed 18 Sep, founder review): the product writes the second form**, the marker
  alone on its line and the title as `> ### Title`, for example from "Summarise into a callout" on S07.
  The level is always H3, so the bytes never depend on the headings around the callout.
- Rejected: the marker-line title S08 draws. On GitHub it loses the callout entirely, below.
- `[O]` GitHub's `POST /markdown` API, gfm mode, 2026-09-18 17:31 UTC:

Input sent | GitHub returned
`> [!TIP] Deposits` then `> Body` | a plain `<blockquote>` with the text `[!TIP] Deposits`; no alert
`> [!TIP]`, `> ### Deposits`, `> Body` | a tip alert, `markdown-alert-tip`, holding an `h3` and the body
`> [!tip]` then `> Body` | a tip alert, so GitHub matched the lower-case kind; the other four were not sent
`> [!zzz]` then `> Body` | a plain `<blockquote>`, the same degradation `E503` specifies

**Fixtures.**

Input | Expected render | Bytes
`> [!TIP] Deposits\n> Body\n` | a tip callout titled Deposits, body "Body" | unchanged
`> [!warning]\n> Body\n` | a warning callout, from the lower-cased lookup | unchanged
`> [!zzz] Odd\n> Body\n` | a block quote whose text is `[!zzz] Odd` and `Body` | unchanged
`> [!tip]- Folded\n> Body\n` | a tip callout; the `-` is kept and ignored | unchanged

### 4.3 Fenced data blocks, the `fm-` family

**Grammar.**

```text
fm-block  = open-fence line-end *body-line close-fence line-end
open-fence  = 3*"`" info   or   3*"~" info
info        = "fm-" name "@" major *( " " ignored-word )
name        = lower *( lower / digit / "-" )
major       = "1" / "2" / ... , no leading zero
body-line   = key ":" " " value line-end, or a blank line, or "#" comment
close-fence = the same character as the open fence, at least as many, nothing else on the line
```

- **The body is a flat YAML mapping** of scalar values, parsed with the `yaml` package the product
  already uses. A body that is not a flat mapping renders its source with `E501`.
- **Unknown keys are ignored and kept** (plan section 20, `A555`). A round trip changes no byte.
- **The version is required.** A fence whose info string is `fm-chart` with no `@1` renders its
  source with `E501`, and the writer never emits one (`A558`). Guessing `@1` would be a guess.
- **A major version the client does not know** renders its source with `E501`. Old versions are
  always read (plan section 20).
- **Use `~~~` when the body may contain a backtick** (`specs/render/carrier.md` invariant 8). A body
  that contains its own fence delimiter is refused on write.
- **Open and close are spliced together** (`specs/render/carrier.md` invariant 2). An edit that
  would leave a fence unclosed is refused with `E028`.

**The blocking prerequisite, still open at `d5cda79`.** `components.tsx:133` extracts the language with
`/language-(\w+)/`. `\w` excludes `-` and `@`, so `language-fm-chart@1` yields `fm`. `[O]` run with
`node -e` in this session. Fix this before any `fm-` block ships (`specs/render/carrier.md`, Interface).

### 4.4 `fm-chart@1`

**The chart points at the table; the table does not know about the chart.** So the table stays a
plain table in every other tool (`A045`), and the numbers have one home.

Key | Required | Values in v1 | Meaning
`kind` | yes | `pie`, `bar` or `line`, see below | which chart to draw
`table` | yes | `above` | the nearest GFM table above the block, with only blank lines between

**Reading the table** (set here, `[P]` from S08's "no numeric column" refusal):

- **Labels** are the first column's cells, as written.
- **Values** are the first column whose every body cell, trimmed, matches `^-?\d+(\.\d+)?$`.
- **A cell with a thousands separator or a unit is not a number.** The chart refuses rather than
  guess what `1,200` or `12%` means.

**The fixture.** The drawn example at `docs/mvp0/screens/gen.mjs:1170`, with the version added.

````markdown
| Channel   | Bookings |
|-----------|---------:|
| Instagram |      312 |
| WhatsApp  |      186 |
| Walk-in   |      102 |

```fm-chart@1
kind: pie
table: above
```
````

Expected: a pie of three slices, 312, 186 and 102, labelled by channel. A plain parser shows the
table and a two-line code block.

Condition | Outcome | `E` id | Copy
No table directly above | source shown, reason beside it | `E502` | `K.s08.chart.notable`
A table with no numeric column | same | `E502` | `K.s08.chart.nonumbers`
`kind` missing, or a kind this version does not draw | same | `E502` | `K.s08.chart.kind`
A key the renderer does not know, such as `colour: blue` | drawn; the key is kept | none | none

**Which kinds v1 draws. Resolved (proposed 18 Sep, founder review): `pie`, `bar` and `line`.**

- **The renderer translates the block into Mermaid** and draws it through the Mermaid path that
  already ships (section 4.7): `pie` into a Mermaid `pie`, `bar` and `line` into `xychart-beta`.
- `[O]` The installed `mermaid` 11.15.0 carries both diagrams:
  `node_modules/mermaid/dist/chunks/mermaid.core/pieDiagram-4H26LBE5.mjs` and
  `xychartDiagram-2RQKCTM6.mjs`, whose grammar holds `bar` and `line`.
- So v1 adds no dependency, and a chart that fails to draw fails the way a diagram does.
- Rejected: `pie` only, as drawn, which leaves every time series without a chart; and a charting
  library, which is a second renderer to secure and bundle.
- S08's D22 is closed by this row. It never reached `56-OPEN-DECISIONS.md`, so no second home forms.

**Never copy obsidian-charts code.** It is AGPL; the shape is public and the source is not ours
(`A559`).

### 4.5 `fm-draw@1`

**`specified, not built`.** It points at a drawing stored as one of the document's uploads.

- The plan says the drawing is "saved beside the note as JSON Canvas 1.0" (section 8). S08 names
  Excalidraw's own surface.
- **Checked: Excalidraw does not write JSON Canvas, and JSON Canvas cannot hold a drawing.**
  `[M]` JSON Canvas 1.0 (https://jsoncanvas.org/spec/1.0/, opened 2026-09-18) allows four node types,
  text, file, link and group, with no strokes. `[M]` Excalidraw's schema
  (https://raw.githubusercontent.com/excalidraw/excalidraw/master/dev-docs/docs/codebase/json-schema.mdx,
  opened 2026-09-18) saves a `.excalidraw` JSON file with `"type": "excalidraw"` and an `elements` array.
  The plan's phrase is wrong, and this section follows Excalidraw.
- **Resolved (proposed 18 Sep, founder review), closing S08's D23.** The block holds one key:

````markdown
```fm-draw@1
file: booking-flow.excalidraw
```
````

Key | Required | Rule
`file` | yes | a path relative to the document, `/` separators, no `..`, ending `.excalidraw`

- **Format:** Excalidraw's own `.excalidraw` JSON, stored exactly as the Excalidraw surface saves it.
- **Storage:** one of the document's uploads, under the upload key
  `u/{vaultId}/{docId}/{uploadId}/{filename}` (`21-DATA-MODEL.md` section 21.8), read through
  `AttachmentReader.get(id)` as S08 names. It sits inside the document's uploads, not beside them.
- **Every save of a drawing is a new upload**, so no R2 key is ever overwritten (section 21.8's rule).
  The document's attachment record points `file` at the newest `uploadId`.
- **In the person's mirror** (D03), the file is written at `file`, beside the note, so a reader of the
  repository can open it in Excalidraw. The plain-reader degradation is a code block naming it.
- Rejected: JSON Canvas, which cannot hold strokes; and a separate drawing store, which would give
  drawings a second key scheme and a second retention rule.
- **The one rule already fixed:** a missing file renders the block's source with `E042`, and the
  block in the document is never changed (`K.s08.drawing.missing`).

### 4.6 Flow view, and `fm-flow`

**Flow view needs no block.** An H2 is a phase, an H3 a step, a bracketed first word the tag, and a
trailing line the reference (`F181`).

Its version field is none, because the carrier is headings
(plan section 20). Errors: no H2, `E505`; an H3 before any H2, `E506`.

**`fm-flow` is named once, in the plan's section 20 table, and specified nowhere.** No grammar, no
keys, no fixture.

**Resolved (proposed 18 Sep, founder review): `fm-flow` does not exist.** Nobody builds it, and the
plan's section 20 row for it is withdrawn.

- Flow view already has a carrier, headings, which every reader shows. A fence would hide the same
  content from a plain reader and add a second source of truth for it.
- The founders deferred Flow view itself on 18 September (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md`,
  S09, `[Z]`), so there is no screen that needs it.
- Rejected: specifying it now for later. A format written ahead of its screen is a format nobody tests.

### 4.7 Mermaid

- **Carrier:** a fence whose info string is exactly `mermaid`. The body is passed, trimmed, to
  `mermaid.render` with `securityLevel: "strict"`.
- **Degradation:** renders on GitHub, GitLab and Obsidian; a code block elsewhere (`12-screens/S08.md`).
- **Failure:** the source in place and the reason beside it (`E501`, `A557`). Built today with the
  string "Diagram render error:" rather than `K.s08.mermaid.failed`, which is the deck's string.

```mermaid
flowchart LR
  A[Link in bio] --> B[Pick a slot]
  B --> C[Pay deposit] --> D[Reminder]
```

**One gap on the published page.** `src/modules/export/presentation/pdf-doc.ts` loads Mermaid from
`cdn.jsdelivr.net`. That is acceptable inside a PDF render. The published page carries no third-party
script (`A107`), so it must bundle Mermaid or draw the SVG at publish.

**Checked first:** the published page does not use the CDN today. `[O]` `PublicNoteView` renders
through `Markdown` from `@/modules/preview`, and `mermaid-block.tsx` loads `import("mermaid")` from
our own bundle. So `A107` holds now; the CDN load is in the PDF path only.

**Resolved (proposed 18 Sep, founder review): draw the SVG at publish.** The Mermaid SVG goes into
the rendered page stored under `renderedKey` (`21-DATA-MODEL.md` section 21.4), so a reader downloads
no Mermaid code at all.

- A diagram that fails at publish is stored as its source and reason (`E501`), as in the editor.
- Until publish-time rendering lands, the bundled dynamic import stays. It is first-party and passes
  `A107`.
- Rejected: shipping the Mermaid runtime to every reader. It adds a script download to a page view,
  on the surface that must be fast (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md` section 10.2).

### 4.8 Maths and tables

**Maths.** `$...$` inline and `$$...$$` display, drawn by KaTeX through `rehype-katex` 7.0.1. On a
parse error the library retries leniently, then emits the source text in a `katex-error` span. That
is the source-in-place rule, already built (`E501`).

**Tables.** GFM pipe tables. The table editor refuses an edit to a row whose cell count differs from
its header (`E500`, `K.s08.table.shape`). A table under a chart is never rewritten to suit the chart.

### 4.9 The AI mark

**Default: nothing in the file.** Attribution lives in the version record as `author`, `source`
(person, ai, agent), `model`, `ask`, `accepted_by`, `at` (plan section 20).

**With inline marking turned on**, an HTML comment beside the span:

```markdown
The deposit is refundable. <!-- ai: Haiku 4.5, shorten -->
```

- Export strips the comment unless the person asks to keep it (plan section 20).
- **The plan says it is invisible when rendered.** `specs/render/carrier.md` measured an HTML comment
  printed as visible text in three of its seven bench engines, under `html:false`. The plan's claim
  holds for GitHub, not for every reader.
- **Resolved (proposed 18 Sep, founder review): placement and escaping.**

Rule | Value
Placement | immediately after the span's last byte, one space, then the comment, on the same line
Shape | `<!-- ai: {model}, {ask} -->`, one line, nothing else inside
Escaping | in `{model}` and `{ask}`, `%` becomes `%25`, `<` becomes `%3C`, `>` becomes `%3E`, a line break becomes `%0A`

- **Why this escaping is enough.** `[M]` The HTML standard's comment rule
  (https://html.spec.whatwg.org/multipage/syntax.html, opened 2026-09-18) forbids comment text that
  starts with `>` or `->`, or contains `<!--`, `-->` or `--!>`, or ends with `<!-`. Every one of those
  needs a `<` or a `>`, and neither survives the escaping. It is lossless and reversible.
- **After, not before**, so the comment never splits a heading marker or a list marker from its text.
- Rejected: removing `--` from the ask, which is lossy, and a block comment on its own line, which
  cannot say which span it marks.
- The full `ask` is written, escaped. The version record holds the same text, so nothing is truncated.

### 4.10 Directives and Pandoc divs

- **`:::` is accepted on input and never written** (`specs/render/carrier.md` invariant 6). Pasted
  directive text is normalised to a permitted carrier on save.
- The carrier spec left open whether to normalise silently or show the person what changed. Silent
  normalisation edits bytes the person did not touch.
- **Resolved (proposed 18 Sep, founder review): never silently, and never on save.**

Where the `:::` comes from | What happens
Pasted or typed in this session | converted as it lands, before any save, with a one-line notice naming the carrier and an undo
Already in a file on disk, or brought in by import | left byte for byte; it renders as the plain text any CommonMark reader shows
The person wants it converted | the problems panel (S10) offers the conversion as a fix, which enters the change queue

- **A save never rewrites a directive it did not just receive.** Converting on save would edit bytes
  outside the person's change, which ADR-0006 forbids.
- Rejected: silent normalisation on save, and a blocking dialog on every paste.
- **Plan section 7 uses a Pandoc fenced div for paragraph borders and shading.** That div is `:::`
  on disk, which invariant 6 forbids.
- **Resolved (proposed 18 Sep, founder review): Doc mode drops the div.** Paragraph borders and
  shading move from plan section 7's `E` class to its `X` class, beside cell borders and shading, which
  that table already lists as having no carrier.
- **The substitute is a callout.** It renders as a bordered, shaded box in the product and as a quote
  on GitHub, so the author's emphasis survives in a plain reader.
- Rejected: an exception to invariant 6. ADR-0002 rejects `:::` as an output form, and the carrier
  bench measured a multi-paragraph `:::` container splitting silently on its closer.

---

## 5. The published page's twin and `llms.txt`

**The rule that overrides every other row here:** the twin and `llms.txt` are never gated, never
redirected and never given an interstitial (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:325`, `F216`,
`F217`). The same record reports that most agents arrive by the markdown route.

### 5.1 The routes

Route | Serves | State
`/<slug>` | the rendered page, S18 | `built`, as `src/app/(public)/[slug]/page.tsx`
`/p/<slug>` | a redirect to `/<slug>` | `built`, as `src/app/(public)/p/[slug]/page.tsx`
`/<slug>.md` | the twin: the source bytes | `specified, not built`
`/<slug>/llms.txt` | the page's machine index | `specified, not built`
`/llms.txt` | the site's own index | `built`, `public/llms.txt`, 836 bytes (`wc -c`)

**Both new routes redirect to sign-in today.**

`[O]` Read from `src/proxy.ts`: `SLUG_PATTERN` at
`src/proxy.ts:50` allows no dot, `PUBLIC_STATIC_RE` at `src/proxy.ts:15` has no `md`, and it matches
one path segment only. The fix goes in `isPublicPath()`, never as a per-file exception (S18).

**`/p/<slug>.md` is not served. Resolved (proposed 18 Sep, founder review).** It returns `404`, like
any unknown path.

- The twin has never existed at any URL, so no link made before the modern URL can point at
  `/p/<slug>.md`. There is nothing to keep working.
- Serving it as a redirect would break the rule that the twin is never redirected (section 5).
- Rejected: a second copy of the twin at the legacy path, which doubles the surface to keep byte-exact.

### 5.2 The twin, `/<slug>.md`

**The body is the published version's bytes, exactly.** Byte-order mark, front matter, line endings
and trailing newline included. It is read from the version's R2 key, `v/{vaultId}/{docId}/{sha256}`
(`21-DATA-MODEL.md` section 21.8), and never re-serialised.

Header | Value | Why
Status | `200`, with no `3xx` anywhere in the chain | `A104`, `A503`
`Content-Type` | `text/markdown; charset=utf-8` | set here
`ETag` | `"` + the body's SHA-256, lower-case hex + `"` | the version key already is that hash
`Cache-Control` | `public, max-age=60` | matches `revalidate = 60` in `src/app/(public)/[slug]/page.tsx`
`Link` | `</<slug>>; rel="canonical", </<slug>/llms.txt>; rel="describedby"` | the llms.txt proposal, below
`X-Robots-Tag` | `noindex` | published pages are not indexed today (plan section 10)
`Set-Cookie`, `Location` | never present | a cookie makes the response depend on the reader

**`HEAD` returns the same headers and no body.** `A503` drives the route with `curl -sI`.

**The response never depends on the request.** With no cookie, an expired session cookie, a crawler
user agent, and the owner over the published-page cap, the bytes and the status are the same (`A503`).

**A gap in the data model.** `shares/{slug}` carries `renderedKey` and `renderedHash` for the page,
and nothing that names the source version (`21-DATA-MODEL.md` section 21.4). The twin needs one.
**Resolved (proposed 18 Sep, founder review): a `sourceHash` field on `shares/{slug}`.** The twin
reads `v/{vaultId}/{docId}/{sourceHash}`, the version key that already exists.

Field | Type | Cap | Notes
`sourceHash` | string | 64 chars | SHA-256 of the published version's bytes, lower-case hex. Set at publish, with `renderedHash`

- It doubles as the twin's `ETag`, so the header costs no extra read.
- The row is for `21-DATA-MODEL.md` section 21.4; that file's owner copies it in, and this file then
  cites it rather than holding a second home.
- Rejected: re-deriving the source from `renderedKey`. A rendered page cannot be turned back into
  the bytes it came from.

**An inline AI mark is served in the twin. Resolved (proposed 18 Sep, founder review).** Plan section
20 strips it on export, and the twin is not an export: it is the published version's bytes.

- Stripping it would make the twin's bytes differ from the version whose hash is its `ETag`, and the
  twin would stop being a projection of one file.
- Inline marking is off by default (section 4.9), so a mark is present only when the author turned it
  on for that document.
- Rejected: stripping on serve, which turns the twin into a second format with its own rules.

### 5.3 The HTML page points at both

The rendered page at `/<slug>` sends this header, and the same two links as `<link>` elements:

```text
Link: </<slug>.md>; rel="alternate"; type="text/markdown", </<slug>/llms.txt>; rel="describedby"
```

`[M]` The shape is the llms.txt proposal's own example, https://llmstxt.org/index.md, opened
2026-09-18. It recommends `rel="alternate" type="text/markdown"` for the markdown version and
`rel="describedby"` for the covering llms.txt.

### 5.4 `/<slug>/llms.txt`

`[M]` From the same page: only the H1 is required; then an optional block quote summary; then prose
with no headings; then H2 sections, each a list of `[name](url)` links with optional `: notes`.

**Our file is generated from the published bytes, deterministically.** Same bytes in, same file out.

```text
# {title}

> {description}

## Page

- [{title}]({origin}/{slug}.md): the markdown source, byte for byte
- [{title}, as a web page]({origin}/{slug}): the rendered page
```

Field | Rule
`{title}` | front matter `title` if it is a non-empty string; else the first H1's text; else the slug
`{description}` | front matter `description` if it is a non-empty string. If absent, the block quote line and the blank line after it are omitted
`{origin}` | `APP_URL` from `src/config/env.ts`, never a request header. Resolved (proposed 18 Sep, founder review); the live apex today is `frontmatter.in` (`AGENTS.md` section 8), and any rename waits on D05, `needs founder`
Whitespace | runs of whitespace, line breaks included, collapse to one space; `[`, `]` and `\` in `{title}` are escaped with `\`
Bytes | UTF-8, no byte-order mark, LF line endings, one trailing LF

Headers match the twin's, with `Content-Type: text/plain; charset=utf-8` and no `Link` header.

**The fixture.** Slug `zephyrus-booking`, origin `https://frontmatter.in`, and this document:

```markdown
---
title: Zephyrus booking
description: A booking page for small studios.
---

# Booking
```

The expected `llms.txt`, byte for byte:

```text
# Zephyrus booking

> A booking page for small studios.

## Page

- [Zephyrus booking](https://frontmatter.in/zephyrus-booking.md): the markdown source, byte for byte
- [Zephyrus booking, as a web page](https://frontmatter.in/zephyrus-booking): the rendered page
```

### 5.5 When nothing is published there

Case | Status | Body | `E` id
Slug never published, or unpublished | `404`, all three routes | `K.s18.notfound`, as plain text on the two text routes | `E045`, `A615`
A revoked kit or share link | a plain refusal, never a redirect | none | `E601`

**Never a redirect to sign-in**, because that turns a dead link into a login wall for an agent. The
body never says whether the page once existed (`K.s18.notfound`).

**A password belongs to a share link, never to a published page** (S18). So no twin sits behind a
password, and the twin has no password state to specify.

---

## 6. The blueprint kit

**`specified, not built`, all of it.** There is no `src/modules/ideas/` and no kit store at
`d5cda79` (`ls src/modules`). Every rule here is the contract phase C builds to.

**A kit is a skill-shaped folder of fifteen files, shipped as one tarball, verified by a hash printed
outside it** (plan section 9, `12-screens/S15.md`).

The out-of-band hash is the point: a checksum
inside the tarball proves only that the transfer was intact.

### 6.1 The fifteen files

Path | Kind | Holds | Front matter version
`SKILL.md` | markdown | loads first; the skills-guide format | not ours
`AGENTS.md` | markdown | every agent reads it; the agents.md format | not ours
`00-BRIEF.md` | markdown | the idea in one page | none
`01-PRODUCT.md` | markdown | the product | none
`02-DATA-AND-API.md` | markdown | every entity the specs name (`A091`) | none
`03-ARCHITECTURE.md` | markdown | the architecture | none
`04-SETUP.md` | markdown | setting it up | none
`05-FRONTEND-SPEC.md` | markdown | the frontend, including any attached drawing | none
`specs/booking.md` | markdown | one spec per core flow | none
`specs/payments.md` | markdown | same | none
`DECISIONS.md` | markdown | one heading per decision | `decisions: 1`
`MAP.md` | markdown | the map as a document | `graph: 1`
`graph.json` | data | the map as data | `"graph": 1`
`MANIFEST.json` | data | every other file's size and hash | `"version": 1`
`SHA256SUMS` | data | a checksum line per file | the format's own

**Twelve markdown and three data** (`A090`). The data files are counted as files and drawn as nodes
nowhere (`A604`).

The two spec names are the drawn local-service example.

A template holds its own file list (plan section 9), so a marketplace kit may need other specs, or
more than two. If it does, `A090`'s fixed fifteen breaks.

**Resolved (proposed 18 Sep, founder review): the count is fixed at fifteen, and the template names
the two specs.**

- Plan section 9 marks "Fifteen files in a skill folder" `[Z]`, a founders' decision. A variable
  count would reverse it, so this file does not.
- **A template's file list sets only the two paths under `specs/`**: one file per core flow, the
  template's two most important. A local-service kit writes `specs/booking.md` and
  `specs/payments.md`; a marketplace template names its own two.
- A third flow goes inside one of the two specs, or in `01-PRODUCT.md`, never in a sixteenth file.
- The cost model in plan section 9 assumes one call per file, so a fixed count also keeps the
  blueprint's cost fixed.
- Rejected: a template-set count. It breaks `A090`, the `[Z]` count and the cost model together.

### 6.2 `DECISIONS.md`, `MAP.md` and `graph.json`

**`DECISIONS.md`.** Written by splice, one answer at a time, never whole (`12-screens/S14.md`).
**Resolved (proposed 18 Sep, founder review)** in this shape:

```markdown
---
decisions: 1
---

# Decisions

## Who takes the deposit?

Status: decided

The recommendation, and one line of reason.

## Do reminders go by WhatsApp or SMS?

Status: open
```

- **One H2 per decision**, the question as written.
- **The first line under it is `Status: decided` or `Status: open`.** Not sure is always `open`,
  never written as the founder's choice (`A087`).
- **Why a plain line.** It reads as a sentence in every renderer, an agent finds open decisions with
  `grep -n '^Status: open'`, and a one-line splice flips it.
- Rejected: a `> [!fm-decision]` callout per decision. It renders as a quote on GitHub, and an answer
  would then have to keep every body line `>`-prefixed through each later splice.

**`graph.json`.** The in-app graph is `{ nodes, links }` from `buildGraph` in
`src/modules/graph/presentation/graph-data.ts`, whose nodes carry a `color`. Colour is a view, so the
kit's file drops it:

```json
{
  "graph": 1,
  "nodes": [
    { "id": "00-BRIEF.md", "label": "Brief", "kind": "doc" }
  ],
  "links": []
}
```

- **`id` is the kit-relative path** of a file that exists in the kit (`A603`).
- **The four `kind` values, checked and corrected.** This file said S16 does not list them; it does.
  `12-screens/S16.md` names `doc`, `spec`, `why` and `agent`, from `KCOL` at
  `docs/mvp0/screens/gen.mjs:1274`, labelled Document, Spec, Decision and Agent file in `K.s16.node.kind`.
- **Resolved (proposed 18 Sep, founder review): `graph.json` uses those four ids verbatim**, assigned
  by path, so the kind is derived and never stored as a choice.

Path | `kind`
`SKILL.md`, `AGENTS.md` | `agent`
anything under `specs/` | `spec`
`DECISIONS.md` | `why`
every other markdown file, `MAP.md` included | `doc`

- So the example node above is written `"kind": "doc"`, and a real kit has twelve nodes: two
  `agent`, two `spec`, one `why`, seven `doc`. The three data files are not nodes (`A604`).
- **`links`** is a list of `{ "source": <path>, "target": <path> }`, the `GraphLink` shape in
  `graph-data.ts`, sorted by source then target, comparing UTF-8 bytes.

**`MAP.md`** is the same graph as prose, rebuilt from the files on every save, never a second source
of truth (plan section 5, S16). No source specified its body.

**Resolved (proposed 18 Sep, founder review): `MAP.md` is generated from `graph.json`, and nothing
else.**

```markdown
---
graph: 1
---

# Map

## Agent files

- [AGENTS.md](AGENTS.md): links to 00-BRIEF.md, 03-ARCHITECTURE.md

## Documents

- [00-BRIEF.md](00-BRIEF.md): no links
```

- **Four H2 sections in a fixed order**: Agent files, Documents, Specs, Decisions. An empty section
  is omitted.
- **One list item per node, sorted by path**, then `: links to` and its targets sorted and joined with
  `, `, or `: no links`.
- **Two builds of the same graph write the same bytes**, LF endings, one trailing LF. Any hand edit
  is overwritten by the next save, which is why the map is never a source of truth.
- Rejected: prose written by a model. It could disagree with `graph.json`, and it would cost a call.

### 6.3 `MANIFEST.json`

```json
{
  "version": 1,
  "kitId": "7f3a",
  "kitVersion": 1,
  "createdAt": "2026-09-18T10:00:00Z",
  "files": [
    { "path": "SKILL.md", "bytes": 2, "sha256": "87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7" },
    { "path": "specs/booking.md", "bytes": 2, "sha256": "0263829989b6fd954f72baaf2fc64bc2e2f01d692d4de72986ea808f6e99813f" }
  ]
}
```

This is a schema fixture over two files whose contents are `a\n` and `b\n`. The hashes are
`[O]`, from `printf 'a\n' | shasum -a 256` and `printf 'b\n' | shasum -a 256`.

Key | Type | Rule
`version` | integer | the format version, `1`. Rises only when this schema changes (plan section 20)
`kitId` | string | the id in the kit's URL
`kitVersion` | integer | the published revision, the `v1` in the URL. Rises on every publish (`F206`)
`createdAt` | string | RFC 3339, UTC, whole seconds, `Z` suffix
`files` | array | every file in the kit **except `MANIFEST.json` and `SHA256SUMS`**, thirteen in a real kit
`files[].path` | string | kit-relative, `/` separators, no leading `./`, no `..`
`files[].bytes` | integer | the file's length in bytes
`files[].sha256` | string | 64 lower-case hex characters

- **Sorted by `path`, comparing UTF-8 bytes.** So `00-BRIEF.md` precedes `AGENTS.md`, which precedes
  `specs/booking.md`.
- **Written with two-space indentation, keys in the order above, LF endings, one trailing LF.** Two
  builds of the same kit produce the same bytes.
- **Unknown keys are ignored** by a reader (plan section 20).

**No `rootHash` in this file.** S15 draws `rootHash` inside the manifest, but the root hash is taken
over the tarball, and the tarball contains this file.

A file cannot carry the hash of its own
container. `rootHash` lives in the server's kit record, `KitStore.manifest(kitId)`, and on the page.

`[P]` The field name `version` follows the plan's section 20. S15's `version` meant the kit's
revision, which this file names `kitVersion`.

**Resolved (proposed 18 Sep, founder review): two fields.** `version` is the format and
`kitVersion` is the revision, the `v1` in the URL.

- Plan section 20 gives every format a version field that rises only when the format changes. The
  revision rises on every publish (`F206`). One field cannot do both.
- Rejected: S15's single `version` for the revision. A reader could not then tell a new format from a
  new publish, and old kits would become unreadable the day the format changed.

### 6.4 `SHA256SUMS`

**The format `shasum -a 256` and `sha256sum` both write and both check.** One line per file:

```text
<64 lower-case hex> <space> <space> <kit-relative path> <LF>
```

- **Fourteen lines in a real kit**: the thirteen files in the manifest, then `MANIFEST.json` in
  sort order. Never a line for `SHA256SUMS` itself.
- Sorted by path, comparing UTF-8 bytes. No byte-order mark. One trailing LF.

**The fixture**, the same two files as 6.3:

```text
87428fc522803d31065e7bce3cf03fe475096631e5e07bbd7a0fde60c4cf25c7  SKILL.md
0263829989b6fd954f72baaf2fc64bc2e2f01d692d4de72986ea808f6e99813f  specs/booking.md
```

`[O]` In this session both `shasum -a 256 -c SHA256SUMS` and `sha256sum -c SHA256SUMS` printed
`OK` for each line and exited 0. With one hash changed, `shasum` printed `FAILED` and exited 1.

**Verified on every publish** (plan section 20). The publisher reads the built tarball back, checks
every line, and publishes nothing if one fails.

**Resolved (proposed 18 Sep, founder review): the refusal is `E511`**, "An export could not be
produced", whose recovery is to try again. A kit is an export of the blueprint, and a rebuild is the
right next step after a failed read-back.

- `17-ERROR-AND-REFUSAL-CATALOGUE.md`'s owner widens that row's trigger to name a kit publish, and
  its recovery to say nothing was published. No new id is needed.
- Rejected: a new id. The person's next step is the same as for any failed export, and a new row
  would be a second message for one situation.

### 6.5 The tarball, `kit.tar.gz`

**The root hash is the SHA-256 of the tarball's bytes, exactly as served.** The kickoff prompt hashes
the downloaded file with `shasum -a 256 kit.tar.gz` (`docs/mvp0/screens/gen.mjs:1477`), so no other
definition would verify.

Rule | Value
Container | POSIX ustar, gzip-compressed
Entry paths | the manifest's paths, with no leading `./`; the `specs/` directory entry precedes its files
Entry order | sorted by path, comparing UTF-8 bytes
Modes | files `0644`, directories `0755`
Owner | uid and gid `0`, empty user and group names
Times | every entry's mtime is `createdAt`, as whole seconds
gzip header | no file name, mtime `0`

**The tar layer is reproducible; the gzip layer is not promised to be.** Compressed bytes can differ
across zlib builds.

So a kit's tarball is built once, stored, and never re-compressed. `[O]` Node's
`zlib.gzipSync` wrote a header with flags `00` and mtime `0` in this session.

**Where it lives.** `21-DATA-MODEL.md` section 21.8 has no key for a kit. Following its rule that a
key never overwrites: **resolved (proposed 18 Sep, founder review), the kit key is
`k/{kitId}/{kitVersion}/{rootHash}.tar.gz`.**

- It contains the hash of its own bytes, so it obeys section 21.8's rule: a write either creates a new
  object or is a no-op on an identical one.
- `k/` is unused by the prefixes 21.8 already lists (`v/`, `q/`, `u/`, `p/`, `x/`, `log/`).
- That file's owner copies the row into 21.8; this file then cites it.
- Rejected: storing kits under the export key `x/`, which is lifecycle-expired. A published kit must
  stay fetchable (section 6.7).

**The URL and its response.**

Route | `/k/<kitId>/v<kitVersion>/kit.tar.gz`, from `docs/mvp0/screens/gen.mjs:1477`
Status | `200`, never a redirect
`Content-Type` | `application/gzip`
`ETag` | `"` + the root hash + `"`
`Cache-Control` | `public, max-age=31536000, immutable`, since a published version never changes
Revoked | a plain refusal, never a redirect to sign-in (`E601`)

### 6.6 The kickoff check

The prompt has three steps (`K.s15.kickoff.body`, drawn at `docs/mvp0/screens/gen.mjs:1476` to
`:1479`):

1. Download the tarball and hash it. **Stop unless the hash equals the one printed on the page**
   (`A093`).
2. Extract into `docs/kit`: `mkdir -p docs/kit && tar xzf kit.tar.gz -C docs/kit`.
3. Read before building, then build against `specs/*.md`.

**The printed hash is the full 64 characters when copied** (`A092`). The screen may shorten it for
display, as the drawing does with `9c1e…4b7a`, and the copy control never does.

**After extraction, an agent can check every file** with `cd docs/kit && shasum -a 256 -c SHA256SUMS`.
That proves the files match the manifest; only step 1 proves the kit is the one published.

### 6.7 Versions

- **Publishing again mints `kitVersion` plus one.** The old version stays fetchable at its own URL,
  and its hash changes (S15).
- **`version` rises only when a format in this section changes.** The old version is still read, and
  the map shows which version a kit carries (plan section 20).

---

## 7. Export and import formats

### 7.1 Export, as built

`[O]` Read from `src/modules/export/presentation/ExportMenu.tsx`, `export-doc.ts`, and the two
routes under `src/app/api/export/`. `F240` and `F241`.

Control | File | MIME | What the bytes are | State
Download .md | `{title}.md` | `text/markdown` | the editor's current text, encoded as UTF-8 by a `Blob` | `built`
Export HTML | `{title}.html` | `text/html` | a whole HTML document; Mermaid drawn to inline SVG, a failed diagram as a `<pre>` of its source | `built`
Export Word (.doc) | `{title}.doc` | `application/msword` | the same HTML, which Word opens; not `.docx` | `built`
Open PDF (print) | the server PDF, in a new tab | `application/pdf` | as below | `built`
Download PDF | `{title}.pdf`, characters outside `[\w\-. ]` replaced by `_` | `application/pdf` | A4, headless Chromium, Mermaid from a CDN with a two-second wait | `built`
Export the project | a zip | `application/zip` | every vault `.md` file, except `README.md` | `built`

**Four gaps between what ships and what is specified.**

- **The HTML export and the PDF load KaTeX's stylesheet from `cdn.jsdelivr.net`.** An exported file
  opened offline loses its maths styling. **Resolved (proposed 18 Sep, founder review): exports
  carry KaTeX themselves.** The HTML and Word exports inline the stylesheet and its WOFF2 fonts as
  data URIs; the PDF route loads the same files from our own origin, never a CDN.
  - `[O]` The cost: `katex.min.css` is 23,826 bytes (`wc -c`) and its 20 WOFF2 fonts total 259,792
    bytes (`cat node_modules/katex/dist/fonts/*.woff2 | wc -c`), from the installed `katex` 0.17.0,
    the version the export code already pins.
  - Only a document that contains maths carries them. One without maths gets neither.
  - Rejected: keeping the CDN link, which fails offline and sends a third-party request from a
    file the person owns.
- **The plan names Paged.js in the browser and Pandoc on the server** for PDF (section 8). What ships
  is headless Chromium. **Resolved (proposed 18 Sep, founder review): headless Chromium is the
  target.** It ships and already renders Mermaid and KaTeX. Paged.js may later run inside the same
  Chromium for running heads and page numbers; Pandoc is not used.
  - Rejected: Pandoc on the server. It is a second rendering engine whose output would differ from
    the preview, and plan section 8 lists it as GPL.
- **The PDF ignores front matter page setup.** `page` and `margins` (section 3.9) are honoured by
  export in the plan; the route uses a fixed A4 page and one shared margin. `specified, not built`.
- **The project zip carries no attachments**, against `F241`'s "every document and attachment".
  The plan's R2 key for it is `x/{uid}/{requestId}.zip` (`21-DATA-MODEL.md` section 21.8).

**Download .md keeps a byte-order mark, and loses CRLF after the first keystroke.** Checked on
18 September, replacing an unverified line.

- `[O]` The file is loaded by `getFile` in `src/shared/infrastructure/github/client.ts` with
  `Buffer.from(rawBase64, "base64").toString("utf-8")`. Run with `node -e`, that keeps U+FEFF and
  CRLF, and a `Blob` of the string writes them back as `efbbbf` and `0d0a`.
- So a download before any edit is byte-exact.
- `[O]` After an edit, the store holds `view.state.doc.toString()`. With `@codemirror/state` 6.6.0,
  `EditorState.create({doc: "\uFEFFa\r\nb\r\n"}).doc.toString()` returned `"\uFEFFa\nb\n"`. The mark
  survives; every CRLF becomes LF.
- **This is a defect against section 3.1's rule that line endings are kept.** It belongs in
  `44-TECH-DEBT-REGISTER.md`. The fix is CodeMirror's `EditorState.lineSeparator` facet, set to the
  file's own ending when it is loaded.
- `INFERENCE:` a save after an edit reads the same `doc.toString()`, so a saved CRLF file may be
  rewritten to LF throughout. `UNVERIFIED:` the save path to GitHub was not traced here. needs: a
  round-trip test that opens a CRLF file, types one character, saves, and compares every other byte.
- The twin (section 5.2) is specified byte-exact; this export must meet the same bar.

### 7.2 Import, briefly

Import produces ordinary markdown; nothing here is a new format. Plan section 11 is the source.

Source | Carrier | Limit or refusal | State
A folder, or an Obsidian vault | the files as they are; `.obsidian` read for the daily-note path and templates only | invalid UTF-8, `E036` | `specified, not built`
Google Docs | Drive's `text/markdown` export | over 10 MB, `E035` | `specified, not built`
Word | converted in the browser with mammoth | a failed conversion keeps the original as an attachment, `E561` | `specified, not built`; mammoth is not in `package.json`
Notion | the export zip, as a project | none stated | `specified, not built`

**Every imported front matter block goes through section 3 unchanged.** An import never
re-serialises YAML, and a zero-indent sequence is refused on write rather than rewritten (`F277`).

---

## 8. Open items, and who decides

**Every item below was open until 18 September and carries a proposed resolution now.** A row marked
`needs founder` has a recommendation written beside it, and only the founder can make it binding. Each
row's reasoning, and the alternative rejected, is in `docs/pack/review/66-formats.md`.

Item | Section | Resolution, proposed 18 Sep for founder review | Who confirms | State
Canonical published URL | 0, 5.1 | `/<slug>`; `/p/<slug>` stays a redirect | the founders | resolved
Whether `/p/<slug>.md` is served | 5.1 | no; a plain `404` | the founders | resolved
Subscript in Doc mode | 2.2 | `<sub>` and `<sup>`, never `~x~` or `^x^` | Sagnik | resolved
`remark-breaks` on the published page | 2.3 | kept; one pipeline for preview and page | Sagnik | resolved
The shapes of `page` and `margins` | 3.9 | scalar strings; defaults `A4` and `1.6cm` | Sagnik | resolved
Ids for the two writer defects | 3.6 | none; they are `TD-` rows for `44-TECH-DEBT-REGISTER.md` | the owner of 44 | resolved
Whether to stamp `verified` (D06) | 3.10 | recommend yes, on accept, in phase D | the founders | `needs founder`
What `by` holds | 3.10 | recommend `human:<handle>`, OKF's human actor form | the founders | `needs founder`
Callout title form written | 4.2 | the marker alone, then `> ### Title` | Sagnik | resolved
Chart kinds in v1 (S08's D22) | 4.4 | `pie`, `bar`, `line`, drawn through Mermaid | Sagnik | resolved
Drawing key, storage and format (S08's D23) | 4.5 | `file`; an upload under `u/`; `.excalidraw` JSON | Sagnik | resolved
Whether `fm-flow` exists | 4.6 | no; Flow view keeps headings | Sagnik | resolved
Mermaid on the published page | 4.7 | SVG drawn at publish into the rendered page | Sagnik | resolved
The AI mark's placement and escaping | 4.9 | after the span; `%`, `<`, `>`, line breaks percent-encoded | Sagnik | resolved
Normalising pasted `:::` | 4.10 | converted on paste with a notice and undo; never on save | Sagnik | resolved
The Pandoc div for borders and shading | 4.10 | dropped; a callout is the substitute | Sagnik | resolved
A `sourceHash` on `shares/{slug}` | 5.2 | added; the owner of 21 copies the row | the owner of `21-DATA-MODEL.md` | resolved
Whether the twin serves an inline AI mark | 5.2 | yes, byte for byte | Sagnik | resolved
The public origin | 5.4 | `APP_URL`; the value waits on the name, D05 | the founders | `needs founder` for the value
Whether a kit is always fifteen files | 6.1 | fixed at fifteen, `[Z]` in plan section 9; the template names the two specs | Sagnik | resolved
The `DECISIONS.md` status line | 6.2 | `Status: decided` or `Status: open` under each H2 | Sagnik | resolved
The map's node kinds | 6.2 | `doc`, `spec`, `why`, `agent`, from S16, assigned by path | Sagnik | resolved
The body of `MAP.md` | 6.2 | generated from `graph.json`, byte-stable | Sagnik | resolved
`version` and `kitVersion` | 6.3 | two fields, format and revision | Sagnik | resolved
An `E` id for a failed publish checksum | 6.4 | `E511`, its trigger widened by the owner of 17 | the owner of `17-ERROR-AND-REFUSAL-CATALOGUE.md` | resolved
An R2 key for kits | 6.5 | `k/{kitId}/{kitVersion}/{rootHash}.tar.gz` | the owner of `21-DATA-MODEL.md` | resolved
Inlined KaTeX in exports | 7.1 | inlined, only when the document has maths | Sagnik | resolved
The PDF engine | 7.1 | headless Chromium; no Pandoc | Sagnik | resolved

**Edits this file hands to other owners.** None of them is made here, since each file has one owner.

- `21-DATA-MODEL.md`: the `sourceHash` field (5.2) and the `k/` kit key (6.5).
- `17-ERROR-AND-REFUSAL-CATALOGUE.md`: widen `E511` to a kit publish (6.4).
- `44-TECH-DEBT-REGISTER.md`: the two writer defects (3.6) and the CRLF loss after an edit (7.1).
- `docs/mvp0/PRODUCT-PLAN.md`: section 7 moves borders and shading to `X` and subscript to raw
  HTML; section 8's "JSON Canvas 1.0" reads "Excalidraw's own file"; section 20's `fm-flow` row goes.

**D22 and D23 are closed here**, not carried into `56-OPEN-DECISIONS.md`, so no second home forms.

---

## 9. Limits of this file

**Not assessed.**

- `SKILL.md` and `AGENTS.md` as formats. They are not ours, and S11 checks them.
- Slides (Marp), mind maps (markmap), kanban and the portfolio page's rendering. Each is a view over
  plain markdown with no new syntax, per plan section 8, and belongs to its screen.
- The live editor's own block split beyond confirming it uses the same parser stack.

**Could not be verified in this session.**

- Whether a save after an edit rewrites a CRLF file to LF. The download half was checked (7.1); the
  save path to GitHub was not traced.

The four items this list held before 18 September were all checked that day: the Open Knowledge
Format page (3.10), GitHub's rendering of callout titles and kinds (4.2), Excalidraw's file format
(4.5), and Download .md's byte-order mark and line endings (7.1).

**Specified here, not by any earlier source.**

These are this file's own choices, each marked where
it appears: the twin's headers, the `llms.txt` template, the chart's table-reading rules, the
manifest's key set and order, and the tarball's byte rules. Each is reviewable, and none is `[Z]`.

**What would falsify it.**

- Any fixture in sections 2.6, 3.5, 4.2, 4.4, 5.4, 6.3 or 6.4 failing against a build that claims
  to implement the section.
- A source line cited here having moved. Every `file:line` was read with `sed -n` at `d5cda79`, and
  `docs/mvp0/PRODUCT-PLAN.md` was being edited by another writer during this session, which is why
  it is cited by section only.
