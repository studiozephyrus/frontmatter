I performed zero writes and zero commits; only Read calls ran in this session, so the 19 `~/.claude` and 1 `~/.sgnk` dirty paths pre-date it and are not mine.

## 16. Feature inventory and the honest v1

### 16.1 The completeness matrix

Legend: **IN PRD** = named in `docs/FRONTMATTER-PRD-2026-08-29.md`; **CODE** = present in `src/` today; parity keys OB Obsidian · TY Typora · iA iA Writer · BE Bear · HM HackMD · DM Docmost · SY SiYuan · AF AppFlowy · OU Outline. ✱ = parity asserted without opening the source `[inference]`.

Search and navigation

| Feature | In PRD | Code | Nearest parity | Demand evidence | Verdict |
|---|---|---|---|---|---|
| Full-text vault search | Yes (§14 Home band 1) | Yes, MiniSearch | Universal | — | shipped |
| Search operators (`path:`, `file:`, `OR`, quoted phrase, exclusion) | No | No | OB ships them as a core-plugin doc `[fetched]` | OB documents a whole operator language `[fetched]` | **v1, build** |
| Saved searches | No (0 term hits) | No (`savedSearch` 0 hits) `[measured]` | OB: a search is one of 7 bookmarkable types `[fetched]` | — | **v1, build** |
| Bookmarks / pins | 1 mention | Yes (`editor/bookmarks`) | OB groups + reorder `[fetched]`; BE pin-notes `[fetched]` | — | v2 |
| Command palette, `#`/`@`/`:` goto | Yes §13 L0, §14.1 | Yes | TY "Open Quickly" `Cmd+Shift+O` `[fetched]` | — | shipped |
| Backlinks + **unlinked** mentions | 1 passing mention | Yes (`preview`, 21 files) | OB two collapsible sections, sort + filter `[fetched]` | OB frames unlinked mentions as "discover links you aren't aware of" `[fetched]` | **v1, document** |
| Sort + group (name, modified, created, frontmatter field) | No (0 hits) | No (only `tree-order.ts`) `[measured]` | OB Bases sort/group/filter `[fetched]` | — | **v1, build** |
| Tag browse / rename / merge | 17 mentions, no tag *operations* | Partial | BE devotes 5 FAQ pages to tags alone `[fetched]` | — | v1 browse, v2 rename |
| Graph view | Yes (§16, 3 files) | Yes | OB, SY, Logseq ✱ | 3,848 nodes / 3,737 edges internally `[measured]` | v2 polish |

Editing mechanics

| Feature | In PRD | Code | Nearest parity | Demand evidence | Verdict |
|---|---|---|---|---|---|
| Undo/redo across mode switch | Only as a **risk** (likelihood 3 / impact 5) `[measured]` | Yes (`historyKeymap`) | Universal | Named in the risk register, not the feature list `[measured]` | **v1, harden + name** |
| Find/replace **in file** | No (0 hits) | Yes (`searchKeymap`, `openSearchPanel`) | TY `Ctrl+H` class `[fetched]` | SY 3, AF 4 issues+PRs titled "find and replace"; Logseq 0 `[measured]` | **v1, document** |
| Find/replace **across vault** | No | No (0 hits) | SY has it as an *open ask* `[measured]` | An open request inside a mature competitor is the cleanest demand signal available `[measured]` | v2 (L — must route through splice + one review surface) |
| Complete + remappable keyboard map | 5 keys in §14.1; `shortcut`/`keyboard` = 0 elsewhere `[measured]` | Partial | TY publishes ~40 keys plus "Change Shortcut Keys" `[fetched]` | OU: **25** issues+PRs titled "keyboard shortcut" `[measured]` | **v1 map, v2 remap** |
| Table keybindings (row/cell select, insert, delete, align) | `table` ×30 | Partial | TY `Ctrl+L` / `Ctrl+E` / `Ctrl+Shift+Backspace`; iA Smart MD Tables; BE tables FAQ `[fetched]` | Three independent products ship dedicated table keys `[fetched]` | **v1** |
| Multi-cursor, folding, zen | Yes §13 L0 | Yes | iA ships Folding and Dynamic Outline **Windows only** `[fetched]` | iA shipping folding on one platform is evidence it is hard, not unwanted `[inference]` | v1 |
| Autosave + crash recovery, as a named promise | No (0 hits) | Yes (IndexedDB + localStorage dirty index) `[measured]` | Universal ✱ | — | **v1, name it** |
| Paste as markdown / plain | Yes | Partial | TY `Cmd+Shift+V`, `Cmd+Shift+C` `[fetched]` | — | v1 |
| Snippets, reopen-closed-file | No | No | TY `Ctrl+Shift+T` `[fetched]` | Weak | v2 |

Files, safety, export, media, craft, platform

