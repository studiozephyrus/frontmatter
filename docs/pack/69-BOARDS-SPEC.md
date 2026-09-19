---
id: 69-BOARDS-SPEC
title: Boards specification
mode: reference
tier: canonical
status: draft
verified_against: ee73929
updated: 2026-09-20
owner: sagnik
covers: [boards, board-file, card-file, board-moves, blueprint-board]
---

# 69. Boards specification

**What this file is.** The single home for how a board works in fmd: the card file, the board file,
how a move is written, and how agents and the idea flow feed a board.

**Who asked.** The founder, on 18 September 2026 `[Z]`: a custom board beside sheets, the kanban or
Jira flow the idea flow implied, at a bare-bone level (`56-OPEN-DECISIONS.md` section 0).

**State.** Every rule here is `specified, not built` unless a row says `built`. The format is a
proposal from research, written so a builder can start. Nothing in this file is `[Z]` except the ask.

## 0. Sources, and where they disagree

Source | What it gives this file
`docs/research/2026-09-18-sheets-boards/BOARDS.md` | The survey, the demand, the merge test, the format and the v1 set
`docs/research/2026-09-18-sheets-boards/ONE-PLATFORM.md` | Where a board sits in the type registry
`docs/research/2026-09-18-sheets-boards/SCREEN-REFERENCES.md` | What a person expects on the board screen, named S40 there
`25-ENGINE-SPEC.md` section 25.9 | A drag has a write path only into front matter today
`66-FORMAT-SPECIFICATIONS.md` sections 3.3, 3.4, 3.6 and 3.9 | What a front matter `set` changes, and the defect that gates it

**The two research files disagree about what `board: 1` means.** `ONE-PLATFORM.md` section 6 says the
companion file wins, so `BOARDS.md` wins. Carried here so nobody picks silently.

`ONE-PLATFORM.md` section 3.2 | `BOARDS.md` section 4.4 | This file
`board: 1` marks a single file whose headings are columns and whose task items are cards | `board: 1` marks a board file naming a folder of card files | `BOARDS.md`. The one-file shape is `F184`'s read-only Kanban view, section 7
A board over many files is a view file, `view: 1` with `layout: board` | The board file itself groups the folder | The board file. `70-PLATFORM-AND-TYPES.md` section 3 records how the two relate

## 1. The shape in four lines

1. **One card is one markdown file** with a `status` key in its front matter.
2. **One board is one markdown file** whose front matter names the folder, the key and the columns.
3. **Moving a card is a one-line splice** into that card's front matter, entering the change queue.
4. **A board is the batch 9a table view, grouped by a key.** Sheets and boards are two layouts of one
   dataset, as in Linear, GitHub and Notion (`BOARDS.md` section 1.2).

## 2. The bytes

### 2.1 The board file

```markdown
---
board: 1
cards: tasks/
key: status
columns: [Todo, Doing, Review, Done]
limits: [0, 3, 2, 0]
---

# Launch tasks

Anything written here is prose any reader shows.
```

This is `BOARDS.md` section 4.4's example, at `tasks/BOARD.md`.

Key | Required | Shape | Meaning
`board` | yes | the integer `1` | The version key, per the pattern of `66-FORMAT-SPECIFICATIONS.md` section 3.9
`cards` | yes | a vault path to a folder, ending `/` | Where the card files live
`key` | yes | a top-level front matter key name | The key whose value picks a card's column. `status` by default in a new board
`columns` | yes | a flow list of scalars | The column names, in order
`limits` | no | a flow list of whole numbers, paired with `columns` by position | A WIP limit per column. `0` means none

- **`columns` and `limits` are flow lists of scalars**, which the writer emits today
  (`66-FORMAT-SPECIFICATIONS.md` section 3.4). Nothing is nested, so nothing waits on section 3.8's
  nested-edit work.
- **The body is ordinary prose**, shown above the columns. Any reader shows it.
- **Unknown keys are kept byte for byte**, per `66` section 3.9.

### 2.2 The card file

```markdown
---
status: Doing
order: 2000
assignee: amit
due: 2026-10-03
labels: [frontend]
---

# Booking form

Built from [specs/booking.md](../specs/booking.md).

## Acceptance

- [ ] A slot cannot be booked twice
```

This is `BOARDS.md` section 4.4's example, at `tasks/booking-form.md`.

Key | Required | Shape | Meaning
the board's `key`, `status` by default | no | a scalar | The column. Missing or unknown puts the card in Other
`order` | no | a number | Position within the column, lowest first. Sparse, as Backlog.md's `ordinal: 318000` is
`assignee` | no | a scalar | Who holds the card. A handle, not an email
`due` | no | `YYYY-MM-DD` | The due date
`labels` | no | a flow list of scalars | Tags to filter by

