I mutated nothing: this task was read-only (three `Read` calls and one `wc`); no file was written, edited, or committed, and no `~/.claude` path was touched. The reported dirt predates this subagent.

## 33. Search and retrieval

**33.1 Decisions**

| # | Decision | Anti-recommendation | Falsified by |
|---|---|---|---|
| S1 | Keep `minisearch@7.2.0` as the only index at 1k–10k notes | Do not migrate to Orama, FlexSearch, or Lunr; do not add a second engine "for CJK" | A profiled query p95 >50 ms at 10k notes on the target hardware |
| S2 | Ship a ~15-line CJK bigram `tokenize`, passed identically to index-time and search-time | Do not ship `Intl.Segmenter`; do not bundle a wasm morphological analyser | Bigram top-1 falling below segmenter top-1 on a named, human-labelled CJK query set |
| S3 | Diacritic folding scoped to `\p{Script=Latin}` plus an explicit `ß→ss` / `æ→ae` / `ø→o` map | Do not ship `.normalize("NFD").replace(/\p{Mn}/gu,"")` globally | Any regression where a Latin-scoped fold changes a non-Latin byte |
| S4 | Per-file incremental indexing keyed on blob SHA, with `MiniSearch.loadJSON` persistence | Do not keep the current whole-index rebuild on HEAD change | Blob-SHA keying missing an edit that HEAD-keying would have caught |
| S5 | Ripgrep in `src-tauri` is the permanent exact/regex fallback path | Do not compile Tantivy to wasm; do not adopt DuckDB-wasm | Fallback latency exceeding index latency on a 74 MiB corpus |
| S6 | No persistent vector store. Embeddings permitted only as a query-time re-rank of ≤30 BM25 candidates | Do not build local RAG as a retrieval path; do not add an ANN index | Re-rank moving top-1 by ≥10 pp on the wikilink relevance harness — below that, delete it |

**33.2 Engine comparison, read 2026-08-29**

| Engine | Version / published | Size or downloads | Query | CJK support | Verdict |
|---|---|---|---|---|---|
| **MiniSearch** | 7.2.0, 2025-09-16, unpacked 826,513 B | 2,659,659 npm/wk; 6,115★ | 0.88 ms @4,548 notes `[measured]` | None built in; `tokenize`/`processTerm` are function arguments | **Keep.** The only engine whose fix is an argument, not a migration |
| Lunr | 2.3.9, **2020-08-19** | 7,542,972 npm/wk; 9,200★ | 11,527 q/s `[fetched, vendor]` | `lunr-languages` + TinySegmenter fork | **Reject.** Index is immutable after `build` — fatal for per-file incremental |
| FlexSearch | 0.8.212, 2025-09-06, unpacked 2,334,755 B | 1,407,279 npm/wk; 13,784★ | 50,955,718 q/s `[fetched, vendor]` | `Charset.CJK` built in `[fetched]` | Fastest on paper; the vendor's own harness claims a 2,390× gap over MiniSearch, which is not credible as stated |
| Orama | 3.1.18, 2025-12-19, unpacked 2,192,356 B | 1,304,705 npm/wk; 10,537★ | 29,445 q/s `[fetched, vendor]` | 32 locales, **zero CJK**; `@orama/tokenizers/japanese` and `/mandarin` are separate packages `[fetched]` | **Reject.** You would migrate engines and still write a tokenizer |
| Fuse.js | 7.5.0, 2026-07-13 | 13,851,708 npm/wk; 20,462★ | **422 q/s** — slowest in the vendor table `[fetched]` | None; no BM25, no analyzer | **Reject as primary.** A fuzzy matcher, not an IR engine |
| Tantivy | 0.27.0 repo / crates 0.26.1, 2026-04-21 | 3,783,112 dl/90d; 16,005★ | "~2× faster than Lucene" `[fetched, vendor README line 132]` | `tantivy-jieba` 0.20.0, `cang-jie`, `lindera-tantivy` 5.0.1, Vaporetto | **Right engine, wrong runtime.** `src-tauri` only |
| SQLite FTS5 | `@sqlite.org/sqlite-wasm@3.53.0-build1`, 2026-04-21, 2,829,040 B | 1,045★ | — | `unicode61` does **not** segment CJK; `trigram` is the substring escape hatch `[fetched, sqlite.org/fts5.html]` | The 100k-note target. Caveat: `detail=none/column` forbids tokens >3 chars |
| DuckDB-wasm | 1.33.1-dev57.0, 2026-06-22 | **unpacked 149,377,663 B (142 MiB)** | — | via extension | **Reject.** 142 MiB of package to run BM25 over 74 MiB of prose |
| Ripgrep | 14.1.1 (rev `939d4325be`) | 67,675★ | linear scan; `grep -rF` over 74 MiB = **1.24 s** `[measured]` | UTF-8 native; never tokenises, so CJK works by construction | **Keep as fallback.** No index means no staleness bug |
| sql.js / wa-sqlite / PGlite | 1.14.2 (24,151,707 B) / 1.0.0, **2024-01-05**, no npm licence field / 0.5.8 (25,437,263 B) | — | — | — | Superseded, legally unreviewed, and overkill respectively |

