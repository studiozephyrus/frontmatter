---
id: 68-SHEETS-SPEC
title: Sheets specification
mode: reference
tier: canonical
status: draft
verified_against: ee73929
updated: 2026-09-19
owner: sagnik
covers: [sheets, fm-sheet, sheet-formulas, sheet-evaluator, sheet-csv, published-sheet]
---

# 68. Sheets specification

**What this file is.** The single home for how a sheet works in fmd: its bytes, its cell edits, its
formulas and their evaluator.

It also covers sharing, the published sheet, and what is refused rather than guessed.

**Who asked.** The founder, on 18 September 2026 `[Z]`: a basic, bare-bone sheet beside documents,
in the spirit of Notion and Obsidian, not all of Google Sheets (`56-OPEN-DECISIONS.md` section 0).

**State.** Every rule here is `specified, not built` unless a row says `built`. The format rules are a
proposal from research, written so a builder can start. Nothing in this file is `[Z]` except the ask.

## 0. Sources, and where they disagree

Source | What it gives this file
`docs/research/2026-09-18-sheets-boards/SHEETS.md` | The recommendation, the evidence, the function set, the refusals, the three defects
`docs/research/2026-09-18-sheets-boards/ONE-PLATFORM.md` | Where a sheet sits in the type registry, and embedding
`docs/research/2026-09-18-sheets-boards/SCREEN-REFERENCES.md` | What a person expects to see on the sheet screen, named S39 there
`66-FORMAT-SPECIFICATIONS.md` sections 4.3, 4.4 and 4.8 | The `fm-` fence grammar, the chart's number rule, the table refusal
`src/modules/preview/presentation/table-edit.ts` | The shipped table editor, read at `cb7c16f`

**The two research files disagree in three places.** `ONE-PLATFORM.md` section 6 says the companion
files win where they disagree, so `SHEETS.md` wins each one. Each is carried here so nobody picks
silently.

# | What disagrees | `ONE-PLATFORM.md` | `SHEETS.md` | This file
1 | The canonical sheet | a `.csv` file (section 3.2) | a GFM pipe table in a `.md` document (section 3.3) | The pipe table. A `.csv` opens in the same grid
2 | Where a computed value lives | only in a view, never in the data (section 3.3) | written into the cells (section 3.3) | Written into the cells, but only through a change the owner accepts. Section 4.6
3 | Formula-leading characters on export | export warns and offers escaping (section 5.1) | the download is neutralised (section 5.3) | The download copy is neutralised; the file's bytes are never altered. Section 6.3

## 1. The shape in five lines

1. **A sheet is a GFM pipe table inside a markdown document.** Every other tool shows it as a table.
2. **Its formulas live in an `fm-sheet@1` fence directly below the table.** The table does not know
   about the fence, as a table does not know about `fm-chart@1`.
3. **A `.csv` or `.tsv` file opens in the same grid**, edited one field at a time. It carries no
   formulas.
4. **Formulas name columns, never cell addresses.** `Qty * Price`, and `sum(Total)` under the grid.
5. **A published sheet is a read-only table** a reader may sort and filter for themselves. Nothing a
   reader does is saved.

**Rows that are whole notes are not a sheet.** They are D13's database view over front matter, batch
9a. The sheet grid is reused as that view's table layout; see `70-PLATFORM-AND-TYPES.md`.

## 2. The canonical bytes

### 2.1 A table in a document

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

This is `SHEETS.md` section 3.3's example. A plain markdown reader shows a four-column table and a
five-line code block. Nothing is lost.

**The table is plain GFM** (`66-FORMAT-SPECIFICATIONS.md` section 4.8, `C045`, `F131`). The facts that
constrain it, from the GFM specification section 4.10 as `SHEETS.md` section 3.2 quotes it:

- A cell is single-line. Block-level elements cannot sit in a table.
- A pipe inside a cell is escaped as `\|`.
- A renderer pads short rows and ignores extra cells, so only an editor can refuse a ragged row.

### 2.2 A `.csv` or `.tsv` file

**The extension decides the delimiter**: comma for `.csv`, tab for `.tsv`. The content never decides
it. `INFERENCE:` choosing a delimiter from content is a guess, which `ONE-PLATFORM.md` section 5.1 also
refuses.

