## 94. The complete feature inventory

Every feature the record has ever described, deduplicated, in one place. Nothing here is invented; where the record names a thing twice I have merged it and said so, and where one name hides two separable builds I have split it. **Omission is the failure mode**, so borderline items are listed rather than curated away.

**Legend.** `∅` = already exists in `src/` today (cost is naming, documenting, regression-testing — not building). Sizes XS ≈ 1 pt, S ≈ 2, M ≈ 4, L ≈ 8, XL ≈ 16, per §28's own scale (1 pt ≈ 1.09 calendar days). "Engine-dep?" = does it require MDMAX splice/cert work to be correct. "Evidence" must be a real observed signal or the word **NONE** — roughly half this table is NONE, and that column is the most useful one here.

### Editor

| # | Feature | What it does | Lane/§ | Eng? | Evidence it is wanted | Size |
|---|---|---|---|---|---|---|
| 1 | Four view modes + `Cmd+E` | Source / preview / split / focus, one cycle key | §16.4 T0 | No | NONE | ∅ |
| 2 | Command palette, `#`/`@`/`:` goto | Type-to-reach everything with no chrome | §13 L0 | No | TY "Open Quickly" [fetched] | ∅ |
| 3 | Full-text vault search | MiniSearch over title/tags/body/code, 3-pass AND→OR→fuzzy | §33.3 | No | Universal | ∅ |
| 4 | Search operators | `path:` `file:` `OR`, quoted phrase, exclusion | §16.4 T1.1 | No | OB documents a whole operator language [fetched] | S |
| 5 | Saved searches | A search becomes a bookmarkable object | §16.4 T1.2 | No | OB: search is 1 of 7 bookmarkable types [fetched] | S |
| 6 | Bookmarks / pins | Pin files; group and reorder | §16.1 | No | BE pin-notes [fetched] | ∅ |
| 7 | Sort + group controls | Tree and Home by name, mtime, ctime, frontmatter field | §16.4 T1.3 | No | NONE | S |
| 8 | Backlinks + **unlinked mentions** | Two collapsible panels; finds links you didn't make | §16.1 | No | OB frames it as discovery [fetched] | ∅ |
| 9 | Graph view | Node/edge map of the vault | §16.1 | No | 3,848 nodes internally [measured] | ∅ |
| 10 | Tag browse | List and filter by tag | §16.1 | No | BE gives tags 5 FAQ pages [fetched] | S |
| 11 | Tag rename / merge / nest | Bulk tag operations through splice | §16.2 #14 | **Yes** | NONE (tags ×17 in PRD, ops 0) | M |
| 12 | Undo/redo across mode switch | History survives switching projection | §16.1 | No | Named only in the risk register [measured] | ∅+S |
| 13 | Find/replace **in file** | CodeMirror search panel | §16.1 | No | SY 3, AF 4 issues titled "find and replace" [measured] | ∅ |
| 14 | Find/replace **across vault** | Multi-file replace routed through splice + review | §16.1 v2 | **Yes** | An open ask inside mature SiYuan [measured] | L |
| 15 | Published keyboard map | A `.md` file in the vault listing every command | §16.4 T1.5 | No | OU 25 issues titled "keyboard shortcut" [measured] | S |
| 16 | Shortcut remapping | User rebinds keys | §16.1 v2 | No | TY ships "Change Shortcut Keys" [fetched] | M |
| 17 | Table keybindings | Row/cell select, insert, delete, align | §16.4 T1.6 | Partial | TY, iA and BE each ship dedicated table keys [fetched] | M |
| 18 | Multi-cursor, folding, zen | Standard heavy-editing affordances | §13 L0 | No | iA ships folding Windows-only — hard, not unwanted [inference] | ∅ |
| 19 | Focus mode / typewriter | Dims everything but the active line | §16.1 | No | iA's oldest differentiator [fetched] | ∅ |
| 20 | Autosave + crash recovery | IndexedDB + localStorage dirty index, promised in words | §16.1 | No | Universal | ∅+XS |
| 21 | Paste as markdown / plain | Two paste modes | §16.1 | Partial | TY `Cmd+Shift+V` / `Cmd+Shift+C` [fetched] | S |
| 22 | Word count + read time (**CJK-aware**) | `N words · N min` in the status bar | §16.1 / R0.8 | No | OB shipped CJK counting specifically [fetched]; ours undercounts 20× on Chinese [measured] | ∅+M |
| 23 | CJK search tokenizer | ~15-line bigram passed to index and query | §33 S2 / R0.8 | No | CJK-only recall 20.0% today, 100% with a tokenizer [measured] | M |
| 24 | Diacritic folding | Latin-scoped fold + `ß→ss` map | §33 S3 | No | `cafe`→`café` misses today [measured] | S |
| 25 | Spellcheck | Browser-native toggle only | §16.1 | No | NONE | ∅ |
| 26 | Trash + restore | Soft delete with a restore path | §16.1 | No | Delete-with-no-undo is a top churn cause [inference] | ∅ |
| 27 | Multi-select → bulk move / delete / set field | Tree selection, actions via palette, routed through splice | §16.4 T1.4 | **Yes** | BE documents selection gestures purely to enable bulk export [fetched] | M |
| 28 | Rename with link rewriting | Rename a file, fix every inbound link | §16.4 T1.10 | **Yes** | NONE | M |
| 29 | Duplicate file / reopen closed file | Two trivial, universally expected commands | §16.2 #18 | No | TY ships both [fetched] | XS |
| 30 | Image paste / drag-drop upload | Attachments land in the vault | §16.1 | No | Universal [fetched] | ∅ |
| 31 | Attachment path policy | **One** rule: relative, `./`-prefixed, documented | §16.4 T1.7 | Partial | TY needed 8 sub-settings for this [fetched] | M |
| 32 | Published supported-file-type list | The support contract, as a page | §16.4 T1.13 | No | OB treats the list as a contract [fetched] | S |
| 33 | Tabs / split panes | Multiple documents at once | §16.1 | No | TY New Tab is macOS-only [fetched] | S |
| 34 | Accessibility baseline | Keyboard reachability, focus order, contrast, AA token fix | §16.4 T1.12 / R0.10 | No | Legal exposure selling into EU/US orgs [inference] | M |
| 35 | Localisation | UI in more than English | §16.1 v2 | No | iA ships 10 languages [fetched] | L |
| 36 | Properties panel | Typed frontmatter editing, splice-backed | §7.1 | **Yes** | Deterministic-structure plugins: 2,019,220 installs [measured] | ∅+S |
| 37 | Templates + daily notes | Starters, not decoration | §17 | No | Two unrelated sources: onboarding-template metric spike + blank-page finding [fetched ×2] | ∅ |
| 38 | Per-note lock / encryption | Password or biometric on one note | §16.1 v2 | No | BE monetises exactly this [fetched] | L |
| 39 | Ripgrep exact/regex fallback | Native scan, no index, no staleness | §33 S5 | No | 74 MiB in 1.24 s [measured] | S |

