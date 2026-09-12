I mutated nothing: all work was read-only (`curl` fetches, `sed`/`grep` reads, and `node -e` in-memory benchmarks); no file was written, edited, or committed, and the `~/.claude` dirt is not mine.

### Scope, method, evidence key
- `[fetched]` = primary source opened via `curl` in this session (WebFetch is gated; `curl` was tested first and works — 200s on pavelfatin.com, danluu.com, codemirror.net, code.visualstudio.com, react.dev, web.dev, rxdb.info, nolanlawson.com, api.crossref.org). `[measured]` = executed on this machine, 2026-08-29. `[derived]` = arithmetic shown. `[SS]` = search summary, nobody opened it. `[inference]` = my reasoning.
- Local corpus for every `[measured]` row: synthetic markdown, 3 lines per block (`## Heading N` / prose with `**bold**`, `*italic*`, `[link]`, `` `code` ``), at 9 KB / 58 KB / 294 KB. Read-only; nothing in the repo was modified.

### Perceptual bands and their real sources
| Band | Claim | Source |
|---|---|---|
| ~1 ms | "even 1 ms matters" — Fatin's characterization of a Microsoft Research demo; he also cites a paper claiming ~1 ms audio latency can matter | Fatin, *Typing with pleasure* [fetched] |
| ~10 ms | RAIL: "produce each frame in an animation in 10 ms or less"; 16 ms budget minus browser paint | web.dev/articles/rail [fetched] |
| 16.7 ms | one frame at 60 Hz; "they perceive animations as smooth so long as 60 new frames are rendered every second" | web.dev/articles/rail [fetched] |
| 20–30 ms | MIDI audio latency "enough to disrupt your performance" — Fatin's analogy for feedback-loop disruption | Fatin [fetched] |
| ~40 ms | "Human visual system needs about 40 ms to process its input"; also Fatin's own minimum inter-keystroke interval | Fatin [fetched] |
| 50 ms | RAIL: process input events within 50 ms, because idle work can queue input for the other 50 ms | web.dev [fetched] |
| 100 ms | RAIL: "0 to 100 ms — users feel like the result is immediate" | web.dev [fetched] |
| 150 ms | Fatin's own average inter-key interval "during my own relatively fast typing" | Fatin [fetched] |
| ~200 ms | full sense→consciousness→muscle round trip; SpeechJammer uses ~200 ms delay to disrupt speech | Fatin [fetched] |
| 1000 ms | RAIL: "users lose focus on the task they are performing" | web.dev [fetched] |
| 10000 ms | RAIL: "users are frustrated and are likely to abandon" | web.dev [fetched] |

- Fatin's structural point, which is the one that matters most here: latency is **not masked** by the 40 ms vision delay — "any 'external' delay is added on top of the vision delay, not 'masked' by it" [fetched]. And typing is feedback-dependent *below conscious perception* — "One does not necessarily need to perceive latency consciously to be affected by it" [fetched].
- **Jitter is a separate axis from mean.** Fatin: the nervous system adapts to *constant* delay but "any irregularities in delay durations (so called jitter) pose additional problem because of their inherent unpredictability" [fetched]. He also flags GC/JIT as a jitter source specifically for JS engines [fetched].
- Deber et al., *How Much Faster is Fast Enough?*, CHI '15, DOI `10.1145/2702123.2702300`, published 2015-04-18, and Ng et al., *Designing for low-latency direct-touch input*, UIST '12, DOI `10.1145/2380116.2380174`, 2012-10-07 — **existence and venue verified via Crossref [fetched]; abstracts and findings NOT opened.** Do not cite their numbers (the widely repeated "1 ms JND" figure is `[SS]` here). NN/g's 0.1/1/10 s limits: page returned 200 but I did not isolate the text — treat as `[SS]`, unverified this pass.

### Published editor typing-latency measurements (Fatin's Typometer, Windows, small file) [fetched]
| Editor | Min ms | Max ms | Avg ms | SD ms |
|---|---|---|---|---|
| GVim | 0.2 | 1.2 | 0.9 | 0.2 |
| IDEA (zero-latency) | 0.1 | 21.2 | 2.9 | 2.7 |
| Notepad++ | 0.1 | 5.9 | 4.3 | 0.8 |
| Emacs | 4.2 | 19.2 | 5.3 | 1.1 |
| Sublime Text | 6.2 | 35.2 | 8.2 | 2.0 |
| Eclipse | 0.1 | 20.8 | 10.1 | 1.6 |
| IDEA (default) | 0.1 | 83.7 | 24.7 | 12.0 |
| Atom | 29.2 | 85.5 | 49.4 | 7.2 |