- **The card's title is its first H1**, else its file name without `.md`.
- **The body is the card's detail.** It is a document like any other.
- **Acceptance criteria are a `## Acceptance` checklist in the body**, a convention, not a key
  (`BOARDS.md` section 3.2).
- **Unknown keys are kept byte for byte.**

### 2.3 How a board reads its folder

Rule | Detail
Which files are cards | Every `.md` file directly inside `cards`, except any file carrying a `board` key. `INFERENCE:` subfolders are not read in v1
Column of a card | The card's value for `key`, matched exactly against `columns`
Other | A card whose value is not in `columns`, or which has no value, sits in a last column named Other
Done | The last column in `columns` counts as done, as in Jira, where only the right-most column counts as complete
Order in a column | By `order`, then by file name for cards with equal or missing `order`. `INFERENCE:` file name is a stable tie-break that needs no write
Card face | Title, assignee, due date, labels, and an overdue mark

**Values are matched exactly, case and all.** `INFERENCE:` case-folding would put `doing` and `Doing`
in one column. A drag would then have to choose which spelling to write, which is a guess
(`BOARDS.md` section 4.4).

**The overdue mark is a display only.** It reads the viewer's clock and is never written. `INFERENCE:`
a device clock may only display, per `67-SYNC-AND-CONFLICT.md` section 2.2 as `ONE-PLATFORM.md`
section 3.12 reads it.

### 2.4 Why a folder of card files

From `BOARDS.md` section 4.3, in order of weight.

1. **The engine can write it today.** `25-ENGINE-SPEC.md` section 25.9 says a kanban drag has a write
   path only into front matter. A one-file board waits on body-span addressing, specified and not
   built.
2. **It merges.** In `BOARDS.md` section 4.2's test, two branches moving two different cards in one
   board file conflicted; the same moves in card files merged clean.
3. **The largest body of demand asks for it.** Four of the Obsidian Kanban plugin's twelve most
   reacted issues ask for cards that are notes. Obsidian's help added a Kanban view of that shape on
   4 September 2026.
4. **It is the batch 9a table, grouped.** Rows are files and columns are keys.
5. **Agents write small files well and large shared files badly** (`BOARDS.md` section 3.1).

**What it costs, stated plainly.**

- A board is many files, so it is heavier to email or paste. `INFERENCE:` export can write a one-file
  snapshot in the heading shape, read-only.
- Manual order needs an order key, so a reorder writes a line.

## 3. Writes

### 3.1 Every write is a front matter splice

**Every write below is a `set` of one key in one file, entering the change queue** (ADR-0008). None
rewrites a file.

Action | File written | Bytes that change | Queue
Drag a card to another column | the card | the `key` line, `-status: Todo` then `+status: Doing` | one item
Drag to reorder within a column | the card | the `order` line | one item
Edit assignee or due date from the card | the card | that key's line | one item
New card in a column | a new file | the whole new file, with `key` set to that column | one `create` item
Add, rename, reorder or remove a column | the board file | the `columns` line, and `limits` if present | one item, see 3.3
Set a WIP limit | the board file | the `limits` line | one item

**The engine path is built.** `spliceFrontmatterValue` in `src/modules/share/domain/splice-frontmatter.ts`
addresses one top-level key, and a `set` on a present key changes that key's line and its
continuation lines only (`66-FORMAT-SPECIFICATIONS.md` section 3.3).

**One defect gates every move.** `66` section 3.6.1: a `set` deletes the blank lines that follow the
key. Every move is a `set`, so no board move ships until it is fixed with a red proof first.

`66` section 8 hands it to `44-TECH-DEBT-REGISTER.md`, where it has no row yet at `cb7c16f`.

**A new card is a `create` item.** The queue carries no create kind today. `67-SYNC-AND-CONFLICT.md`
section 8.4 proposes `kind: "splice" | "create" | "delete"`, and this file depends on it.

### 3.2 Order without rewriting neighbours

- **A new `order` is a number between the two neighbours' values.** One move writes one file.
- **When no number fits between them**, the neighbours are renumbered, and each renumbered card is its
  own item, grouped. `INFERENCE:` with sparse values this is rare; how rare is unmeasured.
- **A card with no `order`** sorts after those with one. Dragging it writes an `order`.

### 3.3 Column changes

Change | What is proposed | What cards do
Add a column | the board file's `columns` | nothing
Reorder columns | the board file's `columns`, and `limits` in step | nothing
Remove a column | the board file's `columns` | cards with that value fall into Other. No card is written
Rename a column | the board file's `columns`, and the new value on every affected card | each card is its own item, grouped with the board file's

