### 0. "SGM-CHI" — resolution by inventory (no exact-name match exists)

- [measured] `ls -d ~/Desktop/GitHub/*/` returns 84 repo dirs; `grep -iE 'chi|sgm|sigma|shi|chai'` over them returns **zero** matches. No internal system is named SGM-CHI.
- [measured] `ecosystem.md` product cards: §5.0–5.20 (21 cards), §8.1–8.7 (7 internal-tooling cards), §9.1–9.10 (10 personal/partner sites). None named "chi".
- Phonetic candidates, ranked: **HQ** (`~/Desktop/GitHub/hq`, hq.sgnk.ai — "sgnk H-Q" → "SGM-CHI-Q") · **sgnk-md** (`~/Desktop/GitHub/md`) · **sgnkai/AIOS** (`~/Desktop/GitHub/sgnkai`, `~/Desktop/GitHub/aios-site`) · **sgnk Markex** (`~/Desktop/GitHub/content`, package name `sgnk-markex`) · **sgnkos** (`~/Desktop/GitHub/sgnkos`, package `vite_react_shadcn_ts`).
- Mitigation: this inventory covers the **superset** — all five candidates plus AIOS, MDMAX, knowledge, campaign, design system, skills-registry.

### 1. AIOS control plane — `/Users/sagnikmitra/.claude/`

