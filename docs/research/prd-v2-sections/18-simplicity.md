I mutated nothing: this session ran only two `Read` calls against the four report files. No writes, no edits, no commits, no shell mutations. The reported `~/.claude` dirt predates me.

## 18. Simplicity as an engineering discipline

Simplicity here is a set of numbers with owners and CI gates, not a taste claim. The governing constraint is the projection law: the file is the only source of truth, every view is a deterministic reversible projection owning no state — which means simplicity is enforceable, because anything that would need its own configuration surface is already forbidden by the architecture.

| Rule | Statement | Enforced by |
|---|---|---|
| S-1 | Feature count is not the variable; **at-rest visible controls (V0) and concepts-to-learn (C) are** | §18.2 counters, CI |
| S-2 | Disclosure depth never exceeds 2 levels [fetched: NN/g, *Progressive Disclosure*, pub. 2006-12-03 — "designs that go beyond 2 disclosure levels typically have low usability because users often get lost"] | §18.3 depth walk |
| S-3 | Exactly one descent path per command; exactly one for destructive commands [fetched: NN/g — "it's rarely a good idea to offer multiple ways to progress to secondary options"] | `P` script, CI |
| S-4 | A projection is offered **iff** the file's own bytes entail it. Never predicted, never configured | §18.5 |
| S-5 | Zero-config correctness is a simplicity metric, not an engine metric | `Z`, foreign-corpus gate |
| S-6 | Latency is a correctness property with a p99 budget, not a polish item | §18.4 budget table |

**A nine-control window over a file the engine refuses to open is not simple, it is broken** — today the engine refuses 6,613 of 6,614 foreign files on zero-indent block sequences, 83% aggregate [project-measured, `docs/FRONTMATTER-MASTER-PLAN-2026-08-28.md:135`; not re-verified in this pass]. Fix `Z` before any surface work.

---

### 18.1 The mechanisms for hiding depth, and what each costs

| # | Mechanism | What it buys | What it costs | When it breaks | frontmatter |
|---|---|---|---|---|---|
| M1 | **Sensible defaults** — ship the answer, not the question | Zero decisions before first value; the config surface stops being a surface | Every default is a bet that is wrong for some cohort; changing it later breaks muscle memory | When a default rewrites bytes. A formatting default that mutates untouched bytes is not a preference, it is data loss [inference, grounded in the byte-preserving splice constraint] | **Use** |
| M2 | **Progressive disclosure** — core visible, advanced one level down | Improves 3 of 5 usability components: learnability, efficiency, error rate [fetched, NN/g] | Two hard requirements: the right split, and one obvious strongly-scented path down [fetched] | Past 2 levels [fetched] | **Use, capped at D=2** |
| M3 | **Staged disclosure** — wizards, linear sequence | Each step simple, purpose clear; good for one-time setup | Everyone pays the sequence every time; NN/g distinguishes it from M2 explicitly (hierarchical vs linear) [fetched] | On re-entry. Fine twice a year, a tax daily | **Reject** |
| M4 | **Command palette** — the depth valve | Unbounded command count at zero at-rest pixel cost; searchable, so nothing memorised | Pure hidden navigation. NN/g measured discoverability "cut almost in half" by hiding main navigation, later first use, higher perceived difficulty, and **worse on desktop than mobile** (n=179, 6 live sites, with WhatUsersDo) [fetched]; transfer to app command surfaces is [inference] — their study was web nav | **Use, never as the only path** |
| M5 | **Expert mode / modal keymaps** (Vim mode) | A second interaction language for ~0 surface | Splits the product in two for support, docs, tests | When expert mode changes semantics rather than input. Fine for cursor motion; fatal for what is written to disk | **Bury at D=2** |
| M6 | **Opinionated single-path design** | One correct way ⇒ nothing to choose ⇒ nothing to explain. iA Writer: "has fewer features, by design. But each one is intentional" [fetched, ia.net/writer] | Every user whose path is the other one leaves; you have chosen your non-customers | When the opinion contradicts the file. If the file says X and the single path renders Y, the opinion is a bug | **Use** |
| M7 | **Feature gating by usage** — instrument, then bury or kill | NN/g prescribes it: "instrument the code to record how often people use various features" [fetched] | Analytics alone lie; NN/g requires supplementing them "with observational usability testing to discern whether a page gets many hits because users want it or because they simply enter the page by mistake" [fetched] | Local-first products with no telemetry have **no signal at all** — Arc's problem without Arc's data | **Substitute** (see §18.2, `U`) |
| M8 | **Hidden-until-relevant UI** — contextual reveal | Control appears only where its object exists; at-rest count stays flat as features grow | Users cannot form a model of what the app can do; capability becomes folklore | When relevance is *predicted* rather than *entailed*. "A table is under the cursor" is entailment; "we think you want a table" is a slot machine | **Use, entailed only** |
| M9 | **Training wheels** — block advanced states for novices | Carroll & Carrithers, CACM 27(8):800–806, 1984, DOI `10.1145/358198.358218`; companion *Blocking Learner Error States in a Training-Wheels System*, Human Factors 26(4):377–389, `10.1177/001872088402600402` [fetched via Crossref metadata only — **the papers were not opened, ACM DL is Cloudflare-gated; do not quote effect sizes**] | Blocked states must be explicable or the block reads as a bug | Anything that refuses a legal file. Blocking a *learner error* is not refusing valid YAML | **Reject** |
| M10 | **Progressive summarisation of chrome** — focus mode, fade-on-type | Zero learning cost, reversible, cheapest thing in the table | Almost none | Only when it hides *state* (unsaved, syncing, conflicted) rather than controls | **Use** |

**The two NN/g conditions are the whole discipline: get the split right, and make the descent obvious and singular** [fetched]. Every mechanism above is an implementation of one of those two.

