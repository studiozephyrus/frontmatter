# frontmatter — Decision Record & Research Index

**v1.0 · 2026-08-29 · owner: Sagnik Mitra**
**The third of three. `PRD` = what and why. `BUILD-PLAN` = in what order. This = what was decided, what was found to be wrong, and where the evidence lives.**

---

## 0. What this is

Twelve research rounds, **105 reports, 374,866 words**. This document is the accumulation: every decision that is now made and why, every claim in the PRD that later evidence overturned, what remains genuinely open, and an index so any of it can be traced back.

**The rule that governs the whole record:** a decision here is only as good as its falsifier. Every row carries "what would change this". A decision with no falsifier is a preference.

---

## 1. Decisions now made

### 1.1 Architecture

| # | Decision | Reasoning | What would change it |
|---|---|---|---|
| **A1** | **Sync = git three-way merge + an append-only splice journal, server-mediated by compare-and-swap.** Not CRDT, not OT, not fuzzy patch | Three independent disqualifications, all measured or fetched — see §1.2 | A measured conflict rate above the published budget. The fix would be finer merge granularity, **never** a fuzzier apply |
| **A1b** | T0's exit condition is **"zero bytes lost, every divergence surfaced as a reviewable hunk"** — not "convergence" | "Convergence" is a CRDT word, and CRDTs converge to interleaved garbage (§1.2). The architecture that must satisfy T0 is merge3 + OCC | — |
| **A2** | Git repo = document truth, never moves. **One Postgres as control plane holding zero document bytes.** R2 for attachments >1 MB and derived artifacts | Publish-slug uniqueness currently scans the whole snapshot; identity, entitlements, billing and audit have no home | D8 resolving to local-first/E2E shrinks the control plane to identity + billing |
| **A3** | `workspace_id` on every row from day one, pooled RLS. The GitHub App installation is the **connector**, never the tenant identity | Users connect two repos, transfer repos, uninstall. Identity must survive all three. Retrofitting `workspace_id` post-launch is the highest-cost change on the board | An enterprise deal needing infrastructure-level isolation — then a dedicated tier, priced separately |
| **A5** | Stop shipping the whole snapshot → Postgres FTS + trigram server-side → MiniSearch client-side only. CJK via a **bigram tokenizer**, not a dictionary segmenter | 77.5 MB parsed per cold start; the snapshot response is 16.4× the platform body cap | p95 above 400 ms on Postgres FTS at real corpus size |
| **A14** | MDMAX wires in as **four ordered seams**: ingress gate (live) → write gate → splice engine → certificate | Currently one symbol from one of thirteen files is used | — |
| **A14b** | **Do not wire the write gate before NF-1/NF-3** | At the measured refusal rate it would reject 83% of foreign publishes — an availability incident wearing a correctness costume | — |
| **A15.1** | Collapse dual identity: keep NextAuth + GitHub App, **delete Firebase** | Two auth paths is two session-fixation surfaces for one operator, plus an unused Firestore import in the client bundle | — |
| **R-carrier** | **Callout `> [!kind]` for prose profiles, fenced code for opaque data. Nothing else.** `:::` accepted on input, normalised away on save | An unclosed fence swallows the rest of the document (CommonMark §4.5, spec-mandated); a callout **has no closing marker to lose**. Measured across four engines + GitHub live. **This corrects PRD §9** | A carrier that beats the callout on both degradation and splice-safety. None found |

### 1.2 Why not a CRDT — the three disqualifications

This was the single most consequential open question, and it is now closed on evidence rather than taste.

1. **A CRDT cannot own the file's bytes.** "Every untouched byte bit-identical" is unassertable across a CRDT merge, because the result derives from the operation graph, not from the bytes. Adopting a CRDT adopts precisely the architectural gap we cite against OpenKnowledge.
2. **CRDTs interleave, and interleaving is not loss the digest can see.** *The Art of the Fugue* (arXiv 2305.00583, 2023-04-30) `[fetched]`: when two users concurrently insert at the same position, the merged outcome may interleave the passages into corrupted text — *"The problem has gone unnoticed for decades, and it affects both CRDTs and Operational Transformation."* So a CRDT's convergence guarantee buys **byte-identical garbage on both devices**. Convergence is not zero loss. This is why A1b rewrites the exit condition.
3. **A CRDT cannot refuse.** Refusing is not in its algebra, and refusal is our founding principle.