- **The first record is the header.** Its fields are the column names.
- **The file's own line ending, byte-order mark and quoting style are kept.** A field edit changes
  that field's bytes and nothing else.
- **A `.csv` carries no formulas.** A formula over CSV data waits on a version 2 of `fm-sheet`
  that reads a table by path (`70-PLATFORM-AND-TYPES.md` section 4.3).
- **The bytes must be UTF-8.** A file that fails strict decoding is refused, per `ONE-PLATFORM.md`
  section 5.1: the byte is named and conversion is offered as a proposal. It is never decoded lossily.

### 2.3 What is refused as a carrier

Carrier | Why refused | Source
Formulas typed into cells as `=SUM(...)` | Every other tool shows the formula instead of the number, and a CSV export turns it into an injection vector | `SHEETS.md` section 6.2
An HTML comment after the table, as Advanced Tables does | The pack refuses HTML comments as a carrier | `66-FORMAT-SPECIFICATIONS.md` section 4.1
A fence holding the data | It hides the table from every other tool | `SHEETS.md` section 3.3, candidate D
A sidecar file | Hidden state; it breaks the projection law | `SHEETS.md` section 3.3, candidate E
Several sheets or tabs in one file | A document already holds several tables, and a folder already holds several CSV files | `SHEETS.md` section 6.2

## 3. The `fm-sheet@1` fence

### 3.1 Grammar

**It is an `fm-` block** and follows `66-FORMAT-SPECIFICATIONS.md` section 4.3 in full: a flat YAML
mapping of scalars, a required version, unknown keys ignored and kept byte for byte, `~~~` when the
body may hold a backtick.

Key | Required | Value | Meaning
`table` | yes | `above` | The nearest GFM table above the block, with only blank lines between
`col.<header>` | no | a quoted formula string | A row formula. fmd computes it for every body row and writes the value into that column's cell
`foot.<header>` | no | a quoted formula string | A summary. Drawn under the grid and **never written to the file**

- **`<header>` is the column's header cell text, trimmed, matched exactly.** `col.Total` names the
  column whose header is `Total`.
- **A header with a space is written as it stands**, `col.Unit price`, which YAML reads as a plain
  key. `INFERENCE:` this is a proposal, and section 3.3 lists the headers that cannot be keys.
- **One formula per key, one key per line.** An agent reading the file sees the numbers in the table
  and the rule that made them a few lines apart.

`INFERENCE:` a `foot.` summary is never written because a totals row in the file would disagree with
the table after any edit made in another tool (`SHEETS.md` section 3.3).

### 3.2 The `table` value in version 1

`table: above` is the only value in version 1. `70-PLATFORM-AND-TYPES.md` section 4 proposes
`<path>#<anchor>` for a chart that reads a table elsewhere.

A version-1 reader that meets any other value renders the block's source with `E501`. That is the
correct outcome, not a defect.

### 3.3 When the block cannot compute

**A block that cannot render shows its source and the reason, never an empty space**
(`66-FORMAT-SPECIFICATIONS.md` section 4.1). The file is never changed by a render.

Condition | Outcome | Id
No GFM table directly above | The block renders its source, with the reason | `E501`
`col.X` or `foot.X` names a header the table lacks | The block renders its source | `E501`
Two header cells in the table share a name | The block renders its source. A formula cannot know which one is meant | `E501`
A header that YAML cannot hold as a plain key: it contains `: ` or ` #`, or begins with a YAML indicator character | That column cannot carry a formula. The block renders its source | `E501`
The info string is `fm-sheet` with no `@1`, or names a major version the client does not know | The block renders its source | `E501`, per `66` section 4.3
A key other than `table`, `col.` or `foot.` | Ignored and kept | none

## 4. Formulas

### 4.1 The two kinds, and no third

Kind | Reads | Writes | Example
Row formula, `col.` | Only the cells of its own row | The value into that row's cell in the named column, through the change queue | `Qty * Price`
Summary, `foot.` | One whole column | Nothing. Drawn under the grid | `sum(Total)`

**No formula can point at "row 7".** There is no cell address, no range and no reference to another
sheet.

`SHEETS.md` section 2.3 records why. In the Sheet Markup thread, adding a row left a total pointing
at `B2-B6`, a cell range that went stale on a text file.

### 4.2 Expression grammar

`INFERENCE:` the grammar below is this file's proposal, sized to the function set in section 4.3.

