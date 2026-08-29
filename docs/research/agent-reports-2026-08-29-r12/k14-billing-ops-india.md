### Evidence ledger — what was opened here

| Source | Access | Date read |
|---|---|---|
| RBI, **Digital Payments – E-mandate Framework, 2026**, RBI/DPSS/2026-27/396 · RBI/CO.DPSS.POLC.No.S56/02.14.003/2026-27, 21 Apr 2026 | `curl` → rbi.org.in `FS_Notification.aspx?Id=13374` | 2026-08-29 [fetched] |
| RBI, **Authentication mechanisms for digital payment transactions Directions, 2025**, RBI/2025-26/79 · CO.DPSS.POLC.No.S 668/02-14-015/2025-2026, 25 Sep 2025 | `curl` → `BS_ViewMasDirections.aspx?id=12898` | 2026-08-29 [fetched] |
| RBI circulars 447/2019-20 (21 Aug 2019, ₹2,000), 754/2020-21 (4 Dec 2020, ₹5,000), S-518/2022-23 (16 Jun 2022, ₹15,000), S-882/2023-24 (12 Dec 2023, ₹1,00,000 for 3 categories) | `curl` Id=11668 / 12002 / 12341 / 12570 | 2026-08-29 [fetched] — **all now repealed** |
| CGST Rules 46, 47, 48, 54 (full text incl. amendment footnotes) | `curl -k` → taxinformation.cbic.gov.in | 2026-08-29 [fetched] |
| Stripe: *India recurring payments*, *Prorations*, *Automate payment retries* | `curl` docs.stripe.com | 2026-08-29 [fetched] |
| Recurly Research churn benchmarks, **July 2026 network data** | `curl` recurly.com | 2026-08-29 [fetched] |
| Paddle: MoR/reseller structure; country tax table (India GST 18%); Lemon Squeezy MoR page | `curl` paddle.com, docs.lemonsqueezy.com | 2026-08-29 [fetched] |
| Visa VAMP thresholds | `curl` docs.acquired.com (an acquirer's restatement, **not** Visa's own publication) | 2026-08-29 [fetched, second-hand] |
| **Unreachable:** npci.org.in (HTTP 403 WAF, 3 URLs, browser UA), fasb.org (403), mca.gov.in (403), cbic-gst.gov.in (broken TLS chain; works only with `-k`) | — | 2026-08-29 [measured] |

---

### 1. What must appear on an invoice

**B2B, Indian customer — CGST Rule 46, verbatim clause list** [fetched]

| Clause | Requirement |
|---|---|
| (a) | Supplier name, address, **GSTIN** |
| (b) | Serial number, **≤ 16 characters**, one or multiple series, alphabets/numerals/`-`/`/` only, **unique for a financial year** |
| (c) | Date of issue |
| (d) | Recipient name, address, **GSTIN or UIN** |
| (g) | **HSN code for goods or services** (SAC lives in HSN Ch. 99) |
| (h) | Description |
| (j)(k)(l)(m) | Total value; taxable value net of discount; rate; **amount of tax split CGST / SGST / IGST / UTGST / cess** |
| (n) | **Place of supply + name of the State**, for inter-State supply |
| (o) | Address of delivery where different from place of supply |
| (p) | Whether tax is payable on **reverse charge** |
| (q) | Signature / digital signature — **not required** for an electronic invoice under the IT Act, 2000 |
| (r) | **QR code embedding the IRN**, where the invoice was issued under Rule 48(4) |
| (s) | Negative declaration ("we are not required to prepare an invoice under Rule 48(4)") if AATO in any FY from 2017-18 exceeded the notified e-invoice threshold but the invoice is not an IRN invoice |

- Time limit: **30 days from the date of supply of service** (Rule 47) [fetched]. Not 30 days from payment.
- Rule 48(5): an invoice issued by a person covered by 48(4) in any *other* manner **"shall not be treated as an invoice"** — i.e. once you cross the e-invoice threshold, a non-IRN invoice is legally void, and your customer's ITC dies with it [fetched].