Recorded disagreement: the FlexSearch table is the vendor's own harness and puts MiniSearch at 5,849 q/s against Orama's 4,454 — a 1.3× gap — while claiming 13,981,110 for itself. Treat the ordering as informative and the magnitudes as not. `[fetched]`

**33.3 Measured baseline — what ships today**

| Item | Value |
|---|---|
| Index fields, ladder | `title, tags, body, code`; 3-pass AND→OR→fuzzy(1) `[measured, src/modules/vault/infrastructure/search-index.ts]` |
| Default tokenizer | `/[\n\r\p{Z}\p{P}]+/u` — splits on space and punctuation only, not `\p{S}`, not script boundary `[measured]` |
| `東京都の図書館で本を借りた` | tokenises to **1 token, 13 chars** `[measured]` |
| `図書館`, `图书馆`, `大学`, `本` | **0 hits each** `[measured]` |
| Why anything matches | pass 1 sets `prefix` on the last term, so only **document-initial** CJK substrings hit `[measured]` |
| Diacritics | `processTerm` is `toLowerCase()` only; `cafe`→`café`, `resume`→`résumé`, `maximo`→`máximo` all MISS `[measured]` |
| GFM tables | rows written `\|Name\|Type\|` index as ONE token; no cell is retrievable `[measured, in-repo comment lines 80-85]` |
| Incremental | none — `ensureCache()` keys on `getHeadSha()` and rebuilds from a fresh zipball on any HEAD change: **7.0 s plus a zipball download per commit** at 4,548 notes `[measured]` |

Reference corpus: **4,548 `.md` files, 77,549,893 bytes (74.0 MiB), mean 17,051 B/note**; 358 files (7.9%) contain CJK, 9,577 CJK characters total. `[measured]`

**33.4 The CJK fix**

Harness: every CJK n-gram of length 2–4, keep the **2,389** occurring in exactly one file (of 2,854 distinct), deterministically sample 200, gold = that file, run the shipped 3-pass ladder. Node v24.6.0, macOS 25.6.0. `[measured]`

| Tokenizer | recall@30 | top-1 | any-result | mean query ms | index JSON |
|---|---|---|---|---|---|
| default (shipped) | 85/200 = **42.5%** | 39.0% | 54.0% | 0.13 | 28,296,206 B |
| **CJK bigram** | 200/200 = **100.0%** | **99.5%** | 100.0% | **0.03** | 28,383,334 B |
| CJK bi+trigram | 100.0% | 99.5% | 100.0% | 0.03 | — |
| `Intl.Segmenter` (ICU/UAX-29) | 196/200 = 98.0% | **81.0%** | 100.0% | 0.04 | 28,304,189 B |

- Delta on this harness: **+57.5 pp recall@30, +60.5 pp top-1, −77% query latency, +0.31% index size** (87,128 B on 28,296,206 B). `[derived]`
- **Recorded disagreement, unresolved:** our stated baseline is **18.1%**; this harness measures **42.5%** on the same engine. The auto-derived n-gram query set over-samples document-initial runs that the `prefix` pass rescues, which plausibly explains the gap. Against 18.1% the delta would be **+81.9 pp** `[derived: 100.0 − 18.1]`. **Do not average them, do not publish a range; re-run one harness over one named corpus before either number is quoted externally.**
- **Ship the bigram, not the segmenter.** `Intl.Segmenter` scores 18.5 pp worse on top-1 (81.0% vs 99.5%) because dictionary boundaries do not align with the arbitrary substrings people type: `图书馆` segments as `图书|馆`, and `東京都の図書館で本を借りた` as `東京|都|の|図書館|で|本|を|借り|た`. `[measured]` It is also absent from Firefox before 125 (Chrome 87, Safari 14.1, Node 24), so a bigram fallback is required regardless. `[fetched, MDN BCD]`
- Implementation, no new dependency, no wasm, no download: split on `/[\n\r\p{Z}\p{P}]+/u` as today; for any part matching `/[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF]/`, emit every character **and** every adjacent bigram; else emit the part unchanged. Pass the same function as the search-time `tokenize`.
- Rejected on size: `kuromoji@0.1.2` (**2018-03-19**, 41,263,301 B), `jieba-wasm@2.4.0` (16,126,591 B), `budoux@0.9.1` (2,659,103 B, a phrase-breaker not an index). `lindera-wasm@6.0.0` (1,842,304 B) is the only defensible wasm option and is still unnecessary. `[fetched]`

