I made no mutations: I ran only read-only commands (ls, find, cat/head/sed, wc, grep, python3 validate.py, node mdmax-cert.mjs, curl) and created, edited, deleted, staged, or committed nothing — the `~/.claude` dirt is pre-existing and not mine.

### Method and evidence base

- Read-only. No file created, edited, or deleted; no git command run. Every `[measured]` claim came from executing a read-only tool or script on this machine on 2026-08-29.
- `curl` reachability tested before assuming a block: `registry.npmjs.org` 200, `raw.githubusercontent.com` 200, `export.arxiv.org` 200, `pandoc.org` 200 [measured]. No host in this survey needed fetching, so no `[fetched]` tags appear below.
- Two scripts were executed because they only read and print: `knowledge/scripts/validate.py` and `frontmatter/scripts/mdmax-cert.mjs`. `build_catalog.py`, `sync_to_md.py`, all seven campaign generators, and all six campaign gates write files and were **not** run.

### Headline counts

| thing | count | evidence |
|---|---|---|
| Markdown-touching capability clusters surveyed | 8 | [derived] knowledge, campaign, mdmap, fm/scripts, fm/preview, fm/export, fm/mdmax, graphify |
| knowledge/ Python scripts | 5 (709 non-README lines) | [measured] `wc -l`: 95+237+86+129+162 = 709 |
| knowledge/ pipeline stage docs | 8 files; 7 numbered stages `00`–`06` + `type-handlers.md` | [measured] `ls pipelines/` |
| knowledge/ note templates | 20 (14 `types/` + 6 layer/index) | [measured] `find templates -type f` |
| knowledge/ `item_type` vocabulary | 14 | [measured] `validate.py:ITEM_TYPES` |
| sgnk-campaign root Python files | 16 (5,807 lines) | [measured] `wc -l *.py` |
| — of which **generators** | 7 | [derived] make-deck, make-carousel, make-onefile, make-og-card, make-status, build-brilliant, build-assets |
| — of which **gates** | 6 | [measured] 5 × `check-*.py` + `content-gate.py`; HANDOFF line 377 says "all six gates" |
| — of which infrastructure | 3 | [derived] add-orientation, apply-patches, preview-server; 7+6+3 = 16 ✓ |
| campaign deck block types (defined) | 11 in `make-deck.py` docstring | [measured] |
| campaign deck block types (**used**) | 17 across batch1 | [measured] 10 decks, 113 slides, 316 blocks |
| docs/mdmap files | 21 `.md`, **0 lines of executable code** | [measured] `find … \| wc -l` |
| frontmatter/scripts entries | 14 (10 executable tools + lib + backup) | [measured] `ls` |
| frontmatter preview module files | 21 (2,306 lines) | [measured] 2,952 total − 646 export |
| frontmatter export module files | 5 (646 lines) | [measured] |
| mdmax source files | 13 | [measured] |
| mdmax render targets | 15 = 7 `local` + 1 `requires-push` + 7 `declared` | [measured] `targets.ts` |
| mdmax constructs | 19 | [measured] `constructs.ts` id count |
| mdmax test files | 11 (of 79 test files repo-wide) | [measured] |
| graphify pipeline steps | 10 (`Step 0`–`Step 9`) + 8 subcommand modes | [measured] `grep '^### Step'`, `WORKFLOW.md` |

---

### A. knowledge/ — ingest, classify, synthesize, catalog, mirror