- **A rename is grouped and decided per item**, as `ONE-PLATFORM.md` section 3.7 proposes for any
  change across files.
- **A card whose item is rejected keeps its old value**, so it falls into Other. `INFERENCE:` that is
  the deterministic result, not a guess.
- **Whether a person's own rename may be accepted in one action** stays `needs founder`, because it
  reads the founder's own rule. ADR-0008 `[Z]` says every change, a person's edit included, enters
  the queue. It is the same question as S40's `D20`, for a person's own drag.
- **Recommended: the owner's own rename and drag are saved like their own typing**, through the save
  path of `67-SYNC-AND-CONFLICT.md` section 3, one splice per file. The queue keeps every change by
  somebody else: another person, an AI edit, an agent or a mirror.
- Rejected in the recommendation: holding the owner's own action for the owner's own acceptance,
  which turns one drag into two. Agent and mirror rows are never bulk-accepted
  (`67-SYNC-AND-CONFLICT.md` section 8.1).
- If the founder holds ADR-0008 literally, the table in section 3.1 stands as written: every move is
  one queue item.

### 3.4 What is refused rather than guessed

Situation | Outcome | Id
The card's `key` line cannot be addressed: a block scalar, anchor, or a block sequence at column 0 | The move is refused; the card stays where it was | `E004`, `E009`, as the writer refuses today
A card file has no front matter block | A `set` prepends one, as the writer does today (`66` section 3.3) | none
`limits` and `columns` differ in length | The board shows no limits and names the key in the problems panel | `E521`
A column name contains a comma, or would need quoting in a flow list | The column change is refused | `E566`
Two columns share a name | The board renders its source, with the reason | `E522`
`board` is missing its value, or names a major version the client does not know | The board file opens as a note, with the reason | `E523`
`cards` names a folder that does not exist | The board shows no cards and names the path | `E524`
A file carries both `board` and another reserved profile key | Opens as a note, and the problems panel names both keys (`70-PLATFORM-AND-TYPES.md` section 2) | `E525`
A move past a WIP limit | Written as any move. The count turns to the warning colour | none; a limit warns, never blocks

## 4. Viewing

### 4.1 WIP limits

- **The column header shows the count and the limit**, `Doing 4 / 3` in `SCREEN-REFERENCES.md`
  section 3's drawing.
- **Past the limit, the count takes the warning colour.** Nothing is blocked.
- **Why it never blocks.** Jira says constraints do not change how many items a column shows. GitHub
  says a limit stops neither people nor automations from exceeding it (`BOARDS.md` section 1.3).
  Blocking would make a legal file edit fail.

### 4.2 Filters

- **Filter by label, assignee or text.** A chip row: Mine, Due this week, a label, and text search
  (`SCREEN-REFERENCES.md` section 3).
- **A filter is held per viewer and never written.** Saved filters as named views are later, because
  a saved view is a write.

### 4.3 Card detail

- **A card opens as a document in the editor.** Its body is the detail, edited like any document.
- **Links in the body are ordinary markdown links**, followed on click. A card built from a spec links
  back to it.
- **The card face shows no body text**, as Linear's board does (`SCREEN-REFERENCES.md` section 3).
- **A side panel peeks at a card** without leaving the board, as drawn in that file.

### 4.4 Phone

`SCREEN-REFERENCES.md` section 3 draws a phone board as a list of one column at a time. The same data
in list layout, as Linear toggles board and list. The phone frame is specified in
`docs/pack/12-screens/S40.md`.

## 5. Agents

### 5.1 An agent proposes a move; a person accepts it

**In kanban-md and Backlog.md the agent moves the card. In fmd the agent proposes the move**
(`BOARDS.md` section 3.2). The card changes column only when a person accepts it on S20.

Need | How fmd meets it
Plain files an agent reads with `cat` and `grep` | One card file each; front matter any YAML reader parses
Small writes | A move is one line in one small file
A claim, so two agents do not take one card | A proposed `assignee`, carrying the card's version as its compare-and-swap token (`25-ENGINE-SPEC.md` section 25.9, `docVersion`)
Acceptance criteria | A `## Acceptance` checklist in the card body
No silent writes | Every agent change is a proposal

**Two agents claiming one card.** The first accepted item moves the card's head. The second item's
base is now stale, so it cannot be applied as it stands; `67-SYNC-AND-CONFLICT.md` section 8.5 governs
accepting on a moved head.

### 5.2 The board draws pending moves

- **A proposed move is drawn on the board**: the card ghosted in its target column, with the queue's
  accept and reject controls in place.
