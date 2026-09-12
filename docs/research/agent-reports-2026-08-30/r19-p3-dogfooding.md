## 92. Building the product inside the product — the dogfooding case

### 92.1 The live example: what this repository actually is

Everything below was measured in this repo on 2026-08-31 by running the gates, not by reading the documents.

| Layer | Files | Size `[measured]` | Authored or derived | Gate over it |
|---|---|---|---|---|
| Router | `AGENTS.md` + `docs/MAP.md` | 1,363 + 1,161 words | Authored by hand | None |
| Tier 1 record | PRD v2, `DEV-PLAN`, `ENGINE`, `BUSINESS`, `REFERENCES` | 120,660 / 36,702 / 40,239 / 20,728 / 19,699 words = 238,028 | **Derived** from 50 reports by `build-tree.mjs` | `npm run refs`, `npm run record` |
| Tier 1 contracts | `specs/SPECS.md` | 457 words, budget-enforced | Authored | `npm run spec` |
| Tier 2 | 4 specs + 1 ADR (`0001-adopt-hexagonal-architecture`) | 7 spec files total | Authored | `npm run spec` |
| Tier 3 | `docs/research/agent-reports-*/` | **155 files, 523,124 words** | Authored by agents, append-only | None |
| Assembled record | `docs/FRONTMATTER-RECORD.md` | 104 sections, 9,359 content lines | **Derived** by `assemble-tree.mjs` | `npm run record` |
| Corpus | `test/corpus/` | 8,518 files, byte-pinned | Fixture | `npm run corpus` |

Two structural facts matter more than the sizes. First, the Tier-1 documents are **projections**: `build-tree.mjs` reads `docs/research/agent-reports-2026-08-30/` and writes `DEV-PLAN`/`ENGINE`/`BUSINESS`/`REFERENCES`. Hand-editing one is silently reverted on the next run — the projection law of the product, applied to the product's own planning. Second, the router carries no content. `MAP.md` is 1,161 words of pointers plus a "do not read" list of seven superseded files.

### 92.2 What is clumsy about it — found by running it, not by confessing

I ran the three read-only gates. Total wall time **0.166 s** `[measured]`.

| What is wrong | Evidence `[measured]` | Why it happened | Does a gate catch it |
|---|---|---|---|
| The assembled record is stale | `npm run record` → **4 failures / 104 sections** | Record built 01:29:17, PRD edited 01:45:34 — 16 minutes later | Yes, and it fails red right now |
| A number drifted between two documents | Record says Front Matter CMS **80,527 installs `[fetched]`**; tree says **80,605 `[fetched, §52.1]`** | Someone re-derived in the source and did not rebuild | Yes — this is exactly the catch |
| The router's own numbers are stale | `MAP.md` Tier 3 row: "105 files, 374,866 words". Measured: **155 files, 523,124 words** | The 08-30 round added 50 files / 148,255 words; MAP was not touched | **No.** Nothing checks a count in prose |
| The ref checker points at files that do not exist | `5/7 files … not built yet: docs/VERIFICATION.md, docs/PRODUCT.md` | Checker written ahead of the docs | It reports it, then passes anyway |
| 30 "suspect" refs, mostly not ours | `C2PA 2.4 §5.3.1`, `CSS Text 3 §4.1.3` flagged as broken internal refs | The FOREIGN regex misses citation forms | Cries wolf — the failure mode that trains you to ignore a gate |
| Governance is nearly absent | `npm run spec`: **169 of 171 module files ungoverned**; 4 specs, all `draft`, all warned `stale-prd` (recorded `400aef0d4008`, live `4241a78faa40`) | Bootstrapping | Yes, as INFO |
| Correcting one sentence in a derived file requires finding the report | No index from output line back to source report | `build-tree.mjs` does not emit provenance | No |

The honest reading: the parts that are gated held (0 broken refs out of 662; 9,359 lines carried through unchanged), and every failure above sits in a place with no gate — prose counts, provenance, and the router itself. That is the product thesis stated as a defect list.

### 92.3 The artefacts a team keeps, and which ones earn a render

The founders have refused project management. That refusal is the discipline that makes this list short.

