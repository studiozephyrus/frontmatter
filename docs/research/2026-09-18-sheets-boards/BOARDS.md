---
id: BOARDS-2026-09-18
title: Boards for fmd, the evidence and a v1
status: draft, written progressively
updated: 2026-09-18
owner: sagnik
answers: the founder's board request of 18 September 2026
---

# Boards for fmd: the evidence and a v1

**The ask, 18 September 2026.** The founder wants a custom board beside sheets: the kanban or Jira flow the idea flow implied, with its logic and values, at a bare-bone level.

**How to read this.** Every source below was fetched with `curl` on 18 September 2026 (UTC). The URL sits beside each claim. `UNVERIFIED:` marks what was not opened. `INFERENCE:` marks reasoning, not a source.

**Quotation.** Sources are paraphrased, not quoted, unless marked. Code was read to learn a file format only. No code from a GPL or AGPL project is copied here, per `docs/pack/54-COMPLIANCE-AND-LEGAL.md` section 7.

**Where the pack stands today.**

- `F184` in `docs/pack/10-FEATURE-REGISTER.md` plans a Kanban view: headings as columns, task items as cards, the obsidian-kanban shape. State `planned`, Later.
- `C101 KanbanBoard` is "implied by screens, not built" (`docs/pack/14-COMPONENT-INVENTORY.md`).
- `docs/pack/25-ENGINE-SPEC.md` section 25.9 says a kanban drag can only be written to front matter today. A card whose status sits in the body has no write path.
- `docs/pack/50-ROADMAP.md` section 3.5 schedules batch 9a, database views over front matter, early, by founder decision D13.

**The answer in brief.** A board is the batch 9a table view, grouped by a status key. One card is one markdown file. The drag is a one-line front matter splice the engine can already make.

---

## 1. What the incumbents ship

### 1.1 The survey

"Columns from" says what a column is made of. "Stored as" says where a card lives.

Product | Columns from | Stored as | WIP limit | Swimlanes | Source
Jira (company-managed) | Workflow statuses mapped onto columns; several statuses may share one column | Jira's database | Minimum and maximum per column; the header turns red or yellow, nothing is blocked | By query, parent story, assignee, epic or space, or none | support.atlassian.com/jira-software-cloud/docs/configure-columns/ and /configure-swimlanes/
Jira workflows | Statuses plus one-way transitions; a move needs a transition to exist | same | n/a | n/a | support.atlassian.com/jira-cloud-administration/docs/work-with-issue-workflows/
Trello | Lists, named freely, cards dragged between them | Trello's database | UNVERIFIED: not in the pages opened | UNVERIFIED | trello.com/guide/trello-101, trello.com/guide/create-a-board
Linear | Grouping, Status by default; also project, priority, cycle, label and more | Linear's database | UNVERIFIED: not on the board page | Yes, a second grouping shown as rows | linear.app/docs/board-layout
GitHub Projects | Any single-select or iteration field; dragging sets that field | GitHub's database | Per view; shown and highlighted, never enforced | Horizontal grouping by a field | github/docs, `customizing-the-board-layout.md`
Notion | Groups by status, select, person, multi-select or relation | Each card is a page in a database | UNVERIFIED | Sub-groups | notion.com/help/boards
Asana | Sections; a section is a header in list view and a column in board view | Asana's database | UNVERIFIED | UNVERIFIED | developers.asana.com/reference/sections.md
Obsidian Kanban plugin | `##` headings in one file | One markdown file per board | Yes, written into the heading as `(N)` | No; the second most-reacted request | github.com/community-archive/obsidian-kanban, `src/parsers/formats/list.ts`, `src/helpers.ts`
Obsidian Bases, Kanban view | Any note property chosen as Group by | One note per card; the view is a `.base` YAML file | UNVERIFIED: not in the docs page | No; requested 7 Sep 2026 | obsidian-help repo, `en/Bases/Layouts/Kanban view.md`
Logseq | No board built in; markers `LATER NOW DONE` or `TODO DOING DONE` on blocks | Blocks in pages | n/a | n/a | logseq/docs repo, `pages/Tasks.md`
todo.txt | None; one line is one task | One plain text file | n/a | n/a | github.com/todotxt/todo.txt README
Tasks.md | Lanes are directories | One file per card, moved between directories | UNVERIFIED | UNVERIFIED | github.com/BaldissaraMatheus/Tasks.md README
Backlog.md | `statuses` in `config.yml` | One file per task, `status` in front matter, an `ordinal` key for order | UNVERIFIED | UNVERIFIED | github.com/MrLesk/Backlog.md README and `backlog/tasks/`
kanban-md | `statuses` in `config.yml` | One file per task, YAML front matter | `wip_limits` per status, plus a class of service that may bypass them | No | github.com/antopolskiy/kanban-md README
Kanban Markdown for VS Code (LachyFS) | `status` key | One file per card, front matter, `order` key, subfolders by status | UNVERIFIED | UNVERIFIED | github.com/LachyFS/kanban-markdown-vscode-extension README
kanban.md for VS Code (wguilherme) | Headings in a `.kanban.md` file | One file per board | UNVERIFIED | No | github.com/wguilherme/kanban.md README