```text
expr     = or
or       = and *( "or" and )             ; also the function or(a, b)
and      = compare *( "and" compare )
compare  = concat [ ( "=" / "<>" / "<" / ">" / "<=" / ">=" ) concat ]
concat   = sum *( "&" sum )
sum      = product *( ( "+" / "-" ) product )
product  = unary *( ( "*" / "/" ) unary )
unary    = [ "-" ] atom
atom     = number / string / column / call / "(" expr ")"
number   = digits [ "." digits ]
string   = DQUOTE *char DQUOTE
column   = bare-name / "[" any-header-text "]"
bare-name = letter *( letter / digit / "_" )
call     = function-name "(" [ expr *( "," expr ) ] ")"
```

- **A header with a space or punctuation is bracketed**: `[Unit price] * Qty`.
- **Function names are matched without regard to case.** Column names are matched exactly, as the
  board's `status` values are (`69-BOARDS-SPEC.md` section 2.3).
- **A name that is both a function and a header** is read as the function when followed by `(`, and
  as the column otherwise. `INFERENCE:` a proposal; a fixture must pin it.

### 4.3 The function set

Drawn from what the neighbours ship, because no usage ranking was found (`SHEETS.md` sections 1.3
and 4.2). Fourteen functions, plus the operators above.

Group | Functions | Allowed in | Evidence in `SHEETS.md` section 4.2
Column summaries | `sum`, `average`, `count`, `min`, `max`, `median` | `foot.` only | Bases' built-in summaries; Advanced Tables' `sum` and `mean`
Logic | `if`, `and`, `or`, `not` | both | Bases' `if(price, ...)` example
Numbers | `round`, `abs` | both | Advanced Tables issue 363 asks for rounding
Text | `concat` | both | Advanced Tables issue 367 asks to join text to a formula
Dates | `days(end, start)`, the whole days between two ISO dates | both | Google's `DAYS`; Bases' Earliest, Latest and Range

- **`count` counts non-empty cells.** The other five summaries skip empty cells and error on any
  non-empty cell that is not a number.
- **A summary function inside a `col.` formula is refused**: that column is not computed, and the
  reason shows under the grid. It is the third kind section 4.1 excludes.
- **Never in the set: `today`, `now`, `rand`.** A projection must be deterministic. A formula whose
  answer changes with the clock would change the file with nobody touching it.
- **An unknown function name** stops that column computing, with the reason. It is never guessed as
  a near spelling.

### 4.4 Values and types

Type | Read from a cell when | Notes
Number | The trimmed cell matches `^-?\d+(\.\d+)?$` | `fm-chart@1`'s rule, `66-FORMAT-SPECIFICATIONS.md` section 4.4
Empty | The trimmed cell is empty | Skipped by summaries; an error in arithmetic
Checkbox | The trimmed cell is exactly `[ ]` or `[x]` | `false` or `true`. SH3 in `SHEETS.md` section 6.1; `INFERENCE:` the carrier is that file's proposal
Date | Passed to `days()` and matching `YYYY-MM-DD` | Only `days()` reads a date. Nothing else parses one
Text | Anything else | `1,200`, `12%` and `n/a` are text

**A cell with a thousands separator or a unit is text.** A formula that does arithmetic on it shows
an error for that row. The cell's bytes are unchanged.

### 4.5 Arithmetic

- **Decimal, never binary floating point.** `INFERENCE:` binary floating point gives
  `0.30000000000000004` for `0.1 + 0.2`, and that would land in a person's file (`SHEETS.md` section
  4.3).
- **A result is written with the fewest digits that are exact**: `80`, not `80.00`.
- **A quotient with no exact finite decimal form**, such as `1 / 3`, is an error for that row unless
  the formula rounds it with `round(x, n)`.
- `INFERENCE:` choosing a number of places for the person is a guess. This rule is `needs founder`.
- **Division by zero** is an error for that row. Nothing is written.
- `round` follows formula.js's `ROUND`, which the tests compare against. `UNVERIFIED:` its rounding
  mode for a tie was not opened in this session.

### 4.6 How a computed value reaches the file

**Opening a document never writes.** Every write below enters the change queue as one item, as every
change does (ADR-0008).

