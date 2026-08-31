**The record's optimistic churn scenario is better than best-in-class for its own price band: ChartMogul measures best-in-class annual customer retention at 74.9% for companies with ARPA under $10/month, and §82.4's `c=2%/mo` compounds to 78.5%.** [fetched + derived]

One correction to the brief before anything else, because it matters for how hard the critique can hit. The brief says the record "has never said" that free exit is a retention problem. **It has said it, twice, and precisely:** §27 ranks switching cost as moat #7, "**Near zero, by design** — This is the anti-moat," and §82.2 says "Our file-is-the-source-of-truth stance deliberately *removes* lock-in… That is the right ethical choice and it raises churn. Name it." [measured, in-repo] What the record has never done is **price it** — put a number on the churn that free exit buys, against a benchmark for its own ARPA band. That is the gap this report closes, and it is a narrower and more defensible claim than "never said."

---

**What refutes the product, first**

| # | Finding | Evidence | Tag |
|---|---|---|---|
| 1 | Our ARPA band is the worst-retaining band ChartMogul publishes. Blended ARPU ₹352.40 ÷ ₹88/USD = **$4.00/mo** — inside "ARPA less than $10/month" | ChartMogul SaaS Retention Report 2023 | [fetched]+[derived] |
| 2 | "Only **2.7%** of SaaS businesses with an ARPA less than $10/month have net retention rates over 100%" | ibid., opened 2026-08-31 | [fetched] |
| 3 | "companies with an ARPA of less than $10/month have a top-quartile customer retention rate of just **63.1%**" → **3.76%/mo** | ibid.; 1−0.631^(1/12) | [fetched]+[derived] |
| 4 | Best-in-class for the band is "over **74.9%**" annual → **2.38%/mo**. §82.4's optimistic case (2%) = 78.5% annual — **better than best-in-class** | ibid. | [derived] |
| 5 | "Only **5.3%** of businesses with an ARPA less than $10/month" clear 85% gross retention | ibid. | [fetched] |
| 6 | In the largest "Obsidian alternative" thread of the last 12 months, **0 of 355 comments** mention corruption, mangling, clobbering, overwrites, data loss or reformatting. **0 of 355** mention byte/exact/fidelity/round-trip. **2 of 355 (0.6%)** mention diff/review/hunk/patch | HN 48179677, Files.md, 730 pts, 2026-05-18; harvested and counted here | [measured] |
| 7 | Obsidian gives the editor away free "without limits" and charges **$4/user/mo** (annual) for Sync alone. Our Pro is ₹299 ≈ $3.40/mo **for the editor**, and sync is still architecture (§31), not shipped | obsidian.md/pricing, opened 2026-08-31 | [fetched] |
| 8 | Relay's plugin number the record leans on is a **sum across 45 releases**, not people. Relay = 191,997 cumulative; **best single release = 21,047** (9.1× inflation) | obsidian-releases `community-plugin-stats.json`, counted here | [measured] |
| 9 | Relay ranks **128 of 7,092** plugins — **p98.4**. The record cites the 98th percentile as the expected case | ibid. | [measured] |
| 10 | **31%** of the 42 posts that cleared 50 points in our category in 12 months say "open source"/"self-host"/"free" in the title. The top four all do | HN Algolia, 627 unique stories deduped across 8 queries | [measured] |

The single most damaging line in this report is #6. The record already knew byte-exactness is rarely discussed (4 complaints in 12,556). This is worse: in 355 comments from people actively shopping for an Obsidian replacement — the highest-intent audience that exists for us — **the problem we solve was raised zero times.** Not rarely. Zero. A stranger stated our positioning back at us and dismissed it: *"Agree wholeheartedly, but you already have that with Obsidian. You own the vault, and if you don't want obsidian, its already in markdown."* [fetched, HN 48179677]

---

**Benchmarks, opened and dated**

