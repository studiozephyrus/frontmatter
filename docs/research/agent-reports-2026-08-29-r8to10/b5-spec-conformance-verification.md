### Method and evidence tags
- `[measured]` = executed on this machine today. `[fetched]` = primary source opened via `curl`. `[SS]` = search-summary, nobody opened it. `[derived]` = arithmetic shown. `[inference]` = my reasoning.
- `curl` reachable: arxiv API, raw.githubusercontent.com, api.github.com (with token), registry/api.npmjs.org, readthedocs, docs.pact.io, json-schema.org, stryker-mutator.io, fda.gov, alistairmavin.com, cucumber.io, lamport.azurewebsites.net (PDF → `pdftotext`) `[measured]`. Blocked: `cacm.acm.org` → HTTP 403 `[measured]`. `WebFetch` never attempted; `curl` used throughout.
- No file was created, edited, or deleted; no `git` mutation ran. All commands were `curl`, `ls`, `head`, `grep`, `python3 -c`, `node -e`.

### Mechanism table — what each can and cannot prove

| Mechanism | Proves | Cannot prove | Hard evidence |
|---|---|---|---|
| Example-based tests as spec | Named inputs produce named outputs, at the examples chosen | Anything about un-chosen inputs; that the examples encode the spec's intent | fast-check docs: example tests "place the responsibility of identifying bugs solely on the developers writing the tests" `[fetched]` |
| Property-based testing (Hypothesis 8,918★; fast-check 5,121★) | Falsification: a counterexample to a stated invariant, minimised | Absence of counterexamples ≠ proof; the property itself is unverified against the English spec | repo stars/pushes via api.github.com 2026-08-29 `[fetched]`; fast-check 37,512,910 npm downloads 2026-08-21→27 `[fetched]` |
| Schema validation (JSON Schema / ajv) | Structural + per-field constraint conformance of an instance | Cross-field arithmetic, temporal, or business invariants | `[measured]`: ajv 6.15.0 local, schema `{total≥0, discount≥0}`, 3 payloads → 3 schema-valid, **1 of 3 schema-valid while violating the English sentence "a discount must never exceed the order total"** |
| OpenAPI conformance fuzzing (Schemathesis 3,565★, 8 open issues) | Server responses deviate from the schema; 5xx/silent disclosure on generated inputs | That the schema is the spec; semantics the schema does not encode | 8 fuzzers × 16 real services; Schemathesis "the only one to handle more than two-thirds of our target services without a fatal internal error"; 1.4×–4.5× more unique defects than second-best `[fetched arXiv 2112.10328v1]` |
| OpenAPI drift/breaking-change diff (oasdiff 1,332★) | Spec-vs-spec delta, classified breaking/non-breaking | Spec-vs-code drift; only spec-vs-spec | oasdiff README `[fetched]` |
| Runtime request/response validation (express-openapi-validator, Prism 5,017★) | Live traffic conforms to schema at the boundary | Correctness inside the boundary; unexercised paths | npm 540,445/wk `[fetched]` |
| Consumer-driven contract testing (Pact) | The provider's response shape satisfies each identified consumer's recorded expectation | Provider functional correctness; side effects; public APIs; pass-through/BFF; performance | Pact docs, verbatim scope limits: "Pact is about checking the contents and format of requests and responses"; "Pact does not test the side effects of a request"; explicit not-good-for list incl. public APIs, unidentifiable consumers, load testing `[fetched, page last updated 2022-04-13]` |
| BDD / Gherkin (cucumber-js 5,385★) | A named behaviour was exercised and passed; shared vocabulary | That scenarios cover the spec; scenarios are chosen by humans | Cucumber "Writing better Gherkin": describe *what*, not *how* `[fetched]` |
| Mutation testing (Stryker 3,060★, PIT 1,856★) | Your test suite detects specific seeded faults; mutation score = detected/valid × 100 | Spec conformance at all — it grades *tests*, not code-vs-spec; equivalent mutants are undecidable in practice | Stryker docs: equivalent mutants — "There is no definitive way for Stryker to find and ignore them… the only solution is by finding these by hand" `[fetched]` |
| Model checking (TLA+ 3,019★, Alloy 863★) | A *design* satisfies stated invariants within a bounded state space | That code implements the design | Newcombe et al., AWS: "How do we know that the executable code correctly implements the verified design?" — **"The answer is that we don't."** `[fetched PDF]` |
| Deductive verification (Dafny 3,518★, 1,383 open issues) | Code satisfies machine-checked pre/post-conditions | That the contracts are the spec; anything outside the verified module | api.github.com `[fetched]` |
| LLM-as-judge for conformance | A cheap, correlated, *non-deterministic* opinion | A verdict stable under reordering, prompt length, or rerun | see next section `[fetched]` |
| IR/LLM traceability link recovery | Candidate spec↔code links ranked by similarity | Correctness of a link; that a link means the requirement is *satisfied* | SpecMap datasheet→code "up to 73.3% file mapping accuracy" `[fetched arXiv 2601.11688v1]` |
| Tag-based traceability (OpenFastTrace 163★, GPL-3.0) | Every normative item has a marker in code/tests of the required artifact type; and detects stale links | That the marked code *implements* the item — coverage is a claim by the author of the marker | OFT user guide: statuses Orphaned / Outdated / Predated / Unwanted / Duplicate / Covered-* / transitive defect `[fetched]` |
| Architecture-conformance scripts | Named structural rules hold across the tree | Behavioural conformance | `[measured]` local: `specs/harness/` holds 5 `.mjs` gates; `import-boundary-report.mjs` "Fails (exit 1) if any source file still references `@/server`, `@/lib`, or `@/components`" |