Trigger | What is proposed | Span
A person edits an input cell in a row | The input cell and every `col.` cell in that row that changes | One span, from the first changed byte to the last on that row's line
A person or agent edits a `col.` formula in the fence | The fence line, and the column's cells in every row whose value changes | One span from the first changed byte to the last. Bytes between are written back unchanged, as the mirror's prefix and suffix rule does in `67-SYNC-AND-CONFLICT.md` section 8.1
A computed cell in the file disagrees with its formula, because it was edited in another tool | Nothing, until asked. Both values are shown, and a recompute is offered as a queue item | That cell

**A row whose formula errors writes nothing.** Its cell keeps its bytes, and the error shows in the
grid. `INFERENCE:` writing an error string into a person's file would put our state in their data.

### 4.7 The evaluator, and why it is ours

**Our own small evaluator, in the domain layer.** A tokeniser, a small precedence parser for section
4.2, and the fourteen functions. `specified, not built`.

- **Proposed home:** `src/modules/sheet/domain/`, exported through `src/modules/sheet/index.ts`, per
  the barrel rule of `AGENTS.md` section 2. No `sheet` module exists at `cb7c16f` (`ls src/modules`).
- **It never calls `eval` or `new Function`.** A formula is data from a person's file; running it as
  code would run a stranger's text in our client.
- **It imports nothing outside the domain layer**, so the same code runs in the browser, on the
  server for a published page, and in the desktop build.
- **Decimal arithmetic is its own**, on scaled integers. `[O]` `package.json` at `cb7c16f` carries no
  decimal library. `INFERENCE:` a small fixed feature set does not justify one.
- **Tested against formula.js outputs** for every function the two share. formula.js is MIT, per
  `SHEETS.md` section 4.1, so its test values may be used as fixtures.
- **Size:** `INFERENCE:` a few hundred lines, per `SHEETS.md` section 4.1. Not measured.

**Why not HyperFormula.** Its licence, as `SHEETS.md` section 4.1 read it from the repository on 18
September 2026, is dual: a proprietary licence, or the GNU General Public License (GPL) version 3, chosen by
a `licenseKey` such as `'gpl-v3'`.

- `INFERENCE:` the GPL path would reach our shipped client code, and the other path is a paid
  licence. Both are more than a bare sheet needs.
- It ships around 400 functions and A1 addressing. This file refuses A1 addressing and needs fourteen
  functions.
- **Licence readings are not legal advice** (`SHEETS.md` section 8).

Engine | Licence, per `SHEETS.md` section 4.1 | Verdict
HyperFormula | proprietary or GPLv3 | No
formula.js | MIT | A reference for function behaviour and test values
fast-formula-parser | MIT | No. Built around A1 cells
IronCalc | MIT or Apache 2.0 | Not yet; its README says early testing
Univer, Fortune-sheet, x-spreadsheet | Apache 2.0 or MIT | No. A whole spreadsheet, or unmaintained
NocoDB | Sustainable Use License | No. The licence bars our use

## 5. Editing

### 5.1 The one rule

**A cell edit changes only that cell's bytes.** It never re-pads, re-quotes or re-orders anything else.
The diff for one edit is one line.

**The shipped editor breaks this rule today.** `setTableCell` in
`src/modules/preview/presentation/table-edit.ts` re-serialises the whole table. The three defects are
`TD-024`, `TD-025` and `TD-026` in `44-TECH-DEBT-REGISTER.md`, each with its reproduction. **SH1 cannot
ship until all three are fixed.**

### 5.2 Locating a cell

Target | Located by | Refused when
A cell in a pipe table | The table's heading path and ordinal, the row's ordinal and digest, then the cell's index in an escape-aware split | The row's cell count differs from the header's
A field in a `.csv` | The record's ordinal and a digest of its bytes, then the field index. A declared key column replaces the ordinal when a view names one | The record's field count differs from the header's

`INFERENCE:` both follow the body-address triple of `25-ENGINE-SPEC.md` section 25.9: a structural
path, an ordinal for duplicates, and a digest that turns a stale address into a refusal. The CSV row
is `ONE-PLATFORM.md` section 3.2's proposal.

### 5.3 Writing a value