| Source | URL | Read | Segment | Number |
|---|---|---|---|---|
| ChartMogul SaaS Retention Report 2023 (data Jan 2021–Dec 2022) | chartmogul.com/reports/saas-retention-report/ | 2026-08-31 | ARPA <$10/mo | Top-quartile NRR **65.1%**; top-quartile customer retention **63.1%**; best-in-class **74.9%**; 2.7% clear 100% NRR; 5.3% clear 85% GRR |
| " | " | " | ARPA <$50/mo | Top-quartile GRR **"60 to 70%"** → 2.93–4.17%/mo [derived] |
| " | " | " | ASP <$10/mo | First 3 months, top quartile retains **87%** (vs 98% at $500+) |
| Recurly churn benchmarks | recurly.com/research/churn-rate-benchmarks/ | 2026-08-31 | `datePublished` 2026-07-29 | All industries **3.60%** overall / **2.34%** voluntary / **1.25%** involuntary; SaaS 3.22%; **$10–$25 ARPC: 4.29% overall, 1.30% involuntary**; $250+ ARPC: 0.18% involuntary |
| Growth Unhinged free-to-paid conversion report | growthunhinged.com/p/free-to-paid-conversion-report | 2026-08-31 | `datePublished` 2026-02-04 | Median free-to-paid **8%**; **25% of freemium products convert below 2.5%**; credit-card-gated trials convert **30%**, "more than 5x ones that don't require one" |
| Stack Overflow Developer Survey 2025 | survey.stackoverflow.co/2025/technology | 2026-08-31 | n=**30,065** (61.3% of respondents) | **Markdown File 34.8%** · Obsidian **16.1%** · Notion 16.5% · Confluence 32.8% · GitHub 81.1%. Professional devs: Markdown File 35.2%, Obsidian 15.6% |
| Lenny Rachitsky, "What is good retention" | lennysnewsletter.com/p/what-is-good-retention-issue-29 | 2026-08-31 | 20 growth practitioners | Benchmark tables are **images** — not extractable. Usable text: *"startups rarely increase retention significantly"* |

Two integrity notes. **Recurly's page is internally inconsistent** and cannot be quoted as-is: it labels 3.22% a "median *annual* churn rate" for SaaS, then elsewhere says "A 2% monthly churn rate translates to roughly 22% annual churn." A 3.22% *annual* churn across a broad merchant network is implausible and irreconcilable with ChartMogul's 63.1%. Treat Recurly's ARPC *ratios* as sound and its absolute level as unresolved. [fetched, flagged] Second: our ARPC ($3.40–$6.80) sits **below Recurly's lowest published band**, so 1.30% involuntary is a floor, not an estimate — and §82.3's one-attempt Indian rail pushes it up, not down.

**Re-centring §82.4.** The record's three churn scenarios are shifted one full band optimistic:

| §82.4 scenario | Annualised | Where it actually sits in ChartMogul's ARPA<$10 band |
|---|---|---|
| c = 2%/mo | 78.5% retained | **Above best-in-class (74.9%)** — not achievable |
| c = 4%/mo | 61.3% retained | ≈ **top quartile (63.1%)** — an aspiration, labelled as the middle |
| c = 6%/mo | 47.6% retained | The honest central case, and ChartMogul publishes no median for the band, only quartiles — so this may still be optimistic |

At the honest central case, holding ₹20L/mo needs **89,200 visitors every month forever**, which is **1,070,400 visitors/year = 84.9% of the entire 1.26M cumulative acquisition figure, annually, to stand still.** [derived from §82.4 × 12]

---

**What actually drives retention in an editor**

Ranked by the evidence available, not by how good each feels:

| Driver | Do we have it? | Evidence |
|---|---|---|
| **Habit / daily open** | Unknown and **unmeasurable by our own design** (below) | SO 2025: 34.8% of devs already use markdown files regularly — the habit exists but is served by whatever editor is already open [fetched] |
| **Sync across devices** | No — architecture only (§31). This is Obsidian's entire paid product at $4/mo | Sync is 37/355 = **10.4%** of the Files.md thread, 5th-most-mentioned theme [measured]; record's own "#1 loved feature and #1 switching trigger" |
| **Accumulated corpus** | Yes — but it is on **their** disk, so it moves with them | §27 row 7 |
| **Shared team artefacts** | Weak — flat ₹3,999 licence disables seat expansion (§82.8) | ChartMogul: 2.7% of <$10 ARPA clear 100% NRR [fetched] |
| **Plugin/ecosystem investment** | **Banned** (§86) — the strongest editor lock-in mechanism, removed on purpose | 7,139 plugins is the moat Obsidian has and we forbid ourselves [measured] |
| **Switching cost** | **Zero, deliberately** | §27 row 7 |