### Engine

| # | Feature | What it does | Lane/§ | Eng? | Evidence | Size |
|---|---|---|---|---|---|---|
| 40 | Frontmatter splice writer | Locate value bytes, replace only those | §7.1 | Yes | 8,513 files, 0 corruption, 0 throws [measured] | ∅ |
| 41 | Refusal as a typed value | `Result<T>` union, 9 refusal kinds, each carrying its operand | §80.4 | Yes | An 83% refusal rate ran silently because refusal `return src` is indistinguishable from a no-op [measured] | M |
| 42 | **NF-1** zero-indent sequence | `- x` at column 0 under a mapping key | R0.1 / E1 | Yes | 83% of foreign vaults refuse on this [measured] | M |
| 43 | **NF-3** bare-CR fence | Lone `\r` prepends a second frontmatter block — set-destructive | R0.3 | Yes | Set-destructive and invisible to a round-trip oracle [measured] | M |
| 44 | NF-2 flow-seq `]` at column 0 | Third lexer-leak case | R0.2 | Yes | NONE | S |
| 45 | **NF-4** key addressability | Quoted / Unicode keys become a path type, not a `SAFE_KEY` string | R0.4 / §75 | Yes | NONE — blocked on an NFC/NFD decision, not on code | L |
| 46 | Two-phase lexer + block recognizer | Kills the D1–D4 class instead of four `if`s | §72.2 | Yes | Same bug wearing four hats [measured] | M |
| 47 | Body-span splice | Every render write-back and every AI edit to prose | §72 E3 / §76 | Yes | Without it the render lane is read-only forever [inference] | L |
| 48 | Durable anchors | `{path, spanHash, contextHash}`; RELOCATED flagged, ambiguity refused | §72 E4 / §77 | Yes | AI edits rot between sessions otherwise [inference] | L |
| 49 | Construct detectors (19) | Byte ranges + skip mask; 6 known defects | §7.1 / R0.7 / E6 | Yes | 6 of 19 carry `provenance: invented` [measured] | M |
| 50 | Shape gate, **wired** | 4 MB / 200k lines / strict UTF-8, refuse never repair | §7.1 SEAM 1 | Yes | `WIKILINK_RE` took 36,865 ms on 320 KB before it [measured] | ∅+S |
| 51 | Branded offsets + `OffsetMap` | Mixed-unit call is a compile error | §7.1 | Yes | 93.8% of corpus files diverge bytes vs UTF-16 [measured] | ∅ |
| 52 | Lenient frontmatter pre-pass | Reader-only correction; never writes | §7.1 | Yes | 170/907 blocks invalid YAML = 18.74% [measured] | ∅+S |
| 53 | Placement safety | Refuses inserts that would create a setext heading | §7.1 | Yes | Blank-line isolation does not fix it [measured] | ∅ |
| 54 | Degradation certificate | Block × engine matrix, PASS/STRIP/CORRUPT/VOID, JSON sidecar | §7.1, §73 | Yes | Categorical — no opened competitor claims it | ∅ |
| 55 | `mdmax/fold@1` equivalence | Named, versioned fold so a PASS is auditable | §73.2 | Yes | 43.71% → 4.28% strict-vs-folded [measured] | ∅+S |
| 56 | Continuous certificate | Degradation shown at author time, not audit time | §72 E5 | Yes | NONE | M |
| 57 | Vault-level engine ops | Bulk publish, backlink index, vault search over the engine | §72 E8 | Yes | NONE | M |
| 58 | Streaming / chunked scan | Large files without a memory cliff | §72 E9 | Yes | ~130 ms reparse at 1 MB, over the 100 ms budget [derived] | S |
| 59 | Public API barrel + purity gate | 31 symbols of 88; P1–P4 checks incl. a denominator floor | §80.2–80.3 | Yes | A gate that scans nothing passes perfectly [measured] | M |
| 60 | Executable CLI (`npx mdmax`) | Extensioned specifiers, `bin` entry, JS-six default | §73.3 rank 0 | Yes | Unrunnable at HEAD (`ERR_MODULE_NOT_FOUND`) [measured] | XS |
| 61 | Property-based byte-identity tests | N random files × N random edits, every untouched byte unchanged | §78 / E2 | Yes | Catches the "helpful" normalization someone adds in month six [inference] | M |
| 62 | Vendor `@lezer/markdown` | Own the fork; incremental reparse is a requirement | §9.1 / §79 | Yes | 147 stars, single maintainer, repo relocated [fetched]; 3.58× incremental [measured] | M |
| 63 | Preview conformance fix | `remark-breaks` becomes a declared deviation or is dropped | §9.1 | Yes | App pipeline scores 67.3% CommonMark vs 76.4% bare [measured] | S |
| 64 | Non-JS engines in the bench | cmark-gfm, goldmark, pulldown-cmark as an independent offset oracle | §9.1 | Yes | Bench is 6/7 JS and measures 4 distinct parsers [measured] | M |
| 65 | Document CI | Corpus gate, arch report, spec harness, byte-ceiling budget | R0.5 / E2 | Yes | Four gates in this repo already reported green while blind [measured] | S |

