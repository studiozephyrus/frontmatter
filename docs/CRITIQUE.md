---
updated: 2026-08-30
generated_by: docs/build/build-tree.mjs
---

# CRITIQUE — the case against, argued at full strength

**Tier 1.** Twelve adversarial audits of the plan, each required to steelman before attacking, to rank severity FATAL/SEVERE/SERIOUS/MINOR, and to state what evidence would change its mind. §10 is the prosecution with no rebuttal attached.

> Read this BEFORE `PLAN.md`. A plan that has not survived its own critique is a wish.

> 12 of 12 audits present.

---
## 1. The premise — is there a product here

A byte-preserving splice engine that refuses on ambiguity is the correct architecture for machine edits to documents a human is accountable for, and this is not opinion: Cursor's own staff called doubled blank lines and destroyed carriage returns on CRLF files "a known issue we're tracking" three days ago [`r24-v3`, fetched 2026-08-28]. The review cost of an AI edit is O(document) while the change is O(bytes), and every generator on the market widens that gap. An independent team converged on the identical design — exact-match gate, refusal on ambiguity, markdown as projection — which is the strongest available evidence that the design is right. The engine is not vapour: 8,513-file pinned corpus, byte-identical verification, 1,575 tests. And the market leader in the category proves the shape can work without a single B2B feature, funding eight people from a $4/month add-on. That is a real mechanism, a real defect in the incumbents, real code, and a proven business shape. It deserves a serious hearing.

Now the parts that do not survive.

---

### The chain, attacked link by link

| Link | Verdict | Severity | Falsifier |
|---|---|---|---|
| (a) markdown is the right substrate | **Holds technically, fails commercially** | SERIOUS | Name one market where markdown is the *delivery* format to a counterparty who can hold you to it |
| (b) byte-exactness is the right differentiator | **Fails — closing window, commodity mechanism** | SEVERE | Cursor/Zed/Copilot still mangle CRLF markdown when re-tested 2027-04-28 |
| (c) AI-native developers are the right buyer | **Fails — and the failure is structural** | **FATAL** | 3 of 10 strangers describe the review-cost problem *before you name it* |
| (d) an editor is the right form factor | **Fails on cost-per-unit-of-differentiation** | SEVERE | Engine-as-MCP-plugin gets fewer installs in 30 days than the editor gets users in 90 |
| (e) subscription is the right model | **Fails on its own arithmetic** | SEVERE | Six months of measured cohort churn below 4.90%/month |

**(a) Substrate — right, and worth nothing.** 34.8% of developers use markdown files regularly [`r25-w4`, fetched SO 2025 n=30,065], agents' own configuration is markdown, the format outlives every editor. All true. But markdown's virtue *is* the anti-moat, and §27 already says so: "Near zero, by design." Every user's free substitute is `git diff` plus whatever editor is open. The one team that saw the same mechanism looked at markdown and concluded it should be the intermediate representation *the user never sees*, pointing the engine at `.docx` where the liability and the money are — `dealfluence/adeu`, MIT, 149 stars, last push 2026-08-30 [fetched 2026-08-31, api.github.com]. They chose the substrate where the reviewer is a lawyer with Word. We chose the substrate where the reviewer already has `git`.

**(b) Byte-exactness — a closing window, not a moat.** Finding 2 settles felt-need; `r25-w4` #6 makes it worse (0 of 355 comments in the highest-intent audience that exists). The new argument is timing. The incumbents are *actively shipping fixes*: 396 CRLF-related issues/PRs across 7 repos, 103 naming a line-ending term in the title, 7 merged PRs [measured, `r25-w2`]. Cursor acknowledged the defect on 2026-08-28. The record's M7 — one paying non-founder account — is dated **2027-04-28**, which is **240 days from today** [derived: 30+31+30+31+31+28+31+28]. You are proposing to spend 240 days building a fix for a bug the market leader started tracking three days ago. The window closes before you arrive, and the mechanism itself is already installable in one line as a Claude Code plugin. I re-verified the Zed claim independently: `https://zed.dev/docs/ai/agent-panel` returns HTTP 200 and contains the exact string "accept or reject each individual change hunk" [fetched 2026-08-31].

**(c) The buyer — FATAL, and the only genuinely fatal item here.** This is not "the buyer is hard to reach." It is that the record contains two incompatible buyers and has closed neither.

| | Buyer A (the plan) | Buyer B (the surviving problem) |
|---|---|---|
| Who | Developer building with AI | Consultant/studio principal personally liable for a priced document |
| Has the problem? | Measured **zero times** in 355 highest-intent comments [`r25-w4`] | Yes — a silently "improved" scope clause is unbounded free labour [`r22-t1` §5] |
| Has markdown? | Yes, 34.8% | **No** — `.docx` or Google Docs, because that is what the client signs |
| Has a repo? | Yes — which is the free substitute | No |
| Reachable by this founder? | Yes (HN, GitHub) | Yes (existing client base) |
| Served by MVP-0? | Yes, entirely | **Not at all** |

`r22-t1` states the intersection problem in its own §7 and could not open a single source proving anyone stands in it: *markdown-native ∧ personally-liable ∧ non-developer* is three sets whose pairwise overlap is small and whose triple overlap is unevidenced. MVP-0's 38 points build for A. The only problem statement that survived two rounds of filtering describes B.

And MVP-0's exit criterion cannot detect this, because it measures the wrong thing. "Six of ten run it on a real repo" measures curiosity and founder charisma — a polite stranger given a free binary runs it. Demand is measured by whether they describe the problem *unprompted*, and by whether they are still using it on day 30. As written, the criterion is designed not to fail. That is a diagnostic, not an insult: an exit criterion a friendly stranger passes by being friendly was chosen by someone who wanted to keep going.

**(d) Form factor — the most expensive wrapper available.** 25,407 lines of source, of which the mdmax engine is **3,614 = 14.2%** [measured, `r22-t2`]. The other 21,793 lines are an Obsidian clone, competing with a free product that has 7,092 plugins — an ecosystem you have banned yourself from having (§86). Meanwhile Show HN markdown editors have a **median of 3 points, n=609** [measured, `r25-w3`], the worst launch distribution measured anywhere in this corpus. The competing form factor — MCP server + Claude Code plugin + npm package — is exactly how `adeu` shipped, costs roughly a seventh of the code, and lives inside the tool the buyer already has open.

**(e) Subscription — refuted by the record's own numbers.** Findings 3 and 4 cover price level. Here is the arithmetic nobody has run:

| Step | Value | Source |
|---|---|---|
| Contribution per paying user, ₹299 India Pro, net of fees/GST/inference | ₹217.40/mo | [derived, `r22-t3` §23.2] |
| LTV = contribution ÷ monthly churn | ₹217.40 ÷ c | [derived] |
| At c = 2.38% (ChartMogul **best-in-class**, ARPA<$10) | ₹9,134 = $95.75 | [derived] |
| At c = 3.76% (**top quartile**) | ₹5,775 = $60.54 | [derived] |
| At c = 6.00% (the honest central case, `r25-w4`) | ₹3,623 = **$37.99** | [derived] |
| $49 one-time, net ~5% fees | $46.55 = ₹4,440 | [derived] |
| **Break-even churn** where subscription = one-time | **4.90%/month** | [derived: 217.40 ÷ 4,440] |

FX 95.39 INR/USD [fetched, ECB via `r22-t3`]. **The subscription is worth less than a $49 one-time sale unless you land between top-quartile and best-in-class retention in the worst-retaining ARPA band ChartMogul publishes — with deliberately zero switching cost, no sync, and no plugins.** You would be betting the business model on out-retaining 96%+ of the band while having removed every retention driver on purpose. And §17's telemetry design makes churn uncomputable, so you cannot even observe whether you won.

---

### Distribution: the number that no pricing choice escapes

Default-alive at c=6%, T=24 months, target 502 paying users. `N_T = g(1−(1−c)^T)/c` → 0.94²⁴ = 0.2265 → g = 502 ÷ 12.892 = **38.94 gross paying adds/month**.

