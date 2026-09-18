---
id: research-sheets-2026-09-18
title: Sheets for fmd, what to build and what file it lives in
mode: research
status: proposal
updated: 2026-09-18
owner: sagnik
covers: [sheets, tables, formulas, sharing, D13]
---

# Sheets for fmd

**The founder's ask, 18 September 2026:** add Sheets. A basic, bare-bone sheet, in the spirit of
Notion and Obsidian, not all of Google Sheets.

This file answers what the incumbents ship, what people ask for, which file format a sheet lives
in, how formulas work, and how a sheet is shared.

**How it was made.** Every source below was opened with `curl` on 18 September 2026 (UTC).

Where a claim rests on something not opened, it says `UNVERIFIED:`. Where it is my reading rather
than a source, it says `INFERENCE:`. Tags `[O]` mean observed in this repository in this session.

## The answer in five lines

1. **The canonical sheet is a GFM pipe table inside a markdown document.** Its formulas live in an
   `fm-sheet@1` fence directly below it, and computed values are written into the cells.
2. **A `.csv` file opens in the same grid**, edited by splice, never re-quoted as a whole.
3. **Rows that are notes, one file per row, are D13's database view**, not a sheet. The sheet grid
   is reused as that view's table layout.
4. **Formulas name columns, never cell addresses.** `Qty * Price` and `sum(Total)`, a dozen
   functions, evaluated by our own small evaluator.
5. **On a published page a sheet is a read-only table** that a reader may sort and filter for
   themselves. Nothing a reader does is saved, and filtering never hides data.

## Contents

1. What the incumbents ship at the bare-bone level
2. What users ask for, ranked by evidence
3. The file format, the crux
4. Formulas
5. Sharing a simplified sheet
6. fmd Sheets v1, and the never-build list
7. Two defects found in the shipped table editor
8. Limits of this research

## 1. What the incumbents ship at the bare-bone level

### 1.1 Obsidian Bases, the closest neighbour

Source: the Obsidian help vault, `raw.githubusercontent.com/obsidianmd/obsidian-help/master/en/Bases/`,
files `Introduction to Bases.md`, `Bases syntax.md`, `Create a base.md` and `Layouts/Table view.md`.

- **Bases is a core plugin.** Its introduction says all the data "is stored in your local Markdown
  files and their properties". The rows are notes and the columns are their front matter.
- **A base is a `.base` file of YAML**, or a `base` code block embedded in a note. The file holds
  `filters`, `formulas`, `properties`, `summaries` and `views`. It holds no rows.
- **There is no source clause.** The syntax page says a base includes every file in the vault by
  default, "There is no `from` or `source` like in SQL or Dataview".
- **Formulas are stored as strings in YAML**, for example `ppu: "(price / age).toFixed(2)"`. They
  refer to `note.x`, `file.x` and `formula.x` properties, and circular references are refused.
- **Five layouts ship:** Table, List, Cards, Kanban, plus Map. Summaries sit at the foot of a table column.
- **Built-in summaries:** Average, Min, Max, Sum, Range, Median, Stddev, Earliest, Latest,
  Checked, Unchecked, Empty, Filled, Unique.

**What this means for fmd.** Bases is exactly D13, the database view over front matter. It is not a
spreadsheet: it cannot hold a table of numbers that lives in one document.

### 1.2 Notion databases

Sources: `notion.com/help/database-properties`, `/relations-and-rollups`, `/views-filters-and-sorts`,
`/forms` and `/public-pages-and-web-publishing`.

Area | What Notion ships, as its help pages list it
Property types | Text, Number, Select, Status, Multi-select, Date, Formula, Relation, Rollup, Person, File, Checkbox, URL, Email, Phone, Created time, Created by, Last edited time, Last edited by, Button, ID, Place
Number display | "formatted as currency or progress bars"
Views | Table, Board, Timeline, Calendar, List, Gallery, Chart
Rollups | Count all, Count values, Count unique values, Count empty, and more calculations over a relation
Forms | "Forms are connected to databases, so each question in your form is connected to a property"
Each view | Its own filters and sorts; "Settings applied to one database view won't be applied across all other database views"

**What this means for fmd.** Notion's table is a database whose rows are pages. Relations and
rollups are its power. They are also where a bare-bone sheet stops, see section 6.

### 1.3 Google Sheets, the features most used

