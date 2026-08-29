### 0. Measured baseline — what is actually broken in this repo today

| Fact | Value | Evidence |
|---|---|---|
| `countWords` implementation | `src/modules/editor/presentation/EditorPane.tsx:31` → `trimmed.split(/\s+/).length` | [measured, read] |
| Pure-CJK paragraph (41 cp, no spaces) | `countWords` = **1**, `Intl.Segmenter('zh',word).isWordLike` = **23** → **23×** under | [measured] |
| Japanese sample | 1 vs 15 → **15×** under | [measured] |
| Thai sample | 1 vs 8 → **8×** under | [measured] |
| Arabic sample | 4 vs 4 → **no error** | [measured] |
| MiniSearch default tokenizer | `SPACE_OR_PUNCTUATION = /[\n\r\p{Z}\p{P}]+/u`, `minisearch/dist/es/index.js:2002` | [measured] |
| `buildSearchIndex` tokenizer override | **none** — `search-index.ts:124` passes `fields/storeFields/idField` only | [measured] |
| Query `学习` against doc containing `深度学习模型…` | default **0 hits**; bigram **1**; Segmenter **1** | [measured] |
| `<html lang="en">`, no `dir` | `src/app/layout.tsx:67` | [measured] |
| Installed `@codemirror/view` | 6.43.0 (npm latest 6.43.9, published 2026-08-16) | [measured] / [fetched, c5-build-refs.md] |
| Offset divergence | 67/1,080 corpus files have bytes == UTF-16 units → **93.80%** diverge (`67/1080 = 0.06204`) | [derived from measured header, `offsets.ts`] |