### 1.2 What stands out

**Obsidian itself moved to the file-per-card model.** Its help repo added "Bases: Add kanban view" on 4 September 2026, commit date read from the GitHub API. Dragging a card rewrites the grouped property in that note.

**The same page sets limits.** Only markdown notes can be dragged. A formula or file property cannot be edited by a drag. Notes with no value fall into a "None" column.

**Jira has the same catch-all.** A status not mapped to a column sits in an "Unmapped statuses" panel. Its query swimlanes always end in an undeletable "Everything Else" lane.

**The one-file plugin is unmaintained.** Its author posted on 12 January 2026 that he no longer has time and wants new maintainers (`MAINTAINERS.md`). The repository now sits under `community-archive`.

**Every hosted tool treats board and list as one dataset.** Linear says nearly every view can be a board or a list. GitHub picks any single-select field as the column field.

Asana goes furthest: its section is a header in a list and a column in a board.

INFERENCE: that is the strongest argument for building boards as a grouping of the batch 9a table, not as a second product.

### 1.3 The bare bone every board has

The survey covers fifteen products; thirteen draw a board, and Logseq and todo.txt do not. A feature is bare bone here if at least five of the thirteen ship it, on the pages opened.

Feature | Who ships it, from the pages opened | Bare bone?
Columns from one field, list or heading | all thirteen that draw a board | Yes
Drag a card between columns to change that field | Jira, Trello, Linear, GitHub, Notion, Obsidian Kanban, Bases, Tasks.md, Backlog.md, LachyFS | Yes
Order within a column | Linear (top or bottom shortcuts), GitHub (manual unless sorted), Notion, Backlog.md (`ordinal`), LachyFS (`order`), Obsidian Kanban (line order) | Yes
Add and rename columns | Jira, Trello, GitHub, Notion, Obsidian Kanban | Yes
A card opens to a detail | Trello (the card back), Linear (peek), Notion (a page), Bases (a note), every file-per-card tool | Yes
Due date on a card | Trello, LachyFS, wguilherme (`due:`), and todo.txt, whose README gives `due:2010-01-02` as its example of `key:value` metadata | Yes
Assignee or member | Jira, Trello, Linear, Backlog.md, LachyFS | Yes
Labels or tags, and filter by them | Linear (group and filter), Backlog.md (`labels`), kanban-md (`tags`, list filters), LachyFS (`labels`), wguilherme (tag filter), Obsidian Kanban (tags; filtering is a top request) | Yes
A catch-all for unknown values | Jira "Unmapped", Bases "None" | Yes, because a file can hold any value
WIP limit | Jira, GitHub, Obsidian Kanban, kanban-md | Yes. Jira and GitHub say it warns rather than blocks; UNVERIFIED for the other two
Swimlanes | Jira, Linear, GitHub, Notion | Common in hosted tools. Absent from Obsidian Kanban, Bases and kanban-md; UNVERIFIED for the other markdown tools
Workflow transitions with rules | Jira | No
Sprints, backlog ranking, epics | Jira; Linear has cycles | No

**The WIP limit never blocks, in both products whose docs describe it.** Jira says constraints do not change how many items a column shows. GitHub says a limit stops neither people nor automations from exceeding it.

---

