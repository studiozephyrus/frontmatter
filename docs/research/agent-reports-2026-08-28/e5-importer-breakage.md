## KEY FINDINGS
- [fetched] The highest-leverage breakage class is not any single formatting defect but LYING IMPORT REPORTS: yarle logs 'Conversion finished: 47 succeeded, 0 skipped, 0 failed' while 4 notes are missing (yarle#369), logs a failure then prints 'converted successfully' (yarle#358), and prints 'Notes skipped: 1..7' with zero reasons (yarle#405) — while obsidian-importer's flagship large-scale Notion complaint (#561) is a user with 10,544 pages asking for exactly a verifiable reconciliation report ('Where was it. Was it successfully imported?').
- [fetched] Obsidian itself put cash on this exact gap: a $500 bounty for 'Detailed import log and progress bar' (obsidian-importer#35) and a $5,000 bounty for Notion databases conversion (#421), whose text officially concedes 'Notion's file-based export options don't include necessary data to recreate Databases' — ZIP-export databases are unrecoverable by design, only API import can preserve them.
- [fetched] Link integrity is the #1 class by volume in the Evernote corpus — 37 of 230 yarle issue titles touch links (internal note links unconverted #653/#450/#341, links broken by renames #482, untitled-note links #478) — and renames are the mechanism: filename sanitization (26/230 titles; invalid Windows chars #514, ENAMETOOLONG #462, truncated folders #455) silently invalidates every inbound link.
- [fetched] Attachments are the #1 class in the obsidian-importer corpus (35 of 215 sampled titles), and #561's real-world census quantifies it: of 776 failures in one 10k-page Notion import, 347 were attachment HTTP 403/404, 377 ENAMETOOLONG, plus 202-retry and 5xx/cert classes — meaning ~93% of all failures were attachments and filename-length, not markdown conversion.
- [fetched] Content loss hides inside 'successful' conversions: yarle #324 (c15) loses content converting nested lists, #140 has empty anchor tags swallowing note parts, #512 silently drops one of two same-titled notes, obsidian-importer #381 truncates >255-char titles 'losing data' — so count parity (536 in = 536 out) is necessary but provably insufficient; the report must diff per-item content mass.
- [fetched] Block-fidelity breakage concentrates in a stable, enumerable set across all three trackers: toggles (oi#469/#458, notion-to-md#46), callouts (n2md#118 doubled), tables (oi#504 becomes code block, #373 duplicates rows), nested lists (n2md#127, yarle#324), checkboxes, code-block line breaks (oi#82/#107), math (oi#289), synced blocks (n2md#43/#54), columns (n2md#29) — a finite construct-detector checklist, not an open set.
- [fetched] Metadata loss is systematic: created/updated dates not preserved (oi#479/#478, yarle#623 c11 sets all timestamps to conversion time), tags un-nested or unicode-stripped (yarle#411, #637 accents, #638 Chinese), Notion properties lack a frontmatter home (notion-to-md#26 open, c15) — and notion2obsidian's README treats API enrichment as the only source for creation dates in ZIP exports.
- [fetched] notion-to-md (1,731 stars, 356,411 npm downloads last week per api.npmjs.org) carries an API-drift class file exports don't have — Notion changed link_to_page to mention and broke @-links (#101), pagination/cursor failures (oi#474), incomplete page lists between importer versions (oi#453) — so an import verifier must record the exporter+API version it ran against.
- [inference] The '536 in, 536 out' report is credible only if it enforces one invariant (every source item lands in exactly one of imported/merged/skipped-with-reason/failed-with-reason, and the buckets sum to the source census counted from the OUTPUT filesystem, not the conversion loop) and renders seven panels: reconciliation table, per-item failure ledger, rename/truncation ledger, link-resolution audit, attachment transfer table with HTTP statuses, construct-downgrade declarations, and metadata-preservation matrix.
- [fetched] Freshness: obsidian-importer is active (pushed 2026-08-26, 465 issues; 96 Notion-titled, 101 OneNote, 37 Evernote) and its 2026 issue stream (#561 June 2026, #621-#652) keeps reproducing the same classes; yarle (1,796 stars, 289 issues, pushed 2026-03-31) still has its core link-conversion issue #653 open — the breakage corpus is current, not historical.

---

# GAP 7 — Importer Breakage Corpus (primary-source pass, 2026-08-28)

**Method.** All issue data fetched live from `api.github.com` on 2026-08-28 (unauthenticated until the 60/hr IP limit exhausted, then authenticated via the workspace's standing token pattern; read-only GETs only). Corpus: issues sorted by comment count, PRs filtered out. Coverage: obsidian-importer top 215 most-commented of 465 total issues; yarle 230 of 289; notion-to-md top ~75; plus two smaller Notion exporters. Frequency counts are case-insensitive keyword matches over fetched issue TITLES — a rough, overlapping proxy, labelled [fetched-derived]; class assignment and ranking are [inference] on top of fetched titles/bodies. Everything quoted has a URL.

---

## 1. Sources fetched

| Repo | Stars | Issues (all) | Last push | Role |
|---|---|---|---|---|
| obsidianmd/obsidian-importer | 1,629 | 465 (96 "notion" in title, 101 "onenote", 37 "evernote") | 2026-08-26 | The segment-1 (Obsidian power user) importer; Notion ZIP/HTML + Notion API + Evernote + OneNote + Apple Notes + Keep + Bear + Roam |
| akosbalasko/yarle | 1,796 | 289 | 2026-03-31 | The canonical Evernote ENEX → Markdown converter |
| souvikinator/notion-to-md | 1,731 | ~150 sampled 75 | 2026-01-27 | Dominant programmatic Notion→MD library; **356,411 npm downloads last week** (api.npmjs.org, 2026-08-21..27) |
| yannbolliger/notion-exporter | 188 | 9 | 2026-01-12 | CLI driving Notion's own export endpoint |
| bitbonsai/notion2obsidian | 120 | 1 | 2025-10-15 | Repair tool for Notion ZIP exports; README = a tool-author's defect checklist |

All [fetched]: https://api.github.com/repos/obsidianmd/obsidian-importer , https://api.github.com/repos/akosbalasko/yarle , https://api.github.com/repos/souvikinator/notion-to-md , counts via https://api.github.com/search/issues?q=repo:… , downloads via https://api.npmjs.org/downloads/point/last-week/notion-to-md

---

## 2. obsidian-importer — what breaks (Notion focus)

Two distinct Notion paths exist and break differently. The ZIP/HTML importer (original #14 bounty) and the Notion **API** importer (shipped ~v1.8, funded by the #421 bounty).

### 2a. Notion ZIP/HTML import breakage [all fetched, URLs = github.com/obsidianmd/obsidian-importer/issues/N]
- **Process death on large exports:** #266 (c46 — hangs immediately after clicking import), #61 (c18 — hangs on large .zip), #206 (c16 — large workspaces fail, "Part-1.zip undefined"), #364 (c11 — "fails with no error details"), #323 (hangs on one PDF).
- **Filenames/links percent-encoded:** #303 (c13) — Cyrillic filenames imported as `%D0%A0%D1%83…` percent-garbage; #66 (cyrillic names), #202 (code snippets parsed into filenames).
- **Folder structure flattened:** #450 (c7 — "fails to preserve the folder structure. Instead, all files are placed in the same directory"), #83 ("Folder already exists"), #58 (Save-parent-in-subfolder broken), #87 (dot-prefixed folders fail).
- **Attachments/images:** #114 (image URL incorrect), #538 (all attachments dumped in vault root), #441 (image paths → root), #539 (base64 attachment fails), #475 (covers duplicated), #298 (notes SKIPPED because attachment name duplicates).
- **Databases:** the existential one — #421 (c48, $5,000 bounty) states officially: "Notion's file-based export options don't include necessary data to recreate Databases." ZIP export gives you CSV husks; formulas/views/relations are gone. #415, #470 (CSV list property w/ multiple wikilinks), #641 (CSV import only one tag).
- **Block fidelity:** #469/#458/#463 (toggle lists, toggle blocks, toggle headings lose or hide content), #82 + #107 (code blocks imported without line breaks — reopened class), #62 (checkboxes), #289 (math formula breaks), #330 (inline equations w/ spaces), #59 (missing blank line before tables), #504 (table nested under bullet becomes indented code block), #373 (table rows duplicated), #337 (Table of Contents wrong), #492 (indented text blocks lose content — API), #519 (inline SVG).
- **Metadata:** #479/#478 (created_at/updated_at not preserved — API), #326 (dates), #407 (fields containing `$` dropped), #553 (Notion AI meeting notes not imported), #10 (invalid tags created).
- **Filename sanitization:** #456 (names ending in dot/space refused), #484 (name too long), #381 (title >255 chars "loses data"), #41 (invalid characters).
- **API-importer-specific:** #452 (fails to load pages), #512/#507 (no pages or databases found), #474 (invalid start_cursor — pagination), #453 (1.8.1 loads FEWER pages than 1.8.0 — importer-version drift), #457/#513 (integration-secret/setup friction).

### 2b. The marquee artifact — #561 "Large Scale Notion Import: Skips, Failures, Insufficient logs + Recovery" (June 2026) [fetched body]
A real 10k-page migration census, verbatim: **10,544 imported / 6,823 attachments / 172 remaining / 976 skipped / 776 failed**, with failure classes: 472 skips "already exists with same size", 377 × `ENAMETOOLONG`, 347 × attachment HTTP 403/404, 4 × HTTP 202 (needed retry), plus HTTP 500/503 and `net::ERR_CERT_DATE_INVALID`/`ERR_CONNECTION_RESET`. The user's complaints are a product spec: skip lines "provide no context information with which to verify… Where was it. Was it successfully imported?", and external-URL fetch failures "should simply be **reproduced** (URL retained)". ~93% of failures are attachments + filename length, not markdown. URL: https://github.com/obsidianmd/obsidian-importer/issues/561
- Corroborating reporting-gap issues: #35 (c6 — **"Detailed import log and progress bar — $500" bounty**), #392 ("Progress breaks when items are skipped or fail"), #432 ("is the output of the importer logged anywhere?"), #142 (recurring imports create duplicates), #460 (images overwritten between import sessions), #647 (update/override semantics unclear). [fetched titles]

### 2c. Non-Notion classes worth stealing from (same repo) [fetched titles]
- OneNote: rate-limit death spirals (#334 c34, #225, #120, #390, #346), auth failures (#233 c27, #370, #416, #386, #542), base64 images (#336), OCR text polluting alt-text and needing escapes (#362, #317, #630), nested pages not migrated (#418), section groups (#100), empty titles kill import (#240), illegal characters fail instead of sanitize (#263).
- Apple Notes: drawings unimportable (#134 c12, #218, #203), "**error reading attachment**" on name conflicts (#148, #192), incorrect header check (#517, #417), long titles truncated (#153).
- Evernote (in OI): .enex folders not saved (#24), note-to-note links not converted (#306), dates wrong (#194), code blocks lose language (#483), texts missing (#53), clipped-article source URL/metainfo lost (#48).

---

## 3. yarle (Evernote ENEX) — what breaks [all fetched, URLs = github.com/akosbalasko/yarle/issues/N]

- **Internal link integrity — the #1 yarle class (37/230 titles [fetched-derived]):** #653 (c11, OPEN — Evernote internal links not converted to Obsidian links), #530 (links use wrong file names), #450, #345, #341, #684, #57, #14, #92 (robustness), #292 (links across multiple enex files), #482 (link to a RENAMED note breaks), #478 (links to untitled notes), #609 (c12 — links+GUIDs not populated for untitled notes), #635 (Zettelkasten renaming breaks links), #289/#90 (underscores escaped wrongly), #550 (triple brackets emitted), #551 (URL-encoding option itself breaks attachment links), #655 (new Evernote link format unsupported), #50 (numeric refs become `![[67]]`).
- **Silent loss / lying reports (19/230 [fetched-derived]):** see §5 — #358, #369, #405, #116, #212, #328, #512, #140, #24, #344, #416.
- **Filename/path sanitization (26/230):** #514 (c14 — generates invalid Windows filenames), #462 (ENAMETOOLONG — must truncate), #455 (folder names with period truncated), #413 (quote/ampersand/colon), #389 (configurable illegal-char replacement), #240 (escape resource filenames), #503 (`?` → `_`), #73/#117 (letter case), #310/#652 (truncation length + warnings), #130 ("undefined" instead of comma in title).
- **Attachments/images (26/230):** #329 (c10 — `unknown_filename` attachments make merging impossible), #554 (attachment saved but never referenced), #557 (erroneous image extraction), #559/#457 (image links w/ `=678x` size suffix break), #430/#342 (image-bearing notes fail wholesale), #163 (attachment links unfunctional), #162 (Excel/Word attachment names wrong), #223 (PDF linked, not embedded), #601/#294/#611 (image-size markup), #595 (attachment placed per-note inconsistently), #68 (image links unsupported).
- **Tags (18/230):** #411 (c13 — hierarchy flattened), #376 (rendered as `#////`), #247 (periods break tags), #578 (Cyrillic tags empty), #637 (accented chars skipped), #638 (Chinese chars skipped), #258 (tags "undefined"), #674 (tags present in .enex, not imported), #19 (tags into frontmatter), #96/#536 (transform/replace).
- **Formatting fidelity:** #324 (c15 — **content LOST converting nested lists**), #444 (c17 — LogSeq journal format loses content), #662 (c17, OPEN — highlight/color conversion bug), #565 (c21, OPEN — webclip extraction confused by tabs), #493/#201/#60/#420/#339 (indent/newline), #437/#372 (checklists), #189/#128 (code blocks), #492 (underline), #282/#668 (strikethrough), #394/#272 (LaTeX / `$`), #576 (`<br>`), #140 (empty anchors swallow content).
- **Dates/metadata:** #623 (c11 — output file timestamps = conversion time, not note time), #486 (Windows last-updated wrong), #362 (pre-epoch dates crash w/o log), #259 (ISO date munged), #171 (GPS order), #98 (source-url), #543 (encrypted text elements silently unhandled).
- **Scale:** #374 (big data fails), #204 (hangs on large .enex), #55 (memory), #75 (chunked enex), #210/#714 (100% CPU, does nothing).

---

## 4. Notion-export tools (third leg) [fetched]

**souvikinator/notion-to-md** (1,731 stars; 356k weekly downloads) — URLs github.com/souvikinator/notion-to-md/issues/N:
- Databases unsupported (#22 c14 OPEN, #85, #133); properties→frontmatter still a feature request (#26 c15 OPEN); nested-page recursion (#58 c17, #71, #88).
- Nested lists over-indented (#127 c10), sublist items in columns dropped (#96), ordered lists parsed unordered (#108, #18), extra blank lines (#41), tab spaces missing (#21).
- Callouts rendered twice (#118 c9, #48); blockquotes broken/multiline (#34, #117, #103, #137); toggles truncated (#46 OPEN) and toggleable headings mishandled (#111).
- Links: raw links to other Notion pages dropped (#31 c9), **Notion changed `link_to_page` → `mention` and broke @-links (#101) — API/schema drift class**, wikilink-vs-ID-anchor tension (#72), `<>` in links breaks output (#56).
- Tables: `undefined` appended (#86), second column rendered as code block (#29), columns need custom handling (#52); synced blocks wrong/double/unsupported (#43, #62, #54); math+nested lists (#140); captions (#63); text color (#28); TOC (#49); code-block crashes (#53 cpp, #47 plain text).
- Idempotency: page-reference manifest corrupted by repeated conversions (#156).

**yannbolliger/notion-exporter** (drives Notion's own export): 403 downloading the zip (#3), **missing fields in CSV export from database** (#4), recursion not working (#15) — i.e. Notion's first-party export itself is lossy/flaky. URLs: github.com/yannbolliger/notion-exporter/issues/N

**bitbonsai/notion2obsidian** README (the repair checklist — what a ZIP export is known to get wrong) [fetched via raw.githubusercontent.com/bitbonsai/notion2obsidian/main/README.md]: strips 32-char Notion IDs from every file/dir name; rewrites `[text](file.md)` → wikilinks incl. `#section` anchors; disambiguates duplicate names by folder context; **fixes asset paths after renaming**; converts callouts w/ icon mapping; converts CSV databases to tables/notes/Dataview; preserves cover images; and fetches creation dates **only via API enrichment** — confirming ZIP exports don't carry them.

---

## 5. THE BREAKAGE TAXONOMY (ranked)

Ranking = [inference] over [fetched] counts. Frequencies: title-keyword hits over the sampled corpora (OI n=215 most-commented of 465; yarle n=230 of 289) — overlapping classes, rough by design.

| # | Class | OI hits | yarle hits | Marquee evidence | Severity note |
|---|---|---|---|---|---|
| **B1** | **Silent loss + lying success reports** (skips w/o reason, failures counted as success, aggregate counts that don't reconcile) | 16 | 19 | yarle #369 "47 succeeded, 0 failed" w/ 4 notes missing; #358 logs failure then "converted successfully"; #405 skip reasons absent; #116 fails not counted; #212 no warning on corrupt input; OI #561, #364 "no error details", #392, #35 ($500 bounty) | The meta-class: it turns every other class from a bug into an undetected data loss. Directly monetized by Obsidian ($500). |
| **B2** | **Link rewriting/integrity** (internal note links, anchors, renamed targets, untitled targets) | 3* | **37** | yarle #653 (open), #530, #482, #478, #609; OI #303 (urlencoded), #306; n2md #31, #101, #72; n2obsidian's core feature | *OI titles undercount; its HTML pipeline does rewriting internally, but when filenames change (B4) links break — the classes compound. Highest-volume class in the Evernote corpus. |
| **B3** | **Attachments & images** (paths, root-dumping, base64, remote fetch failures, name collisions, size-suffix syntax) | **35** | 26 | OI #561: 347 of 776 failures were attachment HTTP 403/404; #538, #114, #298; yarle #329, #554, #163, #457 | Highest-volume class in the OI corpus; in the one quantified migration, attachments ≈ 45% of all failures. |
| **B4** | **Filename/path sanitization** (illegal chars, length, unicode, case, trailing dot/space, truncation) | 12 | 26 | OI #561: 377 ENAMETOOLONG failures; #303, #381, #456, #484; yarle #514, #462, #455, #503 | The mechanism that BREAKS B2 and B3 downstream — every rename must rewrite every reference. Unicode (Cyrillic/CJK/accents) is a recurring sub-family (OI #66, yarle #578/#637/#638, Bear #515). |
| **B5** | **Block-construct fidelity** (toggles, callouts, tables, nested lists, checkboxes, code blocks, math, synced blocks, columns, highlight/color, underline/strikethrough) | 20 | 16 | OI #469/#504/#82; yarle #324 (content lost, c15), #662 (open, c17); n2md #118, #127, #43 | Finite, enumerable set — the same ~12 constructs recur across all three trackers. Worst instances are silent CONTENT loss (yarle #324, #140), which promotes them into B1. |
| **B6** | **Folder structure / hierarchy / nesting** | 15 | 18 | OI #450 (flattened), #83, #58; OneNote #418/#100/#165; yarle #353, #678; n2md #58 | Includes nested pages, notebook stacks, section groups; flattening is silent and global. |
| **B7** | **Metadata: dates, properties, tags, frontmatter** | 13 (+5 tag) | 14 (+18 tag) | OI #479/#478; yarle #623 (all timestamps = conversion time), #411, #674; n2md #26 (open); n2obsidian needs API for created dates | Dates are the most-missed property; tag hierarchies and unicode tags second. Notion ZIP simply lacks creation dates — only API has them. |
| **B8** | **Databases / CSV / structured data** (Notion-specific) | 7 | — | OI #421: file exports "don't include necessary data to recreate Databases" ($5,000 bounty); #415, #470, #641; n2md #22/#85; yannbolliger #4 (CSV missing fields) | Low count, existential severity for Notion users: relations, formulas, views are unrecoverable from ZIP. Any honest importer must DECLARE this, not paper over it. |
| **B9** | **Scale & process robustness** (hangs, memory, huge zips, rate limits, retries) | 12 | 5 | OI #266 (c46), #61, #206; OneNote #334 (c34) + rate-limit family; yarle #374, #204, #55 | The two most-commented OI import bugs live here; failure mode is usually zero diagnostics (feeds B1). |
| **B10** | **Idempotency / re-import** (duplicates, overwritten assets, non-incrementing suffixes, corrupted manifests) | ~5 | ~3 | OI #142, #298, #460, #398, #647; n2md #156; yarle #454, #363 | Small but decisive for a product that promises safe re-runs. |
| — | (API-importer-only) auth/pagination/schema drift | ~10 | — | OI #474, #453, #512, #457; n2md #101 | Only relevant if frontmatter ships an API-side Notion importer; version-stamp everything. |

**Cross-corpus convergence [inference]:** the two corpora rank differently at the top (yarle: links; OI: attachments) but share the identical top-5 set {silent loss, links, attachments, filenames, constructs}, and B4→B2/B3 coupling (rename ⇒ broken reference) appears in every tool. That coupling — not any single converter bug — is the structural defect of the whole category.

---

## 6. The verification-report spec — what "536 in, 536 out" must check and display

Derived point-for-point from the corpus above. [inference] on [fetched] evidence; each rule cites the failure it prevents.

### 6.1 The invariant (non-negotiable core)
Every source item (note, attachment, folder, database/CSV) lands in **exactly one** terminal bucket — `imported | merged | skipped(reason-code) | failed(reason-code)` — and the buckets **sum exactly** to the source census. No "other", no unaccounted remainder (OI #561's own numbers don't reconcile: 10,544+976+776 vs "172 remaining"). Two hard rules from yarle's lying logs:
1. **Count the OUTPUT, not the loop.** Success totals must be derived by re-scanning the destination filesystem, never by incrementing a counter in the conversion loop (yarle #369: error logged, note counted as success anyway; #358: "Failed to convert" followed by "converted successfully").
2. **Terminal state per item, single writer.** An item that ever errored cannot end in `imported` unless a later retry verifiably succeeded (yarle #358, #116).

### 6.2 The seven report panels
1. **Reconciliation table** — source census (N notes, M attachments, F folders, D databases, discovered by an independent pre-pass over the ZIP/ENEX) vs the four buckets, summing exactly. Headline only goes green at `unaccounted = 0`. (OI #561, #364.)
2. **Per-item failure/skip ledger** — for every non-imported item: source path/ID, human reason, reason CLASS code, and proposed remedy; never bare "Notes skipped: 1..7" (yarle #405, #116; OI #561: "Where was it?"). Machine-readable JSONL sidecar + rendered view; exportable so a re-run can target exactly the failed set (OI #561 "Recovery" ask).
3. **Rename & truncation ledger** — every sanitization event old→new (illegal chars, ENAMETOOLONG truncation, trailing dot/space, case collisions, unicode normalization NFC/NFD, dedup suffixes), each linked to the link-rewrite audit proving inbound references were updated (yarle #652 requests exactly these warnings; #482/#635 show renames breaking links; OI #303/#66/#381/#456).
4. **Link-resolution audit** — after import, resolve every internal link and attachment reference against the actual output tree: `L links found / R resolved / U unresolved (listed with source + intended target)`; also flag orphan attachments written but referenced by nothing (yarle #554 "saved but not used", #329, #163; OI #538). External URLs: never fail the import for them — reproduce them as-is and list them (OI #561's explicit ask).
5. **Attachment transfer table** — per attachment: bytes in/bytes out, destination path, and for remote fetches the HTTP status with an automatic retry queue for 202/5xx and a distinct class for 403/404 on platform-hosted assets (OI #561's census: 347×403/404, 4×202, 5xx, cert errors; base64 class per OI #539, OneNote #336).
6. **Construct-downgrade declarations** — a detector per known-lossy construct (Notion: databases/relations/formulas/views, toggles, callouts, synced blocks, columns, colors, TOC, AI-meeting-notes blocks; Evernote: highlight/color, underline, encrypted spans, tasks, webclips) that COUNTS occurrences and prints "X databases exported as CSV husks — relations/formulas/views not representable in files (Notion limitation)" instead of silently flattening (OI #421's official concession; #553; yarle #543; n2md #22/#46/#54). Honesty here is a differentiator no incumbent has.
7. **Metadata-preservation matrix** — per field (created, updated, tags incl. hierarchy + unicode, source-url, author, location, properties): preserved-count / lost-count / WHERE it lives now (frontmatter key), plus an explicit check that output file mtimes were set to source dates, not conversion time (yarle #623, #486; OI #479/#478; yarle #411/#637/#638; EN #48).

### 6.3 Content-integrity spot checks (why count parity isn't enough)
Count equality passes while content silently vanishes (yarle #324 nested-list content loss, #328, #140 anchor-swallow; OI #53, #381, #492). Cheap per-file invariants, flagging outliers for human review: character/word mass delta beyond threshold, block counts (headings, list items, checkboxes, code fences, table rows) source-vs-output, attachment reference count. Display as a "fidelity histogram" with the worst-N files listed. Deep diff only on flagged files keeps it fast at 10k-page scale (OI #561, #266 hang class).

### 6.4 Determinism & re-run contract
Re-running the same import must produce either a verified no-op or a declared delta — no duplicate files, no re-downloaded/overwritten assets, incrementing suffixes that actually increment (OI #142/#460/#398/#647; n2md #156; yarle #454/#363). The report states which mode ran (fresh/incremental) and what the delta was.

### 6.5 Environment & provenance stamp
Record in the report header: source platform + export flavor and version (Notion ZIP-HTML vs ZIP-MD vs API + API schema date; ENEX from Evernote legacy vs v10 — yarle #218/#405 show they differ), importer version (OI #453: 1.8.1 found fewer pages than 1.8.0), OS + filesystem limits hit (Windows path length, reserved names, case-insensitivity), and unicode normalization applied. Without this, a "536/536" claim is unreproducible.

### 6.6 Failure-mode UX rules
- Never hang without progress at item granularity (OI #266/#61; progress must not break when items skip/fail — OI #392).
- Corrupt/malformed inputs produce a named warning, not silence (yarle #212).
- One-item failures (a single PDF, an empty title) must never abort the batch (OI #323, OneNote #240).
- Rate-limited sources back off and resume, and say so (OneNote #334/#120/#437).

**Bottom line [inference]:** the corpus shows incumbent importers fail loudest not at conversion but at *accounting* — and users are already asking for the reconciliation artifact (OI #561, #35 bounty, yarle #369/#405). A frontmatter import report that enforces §6.1's invariant and renders §6.2's seven panels would be verifiably better than every tool sampled, and each line of it is traceable to a real, cited breakage."