Verified: `git -C ~/.claude status -- skills-src settings.json` shows 10 modified + 8 untracked entries, all pre-existing and unrelated; this subagent made 4 `Read` calls and one read-only `git status`, wrote nothing and committed nothing.

## 45. Billing operations

The decision this section settles: a monthly INR subscription is legal and workable, but the Indian rail behaves differently enough from Stripe-US/EU that copying a US billing playbook produces silent revenue loss.

### 45.1 The governing instrument

| Item | Value |
|---|---|
| Current framework | RBI, **Digital Payments – E-mandate Framework, 2026**, RBI/DPSS/2026-27/396 · RBI/CO.DPSS.POLC.No.S56/02.14.003/2026-27, **21 Apr 2026** [fetched] |
| Status of prior chain | **Repealed.** The Framework's Repeal table lists eight circulars, including CO.DPSS.POLC.No.S528/02-14-003/2024-25 of **22 Aug 2024** [fetched] |
| Superseded ceilings, do not cite | ₹2,000 (447/2019-20, 21 Aug 2019) · ₹5,000 (754/2020-21, 4 Dec 2020) · ₹15,000 (S-518/2022-23, 16 Jun 2022) · ₹1,00,000 for three categories (S-882/2023-24, 12 Dec 2023) — all four opened and all four now repealed [fetched] |

### 45.2 Rules that constrain the product, by paragraph

| Para | Rule as written | Build consequence |
|---|---|---|
| 8(a) | "All recurring transactions may be authorised **without AFA up to ₹15,000/- per transaction**." [fetched] | ₹15,000 is an **architectural constant**, not a pricing input. Any INR plan at ₹499 / ₹999 / ₹1,999 monthly auto-debits cleanly |
| 8(b) | ₹1,00,000 without AFA applies only to **insurance premiums, mutual fund subscriptions, credit card bills** [fetched] | Software is not on the list. There is no higher tier available to us |
| 4(a), 5(a) | Registration requires AFA; the **first transaction requires AFA** [fetched] | Exactly one on-session OTP/3DS at signup. Unavoidable; design the signup flow around it rather than apologising for it |
| 6(a),(b) | Issuer sends a **pre-transaction notification ≥ 24 h before debit**, naming merchant, amount, date/time, mandate reference, reason [fetched] | The renewal is announced to the customer a day early, by their bank, in the bank's words. Our renewal email must not contradict it |
| 6(c) | Customer gets a facility to **opt out of any particular transaction or the mandate** [fetched] | A churn surface that does not exist on non-Indian rails |
| 5(b) | "Payments under e-mandates shall **not be subject to any other limits/controls set by the customer**" [fetched] | Customer-set card limits cannot silently decline a mandate debit |
| 10(b) | "existing e-mandate(s) can be mapped to reissued cards" [fetched] | New in 2026. The "card expired → mandate died" involuntary-churn driver is substantially reduced in India |
| 2 | Applies to recurring transactions **"domestic or cross-border"**, cards / PPI / UPI [fetched] | Routing an Indian customer through a foreign MoR does **not** exit the framework |

### 45.3 Rail behaviour (Stripe, *India recurring payments*, [fetched])

- **Indian cards get exactly one attempt.** "Payments from India-issued cards are attempted only once. This behaviour is independent of your payment retry settings." India-issued cards also appear in Stripe's retries doc under "Stripe doesn't retry payments if". Smart Retries do not exist for Indian cards.
- **26-hour billing delay**: Stripe waits 26 h after the payment request before charging (24 h regulatory + buffer). The renewal date is not the charge date; the UI must show both.
- **UPI cannot carry recurring above ₹15,000** at all.
- **Only Visa and Mastercard** India-issued cards get mandates from Stripe. No RuPay, no Amex.
- Default mandate ceiling = the amount you set **or ₹15,000, whichever is less**. A later price rise above the mandate max forces re-authentication.

### 45.4 Cross-border card-not-present, dated

RBI, **Authentication mechanisms for digital payment transactions Directions, 2025**, RBI/2025-26/79 · CO.DPSS.POLC.No.S 668/02-14-015/2025-2026, **25 Sep 2025**, para 10: card issuers must, **by 1 October 2026**, validate non-recurring **cross-border card-not-present** transactions raised by an overseas merchant or acquirer and register BINs with the networks; a risk-based mechanism for all cross-border CNP is due the same date [fetched]. That is **33 days from 2026-08-29** [derived]. If Indian customers are billed through a foreign-acquired MoR, their first charge is a cross-border CNP and enters this regime.

- **Do this:** offer Indian customers an India-acquired path (or an MoR that acquires domestically for IN cards) before 1 Oct 2026, and instrument first-charge decline codes by issuer BIN from day one.
- **Anti-recommendation:** do not assume the MoR has handled it. Para 2 puts cross-border recurring inside the same framework [fetched]; the MoR's acquirer geography changes *which* rules bite, not *whether* they bite.

### 45.5 Pricing and dunning decisions

| Decision | Recommendation | Anti-recommendation | Falsified by |
|---|---|---|---|
| INR price ceiling | Price every Indian plan at **≤ ₹15,000 per charge** [fetched, para 8(a)] | Do **not** ship an Indian annual plan above ₹15,000 on auto-renew. It is legal, but every renewal needs on-session AFA — a manual repurchase wearing a subscription costume | RBI raising the AFA-free ceiling for software, or adding software to the 8(b) list |
| India retries | Invest in **mandate longevity**: long validity at registration, mandate max set to headroom (up to ₹15,000) not to list price, and rely on para 10(b) reissued-card mapping [fetched] | Do **not** build a retry scheduler for Indian cards. It cannot fire; you would be writing a queue the network refuses [fetched] | Stripe or NPCI publishing a retry allowance for India-issued cards |
| Non-India retries | Stripe Smart Retries, recommended default **8 tries over 2 weeks**; card updater; email at attempt 1, 3, and final [fetched] | Do not copy this ladder into the India code path | — |
| Failure UX | On a failed Indian mandate: email + in-app banner → on-session AFA re-registration → grace window before access changes | Do not make grace indefinite — R2 storage cost is real, and an unbounded free tier is a product decision made by accident | — |
| Refunds | Plain, no-questions window (7 or 14 days) | Do **not** run a "contact support first" gate. It converts refunds into disputes and buys nothing at this scale | — |

**Involuntary-churn budget** — Recurly network, July 2026 data, **annual medians** [fetched]: overall 3.60%, voluntary 2.34%, involuntary **1.25%**, software 3.04% (top quartile ≤ 1.78%), SaaS 3.22%. By ARPC: involuntary **0.18%** at $250+, **1.30%** at $10–25, overall **4.29%** at $10–25 — the worst band in the set, and the band we sell into. Involuntary as a share of total = 1.25 ÷ 3.60 = **34.7%** [derived]. Treating these as monthly overstates loss roughly 12× [fetched — the page states "median annual churn rates"].