| Feature | In PRD | Code | Nearest parity | Demand evidence | Verdict |
|---|---|---|---|---|---|
| Trash + restore | No (0 hits) | Yes (`TrashModal`, `api/vault/delete`, `api/vault/restore`) | OB, BE ✱ | Delete-with-no-undo is a top churn cause `[inference]` | **v1, document** |
| Multi-select bulk move/delete/set-field | "bulk" ×2, unspecified | **No** — `multiSelect`/`selectedFiles`/`bulk` = 0 hits in `src` `[measured]` | BE documents ⌘-click and two-finger swipe select `[fetched]` | BE documents selection gestures purely to enable bulk export `[fetched]` | **v1, build** |
| Rename with link rewriting | `rename` ×3 | Partial (`repository/create-rename-merge`) | OB ✱ | — | **v1** |
| Duplicate file (`Cmd+Shift+S` class) | No | No | TY "Save As / Duplicate" `[fetched]` | — | v1 |
| Whole-vault backup | No | git, for GitHub-backed vaults only | BE dedicated backup-restore FAQ `[fetched]` | — | **v1 — explain, do not build** |
| Encryption / per-note lock | 1 mention (BYO-key); `E2EE` 0 | No | BE per-note password + Face/Touch ID, "we cannot see or reset it", gated behind Pro `[fetched]` | BE monetises it `[fetched]` | v2 |
| Conflict handling | Yes, strong (conflict inbox, `merge3`, T0 gate) | Yes | BE conflicted-notes FAQ; HM avoids it via realtime `[fetched]` | — | v1 |
| Supported file types, published | Not enumerated | Partial | OB enumerates `.md .base .canvas`, 8 image, 6 audio, 5 video, pdf `[fetched]` | OB treats the list as a support contract `[fetched]` | **v1, publish the list** |
| PDF fidelity (paper size, page breaks, header/footer, metadata) | print-CSS + `pdf-doc.ts`; options unspecified | Partial | TY exposes every one plus a LaTeX/Pandoc engine `[fetched]` | OU **14** issues+PRs titled "export pdf", top hit *"Images are missing in pdf export"*; DM **64** titled "export" `[measured]` | **v1** |
| Print (`Cmd+P`) | 1 mention | No | TY prints via the PDF pipeline `[fetched]` | — | **v1** |
| DOCX / EPUB / RTF / ODT / LaTeX | No | No | TY ships 16 targets; BE gates html/docx/pdf/jpg/epub behind Pro `[fetched]` | Two products make the export matrix the paid tier `[fetched]` | v2 (shell to Pandoc) |
| Image paste / drag-drop upload | No | Yes (`api/vault/upload`) | TY, HM `[fetched]` | Universal `[fetched]` | **v1, document** |
| Attachment path policy (relative, `./` prefix, escaping) | No | Implicit | TY needed **8** sub-settings `[fetched]` | Exactly where portability breaks `[inference]` | **v1 — one rule, no dial** |
| Word count / read time | No | Yes (`N words · N min`, `ceil(words/200)`) | OB core plugin, **CJK-aware** `[fetched]` | OB shipped CJK counting specifically `[fetched]` | **v1, + CJK** |
| Spellcheck | No | Yes (browser-native toggle) | iA: system on Mac/iOS, **Hunspell** on Windows `[fetched]` | — | v1 native only |
| Focus mode / typewriter | `typewriter` ×1, `focus mode` 0 | Yes, shipped toggle `[measured]` | iA Focus Mode on all platforms — its oldest differentiator `[fetched]` | — | v1, document |
| Authorship / AI-vs-human provenance | Yes §10.3, §13 L3 | Partial | **iA Writer alone**: AI text dimmed, other-human underlined `[fetched]` | The only competitor analogue `[fetched]` | **v1** |
| Tabs / split panes | `tabs` 3 / `split` 5 | Partial | TY New Tab is **macOS-only** `[fetched]` | — | v1 |
| **Mobile editing** | **1 mention**, inside one T1 roadmap cell `[measured]` | No | OB marks help pages `mobile: true` per feature; iA has a full iPhone/iPad column; BE ships iOS shortcuts, widgets, Siri; AF iOS+Android; HM mobile modes `[fetched]` | Every product opened has a first-class mobile story `[fetched]` | **v1: read + light edit PWA** |
| Offline | 7 mentions; T6 | Partial | AF **8** issues+PRs titled "offline"; AFFiNE **16**, top hit *"chore(electron): remove offline mode"* `[measured]` | Sources disagree: AFFiNE *removing* an offline mode is a counter-signal, recorded not smoothed `[measured]` | v1 local vault only |
| Real-time multiplayer | Deliberately deferred to T6 | No | HM and DM both lead their docs with it `[fetched]` | — | **never in v1** |
| Accessibility (screen reader, focus order, contrast) | **0 mentions** `[measured]` | Unknown | Unverified for all competitors | Legal exposure selling to EU/US orgs `[inference]` | **v1 baseline** |
| Localisation | **0 mentions** `[measured]` | No | iA UI in 10 languages; SiYuan README in 4 `[fetched]` | Selling globally from India with an English-only UI `[inference]` | v2 |

Two ground-truth caveats the build team must resolve before trusting line-level references above: the code audit recorded `git rev-parse HEAD` = `5e0d5a585cf0090451c809c1e2781a5f9a5a587b` while a same-window audit recorded HEAD unchanged at `d714fb5f0305ea1e5f8612b43e271d3b4e95fe54` `[measured, disagreement preserved]`; and GitHub `search/issues` totals include pull requests and closed items, so every count above is a ceiling, not an issue count `[measured]`.

### 16.2 Missing entirely — what users expect and we had not listed

Ordered by churn risk `[inference]`, each anchored to a fact in 16.1.

| # | Gap | Why it is a gap |
|---|---|---|
| 1 | **Mobile** | One sub-clause in one roadmap cell against a universal competitor platform matrix `[fetched]` |
| 2 | Vault-wide find and replace | Zero in PRD, zero in code; an open request even inside SiYuan `[measured]` |
| 3 | Keyboard shortcut map | 5 keys specified; Typora publishes ~40 with a remap path `[fetched]` |
| 4 | Search operators | Obsidian ships `path:`/`file:`/`OR`/quoted/escaped as core `[fetched]` |
| 5 | Saved searches | Obsidian makes a search a bookmarkable object `[fetched]` |
| 6 | Sort and grouping controls | No spec, no code `[measured]` |
| 7 | Bulk / multi-select | Zero code hits `[measured]` |
| 8 | **Shipped-but-undocumented set**: trash, restore, word count, read time, spellcheck, in-file replace, image paste, focus mode, autosave | Unowned features rot; a feature nobody wrote down is a feature nobody regression-tests `[inference]` |
| 9 | Attachment path policy | The most common cause of a vault that stops rendering elsewhere; Typora needed 8 settings for it `[fetched]` |
| 10 | PDF fidelity contract | Outline's top PDF issue is missing images; Docmost's is attachment paths `[measured]` |
| 11 | Print | 1 mention, no implementation `[measured]` |
| 12 | Accessibility | 0 mentions, and the only gap here carrying legal exposure `[inference]` |
| 13 | Localisation | 0 mentions while selling globally `[measured]` |
| 14 | Tag management (rename, merge, nested) | tags ×17, tag *operations* 0 `[measured]` |
| 15 | Encryption / note lock | Bear monetises exactly this `[fetched]` |
| 16 | DOCX export | Bear and Typora both gate it as paid `[fetched]` |
| 17 | Published supported-file-type list | Obsidian treats it as a support contract `[fetched]` |
| 18 | Duplicate file, reopen closed file | Trivial, universally expected `[fetched]` |

