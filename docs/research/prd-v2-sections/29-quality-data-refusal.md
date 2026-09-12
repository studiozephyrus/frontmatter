Read-only confirmed — this task issued only `wc` and `Read`; zero writes, zero commits, nothing touching `~/.claude` or `~/.sgnk`. The dirty AIOS state is pre-existing and not attributable to this run.

## 29. Performance budgets and the testing strategy

### 29.1 The performance budget

All measurements below were executed on 2026-08-29 on Node v24.6.0 / darwin 25.6.0 / arm64, V8 `heap_size_limit` 4,288 MB [measured]. Repo state at the time: 79 `*.test.ts` files, 9,929 LOC of tests, vitest 4.1.7 installed (4.1.11 current), `fast-check` absent, `.github/workflows` absent [measured].

| # | Operation | Budget | Measurement method | Enforcement |
|---|---|---|---|---|
| P1 | Byte splice, document ≤4 MB | ≤5 ms p99 | vitest bench, fixed corpus, 20 iterations | CI fails at p99 > 10 ms (2× headroom). Measured 4.73 ms end-to-end decode→splice→encode at 4 MB [measured] |
| P2 | UTF-8 decode + validate on open | ≤2 ms/MB | same | fail > 4 ms/MB. Measured 1.16 ms at 4 MB [measured] |
| P3 | Any single parse of a user document | ≤200 ms, else **refuse** | `shape-gate.ts` budget-ms | Refusal, not slowdown. Live constants: MAX_BYTES 4 MB, MAX_LINES 200,000, MAX_LIST_MARKER_LINES 20,000 [measured] |
| P4 | Any regex run over user bytes | growth exponent k ≤ 1.05 over 4 doublings | doubling harness; report the exponent, not the milliseconds | CI fails at k > 1.2 |
| P5 | Keystroke → paint | ≤50 ms p95 | Playwright trace + `PerformanceObserver` longtask | fail if any longtask > 50 ms across a 200-keystroke script |
| P6 | Search, as-you-type prefix | ≤50 ms p95 at 10,000 notes | headless bench against a frozen corpus | measured 12.64 ms at 10k; **fails at 50k (130.90 ms)** [measured] |
| P7 | Search, exact term | ≤5 ms p95 | same | measured 1.64 ms at 50k [measured] — not the risk |
| P8 | Cold index build, 10,000 notes | ≤8 s, off main thread | Worker bench | measured 5,613 ms single-threaded [measured] |
| P9 | Index heap | ≤10× corpus bytes | `--expose-gc` heap delta | measured 9.25× at 50k (1,036 MB / 112.0 MB) [derived] — at the line, no headroom |
| P10 | Cold start → first keystroke accepted | ≤1,500 ms p75 | Lighthouse + Playwright `page.type` timestamp | the editor must accept input *before* the index exists |
| P11 | INP, field data | ≤200 ms p75 [fetched, web.dev] | web-vitals RUM beacon | dashboard alert only — field data cannot gate a PR |
| P12 | JS bundle, editor route | ≤350 KB gzip | `next build` output | `npm run budget`, today a stub printing "No bundle budget configured yet" [measured] |

Thresholds anchor to RAIL: 100 ms response, 50 ms task chunk, 1,000 ms focus loss, 10,000 ms abandonment; frame budget 16.7 ms [derived: 1000/60] [fetched, web.dev]. INP is scored at the 75th percentile of field page loads, mobile and desktop segmented, discarding the single highest interaction per 50 [fetched].

**Gate on the exponent (P4) and on refusal correctness (P3), not on wall-clock.** Two independent runs of the identical `WIKILINK_RE` benchmark over the same 320 KB input disagree by 2.63× — the repo archive records 36,865 ms at k=1.98, this machine measured 96,890.7 ms at end-to-end exponent 2.37 [measured][derived: 96890.7/36865]. Both stand; neither is corrected; the exponent is the invariant and the milliseconds are the machine. Anti-recommendation: a wall-clock gate on a shared runner is the classic flaky-red generator, so only P1/P2/P6/P7 carry ms thresholds, each with 2× headroom, each pinned to one runner class.

**Published scale ceiling.** MiniSearch 7.2.0, synthetic 400-word notes [measured; extrapolations derived from 0.554 ms/doc and 20.7 KB/doc]:

| Vault | Build | Heap | Prefix search | Published status |
|---|---|---|---|---|
| 1,000 | 0.55 s | 21 MB | 1.52 ms [measured] | Supported |
| 10,000 | 5.5 s | 207 MB | 12.64 ms [measured] | Supported |
| 50,000 | 27.7 s | 1.04 GB | 130.90 ms [measured] | Degraded — named, not hidden |
| 100,000 | ~55 s | ~2.07 GB | ~357 ms [derived: 130.90 × 2^1.45] | Refused in the browser |

