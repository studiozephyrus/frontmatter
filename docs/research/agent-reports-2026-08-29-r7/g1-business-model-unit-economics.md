### SOURCE BASIS AND TAG LEGEND
- `[fetched]` = primary page opened by `curl` on 2026-08-29 from this machine (India IP). `[SS]` = search summary carried from the three grounding reports, unverified. `[derived]` = computed here, arithmetic shown.
- `curl` reaches every host tested once the command sandbox is disabled (sandboxed `curl` returned `http=200 bytes=0`, exit 56, for non-allowlisted hosts). WebFetch remains gate-refused; this does not limit source access (LR#70).
- Working FX **₹95.4/USD**. Live: **95.39** [fetched api.frankfurter.app 2026-08-28] and **95.592676** [fetched open.er-api.com, updated Fri 28 Aug 2026 00:02:31 UTC]. Confirms c4's ₹95.4 correction of the brief's ₹83.

### 1. UNIT ECONOMICS PER TIER
Inputs: ₹299/₹599/₹699/₹2,499 are **GST-inclusive** (India B2C convention) → base = price/1.18. GST 18% on SaaS, SAC 9983 `[SS — cbic-gst.gov.in rate index opened [fetched] but rates live in PDF schedules, not resolvable]`. Razorpay **2% + 18% GST on the fee** `[fetched razorpay.com/pricing: "Razorpay charges 2% + GST per transaction", zero setup, zero AMC, 0% platform fee first 90 days, custom pricing above ₹5L/mo; UPI carries no bank fee but "a standard platform or technology fee of 2%"; one product-grid line reads "Platform fee 2.15% + GST"]`. Infra per paid user **$0.153/mo** at 1,000-user scale `[derived, §2]`. Inference cap $0.40/mo (Pro) / $1.00 (Power).

| Tier | Gross | Rail | Fee | GST out | Net rev | Inference | Infra | Contribution | % gross | % net |
|---|---|---|---|---|---|---|---|---|---|---|
| India Pro ₹299/mo | ₹299 | Razorpay | ₹7.06 (2.36%) | ₹45.61 | **₹246.33 ($2.582)** | ₹38.16 | ₹14.62 | **₹193.55** | 64.7% | 78.6% |
| India Pro ₹299/mo, cheap-model default ($0.15) | ₹299 | Razorpay | ₹7.06 | ₹45.61 | ₹246.33 | ₹14.31 | ₹14.62 | **₹217.40** | 72.7% | 88.3% |
| India Pro ₹299/mo | ₹299 | Dodo MoR (IN) | ₹27.77 (9.29%) | MoR remits | **₹225.62 ($2.365)** | ₹38.16 | ₹14.62 | ₹172.84 | 57.8% | 76.6% |
| India Pro ₹2,499/yr → /mo | ₹299-equiv | Razorpay | ₹58.98/yr (2.36%) | ₹381.20/yr | ₹171.57/mo | ₹38.16 | ₹14.62 | ₹118.79 | 39.7% | 69.2% |
| India Power ₹599/mo | ₹599 | Razorpay | ₹14.14 | ₹91.37 | ₹493.49 ($5.173) | ₹95.40 | ₹14.62 | ₹383.47 | 64.0% | 77.7% |
| India Power ₹699/mo | ₹699 | Razorpay | ₹16.50 | ₹106.63 | ₹575.88 ($6.036) | ₹95.40 | ₹14.62 | ₹465.86 | 66.6% | 80.9% |
| World Pro $5/mo | ₹477 | Paddle/LemonSqueezy 5%+50¢ | $0.75 (15.0%) | MoR | $4.25 | $0.40 | $0.153 | **$3.697** | 73.9% | 87.0% |
| World Pro $5/mo | ₹477 | Dodo US 4%+40¢+0.5% sub | $0.625 (12.5%) | MoR | $4.375 | $0.40 | $0.153 | $3.822 | 76.4% | 87.4% |
| World Pro $48/yr → /mo | ₹477 | Paddle | $2.90/yr (6.04%) | MoR | $3.758/mo | $0.40 | $0.153 | $3.205 | 64.1% | 85.3% |
| World Power $10/mo | ₹954 | Paddle | $1.00 (10.0%) | MoR | $9.00 | $1.00 | $0.153 | $7.847 | 78.5% | 87.2% |
| World Power $90/yr → /mo | ₹954 | Paddle | $5.00/yr (5.56%) | MoR | $7.083/mo | $1.00 | $0.153 | $5.930 | 59.3% | 83.7% |
| Work $50/yr flat → /mo | ₹397.50 | Paddle | $3.00/yr (6.0%) | MoR | $3.917/mo | $0 | $0.153 | $3.764 | 90.3% | 96.1% |
| Free (BYO-key) | ₹0 | — | ₹0 | — | ₹0 | **$0 by construction** | $0.0112 | −₹1.07 | — | — |

**CONTRADICTION — Dodo's India flat fee.** c4 states "Dodo Payments (MoR) = 4% + $0.40… the flat $0.40 alone is 12.7%" of ₹299 `[SS]`. dodopayments.com/pricing `[fetched]` splits it: **US domestic cards/wallets 4% + 40¢**; **"Domestic (India – INR) Local Debit / Credit Cards and UPI payments in India — 4% + 15c + international payment fees"**. $0.40 = **12.76%** of ₹299; $0.15 = **4.79%** `[derived: 0.40×95.4/299, 0.15×95.4/299]`. The flat-fee argument for annual billing survives but is roughly 2.7× weaker for India-domestic UPI than c4 computed. Both readings recorded; they disagree.

**Dodo full fee grid `[fetched]`:** Standard 4%+40¢ · international (non-US cards/APMs) **+1.5%** · BNPL (Klarna/AfterPay/ClearPay) **+3%** · PayPal **+3%** · ACH (US) 1.5% capped $15 · SEPA 1.5% capped €15 (replaces card fee) · Subscriptions/addons/usage **+0.5%** (competitors 0.7%) · Invoicing included (else 0.4%) · Tax management in 190+ countries included (else 0.5%) · Analytics included (else $10/mo) · BYOP 0.5% (else 0.75%+10¢) · Storefront included (else 5%) · License keys included (else 4–5%) · cart/dunning/retry recovery free to enable (else 5% of recovered) · international wire settlement **$25** · adaptive currency 80+ currencies, merchant pays 0%, **2–4% FX charged to the customer**.
**Paddle `[fetched]`:** **5% + 50¢ per Checkout transaction**; its own comparison column prices a PSP stack at "~7% and above" (tax registration/filing/remittance +0.5%; churn recovery $0.02–$0.07; subscription billing up to 3.9%; international card payments up to 4.4%; chargebacks/fraud up to 0.4%; localized checkout 2.9%).
**Lemon Squeezy `[fetched]`:** **5% + 50¢**, no monthly fee, 16 payment methods, 95 currencies, MoR for VAT/sales tax; site banner "2026 Update: Lemon Squeezy + Stripe Managed Payments"; fees can exceed 5%+50¢ in edge cases.

### 2. COST STRUCTURE AT 100 / 1,000 / 10,000 USERS
**Stated assumptions `[derived]`:** 4% free→paid. 9,000 HTTP requests/user/mo; 8 CPU-ms/request. Storage 20 MB/free user, 250 MB/paid user. R2 ops 900 Class A + 9,000 Class B per user/mo. Hosted inference only for paid users, capped $0.40. Support: 0.02 tickets/free-user/mo, 0.10/paid-user/mo, 12 min/ticket.
**Rate card `[fetched]`:** Cloudflare Workers Paid **$5/mo account minimum**, 10M requests included then **+$0.30/M**, 30M CPU-ms included then **+$0.02/M CPU-ms**, no charge for duration, max 5 min CPU/invocation, static-asset requests free and unlimited; Free plan 100,000 req/day, 10 ms CPU/invocation. R2 Standard: storage **$0.015/GB-month**, Class A **$4.50/M**, Class B **$0.36/M**, **egress free**; Infrequent Access $0.01/GB-month, A $9.00/M, B $0.90/M, retrieval $0.01/GB; free tier 10 GB-month + 1M A + 10M B; usage rounds **up** to the next billing unit.

| Line | 100 users (4 paid) | 1,000 users (40 paid) | 10,000 users (400 paid) |
|---|---|---|---|
| Workers requests | 900K — included | 9M — included | 90M → 80M over × $0.30 = **$24.00** |
| Workers CPU-ms | 7.2M — included | 72M → 42M over × $0.02 = $0.84 | 720M → 690M over × $0.02 = **$13.80** |
| Workers subtotal | $5.00 | $5.84 | $42.80 |
| R2 storage | 2.92 GB — free tier | 29.2 GB → 19.2 billable = $0.29 | 292 GB → 282 billable = **$4.23** |
| R2 Class A | 90K — free | 900K — free | 9M → 8M × $4.50 = **$36.00** |
| R2 Class B | 900K — free | 9M — free | 90M → 80M × $0.36 = **$28.80** |
| Egress | **$0.00** | **$0.00** | **$0.00** |
| Infra subtotal | **$5.00** | **$6.13** | **$111.83** |
| Hosted inference (paid × $0.40) | $1.60 | $16.00 | $160.00 |
| **Total variable** | **$6.60** | **$22.13** | **$271.83** |
| Per paid user (infra only) | $1.250 | $0.153 | $0.280 |
| Per free user (96% request share) | — | — | $0.0112/mo (₹1.07); 9,600 free users = **$107.36/mo** |
| Support load | 2.3 tickets/mo = 0.5 founder-hr | 23.2 = 4.6 hr | **232 tickets/mo = 46.4 founder-hr** |
| Payment rails | % of revenue, §1 | % of revenue, §1 | % of revenue, §1 |
| Gross MRR, 70IN/30World mix | ₹1,410 ($15) | ₹14,096 ($148) | ₹140,960 ($1,478) |

- **Egress-free R2 is the load-bearing architectural choice**: a document workspace's dominant byte flow is reads; on any egress-billing store this line is the largest single cost.
- The **$5/mo Workers account minimum dominates until ~1,000 users** — infra per paid user is 8.2× worse at 100 users than at 1,000 `[derived: 1.250/0.153]`.
- **Support, not compute, is the wall.** 46.4 founder-hours/month at 10,000 users, before any sales, marketing, or engineering.
- Not modelled (each `[SS]`, and each a real line): domain ~$12/yr, transactional email, error monitoring, a paid AI-gateway/observability layer, refunds/chargebacks, and the founder's own tooling.

### 3. FUNNEL MATH
**Benchmarks, all `[fetched] lennysnewsletter.com "What is good free-to-paid conversion", Kyle Poyar, survey of 1,000+ products:**
- Freemium **self-serve: GOOD 3–5%, GREAT 6–8%** (Canva, Trello, Typeform).
- Freemium **with sales-assist: GOOD 5–7%, GREAT 10–15%** (Airtable, GitLab, HubSpot).
- **Free trial: GOOD 8–12%, GREAT 15–25%** (Shopify, Google Workspace, Intercom).
- **Sign-up rate: freemium 9% vs free-trial 5%.** 44% of free-trial companies have sales contact >half of sign-ups, vs 24% of freemium.
- Distribution: 20% of freemium products convert **below 2.5%**; 33% sit **2.5–5%** (the modal bucket); ~15% exceed 20%. Free-trial: only 7% below 2.5%; ~24% in 7.5–10% (modal); 14% reach 20%.
- **"The median conversion rate for developer-focused companies was 5%; this was half that of companies that do not sell to developers."** ← directly governs frontmatter, whose ICP-1 is dev-tool startups `[c3]`.
- Cross-check `[fetched] userpilot.com`: freemium **3–9%**, targeted trials 10–20%, self-serve signup 10–15%, credit-card-required trials 25–35%; "60–80% of total drop-off concentrates in one or two leaky steps."

**Requirement at each milestone `[derived]`.** Gross ARPU: mix A (70% India ₹299 / 30% World $5) = **₹352.40**; mix B (30/70) = **₹423.60**; 100% World $5 = ₹477; 100% India = ₹299. Cumulative signups, **zero churn assumed** — with churn, gross adds must exceed these.

| Milestone | ARPU basis | Paid users | Free @3% | Free @5% (dev median) | Visitors @9% signup (from 5% col) |
|---|---|---|---|---|---|
| ₹1L/mo ($1,048.22) | mix A ₹352 | 284 | 9,459 | 5,675 | 63,060 |
| ₹1L/mo | mix B ₹424 | 236 | 7,869 | 4,721 | 52,460 |
| ₹1L/mo | 100% India ₹299 | 334 | 11,148 | 6,689 | 74,322 |
| ₹5L/mo ($5,241.09) | mix A | 1,419 | 47,295 | 28,377 | 315,298 |
| ₹5L/mo | mix B | 1,180 | 39,345 | 23,607 | 262,302 |
| ₹5L/mo | 100% World $5 | 1,048 | 34,941 | 20,964 | 232,937 |
| ₹20L/mo ($20,964.36) | mix A | 5,675 | 189,179 | 113,507 | 1,261,193 |
| ₹20L/mo | mix B | 4,721 | 157,381 | 94,429 | 1,049,208 |
| ₹20L/mo | 100% India ₹299 | 6,689 | 222,965 | 133,779 | 1,486,436 |

- Verdict: **₹1L/mo is typical-rate reachable** (284 paid at dev-median 5% = 5,675 free signups). **₹5L/mo requires ~28,000 free signups** — plausible for a well-distributed dev tool. **₹20L/mo requires 113,507 free signups at the dev median and ~1.26M cumulative visitors** — that is a distribution problem, not a pricing problem, and it is the point where the plan stops being solo-founder-shaped.
- The India-only column is the worst on every row: 6,689 paid vs 4,193 for the same ₹20L at 100% World $5 — **59.5% more paying humans for identical revenue** `[derived: 6689/4193]`. This is the arithmetic behind c4's "distribution India-first, revenue global-first".

### 4. REVENUE MODEL OPTIONS

| Model | Fit | Risk | Support-load effect |
|---|---|---|---|
| **Subscription (settled plan)** | High — matches Obsidian Sync/Publish, HackMD, GitBook, Craft; funds continuous engine work | Churn is monthly; India monthly economics punished by flat fees (§1); competes with subsidised India AI (ChatGPT Go ₹399 then free, Gemini ₹199→₹399, Perplexity free via Airtel `[SS]`) | Highest per-₹ — every subscriber has a standing claim on the founder |
| **Flat perpetual / optional licence (Obsidian model)** | High for the Work SKU. Live: app free without limits, Catalyst **$25 one-time**, Commercial **$50/user/yr and explicitly NOT required** `[fetched obsidian.md/pricing]`; primary self-host demand exists (`outline/outline#6802` asks for a one-time lifetime self-host licence, citing plane.so/one) `[fetched, n=3, per e3]` | No recurring revenue floor; ties revenue to acquisition forever | **Lowest** — buyer expectation is "supported, not serviced". 90.3% contribution `[derived §1]` |
| **Usage / credits** | High for frontier AI; makes COGS ≤ revenue by construction. Live precedent: Mintlify **$0.01 per credit** overage, 10,000 credits/mo on Pro `[fetched]`; GitBook Ultimate caps AI answers at 500/mo `[SS c3]` | Meter anxiety suppresses use of the differentiating feature; billing disputes | Medium — generates "why was I charged" tickets, the worst per-ticket category |
| **Seat-based B2B** | Medium-high on the same .md substrate; anchors $5–$25/seat (Confluence $5.42, Notion $10/$20, Trainual ~$25) `[SS/fetched]` | Pulls toward the SSO/SCIM/SOC-2 procurement gauntlet a solo founder cannot service `[c3 §5, e3 A5]` | High and lumpy — one buyer, many users, all escalating through one contact |
| **Marketplace / templates** | Medium — near-zero marginal cost, community-built | Requires community that does not exist yet; India markdown community is **greenfield, no organised India Obsidian meetup/Discord found** `[SS e3 B3]` | Low direct, high indirect (curation, refunds, quality policing) |
| **Services** | Low-medium — migration/setup for churners off Confluence/GitBook | Non-scaling; consumes exactly the founder-hours §2 says are the binding constraint | Extreme — services IS support |

**Explicit anti-recommendations, preserved from source:** do NOT bundle unlimited AI at any INR price `[c4]`. Do NOT enter India's subsidised-AI price war `[c4]`. Do NOT regional-price a future team/seat tier — no India team-seat WTP evidence, and it invites geo-arbitrage on multi-region teams `[e3 B4]`. Do NOT blend the published-docs buyer and the team-wiki buyer into one plan — if you ever sell publishing, **price the site, not the seat** `[e3 A5]`. Do NOT lead with the deflection/data pitch; it is the incumbent pitch `[c3]`. Do NOT build enterprise KB / SSO / SCIM / SOC 2 before there is a team or capital `[c3 §5]`. Do NOT ship ₹699/mo — c4 pushes back on it "hardest"; ₹599 or a flat ₹3,999/yr commercial licence instead.

### 5. MOAT AND DEFENSIBILITY (ranked by hold-time)

| Rank | Moat | Holds | What erodes it |
|---|---|---|---|
| 1 | **Community / plugin ecosystem** | Years, compounding | Nothing external — but it is the slowest to build and does not exist yet; India is greenfield `[SS e3 B3]`; global anchors are r/ObsidianMD 200k+ and Obsidian Discord 110k+ `[SS]` |
| 2 | **Byte-fidelity engine (splice writer)** | 18–36 months | An incumbent shipping a byte-exact/CRDT writer; the work is hard but finite and increasingly LLM-assistable. GitBook's dominant complaint cluster is *reliability / lost work* `[SS e3 A1]` — the gap is real today |
| 3 | **Degradation certificate** | 12–24 months as an exclusive; longer as a category standard | Commoditisation — which is also the win condition if frontmatter sets the standard. Zero defensibility if the certificate is not independently checkable |
| 4 | **Provenance / AI-vs-human byte attribution** | 12–24 months | Platform-level content credentials shipping natively; compliance vendors extending downward (Vanta/Drata sell audit trails at **$7K–$30K/yr** `[SS c3]`; one vendor case cut a sales cycle **4 months → 6 weeks** `[SS c3]`) |
| 5 | **Brand** | Slow to build, durable once built | Naming risk already flagged `[e6]`; "frontmatter" is also the name of the substrate — `gray-matter` alone does **35,782,970** npm downloads/month `[fetched api.npmjs.org, 2026-07-29→08-27]`, so the term is generic in the buyer's own vocabulary |
| 6 | **File-native data / no lock-in** | Structural, but non-exclusive | Every markdown tool claims it; the free self-hosted field is large and active `[fetched api.github.com 2026-08-29]`: AppFlowy **76,040** ★, AFFiNE **71,976**, SiYuan **46,023**, Logseq **44,669**, Outline **40,362**, Trilium **37,624**, Docmost **21,501** — all pushed within the last 24h |
| 7 | **Switching cost** | **Near zero, by design** | This is the anti-moat: the portability that earns trust removes lock-in. Retention must be earned every month by the product, not by hostage-taking |

### 6. COMPETITIVE PRICING TABLE (all `[fetched]` 2026-08-29 unless marked)

| Product | Price | What the buyer gets |
|---|---|---|
| **Obsidian** | App free without limits, no sign-up. Sync **$4/user/mo annual, $5 monthly**. Publish **$8/site/mo annual, $10 monthly**. Catalyst **$25 one-time**. Commercial **$50/user/yr, optional** | E2E-encrypted sync, version history, shared-vault collaboration; Publish = hosted site, custom theme, graph + full-text search |
| **HackMD** | Free (3 teammates, 3 invitees, 20 GitHub pushes/mo, 1 MB images, 400 API calls/mo). **Prime $5/seat/mo billed annually ("Save 37.5%" ⇒ $8 monthly); Total $15/mo for 3 seats.** Enterprise: quote | Full-text search, 20 MB images, PDF export, unlimited versions/invites/pushes/templates, 20K API calls/mo. Enterprise adds RBAC, SSO (SAML/LDAP), custom domain, self-hosting. "1,000,000+ people" |
| **GitBook** | Free $0/site. **Premium $65/site/mo + $12/user/mo**. **Ultimate $249/site/mo + $12/user/mo** (both annual-billed). Enterprise: quote | Free: block editor, GitHub/GitLab sync, API playgrounds, preview deploys, LLM optimisations. Premium: team, AI search, custom domain, analytics. Ultimate: AI Assistant, AI insights, GitBook Agent, adaptive content, authenticated access, sections/groups, Slack/Linear/GitHub channels |
| **Mintlify** | Starter **$0** (5 editor seats). **Pro $450/mo**. Enterprise: quote. Credits: Pro 10,000/mo, **$0.01/credit** overage | Starter: full platform, custom domain, web editor, auth, MCP server, API playground. Pro: unlimited seats, Agent Assistant, automations, preview deployments, admin APIs. Enterprise: **SSO, SCIM & RBAC**, SLA, advanced insights. "Join 20,000+ companies" |
| **Outline (cloud)** | **$10/mo (1–10 members) · $79/mo (11–100) · $249/mo (101–200)**; annual available; 30-day free trial then read-only; 30% non-profit/education discount; >200 users: contact | Feature list on the same page: unlimited docs + version history, realtime co-editing, comments/@mentions, AI Q&A, multi-language translation, **SSO authentication**, 20+ integrations, templating, groups/permissions, API + webhooks, **security audit log**. Per-tier gating of SSO not resolvable from the page; e3's "SSO in the cheapest $10 plan" stays `[SS]`. Self-hosted free; licence **NOASSERTION** `[fetched api.github.com]` |
| **Notion** | Free $0 · **Plus $10/member/mo** · **Business $20/member/mo** · Enterprise: quote. Yearly "save up to 20%" | Free: databases, Notion Calendar, basic sites/forms, AI trial. Plus: custom forms/sites, unlimited charts/blocks/uploads, basic connections. Business: Notion Agent, AI Meeting Notes, Enterprise Search (beta), **SAML SSO**, granular DB permissions, private teamspaces, premium connections. Enterprise: SCIM, audit log, zero data retention, CSM |
| **Notion India pricing** | **None.** Page served to this India IP contains **zero `₹`/`INR`** strings; toggle reads "Price in USD" | Confirms `[SS e3/c4]` "Notion has no India regional pricing" — now `[fetched]` |
| **Craft** | **India-geo-priced**: Free ₹0 (1,500 blocks, 1 GB, 25 MB media, 15 AI credits). **Plus ₹658.3/mo monthly, ₹526.7/mo yearly**. Family ₹1,233 / ₹986.7 (2–6 accounts). **Team ₹3,792/mo** (up to 10 accounts) | Plus: unlimited blocks/storage/media, 30-day history, shared Space (via Family), **50 AI credits/mo**, AI models Core/Fast/**Max**, API & MCP 100 req/min + 20,000 blocks/min. Own comparison: "Other apps total $46/month" |
| **Ulysses** | **$39.99/yr or $5.99/mo**; student discount; Apple Family Sharing (5 others); volume licensing outside the App Store | Mac/iPad/iPhone, full iCloud sync, updates via App Store |
| **iA Writer** | **One-time: Mac $49.99 · Windows $29.99 · iPhone & iPad $49.99 — per platform.** 7-day trial, no card. 20% education discount | Explicit: "One Time ≠ Lifetime… minor updates free, major updates may incur costs." Self-described bootstrapped indie |
| **Statuspage (public pages)** | Free (100 subscribers, 25 components, 2 members) · **Hobby $29/mo** · **Startup $99/mo** · **Business $399/mo** · **Enterprise $1,499/mo** | Subscribers 250/1,000/5,000/25,000; members 5/10/25/50; SMS/webhook from Startup; SSO (with Atlassian Guard) from Startup; custom CSS/HTML/JS + RBAC from Business |
| **Document360** | **Quote-only** — no prices on the pricing page | Historically $99 / ~$249 / $499 per project/mo + ~$19/extra seat `[SS c3]`. Live page lists SSO & SCIM, workflow builder, AI Premium Suite, Support Ticket Deflector, Eddy AI |
| **Confluence** | Not extractable — page is JS-rendered (53 chars of text) | `[SS]` Standard **$5.42/user/mo**, Premium **$10.44**; raises effective **2025-10-15**: Standard +5%, Premium +7.5%, Enterprise +7.5–10%, on a 12–18-month cadence |
| Nuclino / Slite / Trainual / Helpjuice / LaunchNotes / Beamer / PagerDuty PA / Rootly / Vanta-Drata | `[SS]` $6–8 & $10–12.50 / $8 & $20 (free plan removed at June 2026 relaunch) / Core $249/mo per 10 seats ≈ $24.90 + $3–5/seat + $1,000 impl / $120–$799 / Growth $249/mo / $49–$249 by MAU / **$125/user/mo** + platform fee / from $25/user/mo / $7K–$30K/yr | Carried unverified from c3/e3 |

**Consolidation wedge, recomputed `[derived]`:** Mintlify Pro **$450** + GitBook Premium **$65/site** + Statuspage Business **$399** + LaunchNotes Growth **$249** `[SS]` = **$1,163/mo**, plus 5 users × $12 GitBook = **$1,223/mo**. c3 computed **$963/mo** using Mintlify at $250; the $260 delta is entirely Mintlify's repricing. Lighter stack: Mintlify Starter $0 + Statuspage Hobby $29 + Beamer $49 `[SS]` = **$78/mo**. Both recorded; the "$380–960/mo four-tool stack" figure in c3 is now low at the top end and high at the bottom end.

**Other live contradictions with the grounding reports:**
- **Mintlify.** c3: "Pro $250/mo incl. 5 seats + 250 AI credits" `[SS]`. e3: three inconsistent snapshots ($150 / $20-per-seat / $450–540) `[SS]`. Live `[fetched]`: **Pro $450/mo; Starter free with 5 editor seats; 10,000 credits/mo on Pro; $0.01/credit**. e3's $450 snapshot wins; c3's $250 is stale.
- **HackMD.** e3: "$8/member/mo monthly, $4/mo annual ($48/yr)" `[SS]`. Live `[fetched]`: **$5/seat/mo billed annually**, "Save 37.5%" ⇒ $8 monthly. The annual price is $5, not $4; c4's "$5" is right.
- **Obsidian Publish is per SITE, not per user** `[fetched]` — c4's world table uses $8–10 as a "power/publish band" anchor without that distinction.
- **Claude Sonnet 5 is $2/$10 per MTok, not $3/$15** `[fetched docs.claude.com]`; the page states the introductory price is now standard and **"the previously scheduled increase to $3/$15 per million input/output tokens on September 1, 2026 will not occur."** c4's frontier assumption of ~$3/$15 is 50% too high.
- **No "Gemini 2.5 Flash $0.15/$0.60" SKU exists on the live price list** `[fetched ai.google.dev]`; the cheapest current text model is **Gemini 3.1 Flash-Lite $0.25 in / $1.50 out**.
- **DeepSeek V4-Flash $0.22/$0.66 is the OFF-PEAK rate** `[fetched api-docs.deepseek.com]`; peak is **$0.44/$1.32** (peak = 01:00–04:00 and 06:00–10:00 UTC, Mon–Fri). c4 quotes only the off-peak number.

**Live inference cost ceiling `[derived]`, one assist = 3,000 in + 700 out:**

| Model (in/out per MTok) `[fetched]` | $/assist | Assists per $0.40 | Heavy assist (25K in + 2K out) | Heavy per $0.50 |
|---|---|---|---|---|
| DeepSeek V4-Flash off-peak $0.22/$0.66 | $0.001122 | **356.5** | $0.00682 | 73.31 |
| DeepSeek V4-Flash peak $0.44/$1.32 | $0.002244 | 178.3 | $0.01364 | 36.66 |
| Gemini 3.1 Flash-Lite $0.25/$1.50 | $0.001800 | 222.2 | $0.00925 | 54.05 |
| Gemini 3.5 Flash-Lite $0.30/$2.50 | $0.002650 | 150.9 | $0.01250 | 40.00 |
| Gemini 3.7 Flash $0.75/$3.75 (to 2026-12-31; **$1.50/$7.50 from 2027-01-01**) | $0.004875 | 82.1 | $0.02625 | 19.05 |
| Claude Haiku 4.5 $1/$5 | $0.006500 | 61.5 | $0.03500 | 14.29 |
| Claude Sonnet 5 $2/$10 | $0.013000 | 30.8 | $0.07000 | 7.14 |
| Claude Opus 5 $5/$25 | $0.032500 | 12.3 | $0.17500 | 2.86 |
| Claude Fable 5 $10/$50 | $0.065000 | 6.2 | $0.35000 | 1.43 |

- **Prompt caching is the single largest COGS lever for a document workspace** (same file re-sent every turn). Cache-hit rates `[fetched]`: Haiku 4.5 **$0.10/MTok**, Sonnet 5 **$0.20**, Opus 5 **$0.50**, Gemini 3.7 Flash **$0.075** (+ $0.50/1M tokens/hour storage), DeepSeek V4-Flash **$0.007** off-peak. Cached heavy assist `[derived]`: Sonnet 5 **$0.025 vs $0.070 uncached = 2.8×** more assists per rupee (20 vs 7.14 per $0.50); Haiku 4.5 $0.0125 vs $0.035 (40 vs 14.29). 5-minute cache **write** at 25K tokens costs $0.0625 (Sonnet 5) / $0.03125 (Haiku 4.5) — caching pays from roughly the second reuse onward.
- **Tokenizer tax `[fetched]`:** "Claude 4.7 and later models and Claude Mythos Preview use a newer tokenizer… produces approximately 30% more tokens for the same text." Any per-token budget set on a pre-4.7 model understates cost on 4.7+ by ~30%.
- **Free-tier inference is genuinely $0 only under BYO-key.** Gemini's own free tier is "free of charge" but "content used to improve our products" — a fact the free tier must disclose, not hide.

### 7. KEY BUSINESS RISKS AND MITIGATIONS

| Risk | Mitigation |
|---|---|
| India's AI price is set by loss-leaders a bootstrapped studio cannot match (ChatGPT Go ₹399 → free; Gemini ₹199 → ₹399; Perplexity free via Airtel to ~400M Airtel users, worth ₹17,000/yr) `[SS c4]` | Never bundle unlimited AI. Free = BYO-key unmetered, $0 COGS. Pro = small allowance on a cheap model with a **visible $ meter**; frontier = BYO-key or metered pass-through at cost-plus. Compete on the engine, not on subsidised tokens |
| Flat per-transaction fees destroy low-ticket INR monthly | Lead annual (₹2,499/yr = ₹208/mo). Fee falls from 9.29% to **5.07%** on Dodo `[derived]`. Razorpay-domestic already only 2.36% — the flat-fee argument is much weaker there, and weaker again now that India-domestic Dodo is 4%+15¢ not 4%+40¢ |
| UPI absence kills India checkout — international gateways lose **30–40% of Indian customers at checkout** without UPI/domestic cards `[SS, PayU, vendor-biased]` | Split rails: **Razorpay for India** (2%, native UPI, founder owns GST) + **a MoR for the world** (Dodo 4%+40¢ / Paddle 5%+50¢). Or single UPI-capable MoR (Dodo). UPI availability > the discount |
| GST compliance: 18% on SaaS, registration mandatory **from the first transaction** for inter-state/export supply `[SS]` | MoR (Dodo/Paddle/LemonSqueezy) is seller of record and removes the burden entirely — the fee delta *is* the compliance price |
| Model-price regime change | Already visible: **Gemini 3.7 Flash doubles on 2027-01-01** ($0.75→$1.50 in, $3.75→$7.50 out) `[fetched]`; DeepSeek reserves the right to adjust and prices peak at 2× off-peak. Meter in dollars, not "credits pegged to a model"; keep a swappable model router; cache aggressively |
| Support becomes the binding constraint at 232 tickets/mo `[derived §2]` | Build deflection into the product (the KB you sell is the KB you use); prefer licence/perpetual SKUs whose buyer expectation is "supported, not serviced"; delay per-seat B2B until there is a second human |
| Procurement gauntlet (SSO/SAML/SCIM/SOC 2 as the universal deal-blocker; the "SSO tax" pattern) `[SS c3/e3]` | Stay in self-serve B2B (2–20 people, card, no procurement). Treat SSO as a later monetisation lever. Evidence is split: e3 favours copying Outline (SSO cheap, as a wedge) early; c3 favours gating it — record the disagreement |
| Free self-hosted substitutes are strong and active — Docmost 21,501★ AGPL, Outline 40,362★, AppFlowy 76,040★, AFFiNE 71,976★, SiYuan 46,023★, Logseq 44,669★, Trilium 37,624★, all pushed 2026-08-28 `[fetched]` | $5–8/seat must be justified by what self-hosting cannot cheaply give: zero-ops, provably lossless editing, the certificate |
| Zero India WTP evidence for markdown/note tools (honest negative across six searches) `[SS e3]`; grey-market Notion resale at "$30/yr" proves list price exceeds local WTP `[SS]` | Treat India as top-of-funnel. **New counter-evidence `[fetched]`: Craft already INR-prices India at ₹526.7–₹658.3/mo** — a direct competitor has decided the India individual price is ~1.8–2.2× ₹299, which both validates INR pricing and questions whether ₹299 leaves money on the table |
| Naming: "frontmatter" is the generic name of the substrate | Flagged in `[e6]`; `gray-matter` 35.78M/mo, `front-matter` 18.41M/mo, `js-yaml` 1,228,031,655/mo `[fetched]` — SEO and trademark both contested by the category's own vocabulary |

### 8. WHAT WOULD MAKE THIS FAIL COMMERCIALLY — THE HONEST LIST
- **Distribution, not price, is the binding constraint.** ₹20L/mo needs ~113,507 free signups and ~1.26M cumulative visitors at the dev median `[derived §3]`. Nothing in the pricing design moves that number.
- **Developers are the hardest freemium audience there is.** Median free→paid for developer-focused companies is **5% — half the rate of non-developer companies** `[fetched Lenny/Poyar]`. frontmatter has chosen the hard half deliberately.
- **The moat with the shortest hold-time is the one the product is named after, and the one with zero hold-time is switching cost.** A file-native product cannot hold a user it stops delighting.
- **India monetisation may simply not arrive.** Zero category-specific WTP evidence `[SS e3]`; the AI price floor is being driven to zero by subsidised incumbents `[SS c4]`; ₹299 nets **$2.58** `[derived]` versus $4.25 for the identical feature at $5.
- **The AI feature is a cost centre that competitors give away.** ~2.86 heavy Opus-5 assists exhausts $0.50 `[derived]`. If users expect frontier quality bundled, the tier is unbuildable at ₹299 and the meter reads as stinginess.
- **Support at 10,000 users (46.4 founder-hours/month) collides with being solo** — before marketing, before engineering, before sleep. The product either deflects its own tickets or the founder becomes support staff.
- **Byte-fidelity may be a claim no buyer prices.** GitBook's lost-work complaints prove the pain exists `[SS e3 A1]`; they do not prove anyone pays a premium to avoid it. If "provably never loses a keystroke" reads as table stakes rather than a feature, the entire technical differentiator is unmonetisable and the product is competing on editor taste against Obsidian's free tier.
- **Pricing volatility above and below.** Mintlify moved $150 → $250 → $450 `[SS + fetched]`; Confluence raises every 12–18 months `[SS]`; Outline sells 10 seats for $10/mo `[fetched]` and Docmost sells zero seats for $0. frontmatter is being squeezed from both ends of a market whose middle keeps moving.
- **Concentration on one founder in one jurisdiction.** GST registration from the first inter-state/export transaction, RBI e-mandate rules, MoR dependence, and a single point of engineering failure are all one-deep.
- **Nothing above has been tested on a real customer.** Every conversion, churn, ticket-rate, storage, request, and CPU figure in §1–§3 is an assumption stated explicitly so it can be replaced by measurement. None of it is `[measured]`.