| Artefact | On disk | Authored or derived | Render? | What the render is |
|---|---|---|---|---|
| PRD / product record | One long file, `## N.` sections | Authored | **No** | Prose. A render adds chrome and hides the section numbers people cite |
| Specs / contracts | One file per contract, frontmatter `state`, `governs`, `verify` | Authored; `state` machine-written | **Yes** | Contract table: id, state, red proof present, governed files, last verify exit code |
| Decisions / ADRs | `docs/adr/NNNN-*.md` | Authored | **Yes** | Decision card: the question, the choice, what it forecloses, superseded-by |
| Research / evidence | Append-only reports | Authored | **No** | Never rendered. It is read only to verify a claim before publishing |
| Roadmap | Frontmatter fields on specs and ADRs (`track:`, `state:`) | **Derived** | **Yes, read-only** | Lanes by `track`, columns by `state`. Nothing is draggable — moving a card would have to write a file, and only the harness writes `state` |
| Meeting notes | Dated file, prose | Authored | **No** | Prose |
| Runbooks | Prose + fenced commands | Authored | **No** (a copy-command affordance, not a view) | |
| Changelog | Derived from commits and spec transitions | **Derived** | **No** | It is already a list |
| Router / map | One file of pointers | Authored | **Yes** | Reference map: what resolves, what is broken, what is superseded, what is unreachable |

Three renders in total: **contracts, decisions, roadmap-as-projection**. Every one is a deterministic reversible projection of bytes already in the file, owning no state, which is the same rule the editor already obeys. The moment a card carries an assignee or a due date, the render owns state the file does not, and we are Notion with worse sync. `[inference]`

### 92.4 Why the referential structure matters more when the reader is a machine

Anthropic's own documentation now names the failure: "As token count grows, accuracy and recall degrade, a phenomenon known as **context rot**. This makes curating what's in context just as important as how much space is available." `[fetched 2026-08-31, https://docs.claude.com/en/docs/build-with-claude/context-windows]` The same page: Opus 5, Sonnet 5 and several others carry a **1M-token context window**, 200k for Sonnet 4.5 `[fetched, same URL]`.

Fitting is not reading. NoLiMa (ICML 2025) evaluated 13 models claiming ≥128K support: "At 32K, 11 models drop below 50% of their strong short-length baselines. Even GPT-4o … a reduction from an almost-perfect baseline of 99.3% to 69.7%." `[fetched 2026-08-31, http://export.arxiv.org/api/query?id_list=2502.05167]` Liu et al. found performance highest when the relevant span sits at the beginning or end and "significantly degrades when models must access relevant information in the middle of long contexts, even for explicitly long-context models." `[fetched, arXiv 2307.03172, TACL]`

Apply that to this repo. `[derived]` at 1.33 tokens/word:

| Read | Words `[measured]` | Tokens | Sonnet 5 @ $2/MTok | Opus 5 @ $5/MTok |
|---|---|---|---|---|
| Router only (`AGENTS.md` + `MAP.md`) | 2,524 | 3,357 | $0.0067 | $0.017 |
| Whole Tier-1 tree | 238,028 | 316,577 | $0.63 | $1.58 |
| Tier 3, all reports | 523,124 | 695,755 | $1.39 | $3.48 |

Prices `[fetched 2026-08-31, https://platform.claude.com/docs/en/about-claude/pricing]`: Opus 5 $5/$25 per MTok, Sonnet 5 $2/$10, Haiku 4.5 $1/$5, cache read $0.50/$0.20/$0.10.

The ratio is the argument: **207×** the tokens to answer a question the router answers `[derived: 695,755 / 3,357]`. And the 696k-token read is the one the literature says the model will read worst. A human who opens the wrong file loses ten minutes and knows it. A model that opens the wrong file loses recall in the middle of the window and reports confidently — the cost is not the dollar, it is that you cannot see it happen. One fact one home, superseded marked, and a router that says what *not* to open are therefore not documentation hygiene; they are the only controls that work on a reader with no memory of having been misled.

### 92.5 What breaks when a team tries this in plain markdown today

| Failure | What it looks like | Who notices, when |
|---|---|---|
| Stale cross-reference | `§74` points at a section that was renumbered or deleted | Nobody. The reader concludes the record is incoherent |
| Number drift | 80,527 in one file, 80,605 in another `[measured, both in this repo]` | The customer, in a deck |
| Derived vs authored is invisible | Someone hand-edits a generated file; next build reverts it | The author, after losing the edit |
| No provenance | A claim cannot be traced to the report that produced it | At the moment it is challenged |
| Superseded files read as current | Seven such files sit in `docs/` here; only a hand-written table marks them | The next reader, human or agent |
| No budget on the router | The index grows until it is itself a document | Gradually |

