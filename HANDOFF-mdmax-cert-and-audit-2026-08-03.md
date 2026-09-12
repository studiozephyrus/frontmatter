# HANDOFF — MDMAX: §3.8 prerequisites, `mdmax cert`, and the audit that found six critical defects

**Written 2026-08-03. Repo `/Users/sagnikmitra/Desktop/GitHub/frontmatter`. Branch `engine/plan-and-diagnostics`, HEAD `f0603c2`, pushed (0 ahead of origin).**

**This supersedes `HANDOFF-mdmax-markdown-engine-2026-08-01.md`.** That document is still accurate about the *plan*; it is stale about the *code*, and it does not know about any of the defects in §6 below. Do not delete it — it holds the research provenance this one does not repeat.

Related, still valid, do not delete: `HANDOFF-mdz-markdown-format-2026-07-29.md` (why we do **not** build a new markdown format) and `HANDOFF-graph-engineering-research-2026-07-30.md`.

---

## 0. Read this first — the four things that will mislead you

1. **"§3.8 shipped" is in the plan and it is wrong.** `src/modules/mdmax/` is imported by **zero** product files. Verified at write time: `grep -rn 'mdmax' src --include='*.ts' --include='*.tsx' | grep -v '^src/modules/mdmax/'` → **0**. Accurate phrasing: *implemented and unit-tested, not wired in*. `docs/mdmax/PLAN.md` §0.4 says "shipped". Fix the doc or the code, but do not believe the doc.

2. **"Violation 2 closed" is in the plan, in a commit message, and it is wrong at the product level.** The splice function is correct (907/907). The *delivery* is broken: CodeMirror never reads back from the store, so a property edit is reverted by the next keystroke and the stale draft is what gets committed. See §6.1. `56e3d9c` and `93d73c0` both overstate this.

3. **`npm run verify` is green and proves less than it looks like.** 94 files / 1,556 tests / exit 0, verified at write time. But three corpus tests are `it.skipIf(corpus.length === 0)` — at maximum shrinkage the guard turns itself off — and `--passWithNoTests` means a suite that vanishes entirely still exits 0. See §6.7.

4. **The 907/907 corpus number measured a narrow world.** The pinned corpus is one author's Obsidian export. A probe scanned it for the shapes it was about to test: **BOM 0, CR-only 0, `...`-close 0, non-ASCII key 0, sequence-document 0.** Two data-loss bugs live in exactly those gaps. See §6.2 and §6.3.

**Nothing in this document is committed beyond `f0603c2`.** The working tree carries one modified tracked file and five untracked scratch files (§8).

---

## 1. Live numbers, gathered fresh at write time

```
branch                       engine/plan-and-diagnostics
HEAD                         f0603c2   (pushed, 0 ahead of origin)
ahead of main                29 commits
npm run verify               EXIT 0
  typecheck                  0 errors
  lint                       0 errors
  test                       94 files / 1556 tests passed
  build                      Compiled successfully
  arch                       "violations": []
node / npm / ruby            v24.6.0 / 11.5.1 / 4.0.2
stashes                      0
worktrees                    3 (2 extra, both 0 unique commits — safe to remove)
tags                         0
```

**Corpus** — `docs/engine/research/corpus-manifest.json`, `corpus_id sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4`, 1,084 files / 25,548,765 bytes / **907 carrying frontmatter**. Roots: `md` @`02c22ec4` (756), `knowledge` @`464eb666` (272), `frontmatter` @`798ebbf3` (56). Two of the three roots are live vaults edited daily — see §6.7 finding 4.

---

## 2. Chronology — what happened, in order

### 2.1 Session opened on an unfinished task: commit Violation 2

Violation 2 (`PropertiesPanel` re-emitting the whole frontmatter block) had been implemented but not committed. Committed as `56e3d9c` with the per-operation measurement over 907 files:

| operation | re-emit (shipped before) | byte-range splice |
|---|---|---|
| set value | 114 (12.57%) | 906 (99.89%) |
| rename key | **0 (0.00%)** | 907 (100.00%) |
| add + remove | 114 (12.57%) | 907 (100.00%) |
| silently refused | 170 (18.74%) | 0 |

Renaming a key altered **every file in the corpus**. The 170 refusals were files no YAML parser reads, where the panel silently did nothing.

The single remaining set-value divergence is a date-shaped value: unquoted it reads as a YAML Date, the harness can only return a string, and quoting a string is the correct way to preserve stringness. Counted separately, never folded into the pass rate.

Two writer bugs the corpus surfaced, both fixed in `56e3d9c`:
- **Over-quoting** — YAML indicators are special only in *first* position. `Marketing & QA` and `JD | DRM | CC` are valid plain scalars. The over-broad rule requoted **435 of 907** files unnecessarily.
- **New list keys took block form** — an empty existing-value string means "no value yet", not "value continues on the next line".

### 2.2 The verify ladder went red on a counter I had added and never read

`skip` was incremented in `fm-properties-audit.mjs` and never surfaced. Fixed by *reporting* it rather than deleting it — `eadb8a4`.

### 2.3 The round-trip oracle had been crashing, not passing — `7f412f1`

**This is the most instructive failure of the session.** Both oracles read the TypeScript writer and stripped type annotations with a hand-written regex list. That list went stale the moment `emitValue` introduced a union broken across lines, and `fm-roundtrip-audit.mjs` began dying with:

```
SyntaxError: Unexpected token '|'
```

