Read-only confirmed — this task issued only `curl`, `node -e`, `grep`, `ls`, `find`. No writes, no commits, nothing touching `~/.claude` or `~/.sgnk`. The dirty AIOS state is pre-existing and not attributable to this run.

### Provenance and instrument

| Fact | Value | Tag |
|---|---|---|
| Machine | Node v24.6.0, darwin 25.6.0, arm64; V8 `heap_size_limit` **4,288 MB** | [measured] |
| Date of every fetch/measure below | 2026-08-29 | [measured] |
| Repo test state | 79 `*.test.ts` files, 9,929 LOC, `.github/workflows` **absent**, `fast-check` **absent**, vitest 4.1.7 installed (latest 4.1.11) | [measured] |
| `curl` reachability | web.dev, fast-check.dev, docs.github.com, cypress.io, chromatic.com, api.github.com, forum.obsidian.md, stryker-mutator.io all HTTP 200 | [measured] |

---

### A1. Engine measurements re-run here (not carried forward)

**`WIKILINK_RE` = `/(!?)\[\[([^\]]+)\]\]/g` against `"[["×n`** [measured]

| pairs | bytes | ms | local k |
|---|---|---|---|
| 10,000 | 20,000 | 137.3 | — |
| 20,000 | 40,000 | 555.7 | 2.02 |
| 40,000 | 80,000 | 2,488.3 | 2.16 |
| 80,000 | 160,000 | 22,843.6 | 3.20 |
| 160,000 | **320,000** | **96,890.7** | 2.08 |

- End-to-end exponent: `log(96890.7/137.3)/log(16) = 6.559/2.773 = 2.37` [derived].
- **Source disagreement, unresolved:** repo archive (`docs/mdmax/PLAN.md` L10872, `test/mdmax/shape-gate.test.ts` L4–5) records **36,865 ms at k=1.98** for the identical 320 KB input. I measure **96,890.7 ms, 2.63× slower** [derived: 96890.7/36865]. Hardware, V8 version, or input construction differ. Both numbers stand; neither is corrected. **Publishing either as "the" number is the error** — publish the exponent (k≈2), which is stable across both.

**`mdast-util-from-markdown` 2.0.3 vs `micromark` 4.0.2** [measured]

| input | mdast ms | micromark ms | ratio |
|---|---|---|---|
| 100 KB realistic note (headings/links/code/table) | 129.9 | 135.0 | **0.96×** |
| 2,000 flat bullets (22.9 KB) | 86.4 | 60.0 | 1.44× |
| 8,000 flat bullets (94.9 KB) | 420.0 | 206.6 | 2.03× |
| 16,000 flat bullets (196.9 KB) | 1,465.8 | 794.6 | 1.84× |
| 32,000 flat bullets (404.9 KB) | **23,527.1** | **801.3** | **29.36×** |

- mdast exponent 16k→32k: `log(16.05)/log(2) = 4.00` [derived] — **worse than quadratic in that band**.
- The archived "10.3× gap" is a point on a curve, not a constant. On ordinary prose the gap is **zero** [measured]; the gap is a property of *input shape*, not of the library.
- micromark 8k→16k is itself k=1.94, then flat 16k→32k (794.6→801.3). That flatness is not credible as linearity — likely JIT/GC artifact. **Recorded, not explained.** Do not cite micromark as linear.

**Write path (the cheap half nobody budgets for)** [measured]

| doc | UTF-8 decode | UTF-8 encode | byte splice | string splice |
|---|---|---|---|---|
| 64 KB | 0.03 ms | 0.05 ms | 0.01 ms | 0.00 ms |
| 1 MB | 0.30 ms | 0.85 ms | 0.05 ms | 0.00 ms |
| 4 MB | 1.16 ms | 3.44 ms | 0.13 ms | 0.00 ms |

- Full 4 MB decode→splice→encode = **4.73 ms** [derived]. All k≈1.0 across 64× input growth [derived].
- **The splice thesis, quantified:** 4.73 ms write vs 23,527 ms mdast reparse of a 405 KB pathological list = **4,974×** [derived]. The architecture argument is not aesthetic; it is four orders of magnitude.

