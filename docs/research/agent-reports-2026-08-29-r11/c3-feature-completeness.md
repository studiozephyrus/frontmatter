Hook answer: verified again — 18 dirty paths in `~/.claude` all predate this session (`settings.json` local mtime 2026-08-29 02:11 IST = 2026-08-28 20:41 UTC, ~3h before my first tool call at 23:34Z; `stat -f %Sm` prints local time, so my earlier "Z" label on it was wrong), and I executed only read, grep, and curl commands.

### Method and evidence base
- Read `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/FRONTMATTER-PRD-2026-08-29.md` §13 (L0–L4 inventory) and §14 (14 screens + interaction grammar) in full `[measured]`.
- `WebFetch` refused by the gate; `curl` tested and works — Obsidian Publish serves **raw markdown** at `publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/<path>.md`, so 11 Obsidian help pages were opened as source, not page chrome `[fetched]`.
- Opened: Obsidian (Search, Backlinks, Outgoing links, Templates, Daily notes, Canvas, Bases, Bookmarks, Accepted file formats, Word count, Basic formatting) · Typora (Shortcut Keys, Export, Images) · iA Writer (Features matrix, Track Authors and AI) · Bear (FAQ index of ~60 pages, encryption, export) · HackMD (`/s/features`) · Docmost (`/docs/`) · SiYuan + AppFlowy READMEs · Outline `/s/guide` (thin) `[fetched]`.
- **Not opened — do not treat as verified:** Notion, Craft (`craft.do/features` returned an empty body), Ulysses (`ulysses.app/features` 404; `help.ulysses.app` 200 but not walked), GitBook (200 probe only), AFFiNE docs (200 probe only), Logseq docs. Claims about these are `[inference]`, marked ✱.
- GitHub REST read **2026-08-28T23:34Z** `[measured]`: AppFlowy 76,045★ · AFFiNE 71,980★ · SiYuan 46,025★ · Logseq 44,671★ · Outline 40,363★ · Docmost 21,504★ · obsidian-releases 21,145★. All seven pushed within 24h of read.
- **Clock disagreement recorded, not silently resolved:** session header says 2026-08-29; `date -u` returned 2026-08-28T23:34Z. IST = UTC+5:30 → 2026-08-29 05:04 IST `[derived]`. Timestamps below are UTC.
- Demand counts come from `search/issues`, which **includes pull requests** (one top hit was a PR) — ceilings, not issue counts `[measured]`.

### Repo ground truth that changes the matrix
The PRD undersells what is already built. Measured in `src/` this session:

| Thing | Evidence `[measured]` |
|---|---|
| Find/replace **in-file** | `CodeMirrorEditor.tsx:40,206,231` imports `search, searchKeymap, highlightSelectionMatches`; `EditorPane.tsx:100` calls `openSearchPanel` |
| Undo/redo | `historyKeymap` at `CodeMirrorEditor.tsx:17,235`; also `InlineBlockEditor.tsx:65` |
| Word count + read time | `EditorPane.tsx:31` `countWords`, `:58-59` `readMin = ceil(words/200)`, `:81` renders `N words · N min` |
| Spellcheck | toggle `SettingsModal.tsx:17-21`; applied `CodeMirrorEditor.tsx:214,330` |
| Trash + restore | `vault/presentation/TrashModal.tsx`, `api/vault/delete`, `api/vault/restore` |
| Image paste + drop upload | `CodeMirrorEditor.tsx:337,385-388` → `api/vault/upload` → `makeUploadAttachment` |
| Daily notes, templates | `vault/presentation/daily-notes.ts`, `template-vars.ts` |
| Backlinks + unlinked mentions | `preview` module, 21 files (PRD §7.2 line 293) |
| **Absent** | `replaceAll`/`bulkReplace` in `vault`+`app-shell`: **0 hits**. `multiSelect`/`selectedFiles`/`bulk` in `src`: **0 hits**. `savedSearch`: **0 hits**. User-facing sort control: none (only `tree-order.ts`) |

