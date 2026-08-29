### Evidence ledger — what was actually opened (all reads 2026-08-29 UTC)

| Source | Method | Key figures |
|---|---|---|
| `obsidianmd/obsidian-importer` repo API | [fetched] | 1,630 stars, 60 open issues, created 2023-07-11, pushed 2026-08-26, MIT, not archived; latest release 3.1.3 (2026-08-26) |
| obsidian-importer README + full `src/` tree | [fetched] | 17 supported formats; per-format source sizes below |
| obsidian-importer issues: all-open (58 non-PR), `notion` label (58), `bounty` label (13) | [fetched] | see tables |
| `souvikinator/notion-to-md` | [fetched] | 1,731 stars, 38 open issues, pushed 2026-01-27 |
| npm `notion-to-md` last-month downloads | [fetched] | 1,358,239 (window 2026-07-29 → 2026-08-27) |
| npm `turndown` last-month downloads | [fetched] | 33,570,046 (same window) — the HTML→MD engine under nearly every converter |
| `akosbalasko/yarle` | [fetched] | 1,796 stars, **85 open issues**, pushed 2026-03-31; npm name `yarle` does not exist (404) |
| `alxnbl/onenote-md-exporter` | [fetched] | 1,622 stars, 25 open, pushed 2025-12-15 |
| `MatthieuBizien/roam-to-git` | [fetched] | 553 stars, 20 open, pushed 2024-10-31 |
| `threeplanetssoftware/apple_cloud_notes_parser` | [fetched] | 541 stars, 1 open, pushed 2026-07-25 |
| `meridius/confluence-to-markdown` | [fetched] | 143 stars, **archived**, last push 2021-06-24 |
| Notion Help → "Export your content" | [fetched] | full text, quoted below |
| Evernote ENEX 4.0 DTD + ENML 2.0 DTD (`xml.evernote.com`) | [fetched] | element grammar, MIME allowlist, 25MB resource cap, 5,242,880-char content cap |
| Atlassian Confluence DC 10.2 "Export Content to Word, PDF, HTML and XML" | [fetched] | export matrix + exclusions |
| Evernote Help Center article on ENEX export | **blocked** — Cloudflare interstitial ("Enable JavaScript and cookies") | not used |
| `help.obsidian.md/import/*` | **blocked** — JS-rendered, body empty over curl | not used |

### Source-size signal — difficulty is measurable in bytes of converter

| Importer (obsidian-importer `src/formats/`) | Bytes | Read |
|---|---|---|
| Notion **API** path (`notion-api.ts` + 8 helpers) | **253,994** | [derived] 82,398+25,282+20,224+46,603+43,237+4,940+19,397+10,022+1,891 |
| Notion **zip-export** path (`notion.ts` + 7 helpers) | **50,126** | [derived] 11,671+3,958+23,930+568+3,266+2,716+3,809+208 |
| OneNote **.one binary** (`onenote-file/*`, incl. LZX + CAB + OneStore) | **150,662** | [derived] sum of 22 files |
| OneNote **Graph API** (`onenote.ts` + 7) | **73,441** | [derived] |
| Logseq | 78,308 | [derived] |
| Roam | 34,570 | [derived] |