Anti-recommendations: do not use M2 to justify a third level — three levels means cut features, per NN/g's own instruction [fetched]; do not ship M8 on prediction; do not build M9 into the file-open path; do not adopt M3 anywhere, including first-run.

---

### 18.2 A measurable definition of simple

Each counter is a number produced by a script and re-derived at write time, never a hand estimate.

| Metric | Definition | Measurement procedure | Target |
|---|---|---|---|
| **V0** — visible controls at rest | Interactive affordances rendered in the default window: vault open, one `.md` selected, no hover, no selection, 1440×900 | Build, screenshot, hand-count once, then pin with a DOM assertion (`document.querySelectorAll('button,[role=button],a,input,select')` inside the shell subtree) in CI | **≤ 9** |
| **K1** — keystrokes to first value | Discrete input events from cold launch to the first user word durably on disk | Instrumented run | **≤ 3** (launch → type → autosave) |
| **S0** — settings exposed by default | Toggles reachable without an "Advanced" affordance | Static count | **≤ 6** (today: 5 toggles + 1 mode segment [measured]) |
| **C** — concepts to learn | Distinct nouns required to use the product at all; anything not nameable on the first-run screen is a concept being smuggled | Enumerate from first-run copy | **≤ 3**: file, folder, view |
| **D** — disclosure depth | Max levels from at-rest to the deepest shipped capability | Walk the tree | **≤ 2** [fetched, NN/g ceiling] |
| **P** — path multiplicity | Distinct routes to a given command | Cross-reference palette ∪ menu ∪ shortcut ∪ toolbar | **≤ 2**; **exactly 1** for destructive [fetched] |
| **Z** — zero-config correctness | % of foreign vaults that open, render and round-trip byte-identically with no setting changed | Foreign-corpus suite | **≥ 99.9%** (today 17% pass; 6,613/6,614 refused on zero-indent sequences [project-measured]) |
| **U** — usage floor | % of active users touching each shipped feature | No telemetry will ship. **Substitute**: support requests + issue mentions per command per quarter, and say in the doc that it is a substitution so nobody later reports it as usage data | Bury below **5%**; delete below **1%** |
| **R** — reversibility | % of mutating actions with single-keystroke undo | Enumerate mutating commands | **100%** — non-negotiable when the file is the source of truth |

Benchmark, competitors where the data exists:

| Product | Countable depth | V0 evidence | Verdict |
|---|---|---|---|
| **iA Writer** | 38 support-page headings incl. Settings, Content Blocks, Templates, Custom Templates, URL Commands, Apple Shortcuts [measured, ia.net/writer/support] | "No buttons, no popups, no title bar" — its own claim [fetched] | Succeeded, drifting. Watch D |
| **Bear** | 73 modifier-bearing shortcut tokens across 14 sections [measured, bear.app/faq/mac-keyboard-shortcuts] | Native app, not measurable via curl | Succeeded. The reference implementation of enormous depth behind an invisible surface — depth lives entirely in the keymap |
| **Notion** | **44 block types** on the *basics* page alone [derived: 13 basic + 5 views + 6 media + 12 embeds + 8 advanced = 44]; 11 product surfaces in site nav [fetched] | n/a | Failed at simple, won at market. Both are true; recorded, not resolved |
| **Obsidian** | **175** `en/*.md` help pages, **28** under `en/Plugins` [measured, GitHub API `obsidianmd/obsidian-help@master`] | Blank pane at first run | Mixed |
| **Arc** | **5.52%** of DAUs use more than one Space regularly; **4.17%** use Live Folders; **0.4%** use Calendar Preview on Hover [fetched, The Browser Company, *Letter to Arc members 2025*, 2025-05-26] | n/a | **Failed.** "for most people, Arc was simply too different, with too many new things to learn, for too little reward" — the novelty tax [fetched] |
| **Evernote** | Peek (2011) → Market → Work Chat (Oct 2014) [fetched, usefyi.com/evernote-history — **secondary, vendor blog**] | n/a | Failed. The canonical accretion death |
| **frontmatter (today)** | 14 palette commands; 14 slash commands; 5 toggles; 14 `src/modules`; 29 routes; 971 TS/TSX/JS/MJS files outside `node_modules` [measured, `engine/plan-and-diagnostics`] | **Proxy only** — 11 `<button>` in `EditorPane.tsx` (973 lines), 1 in `Toolbar.tsx`, 1 in `VaultWorkspace.tsx` [measured; a source-text proxy, not a rendered count] | On the right side, unverified. Notion ships **3.14×** frontmatter's insert vocabulary (44/14) [derived] — that ratio is the position to hold |

**The claim that most Obsidian downloaders never get past their first note is refuted and must not be repeated.** It traces to a Goodreads author-blog post by Red Tash dated 2025-05-21, where it appears as an unattributed pull-quote — "Over 1 million people have downloaded Obsidian—but most never get past creating their first note" [fetched, verbatim]. No Obsidian source, no methodology, no denominator. The nearest real artefact is Obsidian forum topic 90236, 2024-10-21, an anecdote [fetched via Discourse `search.json`]. Use Arc's published percentages instead; they are the only first-party feature-adoption figures in the corpus.

Source disagreement, recorded not resolved: iA Writer markets "fewer features, by design" [fetched] while its own support index carries 38 headings [measured]. Both are honest, and the gap is exactly the target state — which is why V0 and C must be counted separately from feature count.

Falsification: if a build passes V0 ≤ 9, C ≤ 3, D ≤ 2 and still produces support requests dominated by "where is X", the counters are measuring the wrong thing and M4 is being over-relied on; re-derive from `U` before adding surface.