on import, **before printing anything**. Piped through a `grep` for the verdict line, a crash and a pass are byte-identical: both print nothing. **I read that silence as green for an unknown number of runs.**

Node ≥22.18 strips types natively, so the regexes were never needed. `scripts/load-splice.mjs` now imports the source directly and asserts all four exports are callable, exiting 2 with a stated reason otherwise. Verified by deliberately breaking the writer and watching it refuse by name.

With the oracle actually executing:

| implementation | byte-identical | changed |
|---|---|---|
| splice (shipped) | **907 (100.00%)** | 0 |
| `gray-matter` (old share path) | 33 (3.64%) | 703 |
| `yaml` Document (old preview path) | 114 (12.57%) | 623 |

Three consecutive runs of both oracles: exit 0, identical output (LR#63 — one run is an anecdote).

**New house rule P13, recorded in the plan:** *a harness that cannot run must say so louder than one that fails.* Never read silence as success.

### 2.4 Plan §0 reconciled — `93d73c0`

§0 governs where it conflicts with §1–§14, so a stale §0 is worse than none. Updated to record Violation 2 closed, the per-operation table, the two writer bugs, and P13.

**⚠ This edit also introduced the claim that is now wrong — see §0 item 2.**

### 2.5 §3.8, the cross-cutting prerequisites — `c56a04e`

Six modules under `src/modules/mdmax/domain/`. §10.10.2 blocks all further engine work on these, and §11 never scheduled them.

- **`offsets.ts`** — branded `U16Offset` / `ByteOffset` / `GraphemeIndex` the compiler will not let you mix; one `OffsetMap` as the sole conversion point; boundary policy **refuse, never round**. Only 67 of 1,080 corpus files have `bytes == UTF-16 == code points`; **93.8% already diverge**. Index is a checkpoint every 512 units, not the dense `Uint32Array` the plan specifies — same answer, 8 KB instead of 16 MB per open document at the 4 MB ceiling. **This module has a live off-by-3 bug — §6.6.**
- **`normalize.ts` / `slug.ts`** — pinned behind a 200-case golden digest (`test/mdmax/fixtures/pure-function-golden.json`). Digests: normalize `a95ba399c4ff3ffc…`, slug `9e186b68456415f2…`. Stable across 3 consecutive runs.
- **`frontmatter-prepass.ts`** — 170 of 907 blocks are invalid YAML. Two shapes, **opposite treatment**: `related: [[a]], [[b]]` errors and is repaired *for reading*; `[[[A]], [[B]]]` parses with **zero errors** while silently turning links into nested arrays, so it is **refused**. Read-only throughout.
- **`shape-gate.ts`** — 4 MB / 200k lines / 20k list-marker lines, strict UTF-8 decode that refuses rather than repairs, BOM strip, stated 250/2000/10000 ms budgets. Every failure a discriminated union with a sub-200-char explanation.
- **`placement.ts`** — house rule P5. Red proof runs first and uses the same parser the product renders with.

### 2.6 D11 — the slug decision, re-measured rather than trusted — `d2380c0`

`scripts/slug-decision-audit.mjs`, over the 393 intra-document anchors in the pinned corpus:

| algorithm | resolved | rate |
|---|---|---|
| github-slugger (GitHub, rehype-slug) | 86 / 393 | **21.88%** |
| dash-collapsing | 375 / 393 | **95.42%** |
| accept EITHER form | 388 / 393 | **98.73%** |

The plan's 86 reproduces **exactly**. The two single algorithms are not competing theories of one population — they describe two kinds of author. `#2-personas--use-cases` fails dash-collapsing *because* its double dash is github-slugger's own output for `&`, copied off a rendered page; `#claude` fails github-slugger because a human typed it.

**Decision: write the canonical GitHub form, resolve tolerantly.** `resolveAnchor` reports *which* form matched, so a `COLLAPSED` hit can be surfaced as a link that works here and breaks on GitHub.

> **CAVEAT THAT MUST TRAVEL WITH THESE NUMBERS: 85.2% of the 393 anchors come from a single file (`md/Zephyrus/ecosystem.md`), across only 6 files.** Enough to break a tie. Not a law.

### 2.7 `mdmax cert` built via a 7-agent workflow — `f0603c2`

Workflow `wf_15f31144-e22`. **7 agents, 0 errors, 1,071,441 subagent tokens, 238 tool uses, 1,613,469 ms (~27 min).** Four component agents in parallel (fold / verdict / bench / constructs), then three adversarial verifiers.

**The bench — 7 engines, every one at the version the research used:**

```
remark-app        the app's OWN preview pipeline, all 9 plugins from Markdown.tsx
react-markdown    10.1.0 defaults (no rehype-raw → HTML escaped)
marked            16.4.2
markdown-it       15.0.0 at html:false AND html:true — they disagree; that IS the finding
commonmark        0.31.2 — the spec oracle
kramdown-jekyll   2.5.2 + kramdown-parser-gfm 1.1.0, hard_wrap FALSE
```

`hard_wrap` reproduced exactly before pinning: ON → `<p>Line one<br />\nLine two</p>`; Jekyll's real default → `<p>Line one\nLine two</p>`. Recording "kramdown 2.5.2" alone would have made **every soft line break in every document a false MUTATE**.

**The hard refusal (LR#67) fired for real during integration** — the target registry named engine ids the bench does not build, and the CLI refused with the list of what it *does* build rather than certifying 6 of 7 and reporting green.

### 2.8 What the adversarial pass found in the cert build — all fixed in `f0603c2`

| # | defect | evidence |
|---|---|---|
| 1 | **Every ordered list was `CORRUPT/DESTROY`** | Token matching counts digits; nothing stripped the marker. Over a 40-file sweep, **66 of 66 missing tokens across every DESTROY cell were pure digits — the entire class was noise.** |
| 2 | **`Array<string>` — the plan's own DESTROY exemplar — reported PASS** | Haystack was folded HTML *with tags*, so `string` came from the `<string>` tag a browser drops. 10 of 15 real blocks passed. Survived review because the tests inject a tag-stripping fold production never uses (**LR#59**). |
| 3 | **`title: "Getting Started"` reported PASS** | LEAK needle from raw source matched against escaped output; any carrier with `& < > " '` or smart punctuation vanished — zeroing front matter, the plan's highest-frequency finding at 23/24. |
| 4 | **Indented code not excluded** | `    ![[Some Note]]` → VOID, `    ## H {#x}` → LEAK, on any doc showing markdown as an example. Fenced equivalents were already correct — the two halves of the grammar disagreed. |
| 5 | **My own: `remark-app` shared 2 of the app's 9 plugins** | while named "the app's own pipeline" and backing the `frontmatter-app` target. 4 of 4 probes diverged. The file's own header pins kramdown's `hard_wrap` OFF to avoid false MUTATEs — and `remark-breaks` **is** hard_wrap. |

**Two design corrections of mine, both measured:**
- **MUTATE is judged against bench CONSENSUS, not the spec oracle.** Using commonmark as reference made *every GFM table* a MUTATE, because the spec has no tables and the one "disagreeing" engine was the reference itself — **356 MUTATEs on a five-file sample, nearly all false.** Ties produce no reference rather than a manufactured one.
- **The fold gained `heading-anchor-id`.** kramdown emits `<h1 id="a-heading">` where marked and commonmark emit `<h1>`. It does **not** hide the `{#id}` finding, which lives in the text stream — there is an explicit test asserting exactly that.

### 2.9 The user asked what was pending; the honest answer was "not end to end"

Inventory given: 2 of 7 capabilities built, no CI, OAuth scope wrong, export contract undecided, six construct defects live, docs stale.

### 2.10 The user then asked for the untested angles — workflow `wf_dcc7ded9-2f2`

**6 probes, 0 errors, 1,282,571 subagent tokens, 367 tool uses, 2,049,826 ms (~34 min).** Read-only, execution-based. This is where the session's most valuable output came from — see §6.

---

## 3. Scoring / measurement tables — every one, verbatim

### 3.1 Splice writer round trip (`scripts/fm-roundtrip-audit.mjs`)

| implementation | byte-identical | changed | threw | refused |
|---|---|---|---|---|
| **splice (shipped)** | **907 (100.00%)** | 0 | 0 | 0 |
| `gray-matter` | 33 (3.64%) | 703 | — | 0 |
| `yaml` Document | 114 (12.57%) | 623 | 0 | 170 |

### 3.2 Properties panel, per operation (`scripts/fm-properties-audit.mjs`)

| operation | re-emit | splice |
|---|---|---|
| set value | 114 (12.57%) | 906 (99.89%) + 1 date-typed |
| rename key | 0 (0.00%) | 907 (100.00%) |
| add + remove | 114 (12.57%) | 907 (100.00%) |

### 3.3 Slug decision (D11)

| algorithm | resolved | rate |
|---|---|---|
| github-slugger | 86 / 393 | 21.88% |
| dash-collapsing | 375 / 393 | 95.42% |
| **accept either** | **388 / 393** | **98.73%** |

Concentration: `md/Zephyrus/ecosystem.md` 335 (85.2%), `Claude Code Skills Reference.md` 32 (8.1%), `HQ PRD.md` 20 (5.1%), 3 others ≤4.

### 3.4 `mdmax cert` BROKEN-class histogram — **two corpora, four runs**

**Our own docs** (`docs/adr` + `docs/engine`, 5 files, 738 blocks):

| target set | blocks BROKEN | files BROKEN |
|---|---|---|
| all 7 targets | 376 (**50.95%**) | 5 (100%) |
| excluding `frontmatter-app` | 50 (**6.78%**) | 3 (60%) |

**Foreign corpus** — 30 third-party `README.md` files from `node_modules`, i.e. documents we did not write (this is §11.7's actual gate), 2,907 blocks:

| target set | blocks BROKEN | files BROKEN |
|---|---|---|
| all 7 targets | 491 (**16.89%**) | 30 (100%) |
| excluding `frontmatter-app` | 168 (**5.78%**) | 29 (96.67%) |

**The gap between "all 7" and "excluding the app" is ONE cause and it is a true finding:** the app is the only engine of the seven that turns a soft line break into `<br>` (`remark-breaks` in `Markdown.tsx:67`). Every multi-line paragraph renders differently in frontmatter's own preview than on GitHub, marked, markdown-it, commonmark, kramdown or react-markdown. Verified directly — 7-engine table, only `remark-app` emits `<br>`.

**Cross-corpus replication: 6.78% (ours) vs 5.78% (foreign).** The rate holds on documents we did not write.

### 3.5 Kill conditions

| condition | verdict | evidence |
|---|---|---|
| (1) the fold swallows everything | **DOES NOT FIRE** | 6.78% of blocks / 60% of files against thresholds of ~1% and ~15%; replicated at 5.78% on a foreign corpus |
| (4) it is a lint rule, not a certificate | **PRELIMINARY — DO NOT CALL** | top-5 constructs at 96.1% > 80%, but **41% (ours) / 80% (foreign) of attributions are `__unattributed__`**, and the construct detector has six known unfixed defects (§6.9). K4 is capability-ending; it must not be decided by a broken counter. |
| (2) uncertifiable surfaces | not evaluated | 8 of 15 registry targets are `declared`/`requires-push` |
| (5) product gate K5 | not evaluated | needs 30 probed users |

### 3.6 Performance — fold linearity (probe-measured, log-log fit)

| shape | 12 KB | 23 KB | 47 KB | 94 KB | 188 KB | k |
|---|---|---|---|---|---|---|
| **unclosed `<a `** | 71.6 | 252.2 | 910.4 | 3663.8 | 15431.3 | **1.94** |
| nested `<div>` | 2.0 | 3.4 | 5.2 | 11.8 | 15.6 | 0.77 |
| 1 MB run of `<` | 1.4 | 1.6 | 4.6 | 5.9 | 12.6 | 0.82 |
| benign prose | 1.3 | 2.1 | 4.5 | 6.4 | 12.0 | 0.79 |

End-to-end through the CLI: `benign90.md` (91,500 B) 0.6 s; `h90.md` (90,000 B) **46.8 s**.

---

## 4. What is BUILT vs ABSENT

| # | capability (PLAN §3) | state |
|---|---|---|
| 1 | splice writer | **BUILT**, wired into both write paths |
| 2 | block identity / re-anchoring | **ABSENT** |
| 3 | `mdmax cert` | **BUILT**, CLI-only, not wired into product |
| 4 | near-miss reference checker | **ABSENT** |
| 5 | budgeted projection | **ABSENT** |
| 6 | provenance | **ABSENT** |
| 7 | pack / unpack | **ABSENT** |

§3.8 prerequisites: all six files exist and are unit-tested. **None is imported by the product.**

---

## 5. Phase status against the user's own bar

The user's stated bar, verbatim, earlier in this arc: *"This is the end of analysis and end of research… Post this, build, build, build."*

| phase | status | evidence |
|---|---|---|
| Plan v2.1.0 authored | **DONE** | `docs/mdmax/PLAN.md`, 15,6xx lines |
| Plan reconciled with HEAD | **PARTIAL** | §0 updated twice; **§0 now contains two false claims** (§0 items 1–2 above) |
| Violation 1 (share-writer) | **DONE + VERIFIED** | `grep -c matter.stringify` → 0 |
| Violation 2 (PropertiesPanel) | **FUNCTION DONE, DELIVERY BROKEN** | §6.1 |
| §3.8 prerequisites | **BUILT, NOT WIRED** | 0 product imports |
| `mdmax cert` | **BUILT** | runs on a foreign corpus |
| Kill condition (1) | **DECIDED — does not fire** | replicated on 2 corpora |
| Kill condition (4) | **NOT DECIDABLE YET** | attribution broken |
| CI | **NOT STARTED** | `.github/` absent |
| The second user (§11 step 1) | **NOT STARTED** | no `test/tenancy/` |
| Docs site / PDF / tree | **STALE** | built 2026-08-02 05:45–05:47, before every code change since |

---

## 6. THE DEFECTS — the payload of this document

Every one below was **re-verified at write time** against live code. Verdicts are `VERIFIED` unless marked otherwise.

### 6.1 CRITICAL — property edits are silently lost in the product `VERIFIED`

`CodeMirrorEditor` **writes** to the Zustand store (`:246`, `:262`, `:394`) and **never reads** it. Verified at write time: `grep -c 'useEditorStore(' src/modules/editor/presentation/CodeMirrorEditor.tsx` → **0**. Its `EditorState` is built once from the `initialContent` prop (`:190`) in a `useEffect` with `[]` deps (`:404`).

So `PropertiesPanel` → `onEdit` → `handleEdit` updates store + IDB draft, while CodeMirror's document still holds pre-edit text. The next `docChanged` fires `setContent(path, doc.toString())` with the **old** text and, 400 ms later, `saveDraft(...)` — clobbering the property edit inside the exact object `CommitBar.tsx:87-90` posts to `/api/commit`.

Proven by the probe with the **real** `CodeMirrorEditor`, real store, real `saveDraft`/`getDraft` on `fake-indexeddb`:

```
CM doc after mount        : "title: Original"
store after panel edit    : "title: EDITED BY PANEL"
CM doc after panel edit   : "title: Original"      <- never synced
store after 1 keystroke   : "title: Original"      <- reverted
IDB draft (== commit body): "title: Original"
```

Two ordinary routes: **split mode** (both panes live, edit a property then type one character) and **reading → edit** (`editor-store.ts:87` makes `reading` the default; `EditorPane.tsx:511` leaves CodeMirror unmounted there).

**This means the entire Violation-2 fix does not reach users.** The splice is right; the wiring is not.

### 6.2 CRITICAL — a UTF-8 BOM destroys the whole frontmatter block `VERIFIED`

`FM_OPEN` in `splice-frontmatter.ts:30` is anchored at byte 0, so `﻿---` never matches, the "no frontmatter" branch runs, and a **new** block is prepended while the original becomes body text.

Re-verified at write time:
```
before keys: ["title","tags"]     after keys: ["public_slug"]
```

Reachable from `share-writer.ts:25`, which has no parse gate. Not reachable from the panel (its `FM_RE` is BOM-blind too, so it renders nothing).

### 6.3 CRITICAL — any non-ASCII key duplicates unboundedly `VERIFIED`

`topLevelKeyLine` (`:36`) matches only `[A-Za-z0-9_.$-]`. A miss falls through to append. Re-verified at write time — three edits to `título`:

```
"---\ntitle: T\ntítulo: one\ntítulo: two\ntítulo: three\n---\n\nBody\n"
key occurrences after 3 edits = 3 (want 1)
```

The document is now invalid YAML (`Map keys must be unique`). Same for `🔑`, `日付`, `a b`, and NFC-vs-NFD (`café` typed two ways renders identically and keys separately). **Fully reachable from the UI:** `addProperty` (`PropertiesPanel.tsx:117`) does **not** validate the key name — `renameKey` does, via `spliceFrontmatterKey`'s guard. `delete` and `rename` on such a key silently no-op.

### 6.4 CRITICAL — unpublish does not revoke a share `VERIFIED (by probe, structurally re-checked at write time)`

`src/app/api/share/route.ts:75` calls `revalidatePath('/p/' + slug)`. The cached public page is `src/app/(public)/[slug]/page.tsx` (`revalidate = 60`); `/p/[slug]` is a `permanentRedirect` stub with `revalidate = false`. It is the **only** cache-invalidation call in the codebase and it purges nothing — the note keeps serving from the ISR/CDN cache at `/<slug>` after unpublish.

### 6.5 CRITICAL — lossy UTF-8 decode round-trips into git history `VERIFIED`

`vault/application/get-snapshot.ts:157` and `vault/infrastructure/search-index.ts:160` use non-fatal `new TextDecoder()`. Re-verified at write time: **2 sites**.

Measured by the probe: `…436166e9206e…` → `"Caf� notes"` → re-encodes `…436166efbfbd206e…`. That string reaches the editor and is written back via `github-writer.ts:90-96` `createBlob(content, encoding:"utf-8")`, so **one latin-1 byte becomes U+FFFD permanently on next save, silently**.

`shape-gate.decodeStrict` (`shape-gate.ts:62`, `{fatal:true}`) returns `{"ok":false,"reason":"INVALID_UTF8","at":{"line":3,"col":4}}` on the same bytes — and is imported by nobody but its own test.

### 6.6 CRITICAL — `OffsetMap` returns byte offsets 3 too large `VERIFIED`

`offsets.ts:117-176`. The constructor's `if (i % BLOCK === 0) this.byteAt[block++] = bytes` fires **after** charging all 4 bytes of a surrogate pair. When a pair's **low** surrogate lands on a multiple of 512, that checkpoint stores the post-pair offset and `toByte`'s walk re-charges 3 more bytes.

Re-verified at write time:
```
emoji at 500  (low surrogate idx 501)  wrong=0
emoji at 511  (low surrogate idx 512)  wrong=511   first: u16=513 got=518 want=515
emoji at 600  (low surrogate idx 601)  wrong=0
```

**511 consecutive wrong lookups**, recovering at the next checkpoint. Reaches shipped output via `constructs.ts:269 toBytes`.

> **The existing test is a one-character near-miss.** `test/mdmax/offsets.test.ts:113` uses `"日"×600 + EMOJI + "a"×600` — low surrogate at 601, `601 % 512 = 89`. Shipped fixture passes; shift the emoji one character to 511 and it fails. **This is LR#68 in the flesh: the test never reproduced the fault.**

### 6.7 CRITICAL/MAJOR — four gates are defeatable `VERIFIED by probe`

1. **CRITICAL — `it.skipIf(corpus.length === 0)` disables the assertion that catches a shrunken corpus.** `test/share/frontmatter-splice.test.ts:242,246,263` — all three corpus tests, *including* the denominator check whose own comment cites LR#65. Run from any cwd ≠ repo root: `Tests 20 passed | 3 skipped (23)`, **exit 0**. With a fake `HOME` the corpus is 23/907 and only *one* test fails — the zero-alteration gate and the LR#68 red proof both went green on a 2.5% corpus. There is **no `.github/workflows`**, so the vaults-absent path is never exercised anywhere but one laptop.
2. **MAJOR — `--passWithNoTests`.** `npm test -- --exclude='**/test/**'` → *No test files found, exiting with code 0*. Without the flag the same command exits 1. 94 files / 1,556 tests can vanish and `npm test` stays green.
3. **MAJOR — the arch gate has no denominator.** `specs/harness/clean-architecture-report.mjs` emits byte-identical `{"total":0,"violations":[]}` and exit 0 whether it scanned 208 files or zero. Proven in a sandbox: renaming `src/modules/` → `src/features/` takes a violating tree from `{"total":3}` exit 1 to `{"total":0}` exit 0.
4. **MAJOR — `corpus_id` is printed as provenance by four gates and verified by none.** Nothing hashes anything; the sole integrity check is the count of files starting with `---`. The probe hashed it: **1,084 pinned / 1,084 MATCHES / 0 drifted** — correct *today*, but two of three roots are vaults edited daily, and a body edit leaves the count at 907 while changing the tested bytes.
5. **MINOR — `EXPECTED = 907` is an equality on a derived property** (LR#66, false-red direction). 177 corpus files have no frontmatter; any one of them gaining some flips both audits to exit 2 on a healthy system.

### 6.8 MAJOR — security findings `VERIFIED by probe`

- **Enforced public CSP is bound to a redirect.** `next.config.ts:48` uses `source: "/p/:slug*"`. Tested with Next's bundled path-to-regexp: `/p/:slug*` vs `/my-note` → **false**. The live public renderer gets only `proxy.ts:112`'s Report-Only CSP, which has **no `report-uri`** — it neither enforces nor reports.
- **`style` passes the sanitiser unfiltered.** `html-policy.ts:145` strips `on*` plus 10 named URL attributes; `style` is in neither list. Observed surviving: a full-viewport click-hijack anchor and a `background-image` beacon.
- **Unauthenticated GitHub-token amplification.** `get-snapshot.ts:134` calls `getHeadSha()` before consulting the cache; `resolvePublicNote` runs twice per render (no `React.cache()`), and `dynamicParams: true` means novel slugs never hit the ISR cache → **≥2 authenticated GitHub calls per anonymous request**, on the token the authed editor shares.
- **Zero-entropy, search-indexed share links.** `SLUG_MIN_LEN = 1`, user-chosen, default derived from the title, no expiry or password; `(public)/[slug]/page.tsx:30` sets `robots: { index: true, follow: true }` while `ShareModal.tsx:88` says "Anyone with the URL can read this note".
- MINOR: unpoliced `srcset`; `String.replace` `$`-pattern injection at `pdf-doc.ts:116` and `export-doc.ts:82`; SVG upload + `image/svg+xml` raw serving.

**NOT-A-BUG, method stated:** 61 sanitiser-bypass payloads → **0 live script-capable nodes**, verified by parse5-walking the output rather than grepping it. 0 `dangerouslySetInnerHTML` in `src/`. PDF export drops raw HTML entirely. KaTeX `trust` off; mermaid `securityLevel` already `strict`. All 25 API routes auth-gated. No OAuth token persisted. CSRF covered by SameSite=Lax + JSON preflight. Path traversal blocked.

### 6.9 MAJOR — six construct-detector defects, all still live `VERIFIED`

Re-verified at write time:

| case | detects | want |
|---|---|---|
| indented code, `html-comment` | 1 | 0 |
| indented code, `angle-bracket-text` | 1 | 0 |
| touching pipes `a \|\| b` | 1 | 2 |
| adjacent wikilinks `[[A]][[B]]` | 1 | 2 |
| 1-column table → `pipe-in-prose` | 6 | 0 |
| `coffee` fence flagged unknown | 1 | 0 |

Causes: the skip mask covers fenced code, inline spans and front matter but **not indented code**; `merge` coalesces ranges that merely *touch* (`r[0] <= last[1]`); `TABLE_DELIM` requires ≥2 columns so single-column tables' pipes are all counted as prose; `FENCE_OPEN` anchors on `^ {0,3}` so tilde fences in blockquotes/lists leak; code-span pairing crosses block boundaries and masks real constructs; and `KNOWN_FENCE_LANGS` contains `cofee`, not `coffee` (one typo, two inverted errors).

**These are what block kill condition (4).**

### 6.10 MAJOR — `byteRange` and `file.bytes` are UTF-16 units labelled bytes `VERIFIED by probe`

`certify.ts` `splitBlocks` accumulates `offset += raw.length` and emits it as `byteRange`; `file.bytes` is `opts.source.length`. Neither goes through `OffsetMap`. On this repo's own `docs/engine/PLAN.md`: utf8 on disk **106,298**, cert `file.bytes` **105,087** — wrong by **1,211**; **10 of 396** block ranges decode to mojibake.

### 6.11 MAJOR — `fold()` is quadratic on unclosed tags `VERIFIED by probe`

`fold.ts:281-285` — when `scan()` finds a tag-looking `<` with no closing `>`, the inner walk scans to end-of-string then `i++`, never advancing past the region scanned. k = **1.94**. Reachable from plain markdown: a CommonMark type-6 HTML block opens on `<div ` and passes through raw until a blank line, no `>` required. 90 KB → **46.8 s** vs 0.6 s for the same size of benign text.

### 6.12 MAJOR — §3.8.5 is unsatisfiable for the writes the product actually does `VERIFIED`

`placement.ts`'s `removeFirstInsertedHtml` forgives exactly **one** inserted `html` node, so it accepts an invisible marker and **refuses every visible-content insert by construction**. Re-verified at a true block boundary: html comment **ACCEPT**; paragraph, callout **REFUSE/SKELETON_CHANGED**.

Every product write inserts visible content (`toolbar-transforms.ts:41,47,53,181,222,239,282`, `AIMenu.tsx:193`, `apply-wikilinks.ts:37`). The gate is correct for anchors and unusable for the writes that happen. Either §3.8.5's "every byte" is wrong, or `safeInsert` needs a content-insert mode.

### 6.13 MINOR — the eslint offset guard does not exist `VERIFIED`

§3.8.1 requires a `no-restricted-syntax` rule banning `Buffer.byteLength` / `TextEncoder` / `codePointAt` / raw `.slice` outside the offset module. `eslint.config.mjs` has none. Little would be caught today — `Buffer.byteLength` 0 call sites, `TextEncoder` 0, `codePointAt`/`charCodeAt` 0 outside mdmax — but raw `.slice`/`.substring` on note content is **119 sites** outside mdmax and needs careful scoping.

---

## 7. Meta-observations that change how the next agent should work

1. **The two workflows in this session worked well** — 7/7 and 6/6 agents returned real findings with observed output, 0 errors. Contrast with the historical note in `sgnk-handover` about 7-of-8 agents returning status lines. The difference was almost certainly the prompt: every agent was given an explicit "report with observed output, never a number you did not see" clause and a named severity vocabulary.
2. **Adversarial verification paid for itself twice.** The cert build's verifier found 4 defects *in code its sibling agents had just certified*; the untested-surfaces probe found 6 more in code I had personally verified. **Neither would have surfaced from a non-adversarial pass.**
3. **A verifier written in the same session as its subject inherits its blind spots (LR#60), and it happened again** — the verdict tests inject a tag-stripping fold that production never uses, so a test double diverged from the shipped function and hid a critical defect.
4. **`grep -c` piped through `head` reports `head`'s exit status, not grep's.** I misread a check because of this. Count into a variable.
5. **zsh vs bash keeps biting (LR#64/66).** A bare `--include=*.ts` aborted a whole command under zsh; `$TMPDIR` differed between two invocations minutes apart, losing a fixture directory. Use absolute scratch paths.
6. **A literal NUL byte in a source file** (an agent used one as a hash separator) makes every text tool treat the file as binary while remaining valid JS. `file` says `data`; `grep` silently finds nothing. Fixed to ` `.

---

## 8. Working tree, deletions, and what has no second copy

**Modified, tracked, uncommitted:** `HANDOFF-graph-engineering-research-2026-07-30.md` (+26/−4). **Not authored this session** — do not commit it blind; diff it first.

**Untracked litter (safe to delete, none referenced by any script):** `.scratch-carrier.mjs`, `.scratch-lossy.mjs`, `arx.xml`, `cx.html`, `polyg.yml`.

**Worktrees:** `.claude/worktrees/competent-bassi-5da9a1` (2 dirty paths — `src/app/robots.ts`, `src/app/sitemap.ts`) and `.claude/worktrees/upbeat-euclid-60dbf4` (clean). **Both hold 0 unique commits.** Removing them loses nothing except those 2 uncommitted files — inspect first, then `git worktree remove`.

**Regenerable:** `node_modules` (929M), `.next` (81M), `docs/mdmax/site` (4.0M), `docs/mdmax/tree` (1.2M), `.claude/worktrees` (88M).

**No second copy:** the two private vaults `~/Desktop/GitHub/md` and `~/Desktop/GitHub/knowledge` — **the corpus gate is meaningless without them**, and there is no CI, so they exist on one laptop only.

**Dependencies added this session:** `markdown-it@15.0.0`, `commonmark@0.31.2` (devDependencies, committed in `f0603c2`). System gems installed **outside the repo**: `kramdown 2.5.2`, `kramdown-parser-gfm 1.1.0` via `/opt/homebrew/opt/ruby/bin/gem`. **A fresh machine needs those gems or `mdmax cert` refuses on `kramdown-jekyll`.**

---

## 9. Security posture

- **Full-history scan clean.** `git log --all -S` for GitHub/Vercel/Anthropic token prefixes and private-key headers: 2 hits on a `ghp_`-shaped literal, **both false positives** — prose in `docs/mdmax/PLAN.md` naming the token *prefix* in a security paragraph ("7 GitHub `ghp_`… still unrotated"), plus a workflow journal embedding the same prose. **0 matches for a real token body** (`ghp_` + 20+ chars) across all history and all tracked files.
- **⚠ OPEN, INHERITED, UNRESOLVED:** the user pasted a live GitHub PAT and a live Vercel PAT into an earlier chat window. **I refused to store them and continue to refuse.** They were never written to disk by me. **Both remain unrotated.** Their own LR#2 documents that PAT-shaped strings leak via `~/.claude/projects/**.jsonl` transcript logs. **Rotate both.**
- Token access pattern for this repo: `GH_TOKEN_ZEPHYRUS` via `/Users/sagnikmitra/.config/codex-env/tokens.zsh`, sourced in the same Bash invocation, never printed. Push uses an ephemeral credential helper — see §11.

---

## 10. What to do next — ordered

**Tier 1 — silent data loss or privacy, all reachable by an ordinary user**

1. **Wire CodeMirror to the store** (§6.1). Restores work already believed shipped. Until this lands, the Violation-2 fix does not reach users, and §0 of the plan is lying.
2. **BOM: anchor `FM_OPEN` after an optional BOM, or refuse** (§6.2).
3. **Refuse non-ASCII keys in `spliceFrontmatterValue`, and validate in `addProperty`** the way `renameKey` already does (§6.3).
4. **Fix unpublish revocation** — `revalidatePath` must target `/[slug]`, not `/p/[slug]` (§6.4).
5. **`decodeStrict` on the two `TextDecoder` sites** (§6.5). The function already exists.

**Tier 2 — wrong numbers in shipped output**

6. `OffsetMap` off-by-3, and **re-pin `offsets.test.ts` at index 511 so it fails against the unfixed code first** (§6.6).
7. `byteRange` / `file.bytes` through `OffsetMap` (§6.10).
8. `fold()` unclosed-tag quadratic (§6.11).

**Tier 3 — gates that hide all of the above**

9. Un-skip the corpus gate; drop `--passWithNoTests`; give the arch gate a denominator; hash the corpus instead of counting `---` (§6.7).
10. **Widen the corpus** — add BOM, CRLF, CR-only, `...`-close, non-ASCII and NFD keys, sequence documents as fixtures. This is the real lesson: 907/907 measured one author's Obsidian export, and three of those shapes are broken.

**Tier 4**

11. The six construct defects (§6.9) — **only then can kill condition (4) be called.**
12. The eslint offset guard (§6.13).
13. CI (`.github/` absent).
14. Decide: does §3.8.5 mean marker writes only, or does `safeInsert` need a content mode (§6.12)?
15. Rebuild `docs/mdmax/site`, `tree`, and the PDF — all stale since 2026-08-02 05:47.
16. Correct `PLAN.md` §0: strike "§3.8 shipped" and "Violation 2 closed".

**Do NOT re-litigate:**
- The splice writer's 907/907 — it is real, verified three times, and the oracle now refuses a partial corpus.
- D11, the slug decision — measured, with its concentration caveat recorded.
- Kill condition (1) — decided, does not fire, replicated on two corpora.
- MUTATE-vs-consensus — using the spec oracle as reference was already tried and produced 356 false MUTATEs.
- The sanitiser — 61 payloads, 0 live script nodes, verified by parse5 walk.

**Founder decisions still open (not mine to make):** the export contract (DECIDED in §1.5, OPEN in §12.1.1); OAuth scope — `read:user` at `auth-options.ts:29` grants no repo access, so §11 task 1d cannot be built as written; and whether the second user (§11 step 1, 8–12 days, blocks steps 3/4/6/7/8) starts now.

---

## 11. Run basics

```bash
cd /Users/sagnikmitra/Desktop/GitHub/frontmatter
npm run dev            # next dev
npm run verify         # typecheck && lint && test && build && arch
npx vitest run test/mdmax/
node scripts/fm-roundtrip-audit.mjs splice      # 907/907 expected
node scripts/fm-properties-audit.mjs splice
node --import ./scripts/ts-resolve.mjs scripts/mdmax-cert.mjs --bench-info
node --import ./scripts/ts-resolve.mjs scripts/mdmax-cert.mjs --histogram docs/adr docs/engine
```

`scripts/ts-resolve.mjs` is required for any bare-`node` run of the TypeScript sources — Node strips types natively but does not resolve the `@/` alias or extensionless imports. vitest supplies both from its own resolver, which is exactly why the test suite passed while the CLI could not resolve a single import.

**Push** (the repo is `studiozephyrus/frontmatter`, a personal account, **not** an org — a 404 there means missing access, not a missing repo):

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh
env -u GH_TOKEN -u GITHUB_TOKEN GH_TOKEN_ZEPHYRUS="$GH_TOKEN_ZEPHYRUS" \
  git -c credential.helper= \
      -c credential.helper='!f(){ echo username=studiozephyrus; echo password=$GH_TOKEN_ZEPHYRUS; };f' push
```

Never print token values. `.git/config` lists `osxkeychain` before the Zephyrus helper, which is why the override is needed.

---

## 12. What was NOT investigated

- **Tauri desktop build** (`src-tauri/`) — never opened this session.
- **AI module** (`src/modules/ai`, `ai-tools`) — untouched; the security probe did not audit prompt-injection surface in `AIMenu`.
- **Export module** beyond the two `String.replace` `$`-pattern sites.
- **Graph module** (`src/modules/graph`) — untouched.
- **Runtime behaviour in a browser.** No page was ever loaded. Everything is source reasoning plus node-level execution. The write-path CRITICAL was proven in a jsdom/vitest harness, not against the running app.
- **`docs/mdmap/`** (21 files from the MDZ session) — still uncommitted, not reviewed here.
- **Capabilities 2, 4, 5, 6, 7** — never started, so never tested.
- **Kill conditions (2), (3), (5)** — not evaluated.
- **The 2 dirty files in the `competent-bassi` worktree.**

---

## 13. Completeness statement

| avenue | result |
|---|---|
| Session walk, chronological | §2 — 10 events, all commits SHA'd |
| Raw workflow returns re-read from disk | 6 journals; the 2 relevant ones read in full |
| Live git state | §1 — fresh at write time |
| Stashes | 0 |
| Worktrees | 3; 2 extra, **0 unique commits each** |
| Unpushed branches | none; HEAD 0 ahead of origin |
| Tags | 0 |
| Full-history secret scan | 2 hits, both false positives, 0 real token bodies |
| Scan of this document | done — no credential fragment written; token prefixes named, never spelled with a body |
| Project memory | 2 files read; the MDZ pointer is still accurate and is NOT superseded |
| Skipped/conditional tests | 3 `skipIf` sites — all in one file, all CRITICAL (§6.7) |
| Caches / no-second-copy | §8 — the two private vaults are the only irreplaceable state |
| Run basics | §11 — verified, including the `ts-resolve` requirement and the gem dependency |
| Health check | `npm run verify` exit 0, fresh |
| All 6 critical findings | re-verified against live code at write time |

**Not covered:** I did not read all files in the repo; I did not open a browser; I did not audit the Tauri, AI, graph or export modules beyond what the probes touched; and I did not evaluate three of the five kill conditions. Those are where a surprise could still come from.

**Memory namespace caveat:** Claude Code keys project memory on the **launch CWD**. This project's memory lives at `~/.claude/projects/-Users-sagnikmitra-Desktop-GitHub-frontmatter/memory/`. If the repo moves, that namespace does **not** follow.
