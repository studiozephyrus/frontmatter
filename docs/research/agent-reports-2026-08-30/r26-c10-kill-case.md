Reconcile verified (eighth pass, no re-run needed): `~/.claude` HEAD `6e390828`, `~/.sgnk` HEAD `e73dd08`, both unmoved; zero commits created; all 19 skills/config paths and 1 sgnk bin path pre-date this session; this subagent was read-only throughout.

---

**The two-year success case for this product — 502 paying users, reached through 171,200 cumulative visitors — produces ₹109,135/month of contribution, which is the same money as 78 hours of client work at the founder's own measured rate, work he could bill starting this week, with no engine, no funnel, no churn and no launch** `[derived from r22-t3's own arithmetic: 502 × ₹217.40 = ₹109,135; 78 h × ₹1,400 = ₹109,200]`.

Everything below is the elaboration of that sentence.

---

**The steelman, stated properly before I take it apart.** There is a real, dated defect in every AI coding tool on the market: agents rewrite whole files and destroy bytes they were never asked to touch, and Cursor's own staff called doubled blank lines and destroyed carriage returns on CRLF "a known issue we're tracking" three days before this research ran (`r24-v3`). The founder has independently built the only correct architecture for that — a byte-preserving splice that refuses rather than guesses — verified against an 8,513-file pinned corpus with 1,575 tests. Two of the most-demanded unfixed bugs in the incumbent's history (nested-construct live preview, 501 likes; broken links on rename, 86 likes) are tractable *specifically* because of the OffsetMap that engine already has. And this is not greenfield: 202 of 228 source files are byte-identical to a working editor he already shipped (`r22-t2`), so the incremental bet is 3,614 lines of engine, not a product from zero. A correct engine, a real defect, a demanded capability, an 88.6%-complete codebase, and a founder who can operate at this level of rigour. That is a genuinely strong hand.

It is still a hand that should not be played, and here is why.

---

## The charges, ranked

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

## What is good, specifically

Four things, and they are not consolation prizes.

1. **The engine is real and the defect it fixes is real and dated.** 8,513-file pinned corpus, byte-identical verification, 98 test files, 1,575 tests, and a competitor's staff admitting the exact bug in public three days before you looked. Almost nobody at this stage has a verified artefact.
2. **Two genuinely demanded capabilities are uniquely tractable for you.** Nested-construct live preview (501 likes, the most-voted bug in Obsidian's history, plus 96+82+50+36+33 on siblings) and vault-wide refactor with a reviewable diff (86 likes). The OffsetMap makes both tractable. **These are the assets. The editor around them is not.**
3. **The research operation is the best thing in this repository, and it is a saleable skill.** Ninety-seven reports, primary sources opened, source-reachability tested rather than assumed, falsifiers pre-registered, and — the rare part — **it refuted its own founder's thesis and published the refutation.** Most people cannot do that once. You did it at scale, in a week.
4. **The sunk cost is mostly recoverable.** frontmatter *is* sgnk-md at 88.6% byte-identity. Killing the product loses 3,614 lines of engine, not a company.

---

## The opportunity cost, concretely

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