Anti-recommendations: do not report V0 from `grep -c '<button>'`; do not build a settings tab structure (tabs are level-2 disclosure spent on the lowest-value surface); do not treat Notion's 44 blocks as a target to approach; do not add a formatting toolbar, even collapsed, even on hover, even "just for tables" — markdown's proposition is that the syntax *is* the toolbar, and a bold button admits the syntax failed.

---

### 18.3 The surface at rest — what is visible, what is one keystroke away

At rest = a real vault open, one `.md` file selected, no hover, no selection, default settings, 1440×900.

Visible, V0 = 9. Anything else on screen is a violation.

1. The text. Full-bleed, one column, no border.
2. File tree, collapsed to a **rail** not a panel: folder names only, no icons, no counts, no sizes.
3. Breadcrumb path of the current file, which is also the rename affordance (click to edit in place).
4. **One** mode control: three-state segment `Edit · Read · Split`.
5. **One** view control: the projection selector `Document · Board · Calendar · Card · Site`, disabled-but-visible when the file's bytes do not entail that projection.
6. Save/sync state. Text, not a spinner. Three states only: `Saved` / `Saving` / `Conflict`.
7. Word count.
8. Search entry point (Material Symbol `search`, inline SVG per house standard).
9. Right-pane toggle — properties / outline / backlinks, which **cycles** rather than fanning out.

Not visible at rest, and this is the design: no formatting toolbar, no font picker, no theme switcher, no plugin surface, no AI button, no export button, no share button, no graph button, no settings gear.

One keystroke away (D = 1):

| Key | Opens | Rationale |
|---|---|---|
| `⌘K` | Command palette — the single depth valve. Every non-at-rest command lives here and **only** here | M4; NN/g single-descent-path [fetched] |
| `⌘P` | File switcher, fuzzy, filenames only | Object selection, not command invocation |
| `/` at line start | Insert menu — 14 items today [measured]. **Cap at 16** | M8 |
| `⌘F` | In-file find | Frequency |
| `⌘⇧F` | Vault search | Frequency |
| `⌘,` | Settings — **cap at 6 toggles, one screen, no tabs** | S0 |
| `Esc` | Collapse everything back to at-rest | Reversibility of the surface itself |

Buried at D = 2, reachable only from the palette or a properties field: Vim mode; line numbers; spellcheck; AI ghost text; import; export vault; trash/restore; version history; link doctor; share; publish; graph; degradation certificate; splice diagnostics; conflict merge.

Never surfaced (engine-internal): byte-preserving splice mechanics, offset maps, cross-engine degradation certification across 7 markdown engines, the foreign-corpus gate. **These are the depth, and they must be felt as "it never corrupted my file" and never seen.**

Build actions, in order: (1) convert V0 from proxy to measurement and pin the at-rest screenshot into the repo as a golden image — a diff on it is a design-review trigger; the repo has no `.github/` at all today [project-measured, master plan L164]; (2) cap the palette by policy at **40** commands with `MAX_RESULTS` held at 20 [measured: 14 today, `MAX_RESULTS=20`] — past 40 a palette is a menu you cannot see; (3) enforce P ≤ 2 with a script that cross-references palette ∪ shortcuts ∪ menus ∪ toolbar and fails CI on a third route.

Anti-recommendations: do not add a second route to any destructive command; do not add a menu bar item for something already in the palette; do not defend the blank first run with the refuted Obsidian statistic — defend it, or don't, on K1.

---

### 18.4 Latency as the quality signal

Perceptual bands, each with its real source:

| Band | Claim | Source |
|---|---|---|
| ~10 ms | "produce each frame in an animation in 10 ms or less" — the 16 ms frame minus browser paint | web.dev/articles/rail [fetched] |
| 16.7 ms | One frame at 60 Hz; smoothness requires 60 new frames per second | web.dev [fetched] |
| 20–30 ms | MIDI audio latency "enough to disrupt your performance" | Fatin, *Typing with pleasure* [fetched] |
| ~40 ms | "Human visual system needs about 40 ms to process its input"; also Fatin's minimum inter-keystroke interval | Fatin [fetched] |
| 50 ms | Process input events within 50 ms, because idle work can queue input for the other 50 ms | web.dev [fetched] |
| 100 ms | "0 to 100 ms — users feel like the result is immediate" | web.dev [fetched] |
| 150 ms | Fatin's own average inter-key interval "during my own relatively fast typing" | Fatin [fetched] |
| ~200 ms | Full sense→consciousness→muscle round trip; SpeechJammer disrupts speech at ~200 ms | Fatin [fetched] |
| 1000 ms | "users lose focus on the task they are performing" | web.dev [fetched] |
| 10000 ms | "users are frustrated and are likely to abandon" | web.dev [fetched] |

Two structural facts decide the budget. Latency is **not masked** by the 40 ms vision delay — "any 'external' delay is added on top of the vision delay, not 'masked' by it" — and typing is feedback-dependent below conscious perception: "One does not necessarily need to perceive latency consciously to be affected by it" [fetched, Fatin]. Jitter is a separate axis: the nervous system adapts to constant delay, but "any irregularities in delay durations (so called jitter) pose additional problem because of their inherent unpredictability", with GC/JIT named as a jitter source specific to JS engines [fetched].

Hardware floor is not free: typical keyboard 14 ms avg (matrix 0.5, debounce 8.5, USB poll 4, transmission 1) plus typical monitor 12 ms (refresh 8, pixel response 4) ≈ 26 ms; "ideal" is 3 ms [fetched]. **Software budget to stay inside RAIL's 100 ms response bound = 100 − 26 = 74 ms** [derived].

The latency budget. Targets are p99 on a 300 KB note, not the mean.