- **Until accepted, the card stays in its real column.** The file is the truth, and the file has not
  changed.
- `INFERENCE:` a board that hid pending moves would hide the agents' work (`BOARDS.md` section 3.2).

### 5.3 What an agent reads

The agent server's `read_view(path)` on a board file returns the cards as stable JSON, each with its
path, column, order and head hash. `70-PLATFORM-AND-TYPES.md` section 10 specifies the call. The
agent server itself is batch 10a (`50-ROADMAP.md`).

## 6. From the idea flow's blueprint to a board

**The kit stays fifteen files** (`66-FORMAT-SPECIFICATIONS.md` section 6.1). A board is not a
sixteenth file. It is made in the person's own project after the kit exists.

Step | What happens | Evidence or rule
1 | On S15, a "Make a board" control reads the kit's `specs/*.md` and `DECISIONS.md` | The kit names one spec per core flow (`66` section 6.1)
2 | One card file per task is drafted: a title, `status: Todo`, and a link back to the spec heading it came from | Backlog.md's split-into-tasks step; spec-kit's one task per line
3 | Every open decision becomes a card too, `status: Todo`, `labels: [decision]` | `DECISIONS.md` marks each `Status: open` or `Status: decided` (`66` section 6.2)
4 | The board file and every card arrive in the change queue as `create` items, grouped. The person accepts all, some or none | Agents propose, the person accepts
5 | The agent that builds from the kit proposes moves as it works | Section 5

- **Step 2 is a model call.** `INFERENCE:` its cost belongs in the blueprint costing on S13, which
  assumes one call per kit file. A board draft adds at least one call.
- **Whether it spends a blueprint credit** is `needs founder`, because it is money (`BOARDS.md`
  section 5.4). Recommended: it spends none, and counts as part of the blueprint it reads. It is one
  more model call on a kit the person already paid a credit for.
- `UNVERIFIED:` how many cards a blueprint yields. Nobody has run the kit generator, and `66` section
  6 is `specified, not built`. So no card count is given. needs: the first generated kit, in batch 6.

## 7. The read-only Kanban view of one document

**Keep two things apart** (`BOARDS.md` section 4.5).

Thing | Carrier | Writes | Register
Kanban view of a document | Headings as columns, list items as cards, the existing `F184` shape | None. Read-only, as Flow view is | `F184`, reworded to read-only
Board | A board file plus card files | One key per move, through the change queue | `F296`, batch 9a

- `INFERENCE:` this keeps what `F184` promised, any document viewed as a kanban, without body-span
  splicing. A spec-kit or Kiro `tasks.md` then opens as a read-only kanban of its phases.
- **A one-file Obsidian Kanban board** (`kanban-plugin: board` in front matter) opens in this
  read-only view. Converting it to a folder of card files is a proposal, never a silent rewrite.

## 8. The v1 feature set

From `BOARDS.md` section 5.1. Every row is a proposal for the founder.

# | Feature | What it writes | Proposed id
1 | Columns from the board file's `key` and `columns` | nothing | `F296`
2 | Drag a card to another column | the card's `key` | `F297`
3 | Drag to reorder within a column | the card's `order` | `F298`
4 | Add, rename, reorder and remove columns | `columns`; a rename also proposes each card's new value | `F299`
5 | New card in a column | a new file | `F300`
6 | An Other column for unknown or missing values | nothing | `F296`
7 | WIP limit per column, warning past it; never blocks | `limits` | `F301`
8 | Card face: title, assignee, due, labels, overdue mark | nothing | `F296`
9 | Card detail: the card opens as a document | the body, as any document | `F302`
10 | Assignee and due date edited from the card | `assignee`, `due` | `F303`
11 | Filter by label, assignee or text, per viewer | nothing | `F304`
12 | Links to documents in the card body | nothing | `F302`
13 | Proposed moves drawn on the board, decided in place | nothing until accepted | `F305`
14 | A read-only Kanban view of any single document | nothing | `F184`, reworded
15 | Make a board from a blueprint, as one grouped proposal | new card files | `F306`

**Next, once v1 is used** (`BOARDS.md` section 5.2): swimlanes by a second key; a completion date
stamped on entering the last column; a board embedded in a document; dependencies between cards;
saved filters as named views.

**Open for the founders** (`BOARDS.md` section 5.4). Three are resolved as proposals, and one is
the founder's.

1. Does `F184` become read-only, and does Board take a new feature id in batch 9a? **Yes to both**,
   `resolved (proposed 19 Sep, founder review)`. `F296` is allocated. Rejected: a writable one-file
   board, section 7's reason.
