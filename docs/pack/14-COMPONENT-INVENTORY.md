---
id: 14-COMPONENT-INVENTORY
title: Component inventory
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [component-ids, C001-C154, component-props, component-boundaries]
---

# 14. Component inventory

**One row per component, 154 rows.** Sixty-two exist in the code at `0af3c90`. Ninety-two are named
by the screens and have never been built. Rows `C125` to `C154` were added on 18 September by the
component reconciliation in section 5.5.

This file is the one home for a component id. A screen's `Anatomy` table in `12-screens/SNN.md`
names regions by `C-id`, and nothing else defines what a `C-id` is.

**The boundary with `58-DESIGN-SYSTEM.md`, because the two files nearly collide.** That file owns how
a component looks: its tokens, its classes such as `.btn` and `.btn.primary`, its contrast and its
spacing. This file owns what a component is: its id, its props, its states, its accessibility
contract and where it may not be used. **A colour never appears here, and a prop type never appears
there.** Section 5 of that file and `C061` to `C075` here describe the same missing primitives from
the two sides.

## 0. The two sources, and why they disagree

**Source one, what exists.** Every `.tsx` under `src/modules/*/presentation/` and
`src/shared/presentation/`, found with `find src/modules/*/presentation src/shared/presentation -name '*.tsx'`.
Props were read from each file's own `Props` type, not inferred.

**Source two, what the screens imply.** `docs/mvp0/screens/gen.mjs`, 1,760 lines, is the generator
for all thirty-eight screen images. It names every visual element twice: as a helper function such
as `rail()` or `filterseg()`, and as a CSS class such as `.rsec` or `.fseg`. It declares **283
distinct class selectors**, from
`sed -n '48,600p' docs/mvp0/screens/gen.mjs | grep -oE '\.[a-zA-Z][a-zA-Z0-9_-]*' | sort -u | wc -l`.

**They disagree about almost everything.** The generator draws the product as specified; the code is
the prototype the product is being built out of. Where an existing component nearly matches an
implied one, the existing row says so and the implied row is not repeated.

**The most important finding in this file is what is missing from both.** There is no shared
`Button`, no shared `Modal`, no shared `Chip` and no shared `Pill`. Five modals in the code each
build their own overlay, and every button is a bare `<button>` with inline styles. Section 5.1
carries that as a proposal, and it is the cheapest work named anywhere in this pack.

## 1. How a row is filled

**A row is split across two tables, joined on `C-id`.** Eleven columns in one table is unreadable at
any width. Table one in section 2 is the index. Table two in section 3 is the contract. Every id
appears in both, and a validator should assert the two are the same set.

Column | Table | Rule
`C-id` | both | `C` plus three digits. Never reused, never renumbered
`name` | 2 | The exported symbol for a built one. The name a builder should give an unbuilt one
`module` | 2 | `src/modules/<name>` or `src/shared`. `unassigned` where no module owns it yet
`kind` | 2 | `primitive` if it holds no other component of ours, `composition` otherwise
`source` | 2 | `exists` or `implied by screens, not built`
`screens` | 2 | Screen ids from `11-SCREEN-INDEX.md`
`props` | 3 | Types and defaults, read from the file. `none` for a component that takes none
`variants` | 3 | The forms it takes. `none` where it has one form
`states` | 3 | Every visual state the component itself owns
`accessibility contract` | 3 | What it must do for a screen reader and a keyboard. Never a wish
`when NOT to use it` | 3 | The boundary. This is the column that stops a component sprawling

**The `C-id` column is bare in both tables**, without backticks, because six and then six more
columns of ticked text is unreadable. `10-FEATURE-REGISTER.md` and `11-SCREEN-INDEX.md` tick theirs.

## 2. The index

