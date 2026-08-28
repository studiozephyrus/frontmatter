### Scope + method (both source reports)
- **ed3-frameworks** covers ProseMirror, TipTap, Lexical, Slate, BlockNote, Editor.js, Milkdown, CodeMirror 6, Monaco; Notion/Craft block-model UX. Method: GitHub issue/docs mining via curl (api.github.com, raw.githubusercontent.com), npm registry stats (api.npmjs.org), WebSearch. WebFetch gate-refused this session (taint gate). npm download figures = window **2026-07-29 → 2026-08-27** as returned by api.npmjs.org [fetched].
- **ed4-ai-editors** covers Cursor, Windsurf, Zed AI, GitHub Copilot in VS Code, Claude Code (editor-adjacent), Notion AI, Craft AI, Lex.page, Type.ai, Sudowrite, Jasper. Method: WebSearch [SS] + primary sources [fetched] via raw.githubusercontent.com / api.github.com; WebFetch gate-refused, GitHub raw + authenticated API used as fallback per LR#70.

### Framework-by-framework lossy-serialisation evidence
| Framework | Package / version | Downloads (2026-07-29→08-27) | Lossy evidence | Tag |
|---|---|---|---|---|
| ProseMirror | `prosemirror-markdown` | — | Fixed CommonMark schema: doc/paragraph/blockquote/horizontal_rule/heading/code_block/ordered_list/bullet_list/list_item/text/image/hard_break + em/strong/link/code marks. Parse = markdown-it tokens → PM tree; serialize = per-node functions writing fresh syntax through `esc()` ("so that it can safely appear in Markdown"), global `tightLists` option, `escapeExtraCharacters` | [fetched, raw.githubusercontent.com/ProseMirror/prosemirror-markdown/master/README.md] |
| ProseMirror consequence | — | — | Author's `*` vs `_`, setext vs ATX headings, list markers, lazy wrapping, reference links, un-escaped-but-legal punctuation normalized away by construction. Not a bug — the architecture. Anything not in schema (arbitrary HTML, exotic dialect) must be modeled or is dropped | [inference] |
| TipTap community | `tiptap-markdown` | **7,434,854 dl/mo** | README now says "please prefer using the official extension"; author won't address issues | [fetched npm; fetched raw…/aguingand/tiptap-markdown/main/README.md] |
| TipTap official | `@tiptap/markdown` **v3.30.5, published 2026-08-26**; markdown support community-only until **Tiptap 3.7.0** | — | Explicitly **beta**: "early release and can be subject to change or may have edge cases that may not be supported yet." Architecture: MarkedJS lexer → tokens → extension parse handlers → **Tiptap JSON** → per-extension render handlers. Documented limits: comments "may be lost if replaced by Markdown content"; tables allow "only one child node per cell as the Markdown syntax can't represent multiple child nodes" | [fetched, raw…/ueberdosis/tiptap-docs/main/src/content/editor/markdown/index.mdx] |
| Milkdown ("markdown-first" PM editor, closest competitor shape) | — | — | Tracker = ledger of round-trip corruption: **#2349** "Backslashes in autolink URLs double on every round-trip → exponential growth" (OPEN, github.com/Milkdown/milkdown/issues/2349); **#2428** "remarkPreserveEmptyLinePlugin silently deletes user-authored inline `<br>`" (OPEN, /issues/2428); **#2403** nested strong/emphasis "can silently corrupt formatting into literal asterisks"; **#1579** "Empty nodes are not preserved"; **#1249** "Limited support for commonly used HTML tags and entities" | [fetched, GitHub issue search repo:Milkdown/milkdown] |
| Lexical | `@lexical/markdown` | **19,311,550 dl/mo** | `$convertFromMarkdownString` / `$convertToMarkdownString` + shortcut TRANSFORMERS — conversion helpers over Lexical's own EditorState, **not a storage story** | [fetched, raw…/facebook/lexical/main/packages/lexical-markdown/README.md] |
| BlockNote | — | — | Export function literally named **`blocksToMarkdownLossy()`** — "The markdown format is quite limited… conversion is lossy": non-list children un-nested, styles removed; docs direct you to `JSON.stringify(editor.document)` as the non-lossy format | [SS, blocknotejs.org/docs/features/export/markdown] |
| Editor.js | — | — | "outputs a clean JSON data instead of heavy HTML markup" — JSON-native by design; "Markdown support?" closed issue with **47 reactions** (issues/709); re-requests stay open (**#2334, #2674**) | [fetched README + fetched issue search] |
| Notion (shipped block-model endgame) | — | — | Markdown export loses toggles (flatten), columns/layout (vanish), databases (→ CSV snapshots), synced blocks (unsync), comments (don't export), internal links (break). Repair cottage industry: **unmarkdown.com, mdstill.com, intomarkdown.com** | [SS, raccoon.page/blog/notion-export-limitations/ + notion.com/help/export-your-content + unmarkdown.com/blog/notion-export-broken] |

- **Verdict:** single-engine CodeMirror decision validated by the frameworks' own docs/trackers. In CM6 the markdown text IS the document — no serializer → no round-trip → byte fidelity is default. Splice + degradation cert compete where the market leader's official answer is a beta bridge and the block-editor answer is a function named "Lossy". **Never adopt a tree-of-record even for one feature.** [inference]

### Block-editor affordance port table (CM6 / lezer spans)
- Key mechanism [inference, grounded in lezer]: CM6's lezer-markdown syntax tree already gives exact character spans for every block-level construct (heading section, list item, blockquote, fence, table). A "block" for UX = a syntax-tree span; a block operation = a **pure text move/rewrite of that span via splice**.

| Affordance | Ports? | Mechanism / evidence |
|---|---|---|
| Slash insert menu | **Ports cleanly — already shipped** | CM6 autocomplete on `/`; Crepe/BlockNote confirm item set (headings, lists, task list, quote, table, code, image, divider) [SS] |
| Drag-to-reorder blocks | **Ports cleanly (and better)** | Gutter/hover handle over lezer block span; drop = splice `move(range → offset)`; byte-identical, cert trivially green. **No production plain-markdown editor ships Notion-grade handles today** [inference] — open differentiator. Android caveat: handles as widgets must survive IME (CM6 #1087, #1675) [fetched] |
| Turn-into transform menu | **Ports cleanly** | Rewrite leading markers (`#`↔`-`↔`>`↔`1.`) on the span via splice; prefix surgery only |
| Toggles / collapse | **Ports as folding, not syntax** | CM6 `foldService` over heading/list sections; fold state persisted OUTSIDE the file (sidecar/frontmatter), never as dialect. Obsidian ships section folding in production [SS] |
| Table editing UI | **Ports with effort** | Widget decorations over GFM tables; **Obsidian 1.5-era live-preview table editor over CM6** proves feasibility [SS, forum/community]; writes re-serialize only the table block |
| Block selection / multi-block ops | **Partial port** | Section-select commands (expand selection to syntax node); CM6 selection stays character-based — the Notion esc-select *mode* doesn't exist, "and shouldn't (mode = friction)" |
| Block-anchored comments | **Ports only with honesty engineering** | Sidecar anchors {heading-path + exact quote + context}, re-anchored with diff-match-patch (Relay proves dmp for markdown-on-disk reconciliation [SS]); cert marks orphaned anchors. In-file ID markers (HTML comments) = source pollution = dialect betrayal — **refuse**. Bar is low: Notion comments don't survive its own export; Tiptap sells comments as Cloud [fetched/SS] |
| Columns / multi-column layout | **Structurally CANNOT** | Markdown has no column construct; Notion export drops them [SS]. Only route = custom-render directive with cert-declared degradation |
| Synced blocks / transclusion | **Structurally cannot (as bytes)** | Needs reference semantics a text file lacks; nearest honest form = include-by-link rendered in preview, source stays a plain link |
| Block IDs / stable anchors in file | **Refuse** | Stable addressing costs source purity; answer = derived addressing (heading path + content hash) + cert on drift [inference] |
| Live cursors / presence | **Ports** | y-codemirror.next |
| Ghost-text AI + per-hunk review | **Ports (CM6-native)** | codemirror-copilot pattern + @codemirror/merge |

- Demand signal inside markdown-land: **Milkdown's Crepe** — "blocks can be drag and dropped by a handlebar… a list of possible actions" + slash menu, over a markdown-serialized PM doc [SS, milkdown.dev/docs/api/crepe + DeepWiki]. **Tiptap `DragHandle`** is a public npm package (**v3.30.5**, floating-ui-positioned handle that drags *nodes*) [fetched, raw…tiptap-docs…/drag-handle.mdx]; **Tiptap Comments are off public npm (404) — paid/Cloud feature** [fetched, registry.npmjs.org].
- Cost of the block model: block friction (a document becomes N widgets), exit tax, accessibility debt. **Gutenberg** — largest block-editor deployment on earth — WPCampus-commissioned audit found "significant and pervasive accessibility problems"; dedicated screen-reader Navigation mode bolted on in **6.3** [SS, 2020.wpaccessibility.day/talks/gutenberg-accessibility-a-screen-reader-users-perspective/ + wptavern.com].

### Collab plumbing (Yjs) + file-truth
- Adoption [fetched npm, monthly]: **yjs 33,055,939**; **y-prosemirror 7,366,573**; **y-codemirror.next 370,663**; **Hocuspocus server 4.6.0 (2026-08-10)**; **@liveblocks/yjs 3.24.1 (2026-08-19)**. Editor.js still lists collaborative editing as unshipped roadmap checkboxes [fetched README].
- **Relay** (System 3): real-time multiplayer inside Obsidian's CM6 editor, Yjs CRDTs with a **y-sweet-fork** server [SS, forum.obsidian.md/t/…/87170 + relay.md/relay]. Hard problem was NOT the editor binding — it was reconciling CRDT state with **markdown files on disk that change while the editor is closed**, solved with **diff-match-patch plus a diff-review tool** [SS].
- **HedgeDoc 2** rebuilt its collaborative markdown editor around CM6 [SS, docs.hedgedoc.org + DeepWiki]. **Overleaf** retired its legacy editor entirely in **June 2023**, runs CM6 as sole source editor for its own-OT collaborative platform, citing better mobile and non-Latin behavior [SS, overleaf.com/blog/towards-the-future-a-new-source-editor + citedrive.com].
- Lesson [inference]: collab is not blocked by single-engine; file-on-disk stays source of truth, CRDT is transport, reconciliation is an explicit reviewable diff; splice ops are the right commit unit; cert is the surface for "this merge changed bytes you didn't type."

### Unused CM6 ecosystem inventory [fetched npm monthly unless noted]
- **@codemirror/merge — 7,385,555 dl/mo, v6.12.2** ("A diff/merge view for CodeMirror"): first-party, maintained; highest-value unused piece — per-hunk accept/reject for AI edits and cert before/after.
- **@codemirror/lint — 42,969,148 dl/mo**: diagnostics + gutter + panel; render surface for degradation-cert findings (branch `engine/plan-and-diagnostics` already points here).
- **codemirror-languageserver — v1.22.1, published 2026-08-09**: LSP client for CM6; lane for marksman-style markdown LSP.
- **@uiw/react-codemirror — 18,195,349 dl/mo**: React wrapper ecosystem health.
- **Replit extension family** [fetched, api.github.com]: codemirror-vim (**467 stars**), **codemirror-interact (125 stars** — drag a value to scrub numbers), indentation-markers (**89**), minimap (**71**), vscode-keymap (**44**), css-color-picker (**47**).
- **codemirror-copilot** [fetched npm, **0.0.7**]: ghost-text-completion-via-decorations pattern (prototype-grade package, production-grade pattern).
- Live-preview prior art [SS]: `codemirror-live-markdown`, `atomic-editor` (Obsidian-style live preview, Show HN), `ixora`; Obsidian forum "How to configure CodeMirror to work like Live Preview" (forum.obsidian.md/t/…/43047). Decoration discipline: reveal syntax on active line, replace-decorations elsewhere, widgets atomic.
- Also first-party and underused: panels API (persistent cert status bar), tooltip/hover API, fold gutter.

### Mobile / IME regression stories
- **Monaco**: README FAQ — "Is the editor supported in mobile browsers or mobile web app frameworks? **No.**" Disqualified in one line [fetched, raw…/microsoft/monaco-editor/main/README.md].
- **Slate**: issue **#2062** "fix editing with 'soft keyboards' (eg. Android, IMEs)" ran **222 comments**; Android support had to be **crowdfunded** (**#3786** "Proposal for Sponsored Open Source Android Support") [fetched, github.com/ianstormtaylor/slate/issues/2062].
- **ProseMirror**: thread "Contenteditable on Android is the Absolute Worst" [SS, discuss.prosemirror.net/t/…/3810]; **#784** "IME causes DOM and PM doc to get out of sync on Android Chrome"; per-keyboard (Gboard/Samsung/SwiftKey/Sogou) event divergence; iron rule "don't touch the DOM during composition" [SS].
- **Lexical**: powers Facebook/Messenger/WhatsApp web [SS]; same Android tax — **#4941** "backspace deletes two characters on Android", **#4636** Gboard duplicates previous node content, **#6377** "CJK composition broken in android firefox" (OPEN) [fetched, api.github.com].
- **CodeMirror 6**: identical Android IME war — **39 Android-titled issues**; **#1210** composition change-set mismatches; **#1087 Samsung predictive text emits Object Replacement Characters at widget boundaries** (direct design constraint on live-preview widgets); **#1675** selection-handle stuck (OPEN) [fetched, api.github.com]. Structural difference [inference]: fixes land once in one maintained engine. Production proof: **Joplin** runs the same CM6 editor desktop AND mobile (factored into **`@joplin/editor`**; CM6 plugins "should work on both mobile and desktop") [SS, joplinapp.org/help/api/tutorials/cm6_plugin/ + discourse.joplinapp.org/t/…/18724]; Obsidian mobile ships its CM6 editor [inference from live-preview=CM6 [SS] + mobile parity]; Overleaf cited mobile as a migration benefit [SS]. Also referenced: CM6 **#602** lesson alongside #1087.

### Accessibility: block vs text
- **CM6**: rebuilt on contentEditable partly *for* screen readers; exposes `role=textbox` `aria-multiline=true`; "Accessible code editing with CodeMirror 6" FOSDEM 2021 talk [SS, archive.fosdem.org/2021/schedule/event/codemirror/ + codepen.io/afercia/pen/pRBxwd]. One document = one textbox.
- **Lexical**: only framework with a11y in its one-line identity — "excellent reliability, accessibility and performance," WCAG-guided, **22kb core** [SS, github.com/facebook/lexical + lexical.dev/docs/intro]. A11y benchmark to copy semantics from, **not the substrate to adopt**.
- **Block editors**: Gutenberg audit + initial WCAG 2.1 failures + bolt-on nav mode = structural a11y debt (N focusable widgets, per-block toolbars, drag-only affordances) [SS]. **Editor.js markets "speech readers" as a JSON *output* target**, not an editing-surface property [fetched README].
- Inversion [inference]: keep single-textbox surface + outline-level navigation (heading jump commands, outline panel as rotor) + keyboard equivalents for every drag affordance (move-section-up/down).

### AI editors: the accept/reject grammar (the trust contract)
- Canonical spec written **by a user**, Kiro **#8968** "Inline Diff with Per-Line Accept/Reject (like Windsurf/Cursor/Antigravity)" [fetched, github.com/kirodotdev/Kiro/issues/8968]: (1) inline diff decorations in the buffer — added green, removed red/strikethrough, not a separate panel; (2) per-hunk Accept/Reject buttons; (3) top toolbar "Accept File"/"Reject File"; (4) navigation arrows between changes; (5) value triad "Confidence… Control… Speed: no separate diff view or Source Control panel"; (6) killer use case = PARTIAL acceptance ("accept the validation logic but reject the error message format it chose — per hunk, not all-or-nothing"); (7) retention evidence: "Many users (including myself) are choosing Windsurf over Kiro specifically because of this feature, despite Kiro having superior spec-driven development and hooks."
- Claude Code VS Code extension **#31395** [fetched, github.com/anthropics/claude-code/issues/31395] adds: (a) "Active tracking as Claude applies changes — highlights appear in real time as each hunk is written, not just as a final diff at the end" (streaming diff decoration); (b) trust framing "This makes it harder to trust Claude with larger edits… I find myself being more conservative about what I ask Claude to change" — **missing per-hunk review SHRINKS delegated task size**. Related: **#61794, #42448, #31888, #40409** [SS].
- **Both leaders regressed and were burned — twice-proven retention feature:**
  - Windsurf **Exafunction/codeium#131** "[Regression] Loss of Accept/Reject Controls" — "changes are automatically applied with only a non-interactive diff view shown… Increased risk of incorrect changes being applied." OPEN, **10 reactions, 7 comments** [fetched]. Windsurf later shipped a toolbar to "navigate diffs and accept/reject all changes" + freeze-bug fixes [SS, windsurf.com/changelog].
  - Cursor forum "Bring back per-change Apply + inline diff review — you're throwing away your best UX advantage" [SS, forum.cursor.com/t/…/160856], plus "How to Enable Diff Review UI After Latest Update?", "Can we bring the inline diff view?", bug reports that green/red "Cancel/Keep" stopped appearing and changes auto-applied [SS, threads **154231, 146592, 152099**].
  - Decision [inference]: treat any change to the review surface like a breaking API change.

### Per-tool grammar inventory
| Tool | Grammar | Tag |
|---|---|---|
| Cursor Cmd+K | select → Cmd+K → instruction → inline diff (red deleted / green added) → **Cmd+Enter** accept; follow-ups regenerate in place | [SS, cursorpractice.com, stevekinney.com] |
| Cursor Agent | all changes land first, then reviewed together, individually or accept-all | [SS] |
| Cursor Tab | Tab accepts whole; **Ctrl+RightArrow accepts NEXT WORD** (`editor.action.inlineSuggest.acceptNextWord`); accept-next-LINE exists but bug-prone | [SS, forum.cursor.com/t/partially-accept-a-tab-completion/21949] |
| Copilot / VS Code | ghost text Tab-accept, partial accept next word/line; hover reveals ALTERNATIVE suggestions; **Next Edit Suggestions (NES)** "predicts the location of the next edit… and what that edit should be", Tab both NAVIGATES and accepts; NES opt-in via `github.copilot.nextEditSuggestions.enabled` (**disabled by default**); agent-mode framing "you guide the agent, review its actions, and decide which changes to keep"; Copilot Edits hunk controls in gutter + per-file Accept All/Reject All | [fetched, raw microsoft/vscode-docs docs/editing/ai-powered-suggestions.md, docs/agents/overview.md; SS] |
| Zed agent panel | after edits panel surfaces "which files, how many of them, and how many lines have been edited" → accordion above message editor → "Review Changes" opens a **MULTI-BUFFER tab** → "accept or reject each individual change hunk, or the whole set". `agent.single_file_review: true` shows keep/reject hunk controls inline per file, "temporarily overrides the buffer's git diff while review is active" | [fetched, raw zed docs/src/ai/agent-panel.md] |
| Zed edit prediction | tab accept; alt-tab; **AcceptNextWord / AcceptNextLine**; two display modes — **`eager`** (inline as you type) and **`subtle`** (predictions appear ONLY while holding a modifier key). Subtle = best anti-AI-creep pattern found in the category | [fetched, docs/src/ai/edit-prediction.md] |
| Claude Code checkpoints | checkpoint per prompt; **Esc Esc** or **/rewind**; three-way restore — code+conversation, code only, conversation only; **30-day retention** | [SS, code.claude.com/docs/en/checkpointing] |
| Craft AI assistant | two modes — "Explore (proposes changes and waits for approval) and Execute (applies changes directly)" | [SS, support.craft.do] |

### Acceptance telemetry
- GitHub analysis of **934,533 users**: **28.9%** of suggestions accepted in first 3 months → **32.1%** next 3 months → **~34%** by month 6 [SS, github.blog research]. GitHub/Accenture **~30%** [SS, itpro.com]. ZoomInfo **33% suggestions / 20% of lines** [SS]. Public-sector pilot **22% overall, <5% in Java** [SS, arxiv 2409.17434].
- Consequences [inference]: (a) rejection is the MAJORITY event — reject path must be as frictionless as accept (esc / keep-typing-to-dismiss), rejections are the richest signal; (b) acceptance CLIMBS over months → per-user adaptive thresholds beat global constants.

### Rules files as a user-facing feature
- **Cursor**: legacy `.cursorrules` (single root file, deprecated) → `.cursor/rules/*.mdc`, markdown-with-frontmatter, version-controlled. Four attachment modes in UI: "Always Apply, Apply Intelligently (description only), Apply to Specific Files (globs), Apply Manually"; **NESTED rules** — any folder can carry its own `.cursor/rules/`, auto-attaching when files in that subtree are referenced; rules creatable from Settings > Rules or generated from a conversation [SS, techsy.io, cursor.com/docs].
- **Resentment signal**: Cursor gave `.mdc` a special editor UI; users ask how to TURN IT OFF and see plain markdown (`"workbench.editorAssociations": {"*.mdc": "default"}`) [SS, techsy.io]. Direct confirmation of the "dialect betrayal" red line: rules files must open as ordinary markdown, no special mode [inference].
- **Windsurf**: two layers — Rules (`global_rules.md` + `.windsurfrules`, **HARD 6,000-char limit each, silently truncated beyond**) and Memories (AI-authored: "create a memory of…", workspace-scoped, retrieved when Cascade thinks relevant, Memories panel) [SS, docs.windsurf.com via paulmduvall.com, datacamp].
- **CLAUDE.md**: plain markdown, hierarchical (global → project), imports via @-references — no special UI; the file IS the interface [inference from product + this session's environment].
- Ecosystem effect: **awesome-cursorrules (PatrickJS)**, directory economy (**dotcursorrules.com, cursor101**) [SS] — rules files became shared/copied artifacts, i.e. content marketing + lock-in surface.
- Prose equivalents: **Jasper "Brand Voice"** (learned from uploaded examples/URLs/files; Pro **$59-69/seat** caps at **2 voices + 5 "Knowledge Assets"**; unlimited only on custom Business tier) + "Knowledge Base" grounding [SS, eesel.ai]. **Sudowrite "Story Bible"** (characters, locations, plot threads) with documented drift: "by chapter 15, Muse began to miss or contradict small details even when entered in the Story Bible" [SS, dreamgen.com]. **Lex** adapts continuations to your voice over time [SS].

### Surface ranking: chat vs inline vs ghost text
- **Ghost text**: highest friction-complaints of any surface — "Extremely intrusive ghost text", blocks IntelliSense popups (**vscode#317863**), demand for manual-trigger-only modes [SS, github discussions **181100/138225**]. Copilot's answer set: per-language enable/disable map (`github.copilot.enable`), status-bar **SNOOZE in 5-minute increments**, manual trigger (**Alt+\\**) [fetched]. Zed's answer: `subtle` mode [fetched]. Zed took heat when edit predictions could NOT be disabled in a Preview build (**zed#27590** — "I cannot use Zed at work… advocating via risk management") [fetched] and shipped a one-switch "disable all AI features" release + blog post [SS, zed.dev/blog/disable-ai-features].
- **Inline edit (Cmd+K)**: low-complaint, high-praise; anger is about its REMOVAL, never its existence [SS, 160856]. Best trust-to-power ratio → should be frontmatter's primary AI surface [inference].
- **Chat/agent panel**: earns usage for multi-file work; where auto-apply anxiety lives; needs checkpoints + review mode.
- **NES** ships DISABLED by default [fetched] — even the most aggressive vendor gates the most proactive surface behind opt-in.
- **Notion AI (cautionary tale)**: "four different AI buttons on their Notion screen simultaneously"; Ask AI popup covering text being read; an "animated AI face custom-designed to distract" drawing Clippy comparisons; users resort to uBlock rules targeting `.notion-ai-button` and email support to disable AI account-wide [SS, techresolve.blog, keycorrect.com, dev.to AI-UX-crisis]. **Craft counter-pattern**: AI behind Cmd+Enter / slash command / block menu, plus **ON-DEVICE models (Llama 3.2 1B/3B, DeepSeek R1)** for privacy/offline [SS, craft.do/blog].
- Emergent ranking [inference]: deliberate inline edit > review-moded agent > on-demand chat > ghost text (tolerated only when subtle/snoozable) > proactive buttons/popups (net-negative).

### AI-first writing editors: features + traction
- **Lex.page**: minimalist editor; AI summoned by typing **"+++"** for a continuation in your voice; "Ask Lex" side questions; **"Checks"** — Commands > AI: Run Checks (grammar, brevity, clichés, readability, passive voice, confidence, repetition) highlighting spans **in pink**, click shows suggested reformulation with one-click accept/reject and an **"Explain"** icon. Crucially: a real **"track changes for AI edits" was still LISTED AS IN DEVELOPMENT** [SS, techforword.com, ainewsandupdates.com] — the writing category lags code by ~two years on review grammar. Traction: spun out of Every; **~25,000 signups in first 24h (Oct 2022)**; **$2.75M seed led by True Ventures (Aug 2023)**; profitability expected this year; Lex paid plans bundled free for Every subscribers [SS, techcrunch.com/2023/08/23, every.to].
- **Type.ai**: YC-backed; "AI-first document editor" — Generate Draft, Type Chat, **Document Reviews** (AI edit passes across the WHOLE document), "What to write next" button, large effective context ("understands the entire document rather than the bit you're viewing") [SS, blog.type.ai, producthunt]. **$29/mo or $276/yr** [SS].
- **Sudowrite** (fiction): Story Bible + credits (**$19/$29/$59**; premium "Muse" model burns credits fast — top complaint), **no EPUB/DOCX/PDF export** (locked-in canvas), bible drift [SS, dreamgen.com, builtwritten.com].
- **Jasper**: repositioned from writing assistant to "brand-governed AI workspace" — Brand Voice, Knowledge, Style Guide, agents, permissions; **$39-69/seat** [SS, eesel.ai].
- Take [inference]: voice-adaptive continuation summoned by a TYPED sigil (not a button), whole-document review passes, checks-as-highlight-spans with explain, notes/bible as persistent context. Avoid: credit anxiety, no-export canvases, template sprawl.

### AI provenance — the absence check
What EXISTS:
1. **Cursor AI Code Tracking** (team feature): signature for every AI-suggested line (Tab or Agent), stored locally; at commit time compares signatures to committed code and marks matches AI-generated; surfaced via admin "AI Code Tracking API" for engineering-leadership dashboards [SS, cursor.com/docs/account/teams/ai-code-tracking-api, jellyfish.co].
2. **Agent Trace** — Cursor's open spec (RFC released **Jan 2026**; InfoQ coverage **Feb 2026**): vendor-neutral JSON "trace record" linking code ranges to conversations and contributors; contributor types **human | ai | mixed | unknown**; per-file or line-range (`ranges: [{start_line, end_line}]`, `contributor: {type, model_id}`, conversation URL); storage-agnostic, default **`.agent-trace/traces.jsonl`** [SS, infoq.com/news/2026/02/agent-trace-cursor, agent-trace.dev, jangwook.net]. **github.com/cursor/agent-trace 404'd on direct fetch** (repo moved or pulled; search index still lists it) [fetched-404] — schema details are secondary writeups, tagged [SS].
3. **Grammarly Authorship** (prose, adjacent): records the WRITING PROCESS — typed vs pasted (browser-source vs unknown) vs AI-generated vs AI-rephrased; works in Google Docs, Word, Grammarly Editor; free tier; admitted gaps (fast keystrokes missed, desktop pastes unseen, unknown AI tools uncategorized) [SS, grammarly.com/authorship, support.grammarly.com]. Output is a defensive REPORT living in Grammarly's system, not in the document.
4. **Third-party bolt-ons**: **LineageLens** (captures AI insertions of **4+ lines** with prompt/model/tool, `lineagelens blame` per-line attribution) and **Exceeds Ink** (provenance into **git notes**, surviving merges/rebases) [SS, lineagelens.dev, blog.exceeds.ai]. Their existence is evidence the editors don't surface this.
5. **NOT provenance but confused with it**: Copilot code referencing — "Similar code found with n license types - View matches" toast when output matches PUBLIC code; about license risk of the input corpus, not which bytes AI wrote [SS, docs.github.com, github.blog].

What does NOT exist anywhere: no editor renders authorship IN the document at read time (no toggleable "show AI ink"); no provenance travels WITH the file (every scheme is repo-sidecar or vendor-cloud — email the file and provenance is gone); nothing byte-anchored (line ranges everywhere; line numbers rot under edits unless recomputed); in writing editors (Lex, Type, Notion, Craft, Sudowrite, Jasper) **nothing at all** — after acceptance AI text is indistinguishable from typed text. Plagiarism Today frames Grammarly's rewriting as **"laundering"** AI content [SS, plagiarismtoday.com 2025-11-06] — market trajectory is provenance DESTRUCTION.
- **Honest claim scoping** (LR#72): NOT "first to track AI authorship". Defensible category-first: **first markdown-native editor where provenance is (a) byte-range-anchored via splice, (b) stored in/with the document so it survives leaving the tool, (c) rendered to any reader at read time, (d) interoperable — emitting/ingesting Agent Trace records.** That claim survived the check.

### Pricing table
| Tool | Price | Usage shape | Notes |
|---|---|---|---|
| Cursor Pro | **$20/mo** (Ultra **$200**) | $20/mo model-usage pool at API rates; "Auto" routing unlimited | **June 2025 repricing fiasco**: 500-fast-requests → opaque credits, surprise **$10-20/day** charges, CEO apology + refunds [SS, techcrunch.com 2025-07-07] |
| Windsurf | Free / Pro **~$15-20** / Max **$200** | Credits (**500/mo**) REPLACED **March 2026** by auto-refreshing daily/weekly quotas; **unlimited Tab autocomplete even on Free** | Two billing-model churns in <2 years [SS, cloudzero, costbench, pecollective] |
| Copilot | Free / Pro **$10** / Pro+ **$39** / Max **$100**; Business **$19**, Enterprise **$39** | Free = **2,000 completions + 50 chat/mo**; **June 1 2026**: premium requests → dollar-denominated "AI Credits" (Pro **$15-worth/mo**) | [SS, costbench, usagebox, nocode.mba] |
| Zed | Editor free, **no auth required**; Pro (price on site) | Free: **BYO API keys allowed**, external agents allowed, **2,000 predictions/mo**; Pro: **$5/mo token credit** then metered; Business adds org AI controls | "Zed works without AI features or a subscription" is the doc's FIRST line [fetched, docs/src/account/plans-and-pricing.md] |
| Lex | Free + Pro (model-gated) | Free tier limited by Ask-Lex messages/Checks/custom prompts; free collaboration | [SS, lex.page/pricing] |
| Type.ai | **$29/mo or $276/yr** | 14-day trial | [SS] |
| Sudowrite | **$19/$29/$59/mo** | Credit pools (**225k/1M/2M**), rollover on Max; credit-burn is complaint #1 | [SS, dreamgen] |
| Notion AI | Bundled into **$20/user** Business (**May 2025**; standalone **$10** add-on killed) | Free/Plus: **20 AI responses LIFETIME** | "cannot drop AI without dropping to Plus" [SS, usecarly.com, fast.io] |
| Jasper | **$39-69/seat** | Caps: 2 brand voices, 5 knowledge assets on Pro | [SS, eesel.ai] |

- Pattern [inference]: category converged on flat seat + transparent dollar-metered AI; every OPAQUE transition (Cursor credits, Windsurf churn, Notion bundling) produced documented backlash. Accepted equilibria: (1) cheap surface unlimited (Windsurf Tab free-unlimited), (2) dollars-not-credits with a visible meter, (3) BYO-key escape hatch (Zed allows on FREE), (4) editor usable at $0 without an account.

### Failure-mode catalog (never commit)
1. Auto-apply without review — both leaders regressed into it; instant trust collapse.
2. AI-surface creep — Notion's four simultaneous AI buttons, popup-over-content, animated AI face; countered with ad-blockers [SS]. Every affordance must be summoned, not ambient.
3. Un-disableable AI — zed#27590 framed as WORKPLACE COMPLIANCE blocker, forcing a global kill switch [fetched/SS].
4. Silent scope destruction — "Watch out, 'Clean up this code' deletes your comments" [SS, forum.cursor.com **152547**]. Splice byte-fidelity is the structural answer; surface it ("only these N bytes changed, cert attached").
5. Opaque repricing (Cursor June 2025; Windsurf churn; Notion bundling).
6. Context drift in persistent memory (Sudowrite Story Bible contradictions by ch. 15) — memory needs verification surfacing, not blind trust [SS].
7. Provenance laundering — rephrase-to-hide-AI as a product feature [SS].
8. Special-UI dialect over markdown (.mdc resentment).
9. Rules silently truncated at a char limit (Windsurf **6,000**) — silent context loss reads as model stupidity [SS].

### Frontmatter feature-extraction (ed3 summary table)
| # | Feature | Source | Frontmatter form | Verdict |
|---|---|---|---|---|
| 1 | Drag-to-reorder blocks | Notion/Tiptap DragHandle/Crepe | Gutter handle on lezer spans → splice move, byte-identical | Take — differentiator |
| 2 | Turn-into menu | Notion/BlockNote | Marker rewrite via splice | Take — cheap |
| 3 | Toggle/collapse | Notion toggles | CM6 folding, state in sidecar | Take — cheap |
| 4 | AI diff review | @codemirror/merge + Relay pattern | Per-hunk accept/reject merge view wired to splice + provenance | Take — flagship |
| 5 | Cert-as-lint | @codemirror/lint | Cert findings as diagnostics/gutter/panel | Take |
| 6 | Ghost-text AI | codemirror-copilot pattern | Widget-decoration ghost text, provenance-tagged | Take |
| 7 | Comments w/ honest anchors | Tiptap Comments (paid)/Notion | Sidecar anchors + dmp re-anchor + cert on orphan | Take — later |
| 8 | Table editing widgets | Obsidian-over-CM6 proof | GFM table widgets, block-scoped writes | Take — heavy |
| 9 | Collab file-truth layer | Relay/y-codemirror.next | Yjs transport, file = truth, dmp reconcile surfaced as diff | Take — roadmap |
| 10 | One-engine mobile | Joplin @joplin/editor | Same CM6 bundle both platforms; widgets IME-hardened | Take — principle |
| 11 | Number/date scrubbing | replit/codemirror-interact | Drag-scrub YAML values, kanban WIP | Take — delight |
| 12 | Keyboard block-nav a11y | Gutenberg lesson (inverted) | Outline panel + move/jump commands mirroring every drag op | Take |
| 13 | Structural JSON for AI | BlockNote/Editor.js JSON models (inverted) | Read-only lezer-derived JSON view for AI protocol; never storage | Take — protocol |
| — | **Columns / synced blocks / in-file IDs** | Notion | No markdown form without dialect betrayal | **Refuse** |

### Frontmatter feature-extraction (ed4 AI-editor specifics)
- **Per-hunk Keep/Reject inline diff as the AI-edit contract (never silent auto-apply)** → AI edits arrive as pending spans anchored to splice byte-ranges; green/red decoration in the markdown buffer; per-hunk Keep/Reject + keyboard (**enter=keep, esc=reject**); per-file bar with Keep All / Reject All + up/down hunk navigation; **streaming decoration while the edit is being written**; every keep/reject/partial logged locally as telemetry.
- **Review-as-a-mode** [Zed `agent.single_file_review`] → status chip "edited 3 docs, 41 lines" → Review opens one scroll of all changed markdown with same hunk controls; optional inline overlay per document while review is active.
- **Partial acceptance at the prose-natural unit (sentence)** — word too small, line meaningless → Tab accepts all, **Cmd+Right accepts next SENTENCE**, keep-typing dismisses; partial accepts recorded distinctly ("right direction, wrong length").
- **Subtle mode default** → hold **Alt** to peek continuation; eager opt-in; per-document override in YAML frontmatter (`ai_suggest: eager|subtle|off`).
- **Snooze + per-context AI disable** → one-click **Snooze (15 min)** in status bar; per-folder/per-doctype map (`ai: {'journal/**': off, 'posts/**': on}`).
- **Global AI kill switch, loudly marketed** → `ai.enabled: false` hides every AI affordance (buttons, panels, ghost text, protocol) and the editor stays 100% functional; state it on the pricing page, Zed-style.
- **Checkpoint-per-AI-op with three-way rewind** → snapshot markdown before every AI op; Rewind menu restore-document / restore-conversation / restore-both; **30-day retention**; snapshots are plain files.
- **Rules as plain markdown with frontmatter-declared attachment modes** → **`.frontmatter/rules/*.md`**, YAML carries `apply: always|auto|glob|manual` and `globs:`; nested per-folder rules; **NO special editor UI**; explicit over-budget warning instead of silent truncation; "Save as rule" from any AI chat; active-rules chips on every AI invocation.
- **AI-authored memories with a user-curated panel** → cards proposed as markdown in **`.frontmatter/memories/`** (never silently); panel lists/edits/deletes; workspace-scoped; visible attribution when used.
- **Voice profile + knowledge cards** → `voice.md` (tone/diction/anti-patterns) + `entities/*.md` typed via frontmatter (`type: character|product|term`); AI protocol auto-attaches matching cards; custom renders visualize the set; drift check flags contradictions.
- **AI prose edits as in-document track changes (CriticMarkup-style)** → suggestions written as **`{++ins++}`, `{--del--}`, `{>>comment<<}`** in the file; rendered as track changes with one-click accept/reject + Explain; whole-document review-pass checks (clichés, passive voice, repetition) as highlight spans; CriticMarkup degrades readably and the cert can certify it.
- **Byte-anchored, in-document, reader-facing provenance + Agent Trace interop** → on every Keep, splice records byte range + `{contributor: human|ai|mixed, model, op ref}` into document-carried provenance (frontmatter block or paired sidecar that moves with the file); **"Show AI ink"** toggle shades AI-authored bytes for ANY reader at read time; import/export Agent Trace-compatible records (`.agent-trace/traces.jsonl`).
- **Three-class ink map: typed / pasted / AI** [Grammarly Authorship] → paste events recorded as provenance class "pasted" (optional source URL); three-color map; exportable per-document authorship report for academic/compliance users.
- **Implicit telemetry from the review grammar (local-first)** → log accept/reject/partial/edit-distance-after-accept per surface (ghost, inline edit, review pass), per rule, per model — locally, never phoned home by default; auto-tune surfaces (e.g. drop ghost text to subtle if 30-day accept rate below threshold); rank which rules change outcomes.
- **Pricing shape** → editor + custom renders + provenance free (or one-time); AI subscription metered in dollars with always-visible in-app meter; **BYO-API-key at every tier including free**; cheap surface (checks/ghost via small local model) unlimited; public changelog promise: no billing-model change without opt-in migration.
- **On-device model for ambient surfaces** [Craft: Llama 3.2 1B/3B, DeepSeek R1] → bundled small local model powers ghost continuations and review-pass checks offline; cloud reserved for summoned heavyweight ops; provenance stores which model class produced each span.
- **Propose-first as the named default mode (Explore vs Execute)** → AI defaults to Propose (pending spans, review required); Execute-directly is per-op opt-in with a distinct visual state; setting is per-workspace, surfaced in AI panel header.

### Contradictions / tensions recorded
- **ed3 vs ed4 on comment anchoring**: ed3 says in-file ID markers (HTML comments) = source pollution = **refuse**; ed4's CriticMarkup recommendation *does* put `{>>comment<<}` markers in the file and argues it is not dialect betrayal because CriticMarkup degrades readably and the cert certifies it. These disagree on where the in-file-markup red line sits.
- **Milkdown positioning**: markets itself markdown-first yet its tracker is the round-trip-corruption ledger — the source treats this as proof no tree-of-record can be safe, not as a Milkdown-specific defect.
- **Novelty scoping**: ed4 explicitly refuses the stronger claim ("first to track AI authorship") that the feature list could otherwise imply.

### Explicit anti-recommendations (do NOT build)
- Do not adopt a tree-of-record (PM/Lexical/Slate/BlockNote/Editor.js document model) **even for one feature** [inference].
- Do not build columns / multi-column layout, synced blocks / transclusion, or in-file block IDs — structurally impossible without dialect betrayal; Notion's own export drops them.
- Do not build a Notion-style esc-to-select block *mode* (mode = friction).
- Do not adopt Monaco (mobile: "No.").
- Do not adopt Lexical as substrate (a11y benchmark only, copy semantics not engine).
- Do not give any config/rules file a special editor UI (the `.mdc` resentment).
- Do not silently truncate rules at a char budget (Windsurf 6,000).
- Do not auto-apply AI edits; do not iterate the review surface casually.
- Do not ship credit-based or opaque pricing; do not force-bundle AI.
- Do not make JSON the storage truth — structural JSON is a read-only, regenerable, lezer-derived protocol view only.