**33.5 Diacritics and Indic — a separate defect**

- Devanagari uses spaces, so it is **not** the CJK failure; `भारत की राजधानी नई दिल्ली है` tokenises correctly today. `[measured]`
- The real Indic failure is normalisation: `हिंदी` (anusvara) does not match `हिन्दी` (conjunct) — 0 hits. `[measured]`
- The obvious fix is a trap: `t.normalize("NFD").replace(/\p{Mn}/gu,"")` fixes `cafe`→`café` but **corrupts Devanagari** (`हिन्दी`→`हिनदी`) and still does not fix `strasse`→`Straße`. `[measured]`
- Fold only within `\p{Script=Latin}`, add the explicit `ß/æ/ø` map, and handle Indic with NFC plus a small anusvara↔conjunct equivalence table. Accent-insensitivity is the single largest user request in the category: forum.obsidian.md/t/1655, opened 2020-06-11, **760 likes, 151 posts, 11,376 views**. `[fetched]`

**33.6 Architecture by scale, and where each tier breaks**

| Tier | Stack | Measured / derived cost | Breaks at |
|---|---|---|---|
| **1k notes (~3–17 MiB)** | MiniSearch in-process, CJK bigram, Latin-scoped folding, per-file replace, serialized index in IndexedDB | **946 ms build, 4.1 MiB index (0.34× corpus), 0.18 ms/query, 52.4 MiB heap** `[measured]` | Nothing. Do not add a second system |
| **10k notes (~30–170 MiB)** | Same engine, indexing moved to a Worker, rebuild strictly per-file | ~15.5 s full build, ~60 MiB index, ~490 MiB heap `[derived at 95 ms/MiB, 0.36×, 3.0×]` | The **full-rebuild path**, not query. A 15 s stall per commit is the failure; second break is heap on a 4 GB iPad |
| **100k notes (~300 MiB–1.7 GB)** | **SQLite FTS5 via `@sqlite.org/sqlite-wasm` on OPFS** with a bigram-expanded content column (or `trigram`), ripgrep in `src-tauri` as the exact path, Tantivy native only if FTS5 ranking proves insufficient | At 17,051 B/note: **~27 min build, ~614 MB index JSON, ~5.1 GB heap** — a tab does not survive it. Even at 3 KB/note: ~29 s, ~108 MB index, ~900 MB heap `[derived]` | OPFS write throughput on first index. FTS5's `unicode61` still does not segment CJK, so **the bigram expansion is required at every tier** `[fetched]` |

Scaling is linear in **bytes**, not notes: 78.8 ms/MiB at 1k, 95.0 ms/MiB at 4,548 `[derived: 946/12.0, 7027/74.0]`. Terms grow 21,978 → 114,711. `[measured]`

Constant across all three tiers: the index is a projection of the files, never a source of truth, deletable and rebuildable at any moment — the same rule the board, calendar, and decision-card views already obey.

**33.7 Local RAG over the vault — distraction as a retrieval path**

- The published evidence does not support replacing lexical retrieval: BEIR (arXiv 2104.08663, 2021-04-17, rev 2021-10-21, 18 datasets, 10 systems) finds BM25 a robust baseline with dense retrievers often underperforming and re-rankers winning "at high computational costs"; *Lucene Is All You Need* (arXiv 2308.14963, 2023-08-29) finds a dedicated vector store unnecessary; BM25S (arXiv 2407.03618, 2024-07-04) reports up to **500×** over the popular Python BM25. `[fetched]`
- *Seven Failure Points of RAG* (arXiv 2401.05856, 2024-01-11) states validation "is only feasible during operation." For an engine whose differentiator is cross-engine degradation certification, shipping a component validatable only in production is a category error. `[fetched]` `[inference]`
- *RAG vs long context* (arXiv 2407.16833, 2024-07-23) finds RAG's only durable advantage is **cost** — precisely the regime that does not bind for one user's vault. `[fetched]`
- Cost if we ever do it: `Xenova/all-MiniLM-L6-v2` int8 is **22,972,370 B (21.9 MiB)**; this vault is ~37,900 chunks at 512 tokens = 13.9 MiB of int8 vectors `[derived]`. Storage is not the constraint (Chromium allows 60% of disk per origin `[fetched, MDN]`); the first-run embed pass is.
- **Verdict: permitted only as a hidden query-time re-rank of the ≤30 BM25 candidates — no persistent store, no first-run pass, no settings — and deleted if it does not move top-1 by ≥10 pp on the wikilink-derived relevance harness.** `[inference]`
- No study cited here measures a personal markdown vault; anyone claiming embeddings win for personal notes is extrapolating from web/QA benchmarks. `[inference]`