C-id | name | module | kind | source | screens
C001 | Icon | shared | primitive | exists | S04, S05, S07
C002 | GoogleIcon | shared | primitive | exists | every screen
C003 | AppShell | app-shell | composition | exists | S04
C004 | VaultWorkspace | app-shell | composition | exists | S04, S30, S32, S33
C005 | KnowledgeUI | app-shell | composition | exists | S04
C006 | CommandPalette | app-shell | composition | exists | S04
C007 | Spotlight | app-shell | composition | exists | S04
C008 | SearchPanel | app-shell | composition | exists | S02, S03, S04
C009 | SettingsModal | app-shell | composition | exists | S28
C010 | ImportModal | app-shell | composition | exists | S22
C011 | LinkDoctorModal | app-shell | composition | exists | S10
C012 | GraphButton | app-shell | primitive | exists | S16
C013 | SidebarToggle | app-shell | primitive | exists | S04
C014 | RightPaneToggle | app-shell | primitive | exists | S04
C015 | RightPaneCycle | app-shell | primitive | exists | S04
C016 | ScrollbarToggle | app-shell | primitive | exists | S04, S28
C017 | ScrollIndicator | app-shell | composition | exists | S04
C018 | ThemeToggle | app-shell | primitive | exists | S27
C019 | PWARegister | app-shell | primitive | exists | S26
C020 | TauriBridge | app-shell | primitive | exists | S25
C021 | SgnkAiButton | ai-tools | primitive | exists | S06, S24, S32
C022 | LoginScreen | auth | composition | exists | S01
C023 | GoogleSignInButton | auth | primitive | exists | S01
C024 | PasswordLoginForm | auth | composition | exists | S01
C025 | EditorPane | editor | composition | exists | S04, S05, S08, S15, S20, S24, S25
C026 | CodeMirrorEditor | editor | composition | exists | S04, S07, S08, S30
C027 | Toolbar | editor | composition | exists | S04
C028 | AIMenu | editor | composition | exists | S07
C029 | HistoryModal | editor | composition | exists | S21
C030 | LivePreview | editor | composition | exists | S04
C031 | InlineBlockEditor | editor | primitive | exists | S04, S08
C032 | ExportMenu | export | composition | exists | S04, S28
C033 | GraphView | graph | composition | exists | S16
C034 | Markdown | preview | composition | exists | S04, S08, S18, S30
C035 | RightPane | preview | composition | exists | S04, S06, S10, S20, S21, S25
C036 | Outline | preview | composition | exists | S04
C037 | Backlinks | preview | composition | exists | S04
C038 | UnlinkedMentions | preview | composition | exists | S04
C039 | TagsPanel | preview | composition | exists | S04
C040 | BookmarksPanel | preview | composition | exists | S04
C041 | PropertiesPanel | preview | composition | exists | S05
C042 | EmbeddedNote | preview | composition | exists | S04
C043 | MermaidBlock | preview | primitive | exists | S08
C044 | CalloutBox | preview | primitive | exists | S08
C045 | EditableTable | preview | composition | exists | S04, S08
C046 | MediaEmbed | preview | primitive | exists | S04
C047 | CommitBar | repository | composition | exists | S23
C048 | ShareModal | share | composition | exists | S17
C049 | ShareMenu | share | composition | exists | S17
C050 | DuplicateConflictModal | share | composition | exists | S31
C051 | PublicNoteView | share | composition | exists | S18
C052 | FileTree | vault | composition | exists | S04
C053 | FileTreeActions | vault | composition | exists | S04
C054 | TreeItem | vault | composition | exists | S04
C055 | ContextMenu | vault | primitive | exists | S03, S04, S05
C056 | ConfirmDialog | vault | primitive | exists | S04
C057 | InlineDialog | vault | primitive | exists | S04
C058 | Toast | vault | primitive | exists | S04, S05, S19
C059 | TrashModal | vault | composition | exists | S04
C060 | SnapshotProvider | vault | composition | exists | S04
C061 | Button | shared | primitive | implied by screens, not built | every screen
C062 | IconButton | shared | primitive | implied by screens, not built | every screen
C063 | Chip | shared | primitive | implied by screens, not built | S06, S09, S12, S16, S22, S26, S32, S34
C064 | Pill | shared | primitive | implied by screens, not built | S03, S04, S07, S09, S10, S11, S19, S21, S26, S29, S30
C065 | Segment | shared | primitive | implied by screens, not built | S02, S03, S04, S05, S09, S15
C066 | Modal | shared | primitive | implied by screens, not built | S17, S21, S22, S28, S33
C067 | Popover | shared | primitive | implied by screens, not built | S07, S09, S12
C068 | Sheet | shared | primitive | implied by screens, not built | every screen, phone only
C069 | Card | shared | primitive | implied by screens, not built | S02, S18, S24, S25, S26, S29
C070 | Avatar | shared | primitive | implied by screens, not built | S19, S20, S21
C071 | BrandMark | shared | primitive | implied by screens, not built | S01, S02, S18, S30
C072 | Switch | shared | primitive | implied by screens, not built | S13, S28, S36, S37
C073 | Meter | shared | primitive | implied by screens, not built | S29, S36, S38
C074 | ProgressBar | shared | primitive | implied by screens, not built | S22
C075 | Banner | shared | primitive | implied by screens, not built | S24, S31, S32, S33
C076 | TopBar | app-shell | composition | implied by screens, not built | every screen
C077 | ModeBar | editor | composition | implied by screens, not built | S04, S05, S07, S08, S09, S10, S15, S16, S20, S21, S24, S25
C078 | TabStrip | editor | composition | implied by screens, not built | S04, S05, S25
C079 | DocToolbar | editor | composition | implied by screens, not built | S05
C080 | PaperSurface | editor | composition | implied by screens, not built | S05
C081 | CommentMargin | editor | composition | implied by screens, not built | S05, S20
C082 | FilterSegment | shared | primitive | implied by screens, not built | S10, S11, S20
C083 | LeftRail | vault | composition | implied by screens, not built | S04, S05, S12, S15, S16, S19, S22, S24, S25, S33
C084 | RailSection | preview | composition | implied by screens, not built | S04, S16
C085 | DropHint | vault | primitive | implied by screens, not built | S02, S04, S11, S22, S34
C086 | PhoneFrame | app-shell | composition | implied by screens, not built | every screen, phone only
C087 | BottomBar | app-shell | composition | implied by screens, not built | every screen, phone only
C088 | Drawer | app-shell | primitive | implied by screens, not built | every screen, phone only
C089 | StartCards | unassigned | composition | implied by screens, not built | S02, S03
C090 | RecentList | unassigned | composition | implied by screens, not built | S02, S03
C091 | AIBox | ai-tools | composition | implied by screens, not built | S06
C092 | AITargetLine | ai-tools | primitive | implied by screens, not built | S06
C093 | InlineSuggestion | editor | composition | implied by screens, not built | S06, S07
C094 | ProviderStatusList | ai-tools | composition | implied by screens, not built | S32, S36
C095 | ProblemRow | unassigned | primitive | implied by screens, not built | S10
C096 | HealthPanel | unassigned | composition | implied by screens, not built | S11
C097 | ViewAsMenu | preview | composition | implied by screens, not built | S09
C098 | FlowCanvas | preview | composition | implied by screens, not built | S09
C099 | SlideDeck | preview | composition | implied by screens, not built | S09
C100 | MindMap | preview | composition | implied by screens, not built | S09
C101 | KanbanBoard | preview | composition | implied by screens, not built | S09
C102 | ChartBlock | preview | primitive | implied by screens, not built | S08
C103 | DrawingBlock | preview | composition | implied by screens, not built | S08, S12
C104 | IdeaList | unassigned | composition | implied by screens, not built | S04, S12, S13, S14, S15, S34
C105 | DepthSelector | unassigned | primitive | implied by screens, not built | S12, S13, S14
C106 | QuestionCard | unassigned | composition | implied by screens, not built | S13, S14
C107 | RewriteBlur | unassigned | primitive | implied by screens, not built | S13
C108 | PageNav | unassigned | primitive | implied by screens, not built | S13, S14
C109 | SkipAllModal | unassigned | composition | implied by screens, not built | S13, S14, S15
C110 | DecisionCard | unassigned | composition | implied by screens, not built | S14
C111 | KitFileList | unassigned | composition | implied by screens, not built | S13, S15, S16, S34
C112 | KickoffPrompt | unassigned | composition | implied by screens, not built | S15
C113 | ProjectMap | graph | composition | implied by screens, not built | S16
C114 | PeopleList | share | composition | implied by screens, not built | S17
C115 | LinkBox | share | composition | implied by screens, not built | S15, S17
C116 | OpenInBar | share | primitive | implied by screens, not built | S18
C117 | PasswordGate | share | composition | implied by screens, not built | S18
C118 | PresenceStrip | share | composition | implied by screens, not built | S19
C119 | ChangeQueue | unassigned | composition | implied by screens, not built | S20, S31
C120 | DiffView | unassigned | composition | implied by screens, not built | S20, S21, S31
C121 | ImportSources | unassigned | composition | implied by screens, not built | S22
C122 | ConnectionCard | unassigned | composition | implied by screens, not built | S23
C123 | PlanCards | unassigned | composition | implied by screens, not built | S29, S33
C124 | ConfigTable | unassigned | composition | implied by screens, not built | S35, S36, S37, S38
C125 | AddFileMenu | vault | composition | implied by screens, not built | S04, S22
C126 | Select | shared | primitive | implied by screens, not built | S05, S27, S28
C127 | Stepper | shared | primitive | implied by screens, not built | S05
C128 | PromptInput | ai-tools | composition | implied by screens, not built | S06, S12, S26, S34
C129 | CreditNote | ai-tools | primitive | implied by screens, not built | S06, S07, S12, S32, S34
C130 | Note | shared | primitive | implied by screens, not built | S01, S08, S10, S11, S14, S15, S17, S25, S26, S29, S30, S31, S33, S34, S36, S38
C131 | PageHeading | shared | primitive | implied by screens, not built | S01, S02, S03, S12, S22, S23, S25, S28, S29, S35
C132 | RefusalNotice | editor | primitive | implied by screens, not built | S07
C133 | StatReadout | shared | primitive | implied by screens, not built | S09, S11
C134 | ProblemsPanel | unassigned | composition | implied by screens, not built | S10
C135 | CheckRow | shared | primitive | implied by screens, not built | S11, S22, S33
C136 | CentredColumn | shared | primitive | implied by screens, not built | S12, S13
C137 | AttachmentChip | unassigned | primitive | implied by screens, not built | S12
C138 | StepProgress | shared | primitive | implied by screens, not built | S13, S14, S34
C139 | SettingRow | shared | composition | implied by screens, not built | S17, S18, S27, S28
C140 | SiteFooter | share | primitive | implied by screens, not built | S18, S30
C141 | SectionNav | shared | composition | implied by screens, not built | S23, S28, S29, S35
C142 | WindowFrame | app-shell | composition | implied by screens, not built | S25, S26
C143 | QuickCapture | unassigned | composition | implied by screens, not built | S26
C144 | ThemeInit | unassigned | primitive | exists | S27
C145 | ThemeTokens | unassigned | primitive | exists | S27
C146 | SectionLabel | shared | primitive | implied by screens, not built | S28, S36, S37, S38
C147 | AccountBlock | unassigned | composition | implied by screens, not built | S28
C148 | ProfilePage | share | composition | implied by screens, not built | S30
C149 | ConfigShell | unassigned | composition | implied by screens, not built | S35, S36, S37, S38
C150 | PendingChangesBar | unassigned | composition | implied by screens, not built | S35
C151 | GrantExceptionDialog | unassigned | composition | implied by screens, not built | S38
C152 | AuditLog | unassigned | composition | implied by screens, not built | S38
C153 | HomeScreen | unassigned | composition | implied by screens, not built | S02, S03
C154 | GitHubSignInButton | auth | primitive | implied by screens, not built | S01