- Publish this sentence verbatim: "Tested to 10,000 notes. Functional and honest about it to 50,000. Above 50,000 the web client refuses and tells you why; the desktop build is the supported path."
- The ceiling is set by heap, not CPU: 2.07 GB against a 4,288 MB V8 limit leaves nothing for the document, CodeMirror or React, and a browser renderer is stricter than Node [measured][inference].
- Anti-recommendation: do not publish a single "max notes" number. Obsidian 1.13.7 in restricted mode with zero community plugins and ~10,500 files reports a ~280 ms renderer stall every ~2 s while typing, attributed to `getAllPropertyInfos()` [fetched, forum.obsidian.md]. Users hit unusability long before they hit a cap; publish the stall behaviour.
- Anti-recommendation: do not buy headroom by shrinking the index (dropping body text, aggressive stemming). That converts a stated limit into a silently worse product, which is the exact failure the REFUSE doctrine exists to prevent.
- Route parsers by input *shape*, not by library name. On a 100 KB realistic note `mdast-util-from-markdown` 2.0.3 is 0.96× `micromark` 4.0.2 — identical; on 32,000 flat bullets (404.9 KB) it is 29.36× slower, exponent 4.00 in the 16k→32k band [measured][derived]. Recorded and not explained: micromark itself goes flat across that band (794.6 → 801.3 ms), which is not credible as linearity and is probably a JIT/GC artifact — do not cite micromark as linear.
- The splice thesis, quantified: 4.73 ms to decode, splice and re-encode 4 MB versus 23,527 ms to reparse a 405 KB pathological list is **4,974×** [derived]. The architecture argument is four orders of magnitude, not an aesthetic.

### 29.2 The test strategy and its pyramid

Proportions are stated as shares of CI wall-clock, not as test counts; 79 files and 9,929 LOC [measured] say nothing about coverage of the byte contract.

| Layer | Wall-clock | Owns | Never owns |
|---|---|---|---|
| L0 Property + differential | 25% | splice algebra, offset arithmetic, refusal totality, UTF-8 boundaries, line endings, degradation certificate | anything requiring a DOM |
| L1 Unit (vitest) | 15% (≈55% of test *count*) | pure functions, error enums, parser helpers | integration ordering, timing |
| L2 Corpus / golden | 20% | real foreign vaults — the zero-indent-sequence and bare-CR classes; `npm run corpus` exists [measured] | synthetic inputs |
| L3 Integration (jsdom + fake-indexeddb, both installed [measured]) | 15% | CodeMirror↔engine sync, repository, R2 persistence | rendering fidelity |
| L4 E2E (Playwright), ≤20 specs | 20% | five data-loss flows only: open, edit-save, offline→reconnect, export, share-revoke | assertions a byte test can make |
| L5 Visual | 5% | KaTeX and Mermaid render regressions only | anything textual |

| Decision | Choice | Evidence | Anti-recommendation |
|---|---|---|---|
| E2E runner | Playwright | `@playwright/test` 1.62.1 at 57,911,488 weekly vs `cypress` 15.21.1 at 7,569,177 — 7.65× [fetched npm, derived]. Cypress Cloud: Free 500 test results, Team $67/mo or $799/yr, Business $267/mo or $3,199/yr [fetched cypress.io/pricing]; Playwright sharding is in the free OSS runner | The advantage is cost and CI shape, not authoring ergonomics. Cypress's time-travel debugger is better and we are giving it up |
| Visual regression | 5% ceiling, KaTeX/Mermaid only | Chromatic Free $0, paid tiers $179 and $399 [fetched chromatic.com/pricing; snapshot allowances did not parse — unverified] | Never visual-test prose. Font hinting and GPU rasterization differ per runner; a text-heavy diff suite is all noise and gets switched off inside a month |
| Mutation testing | `@stryker-mutator/core` 10.0.0, nightly, scoped to `src/modules/mdmax/domain/` | 2,320,443 weekly [fetched npm] | Never on the PR path. Whole-repo mutation over 9,929 LOC is hours of runner time for a quarterly reading, and the score is not a gate |
| Contract testing | Schema-validated fixtures | Both contracts (engine↔CodeMirror, client↔Worker/R2) are in-process or single-team | Do not adopt Pact or a broker. Consumer-driven contracts pay across *team* boundaries; a solo founder has none |

CI shape and cost, at published GitHub rates [fetched docs.github.com/en/billing/reference/actions-minute-multipliers, 2026-08-29]: Linux 1-core slim $0.002/min, Linux 2-core x64 $0.006, Linux 2-core arm64 $0.005, Windows 2-core $0.010, macOS 3/4-core $0.062; included allowances GitHub Free 2,000 min + 500 MB, Pro 3,000 min + 1 GB.

| Job | Trigger | Runner | Est. min |
|---|---|---|---|
| typecheck + lint + unit + property (pinned seed) + `arch` + `spec` | every push | Linux 2-core | 12 |
| corpus (foreign vaults) | every push | Linux 2-core | 3 |
| Playwright, 3 shards | every push | Linux 2-core ×3 | 6 |
| perf bench (P1/P2/P6/P7 + exponent P4) | every push | Linux 2-core, pinned class | 4 |
| property soak, random seed | nightly | Linux 2-core arm64 | 30 |
| Stryker on `mdmax/domain` | nightly | Linux 2-core arm64 | 25 |
| Tauri macOS build | weekly + tag | macOS | 20 |