Every retention driver we could have, we have either not built (sync), given away (files on their disk), or banned (plugins). What remains is §17's answer — "Correctness is the retention mechanic" — and finding #6 says the market does not currently experience incorrectness as a problem worth discussing. **The ethical win and the retention problem are the same design decision, and the record's §27 admission of the anti-moat has never been carried into §25's funnel or §82's ceilings, both of which still assume retention arrives from somewhere.**

**The instrumentation contradiction, which is the sharpest thing here.** §17 mandates implicit-telemetry-only: no identifiers, no event stream, no per-action phone-home. §82.9 mandates cohort tables with voluntary and involuntary churn as separate series. **These cannot both hold.** Version-check requests per day cannot be de-duplicated into unique installs, so there is no MAU denominator; DAU/MAU is not approximable, cohort retention is not computable, and §17's own table concedes the only hard churn number available is "Refunds and non-renewals," which "Cannot answer: Cause." A product that cannot measure retention cannot manage it, and this is observable on day one rather than month twelve.

**DAU/MAU for editors: not found, and I will not fabricate one.** Searched HN comments for "DAU MAU ratio" — **23 hits in the entire index**, none for an editor or note app. `amplitude.com/blog/product-benchmarks-report` returned 200 but is JS-rendered and yielded 0 extractable benchmark sentences. `mixpanel.com/blog/product-benchmarks-report/` 404, `businessofapps.com/data/notion-statistics/` 404, `businessofapps.com/data/evernote-statistics/` 404. The record's §17 independently reached the same conclusion — "no published quantitative abandonment study for note-taking apps was found at all" — and I confirm it. [SS / not-found]

---

**Growth loops, ranked by whether we control them**

| Loop | Compounds? | Who owns the channel | Measured base rate |
|---|---|---|---|
| **Content on our own domain** | Yes, slowly | **Us** — the only fully-owned channel | Record: **exactly two posts have ever shipped**, one defective since 2026-08-10 [measured, in-repo] |
| **Published pages with SEO** | Yes, if indexed | Us for the domain, **Google for ranking** | §87.5 already flags the indexing tension; no measurement exists |
| **Shared artefact with a mark** | Only if artefacts get shared | Us for the mark, **recipient for the share** | §17's generator marker is the only instrumentation; zero data |
| **GitHub presence** | Weakly | Us, but the surface is crowded | **5,886** "markdown editor" repos created in the last 12 months; 8 free incumbents hold **336,819 stars**, all pushed within 5 days [measured] |
| **Obsidian plugin** | **No — it compounds for Obsidian** | **Obsidian** owns registry, review queue, code of conduct | 7,092 plugins; median **532** downloads; **59.1% (4,194) under 1,000**; top 10% hold **91.7%** of all downloads; Relay is p98.4 [measured] |
| **HN launch** | No — a spike, not a loop | **HN** | 1,000 most recent Show HN: median **2** points, p90 8, p95 16. **1.4% reach 100 points, 0.1% reach 500** [measured] |

The ranking inverts the record's §26. The plugin play is ranked as "the distribution play" and is in fact the **least-owned** loop on the list, evidenced by its **99th-percentile** exemplar, whose real reach is 21,047 not 172,544. Content is the only loop we own outright, and it is the one with a measured supply of two.

---

**The cold start: what the first hundred concretely is**

Arithmetic, at the record's own rates: 100 paying customers ÷ 5% conversion = **2,000 free signups** ÷ 9% visitor→signup = **22,222 visitors**. [derived] Then, to *hold* 100 at ChartMogul's top-quartile 3.76%/mo, gross adds of **≈4 paying customers every month, forever**. [derived]

