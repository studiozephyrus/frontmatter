---
id: 15-INTERACTION-AND-KEYBOARD
title: Interaction and keyboard
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: f237ece
covers: [keyboard, focus-order, selection, undo, drag-and-drop, desktop-differences]
---

# 15. Interaction and keyboard

The keyboard map, focus order, the selection model, undo, drag and drop, and what differs between
the web app and the Tauri desktop build.

**Read the marking before the tables.** This repository ships a working editor, so some of this is
already true in code and some of it is a proposal for work not yet done. The two are never mixed in
one row.

Mark | Meaning | How to check it
`BUILT` | The binding exists in the shipped source, at the file and line given | Open the file; the line is cited
`DRAWN` | The binding is drawn on a screen in `docs/mvp0/screens/`, and is decided, but no code implements it | Open the screen file
`PROPOSED` | This document is proposing it. Nobody has decided it | Nothing to check; it needs a decision
`CONFLICT` | Two owners want the same chord, and section 4 says which wins | Section 4 gives the test

**Every `BUILT` row was read from the source tree at commit `f237ece` on 18 September 2026.** The
command that produced the list is in section 12.

---

## 1. The rules the map obeys

1. **One chord, one owner.** A chord with two owners is a defect, not a preference. Section 4 is the
   register, and it is not empty today.
2. **Nothing destructive is on a bare key.** Accept, reject, publish, delete and share all need a
   pointer or a modifier, because the product's whole claim is that nothing lands without a person
   saying so.
3. **Escape unwinds one layer, never two.** Section 5 gives the stack.
4. **Every chord has a visible twin.** No action is reachable only by keyboard. `[M]` Nielsen's
   direct manipulation rule, quoted at `docs/mvp0/PRODUCT-PLAN.md` section 16.
5. **The shortcut sheet is not a screen.** The founders removed it on 18 September:
   `docs/mvp0/PRODUCT-PLAN.md` section 5 reads "Shortcuts is gone." Settings keeps a Shortcuts section
   (S28), and that is the only place the list lives.
6. **No chord is taught by a tour.** `docs/mvp0/PRODUCT-PLAN.md` section 4: a tip appears on first hover
   of a control, once, and never as a walkthrough.

---

## 2. The global map

These are handled above the editor, on the window. Source:
`src/modules/app-shell/presentation/use-hotkey.ts`, whose `Combo` type today admits exactly three
values, and `src/modules/app-shell/presentation/KnowledgeUI.tsx:56` to `:58`.