## 2. What users ask for

### 2.1 The Obsidian Kanban plugin's issues, ranked by reactions

Read from the GitHub search API, `repo:community-archive/obsidian-kanban is:issue`, sorted by reactions, on 18 September 2026. The repository reports 904 issues and 4,506 stars. Reactions are all kinds; the `+1` count is beside it.

Rank | Issue | Reactions (+1) | Comments | Opened | What it means for us
1 | #4 Embed a kanban board in a page | 258 (247) | 53 | 2021-04-22 | People want a board inside a document, not only as its own screen
2 | #237 Swim lanes | 124 (118) | 41 | 2021-07-25 | The one hosted-tool feature markdown boards lack
3 | #345 Dynamic board, Dataview style | 96 (66) | 19 | 2021-10-09 | Cards should be notes chosen by a query, and a move should rewrite the note's metadata
4 | #85 Show cards from a search or Dataview query | 33 (33) | 17 | 2021-05-12 | Same as #345
5 | #503 Filter the board by tags | 26 (25) | 5 | 2022-04-07 | Filter is bare bone
6 | #193 Arrange the board in several rows | 23 (20) | 12 | 2021-06-12 | A layout request; related to swimlanes
7 | #309 Add a date when an item is completed | 22 (22) | 3 | 2021-09-22 | A done date; #685 asks the same, 12 more
8 | #108 Card colour from priority or a picker | 21 (21) | 7 | 2021-05-25 | Cosmetic
9 | #1032 Keep text when clicking away from a card being edited | 20 (19) | 9 | 2024-08-11 | A data-loss complaint about the editor
10 | #467 Pull `#todo` items from notes into cards | 19 (12) | 16 | 2022-02-15 | Cards should come from where the work already lives
11 | #239 Notes on items | 19 (17) | 7 | 2021-07-29 | A card needs a body; #94 asks the same, 14 more
12 | #843 Bind a lane to a `status` property in the linked note | 18 (0) | 5 | 2023-10-17 | The file-per-card model, asked for by name

URLs follow the pattern `https://github.com/community-archive/obsidian-kanban/issues/<n>`.

**Four of the top twelve ask for the file-per-card model in different words:** #345, #85, #467 and #843. Two more (#239, #94) ask for a card body, which a file-per-card board has for free.

**One asks for the opposite direction.** #4, the top request, wants the board embedded in a page. INFERENCE: in a file-per-card design that is a view block inside a document pointing at a folder, a later feature, not v1.

**#345 describes our design almost exactly.** Its author proposes a fenced block holding a query; notes become cards; moving a card updates each note's metadata; adding a matching note adds a card.

### 2.2 Data loss in the one-file format

Issue | Reactions | What happened
#855 Lost content in a daily note not shown in Kanban mode | 0 | Paragraphs the board did not display were gone on reopening; once a whole day's note was lost. The reporter blamed the plugin because disabling it stopped the loss
#1091 Edit changes lost when dragging a different card | 4 | An edit in progress lost
#1090 Archived cards get lost | 0 | Archive content lost

**The mechanism is visible in the source.** `boardToMd` in `src/parsers/formats/list.ts` rebuilds the whole file: front matter through `stringifyYaml`, every lane, the archive, then the settings block. It is a whole-file rewrite, which the projection law forbids.

INFERENCE: anything the parser does not model, such as a paragraph between lanes, cannot survive a rewrite built only from the model. That matches #855's report. The low reaction counts mean few people saw it, not that it is rare.

### 2.3 Forum and Hacker News

