---
id: component-reconciliation
title: Component id reconciliation, screens against the inventory
mode: reference
tier: derived
status: living
updated: 2026-09-18
owner: sagnik
generated_by: python3 extract.py and build.py, session scripts, reproduced in section 5
---

# Component id reconciliation

The working file for one defect. The 38 screen specs in `docs/pack/12-screens/` and
`docs/pack/14-COMPONENT-INVENTORY.md` were written in parallel, and each invented component ids on
its own. This file records every `C` token in every screen, what the screen says it is, and which
inventory id it becomes.

**The machine-readable result is `docs/pack/tools/component-map.json`.** It is keyed by screen, then
by the id as written on that screen, and it is total: every `C` token in every screen has an entry,
identity entries included.

## 1. What was found

- **Most screens allocated a private block.** S01 to S13 each took `C` plus the screen number plus
  one digit (S04 took `C040` to `C049`). S14 to S26 knew the inventory and reused its ids, then
  opened a private block from `C300` upward. S27 to S38 took `C270` to `C389`, plus a shared
  `C900` block.
- **The private blocks overlap the inventory and each other.** S04's `C040` is the app header; the
  inventory's `C040` is `BookmarksPanel`. S14 opened its block at `C300`, which S30 also reserved.
  S35's `C902` is a pending-changes bar; S36's and S37's `C902` is a switch.
- **So the same token means different things on different screens.** That is why the map is keyed
  by screen and not by id alone.

## 2. How each decision was made

Decision | Meaning
`identity` | The screen already means the inventory's component under that id
`existing` | The screen means an inventory component that carries another id
`new` | No inventory row fits, so a row was added at `C125` or above
`collision` = yes | The screen's id is inside `C001` to `C124` and means something other than the inventory row with that id

Rules applied, in order:

1. **The inventory wins.** An id already in it is never renumbered.
2. **A region inside a component takes the component's id.** A severity dot takes the problem
   row's id; a ruler takes the paper surface's id.
3. **One visual thing is one component, wherever it is drawn.** A tab strip, a tree, a toast, a
   drawer, a sheet, a primary button, a mode bar: one id each, across every screen.
4. **Plain text is not a component, but the map must be total.** Every foot line, fine-print line,
   explainer and honesty note maps to one new primitive, `C130` `Note`. Every page title maps to
   `C131` `PageHeading`.
5. **Where a screen used one id for two different regions**, the map cannot split them, because it
   is keyed by screen and id. Those cases are listed in section 4 for a hand fix.

## 3. Every C token in every screen, and where it goes