**And the incumbent's approach is measurably worse.** `diff-match-patch@1.0.5`, executed here `[measured]`: applied twice, a patch produced `one two three four four` — and `patch_apply` returned `results = [true]` **both times**. It also applied an edit whose anchoring context no longer existed, returning true. Its own README states the intent: *"Use best-effort to apply patch even when the underlying text doesn't match."* That is architecturally the opposite of refuse-rather-than-guess. It is disqualified, not disfavoured.

**Meanwhile git's merge measured byte-faithful** `[measured, git 2.50.1]`: preserves CRLF verbatim, preserves a missing final newline, and produces conflict markers exactly where a splice writer would want to refuse — including on a whitespace-only divergence. One mode must be **banned**: `--union` silently emits both sides, inventing a document with two `title:` keys.

**The honest counter-argument, recorded not dismissed:** conservative merging produces conflicts users hate — that is *why* Obsidian ships fuzzy patching. Mitigation: instrument conflict rate as a first-class shipped metric with a published budget.

### 1.3 Product and commercial

| # | Decision | Reasoning |
|---|---|---|
| **D15** | **Publishing ships in v1, but only a narrow surface**: paying accounts only, `noindex` by default, system-assigned slugs, no arbitrary uploads, raw HTML and `<form>` stripped, hard per-account page cap | The abuse economics of a *paid* surface are inverted — the highest-ranked vectors all depend on free, automatable, indexable, vanity-named pages. A card plus `noindex` plus a random slug removes the commercial motive |
| | **The counter-argument is about your life, not the law** | The 24-hour acknowledgement clock is a **permanent, unbounded, personal on-call obligation**, starting the day the first stranger publishes and never ending. Missing it does not cost a fine — it collapses the s.79 safe harbour that separates "a user posted defamation" from "the founder is a co-defendant". India is the binding constraint; the EU's micro-enterprise exclusion covers us until 50 employees or €10m turnover |
| **Pricing** | ₹299 and ₹599 stand. **Treat ₹15,000 per transaction as an architectural constant** | RBI's 2026 Framework allows recurring auth without additional-factor authentication up to ₹15,000/transaction. Software is not in the ₹1,00,000 carve-out list |
| | **Do not offer an Indian annual plan above ₹15,000 on auto-renew** | Legal, but every renewal needs on-session AFA. That is a manual repurchase wearing a subscription costume, and it reads as a billing bug |
| **Name** | `stetfile` is the strongest candidate; **do not ship "Frontmatter" bare while holding qualified handles** | *Stet* means "let it stand, preserve the original exactly" — literally the engine's contract. Clean on npm, GitHub, repo search and product collision. The compromise to avoid takes full trademark and SEO exposure and buys nothing. Not trademark clearance; needs counsel |

### 1.4 Operational realities that constrain the build

| Finding | Consequence |
|---|---|
| **Cloudflare R2 has no object versioning.** `PutBucketVersioning` and object-lock are absent from the S3 compatibility matrix; `DeleteObject` is a **free** operation; emptying a bucket is irreversible; audit logs are control-plane only, so `GetObject`/`PutObject` leave no forensic trail `[fetched]` | The standard cloud DR recipe **does not port**. Versioning must be built into the key layout — content-addressed immutable keys plus a small HEAD pointer — not bought. R2's own docs: *"Durability does not prevent intentional or accidental deletion of data"* |
| **Indian cards get exactly one payment attempt.** Smart Retries do not apply; there is a 26-hour billing delay; the bank sends a pre-transaction notice 24h ahead in its own words; the customer can opt out of any single charge; only Visa and Mastercard get mandates `[fetched]` | Involuntary churn in India has a different shape and a smaller toolkit than the global benchmarks assume |
| **A cross-border card-not-present regime lands 2026-10-01** — 33 days out `[fetched, derived]` | If Indian customers are billed through a foreign-acquired MoR, their first charge enters that regime. Decide the rail before then |
| The shipped `globals.css` is byte-identical to sgnk-md's, self-labels *"Linear-style modern SaaS"*, and carries `--accent: #18181b` with 6/8/12px radii `[measured]` | The product ships neither the canonical accent nor the square-corner rule. And a body-faint token at 2.14:1 **fails WCAG AA** while being in the shipped set |

