I made no writes, commits, or mutating commands — read-only throughout.

The single most damaging external standard is ChartMogul's: at Rs 299–599/month the product's ARPA is $3.13–$6.28, below even ChartMogul's lowest ARPA cohort (<$25/mo), whose **top quartile** reaches only 70% net revenue retention — meaning the pricing chosen makes best-in-class retention arithmetically unreachable before a single feature is built.

**Source reachability, tested not assumed (2026-08-31)**

| Endpoint | UA | Status | Usable? |
|---|---|---|---|
| `old.reddit.com/r/ObsidianMD/search.json?q=sync` | Mozilla/5.0 Mac | **200** | **No** — body is HTML `<title>Welcome to Reddit</title>` login interstitial, 0 bytes JSON |
| `old.reddit.com/r/ObsidianMD/top.json?t=year` | Mozilla/5.0 Mac | **200** | No — same HTML wall |
| `old.reddit.com/r/ObsidianMD/comments/1e0m0mn.json` | Mozilla/5.0 Mac | **200** | No — same HTML wall |
| `www.reddit.com/r/…/top.json` | Mozilla/5.0 | **403** | No |
| `www.reddit.com/r/…/top.json` | curl default | **403** | No |
| `www.reddit.com/r/…/top/.rss` | Mozilla/5.0 | **403** | No |
| `old.reddit.com/r/…/.rss` | curl/8.7.1 | **403** | No |
| `api.reddit.com/r/…/top` | Mozilla/5.0 | **403** | No |

Reddit is unreachable for evidence purposes on all eight variants. The methodological correction for future rounds: **`old.reddit.com/*.json` returns HTTP 200 with a login page**, so a status-code check alone would have produced a silent fabrication. Everything else worked via `curl`: arXiv API (https only — `http://export.arxiv.org` returned **503**, `https://` returned 200), HN Algolia, GitHub REST, First Round, Sequoia, Intercom, Feld, Above the Crowd, Bessemer, ChartMogul, Stack Overflow, Christensen Institute, frankfurter.app.

---

**What refutes the product, first**

