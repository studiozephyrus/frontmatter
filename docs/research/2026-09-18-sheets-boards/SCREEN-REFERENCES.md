---
id: research-screen-references-2026-09-19
title: Screen references for S39 Sheet and S40 Board
mode: research
status: draft
updated: 2026-09-19
owner: sagnik
covers: [sheets, boards, S39, S40]
---

# Screen references for S39 Sheet and S40 Board

**The ask.** The founder asked for the Google Sheets screens and the Jira board screens to be
researched before S39 and S40 were drawn. This file records the layout conventions a person
already expects, so the drawings meet them.

**How it was made.** Every page below was opened with `curl -sL --compressed` on 19 September 2026
(UTC) and read as text. Quotations are short and exact. Everything else is a paraphrase.
`UNVERIFIED:` marks a convention drawn from memory that the pages opened did not state.
`INFERENCE:` marks my reading.

## 1. Sources opened

Id | Page | URL
G1 | Google Sheets, add formulas and functions | https://support.google.com/docs/answer/46977
G2 | Google Sheets, sort and filter your data | https://support.google.com/docs/answer/3540681
G3 | Google Sheets, freeze, group, hide or merge rows and columns | https://support.google.com/docs/answer/9060449
N1 | Notion, table view databases | https://www.notion.com/help/tables
N2 | Notion, database properties | https://www.notion.com/help/database-properties
O1 | Obsidian Bases, introduction (help source) | https://raw.githubusercontent.com/obsidianmd/obsidian-help/master/en/Bases/Introduction%20to%20Bases.md
O2 | Obsidian Bases, views (help source) | https://raw.githubusercontent.com/obsidianmd/obsidian-help/master/en/Bases/Views.md
A1 | Airtable, grid view | https://support.airtable.com/docs/airtable-grid-view
J1 | Jira, what is a board | https://support.atlassian.com/jira-software-cloud/docs/what-is-a-jira-software-board/
J2 | Jira, configure columns | https://support.atlassian.com/jira-software-cloud/docs/configure-columns/
J3 | Jira, configure quick filters | https://support.atlassian.com/jira-software-cloud/docs/configure-quick-filters/
L1 | Linear, board layout | https://linear.app/docs/board-layout
L2 | Linear, display options | https://linear.app/docs/display-options
T1 | Trello, add a due date to a card | https://support.atlassian.com/trello/docs/adding-dates-to-cards/
H1 | GitHub Projects, customising the board layout | https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-board-layout

Two pages did not load. Airtable's "getting started with grid views" returned "Page Not Found", so
A1 was used instead. Trello's "what is a card" returned a bare shell with no text.

## 2. The sheet: what a person expects

Convention | What the sources say | What S39 draws
Formula bar | G1 describes a formula bar a person can resize, and formulas typed after an equal sign | A bar above the grid showing the focused cell's column formula
Formulas by address | G1's own example is `=SUM(A1:A7)` | **Refused.** Our formulas name columns, as `SHEETS.md` section 4.3 says
Filter for one viewer | G2: a person with view access can make a temporary filter view that "won't be saved" | Sort and filter chips that change the view and never the file
A shared filter | G2: a filter made with "Create a filter" is seen by everyone with access | Not drawn. A filter in fmd is never written
Freeze header rows | G3: View, then Freeze, then pick how many rows or columns | Header row always frozen; a view setting, not a file change
Column calculations | N1: click a property, hover Calculate, pick a calculation | The foot row of summaries, `foot.` formulas under the grid
A row is an entry | N1: each row "can be opened as its own page" | Not in a sheet. That is D13's view over notes
Add a column | N2: the plus next to the right-most property adds one, then a type is chosen | A plus at the end of the header row
Type per column | N2: every property has a type chosen when it is made | A small type icon in each header. `UNVERIFIED:` that Notion draws the icon in the header; N2 does not say
Table as one layout of several | O1 and O2: table, list, cards, Kanban and map layouts over the same files | S39's table and S40's board are two layouts of one dataset
Field width and height | A1: drag the header's edge with a two-arrow handle | Column width is a view setting, never written
Expand a record | A1: select a cell in the row and press Space | The phone's cell editor sheet. `INFERENCE:` a bottom sheet is the phone form of expand
Row numbers down the left | `UNVERIFIED:` every grid product draws them; none of the pages above says so in text | Drawn, muted, never written to the file

## 3. The board: what a person expects

Convention | What the sources say | What S40 draws
Columns are statuses | J1: a board shows work "as cards you can move between columns", and the columns represent status | Columns from `status:`, Backlog, To do, Doing, Review, Done
Column field is a choice | H1: set the column field to a Status field, or any single-select field | The board file names the key, `key: status`
Count and limit in the header | H1: the count and the limit show at the top of the column and are highlighted past the limit | `Doing 4 / 3`, highlighted, never blocking
The limit does not block | H1: it does not stop cards or automations exceeding it. J2: constraints have no effect on how many items show | A warning colour only
Limit colour | J2: a red header when the maximum is exceeded | We use `--danger` on the count, not the whole header. `INFERENCE:` a whole red header is louder than our hairline system allows
Field sums per column | H1: sums of a number field show at the top of each column | Not in v1
Quick filters | J3: quick filters narrow the cards on a board, for example only bugs | A chip row: Mine, Due this week, a label, and text search
Slice by a value | H1: a slice panel lists a field's values and filters to one | Not drawn. The chip row covers v1
Swimlanes | L2: sub-grouping in a board shows as rows, "a swim-lane style structure" | A toggle, drawn off. `BOARDS.md` section 5.2 keeps swimlanes out of v1
Board or list, one switch | L1: the same view as a board or a list, toggled with Cmd B | The phone's list of one column is that list
Card face is short | L1: "Descriptions are not shown on cards" | Title, assignee, due date, a linked doc. No body text
Peek at a card | L1: Space over a card peeks for more detail | The side panel in the second frame
Due date state | T1: yellow when due within a day, red on becoming overdue, light pink after a day overdue | An overdue due date in `--danger`. No pink, since we add no colour
Move to top or bottom | L1: Option Shift Up or Down moves a card to the top or bottom of a column | Recorded for S40's keyboard section

## 4. Where we differ on purpose

- **No A1 references anywhere.** G1 teaches them first. `SHEETS.md` section 6.2 refuses them.
- **A filter is never saved.** G2 saves a filter made with Create a filter for everyone. Ours stays per viewer.
- **An agent never moves a card.** H1 says automations can add cards to a column. In fmd an agent's
  move is drawn as a pending change and waits in the queue, per `BOARDS.md` section 3.2.

## 5. Limits of this file

- **Help pages describe features, not layouts.** Row numbers and header type icons are drawn in
  every grid product, but no page opened states it, so both are marked `UNVERIFIED:`.
- **No screenshots were opened.** The conventions come from text alone.
- **Trello's card page did not load**, so Trello's card anatomy rests on T1's due badge only.
- **What would change it:** a usability test in which people cannot find a control where these
  products put it.