No measured loop produces 22,222 visitors at n=0. A p90 Show HN (8 points) produces effectively none; the 1.4% outcome that clears 100 points is not a plan. And 25% of freemium products convert below 2.5% [fetched] — our free tier is BYO-key, unmetered, no signup, no credit card, which is structurally the configuration in that bottom band, not the 8% median.

**So the first hundred cannot come from a loop; it must be hand-recruited, one at a time, from people the founder can name.** The record's own "every channel is borrowed" finding is the reason: r/ObsidianMD's code of conduct forbids the only framing that would work, HN's distribution is a lottery with a measured 1.4% hit rate, and the Obsidian registry is a channel Obsidian can close. Hand-recruitment is the only channel that is not borrowed. At 100 conversations it is also a *research* instrument — it is the only way to get the day-30 retention number that §17's telemetry design forbids collecting.

---

**What kills growth here, ranked by earliest observable signal**

| # | Kill | Earliest observable signal | Threshold |
|---|---|---|---|
| 1 | **"I already have that with Obsidian."** The incumbent is free, owns the file, and has 16.1% of developers | Count the phrase in the first 50 recruitment conversations | >20% → the wedge is not a wedge |
| 2 | **Cannot measure retention at all** (§17 vs §82.9) | Ask on day one: can we compute day-30 return per cohort? | Answer is no today |
| 3 | **Conversion lands in the bottom freemium quartile** | Month-3 free→paid | <2.5% → the free tier is the product |
| 4 | **Churn at $4 ARPA** | Month-6 cohort, annualised | <63.1% → below ChartMogul top quartile → §82.4 was fiction |
| 5 | **Involuntary churn on the one-attempt Indian rail** | First 20 renewals: count declines | >1.30%/mo (Recurly's floor for a *higher* band) |
| 6 | **Cold start never ignites** | First Show HN | <50 points — measured 97.2% likely |
| 7 | **A free clone lands first** | New repo >1,000 stars with our thesis | Already partially fired: `AgriciDaniel/claude-obsidian`, **14,405 stars**, "AI second brain for Obsidian + Claude Code" [measured] |

---

**Source reachability log**

Reddit is unreachable by every path tested. Exact results, 2026-08-31: `www.reddit.com/r/ObsidianMD/top.json` **403**; `www.reddit.com/r/ObsidianMD/.rss` **429**; `api.reddit.com` **403**; `oauth.reddit.com` **403**; `old.reddit.com/r/…/{top,search}.json` with `curl/8.7.1` **403**; `old.reddit.com/r/…/{top,search}.json` with a Chrome UA returns **HTTP 200 but the body is the "Welcome to Reddit" interstitial HTML, not JSON** — a soft block that a status-code-only check would score as success; `api.pullpush.io` **429**, body: *"This website does not provide free scraping resources for agents."* Consequently the record's r/ObsidianMD ≈344,000 and Discord ≈195,000 figures are **unverified in this session**. Also failed: `growthunhinged.com/p/{freemium-benchmarks, plg-benchmarks-2024, product-led-growth-benchmarks}` 404 (recovered via `sitemap.xml`); `openviewpartners.com/product-benchmarks/` 404; `wordstream.com` 403; `lennysnewsletter.com/p/what-is-a-good-retention-rate` 404. arXiv, HN Algolia, GitHub API, raw.githubusercontent.com, chartmogul.com, recurly.com, obsidian.md and survey.stackoverflow.co all returned usable content.

This session performed no writes, commits, or mutating commands — read-only throughout, so the reported AIOS dirty state did not originate here. Working files, all read-only, under `/private/tmp/claude-501/-Users-sagnikmitra-Desktop-GitHub-frontmatter/2e90ab3b-4a90-4362-bce4-042a842a2af5/scratchpad`: `cm.html`, `rc.html`, `cps.json`, `cpl.json`, `so.html`, `free-to-paid-conversion-report.html`. Record sections read: `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/FRONTMATTER-RECORD.md` §16–17, §25–27; `/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/BUSINESS.md` §82.