Carrier | Rule
Pipe table | A `|` in the value is written `\|`. The new text replaces the cell's text between its surrounding spaces; the padding is left as it was, even if the column no longer lines up
`.csv` | The field is quoted only when the value holds a comma, a double quote or a line break, and an inner quote is doubled (RFC 4180). A field already quoted stays quoted. Nothing else in the record moves
`.tsv` | A value holding a tab or a line break is refused. `INFERENCE:` TSV has no quoting to carry it

### 5.4 Structure edits

Action | Write | Note
Add a row | One new line | Below the focused row
Delete a row | That line | One queue item
Move a row | Two spans in one file, or one span over the moved range | `INFERENCE:` the queue item holds one span today, so a move is written as one span from the first changed byte to the last
Add a column | One cell appended to every row, and one to the delimiter row | Every row changes, which is the honest size of the edit
Delete or move a column | Every row | Same
Sort the file, SH5 | Every row between the first and the last that moved | An explicit action, kept apart from sorting the view, which never writes

## 6. Viewing, sharing and publishing

### 6.1 In the editor

- **Sort and filter change the view, never the file.** A filter is held per viewer and never
  written. A saved filter is a later feature.
- **Freeze the header and set column width** are view settings, never written.
- **Show the plain text** switches between the grid and the table's source in one control, SH9.
- **A column header shows its formula**, drawn from the fence. `SCREEN-REFERENCES.md` section 2 draws
  it as a bar above the grid for the focused cell's column.

### 6.2 Sharing

The rules already decided frame this: D12 `[Z]`, reading a link needs nothing and editing needs the
one-tap sign-in; and every edit enters the owner's change queue (ADR-0008).

Who | May | Where their changes go
A reader through a link | Read, sort and filter for themselves | Nowhere. Nothing is saved or sent
An editor through a link, signed in | Edit cells, rows and formulas | Each change is an item in the owner's queue
An agent through the agent server | Read the table, read the fence, propose | Each proposal is an item; the agent never writes

### 6.3 The published sheet

Behaviour | v1 | Reason, from `SHEETS.md` section 5
Render | A plain HTML table of the file as it is, with `foot.` summaries drawn under it | The projection law; the page works with no script
Reader sort and filter | Yes, in the page only, never saved, never sent | Google's temporary filter view for a viewer, which "won't be saved"
Hide a column from readers | **Never** | A filter is not a wall; Airtable's own help says URL filters can be removed by anyone who has the link
Formulas visible | Yes, as the `fm-sheet@1` block under the table | Hiding the rule hides how a number was made
Copy or download as CSV | Yes, with any cell beginning `=`, `+`, `-`, `@`, a tab or a carriage return neutralised **in the download only** | OWASP's list; the file's bytes are never altered
Contributor names or emails in the page | None | Notion's published metadata carries contributor emails
Embed in another site | Not in v1 | No demand signal in the sample
A public form that adds rows | Not in v1 | `INFERENCE:` strangers writing into a file is an abuse surface with no demand behind it

**How a download cell is neutralised.** `INFERENCE:` a leading apostrophe, which spreadsheets read
as a sign to treat the cell as text. `UNVERIFIED:` the exact escape each spreadsheet honours.

OWASP warns that escaping may fail once a file is saved and re-opened, so the download also carries a
notice.

**The twin.** A table in a published document is served in the page's twin, `/<slug>.md`, as bytes
(`66-FORMAT-SPECIFICATIONS.md` section 5.2).

A published `.csv` keeps its own extension as its twin, per `ONE-PLATFORM.md` section 3.11.
`INFERENCE:` that route is not specified in 66 yet.

## 7. What is refused rather than guessed

From `SHEETS.md` section 3.4, with this file's additions marked.

