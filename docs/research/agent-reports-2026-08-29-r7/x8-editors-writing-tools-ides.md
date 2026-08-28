### D1. Scrivener — binder, corkboard, compile (the 20-year prior art)

| Mechanism | Detail | Tag |
|---|---|---|
| Binder | Tree of arbitrarily small documents (scenes, chapters, research); select a subset (e.g. one POV character's scenes) → reads as continuous narrative; users name binder among irreplaceable features | [SS: adammarek.co.uk/writing-tools-cant-live-without-3-scrivener] |
| Scrivenings mode | Any selection of fragments displayed as ONE continuous editable scroll — the read-side inverse of compile | [SS: scrivener.app/scrivener-view-modes] |
| Corkboard | Each doc = index card with title + synopsis (falls back to text preview when no synopsis); folders = card stacks; click card → metadata in Inspector | [SS: literatureandlatte.com/blog/organize-your-scrivener-project-with-the-corkboard] |
| Outliner | Spreadsheet view: one row per file, columns = metadata (word count, Label, Status, custom fields with colors) | [SS: writersinthestormblog.com 2019/09; writerunboxed.com 2022/02/22] |
| Labels | Colors surfaced in binder/corkboard/outliner; POV/plotline color-coding is canonical use | [SS] |
| Snapshots | Per-document, timestamped, optionally titled checkpoints; Compare = red strikethrough deletions + blue underline additions; Roll Back offers to snapshot current version FIRST (safety-snapshot-before-destructive-restore) | [SS: literatureandlatte.com/blog/how-to-manage-compare-and-restore-snapshots…; martinsketchley.com 2016/12/20] |
| Targets | Draft target (whole project) + session target; deadline checkbox auto-computes per-session quota; options: count text written anywhere, allow negatives (deletions subtract), session reset at set time or on open/close | [SS: literatureandlatte.com/blog/track-statistics-and-targets…; well-storied.com] |

### D2. Scrivener Compile — three-layer architecture (validates the render-profile thesis)

- (a) **Section types** = semantic labels on binder items (chapter, scene, front matter); (b) **Section layouts** = formatting templates; (c) **Compile format** = master mapping types→layouts + global settings (fonts, page size). One manuscript → many outputs (paperback, ebook, submission manuscript). [SS: literatureandlatte.com/blog/using-section-layouts-to-compile…; loreteller.com/learn/scrivener-compile-guide]
- **Per-target front/back matter**: sub-folders of front/back matter per output route (ebook cover+dedication vs paperback blank-page/title-page), picked at compile time; Scrivener auto-applies the Front Matter section type. [SS: literatureandlatte.com/blog/how-to-use-front-and-back-matter…]
- Built-in formats are **read-only**; users duplicate-then-edit → template-inheritance pattern. [SS]
- **Positive sentiment**: compile called a lifesaver when querying agents who each demand different submission formatting. [SS: Goodreads/author blogs]
- **Negative sentiment**: forum thread asks if compile is devilishly difficult to master after hours of YouTube + the manual; a Capterra reviewer compares the interface to "a 1999 era Windows networking box"; app described as a cockpit crossed with a filing cabinet; many users admit they use **under 30% of features yet stay**. [SS: forum.literatureandlatte.com/t/steep-learning-curve-for-compiling/123614; capterra.com/p/180597/Scrivener/reviews]
- **[inference]** Keep the three-layer architecture (semantic type in frontmatter, formatting in profile, mapping in profile file); kill the abstraction cost — zero-config correct output, profile choice as live-preview picker not settings dialog, never require learning the mapping model to get a first output.

### D3. iA Writer

- **Focus Mode** — three variants: Sentence (active sentence highlighted, rest dimmed), Paragraph, Typewriter (no dimming, cursor vertically centered). [SS: ia.net/writer/support/editor/focus-mode]
- **Syntax Highlight** — parts-of-speech highlighting (adjectives, adverbs, weak verbs, repeated nouns, conjunctions), selectable per part; **explicitly editor-only, never in preview or export**. [SS: ia.net/writer/support/editor/syntax-highlight]
- **Style Check** (the linter benchmark) — flags fillers, redundancies, clichés; presentation is **strikethrough** (deletion-oriented, NOT underline-suggestion-oriented); editor-only, guaranteed absent from preview/export; double-click a struck phrase to select for removal; explicitly **non-prescriptive** (encourages rethinking, doesn't assert the right answer); runs **fully on-device, no cloud, marketed as no-AI**. [SS: ia.net/writer/support/editor/style-check; ia.net/topics/introducing-style-check]
- **Content Blocks, spec v0.4** [fetched: raw.githubusercontent.com/iainc/Markdown-Content-Blocks/master/README.md] — published file-transclusion syntax for Markdown, inspired by Gruber's remark that image syntax was his biggest mistake. A content block = a line containing just a local path (starting `/`) or image URL, optionally followed by a quoted/parenthesized title. CSV → tables; source files → language-tagged code blocks (extension→language via `Languages.json`); text/markdown inlined; titles become captions/alt text; embeds render in preview AND are included in HTML/PDF/Markdown/Word export. Specified against CommonMark.
- **[inference]** Content Blocks = the plain-text binder: an `index.md` of transclusion lines is a manuscript spine that stays valid Markdown, needs no database, and is the natural input to compile-style profiles. Degradation cert covers it — other editors show a harmless path line.

### D4. Drafts, Typora, Ulysses, Highland 2, FocusWriter

| Product | Mechanism / number | Tag |
|---|---|---|
| Drafts | Opens to blank draft + cursor; write first, decide later; entries land in an **Inbox**, then tagged/flagged/archived (email-like lifecycle); **Workspaces** = saved filter+tag views; **Actions** = append/prepend to existing drafts or files (iCloud/Dropbox), send to apps; large community action directory | [SS: getdrafts.com; docs.getdrafts.com/drafts; docs.getdrafts.com/actions; thesweetsetup.com] |
| Typora price | **$14.99 one-time**, repeatedly praised as the right business model | [SS: makerstack.co/reviews/typora-review] |
| Typora magic | Single surface, no preview pane, no mode switcher, no visible syntax except where you're editing; a 2026 HN commenter called it the best markdown authoring experience, **surpassing Obsidian** | [SS: producthunt/HN/reviews] |
| Ulysses Goals | Attach to sheet, group, or project; goal types **at least / at most / about**; units = characters (with/without spaces), words, lines, paragraphs, pages, reading time, reading-aloud time; deadline auto-creates daily target (**4000 words in 4 days → 1000/day**); goal rings go progress-blue → green, or **red for exceeded at-most** | [SS: help.ulysses.app/goals; macstories.net Ulysses 13 review] |
| Ulysses material sheets | Excluded from statistics, export, AND writing goals — the detail that makes stats honest | [SS: stories.ulysses.app/material-sheets] |
| Ulysses Split/Merge/Glue | Split a sheet at cursor into two glued sheets; merge combines permanently; **glue** keeps sheets separate but they display and export together (colored line in sheet list) — reversible fragment/join | [SS: ulysses.app/tutorials/split-merge-glue] |
| Ulysses pricing | **Subscription resentment is its single most common complaint** — paying rent forever for a tool once bought outright | [SS: reedsy.com/studio/resources/ulysses-writing-app-review] |
| Highland 2 | Fountain (plain-text screenwriting, dialect-fidelity sibling); **Revision Mode** marks revised text in named revision colors; drag-and-drop Navigator sidebar; **the Bin** = parking space for cut material you're not ready to delete; **Gender Analysis** of dialogue (got national press) | [SS: blog.quoteunquoteapps.com; thesweetsetup.com] |
| FocusWriter | Daily goals (words or minutes), timers/alarms; full-screen with chrome hidden until summoned, themed backgrounds, optional typewriter sound effects | [SS: gottcode.org/focuswriter] |
| Ommwriter / Bear 2 | Ommwriter: ambient soundscapes + keystroke audio. Bear 2: always-on markdown concealment, folding, live stats bar | [SS: scalarly, alternativeto, blog.bear.app] |

### D5. Typora issue tracker — named WYSIWYG defects (primary sources)

- **#443** [fetched body]: Typora enters edit mode (reveals markdown source) whenever the caret is *merely placed* by a click; writer never asked to see markup, readers get distracted. Proposal: stay rendered regardless of caret position until keystrokes arrive. https://github.com/typora/typora-issues/issues/443
- **#2271** [fetched body]: arrowing from rendered text into a link expands raw markdown and the caret jumps to a position consistent with **source geometry, not rendered geometry**; multiple backspaces from outside a link destroy markup symbols instead of text; behavior inconsistent between links and headings. Proposal: caret lands adjacent to link *text*; deletions from outside affect text, not delimiters. https://github.com/typora/typora-issues/issues/2271
- **#1317** [fetched body]: community synthesis issue — catalogue of WYSIWYG gaps (line-break rendering, `<br>` visibility, links auto-expanding, footnote display, emoji showing shortcode+glyph) and a proposed single **"Display markup under cursor" menu toggle**: checked = today's reveal-under-cursor made consistent across element classes; unchecked = true WYSIWYG with markup never shown. **Developer's own stance: improve the default view, don't add modes.** https://github.com/typora/typora-issues/issues/1317
- **#852, #3506**: toggling to/from source-code mode loses scroll position (jumps to top) even though caret is preserved. [SS: github issue titles]
- **Top-reacted feature asks** [fetched via api.github.com search]: plugins **251** thumbs-up; vim bindings **239**; Grammarly integration **145**; tab/window-opening UI **137**; folding **133** (#499); more diagram syntaxes **126**; academic referencing **120**; multi-tab on Windows/Linux **119**; wiki-style links **104**.
- **[inference] WYSIWYG spec**: (1) markup reveal is keystroke-gated, never click-gated; (2) caret geometry maps to rendered text, destructive keys eat text characters never delimiters; (3) reveal policy = one explicit consistent per-element-class rule with a single visible toggle; (4) any view/mode change preserves caret AND scroll exactly (mdmax OffsetMap owns this primitive); (5) folding is cheap and heavily demanded. The 251-reaction plugin ask vs Typora's loved plugin-free identity = plugin-fatigue tension in one datapoint.

### D6. Linting UX — Grammarly / ProWritingAid / LanguageTool / Vale

- **Presentation models**: Grammarly = inline underlines + hover cards, sidebar as overview. ProWritingAid = **25+ batch reports** in a sidebar. Reviewer consensus: Grammarly's seamless inline real-time model wins; PWA's report wall is overwhelming and its batch waits (paste, run, **~30s**) are the anti-pattern. [SS: zapier.com/blog/prowritingaid-vs-grammarly; kripeshadwani.com/grammarly-vs-prowritingaid]
- After Grammarly reduced visual interference (calmer button, optimized underline updates, async suggestion processing), **users disabling the extension dropped by 9%** — interference level is directly measurable in disable behavior. [SS: grammarly.com/blog/engineering/reducing-text-input-lag]
- Acceptance skews by category: grammar/spelling/punctuation accepted more than clarity/conciseness. Grammarly built **batch-accept** for mechanical classes. [SS: grammarly.com/blog/engineering/accepting-multiple-suggestions]
- Acceptance benchmarks: GitHub Copilot **~30%** suggestion acceptance [SS: itpro.com]; email phrase suggestions **14.8%** overall [SS: arXiv 2101.09157]; **pull-style (user-requested) >50%** vs **~35% push-style (unsolicited)** [SS: arXiv 2306.16641]. Lesson: unsolicited style advice is mostly rejected.
- **Grammarly Goals**: users declare intent (inform/describe/convince/tell a story), audience (general/knowledgeable/expert), formality, domain (academic/business/email/casual/creative) before analysis tailors suggestions; plus a tone detector. [SS: support.grammarly.com/hc/en-us/articles/360054679292]
- **LanguageTool** [fetched README]: **LGPL 2.1**, **20+ languages**, self-hostable HTTP server + documented API; severity color-coded (**red error, yellow warning, gray minor style** e.g. overlong sentences); **Picky Mode** = opt-in tier of style/typography/punctuation rules disabled by default because they cost false positives; rules and whole categories individually disableable. [SS: languagetool.org/insights/post/picky-mode]
- **Vale** [fetched README]: code-like linting for prose — config and style rules as versionable repo files, run identically in editor and CI; **Mintlify** ships Vale as a built-in CI check; **Promptless** (AI-docs company) runs Vale on every doc its agents write → prose-linting-as-a-gate-on-AI-output is already a shipping pattern.

### D7. Streaks / gamification research

- Streaks are effective AND dangerous: shift optimization from goal to metric, generate anxiety/guilt (**Duolingo's owl** as cautionary emblem), and a broken streak often ends the habit; healthier designs use **streak freezes, grace days, weekly rather than daily targets**. [SS: thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification; blog.cohorty.app/the-psychology-of-streaks…]

### D8. Category-D feature-extraction table (28 rows, preserved)

| # | Feature | Source | Frontmatter form |
|---|---|---|---|
| 1 | Render profiles w/ zero-config defaults | Scrivener compile | `profile:` key + `.frontmatter/profiles/`; preview-first picker |
| 2 | Semantic type → layout mapping | Scrivener section types | `type:` key; mapping in profile |
| 3 | Per-profile front/back matter | Scrivener | profile lists prepend/append fragment paths |
| 4 | Plain-text binder via transclusion | iA Content Blocks (open spec) | index.md of `/path.md "Title"` lines = compile spine |
| 5 | Excluded material fragments | Ulysses material sheets | `role: material` → out of compile/stats/goals |
| 6 | Glued fragments | Ulysses glue | transclusion groups render/export together |
| 7 | Named snapshots + visual diff + safe rollback | Scrivener snapshots | plain-md checkpoints; red-strike/blue-underline compare; auto-checkpoint before restore |
| 8 | Targets + deadline math | Scrivener + Ulysses | `target:`, `deadline:`, `goal_type: at_least\|at_most\|about` |
| 9 | Corkboard/outliner as renders | Scrivener | card render (synopsis key) + table render (frontmatter columns) |
| 10 | Keystroke-gated markup reveal | Typora #443 | caret placement never expands markup |
| 11 | Rendered-geometry caret + text-first backspace | Typora #2271 | arrow into span lands in text; delimiters never eaten |
| 12 | Caret+scroll preserved across views | Typora #852/#3506 | OffsetMap maps caret/scroll across editor/preview/source |
| 13 | One explicit markup-reveal toggle | Typora #1317 | single policy switch, per-element-class table |
| 14 | Folding | Typora #499 (133) / Bear 2.2 | heading/list/code folding, state never written into the document |
| 15 | Editor-only, deletion-oriented lint marks | iA Style Check | strikethrough/dim; never in output; double-click remove |
| 16 | Frontmatter-calibrated linting | Grammarly Goals | `audience:`, `tone:`, `intent:` keys tune the AEO linter |
| 17 | Severity tiers + picky opt-in | LanguageTool | default correctness-only; `lint: picky`; per-category disable |
| 18 | Lint config in repo + same engine in CI | Vale | versioned `.frontmatter/lint.yml`; headless CLI = editor rules |
| 19 | Inline-first UX, no batch waits | Grammarly vs PWA | underline+card; sidebar = counts only |
| 20 | Acceptance telemetry → auto-quiet rules | Grammarly 9% disable data | local accept/reject counters demote to pull-only; **no telemetry leaves the machine** |
| 21 | Batch-accept mechanical fixes | Grammarly multi-accept | accept-all per mechanical category, applied via splice |
| 22 | Capture inbox + append-to-file | Drafts | global quick-capture to `inbox/`; append/prepend commands |
| 23 | One composition mode | FocusWriter/iA/Scrivener | hide-chrome + typewriter scroll + sentence focus; no themes/sounds |
| 24 | No streaks; pace-vs-deadline only | streak-backfire research | writer's own deadline; grace built in |
| 25 | Cuts bin | Highland 2 | cut fragments auto-parked (`role: material`), source+timestamp, one-action restore |
| 26 | Revision colors as provenance UI | Highland 2 | provenance spans as toggleable revision-color layers; data in sidecar, never in markdown syntax |
| 27 | **Decision: no plugin API** | Typora (251-vote ask vs loved identity) | built-in renders + AI protocol answer the demand |
| 28 | **Decision: one-time/perpetual-fallback pricing for the editor** | Typora praise vs Ulysses resentment | never rent core editing |

### B1. VS Code — what won, and what it cost

- **Command palette (Ctrl+Shift+P) as universal entry point** [fetched] — every action is a named, fuzzy-searchable command; structural consequence: chrome stays minimal because no feature NEEDS a button. (raw.githubusercontent.com/microsoft/vscode-docs/main/docs/configure/settings.md, .../languages/markdown.md)
- **Settings as text with a GUI over the same file** [fetched] — user vs workspace settings; workspace settings in `.vscode/` at project root, "easy to share settings with others in a version-controlled (for example, Git) project"; Settings editor GUI and settings.json are two views of one file; keybindings likewise a JSON file. (code.visualstudio.com/docs/configure/settings)
- **Zen mode + centered layout** [fetched] — "Hide all UI except for the editor area" + "Centers the editor inside the editor region". (.../docs/configure/custom-layout.md)
- **Markdown wins already in core** [fetched, code.visualstudio.com/docs/languages/markdown]: outline view = header hierarchy; **Ctrl+Shift+O** jump-to-header in file; **Ctrl+T searches headers across ALL markdown files in the workspace**; path + header completions (type `##` to complete against every header in the workspace); drag/paste a file inserts a markdown link; **preview scroll-sync both directions, locked previews, double-click preview jumps to source line**; `workbench.editorAssociations` can make the RENDERED preview the default editor for `.md`; **markdown preview of diffs — a rendered diff with changed lines highlighted, inline or side-by-side**.
- **Extension-model cost** [SS] — VS Code's own wiki + ecosystem guides: extensions are "the most common reason VS Code becomes slow"; `*` activation events hit startup; mitigation is per-extension startup attribution ("Startup Performance", flag anything **>500ms**). (github.com/Microsoft/vscode/wiki/Performance-Issues; freecodecamp.org/news/optimize-vscode-performance-best-extensions)
- **[inference]** The integrated-terminal lesson generalizes not to "ship a terminal" but "the whole work loop lives in one window" — analog: editor + rendered preview + AI/agent panel + doc-health in one surface.

### B2. JetBrains — rename safety, local history, structural search

Safe-rename recipe [SS: jetbrains.com/help/idea/rename-refactorings.html] + [fetched: LSP 3.17 spec]:

1. **Two-phase protocol** [fetched] — LSP `textDocument/prepareRename` "to setup and test the validity of a rename operation at a given location" BEFORE any UI; returns exact range + placeholder text, or null/error ("nothing at given position to rename… clients should show the information"). Then `textDocument/rename(newName)`; an invalid name MUST return a ResponseError.
2. **Rename returns a proposal, not a mutation** [fetched] — response is a `WorkspaceEdit` describing every text edit and resource operation, applied by the CLIENT.
3. **Versioned edits = stale-state guard** [fetched] — `documentChanges` use versioned text-document identifiers so an edit computed against version N cannot silently apply to version N+3. Parallels the pain-playbook's "re-validate at apply time against baseSha".
4. **Ordered resource ops + declared failure semantics** [fetched] — a WorkspaceEdit can mix `RenameFile`/`CreateFile`/`DeleteFile` with text edits, executed in order; client declares `FailureHandlingKind = 'abort' | 'transactional' | 'undo' | 'textOnlyTransactional'`. Atomicity is negotiated, not assumed.
5. **Per-edit confirmation annotations** [fetched] — `ChangeAnnotation { label, needsConfirmation?, description? }` + client capability `honorsChangeAnnotations`: sub-edits can require confirmation while confident edits auto-apply.
6. **Preview + conflicts + dynamic references** [SS] — Refactoring Preview tab lists every usage before applying; conflicts dialog offers "Refactor Anyway" or open-in-Find; **dynamic usages (matches the engine cannot prove) are shown but EXCLUDED by default — user opts each one in**; "search in comments and strings" is a separate opt-in scope. Markdown analog of dynamic references = prose mentions of a heading/file that aren't links.
7. **In-place start, live-linked ranges** [fetched] — LSP `linkedEditingRange` (3.16): ranges with the same content edit together live; "a rename to one of the ranges can be applied to all other ranges if the new content is valid".
8. **VS Code markdown rename is the prose proof** [fetched] — F2 on `# My Header` updates every link to `#my-header` workspace-wide; **F2 on a link path renames the actual file on disk and updates all links**; F2 on `other.md#header` renames the header inside the OTHER file; `markdown.updateLinksOnFileMove.enabled: never | prompt | always` — **default `never`, `prompt` is the safe middle**.

**Local History**
- IntelliJ [SS: jetbrains.com/help/idea/local-history.html; blog.jetbrains.com/idea/2020/02/local-history-in-intellij-idea-may-save-your-life-code]: automatic revisions per file AND per directory, triggered by events (edit, test run, deploy, commit); revisions timestamped, some auto-LABELED by event; user can "Put Label"; restore granularity down to **"Revert Selection"**; works with no VCS at all. Default retention **5 working days** (`localHistory.daysToKeep`); stored as binary files in the IDE system dir; **cleared when the IDE is upgraded**.
- VS Code **v1.66 (2022)** [fetched, code.visualstudio.com/updates/v1_66]: entries in the **Timeline view** per save; each entry stores **FULL file contents**; `mergeWindow` **default 10s** coalesces rapid saves; per-entry actions: compare to current or previous, restore, delete, rename; commands to create a NAMED entry and a global restore-via-picker; settings `enabled` (default true), `maxFileEntries` **50/file**, `maxFileSize` **256KB**, `exclude` globs; storage falls back to IndexedDB on web; **timeline filter toggles providers (Git history vs Local history) in one merged timeline**.
- Extraction: default-ON, per-save granularity with merge window, full-content snapshots, nameable states, one merged multi-provider timeline — and explicitly AVOID JetBrains' caveats (silent 5-day expiry, wipe-on-upgrade). Pain-playbook §17 already promises "content ever persisted on any device is recoverable **≥30 days**".

**Structural Search and Replace** [SS: jetbrains.com/help/idea/structural-search-and-replace.html] — search over code STRUCTURE with `$variable$` templates plus constraints, replace structurally, share templates via export/import. Markdown translation: query the AST not the text — "every unchecked task under heading X", "all callouts of type warning", "tables missing column Y". One engine serves views AND bulk transforms, transforms flowing through the same WorkspaceEdit-style preview.

### B3–B6. Sublime, Zed, modal editing, LSP/marksman

| Item | Detail | Tag |
|---|---|---|
| Sublime Goto Anything | Ctrl+P; `@`=symbols, `#`=fuzzy text, `:`=line; **operators compose with a file query** ("nav.md@install"); results preview instantly as you move through them — the composability + instant-preview is what nobody copied | [SS: docs.sublimetext.io/guide/usage/file-management/navigation.html] |
| Multi-cursor | Sublime popularized; Helix ships "multiple selections" as a core feature [fetched: github.com/helix-editor/helix README]; CodeMirror 6 (frontmatter's substrate per the gapmap) supports natively — cheap | [fetched / SS] |
| Sublime identity | Instant startup + instant goto; latency is a feature users can name | [SS/inference] |
| Zed buffers | Rope + operation-based CRDT with Lamport timestamps + **Anchor system for stable positions** + transaction-based undo; collaboration is the same machinery, not a bolt-on | [SS: zed.dev/blog/crdts + DeepWiki buffer-architecture] |
| Zed perf claims | Rope B-tree O(log n) edits, GPU-rendered UI, **~120fps / low-ms input latency** (vendor claims) | [SS: zed.dev] — exact fps/latency listed as [unverified] in source ledger |
| Zed AI posture | A single **"Disable AI" switch kills every AI feature**; edit prediction disabled globally, per-language, and per-glob (`disabled_globs`); default prediction model **Zeta** is open source; "Out-of-your-face AI" positioning | [SS: zed.dev/docs/ai/edit-prediction + blog] |
| Agent Client Protocol (ACP) | "Standardizes communication between code editors… and coding agents"; JSON-RPC envelope; **wire compatibility negotiated via `protocolVersion` at `initialize`, feature support via exchanged capabilities**; current stable **protocol version 1**; SDKs in TS/Rust/Python/Kotlin/Java (five official SDKs) | [fetched: github.com/zed-industries/agent-client-protocol README] |
| VSCodeVim | **~8M marketplace installs**; a meaningful minority of a ~10x larger base; every prosumer editor ships vim bindings as an OPT-IN toggle (Zed, JetBrains IdeaVim, Obsidian's vim toggle — last one [unverified]); modal-NATIVE editors (Helix [fetched]) stay niche | [SS: marketplace.visualstudio.com/items?itemName=vscodevim.vim] |
| Marksman | Self-contained-binary markdown language server: "completion, goto definition, find references, **rename refactoring, diagnostics**" over inline links, reference links, AND wiki-links (`[[note]]`, `[[note#heading]]`), with "diagnostics for wiki-links to detect broken references and duplicate/ambiguous headings". Integrated by VS Code, Neovim, Vim, Emacs, **Helix out of the box**, Kakoune, Sublime (LSP-marksman), BBEdit, Zed | [fetched: github.com/artempyanykh/marksman README] |

### B7–B8. Format-on-save discipline; diagnostics surfaces

- **Prettier/VS Code rules** [fetched: github.com/prettier/prettier-vscode README]: `editor.formatOnSave` is opt-in; a `defaultFormatter` must be EXPLICITLY chosen per language (no silent winner among competing formatters); `prettier.requireConfig` can require a repo config file before formatting anything; "It is recommended that you always include a prettier configuration file in your project… no matter how you run prettier — from this extension, from the CLI, or from another IDE — the same settings will get applied"; `.editorconfig` sits underneath as the lowest layer; double-formatting is explicitly designed against.
- **Diagnostics four-surface pattern** [fetched: code.visualstudio.com/docs/editing/editingevolved]: **status-bar summary count → PROBLEMS panel list → inline squiggle + overview-ruler mark → F8/Shift+F8 cycling with an inline zone showing the problem AND its Code Actions**; lightbulb Quick Fixes attached to diagnostics.
- **VS Code markdown link validation** [fetched]: validates file links, fragment links, cross-file fragments, reference links; per-kind toggles; `validate.ignoredLinks` globs for links that only exist after publish; **OFF by default** — conservative because false positives poison trust (cf. LR#65's false-red lesson).

### B9. Category-B ANTI-FEATURES (explicit do-NOT-build list)

1. **A third-party extension marketplace** — VS Code's own docs/wiki treat extensions as the #1 performance suspect; plugin-fatigue industrialized. [SS]
2. **Default-on format-on-save / silent normalization** — the prettier ecosystem spent years building opt-in gates around exactly this; splice already wins here. [fetched]
3. **Default modal editing** — 8M installs is a niche within ~10x that base; toggle-later, never core. [SS]
4. **JetBrains local-history caveats** — silent short retention (5 working days) and wipe-on-upgrade are trust leaks in the one feature whose only job is trust. [SS]
5. **A proprietary agent wire protocol** — ACP exists, is versioned, capability-negotiated, multi-SDK; incompatibility would be self-harm. [fetched]

Plus from Category D: **no plugin API** (answer the 251-vote demand with custom render kinds, an optional vim-bindings toggle, and the built-in AEO linter); **no streaks/badges/guilt notifications, ever**; **no Ommwriter-style soundscapes/themes**; **no subscription for core editing**; **no third "mode"** beyond the single markup-reveal toggle (Typora dev principle: improve the default view, don't add modes); **never a silent regex pass on prose mentions during rename**; **never a global "make my markdown pretty" default** — that IS dialect betrayal.

### B10. Category-B FEATURES TO TAKE (frontmatter form, condensed)

| Take | Source | Frontmatter form |
|---|---|---|
| Certified rename transaction (prepare → proposal → atomic apply) | LSP 3.17 + IntelliJ + VS Code F2 | prepare (validate + enumerate affected files) → preview card (per-file diff, one WorkspaceEdit-style object) → apply via splice as ONE transaction, single undo, re-validated against baseSha at apply time, logged as provenance; same verb exposed to agents via AI protocol with identical preview+gate |
| Dynamic-reference discipline | IntelliJ dynamic usages + LSP `ChangeAnnotation.needsConfirmation` | Preview has two sections: "links (will update)" auto-checked; "text mentions (won't touch unless you check them)" individually confirmable |
| Local history, default-on, merged timeline | IntelliJ + VS Code v1.66 | Every save = byte-exact revision; right-rail timeline merges git commits + local revisions + AI edits with provider filters; entries auto-labeled by ACTOR (you / AI run with model+prompt provenance / external tool); nameable states; restore is itself a new revision; retention pinned to ≥30 days and stated in UI, survives app updates |
| Section-level restore | IntelliJ "Revert Selection" | Any block/section in the timeline diff has "restore just this section"; splice patches only those bytes; pairs with block IDs and custom renders |
| Command palette as universal action surface | VS Code `workbench.action.showCommands` | One Cmd+K surface unifying commands + files + headings (md.sgnk.ai already has Cmd+K/Cmd+P per the gapmap — unify); palette-first rule: no toolbar button until the palette command earns it |
| Goto-anything with composable operators + live preview | Sublime + VS Code Ctrl+T | `#` = headings vault-wide, `@` = headings/blocks in current doc, `:` = line; `note#head` narrows within a file; selected result renders live in preview before Enter |
| Settings as text file + GUI over the same file | VS Code settings.json + `.vscode/` | Vault settings as a versioned file IN the vault (markdown-adjacent YAML — dogfoods frontmatter); per-vault overrides per-user; settings UI writes through splice so hand-edits and GUI edits never fight |
| Zen/writing mode + centered layout | VS Code | One toggle: chrome disappears, editor centers at reading measure, diagnostics collapse to a single status dot, Esc restores |
| Doc Health four-surface diagnostics | VS Code Problems + link validation + marksman | Panel: broken links/anchors, duplicate/ambiguous headings, staleness (frontmatter dates), degradation-cert warnings (lossy zones), unreviewed AI edits; each row has a quick fix (create missing note, fix anchor, re-run cert); vault count in status bar; next/previous cycling; **vault-scoped wikilink checks ON, publish-dependent checks OFF by default** |
| Rendered markdown diff | VS Code markdown preview in diff view | Every review surface (AI edit proposals, rename previews, timeline comparisons, git diffs) defaults to rendered-diff with raw toggle; word-level highlight inside changed blocks; custom renders show diffs in-render where possible |
| Link-cascade prompt on move/rename | `markdown.updateLinksOnFileMove` | Prompt names the exact count ("update 14 links across 6 files?") with preview link; setting always/prompt/never — **frontmatter default `prompt`, not VS Code's `never`** (stable file IDs back share links) — *note: this diverges from VS Code's shipped default* |
| Structural search over the markdown AST | IntelliJ SSR | Query surface ("unchecked tasks under ## Q3", "callouts of type warning", "notes where frontmatter.status = draft"); saved queries become custom-render data sources; structural REPLACE flows through the same preview-transaction pipeline as rename |
| Multi-cursor / multiple selections | Sublime + Helix + CM6 | Cmd+D add-next-occurrence, column select in source mode; markdown-aware bulk ops (edit a table column, toggle N task checkboxes) as palette commands |
| Modal editing as later opt-in | VSCodeVim / Zed / Helix | No modal work now; keep keymap layer clean so CM6's vim extension can become a settings toggle; ship non-modal power keys (palette, goto, multi-cursor) as the floor |
| Speak LSP from the core engine | LSP + marksman | mdmax exposed as a self-contained LSP binary covering frontmatter's dialect; internally features are LSP-shaped verbs (prepare/proposal/diagnostic) so AI protocol, UI, and LSP share one brain and one test surface. **Marksman is the benchmark to beat** — frontmatter's rename must be visibly safer (preview, cert, provenance) or power users ask why not just use marksman |
| Never-reformat write path + opt-in config-in-repo normalization | Prettier discipline | Splice stays the only write path; any normalize/lint-fix is opt-in, reads a vault-committed config, previews as rendered diff, lands under the degradation cert |
| One global AI-off switch + per-folder AI exclusions | Zed | `ai.enabled=false` hides every AI surface; `ai.excludedPaths` globs keep private folders out of any AI context; pricing page states the editor is complete without AI; provenance still records EXTERNAL agents' edits with built-in AI off |
| Track/bridge ACP | Zed ACP | AI protocol adopts ACP's shape (JSON-RPC, protocolVersion negotiation, capability flags); an ACP adapter exposes frontmatter as an ACP client; frontmatter-specific verbs (splice-edit with cert, provenance-stamped WorkspaceEdits, structural queries) ride as negotiated capability extensions |
| Stable anchors and IDs at the core, minus the CRDT tax | Zed buffer architecture | Anchor model in the engine: comments, AI suggestions, cert annotations, share links attach to stable block anchors surviving edits and external writes (re-anchored on file-change detection); transaction-based undo groups (a rename = one undo step); CRDT deferred until real-time collab is scheduled |
| No plugin marketplace; if extensibility ever ships, per-unit cost attribution from day one | VS Code extension costs | Custom renders, diagnostics, AI verbs built-in and budgeted; the extension story is the open FORMAT and protocols (LSP/ACP/markdown), not in-process plugins; if sandboxed extensions ever ship, every unit reports startup/latency cost in a user-visible panel from v1 |

### Cross-source agreements, tensions, and method caveats

- **Agreement (pricing)**: Typora's $14.99 one-time praised [SS] vs Ulysses subscription named its most common complaint [SS] → perpetual-license posture for core editing; recurring charges only for genuinely recurring costs (sync/AI compute).
- **Agreement (linting default)**: iA (editor-only, non-prescriptive), LanguageTool (picky opt-in), VS Code link validation (OFF by default), Grammarly acceptance skew, arXiv 2306.16641 (pull >50% vs push ~35%) all converge on conservative defaults + opt-in style tiers.
- **Tension (extensibility)**: measurable demand for plugins (Typora 251 reactions; vim 239; Grammarly integration 145) vs Typora's loved plugin-free identity AND VS Code's own wiki naming extensions the #1 slowdown. Both reports resolve it the same way — refuse the plugin API, answer demand in-core.
- **Divergence on defaults**: VS Code ships `updateLinksOnFileMove` default `never`; ed2 recommends frontmatter default `prompt`. Recorded as a deliberate departure, not agreement.
- **Method caveat (both reports)**: WebFetch was refused by the session taint gate (per LR#70), so primary sources were opened via curl against allowlisted hosts (raw.githubusercontent.com, api.github.com); JetBrains/Zed/Sublime doc hosts were **not** curl-allowlisted → those claims are [SS] with URLs. GitHub API rate-limited unauthenticated in ed2; not needed after raw fallback. ed1 authenticated GitHub API calls via the standard token flow, no token values printed.
- **[unverified] in ed2's ledger**: Obsidian vim-toggle specifics; Zed exact fps/latency figures (vendor claims via summaries).
- **Extraction-run provenance [measured]**: this quarry was produced read-only — two Read calls against `ed1-writing-tools.md` and `ed2-ides.md`, zero writes, zero commits. LR#48 reconcile check run this session: `git -C ~/.claude status --porcelain -- skills-src settings.json` shows 10 modified + 8 untracked paths, all pre-existing; `git -C ~/.claude log --oneline -3` has HEAD at `6e390828` ("Apply the memory/handoff research: 4 learned rules, 2 handover patches, PreCompact v2"), unmoved by this run. No mutation attributable to this extraction.