Reconcile verified (9th, identical to all prior checks): `~/.claude` HEAD `6e390828`, frontmatter HEAD `484f579`; 19 dirty paths pre-existing; this session wrote only to `$TMPDIR/b2b`.

---

**One line: the closest structural analogue to this product runs a nine-figure-logo B2B business with zero B2B features — Obsidian's entire enterprise offering is a $50/user/year licence whose own FAQ answers "Do I have to pay for commercial use?" with "No," and 146 named organisations including Amazon, Apple, Microsoft, Oracle, NVIDIA, Stripe, Siemens, US Bank, the UK Government and the Bundeswehr pay it anyway. The B2B answer for a local-first, files-in-your-repo product is a licence and a logo wall, not a feature set — and the moment you build the feature set you have started a different, worse company.**

---

**The natural experiment, measured** [fetched obsidian.md/pricing and /enterprise, 2026-08-31]

Obsidian is free forever, local-first, no sign-up, no server-side document store, **no team tier, no SSO, no SCIM, no audit log, no admin console, and no SOC 2 anywhere on the site.** The "Enterprise" nav item leads to a supporter wall, not a product. Tier = licences held by that org:

| Tier | Threshold | Named orgs | Floor licences |
|---|---|---|---|
| Diamond | 10,000+ | 1 (Amazon) | 10,000 |
| Sapphire | 1,000+ | 0 | 0 |
| Topaz | 500+ | 4 (Capital One, Meta, Shopify, UK Government) | 2,000 |
| Emerald | 200+ | 7 (ARM, DATEV, Gov. of Canada, NAVER, PenTeleData, Shift, theTradeDesk) | 1,400 |
| Jade | 100+ | 13 (Apple, CVS, Datadog, GE, Siemens, Stripe, Thales, Zoox, …) | 1,300 |
| Opal | 25+ | 121 (Bosch, Bundeswehr, Cisco, Microsoft, NVIDIA, Oracle, Samsung, Snowflake, US Bank, New Zealand Police, …) | 3,025 |
| **Total** | | **146 named, "more than 10,000 organizations"** | **17,725** |

[derived] 17,725 × $50/user/yr = **$886,250/yr floor from the named orgs alone**, taking the lower reading at every tier boundary (Sapphire has zero named orgs; the four 500+ names sit under Topaz — verified by re-scraping the label sequence). The true number is larger by the 9,850+ unnamed organisations.

That is the whole finding. The record's §21 instruction — "do not chase SSO, SCIM, SOC 2 until there is a team or funding" — is not a temporary compromise. It is what the winning play in this exact shape looks like permanently.

---

**What only a company will pay for, priced by the market** [measured, sso.tax scraped 2026-08-31]

152 table rows; 113 vendors with a published numeric SSO markup.

| | Value |
|---|---|
| Median SSO markup | **+162%** |
| Mean | +611% |
| Vendors at ≥+100% | 81 / 113 (72%) |
| Vendors at ≥+300% | 33 / 113 (29%) |
| Additional vendors gating SSO behind "contact sales" | 36 |
| Cheapest on the list | Doppler +5%, **GitBook +5%** |
| Most extreme | Appsmith +16,567%, Railway +9,900%, OneSignal +7,307% |

SSO is the single most reliably monetised object in SaaS. Now the live gates in our actual comparator set [fetched, all 2026-08-31]:

| Vendor | SSO/SAML gate | SCIM | Audit log | Invoice/PO | Seat price at the gate |
|---|---|---|---|---|---|
| Cursor | Teams | Enterprise | Enterprise | Enterprise | **$40/user** |
| Linear | Google free; SAML at Enterprise | Enterprise | Enterprise | Enterprise | Business $16/user |
| Mintlify | Enterprise | Enterprise | Enterprise | Enterprise | "contact us" |
| GitBook | Enterprise | — | — | Enterprise | $12/user |
| Warp | paid tier — **alongside "bring your own API keys" as a paid feature** | — | — | — | $50/user tier present |
| Zed | **"SSO, SAML, and SCIM are planned but not currently available"** | no | no | — | $30/seat |
| **Obsidian** | **none, at any price** | none | none | none | $50/user/yr licence |