**MiniSearch 7.2.0, synthetic 400-word notes** [measured]

| N | corpus | build | heap Δ | exact query | prefix query |
|---|---|---|---|---|---|
| 1,000 | 2.2 MB | 452 ms | 20 MB | 0.10 ms | 1.52 ms |
| 10,000 | 22.4 MB | 5,613 ms | 117 MB | 0.32 ms | 12.64 ms |
| 50,000 | 112.0 MB | 27,697 ms | **1,036 MB** | 1.64 ms | **130.90 ms** |

- Build is **linear**: 0.452 / 0.561 / 0.554 ms per doc [derived].
- Heap:corpus at 50k = **9.25×** [derived: 1036/112.0]. Per-doc 20.7 KB [derived].
- Prefix-search exponent 10k→50k: `log(10.36)/log(5) = 1.45` [derived] — **superlinear, and prefix is the as-you-type default**.
- 100k extrapolation: build ≈ **55.4 s**, heap ≈ **2.07 GB**, prefix ≈ **357 ms** [derived: 130.90 × 2^1.45].

---

### A2. What shipped competitors actually achieve

| Source | Evidence | Tag |
|---|---|---|
| Obsidian 1.13.7, restricted mode ON, **zero community plugins**, ~10,500 files, NTFS SSD | **~280 ms renderer stall every ~2 s while typing**, attributed to `getAllPropertyInfos()`; freezes vanish *during* cache rebuild and return the instant it completes | [fetched] forum.obsidian.md topic JSON |
| Obsidian forum, other live threads | "Obsidian UI freezes on rename (or move) in large vaults" (33 posts); "Performance Issues on iPhone 14 Pro with Large Vault (~40,000 notes) Using Obsidian Sync" (5); "Performance on large vaults" (14); "Ignore/exclude completely files or a folder from all obsidian indexers and parsers" (104) | [fetched] |
| Logseq | #10378 **open** "Performance lags, actions slow"; #5132 "Very slow performance with **2,500+ blocks** with assets"; #373 "Performance issues typing gets slow and very laggy" | [fetched] api.github.com |
| VS Code | #198146 **open** "File explorer performance degrades when the number of files in workspaces is large"; #72467 "Bad performance when open a large(≥50MB) JSON file without any linewrapper" | [fetched] api.github.com |

- Pattern across all three: **the stall is never in the editor, it is in the metadata/index recompute** [inference from the four sources above].
- Obsidian is native Electron with a full-time team and stalls at 10,500 files with no plugins [fetched]. **Any browser-tab claim above that number, without a measurement, is a lie** [inference].

**Latency thresholds** [fetched web.dev, 2026-08-29]
- INP: **≤200 ms good; >200–500 needs improvement; >500 poor**; measured at **75th percentile of field page loads**, segmented mobile/desktop, discarding one highest interaction per 50.
- RAIL: **100 ms** response, **50 ms** task chunk, **1,000 ms** focus loss, **10,000 ms** abandonment.
- Frame budget 16.7 ms [derived: 1000/60]. MiniSearch prefix at 50k notes = 130.90 ms = **7.8× over frame budget** [derived].

---

### 1. Performance budget table