Signal | Size | URL
Obsidian forum, "Bases: kanban view", a feature request | 236 likes, 43 posts, 11,305 views, opened 2025-06-06 | https://forum.obsidian.md/t/101593
Obsidian forum, "Kanban Plugin", the plugin's launch thread | 369 likes, 248 posts, 76,764 views, opened 2021-04-23 | https://forum.obsidian.md/t/17082
Obsidian forum, "Bases: Support for tasks" | 113 likes, 31 posts, 10,250 views | https://forum.obsidian.md/t/103074
Obsidian forum, "Kanban Board rendered from markdown" | 71 likes, 22 posts, 15,121 views, opened 2020-09-02 | https://forum.obsidian.md/t/5184
Obsidian forum, "Bases: Swimlanes in Kanban view" | 4 likes, 1 post, opened 2026-09-07, three days after the view shipped | https://forum.obsidian.md/t/118054
Obsidian forum, "How to manually sort entries in the new Kanban Base View?" | 1 like, 2 posts, 2026-09-03 | https://forum.obsidian.md/t/117910
Hacker News, "Backlog.md, markdown-native task manager and Kanban visualizer for any Git repo" | 254 points, 62 comments, 2025-07-06 | https://news.ycombinator.com/item?id=44483530
Hacker News, "Show HN: Kanban-md, file-based CLI Kanban built for local agents collaboration" | 19 points, 4 comments, 2026-02-10 | https://news.ycombinator.com/item?id=46957653
Hacker News, "A Markdown textfile based Kanban board in a single HTML file" | 20 points, 3 comments, 2026-03-21 | https://news.ycombinator.com/item?id=47465881

Like counts come from each topic's `.json` endpoint on the Discourse forum. HN numbers come from the Algolia HN API. Titles are paraphrased where long.

**The Bases request names why.** Its author used the Projects plugin for a board and says that plugin is no longer maintained. The same abandonment story as the Kanban plugin.

**Manual order is the first gap people hit in the file-per-card model.** Topic 117910 asks how to hand-sort cards in the new Bases view; a sort property did not work for the asker.

UNVERIFIED: whether Bases supports manual order at all.

### 2.4 What the agent-era tool's users ask for

Backlog.md's issues, sorted by reactions (298 issues). The counts are small; the direction is clear.

Issue | Reactions | Point
#164 Option to disable automatic git commits | 7 | The tool wrote to git on the person's behalf
#160 "quietly auto-commits things in git", the issue's own title | 6 | Same complaint
#334 Custom backlog folder and several backlogs | 5 | Where the board's files live must be the person's choice
#281 A comments section | 4 | A card needs discussion

URLs: `https://github.com/MrLesk/Backlog.md/issues/<n>`.

INFERENCE: the top two are the change-queue rule in a stranger's words. A tool that writes the person's files without asking loses their trust first.

### 2.5 Ranked, and split

Rank by evidence | Feature | Evidence | Bare bone or power?
1 | A card is a note; a move rewrites its status | #345, #85, #467, #843 (166 reactions together), Bases forum topic (236 likes), Obsidian shipping it | Bare bone, and our format question
2 | Board embedded in a document | #4 (258) | Later; needs a view block
3 | Swimlanes | #237 (124), #193 (23), Bases swimlane topic | Power in markdown, common in hosted tools
4 | A card body or notes | #239, #94 (33) | Bare bone; free when a card is a file
5 | Filter by tag | #503 (26), #1038 (9) | Bare bone
6 | Completion date | #309, #685 (34) | Small; a second key on the same splice
7 | Manual order within a column | forum 117910, every hosted tool | Bare bone
8 | No silent writes | Backlog.md #164, #160 | Our law already

**The Jira power features nobody in this evidence asked for:** workflow transitions with validators, sprints, story points, epics as a hierarchy, JQL, time tracking. None appears in the forty issues read or the forum topics above.

---

## 3. The agent era

### 3.1 How agents use task boards today

Tool | What the agent does with the board | Where the state lives | Source
GitHub Copilot cloud agent | Is handed a task from Issues, VS Code, a PR comment or an automation; researches, plans, changes code on a branch; a person reviews the diff before a pull request | GitHub | docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent
GitHub Projects automations | Two workflows on by default: a closed issue or PR, or a merged PR, sets Status to Done | GitHub | github/docs, `using-the-built-in-automations.md`
Linear agents | An agent is an app user. Assigning it an issue delegates the issue, and the human assignee stays the owner | Linear | linear.app/docs/agents-in-linear
spec-kit | Writes `tasks.md`: H2 phases, `- [ ] T001` checkbox tasks with an ID, `[P]` for parallel-safe, a story tag | One markdown file | github/spec-kit, `templates/tasks-template.md`
Kiro | Writes `requirements.md`, `design.md`, `tasks.md`; its task view marks each task in progress or done and runs independent tasks in parallel | One markdown file per spec | kiro.dev/docs/specs/
Backlog.md | The agent splits an idea into task files with acceptance criteria, writes a plan into the task, then implements one task per session | One file per task, `status` in front matter | github.com/MrLesk/Backlog.md README
kanban-md | Agents claim a task, which is a cooperative lock that expires; `pick --claim` finds, claims and moves in one step | One file per task | github.com/antopolskiy/kanban-md README
TASKS.md | One file for one writer. With more than one writer it moves to a git-native backend with compare-and-swap claims, and the file becomes a generated snapshot | One file, then git refs | github.com/tasksmd/tasks.md README