Sources: `support.google.com/docs/table/25273` (function list), `/answer/3540681` (sort and filter),
`/answer/2494822` (sharing), `/answer/183965` (publish), `support.google.com/drive/answer/37603` (limits).

- **The function list has 514 rows** in 17 categories, counted from the page by a regex over its
  text (`Date`, `Math`, `Statistical`, `Lookup` and others). Statistical alone has roughly 136.
- **The limit is 10 million cells or 18,278 columns** for a spreadsheet, per the Drive limits page.
- **A filter view** can be saved and shared. A person with view-only permission "can create a
  temporary filter view that only you can use. Your filter view won't be saved."
- `UNVERIFIED:` **which functions are "most used".** Google publishes no usage ranking that I
  found. The minimum set in section 4 is drawn from what the neighbours ship, not from usage data.

### 1.4 Airtable

Sources: `support.airtable.com/articles/4130354023-using-the-view-share-menu-in-airtable`,
`/articles/3784973334-shared-view-url-filters`, `/articles/6973404921-embedding-airtable-views-and-bases`,
`support.airtable.com/docs/airtable-plans`, `airtable.com/pricing`.

- **The Free plan allows 1,000 records per base.** Paid plans advertise up to "100M records".
- **Views are shared by link, embedded, or turned into a form view.** The share menu offers a
  copy-data toggle, a password (paid plans), an email-domain restriction, plus buttons to regenerate or disable the link.
- **Shared views cannot be restricted to named people.** The page says individual email
  allowlists "are not supported".

### 1.5 Grist, NocoDB, Coda, Zoho Sheet, Excel for the web

Product | What was confirmed | Source
Grist | Formulas "are written in Python"; a whole document downloads "as an SQLite database file with a .grist extension"; CSV and XLSX export; public access as viewer or editor | `support.getgrist.com/formulas/`, `/exports/`, `/sharing/`
NocoDB | Grid, Form, Gallery, Kanban and Calendar views; a shared view is read-only, with an optional password and a toggle for CSV and XLSX download | `nocodb.com/docs/product-docs/views`, `.../collaboration/share-view`
Coda | The formulas page now titles itself "Superhuman Docs formulas" | `coda.io/formulas`
Zoho Sheet | "more than 350 predefined functions", pivots, charts, cell and range locks | `zoho.com/sheet/features.html`
Excel for the web | Not all file formats are supported and "some features may work differently than the desktop app" | Microsoft's page on differences between the browser and Excel

`UNVERIFIED:` **Coda's table feature set.** Its help pages returned 403 and 404 to `curl`, and the
formulas page renders its content with JavaScript. The rename to Superhuman Docs is confirmed only
by the page title.

### 1.6 Markdown-native table editors

Editor | Tables | Formulas | Source
Typora | GFM pipe tables, edited through menus, shortcuts and drag | none found | `support.typora.io/Table-Editing/`
HackMD | GFM tables, and a `csvpreview` fence that renders CSV as a table, parsed by Papa Parse | none | `hackmd.io/s/features`
Advanced Tables (Obsidian, GNU General Public License 3.0, 2,611 stars) | Formatting and navigation of pipe tables | `<!-- TBLFM: @>$2=sum(@I..@-1) -->`, an HTML comment after the table, evaluated on a button press | `github.com/tgrosinger/md-advanced-tables/blob/main/docs/formulas.md`
DB Folder (Obsidian, MIT licence, 1,403 stars) | A Notion-like table over notes | footer formulas | the repository is **archived**, per the GitHub API
Mark Text (61,568 stars) | GFM tables | `UNVERIFIED:` its syntax doc did not mention formulas | GitHub API

**The pattern.** Every markdown-native editor either edits a pipe table with no formulas, or
bolts formulas on through an HTML comment. The one that went furthest, DB Folder, is archived.

### 1.7 The incumbents side by side

Capability | Google Sheets | Notion | Obsidian Bases | Airtable | Grist | Advanced Tables
Rows live in | the service | the service | note front matter | the service | an SQLite file | a pipe table
Grid editing | yes | yes | yes | yes | yes | yes
Typed columns | by format | 22 property types listed | by property type | yes | yes | no
Formulas | 514 functions | own language | own expression language | yes | Python | org-mode style
Formula addressing | A1 cells | properties | properties | fields | columns | row and column symbols
Summaries at the foot | by formula | yes | 14 built in | summary bar | by formula | by formula
Views of one dataset | filter views | 7 layouts | 5 layouts | yes | yes | no
Plain file another tool opens | export only | export only | yes | export only | SQLite | yes