| capability | file | in → out | md-in/md-out? | becomes in frontmatter |
|---|---|---|---|---|
| Dependency-free YAML frontmatter parser (scalars, `[a, b]` inline lists, block lists) | `/Users/sagnikmitra/Desktop/GitHub/knowledge/scripts/_fm.py` | `.md` text → `(dict, body)` | md-in / data-out | **Superseded** — fm already ships `preview/presentation/frontmatter.ts` (yaml Document, comment-preserving) and `mdmax/domain/frontmatter-prepass.ts` (lenient wikilink repair). Do not port. |
| Schema validator: 6 required keys, 5 enum vocabularies, hard vs soft findings | `…/knowledge/scripts/validate.py` | note tree → per-file report + exit code | md-in / report-out | **`fm lint --schema`**. Vault-wide property validation with a user-declared schema; hard/soft split is already the right shape. |
| Catalog + index generator: writes `index/catalog.json`, every `categories/*/index.md`, `layers/*/index.md`, and two marker-delimited blocks inside `knowledge.md` | `…/knowledge/scripts/build_catalog.py` | frontmatter of N notes → JSON + M generated `.md` | **md-in / md-out** | **Generated-index blocks.** The `<!-- CATEGORIES:START -->…END` idiom (`replace_block`, line 146) is a working spec for regenerable regions inside a hand-edited file. |
| Recursive triage scanner: 44-extension → item_type table, folder-name → category/type hints, bundle-vs-container heuristic | `…/knowledge/scripts/scan_paste.py` | arbitrary folder tree → tree print + type histogram | non-md-in / report-out | **Vault import triage.** Directly reusable for "drag a folder into frontmatter". |
| Vault mirror: Title-Case filenames, per-folder `index.md`, rewrites `[](categories/x/y/slug.md)` **and** `[[slug]]` → `[[Title]]`, re-emits frontmatter + provenance keys | `…/knowledge/scripts/sync_to_md.py` | knowledge notes → `~/Desktop/GitHub/md/Research/Knowledge Base/**` | **md-in / md-out** | **`fm export --vault` / link-dialect transform.** The only working slug↔title link rewriter on this machine. |
| The 7-stage authored pipeline (scan → classify → dedup by `content_hash` → extract → synthesize → file original → index → cross-link) | `…/knowledge/pipelines/00-…06-*.md` | prose contract for an agent | md-in / md-out | **`fm ingest` skill contract.** `02-synthesize.md`'s L99 bar and `type-handlers.md`'s 14-format extraction matrix are the spec. |

- Live state [measured]: `validate.py` → **203 notes checked, 0 errors, 94 warnings** (all warnings `no content_hash` / `no tags`).
- `sync_to_md.py:153` does `shutil.rmtree(DEST)` before every run. [inference] Any frontmatter port must not inherit destroy-then-rebuild — it is exactly the class RULE 3 exists for.

### B. sgnk-campaign/ — 7 generators, 6 gates, one Chrome renderer

**Generators (markdown/JSON → PDF, PNG, HTML, markdown):**

| generator | path | in → out | md? |
|---|---|---|---|
| `make-deck.py` (1,203 ln) | `/Users/sagnikmitra/Desktop/GitHub/sgnk-campaign/make-deck.py` | `deck.json` → 1080×1350 PDF via Chrome print-to-PDF; has a DOM `PROBE` that refuses on vertical overflow, horizontal overrun, or intersecting text boxes | JSON-in / PDF-out |
| `make-carousel.py` (291 ln) | `…/make-carousel.py` | same shape, 48px body; **superseded by make-deck** per its own docstring | JSON-in / PDF-out |
| `make-onefile.py` (230 ln) | `…/make-onefile.py` | 10 episodes × all surfaces → **one markdown file**, versioned filename per LR#69 | **md+JSON-in / md-out** |
| `make-og-card.py` (80 ln) | `…/make-og-card.py` | slug+title+kicker → 1200×630 PNG (600×315 @2×) | text-in / PNG-out |
| `make-status.py` (117 ln) | `…/make-status.py` | `card.json` → 1080×1920 story PNG | JSON-in / PNG-out |
| `build-brilliant.py` (1,457 ln) | `…/build-brilliant.py` | `episodes/*.md` **frontmatter only** → catalogue HTML, per-episode HTML, `feed.xml`, `sitemap.xml`, `vercel.json` redirects, jackets, OG images | **md-in / HTML+XML-out** |
| `build-assets.py` (387 ln) | `…/build-assets.py` | built decks → named episode folders + caption-length + deck-staleness checks | mixed |

**Gates (all six, all measure a *rendered* or *counted* property, none is a style opinion):**

| gate | what it asserts | technique |
|---|---|---|
| `check-overflow.py` (98 ln) | no ink in reserved footer band `BAND=(230,1252,860,1300)`, `INK=40` | rasterise + pixel count; **self-labelled a proxy** |
| `check-render.py` (228 ln) | COLLISION / EDGE / CLIPPED on **every page of every PDF** + hyphenation | pixel inspection, complements make-deck's DOM probe |
| `check-instagram.py` (170 ln) | slide 1 and last byte-identical to `deck.json`; exactly 10 slides; largest blank vertical run vs LinkedIn baseline (median 82px, max 276px) | JSON identity + PNG gap measurement |
| `check-provenance.py` (147 ln) | **hard**: every numeric token on the IG cut appears in `deck.json`/`blog.json`/`post.md`. **soft**: word-trigram coverage < `THIN_COVER=0.55` printed, never failed | two-character check by design |
| `check-clarity.py` (479 ln) | six named checks — HEADLINE (≤2 rendered lines), PERSONA, NARRATIVE, READING (Flesch + sentence length), FIGURES (uniquely counted), GLOSS | mixed source + rendered |
| `content-gate.py` (389 ln) | three ordered layers — voice → parse → GEO; thresholds derived from measuring this corpus with `~/.claude/skills/sgnk-parse/scripts/prose_metrics.py` | pure text |

