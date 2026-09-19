---
id: new-ids-allocation
title: New ids allocation, S39 to S42 and specs 68 to 72
mode: reference
tier: canonical
status: living
verified_against: 1335518
updated: 2026-09-19
owner: sagnik
---

# New ids allocation, S39 to S42 and specs 68 to 72

**What this is.** Nine files written on 18 and 19 September carried placeholder ids written as
`new:` plus a slug. This is the working list that turned each placeholder into a real id in its
home register. It is the audit trail: a reader who meets an id in one of the nine files and wants
to know what slug it replaced looks here.

**The nine files.** `68-SHEETS-SPEC.md`, `69-BOARDS-SPEC.md`, `70-PLATFORM-AND-TYPES.md`,
`71-VOICE-SPEC.md`, `72-PDF-TO-MARKDOWN-SPEC.md`, and `12-screens/S39.md` to `S42.md`.

## 1. How the ids were chosen

- **New ids start after the highest existing one**, per `65-CONVENTIONS.md` section 3. Nothing was
  renumbered. Highest before this work, read with `grep -oE` on each register at `1335518`:

Kind | Highest before | First allocated | Home.
Feature | `F280` | `F281` | `10-FEATURE-REGISTER.md`.
Component | `C154` | `C155` | `14-COMPONENT-INVENTORY.md`.
Error, engine block | `E512` | `E513` | `17-ERROR-AND-REFUSAL-CATALOGUE.md` section 1.4.
Error, validation block | `E564` | `E565` | section 2.
Error, permission block | `E602` | `E603` | section 3.
Error, quota block | `E653` | `E654` | section 4.
Error, model block | `E700` | `E701` | section 5.
Error, provider block | `E755` | `E756` | section 6.
Error, network block | `E805` | `E806` | section 7.
Error, conflict block | `E851` | `E852` | section 8.
Acceptance criterion | `A814` | `A815` | `19-ACCEPTANCE-CRITERIA.md`.
Test id | `T814` | `T815` | proposed, not written.
Open decision | `D15` | `D16` | `56-OPEN-DECISIONS.md`.

- **One thing, one id.** Where a spec and its screen name the same thing, it takes one id. Two
  deduplications are not obvious and are recorded here:
  - `database-view` (`70` section 3.1) and `database-view-table` (`68` SH16) are one feature,
    `F295`. `70` section 3.1 says the view's table layout is the sheet's grid reused, so SH16 is a
    layout of the same view, not a second feature.
  - `type-profile-conflict` is named by `69` section 3.4 and `70` section 2.1. One error, `E525`.
- **One slug, two kinds.** `sheet-plain-toggle` is a feature in `68` (SH9, "Show the plain text")
  and a component in `S39` (the Grid and MD switch). Each gets its own id: `F289` in `68`, `C157`
  in `S39`.
- **Copy ids** turn the slug's hyphens into dots, so `k-s39-formulas-note` became
  `K.s39.formulas.note`, because a `K` id may hold only lower-case letters, digits and dots
  (`tools/validate-pack.py`). Where one slug covered a label and its help line, the help line took a
  sibling id ending `.help`, so each row holds one string.
- **Events** follow `55-MEASUREMENT-AND-EVENTS.md` section 8: dotted, noun then verb in the past
  tense. The voice and PDF events already had that shape and kept their names.
- **Configuration keys and call types** already were their own ids. They lost the `new:` prefix and
  gained a home row, in `28-CONFIGURATION-PANEL-SPEC.md` and `27-MODEL-ROUTING-SPEC.md` section 3.4.
- **Code symbols are not register ids.** Seven placeholders named a function in the domain layer.
  They became plain names with no register. Each screen that names one already says, in its Data
  contract, that none of it is built.

## 2. The count before

Measured with `grep -c 'new:'` on each file at `1335518`, which counts lines, not placeholders:

File | Lines with `new:`.
`68-SHEETS-SPEC.md` | 37.
`69-BOARDS-SPEC.md` | 28.
`70-PLATFORM-AND-TYPES.md` | 13.
`71-VOICE-SPEC.md` | 37.
`72-PDF-TO-MARKDOWN-SPEC.md` | 15.
`12-screens/S39.md` | 59.
`12-screens/S40.md` | 58.
`12-screens/S41.md` | 62.
`12-screens/S42.md` | 47.

A `python3` pass over the same files found **276 distinct slugs**, plus 14 wildcards such as
`new:k-s39-*` inside the "Register rows needed" lists, and 11 bare `new:` in prose saying what the
prefix means. The allocation below covers every slug. The wildcard lists and the bare mentions were
rewritten to point here.