| # | Operation | Target | Measurement method | Gate that enforces it |
|---|---|---|---|---|
| P1 | Byte splice, ≤4 MB doc | **≤5 ms p99** | vitest bench, fixed corpus, 20 iters | CI fails if p99 > 10 ms (2× headroom). Measured today: 4.73 ms [measured] |
| P2 | UTF-8 decode+validate on open | **≤2 ms/MB** | same | fail >4 ms/MB. Measured 1.16 ms @4 MB [measured] |
| P3 | Any single parse of a user doc | **≤200 ms**, else refuse | `shape-gate.ts` budget-ms, already shipped | **Refusal, not slowdown.** Existing gate: MAX_BYTES 4 MB, MAX_LINES 200,000, MAX_LIST_MARKER_LINES 20,000 [measured, repo] |
| P4 | Regex on user bytes | **k ≤ 1.05** measured over 4 doublings | doubling harness, report exponent not ms | CI fails on k>1.2. Catches the 2.37 [derived] before ship; **ms alone would not have** — the two archives disagree 2.63× [derived] |
| P5 | Keystroke → paint | **≤50 ms p95** (RAIL task chunk) | Playwright trace + `PerformanceObserver` longtask | fail if any longtask >50 ms during a 200-keystroke script |
| P6 | Search, as-you-type prefix | **≤50 ms p95 at 10k notes** | headless bench vs frozen corpus | measured 12.64 ms @10k [measured]; **fails at 50k (130.90 ms)** → forces off-main-thread |
| P7 | Search, exact term | ≤5 ms p95 | same | measured 1.64 ms @50k [measured] — not the risk |
| P8 | Index build, cold, 10k notes | **≤8 s, off main thread** | Worker bench | measured 5,613 ms single-thread [measured] |
| P9 | Index heap | **≤10× corpus bytes** | `--expose-gc` heap delta | measured 9.25× @50k [measured] — at the line, no headroom |
| P10 | Cold start → first keystroke accepted | **≤1,500 ms p75** (RAIL 1,000 ms focus-loss + one network RTT) | Lighthouse + Playwright `page.type` timestamp | budget-check job; editor must accept input **before** the index exists |
| P11 | INP, field | **≤200 ms p75** [fetched] | web-vitals RUM beacon | dashboard alert, not a CI gate (field data cannot gate a PR) |
| P12 | JS bundle, editor route | ≤350 KB gzip | `next build` output | `npm run budget` — currently a stub printing "No bundle budget configured yet" [measured] |

**Recommendation:** gate on the **exponent** (P4) and on **refusal correctness** (P3), not on wall-clock. **Anti-recommendation:** wall-clock gates on shared CI runners are the classic flaky-red generator — a harness that reports false FAILs trains you to ignore it, which is the same disease as false PASSes. Only P1/P2/P6/P7 get ms thresholds, all with 2× headroom, all on a pinned runner class.

---

### 2. The scale ceiling to publish honestly

| Vault | Build (derived from 0.554 ms/doc) | Heap (20.7 KB/doc) | Prefix search | Published status |
|---|---|---|---|---|
| 1,000 | 0.55 s | 21 MB | 1.52 ms [measured] | **Supported** |
| 10,000 | 5.5 s | 207 MB | 12.64 ms [measured] | **Supported** |
| 50,000 | 27.7 s | 1.04 GB | 130.90 ms [measured] | **Degraded — named, not hidden** |
| 100,000 | ~55 s | ~2.07 GB | ~357 ms [derived] | **Refused in browser** |

- Publish: **"Tested to 10,000 notes. Functional and honest about it to 50,000. Above 50,000 the web client refuses and tells you why; the desktop build is the supported path."**
- Ceiling rationale is the heap, not the CPU: 2.07 GB against a 4,288 MB Node V8 limit [measured] leaves nothing for the document, CodeMirror, or React — and a browser renderer is stricter than Node.
- **Anti-recommendation:** do not publish a single "max notes" number. Obsidian's real failure at 10,500 files is a 280 ms *periodic stall* [fetched], not a hard limit — users hit unusability long before they hit refusal. Publish the stall behaviour, not the cap.
- **Anti-recommendation:** do not raise the ceiling by shrinking the index (dropping body text, stemming aggressively). That converts a stated limit into a silently worse product — the exact failure the engine's REFUSE doctrine exists to prevent.

---

### 3. Test strategy — proportions by CI wall-clock, not test count

