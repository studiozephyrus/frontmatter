# L4. Anatomy of the advox documentation pack, and what frontmatter should build instead

Lens 4 of the 18 September 2026 research. Local reading job, no web. Read-only against
`/Users/sagnikmitra/Desktop/GitHub/advox/frontend/docs/`; nothing in that repository was modified.

Method note. Every count below came from a command run in this session (`wc -w`, `wc -l`, `grep -c`,
`grep -oE | sort -u | wc -l`, `python3 -c` over the JSON). No file over 1,000 lines was opened whole;
the large ones were sampled by `sed -n` on the first 13 lines plus a full `grep -n '^## '` pass for
structure. Where I am reporting a judgement rather than a measurement I say so.

Punctuation note. My own prose uses plain hyphens and British spelling. Material quoted verbatim from
advox preserves the source's punctuation, including its em dashes, because the founder asked for the
exact headings and an identifier you cannot paste is not an identifier.

Provenance for Part 4. The frontmatter figures were read at **frontmatter `567b6f2`**, 2026-09-18.
That tree was moving while this was written: five commits landed between the start of this session
(`e844f0b`) and this read, all from a concurrent session working the mvp0 screen review, touching 105
files under `docs/mvp0/screens/`. **None of the five touched `SCREENS.md`, `PRODUCT-GUIDE.md`,
`PRODUCT-PLAN.md`, `docs/MAP.md` or `specs/SPECS.md`**, which are the five files Part 4 rests on, and
the four load-bearing counts were re-derived after the last of them: **38 screens** `S01` to `S38`,
**70 features** in **each** of two files, **8** `page.tsx` routes. `SCREENS.md` went dirty again at
01:17 UTC under that other session, so treat any screen-level detail here as accurate to this stamp
and no later.

---

## Part 0. The pack at a glance

| Measure | Value | Command |
|---|---|---|
| Numbered documents `00` to `32` | **33 files** | `ls [0-3][0-9]-*.md \| wc -l` |
| Words in those 33 | **119,284** | `cat [0-3][0-9]-*.md \| wc -w` |
| Lines in those 33 | **16,415** | `cat [0-3][0-9]-*.md \| wc -l` |
| Plus `README.md` and `CHANGELOG.md` | **123,818 words** | same, two files added |
| ADRs | **13 files** (12 records + a README), **10,941 words** | `cat adr/*.md \| wc -w` |
| All markdown in the tree | **141 files, 165,485 words** | `find . -name '*.md' -exec cat {} + \| wc -w` |
| Of which the knowledge-graph wiki | **89 files, 15,416 words** | `ls knowledge-graph/wiki/*.md \| wc -l` |
| `## ` headings across the 33 | **330** | `grep -h '^## ' [0-3][0-9]-*.md \| wc -l` |
| `### ` headings across the 33 | **375** | `grep -h '^### ' [0-3][0-9]-*.md \| wc -l` |
| Table rows (lines starting `\|`) | **2,382** | `grep -h '^\|' [0-3][0-9]-*.md README.md \| wc -l` |
| Mermaid diagrams | **13** | `grep -rh '```mermaid' [0-3][0-9]-*.md \| wc -l` |
| `file.ext:NNN` citations | **256** | `grep -rhoE '[a-zA-Z0-9_./-]+\.(js\|jsx\|py\|css\|prisma\|sql\|mjs):[0-9]+' *.md adr/*.md \| wc -l` |
| Relative cross-document links | **~480** across the 35 top-level files | per-file counts in Part 2.2 |

Two structural facts that matter more than the totals.

**The table row count is the real tell.** 2,382 table rows against 16,415 lines means roughly one line
in seven is a table row. This is not a prose pack with tables in it. It is a set of registers that
happen to be written in Markdown, wrapped in enough prose to explain why each register exists. That is
the single most copyable property of the whole thing.

**Prose density is low and deliberate.** 119,284 words over 330 top-level sections is about 361 words
per section. Nothing is allowed to run long. The largest file, `06-BACKEND-SPEC.md`, is 8,414 words
across 15 sections, and it covers an entire service file by file.

---

## Part 1. Every file

### 1.1 The table

Modes are the pack's own Diátaxis tag, taken verbatim from each file's second line.

| File | Words | Lines | Mode | What job it does, and who reads it |
|---|---|---|---|---|
| `README.md` | 2,656 | 255 | (index) | The routing table, the provenance block, the freshness ledger and the conventions; the only file everyone reads, and the only one that tells you which of the others is lying. |
| `00-EXECUTIVE-SUMMARY.md` | 5,258 | 637 | Explanation | The whole system in ten minutes plus a numbered ledger of the nine things found wrong and where each one now stands; read by anyone arriving cold, founder or engineer, before anything else. |
| `01-PRODUCT-AND-DOMAIN.md` | 2,203 | 301 | Explanation | Who the user is, the Indian litigation workflow being modelled, the domain vocabulary in the advocate's own language, and a feature inventory; read by whoever needs to know why the software exists before reading how it works. |
| `02-ARCHITECTURE.md` | 5,651 | 817 | Explanation | The full arc42 twelve-section skeleton with C4 levels 1 to 3 as Mermaid, covering context, constraints, building blocks, runtime scenarios, deployment and cross-cutting concepts; read by an engineer who needs the shape. |
| `03-DATA-MODEL.md` | 5,191 | 821 | Reference | Every Prisma model, field, relation and index, the ERD, migration history and integrity notes, opening with a warning block that the migrations cannot rebuild the database; read by anyone touching the schema. |
| `04-API-REFERENCE.md` | 7,379 | 1,040 | Reference | Every endpoint with method, path, auth guard, body, responses and side effects, plus a section naming endpoints the frontend calls that the backend does not have; read by anyone changing or consuming the API. |
| `05-FRONTEND-SPEC.md` | 5,354 | 780 | Reference | Routes, pages, state, hooks, utilities, styling and demo mode, plus an import-graph reachability pass that names the dead modules; read by a frontend engineer. |
| `06-BACKEND-SPEC.md` | 8,414 | 1,108 | Reference | Controllers, services, middleware, the auth guard, the sync worker, the riskiest parser and the unwired LLM layer, file by file; read by a backend engineer. The largest file in the pack. |
| `07-INTEGRATIONS.md` | 4,242 | 645 | Reference | Eight external dependencies, each with criticality, state, configuration and failure mode, plus an integration map and a configuration matrix; read by whoever has to make it work in an environment. |
| `08-DESIGN-SYSTEM.md` | 2,111 | 348 | Reference | Tokens, colour and contrast maths, type scale, layout, component conventions, icons and brand assets, opening with a standing correction of two sibling files that describe a palette which does not exist; read by anyone building a screen. |
| `09-ENVIRONMENT-AND-CONFIG.md` | 3,669 | 525 | Reference | Every variable across three services, what breaks without it, where it is set per environment, secret handling and a verification procedure; read by whoever is setting up or deploying. |
| `10-LOCAL-SETUP.md` | 1,890 | 383 | Tutorial | A numbered walk from clone to both services running on a machine that has never seen the code, recording the real failures rather than the idealised path; read once, by a new arrival. |
| `11-DEPLOYMENT-AND-OPS.md` | 2,116 | 363 | How-to | Topology, the Docker and Render deploy, the keep-alive cron, database operations, monitoring, runbooks and cost; read by whoever ships or operates it. The pack flags this as the one file whose staleness propagates into two other repositories. |
| `12-SECURITY-REVIEW.md` | 5,826 | 880 | Explanation | Eighteen findings ranked CRITICAL to LOW, each with file, line, a concrete failure path and a fix, plus an explicit "what was not assessed"; read by the owner and by whoever fixes them. |
| `13-TECH-DEBT-REGISTER.md` | 8,168 | 1,119 | Explanation | Forty items, each with the observation that produced it, an effort size, a fix and a resolution note where closed, sequenced at the end; read by whoever plans the work. Second largest file. |
| `14-TESTING-STRATEGY.md` | 6,022 | 871 | Explanation | Six test layers in dependency order with the reasoning for the order, each carrying a measured status block, plus CI, tooling and an explicit "what not to do"; read by whoever writes tests. |
| `15-GLOSSARY.md` | 1,738 | 298 | Reference | Indian legal and court vocabulary first, then system terms, then documentation-method terms and abbreviations, giving the in-product meaning separately where it differs from general usage; read constantly, by everyone. |
| `16-ECOSYSTEM.md` | 3,203 | 416 | Reference | Repositories, services, environments, domains, accounts, ownership, a secrets inventory and cost, carrying its own warning that it is the file most likely to go stale; read by whoever owns the infrastructure. |
| `17-CODEMAP.md` | 4,634 | 483 | Reference | Every first-party file in three repositories, one line each, with size, live-or-dead status and purpose; read when you need to find where something lives. |
| `18-TRACEABILITY.md` | 3,779 | 304 | Reference | A 57-row matrix tracing every feature from screen to storage with a status, plus a reverse index and one worked end-to-end path; read in both directions, to find a feature or to find what breaks if you change a table. |
| `19-PRODUCT-MATURITY.md` | 4,706 | 533 | Explanation | Eleven dimensions scored 0 to 5 against what a product handling privileged legal data for paying users would need, with the evidence for each score and a re-scoring procedure; read by the founder. |
| `20-ROADMAP.md` | 1,966 | 224 | Explanation | Five phases on a dependency spine, every item traced to a finding in 12, 13 or 19, with the expected maturity movement; read by whoever sequences work. Explicitly superseded by 26 where they disagree. |
| `21-UX-AUDIT.md` | 5,594 | 808 | Explanation | Twelve findings and two feature requests from a live browser pass plus a code read, each traced to a file and line, with a sequenced fix plan and a statement of what could not be verified; read by whoever fixes the interface. |
| `22-MOBILE-AND-PWA-PLAN.md` | 2,604 | 401 | How-to | Verdict first, then a thirteen-dimension parity audit, tiered build order with day estimates, a verification protocol and an honesty ledger; read by whoever decides whether to go native. |
| `23-CONNECTIVITY-AUDIT.md` | 1,867 | 256 | (untagged) | Every screen checked against the backend it claims to use, the three found showing invented data, the gate that could never be satisfied, and live measurements; the answer to one founder question, which is quoted verbatim at the top. |
| `24-SHARING-A-LOCAL-BUILD.md` | 2,098 | 312 | (untagged) | One symptom traced to its cause and its fix, on sharing a dev build through a tunnel; read by whoever needs to put the product in front of somebody else. |
| `25-MARKET-RESEARCH.md` | 2,549 | 315 | Explanation | The Indian legal-tech market from primary sources, the finding that reshaped the roadmap, price reality, regulatory posture, what would falsify it and what is not established; read by whoever decides what to build. |
| `26-PRODUCT-PLAN.md` | 1,689 | 183 | Explanation | Position, three defensible claims, what exists, MVP0/1/2, a pricing proposal, a never-build list and a falsification test, derived from 25 and deliberately not re-citing it; read by the founder. |
| `27-AI-LAYER.md` | 1,363 | 201 | Reference | The five-provider LLM chain, endpoints, live key status, two traps found by measurement, the orchestration policy and how to add a provider, carrying a standing instruction not to describe the product as having AI; read by whoever wires it. |
| `28-COMPLIANCE-AND-LEGAL.md` | 1,249 | 192 | Reference | Bar Council and statutory constraints with citations, a register of what they forbid, and what the owner has deferred; read before adding a feature, a price or a marketing page. |
| `29-RUNBOOK.md` | 1,094 | 181 | How-to | The shape of a running system, a symptom-to-cause table where every entry was observed at least once, the checks, database operations, secrets and escalation; read at three in the morning. |
| `30-DOCUMENTATION-PRACTICE.md` | 1,123 | 154 | Explanation | What actually keeps documentation current, tiered by evidence strength, what is theatre with the receipts, and what this repository does with the finding; the meta file, read by whoever maintains the pack. |
| `31-OPEN-DECISIONS.md` | 2,284 | 252 | Explanation | Six things deliberately not fixed because each is a decision rather than a defect, each with options, real costs and a recommendation; read by the owner, who is the only person who can close them. |
| `32-MARKET-RESEARCH-UPDATE-2026-09-10.md` | 2,250 | 264 | Explanation | A dated delta against 25 written two days later, with what changed, five competitors 25 did not contain, what still cannot be desk-researched and when to re-measure; read alongside 25, never instead of it. |
| `CHANGELOG.md` | 1,878 | 231 | Reference | What changed across all three repositories, newest first, loosely Keep a Changelog, every entry naming its evidence and what was deliberately not done. |
| `adr/README.md` | 435 | 58 | (index) | The ADR index, the status vocabulary, the rule for writing new ones, and an honest note that all ten original records were reconstructed after the fact. |
| `adr/0001`..`0012` | 552 to 1,972 each | 106 to 257 each | Explanation | One architecturally significant decision each, in Nygard format. |
| `knowledge-graph/README.md` | 908 | 161 | (index) | What the graph is, the before-and-after node counts of the rebuild, the corpus, how it was built, how to query it, what it found on its own, and its caveats. |
| `knowledge-graph/GRAPH_REPORT.md` | 13,435 | 1,670 | Reference | The generated human-readable graph audit: god nodes, surprising connections, cohesion scores. The single largest file in the tree, and nobody is expected to read it front to back. |
| `sources/README.md` | 275 | 46 | (index) | What is in `sources/` and why it is committed: these are the inputs that had no second copy. |