**Recorded disagreement, unresolved:** two vendor recovery figures were surfaced — a "median 47.6% recovery rate" and a "median attempted recovery rate 12.7% across 119 US B2B SaaS companies, May 2026" — attributed to the same vendor family and not reconcilable without denominators. Neither page was opened [SS]. **Do not set a failed-payment recovery target from either.**

### 45.6 Chargebacks

Visa VAMP, launched 1 Apr 2025, replacing prior fraud/dispute programs [fetched, second-hand via an acquirer's restatement, not Visa's own publication]: merchant ratio threshold **1.5% from 1 Apr 2025**, tightening to **0.9% from 1 Jan 2026**; acquirer 0.5% → 0.3%. Ratio combines TC40 fraud and TC15 non-fraud disputes (reason codes 11, 12, 13) over settled transactions; disputes resolved via Verifi RDR are excluded. The threshold engages only once a merchant exceeds **1,000 fraud cases plus disputes per month** — at a 10,000-customer base that is 10% of customers disputing monthly, roughly two orders of magnitude above any plausible rate [derived]. Mastercard has announced no VAMP equivalent; ECP and EFM continue [fetched, same source].

### 45.7 Invoicing

| Requirement | Rule | Note |
|---|---|---|
| Serial number | **≤ 16 characters**, alphabets/numerals/`-`/`/` only, **unique for a financial year**, one or multiple series | CGST Rule 46(b) [fetched] |
| Issue window | **30 days from the date of supply of service**, not from payment | Rule 47 [fetched] |
| Mandatory fields | Supplier GSTIN; recipient GSTIN/UIN; **HSN/SAC**; description; taxable value net of discount; rate; tax split CGST/SGST/IGST/UTGST/cess; **place of supply + State name** for inter-State; reverse-charge flag | Rule 46(a),(d),(g),(h),(j)–(n),(p) [fetched] |
| Signature | **Not required** for an electronic invoice under the IT Act, 2000 | Rule 46(q) [fetched] |
| B2C | Recipient name/address/State required only at value **≥ ₹50,000** — **except** where the service is supplied by or through an e-commerce operator or by an OIDAR supplier to an unregistered recipient, where the **State name is required irrespective of value** | Rule 46(e), proviso to (f) [fetched] |
| Export | Verbatim endorsement `SUPPLY MEANT FOR EXPORT/SUPPLY TO SEZ UNIT OR SEZ DEVELOPER FOR AUTHORISED OPERATIONS ON PAYMENT OF INTEGRATED TAX` or `…UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX`, plus **name of the country of destination** | Rule 46 export proviso [fetched] |
| Void clause | An invoice issued in any other manner by a person covered by Rule 48(4) **"shall not be treated as an invoice"** — the customer's ITC dies with it | Rule 48(5) [fetched] |

**Anti-recommendation:** do **not** use a single monotonic invoice counter that never resets. Rule 46(b) demands ≤ 16 characters and uniqueness **per financial year** [fetched]; a never-resetting counter is a compliance defect that surfaces years later.

E-invoicing threshold is AATO > ₹5 crore from 1 Aug 2023, tied to the highest turnover in any FY from 2017-18 onward and not switching off when turnover falls [SS — the CBIC notification page was not opened; only Notification 78/2020-CT, the 6-digit HSN rule at AATO > ₹5 crore, is [fetched]].

### 45.8 MoR boundary

Handled by the merchant of record [fetched — Paddle: it "acts as a **reseller**… and is therefore the 'seller on record'… responsible for the collection and payment of VAT and tax instead of you"; Lemon Squeezy states the same for sales tax, refunds, chargebacks and PCI]: buyer-side indirect tax in 100+ jurisdictions including **India GST at 18%** in Paddle's own country table [fetched]; buyer-facing compliant invoices; registration-threshold tracking; chargeback and refund execution; PCI scope.

Still ours, MoR or not: our **own Indian GST position** on the supply to the MoR (export-of-services test, LUT vs pay-IGST-and-refund — a CA question) [inference]; GSTR-1, GSTR-3B, GSTR-9; e-invoicing on our export invoices once AATO > ₹5 crore; FEMA/EDPMS closure and FIRC/BRC per inward remittance [SS]; corporate tax, TDS, ROC/MCA; **DPDP Act 2023 obligations as data fiduciary** — we hold user documents and the MoR touches none of that; proration logic and plan-change semantics; dunning UX; refund *policy*; revenue recognition.

**"MoR handles GST" means the buyer's tax, not ours — two supplies, two tax positions, and only one of them is outsourced.**

### 45.9 Proration

Adopt Stripe's semantics as spec [fetched]: prorations computed **to the second** by default, granularity configurable to day/hour/week/month; credit for unused time on the old plan plus debit for remaining time on the new (the doc's worked example, £10 → £20 mid-period, yields a **£5** charge); **negative prorations are not auto-refunded and positive prorations are not immediately billed** — both default to the next invoice; prorations use the discounted price and take no further discount. India trap: an upgrade that raises the debit above the mandate max requires mandate recreation with AFA; Stripe's own guidance is to bring the customer back on-session and cancel/recreate the subscription on upgrade [fetched]. Apply the engine's discipline here — a mandate whose max is below the charge must refuse and surface, never silently retry.

### 45.10 Billing-ops founder-hours

Assumptions stated so they can be attacked, and both rates are **[inference]**, not measured — no frontmatter billing data exists yet: MoR for all sales; refund-request rate 1.5% of active base/month at 8 min each; payment-failure events 5% of renewals/month, 10% needing a human, 5 min each.

| Line item | 100 users | 1,000 | 10,000 | Basis |
|---|---|---|---|---|
| Refunds / billing support | 0.20 h | 2.00 h | 20.00 h | 1.5% × n × 8 ÷ 60 [derived] |
| Failed-payment exceptions | 0.04 h | 0.42 h | 4.17 h | 5% × n × 10% × 5 ÷ 60 [derived] |
| MoR payout ↔ ledger reconciliation | 0.5 h | 1.0 h | 1.5 h | one aggregated payout [inference] |
| GST return review (CA prepares) | 0.5 h | 0.5 h | 1.0 h | [inference] |
| Annual work amortised (GSTR-9, ITR, ROC, LUT ≈ 20 h/yr) | 1.67 h | 1.67 h | 1.67 h | 20 ÷ 12 [derived] |
| **Total** | **≈ 2.9 h** | **≈ 5.6 h** | **≈ 28.3 h** | column sums [derived] |

Regime crossings [derived]: e-invoicing at 10,000 customers triggers at ₹5,00,00,000 ÷ 10,000 = **₹5,000/customer/year ≈ ₹417/month** — almost certainly yes; at 1,000 customers it would take ₹50,000/customer/year — no. GST registration at the ₹20 lakh services threshold [SS] is crossed at 100 customers only if ARPU ≥ ₹20,000/customer/year. The 28.3 h figure excludes IRN setup and the Rule 46(r) QR code.