Chord | What it does | Mark | Source or note
`Cmd/Ctrl + K` | Opens search over documents, ideas and shared pages | `BUILT` | `src/modules/app-shell/presentation/KnowledgeUI.tsx:56`, opens Spotlight. Drawn in the header field as the label `⌘K` (`docs/mvp0/screens/gen.mjs:641`)
`Cmd/Ctrl + P` | Opens the command palette | `BUILT` | `src/modules/app-shell/presentation/KnowledgeUI.tsx:57`. Takes the browser's print chord; see section 4, C2
`Cmd/Ctrl + G` | Opens the graph view | `BUILT` | `src/modules/app-shell/presentation/KnowledgeUI.tsx:58`. Collides with find-next inside the editor; see section 4, C1
`Cmd/Ctrl + J` | Opens the AI tools panel | `BUILT` | `src/modules/ai-tools/presentation/SgnkAiButton.tsx:143`
`Cmd/Ctrl + Shift + Space` | Quick capture into the inbox note | `DRAWN` | S26 draws the label `⌘⇧Space` (`docs/mvp0/screens/gen.mjs:1486`). Desktop only; a web page cannot claim a system-wide chord
`Cmd/Ctrl + Shift + P` | Publish or unpublish the open document | `PROPOSED` | Pairs with S17. Needs the confirm step of rule 2
`Cmd/Ctrl + /` | Toggle the problems panel (S10) | `PROPOSED` | Free of every binding in section 3
`Cmd/Ctrl + \` | Toggle the left tree | `PROPOSED` | Free. Matches the drawer behaviour on the phone
`Cmd/Ctrl + Shift + \` | Toggle the right rail | `PROPOSED` | Free
`Cmd/Ctrl + ,` | Open Settings (S28) | `PROPOSED` | The platform convention on macOS

**`use-hotkey.ts` needs one change before any `PROPOSED` row above is built.** Its `Combo` type is
the union `"mod+k" | "mod+p" | "mod+g"`, and it reads only the final segment of the string, so it
cannot express a modifier beyond Cmd or Ctrl. It also ignores `e.defaultPrevented`, which is the
mechanism behind conflict C1.

---

## 3. The editor map

Everything in this section is inside the CodeMirror 6 instance,
`src/modules/editor/presentation/CodeMirrorEditor.tsx`. The keymap array starts at line 222.

### 3.1 Ours, written for this product

Chord | What it does | Mark | Source
`Cmd/Ctrl + B` | Wrap the selection in `**` | `BUILT` | `src/modules/editor/presentation/CodeMirrorEditor.tsx:224`
`Cmd/Ctrl + I` | Wrap the selection in `*` | `BUILT` | `src/modules/editor/presentation/CodeMirrorEditor.tsx:225`
`Cmd/Ctrl + E` | Wrap the selection in a backtick | `BUILT` | `src/modules/editor/presentation/CodeMirrorEditor.tsx:226`
`Enter` | Continue a list, a task item or a quote | `BUILT` | `src/modules/editor/presentation/CodeMirrorEditor.tsx:228`, `insertNewlineContinueMarkup`
`Backspace` | Delete the list or quote marker as one unit | `BUILT` | `src/modules/editor/presentation/CodeMirrorEditor.tsx:229`, `deleteMarkupBackward`
`Tab` | Accept the ghost-text suggestion when one is showing | `BUILT` | `src/modules/editor/presentation/ghost-text.ts:79`, wrapped in `Prec.high`
`Escape` | Dismiss the ghost-text suggestion | `BUILT` | `src/modules/editor/presentation/ghost-text.ts:92`, wrapped in `Prec.high`
`Tab` | Indent, when no ghost text is showing | `BUILT` | `indentWithTab`, `src/modules/editor/presentation/CodeMirrorEditor.tsx:233`
`/` at the start of a word | Opens the slash menu | `BUILT` | `slash-commands.ts`, through `autocompletion`
`Escape` then `Cmd/Ctrl + Enter` | Commit an inline block edit in Live mode | `BUILT` | `src/modules/editor/presentation/live/InlineBlockEditor.tsx:62` and `:63`, both commit
`Cmd/Ctrl + Enter` | Send the prompt in the AI panel | `BUILT` | `src/modules/ai-tools/presentation/SgnkAiButton.tsx:481`
`Cmd/Ctrl + S` | Nothing. The document saves as you type | `PROPOSED` | Swallow it and show the saved pill rather than letting the browser open Save Page

### 3.2 Inherited from CodeMirror, and therefore already true

These arrive through the spread of four package keymaps at `src/modules/editor/presentation/CodeMirrorEditor.tsx:230` to `:236`.
They are listed because an agent reading only our own bindings would conclude the editor has no
undo, which is wrong.

Chord | What it does | Package | Verified in
`Cmd/Ctrl + Z` | Undo | `@codemirror/commands` 6.10.3 | `historyKeymap`, `dist/index.js:553`
`Cmd + Shift + Z`, or `Ctrl + Y` | Redo | `@codemirror/commands` 6.10.3 | `dist/index.js:554`
`Cmd/Ctrl + U` | Undo the last selection change only | `@codemirror/commands` 6.10.3 | `dist/index.js:556`
`Cmd/Ctrl + F` | Open the find panel | `@codemirror/search` 6.7.0 | `dist/index.js:1043`
`Cmd/Ctrl + G`, or `F3` | Find next. `Shift` finds previous | `@codemirror/search` 6.7.0 | `dist/index.js:1045`. See C1
`Cmd/Ctrl + D` | Select the next occurrence of the selection | `@codemirror/search` 6.7.0 | `dist/index.js:1049`
`Cmd/Ctrl + Alt + G` | Go to line | `@codemirror/search` 6.7.0 | `dist/index.js:1048`
`Escape` | Close the find panel | `@codemirror/search` 6.7.0 | `dist/index.js:1046`

**Find and replace is therefore already in the product.** That matters commercially: the plan counts
global find and replace as one of the three Obsidian requests worth the most
(`docs/mvp0/PRODUCT-PLAN.md` section 2). What exists today is per-document. Across a project it is a
build, not a binding.

### 3.3 Vim mode

`vim()` is loaded first in the extension array, as its own documentation requires, and is behind the
`vimMode` setting (`src/modules/editor/presentation/CodeMirrorEditor.tsx:193`, `src/modules/app-shell/presentation/SettingsModal.tsx:20`). **When it is on, it owns
every bare key in the editor and this section does not apply.** Global chords in section 2 still
work, because they are handled on the window.

---

## 4. Conflicts, and which owner wins

**This register is not empty, and two of its rows are live defects rather than design choices.**

### C1. `Cmd/Ctrl + G` opens the graph and finds the next match, both

- **Owners.** `useHotkey("mod+g", openGraph)` on the window (`src/modules/app-shell/presentation/KnowledgeUI.tsx:58`), and `findNext`
  inside the editor (`@codemirror/search` 6.7.0, `dist/index.js:1045`).
- **Why both fire.** CodeMirror calls `preventDefault` on its handler, but it does not stop the
  event bubbling to the window, and `use-hotkey.ts` does not test `e.defaultPrevented` before
  acting. `INFERENCE:` the sequence is read from the two sources and from the DOM event model; it
  has not been reproduced in a browser in this session.
- **Resolution.** The editor wins while it has focus. Find-next is the stronger convention and the
  one a person uses repeatedly.
- **The fix.** Add `if (e.defaultPrevented) return;` to `use-hotkey.ts`, and move the graph to a
  chord no package claims.
- **The check.** Focus the editor, open find, press the chord: the match advances and the graph does
  not open.
- **Severity.** `MEDIUM`. Nobody loses data; a person loses their place.

### C2. `Cmd/Ctrl + P` takes the browser's print chord

- **Owners.** The command palette (`src/modules/app-shell/presentation/KnowledgeUI.tsx:57`), and the browser's print dialogue.
- **Why it matters here.** Export to PDF is a named capability
  (`docs/mvp0/PRODUCT-PLAN.md` section 8), so print is not an idle chord in this product.
- **Resolution.** The palette keeps the chord, because it is what VS Code and Obsidian do and
  Jakob's law is the plan's stated tie-breaker (`docs/mvp0/PRODUCT-PLAN.md` section 16). The palette then
  carries a Print row, so the capability is never unreachable.
- **The check.** The palette opens, and typing `print` finds a row that prints.
- **Severity.** `LOW`.

### C3. `Tab` is both accept-suggestion and indent

- **Resolution, and it is already correct in code.** `src/modules/editor/presentation/ghost-text.ts:76` wraps its keymap in
  `Prec.high`, so the accept handler runs first and returns `false` when no suggestion is showing,
  at which point `indentWithTab` indents.
- **The check.** With ghost text off in Settings, `Tab` indents. With a suggestion showing, `Tab`
  accepts it once and indents on the next press.
- **Severity.** None. Recorded so a later refactor does not drop the `Prec.high`.

### C4. `Escape` has seven owners

Listed in section 5. No single owner is wrong; the defect would be two of them firing at once.

### C5. Vim mode against the editor map

`Cmd/Ctrl + B` and its siblings survive, because they carry a modifier. Bare `Enter` and `Backspace`
do not, and vim's own handling takes them. **This is correct and needs no fix**, but it means
section 3.1's bare-key rows are false while vim mode is on. Any test of those rows pins
`vimMode: false`.

---

## 5. Escape, as a stack

**Escape closes exactly one layer, the topmost one.** Owners, innermost first. Every row is `BUILT`.

Order | Layer | Source
1 | The ghost-text suggestion | `src/modules/editor/presentation/ghost-text.ts:92` (`Prec.high`)
2 | An inline block editor in Live mode | `src/modules/editor/presentation/live/InlineBlockEditor.tsx:62`
3 | The find panel | `@codemirror/search`, `dist/index.js:1046`
4 | A context menu on the tree | `src/modules/vault/presentation/file-tree/ContextMenu.tsx:21`
5 | A confirm dialogue or an inline rename | `src/modules/vault/presentation/file-tree/ConfirmDialog.tsx:14`, `src/modules/vault/presentation/file-tree/InlineDialog.tsx:35`
6 | The command palette, the search panel, Spotlight, the AI panel, the export menu, the link doctor, the graph | `src/modules/app-shell/presentation/CommandPalette.tsx:273`, `src/modules/app-shell/presentation/SearchPanel.tsx:165`, `src/modules/app-shell/presentation/Spotlight.tsx:92`, `src/modules/ai-tools/presentation/SgnkAiButton.tsx:146`, `src/modules/export/presentation/ExportMenu.tsx:69`, `src/modules/app-shell/presentation/LinkDoctorModal.tsx:57`, `src/modules/graph/presentation/GraphView.tsx:186`
7 | Nothing. Escape in a plain editor does nothing | by omission

**Escape never discards typed text.** Cancelling a properties edit
(`src/modules/preview/presentation/PropertiesPanel.tsx:208`) or a table cell edit
(`src/modules/preview/presentation/markdown/editable-table.tsx:65`) reverts that field to its stored value, and
the document is untouched.

**Escape never rejects a change-queue item.** Rejecting is a decision and takes a click. This is
rule 2 of section 1, applied to the one screen where it matters most (S20).

---

## 6. Focus order

`PROPOSED` for every screen except where a row says otherwise. Nobody has audited the shipped tab
order, so this is a specification and not a description.

### 6.1 What holds focus on arrival

Screen | On arrival, focus sits on | Why
S01 Sign in | Continue with Google | One tap is the promise. `Tab` then reaches GitHub
S02 Home, first time | The first start card, Blank document | Hick's law, the highlighted choice
S03 Home | The search field | A returning person is looking for something
S04 Workspace | The editor, at the caret position the file was left at | Apple's restore-state rule, `docs/mvp0/PRODUCT-PLAN.md` section 5
S06 AI box | The prompt field | The box exists to be typed into
S10 Problems | The first problem row | Arrow keys then walk the list
S12 Ideas | The idea field | Same reason as S06
S13, S14 Idea questions | The first unanswered option of the first card | Never the Skip control
S17 Share | The person field | The common case is adding a person
S20 Review | The first waiting item | Never on Accept all
S31 Conflict | Neither version | A conflict must not have a default. Focus sits on the heading
S33 Over the cap | The dismiss control, not Move to Pro | A wall that focuses its own upsell is a dark pattern
S35 to S38 Configuration | The search or the first row, never a value field | A founder panel must not take an edit from a stray keystroke

### 6.2 Tab order in the workspace, S04

One pass, left to right, top to bottom, with the regions as tab stops rather than every control.

1. Skip to content, visually hidden until focused.
2. The menu control, then the mark.
3. The tab strip. Left and right arrows move between tabs; `Tab` leaves the strip.
4. The left rail: the tree head, the tree, then Add file and Add idea.
5. The toolbar, as one stop. Arrow keys walk the twelve buttons.
6. The mode segment: Edit, Live, Reading, Split.
7. The editor.
8. The right rail's collapsed rows, then the outline, then the AI edit control.

**The tree and the toolbar are each one tab stop, not fifteen.** A person tabbing to the editor
should not walk every file first.

---

## 7. The selection model

Level | What a selection is | What acts on it
Character and line | A CodeMirror range | Bold, italic, code, the AI verbs, indent
Block | The byte range of one markdown block | An inline block edit in Live mode, `live/block-split.ts`
Multiple ranges | CodeMirror supports several; `Cmd/Ctrl + D` creates them | Wrapping applies to each
File | One or more rows in the tree | Rename, move, delete, drag
Change | One item in the queue on S20 | Accept, Reject, Reply

**Four rules.**

1. **An AI verb reads the selection and nothing else** when there is one. With no selection it reads
   the note. The menu says which: "Refine selection / note"
   (`src/modules/editor/presentation/AIMenu.tsx:248`).
2. **A multi-range selection is refused by anything that splices**, rather than applied to the first
   range. Guessing which range a person meant is the same class of error the engine exists to
   refuse.
3. **A selection survives an accepted AI edit**, and covers the replacement text, so a second verb
   can be applied without reselecting.
4. **Selecting is never an action.** Nothing is sent to a model, saved or published by selecting.

---

## 8. Undo

### 8.1 What is in the undo stack

In | Out
Typing, deleting, pasting | A change that arrived from another person in a live session
Toolbar and slash-menu insertions | A change written by a panel while the editor had focus
Accepting or rejecting an AI suggestion | A change queue accept, which is a version, not an edit
Indent, list continuation, marker deletion | A file rename, move or delete
Fix all safe on S10, as one entry | A publish, a share or a plan change

**The second row of the Out column is enforced in code today.** A panel edit dispatches with
`Transaction.addToHistory.of(false)` (`src/modules/editor/presentation/CodeMirrorEditor.tsx:315`), with the reason written beside
it: the undo stack stays about the person's own keystrokes.

### 8.2 The rules

1. **Undo is per document.** Each open tab has its own stack. Switching tabs does not merge them.
2. **Undo never crosses a save.** A save is a new immutable version
   (`docs/mvp0/PRODUCT-PLAN.md` section 17), and going further back is History (S21), not undo.
3. **Undo is not a network operation.** It works offline, on the local buffer.
4. **An accepted AI edit is one undo step**, not one per changed word.
5. **A live session does not undo another person's typing.** `PROPOSED`, and it is the hard case:
   Yjs holds the shared state (`docs/mvp0/PRODUCT-PLAN.md` section 15), so undo must be scoped to the
   local client's own changes. Until that is built and red-proofed, **live editing and undo have
   not been tested together**, and this document says so rather than implying they compose.
6. **Nothing that leaves the machine is undoable.** Publishing, sharing and pushing to GitHub are
   reversed by their own controls, and the copy says so rather than offering undo.

---

## 9. Drag and drop

Drag | Drop target | What happens | Mark | Source
A tree row | A folder row, or the tree background | The file moves. MIME type `application/x-sgnk-path` | `BUILT` | `src/modules/vault/presentation/file-tree/TreeItem.tsx:272` to `:277`, `src/modules/vault/presentation/FileTree.tsx:159` to `:170`
An image file from the desktop | The editor | The image uploads and a markdown image link is inserted at the drop point | `BUILT` | `src/modules/editor/presentation/CodeMirrorEditor.tsx:409` to `:417`, `extractImageFiles`
Any file | Anywhere in the workspace | Imports into the current project | `DRAWN` | The drop hint is always visible in the left rail, `docs/mvp0/screens/gen.mjs:665`: "Drop files or a folder anywhere"
A folder | Anywhere in the workspace | Imports and keeps its structure, becoming a project | `DRAWN` | S22, `docs/mvp0/screens/gen.mjs:1410`
A tab | The tab strip | Reorder | `PROPOSED` | Not built
A tab | The other half of a split | Open there | `PROPOSED` | Not built
A change-queue item | Anything | Nothing. Items are not draggable | `PROPOSED` | Stated so nobody adds it

**Five rules.**

1. **A drag has a drop indicator before the drop.** `dropEffect` is set to `"move"` on the tree
   today (`src/modules/vault/presentation/file-tree/TreeItem.tsx:119`), which gives the cursor but not a line in the tree.
2. **A drop that would overwrite refuses and asks.** Renaming on collision without asking is a
   silent merge by another name.
3. **A folder drop never flattens.** Structure is the reason a person dragged a folder.
4. **A drop of 2,000 files shows progress past ten seconds** and stays cancellable. The target is in
   `docs/mvp0/PRODUCT-PLAN.md` section 21: under two minutes, byte-exact.
5. **Dragging out of frontmatter is an export**, never a move. The copy that leaves is a copy.

---

## 10. Web against desktop

The desktop build is Tauri v2 from the same source tree (`src-tauri/`).

What | Web | Desktop | Note
Global capture chord | Not available | `Cmd/Ctrl + Shift + Space` | A web page cannot register a system-wide chord. S26 and `docs/mvp0/screens/gen.mjs:1486`
The application menu bar | None | Native, and it is the second home of every chord in section 2 | `PROPOSED`
`Cmd/Ctrl + P` | Taken by the palette, C2 | Free, because the shell owns printing | The conflict is web-only
`Cmd/Ctrl + W`, `Cmd + Q` | The browser's, and unreachable | The window and the application | Never rebind these
Files | In the cloud, with a local draft | On disk, and the tree shows both roots | S25, `docs/mvp0/screens/gen.mjs:1467`
Document cap | 50 on Free | None | `docs/mvp0/PRODUCT-PLAN.md` section 5
AI when offline | Disabled, with a reason | A local model runs the edit | S24, `docs/mvp0/screens/gen.mjs:1462`
Drag from the operating system | Files only, through the browser | Files and folders, including a watched folder | The watched folder is `PROPOSED`; it is named in `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:262`
Protocol handler | None | Registered, which is what lets S18 offer Open in the app | `docs/mvp0/screens/gen.mjs:1331`

**One rule covers the whole table.** A chord that exists on both platforms does the same thing on
both. Where a platform cannot offer one, the control is still reachable by pointer, and the copy
says which platform it needs rather than showing a dead control.

---

## 11. The phone

**No keyboard map.** The phone has a bottom bar of five actions at thumb height: Home, Search, AI,
Outline, More (`docs/mvp0/screens/gen.mjs:744`). `[M]` Material's rule for compact width, quoted at
`docs/mvp0/PRODUCT-PLAN.md` section 12.

- The tree is a left drawer, the right rail a right drawer (`docs/mvp0/screens/gen.mjs:752`).
- An external keyboard on a tablet gets the section 3 map, because the editor is the same
  CodeMirror instance. `UNVERIFIED:` nobody has tested this product with an iPad keyboard. Needs:
  an iPad with a hardware keyboard, running the section 3 checks in Safari.
- **Long-press replaces right-click.** The context menu of `ContextMenu.tsx` needs a touch path,
  and does not have one today. `PROPOSED`.

---

## 12. How this file was produced, and how to re-derive it

```bash
git rev-parse --short HEAD                                   # f237ece
grep -rn 'key: "Mod-\|metaKey\|ctrlKey' src/                 # every binding in our own code
grep -n -A 8 "^const historyKeymap" node_modules/@codemirror/commands/dist/index.js
grep -n -A 10 "const searchKeymap" node_modules/@codemirror/search/dist/index.js
grep -n "onDrop\|onDragStart\|dataTransfer" src/             # drag and drop
```

Every `BUILT` row above came out of those five commands on 18 September 2026. Re-run them before
trusting this file at a later commit.

---

## 13. What this must never do

- **Never put Accept, Reject, Accept all, Publish, Share or Delete on a bare key.**
- **Never let a chord write to a file without a visible result.** Rule 4 of section 1.
- **Never make Escape discard typed text.**
- **Never bind `Cmd + Q`, `Cmd/Ctrl + W`, `Cmd/Ctrl + T`, `Cmd/Ctrl + N` or the browser's tab
  chords.** They belong to the platform and a person will lose work to them.
- **Never show a chord in the interface that is not in this file.** The copy deck carries the
  labels; this file carries the truth.
- **Never ship a keyboard-only path.** WCAG 2.2 AA is the target
  (`docs/mvp0/PRODUCT-PLAN.md` section 16), and so is the reverse: no pointer-only path either.

---

## 14. Open questions

All four were resolved on 18 September as proposals. Each is `resolved (proposed 18 Sep, founder review)`.

Id | Question | Resolution | Rejected, and the evidence
`D-KB-1` | Does the graph keep `Cmd/Ctrl + G`, or move? | **It loses its chord.** The graph opens from the command palette (`Cmd/Ctrl + P`) and from its button, and `use-hotkey.ts` gains the `e.defaultPrevented` test of C1 | Rejected: `Mod-Shift-g` and `Mod-Alt-g`. `[O]` `node_modules/@codemirror/search/dist/index.js:1038` and `:1048` bind them to find-previous and go-to-line. Every chord on G is taken
`D-KB-2` | Does Vim mode survive MVP 0? | **Yes, off by default, behind the `vimMode` setting as today.** Tests of bare keys pin `vimMode: false` (C5) | Rejected: removing it. It is built, and decision D02 (`56-OPEN-DECISIONS.md` section 0) builds everything in batches rather than cutting
`D-KB-3` | How does undo behave in a live session? | **Each person undoes only their own changes**, through a `Y.UndoManager` whose `trackedOrigins` holds only the local editor's origin | Rejected: one shared undo stack, which undoes a collaborator's typing. `[M]` `https://docs.yjs.dev/api/undo-manager`, opened 2026-09-18: `By default, all local changes that don't specify a transaction origin will be tracked`
`D-KB-4` | Is there a Doc mode keyboard map distinct from markdown mode? | **Yes. Doc mode adds Google Docs' paragraph chords**, each written to the file as markdown by a splice: `⌘ + Shift + 7` numbered list, `⌘ + Shift + 8` bullets, `⌘ + Shift + 9` checklist, `⌘ + Option + [1-6]` headings, `⌘ + Option + 0` normal text | Rejected: one map for both modes, which makes Doc mode feel foreign to a Docs user. `[M]` `https://support.google.com/docs/answer/179738`, opened 2026-09-18. `[O]` none of the five is bound in `node_modules/@codemirror/*`. Browser-level collisions were not checked

Each of these belongs in `56-OPEN-DECISIONS.md` and should take a `D` number there. The `D-KB`
prefix is local to this file and is not an identifier under `65-CONVENTIONS.md` section 3.

---

## 15. Limits of this document

- **What was not assessed.** The shipped tab order was never walked with a keyboard. Section 6 is a
  specification, not a description, and it may already be wrong about what the code does.
- **What could not be verified.** C1 is read from two sources and the DOM event model, not
  reproduced in a browser. No screen reader was run. No tablet keyboard was tested.
- **What is not established.** Every `PROPOSED` row. That is most of section 2 and all of section 6.
- **What would falsify it.** A different commit. Six of the `BUILT` rows come from package versions
  pinned today (`@codemirror/search` 6.7.0, `@codemirror/commands` 6.10.3); a bump can change them
  without touching our source.
- **One disagreement between sources, recorded rather than resolved.**
  `docs/mvp0/PRODUCT-PLAN.md` section 5 says Shortcuts is gone from the workspace, while S28's Settings
  list keeps a Shortcuts section (`docs/mvp0/screens/gen.mjs:1512`). Both are right: the panel went, the settings
  section stayed. Anyone reading only the first line would delete the wrong thing.