## 3. The contract

C-id | props with types and defaults | variants | states | accessibility contract | when NOT to use it
C001 | `name: IconName`, `size?: number = 16`, `style?: CSSProperties`, `className?: string` | none | none | Decorative by default. The caller labels the control, not the glyph | Never for a new icon. `C002` carries the official Material paths; `C001` holds a hand-copied subset
C002 | `name: string`, `size?: number`, `fill?: boolean`, `weight?: 300 \| 400 \| 500 \| 600 \| 700`, `className?: string`, `title?: string`, `style?: CSSProperties` | outlined, filled | none | Inline SVG, never a web font, so it renders with no network. `title` makes it announced; without it, it is decorative | Never for a brand mark. Google, GitHub and the frontmatter mark are not Material Symbols
C003 | none | none | none | Inherits. Adds nothing | Never put logic here. It renders `C004` and nothing else
C004 | none | desktop three-pane, phone drawers | drawer open, drawer closed, right pane hidden, sidebar, scroll | Drawers need a focus trap and a labelled dismiss. **Neither exists today** | Never add a fourth pane. The grid is three columns by contract
C005 | none | none | none | None today. It mounts eight dialogs and labels none of them | Never render a screen here. It is a mount point for overlays
C006 | `open: boolean`, `onClose: () => void` | none | closed, open, filtering, no match | Needs `role="dialog"`, `aria-modal`, a focus trap and a labelled list | Never for searching documents. That is `C008`
C007 | `open: boolean`, `onClose: () => void` | none | closed, open, filtering, no match | As `C006` | Never alongside `C006` on one screen. Two command surfaces is the confusion the founders named
C008 | `open: boolean`, `onClose: () => void` | none | closed, open, loading, results, no match | Results are a `listbox` with `aria-selected` on the active row | Never for commands. That is `C006`
C009 | `open: boolean`, `onClose: () => void` | none | closed, open, saving, saved, error | Dialog semantics, and a labelled nav between the ten sections | Never for a per-document setting. Settings live on the account
C010 | `open: boolean`, `onClose: () => void` | none | closed, idle, picking, uploading, partial, done, refused | Progress needs `aria-live` so a screen reader hears the count move | Never for a single file drop. That is `C085` on the workspace
C011 | `open: boolean`, `onClose: () => void` | none | closed, scanning, findings, none, fixing | Dialog semantics. Each finding is a labelled action | Never as the problems panel. It is one check of many, and `C095` is the row
C012 | none | none | resting, active | Needs a label. It is an icon with no text | Never as a second entry to the map. One control
C013 | none | none | open, closed | `aria-pressed` reflects the pane, and it does | Never on the phone. The drawer has its own control
C014 | none | none | open, closed | `aria-pressed`, present | Never together with `C015`. They fight over the same pane
C015 | none | none | hidden, sidebar, scroll | A three-state control needs its current state announced, not just pressed | Never where two states are enough. Use `C014`
C016 | none | none | on, off | `aria-pressed`, present | Never as a general appearance control. That is `C018`
C017 | none | none | idle, scrolling | Decorative. Must not take focus | Never as a scrollbar replacement on the phone
C018 | none | none | light, dark | `aria-pressed`, present. The stored theme must apply before first paint | Never more than one per document. The setting is on the account
C019 | none | none | none | No UI, so none | Never render anything from it
C020 | none | none | none | No UI, so none | Never in the web build path. It is the Tauri bridge
C021 | none | none | idle, working, unavailable | Needs a label and a busy state | Never as the AI box of S06. It is a button, and `C091` is the box
C022 | none | none | idle, signing in, refused | The one heading, the two buttons and the fine print all need to be reachable in order | Never for re-authentication inside the app. That is a dialog
C023 | `gateway: AuthGateway`, `onSignedIn?: (user: AuthUser) => void`, `label?: string` | default label, custom label | idle, pending, error | Brand mark is decorative. The button carries the words | Never with a password field beside it. One tap is the contract
C024 | none | none | idle, submitting, refused | A labelled form with an error region | **Never on a product surface.** It contradicts `F103`, and section 5.2 records that
C025 | none | one pane, split, two notes | loading, ready, stale path, saving | The mode segment is a `tablist`. The panes need labels | Never render two of these. It owns the active view singleton
C026 | `path: string`, `initialContent: string`, `baseSha: string`, `completionData?: CompletionData`, `livePreviewForced?: boolean = false` | markdown, live preview concealed | loading, ready, dirty, conflict | CodeMirror's own roles. The wrapper must not remove them | Never to render read-only markdown. That is `C034`
C027 | `extras?: React.ReactNode` | desktop twelve tools, phone seven | enabled, disabled by mode | Every tool is a labelled button, and they are | Never to hold a Doc-mode font control. That is `C079`
C028 | none | none | closed, open, running, suggestion shown, refused | `role="menu"` with `menuitem` children, and it has them | Never as the AI box. Seven verbs on a selection, nothing else
C029 | `path: string`, `open: boolean`, `onClose: () => void` | none | closed, loading, list, diff, restoring, empty | Dialog semantics. The version list is a `listbox` | Never for the change queue. History is what happened; `C119` is what is waiting
C030 | `content: string`, `onChange: (next: string) => void`, `onWikilink?: (target: string) => void`, `basenameToPath?: Map<string, string>` | none | rendering, editing a block | **None today.** The rendered surface carries no roles | Never in Edit or Split. Raw stays raw is the rule it exists to keep
C031 | `initial: string`, `onCommit: (next: string) => void` | none | editing, committing | **None today.** Needs a label saying what is being edited | Never for a whole document. It edits one block
C032 | none | none | closed, open, exporting, failed | `role="menu"`, and a busy label while a PDF renders | Never for the project archive. That is a separate route
C033 | `open: boolean`, `onClose: () => void` | none | closed, loading, graph, empty | A canvas graph needs a text alternative. **There is none** | Never as the project map of S16. `C113` carries governs and decisions
C034 | `content: string`, `onWikilink?`, `basenameToPath?`, `onToggleTask?`, `onEdit?`, `depth?: number` | reading, published | rendering, rendered | **None today.** Headings, lists and tables come out of the markdown with native semantics, which is most of the job | Never to edit raw markdown. That is `C026`
C035 | none | none | hidden, sidebar, scroll | Needs a landmark and a label. **Has neither** | Never to hold an AI panel. The rail is reference material
C036 | none | none | empty, headings, active heading | A navigation landmark with the current heading marked | Never as a table of contents in the document. That is the `[toc]` marker
C037 | none | none | empty, links | A labelled list | Never for outgoing links
C038 | none | none | empty, mentions, scanning | A labelled list | Never merged into `C037`. Linked and unlinked are different claims
C039 | none | none | empty, tags | A labelled list | Never as a filter for the tree
C040 | none | none | empty, bookmarks | A labelled list | Never as recent documents. Bookmarks are chosen
C041 | `content: string`, `onEdit?: (newContent: string) => void` | none | no front matter, reading, editing, invalid YAML | Each key is a labelled field | Never to hold document body content
C042 | `target: string`, `basenameToPath?: Map<string, string>`, `depth: number` | none | resolving, rendered, not found, depth exceeded | **None today.** Needs to announce that it is an embedded document | Never above the depth guard. Cycles are the reason it exists
C043 | `code: string` | none | rendering, rendered, parse error | **None today.** A diagram needs a text alternative | Never for a chart from a table. That is `C102`
C044 | `type: CalloutType`, `title: string`, `body: ReactNode` | note, warning, and the rest | none | The kind must be in the text, not only in the colour | Never for opaque data. That is a fenced block, by the settled carrier rule
C045 | `tableIndex: number`, `rows: string[][]`, `content: string`, `onEdit?`, `basenameToPath?`, `onWikilink?`, `depth?` | none | reading, editing a cell, saving | **None today.** A grid needs its roles, and an edited cell needs a label | Never as a database view. Front matter tables wait for a renderer
C046 | `embed: Embed`, `title: string` | youtube, and the rest | resolving, embedded, unsupported | **None today.** An iframe needs a title, and `title` is passed but not asserted | Never for an arbitrary URL. Only the detected kinds
C047 | none | none | clean, dirty, committing, failed | A labelled action with a busy state | Never as the change queue. It pushes, it does not review
C048 | `open: boolean`, `notePath: string`, `noteTitle: string`, `currentSlug?: string`, `onClose: () => void`, `onShared?`, `onUnshared?` | none | closed, idle, publishing, published, slug conflict, invalid slug | Dialog semantics, and an error region tied to the field | Never to add a person. `C114` carries people and roles
C049 | none | none | closed, open | `role="menu"` | Never as the share dialog
C050 | `conflicts: readonly SlugConflict[]`, `onResolved?: () => void` | none | none waiting, conflicts, resolving | Dialog semantics | **Never as the S31 conflict screen.** This resolves a slug claimed twice, not two versions of a document
C051 | `title: string`, `content: string`, `slug: string` | none | body, empty body | Landmarks for header, article and footer, and it has the elements | Never behind a gate, a redirect or a probe. That rule is absolute
C052 | `onOpen?: (path: string) => void` | desktop, phone drawer | loading, tree, empty, dragging | A `tree` role with expanded state on folders | Never to list ideas. Ideas are a separate collapsed section
C053 | none | none | idle, dialog open, confirming | It owns the dialogs, so it owns their focus | Never call it directly. It is reached through the window bridge
C054 | `node: TreeNode`, `depth: number`, `onOpen: (path: string) => void`, `dirtyPaths: ReadonlySet<string>`, `activePath: string \| null` | file, folder | resting, active, dirty, drag over, renaming | A `treeitem` with its level and expanded state | Never outside `C052`. It assumes the tree's drag rules
C055 | `items: MenuEntry[]`, `anchor: { x: number, y: number } \| "below"`, `onClose: () => void` | point anchored, below anchored | closed, open | `role="menu"`, and it has it | Never as a select. A menu performs, a select chooses
C056 | `message: string`, `confirmLabel: string`, `onConfirm: () => void`, `onCancel: () => void` | none | open | Dialog semantics, Escape cancels, and it does | Never for a reversible action. A confirm on everything trains people to click through
C057 | `title: string`, `label: string`, `initialValue: string`, `submitLabel: string`, `warning?: string`, `onSubmit: (value: string) => void`, `onCancel: () => void` | with warning, without | open, invalid | A labelled field with the warning tied to it | Never for more than one field
C058 | `message: string` | none | showing, gone | `role="alert"`, and it has it | Never for an error the person must act on. A toast is missable
C059 | `open: boolean`, `onClose: () => void` | none | closed, loading, items, empty, restoring | Dialog semantics, and a labelled list | Never as an archive. Trash has a thirty-day window
C060 | `children: ReactNode` | none | loading, ready, error | No UI, so none | Never nest two. One snapshot per workspace
C061 | `variant: 'primary' \| 'secondary' \| 'ghost' \| 'danger'`, `size: 'sm' \| 'md'`, `disabled?: boolean`, `busy?: boolean`, `children` | four variants, two sizes | resting, hover, focus, active, disabled, busy | A real `<button>`, a visible focus ring, and `aria-busy` while working | Never for navigation. A link that navigates is a link
C062 | `icon: string`, `label: string`, `pressed?: boolean`, `size: 'sm' \| 'md'` | toggle, action | resting, hover, focus, pressed, disabled | `label` is required, because there is no text. `aria-pressed` on a toggle | Never without a label. That is the failure this component exists to make impossible
C063 | `label: string`, `onClick`, `icon?: string` | plain, with icon | resting, hover, focus | A button, not a decoration | Never as a status. A chip is pressed
C064 | `label: string`, `tone: 'neutral' \| 'ok' \| 'warn' \| 'pro'` | four tones | none | The tone must also be in the words, never only in the colour | Never as a control. A pill is read, not pressed
C065 | `items: string[]`, `value: string`, `onChange` | two to four items | resting, selected, disabled | A `tablist` when it switches views, a `radiogroup` when it picks a value | Never with more than four items. Five is a menu
C066 | `open: boolean`, `onClose: () => void`, `title: string`, `size: 'sm' \| 'md' \| 'lg'`, `children` | three sizes | closed, open, closing | Focus trap, Escape, restore focus on close, `role="dialog"` and `aria-modal`. **The five existing modals each do part of this and none does all of it** | Never for a message. A dialog interrupts
C067 | `anchor: Element`, `open: boolean`, `onClose: () => void`, `children` | above, below, left, right | closed, open | Focus moves in, Escape returns it. Not modal | Never for a decision that must be made. That is `C066`
C068 | `open: boolean`, `onClose: () => void`, `children` | from the bottom, from the side | closed, open, dragging | As `C066`, and dismissable by gesture and by button | Never on the desktop. It is the phone form of `C066`
C069 | `title: string`, `body: ReactNode`, `action?: ReactNode` | plain, actionable | resting, hover when actionable | A heading inside, so it can be navigated to | Never as a button. If the whole card is clickable it is a link
C070 | `name: string`, `colour: string`, `size: number` | initials, icon | none | The name is in the text, not only in the tooltip | Never as the only identifier of an author
C071 | `form: 'mark' \| 'wordmark'`, `size: number` | mark, wordmark | none | Decorative beside a heading, labelled when it is the only title | Never in the workspace header as a wordmark. The mark is for the workspace, the wordmark for the door and the published page
C072 | `checked: boolean`, `onChange`, `label: string`, `disabled?: boolean`, `reason?: string` | plain, locked with a reason | on, off, disabled with a reason | A real checkbox or `role="switch"`, and the reason tied to it when locked | Never without a label. A bare switch is unreadable
C073 | `used: number`, `cap: number`, `label: string`, `resets?: string` | plain, near cap, over cap | under, near, over | `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and the numbers in text too | Never as a progress bar. A meter shows a level, not a task
C074 | `value: number`, `label: string`, `indeterminate?: boolean` | determinate, indeterminate | idle, running, done, failed | `aria-live` on the changing count | Never as a meter. Use `C073`
C075 | `tone: 'info' \| 'warn' \| 'offline'`, `message: string`, `action?: ReactNode` | three tones | showing, dismissed | `role="status"` for information, `role="alert"` for a warning | Never for an error inside a form. Put it beside the field
C076 | `tabs: Tab[]`, `share: boolean`, `presence?: Presence[]`, `extra?: ReactNode` | workspace, home (`homeTop()`, S02 and S03), settings and configuration with no share control, published page | resting, scrolled | A banner landmark | Never on the phone unchanged. The phone header is 52 px and carries the mode segment
C077 | `mode: 'edit' \| 'live' \| 'reading' \| 'split'`, `docSwitch: 'Markdown' \| 'Doc'`, `stats: string` | desktop, phone | one per mode | A `tablist` whose selected tab is the mode | Never to switch documents. It switches how one document is shown
C078 | `tabs: Tab[]`, `active: string`, `onSelect`, `onClose` | none | resting, active, dirty, overflowing | A `tablist` with a close button per tab, each labelled with the file name | Never to hold anything but open documents
C079 | none | first level, behind More | enabled, disabled | Every control labelled, and the More menu a real menu | Never in Markdown mode. Font, colour and alignment do not survive a text file
C080 | `pageSize: string`, `margins: string` | A4, Letter | reading, editing | The ruler is decorative and must be hidden from a screen reader | Never in Markdown mode
C081 | `comments: Comment[]`, `onResolve` | margin, inline on phone | empty, comments, resolved | Each comment is an article with its author named | Never to hold a change from the queue. A comment asks; a change edits
C082 | `items: [string, number][]`, `value: number`, `onChange` | two, three items | resting, selected, zero count | A `tablist`, with the count in each label | **Never where human and machine work would otherwise share one list.** That is the whole point of it
C083 | `projects: Project[]`, `ideasOpen: boolean`, `foot?: ReactNode` | workspace, unified cloud and local folders on the desktop build (S25) | loading, tree, empty, drop target | A navigation landmark holding `C052` | Never with a third button. Add file and Add idea, and nothing else
C084 | `title: string`, `icon: string`, `count?: number`, `open: boolean`, `children` | plain, with count | open, closed | A disclosure with `aria-expanded` | Never open by default. Every collapsible starts closed
C085 | `visible: boolean`, `message: string` | tree, empty state | resting, drag over | `aria-live` when a drag enters | Never as the only way to upload. Add file must also work
C086 | `title: string`, `bottom: string`, `children` | with bar, without | none | It is a drawing frame in the spec, and a layout in the app. Do not ship the frame | Never in the app. It exists so the screens can be drawn at 390 by 844
C087 | `active: 'home' \| 'search' \| 'ai' \| 'outline' \| 'more'` | none | one per destination | A navigation landmark with the current destination marked | Never on the desktop. Material's rule is under 600 dp
C088 | `side: 'left' \| 'right'`, `open: boolean`, `onClose` | left, right | closed, open, dragging | Focus trap while open, and a labelled dismiss | Never on the desktop. The panes are columns there
C089 | `items: Start[]` | five on the desktop, four on the phone | resting, hover | Each start is a labelled button | Never more than five. The founders' rule is a simple interface
C090 | `rows: Recent[]` | none | loading, rows, empty | A table with real headers | Never as search results
C091 | `target: Target`, `credits: [number, number]`, `chips: string[]` | new document, editing, idea | idle, typing, running, streamed, refused, over cap | The target line must be read before the input, so it comes first in the order | Never without `C092`. The box that does not name its target is the one the founders called confusing
C092 | `kind: 'writing' \| 'editing' \| 'idea'`, `name: string`, `selection?: string` | three kinds | resting, pinned | It is the first thing announced in `C091` | Never hidden, never scrolled away while an idea is in progress
C093 | `original: string`, `suggestion: string`, `onAccept`, `onReject` | inline, block | shown, accepting, rejecting | Accept and Reject are equal in the tab order as well as in weight | Never auto-accepting. Nothing reaches the file without a person
C094 | `providers: ProviderStatus[]` | chain, single | ok, degraded, refused, unknown | A list, with each state in words | Never to imply the person's document caused the failure
C095 | `severity: 'error' \| 'warn' \| 'note'`, `title: string`, `detail: string`, `line: number` | three severities | resting, hover, fixed | Severity in the text, not only in the dot colour | Never for a model's opinion without the Writing filter set
C096 | `files: InstructionFile[]`, `checks: Check[]` | one file, whole set | loading, healthy, findings | Each check states pass or fail in words | **Never implying that tidying the file makes the agent better.** Two studies say it does not
C097 | `value: View`, `onChange` | none | closed, open | A menu of six views | Never as the mode segment. Modes are how one view is edited
C098 | `phases: Phase[]` | none | empty, phases, no headings | The flow must also be readable as a list | Never as a general diagram. It reads headings, not a graph
C099 | `slides: string[]` | none | empty, slides | Each slide reachable in order | Never to invent syntax. It splits on a horizontal rule
C100 | `outline: HeadingEntry[]` | none | empty, map | A text alternative, which is the outline itself | Never as the project map
C101 | `columns: Column[]` | none | empty, columns | Drag must have a keyboard equivalent | Never as the only view of a task list
C102 | `tableIndex: number`, `kind: string` | bar, line, and the rest | no table above, rendered, bad data | The table above it is the text alternative, so it must stay visible | Never with data that is not in the document
C103 | `file: string` | inline, full | loading, drawing, saved | A drawing needs a description field, stored beside it | Never to hold text that belongs in the document
C104 | `ideas: Idea[]` | none | empty, ideas | A list with each state in words | Never as the document tree
C105 | `value: 'Low' \| 'Medium' \| 'High'`, `plan: Plan` | free, locked | resting, open, locked | The lock reason is announced with the option | **Never as three routes.** One selector, the way a model selector reads
C106 | `question: Question`, `index: number`, `onAnswer` | plain, branching | unanswered, answered, rewriting | The recommendation is marked in text as well as in style | Never more than four to a page
C107 | `reason: string` | none | blurring, blurred, done | The reason is announced, not only shown | Never as a loading state. It fires only when a rewrite actually happens
C108 | `page: number`, `total: number`, `skipAll: boolean` | page one, page two onward | resting, disabled | Skip, Choose the recommendation and Next are all real buttons | Never hiding Skip. Both appear on every page
C109 | `remaining: number`, `onConfirm`, `onCancel` | none | open | It must state what is being accepted, in plain words | Never as a routine confirm. It decides the rest of the blueprint
C110 | `decision: Decision` | Medium, High | resting, expanded | Evidence rows carry their date and their source | Never presenting a template's sources as pages that were opened
C111 | `files: KitFile[]` | fifteen files, example kit | listing, downloading | A tree, with each file's purpose in words | Never before the consistency check has run
C112 | `hash: string`, `tool: 'claude' \| 'cursor' \| 'codex'` | three tools | resting, copied | The hash must be selectable text, not an image | **Never without the hash.** The check is the only guarantee the kit is ours
C113 | `nodes: MapNode[]`, `edges: MapEdge[]` | none | loading, map, one node | A text alternative listing what governs what | Never counting data files as nodes. Twelve markdown documents, three data files
C114 | `people: Person[]`, `onInvite` | none | empty, people, not a user | Role is a labelled select per person | Never to manage link sharing. That is `C115`
C115 | `link: string`, `expiry?: string`, `password?: boolean` | read, edit | resting, copied, expired | The expiry and the password state are both in text | Never offering a password on Free. It is a Pro control
C116 | `target: 'app' \| 'web'`, `onDismiss` | app registered, not registered | hidden, showing, dismissed | It appears after first paint, so it must not steal focus | **Never before first paint, and never on a non-HTML route**
C117 | `slug: string`, `onSubmit` | none | idle, wrong, accepted | A labelled field with the error tied to it | Never on a page that is not password protected
C118 | `people: Presence[]` | header, inline cursors | alone, others present | Each person named in text | Never as the only signal that someone else is editing
C119 | `changes: Change[]`, `filter: 'all' \| 'people' \| 'ai'` | three filters | empty, changes, accepting, rejecting | Author kind in words on every row | **Never accepting in bulk across kinds.** Accept all is one named person's edits only
C120 | `left: string`, `right: string`, `mode: 'inline' \| 'side'` | inline, side by side | rendering, rendered | Added and removed announced as words, not as colour | Never as a merge tool. It shows, it does not decide
C121 | `sources: Source[]` | six sources | resting, picking, refused | Each source is a labelled button, and a refusal states its reason | Never hiding a source that is coming. Say it is coming
C122 | `connection: Connection` | drive, github, agents | connected, paused, revoked, later | The scope is in text, not in a tooltip | Never showing a token, ever
C123 | `plans: Plan[]` | free, pro, coming | resting, current | The price says it includes GST, in text | Never showing a price without the tax position
C124 | `rows: ConfigRow[]`, `locked: string[]` | limits, models, flags, accounts | reading, editing, saving, refused | Every cell is a labelled field, and a locked row states why. Provider order on S36 is set by dragging, so it needs a keyboard equivalent | **Never reachable without a founder role.** It sets every limit for every account
C125 | `onNewDocument: () => void`, `onUpload: (files: FileList) => void`, `onUploadFolder: (files: FileList) => void`, `onImport: () => void` | desktop button with a menu, phone sheet | closed, open, uploading | A button with `aria-haspopup="menu"` and `aria-expanded`. The menu is `role="menu"` with four `menuitem` children: New document, Upload files, Upload a folder, Import from | **Never a second home for upload.** S22 calls this the only home of upload; the drop target `C085` is the other way in, not a copy of this menu
C126 | `options: { value: string, label: string }[]`, `value: string`, `onChange: (value: string) => void`, `label: string`, `disabled?: boolean = false` | toolbar, setting row | closed, open, disabled | A native `<select>`, or a `combobox` with a `listbox`. `label` is required because the toolbar form shows only the value | Never for two to four options that switch a view. That is `C065`
C127 | `value: number`, `min: number`, `max: number`, `step?: number = 1`, `onChange: (value: number) => void`, `label: string` | none | resting, at minimum, at maximum, disabled | `role="spinbutton"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. Minus and plus are labelled buttons, and the arrow keys step | Never in Markdown mode. A size does not survive a text file, the same rule as `C079`
C128 | `value: string`, `onChange: (value: string) => void`, `onSubmit: () => void`, `placeholder: string`, `multiline?: boolean = true`, `bar?: ReactNode`, `disabled?: boolean = false` | one line with an arrow, composer with a bar row, capture field | empty, typing, submitting, disabled | A labelled `textarea`. The send arrow is a labelled button. S12 makes Command Enter the keyboard route to send | **Never sends on its own.** Nothing leaves before the arrow or the stated key, the rule S12 writes into its cost foot
C129 | `left: number`, `cap: number`, `unit: 'edit' \| 'blueprint'`, `cost?: number`, `provider?: string` | box foot, menu foot, allowance line | plenty left, low, none left | Plain text, the numbers in words as well as digits. `aria-live="polite"` so a change in what is left is heard | Never a literal number. It reads the entitlement, as S34 requires. Never for a sentence with no live figure in it, which is `C130`
C130 | `children: ReactNode`, `tone?: 'plain' \| 'fine' \| 'foot' = 'plain'`, `icon?: string` | plain, fine print, foot line | none | Plain text in reading order. An icon beside it is decorative. A link inside it is a real link | Never for a live count or a cost, which is `C129`. Never a control. **Never optional where a screen says it is not**, as S11 does of its honesty footer
C131 | `title: string`, `lede?: string`, `aside?: ReactNode`, `level?: 1 \| 2 = 1` | title alone, with a lede, with an aside | none | One real heading element at the stated level. The lede is a paragraph, never a second heading | Never inside a card, a row or a dialog. A small heading inside a section is `C146`, and a dialog's title belongs to `C066`
C132 | `reason: string`, `errorId: string`, `onDismiss: () => void` | none | showing, dismissed | `role="alert"`. Focus moves to it, because it takes the place of the decision pair the person was about to use | **Never as a toast.** S07 shows it in place of Accept and Reject, where the person is already looking
C133 | `items: [string, number][]` | toolbar, tree foot, panel head | none | The counts are text, each with its noun | Never computed twice. S09 and S11 show the same numbers in two places, so both read one value or they drift apart
C134 | `problems: Problem[]`, `filter: 'all' \| 'checks' \| 'writing'`, `onFilter: (filter: string) => void`, `onFixAllSafe: () => void` | desktop rail, phone drawer | loading, findings, none, fixing | A labelled region. The list is a list of `C095` rows, and `C082` above it is a `tablist` | **Never applies an ambiguous fix.** Fix all safe applies only unambiguous ones, per S10. Never the instruction-file panel, which is `C096`
C135 | `state: 'ok' \| 'warn' \| 'off' \| 'refused'`, `title: string`, `detail?: string`, `actions?: ReactNode` | plain, with actions | ok, warn, off, refused | The state is in the words as well as the icon. Actions are labelled buttons | Never for a problem in a document, which is `C095`. Never for a person's change, which is a row of `C119`
C136 | `width?: 'normal' \| 'wide' = 'normal'`, `children: ReactNode` | normal, wide | none | A `main` landmark when it is the body of the page | Never with a panel beside it. S12 draws it with nothing beside it on purpose
C137 | `name: string`, `kind: 'drawing' \| 'document' \| 'repository'`, `purpose: string`, `thumbnail?: string`, `onRemove: () => void` | drawing, document, repository | attached, removing | The purpose is text, not a tooltip. Remove is a labelled button | Never as a template chip, which is `C063`. An attachment is the person's own material
C138 | `current: number`, `total: number`, `labels?: string[]`, `aside?: ReactNode` | pages, stages | resting | The position in words, such as page 2 of 4. The bar itself is `aria-hidden` | Never as a meter, which is `C073`. It shows a place in a run, not a level
C139 | `label: string`, `help?: string`, `control: ReactNode`, `locked?: boolean = false`, `reason?: string` | with a switch, with a select, with a link | resting, locked with a reason | The label names the control, and the help line is tied to it with `aria-describedby`. A locked row states its reason in text | Never with two controls. S28 puts exactly one control on the right of each row
C140 | `plan: 'free' \| 'pro'`, `links: { label: string, href: string }[]` | with the made-with line, without it | none | A `contentinfo` landmark | Never inside the workspace. It closes a published page. The made-with line is absent on Pro, per S30
C141 | `items: { id: string, label: string, icon: string }[]`, `current: string`, `onSelect: (id: string) => void` | settings, configuration, phone list | resting, current | A `nav` landmark with a label, and `aria-current` on the current entry | Never for documents, which is `C083`. Never more sections than a screen names: ten for settings, five for configuration
C142 | `platform: 'mac' \| 'windows' \| 'linux'`, `children: ReactNode` | mac, windows, linux | none | None. It is drawing furniture in the spec, and the platform draws the real window | **Never in the app.** Like `C086`, it exists so a screen can be drawn. Section 5.4 already names `.macwin` and `.capwin` as furniture
C143 | `destination: string`, `onChangeDestination: () => void`, `onSave: (text: string) => void`, `onCancel: () => void`, `source?: string` | desktop panel, phone share sheet | open, saving, queued offline, saved | Focus lands in the field on open. Enter saves and Escape closes and keeps nothing, per S26 | Never a window. S26 calls it a panel over an untouched desktop. **Never spends a credit**
C144 | none. It is `public/theme-init.js`, an inline script, not a React component | none | none | No UI, so none | Never replaced by a React effect. It must add the theme class before first paint, which is why it runs outside React
C145 | none. It is the custom-property layer in `src/app/globals.css` plus the `themeColor` entries in `src/app/layout.tsx` | light, dark, match-system fallback | none | Contrast belongs to `58-DESIGN-SYSTEM.md`, not to this row | **Never define a colour here.** The values live in `src/app/globals.css` and `58-DESIGN-SYSTEM.md`. The row exists so that S27's anatomy has an id
C146 | `text: string`, `level?: 2 \| 3 = 3` | settings group, configuration block | none | A real heading at the level below its section, so a screen reader can jump to it | Never as a page title, which is `C131`
C147 | `name: string`, `email: string`, `provider: 'google' \| 'github'`, `onDelete: () => void` | none | resting, confirming delete, deleting | The provider is named in words. Delete opens `C056` and states what is lost | **Never offers a password change.** There is no password, per `F103`
C148 | `name: string`, `title: string`, `links: Link[]`, `projects: Project[]`, `writing: Post[]`, `plan: 'free' \| 'pro'` | Free, Pro | rendered, a section empty | Landmarks as `C051`. Each project card and each post carries a heading | **Never edited through a form.** S30: the person edits the markdown file, and this is its projection
C149 | `section: string`, `children: ReactNode` | desktop, phone read-only | none | Composes `C076` and `C141`, so it carries a banner and a nav landmark | **Never reachable without a founder role**, the same rule as `C124`
C150 | `changes: ConfigChange[]`, `overCap: string[] \| null`, `onSeeWho: () => void`, `onSave: () => void`, `onDiscard: () => void` | none | none pending, pending, impact unknown, saving, refused | A labelled region fixed to the foot of the page. The count and the impact are text | **Never saves with the impact unknown.** S35 disables Save when the impact cannot be computed, because an unknown blast radius is not a small one
C151 | `account: string`, `limit: string`, `value: number`, `until: string`, `reason: string`, `onGrant: () => void`, `onCancel: () => void` | none | open, invalid, granting | Built on `C066`. Every field is labelled, and the expiry is required | Never without an expiry. S38 says an exception carries one, and states what happens when it lapses
C152 | `entries: AuditEntry[]` | full log, per-row last change | loading, entries, empty | A table with real headers, read-only | **Never editable.** S38 draws it read-only, and an audit you can edit is not an audit
C153 | `recent: Recent[]`, `tab: 'documents' \| 'ideas' \| 'shared'`, `counts?: [number, number]` | first time, returning | empty, rows, drag over | A `main` landmark. The whole page is the drop target on S02, so the same upload must be reachable from a button | Never edits a document. It opens one. The workspace is `C004`
C154 | `onSignedIn?: (user: AuthUser) => void`, `label?: string` | default label, custom label | idle, pending, error | As `C023`. The GitHub mark is decorative and the button carries the words | Never with a password field beside it, as `C023`. Today the button is drawn inline in `src/modules/auth/presentation/LoginScreen.tsx`, near line 119, and has not been extracted