Screen | id on the screen | where | what the screen says it is | decision | inventory id | collision | why
--- | --- | --- | --- | --- | --- | --- | ---
S01 | C010 | Anatomy L58 | Page frame: Two columns, card left, preview right | existing | C022 | yes | The page frame of the sign-in screen is the LoginScreen composition, two columns
S01 | C011 | Anatomy L59 | Sign-in card: Mark, heading, promise, buttons, fine print | existing | C022 | yes | The sign-in card is the body of LoginScreen, not a separate component
S01 | C012 | Anatomy L60 | Product mark: The `fm` mark at card size | existing | C071 | yes | The fm mark at card size is BrandMark, mark form
S01 | C013 | Anatomy L61 | Heading and promise: `K.s01.heading`, `K.s01.promise` | new | C131 | yes | A heading and one promise line is PageHeading
S01 | C014 | Anatomy L62 | Provider buttons: Two, stacked, Google first | existing | C022 | yes | The stack of two provider buttons is layout inside LoginScreen
S01 | C015 | Anatomy L63 | Google button: Real Google mark plus `K.s01.google` | existing | C023 | yes | The Google button is GoogleSignInButton, which exists
S01 | C016 | Anatomy L64 | GitHub button: Real GitHub mark plus `K.s01.github` | new | C154 | yes | GitHub sign-in is drawn inline in LoginScreen.tsx today; a separate button is implied
S01 | C017 | Anatomy L65 | Fine print: `K.s01.fineprint` and four links | new | C130 | yes | Fine print with links is Note, fine-print variant
S01 | C018 | Anatomy L66 | Preview column: A static editor frame with one document, then three value cells | existing | C022 | yes | The static preview column is the right half of LoginScreen; not interactive
S01 | C019 | Anatomy L67 | Phone frame: The card alone, on the themed surface | existing | C086 | yes | The phone form of the screen is PhoneFrame
S02 | C020 | Anatomy L58 | Page frame: The whole home surface, and the drop target | new | C153 | yes | The home surface as a whole is a new HomeScreen composition, shared by S02 and S03
S02 | C021 | Anatomy L59 | Home header: Mark, wordmark, search, settings, theme, avatar | existing | C076 | yes | The home header is TopBar in its home variant (homeTop() in the generator)
S02 | C022 | Anatomy L60 | Wordmark: `frontmatter`, spelled out | existing | C071 | yes | The spelled-out wordmark is BrandMark, wordmark form
S02 | C023 | Anatomy L61 | Greeting: `K.s02.greeting` | new | C131 | yes | The greeting is the page heading of home
S02 | C024 | Anatomy L62 | Tabs: Documents, Ideas, Shared with me | existing | C065 | yes | Documents, Ideas, Shared with me switch views, so they are Segment as a tablist
S02 | C025 | Anatomy L63 | Start grid: Five cards, each an icon, a title and one line | existing | C089 | yes | The start grid is StartCards
S02 | C026 | Anatomy L64 | Recent table head: Recent, Project, Opened, Owner | existing | C090 | yes | The recent table head is part of RecentList
S02 | C027 | Anatomy L65 | Empty state: `K.s02.empty`, then `K.s02.caps` | existing | C090 | yes | The empty state replaces the rows inside RecentList
S02 | C028 | Anatomy L66 | Global search: `K.s02.search` with the Command K hint | existing | C008 | yes | The global search field is the entry to SearchPanel, the overlay it opens
S02 | C029 | Anatomy L67 | Phone frame: Four start cards, the tabs, the empty line | existing | C086 | yes | The phone form is PhoneFrame
S03 | C020 | Anatomy L56 | Page frame: The home surface, and the drop target | new | C153 | yes | Shared with S02, HomeScreen
S03 | C021 | Anatomy L57 | Home header: Mark, wordmark, wide search, settings, theme, avatar | existing | C076 | yes | Shared with S02, TopBar home variant
S03 | C025 | Anatomy L61 | Start grid: The same five cards as S02 | existing | C089 | yes | Shared with S02, StartCards
S03 | C028 | Entry and exit L50 | Leave, Search / `C028` or Command K / search overlay across documents, ideas and shared pages / global | existing | C008 | yes | The search field of S02, the entry to SearchPanel
S03 | C030 | Anatomy L58 | Greeting row: `K.s03.greeting`, then the usage pill on the right | new | C131 | yes | The greeting row is PageHeading, with the usage pill beside it
S03 | C031 | Anatomy L59 | Usage pill: `cloud_done` icon, documents used against the cap | existing | C064 | yes | The usage pill is Pill, read not pressed
S03 | C032 | Anatomy L60 | Tabs: Documents, Ideas with a count, Shared with me with a count | existing | C065 | yes | The same tabs as S02, Segment, now with counts
S03 | C033 | Anatomy L62 | Recent table: Head row, then one row per document | existing | C090 | yes | The recent table is RecentList
S03 | C034 | Anatomy L63 | Recent row: Name with a file icon, project, opened, owner, menu | existing | C090 | yes | A recent row is a row of RecentList
S03 | C035 | Anatomy L64 | Row menu: Per-document actions | existing | C055 | yes | The per-row menu is ContextMenu
S03 | C036 | Anatomy L65 | Phone frame: Tabs, four cards, a stacked list | existing | C086 | yes | The phone form is PhoneFrame
S03 | C039 | preamble L22 | > scheme derived from the screen number: components `C030` to `C039`, errors `E030` to `E039`, acceptance `A030` to `A039`. A component owned by another screen | new | C131 | yes | Range marker in the preamble; the first id used in the block, C030, maps here
S04 | C040 | Anatomy L76 | App header: Menu, the `fm` mark, then the right cluster | existing | C076 | yes | The app header is TopBar; later screens S14 to S26 cite it as C076
S04 | C041 | Anatomy L77 | Tab strip: One tab per open file, plus a new-tab control | existing | C078 | yes | The tab strip is TabStrip; S25 cites it as C078
S04 | C042 | Anatomy L78 | Left rail: Tree head, project groups, Ideas, the drop hint, the two buttons, the sync foot | existing | C083 | yes | The left rail with tree, Ideas and the two buttons is LeftRail; S15 onward cite C083
S04 | C043 | Anatomy L79 | Toolbar row: Twelve tools, then the right-hand cluster | existing | C077 | yes | The toolbar row drawn by modebar() is ModeBar; S15 onward cite C077 for the same row
S04 | C044 | Anatomy L80 | Document surface: The editor | existing | C025 | yes | The document surface is EditorPane; S20, S24, S25 cite C025 for it
S04 | C045 | Anatomy L85 | Phone frame: Header with the mode segment, seven tools, the document, two drawers | existing | C086 | yes | The phone form is PhoneFrame
S04 | C046 | Anatomy L81 | Add file: A primary button with a chevron, opening its menu | new | C125 | yes | Add file is a primary button with a menu and the only home of upload: new AddFileMenu
S04 | C047 | Anatomy L82 | Add idea: A secondary button | existing | C061 | yes | Add idea is a secondary Button
S04 | C048 | Anatomy L83 | Ideas section: A collapsed group at the foot of the tree, with a count | existing | C104 | yes | The collapsed Ideas group at the foot of the tree is IdeaList, collapsed
S04 | C049 | Anatomy L84 | Right rail: Four collapsible rows at the top, then the outline, then the foot | existing | C035 | yes | The right rail is RightPane; S25 cites C035 for it
S05 | C040 | Anatomy L71 | App header: As S04, plus presence avatars when someone else is here | existing | C076 | yes | Shared with S04, TopBar with presence
S05 | C041 | Anatomy L72 | Tab strip: As S04 | existing | C078 | yes | Shared with S04, TabStrip
S05 | C042 | Anatomy L73 | Left rail: As S04 | existing | C083 | yes | Shared with S04, LeftRail
S05 | C043 | Anatomy L75 | Doc toolbar / `C050` / The Google-Docs-shaped row / `.docbar` at `docs/mvp0/screens/gen.mjs:695`; replaces `C043` in this mode. Holds the inline marks, the list tools, the insert tools, the Suggesting pill and both mode | existing | C077 | yes | Cited as the S04 toolbar row the Doc toolbar replaces, ModeBar
S05 | C045 | Anatomy L74 | Phone frame: The paper on the subtle background, at 14 px | existing | C086 | yes | Shared with S04, PhoneFrame
S05 | C050 | Anatomy L75 | Doc toolbar: The Google-Docs-shaped row | existing | C079 | yes | The Google-Docs-shaped row is DocToolbar
S05 | C051 | Anatomy L76 | Style selector: Normal text, and the heading levels | new | C126 | yes | Normal text and heading levels is a named value opening a short list: new Select
S05 | C052 | Anatomy L77 | Face selector: **Four faces, named** | new | C126 | yes | Four named faces, the same Select
S05 | C053 | Anatomy L78 | Size stepper: Minus, a number, plus | new | C127 | yes | Minus, a number, plus: new Stepper
S05 | C054 | Anatomy L79 | More: Colour, highlight, alignment | existing | C055 | yes | More opens a menu of colour, highlight, alignment: ContextMenu, below-anchored
S05 | C055 | Anatomy L80 | Scope toast: The once-only explanation | existing | C058 | yes | The once-only scope explanation is Toast
S05 | C056 | Anatomy L81 | Ruler: Column marks across the page width | existing | C080 | yes | The ruler is decorative and part of PaperSurface, whose contract already says so
S05 | C057 | Anatomy L82 | Paper surface: The page, and the document rendered on it | existing | C080 | yes | The paper is PaperSurface
S05 | C058 | Anatomy L83 | Comment margin: One card per thread, beside its highlighted anchor | existing | C081 | yes | The comment margin is CommentMargin
S05 | C059 | Anatomy L84 | Properties panel: The front matter, editable, nested keys included | existing | C041 | yes | The front matter panel is PropertiesPanel; the screen asks for nested YAML it does not yet edit
S06 | C049 | Entry and exit L58 | Arrive, rail / AI edit in `C049` on S04 / the box, over the workspace / no route change, as Notion's does | existing | C035 | yes | Cited as the S04 right rail, RightPane
S06 | C060 | Anatomy L71 | Box shell: The whole panel, over the workspace | existing | C091 | yes | The box shell is AIBox
S06 | C061 | Anatomy L72 | Target line: An icon, the target in words, the named file or idea, and Change | existing | C092 | yes | The target line is AITargetLine
S06 | C062 | Anatomy L73 | Input row: The prompt field and the send control | new | C128 | yes | The prompt field and send control: new PromptInput, shared with S12, S26, S34
S06 | C063 | Anatomy L74 | Intent chips: Four common asks, one selected | identity | C063 |  | Intent chips are Chip; the local id happens to match the inventory
S06 | C064 | Anatomy L75 | Start-from chips: Or start from: GitHub, a drop, a template | existing | C063 | yes | Start-from chips are Chip, labelled variant
S06 | C065 | Anatomy L76 | Cost foot: What this costs, what is left, and where to get more | new | C129 | yes | What this costs and what is left, read live: new CreditNote
S06 | C066 | Anatomy L77 | Anchor: The placement rule, below or to the right | existing | C091 | yes | The anchor is placement behaviour of AIBox, not drawn
S06 | C067 | Anatomy L78 | Pinned idea context: The idea line when an idea is in progress | existing | C092 | yes | The pinned idea line is AITargetLine, pinned state
S06 | C068 | Anatomy L79 | Result and decision: The proposal, with Accept and Reject of equal weight | existing | C093 | yes | The proposal with Accept and Reject of equal weight is InlineSuggestion
S06 | C069 | Anatomy L80 | Phone sheet: The same box as a bottom sheet | existing | C068 | yes | The phone form of the box is Sheet
S07 | C043 | Anatomy L65 | Suggesting pill / `C077` / The toolbar's state while a suggestion is live / `.pill.ai` in `C043` | existing | C077 | yes | Cited as the S04 toolbar row carrying the Suggesting pill, ModeBar
S07 | C070 | Anatomy L58 | Verb menu: Seven verbs, then a foot | existing | C028 | yes | The seven-verb menu is AIMenu
S07 | C071 | Anatomy L59 | Menu item: A verb, then one line of what it does | existing | C028 | yes | A menu item is a row of AIMenu
S07 | C072 | Anatomy L60 | Menu foot: The cost, the credits left, and the provider this month | new | C129 | yes | The menu foot with cost, credits left and provider is CreditNote
S07 | C073 | Anatomy L61 | Selection highlight: The chosen range, marked in the document | existing | C026 | yes | The selection highlight is a decoration the CodeMirror editor draws
S07 | C074 | Anatomy L62 | Removed span: The original text, marked as going | existing | C093 | yes | The removed span is part of InlineSuggestion
S07 | C075 | Anatomy L63 | Proposed span: The suggested text, marked as coming | existing | C093 | yes | The proposed span is part of InlineSuggestion
S07 | C076 | Anatomy L64 | Decision pair: Accept and Reject, side by side | existing | C093 | yes | Accept and Reject side by side is part of InlineSuggestion
S07 | C077 | Anatomy L65 | Suggesting pill: The toolbar's state while a suggestion is live | existing | C064 | yes | The Suggesting pill is Pill
S07 | C078 | Anatomy L66 | Phone sheet: The same seven verbs, as a sheet | existing | C068 | yes | The phone form of the menu is Sheet
S07 | C079 | Anatomy L67 | Refusal notice: Why a range could not be spliced | new | C132 | yes | Why a range could not be spliced, in place and never a toast: new RefusalNotice
S08 | C043 | Entry and exit L43 | Arrive / the Split mode in `C043` / this layout, same file / a mode, not a route | existing | C077 | yes | Cited as the S04 toolbar row whose mode segment picks Split, ModeBar
S08 | C080 | Anatomy L52 | Split frame: Two panes and a draggable gutter | existing | C025 | yes | The split frame is EditorPane in its split variant
S08 | C081 | Anatomy L53 | Source pane: The raw markdown, with the fence info strings highlighted | existing | C026 | yes | The source pane is the raw file, CodeMirrorEditor
S08 | C082 | Anatomy L54 | Rendered pane: The same bytes, drawn | existing | C034 | yes | The rendered pane is Markdown
S08 | C083 | Anatomy L55 | Table block: A GitHub-flavoured table, with column alignment | existing | C045 | yes | The table block is EditableTable
S08 | C084 | Anatomy L56 | Chart block: A fenced `fm-chart` block that points at the table above it | existing | C102 | yes | The chart block is ChartBlock
S08 | C085 | Anatomy L57 | Mermaid block: A fenced `mermaid` block | existing | C043 | yes | The mermaid block is MermaidBlock
S08 | C086 | Anatomy L58 | Callout block: A `> [!kind]` callout | existing | C044 | yes | The callout is CalloutBox
S08 | C087 | Anatomy L59 | Maths: Inline and display maths, in KaTeX | existing | C034 | yes | Maths already renders inside Markdown through remark-math and rehype-katex, so no new component
S08 | C088 | Anatomy L60 | Elsewhere note: One paragraph saying what each block becomes in other tools | new | C130 | yes | One paragraph on what each block becomes elsewhere is Note
S08 | C089 | Anatomy L61 | Drawing block: An `fm-draw` block pointing at a stored drawing | existing | C103 | yes | The drawing block is DrawingBlock
S09 | C043 | Anatomy L63 | View selector / `C090` / Six views, each with one line of what it does / `.pop` with `.mi.row2`; lives on `C043` | existing | C077 | yes | Cited as the S04 toolbar row that carries View as, ModeBar
S09 | C090 | Anatomy L63 | View selector: Six views, each with one line of what it does | existing | C097 | yes | The six-view selector is ViewAsMenu
S09 | C091 | Anatomy L64 | Flow board: The phases, side by side, scrolling sideways | existing | C098 | yes | The flow board is FlowCanvas
S09 | C092 | Anatomy L65 | Phase column: A title, a meta line, and one line of what the phase is for | existing | C098 | yes | A phase column is part of FlowCanvas
S09 | C093 | Anatomy L66 | Step card: A name, an optional tag badge, a body and a reference | existing | C098 | yes | A step card is part of FlowCanvas
S09 | C094 | Anatomy L67 | Tag badge: The bracketed first word, upper case | existing | C064 | yes | The bracketed tag badge is Pill, read not pressed
S09 | C095 | Anatomy L68 | Lane legend: The colour key, and the convention in one line | existing | C098 | yes | The lane legend is part of FlowCanvas
S09 | C096 | Anatomy L69 | Reference line: The trailing line of a step, as its source | existing | C098 | yes | The reference line is part of a step, inside FlowCanvas
S09 | C097 | Anatomy L70 | Counts readout: Phases and steps, in the toolbar and the tree foot | new | C133 | yes | The same two counts shown in the toolbar and the tree foot: new StatReadout
S09 | C098 | Anatomy L71 | Phone view chips: The six views as a scrolling chip row | existing | C063 | yes | The six views as a scrolling chip row is Chip; S16 uses C063 for the same row
S09 | C099 | Anatomy L72 | Phone board: The same board, fewer columns in view | existing | C098 | yes | The phone board is FlowCanvas at phone width
S10 | C043 | Entry and exit L63 | Arrive / the problem count pill in `C043` / the panel opens in the right rail / still S04, a panel not a route | existing | C077 | yes | Cited as the S04 toolbar row carrying the count pill, ModeBar
S10 | C049 | Entry and exit L64 | Arrive / the Problems collapsible in `C049` / the same / one of the rail's rows | existing | C035 | yes | Cited as the S04 right rail holding the Problems collapsible, RightPane
S10 | C100 | Anatomy L74 | Problems panel: The filter, the list, and the cost note | new | C134 | yes | The problems panel with filter, list and cost note: new ProblemsPanel, the sibling of HealthPanel
S10 | C101 | Anatomy L75 | Filter segment: All, Checks, Writing, each with its count | existing | C082 | yes | The filter segment is FilterSegment
S10 | C102 | Anatomy L76 | Problem row: A dot, a title, one line of why, and a line number | existing | C095 | yes | The problem row is ProblemRow
S10 | C103 | Anatomy L77 | Severity dot: Error, warning or advisory | existing | C095 | yes | The severity dot is part of ProblemRow
S10 | C104 | Anatomy L78 | Line reference: The line, as `L` and a number | existing | C095 | yes | The line reference is part of ProblemRow
S10 | C105 | Anatomy L79 | Cost note: The sentence that says the structural checks are free | new | C130 | yes | A static sentence that the structural checks are free is Note
S10 | C106 | Anatomy L80 | Fix all safe: One control, applying only unambiguous fixes | existing | C061 | yes | Fix all safe is Button
S10 | C107 | Anatomy L81 | Rules: Opens the project's rule set | existing | C061 | yes | Rules is Button
S10 | C108 | Anatomy L82 | Count pill: The number of findings, on the toolbar | existing | C064 | yes | The count pill is Pill
S10 | C109 | Anatomy L83 | Phone drawer: The same panel as the right drawer | existing | C088 | yes | The phone form is Drawer, right side
S11 | C101 | Anatomy L83 | Set filter / `C111` / All, Linked, Copies, each with a count / `.fseg`; the same component as `C101` | existing | C082 | yes | Cited as S10's filter; FilterSegment
S11 | C110 | Anatomy L82 | Panel: The set, the drift card, the checks, the footer | existing | C096 | yes | The instruction-file panel is HealthPanel
S11 | C111 | Anatomy L83 | Set filter: All, Linked, Copies, each with a count | existing | C082 | yes | The set filter is FilterSegment; the screen itself says it is the same component as S10's
S11 | C112 | Anatomy L84 | File row: A state icon, the file path, its relationship, and which tools read it | new | C135 | yes | A state icon, a path and a line: new CheckRow, the `.chk` and `.file` row shape
S11 | C113 | Anatomy L85 | Add an import: One row offering a missing file as an import | existing | C085 | yes | The offer to add a missing file is drawn as `.drophint`, DropHint
S11 | C114 | Anatomy L86 | Drift card: Which copy drifted, by how much, why it has to be a copy, then Diff and Regenerate | new | C135 | yes | The drift card is CheckRow with two actions
S11 | C115 | Anatomy L87 | Checks list: Four rows, each a check with its evidence | new | C135 | yes | Each check with its evidence is CheckRow
S11 | C116 | Anatomy L88 | Honesty footer: What these checks do and do not claim | new | C130 | yes | The honesty footer is Note, and it is not optional
S11 | C117 | Anatomy L89 | Tidy this file: One AI action on the open file, with its cost | existing | C061 | yes | Tidy this file is Button, with CreditNote beside it
S11 | C118 | Anatomy L90 | Set readout: How many files, and how many drifted | new | C133 | yes | The same numbers in the tree foot and the panel head is StatReadout
S11 | C119 | Anatomy L91 | Phone drawer: The whole panel as the right drawer | existing | C088 | yes | The phone form is Drawer, right side
S12 | C047 | Entry and exit L57 | Arrive / Add idea in `C047` on S04 / this screen / the second of the two left-rail buttons | existing | C061 | yes | Cited as the S04 Add idea control, a secondary Button
S12 | C120 | Anatomy L69 | Ideas rail: Every idea with its state, a new control, and the blueprint credits left | existing | C104 | yes | The ideas rail is IdeaList; S14 cites C104 for the same rail
S12 | C121 | Anatomy L70 | Depth selector: The pill, and its menu of three | existing | C105 | yes | The depth pill and its menu is DepthSelector; S14 cites C105
S12 | C122 | Anatomy L71 | Composer column: The whole centred column | new | C136 | yes | The centred column with nothing beside it: new CentredColumn, shared with S13
S12 | C123 | Anatomy L72 | Composer head: One question, and one line of what happens next | new | C131 | yes | One question and one line of what happens next is PageHeading
S12 | C124 | Anatomy L73 | Idea input: The text area, the bar row, and the send arrow | new | C128 | yes | The text area, bar row and send arrow is PromptInput
S12 | C125 | Anatomy L74 | Attachment controls: Three icon buttons: a drawing, a document, a repository | existing | C062 |  | Three icon-only attachment controls are IconButton
S12 | C126 | Anatomy L75 | Attachment chip: One attached thing, with a thumbnail and what it will be used for | new | C137 |  | One attached thing with a thumbnail and its purpose: new AttachmentChip
S12 | C127 | Anatomy L76 | Template chips: Start from: four industries, then one generated for yours | existing | C063 |  | Template chips are Chip
S12 | C128 | Anatomy L77 | Cost foot: What a run costs, and that nothing is sent until the arrow | new | C129 |  | What a run costs is CreditNote
S12 | C129 | Anatomy L78 | Phone column: The same column, full width, three chips | existing | C086 |  | The phone column is PhoneFrame
S13 | C120 | Anatomy L94 | Ideas rail: As S12 | existing | C104 | yes | As S12, IdeaList
S13 | C121 | Anatomy L95 | Depth selector: As S12, on the progress line | existing | C105 | yes | As S12, DepthSelector
S13 | C130 | Anatomy L96 | Question column: The centred column, wider than S12's | new | C136 |  | The wider centred column is CentredColumn, wide variant
S13 | C131 | Anatomy L97 | Progress line: Page position, a bar, the question count, and `C121` | new | C138 |  | Page position, bar, count and the depth pill: new StepProgress; S14 draws the same line
S13 | C132 | Anatomy L98 | Page navigation: Skip, Choose the recommendation, Skip all remaining, Next | existing | C108 |  | Skip, Choose the recommendation, Skip all, Next is PageNav; S14 cites C108
S13 | C133 | Anatomy L99 | Question card: A numbered question and its options | existing | C106 |  | The question card is QuestionCard
S13 | C134 | Anatomy L100 | Option row: A key letter, the option, and on the recommended one a tag and a reason | existing | C106 |  | An option row is part of QuestionCard
S13 | C135 | Anatomy L101 | Not sure: A quiet link under the options | existing | C106 |  | The Not sure link is part of QuestionCard
S13 | C136 | Anatomy L102 | Rewrite state: The blurred card and a line saying which answer caused it | existing | C107 |  | The blurred rewrite state is RewriteBlur
S13 | C137 | Anatomy L103 | Skip all modal: Three plain sentences and a confirmation | existing | C109 |  | The skip-all modal is SkipAllModal; S14 cites C109
S13 | C138 | Anatomy L104 | Standard set toggle: Use a standard question set | existing | C072 |  | Use a standard question set is a two-state control, Switch
S13 | C139 | Anatomy L105 | Blueprint file list: The fifteen files, before a credit is spent | existing | C111 |  | The fifteen files before a credit is spent is KitFileList
S14 | C076 | Anatomy L55 | Workspace header: The mark, the Ideas tab, search, the account | identity | C076 |  | The workspace header, TopBar
S14 | C086 | Anatomy L68 | Phone frame: 52 px bar, full-width body, the five-item bottom bar with AI active | identity | C086 |  | The phone frame, PhoneFrame
S14 | C104 | Anatomy L56 | Ideas rail, left: Every idea with its state, a new-idea control, the blueprint credits left | identity | C104 |  | The ideas rail, IdeaList
S14 | C105 | Anatomy L58 | Depth selector menu: Low free, Medium Pro, High Pro plus three blueprint credits | identity | C105 |  | The depth selector menu, DepthSelector
S14 | C108 | Anatomy L65 | Page navigation: Skip, Choose the recommendation, Skip all remaining, Next | identity | C108 |  | The page navigation, PageNav
S14 | C109 | Anatomy L66 | Skip-all modal: The count of remaining questions, what taking the recommendations means, two buttons | identity | C109 |  | The skip-all modal, SkipAllModal
S14 | C110 | Anatomy L59 | Decision card: One question, opened out into five parts (and 5 more row(s) under the same id: Card part, standing; Card part, forces; Card part, options; Card part, evidence; Card part, answer row) | identity | C110 |  | The decision card and its five parts, DecisionCard; one id over six rows is right, they are parts
S14 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | The preamble cites C124 as the highest inventory id at write time; the token stays
S14 | C300 | Anatomy L57 | Progress line: Page position, a progress bar, the question count, the depth pill | new | C138 |  | The progress line is StepProgress, the same line as S13
S14 | C301 | Anatomy L67 | Foot line: One line saying the deeper depths only ask more and show more | new | C130 |  | One foot line is Note
S15 | C025 | Anatomy L55 | Document pane: Whichever kit file is open, rendered | identity | C025 |  | The document pane is EditorPane
S15 | C061 | Anatomy L63 | Copy control: One full-width control that copies the prompt | identity | C061 |  | The copy control is Button, primary
S15 | C065 | Anatomy L61 | Kickoff target segment: Three targets for the prompt | identity | C065 |  | The three-target segment is Segment
S15 | C076 | Anatomy L52 | Workspace header: The mark, the open tabs, search, the account | identity | C076 |  | The workspace header, TopBar
S15 | C077 | Anatomy L54 | Toolbar: The twelve tools, in Reading mode, with a files-agree pill on the right | identity | C077 |  | The toolbar in Reading mode, ModeBar
S15 | C083 | Anatomy L53 | Left tree: The project with all fifteen kit files visible, and a foot naming the version and the file count | identity | C083 |  | The left tree with its foot, LeftRail
S15 | C086 | Anatomy L65 | Phone frame: The kit rail as the whole body, with the bottom bar | identity | C086 |  | The phone frame, PhoneFrame
S15 | C104 | Entry and exit L41 | In / An idea in the rail whose state carries a blueprint version / `C104` | identity | C104 |  | An idea row in the rail, IdeaList
S15 | C109 | Entry and exit L40 | In / Confirming the skip-all modal on S14 / `C109`, then the same route | identity | C109 |  | The skip-all modal on S14, SkipAllModal
S15 | C111 | Anatomy L56 | Kit rail, file list: Sixteen rows, fifteen files plus the specs folder, each with a tick or a one-line hint (and 1 more row(s) under the same id: Kit rail, what it is) | identity | C111 |  | The kit file list and its two lines, KitFileList
S15 | C112 | Anatomy L62 | Kickoff prompt: The verify-then-unpack-then-read prompt, in a monospace block | identity | C112 |  | The kickoff prompt, KickoffPrompt
S15 | C115 | Anatomy L59 | Link block: The unlisted link and the root hash, each with a copy control (and 1 more row(s) under the same id: Link note) | identity | C115 |  | The unlisted link, the hash and the link note, LinkBox
S15 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S15 | C310 | Anatomy L58 | Kit rail, consistency result: What the check compared and what it fixed before the person saw it | new | C130 |  | One line on what the consistency check compared, never a score: Note
S15 | C311 | Anatomy L64 | Rail foot: Edit, then publish the next version | existing | C061 |  | The rail foot controls are Button
S16 | C063 | Anatomy L61 | Phone view chips: Page, Map, Flow, Outline as a scrolling chip row | identity | C063 |  | The phone view chips, Chip
S16 | C076 | Anatomy L52 | Workspace header: The mark, the open tabs, search, the account | identity | C076 |  | The workspace header, TopBar
S16 | C077 | Anatomy L54 | Toolbar: Reading mode, the view selector set to Map, and the same three counts as the tree foot | identity | C077 |  | The toolbar with Map selected, ModeBar
S16 | C083 | Anatomy L53 | Left tree: The project, with a foot carrying the document count, the link count and the orphan count | identity | C083 |  | The left tree with counts in its foot, LeftRail
S16 | C084 | Anatomy L58 | Rail, what it is: One line saying this is what an agent reads before it writes (and 1 more row(s) under the same id: Rail, counts) | identity | C084 |  | The two rail blocks, RailSection
S16 | C086 | Anatomy L62 | Phone frame: The graph scaled to the width, with the counts under it | identity | C086 |  | The phone frame, PhoneFrame
S16 | C111 | Anatomy L60 | Rail, in the kit: The two files the map ships as | identity | C111 |  | The two files the map ships as, KitFileList
S16 | C113 | Anatomy L55 | Graph canvas: Nodes and edges, drawn as inline SVG on a 780 by 500 view box (and 2 more row(s) under the same id: Node; Edge) | identity | C113 |  | The graph canvas, its nodes and edges, ProjectMap
S16 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S16 | C320 | preamble L20 | > screen's own block, which is plainly free: components from `C320`, errors from `E320`, acceptance | existing | C124 |  | Range marker for a block this screen never used; see section 4
S17 | C048 | Anatomy L73 | Scrim and dialog: The dialog over a dimmed workspace, and the one control that closes it (and 1 more row(s) under the same id: Dialog heading) | identity | C048 |  | The dialog and its heading, ShareModal
S17 | C068 | Anatomy L82 | Phone sheet: The same blocks in a bottom sheet, with the role selector dropped | identity | C068 |  | The phone bottom sheet, Sheet
S17 | C076 | Entry and exit L57 | In / The share icon in the header, which carries no label / `C076`, icon only, per the 18 September review | identity | C076 |  | The unlabelled share icon lives in TopBar
S17 | C114 | Anatomy L75 | People input: An email field with a mail icon, and a role selector beside it (and 2 more row(s) under the same id: Invite block; People list) | identity | C114 |  | People input, invite block and people list, PeopleList
S17 | C115 | Anatomy L79 | Link block: Three rows: who the link is for, a password switch, an expiry selector (and 1 more row(s) under the same id: Link box) | identity | C115 |  | The link rows and the link box, LinkBox
S17 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S17 | C330 | Anatomy L78 | Free-limit line: The live-collaborator limit on Free, stated once, with a link to the plan | new | C130 |  | The Free live-collaborator limit, stated once, is Note
S17 | C331 | Anatomy L81 | Publish block: One row: the published page switch, its URL, and pages used against the cap | new | C139 |  | A switch, its URL and a count on one `.srow` row: new SettingRow, the settings row shape
S18 | C034 | Anatomy L79 | Document body: The rendered markdown, and any fenced block it carries | identity | C034 |  | The document body, Markdown
S18 | C051 | Anatomy L77 | Page header: The mark, the document title, a published-on pill, a download control and an open-in-frontmatter control | identity | C051 |  | The page header is part of PublicNoteView
S18 | C069 | Anatomy L80 | Invitation card: One quiet card saying what the editor adds, with one sign-in control and a decline | identity | C069 |  | The invitation card, Card
S18 | C086 | Anatomy L83 | Phone frame: The same page, single column, no bottom bar | identity | C086 |  | The phone frame, PhoneFrame
S18 | C116 | Anatomy L78 | Open-in bar: One dismissible row offering the app, the web, or staying here | identity | C116 |  | The open-in bar, OpenInBar
S18 | C117 | Anatomy L82 | Password gate: Only on a link that carries a password: the field, the opener, the expiry line, the same footer | identity | C117 |  | The password gate, PasswordGate
S18 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S18 | C331 | Entry and exit L68 | In / The publish switch on S17, followed by opening the page / `C331`, owned by S17 | new | C139 |  | Cited as the S17 publish switch, SettingRow
S18 | C340 | preamble L20 | > screen's own block, which is plainly free: components from `C340`, errors from `E340`, acceptance | new | C140 |  | Range marker; the first id used in the block, C341, maps here
S18 | C341 | Anatomy L81 | Footer: The made-with line, Report, Privacy, Terms, and the markdown twin | new | C140 |  | The made-with line and legal links under a published page: new SiteFooter, shared with S30
S19 | C058 | Anatomy L73 | Limit toast: The free limit, stated once per session | identity | C058 |  | The limit toast, Toast
S19 | C064 | Anatomy L69 | Live pill: A small marker on the toolbar saying the session is live | identity | C064 |  | The live pill, Pill
S19 | C076 | Anatomy L67 | Workspace header: The usual header, plus the presence cluster | identity | C076 |  | The header with presence, TopBar
S19 | C083 | Anatomy L70 | Left tree foot: One line naming who else is editing this document | identity | C083 |  | The tree foot naming who else is editing, LeftRail
S19 | C086 | Anatomy L75 | Phone frame: 52 px bar, editor full width | identity | C086 |  | The phone frame, PhoneFrame
S19 | C118 | Anatomy L68 | Presence cluster: One avatar per person in the session, in join order (and 2 more row(s) under the same id: Named cursor; Phone presence) | identity | C118 |  | The presence cluster, named cursor and phone presence, PresenceStrip
S19 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S19 | C350 | Anatomy L72 | Landed text: The other person's text, highlighted as it lands and fading after | existing | C118 |  | Landed text highlighted as it arrives is the inline-cursor variant of PresenceStrip
S20 | C025 | Anatomy L74 | Document surface: The document, with every proposed span highlighted in place | identity | C025 |  | The document with proposed spans in place, EditorPane
S20 | C035 | Anatomy L75 | Review rail: The whole right rail, in place of its usual rows (and 2 more row(s) under the same id: Comments row; History row) | identity | C035 |  | The review rail is RightPane; the comments and history rows under the same id are RailSection, see section 4
S20 | C076 | Anatomy L72 | Workspace header: The usual header, plus presence when somebody else is in | identity | C076 |  | The workspace header, TopBar
S20 | C077 | Anatomy L73 | Toolbar: Reading mode, and a pill carrying the waiting count | identity | C077 |  | The toolbar with the waiting count, ModeBar
S20 | C082 | Anatomy L76 | Source filter: Three positions: All, People, and AI and agents, each with its own count | identity | C082 |  | The source filter, FilterSegment; the screen's UNVERIFIED note is answered, the id is right
S20 | C088 | Anatomy L85 | Phone right drawer: The same rail as a 300 px drawer over a backdrop | identity | C088 |  | The phone right drawer, Drawer
S20 | C119 | Anatomy L77 | Change list: One item per waiting change, newest first (and 5 more row(s) under the same id: Person item; AI item; Agent item; Show diff first; Accept all) | identity | C119 |  | The change list, its three item kinds, Show diff first and Accept all, ChangeQueue
S20 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S20 | C360 | preamble L20 | > screen's own block, which is plainly free: components from `C360`, errors from `E360`, acceptance | existing | C124 |  | Range marker for a block this screen never used; see section 4
S21 | C029 | Anatomy L55 | Version list: One row per version, newest first, each with a time and an author | identity | C029 |  | The version list is part of HistoryModal
S21 | C035 | Entry and exit L38 | In / The history row in the right rail, which shows the retention window / `C035` | identity | C035 |  | The history row in the right rail, RightPane
S21 | C061 | Anatomy L58 | Restore and copy: Two controls under the diff, restore and copy as new (and 1 more row(s) under the same id: Export control) | identity | C061 |  | Restore, copy as new and export are Button
S21 | C064 | Anatomy L57 | Retention pill: The window this account gets, and its plan | identity | C064 |  | The retention pill, Pill
S21 | C070 | Anatomy L56 | Author mark: An avatar for a person, a machine mark for an AI edit, the product mark for a blueprint write | identity | C070 |  | The author mark, Avatar
S21 | C076 | Anatomy L52 | Workspace header: The usual header | identity | C076 |  | The workspace header, TopBar
S21 | C077 | Anatomy L53 | Toolbar: Reading mode, and a pill naming which version is on screen | identity | C077 |  | The toolbar naming the version on screen, ModeBar
S21 | C086 | Anatomy L60 | Phone frame: The list first, the diff under it, the two controls at the foot | identity | C086 |  | The phone frame, PhoneFrame
S21 | C120 | Anatomy L54 | Diff surface: The chosen version against the current one, line by line | identity | C120 |  | The diff surface, DiffView
S21 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S21 | C370 | preamble L20 | > screen's own block, which is plainly free: components from `C370`, errors from `E370`, acceptance | existing | C124 |  | Range marker for a block this screen never used; see section 4
S22 | C053 | Anatomy L78 | Add file menu: New document, Upload files, Upload a folder, Import from | new | C125 | yes | The Add file menu owned by S04; the inventory's C053 is FileTreeActions, which owns tree dialogs, so this is AddFileMenu
S22 | C061 | Anatomy L77 | Rail foot: One control that opens the finished project | identity | C061 |  | The rail foot control, Button
S22 | C074 | Anatomy L75 | Progress panel: The path, a count, a meter, then one row per outcome | existing | C010 | yes | The import progress panel, path, count, meter and outcome rows, is the progress state of ImportModal; the inventory's C074 is only the bar inside it
S22 | C076 | Anatomy L70 | Workspace header: The usual header, with Import as the active tab | identity | C076 |  | The header with Import as the tab, TopBar
S22 | C083 | Anatomy L71 | Left tree: The project being built, filling as files land, with a progress foot (and 1 more row(s) under the same id: Drop hint) | identity | C083 |  | The left tree filling as files land, LeftRail; the drop hint row under the same id is DropHint, see section 4
S22 | C085 | Anatomy L73 | Drop area: A large target naming what it takes, and what a folder becomes | identity | C085 |  | The large drop target, DropHint, empty-state variant
S22 | C086 | Anatomy L80 | Phone frame: The same page, four sources, and a line about sharing from other apps | identity | C086 |  | The phone frame, PhoneFrame
S22 | C121 | Anatomy L74 | Source grid: Six cards, each with an icon, a name and one line on what it does | identity | C121 |  | The six-source grid, ImportSources
S22 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S22 | C380 | Anatomy L72 | Page heading: The title, and one line promising markdown stays markdown byte for byte | new | C131 |  | The title and one promise line is PageHeading
S22 | C381 | Anatomy L76 | Outcome row: An icon, a headline and a sub-line. Four kinds: kept, uploaded, needs a look, refused | new | C135 |  | An outcome row, kept, uploaded, needs a look or refused, is CheckRow, drawn as `.chk`
S23 | C009 | Anatomy L54 | Settings navigation: Ten sections, with Connections active | new | C141 | yes | The ten-section settings navigation; the inventory's C009 is the whole SettingsModal, so the nav takes new SectionNav, shared with S28, S29, S35
S23 | C076 | Anatomy L53 | Settings header: The usual header, with Settings as the tab and no share control | identity | C076 |  | The settings header, TopBar with no share control
S23 | C086 | Anatomy L61 | Phone frame: The same cards, stacked, with the settings navigation as a drawer | identity | C086 |  | The phone frame, PhoneFrame
S23 | C122 | Anatomy L56 | Connection card: One per service: a head with an icon, a name and a status pill, then the claim lines, then the controls (and 4 more row(s) under the same id: Claim line; Drive card; GitHub card; Agents card) | identity | C122 |  | The connection cards and their claim lines, ConnectionCard
S23 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S23 | C390 | Anatomy L55 | Page heading: The title, and one line promising each connection asks for the least it can | new | C131 |  | The title and one promise line is PageHeading
S24 | C025 | Anatomy L55 | Document surface: Unchanged. Typing is unaffected | identity | C025 |  | The document surface, EditorPane
S24 | C069 | Anatomy L56 | Desktop card: What the desktop build gives, with a download and a dismissal | identity | C069 |  | The desktop card, Card
S24 | C075 | Anatomy L52 | Offline banner: One line saying work is saved on this device and syncs later, plus the last sync time (and 1 more row(s) under the same id: Phone banner) | identity | C075 |  | The offline banner, desktop and phone, Banner
S24 | C076 | Anatomy L51 | Workspace header: Unchanged | identity | C076 |  | The workspace header, TopBar
S24 | C077 | Anatomy L54 | Toolbar: Unchanged. Every editing control still works | identity | C077 |  | The toolbar, ModeBar
S24 | C083 | Anatomy L53 | Tree foot: The offline marker and the count of changes waiting | identity | C083 |  | The tree foot with the offline marker, LeftRail
S24 | C086 | Anatomy L59 | Phone frame: Otherwise unchanged | identity | C086 |  | The phone frame, PhoneFrame
S24 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S24 | C400 | Anatomy L57 | Disabled AI control: The AI control at reduced emphasis, with its reason directly beneath it | existing | C021 |  | The rail AI control at reduced emphasis with its reason is SgnkAiButton in its unavailable state
S25 | C025 | Anatomy L67 | Document surface: Identical to the web | identity | C025 |  | The document surface, EditorPane
S25 | C035 | Anatomy L68 | Right rail: Identical to the web | identity | C035 |  | The right rail, RightPane
S25 | C061 | Anatomy L79 | Email control: One control that emails the download link | identity | C061 |  | The email control, Button
S25 | C069 | Anatomy L78 | Platform rows: Three rows: Mac, Windows, Linux, each with its state and its reason | identity | C069 |  | The three platform rows, Card
S25 | C076 | Anatomy L62 | Header: The mark, three window-level icon controls, the tab strip, then search and the avatar | identity | C076 |  | The header carried inside the desktop window, TopBar
S25 | C077 | Anatomy L66 | Toolbar: Identical to the web, with a saved-to-disk marker in place of the saved marker | identity | C077 |  | The toolbar with the saved-to-disk marker, ModeBar
S25 | C078 | Anatomy L63 | Tab strip: The same tabs as the web, carried inside the header instead of a strip below it | identity | C078 |  | The tab strip inside the header, TabStrip
S25 | C083 | Anatomy L65 | Tree foot: The sync time, that files are on disk, and that there is no document limit | identity | C083 |  | The tree foot, LeftRail
S25 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S25 | C410 | Anatomy L61 | Window frame: The platform's own window controls, then our header inside it | new | C142 |  | The platform window controls around our header: new WindowFrame, drawing furniture like PhoneFrame
S25 | C411 | Anatomy L64 | Unified tree: Cloud projects and folders on this machine, in one list, each group naming which it is | existing | C083 |  | Cloud projects and local folders in one list is LeftRail, unified variant
S25 | C412 | Anatomy L77 | Page heading: What the desktop build gives, in one line | new | C131 |  | One line on what the desktop build gives is PageHeading
S25 | C413 | Anatomy L80 | Sync line: That the web app and the phone stay in sync with it, on the same account | new | C130 |  | The sync line is Note
S26 | C019 | Anatomy L81 | Install card: Shown once: what installing gives, and the control that does it | existing | C069 | yes | The install card is Card; the inventory's C019 is PWARegister, which renders nothing
S26 | C061 | Anatomy L80 | Save control: One full-width control | identity | C061 |  | The save control, Button
S26 | C063 | Anatomy L71 | Chip row: Tags and a date, offered from the text and never applied without a tap (and 1 more row(s) under the same id: Chip row) | identity | C063 |  | The two chip rows, Chip
S26 | C064 | Anatomy L69 | Destination pill: The note this will be written into, tappable to change | identity | C064 |  | The destination pill, Pill
S26 | C068 | Anatomy L78 | Sheet: A bottom sheet with the mark, the title and the destination pill | identity | C068 |  | The share-sheet form, Sheet
S26 | C086 | Entry and exit L53 | In / The AI position on the phone's bottom bar, long-pressed / `C086` | existing | C087 | yes | The AI position on the phone bottom bar is BottomBar; the screen wrote C086, which is PhoneFrame
S26 | C124 | preamble L22 | > ids when this was written were `C124`, `E117` and `A206`. Every proposal is labelled a proposal, | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S26 | C420 | Anatomy L67 | Backdrop: The desktop behind, untouched. This is a panel, not a window | new | C142 |  | The untouched desktop behind the panel is drawing furniture, WindowFrame
S26 | C421 | Anatomy L68 | Capture panel: A small centred panel, the mark, the title, the destination pill, the shortcut | new | C143 |  | The small centred capture panel opened by a shortcut: new QuickCapture
S26 | C422 | Anatomy L70 | Input: One multi-line field, focused on open | new | C128 |  | One multi-line field focused on open is PromptInput
S26 | C423 | Anatomy L72 | Foot line: What Enter does, what Escape does, and that no credits are used | new | C130 |  | The foot line is Note
S26 | C424 | Anatomy L77 | Source context: Where the shared text came from, and when | new | C130 |  | Where the shared text came from, and when, is Note
S27 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S27 | C270 | Anatomy L56 | Header theme button: One Material Symbol, `dark_mode` in light, `light_mode` in dark | existing | C018 |  | The header theme button is ThemeToggle, built
S27 | C271 | Anatomy L57 | Pre-paint resolver: The inline script that adds the class before first paint | new | C144 |  | The inline pre-paint script at public/theme-init.js: new ThemeInit, exists
S27 | C272 | Anatomy L58 | Token set, light: The custom properties on `:root` | new | C145 |  | The light token set in src/app/globals.css: new ThemeTokens, exists
S27 | C273 | Anatomy L59 | Token set, dark: The same properties, redefined | new | C145 |  | The dark token set, the same ThemeTokens
S27 | C274 | Anatomy L60 | Match-system fallback: The dark tokens under `@media (prefers-color-scheme: dark)`, applied only when no class is set | new | C145 |  | The match-system fallback, the same ThemeTokens
S27 | C275 | Anatomy L61 | Browser chrome colour: The two `themeColor` entries in the document metadata | new | C145 |  | The two themeColor entries in src/app/layout.tsx, the same ThemeTokens, metadata half
S27 | C276 | Anatomy L62 | Appearance section: Three choices: match the system, light, dark | new | C139 |  | The Appearance choice on S28 is a SettingRow holding a Select
S27 | C277 | Anatomy L63 | Phone surfaces: The phone header, bottom bar, drawers and sheets on the dark tokens | new | C145 |  | The phone surfaces on the dark tokens are a token-coverage claim, ThemeTokens
S27 | C279 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C270` to `C279`, `E270` to | existing | C018 |  | Range marker; the first id used in the block, C270, maps here
S27 | C900 | preamble L25 | > **`C900` upward is a shared block** for chrome used by several of S27 to S38. | existing | C076 |  | Preamble mention of the shared C900 block, whose first use on S28 is the header, TopBar
S28 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S28 | C280 | Anatomy L60 | Section nav: The ten sections, each with one Material Symbol, the current one marked | new | C141 |  | The ten sections with icons, current one marked: SectionNav
S28 | C281 | Anatomy L61 | Page heading: The title and one line saying settings live on the account and nothing needs a restart | new | C131 |  | The title and one line is PageHeading
S28 | C282 | Anatomy L62 | Setting row: A label, a line of help under it, and one control on the right | new | C139 |  | A label, a help line and one control is SettingRow, srow() in the generator
S28 | C283 | Anatomy L63 | Toggle: A two-state switch | existing | C072 |  | The two-state switch is Switch
S28 | C284 | Anatomy L64 | Choice: A named value that opens a short list | new | C126 |  | A named value opening a short list is Select
S28 | C285 | Anatomy L65 | Group heading: A small heading inside a section, such as Writing checks | new | C146 |  | A small heading inside a section: new SectionLabel, shared with the configuration panel
S28 | C286 | Anatomy L66 | Account block: Name, the signed-in address, the sign-in provider, delete the account | new | C147 |  | Name, address, provider and delete the account: new AccountBlock
S28 | C287 | Anatomy L67 | Phone section list: The ten sections as rows with chevrons, then the signed-in line and sign out | new | C141 |  | The ten sections as rows on the phone is SectionNav, phone variant
S28 | C289 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C280` to `C289`, `E280` to | new | C141 |  | Range marker; the first id used in the block, C280, maps here
S28 | C900 | Anatomy L59 | Header: The standard 52 px header with one tab named Settings, and no Share control | existing | C076 |  | The standard header with one tab and no share control, TopBar
S29 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S29 | C280 | Anatomy L59 | Header and nav / `C900`, `C280` / The Settings shell with Plan and usage marked / Shared with S28 | new | C141 |  | The settings nav with Plan and usage marked, SectionNav
S29 | C290 | Anatomy L60 | Page heading: The plan name, the account name, and the date allowances reset | new | C131 |  | Plan name, account name and reset date is PageHeading
S29 | C291 | Anatomy L62 | Meter row: The four cards in a row | existing | C073 |  | The four meter cards in a row are Meter, card form
S29 | C292 | Anatomy L64 | Excluded line: The line inside the Free card naming what Free does not have | existing | C123 |  | The not-included line inside the Free card is part of PlanCards
S29 | C293 | Anatomy L65 | Payment footnote: The methods, the cancel line, and the two top-up prices | new | C130 |  | The payment footnote is Note
S29 | C294 | Anatomy L66 | Coming tier strip: Team and Enterprise, named and not purchasable | existing | C123 |  | Team and Enterprise named and not purchasable is PlanCards, coming variant
S29 | C299 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C290` to `C299`, `E290` to | new | C131 |  | Range marker; the first id used in the block, C290, maps here
S29 | C900 | preamble L25 | > **`C900` upward is a shared block** for chrome used by several of S27 to S38. | existing | C076 |  | The header half of the settings shell, TopBar
S29 | C907 | Anatomy L61 | Meter card: One measure: its name, the number left, the number allowed, and a bar | existing | C073 |  | One measure with a bar is Meter
S29 | C908 | Anatomy L63 | Plan card: One plan: name, price, what is in it, the control | existing | C123 |  | One plan card is PlanCards
S30 | C040 | Anatomy L59 | Workspace shell: The standard header, tree and mode bar | existing | C004 | yes | The standard header, tree and mode bar reused unchanged is the workspace shell, VaultWorkspace
S30 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S30 | C300 | Anatomy L60 | Published pill: The state and the live URL, in the mode bar | existing | C064 |  | The published pill in the mode bar is Pill
S30 | C301 | Anatomy L61 | Source pane: The file, front matter and all, in Split's left half | existing | C026 |  | The source pane in Split is CodeMirrorEditor
S30 | C302 | Anatomy L62 | Explainer note: One note under the source saying the front matter is the profile and the folder is the writing | new | C130 |  | The explainer note under the source is Note
S30 | C303 | Anatomy L63 | Preview pane: The rendered public page, in Split's right half | existing | C034 |  | The rendered public page is Markdown, the same renderer the public route uses
S30 | C304 | Anatomy L68 | Head: Avatar, name, one role line, and the links as chips | new | C148 |  | The profile head, avatar, name, role and links: new ProfilePage
S30 | C305 | Anatomy L69 | Projects: A card per project: a title and one line | new | C148 |  | The project cards are part of ProfilePage
S30 | C306 | Anatomy L70 | Writing: A row per post: a title and a date | new | C148 |  | The writing list is part of ProfilePage
S30 | C307 | Anatomy L71 | Footer: The made-with line on Free, absent on Pro | new | C140 |  | The made-with footer is SiteFooter, shared with S18
S30 | C309 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C300` to `C309`, `E300` to | existing | C064 |  | Range marker; the first id used in the block, C300, maps here
S30 | C900 | preamble L25 | > **`C900` upward is a shared block** for chrome used by several of S27 to S38. | existing | C076 |  | Preamble mention of the shared block; TopBar
S31 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S31 | C310 | Anatomy L60 | Conflict banner: Which document, which paragraph, why the two diverged, and that nothing was merged | existing | C075 |  | The conflict banner is Banner
S31 | C311 | Anatomy L61 | Left pane: One version, with its origin, its author and its time above it | existing | C120 |  | The left version pane is DiffView, side-by-side variant
S31 | C312 | Anatomy L62 | Right pane: The other version, same shape | existing | C120 |  | The right version pane, the same DiffView
S31 | C313 | Anatomy L63 | Changed-span mark: The span that differs, marked inside otherwise identical text | existing | C120 |  | The changed-span mark inside identical text is part of DiffView
S31 | C314 | Anatomy L64 | Keep control: One per pane, directly under that version | existing | C061 |  | Keep this version, one per pane, is Button
S31 | C315 | Anatomy L65 | Keep both: One control in the footer bar | existing | C061 |  | Keep both is Button
S31 | C316 | Anatomy L66 | Let AI decide: One control in the footer bar, beside Keep both, marked as the AI action | existing | C061 |  | Let AI decide is Button, marked as the AI action
S31 | C317 | Anatomy L67 | Consequence line: The line stating that whichever is chosen, the other stays in history | new | C130 |  | The consequence line is Note
S31 | C318 | Anatomy L68 | Proposal review: The change queue, opened on the proposal the AI made | existing | C119 |  | Where Let AI decide sends you is ChangeQueue
S31 | C319 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C310` to `C319`, `E310` to | existing | C075 |  | Range marker; the first id used in the block, C310, maps here
S31 | C900 | preamble L25 | > **`C900` upward is a shared block** for chrome used by several of S27 to S38. | existing | C076 |  | Preamble mention of the shared block; TopBar
S32 | C040 | Anatomy L66 | Editor behind: The workspace, fully usable | existing | C004 | yes | The workspace behind the overlay, fully usable, is VaultWorkspace
S32 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S32 | C320 | Anatomy L60 | Failure line: One line: AI is unavailable, the document is untouched, nothing was charged | existing | C075 |  | The failure line on a danger border is Banner
S32 | C321 | Anatomy L61 | Retry control: A single refresh control on the failure line | existing | C062 |  | The single refresh control is IconButton
S32 | C322 | Anatomy L62 | Provider chain list: One row per provider in the chain, in order, each with the reason it declined | existing | C094 |  | One row per provider in the chain with its reason is ProviderStatusList
S32 | C323 | Anatomy L63 | Ways forward: Chips: try again, the local model on the desktop, my own key, and the standard question set in idea mode | existing | C063 |  | The ways-forward chips are Chip
S32 | C324 | Anatomy L64 | Credit note: The line stating the remaining allowance is untouched, because nothing is deducted for a failed call | new | C129 |  | The allowance untouched line, read live, is CreditNote
S32 | C325 | Anatomy L65 | Rail state: The AI control in the right rail, disabled, with one line saying every provider is down | existing | C021 |  | The disabled AI control in the rail is SgnkAiButton, unavailable state, as on S24
S32 | C329 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C320` to `C329`, `E320` to | existing | C075 |  | Range marker; the first id used in the block, C320, maps here
S32 | C900 | preamble L25 | > **`C900` upward is a shared block** for chrome used by several of S27 to S38. | existing | C076 |  | Preamble mention of the shared block; TopBar
S33 | C040 | Anatomy L65 | Dimmed workspace: The editor behind, dimmed, not replaced | existing | C004 | yes | The dimmed workspace behind the modal is VaultWorkspace
S33 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S33 | C330 | Anatomy L66 | Cap modal: The whole screen, at 520 px on the desktop | existing | C066 |  | The cap modal, a bottom sheet on the phone, is Modal
S33 | C331 | Anatomy L67 | What happened: One heading naming the exact cap and the exact number | existing | C066 |  | The heading naming the exact cap is Modal's title
S33 | C332 | Anatomy L68 | What still works: A short list, each row marked as allowed or not allowed | new | C135 |  | Each allowed or not-allowed row is CheckRow
S33 | C333 | Anatomy L69 | Ways out: Three stacked controls: free space, use the desktop, move to Pro | existing | C061 |  | Free space, use the desktop, move to Pro are Button, the paid one primary and last
S33 | C334 | Anatomy L70 | Downgrade note: The fine line stating that a downgraded account meets this same screen and loses nothing | new | C130 |  | The downgrade note is Note
S33 | C335 | Anatomy L71 | Tree footer count: The standing count in the tree, such as 50 of 50 cloud documents | existing | C083 |  | The standing count in the tree foot is LeftRail's foot
S33 | C339 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C330` to `C339`, `E330` to | existing | C066 |  | Range marker; the first id used in the block, C330, maps here
S33 | C900 | preamble L25 | > **`C900` upward is a shared block** for chrome used by several of S27 to S38. | existing | C076 |  | Preamble mention of the shared block; TopBar
S33 | C908 | Anatomy L72 | Plan comparison: Reached from Move to Pro | existing | C123 |  | The plan comparison owned by S29, PlanCards
S34 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays
S34 | C340 | Anatomy L64 | Section header: The word Ideas and a control to start a new one | existing | C104 |  | The Ideas head in the tree with a new control is IdeaList, empty state
S34 | C341 | Anatomy L65 | Standing line: One line saying ideas will be listed here with where each one stands | new | C130 |  | The standing line in the empty list is Note
S34 | C342 | Anatomy L66 | What a blueprint is: One paragraph: describe, answer, get a brief and fifteen files an agent can build from, at a link | new | C130 |  | What a blueprint is, one paragraph, is Note
S34 | C343 | Anatomy L67 | Depth list: Three rows, Low, Medium and High, each one line | new | C130 |  | Three static rows describing Low, Medium and High are explanation, not the selector: Note
S34 | C344 | Anatomy L68 | Start box: One field asking what is being built and for whom, with a submit | new | C128 |  | One field with a submit is PromptInput
S34 | C345 | Anatomy L69 | Chips: Open the example, and pick an industry template | existing | C063 |  | Two chips, Chip
S34 | C346 | Anatomy L70 | Example note: The line saying the example is a real kit made by hand, readable before a credit is spent | new | C130 |  | The example note is Note
S34 | C347 | Anatomy L71 | Credit footer: The remaining blueprint allowance for the month | new | C129 |  | The remaining blueprint allowance, read from the entitlement, is CreditNote
S34 | C348 | Anatomy L72 | Step strip: Describe, Decide, Write, Hand off, with the first marked | new | C138 |  | Describe, Decide, Write, Hand off with the first marked is StepProgress, stages variant
S34 | C349 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C340` to `C349`, `E340` to | existing | C104 |  | Range marker; the first id used in the block, C340, maps here
S34 | C900 | preamble L25 | > **`C900` upward is a shared block** for chrome used by several of S27 to S38. | existing | C076 |  | Preamble mention of the shared block; TopBar
S35 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays, and ConfigTable carries the same id
S35 | C350 | Anatomy L71 | Page heading: The title, and the invariant sentence | new | C131 |  | The title and the invariant sentence is PageHeading
S35 | C351 | Anatomy L74 | Last change: Who changed this row, from what to what, and when | existing | C124 |  | Last change per row is a column of ConfigTable
S35 | C352 | Anatomy L76 | Impact list: The named accounts a save would move over a cap | new | C150 |  | The named accounts a save would move over a cap, opened from the pending bar, is part of PendingChangesBar
S35 | C353 | Anatomy L77 | Phone view: The same rows, read-only, two values per row | existing | C124 |  | The phone view, read-only rows, is ConfigTable's phone form
S35 | C359 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C350` to `C359`, `E350` to | new | C131 |  | Range marker; the first id used in the block, C350, maps here
S35 | C900 | Anatomy L69 | Configuration shell: The 52 px header with one tab named Configuration, no Share control, and the 220 px nav | new | C149 |  | The header with one Configuration tab and the 220 px nav: new ConfigShell
S35 | C901 | Anatomy L70 | Panel nav: Five entries: plans and limits, models and providers, features and flags, accounts and usage, audit log | new | C141 |  | The five-entry panel nav is SectionNav, the same shape as the settings nav
S35 | C902 | Anatomy L75 | Pending bar: How many changes, what they are, how many accounts go over their cap, and three controls | new | C150 |  | The fixed bottom bar with the count, the impact and three controls: new PendingChangesBar
S35 | C903 | Anatomy L73 | Editable value: One cell. Plain until edited, marked while edited, muted where the value is not a number | existing | C124 |  | One editable cell is part of ConfigTable
S35 | C904 | Anatomy L72 | Limits table: A row per limit, columns for Free, Pro and that row's last change | existing | C124 |  | The limits table is ConfigTable, limits variant
S36 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays, and ConfigTable carries the same id
S36 | C360 | Anatomy L59 | Provider row: Order number, a drag handle, the provider name, a note, what is left of today's pool, and a switch | existing | C124 |  | A provider row with order, drag handle, pool and switch is ConfigTable, models variant
S36 | C361 | Anatomy L61 | Disabled row: A provider whose terms nobody opened: no order number, muted, switch not operable, reason on the row | existing | C124 |  | A disabled provider row with its reason is ConfigTable, locked row
S36 | C362 | Anatomy L62 | Promise line: The line under the chain saying the sign-in promise is only as true as this list | new | C130 |  | The promise line under the chain is Note
S36 | C363 | Anatomy L64 | Cost cell: What one call of that kind costs, computed and not typed | existing | C124 |  | The computed cost cell is part of ConfigTable
S36 | C364 | Anatomy L65 | Phone view: The chain only, with each provider's remaining pool, read-only | existing | C124 |  | The phone view, chain only, read-only, is ConfigTable's phone form
S36 | C369 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C360` to `C369`, `E360` to | existing | C124 |  | Range marker; the first id used in the block, C360, maps here
S36 | C900 | Anatomy L57 | Configuration shell: Header and the five-entry nav | new | C149 |  | The configuration shell, ConfigShell
S36 | C902 | Anatomy L60 | Configuration switch: The two-state control on a provider row and on a flag row | existing | C072 |  | The two-state control on a provider or flag row is Switch; on S35 the same token means the pending bar
S36 | C904 | Anatomy L63 | Routing table: A row per call kind, with the model per plan and the cost of one call | existing | C124 |  | The routing table, ConfigTable
S36 | C905 | Anatomy L58 | Section label: A small capitalised label over each block | new | C146 |  | The small capitalised label over each block is SectionLabel
S37 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays, and ConfigTable carries the same id
S37 | C370 | Anatomy L54 | Flag row: A title, a line of description, and a switch | existing | C124 |  | A flag row with a title, a description and a switch is ConfigTable, flags variant
S37 | C371 | Anatomy L56 | Locked row: The same shape, on a dashed muted border, with a lock symbol and a locked marker instead of a switch | existing | C124 |  | The locked row is ConfigTable, locked row
S37 | C372 | Anatomy L57 | Reason on the row: Why the locked row is locked, in its description line | existing | C124 |  | The reason on a locked row is part of ConfigTable's locked row contract
S37 | C373 | Anatomy L58 | Phone view: All six rows, flags operable and locked rows marked | existing | C124 |  | The phone view of all six rows is ConfigTable's phone form
S37 | C379 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C370` to `C379`, `E370` to | existing | C124 |  | Range marker; the first id used in the block, C370, maps here
S37 | C900 | Anatomy L52 | Configuration shell: Header and the five-entry nav | new | C149 |  | The configuration shell, ConfigShell
S37 | C902 | Anatomy L55 | Configuration switch: The two-state control | existing | C072 |  | The configuration switch, Switch
S37 | C905 | Anatomy L53 | Section label: Two labels: Flags, and Locked and why | new | C146 |  | The two labels, SectionLabel
S38 | C124 | preamble L19 | > write time as `C124`, `E117` and `A206`. The scheme is `65-CONVENTIONS.md` section 3 with the two | identity | C124 |  | Preamble citation of the highest inventory id; the token stays, and ConfigTable carries the same id
S38 | C380 | Anatomy L57 | Account search: A search field, the matched address, the plan, the join date, a count, and the grant control | existing | C124 |  | The account search and its result row is ConfigTable, accounts variant
S38 | C381 | Anatomy L59 | Exception note: The line saying an exception carries an expiry, and what happens when it lapses | new | C130 |  | The exception note is Note
S38 | C382 | Anatomy L63 | Grant dialogue: Which limit, what value, until when, and why | new | C151 |  | Which limit, what value, until when and why: new GrantExceptionDialog
S38 | C383 | Anatomy L64 | Phone view: The search result and two meter cards, read-only | existing | C124 |  | The phone view, read-only, is ConfigTable's phone form
S38 | C389 | preamble L20 | > digits after the letter as the screen number, so this file reserves `C380` to `C389`, `E380` to | existing | C124 |  | Range marker; the first id used in the block, C380, maps here
S38 | C900 | Anatomy L56 | Configuration shell: Header and the five-entry nav | new | C149 |  | The configuration shell, ConfigShell
S38 | C904 | Anatomy L61 | Ledger table: When, what, which model, what it cost us | existing | C124 |  | The ledger table, ConfigTable
S38 | C905 | Anatomy L60 | Section label: The label over the ledger | new | C146 |  | The label over the ledger, SectionLabel
S38 | C906 | Anatomy L62 | Audit log: Every setting change across the panel, newest first, read-only | new | C152 |  | Every setting change across the panel, newest first, read-only: new AuditLog
S38 | C907 | Anatomy L58 | Usage row: Four meter cards for the chosen account | existing | C073 |  | The four meter cards for the chosen account, Meter

## 4. What the map cannot fix on its own

The coordinator applies `component-map.json` to the screens with one script. Four kinds of case
need a hand after that, because a map keyed by screen and id cannot tell two uses of one token apart.

### 4.1 One id used for two regions on one screen

Screen | id | first region, and where the map sends it | second region, and where it belongs
S22 | `C083` | Left tree, `C083` | Drop hint (Anatomy line 79), which is `C085`
S20 | `C035` | Review rail, `C035` | Comments row and History row (Anatomy lines 83 and 84), which are `C084`

### 4.2 Preamble range markers

Every screen opens with a note naming the block it allocated, such as "components `C010` to
`C019`". Those tokens are range markers, not components. **The map sends each marker to the id that
the first component in its block became**, so the map stays total and every target exists.

Three blocks were never used, so there is no first component to send them to. Their markers map to
`C124`, the same id the note beside them already cites as the last inventory id at write time:

Screen | marker
S16 | `C320`
S20 | `C360`
S21 | `C370`

**Recommendation:** once the map is applied, delete the "Ids invented here" note from all 38 screens.
It describes a scheme that no longer exists, and a rewritten range such as "components `C130` to
`C131`" is meaningless.

### 4.3 The preamble citation of `C124`

S14 to S38 each say that the highest inventory id at write time was `C124`. The map keeps `C124` as
identity on those screens. It is a citation of a number, not a use of `ConfigTable`, and the
`screens` column of `C124` counts only S35 to S38.

### 4.4 Outside this job

`07-CLAIMS-REGISTER.md` and `09-CHANGELOG.md` use `C201` to `C212`, `C301` to `C306` and `C401` to
`C405` as **claim** ids, and also `C001` to `C008` and `C101` to `C106`. The validator reads every
`\bC\d{3}\b` as a component id, so the high ones will still report as orphans after the screens are
fixed. The low ones are worse: they pass, because a component carries the same number. Either the claims take another letter or the
validator learns the difference. It is not for this file to choose.

## 5. How it was made, and the proof

### 5.1 Method

1. **Extract.** A script walked each `12-screens/S*.md`, tracked the current `##` section, and
   recorded every `C` token. A token in the second cell of an `Anatomy` table row is a definition;
   anything else is a mention. Result: 411 screen and id pairs, 237 distinct ids.