**B2C changes** [fetched]
- Clause (e): recipient name/address/State + code required **only if value ≥ ₹50,000**. Below that, only on request (clause (f)).
- **Exception that catches SaaS:** the proviso to (f) — where a taxable service is supplied *by or through an e-commerce operator, or by an OIDAR supplier, to an unregistered recipient*, the invoice must carry the **State name of the recipient irrespective of value**, and that is deemed the address on record.
- Consolidated daily invoice permitted for unregistered recipients who don't want one (proviso to Rule 46, s.31(3)(b) route).

**Export changes** [fetched]
- Endorsement, verbatim, one of: `SUPPLY MEANT FOR EXPORT/SUPPLY TO SEZ UNIT OR SEZ DEVELOPER FOR AUTHORISED OPERATIONS ON PAYMENT OF INTEGRATED TAX` **or** `…UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX`.
- In place of clause (e): recipient name & address, address of delivery, **name of the country of destination**.
- E-invoicing covers **exports**, not only domestic B2B [SS].

**Thresholds** — e-invoicing mandatory at **AATO > ₹5 crore**, from **1 Aug 2023**, Notification 10/2023-Central Tax; obligation is tied to the *highest* turnover in any FY from 2017-18 onward and does not switch off when turnover falls [SS — CBIC notification page not opened; einvoice1.gst.gov.in only yielded Notification 78/2020-CT, the 6-digit HSN rule for AATO > ₹5 crore, which *is* [fetched]]. AATO ≥ ₹10 crore adds a **30-day IRN reporting window** from 1 Apr 2025 [SS].

---

### 2. RBI recurring mandates — the decision-relevant part

**The whole prior chain is repealed.** The 2026 Framework's Repeal table lists eight circulars, including one from **22 Aug 2024 (CO.DPSS.POLC.No.S528/02-14-003/2024-25)** that this research never opened. Current instructions = the 2026 Framework alone [fetched].

**Verdict: a monthly INR subscription is NOT invalidated. It works, with named frictions.**

| Rule (2026 Framework, para) | Text | Effect on frontmatter |
|---|---|---|
| 8(a) | "All recurring transactions may be authorised **without AFA up to ₹15,000/- per transaction**." | Any monthly price ≤ ₹15,000 auto-debits cleanly. A ₹499/₹999/₹1,999 monthly plan is fully compliant. Annual plans up to ₹15,000 also clear. [fetched] |
| 8(b) | ₹1,00,000 without AFA only for **insurance premiums, mutual fund subscriptions, credit card bills** | Software is **not** in the list. Hard ceiling for frontmatter is ₹15,000/charge. [fetched] |
| 4(a), 5(a) | Registration requires AFA; **first transaction requires AFA** | One on-session OTP/3DS at signup. Unavoidable. [fetched] |
| 6(a),(b) | Issuer must send a **pre-transaction notification ≥ 24 h before debit**, naming merchant, amount, date/time, mandate ref, reason | Your renewal is announced to the customer a day early, by their bank, in the bank's words. [fetched] |
| 6(c) | Customer gets a facility to **opt out of any particular transaction or the mandate** | India-specific churn surface that does not exist on Stripe-EU/US rails. [fetched] |
| 5(b) | "Payments under e-mandates shall **not be subject to any other limits/controls set by the customer**" | Customer-set card limits cannot silently decline a mandate debit. [fetched] |
| 10(b) | **"existing e-mandate(s) can be mapped to reissued cards"** | New in 2026. The classic "card expired → mandate died" involuntary-churn driver is substantially reduced in India. [fetched] |
| 2 | Applies to recurring transactions **"domestic or cross-border"**, cards/PPI/UPI | Routing an Indian customer through a foreign MoR does not exit the framework. [fetched] |

**Rail-level consequences** [fetched, Stripe *India recurring payments*]
- **Indian cards get exactly one attempt.** "Payments from India-issued cards are attempted only once. This behaviour is independent of your payment retry settings." Stripe's retries doc independently lists India-issued cards under "Stripe doesn't retry payments if". **Smart Retries do not exist for Indian cards.**
- **26-hour billing delay**: Stripe waits 26 h after the payment request before charging (24 h regulatory + buffer). Your renewal date is not your charge date.
- **UPI cannot carry > ₹15,000 recurring** at all, per Stripe.
- **Only Visa and Mastercard** India-issued cards get mandates from Stripe — no RuPay, no Amex.
- Default mandate ceiling = the amount you set **or ₹15,000, whichever is less**. A later price rise above the mandate max forces re-authentication.