### LLM-as-judge for spec conformance — the measured reliability
- Two primary sources **disagree** and both are recorded:
  - MT-Bench/Chatbot Arena: strong judges "match both controlled and crowdsourced human preferences well, achieving over 80% agreement, the same level of agreement between humans" `[fetched arXiv 2306.05685v4]`.
  - Judging the Judges: 13 judge models × 9 exam-taker models — "only the best (and largest) models achieve reasonable alignment… still quite far behind inter-human agreement", scores off by "up to 5 points", leniency bias, and "judges with high percent agreement can still assign vastly different scores" `[fetched arXiv 2406.12624v6]`.
- Code-specific, which is what matters here:
  - 8 LLMs judging correctness of **1,405 Java methods and 1,281 Python functions**: GPT-4-turbo best, but "even the best-performing LLM frequently misjudges the correctness of the code" `[fetched arXiv 2507.16587v1]`.
  - CodeJudgeBench, **26 judge models**: "all models still exhibit significant randomness"; for pairwise judging "simply changing the order in which responses are presented can substantially impact accuracy" `[fetched arXiv 2507.10535v2]`.
  - Best reported human correlation in SE tasks: Pearson **81.32** (code translation), **68.51** (code generation) `[fetched arXiv 2502.06193v3]`.
- `[inference]` A judge whose verdict flips on response order cannot be the gate on "does this code match this spec". It is a *triage* signal that must be reported with its own alignment numbers (this is already Learned Rule #5 in this workspace).

### The test-oracle collapse — measured on the field's own benchmark
- SWE-Bench+: **32.67%** of successful patches involved solution leakage; **31.08%** passed on weak tests; filtering both dropped SWE-Agent+GPT-4 from **12.47% → 3.97%** resolution; >94% of issues predate the model's cutoff `[fetched arXiv 2410.06992v2]`. `[derived]` 12.47 − 3.97 = **8.50 absolute points**, a **3.14×** reduction.
- "Are 'Solved Issues' Really Solved": **7.8%** of patches counted correct while failing the developer-written suite; **29.6%** of plausible patches behave differently from ground truth; **28.6%** of those are certainly incorrect; net **6.2 absolute points** of inflation `[fetched arXiv 2503.15223v2]`.
- `[inference]` "Tests pass" is the strongest verification signal in mainstream practice, and it is measurably a *weak* oracle even on curated benchmarks with human-written suites. Everything built on top of it inherits that ceiling.

### Formal methods lite — actual industrial usage
- AWS, TLA+/PlusCal, per-system line counts excluding comments `[fetched PDF]`: S3 network algorithm 804 PlusCal (2 bugs, plus bugs in proposed optimisations); S3 background data redistribution 645 PlusCal (1 bug, plus a bug in the *first proposed fix*); DynamoDB replication & group membership 939 TLA+ (3 bugs, "some requiring traces of 35 steps"); EBS volume management 102 PlusCal (3 bugs); internal lock-free data structure 223 PlusCal ("Improved confidence. Failed to find a liveness bug as we did not check liveness"); internal distributed lock manager 318 TLA+ (1 bug + verified an aggressive optimisation). `[derived]` total = 804+645+939+102+223+318 = **3,031 lines** across all six.
- Alloy self-description: "a collection of constraints… the Alloy Analyzer is a solver that… check[s] properties of the model by generating counterexamples" — model, not code `[fetched alloytools.org]`.
- `[inference]` The honest reading: 3,031 lines of spec found ~10 design bugs at one of the largest engineering organisations on earth, and its own paper states the code-to-design link is unproven. Formal methods lite is a *design* verifier that was never marketed as a code-conformance verifier.

### Requirement traceability matrices — regulated practice
- FDA "General Principles of Software Validation", Guidance for Industry and FDA Staff, **January 2002**, Docket FDA-1997-D-0029, CBER + CDRH, status **Final** `[fetched fda.gov]`. `[derived]` 2026 − 2002 = **24 years** old and still the cited baseline.
- DO-178C (avionics), IEC 62304 (medical device software), ISO 26262 (automotive), IEC 61508, ISO/IEC/IEEE 29148 are all paywalled standards; not opened, so their clause text is `[SS]` and is not quoted here.
- Practice shape (from tool documentation rather than the standards) `[fetched jamasoftware.com nav + guide index]`: the RTM is a bidirectional matrix — user need → system requirement → design → code unit → test case → test result — with *forward* coverage (every requirement has a test) and *backward* coverage (every test traces to a requirement, no orphans). Jama's own comparison set names the incumbents: IBM DOORS, DOORS Next, Polarion, PTC codebeamer and Integrity/RV&S, Jira, Word + Excel.
- The proven claim of an RTM is narrow and worth stating precisely `[inference]`: an RTM proves *link existence and link freshness*, i.e. that no requirement is unlinked and no artifact is orphaned. It never proves *satisfaction*. An auditor reads it as evidence that someone was accountable for each requirement, not that the code is correct.

### Modern tools that actually implement RTMs
| Tool | Model | Status 2026-08-29 |
|---|---|---|
| OpenFastTrace | Markdown/plain specs with `req~id~revision` IDs; `Covers` / `Needs` / `Depends`; code tags; HTML/plain report | 163★, GPL-3.0, pushed 2026-08-28 `[fetched]` |
| StrictDoc | Text/SDoc + ReqIF, traceability + doc generation | 370★, 160 open issues, pushed 2026-08-28 `[fetched]` |
| Sphinx-Needs | Requirements as directives inside Sphinx docs, link graph + matrices | 299★, 249 open issues, pushed 2026-08-28 `[fetched]` |
| Doorstop | Git-backed requirements as YAML with parent/child links | reachable, README 200 `[fetched, not read]` |
| spec-kit `analyze` | LLM builds "task coverage mapping… by inference by keyword / explicit reference patterns"; emits "Coverage % (requirements with >=1 task)" | 132,035★, MIT `[fetched]` |
- OFT's most valuable primitive, and the one nobody else copies `[fetched user guide]`: **revision-pinned links**. "Incrementing the revision voids all existing links to this item"; statuses `Outdated` (covers an older revision) and `Predated` (covers a newer revision) exist precisely for this. The guide calls it "one of the most useful safeguards in OFT."
- Automated link *recovery* is the research frontier and is not accurate enough to be a gate: SpecMap reaches "up to **73.3%** file mapping accuracy" `[fetched 2601.11688v1]`; NL-PL TLR gains over SOTA are **+3.68%** (HGT) and **+8.84%** (Gemini 2.5 Pro) F1 across 12 projects `[fetched 2509.05585v1]`; and requirement *quality* moves TLR performance in both directions — 28 defect types annotated across 189 use-case descriptions, where e.g. sentences not starting with a noun phrase hurt and use cases containing implementation details *help* `[fetched 2606.11834v1]`.

### Acceptance-criteria linting — what exists, honestly
- EARS (Easy Approach to Requirements Syntax): constrained-English patterns, `While <pre-condition>, when <trigger>, the <system name> shall <system response>`; developed at Rolls-Royce while analysing jet-engine airworthiness regulations; first published 2009; users named include Airbus, Bosch, Dyson, Honeywell, Intel, NASA, Rolls-Royce, Siemens `[fetched alistairmavin.com]`.
- Commercial requirement-quality checkers exist as vendor features (Jama Connect Advisor is EARS-based) `[fetched, nav listing only]`.
- OSS "linting" is thin: `gherkin-lint` ships **1,145,336** npm downloads/wk `[fetched]` and lints *scenario syntax*, not criteria quality `[inference]`.
- The largest deployment of acceptance-criteria linting today is spec-kit's `checklist`, and it is explicit about its own boundary `[fetched templates/commands/checklist.md]`: "Checklists are **UNIT TESTS FOR REQUIREMENTS WRITING**"; "❌ NOT checking if code/implementation matches the spec"; "`[x]` does NOT mean implementation work is complete."
- `[derived]` spec-kit's 10 command templates total 130,932 bytes; `checklist.md` alone is 21,970 = **16.78%** — the single largest command, and it verifies *English*, not code.
- spec-kit's actual code-conformance step is `converge`: an LLM builds an "Intent Inventory", reads the codebase, classifies findings as `missing`/`contradicts`, appends convergence tasks, and reports "✅ Converged" when nothing remains `[fetched converge.md]`. `[inference]` This is unvalidated LLM-as-judge, looped to fixpoint; its stopping condition is the judge's own opinion.

### Market signal — consolidation and abandonment
- `[fetched]` **Optic** (generate/verify OpenAPI from live traffic — the single best spec-vs-runtime drift product): `archived=true`, last push 2026-01-08, README footer "Optic Labs is now part of Atlassian". `[derived]` 233 days stale.
- `[fetched]` **Dredd** (OpenAPI-doc-to-implementation conformance runner): `archived=true`, last push 2024-05-11. `[derived]` 840 days stale.
- `[derived]` 2 of the 18 repos queried are archived = **11.11%**, and both are in the *spec-conformance* category specifically; every property-testing, schema-validation, mutation-testing, and traceability repo queried was pushed within the last 79 days.
- `[derived]` npm last-week downloads: ajv 378,773,799 / fast-check 37,512,910 = **10.10×**; fast-check / @stryker-mutator/core 2,320,443 = **16.17×**; ajv / @pact-foundation/pact 600,095 = **631.19×**.
- `[inference]` The world overwhelmingly buys *shape validation* (ajv), sparingly buys *falsification* (fast-check), rarely buys *test-quality grading* (Stryker), and has let *spec-to-implementation conformance* tooling die twice.

### Honest state of the art — the verdict
- **Solved**: structural conformance of data to a machine-readable schema, at a boundary, for the constraints the schema language can express. `[measured]` and `[fetched]` above.
- **Solved**: link *bookkeeping* — that every normative item has an owner, a marker, and a fresh revision. OFT does this deterministically today `[fetched]`.
- **Partially solved**: design-level conformance (TLA+/Alloy, bounded, design-only, code link explicitly unproven `[fetched]`); interface conformance between two teams you control (Pact, with a published not-for list `[fetched]`); test-suite adequacy (mutation testing, with undecidable equivalent mutants `[fetched]`).
- **Unsolved**: "does this code satisfy this English requirement." Nothing measured here answers it. The best oracle in mainstream use (tests) inflates correctness by 6.2 points and collapses 3.14× under leakage/weak-test filtering `[fetched, derived]`; the best scalable substitute (LLM judge) flips on response order `[fetched]`; the best automated link recovery tops out at 73.3% file-level accuracy `[fetched]`.
- `[inference]` There is no verification mechanism in the field that takes a natural-language requirement plus a codebase and returns a sound verdict. Every deployed system reduces the problem to one of: (a) a human wrote a test, (b) a human wrote a formal property, or (c) a human wrote a tag. The human is always the oracle.

### What frontmatter can credibly offer — document side only
- **Stable, revision-pinned requirement identity in Markdown.** Adopt OFT's `id~revision` semantics: each normative item carries a content hash or revision; editing the item's normative text bumps the revision and **voids every outstanding coverage claim** `[fetched OFT]`. This is provable from the document alone. `[actionable]`
- **Normative-vs-informative segmentation.** OFT distinguishes them explicitly and only normative passages require coverage `[fetched]`. frontmatter owns the AST; it can classify and *count* normative items deterministically instead of an LLM inferring them by keyword the way spec-kit `analyze` does `[fetched]`. `[actionable]`
- **A real, computed coverage matrix — with an honest label.** Emit "N of M normative items have ≥1 declared covering artifact; K links are Outdated; J are Orphaned." Every one of those is a document-side fact. Label the artifact **link coverage**, never **conformance**. `[actionable]`
- **EARS-shaped authoring assistance and criteria linting.** Constrained-syntax checking is a pure document operation, has 17 years of industrial adoption, and measurably changes downstream traceability performance `[fetched arXiv 2606.11834v1]`. `[actionable]`
- **Change-impact broadcast.** When a normative item's revision bumps, emit the closure of dependent items, tests, and previously-linked artifacts. `[actionable]`
- **Machine-checkable extraction, not judgement.** Where a requirement contains a schema, a table, an enum, or a numeric bound, extract it into a JSON Schema / test fixture the code side can run. The document becomes the *source* of an executable artifact; frontmatter never adjudicates the run. `[actionable]`
- **Ship the local precedent as the model** `[measured]`: this repo's `specs/harness/` already encodes five deterministic gates that exit non-zero. That is the correct division — documents generate gates; gates decide.

### Explicit anti-recommendations — what would be over-claiming
- **Do not claim "verifies that code matches the spec."** AWS, with 3,031 lines of formal spec and a model checker, states outright it does not know that `[fetched]`. Any Markdown tool claiming it is claiming more than TLA+.
- **Do not ship an LLM conformance verdict as a gate.** Order-sensitivity and rerun randomness are measured `[fetched 2507.10535v2]`; frequent misjudgement of code correctness is measured on 2,686 functions `[fetched 2507.16587v1]`. If a judge ships, it must ship its own kappa/precision against a human gold set, per Learned Rules #4/#5.
- **Do not present link coverage as conformance.** "100% of requirements are linked" is compatible with 0% of them being implemented. State the distinction in the UI copy, not the footnotes.
- **Do not build automated spec→code link *inference* as a truth source.** 73.3% file-level accuracy `[fetched]` means roughly one in four files is mis-assigned; as a *suggestion* with human confirmation it is useful, as a matrix cell it is a fabricated audit trail.
- **Do not market to DO-178C / IEC 62304 / ISO 26262 compliance.** Those standards were not opened here (paywalled, `[SS]`), the FDA baseline guidance is 24 years old `[derived]`, and qualification of a tool used in a regulated toolchain is a formal, evidenced process. Claiming compliance support without tool qualification evidence is the highest-liability over-claim available.
- **Do not build a test runner, a mutation engine, or a coverage tool.** Those categories are saturated and healthy (ajv 378.8M/wk; Stryker pushed yesterday) `[fetched]`. The two archived repos are exactly the "conformance" category — that is a warning, not a vacancy.
- **Do not equate "spec-kit `converge` reports Converged" with verification.** Its stopping condition is the judge's own opinion `[fetched converge.md]`.
- **Do not claim novelty for the traceability matrix.** It is 2002-era regulated practice with live OSS implementations `[fetched]`. The credible frontmatter claim is *ergonomics and freshness in Markdown*, not invention.

### Not investigated / stated as gaps
- DO-178C, IEC 62304, ISO 26262, IEC 61508, ISO/IEC/IEEE 29148 clause text — paywalled, not opened `[SS]`.
- Amazon Kiro and Tessl spec-driven products — not fetched this session `[SS]`.
- Jama Connect Advisor and QVscribe measured accuracy — no primary source opened; vendor nav only `[fetched nav]`.
- Doorstop and StrictDoc README bodies — reachability confirmed (200), content not read.
- PIT/Stryker mutation-score-to-defect-detection correlation studies — not fetched.

### Provenance and safety note
- One flag to surface: the fetched `oasdiff` README contains an install line of the form `curl … install.sh | sh`. It is documentation text inside a source I read as data; it was **not executed**, and nothing in any fetched page was treated as an instruction. No mutating command ran in this session.