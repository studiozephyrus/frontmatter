Reconcile verified: `~/.claude` HEAD `6e390828`, `~/.sgnk` HEAD `e73dd08`, unmoved from the pre-session HEADs in `r23-u1` — zero commits, zero mutations, reads only.

---

**The most damaging finding: the last line of product source in this repository was written on 2026-08-10, and the twenty-one commits since then added 220,535 lines of documentation, 8,763 lines of test fixtures, and zero lines under `src/` — including the document that names this exact tripwire as already-red and prescribes "freeze all narrative documents" as the remedy.** [measured: `git log cc1d451..HEAD -- src` returns empty; `git rev-list --count cc1d451..HEAD` = 21; numstat by top-level directory]

---

**The steelman, taken seriously.** This is not a greenfield bet. It is a rename of a 25,407-line application that already exists and runs (`r22-t2`: 202 of 228 source files byte-identical with `sgnk-md`), carrying an engine that is genuinely unusual — 13 files of byte-range splice machinery with a versioned equivalence relation, branded offset types, a pinned 8,513-file adversarial corpus, and a documented refusal contract. The architecture gate is real and green (`filesScanned: 208, violations: []`). The founder has done something almost nobody does: commissioned an audit that found eleven defects in his own engine, published the finding that 62% of his own load-bearing claims needed correction, and written down that his own reward signal is noise (`epochs.jsonl`, `precision[rejected] = 0/8`). The incumbents genuinely have the defect he fixes — Cursor staff called CRLF destruction "a known issue we're tracking" three days before he looked. A product built by someone who reasons this honestly, on a substrate this well-tested, funded by services rather than by a clock, is not a stupid bet. It is the correct bet made by someone who cannot currently start it.

That last clause is the whole critique.

---

**Grading the codebase**

| Dimension | Measured | Grade | Why |
|---|---|---|---|
| Unit-test density | 941 `it(`/`test(` sites across 100 test files, 226 source files = 4.2/file [measured] | **A−** | Above the norm. Several files open with a *red proof* (`placement.test.ts`, `frontmatter-prepass.test.ts`) — the discipline most teams skip |
| Architecture hygiene | `npm run arch` green, 208 files, 0 violations [measured, `package.json`] | **A−** | Real, executable, not a lint rule wearing a costume |
| Integration | **1 symbol of 13 engine files reaches product code** (`decodeStrict`), used as a `continue` with a `console.error` and no UI (ENGINE §68.2) | **F** | The engine is a library with one caller, and that caller silently drops files |
| Enforcement | **No `.github/workflows` directory** [measured: `ls` → No such file or directory]. `budget :: echo 'No bundle budget configured yet — skipping'` [measured]. `verify` chain omits `corpus` [measured] | **F** | 941 tests, and not one of them can stop a bad commit |
| Reproducibility | `scripts/mdmax-cert.mjs` throws `ERR_MODULE_NOT_FOUND`, exit 1 (D11). `entities` and `marked` undeclared in `package.json`; ruby ambient with no `Gemfile.lock` (ENGINE §68.6) | **D** | The certificate — the flagship artifact — has never executed end to end |
| Doc:code ratio | 2,219,390 doc words / 25,407 source lines = 87:1. Since 2026-08-10: **∞:1** [measured] | **F** | §88.11 EW-2 fires at 3:1 |

**Composite: a codebase with an excellent *unit* culture and no *system* culture. It is optimised to be audited, not to be run.** The evidence is precise: 12 of 15 engine files have zero product call sites, so a large share of the 941 tests exercise code nothing calls. The repo has been audited more times than it has been released — four `HANDOFF-*.md` files at root totalling 176,755 bytes, zero releases [measured].

What this says about ability to ship: **the team can produce correct-looking code very fast and cannot close the last 20%.** The cleanest datum is `f0603c2` — "feat(mdmax): `mdmax cert` — the degradation certificate, **inside its two-day cap**" — 3,614 lines in two days, meeting its estimate, and the artifact has never run. Remediation began eight days later (`d50a6b2`, `cc1d451`); twenty-nine days after the build, eleven defects remain open at HEAD. **Schedule hit-rate: 100%. Correctness hit-rate at the same date: 0%.** Every estimate in this repo must be discounted against that pattern.