**Dated, imminent, and easy to miss:** Authentication Directions 2025 para 10 — card issuers must, **by 1 October 2026**, validate non-recurring **cross-border card-not-present** transactions raised by an overseas merchant/acquirer, and register BINs with networks; a risk-based mechanism for *all* cross-border CNP is due the same date [fetched]. That is **33 days from today, 2026-08-29** [derived: `date -j` difference, computed here]. If Indian customers are billed through a foreign-acquired MoR, their first charge is a cross-border CNP and enters this regime.

- **Recommendation:** price Indian monthly plans at ≤ ₹15,000 and treat ₹15,000 as an architectural constant, not a pricing input.
- **Anti-recommendation:** do **not** offer an Indian annual plan above ₹15,000 on auto-renew. It is legal, but every renewal requires on-session AFA — that is a manual repurchase wearing a subscription costume, and it will read as a billing bug to the customer.

---

### 3. Dunning and involuntary churn

**Benchmarks — Recurly network, July 2026 data** [fetched]

| Metric (annual, median) | Value |
|---|---|
| Overall churn | 3.60% |
| Voluntary | 2.34% |
| Involuntary | 1.25% |
| Software, overall | 3.04% (top quartile ≤ 1.78%) |
| SaaS, overall | 3.22% |
| Involuntary at $250+ ARPC | **0.18%** |
| Involuntary at $10–25 ARPC | **1.30%** |
| Overall at $10–25 ARPC | 4.29% (worst band in the set) |

- These are **annual**, not monthly. Treating them as monthly overstates loss ~12×. [fetched — the page states "median annual churn rates"]
- **Recorded disagreement, unresolved:** a search summary attributed to Baremetrics/Slicker a "median 47.6% recovery rate" *and*, from the same vendor, a "median attempted recovery rate 12.7% across 119 US B2B SaaS companies, May 2026". These are not reconcilable without the denominators. Neither page was opened. [SS] — do not plan against either number.
- Paddle's oft-quoted "involuntary churn = 20–40% of total churn" [SS] is directionally consistent with Recurly's 1.25/3.60 = **34.7%** [derived: 1.25 ÷ 3.60].

**Plan**

| Rail | Ladder |
|---|---|
| Non-India cards (MoR/Stripe) | Smart Retries, recommended default **8 tries / 2 weeks** [fetched]; card-updater; email at attempt 1, 3, final |
| **India cards** | **No retry ladder exists.** One attempt, then a *re-mandate* flow: email + in-app banner → on-session AFA to re-register → grace window |
| UPI Autopay | Same one-shot logic; NPCI's own limit documentation was **unreachable (403)** — do not quote UPI Autopay caps without a primary read [measured] |

- **Recommendation:** for India, invest in **mandate longevity**, not retries — long mandate validity at registration, mandate max set well above list price (headroom to ₹15,000), and rely on para 10(b) card-reissue mapping.
- **Anti-recommendation:** do not build a custom retry scheduler for Indian cards. It cannot fire; you would be writing a queue that the network refuses. Do not copy a US dunning playbook wholesale.
- **Recommendation:** grace period before revoking document access, since the file is the customer's own work.
- **Anti-recommendation:** do not make grace indefinite — R2 storage cost is real and an unbounded free tier is a different product decision made by accident.

---

### 4. MoR: handled vs. still yours

**Handled by the MoR** [fetched — Paddle: "Paddle acts as a **reseller** of your product, and is therefore the 'seller on record'… responsible for the collection and payment of VAT and tax instead of you"; Lemon Squeezy: MoR "responsible for handling all payments… collecting sales tax, processing refunds and chargebacks, and ensuring PCI compliance"]