Situation | Outcome | Id
A row's cell count differs from the header's, on an edit | That edit is refused. Nothing is written | `E500`, `K.s08.table.shape`
A typed value contains a line break, in a pipe table | Refused. GFM cells are single-line, and stripping the break is a guess | `new:sheet-cell-linebreak`
An `fm-sheet@1` block with no table directly above | The block renders its source | `E501`
`col.X` names a missing header, or two headers share a name | The block renders its source | `E501`
A formula refers to itself, directly or through another column | That column is not computed; the file is unchanged | `new:sheet-formula-cycle`
A formula meets a cell that is not a number | That row shows an error; the cell's bytes are unchanged | `new:sheet-formula-not-number`
A summary function inside a `col.` formula (this file) | That column is not computed | `new:sheet-formula-summary-in-row`
An unknown function name (this file) | That column is not computed | `new:sheet-formula-unknown-function`
A non-terminating quotient with no `round` (this file) | That row shows an error | `new:sheet-formula-inexact`
A computed cell disagrees with its formula | Both values shown; a recompute is offered as a queue item. Opening never writes | none; not a refusal
A `.csv` with mixed line endings, or a delimiter other than comma for `.csv` or tab for `.tsv` | Opens read-only, with the reason | `new:sheet-csv-readonly`
A `.csv` record holding a quoted line break | Opens read-only in v1. `INFERENCE:` a v1 simplification | `new:sheet-csv-readonly`
A `.csv` record whose field count differs from the header's, on an edit | That edit is refused | `new:sheet-csv-ragged`
A `.csv` that is not UTF-8 | Refused, the byte named, conversion offered as a proposal | `new:sheet-csv-encoding`
An edit that would need the table re-padded to stay aligned | The cell is spliced alone; alignment is left as it was | none; a rule, not a refusal

## 8. Limits

Limit | Value | Source
Document size | 4 MiB | `MAX_BYTES = 4 * 1024 * 1024`, `src/modules/mdmax/domain/shape-gate.ts:23`
Document lines | 200,000 | `MAX_LINES = 200_000`, `src/modules/mdmax/domain/shape-gate.ts:24`
Keystroke budget | 250 ms | `keystroke: 250`, `src/modules/mdmax/domain/shape-gate.ts:30`
Rows a grid holds inside the keystroke budget | **unmeasured** | Needs a benchmark before a number is written, `new:sheet-row-budget`
GitHub's own rendering of a mirrored CSV | 512 KB, per GitHub's page as `SHEETS.md` section 3.2 read it | An external limit; fmd does not enforce it

**No row limit is set in this file**, because none has been measured. `SHEETS.md` section 8 says the
same.

## 9. The v1 feature set

Every row is a proposal for the founder, from `SHEETS.md` section 6.1. The `SH` numbers are that
file's, kept so the two can be read side by side. None is a feature id.

SH | Feature | Proposed id | Depends on
SH1 | Grid over any GFM table; only the edited cell's bytes change | `new:sheet-grid`, extends `F131` | `TD-024`, `TD-025`, `TD-026`
SH2 | Keyboard and structure: Tab, Enter and arrows; add, delete and move rows and columns | `new:sheet-structure` | SH1
SH3 | Checkbox cells, `[ ]` and `[x]`, drawn as a toggle | `new:sheet-checkbox` | SH1
SH4 | Sort and filter for viewing; never writes | `new:sheet-view-sort-filter` | SH1
SH5 | Sort the file, as one queue item | `new:sheet-sort-file` | SH1
SH6 | Column summaries, `foot.` | `new:sheet-summaries` | the evaluator
SH7 | Row formulas, `col.` | `new:sheet-row-formulas` | the evaluator
SH8 | Freeze the header, set column width; view only | `new:sheet-view-settings` | SH1
SH9 | Show the plain text | `new:sheet-plain-toggle` | SH1
SH10 | Open `.csv` and `.tsv` in the same grid | `new:sheet-csv` | the registry, `70` section 2
SH11 | Import CSV into a document as a pipe table | `new:sheet-csv-import` | SH1
SH12 | Paste a range from another spreadsheet | `new:sheet-paste-range` | SH1. `UNVERIFIED:` that their clipboard carries tab-separated text
SH13 | Copy and download as CSV, neutralised | `new:sheet-csv-download` | SH1
SH14 | Published sheet | `new:sheet-published` | section 6.3
SH15 | Chart from the sheet | `F180` | `fm-chart@1`
SH16 | D13's table layout over notes | `new:database-view-table`, batch 9a | `70` section 3

## 10. Never build