## 4. The counts

Kind | Count
Total | **154**
`exists` | **62**
`implied by screens, not built` | **92**
`primitive` | **61**
`composition` | **93**

**Re-derive** with
`grep -cE '^C[0-9]{3} \| .* \| exists \| ' docs/pack/14-COMPONENT-INVENTORY.md`, then the same
with `implied by screens, not built`, and
`grep -cE '^C[0-9]{3} \| [A-Za-z]+ \| [a-z-]+ \| primitive \| ' docs/pack/14-COMPONENT-INVENTORY.md`
with `composition` in its place. The old command matched ticked ids and returned 0, because the
ids in both tables are bare.

Module | Existing components
`app-shell` | 18
`preview` | 13
`vault` | 9
`editor` | 7
`auth` | 3
`share` | 4
`shared` | 2
`ai-tools`, `export`, `graph`, `repository` | 1 each
`drafts`, `mdmax` | **0**
Outside `src/modules`, marked `unassigned` | 2, `C144` in `public/theme-init.js` and `C145` in `src/app/globals.css`

**Two modules have no presentation layer at all.** `src/modules/drafts` exports only a `Draft` type
and `src/modules/mdmax` exports nothing. Both have an empty `presentation/` directory.

## 5. What the two sources disagree about

### 5.1 There is no design system, only 60 components built one at a time