- Buyer-side indirect tax in 100+ jurisdictions, incl. **India GST at 18%** in Paddle's own country table [fetched]
- Buyer-facing compliant invoices; registration-threshold tracking
- Chargeback and refund handling as the merchant of record
- PCI scope

**Still 100% yours, MoR or not**
- Your own **Indian GST position**: the MoR is a customer, and your supply to it is a separate supply. If it qualifies as export of services (recipient outside India, consideration in convertible foreign exchange, etc.), it is zero-rated and needs an **LUT** — otherwise IGST is payable. **CA question.** [inference, from Rule 46 export endorsement text [fetched] + the reseller structure [fetched]]
- Monthly/quarterly **GSTR-1 and GSTR-3B**, annual **GSTR-9**; e-invoicing on your export invoices once AATO > ₹5 crore
- **FEMA / EDPMS closure, FIRC or BRC** per inward remittance [SS — not verified against an RBI primary here]
- Corporate income tax, TDS, ROC/MCA filings, transfer pricing if any related party
- **DPDP Act 2023** obligations as data fiduciary — you store user documents; the MoR touches none of that [fetched: the Authentication Directions expressly bind *issuers* to DPDP, which does not transfer any obligation to you]
- Proration logic, plan-change semantics, dunning UX, refund *policy* (the MoR executes; you decide)
- Revenue recognition in your books

- **Recommendation:** use an MoR for global, and keep exactly one Indian output invoice per month (to the MoR).
- **Anti-recommendation:** do not assume "MoR handles GST" means your Indian GST. It handles the *buyer's* tax. Two different supplies, two different tax positions.

---

### 5. Refunds, chargebacks, proration

**Proration — Stripe's semantics, worth adopting as spec** [fetched]
- Prorations computed **to the second** by default; granularity configurable to day/hour/week/month.
- Mechanics = credit for unused time on the old plan + debit for remaining time on the new. Worked example in the doc: £10 → £20 mid-period yields a **£5** charge.
- **Negative prorations are not auto-refunded; positive prorations are not immediately billed** — both default to the next invoice unless you act.
- Prorations use the **discounted** price; proration line items themselves take no further discount.

**India-specific proration trap:** an upgrade changes the debit amount. If the new amount exceeds the mandate max, the mandate must be recreated with AFA. Stripe's own guidance is to bring the customer back on-session and cancel/recreate the subscription on upgrade [fetched].

**Chargebacks — Visa VAMP** [fetched, second-hand via docs.acquired.com]
- Launched 1 Apr 2025, replaced prior fraud/dispute programs. Merchant ratio threshold **1.5% from 1 Apr 2025**, tightening to **0.9% from 1 Jan 2026**; acquirer 0.5% → 0.3%.
- Ratio combines TC40 fraud + TC15 non-fraud disputes (reason codes 11, 12, 13) over settled transactions; **disputes resolved via Verifi RDR are excluded**.
- **The threshold only applies once a merchant exceeds 1,000 fraud cases + disputes per month.** At 10,000 customers with a normal dispute rate, frontmatter never reaches the floor [derived: 1,000 disputes/month against a 10,000-customer base = 10%/month, ~2 orders of magnitude above any plausible rate].
- Mastercard: no VAMP-equivalent announced; ECP and EFM continue [fetched, same source].

- **Recommendation:** a plain, no-questions refund window (7 or 14 days), because a refund costs the price; a chargeback costs the price **plus** a fee plus ratio.
- **Anti-recommendation:** do not run a "contact support first" refund gate to protect margin at this scale — it converts refunds into disputes, and it buys you nothing, since VAMP's 1,000/month floor means you were never at network risk.

---

### 6. Founder-hours per month

Model assumptions, stated so they can be attacked: MoR for all sales; refund-request rate **1.5% of active base/month**, 8 min each; payment-failure events **5% of renewals/month**, 10% needing a human, 5 min each. **Both rates are [inference], not measured** — no frontmatter billing data exists yet.