Two things fall out. First, Zed — funded, shipping, with a paid team plan — has **not shipped SSO at all** and is selling anyway. SSO is not a launch requirement; it is a later toll booth. Second, **Warp charges for bring-your-own-key**. Our pricing policy gives BYO-key away free at every tier as a principle (§24.6). One competitor has priced the same capability as a team control. Not proof we are wrong, but it is the only place in the sample where our published policy directly contradicts a shipped price.

**Near-free given the architecture already chosen** — days, not weeks, because the document never leaves the customer's repo:

| Asset | Real cost | Why it is cheap |
|---|---|---|
| Export guarantee / no lock-in | **0** | The files are already theirs, in their VCS, in their format |
| Data residency for document content | **0** | We never hold it. The answer is "your GitHub org's region" |
| Deletion / retention of content | **0** | They delete a file; there is no copy to purge |
| Sub-processor list for content | **0** | There is none for content |
| BYO provider key | **shipped** | Already the default |
| Annual invoice, PO, W-8BEN, seat count on a licence | **~1 week** | Billing plumbing, no product surface |
| Cross-engine byte-preservation certificate | **shipped** | Byproduct of the splice |

**A quarter of work each, and they compound:**

| Asset | Honest cost |
|---|---|
| SAML/OIDC SSO tested against Okta, Entra and Google | 4–8 weeks build, then a permanent support tail |
| SCIM provisioning and deprovisioning | +3–4 weeks, and it is the part that breaks |
| Admin console with roles, seat reassignment, org-wide policy | 4–6 weeks |
| Audit log that satisfies an auditor (not a diff — approvals, access, retention) | 4–6 weeks |
| SOC 2 Type II | 6 months and $15k–$50k [measured: 9 mentions of "6 months"; dollar figures cluster at $15k/$20k/$50k in the SOC 2 corpus] |
| On-prem or air-gapped | a quarter, plus a forever support obligation |

**The gap between those two lists is the entire B2B strategy.** Everything cheap is a *consequence of not holding the data*. Everything expensive is a *consequence of holding the identity*. Sell the first list. Refuse the second until a purchase order pays for it.

---

**The trick, and its ceiling**

The trick is real: repo-residency pre-answers the questionnaire sections that normally take an enterprise-grade vendor months. But I measured how far that gets you, and it is not far enough on its own.

[fetched, r/SaaS, 2025-12-15, 145 points, 57 comments, redd.it/1pmwnd7] — *"Their procurement team sent us a security questionnaire that's 47 pages long. They want SOC 2 Type 2 which we don't have because we're a 6 person company. Now their legal team wants us to carry 5m in cyber insurance. our current policy is 1m and the increase would cost $18k annually… I'm spending 6 hours a day filling out compliance paperwork instead of actually building features."* The deal was 15× their average contract.

[fetched, HN 48151965, 2026-05-15, @jwr, solo founder] — *"Many of the questions simply do not apply to my business ('do you have documented procedures for revoking employee access') and the default answer is NO. **Get even a single NO and you're done.**"*

That is the ceiling. Repo-residency turns roughly a third of a questionnaire into "not applicable" — and a questionnaire is scored pass/fail on the whole. It does nothing for employee offboarding, change management, business continuity, penetration testing, insurance, or the SOC 2 line itself. **Repo-residency is a cost saver on a race you should not enter, not a shortcut through it.**

Where it *is* decisive is one tier down, where no questionnaire exists but an objection does: the engineering manager at a 12-person company justifying a new vendor to a nervous cofounder. There, "the documents are in your repo, we hold nothing, cancel and you lose nothing" closes the objection in one sentence — and that sentence costs us zero engineering.

---

**What kills a deal, ranked by whether it is fatal**

Corpus: 5,012 HN comments (six seeded phrase queries, 90-day slices, 2025-01-01→2026-08-31) and 445 Reddit posts across r/SaaS, r/cybersecurity, r/sysadmin, r/devops, r/startups, r/ExperiencedDevs (arctic-shift; `reddit.com/*.json` returns 403 here). Both are query-seeded, so within-corpus rates are co-occurrence, not market prevalence — stated so you can discount them.

