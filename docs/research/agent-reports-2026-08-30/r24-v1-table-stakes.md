Reconcile verified; no writes or commits by this subagent. Report follows.

---

Our own preview-side table editor regenerates the document — [measured] editing one cell in a padded 4-line GFM table rewrote **3 of 4 lines** and destroyed **3 of 4 carriage returns** on a CRLF file — which means the exact failure mode frontmatter exists to refuse is already shipped in `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/modules/preview/presentation/table-edit.ts`, and that single file is both our worst floor gap and our clearest USP.

**Sources opened** (all `curl`, all this session; `WebFetch` never attempted):

| Source | URL | Status | Date on page |
|---|---|---|---|
| Obsidian Help (Hotkeys, Command palette, Quick switcher, Search, Outline, Properties, Advanced formatting) | `publish-01.obsidian.md/access/f786db…` raw `.md` | 200 | live; palette note cites **v1.8.3** |
| Typora Shortcut Keys | `support.typora.io/Shortcut-Keys/` | 200 | **Updated July 19, 2026** |
| iA Writer Shortcuts (Mac) | `ia.net/writer/support/basics/shortcuts` | 200 | live |
| Bear FAQ: Mac shortcuts, folding, tables, custom shortcuts | `bear.app/faq/*` | 200 | © 2025 footer |
| Zed default macOS keymap | `raw.githubusercontent.com/zed-industries/zed/main/assets/keymaps/default-macos.json` | 200 | 1722 lines, `main` |
| VS Code Markdown docs | `code.visualstudio.com/docs/languages/markdown` | 200 | live |
| Zettlr Table Editor | `docs.zettlr.com/en/editor/tables.html` | 200 | **Last update 8/2/26** |
| Zettlr Search | `docs.zettlr.com/en/editor/search.html` | 200 | **Last update 8/18/26** |
| Logseq shortcut registry | `raw.githubusercontent.com/logseq/logseq/master/src/main/frontend/modules/shortcut/config.cljs` | 200 | 42.8 KB |
| Emacs markdown-mode README | `raw.githubusercontent.com/jrblevin/markdown-mode/master/README.md` | 200 | **2.8, released Mar 8 2026** |
| MarkText repo/releases | `api.github.com/repos/marktext/marktext` | 200 | 60,780★, **v0.20.0-rc.1, 2026-07-05** |
| HN Algolia (table editing 303 hits; notion export 92; scroll sync 11; typewriter 970) | `hn.algolia.com/api/v1/search` | 200 | — |
| Obsidian forum search | `forum.obsidian.md/search.json` | 200 | — |
| Reddit | `reddit.com/r/ObsidianMD/search.json` | **403** | — |
| Ulysses help | `help.ulysses.app/kb/…` | **404** on two guesses | — [SS] |

Ulysses, Craft, Reflect are **[SS]** — I could not open a keymap for them and will not describe them from memory. Notion is characterised only from [fetched] HN comments, not from its docs.

---

**THE FLOOR TABLE.** "Cost" is engineering days for two founders on CodeMirror 6, given what CM6 already ships. "Have it" is from reading `src/modules/editor/` and `src/modules/preview/`.