### 16.3 What no competitor has — the real differentiators

| Differentiator | Nearest thing anyone else has | Distance |
|---|---|---|
| Byte-preserving splice edits — every mutation is a span replacement, never a re-serialisation | Hubble.md regenerates the whole body, deletes reference links along with their visible text, and is not even a fixed point `[measured, §15]` | Categorical. No opened competitor claims byte preservation |
| Cross-engine degradation certification (`mdmax cert`, `--fail-on=BROKEN`) | None found in any opened source | Categorical |
| Typed evidence tiers `{value, source, tier, re_verify_cmd}` with a working linter | iA Authorship dims AI text and underlines other-human text `[fetched]` — presentation, not typed data | iA proves the need; nobody types it |
| Machine-write zones — fenced regions an agent may rewrite and outside which it may not, splice-enforced | Obsidian Bases writes derived *views*, never guarded regions `[fetched]` | Categorical |
| Document CI — 34 assert/break gate pairs, 725 assertions, 40 regression gates `[measured]` | GitBook has publishing CI ✱; nobody gates document *content* | Near-categorical |
| Every view is a deterministic reversible projection of one file | Obsidian Bases stores views in `.base` files or embedded code blocks `[fetched]` — still a second artifact | Bases is the competitive answer. Ship before it becomes the default expectation |
| Token-budget meter per agent-facing file | None found | Categorical |
| Staleness / drift detection over 2,382 baseline files, >15% alert | None found | Categorical |
| Section-level restore with no silent expiry | JetBrains' 5-day wipe is the named anti-pattern | Strong |
| Automations authored as documents (124 `SKILL.md` files) | Plugin marketplaces everywhere; nobody makes the automation format *be* the document format | Categorical — and it survives the settled no-marketplace constraint |

### 16.4 The honest v1 minimum

Tier 0 — already built, must be named, documented and regression-tested (near-zero cost): undo/redo · in-file find/replace · word count and read time · spellcheck · trash and restore · image paste and drop upload · templates and daily notes · backlinks and unlinked mentions · command palette · four view modes · focus mode · HTML and PDF export.

Tier 1 — must build, in this order:

| # | Item | Size |
|---|---|---|
| 0 | **Fix the three self-contradictions first** (§7.2): `mdmax/` is imported by zero product files while `docs/mdmax/PLAN.md` says "shipped"; there is no CI in a product that sells document CI; the shipped design system is not our design system `[measured]` | — |
| 1 | Search operators (`path:`, `file:`, `OR`, quoted, exclude) | S |
| 2 | Saved searches, including bookmarking a search | S |
| 3 | Sort and group controls on tree and Home | S |
| 4 | Multi-select → move / delete / set frontmatter field, routed through splice and the single review surface | M |
| 5 | Complete keyboard map, published as a `.md` file inside the vault | S |
| 6 | Table keybindings (row/cell select, insert, delete, align) | M |
| 7 | Attachment path policy: one rule, relative, `./`-prefixed, documented | M |
| 8 | PDF and print fidelity, plus an images-present regression test | M |
| 9 | Mobile read + light edit on the existing PWA | L |
| 10 | Rename with link rewriting | M |
| 11 | Autosave and crash-recovery promise, stated | S |
| 12 | Accessibility baseline: keyboard-only reachability, focus order, contrast | M |
| 13 | Supported-file-type list, published as a contract | S |

**Any one of the three self-contradictions in row 0, found by a first customer, costs more than every feature below it.**

Explicitly out of v1, and say so publicly: real-time multiplayer · comments · canvas · encryption · DOCX/EPUB · grammar check · writing goals · localisation · graph-view polish.

Anti-recommendations, each a founder-visible refusal:

- **No canvas or whiteboard.** Obsidian needed a new file format (`.canvas`, JSON Canvas) to do it `[fetched]`. A canvas is a tree-of-record by another name and breaks the settled "the file is the only source of truth" constraint.
- **No fuzzy duplicate detection.** Exact-hash duplicate *listing* is fine; similarity scoring is a probabilistic verdict on a user's own writing, inside a product whose pitch is determinism.
- **No own spelling dictionary.** iA bundles Hunspell only because Windows lacks a system service `[fetched]`.
- **No real-time multiplayer in v1.** It costs a CRDT layer that fights byte-preserving splices head-on, and CRDT sync is settled out.
- **No settings dial for anything with a defensible default** — reveal policy, attachment paths, export margins.
- **Do not publish a fidelity number in marketing before R0 lands** (§24 R0) `[measured]`, and **do not claim offline-first before the T0 gate passes** — two-device offline-edit convergence, zero loss, watched by a user `[measured]`.

Falsification: if a paying user in the first 20 cancels citing an item marked v2 or "never" above, that row is mis-tiered and the tiering must be re-run against churn reasons rather than parity counts.