The screens draw one button. The code has none. `grep -c 'btn'` over `gen.mjs` finds the class 88
times, and `find src/shared/presentation -name 'Button*'` finds nothing. Every button in the app is
a bare element with inline styles, and every one of the five modals builds its own overlay, its own
Escape handler and its own focus behaviour.

**Consequence, and it is measurable.** Twenty of the sixty existing components have no `aria`
attribute and no `role` at all, from
`for f in $(find src/modules/*/presentation src/shared/presentation -name '*.tsx'); do grep -q 'aria-\|role=' "$f" || echo "$f"; done | wc -l`.
They are listed in section 5.3. A shared `C061` and `C066` would have carried that for all of them.

**The proposal, and it is the cheapest thing in this file.** Build `C061`, `C062`, `C066`, `C067`
and `C072` first, in `src/shared/presentation/`, and migrate the existing components onto them. Five
components close most of the accessibility gap and remove five copies of the same overlay code.

### 5.2 The password form contradicts the front door

`C024` `PasswordLoginForm` exists and is reachable. `docs/mvp0/PRODUCT-PLAN.md` section 5 onward specifies
no password, and `F103` in `10-FEATURE-REGISTER.md` carries that promise. The component's own comment
calls it a fallback for environments where the GitHub callback is unreachable.