| Artifact | [measured] count | Mechanism |
|---|---|---|
| `CLAUDE.md` | 892 lines / 63,519 bytes | Policy kernel. `## RULE 1`–`## RULE 8` (8 zero-tolerance rules) + `## Learned Rules` append-only ledger, **76 numbered entries, newest = #74** (i5 reported "#73" on 2026-08-28 — **disagrees**, +3 since) |
| `skills-src/` | **124 SKILL.md** across 27 dirs (25 categories + `_parked` 3, `_tests` 2) | Largest: `ops-agent` 26, `aios-library` 15, `plan` 11, `knowledge-docs` 9, `browser` 8, `ops-safety` 8, `knowledge-search` 7 |
| `skills/` (linked) | **130 entries** | i4 quoted "~93–102 skills" / "99 skills, ~20 dormant, 54% pass description bar" / "all 95 skills tested green" — **all four disagree with today's 124/130** |
| `rules/` | 1 file: `gvc.md` | Trigger-routing rule doc |
| `imports/sgnk-skills.md` | `@`-referenced deferred context | Token-budget module system (LR#28) |
| `settings.json` hooks | **28 hook commands across 9 events** | see below |

- [measured] Hook wiring: **SessionStart 9** (graphify install, `sgnk-autorecall.sh`, `sgnk-drift-check.sh`, calibration-alert flag, `sgnk-trifecta-check.sh`, `sgnk-session-evals.sh`, `sgnk-mcp-pin.sh`, `sgnk-md-sync-catchup.sh`, `sgnk-reward-gold-nudge.sh`) · **UserPromptSubmit 5** (`sgnk-nudge`, `sgnk-pref-capture`, `sgnk-digression-guard`, `sgnk-skill-suggest`, `sgnk-complexity-hook`) · **PreToolUse 6** (matchers `Edit|Write|MultiEdit`→shadow-gate, `Skill`→skill-track, `Bash`→bash-guard, `mcp__.*`→mcp-guard, `Workflow`→spawn-gate, `WebFetch|mcp__.*`→taint-gate) · **PostToolUse 3** (injection-scan, bash-assert, `sgnk-loop-guard.py`) · **Stop 2** (`sgnk-trace-append.sh`, `sgnk-stop-verify.sh`) · **SubagentStop 1** · **SessionEnd 1** (`sgnk-capture.sh`) · **PreCompact 1** (`sgnk-precompact.sh`).
- [measured] `settings.json` env: `SGNK_BANDIT_EXPLORE=1`, `SGNK_BANDIT_TRANSFER=0` (LR#63: EXPLORE=1 makes determinism checks stochastic).

### 2. AIOS substrate — `/Users/sagnikmitra/.sgnk/` [all measured 2026-08-29]

| Store | Count | Shape |
|---|---|---|
| `traces/` | 110 daily JSONL files, **5,014 rows** (i4 said 4,994 on 2026-08-28 — **disagrees, +20**) | one row per task |
| `state/complexity-gate-log.jsonl` | **24,539 rows** (i4 said 23,778 — **disagrees, +761**) | gate verdicts |
| `state/*.gate-tier.json` | **21,556** | per-session tier sidecar |
| `state/*.turn-meta.json` | **15,634** | `{turn_start_s, task_shape}` |
| `state/*.count` | 6,021 | turn counters |
| `state/propensity.jsonl` | **44,037** | off-policy propensity |
| `state/routing-journal.jsonl` | **25,913** | routing decisions |
| `state/injection-hits.jsonl` | **1,707** | prompt-injection detections |
| `state/assertions.jsonl` | **725** | gate-exit assertions (unchanged vs i4) |
| `state/trigger-log.jsonl` / `spawn-log.jsonl` / `self-heal.jsonl` | 388 / 254 / 139 | |
| `state/context-features.jsonl` | 193 | |
| `state/routing-shadow.jsonl` | 83 | |
| `state/ledger-chain.jsonl` | **59** | tamper-evident hash chain |
| `state/regression-gates.jsonl` | **40** | registered gates |
| `state/epochs.jsonl` / `casebank-ops.jsonl` | 12 / 5 | |
| `PREFERENCE-LOG.jsonl` | **232 rows**, 17 keys | `timestamp, session_id, correlation_id, prompt_hash, output_hash, label, correction_text, skill, skill_version, model, tier, routing_path, orphan, schema, output_label, weight, source` |
| `auto-memories.jsonl` | 22 | |
| `shadow-log.jsonl` | **1 row** (2026-07-19, `sgnk-supabase-migration`, `real_n=5 p25=0.6248 bar=0.75`, served `sonnet`) | shadow-promote ladder is built but effectively unused |
| `baselines/` | **2,382 JSON files** | `YYYYMMDDTHHMMSSZ_<label>_<hex>.json` |
| `gates/` | **69 scripts** — 34 `assert-*.sh` + `break-*.sh` pairs | fail-first proof (LR#68) |
| `evals/` | 33 entries: 21 per-skill dirs + `complexity-gold-*.jsonl`, `complexity-kappa-2026-07-17.json`, `reward-gold.jsonl`, `LABELING-SHEET-2026-06-30.md` | |
| `bin/` | **149 tools** | see §3 |
| `calibration.json` | 8,385 bytes, `schema_version 1`, `updated 2026-08-28T19:43:37Z` | |
| `insights/` | **does not exist** (i4: "empty" — same verdict) | |
| `state/DRIFT-ALERT-*.md` | **0 files today** (i4 observed `-2026-08-20`..`-24` on 2026-08-28) — **disagrees**; drift alerts appear ephemeral/GC'd | |

### 3. AIOS mechanisms, exact

- **Trace-ledger row schema** [measured, `traces/2026-08-28.jsonl`], 31 fields: `timestamp, session_id, correlation_id, skill, skills_extra, skill_context, skill_context_age_s, gate_tier, gate_orchestrate, decided_model, decision_real_n, decision_mode, decision_arm, session_class, task_shape, model, tier, reasoning_effort, input_tokens, fresh_input_tokens, cache_read_tokens, output_tokens, latency_ms, cwd, files_touched, files_sha256, assertion_pass, failure_mode, learning_mode, accepted`.
- **`accepted` fill rate** [measured, last 14 daily files]: **7 / 691**. i4 measured 7/688. The explicit-feedback channel is starved; machine channels are not.
- **Complexity gate verdict** [measured, `.gate-tier.json`]: `{tier, orchestrate, rule2_gated, needs_verify, decided_model, decision_real_n, decision_mode, decision_arm, ts}` — 5-D, not a scalar (LR#35 restatement). Live split **90% floor / 10% strong, 96% single / 4% workflow** measured on 2,064 rows 2026-07-28; **29% (602/2064) floor-tier AND guarded**. [SS: LR#35]
- **Bandit routing** [measured, `state/routing-bandit.json`, mtime 2026-08-20T23:58]: Beta arms per (skill × tier). Priors `sonnet a=4 b=1`, `opus a=1 b=1`, `fable a=1 b=1`. Arms: `sgnk-amc sonnet a=6.5 b=1.0 seeded:"offline-0.5x"` / `opus a=3.0 b=1.5`; `sgnk-proposal sonnet 6.5/1.0, opus 3.5/1.0`; `sgnk-supabase-migration sonnet 6.5/2.0, opus 4/1.5`; `__unattributed__ opus a=24.1 b=5.9, fable 1.7/1`; families `general opus 26.2/6.6`, `domain sonnet 4/2`, `creative opus 1/1.7`, `eng opus 1/1.35`.
- **Escalation ladder** [SS: LR#58]: `sonnet/med → sonnet/high → opus/medium → opus/high → opus/xhigh → opus/max → fable`; `escalation-ladder.sh` owns the walk, `bon-budget` emits `escalate_effort`.
- **Eval loop** [measured, `calibration.json`]: `sgnk-complexity-gate` v1.0.0 → agreement 0.688 / κ_AB 0.56, 5 disagreements, 8 coverage holes; rubric v1.1.0 → agreement **0.938 / κ_AB 0.863**, deterministic rule coverage **14/16**, `meets_kappa_bar: true`. First run flagged `IN-DISTRIBUTION / TAUTOLOGICAL`, `trust: plumbing-validated-only`. Per-skill `separation` block (e.g. `sgnk-amc separation 0.733 OK, high_pass_threshold 0.85`).
- **Preference log / survival mining**: 3-value implicit verdict `accepted_asis / edited_kept / abandoned` from git history + edit-distance, durability re-check + revocation rows. [SS: i4 §2.8]
- **Digression guard**: Breunig 4 modes `{distraction|confusion|clash|scope-creep}` vs the stated prompt-contract goal, one refocus line, never auto-abort. [SS: LR#36]
- **Drift watch**: serialize `{routing_confidence, skill_hit_rate, eval_pass_rate, correction_frequency}` per snapshot; alert on >15% drift at SessionStart; every new model release = baseline reset. [SS: LR#37]
- **Shadow-promote ladder**: offline eval → shadow (parallel run, log-but-serve-old, ≥10 tasks) → auto-promote at pass ≥0.8 holding 20 tasks. [SS: LR#38]
- **Snapshot/recall**: v4 JSON, `.sgnk/{JOURNAL.md, LATEST, LATEST-KEY.md, snapshots/}`; cards `00-KEY.md`…`06-conversation.md` + `derived.json` + `manifest.json`; ID `YYYYMMDDTHHMMSSZ_<kind>_<label>_<4hex>`; `GLOBAL-REGISTRY.md` = **58 registered repo rows** [measured]. frontmatter has **no `.sgnk/`** [measured, i5 concurs].
- **Notable `bin/` tools** [measured, 149 total]: `complexity-verdict.py`, `routing-bandit-{decide,update}.sh`, `routing-promote.sh`, `routing-shadow-gate.sh`, `sgnk-regression-gate.sh`, `verify-ladder.sh`, `escalation-ladder.sh`, `kappa-bootstrap.py`, `goodhart-canary.py`, `sgnk-taint-gate.sh`, `sgnk-injection-scan.sh`, `sgnk-secret-scan.sh`, `sgnk-trifecta-check.sh`, `thompson-propensity.py`, `ope-estimate.py`, `linucb-policy.py`, `sgnk-reward-mine.sh`, `sgnk-casebank.py`, `false-green-scan.sh`, `silent-corruption-check.py`, `verifier-gaming-audit.py`, `sgnk-phi.py`, `datamark.py`, `vote-k.py`, `red-team.py`.

### 4. sgnk-md — `/Users/sagnikmitra/Desktop/GitHub/md/`

- [measured] `package.json` name **`sgnk-md`** v0.1.0, node ≥24, **416 commits**, last commit `02c22ec4` **2026-07-17T22:04:53+05:30** ("read-only md mirrors of all 53 sibling repos"). ecosystem.md §5.2 says "216 commits" — **disagrees**.
- [measured] Tauri: `productName sgnk-md`, identifier **`ai.sgnk.md`**, `frontendDist`/`devUrl`/window url = **`https://md.sgnk.ai`** (thin shell over the hosted web app, not a bundled build), `titleBarStyle Overlay`, `macOSPrivateApi true`, targets `dmg`+`app`, minimum macOS **11.0**, `signingIdentity: null`, category Productivity, © 2026 Sagnik Mitra.
- [measured] Deps include `@ai-sdk/{cerebras,google,groq,mistral}`, `@openrouter/ai-sdk-provider`, `ai ^6.0.191`, CodeMirror 6 suite + `@replit/codemirror-vim`, `next ^16.2.6`, `react ^19.2.6`, `next-auth ^5.0.0-beta.31`, `puppeteer-core ^25.0.4` + `@sparticuz/chromium ^148.0.0`, `mermaid ^11.15.0`, `katex ^0.17.0`, `minisearch ^7.2.0`, `react-force-graph-2d ^1.29.1`, `gray-matter ^4.0.3`, `github-slugger ^2.0.0`, `idb-keyval`, `fflate`, `material-symbols ^0.44.12`.
- [measured] **Features frontmatter lacks: `.github/workflows/ci.yml` (md has it; frontmatter has NO `.github` at all)** and `Mirrors/` (54 entries — read-only mirrors of sibling repos). Vault corpus: **4,548 `.md` files** in the md repo.
- [measured] **81 test files** (frontmatter: 98). Both share `npm run arch` → `specs/harness/clean-architecture-report.mjs`.
- [measured] Everything else in `src/` is a subset of frontmatter — **zero files exist only in md**.

### 5. MDMAX — `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/modules/mdmax/` [measured]

13 files, **3,614 lines**. 11 tests in `test/mdmax/` + `fixtures/pure-function-golden.json`.

| File | Lines | Capability exposed |
|---|---|---|
| `domain/cert-contract.ts` | 168 | 4 verdicts `PASS/STRIP(DEGRADED)/CORRUPT(BROKEN)/VOID`; 3 classes `LEAK/DESTROY/MUTATE`; `before`+`after` REQUIRED; artifact is a JSON sidecar, never written into `.md` |
| `domain/constructs.ts` | 618 | **19 constructs** (`yaml-frontmatter, html-comment, heading-attribute, link-ref-definition, link-ref-idiom, angle-bracket-text, lone-tilde, pipe-in-prose, paren-ordered-list, wikilink, wikilink-embed, unknown-fence-lang, setext-heading, table, strikethrough, autolink, math, footnote, task-list`); minimal pairs; conservative detectors behind a skip mask; returns UTF-8 byte ranges |
| `domain/fold.ts` | 430 | `mdmax/fold@1` — versioned equivalence fold; defines PASS. Prototype numbers **705/1613 strict vs 69/1613 folded = 43.71%→4.28%** over 40 files of `~/Desktop/GitHub/knowledge` × 6 GFM-class engines; **explicitly NOT attachable to `fold@1`** until re-measured |
| `domain/frontmatter-prepass.ts` | 121 | **170 of 907** home front-matter blocks invalid YAML = **18.74%**; repairs `related: [[a]], [[b]]`, REFUSES `[[[A]], [[B]]]`; never writes; never throws |
| `domain/normalize.ts` | 62 | `mdmax/normalize@1` — NFC→collapse-ws→lowercase→NFC; **99.627%** re-anchoring swept over **384 configurations**; golden-file gate over 200 cases |
| `domain/offsets.ts` | 315 | Branded `U16Offset/ByteOffset/GraphemeIndex`; **only 67 of 1,080** corpus files have bytes == UTF-16 units (93.8% diverge); **103 of 2,314** files contain non-BMP; sparse checkpoint index (1/512th memory of the specified dense `Uint32Array`) |
| `domain/placement.ts` | 154 | Insert→reparse→compare block skeleton; setext defect: `"Heading\n---"` → h2, with marker → paragraph+html+thematicBreak, **blank-line isolation does not fix it**; refuse, never repair |
| `domain/shape-gate.ts` | 174 | `MAX_BYTES 4MB`, `MAX_LINES 200_000`, `MAX_LIST_MARKER_LINES 20_000`, `BUDGET_MS`; measured quadratics: `WIKILINK_RE` **k=1.98, 36,865 ms on 320 KB of `[[`**; `mdast-util-from-markdown` **12,429 ms vs micromark 1,207 ms (10.3×)**; strict UTF-8 decode, refuse never repair; cites cmark #373, #389, CVE-2023-22484 |
| `domain/slug.ts` | 115 | `mdmax/slug@1` (github-slugger) to WRITE, tolerant `resolveAnchor` to READ. Audit over **393** anchors in `corpus_id sha256:3a010b16…`: github-slugger **86/393 = 21.88%**, dash-collapsing **375/393 = 95.42%**, either **388/393 = 98.73%**; caveat **85.2% of the 393 come from one file** (`md/Zephyrus/ecosystem.md`), 6 files total |
| `domain/targets.ts` | 133 | **15 targets** (7 `local`, 7 `declared`, 1 spec): `frontmatter-app, commonmark-spec, github-pages, markdown-it-safe, markdown-it-html, marked, react-markdown, github-blob, github-comment, obsidian, notion, typora, bear, slack, discord`. `DECLARED_LAST_VERIFIED = '2026-08-01'`; `uncertifiableShare()`; **7 of ~12 surfaces unprobeable**; Slack/Discord modelled as **lossy sinks**, UI automation ruled out by name |
| `domain/verdict.ts` | 411 | Pure classifier. `![[Some Note]]` → VOID on marked 16.4.2 AND commonmark 0.31.2; `## Heading {#custom}` leaks byte-identically on both — **21/24 `{#id}` leak**; front matter LEAKs in **23 of 24** bench configurations; asymmetric DESTROY test |
| `application/certify.ts` | 375 | Layer 2 inventory + Layer 3 differential; blank-line `splitBlocks` (not mdast); never throws; `brokenHistogram` |
| `infrastructure/bench.ts` | 538 | **7 engines**: `remark-app, react-markdown, marked, markdown-it, markdown-it-html-true, commonmark, kramdown-jekyll`; `benchId` = sha256 over the FULL option set; `JEKYLL_KRAMDOWN_OPTIONS` = Jekyll's 9 kramdown options; `hard_wrap` ON in kramdown-parser-gfm vs OFF in Jekyll (reproduced 2026-08-02); missing engine = HARD REFUSAL |

- CLI: `scripts/mdmax-cert.mjs` — `<file>`, `--json`, `--fail-on=BROKEN`, `--targets=a,b`, `--bench-info`, `--explain <construct>`, `--histogram <glob>`.

### 6. Rest of frontmatter — `src/modules/` [measured, 12 non-mdmax modules, 162 files]

| Module | Files | One line |
|---|---|---|
| `ai` | 11 | Provider-agnostic LLM use-cases: refine, summarize, suggest-links, link-doctor, generate-document, apply-wikilinks; `gateway-client.ts` + `provider-race.ts` |
| `ai-tools` | 2 | Single `SgnkAiButton` surface |
| `app-shell` | 21 | AppShell, CommandPalette+fuzzy, Spotlight, SearchPanel, SettingsModal, ImportModal, LinkDoctorModal, KnowledgeUI, PWARegister, TauriBridge, theme/sidebar/scrollbar/right-pane toggles |
| `auth` | 14 | Dual identity: NextAuth options + allowlist/password **and** Firebase auth gateway + Google sign-in (frontmatter-only) |
| `drafts` | 2 | IndexedDB draft persistence + localStorage dirty index |
| `editor` | 22 | CodeMirror 6 pane, editor store/settings, ghost-text, ai-suggestion, slash-commands, completions, bookmarks, toolbar transforms, split-scroll-sync, live-preview + `live/InlineBlockEditor`, HistoryModal, path-rename |
| `export` | 5 | HTML doc render, print-CSS, server-side `pdf-doc.ts` (react-dom/server, deliberately not index-exported), ExportMenu |
| `graph` | 3 | `react-force-graph-2d` view + `buildGraph`/`groupForTags`/`COLORS` |
| `preview` | 21 | react-markdown renderer: wikilinks, embeds, callouts, editable tables, mermaid, html-policy, image-src, Outline, Backlinks, UnlinkedMentions, PropertiesPanel, RightPane |
| `repository` | 12 | GitHub write path: commit-changes, create/rename/merge note, upload-attachment, `merge3` 3-way merge, `github-writer`, CommitBar |
| `share` | 16 | Public share `/[slug]` + `/p/[slug]`: set/remove share, conflict listing, `splice-frontmatter.ts` (frontmatter-only), share-writer, snapshot port, PublicNoteView + CSS |
| `vault` | 30 | Vault read model: snapshot cache, `markdown-parser`, MiniSearch `search-index`, `link-index`, history/version/restore, zip export, FileTree + context menu/inline dialogs/trash, daily notes, template vars |

- [measured] 30 app routes (identical route set in both repos): 6 `/api/ai/*`, 14 `/api/vault/*`, 2 `/api/share/*`, 2 `/api/export/*`, `/api/commit`, `/api/auth/[...nextauth]`, 4 pages.
- [measured] frontmatter: `package.json` name `frontmatter` v0.1.0, 47 deps / 21 devDeps, **40 commits**, HEAD `7989229`, branch `engine/plan-and-diagnostics`, **98 test files**, **no `.github/`**.

### 7. Knowledge base — `/Users/sagnikmitra/Desktop/GitHub/knowledge/` [measured]

- **234 `.md`** under `categories/` + `layers/`. By category: **ai 181**, computer-science 13, business-startup 1, content-marketing 1, design 1, literature 1, mathematics 1, `_unsorted` 1, `_TEMPLATE-category` 1. Layers: concepts 17, entities 7, maps 7, questions 1. `Paste/` 2.
- **Four disagreeing counts for the same corpus**: `knowledge.md` says "AI — 171 items" and 0 for business/design/content/literature/math; `index/catalog.json` says `count 175, generated 2026-07-27`; `graphify-out/GRAPH_REPORT.md` says **273 files · ~546,933 words**; i4 said "212-note L99 knowledge base"; live find says 234. All five differ.
- Graph: **3,848 nodes · 3,737 edges · 340 communities** (240 shown, 100 thin omitted); extraction 100% EXTRACTED / 0% INFERRED / 0% AMBIGUOUS; 15 INFERRED edges avg confidence 0.68; token cost 0 input / 0 output; built from commit `464eb666`, dated 2026-07-23.
- Structure: `categories/<cat>/<type>/<slug>.md`, `layers/{concepts,entities,maps,questions}`, `pipelines/00-process-paste.md`…`06-nested-paste.md` + `type-handlers.md`, `scripts/{build_catalog.py, scan_paste.py, sync_to_md.py, validate.py, _fm.py}`, `meta/schema.md`.
- `meta/schema.md` = a full frontmatter contract in markdown tables: required `id (YYYYMMDD-slug), title, type(synthesis|concept|entity|question|map), status(queued|processing|done|failed|skipped), created, updated`; `item_type` 14-value enum; `content_hash` dedup key; `fidelity` enum `full|verbatim|ocr|auto-transcribed|partial|summary-only`; `relevance 1–5`; typed `relationships` vocabulary `builds-on, extends, contradicts, supports, applies, prerequisite-of, part-of, references, related`. [SS: i5 §1.9]
- `knowledge.md` uses machine-regenerated regions fenced by `<!-- CATEGORIES:START/END -->`, `<!-- RECENT:START/END -->`, written by `scripts/build_catalog.py`. [SS: i5]
- Product-feature verdict: **YES** — `meta/schema.md` is a working prototype of a user-definable frontmatter **profile**; the fenced generated regions are the UI affordance for the splice writer. [SS: i3/i5]

### 8. Campaign / content engine

- **`~/Desktop/GitHub/content`** = package `sgnk-markex` v0.0.0, 21 deps, live at content.sgnk.ai. `content_item → publish_jobs` fan-out; atomic claim `claim_due_publish_jobs` with `FOR UPDATE SKIP LOCKED`; exponential backoff max 3 attempts; publishers `server/publishers/{facebook,instagram,linkedin,twitter}.js`; AES-256-GCM OAuth token vault; 5-min tick via pg_cron + a Cloudflare Worker (`cron-worker/`) because Vercel Hobby caps cron at 1/day. **Markex is markdown-free**; `server/lib/captionAssistant.js:150` instructs "Do not include markdown". [SS: i1]
- **Uncommitted**: HEAD `973c86f`, 19 modified files, 191/191 server tests passing locally, **10 Supabase migrations pending**; RULE-3 backup exists at `content/backups/contentos-20260810T015006Z.sql.gz`. [SS: i1 §0/§1.7]
- **`~/Desktop/GitHub/sgnk-campaign`** [measured: 42 top-level entries]: `CONTENT-ATLAS-V2.md` (146 specs / 60-post season, mined 151 items into `content-pool.json`), `SGNK-CAMPAIGN-METHOD.md`, `MARKETING-PLAYBOOK.md`, `SERIES-PLAN.md`, `PUBLISH-STATUS.md`, `batch1/`, `batch2/`, `brilliant/`, `brilliant2/`, `episodes/`, `figures/`, 6 gate scripts (`check-provenance.py`, `check-clarity.py`, `check-instagram.py`, `check-overflow.py`, `check-render.py`, `content-gate.py`), builders (`make-deck.py`, `make-carousel.py`, `make-og-card.py`, `make-onefile.py`, `make-status.py`, `build-brilliant.py`, `build-assets.py`), `preview-server.py`, `render-contact-sheet.png`.
- Numbers [SS: i1]: evidence tiers **VERIFIED-LIVE / SECONDARY / NOTE-SOURCED**; per-number provenance table `{value, source path, status, re-derive command}`; `check-provenance.py` "10 checked, 0 numbers with no source"; 79 `figures.json` specs from **5** style-locked generators (`flow|layers|hbar|fields|compare`); **213 rendered pages** pixel-inspected; **10 episodes live, all HTTP 200**; verification fan-out **204 agents / 17.2M tokens**; **only 2 posts ever shipped to LinkedIn**, one with a visible defect since 2026-08-10; 3 on editorial hold; Flesch 66–74; ~5% of newsletters reach 21 issues; MIN_N ≥ 10 before format change; `LinkedIn cannot post a PDF document` (`linkedin.js` implements `/rest/images` + `/rest/videos` only; `content_items.pictures` is one shared jsonb array).

### 9. Design system

- Canonical: **`/Users/sagnikmitra/Desktop/GitHub/sagnikmitra.github.io/sgnk-design-system.md`** — 1,386 lines / 94,942 bytes, v1.3, 29 `##` sections, symlinked into `~/.claude/skills-src/design-build/sgnk-design/references/`. Skill dir also holds `icons.md`, `artifact-vs-file-routing.md`, `sgnk-article-shell.html`, `scripts/material-icon.sh`, `assets/`.
- [measured] Tokens: single accent **Electric Blue `#1a5cff`**, soft `#e8efff`, canvas `#ffffff`, canvas-soft `#f5f5f5`, hairline `#e5e5e5`, ink `#0a0a0a`, ink-soft `#3a3a3a`, body-muted `#6b6b6b`, body-faint `#b8b8b8`. Contrast: body 20.2:1 AAA; blue on canvas 5.16:1 AA; blue on canvas-soft 4.96:1; blue on ink 3.95:1 (AA-Large only); body-faint 2.14:1 **fails AA**. Two typefaces: Google Sans + Google Sans Code; `Silkscreen` pixel-art in image assets only. **Square corners dominate**; only 8px on diagram nodes, 12px on diagram cards, pill on back-to-top. Zero gradients, one elevation rule. 760px reading column. Sibling skills: `sgnk-pwa-ds`, `sgnk-zs-docs`, `design-html`.
- **CONTRADICTION [measured]**: `frontmatter/src/app/globals.css` is **byte-identical to md's** and self-labels *"sgnk-md design system — Linear-style modern SaaS"* with `--accent: #18181b` (near-black), `--link: #0044cc`, `--link-hover: #0055ff`, `--bg: #fafafa`, and `--radius-sm: 6px / --radius: 8px / --radius-lg: 12px`. The product ships **neither the #1a5cff accent nor the square-corner rule** of the canonical system. `material-symbols/rounded.css` is imported as a **web font** — LR#52 bans the Material web font in favour of inline SVG.

### 10. INTERNAL ASSET → PRODUCT FEATURE

| INTERNAL ASSET | WHAT IT DOES TODAY | PRODUCT FEATURE IT COULD BECOME | LIFT | VERDICT |
|---|---|---|---|---|
| `~/.sgnk/traces/` ledger (5,014 rows, 31-field schema) + `ledger-chain.jsonl` (59) | one JSONL row per task with `files_touched`, `files_sha256`, model, tokens | Byte-attributed AI-edit provenance + writing analytics; tamper-evident chain | M | **SHIP** |
| Complexity gate (24,539 rows) + `routing-bandit.json` + escalation ladder | 5-D verdict per prompt; 90/10 floor/strong split | AI-credit cost efficiency (COGS) + a cost/balanced/quality dial | M | **SHIP the deterministic gate; KEEP-INTERNAL the bandit** |
| `sgnk-evals` + `calibration.json` (κ 0.863, bar ≥0.7) | binary pass/fail + critique; Likert schema-rejected | Document quality **gates** (named binary criteria) — the `mdmax cert` lineage | M | **SHIP** |
| `gates/` 34 assert/break pairs + `assertions.jsonl` (725) + `regression-gates.jsonl` (40) | fail-first-validated shell gates | Document CI: `npx mdmax cert`, `--fail-on=BROKEN`, GitHub Action | S | **SHIP** |
| drift-watch (baselines 2,382, >15% threshold) | nightly baseline compare | Doc staleness / rotted-link detection — fully deterministic, no model calls | S | **SHIP** |
| snapshot/recall/handover + PreCompact hook | schema-versioned secret-safe cards + manifest + LATEST pointer | Document AI-session continuity; version-by-new-file + current-pointer | M | **SHIP** |
| SKILL.md format (124 files; `name/description/allowed-tools/capabilities/disable-model-invocation`) | markdown+YAML automations with NOT-for anti-triggers | User-authorable markdown automations; per-document AI permission frontmatter | L | **SHIP** (flagship) |
| Survival-verdict mining (`accepted_asis/edited_kept/abandoned`) | implicit accept/reject from git + edit distance | Implicit AI-edit telemetry — no rating UI | M | **SHIP** (mandatory: explicit channel measured at 7/691) |
| `knowledge/meta/schema.md` + `build_catalog.py` fenced regions | metadata contract + safe machine-write zones | Frontmatter **schema profiles** + editor-enforced splice regions | M | **SHIP** |
| graphify graph (3,848 nodes / 3,737 edges) | offline knowledge graph over the vault | Vault graph/insights view (deterministic reports only) | M | **SHIP (partial)** |
| `docs/mdmap/MAP.md` (`budget: 2000`, `coverage: 0.247`, 81 declared / 20 exist, broken 0, orphans 0, stale 0) | budget-bounded structural map, 8 invariants | Project-map view; **gap report as the product**; token-budget meter | L | **SHIP** |
| MDMAX 13 modules / 3,614 lines | 4-verdict certificate over 15 targets × 7 engines | Degradation certificate, `mdmax explain --as <consumer>`, AEO linter | — | **ALREADY THE MOAT** |
| Markex publish backend | job queue + OAuth vault + 4 publishers | "Documents that ship themselves" — **draft-and-queue with per-post human confirm** | L | **SHIP, RULE-2-gated** |
| sgnk-campaign 6-gate build engine + declarative `figures.json` | refuse-on-defect render checks | Document build gates + declarative figure blocks | M | **SHIP** |
| Evidence tiers + provenance tables | practiced discipline, `check-provenance.py` | Evidence-tier frontmatter fields + provenance chips + linter | M | **SHIP** (most differentiated) |
| HQ pooled-RLS spine (34 modules, 15 migrations, 352 commits) | multi-tenant SaaS + push-ingest + Daily Sync markdown feed | Workspaces/tenancy; HQ becomes frontmatter's first customer | L | **SHIP (lift)** |
| CareerOS entitlements/credits | flags, plans, kill switches, metered AI | Monetization + rollout spine | L | **SHIP (lift)** |
| skills-registry sync (117 registry entries / 123 skill dirs; ecosystem says 184 — **disagrees**) | scan→normalize→hash→fan-out, never clobbers | Multi-destination vault sync + structured-markdown collection catalog | M | **SHIP (design donation)** |
| sgnk-design-system.md (1,386 lines) | canonical brand system | The product's design language | S | **SHIP — and reconcile (see §9 contradiction)** |
| `md/Mirrors/` (54 read-only sibling-repo mirrors) + 4,548 `.md` | dogfood corpus | First customer corpus / demo vault | S | **KEEP-INTERNAL as data** |

### 11. DO-NOT-SHIP (trust burden or confusing as consumer UI)

1. **Learned-Rules ledger / RULE 1–8 self-modifying rulebook** (76 entries) — value is inseparable from one expert operator under a human gate; as UI it reads "the AI writes rules about you". Carry the lessons, not the file. [SS: i4 §3.1]
2. **Multi-agent adversarial machinery** — `sgnk-debate-panel`, `sgnk-consensus`, `sgnk-reflexion-step`, artifact-bus, ~26 `ops-agent` meta-skills. The system's own review ordered a freeze: breadth without usage is latent complexity. Keep pointed at frontmatter's codebase, never at users. [SS: i4 §3.2]
3. **The bandit's *learning claim*** — three documented incidents of prematurely reporting the loop live (LR#60, #62, #63); `shadow-log.jsonl` holds **1 row**. Never market "it learns you" before a decision demonstrably bends (Rule #32).
4. **Shadow-promote / canary ladder as user workflow** — governance for a solo operator's config changes.
5. **Approval-queue security ergonomics** — bash-guard exit-2 blocks, `/sgnk-approve` one-shot hash approvals, trifecta detector. Carry the *invariant* (splice writer), not the interface.
6. **`sgnk-insights` as an ambient loop** — `~/.sgnk/insights/` does not exist after 14 months. On-demand only.
7. **fable-compiler / 5C+F prompt-contract layer as visible UX** — assumes a user who speaks in agent-task contracts.
8. **Likert writing scores** — schema-rejected internally (LR#4); master plan §10 bans them by name.
9. **Ambient AI / un-disableable AI / streaks / badges / soundscapes / format-on-save default / opaque credit repricing / bespoke canvas / mother-markdown container / new format or sigil / plugin marketplace / tree-of-record / block IDs in files / peer CRDT this cycle** — master plan §10, each evidence-carried.
10. **Raw trace analytics of the operator's own machine** — `traces/` carries `cwd` paths to client repos; the *pattern* ships, the *store* does not.

### 12. DUPLICATION MAP — fixed twice today

- [measured] `src/modules/`: **175 files in frontmatter vs 157 in md**; **157 shared** — **145 byte-identical, 12 diverged**. Zero files exist only in md.
- [measured] Whole `src/`: **248 vs 228**; **228 shared — 202 identical, 26 diverged**; **20 only in frontmatter**.
- [measured] The 12 diverged **module** files (each is a two-place fix today): `app-shell/presentation/LinkDoctorModal.tsx`, `auth/index.ts`, `auth/presentation/LoginScreen.tsx`, `editor/presentation/CodeMirrorEditor.tsx`, `graph/presentation/graph-data.ts`, `preview/presentation/PropertiesPanel.tsx`, `repository/presentation/CommitBar.tsx`, `share/domain/slug.ts`, `share/infrastructure/share-writer.ts`, `share/presentation/PublicNoteView.tsx`, `vault/application/get-snapshot.ts`, `vault/infrastructure/search-index.ts`.
- [measured] Diverged outside modules: `src/app/(public)/[slug]/page.tsx`, `(public)/p/[slug]/page.tsx`, `(vault)/layout.tsx`, `api/export/vault/route.ts`, `api/share/route.ts`, `global-error.tsx`, `layout.tsx`, `manifest.ts`, `opengraph-image.tsx`, `robots.ts`, `sitemap.ts`, `config/env.ts`, `container/dependency-container.ts`.
- [measured] frontmatter-only (20): 13 mdmax files, `share/domain/splice-frontmatter.ts`, 4 auth/Firebase files, `shared/infrastructure/firebase/*`, `container/client-container.ts`.
- [measured] **Identical and therefore silently forkable**: `src/app/globals.css`, `src/auth.ts`, `src/proxy.ts`, `src/instrumentation.ts`, and 202 of 228 shared files.
- [measured] **Asymmetric assets**: md has `.github/workflows/ci.yml` and `Mirrors/` (54); frontmatter has **no CI at all**. md is frozen since 2026-07-17; frontmatter has 40 commits.
- Also duplicated in concept: `share/domain/slug.ts` vs `mdmax/domain/slug.ts` (two slug algorithms in one repo); `preview/presentation/frontmatter.ts` (gray-matter) vs `mdmax/domain/frontmatter-prepass.ts` (lenient pre-pass) vs `share/domain/splice-frontmatter.ts` (writer) — three front-matter code paths.
- Brand duplication: sgnk-md is still pitched in `ecosystem.md` §4.5/§5.2 as the canonical markdown answer; ecosystem.md contains **exactly one** mention of "frontmatter" (L969) and **no frontmatter card**. [SS: i2 §0]

### 13. Builder starting paths (all absolute)

- Engine: `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/modules/mdmax/` · CLI `/Users/sagnikmitra/Desktop/GitHub/frontmatter/scripts/mdmax-cert.mjs` · tests `/Users/sagnikmitra/Desktop/GitHub/frontmatter/test/mdmax/` · spec `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/mdmax/PLAN.md` (**1,193,234 bytes**) · `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/engine/PLAN.md`
- Map: `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/mdmap/MAP.md` + regions `01-thesis`…`07-open`
- Governing plan: `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/FRONTMATTER-MASTER-PLAN-2026-08-28.md` · research `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/research/agent-reports-2026-08-28/` (34 files, i1–i7 are the internal sweeps) · `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/FRONTMATTER-PRD-2026-08-29.md`
- Splice writer: `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/modules/share/domain/splice-frontmatter.ts`
- AIOS: `/Users/sagnikmitra/.claude/CLAUDE.md` · `/Users/sagnikmitra/.claude/settings.json` (hooks) · `/Users/sagnikmitra/.claude/skills-src/` · `/Users/sagnikmitra/.sgnk/bin/` (149) · `/Users/sagnikmitra/.sgnk/gates/` (69) · `/Users/sagnikmitra/.sgnk/traces/` · `/Users/sagnikmitra/.sgnk/calibration.json` · `/Users/sagnikmitra/.sgnk/state/routing-bandit.json` · `/Users/sagnikmitra/.sgnk/PREFERENCE-LOG.jsonl` · `/Users/sagnikmitra/.sgnk/GLOBAL-REGISTRY.md`
- Snapshot reference implementation: `/Users/sagnikmitra/Desktop/GitHub/hq/.sgnk/snapshots/20260828T081249Z_eod_2026-08-28_7bc9/`
- sgnk-md: `/Users/sagnikmitra/Desktop/GitHub/md/src-tauri/tauri.conf.json` · `/Users/sagnikmitra/Desktop/GitHub/md/.github/workflows/ci.yml` · vault `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md` (451,785 bytes)
- Knowledge: `/Users/sagnikmitra/Desktop/GitHub/knowledge/meta/schema.md` · `knowledge.md` · `scripts/build_catalog.py` · `graphify-out/GRAPH_REPORT.md`
- Campaign: `/Users/sagnikmitra/Desktop/GitHub/sgnk-campaign/SGNK-CAMPAIGN-METHOD.md`, `check-provenance.py`, `make-deck.py` · `/Users/sagnikmitra/Desktop/GitHub/content/cron-worker/`
- Design: `/Users/sagnikmitra/Desktop/GitHub/sagnikmitra.github.io/sgnk-design-system.md` · `/Users/sagnikmitra/.claude/skills-src/design-build/sgnk-design/scripts/material-icon.sh` · `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/app/globals.css`

### 14. Contradictions to carry into the PRD

- Trace rows **5,014** [measured today] vs **4,994** [i4, 2026-08-28]. Gate rows **24,539** vs **23,778**. Both moved; neither is wrong.
- Skills: **124 SKILL.md / 130 linked** [measured] vs "~93", "99", "95", "~102", "74-skill estate" across i3/i4/i5 and the AIOS docs. Every historical figure is stale.
- Learned Rules: **76 numbered entries, top = #74** [measured] vs "#73" [i5].
- Knowledge corpus: 234 [measured] vs 175 [catalog.json] vs 171 ["AI items" in knowledge.md] vs 212 [i4] vs 273 files [GRAPH_REPORT.md].
- md commits: **416** [measured] vs 216 [ecosystem.md §5.2].
- skills-registry: **117 registry entries / 123 skill dirs** [measured] vs 184 [ecosystem.md §5.12].
- DRIFT-ALERT files: **0 present today** [measured] vs "-2026-08-20..24 observed" [i4]. The nightly alert channel may be GC'd, not stopped — unresolved.
- Design system: canonical `#1a5cff` + square corners vs shipped `#18181b` + 6/8/12px radii in an identical-across-both-repos `globals.css`.
- Fold divergence: "43.71% → 4.28%" is the **research prototype's** number over 40 files × 6 engines; `mdmax/fold@1` has **never been run over the pinned corpus** — the file forbids attaching either number.
- Naming: **Front Matter CMS has 80,527 installs** `[fetched]`; **MDMAX is npm-unregistered** `[fetched]` — F3 open (master plan §14).