### AI

| # | Feature | What it does | Lane/§ | Eng? | Evidence | Size |
|---|---|---|---|---|---|---|
| 66 | Transformation verbs on a selection | Summarise, expand, restructure, translate, register, to-table | §11.2 r1 | Yes | Bing Copilot, 200k conversations: information work dominates [fetched] | M |
| 67 | Frontmatter key fill and repair | Tags, status, dates, typed links | §11.2 r2 | Yes | Structure bucket = 2,019,220 installs, won by deterministic tools [measured] | S |
| 68 | Agent edits as suggestions | `land()` → review loop; nothing auto-applies | §11.2 r3, §12 | Yes | `realclaudian` is #13 of 7,058 plugins; users file "Improve Agent Mode review and consent controls" against the leader [measured/fetched] | L |
| 69 | Q&A with byte-anchored citations | Every answer carries the ranges it came from | §11.2 r4 | Yes | ChatPDF: 0.1 queries/registered user/day — signup scale, not habit [derived] | M |
| 70 | Structure repair as a proposed diff | Deterministic 80% first, AI only for the rest | §11.2 r5 | Yes | OB Linter: 112,395 installs, no AI [measured] | M |
| 71 | Scoped multi-doc synthesis | Explicit N files, never "the vault" | §11.2 r6 | Partial | Gemini Notebook caps itself at 50 queries/day [fetched] | M |
| 72 | Voice capture to inbox | ASR → typed capture document | §11.2 r7 | No | Tiny in-vault (46,478); two companies left the document to chase it [fetched] | M |
| 73 | "Try harder" | One deterministic rung up, cost delta shown first | §15.2, §62.4 R3 | No | NONE (7 rungs exist internally) | S |
| 74 | Cost meter in currency | Per-action price, never a tier word | §15.2, §62.4 R2 | No | NONE | S |
| 75 | Edit-survival telemetry | Accept/reject/edit-distance, local, deletable | §15.2 | No | Strong Acceptance ceiling 49.08% is the only published figure [fetched] | M |
| 76 | Who-wrote-this provenance | Hover chip from `.frontmatter/trace.jsonl` | §15.2, §62.1, §74.1 #3 | Yes | iA Authorship is the only competitor analogue [fetched] | M |
| 77 | Typed evidence tiers | `{value, source, tier, re_verify_cmd}` chips with a linter | §16.3 | Yes | Categorical — iA proves the need, nobody types it | M |
| 78 | Numeric-provenance linter | Every number in a derived artifact must exist in a source | §15.2 | No | NONE | S |
| 79 | AI disclosure block | C2PA-shaped frontmatter keys, projected at publish only | §42, §74.1 #3 | Yes | Regulatory forcing function [fetched] | M |
| 80 | BYO API key custody | User's own model keys, held safely | §6.7 DEV-PLAN | No | OB ships a Keychain for plugin API keys [measured] | M |