| Free→paid conversion | Signups/mo | Visitors/mo @9% | Cumulative over 24 months |
|---|---|---|---|
| 5% (record's assumption) | 779 | **8,653** | 207,672 |
| 2.5% (bottom freemium quartile — where a BYO-key, no-signup, no-card free tier structurally sits) | 1,558 | **17,307** | 415,368 |

[derived]. Against a measured supply of **two blog posts ever shipped, one defective since 2026-08-10** [measured, `r25-w4`], on the only channel you own outright.

The one-time model does not escape this: 24.5 units/month forever at $46.55 net needs ~10,900 visitors/month at the same rates [derived: 108,918 ÷ 95.39 ÷ 46.55 ÷ 0.025 ÷ 0.09]. **No pricing model escapes the distribution problem; the pricing choice only decides whether you also have a churn problem.** SEVERE.

---

### The founder-count contradiction, priced

DECIDE §6 assumes two founders and works only because founder A does zero client hours. §53 says one person. Under §53:

| | One founder |
|---|---|
| Nut (₹45,000 draw + ₹18,918 overhead) | ₹63,918/mo |
| Default-alive paying users | **294** (not 502) |
| Client hours to cover it @ ₹1,400–2,000/h | 32–46 h/mo |
| Ops hours at 294 users (0.1445/user + 19) | 61.5 h/mo |
| Non-product load, steady state | 107 of 198 h = **54%** |
| R0 during build (client hours only, 23% load) | 63 days → **82 days** |
| Product time at default-alive, forever | **91 h/month** |

[derived from `r22-t3` inputs]. This is not a bookkeeping quibble. Every calendar date in the record — including the 2027-04-28 M7 that link (b) hangs on — is void until this is answered, and the honest version is worse than the published one. SERIOUS, and it is question #1 in DECIDE for the right reason.

---

### Is this a feature, a product, or a company?

**Feature.** The differentiator is 3,614 lines. An independent team gave the same mechanism away MIT and distributed it as a plugin, MCP server, Agent Skills package, PyPI and npm. Refusal-on-ambiguity is already in Claude Code — 323 issue threads across 7 repos are about its refusal messages [measured, `r25-w2`]. A capability that ships as a plugin inside someone else's agent is a feature.

**Product.** A $49 one-time editor in the Typora ($14.99) / iA Writer ($49.99) / Sublime ($99) shape, sold on two capabilities with measured upvoted demand — nested-construct live preview (501 likes, the most-voted bug in Obsidian's history) and vault-wide refactor with refusal (86 likes). Three live proof points at three price levels. Realistic ceiling: a good year is a few hundred thousand dollars. That is a product.

**Company.** $10M ARR at ₹299 needs 265,858 paying users → 59.1 million cumulative visitors → 2.7× India's entire GitHub contributor population, and 215× the point where one founder's month is fully consumed by support [derived, `r22-t3`]. The only path with a different denominator is teams at $30/seat (27,778 seats), and the record's own trigger for that — three unsolicited inbound teams — has fired zero times.

**Pick: a feature, monetisable as a product, that will not become a company on this thesis.** State it plainly: this is a library with an editor attached, and the library is the good part.

---

### What exactly is left that is ours

Concretely, four things, ranked by defensibility. The honest total is smaller than the record implies.

| Asset | Real? | Defensible? | Verdict |
|---|---|---|---|
| **8,513-file pinned corpus + byte-identical verification + 1,575 tests** | Yes, and rare | No — a test suite is the most copyable asset class | The best *proof* in the project; not a moat |
| **OffsetMap → nested-construct live preview** | Yes | Partially — Obsidian has not shipped it in years | **The one place mechanism meets measured demand (501 likes)** |
| **Vault-wide refactor with refusal on ambiguity** | Yes | Weakly | Real, asked-for (86 likes), and byte-exactness sold as capability |
| **The splice engine itself** | Yes, 3,614 lines | **No** — MIT-cloned by `adeu` 8 months ago | A library |
| AIOS as differentiator | No | — | 1 reward label in 6,884 routing decisions [`r23-u1`]; does not ship [`r22-t2`] |

**The honest answer to the question as posed: what is left is a library, plus two Obsidian bug fixes.** That is not nothing — it is more than most projects have at day 49 — but it is not a company, and calling it one is the error the record keeps making.

---

### Sunk cost: where it shows, named

| # | Artefact | Measurement |
|---|---|---|
| 1 | Documentation-to-code ratio | **2,342,911 words ÷ 25,407 lines = 92.2:1**; against the 3,614 differentiating lines, **648:1** [measured 2026-08-31] |
| 2 | Four coexisting master documents | COMPLETE-RECORD 480,411 + RECORD 297,631 + PRD-v2 120,660 + PRD 20,197 = **918,899 words** of substantially the same content — in a tree whose HEAD commit is titled *"supersede the 0129 record — one current copy only (LR#69)"* [measured] |
| 3 | DECIDE §1's conclusion | Three central beliefs came back refuted and the sentence drawn from it is *"None of this kills the product. All of it changes the pitch."* A premise whose refutation changes only the marketing was never load-bearing — or the conclusion was fixed before the research ran |
| 4 | MVP-0's exit criterion | "Six of ten run it" measures politeness. An exit criterion a friendly stranger passes by being friendly was chosen not to fail |
| 5 | DECIDE §7 | *"What is already decided, and may not be reopened"* — six closed rows in a project with zero users. Each closed row is a place evidence can no longer reach |
| 6 | The research loop itself | `r18` found **62% of load-bearing claims needed correction**. The response was rounds 21–25, not fewer rounds and one customer conversation. 97 reports, 0 users |
| 7 | Timing of the pivot language | The repositioning ("mechanism not pitch") arrived *after* 41 days of MVP-0 scope was already written, and MVP-0 was not rescoped |

**And the counter-finding, which is the most useful thing in this section: the frontmatter-specific sunk cost is 49 days and 57 commits** [measured — first commit 2026-07-13, HEAD 2026-08-31]. The documentation makes it *feel* like a year. It is seven weeks. Killing, pausing, or pivoting this is far cheaper than the record's weight implies, and the weight itself is the bias — 2.3M words of documentation is a sunk-cost *generator*, because each new document raises the felt price of abandoning the last.

---

### Refuse-rather-than-guess: principle, or aesthetic?

Both, for different people, and the record conflates them because it never picked a buyer.

The evidence is unambiguous and already counted: **323 issue threads across 7 repos concern refusal messages — "String to replace not found," "not unique," "File has been unexpectedly modified" — and every one is a complaint about being refused, not a request for it** [measured, `r25-w2`]. Users want the *outcome* of refusal (nothing I did not approve changed) and reject the *experience* of refusal (the tool stopped and handed the problem back). Those are different products.

For Buyer A, refusal is an aesthetic: the failure it prevents is invisible, the interruption it causes is not, and they already have `git`. For Buyer B, refusal is the entire product: a fluent, reasonable-sounding edit to a payment-terms line is a cash-flow hole they personally eat, and `r22-t1`'s structural argument is genuinely durable — an incumbent measured on assistance-acceptance cannot ship a headline behaviour of *"I declined to make your edit."* That asymmetry is the single most defensible idea in 2.3M words. **It is defensible only for the buyer the product is not being built for.**

*Falsifier, cheap and pre-registrable:* instrument the refusal in 20 real sessions. If users who hit a refusal complete the task at a **higher** rate than users who hit a full-file rewrite, it is a principle. If they abandon or re-prompt around it, it is an aesthetic and must be redesigned as refuse-and-offer-candidates, never refuse-and-stop.

---

### What this would have to become for the evidence to support it

Three options. One is cheap enough to run this month, and it is not in the plan.

**Option 3 — give the engine away and find out (recommended, ~1 week).** Ship the splice engine as an MCP server + Claude Code plugin + npm package, MIT, this week — `adeu`'s exact distribution. It tests four of the five links simultaneously and cheaply: whether the mechanism is wanted (installs), which substrate people ask for (`.md` vs `.docx` vs Google Docs — that answers link (a) empirically), who installs (link (c)), and whether anyone asks for an editor at all (link (d)). **Pre-register the kill number: fewer than 100 installs in 30 days means the mechanism is not wanted at any price, and the correct action is to keep it as a personal tool and stop.** Cost: one week against a 240-day plan. Information yield: higher than rounds 21–25 combined.

**Option 1 — the Obsidian bug-fix product.** Nested-construct preview (501 likes) plus vault-wide refactor with refusal (86 likes) as the *product*; byte-exactness as the *reason it works*, never the pitch. $49 one-time in USD. This is the only configuration where measured demand, the existing mechanism, and a proven monetisation model line up. Ceiling: Typora-shaped, low six figures. Adequate for one founder; not a company, and it must be sold as such.

**Option 2 — follow the liability, not the format.** `r22-t1`'s conclusion, taken seriously: markdown as intermediate representation the user never sees, `.docx`/Google Docs as the surface, Track Changes as the output, the liable services operator as the buyer — a population this founder already has five live engagements inside. Keep 3,614 lines, discard 21,793. Higher ceiling, entirely different company, and you enter it with no domain relationships beyond your own client list, which is also the fastest available source of ten real conversations.

**What must happen before any of them:** answer the founder-count question (every date is void without it), and rewrite MVP-0's exit criterion from *"six of ten run it"* to *"three of ten describe the review-cost problem before I name it, and two are still using it on day 30."* If that criterion cannot be passed, no build sequence saves this.

---

### What is good, specifically

The pinned 8,513-file corpus with byte-identical verification and 1,575 tests is work almost nobody does, and it is why a critique this harsh still concludes "there is something here." `r18`'s self-audit — commissioning six agents to open primary sources and reporting that **62% of your own claims needed correction** — is intellectually honest at a level I rarely see; the reports are consistently better than the record they feed, and their habit of opening with "what refutes the product, first" is correct epistemics. DECIDE.md is genuinely good: 2,373 words, every claim pointing down to where it can be checked. §95.2's concession — *"for one person editing their own prose, there is no reason to use this over a text editor and git"* — is the most credible sentence in 2.3 million words, and the instinct that produced it is the one to trust over the instinct that produced the other 2,342,908. And `r22-t3`'s refusal to raise is right, correctly argued, and would have taken most founders two years and 11% of the company to learn.

The problem is not competence, rigour, or code quality. It is that all three have been aimed at a buyer who has not been chosen, for 240 days, against a defect that is being fixed by someone else this quarter.

---

## 2. Market fit and positioning

Reconcile verified read-only earlier this session: `~/.claude` HEAD `6e390828`, unchanged; no commits or mutations from me; frontmatter HEAD `04938be` untouched.

---

**Byte-exactness is a Kano must-be — an attribute class whose own definition says presence yields neutrality and absence yields defection — and a must-be shipped free by a $0 incumbent with 16.1% developer penetration cannot be a value proposition at any price, which is why the honest Sean Ellis answer is not "under 40%" but "structurally unmeasurable, because the product is designed so nobody can be very disappointed."**

---

**The steelman, first, in full.** Agents now write into files humans are accountable for. The write path every incumbent uses is a full-file regeneration, and that path demonstrably destroys bytes it was not asked to touch — Cursor staff called doubled blank lines and destroyed carriage returns on CRLF "a known issue we're tracking" three days before this research began (`r24-v3`), Cline shipped four separate line-ending fixes in eight months with issue #13504 still open (`r25-w2`), and 75.8% of all 396 CRLF reports across seven agent repos were filed in the last eight months (`r25-w2`). arXiv 2605.14478 proves causally that context quality changes model output — stale-only retrieval produced stale references in 15/17 samples versus 0/17 with no retrieval (`r25-w5`). So: the substrate agents read and write is markdown, it is being corrupted, corruption changes what the next agent does, and one team has an engine that provably does not corrupt across 8,513 third-party files with 0 throws, re-runnable by the buyer in an afternoon. A real mechanism, a real incumbent defect, and a claim a prospect can falsify himself in five minutes. This is not a fake company.

Now take it apart.

---

**Kano classification of every major capability.** Five categories: Must-be (present → neutral, absent → defection), One-dimensional (monotone), Attractive (absent → neutral, present → delight), Indifferent, Reverse (present → dissatisfaction). Classified against counted evidence, not against how the feature feels to build.

| Capability | Kano class | The evidence that fixes the class |
|---|---|---|
| Byte-exact splice / no corruption (#40, #51, #55) | **MUST-BE** | 4 complaints in 12,556 editor comments; **0 of 355** comments in the highest-intent Obsidian-alternative thread mention corruption, byte, fidelity or round-trip (`r25-w4`); "byte-exact" = **30 comments in HN's entire all-time index** [measured, hn.algolia.com, 2026-08-31]. Nobody praises an editor for not corrupting files. They leave when it does. |
| Sync (#97–105) | **MUST-BE with a one-dimensional tail** | #1 loved, #3 hated, #1 switching trigger, 1,251 of 43,656 issues (`r24-v2`). **Not built.** Disqualification precedes delight. |
| Mobile (#150) | **MUST-BE** | "**Every** product opened has a first-class mobile story" [fetched, `r19-p5` #150]. Not built. |
| Per-hunk accept/reject (#124) | **MUST-BE, and recently so** | Zed: "You can accept or reject each individual change hunk, or the whole set of changes made by the agent" [fetched, zed.dev/docs/ai/agent-panel, 2026-08-31]. Free tier. Attractive in 2024; Kano's own drift (Attractive → One-dimensional → Must-be) has already run. |
| Nested-construct live preview | **ONE-DIMENSIONAL** | 501 likes — most-voted bug in Obsidian history — plus 96+82+50+36+33 (`r24-v2`). |
| Vault-wide refactor / rename with link rewriting (#14, #28) | **ONE-DIMENSIONAL** | 86 likes on broken-links-on-rename (`r24-v2`). The one place byte-exactness sells as a *capability* rather than a promise. |
| Import report — "here is exactly what will not survive in *your* vault" (#139, #145) | **ATTRACTIVE — the only credible one in 163 rows** | Nobody ships it; enumerates dropped constructs by count; demo, activation event and sales artifact in one file (`r19-p5`). |
| Refusal as a typed value (#41) | **REVERSE** | 323 issue-threads across 7 repos about being refused — "String to replace not found" 71, "File has been unexpectedly modified" 102, `"not unique" edit` 150 — **every one a complaint about the refusal, not a request for it** (`r25-w2`). |
| Decision card (#83), continuous certificate (#56), typed evidence tiers (#77), numeric-provenance linter (#78), machine-write regions (#91), locked sections (#107), tamper-evident export (#111), self-routing docs (#137), NF-4 key addressability (#45) | **INDIFFERENT** | Evidence column: `NONE` or `Categorical — no competitor does it`. Decision renders: 563 of 143,283,562 Obsidian downloads = 0.0004% (`r21-s6`). |

**The prediction "most features are INDIFFERENT" is refuted — and what replaces it is worse.** Counted over all 163 rows of `r19-p5` [measured by me, 2026-08-31]: **69 rows (42.3%) carry no `[measured]` or `[fetched]` demand evidence; 36 (22.1%) say literally `NONE`; 5 say `Categorical`; 3 say `Universal`.** The split is not random. Pile one of the `NONE` rows is commodity table stakes — view modes, sort controls, spellcheck, HTML export, Windows builds, roles, observability — where "no evidence" means *nobody complains about what everyone assumes*, i.e. **Must-be**. Pile two is ~17 rows that are precisely the product's distinguishing capabilities, and there "no evidence" means **Indifferent**.

> **Most features are Must-be. The *differentiators* are Indifferent.** A product whose commodity half is table stakes it hasn't built, and whose distinctive half has zero demand signal, has inverted the two piles.

*Falsifier:* a real Kano survey (functional/dysfunctional pairs) on 40 agent-CLI users. If ≥25% classify byte-exactness Attractive, I am wrong and the positioning stands.

---

**The Sean Ellis test, run as the thought experiment.** Instrument, verbatim [fetched, review.firstround.com, 2026-08-31]: *"After benchmarking nearly a hundred startups with his customer development survey, Ellis found that the magic number was 40%"*; screen on users who "used the product at least twice in the last two weeks"; ~40 respondents for directional validity.

| Step | The answer |
|---|---|
| Would 40% be very disappointed? | **The product is architected so the answer cannot be yes.** §27 ranks switching cost moat #7: *"Near zero, by design — This is the anti-moat."* §82.2: *"our file-is-the-source-of-truth stance deliberately removes lock-in… That is the right ethical choice and it raises churn."* Ellis measures the felt cost of losing the product; the architecture sets that cost to the price of reopening VS Code. |
| What do they fall back to? | Zed, free, which documents per-hunk accept/reject; or `git add -p`, which has done hunk review since 2007. Their files are untouched — that is the promise. |
| My predicted unsegmented score | **Under 10%.** Superhuman began at 22% *with* a beloved product; Slack cleared 40% at ~half a million paying users (First Round, verbatim). A product whose headline concern appears 4 times in 12,556 comments and 0 times in 355 high-intent ones does not start at 22%. |
| The steelman rescue | Superhuman's engine segments first: 22% → 33% by segmentation alone, 58% in three quarters. Segment to daily unattended-agent-on-markdown users and 40% is plausible **in that slice**. |
| Why the rescue fails | The slice is the TAM problem below. 40% of 400 people is 160 people. |

*Falsifier, dated:* by **2026-12-31**, 40 non-friend users who ran it twice in two weeks, surveyed. ≥40% very disappointed downgrades every FATAL below to SERIOUS. <20%, stop.

---

**Which segment is on fire.** Six personas (`r13-s3`), ranked by how badly they actually hurt:

| Rank | Persona | Cost of the pain today | Verdict |
|---|---|---|---|
| 1 | **P5 Ondrej, compliance-adjacent writer** | Real: a signed artifact that doesn't match its source is an audit finding | Fire exists. **Unreachable** — no SOC 2, no attorney review, 9–18 month cycle; §63.6 calls it a trap |
| 1= | **The liable services operator** (`r22-t1` — *not one of the six*) | Real and priceable: "two rounds of revisions" silently improved to "revisions until approval" is unbounded free labour | Fire exists. **Wrong substrate** — their document is `.docx`; `dealfluence/adeu` already ships this engine, MIT, as a Claude Code plugin |
| 3 | **P2 Nina, startup docs owner** | Docs/changelog/roadmap drift. Annoying, budgeted ($20–40/seat) | Warm. Needs multiplayer presence first — a second product |
| 4 | **P3 Kabir, agency lead** | Notion export = 900 files of `Untitled 3.md` | Warm. Blocked: **83% publish-refusal** from one YAML defect gates their entire job |
| 5 | **P4 Sena, AI-heavy knowledge worker** | Unreviewable agent diffs | The record's v1 target, and `r13-s3` states its own falsifier: *"the only measured instance of this persona is the founder's own machine"* |
| 6 | **P1 Devraj, solo dev** | He has `git diff`. 0 of 355 in the highest-intent thread mention his pain | Cold |

**Verdict: none of the six is burning.** Two adjacent segments are, both outside the product. Sequoia's Arc framework [fetched, sequoiacap.com/article/pmf-framework, 2026-08-31] settles the archetype: not Hair on Fire ("customers are actively wrestling with the problem") but **Hard Fact** — *"Your customers have resigned themselves to just living with the problem… The challenge to overcome is force of habit."* Hard Fact's operating requirement is market education. The education budget is ₹0 and two shipped blog posts, one defective since 2026-08-10 (`r25-w4`).

*Falsifier:* 20 outreach conversations. If ≥5 name whole-file rewrites as a real cost unprompted, P4 is a segment and this ranking is wrong.

---

**Positioning: what shelf does the buyer put this on.** "Byte-exact markdown editor" has no search volume, no G2 grid, no budget line. The buyer does not invent a category; he files you under one he has.

| Shelf the buyer reaches for | Who owns it | The number |
|---|---|---|
| **Markdown editor / notes app** | **Obsidian** | 16.1% of 30,065 SO2025 devs; editor free "without limits"; 7,092 plugins; 8 people, no investors. Free OSS floor: AppFlowy 76,040★, AFFiNE 71,976★, SiYuan 46,023★, Logseq 44,669★ |
| **AI code editor / agent surface** | **Cursor** ($20 reference price), **Zed** ($10, ships our demo free) | HN mindshare since 2025-01: `claude code` 41,222 comments, `cursor` 16,735, `zed editor` 982 (`r25-w2`) |
| **AI review of machine changes** — the only shelf where the JTBD is actually ours | **CodeRabbit $24–48/seat, Greptile $30/seat** | 4–9× our top tier, sold to teams with budgets (`r25-w3`) |
| **Docs platform** | Mintlify $450/mo, GitBook $65–249/site, ReadMe $100–150 | Not a shelf a solo founder enters |
| "Source-of-truth workspace" (§64.3's pick) | **Nobody — that is the problem** | The record concedes it: *"an unrecognised category has no search volume, no G2 grid, no budget line and no comparison page"* |

**The buyer files this under "another markdown editor" and the price on that shelf is $0.** Rs 299 = **$3.13** at ₹95.39/USD [ECB via frankfurter.app, rate date 2026-08-28] — 78% of what Obsidian charges for *sync alone*, in a category where 56 of 60 HN comments about paying Obsidian (93.3%) are about sync. And the evidence base carries **two FX rates 8.4% apart** — 95.39 in `r25-w5`/`r22-t3` versus ₹88 in `r25-w2`/`r25-w4` — silently moving every derived dollar figure. [measured] Fix that before quoting any of them.

*Falsifier:* if 25 sales conversations produce prospects who repeat the category noun back unprompted, the rename works and I am wrong.

---

**The TAM, with the arithmetic shown.** Four gates: (i) builds software with AI, (ii) keeps markdown in git in a way that creates the problem, (iii) bothered enough to switch editors, (iv) pays.

*Gates (i)–(ii), bottom-up, live-measured by me* [api.github.com, unauthenticated, 2026-08-31]:

| Quantity | Value |
|---|---|
| Public repos, `AGENTS.md in:path` | **4,649** |
| Public repos, `CLAUDE.md in:path` | **6,834** (`r25-w5` measured 6,836 yesterday — 2 repos of drift, so the count is stable) |
| Union at 15% assumed overlap | **≈ 10,800 public repos** [derived] |
| Private-repo multiplier | **Unmeasurable.** Sensitivity 3× / 5× / 10× / 20× |
| Humans per repo | 1.5 [inference — most agent-config repos are personal] |
| **Qualified population at 5×** | **81,000 humans** [derived: 10,800 × 5 × 1.5] |

*Gates (iii)–(iv):* switch-rate band 2% / 10% / 20% (the measured spontaneous-concern rate is **0.032%**, so even 2% is 62× the observed signal); pay-rate band 2.5% / 5% / 8% (developer free-to-paid median 5%, "half the non-dev rate"; Growth Unhinged median 8%; **25% of freemium products convert below 2.5%**, and a BYO-key, unmetered, no-signup, no-card free tier is structurally in that bottom band).

| Scenario | Payers | MRR at ₹599 | vs ₹20L/mo goal (3,339 payers) |
|---|---|---|---|
| Pessimistic (2% × 2.5%) | **41** | ₹24,260 / $254 | 1.2% |
| **Central (10% × 5%)** | **405** | **₹2,42,595 / $2,543** | **12.1%** |
| Optimistic (20% × 8%) | **1,296** | ₹7,76,304 / $8,138 | 38.8% |
| Generous branch (20× private multiplier, optimistic rates) | **5,184** | ₹31,05,216 / $32,553 = **$390,637 ARR** | 155% |

*Independent top-down cross-check:* 30.9% of developers use agents at work (SO2025) × 34.8% who use markdown files as a documentation tool (n=30,065) applied to a ~30M professional-developer base [SS — not fetched this session] = 3.23M; × the measured 0.032% spontaneous-concern rate = **1,032 people**; assume that rate understates felt need by 100× → 103,200; × 5% pay = **5,160 payers**. **Two independent routes land within 0.5% of each other at the generous end.** That agreement is the finding.

**How small? The plausible buyer population is 41 to 5,184 people, central estimate ~400.** Consequences, all [derived]:

- Central 405 payers × ₹383.5 contribution at ₹599 = **₹1,55,318/mo**, clearing the ₹1,08,918 survival nut (`r22-t3`) with ₹46,400 spare. **This is a real, if small, business.**
- Central 405 is **12.1%** of the ₹20L/mo target and **0.152%** of the 265,858 payers a $10M-ARR outcome needs.
- The generous branch's $390,637 ARR is **3.9% of $10M**. Not fundable, and `r22-t3` reaches that verdict by a different route.
- Retention binds twice: **only 2.7% of SaaS businesses with ARPA under $10/month** ever clear 100% NRR, top-quartile customer retention in the band is **63.1%**, and at c=4%/mo the stock asymptotes at **g/c = 804 payers** forever — *inside* my TAM band.
- Rule of 40 is not a defence: Feld's own framing is "at least $50 million in revenue" (`r25-w5`).

*Falsifier:* a measured public/private ratio for agent-config repos, or a demonstration that the qualifying population is "anyone with `.md` in a repo" (effectively all 180M+ GitHub developers — [fetched, github.blog Octoverse, 2026-08-31: "more than 180 million developers"; 1.1M public repos use an LLM SDK, 693,867 created in 12 months]) rather than "anyone with agent-context `.md`". If the wider set is real, every number rises 3–4 orders and this section collapses. I do not believe it: the wider set has no problem — `git diff` bounds their machine edits, which is why the five docs-drift Show HNs scored 1, 2, 2, 2 and 4 points (`r22-t1`).

---

**Ranked findings.**

| Sev | Finding | Quantified | What would change my mind |
|---|---|---|---|
| **FATAL** | **The differentiator is a Must-be shipped free by the category owner, so it cannot generate willingness to pay at any price.** Kite is the precedent and the record has no answer: 500,000 monthly-active developers, near-zero marketing, best technology in category, **$0** — *"Our 500k developers would not pay to use it"* | 4/12,556 · 0/355 · 30 HN comments all-time | 40 users Kano-surveyed, ≥25% classify byte-exactness Attractive |
| **FATAL** | **No segment is on fire; the two adjacent segments that are burning are unreachable (compliance) or on the wrong substrate** — `.docx`, where `dealfluence/adeu` shipped the same refuse-on-ambiguity engine MIT eight months ago, as a Claude Code plugin | 6 personas, 0 burning; adeu 149★, created 2025-12-30 | 5 of 20 agent-CLI users naming whole-file rewrites unprompted |
| **SEVERE** | **TAM ceiling is 41–5,184 buyers, central ~405. The ₹20L/mo goal needs 3,339 — 8.2× the central case** | See arithmetic | A measured private multiplier ≥20× **and** a switch rate ≥20% |
| **SEVERE** | **Price is wrong on three axes at once:** wrong *level* (₹299 = $3.13, below the $5/mo modal price and below Obsidian Sync's ₹381.56), wrong *axis* (56/60 Obsidian payment comments are about sync — unbuilt), wrong *currency* (every Indian company selling globally quotes USD; Craft serves Indian IPs ₹526.70, Superhuman ₹1,250, so ₹299 undercuts Indian WTP too) | `r25-w3` | A cohort paying ₹599/mo for 6 months at <5% churn |
| **SEVERE** | **The Sean Ellis instrument cannot pass on a product that deliberately sets switching cost to zero.** §27 rank 7 and §82.2 say so in the record's own words; §25's funnel and §82's ceilings never absorbed it | 2.7% of <$10-ARPA businesses clear 100% NRR | ≥40% very-disappointed at n≥40 |
| **SERIOUS** | **The refusal discipline is a measured REVERSE-quality attribute** — 323 issue-threads across 7 repos, all complaints about being refused, while the record markets refusal as the differentiator | 71 + 102 + 150 | A support corpus where refusal messages generate thanks, not tickets |
| **SERIOUS** | **42.3% of 163 features carry no measured or fetched demand evidence, and the differentiators cluster inside that 42.3%** | 69/163 · 36 literal `NONE` · 5 `Categorical` [measured by me] | Any one of the nine drawing unprompted demand from 3 of 20 interviews |
| **SERIOUS** | **The chosen v1 persona is the founder's own machine** — `r13-s3` says it outright | n=1 | The 20-conversation test above |
| **MINOR** | **Two FX rates in one evidence base** (95.39 vs 88.00, 8.4% apart) silently move every derived dollar figure | Fix before quoting | — |

Findings counted elsewhere and not re-litigated: Zed shipping MVP-0 (1), context-pack table stakes (5), decision renders undemanded (6), slop untouched (7), sync out of scope (8), 62% claim-correction rate (9), the learning loop (10), the 87-words-per-line ratio (11).

---

**What is genuinely good, specifically.**

1. **The engine is real and adversarially falsifiable by the buyer** — 8,513 third-party files, 7 vaults, 0 corruption, 0 throws, sha256-pinned, re-runnable via `npm run corpus`. Most founders cannot hand a sceptic a command that proves them right in five minutes.
2. **`DECIDE.md` §9 is a dated, observable kill-list** — "Fewer than 3 of 10 strangers care, Day 41"; "zero non-founder paid signups in 60 days, Day 130". Better falsification hygiene than most Series A companies practise, and the reason this critique could be written at all.
3. **`r19-p5`'s recommended cut is the best single idea in 2.2M words** — MVP = the file, the engine, and *the import report on a stranger's own vault*. The only Attractive-class candidate in 163 features; needs no new capability; demo, activation event and sales artifact in one file.
4. **`r22-t3`'s services path is arithmetically sound.** 54–78 client hours/month at ₹1,400–2,000/hr covers the whole nut, and the R0 calendar was always a one-person schedule, so the cost against the plan is zero. **This company cannot die of cash — only of time.** That reframes every FATAL above: the stake is not bankruptcy, it is a founder-year.
5. **The refuse-over-guess architecture is right even though it is commercially a reverse attribute.** An independent team converged on the identical design. Independent convergence is the strongest available evidence that a design is correct and the weakest possible evidence of a moat — and `r22-t1` says exactly that, to its credit.

---

**The one kill condition I would hold this to.** By **2026-12-31**: forty people who are not friends, family, or in the Discord, each running it on their own repository, surveyed with Ellis's exact wording. **If fewer than 40% say "very disappointed" and fewer than 5 of 40 name whole-file agent rewrites as a cost they already pay — stop the editor, keep the engine, and ship it as `adeu` shipped: a free MIT plugin inside the agent the buyer already runs, with the paid product built above it.** That is not a retreat; it is the only shape in this evidence base where our distribution is someone else's distribution, and it costs nine weeks instead of a year to find out.

---

## 3. Competitive survival

Read-only, verified 9 times, unchanged: `~/.claude` HEAD `6e390828` (2026-08-27), frontmatter HEAD `04938be`, zero commits by this agent, all dirty paths pre-date the session, writes confined to `$TMPDIR`. This hook is re-firing on pre-existing dirt; the verification will not change on further repetitions.

---

The single most damaging finding, in one sentence: **an unpaid solo developer shipped this product inside Obsidian nine months ago, gave it away, and has 15,064 GitHub stars and 1.96M registry downloads — while the plan spends 242 days reaching its first paying stranger and has explicitly banned itself from the channel that produced him.**

**The steelman, first and honestly.** There is a real, non-obvious, technically hard thing here that nobody else has built: a splice writer that changes only the bytes you touched, verified against an 8,513-file pinned corpus, with 1,575 tests and a refusal path where every competitor guesses. The incumbents genuinely have the defect — Cursor's own staff call doubled blank lines and destroyed carriage returns "a known issue" (`r24-v3`), Cline has shipped four line-ending fixes in eight months and issue #13504 is still open (`r25-w2`), and Obsidian's own sync doc concedes auto-merge "may sometimes create duplicate text or formatting problems" (§88.1). Agent-written markdown is growing, CRLF reports in this ecosystem are up 290% year over year (`r25-w2`), and when an LLM writes to a file, byte-preservation stops being invisible plumbing and becomes the reviewable diff. Under that reading, frontmatter is early to a defect class that is about to matter, holding the only correct implementation, and the failure of the market to ask for it yet is timing rather than absence. That is the strongest version. It is coherent, it is technically true, and it is not enough.

---

**NEW MEASUREMENTS TAKEN FOR THIS CRITIQUE** — all `[fetched]`/`[measured]` 2026-08-31, sources named so they can be re-run.

| # | Measurement | Value | Source |
|---|---|---|---|
| M1 | Obsidian community registry | **7,139 plugins · 143,290,675 cumulative downloads** | `raw.githubusercontent.com/obsidianmd/obsidian-releases` `community-plugins.json` + `community-plugin-stats.json`, HTTP 200 |
| M2 | Plugins whose name/description matches an AI/agent token | **782 plugins · 9,002,085 downloads · 6.28% of registry** | derived from M1 |
| M3 | **Claudian** — "Embeds Claude Code/Codex and other local Agents as AI collaborators in your vault" | **1,958,668 downloads · 15,064 stars**; repo created **2025-12-05**, 269 days → **7,281 dl/day, 56 stars/day** | registry + `api.github.com/repos/YishenTu/claudian` |
| M4 | **Copilot** (Brevilabs LLC) — "Run AI agents such as Claude Code, Codex, and OpenCode inside your vault" | **1,783,652 downloads · 7,651 stars**, live since **2023-03-31** | registry + GitHub API |
| M5 | Its price | Free BYOK **$0** · Lite **$7.99/mo or $74.99/yr** · Plus **$14.99/mo or $139.99/yr** · Supporter **$349.99** | `obsidiancopilot.com/en/pricing`, HTTP 200 |
| M6 | **Drift** — "Detects external file changes and shows side-by-side diffs with per-chunk…" — *our MVP-0 demo, as an Obsidian plugin* | **893 downloads · 8 stars**, created 2026-02-15 | registry + GitHub API |
| M7 | Star ratio, agent-in-vault : per-hunk-diff | **15,064 : 8 = 1,883 : 1** | derived M3/M6 |
| M8 | **Schema Refactor** — "Safely rename properties across Markdown frontmatter and Bases" — *DECIDE §3.2's flagship* | **66 downloads** | registry |
| M9 | Tag Wrangler (tag rename/merge) · Global Search and Replace | **1,067,863** · **65,569** | registry |
| M10 | Obsidian **Git** plugin — the JTBD incumbent, already installed | **3,075,875 downloads** | registry |
| M11 | Obsidian changelog, **484 releases 2020-07 → 2026-08**: occurrences of `llm` / `copilot` / `agent` | **0 / 0 / 0**. `artificial intelligence` = 1 (a 2020 alias example). `crlf` = 1, `line ending` = 2, `properties` = 383 | `obsidian.md/changelog.json`, HTTP 200 |
| M12 | Obsidian conflict-resolution setting actually shipped | **1.9.10, early access 2025-08-05, public 2025-08-18** — not the 2025-11-28 doc commit §88.1 dated it from. It is **12.5 months old**, not 9 | changelog JSON |
| M13 | Obsidian still actively fixing nested-construct live preview | **51 `live preview` hits in the 142 releases of 2025–26**; 2026-08-12 *"Fixed inline math in a list item or callout not rendering correctly"*; 2026-07-30 *"Fixed embeds inside Markdown lists not showing the correct indentation"* | changelog JSON |
| M14 | Stack Overflow 2025, IDE usage | VS Code **75.9%** · Cursor 17.9% · **Sublime Text 10.5%** · Claude Code 9.7% · **Zed 7.3%** | `survey.stackoverflow.co/2025/technology`, HTTP 200 |
| M15 | SO's own editorial verdict | *"Subscription-based, AI-enabled IDEs weren't able to topple the dominance of Visual Studio and Visual Studio Code this year… while relying on extensions as optional, paid AI services."* | same |
| M16 | This repo, today | **no `.github/workflows`**; 28-day file-changes `docs/` **292** vs `src/` **10** = **29.2:1**; **5 active commit-days in 28 (17.9%)**; `docs/` **2,343,005 words** vs `src/` **25,407 lines** = **92.2 words per line** | `git log` / `find` in the working tree |

**One honesty caveat that makes the rest credible:** Obsidian's registry `downloads` is cumulative across releases and includes updates. Claudian has 71 published versions, so a conservative floor is ~27,600 distinct installs, not 1.96M. **15,064 GitHub stars is the hard floor of distinct interested humans.** Frontmatter's is zero, and MVP-0's exit criterion is ten.

---

**FATAL — 1. There is nothing a user can perceive in the first session on a normal file, and the demo that would show it is free in two places.**

You asked me to be willing to say "nothing." Here is the precise, defensible version, which is slightly worse than "nothing":

| Session-one scenario | What frontmatter shows | What the user already has |
|---|---|---|
| LF file, ASCII, flat structure, agent edits 2 hunks | a reviewable diff | Zed: "accept or reject each individual change hunk" (finding 1). Claude Code: exact-string `Edit` that refuses on no-match |
| Same, inside Obsidian | — | Claudian / Copilot / Agent Client — **4,165,249 cumulative downloads across four plugins** (M3, M4, registry) |
| Same, in a git repo | byte-identical rejected file | `git diff` / `git add -p`, already installed **3,075,875 times inside Obsidian alone** (M10) |
| **CRLF file, or nested fence-in-callout-in-list, or a 6-file change** | **a visible, real, unmatched difference** | nothing equivalent |

So the differentiation is real and it is **conditional on an adversarial file**. That is a demo that requires you to hand the user a file crafted to break the competitor. Every operator who has watched a founder do that on a call knows what the room thinks. And the record already concedes it: *"for one person editing their own prose, there is no reason to use this over a text editor and git"* (DECIDE §3.1).

Combined with finding 2 — 4 complaints in 12,556, `"line endings"` in **1 of 43,656** issue titles — the position is: a difference that is invisible unless staged, in a defect class 0.03% of users have ever mentioned.

**Falsifier:** hand ten strangers their own real repository and the binary, unstaged, with no CRLF setup. If ≥6 of 10 spontaneously notice a difference from their current tool *without* being shown the corrupted-file comparison, I am wrong. This is already DECIDE §9's day-41 test; run it at day 5 with a prototype instead.

---

**FATAL — 2. Obsidian does not need to ship markdown-aware AI editing. Its ecosystem shipped it, for free, and we banned ourselves from that ecosystem.**

You asked what happens to us if Obsidian ships better markdown-aware AI editing. The answer is that **the question is already resolved and we lost it**, in a way §88.2's Scenario A did not model.

- Obsidian has shipped **zero** first-party AI in 484 releases across six years (M11). They will not build it.
- They do not have to. **Claudian** put Claude Code inside the vault in 269 days and took 15,064 stars (M3). **Copilot** has been doing it since March 2023 and charges **$14.99/mo** (M4, M5).
- Obsidian captures 100% of the resulting retention, pays zero engineers, and takes zero support load. This is the strongest structural position in the category and it is unavailable to us **by our own decision** — BUSINESS §86 bans third-party plugins on security grounds.

§86 scores that ban against community cost. It does not price the thing that actually matters: **the plugin registry is not our community risk, it is our competitor's distribution engine, and it is 143,290,675 downloads deep.** §88.2 asks "what if Obsidian ships conflict review" and answers "reposition." The real question is "what if a volunteer ships our whole product inside Obsidian," and the answer is that he did, in December, and neither §86 nor §88 mentions him.

**Falsifier:** show me an Obsidian plugin with >1M downloads that a standalone competitor beat by being outside the ecosystem. I could not construct one. If Files.md (730 HN points, 2026-05-18, `[fetched]`) or any 2026 standalone converts a meaningful paid base against the plugin incumbents within 12 months, this downgrades to SEVERE.

---

**SEVERE — 3. The asymmetry is not what you think, and the honest answer to "how long would it take them" is worse than "one sprint."**

| Party | What erasing us requires | Elapsed time | Evidence |
|---|---|---|---|
| **Zed** | **Nothing for the demo — shipped and documented.** For fidelity: preserve line endings on the apply path. Bounded bugfix; they already have the issue (#60063, "Staging hunks in CSVs change line endings", 2026-06-29) | **0 days for the demo · 1–2 sprints for fidelity** | finding 1; `r25-w2` |
| **A single unpaid volunteer** | **Nothing. Done.** Claudian, one developer, 269 days, 15,064 stars, no CI required, no PRD, no corpus | **already happened** | M3 |
| **Obsidian** | Flip the existing *Create conflict file* default. The setting shipped **2025-08-18** | **0 days (config change)** | M12 |
| **Brevilabs (Copilot plugin)** | Nothing — already monetising at 2.5–4.8× our price with 1.78M downloads and 3.4 years of head start | **already happened** | M4, M5 |
| **Anthropic** | Add a diff-review affordance to Claude Code; the `Edit` tool already exact-matches and hard-refuses | **one release** | `r25-w2` |
| **Cursor** | Fix the defect their own staff already call known | **1–2 quarters, and they are incentivised** | `r24-v3` |
| **GitHub** | Ship a prose mode over `github.dev` | **12–24 months, and they don't need to** | §88.4 |
| **A funded 8-person rival** | Build it; every dependency is free (`yaml` 202M/wk) | **6–9 months to parity, 0 to the claim** | §88.6 |

**The finding is not "one sprint." It is that the shortest fuse on this table already burned down, and it was lit by someone with less capital than you.** The plan's implicit theory of defensibility — hard engineering that a big team would not bother to do — is refuted by a solo developer who did not do the hard engineering at all and won anyway, because he did not ask anyone to move.

Note what §88's moat matrix already concedes and what this adds: moat #2 (byte-fidelity) survives outright in **2 of 6** columns; #7 is GONE in all six; #6 in all six. This adds a seventh column — *volunteer inside the incumbent* — in which #1, #2, #5, #6 and #7 are all GONE on day one.

**Falsifier:** if Claudian's star growth (56/day) collapses below 5/day by 2026-12-31 while its issue tracker fills with fidelity complaints, the volunteer threat is a fad and this is SERIOUS not SEVERE. Track `api.github.com/repos/YishenTu/claudian` monthly; it costs one curl.

---

**SEVERE — 4. "We are more correct" has a measured, dated losing record in this exact market.**

You asked for real precedents and what they had in common. Here they are, with the outcome quantified rather than asserted.

| Tool | Superior on | Outcome, dated | Margin |
|---|---|---|---|
| **Sublime Text** | native, order-of-magnitude faster startup, lower memory than Electron | **10.5%** usage vs VS Code **75.9%**, SO 2025, n=49k+ `[fetched]` | **7.2 : 1 against** |
| **Kite** | best ML completion of its era; 500,000 MAU, near-zero marketing | dead 2022-11. *"Our 500k developers would not pay to use it."* | 500,000 → $0 |
| **Atom** | the editor that created the category | sunset by its own owner, 2022-12 | absorbed |
| **Fig** | beloved, precise, narrow | acquired by Amazon 2023-08-28, folded into CodeWhisperer 2024-02 | feature, not company |
| **Arc** | most-praised browser design of its generation | **Atlassian acquires The Browser Company, 2025-09-04** (HN 523 pts) `[fetched]`; product deprioritised for Dia | absorbed |
| **Obsidian Drift** | literally our demo, correctly built | **893 downloads, 8 stars** in 197 days | 1,883 : 1 against Claudian |

**What they have in common, stated as a mechanism rather than a moral:**

1. Each was better on an axis the buyer ranked **below** free, ecosystem, and habit. Kano puts byte-exactness in Must-be — "done well, customers are just neutral" (`r25-w5`). You cannot build a value proposition on a disqualifier avoided.
2. **None of them owned a distribution surface.** VS Code had Microsoft and the marketplace; Sublime had a download page. Claudian has the Obsidian registry; frontmatter has a Show HN slot with a **median of 3 points across 386 launches** (`r25-w5` R3).
3. **Each asked the user to move.** Every survivor in `r25-w5` — Zed, Raycast, Linear, Obsidian, Warp — either replaced a daily-frequency surface or monetised an axis on top of an existing habit. None monetised correctness.
4. Stack Overflow's own 2025 conclusion is the epitaph, verbatim: subscription AI IDEs *"weren't able to topple the dominance of Visual Studio and Visual Studio Code this year… while relying on extensions as optional, paid AI services"* (M15). **The winning pattern in this market is the incumbent plus a paid extension.** That is the exact shape §86 forbids us from being.

**Falsifier:** name a prosumer or developer tool since 2015 that beat a free, well-distributed incumbent primarily on correctness, with the incumbent's category-leading position intact at the time. I looked and could not find one. One credible example moves this to SERIOUS.

---

**SERIOUS — 5. The MVP-1 wedges promoted in DECIDE §3.2 are already occupied, and the unoccupied slice has 66 users.**

DECIDE §3.2 responds to the byte-exactness refutation by promoting three replacements. Measured against the registry, where the users actually are:

| DECIDE §3.2 wedge | Measured occupancy | Verdict |
|---|---|---|
| Vault-wide refactor — **rename a tag** | Tag Wrangler, **1,067,863 downloads**, free (M9) | occupied |
| Vault-wide refactor — **search & replace** | Global Search and Replace, **65,569**, free (M9) | occupied |
| Vault-wide refactor — **rename a property key** | **Schema Refactor, 66 downloads** (M8) | *unoccupied and unwanted* |
| Nested-construct live preview (501 likes) | Obsidian shipped **51 live-preview fixes in 24 months**, three in the last five weeks (M13) | actively contested by the incumbent, on their surface |
| Sync, reframed | the one with real demand — and out of scope (finding 8) | see below |

The 1,461 likes on tag-rename and vault-wide replace are real. They are also **already served by a free plugin with a million installs**, which is why the likes stopped converting into anything. The slice that is genuinely ours — frontmatter-key rename, done provably — has a measured audience of 66 people.

And the live-preview wedge asks you to ship an entire editor in order to win a rendering bug **in someone else's application**, on a surface they patch monthly. That is not a wedge; it is a bug report with a business plan attached.

**Falsifier:** if Schema Refactor crosses 5,000 downloads by 2027-02, or if a "property rename" request crosses 200 likes on forum.obsidian.md, the demand exists and I am wrong.

---

**SERIOUS — 6. The revealed willingness-to-pay for exactly this product is 2.5–4.8× your price, and it is charged by a plugin.**

Findings 3 and 4 established that price is the #1 complaint and that ₹299 sits below Obsidian Sync. The new number sharpens it in the opposite direction from what the record assumes: **Brevilabs charges $7.99–$14.99/month and $349.99 lifetime for AI-in-your-vault, on top of a free app, with 1.78M plugin downloads** (M5). Against ₹599 = $6.28 (§88.1, FX 95.39 on 2026-08-28).

So the market does pay for this. It pays **more than you are asking**, to a plugin, on top of a free editor, with no editor to maintain. Pricing below the plugin that runs inside your competitor is not a bargain; it is a statement that you believe you are worth less than an add-on. Cross-reference `r25-w5` R1: at $3.13–$6.28 ARPA, the top quartile NRR ceiling is **70%** — best-in-class 110% retention is arithmetically unreachable before a line of code is written.

**Falsifier:** if Brevilabs' paid conversion is under 0.5% of 1.78M downloads, the WTP signal is weak and this is MINOR. I could not measure their paid base; that is `[SS]` and should be treated as such.

---

**SERIOUS — 7. The early-warning signal that does not need a customer got worse while this research round ran.**

§88.11 EW-2 fires at doc:src >3:1 or density <20%. Measured 2026-08-30 in the record: **22.3:1** and 17.9%. Measured by me today, one day later:

| Metric | 2026-08-30 (record) | **2026-08-31 (measured here)** |
|---|---|---|
| `docs/` : `src/` file-changes, 28d | 22.3 : 1 | **29.2 : 1** (292 vs 10) |
| Active commit-days in 28 | 17.9% | **17.9%** (5 of 28) |
| Words of docs per line of source | 87 | **92.2** (2,343,005 / 25,407) |
| CI | absent | **absent** — no `.github/workflows` |

§88.12's second pre-mortem is titled *"The document became the product."* It was written on 2026-08-30 and the ratio it warns about worsened by 31% in the twenty-four hours after it was written, **by the act of writing about it**. That is not irony; it is the measurement doing its job and being ignored in real time. Finding 11 (87 words per line) is now 92.2.

**Falsifier:** none needed — this is a live counter. Re-run the two commands in §88.11 weekly. If the ratio is under 3:1 across two consecutive 14-day windows by 2026-10-15, the concern is retired.

---

**MINOR — 8. A dating correction to §88.1, offered so it is not quoted wrong again.**

§88.1 dates Obsidian's conflict-resolution setting from a help-doc commit of 2025-11-28 and derives "roughly nine months" of maintenance from it. The changelog shows it shipped in **1.9.10, early access 2025-08-05, public 2025-08-18** (M12). The feature is **12.5 months old**, and §88.2's "prior work already done — the hard half" is 40% more done than stated. This is finding 9's pattern (62% of load-bearing claims need correction) reproducing on the war-game itself; the correction makes Scenario A slightly worse for us, not better.

---

**WHAT IS GENUINELY GOOD, specifically.**

1. **§88 is the best document in the corpus and the pre-mortem is better than most funded companies produce.** §88.7's line — *"Four thousand views over nineteen months is a real problem that did not produce a market"* — is the correct reading of your own strongest evidence, against interest. §88.13's "irrelevant if false" is exactly the right terminal question.
2. **The engine is real and the corpus is the one asset nobody can copy by claiming.** 8,513 pinned files, 1,575 tests, byte-identical verification. §88.6 is right that a funded team can *say* byte-exact on day one and cannot *show* it. Executed measurement is a durable asset even when the product is not.
3. **`r24-v2` and `r25-w2` are the two best research artefacts here** because both open by refuting the thing that commissioned them. The 4-in-12,556 measurement and the Zed sentence are the two facts that should have been bought first and were bought anyway.
4. **frontmatter is sgnk-md** (202 of 228 files byte-identical). This is not a greenfield bet with a sunk-cost problem; it is a rename. The cost of abandoning the *pitch* is close to zero, which is the single most valuable structural fact in the whole file.
5. **§88.13's survivable-if-true is correct and I would build only that.** The engine sold as a CLI and library, priced, in month two.

---

**THE WEDGE, JUDGED AGAINST THE INCUMBENTS RATHER THAN IN ISOLATION.**

| Candidate wedge | Demand, measured | Nearest incumbent | Survives? |
|---|---|---|---|
| Per-hunk review of agent edits | Drift: **8 stars** (M6) | Zed, free; Claudian, free | **No** |
| Byte-exactness as a promise | 4 / 12,556 (finding 2) | Kano Must-be | **No** |
| Vault-wide property refactor | 66 downloads (M8) | Tag Wrangler, 1.07M | **No** |
| Nested-construct live preview | 501 likes, real | Obsidian, patching monthly (M13) | **No — wrong battlefield** |
| **The merge that does not lie** — provably safe conflict resolution over sync you already have | #1 loved, #3 hated, **#1 switching trigger**, 1,251/43,656 issues (finding 8); Obsidian's own doc admits auto-merge duplicates text (§88.1); a *paid* category at $4/mo | Obsidian Sync, Remotely Save (2.19M dl) | **Yes — and the record declared it out of scope** |
| **The certificate / engine as a paid CLI + MCP tool the agents call** | unmeasured, but it converts every competitor into a channel (`r25-w2` Q4, §88.13) | none | **Yes — and it is priced like a plugin** |

**The genuine wedge, if one exists, is the second-to-last row, and it is the one thing you have refused.** Sync is the only axis in the entire evidence base where demand is #1, the incumbent's own documentation concedes the defect, there is a proven paid category, and your engine is the literal mechanism of the fix. The record's refusal of CRDTs was correct and is not the same decision as refusing sync — you refused the *transport* and then, in the same move, gave away the *merge*, which was the only part you were uniquely qualified to own.

The second wedge is real but honest about its ceiling: `r25-w2` already named it — *"be the thing their agent writes into"* — and named the price of it: **a plugin-shaped business, priced like a plugin.** Given M4 and M5, plugin-shaped is not an insult. It is the only business in this category anyone has been measured getting paid for.

---

**THE ONE FALSIFIABLE KILL CONDITION.** Not "keep building and see":

> **By 2026-10-15 — six weeks, not 242 days — twenty competent markdown users are asked one unprompted question ("can you name the last time a tool ate your work?") and ten strangers are shown a priced page with a real checkout. If fewer than 4 of 20 name an unprompted incident, and there are 0 paid checkouts, stop building the editor and ship the engine as a priced CLI.**

Everything in §88.11 already says this. §88.7 says the test costs days. EW-1's threshold is *0 strangers asked by day 45*. Today is day 0 of that clock and the counter reads zero.

**The sentence I would say on the call:** you have spent 2,343,005 words proving that you are right, in a market where a volunteer proved in 269 days that being right is not the thing being bought — and the most expensive fact in this critique is that he built it inside the competitor you decided not to build inside.

---

## 4. The features, one by one

Reconcile verified — `~/.claude` HEAD `6e390828` unchanged, all 20 dirty paths pre-existing, no writes or commits by this subagent.

---

**The record contains a written five-gate feature-admission test (§103) whose first gate demands a named user and a named frequency — and of the 163 features in its own inventory, 11 name a frequency and 1 names a persona, which means 162 of 163 fail gate one on the document's own text, and the reason the roadmap holds 650 points is that nothing has ever been made to earn its place.** [measured: `grep` over `PRODUCT.md:655-862`]

---

**WHAT IS GOOD, SPECIFICALLY**

| | Why it is genuinely good |
|---|---|
| **§103's admission test** | Five gates, each answered by an *artifact* not an opinion, with an asymmetric burden (proposer carries the clock) and a tie-break that converts "users want this" into "we disagree about G1". Companies twenty times this size do not have one. The failure is not the test — it is that only 10 of 163 features were ever run through it (6.1%) |
| **`r24-v1`** | The best report in the 97. It read the source, ran the module in Node, and produced the company's single most persuasive artifact: `table-edit.ts` turning 100 bytes into 84, rewriting 3 of 5 lines on a one-cell edit, and taking a CRLF file from 4 carriage returns to 1. That is a working demonstration, in your own repo, of exactly what regenerating costs |
| **§40's refusal taxonomy** | 11 codes, 4 fixed slots, 280-char budget derived from Postgres + RFC 9457 + rustc with the divergences written down, `modal: never`, and an explicit ban on badging the guarantee. This is better than what most funded editors ship |
| **The measured numbers hold** | I re-verified two at random. `splice-frontmatter.ts` has exactly **20** `return src` sites today [measured]. USD/INR is **95.39** [fetched frankfurter.app 2026-08-31, rate date 2026-08-28], so §93's ₹95.39 is right and `r25-w2`'s ₹88 is the outlier — ₹299 = **$3.13**, not $3.40 |
| **`r24-v4` step 5** | `57,039 bytes unchanged — hash verified` is the only sentence in this entire corpus that a competitor structurally cannot write. Keep it |

**STEELMAN.** Agents now write more markdown per week than humans do, every incumbent that writes it regenerates the file, and regeneration silently drops reference-link definitions, doubles blank lines and destroys carriage returns — Cursor staff called this "a known issue we're tracking" three days before you looked, and Cline shipped four line-ending PRs in eight months and still has an open issue (`r24-v3`, `r25-w2`). A byte-addressing engine that refuses rather than guesses is the correct architecture for that world, it exists, it is tested against 8,513 files, and no competitor can retrofit it because their write path is a serializer. The product is the one editor that can print a hash proof of what it did *not* touch. That is a real technical position and I am not going to pretend otherwise.

Now the audit.

---

**FATAL — 1 finding**

**F1. The feature inventory cannot be audited, because it does not record what an audit needs — and 130 of its 650 points are committed to features whose own evidence column reads NONE.**

| Measurement | Value |
|---|---|
| Inventory rows | 163 |
| Total build cost | **650 pts** = 708.5 calendar days at §95's own 1.09 conversion = **1.94 years solo** [derived] |
| Rows whose Evidence column is literally `NONE` | **36 (22.1%)** |
| Rows whose only evidence is `[inference]` | 7 (4.3%) |
| **Rows with no observed signal at all** | **43 (26.4%)** |
| Points in the NONE rows | **130 pts = 141.7 calendar days** |
| Points in the entire MVP-0 + MVP-1 + MVP-2 plan | **125 pts = 136 days** |
| Rows naming a frequency | **11 (6.7%)** |
| Rows naming a persona (P1–P5) | **1 (0.6%)** |
| Rows ever run through §103's admission test | **10 (6.1%)** |

The NONE block costs **104% of the entire three-stage plan through 2027-01-14.** It contains, at M or larger: tag rename/merge/nest, continuous certificate, vault-level engine ops, decision card, Marp slides, named-version history, publish/unpublish (L), custom domains + wildcard TLS, AEO linter, CriticMarkup interchange, **a 29-endpoint typed RPC HTTP API (XL)**, PATs/webhooks, retro-capture, quick capture + `HOME.md`, browser plugin, Windows/Linux builds, multi-vault bindings, and roles/permissions/sharing (L).

You asked me to kill anything that cannot name a user and a frequency. Applied literally, the rule removes 26.4% of the inventory and 20% of its cost, and it removes the wrong things — it kills Windows builds (#149, NONE) while sparing Marp slides. **The rule is right; the inventory is unscoreable, so the rule cannot execute.** That is the fatal part: you have a governance mechanism and a corpus it cannot read.

It is FATAL rather than SEVERE because §94's own closing paragraph concedes the alternative — deterministic projections out-install every AI capability 7.25× — and then puts them fourth anyway. A 650-point inventory with no frequency column and a documented tie-break that never ran is how a solo founder spends 1.94 years and arrives with no users. §53's constraint ("One person") makes the arithmetic unsurvivable, not merely uncomfortable.

**Falsifier:** produce a version of §94 with a `frequency` column filled for ≥120 rows from anything other than a founder's guess — support tickets, issue counts per command, or the `U` metric §103 already defines. If ≥60% of rows survive with a weekly-or-better frequency, this finding collapses to SEVERE and the inventory is merely large.

One internal contradiction to fix while you are in there: **#28 "Rename with link rewriting" carries `NONE`** in §94, while `DECIDE.md` §3.2 cites **86 likes** on broken-links-on-rename from `r24-v2` and calls it "byte-exactness sold as a capability." Your two Tier-0 documents disagree about the evidence for the same feature.

---

**SEVERE — 4 findings**

**S1. The table-stakes floor is 17.5 engineering days and appears in exactly zero of the three MVP stages.**

`grep -ci "hotkey|keybind|shortcut|palette|table edit|outline"` over `PRODUCT.md:906-1048` — the entire MVP-0/1/2 plan through 2027-01-14 — returns **0** [measured]. Not "low priority." Absent.

| `r24-v1` gap | Cost | In any MVP? |
|---|---|---|
| ⌘1–6 headings, ⌘K link, list/quote/task toggles, checkbox toggle, move-line-up/down | 0.5 d | No |
| Outline hotkey + fuzzy heading jump | 0.5 d | No |
| Command palette that indexes everything and shows hotkeys | 1–2 d | No |
| Quick-switcher deltas (recents-on-empty, Enter-to-create, ⌘Enter new tab) | 0.5 d | No |
| HTML paste → markdown | 2–3 d | No |
| Table editing: Tab nav, add/remove row+col, alignment | 5–8 d | No |
| Splice-backed table writes | +2 d | No |
| Customisable keymap | 3–4 d | No |
| **Total** | **13–21 d, midpoint 17.5** | **0 of 8** |

Your brief says "a reviewer who cannot find quick-switch stops writing the review." **Correct the premise: you have quick-switch.** `Spotlight.tsx` on `mod+k` with subsequence-ranked fuzzy match, verified live — `useHotkey("mod+k", openSpotlight)` at `KnowledgeUI.tsx:56` [measured]. The floor gap is not discovery. It is *formatting*: `CodeMirrorEditor.tsx:224-226` binds exactly **three** formatting keys — `Mod-b`, `Mod-i`, `Mod-e`. No ⌘1–6. No list. No quote. No task. `toggleTaskAtLine` is already written at `toolbar-transforms.ts:112` and simply unbound.

**And here is the finding nobody in the 97 reports made:** you bound ⌘K to the quick-switcher. In Typora, Bear, iA Writer, Obsidian and VS Code, **⌘K is insert-link** — and every one of them puts the switcher on ⌘O or ⌘P. So the single most-muscle-memoried key in markdown editing does the wrong thing, and the thing it does has a conventional home you left empty. A reviewer discovers this in the first ninety seconds, by pasting a URL over a selection and hitting ⌘K.

**The scheduling arithmetic is worse than the day count.** §95 converts at 1.09 calendar days per point and asserts the measured 25% active-day density is *inside* that rate. I checked the density: **8 distinct commit days in the last 32 = 25.0%** [measured, `git log`] — the record's figure is right. But then 17.5 engineering days of floor work is **70 calendar days if those are person-days, 104–140 if `r24-v1` meant pair-days** — against the ~18 points §94 would assign the same work, which converts to **19.6 calendar days**. The record's conversion rate is optimistic by **3.6× to 7.1×** against the one estimate in the corpus derived by reading the actual source.

**Falsifier:** implement `r24-v1` items 1–4 (claimed 3 days) and time it. If it lands in ≤4 working days, the conversion rate holds at the small end and this drops to SERIOUS. If it takes ≥10, every date in §95 is fiction and MVP-0's 2026-10-11 should be restated.

**S2. The flagship interaction is a free feature of a competitor, and its cost grows with the thing that makes it necessary.**

I re-verified Zed live today rather than trusting `r25-w2`. `https://zed.dev/docs/ai/agent-panel`, HTTP 200, 2026-08-31, verbatim: *"You can accept or reject each individual change hunk, or the whole set of changes made by the agent."* Plus inline: *"the same keep/reject hunk controls as the multi-buffer review pane."* [fetched] Zed's editor is $0.

Now the usability attack you asked for. Model a 40-hunk agent change through `r24-v4`'s own step 6 (`Tab`/`Shift-Tab` walk, `y`/`n` per hunk):

| Quantity | Derivation | Value |
|---|---|---|
| Keystrokes, minimum | 40 × (1 nav + 1 decision) | **80** |
| Words that must be read to judge | 40 hunks × ~110 words (old span + new span + one sentence context either side) | **~4,400** |
| Reading time, careful judging @200 wpm | 4,400 / 200 | **22 min** |
| Reading time, skim @300 wpm | 4,400 / 300 | 15 min |
| Decision latency @3 s/hunk | 40 × 3 s | 2 min |
| **Total review** | | **17–25 min** |
| Agent generation time | | **~60 s** |
| **Review : generation ratio** | | **17–25 ×** |

The ratio is the product's structural problem, and it gets *worse* as agents get better, because better agents produce larger changes. The market's revealed preference is documented and it is not on your side. The person who coined the working style your target users are in wrote the spec himself: *"I 'Accept All' always, I don't read the diffs anymore"* [fetched, HN 44780165, quoting Karpathy]. And empirically, larger agent changes are *less* likely to merge at all — logistic regression over the AIDev dataset finds "larger change sizes ... associated with a lower likelihood of merging" [fetched, arXiv 2602.19441, 2026-02-23]. A 40-hunk review is not a feature you are selling; it is the failure state your users route around.

**Is it better than `git add -p`, which is free?** Partly — and less than the record claims. §95.2 asserts that *"'reject' in every other tool means 'revert to the last commit and lose the four good changes too'."* **That is false and was checkable in ten seconds.** On this machine, git 2.50.1: `git restore -p`, `git checkout -p` and `git add -p` all report `-p, --[no-]patch  select hunks interactively`, and `git restore --patch` "interactively select[s] hunks in the difference between the restore source and the restore location" [measured, `git help restore`]. Per-hunk *discard* of an agent's uncommitted changes ships free, offline, in every git install, and has for years.

What genuinely survives: word-grain hunks instead of line-grain; hunks in an open buffer with unsaved changes, which git cannot see; and the hash line. That is a real but *narrow* delta, and §94 prices `land()` + review surface at **16 of MVP-0's 38 points (42%)** to reach parity with a documented free feature plus a delta you can state in one sentence.

**Falsifier:** put the two side by side in front of ten strangers with a 40-hunk agent change. If ≥6 finish the review in your surface and ≥3 abandon it in `git add -p`, the delta is real and worth 16 points. If ≥5 hit "accept all" in both, the interaction is theatre and MVP-0 has no demo.

**S3. The refusal moment costs the user 100% of an action's value and delivers a benefit that is, by your own rule, unshowable.**

Model the actual moment, using `r24-v4`'s own copy. User selects a paragraph, ⌘J, "restructure." Engine emits `UNLOCATABLE` before any model call: *"Nothing changed. This selection spans the start of a fenced block, so the engine could not find one unambiguous range."* `Show me`.

| What happens next | Why | Cost to us |
|---|---|---|
| Adjust selection, retry | Best case. Requires the user to hold the concept "fenced block boundary" | +5 s, benign |
| Not understand the message | The headline names a **mechanism**, and §40's own anti-pattern table bans implementation nouns in tier 1. "Spans the start of a fenced block" is an implementation noun in a cardigan | Silent confusion |
| **Do it by hand** | **We added a step and removed nothing.** This is the modal outcome for prose selections | Net negative |
| Alt-tab to Claude Code, which will just do it | The competitor never refuses. Its corruption is invisible; our refusal is not | Churn |

The asymmetry is the whole finding: **the refusal's benefit is that nothing happened, and §40 correctly forbids you from celebrating it** — *"do not badge it. A celebration on every refusal becomes chrome."* So the product's founding principle is simultaneously the value proposition and the thing you have written down that you may not show.

The market evidence is one-directional. `r25-w2` counted **323 issue threads about refusal messages across 7 repos** — "String to replace not found" (71), "File has been unexpectedly modified" (102), `"not unique" edit` (150) — and **every one is a complaint about being refused, not a request for it** [measured]. Claude Code already refuses. Users already hate it. You are proposing to sell the thing they file issues about.

And today the refusal is not even renderable: 20 `return src` sites in `splice-frontmatter.ts` make a refusal byte-identical to a successful no-op, and `PropertiesPanel.tsx` drops it at `if (!onEdit || next === content) return;` [measured, re-verified at HEAD]. `r21-s7` is right that the discriminated-union return is the highest-leverage engineering item you own — it is not on MVP-0's list.

**Falsifier, and it is a pincer:** instrument `cert_refusal` per activated user per 30 days, which §94 already proposes. If **fewer than 1 in 20** activated users hits any refusal, the refusal UX is not a churn risk — but then §94's own stated falsifier fires and the six visible engine moments are theatre. If **more than 1 in 5** hits one, this is SEVERE as written. There is no value of that metric at which both the refusal-UX defence and the engine-as-differentiator claim survive together.

**S4. The plan bans configuration, and the shipped settings surface is five booleans — one of which is a feature the record says it refuses.**

`editor-settings.ts` ships exactly: `vimMode`, `lineNumbers`, `spellcheck`, `focusMode`, `aiGhostText` [measured]. §103's gate G5 makes "a configuration surface an automatic fail, not a trade."

`grep -ci "font size|zoom|dark mode|word wrap|appearance"` over all 169 KB of `PRODUCT.md`: **0** [measured]. Font size, zoom, theme, editor width, word wrap and tab size do not appear in a 163-row inventory that includes Marp slides and a companion browser plugin. These are not configuration bloat; they are the first three things a person does in a new editor, two of them are accessibility affordances, and one of them (#34 accessibility baseline, M, evidence "legal exposure") is in the inventory while the actual control that delivers it is not.

Meanwhile `aiGhostText` — which §11.4 explicitly refuses ("no ghost text by default") — is shipped, wired through a CodeMirror compartment, and uploads the **entire document prefix** on every 650 ms idle to a server that keeps the last 1,500 chars: ≈210 KB/min to discard 95% of it [measured, `r24-v4`]. The one setting you built is the one you wrote down that you would not.

**Falsifier:** ship to 20 users and count support contacts. If zero ask for font size or a light/dark control in 30 days, G5 is calibrated correctly and this is MINOR.

---

**SERIOUS — 3 findings**

**R1. Nine of the eleven day-one absences are not in the inventory at all.** §94 claims "omission is the failure mode" and lists borderline items rather than curating them away. Missing entirely: font size / zoom; theme / appearance; word wrap; editor width; tab size; an in-app "report a bug" path (§95.3 provides one email address and no affordance to reach it); and — the important one — **any scope control on what an agent may write.** `grep -ci "allowlist|denylist|scope control|which files|permission to write|gitignore"` over the full inventory returns **0** [measured]. §12's `land()` carries `base_version` for drift, but nothing in 163 rows lets a user say "the agent may touch `docs/` and not `src/`." For a product whose entire pitch is adjudicating agent writes, that is a stranger omission than any of the twenty features it did list with evidence NONE.

Present-but-cut-from-every-stage: Windows/Linux builds (#149, evidence NONE, cut) and mobile (#150, which §16.2 ranks **the #1 churn-risk gap**, cut). The three-stage plan through 2027-01-14 ships a macOS-only desktop product to a globally distributed developer audience.

**R2. The ₹299 tier is not the pricing problem; the fact that the record has two exchange rates is.** §93 uses ₹95.39/$; `r25-w2` uses ₹88/$ [inference; rate unverified]. Live: **95.39, rate date 2026-08-28** [fetched]. So ₹299 = **$3.13** and ₹599 = **$6.28** — `r25-w2`'s $3.40/$6.80 overstate by 8.4%, which makes its conclusion *stronger*: your top tier is 63% of the cheapest anchor in the category ($10 Zed Pro / Copilot Pro / JetBrains AI Pro), and JetBrains already sells AI tooling into India at **$11.80 including 18% GST** [fetched, `r25-w2`]. Cross-referenced with finding #3 in your brief — price is the #1 weekly complaint at 15.7% — the resolution is that *their* price complaints are about $20 tools, not $3 ones, and pricing below the floor of a machismo category signals accessory. Not re-litigated here; see `r25-w3`.

**R3. `r24-v1` found a shipped feature that does the exact thing the company exists to refuse, and it is still in the tree.** `table-edit.ts` regenerates: one cell edited → 3 of 5 lines rewritten, 100 bytes → 84, CRLF file's carriage returns 4 → 1 [measured, `r24-v1`, module executed in Node]. `DECIDE.md` §10 already says delete the UI and keep the measurement as a test. Correct call. Do it this week, because the day a prospect finds it, the demo is over — and per `r24-v4`, ghost text is a *second* instance of the same class in the same tree.

---

**MINOR — 2**

**M1.** §28's R0 header says 58 points; §28.1's thirteen rows sum to 50 [derived, §95.1 already flags it]. Eight points is nine calendar days and nobody has reconciled it.
**M2.** §94 numbers rows 1–163 but the table structure of row 1 differs from the other 162, which is why every count in this report is stated against 162 parsed rows plus row 1 (`∅`, evidence NONE) reconciled by hand.

---

**THE FEATURE SCORE, IN BANDS**

Scoring all 163 in prose is the same error as writing them. Four bands, and the test is §103's own G1 — named user, named frequency:

| Band | What is in it | Rows | Points | Verdict |
|---|---|---|---|---|
| **A — Earns its place** | Splice writer (#40), typed refusals (#41), NF-1/NF-2/NF-3 (#42–44), shape gate (#50), branded offsets (#51), CI (#65), review surface (#124), `land()` (#123), find/replace in file (#13), vault search (#3), file tree, export (#93–95) | ~20 | ~70 | **Ship.** Named user = anyone who opens the app; frequency = per session |
| **B — Table stakes, unscheduled** | `r24-v1`'s eight gaps + ⌘K collision + font size/theme/wrap (unlisted) | ~12 | 13–21 eng-days | **Ship before anything novel.** Absence is disqualifying — every product in the survey has them |
| **C — Plausible but unscored** | Kanban (#81), calendar (#82), table/dashboard render (#84), vault-wide find/replace (#14), rename-with-link-rewriting (#28), Properties types (#36), CJK tokenizer (#23), conflict inbox (#100) | ~35 | ~180 | **Defer until each has a frequency.** #81/#82/#84 have the strongest evidence in the whole inventory (7.25× install ratio, Dataview 4,857,171 downloads) and are cut from all three stages — that ordering is the argument §94 makes against itself and loses |
| **D — Kill or park** | The 36 NONE rows + Marp slides, decision card (0.0004% of registry downloads, `r21-s6`), companion browser plugin, custom domains, AEO linter, typed RPC API (XL), CriticMarkup, retro-capture, multi-vault | ~55 | ~200 | **Kill now.** None names a user; several are refuted by the record's own counted evidence |

That is roughly **200 points removed, 265 deferred, 90 kept.** It does not make the company work. It makes the next six months legible.

---

**WHAT I WOULD DO, IN ORDER**

1. **This week, three days:** `r24-v1` items 1–4. ⌘1–6, ⌘K→link (move Spotlight to ⌘O), list/quote/task toggles, bind `toggleTaskAtLine`, outline hotkey, palette that indexes everything. Delete `table-edit.ts` and `ghost-text.ts`; keep both as red-proof tests. This is the cheapest credibility in the document and it is currently scheduled nowhere.
2. **Give splice the discriminated union before building any AI flow.** `r21-s7` names it the highest-leverage item; 20 `return src` sites make the founding principle unrenderable.
3. **Add a `frequency` column to §94 and run the tie-break clause.** Anything that cannot be filled from an issue count, a support ticket, or an install number goes to band D. §103 exists; use it once.
4. **Change the demo.** Per-hunk review is Zed's, free, verified today. The demo that survives is the one nobody else can run: **point it at the prospect's own repo and print, per file, exactly which constructs will not survive** — §94's own preferred cut, and the only artifact in this corpus that a stranger can check in five seconds against a folder they already own.
5. **Decide finding #1's question before any of the above:** one founder or two. At 650 points and 25% active-day density, the difference is not a schedule variance. It is whether the plan exists.

---

## 5. Technical feasibility and execution risk

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

---

## 6. The business model and unit economics

Every unit-economics table in this repo — §23.2, §25.1, §90.1, §93.1 — costs infrastructure, inference, and payment rails, and prices founder time at **zero**. §85.6 measures the time (0.1445 h per paying user per month) but never multiplies it by a rupee. That multiplication is the whole critique.

| Founder rate | Support cost per paying user/month (0.1445 h) |
|---|---|
| ₹1,400/h | **₹202.30** |
| ₹1,700/h (midpoint) | **₹245.65** |
| ₹2,000/h | **₹289.00** |

[derived; hourly band from `r22-t3` §3, `[measured]` off ecosystem.md §4.8 shipped-project rates]

Set that against contribution per tier. `contrib` is the record's own §23.2 figure; `eff` is contribution *after* the founder's support hours are priced.

| Tier | Contribution | eff @₹1,400 | eff @₹1,700 | eff @₹2,000 |
|---|---|---|---|---|
| **India Pro ₹299** (cheap-model) | ₹217.43 | +₹15.13 | **−₹28.22** | **−₹71.57** |
| India Pro ₹399 (the A/B upper) | ₹299.81 | +₹97.51 | +₹54.16 | +₹10.81 |
| India Power ₹599 | ₹383.50 | +₹181.20 | +₹137.85 | +₹94.50 |
| World Pro $5 | ₹352.66 | +₹150.36 | +₹107.01 | +₹63.66 |
| World Power $10 | ₹805.76 | +₹603.46 | +₹560.11 | +₹516.76 |
| Work ₹3,999/yr flat | ₹359.06 | +₹156.76 | +₹113.41 | +₹70.06 |

[derived; India net = P/1.18 − 0.0236P per §23.2, verified ₹299 → ₹246.33 ✓; FX 95.39 [fetched, api.frankfurter.app, rate date 2026-08-28, re-read 2026-08-31]]

**FATAL-1.** The break-even *price* for an India monthly subscription — the price at which one user's contribution merely equals the founder's opportunity cost of supporting them, with zero draw, zero development time, zero profit:

| Founder rate | Break-even India monthly price |
|---|---|
| ₹1,400/h | **₹280.63** |
| ₹1,700/h | **₹333.25** |
| ₹2,000/h | **₹385.87** |

₹299 sits inside the band and below its midpoint. It is not a cheap price; it is a **below-cost** price where cost is correctly defined. This is finding 4 from `r25-w3` restated in the only currency that matters: it is not that ₹299 fails to *look* credible next to Obsidian Sync's $4 — it is that ₹299 does not clear the founder's own wage.

**What would change my mind:** the support coefficient. The record states it two ways and they differ by 3×. §25.1 says **0.10** tickets/paid-user/month; §85.6 says **0.30**. Under the optimistic §25.1 figure the coefficient is 0.10 h/paying user (₹170 at ₹1,700), ₹299's `eff` becomes **+₹47.43**, and FATAL-1 downgrades to SEVERE. It does not disappear: at ₹47.43/month against the honest 3.76%/month churn (26.6-month life) LTV is **₹1,262**, which is 7–20% of any plausible CAC (§5). **The most load-bearing number in this business model is stated twice, differently, and has never been measured.** Ship to 100 users, count tickets for 60 days, and the pricing question resolves itself. Until then every revenue projection in the record carries a 3× error bar on its single largest cost.

---

### 2. Real unit economics at 100 / 1,000 / 10,000 users

Using the record's own conversion (4%), its own infra table (§25.1), its own ARPU mix (70% India ₹299 / 30% World $5, gross ₹352.40), and adding the missing line.

| Total users | Paid | Gross ₹ | Net of rail+GST | Infra + inference | **Contribution** | Founder h/mo | Founder ₹ @1,700 | **TRUE P/L** |
|---|---|---|---|---|---|---|---|---|
| 100 | 4 | 1,410 | 1,176 | 630 | **547** | 19.6 | 33,283 | **−32,736** |
| 1,000 | 40 | 14,095 | 11,762 | 2,111 | **9,651** | 24.8 | 42,126 | **−32,475** |
| 10,000 | 400 | 140,954 | 117,621 | 25,930 | **91,691** | 76.8 | 130,560 | **−38,869** |

[derived; founder hours = 0.1445P + 19 fixed per §85.6]

Read the last column. **The business is more negative at 10,000 users than at 100.** Scaling does not fix it, because contribution per user (₹229 blended) and founder cost per user (₹245.65) are within 7% of each other, so every added user moves the line by roughly nothing while the fixed 19 h/month of compliance never amortises fast enough. §25.1's conclusion — "support, not compute, is the wall" — is right and understated: support is not the wall, it is **the entire cost structure**. Cloud + AI at 10,000 users is ₹25,930/month; founder time for the same population is ₹130,560. **Founder time is 5.0× the entire infrastructure and inference bill combined.** Every hour of the AI-cost anxiety in §90 and §93 is aimed at 19% of the burn.

The corollary, and the one genuinely useful re-planning input here: **deflection is the product**, not a nice-to-have. §86's plugin ban (22.79% of Obsidian's tagged forum volume) is worth more to this P&L than any pricing change, and halving the ticket rate moves the founder wall from 1,239 to 2,403 paying users [§85.6, derived] — worth ₹1.9 lakh/month of founder time at that scale.

---

### 3. Pricing: wrong in both directions, and on the wrong axis

**SEVERE — the axis.** `r25-w3` is right that nobody charges individuals for editing, and the founder-hour arithmetic explains *why* rather than merely observing it: a per-seat monthly subscription to an individual is a promise of **perpetual support at a fixed monthly price**, and support is the cost. The subscription and the cost driver are on the same axis, so margin never expands. Obsidian solved this by decoupling: the editor (support-generating, free) from Sync (support-light, $4/user/month, [fetched obsidian.md/pricing 2026-08-31]). frontmatter proposes to charge for the support-generating half and give away nothing.

**SEVERE — and the sharpest recoverable error in the whole plan.** The Work licence is ₹3,999/**year, flat, per organisation** (§24.2, §82.8), and §24.2 labels it *"Obsidian Commercial parity."* It is not parity. Obsidian's Commercial licence is **"$50 — Per user, per year"** [fetched obsidian.md/pricing 2026-08-31, verbatim].

| Org size | Obsidian Commercial | frontmatter Work | Ratio |
|---|---|---|---|
| 50 people | $2,500/yr = ₹238,475 | ₹3,999/yr | **59.6×** |
| 100 people | $5,000/yr = ₹476,950 | ₹3,999/yr | **119.3×** |

[derived, FX 95.39]

The only SKU in this category with a *proven, measured, nine-figure-logo buyer* — 17,725 floor licences across 146 named orgs, $886,250/yr floor (`r21-s5`, [measured]) — has been priced 60–119× under the incumbent, on the wrong unit, for no stated reason. That is not conservatism; it is leaving the single demonstrated revenue mechanism on the floor. Fix: **per-user-per-year, $50, exactly Obsidian's number and unit.** It requires zero features (Obsidian ships no SSO, no SCIM, no audit log, no SOC 2), and §82.8's lament that "seat expansion is structurally disabled by our own pricing" evaporates in one edit.

**What is right, and priced:**

| | Recommendation | Reasoning |
|---|---|---|
| Editor | **Free, forever, no signup** | It is the support-generating surface. Charging for it inverts the cost structure. Also the only configuration with a live proof point at scale |
| Individual paid | **$9/month or $79/year, in USD** — not ₹299, not ₹599 | $9 clears the credibility floor (39.8% of the HN price corpus sits ≤$6; `r25-w3` [measured]), sits under the $10 mode, and yields `eff` **+₹469** at ₹1,700/h — a real margin over founder time. USD because every Indian company selling globally quotes USD (`r25-w3`, [fetched]) |
| Commercial | **$50/user/year**, Obsidian's exact number | The only measured B2B demand in the category |
| Team | **$30/editor/month** | See §6 — this is the whole business |
| AI | Metered, hosted-only, on top | Aligns the one variable cost with the one variable price |
| ~~One-time $49~~ | **Reject `r25-w3`'s rank-1 recommendation** | $49 one-time = ₹4,340 contribution once, against ₹245.65/month of recurring support forever. **The buyer turns contribution-negative in month 17.7 and stays there.** A perpetual licence with a perpetual support obligation and no perpetual revenue is the worst shape on the list for a solo founder |

That last row matters: `r25-w3` is right about market evidence and wrong about this founder's cost structure. One-time pricing is only correct if the support coefficient falls near zero — which is an argument for deflection, not for one-time pricing.

**MINOR — currency.** Rupee denomination to a global audience reads as domestic-market software (`r25-w3`, [fetched]: Postman, BrowserStack, Chargebee all quote USD). Craft already serves ₹526.70/month to an Indian IP. ₹299 undercuts Indian willingness-to-pay, not just global. Falsified by: an INR-vs-USD price test showing higher conversion on INR at equal dollar value.

---

### 4. The AI cost trap — mostly already defused, with one open hole

Credit where due, specifically: **the free tier's hosted AI cost is ₹0 by construction** (§24.2: "zero hosted credits", BYO-key unmetered). That is the correct answer, arrived at before the arithmetic demanded it, and it removes the entire class of failure the brief anticipated. The daily dollar breaker (§93.5), the no-overage-ever policy (§93.3, correctly reasoned from the RBI ₹15,000 mandate ceiling rather than from taste), and the degradation ladder are all right.

**Median free user, per month:**

| Line | ₹/month |
|---|---|
| Hosted inference | **0.00** (BYO-key only) |
| Infra ($0.0112) | 1.07 |
| Support (0.02 tickets × 12 min @ ₹1,700/h) | 6.80 |
| **Total** | **₹7.87** — of which **86% is founder time** |

At 10,000 free users: **₹68,000/month of founder time versus ₹25,930/month of total cloud+AI.** The free tier is not an AI-cost problem. It is a *time* problem, and cutting it (as §85.6 correctly anti-recommends) cuts the funnel and the ops bill in the same stroke.

**SERIOUS — the open hole is the unmetered cheap lane, not the frontier meter.** §93.1 recommends "actions, with the cheap surface unmetered" — rank-1/rank-2 verbs "free and uncounted" on Haiku 4.5. §90 puts a wallet on the *frontier* lane. The abuse case therefore lives where nobody is counting:

| Abuse pattern (UI-driven, concurrency 1, no bulk API) | Haiku 4.5 | Sonnet 5 |
|---|---|---|
| 1 call / 5 min, 24h | $251/month | $501/month |
| 1 call / 60 s, 24h | **$1,254/month** | $2,507/month |
| 1 call / 20 s, 24h | **$3,761/month** | $7,522/month |

[derived, from §11.3's `[derived]` $0.0286 Haiku / $0.0572 Sonnet p90 restructure; prices [fetched 2026-08-29]]

Against a ₹599 Power subscription grossing $6.28, the 1-call-per-minute case is **199× gross revenue** — and §93.5's controls 1, 3 and 4 (no bulk API, concurrency 1, rate limit) do not stop it, because a human pressing a key every 60 seconds is indistinguishable from a script pressing it every 60 seconds. Only control 2 — the server-side daily dollar breaker — stops it, and §93.1's "free and uncounted" framing is in direct tension with it. **Resolution: the breaker must cover the unmetered lane, and that lane must be described as "unmetered up to the daily ceiling," never as "free."** One sentence, and it is the difference between a bounded and an unbounded liability. Falsified by: nothing — this is arithmetic, and the fix costs one paragraph.

**One more, quietly.** §93.1 quotes Haiku 4.5 at $1/$5 [fetched 2026-08-31] while §23.2's cheaper alternatives (DeepSeek V4-Flash off-peak $0.22/$0.66) are **5.8× cheaper per assist**. §23.2 also warns Claude 4.7+ tokenizers emit ~30% more tokens for identical text. A budget set on Haiku, in actions, on a tokenizer that moved, is three compounding errors on a line that is 19% of burn — which is precisely why this should not be where attention goes.

---

### 5. CAC, LTV, and what "no paid channel" actually costs

`r25-w4` establishes the ceiling: no measured loop produces the 22,222 visitors needed for the first 100 paying customers; the median Show HN is 2 points, 1.4% clear 100; the Obsidian plugin channel compounds for Obsidian; content is the only owned loop and **exactly two posts have ever shipped**. So the first cohort is hand-recruited. **CAC is therefore denominated in founder-hours, and founder-hours have a published market price.**

| Hand-recruitment assumption | Hours per paying customer | **CAC @₹1,700/h** |
|---|---|---|
| Optimistic — 33% convert, 30 min each | 1.5 h | **₹2,576** |
| Central — 20% convert, 45 min each | 3.75 h | **₹6,375** |
| Pessimistic — 10% convert, 60 min each | 10 h | **₹17,000** |

[conversion rates and per-conversation hours are `[inference]`; the rate is `[derived from measured]`]

Against LTV at ChartMogul's **actual** benchmark for this ARPA band — top-quartile customer retention **63.1%** annual = 3.76%/month, best-in-class **74.9%** = 2.38%/month, "only 2.7% of SaaS businesses with an ARPA less than $10/month have net retention rates over 100%" [all three fetched, chartmogul.com/reports/saas-retention-report/, 2026-08-31]:

| Churn | Life | ₹299 LTV (contrib) | ₹299 LTV (**eff**) | ₹599 LTV (eff) | $10 LTV (eff) |
|---|---|---|---|---|---|
| 2.38%/mo (best-in-class) | 42.0 mo | ₹9,136 | **−₹1,186** | ₹5,792 | ₹23,525 |
| 3.76%/mo (top quartile) | 26.6 mo | ₹5,783 | **−₹751** | ₹3,666 | ₹14,899 |
| 6.00%/mo (honest central) | 16.7 mo | ₹3,624 | **−₹470** | ₹2,298 | ₹9,335 |

**LTV/CAC at the central CAC of ₹6,375: ₹299 → negative. ₹599 → 0.36–0.91×. $10 world → 1.46–3.69×.** Only the $10 tier reaches the conventional 3× threshold, and only at a retention level this ARPA band achieves 25% of the time.

Payback, on gross contribution and ignoring the founder-hour offset entirely (the most generous possible reading):

| CAC | ₹299 payback | ₹599 payback |
|---|---|---|
| ₹7,000 | 32.2 months | 18.3 months |
| ₹10,200 | 46.9 months | 26.6 months |
| ₹17,000 | 78.2 months | 44.3 months |

**At ₹299 and the honest 3.76%/month churn, payback (32.2 months) exceeds customer lifetime (26.6 months).** That is not a bad LTV/CAC ratio; that is a business that loses money on every customer it acquires, at any scale. Finding 4 and `r25-w4`'s anti-moat finding meet in one number: switching cost is zero *by design*, so life is short, and CAC is founder-hours, so acquisition is expensive. Both are deliberate choices. Together they are fatal to the ₹299 lane.

---

### 6. Break-even table, visitor volume, and how long

Nut definitions from `r22-t3`: fixed overhead ₹18,918/month; one founder at survival draw ₹63,918; two founders ₹1,08,918. Counts use **`eff`** contribution at ₹1,700/h — i.e. the point at which the product pays the founder what a client would, *plus* the nut.

| Price point | eff/user | Users for ₹18,918 | **Users for ₹63,918 (one founder)** | Users for ₹1,08,918 |
|---|---|---|---|---|
| India Pro ₹299 | −₹28.22 | **never** | **never** | **never** |
| India Pro ₹399 | ₹54.16 | 350 | **1,181** | 2,012 |
| India Power ₹599 | ₹137.85 | 138 | **464** | 791 |
| World Pro $5 | ₹107.01 | 177 | **598** | 1,018 |
| **World Power $10** | ₹560.11 | 34 | **115** | 195 |
| **Team, 5 seats @ $30** | ₹12,622/team | **1.5 teams** | **5.1 teams** | **8.6 teams** |

[derived]

Two things fall out. First, **₹399 needs 1,181 paying users and §85.6's founder wall is at 1,239** — the price is set such that the founder is fully consumed by support at the exact moment the business first pays them. Second: **5.1 teams versus 1,181 individuals for identical income.** One 5-seat team at $30/seat contributes ₹12,622/month; it takes **58 India Pro subscribers** to match it, and those 58 consume **8.4 founder-hours/month against the team's 0.5** — a **17× worse support-load-per-rupee**. The B2B lane is not "also worth trying." It is the only lane where the arithmetic works, and `r21-s5` has already measured its buyer.

Visitor volume, at the record's own 5% dev-median conversion and 9% visitor→signup:

| Target | Cumulative visitors to build the stock | Visitors/month **forever** to hold it (3.76% churn) |
|---|---|---|
| 464 paying @ ₹599 | **103,111** | **3,877** |
| 1,181 paying @ ₹399 | **262,444** | **9,867** |
| 5.1 teams | ~2,550–5,100 | negligible |

**How long.** At `r22-t3`'s own g = 32 gross paying adds/month, reaching 464 takes **20.6 months** at 3.76% churn and **33.0 months** at 6%. At g = 20/month and 6% churn the ceiling is 333 and **464 is never reached at all**. Against a content channel with a measured supply of two posts, g = 32/month from month one is not a forecast; it is the thing that has to be proved.

**The opportunity-cost total.** 7 months to code-complete at 198 h/month = 1,386 h = **₹23.6 lakh** of forgone billings; plus ~36 months of ops at an average 50 h/month = 1,800 h = **₹30.6 lakh**. Call it **₹54 lakh of founder time** to arrive, in year three, at a business generating ₹36,525/month more than billing those same hours to clients — which repays the ₹54 lakh over a further **123 months**. Meanwhile 78 client hours/month at ₹1,700 = **₹1,32,600/month**, available today, exceeding the two-founder survival nut, at zero risk. That is the comparison the founder is actually making, and no version of the ₹299 plan wins it.

---

### 7. What is good, specifically

- **`r22-t3`'s reframing is the best analysis in the repo.** Replacing ₹20L/mo with a ~500-user default-alive target, and pricing the raise against a ₹1,400–2,000/h alternative, is exactly right and correctly concludes *do not raise*.
- **Free tier = $0 hosted inference by construction.** The trap the brief anticipated does not exist.
- **No overage, ever** (§93.3) — correct, and correctly reasoned from the RBI ₹15,000 mandate ceiling rather than from taste.
- **The daily dollar breaker in dollars, server-side, before dispatch** (§93.5) is the right control in the right place.
- **§90.1's refusal to launder [SS] prices as [fetched]** is better epistemic hygiene than most seed decks contain.
- **Contribution margins are genuinely good** — 57–73%. The problem is never the margin percentage; it is the absolute rupees per user against one hour of founder time.

---

### Verdict

**There is a business here, at exactly one price and on exactly one axis, and it is not the one on the pricing page.**

| Lane | Verdict |
|---|---|
| **India Pro ₹299/month to individuals** | **FATAL.** Contribution-negative at the founder's market rate; payback exceeds customer lifetime; LTV/CAC below 1 under every churn scenario ChartMogul publishes for this ARPA band. Delete it. |
| Per-seat monthly to individuals at any INR price | **SEVERE.** Wrong axis — it charges for the support-generating surface. ₹599 works arithmetically but needs 464 users, 103,111 cumulative visitors, and 20–33 months. |
| $9–10/month **in USD** to individuals | **Viable, marginal.** 115 users fund one founder. This is the individual number, if there must be one. |
| **$50/user/year commercial licence** | **The largest recoverable error in the plan.** Currently priced 60–119× under the only measured buyer in the category. Fix the unit, not the number. |
| **$30/editor/month teams** | **The business.** 5.1 teams fund one founder. 17× better support-load-per-rupee. `r21-s5` has already found the buyer. |
| Editor itself | **Free.** Permanently. It is the cost centre, not the product. |

**What would change all of this, in priority order.** (1) **Measure the support coefficient** — the model's largest cost is stated as 0.10 and 0.30 in the same repo, a 3× spread that moves ₹299 from FATAL to SEVERE. Ship to 100 hand-recruited users, count tickets for 60 days. (2) **Three unsolicited inbound teams** asking for multi-editor access — `r22-t3`'s own trigger, and the only signal that flips the verdict from "small lifestyle business, funded by clients" to "raiseable." (3) **Measured 90-day cohort retention better than 2.38%/month churn** — best-in-class for this band, which §82.4 books as its *optimistic* case and `r25-w4` correctly flags as one full band too generous. (4) If the founder-hour rate is not real — if the client pipeline cannot actually absorb 78 hours/month at ₹1,700 — then the opportunity cost collapses, every `eff` column turns positive, and ₹299 becomes merely a bad price rather than a losing one. **That is the single assumption on which this entire critique rests, and it is the one the founder can verify fastest: send three AMC proposals and see what closes.**

---

## 7. The D2C motion

Reconcile verified (ninth, unchanged): `~/.claude` HEAD `6e390828`, no new commits, 19 pre-existing dirty paths, session read-only throughout.

---

The single most damaging finding: at the record's own unit economics, the same acquisition effort sold as a **$49 one-time licence** produces **₹26.14 lakh over 24 months and covers the founders' living costs in month one**, while the settled ₹299/month subscription produces **₹11.92 lakh over the same 24 months and at month 24 still covers only 76% of the nut** — so the D2C plan's shape, not its price, is what is broken, and it has been settled without ever being computed. [derived]

---

**Steelman, in one paragraph.** There is a real version of this. A developer who runs agents against her own markdown has a genuine, expensive, recurring problem — the agent rewrites a whole file to change one field and the diff is unreviewable — and one company, Cursor, has confirmed on the record that its own full-file rewrite doubles blank lines and destroys carriage returns on CRLF files (`r24-v3`). The engine that fixes this exists, is tested against 8,513 third-party files, and is not a slide. The category's own winner proves an individual-monetisation business is possible without investors, sales, or lock-in: Obsidian funds eight people and an office cat entirely from users, and extracts a **≥$886,250/yr floor** from an honour-system licence it tells buyers is optional (`r21-s5`). A one-person Indian company with ₹1,400–2,000/hour client work does not need venture outcomes; it needs **501 paying users at ₹299 to cover a two-founder survival nut** (`r22-t3`), which is 0.075× the ₹20L milestone the record orbits. Small, honest, individual-funded software in this category is a proven shape. That is the strongest version, and I will now take it apart.

---

**Findings, ranked**

| # | Severity | Finding | Falsifier — what would change my mind |
|---|---|---|---|
| D1 | **FATAL (conditional)** | Going full-time on D2C at ₹299/mo ends the company. At the acquisition rate the plan can plausibly sustain (24.4 paying adds/mo), month-24 MRR is **₹82,663** against a **₹1,08,918** nut, at 4%/mo churn — 24 months of cash-negative operation. It is fatal **only if services are dropped**; services are the reason it is not fatal today | A cohort at n≥100 showing monthly churn ≤3%/mo AND gross adds ≥33/mo sustained for 6 months. Then the ceiling is 1,100 and the plan funds itself |
| D2 | **SEVERE** | The subscription shape loses to a one-time licence at every honest churn rate. Break-even is **c = 4.87%/mo**; below it subscription's steady state wins, above it one-time wins outright — and ChartMogul's <$10-ARPA band puts **3.76%/mo at the top quartile** and publishes no median. Even at 4% it takes **56.4 months** to reach 90% of ceiling (§82.1's own arithmetic) | Evidence that this ARPA band retains better for developer tools specifically than ChartMogul's cross-industry <$10 cut. I looked; it does not exist publicly |
| D3 | **SEVERE** | **Nothing in this category has ever charged an individual a monthly fee for the editing surface.** The proven objects are sync/hosting (Obsidian $4–8), one-time purchase (Typora $14.99, iA $49.99, TablePlus $79–99, Sublime $99), and metered tokens (Zed, Cursor, Copilot). We are pricing the one axis with **zero live proof points** (`r25-w3`) | One named product, live today, charging individuals recurring money for markdown *editing* with no sync, no hosting and no tokens attached. I could not find one |
| D4 | **SEVERE** | Every retention driver is absent by design: sync **not built**, plugins **banned** (§86), files **on their disk** (§27 rank 7), seats **flat** so NRR ≤100% (§82.8). What remains is "correctness is the retention mechanic" — and in the 355-comment thread of people actively shopping for an Obsidian replacement, corruption/fidelity was raised **0 times** (`r25-w4`) | 5+ of the first 20 churned users citing correctness as the reason they stayed as long as they did |
| D5 | **SEVERE** | **§17 and §82.9 cannot both hold.** Implicit-telemetry-only means no unique-install denominator, so no MAU, no DAU/MAU, no cohort retention — while §82.9 mandates cohort tables with voluntary and involuntary churn as separate series. A product that cannot measure retention cannot manage it, and this is observable on day one, not month twelve | A de-duplication scheme that produces a unique-install count without an identifier. I do not believe one exists that also satisfies §17 |
| D6 | **SERIOUS** | **There is no first-hundred plan.** Across 105 reports and 374,866 words the record contains **0 instances each** of `customer discovery`, `design partner`, `interviews`, `waitlist`, `beta tester`, `pre-order`, `user test`, `willingness to pay` [measured, in-record §67]. §102.3 names four channels, and its single load-bearing instrument — authenticated GitHub code search for repos carrying `CLAUDE.md` — **has never been run**, by the record or by me (`gh` fails TLS through this proxy; unauthenticated `/search/code` is 401) | Ten named humans, with emails, in a file, who have said they want this |
| D7 | **SERIOUS** | The demand test is scheduled **after** the build. DECIDE §9 dates "byte-exactness is a felt need" falsification to **Day 41**; M7, "one paying non-founder account," is dated **2027-04-28**. §67 already recommended "put one falsifiable demand test in front of R0, not after M6" and it was not done | The paid-waitlist page §67 specifies, live, with a number attached |
| D8 | **SERIOUS** | ₹299 is **below Indian willingness-to-pay as measured**, not a concession to it. Craft serves an Indian IP **₹526.7/mo**; Obsidian **does not geo-price to India at all** — zero `₹` strings on its pricing page served to this machine's Indian IP, so Indians pay the full **$4 = ₹381.56** for sync alone [fetched 2026-08-31] | Indian A/B data at n≥400 showing ₹299 converts >1.8× better than ₹499, which is the ratio needed to justify the discount on revenue |
| D9 | **MINOR** | The "rupee signals cheapness" worry is largely a strawman against this record — §24.2 already publishes a **USD world table**. The signalling problem is the **$5**, not the ₹299 | — |

Nothing here is unconditionally FATAL, and saying otherwise would be dishonest: **the company is services-funded and D2C failing does not kill it.** That is a genuine structural advantage and it should be stated as loudly as the problems.

---

**1 · Free-tier gravity: what has ever charged individuals, and what that means**

The answer is narrower than "sync, and almost nothing else." It is **sync, one-time purchases, and metered usage of a service with a real marginal cost.** Three objects, all sharing one property: the buyer cannot trivially self-host them, or is buying a permanent asset rather than access.

| Object that works | Live proof | Property that makes it work |
|---|---|---|
| Recurring sync / hosting | Obsidian Sync $4–5/mo, Publish $8–10/site/mo | A service with an ongoing server cost the user cannot replicate for free *conveniently* |
| One-time purchase | Typora $14.99 · iA Writer $49.99 · **TablePlus $79–99, with a $59/device renewal for continued updates** [fetched 2026-08-31] · Sublime $99 | Buys an asset, not access. Removes the recurrence objection entirely |
| Metered tokens on a free editor | Zed Pro $10 incl. $5 tokens · Cursor $20 · Copilot $10, "1 AI credit = $0.01" | The cost is real, visible, and passes through |
| **Paid access in a free-dominated category** | **Kagi: $5 / $10 / $25 per month, 74,970 members on 2026-08-31, net +695 in the 14 days to 2026-08-31 (≈49.6/day)** [fetched, kagi.com/stats + /pricing] | Search is free and beloved; Kagi charges anyway — but for **unlimited use of a metered service**, not for a binary |

Kagi is the most interesting comparable in this whole file and it is not in the record. It is the existence proof that a free, beloved, dominant incumbent does **not** make paid impossible. But read what Kagi actually sells: uncapped consumption of something with a per-query cost, plus an explicit fair-pricing promise to credit unused months. It is a *service* business wearing a consumer subscription. It is not an editor.

**What this means for us.** The record has chosen to charge, monthly, for the one object in the category with no precedent. §24.2's Pro contents are "publish extras, live editing, hosted convenience, small metered AI" — of which *publish* and *metered AI* are proven objects and *hosted convenience* is the thing 761 Obsidian-mentioning comments reject **3.1 to 1** in favour of DIY (`r21-s5`). The saleable half of Pro is already in the tier; it is buried behind a word ("Pro") that implies you are buying the editor.

TablePlus is the shape I would copy, because it solves one-time's one real weakness — no renewal flow. **$79–99 one-time for the app, $59/device to renew another year of updates.** You keep what you bought forever; you pay again only if you want the next twelve months of work. It is honest, it matches the "the file is yours" ethic exactly, and it converts the recurrence objection into an upgrade decision.

---

**2 · Retention with zero lock-in, quantified**

The record does not hide this — §27 ranks switching cost as moat #7, "**Near zero, by design** — This is the anti-moat," and §82.2 says the stance "is the right ethical choice and it raises churn. Name it." It is named. It has never been **priced**, and the three scenarios it does carry are shifted one full band optimistic (`r25-w4`).

| §82.4 scenario | Annualised | Where it sits in ChartMogul's ARPA<$10 band |
|---|---|---|
| c = 2%/mo | 78.5% retained | **Above best-in-class (74.9%)** — not a scenario, a fiction |
| c = 4%/mo | 61.3% | ≈ top quartile (63.1%) — an aspiration presented as the middle |
| c = 6%/mo | 47.6% | The honest central case, and the band has no published median |

Our blended ARPU is **$4.00/mo**, the worst-retaining band ChartMogul publishes: only **2.7%** of companies there clear 100% NRR, only **5.3%** clear 85% gross retention. §82.8 has already disabled the one mechanic that lifts you out — the flat ₹3,999 licence means a team going from 3 to 18 people pays the same.

**Can free exit's churn contribution be isolated?** No, and I will not invent a number. There is no published study decomposing SaaS churn into lock-in-attributable and product-attributable components [SS / not-found]. What *can* be said structurally is stronger than a fake decomposition: **every retention driver available to an editor is either not built, given away, or banned**, so the correct planning posture is the bottom of the band. Plan at **6%/mo**, target 4%, treat 2% as marketing.

| Mitigation | Honest? | Effect |
|---|---|---|
| **Annual default** (₹2,499 vs ₹299×12) | Yes | Cuts renewal decisions 12→1/yr; §82.3's one-attempt Indian card rail makes this a *payments* fix as much as a retention one. Cost: lumpy, high-variance anniversary churn |
| **Published sites with custom domains** | **Yes, and it is the only real lock-in available** | A live URL a stranger has bookmarked is a switching cost that does *not* hold the customer's file hostage. §84 already keeps published pages resolving after lapse — that is ethically right *and* it is the asset. Build the paid tier around it |
| **Sync** | Yes | The category's one proven recurring object. Currently architecture, not product (§31) |
| **Habit / daily-open** | Yes, but **unmeasurable under §17** — see D5 | Cannot be managed |
| **Export friction, plugin lock-in, cancel interstitials, deletion threats** | **No** | All four already banned by §82.6 / §84. Keep them banned; the ban is worth more than the churn it costs |

The uncomfortable synthesis: **the ethical decision and the retention hole are the same decision**, and the only honest mitigations are (a) sell the service, not the surface, and (b) accept a materially lower ceiling. Both point away from a monthly fee for an editor.

---

**3 · The conversion arithmetic, to a living wage**

Inputs are the record's own: two-founder survival nut **₹1,08,918/mo** (₹45k draw each + ₹18,918 overhead), contribution per India Pro user **₹217.40/mo**, dev-median free-to-paid **5%**, visitor→signup **9%** (§25.3, `r22-t3`). One-time case: $49 at ₹95.39, net of Dodo 4% + 15¢ = **₹4,472.84**.

| | ₹299/mo subscription | $49 one-time |
|---|---|---|
| Customers needed to cover the nut | **501 live subscribers** | **24.4 sales/month** |
| One-founder version (₹63,918/mo) | 294 live subscribers | 14.3 sales/month |
| Month-24 revenue at g = 24.4/mo, c = 4% | **₹82,663/mo — 76% of the nut** | ₹1,09,138/mo — covered from month 1 |
| Cumulative 24-month cash at the same g | **₹11,92,441** | **₹26,14,032 — 2.19×** |
| Steady-state ceiling | 609 customers = ₹1,32,348/mo (c=4%); 406 = ₹88,232/mo (c=6%) | ₹1,09,138/mo, requires selling forever |
| **Break-even churn between the two models** | — | **c = 4.87%/mo** — below it subscription wins in perpetuity, above it one-time wins outright |

[all derived, computed here]

Funnel to **hold** 501 subscribers, forever, before a rupee of growth:

| Churn | Free→paid 5% | Free→paid 2.5% (the band 25% of freemium products land in) |
|---|---|---|
| 2%/mo | 200 signups/mo · **2,227 visitors/mo** | 401 · 4,453 |
| 4%/mo | 401 · **4,453 visitors/mo** | 802 · 8,907 |
| 6%/mo | 601 · **6,680 visitors/mo** | 1,202 · **13,360 visitors/mo** |

Building the stock: **10,020 free users / 111,333 cumulative visitors** at 5% conversion; **20,040 / 222,667** at 2.5%; **50,100 / 556,667** at 1%. The free tier as specified — BYO-key, unmetered, no signup, no card — is structurally the configuration that lands in the bottom band, not at the 8% median, and credit-card-gated trials convert **>5×** better (`r25-w4`).

**Three readings, in order of how much they should change behaviour.**

1. **Survival is not the absurd part.** 4,453 visitors/month is a blog with traction, not a distribution miracle. The absurd part is ₹20L/mo, which needs **89,200 visitors/month forever** at the honest churn rate — 84.9% of the entire 1.26M cumulative acquisition figure, annually, to stand still (`r25-w4`). ₹20L/mo should be deleted from the record, not re-derived.
2. **The subscription costs you two years to learn what one-time tells you in month one.** At identical customer counts, one-time pays the nut immediately and subscription pays 76% of it in month 24. For a founder with no capital and a services obligation, that is the entire decision.
3. **The subscription only wins if you are top-quartile at retention in the worst-retaining ARPA band in SaaS, with every retention driver switched off by design.** That is not a plan; it is a wish with arithmetic attached.

---

**4 · The first hundred users, concretely**

There is no Monday-morning plan, and the absence is measurable: **0 instances each** of `customer discovery`, `design partner`, `interviews`, `waitlist`, `beta tester`, `pre-order`, `landing page`, `user test`, `focus group`, `willingness to pay` across all 105 reports and 374,866 words [measured, in-record]. There is a *channel list* (§102.3: your own repo via code search, the `anthropics/claude-code` issue tracker, MCP ecosystem repos, one Show HN) and it is a good one. Its single load-bearing instrument has never been executed — the record says so, and I could not execute it either (`gh` fails TLS through this proxy; unauthenticated `/search/code` returns 401). **The highest-leverage lead-generation query in the entire plan has now gone unrun twice.**

What I could fetch, and the record explicitly asked someone to before quoting a TAM: **`@anthropic-ai/claude-code` did 21,450,823 npm downloads in the week 2026-08-23→29** [fetched 2026-08-31]. Downloads are not people — `npx` and CI inflate it hard — but it bounds the wedge population well above "market of one."

The loops do not produce the first hundred. Verified live, independent of `r25-w4`: Show HN posts matching "markdown editor" in the last twelve months, **n = 187, median 2 points, 7 clear 100 (3.7%), 12 clear 50 (6.4%)** [fetched, hn.algolia.com, 2026-08-31]. There is no owned audience — no follower, subscriber or list count appears anywhere in the record or the ecosystem doc, and §87's tripwire EW-4 fires at "email list <300 at day 90," which is a tripwire for a list that does not exist.

**The Monday-morning version**, since naming the gap is not enough. Ten working days, zero product code, all falsifiable:

| Day | Action | Number that decides |
|---|---|---|
| 1 | Get a GitHub token. Run the code search: public repos containing both `CLAUDE.md` and a hand-maintained handover/context file. Export 200 with a committer email from `git log` | If <50 qualified repos exist, P4 is a projection of the founder and v1 moves to P2 (§63.4's own falsifier) |
| 2 | Publish the §67 page: the **refusal contract** — "here is what this tool refuses to do to your file, and why" — plus a **paid** pre-order button at $49 and an email field. No fidelity percentage, no engine number, nothing `[SS]`. Publishable today under §58 | — |
| 3–7 | 20 individually-written emails/day to those committers. Not a pitch: one question — *"has an agent ever rewritten one of these files in a way you had to undo by hand?"* | **<3 of 10 say yes → the wedge is not a wedge.** DECIDE §9's Day-41 falsifier, run on Day 7, for zero build cost |
| 8 | Post in `anthropics/claude-code` discussions with the 8,513-file corpus result as a *finding*, not a launch | — |
| 9–10 | Count: qualified leads, replies, "yes" answers, pre-orders, emails captured | **Zero pre-orders from 100 qualified conversations kills the price, not the product. Fewer than 10 replies kills the channel** |

One week of founder time against **eight months** of building before the plan's own first paying non-founder account (M7, 2027-04-28).

---

**5 · India selling globally**

The naive form of this critique is wrong and I will not run it: §24.2 already publishes a separate **USD world table**, so nobody outside India sees a rupee. Geo-pricing is correct and every serious comparable does it — Craft serves an Indian IP ₹526.7/mo, Superhuman ₹1,250/mo.

| Comparable | Origin | What a *global* buyer sees | Read |
|---|---|---|---|
| Postman | Bengaluru → SF | **USD** $9/$19/$49 | `r25-w3` |
| BrowserStack | Mumbai | **USD** from $12.50 | `r25-w3` |
| Chargebee | Chennai | **USD** $0 + 0.80%, $99 + 0.65% | `r25-w3` |
| Freshworks | Chennai → **Freshworks Inc., Delaware, San Mateo address** | USD | `r21-s5`, SEC EDGAR |
| Razorpay | India | ₹ | India-domestic only |
| **Obsidian** | Global | **$4/mo to Indians too — zero `₹` strings on obsidian.md/pricing served to an Indian IP** | **[fetched 2026-08-31, here]** |

Rupee denomination is a **market** signal, not a nationality signal. Keep the geo tier; never lead with it. Two corrections follow:

- **₹299 undercuts measured Indian willingness-to-pay.** Craft charges Indians ₹526.7; Obsidian charges Indians ₹381.56 for sync alone and does not discount for the market at all. ₹299 is **0.57× Craft** and **0.78× Obsidian Sync**. §24.3 flagged this and recommended testing ₹399; the evidence supports going further — **₹499 is the defensible India number**, with the discount you were going to give showing up as the annual plan instead.
- **The $5 world price is the actual signalling failure.** $5 sits *below* the modal $5/mo price point in a 940-comment corpus where sentiment at $5 is already split 11 positive to 10 negative (`r25-w3`), and it prices a **trust product** — the entire pitch is "it will not corrupt your files" — below a sync add-on. A $3 tool implies a $3 support commitment and a $3 durability promise. Trust claims are the one category where underpricing actively harms the sale.

---

**What is genuinely good, specifically**

- **§27 rank 7 and §82.2 name the anti-moat out loud, before any customer forced them to.** Most founders discover this in month 14 from a churn report. It has been in writing since before launch — the reason this critique could be quantitative rather than corrective.
- **The banned-claims list (§64.5) and the banned-dark-pattern list (§82.6).** "AI can't corrupt it" was caught and killed by the founder's own rule. Two-click cancel with no save-offer; published pages that keep resolving after lapse because the reader never entered a contract with us. Those decisions are what make word-of-mouth possible, and word-of-mouth is the only distribution asset available.
- **`r22-t3`'s reframe is correct and load-bearing: default-alive is ~500 paying users, not 6,689.** Once that lands, D2C stops being a venture question and becomes an arithmetic question with a plausible answer.
- **The B2B answer is already right and already cheap** (`r21-s5`): a licence, an invoice, a PO field and a supporters page — the whole near-free list is a consequence of not holding the data.
- **§102.3's channel list is the correct list.** Qualified leads with visible emails in `git log`, and an issue tracker full of people describing the problem in their own words. Not a plan yet, but the right raw material, and it costs nothing.

---

**Verdict on D2C: MARGINAL, and mis-shaped — but not a distraction from B2B, because there is no B2B track to be distracted from.**

`r21-s5` already settled that the B2B motion in this shape *is* a $50/user/year licence and a logo wall, not a feature set — one to two weeks of billing plumbing. So "D2C vs B2B" is the wrong question and I will not answer it as posed. **The real contest for the founder's hours is product versus services**, and services currently win on evidence: 54–78 client hours/month cover the entire nut today, at ₹1,400–2,000/hour, from clients who already exist.

Conditions under which D2C becomes viable rather than marginal — all three, not any one:

1. **Re-shape the money.** One-time licence at $49–79 with paid annual updates (the TablePlus shape), plus metered AI and publishing as the only recurring lines. Monthly-for-the-editor has zero live precedent and loses to one-time at every churn rate above 4.87%/mo.
2. **Run the demand test before the build.** The §67 refusal-contract page with a real pre-order button, and 100 hand-written emails to committers found by the code search that has never been run. Ten working days. Zero pre-orders answers the D2C question for ₹0 and saves eight months.
3. **Resolve §17 versus §82.9 before shipping anything paid.** A business that cannot compute day-30 cohort retention cannot run a retention-dependent revenue model, and this is knowable today.

If those three do not happen, the honest ranking for the next quarter is **services first, licence second, D2C subscription last** — and D2C at ₹299/$5 monthly should be recorded as an untested hypothesis with a scheduled falsifier, not as settled pricing.

---

## 8. The B2B motion

| What `r21-s5` treats as the B2B motion | What the source actually says |
|---|---|
| "$50/user/yr commercial licence produces $886,250/yr floor" | The licence sits on the pricing page under the heading **"100% user-supported. Optional licenses help support the independent development of Obsidian."** Its two listed benefits are **"Support development"** and **"Become a featured organization."** [fetched, obsidian.md/pricing, 2026-08-31] |
| An enterprise revenue line | *"Obsidian makes money from its add-on services Sync and Publish."* — Steph Ango, Obsidian's CEO [fetched, HN 43117456, 2025-02-20] |
| A replicable motion | It was **mandatory until Feb 2025** and was made optional because it was unenforceable: *"Many organizations were out of compliance without any way for Obsidian to enforce it, since the app is local and doesn't require sign up"* [fetched, same comment]. The old EULA read *"you must obtain a commercial license"* [fetched, HN 30523984 (2022-03-02), 23975602 (2020-07-28), 32260367 (2022-07-28)] |

So the wall of logos is the residue of **five years of a mandatory licence on a product with millions of users**, converted into a voluntary supporters programme after the fact. `r21-s5`'s recommendation — "ship the licence motion first" — proposes to start at the end state, with zero users and zero affection, and skip the two things that produced it.

**The concentration is worse than the headline.** Recounting the served HTML today (fully server-rendered, no lazy-load; 84 `alt="… logo"` entries, 84 `data-tags="commercial…"`):

| Tier | Threshold | Named orgs | Floor licences | Floor $/yr |
|---|---|---|---|---|
| Diamond | 10,000+ | 1 (Amazon) | 10,000 | $500,000 |
| Sapphire | 1,000+ | 0 | 0 | 0 |
| Topaz | 500+ | 4 | 2,000 | $100,000 |
| Emerald | 200+ | 7 | 1,400 | $70,000 |
| Jade | 100+ | 13 | 1,300 | $65,000 |
| Opal | 25+ | 59 | 1,475 | $73,750 |
| **Total** | | **84** | **16,175** | **$808,750** |

[measured, 2026-08-31, my own parse]. **Amazon alone is 61.8% of the entire named floor.** Strip one voluntary donor and the "nine-figure-logo B2B business" is $308,750/yr across 83 companies — an average of $3,720 each.

**And a reproducibility flag you should care about more than the number.** `r21-s5` read 146 named orgs / 17,725 licences on 2026-08-30. I read 84 / 16,175 on 2026-08-31 from a page with no client-side pagination. One of the two counts is wrong. This is the same class as DECIDE §10's "62% of load-bearing claims needed correction" — the *headline* of the B2B recommendation could not be reproduced 24 hours later. **Re-count before this number reaches a deck.**

**Falsifier:** show me any local-first tool that built a voluntary commercial-licence line to >₹5L/yr *without* a prior mandatory-licence period and without a six-figure user base. If one exists, this criticism collapses.

---

### 2 · Who signs, and why this quarter — there is no trigger, and the report says so

`r21-s5` did the honest work here and then buried the conclusion. Across 859 compliance-mentioning HN comments, the named triggers are regulation (25.3%), incident (8.8%), a specific PO (5.4%), the first enterprise customer (3.4%). **None of them is a trigger to buy a documentation tool** — they are triggers to buy Vanta. The report's own summary of our position: *"There is no quarter-driven compliance trigger for this product, and inventing one in the deck would be the kind of claim §58 exists to prevent."*

The record's §102.2 already ranked buyers by *trigger × ability to sign* and produced the opposite ordering to §21 — and said so in terms: *"The ranking inverts the record's §21 order almost exactly. That is the finding, not a formatting accident."* §21 still opens with *"monetisation is B2B-shaped"* on the strength of an `[SS]`: *"the median solo B2B founder's revenue is more than 4× the median solo B2C founder's."*

**SEVERE (evidence hygiene): the load-bearing sentence of the segments section is unverified, and the record's own later section refutes it.** Two documents in the same repo give opposite instructions to a build team. Either delete the §21 framing or promote the `[SS]` to `[fetched]` with a source. Do not ship both.

**The honest answer to "who signs this quarter":** nobody, for the product. The only counterparty who will sign anything in the next 90 days is an existing client signing an AMC (`r22-t3`: ₹15–40k/mo SLA-only, ₹50k–2L/mo active), and that is services revenue, not B2B product revenue. Saying "B2B" about a signature that is actually a maintenance retainer is the kind of self-flattery that gets you a year in.

---

### 3 · The procurement wall, priced — and the finding that it never bites

Costs converted at USD/INR 95.39, EUR/INR 111.0585 [fetched, ECB via api.frankfurter.app, rate date 2026-08-28]. Annual survival nut ₹13,07,016 (two founders at ₹45k + ₹18,918 fixed) [derived from `r22-t3`]. R0 = 58 pts ≈ 63 days ≈ 9.0 weeks [§28.6].

| Obligation | Cash | Founder-time | vs our annual burn / R0 | Bites at |
|---|---|---|---|---|
| **SOC 2 Type II** | $15k–$50k [measured, `r21-s5` corpus] | ~6 months calendar | **₹14.3L–₹47.7L = 1.09×–3.65× total annual burn** [derived] | A PO *contingent* on it [tptacek, HN 48150204] |
| **SAML/OIDC SSO** (Okta, Entra, Google) | ~0 | 4–8 weeks + permanent tail | **44%–89% of the entire MVP-0 lane** [derived] | ~40 seats or an IdP mandate |
| **SCIM** | ~0 | +3–4 weeks | +33–44% of R0 | Same buyer, later |
| **Admin console + audit log** | ~0 | 8–12 weeks | 0.9×–1.3× R0 | 25+ seats (Zed's own order-form threshold) |
| **Full team motion** | $15–50k | **15–24 weeks** | **1.67×–2.67× the whole R0 lane** [derived] | — |
| **Security questionnaire** (47 pages, "6 hours a day") | 0 | ~40 h/deal | **₹56k–₹80k of forgone billable = 51%–73% of one month's nut, per deal** [derived at `r22-t3`'s ₹1,400–2,000/h] | First deal ≳$25k ACV |
| **Cyber insurance** | $18k/yr for $5M cover in the one opened case [fetched, r/SaaS 1pmwnd7]; Indian PI/cyber quote-only [BUSINESS §85.2] | — | 1.3× annual burn at the US figure | First DPA demanding a certificate |
| **EU Art. 27 representative** | **€420–€852/yr = ₹46,645–₹94,622** [fetched, prighter.com/pricing, 2026-08-31] | days | **3.6%–7.2% of annual burn** | **The first EU *free* signup** [§53] |
| Delaware contracting entity | $3k–$8k/yr [inference, `r21-s5`] | — | 2.2%–5.8% | First US enterprise MSA |

**And now the finding that makes most of that table irrelevant.** At our own published prices, $25,000 of ACV — the level at which `r21-s5` says questionnaires start — requires **500 Work licences at one company, or 69 seats at $30/month** [derived]. Only **5 of 84** named organisations on the largest voluntary-payer wall in this entire category (6.0%) hold 500+ licences [measured].

> **We are not blocked by the procurement wall. We are priced too low to ever reach it.** Every expensive line above is triggered by a deal size our price list makes unreachable — which is good news, and which also means the B2B upside is correspondingly trivial. You cannot claim the procurement wall as a reason to stay small and also claim B2B as the monetisation shape. Pick one.

**SERIOUS gap in `r21-s5`'s framing:** "defer everything until a PO pays for it" is correct for SOC 2, SSO and SCIM. It is **wrong for the statutory items**, and the report does not mention them. GDPR Art. 3(2) attaches to a free tier reachable from the EU *"irrespective of whether a payment of the data subject is required"*, and Art. 27 then requires a designated EU representative **in writing** [§51.2, fetched]. §53 already says: *"The EU representative must exist before the first EU free signup."* So ₹46,645–₹94,622/yr and the DPDP/GDPR architecture contradiction (§51.2: *"A single storage architecture cannot satisfy both by accident"*) are owed **before the first free user**, not after the first PO. That is not a procurement cost; it is a cost of shipping at all, and it is missing from every B2B cost table in the record.

**Falsifier:** counsel confirms the "occasional processing" exception in Art. 27(2) covers a free markdown editor with EU users. Then delete the line. Nobody has asked.

---

### 4 · The support obligation — this is the wall that actually binds

The record already knows the answer and has written it three times in different places without connecting them:

| Fact | Source |
|---|---|
| One person, IST, asleep. 99.9% = **43.2 min/month**; 99.5% = **216 min/month** | record, derived |
| *"one person asleep in IST cannot honour that, and publishing it is a lie that a B2B buyer will eventually price"* | record, line 15258 |
| *"B2B converts a soft SLA into a hard one; two founders selling globally from India cannot hold a hard SLA across timezones without a third person, and a third person is not in the constraint set"* | §102.4 |
| Ops load already 91.5 h/mo (46% of a working month) at 502 paying users; wall at 1,239 | §85.6, derived |

**The honest SLA is: a published SLO of 99.5% measured from an external prober, next-business-day IST first response, no credits, no phone number.** Anything else is a claim you will breach in month two, in writing, to a customer who kept the email.

**What one enterprise incident costs the roadmap, quantified.** `r22-t3` gives the stretch formula: a founder splitting time stretches the R0 calendar by 1/(1−f). An enterprise account with a named contact and a response expectation is not 12 minutes a ticket; it is an incident, a written post-mortem and a follow-up call.

| Enterprise support share of a 198-h month | R0 (63 days) becomes | Slip |
|---|---|---|
| 20% (≈40 h) | **79 days** | +16 days |
| 35% (≈69 h) | **97 days** | +34 days |

[derived]. And `r22-t3`'s whole funding plan rests on a hard rule — *"founder B's client hours never exceed 90/month, and founder A's never exceed zero."* **An enterprise SLA is the one obligation that cannot respect that rule, because it lands on whoever is awake, not on whoever is rostered.** One B2B customer converts the services-funded model's central discipline into a fiction.

**FATAL, conditional on signature, and zero-probability today because there is no customer:** a DPA with a contractual breach-notification clock, held by a single person in one timezone with no second on-call, against DPDP s.8(6) — failure to notify the Board and affected principals — with a ceiling of **₹200 crore** [fetched, DPDP Act 2023 Schedule, BUSINESS §85.2]. Section 33(2) means a ₹2.4 crore company is not a ₹250 crore respondent, and BUSINESS §85.2 correctly says budget the proportionate penalty. But the *clock* is not proportionate: it runs the same speed for a solo founder on a flight as for Microsoft. This is the only item in the entire B2B analysis with company-ending shape, and it arrives with a signature, not with a feature.

**Falsifier:** a lawyer confirms a DPA can be signed with a "commercially reasonable efforts, next-business-day IST" notification standard that an enterprise counterparty will actually accept. If yes, this drops to SERIOUS.

---

### 5 · Is repo-residency worth money, or nothing without SOC 2?

Neither. It is worth **sales-cycle time at the small end and zero at the large end**, and it is not ours.

| | |
|---|---|
| Worth money? | No. Nobody has priced it. `r21-s5` counted since 2025-01-01: `"document audit trail"` **0** HN comments, `"audit trail for AI edits"` **0**, `"byte-level diff"` **1**, against `"security questionnaire"` **30** |
| Worth nothing without SOC 2? | Also no — it does real work *below* the questionnaire threshold, where the objection is a nervous cofounder, not a 47-page form |
| Is it differentiated? | **No.** Obsidian, Logseq, VS Code, Zed's free tier and plain git all hold nothing either. Against the actual alternative set, residency is Kano **Must-be**, not Attractive [`r25-w5` framework applied] |
| Where it fails | A questionnaire is scored pass/fail on the whole. *"Get even a single NO and you're done"* [fetched, HN 48151965] |

**And here is what Obsidian actually pays for instead of SOC 2, which `r21-s5` missed entirely:** four published third-party security audits with full public reports — Cure53 (Dec 2023, Dec 2024, Oct 2024) and **Trail of Bits (Dec 2025)** on the Sync API, server and cryptography [fetched, obsidian.md/security, 2026-08-31]. Zero SOC 2, zero ISO 27001, zero HIPAA on the page — but a recurring, named, top-tier pentest cadence with reports linked publicly.

So the precedent is not "a licence and a logo wall." It is **a licence, a logo wall, and a five-figure-plus annual security-audit line we cannot currently afford** [neither firm publishes rates; get a quote, do not budget from memory — [SS]]. That is the missing third leg, and it is the leg that answers the questionnaire.

**Falsifier:** one deal where a buyer chose us over Obsidian/Logseq/git *because* of residency. If the comparison set is local-first, residency wins nothing.

---

### 6 · The counter-intuitive number nobody in the record has put together

Cost to reach default-alive (₹13,07,016/yr, two founders), by motion:

| Motion | Unit economics | **Humans required** |
|---|---|---|
| D2C Pro, ₹299 | ₹217.40 contribution/mo [§23.2] | **501 paying users** |
| Work licence, $50/yr | $45.17/yr contribution [§23.2] | **304 licences** (or 395 at India ₹3,999 net of GST + Razorpay) |
| **Team seats, $30/seat/mo** | $331/seat/yr net of ~8% MoR | **42 seats — two 20-person companies** |

[all derived]. **The team tier needs 12.1× fewer humans than the D2C tier to make this company default-alive.** At one founder (§53's number, not DECIDE's) it is 294 Pro subscribers, 178 licences, or **24 seats**.

That reframes the entire question. The team motion is not the expensive luxury the record treats it as — it is arithmetically the *cheapest* path to survival, by an order of magnitude. `r22-t3` half-spotted this ("$10M ARR needs 27,778 seats, not 265,858 individuals") and then filed it under "reasons to reopen a raise." It is not a fundraising trigger. It is the survival path.

**What actually blocks it is not procurement.** It is the three things above: (a) you cannot sell a team tier with zero users and no reference customer; (b) the admin layer Zed ships at $30/seat — *"Org-wide AI model policies, Data governance controls, Unified spend visibility, Role-based access controls,"* order forms at 25+ seats, and explicitly *"SSO, SAML, and SCIM are planned but not currently available"* [fetched, zed.dev/pricing, 2026-08-31] — is 8–12 weeks we do not have; and (c) one person cannot be on call.

Note what that Zed page does to `r21-s5`'s deferral list. Zed defers **SSO/SAML/SCIM** and ships **the admin console, RBAC and org policy**. `r21-s5` puts the admin console and audit log in the same "refuse until a PO" bucket as SAML. The live market says they are not the same bucket: **SSO is the toll booth you defer; the admin layer is the product you sell.** If a team tier ever happens, that is the order.

---

### 7 · What is genuinely good here, briefly

- **The cheap/expensive split is the right frame and it is correctly populated.** "Everything cheap is a consequence of not holding the data; everything expensive is a consequence of holding the identity" is the single most useful sentence in `r21-s5` and it survives every criticism above.
- **Refusing speculative SOC 2 is correct and well-sourced.** tptacek's rule and the bitbasher counter-example ($2XX,XXX contracts, no certificate) are the right evidence, and 4.3% deal-loss against 6.6% calling it theatre is a real measurement.
- **The Warp counterexample is honest self-criticism** — one competitor prices BYO-key as a paid team control while §24.6 gives it away as a principle. Naming a live contradiction in our own published policy is exactly the discipline the record is short of elsewhere.
- **The DIY-beats-paid measurement (211 vs 67, 3.1:1)** is the most decision-relevant number in the report and it points at pricing, not at B2B.
- **§102.7's list of five populations we are explicitly not for** is better strategy than anything in §21. Keep it; delete §21's B2B framing.

---

### 8 · Findings, ranked, each with its falsifier

| # | Sev | Finding | Falsified by |
|---|---|---|---|
| 1 | **SEVERE** | The Obsidian licence is a **donation**, was mandatory for five years first, and the CEO says the revenue is Sync + Publish — the line we declared out of scope | A local-first tool that built a voluntary licence line >₹5L/yr with no prior mandatory period and <100k users |
| 2 | **SEVERE** | 61.8% of the named floor is **one company**. Median named logo = $1,250/yr; **11 such logos** = our survival year [derived] | A tier recount showing broad distribution rather than one whale |
| 3 | **SEVERE** | §21 ("monetisation is B2B-shaped") rests on an `[SS]` and is refuted by §102.2 inside the same record | Promote the 4× claim to `[fetched]` with a source |
| 4 | **SEVERE** | The team motion costs **1.67×–2.67× the entire MVP-0 lane** in founder-time before one seat is sold | A scoped admin-layer spec that lands in <6 weeks |
| 5 | **SERIOUS** | Statutory obligations (EU Art. 27 **€420–852/yr**, DPDP/GDPR architecture) trigger on the **first free EU signup**, not on a PO — absent from every B2B cost table | Counsel confirms the Art. 27(2) exception applies |
| 6 | **SERIOUS** | The precedent includes a **recurring third-party pentest cadence** (Cure53 ×3, Trail of Bits) we have not priced | A questionnaire passed with residency alone and no audit report |
| 7 | **SERIOUS** | One enterprise account at 20–35% support load slips R0 from 63 to **79–97 days**, and breaks `r22-t3`'s "founder A's client hours never exceed zero" rule | A B2B customer served inside the 0.1445 h/user/mo coefficient for two quarters |
| 8 | **SERIOUS** | `r22-t3`'s reopen trigger — "three unsolicited inbound teams" — is unfalsifiable with two marketing posts ever shipped. §102.6's "ten agency conversations" is the better instrument | Any unsolicited team inbound at all |
| 9 | **MINOR** | 84 vs 146 named orgs across one day, from a server-rendered page | A third count |
| 10 | **FATAL if signed / zero probability today** | A DPA breach clock against DPDP s.8(6) (₹200 cr ceiling) held by one person in one timezone | Counsel drafts an acceptable next-business-day-IST notification standard |

---

### 9 · Verdict

**Neither yet — and "B2B first" is the more expensive of the two wrong answers.**

There is no B2B motion to be first at. There is a payment method, and it does not need building. Concretely, in order:

1. **Do not build the licence motion. Answer the email.** `r21-s5` costs the invoice/PO/seat-count work at ~1 week. At n < 20 commercial buyers the correct implementation is a Razorpay payment link and a PDF invoice, produced by hand in twenty minutes when someone asks. One week of R0 time buys a checkout for a buyer who does not exist. Ship the *sentence* on the pricing page ("using it at work? here's how to pay") and nothing behind it.
2. **Ship the statutory minimum before the first free EU user, not before the first PO.** EU Art. 27 representative at €420/yr. This is the only B2B-adjacent line item that is genuinely urgent, and it is currently in no B2B budget.
3. **D2C first, for the ten-to-twelve months §102.4 already decided** — with the correction that D2C at ₹299 is the *slowest* arithmetic path to survival (501 users vs 42 seats) and its job is therefore to produce **reference customers**, not revenue. Judge it on the DECIDE §9 falsifier — six of ten strangers running it on their own repo — not on MRR.
4. **Run the team question as ten conversations, not ten features** (§102.6). The specific sentence to listen for is not "we need SSO." It is Zed's shipped list: org policy, spend visibility, who-can-do-what. When five teams say the same one, build the admin layer — and defer SSO/SAML/SCIM behind it, in that order, on the live market's own sequencing.
5. **Refuse every hard SLA and every DPA with a fixed notification clock until there is a second on-call human.** Publish 99.5% as measured history and beat it. This is the constraint that actually binds B2B, and it binds at 42 seats, not at 600.

The counter-intuitive finding in the brief is real and it is being read backwards. Obsidian does not prove that a licence and a logo wall are a B2B business. It proves that **a beloved free product with millions of users can convert affection into a seven-figure gratuity, of which more than half is one company's**, and that the actual business underneath is a $4/month sync subscription. We have the licence page and none of the affection, and we have written the sync product out of scope.

Fix that order, or stop calling any of this B2B.

---

## 9. Founder capacity

The phrase "two founders" appears in the record exactly where it was pasted in: §97's session-pack constraint block — *"Constraints that shape every answer: two founders, India-based, selling globally"* [measured, `FRONTMATTER-RECORD.md:11136`]. §53, the only section with resourcing authority, says: **"One person. This is the binding constraint on everything above."** No headcount, equity split, or second-founder start date appears anywhere else. `grep` finds no cofounder named in 16,189 lines.

That constraint line then propagated into at least nine downstream reports, which spent it:

| Report | What it decided on "two founders" | Cost of the error |
|---|---|---|
| `r22-t3` §3 | Founder A at 100% on R0, Founder B at 54–78 client h/mo → **"Cost against the published plan: zero"** | The plan's entire funding conclusion |
| `r20-q7` | A week-by-week two-lane build table: *"Founder A (engine) \| Founder B (thesis + surface)"* | A build schedule that cannot be executed |
| §103 | Plugin lane priced at *"a quarter of two founders' time"* | Every effort estimate denominated this way is understated 2× |
| `r20-q5`, `r21-s5` | Enterprise and hard-SLA segments refused because *"two founders cannot"* | Directionally safe; the refusals hold harder at one |
| `r19-p1`, `r20-q1`, `r20-q3`, `r21-s3`, `r21-s4` | Scope refusals citing two-founder capacity | Same — safe, but the reasoning is now unaudited |

`r22-t3` was honest enough to name the discrepancy in its own second paragraph and then reason on both anyway, ending at a two-founder allocation. Its headline is the load-bearing sentence in the money model, and it is conditional on a person who does not exist.

**What changes under each.** This is not all bad news, and the good half is real:

| | Two founders (as modelled) | **One founder (as §53 states)** |
|---|---|---|
| Monthly nut | ₹1,08,918 (2 × ₹45k draw + ₹18,918 fixed) | **₹63,918** [derived] |
| Default-alive, @ ₹217.40 contribution | 501 paying | **294 paying** [derived: 63,918 ÷ 217.40] |
| Gross adds/mo to hold it, c=4% over 24m | 32.1 | **18.83** [derived: 294 ÷ 15.615] |
| Signups/mo @5%, visitors/mo @9% | 642 / 7,133 | **377 / 4,185** [derived] |
| Cumulative visitors, 24 months | 171,200 | **100,428** [derived] |
| Client hours to fund it | 54–78 h/mo | **32.0–45.7 h/mo** [derived] |
| Cost to the published calendar | **zero** (Founder A untouched) | **1.46× stretch** [derived: 198 ÷ (198 − 45.7 − 17)] |

The evidence supports **one**, unambiguously: §53 is a decision, §97 is a prompt. And deleting the second founder cuts the hardest number in the plan by 41% — default-alive falls from 501 paying users to 294, and the traffic requirement from 7,133 visitors/month to 4,185. That is a blog with modest traction, not a distribution miracle. Take that win.

But the same deletion voids the sentence the money model was built to deliver. There is no Founder A to protect. Those 32–46 client hours come out of the same 198, and so does every ops hour, every support ticket, and every page.

**Falsifier:** a signed founders' agreement naming a second person with a start date and an hours commitment. Absent that, every "two founders' time" estimate in the record must be doubled and re-read, and `r22-t3`'s §3 conclusion must be struck.

---

### C2 — SEVERE: the time budget, added up honestly

The record never adds these lines together in one table. Here it is, at the moment of maximum stress — roughly month +9 after first revenue, 150 paying / 3,000 free, revenue at half the nut:

| Line | Basis | h/month |
|---|---|---|
| Client work to close the ₹31,308 gap @ ₹1,700/h | [derived: (63,918 − 150 × 217.40) ÷ 1,700] | **18.4** |
| Support, pre-deflection (§46.2 rates × 20.72 min MHT) | 150×0.10 + 3,000×0.02 = 75 tickets | **25.9** |
| Billing ops (§85.6, interpolated) | e-mandate failures, dunning, invoices | **3.0** |
| Compliance, close, filings (§85.6 fixed) | measured constant | **17.0** |
| On-call interrupt + one incident (§38 page conditions) | [inference: 2 × 3 h] | **6.0** |
| GTM/content (§28.2 GTM lane = 34 pts, "20 posts" = XL) | [derived: 34 pts × 1.09 d ÷ 12 months] | **20.0** |
| **Non-engineering total** | | **90.3** |
| **Engineering residual, of 198** | | **107.7 (54%)** |

The §28.6 calendar prices 1 point at 1.09 calendar days and states — correctly, and to its credit — that the measured 25% active-day density is *inside* that rate, not a multiplier on it. I re-measured it: 13 active days in the 50 days from 2026-07-13 to 2026-08-31, 26% [measured]. The rate is honest.

What the rate is **not** is conditioned on a company. It was measured over a period with zero users, zero tickets, zero on-call, zero billing operations, and zero compliance calendar. From M7 onward all six lines above switch on at once.

| Milestone | Published (§28.6) | At 1.46× (pre-revenue, client + compliance only) | At 1.84× (mid-transit, table above) |
|---|---|---|---|
| R0 complete (58 pts) | 2026-10-31 | 2026-12-20 | 2027-01-24 |
| Code-complete (196 pts) | 2027-03-31 | **2027-07-09** | 2027-10-11 |
| Shippable (221 pts) | 2027-04-28 | **2027-08-18** | 2027-11-27 |

[derived; base arithmetic re-verified: 2026-08-29 + 214 days = 2027-03-31, matching the record exactly, so the stretch is applied to a sound base]

**The deficit is not raw hours — it is that the plan books 100% of a 198-hour month to engineering and the honest residual is 54–77%.** A 16-week slip on shippable is survivable. What is not survivable is that the slip is invisible in the document, so it will be discovered at month 9 as a crisis rather than at month 0 as a plan.

One thing the record gets right and I will not attack: §85.6's wall (198h fully consumed at 1,239 paying users, half consumed at 554) is *not* the binding constraint at one-founder default-alive. At 294 paying, ops is 61.5 h/month — 31% of the month [derived: 0.1445 × 294 + 19]. The wall is fine. The transit to it is the problem.

**Falsifier:** four consecutive weeks of a logged hour ledger showing ≥150 hours/month on product. The founder has 149 scripts and a 5,136-row trace ledger; none of them measure this.

---

### C3 — SEVERE: 5–7 founder-months of infrastructure for an audience of one

Measured, on this machine, 2026-08-31, read-only:

| Artefact | Measurement |
|---|---|
| `~/.claude` + `~/.sgnk` commits | **598** (459 + 139) across **32 unique active days**, 2026-06-27 → 2026-08-27 |
| frontmatter commits, all time | **57** across **13 unique active days**, 2026-07-13 → 2026-08-31 |
| In the overlapping 50 days | AIOS **439 commits / 19 active days**; product **57 commits / 13 active days**; **13 days AIOS-only**, 7 product-only |
| `skills-src` | 966 files, 124 SKILL.md, **720,340 words** |
| `~/.sgnk/bin` | **149 scripts**; 69 gate assertions, 40 registered |
| `AIOS-BOOK` | **1,410,614 words** across 376 md files (excluding `.bak` dirs), 124 MB, with TeX/HTML/PDF build pipeline |
| Superseded `AIOS-*.md` / `HANDOFF-aios-*.md` at `~/.claude` root | **60 files** |

**Estimate, with the method stated so it can be argued with.** 2,130,954 words of authored substrate (skills-src + book), all of it reviewed diff-by-diff because §28.5 makes diff acceptance founder-only. At a generous 25,000 words/day of reviewed structured output, that is 85 working days = **4.3 founder-months of authoring alone** [derived; the 25k/day rate is [inference]]. Add 149 scripts, 69 gates, and the debugging record — Learned Rules #49, #55–#68 are each an AIOS incident, including one where two test agents rebound the live launchd job and all 12 hooks to vanishing temp paths — and **5–7 founder-months since 2026-06** is the honest band.

Priced at the founder's own consulting rate: 5 months × 198 h × ₹1,700 = **₹16.83 lakh** [derived] — **26 months of the one-founder nut** [derived: 16,83,000 ÷ 63,918]. That is not "time I could have spent coding." That is the entire runway from launch to default-alive, spent.

**Name it for what it is.** AIOS is a second startup. It has more documentation than the product, more tests than the product's shipping path, one user, and zero revenue. And the comparison that ends the argument:

> **The product repo has no `.github` directory at all** [measured]. **The agent infrastructure runs 40 registered regression gates nightly under a launchd job at 23:55** [measured, `ai.sgnk.eod`, r23-u1].

The founder built production-grade CI for his own tooling and is shipping a product with none — finding 12, restated as an allocation decision rather than an omission. §28.4's M0 says the first CI green must be preceded by a deliberate red. He already knows how; he has done it 40 times, for himself.

The tell that this is not investment but avoidance is finding 10: 6,884 routing decisions, 1 reward label, 0.01% closure. A system built for an outcome notices a 1-in-6,884 outcome rate in week one, because that rate *is* the outcome. This one ran for months, diagnosed itself correctly inside its own state file, and the diagnosis sat there. The satisfaction was in the building.

**Falsifier, and I mean it:** freeze `~/.claude` and `~/.sgnk` for four weeks and measure product commits/active-day against the 26% baseline. If throughput falls, the substrate was load-bearing and I am wrong. If it rises or holds, it was not.

---

### C4 — SEVERE: 92 words per line of source is a diagnosis, not a style

Measured today: `docs/` holds **2,343,005 words across 299 markdown files** against **25,407 lines of TypeScript** — **92.2 words per line** [measured; the brief's 87 is the same finding on a slightly earlier count]. Sharper, over the 50-day window across all 57 commits:

| | Insertions |
|---|---|
| `docs/` | **276,511 lines** |
| `src/` | **26,686 lines** |
| Ratio | **10.4 : 1** |
| Commits touching `src/` at all | **13 of 57 (22.8%)** |
| Commits touching no source | **44 of 57 (77.2%)** |

**What the behaviour indicates.** Writing produces a legible artefact per unit of effort and cannot fail a test. Code produces a binary verdict from a machine. Under uncertainty about whether anyone wants the product — and finding 2 says nobody has asked for its central claim, finding 5 says the wedge is table stakes, finding 6 says the flagship render is the least-demanded measurable — effort reallocates to the activity whose output cannot be refuted. That is not laziness; it is the most common shape of competent avoidance, and it is specifically what a founder with strong writing ability will default to.

The confirming evidence is finding 9. When someone finally opened primary sources, **62% of the record's load-bearing claims needed correction** — 13 revised, 5 refuted, 3 unverifiable. The prose was not merely voluminous, it was wrong more often than right. And the response to discovering that was **three more documents**: the RECORD, PRD v2, and DECIDE.md. The 08-29 → 08-31 burst is 19 commits, and the src/docs split says what they were.

Second-order: the same behaviour explains C3 exactly one level up. AIOS is tools-for-the-work instead of the work; 2.3M words of research is words-about-the-work instead of the work. Same function, different medium.

**Falsifier:** four consecutive weeks where `src/` commits ≥ `docs/` commits. Baseline to beat: 13 vs 44.

---

### C5 — SERIOUS: three weeks ill, after the first paying customer

At one-founder default-alive (294 paying, ~5,880 free), a 21-day absence:

| Domain | Consequence | Recovery |
|---|---|---|
| **Support** | 103–144 tickets queue [derived, §46.2 and §85.6 rates × 0.7 months] against a stated 24 h email expectation | Weeks; and the queue arrives at a founder already behind |
| **On-call** | Zero responders. §38 pages to a phone with DND override; Better Stack's free tier covers **one** responder [fetched, §38] | The page is simply not answered |
| **Billing** | 147 monthly renewals × 8% single-attempt failure = **11.8/month**, and RBI's e-mandate rail gives **one attempt, no retry** → ~8 involuntary churns in 21 days | Manual, per-user, after the fact |
| **Statutory** | **CERT-In: 6 hours** from noticing [fetched, §38]. DPDP s.8(6) breach notification. GDPR Art. 33: 72 h | Not recoverable. A missed clock is a violation, not a delay |
| **Roadmap** | 21 days ÷ 1.09 = **19.3 points = 9.8% of the 196-point plan** | Pushes every downstream date |
| **The nut** | Client retainers carry their own SLA (§4.8: "AMC ₹15–40k/mo **SLA-only**"). Missing three weeks risks the retainer | The retainer *is* 100% of the funding |

The compounding is the point. The illness hits the funding source, the product calendar, the support promise, and the statutory clock **simultaneously**, because they are one person. HN's own record on this is blunt: *"when things go south with your health or anything personal; you'll lose your company"* [fetched, hn.algolia.com comment 19796312, 2019-05-01].

And here is the one genuine argument for two founders that the record never makes: under a real A/B split, B's illness costs a month of the nut but not the calendar, and A's illness costs the calendar but not the company. **Neither failure is terminal.** At one founder, every failure is the same failure.

**Falsifier:** a 5-day laptop-off drill, run once before the first paying user, with a written list of what broke. Cheap, falsifiable, and it converts this from an argument into a measurement.

---

### C6 — SERIOUS: the plan's own tripwire fired while the plan was being written

§28.7, risk #6, early warning, checked weekly: *"Two consecutive weeks with zero commits."*

Measured [product commit history, by day]:

```
2026-08-10  ← 4 commits
2026-08-28  ← 1 commit          18 calendar days, ZERO product commits
```

In those same 18 days: **15 commits to agent infrastructure** (9 to `~/.claude`, 6 to `~/.sgnk`), including the 2026-08-27 entry *"Apply the memory/handoff research: 4 learned rules, 2 handover patches"* — a round the founder's own CLAUDE.md documents as *"two rounds, 34 agents, ~5.1M tokens"* [measured].

A second instance: 2026-07-17 → 2026-07-25, 8 days with zero product commits, bracketing `AIOS-BOOK`'s own handoff documents dated 2026-07-18 and 2026-07-24 [measured].

The tripwire is well-designed. Nobody was on the other end of it. A risk register with weekly checks and no checker is documentation of intent, which is C4 again in a different costume.

---

### What is good, specifically

- **§85.6 is the best section in the document.** It states its coefficient (0.1445 h/paying user/month), solves for the wall (1,239 paying), and then uses its own arithmetic to **refuse the company's headline ₹20 lakh/month milestone** as "a two-to-three person milestone." Founders almost never publish the number that kills their own slide.
- **§46.3 and §46.5** — deflection-by-engineering, category by category, with the hire trigger moving **5.83×** ($14.18/h → $82.64/h) as the decision variable rather than the absolute hour count. That is operator thinking of a quality I rarely see pre-revenue.
- **`r23-u1` is an honest self-audit** that names its own loop dead. `epochs.jsonl` recording `precision[rejected] = 0/8 = 0.000` and gating the negative-reward branch off because of it is a founder writing down that his own signal is noise. That capacity for self-refutation is the single best predictor here that this critique will be acted on.
- **The one-founder reading is good news on the hardest number:** default-alive at **294 paying users and 4,185 visitors/month**, not 501 and 7,133.
- **The engine discipline is real:** 8,513-file pinned corpus, red-proof-before-fix, 1,575 tests, refuse-rather-than-guess. The problem is not that this founder cannot build. It is where the building goes.

---

### What would have to change for any version of this to ship

Ranked by leverage, each with a trigger and a falsifier:

| # | Change | Trigger | Falsifier |
|---|---|---|---|
| 1 | **Write the headcount down.** One founder, in §53's language, everywhere. Strike `r22-t3` §3 and `r20-q7`'s A/B table; double every "two founders' time" estimate | This week | A signed second-founder agreement |
| 2 | **Substrate freeze until M1 is green.** Zero commits to `~/.claude`/`~/.sgnk`. Delete the shadow→promote ladder and the `"dead"` skill tier rather than fixing them | This week | Product commits/active-day fall below the 26% baseline over 4 weeks |
| 3 | **One hour ledger, three buckets** — client / product / substrate — logged daily, reviewed weekly against a **cap of 8 substrate hours/month**. He instrumented 6,884 routing decisions; instrument the one variable that decides the company | This week | 4 weeks of ledger showing ≥150 h/mo product without a cap |
| 4 | **Documentation cap: no `docs/` commit in a week with no `src/` commit.** Archive the 2.34M words behind DECIDE.md; the four-page digest is the only living document | This week | src ≥ docs commits for 4 straight weeks makes the cap unnecessary |
| 5 | **CI in the first 48 hours, with a deliberate red first** (§28.4 M0, already specified). Port `md/.github/workflows/ci.yml`. He has 40 nightly gates for himself and none for the product | Day 1 | — |
| 6 | **Cut the plan to R0 (58 pts) and nothing else.** T2 is already off the critical path; take T4 and GTM off the calendar until M1 is green | This week | R0 completes on the published 2026-10-31 without the cut |
| 7 | **Retire the on-call promise before it exists.** No published uptime number (§38 already says this), no live chat, a stated **48-hour** response, and "solo maintainer" on the pricing page. Obsidian monetises exactly this posture | Before M7 | Measured first-response under 24 h sustained for 90 days solo |
| 8 | **Run the illness drill** — 5 days, laptop off, written breakage list | Before the first paying user | Nothing breaks |
| 9 | **Reprice the client lane as strategy, not tax.** At one founder, 32–46 h/month funds everything and the hard rule is numeric: **client hours ≤ 46/month, substrate hours ≤ 8/month, product hours ≥ 130/month.** HN's consensus failure mode is time allocation, not strategy | Now | — |

**The one thing that would change my overall verdict.** Stripe's data says top-decile solo founders are ~30% more likely to build B2B and ~2× more likely to build AI-native, and `r18-v4` confirmed the month-24 revenue gap at more than 4× for solo B2B over solo B2C [fetched 2026-08-31]. A Team tier at $30/editor needs **27,778 seats** for $10M ARR against 265,858 individuals — 9.6× fewer humans, and it moves the founder-capacity wall from a per-user coefficient to a per-account one. If three unsolicited teams ask for multi-editor access without outbound, the capacity arithmetic in this critique changes materially and should be re-run.

Until then the constraint is not the market, the pricing, or the engine. It is that a founder who has produced 4.8 million words and 598 infrastructure commits in ten weeks has produced 13 days of product code, and nothing in the plan currently measures that.

---

## 10. The case against building this at all

| # | Charge | Severity | Falsified by |
|---|---|---|---|
| **C1** | The success case is worth less than the founder's current side income, and arrives 20 months later | **FATAL** | A pricing/segment change that puts 24-month contribution above ₹300k/mo, i.e. >10× ARPU or a B2B seat model, evidenced before build |
| **C2** | There is no demand signal at any resolution anyone has looked for | **FATAL** | EW-3: three landing-page arms, ≥400 visitors each; byte-fidelity arm ≥40% of best arm's capture rate |
| **C3** | The founder is not building it, and has not for 21 days | **FATAL** | Two consecutive 14-day windows at doc:src file-change ratio <3:1 and active-day density >20% |
| **C4** | Every layer is being commoditised free by better-resourced parties, faster than one person ships | **SEVERE** | Name one capability, shipped by day 90, that no free tool has within 18 months, with an argument for why not |
| **C5** | The price makes best-in-class retention arithmetically unreachable, and lock-in was removed on purpose | **SEVERE** | ChartMogul's ARPA<$10 band being wrong, or a repositioning above $25/mo ARPA |
| **C6** | The record's own epistemics fail the test the product is built to sell | **SEVERE** | `npm run claims` green on shipped copy for 90 days, and a re-audit finding <20% correction |
| **C7** | Distribution is rented, crowded, and the winners in the slot are free | **SERIOUS** | Email list >300 by day 90 with <60% from any one platform |
| **C8** | Sync — the only thing the market demonstrably pays for — was ruled out of scope | **SERIOUS** | Evidence that any of the 60 HN Obsidian-payment comments was about something other than sync |
| **C9** | One founder or two is unresolved, and every calendar number depends on it | **SERIOUS** | A written answer. Today. It costs nothing |
| **C10** | The learning loop is dark, which also poisons the best alternative | **SERIOUS** | One κ ≥ 0.7 measurement against a blind gold set, dated within 7 days |
| **C11** | No CI, two unrotated PATs, a shipping table editor that destroys bytes, `globals.css` belongs to another product | **MINOR** | A day of work each |

---

### C1 — FATAL. The best case is a worse deal than the status quo

This is the charge that ends it, and it is made entirely out of the plan's own numbers.

| Path | Time to ₹1.09L/month | Prerequisites | Risk |
|---|---|---|---|
| **frontmatter, per `r22-t3`** | 24 months | 171,200 cumulative visitors, 15,408 signups, 502 paying, churn held at 4%/mo | Every one of C2–C10 |
| **78 client hours/month** | This month | An email to five existing AMC-eligible clients | Founder's time only |
| **4 × ₹3,00,000 productised engagements/yr** (`r23-u4`) | 3 months | Rewrite one page of `ecosystem.md` §4.8, which currently has zero line items for this | Kappa must be honest first |

`[derived]`. The venture version does not rescue it. $10M ARR at ₹299 requires **265,858 paying users** and **59.1 million cumulative visitors** — 2.7× India's entire GitHub contributor population, and **215× the point at 1,239 users where one founder's month is 100% consumed by support** `[derived, r22-t3, §85.6]`. Antler's ₹4 Cr is 367 months of the nut against a seven-year fund clock. The category's own leader raised nothing and says so on its About page.

So the ceiling is capped by the ops wall at ~1,239 users and the floor is beaten by consulting today. **The entire addressable outcome of this product, if everything goes right, sits inside a band the founder can already reach with a calendar and an invoice.** That is not a startup. That is a very expensive hobby with a business plan attached.

The counter-argument — "the product compounds and consulting does not" — is correct in general and wrong here, because compounding requires retention, and C5 shows retention is capped below best-in-class by the price point that was chosen to make the product accessible.

### C2 — FATAL. Nobody is asking, at any zoom level anyone has tried

Findings 2 and 6 establish this at corpus scale. `r25-w4` #6 closes it at the highest-intent resolution that exists: in the largest "Obsidian alternative" thread of the last twelve months — 355 comments from people actively shopping for exactly this product — **zero mentioned corruption, mangling, overwrites, data loss or reformatting; zero mentioned byte, exact, fidelity or round-trip; two mentioned diff, review, hunk or patch** `[measured, r25-w4]`. Not rare. Zero. And a stranger pre-emptively rebutted the pitch: *"you already have that with Obsidian. You own the vault"* `[fetched, HN 48179677]`.

Two arXiv findings make it worse rather than neutral. **39.6% of developers say they do not plan to use AI for creating or maintaining documentation, and 58.7% for committing and reviewing code** — the two workflow slots this product occupies, and the two highest refusal rates in the survey after ops `[fetched, Stack Overflow 2025, n=25,349, via r25-w5]`. And documentation is the task agents *already fail least at*: **82.1% PR acceptance vs 66.1% for features; 92.3% for Claude Code documentation PRs** `[fetched, arXiv 2602.08915v2, via r25-w5]`. The review burden this product sells against is smallest precisely where it aims.

The plan's answer to this is EW-3: three landing pages, one weekend, day 60. **That test has not been run, and it costs less than one day of the documentation written this month.** Running it before building is not a compromise; it is the only defensible sequence.

### C3 — FATAL. The revealed preference has already voted

I measured this repository today, and it is worse than the reading `r18-w2` took yesterday.

| Signal | Value | Tag |
|---|---|---|
| File-changes by top directory, trailing 28 days | `docs/` **292** · `specs/` 23 · `test/` 14 · **`src/` 10** · `scripts/` 5 | `[measured 2026-08-31]` |
| doc:src file-change ratio | **29.2 : 1** (was 22.3:1 on 2026-08-30) | `[derived]` |
| Commits touching `src/`, trailing 28 days | **3 of 24** — and all three are dated **2026-08-10**, the same day | `[measured]` |
| Days since any commit touched `src/` | **21** | `[derived, date(1)]` |
| Active commit-days in 28 | **5 = 17.9%** against a plan that assumes 25% | `[measured]` |
| `docs/` corpus | 299 files, **2,342,861 words** against 26,464 source lines = **88.5 words per line** | `[measured]` |

Finding 11 recorded 2,219,390 words. Today it is 2,342,861 in `docs/` alone. **The documentation grew by roughly 123,000 words in the window during which the source code grew by zero lines.** `[derived]`

This is not a motivation problem and it is not laziness — the output is extraordinary. It is a *category* problem: the founder's revealed comparative advantage is producing rigorous analytical documents, and the market for the product he is documenting is the one thing his instrument cannot detect, because writing about it feels identical to building it. `r18-w2` named this K2 and rated it P=0.60. Twenty-one days of zero engine commits, on the only asset that differentiates the company, while nine PDFs of the same plan accumulate, is not a leading indicator. **It is the outcome, already arrived, being described as a risk.**

At 17.9% density, R0's 63 days become 88.5, and M7 — the first paying non-founder account — sits at **2027-04-28, Wednesday, 240 days away** `[derived, date(1) verified]`. Eight months of pre-revenue, funded by client hours, to answer a question a weekend landing page answers in sixty days.

### C4 — SEVERE. Three free things already occupy the position

Finding 1 covers Zed shipping the demo. The pattern is broader and each instance is independently fatal to a different layer of the pitch.

| Layer | Who ships it free | State, opened today | Tag |
|---|---|---|---|
| **The demo** — per-hunk accept/reject of agent changes | **Zed** | Personal tier **"$0 forever"**, source-available, **89,492 stars, pushed 2026-08-30** | `[fetched zed.dev/pricing + api.github.com, 2026-08-31]` |
| **The editor** | **Obsidian** | *"Free without limits. No sign-up required."* Charges **$4/user/mo for Sync alone**, $8 for Publish, $50/user/yr commercial | `[fetched obsidian.md/pricing, 2026-08-31]` |
| **The artefact thesis** | **GitHub** | `github/spec-kit` **132,390 stars**, MIT, pushed 2026-08-28 — 0→132k in 372 days | `[fetched api.github.com, 2026-08-31]` |
| **The engine itself** | **`dealfluence/adeu`** | MIT, "automatically blocking ambiguous text matches" — refuse-rather-than-guess, shipped, for `.docx`, distributed as a Claude Code plugin | `[fetched, r22-t1]` |

Read the second row against finding 4 once more. **Obsidian gives away the entire editor and charges $4/month for sync. frontmatter charges ₹299 = $3.13 for the entire editor, and sync is not built.** `[derived at ₹95.39/$]` The pricing is not aggressive; it is a category error. It prices the free half and omits the paid half.

The fourth row is the one that should sting. Independent convergence on the splice design confirms the design is right, and simultaneously proves it is worth nothing as a moat: a competitor's version is installable in one line, inside the same agent this product's user would be running, aimed at the file format that actually carries commercial commitments.

### C5 — SEVERE. The price forecloses the outcome

| Fact | Value | Source |
|---|---|---|
| Blended ARPU | **$4.00/mo** — inside ChartMogul's *lowest* published band | `[derived, r25-w4]` |
| Businesses in that band with NRR >100% | **2.7%** | `[fetched ChartMogul, r25-w4]` |
| Top-quartile customer retention in that band | **63.1%** annual = 3.76%/mo | `[fetched + derived]` |
| Best-in-class in that band | **74.9%** annual = 2.38%/mo | `[fetched + derived]` |
| The plan's *optimistic* scenario, c=2%/mo | **78.5%** annual | `[derived]` |

The plan's optimistic case is better than best-in-class for its own price band, and its middle case *is* the top quartile. Every scenario is shifted one full band optimistic. Layer on §27's own admission — switching cost is **"Near zero, by design — this is the anti-moat"** — and involuntary churn on an Indian rail that grants **one payment attempt** (§82.3), and the honest churn floor is above 4%/mo. At 4%, holding 502 users steady-state requires **20 gross paying adds every month forever**, which at 5% signup conversion and 9% visitor conversion is **4,462 visitors per month, in perpetuity, to stand still** `[derived]`.

Kite is the precedent and it is exact: **500,000 monthly-active developers, almost zero marketing spend, dead.** Their words: *"Our 500k developers would not pay to use it."* `[fetched, r25-w5]`

### C6 — SEVERE. The differentiator failed its only live test

Finding 9 is a 62% correction rate on load-bearing claims. In a normal company that is embarrassing. Here it is disqualifying, because **the product's entire thesis is "a system that refuses rather than guesses," and the only implementation of that discipline currently running is the founder, and it returned 13 confirmed / 13 revised / 5 refuted / 3 unverifiable.** `r18-w2` rates this K5 with irreversibility 5: the first commenter who checks one launch number and finds it unopened refutes the product, not the number.

The remedy exists and is cheap — `npm run claims` as a publish gate, red-proofed against a deliberately unsourced string. It is not built. Note also that this critique is written *from* that record, so if the record is 62% wrong, some fraction of the case for the product that survives is also wrong — and the errors have run in both directions.

### C7–C10 — SERIOUS, briefly

**C7, distribution.** **386 Show HN posts matching "markdown editor"; median 3 points; 44% scored ≤2; 5.7% reached 100** `[measured, r25-w5; independently re-counted today at n=386 via hn.algolia.com]`. **31% of the 42 posts that cleared 50 points in this category in twelve months say "open source", "self-host" or "free" in the title; the top four all do** `[measured, r25-w4]`. The channel that works is the channel where the winners are free. And `gray-matter` pulled **35,124,859 npm downloads last month** `[fetched api.npmjs.org, 2026-08-31]` — 35M monthly installs of the substrate, and no one shopping for a better one, because it has never visibly failed them.

**C8, sync.** Finding 8 says sync is #1 loved, #3 hated, #1 switching trigger. Finding 4 says 56 of 60 HN comments about paying Obsidian are about sync. The record declared it out of scope. **The single feature the market has demonstrated, in cash, that it will pay for was the one ruled out.** The stated reason is architectural discipline (git-merge + splice journal + CAS, never a CRDT) — which is a correct engineering decision and an unforced commercial one, because that architecture is a sync design, not a refusal to sync.

**C9, headcount.** `DECIDE.md` §6 says two founders; §53 says *"One person. This is the binding constraint on everything above."* Every capacity, calendar, cost and ops-wall figure derives from one or the other. **This is question #1 on the open-decisions list, it requires no research, and it is still open.** An unanswered founder count in month two is itself evidence about the decision-making.

**C10, the loop.** Finding 10 (0.01% reward labels) is the headline; the detail is worse and it matters *because it prices the alternative*. Model router honoured on **2.953% of 1,727 decisions**; `skill:"unknown"` on **79.084%** of trace rows; the one human-agreement measurement is **κ=0.1 against a 0.7 bar, n=9, verdict FAIL, never re-run in 44 days**; `~/.sgnk/evals/` **27 days dark**; `~/.sgnk/insights/` **never created**; 32 corrupt rows in the ledger despite a dedicated anti-corruption gate `[all measured, r23-u3 / r23-u4]`. This does not merely forbid the phrase "self-improving" — it blocks days 7–8 of the consulting product, which is the best alternative on the table. Fixing it is therefore not optional under either strategy.

---

### What is good, specifically

Four things, and they are not consolation prizes.

1. **The engine is real and the defect it fixes is real and dated.** 8,513-file pinned corpus, byte-identical verification, 98 test files, 1,575 tests, and a competitor's staff admitting the exact bug in public three days before you looked. Almost nobody at this stage has a verified artefact.
2. **Two genuinely demanded capabilities are uniquely tractable for you.** Nested-construct live preview (501 likes, the most-voted bug in Obsidian's history, plus 96+82+50+36+33 on siblings) and vault-wide refactor with a reviewable diff (86 likes). The OffsetMap makes both tractable. **These are the assets. The editor around them is not.**
3. **The research operation is the best thing in this repository, and it is a saleable skill.** Ninety-seven reports, primary sources opened, source-reachability tested rather than assumed, falsifiers pre-registered, and — the rare part — **it refuted its own founder's thesis and published the refutation.** Most people cannot do that once. You did it at scale, in a week.
4. **The sunk cost is mostly recoverable.** frontmatter *is* sgnk-md at 88.6% byte-identity. Killing the product loses 3,614 lines of engine, not a company.

---

### The opportunity cost, concretely

Six months. One founder. These skills. Ranked by expected value, with the arithmetic.

| # | Candidate | Six-month outcome | Why it beats frontmatter | Risk |
|---|---|---|---|---|
| **1** | **"Ten Days to a Measured Agent Practice"** — the productised engagement already designed in `r23-u4`: trace ledger, complexity gate, assertion gates, evals, hooks, handover, installed in a client's harness. ₹3,00,000 / $8,000, 90 founder-hours, **73.5% repeatable** | 2 engagements = **₹6,00,000**. 4/yr = **₹12,00,000 = exactly the ₹1L/mo milestone** the product needs 63,060 visitors to reach | **One client equals 63,060 visitors of funnel** `[derived, r23-u4]`. Demand is pre-verified: a five-engineer team already pays **$21,000** to learn evals from one Maven cohort; you are 6.7× under that at the India price `[fetched maven.com/parlance-labs/evals]`. Channel is owned, not rented. Buyer is named and reachable | Gated on C10: re-run κ blind before the first invoice, or sell 8 days at ₹2,40,000 with evals as phase 2. Do not charge for a discipline you visibly stopped practising |
| **2** | **The refactor plugin, inside Obsidian** — vault-wide rename of a tag / property key / link target, preview diff, refusal on ambiguity. Ship as a community plugin, not an editor | 6–8 weeks to first install. Installs are a real demand read within 30 days | It is the same engine, sold as a **capability people are voting for today** (86 likes) instead of a promise nobody asks for. It borrows the incumbent's 7,092-plugin distribution rather than fighting it. It answers C2 in weeks instead of C1's 240 days | Plugin economics are thin and the registry is a landlord. But this is a **demand experiment that ships**, and it is the cheapest one available |
| **3** | **`fm check` / `mdmax cert` as a one-time-price CLI** — document CI, exit-coded, failing line linked. The only capability in the entire AIOS audit rated **SHIP** on all four filters | 3–4 weeks. Priced once, no churn arithmetic, no MoR, no EU representative | It is the one asset that **needs no vocabulary**: *"it looked fine in my editor and broke on GitHub"* is a universal weekly failure. It moves the revenue signal from month 8 to month 2 — which is `r18-w2`'s own EW-1 remedy | Small. That is the point. Small and real beats large and hypothetical |
| **4** | **Divest the portfolio** — GearUp, Travox, Clinix/Dox, INW, Advox: named customers, named operators who are not you, 81–124 days stale | Cash, plus the attention of not carrying them | These are **the only assets in the portfolio with a plausible buyer other than yourself** `[r22-t2]`. Advox additionally carries the highest regulatory exposure of anything you own, held by one person on call | Sale prices unknown `[SS]`. Even at zero, the attention recovered is real |
| **5** | **CareerOS: decide or kill.** 1,091 commits, 43 migrations, 40+ edge functions, **103 days idle**, os.sgnk.ai still returning 200 | A decision, which currently does not exist | It is the **largest sunk asset in the portfolio** and it is in limbo precisely because limbo is free. Its credits/entitlements/kill-switch layer is liftable code either way | It may genuinely be dead. Say so and archive it — that is a win |
| **6** | **frontmatter as planned** | M7 = 2027-04-28. First paying stranger 240 days out | — | C1–C10 |

The ordering is not arbitrary. **#1 funds everything and is available this month. #2 and #3 are the frontmatter thesis, unbundled from the editor, shipped in weeks instead of months, each carrying its own demand read.** Together they cost about ten weeks and they answer C2 — the question the entire 240-day plan defers — with real users and real money instead of a landing page.

And note what #2 and #3 preserve: the 3,614 lines of engine, the corpus, the tests, the two demanded capabilities, the Cursor defect. **Nothing good is thrown away. What is thrown away is the editor, the subscription, the ₹299 price point, the MoR, the EU representative, the sync architecture, the eight months, and the obligation to acquire 4,462 visitors a month forever.**

The one thing I would refuse outright: raising. Not because the terms are bad — ₹4 Cr is 367 months of your nut — but because that is the trap stated in its own numbers. Thirty years of runway bought with a seven-year obligation, against a product whose ceiling is 1,239 users.

---

**If I had one sentence:** You have built a genuinely correct engine for a problem the market has told you, in four separate counts and in zero out of three hundred and fifty-five comments, that it does not feel — so stop building the editor, sell the discipline you demonstrably have to the clients who already pay you, ship the refactor and the checker as small paid things inside somebody else's distribution, and let the market rather than the document tell you whether there is a company here.

---

## 11. What the evidence says to build

Reconcile verified (seventeenth identical check; unchanged and stable): `~/.claude` HEAD `6e390828`, `~/.sgnk` HEAD `e73dd088`, frontmatter HEAD `04938be`; zero commits by this subagent; the 19 `skills-src`/`settings.json` paths and 1 sgnk bin path all pre-date this session; every command run was read-only, scratch writes confined to `$TMPDIR`.

**The reconstruction the evidence actually supports is not a different product built on the engine — it is a different *claim* built on the same code: the engine's saleable output is not "we preserved your bytes" (a must-be, complained about 4 times in 12,556 comments) but "here are exactly the bytes the machine wrote, isolated from yours" (provenance, the input to the 23.7%-and-rising slop complaint), and that reframe moves the demand signal by roughly three orders of magnitude without changing a line of `offsets.ts`.**

---

**Steelman of "keep going", stated once and dropped.** The codebase is 88.6% of a shipping editor, the engine is the only correct one in the category, the incumbents have a dated confirmed defect, and the marginal cost of reaching revenue is a rename plus a checkout. Six weeks to a paid download page. That argument is real and it loses to one number: Show HN markdown editors have a median of 3 points across n=609 (`r25-w3`), and the thing being sold is a defect-absence nobody has ever asked for. You do not get to skip demand because the code is nearly done.

**A note on the rubric, because it is where the founder will cheat.** The brief asks me to score "reuse of the existing engine." I weight it at **5%**, deliberately, and the reason is diagnostic: *high reuse is the variable that produced this situation.* 25,407 lines exist, so every option that consumes them scores well on a dimension with no relationship to whether anyone pays. Sunk cost dressed as an asset. Demand (25%) and honest P(₹1L/mo) (30%) carry 55% between them; the rest is logistics.

---

**NEW MEASUREMENTS — `[measured]`/`[fetched]` 2026-08-31, re-runnable**

| # | Measurement | Value | Source |
|---|---|---|---|
| N1 | **Prettier weekly npm downloads** — a tool whose entire job is to rewrite your file wholesale | **132,375,801/week** | api.npmjs.org |
| N2 | **obsidian-linter** — "Format and style your notes" — installs | **1,036,360** | obsidian-releases registry |
| N3 | markdownlint-cli2 / remark-lint / textlint weekly npm | **1,618,062 / 327,304 / 219,091** | api.npmjs.org |
| N4 | `@modelcontextprotocol/sdk` weekly npm | **52,072,511** | api.npmjs.org |
| N5 | Best Obsidian rename-with-link-rewriting plugin (`consistent-attachments-and-links`) | **140,866** installs | registry |
| N6 | Best refactor plugin of any kind (`note-refactor-obsidian`) | **341,486** = 0.24% of registry total | registry |
| N7 | Registry plugins matching rename/refactor/broken-link | **60+**, ~40 of them under 5,000 installs | registry |
| N8 | **`table-editor-obsidian` — #5 plugin in the entire registry** | **3,153,561** | registry |
| N9 | Vale / markdownlint stars | 6,049 / 6,313; both free, **no paid tier served** | api.github.com; vale.sh HTTP 200 |
| N10 | HN stories: "docs as code" / "review AI generated code" / "AI slop documentation" / "markdownlint" | **4,164 / 266 / 47 / 3** | hn.algolia.com |
| N11 | This repo's own executable doc gates | `check-record.mjs`, `check-refs.mjs`, `spec-report.mjs`, `clean-architecture-report.mjs`, `corpus-foreign.mjs` — 5 real gates | `package.json` |

**N1 and N2 are the finding to sit with.** The market's revealed preference, at 132 million downloads a week and a million Obsidian installs, is for tools that **deliberately rewrite the whole file**. Byte-preservation is not merely un-demanded; the largest tool in the adjacent space sells the opposite and people opt in. A product headlined "we don't change your bytes" fights a behaviour a hundred million developers a week actively pay time to obtain.

**N8 is the cheapest embarrassment in the corpus.** Table editing is the 5th-most-installed plugin of 7,139, at 3.15M. It is 5–8 days of work, appears in zero of the three MVP stages, and the engine makes splice-backed table writes uniquely correct. It is the only place in this evidence base where "byte-exactness sold as a capability" meets a measured seven-figure install base.

---

**THE NINE OPTIONS**

**O1 — Vault-wide refactor, reviewable diff, refusal on ambiguity.** *What:* rename a note/heading/property; every link that will change shows as a hunk; accept, reject, or refuse on ambiguity. *Who pays:* Obsidian power users with 2,000+ note vaults. *Why now:* 86 likes, and agents generate renames at volume. *Reuse:* OffsetMap, splice, placement — ~80%. *Time to revenue:* 10–14 weeks. *Strongest objection:* **N5–N7 kill it.** Sixty plugins occupy this slot; the best is free at 140,866 installs; the whole category tops out at 341,486 cumulative — 0.24% of the registry. The most crowded free niche measured anywhere in this corpus, entered to serve a bug with 86 likes.

**O2 — Provenance: make what the machine wrote reviewable.** *What:* every agent write recorded as a byte range with prompt, timestamp and model id; machine spans render distinctly from human ones; one keystroke reverts a span; a report says "43% of this document was written by an agent — here is which 43%." *Who pays:* anyone accountable for prose an agent touched. *Why now:* slop is 23.7% of all complaints, **+149% in 20 months**, classified WORKFLOW/durable, nobody on it (finding 7); 266 HN stories on reviewing AI output (N10). *Reuse:* what a byte-addressing engine is uniquely for — **~85%**, with the certificate machinery becoming the provenance ledger. *Time to revenue:* 12–16 weeks. *Strongest objection:* complaints are not purchases — finding 2's logic re-applied to a louder complaint, possibly equally unmonetisable.

**O3 — Sync, done provably safely.** *Who pays:* everyone; the only thing here with a proven $4–8/month price and 56 of 60 HN payment comments (findings 4, 8). *Why now:* Obsidian's own docs concede auto-merge "may sometimes create duplicate text or formatting problems." *Reuse:* CAS + splice journal + git-merge already designed. *Time to revenue:* **6–12 months solo**, optimistically. *Strongest objection:* it turns a zero-liability local product into an on-call company holding other people's bytes, under DPDP, with DR on an R2 layout that has no object versioning, at a bus factor of one. Highest demand in the corpus, worst founder fit.

**O4 — Engine as npm library + MCP server + Claude Code plugin.** *What:* `safe-edit`, an exact-anchor write tool agents call instead of regenerating. *Why now:* N4 — 52M weekly SDK downloads, the largest new distribution surface in software. *Reuse:* 100%, and it deletes the 21,793-line editor. *Time to revenue:* **near-infinite.** *Strongest objection:* libraries in this shape do not monetise — markdownlint (1.6M/week) and Vale both ship zero paid tier (N3, N9) — and Claude Code's own `Edit` already does exact-string matching with refusal, which is why "String to replace not found" has 71 issue threads. A better version of a free primitive.

**O5 — Document CI.** *What:* a GitHub App gating markdown in PRs — link integrity, frontmatter schema, claim/citation checks, "this section is machine-written and unreviewed." *Who pays:* teams doing docs-as-code. *Why now:* 4,164 HN stories (N10); agents write docs PRs at **82.1% acceptance vs 66.1% for features**. *Reuse:* the five gates in N11 already run on this repo. *Time to revenue:* **8–12 weeks**, first buyer can be an existing client. *Strongest objection:* every comparable is free and beloved and none charges (N3, N9); "markdownlint" has 3 HN stories in the site's entire history; and CI budget sits with a platform team who will ask why `markdownlint --fix` in a workflow file isn't enough.

**O6 — Nested-construct live preview, as an Obsidian plugin.** *Why now:* 501 likes, most-voted bug in the category's history. *Reuse:* ~15% (CodeMirror, not engine). *Time to revenue:* zero — it is free. *Strongest objection:* Obsidian shipped **51 live-preview fixes in the 142 releases of 2025–26** and is visibly closing; the day they ship it you are a changelog entry. **As distribution rather than revenue it is the best asset here.**

**O7 — Services productised.** *What:* a ₹3,00,000 fixed-scope AI-orchestration engagement, four a year. *Who pays:* the existing client register. *Time to revenue:* **this month.** *Reuse:* ~10%. *Strongest objection:* it is a person, not an asset; it does not compound; and it is what the founder already does, so recommending it is not a recommendation.

**O8 — Redeploy to the liable-document lane (.docx).** *What:* byte-exact machine edits to documents a counterparty signs. *Why now:* `adeu` (MIT, 149 stars, pushed 2026-08-30) independently converged on the identical architecture and pointed it where the reviewer is a lawyer with Word. *Reuse:* concepts, not code — **~10%**. *Strongest objection:* OOXML is a different engine, the buyer is a segment `r22-t1` could not prove exists, and you restart at 10% carryover against a nine-month head start.

**O9 — Ship the editor as it stands, $49 one-time.** *Reuse:* 100%. *Time to revenue:* 6 weeks. *Strongest objection:* findings 1, 2, 5 unchanged; ₹1L/month needs **22.5 sales every month forever** [derived: 100,000 ÷ (49 × 95.39 × 0.95)] with no distribution, against a Show HN median of 3 points.

---

**THE SCORING**

Weights: demand 25 · time-to-revenue 15 · defensibility 10 · one-founder fit 15 · engine reuse 5 · P(₹1L/mo in 12mo) 30. Scores 0–10.

| Option | Demand | Time | Defens. | Founder | Reuse | P(₹1L) | **Weighted** |
|---|---|---|---|---|---|---|---|
| **O7 Services productised** | 9 | 10 | 3 | 9 | 2 | 9 | **8.20** |
| **O2 Provenance** | 9 | 5 | 4 | 5 | 9 | 4 | **5.80** |
| **O1 Refactor** | 5 | 5 | 4 | 8 | 9 | 2 | **4.65** |
| **O3 Sync** | 9 | 2 | 6 | 2 | 6 | 3 | **4.65** |
| **O9 $49 one-time** | 3 | 8 | 2 | 7 | 10 | 3 | **4.60** |
| **O5 Document CI** | 4 | 6 | 4 | 6 | 7 | 3 | **4.45** |
| **O8 .docx redeploy** | 6 | 3 | 6 | 4 | 3 | 3 | **4.20** |
| **O6 Live-preview plugin** | 8 | 2 | 2 | 8 | 3 | 1 | **4.15** |
| **O4 Library / MCP** | 4 | 2 | 3 | 9 | 10 | 1 | **3.75** |

Sample arithmetic, O2: `.25(9)+.15(5)+.10(4)+.15(5)+.05(9)+.30(4) = 2.25+0.75+0.40+0.75+0.45+1.20 = 5.80` [derived].

**Read it honestly and the first result is uncomfortable: the highest-EV thing available is not a product.** O7 clears ₹1L at 78 hours a month starting now, at a probability no software option approaches. Any recommendation ignoring that is dishonest. But the founder asked what to *build*, so O7 becomes the funding line rather than the answer — with a non-optional condition below.

---

**RECOMMENDATION: O2 — provenance — shipped as a plugin, never as an editor, funded by O7, with O6 as the free wedge.**

**The specific thing to build.** Not "an editor with a provenance feature." One capability, into two channels the buyer already has open:

1. An **Obsidian plugin** and a **Claude Code plugin / MCP server** wrapping file writes. Every agent write is spliced, not regenerated, and recorded as `{byte range, prompt hash, model, timestamp}` in a sidecar ledger.
2. The UI is a **provenance overlay**: machine spans visually distinct from yours, per-span revert, a per-file "43% of this document is unreviewed machine text — here it is," and a vault-wide roll-up.
3. Free: single-file. Paid: **vault-wide operations** — roll-up, O1's refactor, bulk revert. The only surface where the user experiences something unavailable free.

**Why this and not the others.** It is the only option connecting the corpus's loudest, fastest-growing, unserved signal (finding 7) to the one thing this codebase does that no competitor can retrofit: a regenerating writer structurally cannot tell you which bytes it wrote; a byte-addressing one gets it free. Critically, **it needs no classifier.** The founder never judges what slop is — fortunate, since the learning loop is dark (finding 10: 6,884 routing decisions, 1 reward label) and shipping an uncalibrated judge would violate his own Learned Rules #4, #5 and #32 on day one. Attribution is deterministic; the user judges. That single choice is what makes this buildable by one person on a very small AI budget.

**Why plugin, not editor.** It deletes 21,793 lines of Obsidian clone and the fight with 7,139 free plugins; it lives inside the tool the buyer already has open; and it is the only channel here with a **proven paid conversion** — Brevilabs' Copilot, 1,783,652 installs, charging $7.99–$14.99/month inside Obsidian. The existence proof the D2C plan never had.

**Why O6 is the wedge, not the product.** Ship nested-construct live preview **free, first, as its own plugin, inside 30 days.** 501 likes of pre-existing demand, weeks not months, and it buys the one thing the founder has zero of: an install base to ship the paid thing to. Its defensibility is 2/10 and that is fine — you are not defending it, you are renting attention with it.

**Dated gates. Stop if any fails.**

| Date | Gate | Stop condition |
|---|---|---|
| +30d | Live-preview plugin published | Not in the registry → stop; O7 is the whole answer |
| +60d | **5,000 installs**, free plugin | Under 1,500 → the channel does not work; stop |
| +90d | Provenance overlay, free, single-file | Under 2,000 installs → stop |
| +120d | **25 paying at $7 (≈₹16,700/mo)** | Under 10 → convert to O7 permanently |
| +365d | ₹1,00,000/month | — |

**The non-optional condition:** O7 revenue is booked *before* the build starts, not alongside it. At one person — critique 9 established the second founder does not exist — 78 client hours plus support plus compliance leaves ~108 engineering hours a month, and this plan must fit inside that. If it does not fit, it does not get built. It does not get built *slower*.

**Honest probability of ₹1L/month from the plugin within twelve months: 20–25%.** Not because the idea is weak, but because 25 paying at +120d extrapolated to ~500 at +365d requires a conversion curve nobody in this corpus has demonstrated for individual-paid markdown tooling.

---

**THE STRONGEST ARGUMENT AGAINST MY OWN RECOMMENDATION, STATED IN FULL**

It is this, and it is serious: **I have just done to the founder exactly what the founder did to himself.** He found a real mechanism, went looking for a demand signal that fit it, and built for two years. I have found that his signal was wrong, gone looking for the loudest remaining one in the same corpus, and handed it back attached to the same code. The move is structurally identical. Slop at 23.7% is a *complaint* count, from the same corpora that produced finding 2 — and finding 2's whole lesson is that complaint volume and purchase behaviour are different variables. There is no measurement anywhere in the 97 reports of a single human paying money to have machine-written text attributed. The 266 HN stories on reviewing AI output (N10) are conversation, not commerce.

The second-strongest objection is that provenance is a **feature of the agent, not of the editor**, and the agents are better placed to ship it. Cursor, Zed and Claude Code know precisely which bytes they wrote — they hold the diff at write time. Zed already surfaces it per-hunk (finding 1). That they do not persist it is a product choice, not a capability gap, and a product choice is reversible in one sprint by a funded team. My "no competitor can retrofit this" claim is weaker than it sounded: they cannot retrofit it into a file written by a *different* tool, but that is a narrow, explainable-in-a-paragraph advantage, not a moat.

The third is that N1 and N2 cut against provenance too. A hundred and thirty-two million weekly Prettier downloads and a million linter installs say the user's actual relationship to machine rewriting is *"do it, all of it, don't ask me."* A product that says "here are the 43% of your document a machine wrote, please review it" asks for labour the market has spent a decade automating away.

**What would change my mind, precisely.** Before writing the provenance overlay, run the test DECIDE §9 scheduled for day 60 and nobody has run: three landing pages, ≥400 visitors each — arm A "your files, unmangled"; arm B "see exactly what the AI wrote"; arm C "rename anything, review every link." If arm B does not capture at least **40% more emails than arm A**, my recommendation is wrong and O5 or O7 takes its place. That test costs one weekend and less than a single week of the documentation written this month. **Running it before writing any code is the only recommendation in this report I would defend without qualification.**

---

## 12. The ninety days

**Written 2026-08-31 (Monday). Runs 2026-08-31 → 2026-11-28 (Saturday, day 89). Final review Monday 2026-11-30.**

All rupee figures at USD/INR 95.39 [fetched via `r22-t3`, ECB rate date 2026-08-28]. All hour figures at the founder's own ₹1,700/h midpoint [measured, `ecosystem.md` §4.8].

---

### A. The decision

**Build:** `fm` — a byte-exact markdown *refactor and write* tool, shipped as an npm package, an Obsidian community plugin, and an MCP server. Three verbs, no editor.

| Verb | What it does | Why it is in |
|---|---|---|
| `fm rename` | Rename a property key, tag, or link target across a folder. Preview diff. Refuses on ambiguity. Every untouched byte identical | 86 likes on broken-links-on-rename — the only differentiating capability in the record with counted, current demand (`r24-v2`) |
| `fm check` | Point it at *your* vault: here is exactly what this engine will refuse, by construct, by count | The one Attractive-class item in 163 rows. Demo, activation event and sales artifact in one file |
| `fm apply` | Apply an agent-proposed patch by byte range; refuse rather than guess | The engine's `land()` without the UI. Lives inside the tool the buyer already has open |

**Price: one-time. $49 / ₹1,499 India. No subscription, at any tier.** Free forever: `fm check`, single-file operations, all read verbs over MCP. Paid: multi-file apply and the plugin GUI. Twelve months of updates included; renewals are optional and never gate what you already bought.

**What dies. Explicitly, today.**

| # | Killed | Because |
|---|---|---|
| 1 | **`land()` + per-hunk accept/reject UI — 16 of MVP-0's 38 points** | Zed ships it, documented and free: "accept or reject each individual change hunk" [fetched zed.dev, 2026-08-31]. We do not build a funded competitor's shipped feature |
| 2 | **The editor shell — 21,793 of 25,407 lines (85.8%)** | Frozen at `editor-freeze-2026-08-31`, not deleted. Zero feature work for 90 days. Obsidian has 7,139 plugins and we banned ourselves from having any |
| 3 | **Every subscription tier — ₹299/₹399/₹599/$5/$10/₹3,999** | See §D. Contribution-negative at the founder's own rate, and beaten by a one-time sale at any churn above 4.90%/mo |
| 4 | **The handover / context-pack wedge** | 89 launches in 20 months, median 2 points, 88 of 89 never reached 50 (`r21-s1`) |
| 5 | **Decision cards, decision renders, the continuous certificate, typed evidence tiers, the numeric-provenance linter, self-routing docs** | 563 of 143,283,562 downloads = 0.0004%. Least-demanded render measurable (`r21-s6`) |
| 6 | **The 29-endpoint RPC API, publishing, custom domains, roles/permissions, browser plugin, multi-vault, Marp** | 130 of 650 roadmap points whose own Evidence column reads `NONE` — 104% of the entire three-stage plan |
| 7 | **The B2B commercial-licence motion** | Obsidian's arrived after five years of a *mandatory* licence and millions of users. Deferred 12 months |
| 8 | **New narrative documentation** | 2,219,390 words against 25,407 lines. Three living documents survive (§F). Everything else archives |
| 9 | **Going full-time** | Client work continues at exactly the nut, capped, for all 90 days |

Sync stays out of scope and we say so on the page: it is #1 loved, #3 hated, #1 switching trigger, and we will not ship a half-safe one.

---

### B. The two weeks before any code — 2026-08-31 → 2026-09-13

The evidence says byte-exactness is not felt (4 in 12,556; **0 in the 355 highest-intent comments**) and the per-hunk demo is already shipped. So the first move is not a build. It is a priced demand test, because a free binary handed to a polite stranger measures politeness.

**Day 1, today, before anything else:** rotate the two unrotated PATs. Not a decision — an action (§54 D5). Answer *one founder or two* in writing (§G). Both cost under two hours.

### Test 1 — three landing arms with a real checkout (the only one that counts)

One URL each, identical layout, one 90-second screen recording each, one **$19 refundable pre-order** button that charges a real card and issues a full refund on request, with a public ship date of 2026-11-30.

| Arm | The line | Tests |
|---|---|---|
| **A — byte-exact** | "Your agent rewrote 400 lines to change one field. This changes only the bytes it touched." | The record's founding belief |
| **B — refactor** | "Rename a property across 8,000 markdown files. See the diff first. Nothing else moves." | The 86-like capability |
| **C — repo-as-prompt** | "Your repo is the prompt. Keep it clean enough to be one." | The slop adjacency (23.7% of all complaints, +149%) |

Traffic: **≥400 visitors per arm, ≥1,200 total.** Sources, in cost order: r/ObsidianMD, r/ClaudeAI, the Obsidian forum thread that carries the 86 likes, X, LinkedIn, the founder's own client list. Paid ceiling **₹20,000** = ₹16.67/click at 1,200 clicks.

### Test 2 — ten strangers, their own repository, unstaged

Not friends, not family, not Discord. Give them the existing binary and **their own** repo. Do not hand them a crafted CRLF file. Two questions, recorded:

- **≥3 of 10 describe a byte/diff/corruption problem before it is named.** This is DECIDE §9's own bar, moved from Day 41 to Day 10.
- **≥6 of 10 spontaneously notice a difference from their current tool** without being shown a staged comparison.

### Test 3 — the rename probe

Two throwaway days against the existing engine — a script, not a product — recorded doing a vault-wide property rename with a preview diff and an ambiguity refusal. Posted to r/ObsidianMD and the forum. Measure upvotes, comments, and email signups.

### Gate 1 — Monday 2026-09-14

**Continue only if both hold:**
1. **≥12 paid pre-orders on ≥1,200 visitors** (≥1.00% capture).
2. **The winning arm captures ≥1.5× the worst arm**, so you know which pitch you own.

If (1) fails: one 14-day extension, best arm only, double the traffic. If it fails again on **2026-09-28**, stop and go to §E, KS4's terminal branch. If (1) passes and (2) fails, ship anyway and re-test copy at launch — the pitch is undecided, not absent.

**What Gate 1 is allowed to kill:** the entire product. That is the point. A gate a friendly stranger passes by being friendly was designed not to fail.

---

### C. The 90 days, week by week

Weeks begin Monday. Product hours available: **143.4/month, 430 across 90 days** (§D). Every week has one observable outcome.

| Wk | Monday | Ships | Observable outcome |
|---|---|---|---|
| **1** | 08-31 | PAT rotation; founder-count decision in writing; three landing pages; checkout wired end to end | Three URLs live; one real ₹ charged to the founder's own card and refunded |
| **2** | 09-07 | Traffic push; 10 stranger sessions recorded; rename probe posted | Pre-order count; 10 session recordings; probe upvotes |
| **3** | 09-14 | **GATE 1.** Then: CI, with a deliberately red run first; fix D10 (comment-destroying frontmatter set) | CI green on main; a commit that *should* fail *does* fail; D10 red proof then green |
| **4** | 09-21 | Extract `src/modules/mdmax` to standalone `@sgnk/mdmax`, zero Next.js dependency; fix D3 (placement gate) and D1 (`toU16` 512-boundary) | `npm i @sgnk/mdmax` works in a clean directory; 1,575 tests green in CI |
| **5** | 09-28 | `fm rename` against the 8,513-file pinned corpus; publish the refusal table | Rename runs on all 8,513; refusal count published as a number, not a claim |
| **6** | 10-05 | `fm check`; NF-1/NF-2 zero-indent fix (83% foreign-vault refusal) | **Second corpus run: refusals ≤10 of 7,969.** First 5 pre-order buyers run it on their own vaults |
| **7** | 10-12 | Obsidian plugin wrapper around `fm rename` + `fm check`; submit to community registry | Submitted. PR number recorded |
| **8** | 10-19 | **GATE 2.** `fm apply` + MCP server; Claude Code plugin manifest | Plugin approved *or* rejected — either is an answer. 25 installs in 14 days |
| **9** | 10-26 | Paid gate live; licence key issuance; convert pre-orders to purchases | **First non-founder paid purchase.** Pre-order refund rate recorded |
| **10** | 11-02 | Launch: Show HN, r/ObsidianMD, r/ClaudeAI, the forum thread, X | Launch-day installs, paid count, HN points |
| **11** | 11-09 | Support, bug fixes, whatever the launch surfaced. **No new features** | Median time-to-first-response; ticket count per paying user (the number §25.1 and §85.6 disagree about by 3×) |
| **12** | 11-16 | **GATE 3.** Second distribution channel only if Gate 2 passed | 50 paid (two-founder) / 30 paid (one-founder) |
| **13** | 11-23 | Measure, decide the next 90 days | **One page.** Not a document. Not a PDF |

**Phase exits, stated as numbers:**

- **Gate 1 (09-14):** ≥12 paid pre-orders / 1,200 visitors.
- **Gate 2 (10-19):** Obsidian plugin live **and** ≥25 installs in its first 14 days. If rejected, npm + MCP only, same threshold, same clock.
- **Gate 3 (11-16):** ≥30 paid non-founder purchases (one founder) or ≥50 (two founders).

---

### D. The numbers

### Capacity

| Line | One founder | Arithmetic |
|---|---|---|
| Monthly working hours | 198 | [`r22-t3`] |
| Monthly nut | **₹63,918** | ₹45,000 draw + ₹18,918 fixed |
| Client hours to cover it @ ₹1,700/h | **37.6** | 63,918 ÷ 1,700 |
| Ops, compliance, filings | 17.0 | [§85.6, measured constant] |
| **Product hours/month** | **143.4** | 198 − 37.6 − 17 |
| **Product hours, 90 days** | **430** | 143.4 × 3 = 10.75 forty-hour weeks |
| **Opportunity cost of those 430 hours** | **₹7,31,000** | 430 × 1,700 |

That last line is the honest price of this quarter, and it is stated so the founder can refuse it. The 90 days is an option purchase, not a wage. The kill switches in §E are what cap the loss at one quarter.

### Revenue target

| Target | Units | Net INR | As months of nut |
|---|---|---|---|
| **Stretch** | 50 × $49 | ₹2,22,020 | 3.47 |
| **Plan** | 30 × $49 | ₹1,33,212 | 2.08 |
| **Floor (KS4)** | 15 × $49 | ₹66,606 | 1.04 |

$49 net of ~5% rails = $46.55 = **₹4,440.40**. Break-even against the one-founder nut is **14.39 sales/month**. The subscription plan's equivalent was **294 paying subscribers** — a **20.4× harder number** for the same rupees.

### Why one-time, in one table

| Line | Value |
|---|---|
| Contribution, ₹299 India Pro, net of GST + rails + inference | ₹217.40/mo |
| Founder support cost, 0.1445 h/paying user/mo @ ₹1,700 | **₹245.65/mo** |
| **Effective contribution per subscriber** | **−₹28.25/mo** |
| One-time $49, net | ₹4,440.40 |
| **Churn at which subscription = one-time** | **4.90%/mo** (217.40 ÷ 4,440.40) |
| ChartMogul top quartile, ARPA <$10 | 3.76%/mo |
| Honest central case | ~6.00%/mo |

A subscription only wins if we land between top-quartile and best-in-class retention, in the worst-retaining ARPA band published, **with deliberately zero switching cost, no sync and no plugins**. We will not. The support coefficient is stated two ways in the record — 0.10 and 0.30 tickets/user/month, a 3× spread on the single largest cost — and Week 11 exists to measure it.

### Cost ceiling — 90 days

| Item | ₹ |
|---|---|
| Ads (Test 1) | 20,000 |
| Apple developer + code signing | 8,500 |
| Domain, hosting, checkout setup | 3,000 |
| Contingency | 13,500 |
| **Total cash ceiling** | **₹45,000** |
| Hosted inference | **₹0 — BYO key only, by construction** |

Exceeding ₹45,000 requires stopping and re-justifying, in writing, against Gate results.

---

### E. The kill switches

Dated, observable, and each one names the action, not a feeling.

| ID | Date | Condition | Action |
|---|---|---|---|
| **KS1** | 2026-09-14 | <12 paid pre-orders on ≥1,200 visitors | 14-day extension, best arm, double traffic. Fails again 2026-09-28 → **stop the product** |
| **KS2** | 2026-10-05 | First patched corpus run still refuses **>10 of 7,969** | The 83% refusal is a class, not a bug. Kill `fm apply` and `fm rename` writes; ship read-only `fm check` and re-price at $0 |
| **KS3** | 2026-10-19 | Obsidian plugin rejected, or <25 installs in 14 days; and npm+MCP fallback also <25 in its own 14 days | Distribution assumption is dead. **Stop.** There is no third channel a solo founder reaches this quarter |
| **KS4** | 2026-11-16 | <15 paid non-founder purchases | Stop building. Open-source `@sgnk/mdmax` under MIT, keep it as a hiring and credibility artifact, return to services and the ₹3,00,000 productised engagement |
| **KS5** | Every Monday | `docs/` file-changes ÷ `src/` file-changes >3:1 for **two consecutive weeks** | The founder is writing, not building. Freeze all writing for 14 days. Current reading: **29.2:1**, and `src/` last moved 2026-08-10 — this switch is *already tripped today* |
| **KS6** | 2026-11-30 | Logged product hours <300 of the 430 budgeted | The capacity model is wrong. Choose one: drop client work, or drop the product. Do not carry both into 2027 |
| **KS7** | Any month | A client month demands >60 client hours | The product month is cancelled **in writing**, that week, not silently absorbed |

KS5 is the one that matters most and the one that will be rationalised away. It is checked with two commands and no judgment: `git log --since='14 days ago' --name-only --pretty=format: -- docs | wc -l` against the same for `src`.

---

### F. The existing asset, item by item

| Asset | Verdict | What happens |
|---|---|---|
| **Engine** — `src/modules/mdmax`, 13 files, 3,614 lines | **REUSE — it is now the whole product** | Extracted to standalone `@sgnk/mdmax`, zero Next.js dependency, Week 4 |
| **8,513-file pinned corpus** | **REUSE and PROMOTE** | Becomes `fm check`'s oracle *and* the public credibility artifact. Publish the refusal table with counts |
| **1,575 tests / 98 files** | **REUSE — but wire them** | CI, Week 3, with a deliberately red run first. Today 941 assertions cannot stop a bad commit; `verify` omits `corpus`; `budget` is a literal `echo` |
| **Editor shell** — 21,793 lines | **FREEZE, do not delete** | Tag `editor-freeze-2026-08-31`. It is the fallback surface if KS3 fires on the plugin route only |
| **Tauri desktop scaffolding** | **ARCHIVE** | Not in 90 days |
| **`mdmax cert` CLI** (D11, `ERR_MODULE_NOT_FOUND`) | **FIX by Week 3 or DELETE** | A flagship artifact that has never executed end to end is worse than no artifact |
| **The certificate spec, decision card, evidence tiers, provenance linter** | **ABANDON** | Zero demand signal at every resolution measured |
| **2,219,390 words of docs** | **ARCHIVE under one index** | Three living documents survive: `DECIDE.md` (≤2 pages, updated Mondays), a public `CHANGELOG`, and `REFUSALS.md` — what the engine will not do and why. That third one is marketing, not documentation |
| **97 research reports** | **ARCHIVE, keep 6** | `r24-v2`, `r24-v3`, `r25-w2`, `r25-w4`, `r21-s1`, `r22-t3` carry the counted primary numbers. **Never re-research any of it** |
| **`globals.css`** | **DELETE** | It belongs to sgnk-md, not to this product |
| **Two unrotated PATs** | **ROTATE TODAY** | Not a decision |
| **AIOS / the learning loop** | **Out of scope — and stop claiming it** | 6,884 routing decisions, 1 reward label (0.01%). Either wire one label per session in 30 minutes, or delete the word "self-improving" everywhere it appears |
| **Known defects D1, D3, D10** | **SCHEDULE — Weeks 3–4** | ~11 unscheduled points the old MVP-0 missed. D10 destroys a trailing comment on every frontmatter set, in the one file with real product traffic. It falsifies the product's single sentence |

---

### G. One founder and two founders

The record contradicts itself: §53 says *"One person. This is the binding constraint on everything above."* §97 says "two founders" — a line pasted in from a prompt, which then propagated into at least nine downstream reports and became the load-bearing sentence of the money model. **§53 is a decision. §97 is a prompt. One founder is the default.**

**Resolution date: Monday 2026-09-07.** A signed founders' agreement naming a person, an equity split, a start date and an hours commitment, or the two-founder plan is void and every "two founders' time" estimate in the record is struck. No hybrid, no "probably", no verbal.

| | **One founder (default)** | **Two founders (only if signed by 09-07)** |
|---|---|---|
| Monthly nut | ₹63,918 | ₹1,08,918 |
| Client hours/month @ ₹1,700 | 37.6, by the same person | 64.1, **all by Founder B** |
| Product hours/month | 143.4 | 198 (Founder A untouched) |
| **Product hours / 90 days** | **430** | **594 (1.38×)** |
| Scope shipped | `fm rename` + `fm check`, npm + Obsidian plugin | Adds `fm apply`, MCP server, Claude Code plugin |
| Launch week | Week 12 (11-16) | Week 10 (11-02) |
| **Gate 3 target** | **30 paid** | **50 paid** |
| Channels at launch | One — Obsidian | Two — Obsidian and HN |
| Default-alive, if we ever return to subscriptions | 294 paying | 501 paying |

The genuinely good news in the one-founder branch: deleting the second founder cuts the hardest number in the plan by 41%. Default-alive falls from 501 paying to 294, and the traffic requirement from 7,133 visitors/month to 4,185. Under the one-time model it falls further, to **14.39 sales/month**. That is a modest blog with traction, not a distribution miracle. Take the win and stop budgeting against a person who does not exist.

---

### The one paragraph the founder should reread on 2026-11-30

The engine is real, the incumbents genuinely have the defect, and 430 hours is a defensible option to buy *because the code already exists*. But the success case in the old plan — 502 paying users, 171,200 cumulative visitors, 24 months — produced ₹1,09,135/month, which is 78 client hours the founder could bill this week. That comparison does not go away because the plan changed shape. It is the benchmark. If, on 2026-11-30, fewer than 15 strangers have paid, the correct and non-shameful move is to open-source the engine, publish the corpus refusal table under his own name, and sell the ₹3,00,000 productised engagement that his existing client base already buys — with a genuinely unusual credential attached.
