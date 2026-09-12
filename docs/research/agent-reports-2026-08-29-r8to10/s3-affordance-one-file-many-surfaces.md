I mutated nothing: all work was `curl`, `grep`, `sed`, `perl`, `pdftotext` to stdout and read-only `Read`/`Bash` inspection; no files written, no commits, no pushes — the reported `~/.claude` dirt is not mine.

### Evidence ledger (what was opened, 2026-08-29)

| Source | Access | Tag |
|---|---|---|
| Sellen, Kurtenbach & Buxton 1992, *Human-Computer Interaction* 7(2):141–164, DOI 10.1207/s15327051hci0702_1 | full PDF text extracted from `billbuxton.com/ModeErrorsHCI.pdf` | [fetched] |
| Wikipedia *Mode (user interface)*, rev. 1327521622, last edited 2025-12-14 | full text | [fetched] |
| Crossref metadata: Norman 1981 *Psych. Review* 88:1–15; Norman 1983 *CACM* 26(4):254–258; Sarter & Woods 1995 *Human Factors* 37:5–19; Baldonado/Woodruff/Kuchinsky 2000 *AVI* 110–119 | API | [fetched] |
| Nielsen 1995 *Spring-Loaded Modes*; NN/g 10 Heuristics (#1, #3) | nngroup.com | [fetched] |
| Notion: *Views, filters, sorts & groups*; *Intro to databases* | notion.com/help | [fetched] |
| Obsidian Bases: `Introduction to Bases`, `Bases syntax`, `Views`, `Create a base` | raw source, obsidianmd/obsidian-help | [fetched] |
| obsidian-kanban: repo metadata, `src/parsers/common.ts`, `src/main.ts`, issues #578/#644/#666/#732, PR #1221 | GitHub API + raw | [fetched] |
| VS Code: release notes v1.44 (`View: Reopen with`, `workbench.editorAssociations`), `docs/languages/markdown.md` | raw, microsoft/vscode-docs | [fetched] |
| Google Docs *Suggest edits*; Gmail *Create & manage labels*; Excel *Create a chart from start to finish*; Figma *Apply changes to instances*; Marpit *Directives* | vendor docs | [fetched] |
| **Baldonado 2000 full text** — ACM PDF returned HTTP 403 | **not opened; its eight rules are NOT quoted here** | — |
| **Apple Finder view-switcher page** — both URL forms returned the guide index, not the article | **not opened; no Finder claim made** | — |
| **Airtable view-type / personal-view docs** — 7 slugs probed, all HTTP 404 | **not opened; no Airtable-specific claim made** | — |
| **Craft view options** — help-center search API returned empty | **not opened** | — |

### 1. View-switching mechanisms in shipped products

| Product | The control | Placement | Discoverability | Documented confusion |
|---|---|---|---|---|
| **Notion databases** | Named view tabs + `+` to add a view; layouts Table/Board/Timeline/Calendar/List/Gallery/Chart [fetched] | Above the database, top-left | High — tabs are persistent and named. But: "Depending on your screen size, you may have to click on the name of your current view and select **New view**" [fetched], i.e. the control collapses on narrow screens; inline databases hide "controls and menus… until you hover" [fetched] | View config is **shared mutable state**. Notion shipped two containment mechanisms for this: a `Can edit content` permission tier that explicitly cannot "Change filters or sorts", and **Lock views** — and its own doc concedes "anyone with editing access can toggle this lock on or off at any time" [fetched] |
| **Obsidian Bases** (core plugin) | View menu in a base toolbar; layouts Table/Cards (app 1.9), List/Map (1.10) [fetched] | Toolbar, top-left of the base | Config lives **outside the note** — a `.base` YAML file, or a ```base fence embedded in a note [fetched]. "The first view in your list of views will load by default" [fetched] | Forum feature requests returned by search include *"Bases: remember the last selected view"*, *"Bases: set the tab title to the currently selected view name"*, *"Renaming Bases view does not update its name in the embeds"*, *"Nesting base view in file/template"* [fetched — titles verified; per-title vote/date pairing NOT verified, so no counts asserted]. All three are **state-visibility and reference-integrity** complaints |
| **obsidian-kanban** (the closest analog to frontmatter) | Frontmatter key `kanban-plugin`; new boards seeded with `---\n\nkanban-plugin: board\n\n---` [fetched, `parsers/common.ts:9,25`]. Context menu "Open as kanban board" / "Open as markdown"; commands `toggle-kanban-view`, `convert-to-kanban`, `view-board`, `view-table`, `view-list` [fetched, `main.ts:403,438,596,665–697`] | File context menu + command palette | The file *declares* its own renderer — exactly the frontmatter thesis. 4,483 stars, pushed 2026-03-06, 600 open issues [fetched, GitHub API 2026-08-29] | **#732** (open, 2023-02-09, 7 comments): "When switching to markdown view, the menu emtry to switch back is missing" — one-way escape hatch. **#644** (open, 2022-09-27, 14 comments): switching board→note→board breaks until restart. **#666** (open, 2022-10-20): switching away loses reading-mode status in split panes. **#578** (closed, 2022-07-01): "Can't get out of error state if Kanban visible in more than one pane". **PR #1221** (open, 2026-07-09): "clear stale `kanbanFileModes`" — a per-file mode cache going stale [all fetched]. It also writes app junk into the file: `%% kanban:settings ``` {json} ``` %%` [fetched, `settingsToCodeblock`] |
| **Google Docs modes** | A button in the top-right **labelled with the current state**: "click **Editing** → select **Suggesting**" [fetched] | Top-right, persistent | Mode is named, not iconified; suggestions render in a new color with strikethrough deletions [fetched] | Mode is granted by *permission*, so the mode you get is set by another person. Preview-before-commit exists: Tools → Review suggested edits → "preview what your document will look like with or without the changes" [fetched] |
| **VS Code custom editors** | `View: Reopen with` (shipped v1.44) + `workbench.editorAssociations`; `"*.md": "vscode.markdown.preview.editor"` makes preview the default, and "You can still use **View: Reopen Editor With…** to switch an individual editor back to the text view" [fetched] | Command palette; config in settings | Low discoverability, **maximum reversibility** — the client, not the file, owns the default, and the escape is always one command | `workbench.diffEditorAssociations` had to be added because diffs needed a different default from opens [fetched] — evidence that one association per file type is under-specified |
| **Excel table → chart** | Select data → **Insert → Recommended Charts** → "Select a chart on the Recommended Charts tab, **to preview**". `ALT+F1` creates one immediately "but it might not be the best chart for the data" [fetched] | Ribbon, after a selection | Selection-first: the affordance appears because you selected something | **Additive, not modal** — the chart is a new object; the sheet remains a sheet. No mode error is possible because nothing was replaced |
| **Figma component instances** | Instance inherits from a main component; some properties overridable, layer order/z-index is not — "you must **detach** the instance" [fetched] | Right panel + right-click | Reset → *Reset [property]* / *Reset all changes* [fetched] | **Change preservation is name-matching, and it silently fails**: Figma's own worked example preserves a fill change from `#1BC47D` → `#F531B3` on Step 3 but not Step 4, because the target variant started from `#FFFFFF` [fetched]. Overrides survive or evaporate on rules the user cannot see |
| **Gmail labels vs folders** | Label list in the left rail; a message can carry many labels | Left rail | Google's doc leads with the disambiguation: "**Labels are different from folders.** Only you can access your labels" [fetched] | The one-object-many-views hazard, stated by the vendor: "When you delete an email, it's removed from **every** label and your inbox" [fetched]. Also: "Label visibility depends on your conversation view settings" [fetched] — a second, orthogonal mode changes what the first one shows |
| **Marp / Marpit** | `marp: true`-style front-matter directives; front-matter "must be the first thing of Markdown, and between the dash rulers" [fetched] | In the file | The file declares that it is a deck | Marpit's own doc carries the warning "**Please not confuse to the ruler for paging slides**" [fetched] — the projection's delimiter collides visually with the frontmatter fence. Markdown-as-projection has a syntax-ambiguity tax |

### 2. Source disagreements (recorded, not resolved)

| Claim | Source A | Source B |
|---|---|---|
| Sellen 1992 citations | Crossref `is-referenced-by-count` **95** | Semantic Scholar `citationCount` **179** |
| Sarter & Woods 1995 citations | Crossref **614** | Semantic Scholar **987** |
| Baldonado 2000 citations | Crossref **454** | Semantic Scholar **899** |
| obsidian-kanban activity | frontmatter PRD §9.2: "2.6M downloads, last release 26.9 months ago" [PRD, fetched by an earlier agent] | GitHub API 2026-08-29: 4,483 stars, `pushed_at` 2026-03-06, `archived: false`, org renamed to `community-archive` [fetched] — pushes ≠ releases; both can be true |

### 3. The mode-error literature, and what it actually licenses

- **Definitions.** Tesler: a mode is "a state of the user interface that lasts for a period of time, is not associated with any particular object, and has no role other than to place an interpretation on operator input" [fetched]. Raskin's test is sharper and is the one to design against: an interface is modal w.r.t. a gesture when (1) the current state is **not the user's locus of attention** and (2) the same gesture produces different responses depending on that state [fetched].
- **The load-bearing experiment.** Sellen 1992, vi-style insert/command modes, two experiments [fetched]. Both kinesthetic and visual feedback reduced mode errors (pedal vs keyboard `F(1,11)=20.74, p<.001`; visual present vs absent `F(1,11)=11.40, p<.003`). **The effect sizes are the point.** Omega-squared: mode-switch method **15.6%** (liberal) / **11.0%** (conservative) of variance; visual feedback **4.8%** / **4.1%** [fetched].
  - [derived] 15.6 ÷ 4.8 = **3.25×**; 11.0 ÷ 4.1 = **2.68×**. User-maintained state is worth roughly **three visual indicators**.
  - [derived] 15.6 + 4.8 = 20.4% explained → **~79.6% of mode-error variance is explained by neither feedback channel.** Feedback is not a fix; it is a partial mitigation.
  - The visual condition was not subtle: it "involved changing the **entire screen area pink**", and the authors draw the explicit conclusion — "This has important implications for systems which rely on more subtle visual cues such as changing the shape of the cursor or the color of the menu bar" [fetched].
- **Experiment 2 isolates the mechanism.** A non-latching (held) pedal beat a latching pedal, and under the conservative criterion the latching pedal was **statistically indistinguishable from the keyboard** (`p < .33`) [fetched]. It was not the pedal; it was that the state had to be actively sustained. Verdict: "**user-maintained mode states prevent mode errors more effectively than system-maintained mode states**" [fetched].
- **Quasimodes.** Raskin's term for user-sustained modes; Nielsen calls spring-loaded modes "a major exception to the rule that modes cause usability problems: because the user needs to do something active to keep the mode in effect, there is little risk that the user will forget about the mode" [fetched].
- **Reversibility beats confirmation.** Wikipedia, citing Aza Raskin and Norman 1983 (*CACM* 26(4):254–258 [fetched, Crossref]): modal confirmation for destructive actions is "criticised as ineffective… due to habituation. Actually making the action reversible (providing an 'undo' option) is recommended instead" [fetched]. Norman's second lever: help users build an accurate mental model so they can **predict** the mode [fetched].
- **Visibility, in the vendor's own words.** NN/g #1: "The design should always keep users informed about what is going on"; #3: users "need a clearly marked 'emergency exit' to leave the unwanted action without having to go through an extended process" [fetched].
- **Severity is a function of irreversibility, not of the mode.** The catalogued mode-confusion casualties — AF447, Asiana 214, the Kiel Canal *Red7 Alliance*, USS *John S. McCain* (helm control "redistributed between bridge stations, and the bridge crew was not fully aware"), *VOS Stone*, the F-35A at Eglin, HMNZS *Manawanui* [fetched] — share one property: no undo. **A byte-preserving splice engine with one-keystroke undo is already most of frontmatter's mode-error defence.**
- Baldonado 2000 is the canonical multiple-views guideline paper (454/899 citations, above); **its rules were not opened here and are deliberately not quoted.**

### 4. Concrete design for frontmatter

**4.1 The invariant that dissolves most of the problem.** Under Raskin's test, a projection is only a mode if a gesture changes meaning. So: **typing always inserts text, in every projection.** The board never captures the keyboard as a control surface; drag-and-drop and card-click are gestures that do not exist in text view. Zero gesture overlap ⇒ modeless by definition, and the 79.6%-unexplained-variance problem never arises because there is no mode to be wrong about. [inference, grounded on the Raskin definition and the Sellen effect sizes]

**4.2 Where the control lives.**
- One control, in the document title bar, **left-aligned, always present on every file**, labelled with the **current** state — `Text`, `Board`, `Calendar`, `Decision`. Copy Google Docs' "the button says *Editing*" pattern [fetched], not a toggle whose label names the destination.
- Clicking it lists only the projections **this file's own content can satisfy**, each with a computed reason line: "Board — 3 `status` values, 12 list items". Non-satisfiable entries are shown disabled with the missing precondition. The menu is the schema documentation; there is no settings page.
- Keyboard: one chord per profile (`⌘1` text, `⌘2` board, …), plus a **held-key peek** (`⌘⇧` held) that renders the projection over the text and snaps back on release. That peek is the quasimode, and it is the cheapest correct thing in this entire document per Sellen (~3× the leverage of any badge).
- Nothing else. No tab strip, no `+ New view`, no view names.

**4.3 How a user learns a file can be a board** — five rungs, no tour:
1. The control exists on every file from the first launch, so its location is learned once.
2. It **enables itself** when the content qualifies — self-evidence, but weak on its own (visual = 4.8% of variance), so it is never the only rung.
3. **One inline ghost line at the point of authorship**, at most once per workspace, dismissible permanently: immediately after the user types the third distinct `status:` value or the second `## Column`, a dimmed line appears *at that block* — "3 columns · ⌘2 for board". Recognition, in the locus of attention, not a toast in a corner.
4. **Command palette entries** named `Board`, `Calendar`, `Decision card`, shown disabled-with-reason when the file does not qualify — the disabled state teaches the precondition.
5. **Templates**: `new board` emits a file whose *text* is already board-shaped. The user learns the markdown shape, not a feature.

**4.4 What happens when a board file is opened in a dumb editor.** The hard requirement: **a board must be a good markdown document first, and the projection must add zero bytes.**
- Board ⇒ `## Column` headings + `- [ ] item`; calendar ⇒ items carrying `date:`/`due:`; decision ⇒ MADR headings. All of it renders correctly in GitHub, Obsidian, Bear, `less`, `vim`.
- **No `%% frontmatter:settings %%` block, ever.** obsidian-kanban's `settingsToCodeblock` writes a JSON blob into the document [fetched]; that blob is visible junk in every foreign renderer and is exactly the kind of app-owned state the "file is the only source of truth" rule forbids.
- Last-used projection, column widths, collapse state, scroll: **app-local, keyed by path + content hash**. Never in the file.
- `render:` is a **hint, not an instruction.** The client owns the default (VS Code's `editorAssociations` model [fetched]) — a file arriving from someone else's repo opens as **text**, with a one-line offer: "This file declares `render: board`. Open as board? ⌘2". A mode set by a stranger is Sarter & Woods' worst case.
- Extend the existing `mdmax cert` into a **projection certificate**: for a given board file, the certificate records what N foreign engines render, so "degrades gracefully" is a measured claim, not a promise. Wire it to the existing DEGRADE/REFUSE ladder in PRD §9: unknown `render:` ⇒ DEGRADE to text with a named reason; body no longer parses against the profile ⇒ REFUSE, show the reason, **stay where you are and write nothing**.

**4.5 The six rules that prevent mode confusion.**
1. One gesture, one meaning, across every projection (§4.1).
2. The control names the current state; never a destination-labelled toggle.
3. **Preview the byte before writing it.** Dragging a card shows `status: doing → done` in the drag chip before drop — Excel's Recommended-Charts preview and Docs' review-preview generalised [fetched].
4. **Undo, not confirmation.** Every projection write is one splice and one `⌘Z`, and the undo stack is shared with text view. No "are you sure" dialogs (habituation, per Norman 1983 via [fetched]).
5. **The escape is bidirectional and lives in the same control**, in every projection, on every platform (kanban #732 is the counter-example [fetched]).
6. **Two panes on one file must both be live and consistent** or the second must be read-only with a stated reason (kanban #578, #666 [fetched]).

### 5. Failure modes to test for

| # | Failure | Test | Evidence anchor |
|---|---|---|---|
| F1 | Round-trip mutates bytes | `sha256` before/after text→board→text ×20 | kanban #644 [fetched] |
| F2 | Drag produces >1 undo step, or undo lands in a separate stack | Drag, `⌘Z` once in text view, assert exact prior bytes | Norman 1983 reversibility [fetched] |
| F3 | Split panes on one file diverge or wedge | Board + text on the same file; edit each; assert both converge, no error state | kanban #578, #666 [fetched] |
| F4 | External edit while projected (git pull, sync) is clobbered | Modify on disk under an open board; assert reload-not-overwrite | kanban "Syncing issue" open [fetched] |
| F5 | One-way switch — no way back | Enumerate every projection × platform; assert the reverse entry is present and enabled | kanban #732 [fetched] |
| F6 | Stale per-file projection memory across rename/move/restart | Rename a board file, restart, reopen | kanban PR #1221 `kanbanFileModes` [fetched] |
| F7 | Unknown `render:` value blanks the editor | Set `render: quantum`; assert DEGRADE to text + named reason | PRD §9 ladder |
| F8 | Body stops satisfying the profile mid-edit | Delete all `status:` values while in board; assert REFUSE + zero writes | PRD §9 ladder |
| F9 | Line-ending / BOM / bare-CR corruption on projection write | Project + drag on CRLF, BOM-led, bare-CR and zero-indent-sequence files; assert refuse-not-rewrite | known engine risks (project memory, R0) [measured, prior] |
| F10 | Multi-byte truncation at a splice boundary | Column names in CJK/emoji; card titles with combining marks | LR#68 class [measured, prior] |
| F11 | Column rename half-writes | Rename a column; assert heading **and** every `status:` value rewrite atomically, or refuse | "Renaming Bases view does not update its name in the embeds" [fetched] |
| F12 | Cursor/scroll lost across switch | Assert caret offset + scroll preserved both directions | PRD: OffsetMap owns this |
| F13 | Read-only / merge-conflicted file accepts a drag | Assert drag disabled with a stated reason | — [inference] |
| F14 | Third-party `render:` auto-enters a projection on first open | Open a foreign repo file declaring `render: board` | Sarter & Woods 1995 [fetched] |
| F15 | **Silent-keystroke event** — user types while a projection has focus and the character goes nowhere | Instrument it; this is frontmatter's vi insert/command error and is the single number to watch | Sellen 1992 [fetched] |
| F16 | Override-preservation surprise on profile change | Switch board→calendar→board; assert nothing the user set evaporates on invisible name-matching rules | Figma's `#1BC47D`→`#F531B3` worked example [fetched] |

### 6. Anti-recommendations — discoverability tactics that violate the simple-surface rule

1. **No onboarding tour, coach marks, spotlight overlays, or "what's new" modals.** They are confirmation dialogs wearing a hat, and habituation kills them [fetched, via Norman 1983].
2. **No `+ New view` tab strip.** Views must not be user-created, named, ordered, or persisted objects. That single affordance is the on-ramp to Notion: view registry → per-view filters → per-view sorts → grouping → sharing → **Lock views** → a permission tier that exists solely to stop colleagues breaking each other's filters [fetched]. Reject at rung one.
3. **No per-view saved filters/sorts/groups stored in the file.** Shared mutable view config is the documented hazard in Notion and the source-of-truth violation in frontmatter.
4. **No app-owned settings block in the document** (`%% kanban:settings %%` and every variant) [fetched, obsidian-kanban].
5. **No sidecar view file** (`.base`-style). It splits the source of truth and imports the rename-desync class already reported in that ecosystem [fetched].
6. **Badges, dots, toasts, and status-bar chips are not a discovery strategy.** Whole-screen pink bought ~4.8% of variance [fetched]; a 12px dot buys less.
7. **No confirmation dialog before any projection write.** Undo instead.
8. **No content-sniffing auto-switch on open**, and never auto-write `type: board` into a user's file on the app's initiative.
9. **No hover-only controls as the sole affordance** (Notion's inline databases hide controls until hover [fetched]).
10. **No user-defined view DSL, no plugin marketplace for profiles, no client-side code execution** — settled, and a view DSL is a code-execution surface with a friendly name.
11. **Do not call it "Mode", "View", or "Profile" in the UI.** The user-facing word is the projection's own name — *Board*, *Calendar*, *Decision*. Keep "render profile" internal.
12. **No emoji or non-Material glyphs on the control** — Material Symbols, inline SVG only (house standard LR#52).
13. **No per-user "personal view" state written into the shared file.** [inference — the Airtable personal/collaborative docs returned 404 on all seven slugs probed, so no claim is made about Airtable's implementation; the architectural objection stands on its own.]