- `apply-patches.py` (133 ln) is the sleeper: a find/replace applier with four verdicts — **NOT FOUND / AMBIGUOUS / NO-OP refused, APPLIED re-read from disk to confirm**. [inference] This is the exact contract frontmatter's AI-edit path needs and does not have.
- Corrections to the brief [measured]: there is **no `figures.json`** in this repo. The file is `…/sgnk-campaign/figures/figures-content.json` (1,374 bytes), a 4-entry map of `{generator, args}` naming `layers` and `hbar` generators, alongside 4 hand-checked `.svg` files.

### C. frontmatter/docs/mdmap — a format spec with zero implementation

- 21 markdown files, 0 code [measured]. `MAP.md` declares itself `status: concept`, `coverage: 0.247`, **81 nodes declared / 20 exist / 61 ghosts**.
- `03-spec/format.md` fixes 9 ordered sections under a `budget: 2000` token ceiling, with section order justified by Lost-in-the-Middle (Liu et al. 2307.03172, quoted as 75.8% first / 53.8% middle / 63.2% last vs 56.1% closed-book) [SS — the paper was not opened in this session].
- `03-spec/gaps.md` defines **six findings**: ghost, broken, orphan, uncovered, stale, over-budget — output as markdown. **This is the single highest-value unbuilt spec in the survey**: it is markdown-in / markdown-out, it is a linter rather than a view, and it names `graph-data.ts:132` as the line that silently drops broken edges today.

### D. frontmatter/scripts — 10 tools, 2 kinds

| tool | role | md-in/md-out |
|---|---|---|
| `mdmax-cert.mjs` (9,727 B) | the degradation-certificate CLI: table, `--json`, `--fail-on`, `--bench-info`, `--explain`, `--histogram` | md-in / JSON+table-out, **never writes `.md`** |
| `fm-roundtrip-audit.mjs` | independent byte-identity oracle over a pinned corpus for 3 writer implementations | md-in / verdict-out |
| `fm-properties-audit.mjs` | 4 PropertiesPanel mutations, each its own inverse, byte-compared | md-in / verdict-out |
| `slug-decision-audit.mjs` | extracts every `[t](#anchor)` + heading, reports anchor resolution per slug algorithm | md-in / stats-out |
| `gen-golden-cases.py` | append-only golden fixture for `normalize/1` + `slug/1` | — |
| `load-splice.mjs`, `ts-resolve.mjs`, `lib/corpus-hash.mjs` | loaders that **refuse loudly** rather than silently testing nothing | — |
| `categorize-skills.mjs`, `rewrite-skills-wikilinks.mjs` | one-shot vault reorganiser + `[[Skills/X]]` → `[[X]]` rewriter over a live dev server | **md-in / md-out** |
| `sgnk-md-sync.sh` | branch-aware git sync of the md vault | — |

- **Defect found [measured]**: `node scripts/mdmax-cert.mjs --bench-info` fails with `ERR_MODULE_NOT_FOUND … /domain/offsets` — the file exists; the CLI's own header documents the bare invocation but it only runs as `node --import ./scripts/ts-resolve.mjs scripts/mdmax-cert.mjs …`. The published usage line is wrong.

### E. frontmatter/src/modules/preview — the live render pipeline (2,306 ln)

- Pipeline [measured, `Markdown.tsx`]: `remark-gfm` + `remark-breaks` + `remark-math` + `remark-frontmatter` → `rehype-raw` + `rehype-katex` + `rehype-highlight` + `rehype-slug`.
- 12 raw-HTML elements hard-disallowed (`base button embed form iframe link meta object script select style textarea`) with a content-dependent sanitiser (`html-policy.ts`, 215 ln).
- Owned transforms not present anywhere else on this machine: `wikilinks.tsx` (`[[x]]` + `![[x]]` transclusion with depth guard), `embeds.tsx` (YouTube/Vimeo/video/audio/PDF detection out of plain `![](url)`), `mermaid-block.tsx` (`securityLevel:strict`), `table-edit.ts` (190 ln GFM pipe-table locate-and-edit), `outline-utils.ts` (fence-aware ATX extractor slugged with `github-slugger` to match `rehype-slug`), `callout.tsx`, `editable-table.tsx`, `PropertiesPanel.tsx`.

