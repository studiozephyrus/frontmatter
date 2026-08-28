## KEY FINDINGS
- BYTE-SAFETY HOLDS on foreign data: 0 changed / 0 threw across 7,959 foreign frontmatter files (5 vaults, 5 author entities) + 274 skills-src files + re-run 907/907 home baseline [measured]
- COVERAGE DOES NOT TRANSFER: home refusal rate 0.00% vs foreign 4.7%-97.6% per vault; aggregate 6,614/7,959 = 83.1% refused (15.5% excluding the hub outlier) — the writer declines to publish rather than corrupting [measured]
- ONE ROOT CAUSE explains 6,613 of 6,614 refusals: zero-indent block sequences (`tags:\n- item`) — spec-valid YAML, PyYAML's DEFAULT dump shape, the obsidian-hub template shape, idiomatic in CJK vaults; the writer's walk treats any bare top-level line without a colon as 'not a plain map' [measured, bucketer reproduced oracle counts exactly per vault]
- NEW failure shape #2: multi-line flow sequence with closing `]` at column 0 refuses (1 file, s-blu 20 Dataview Queries/Frontmatter Overview.md line 41) [measured]
- NEW oracle-blind class (fixture-only, 0 wild instances): bare-CR fence `---\r` misses FM_OPEN, so set-only PREPENDS a duplicate frontmatter block while set+delete cancels — same class as the shipped BOM bug f47555f [measured on $TMPDIR fixture]
- Addressability gap at scale: spaced/CJK/emoji keys fail SAFE_KEY — `date created` in 812/957 oldwinter files, `date modified` 811, CJK keys in 905 files, an emoji key in 20; set/rename targeting them refuse [measured]
- Classic byte hazards are RARE in the wild: 0 BOM, 0 CRLF, 0 bare-CR, 0 '...' close, 0 non-UTF8, 0 unterminated across all 8,452 foreign md files [measured]
- skills-src second corpus: 515 md files live (record said 474, +41 drift), 274 with frontmatter, 274/274 identical, 0 refused [measured]

---

# Foreign-Vault Corpus Widening — kills/limits W1 (single-author corpus)

**Date:** 2026-08-28. **Mode:** research-only; all clones/scratch under `$TMPDIR` scratchpad (`/private/tmp/claude-501/-Users-sagnikmitra-Desktop-GitHub-frontmatter/2e90ab3b-4a90-4362-bce4-042a842a2af5/scratchpad`, hereafter `$S`); no writes to any repo working tree, no commits, no outbound. One `rm -rf` ran against three of my own undersized scratch clones inside `$S/vaults` only (re-creatable by clone).

## 1. Method

- Vault discovery via unauthenticated `api.github.com/search/repositories` (`topic:obsidian-vault`, `topic:digital-garden`, `obsidian vault in:name`) [fetched]. 9 candidates shallow-cloned (`git clone --depth 1`); kept the 5 with ≥100 md files by distinct author entities. Dropped: ashuotaku/Personal-Wiki (39 md), tanepiper/obsidian-garden (49), insile/Obsidian-notes-vault (3), CyanVoxel/Obsidian-Vault-Template (14), erazlogo/obsidian-history-vault (40) [measured].
- **Shape scan** `$S/shape-scan.py`: raw-byte scan for BOM / bare-CR / CRLF / fm-open / `...`-close / unterminated / non-UTF8 / unsafe top-level keys (outside `[A-Za-z0-9_.$-]`) / duplicate keys.
- **Round-trip oracle** `$S/rt-runner.mjs`: imports `spliceFrontmatterValue` from `/Users/sagnikmitra/Desktop/GitHub/frontmatter/scripts/load-splice.mjs`, run as `node --import ./scripts/ts-resolve.mjs` from the repo (node v24.6.0); logic copied from `scripts/fm-roundtrip-audit.mjs`: set `public_slug='audit-test'` → restore-or-delete → byte-compare (Buffer). Read-only.
- **LR#68 discipline:** both tools were first validated against a 12-file synthetic fixture corpus (`$S/fixtures/`) covering every target shape; every fixture classified as designed before touching real data [measured]. A refusal-cause bucketer (`$S/refusal-bucket.py`) reimplementing the writer's walk had to reproduce the oracle's per-vault refusal counts exactly — and did (0/10/21/187/6396) [measured].
- Raw results: `$S/results/{scan,rt,buckets}_*.json`.

## 2. Per-vault table [measured]

| corpus | author entity | md files | withFm | identical | changed | threw | refused | refused % | shape-scan deviations |
|---|---|---|---|---|---|---|---|---|---|
| kepano/kepano-obsidian | kepano (personal vault template; Steph Ango per repo description [fetched], Obsidian CEO [SS]) | 103 | 98 | **98** | 0 | 0 | 0 | 0.00% | none |
| s-blu/obsidian_dataview_example_vault | s-blu (German-handle dataview maintainer [inference from repo]) | 264 | 212 | 202 | 0 | 0 | 10 | 4.72% | unsafe_key 31 (`Would rewatch`) |
| quanru/obsidian-example-lifeos | quanru (Chinese; LifeOS, i18n ar/de/es/fr/ja dirs [fetched]) | 540 | 137 | 116 | 0 | 0 | 21 | 15.33% | none |
| oldwinter/knowledge-garden | oldwinter (Chinese digital garden, 2,459 stars [fetched]) | 959 | 957 | 770 | 0 | 0 | 187 | 19.54% | unsafe_key **905** |
| community-archive/obsidian-hub | community hub, many contributors [fetched] | 6,586 | 6,555 | 159 | 0 | 0 | **6,396** | **97.57%** | none |
| **TOTAL foreign** | 5 entities | **8,452** | **7,959** | **1,345** | **0** | **0** | **6,614** | **83.10%** (15.53% excl. hub: 218/1,404) | — |
| ~/.claude/skills-src (named second corpus) | skills authors, this machine | 515 (record said 474; +41 drift) | 274 | **274** | 0 | 0 | 0 | 0.00% | none |
| home pinned corpus (baseline re-run) | single author (md+knowledge+frontmatter roots per `fm-roundtrip-audit.mjs`) | 1,084 scanned | 907 | **907** | 0 | 0 | 0 | 0.00% | 1 file drifted from pin, tested live [measured] |