**Every agent tool with more than one writer left the single file.** kanban-md is file per task from the start. TASKS.md keeps one file only for a single writer and switches backend for more.

**Backlog.md's author gives the reason plainly** in the Hacker News thread (comment 44486879): agents struggle to edit large files, so tasks are kept small, about one pull request each.

**Context budget is the other constraint.** Asked how agents read many task files without exhausting context (comment 44485288), the answer pointed to instructions files. kanban-md ships a `--compact` output for the same reason.

### 3.2 What a board that agents can read and propose to needs

Need | Why, from the evidence | How fmd meets it
Plain files an agent reads with `cat` and `grep` | kanban-md, Backlog.md and TASKS.md all rest on this | One card file each; front matter any YAML reader parses
Small writes | Agents edit large files badly (Backlog.md, HN 44486879) | A move is one line in one small file
A cheap summary | Context budget (HN 44485288; kanban-md `--compact`) | INFERENCE: the board definition file lists its columns; a later `llms.txt`-style index could list cards. Not v1
A claim, so two agents do not take one card | kanban-md claims; TASKS.md compare-and-swap | `assignee` proposed through the change queue; the splice carries the document version as its compare-and-swap token (`25-ENGINE-SPEC.md` 25.9)
Acceptance criteria on the card | Backlog.md, spec-kit, Kiro requirements | A `## Acceptance` checklist in the card body, a convention, not a key
Dependencies | Backlog.md, TASKS.md IDs, Kiro's parallel runs | INFERENCE: a `depends` flow list of card file names. Not v1
No silent writes | Backlog.md #160, #164 | Our law: every agent change is a proposal a person accepts

**Our rule changes one thing.** In kanban-md and Backlog.md the agent moves the card. In fmd the agent proposes the move; the card changes column on the board only when a person accepts it in the queue.

INFERENCE: the board should draw a proposed move, for example the card ghosted in its target column with the queue's accept control. A board that hides pending moves would hide the agents' work.

---

## 4. The file format, which is the crux

### 4.1 The three options, and a fourth seen in the wild

Option | Shape | Who uses it
A. One file | A `##` heading per column, a `- [ ]` list item per card, board settings in a trailing comment block | Obsidian Kanban, wguilherme kanban.md, `F184` today
B. Folder of card files | One markdown file per card; `status` in its front matter; the board is a view over the folder | Obsidian Bases, Backlog.md, kanban-md, LachyFS, Notion (a page per card)
C. A fenced block | A `fm-board@1` fence whose body lists the cards | Nobody surveyed. Obsidian Kanban #345 proposed a fence holding a *query*, not the cards
D. Directories as columns | A card file moves between folders | Tasks.md

**What Obsidian Kanban writes, read from `src/parsers/common.ts` and `formats/list.ts`.**

- Front matter `kanban-plugin: board` (the key is `frontmatterKey`), with a blank line after each `---`.
- `## Title` per lane, or `## Title (N)` when a WIP limit is set (`laneTitleWithMaxItems` in `src/helpers.ts`).
- `**Complete**` under a lane marks its cards done; each card is `- [c] text`.
- An archive after `***` under `## Archive`.
- Settings as JSON in a code fence inside `%% kanban:settings ... %%`.

### 4.2 Scored against our laws