## 3. Features, `F281` to `F323`

slug | scope | id | name.
`sheet-grid` | 68 | `F281` | Sheet grid over a table.
`sheet-structure` | 68 | `F282` | Sheet keyboard and structure.
`sheet-checkbox` | 68 | `F283` | Checkbox cells.
`sheet-view-sort-filter` | 68 | `F284` | Sort and filter the view.
`sheet-sort-file` | 68, S39 | `F285` | Sort the file.
`sheet-summaries` | 68 | `F286` | Column summaries.
`sheet-row-formulas` | 68 | `F287` | Row formulas.
`sheet-view-settings` | 68 | `F288` | Sheet view settings.
`sheet-plain-toggle` | 68 | `F289` | Show a sheet as text.
`sheet-csv` | 68 | `F290` | CSV and TSV in the grid.
`sheet-csv-import` | 68 | `F291` | Import CSV as a table.
`sheet-paste-range` | 68 | `F292` | Paste a spreadsheet range.
`sheet-csv-download` | 68 | `F293` | Download a sheet as CSV.
`sheet-published` | 68 | `F294` | Published sheet.
`database-view`, `database-view-table` | 70, 68 | `F295` | Database view over notes.
`board` | 69 | `F296` | Board over card files.
`board-move` | 69 | `F297` | Move a card.
`board-reorder` | 69 | `F298` | Reorder cards.
`board-columns` | 69 | `F299` | Change board columns.
`board-new-card` | 69 | `F300` | New card.
`board-wip` | 69 | `F301` | Column limits.
`board-card-detail` | 69 | `F302` | Card detail.
`board-card-fields` | 69 | `F303` | Card fields.
`board-filter` | 69 | `F304` | Board filters.
`board-pending-moves` | 69 | `F305` | Pending moves on the board.
`board-from-blueprint` | 69 | `F306` | Board from a blueprint.
`type-registry` | 70 | `F307` | The type registry.
`embed` | 70 | `F308` | Embeds across types.
`cross-type-search` | 70 | `F309` | Search across types.
`cross-type-backlinks` | 70 | `F310` | Backlinks across types.
`deck-profile` | 70 | `F311` | Deck profile.
`site` | 70 | `F312` | Site from a folder.
`voice-dictation` | 71 | `F313` | Voice dictation.
`voice-restructure` | 71 | `F314` | Voice clean-up levels.
`voice-commands` | 71 | `F315` | Voice commands.
`voice-desktop-local` | 71 | `F316` | Local voice on the desktop.
`voice-live-preview` | 71 | `F317` | Live preview while speaking.
`pdf-convert-text` | 72 | `F318` | PDF text layer conversion.
`pdf-convert-ocr` | 72 | `F319` | PDF OCR on the device.
`pdf-convert-vision` | 72 | `F320` | PDF vision pass.
`pdf-entry-empty-doc` | 72 | `F321` | Start from a PDF.
`pdf-entry-ai-panel` | 72 | `F322` | Convert a PDF in the AI panel.
`pdf-entry-tool` | 72 | `F323` | Convert a PDF to a note.

## 4. Components, `C155` to `C185`

slug | scope | id | name.
`sheet-toolbar` | S39 | `C155` | SheetToolbar.
`sheet-view-chip` | S39 | `C156` | SheetViewChip.
`sheet-plain-toggle` | S39 | `C157` | GridSourceSwitch.
`formula-bar` | S39 | `C158` | FormulaBar.
`sheet-summary-row` | S39 | `C159` | SheetSummaryRow.
`sheet-embed` | S39 | `C160` | EmbeddedSheet.
`sheet-open-full` | S39 | `C161` | OpenAsSheetButton.
`board-toolbar` | S40 | `C162` | BoardToolbar.
`board-pending-pill` | S40 | `C163` | PendingMovePill.
`board-quick-filter` | S40 | `C164` | BoardQuickFilter.
`board-column` | S40 | `C165` | BoardColumn.
`board-card` | S40 | `C166` | BoardCard.
`board-pending-move` | S40 | `C167` | PendingMoveCard.
`board-card-panel` | S40 | `C168` | CardPanel.
`board-column-switcher` | S40 | `C169` | ColumnSwitcher.
`voice-pill` | S41 | `C170` | ListeningPill.
`voice-level-chip` | S41 | `C171` | VoiceLevelChip.
`voice-pending` | S41 | `C172` | PendingInsertion.
`voice-pending-bar` | S41 | `C173` | PendingInsertionBar.
`voice-ghost` | S41 | `C174` | GhostedResult.
`voice-proposal-card` | S41 | `C175` | VoiceCommandProposal.
`voice-level-cards` | S41 | `C176` | VoiceLevelCards.
`voice-privacy-note` | S41 | `C177` | VoicePrivacyNote.
`voice-bar-mic` | S41 | `C178` | BottomBarMic.
`pdf-start-row` | S42 | `C179` | PdfStartRow.
`pdf-file-row` | S42 | `C180` | PdfFileRow.
`pdf-progress` | S42 | `C181` | ConversionProgress.
`pdf-preview` | S42 | `C182` | ConversionPreview.
`pdf-report` | S42 | `C183` | ConversionReport.
`pdf-destination` | S42 | `C184` | ConversionDestination.
`pdf-not-kept-note` | S42 | `C185` | PdfNotKeptNote.