### 1.2 Top-level headings, file by file

Verbatim `## ` lines. This is the part worth studying, because the heading set *is* the schema.

**`README.md`** — Provenance · Document freshness · How this documentation is organised · The map · The seven-line version · Conventions used throughout

**`00-EXECUTIVE-SUMMARY.md`** — What Advox is · The shape of the system · By the numbers · What works, and works well · The nine things that were wrong — and where each stands · Known open issues · Documentation that actively misleads · Things that are fine but should be known · What else changed since 2026-08-30 · What I would do, in order · Where to go next

**`01-PRODUCT-AND-DOMAIN.md`** — The user · The problem · What Advox does about it · The two import paths · The domain model, in the advocate's language · KYA — the onboarding gate · Feature inventory · Non-functional character · What the product is not · Sources

**`02-ARCHITECTURE.md`** — 1. Introduction and goals · 2. Constraints · 3. Context and scope — C4 Level 1 · 4. Solution strategy · 5. Building block view — C4 Level 2 and 3 · 6. Runtime view · 7. Deployment view · 8. Cross-cutting concepts · 9. Architecture decisions · 10. Quality requirements · 11. Risks and technical debt · 12. Glossary

**`03-DATA-MODEL.md`** — ⚠ Read this before anything else: the migration gap · Entity relationship diagram · Models · Referential integrity · Indexing · Connection configuration · Live production state

**`04-API-REFERENCE.md`** — Conventions · Endpoint summary · App-level routes · `/api/auth` · `/api/cases` 🔒 · `/api/ecourts` 🔒 · `/api/documents` 🔒 · `/api/clients` 🔒 — NEW · `/api/shares` 🔒 — NEW · `/api/drafts` 🔒 · `/api/notes` 🔒 · Endpoints the frontend expects and the backend does not have · Cross-cutting API observations

**`05-FRONTEND-SPEC.md`** — Stack · ⚠ The `.jsx` files are compiler output · Module reachability · Routing · State management · The Clients feature is now half a feature — **[fixed, partly]** · API client · Component layers · Hooks · Utilities · The PWA now starts — **[fixed]** · Styling · Demo mode · Build and CI

**`06-BACKEND-SPEC.md`** — Stack · Testing — the section that used to say "none" · Layout · Bootstrap — `index.js` · `protect` — the auth middleware · Authorisation — `utils/caseAccess.js` · Middleware · Utility modules · Controllers · Services · `syncWorker.js` — the queue · `ecourtsParser.js` — the riskiest file · The LLM provider layer — **not wired yet** · `seedCourts.js` · Manual scripts · Cross-cutting

**`07-INTEGRATIONS.md`** — 1. court-service · 2. Supabase Postgres · 3. Cloudflare R2 · 4. Google Identity · 5. Resend (email) · 6. WhatsApp Web · 7. Web Push · 8. LLM providers · Integration map · Configuration matrix

**`08-DESIGN-SYSTEM.md`** — Standing correction · What this stylesheet is · Colour · Typography · Layout and motion · Component conventions · Icons · Brand assets · Relationship to the sgnk design system · Working in this stylesheet

**`09-ENVIRONMENT-AND-CONFIG.md`** — The dangerous one · Backend — `advox-backend/.env` · LLM providers (optional) · Court service — `court-service/.env` · Frontend — `advox-frontend/.env` · Running the whole stack locally · Where each variable is set, per environment · Secret handling · Config anti-patterns still present · Verifying a configuration

**`10-LOCAL-SETUP.md`** — Before you start · 1. Clone · 2. Environment files · 3. Install · 4. Prisma client · 5. Know what booting does · 6. Run · 7. Verify · 8. Sign in · What will not work locally · Troubleshooting · Working agreements

**`11-DEPLOYMENT-AND-OPS.md`** — Topology · Backend · Frontend · Keep-alive · Database operations · Runtime behaviours to know · Monitoring — what exists · Runbooks · Cost · Before this can be called production-ready

**`12-SECURITY-REVIEW.md`** — Summary · CRITICAL · HIGH · MEDIUM · LOW · court-service · Fix order · What was not assessed

**`13-TECH-DEBT-REGISTER.md`** — Priority order · CRITICAL · HIGH · MEDIUM · LOW · New items — first recorded 2026-09-09 · Reading the shape of this list · Suggested sequencing

**`14-TESTING-STRATEGY.md`** — Current state · Why this matters more here than usual · What to build, in order · Layer 1 — eCourts parser fixtures · Layer 2 — Date and timezone units · Layer 3 — Auth and authorisation integration · Layer 4 — Sync worker concurrency · Layer 5 — API contract smoke tests · Layer 6 — Critical-path E2E · CI · Tooling · What not to do · Minimum viable

**`15-GLOSSARY.md`** — Legal and court domain · System terms · Documentation and method terms · Abbreviations · Sources

**`16-ECOSYSTEM.md`** — Repositories · Services · Environments · Domains · Access and ownership · Secrets inventory · Cost · The dependency that used to be unwritten · Team · Open questions · Maintaining this file

**`17-CODEMAP.md`** — Totals · Entry and infrastructure · Middleware · Routes — 8 routers, 60 endpoints · Controllers · Services · Workers, utilities, scripts · Tests — 16 suites, 1,620 lines · Config · Entry and routing · Pages — 18 · Live components — `components/common/` (25) · Live components — `components/features/dashboard/` (6) · Live components — `components/ui/` (5) · ❌ DEAD — 19 modules, 4,051 lines · State, services, utilities · Tests — 9 suites, 1,213 lines, 105 tests · Styling and assets · Build, config, CI · Reading the map · Related

**`18-TRACEABILITY.md`** — Master matrix · Reverse index: what depends on what · The eCourts path, end to end · Coverage gaps, by layer · Using this matrix

**`19-PRODUCT-MATURITY.md`** — Scorecard · 1. Product definition — **4/5** · 2. Feature completeness — **4/5** *(was 3)* · 3. Architecture — **4/5** · 4. Data & recoverability — **2/5** *(was 1)* · 5. Security — **3/5** *(was 2)* · 6. Reliability — **3/5** *(was 2)* · 7. Observability — **2/5** *(was 1)* · 8. Testing & QA — **2/5** *(was 0)* · 9. Design & UX — **4/5** *(unchanged)* · 10. Compliance & legal — **2/5** *(was 1)* · 11. Operability & team — **2/5** *(was 1)* · What the shape of this scorecard means · Re-scoring

**`20-ROADMAP.md`** — The dependency spine · Phase 0 — Stop the bleeding · Phase 1 — Make change safe · Phase 2 — Decide what is real · Phase 3 — Harden for real users · Phase 4 — Make it a business · Backlog · Expected maturity movement · What to do this week

**`21-UX-AUDIT.md`** — Method, and what this covers · Findings · Functional defects · Visual and interaction findings · Requested features · What is already good · Sequenced fix plan · What I could not verify · Turn-12 work (2026-08-30)

**`22-MOBILE-AND-PWA-PLAN.md`** — Verdict · The inversion worth knowing about · Parity audit — 13 dimensions · Tier 1 — install and shell · ~1 day · Tier 2 — browser tells · **already done** · Tier 3 — feel · optional, ~2 days · Tier 5 — trust and privacy · **recommended, not optional** · Mobile layout work — the real cost · Sequence · Verification protocol · Honesty ledger · Related

**`23-CONNECTIVITY-AUDIT.md`** — 1. The headline · 2. Route-level connectivity · 3. Screen-by-screen · 4. KYA could never be completed · 5. Live service checks · 6. Cold start · 7. Two latent bugs found while auditing · 8. What is not verified · 9. Test coverage added · 10. Open, needing a decision

**`24-SHARING-A-LOCAL-BUILD.md`** — What actually breaks, in order · The fix · Two different builds point at two different APIs · How to share it · Sharing the built bundle instead · Credentials · Verified

**`25-MARKET-RESEARCH.md`** — 1. The finding that changed the roadmap · 2. The incumbent, and the gap it leaves · 3. Price reality · 4. Regulatory posture — the constituency has a veto · 5. Market size and language · 6. The AI field in India, 2026 · 7. Competitive position — the 12 category blocks · 8. What would falsify this · 9. Not established · 10. Method and sources

**`26-PRODUCT-PLAN.md`** — 1. The position, in one paragraph · 2. Three defensible claims — everything else is commodity · 3. What exists today · 4. MVP0 — before launch · 5. MVP1 — next quarter · 6. MVP2 — the year · 7. Pricing — a proposal, not a finding · 8. Never build · 9. What would falsify this plan

**`27-AI-LAYER.md`** — 1. What exists · 2. The provider table · 3. How the endpoints were established · 4. Live status of the configured keys · 5. Two traps, both found by measurement · 6. The orchestration policy · 7. What to use it for, and what never to · 8. Adding a provider · 9. Where the keys live

**`28-COMPLIANCE-AND-LEGAL.md`** — 1. Bar Council of India — the hard prohibitions · 2. Data protection · 3. GST — why an absent GSTIN is a normal state · 4. Language and script · 5. Filing format · 6. Messaging · 7. Register of what this forbids · 8. Deferred by owner

**`29-RUNBOOK.md`** — 1. The shape of a running system · 2. Symptom → cause table · 3. Running the checks · 4. Database operations · 5. Secrets · 6. Escalation

**`30-DOCUMENTATION-PRACTICE.md`** — The headline finding · The finding that changes how we treat ADRs · What is theatre — with evidence · What this repo does with the finding · Sources

**`31-OPEN-DECISIONS.md`** — 1. D-01 — the catch-up migration that auto-applies on deploy · 2. Live end-to-end verification — the part tests cannot reach · 3. `strictUndefinedChecks` — closing the filter-drop class structurally · 4. One secret still signs two token types · 5. TD-16 — the deliberately-local day comparison · 6. `sgnk` has never been merged · What is already closed

**`32-MARKET-RESEARCH-UPDATE-2026-09-10.md`** — The headline · 1. The single most important finding · 2. The scraper is now a purchasable commodity · 3. Adalat AI is now on the core surface, for litigants · 4. e-filing has already passed the DPR's own assumption · 5. Five competitors doc 25 does not contain · 6. What is still not established, and cannot be desk-researched · 7. What this changes · 8. Re-measure these, and when

