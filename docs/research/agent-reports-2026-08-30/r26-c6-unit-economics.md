Read-only verified — `~/.claude` HEAD `6e390828` and frontmatter HEAD `04938be` unchanged; dirty paths pre-date this session; no writes or commits.

---

**The single most damaging finding: at ₹299, one paying customer contributes ₹217.43/month while consuming 8.67 minutes of founder support that the founder can sell to a client for ₹202–289 — so the flagship tier is contribution-negative at the founder's own market rate, and the individual D2C lane therefore cannot fund one person at any volume, not at 500 users, not at 5,000.** [derived]

---

**Steelman, first.** The strongest version of this business is not the pricing page. It is this: the engine already exists (202 of 228 files byte-identical with sgnk-md, 1,575 tests, 8,513-file pinned corpus), so the marginal cost of *reaching* revenue is not a build, it is a rename plus a checkout. The cost structure is genuinely excellent — 57–73% contribution across every tier, egress-free R2, a free tier that is **$0 hosted inference by construction** because it is BYO-key only (§24.2). `r22-t3` correctly demolished the ₹20L/mo fantasy and replaced it with a ~500-paying-user "default-alive" target that is 13× smaller and operationally survivable. Obsidian proves the terminal state is real: eight people, no investors, $886,250/yr floor from 146 named orgs alone (`r21-s5`), on a **free** editor. And the founder has a live services business at ₹1,400–2,000/hour that can carry the nut indefinitely. That is a coherent, low-risk, non-venture path, and most people pitching a markdown editor have none of those five things.

Now the arithmetic.

---

### 1. The line missing from every COGS table in the record

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
