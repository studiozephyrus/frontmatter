---
id: sheets-boards-roadmap-19sep
title: Resolution log for sheets, boards, the platform and the roadmap, second pass
mode: reference
tier: canonical
status: living
verified_against: 6c44319
updated: 2026-09-20
owner: sagnik
covers: [review-sheets-boards-roadmap-19sep]
---

# Resolution log for sheets, boards, the platform and the roadmap, second pass

Every open point and `UNVERIFIED:` claim in ten files, treated under the second pass of
`docs/pack/tools/RESOLVE-BRIEF.md`.

The files are `68-SHEETS-SPEC.md`, `69-BOARDS-SPEC.md`, `70-PLATFORM-AND-TYPES.md`, `50-ROADMAP.md`,
`51-PRODUCT-PLAN.md`, `12-screens/S39.md`, `12-screens/S40.md` and `adr/ADR-0017` to `ADR-0019`.

Line numbers are each file's lines at `6c44319`, before this pass. Web pages were opened on
2026-09-19 UTC, which was 2026-09-20 in India.

## 1. Every item

file | id or line | the open point | what you did | basis | needs founder (yes/no)
--- | --- | --- | --- | --- | ---
68 | line 235, section 4.5. | `needs founder`: whether a non-terminating quotient errors or is rounded to a default. | Resolved as proposed: it stays an error until the formula rounds. Not a founder matter: no money, law, brand or promise. | The projection law: a default number of places is a guess written into the person's file. Rejected: two places by default. | no.
68 | line 237, section 4.5. | `UNVERIFIED:` formula.js `ROUND`'s rounding mode for a tie. | Checked and confirmed a rule: half away from zero, symmetric for negatives. Replaced the tag with the evidence and a line that our evaluator must match. | `[M]` `https://raw.githubusercontent.com/formulajs/formulajs/master/src/math-trig.js`, `roundBase`, commit `af0f0b41ed`, opened 2026-09-19 UTC. | no.
68 | line 360 to 364, section 6.3. | `UNVERIFIED:` the exact escape each spreadsheet honours for a neutralised download cell. | Checked OWASP's page and fixed the rule: wrap in double quotes, prepend an apostrophe, double inner quotes. Resolved as proposed to reject OWASP's Excel tab fix, which stays in the data. The per-application part stays `UNVERIFIED:` with a needs naming a live test. | `[M]` `https://owasp.org/www-community/attacks/CSV_Injection`, opened 2026-09-19 UTC. The page says no one strategy is safe for every spreadsheet. | no.
68 | line 422, section 9, SH12. | `UNVERIFIED:` that other spreadsheets' clipboards carry tab-separated text. | Cannot be checked from here: it needs a paste on a live machine. Kept the tag and added "needs:" naming the test. | A clipboard is a live device behaviour. | no.
69 | line 201, section 3.3. | `needs founder`: whether a person's own column rename may be accepted in one action. | First resolved as a proposal, then reverted on reading ADR-0008 again: its founder decision says a person's edit enters the queue, so this reads his own rule and stays needs founder. Wrote the recommendation and merged it with S40's `D20`. | ADR-0008 `[Z]`; `67-SYNC-AND-CONFLICT.md` section 3 saves a person's own typing directly, which is the precedent for the recommendation. | yes, item SBR-05.
69 | line 295, section 6; and line 344, section 8 question 3. | `needs founder`: whether making a board from a blueprint spends a blueprint credit. | Kept as needs founder, because it is money. Wrote the recommendation: no extra credit. | `BOARDS.md` section 5.4. It is one extra model call on a kit already paid for. | yes, item SBR-04.
69 | line 296, section 6. | `UNVERIFIED:` how many cards a blueprint yields. | Cannot be checked: the kit generator is not built. Kept the tag and added "needs:" naming the first generated kit. | `66` section 6 is `specified, not built`. | no.
69 | line 340, section 8 question 1. | Whether `F184` becomes read-only and Board takes a new id. | Resolved as proposed: yes to both; `F296` is already allocated. | Section 7 of the file; `ADR-0018`. Rejected: a writable one-file board. | no.
69 | line 341, section 8 question 2. | The default columns of a new board. | Resolved as proposed: `Todo, Doing, Done`. Aligned with S40's `D19`. | `BOARDS.md` section 5.4 calls three the bare bone. Rejected: the five columns drawn on S40. | no.
69 | line 344, section 8 question 4. | The phone board as a list grouped by status. | Resolved as proposed: yes. | Columns side by side do not fit a phone. Rejected: a sideways-scrolling board. | no.
70 | line 225, section 3.2. | `needs founder`: whether `fm-view@1` also offers `layout: board`. | Resolved as proposed: not in v1; the board file is the one way to make a board. Not a founder matter. | `ADR-0018` and `69-BOARDS-SPEC.md`. Rejected: a second way to make the same board. | no.
70 | line 368, section 8. | `UNVERIFIED:` that version records carry enough time data to show a document with embeds as it was. | Checked and confirmed: every version has an immutable `createdAt`, indexed descending per document. Found one limit, pruning past the history window, and resolved as proposed that such a past view shows the embed's placeholder. | `[O]` `sed -n '320,340p;508,521p' docs/pack/21-DATA-MODEL.md`. | no.
70 | line 380, section 9. | `UNVERIFIED:` that the Drive API leaves a `.csv` unconverted when no Google type is named. | Checked and confirmed: Drive converts only when the metadata names a Google Workspace type. Replaced the tag, and extended the rule to `.md`, which Drive can also import. | `[M]` `https://developers.google.com/workspace/drive/api/guides/manage-uploads`, opened 2026-09-19 UTC. | no.
S39 | line 138, states table, degraded. | `UNVERIFIED:` the row count at which the grid leaves its keystroke budget. | Cannot be measured until the grid is built. Kept the tag and added "needs:" naming the `A820` benchmark. | `68-SHEETS-SPEC.md` section 8 and `A820`. | no.
S39 | line 177, keyboard. | `UNVERIFIED:` `Cmd or Ctrl Shift M` checked against no binding. | Checked: no row in `15-INTERACTION-AND-KEYBOARD.md`, nothing under `src/`. Found one latent clash, `@codemirror/lint` 6.9.6 binding `Mod-Shift-m`, in a keymap `src/` does not load. Replaced the tag with the evidence; the row in `15` is that owner's. | `[O]` `grep -n -i shift docs/pack/15-INTERACTION-AND-KEYBOARD.md`; `grep -rn 'lintKeymap\|basicSetup' src` returned nothing; `node_modules/@codemirror/lint/dist/index.js:294`. Browser-level clashes were not checked. | no.
S39 | line 74, anatomy. | `UNVERIFIED:` the row-number convention, cited from `SCREEN-REFERENCES.md`. | Left as it is: the tag belongs to the research file, and the numbers are drawn and never written, so being wrong costs a redraw only. Counted as still unverified. | `SCREEN-REFERENCES.md` section 2, line 59. | no.
S39 | line 233, `D16`. | Where Sort the file lives. | Resolved as proposed: the column menu only, as drawn. | A write should sit one step away from a view-only control. Rejected: beside the sort chip. | no.
S39 | line 234, `D17`. | Whether a phone may set a formula. | Resolved as proposed: the grid sets values only on a phone; a formula is edited in the MD view, where the block is plain text. | Nothing is withheld, and no untested 390 px formula field is built. Rejected: a formula field in the phone's cell editor. | no.
S39 | line 235, `D18`. | Whether the grid shows `1200` or `1,200`. | Resolved as proposed: `1200`, as drawn. | The projection law: the grid shows the file's bytes. Rejected: `1,200`, which disagrees with the MD view. | no.
S40 | line 233, `D19`. | The default columns for a new board. | Resolved as proposed: `Todo, Doing, Done`. The drawing keeps five until regenerated, and says so. | `69-BOARDS-SPEC.md` section 8. Rejected: the five drawn columns. | no.
S40 | line 234, `D20`. | Whether a person's own drag lands at once or waits in the queue. | Kept as needs founder: it reads his own rule that every change enters the queue. Wrote the recommendation: the owner's own drag saves at once, like typing. Same question as the rename in `69` section 3.3. | ADR-0008 `[Z]`; `67-SYNC-AND-CONFLICT.md` section 3. | yes, item SBR-05.
S40 | line 235, `D21`. | Whether the card panel edits the body. | Resolved as proposed: read-only in the panel, with Open as a document to edit. | `69-BOARDS-SPEC.md` section 8 row 9. Rejected: a second body editor. | no.
ADR-0017 | line 6 and line 15, status. | Open, proposed: a sheet is a table in a document with a formula block below it. | Marked resolved (proposed) and needs founder; front matter status stays `open`, since only the founder moves a record to `decided`. | A format on disk is a promise to users. The evidence and rejected alternatives are already in the record. | yes, item SBR-03.
ADR-0018 | line 6 and line 15, status. | Open, proposed: a board is a folder of card files plus one board file. | As ADR-0017. | As ADR-0017. | yes, item SBR-03.
ADR-0019 | line 6 and line 15, status. | Open, proposed: one type registry, and embedding by reference. | As ADR-0017; its basis is batch 3, where the registry lands. | As ADR-0017. | yes, item SBR-03.
51 | line 55, section 1. | Whether the position sentence should name sheets and boards. | Kept as needs founder, because it is the brand. Wrote the recommendation: keep "a markdown editor". | Every new kind is a markdown or plain-text file in the same queue. Rejected: a sentence listing every kind, which reads like the suites the position stands against. | yes, item SBR-06.
51 | line 245, section 4.1; and lines 273 and 274, section 4.2. | Voice and PDF caps "awaiting the founders". | Kept as needs founder, because it is money. Wrote the recommendation: the specs' values as starting panel values, changed once measured. If the voice and PDF log carries the same question, answer it once. | `71` section 17.2, `72` section 9, and D11's panel-value precedent. Rejected: lower caps before any cost is measured. | yes, item SBR-07.
51 | line 400, section 7. | No willingness-to-pay research for sheets, boards, voice or PDF. | Left as a limit, not a decision. | Nothing to decide until the pilot. | no.
50 | line 141, section 2.1. | "The founder can split" phase F; whether the desktop moves alone. | Resolved as proposed: phase F stays whole. | The plan prices F as one 3-week appetite, and a split needs two appetites nobody has. Rejected: desktop at step 4, offline and phone at step 8. | no.
50 | line 252, section 3.0. | The one-week use window, a proposal. | Resolved as proposed: one seven-day window, two distinct days of use per founder. Updated "eleven" to "fourteen" batches, since batches 10, 11 and 12 now carry proposed appetites. | Plan section 28's definition of an active user. Rejected: a two-week window, which adds a week to every batch. | no.
50 | line 377, section 3.4. | The signed Windows build has no appetite. | Resolved as proposed: inside batch 8's appetite, cut first if it does not fit, so batch 8 ships macOS and Windows stays "coming". | Fixed time, variable scope, section 3.0. Rejected: inventing a day count with no source. | no.
50 | line 378, section 3.4. | `UNVERIFIED:` the extra work of a Windows signing step in CI. | Cannot be checked until a vendor is chosen. Kept the tag and added "needs:" naming the batch 1 choice. | `35-RELEASE-AND-VERSIONING.md` section 6.2a lists the routes. | no.
50 | line 400, section 3.4. | `UNVERIFIED:` whether `A645` or `A646` names Windows. | Checked: neither does. Fixed the claim; a Windows criterion is written in batch 8. Same fix in section 8. | `[O]` `grep -n 'A645\|A646' docs/pack/19-ACCEPTANCE-CRITERIA.md` and `grep -n -i windows` on the same file, which returned nothing. | no.
50 | line 428, section 3.5. | The 15 days for views and boards were never re-costed for a board as a folder of card files. | Resolved as proposed: the 15 days stand; the board is a view with its query fixed, and the dropped `layout: board` frees the work that now reads a folder. Pending moves are cut first if not. | `70-PLATFORM-AND-TYPES.md` section 3.2, as resolved in this pass. Rejected: adding days before anything is built. | no.
50 | line 474, section 3.6. | Whether live editing waits for its own batch. | Resolved as proposed: it stays in batch 4. | Phase D's appetite already prices it. Rejected: its own batch, which adds a use window and prices nothing. | no.
50 | line 496, section 3.6. | A published sheet is not costed. | Resolved as proposed: inside batch 4's appetite; if it does not fit, it moves to batch 12 with sites. | `68-SHEETS-SPEC.md` section 6.3: a plain HTML table and a neutralised download. Rejected: a day count with no source. | no.
50 | line 662, section 3.9; and line 1098, section 6. | The pilot's stop lines against D02: does a failed pilot stop batch 6 or only inform it. | Kept as needs founder: it decides whether money keeps being spent after strangers say no. Wrote the recommendation: a failed stop line pauses the build for one founders' meeting before batch 6. | Plan section 28 and D02 `[Z]` disagree in terms. | yes, item SBR-02.
50 | line 665, section 3.9. | Whether the pilot's script grows for the desktop, views and the agent server. | Resolved as proposed: the script does not grow; each interview adds one unprompted question about the newer features. | The stop and continue lines measure the core only. Rejected: new scripted steps the lines do not read. | no.
50 | line 686, section 3.10. | A board from a blueprint has no appetite. | Resolved as proposed: inside batch 6's appetite, cut first if the batch runs over. | `69-BOARDS-SPEC.md` section 6: one model call and one grouped proposal on parts that exist by then. Rejected: a day count with no source. | no.
50 | line 690, section 3.10. | Whether a board from a blueprint spends a blueprint credit. | Kept as needs founder, because it is money. Same item as `69` section 6. | `BOARDS.md` section 5.4. | yes, item SBR-04.
50 | line 714, section 3.11. | The Max price is not set in this file. | Pointed at the 18 September founder item in `51-PRODUCT-PLAN.md` section 7. No new item. | Already needs founder since 18 September. | no, already asked.
50 | line 765, section 3.13. | Batch 10, the API and the command line, has no appetite. | Resolved as proposed: 2 weeks, the plan's smallest phase appetite, with the command line cut first. | Both are thin adapters over batch 10a's ports (plan section 17). Rejected: leaving it unset, which keeps every total a floor. | no.
50 | line 780, section 3.14. | Batch 11 has 1 day known and the rest unset. | Resolved as proposed: 2 weeks for the rest, 11 days in all, with Notion's API import cut first. | Two of its three rows are views over parts that exist. Rejected: leaving it unset. | no.
50 | line 797, section 3.15. | Batch 12 has 13 days known and the rest unset. | Resolved as proposed: 3 weeks for the rest, 28 days in all, with the community cut first. | Three weeks is the plan's most common phase appetite. Rejected: leaving it unset. | no.
50 | line 810, section 3.15. | Canvas has no batch and no appetite. | Resolved as proposed: it stays out of every total until the founder asks for it. | It is not in the founder's list (`70` section 14). Rejected: pricing a feature nobody asked for. | no.
50 | lines 56 to 60, section 1; and sections 5.4, 5.5 and 5.7. | The range was "a floor, not a total", with three batches unpriced. | Carried the three proposed appetites into every total: 49 days and 3 windows, giving 244.8 to 352.0 weeks, 269.6 to 384.3 with content. Updated the diagram, the step table, section 4, section 5.4's rows and section 5.7. | `[O]` `python3`, arithmetic shown in section 5.5. | no.
50 | new section 5.9, and section 6. | The calendar itself. | Put to the founder with three options, each computed: accept; raise the pace, with the total at one, two and three extra days a week and at full time; or move named work to after launch, with each deferral's weeks. Recommended: two extra days a week and voice and PDF to Markdown after launch. | `[O]` `python3`, arithmetic shown in section 5.9. | yes, item SBR-01.
50 | line 1112, section 6. | Whether `F184` becomes read-only. | Marked resolved as proposed, pointing at `69` section 8. | As logged for `69`. | no.
50 | lines 1121 to 1128, section 6.1. | Whether the mirror worker moves into batch 2. | Resolved as proposed: the key layout and `connections` record go in batch 2; the mirror worker stays in batch 5. | The first stranger arrives after batch 5, so D03's promise holds for every stranger. Rejected: uncosted work in the batch every later one waits on. | no.
50 | line 1168, section 8. | Who writes the thirty days of content. | Kept as needs founder: it is a person's time and nobody is named. Wrote the recommendation: the founders, each piece in the batch that ships its feature. | Plan section 26 counts thirty days; section 5.5 adds them on top. | yes, item SBR-08.
50 | line 1178, section 8. | Whether `A645` and `A646` cover Windows signing. | Fixed: they do not, pointing at section 3.4. | As logged for line 400. | no.
50 | line 1187, section 8. | Whether the 15 days still cover a board as card files. | Pointed at the proposal in section 3.5. | As logged for line 428. | no.
51 | lines 230 and 231, section 4. | Batch 10's and Team's batch appetites read "unset". | Carried the roadmap's proposed appetites, 2 weeks and 28 days, with pointers. Team's price stays unset. | `50-ROADMAP.md` sections 3.13 and 3.15, this pass. | no.
50 | line 1111, section 6. | Voice V1 to V5 "open, defaults written". | Left: they belong to `71-VOICE-SPEC.md`, swept by the voice and PDF log. | Not this log's file. | no.