Shape scan totals across all 8,452 foreign files: **0 BOM, 0 bare-CR, 0 CRLF, 0 `...`-close, 0 non-UTF8, 0 unterminated fences** [measured]. All six shapes verified detectable by the scanner on fixtures first [measured].

## 3. Verdict on 907/907-class behavior

**The half of 907/907 that matters most — never corrupt, never throw — HOLDS on foreign multi-author data:** 0 changed / 0 threw in 7,959 foreign frontmatter round trips, 274 skills-src, and the re-run 907 home baseline [measured]. Every refusal was a verified clean no-op (`published === src`; probe P4) [measured].

**The implicit coverage reading — "the splice writer can publish any real vault file" — does NOT transfer.** Home refusal 0.00%; foreign per-vault 0%, 4.72%, 15.33%, 19.54%, 97.57%. For a fifth of a real Chinese vault and ~98% of the community hub, publish would silently do nothing. W1 is confirmed as a real weakness — but it hid an availability cliff, not corruption.

## 4. NEW failure shapes (reproducing paths in $TMPDIR)

**NF-1 — zero-indent block sequences (dominant: 6,613 of 6,614 refusals).** `key:\n- item` with the dash at column 0 is spec-valid YAML and is the DEFAULT dump shape of PyYAML 6.0.3 (`'tags:\n- a\n- b\n'` [measured]; js-yaml and eemeli-yaml emit 2-space indents [measured]). The writer's walk (splice-frontmatter.ts lines 197–200 [fetched]) refuses any bare top-level line lacking a colon. Variants: hub template's *empty* items `aliases:\n- ` (6,386 files under `aliases`, 10 under `tags` [measured]); CJK-keyed lists `分类:\n- '[[本库教程 - fileclass]]'` (oldwinter, top parents 分类 77 / 主要训练肌肉 48 / tags 15 / aliases 15 / 🏃 训练动作集合 14 [measured]); plain lists under `tags` (quanru, all 21) and `booktopics`/`ingredients`/`genres` (s-blu). Repro: `$S/vaults/community-archive_obsidian-hub/00 - Start here.md`, `$S/vaults/oldwinter__knowledge-garden/README.md`, `$S/vaults/quanru_obsidian-example-lifeos/-1. Capture/README.md` (also shows tolerated blank lines inside the block), `$S/vaults/s-blu_obsidian_dataview_example_vault/10 Example Data/books/books_1.md`. Recognizing `-` items as continuations of the preceding key would recover 99.98% of all foreign refusals [inference from measured buckets].

**NF-2 — multi-line flow sequence closing `]` at column 0** (1 file). Repro: `$S/vaults/s-blu_obsidian_dataview_example_vault/20 Dataview Queries/Frontmatter Overview.md` line 41 [measured].

**NF-3 — bare-CR fence is oracle-blind and set-destructive (fixture-only; 0 wild instances).** `---\r` misses `FM_OPEN`, so a lone set PREPENDS a second frontmatter block (`"---\npublic_slug: audit-test\n---\n\n---\rtitle: oldmac..."` [measured, probe P1]) while set+delete cancels — structurally invisible to this oracle, the exact class of the shipped BOM bug (f47555f). Repro: `$S/fixtures/barecr.md`.

**NF-4 — addressability gap for spaced/CJK/emoji keys (not corruption).** `date created` (812 files) / `date modified` (811) / 232 CJK-keyed / 1 emoji-keyed files fail `SAFE_KEY`; set and rename targeting `date created` both refuse [measured, probes P2/P3]. Unsafe keys on OTHER lines are tolerated and round-trip byte-identical [measured, fixture + vaults]. s-blu adds `Would rewatch` ×31.

## 5. Notes and caveats

- The hub's 97.57% is template-driven (one generator stamped `aliases:\n- ` everywhere; its generator scripts are Python — consistent with the PyYAML shape [inference]); the honest wild-vault refusal band is the non-hub 4.7–19.5%.
- 0 CRLF across GitHub-published vaults is itself a corpus property (LF-normalized publishing) [measured]; CRLF handling was still verified via fixtures [measured].
- Oracle comparison is string-space like the repo audit, plus a raw-bytes check: `rawMismatchOnly=0` everywhere real; the one non-UTF8 fixture behaved as designed [measured].
- skills-src count drift (515 vs the record's 474) is reported, not explained — could be growth since the record or exclusion-rule differences [unverified which].
- Percentages: 10/212=4.72, 21/137=15.33, 187/957=19.54, 6396/6555=97.57, 6614/7959=83.10, 218/1404=15.53; identity totals cross-check: identical+refused=withFm for every corpus [measured].

**Artifacts:** tools `$S/shape-scan.py`, `$S/rt-runner.mjs`, `$S/refusal-bucket.py`; results `$S/results/*.json`; clones `$S/vaults/*`; fixtures `$S/fixtures/*`.