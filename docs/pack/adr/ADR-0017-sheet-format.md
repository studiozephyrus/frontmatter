---
id: ADR-0017-sheet-format
title: A sheet is a pipe table with a formula fence below it
mode: explanation
tier: canonical
status: open
verified_against: ee73929
updated: 2026-09-19
owner: sagnik
covers: [ADR-0017]
---

# ADR-0017. A sheet is a pipe table with a formula fence below it

**Decision id:** ADR-0017. **Status: open, proposed.** The ask is `[Z]`, 18 September 2026: a
bare-bone sheet beside documents (`56-OPEN-DECISIONS.md` section 0). The format below is a
recommendation from research, awaiting the founder. **Recorded here:** 19 September 2026.

The full specification is `68-SHEETS-SPEC.md`. This record keeps only the decision and its reasons.

## Context

- The founder asked for Sheets in the spirit of Notion and Obsidian, not all of Google Sheets.
- The product's three load-bearing rules apply to a sheet as to any file: the projection law,
  splice-only writing, and the change queue (ADR-0006, ADR-0008).
- GFM has pipe tables and no formulas. CSV has records and no types or formulas. No plain-text form
  carries formulas (`ONE-PLATFORM.md` section 2.7).
- A table editor already ships, `F131` and `C045`. It re-serialises the whole table on one cell edit,
  which breaks splice-only writing (`44-TECH-DEBT-REGISTER.md`, `TD-024` to `TD-026`).

## Decision, proposed

- **The canonical sheet is a GFM pipe table inside a markdown document.**
- **Its formulas live in an `fm-sheet@1` fence directly below the table**, with `table: above`,
  `col.<header>` for row formulas and `foot.<header>` for summaries.
- **A row formula's result is written into its cells, only through an accepted queue item.** A summary
  is drawn under the grid and never written.
- **Formulas name columns, never cell addresses.** Fourteen functions, and never `today`, `now` or
  `rand`.
- **Our own evaluator, in the domain layer**, with decimal arithmetic and no `eval`.
- **A `.csv` or `.tsv` file opens in the same grid**, edited one field at a time. It carries no
  formulas.
- **A cell edit changes only that cell's bytes.** It never re-pads, re-quotes or re-orders.

## Evidence

All from `docs/research/2026-09-18-sheets-boards/SHEETS.md`, opened 18 September 2026, unless marked.

- **Every markdown-native editor surveyed** either edits a pipe table with no formulas, or bolts
  formulas on through an HTML comment. The one that went furthest, DB Folder, is archived (section 1.6).
- **Cell addressing fails on a text file.** In the Sheet Markup thread on Hacker News, adding a row
  left a total pointing at `B2-B6` (section 2.3).
- **People want the computed result in the file.** The dataview "burning out" request has 126
  reactions (section 2.2).
- **A fence below the table mirrors `fm-chart@1`**, where the chart points at the table and the table
  does not know about the chart (`66-FORMAT-SPECIFICATIONS.md` section 4.4).
- **The pack refuses HTML comments as a carrier** (`66` section 4.1), which rules out Advanced
  Tables' `<!-- TBLFM -->` store.
- `[O]` The three defects in the shipped editor reproduce at `cb7c16f`, with output quoted in `44`.

## Alternatives rejected and why

Alternative | Why rejected
A `.csv` file as the canonical sheet, as `ONE-PLATFORM.md` section 3.2 proposed | No types and no formulas, and a sheet then cannot sit in a document. It stays a second carrier. `ONE-PLATFORM.md` section 6 defers to `SHEETS.md`
A fence holding the data | It hides the table from every other tool
A sidecar file | Hidden state; it breaks the projection law
Formulas in cells as `=SUM(...)` | Other tools show the formula, and a CSV export makes it an injection vector
Computed values only in a view, never written | Loses the "burning out" demand: a number another tool or agent can read
HyperFormula | Proprietary or GPLv3 (the GNU General Public License), per its licence file as `SHEETS.md` section 4.1 read it. `INFERENCE:` the GPL path would reach our shipped client
A1 addressing through fast-formula-parser | Goes stale when a row is added

## Consequences

- **`F131` cannot carry SH1 until `TD-024`, `TD-025` and `TD-026` are fixed**, each with a red proof
  first.
- **A new `fm-` block exists**, so `66-FORMAT-SPECIFICATIONS.md` section 4 gains a short entry pointing
  at `68`.
- **A new domain module is proposed**, `src/modules/sheet/`, with a barrel.
- **`E501` widens to cover `fm-sheet@1`**, and new refusal ids are needed; `68` section 11 lists them.
- **Formulas are visible on a published page**, as the fence under the table.

## What would reverse it

- A founder need that a column-named formula cannot express and that people actually ask for, such as
  a cross-table reference with real demand behind it.
- A measured grid size, inside the 250 ms keystroke budget of `shape-gate.ts`, too small for real
  ledgers kept in a document. That would push large data to `.csv` as the primary carrier.

## Limits of this record

- **Not decided.** The founder has asked for sheets; he has not chosen this format.
- **No prototype exists.** The evaluator, the grammar and the decimal rule are specified, not built.
- **Licence readings are not legal advice.**