| Layer | Wall-clock | Owns | Never owns |
|---|---|---|---|
| **L0 Property + differential** | **25%** | splice algebra, offset math, refusal totality, UTF-8 boundaries, line endings, degradation certificate | anything requiring a DOM |
| **L1 Unit (vitest)** | 15% (≈55% of test *count*) | pure functions, error enums, parser helpers | integration ordering, timing |
| **L2 Corpus / golden** | 20% | real foreign vaults — the 83% zero-indent-sequence and bare-CR classes the master plan queued; `npm run corpus` exists [measured] | synthetic inputs |
| **L3 Integration (jsdom + fake-indexeddb, both installed [measured])** | 15% | CodeMirror↔engine sync, repository, R2 persistence | rendering fidelity |
| **L4 E2E (Playwright)** | 20%, **≤20 specs** | the five data-loss flows only: open, edit-save, offline→reconnect, export, share-revoke | assertions a byte test can make |
| **L5 Visual** | 5% | KaTeX/Mermaid render regressions only | anything textual |

- Count is the wrong denominator: 79 files / 9,929 LOC [measured] tells you nothing about coverage of the byte contract.
- **Playwright vs Cypress** [fetched npm, 2026-08-29]: `@playwright/test` 1.62.1 at **57,911,488 weekly**; `cypress` 15.21.1 at **7,569,177 weekly** — **7.65× gap** [derived]. Cypress Cloud: Free = 500 test results; Team **$67/mo or $799/yr**; Business **$267/mo or $3,199/yr** [fetched cypress.io/pricing]. Playwright parallelism/sharding is in the free OSS runner. **Recommendation: Playwright.** **Anti-recommendation:** Playwright's advantage here is cost and CI shape, not authoring ergonomics — do not claim Cypress is worse at debugging; its time-travel UI is better and you are giving that up.
- **Visual regression:** Chromatic Free $0, paid tiers at **$179** and **$399** [fetched chromatic.com/pricing, 2026-08-29; **snapshot allowances did not parse — unverified**]. **Recommendation: 5% ceiling, KaTeX/Mermaid only.** **Anti-recommendation:** the flakiness reputation is earned — font hinting and GPU rasterization differ per runner; a visual suite over text-heavy markdown will produce diffs that are all noise, and you will disable it within a month. Do not visual-test prose.
- **Mutation testing:** `@stryker-mutator/core` **10.0.0, 2,320,443 weekly** [fetched]. **Recommendation: nightly, scoped to `src/modules/mdmax/domain/` only.** **Anti-recommendation:** whole-repo mutation on 9,929 LOC of tests is hours of runner time for a score, and the score is not a gate — it is a once-a-quarter reading. Do not put it on the PR path.
- **Contract testing:** the contracts here are (a) engine↔CodeMirror and (b) client↔Worker/R2. Both are in-process or single-team. **Recommendation: schema-validated fixtures, not Pact.** **Anti-recommendation:** consumer-driven contract testing pays off across *team* boundaries; a solo founder has none, so a broker is pure ceremony.

---

### 4. Property-based tests for the splice writer — the highest-value item

`fast-check` **4.9.0, 37,512,910 weekly downloads** [fetched npm, 2026-08-29]. Model [fetched fast-check.dev/docs/core-blocks/properties/]: *"for any (x,y,…) such that precondition(x,y,…) holds, predicate(x,y,…) is true"* — `fc.property(...arbitraries, predicate)`; preconditions via `fc.pre` or `.filter`; **the predicate must not mutate its inputs or shrinking degrades and the reported counterexample is wrong**; prefer constrained arbitraries over `.filter` because filtering generates-then-discards.

**Generate at the byte layer.** `fc.uint8Array()`, not `fc.string()` — a string arbitrary can never produce invalid UTF-8, a lone continuation byte, or a bare CR, and those are exactly the shipped defect classes. Derive ranges as `start = fc.nat(len)`, `end = start + fc.nat(len - start)` — never `fc.tuple(nat,nat).filter(([a,b])=>a<=b)`, per the perf note above.