## 2. Items for the founder

In the shape the second pass asks for, ready for the checklist page.

id | file and place | the question, in plain words a non-engineer understands | option A | option B | recommended (A or B) and why in one line | kind (decide, professional, act)
--- | --- | --- | --- | --- | --- | ---
SBR-01 | `50-ROADMAP.md` section 5.9 | Building everything you have asked for takes about 245 to 352 weeks (4.7 to 6.8 years) at today's pace of roughly one working day a week, and the paid launch comes about 209 to 276 weeks in. Do we accept that, or shorten it? | Accept the full plan at today's pace, with nothing moved. | Shorten it. One extra working day a week cuts the total to 141 to 178 weeks, two days to 102 to 123, three to 82 to 96; separately, moving voice typing and PDF conversion to after launch brings launch 33 to 43 weeks sooner. | B, two extra days a week plus voice and PDF after launch: launch in about 73 to 82 weeks, because deferring alone still leaves launch 3.4 to 4.5 years away. | decide
SBR-02 | `50-ROADMAP.md` section 3.9 | If the trial with twenty outside people misses its minimum (for example, fewer than four still using it in week two), do we keep building everything anyway? | Pause the build for one meeting of both founders, then choose to continue, change the order or stop. | Keep building regardless, and use the trial only to adjust. | A, because building on regardless turns the trial into a formality, while an automatic stop would contradict your answer to build everything. | decide
SBR-03 | `adr/ADR-0017`, `ADR-0018`, `ADR-0019` | Do you approve the proposed way sheets, boards and mixed files are saved: a sheet as an ordinary table in a document with its formulas written just below it, a board as a folder with one small file per card, and one embedded file shown by a link to the original, never a copy? | Approve all three as the basis for building. | Hold them until a small prototype of each has been tried. | A, because every file people write will carry these formats, each record lists what would reverse it, and the first build step is itself the prototype. | decide
SBR-04 | `69-BOARDS-SPEC.md` section 6; `50-ROADMAP.md` section 3.10 | When someone turns a finished project plan into a task board, should that use up one of their plan credits? | No extra credit: it counts as part of the plan they already paid for. | It uses one credit, like making a new plan. | A, because it is one small extra AI call on a plan the person already paid for. | decide
SBR-05 | `69-BOARDS-SPEC.md` section 3.3; `12-screens/S40.md` open questions | When you move your own card on a board, or rename your own column, should it save at once, or wait for you to approve it like every change from someone else? | It saves at once, like your own typing; only changes from other people, AI and agents wait for approval. | It waits in the list of changes to approve, like everything else. | A, because approving your own drag turns one action into two, and your own typing already saves at once. | decide
SBR-06 | `51-PRODUCT-PLAN.md` section 1 | Our one-line description says "a markdown editor". Now that the product also does sheets and boards, should the line change? | Keep "a markdown editor". | Widen it to name documents, sheets and boards. | A, because every new kind is still a plain text file reviewed the same way, and listing kinds reads like the all-in-one suites we stand against. | decide
SBR-07 | `51-PRODUCT-PLAN.md` sections 4.1 and 4.2 | Are these starting limits right: free users get 60 minutes of voice typing a month and PDFs up to 1,000 pages and 100 MB; paid users get 300 minutes and 200 scanned PDF pages read by AI a month? | Start with these, and change them from the settings panel once real costs are measured. | Start lower until costs are measured. | A, because the limits can be changed without a release, which is how the free document limit is already handled. If the voice and PDF log asks the same, answer once. | decide
SBR-08 | `50-ROADMAP.md` section 8 | About thirty working days of writing (templates, help text, question sets, empty screens) is not assigned to anyone. Who writes it? | The two founders, each piece in the same step as the feature it explains. | Hire or commission a writer. | A, because the text has to match features as they land, and no budget for a writer exists yet. | act