## 2. What users ask for, ranked by evidence

### 2.1 How the evidence was counted

- **GitHub:** the search API, `sort=reactions`, on three repositories. The number is the issue's
  total reactions, with the thumbs-up count beside it where they differ.
- **Obsidian forum:** Discourse's JSON for each topic. "OP likes" are likes on the opening post,
  which is how the forum votes on a feature request. "Topic likes" count every post.
- **Hacker News:** the Algolia API, points and comment counts.
- **Reddit was not reached.** See section 8.

### 2.2 The signals, strongest first

Signal | Count | Where
Obsidian Bases announced | 695 points, 255 comments | `news.ycombinator.com/item?id=44945532`
Nested YAML in Properties and Bases | 293 OP likes, 790 topic likes, 30,600 views | `forum.obsidian.md/t/63826`
Support checkboxes in tables | 178 OP likes, 302 topic likes, 47,313 views | `forum.obsidian.md/t/554`
"Burning out" a dataview, freezing a live query into text | 126 reactions (118 thumbs-up), 142 comments | `github.com/blacksmithgu/obsidian-dataview/issues/42`
Sheet Markup, spreadsheets inside a markdown document | 120 points, 47 comments | `news.ycombinator.com/item?id=35524256`
Plain-text table editing toggle in Live Preview | 42 OP likes, 114 topic likes | `forum.obsidian.md/t/73866`
Markdown tables as a data source | 82 reactions (56 thumbs-up) | `github.com/blacksmithgu/obsidian-dataview/issues/555`
A type system and database-like views | 72 OP likes, 151 topic likes | `forum.obsidian.md/t/46444`
Bases pagination | 49 OP likes | `forum.obsidian.md/t/101201`
Freeze table headers in Bases | 35 OP likes | `forum.obsidian.md/t/103507`
Conditional colour in Bases | 33 OP likes | `forum.obsidian.md/t/102724`
"Spreadsheets: new section for tabular data" | 30 OP likes, 60 topic likes, 16,598 views | `forum.obsidian.md/t/51552`
Direct editing of dataview tables | 29 reactions | `github.com/blacksmithgu/obsidian-dataview/issues/749`
Bases read-only mode | 25 OP likes | `forum.obsidian.md/t/101202`
Org-mode style table formulas | 21 reactions | `github.com/tgrosinger/advanced-tables-obsidian/issues/14`
Merge cells | 17 reactions | `github.com/tgrosinger/advanced-tables-obsidian/issues/323`
Import CSV to markdown | 13 reactions | `github.com/tgrosinger/advanced-tables-obsidian/issues/78`
Bases data from a single CSV, JSON or markdown file | 8 OP likes, 27 topic likes | `forum.obsidian.md/t/103622`
Store relations in front matter, not inline | 10 reactions | `github.com/RafaelGB/obsidian-db-folder/issues/1002`
Resize column width | 10 OP likes | `forum.obsidian.md/t/38902`
Multiple lines of text in a cell | 7 reactions | `github.com/tgrosinger/advanced-tables-obsidian/issues/215`
Simple arithmetic cell formulas | 7 reactions | `github.com/tgrosinger/advanced-tables-obsidian/issues/13`
Support CSV natively | 5 OP likes | `forum.obsidian.md/t/23573`
Paste into many cells at once | 4 reactions | `github.com/RafaelGB/obsidian-db-folder/issues/794`
Merge table cells, forum | 2 OP likes each, two topics | `forum.obsidian.md/t/114956`, `/t/78051`

### 2.3 What the words say, not only the counts

- **The Spreadsheets request (`/t/51552`) is the founder's ask, three years early.** It asks for
  "simple formulas, simple charts, sorting" and calls it "a lite version of Excel/Google Sheets".
- **The Sheet Markup thread found the addressing problem in one comment.** Adding a row left the
  total unchanged, because "the SUM still points to B2-B6". That is cell addressing failing on a
  text file (`news.ycombinator.com/item?id=35545523`).
- **The same thread asked for bidirectional editing.** One reader edited the grid and expected the
  markdown to change: "i guess not". fmd's projection law gives this for free.