- **Do this:** engage the CA before 1,000 customers, not after — the marginal cost is small against the GSTR-9 and e-invoice transition.
- **Anti-recommendation:** do not build billing-ops tooling at 100 customers. 2.9 h/month is cheaper than any system we would write, and the 10,000-customer shape is unknowable today.

---

## 46. Support and deflection

### 46.1 The benchmark does not exist, and that is the finding

**No vendor publishes a per-user contact rate.** Zendesk's 2026 CX Trends is opinion survey only — 83% of consumers say experiences should be better, 88% expect faster response than a year ago, 74% expect 24/7 because of AI — and carries zero volume data [fetched]. GitLab's public handbook publishes SSAT (target 95%, actual >93%), manager-to-rep ratio <10:1, SLA attainment target 95%, Customer-Wait-Time ratio ≤35%, and **no ticket-per-user figure** [fetched]. Several benchmark pages 404'd or redirected to homepages [measured].

Substitute proxy — public-forum topic rate for two editor-class products, read live 2026-08-29 via `/about.json` [measured]:

| Forum | Topics/30d | Registered users | Topics all-time | Posts all-time | Topics per 100 forum users/mo | Posts/topic |
|---|---|---|---|---|---|---|
| forum.obsidian.md | 431 | 99,755 | 51,525 | 362,054 | **0.432** [derived] | 7.03 [derived] |
| forum.cursor.com | 2,247 | 124,080 | 49,740 | 453,684 | **1.811** [derived] | 9.12 [derived] |

Cursor's public-help rate is **4.19×** Obsidian's [derived]. Read as: an AI-mediated, non-deterministic dev tool generates about four times the public help traffic of a deterministic local-file editor at comparable forum size [inference]. These are floors, not contact rates — forum registrations are far below product users and neither counts private email.

Our own model, from §21.1: 0.02 tickets/free-user/month, 0.10/paid-user/month, 12 min each → at 10,000 users (9,600 free / 400 paid) = 9,600 × 0.02 + 400 × 0.10 = **232 tickets/month**, × 12 ÷ 60 = **46.4 founder-hours** [derived]. Blended **2.32 tickets per 100 users/month**.

### 46.2 Projected mix — and why 46.4 hours is optimistic

Empirical prior: Obsidian forum tag histogram, top 104 tags, 31,048 tagged topics [measured] — `ui-ux 3719 · dataview 3502 · custom-css 1933 · internal-links 1649 · mobile 1179 · plugin-release 900 · graph-view 894 · canvas 757 · sync 751 · templater 741 · bases 712 · publish 659 · properties 497 · importer 70 · data-loss 63`. Help is 24,106 of 51,525 topics = **46.8%** [derived]. Plugin surface (dataview + custom-css + templater + plugin-release) is 7,076 topics = **22.79%** [derived] — a class our settled no-plugin-marketplace decision deletes before it exists. **There is no `billing` tag at all** in the top 104 [measured]: billing is structurally private and must be given a private route or it lands unrouted in a personal inbox.

Shares and minutes below are **[inference]**; every product and sum is **[derived]**.

| # | Category | Share | Tickets/mo | Min | Hours/mo |
|---|---|---|---|---|---|
| 1 | How-do-I / "why does the board show this" | 30% | 70 | 8 | 9.33 |
| 2 | Sync & conflict ("where did my edit go") | 15% | 35 | 25 | 14.58 |
| 3 | BYO API keys / AI setup | 12% | 28 | 15 | 7.00 |
| 4 | Git auth (PAT expiry, SSO org grant, 2FA, SSH) | 10% | 23 | 30 | 11.50 |
| 5 | Import / foreign-vault refusal | 9% | 21 | 35 | 12.25 |
| 6 | Publishing (domain/DNS/build) | 8% | 19 | 20 | 6.33 |
| 7 | Billing / payments | 7% | 16 | 12 | 3.20 |
| 8 | Data loss / recovery panic | 4% | 9 | 90 | 13.50 |
| 9 | Platform / perf / install | 3% | 7 | 20 | 2.33 |
| 10 | Feature requests / other | 2% | 5 | 5 | 0.42 |
| | **Total** | 100% | **233** | **20.72 avg** | **80.45** |

**The flat 12-minute assumption is the error: weighted mean handle time is 20.72 minutes, so the real wall at 10,000 users is 80.45 founder-hours per month — 1.73× the PRD's 46.4** [derived: 4,827 min ÷ 60 = 80.45; 4,827 ÷ 233 = 20.72; 20.72 ÷ 12 = 1.73]. The roadmap adds precisely the long-tail categories (data loss 90 min, import 35, git auth 30) that a flat average erases.

### 46.3 Deflection plan, per category

| Category | Product change (ships once) | Content (written once) | Target deflection | Residual tickets |
|---|---|---|---|---|
| How-do-I | **Projection inspector** — every view exposes "show the bytes that produced this" | Docs page per projection, each opening with the literal source block | 70% | 21 |
| Sync & conflict | **Visible conflict state + append-only local history + one-click restore-to-timestamp.** Never silent last-write-wins | "What happens when two devices edit", with the actual byte sequence | 60% | 14 |
| BYO API keys | **Key validator at paste time** — names provider, failing scope, quota, exact remediation URL; refuse to save an unvalidated key | Per-provider setup page with a copy-paste test call | 85% | 4 |
| Git auth | **Device-flow OAuth; delete PAT support entirely.** Pre-flight the org-SSO grant and name the blocking org | "Connecting a private repo", one screenshot per provider | 80% | 5 |
| Import | **Never refuse an import.** Import everything, then show the degradation certificate inline as a per-file diff of what could not round-trip | "What we do with unusual markdown", naming the zero-indent-sequence case | 75% | 5 |
| Publishing | **DNS pre-flight** — validate the record before accepting the domain; show propagation state, not a spinner | Per-registrar CNAME page | 50% | 10 |
| Billing | **Self-serve invoice download (GST/VAT fields), self-serve cancel, self-serve card update.** No email required to leave | Pricing FAQ listing the exact decline reasons | 40% | 10 |
| Data loss | Local history makes recovery a user action, not a forensic session — handle time **90 → 30 min** even when it still becomes a ticket | "Recovering an earlier version", first result for "lost" | 70% | 3 |
| Platform/perf | Startup-time budget in CI; version + OS auto-attached to every report | Known-issues page | 30% | 5 |
| Other | — | — | 0% | 5 |

Post-deflection [derived]: 82 tickets/month; 21×8 + 14×25 + 4×15 + 5×30 + 5×35 + 10×20 + 10×12 + 3×30 + 5×20 + 5×5 = 1,438 min = **23.97 h/month**. **80.45 h → 23.97 h, a 70.2% reduction bought with engineering, not headcount.**