**Recorded, not resolved.** Either it goes before the first stranger signs in, or the promise on S01
is narrowed. It is not for this file to choose.

### 5.3 Twenty components carry no accessibility contract in code

`TauriBridge`, `PWARegister`, `AppShell`, `KnowledgeUI`, `SnapshotProvider`, `CodeMirrorEditor`,
`EmbeddedNote`, `UnlinkedMentions`, `Markdown`, `Backlinks`, `RightPane`, `KnowledgePanels`,
`Outline`, `mermaid-block`, `LivePreview`, `InlineBlockEditor`, `embeds`, `wikilinks`,
`editable-table`, `components`.

**Three of those are fine.** `TauriBridge`, `PWARegister` and `SnapshotProvider` render nothing.
`CodeMirrorEditor` inherits its roles from CodeMirror. The remaining sixteen are real gaps, and the
`accessibility contract` column marks each one **None today**.

### 5.4 The generator names elements the plan never described

`gen.mjs` declares 283 class selectors. This inventory names 64 implied components, so roughly four
classes collapse into one component. Some classes have no component here at all, among them
`.macwin`, `.capwin`, `.lights` and `.homeind`, which draw a macOS window frame and a phone home
indicator. **Those are drawing furniture, not product**, and `C086` says so. The reconciliation
in 5.5 gave the desktop furniture its own row, `C142`, under the same never-in-the-app rule.