- **The Bases thread asks where the rows live.** One commenter could not find "the rows" in the
  syntax. Another wanted it "more like mermaid", portable to GitHub and VS Code, with "bare CSV".
- **"Burning out" is a projection-law request.** People want a computed result written into the
  file, so it stays true when the inputs later change. Section 4 writes computed values to cells.

### 2.4 Must have, against power features

Bare-bone must have | Evidence
Grid editing in place, with the file changing underneath | dataview `#749`, the Sheet Markup bidirectional complaint, Bases itself
Checkbox cells | forum `/t/554`, the largest single table request
Sort and filter | forum `/t/51552`, Google filter views, every incumbent
Column summaries: sum, average, count, min, max | Bases' 14 summaries, Notion rollups, Advanced Tables' `sum` and `mean`
Row formulas over named columns | Advanced Tables `#14` and `#13`, Sheet Markup, Bases formulas
Add, move and delete rows and columns | Typora's feature list, every editor
CSV import, and open a `.csv` | Advanced Tables `#78`, forum `/t/103622` and `/t/23573`
Show the plain text on demand | forum `/t/73866`, 114 topic likes
Freeze the header row | forum `/t/103507`, Advanced Tables `#378`

Power feature | Why not in a bare-bone sheet
Merge cells | GFM cannot express a merged cell, so the file would need a carrier outside GFM. Low votes too
Pivot tables | Zoho and Google ship them; no request in this sample asked for one
Charts inside the sheet | fmd already has `fm-chart@1` pointing at a table (`docs/pack/66-FORMAT-SPECIFICATIONS.md` section 4.4)
Relations and rollups across tables | Notion's core, and D13's job over front matter, not a sheet's
500 functions | Google's list; nobody asked for more than simple arithmetic and summaries
Conditional formatting | 33 votes, and colour is not text, so it has no plain-file form
Cross-sheet references | the A1 problem again, worse
Real-time co-editing of one grid | the product syncs by git merge and a splice journal, never a conflict-free replicated data type, a CRDT (settled)

## 3. The file format, the crux

### 3.1 The five candidates

Candidate | Byte-exact round-trip risk | What a git diff looks like | What an agent reads and writes | Where formulas go | Limits | What else opens it
**A. GFM pipe table in a `.md` document** | Low if the writer splices one cell. High if it re-serialises the table, which the shipped editor does (section 7) | One line per changed row | Reads it everywhere; writes it with no tooling | Nowhere in GFM. Needs a carrier | The document's own: 4 MiB and 200,000 lines `[O]` | GitHub, Obsidian, Typora, HackMD, and any GFM renderer
**B. A `.csv` file** | Medium. Quoting style, CRLF or LF, a byte-order mark and the delimiter are all choices a writer can change silently | One line per record, except a quoted field holding a line break | Reads it well; a naive writer re-quotes everything | None. A cell starting `=` is a formula-injection vector | GitHub renders only up to 512 KB | Excel, Google Sheets, GitHub, every data tool
**C. Front-matter records across a folder** | Low. The front matter walker is built and refuses what it cannot address (`E004`, `E009`) | One file per changed row | Reads and writes one small file per row | In a view definition, as Bases does | One file per row; fine for dozens, heavy for thousands | Obsidian Bases, Dataview
**D. A fenced block holding the data** | Low, the fence splices as one unit | One line per row inside the fence | Reads it; another tool shows only code | Inside the block | The document's own | Other tools show a code block, not a table
**E. A sidecar file beside the document** | Hidden state. The view depends on a file the reader does not see | A JSON diff nobody reads | Two files to keep in step | In the sidecar | Any | Nothing

Sources for the rows: the GFM specification section 4.10 (`github.github.com/gfm/`); RFC 4180
(`rfc-editor.org/rfc/rfc4180.txt`); GitHub's rendering page (`docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files`);
OWASP (`owasp.org/www-community/attacks/CSV_Injection`); the shape gate at
`src/modules/mdmax/domain/shape-gate.ts`, where `MAX_BYTES = 4 * 1024 * 1024` and `MAX_LINES = 200_000` `[O]`.

### 3.2 Facts that decide it

- **GFM cells are single-line.** "Block-level elements cannot be inserted in a table." A pipe in a
  cell must be escaped as `\|`.