| # | Property | Statement | Defect class it catches |
|---|---|---|---|
| **S1** | **Outside-range invariance** | `∀ D,s,e,p: out.subarray(0,s) ≡ D.subarray(0,s) ∧ out.subarray(s+p.length) ≡ D.subarray(e)` — byte-identical, `Buffer.compare === 0`, not string equality | **The leading-BOM bug (`f47555f`)**. String equality passes with a stripped BOM; byte comparison does not |
| **S2** | **Length algebra** | `out.length === D.length - (e-s) + p.length` | **OffsetMap off-by-3 (`cc1d451`)** — an off-by-N is a total, arithmetic falsehood and needs no oracle |
| **S3** | **Identity splice** | `∀ D,s,e: splice(D,s,e,D.subarray(s,e)) ≡ D` | The cheapest total oracle in the whole suite. Off-by-3 dies here on run ~4 |
| **S4** | **Exact inverse (undo)** | `splice(splice(D,s,e,p), s, s+p.length, D.subarray(s,e)) ≡ D` | Makes "deterministic reversible projection" a theorem rather than a slogan |
| **S5** | **Disjoint commutation** | for non-overlapping ranges, apply in either order with offsets shifted → identical bytes | Batch-edit offset drift; the multi-cursor class |
| **S6** | **Refusal totality** | `∀` input: result is `{ok:true, bytes}` **xor** `{ok:false, code ∈ closed enum}`. `ok:false ⟹ bytes === undefined`. No third state, ever | The "guessed instead of refusing" class the whole engine doctrine exists to prevent |
| **S7** | **Refusal determinism** | same input twice ⟹ same `code`. Assert across two calls in one predicate | A non-deterministic refusal is worse than a wrong one — it cannot be reported or reproduced |
| **S8** | **UTF-8 boundary refusal** | if `s` or `e` indexes a continuation byte (`0b10xxxxxx`), result **must** be `ok:false`, never valid-looking output | LR#68's truncation class, which has already bitten this workspace once and reproduced in only 0.34% of natural artifacts |
| **S9** | **Line-ending census** | count of `CRLF`, lone `LF`, lone `CR` **outside** `[s,e)` is unchanged | **Queued bare-CR set-destruction** from the master plan |
| **S10** | **No-op idempotence** | `splice(D,s,s,empty) ≡ D` for all `s`, **including 0 and D.length** | Boundary handling; empty-document handling |
| **S11** | **Projection commutes** | edit applied through a view ≡ equivalent splice applied to bytes | The product thesis, as an executable assertion |
| **S12** | **Fence isolation (model-based, `fc.commands`)** | a sequence of body splices never moves the `---` fence byte offsets, and vice versa | `gray-matter` boundary drift across an edit session |
| **S13** | **Metamorphic certificate stability** | for a splice certified non-degrading, cross-engine render of before/after differs **only** inside the spliced region | Regressions in the degradation certificate itself |

