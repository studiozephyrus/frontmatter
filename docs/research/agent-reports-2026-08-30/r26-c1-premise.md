Reconcile discharged (ninth identical check; nothing has moved since the first). `~/.claude` HEAD `6e390828`, `~/.sgnk` HEAD `e73dd088`, `frontmatter` HEAD `04938be`; the 19+1 dirty paths pre-date this session; zero writes, zero commits from this subagent.

---

**The single most damaging finding: the record has two mutually exclusive buyers and has never chosen — every plan in it serves the AI-native developer, while every problem statement that survives its own filtering (`r22-t1` §6) serves a liable non-developer who does not keep documents in markdown, does not own a repo, and will never install an editor.**

---

### Steelman, stated as strongly as the evidence allows

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