Criterion | A. One file | B. Folder of card files | C. Fenced block
Byte-exact round trip | Only if the writer splices. The reference writer regenerates the whole file (`boardToMd`), and #855 reports content loss | Yes. Only one key's line changes; the body is never touched (`66-FORMAT-SPECIFICATIONS.md` 3.3) | Yes if the fence is spliced as a unit (4.3 there)
Move a card as a splice | Two splices in one file: cut a list item, insert it under another heading. Needs `list-item-text` addressing, which `25-ENGINE-SPEC.md` 25.9 specifies and does not build | One `set` of `status` in one file. **Built today**, with defect 3.6.1 to fix first | A rewrite inside an opaque body, or a row splice the engine does not have
Addressing risk | A task line's text is unique in its file only 67.436 percent of the time (25.9, `[measured]`); needs path, ordinal and digest | The file path is the address. No ambiguity | Same as A inside the fence
Git diff of a move | Two hunks, a line removed and a line added elsewhere | One line: `-status: todo` `+status: doing` | Two hunks inside the fence
Merge, two people move two different cards | **Conflicted** in the test below | **Merged clean** | INFERENCE: as A
Merge, two people move the same card to different columns | Conflicts | Conflicts, as it should: a real disagreement | Conflicts
An agent reads it | One file, easy while small | `cat` and `grep` over small files; costs more reads | Easy, but the fence body is data, not prose
An agent writes it | Must edit a large shared file, which agents do badly (HN 44486879) | Edits one small file; a new card is a new file | As A
Card detail and body | A nested list or a linked note; #239 and #94 ask for it | The card is a document; its body is the detail | Awkward: prose inside a data fence breaks the carrier rule
Other tools that open it | Obsidian with the plugin; any editor shows a list | Obsidian Bases groups it by `status` with no change; any editor opens each card. Backlog.md, kanban-md and LachyFS use the same idea with their own folders and required keys, so INFERENCE: close, not drop-in | Only fmd. A fence nobody else renders shows as code
Order within a column | Line order, free | Needs an order key (Backlog.md `ordinal`, LachyFS `order`); a reorder writes one key | Line order
Carrier rule (`66` 4.1) | Headings and lists, readable anywhere | Front matter keys, reserved like `66` 3.9 | A fence for data, allowed, but cards are prose

**The merge test, run in this session.** Two throwaway repositories under `$TMPDIR`, not in this repository, git 2.50.1 on macOS.

Case | Result
One file; branch x moves Card A from Todo to Doing, branch y moves Card B from Todo to Done; A and B were adjacent | `git merge` exit 1, `board.md` conflicted
One file; one branch reorders two Todo cards, the other ticks a Done card | exit 0
Folder; branch x sets `a.md` to doing, branch y sets `b.md` to done | exit 0
Folder; branches p and q set `c.md` to doing and to done | exit 1, `cards/c.md` conflicted

INFERENCE: in the one-file format, any two moves out of neighbouring lines of one column conflict. On a busy Todo column that is most pairs of moves.

### 4.3 Recommendation: B, a folder of card files, with one board file

**One card is one markdown file with a `status` key. The board is a markdown file whose front matter names the folder, the key and the column order.**

Why B, in order of weight:

1. **The engine can write it today.** `25-ENGINE-SPEC.md` 25.9 states a drag has a write path only into front matter. Option A waits on body-span addressing, which is specified and not built.
2. **It merges.** Different cards never conflict in git; the same card conflicts only when two people truly disagree.
3. **The largest body of demand asks for it**, and Obsidian, the closest competitor in files, shipped it on 4 September 2026.
4. **It is the batch 9a table, grouped.** Rows are files, columns are keys. Sheets and boards become two layouts of one dataset, as in Linear, GitHub and Notion.
5. **Agents write small files well** and large shared files badly.

**What B costs, stated plainly.**

- A board is many files, so it is heavier to email or paste than one file. INFERENCE: export can write a one-file snapshot in shape A, read-only.
- Manual order needs an order key, so a reorder writes a line. Use a sparse number, as Backlog.md's `ordinal: 318000` does, so one move writes one file.
- `F184`'s shape changes. See 4.5.

### 4.4 The proposed shape

A board file, for example `tasks/BOARD.md`:

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

A card file, for example `tasks/booking-form.md`:

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

**Rules, each a proposal.**