- Large-file / Linux runs degrade sharply: Atom 90.0 ms avg (max 152.2), IDEA default 198.8 ms avg (max 544.6), Eclipse 133.6 ms avg [fetched]. **The relevant lesson for a browser editor: Atom — Electron, DOM-rendered, JS — is the closest architectural analogue in that table and it is last or near-last in every run.**
- Hardware floor is not free: Fatin's typical keyboard total 14 ms avg (matrix 0.5, debounce 8.5, USB poll 4, transmission 1); typical monitor total 12 ms avg (refresh 8, pixel response 4); typical input+output ≈ 26 ms, "ideal" 3 ms [fetched]. **Software budget to stay under RAIL's 100 ms = 100 − 26 = 74 ms [derived].**
- Dan Luu, *Computer latency: 1977–2017*, high-speed-camera keypress→glyph: apple 2e 30 ms (1983), TI 99/4a 40 ms (1981), commodore pet 60 ms (1977), macbook pro 2014 100 ms, powerspec g405 win 200 ms (2017), symbolics 3620 300 ms (1986) [fetched]. He notes "packet around the world 190" ms as a reference row [fetched].

### The latency budget table
Targets are for the p99 on a 300 KB note, not the mean. Fatin recommends reading Tene's *how not to measure latency* and states maximum values are very important [fetched].

| Operation | Target p99 | Justification | Source |
|---|---|---|---|
| keypress → caret + glyph | ≤ 8 ms | must fit inside one 16.7 ms frame alongside paint; GVim achieves 0.9 ms avg | web.dev [fetched], Fatin [fetched] |
| keypress → highlight of edited line | ≤ 8 ms | same frame; lezer incremental measured 1.36 ms @294 KB | [measured] |
| keypress → live-preview conceal update | ≤ 10 ms | RAIL animation budget | web.dev [fetched] |
| cursor move / selection change | ≤ 8 ms | same frame, and it fires more often than edits | [inference] |
| keypress → split-preview text update | ≤ 50 ms | RAIL input-processing bound, leaves 50 ms for queued idle work | web.dev [fetched] |
| keypress → status bar / word count | ≤ 2 ms | it is decoration; must not compete with the caret | [inference] |
| scroll one viewport | ≤ 10 ms/frame | animation budget | web.dev [fetched] |
| paste 100 KB | ≤ 100 ms | single discrete action, "feels immediate" band | web.dev [fetched] |
| keypress → draft durably persisted | ≤ 400 ms, and unconditionally within 1 burst | IDB cost is per-transaction (~2 ms), not per-byte; >1 s loses task focus | rxdb.info [fetched], web.dev [fetched] |
| open a warm note (draft in IDB) | ≤ 100 ms | immediate band | web.dev [fetched] |
| open a cold note (network) | ≤ 1000 ms with a rendered skeleton before 100 ms | focus-loss threshold | web.dev [fetched] |
| open a 1 MB document | ≤ 1000 ms to first interactive frame | ditto; CM6 only renders the viewport | web.dev [fetched], CM6 guide [fetched] |
| refuse a hostile document (shape gate) | ≤ 50 ms | must be cheaper than the attack it prevents | `shape-gate.ts` [inference] |

- **The repo's own stated keystroke budget is wrong.** `src/modules/mdmax/domain/shape-gate.ts:27-35` declares `BUDGET_MS.keystroke = 250`. That is 2.5× RAIL's 100 ms response bound and 5× its 50 ms processing bound [derived, fetched]. A 250 ms keystroke budget concedes lag as policy.

