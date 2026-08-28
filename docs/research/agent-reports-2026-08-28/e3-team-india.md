## KEY FINDINGS
- PART A verdict: the $5-8/seat Wave-2 band HOLDS for the internal team-wiki buyer — verified seat prices bracket it (Confluence Standard $5.42/user/mo, Nuclino $6-12.50, Slite $8-20, HackMD Team $4-8, Obsidian optional commercial license ~$4.17/mo-equivalent) [SS] — but it is attacked from below by Outline cloud (~$1/seat effective at $10/mo for 10 users) and free self-hosted Docmost (21,499 GitHub stars, active Aug 2026) [fetched].
- Procurement unlock is SSO/SAML + SOC-2-style compliance artifacts + audit trails — the classic 'SSO tax' gate; Outline bundling SSO into its cheapest $10/mo cloud plan is the undercut precedent, and B2B buyer guides consistently name missing SAML as the enterprise deal-blocker [SS].
- The PUBLISHED-docs buyer has repriced per-SITE, not per-seat: GitBook Premium $65/site/mo + $12/user, Ultimate $249/site/mo + $12/user; Mintlify Pro now $450/mo annual ($540 monthly) after repeated hikes [SS] — team-wiki seats and docs-site publishing are two different buyers with two different pricing physics.
- Churn tailwind is real and fresh: Atlassian raised Confluence cloud prices again effective 2025-10-15 (+5% Standard, +7.5% Premium, +7.5-10% Enterprise, on a 12-18-month raise cadence) [SS incl. Atlassian's fiscal-2026 pricing notice PDF], GitBook's per-site repricing produced documented Trustpilot billing outrage ($384→$585 auto-upgrade charge despite cancellation) [SS], and Confluence/Notion markdown exit tooling is active (confluence-markdown-exporter 529 stars pushed 2026-08-17; 77 Confluence-export and 160 Notion-export repos on GitHub) [fetched].
- Docs-as-code is mainstream by toolchain volume [fetched 2026-08-21..27]: @docusaurus/core 1.567M + vitepress 1.063M + nextra 215k + mintlify 171k weekly npm downloads; blog-sourced claims that 63-72% of technical-writer job postings now require Git/docs-as-code are directional only [SS, unverified vendor stats].
- Budget exists and is growing: Mintlify went $1M→$10M ARR (end-2024→end-2025) at 150% NRR with >10,000 companies onboarded [SS Sacra], on $21M raised [SS]; GitBook by contrast is estimated at only ~$3.9M revenue with ~35 staff [SS getlatka, low trust] — the space monetizes, and Mintlify's price ladder leaves a wide-open $0-450/mo gap.
- GitBook's dominant complaint cluster is reliability (real-time sync losses, editor bugs, editor-vs-published drift) [SS G2/Trustpilot/eesel] — 'an editor that never loses your work' is a purchasable differentiator in this category, which maps directly onto MDMAX's engine strengths.
- PART B: India's paid-app inflection is real and fresh — $345M consumer app spend in Q2 2026 (+35% YoY), IAP revenue $520M (2021)→$1B+ (2025)→$1.25B projected (2026), non-gaming now 68% of revenue, productivity/AI leading (TechCrunch 2026-07-31) [SS] — and India became GitHub's largest open-source contributor base in 2025 (21.9M devs, +5.2M in one year) [SS Octoverse coverage].
- But NO India-specific willingness-to-pay evidence for markdown/note tools was found (honest negative result): Notion still has no India regional pricing (bills USD, no GST invoice, public parity demands, grey-market resellers at ~$30/yr) [SS]; the PPP precedents that exist (JetBrains INR pricing ~₹4,499/yr IntelliJ Ultimate; ParityDeals-published +15% and +320% revenue cases) are indie/course/IDE precedents, not team-seat SaaS [SS, vendor-biased].
- India verdict: DEFER building PPP for launch — flip on processor-level geo-pricing (Paddle/LemonSqueezy/ParityDeals toggle) for the INDIVIDUAL tier only at ~40-60% off, and prioritize UPI support via the processor (vendor claim: 30-40% Indian checkout abandonment without UPI/domestic cards [SS PayU, biased]) — UPI availability matters more than the discount; revisit seat-tier regional pricing only when a Wave-2 team product exists.

---

# GAP 8 — Team/Docs-as-Code Buyer + India/PPP Evidence

Research date: 2026-08-28. Method note: WebFetch was refused by this session's taint gate, so all non-GitHub/npm web evidence is [SS] (WebSearch summaries, unverified). [fetched] items were opened via curl against api.github.com / api.npmjs.org / github.com only. Per LR#62: no numbers below are simulated; each is either observed in tool output ([fetched]) or quoted from a search summary ([SS]).

---

## PART A — TEAM / DOCS-AS-CODE BUYER EVIDENCE CARD

### A1. Review themes per tool (what buyers praise, complain about, and what triggers procurement)

**HackMD** — [SS] https://www.g2.com/products/hackmd/reviews
- Praise: "cozy" editor, fast sharing/publishing, seamless real-time collaboration, book mode + slide mode, GitHub repo sync, self-hostable.
- Complaints: not mobile-friendly, Android keyboard issues, "development resources are limited."
- Meta-finding (load-bearing): G2 explicitly says there are **not enough reviews for buying insight — essentially one verified review** [SS]. HackMD has product love but no procurement-grade review presence. Its community edition (hackmdio/codimd) last pushed 2025-10-02 — a year stale [fetched https://api.github.com/repos/hackmdio/codimd, 10,136 stars]; the community fork HedgeDoc is active (7,383 stars, pushed 2026-08-28) [fetched https://api.github.com/repos/hedgedoc/hedgedoc].

**GitBook** — [SS] https://www.trustpilot.com/review/gitbook.com, https://www.eesel.ai/blog/gitbook-review, https://www.g2.com/products/gitbook/pricing (~176 G2 reviews)
- Complaints (dominant cluster = **reliability**): "frequent collaboration sync issues," "slow and buggy," **lost work**, breakage after updates, half-finished features, editor-to-published formatting differences, weak AI search, intrusive GitBook banner.
- Pricing outrage: repricing "denies access to updates to your site unless you upgrade to a paid plan that costs over $70/month per website"; a Trustpilot reviewer reports being charged **$384 for Team plan (May 2025), then auto-switched and charged $585 (June 2025) despite cancelling** [SS].
- Read: GitBook is generating its own churn on two axes — reliability and forced repricing.

**Mintlify** — [SS] https://www.g2.com/products/mintlify/reviews?qs=pros-and-cons
- Praise: very fast support (same-day), **web editor lets non-technical colleagues contribute**, seamless GitHub sync, preview builds in the content lifecycle, local + live preview, AI search, custom CSS/JS + white-labeling.
- Complaints: "after the first year, there was a drastic price hike, although they were willing to negotiate"; occasional docs-site downtime (reimbursed).
- Read: best-loved DX in the category; the complaint is the bill, not the product.

**Outline** — [SS] https://www.g2.com/compare/guru-vs-outline, https://www.capterra.com/p/210246/Outline/
- G2 4.4/5 from **31 reviews**, predominantly small-business; Ease of Use 9.3, Knowledge Sharing 9.1; "best-looking interface among all open source alternatives."
- Direct [fetched] buyer-sentiment sample: GitHub discussion outline/outline#6802 (Apr–May 2024, 3 participants) asks for a **one-time-payment lifetime license for self-hosters** ("we need a price strategy for outline selfhosted a one-time payment," citing plane.so/one) [fetched https://github.com/outline/outline/discussions/6802]. Small n, but it is primary evidence that self-hosting teams have one-time-license appetite — relevant to frontmatter's non-subscription options.

**Procurement trigger (cross-tool)** — [SS] https://workos.com/blog/identity-sso-compliance-b2b, https://www.scalekit.com/blog/saml-sso-in-b2b-saas-the-complete-guide-for-developers-and-enterprise-buyers, https://www.knowledgeowl.com/blog/posts/knowledge-base-with-sso
- Consistent theme: **lack of SAML SSO is the enterprise deal-blocker**; security/legal/procurement demand SOC 2-style documentation and audit trails before purchase. Mid-market+ buyers "expect SAML out of the box."
- The pricing pages weaponize this ("SSO tax"): GitBook gates AI + advanced features at Ultimate; Mintlify gates AI features at Pro/Enterprise; **Outline includes SSO in its cheapest $10/mo cloud plan** — the undercut precedent [SS getoutline.com/pricing snippet].

### A2. Current pricing of the four (as of Aug 2026 — all [SS]; pricing pages could not be opened directly)

| Tool | Model | Numbers | Source |
|---|---|---|---|
| HackMD | per-seat | Free; Prime Team **$8/member/mo monthly, $4/mo annual ($48/yr)**; earlier price point $5 | [SS] https://hackmd.io/pricing via search |
| GitBook | **per-site + per-user** | Premium **$65/site/mo + $12/user**; Ultimate **$249/site/mo + $12/user** (AI answers on Ultimate, 500/mo cap); 5-person team on Premium = $125/mo | [SS] https://ferndesk.com/blog/gitbook-pricing, https://happysupport.ai/blog/gitbook-pricing |
| Mintlify | flat platform + seats/credits | Latest snapshot: Starter free (5,000 AI credits); **Pro $450/mo annual / $540/mo monthly** (10,000 credits); Enterprise custom. Earlier-2026 snapshot: $20/mo per extra editor, $0.25/AI message overage; 2025 snapshot: Pro $150/mo. **Pricing has been restructured repeatedly — treat any number as volatile** | [SS] https://ferndesk.com/blog/mintlify-pricing, https://documentation.ai/blog/mintlify-pricing-guide, https://automationatlas.io/tools/mintlify/ |
| Outline | flat tiers (cloud) | **$10/mo up to 10 users, $79/mo up to 100, $249/mo up to 200 — SSO included**; self-hosted free (license shows NOASSERTION/BSL-family, not OSI [fetched api.github.com/repos/outline/outline]) | [SS] https://www.getoutline.com/pricing?plan=cloud via search |

Seat-band anchors around the $5-8 thesis (all [SS]):
- Confluence Cloud: **Standard $5.42/user/mo, Premium $10.44/user/mo** — https://costbench.com/software/it-documentation/confluence/
- Nuclino: Starter **$6-8/user/mo**, Business **$10-12.50** — https://costbench.com/software/knowledge-management/nuclino/, https://www.capterra.com/p/174926/Nuclino/
- Slite: **$8/user/mo** Standard (annual), $20 Knowledge Suite (min 10 users); **free plan removed at its June 2026 relaunch** — https://www.featurebase.app/blog/slite-pricing, https://www.eesel.ai/blog/slite-pricing
- Obsidian: commercial license **optional since 2025-02-20**, $50/user/yr (~$4.17/mo) for support/early access — https://obsidian.md/pricing, https://www.creativerly.com/obsidian-is-now-free-for-work-commercial-license-becomes-optional/

### A3. Churn evidence (Confluence/Notion ↔ markdown-native)

- **Atlassian keeps raising prices**: customers notified 2025-08-19, effective **2025-10-15** — Confluence Standard **+5%**, Premium **+7.5%**, Enterprise **+7.5-10%**, on a historical 12-18-month raise cadence, justified by AI (Rovo) investment [SS] https://info.omgtechpartners.com/omg-tech-partners-blog/atlassians-2025-2026-price-increase, https://s206.q4cdn.com/270053503/files/doc_downloads/2025/09/Fiscal-2026-Cloud-Pricing-notice.pdf (Atlassian's own notice).
- **Exit tooling is real and active** [fetched 2026-08-28 via api.github.com/search/repositories]:
  - `Spenhouet/confluence-markdown-exporter` — **529 stars, pushed 2026-08-17**; **77 repos** match "confluence markdown export".
  - **160 repos** match "notion export markdown"; `yannbolliger/notion-exporter` 188 stars.
- **Where churners land** [fetched 2026-08-28 via api.github.com/repos/...]: Outline **40,359 stars**; **Docmost 21,499 stars** (AGPL Confluence/Notion replacement, pushed 2026-08-27 — repeatedly named "best self-hosted wiki in 2026" [SS https://contabo.com/blog/best-self-hosted-wiki-tools/]); Wiki.js 28,812; BookStack 19,005; AppFlowy 76,026; AFFiNE 71,968.
- **Notion-side push factor**: Notion's markdown export is documented as lossy (database relations break, inline DBs become CSV snapshots, toggles flatten) — the lock-in complaint is current, 2026 [SS] https://raccoon.page/blog/notion-export-limitations/, https://unmarkdown.com/blog/notion-export-broken.
- **Obsidian-side pull gap** (the settled #1 segment's team story): shared vaults support **max 20 collaborators, no live co-editing on the same file, every collaborator needs a paid Sync subscription**; third parties (Peerdraft) fill the gap [SS] https://obsidian.md/help/sync/collaborate, https://github.com/peerdraft/obsidian-plugin. The Wave-2 team wedge out of the Obsidian segment remains structurally open.
- Reverse direction exists too: an ecosystem of markdown→Confluence push tools (go-markdown2confluence, GitHub Actions) shows docs-as-code teams forced to publish INTO Confluence for their org [SS github.com/justmiles/go-markdown2confluence] — i.e., markdown authoring + wiki-of-record is a live two-system pain.

### A4. Docs-as-code market size proxies

- **Toolchain volume** [fetched, api.npmjs.org, week 2026-08-21→27]: `@docusaurus/core` **1,566,992**/wk; `vitepress` **1,063,321**/wk; `nextra` 214,554/wk; `mintlify` 170,884/wk; `docsify` 71,632/wk; `gitbook-cli` (abandoned OSS) 9,982/wk. GitHub stars [fetched 2026-08-28]: docusaurus 66,111; mkdocs-material 27,340; mkdocs 22,384.
- **Job-posting signals** (directional only — both are unverifiable vendor-blog stats): "**63% of technical writing job postings in Q4 2025 listed Git** (vs <10% in Q4 2022)" [SS] https://gitdoc.ai/blog/technical-writing-trends-2026; "**72% of 1,247 remote technical-writer postings (Jun 2025–Mar 2026) required Git + at least one docs-as-code tool** (Markdown, Docusaurus, MkDocs, Hugo)"; title drift to "Documentation Engineer" [SS] https://www.remotejobassistant.com/blog/remote-technical-writer-jobs. The Write the Docs salary survey pages surfaced no docs-as-code percentage in snippets (checked; honest gap) [SS] https://www.writethedocs.org/surveys/salary-survey/2024/.
- **Money in the category**: Mintlify — **$18M Series A led by a16z (Sep 2024), $21M total** [SS] https://www.mintlify.com/blog/series-a; **$10M ARR end-2025, up 10x from $1M end-2024, 150% NRR, >10,000 companies onboarded (vs ~1,000 late 2023), 20M devs reached annually** [SS] https://sacra.com/c/mintlify/. GitBook — est. **$3.9M revenue 2025, ~35 employees** [SS, low-trust estimate] https://getlatka.com/companies/gitbook.com; claims 2M+ users [SS]. Mintlify outgrowing GitBook ~2.5x on revenue while 10x-ing is the clearest demand signal in the category.

### A5. VERDICT — does the $5-8/seat Wave-2 thesis hold, and what unlocks procurement?

**Holds, with a fork.** [inference over the above]
1. For the **internal team-wiki buyer**, $5-8/seat sits inside the demonstrated band (Confluence 5.42 / Nuclino 6-12.5 / Slite 8 / HackMD 4-8 / Obsidian-commercial ~4.17). Pressure from below: Outline's flat cloud tiers (~$0.79-1.00 effective/seat) and free self-hosted Docmost mean $5-8 must be justified by something self-hosting can't cheaply give (zero-ops, guaranteed-lossless collaborative editing, AI protocol).
2. For the **published-docs buyer**, the market has moved to per-SITE pricing ($65-249/site GitBook; $450-540 flat Mintlify) — if frontmatter ever sells publishing, price the site, not the seat. Do not blend the two buyers into one plan.
3. **Procurement unlock = SSO/SAML + SOC 2 artifacts + audit logs** — uniformly named as the enterprise gate [SS WorkOS/Scalekit/KnowledgeOwl]. Tactical options: (a) copy Outline and include SSO cheap as a wedge against the SSO tax, or (b) gate it as the Wave-2 revenue line. Evidence favors (a) early (it's the switching trigger), (b) only at enterprise tier.
4. **Named switching triggers observed**: Atlassian's recurring price raises; GitBook's forced repricing + billing behavior; Mintlify's post-year-one price hikes; Notion's lossy export/lock-in; GitBook's data-loss-grade editor bugs. The composite buyer story frontmatter can own: *markdown files you can always leave with + an editor that provably never loses a keystroke (MDMAX degradation certificate) + SSO without the tax*.
5. Fresh white space: Mintlify's ladder now jumps **$0 → $450/mo** [SS] — a documented gap for small teams priced out of Pro, and its own G2 reviews name the hike as the complaint.

---

## PART B — INDIA / PPP READ

### B1. Willingness-to-pay evidence

- **Fresh macro inflection (July 2026)**: "India is starting to pay for apps, not just download them" — **$345M consumer app spend Q2 2026, +35% YoY; annual IAP revenue $520M (2021) → $1B+ (2025) → projected $1.25B (2026); non-gaming = 68% of H1 2026 revenue (vs 58% three years earlier); AI + productivity leading; ChatGPT + Claude ≈ 83% of India AI-app revenue in Q2; Google One the top-grossing app** [SS] https://techcrunch.com/2026/07/31/india-is-starting-to-pay-for-apps-not-just-download-them/. Apple also restored card payments for Apple Account purchases in India in July 2026 [SS] https://techcrunch.com/2026/07/06/apple-brings-back-card-payments-for-apple-account-purchases-in-india-after-a-four-year-hiatus/.
- **Developer population**: GitHub Octoverse 2025 — **India overtook the US as the largest base of open-source contributors; +5.2M new developers in 2025 (14% of all new GitHub accounts); 21.9M India vs 28M US; projected 57.5M by 2030 (overtaking US)** [SS] https://analyticsindiamag.com/ai-news-updates/india-surpasses-us-as-worlds-largest-base-of-open-source-contributors-github-octoverse-2025/, https://www.theregister.com/2025/10/29/india_devs_github/.
- **Category-specific WTP: NOT FOUND (honest negative).** No India-specific willingness-to-pay data for markdown/note/writing tools surfaced across six searches. What surfaced instead is price-sensitivity evidence: Notion has **no India regional pricing** (bills USD via US entity, no Indian GST invoice; ~₹670-830/user/mo equivalent) [SS] https://www.itforsme.in/pricing/notion-india, https://geopriced.com/cost/notion; public demand for parity ("Notion really needs to enable price parity for India. $10/user/month will not work for most startups in India" — Vaibhav Sisinty) [SS] https://x.com/VaibhavSisinty/status/1655485430698213378; and grey-market resellers selling "Notion Plus at $30/yr" [SS] https://premiumatcheap.in/product/notionplus/ — leakage that only exists where list price exceeds local WTP.

### B2. PPP pricing precedents

- **JetBrains prices India in INR at a deep regional discount** — IntelliJ IDEA Ultimate individual ~₹4,499/yr (≈$54; sources conflict, another shows ₹1,043/mo — treat exact figures as unverified) [SS] https://www.techjockey.com/detail/jet-brains-intellij-idea, https://www.oreateai.com/blog/intellij-india-pricing/. Precedent: a flagship dev-tool vendor considers India regional pricing worth operating.
- **Indie/creator PPP cases (all published by PPP vendors — bias flag)**: one creator **+15% total revenue** from enabling PPP [SS] https://www.paritydeals.com/blog/how-i-increased-revenue-by-15-just-by-offering-purchasing-power-parity-pricing/; a course creator **+320% revenue over 7 months** (low-PPP countries were 6% of sales before) [SS] https://www.paritydeals.com/blog/how-i-increased-revenue-by-offering-purchasing-power-parity-pricing/; vendor claim of "20-70% sales increase from lower-PPP regions" [SS] https://fungies.io/purchasing-power-parity-saas-pricing-2026/. Josh Comeau's specific numbers were not retrieved (searched; not found — [SS] gap).
- **Payment mechanics beat discounts**: "international payment gateways lose **30-40% of Indian customers at the checkout page** when UPI and domestic card support aren't available" [SS, vendor-biased] https://payu.in/blog/why-india-is-a-high-growth-market-for-global-saas-companies/; UPI processes 20B+ transactions/month [SS] https://grow.cleverbridge.com/blog/upi-india-saas-digital-goods. India SaaS projected to $50B ARR by 2030 [SS] https://www.bvp.com/atlas/rise-of-saas-in-india-2023.

### B3. India community signals for markdown tools

- **No organized India-specific markdown/Obsidian community surfaced** (searched Obsidian India meetups/Discords — negative result; only global figures: r/ObsidianMD 200k+ members, Obsidian Discord 110k+ [SS] https://dev.to/dev_tips/obsidian-notion-logseq-the-note-taking-stack-that-doesnt-suck-for-devs-2cf7). r/developersIndia note-taking threads were not retrievable through the search tool (reddit under-indexed in results — stated as a coverage gap, not absence of demand).
- [inference] Community-building in India for frontmatter would be greenfield rather than joining an existing markdown community — consistent with treating India as an audience/distribution play (free tier, GitHub-native workflows, the 21.9M-dev base) before a revenue play.

### B4. VERDICT — is PPP pricing worth building for launch?

**Defer building; flip on cheaply where the processor allows.** [inference over B1-B3]
1. The India macro is genuinely inflecting **right now** (Q2 2026 +35% YoY paid spend, productivity/AI-led [SS TechCrunch]) — but every WTP datapoint is consumer app-store, AI-subscription, IDE, or course revenue. **Zero category-specific evidence** that Indian individuals or teams pay for markdown editors/wikis at any price today.
2. Therefore PPP is not a launch-gating build: use **processor-level geo-pricing** (Paddle/Lemon Squeezy/ParityDeals-style toggles) on the **individual tier only**, at the ~40-60% discount band the JetBrains/indie precedents support — near-zero engineering, reversible, and the +15%/+320% indie cases say upside is real if the product finds India distribution.
3. **UPI-capable checkout matters more than the discount** (30-40% abandonment claim [SS, vendor]) — choosing a merchant-of-record that supports UPI/RuPay is the actual India decision at launch.
4. Do NOT regional-price the future team/seat tier now: no evidence supports India team-seat WTP, Notion's own refusal to parity-price hasn't stopped its India usage growth, and seat-tier PPP invites geo-arbitrage on multi-region teams. Revisit only when a Wave-2 team product exists and India signups are measurable.
5. Treat India at launch as **top-of-funnel** (largest open-source contributor base on GitHub, 5.2M new devs/yr [SS Octoverse]) feeding the free/local-first tier — aligned with the settled two-funnel GTM — with monetization following the TechCrunch-documented paid-conversion curve rather than leading it.

---

## Source-quality caveats (RULE 5)
- All pricing was obtained via search summaries; **Mintlify's pricing in particular showed three mutually inconsistent snapshots** ($150/mo Pro; $20/seat add-ons; $450-540/mo Pro) across 2025-2026 sources — verify on mintlify.com/pricing before quoting in any deliverable.
- The two job-posting percentages (63%, 72%) come from small vendor blogs with no published methodology — directional evidence of a real shift (Git-required TW roles), not citable statistics.
- getlatka revenue figures (GitBook $3.9M) and Sacra ARR figures (Mintlify $10M) are third-party estimates.
- [fetched] numbers (GitHub stars, npm weekly downloads, the Outline discussion) were observed directly on 2026-08-28 at the API URLs given inline.