## 3. Counts

Counted with `python3` over the rows of section 1, which holds 54.

- **Decisions resolved as proposals:** 24 rows, each marked `resolved (proposed 19 Sep, founder
  review)`, plus 2 checked claims that also carried one. Seven more rows carry a resolution into
  other sections, point at one, or leave an item to its owner. 24 + 12 + 11 + 7 = 54.
- **Needs founder:** 8 items, SBR-01 to SBR-08, from 12 rows.
- **`UNVERIFIED:` claims checked:** 11. Confirmed 4: the rounding rule, the Drive conversion rule, the
  version time data and the keyboard chord. Fixed 2: the CSV escape and the Windows criteria. Kept
  with a needs 4: the clipboard, the grid's row budget, the card count and the Windows CI step. Left
  as the research file's own tag 1: the row-number convention.
- **`UNVERIFIED:` tags left in these files:** 5, the four kept plus the per-application half of the
  CSV escape, which needs a live test.
- **Skipped under the second pass's rule 1:** 1, `51-PRODUCT-PLAN.md` section 7's segments claim,
  whose needs names the pilot.

## 4. Limits of this log

- **Section 26 of `docs/mvp0/PRODUCT-PLAN.md` still reads "unset"** for batches 10, 11 and 12, and
  "134 to 209" style totals may linger in other files. They are other owners' files and were not
  touched.
- **`56-OPEN-DECISIONS.md` section 5a still lists `D16` to `D21` as open.** Its owner carries the
  resolutions from S39 and S40.
- **The three new appetites are budgets chosen by analogy to the plan's own phases**, not costs
  derived from the code.
- **Every web page was opened once**, on 2026-09-19 UTC, and not re-read.