## 5. Errors and refusals, 42 rows

**`72` section 14.4 and `S42` say "the ten `new:pdf-*` ids"**, but `72` section 8 lists nine. Nine
were allocated. Re-count with `grep -o 'new:pdf-[a-z-]*' 72-PDF-TO-MARKDOWN-SPEC.md | sort -u`.
against the file at `1335518`.

slug | scope | id | class.
`sheet-cell-linebreak` | 68, S39 | `E513` | engine.
`sheet-formula-cycle` | 68, S39 | `E514` | engine.
`sheet-formula-not-number` | 68, S39 | `E515` | engine.
`sheet-formula-summary-in-row` | 68 | `E516` | engine.
`sheet-formula-unknown-function` | 68, S39 | `E517` | engine.
`sheet-formula-inexact` | 68 | `E518` | engine.
`sheet-csv-readonly` | 68 | `E519` | engine.
`sheet-csv-ragged` | 68 | `E520` | engine.
`board-limits-mismatch` | 69, S40 | `E521` | engine.
`board-duplicate-column` | 69, S40 | `E522` | engine.
`board-version` | 69, S40 | `E523` | engine.
`board-missing-folder` | 69, S40 | `E524` | engine.
`type-profile-conflict` | 69, 70 | `E525` | engine.
`embed-missing-source` | 70 | `E526` | engine.
`embed-ambiguous-anchor` | 70 | `E527` | engine.
`embed-cycle` | 70 | `E528` | engine.
`voice-target-protected` | 71, S41 | `E529` | engine.
`pdf-damaged` | 72, S42 | `E530` | engine.
`pdf-nothing-readable` | 72, S42 | `E531` | engine.
`sheet-csv-encoding` | 68 | `E565` | validation.
`board-column-name` | 69 | `E566` | validation.
`voice-nothing-heard` | 71, S41 | `E567` | validation.
`voice-no-target` | 71, S41 | `E568` | validation.
`voice-selection-too-long` | 71, S41 | `E569` | validation.
`pdf-password` | 72, S42 | `E570` | validation.
`embed-no-permission` | 70 | `E603` | permission.
`voice-turn-limit` | 71 | `E654` | quota.
`voice-cap-reached` | 71, S41 | `E655` | quota.
`pdf-too-many-pages` | 72, S42 | `E656` | quota.
`pdf-too-large` | 72, S42 | `E657` | quota.
`pdf-too-many-scanned` | 72, S42 | `E658` | quota.
`voice-restructure-slow` | 71, S41 | `E701` | model.
`voice-check-changed-words` | 71, S41 | `E702` | model.
`voice-not-english` | 71 | `E703` | model.
`pdf-vision-fallback` | 72, S42 | `E704` | model.
`voice-busy` | 71, S41 | `E756` | provider.
`voice-mic-denied` | 71, S41 | `E806` | network.
`voice-no-mic` | 71, S41 | `E807` | network.
`voice-mic-lost` | 71, S41 | `E808` | network.
`voice-offline` | 71, S41 | `E809` | network.
`pdf-ocr-offline` | 72, S42 | `E810` | network.
`pdf-doc-not-empty` | 72, S42 | `E852` | conflict.

**Why a microphone refusal is `network`, not `permission`.** `17` section 0.3 gives `permission` to
the product's own roles and tokens, and `network` to "the connection, the browser or the device". A
browser that blocks the microphone is the device.

## 6. Acceptance criteria, `A815` to `A847`