- **GFM forgives ragged rows when it renders.** Fewer cells than the header are padded, and "If
  there are greater, the excess is ignored." So only an editor can refuse a misshapen row (`E500`).
- **CSV was never a standard.** RFC 4180 says the format "has never been formally documented",
  specifies CRLF line breaks, and is published as Informational.
- **GitHub renders a CSV as an interactive table**, but fails on "Mismatched column counts" and on
  files over 512 KB, and it rejects semicolon delimiters.
- **Any cell starting with `=` is dangerous in a CSV.** OWASP: a spreadsheet opening the file will
  interpret such cells "as a formula". It lists `+`, `-`, `@`, tab and carriage return too.
- **The pack refuses HTML comments as a carrier** (`docs/pack/66-FORMAT-SPECIFICATIONS.md` section 4.1),
  so Advanced Tables' `<!-- TBLFM: ... -->` cannot be our formula store.
- **The `fm-` fence body must be a flat YAML mapping** (section 4.3). A CSV body would break that
  grammar. A list of formulas, one per key, fits it exactly.

### 3.3 The recommendation

**The canonical sheet is candidate A, a GFM pipe table in a markdown document. Its formulas live
in an `fm-sheet@1` fence directly below the table.**

This mirrors `fm-chart@1`, where the chart points at the table and the table does not know about
the chart.

```text
| Item  | Qty | Price | Total |
|-------|----:|------:|------:|
| Flour |   2 |    40 |    80 |
| Salt  |   1 |    20 |    20 |

~~~fm-sheet@1
table: above
col.Total: "Qty * Price"
foot.Total: "sum(Total)"
foot.Qty: "sum(Qty)"
~~~
```

- **`col.<header>`** is a row formula. fmd computes it and writes the value into each cell of that
  column by a one-cell splice. Every other tool shows the numbers, and an agent reads them.
- **`foot.<header>`** is a summary. It is drawn under the grid and never written to the file, as
  Bases does. `INFERENCE:` writing a totals row would make the table disagree with itself after any
  edit made elsewhere.
- **Unknown keys are ignored and kept**, and the version is required, as for every `fm-` block.
- **A `.csv` file opens in the same grid** (candidate B), because people hold data that way and
  GitHub, Excel and Sheets open it. A `.csv` carries no formulas.
- **Rows that are whole notes are D13's view** (candidate C). The sheet grid is that view's table
  layout; the data stays in each note's front matter.
- **D and E are refused.** A data fence hides the table from every other tool. A sidecar breaks the
  projection law.

### 3.4 What is refused rather than guessed

Situation | Outcome | Code
A row's cell count differs from the header, on an edit | that edit is refused | `E500`, existing
A typed cell value contains a line break | refused. GFM cells are single-line and stripping it is a guess | `INFERENCE:` new code needed
An `fm-sheet@1` block with no table directly above it | the block renders its source | `E501`, existing
`col.X` names a header the table lacks, or two headers share a name | the block renders its source | `E501`
A formula refers to itself, directly or through another column | that column is not computed; the file is unchanged | new code
A formula meets a cell that is not a number (`1,200`, `12%`, `n/a`) | that cell shows an error; its file bytes are unchanged | the `fm-chart@1` number rule, reused
A computed cell in the file disagrees with its formula, because it was edited elsewhere | both values are shown, and a recompute is offered as a change in the queue. Opening never writes | new code
A `.csv` with mixed line endings, or a delimiter other than comma (`.csv`) or tab (`.tsv`) | opens read-only with the reason | new code
A `.csv` record holding a quoted line break | opens read-only in v1 | `INFERENCE:` a v1 simplification
A cell edit that would need the table re-padded to stay aligned | the cell is spliced alone; alignment is left as it was | a rule, not a refusal

**The rule under all of it.** A cell edit changes only that cell's bytes. It never re-pads, re-quotes
or re-orders anything else. The diff for one edit is one line.

## 4. Formulas

### 4.1 The engines, and their licences

Licences were read from each repository's licence file through the GitHub API; stars and last push
are from the same API on 18 September 2026.