### F. frontmatter/src/modules/export — 646 ln, two paths, one stylesheet

- `export-doc.ts` — client `renderToStaticMarkup` → standalone HTML5 with mermaid pre-rendered to inline SVG + KaTeX 0.17.0 CSS link.
- `pdf-doc.ts` — server `unified.processSync` (no `react-dom/server`) for headless-Chromium PDF at `/api/export/pdf/*`.
- `print-css.ts` — deliberately shared because the two copies previously drifted; `PRINT_PAGE_MARGIN = "1.6cm"`.
- **Anti-recommendation [inference]:** `PRINT_HEAD_FONT_LINKS` loads Google Sans from the Google Fonts CDN. Under a strict CSP or offline this is the LR#52 failure mode; the campaign generators instead embed every asset as a `data:` URI (`_asset_uri`, `_png_uri`). Adopt the campaign's self-contained approach, not the CDN link.

### G. mdmax — the differential certification engine

- 15 targets × 19 constructs; `uncertifiableShare()` reports **8 of 15 surfaces (53.3%) cannot be probed locally** [measured, `--bench-info`].
- Bench id `51947c2e88127bfcd80125c705404f0b9f4c54165b95c8cbd4f19fdfe071d360`, fold `mdmax/fold@1`; 6 engines pinned with full option sets (remark-app via unified 11.0.5, react-markdown 10.1.0, marked 16.4.2, markdown-it 15.0.0 ×2 configs, commonmark 0.31.2, kramdown 2.5.2 + kramdown-parser-gfm 1.1.0) [measured].
- Verdict ladder: PASS → VOID → CORRUPT/LEAK → CORRUPT/DESTROY → CORRUPT/MUTATE → STRIP.
- Live run on `docs/mdmap/MAP.md` [measured]: 24 blocks × 7 local targets = 168 cells; **PASS 104 · STRIP 2 · CORRUPT 13 · VOID 49** (104+2+13+49 = 168 ✓).
- Histogram over `docs/mdmap` [measured]: **21 files, 517 blocks, 259 with BROKEN = 50.10%, 21/21 files affected.** Kill condition (1) does not fire; **kill condition (4) FIRES** — top-5 constructs are 100.0% of BROKEN attributions.

### H. graphify — any-input → knowledge graph

- `~/.claude/skills/graphify/SKILL.md`, 47,960 B, version `0.7.9` [measured]. 10 pipeline steps + 8 subcommand modes (`query`, `path`, `explain`, `add`, `--update`, `--cluster-only`, `--watch`, git hook).
- Markdown-relevant behaviour: step 3 reads YAML frontmatter and copies `source_url, captured_at, author` into node attributes (line 324); outputs `GRAPH_REPORT.md`, an Obsidian vault export, and a `--wiki` mode emitting `index.md` + one article per community — **md-in / md-out**.
- Live artefact on the knowledge repo [measured]: `graph.json` 3,848 nodes / 3,737 links / 0 hyperedges, built at commit `464eb666`; `GRAPH_REPORT.md` dated 2026-07-23 reports 273 files, ~546,933 words, 340 communities (240 shown, 100 thin omitted), 100% EXTRACTED.

### Numbers that disagree — recorded, not reconciled

- knowledge note count: `validate.py` = **203**; `index/catalog.json` = **175** (generated 2026-07-27); `find categories layers -name '*.md'` = **234**; `GRAPH_REPORT.md` = **273 files** [all measured]. Four scopes, four numbers; none is wrong, none is comparable.
- mdmax histogram internal totals: blocks-with-BROKEN **259**, by-class **MUTATE 260 + LEAK 105 = 365**, by-construct **209+21+17+13+1 = 261** [derived]. Three totals for one population. [inference] class and construct rows count *cells/attributions*, the headline counts *blocks* — the report does not say so, and a reader will read it as one number.
- `docs/mdmap/MAP.md` claims 20 nodes exist; `find` returns 21 files [measured]. Reconciles only if the root `MAP.md` is excluded from its own count.
- `make-deck.py` documents 11 block types; batch1 uses 17 [measured]. `lead`, `map`, `code`, `flow`, `steps`, `ledger` are undocumented.