**Runner discipline (LR#63 applied):** PR runs a **pinned seed** and fixed `numRuns` — a property test with a random seed on the PR path is a coin-flip gate. Nightly runs random seeds with `numRuns` 100×. Every shrunk counterexample is promoted, by hand, into a deterministic unit fixture and never deleted.

**Anti-recommendation:** property tests will not find the defects that live in *interpretation* — "should a bare CR terminate a setext heading" is a spec question, and a property will happily confirm whichever answer you encoded. S1–S13 protect the byte contract; the corpus layer (L2) protects the semantics. **Anti-recommendation 2:** do not property-test the parser's *output shape*. mdast trees are large, shrinking on them is slow and produces unreadable counterexamples, and the assertions degenerate into a reimplementation of the parser.

---

### 5. CI design and its cost

**Rates** [fetched docs.github.com/en/billing/reference/actions-minute-multipliers, 2026-08-29]: Linux 1-core slim **$0.002/min**; Linux 2-core x64 **$0.006/min**; Linux 2-core arm64 **$0.005/min**; Windows 2-core **$0.010/min**; **macOS 3/4-core $0.062/min**; Linux 4/8/16-core $0.012/$0.022/$0.042. **Included** [fetched]: GitHub Free 2,000 min + 500 MB; Pro 3,000 min + 1 GB; Enterprise Cloud 50,000 min + 50 GB.

| Job | Trigger | Runner | Est. min | Notes |
|---|---|---|---|---|
| typecheck + lint + unit + property(pinned seed) + `arch` + `spec` | every push | Linux 2-core | 12 | duration **assumed, not measured** — no CI exists to measure [measured: `.github/workflows` absent] |
| corpus (foreign vaults) | every push | Linux 2-core | 3 | `npm run corpus` exists |
| Playwright, 3 shards | every push | Linux 2-core ×3 | 6 | |
| perf bench (P1/P2/P6/P7 + exponent P4) | every push | Linux 2-core, **pinned class** | 4 | exponent gate, 2× headroom on ms |
| property soak, random seed | nightly | Linux 2-core | 30 | |
| Stryker on `mdmax/domain` | nightly | Linux 2-core | 25 | report only, never a gate |
| Tauri macOS build | weekly + tag | **macOS** | 20 | the only expensive line |

**Arithmetic** [derived, on the stated assumptions]
- PR path = 12+3+6+4 = **25 min/push**. 40 pushes/mo = 1,000 min.
- Nightly = (30+25) × 30 = 1,650 min.
- Linux total = **2,650 min/mo**. Free allowance 2,000 → 650 billable × $0.006 = **$3.90/mo**.
- macOS: 20 min × $0.062 = $1.24/run × 4.33 runs/mo = **$5.37/mo**. macOS is **10.33× Linux per minute** [derived: 0.062/0.006] and is 58% of total CI spend on 1% of the minutes.
- **Total ≈ $9.27/mo** [derived]. Against Cypress Cloud Team at $67/mo [fetched] the tooling choice is a **7.2×** difference before a single test is written [derived].
- Under the 2,000-min free allowance without the nightlies: 2,000/25 = **80 pushes/mo free** [derived].

**Recommendation:** nightlies on Linux 2-core arm64 at $0.005/min [fetched] — 17% cheaper [derived: 1−0.005/0.006] and the engine is pure JS. **Anti-recommendation:** arm64 is a *different* runner class, so any ms-threshold job (perf bench) must stay pinned to one architecture or P1/P6 thresholds become meaningless across runs.

**Recommendation:** run the property soak nightly, not on PRs. **Anti-recommendation:** this means a property defect can merge and sit for up to 24 h — accept that explicitly, or move S1/S2/S3/S6 (the four cheap total oracles) onto the PR path at low `numRuns` and leave S4–S13 nightly.

---

### 6. Anti-recommendations

- **Do not publish "100,000 notes."** Derived heap is 2.07 GB [derived] against a 4,288 MB Node ceiling [measured] and a stricter browser one. The number is reachable in a benchmark and not in a product.
- **Do not gate on wall-clock alone.** The archived 36,865 ms and my 96,890.7 ms for byte-identical input disagree 2.63× [derived]. A ms gate calibrated on one machine is a false red or a false green on the other; the exponent is the invariant.
- **Do not add e2e coverage beyond the five data-loss flows.** Every spec past ~20 buys less than it costs in flake, and the byte contract is already covered at L0 where it is cheap and deterministic.
- **Do not run visual regression over prose.** Font rasterization noise will produce diffs on every run and you will turn the suite off — worse than never having it.
- **Do not put mutation testing on the PR path.** It is a quarterly reading, not a gate; 2,320,443 weekly downloads [fetched] reflect nightly use, not blocking use.
- **Do not adopt Pact/contract brokers.** Solo founder, no team boundary, no consumer to drive the contract.
- **Do not optimise `mdast-util-from-markdown` away as a blanket rule.** On realistic prose it is **0.96×** micromark [measured] — identical. Route by *shape* (the existing `shape-gate.ts` already does), not by library.
- **Do not treat the current 79 files / 9,929 LOC [measured] as a baseline to preserve.** None of it is property-based, none of it is e2e, and none of it runs in CI, because there is no CI. The correct first commit is a workflow file, not a test.
- **Do not claim any of the CI durations above are measured.** They are estimates; the arithmetic is shown so each can be replaced with a real number the day the first workflow runs.
- **Do not delete the counterexample corpus** that property runs produce. A shrunk failing input is the most expensive artifact the suite generates and the cheapest to lose.