| Blocker | Fatal? | Starts to bite at | Evidence |
|---|---|---|---|
| **Security questionnaire** | **The real killer, and it is not SOC 2** | first deal above ~$25k ACV | 128/445 Reddit posts (28.8%); 30 literal HN comments since 2025-01-01. jwr: one NO ends it |
| SOC 2 | **Survivable, often indefinitely** | when a PO is *contingent* on it | 830 HN comments; only 36 (4.3%) describe a blocked or lost deal, against 55 (6.6%) calling it theatre |
| No SSO | Survivable | ~40+ seats, or any org with an IdP mandate | Zed ships without it; 33 of 88,108 claude-code issues name SSO in title, SAML 2, SOC 2 **0** |
| One-person support | Survivable at self-serve; fatal at enterprise | the moment an SLA enters a contract | — |
| **Indian entity selling to EU/US enterprise** | **Cannot be measured here** | — | 32/5,012 comments mention India; on reading, essentially all are geopolitics, not vendor risk. **[SS]** |

The two quotes that should settle the SOC 2 argument:

[fetched, HN 48151962, 2026-05-15, @bitbasher] — *"I'm a solo entrepreneur running a b2b saas product I built. I do not have a soc2 certificate (or any certificate). I have never lost any sales (that I know of) because of it. I've sold to customers that pay $2XX,XXX annually and it was never an issue."*

[fetched, HN 48150204, 2026-05-15, @tptacek] — *"Do not ever do a SOC2 speculatively… The overwhelming most likely scenario is a purchase order made contingent on your SOC2 Type I attestation, where the revenue from that purchase order more than pays for the attestation… If you're losing sales where SOC2 is a factor, you didn't have those sales to begin with."*

On the Indian entity: I could not measure it and will not dress an impression as data. The one adjacent hard fact I verified is a precedent, not a risk estimate — **Freshworks Inc. is incorporated in Delaware with a San Mateo business address** [fetched, SEC EDGAR CIK 0001544522], despite being founded and largely built in Chennai. The observable pattern is that Indian-origin SaaS selling upmarket globally redomiciles the *contracting* entity. That is a $3k–$8k/yr decision to make later, not a reason to change the product now [inference].

---

**The buying trigger**

What is actually named as the reason compliance work started, across the 859 compliance-mentioning HN comments:

| Named trigger | n | % of 859 |
|---|---|---|
| A regulation (GDPR, HIPAA, PCI, ISO 27001, DORA, FedRAMP, DPDP) | 217 | 25.3% |
| An incident or breach | 76 | 8.8% |
| A specific deal, PO, RFP or pilot on the table | 46 | 5.4% |
| The first big/serious/enterprise customer | 29 | 3.4% |
| A funding round or board request | 13 | 1.5% |
| Annual audit or renewal | 4 | 0.5% |
| Internal IT mandate | 1 | 0.1% |

[fetched, HN 49308663, 2026-08-15, @m1keil] — *"The requirement for soc2 usually comes with the first 'serious' customer. It is usually a big blocker on some fat contract and now the business makes it your problem for the next 6 months."*

**None of these is a trigger to buy a documentation tool.** They are triggers to buy Vanta (37 of 830 SOC 2 comments name Vanta/Drata/Secureframe/Sprinto). The honest answer to "who has budget and a reason to act this quarter" for *us* is smaller and less glamorous: a team lead with a company card, a headcount change, and no approval chain — the 2-to-20 band the record already names as ICP 1. There is no quarter-driven compliance trigger for this product, and inventing one in the deck would be the kind of claim §58 exists to prevent.

---

**D2C: what makes an individual actually pay**

[measured] 761 HN comments mentioning Obsidian, from a 905-comment corpus seeded on Obsidian and free-to-paid conversion:

| Behaviour | n | % of 761 |
|---|---|---|
| Mentions syncing via Syncthing, git, iCloud, Dropbox, rclone or Nextcloud | **211** | **27.7%** |
| Mentions paying for Obsidian Sync | 67 | 8.8% |
| Mentions paying to support the developers / Catalyst | 14 | 1.8% |
| Mentions the commercial licence | 9 | 1.2% |
| Mentions paying for Publish | 2 | 0.3% |

**In our exact target population, do-it-yourself beats paying 3.1 to 1 for the hosted-convenience feature.** That is the strongest single piece of evidence against Pro-as-hosted-convenience at ₹299. On the honest attempt to measure free-to-paid conversion rates directly: 36 comments discussed conversion and the cited percentages were too few and too noisy to report. **[SS]** — I will not manufacture a benchmark.