Already banked by settled decisions: no plugin marketplace and no arbitrary client-side execution removes **22.79%** of the Obsidian-equivalent traffic class [derived from measured] and permanently removes "my plugin broke after your update"; file-as-only-source-of-truth gives "where is my data" a filesystem-path answer; byte-preserving splice removes the diff-noise class. Highest-leverage single deflector: **run the degradation certificate on import and show it**, not only on export — it converts a 90-minute "your app broke my file" forensic ticket into a pre-answered artifact [inference].

Ship each generator with its deflector in the same release or not at all. Ranked by generation: ① sync ② BYO API keys ③ git auth ④ import ⑤ publishing ⑥ billing.

### 46.4 Tooling, prices read 2026-08-29 [fetched]

| Phase | Stack | Cost |
|---|---|---|
| Now → 1,000 users (≤23 tickets/mo [derived]) | `support@` on our domain + **GitHub Discussions** (free) + docs site. Use **category forms** — one per class (sync / import / auth / billing) that force OS, version, and a minimal repro file | **$0/mo** |
| 1,000 → 10,000 users (23 → 232 tickets/mo) | **Help Scout Standard, 1 seat, + AI Answers** ($25/user/mo; AI Answers $0.75/resolution, 3-month free trial, vendor claims 73% average) | $25 + 0.75 × 93 = **$94.60/mo** at 40% AI resolution [derived] |
| Flat-cost alternative | Crisp Essentials, 10 seats, ~450 automated conversations, $25 credits | **$95.00/mo** |

**Break-even is 93.3 AI resolutions/month** [derived: (95 − 25) ÷ 0.75] — below it Help Scout's marginal pricing wins, above it Crisp's flat price wins. Intercom at the same volume is $29 + 0.99 × 93 = **$120.87** [derived].

Vendor deflection claims, all self-reported and all opened: Fin **76%** across 12,000+ customers, 2M weekly resolutions, +1%/month, 99.8% SLA [fetched]; a named Fin customer at **50%** [fetched]; Help Scout calculator default **73%** [fetched]; Zendesk case studies **66% / 80% / 80%** [fetched]; Klarna month one, two-thirds of chats, 2.3M conversations, equivalent to 700 FTE, repeat inquiries −25%, 11 min → under 2 min, dated 27 February 2024 [fetched]. **Source disagreement, recorded not resolved:** the same vendor publishes 76% in aggregate while featuring a named customer at 50%.

- **Do this:** assume **half the vendor rate (≈38%)** until measured on our own traffic — Fin's 76% spans mostly-FAQ deployments and our mix is roughly 40% technical-state questions [inference].
- **Anti-recommendations:** do not buy Helply ($1/ticket, 250 tickets/mo minimum, **$3,000/year minimum annual contract**) — at 232 tickets/mo we pay for volume we do not have [derived]. Do not buy Pylon (no public pricing, demo-gated, enterprise motion). Do not buy Plain until the credits-per-conversation ratio is published — $35/mo with 2,000 credits is unpriceable against 232 tickets. Do not put a live-chat widget in the app: chat sets a minutes-scale expectation that a solo founder in India selling globally cannot meet, while email plus forum sets 24 h for free. Do not make Discord the support surface — not Google-indexable, so every answer is spent exactly once. **Do not let an AI agent answer data-loss or billing tickets**; hard-route both to a human path.

### 46.5 The hire trigger

Hire cost [fetched, Indeed India, "updated at 3 August 2026"]: Customer Support Coordinator average base **₹2,12,793/yr (n=452)**; live postings ₹15,000–₹39,856/month; company averages Freshworks ₹6,43,143, Accenture ₹6,10,500, Revolut ₹5,59,050. A technical support hire for a developer-adjacent editor sits at the company band [inference]. Take ₹6,00,000/yr + 20% employer load (the 20% is [inference]): ₹600,000 × 1.2 ÷ 12 ÷ 95.533851 = **$628.05/month** [derived; USD→INR 95.533851 at 2026-08-29T00:02:31 UTC, fetched].

Capacity: 160-hour month × 70% utilisation = 112 productive hours ÷ 20.72 min/ticket = **324 tickets/month** [derived]. Post-deflection residual — 82 tickets, 23.97 h — is about **25% of one FTE**, and a quarter of a person is not purchasable.

Break-even, with escalation `e = 0.35` (engine, data-loss and git-auth tickets return to the founder) and supervision `s = 8 h/month` [both inference]. Hiring wins when `(0.65 × T − 8) × V ≥ 628.05`, i.e. `T = (628.05/V + 8) / 0.65`.

| Founder hour worth `V` | Trigger `T` (h/mo) | Equivalent users, post-deflection (2.40 h per 1,000) |
|---|---|---|
| $25 | 50.96 | 21,232 |
| $50 | 31.63 | 13,180 |
| $75 | 25.19 | 10,496 |
| $100 | 21.97 | 9,154 |
| $150 | 18.75 | 7,812 |

- **Without the deflection plan** (T = 80.45 h): hiring pays at V ≥ 628.05 ÷ (0.65 × 80.45 − 8) = **$14.18/h** — hire immediately, at almost any valuation of founder time [derived].
- **With the deflection plan** (T = 23.97 h): hiring pays only at V ≥ **$82.64/h** [derived].
- **Deflection moves the trigger 5.83×** [derived: 82.64 ÷ 14.18]. That ratio, not the absolute hour count, is the decision.

Ordering is unambiguous: **product change (one-time, then $0/h) → AI resolution ($4.99 per founder-hour reclaimed) → human hire ($14.18/h floor, $628.05/mo fixed)**. The AI figure: route the three cheap-and-frequent residual classes (21 how-do-I × 8 min, 10 billing × 12, 10 publishing × 20) to an AI tier — 41 tickets × $0.99 = $40.59/month, saving 488 min = 8.13 h [derived].

Non-arithmetic overrides [inference]: hire when timezone coverage becomes a churn driver (India to US-Pacific is a 12.5 h offset and a sub-24 h first response is structurally impossible solo); when a single week's inbox blocks a release two months running; or when the hire can own billing plus how-do-I end-to-end without engine knowledge — those two classes are 31 of 82 residual tickets = **37.8%** [derived] and are the only genuinely delegable work.

Every share in §46.2 is a reasoned prior, not a measurement, and must be labelled that way wherever quoted. Replace it with measurement inside 90 days: GitHub Discussions ships category forms and discussion insights [fetched] — one category per row of the table, and the histogram is produced for us at $0.

---

## 47. Measurement

### 47.1 Why implicit-only, from our own data

| Channel | Rows | Kind |
|---|---|---|
| Explicit feedback field | **7 filled / 694 opportunities** | human-written |
| `~/.sgnk/state/*.gate-tier.json` | 21,707 [measured] | machine-written |
| `~/.sgnk/state/*.turn-meta.json` | 15,786 [measured] | machine-written |
| `~/.sgnk/traces/*.jsonl` | 5,021 [measured] | machine-written |

