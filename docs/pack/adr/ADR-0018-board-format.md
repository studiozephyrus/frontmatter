---
id: ADR-0018-board-format
title: A board is a folder of card files and one board file
mode: explanation
tier: canonical
status: open
verified_against: ee73929
updated: 2026-09-19
owner: sagnik
covers: [ADR-0018]
---

# ADR-0018. A board is a folder of card files and one board file

**Decision id:** ADR-0018. **Status: open, proposed.** The ask is `[Z]`, 18 September 2026: a custom
board beside sheets, the kanban or Jira flow the idea flow implied (`56-OPEN-DECISIONS.md` section 0).

The format below is a recommendation from research, awaiting the founder. **Recorded here:**
19 September 2026.

The full specification is `69-BOARDS-SPEC.md`. This record keeps only the decision and its reasons.

## Context

- `F184` plans a Kanban view in the one-file shape of the Obsidian Kanban plugin: headings as columns,
  task items as cards.
- `25-ENGINE-SPEC.md` section 25.9 says a kanban drag has a write path only into front matter today. A
  card whose status sits in the body has no write path.
- D13 `[Z]` put database views over front matter early, as batch 9a.
- Every change enters the change queue (ADR-0008), including an agent's.

## Decision, proposed

- **One card is one markdown file** with a `status` key, or whichever key the board names, in its
  front matter.
- **One board is one markdown file** carrying `board: 1`, `cards`, `key`, `columns` and an optional
  `limits`, all flat scalars or flow lists.
- **Moving a card is a `set` of one key in one file**, entering the change queue. Reordering writes a
  sparse `order` key in that one card.
- **An agent proposes a move; a person accepts it.** The board draws the pending move.
- **WIP limits warn and never block.**
- **`F184` becomes a read-only Kanban view of any one document.** It writes nothing.

## Evidence

All from `docs/research/2026-09-18-sheets-boards/BOARDS.md`, opened 18 September 2026, unless marked.

- **The merge test** (section 4.2): two branches moving two different cards conflicted in a one-file
  board and merged clean as card files. Moving the same card to two columns conflicted in both, as it
  should.
- **Demand** (section 2.5): four of the Obsidian Kanban plugin's twelve most reacted issues ask for
  cards that are notes, 166 reactions together.
- **The incumbent moved** (section 1.2): Obsidian's help added a Kanban view over notes grouped by a
  property on 4 September 2026.
- **The one-file writer loses content** (section 2.2): `boardToMd` rebuilds the whole file, and issue
  855 reports paragraphs lost on reopening.
- **Agents edit large files badly** (section 3.1): every agent tool with more than one writer left the
  single file.
- **WIP limits** (section 1.3): Jira and GitHub both describe a limit that warns rather than blocks.

## Alternatives rejected and why

Alternative | Why rejected
One file, headings as columns, as `F184` and `ONE-PLATFORM.md` section 3.2 proposed for `board: 1` | A move is two splices in one shared file, needs body-span addressing that is not built, and conflicts in git. Kept only as the read-only view
A fence listing the cards | Cards are prose, and prose in a data fence breaks the carrier rule of ADR-0002
Directories as columns | A move becomes a delete and a create, and a rename in every mirror
A view file with `layout: board` as the only board | `INFERENCE:` it works, but a board then needs a query language before it needs a folder. `70-PLATFORM-AND-TYPES.md` section 3.2 keeps it `needs founder`
Workflow transitions that refuse a move | In a file any value is legal. Nobody in the evidence asked for them

## Consequences

- **`F184` is reworded to read-only**, and Board takes a new feature id in batch 9a. Both are register
  edits owned elsewhere; `69` section 10 lists them.
- **`66-FORMAT-SPECIFICATIONS.md` defect 3.6.1 gates every move**, because every move is a `set`.
- **A new card is a `create` queue item**, which depends on `67-SYNC-AND-CONFLICT.md` section 8.4's
  proposed `kind`.
- **`board` becomes a reserved profile key.** `[O]` It appears as a top-level key in 0 of the 8,513
  corpus files (`70` section 2.2).

## What would reverse it

- A measured case where sparse `order` values force frequent renumbering, so a reorder stops being one
  write.
- Founders needing a board that lives in one file to email or paste, often enough that the export
  snapshot in `69` section 2.4 does not answer it.

## Limits of this record

- **Not decided.** The founder has asked for boards; he has not chosen this format.
- **The merge test is one scenario each**, on synthetic files, per `BOARDS.md` section 6.
- **No board code exists.** The front matter writer a move would use is built, with one defect.