### Renders

| # | Feature | What it does | Lane/§ | Eng? | Evidence | Size |
|---|---|---|---|---|---|---|
| 81 | Kanban board | `status:` as columns; drag = splice | T2, §5 | Yes | Projection plugins out-install all AI 7.25× [derived] | L |
| 82 | Calendar | Dated files as a month/week grid; drag = splice `date:` | T2 | Yes | Same cohort [derived] | M |
| 83 | Decision card | ADR/RFD rendered as a card | T2, §14.2 | Yes | NONE | M |
| 84 | Table / dashboard render | Frontmatter across files as a grid | T2 | Yes | Dataview: 4,857,171 downloads [fetched] | L |
| 85 | `fm-query` (Lane A) | Declarative, non-Turing, read-only vault query | §9.2 A | Yes | The only real loss from banning eval, and it needs no eval [inference] | L |
| 86 | Bundled renderers (Lane B) | mermaid, chart.js, leaflet at fixed vocabulary | §9.2 B | No | mermaid 15.3M/wk, chart.js 12.9M/wk [fetched] | M |
| 87 | Server compute (Lane C) | Quarto/jupytext out-of-process, per-doc opt-in | §9.2 C | Partial | Only 4.03% of 1.16M notebooks reproduce [fetched] | XL |
| 88 | Render carrier | `> [!kind]` callout for prose, fence for data | §8, §9 | Yes | An unclosed fence swallows a document; a callout has no closer [measured] | S |
| 89 | Canonical doc profiles | MADR, Gherkin, OpenAPI, Keep-a-Changelog, SRE postmortem, RFC, runbook | §14.2 | Partial | OpenAPI + Gherkin have fetched machine-readable schemas [fetched] | L |
| 90 | Spec-lane viewer | Render `openspec/`, `.kiro/specs/`, `AGENTS.md`, `CLAUDE.md` others already write | §14.1 | No | 623,296 indexed convention files; OpenSpec 464,621 npm/wk [measured] | M |
| 91 | Machine-write regions | `<!-- fm:generated -->` zones an agent may rewrite and outside which it may not | §15.2, §16.3 | Yes | Categorical — OB Bases writes views, never guarded regions [fetched] | M |
| 92 | Slides (Marp) | Deck projection of the same file | §9 emit | Partial | NONE | M |
| 93 | PDF + print fidelity | Paper size, page breaks, header/footer, metadata, images-present test | §16.4 T1.8 | No | OU 14 "export pdf" issues, top hit *missing images*; DM 64 "export" [measured] | M |
| 94 | HTML export | Static single-file output | §16.4 T0 | No | NONE | ∅ |
| 95 | DOCX / EPUB / RTF / LaTeX | Shell out to Pandoc | §16.1 v2 | No | BE and TY both gate the export matrix behind Pro [fetched] | M |
| 96 | Export gates | Measure rendered pixels: collision, overflow, clipping | §15.2 | No | Our own PDF/HTML path has none today [measured] | M |