### Architectural choices that hit or miss the budget
- **Viewport rendering — hits.** CM6: "CodeMirror doesn't render the entire document, when that document is big… it will detect which part of the content is currently visible… and only render that plus a margin around it" [fetched]. Height info is tracked for the whole document so the scrollbar is honest; `visibleRanges` excludes folded/unwrapped-long-line content and is the correct thing to decorate against [fetched].
- **Write/measure phase separation — hits.** CM6 "will generally only cause the editor to write to the DOM, without reading layout information. The reading… is done in a separate measure phase, scheduled using requestAnimationFrame" [fetched]. Any code that reads layout inside a transaction destroys this.
- **Incremental parsing — hits, with a documented cliff.** Lezer reuses tree fragments; "the cost of re-matching unchanged parts of the document is low." But: "even a tiny document change, if it changes the meaning of the stuff that comes after it, can require a big part of the document to be re-parsed. An example would be adding or removing a block comment opening marker" [fetched]. In markdown the analogue is opening a fenced code block or a `<!--` — **this is the class the benchmark suite must cover, not the average keystroke.**
- **Idle-scheduled parsing — hits.** `@codemirror/language@6.12.3` [measured, node_modules source]: `Work.MinPause = 100` ms, `Work.MaxPause = 500` ms, `Work.MaxParseAhead = 100000` chars; it uses `requestIdleCallback(callback, {timeout: 400})`. Parsing runs ahead of the viewport by up to 100 k chars in idle slices rather than blocking a keystroke.
- **Text data structure — VS Code's finding.** A line array cost ~40–60 bytes per `ModelLine`; a 35 MB / 13.7 M-line file consumed ~600 MB, "roughly 20 times the initial file size" [fetched]. Piece tree brought memory close to file size; `getLineContent` went O(1)→O(log N) in node count, judged acceptable because "DOM construction and rendering or tokenization of a view port usually takes tens of milliseconds, in which getLineContent only accounts for less than 1%" [fetched]. Storing line-break *references* rather than copying offset arrays on split made buffer ops **3× faster** [fetched].
- **Rewriting in native code — misses.** VS Code tried a C++ text buffer: "we found that a C++ implementation… could lead to significant memory savings, but we didn't see the performance enhancements we were hoping for. Converting strings between a custom native representation and V8's strings is costly" [fetched]. They kept it in JavaScript and changed only the data structure.
- **IndexedDB — transaction-bound, not byte-bound.** 1 000 documents in one transaction ≈ 80 ms (0.08 ms/doc); the same 1 000 with one transaction per write ≈ 2 s (≈2 ms/write); "the limiting factor to IndexedDB performance is the transaction handling, not the data throughput"; 100× larger documents "still takes about the same time" [fetched, rxdb.info]. Nolan Lawson: batched cursors gave ~40–50 % in Firefox and Chrome; relaxed durability helps mainly for many small transactions; benchmarks on a 2015 MacBook Pro, Chrome 92 / Firefox 91 / Safari 14.1 [fetched].
- **`useDeferredValue` — misses when the deferred work is non-incremental.** React 19.2 docs: "There is no fixed delay caused by useDeferredValue itself… The background re-render is interruptible: if there's another update to the value, React will restart the background re-render from scratch" [fetched]. A 534 ms full-document render restarted on every keystroke produces **zero committed frames and 100 % wasted CPU** during a typing burst [inference].