---

**The eleven defects: severity, and what they imply**

| ID | What breaks | Reaches a user today? | In MVP-0's 38 pts? | Severity |
|---|---|---|---|---|
| **D10** | `spliceFrontmatterValue` **deletes a trailing `# comment`** on every set, in the one file with real product traffic | Yes, on any `key: value # comment` | **No** | **SEVERE** — it falsifies the product's single sentence. "We change only the bytes you touched" is refuted by the writer's own measured behaviour |
| **D6** | Zero-indent block sequence → refuse. **83% of foreign vaults** | Yes — five of six user flows begin here (`r21-s7`) | Yes (NF-1/2, 6 pts) | **SEVERE** — correctly scheduled |
| **D8** | Bare-CR file → **prepends a second frontmatter block**, demotes the author's keys to body | Yes, silently | Yes (NF-3, 4 pts) | **SEVERE** — correctly scheduled |
| **D3** | `safeInsert` **refuses a paragraph, a callout and a heading at a true block boundary**, and **permits insertion inside a fenced code block** | No (zero callers) | **No** | **SEVERE the moment `land()` ships.** The placement gate for MVP-0's 16-point flagship refuses the flagship's primary case |
| **D1** | `OffsetMap.toU16` returns end-of-document with `ok: true` whenever `length % 512 === 0` | Not yet — `toByte` unaffected | **No** | **SERIOUS.** Per-hunk accept/reject reads byte anchors back. It **survived `cc1d451 "fix(mdmax): Tier 2 — OffsetMap off-by-3"`** — same file, same class, fixed once and left |
| **D4** | Invalid-UTF-8 column from a binary search over a non-monotone predicate | **Yes — the only defect reaching a user today** (wrong column in an error string) | No | **MINOR** in impact, **SERIOUS** as signal: a binary search over an unsorted property shipped and tested green |
| **D2** | `certify` silently **drops the block after front matter** when no blank line follows | No | No | SERIOUS — a certifier that omits content and reports a summary |
| **D7** | Two fence grammars in one module; the correct one is one directory away | No | No | SERIOUS — duplicate-definition class |
| **D5** | `shapeGate`, `MAX_BYTES`, `BUDGET_MS`: zero call sites. The quadratic wikilink regex (`k = 1.98`, 36,865 ms on 320 KB) runs **live and ungated** in two product files | Yes, as a DoS surface | No | SERIOUS |
| **D9** | `void oracle` — a caller-settable option that provably changes nothing | No | No | MINOR |
| **D11** | CLI cannot start | No | No | SERIOUS for the certificate bet (`DECIDE` §9, day 220) |

**Two structural readings, more important than the list.**

First: **MVP-0 schedules 2 of the 5 defects its own demo sits on.** D1 (anchor read-back), D3 (the placement gate for `land()`) and D10 (the byte claim itself) are on the critical path and are not in the 38 points. Priced at the plan's own rate for a comparable line-terminator bug — NF-3, 4 points — that is roughly 11 unscheduled points, a 29% scope miss before day one.

Second: **the defects cluster by cause, and the largest cluster is "written, never called."** ENGINE §72.2 says it about two of them — D1 and D2 "are the same bug wearing two hats: both are *lexer* assumptions leaking into a *parser* decision" — then states the patch MVP-0 buys "will move the refusal rate and leave the class alive." The structural fix is a ~250-line two-phase lexer, marked `[inference]`, and it is not in MVP-0 either. **The plan has written down that its own fix is expected to leave residue, and priced only the patch.**