**33.8 Anti-recommendations**

1. Do not expose search settings. Every top complaint in the category is a **default** being wrong; a "CJK mode" toggle converts a fixed bug into a permanent support surface.
2. Do not build a plugin API for custom analyzers — already excluded by the no-marketplace and no-eval constraints, and it would let a third party silently break the degradation certificate.
3. Do not add an ANN index: `voy-search@0.6.3` (2023-09-20) and `hnswlib-wasm@0.8.2` (2023-07-08) are ~3 years stale, and a flat scan under 100k vectors is faster than the index build. `[fetched]`
4. Do not build persistent RAG before the tokenizer ships. Between 57.5 and 81.9 pp of free recall is sitting unclaimed behind a 15-line function. `[measured]`

**33.9 Build order**

1. CJK bigram `tokenize`, index and search side, one function, zero dependencies.
2. Latin-scoped diacritic folding plus the `ß/æ/ø` map.
3. Per-file incremental indexing on blob SHA plus `MiniSearch.loadJSON` persistence — removes the 7.0 s rebuild per commit.
4. Add `|` to the split class, fixing the documented GFM-table defect.
5. Build the wikilink-derived relevance harness as a permanent gate; refuse any search change that does not move it.
6. Only then evaluate the 30-candidate re-rank against its pre-committed ≥10 pp threshold.

---

## 34. Collaboration model

The sync substrate is settled: git-merge plus splice journal plus compare-and-swap, never a CRDT. This section specifies the collaboration model that rides on it.

**34.1 Model scorecard** (1–5, 5 best; "splice fit" = compatibility with `locate byte range → replace those bytes only → every untouched byte bit-identical → else REFUSE`)

| | Real-time CRDT (peer) | Server-authoritative OT | **Git branch-and-review** | Patch exchange |
|---|---|---|---|---|
| Conflict handling | 3 — never blocks, merges wrongly and silently | 4 — one authority, degrades on long offline branches `[fetched]` | 4 — **0 conflicts on disjoint paragraphs, 1 on same-line edits, 1 on reflow-vs-edit** `[measured, synthetic 3-way fixture]` | 4 — same engine, explicit sender-side rebase |
| Offline | 5 | 2 | 5 | 5 |
| Byte fidelity | **1** — encoded overhead **+52.5% (Yjs) to +146.3% (Loro)** over the plain text; the `.md` degrades to a projection `[derived]` | 2 | **5** — bytes on disk *are* the document | **5** |
| Auditability | 2 — per-keystroke ops, no human-legible unit | 3 — server log, not user-facing | **5** — commit, author, message, signature, `Co-authored-by` | **5** |
| Implementation cost | 1 — new sync engine, relay, storage | 2 — bespoke server; hardest thing on this list | **4** — `merge3 + baseSha` already exists in the codebase | 3 — engine free, UX expensive |
| Splice fit | **1 — actively hostile.** REFUSE has no meaning inside a CRDT | 3 | **5 — native.** A splice *is* a patch | **5** |
| **Total /30** | **13** | **16** | **28** | **27** |

**34.2 Why the category does not ask for live cursors**