**Source disagreement, unresolved:** the PRD/master-plan records `countWords` as **"1.7–2× under" for Chinese**; my direct measurement on unspaced CJK gives **8–23×**. Both can be true — `\s` includes `\n`, so a real corpus doc with N lines scores ≈N words, which compresses the ratio at corpus scale. Do not merge these numbers; re-derive the corpus figure with a script that reports which text it measured (LR#59).

### 1. i18n work itemised by what breaks → standard to implement against

| # | What breaks | Symptom the user sees | Standard | Effort |
|---|---|---|---|---|
| I-1 | `countWords` whitespace split | Word count reads 1 for a Chinese/Japanese/Thai document | **UAX #29 §4 Word Boundaries** via `Intl.Segmenter(locale,{granularity:'word'})`, count `isWordLike` | S |
| I-2 | MiniSearch tokenizer | CJK body search returns nothing unless the query is the entire unspaced run | UAX #29 word (dictionary-backed) **or** character bigrams — see §4 | M |
| I-3 | Reading-time `words/200` | Meaningless for CJK; the convention is ~300–500 **characters**/min, not words | none — locale-branch the divisor, or drop reading time for non-space-delimited scripts | S |
| I-4 | `GraphemeIndex` producer | Brand exists in `offsets.ts` but nothing enumerates graphemes; column/char reporting is UTF-16-flavoured | **UAX #29 §3 Extended Grapheme Cluster** via `Intl.Segmenter(granularity:'grapheme')` | S |
| I-5 | Frontmatter key addressability | `SAFE_KEY` rejects CJK/spaced/emoji keys; CJK keys in **905** oldwinter files | not a Unicode standard — a YAML quoting decision (NF-4) | M |
| I-6 | Sort order in file tree | `Array.prototype.sort()` is UTF-16 code-unit order: `note1, note10, note2`; correct is `note1, note2, note10` | **UTS #10 / CLDR collation** via `Intl.Collator(locale,{numeric:true, sensitivity:'base'})` | S |
| I-7 | Date/number rendering in UI chrome | Hardcoded formats; `en-IN` groups as **12,34,567.89** (lakh), `ar-EG` renders **١٬٢٣٤٬٥٦٧٫٨٩** | **ECMA-402 §11 / §16** `Intl.DateTimeFormat`, `Intl.NumberFormat` | S |
| I-8 | Line breaking in preview/print/PDF | Browser handles it; **your** Puppeteer PDF path inherits whatever the headless engine does | **UAX #14**; do not implement — set `lang` and let the engine tailor | XS |
| I-9 | No `dir` on `<html>`/editor | RTL content renders with LTR base direction; punctuation lands on the wrong side | **UAX #9 rules P2/P3** (first strong char) + HTML `dir` | S |
| I-10 | Search snippet truncation | Slicing a snippet at a UTF-16 index can split a surrogate pair or a ZWJ emoji sequence | UAX #29 grapheme; reuse `findClusterBreak` already in `@codemirror/state` | S |

**Do not implement UAX #9 or UAX #14 yourself.** UAX #9 revision tracks Unicode 17.0.0 with six classes of explicit formatting characters and six higher-level protocols (HL1–HL6) [fetched, unicode.org/reports/tr9]; UAX #14 §7 is literally *"Deleted. (Formerly was: Pair Table-Based Implementation)"* [fetched, tr14] — the pair-table shortcut people copy was withdrawn. CodeMirror 6 already ships a UBA implementation: `computeOrder` at `@codemirror/view/dist/index.js:1245`, `BidiSpan` at :874, `Direction.LTR/RTL` at :834 [measured].

**Anti-recommendation for §1:** do not build a "unicode module" that owns all ten items. I-1/I-3/I-4/I-10 are three-line call sites against one shared segmenter factory. A module invites a second offset vocabulary, which is precisely the failure `offsets.ts` was written to prevent.

### 2. IME hazard list — React 19 + CM6 + 400ms debounced save

The hot path: `EditorView.updateListener` fires on **every** `docChanged` → `useEditorStore.setContent(path, content)` **synchronously**, then resets a 400ms timer to `saveDraft` (`CodeMirrorEditor.tsx:245–262`) [measured]. IME composition emits `docChanged` per keystroke of the *provisional* string.

| # | Hazard | Mechanism | Test |
|---|---|---|---|
| H-1 | Preview thrash / store churn mid-composition | `setContent` fires for every pinyin keystroke, so the split preview re-renders the half-composed run and any subscriber sees non-text intermediate states | Playwright/CDP `Input.imeSetComposition` with `nihao` → `你好`; assert `setContent` call count and that no committed save contains a provisional run | 
| H-2 | Composition **interrupted by re-render** | Any React re-render that touches `contentDOM` while `view.inputState.composing >= 0` destroys the browser's composition anchor. CM6 defends internally (`compositionStarted` at ref `2049`; EditContext `drifted` tracking at :7692) but cannot defend against a parent remounting the editor | Force a parent state change (settings toggle, theme, `livePreviewForced`) during an open composition; assert doc equals `你好`, not `nihao你好` or `你` |
| H-3 | Debounced save capturing a **provisional** buffer | The 400ms timer is not composition-aware. A 400ms pause is entirely normal mid-composition (candidate window open) → IndexedDB draft + `setDirty(true)` for text the user never committed | Compose, hold 600ms with the candidate window open, read the draft from IndexedDB; assert it does not contain the pre-conversion Latin run |
| H-4 | Autocomplete firing mid-composition | `@codemirror/autocomplete` **already guards**: `if ((android ? view.composing : view.compositionStarted) \|\| view.state.readOnly) return` (`autocomplete/dist/index.js:1841`), with a 4-state machine None/Started/Changed/ChangedAndMoved (:1142–1289) [measured]. Your **`aiSuggestion` / `ghostText`** extensions are custom and carry no such guard | Compose `nihao`; assert zero completion sources invoked and zero ghost-text requests issued before `compositionend` |
| H-5 | Undo granularity | CM6 tags composition transactions `userEvent: "input.type.compose"` [fetched, CM ref]. If any custom extension dispatches its own transaction during composition without that annotation, one Ctrl-Z deletes a whole paragraph or one code unit instead of one composed word | Compose three words, press undo three times; assert three distinct doc states, each a word boundary |
| H-6 | Vim mode × IME | `@replit/codemirror-vim` is loaded **first** in the extension array (`CodeMirrorEditor.tsx`, per its docs) and installs its own key handling; CM6 issue **#829 "keymap not called during/after composition (android)"** is the known shape | Compose in insert mode, press Escape mid-composition; assert the composed text commits and mode changes exactly once |
| H-7 | Decoration boundaries garbling composition | Three confirmed CM6 issues in **2026-03 alone**: **#1688** "Text visually disappears after IME composition inside brackets on Chrome", **#1650** "IME composition at the boundary of syntax highlight nodes garbles the content", **#1654** "IME composition problem in decoration" — all closed, filed 2025-12→2026-03 [measured, api.github.com]. Your live-preview decorations sit exactly there | Compose inside `**bold**`, inside a fenced block, and at a `[[wikilink]]` boundary; assert byte-identical expected doc for each |
| H-8 | Safari dead-key / missing `compositionend` | CM6 carries an explicit workaround (`view/dist/index.js:5294–5296`: on Safari `insertText` while composing, fire a synthetic `compositionend` after 20ms) and another for missed events referencing `discuss.codemirror.net/t/a/9514` at :7597 [measured] | Run the H-1..H-7 matrix on WebKit as well as Chromium; a Chromium-only IME suite proves nothing |
| H-9 | Tauri webview divergence | macOS WKWebView / Linux WebKitGTK / Windows WebView2 are three different IME stacks. **`EditContext` is Chrome 121+, Firefox `false`, Safari `false`** [fetched, MDN BCD] — so CM6 runs its DOM-mutation composition path on two of your three Tauri targets and its EditContext path on one | Same matrix inside `tauri dev` on each target; do not infer from the browser build |
| H-10 | No upstream escape hatch | The public `codemirror` GitHub org was archived 2026-04-15/16; npm remains current but issues/PRs cannot be filed [fetched, c5-build-refs.md]. 26 IME issues exist, **all closed**, newest 2026-03-26 [measured] | Budget vendoring; pin `@codemirror/view` and diff on every bump |

**Two concrete fixes, both small:**
- Gate the debounce on composition: `if (update.view.composing) { /* re-arm the timer, do not save */ }`. `EditorView.composing` is public [fetched, CM ref `2047`].
- Gate `aiSuggestion`/`ghostText` on `view.compositionStarted` — copy autocomplete's own predicate verbatim, including the Android branch. On Android, `compositionStarted` is true merely from placing the cursor on a word [fetched, CM ref `2049`], which is why the library branches.

**Anti-recommendation for §2:** do not suppress `setContent` during composition. The instant-preview path is the product; blanking the preview while a CJK user types is a worse defect than a few extra renders. Suppress the **persistence** side (H-3), not the projection side (H-1). And do not write IME tests with `keyboard.type()` — it dispatches key events without a composition session and will pass against a fully broken editor (LR#68: a test that cannot fail against the unfixed code proves nothing).

### 3. RTL support scope — **PARTIAL, scoped to content. UI mirroring explicitly OUT for v1.**

**In scope (cheap, already 90% built by dependencies):**
- `dir="auto"` on the editor content element and on preview block containers → UAX #9 P2/P3 first-strong-character resolution, which is exactly what `dir=auto` implements [fetched, W3C qa-html-dir].
- `EditorView.perLineTextDirection` facet set true → CM6 reads direction per rendered line, correct for a mixed Hebrew/English vault [fetched, CM ref `2481`].
- `bidiIsolates()` from `@codemirror/language` for markdown constructs that must not reorder — link destinations, fence info strings, inline code [fetched, CM ref `4875`]. `bidiIsolatedRanges` supports only `unicode-bidi: isolate`; other values are unsupported [fetched, CM ref `2576`].
- `Intl.Locale.prototype.getTextInfo()` (ECMA-402 §15.3.21) to resolve a locale's base direction: measured `ar/he/fa/ur → {"direction":"rtl"}`, `en/hi/ja → ltr` [measured, node 24.6.0].

**Out of scope for v1:**
- Mirroring the chrome (sidebar side, gutter side, icon flips, tree indentation). Requires a CSS logical-properties pass across every surface — `start`/`end` instead of `left`/`right` [fetched, W3C qa-html-dir] — plus icon direction review. Weeks, not days.
- Bidi-aware markdown *authoring* affordances: a `>` blockquote marker, `- ` list marker, and `# ` heading marker are LTR-anchored syntax inside an RTL paragraph. There is no settled convention; CommonMark says nothing about it.
- Bidi control characters in stored content. `LRI U+2066 / RLI / FSI / PDI U+2069` are the Unicode-recommended isolates over the legacy `RLE U+202B / LRE U+202A / PDF U+202C` [fetched, W3C qa-bidi-unicode-controls], but they are **invisible bytes**. Injecting them collides head-on with the settled byte-preserving-splice posture.

**Reasoning:** every open CM6 bidi issue is **closed**, 9 total, newest **2023-11-30** [measured, api.github.com] — the engine layer is mature and quiet. The cost is entirely in your own chrome, and the RTL market is not the wedge. Also note the *actual* measured RTL fact: Arabic word counting is already correct (4 vs 4) because Arabic is space-delimited. RTL is a **layout** problem for you, not a **text-processing** one. CJK is the text-processing problem.

**Anti-recommendation:** do not ship `dir="auto"` on the *editor* while leaving the *preview* LTR, or vice versa. Split-mode with the two panes disagreeing on base direction is worse than uniformly-LTR — the user cannot tell which one is lying about their document. Ship both or neither.

### 4. `Intl.Segmenter` viability

| Engine | First version | Release date | Evidence |
|---|---|---|---|
| Chrome | 87 | 2020-11-17 | [fetched, MDN BCD] |
| Safari | 14.1 | 2021-04-26 | [fetched, MDN BCD] |
| **Firefox** | **125** | **2024-04-16** | [fetched, MDN BCD] |
| Node | 16.0.0 | — | [fetched] |
| Deno / Bun | 1.8 / 1.0.0 | — | [fetched] |
| Edge/Opera/Samsung/WebView | `mirror` (follow Chromium) | — | [fetched] |

- **Baseline newly available: 2024-04-16** (Firefox is the gate). **Widely available = +30 months = 2026-10-16 — 48 days from today** [derived; today 2026-08-29].
- `web-features` carries an `intl-segmenter` feature with 8 compat features [fetched, web-platform-dx/web-features].
- Spec: ECMA-402 §19, draft dated **August 7, 2026** (ES2027 edition); `granularity` enum is «`grapheme`, `word`, `sentence`», default `grapheme` [fetched, tc39.es/ecma402].
- Locale coverage measured: `supportedLocalesOf(['zh','ja','th','en','ar','hi'])` returns **all six** [measured, node 24.6.0].
- **CM6 already depends on it**: `@codemirror/commands/dist/index.js:660` constructs a word-granularity segmenter for subword motion [measured]. You are already shipping the dependency.
- **CM6 does not use it for word selection.** `EditorState.charCategorizer` is `/\S/` + a `hasWordChar` regex + a `wordChars` language-data string (`@codemirror/state/dist/index.js:2498`) [measured] — so double-click-to-select-word on CJK is category-based, not UAX #29. Grapheme motion *is* correct: `@marijn/find-cluster-break@1.0.2` backs `findClusterBreak` [measured].
- **Verdict: use it, unpolyfilled, everywhere except the search index.** Measured `Segmenter` tokens for `深度学习模型的训练过程` = `["深度","学习","模型","的","训练","过程"]` — linguistically right, but it makes recall *depend on the segmenter agreeing with the query*, and the index is built server-side (Node, full ICU) while queries may run client-side (browser ICU, possibly trimmed). Use **character bigrams** for the index instead: measured `["深度","度学","学习","习模","模型"]`, and both `学习` and `训练` retrieved 1 hit [measured]. Bigrams over-generate tokens but are deterministic across engines and index-size-bounded.

**Anti-recommendation:** do not ship a `Intl.Segmenter` polyfill. `@formatjs/intl-segmenter` carries the ICU segmentation data, which is a large payload for a feature whose only remaining gap is a Firefox older than 2024-04-16. Feature-detect and fall back to the current `\s+` split with a UI note, rather than paying the bytes for every user. Also: do **not** use Segmenter for the search index — see above; a segmenter mismatch between index-time and query-time yields silent zero-recall, the exact failure you have now.

### 5. UI localisation — **do not do it for v1.**

- The v1 UI is a markdown editor: a file tree, a status bar, a command palette, a settings sheet. The **content** is the user's, and it is already whatever language they wrote in.
- Reference cost: `i18next` 21,709,896 weekly downloads, `react-i18next` 15,672,474, `next-intl` 5,421,207, `@formatjs/intl` 3,611,428, `@lingui/core` 1,610,658 (week 2026-08-21→2026-08-27) [fetched, api.npmjs.org]. Adoption is not the question; **translation supply** is. Solo founder, no localisation budget, no reviewers for `ar`/`ja`/`zh` copy.
- **What to do instead, now, at near-zero cost:** externalise nothing, but stop hardcoding *formatted values*. Route every date through `Intl.DateTimeFormat` and every number through `Intl.NumberFormat` with the user's resolved locale. This gets you the measured wins for free: `en-IN` → **12,34,567.89** (lakh grouping), `INR` → **₹499.00**, `ar` long date → **29 أغسطس 2026** [all measured]. India-first pricing display is the immediate commercial payoff and it costs one utility module.
- **What to do at v1.1 if demand appears:** `next-intl` (native App Router integration, matches the Next 16 stack), with **one** locale file, English, so the extraction is done and adding `zh` later is a translation job not a refactor.

**Anti-recommendation:** do not add a locale switcher, and do not add locale-prefixed routes (`/zh/...`) with a single language shipped. A half-populated switcher is a promise you cannot keep, and locale routing changes every URL you have, which breaks share links — a settled product surface. Also: do not machine-translate the UI and ship it unreviewed. An editor's error copy ("REFUSE rather than guess") is the product's voice; a bad translation of a refusal message reads as a crash.

### 6. Anti-recommendations, consolidated

- **Do not implement UAX #9 or UAX #14.** CM6 ships a UBA (`computeOrder`, `BidiSpan`) [measured]; browsers ship line breaking. Any hand-rolled version diverges from the engine that actually paints the glyphs, and you will be debugging a disagreement between two implementations rather than a bug.
- **Do not normalise stored content.** No NFC/NFD normalisation, no bidi-control injection, no BOM insertion. Every one of these mutates bytes, and byte-preserving splice is the settled contract. Normalise only in *derived* projections (search index keys, filename comparison), never in the file.
- **Do not compare filenames with `===` after normalisation asymmetry.** macOS HFS+/APFS decompose; Linux does not. Use `Intl.Collator(locale,{sensitivity:'base'})` for *display order* only, and raw bytes for *identity* — collation is not equality. Measured: German and Swedish sort `['z','ä','a']` differently (`aäz` vs `azä`) [measured], so a collator is a locale-dependent function and must never key a store.
- **Do not accept a green IME test suite.** LR#68 applies exactly: composition bugs need a real composition session. Assert against a *reproduced* failure first — replay CM6 #1650 (composition at a syntax-highlight-node boundary) against your decoration set and confirm it garbles before you claim it does not.
- **Do not use `Intl.Segmenter` for the search index.** Deterministic bigrams; see §4.
- **Do not treat "no open bidi issues" as "bidi works here".** The 9 CM6 RTL issues are closed and the org is archived — closure means *no one can file*, not *nothing is wrong* [measured + fetched].
- **Do not report the corpus CJK undercount as a single number** until a script re-derives it and names the file set. `1.7–2×` (PRD) and `8–23×` (this session, unspaced samples) measure different populations and must not be averaged (LR#59, LR#62).

### 7. Ordering (highest measured breakage per unit of work)

1. **H-3 + H-4** — composition-gate the 400ms debounce and the ghost-text/AI trigger. Two predicates, both copied from a library that already got it right.
2. **I-2** — bigram tokenizer in `buildSearchIndex`. Measured: takes CJK body recall from 0 hits to 1 hit on the test query.
3. **I-1 + I-3 + I-4** — one shared segmenter factory; word count, reading time, grapheme index.
4. **I-7** — `Intl.NumberFormat`/`DateTimeFormat` for INR and dates.
5. **I-6** — `Intl.Collator({numeric:true})` in the tree sort.
6. **§3 partial RTL** — `dir="auto"` on both panes + `perLineTextDirection` + `bidiIsolates()`.
7. **§5** — nothing. Revisit at v1.1.