Engine | Licence, as read | What it is | Stars, last push | Fit for fmd
HyperFormula | "dual-licensed ... either a proprietary license or the GNU General Public License version 3 (GPLv3)", chosen by a `licenseKey` such as `'gpl-v3'` | A full headless engine, "~400 built-in functions", Excel and Sheets syntax | 2,790, 2026-09-18 | **No.** `INFERENCE:` the GPL path would reach our shipped client code; the other path is a paid licence. Both are more than a bare sheet needs
formula.js | "The MIT License (MIT)", copyright Sutoiku 2014 | Excel functions as plain JavaScript calls: `formulajs.SUM([1, 2, 3])`. The README shows no parser | 819, 2026-07-28 | **As a reference** for function behaviour, or a few imports
fast-formula-parser | MIT | A parser for Excel-style formulas | 523, 2025-09-10 | No. Built around A1 cells, which section 4.3 refuses
IronCalc | MIT or Apache 2.0 | A spreadsheet engine in Rust; its README says "Early testing" | 4,166, 2026-09-17 | Not yet. Watch it
Univer | Apache 2.0 | A full spreadsheet suite | 14,407, 2026-09-18 | No. A whole application, not a bare sheet
Jspreadsheet (`jspreadsheet/ce`) | MIT | A grid component | 7,226, 2026-09-17 | Possible grid, `UNVERIFIED:` not evaluated
x-spreadsheet | MIT | A canvas grid | 14,584, 2024-08-07 | No. No push for two years
Fortune-sheet | MIT | A grid; its README says it "originated from Luckysheet" | 3,722, 2025-12-15 | No. Too much sheet
Grist | Apache 2.0 | A product with Python formulas | 11,819, 2026-09-18 | No. A server product
NocoDB | "Sustainable Use License": use "only for your own internal business purposes or for non-commercial or personal use" | A database front end | 65,002, 2026-09-18 | **No.** The licence bars our use

**The recommendation: our own small evaluator, in the domain layer.** A tokeniser and a small
precedence parser over numbers, strings, column names, the operators below and about fourteen
functions.

`INFERENCE:` a few hundred lines, tested against formula.js outputs for the shared functions.
**It never calls `eval` or `new Function`.**

### 4.2 The minimum function set

Drawn from what the neighbours ship, since no usage ranking was found (section 1.3).

Group | Functions | Evidence
Arithmetic and comparison | `+ - * /`, brackets, `= <> < > <= >=` | Bases formulas, Advanced Tables' "Algebraic operations"
Column summaries | `sum`, `average`, `count`, `min`, `max`, `median` | Bases' built-in summaries; Advanced Tables' sum and mean
Logic | `if`, `and`, `or`, `not` | Bases' `if(price, ...)` example
Numbers | `round`, `abs` | Advanced Tables issue `#363` asks for rounding
Text | `concat`, and `&` | Advanced Tables issue `#367` asks to join text to a formula
Dates | `days(end, start)`, the gap between two ISO dates | Google's `DAYS`; Bases' Earliest, Latest and Range

**Never in the set: `today`, `now`, `rand`.** A projection must be deterministic. A formula whose
answer changes with the clock would change the file with nobody touching it.

### 4.3 How formulas stay readable in the file

- **Formulas name columns.** `Qty * Price`, not `B2*C2`. A header with a space is bracketed:
  `[Unit price] * Qty`. The Sheet Markup thread shows cell ranges going stale when a row is added.
- **A row formula reads only its own row.** A summary reads a whole column. There is no third
  kind in v1, so no formula can point at "row 7".
- **One formula per line, in the fence, under the table it computes.** An agent reading the file
  sees the numbers in the table and the rule that made them, eight lines apart.
- **Numbers follow `fm-chart@1`'s rule**: a trimmed cell matching `^-?\d+(\.\d+)?$`. A thousands
  separator or a unit makes it text, and the formula shows an error for that row.
- **Results are written in decimal.** `INFERENCE:` binary floating point writes
  `0.30000000000000004` for `0.1 + 0.2`, which would land in a user's file. Use decimal
  arithmetic and write the fewest digits that are exact.

## 5. Sharing a simplified sheet

### 5.1 How the incumbents share a view