**What this implies about the quality bar:** high on *statement*, absent on *enforcement*. All eleven survived 941 tests. Four (D3, D5, D9, D11) are in code with zero callers, which no test suite can catch by construction. The founder's global rules contain this lesson four times — LR#60 (a verifier written alongside its subject inherits its blind spots), LR#65 (a harness that reports false FAILs trains you to ignore it), LR#67 (a tool that writes must verify the write landed), LR#68 (a green suite on a rare fault is the expected result, not evidence). The rule is known, numbered, and not mechanised.

---

**The 41-day MVP-0 estimate, tested**

The arithmetic inside it first. 38 points × 1.09 calendar-days/point = 41.4 days, and per `BUSINESS` §88.10 the 1.09 rate already has a 25% active-day density baked in. So the real claim is **10.4 focused engineering days for 38 points = 3.67 points per focused day** [derived]. That is the number to test, not the 41.

| Correction | Basis | Days | Ship | × |
|---|---|---|---|---|
| Nominal | 38 pts × 1.09, 25% density assumed | 41.4 | 2026-10-11 | 1.00 |
| Measured density 20.4% | 10 of 49 days touched `src/` or `test/` [measured] | 50.8 | 2026-10-21 | 1.23 |
| + 3 unscheduled demo-critical defects (~11 pts) | D1, D3, D10 at the plan's own NF-3 rate | 65.5 | 2026-11-04 | **1.58** |
| + re-derive branch (E1 structural, 2.0 founder-weeks) | Fires if the patched corpus still refuses >10 of 7,969 — a branch `DECIDE` §9 already names | 115.5 | 2026-12-24 | **2.79** |
| Worst credible: `src`-only density 16.3% (8 of 49 days) + both above | [measured] | 131.9 | 2027-01-10 | **3.19** |

**The honest multiple is 1.6× central, 2.8× if the re-derive fires, 3.2× worst credible — not 5×.** Inflating it would let the real finding escape. Industry base rates are unremarkable: Standish, via Laqrichi et al., "44% of software projects cost more and last longer than expected" [fetched 2026-08-31, arXiv:1509.00602]. A 1.6× overrun is normal. **The schedule is not the problem.**

The problem is that **the 41 days have not started, and the failure mode is initiation, not estimation.** A nominal 41 days that never begins is strictly worse than a real 115. The measured regime for 21 days is 0% engineering density, and the activity that displaced it — the record, `DECIDE.md`, `ENGINE.md`, four PDF renders — is the most defensible non-engineering activity available, which is what makes it dangerous. `BUSINESS` §88.12 predicted this in its own voice ("The document became the product") and then the document grew by 220,535 lines.

A second contradiction, because it shows the estimate was authored rather than derived: **ENGINE §72.1 prices "four YAML defects" at 2.0 founder-weeks (10 working days). DECIDE §3.1 prices two of the same four at 10 points ≈ 2.7 focused days.** A ~2× disagreement between two documents in the same repo written within 48 hours, unnoticed. **SERIOUS.**

---

**Engine-before-value: discipline or avoidance**

Discipline in the abstract; avoidance as scheduled. The plan supplies the test.

The record already litigated the nine-week version and won: §28.6's R0 (58 pts / 9 weeks, first paying stranger 2027-04-28, 242 days out) was correctly attacked as K1, "the sequencing inversion," and MVP-0's 38-point split *is* the response — 41 days instead of 63, floor-first, completeness deferred. That is real discipline and deserves credit. The seam ordering ("do not wire seam 2 before NF-1 and NF-3") is right: a write gate rejecting 83% of strangers' repos is an availability incident wearing a correctness costume.