- **Notion API importer is 5.07× the zip importer** [derived: 253,994 ÷ 50,126 = 5.067]. Obsidian built the expensive one *anyway* — the revealed verdict on zip-export fidelity.
- Obsidian's bounty ledger [fetched, `bounty` label, all 13 closed]: Notion API + Databases→Bases **$5,000** (#421, 2025-09-16) · Apple Notes **$2,500** (#15) · Notion **$1,000** (#14) · OneNote **$1,000** (#11) · Roam **$500** (#16) · Google Keep **$500** (#12) · import log + progress bar **$500** (#35) · Evernote bug **$300** · OneNote bug **$300** ×2 · Notion bug squash **$300** / **$200** · HTML attachments **$300**.
- 47 of 58 open issues are "Import from *X*" requests for formats with **no importer at all** [derived: counted titles; 47/58 = 81%]. Craft (#27, open since **2023-07-23**), Google Docs (#237, open since **2024-04-16**), Microsoft Word (#613, open since **2026-08-10**), LibreOffice (#579) are all in that set.
- `notion`-label issues: 58 total, **3 open / 55 closed** [derived: 55/58 = 94.8%] — Notion is the most-churned importer in the repo.

---

### (1) Per-source fidelity table

Fidelity classes: **SURVIVES** (semantics intact) · **DEGRADES** (recoverable but not identical) · **LOST** (not in the export at all) · **REFUSE** (we must decline before starting).

#### Notion
Export formats: PDF · HTML · **Markdown & CSV** — all as zip [fetched, Notion Help].

| Construct | Verdict | Evidence |
|---|---|---|
| Page text, headings, lists, code | SURVIVES | [fetched] MD export is the documented path |
| **Callouts** | DEGRADES → raw HTML | [fetched] Notion: *"Callout blocks will be exported as HTML, as there is no Markdown equivalent"*; obsidian-importer rewrites `figure.callout` → `> [!info]` blockquote (`convert-to-md.ts:294-317`) [fetched source] |
| **Databases** | DEGRADES → CSV + one MD per row | [fetched] "Full page databases will be exported as a CSV file, with Markdown files for each subpage" |
| **Database views** | **LOST** | [fetched] "you can only choose between the current view and the default view. Exporting all views at once isn't supported" |
| **Form views** | **REFUSE** | [fetched] "you can't export a Form view of a database" |
| **Comments (page + block)** | **LOST in MD; present only in HTML** | [fetched] "When you export as HTML, you can also export comments at both the page and block levels… includes resolved and unresolved comments"; obsidian-importer #311 *"Notion Import does not have comments"* open since 2024-10-09 |
| **Relations / rollups / formulas** | DEGRADES/LOST on zip | [inference] zip CSV holds display text only; the API path needs a dedicated `formula-converter.ts` (19,397 B) and `database-helpers.ts` (43,237 B) [fetched tree] |
| **Toggle blocks / toggle headings** | DEGRADES; historically dropped content | [fetched] #469 "does not correctly handle toggle list", #458 "fails to capture content from inside toggle blocks", #173 (notion-to-md) "Incorrect Markdown output for Toggle Headings and Callout blocks" |
| **Synced blocks** | DEGRADES → duplication | [inference] `types.ts` exports `SyncedBlockRequest` [fetched source] — special-cased, not natively representable |
| **Nested tables in lists** | **LOST (silent)** | [fetched] #216 open since 2024-02-29: "If a table is in a nested list, the table will only display the first column" |
| Numbered lists | DEGRADES | [fetched] #566 "render as repeated `1.`"; notion-to-md #166 "Numbered list serialized as bullet list" |
| **Created/updated timestamps** | LOST by default | [fetched] #478, #479 (both 2025-12-31) |
| **Attachments** | DEGRADES (path-length + naming) | [fetched] Notion FAQ: Windows MAX_PATH 260 breakage on nested subpage folders; #632 open 2026-08-16 requests size-limiting attachment downloads |
| **Filenames** | DEGRADES | [fetched] #348 Korean Unicode decomposition freeze; #456 "File names cannot end with a dot or a space"; #484 name too long; #381 title >255 chars loses data; #303 URL-encoded filenames |
| **Private pages of other users / teamspace-restricted** | **REFUSE** | [fetched] "Pages that the exporter doesn't have access to… will not be included in the export" |
| **Notion AI meeting transcripts/summaries** | LOST | [fetched] #553 |
| Export availability itself | **REFUSE-gate** | [fetched] Enterprise/teamspace owners can toggle *Disable export*; workspace export "can take up to 30 hours"; link expires after 7 days |

#### Obsidian
Export format: **none needed — the vault is already markdown files on disk** [fetched: obsidian-importer exists *to produce* this].

| Construct | Verdict |
|---|---|
| Note bodies, YAML frontmatter, tags | SURVIVES byte-identical [inference] |
| `[[wikilinks]]`, `![[embeds]]`, `[[note#heading]]`, `[[note#^blockid]]` | SURVIVES as text; **resolution semantics** are Obsidian-specific and must be certified, not assumed [inference] |
| Dataview / Templater / Bases queries | DEGRADES → inert code fences [inference] |
| `.canvas` files | **LOST** (JSON, not markdown) [inference] |
| Plugin-specific frontmatter keys | SURVIVES as data, LOST as behaviour [inference] |
| Attachment folder config, `.obsidian/` | LOST (not content) [inference] |

#### Evernote
Export format: **.enex** (XML, DTD-defined) + HTML [fetched DTD].

| Construct | Verdict | Evidence |
|---|---|---|
| Note title, content, created, updated, tags | SURVIVES | [fetched] `<!ELEMENT note (title, content, created?, updated?, tag*, note-attributes?, task*, resource*)>` |
| Body markup | DEGRADES via HTML→MD | [fetched] content must be valid **ENML 2.0** — "a subset of XHTML… intentionally broadened" |
| **Attachments** | SURVIVES (self-contained) | [fetched] `<data encoding="base64">`, inline in the file |
| **Attachment MIME range** | **Constrained** | [fetched] DTD allowlist: `image/gif`, `image/jpeg`, `image/png`, `audio/wav`, `audio/mpeg`, `application/pdf`, `application/vnd.evernote.ink` |
| **Ink notes** (`application/vnd.evernote.ink`) | **LOST** — no markdown target | [inference from fetched MIME list] |
| Metadata (geo, author, source-url, reminders, place-name) | SURVIVES into frontmatter *if* we map it | [fetched] `note-attributes` = subject-date, latitude, longitude, altitude, author, source, source-url, source-application, reminder-order, reminder-time, reminder-done-time, place-name, content-class, application-data* |
| Clipped-article source URL | Commonly LOST by converters | [fetched] obsidian-importer #48 open since 2023-08-07 |
| **Internal Evernote note links** | LOST/DEGRADES | [fetched] yarle #653 "Internal Evernote note links are not converted", #684 "Not converting Evernote links", #655 "Add support for new Evernote Note Link format", #478, #209, #357 |
| **Tags with non-ASCII characters** | **CORRUPTED** | [fetched] yarle #638 "Tag names will skip Chinese characters", #637 "accented characters… converted with skipping" |
| Tags present but dropped | DEGRADES | [fetched] yarle #674 (2025-07-04) |
| Notebook/folder structure | DEGRADES | [fetched] yarle #678, #540, #353 |
| **Client-side encrypted text (RC2-64)** | **REFUSE** | [fetched] yarle #632 |
| Hard caps | REFUSE-gate | [fetched] content ≤5,242,880 chars; resource binary ≤25MB; title 1–255 chars, no line endings |
| Tasks | SURVIVES (schema exists) | [fetched] `task*` in DTD; obsidian-importer has `process-tasks.ts`, `EvernoteTask.ts` |

#### Apple Notes
Export format: **none.** No user-facing bulk export to a documented format [inference; corroborated by both converters reading the store directly].

| Construct | Verdict | Evidence |
|---|---|---|
| Access path | SQLite `NoteStore` + protobuf-encoded attribute runs | [fetched] `apple_cloud_notes_parser` (541★, pushed 2026-07-25); obsidian-importer `apple-notes/{convert-note,convert-table,convert-scan,descriptor,models}.ts` |
| Rich text, links, internal note links | SURVIVES | [fetched source] `ANAttachment.InternalLink` → `getInternalLink()` |
| Tables | SURVIVES with escaping caveat | [fetched source] `convert-table.ts`; comment at `convert-note.ts:170`: *"Raw newlines and pipes would split the Markdown table row"* |
| Hashtags & @mentions | SURVIVES | [fetched source] `ANAttachment.Hashtag`, `ANAttachment.Mention` |
| Scanned documents | Special-cased | [fetched source] `convert-scan.ts` |
| URL preview cards | DEGRADES | [fetched source] `ANAttachment.UrlCard` |
| **Highlight colours** | DEGRADES → emoji substitution in current impl | [fetched source] `ANEmphasisColor.Pink → '🔴'` |
| **HEIC/HEIF images** | DEGRADES | [fetched] #497 open 2026-01-25 |
| **Password-locked notes** | **REFUSE** | [inference: encrypted at rest in the store] |
| Drawings / handwriting | **LOST** | [inference] |
| macOS version gate | REFUSE-gate | [fetched] #215 fails on macOS 10.13 group container |
| iOS | **REFUSE** | [fetched] #342 open since 2024-12-24 |

#### OneNote
Export formats: `.one` / `.onepkg` binary; PDF; DOCX; Graph API [inference + fetched tree].

| Construct | Verdict | Evidence |
|---|---|---|
| `.one` binary parse cost | **150,662 B of converter** incl. LZX decompressor, CAB reader, OneStore revision/transaction log | [derived from fetched tree] |
| Free-form canvas positioning | **LOST** — no markdown target | [inference] |
| **Ink / handwriting** | LOST → SVG approximation only | [fetched source] `ink-svg.ts`, `inkml.ts`, `semantic/ink.ts` |
| Embedded files, tags, sections | DEGRADES | [inference] |
| Auth | REFUSE-gate (MS Graph OAuth) | [fetched source] `onenote/auth.ts` |

#### Roam Research
Export formats: JSON · EDN · Markdown [inference; JSON is what the importer consumes — `roam-json.ts`].

| Construct | Verdict | Evidence |
|---|---|---|
| Outline blocks | SURVIVES | [fetched source] `renderChildren`, `OutlineNode` |
| **Block references `((uid))`** | DEGRADES → `![[target]]` or `[[target]]` | [fetched source] `resolveEmbedsAndReferences`, option `embedBlockReferences` |
| `{{embed}}` | DEGRADES → `!​[[…]]` | [fetched source] regex at `convert.ts:169-173` |
| `attr::` attributes | DEGRADES → frontmatter, body anchor retained when referenced | [fetched source] `attributesOf`, comment: *"Referenced attributes must remain in the body to carry an anchor"* |
| **`{{[[query]]}}`** | **LOST** — and historically corrupted | [fetched source comment `convert.ts:109-111`]: rewriting turned `{{[[query]]}}` into `{{[[query 1]]}}` "after which nothing recognised it as a query" |
| **Roam-only markup** | **LOST** (explicit scrub list) | [fetched source] `roamSpecificMarkup = ['POMO','word-count','date','slider','encrypt','TaoOfRoam','orphans','count','character-count','comment-button','streak','attr-table','mentions','search','roam/render','roam/css','calc']` |
| `{{[[TODO]]}}` | SURVIVES → `[ ]` | [fetched source] `convert.ts:154` |
| Sidebar state, graph view | LOST | [inference] |

#### Logseq
Export format: markdown/EDN files on disk [inference; importer is 78,308 B].
- Outline→prose de-indentation is a **dedicated 9,550 B module** (`de-outline.ts`) [fetched tree] — the hardest part is that every line is a bullet. DEGRADES.
- `block-ids.ts`, `properties.ts` (7,350 B), `tasks.ts` (6,753 B), `journals.ts` — block IDs, `key:: value` properties, LOGBOOK/`NOW/LATER` all need explicit mapping [fetched tree]. DEGRADES.
- Queries, flashcards: LOST [inference].

#### Bear
Export formats: `.bear2bk` (documented importer target), plus MD/HTML/PDF/DOCX [fetched README lists `.bear2bk`].
- Text + `#nested/tags` + attachments: SURVIVES/DEGRADES [inference; `bear/convert.ts`, `bear/application-data.ts` exist — fetched tree].
- Bear-specific: **encrypted notes REFUSE**; `[[wiki links]]` DEGRADES [inference].

#### Craft
- **No importer exists in the largest markdown-importer ecosystem after 2 years, 1 month** [fetched: issue #27 opened 2023-07-23, still open 2026-08-29; labels `formats,markdown`].
- Export: markdown/PDF/docx per-document [SS — not opened, do not cite as fact].
- Blocks-with-backlinks, cards, and daily notes: fidelity **unknown/unmeasured** [inference].

#### Google Docs
- **No importer** — #237 open since 2024-04-16 [fetched].
- Export: DOCX/ODT/PDF/HTML/TXT/EPUB/RTF [SS].
- **Comments and suggestions** are the whole point of Google Docs and have no markdown target: LOST [inference].
- Tabs, footnotes, headers/footers, revision history, tables with merged cells: LOST/DEGRADES [inference].

#### Microsoft Word
- **No importer** — #613 open 2026-08-10 [fetched]; LibreOffice #579 [fetched].
- Tracked changes, comments, fields, styles, footnotes/endnotes: LOST [inference].
- Pandoc is the realistic engine; not evaluated here [inference].

#### Confluence
- Export: **Word (.doc, single page) · PDF · HTML (space, zipped) · XML** [fetched, DC 10.2].
- **Normal HTML export excludes blogs, inline comments, and attachments** [fetched, verbatim capability list].
- Word export: **"only the first 50 attached images will be included"**; **"can only be opened in Microsoft Word and is not compatible with… Open Office, Libre Office or Google Docs"** [fetched].
- **Only published content is exported** — drafts LOST [fetched, stated twice].
- Export requires the **'Export Space' permission** [fetched] — REFUSE-gate.
- Macros (Jira issue, include, excerpt, expand, code, children display): LOST or degraded to static text [inference].
- Best-known OSS converter is **archived since 2021-06-24, 143 stars** [fetched] — no maintained path.

---

### (2) Ranked build order — volume × feasibility

Volume is **unmeasured** here; scored 1–5 by [inference] from stated proxies only (bounty value Obsidian actually paid, star counts, npm downloads, open-issue pressure). Feasibility 1–5 from [fetched] evidence of a working export + a maintained converter. Score = product [derived].

| # | Source | Vol | Feas | Score | Basis (proxies actually fetched) |
|---|---|---|---|---|---|
| 1 | **Obsidian** | 4 | 5 | **20** | No conversion at all; buyer is markdown-native. Feasibility 5 is the only 5 on this list. |
| 2 | **Notion (zip export)** | 5 | 3 | **15** | 58 `notion` issues (94.8% closed = active maintenance); notion-to-md 1.36M npm downloads/month; $1,000 + $5,000 bounties |
| 3 | **Evernote (.enex)** | 3 | 5 | **15** | DTD-defined, self-contained, base64 attachments inline; yarle 1,796★ — but **85 open issues** |
| 4 | **Apple Notes** | 5 | 2 | **10** | Highest bounty after the API job ($2,500); no export format; macOS-only, FDA-gated, iOS refused (#342) |
| 5 | **Logseq** | 2 | 4 | **8** | 78,308 B reference implementation exists to copy semantics from |
| 6 | **Notion (API)** | 5 | 1.5 | **7.5** | 253,994 B = 5.07× the zip path [derived]; needs OAuth, 3 req/s rate limit (`NOTION_REQUEST_RATE = 3`, burst 100) [fetched source] |
| 7 | **Bear** | 2 | 4 | **8** | `.bear2bk` importer exists to mirror |
| 8 | **Roam** | 1 | 4 | **4** | roam-to-git last push 2024-10-31; declining |
| 9 | **Confluence** | 4 | 1 | **4** | Only maintained-looking OSS converter is **archived**; HTML export drops comments + attachments |
| 10 | **OneNote** | 4 | 1 | **4** | 150,662 B binary parser OR Graph OAuth |
| 11 | **Google Docs** | 5 | 0.5 | **2.5** | No importer after 2 yr 4 mo of open demand; comments have no target |
| 12 | **Word** | 4 | 0.5 | **2** | Issue opened 2026-08-10 — 19 days old at read time [derived: 2026-08-29 − 2026-08-10] |
| 13 | **Craft** | 1 | 1 | **1** | #27 open **2 yr 1 mo** with zero progress |

**Recommendation:** build **1 → 2 → 3** (Obsidian, Notion-zip, Evernote). Ship the *verification report* for Obsidian first — it is the only source where the report can honestly print `IDENTICAL` on nearly every row, which is how you establish that the report is trustworthy before you use it to deliver bad news about Notion.

**Anti-recommendations (all explicit):**
- **Do NOT build the Notion API importer first.** 5.07× the code [derived] and it introduces OAuth, a 3 req/s ceiling, retry logic (#552), cursor invalidation (#474), and per-run non-determinism (#453: 1.8.1 loaded a *different* page list than 1.8.0). It is a v2 line item.
- **Do NOT build Craft, Google Docs, Word, or LibreOffice importers.** Combined evidence: 4 open requests, oldest 2 yr 1 mo, zero shipped in an ecosystem with 1,630 stars and a paid bounty program.
- **Do NOT parse `.one` binary.** 150,662 B including an LZX decompressor is not a solo-founder line item.
- **Do NOT promise comment migration for any source.** Notion MD/CSV excludes them [fetched]; Confluence Normal HTML export excludes inline comments [fetched]; Google Docs has no target.
- **Do NOT build "Notion databases → boards" as a launch feature.** Notion cannot even export all views [fetched]; a projection from a lossy CSV is a projection of a lie.
- **Do NOT let the report be a summary.** Per-construct counts or it is not a verification report.
- **Do NOT auto-repair the source.** A splice engine's whole claim is byte preservation; silently normalising input to make it importable destroys the claim.

---

### (3) Verification-report rows for the top 3

Every row: `construct | found | emitted | class | evidence pointer | reversible?`. Classes: `IDENTICAL` (byte-preserved) · `REVERSIBLE` (projection, round-trips) · `LOSSY` (semantics narrowed, certified) · `DROPPED` (not emitted, listed) · `REFUSED` (we declined, listed **before** the run).

**Obsidian → frontmatter**
1. `files_scanned` / `files_written` / `bytes_in` / `bytes_out` — must be equal; any inequality is a defect, not a note.
2. `byte_identical_files` — target 100%; every exception named with a byte offset.
3. `BOM_preserved`, `line_ending_class` (LF / CRLF / **bare CR**) per file — bare CR is a known set-destroying input in this engine [project-context].
4. `frontmatter_blocks: parsed / round_tripped / refused` — including zero-indent sequences, which are refused today and account for a large share of foreign vaults [project-context, unverified here].
5. `wikilinks: total / resolved / unresolved / ambiguous(dupe-basename)`.
6. `embeds ![[…]]: total / resolvable / broken`.
7. `block_refs ^id: defined / referenced / dangling`.
8. `heading_links [[x#y]]: resolved / stale-heading`.
9. `tags: inline / frontmatter / conflicting-case`.
10. `code_fences: total / with_unknown_language` (dataview, tasks, mermaid).
11. `dataview_queries: N — DROPPED as inert fences` (explicit, not silent).
12. `canvas_files: N — REFUSED (not markdown)`.
13. `attachments: referenced / present_on_disk / missing`.
14. `filename_normalisation: NFC/NFD conflicts, >255 byte names, reserved chars`.
15. `mtime/ctime preserved: yes/no per file`.

**Notion (zip) → frontmatter**
1. `export_manifest: pages_in_zip / pages_written / pages_skipped_with_reason` (#561 exists precisely because this row was missing).
2. `callouts: N found → N emitted as blockquote — LOSSY (icon + colour DROPPED)` [fetched: Notion emits HTML; icon/colour have no MD target].
3. `databases: N CSVs / M row-pages; view_definitions DROPPED (Notion exports at most 1 view)` [fetched].
4. `database_properties: mapped_to_frontmatter / unmapped`, split by type: select, multi-select, **relation**, **rollup**, **formula**, person, file.
5. `relations: N found / M resolved to a local file / K left as placeholder`.
6. `formulas: N — DROPPED, last computed value retained as static text`.
7. `comments: 0 emitted — REFUSED (absent from Markdown export; only HTML export carries them)` [fetched, verbatim].
8. `toggles: N found / M with recovered children / K empty` (#469, #458).
9. `nested_table_in_list: N found — FLAGGED, column-truncation risk` (#216, open 2 yr 6 mo).
10. `numbered_lists: N — renumbering applied` (#566, notion-to-md #166).
11. `attachments: N referenced / M downloaded / K over size limit / J failed` (#632, #539 base64 failure).
12. `path_length: max_path_chars, N paths > 260` [fetched: documented Windows failure].
13. `filenames: unicode_decomposition_fixes, trailing-dot/space fixes, >255-char titles truncated` (#348, #456, #381).
14. `timestamps: created/updated recovered from N of M pages` (#478/#479).
15. `math: N `$…$` / N `\begin{cases}` blocks — verified parse` (#281, #289).
16. `bare_urls: N left unmodified` (#376 — the regression to assert against).
17. `pages_inaccessible_to_exporter: unknown — Notion does not report them` [fetched] — print this as an **explicit unknown**, never as zero.

**Evernote (.enex) → frontmatter**
1. `notes_in_enex / notes_written / notes_failed_with_reason` (yarle #405, #116, #369 all exist because this row is missing there).
2. `enex_dtd_validation: pass/fail per note` [fetched: DTD is normative].
3. `tags: N found / N emitted / K altered — list every altered tag verbatim` — non-ASCII tag corruption is a **confirmed live defect** in the leading converter [fetched: yarle #638, #637].
4. `resources: N / by MIME` against the DTD allowlist; `ink_resources: N — REFUSED`.
5. `resources_over_25MB: N — REFUSED` [fetched DTD cap].
6. `content_over_5,242,880_chars: N — REFUSED` [fetched DTD cap].
7. `internal_note_links: N found / M resolved / K DROPPED` — the single most-reported enex defect [fetched: yarle #653, #684, #655, #478, #615, #209, #357].
8. `note_attributes mapped: source-url, author, latitude/longitude/altitude, place-name, subject-date, reminder-time, reminder-done-time` — count each; `source-url` specifically because it is a known drop (#48).
9. `tasks: N found / N emitted` [fetched: `task*` is in the DTD].
10. `encrypted_content: N — REFUSED (RC2-64 client-side encryption)` [fetched: yarle #632].
11. `notebook_structure: N notebooks / stacks preserved as folders: yes/no` (yarle #678, #353).
12. `webclips: N — LOSSY (HTML → MD)` (yarle #479, #566, #565).
13. `filename_truncation: N names shortened, each listed` (yarle #652, #310).
14. `code_blocks: N, escaping applied: yes/no` (yarle #189).

---

### (4) The pre-flight refusal contract — what we tell the user BEFORE they start

Show this as a blocking screen per source, with counts where the export lets us count them, and **"unknown"** where it does not.

**Universal (every source):**
- Comments and discussion threads do not survive. Only Notion's *HTML* export contains them at all [fetched]; we do not import HTML exports.
- Revision/version history does not survive. Nothing on this list exports it.
- Permissions, sharing state, and who-can-see-what do not survive.
- Anything the exporting account cannot see is silently absent from the export, and **no export reports how much was withheld** [fetched, Notion states this explicitly]. Our count is a count of what we received, not of what you own.
- Real-time/computed values (formulas, rollups, queries, live embeds) arrive as their last-rendered text and stop updating.

**Notion, before starting:**
- Only **one** database view exports; the rest are gone [fetched].
- **Form views cannot be exported at all** [fetched].
- Callouts arrive as HTML and become blockquotes; icon and colour are gone [fetched].
- Full workspace export can take **up to 30 hours** and its download link **expires in 7 days** [fetched].
- If your admin has toggled **Disable export**, there is nothing we can do from our side [fetched].
- On Windows, deeply nested subpages can produce paths over 260 characters that Explorer cannot extract; export with *Create folders for subpages* off [fetched, Notion's own remedy].

**Obsidian, before starting:**
- `.canvas` files are not markdown and will not be converted.
- Dataview/Templater/Bases blocks become inert text; they will not compute.
- Plugin behaviour does not transfer; plugin frontmatter keys do (as data).
- **Everything else should be byte-identical, and if any file is not, the report will name it and the offset.** This is the promise the report exists to keep.

**Evernote, before starting:**
- Encrypted note text (client-side RC2-64) cannot be decrypted; those notes will be listed and skipped [fetched].
- Ink/handwriting resources have no markdown representation.
- Notes over 5,242,880 characters or resources over 25MB are outside the export format's own limits [fetched DTD].
- Internal Evernote note links are the most fragile construct in this format; we report resolved/unresolved counts rather than guessing.
- Non-ASCII tags are where the incumbent tools corrupt data [fetched]. We list every tag we alter.

**Apple Notes, before starting:** macOS only; iOS is not supported by any known tool [fetched #342]; requires Full Disk Access to the Notes container; password-locked notes are not readable; drawings and handwriting are lost.

**Confluence, before starting:** HTML space export excludes **blogs, inline comments, and attachments** [fetched]; Word export caps at the **first 50 images** [fetched]; drafts are never exported [fetched]; macros become static text or vanish; you need the *Export Space* permission [fetched].

**OneNote / Google Docs / Word / Craft, before starting:** we do not support these. Say it on the pricing page, not after the upload.