**`CHANGELOG.md`** — one `## ` per dated entry: 2026-09-09 — Re-measured every number the documentation quotes · 2026-09-08 — Documentation, and the AI provider layer · 2026-09-06 — Audit, hardening, migrations, market research · 2026-08-30 / 31 — The documentation set

Three patterns are visible in that list and all three are worth stealing.

1. **Headings carry their own verdict.** `## 7. Observability — **2/5** *(was 1)*`. `## The LLM provider layer — **not wired yet**`. `## ❌ DEAD — 19 modules, 4,051 lines`. You can read the table of contents and know the state of the system without opening a section. Most documentation headings are nouns; these are claims.
2. **Every judgement document ends with its own limits.** `## What was not assessed`, `## What I could not verify`, `## Not established`, `## What is not verified`, `## Honesty ledger`, `## What would falsify this`. Six different files, same move.
3. **Several files carry a section about themselves.** `## Maintaining this file`, `## Re-scoring`, `## Reading the map`, `## Using this matrix`, `## Working in this stylesheet`. The document tells you how to keep it alive.

---

## Part 2. The conventions

### 2.1 Front matter: there is none

**No file in the pack carries YAML front matter.** Verified by testing whether `head -1` equals `---`
for every `.md` in the tree; zero matches. There is therefore **no key set to report**, and that is the
most important single finding in this section for the frontmatter build.

What replaces it is a **prose header block**, in three parts, in a fixed order:

```
# 18 — Traceability Matrix

*Diátaxis mode: **Reference**. Every feature traced from the screen to the byte.*

> **Re-verified 2026-09-08** against frontend `da9dc4d`, backend `9fcc5ac`,
> court-service `b64c18f`. The previous version described frontend `8cc209a` /
> backend `fb79b66` (2026-08-30). Eight rows changed status and eight rows are
> new. Cross-references to other documents point at whatever verification banner
> *those* documents carry — see
> [README § Document freshness](README.md#document-freshness).
```

Line 1 is `# NN — Title`. Line 3 is the Diátaxis tag plus a one-clause scope. Then an optional
blockquote banner naming the commits the document was verified against and what moved since.

The later files (25 to 32) use a denser variant with explicit labelled fields inside the blockquote:

```
> **Diátaxis mode:** Explanation.
> **Audience:** whoever decides what Advox builds next.
> **Research window:** 2026-09-06, extended 2026-09-08.
> **Status of every figure below:** each carries its source inline.
```

and for 26:

```
> **Derived from:** [`25-MARKET-RESEARCH.md`](25-MARKET-RESEARCH.md). Every claim
> here is sourced there; this document does not re-cite.
> **Supersedes:** [`20-ROADMAP.md`](20-ROADMAP.md) where the two disagree.
> **Written:** 2026-09-06. **Reviewed:** 2026-09-08.
```

So the *fields exist*: mode, audience, window, status, derived-from, supersedes, written, reviewed,
verified-against. They are simply expressed as bold prose labels rather than as parseable keys. If you
collected the labels used across the pack the full set is roughly:

`Diátaxis mode` · `Scope` · `Audience` · `Status` · `Written` · `Reviewed` · `Researched` ·
`Research window` · `Revision` · `Currency` · `Re-verified` / `Re-scored` · `Derived from` ·
`Supersedes` · `Complements` · `Related` · `Method` · `Why this is in the repo` ·
`Status of every figure below` · `Question asked` · `Date`

There is exactly one machine-readable marker in the whole pack:

```html
<!-- docs-verified-against: 4ad10b2 -->
```

`30-DOCUMENTATION-PRACTICE.md` says this is read by `sgnk-docs-gate.sh`. It appears in **two files
only**: `README.md:255` and, as a description of itself, inside `30-DOCUMENTATION-PRACTICE.md:127`.
So 33 of 35 top-level files have nothing a script can check. The pack's own freshness table admits
this: it was rebuilt by "reading the first 25 lines of every numbered document", by hand, and the
previous version of that table had drifted out of agreement with the banners it summarised.

**Verdict for frontmatter: this is the gap to close first.** Everything else in the pack is excellent
and portable; the absence of front matter is the one thing that makes it un-automatable and therefore
un-portable across tools. An agent on another account cannot compute the freshness table, cannot find
every stale file, and cannot validate a cross-reference, because there is nothing to parse.

### 2.2 Cross-referencing

Four mechanisms, used consistently.

**Relative Markdown links with anchors.** The dominant form:

- `[TD-20](13-TECH-DEBT-REGISTER.md#td-20)`
- `[SEC-06](12-SECURITY-REVIEW.md#sec-06)`
- `[README § Document freshness](README.md#document-freshness)`
- `[ADR-0007](adr/0007-documentation-lives-in-the-frontend-repo.md)`
- from inside `adr/`, one level up: `[SEC-01](../12-SECURITY-REVIEW.md#sec-01)`

Counts per file, measured with `grep -ohE '\]\([0-9A-Za-z._/-]+\.md(#[a-z0-9-]+)?\)'`:

| File | Links | File | Links | File | Links |
|---|---|---|---|---|---|
| `README.md` | 40 | `20-ROADMAP.md` | 59 | `02-ARCHITECTURE.md` | 32 |
| `04-API-REFERENCE.md` | 31 | `14-TESTING-STRATEGY.md` | 30 | `17-CODEMAP.md` | 30 |
| `06-BACKEND-SPEC.md` | 23 | `13-TECH-DEBT-REGISTER.md` | 20 | `03-DATA-MODEL.md` | 19 |
| `05-FRONTEND-SPEC.md` | 19 | `18-TRACEABILITY.md` | 19 | `00-EXECUTIVE-SUMMARY.md` | 18 |
| `07-INTEGRATIONS.md` | 18 | `11-DEPLOYMENT-AND-OPS.md` | 18 | `22-MOBILE-AND-PWA-PLAN.md` | 14 |
| `21-UX-AUDIT.md` | 12 | `09-ENVIRONMENT-AND-CONFIG.md` | 11 | `16-ECOSYSTEM.md` | 10 |
| `15-GLOSSARY.md` | 9 | `19-PRODUCT-MATURITY.md` | 8 | `01-PRODUCT-AND-DOMAIN.md` | 6 |
| `26-PRODUCT-PLAN.md` | 6 | `08-DESIGN-SYSTEM.md` | 5 | `25-MARKET-RESEARCH.md` | 5 |
| `12-SECURITY-REVIEW.md` | 4 | `10-LOCAL-SETUP.md` | 3 | `24-SHARING-A-LOCAL-BUILD.md` | 3 |
| `29-RUNBOOK.md` | 3 | `32-MARKET-RESEARCH-UPDATE` | 3 | `CHANGELOG.md` | 3 |
| `27-AI-LAYER.md` | 2 | `23-CONNECTIVITY-AUDIT.md` | 0 | `30-DOCUMENTATION-PRACTICE.md` | 0 |
| `31-OPEN-DECISIONS.md` | 0 | | | | |

The three zeroes are informative. `23` and `31` are dated snapshots of a moment, and `30` is the meta
file. The pack does not force linking where linking would be false precision.

**`file.ext:NNN` citations into source.** 256 of them. The README states the rule outright:

> `file.js:42` means line 42 of that file, relative to its repo root.

Forms actually observed: full path from repo root (`advox-backend/prisma/schema.prisma:165`), bare
filename where the file is unambiguous (`authController.js:296`), ranges (`AppShell.jsx:44-48`), and
a bare continuation colon inside a sentence (`and :689`). All are inside backticks.

**Named supersession.** `26-PRODUCT-PLAN.md` says **Supersedes `20-ROADMAP.md` where they disagree**;
`18-TRACEABILITY.md` F42 says Clients "supersedes ADR-0008"; `adr/README.md` says the rule is
"never renumber, never delete — supersede instead, and name the successor in the old record's status
line." Conflict is resolved by an explicit pointer, never by editing the older document.

**Deferral by pointer.** `README.md` records that `11-DEPLOYMENT-AND-OPS.md` is "the deferral target
for both satellite doc sets" and that its staleness therefore propagates into another repository. The
pack tracks not just its links but the *blast radius* of a stale link.

### 2.3 Stable identifiers

Six families, all in use, all with anchors. Measured with `grep -rhoE ... | sort -u | wc -l`:

| Prefix | Format | Unique in use | Total mentions | Defined in | Definition form |
|---|---|---|---|---|---|
| `F` | `F01`..`F55`, plus `F17b`, `F20b` for late insertions | **57** | 80 | `18-TRACEABILITY.md` | a row in the master matrix |
| `TD-` | `TD-01`..`TD-40` | **40** | **409** | `13-TECH-DEBT-REGISTER.md` | `### TD-05` |
| `SEC-` | `SEC-01`..`SEC-18` | **18** | **206** | `12-SECURITY-REVIEW.md` | `### SEC-01 — Hardcoded JWT fallback secret` |
| `ADR-` | `ADR-0001`..`ADR-0012`, four digits | **12** | 87 | `adr/NNNN-slug.md` | `# ADR-0005 — Stateless JWT stored in localStorage` |
| `UX-` | `UX-01`..`UX-12` | **12** | 44 | `21-UX-AUDIT.md` | `### UX-01` |
| `D-` | `D-00`..`D-05` | **6** | 25 | `31-OPEN-DECISIONS.md` | in the section heading, e.g. `## 1. D-01 — the catch-up migration...` |

Four properties make this scheme work, and each is a decision worth copying.

**Zero-padded and fixed-width.** `TD-05`, not `TD-5`. `ADR-0012`, not `ADR-12`. Sorts correctly,
greps unambiguously, and `TD-1` never matches inside `TD-16`.

**The suffix letter for insertion.** `F17b` and `F20b` are features discovered after `F18` and `F21`
were assigned. They did not renumber 38 rows. This is a small thing that saves an enormous amount of
churn, and it is the same discipline as never renumbering an ADR.

**Anchors fall out of the heading.** `### TD-05` yields `#td-05` in GitHub's anchor algorithm, so
`13-TECH-DEBT-REGISTER.md#td-05` works with no manual anchor tag. `### SEC-01 — Hardcoded JWT fallback
secret` yields `#sec-01---hardcoded-jwt-fallback-secret`, which is why the pack writes the link as
`#sec-01` and it still resolves in most renderers. **This is fragile.** A titled heading's anchor
includes the title, so renaming the finding breaks every inbound link. The safe form is the bare
`### TD-05` used in doc 13, with the title on the next line.

**The id is the unit of cross-document conversation.** 409 mentions of 40 TD ids means each debt item
is referenced ten times on average, from the roadmap, the traceability matrix, the executive summary,
the security review and the graph report. The register is not a list; it is an index that the rest of
the pack points into. That density is what makes the pack feel like a system rather than a folder.

An entry's shape, verbatim from `13-TECH-DEBT-REGISTER.md`:

```markdown
### TD-05
**Email links hardcoded to localhost** · `S` — **RESOLVED 2026-09-09**

`authController.js:296` — `http://localhost:${process.env.PORT || 5001}/api/auth/confirm-email?token=...`.
In production the confirmation email arrives with a dead link, so email changes
can never complete. **Fix:** an `APP_BASE_URL` variable.