| Evidence | Number | Source |
|---|---|---|
| Async git vs commercial real-time multiplayer, in our exact beachhead | `obsidian-git` **3,067,376** vs `system3-relay` **190,728** = **16.08×**; vs `peerdraft` 18,796; vs both combined (209,524) = **14.64×** | `[fetched, obsidian-releases stats 2026-08-29]` `[derived]` |
| Ranking | Git **rank 6 of 7,020**; Relay rank 118; `obsidian-livesync` (async replication, not co-typing) 894,228 at rank 29 | `[fetched]` |
| The "fishbowl effect" | "Writers don't want first drafts visible to the editor." Interviewees reported **putting devices into airplane mode** to stop edits being shared | `[fetched, Ink & Switch, Upwelling, March 2023]` |
| Prior art on the same finding | Wang, Tan, Lu (2017), *Why Users Do Not Want to Write Together When They Are Writing Together*, DOI `10.1145/3134742`, 53 citations | `[fetched, Crossref]` |
| Unit economics | Liveblocks $0.002/realtime-minute → 2 h/day × 22 days = 2,640 min = **$5.28/user/month**, above both the $4/mo individual and $5/seat team prices before any other COGS. Even 1 h/day × 20 d = $2.40 = 60% of the $4 plan. SOC 2 begins at the **$500/mo** tier | `[fetched]` `[derived]` |
| Line discipline in the real corpus | **4,702 markdown files / 445,836 prose lines**: median 52 chars, mean 74.8, **81.96% ≤ 100 chars**, only 5.99% > 200 — already near semantic linefeed, so git's line-granular merge is a good fit, not a poor one | `[measured]` |

Three independent commercial products converged on proposal-and-adjudication rather than presence: Google's suggesting mode (overlay in a distinct colour, deletions struck through, owner emailed, accept/reject one-by-one or Accept all / Reject all `[fetched, support.google.com/docs/answer/6033474]`), GitBook's change requests ("based on the concept of branching, and feels familiar to anyone who uses pull requests" `[fetched]`), and Decap's `publish_mode: editorial_workflow` (save draft = commit to branch `cms/collectionName/entrySlug` plus open PR; approve = merge PR and delete branch `[fetched]`).

**Suggesting mode is asynchronous review implemented on top of a real-time substrate — the substrate is not what users are buying, the proposal-to-adjudication loop is.** `[inference]`

**34.3 What we lose without live cursors, stated honestly**

| Genuinely lost | Not lost |
|---|---|
| Live-call co-editing of meeting notes | Multi-device (git sync) |
| The "I'm on line 40, you take line 80" coordination signal | No data loss (commits) |
| The trust cue that a document is not stale | Review (branches, per-hunk accept) |
| A demo moment that sells screenshots | Attribution (`Co-authored-by`, signatures) |
| | Offline (the repo is a primary copy) |

Ship a **presence badge without a cursor** — "Priya has this file open, last edit 2m ago" — which recovers the coordination value at roughly 1% of the cost and does not create the fishbowl. Anti-recommendation: do not build live cursors as a trust signal.

**34.4 Strongest counter-argument, at full strength**

Ink & Switch — the most credible primary source here and the one this section otherwise leans on — found async-only insufficient: they "experimented with an asynchronous-only collaboration model but found that while drafts often have a single primary author, those authors often find it useful to be able to share an in-progress draft for initial feedback." `[fetched]` GitBook independently ships Live edits alongside Change requests. `[fetched]` The honest reading is that async-only fails at the limit, and the failure mode is *two people on one draft for twenty minutes* — served by an ephemeral live layer over a shared branch, not by peer CRDT, per-keystroke persistence, or a bespoke sync engine. `[inference]`

**34.5 Staged migration**

| Stage | Ship | Reversible? |
|---|---|---|
| **0 — now** | Rename the model **"branch and review"** in all internal docs; remove CRDT rows from the pillar tables; move `Multi-user concurrent state, presence` to SERVER · not this cycle | n/a |
| **1** | **Suggestions as splices.** A suggestion is `{baseSha, byteRange, replacement, author}` in the sidecar; accept = a splice, reject = a delete. Materialise to JSON always; CriticMarkup optionally and only as **a byte format we own** — `criticmarkup.com` is a parked domain and `CriticMarkup/CriticMarkup-toolkit` (848★) last committed **2021-02-27** `[fetched]` | Fully — deleting the sidecar leaves a valid repo |
| **2** | **Branch and review.** Drafts as real git branches, `Co-authored-by` on session-batched commits, review UI = per-hunk accept over the splice list | Fully — it is git |
| **3 — only if evidence demands** | **Ephemeral live layer.** Presence plus a short-lived shared buffer over one branch; persist on session close as one splice batch, never per keystroke | Yes, by design |
| **4 — exit hatch** | If Stage 3 proves insufficient, adopt **Loro** (`loro-crdt` 1.15.0, published 2026-08-27, Fugue + Eg-walker) **as an ephemeral in-session buffer only**. The persisted artifact stays the `.md` | The one-way door is persisting CRDT state. Never cross it |

**34.6 Anti-recommendations**

