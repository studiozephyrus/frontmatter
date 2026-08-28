I mutated nothing: read-only session — only `curl` GETs, `grep`/`find`/`sed`-read of the repo, and no writes, edits, or commits; the reported `~/.claude` dirt is not mine.

### Evidence ledger (read 2026-08-29 unless noted)

| Tag | Source | What it gave |
|---|---|---|
| [fetched] | Nielsen, *Progressive Disclosure*, NN/g, pub. 2006-12-03 | The canonical mechanism + its two failure conditions + the ≤2-level ceiling |
| [fetched] | NN/g, *Hamburger Menus and Hidden Navigation Hurt UX* (n=179, 6 live sites, w/ WhatUsersDo) | The cost side: "Discoverability is cut almost in half by hiding a website's main navigation" |
| [fetched] | Crossref DOI metadata | Carroll & Carrithers, *Training wheels in a user interface*, CACM 27(8):800–806, 1984, `10.1145/358198.358218`; companion *Blocking Learner Error States in a Training-Wheels System*, Human Factors 26(4):377–389, `10.1177/001872088402600402`; Catrambone & Carroll, CHI/GI 1986, `10.1145/29933.275625`; Carroll et al., *The Minimal Manual*, HCI 3(2):123–153, 1987, `10.1207/s15327051hci0302_2` |
| [fetched] | The Browser Company, *Letter to Arc members 2025*, 2025-05-26 | "novelty tax"; per-feature DAU usage percentages |
| [fetched] | The Browser Company, *There and back again*, 2023-08-24 (internal memo dated 2023-06-30) | A documented add→remove→restore cycle with Day-1 churn attribution |
| [fetched] | ia.net/writer, ia.net/writer/support | "No buttons, no popups, no title bar"; "fewer features, by design"; 38 support headings |
| [fetched] | usefyi.com/evernote-history (Nira — **secondary**, vendor blog) | Libin quotes; Peek/Market/Work Chat chronology |
| [measured] | GitHub API `obsidianmd/obsidian-help@master` | 175 `en/*.md` pages; 28 under `en/Plugins` |
| [measured] | bear.app/faq/mac-keyboard-shortcuts | 14 sections, 73 modifier-bearing shortcut tokens |
| [derived] | notion.com/help/writing-and-editing-basics | 44 block types (13 basic + 5 views + 6 media + 12 embeds + 8 advanced; 13+5=18, +6=24, +12=36, +8=44) |
| [measured] | Local repo `/Users/sagnikmitra/Desktop/GitHub/frontmatter` @ `engine/plan-and-diagnostics` | 971 TS/TSX/JS/MJS files outside `node_modules`; 14 `src/modules`; 29 routes; 14 palette commands; 14 slash commands; 5 settings toggles |

**Not established.** The claim "most Obsidian downloaders never get past the first note" traces to a **Goodreads author-blog post by Red Tash, dated 2025-05-21**, where it appears as an unattributed pull-quote: "Over 1 million people have downloaded Obsidian—but most never get past creating their first note." [fetched, verbatim]. No Obsidian source, no methodology, no denominator. **DOWNGRADE: unsourced blogger assertion — do not cite it in any deck, page, or pitch.** The closest real artifact found is an Obsidian forum thread, *"1 year after posting my severe addiction, I don't really use Obsidian anymore"*, topic 90236, 2024-10-21 [fetched via Discourse `search.json`] — an anecdote, not data. **Use Arc's published numbers instead; they are the only first-party feature-adoption figures in this whole corpus.**

---

### 1. Mechanism table — every technique for hiding depth