| Line item | 100 | 1,000 | 10,000 | Basis |
|---|---|---|---|---|
| Refunds/billing support | **0.20 h** | **2.00 h** | **20.00 h** | 1.5% × n × 8 min ÷ 60 [derived, computed here] |
| Failed-payment exceptions | **0.04 h** | **0.42 h** | **4.17 h** | 5% × n × 10% × 5 min ÷ 60 [derived] |
| MoR payout ↔ ledger reconciliation | 0.5 h | 1.0 h | 1.5 h | one aggregated payout; near volume-independent [inference] |
| GST return review (CA prepares) | 0.5 h | 0.5 h | 1.0 h | [inference] |
| Annual work amortised (GSTR-9, ITR, ROC, LUT renewal ≈ 20 h/yr) | 1.67 h | 1.67 h | 1.67 h | 20 ÷ 12 [derived] |
| **Total** | **≈ 2.9 h** | **≈ 5.6 h** | **≈ 28.3 h** | column sums [derived] |

**Regime changes triggered by scale** [derived arithmetic, shown]
- **GST registration** (₹20 lakh services threshold [SS]): at 100 customers you cross it if ARPU ≥ ₹20,00,000 ÷ 100 = **₹20,000/customer/year**.
- **E-invoicing** (> ₹5 crore AATO): at 10,000 customers you cross at ₹5,00,00,000 ÷ 10,000 = **₹5,000/customer/year ≈ ₹417/month** — i.e. **almost certainly yes at 10,000**. At 1,000 customers it would take ₹50,000/customer/year — **no**.
- So the 10,000 tier adds IRN generation on export invoices, the Rule 46(r) QR code, and Rule 48(5) exposure. The 28.3 h estimate does **not** include that setup.

- **Recommendation:** hire the CA before 1,000 customers, not after; the marginal cost is small against the GSTR-9/e-invoice transition.
- **Anti-recommendation:** do not build billing ops tooling at 100 customers. 2.9 h/month is cheaper than any system you would write, and the 10,000-customer shape is unknowable today.

---

### 7. Anti-recommendations (standalone)

- **Do not self-serve global tax to save the MoR fee.** The fee buys 100+ registrations Paddle already holds [fetched]. A solo founder cannot staff that.
- **Do not treat Recurly's 1.25% involuntary churn as a monthly rate.** It is annual [fetched]. Budgeting against the wrong one distorts every LTV number downstream.
- **Do not cite NPCI UPI Autopay limits from memory or from a blog.** npci.org.in returned **403 on every attempt** here [measured]. The only limits verified are the RBI framework's ₹15,000 / ₹1,00,000, which apply to UPI as well [fetched].
- **Do not quote a failed-payment recovery target.** The two vendor figures found disagree irreconcilably [SS] and neither was opened.
- **Do not use `sequential-per-customer` invoice numbers.** Rule 46(b) permits multiple series but demands ≤ 16 chars and uniqueness **per financial year** [fetched] — a monotonic counter that never resets across FYs is a compliance defect that shows up years later.
- **Do not let the byte-preserving engine's "refuse rather than guess" discipline stop at the editor.** Billing is the same shape: a mandate whose max is below the charge should refuse and surface, not silently retry.

---

### 8. Needs a chartered accountant, not an agent

1. Whether the supply to the MoR qualifies as **export of services** under IGST s.2(6), and the LUT vs. pay-IGST-and-refund choice. Not verifiable here — CBIC Act sections returned HTTP 500 on every URL pattern tried [measured].
2. **Place of supply** determination (IGST s.12 vs s.13) for a foreign MoR, and whether any intermediary characterisation risk exists.
3. The correct **SAC** for the product and its rate. Rule 46(g) demands the code [fetched]; which code is a classification judgment, and misclassification is the single most common SaaS GST defect.
4. Whether the OIDAR/e-commerce-operator proviso to Rule 46(f) [fetched] catches frontmatter's Indian B2C sales.
5. **Ind AS 115 vs AS 9**: Ind AS is mandatory at net worth ≥ ₹250 crore for unlisted companies [SS]; below that a private limited company is on the Companies (Accounting Standards) Rules. Which one governs deferred revenue, and how annual prepayments are recognised, is a CA call, not an agent's.
6. FEMA/EDPMS export-realisation closure and FIRC/BRC discipline on MoR payouts.
7. GST registration timing and the inter-State-services exemption interaction.