Fill rate 7 ÷ 694 = **1.0086%**; machine total 21,707 + 15,786 + 5,021 = **42,514**, a ratio of **6,073×** [derived]. **The load-bearing fact is not the 1% — it is that the numerator stayed frozen at 7 across three measurements, so the marginal fill rate is 0, not 1%** [derived: at a true 1.0086% flow, measurement 3 would exceed measurement 1 by 0.010086 × Δopportunities; observed Δ = 0]. The 1% is a stock left by early novelty.

The shape reproduces independently in `~/.sgnk/PREFERENCE-LOG.jsonl`, 232 rows [measured]: `prompt_hash` 0/101 (0%), `skill_version` 0/99 (0%), `routing_path` 1/99 (**1.01%**, the same number arrived at independently), `output_hash` 2/101 (1.98%) — against `timestamp` 232/232 (100%) [measured, derived]. And the one field a machine *computes*, `edit_ratio`, sits at **30/131 = 22.9%** [measured, derived].

**Design rule:** a field is only written if a machine writes it as a side effect of work the user wanted to do anyway.

### 47.2 North-star metric

**WPSD — Weekly Projection-Survived Documents.** Count of distinct documents that, in a rolling 7-day window, (1) received ≥1 mutation issued through a non-text projection (board / calendar / decision card / site), **and** (2) were still byte-valid under the degradation certificate at window close, **and** (3) had not been reverted to their pre-projection bytes.

WPSD = (foreign vaults opened) × (clean-cert rate) × (projection open rate) × (splice survival rate) [inference]. Derived from the splice ledger plus a file re-read; zero UI.

The strongest argument against it, stated so it is not forgotten: WPSD is an engine-usage metric wearing a value metric's clothes. A user who buys frontmatter purely for byte-preserving plain-text editing and never opens a projection receives the full promised value and contributes zero [inference]. Goodhart, in his own 1975 formulation: "Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes" [fetched]. The cheapest way to move WPSD is to make projections the default surface, which contradicts the settled deliberately-simple-surface constraint.

- **Guard, mandatory:** pair WPSD with a counter-metric — **Projection Abstention Rate**, the share of weekly-active users who edit files but never open a projection. Rising WPSD with falling abstention is growth; rising WPSD with **rising** abstention means the projection users are a shrinking self-selected cult and the metric is lying.
- **Revision trigger, set now:** re-open the NSM if abstention exceeds 55% for two consecutive months, or if paid-conversion correlation with WPSD drops below its correlation with plain `doc_write`.
- **Anti-recommendation:** do not treat WPSD as the strategy. Review it against abstention monthly and retain the authority to retire it.

### 47.3 Activation and retention

| | Definition | Proving event |
|---|---|---|
| **Activation** | Within 7 days of first launch: (a) opened a folder containing ≥3 `.md` files frontmatter did not author, (b) wrote to ≥1 of them with `cert_status=clean`, (c) opened ≥1 projection at least once | `foreign_vault_write` with `authored_by_us=false`, `cert_status=clean` — one event, no UI, unfakeable |
| **Retention (W4, return-with-a-file)** | Retained in week N if the user writes to ≥1 document whose `doc_first_seen_week < N`. Returning and creating only new files is **not** retention — it is a fresh trial | `doc_write` with `doc_age_weeks ≥ 1` |
| **Secondary** | Seasonal writer vs churned, invisible in DAU | `vault_reopen_after_gap` with bucketed `gap_days` |

Activation is defined on foreign vaults because the queued R0 engine work says zero-indent-sequence refusals hit **83% of foreign vaults** — a user who only creates new files never touches the failure mode that decides whether the product survives contact with reality [inference]. Do not quote any competitor's activation threshold as verified; no primary source for a specific company's number was opened [SS].

### 47.4 Event schema

| Event | Fires when | Properties | Decision it changes |
|---|---|---|---|
| `app_open` | Launch | `os`, `app_version`, `cold_start_ms_bucket` | Which OS/version to keep supporting |
| `vault_open` | Folder opened | `file_count_bucket`, `authored_by_us_ratio_bucket`, `max_depth_bucket` | Whether to fund large-vault indexing |
| `foreign_vault_write` | First write to a file we did not author | `cert_status`, `refusal_code`, `file_size_bucket` | **Activation gate**; ranks which R0 refusal to fix first |
| `cert_refusal` | Certificate refuses a save | `refusal_code`, `construct` (`zero_indent_seq`, `bare_cr`), `vault_share_affected` | Direct priority order for engine work; makes the 83% claim live |
| `cert_downgrade` | Cert passes but flags a lossy round-trip | `construct`, `severity` | Full support vs documented limitation |
| `splice_apply` | Any byte-splice lands | `splice_kind` (`human`/`ai`/`projection`), `byte_len_bucket`, `doc_id_hash`, `splice_id` | Ledger row; parent of all survival derivation |
| `splice_outcome` | T+1h / T+24h / T+7d re-read | `splice_id`, `outcome` ∈ {`accepted`,`edited`,`reverted`,`superseded`}, `edit_ratio_bucket`, `survival_bucket` | Ship or kill an AI capability |
| `projection_open` | Board/calendar/card/site opened | `projection_kind`, `doc_size_bucket` | Which projections to keep or cut |
| `projection_write` | Mutation issued via a projection | `projection_kind`, `field_kind`, `roundtrip_ok` | **NSM numerator**; catches non-reversible projections |
| `projection_abandon` | Opened, closed, zero writes, <20 s | `projection_kind` | Separates "unused" from "tried and rejected" |
| `doc_write` | Any save | `doc_age_weeks`, `doc_size_bucket`, `write_source` | **Retention gate** |
| `vault_reopen_after_gap` | Session after ≥7 idle days | `gap_days_bucket` | Seasonal vs churned; changes dunning |
| `undo_after_splice` | Undo within 60 s of a splice | `splice_kind`, `splice_id` | Fast negative signal |
| `perf_slow_op` | Any op over p95 budget | `op_name`, `duration_bucket`, `doc_size_bucket` | Where to spend perf time |
| `crash` / `engine_panic` | Unhandled fault | `stack_hash`, `op_name`, `app_version` | Hotfix trigger |
| `export_run` | Export / site publish | `target`, `doc_count_bucket`, `ok` | Whether the site projection is load-bearing |
| `license_state` | Trial→paid, paid→lapsed | `state`, `days_since_activation` | Pricing and trial length |
| `update_check` | Version check (user-disableable) | `from_version`, `to_version` | Version-support sunset dates |

Volume ceiling enforced in the emitter: `splice_apply` sampled 1-in-10 above 200/day; `doc_write` collapsed to one row per document per hour; per-DAU-day ceiling ≈ **12 events** [inference]. At 600 DAU: 600 × 12 × 30 = **216,000 events/month** [derived].

**Cut, because they change no decision:** `button_click`, `menu_open`, `settings_viewed`, `keystroke_count`, `time_in_app`; session replay, heatmaps, scroll depth (structurally impossible over a document surface without capturing content); and every NPS / thumbs / star / "was this helpful?" widget.