### 5.5 The screens invented their own ids, and this file absorbed them

The 38 screen specs were written in parallel with this file. Each allocated a private block of
`C` ids, so the screens cited **237 distinct ids** across **411 screen and id pairs**, and 140 of
the ids had no row here. Worse, a private id could sit inside `C001` to `C124` and mean something
else: S04's `C040` is the app header, while this file's `C040` is `BookmarksPanel`.

The fix, recorded in full in `docs/pack/tools/component-reconciliation.md`:

- **`docs/pack/tools/component-map.json`** maps every id on every screen to its row here, keyed by
  screen because one token means different things on different screens.
- **80 existing rows** absorb most of the 237. **30 new rows**, `C125` to `C154`, carry the rest.
- **139 pairs were collisions**: an id inside this file's range that meant a different component
  on the screen. The map redirects each of them.
- No id here was renumbered, and the `screens` column of 32 existing rows was widened to name the
  screens that now point at them.

Counts come from the map, with the script in section 5 of the reconciliation file.

## 6. The limits of this inventory

- **Not assessed:** whether any existing component is well built. This is an inventory, not a review.
- **Not yet applied:** the screens still carry their private ids until the map is applied to them.
  Until then a screen's `C` id is read through `component-map.json`, not directly.
- **A judgement, not a fact:** which screen regions share a component. Thirty new rows over 237
  screen ids is one reader's grouping. `C130` `Note` and `C131` `PageHeading` in particular exist
  so the map can be total; plain text is barely a component.