Every one of those is deterministic, checkable, and costs zero inference tokens to detect. That is the whole opening.

### 92.6 The gates are product features wearing build-script clothes

| Script here | What it does | Product feature | Runtime `[measured]` | AI cost |
|---|---|---|---|---|
| `npm run refs` | 662 internal refs, 59 external skipped, 0 broken, 30 suspect | **Broken-pointer check** — every `§N`, every relative link, every anchor | 0.042 s | Zero |
| `npm run record` | Asserts every content line of 5 files appears in the assembled document, unchanged | **Derived-document build with an integrity proof** — compile many files to one, prove nothing was edited in transit | 0.049 s | Zero |
| `npm run spec` | 4 specs, 0 errors, 4 warnings, ungoverned-file count, automatic demotion on hash change | **Contract state machine** — a status no human can assert | 0.075 s | Zero |
| `npm run tree` | Projects reports into the record | **Projection build** — same law as the editor's views | — | Zero |
| `npm run corpus` | 8,518 byte-pinned files | Engine certification, already ours | — | Zero |

The line that matters for a business with a limited AI budget: **the three checks that would sell this cost 0.166 s of CPU and zero tokens.** Cost at 100 users is the same as cost at 10,000 users — it is CPU on a file the user already has. `[derived]`

### 92.7 Options, and the one I am recommending

| Option | What it is | Cost | What it buys | What it forecloses |
|---|---|---|---|---|
| **A. CLI + CI only** | Ship the four gates as a package and a GitHub Action | ~2 weeks; zero infra | Credibility with the ten teams who already do this | Non-engineers never see it. Nothing to price at ₹299 |
| **B. Editor panels over the same deterministic engine** | Three checks and one build, in the app: broken pointers, derived-document build, contract table + decision card + read-only roadmap. Same code as A, plus a CLI | ~6–8 weeks; zero marginal inference | A visible reason to pay that is not AI; works offline; every panel is a projection of bytes already in the repo | Any board that writes state; anything that needs a server-side model of the project |
| **C. Docs OS with project management** | B plus assignees, due dates, notifications, comments | 6+ months; a second sync problem; on-call surface for one person | A market that already has Notion and Linear | The refusal principle, the one-person operability constraint, and the sync decision |

**Recommendation: B, capped at three renders and four checks.** Free tier gets the broken-pointer check and the router budget. ₹299 gets the derived-document build with the integrity proof and export. ₹599 gets the contract state machine with automatic demotion — the thing a team with auditors or a client will pay for, because it produces a status nobody can hand-write.

**The strongest argument against B**, stated honestly: this repo is a 500,000-word planning corpus written largely by agents, which is not what a five-person team has. A team with a PRD, twelve specs and forty meeting notes may never hit a broken pointer, in which case the checker fires zero times and reads as ceremony. B bets that the pain scales with agents in the loop, not with headcount — and that bet is unproven outside this repository. `[inference]`

### 92.8 Evidence that would change my mind

| Finding | Threshold | Then |
|---|---|---|
| First-run scan of 20 real repos finds few defects | Median < 3 broken refs per repo | Drop the checker to free forever; lead with the derived-document build |
| Users hand-edit derived files anyway | > 30% of build runs report a hand edit reverted | Provenance and per-line source attribution outrank new renders |
| The roadmap view is requested as draggable | > 40% of trial teams ask in month one | Say no in writing, publish why, and watch churn — that number is the answer to option C |
| Suspect-ref false positives exceed real ones in the wild | > 2:1 | Ship the checker silent by default; a gate that cries wolf is worse than none |

### 92.9 The pitch

On day one you point it at a repository you already have. It reads the markdown, tells you which cross-references resolve and which do not, which files are superseded and still being read, and which numbers appear twice with two values. It builds your scattered documents into one document and proves every line survived unchanged. It shows your specs as a table whose status is written by the checks, not by a person, and demotes any of them the moment the code underneath changes. It writes nothing you did not ask for, moves no file, and sends no bytes of your document anywhere. The files stay yours, in your git repo, in the format you can read without us.