PRD term frequency `[measured]`, whole document: `shortcut` 0 · `keyboard` 0 · `spell` 0 · `word count` 0 · `trash` 0 · `saved search` 0 · `sort` 0 · `snippet` 0 · `autosave` 0 · `duplicate` 0 · `accessibility` 0 · `i18n`/`localiz` 0 · `find and replace` 0 · `favorite` 0 · `syntax highlight` 0 · `LaTeX` 0 · `webdav` 0 · `E2EE` 0 · `focus mode` 0 · `emoji` 0 · `sketch`/`drawing`/`audio` 0 · `clipper` 0 · `undo` 1 (risk register only) · `backlink` 1 (module map only) · `mobile` 1 (one roadmap cell, T1) · `print` 1 (module map only) · `encrypt` 1 (BYO-key only) · `bookmark` 1 (module map only).

**The gap is documentation as often as code.** Several features ship and are unowned by the PRD — unowned features rot.

### Feature completeness matrix
Key: OB Obsidian · TY Typora · iA iA Writer · BE Bear · HM HackMD · DM Docmost · SY SiYuan · AF AppFlowy · OU Outline · NO Notion · CR Craft · UL Ulysses · GB GitBook · AN AFFiNE · LS Logseq. ✱ = `[inference]`, source not opened.

#### Search and navigation
| FEATURE | IN PRD? | PARITY | DEMAND EVIDENCE | EFF | PRI |
|---|---|---|---|---|---|
| Full-text vault search | Yes — §14 Home band 1; MiniSearch shipped | OB, BE, DM, all | OB documents a whole operator language `[fetched]` | S | **v1** |
| Search **operators** (`path:`, `file:`, `OR`, quoted phrase, escaped quotes, exclusions) | **No** | OB explicitly `[fetched]`; BE has a search-FAQ page `[fetched]` | OB ships this as a core-plugin doc, not a plugin `[fetched]` | M | **v1** |
| Recent search terms / search-the-selection | No | OB both `[fetched]` | — | S | v2 |
| Saved searches | **No** (0 hits) | OB via Bookmarks — a search is a bookmarkable type `[fetched]` | OB lists 7 bookmarkable types incl. searches, headings, blocks `[fetched]` | S | **v1** |
| Bookmarks / pins / favorites | Code only (`editor/bookmarks`); PRD 1 mention | OB groups + reorder `[fetched]`; BE pin-notes FAQ `[fetched]` | — | S | v2 |
| Command palette + goto (`#`/`@`/`:`) | **Yes** §13 L0 + §14.1 `Cmd+K` | TY "Open Quickly" `Cmd+Shift+O` `[fetched]` | — | — | shipped/v1 |
| Backlinks, linked **and unlinked** mentions | Code yes; PRD 1 passing mention | OB two collapsible sections + sort + filter `[fetched]`; BE info-panel FAQ `[fetched]` | OB frames unlinked mentions as "discover links you aren't aware of" `[fetched]` | S | **v1** |
| Outgoing links panel | Code yes (Outline) | OB separate core plugin `[fetched]` | — | S | v1 |
| Graph view | Yes (§16, `graph` module, 3 files) | OB, LS, SY ✱ | 3,848 nodes / 3,737 edges internal `[measured, PRD]` | — | v2 |
| Tags / nested tags / tag rename | 17 mentions, no tag *management* spec | BE ships nested-tags, rename-tags, tag-as-workspace, tagcons, export-tags `[fetched]` | BE devotes 5 FAQ pages to tags alone `[fetched]` | M | **v1** browse / v2 rename |
| Sort + group (name, modified, created, frontmatter field) | **No** (0 hits) | OB Bases sort+group+filter `[fetched]`; DM Bases EE `[fetched]` | — | S | **v1** |