| # | Mechanism | What it buys | What it costs | When it breaks |
|---|---|---|---|---|
| M1 | **Sensible defaults** (ship the answer, not the question) | Zero decisions before first value; the config surface stops being a surface | Every default is a bet you will be wrong about for some cohort; changing it later is a breaking change to muscle memory | When defaults are *wrong for the file on disk* — a formatting default that rewrites bytes is not a preference, it is data loss [inference, grounded in the byte-preserving splice constraint] |
| M2 | **Progressive disclosure** (core visible, advanced one level down) | NN/g: improves 3 of 5 usability components — learnability, efficiency, error rate [fetched] | Two hard requirements: the *right split*, and an obvious, strongly-scented path down [fetched] | Past **2 levels**: "designs that go beyond 2 disclosure levels typically have low usability because users often get lost" [fetched]. Also: "it's rarely a good idea to offer multiple ways to progress to secondary options" [fetched] |
| M3 | **Staged disclosure** (wizards; linear sequence) | Each step is simple and its purpose is clear; good for setup | Everyone pays the sequence, every time; it is *not* a substitute for M2 (NN/g distinguishes them explicitly: hierarchical vs linear, "usually not" visited vs "yes" visited) [fetched] | Re-entry. A wizard for a thing done twice a year is fine; for a thing done daily it is a tax |
| M4 | **Command palette** (the depth valve) | Unbounded command count at *zero* at-rest pixel cost; searchable, so no memorisation | Pure hidden navigation. NN/g's quantitative finding on hidden nav — discoverability cut ~in half, later first-use, higher perceived difficulty, **worse on desktop than mobile** [fetched] — transfers by [inference] to app command surfaces (their study was web nav, not palettes) | When it is the *only* path. A palette is a second door, never the first |
| M5 | **Expert mode / modal keymaps** (Vim mode) | A whole second interaction language for ~0 surface | Splits the product into two products for support, docs, and testing | When expert mode changes *semantics*, not just input. Fine for cursor motion; fatal for what gets written to disk |
| M6 | **Opinionated single-path design** | One correct way ⇒ nothing to choose ⇒ nothing to explain. iA Writer: "has fewer features, by design. But each one is intentional" [fetched] | Every user whose path is the other one leaves; you have chosen your non-customers | When the opinion contradicts the file. If the file says X and the single path renders Y, the opinion is a bug |
| M7 | **Feature gating by usage** (instrument, then bury/kill) | NN/g explicitly prescribes this: "instrument the code to record how often people use various features" [fetched] | Analytics alone lie: NN/g warns you must "supplement such analytics with observational usability testing to discern whether a page gets many hits because users want it or because they simply enter the page by mistake" [fetched] | Local-first products with no telemetry have **no signal at all** — you inherit Arc's problem without Arc's data |
| M8 | **Hidden-until-relevant UI** (contextual reveal) | Control appears only where its object exists; at-rest count stays flat as features grow | Users cannot form a model of "what this app can do"; capability becomes folklore | When relevance is *predicted* rather than *entailed*. Reveal on "a table is under the cursor" is entailment; reveal on "we think you want a table" is a slot machine |
| M9 | **Training wheels** (block advanced states for novices) | Carroll & Carrithers, CACM 1984, `10.1145/358198.358218` [fetched — citation verified via Crossref; **I did not open the paper; ACM DL is Cloudflare-gated — do not quote effect sizes**] | Blocked states must be *explicable*, or the block reads as a bug | Anything that makes the product refuse a legal file. Blocking a *learner error* is not the same as refusing valid YAML |
| M10 | **Progressive summarisation of chrome** (focus mode, fade-on-type) | Zero learning cost; reversible; costs nothing to ship | Almost none — this is the cheapest mechanism in the table | Only when it hides *state* (unsaved, syncing, conflicted) rather than *controls* |

**The two NN/g conditions are the whole discipline.** Get the split right; make the descent obvious and singular. Everything above is an implementation of one of those two.

---

### 2. The measurable definition of "simple" for a document editor