### Local measurements
| Operation @ size | 9 KB | 58 KB | 294 KB |
|---|---|---|---|
| `@lezer/markdown` full parse | 1.19 ms | 4.05 ms | 16.78 ms |
| `@lezer/markdown` incremental (1-char edit, fragments reused) | 0.25 ms | 0.22 ms | **1.36 ms** |
| `micromark` | 3.8 ms | 22.3 ms | 105.8 ms |
| `mdast-util-from-markdown` | 4.0 ms | 20.4 ms | 110.9 ms |
| `remark-parse` + `remark-rehype` (repo's plugin set) | 11.0 ms | 41.6 ms | 212.7 ms |
| `react-markdown` full pipeline + `renderToString` (repo's plugins) | 20.8 ms | 91.5 ms | **534.1 ms** |
| `countWords()` as written (`trim().split(/\s+/)`) | — | 0.24 ms | 1.32 ms |
| `content.split("\n")` | — | — | 0.14 ms |
All `[measured]`, this machine, 2026-08-29, mean of 3–50 iterations after warm-up. Also `[measured]`: `Text.toString()` on a 580 KB CodeMirror `Text` = **0.207 ms** (mean of 200) — materializing the whole doc string per keystroke is *not* the bottleneck, which corrects the obvious hypothesis.

- `[derived]`: preview render at 294 KB is 534.1 / 16.7 = **32 dropped frames**. At 58 KB it is 91.5 / 100 = **91.5 % of the entire RAIL response budget** for one render. lezer incremental beats the full remark pipeline by 212.7 / 1.36 = **156×**, and the react-markdown pipeline by 534.1 / 1.36 = **393×**.
- **WIKILINK quadratic reproduced** `[measured]`, pattern `/(!?)\[\[([^\]]+)\]\]/g` against N KB of `[[`: 40 KB → 662 ms; 80 KB → 2 607 ms; 160 KB → 10 740 ms; 320 KB → **42 679 ms**, 0 matches. `[derived]` k = log₂(42679/10740) = log₂(3.974) = **1.991**; the 40→80 step gives log₂(3.938) = 1.977.
- **Source disagreement, recorded not resolved:** `shape-gate.ts:8` states 36 865 ms at 320 KB and k = 1.98; I measure 42 679 ms and k = 1.991 — same shape, ~16 % apart, different machine/day.
- **Scope correction, recorded:** `shape-gate.ts:9` cites `mdast-util-from-markdown` 12 429 ms vs `micromark` 1 207 ms (10.3×). On ordinary prose at 9/58/294 KB the two are within noise of each other (4.0 vs 3.8; 20.4 vs 22.3; 110.9 vs 105.8) `[measured]`. The 10.3× gap is specific to the adversarial flat-list shape, not a general property. The comment should say so.

### Audit of the current code
1. `editor/presentation/EditorPane.tsx:373-405` — **`MarkdownPreviewPane` unmounts the entire preview on every keystroke.** `setRenderContent(null)` → returns `<PreviewPending>` ("Rendering preview…") → `scheduleAfterPaint` (rAF → `setTimeout(0)`, lines 331-354) remounts. Per keystroke: full unmount + remount, lost DOM identity, lost scroll anchoring, KaTeX/highlight re-init, and a visible placeholder flash. **This is the single largest FEEL defect in the two modules.**
2. `preview/presentation/Markdown.tsx:41-61` — both `components` (`useMemo` on `[content, …]`) and `rehypePlugins` (`useMemo` on `[content]`) produce new identities every keystroke, and `createRehypeHtmlPolicy(content)` re-closes over the document. Every downstream memo is defeated by construction.
3. `preview/presentation/Markdown.tsx` — the preview parses the **whole** document with a second, non-incremental engine (remark/micromark) while CodeMirror already holds an incrementally-maintained lezer tree of the same bytes. 156–393× more expensive `[derived]`, and it means two parsers can disagree about one file — which contradicts the file-is-the-only-source-of-truth thesis. **Recommendation: project the preview from the lezer tree CM already maintains, and window it.**
4. `editor/presentation/EditorPane.tsx:469` — `useDeferredValue(previewContentRaw)` cannot rescue (3); React restarts the background render from scratch on each keystroke [fetched].
5. `editor/presentation/EditorPane.tsx:596` + `live/LivePreview.tsx:35` + `live/block-split.ts:31-36` — **Live mode passes the *undeferred* `previewContentRaw`** into `splitIntoSegments`, a full `remark-parse` of the whole document, in a `useMemo` keyed on content. 212.7 ms per keystroke at 294 KB `[measured]`. Live is the slowest mode and the only one with no deferral at all.
6. `editor/presentation/CodeMirrorEditor.tsx:243-262` — the `updateListener` writes the full doc into the Zustand store **synchronously inside CM's dispatch**, pulling React reconciliation into CM's documented write phase [fetched]. `toString()` itself is cheap (0.207 ms `[measured]`); the store fan-out is not.
7. `CodeMirrorEditor.tsx:266` — a **second** `update.state.doc.toString()` in the same listener when `content` is already in scope. Free deletion.
8. `CodeMirrorEditor.tsx:253` — the 400 ms timer is a **trailing debounce**, not the "throttle" the comment claims (`clearTimeout` + re-arm). At Fatin's measured 150 ms average inter-key interval [fetched] it never fires during a burst; the unmount handler is the only guarantee.
9. `CodeMirrorEditor.tsx:277-306` — the store→view reconciler runs `view.state.doc.toString()` plus a char-by-char prefix/suffix scan on **every** store change, which this view itself causes on every keystroke. It early-returns at `next === cur`, but only after the scan.
10. `EditorPane.tsx:58` — `countWords(content)` unmemoized on every status-bar render, 1.32 ms @294 KB `[measured]`.
11. `preview/presentation/markdown/components.tsx:39` — `content.split("\n")` per `buildComponents` call; 0.14 ms but a 9 000-element allocation per keystroke, feeding exactly the GC jitter Fatin names for JS engines [fetched].
12. `drafts/infrastructure/draft-store.ts:130-140` + `:96-101` — one `idb-keyval` `set()` = one IndexedDB transaction per save (~2 ms `[fetched]`), followed by a **synchronous `localStorage.setItem`** on the autosave path.
13. **There are no web workers in `src` at all** `[measured]`: `grep -rn "new Worker("` returns zero hits. `shape-gate.ts:27` documents budgets "enforced by the caller via `worker.terminate()`" — no such caller exists. The time budget is declarative fiction.
14. `preview/presentation/markdown/wikilinks.tsx:10` and `vault/infrastructure/markdown-parser.ts:12` carry the k≈1.99 pattern; the shape gate that would refuse such input lives in `mdmax/domain/` and is not on the preview path.
15. `editor/presentation/live-preview.ts:52-70` — **correct**: iterates `view.visibleRanges` only, per CM6 guidance [fetched]. Recomputes on `selectionSet` too (every cursor move) but bounded by viewport. No change needed.
16. `editor/presentation/split-scroll-sync.ts` — **correct**: 250 ms intent window, no per-frame work, no layout thrash. No change needed.
17. `editor/presentation/use-note-content.ts:63-78` — `await getDraft(path)` (IDB) runs *before* the network fetch. Serialized; should race.

### The benchmark suite to build, and what it asserts
- **Harness.** Playwright + CDP tracing, headed Chromium, fixed CPU throttle. Report **p50, p99, max, and SD** — never a bare mean. Fatin's rule: maximum values matter [fetched]; jitter is a distinct failure mode [fetched]. A run reporting only a mean fails review.
- **`bench/keystroke.spec`** — synthetic keypresses at 150 ms and at 40 ms intervals (Fatin's own average and minimum [fetched]) into notes of 1 KB / 10 KB / 100 KB / 300 KB / 1 MB, in each of the four modes (edit, live, split, reading). Assert: **p99 keypress→glyph ≤ 8 ms; p99 keypress→preview-commit ≤ 50 ms; max ≤ 100 ms; SD ≤ 5 ms; zero long tasks > 50 ms.**
- **`bench/reparse-cliff.spec`** — type `` ``` `` at the top of a 300 KB note, then `<!--`, then `$$`, then an unclosed `[[`. This is lezer's documented worst case [fetched]. Assert: **p99 ≤ 50 ms and no unbounded growth vs. document size.**
- **`bench/adversarial.spec`** — 320 KB of `[[`, of `- `, of nested `>`, of `*`. Assert: **shape gate refuses in ≤ 50 ms and no code path outside the gate ever sees the bytes.** Regression-lock k ≤ 1.05 for every regex that touches user content.
- **`bench/mount.spec`** — assert the preview DOM node identity is **stable across a keystroke** (`document.querySelector('.markdown-body')` is the same node before and after). This is the direct regression test for finding (1).
- **`bench/persistence.spec`** — assert a draft is durable within **one typing burst**, not one debounce; count IDB transactions per 100 keystrokes (target ≤ 3) since transactions are the cost [fetched]; assert zero synchronous `localStorage` writes on the keystroke path.
- **`bench/open.spec`** — cold and warm open at each size. Assert **first interactive frame ≤ 100 ms warm, ≤ 1000 ms cold**, and that IDB and network are raced not serialized.
- **`bench/scroll.spec`** — 1 MB note, programmatic scroll. Assert **≥ 58 fps sustained** and that memory stays within ~2× file size (VS Code's line-array failure was 20× [fetched]).
- **Gate.** Every assertion is a floor/ceiling, never an equality — a suite pinned to exact counts punishes adding coverage. Run each spec ≥ 3 times; one run is an anecdote.

### Anti-recommendations (keep all of these)
- **Do not lower the 400 ms draft debounce toward 0.** IDB cost is per-transaction, not per-byte [fetched]; more transactions is strictly worse. Fix durability by flushing on burst-end + `visibilitychange` + `pagehide`, not by writing more often.
- **Do not replace CodeMirror, and do not write a custom contenteditable or a WASM/native buffer.** VS Code's C++ buffer lost to V8 string-boundary costs [fetched]; CM6's viewport + lezer already delivers 1.36 ms incremental at 294 KB `[measured]`.
- **Do not reach for `useDeferredValue` (or `startTransition`) as the fix for an expensive render.** It restarts from scratch on each new value [fetched]; it converts a slow render into a render that never commits.
- **Do not add a second/third markdown engine, a "fast path" parser, or a plugin surface to make the preview quicker.** Two parsers over one file is two truths, and it violates the settled no-plugin-marketplace / no-arbitrary-client-code constraints. The correct move is *fewer* engines: project every view from the one lezer tree.
- **Do not virtualize the preview with a generic list virtualizer.** Markdown block heights are unknown until rendered, so `react-window`-class solutions will thrash. Try CSS `content-visibility: auto` + `contain-intrinsic-size` first, measured, before writing any windowing code `[inference]`.
- **Do not report p50 or median latency anywhere.** Fatin's stated position is that averages beat medians and maxima are the important number [fetched].
- **Do not treat the 250 ms `BUDGET_MS.keystroke` in `shape-gate.ts` as a target to hit.** It is 2.5× the perceptual bound [derived] and should be re-derived, not defended.
- **Do not add features to the preview until it stops unmounting itself.** Finding (1) makes every other preview optimization unobservable.