- PR path 12+3+6+4 = 25 min/push; 40 pushes/mo = 1,000 min. Nightlies (30+25) × 30 = 1,650 min. Linux total 2,650 min/mo; 650 billable over the 2,000 free allowance × $0.006 = **$3.90/mo**. macOS 20 min × $0.062 × 4.33 runs/mo = **$5.37/mo**. Total ≈ **$9.27/mo** [derived]. macOS is 10.33× Linux per minute and is 58% of spend on 1% of the minutes [derived: 0.062/0.006].
- Under the free allowance with nightlies removed: 2,000/25 = 80 pushes/mo at zero cost [derived].
- Every CI duration above is an estimate, not a measurement — there is no workflow file to measure [measured]. The arithmetic is shown so each row can be replaced with a real number on the day the first workflow runs.
- Anti-recommendation to arm64 nightlies (17% cheaper [derived: 1−0.005/0.006]): arm64 is a different runner class, so any ms-threshold job must stay pinned to one architecture or P1/P6 stop meaning anything across runs.
- The correct first commit in this area is a workflow file, not a test. None of the existing 9,929 LOC is property-based, none is E2E, and none runs in CI, because there is no CI [measured].

### 29.3 Property-based testing for a byte-preserving writer

`fast-check` 4.9.0, 37,512,910 weekly downloads [fetched npm, 2026-08-29]. Model: "for any (x,y,…) such that precondition(x,y,…) holds, predicate(x,y,…) is true" [fetched fast-check.dev]. Two authoring rules from that documentation are binding here: the predicate must not mutate its inputs or shrinking degrades and the reported counterexample is wrong; and constrained arbitraries beat `.filter`, which generates-then-discards.

**Generate at the byte layer — `fc.uint8Array()`, never `fc.string()`.** A string arbitrary cannot produce invalid UTF-8, a lone continuation byte, or a bare CR, and those are precisely the classes that have already shipped as defects. Derive ranges as `start = fc.nat(len)` then `end = start + fc.nat(len - start)`; never `fc.tuple(nat, nat).filter(([a,b]) => a <= b)`.

| # | Property | Statement | Defect it would have caught |
|---|---|---|---|
| S1 | Outside-range invariance | `out.subarray(0,s) ≡ D.subarray(0,s)` and `out.subarray(s + p.length) ≡ D.subarray(e)`, compared with `Buffer.compare(...) === 0`, never string equality | The leading-BOM bug fixed in `f47555f`. String equality passes with a stripped BOM; byte comparison does not |
| S2 | Length algebra | `out.length === D.length − (e − s) + p.length` | The OffsetMap off-by-3 fixed in `cc1d451`. An off-by-N is a total arithmetic falsehood and needs no oracle |
| S3 | Identity splice | `splice(D, s, e, D.subarray(s,e)) ≡ D` | The cheapest total oracle in the suite; the off-by-3 dies here around run 4 |
| S4 | Exact inverse (undo) | `splice(splice(D,s,e,p), s, s + p.length, D.subarray(s,e)) ≡ D` | Makes "deterministic, reversible projection" a theorem rather than a slogan |
| S5 | Disjoint commutation | for non-overlapping ranges, applying in either order with offsets shifted yields identical bytes | Batch-edit offset drift; the multi-cursor class |
| S6 | Refusal totality | every input yields `{ok:true, bytes}` **xor** `{ok:false, code ∈ closed enum}`; `ok:false ⟹ bytes === undefined`. No third state | The "guessed instead of refusing" class the whole doctrine exists to prevent |
| S7 | Refusal determinism | the same input twice yields the same `code`, asserted across two calls inside one predicate | A non-deterministic refusal cannot be reported or reproduced, which is worse than a wrong one |
| S8 | UTF-8 boundary refusal | if `s` or `e` indexes a continuation byte (`0b10xxxxxx`), the result must be `ok:false`, never valid-looking output | The multi-byte truncation class, which reproduces in ~0.34% of natural artifacts and therefore never surfaces in a sampled corpus |
| S9 | Line-ending census | counts of CRLF, lone LF and lone CR **outside** `[s,e)` are unchanged | The queued bare-CR set-destruction class |
| S10 | No-op idempotence | `splice(D, s, s, empty) ≡ D` for all `s`, including 0 and `D.length` | Boundary and empty-document handling |
| S11 | Projection commutes | an edit applied through a view equals the equivalent splice applied to bytes | The Projection Law, as an executable assertion |
| S12 | Fence isolation (model-based, `fc.commands`) | a sequence of body splices never moves the `---` fence byte offsets, and the converse | Frontmatter boundary drift across an editing session |
| S13 | Metamorphic certificate stability | for a splice certified non-degrading, the cross-engine render of before and after differs only inside the spliced region | Regressions in the degradation certificate itself |

- Runner discipline: the PR path runs a **pinned seed** and a fixed `numRuns`; a random-seeded property test on a PR is a coin-flip gate. Nightly runs random seeds at 100× `numRuns`. S1, S2, S3 and S6 — the four cheap total oracles — run on the PR path at low `numRuns`; S4–S13 run nightly. The explicit cost: a property defect in S4–S13 can merge and sit for up to 24 hours.
- Every shrunk counterexample is promoted by hand into a deterministic unit fixture and never deleted. A shrunk failing input is the most expensive artifact the suite produces and the cheapest to lose.
- Anti-recommendation: properties will not find defects that live in *interpretation*. "Should a bare CR terminate a setext heading" is a spec question, and a property will happily confirm whichever answer was encoded. S1–S13 protect the byte contract; layer L2 protects the semantics.
- Anti-recommendation: do not property-test the parser's output shape. mdast trees are large, shrinking over them is slow, counterexamples are unreadable, and the assertions degenerate into a second implementation of the parser.