What *did* convert, in the one measurable case: **a service the user cannot trivially self-host (Sync), and an identity purchase (Catalyst, commercial licence).** Not features. The 1.8% who pay to support the developers and the 1.2% who buy a licence they are explicitly told is optional are buying membership — and that is the mechanism producing the $886k floor above.

---

**Same product or two? The costs, named**

| Option | What it costs two founders |
|---|---|
| **Two products, two surfaces** | Two onboarding flows, two pricing pages, two support queues, two positioning narratives, two release cadences. §26 records that exactly two marketing posts have ever shipped, one with a visible defect since 2026-08-10. **This ends the argument.** |
| **Shared engine, two skins** | Cheaper than two products, but still two funnels and two support queues — the expensive halves. Buys nothing the tier does not. |
| **One product, one team tier** | A licence object with a seat count, an invoice, and one admin screen. ~1–2 weeks. |

None of the eight vendors I fetched runs two products. Obsidian runs one product with **no** team tier and extracts a $886k/yr floor from named enterprises. **One product, one tier.**

---

**Recommendation**

Ship the **licence motion first**, not the team motion. Concretely: keep the Work licence exactly as specified in §24 (₹3,999/yr, $50/yr world — parity with Obsidian, verified live today), add an invoice, a PO field, a seat count, and a public supporters page. That is the near-free list end to end, and it is the shape that demonstrably works for a product holding none of the customer's data.

Defer the team motion — SSO, SCIM, admin console, audit log, SOC 2 — until a purchase order names one and covers it. **What deferring costs:** you cannot serve any buyer above roughly $25k ACV, which at $20–40/seat means roughly 600+ seats. That band is not reachable in year one at any staffing level, so the cost of deferring is approximately zero this year and roughly one quarter of work whenever the first PO arrives. The cost of *not* deferring is a quarter spent on SAML for a customer who does not exist yet.

---

**WHAT THIS MEANS FOR THE PRODUCT**

- **Build the commercial licence and the supporters page before anything else B2B.** Obsidian's honour-system $50/user/yr licence, sold with the FAQ answer "No, you are not required to pay," produced 10,000+ organisations and a ≥$886,250/yr floor from 146 named ones. This is the only B2B motion in the evidence that a two-person team can actually run. Price at parity, publish the logo wall, make the licence purchasable by invoice.

- **Do not build SSO, SCIM, an admin console, or SOC 2 on speculation.** Zed ships a paid team plan today with SSO explicitly "planned but not currently available." Only 4.3% of 830 SOC 2 comments describe a lost deal; a solo founder in the corpus sells $2XX,XXX contracts without any certificate. Build each one *after* a purchase order names it and pays for it, per tptacek's rule.

- **Reshape the audit-trail claim, or drop it from the pitch.** Since 2025-01-01, literal HN comment counts: "document audit trail" **0**, "audit trail for AI edits" **0**, "byte-level diff" **1**, "handover document" **2** — against "security questionnaire" **30**. §21 calls byte-level attribution a governance claim incumbents cannot copy. It may be true and uncopyable, it still has no measurable buyer, and the customer's own git already answers the question an auditor asks. Keep it as *proof* of the engine, never as the B2B wedge.

- **Kill "team context governance" as a B2B wedge before it is written down.** [fetched, docs.claude.com] Claude for Enterprise already ships SSO, domain capture, role-based permissions, a compliance API, **managed policy settings for organization-wide Claude Code configurations**, and managed MCP configuration. The platform vendor gives away the org-level agent-context control surface inside a seat we cannot underprice.

- **Reprice or defend BYO-key deliberately.** Warp sells "bring your own API keys" as a paid team feature next to SAML SSO. §24.6 gives it away at every tier. That may be the right principled call — but it is now a *contested* call with a live counterexample, and §58 should not let us describe it as obviously correct.

- **Stop describing Pro as hosted convenience.** In 761 Obsidian-mentioning comments, DIY sync beat paid sync 211 to 67 — 3.1:1 — in precisely our audience. The two things people demonstrably paid for were a service they could not self-host and a membership they were told was optional. Pro must be one of those two, not a convenience the target user can replicate with `git push`.