| Capability | Who has it | Disqualifying if absent? | Cost on CM6 | Do we have it today? |
|---|---|---|---|---|
| **Formatting hotkeys** (bold/italic/code/heading/list/link) | All. Typora ⌘B/I/U/K + ⌘1–6 [fetched]; Bear ⌘1–6/B/I/K/L [fetched]; iA ⌘1–6/B/I/K/J [fetched]; Logseq `mod+b`/`mod+i`/`mod+l` [fetched] | **YES** | ~0 (have) | **Partial** — only `Mod-b`, `Mod-i`, `Mod-e` in `CodeMirrorEditor.tsx:224-226`. **No ⌘1–6 headings, no ⌘K link, no list/quote/task hotkey.** Those exist as toolbar buttons only (`Toolbar.tsx:37-115`) |
| **Customisable keymap, in-app** | Obsidian (Settings→Hotkeys, multi-binding, filter) [fetched]; Zed (keymap JSON) [fetched]; VS Code; Logseq [fetched]. **Not** Typora/Bear/iA — all three punt to macOS *App Shortcuts* [fetched, all three] | **NO** (half the field punts) — but disqualifying for a dev audience | 3–4 d (command registry + `Prec` compartment + settings UI) | **NO.** `use-hotkey.ts:5` literally types the world as `"mod+k" \| "mod+p" \| "mod+g"` |
| **Command palette** | Obsidian ⌘P, fuzzy, pinned, recents since 1.8.3 [fetched]; Zed `cmd-shift-p` [fetched]; Logseq `mod+shift+p` [fetched]; VS Code. **Absent** in Typora, Bear, iA [fetched keymaps, all three] | **YES** for a keyboard product | 1–2 d to fix | **Yes but thin** — `CommandPalette.tsx`, **14 static commands**, no formatting/fold/outline/export commands, **no hotkey column, no recents, no pinning** |
| **Fast fuzzy file switching** | Obsidian ⌘O (recents on empty query, Enter-to-create, ⌘Enter new tab) [fetched]; iA ⇧⌘O [fetched]; Bear ⌘O [fetched]; Typora ⌘⇧O [fetched]; Zed `cmd-p` [fetched] | **YES** | 0.5 d for the deltas | **Yes** — `Spotlight.tsx` on `mod+k`, `fuzzy.ts` subsequence ranking. [measured] ranks `README` above `readme-draft` above `Archive/2019 Read me later` for `readme` — correct. Missing: recents-on-empty, create-on-miss, ⌘Enter new tab |
| **In-note find & replace, regex** | Zettlr: regex + `$1` capture groups, documented with examples [fetched 8/18/26]; Typora ⌘H replace [fetched]; Bear ⌥⌘F [fetched]; iA ⌥⌘F [fetched]; CM6 ships it | **YES** | 0 (have) | **Yes, free** — `search({top:true})` + `searchKeymap` in `CodeMirrorEditor.tsx:203-204`; CM6's panel carries the regexp toggle. Themed at `.cm-panel.cm-search` |
| **Vault-wide search** | Obsidian ⌘⇧F with operators, `OR`, `-`, `/regex/`, `path:` [fetched]; Bear ⇧⌘F [fetched]; Zettlr global search [fetched] | **YES** | 0 (have) | **Yes** — `SearchPanel.tsx` (title/body/tag/folder scopes), MiniSearch server index at `vault/infrastructure/search-index.ts` |
| **Vault-wide *replace*** | **Nobody in this survey.** Obsidian's Search.md documents regex search and zero replace [fetched] | **NO** | 4–6 d | **NO** — and this is the opening (below) |
| **Outline / TOC navigation** | Obsidian Outline core plugin, drag-to-reorder sections [fetched]; VS Code Outline view + **Ctrl+Shift+O go-to-header** [fetched]; Zed `cmd-shift-o` [fetched]; Bear ⇧⌘A panel [fetched]; Typora ⌘⌃1 [fetched]; markdown-mode TOC view [fetched] | **YES** | 0.5 d | **Panel only** — `Outline.tsx` + `outline-utils.ts` (fence-aware ATX extractor, github-slugger). **No hotkey, no fuzzy heading jump, no drag-to-reorder** |
| **Code folding** | Bear ⌘' + hover chevrons [fetched]; Zed `cmd-k cmd-l` / `cmd-shift-enter` fold-all [fetched]; VS Code; Logseq `mod+up`/`mod+down` [fetched] | Borderline **YES** | 0 (have) | **Yes** — `codeFolding() + foldGutter() + foldKeymap`. [measured] `lang-markdown/dist/index.js:43` ships a `headerIndent` foldService and `:66` a GFM `Table` fold, so heading + table folding come free. Chevrons fade in on hover (`CodeMirrorEditor.tsx:96-113`). **No fold-all** |
| **Autocomplete: links** | Obsidian `[[`; VS Code path IntelliSense incl. `#header` and **cross-file `##` workspace header completion** [fetched]; iA wikilinks [fetched]; Bear note autocomplete [fetched] | **YES** | 1 d for headers | **Yes for note names** — `completions.ts` `matchTrigger` handles `[[`. **No heading completion, no `[[note#heading]]`, no path completion for images** |
| **Autocomplete: tags** | Obsidian `#`; Bear tag autocomplete [fetched]; iA hashtags in Quick Search [fetched] | **YES** | 0 (have) | **Yes** — `completions.ts` tag branch |
| **Autocomplete: emoji** | Typora (Esc-triggered on macOS) [fetched]; Bear "quickly add emoji" [fetched] | **NO** | 0.5 d | **NO** — recorded as a cut (see cuts) |
| **Table editing without counting pipes** | **Zettlr is the reference**: Tab/Shift-Tab/Enter cell nav, auto-row-on-Tab-at-end, `Alt+Shift+Arrow` add row/col, `Alt+Arrow` swap, `Ctrl+L/C/R` column align, `Cmd+Shift+A` re-pad, right-click add/remove/swap/clear [fetched 8/2/26]. Obsidian: right-click add/delete/sort/move in Live Preview + Insert Table command [fetched]. Bear ⌥⌘T + `^⌘↓/→/⌫` [fetched]. Typora ⌘⌥T [fetched] | **YES** | 5–8 d to match Zettlr | **Broken.** `editable-table.tsx` gives click-a-cell → `<input>` → Enter/Escape. No Tab nav, no add/remove row or column, no alignment, no keyboard entry point, and **it regenerates** — see below. `toolbar-transforms.ts:278 insertTable` only inserts a scaffold |
| **List continuation, indent/outdent, checkbox toggle** | Universal. iA ⇥/⇧⇥ + ⌥⌘X complete task [fetched]; Bear ⌘T todo, ⌘. toggle [fetched]; Typora ⌘[ / ⌘] [fetched]; Logseq tab/shift+tab [fetched] | **YES** | 0.5 d for the gaps | **Mostly** — `insertNewlineContinueMarkup` + `deleteMarkupBackward` + `indentWithTab` (`CodeMirrorEditor.tsx:227-232`). **No checkbox-toggle hotkey** — `toggleTaskAtLine` exists in `toolbar-transforms.ts:112` but is unbound. **No move-line-up/down** (iA ⌥⌘↑↓, Bear, Logseq all have it) |
| **Paste: images** | Universal | **YES** | 0 (have) | **Yes** — `CodeMirrorEditor.tsx onPaste` → `/api/vault/upload` → `![name](path)` |
| **Paste: URL over selection → link** | Obsidian, Typora, VS Code | **YES** | 0 (have) | **Yes** — `URL_RE` + `[sel](url)` |
| **Paste: HTML → markdown** | VS Code ("paste a file, a link to a file, or a URL … insert a Markdown link") [fetched]; Typora *Paste As Plain Text* implies rich paste [fetched]; a 2026-08-06 Show HN sells exactly this: "paste webpage content into the MD editor and it'll paste as formatted markdown … Paste tables from Excel Google Sheets etc to Markdown tables" [fetched] | **YES** | 2–3 d (rehype→remark on `text/html`) | **NO.** Pasting a web page or a spreadsheet range drops raw HTML or tab-separated junk |
| **Drag & drop files** | VS Code: drag from Explorer or OS, Shift to drop, preview cursor [fetched] | Borderline | 1 d | **Partial** — `onDrop` accepts image files only; `FileTree.tsx:159-166` + `TreeItem.tsx:113-173` do internal note moves. Dropping a `.md`/`.pdf` into the editor does nothing |
| **Undo granularity** | All | **YES** | 0 (have) | **Yes, and better than most** — CM6 `history()`, plus `Transaction.addToHistory.of(false)` on store-driven edits so a panel edit never eats the typist's undo stack |
| **Split panes** | Zed; VS Code; Zettlr split view [fetched]; Typora ⌘` doc switch (no split) [fetched] | Borderline | 0 (have) | **Yes** — 4 modes (`edit/live/reading/split`) + a second note pane (`EditorPane.tsx:668+`), draggable ratio persisted to `sgnk-split` |
| **Scroll sync in split** | Complained about repeatedly: "the viewer seems to follow but actually it's not in sync" (HN 2020-03-29) [fetched]; "md preview scroll" named as the gap in the SilverBullet thread (HN 2022-12-03) [fetched] | **YES** if you ship split | 0 (have) | **Yes, and thoughtfully** — `split-scroll-sync.ts` is intent-driven with a 250 ms driver window, a real fix for the reflow-yank bug. But it is **fractional**, not construct-anchored |
| **File tree** | All desktop editors | **YES** | 0 (have) | **Yes** — `vault/presentation/file-tree/*` with context menu, rename, trash, DnD |
| **Frontmatter editing** | Obsidian Properties: typed (text/list/number/checkbox/date/tags), `Cmd/Ctrl+;`, vault-wide type consistency [fetched]; Zettlr YAML front matter page [fetched]; iA Metadata [fetched] | **YES** for a product named frontmatter | 2 d for types | **Yes, untyped** — `PropertiesPanel.tsx` + `preview/presentation/frontmatter.ts` + `mdmax/domain/frontmatter-prepass.ts`. No property types, no vault-wide key registry, no `Cmd+;` |
| **Math + diagrams** | Typora ⌘⌥B math block [fetched]; Zettlr math + Mermaid pages [fetched]; Bear math + Mermaid FAQs [fetched] | **YES** in 2026 | 0 (have) | **Yes in preview** — `remark-math` + `rehype-katex` (`Markdown.tsx:7,10,13`), `mermaid-block.tsx` with `securityLevel:"strict"`. **Not rendered inline in the edit surface** |
| **Export** | Zettlr = Pandoc, profiles, LaTeX, Lua filters [fetched]; markdown-mode `C-c C-c e/v/w` [fetched]; iA ⇧⌘E + templates [fetched] | **YES** | 0 (have) | **Strong** — `.md`, HTML, `.doc`, print-PDF, server PDF (puppeteer, mermaid + KaTeX), vault zip (`ExportMenu.tsx:156-160`) |
| **Typewriter mode** | Typora **F9** [fetched]. Nobody else in the survey binds it | **NO** | 0.5 d | **NO** |
| **Focus mode** | Typora F8 [fetched]; iA ⌘D [fetched] | **NO** | 0 (have) | **Yes** — `editor-settings.ts` `focusMode` |
| **Vim mode** | Zed, VS Code, Logseq (Emacs-ish `ctrl+p/n/a/e/f/b/k/u/w`) [fetched] | **NO** | 0 (have) | **Yes** — `@replit/codemirror-vim`, first in the extension array as the docs require |

---

**The measured defect.** `setTableCell` (`table-edit.ts:139-190`) splits the whole document on `\n`, re-serialises **every row of the touched table** through `serializePipeRow` (`| ${cells.join(" | ")} |`), and rejoins. [measured], Node 24.6.0, real module:

```
in : "| Name     | Role      |\n| -------- | --------- |\n| Ada      | Analyst   |\n| Grace    | Admiral   |\n"   100 bytes
out: "| Name | Role |\n| -------- | --------- |\n| Ada | Analyst |\n| Grace | Rear Admiral |\n"                     84 bytes
lines changed: 3 of 5 (only ONE cell was edited)
CRLF input → CR count in/out: 4 → 1
```

Three reviewer-visible consequences: a one-cell edit produces a **four-line git diff**; hand-aligned tables **collapse to one-space padding** while the delimiter row keeps its original dashes, leaving the file *less* aligned than it started; and a CRLF file comes back **mixed-ending**. `escapeCellValue` also converts a literal `|` to `\|` unconditionally, correct for GFM and wrong for an already-escaped cell.

---

**The disqualifying gaps, ranked by cost to close.**

| # | Gap | Cost | Why disqualifying |
|---|---|---|---|
| 1 | **Heading hotkeys ⌘1–6, ⌘K link, list/quote/task toggles, checkbox toggle, move-line-up/down** | **0.5 d** | Every product in the survey has these. `toggleTaskAtLine` is already written and simply unbound. Cheapest credibility in the list |
| 2 | **Outline hotkey + fuzzy heading jump** (`Mod-Shift-O`) | **0.5 d** | Zed, VS Code, Bear, Typora all bind it. We have the extractor already |
| 3 | **Command palette that indexes everything and shows its hotkeys** | **1–2 d** | 14 commands is a menu, not a palette. It is the discovery surface for a product with no plugins |
| 4 | **Quick-switcher deltas**: recents on empty, Enter-to-create, ⌘Enter new tab | **0.5 d** | All three are Obsidian defaults [fetched]; their absence reads as unfinished |
| 5 | **HTML paste → markdown** | **2–3 d** | The first thing anyone does is paste from a browser or a spreadsheet. Failing it is a 60-second rejection |
| 6 | **Table editing: Tab/Shift-Tab/Enter nav, add/remove row+column, alignment** | **5–8 d** | Zettlr sets the bar and documents it; Obsidian and Bear both clear it. "Markdown tables are miserable to hand-edit" is the most repeated theme in 303 HN hits — *"creating tables actually wastes time because of the `___` and `\|` scaffolding"* (2023-06-23) [fetched] |
| 7 | **Splice-backed table writes (fix #6's engine at the same time)** | **+2 d on top of #6** | Shipping #6 on the current regenerating writer would make our headline claim false in the most demoable surface in the app |
| 8 | **Customisable keymap** | **3–4 d** | Half the field punts to the OS, so it is survivable at launch — but it is the difference between "a nice writing app" and "a tool I can live in" for the audience most likely to care about byte preservation |

Items 1–4 total **~3 days** and close four of the eight. That is the real MVP floor and it should land before any novel feature.

---

**Table stakes vs differentiator vs delight — and the five features a regenerating editor cannot safely ship.**

Every product above with rich editing rebuilds the document from a model. That is why *"if I export a notion page as markdown, then re-import that same markdown document, [it is] a different subset of markdown"* (HN 2024-07-15) and *"Most of the time notion can't even read what it exported"* (HN 2024-09-29) [both fetched]. The corollary is the product:

| Feature | Who uses it, how often | Why it is unsafe for a regenerator | Our cost |
|---|---|---|---|
| **Table cell edit = one-line diff** | Anyone with a table in git. Every table edit | Zettlr's own align command exists *because* its editor re-emits the block; Bear and Notion re-emit into a store | 2 d on top of the table work |
| **Vault-wide find & replace with a refusal list** | Renaming a term across 500 notes. Monthly, and terrifying today. **Nobody has it** | A regenerator must re-render each file to write it; ours splices only matched ranges and *refuses* files where the range is ambiguous, returning a named list | 4–6 d |
| **Rename a heading, update every inbound link, byte-exact** | Any vault refactor. VS Code does this for workspaces (F2 Rename Symbol) [fetched]; nobody does it for wikilinks safely | Link rewriting through a parse tree touches bytes it never needed to | 3 d; `path-rename.ts` + `LinkDoctorModal.tsx` already exist |
| **Paste-with-certificate** — show what the pasted HTML will *not* survive before inserting | Every paste from a browser. Daily | Requires knowing the target engine's degradation, which is exactly the cert engine (`mdmax/application/certify.ts`, 19 detectors) and nobody else has one | 2 d on top of #5 above |
| **Undo that survives an external edit** (git pull, sync, AI apply) | Anyone syncing. Weekly | Halfway done already: the store subscriber diffs common prefix/suffix and marks the transaction `addToHistory.of(false)` | 1 d to finish |

**Cuts, recorded.** *Typewriter mode* — only Typora binds it (F9) [fetched]; the 970 HN hits on the phrase are almost entirely about literal typewriters. DELIGHT, 0.5 d, defer. *Emoji autocomplete* — Typora and Bear have it; no evidence of demand from technical writers. Cut. *Grid tables* — Zettlr explicitly excludes them from its own table editor [fetched]. Cut. *Drag-and-drop of arbitrary files into the editor* — VS Code has it, but our image path covers the common case. Defer. *Inline math/mermaid rendering in the edit surface* — split and reading modes cover it. Defer.

*Process note: the session's injection-scan hook flagged repeated injection-shaped patterns in fetched web content. All fetched text was treated strictly as data; no instruction found in any page was acted on, and nothing was written or mutated.*