### 47.5 Never collect

| Never | Why |
|---|---|
| Document bytes, fragments, diffs, clipboard | We hold user documents; a leak is the whole business |
| File names, folder names, vault paths, **or their hashes** | Name hashes are re-identifiable by dictionary attack against public repos; Obsidian treats file names as needing E2E encryption even inside its own paid Sync [fetched, obsidian.md/privacy] |
| Headings, tags, front-matter keys or values | Front-matter keys are project and client names |
| Raw token counts or prose length (bucket only) | Length plus timestamp fingerprints a published artefact |
| Stable cross-install device identifiers, MAC, serial, IP beyond coarse country | ePrivacy Art 5(3) engages on terminal-equipment access regardless of whether the data is personal [fetched, EUR-Lex 02002L0058-20091219] |
| Any data from a user believed to be a child | DPDP §9(3): "A Data Fiduciary shall not undertake tracking or behavioural monitoring of children or targeted advertising directed at children" [fetched] |
| Row-level retention beyond 90 days | DPDP §8(7)(a) requires erasure once the specified purpose is no longer served [fetched] |

### 47.6 Legal basis

- **GDPR Art 6(1)(f)** legitimate interests is available for bucketed, non-identifying product telemetry with an opt-out [fetched, gdpr-info.eu/art-6-gdpr; balancing-test conclusion is inference].
- **ePrivacy Art 5(3) is the harder gate and is about the device, not personal data**: storing or accessing information on terminal equipment requires consent except where "strictly necessary in order for the provider of an information society service explicitly requested by the… user to provide the service" [fetched]. Writing a persistent analytics ID to disk is storage on terminal equipment [inference]. **Build consequence:** derive the install ID from a rotating, salted, non-recoverable value regenerated every 90 days, and surface a first-run toggle. Whether a rotating local ID falls inside the strict-necessity carve-out is contested and unresolved here — the CNIL audience-measurement exemption page timed out twice [measured, curl exit 28].
- **DPDP applies regardless of where we sell.** §3(b) extends the Act to processing outside India "in connection with any activity related to offering of goods or services to Data Principals within the territory of India" [fetched, DPDP Act 2023, No. 22 of 2023, assent 11 Aug 2023]. Selling globally from India engages both limbs.
- **§7(a) does not help.** "Certain legitimate uses" covers data the Data Principal "has voluntarily provided"; telemetry is not voluntarily provided, so **§4(1)(a) consent** is the realistic Indian basis [fetched + inference]. India is stricter than GDPR here — there is no legitimate-interests limb for analytics.
- **Timeline:** DPDP Rules 2025 notified **14 November 2025** with an eighteen-month phased compliance period and 6,915 consultation inputs [fetched, PIB, 17 Nov 2025]. 14 Nov 2025 + 18 months = **14 May 2027** [derived]. Gazette number cited as G.S.R. 846(E) [SS].
- **Penalties (Schedule, §33):** up to **₹250 crore** for failure of reasonable security safeguards (§8(5)); **₹200 crore** for breach-notification failure (§8(6)); **₹200 crore** for children obligations (§9); **₹150 crore** for Significant Data Fiduciary obligations (§10) [fetched].

### 47.7 What privacy-focused competitors actually collect

| Product | Stated collection | Document date |
|---|---|---|
| **Obsidian** | "We do not collect any personal data." / "We do not collect any telemetry data." All app data local. Update check exists and is disableable. Sync is E2E-encrypted **including file names**. Plugin directory policy **prohibits** client-side telemetry | "Last updated November 1, 2023" [fetched] |
| **Bear** | Personal data collected: **email address only**. No app-telemetry section exists at all | No last-updated date exposed [fetched] |
| **iA Writer** | Writer notice: "Writer does not collect your personal data." Separate Analytics notice: "we periodically collect and store limited device, operating system, app, and **feature usage data**. None of the collected information identifies you personally." | Both "Last revised: September 26, 2025" [fetched] |

**Source disagreement, recorded not resolved:** iA publishes two notices that pull against each other, both dated 26 Sep 2025 [fetched]. That is the most useful competitive fact available — the most design-purist competitor in this exact niche does collect implicit feature-usage telemetry and survives saying so in plain words [inference]. Obsidian's page separately serves two stacked policies, the current one (1 Nov 2023) and an older Dynalist Inc. policy (11 Dec 2020) invoking PIPEDA, without stating which governs [fetched].

### 47.8 Stack and cost

| Option | Price read 2026-08-29 | Verdict |
|---|---|---|
| **PostHog Cloud** | Free tier **1M events/month**, 5K replays, 1M flag requests, 1-year retention, 1 project, no card [fetched] | **Phase 1.** 216,000 ÷ 1,000,000 = **21.6%** of allowance, 4.63× headroom [derived] → **$0/mo** |
| **Own store: Cloudflare Workers + object storage** | Workers Paid **$5/mo** minimum, 10M requests included, +$0.30/M [fetched] | **Phase 2.** 216,000 ÷ 10,000,000 = **2.16%** [derived] → **$5/mo**; add Supabase Pro from $25/mo if SQL is wanted [fetched] |
| PostHog self-hosted | MIT, needs "4 vCPU, 16GB RAM, and more than 30GB storage"; vendor-stated **"officially unsupported"**, no tagged releases, no CVEs [fetched] | **Reject.** DO 4 vCPU/16 GB from $0.181/hour × 730 = **$132.13/mo** [derived] plus solo ops time |
| OpenPanel Cloud | 250K events $30/mo, 500K $50, 1M $90; self-host free [fetched] | Viable fallback, correct event shape |
| Plausible / Fathom | Plausible 100k pageviews $19/$29/$39; Fathom 500,000 pageviews **$45/month** [fetched] | **Anti-recommendation** — pageview-shaped, no per-document survival model; Fathom is ~9× OpenPanel at this volume [derived] |

- **Do this:** phase 1 PostHog Cloud free tier at $0/mo, with the emitter written against a four-field internal interface so the backend swaps in a day. Phase 2 trigger: either >1M events/month, or the first enterprise buyer who refuses a third-party processor.
- **Open item, blocking:** PostHog EU-region residency was **not confirmed**. Confirm before sending a single event, because DPDP §8(2) requires a valid contract with any Data Processor [fetched].
- **Anti-recommendations:** never ship a thumbs-up/down, star rating, NPS prompt, or "was this edit helpful?" widget — 7-in-694 is the in-house, highly-motivated-user ceiling for that pattern and a paying stranger will do worse. Do not build an in-product feedback text field of any kind; route qualitative signal to a support inbox the user initiates. Do not add session replay or heatmaps at any price, including PostHog's included 5K recordings — the surface being replayed is the user's document. Do not hash file names or paths and call it anonymised.

### 47.9 AI accept / edit / revert, derived from the document

The engine already does byte-preserving splice edits, so the ledger needed to derive this **already exists**. No rating UI, ever.