### Sync and trust

| # | Feature | What it does | Lane/§ | Eng? | Evidence | Size |
|---|---|---|---|---|---|---|
| 97 | Git three-way merge sync | Merge against the stored true base, never a diff against the winner | §31, T0 | Partial | Settled; CRDTs interleave (arXiv 2305.00583) [fetched] | XL |
| 98 | Splice journal + fold oracle | Append-only record; `fold(journal, base) == working` must hold | §31.2, SEAM 5 | Yes | The journal is a checkable derivative, never authority | L |
| 99 | Compare-and-swap upload | Server-authoritative version check | §31.2 | No | Notion's own `/saveTransactions` is CAS + fanout [fetched] | M |
| 100 | Conflict inbox / three-pane UI | Divergence as reviewable hunks; conflict copy holds your bytes | T0, DEV-PLAN 7.9 | Yes | "Never silently lose my work" rated **Absolute** demand [record] | L |
| 101 | Sync chip | One-line status, no dot until it means something | T0 | No | NONE | S |
| 102 | Named-version history | User-labelled points in git history | T0 | No | NONE | M |
| 103 | Local history + section restore | Restore one section to a prior sha, byte-identical elsewhere | T0 | Yes | JetBrains' 5-day wipe is the named anti-pattern | M |
| 104 | Since-you-last-opened banner | What changed while you were away | T0 | No | NONE | S |
| 105 | Background auto-sync | Pull/push without a button | T0 | No | OB Sync is $4–8/user/mo [fetched] | M |
| 106 | Whole-vault backup | **Explain git; do not build** | §16.1 | No | BE has a dedicated backup-restore FAQ [fetched] | XS |
| 107 | Locked sections / freeze | A region humans and agents both bounce off | §15.2, §62.4 R5 | Yes | NONE | S |
| 108 | Doc Health | Deterministic checks only: broken link, broken anchor, dup heading, expired `verified.until`, stale citation | §15.2 | Partial | 2,382 baselines internally; categorical vs competitors | M |
| 109 | Frontmatter schema contract | `fm lint --schema`, user-declared, enforced in editor and CI | §15.2 | Partial | 203 notes / 0 errors / 94 warnings internally [measured] | M |
| 110 | Proven-non-vacuous badge | A check with no recorded failing fixture renders *unproven*, not green | §15.2 | No | 40/40 internal gates carry the proof [measured] | S |
| 111 | Tamper-evident AI-edit export | Hash chain over the provenance ledger | §15.2, §15.5 | No | No vendor in an 11-row observability table sells this [fetched] | M |

### Publishing

| # | Feature | What it does | Lane/§ | Eng? | Evidence | Size |
|---|---|---|---|---|---|---|
| 112 | `publish` / `unpublish` | One control-plane row, one immutable R2 render | DEV-PLAN §4.9 | Partial | NONE | L |
| 113 | Immediate provable revocation | Redis `DEL` before commit, R2 purge, verified 404, residual-risk field | DEV-PLAN §4.9 | No | A one-person company must not imply it can un-publish the internet | M |
| 114 | Custom domains + wildcard TLS | Publish under the user's own host | DEV-PLAN §8.8 | No | NONE | M |
| 115 | Publish gate on the certificate | No construct carrying DESTROY may publish | SEAM 8 | Yes | Front matter LEAKs in 23 of 24 bench configurations [measured] | S |
| 116 | llms.txt v2 + markdown twins | `rel="alternate" type="text/markdown"` on every page | §10.1 EMIT | No | Chrome Lighthouse audits for it [fetched] | S |
| 117 | Generator marker | The only install-count signal under implicit telemetry | §17 | No | NONE | XS |
| 118 | AEO linter + quality gates | Publish-time content checks | L4, §28 GTM | No | NONE | M |
| 119 | Post-as-document | Publish a document straight to a social surface | §28 GTM | No | LinkedIn cannot post PDF through the current integration; the entitlement probe is **still unrun** [measured] | M |
| 120 | Public web checker | Paste a file, see the block × target matrix | §73.3 r2 | Yes | 4.1 ms/file JS-only — a request is free [measured] | M |
| 121 | GitHub Action (`--fail-on=BROKEN`) | Document CI inside someone else's repo | §73.3 r3 | Yes | 94.25% of real files carry a BROKEN block — must ship baselined [measured] | M |

### Protocol / agent-facing