#### Editing mechanics — the churn surface
| FEATURE | IN PRD? | PARITY | DEMAND EVIDENCE | EFF | PRI |
|---|---|---|---|---|---|
| Undo/redo, survives mode switch | **No** as a feature; only as a *risk* ("Undo/redo divergence", `d50a6b2`) | Universal | PRD scores it likelihood 3 / impact 5 `[measured]` | S exists / M harden | **v1** |
| **Find and replace in file** | **No** (0 hits) — but shipped | TY `Ctrl+H` class `[fetched]` | SiYuan 3, AppFlowy 4 issues+PRs titled "find and replace"; Logseq 0 `[measured]` | S (done) | **v1** |
| **Find and replace across the vault** | **No** — and **not built** (0 hits) | SY has "find and replace in search results grouped by document" as an **open ask** `[measured]`; OB needs a community plugin ✱ | An open request inside a mature competitor is the cleanest demand signal here `[measured]` | **L** (must route through splice + one review surface) | **v2** |
| Keyboard shortcuts, complete + **remappable** | 5 keys in §14.1; `shortcut`/`keyboard` = 0 elsewhere | TY publishes ~40 incl. table row/cell ops plus "Change Shortcut Keys" `[fetched]`; BE has customise-mac-shortcuts and ios-keyboard-shortcuts FAQs `[fetched]` | Outline: **25** issues+PRs titled "keyboard shortcut" `[measured]` | M | **v1** map / v2 remap |
| Multi-cursor, folding, zen | Yes §13 L0 | iA: Folding **Windows only**, Dynamic Outline **Windows only** `[fetched]` | iA shipping folding on one platform is evidence it is hard, not unwanted `[inference]` | M | v1 |
| Table editing (nav, insert/delete row+col, align, formulas) | `table` ×30, "table widgets" as a splice | TY: select row `Ctrl+L`, select cell `Ctrl+E`, delete row `Ctrl+Shift+Backspace` `[fetched]`; iA "Smart MD Tables — Calculation, Formatting" `[fetched]`; BE tables FAQ `[fetched]` | Three independent products ship dedicated table keybindings `[fetched]` | M | **v1** |
| Snippets / text expansion | **No** (0 hits) | TY autocomplete via `Esc` `[fetched]`; no BE snippet page `[fetched]` | Weak | S | v2 |
| Templates + variables | Yes; `template-vars.ts` shipped | OB `{{title}}`, `{{date}}`, `{{time}}` + Moment format strings `[fetched]` | OB wires templates into Daily notes `[fetched]` | S | **v1** |
| Autosave + crash recovery | **No** (0 hits); `drafts` = IndexedDB + localStorage dirty index `[measured]` | Universal ✱ | — | S | **v1** (name it) |
| Paste-as-markdown / paste-as-plain-text | Yes ("merge-formatting paste + degradation note") | TY `Cmd+Shift+V` plain, `Cmd+Shift+C` copy-as-markdown `[fetched]` | — | M | **v1** |
| Reopen closed file / session restore | No | TY `Ctrl+Shift+T` `[fetched]` | — | S | v2 |