| Operation | Target p99 | Perceptual justification |
|---|---|---|
| keypress → caret + glyph | **≤ 8 ms** | Must fit inside one 16.7 ms frame alongside paint; GVim achieves 0.9 ms avg [fetched] |
| keypress → highlight of edited line | **≤ 8 ms** | Same frame; lezer incremental measured 1.36 ms @ 294 KB [measured] |
| keypress → live-preview conceal update | **≤ 10 ms** | RAIL animation budget [fetched] |
| cursor move / selection change | **≤ 8 ms** | Same frame, and it fires more often than edits [inference] |
| keypress → split-preview text update | **≤ 50 ms** | RAIL input-processing bound, leaving 50 ms for queued idle work [fetched] |
| keypress → status bar / word count | **≤ 2 ms** | Decoration must not compete with the caret [inference] |
| scroll one viewport | **≤ 10 ms/frame** | Animation budget [fetched] |
| paste 100 KB | **≤ 100 ms** | Single discrete action, "feels immediate" band [fetched] |
| keypress → draft durably persisted | **≤ 400 ms, unconditionally within one burst** | IDB cost is per-transaction (~2 ms), not per-byte; >1 s loses task focus [fetched, rxdb.info + web.dev] |
| open a warm note (draft in IDB) | **≤ 100 ms** | Immediate band [fetched] |
| open a cold note (network) | **≤ 1000 ms**, rendered skeleton before 100 ms | Focus-loss threshold [fetched] |
| open a 1 MB document | **≤ 1000 ms** to first interactive frame | CM6 renders only the viewport [fetched] |
| refuse a hostile document (shape gate) | **≤ 50 ms** | Must be cheaper than the attack it prevents [inference] |

**The repo's own stated keystroke budget is wrong and must be re-derived, not defended: `src/modules/mdmax/domain/shape-gate.ts:27-35` declares `BUDGET_MS.keystroke = 250`, which is 2.5× RAIL's 100 ms response bound and 5× its 50 ms processing bound** [derived, fetched].

Measured on this machine, 2026-08-29, mean of 3–50 iterations after warm-up, synthetic markdown at three sizes:

| Operation | 9 KB | 58 KB | 294 KB |
|---|---|---|---|
| `@lezer/markdown` full parse | 1.19 ms | 4.05 ms | 16.78 ms |
| `@lezer/markdown` incremental, 1-char edit, fragments reused | 0.25 ms | 0.22 ms | **1.36 ms** |
| `micromark` | 3.8 ms | 22.3 ms | 105.8 ms |
| `mdast-util-from-markdown` | 4.0 ms | 20.4 ms | 110.9 ms |
| `remark-parse` + `remark-rehype` (repo's plugin set) | 11.0 ms | 41.6 ms | 212.7 ms |
| `react-markdown` full pipeline + `renderToString` (repo's plugins) | 20.8 ms | 91.5 ms | **534.1 ms** |
| `countWords()` as written | — | 0.24 ms | 1.32 ms |

Derived: preview render at 294 KB is 534.1 / 16.7 = **32 dropped frames**; at 58 KB one render is 91.5 / 100 = **91.5% of the entire RAIL response budget**; lezer incremental beats the remark pipeline by 212.7 / 1.36 = **156×** and the react-markdown pipeline by 534.1 / 1.36 = **393×**. `Text.toString()` on a 580 KB CodeMirror `Text` is **0.207 ms** (mean of 200) [measured] — materialising the whole doc string per keystroke is *not* the bottleneck, which corrects the obvious hypothesis.

Named defects to fix, in priority order [all measured/read in `src`]:

1. `editor/presentation/EditorPane.tsx:373-405` — `MarkdownPreviewPane` **unmounts the entire preview on every keystroke** (`setRenderContent(null)` → `<PreviewPending>` → `scheduleAfterPaint` remount at :331-354): lost DOM identity, lost scroll anchoring, KaTeX/highlight re-init, visible placeholder flash. This is the single largest feel defect.
2. `preview/presentation/Markdown.tsx:41-61` — `components` and `rehypePlugins` produce new identities every keystroke; every downstream memo is defeated by construction.
3. Same file — the preview parses the whole document with a second, non-incremental engine while CodeMirror already holds an incrementally-maintained lezer tree of the same bytes. Two parsers over one file is two truths, which contradicts the projection law. **Project the preview from the lezer tree CM already maintains, and window it.**
4. `EditorPane.tsx:596` + `live/LivePreview.tsx:35` + `live/block-split.ts:31-36` — Live mode passes the *undeferred* content into a full `remark-parse`: 212.7 ms per keystroke at 294 KB [measured].
5. `CodeMirrorEditor.tsx:243-262` writes the full doc into the Zustand store synchronously inside CM's dispatch, pulling React reconciliation into CM's documented write phase [fetched, CM6 guide]; `:266` runs a second redundant `toString()`; `:253`'s "throttle" is a trailing debounce that never fires during a burst at Fatin's 150 ms inter-key average [fetched]; `:277-306` runs a char-by-char prefix/suffix scan on every store change this view itself causes.
6. **There are no web workers in `src` at all** — `grep -rn "new Worker("` returns zero hits [measured] — while `shape-gate.ts:27` documents budgets "enforced by the caller via `worker.terminate()`". The time budget is declarative fiction.

Correct as-is, do not touch: `editor/presentation/live-preview.ts:52-70` (iterates `view.visibleRanges` only, per CM6 guidance [fetched]) and `editor/presentation/split-scroll-sync.ts` (250 ms intent window, no per-frame work).

Benchmark suite: Playwright + CDP tracing, headed Chromium, fixed CPU throttle, reporting **p50, p99, max and SD — never a bare mean**, each spec run ≥ 3 times. Specs: `keystroke` (150 ms and 40 ms intervals into 1 KB/10 KB/100 KB/300 KB/1 MB in all four modes; assert p99 keypress→glyph ≤ 8 ms, p99 keypress→preview-commit ≤ 50 ms, max ≤ 100 ms, SD ≤ 5 ms, zero long tasks > 50 ms); `reparse-cliff` (type ``` then `<!--` then `$$` then an unclosed `[[` at the top of a 300 KB note — lezer's documented worst case, where "even a tiny document change… can require a big part of the document to be re-parsed" [fetched]); `adversarial` (320 KB of `[[`, `- `, nested `>`, `*`; assert the shape gate refuses in ≤ 50 ms and regression-lock k ≤ 1.05 for every regex touching user content); `mount` (assert preview DOM node identity is stable across a keystroke); `persistence` (≤ 3 IDB transactions per 100 keystrokes, zero synchronous `localStorage` on the keystroke path); `open`; `scroll` (≥ 58 fps on 1 MB, memory within ~2× file size). Every assertion is a floor or ceiling, never an equality.

Quadratic regression, reproduced [measured]: pattern `/(!?)\[\[([^\]]+)\]\]/g` against N KB of `[[` — 40 KB → 662 ms; 80 KB → 2,607 ms; 160 KB → 10,740 ms; 320 KB → **42,679 ms**, zero matches; k = log₂(42679/10740) = **1.991**. Source disagreement, recorded not resolved: `shape-gate.ts:8` states 36,865 ms at 320 KB and k = 1.98 — same shape, ~16% apart, different machine and day. Scope correction: `shape-gate.ts:9` cites a 10.3× `mdast-util-from-markdown` vs `micromark` gap; on ordinary prose the two are within noise (4.0 vs 3.8; 20.4 vs 22.3; 110.9 vs 105.8) [measured] — the gap is specific to the adversarial flat-list shape and the comment should say so.

Anti-recommendations: do not lower the 400 ms draft debounce toward 0 (IDB cost is per-transaction — 1,000 documents in one transaction ≈ 80 ms vs ≈ 2 s one-per-write [fetched, rxdb.info]; flush on burst-end, `visibilitychange` and `pagehide` instead); do not replace CodeMirror or write a custom contenteditable or a WASM/native buffer (VS Code found a C++ text buffer "could lead to significant memory savings, but we didn't see the performance enhancements we were hoping for. Converting strings between a custom native representation and V8's strings is costly" [fetched]); do not reach for `useDeferredValue` or `startTransition` as the fix — React 19.2 docs state the background re-render "is interruptible: if there's another update to the value, React will restart the background re-render from scratch" [fetched], so a 534 ms render restarted per keystroke commits zero frames; do not add a second or third markdown engine or a "fast path" parser; do not virtualise the preview with a generic list virtualizer (block heights are unknown until rendered — try `content-visibility: auto` + `contain-intrinsic-size` first, measured); do not report a median anywhere.

Falsification: if the keystroke spec holds p99 ≤ 8 ms with SD ≤ 5 ms and users still report lag, the budget is wrong at the tail — re-derive from max, not p99, per Fatin's stated position that maxima are the important number [fetched].

---

### 18.5 The affordance problem — discovering that a file is also a board

The literature, and what it licenses:

| Finding | Number | Source |
|---|---|---|
| Raskin's test: an interface is modal w.r.t. a gesture when the state is **not the user's locus of attention** and the same gesture produces different responses depending on it | — | [fetched, Wikipedia *Mode (user interface)*, rev. 1327521622, last edited 2025-12-14] |
| Kinesthetic mode-switch method reduced mode errors | `F(1,11)=20.74, p<.001` | Sellen, Kurtenbach & Buxton 1992, *HCI* 7(2):141–164, DOI `10.1207/s15327051hci0702_1` [fetched, full PDF] |
| Visual feedback reduced mode errors | `F(1,11)=11.40, p<.003` | same [fetched] |
| Variance explained — mode-switch method | **15.6%** liberal / **11.0%** conservative (ω²) | same [fetched] |
| Variance explained — visual feedback | **4.8%** liberal / **4.1%** conservative (ω²) | same [fetched] |
| User-maintained state vs a visual indicator | 15.6 ÷ 4.8 = **3.25×**; 11.0 ÷ 4.1 = **2.68×** | [derived] |
| Variance explained by neither channel | 100 − (15.6 + 4.8) = **79.6%** | [derived] |
| The visual condition was not subtle | It "involved changing the **entire screen area pink**", and the authors warn this has "important implications for systems which rely on more subtle visual cues such as changing the shape of the cursor or the color of the menu bar" | [fetched] |
| Experiment 2 isolates the mechanism | A latching pedal was statistically indistinguishable from the keyboard (`p < .33`); it was not the pedal, it was that the state had to be **actively sustained** | [fetched] |
| Reversibility beats confirmation | Modal confirmation is "criticised as ineffective… due to habituation. Actually making the action reversible (providing an 'undo' option) is recommended instead" | [fetched, citing Norman 1983, *CACM* 26(4):254–258] |

Citation-count disagreements, recorded not resolved: Sellen 1992 — Crossref 95 vs Semantic Scholar 179; Sarter & Woods 1995 (*Human Factors* 37:5–19) — 614 vs 987; Baldonado 2000 (*AVI* 110–119) — 454 vs 899. Baldonado is the canonical multiple-views guideline paper; **its ACM PDF returned HTTP 403 and its rules are deliberately not quoted here.**

**The invariant that dissolves most of the problem: typing always inserts text, in every projection.** The board never captures the keyboard as a control surface; drag-and-drop and card-click are gestures that do not exist in text view. Zero gesture overlap means modeless under Raskin's test, so the 79.6%-unexplained-variance problem never arises because there is no mode to be wrong about [inference, grounded on Raskin's definition and Sellen's effect sizes].

Where the control lives:

- One control in the document title bar, left-aligned, present on every file, labelled with the **current** state — `Text`, `Board`, `Calendar`, `Decision`. Copy Google Docs' pattern where the button reads "Editing" and you "click **Editing** → select **Suggesting**" [fetched], not a toggle labelled with its destination.
- Clicking lists only the projections this file's bytes can satisfy, each with a computed reason line: "Board — 3 `status` values, 12 list items". Non-satisfiable entries show disabled with the missing precondition. **The menu is the schema documentation; there is no settings page.**
- Keyboard: one chord per profile (`⌘1` text, `⌘2` board, …) plus a **held-key peek** (`⌘⇧` held) that renders the projection over the text and snaps back on release. The peek is the quasimode, and per Sellen it is worth roughly three visual indicators at a fraction of the surface cost.
- Nothing else. No tab strip, no `+ New view`, no view names.

How a user learns a file can be a board — five rungs, no tour: (1) the control exists on every file from first launch, so its location is learned once; (2) it enables itself when content qualifies — self-evidence, but weak alone at 4.8% of variance, so never the only rung; (3) **one inline ghost line at the point of authorship**, at most once per workspace, permanently dismissible — immediately after the third distinct `status:` value or the second `## Column`, a dimmed line appears at that block reading "3 columns · ⌘2 for board", which is recognition inside the locus of attention rather than a toast in a corner; (4) palette entries named `Board`, `Calendar`, `Decision card`, shown disabled-with-reason so the disabled state teaches the precondition; (5) templates where `new board` emits a file whose *text* is already board-shaped, so the user learns the markdown shape, not a feature.

What a board file must be in a dumb editor: `## Column` headings plus `- [ ] item`; calendar = items carrying `date:`/`due:`; decision = MADR headings — all correct in GitHub, Obsidian, Bear, `less`, `vim`. The projection adds **zero bytes**. Last-used projection, column widths, collapse state and scroll are app-local, keyed by path + content hash, never in the file. `render:` is a **hint, not an instruction**: the client owns the default, following VS Code's `workbench.editorAssociations` model shipped in v1.44 alongside `View: Reopen with` — where "You can still use **View: Reopen Editor With…** to switch an individual editor back to the text view" [fetched] — so a file arriving from someone else's repo opens as text with a one-line offer. A mode set by a stranger is Sarter & Woods' worst case.

The six rules: (1) one gesture, one meaning, across every projection; (2) the control names the current state; (3) **preview the byte before writing it** — dragging a card shows `status: doing → done` in the drag chip before drop, generalising Excel's Recommended-Charts preview and Docs' review-preview [fetched]; (4) undo, not confirmation — every projection write is one splice and one `⌘Z` on a stack shared with text view; (5) the escape is bidirectional and lives in the same control on every platform; (6) two panes on one file are both live and consistent, or the second is read-only with a stated reason.

Failure modes to test, each with its evidence anchor from `obsidian-kanban` (4,483 stars, `pushed_at` 2026-03-06, 600 open issues [fetched, GitHub API 2026-08-29]): F1 round-trip mutates bytes (`sha256` before/after text→board→text ×20; issue #644, open 2022-09-27, 14 comments — board→note→board breaks until restart); F3 split panes diverge or wedge (#578, closed 2022-07-01, "Can't get out of error state if Kanban visible in more than one pane"; #666, 2022-10-20); F5 one-way switch (#732, open 2023-02-09, 7 comments: "When switching to markdown view, the menu emtry to switch back is missing"); F6 stale per-file projection memory across rename/move/restart (PR #1221, open 2026-07-09, "clear stale `kanbanFileModes`"); F7 unknown `render:` blanks the editor (assert DEGRADE to text with a named reason); F8 body stops satisfying the profile mid-edit (assert REFUSE + zero writes); F9 line-ending/BOM/bare-CR corruption on projection write; F10 multi-byte truncation at a splice boundary (CJK/emoji column names, combining marks); F11 column rename half-writes (heading **and** every `status:` value rewrite atomically, or refuse); F14 a third-party `render:` auto-entering a projection on first open; F16 override-preservation surprise, anchored on Figma's own worked example where a fill change from `#1BC47D` → `#F531B3` is preserved on Step 3 and not Step 4 because the target variant started from `#FFFFFF` [fetched]; and **F15, the silent-keystroke event** — a user types while a projection has focus and the character goes nowhere. F15 is frontmatter's vi insert/command error and is the single number to instrument and watch.

Anti-recommendations: no onboarding tour, coach marks, spotlight overlays or "what's new" modals — they are confirmation dialogs wearing a hat and habituation kills them; **no `+ New view` tab strip**, because that single affordance is the on-ramp to Notion's view registry → per-view filters → sorts → grouping → sharing → **Lock views** → a permission tier that exists solely to stop colleagues breaking each other's filters, and Notion's own doc concedes "anyone with editing access can toggle this lock on or off at any time" [fetched]; no per-view saved filters stored in the file; **no app-owned settings block in the document** — `obsidian-kanban` writes `%% kanban:settings ``` {json} ``` %%` via `settingsToCodeblock` [fetched], visible junk in every foreign renderer; no sidecar view file (`.base`-style splits the source of truth and imports the rename-desync class already reported in that ecosystem [fetched]); no badges, dots or status-bar chips as a discovery strategy (whole-screen pink bought 4.8% of variance; a 12px dot buys less); no content-sniffing auto-switch on open; no hover-only controls as the sole affordance (Notion's inline databases hide "controls and menus… until you hover" [fetched]); no user-defined view DSL, which is a code-execution surface with a friendly name; and do not call it "Mode", "View" or "Profile" in the UI — the user-facing word is the projection's own name, with "render profile" kept internal.

Falsification: if F15 instrumentation shows a non-trivial silent-keystroke rate after the modeless invariant ships, the invariant has been violated somewhere in the gesture map and the projection must lose keyboard focus entirely until it is found.

---

### 18.6 Mobile and cross-device

Current posture, measured in this repo 2026-08-29:

| Surface | State |
|---|---|
| `src/app/manifest.ts` | `display: "standalone"`, `scope: "/"`, `orientation: "any"`, 3 icon entries (192, 512, 512-maskable) **all pointing at the same `/favicon.png`** |
| Manifest gaps | no `share_target`, `shortcuts`, `file_handlers`, `display_override`, `protocol_handlers` — grep returned 0 hits |
| `public/sw.js` | 98 lines, `CACHE = "sgnk-md-v2"`, `SHELL = ["/favicon.png","/theme-init.js"]`; HTML navigations network-only; `/_next/static/*` stale-while-revalidate; `/api/` and `/login` never intercepted |
| Offline reading | **impossible today** — note content arrives via `/api/`, which the SW explicitly passes through [derived] |
| Mobile-specific code | `visualViewport` 0, `inputMode` 0, `safe-area` 0, `touchstart` 0, `accessory` 0; `pointerdown` 5; `max-width` 15 |
| CSS media queries, whole app | **3 total** across 1,057 CSS lines: 2 × `prefers-color-scheme`, 1 × `max-width: 1023px` |
| `src-tauri/tauri.conf.json` | `bundle.targets: ["dmg","app"]`, `macOS.minimumSystemVersion: "11.0"`, **no iOS or Android block**, `frontendDist` and window `url` = `https://md.sgnk.ai` |

In one line: an installable desktop-web PWA with a responsive-ish layout, zero offline content, zero mobile input model, and a Tauri config that is a remote-URL macOS wrapper [derived].

What mobile users of this category actually do (App Store metadata, `itunes.apple.com/search`, US storefront, read 2026-08-29) [fetched]:

| App | Version | Rating | Ratings *n* | Price |
|---|---|---|---|---|
| Google Docs | 1.2026.34101 | 4.79 | **3,211,357** | $0 |
| Microsoft OneNote | 16.113.2 | 4.71 | 1,059,746 | $0 |
| Apple Notes | 2.0 | 4.84 | **632,431** | $0 |
| Notion | 1.7.331 | 4.78 | 89,887 | $0 |
| Drafts | 53.0 | 4.79 | **10,733** | $0 |
| Bear | 2.9.3 | 4.68 | 6,853 | $0 |
| Craft | 3.5.6 | 4.84 | 6,596 | $0 |
| Working Copy | 6.9.4 | 4.85 | 3,740 | $0 |
| Obsidian | 1.13.7 | 4.48 | **2,689** | $0 |
| Ulysses | 40.4 | 4.58 | 2,095 | $0 |
| iA Writer | 8.0.6 | 4.56 | 1,531 | **$19.99** |

Derived: Google Docs ÷ Obsidian = 3,211,357 ÷ 2,689 = **1,194.3×**. Apple Notes ÷ (Bear + Craft + Ulysses + iA Writer + Obsidian = 19,764) = **32.0×**. Drafts ÷ iA Writer = 10,733 ÷ 1,531 = **7.01×**. Working Copy, a *git client*, outranks Obsidian mobile on rating volume. **Within markdown-native tools, capture-shaped apps outsell authoring-shaped apps roughly 7:1, and the whole markdown-native mobile category is about 1/32 the size of the default OS notes app** [inference]. Craft's own front page states the split: "capture ideas instantly across all your devices, then refine them when you're ready" [fetched]. Obsidian forum thread volumes name the real complaints — "Make Obsidian Sync work in background (on Mobile)" 124 posts (opened 2021-10-20), "Obsidian Sync incorrectly duplicates sections of files" 105 posts (2025-01-12), "Mobile, startup: reduce time until the user can write" 64 posts (2023-04-03) [measured, Discourse `search.json`; `views` returned `null` and `like_count` `0` on every row, so those fields are unmeasured, not zero]. The two dominant families are **sync trust and time-to-caret, not missing features**.

Decision: **ship PWA for v1; do not ship a native or wrapped mobile app.**

| Force toward PWA | Evidence |
|---|---|
| Every v1-scope capability is `y` on iOS Safari 26.6: Service Workers, IndexedDB, Wake Lock, `env()`; `VisualViewport` `safari: 13`; `navigator.share` `safari: 12.1` | [fetched, caniuse + MDN BCD] |
| A Home Screen Web App gets the **full 60%/80%** origin/overall quota, identical to the browser app; a wrapped WKWebView (Capacitor, Tauri iOS) gets **15%/20%** — strictly worse, inverting the usual "native gives you more storage" intuition | [fetched, webkit.org/blog/14403/updates-to-storage-policy/] |
| App Store guideline **4.2** is a live rejection risk for exactly the artefact we would ship first: an app "should include features, content, and UI that elevate it beyond a repackaged website"; 4.2.2 names "web clippings, content aggregators, or a collection of links" | [fetched, developer.apple.com/app-store/review/guidelines/] |
| Tauri iOS costs Apple Developer Program enrolment, code signing and a macOS CI leg before one user benefits; `@tauri-apps/cli` 2.11.4 (registry `modified` 2026-06-28) | [fetched] |
| We are Next.js 16 with live `/api/` and `/login` routes, so there is no static `webDir` to hand `@capacitor/core` 8.5.0 (2026-08-28) — a Capacitor build today ships a shell loading remote content, which is the 4.2 shape | [derived] |

Survivable gaps, each with the mitigation: no `showOpenFilePicker`/`showSaveFilePicker` (`safari: false`; caniuse `"n"` at every iOS version 3.2 → 26.6) — our source of truth is GitHub-backed, we never needed the picker; no Background Sync or Periodic Sync (`safari: false`, impl bug `webkit.org/b/182565`) — sync on foreground/visibilitychange only, and this is precisely Obsidian's 124-post complaint; no `beforeinstallprompt` (`safari: false`) and no Add-to-Home-Screen in iOS Chrome/Firefox — an instructional sheet on iOS Safari, and count the loss; eviction is LRU by last user interaction — call `navigator.storage.persist()` once and keep the server as the durable copy. Quota is a non-issue: 10,000 notes × 4 KB = 40 MB against the worst case (WKWebView, 15% of 128 GB = 19.2 GB) is **0.21%** [derived]; eviction is the entire risk.

Source disagreements, recorded not resolved: MDN BCD reports `FileSystemFileHandle`/`FileSystemDirectoryHandle` as `safari: 15.2` while caniuse reports the File System Access feature as `"n"` at every iOS Safari version through 26.6 — both correct at different granularity, so **cite the picker, not the interface**, when saying we cannot open the user's folder. Push: BCD says `version_added: 16.4`; caniuse says `a` (partial, note 7). Chrome Android `showOpenFilePicker`: BCD says `132`, the FSA caniuse entry says `and_chr 151: "n"` — unreconciled; do not build on either number without re-testing.

Minimum credible v1 mobile scope: (1) **read offline, selectively** — cache note bodies in IndexedDB for the N most-recently-opened plus explicitly pinned, mirroring Google Docs' shipped opt-in model ("Make recent files available offline", a per-file toggle, and a separate Offline list) rather than Obsidian's whole-vault one [fetched]; (2) **capture** — one tap from the home-screen icon to a new note at one configured path, justified by Drafts 7.01× iA Writer [derived]; (3) **light edit, single-writer** — reuse the byte-preserving splice path, guard every write with a precondition check against the file's known SHA, and on mismatch **refuse and show the diff, never auto-merge**; (4) **projections read-only on phone** — render and tap through to the source line, no drag, no inline mutation; (5) the accessory row; (6) manifest repair — real 192 and 512 PNGs, `shortcuts` for "New note" and "Today", and keep `display: "standalone"` because a non-default `display` is the documented precondition for `Notification` ever working on iOS [fetched]; (7) **time-to-caret as the headline mobile metric**.

The accessory row. `position: fixed; bottom: 0` does not track the iOS keyboard — the visual viewport shrinks and the layout viewport does not, and `env(keyboard-inset-bottom)` is `safari: false` [fetched ×2]. Subscribe to `visualViewport` `resize` + `scroll` and position with `transform: translate3d(0, Δ, 0)` where `Δ = layoutHeight − vv.height − vv.offsetTop`; transform, not `bottom`, to avoid per-frame reflow [inference]. Keyboard down, pad with `env(safe-area-inset-bottom)` (`safari: 11`); keyboard up, zero it. Editor font-size ≥ 16px suppresses focus auto-zoom.

| Slot | Action | Backed by |
|---|---|---|
| 1 | Heading cycle H1→H2→H3→none | `prefixLine` [measured, exists] |
| 2–4 | Bold, italic, inline code | `wrapSelection` [measured, exists] |
| 5 | Link | `insertLink` [measured, exists] |
| 6 | List toggle `-` ↔ `1.` ↔ none | `prefixLine` |
| 7 | Task checkbox `[ ]` ↔ `[x]` | `prefixLine` |
| 8–9 | Outdent / indent | CodeMirror commands |
| 10–11 | Caret ← / →, long-press = by word | `moveByChar` / `moveByGroup` |
| 12–13 | Undo / redo | `@codemirror/commands` |

Behaviour: **collapsed cursor must work** — wrap actions with no selection insert the delimiter pair and place the caret between them, because requiring a selection first is the largest markup-entry friction on touch; caret-nudge buttons exist to avoid iOS selection handles entirely, which is why they earn slots ahead of tables, quotes or images; long-press is key repeat, never a submenu; one row that fits one screen width so it never scrolls, sitting outside the CodeMirror scroller. Textastic and Working Copy both ship exactly this pattern at 4.70 and 4.85 [fetched] — the pattern is settled, do not innovate on it.

Explicitly deferred: multi-note offline write queue; any conflict-merge UI; background sync; push; `share_target`; `file_handlers`; native/Capacitor/Tauri mobile builds; CRDT; attachments and image capture; multi-vault; iPad multi-window; graph view on phone.

Anti-recommendations: do not ship a Tauri or Capacitor shell that loads `https://md.sgnk.ai` remotely — that is the current `tauri.conf.json` shape [measured] and the literal 4.2 "repackaged website"; do not design any feature depending on Background or Periodic Sync; do not ship a custom install banner driven by `beforeinstallprompt`; do not make board/calendar/decision-card editable on phone, because drag-to-mutate on a 375 px viewport is where a reversible projection quietly becomes a Notion-style PM tool; do not introduce a CRDT (`yjs` 13.6.32 and `@automerge/automerge` 3.4.1 are current and healthy [fetched], and both impose an internal document model — a tree-of-record through the back door); do not add swipe gestures for editor commands; do not add `maximum-scale=1` or `user-scalable=no` (our viewport correctly omits both today [measured]); do not "fix" split view on phone (already disabled at ≤767 px, which is right); do not queue offline writes across multiple notes in v1, which is what produces 105-post data-duplication threads; do not make the accessory row customizable; do not treat IndexedDB or OPFS as the record; and do not benchmark against Obsidian's mobile feature list — its 4.48 rating is the lowest in the comparison table while its feature count is the highest [derived].

Falsification and revisit triggers, written down now: background sync becomes a top-2 support theme; measured install-to-home-screen conversion on iOS Safari falls below 15%; or a paying customer requires Files.app integration. Any one of those makes native a live question; none of them is true today.