Nine counters. Each must be a *number produced by a script*, re-derived at write time, not a hand estimate [LR#59/#62 discipline].

| Metric | Definition | Measurement procedure | Target for frontmatter |
|---|---|---|---|
| **V0 — visible controls at rest** | Interactive affordances rendered in the default window: empty vault, first launch, no selection, no hover | Screenshot the built app at 1440×900, count every clickable target by hand once, then pin with a DOM assertion (`document.querySelectorAll('button,[role=button],a,input,select')` inside the shell subtree) | **≤ 9** |
| **K1 — keystrokes to first value** | Actions from cold launch to the first user word durably on disk | Instrumented run; count discrete input events | **≤ 3** (launch → type → autosave) |
| **S0 — settings exposed by default** | Toggles reachable without opening an "Advanced" affordance | Static count of the settings surface | **≤ 6** (today: 5 toggles + 1 mode segment) |
| **C — concepts to learn** | Distinct nouns a user must hold to use the product at all | Enumerate from the first-run copy; anything not nameable in the first-run screen is a concept you are smuggling | **≤ 3**: file, folder, view |
| **D — disclosure depth** | Max levels from at-rest to the deepest shipped capability | Walk the tree | **≤ 2** (NN/g's hard ceiling) [fetched] |
| **P — path multiplicity** | Number of distinct routes to a given command | Cross-reference palette ∪ menu ∪ shortcut ∪ toolbar | **≤ 2** per command; **exactly 1** for destructive ones [fetched: "rarely a good idea to offer multiple ways"] |
| **Z — zero-config correctness** | % of foreign vaults that open, render, and round-trip **byte-identically** with no setting changed | Run the existing foreign-corpus suite | **≥ 99.9%** — today the engine refuses 6,613/6,614 foreign files on zero-indent block sequences, 83% aggregate [project-measured, `docs/FRONTMATTER-MASTER-PLAN-2026-08-28.md:135`; **not re-verified by me**] |
| **U — usage floor** | % of active users touching each shipped feature | Requires telemetry you may refuse to collect; if refused, substitute *support-request frequency* and say so | Bury below **5%**; delete below **1%** (Arc's own numbers calibrate this) |
| **R — reversibility** | % of user actions with a single-keystroke undo | Enumerate mutating commands | **100%** — non-negotiable given the file is the source of truth |

**Why these and not "feature count":** feature count is not the variable. Bear ships 73 shortcuts [measured] and reads simple; Arc shipped fewer top-level surfaces and read complex enough to kill itself [fetched]. The variable is **V0 and C** — what is on screen, and how many nouns you must hold.

---

### 3. Benchmark

| Product | V0 (at rest) | Depth mechanism | Countable depth | Verdict |
|---|---|---|---|---|
| **iA Writer** | "No buttons, no popups, no title bar" — its own claim [fetched] | M6 + M10 + M1 | 38 support-page headings incl. Settings, Content Blocks, Templates, Custom Templates, URL Commands, Apple Shortcuts [measured] | **Succeeded, now drifting.** The at-rest promise is intact; the depth has grown to Authorship, Style Check, Syntax Highlight, Wikilinks, Content Blocks. Watch D. |
| **Bear** | Not measurable via curl (native app) | M4 + M5 | 73 modifier-bearing shortcuts across 14 sections [measured] | **Succeeded.** Depth lives entirely in the keymap; the canvas stays clean. The reference implementation of "enormous depth, invisible surface". |
| **Things 3** | Not measurable via curl | M2 + M8 | Two Apple Design Awards; positioning "Simply Powerful", "within the hour" [fetched] | **Succeeded.** Third-party reviews consistently name the *combination* — "powerful enough for even the most detailed and organized power user… simple enough for the rest of us" [fetched, The Sweet Setup, quoted on culturedcode.com] |
| **Linear** | Not measurable — /method renders client-side; **I retrieved only the table of contents, not the body** [fetched, partial] | M4 + M6 | TOC sections: "Set the product direction", "Scope projects down", "Write issues not user stories", "Build with users" [fetched] | **Succeeded** — but I could not open the argument, only its skeleton. Do not quote Linear's method prose from memory. |
| **Raycast** | n/a | M4 (palette *is* the product) + extension store | Changelog rendered as repeating `New / Improvements / Fixes` triads, 30 headings on one page [measured] | **Succeeded at surface, accreting underneath.** The palette absorbs unbounded depth at zero at-rest cost — the strongest evidence for M4. |
| **Arc** | n/a | M6 (aggressively) | **Only 5.52% of DAUs use more than one Space regularly. Only 4.17% use Live Folders. 0.4% use Calendar Preview on Hover.** [fetched] | **FAILED.** "for most people, Arc was simply too different, with too many new things to learn, for too little reward" — the *novelty tax*. Also: "our metrics were more like a highly specialized professional tool (like a video editor) than a mass-market consumer product" [fetched] |
| **Notion** | n/a | M8 (slash menu) + M3 (templates) | **44 block types** on the *basics* page alone [derived]; 11 product surfaces in the site nav (AI, Agents, Meeting Notes, Enterprise Search, Knowledge Base, Docs, Projects, Connections, Security, Calendar, Mail) [fetched] | **FAILED at simple, won at market.** Both are true; record the disagreement rather than resolving it. |
| **Obsidian** | n/a | M7-by-plugin (ship it off) | **175 help pages; 28 core-plugin pages** [measured] | **Mixed.** Depth is real; the first-run surface is a blank pane. The popular churn claim about it is **not evidenced** (see ledger). |
| **Craft** | n/a | M8 | Homepage now sells "Docs / Tasks / Calendar / Whiteboards / Daily Notes"; "Craft isn't just for one thing, it's for *your* things" [fetched] | **Drifted.** A document tool that became a suite — the accretion path, mid-flight. |
| **Evernote** | n/a | none maintained | Peek (2011) → Market → Work Chat (Oct 2014); "Everything besides the main Evernote app was a distraction from the company's core mission" [fetched, secondary]; HN, 2023-07-06: "Nearly all of Evernote's remaining staff has been laid off", 1025 pts / 614 comments [fetched] | **FAILED.** The canonical accretion death. Libin: "If you make different products and they're great, people are like, 'That's genius!'… And if you focus on one product and it fails…" [fetched, secondary] |
| **frontmatter (today)** | **Proxy only** — 11 `<button>` in `EditorPane.tsx` (973 lines), 1 in `Toolbar.tsx`, 1 in `VaultWorkspace.tsx` [measured; **this is a source-text proxy, not an at-rest render count** — LR#60] | M4 + M8 + M1 | 14 palette commands; 14 slash commands; 5 toggles; 14 modules; 29 routes; 971 source files [measured] | **On the right side, unverified.** Notion ships 3.14× frontmatter's insert vocabulary (44/14) [derived]. That ratio is the position to hold. |

**Source disagreement, recorded not resolved:** iA Writer's marketing says "fewer features, by design" [fetched] while its own support index carries 38 headings [measured]. Both are honest — the *at-rest surface* is small and the *documented depth* is large. This is exactly the target state, and it is why V0 and C must be measured separately from feature count.

---

### 4. frontmatter at rest — concrete specification

**At rest = a real vault open, one `.md` file selected, no hover, no selection, default settings, 1440×900.**

**Visible (V0 = 9).** Everything else is a violation.

1. The text. Full-bleed, one column, no border.
2. File tree — collapsed to a **rail**, not a panel: folder names only, no icons, no counts, no size.
3. Breadcrumb path of the current file (also the rename affordance — click to edit in place).
4. **One** mode control: a three-state segment `Edit · Read · Split`.
5. **One** view control: the projection selector — `Document · Board · Calendar · Card · Site`. Disabled-but-visible when the file's front matter does not entail that projection.
6. Save/sync state indicator. Text, not a spinner. Three states only: `Saved` / `Saving` / `Conflict`.
7. Word count.
8. Search entry point (`search` Material Symbol, inline SVG per LR#52).
9. Right-pane toggle (properties / outline / backlinks — cycles, does not fan out).

**Not visible at rest, and this is the design:** no formatting toolbar, no font picker, no theme switcher, no plugin surface, no AI button, no export button, no share button, no graph button, no settings gear.

**One keystroke away (D = 1).**

| Key | Opens | Rationale |
|---|---|---|
| `⌘K` | Command palette — the single depth valve. Every non-at-rest command lives here and **only** here [fetched: NN/g, avoid multiple descent paths] | M4 |
| `⌘P` | File switcher (fuzzy, filenames only) | Separate from `⌘K` because it is object-selection, not command-invocation |
| `/` at line start | Insert menu — currently 14 items [measured]. **Cap at 16.** | M8 |
| `⌘F` | In-file find | Frequency |
| `⌘⇧F` | Vault search | Frequency |
| `⌘,` | Settings — **cap at 6 toggles, one screen, no tabs.** Today: 5 + mode segment [measured] | S0 |
| `Esc` | Collapse everything back to at-rest | Reversibility of the surface itself |

**Buried (D = 2, reachable only from the palette or a properties field).** Vim mode; line numbers; spellcheck; AI ghost text; import; export vault; trash/restore; version history; link doctor; share; publish; graph; degradation certificate; splice diagnostics; conflict merge.

**Never surfaced (D = ∞, engine-internal).** Byte-preserving splice mechanics; offset maps; cross-engine degradation certification; the foreign-corpus gate. These are the depth. They must be *felt* — as "it never corrupted my file" — and never *seen*.

**The projection rule, stated as a design law.** A view is offered **iff** the file entails it — board when the front matter carries a status field, calendar when it carries a date field, card when it carries a decision field. Never offered on prediction, never offered as a mode the user configures. This makes M8 (hidden-until-relevant) *entailed* rather than *guessed*, which is the only version of M8 that does not degrade into a slot machine.

**Actionable, in order.**

1. **Convert V0 from proxy to measurement before any surface work.** Build, screenshot, hand-count once, then pin with a DOM assertion in CI. A source-text `<button>` grep is a proxy and must be labelled one; today the repo has no `.github/` at all [project-measured, master plan L164].
2. **Fix Z before adding any surface.** 83% aggregate foreign refusal makes every V0 argument moot — a clean nine-control window over a file it refuses to open is not simple, it is broken. Zero-config correctness is a *simplicity* metric, not an engine metric.
3. **Cap the palette by policy at 40 commands**, `MAX_RESULTS` stays 20 [measured: 14 today, MAX_RESULTS=20]. Past 40, a palette becomes a menu you cannot see.
4. **Enforce P ≤ 2 with a script.** Cross-reference palette ∪ shortcuts ∪ menus ∪ toolbar; fail CI on a third route. Destructive commands: exactly one route, palette only.
5. **Ship a usage floor without telemetry** — because you will not ship telemetry. Substitute: every quarter, count support requests and issue mentions per command; anything at zero for two quarters moves one level deeper or dies. State the substitution in the doc so nobody later reports it as usage data.
6. **Write the at-rest screenshot into the repo as a golden image.** The nine-control window is a contract; a diff on it is a design review trigger.

---

### 5. Anti-patterns that specifically kill simple markdown editors

| # | Anti-pattern | Evidence | Why it is fatal *here* |
|---|---|---|---|
| A1 | **The formatting toolbar** | iA Writer's entire pitch is its absence [fetched] | Markdown's whole proposition is that the syntax *is* the toolbar. A bold button admits the syntax failed |
| A2 | **Settings that rewrite bytes** (auto-format on save, list-marker normalisation, front-matter reordering) | The engine is byte-preserving splice [product constraint] | A formatting preference that mutates untouched bytes breaks the one promise nothing else can restore |
| A3 | **Refusing valid files** | 6,613/6,614 foreign refusals on `tags:\n- item` — spec-valid, PyYAML's default emission [project-measured] | The user experiences "this app is simple" and "this app can't open my notes" as the *same* judgment: it doesn't work |
| A4 | **Feature accretion into adjacent categories** | Evernote: Peek → Market → Work Chat, "everything besides the main Evernote app was a distraction" [fetched, secondary]. Craft today: Docs/Tasks/Calendar/Whiteboards [fetched] | The stated constraint is *not a Notion-style PM tool*. Every board/calendar must be a **projection of the file**, never a second data store |
| A5 | **Novelty tax** — new concepts before value | Arc: "too different, with too many new things to learn, for too little reward"; D1 retention strong, mass-market metrics absent [fetched] | C > 3 kills you before V0 ever matters. Projections must reuse nouns the user already has (file, folder, field) |
| A6 | **Shipping the signature feature to the 5%** | Arc: 5.52% multi-Space, 4.17% Live Folders, 0.4% Calendar Preview [fetched] | Any projection that lands under 5% is a maintenance liability wearing a feature costume |
| A7 | **Hidden-only navigation** | NN/g: discoverability cut ~in half; worse on desktop than mobile (n=179) [fetched] | A palette-only product is undiscoverable. The nine at-rest controls exist *because* M4 alone fails |
| A8 | **Three-plus disclosure levels** | "designs that go beyond 2 disclosure levels typically have low usability" [fetched] | Settings → tab → advanced → sub-panel is where every markdown editor goes to die |
| A9 | **Multiple descent paths** | "rarely a good idea to offer multiple ways to progress to secondary options" [fetched] | Palette + menu bar + toolbar + right-click for the same command quadruples the docs and quadruples the bug surface |
| A10 | **Add → remove → restore churn** | Arc reverted synced tabs after 2.5 months; the removal was itself a top complaint [fetched] | "Synced tabs was not perfect, but it was easy to understand. **It made Arc feel smaller.**" [fetched] — legibility beats correctness on the surface |
| A11 | **Blank first run** | The Obsidian blank-pane experience is *described* everywhere and *measured* nowhere (see ledger) | Do not defend the blank pane with the unsourced churn statistic — defend it, or don't, on K1 |
| A12 | **Plugin marketplace as the complexity dumping ground** | Obsidian: 28 core-plugin doc pages [measured]; Raycast's store [measured] | Settled: no plugin marketplace, no arbitrary client-side execution. Therefore **every deferred feature stays yours** — M7 is your only relief valve, and you have no telemetry to run it. Budget accordingly |

### Explicit anti-recommendations

- **Do not cite "most Obsidian downloaders never get past the first note."** Traced to a Goodreads author blog, unattributed, 2025-05-21 [fetched].
- **Do not add a formatting toolbar**, even collapsed, even on hover, even "just for tables."
- **Do not use progressive disclosure to justify a third level.** Three levels means cut features, per NN/g's own instruction [fetched].
- **Do not add a second route to any destructive command.**
- **Do not report V0 from a `grep -c '<button>'`.** That is a source proxy; the number that matters is rendered.
- **Do not build a settings tab structure.** Tabs are level-2 disclosure spent on configuration — the lowest-value place to spend it.
- **Do not quote Linear's method prose.** Only its TOC was retrievable here; the body is client-rendered [fetched, partial].
- **Do not treat Notion's 44 blocks as a target to approach.** 3.14× your current insert vocabulary [derived] is the gap you are selling.
- **Do not ship a projection you cannot entail from the file.** A view that needs its own config is a second source of truth.