---

## 2. Corrections to the PRD

These are places where later evidence overturned something the PRD asserts. **The PRD is not yet updated; treat this table as authoritative over it.**

| PRD says | Correct position | Source |
|---|---|---|
| §9: the fenced-code info string is the render dispatch mechanism | **Callout for prose, fence for opaque data.** An unclosed fence is document-wide; a callout has no closer | R9 m2, measured |
| §7.2, §24: "MDMAX is imported by zero product files" | **False at import level** — `get-snapshot.ts` and `search-index.ts` both import `decodeStrict`. True at capability level: 12 of 13 files have no product importer | R8 c6, measured |
| §7.1: mdmax has 11 tests | **10** `*.test.ts` plus a fixtures directory | R8 c6, measured |
| Earlier session: 262 test files | **98**. The `find` traversed extra git worktrees | measured, twice |
| §24: NF-1 "recovers 99.98%" | An **inference from bucketing refusal causes**, not a measured result of the patched writer. Must be re-derived after the fix | R8 c6 |
| §24 T0: exit condition is "two-device convergence" | Convergence is the wrong property (§1.2). **"Zero bytes lost, every divergence surfaced as a reviewable hunk"** | R11 c2, R12 k2 |
| §3.2: "Obsidian's own community says most of a million-plus downloaders never get past their first note" | **Unsourced.** Traces to an unattributed pull-quote in a 2025 author blog post — no Obsidian source, no methodology, no denominator. **Do not cite it** | R10 s1, fetched |
| §19.3: frontier assumption ~$3/$15 per MTok | Claude Sonnet 5 is **$2/$10**, and the scheduled increase will not occur | R7 g1, fetched |
| §19.3: "Gemini 2.5 Flash $0.15/$0.60" | **That SKU does not exist.** Cheapest is Gemini 3.1 Flash-Lite at $0.25/$1.50 | R7 g1, fetched |
| §20.4: Dodo's flat fee is 12.7% of ₹299 | That is the **US** rate. India-domestic is 4% + 15¢ = 4.79%. Razorpay-domestic is 2.36%, where the flat-fee argument barely applies | R7 g1, fetched |
| §18: the consolidation wedge is $963/mo | **$1,163–1,223** at live prices (Mintlify moved $250 → $450). But the honest *light* version of the same stack is **$78**. Quote the range | R7 g1, fetched |
| §24: the corpus holds 7,959 frontmatter files | The pinned corpus holds **7,969** LF-terminated fences. A +10 gap, probably definitional. Reconcile before publishing either | measured here |

---

## 3. Still open — and each one re-scopes a lane

| # | Question | Why it cannot be answered by research |
|---|---|---|
| **D3** | The name | Trademark clearance needs counsel. Everything else is decided |
| **D4** | Do documents leave the device? | Local-first collapses the DPDP/GDPR surface to near-zero and kills server-side agents, search and publishing. Server-stored enables the product and buys the full obligation set including the ₹250 crore ceiling |
| **D9** | BYO key or platform key? | Economics vs support load vs custody risk. A values call |
| **D14** | Does the agent get write authority? | It is the flagship demo and the whole lethal-trifecta liability |
| **D17** | CJK in scope for v1? | In means fixing `countWords` (1.7–2× under) and MiniSearch recall (18.1%). Out means saying so in positioning rather than shipping a silent failure |
| **NF-4** | Does `café` in NFC equal `café` in NFD for key addressing? | Both answers defensible. **The one engine unit an agent cannot start** |
| **D5** | The two unrotated PATs | Only you can do it. Today, not a milestone |
| **Publishing** | Will you accept a 24-hour, 365-day acknowledgement duty? | A question about your life, not about the law |

---

## 4. Research index