- **Never persist CRDT state as the document.** This is the single irreversible decision in this section and it deletes the splice guarantee: a CRDT always converges, so REFUSE has no meaning inside one. The measured failure in a competitor is exactly this — a byte contract that exists only inside a live CRDT server, where agent edits error out without it. `[measured]`
- Do not adopt Automerge on the strength of its 3.0 blog post alone. The "memory usage cut by over 10×" and "700 MB → 1.3 MB" claims are the vendor's `[fetched]`; the only independent table available still pins automerge 2.1.10, yjs 13.6.11, ywasm 0.9.3, loro 0.10.1 against today's 3.4.1 / 13.6.32 / 1.15.0. The numbers are not reconciled and must not be quoted as if they were.
- Do not build a bespoke OT server. OT won in the field because Google, Microsoft, and ShareDB already paid for it (`sharedb` 6.0.2, 6,535★); a solo founder should not re-pay. `[fetched]` `[inference]`
- Do not model on Prose.io: dead since commit `9ef717ea94d1`, **2024-02-09**, README openly seeking maintainers. The git-CMS graveyard is real, and Decap and GitBook survived by adding **review**, not real-time. `[fetched]`
- Do not ship Pijul-style first-class conflicts as a user-facing concept — right theory (`~1.0.0-beta` after years), wrong surface for a deliberately simple product. `[fetched]`
- Patch exchange (git send-email, Radicle 1.10.2 released 2026-08-26, Sourcehut still "public alpha") is a source of design ideas, not a shippable UX: every project in that lineage is beta, alpha, or single-maintainer. `[fetched]` `[inference]`

Decision falsified by: a beachhead cohort where real-time plugin installs exceed git plugin installs, or a measured merge-conflict rate above 5% of multi-author sessions on the real corpus.

---

## 11. The AI layer — what AI-native actually means

**11.1 The retention evidence, before any feature list**

Active-install proxy = peak single-version downloads, across 7,020 plugins with stats and 142,701,824 cumulative downloads. `[measured, obsidianmd/obsidian-releases, 2026-08-29]`

| Capability class | Peak-version sum | Cumulative | Members |
|---|---|---|---|
| Deterministic **projection** (Dataview, Kanban, Calendar, Tasks, TaskNotes) | **7,289,307** | 15,840,093 | 5 |
| Deterministic **structure** (Linter, Outliner, Tag Wrangler, Table Editor, Templater) | **2,019,220** | 12,057,166 | 5 |
| **Agentic** in-vault (Copilot, realclaudian, agent-client, smart-composer) | 463,062 | 4,133,966 | 4 |
| **Ambient** related-notes (Smart Connections, second-brain, lookup, ExcaliBrain) | 293,333 | 1,631,201 | 4 |
| **Generation / chat** (textgenerator, bmo, chatgpt-md, local-gpt, ollama, gpt3-notes) | 202,778 | 924,287 | 6 |
| **Voice capture** (whisper, transcription) | 46,478 | 87,502 | 2 |

- **Deterministic projections out-install every AI capability combined by 7.25×** `[derived: 7,289,307 ÷ 1,005,651]` — which is the strongest available validation of the projection law, arriving from outside our own thesis.
- **697 of 7,058 plugins (9.9%) describe an AI capability but take only 6.09% of cumulative downloads and 3.44% of the peak-version sum** — AI is over-supplied and under-installed by ~2.88× on the active-install measure. `[measured]` `[derived]`
- Source disagreement, recorded not resolved: the popular "AI plugins get abandoned" story is **false on the supply side**. AI-described plugins are *less* stale — **11.3% (78/688) unreleased >12 months vs 20.9% (1,464/7,020)**, median 50 days since last release vs 71. The cohort is younger, which partly confounds it. The abandonment is demand-side: actively maintained products that few people install. `[measured]` `[inference]`
- The largest file-native editor in the category ships no AI at all: **zero occurrences of the token "AI" across 9,502 chars** of its full Active/Planned/Launched roadmap back to July 2023. What it does ship is Bases (data in local markdown properties, views described in valid YAML), Kanban and Calendar views for Bases, an Airtable→Markdown import, a CLI, and a Keychain for plugin API keys. `[measured]` `[fetched]`

**11.2 Ranked capabilities — build in this order**