- `board: 1` is the version key, per the `66` 3.9 pattern. A major version the client does not know renders the source with a reason, never an empty space.
- `columns` and `limits` are flow lists of scalars, which the writer can emit today (`66` 3.4). No nested map, so nothing waits on the nested-edit work in 3.8.
- `limits` pairs with `columns` by position; `0` means none. A length mismatch shows the board with no limits and names the key in the problems panel. Nothing is guessed.
- A card whose `status` is not in `columns` sits in a last "Other" column, as Jira's unmapped panel and Bases' "None" column do. A card with no `status` goes there too.
- The last column counts as done, as in Jira, where only the right-most column counts as complete.
- The card's title is its first H1, else its file name. Links to documents are ordinary markdown links in the body, which every reader follows.
- Unknown keys on a card or a board are kept byte for byte, as `66` 3.9 requires.
- `status` values are matched exactly. INFERENCE: case-folding would let `doing` and `Doing` both land in one column, and a drag would then have to choose which spelling to write, which is a guess.

### 4.5 Where this meets `F184` and Flow view

**Keep two things apart.** A read-only Kanban view of any one document, and a writable Board over a folder.

Thing | Carrier | Writes | Register
Kanban view of a document | Headings as columns, list items as cards, the existing `F184` shape | None. Read-only, as Flow view (S09) is | `F184`, reworded to read-only
Board | A board file plus card files | One `status` or `order` splice per move, through the change queue | New feature id, in batch 9a beside the table view

INFERENCE: this keeps what `F184` promised, any document viewed as a kanban, without needing body-span splicing. A spec-kit `tasks.md` or a Kiro `tasks.md` then opens as a read-only kanban of its phases.

### 4.6 How the idea flow's blueprint becomes a board