### 16.5 Reconciling a full feature set with a simple surface

The constraint governs **surface area, not capability**. Four disposal routes; every v1 item lands in exactly one, and an item with no route does not ship.

| Route | Rule | What ships here, hidden |
|---|---|---|
| **Visible** — ≤7 permanent affordances | Earns pixels only if a first-time user needs it in session one | Four modes + `Cmd+E` · search field · file tree · right rail (Properties first) · sync chip · the three AI verbs (Accept / Discard / Try again) |
| **Invoked** — palette-only, zero chrome | Discoverable by typing, invisible otherwise. `Cmd+K` is the settings menu we never draw | Saved searches · sort and group · bulk operations · rename-with-rewrite · duplicate · reopen-closed · export formats · print · vault-wide replace (v2) · every keyboard command |
| **Ambient** — status bar or hover only | One line, no panel, no dot until it means something | Word count and read time (`N words · N min`) · doc-health count, which opens a panel only when non-green · token-budget meter · staleness · autosave state |
| **Contextual** — appears on the object, dies with it | Never persistent | Table controls on caret-in-table · image resize and align on selection · attachment actions on the embed · AI prompt at the cursor (`Space`) · per-hunk accept |

Specific hidings, each a decision with its anti-recommendation attached:

- **Search operators are typed, never a filter-builder.** No advanced-search modal, ever. Obsidian teaches them in one doc page `[fetched]`.
- **Bulk operations get no toolbar.** Multi-select in the tree plus `Cmd+K`. A bulk-action bar is the fastest route to looking like the project-management tool we settled against being.
- **Attachment path policy is a decision, not a setting.** Typora needed 8 sub-settings `[fetched]`; we ship one rule, with the escape hatch in the versioned settings *file*, not the UI.
- **The existing toggles list is the ceiling for the entire preferences surface** — spellcheck, focus mode, line numbers, vim, ghost text already share one list `[measured]`. Anything that wants an eighth toggle must displace one of the seven.
- **Accessibility is invisible by construction** — zero surface cost, and the only v1 item carrying legal exposure.
- **Mobile is a different surface, not a shrunken one.** Read, capture, light edit. Do not port the rail.
- **The keyboard map ships as a `.md` file in the vault** — the product documenting itself in its own format, with zero UI.

## 17. First run, activation and retention

**Activation = the first projection-mediated write to a Markdown file that frontmatter did not create.** One event, not two-part, measured against a 7-day window because 7 is the mode of time-bounded milestones in the only benchmark opened `[derived from fetched mode=7]`.

Why this act and not another:

| Property | Basis |
|---|---|
| It is the product thesis in a single act — the user edited through a projection and watched their own file change correctly | `[inference]` |
| It structurally entails the retention substrate: a file we did not create means the user pointed at their own corpus, and corpus presence is what makes session 2 happen | `[inference]` |
| It is movable by a solo founder with first-run copy, picker ordering and empty-state wording | `[inference]` |
| It can happen inside the first minute — milestones that take three sessions cannot be moved by design changes | `[fetched: "too late" failure mode]` |
| It has a falsifiable 2× test | `[fetched]` |

Rejected candidates and the named failure mode each hits: app launched or vault opened — "too early", the canonical mistake `[fetched]`; first note created in frontmatter — measures the sample, not the corpus `[fetched+inference]`; ran a degradation certification — proves engine quality, not personal value `[inference]`; published a site — "too late" `[fetched]`; N files across M sessions — "too complicated" and unmovable `[fetched]`.

Benchmarks, and why they do not transfer unmodified. Single opened source: Lenny Rachitsky and Yuriy Timen, "What is a good activation rate", 2022-10-25, n=500+ self-reported products `[fetched]`.

| Metric | Value |
|---|---|
| Definition | `activated / users who completed signup flow` |
| All products | mean 34%, median 25% |
| SaaS only | mean 36%, median 30% |
| "GOOD" / "GREAT" | 60th / 80th percentile |
| Time-bounded milestones | ~6% of products; median window 10 days, mode 7 days |
| Two-part milestones | ~10% |
| Valid-milestone threshold | activated users must retain **≥2×** non-activated |

frontmatter has no signup, so the benchmark's denominator does not exist; substituting first launch makes the denominator strictly larger `[derived: signup-completers ⊆ first-launchers, so activated/first-launchers ≤ activated/signup-completers]`. **Anti-recommendation: never publish or target "30% activation" for frontmatter — report `first-run completion rate` and `day-7 return rate` under those names.** Two further guardrails: the per-type "B2B prosumer SaaS" figure exists in that source only as an image and was never read `[measured]`; and no published quantitative abandonment study for note-taking apps was found at all, so any churn percentage quoted in marketing is quoting nothing `[measured]`. The circulating claim about what some share of Obsidian downloaders never do is refuted at source — obsidian.md and obsidian.md/about publish no download, user or install count, and the help corpus has no usage-statistics page `[fetched]`; it must not appear in any deck, page or PRD revision.

First-run flow, designed against the evidence. No email field, no OAuth wall, no network call required to reach step 5.