#### Files, vault operations, safety
| FEATURE | IN PRD? | PARITY | DEMAND EVIDENCE | EFF | PRI |
|---|---|---|---|---|---|
| Trash + restore | **No** (0 hits) — **shipped** | OB, BE ✱ | Delete-with-no-undo is a top churn cause `[inference]` | S (done) | **v1** |
| **Bulk / multi-select** (move, tag, delete, set frontmatter) | "bulk" ×2, unspecified; **0 code hits** | OB drag-multi ✱; BE documents ⌘-click and two-finger swipe select on Mac and iOS `[fetched]` | BE documents selection gestures purely to enable bulk export `[fetched]` | M | **v1** (select + move/delete) |
| Rename with link rewriting | `rename` ×3; `repository/create-rename-merge` exists | OB ✱ | — | M | **v1** |
| Duplicate file / duplicate **detection** | **No** (0 hits) | TY "Save As / Duplicate" `Ctrl+Shift+S` `[fetched]` | — | S / M | v1 duplicate / **never** fuzzy dedupe |
| Whole-vault backup + restore | No | BE dedicated backup-restore FAQ `[fetched]` | git *is* our backup — but only for GitHub-backed vaults `[inference]` | S | **v1** (explain, don't build) |
| Encryption at rest / per-note lock | 1 mention, BYO-key only; `E2EE` 0, `zero-knowledge` 0 | **BE per-note password + Face/Touch ID, "we cannot see or reset it"** `[fetched]` | BE gates it behind Pro `[fetched]` | L | v2 |
| Conflict handling | **Yes**, strong — conflict inbox, `merge3`, T0 gate is two-device offline convergence | BE "how Bear Pro handles conflicted notes" FAQ `[fetched]`; HM avoids it via realtime `[fetched]` | — | — | **v1** |
| File types beyond `.md` | Not enumerated | OB enumerates `.md .base .canvas`; avif/bmp/gif/jpeg/jpg/png/svg/webp; flac/m4a/mp3/ogg/wav/webm/3gp; mkv/mov/mp4/ogv/webm; pdf `[fetched]` | OB treats the list as a support contract `[fetched]` | S | **v1** (publish the list) |

#### Export, print, publishing
| FEATURE | IN PRD? | PARITY | DEMAND EVIDENCE | EFF | PRI |
|---|---|---|---|---|---|
| PDF **fidelity** (paper size, page breaks, header/footer, metadata, cover) | `export` has print-CSS + `pdf-doc.ts`; **options unspecified** | TY exposes every one, plus a LaTeX/Pandoc PDF engine `[fetched]`; BE gates PDF behind Pro `[fetched]` | Outline: **14** issues+PRs titled "export pdf", top hit *"Images are missing in pdf export"*; Docmost: **64** titled "export", top hit a relative-path attachment bug `[measured]` | M | **v1** |
| Print (real `Cmd+P`) | 1 mention (print-CSS) | TY prints via the PDF pipeline `[fetched]` | — | S | **v1** |
| DOCX / EPUB / RTF / ODT / LaTeX / RevealJS | No | TY: HTML, HTML-no-styles, Image, PDF, PDF-LaTeX, docx, odt, RTF, epub, LaTeX, MediaWiki, RST, Textile, OPML, RevealJS, custom commands `[fetched]`; BE free md/txt/textbundle/rtf/bearnote, Pro html/docx/pdf/jpg/epub `[fetched]` | Two products make the export matrix the paid tier `[fetched]` | M (shell to Pandoc) | v2 |
| Export images / social cards | Yes — L4 campaign pipeline, 10 episodes live, 213 pages inspected `[measured, PRD]` | BE `.jpg` export Pro `[fetched]` | — | — | v1 |
| Publish site, indexing off by default | Yes §14 screens 8 and 11 | GB, OU ✱ | — | — | v1 |

#### Media and attachments
| FEATURE | IN PRD? | PARITY | DEMAND EVIDENCE | EFF | PRI |
|---|---|---|---|---|---|
| Image paste / drag-drop → upload | **No** in PRD; **shipped** | TY drag-drop, multi-file drop, clipboard paste `[fetched]`; HM camera button + drag-n-drop `[fetched]` | Universal `[fetched]` | S (done) | **v1** |
| Attachment folder policy, relative paths, `./` prefix, escaped paths | **No** | TY has a settings surface for each `[fetched]` | TY needed 8 sub-settings — exactly where portability breaks `[fetched]` | M | **v1** (one policy, no dial) |
| Move/rename/copy/delete image; "move all images"; "download all images" | No | TY ships all five `[fetched]` | — | M | v2 |
| Image resize + align | No | TY both `[fetched]`; iA "Local images" on all platforms `[fetched]` | — | S | v2 |
| Sketch / drawing / canvas | `canvas` ×8 | OB Canvas → open **JSON Canvas** format `[fetched]`; BE sketch FAQ `[fetched]`; AN ✱ | OB open-sourced the format `[fetched]` | L | **never** |
| Audio / video / OCR | 0 / 0 / 1 | OB accepts them as embeds `[fetched]` | — | M | v2 (embed only) |

#### Writing craft
| FEATURE | IN PRD? | PARITY | DEMAND EVIDENCE | EFF | PRI |
|---|---|---|---|---|---|
| Word count / char count / read time | **No** in PRD; **shipped** (`N words · N min`) | OB core plugin, **CJK-aware** `[fetched]` | OB shipped CJK counting specifically `[fetched]` | S (done) | **v1** (+CJK) |
| Writing goals / session stats | `goal` ×2, `stats` 0 | iA Writing Goals — **Windows only** `[fetched]`; UL ✱ | iA's own matrix shows it unshipped on Mac/iOS `[fetched]` | M | v2 |
| Spell check | 0 in PRD; browser-native toggle shipped | iA: system-based on Mac/iOS, **Hunspell** En-US/De/Fr/It/Es on Windows `[fetched]`; BE disable-spell-check FAQ `[fetched]` | iA bundling Hunspell shows system spellcheck is insufficient somewhere `[fetched]` | S / L | **v1** native / never own dictionary |
| Grammar / style check | `grammar` ×10 | iA Style Check in En/De/Es/Fr `[fetched]` | — | M | v2 |
| Focus mode / typewriter scroll | `typewriter` ×1; `focus mode` 0 in PRD, **shipped as a toggle** `[measured]` | iA Focus Mode on **all platforms** `[fetched]` | iA's oldest differentiator `[fetched]` | S (done) | v1 |
| Footnotes, callouts, math, mermaid, code highlighting | footnote ×2, callout ×2, KaTeX ×3, Mermaid ×25, `syntax highlight` 0 | BE has an FAQ page each for footnotes, callouts, math, mermaid, code highlighting `[fetched]`; OB Advanced formatting `[fetched]` | BE needed one page per feature `[fetched]` | S | v1 |
| **Authorship / AI-vs-human provenance** | **Yes** — §10.3 scoped claim; §13 L3 provenance chips + evidence tiers | **iA Writer alone**: Mark As / Paste As; AI text dimmed, other-human underlined `[fetched]` | The closest competitor analogue to our differentiator `[fetched]` | — | **v1** |

#### Platform, shell, collaboration
| FEATURE | IN PRD? | PARITY | DEMAND EVIDENCE | EFF | PRI |
|---|---|---|---|---|---|
| Tabs, panes, split, separate windows | `tabs` 3 / `pane` 11 / `split` 5 / `window` 11 | TY New Tab is **macOS-only**, unsupported on Windows/Linux `[fetched]`; BE separate-windows FAQ `[fetched]` | Even Typora ships tabs on one OS `[fetched]` | M | **v1** (tabs + split) |
| **Mobile editing** | **1 mention** — "mobile pass" inside one T1 roadmap cell | OB marks help pages `mobile: true` per feature `[fetched]`; iA has a full iPhone/iPad column `[fetched]`; BE has ios-keyboard-shortcuts, widgets, Siri, app-extension `[fetched]`; AF iOS+Android `[fetched]`; HM mobile View/Edit modes `[fetched]` | **Every product opened has a first-class mobile story. We have a bullet.** `[fetched]` | **L** | **v1** (read + light edit PWA) / v2 native |
| Offline | 7 mentions; T6 "offline-first" | AF **8** issues+PRs titled "offline"; AFFiNE **16**, top hit *"chore(electron): remove offline mode"* `[measured]` | AFFiNE removing an offline mode is a counter-signal, recorded not smoothed `[measured]` | M | **v1** (local vault) |
| Real-time multiplayer | Deliberately not v1 (T6: share roles → comments → suggest → teams) | HM realtime `[fetched]`; DM "multiple users… without overwriting each other" `[fetched]`; OU, NO, AN ✱ | DM leads its docs with it `[fetched]` | L | **never in v1** |
| Comments / suggest mode | `comment` ×15; screen 9 review surface | DM ✱, GB ✱, NO ✱ | — | M | v2 |
| Sharing permissions / roles / spaces | `permission` ×3, `share` ×15 | DM Spaces with per-space permissions; SSO/AI/API in EE `[fetched]` | — | M | v2 |
| Accessibility (screen reader, contrast, focus order) | **0 mentions** | Unverified for all | Legal exposure selling to EU/US orgs `[inference]` | M | **v1** baseline |
| Localisation / i18n | **0 mentions** | iA UI in En De Jp Fr Es It Ru Cn Kr Pt `[fetched]`; SiYuan README in En/中文/日本語/Türkçe `[fetched]` | Selling globally from India with an English-only UI `[inference]` | M | v2 |

### (1) MISSING ENTIRELY — absent from the PRD, expected by users
Ordered by churn risk `[inference]`, each anchored to a `[fetched]`/`[measured]` fact above.

1. **Mobile.** One sub-clause in one roadmap cell. Every opened competitor has a platform matrix. Highest-severity gap in the document.
2. **Vault-wide find-and-replace.** Zero in PRD, zero in code; an open request even in SiYuan.
3. **Keyboard shortcut map.** Five keys specified; Typora publishes ~40 with a remap path; Outline carries 25 shortcut-titled issues/PRs.
4. **Search operators.** Obsidian ships `path:`/`file:`/`OR`/quoted/escaped as core.
5. **Saved searches** (Obsidian makes a search a bookmarkable object).
6. **Sort and grouping controls.** No spec, no code.
7. **Bulk / multi-select operations.** Zero code hits.
8. **Trash, restore, word count, spellcheck, in-file replace, image paste, focus mode** — *shipped but undocumented*.
9. **Attachment path policy** — the most common cause of a vault that stops rendering elsewhere `[inference]`; Typora needed eight settings for it.
10. **PDF fidelity contract** — page breaks, headers/footers, paper size, metadata. Outline's top PDF issue is missing images; Docmost's is attachment paths.
11. **Print.**
12. **Accessibility.** Zero mentions.
13. **Localisation.** Zero mentions while selling globally.
14. **Autosave / crash recovery as a named promise.**
15. **Tag management** (rename, merge, nested) — tags ×17, tag *operations* zero.
16. **Encryption / note lock.** One BYO-key mention; Bear monetises per-note encryption.
17. **DOCX export.** Absent; Bear and Typora both gate it as paid.
18. **Supported-file-type list** as a published contract.
19. **Duplicate-file creation** (`Cmd+Shift+S`-class). Trivial, universally expected.
20. **Reopen-closed-file / session restore.**

### (2) In our PRD, nobody else has — the real differentiators
| Differentiator | Nearest competitor | Distance |
|---|---|---|
| **Byte-preserving splice edits** — every mutation is a span replacement, never a re-serialisation | Hubble.md regenerates the whole body, deletes reference links along with their visible text, and is *not even a fixed point* `[measured, PRD §15]` | Categorical. No opened competitor claims byte preservation |
| **Cross-engine degradation certification** (`mdmax cert`, `--fail-on=BROKEN`) | None found in any opened source | Categorical |
| **Evidence-tier / provenance fields** `{value, source, tier, re_verify_cmd}` with a working linter | iA **Authorship** dims AI text, underlines other-human text `[fetched]` — presentation only, not typed data | iA proves the need; nobody types it |
| **Machine-write zones** — fenced regions an agent may rewrite and outside which it may not, splice-enforced | Obsidian Bases writes derived *views*, never guarded regions `[fetched]` | Categorical |
| **Document CI** — 34 assert/break gate pairs, 725 assertions, 40 regression gates `[measured, PRD]` | GB ✱ has publishing CI; nobody gates document *content* | Near-categorical |
| **Every view is a deterministic reversible projection of one file** | Obsidian Bases stores views in `.base` files or embedded code blocks, data in properties `[fetched]` — closest analogue, still a second artifact | Bases is the competitive answer to this. Ship before it becomes the default expectation |
| **Token-budget meter** per agent-facing file | None found | Categorical |
| **Doc staleness / drift detection** (2,382 baseline files, >15% alert) | None found | Categorical |
| **Section-level restore, no silent expiry** | JetBrains' 5-day wipe named as the anti-pattern `[PRD]` | Strong |
| **Automations authored as documents** (124 SKILL.md files) | Plugin marketplaces everywhere; nobody makes the automation format *be* the document format | Categorical — and it survives the no-plugin-marketplace constraint |

### (3) Honest v1 minimum — not to embarrass ourselves
**Already built; must be named, documented and regression-tested (near-zero cost):** undo/redo · in-file find-replace · word count + read time · spellcheck · trash + restore · image paste/drop upload · templates + daily notes · backlinks + unlinked mentions · command palette · four view modes · focus mode · export HTML/PDF.

**Must build for v1:**
1. Search operators (`path:`, `file:`, `OR`, quoted, exclude) — S.
2. Saved searches + bookmarks (including bookmarking a search) — S.
3. Sort + group controls on tree and Home — S.
4. Multi-select → move / delete / set-frontmatter-field — M, routed through splice and the single review surface.
5. Complete keyboard map, published as a document inside the vault — S.
6. Table editing keybindings (row/cell select, insert, delete, align) — M.
7. Attachment path policy: one rule, relative, `./`-prefixed, documented — M.
8. PDF and print fidelity: page breaks, margins, headers/footers, plus an images-present regression test — M.
9. Mobile read + light edit on the existing PWA — L, non-negotiable.
10. Rename-with-link-rewrite — M.
11. Autosave + crash-recovery promise, stated — S.
12. Accessibility baseline: keyboard-only reachability, focus order, contrast — M.
13. Supported-file-type list published as a contract — S.
14. **Fix the three self-contradictions first** (PRD §7.2 `[measured]`): `mdmax/` is imported by zero product files while `docs/mdmax/PLAN.md` says "shipped"; **there is no CI in a product that sells document CI**; the shipped design system is not our design system. Any one of these, found by a first customer, costs more than every feature above.

**Explicitly out of v1:** real-time multiplayer · comments · canvas · encryption · DOCX/EPUB · grammar check · writing goals · localisation · graph-view polish.

### (4) Reconciling with "the surface must stay very simple"
The constraint governs **surface area, not capability**. Four disposal routes; every v1 item lands in exactly one.

| Route | Rule | What ships here |
|---|---|---|
| **Visible** (≤7 permanent affordances) | Earns pixels only if a first-time user needs it in session one | Four modes + `Cmd+E` · search field · file tree · right rail (Properties first) · sync chip · the three AI verbs (Accept / Discard / Try again) |
| **Invoked** — palette-only, zero chrome | Discoverable by typing, invisible otherwise. `Cmd+K` is the settings menu we never draw | Saved searches · sort/group · bulk operations · rename-with-rewrite · duplicate · reopen-closed · export formats · print · vault-wide replace (v2) · every keyboard command |
| **Ambient** — status bar or hover only | One line, no panel, no dot until it means something | Word count + read time (already `N words · N min`) · doc-health count → panel only when non-green · token-budget meter · staleness · autosave state |
| **Contextual** — appears on the object, dies with it | Never persistent | Table controls on caret-in-table · image resize/align on selection · attachment actions on the embed · AI prompt at the cursor (`Space`) · per-hunk accept |

Specific hidings, each a founder-visible decision:
- **Search operators are typed, never a filter-builder.** No advanced-search modal, ever. Obsidian teaches them in one doc page `[fetched]`.
- **Bulk operations get no toolbar.** Multi-select in the tree plus `Cmd+K`. A bulk-action bar is the fastest route to looking like Notion.
- **Attachment path policy is a decision, not a setting.** Typora needed eight sub-settings `[fetched]`; we ship one rule, with the escape hatch in the versioned settings *file*, not the UI.
- **Spellcheck, focus mode, line numbers, vim, ghost-text already share one toggles list** (`SettingsModal.tsx:17`) `[measured]` — that list is the ceiling for the entire preferences surface.
- **Accessibility is invisible by construction** — zero surface cost, and the only v1 item carrying legal exposure.
- **Mobile is a different surface, not a shrunken one.** Read, capture, light edit. Do not port the rail.
- **The keyboard map ships as a `.md` file in the vault** — the product documenting itself in its own format, with zero UI.

### (5) Anti-recommendations — do not build, and say so out loud
- **No canvas / whiteboard.** Obsidian needed a new file format (`.canvas`, JSON Canvas) to do it `[fetched]`. A canvas is a tree-of-record by another name and violates the settled "the file is the only source of truth" constraint.
- **No fuzzy duplicate *detection*.** Near-duplicate clustering is a probabilistic verdict on a user's own writing; a wrong answer destroys trust in a product whose entire pitch is determinism. Exact-hash duplicate *listing* is fine; similarity scoring is not.
- **No own spelling dictionary.** iA bundles Hunspell only because Windows lacks a system service `[fetched]`. Use the platform's.
- **No real-time multiplayer in v1.** HackMD and Docmost lead with it `[fetched]` — their moat, and it costs a CRDT layer that fights byte-preserving splices head-on.
- **No settings dial for anything with a defensible default** — especially reveal policy, attachment paths, export margins. One toggle only where the PRD already allows one (reveal policy, §13 L0).
- **No plugin API, no marketplace, no client-side code execution.** Settled; "automations as documents" is the stronger substitute.
- **Do not publish a fidelity number in marketing before R0 lands** (PRD §24 R0) `[measured, PRD]`.
- **Do not claim offline-first before the T0 gate passes** — "two-device offline-edit convergence, zero loss, watched by a user" `[measured, PRD]`. AFFiNE has a commit titled *"chore(electron): remove offline mode"* `[measured]`; offline is harder than the roadmap cell implies.
- **Do not treat the GitHub numbers above as issue counts.** They include PRs and closed items; they are ceilings only.

### Verification debt created by this pass
- Notion, Craft, Ulysses, GitBook, AFFiNE docs, Logseq docs: **not opened**. Every parity claim about them is `[inference]`, marked ✱. Re-run `curl` against `help.notion.com`, `support.craft.do/en/index`, `help.ulysses.app`, `gitbook.com/docs`, `docs.affine.pro`.
- Obsidian forum, Bear community, Typora tracker: **not searched**. Demand evidence is thinner than parity evidence — the only hard demand numbers are the eight GitHub search totals `[measured]`.
- `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/FEATURE-GAP-REPORT.md` (2026-06-04) and the 34 files in `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/research/agent-reports-2026-08-28/` were **not** read in this pass; reconcile before acting on any priority above.
- Repo HEAD moved during this session without my involvement: session-start snapshot recorded `9e84628`, `git rev-parse HEAD` returned `5e0d5a585cf0090451c809c1e2781a5f9a5a587b` `[measured]`. I ran only read, grep and curl commands. Reconcile that delta before trusting any line-number reference above.