- **Could not be verified:** the `states` column for the 92 unbuilt components. Those are read from
  the screen images and the generator, so a state the screens never drew is not listed. Cross-check
  against `13-SCREEN-STATE-MATRIX.md`, which found 213 unspecified screen states, and expect the
  unbuilt components to grow states as those holes close.
- **Not established:** the module for 28 components marked `unassigned`, from
  `grep -c '^C[0-9]\{3\} | [A-Za-z]* | unassigned |' docs/pack/14-COMPONENT-INVENTORY.md`, which
  returns 30, less `C144` and `C145`, which exist outside `src/modules`. The earlier figure of 22 did
  not match its own table, which held 19. They belong to features that
  have no module yet, ideas and review among them. Assigning them is an architecture decision, and
  `AGENTS.md` section 2 says a new god folder is not the answer.
- **A proxy, and labelled one:** `source: exists` means a file of that name exports that symbol. It
  does not mean the component matches the screen it is listed against. `C050` is the clearest case:
  it exists, it is listed on S31, and it solves a different problem from the one S31 draws.
- **What would falsify a row:** opening the file and finding different props. Re-derive the whole
  `exists` half with
  `find src/modules/*/presentation src/shared/presentation -name '*.tsx' | sort`
  and read each file's own `Props` type.
- **What would falsify the count of 92 implied:** a different reading of `gen.mjs` and the screens.
  The mapping from 283 classes to 64 components, then from 237 screen ids to 30 more, is a judgement made once, in this session, and another reader would
  draw the lines differently. The classes are the fact; the components are the proposal.