**The kit stays fifteen files** (`66` 6.1, founders' `[Z]`). A board is not a sixteenth file; it is made in the person's own project after the kit exists.

Step | What happens | Evidence or rule
1 | On S15, a "Make a board" control reads the kit's `specs/*.md` and `DECISIONS.md` | The kit already names one spec per core flow (`66` 6.1)
2 | One card file per task is drafted: a title, `status: Todo`, a link back to the spec heading it came from | Backlog.md's split-into-tasks step; spec-kit's one task per line
3 | Every open decision becomes a card too, `status: Todo`, `labels: [decision]` | `DECISIONS.md` marks each `Status: open` or `Status: decided` (`66` 6.2)
4 | All files arrive in the change queue as one proposal; the person accepts all, some or none | Agents propose, the person accepts
5 | The agent that builds from the kit proposes moves as it works | Section 3.2

UNVERIFIED: how many tasks a blueprint yields. Nobody has run the kit generator; `66` section 6 is `specified, not built`. So no card count is given.

INFERENCE: step 2 is a model call. Its cost belongs in the blueprint costing (S13), which assumes one call per kit file. A board draft adds at least one call.

---

## 5. Proposed feature set for fmd Boards v1

### 5.1 In v1

Every write below is a front matter splice into one card file, entering the change queue. None rewrites a file.

# | Feature | What it writes | Evidence
1 | Columns from the board file's `key` and `columns` | nothing | All thirteen boards surveyed; Bases, GitHub, Linear group by a field
2 | Drag a card to another column | `status` in that card | GitHub, Bases, Notion; issues #345, #843
3 | Drag to reorder within a column | `order` in that card, a sparse number | Backlog.md `ordinal`, LachyFS `order`; forum 117910
4 | Add, rename, reorder and remove columns | `columns` in the board file; a rename also proposes the new `status` on every affected card, as one proposal | Jira, Trello, GitHub, Notion. INFERENCE on the rename cascade
5 | New card in a column | a new file with `status` set | Bases' plus control; Linear's plus control
6 | An "Other" column for unknown or missing status | nothing | Jira unmapped statuses; Bases "None"
7 | WIP limit per column, shown as a count and a colour past the limit; never blocks | `limits` in the board file | Jira, GitHub (both say warn, not block); Obsidian Kanban; kanban-md
8 | Card face: title, assignee, due, labels, and a mark when overdue | nothing | Trello card back; LachyFS
9 | Card detail: the card opens as a document in the editor | the body, as any document | Notion, Bases, Trello card back; #239, #94
10 | Assignee and due date edited from the card | `assignee`, `due` | Trello, Backlog.md, LachyFS
11 | Filter by label, assignee or text, held per viewer and never written | nothing | #503 (26), #1038 (9); Linear, GitHub slicing
12 | Links to documents in the card body, followed on click | nothing | Every file-per-card tool; the kit's specs
13 | Proposed moves drawn on the board, accepted or rejected in place | nothing until accepted | Our change queue; Backlog.md #160, #164
14 | A read-only Kanban view of any single document | nothing | `F184`, reworded; spec-kit and Kiro `tasks.md`
15 | Make a board from a blueprint, as one proposal | new card files | Section 4.6

### 5.2 Next, once v1 is used

Feature | Why not v1 | Evidence
Swimlanes by a second key | Real demand, but a second axis doubles the layout work, and S09 already says kanban does not work at phone width | #237 (124), #193 (23), Bases topic 118054; Jira, Linear, GitHub, Notion ship it
A completion date stamped on entering the last column | A second key on the move; cheap but not bare bone | #309, #685 (34)
A board embedded in a document | Needs a view block pointing at a folder; a new carrier decision | #4 (258), the top request
Dependencies between cards | Useful to agents; not asked for by people in this evidence | Backlog.md, TASKS.md, Kiro
Saved filters as named views | A saved view is a write; v1 keeps filters per viewer | Bases views, Linear custom views

### 5.3 Never build

Feature | Why
Workflow transitions, validators, conditions | A Jira concept (work-with-issue-workflows): a move needs a transition. In a file any value is legal; we show it, never refuse it
Sprints, story points, velocity, burndown | Jira and Linear planning layers; nobody in the forty plugin issues or the forum topics read asked for them
Epics as a hierarchy, sub-task trees | The file tree and links already give structure
A query language like JQL | The filter is three fields; Bases' filter grammar is the ceiling if one is ever needed
Automation rules that move cards by themselves | Moves without a person accepting break the change-queue law; Backlog.md's auto-commit complaints show the cost
Time tracking | Not in any demand signal read
A whole-file board writer | The mechanism behind Obsidian Kanban #855's loss; forbidden by splice-only writing
Copying code from `obsidian-kanban` | GPL-3.0; `54-COMPLIANCE-AND-LEGAL.md` forbids it. Shapes only
Blocking a move past a WIP limit | No incumbent read blocks; it would make a legal file edit fail

### 5.4 Open for the founders

1. **Does `F184` become read-only, and does Board take a new feature id in batch 9a?** This file recommends yes to both.
2. **Default columns.** Linear's defaults are Backlog, Todo, In Progress, Done, Canceled. Jira's simplified defaults are To Do, In Progress, Done. INFERENCE: `Todo, Doing, Done` is the bare bone; the founder picks.
3. **Does "Make a board from a blueprint" spend a blueprint credit?** It is a model call (4.6).
4. **Phone.** S09 says kanban does not fit phone width. A phone board may be a list grouped by status, the same data in list layout, as Linear does.

---

## 6. Limits of this file

- **Sources were opened on 18 September 2026 (UTC) and not re-checked.** Linear, Notion and Atlassian pages change often.
- **Asana's board help page did not render with `curl`.** Only its API reference was read. Its WIP limits and swimlanes are UNVERIFIED.
- **Trello's WIP and swimlane support is UNVERIFIED.** The pages opened did not cover them.
- **Bases' Kanban view is in Obsidian early access, version 1.14**, per its docs page. Its manual ordering and WIP limits are UNVERIFIED.
- **Reaction counts measure a vocal minority** of one plugin's users, mostly from 2021 and 2022. They rank requests; they do not size a market.
- **The GitHub search API returned 40 issues per query.** Issues below that line were not read.
- **The merge test is one scenario each**, on synthetic files, with default git settings. It shows the mechanism, not a rate.
- **Nothing here was built or run inside fmd.** The engine claims rest on `25-ENGINE-SPEC.md` and `66-FORMAT-SPECIFICATIONS.md` as written, not on a new run.
- **Defect 3.6.1 in `66`** (a `set` deletes blank lines after the key) must be fixed before any board move ships, because every move is a `set`.
- **HN comments are paraphrased** from the Algolia API text and attributed by comment id.
- **Code in `obsidian-kanban` was read to learn its file format only.** Nothing from it is copied into this repository.