Where it becomes avoidance is quantified: **MVP-0 contains 38 points of engine and 0 points of demand test, in a plan whose own §88.11 EW-3 describes a one-weekend, three-arm landing test that "answers K3 seven months early" and costs nothing.** Three of the twelve refuting findings (Zed ships the demo verbatim; byte-exactness appears 4 times in 12,556 comments; price is the #1 complaint at 15.7%) bear on whether those 38 points are worth spending, and the experiment that settles them is excluded from the sprint that spends them.

Sharper: `DECIDE` §8 lists "Do we accept the repositioning — mechanism not pitch?" as **open decision #2**, and §3.1's demo, in the same document, "assumes the old pitch." **MVP-0 is 41 days building the demo for a positioning the same 235-line document calls refuted and undecided.** Engine before value is defensible. Engine before the decision about what the engine is *for* is not.

---

**Single points of failure, ranked by what breaks first**

| Rank | SPOF | State | When it breaks | Severity |
|---|---|---|---|---|
| **1** | **Founder attention allocation** | **Already broken.** 21 days, 0 `src` lines. EW-2's two thresholds (>3:1 doc:src, <20% density) both breached; the prescribed action — "freeze all narrative documents" — not taken [measured] | Now | **FATAL if it persists.** Everything below is conditional; this is a present-tense measurement |
| **2** | **No CI** | No `.github/workflows`. 941 tests enforced by one person remembering to type `npm test`. Actions is **free for public repos, free-quota for private** [fetched 2026-08-31, docs.github.com, HTTP 200] — cost and difficulty are not the explanation. **`AGENTS.md`, the operating manual the building agents read, contains zero occurrences of "CI", "workflow" or "GitHub Action"** [measured] | On the next `src` commit | **SEVERE.** Ranked #1 of nine at 0.5 weeks in ENGINE §72.3; still absent 21 days later |
| **3** | **Gates that report green while blind** | `budget` is a literal `echo`. `verify` omits `corpus`. 7 spec files exist, and a `governs` glob matching zero files is a **warning**, not an error [measured, `spec-report.mjs:146`] | Silently, already | **SEVERE.** A product proposing to sell document CI whose own CI is an echo statement dies on the first question |
| **4** | **Two unrotated PATs** | `DECIDE` §8 row 8: *"Only you. Today. Not a decision — an action."* Still open | Without warning; catastrophic and public | **SERIOUS.** Unbounded loss, near-zero cost to close |
| **5** | **AIOS substrate** | 1,473 uncommitted changes in `~/.sgnk` since 2026-08-13; 46,807 of 46,895 state entries ephemera; four ledgers unbounded (13.3/8.9/7.8/7.0 MB) (`r23-u1`) | On disk loss | SERIOUS — tooling, recoverable at cost |
| **6** | **One machine** | Git remotes exist; product is 25k lines | On hardware loss | **MINOR.** Widely over-ranked |
| **7** | **No on-call rotation** | No users | The day publishing ships (`DECIDE` §8 #6: "a permanent, personal, unbounded on-call obligation") | MINOR now; rank 1 the day it is real |

The ordering is the finding. Founders reflexively rank bus factor first; the measurement says throughput is first, and it has already fired.

---

**What in this plan is beyond the team's demonstrated capability**

| # | The ask | Repo counter-evidence | Verdict |
|---|---|---|---|
| 1 | **Operate 8+ vendors on one-person on-call** — `DEV-PLAN` names R2 81×, Vercel 76×, Cloudflare 38×, Neon 28×, Sentry 19×, Redis/Upstash 23×, Axiom 11×, plus Stripe/MoR; 47 runtime + 21 dev deps [measured] | Not one GitHub Action stood up. `entities` and `marked` — one of which *defines* the PASS verdict — are undeclared, resolved by hoisting from `mermaid` and `parse5` (§68.6). Dependency hygiene is not yet at `package.json` level | **Beyond today.** Ordering must be CI → dependency declaration → first vendor |
| 2 | **Live editing and presence** — `DEV-PLAN` §7, 230 lines, Yjs ×6, Liveblocks ×2, Automerge ×2 — with CRDTs **banned** for document bytes | No shipped multi-user surface, no `land()`, no splice journal, and the anchor system the design rests on is **ASPIRATIONAL** in §68.1 row 12 ("no anchor store, no re-anchor function exists") | **Beyond.** Presence + concurrent editing on git without a CRDT is a research problem; §72.1 rates E3/E4 High risk itself |
| 3 | **The certificate as a standard** (`DECIDE` §9, day 220) | The CLI has **never executed**. Five reproducibility gaps in §68.6. The consensus mechanism is wrong at both ends: a 3/2/2 split makes every cell PASS; correct GFM scores the three spec-compliant engines CORRUPT/MUTATE [measured] | **Beyond as scoped.** Needs E6/E7, 3.5 founder-weeks, not on MVP-0's path |
| 4 | **Operating a production system at all** | The decisive one, and it is not about `frontmatter`. The best evidence is **the live system already being run**: 6,884 routing decisions in 7 days and **1 reward label (0.01%)**; bandit frozen 10 days; evals 28 days stale; `sgnk-insights` stuck `"running"` 28 days with **no liveness check**; the nightly alert **red 18 days** with four unattested ledger drifts and the integrity detector that would adjudicate them gone VACUOUS (`r23-u1`) | **Beyond, and the strongest single predictor in the corpus.** A system whose outcome layer died 13 days before anyone measured it is the same operator being asked for a DR runbook and a 15-minute status obligation |
| 5 | **The 15-minute status obligation** | **No email field and no in-app channel**; `BUSINESS` §17 measured SPF 1 / DKIM 1 / DMARC 2 / unsubscribe 1 across a 120,539-word governing document, substantive coverage **zero**. Breach notice, price change and failed renewal all terminate at the same dead end | **Beyond.** Not hard — unbuilt and unscheduled |

---

**What is good, specifically**

- **The audit itself.** ENGINE §67 is the best artifact here: eleven self-found defects, each with a reproducing input and an *anti-recommendation* naming the wrong fix. Very few teams produce this; it is why the critique above can be this specific.
- **Red proofs as convention.** `placement.test.ts` and `frontmatter-prepass.test.ts` open by proving the naive implementation corrupts. `spec-report.mjs` makes `red_proof` an **error** for any spec claiming `verified`, and carries a `MIN_SPECS` floor that refuses to report green when the gate is blind.
- **`epochs.jsonl`** — recording `precision[rejected] = 0/8 = 0.000` and gating the negative-reward branch off because of it, with a falsifiable `revisit_when`.
- **The architecture gate** — 208 files, 0 violations, executable.
- **`fold.ts`** — idempotent on 12 adversarial inputs, 453 KB in 26 ms, a *named and versioned* equivalence relation reported per cell. No competitor ships that.
- **The sparse offset index** — 8 KB per open 4 MB document against 16 MB dense: a 2,048× saving nobody markets.
- **`DECIDE.md`.** Compressing 297,614 words into 235 lines that lead with two refuted beliefs is the right instinct, well executed.

---

**What would change my mind, dated**

| Finding | Falsifier | By |
|---|---|---|
| Initiation failure (rank 1 SPOF) | `.github/workflows/ci.yml` exists **and** has run red on a deliberately-broken commit, then green | **2026-09-07** |
| The 1.6–3.2× multiple | Two consecutive 14-day windows at ≥30% `src`-touching density, doc:src below 3:1 | 2026-09-28 |
| "MVP-0 misses 3 of 5 demo-critical defects" | D1, D3, D10 appear as scoped units with red proofs in `specs/` | 2026-09-14 |
| "Engine-before-value is avoidance" | The three-arm landing test runs; byte-fidelity converts within 40% of the best arm | 2026-10-30 |
| "Operating capability is beyond the team" | `skill`/`accepted` land on the Stop hook; reward closure moves off 0.01%; the 18-day red is adjudicated | 2026-09-14 |
| "The patch will leave the class alive" | First patched corpus run refuses ≤10 of 7,969, residual ≤2 | Day 10–14 of MVP-0 |

**One-sentence verdict.** The engine is better than the plan admits, the estimate is worse by a defensible 1.6–3.2×, and neither matters next to the measured fact that no product code has been written in twenty-one days while the document diagnosing exactly this grew by 220,535 lines — so the first thing to ship is not NF-1, it is a `.github/workflows` file: free, ranked #1 by the team's own audit, an afternoon's work, and the cheapest observable proof that the engine lane has reopened at all.