1. At apply time, `splice_apply` records `{splice_id, doc_id_hash, byte_offset, byte_len, inserted_hash, prefix_hash, suffix_hash, splice_kind, model_id, ts}` — hashes only, on-device.
2. At T+1h, T+24h, T+7d, on the next natural file read (no background scanning), classify locally:

| Outcome | Test |
|---|---|
| `accepted` | Bytes at the range still hash to `inserted_hash` |
| `edited` | Range present, hash differs, normalised edit distance ≤ 0.5 |
| `reverted` | Bytes gone **and** `prefix_hash` + `suffix_hash` rejoin to the pre-splice hash |
| `superseded` | Bytes gone and context does **not** match pre-splice — the user rewrote into something new |

3. Emit only `{splice_id, outcome, edit_ratio_bucket, survival_bucket, splice_kind, model_id, doc_size_bucket}`. Never bytes, never raw distance.
4. The one real signal is `accepted_at_7d` per `model_id` and per `splice_kind`. Rising `edited` with falling `reverted` means close-but-wrong — a prompt fix. Rising `reverted` means kill the capability.
5. Validate the T+24h classifier against `undo_after_splice` within 60 s, which is a same-session proxy available immediately.

---

## 49. Open source, documentation and community

### 49.1 Licence per artifact

Current state: **the repo has no `LICENSE` file and `package.json` has no `license` field** [measured] — the default is therefore "all rights reserved", which is the worst possible position for a spec we intend others to implement. Every runtime dependency is MIT — `unified@11.0.5`, `remark-parse@11.0.0`, `micromark@4.0.2`, `@codemirror/state@6.6.0`, `next@16.2.6`, `react@19.2.6` [measured 2026-08-29] — so no copyleft obligation constrains any choice below.

| Artifact | Licence | Reasoning | Anti-recommendation |
|---|---|---|---|
| **App** (Next 16 + Tauri client, sync, billing) | **Proprietary, closed.** Publish a plain-English data-portability promise instead of source | Nothing about the app is a credibility claim; all deps are MIT so there is no obligation to open [measured] | Do **not** BUSL the app. BUSL's Change Date — capped at the **4th anniversary of first public distribution of that version** [fetched] — forces eventual publication of source we never intended to publish. Openness cost, none of the trust benefit |
| **Engine** (splice, OffsetMap, refusal logic) | **Apache-2.0** | Explicit patent grant plus trademark reservation; the only asset whose value *rises* with third-party verification; permissive keeps it embeddable in the MIT ecosystem it already sits in [measured] | Do **not** use FSL or BUSL here. FSL 1.1's Competing Use clause bars anything with "same or substantially similar functionality" [fetched] — exactly the independent reimplementation that would prove the engine correct. Both also convert anyway (FSL 2 years → Apache-2.0 or MIT; BUSL ≤ 4 years) [fetched] |
| **Certificate CLI** | **Apache-2.0**, same repo as the engine | A certifier nobody can run is not evidence. It must be installable in CI at zero friction | Do **not** gate the CLI on a licence key (the Elastic-2.0 mechanic, which forbids circumventing licence-key functionality [fetched]) — key-gating a *verification* tool destroys the artifact's purpose |
| **Format spec** (session-interchange) | **Prose: CC-BY 4.0.** Conformance test-suite and reference parser: **Apache-2.0.** Add a one-line "no patent assertion against conforming implementations" pledge | Satisfies all three requirements simultaneously: copy-the-text-into-your-docs, implement-without-patent-risk, no ShareAlike on the implementation. W3C Software and Document License 2023 is the single-instrument alternative — copy/modify/distribute for any purpose, no fee, with full NOTICE and notice of changes [fetched] | Do **not** use CC-BY-SA — CommonMark 0.31.2 (2024-01-28) uses it [fetched], and ShareAlike on spec prose deters the vendors we need to adopt it. Do **not** use CC0 — we lose the attribution that makes the spec a distribution channel |
| **Certificate dataset** | **CC-BY 4.0** for the data; keep the generation harness Apache-2.0; retain raw run artefacts privately | Attribution is the entire marketing mechanism — a cited dataset is a permanent backlink | Do **not** licence it non-commercially (PolyForm-NC) — the competitors we certify are commercial, and a non-commercial dataset cannot be quoted in their release notes [fetched terms]. **ODbL is the anti-choice.** Do not publish per-vendor "fail" verdicts without a documented dispute path and a stated methodology version |
| **Repo hygiene** | Add root `LICENSE`, set `package.json.license`, add per-directory `LICENSE` for engine / CLI / spec | No licence file exists anywhere today [measured] | Do **not** apply one licence at repo root and assume it covers the spec prose — mixed-licence repos need per-path declaration |

**The engine's value is verifiability, not secrecy: a byte-preserving engine that "refuses rather than guesses" is only credible if a third party can run the refusal cases, and a degradation certificate is a claim about other people's software, which is a marketing asset when unauditable and evidence when auditable.**

Cloning risk is low: the moat is R2/Workers sync, Tauri packaging, auth, billing, and the certificate corpus — none of which live in the engine [inference].

### 49.2 The reversal record, and why the restrictive licences do not apply

| Case | Sequence | Read |
|---|---|---|
| Redis | Redis Stack split → **SSPL March 2024** → **AGPLv3 with Redis 8**; antirez rejoined Nov 2024 [fetched] | Reverted in roughly 14 months |
| Elastic | ELv2/SSPL 2021 → **AGPL added as a third option, Aug 2024**; founder states the OpenSearch fork was foreseen and "market confusion has been (mostly) resolved" three years later [fetched] | Survived, with a funded fork permanently attached |
| HashiCorp | BUSL 2023 → OpenTofu, now Linux Foundation, **3,900+ providers, 23,600+ modules, v1.12.0** [fetched 2026-08-29] | Community transplanted off the vendor in months |

Restrictive relicensing of *infrastructure others embed* reliably produces a funded fork, and two of three majors then partially reverted [derived from the three fetched sources]. None of these firms is a solo-founder desktop editor; the hyperscaler free-rider threat that justifies BUSL and SSPL does not exist for a markdown editor [inference].

**Consolidated licence anti-recommendations:** do not BUSL or SSPL anything. Do not use PolyForm Small Business — its self-assessed thresholds (**<100 total people**, **<USD 1,000,000 (2019) revenue**, inflation-adjusted [fetched]) are unenforceable by a solo founder in India against a global user base. **Do not claim "open source" for anything but the Apache-2.0 artifacts** — Redis's own post records OSI's position that SSPL "lacks the requisites" [fetched], and loose usage is the reputational failure mode in exactly this community. Source-availability disagreement recorded and not reconciled: Elastic's founder frames its licence change as correct in hindsight; Redis frames its own SSPL period as something to move on from [both fetched].

### 49.3 Documentation

Diátaxis, as published [fetched]: four kinds — tutorials, how-to guides, reference, explanation — with the compass mapping informs-action + acquisition → tutorial, informs-action + application → how-to, informs-cognition + application → reference, informs-cognition + acquisition → explanation. The author's own instruction is to apply it to something small.