| # | Step | Basis |
|---|---|---|
| 1 | Launch lands on a folder picker with **"Open an existing folder" first and visually primary**, "Start a sandbox" second. Obsidian orders these the other way because its vault model forces it; we have no such constraint | `[fetched: OB offers exactly two choices, "Create new vault" / "Open folder as vault"]` |
| 2 | No walkthrough, no tour, no "What's New" modal | `[fetched: NN/g — tutorials "interrupt users, don't necessarily improve task performance, and are quickly forgotten"; push revelations "dramatically overused"]` |
| 3 | On folder open, show what was found as a status line — file count, which projections are available, which are not and why. **Never show a definitive empty state while the scan is still running** | `[fetched: NN/g names this the most damaging empty-state pattern]` |
| 4 | Every projection's empty state carries its own pull revelation: the board on a corpus with no status keys names the key it looks for, shows the exact line it would add, and offers one button that adds it to one file | `[fetched: NN/g guidelines 2 and 3]` |
| 5 | The activating act is a one-line in-place edit through a projection on a file the user already owns — drag one card, write one key. The write is a splice, the diff is shown, undo restores byte-identity | `[fetched: the praised ArcGIS counter-example required the user to *perform* the task]` |
| 6 | Show the byte-level diff of the very first write, once, inline — then never unprompted again | `[inference]` |
| 7 | Sandbox is a real folder of real `.md` files on disk, disposable, opened on demand from a persistent Help affordance, never auto-launched | `[fetched: Obsidian Sandbox vault + Linear's reset-on-refresh demo both satisfy the NN/g criteria — three unrelated sources converging]` |
| 8 | Segment implicitly by which door they opened, as Linear does with its admin/member and team-size splits. Corpus shape is the signal: dated files → calendar first; status-keyed files → board first; neither → reader | `[fetched + inference]` |
| 9 | Ship a copy-pasteable agent prompt so an AI coding agent can perform setup | `[fetched: Vercel's 3-step getting-started does exactly this]` |
| 10 | One first-run friction to design out explicitly: in Obsidian, clicking a folder then "new note" creates the note in the vault **root**, not the selected folder | `[fetched, observed: arXiv:2509.20187v1, n=7, 2025-09-24]` |

Retention mechanics, and the banned list:

- **Correctness is the retention mechanic.** One silent corruption ends the relationship permanently.
- **Templates are organization starters, not decoration** — the strongest supported recommendation here, because two unrelated sources land on it: the survey verbatim *"Metric spiked after introducing templates to choose from in the onboarding flow"* and the paper's *"starting from a 'blank page' might be overwhelming"* `[fetched ×2]`.
- **Serve the retrieval strategy** — the paper's central finding is that intended retrieval determines creation and organization behaviour, so search must be instant and exact-match-first `[fetched]`.
- **Let the content carry the cadence.** A calendar over the user's dated files pulls on their deadlines; a board pulls on their work. This is the opposite of a streak, which manufactures a cadence the content does not have.
- Near-zero re-entry cost: reopen exactly where the file was, no login, no sync spinner.
- Reversibility receipts on demand — surface the degradation certificate before a risky act (first write to a foreign vault, first cross-engine round-trip), never on a schedule.

Banned outright: streaks · badges · XP or levels · "you haven't opened X in N days" · red-dot unread counts · weekly digest (there is no email field, and adding one to enable a digest would be the single worst trade in this document) · note-count or graph-node vanity displays · first-launch tour · "What's New" modal `[fetched: NN/g names this pattern as harmful]` · artificial trial countdown · referral loop.

Instrumentation under implicit-telemetry-only — no identifiers, no event stream, no phone-home per action:

| Signal | Source | Answers | Cannot answer |
|---|---|---|---|
| Version-check requests per day per version | The update check the app already makes | Install-base trend; day-N return as `checks on day N+1..N+7 / checks on day N` | Anything per-user |
| `.frontmatter/state.json`, plain text, never transmitted | Local, user-deletable, documented | Everything for that user, and only when they paste it into a bug report | Any aggregate |
| Degradation certificates attached to bug reports | User-initiated | Which foreign vaults break, which projections were reached | Frequency — reporters self-select |
| Generator marker in published site output | The projection already writes the file | Count of installs reaching the furthest downstream act | Who, or how many tried |
| Docs page-hit ratios between consecutive pages | Docs server logs | Where the documented flow leaks | Whether they are users |
| Refunds and non-renewals | Billing | The only hard churn number available | Cause |

Test the 2× requirement as a **release** experiment, not a user experiment: change one first-run element, hold everything else, compare day-7 return between version cohorts `[fetched + inference]`. Anti-recommendation: do not add an anonymous opt-in analytics prompt at first run — it is a consent modal in the exact slot the empty-state research says destroys trust, it violates implicit-only, and the version-check denominator already yields the one ratio that matters.

## 20. Migration — what survives, what does not

Build order is `1 → 2 → 3`: Obsidian, Notion-zip, Evernote. Ship the verification report for Obsidian first — it is the only source where the report can honestly print `IDENTICAL` on nearly every row, which is how the report earns the standing to deliver bad news about Notion.