| # | Feature | What it does | Lane/§ | Eng? | Evidence | Size |
|---|---|---|---|---|---|---|
| 122 | MCP server | `land` · `search-vault` · `read-slice` · `splice-edit` · `cert-check` | T3, §10.2 | Yes | MCP went stateless July 2026; tools are the common denominator [fetched] | L |
| 123 | `land()` protocol | Path identity, `patch`/`rewrite` modes, `base_version` read-before-patch | §12 | Yes | "It made a new artifact instead of updating mine" is the #1 documented failure [fetched] | L |
| 124 | Review surface | Every change — human, agent, sync — arrives as a word-grain hunk | §13 | Yes | Per-hunk accept is the most-demanded feature in AI editors; Cursor and Windsurf both got burned regressing it [fetched] | L |
| 125 | Suggest mode | A role with **no byte-writing code path** | §13 | Yes | Google's public API cannot create suggestions at all [fetched] | M |
| 126 | Orphan-visible anchoring | Quote preserved, re-anchor offered, never silently deleted | §13 | Yes | Word deletes orphaned comments; Docs orphans opaquely [fetched] | M |
| 127 | CriticMarkup / pandoc interchange | Track-changes in and out | §13 | Partial | NONE | M |
| 128 | `certify_markdown` MCP tool | Summary + non-PASS cells + pointer (never the whole cert) | §73.3 r1 | Yes | Full cert is 24.4× source size [measured] | S |
| 129 | Typed RPC HTTP API | 29 endpoints, RFC 9457 errors, idempotency keys | DEV-PLAN §4 | Partial | NONE | XL |
| 130 | PATs, API keys, webhooks | Third-party access with ≤5s revocation | DEV-PLAN §4.3 | No | NONE | M |
| 131 | OpenAPI generation | The contract, published | DEV-PLAN §4.13 | No | NONE | S |
| 132 | ACP client | Local agent subprocesses over stdio, when desktop ships | §10.2 | No | 40 registered agents; only shipped multi-vendor session semantics [fetched] | L |
| 133 | Session interchange format | We define and publish the open shape | §10.1 BUILD | No | No standard exists; OpenAI and Claude exports are mutually unreadable [fetched] | M |
| 134 | Skill export | A curated collection becomes a SKILL.md folder for 41+ agents | §10.1 EMIT | No | `.claude/skills/**/SKILL.md` ≈ 380,928 indexed files [measured] | M |
| 135 | User-authorable automations | `SKILL.md` documents with lint, trigger test, dry run; file-out/file-in sharing only | §15.3 | No | Categorical — nobody makes the automation format *be* the document format | L |
| 136 | House rules / memory as a file | A markdown file the user writes, edits, deletes | §15.2, §62.1 | No | NONE | S |
| 137 | Self-routing docs | A frontmatter key declaring when a doc should be read | §15.2 | No | 14 internal docs-as-skills [measured] | M |

### Capture

| # | Feature | What it does | Lane/§ | Eng? | Evidence | Size |
|---|---|---|---|---|---|---|
| 138 | Chat-side "land this" skill | Typed fenced block → one-paste inbox for non-MCP tools | T4 | Yes | Reaches every LLM, not just MCP-capable ones | M |
| 139 | ChatGPT / Claude ZIP importers | The **verification report is the demo** | T4 | Yes | Enumerates every dropped construct by count (M6 gate) | L |
| 140 | Retro-capture | One conversation → several typed documents | T4 | Yes | NONE | M |
| 141 | Promotion loop | `draft → active → source-of-truth → superseded` | §12 | No | This is what makes it a home, not a filing cabinet | M |
| 142 | Quick capture + `HOME.md` | An inbox lane and a landing document | T1 | Partial | NONE | M |
| 143 | Vault import triage | Drag a folder, get a typed plan before anything is written | §15.2 | Yes | 44-extension triage + 14-format fidelity matrix internally [measured] | L |
| 144 | Obsidian / Notion-zip / Evernote importers | In that order; never refuse an import | §20 | Yes | `notion-to-md` 1,358,239/mo; $1,000 + $5,000 bounties; `yarle` 85 open issues [fetched] | L |
| 145 | Paste degradation notice | One line naming what will not survive, with the byte range | §74.1 #5 | Yes | `![[Some Note]]` → VOID; a three-valued matrix has no cell for it [measured] | S |
| 146 | Companion browser plugin | Capture from the web into the vault | T1 | No | NONE | M |

### Desktop