| Round | Agents | Reports | Answers |
|---|---|---|---|
| **R1** internal | 7 | `i1`–`i7` | Content engine, ecosystem inventory, knowledge-base principles, **AIOS capabilities and pattern language**, docs-vs-reality delta, research ledger |
| **R2** external | 8 | `e1`–`e8` | Claim verification, home surface, India market, **the agent frontier**, importer breakage, naming risk, fresh community signal, **no protocol buyer** |
| **R3** hands-on | 4 | `h1`–`h4` | **The 7,959-file foreign-corpus run**, the Hubble/Front Matter CMS teardowns, **the OpenKnowledge teardown** |
| **R4** editors | 5 | `ed1`–`ed5` | Writing tools, IDEs, **lossy frameworks**, AI editors, **the office-suite review-loop canon** |
| **R5** AI journey | 4 | `aj1`–`aj4` | Agent protocols, **chat-to-artifact laws behind `land()`**, knowledge formats, the journey-home gap |
| **R6** core | 6 | `c1`–`c6` | **The projection law**, the computation budget, the B2B wedge, INR pricing, build refs, twelve screens |
| **R7** PRD corpus | 16 | `x1`–`x13`, `g1`–`g3` | Lossless compression of R1–R6 + **business model and unit economics**, **internal systems fusion**, **risk/legal/security/capacity** |
| **R8** AIOS + specDD | 12 | `a1`–`a5`, `b1`–`b5`, `c5`, `c6` | AIOS tools and loops as product, AIOS as a B2B surface, SKILL.md as user automation, markdown processing assets, **the spec-driven-development market**, the document-type canon, prompts as documents, **the AI build loop**, spec-conformance verification, **the spec-file system**, build-plan inputs |
| **R9** markdown | 10 | `m1`–`m10` | Spec landscape, **the carrier decision**, the extension catalogue, frontmatter key conventions, typed markdown, render pipelines, output targets, computational markdown, hard edges, **the render possibility space** |
| **R10** untouched angles | 7 | `s1`–`s4`, `d1`, `d2`, `d4` | **Simplicity engineering**, editor latency, the affordance problem, mobile, search, collaboration models, AI document interaction |
| **R11** gaps | 11 | `c1`–`c4`, `d3`, `r1`–`r6` | **The research gap audit**, **architecture decisions**, feature completeness, onboarding, longevity, migration fidelity, the academic segment, AI disclosure, **naming candidates**, measurement, support economics |
| **R12** build blockers | 14 | `k1`–`k14` | **DR (R2 has no versioning)**, **the sync engine**, refusal UX, accessibility, API design, observability, roles, **abuse and publishing**, desktop distribution, performance and testing, data model and migrations, i18n/RTL/IME, OSS/docs/community, **Indian billing ops** |

Paths: `docs/research/agent-reports-2026-08-28/` (R1–R6) · `-r7/` · `-r8to10/` · `-r11/` · `-r12/`.

---

## 5. What we may say in public, and what we may not

**May say** — each is `[measured]` or `[fetched]` and re-derivable:

- 0 corruption and 0 throws across 8,513 third-party markdown files from 7 vaults, byte-pinned and re-verifiable by anyone via `npm run corpus`.
- Three competitors' write paths executed, with the exact bytes each destroys.
- Every mainstream rich-text framework is lossy by design, with the vendors' own words for it.

**May not say, yet:**

- **Any fidelity or coverage percentage.** At the measured 83% refusal rate the headline number is false until NF-1 and NF-3 land. Publishing first converts a bug into a public claim.
- **"NF-1 recovers 99.98%."** It is an inference, not a measurement.
- **Anything about Obsidian's onboarding funnel.** The widely-repeated claim is unsourced.
- **"First AI attribution."** Cursor and Grammarly exist. The defensible claim is narrower: the first markdown editor with byte-anchored, document-portable, reader-visible provenance.
- **"Serve markdown to agents and get cited."** Measurably refuted.
- **Any `[SS]`-tagged number.** 52 of them remain in the PRD.

---

*Three documents, one system: the PRD says what to build, the build plan says in what order and how it is proven, and this says what was decided and what turned out to be wrong. When they disagree, this one is newer.*