Feature | Reason
Formulas typed into cells as `=SUM(...)` | Other tools show the formula, and CSV export makes it an injection vector
A1 cell references and cross-sheet references | They go stale when a row is added to a text file
`today`, `now`, `rand` | A projection must be deterministic
Merge cells | GFM has no merged cell
Cell colour and conditional formatting | Colour has no plain-text form
Pivot tables | No request in the sample; a power feature
Several sheets or tabs in one file | A document already holds several tables
Macros, scripts or custom functions | Code in a person's file, run by our client
Live co-editing of one grid with cursors, as a store | Sync is git merge plus a splice journal, never a conflict-free replicated data type, a CRDT (ADR-0003)
Hidden columns on a published page | A filter is not a wall
Relations and rollups inside a sheet | They belong to D13's view over notes
Re-padding a table to align it | It turns a one-cell edit into a whole-table diff
Formulas in HTML comments or a sidecar | Refused carriers, section 2.3
Editing `.xlsx` in place | `INFERENCE:` a binary format cannot be spliced; it is imported once, as a proposal
A 400-function Excel-compatible engine | Nobody in the sample asked for more than arithmetic and summaries

## 11. Register rows needed

None of these is written here. Each file has one owner, and this file does not own the registers.

Register | Row | For
`10-FEATURE-REGISTER.md` | `new:sheet-grid` and the fourteen other `new:sheet-*` slugs in section 9 | SH1 to SH14
`10-FEATURE-REGISTER.md` | `new:database-view-table` | SH16, batch 9a
`10-FEATURE-REGISTER.md` | `F131` note: blocked on `TD-024` to `TD-026` | SH1
`17-ERROR-AND-REFUSAL-CATALOGUE.md` | `new:sheet-cell-linebreak`, `new:sheet-formula-cycle`, `new:sheet-formula-not-number`, `new:sheet-formula-summary-in-row`, `new:sheet-formula-unknown-function`, `new:sheet-formula-inexact` | Section 7
`17-ERROR-AND-REFUSAL-CATALOGUE.md` | `new:sheet-csv-readonly`, `new:sheet-csv-ragged`, `new:sheet-csv-encoding` | Section 7
`17-ERROR-AND-REFUSAL-CATALOGUE.md` | `E501`'s trigger widened to name `fm-sheet@1` | Section 3.3
`16-COPY-DECK.md` | One refusal string per new error above, in the voice of `K.s08.table.shape` | Section 7
`16-COPY-DECK.md` | `new:k-sheet-download-notice`, the notice on a neutralised CSV download | Section 6.3
`19-ACCEPTANCE-CRITERIA.md` | `new:sheet-one-cell-one-line`: a cell edit in a padded table changes one line and only that cell's bytes | Section 5.1, red proof `TD-024`
`19-ACCEPTANCE-CRITERIA.md` | `new:sheet-escaped-pipe`: an edit to a row holding `\|` lands in the intended cell | `TD-025`
`19-ACCEPTANCE-CRITERIA.md` | `new:sheet-no-write-on-open`: opening a sheet whose computed cells disagree writes no byte | Section 4.6
`19-ACCEPTANCE-CRITERIA.md` | `new:sheet-deterministic`: the same bytes give the same computed values on every machine | Section 4.3
`19-ACCEPTANCE-CRITERIA.md` | `new:sheet-download-neutralised`: a downloaded CSV neutralises the six leading characters and the file is unchanged | Section 6.3
`19-ACCEPTANCE-CRITERIA.md` | `new:sheet-row-budget`: a measured row count within the 250 ms keystroke budget | Section 8
`56-OPEN-DECISIONS.md` | Whether a non-terminating quotient errors or rounds | Section 4.5

## 12. Limits of this file

- **Nothing here is built.** The only code read is the shipped table editor, and its three defects
  are reproduced in `44-TECH-DEBT-REGISTER.md`.
- **The research was not re-run.** Every incumbent claim, licence reading and count is `SHEETS.md`'s,
  opened on 18 September 2026. They were not re-opened for this file.
- **The expression grammar, the type table, the decimal rule and the CSV quoting rule are this
  file's proposals**, marked `INFERENCE:` where they appear. None has a prototype or a fixture.
- **No row limit is known.** The grid's size budget needs a benchmark.
- **Not assessed:** the sheet screen's layout, keyboard map and accessibility. They belong to
  `docs/pack/12-screens/S39.md`, which landed at `ee73929` while this file was written.
- **Checked at `cb7c16f`.** Nothing under `src/`, `test/` or the pack files cited here changed between
  `cb7c16f` and `ee73929` (`git diff --stat`), so the front matter names the later commit.
- **What would falsify it.** A sheet operation the founders need that cannot be a splice into one
  text file; or a fixture where a one-cell edit changes a second byte after the three defects are
  fixed.