2. The default columns. **`Todo, Doing, Done`**, `resolved (proposed 19 Sep, founder review)`: the
   bare bone, and a person adds a column in one action. Rejected: the five drawn on S40, which that
   screen's `D19` now resolves to three. Linear's and Jira's defaults are in `BOARDS.md` section 5.4.
3. Does Make a board spend a blueprint credit? **`needs founder`**, section 6.
4. The phone board as a list grouped by status. **Yes**, `resolved (proposed 19 Sep, founder
   review)`: columns side by side do not fit a phone. Rejected: a sideways-scrolling board.

## 9. Never build

Feature | Why
Workflow transitions, validators, conditions | A Jira concept. In a file any value is legal; we show it, never refuse it
Sprints, story points, velocity, burndown | Nobody in the forty plugin issues or the forum topics read asked for them
Epics as a hierarchy, sub-task trees | The file tree and links already give structure
A query language like Jira's JQL | The filter is three fields
Automation rules that move cards by themselves | A move nobody accepted breaks the change-queue law; Backlog.md's auto-commit complaints show the cost
Time tracking | Not in any demand signal read
A whole-file board writer | The mechanism behind the Obsidian Kanban plugin's reported content loss; forbidden by splice-only writing
Copying code from `obsidian-kanban` | It is under the GNU General Public License (GPL) 3.0, and `54-COMPLIANCE-AND-LEGAL.md` section 7 forbids it. Shapes only
Blocking a move past a WIP limit | No incumbent read blocks; it would make a legal file edit fail
Directories as columns, moving files between folders | `INFERENCE:` a move would be a delete and a create, paired, and a rename in every mirror

## 10. Register rows needed

**Allocated on 19 September**, see `tools/new-ids-allocation.md`. Every id below now has its row in
its register. The rows that ask an owner to change an existing row, such as `F184`, `C101`, `44`
and `21`, are still open for that owner.

Register | Row | For
`10-FEATURE-REGISTER.md` | `F296`, `F297`, `F298`, `F299`, `F300`, `F301`, `F302`, `F303`, `F304`, `F305`, `F306` | Section 8, batch 9a
`10-FEATURE-REGISTER.md` | `F184` reworded: a read-only Kanban view of one document | Section 7
`14-COMPONENT-INVENTORY.md` | `C101` KanbanBoard split into the read-only view and the writable board | Section 7
`17-ERROR-AND-REFUSAL-CATALOGUE.md` | `E521`, `E566`, `E522`, `E523`, `E524` | Section 3.4
`17-ERROR-AND-REFUSAL-CATALOGUE.md` | `E525`, shared with `70` | Section 3.4
`16-COPY-DECK.md` | One string per new error; the WIP count; the Other column's name; the Make a board control | Sections 3.4, 4.1, 2.3, 6
`19-ACCEPTANCE-CRITERIA.md` | `A825`: a card move changes one key in one file, checked by byte diff | Section 3.1; `ONE-PLATFORM.md` section 4.3's gate
`19-ACCEPTANCE-CRITERIA.md` | `A826`: two moves of two different cards on two branches merge without conflict | Section 2.4
`19-ACCEPTANCE-CRITERIA.md` | `A827`: an agent's move leaves the card file unchanged until accepted | Section 5
`19-ACCEPTANCE-CRITERIA.md` | `A828`: a move past the limit is written | Section 4.1
`44-TECH-DEBT-REGISTER.md` | The two front matter writer defects of `66` section 3.6, as `66` section 8 already asks | Section 3.1
`21-DATA-MODEL.md` | The queue's `kind` for `create`, as `67` section 8.4 proposes | Section 3.1
S15's owner | A Make a board control | Section 6

## 11. Limits of this file

- **Nothing here is built** except the front matter writer a move would use, and that has a defect
  to fix first.
- **The research was not re-run.** Every incumbent claim, count and the merge test are `BOARDS.md`'s,
  from 18 September 2026. The merge test is one scenario each, on synthetic files.
- **Order, the Other column, the folder rule and the column-change rules** are this file's reading of
  `BOARDS.md`, marked `INFERENCE:` where they go further.
- **Not assessed:** the board screen's layout, keyboard map and accessibility. They belong to
  `docs/pack/12-screens/S40.md`, which landed at `ee73929` while this file was written.
- **Checked at `cb7c16f`.** Nothing under `src/`, `test/` or the pack files cited here changed between
  `cb7c16f` and `ee73929` (`git diff --stat`), so the front matter names the later commit.
- **What would falsify it.** A board operation the founders need that cannot be one front matter
  splice per file; or a measured case where sparse `order` values force frequent renumbering.
