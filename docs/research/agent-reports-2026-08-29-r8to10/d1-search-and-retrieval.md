I mutated nothing: no files edited/created, no commits, no writes — the only commands run were `curl`, `node -e` (in-memory), `grep`, and read-only `git`/`ls`; the reported `~/.claude` dirt is not from this agent.

### Scope note
- Read-only pass. No files edited, created, or committed; no mutating command run. All `[measured]` numbers come from `node`/`grep` executed in-process against existing files.

### Headline findings
- The shipped CJK failure is **not a ranking problem, it is a tokenizer problem**: MiniSearch emits an entire unbroken CJK run as **one token**. `[measured]`
- Fix is ~15 lines, costs **+0.31% index size**, and makes CJK queries **~4x faster**, not slower. `[measured]`
- BM25 is not the weak link at personal-vault scale; **tokenisation and diacritic folding are**. `[measured]` + `[fetched]`
- Local RAG over a personal vault is a **distraction at 1k–10k notes** and only defensible as a *ranking signal*, never as the retrieval path. `[fetched]` + `[inference]`

### Measured baseline: what frontmatter ships today
| Item | Value | Tag |
|---|---|---|
| Engine | `minisearch@7.2.0` (installed), latest published 2025-09-16 | `[measured]` `[fetched]` |
| Index fields | `title, tags, body, code`; 3-pass AND→OR→fuzzy(1) ladder | `[measured]` (`src/modules/vault/infrastructure/search-index.ts`) |
| Default tokenizer | `/[\n\r\p{Z}\p{P}]+/u` — splits on space + punctuation only, **not** on `\p{S}` or script boundary | `[measured]` |
| Tokens for `東京都の図書館で本を借りた` | `["東京都の図書館で本を借りた"]` — 1 token, 13 chars | `[measured]` |
| Tokens for `北京大学的图书馆很大` | `["北京大学的图书馆很大"]` — 1 token | `[measured]` |
| Exact match `図書館`, `图书馆`, `大学`, `本` | **0 hits each** | `[measured]` |
| Why anything matches at all | Pass 1 sets `prefix` on the last term; only **document-initial** CJK substrings hit (`東京`✓, `北京`✓, mid-run ✗) | `[measured]` |
| Diacritics | `processTerm` = `toLowerCase()` only. `maximo`→`máximo` MISS, `cafe`→`café` MISS, `resume`→`résumé` MISS | `[measured]` |
| Existing known defect (in-repo comment) | GFM table rows written `\|Name\|Type\|` index as ONE token; no cell is retrievable | `[measured]` (source comment, lines 80-85) |

### Measured scale numbers (real vault: `~/Desktop/GitHub/md`)
- Corpus: **4,548 `.md` files, 77,549,893 bytes (74.0 MiB), mean 17,051 B/note**; 358 files (7.9%) contain CJK, 9,577 CJK chars total. `[measured]`

| n notes | corpus | build ms | serialize ms | index JSON | ratio | heap delta | mean query ms |
|---|---|---|---|---|---|---|---|
| 1,000 | 12.0 MiB | 946 | 95 | 4.1 MiB | 0.34x | 52.4 MiB | 0.18 |
| 2,500 | 27.7 MiB | — | — | — | — | 64.6 MiB | — |
| 4,548 | 74.0 MiB | 7,027 | 665 | 27.0 MiB | 0.36x | 221.0 MiB | 0.88 |