slug | scope | id.
`sheet-one-cell-one-line` | 68, S39 | `A815`.
`sheet-escaped-pipe` | 68 | `A816`.
`sheet-no-write-on-open` | 68, S39 | `A817`.
`sheet-deterministic` | 68, S39 | `A818`.
`sheet-download-neutralised` | 68 | `A819`.
`sheet-row-budget` | 68, S39 | `A820`.
`s39-view-never-writes` | S39 | `A821`.
`s39-no-a1` | S39 | `A822`.
`s39-summary-not-written` | S39 | `A823`.
`s39-decimal` | S39 | `A824`.
`board-move-one-line` | 69, S40 | `A825`.
`board-merge-clean` | 69 | `A826`.
`board-agent-proposes` | 69, S40 | `A827`.
`board-wip-never-blocks` | 69, S40 | `A828`.
`s40-ghost-not-counted` | S40 | `A829`.
`s40-filter-never-writes` | S40 | `A830`.
`s40-no-body-on-face` | S40 | `A831`.
`registry-no-drift` | 70 | `A832`.
`embed-edit-lands-on-source` | 70 | `A833`.
`embed-no-leak` | 70 | `A834`.
`mirror-csv-byte-identical` | 70 | `A835`.
`agent-cross-type-grouped` | 70 | `A836`.
`s41-no-auto-accept` | S41 | `A837`.
`s41-command-no-write` | S41 | `A838`.
`s41-audio-never-stored` | S41 | `A839`.
`s41-intent-not-words` | S41 | `A840`.
`s41-mic-only-while-held` | S41 | `A841`.
`s41-tone-greyed` | S41 | `A842`.
`s42-no-bytes-off-machine` | S42 | `A843`.
`s42-panel-one-item` | S42 | `A844`.
`s42-flags-not-written` | S42 | `A845`.
`s42-pdf-released` | S42 | `A846`.
`s42-no-chat` | S42 | `A847`.

## 7. Open decisions, `D16` to `D27`

slug | id.
`d-s39-sort-file` | `D16`.
`d-s39-phone-formula` | `D17`.
`d-s39-number-display` | `D18`.
`d-s40-columns` | `D19`.
`d-s40-own-move-queue` | `D20`.
`d-s40-panel-or-doc` | `D21`.
`d-s41-bar-slot` | `D22`.
`d-s41-tone-in-pill` | `D23`.
`d-s41-show-diff-first` | `D24`.
`d-s42-start-label` | `D25`.
`d-s42-source-value` | `D26`.
`d-s42-entry1-queue` | `D27`.

## 8. Events, in `55-MEASUREMENT-AND-EVENTS.md` section 6.14

slug | id.
`ev-sheet-cell-edited` | `sheet.cell.edited`.
`ev-sheet-refused` | `sheet.edit.refused`.
`ev-sheet-view-changed` | `sheet.view.changed`.
`ev-sheet-file-sorted` | `sheet.file.sorted`.
`ev-sheet-structure` | `sheet.structure.changed`.
`ev-sheet-formula-set` | `sheet.formula.set`.
`ev-sheet-plain-toggled` | `sheet.source.toggled`.
`ev-sheet-opened` | `sheet.opened`.
`ev-board-card-moved` | `board.card.moved`.
`ev-board-card-reordered` | `board.card.reordered`.
`ev-board-card-opened` | `board.card.opened`.
`ev-board-filtered` | `board.filter.applied`.
`ev-board-card-created` | `board.card.created`.
`ev-board-field-edited` | `board.field.edited`.
`ev-board-plain-toggled` | `board.source.toggled`.
`voice.turn.started` and the other voice events | unchanged, eight in all, `71` section 17.4.
`pdf.convert.started` and the other PDF events | unchanged, seven in all, `72` section 14.4.

## 9. Copy, in `16-COPY-DECK.md` section 14r

Every `new:k-s39-*`, `new:k-s40-*`, `new:k-s41-*` and `new:k-s42-*` slug became `K.s39.*` to
`K.s42.*` with hyphens turned to dots. The splits, where one slug held two strings:

slug | ids.
`k-s40-count` | `K.s40.count`, the card count and folder only; the key is `K.s40.groupedby`.
`k-s41-raw` | `K.s41.raw` and `K.s41.raw.show`.
`k-s41-command` | `K.s41.command` and `K.s41.command.target`.
`k-s41-set-cleanup` | `K.s41.set.cleanup` and `K.s41.set.cleanup.help`.
`k-s41-set-levels` | `K.s41.set.levels`, `K.s41.set.levels.help`, `K.s41.set.level.low`, `K.s41.set.level.medium`, `K.s41.set.level.high`.
`k-s41-set-key` | `K.s41.set.key` and `K.s41.set.key.help`.
`k-s42-start` | `K.s42.start` and `K.s42.start.sub`.
`k-s42-converting` | `K.s42.converting` and `K.s42.converting.where`.
`k-s42-legend` | `K.s42.legend.text`, `K.s42.legend.scanned`, `K.s42.legend.waiting`.
`k-s42-tool-title` | `K.s42.tool.title` and `K.s42.tool.sub`.
`k-s42-file-into` | `K.s42.file.into`, `K.s42.file.as`, `K.s42.file.button`.
`k-s42-keep-images` | `K.s42.keep.images` and `K.s42.keep.images.help`.