> Fixed, though not with the variable name proposed. Both call sites
> (`authController.js:334` and `:689`) now build the URL from `publicApiUrl()`
> in `src/utils/verification.js` ... Note the origin variable is not declared in
> `render.yaml` — see [TD-20](#td-20).
```

Five parts: the bare id heading, a one-line title plus effort size plus status, the evidence with a
`file:line`, the proposed fix, and a later blockquote resolution note that **corrects the original
proposal rather than rewriting it**. The original wrong suggestion is left standing. That is the same
principle as the ADR supersession rule, applied at item level.

The effort key is stated once at the top of the file: `S` under 2 hours, `M` half a day to two days,
`L` a week or more.

### 2.4 The traceability scheme

`18-TRACEABILITY.md` is the keystone, and it is only 3,779 words. It works in three parts.

**The master matrix**, one row per feature, nine columns plus a status:

```
| # | Feature | Route | Page | API client | Endpoint(s) | Controller | Model(s) | Storage | Status |
```

A real row:

```
| F23 | Upload document | `/cases/:caseId` | `common/DocumentDrawer.jsx` | `api.documents.upload` |
`POST /api/documents/case/:caseId` | `documentController.uploadDocument` | `Document` | PG + **R2** |
⚠ [SEC-11](12-SECURITY-REVIEW.md#sec-11) extension-only |
```

So the chain is **screen → route → page component → API client method → HTTP endpoint → controller
function → data model → storage system**, and the Status column carries either a tick, or a warning
glyph plus a link into the security review or the debt register that explains the caveat. Every layer
of the stack is named by its real identifier, so the row is greppable end to end.

The status vocabulary is small: `✅`, `⚠`, `❌`, each optionally followed by a date, a commit, or a
linked id. Rows that changed are bolded in the Feature column.

**The count is stated as a fraction with its rule.** "52 of 57 rows are real, counted by the same rule
the first pass used — a row is *not real* when nothing in the API or the database stands behind it.
The denominator grew because ten rows were added, not because the bar moved." That last clause is the
part almost nobody writes, and it is what stops a metric from being gamed across revisions.

**A separate honesty table for the gap.** Below the matrix, a five-row table headed "What is left that
a user can see but the system does not fully back", with columns *Row · What a user sees · What is
actually there*. F43: "A watch list" versus "`localStorage`, and the screen says so." This is the
shell-feature register, and it is the thing that stops a demo lying.

**The reverse index**, headed "Reverse index: what depends on what", with subsections such as "If you
change a database model". Same data, read right to left, so the matrix answers both "where does this
feature live" and "what breaks if I touch this table".

**One worked path in full.** "The eCourts path, end to end" walks the single most important flow
through every layer as prose, because a matrix row cannot convey sequencing.

**Coverage gaps, by layer.** Where the matrix is thin, said out loud.

**A section on using it.** "Read left to right to answer *where does this feature live?* Read right to
left to answer *what depends on this table / endpoint / file?*"

Two things this scheme does **not** do, and they matter for frontmatter. It does not link a feature to
a **test**, so there is no row that says F23 is covered by a named test case. And it does not link a
feature to an **acceptance criterion**, because none exist anywhere in the pack. The chain runs from
screen to storage but never from requirement to proof.

### 2.5 How the README routes a reader

The routing is a set of **task-named groups**, not a flat contents list, and the group names are the
whole trick. Quoted verbatim:

> Read in this order on a first pass. Numbers are stable; the file names are the navigation.
>
> ### Start here
> ### Understand the system
> ### Run and operate it
> ### Judge it
> ### Map it
> ### Steer it
> ### Fix it
> ### Look things up
> ### For agents

Each group is a table with the columns `# | Document | Mode | What it gives you`, where the last
column is a promise rather than a description. Three examples, verbatim:

> | 00 | [Executive Summary](00-EXECUTIVE-SUMMARY.md) | Explanation | The whole system in ten minutes, and the seven things that are actually wrong |

> | 18 | [Traceability Matrix](18-TRACEABILITY.md) | Reference | 47 features traced screen → route → endpoint → controller → model → storage, plus a reverse index |

> | 27 | [The AI Layer](27-AI-LAYER.md) | Reference | The five-provider LLM chain, its endpoints, live key status, and two traps found by measuring. **Built, tested, and imported by nothing** |

Note what the README does around that map.

**It states the reading order and then decouples it from the numbering.** "Numbers are stable; the
file names are the navigation." The groups are in a different order from the numbers, and 30 appears
after 31 in the Steer-it table, because reading order and filing order are different problems.

**It carries a provenance table before the map**, with fields Analysis date, Counts re-measured,
per-repository commit analysed, Method, Analyst. The Method field states what was *not* done: "Not
done in this pass: production database probe, live boot of either service, and any call requiring a
credential — no `.env` was read".

**It carries a freshness table that admits its own drift**, and states the precedence rule: "That
banner is the authority... Where the two disagree, the banner wins — and this table being the copy
that drifted is exactly the *'a fact with two homes'* failure the set warns about elsewhere."

**It carries a ground-truth counts block** headed "Ground truth for the counts that most often go
stale", a table of `Metric | 2026-08-30 | 2026-09-09 | How it was measured`, where the last column is
the literal command, for example `grep -c '^model ' prisma/schema.prisma`. The rule above it: "If a
document disagrees with this block, this block is the newer measurement." This is the single most
useful anti-drift device in the pack, and it costs one table.

**It states the method stack** in a section headed "How this documentation is organised": arc42 for
the architecture skeleton, Diátaxis for the reader skeleton with its four-mode table, C4 levels 1 to 3
as Mermaid "so they diff as text", and Nygard ADRs.

**It ends with a seven-line version and a conventions block.** The conventions block defines
`file.js:42`, the repo-root shorthand, **Verified** versus **Unverified**, and the shared severity
vocabulary across documents 12 and 13.

**And it routes agents separately**, in a group headed "For agents", pointing at `../AGENTS.md`,
`../MEMORY.md`, `../CONTRIBUTING.md` and `knowledge-graph/`, with the instruction "Query it instead of
grepping."

### 2.6 What `30-DOCUMENTATION-PRACTICE.md` states, rule by rule

This is the meta file and it is the shortest substantive document in the pack: 1,123 words, 154 lines.
It is not a style guide. It is an evidence review of whether documentation practices work at all, with
every claim sourced to a primary document the author opened. Here is every rule it states.

**The headline rule.** Exactly one class of mechanism has strong evidence of working: make the
documentation executable or generated, so that drift becomes a build failure. Everything else is
either practised at scale with no published accuracy outcome, or catches one narrow class of error.

**Tier 1, mechanisms that fail a build on drift:**

1. **Generate, then `git diff --exit-code`.** Quoted from HashiCorp's provider scaffolding:
   `git diff --compact-summary --exit-code || (echo "Unexpected difference after code generation. Run 'make generate' and commit."; exit 1)`. Kubernetes runs 60-plus `hack/verify-*.sh` on the same
   principle and `make verify` is a stated merge prerequisite. Stripe regenerates its OpenAPI every
   release. The file's verdict: "This is the only technique with no serious failure mode: the document
   cannot be stale, because it is derived."
2. **Executable examples.** Go's blog, quoted: "Having executable documentation for a package
   guarantees that the information will not go out of date as the API changes." Rust runs doctests in
   `cargo test` by default; the Rust Book runs `mdbook test` in CI; Python has `doctest` and
   `pytest --doctest-glob` for prose files.
3. **Toolchain consistency lints.** `javadoc -Xdoclint` is on by default and checks `@param` and
   `@throws` against the real signature; `rustdoc::broken_intra_doc_links` warns by default;
   `sphinx-build -n -W`.

**Tier 2, practised at scale with adoption measured but accuracy never:**

4. **Docs change in the same commit as the code.** Google's docguide, quoted: "Change your
   documentation in the same CL as the code change." GitLab puts "Documented in the `/doc` directory"
   in its Definition of Done. Supporting measurement: of about 700,000 review comments across 2,000
   projects, 9.3 per cent were documentation-related (arXiv:2204.00107). Google's own verdict is
   quoted against itself: "a practice for which we're still trying to improve adoption", and
   "documentation at Google is not yet a first-class citizen."
5. **Owner plus review-by date.** Google attaches `freshness: { owner: … reviewed: … }` with
   three-monthly email reminders; Microsoft requires `ms.date` and `ms.author`. The rule as stated:
   "the only published outcome is increased adoption of the practice — never measured accuracy. Worth
   doing; not worth believing in."

**What rots, with numbers** (a table): links in source comments, about 10 per cent dead (Hata et al.,
ICSE 2019, arXiv:1901.07440); links in commit messages, 70 per cent of distinct links decay
(arXiv:2305.16591); wiki docs at Google's GooWiki deprecation, about 90 per cent had no views or
updates in the previous few months (*Software Engineering at Google*, ch. 10).

**The rule about ADRs, which the file calls a category error.** Decision records are not supposed to
stay current. Google's docguide, quoted: "once the code is implemented, design docs should serve as
archives of these decisions, not as half-correct docs (they are often misused)." PEP 1, quoted: "Once
resolution is reached, a PEP is considered a historical document rather than a living specification.
Formal documentation of the expected behavior should be maintained elsewhere." The stated rule:
"Applying freshness review to an ADR is a category error, not diligence. Give it a lifecycle status
instead." Which is what PEP `Status:` and Kubernetes `kep.yaml` `status:`/`replaces:` do, and what
this repository does by superseding ADR-0008 with ADR-0011 rather than editing it.

**What is theatre, with the receipt for each:**

6. **Structure gates get switched off.** Kubernetes wrote `hack/verify-toc-vs-template.sh` and it
   ships with `# TODO(soltysh): for now this should not fail, but print problems` followed by
   `exit 0`.
7. **Nobody hard-blocks merges on general documentation.** A deliberate search found no widely adopted
   docs-required CI gate. Kubernetes blocks only on release notes and on generated-artifact drift.
8. **The recommended link-checking config is deliberately non-blocking.** lychee-action's flagship
   example sets `fail: false` and files an issue on a nightly cron.
9. **Danger.js's canonical rule is `warn()`, not `fail()`.**
10. **Prose linters cannot detect staleness.** Vale has 90 public adopters including GitLab, where it
    is a required check, "but a perfectly Vale-clean document can be entirely wrong. It checks
    *wording*, never *truth*."

**The honest dissent**, quoted in full including the clause usually dropped: "Working software over
comprehensive documentation … That is, while there is value in the items on the right, we value the
items on the left more."

**What this repository does with each finding** (a two-column table):

| Finding | What they do |
|---|---|
| Generated plus diff-verified is the only strong mechanism | `openapi.yaml` is generated and validated; `npm run spec:validate` exists. **Not yet wired to CI** |
| Executable docs beat prose | Test names state what breaks in the product; the suite is the live contract |
| ADRs are archives | ADR-0008 superseded by 0011, original text intact |
| Freshness dates are weak but cheap | `<!-- docs-verified-against: <sha> -->`, read by `sgnk-docs-gate.sh` |
| Link rot is real and measured | Link check run over every doc set in this pass; 0 broken |
| Structure gates get ignored if noisy | The gate treats satellite doc sets differently so it stops demanding a "Frontend spec" from a scraper |

**And it states its own gap, unprompted:** "this project has the Tier-2 machinery (owner, marker,
gate) and not the Tier-1 machinery (CI that fails on drift). CI currently runs *nothing* ... Until
`npm run check` and `spec:validate` run in CI, every guarantee here depends on someone remembering."

The file closes with a `## Sources` paragraph listing about 40 primary sources, each of which the
author records opening directly, and one of which carries a re-verify instruction: "spec.openapis.org
(**3.2.0, 19 Sep 2025** — re-verify, this ages fastest)".

**The one-line takeaway for frontmatter.** The most valuable file in the advox pack is the one that
tells you most of documentation practice is theatre and that the only durable mechanism is generation
plus a diff gate. frontmatter should read that conclusion as a build instruction: the parts of the
pack that can be generated from the code must be generated, and the parts that cannot must be small,
dated, and owned.

### 2.7 `adr/`

Twelve records plus a README, 10,941 words total, numbered `0001` to `0012` with a four-digit
zero-padded number and a kebab-case slug: `0005-jwt-in-localstorage.md`,
`0012-llm-provider-chain-without-an-sdk.md`. The filename states the decision, not the topic.

The template is **Nygard**: title, status, context, decision, consequences. In practice the records
extend it. The exact headings of `adr/0005-jwt-in-localstorage.md`:

```
# ADR-0005 — Stateless JWT stored in `localStorage`
## Context
## Decision
## Consequences
### Positive
### Negative
## Assessment
## Improvements, cheapest first
## When to revisit
```

And of `adr/0011-client-directory-is-a-table.md`, the longest:

```
# ADR-0011 — The client directory is a table, not a browser key
## Context
## Decision
## Consequences
### Positive
### Negative — what this did not fix
## What was deliberately not done
## Follow-ups
## Status of the migration in production
```

So the fixed core is Context / Decision / Consequences split into Positive and Negative, and the
extensions that recur are **What was deliberately not done**, **When to revisit**, **Follow-ups**, and
a status-in-production section.

Below the H1, two metadata lines, bold-labelled, `·`-separated:

```
**Status:** Accepted (problematic) · reconstructed 2026-08-30
**Related:** [SEC-01](../12-SECURITY-REVIEW.md#sec-01), [SEC-12](../12-SECURITY-REVIEW.md#sec-12), [ADR-0010](0010-make-jwt-secret-mandatory.md)
```

and for the one record written before its subject was built:

```
**Status:** Accepted · decided 2026-09-06 · **not yet in use — see [Reachability](#reachability)**
```

The status vocabulary is defined once in `adr/README.md`: **Accepted** (in force, working as
intended), **Accepted (problematic)** (in force, but with consequences that need addressing),
**Superseded** (replaced, the replacement is named), **Proposed** (recommended, not yet decided).

Three rules are stated in `adr/README.md` and all three are worth copying verbatim.

**The provenance confession.** "No ADRs were written while these decisions were being made. The ten
below were *reconstructed* from the code, the schema, the deployment configuration and the commit
history." And then the reading instruction that follows from it: the Decision and Consequences
sections describe what the code demonstrably does and are verified; the Context sections are a
reconstruction of reasoning, and "where a rationale is inferred rather than recorded, the ADR says so."

**The correction invitation.** "Anyone who was in the room should correct these. A wrong ADR that gets
corrected is more useful than no ADR at all — but it must be correctable, which is why the inference
is flagged rather than smoothed over."

**The writing rule.** "Number sequentially, never renumber, never delete — supersede instead, and name
the successor in the old record's status line. Write the ADR **when the decision is made**, not
afterwards ... reconstruction, as this batch demonstrates, is lossy."

ADR-0012 opens by applying that rule to itself: "This is the first record in this set written *before*
the thing it describes is wired to anything. That is deliberate."

### 2.8 `knowledge-graph/`

Six artefacts plus an 89-file `wiki/`. Generated with **graphify** (`github.com/safishamsi/graphify`),
built 2026-08-30 and rebuilt 2026-09-09 with `graphify update .`.

| File | What it is |
|---|---|
| `graph.json` | The graph itself |
| `GRAPH_REPORT.md` | 13,435-word generated audit: god nodes, surprising connections, cohesion scores |
| `community-labels.json` | Community id to plain-language name |
| `manifest.json` | File inventory plus hashes, for incremental rebuilds |
| `cost.json` | Token cost of each build |
| `graph.html` | Interactive viewer |
| `wiki/` | 89 LLM-generated articles, 15,416 words |
| `README.md` | Index, rebuild deltas, corpus, method, query examples, caveats |

**The format** is NetworkX node-link JSON. Top-level keys, read with `python3 -c`:
`directed` (false), `multigraph` (false), `graph`, `nodes` (**4,600**), `links` (**6,367**),
`hyperedges` (**21**).

A node, verbatim:

```json
{
  "label": "tailwind.config.js",
  "file_type": "code",
  "source_file": "frontend/tailwind.config.js",
  "source_location": "L1",
  "id": "frontend_tailwind_config_js",
  "community": 337,
  "norm_label": "tailwind.config.js"
}
```

A hyperedge, verbatim, and this is the interesting shape:

```json
{
  "id": "ecourts_cnr_sync_pipeline",
  "label": "E-Courts CNR Search, Sync and Order-Download Pipeline",
  "nodes": ["ecourtsroutes_search", "ecourtsroutes_downloadorder",
            "casecontroller_synccaseintransaction", "...", "agents_court_service_scraper"],
  "relation": "participate_in",
  "confidence": "EXTRACTED",
  "confidence_score": 1.0,
  "source_file": "backend/src/routes/ecourtsRoutes.js"
}
```

**How it was generated:** two passes, merged. An **AST extraction**, deterministic with no model, that
produced 542 nodes and 1,580 edges from 114 code files (functions, classes, imports, call edges). Then
a **semantic extraction**, 7 parallel agents over 150 files, producing 544 nodes, 999 edges and 21
hyperedges covering concepts, architectural decisions, findings, and relationships AST cannot see
(shared data, design intent, cross-repo duplication). Cost recorded: 1,259,427 tokens. The 2026-09-09
rebuild extracted 420 files, 379 uncached, 8 workers.

**Every edge carries a provenance tag:** `EXTRACTED` (explicit in source), `INFERRED` (reasonable
deduction), `AMBIGUOUS` (uncertain, flagged not hidden), plus a numeric `confidence_score`. The README
states the rule: "Nothing is asserted without a provenance marker", and the caveat: "`INFERRED` and
`AMBIGUOUS` edges are model judgements, not facts. The tag is there so you can filter on it — do so
before relying on an edge."

**Why it exists**, stated in one line: "so an agent arriving cold can query the system's structure
instead of reading 46,000 lines to find one relationship." The README gives four query examples
including `graphify query "what depends on court-service?" --graph graph.json --dfs` and
`graphify path "protect (JWT Bearer Guard)" "Cloudflare R2 Object Storage"`.

**The independent-corroboration section is the part I would not have predicted.** Headed "What the
graph found on its own", it lists hyperedges the extraction produced that name defects found
separately by reading code: "Server-local-time assumptions that break on a UTC host" grouped four
functions and turned out to be TD-16, and it independently pulled in `deduplicate.js`, which is the
evidence the bug had already happened. "Controls That Fail Silently and Report Success" grouped
SEC-01, TD-12 and TD-20 into one failure class. "Unfinished Next.js-to-Vite Migration Cluster"
connected ADR-0001 to the dead code, the stranded PWA, the mock watchlist and the half-wired demo
mode, "confirming they are one event rather than four."

**The honest rot disclosure.** The `wiki/` and `community-labels.json` were LLM-generated and
`graphify update` does not regenerate them, "so a wiki article may describe a structure the graph no
longer has." The README states this and the top-level README repeats it: "**The 89-article `wiki/` was
NOT regenerated** — it is still 2026-08-30". 89 files, 15,416 words, knowingly stale. That is the
largest single liability in the pack and the pack labels it rather than deleting it.

### 2.9 `sources/`

Small, and the most quietly important folder in the tree. Its README opens:

> # Sources — the inputs that had no second copy
>
> Everything here lived **only in a temporary session scratchpad** until 2026-09-09 and would have
> been deleted with it. It is committed because it is the input to artifacts people are already
> reading.

Three things are in it.

**`pdf/`** holds the HTML that generates the delivered PDFs plus the renderer: `advox-market-v5.html`,
`advox-product-plan.html`, `advox-test-plan.html`, `topdf.mjs`. A table maps each source to the PDF it
generates, and the invocation is given. The README notes that `topdf.mjs`'s header documents four
traps, "chief among them that it **deletes the output first**, because polling for `%%EOF` on a path
still holding the previous PDF 'succeeds' in a quarter of a second and hands back the *old* document."
The rendered PDFs are explicitly not in git: "these are the sources."

**`primary/`** holds extracted text of the primary legal and government sources cited in docs 25 and 28:
`act.txt`, `dpdp.txt`, `pib.txt`, `spdi.txt`, `spdi2.txt`, `research-notes-v5.md`. The reason is
stated: "the research cites them by line and a reader should be able to check a quotation without
re-fetching a government site that may have moved." And what is deliberately absent is named with its
size and the reason: "**Not here:** the 141-page eCourts Phase III DPR (10 MB). Re-fetch it with
`curl` if needed."

**`e2e.sh`** is the end-to-end smoke script used through the public tunnel.

The principle generalises cleanly: **the pack commits the generator and the source for every artefact
it hands someone, and names what it deliberately did not commit and why.**

### 2.10 The agent-facing siblings

Not in `docs/` but routed from it, in the repository root, and they are the part that makes the pack
portable across tools and accounts.

- **`AGENTS.md`** (13,086 bytes). "Onboarding contract for AI agents and new developers. **Last
  verified: 2026-09-10, commit `8ca81cc`.**" Sections: Read before you touch anything · Stack · Run it
  · State and storage · Things that look real and are not · Design system rules · Backend contract ·
  Hard rules · Where to look · The five findings that change what you do · Keeping this file honest.
  It opens by disowning its own predecessor: "This file replaces an earlier version that contained
  several factual errors — it claimed react-router was not used, pointed at a dead API client,
  described a palette that does not exist, and linked to another developer's home directory."
- **`MEMORY.md`** (10,798 bytes). "Durable facts worth carrying between sessions." Sections: STATUS AS
  OF ... read this before the rest · Identity · **Facts that are expensive to rediscover** (eight
  named sub-facts) · Facts that will save an argument · Things that are genuinely good · Verified
  numbers · Working agreements · Where the work is · Open questions · If you only do one thing.
- **`CONTRIBUTING.md`** (8,146 bytes). Sections: The five things that will trip you up · Hard rules
  (Never run DDL against the shared database · Never commit a `.env` · Never add a second system ·
  Never fail silently) · Making a change, split into Before / While / After · Pull requests with a
  three-field body (What / Why / How verified) · Docs · Documentation · Rebuilding the knowledge graph
  · Branches · Getting help.
- **`HANDOFF-advox-2026-09-09-account-switch.md`** (17,240 bytes). The cross-account handover.

The division is clean and worth copying exactly: `AGENTS.md` is the **contract** (what you must not
do), `MEMORY.md` is the **expensive facts** (what you would waste a day rediscovering),
`CONTRIBUTING.md` is the **procedure** (how a change moves), `docs/` is the **corpus**, and the
HANDOFF is the **session bridge**.

---

## Part 3. What is missing

The pack is the best internal documentation set I have read in this workspace, and it is an *audit* of
an existing system rather than a *specification* for one to be built. That distinction generates most
of the gaps below. Somebody handed this pack and told to build the product from scratch could not do
it.

**1. There is no screen-by-screen specification.** This is the largest gap. `05-FRONTEND-SPEC.md`
gives a route table with columns `Path | Page | Loading | Layout | Notes`, and
`23-CONNECTIVITY-AUDIT.md` gives a twelve-row `Screen | Data source | Verdict` table. Neither gives,
per screen: its purpose in one line, entry and exit points, the states it can be in (empty, loading,
error, partial, offline, unauthorised, first-run), the data contract it needs, the actions available
and what each one does, keyboard behaviour, responsive behaviour, or what the screen must never do.
A designer or engineer cannot build a screen from this pack.

**2. There is no component inventory with an API.** `17-CODEMAP.md` lists 36 live components with a
line count and a one-line purpose. `08-DESIGN-SYSTEM.md` gives conventions and tokens. No component
anywhere has a prop table, a variant list, a state machine, or a usage rule. There is no storybook
equivalent, and no record of which components are primitives versus compositions beyond the folder
split (`common/`, `features/dashboard/`, `ui/`).

**3. There are no acceptance criteria, anywhere.** Nothing in 165,485 words is written in a testable
form. The traceability matrix's Status column is a glyph, not a criterion. `14-TESTING-STRATEGY.md`
says which test *layers* to build and in what order; it never states, for a given feature, the
condition under which it is done. Doc 30 mentions EARS and GitHub spec-kit in its sources list, and
the pack adopts neither.

**4. There are no test fixtures, and the pack diagnoses this as its own top gap.** Quoted from
`14-TESTING-STRATEGY.md` Layer 1: "there is no `test/fixtures/ecourts/` directory in either repo, and
no saved real HTML response anywhere in the tree. The tests assert against strings written by hand
alongside the parser." And the reason it matters, stated exactly: "An inline test asserts *the parser
still does what its author thought* — a fixture captured from the live portal asserts *the portal
still sends what the parser expects*. Only the second one fails when eCourts changes its markup."
The pack names the highest-value unbuilt test in the system and does not build it.

**5. There is no copy deck.** No catalogue of user-facing strings exists. `21-UX-AUDIT.md` flags
individual copy defects as findings; nobody owns the words. For a product whose differentiator is
refusing rather than guessing, the refusal wording is the product, and there is no artefact that holds
it.

**6. There is no error-message catalogue.** `04-API-REFERENCE.md` documents response codes;
`29-RUNBOOK.md` maps operator symptom to cause. Nothing maps an error condition to the exact string
the user sees, its tone, the recovery action offered, and the telemetry name it emits.

**7. There is no analytics or event schema, and no measurement plan.** `19-PRODUCT-MATURITY.md` scores
observability 2 of 5 and says nobody would be paged if the system went down tonight. There is no event
name list, no property schema, no funnel definition, no activation metric, and no definition of what
success looks like numerically for any feature.

**8. There is no data migration plan.** `03-DATA-MODEL.md` opens with a warning block about the
migration gap and the README's ground-truth block records that the migrations create 7 tables while 15
models exist, so 8 models have no `CREATE TABLE`. That is a diagnosis stated with precision. There is
no ordered plan to close it, no backfill procedure, no inventory of rollback scripts, and no statement
of what the production database actually contains versus what the schema claims.

**9. The one mechanism the pack says works is the one it does not have.** Doc 30 concludes generate
plus diff-gate is the only technique with no serious failure mode, and then records that
`openapi.yaml` is generated and validated but "**Not yet wired to CI**", and that CI "currently runs
*nothing*". Nothing in the pack is derived from the code at build time. Every number in it was
produced by a human or an agent running a command by hand and pasting the result, which is why the
freshness table drifted.

**10. There is no performance budget.** No latency targets, no bundle size budget, no query budget, no
cold-start target, despite `23-CONNECTIVITY-AUDIT.md` §6 measuring cold start.

**11. There is no accessibility specification.** `08-DESIGN-SYSTEM.md` has contrast maths and
`21-UX-AUDIT.md` has some interaction findings. There is no WCAG target level, no keyboard map, no
focus-order contract, no screen-reader behaviour, and no statement of which of these is in scope.

**12. There is no primary user evidence.** `01-PRODUCT-AND-DOMAIN.md` describes the advocate from
domain reading, and `32-MARKET-RESEARCH-UPDATE` is explicit in §6 that some things "cannot be
desk-researched". No interview, no session recording, no quote from a user appears in the pack. It is
honest about this and it is still absent.

**13. There is no pricing, billing or entitlement specification.** `26-PRODUCT-PLAN.md` §7 is one
section headed "Pricing — a proposal, not a finding". There is no plan matrix, no entitlement model,
no trial or dunning behaviour, no tax handling, despite `28-COMPLIANCE-AND-LEGAL.md` §3 covering GST.

**14. There is no first-run or onboarding specification.** KYA is documented as a gate that was
unsatisfiable by construction and is now satisfiable. What a new user sees in their first sixty
seconds is not specified anywhere.

**15. There is no security threat model.** `12-SECURITY-REVIEW.md` is an eighteen-item findings list,
which is a different artefact: no asset inventory, no actor list, no trust boundaries, no abuse cases,
no data classification. The file is honest that "No penetration testing was performed".

**16. There are no service levels, severity definitions, or incident process.** `29-RUNBOOK.md` has
symptom-to-cause entries and an escalation section. There is no severity ladder, no target for
anything, no on-call arrangement, and no postmortem template.

**17. There is no product decision log.** `adr/` covers architecture only and says so.
`31-OPEN-DECISIONS.md` holds six *open* ones. There is no record of product decisions already made and
why, so the reasoning behind a shipped product choice is unrecoverable except from the changelog.

**18. There is no release process or version scheme.** `CHANGELOG.md` exists and follows Keep a
Changelog loosely. There is no version scheme statement, no release checklist, no support policy, and
no deprecation policy.

**19. No file has an owner.** Doc 30 records that Google attaches `freshness: { owner: … reviewed: … }`
and classifies it as Tier 2, worth doing. The pack adopted the date and dropped the owner. Combined
with the fact that only 2 of 35 files carry the machine-readable marker at all, nothing in the pack
can be routed to a person when it goes stale.

**20. The knowledge graph's `wiki/` is knowingly stale.** 89 files and 15,416 words frozen at
2026-08-30 while the graph they describe moved to 2026-09-09. The pack labels it in two places, which
is the right minimum, but a labelled 15,000-word liability is still a liability, and a cold agent
grepping the tree will hit those files.

**21. And the structural one: no front matter.** Covered in 2.1. Every field that would make this pack
automatable exists as bold prose. The freshness table has to be rebuilt by a human reading the first
25 lines of 33 files, and the last time that happened, the table and the banners disagreed.

---

## Part 4. A proposed pack for frontmatter

### 4.0 What frontmatter already has, so we do not rebuild it

Measured in this session against `/Users/sagnikmitra/Desktop/GitHub/frontmatter`:

| Asset | State | Path |
|---|---|---|
| A routing file | **Exists, and is better than advox's.** Sections: The rule · Tiers · How to cite a section · How the tree is built · Routing, task to artifact · **Canonical, one fact one home** · **Superseded, do not read do not cite** · Gates · The four rules that override everything | `docs/MAP.md`, 10,709 bytes |
| **YAML front matter** | **Already in use across `docs/`.** Key census: `updated` 31 · `verified_against` 19 · `mode` 19 · `status` 18 · `title` 16 · `date` 11 · `for` 10 · `generated_by` 8 · `version` 7 · `time` 7 · `tier` 3 · `source` 2 · `supersedes` 1 · `supersedes_scope_of` 1 · `note` 1 · `budget` 1 · `budget_covers` 1 | `docs/**.md` |
| Screen ids | **`S01` to `S38`**, zero-padded, grouped into 11 areas, each entry a heading plus two screenshots plus three bullets | `docs/mvp0/SCREENS.md`, 360 lines, 3,020 words |
| Feature ids | **`F001` to `F070`**, 70 unique | `docs/mvp0/PRODUCT-GUIDE.md` **and** `docs/mvp0/PRODUCT-PLAN.md`, both carrying all 70 |
| A spec system with a harness | `id` is the path minus `specs/` and `.md`; `state:` is written only by the harness; invariants are `rule → failure mode → executable check`; line numbers banned in spec bodies | `specs/SPECS.md`, `specs/_schema/states.md` |
| Engine defect ids | `nf-001-zero-indent-sequence`, `nf-003-bare-cr-fence` | `specs/engine/` |
| A byte-pinned corpus | 8,513 files, `npm run corpus` exits 1 on one changed byte | per `AGENTS.md` §0.1 |
| The engine | 13 modules under `src/modules/`: `ai`, `ai-tools`, `app-shell`, `auth`, `drafts`, `editor`, `export`, `graph`, `mdmax`, `preview`, `repository`, `share`, `vault`. The engine is `mdmax` | `src/modules/` |
| Engine prose | `docs/ENGINE.md`, 2,251 lines, sections **67 to 80** | `docs/ENGINE.md` |
| Desktop build | Tauri v2 present: `build.rs`, `capabilities`, `Cargo.toml`, `gen`, `icons`, `tauri.conf.json` | `src-tauri/` |
| Composition root and config | `dependency-container.ts`, `client-container.ts`; `env.ts` | `src/container/`, `src/config/` |

Two numbers to keep in front of you while reading the rest of this part.

**38 screens are specified; 8 route files exist.** `find src/app -name 'page.tsx' | wc -l` returns
**8**: `(auth)/login`, `(public)/[slug]`, `(public)/p/[slug]`, `(public)/pricing`, `(public)/privacy`,
`(public)/refunds`, `(public)/terms`, `(vault)`. Plus 26 `route.ts` API handlers.
`docs/mvp0/SCREENS.md` specifies **S01 to S38**.

One caveat on that ratio, because the count alone would overstate the gap: `(vault)/page.tsx` is a
single route that almost certainly hosts several of the specified screens as internal states, so the
built-screen count is higher than 8 and lower than 38, and **nobody can currently say what it is**.
That is itself the argument for `11-SCREEN-INDEX.md` and `49-BUILD-STATUS-AUDIT.md` below. What is
certain is the direction: this pack is mostly a specification for work not yet done rather than an
audit of work already done, which is the opposite of advox's situation and changes what each file must
contain.

**`F001` to `F070` live in two files.** Both `PRODUCT-GUIDE.md` and `PRODUCT-PLAN.md` carry all 70.
That is precisely the "a fact with two homes" failure advox's own README names when confessing that
its freshness table had drifted out of agreement with the banners. Fixing this is the first item below.

**And the honest assessment of `SCREENS.md`.** At 360 lines for 38 screens it averages under eight
lines per screen: a heading, two image tags and three bullets. Verbatim, all of S01:

> ### S01. Sign in
>
> `<div class="pair"><img src="screens/s01-sign-in.png"><img src="screens/s01-sign-in-phone.png"></div>`
>
> - The wordmark, one line of promise, Continue with Google, Continue with GitHub.
> - The fine print says what we do not do: no password, no puzzle, no tour, no training on documents, and links the provider list that makes that true.
> - Privacy and Terms link to pages that serve without an account (F054). The right half shows the editor once, so the page is not a wall.

That is an excellent **screen catalogue** and a good print artefact. It is not a screen specification:
no states, no data contract, no actions table, no keyboard map, no failure behaviour, no acceptance
criterion. Nobody can build S01 from it without asking questions, and an agent on another account
cannot build it at all. Closing that gap is the largest single piece of the proposal.

### 4.1 The numbering scheme

advox numbered `00` to `32` contiguously and then had nowhere to put `31` and `32` except the end,
which is why its README's map has 30 listed after 31. The fix is **decade bands with deliberate gaps**,
so a new document gets a home without renumbering anything. This is the same discipline as `F17b` and
`never renumber an ADR`, applied to filenames.

| Band | Purpose | Reserved |
|---|---|---|
| `00`–`09` | Orient: what this is, who it is for, what the words mean | 10 slots, 9 used |
| `10`–`19` | **Specify**: the layer advox does not have at all | 10 slots, 10 used |
| `20`–`29` | Engineer: how it is built | 10 slots, 10 used |
| `30`–`39` | Run: how it is configured, shipped and repaired | 10 slots, 10 used |
| `40`–`49` | Judge: what is wrong with it and how we would know | 10 slots, 10 used |
| `50`–`59` | Steer: what to build, what to charge, what we may claim | 10 slots, 10 used |
| `60`–`69` | Trace and meta: how the pack points at itself and stays alive | 10 slots, 6 used |

Filenames stay `NN-KEBAB-CASE.md`. The number never changes once assigned. Reading order lives in
`00-README.md`, not in the numbers, exactly as advox states: "Numbers are stable; the file names are
the navigation."

### 4.2 The list

`→` names the advox ancestor where there is one, so the lineage is visible. **NEW** marks a document
the advox pack does not have, and where it maps to a gap in Part 3 the gap number is given.

#### `00`–`09`  Orient

| # | File | Mode | Scope, one line |
|---|---|---|---|
| 00 | `00-README.md` | index | The router: provenance block, freshness ledger, ground-truth counts with the command that produced each, the map in task-named groups, the seven-line version, the conventions. → advox `README.md`, merged with the existing `docs/MAP.md` Tiers / Canonical / Superseded / Gates sections. |
| 01 | `01-EXECUTIVE-SUMMARY.md` | Explanation | The whole product in ten minutes, the numbered list of what is wrong, and where each item stands this week. → advox `00`. |
| 02 | `02-PRODUCT-AND-DOMAIN.md` | Explanation | Why a byte-exact editor exists, the agent-era problem it models, the projection law and splice-only writing stated in the user's language, and what the product is not. → advox `01`. |
| 03 | `03-GLOSSARY.md` | Reference | Markdown, git, agent and product vocabulary, giving the in-frontmatter meaning separately where it differs: splice, span, carrier, callout, projection, refusal, degradation certificate, key addressability, anchor. → advox `15`. |
| 04 | `04-PERSONAS-AND-JOBS.md` | Explanation | Who the four readers are and the job each hires the product for, with the one sentence each would say. **NEW** (gap 12, partial). |
| 05 | `05-USER-EVIDENCE.md` | Reference | Every conversation, session and quote from a real user, dated and attributed, with an explicit empty state when there are none. **NEW** (gap 12). |
| 06 | `06-COMPETITIVE-LANDSCAPE.md` | Reference | One row per competitor with what they shipped, when, what happened to them, and which of our claims it threatens. Already has content: Almanac, Zed Delta, the four platforms that shipped the working-tree half. → advox `25` §2 and §7, promoted to its own file. |
| 07 | `07-CLAIMS-REGISTER.md` | Reference | What we may say publicly and what we may not, each claim with the artefact that backs it and the state that artefact must be in. PRD v2 §58 is the seed. **NEW** as a standalone. |
| 08 | `08-ECOSYSTEM.md` | Reference | Repositories, Vercel teams, tokens, domains, Firebase, R2 buckets, accounts, ownership, cost, and the two-Vercel-homes trap. → advox `16`, and `CLAUDE.md` already holds the trap. |
| 09 | `09-CHANGELOG.md` | Reference | What changed, newest first, every entry naming its evidence and what was deliberately not done. → advox `CHANGELOG.md`. |

#### `10`–`19`  Specify: the band advox has none of

This is the answer to "I need more details regarding the product, the idea, the screens". Everything
here is absent from advox and mostly absent from frontmatter today.

| # | File | Mode | Scope, one line |
|---|---|---|---|
| 10 | `10-FEATURE-REGISTER.md` | Reference | **The single home for `F001` to `F070`.** One entry each: id, name, one-line description, plan (free or Pro), the screens it appears on, its acceptance criteria id, its spec id, its test ids, and status. Deletes the duplicate copy from `PRODUCT-PLAN.md`, which then links here. **NEW, and the highest-priority file in the list.** |
| 11 | `11-SCREEN-INDEX.md` | Reference | One row per screen: `S01`–`S38`, name, area, route, plan, the features it carries, its spec file, build status. The advox traceability matrix's job, at screen granularity. **NEW.** |
| 12 | `12-screens/` | Reference | **A folder, one file per screen, `S01.md` to `S38.md`.** Fixed template in 4.3 below. This is the biggest single piece of writing in the pack and the one that makes the product buildable by someone who was not in the room. **NEW** (gap 1). |
| 13 | `13-SCREEN-STATE-MATRIX.md` | Reference | Every screen against every state it can occupy: first-run, empty, loading, partial, offline, conflict, over-cap, AI-unavailable, unauthorised, error, degraded. S31 to S34 already name four of these as screens; this file makes the coverage exhaustive and finds the holes. **NEW** (gap 1). |
| 14 | `14-COMPONENT-INVENTORY.md` | Reference | Every component: name, module, primitive or composition, props with types and defaults, variants, states, accessibility contract, the screens that use it, and the rule for when not to use it. **NEW** (gap 2). |
| 15 | `15-INTERACTION-AND-KEYBOARD.md` | Reference | The keyboard map, focus order, shortcut table with conflicts resolved, drag-and-drop behaviour, selection model, undo semantics, and what differs between web and desktop. **NEW** (gaps 1, 11). |
| 16 | `16-COPY-DECK.md` | Reference | Every user-facing string with its id, its screen, its tone, and its length budget. For a product whose differentiator is refusing rather than guessing, the refusal wording **is** the product. **NEW** (gap 5). |
| 17 | `17-ERROR-AND-REFUSAL-CATALOGUE.md` | Reference | Every error and every refusal: trigger condition, the exact string shown, the recovery action offered, whether the input is returned unchanged, the telemetry event name, and the test that proves it. **NEW** (gap 6), and see `26` for the engine half. |
| 18 | `18-FIRST-RUN-AND-EMPTY.md` | How-to | The first sixty seconds, screen by screen, and every empty state with the one action it offers. The standing rule is on record: one-tap sign-in, no captcha, no puzzle, no tour. **NEW** (gap 14). |
| 19 | `19-ACCEPTANCE-CRITERIA.md` | Reference | One testable criterion per feature, in a fixed form, each carrying the id of the test that proves it and the spec that governs it. Nothing in advox is written this way. **NEW** (gap 3). |

#### `20`–`29`  Engineer

| # | File | Mode | Scope, one line |
|---|---|---|---|
| 20 | `20-ARCHITECTURE.md` | Explanation | arc42's twelve sections with C4 levels 1 to 3 as Mermaid so the diagrams diff as text; hexagonal layering, the module barrel rule, and the inward-only dependency direction. → advox `02`; `AGENTS.md` §2 and §3 are the seed. |
| 21 | `21-DATA-MODEL.md` | Reference | Firestore collections, R2 key layout, IndexedDB stores, and the legacy `sgnk-md` persistence keys that may not be renamed without a migration. Opens, as advox `03` does, with the gap between what is modelled and what is provisioned. → advox `03`. |
| 22 | `22-API-REFERENCE.md` | Reference | **Generated, never hand-written**, and diff-gated in CI. Every route, method, auth, body, response, side effect. → advox `04`, but built the way advox `30` says is the only thing that works. |
| 23 | `23-WEB-APP-SPEC.md` | Reference | Routes, layouts, state ownership, the Zustand selector rule, the editor tab race, ISR and `force-dynamic`, server-only deps in client bundles, and the proxy allowlist regex pair. → advox `05`; `AGENTS.md` §1 and §9 are the seed. |
| 24 | `24-SERVER-SPEC.md` | Reference | Route handlers, the composition root, ports and adapters, background work, and the rule that `process.env` is read only in `src/config/` and `*/infrastructure/`. → advox `06`. |
| 25 | `25-ENGINE-SPEC.md` | Reference | **The splice contract.** Range location, byte-exactness, the projection law, what the writer may and may not touch, `SAFE_KEY` addressability, body-span splicing, the anchor system, incremental parsing. Derived from `docs/ENGINE.md` §67 to §80 and from `specs/engine/`. **NEW as a standalone, product-specific.** |
| 26 | `26-ENGINE-REFUSAL-CATALOGUE.md` | Reference | Every reason the engine refuses, with the input class that triggers it, the fixture that reproduces it, the message shown, and the `nf-NNN` spec that governs it. `nf-001-zero-indent-sequence` and `nf-003-bare-cr-fence` are the first two rows. Refusing is the differentiation, so it gets its own register. **NEW.** |
| 27 | `27-MODEL-ROUTING-SPEC.md` | Reference | The provider chain in fallback order, per-provider quota accounting, what a call costs, routing per call type and per plan, what happens when the whole chain is exhausted, and the rule that a provider whose terms nobody has opened cannot be enabled. Today's L1, L2 and L3 research is the evidence base. → advox `27`, considerably extended. |
| 28 | `28-CONFIGURATION-PANEL-SPEC.md` | Reference | `S35` to `S38`: every configurable row, its type, its bounds, who may change it, what reads it, what happens to accounts that fall outside a changed limit, and the audit record each change writes. The stated invariant is already sharp: "This row is what the product reads; there is no second copy in the source." **NEW.** |
| 29 | `29-PLATFORM-AND-DESKTOP-SPEC.md` | Reference | Web, desktop and phone: what is identical, what differs, what is desktop-only, the Tauri capability set, the bundle id that may not change, update and signing, and the parity audit. → advox `22`, retargeted from PWA to Tauri. |

#### `30`–`39`  Run

| # | File | Mode | Scope, one line |
|---|---|---|---|
| 30 | `30-ENVIRONMENT-AND-CONFIG.md` | Reference | Every variable, what breaks without it, where it is set per environment, and secret handling, written without opening a single `.env`. → advox `09`. |
| 31 | `31-LOCAL-SETUP.md` | Tutorial | Clone to running, web and desktop, recording the real failures rather than the idealised path. → advox `10`. |
| 32 | `32-DEPLOYMENT-AND-OPS.md` | How-to | The two Vercel homes and which token each needs, the ignored-build-step diff, the decisions site's separate deploy, domains, and rollback. → advox `11`; `CLAUDE.md` holds the trap already. |
| 33 | `33-RUNBOOK.md` | How-to | Symptom to cause, where every entry was observed at least once, including the ones whose first reading misleads. → advox `29`. |
| 34 | `34-INTEGRATIONS.md` | Reference | Firebase Auth, Firestore, R2, GitHub, the model providers, and the payment rail, each with criticality, state, configuration and failure mode. → advox `07`. |
| 35 | `35-RELEASE-AND-VERSIONING.md` | How-to | Version scheme, release checklist, what may ship on a Friday, deprecation policy, and how the desktop build is versioned against the web one. **NEW** (gap 18). |
| 36 | `36-DATA-MIGRATION-PLAN.md` | How-to | Ordered plan for every schema or key-layout change, backfill procedure, rollback script inventory, and the named prohibition on renaming a legacy persistence key without one. **NEW** (gap 8). |
| 37 | `37-BACKUP-AND-RECOVERY.md` | How-to | What is backed up, where, how often, how a restore is proved, and the key layout that has to carry disaster recovery because R2 has no object versioning. **NEW**, and it follows from a settled constraint. |
| 38 | `38-INCIDENT-AND-SEVERITY.md` | How-to | The severity ladder, who is called, the communication template, and the postmortem template. **NEW** (gap 16). |
| 39 | `39-SHARING-A-BUILD.md` | How-to | Getting the product in front of somebody else: preview deploys, the desktop build, and the auth traps that bite over a tunnel. → advox `24`. |

#### `40`–`49`  Judge

| # | File | Mode | Scope, one line |
|---|---|---|---|
| 40 | `40-TESTING-STRATEGY.md` | Explanation | The layers in dependency order with the reasoning for the order, each carrying a measured status block, plus the red-proof rule: a test on a rare fault proves nothing until it fails against the unfixed code. → advox `14`, and `AGENTS.md` §0 rule 1 already states the hard part. |
| 41 | `41-FIXTURE-REGISTER.md` | Reference | Every fixture in the 8,513-file corpus that a spec depends on: what it is, what it proves, where it came from, and which `nf-NNN` it reproduces. advox names the absence of this as its own highest-value gap; frontmatter has the corpus and needs the index. **NEW** (gap 4). |
| 42 | `42-SECURITY-REVIEW.md` | Explanation | Findings ranked CRITICAL to LOW, each with a path, a verbatim pattern, a concrete failure path, a fix, and an explicit "what was not assessed". → advox `12`. |
| 43 | `43-THREAT-MODEL.md` | Explanation | Assets, actors, trust boundaries, abuse cases, and data classification, which a findings list is not. **NEW** (gap 15). |
| 44 | `44-TECH-DEBT-REGISTER.md` | Explanation | One entry per item: bare id heading, title plus effort plus status, the evidence, the proposed fix, and a later resolution blockquote that corrects the proposal rather than rewriting it. → advox `13`, whose entry shape is copied exactly. |
| 45 | `45-UX-AUDIT.md` | Explanation | Findings from a live browser pass plus a code read, each traced to a path and a pattern, sequenced, with what could not be verified. → advox `21`. |
| 46 | `46-ACCESSIBILITY-SPEC.md` | Reference | The WCAG target level, keyboard contract, focus order, screen-reader behaviour per component, contrast maths, and what is deliberately out of scope. **NEW** (gap 11). |
| 47 | `47-PERFORMANCE-BUDGET.md` | Reference | Latency, bundle, query, cold-start and engine-throughput budgets, each with the command that measures it and the gate that enforces it. Fixes the known `npm run budget` echo. **NEW** (gap 10). |
| 48 | `48-PRODUCT-MATURITY.md` | Explanation | Dimensions scored 0 to 5 against what a product handling someone's documents for money would need, with the evidence for each and a re-scoring procedure. → advox `19`. |
| 49 | `49-BUILD-STATUS-AUDIT.md` | Reference | Every screen and every feature against what is actually wired, naming anything that shows invented data. The 8-of-38 ratio makes this the most-read file in the pack for the next quarter. → advox `23`. |

#### `50`–`59`  Steer

| # | File | Mode | Scope, one line |
|---|---|---|---|
| 50 | `50-ROADMAP.md` | Explanation | Phases on a dependency spine, every item traced to a finding in `42`, `44` or `48`, with the expected maturity movement. → advox `20`. |
| 51 | `51-PRODUCT-PLAN.md` | Explanation | Position, the defensible claims, what exists, the release tiers, and a never-build list. Cites `52` and does not re-cite it. → advox `26`. |
| 52 | `52-MARKET-RESEARCH.md` | Explanation | The market from primary sources, what would falsify the position, and a §"Not established" for everything that could not be. → advox `25`, with `32` folded in as a dated delta section rather than a separate file. |
| 53 | `53-PRICING-AND-ENTITLEMENTS.md` | Reference | The plan matrix, every entitlement and its numeric cap, trial and dunning behaviour, tax handling, and the payment-rail constants that are architectural rather than negotiable. **NEW** (gap 13), and it is the machine-readable twin of `S35`. |
| 54 | `54-COMPLIANCE-AND-LEGAL.md` | Reference | Data protection, model-provider terms, what we may not train on, licence obligations, and a register of what each constraint forbids, with citations. → advox `28`. |
| 55 | `55-MEASUREMENT-AND-EVENTS.md` | Reference | The activation metric, the funnel, every event name with its property schema, and what success looks like numerically per feature. **NEW** (gap 7). |
| 56 | `56-OPEN-DECISIONS.md` | Explanation | The things deliberately not fixed because each is a decision rather than a defect, each with options, real costs and a recommendation. The founder is the only person who can close one. → advox `31`. |
| 57 | `57-SUPPORT-AND-LIFECYCLE.md` | How-to | How a user reports a problem, what we promise, data export, account deletion, and what happens to documents if the product stops. **NEW** (gap 18). |
| 58 | `58-DESIGN-SYSTEM.md` | Reference | Tokens, type scale, contrast maths, component conventions, the accent in both themes, and the icon rule: Material Symbols as inline SVG, no emoji, no icon web font, no other library. → advox `08`. |
| 59 | `59-CODEMAP.md` | Reference | Every first-party file, one line each, with size, live-or-dead status and purpose. → advox `17`. |

#### `60`–`69`  Trace and meta

| # | File | Mode | Scope, one line |
|---|---|---|---|
| 60 | `60-TRACEABILITY.md` | Reference | The master matrix, **extended past advox's**: `F-id → S-id → route → module → port → adapter → storage → spec id → acceptance id → test id → status`. Plus the reverse index, one worked end-to-end path, coverage gaps by layer, and a "what a user sees versus what is actually there" table. → advox `18`. |
| 61 | `61-DOCUMENTATION-PRACTICE.md` | Explanation | Which parts of this pack are generated and diff-gated, which are hand-written and dated, which are archives that must not be freshness-reviewed, and what we are choosing not to do because it is theatre. → advox `30`, which is already correct and needs only to be pointed at our own artefacts. |
| 62 | `62-DOC-SCHEMA.md` | Reference | **The front matter contract**, and the fix for advox's single structural weakness. Every key, its type, whether it is required, and the validator that fails a build. Draft key set in 4.4. **NEW.** |
| 63 | `63-AGENT-CONTRACT.md` | Reference | The `AGENTS.md` content with a home in the pack: what an agent must not do, the four overriding rules, the reconciliation gate, and the tool-refusal rule that a blocked tool is one tool's policy and not the machine's reach. |
| 64 | `64-PORTABILITY-AND-HANDOVER.md` | How-to | How this pack survives a change of AI tool, account or machine: what to read in what order on a cold start, which files are canonical, which are archives, where the secrets live without naming a value, and the handover template. **NEW**, and it is the founder's stated requirement. |
| 65 | `65-CONVENTIONS.md` | Reference | Id formats, citation form, severity vocabulary, status vocabulary, British spelling, plain hyphens, the never-renumber rule, and the suffix-letter insertion rule. advox keeps this as a README section; at this size it earns a file. |
| 66–69 | *reserved* | | Left empty on purpose. |

#### Folders

| Folder | What is in it |
|---|---|
| `adr/` | Architecture decision records, `NNNN-kebab-slug.md`, Nygard format, the status vocabulary and the never-renumber rule from advox `adr/README.md` copied verbatim. Seeded from what is already settled: compiler not format, callout carrier, git-merge not CRDT, R2 key layout, the payment constant. |
| `pdr/` | **Product** decision records, same format, different subject. advox has no equivalent and gap 17 is the result: `adr/` covers architecture only, so the reasoning behind a shipped product choice is unrecoverable. |
| `12-screens/` | The 38 per-screen specifications. |
| `screens/` | The screenshot assets `SCREENS.md` already references. |
| `specs/` | **Exists.** The executable contract layer. The pack links into it by spec id and never restates an invariant that lives there. |
| `fixtures/` | Or a pointer to where the 8,513-file corpus lives, indexed by `41-FIXTURE-REGISTER.md`. |
| `sources/` | Every input that has no second copy: the generator for each delivered PDF, extracted primary sources cited by line, and the smoke scripts. advox's framing is the right one and should be copied: these are committed because they are the input to artefacts people are already reading. |
| `knowledge-graph/` | `graphify` output plus `GRAPH_REPORT.md`, with the rebuild command in the README and a dated note on anything in it that is knowingly stale. |
| `schema/` | The front matter JSON schema from `62`, and whatever `npm run docs` validates against. |

**Count.** 66 numbered files, of which **29 are new**, plus 38 screen specifications in `12-screens/`,
plus the folders. Call it 110 files. That is the honest size of a specification for a product with 38
screens, an engine with a byte-exactness contract, a model routing layer and two platforms. It is
larger than advox because frontmatter is documenting work not yet done, and a specification carries
more than an audit.

**If you build only twelve, build these.** `10` feature register, `11` screen index, `12-screens/`,
`19` acceptance criteria, `25` engine spec, `26` refusal catalogue, `27` model routing, `28`
configuration panel, `17` error and refusal catalogue, `60` traceability, `62` doc schema, `00` README.
Those twelve carry the founder's actual question. The rest is the frame that keeps them honest.

### 4.3 The per-screen template for `12-screens/SNN.md`

One file per screen. The template is fixed, because a fixed template is what makes 38 files checkable
by a script and comparable by eye.

```markdown
---
id: S04
title: Workspace
area: Writing
route: /w/[workspaceId]
plan: free
features: [F012, F013, F018]
platforms: [web, desktop]
status: specified          # specified | building | built | verified
spec: editor/workspace-shell
verified_against: <sha>
updated: 2026-09-18
owner: sagnik
---

# S04. Workspace

## Purpose
One sentence. What this screen is for, in the user's words.

## Entry and exit
How a user arrives, and every way they leave.

## Anatomy
The regions of the screen, named, with the component from `14-COMPONENT-INVENTORY.md` for each.

## Data contract
What this screen reads, from which port, and what it writes.

## Actions
| Action | Trigger | What happens | Failure behaviour | Event |

## States
| State | When | What is shown | What the user can do |
Covering at minimum: first-run, empty, loading, partial, offline, unauthorised, error, degraded.

## Copy
Ids into `16-COPY-DECK.md`. No literal strings here, so there is one home for the words.

## Keyboard and focus
Shortcuts, tab order, what has focus on arrival.

## Responsive
What changes at phone width, and what is not available there.

## Desktop differences
What differs in the Tauri build, or "none".

## Acceptance
Ids into `19-ACCEPTANCE-CRITERIA.md`, and the test ids that prove them.

## What this screen must never do
The refusals and the prohibitions specific to this surface.

## Open questions
Anything undecided, with the decision id in `56-OPEN-DECISIONS.md`.
```

Two of those sections are unusual and both earn their place. **"What this screen must never do"** is
where the product's differentiation gets specified per surface rather than as a slogan. And
**"Copy: ids only, no literal strings"** is the rule that stops a string having two homes, which is
the failure mode advox documents in its own README.

### 4.4 The front matter contract

This is the one thing to add that advox does not have at all, and frontmatter is already most of the
way there. Proposed required and optional keys, building on the 17 keys already in use:

| Key | Required | Type | Notes |
|---|---|---|---|
| `id` | yes | string | For screens and specs. The path is the id for specs; keep that rule. |
| `title` | yes | string | |
| `mode` | yes | enum | `tutorial` \| `how-to` \| `reference` \| `explanation`. Already in use in 19 files. |
| `tier` | yes | enum | `canonical` \| `derived` \| `archive` \| `superseded`. `docs/MAP.md` already has the concept. **An `archive` is never freshness-reviewed**, which is the ADR rule from advox `30` generalised. |
| `status` | yes | enum | Per tier. For specs, harness-written only. |
| `updated` | yes | date | Already in use in 31 files. |
| `verified_against` | conditional | sha | Required when `tier: canonical`. Already in use in 19 files. |
| `owner` | yes | string | **The key advox dropped**, and the reason nothing there can be routed to a person when it goes stale. |
| `review_by` | optional | date | Weak but cheap, per advox `30` Tier 2. |
| `for` | optional | list | The audience. Already in use in 10 files. |
| `supersedes` | optional | list | Already in use. Never edit the superseded file; name the successor in it. |
| `superseded_by` | optional | string | The other half of that link, so the stale file says so itself. |
| `generated_by` | conditional | string | Required when `tier: derived`. The command. A derived file with no generator is a hand edit waiting to be reverted. Already in use in 8 files. |
| `sources` | optional | list | Paths under `sources/`. |
| `covers` | optional | list | Ids this document is the home for, e.g. `[F001..F070]`. Lets a validator prove every id has exactly one home. |

A validator over those keys gives, for free, everything advox has to do by hand: the freshness table,
the canonical-versus-superseded list, the stale-file report, the orphan-id report, the two-homes
report, and a CI gate that fails on drift. That is the Tier-1 mechanism advox's own meta file says is
the only one with evidence behind it, and the only reason advox does not have it is that its front
matter is prose.

### 4.5 The four rules the pack should state about itself

Drawn from what advox does well, restated as instructions rather than observations.

1. **Generated beats written; dated beats undated; owned beats orphaned.** Anything derivable from the
   code is generated and diff-gated in CI. Anything not derivable is dated, owned, and small.
2. **One fact, one home.** `F001` lives in `10-FEATURE-REGISTER.md` and nowhere else. Everything else
   links. The pack's own validator proves it, because `PRODUCT-GUIDE.md` and `PRODUCT-PLAN.md` are
   already carrying the same 70 features and neither knows it.
3. **Never renumber. Supersede, and name the successor in the old record.** Applies to ADRs, to
   feature ids, to screen ids, to filenames. Insert with a suffix letter when you must.
4. **Every judgement document ends with its own limits.** What was not assessed, what could not be
   verified, what is not established, what would falsify this. Six advox files do this and it is the
   single habit that makes the pack trustworthy.