| # | Source | Vol | Feas | Score | Basis, proxies fetched |
|---|---|---|---|---|---|
| 1 | Obsidian | 4 | 5 | **20** | No conversion at all; the only 5 on the list |
| 2 | Notion (zip export) | 5 | 3 | **15** | 58 `notion`-label issues, 55 closed (94.8%) `[derived]`; `notion-to-md` 1,358,239 npm downloads in the window 2026-07-29→2026-08-27 `[fetched]`; $1,000 + $5,000 bounties `[fetched]` |
| 3 | Evernote (.enex) | 3 | 5 | **15** | DTD-defined, self-contained, base64 attachments inline — but `yarle` carries **85 open issues** `[fetched]` |
| 4 | Apple Notes | 5 | 2 | 10 | Highest bounty after the API job ($2,500, #15); no export format; macOS-only; iOS refused (#342, open since 2024-12-24) |
| 5 | Logseq | 2 | 4 | 8 | 78,308 B reference implementation to copy semantics from |
| 6 | Notion (API) | 5 | 1.5 | 7.5 | 253,994 B = **5.07×** the zip path `[derived: 253,994 ÷ 50,126 = 5.067]`; OAuth; 3 req/s ceiling |
| 7–13 | Bear · Roam · Confluence · OneNote · Google Docs · Word · Craft | — | — | 8→1 | Confluence's best OSS converter is **archived since 2021-06-24, 143 stars**; OneNote `.one` needs 150,662 B of parser including an LZX decompressor and a CAB reader; Craft #27 has been open 2 years 1 month with zero progress `[fetched]` |

Per-source fidelity, construct by construct. Classes: **SURVIVES** · **DEGRADES** (recoverable, not identical) · **LOST** (absent from the export itself) · **REFUSE** (we decline before starting).

Obsidian → frontmatter

| Construct | Verdict | Evidence |
|---|---|---|
| Note bodies, YAML frontmatter, tags | SURVIVES byte-identical | `[inference]` |
| `[[wikilinks]]`, `![[embeds]]`, `[[note#heading]]`, `[[note#^blockid]]` | SURVIVES as text; **resolution semantics are Obsidian-specific and must be certified, not assumed** | `[inference]` |
| Dataview / Templater / Bases queries | DEGRADES → inert code fences, listed explicitly | `[inference]` |
| `.canvas` files | REFUSE — JSON, not markdown | `[inference]` |
| Plugin-specific frontmatter keys | SURVIVES as data, LOST as behaviour | `[inference]` |
| `.obsidian/` config, attachment folder settings | LOST — not content | `[inference]` |
| Bare-CR line endings; zero-indent YAML sequences | REFUSE with a named reason, never silent repair | `[project-context, engine-known]` |

Notion (zip: PDF · HTML · Markdown & CSV) → frontmatter

| Construct | Verdict | Evidence |
|---|---|---|
| Page text, headings, lists, code | SURVIVES | `[fetched]` |
| Callouts | DEGRADES → HTML, rewritten to `> [!info]`; **icon and colour LOST** | `[fetched]` Notion: callouts export as HTML, "as there is no Markdown equivalent" |
| Databases | DEGRADES → one CSV + one MD per row page | `[fetched]` |
| Database **views** | LOST — only current or default view exports, "Exporting all views at once isn't supported" | `[fetched]` |
| Form views | **REFUSE** — cannot be exported at all | `[fetched]` |
| Comments, page and block level | **LOST** — present only in the HTML export, which we do not import | `[fetched]`; importer #311 open since 2024-10-09 |
| Relations / rollups / formulas | DEGRADES → last rendered text, stops updating | `[inference]`; the API path needs `formula-converter.ts` (19,397 B) and `database-helpers.ts` (43,237 B) `[fetched]` |
| Toggle blocks and toggle headings | DEGRADES, historically dropped children | `[fetched]` #469, #458 |
| Synced blocks | DEGRADES → duplication | `[inference]` `SyncedBlockRequest` is special-cased `[fetched]` |
| Nested table inside a list | **LOST silently — first column only** | `[fetched]` #216, open since 2024-02-29 |
| Numbered lists | DEGRADES → repeated `1.` | `[fetched]` #566 |
| Attachments and paths | DEGRADES — Windows MAX_PATH 260 breakage on nested subpage folders | `[fetched]` |
| Filenames | DEGRADES — Korean Unicode decomposition freeze (#348), trailing dot or space (#456), titles >255 chars lose data (#381) | `[fetched]` |
| Created / updated timestamps | LOST by default | `[fetched]` #478, #479 |
| Pages the exporting account cannot see | **REFUSE-gate** — silently absent, and Notion does not report how many | `[fetched]` |
| Export availability | **REFUSE-gate** — admins can toggle *Disable export*; workspace export takes up to **30 hours**; the link expires after **7 days** | `[fetched]` |

Evernote (.enex, ENEX 4.0 / ENML 2.0 DTD) → frontmatter

| Construct | Verdict | Evidence |
|---|---|---|
| Title, content, created, updated, tags | SURVIVES — the DTD is normative | `[fetched]` |
| Body markup | DEGRADES via HTML→MD; ENML is "a subset of XHTML… intentionally broadened" | `[fetched]` |
| Attachments | SURVIVES — `<data encoding="base64">`, inline | `[fetched]` |
| Attachment MIME range | Constrained to `image/gif`, `image/jpeg`, `image/png`, `audio/wav`, `audio/mpeg`, `application/pdf`, `application/vnd.evernote.ink` | `[fetched]` |
| Ink notes | LOST — no markdown target | `[inference from the fetched allowlist]` |
| `note-attributes` (geo, author, source-url, place-name, reminders, subject-date) | SURVIVES into frontmatter **if we map them**; `source-url` is a known drop | `[fetched]`; #48 open since 2023-08-07 |
| Internal Evernote note links | LOST/DEGRADES — the single most-reported defect | `[fetched]` yarle #653, #684, #655, #478, #209, #357 |
| Non-ASCII tags | **CORRUPTED in the leading converter** — Chinese characters skipped, accents skipped | `[fetched]` yarle #638, #637 |
| Notebook / stack structure | DEGRADES | `[fetched]` yarle #678, #540, #353 |
| Client-side encrypted text (RC2-64) | **REFUSE** | `[fetched]` yarle #632 |
| Hard caps | REFUSE-gate — content ≤ **5,242,880** chars, resource binary ≤ **25MB**, title 1–255 chars | `[fetched DTD]` |
| Tasks | SURVIVES — `task*` is in the DTD | `[fetched]` |

Remaining sources, compressed: **Apple Notes** — no export format at all; SQLite `NoteStore` plus protobuf attribute runs; tables and internal links survive, highlight colours degrade (the reference implementation substitutes emoji), HEIC/HEIF degrades (#497), password-locked notes and drawings REFUSE, iOS REFUSE (#342) `[fetched]`. **OneNote** — free-form canvas positioning has no markdown target and is LOST; ink degrades to an SVG approximation; the binary path costs 150,662 B `[derived]`. **Roam** — outline blocks survive, `((uid))` block refs degrade to links or embeds, `{{[[query]]}}` is LOST and was historically corrupted by the rewrite itself, and 17 Roam-only markup tokens are on an explicit scrub list `[fetched source]`. **Logseq** — the outline-to-prose de-indent alone is a dedicated 9,550 B module; block IDs, `key:: value` properties and `NOW/LATER` all need explicit mapping; queries and flashcards LOST `[fetched]`. **Confluence** — Normal HTML space export excludes blogs, inline comments and attachments; Word export includes "only the first 50 attached images" and opens only in Microsoft Word; drafts are never exported; the export needs the *Export Space* permission `[fetched]`. **Google Docs, Microsoft Word, LibreOffice, Craft** — not supported, and the reason is measured: 47 of 58 open issues in the largest markdown-importer ecosystem (81% `[derived]`) are requests for formats with no importer at all, the oldest being Craft #27 at 2 years 1 month `[fetched]`.

The pre-flight refusal contract — shown as a blocking screen per source, before any file is read, with counts where the export permits counting and the literal word "unknown" where it does not.

Universal, every source: comments and discussion threads do not survive · revision and version history does not survive · permissions and sharing state do not survive · anything the exporting account cannot see is silently absent and **no export reports how much was withheld**, so our count is a count of what we received, not of what you own · formulas, rollups, queries and live embeds arrive as their last rendered text and stop updating.

**Obsidian, before starting:** `.canvas` is not markdown and will not be converted; Dataview/Templater/Bases blocks become inert text; plugin behaviour does not transfer, plugin frontmatter keys do, as data. **Everything else should be byte-identical, and if any file is not, the report names it and the byte offset — that is the promise the report exists to keep.** **Notion, before starting:** one view exports, the rest are gone; Form views cannot be exported at all; callouts lose icon and colour; the export can take up to 30 hours and the link expires in 7 days; if your admin has toggled *Disable export* there is nothing we can do from our side; on Windows, export with *Create folders for subpages* off. **Evernote, before starting:** RC2-64 encrypted note text cannot be decrypted and those notes are listed and skipped; ink has no markdown representation; notes over 5,242,880 characters and resources over 25MB are outside the format's own limits; internal note links are the most fragile construct and we report resolved/unresolved counts rather than guessing; non-ASCII tags are where incumbent tools corrupt data, and we list every tag we alter. **Apple Notes:** macOS only, Full Disk Access required, locked notes unreadable, drawings lost. **Confluence:** blogs, inline comments and attachments excluded; 50-image cap on Word; drafts never exported. **OneNote, Google Docs, Word, Craft:** we do not support these — say it on the pricing page, not after the upload.

Anti-recommendations: do **not** build the Notion API importer first (5.07× the code, plus OAuth, a 3 req/s ceiling, cursor invalidation and documented per-run non-determinism where 1.8.1 loaded a different page list than 1.8.0) `[fetched]`; do **not** build Craft, Google Docs, Word or LibreOffice importers; do **not** parse the `.one` binary; do **not** promise comment migration for any source; do **not** ship "Notion databases → boards" as a launch feature, because a projection from a lossy single-view CSV is a projection of a lie; do **not** let the report be a summary — per-construct counts or it is not a verification report; and do **not** auto-repair the source, because silently normalising input to make it importable destroys the byte-preservation claim outright.

## 48. Longevity and the shutdown promise

The internal bar, adopted verbatim: *"A self-guaranteeing promise is verifiable and non-reversible. It does not require you to trust anyone."* `[fetched, stephango.com/self-guarantee, 2024-12-03]`.

| # | Promise | Mechanism | Revocable | Rank |
|---|---|---|---|---|
| 1 | Plain files in folders the user chose | filesystem | No, for files already written | self-guaranteeing |
| 2 | No proprietary sidecar carrying meaning | `ls` + delete test | No | self-guaranteeing |
| 3 | Byte-preserving splice | hash → edit → diff | No — falsifiable per release | self-guaranteeing + measurable |
| 4 | Views are pure projections | delete-the-app test | No | self-guaranteeing |
| 5 | Published versioned format subset + test corpus | a document; copies persist | Updates can stop | durable, weak |
| 6 | Cross-engine degradation certificate | published report | Only as honest as the disclosed engine matrix | strong, auditable |
| 7 | Open-source file engine | licence grant, irrevocable for released versions | No — shipped versions only | durable |
| 8 | Delayed-open-source licence (FSL 1.1 → Apache-2.0 or MIT at two years; BUSL 1.1 at the Change Date or the 4th anniversary, whichever is first) | automatic future grant, per version | No — fires with nobody acting | durable, code only |
| 9 | Source escrow | third-party contract | Beneficiary-limited | weak |
| 10 | Export guarantee in the ToS | policy | **Yes** | weak |
| 11 | Foundation or governance structure | corporate form | **Yes** | weakest |

**In every documented notes-app shutdown, the format was readable; what destroyed data was the deadline and the notice, never the encoding** `[inference over fetched cases: Catch.com 2013-08-30, Springpad 2014-06-25, Vesper 2016-08-30, Skiff 2024-02-09]`. The two counter-cases are the only ones where something a user relied on still executes: `omnivore-app/omnivore`, AGPL-3.0, not archived, 16,225 stars, last commit **2026-08-28T12:19:30Z**, and `standardnotes/app`, AGPL-3.0, 6,608 stars, last commit 2026-08-25T23:07:42Z `[measured, read 2026-08-29T00:10Z]`.

The public commitment — exact wording. Publish at a versioned, dated URL **outside** the Terms of Service, append-only, with every prior version left live.

> **The frontmatter durability commitment — v1, 2026-08-29**
> *This document is versioned and append-only. Every prior version stays published at its own URL. We do not edit it in place.*
>
> **What we promise, and how you check it without us**
>
> 1. **Your notes are ordinary UTF-8 text files in folders you chose.** There is no database, no index you need, and no sidecar file that carries meaning. *Check:* quit frontmatter, delete every file in the folder that is not one of your notes, reopen the folder in any editor. Nothing of yours is missing.
> 2. **Every view is a projection of the file.** Board, calendar, decision card and published site are computed from your text and stored nowhere else. *Check:* delete the app.
> 3. **Every edit is a byte-preserving splice.** We change the bytes you asked to change and nothing else. Line endings, indentation, key order, trailing whitespace, and a leading byte-order mark survive an edit that did not touch them. *Check:* hash the file, change one field, diff.
> 4. **We publish the exact Markdown and YAML subset we read and write**, versioned, with the test corpus that defines it. When it changes we publish the diff, not a changelog entry.
> 5. **We certify degradation rather than assume it.** Each release ships a report of what a named set of other engines does to a file we wrote, and exactly where information is lost. We publish the failures.
> 6. **There is no lock on the way out because there was never a way in.** No import. No export. Only the folder.
> 7. **If we stop:** the last released desktop client keeps working offline; we publish the source of the file engine — parser, splicer, and projections — under an Apache-2.0-converting licence within 90 days of announcing a shutdown; and any hosted service gets 12 months' notice before it stops.
>
> **What we do not promise**
>
> - We do not promise this company will exist in ten years.
> - We do not promise this app will run on a future operating system.
> - We do not promise your files render identically in other tools. CommonMark is still at version 0.31.2, dated 2024-01-28. YAML's own Library of Congress format description records that implementations validate differing subsets. We promise a certificate of what differs, not that nothing differs.
> - We do not promise Markdown is an archival standard. It is not named in the Library of Congress Recommended Formats Statement; plain text appears there only in the Acceptable column.
> - We do not promise that the hosted parts — sync, publish, collaboration — survive the company. Those are services. Your files are not.
> - We do not promise a fixed price forever, a perpetual licence to future versions, or a data escrow.
> - We do not promise to keep any third-party tool, integration, or engine working.
> - We do not promise features. This document is about durability only.

Drafting rules, enforced at review: every clause names a test the reader can run without us; no clause uses *forever*, *always*, *guaranteed* or *never*; the document is dated, versioned, and lives outside the terms, because terms are revocable and this must not be.

The evidence under the "what we do not promise" block, so no one softens it later: the LoC Recommended Formats Statement contains `markdown` 0, `commonmark` 0, `YAML` 0, `plain text` 2, and lists plain text as *Acceptable* alongside RTF and proprietary word-processor formats, below HTML and DOCX `[measured, archive snapshot 20260626211847]`; the LoC format registry has 595 entries, zero for Markdown, and one for YAML (`fdd000645`, last significant update 2025-06-02) `[fetched]`. That same YAML description calls it an open standard *and* records that concerns "have led to the development of YAML alternatives, such as YAML parsers that only validate a restricted subset" — a source that disagrees with itself, preserved rather than resolved `[fetched]`. CommonMark has published versions back to 0.13 (2014-12-10) and is still 0.x after ten years `[measured]`. The canonical obsolescence case is WordStar (`fdd000552`): mostly ASCII, first shipped September 1978, and its pre-5.0 releases used the high bit of ASCII characters to store formatting, so the files "may appear as gibberish" under typical encodings `[fetched]`. What we may honestly cite from preservation guidance is narrow and real: UTF-8 is top-Preferred, and the no-DRM / no-encryption requirement is satisfied by construction `[measured]`.

Anti-recommendations, each one a promise to refuse:

- **Never claim archival-institution endorsement of Markdown.** Zero occurrences in the RFS, zero descriptions in a 595-entry registry `[measured]`. One search refutes it and takes the trust position down with it.
- **Never say "open source" without naming licence, repository, scope and trigger.** Skiff's unscoped claim became the story on shutdown day, when the Discord and the GitHub repo were removed on announcement day `[fetched, partisan primary source]`.
- **Never promise source escrow** (release frequency is unmeasured, and a consumer product cannot name every beneficiary) and **never promise a dead-man's-switch open-sourcing** — after insolvency an administrator controls the IP and the promisor no longer exists. If that outcome is wanted, ship under a licence that already contains the future grant.
- **Never adopt Elastic License 2.0 as a hedge.** It contains no conversion clause `[fetched]`; it protects the vendor, not the user.
- **Never market GDPR Art. 20 as a feature.** It mandates no format, covers only data the subject provided under consent or contract by automated means, and claiming it invites the accurate reply that it is mandatory `[fetched]`.
- **Never state a migration or export window.** The correct claim is that no window can exist, because the files were never held.
- **Never open-source the whole product as the hedge.** Given the settled no-marketplace and no-client-side-execution positions, scope clause 7 to the file engine only; a narrow promise is one you can keep, and a broad one gets quietly dropped, which is worse than never making it.
- **Never reuse the commitment URL.** Version and date each revision and keep the old ones live, so any weakening is visible.

Open items this section does not settle, flagged rather than smoothed: OAIS (ISO 14721 / CCSDS 650.0-M-2) was **not opened** — no OAIS claim may be published from this section `[measured]`; the EU Data Act (Regulation (EU) 2023/2854, applying from 12 September 2025, with the Art. 3(1) obligation from 12 September 2026) rendered only at recital level, so whether a local-file editor with optional sync falls inside Chapter VI is unresolved, though a hosted sync or publish service sold in the EU plainly is in scope `[fetched + inference]`; and GitHub could not resolve an SPDX identifier for Joplin (`NOASSERTION`, 56,143 stars) or Anytype (`NOASSERTION`, 8,715 stars), so neither may be cited as an open-source hedge without reading their LICENSE files first `[measured]`.