`[measured]`, Node v24.6.0, macOS 25.6.0, warm cache, 100 query executions averaged. Terms: 21,978 @1k → 114,711 @4,548. `[measured]`
- Scaling is roughly linear in **bytes**, not notes: 78.8 ms/MiB @1k → 95.0 ms/MiB @4.5k. `[derived: 946/12.0, 7027/74.0]`
- Baseline non-indexed scan for contrast: `grep -rF --include='*.md'` over the same 74 MiB = **1.24 s**, single literal. `[measured]` (real `rg` binary is not standalone-installed here — the `rg` on PATH is a Claude Code shim, so ripgrep's own timings below are `[fetched]`, not `[measured]`.)

### Engine comparison
| Engine | Latest / date read 2026-08-29 | npm wk downloads | Stars / last push | Index size | Build | Query | Language support | Verdict for frontmatter |
|---|---|---|---|---|---|---|---|---|
| **MiniSearch** | 7.2.0, pub 2025-09-16, unpacked 826,513 B | 2,659,659 | 6,115 / 2025-09-16 | 0.36x corpus `[measured]` | 95 ms/MiB `[measured]` | 0.88 ms @4.5k `[measured]` | Pluggable `tokenize`/`processTerm`; **no** built-in CJK | **Keep.** Only engine here whose fix is a function argument |
| **Lunr** | 2.3.9, pub **2020-08-19** (6y 10d stale) `[derived]` | 7,542,972 | 9,200 / 2024-07-31 | n/a | n/a | 11,527 q/s single `[fetched, vendor]` | `lunr-languages` add-on; CJK via TinySegmenter fork | **Reject.** Index is immutable after build — fatal for incremental |
| **FlexSearch** | 0.8.212, pub 2025-09-06, unpacked 2,334,755 B | 1,407,279 | 13,784 / 2026-06-28 | "Memory 16" (own units) `[fetched, vendor]` | — | 50,955,718 q/s single `[fetched, vendor]` | **`Charset.CJK` built in** (`new Index({encoder: Charset.CJK})`) `[fetched]` | Fastest on paper; vendor self-benchmark, 3,200x over MiniSearch is not credible as stated |
| **Orama** | 3.1.18, pub 2025-12-19, unpacked 2,192,356 B | 1,304,705 | 10,537 / 2026-08-04 | — | — | 29,445 q/s single `[fetched, vendor]` | 32 locales in `SUPPORTED_LANGUAGE_LOCALES` — **zero CJK**; `@orama/tokenizers/japanese`+`/mandarin` are separate `[fetched]` | BM25 + vector + hybrid in one lib. Tempting; see anti-rec #3 |
| **Fuse.js** | 7.5.0, pub 2026-07-13 | 13,851,708 | 20,462 / 2026-08-09 | 247,107 mem units `[fetched, vendor]` | — | **422 q/s** — slowest in the vendor table `[fetched]` | Fuzzy substring, no BM25, no analyzer | **Reject as primary.** It is a fuzzy matcher, not an IR engine |
| **Tantivy** | 0.27.0 (repo), crates max 0.26.1, updated 2026-04-21, 3,783,112 dl/90d | — | 16,005 / 2026-08-28 | — | — | "~2x faster than Lucene" `[fetched, vendor README line 132]` | Stemming 17 Latin langs; CJK via `tantivy-jieba` (0.20.0), `cang-jie`, `lindera-tantivy` (5.0.1), Vaporetto `[fetched]` | **Right engine, wrong runtime.** Use in `src-tauri`, not wasm |
| **SQLite FTS5** | via `@sqlite.org/sqlite-wasm@3.53.0-build1`, pub 2026-04-21, 2,829,040 B | — | 1,045 / 2026-07-13 | — | — | — | `unicode61` (Unicode 6.1, **no CJK segmentation**), `ascii`, `porter`, **`trigram`** — trigram gives substring match and is the practical CJK escape hatch `[fetched, sqlite.org/fts5.html]` | Strong option; caveat: `detail=none/column` forbids tokens >3 chars `[fetched]` |
| **DuckDB-wasm** | 1.33.1-dev57.0, pub 2026-06-22, **unpacked 149,377,663 B (142 MiB)** | — | 2,113 / 2026-07-28 | — | — | — | FTS via extension | **Reject.** 142 MiB package to run BM25 on 74 MiB of prose |
| **Ripgrep** | 14.1.1 (rev 939d4325be) | — | 67,675 / 2026-08-04 | **zero** | zero | linear scan | Full Rust regex, UTF-8 native — CJK "just works" because it never tokenises | **Keep as the fallback path.** No index = no staleness bug |
| **PGlite** | 0.5.8, pub 2026-08-26, 25,437,263 B | — | — | — | — | — | Postgres FTS dictionaries | Overkill for a notes app |
| **sql.js** | 1.14.2, pub 2026-08-14, **24,151,707 B** | — | 13,659 / 2026-08-14 | — | — | — | — | Superseded by official `@sqlite.org/sqlite-wasm` (8.5x smaller) `[derived]` |
| **wa-sqlite** | 1.0.0, pub **2024-01-05**, no license field on npm | — | 1,408 / 2026-08-28 | — | — | — | — | Licence field empty on the npm manifest — legal review before use `[measured]` |

**Recorded disagreement:** the FlexSearch table is the vendor's own harness and puts MiniSearch at 5,849 q/s on "Query: Large" vs Orama 4,454 — a 1.3x gap — while claiming 13,981,110 for itself, a 2,390x gap. `[fetched]` Treat the *ordering* as informative and the *magnitudes* as not.

### The CJK fix — exact library, exact expected improvement
**Measured on the real vault.** Relevance set built without hand-labelling: extract every CJK n-gram of length 2–4, keep the **2,389** that occur in exactly one file (out of 2,854 distinct), deterministically sample 200, gold = that file. Run the shipped 3-pass ladder. `[measured]`

| Tokenizer | recall@30 | top-1 | any-result rate | mean query ms | index JSON |
|---|---|---|---|---|---|
| **default (shipped)** | 85/200 = **42.5%** | 39.0% | 54.0% | 0.13 | 28,296,206 B |
| **CJK bigram** | 200/200 = **100.0%** | **99.5%** | 100.0% | **0.03** | 28,383,334 B |
| CJK bi+trigram | 100.0% | 99.5% | 100.0% | 0.03 | — |
| `Intl.Segmenter` (ICU/UAX-29) | 196/200 = 98.0% | **81.0%** | 100.0% | 0.04 | 28,304,189 B |

- **Delta: +57.5 pp recall, +60.5 pp top-1, −77% query latency, +0.31% index size** (87,128 B on 28.3 MB). `[derived]`
- **Recorded disagreement:** your stated baseline is **18.1%**; I measure **42.5%** on this vault. Both can be right — my query set is auto-derived n-grams from a 7.9%-CJK Latin-dominant corpus, which over-samples document-initial runs that the `prefix` pass rescues. **Do not average them.** Re-run this harness against the corpus that produced 18.1% before quoting either.
- **Recommend the bigram, not the segmenter.** Non-obvious and measured: `Intl.Segmenter` scores 18.5 pp *worse on top-1* than dumb bigrams (81.0% vs 99.5%) because dictionary boundaries don't align with the arbitrary substrings people actually type. `[measured]` Chinese `图书馆` segments as `图书|馆` `[measured]`; Japanese `東京都の図書館で本を借りた` → `東京|都|の|図書館|で|本|を|借り|た` `[measured]`.
- **Exact library: none.** Ship a ~15-line `tokenize` passed to MiniSearch. Zero new dependency, zero wasm, zero download. This is the whole fix:
  - split on `/[\n\r\p{Z}\p{P}]+/u` as today;
  - for any part matching `/[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF]/`, emit every char **and** every adjacent bigram;
  - else emit the part unchanged. Pass the **same** function as the search-time `tokenize`.
- If you later want linguistic quality: `Intl.Segmenter` is **free** (Chrome 87, Safari 14.1, Firefox 125, Node 24 `[fetched, MDN BCD]`) — but Firefox only from 125, so a bigram fallback is required regardless. `[inference]`
- Rejected wasm alternatives, with the reason being size: `kuromoji@0.1.2` (pub **2018-03-19**, 41,263,301 B) `[fetched]`; `jieba-wasm@2.4.0` (16,126,591 B); `lindera-wasm@6.0.0` (1,842,304 B — the only defensible one); `budoux@0.9.1` (2,659,103 B, pub 2026-08-28, ML phrase-breaker, not a token index). `[fetched]`

### Indic — a separate, unmeasured-by-you defect
- Devanagari **uses spaces**, so it is not the CJK failure. `[measured]` `भारत की राजधानी नई दिल्ली है` tokenises correctly today.
- The real Indic failure is **normalisation**: `हिंदी` (anusvara) does **not** match `हिन्दी` (conjunct) — 0 hits. `[measured]`
- **Trap, measured:** the obvious diacritic fix `t.normalize("NFD").replace(/\p{Mn}/gu,"")` fixes `maximo`→`máximo` and `cafe`→`café` `[measured]` but **destroys Devanagari**: `हिन्दी` → `हिनदी`. `[measured]` It also does not fix `strasse`→`Straße`. `[measured]`
- **Recommendation:** scope Mn-stripping to Latin ranges only (`\p{Script=Latin}`), add an explicit `ß→ss`/`æ→ae`/`ø→o` map, and leave Indic to NFC + a small anusvara↔conjunct equivalence table. `[inference]`

### BM25 vs embeddings vs hybrid — the published evidence
- **BEIR** (arXiv 2104.08663, pub 2021-04-17, rev 2021-10-21; 18 datasets, 10 systems): "BM25 is a robust baseline"; dense and sparse retrievers "often underperform"; re-rankers win but "at high computational costs." `[fetched]`
- **Fusion functions** (arXiv 2210.11934, pub 2022-10-21, rev 2023-05-04): RRF is **sensitive to its parameters**; convex combination **beats RRF in-domain and out-of-domain**, and is sample-efficient — one parameter, small tuning set. `[fetched]` → if you ever fuse, use a tuned convex combination, not the RRF constant everyone copies.
- **Lucene Is All You Need** (arXiv 2308.14963, pub 2023-08-29): dedicated vector stores are not required; HNSW inside an existing inverted index is adequate. `[fetched]`
- **BM25S** (arXiv 2407.03618, pub 2024-07-04): eager scoring into sparse matrices → **up to 500x** over the popular Python BM25, beating optimised Java. `[fetched]` Evidence that lexical is nowhere near its ceiling.
- **Seven Failure Points of RAG** (arXiv 2401.05856, pub 2024-01-11): "validation of a RAG system is only feasible during operation"; robustness "evolves rather than designed." `[fetched]`
- **RAG vs long-context** (arXiv 2407.16833, pub 2024-07-23): long-context "consistently outperforms RAG" when resourced; RAG's advantage is **cost**. `[fetched]`
- **No study here measures a personal markdown vault.** Every number above is web/QA benchmark. Anyone claiming "embeddings win for personal notes" is extrapolating. `[inference]`

### Client-side embedding models — real sizes
| Model | Params | Smallest usable ONNX | fp32 | HF downloads/30d | Read |
|---|---|---|---|---|---|
| `Xenova/all-MiniLM-L6-v2` | 22,713,728 | **int8 22,972,370 B = 21.9 MiB** (uint8 21.8 MiB) | 86.2 MiB | 2,481,431 | 2026-08-29 `[fetched]` |
| `thenlper/gte-small` | 33,360,512 | qint8_avx512_vnni 32.5 MiB; O4 63.5 MiB | 127.0 MiB | 979,591 | `[fetched]` |
| `BAAI/bge-small-en-v1.5` | 33,360,512 | single `model.onnx` only | — | 66,356,634 | `[fetched]` |
| `intfloat/multilingual-e5-small` | 117,654,272 | qint8 variant present | — | 11,599,057 | `[fetched]` |
| `onnx-community/embeddinggemma-300m-ONNX` | 302,863,104 | **q4f16 167.3 MiB**, q4 187.6 MiB, q8 294.6 MiB | **1,177.3 MiB** | 2,350,175 (base model) | `[fetched]` |
- EmbeddingGemma: 2048-token context, 768-dim with **MRL truncation to 512/256/128**, 100+ languages, **licence `gemma` and the base repo is gated** (`Access to model google/embeddinggemma-300m is restricted`). `[fetched]`
- Its card states activations "do not support `fp16`" — so the fp16 590 MiB artifact is a trap; q4/q8 only. `[fetched]`
- Runtime: `@huggingface/transformers@4.2.0` (pub 2026-04-22, 9,536,375 B) supersedes `@xenova/transformers@2.17.2` (pub 2024-05-29, 46,618,273 B). `[fetched]`
- **Ceiling for frontmatter: 22 MiB (MiniLM int8).** EmbeddingGemma q4f16 is 167 MiB — 7.6x the entire current search index. `[derived]`

### Vector storage in the browser
- Quotas: Chromium **60% of disk** per origin; Firefox **min(10% of disk, 10 GiB)** best-effort, 50% capped 8 TiB if persisted. `[fetched, MDN]` Storage is not the constraint.
- Cost at this vault: 74.0 MiB ≈ 19.4M tokens `[derived, 4 B/token]` → ~37,900 chunks @512 tokens `[derived]` → **55.5 MiB** at 384-dim fp32, **13.9 MiB** at int8. `[derived]` Both fit trivially.
- Options: `sqlite-vec` (8,052 stars, pushed 2026-05-18; npm 0.1.9 pub 2026-03-31 `[fetched]`) — brute-force, no ANN index, correct choice under 100k vectors. `voy-search@0.6.3` and `hnswlib-wasm@0.8.2` are both **last published 2023**. `[fetched]` **Do not adopt a 3-year-stale wasm ANN library to solve a problem a flat scan solves.** `[inference]`
- **The real cost is not storage, it is the first-run embed pass** — 37,900 forward passes of a 22M-param model in a browser tab. `[inference]`

### Incremental indexing
- MiniSearch supports `add`/`remove`/`replace` per document — genuinely incremental. `[fetched, README]` **Lunr does not**; its index is immutable post-`build`. `[fetched]` This alone disqualifies Lunr.
- **Current implementation is not incremental at all**: `ensureCache()` keys on `getHeadSha()` and rebuilds the *entire* index from a fresh zipball on **any** HEAD change. `[measured]` At 4,548 notes that is **7.0 s + a full zipball download per commit**. `[measured]`
- Fix path, in order: (1) key the cache per-file on blob SHA, (2) `index.replace()` only changed paths, (3) persist the serialized index (`MiniSearch.loadJSON`) so a cold start is a 27 MB parse, not a 7 s rebuild. `[inference]`
- This matches the byte-preserving-splice model already in the engine: a splice touches one file, so the index should touch one document. `[inference]`

### Recommended architecture
**1k notes (~3–17 MiB)**
- MiniSearch, in-process, CJK-bigram tokenizer, Latin-scoped diacritic folding, per-file incremental replace, serialized index in IndexedDB.
- Measured: 946 ms build, 4.1 MiB index, 0.18 ms/query, 52 MiB heap. `[measured]`
- **Breaks at:** nothing. Do not add a second system.

**10k notes (~30–170 MiB)**
- Same engine, but the rebuild must be per-file or the UX dies. Move indexing to a Worker.
- Extrapolated: ~15.5 s full build, ~60 MiB index, ~490 MiB heap at this vault's 17 KB/note. `[derived: linear in bytes at 95 ms/MiB, 0.36x, 3.0x]`
- **Breaks at:** the **full-rebuild path**, not query. A 15 s stall on every commit is the failure. Second break: heap on a 4 GB iPad. `[inference]`

**100k notes (~300 MiB–1.7 GB)**
- MiniSearch is **out**. Derived at this vault's mean: 1.7 GB corpus → **~27 min build, ~614 MB index JSON, ~5.1 GB heap**. `[derived]` Even at a modest 3 KB/note: 300 MB corpus → ~29 s build, ~108 MB index, ~900 MB heap. `[derived]` A browser tab does not survive either.
- Architecture: **SQLite FTS5 via `@sqlite.org/sqlite-wasm` on OPFS** (`unicode61` + a bigram-expanded content column, or `trigram` for substring), with **ripgrep in `src-tauri` as the exact/regex path**. Tantivy native in Tauri if FTS5 ranking proves insufficient.
- **Breaks at:** OPFS write throughput on first index, and the fact that FTS5's `unicode61` still does not segment CJK — so the bigram expansion is required **at every tier**. `[fetched]` `[inference]`

**Constant across all three:** the index is a **projection of the files**, never a source of truth; deletable and rebuildable at any moment. That is the same rule the board/calendar/decision-card views already obey.

### Local RAG over your own vault — worth it or distraction
**Strongest argument FOR (steelman):**
- Lexical search cannot answer *"what did I decide about pricing?"* when the note says "we settled on the higher tier." No amount of tokenizer work closes that gap; it is a vocabulary-mismatch problem and embeddings are the only known fix. `[inference]`
- The cost is now genuinely small: 22 MiB int8 MiniLM, 13.9 MiB of int8 vectors for a 4,548-note vault, flat scan, no ANN. `[derived]`
- BEIR's own conclusion is that **re-ranking wins** — and re-ranking a 30-candidate BM25 list is ~30 vector dot products, not a retrieval system. `[fetched]` `[inference]`
- The Obsidian ecosystem is already building this (`vault-curate`, published 2026-05-21, WebGPU embeddings + semantic neighbours + "purple edges = semantically close but not yet linked"). `[fetched]` The demand is demonstrated.

**Strongest argument AGAINST:**
- **Validation is impossible before shipping.** arXiv 2401.05856: "validation of a RAG system is only feasible during operation." `[fetched]` For an engine whose differentiator is *cross-engine degradation certification* — a discipline built on determinism — shipping a component that can only be validated in production is a category error. `[inference]`
- **The measured defect is 57.5 pp of recall lost to a regex.** `[measured]` Spending the next quarter on RAG while a 15-line tokenizer fix sits unshipped is a misallocation with a 40:1 evidence ratio.
- **RAG's only proven advantage over long context is cost** (arXiv 2407.16833). `[fetched]` A single user's vault is precisely the regime where cost does not bind.
- It violates the surface constraint: RAG has no honest simple surface. It needs chunk-size settings, model choice, a re-embed trigger, a staleness indicator, and a "why did it show me this?" affordance. That is four settings and an explainer — the opposite of the stated intent. `[inference]`

**Verdict:** **Distraction as a retrieval path. Defensible as a hidden re-ranker only** — embed the ≤30 BM25 candidates at query time, no persistent vector store, no first-run embed pass, no settings. If the re-rank does not move top-1 by ≥10 pp on a wikilink-derived relevance set (the harness the codebase already describes), delete it. `[inference]`

### What users actually complain about
| Complaint | Evidence | Tag |
|---|---|---|
| **Diacritics/accents ignored** — the single largest search request | forum.obsidian.md/t/1655, created 2020-06-11, **760 likes, 151 posts, 11,376 views** | `[fetched]` |
| **No relevance ranking** — users want title > heading > bold > frequency | forum.obsidian.md/t/5933, 2020-09-20, **171 likes, 53 posts** | `[fetched]` |
| Counter-argument in that same thread: *"there really is no sensible metric for relevance in this context"* | same thread, post 2, 2020-09-20 | `[fetched]` |
| **Index scope is not user-controllable** | forum.obsidian.md/t/52025, 2023-01-11, **342 likes, 104 posts, 25,319 views** | `[fetched]` |
| **Single CJK char returns nothing** — same defect frontmatter has | forum.obsidian.md/t/945, 2020-06-01: three `狗` in one sentence, zero results; two-char `狗是` works. Fixed in Obsidian 0.6.7 | `[fetched]` |
| **CJK proper nouns and private vocabulary miss** | forum.obsidian.md/t/114527, 2026-05-21: *"Built-in search works fine when the thing I'm looking for is a unique English keyword. It misses on Chinese proper nouns…"* — 3 years of Traditional Chinese notes | `[fetched]` |
| **Strict word order in quick switcher** | forum.obsidian.md/t/10966, 2021-01-05 | `[fetched]` |
| **A mistyped query silently returns another note's data** | forum.obsidian.md/t/116571, 2026-07-28 (Obsidian CLI) | `[fetched]` |
| Evernote: search stops working entirely across devices; Windows returns non-matching results; AI search toggle greys out | discussion.evernote.com topics 133983 / 147923 / 120027 — forum returns **HTTP 403** to curl, so titles/URLs only | `[SS]` |
| Notion: complaints cluster on **performance and offline**, not search; recent reviews call AI search favourable | Product Hunt / Capterra / Herdr roundups | `[SS]` |

**Pattern:** every top complaint is an **analyzer** complaint (folding, segmentation, scope, ranking) — not an "add semantic search" complaint. `[inference]`

### Anti-recommendations
1. **Do not adopt DuckDB-wasm.** 142 MiB unpacked to run BM25 over 74 MiB of prose. `[fetched]`
2. **Do not adopt Lunr.** Last published 2020-08-19 (6y 10d ago `[derived]`) and its index cannot be mutated after build — incompatible with per-file incremental indexing. `[fetched]`
3. **Do not migrate to Orama for "hybrid built in."** Its `SUPPORTED_LANGUAGE_LOCALES` contains **no Chinese, Japanese, or Korean**; CJK requires the separate `@orama/tokenizers` — i.e. you would migrate engines and *still* write a tokenizer. `[fetched]`
4. **Do not make Fuse.js the primary index.** 422 q/s in the FlexSearch harness vs MiniSearch's 30,589 — 72x slower — and it has no BM25. `[fetched]`
5. **Do not ship `.normalize("NFD").replace(/\p{Mn}/gu,"")` as diacritic folding.** It silently corrupts Devanagari (`हिन्दी`→`हिनदी`). `[measured]`
6. **Do not ship `Intl.Segmenter` as the CJK fix.** 18.5 pp worse top-1 than bigrams, and unsupported in Firefox before 125. `[measured]` `[fetched]`
7. **Do not bundle kuromoji.** 41,263,301 B, last published **2018-03-19**. `[fetched]`
8. **Do not add an ANN vector index.** `voy-search` (2023-09-20) and `hnswlib-wasm` (2023-07-08) are both ~3 years stale, and a flat scan over <100k vectors is faster than the index build. `[fetched]` `[inference]`
9. **Do not compile Tantivy to wasm.** It exists to be a native inverted index; use it in `src-tauri` where it is 2x Lucene, or not at all. `[fetched]`
10. **Do not expose search settings.** Every complaint above is a *default* being wrong. Adding "CJK mode: bigram / segmenter" converts a fixed bug into a support surface, and violates the simplified-surface constraint.
11. **Do not build a plugin API for custom analyzers.** Ruled out by the settled constraints (no plugin marketplace, no arbitrary client-side execution) — and it would let a third party silently break the degradation certificate.
12. **Do not quote 18.1% or 42.5% as "the" CJK recall** until one harness runs over one named corpus. Two honest measurements of different query sets are not a range. `[measured]`
13. **Do not build persistent local RAG before the tokenizer ships.** 57.5 pp of measured, free recall is sitting unclaimed. `[measured]`

### Ordered actions
1. Ship the CJK bigram `tokenize` (index **and** search side). +57.5 pp recall@30, +0.31% index, −77% query latency, zero dependencies. `[measured]`
2. Ship Latin-scoped diacritic folding + explicit `ß/æ/ø` map. Addresses the 760-like top complaint. `[measured]` `[fetched]`
3. Make indexing per-file incremental (blob SHA, `index.replace()`), and persist via `MiniSearch.loadJSON`. Removes a 7.0 s full rebuild per commit. `[measured]`
4. Fix the already-documented GFM table tokenisation defect — add `|` to the split class. `[measured]`
5. Build the wikilink-derived relevance harness as a permanent gate; refuse any search change that does not move it.
6. Only then: evaluate a 30-candidate query-time embedding re-rank, with a pre-committed ≥10 pp top-1 threshold and a delete-if-not-met rule.