### The transformations nothing here covers — the actual gap list

1. **Markdown → markdown structural rewrite with byte-identity proof.** `sync_to_md.py` rewrites links; `rewrite-skills-wikilinks.mjs` rewrites wikilinks; neither proves the *unchanged* bytes stayed unchanged. `fm-roundtrip-audit.mjs` proves that only for frontmatter. Nothing does it for the body. → **`fm rewrite --dialect obsidian|github|commonmark` with a splice-level, non-reparsing writer.**
2. **Link-dialect translation as a first-class transform.** `[[x]]` ↔ `[x](x.md)` ↔ `[x](/slug)`, with the anchor-slug algorithm chosen explicitly (`slug-decision-audit.mjs` exists to measure the swing but no tool applies the decision).
3. **The six-finding gap report.** ghost / broken / orphan / uncovered / stale / over-budget. Spec written, code zero. `graph-data.ts:132` still drops broken edges silently.
4. **Token-budget enforcement at write time.** `budget: 2000` is declared in `mdmap` frontmatter and enforced by nothing on this machine.
5. **Deterministic generated-region rewriting inside a hand-edited file.** `build_catalog.py:replace_block` is a 3-line regex; a `<!-- fm:generated:x -->` block that survives concurrent human edits, refuses on drift, and is byte-stable does not exist.
6. **Markdown → deck.** Campaign decks are authored as `deck.json`, never derived from prose. **No path exists from a `.md` file to a slide deck.** The 17 measured block types are a ready-made target vocabulary.
7. **Rendered-output gates in-app.** Six campaign gates measure pixels, blank runs, collisions, and headline wrap on a *PDF*. Frontmatter's export path has none — it has no overflow probe, no collision check, no caption-length check.
8. **Numeric provenance.** `check-provenance.py`'s hard rule — every numeric token in a derived artefact must appear in a source — generalises to any frontmatter transform (excerpt, summary, share snapshot, AI rewrite) and exists nowhere in `src/`.
9. **Find/replace with the four-verdict refusal contract.** `apply-patches.py` has it; frontmatter's AI-edit and toolbar-transform paths do not.
10. **Multi-file → one-file roll-up.** `make-onefile.py` does it for 10 episodes; frontmatter has no "flatten this folder into one reviewable document" transform, and no versioned-filename discipline (LR#69) on any export.
11. **Non-markdown → markdown ingest.** `type-handlers.md` specifies extraction for 14 formats (pdf/epub/pptx/xlsx/mp3/mp4/csv/ipynb…) with an honest `fidelity` field. Frontmatter imports nothing but markdown.
12. **Frontmatter *schema* declaration and validation.** `validate.py` hard-codes 6 required keys and 5 enums for one repo. There is no user-declarable schema anywhere.
13. **Certification of the *export* path.** mdmax certifies 15 read surfaces. It does not certify frontmatter's own PDF/HTML export against them — the one surface frontmatter itself produces.

### Anti-recommendations

- **Do not port `_fm.py`.** It is a documented non-general YAML subset parser; frontmatter already has two strictly better parsers. Porting it re-introduces the class `frontmatter-prepass.ts` was built to kill (18.74% of 907 blocks invalid YAML).
- **Do not port `make-carousel.py`.** Superseded by `make-deck.py` in its own docstring; keeping both duplicates a renderer.
- **Do not build a prettier graph view.** `01-thesis/not-a-graph-view.md` and `02-evidence/graphify-hairball.md` are the standing refutation, and the live graph (3,848 nodes / 3,737 edges) is the exhibit.
- **Do not adopt `sync_to_md.py`'s `shutil.rmtree(DEST)` rebuild.** Destroy-then-recreate as the normal path is a RULE 3 hazard in a user's vault.
- **Do not treat mdmax's `--histogram` output as a per-block number.** Its three internal totals (259 / 365 / 261) count different units.
- **Do not certify Slack or Discord by UI automation.** `targets.ts` rules it out by name; they are modelled as lossy sinks, not renderers.
- **Do not quote the "43.71% → 4.28% divergence" figure against `mdmax/fold@1`.** `fold.ts` states outright that the number is the research prototype's, over a corpus with no `corpus_id`, and that this implementation has never been run on it.
- **Do not chase an AI-detector score** in any prose gate ported from `content-gate.py`; its docstring and LR#13 both forbid it.