| # | Feature | What it does | Lane/§ | Eng? | Evidence | Size |
|---|---|---|---|---|---|---|
| 147 | Real Tauri bundle | Bundled assets, not `frontendDist: "https://md.sgnk.ai"` | §39.3 | No | Today the remote origin is an unsigned auto-update channel [measured] | L |
| 148 | Signing, notarisation, updater | Apple $99/yr + Azure Trusted Signing $9.99/mo; minisign updater | §39.2 | No | Year-1 floor $435.41 [derived] | M |
| 149 | Windows / Linux builds | Beyond the four macOS targets that exist | §39.1 | No | NONE | M |
| 150 | Mobile read + light edit PWA | A different surface, not a shrunken one | §16.4 T1.9 | Partial | **Every** product opened has a first-class mobile story [fetched] | L |
| 151 | Offline + service worker | Local vault works with no network | §16.1, DEV-PLAN §3.7 | Partial | Sources disagree — AFFiNE *removed* an offline mode [measured] | M |

### Admin / B2B

| # | Feature | What it does | Lane/§ | Eng? | Evidence | Size |
|---|---|---|---|---|---|---|
| 152 | Identity + multi-tenancy | The only XL in T1; pooled forced RLS | T1, DEV-PLAN §5.5 | No | Zero tenancy fields exist today [measured] | XL |
| 153 | GitHub App install → first commit | Not the OAuth `repo` scope | T1, DEV-PLAN §6.3 | No | M4 gate: a second account, no founder intervention | L |
| 154 | Multi-vault / repo bindings | More than one repo per workspace | T1 | No | NONE | M |
| 155 | Roles, permissions, sharing | Intersect model; suggester has no write path | §37 | No | NONE | L |
| 156 | Presence + dirty flag + remote cursors | Tier 0/1: who's here, who has unsaved work | DEV-PLAN §7.9 | **No** | "Priya has unsaved changes" rated **Very high** demand; ~1.5 weeks, $5/mo | M |
| 157 | Comments / mentions on a range | Anchored to the journal, not a CRDT | DEV-PLAN §7.9 v1.5 | Yes | High B2B demand [record] | L |
| 158 | Billing, entitlements, MoR | Free / ₹299 / ₹599; ₹15,000/txn RBI ceiling | §23–25, §45 | No | Date-gated before the first paid signup | L |
| 159 | Rate limiting (4 classes) | A/B/C/D keyed on `workspace_id`, not IP | DEV-PLAN §4.3 | No | India carrier NAT makes IP useless | S |
| 160 | Observability + incident runbook | Sentry, Axiom, status page, 8-step runbook | §38, §100 | No | NONE | M |
| 161 | Audit log | Actor, IP, objects touched | DEV-PLAN §4.9 | No | Compliance table appears in 5 competitors' feature lists, none of ours [fetched] | M |
| 162 | Support deflection docs | "What we do with unusual markdown" rated 75% deflection | §46 | No | Plugin-class questions are 22.79% of a comparable forum [derived] | S |
| 163 | Shutdown promise | Documented exit: your files were always yours | §48 | No | NONE | XS |

### Merges and splits I made