## 30. Data model, schemas and migration

### 30.1 Everything that needs a version

Live state: exactly one file in the repo carries `$schema` — `specs/_schema/spec.schema.json`, which requires `spec: { const: 1 }` and sets `additionalProperties: false` [measured, 2026-08-29]. Existing in-code carriers: `Certificate.schema: 'mdmax/cert@1'` (`cert-contract.ts:132`), `Certificate.fold: { version }` (`:137`), `FOLD_VERSION = 'mdmax/fold@1'` (`fold.ts:45`, with the comment at `fold.ts:40` stating that changing any rule requires bumping it because the certificate quotes it), and per-engine `version`/`sha` in `bench.engines[]` (`cert-contract.ts:81,83`) [measured].

| # | Artifact | Bytes held by | Version carrier | Placement | May we rewrite it? |
|---|---|---|---|---|---|
| 1 | Document frontmatter (user's own keys) | user file | none of ours | — | never unattended |
| 2 | User-defined frontmatter schema | user file (`.frontmatter/schema.yml`) | `fm_schema: 1` + `$schema` URI | first key, in-band | explicit action only |
| 3 | Render profile definition | user file or R2 | `profile: 1` + `$schema` URI | first key | explicit action only |
| 4 | Degradation certificate sidecar | sidecar / R2 | `schema: "mdmax/cert@1"` [measured — exists] | first key | regenerate, never edit |
| 5 | Fold ruleset | engine constant | `mdmax/fold@1` [measured — exists] | code, quoted into the cert | N/A |
| 6 | Splice refusal vocabulary | engine; surfaced in cert + UI | `refusals@N` — **missing today** | code + cert | N/A |
| 7 | Session interchange format | exported file, published spec | `$schema` URI + `session: N` | first key | never — it is an artifact |
| 8 | Saved searches / views | server row + optional export | column `v` int; export `saved_view: 1` | row + first key | yes, we hold it |
| 9 | Server-side object metadata | R2 custom metadata, DB | `x-fm-schema: fm/objmeta@1` | HTTP metadata | yes, we hold it |
| 10 | Workspace config | user file | `workspace: 1` | first key | explicit action only |
| 11 | Engine/target registry (bench) | repo + cert copy | per-engine `version`/`sha` [measured — exists] | embedded in cert | N/A |
| 12 | Export artifacts (HTML/PDF/print) | user's disk | generator stamp in comment/XMP | header | no — immutable output |
| 13 | Local index/cache (Tauri) | user's disk, derived | `cache: N`, rebuild on mismatch | sidecar DB pragma | yes — it is derived |
| 14 | AI tool-call schemas | wire | API version, not file version | request header | N/A |

- Placement follows three tiers [inference, modelled on Avro]: (a) in-band, first key, self-describing for anything a user holds — Avro's rule is that "the original schema must be provided along with the data" [fetched, avro.apache.org 1.12.0, Schema Resolution], and we cannot ship a registry to an offline laptop; (b) sidecar header for derived artifacts we generate beside a document; (c) transport metadata for objects we hold.
- **Absence rule, written down once and never re-interpreted: a missing version key means v1, permanently.** JSON Schema 2020-12 states that when `$schema` is "absent from the document root schema, the resulting behavior is implementation-defined" [fetched, json-schema.org draft/2020-12 core §8.1.1] — implementation-defined is exactly the hole, so we define it.
- Anti-recommendation: never infer a version by sniffing which keys are present. Key-shape sniffing makes every future additive change retroactively alter the parse of old files.
- Source disagreement, recorded: JSON Schema permits unversioned documents and leaves the behaviour open; Avro requires the writer's schema to accompany the data at all times [fetched both]. The specs disagree on whether unversioned data is admissible at all; we side with Avro for user-held files and with JSON Schema's leniency for reading foreign ones.

### 30.2 The compatibility contract

Anchors: semver — MAJOR for incompatible changes, MINOR for backward-compatible additions, PATCH for backward-compatible fixes, and "Major version zero (0.y.z) is for initial development. Anything MAY change" [fetched semver.org]. Confluent — BACKWARD (the default), FORWARD, FULL and their TRANSITIVE variants; BACKWARD checks only the previous version, BACKWARD_TRANSITIVE checks all [fetched docs.confluent.io].

| Rule | Statement | Anchor |
|---|---|---|
| C1 | Every artifact declares **BACKWARD_TRANSITIVE**, not BACKWARD. A user opens a 2021 file, not last quarter's file | [fetched] Confluent: BACKWARD "ensures that consumers using the new schema X can process data written by producers using schema X or X-1, but not necessarily X-2" |
| C2 | User-held artifacts additionally promise FORWARD for one MAJOR: an older build opens a newer file readably, degrading unknown keys, never erroring | [inference] The user's other machine is on the old build; we do not control rollout |
| C3 | Unknown keys are preserved verbatim on write, never dropped | [fetched] Avro ignores unknown writer fields; we must go further and round-trip them, because our file is the source of truth, not a wire frame |
| C4 | A new **required** field is a MAJOR change. New fields are optional or carry a reader-side default | [fetched] Avro signals an error for a reader field absent in the writer with no default; protobuf.dev: "Required fields are considered harmful by so many they were removed from proto3 completely" |
| C5 | Never re-use a key name for a different meaning. Retire names into a reserved list | [fetched] protobuf.dev: "Never re-use a tag number… You can also reserve names to avoid recycling now-deleted field names" |
| C6 | Never change a key's type in place. Add a new key, dual-read, retire the old | [fetched] protobuf.dev: "changing a field's type can be difficult to roll out safely even when the new schema can successfully parse old data" |
| C7 | New enum members (verdict classes, refusal reasons, profile modes) require a reader-side default. An unknown member is never a crash | [fetched] Avro symbol-resolution rule; protobuf.dev: "Do Include an Unspecified Value in an Enum" |
| C8 | Documentation and annotation fields never participate in compatibility checks | [fetched] Avro: "A schema's `doc` fields are ignored for the purposes of schema resolution" |
| C9 | Two axes, never conflated: format version (monotonic integer, in-band) and product version (semver, in the changelog). A file says `session: 2`; the app says `1.7.3` | [inference] semver's "0.y.z anything MAY change" is a statement about APIs, not about bytes on someone else's disk |
| C10 | Any schema we publish pins its dialect: `$schema` is a normalized URI with a scheme, at the document root | [fetched] json-schema.org 2020-12 core §8.1.1 |
| C11 | `additionalProperties: false` is banned in user-facing schemas | [measured] correct in `specs/_schema/spec.schema.json` because it is internal; fatal in a user file, because a closed schema makes an old build reject a new file instead of degrading it, breaking C2 |
| C12 | Anything the certificate quotes (`fold.version`, engine `version`/`sha`) is part of the compatibility surface. Bumping it invalidates prior certificates rather than re-labelling them | [measured] `fold.ts:40`; [fetched] protobuf.dev: "Never Rely on Serialization Stability Across Builds" |

- Anti-recommendation to C2: do not promise forward compatibility forever. One MAJOR, then a "this file was written by a newer version, please update" refusal. A refusal is honest; silently dropping keys the old build did not understand is the failure C3 exists to prevent.
- Anti-recommendation: do not use semver on file formats. MINOR permits additions an old reader cannot see, which is exactly the wrong promise for bytes on disk.
- Source disagreement, recorded: Confluent ships BACKWARD as its default while the same page recommends BACKWARD_TRANSITIVE for Protobuf "as adding new message types is not forward compatible" [fetched, same document]. We take the transitive line.

### 30.3 Migrating data we do not hold

Confluent's registry, GitLab's post-deployment migrations and Avro's writer-schema-with-data all assume the migrator can reach the bytes. We cannot: a Tauri user's vault on an offline laptop is unreachable, permanently [inference]. **No user-held format may ever require a migration to remain readable; migration is optional cleanup, never a precondition for correctness.**

**Read-old-write-new**, stated as three phases [fetched martinfowler.com/bliki/ParallelChange.html, Danilo Sato, 13 May 2014 — "expand, migrate, and contract"]:

| Phase | Behaviour |
|---|---|
| Expand | The reader accepts old and new. The writer still emits **old**. Ship, wait |
| Migrate | The writer emits **new** only for files the user's own edit already dirties. Never a sweep |
| Contract | The reader drops old support only after the deprecation clock expires — and "Ignoring and dropping columns should not occur simultaneously in the same release" [fetched docs.gitlab.com] |

**The touch budget.** When a user edits a document we already rewrite the byte range they touched; a frontmatter migration may ride along **only if it sits inside a range that edit dirties anyway**, and may never widen the dirty range. The consequence is deliberate: migration converges asymptotically over months of ordinary editing, and never produces an mtime change the user did not cause.

**When we may rewrite a user file — four gates, conjunctively. All four, or we do not write.**

| Gate | Requirement |
|---|---|
| G1 Consent | The user pressed a button whose label names the change. Precedent: Obsidian's Format converter is a core plugin, opt-in, whole-vault, and warns "Back up your Obsidian files before you perform the conversion" [fetched help.obsidian.md] |
| G2 Preview | A byte diff is shown, per file, before anything is written. Anti-recommendation: never a bare count ("412 files will be updated") without the diff for at least the first file |
| G3 Reversibility | An undo artifact — original bytes, hashed, recoverable — exists before the first write |
| G4 Refusal on ambiguity | If the old form cannot be mapped deterministically the file is **skipped and reported**, not guessed. This is the splice contract applied to migration |

The certificate constrains migration mechanically, not just by policy: `Certificate.file: { path, sha256, bytes }` [measured `cert-contract.ts:138`] makes any byte change a cert-invalidating event, and `CertBlock.byteRange: [number, number]` [measured `:118`] means a frontmatter change that alters block length shifts every downstream offset — re-derive certificates, never arithmetic-shift a stored one. A migration that cannot be expressed as a splice is a migration we are not allowed to run.

- Anti-recommendation, and the most tempting shortcut available: do not add a "normalize on save" mode that reserializes frontmatter through a YAML round-trip. It would break every certificate in the corpus at once, reorder keys and destroy comments — and it makes every migration trivial to implement, which is why it will keep being proposed.
- Anti-recommendation: do not auto-migrate on open. It changes mtimes the user did not cause, triggers their sync client, and invalidates certificates invisibly.
- Anti-recommendation: do not rename an identity field. Astro's `slug` → `id` rename in the v5 Content Collections change needed a `legacy.collections` escape flag rather than a converter [fetched docs.astro.build/en/guides/upgrade-to/v5/]. Identity renames are not migratable; they are forks. The legacy tier's own wording is the model for the un-migratable: features "no longer recommended and… in maintenance mode… will eventually be deprecated, and then removed entirely" [fetched].

**Deprecation ladder.** Both gates are mandatory, version and date — GitLab encodes exactly this pair as `ignore_column :updated_at, remove_with: '12.7', remove_after: '2019-12-22'` [fetched docs.gitlab.com].

| Stage | Gate | Minimum duration |
|---|---|---|
| D0 Announce | Changelog + in-app notice naming the key and its replacement. **The converter ships here** | — |
| D1 Dual-read | Reader accepts both; writer emits old; old form documented as deprecated | ≥1 MINOR |
| D2 Dual-write | Writer emits new on touched files only; reader still accepts both | ≥2 MINOR |
| D3 Warn | Opening a file with the old form shows a one-line dismissible notice with a "convert this file" action | ≥1 MINOR |
| D4 Remove | Reader stops accepting. Requires a MAJOR **and** an elapsed-date gate | MAJOR only |

- Minimum wall-clock window for anything user-held: **18 months**. The observed comparable is 22.0 months — Obsidian's deprecated-properties help section was created 2023-08-04 and the 1.9.2-era docs commit is dated 2025-06-05, a span of 671 days [derived: 671 ÷ 30.44]. That figure bounds announce→docs-updated, **not** announce→removal: the exact 1.9.0 release date could not be fetched because obsidian.md/changelog returned HTTP 404 on both RSS and sitemap on 2026-08-29 [measured]. Treat 22.0 months as unverified for the interval it is often quoted as.
- Ship the converter at deprecation, not at removal. Obsidian deprecated `tag`, `alias` and `cssclass` in 1.4, dropped support in 1.9, and shipped the automated converter "As of Obsidian 1.9.3" [fetched] — the same line that removed support, which makes the warning window unactionable.
- Anti-recommendation: do not run a fixed removal calendar. A calendar forces removals with no user benefit and manufactures MAJOR bumps with nothing in them. Removal is event-driven: the old form's measured share of live files must fall below a stated threshold **and** the clock must have expired.
- Source disagreement, recorded: GitLab mandates a fixed three-release ladder with both gates; Astro's legacy path is open-ended with no stated clock [fetched both].
- Migration needs the same closed refusal vocabulary the engine already has — `MIGRATE_REFUSED_AMBIGUOUS`, `MIGRATE_REFUSED_UNKNOWN_VERSION` — versioned as `refusals@N`, which does not exist today [measured].

## 40. Error and refusal experience

Live baseline, measured at commit `9e84628` [measured]: `spliceFrontmatterValue(src, key, value): string` and `spliceFrontmatterKey(src, oldKey, newKey): string` both return a bare string, across **20 `return src` sites**. A refusal is therefore byte-identical to a successful no-op — no reason code, no discriminated union, nothing a UI can read. `PropertiesPanel.tsx`'s `emit()` is `if (!onEdit || next === content) return;`, so refusals are dropped, and the current mitigation is a duplicated `SAFE_KEY` check in the UI: two definitions of one rule. By contrast `mdmax` already emits 32 distinct uppercase symbols, of which 13 are verdict classes, leaving **19 typed failure codes** [derived: 32 − 13 = 19]. **The founding principle is implemented in one half of the product and not the other, so the work here is not nicer copy — it is giving splice the return shape mdmax already has.**

**The message template. Four obligatory slots, fixed order.** Adapted from Postgres Primary/Detail/Hint [fetched postgresql.org/docs/current/error-style-guide.html, PG 18] and RFC 9457's `type`/`title`/`detail`/`instance` [fetched rfc-editor.org/rfc/rfc9457.txt], plus one slot no external source has because no external source has our guarantee.

| Slot | Content | Budget |
|---|---|---|
| 1. OUTCOME | "Nothing changed." — the guarantee, stated first | ≤20 chars |
| 2. OBJECT + CAUSE | the exact key, line or byte range, and why it was unaddressable | ≤120 chars |
| 3. AFFORDANCE | one imperative the user can perform right now | ≤90 chars |
| 4. DISCLOSURE | `Why?` expander: reason code, byte offsets, the bytes left untouched, `Copy diagnostic` | unbounded, collapsed |

- **Visible budget: 280 characters total, headline ≤80.** Derivation: git's full checkout refusal is 175 chars over 4 lines; the Postgres primary+detail+hint exemplar is 256 chars over 3 lines; mean 215.5, ceiling set above both. rustc's primary line is 74 chars, so 80 holds a real headline [measured][derived][fetched].
- Machine shape: `{ ok: false, reason: 'UNSAFE_KEY', at: { line, col, byteStart, byteEnd }, detail, hint }` — mirrors mdmax's existing discriminated union and RFC 9457's triple. `reason` is the stable identity; the prose is localisable and may change. RFC 9457: consumers "SHOULD NOT parse the `detail` member" [fetched].
- Anti-recommendation: never put the reason code in the visible headline. NN/g: "Hide or minimize the use of obscure error codes… show them for technical diagnostic purposes only" [fetched nngroup.com/articles/error-message-guidelines, 2023-05-14]. The code lives in the disclosure and the clipboard.
- Anti-recommendation: never exceed 280 by stacking a second hint. Postgres hints exist because a suggestion "might not always be applicable"; a second hint is a guess, and guessing is the thing the engine refuses to do [fetched].
- Tone divergence, deliberate and written down rather than drifted into: Postgres and rustc both mandate lowercase primaries with no terminal period [fetched both]. frontmatter is a consumer editor, not a CLI, so it uses sentence case with periods.
- Prioritise by frequency once telemetry exists. Programming-error-message frequencies "empirically resemble Zipf–Mandelbrot distributions" [fetched arXiv 1509.07238, 2015-09-24], but that result is measured on novice Python and Java corpora, not markdown editors — ship all eleven at template quality and promote by observed counts, do not pre-guess the head.

**The taxonomy — every refusal the product can emit.** Codes marked ✅ exist in the tree today; ⭕ must be added [measured].

| # | Refusal | Code | Exact visible wording | Chars | Recovery affordance |
|---|---|---|---|---|---|
| 1 | Splice cannot locate the byte range | ⭕ `UNLOCATABLE` | "Nothing changed. The engine could not find a single unambiguous place for `public_slug` in this file's front matter, so it left every byte where it was." | 152 | `Show me` — scrolls to and selects the front-matter block |
| 2 | Ambiguous or duplicate target | ✅ `REFUSED_AMBIGUOUS` | "Nothing changed. `author` appears twice here, so this edit had two possible targets. Delete one, then try again." | 111 | `Show both` — two carets in the editor |
| 3 | YAML will not parse | ⭕ `FRONTMATTER_UNPARSEABLE` | "Nothing changed. The front matter stops being readable at line 7, so properties are read-only until that line is fixed. Your text is untouched." | 143 | `Jump to line 7`; the panel goes read-only, never blank |
| 4 | Unsupported key shape | ⭕ `UNSAFE_KEY` | "Not added. `título` uses characters this editor cannot address safely. Names can use letters A–Z, digits, and `. _ $ -`." | 121 | The field **stays open with the typed text intact** |
| 5 | Corpus drift, targets stale | ✅ `stale` → ⭕ `CORPUS_DRIFT` | "This certificate was measured against an older version of this note. It is shown greyed out until you re-run it." | 112 | `Re-certify`, one click |
| 6 | Certificate BROKEN | ✅ `BROKEN` | "Certified BROKEN: 3 of 24 engines lose content from this note. The note itself is unchanged and safe." | 101 | `See the 3` — per-engine verdict rows |
| 7 | Shape gate / budget exceeded | ✅ `BUDGET_BYTES`, `BUDGET_LINES`, `BUDGET_BLOCKS`, `BUDGET_TIME` | "Not certified. This note is 4.2 MB, past the limit for a run that must finish. Nothing was written." | 100 | `Certify the first section instead` |
| 8 | Engine missing or threw | ✅ `ENGINE_MISSING` / `ENGINE_THREW` | "marked 16.4.2 could not be loaded, so it is reported as unmeasured rather than as passing." | 90 | `Retry` and `Exclude this engine` |
| 9 | Publish revoked | ⭕ `SHARE_REVOKED` | "This link no longer works. The note was unpublished on 12 Aug, and the copy on the server was deleted." | 102 | Owner: `Publish again`. Visitor: **nothing** — no owner, no title, no path |
| 10 | AI declined | ⭕ `AI_DECLINED` | "The assistant didn't produce an edit here. Your document is unchanged." | 70 | `Try a different instruction`; the diff pane stays empty rather than showing a partial |
| 11 | Offset invalid (internal) | ✅ `PAST_END`, `INSIDE_SURROGATE_PAIR`, `NOT_AN_INTEGER`, `NEGATIVE`, `OFFSET_OUT_OF_RANGE` | never user-visible | — | logged with byte offset; surfaces to the user as #1 |

- #7's copy must quote the live constant, not a hardcoded number. The shape gate ships MAX_BYTES 4 MB [measured §29.1] while the drafted string named a 2 MB limit — the two research inputs disagree, and the fix is to interpolate the constant so the message cannot drift from the gate.
- #9 deliberately returns 404 rather than 403; RFC 9110 §15.5.1/4/21 permits hiding existence behind 404 [fetched], and naming the owner or former title of a revoked note leaks exactly what unpublishing was for.
- #10 follows the OpenAI Model Spec's "refuse neutrally and succinctly" [fetched model-spec.openai.com/2025-04-11] — no "unfortunately", no meta-commentary. Anti-recommendation: copy the Model Spec's brevity but not its opacity. A safety refusal withholds its reason on purpose; an engine refusal that withholds its reason is a bug with better manners.

**Presentation, without breaking the simple surface.**

| Rung | Applies to | Behaviour |
|---|---|---|
| 1. Inline, non-modal | #2, #4 — refusals the user caused and can undo by retyping | the row stays in edit state, anchored to the property that failed |
| 2. Persistent strip on the affected panel | #3 (read-only properties), #5 (greyed certificate) | refusals that change what the surface can do |
| 3. Nothing at all | #11, and any refusal already visible as "the thing you asked for did not happen" | internal codes never reach the user |
| Modal | never | a modal is for irreversible loss; a refusal is the proof that nothing was lost |

- Anchor at the source. NN/g: "Display the error message close to the error's source… proximity helps users associate the error message content with the interface elements needing attention" [fetched].
- Two tiers of disclosure, never three, and never across a navigation. Tier 1 is the 280-char sentence; tier 2 is the `Why?` expander. Nielsen distinguishes progressive from *staged* disclosure [fetched nngroup.com/articles/progressive-disclosure, 2006-12-03]; a refusal must be fully explainable without leaving the document.
- The one exception to "modal: never" is a refusal during an operation the user believes completed and has left the app — a background publish. That needs a durable surface, not a transient one.
- Show "0 bytes changed" as the visible artifact of the guarantee. Anti-recommendation: do not badge it. A celebration on every refusal becomes chrome, and NN/g reserves novelty for rare total failure.
- Icons are Google Material Symbols delivered as inline SVG only — `block`, `warning`, `help`. Never emoji, never the Google Fonts ligature span.
- Every refusal is silenceable once understood. git ships 43 `advice.*` toggles plus `GIT_ADVICE=0` for tooling [fetched, measured]; the toggle is part of the design, not an afterthought.

**Anti-patterns, each with the evidence that makes it one.**

| Anti-pattern | Why it reads as a bug |
|---|---|
| Silent no-op — return the input, say nothing | NN/g: "The very worst error messages are those that don't exist" [fetched]. This is our current splice behaviour at 20 sites [measured] |
| Refusal with no named escape | `fatal: refusing to merge unrelated histories` is 44 chars and never names `--allow-unrelated-histories` [fetched git `builtin/merge.c:1644`, measured]. Its sibling — the checkout refusal that ends "Please commit your changes or stash them before you switch branches." — differs on nothing else and is cited as helpful |
| Most-relevant-last | TypeScript #29759 puts "Did you mean to write 'environment'?" after five nesting levels and a 178-char reconstructed type; open since 2019-02-05 with 29 upvotes, in a label carrying 146 issues [fetched, measured] |
| Implementation nouns in the headline | Postgres: `pg_strtoint32: error in "z"` became `invalid input syntax for type integer: "z"` [fetched]. Never surface `spliceFrontmatterValue` or `SAFE_KEY` in tier 1 |
| Blame vocabulary | NN/g bans `invalid`, `illegal`, `incorrect`; rustc says "The word 'illegal' is illegal. Prefer 'invalid'." The two sources **disagree on `invalid` itself** — take NN/g's stricter line for user-facing copy and rustc's for internal codes [fetched both] |
| Duplicated rule in UI and engine | Two `SAFE_KEY` checks is two places to drift. The engine returns the reason; the UI renders it |
| Auto-repair on refusal | ESLint separates *fixes* (safe, auto-applied) from *suggestions*, which "may change application logic and so cannot be automatically applied" and are not exposed via the CLI [fetched]. A byte-preserving engine may only ever offer the suggestion tier |
| LLM-generated explanation as the default | n=106 within-subjects over six buggy C programs: GPT-4 explanations beat stock compiler messages on time-to-fix in only 1 of 6 tasks, and handwritten explanations still won on objective and subjective measures [fetched arXiv 2409.18661, 2024-09-27] |
| Humour or novelty on a refusal | NN/g reserves novelty for total, no-recourse failure and warns humour goes stale on repeat; a refusal is repeatable by construction [fetched] |
| A refusal that cannot be reproduced from its text | Without `reason` and a byte range a support report is unactionable. RFC 9457's `instance` member exists for exactly this [fetched] |

- Recorded and unresolved: OpenAI's Model Spec keeps refusals to "a brief apology and a brief statement of inability", never explanatory; NN/g holds that "merely stating the problem is also not enough; offer some potential remedies" [fetched both]. Both are correct in their domain. frontmatter emits both kinds — #10 versus #1–#9 — and must not unify them.
- Unverified: no telemetry exists for which of the eleven refusals users actually hit, so frequency-first prioritisation is [inference]. The character budgets derive from four exemplar messages, not from reading tests on our own users. Becker et al. (ITiCSE-WGR 2019) and Denny et al. (CHI 2021), the two most-cited works on whether enhanced error messages help, were not opened — `dl.acm.org` returned HTTP 403 on 2026-08-29 [measured] — and are excluded rather than paraphrased.