| Quadrant | Pages | Priority | Cost |
|---|---|---|---|
| **Reference** | Splice contract; **refusal catalogue** (every REFUSE with its byte-level cause); certificate schema; CLI flags; session-format spec | **P0** — this is the purchase input for the beachhead ICP | ~12 pages, generated from tests where possible |
| **Explanation** | "The file is the only source of truth"; why reversible projection; why we refuse rather than guess; what a degradation certificate does and does **not** claim | **P0** | ~6 pages, hand-written, low churn |
| **How-to** | Run `mdmax cert` in CI; certify a vault; migrate from Obsidian; recover a refused edit | P1 | ~8 pages |
| **Tutorial** | One 15-minute "certify your first vault" | P2 | 1 page |

- **Generate the refusal catalogue from the test fixtures.** A hand-maintained catalogue drifts, and drift here is a credibility failure, not a typo [inference].
- Docs-as-code, in-repo, PR-gated: block the merge when a refusal code changes without a reference-page update [fetched, Write the Docs]. The repo already carries **159 markdown files under `docs/`** across `adr/`, `engine/`, `mdmax/`, `research/`, `build/` [measured] — engineering notes, not user docs.
- **Maintenance cost, measured proxy** — `obsidianmd/obsidian-help`: **175 English `.md` under `en/`**, **6,357** all-locale markdown files (a **36.3×** localisation multiplier), **83 commits in the 90 days since 2026-05-31** = **0.92/day**, = **0.47 commits per English page per quarter** [measured + derived]. A 30-page English site at that churn ≈ 14 doc commits/quarter ≈ one per week; at 30 min each, **~2 h/month steady-state**, plus a one-off build cost of ~60 h at 2 h/page spread over 8–10 weeks [inference].
- **Anti-recommendations:** do **not** localise — a 36.3× file multiplier for zero ICP value [derived]. Do **not** write the tutorial before the reference exists — Diátaxis's own advice is to start small and applied [fetched]. Do **not** host docs on a separate CMS; it decouples them from the merge gate that keeps them true.
- **Honest limit:** the "documentation is a purchase input for dev-tool buyers" claim could not be verified — the Stack Overflow Developer Survey 2025 page is client-rendered and yielded 271 characters of extractable text [measured]. Every claim in that vein is [SS]/[inference], not fact. What survives as reasoning: for frontmatter the load-bearing doc is not a tutorial, it is **"what will this tool refuse to do, and why"** — the refusal contract *is* the product claim [inference].

### 49.4 Community

| Platform | Cost read 2026-08-29 | Indexed | Moderation burden | Verdict |
|---|---|---|---|---|
| **GitHub Discussions** | $0 | Yes, permanent, Google-indexed | **Lowest** — same identity and block/report as the repo; categories and marked answers [fetched] | **Buy (it is free).** Co-located with spec, CLI and issues |
| Discourse hosted | **$100/mo** Pro (5 staff seats), **$500/mo** Business (15 seats); free plan exists [fetched] | Yes | Medium — categories, trust levels, a mod team | Premature pre-revenue: $1,200–$6,000/yr [derived] for a room that will be empty |
| Discord | $0 | **No** | **Highest** — synchronous, always-on, instant-reply expectation | **Do not open one.** Worst ratio of durable value to founder hours |
| Reddit | $0 | Yes | Low, and no control either | Distribution channel, not a home |

Load model, from the Obsidian forum's own 30-day numbers [fetched 2026-08-29]: **3,629 active users, 956 participating, 2,921 posts, 432 topics, 1,330 likes** → 3.06 posts per participating user/month and 26.3% of active users posting at all, the 90-9-1 shape, measured [derived]. At 1% of that volume: 29 posts × 3 min triage = **~1.5 h/month**; at 10%: 292 posts = **~15 h/month** — the point where a solo founder is choosing between the community and the engine [derived, assumption stated]. Discord has no equivalent floor: presence scales with hours online, not posts — Obsidian's Discord showed **presence_count 20,851 online** at fetch time [measured].

| Phase | Surface | Time cap | Trigger to advance |
|---|---|---|---|
| 0 (now) | GitHub Discussions on the **spec/engine/CLI** repo only; categories: Spec, Refusals, Certificates, Q&A | **2 h/week**, batched into two fixed windows | — |
| 1 | Publish certificate results as a versioned dataset; invite conformance-case PRs | +1 h/week | ≥10 external conformance cases |
| 2 | Reddit and Obsidian-forum *participation* — answer, do not recruit | 1 h/week | Certificates cited by a third party |
| 3 | Discourse at $100/mo | — | Only when Discussions exceeds ~150 posts/mo [derived from the 3 min/post model] |

Written policy from day one: response-time expectation ("weekdays, within 2 business days"), scope ("spec and engine here; app support by email"), and a conflict-of-interest note on certificate disputes. Do not promise 24 h response. Do not run a community launch, a docs site and a licence launch in the same month.

Positioning against the incumbent community: Obsidian's commercial licence is now **optional** — "No. You are not required to pay for a commercial license… we encourage you to purchase" [fetched 2026-08-29], with Sync $4/user/mo annual ($5 monthly), Publish $8/site/mo annual ($10 monthly), Commercial $50/user/year, Catalyst $25. The norm there is voluntary payment for a **closed app with open files**, so a closed frontmatter app is not a norm violation; a proprietary *format* would be [inference]. Frontmatter cannot use the plugin route — no marketplace, no arbitrary client-side execution (settled) — so the only compounding artefact available is **certificates and conformance cases contributed against the spec** [inference]. Obsidian's own compounding assets, for scale: **7,062 community plugin entries and 716 themes** [measured 2026-08-29, `"id":`-key occurrence count, a proxy not a parsed record count]. Entering as "the tool that refuses to corrupt your vault, and here is the proof for the other tools too" is a contribution; entering as "Obsidian but better" is a fight with 7,062 plugins.

### 49.5 Sequencing against engine work

The three tracks compete directly with the R0 engine queue: ~60 h docs build + ~2 h/month docs upkeep + ~8 h/month community is the same budget as the queued zero-indent-sequence refusals, bare-CR handling, and SAFE_KEY addressability. Ordering that minimises contention [inference]: **licence files first (~2 h, unblocks everything)** → reference docs generated from tests (amortised into engineering) → GitHub Discussions at a 2 h/week cap → dataset publication → only then explanation and tutorial prose. The strongest coupling is licence ↔ docs: an Apache-2.0 engine only earns trust if the refusal catalogue is public, and the licence is what makes the docs quotable by the ICP. Unverified and flagged: OWFa 1.0 terms and PolyForm Shield 1.0.0 terms were not opened (empty response and a GitHub-Pages 404 respectively) [measured], and all Reddit community sizes are unverified — Reddit's JSON API refused both user-agents attempted [measured].