Three copy placeholders had no screen slug:

slug | id.
`k-sheet-download-notice` | `K.s18.sheet.download`.
`voice-first-use` | `K.s41.firstuse`.
`voice-insert-as-text` | `K.s41.insert.text`.

**The voice refusal strings** of `71` section 11 each took a `K.s41.err.*` row, and the PDF password
refusal took `K.s42.err.password`, because both specs quote the wording. The other new error rows
read `none yet` in their string column, as most rows in `17` do.

## 10. Configuration keys and call types

Placeholder | Id | Home.
`new:voice.cf.silenceThreshold` | `voice.cf.silenceThreshold` | `28` section 5.6.
`new:voice.upload.marginPct` | `voice.upload.marginPct` | `28` section 5.6.
`new:voice.commands.verbs` | `voice.commands.verbs` | `28` section 5.6.
`new:voice.timeout.transcribeMs` | `voice.timeout.transcribeMs` | `28` section 5.6.
`new:voice.transcribe` | `voice.transcribe` | `27` section 3.4.
`new:voice.restructure` | `voice.restructure` | `27` section 3.4.
`new:voice.classify` | `voice.classify` | `27` section 3.4.

**The duplication `71` section 17.1 asked the coordinator to settle.** `voice.chain.speech` and
`voice.chain.restructure` say what `routing.voice.transcribe.*` and `routing.voice.restructure.*`
say. `28` section 5.6 carries only the `routing.*` rows, as `71` recommends, because they match
`28` section 5.4's shape. `INFERENCE:` the recommendation is `71`'s, and `71` keeps its own
`voice.chain.*` rows until the founder confirms.

## 11. Code symbols, no register

Placeholder | Replaced by.
`new:sheet-parse` | `parseSheet`.
`new:sheet-evaluate` | `evaluateSheet`.
`new:board-project` | `projectBoard`.
`new:VoiceTranscribe` | `transcribeTurn`, the name `71` section 17.1 uses.
`new:VoiceRestructure` | `restructureTranscript`, the same.
`new:VoiceClassify` | `classifyUtterance`, the same.
`new:convertPdf` | `convertPdf`, the name `72` section 4 uses.

## 12. What was written where

Register | Rows added on 19 September.
`10-FEATURE-REGISTER.md` | `F281` to `F323` in section 2, and section 2a on where they came from.
`11-SCREEN-INDEX.md` | S39 to S42, and the new features added to nine existing screen rows.
`13-SCREEN-STATE-MATRIX.md` | Section 6.2, the pack view of S39 to S42.
`14-COMPONENT-INVENTORY.md` | `C155` to `C185` in both tables, and two notes in section 6.
`16-COPY-DECK.md` | Section 14r, 106 rows, and five namespaces in section 14q.
`17-ERROR-AND-REFUSAL-CATALOGUE.md` | 42 rows across the eight class blocks, and a note in section 0.4.
`19-ACCEPTANCE-CRITERIA.md` | Section 12d, `A815` to `A847`.
`27-MODEL-ROUTING-SPEC.md` | Section 3.4, four call types.
`28-CONFIGURATION-PANEL-SPEC.md` | Section 5.6, 27 rows, and three flags in section 6.
`53-PRICING-AND-ENTITLEMENTS.md` | Eight `limits.*` rows and two `features.*` rows, all proposed.
`55-MEASUREMENT-AND-EVENTS.md` | Section 6.14, 31 events.
`56-OPEN-DECISIONS.md` | `D16` to `D27` in the index, and section 5a.

**Two ids had no placeholder** and were added because a row needed a home: the event
`voice.turn.refused`, which the voice refusal rows of `17` cite, and the namespace `K.s41.err`.

## 13. Limits of this list

- **Not assessed:** whether every placeholder deserved an id. A proposal was allocated as written,
  so an id here says the thing is specified, not that it is agreed.
- **Plan cells are inference** for features the specs do not price. `10-FEATURE-REGISTER.md`
  section 2a lists which.
- **Not verified:** that no other writer allocated the same numbers in parallel. The highest ids
  were read at `1335518`; re-run `python3 docs/pack/tools/validate-pack.py`, which fails on an id
  cited without a home.