| Rank | Capability | Retention evidence | Splice shape | Cost/op |
|---|---|---|---|---|
| **1** | **Transformation verbs on a selection** — summarise, expand, restructure, translate, change register, extract entities, to-table | Strongest of the set: Bing Copilot telemetry over **200k conversations** finds "the most common and successful AI-assisted work activities involve information work — the creation, processing, and communication of information" (arXiv 2507.07935v6, upd 2025-12-22) `[fetched]`. Notion's shipped surface is "Edit with AI" on a highlighted range `[fetched]` | Perfect — output *is* a byte range | $0.004–$0.03 |
| **2** | **Frontmatter-key fill and repair** — tags, status, dates, typed links | Structure bucket 2,019,220 active installs, won today by deterministic tools `[measured]` | Perfect — a YAML key is the addressable unit; profiles already read them | <$0.002 |
| **3** | **Agent edits arriving as suggestions** (MCP `land()` into the review loop) | Fastest-growing AI bucket at 463,062; `realclaudian` is **#13 by cumulative downloads across all 7,058 plugins** (1,940,612). Users are filing "Improve Agent Mode **review and consent controls**" (2026-08-19) against the market leader — they are asking a competitor for our differentiator `[measured]` `[fetched]` | Perfect — a splice against `baseSha` | per-op |
| **4** | **Q&A over the open file with byte-anchored citations** | Real but shallow: ChatPDF claims "10M+ users" and "1,000,000+ Q's answered every day" = **0.1 queries per registered user per day** `[derived]` — signup scale, not habit scale | Perfect — a citation *is* a byte range | ~$0.005 |
| **5** | Heading/structure repair as a proposed diff | Currently won by determinism: Obsidian Linter 112,395 active installs, no AI `[measured]` | Good — do the deterministic 80% first, AI only for what regexes cannot decide | ~$0.006 |
| **6** | Scoped multi-document synthesis — explicit N files, never "the vault" | Real and throttled by its own vendor: Gemini Notebook caps at **50 chat queries/day**, 100 notebooks × 50 sources × 500,000 words `[fetched]` | Acceptable — bounded input set, ideally a projection's filter result | $0.01–$0.10 |
| **7** | Voice capture into the file | Real category, tiny in-vault (46,478). Two companies pivoted *out of* the document to chase it — Tana's meeting platform is now "a separate product from Tana Outliner"; Mem is now "Your AI chief of staff" `[fetched]` | Acceptable, as capture-to-inbox only | external ASR |
| **8** | Ambient related-notes / duplicate detection | **Highest maintenance burden per install in the category**: Smart Connections 5,407★ with 489 open issues = **9.05% issues-per-star vs Copilot's 1.30% (99/7,640)**; the most-commented open issues are all silent index breakage — "Pane is always loading" (39), "Embeddings no longer function (linux)" (24), "Doesn't seem to look at my notes" (22) `[measured]` `[fetched]` | **Poor** — requires a second index beside the file | **$38.79/user/month** |
| **9** | Ghost text / continuous completion | Declining cohort (202,778, below both agentic and ambient); `textgenerator` last released 2026-04-27, `gpt3-notes` 2023-07-07, `vault-chat` 2023-06-03 `[measured]` | Poor — writes without being asked; contradicts propose-first at the mechanism level | continuous |

**11.3 Cost arithmetic**

Corpus: `knowledge` n=590 md files, p50 **479 words**, p90 **3,584**, total 1,980,166 words; `frontmatter` repo n=186, p50 2,439, p90 10,328. `[measured]` Prices: Haiku 4.5 **$1/MTok in, $5/MTok out**; Sonnet 5 $2/$10; Opus 5 $5/$25; batch Haiku $0.50/$2.50. The same page warns Claude 4.7+ tokenizers emit "approximately 30% more tokens for the same text." `[fetched, docs.claude.com/pricing]` Assume 1 word ≈ 1.33 tokens `[inference]`.

| Operation | Tokens | Haiku 4.5 | Note |
|---|---|---|---|
| Summarise a p90 note → 200 w | 4,767 in / 200 out | **$0.0058** `[derived]` | Cheaper than one Notion credit ($0.01) `[fetched]` |
| Restructure a p90 note in place | 4,767 / 4,767 | **$0.0286** `[derived]` | Output is 83% of cost |
| Same on Sonnet 5 | 4,767 / 4,767 | **$0.0572** `[derived]` | 2× for a formatting-shaped task |
| One full pass over a 590-note vault | 2,633,621 in | **$2.63** `[derived]` | Input only |
| Ambient re-rank on every save, 20 neighbours @ p50, 100 saves/day | 1.274 MTok/day | **$38.79/user/month** `[derived: 1.274 × $1 × 30.44]` | The line that kills rank 8 |

**11.4 Explicit refusals**