Product | Read link | Edit link | Publish or embed | Public form | What their own help warns
Google Sheets | "Anyone with the link" as Viewer | Commenter or Editor, by link or by address | "Publish to web" for the whole file or single sheets, auto-republished; embed code | not on the pages read | "Be careful when publishing private or sensitive info"; a published chart lets people "see the data used to create it"
Notion | "Anyone on the web with link" | `UNVERIFIED:` not on the pages read | Notion Sites, with embed, search-engine indexing and "Duplicate as template" | Forms that write rows into a database | Published metadata "will include the names, profile photos, and email addresses" of contributors
Airtable | A shared view link | `UNVERIFIED:` not on the pages read | Embed a view or a base | Form view | URL filters "can be removed by anyone you send the link to", so they must not hide private data
NocoDB | A public, read-only shared view | `UNVERIFIED:` not on the pages read | Custom URL | Shared form view | Password and CSV or XLSX download are toggles
Grist | Public access as Viewer | Public access as Editor | `UNVERIFIED:` embed | Form widget | none quoted

Sources: the Google, Notion, Airtable, NocoDB and Grist pages listed in section 1, opened
18 September 2026. Google also caps a file at "up to 100 open tabs or devices" for editing.

### 5.2 Three lessons for fmd

- **A filter is not a wall.** Airtable says so outright. Whatever is in the file is on the page.
- **Publishing leaks what sits around the data.** Notion's metadata carries contributor emails. A
  published fmd sheet must carry none.
- **A reader's view state is theirs and is thrown away.** Google's temporary filter view for a
  viewer "won't be saved". That is the right model for a reader who is not the owner.

### 5.3 What a sheet on a published fmd page should do

The rules already decided frame this: D12 says reading a link needs nothing and editing needs the
one-tap sign-in; every edit enters the owner's change queue.

Behaviour | v1 | Reason
Render | A plain HTML table of the file as it is, with `foot.` summaries drawn under it | the projection law; the page works with no script
Sort and filter by a reader | yes, in the page only, never saved, never sent | Google's temporary filter view
Hide a column from readers | **never** | Airtable's warning; the source and page twin carry every byte anyway
Copy or download as CSV | yes, with cells starting `=`, `+`, `-`, `@`, tab or carriage return neutralised | OWASP's list. OWASP also warns that escaping "may fail" once a file is saved and re-opened
Formulas visible to readers | yes, as the `fm-sheet@1` block under the table | the file is the truth; hiding the rule hides how a number was made
Edit through a link | sign in, then every change is a proposal in the owner's queue | D12 and the change queue
Contributor names or emails in the page | none | Notion's metadata leak
Embed in another site | not in v1 | no demand signal in this sample
Public form that adds rows | not in v1 | `INFERENCE:` a form lets strangers write into a file, an abuse surface with no demand behind it here

## 6. fmd Sheets v1, and the never-build list

### 6.1 The v1 feature set

Every row is a proposal for the founder, not a decision.

No. | Feature | What it does | Evidence
SH1 | Grid over any GFM table | Click a cell, type, press Enter. Only that cell's bytes change | dataview `#749`; the Sheet Markup bidirectional complaint; shipped `F131`, which needs section 7 fixed first
SH2 | Keyboard and structure | Tab, Enter and arrows move; add, delete and move rows and columns | Typora's table menu; Advanced Tables `#386` and `#372`
SH3 | Checkbox cells | A cell holding `[ ]` or `[x]` draws as a toggle, and the text stays readable elsewhere | forum `/t/554`, 178 OP likes. `INFERENCE:` the carrier is my proposal
SH4 | Sort and filter for viewing | Changes the view, not the file | forum `/t/51552`; Google filter views
SH5 | Sort the file | An explicit action that reorders rows, shown as one change in the queue | `INFERENCE:` kept apart from SH4 so viewing never writes
SH6 | Column summaries | `foot.` formulas drawn under the grid: sum, average, count, min, max, median | Bases' built-in summaries
SH7 | Row formulas | `col.` formulas over named columns, written into the cells | Advanced Tables `#14`, `#13`; dataview `#42`
SH8 | Freeze the header, set column width | View settings, never written to the file | forum `/t/103507` and `/t/38902`
SH9 | Show the plain text | One toggle between the grid and the table's source | forum `/t/73866`, 114 topic likes
SH10 | Open `.csv` and `.tsv` | The same grid, spliced per cell, with the refusals in 3.4 | forum `/t/103622`, `/t/23573`; GitHub renders CSV
SH11 | Import CSV into a document | Paste or pick a CSV; it becomes a pipe table | Advanced Tables `#78`
SH12 | Paste a range | Paste cells from Google Sheets or Excel into many cells | DB Folder `#794`. `UNVERIFIED:` that their clipboard carries tab-separated text
SH13 | Copy and download as CSV | With formula-leading characters neutralised | OWASP
SH14 | Published sheet | Read-only table, reader sort and filter, formulas visible | section 5.3
SH15 | Chart from the sheet | The planned `fm-chart@1` (`F180`) over the same table | `docs/pack/66-FORMAT-SPECIFICATIONS.md` section 4.4
SH16 | D13's table layout | The same grid shows notes as rows and front matter as columns | D13, decided 18 September