2. **Decide.** Each pair was read against its screen, the inventory, `docs/mvp0/screens/gen.mjs`
   (the helper names `top()`, `tree()`, `modebar()`, `rail()`, `phone()`, `pdrawer()`, `srow()`,
   `cfgNav`) and the code under `src/modules/*/presentation/`. Two code checks changed a decision:
   maths already renders inside `Markdown` through `rehype-katex`, so no maths component was added,
   and the GitHub sign-in button is drawn inline in `LoginScreen.tsx`, so it is a new row marked not
   built.
3. **Write.** The map and this file were rewritten after every screen.

### 5.2 Counts, from the map

Measure | Value
Screen and id pairs | 411
Distinct ids written on the screens | 237
Distinct inventory ids they now resolve to | 110
of which existed before this pass | 80
of which are new, `C125` to `C154` | 30
Pairs kept as identity | 114
Pairs that were collisions | 139, over 113 distinct ids

### 5.3 The check

Script, run from any directory:

```python
import json, re, glob, os
ROOT = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/pack/'
M = json.load(open(ROOT + 'tools/component-map.json'))
inv = open(ROOT + '14-COMPONENT-INVENTORY.md', encoding='utf-8').read().split('\n')
s2 = inv.index('## 2. The index'); s3 = inv.index('## 3. The contract')
index = {l.split(' | ')[0] for l in inv[s2:s3] if re.match(r'^C\d{3} \| ', l)}
contract = {l.split(' | ')[0] for l in inv[s3:] if re.match(r'^C\d{3} \| ', l)}
print('index rows', len(index), 'contract rows', len(contract), 'same set', index == contract)
missing = sorted({(s, k, v) for s, m in M.items() for k, v in m.items() if v not in index})
print('map targets missing from the inventory:', len(missing), missing[:5])
gaps = []
for f in sorted(glob.glob(ROOT + '12-screens/S*.md')):
    s = os.path.basename(f)[:-3]
    toks = set(re.findall(r'\bC\d{3}\b', open(f, encoding='utf-8').read()))
    gaps += [(s, t) for t in toks if t not in M.get(s, {})]
print('screen tokens with no map entry:', len(gaps), gaps[:5])
print('screens in map', len(M), 'pairs', sum(len(m) for m in M.values()))
```

Output, run on 18 September after the last inventory batch:

```text
index rows 154 contract rows 154 same set True
map targets missing from the inventory: 0 []
screen tokens with no map entry: 0 []
screens in map 38 pairs 411
```

## 6. Limits

- **A judgement, not a fact.** Which regions share a component is one reader's grouping. Another
  reader would merge `C139` `SettingRow` with the `C124` flag rows, or split `C130` `Note` by tone.
- **Not verified against the images.** Decisions read the screen text, the generator's helpers and
  the code. The rendered PDFs were not opened.
- **Not applied.** No screen file was edited here. Until the coordinator applies the map, the
  screens still carry private ids, and the validator will still report them.
- **What would falsify a decision:** a screen region whose props, states or keyboard contract differ
  from the row it was sent to. The `why` column states the reasoning for each, so a disagreement can
  be checked row by row.