| Refuse | Because |
|---|---|
| **No persistent semantic index of the vault** | A second source of truth beside the file is what the projection law forbids, it costs $38.79/user/month at 100 saves/day `[derived]`, and the market leader's most-discussed open issues are all silent index failure `[measured]` |
| **No "rewrite in my voice" as a headline feature** | Across 3 studies, 7 datasets, **>880,000 texts**, LLM writing assistance is linked to a statistically significant **21–50% reduction in writing-complexity variance (p ≤ .05)**, "emphasizing conformity over individuality" (arXiv 2502.11266, upd 2026-08-24) `[fetched]`. Ship register-shift as a one-shot verb the user asks for, never as a default or ambient suggestion |
| **No unsourced summarisation** | Entity hallucination in abstractive summarisation is documented to at least 2021 (arXiv 2102.09130), and Gemini Notebook's own help page lists "information not in sources" as a first-class failure `[fetched]`. Every summary carries the byte ranges it came from or it does not render |
| **No ambient AI buttons, no ghost text by default** | 66% of ~33,000 developers name "AI solutions that are almost right, but not quite" as their top frustration; only **3.1% highly trust** AI output (29.6% somewhat trust, 26.1% somewhat distrust, 19.6% highly distrust), and favourability fell to 59.7% from "70%+ in 2023 and 2024" `[fetched, Stack Overflow 2025]`. An unrequested suggestion spends trust the product cannot refill |
| **No AI that decides or publishes** | "Don't plan to use AI for this task": deployment/monitoring **75.8%**, project planning **69.2%**, committing and reviewing **58.7%** `[fetched]`. AI may propose a status change; the human commits it. This is also the boundary that keeps us out of Notion-style project management |
| **No meeting bot, no chief-of-staff agent** | Tana and Mem both left the document to chase it. That is a different company `[fetched]` |
| **No standalone AI SKU** | On **2024-06-01** Notion sold AI at **$8/member/month annual, $10 monthly**, "Now with Q&A". On **2026-08-29** that add-on does not exist: Free and Plus get only a trial, Agent and Enterprise Search sit inside **Business at $20/member/month**, and Custom Agents meter at **$10 per 1,000 monthly Notion credits**. Standalone document-AI became bundled table stakes plus a metered agent line in ~26 months `[fetched, two dated snapshots]` `[derived]`. Price AI as a metered line inside a free-forever editor |

**11.5 The instrumentation contract**

- Report **Strong Acceptance** — accepted only if <50% of the proposal was edited *and* the edits do not change critical parts — not raw acceptance. The only published figures for a propose-first assistant are Ansible Lightspeed: **49.08% strong acceptance on multi-line suggestions**, **Day-30 retention 13.66%** (10,696 users, 3,910 returning; arXiv 2402.17442, pub 2024-02-27, upd 2024-10-22, self-described as the first code-completion tool to publish N-day retention). `[fetched]`
- That is a small model on one narrow YAML dialect, so 49.08% is a ceiling for a constrained verb, not a general rate. `[inference]`
- **This supersedes the "~30% acceptance rates `[SS]`" line currently in `docs/FRONTMATTER-MASTER-PLAN-2026-08-28.md:82`**, which is a search summary and must not be published as fact. `[measured, grep of the plan file]`
- Record accept / reject / partial / edit-distance-after-accept **per verb, locally, publish nothing**. The entire ranking in 11.2 was reconstructed from install counts, version distributions, issue ratios, and roadmap absences — never from a survey — which is a working demonstration that behaviour is readable without asking. Telling a user who somewhat distrusts AI (26.1%) that you are measuring their rejections is the same conversation twice. `[measured]` `[inference]`
- Kill rule per verb: below 20% strong acceptance or below 10% D30 after 90 days of data, the verb is removed, not tuned.

**11.6 What "AI-native" means, in the words a user gets**

AI-native does not mean the app writes for you. It means your markdown file is the only thing that exists, and the AI is a set of precise verbs you point at a piece of it — summarise this section, turn these paragraphs into a table, fill in the tags, translate this, restructure these headings — where every verb comes back as a proposed change you can see, byte for byte, before it touches the file, and lands through the same splice writer that guarantees nothing you did not select gets rewritten. **Nothing runs in the background, nothing is indexed behind your back, nothing is published or decided on your behalf, and if you delete every model key tomorrow the file, the board, the calendar and the site all still work exactly as they did — because those were never AI features, they were always just your file, read a different way.**

Decision falsified by: transformation verbs failing to clear 20% strong acceptance in the first 90 days, or a measured demand signal for ambient related-notes that survives the $38.79/user/month line.