| # | Finding | Number | Source, date | Tag |
|---|---|---|---|---|
| R1 | Low-ARPA SaaS cannot retain. Top quartile of businesses with ARPA <$25/mo reach only **70%** net retention; best-in-class is **110%**. Rs 599 = $6.28/mo. | 70% vs 110% | ChartMogul SaaS Benchmarks Report, 2,100+ businesses | [fetched] |
| R2 | Kite grew to **500,000 monthly-active developers with almost zero marketing spend** and still died. Verbatim: "Our 500k developers would not pay to use it." | 500,000 → $0 | kite.com blog, 2022-11-20 (HN 1,083 pts / 528 comments) | [fetched] |
| R3 | The Show HN category this product launches into is a mass grave: **386** "markdown editor" Show HNs, **median 3 points**, **44% scored ≤2**, only 5.7% ≥100. | n=386 | HN Algolia, counted 2026-08-31 | [measured] |
| R4 | Developers do not want AI in the two workflow slots this product owns. **39.6%** say they don't plan to use AI for "creating or maintaining documentation"; **58.7%** for "committing and reviewing code" — the two highest refusal rates after ops and planning. | 39.6% / 58.7% | Stack Overflow Developer Survey 2025, n=25,349 | [fetched] |
| R5 | Documentation is the task agents are *already best at*, so the review burden the product sells against is smallest exactly where it aims. Documentation PRs: **82.1%** acceptance vs **66.1%** for new features; Claude Code documentation **92.3%**. | 7,156 PRs | arXiv 2602.08915v2 (MSR'26), 2026-02-09 | [fetched] |
| R6 | Agent adoption is real but a minority: **22.20%–28.66%** of 128,018 GitHub projects. Only **30.9%** of surveyed developers use agents at work at any cadence (14.1 daily + 9.0 weekly + 7.8 infrequent). | 128,018 projects | arXiv 2601.18341v2, 2026-01-26; SO2025 | [fetched] / [derived] |
| R7 | Rule of 40 does not apply and cannot be invoked as a defence: Feld's own framing is "for SaaS companies **at scale – assume at least $50 million in revenue**." | $50M floor | feld.com, 2015-02-03 | [fetched] |

Note the internal tension in R4/R5 against the product's own strongest prior evidence (slop = 23.7% of complaints, +149%). Slop is rising *and* documentation is the task agents fail least at. Both can be true; the critique must not treat rising slop as automatic demand for a documentation-diff reviewer.

---

**Product frameworks: the toolkit, and what each says about this product**

| Framework | Primary source (fetched) | The mechanism, verbatim where load-bearing | Applied to a byte-exact markdown editor with zero users |
|---|---|---|---|
| **Kano (1984)** | Wikipedia/Kano_model — five categories: Must-be, One-dimensional, Attractive, Indifferent, Reverse | Must-be quality is "the price of entry into a market"; done well, "customers are just neutral" | Byte-exactness is textbook **Must-be**, not Attractive. Prior research proves it: 4 complaints in 12,556. Nobody praises an editor for not corrupting files; they leave when it does. A Must-be feature cannot be the value proposition — it can only be a disqualifier avoided. Sync, by contrast, is the measured One-dimensional axis (#1 loved, #1 switching trigger). **Test: name one Attractive-quality feature. If the answer is byte-exactness, the product has no delighter.** |
| **Jobs to Be Done** | christenseninstitute.org/theory/jobs-to-be-done | "people 'hire' products or services when 'jobs' arise"; the job is "the progress they're trying to make" | The job is not "edit markdown byte-exactly." The candidate job is "stop my agent from silently wrecking my repo's context files." The competitor set is therefore not editors — it is `git diff`, `git add -p`, PR review, and doing nothing. **Test: what is being fired?** If the honest answer is "nothing, they'll keep using VS Code + git", there is no job. |
| **RICE** | intercom.com/blog/rice-simple-prioritization — Reach × Impact × Confidence ÷ Effort; Impact 3/2/1/0.5/0.25; Confidence 100/80/50% | "The resulting score measures 'total impact per time worked'" | Reach must be "real measurements from product metrics" — with zero users there are none, so every Confidence is capped at 50% ("low") or below ("total moonshot"). RICE run honestly on this product returns near-zero scores across the board, which is the correct signal, not a defect of the framework. |
| **ICE** | productplan.com/glossary/ice-scoring-model (Sean Ellis) — I × C × E, 1–10 each | "almost completely subjective"; "two people could assign very different values" | ICE is the *wrong* tool here and should be named as such. Its known failure — "keep going for low hanging fruit" — is precisely the failure mode of a two-person team polishing an engine instead of finding a buyer. |
| **Sean Ellis PMF test / 40%** | via First Round Review, fetched 2026-08-31 | "After benchmarking nearly a hundred startups… Ellis found that the magic number was 40%"; survey users who "used the product at least twice in the last two weeks"; "directionally correct results around 40 respondents" | **Unrunnable today.** Zero users means zero respondents. The 40-respondent floor is the single most actionable number in this entire report: it is the smallest possible bar the product must clear before any further engineering is defensible. |
| **Superhuman PMF engine** | First Round Review, Rahul Vohra | 22% → **33% by segmentation alone** → **58% within three quarters**; four questions; "politely disregard those who would not be disappointed" | The segmentation step is the direct rebuttal to "zero users, so we can't measure": Superhuman ran it at 100–200 users. The engine also prescribes ignoring the not-disappointed — which means the 12,556-complaint corpus is the *wrong* input; it is aggregate market noise, not a segmented supporter set. |
| **Sequoia Arc: Hair on Fire / Hard Fact / Future Vision** | sequoiacap.com/article/pmf-framework, published 2024-04-09 | Hair on Fire: "You can't just be faster or cheaper—you need a truly differentiated customer experience." Hard Fact: "The challenge to overcome is force of habit." Future Vision: "the obstacle is disbelief" | This product claims Hair on Fire (slop is urgent) but behaves like Hard Fact (people have resigned themselves to reviewing diffs in git). Under Hard Fact, Sequoia's prescription is **market education first** — HubSpot coined "inbound marketing" and wrote a book. Two founders with a "very small AI budget" have no education budget. Misdiagnosing the archetype is the most common failure Arc reports: "Many founders we encounter in Arc assume they're supposed to be in the Hair on Fire path." |
| **YC / Paul Graham** | paulgraham.com/startupideas.html | "you can either build something a large number of people want a small amount, or something a small number of people want a large amount. **Choose the latter.**" Plus the "schlep filter" and "unsexy filter" | Byte-exactness is a genuine schlep — that is in the product's favour. But PG's test is *want a large amount*, and the measured want is 4 in 12,556. The product currently satisfies the schlep filter and fails the want test, which is the worst quadrant: hard to build, easy to ignore. |

---

**Business frameworks and current published benchmarks**

| Benchmark | Value | Source, date | Tag |
|---|---|---|---|
| Growth, $1–10M ARR | **~200%/yr**; growth endurance ~70% YoY | Bessemer, *Scaling to $100 Million* | [fetched] |
| Spend mix at $100M ARR | R&D 35%, S&M **50%**, G&A 20% of revenue | Bessemer, same | [fetched] |
| Growth, top quartile <$1M ARR | **139.1%** LTM (vs ~2× that in 2020–21) | ChartMogul, 2,100+ businesses | [fetched] |
| Growth, top quartile $1–8M ARR | **70%**/yr; $8–30M: ~45% | ChartMogul | [fetched] |
| Net revenue retention, best-in-class | **110%**; >100% signals PMF | ChartMogul | [fetched] |
| NRR by ARPA | ARPA >$1k/mo top quartile: **110%+**. ARPA <$25/mo top quartile: **70%** | ChartMogul | [fetched] |
| Retention→growth link | NRR >100% grew **49.5%**; NRR 60–80% grew **9.2%** | ChartMogul | [fetched] |
| Rule of 40 | growth% + profit% ≥ 40, **at ≥$50M revenue** | Feld, 2015-02-03 | [fetched] |
| LTV/CAC, the critique | "It's a Tool, Not a Strategy"; "Purchased Customers Underperform Organic on Almost Every Metric"; "You can't win a fight with a measuring tape" | Gurley, *The Dangerous Seduction of the LTV Formula*, 2012-09-04 | [fetched] |

OpenView's PLG benchmark library is **gone** — `openviewpartners.com/product-led-growth-benchmarks/` returns **404** (site root returns 200). Bessemer's `state-of-the-cloud` and `state-of-the-cloud-2025/2026` slugs return **404**. Any critique citing OpenView PLG numbers is citing a dead source and should say so.

**Derived arithmetic (FX = 1 USD : 95.39 INR, frankfurter.app, rate date 2026-08-28)**

| Quantity | Rs 299 | Rs 599 |
|---|---|---|
| Monthly USD | $3.135 | $6.279 |
| Annual per user | $37.61 | $75.35 |
| Users for $10,000 MRR | **3,190** | **1,592** |
| Users for ₹20,00,000/mo | **6,689** | **3,339** |
| Payback at CAC $50, 80% GM | **19.9 months** | **10.0 months** |
| Payback at CAC $100, 80% GM | **39.9 months** | **19.9 months** |

Two consequences a critique should press. First, at $3.13/mo contribution, *any* paid acquisition is fatal — a 19.9-month payback with 70%-ceiling retention means the median customer churns before payback. Second, Gurley's point applies with unusual force: with no paid channel affordable, LTV/CAC is not a lever, it is a scoreboard for a game not being played. The only viable motion is organic/bottom-up — and R3 measures how that channel performs for this category (median 3 points).

---

**Research findings**

| Paper | Finding | n | Date |
|---|---|---|---|
| arXiv 2501.13282 — Zoominfo Copilot | **33%** suggestion acceptance, **20%** of lines, 72% developer satisfaction | 400+ devs | 2025-01-23 |
| arXiv 2602.08915v2 — PR acceptance by task | Documentation **82.1%** vs new features **66.1%** (16pp gap "exceeds typical inter-agent variance"); Claude Code docs **92.3%**; Devin only agent with positive trend (+0.77%/wk over 32 wks) | 7,156 PRs | 2026-02-09 |
| arXiv 2602.02345 — task-level agent eval | Codex highest acceptance; Copilot triggers most review discussion; commit quality varies **independently** of acceptance | AIDev-pop | 2026-02-02 |
| arXiv 2601.18341v2 — *Agentic Much?* | Agent adoption **22.20%–28.66%** of projects; agent-assisted commits are **larger** than human-only | 128,018 projects | 2026-01-26 |
| arXiv 2605.14478 — *When Retrieval Hurts Code Completion* | Stale context **actively induces** wrong code: stale-only retrieval produced stale refs in **15/17** (Qwen2.5-Coder-7B) and **13/17** (gpt-4.1-mini), +88.2pp / +76.5pp over current-only. No-retrieval: 0 stale refs but only **1/17** passing | 17 samples, 5 repos | 2026-05-14 |
| Stack Overflow 2025 | **66%** frustrated by "AI solutions that are almost right, but not quite" (n=31,476); **45.2%** debugging AI code more time-consuming; accuracy **distrust 46% > trust 33%**, only **3.1%** "highly trust"; **72.2%** say vibe coding is not part of their work | 33k+ | 2025 |

2605.14478 is the strongest paper *for* the product and must be handled honestly: it proves context freshness causally changes model output, which is the intellectual foundation of the whole thesis. But note what it also proves — the rescue mechanism is "adding valid current evidence," not byte-exact editing, and the failure it studies is *retrieval*, not *file corruption*. It supports "context quality matters"; it does not support "a markdown editor is the fix."

---

**Precedents, honestly told**

| Tool | Outcome | What actually separated it |
|---|---|---|
| **Kite** | Dead 2022-11. 500k MAU, near-zero marketing, $0 conversion. "we failed to build a business because our product did not monetize, and it took too long to figure that out." Also: "It may cost over $100 million to build a production-quality tool" | Best technology in its category at the time. **Distribution was solved; willingness-to-pay was never tested.** The exact failure available to this product. |
| **Fig** | Absorbed. Acquired by Amazon 2023-08-28 (HN 380 pts); folded into CodeWhisperer for Command Line 2024-02-07 | Beloved, narrow, a feature not a company. Acquisition was the only exit its shape allowed. |
| **Zed** | Alive, funded. **$32M Series B led by Sequoia, 2025-08-20**, total >$42M; open-sourced 2024-01-24 (HN 1,576 pts / 601 comments) | Founders shipped Atom first (distribution + credibility), then built a *performance* wedge measurable in milliseconds, then attached AI. Ordering: audience → wedge → AI. |
| **Raycast** | Alive, funded. **$30M Series B, 2024-09-25**; "hundreds of thousands of Mac users" | Replaced a daily-use OS surface (Spotlight), then monetized Pro/AI/Teams on top of a free habit. Frequency first. |
| **Warp** | Alive (135 HN stories). Repositioned from terminal to agentic dev environment | Survived by moving *up* into the agent layer rather than defending a substrate. |
| **Linear** | Alive. "Linear – A fast issue tracker", 2020-06-30, **491 pts** — the launch that made taste a category | Taste + speed in a crowded Hair-on-Fire market — Sequoia's "different, not merely better." |
| **Obsidian** | Alive, no VC. Free app; paid Sync/Publish/Commercial (price tokens on the pricing page: $4, $5, $8, $10, $25, $50 — plan mapping not verified here, [SS]) | **The single most relevant precedent.** Gave away the editor, charged for *sync* — which prior research already identified as the #1 loved feature and #1 switching trigger. It monetized the axis this product currently does not own. |
| **Atom** | Sunset by GitHub, 2022-12 | Good technology, owned by a company with a better one. Substrates get absorbed. |

The pattern across the survivors: **none of them monetized correctness.** They monetized speed (Zed), frequency (Raycast), taste (Linear), or sync (Obsidian). The one that monetized a purely technical correctness advantage — Kite — reached half a million developers and zero dollars.

---

**The graded rubric**

Score the critique that follows against this. Each criterion is pass/fail, no partial credit — a serious operator does not award half-marks for "directionally right."

| # | Criterion | Pass looks like | Fail looks like |
|---|---|---|---|
| 1 | **Archetype named and defended** | Explicitly picks Hair on Fire / Hard Fact / Future Vision (Sequoia, 2024-04-09) and shows the operating consequence. Hard Fact ⇒ names the education budget in rupees | Asserts urgency without saying which archetype, or claims Hair on Fire while describing habit inertia |
| 2 | **Kano classification of every claimed differentiator** | Byte-exactness explicitly classed Must-be, with the 4/12,556 count cited; names at least one Attractive-quality candidate | Treats a Must-be as a value proposition |
| 3 | **PMF measurement plan, not a PMF opinion** | Names the 40% benchmark, the ≥40-respondent floor, the "used twice in last two weeks" screen, and the Superhuman segmentation step; states a date by which n≥40 exists | "We don't have PMF yet" as narration, with no instrument |
| 4 | **Retention ceiling confronted** | Cites the 70% top-quartile NRR for ARPA <$25/mo and either raises price above $25/mo or abandons the NRR>100% claim | Quotes 110% NRR as a target while pricing at $3–6 |
| 5 | **Unit economics with shown arithmetic** | FX rate with its date; payback months at ≥2 CAC assumptions; user counts for a stated revenue goal | Any rupee/dollar figure without the conversion rate and rate date |
| 6 | **Benchmarks dated and live** | Every benchmark carries a source and date; dead sources (OpenView 404, Bessemer state-of-the-cloud 404) named as dead | Cites OpenView PLG benchmarks as if current |
| 7 | **Rule of 40 not misapplied** | States it applies at ≥$50M revenue and is therefore irrelevant here | Applies it to a pre-revenue company |
| 8 | **Distribution arithmetic** | States users needed for the revenue goal (3,339 at Rs 599 for ₹20L/mo) and the channel that produces them, against the measured median of 3 HN points | Names a revenue goal without a user count, or a channel without a conversion rate |
| 9 | **Kite test** | Answers directly: "if we reach 500,000 free users, what makes ours pay when Kite's didn't?" | Assumes free users convert |
| 10 | **Demand evidence separated from technology evidence** | Uses 2605.14478 to establish that context quality matters, and separately concedes it does not establish that an editor is the remedy | Cites the paper as validation of the product |
| 11 | **Competitor set is the real one** | Names `git diff`, `git add -p`, PR review, and doing nothing as the incumbents, per JTBD | Compares only to other markdown editors |
| 12 | **Founder-count contradiction resolved** | States whether it is one founder or two, and treats the ambiguity in the record as itself a finding | Repeats the contradiction |
| 13 | **A falsifiable kill condition** | One sentence of the form "if X is not true by date D, stop" — e.g. "if <40% of 40 surveyed users say very disappointed by <date>, stop" | Ends in "keep building and see" |
| 14 | **Refuting evidence leads** | The first substantive claim is one that damages the product | Refutation appears after the case for the product |
| 15 | **Every number has a denominator and a date** | 33% *of what, when*; 82.1% *of 7,156 PRs, 2026-02* | Bare percentages |

**Supporting measurements taken here** [measured, 2026-08-31]: GitHub code search — `filename:AGENTS.md` **73,216** files, `filename:CLAUDE.md` **44,800**, `filename:.cursorrules` **844**; repository search — `AGENTS.md in:path` **4,649** repos, `CLAUDE.md in:path` **6,836**. This is the honest TAM proxy for "people who build software with AI and keep .md files in a git repo," and it is small: 1% conversion of the 73,216 AGENTS.md population is **732** users — below the 1,592 needed for $10k MRR at Rs 599 [derived]. Show HN category census: "markdown notes" 442 launches (median 3, 47% ≤2), "note taking app" 409 (median 2, 51% ≤2), "local-first notes" 101 (median 3).

**Could not verify [SS]:** Obsidian plan-to-price mapping (page is JS-rendered; only the price tokens were extractable); Linear's current ARR or valuation (no primary announcement reachable — `linear.app/blog/linear-series-c` 404); Warp's funding total (`warp.dev/blog/series-b` 404); any Reddit sentiment; ChartMogul's report edition is the 2nd, analysing 2022–Q1 2023 data — a newer edition may exist but `saas-benchmarks-report-2025` returns 404, so treat these as the latest *reachable* figures, not necessarily the latest published.