### 6.2 Never build

Feature | Reason
Formulas typed into cells as `=SUM(...)` | Every other tool would show the formula instead of the number, and a CSV export turns it into an injection vector
A1 cell references and cross-sheet references | They go stale when a row is added to a text file; the Sheet Markup thread shows it
`today`, `now`, `rand` | A projection must be deterministic
Merge cells | GFM has no merged cell; it would need a carrier outside the format
Cell colour and conditional formatting | Colour has no plain-text form
Pivot tables | No request in the sample; a power feature
Several sheets or tabs in one file | A document already holds several tables
Macros, scripts or custom functions | Code in a user's file, run by our client
Live co-editing of one grid with cursors | Sync is git merge plus a splice journal, never a CRDT (settled)
Hidden columns on a published page | A filter is not a wall
Relations and rollups inside a sheet | They belong to D13's view over notes
Re-padding a table to align it | It turns a one-cell edit into a whole-table diff
Formulas in HTML comments or a sidecar | Refused carriers, section 3.2
Editing `.xlsx` in place | `INFERENCE:` a binary format cannot be spliced; import it once into a table instead
A 400-function Excel-compatible engine | Nobody in the sample asked for more than arithmetic and summaries

## 7. Two defects found in the shipped table editor

`[O]` Both were reproduced in this session by running `setTableCell` from
`src/modules/preview/presentation/table-edit.ts` under `node --experimental-strip-types`. Nothing
was changed in the repository.

**Defect 1: one cell edit rewrites the whole table.** `setTableCell` re-serialises every row with
`` `| ${cells.join(" | ")} |` ``. Changing `Salt` from 18 to 20 in a padded table gave:

```text
before                after
| Item   |  Qty |     | Item | Qty |
|:-------|-----:|     |:-------|-----:|
| Flour  |  110 |     | Flour | 110 |
| Salt   |   18 |     | Salt | 20 |
```

Every row lost its padding, so a one-cell edit is a whole-table diff. This breaks splice-only
writing, and SH1 depends on it being fixed.

**Defect 2: an escaped pipe splits a cell, and the edit lands in the wrong one.** `parsePipeRow`
splits on every `|`, ignoring the `\|` escape the GFM specification defines.

The row `| a \| b | 1 |`, with column 2 set to `2`, came back as `| a \ | 2 | 1 |`. The text `b`
was lost and the value `1` was left unchanged. The cell the person meant to edit was never touched.

**A third, smaller one.** `escapeCellValue` replaces a typed line break with a space. That is a
guess; section 3.4 proposes a refusal instead.

`INFERENCE:` none of the three has a failing test today, because they were not caught. Per the
repository's first rule, each fix starts with a test that fails against the current code.

## 8. Limits of this research

- **Reddit was not searched.** The Notion subreddit was in the brief. No request was sent there
  in this session, so Notion's user demand rests on its help pages alone.
- **The Obsidian forum sample is search-ranked**, five queries in the feature-requests category.
  A request phrased in other words was missed.
- **GitHub reactions undercount.** Most people who want a feature never press a button. Counts
  compare asks against each other; they do not size a market.
- **Coda was barely reached.** Its help returned 403 and 404, so it appears in one row only.
- **Excel for the web and Zoho Sheet** were read at feature-page depth, not in use.
- **No product was used hands-on.** Every claim about an incumbent is what its own help says.
- **"Most used functions" has no source.** The function set rests on what neighbours ship.
- **The `fm-sheet@1` grammar, the SH numbering and the refusal codes marked "new" are proposals.**
  None is in `docs/pack/` yet, and nothing in the pack was edited.
- **Size limits for the grid were not measured.** How many rows a pipe table can hold before a
  keystroke exceeds the 250 ms budget in `shape-gate.ts` needs a benchmark, not a guess.
- **Licence readings are not legal advice.** The HyperFormula and NocoDB conclusions are my
  reading of their licence files.