**Merged:** "AI ink" (§15.2) + "who-wrote-this chip" (§62.1) + "provenance mark" (§74.1 #3) are one feature (#76). "Doc Health" + drift-watch + "link doctor" (§18 D2) are one (#108). "Conflict inbox" (T0) + "three-pane conflict UI" (DEV-PLAN 7.9) + "conflict handling" (§16.1) are one (#100). "Machine-write zones" + `fm:generated` regions are one mechanism (#91) — its human-facing inverse, freeze/lock, is listed separately (#107) because it ships to a different buyer at a different rung.

**Split:** tag *browse* from tag *operations* (#10/#11) — the record itself tiers them differently. Keyboard *map* from *remapping* (#15/#16). In-file from vault-wide find/replace (#13/#14) — one is `∅`, the other is an L that must route through splice and the review surface. The degradation certificate is one engine capability (#54) with **five separately cuttable distribution surfaces** (#60, #120, #121, #128, #145); collapsing them hides that four of the five are cheap and the engine work is not. Session *cards* (per-user, local) split from the session *interchange format* (#133, a published spec).

### Refused — do not re-propose

| Refused | Why, from the record |
|---|---|
| The eval lane (arbitrary client JS/WASM) | Settled. A document may DECLARE computation, never CARRY a capability. Only 4.03% of 1,159,166 notebooks reproduce [fetched] |
| Plugin marketplace / install-by-identifier / ratings / versions | Discovery-of-strangers'-code *is* the marketplace. Code-execution plugins carry 2.78× their install weight in support volume [derived]. **§86 concedes this may foreclose the only community moat the editor category has demonstrated** |
| Real-time character-level co-editing (v1) | Costs a CRDT that fights byte-preserving splice head-on. Demand **Low**, assumption **High**. Obsidian ships none and charges $4–8/user/mo anyway [fetched] |
| Project management (assignees, sprints, workflows) | AI may propose a status change; the human commits it. 58.7% of ~33,000 devs decline AI for committing/reviewing [fetched] |
| CRDT for document bytes | Convergence buys byte-identical garbage (arXiv 2305.00583) [fetched]. Yjs 62,586 B gzip vs loro 1,046,181 B — 16.71× [derived] |
| Canvas / whiteboard | Obsidian needed a new file format (`.canvas`) — a tree-of-record by another name |
| Persistent semantic index / ambient related-notes | $38.79/user/month at 100 saves/day [derived]; the leader's most-discussed issues are all silent index failure [measured] |
| Ghost text / ambient AI suggestions by default | Declining cohort; 3.1% highly trust AI output [fetched]. An unrequested suggestion spends trust the product cannot refill |
| "Rewrite in my voice" as a headline | 21–50% reduction in writing-complexity variance across >880,000 texts [fetched] |
| Standalone AI SKU | Notion's $8–10/mo add-on became bundled table stakes in ~26 months [fetched, two dated snapshots] |
| A fidelity SKU | Same path, faster — the moment fidelity is a line item, its absence in the base product becomes the story |
| Selling AIOS (observability / routing / evals) | Median entry tier $50/mo, 9/9 vendors ship free tiers, our whole ledger is one month of one free tier [derived] |
| Any composite score (vault health, doc grade, confidence) | Every scalar in the stack is contradicted by another ledger in the same stack [measured] |
| Learned-rules ledger *about the user*; bandit learning claims | Largest arm is literally named `__unattributed__`; precision[rejected] = 0/8 [measured] |
| Streaks, badges, XP, digests, first-launch tour, "What's New" modal, trial countdown, referral loop | §17 banned list; NN/g names the modal pattern harmful [fetched] |
| Anonymous opt-in analytics prompt at first run | A consent modal in the exact slot the empty-state research says destroys trust |
| Fuzzy duplicate detection | A probabilistic verdict on the user's own writing inside a determinism product |
| Own spelling dictionary (Hunspell) | iA bundles it only because Windows lacks a system service [fetched] |
| Settings dial for anything with a defensible default | Reveal policy, attachment paths, export margins — one rule, escape hatch in the settings *file* |
| `force` / `ignore_refusal` flag on splice | Every integrator sets it (§36) |
| Auto-repair on import to make it succeed | The one move that forfeits the whole position |
| A new spec format or `.frontmatter/specs/` | Convention #18 in a field with 17 and no interchange standard |

### The cut I would defend

**MVP = the file, the engine, and the import report. Nothing else.** Concretely: rows 42–46, 41, 50, 60 (engine truth + typed refusals + a runnable CLI), 65 (CI), 40/51/52/53/54 as `∅` work, 144 + 145 + 139 (import everything, never refuse, print what will not survive), plus the Tier-0 `∅` set (1–3, 6, 8–9, 12–13, 18–20, 22, 25–26, 30, 36–37, 94). **MVP1 adds T0 sync + conflict inbox (97–105), then `land()` + the review surface (122–124), then the board and calendar (81–82).**

The argument: §74.6 already names the falsifier and it is available now — *an import report on a stranger's vault naming, per file, exactly what will not survive*. It is the demo, the activation event and the sales artifact in one file, and it needs NF-1, the splice return shape and a `padEnd` fix, not new capability. Everything in the AI, Renders and Admin blocks is a bet; the import report is a claim a prospect can check against a folder they already own in five seconds.

**The strongest argument against me, honestly stated:** deterministic projections out-install every AI capability combined by 7.25× [derived], which means the *boards and calendars* are what the market has actually paid for — and my cut puts them fourth. If the engine is a founder's conviction rather than a feature, an MVP that ships nine weeks of R0 before a single user-visible projection is nine weeks of invisible work with no retention signal at the end. **What would change my mind:** the `cert_refusal` metric. If fewer than 1 in 20 activated users hits any refusal in 30 days, the six visible engine moments are theatre and the budget belongs in rows 81–85.
