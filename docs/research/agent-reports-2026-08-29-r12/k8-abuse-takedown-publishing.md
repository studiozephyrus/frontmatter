Verified already this turn: `git -C ~/.claude status -- skills-src settings.json` shows only pre-existing modifications, I made zero commits and wrote only to `/tmp/claude-501/` (fetched source copies), so the dirt is not from this run.

### Sources opened (all via `curl`, read 2026-08-29)

| Source | Identifier / version | Result |
|---|---|---|
| IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 | MeitY PDF, "updated as on 6.4.2023"; G.S.R. 139(E) dated 25.2.2021 | [fetched] 358,575 B |
| Information Technology Act, 2000 | indiacode.nic.in consolidated PDF | [fetched] 832,355 B |
| CERT-In Directions under s.70B(6) | dated 28.04.2022 | [fetched] 434,961 B |
| DSA — Regulation (EU) 2022/2065 | EUR-Lex CELEX 32022R2065, full text | [fetched] 840,292 B |
| Commission Recommendation 2003/361/EC | EUR-Lex CELEX 32003H0361 | [fetched] |
| 17 U.S.C. §512 / 18 U.S.C. §2258A | Cornell LII, prelim edition | [fetched] |
| 37 CFR §201.38 | eCFR current | [fetched] |
| copyright.gov fee schedule + DMCA agent directory | | [fetched] |
| Cloudflare Service-Specific Terms | "Last updated: June 02, 2026" | [fetched] |
| Vercel Terms of Service | "Last Updated June 1, 2026" | [fetched] |
| Bear Blog ToS (21 Aug 2022) + Code of Conduct v2 (28 Mar 2025, footer "Last updated 2026-08-04") | | [fetched] |
| Write.as Platform Guidelines | undated | [fetched] |
| GitHub Acceptable Use Policies | | [fetched] |
| NCMEC CyberTipline Data | 2025 page | [fetched] |
| APWG Phishing Activity Trends Report Q4 2024 | published 19 March 2025 | [fetched] |
| Mataroa terms of service | `/guides/terms/` | [measured] HTTP 404 — no ToS page exists |
| Telegraph (telegra.ph) | | [measured] TLS handshake failure from this network, 2 attempts — **not opened** |
| MeitY SSMI threshold notification; DPDP Rules 2025 | | [measured] MeitY index pages are JS-rendered, 0 PDF links extractable — **not opened** |

---

### 1. What is legally required the day a stranger publishes a page

#### India — the binding one (you are an Indian intermediary)

- s.79(1) IT Act 2000 grants immunity for third-party information; s.79(2)(c) makes it **conditional** on observing due diligence "and also such other guidelines as the Central Government may prescribe" = the 2021 Rules. [fetched]
- s.79(3)(b): immunity lost if, on actual knowledge or notification by the appropriate Government, you fail to expeditiously remove "without vitiating the evidence in any manner." [fetched]
- India has no §230 equivalent. Losing safe harbour means the founder is a co-defendant on the underlying claim (defamation, obscenity, copyright). [inference]

| Obligation | Rule | Clock |
|---|---|---|
| Prominently publish rules, privacy policy, user agreement (English or any Eighth Schedule language) | 3(1)(a) | at launch |
| Reasonable efforts, *by yourself and by causing users*, to not host 11 enumerated categories incl. (xi) "violates any law for the time being in force" | 3(1)(b) | continuous |
| Inform users annually of termination right | 3(1)(c) | yearly |
| Remove on court order / Govt notification | 3(1)(d) | **≤36 hours** |
| Preserve removed information + associated records | 3(1)(g) | **180 days** |
| Retain registration info after account cancellation | 3(1)(h) | **180 days** |
| Reasonable security practices per SPDI Rules 2011 | 3(1)(i) | continuous |
| Provide info/assistance to a lawfully authorised agency on written order | 3(1)(j) | **≤72 hours** |
| Report cyber incidents to CERT-In | 3(1)(l) | see below |
| Publish Grievance Officer name + contact on the home page (or one click from it, per the Explanation) | 3(2)(a) | at launch |
| Acknowledge every grievance | 3(2)(a)(i) | **≤24 hours** |
| Resolve grievance | 3(2)(a)(i) | **≤15 days** |
| Resolve a removal request under 3(1)(b) — except sub-clauses (i), (iv), (xi) | 3(2)(a)(i) proviso | **≤72 hours** |
| Remove NCII / nudity / sexual act / impersonation incl. morphed images, on complaint by the individual | 3(2)(b) | **≤24 hours** |
| Provide a complaint mechanism capturing the details for 3(2)(b) | 3(2)(c) | at launch |

- User may appeal a Grievance Officer decision to a Grievance Appellate Committee within 30 days; GAC endeavours to decide in 30 calendar days. Rule 3A. [fetched] You do not run the appeal; you must survive it.
- Rule 4 (Chief Compliance Officer, 24×7 nodal contact, Resident Grievance Officer, monthly compliance report) binds only a **significant social media intermediary** — a social media intermediary above a threshold "as notified by the Central Government," Rule 2(1)(v). The threshold is *not in the Rules*. [fetched] The commonly cited figure is 50 lakh (5,000,000) registered users in India — [SS], the notification was not opened here; treat as unverified. Also unsettled whether a publishing tool is a "social media intermediary" at all under Rule 2(1)(w) ("primarily or solely enables online interaction between two or more users") — publishing is one-to-many, not interaction. [inference]
- CERT-In Directions 28.04.2022: report listed incident types **within 6 hours of noticing**; enable logs of all ICT systems and maintain them **for a rolling 180 days, within Indian jurisdiction**; 5-year retention for data-centre/VPS/cloud/VPN KYC. [fetched] **Direct conflict with a Cloudflare R2 + Workers stack** — "maintained within the Indian jurisdiction" is not satisfiable by default R2 buckets. [inference]
- Rule 3(1)(g)'s 180-day preservation duty **contradicts** a "we delete what you delete" promise. Name the conflict in the privacy policy rather than letting it be discovered later. [inference; cf. the retain-vs-erase conflict already logged as a standing rule]

#### EU — the DSA, applicable from 17 February 2024 (Art 93(2)) [fetched]

- Art 6: hosting exemption survives only with no actual knowledge + expeditious removal on obtaining it. Art 7 protects voluntary own-initiative moderation. Art 8: no general monitoring obligation. [fetched]
- Art 3(i): an "online platform" is a hosting service that "stores **and disseminates information to the public**." A publish-to-URL feature is dissemination to the public; the "minor and purely ancillary feature" carve-out is a live argument for an editor whose main product is local editing, but it is an argument, not a shield. [fetched def; classification = inference]

| Applies to you as micro/small | Article | Substance |
|---|---|---|
| Yes | 11 | Single public point of contact for Member State authorities, Commission, Board; state the languages accepted |
| Yes | 12 | Single point of contact for users, "not solely rely on automated tools" |
| Yes | **13** | **Legal representative in a Member State** — mandatory for providers with no EU establishment offering services in the Union; notify the Digital Services Coordinator; the representative can be held liable |
| Yes | 14 | T&Cs must disclose restrictions, content-moderation policies, procedures, tools, algorithmic decision-making, human review, and internal complaint rules of procedure; machine-readable |
| **No** — Art 15(2) exempts micro/small non-VLOPs | 15 | Annual transparency report |
| Yes | **16** | Notice-and-action: easy, user-friendly, electronic-only submission, must enable the four elements (substantiated reasons; exact URL; notifier name+email except for CSAE offences; good-faith statement); confirm receipt without undue delay; notify decision + redress; Art 16(3) — a compliant notice **creates actual knowledge for Art 6** |
| Yes | **17** | Statement of reasons for *every* restriction (removal, disabling, demotion, payment restriction, service suspension, account termination), containing six specified elements incl. legal or contractual ground and redress routes. Not required for Art 9 orders or "deceptive high-volume commercial content" |
| Yes | 18 | Notify law enforcement on suspicion of a criminal offence involving a threat to life or safety |
| **No** — Art 19(1) | 20–28 | Internal complaint system, out-of-court dispute settlement, trusted flaggers, misuse suspensions, platform transparency reports, dark patterns, ads, recommenders, minors — **all excluded**, incl. Art 24(5) submission of statements of reasons to the Commission database |
| Yes | 24(3) | Supply average monthly active EU recipients to the DSC/Commission on request |

- Micro/small per Rec 2003/361/EC Art 2: small = <50 persons **and** turnover or balance sheet ≤ €10m; micro = <10 persons **and** ≤ €2m. [fetched] A solo founder qualifies comfortably; the exclusion also survives 12 months past losing the status (Art 19(1) second sub-paragraph). [fetched]
- Art 52(3): maximum fine 6% of annual worldwide turnover; 1% for supplying incorrect/incomplete information. [fetched]
- Net: **Arts 11, 12, 13, 14, 16, 17, 18, 24(3) are the entire EU surface.** That is materially smaller than the popular reading of the DSA.

#### United States

| Obligation | Cite | Detail |
|---|---|---|
| Designate a DMCA agent | 17 U.S.C. §512(c)(2) | Publish agent contact on the site **and** register with the Copyright Office [fetched] |
| Fee | copyright.gov fee schedule | **$6** per designation, amendment, or resubmission [fetched, read 2026-08-29] |
| Renewal | 37 CFR §201.38(c)(4) | Designation "will expire and become invalid **three years** after it is registered" unless renewed [fetched] |
| Repeat-infringer policy | §512(i)(1)(A) | Must be adopted, **reasonably implemented**, and users informed [fetched] |
| Counter-notice restore window | §512(g)(2) | Restore "not less than 10, nor more than 14, business days" after counter-notice unless told of a court action [fetched] |
| CSAM reporting | 18 U.S.C. §2258A(a)(1) | Report to the NCMEC CyberTipline "as soon as reasonably possible after obtaining **actual knowledge**" [fetched] |
| No monitoring duty | §2258A(f) | Nothing requires you to monitor, screen, or scan [fetched] |
| Preservation | §2258A(h)(1) | A submitted report is treated as a request to preserve for **1 year** — raised from 90 days by Pub. L. 118–59 (REPORT Act, 2024) [fetched, incl. the amendment note] |
| Penalties | §2258A(e) | First knowing and wilful failure: up to $850,000 (≥100M MAU) / **$600,000 (<100M MAU)**; second or subsequent: $1,000,000 / **$850,000** [fetched] |

- Whether §2258A binds an India-incorporated provider with no US establishment is contested; the statute defines "provider" by service type, not nationality. [fetched text; extraterritorial reach = **[inference]**, and a real source ambiguity — do not state it as settled either way.] Practically moot: your US host contractually requires the same outcome, and NCMEC accepts reports from non-US ESPs. [inference]
- India-side CSAM duty is independent and harsher: Rule 3(1)(b)(ii)–(iii) plus POCSO/BNS obligations; a report to CyberTipline does not discharge Indian reporting. [inference — POCSO text not opened here]

#### Hosting terms that transfer liability to you

- **Cloudflare Service-Specific Terms, updated 2026-06-02** [fetched]: the Developer Platform (Workers, Pages, KV, D1, Durable Objects, R2, Containers, Workers for Platforms) is one of the few Cloudflare products where "the Services can be used to host content." Verbatim obligations: "you are solely responsible for the acts of your End Users"; "The use of the Services for phishing schemes is prohibited"; creation of "subdomains that include deceptive or offensive terms or names of other businesses, organizations, or individuals is prohibited," with immediate suspension or termination; content Cloudflare deems illegal or harmful — CSAE, IP infringement, doxxing, incitement, fraud, malware, phishing — "may be blocked or removed... without notice"; Cloudflare "has the right, but not the obligation" to act; access to your content for only 30 days post-termination, with no retention obligation. **Your users' abuse is contractually your abuse, and the remedy is account-level.** [fetched]
- **Vercel ToS, updated 2026-06-01** [fetched]: §15 — you indemnify Vercel against claims "arising out of your websites or any of Your Content"; §8 — Vercel "may prohibit any use of the Services it believes may be (or is **alleged** to be) in violation." Separately, on Hobby or trial-Pro plans Vercel "may use Your Content to train our artificial intelligence... and share Your Content with third parties" — **disqualifying for a product whose pitch is that the file is the user's source of truth.** [fetched]

---

### 2. Minimum viable trust-and-safety apparatus

| Component | Driven by | Minimum shape |
|---|---|---|
| Public **Grievance Officer** page: name, email, postal address, on the home page or one click from it | Rule 3(2)(a) + Explanation | Static page; the founder is the officer |
| **Report form** at a stable URL, linked from every published page footer | DSA Art 16 + Rule 3(2)(c) | Captures: URL, reason, category, reporter name+email (optional for CSAE), good-faith attestation. Electronic only. Writes a ticket row |
| **Auto-acknowledgement within 24 h** | Rule 3(2)(a)(i) | Send on submit, not on triage — the clock is on acknowledgement, not on judgement |
| **Statement of reasons** on every enforcement action | DSA Art 17 | Templated email with the six Art 17(3) fields; fires on unpublish, demote, suspend, terminate |
| **Takedown SLA ladder** | strictest clock wins | NCII/impersonation **24 h**; most 3(1)(b) categories **72 h**; court/Govt order **36 h**; everything else **15 days**; DMCA "expeditiously" |
| **Preservation store** | Rule 3(1)(g), §2258A(h)(1) | Removed bytes + metadata held **180 days** (India) / **1 year** (post-CyberTipline report), write-once, separate from the live bucket |
| **Action log** | Rule 3(1)(j), CERT-In 180-day rolling logs in Indian jurisdiction | Append-only: who, what URL, what action, what time, on whose notice. Retained 180 days **in India** — a second store, not R2's default region |
| **Appeals** | *not* required (Art 20 excluded by Art 19) | One reply-to address; Write.as's promise ("we're happy to listen to your appeal") is the ceiling of what a solo product needs [fetched] |
| **DMCA**: agent page + Copyright Office registration + repeat-infringer policy + counter-notice flow | §512(c)(2), §512(i), §512(g) | $6, renew every 3 years |
| **CSAM path** | §2258A | A written runbook: preserve, do not re-review, report to CyberTipline, hold 1 year, notify Cloudflare |
| **EU legal representative** | DSA Art 13 | Contracted third party in one Member State; notify that state's DSC |
| **T&Cs** disclosing moderation policy, tools, human review | DSA Art 14 | One page, machine-readable |
| **Not required, do not build**: internal complaint-handling system, ODR body membership, trusted-flagger channel, transparency report, statements-of-reasons database feed | DSA Art 15(2), Art 19(1) | Excluded while micro/small |

---

### 3. Abuse vectors ranked by likelihood for *this* product

| # | Vector | Why it ranks here | Control |
|---|---|---|---|
| 1 | **SEO spam / backlink farms** | Zero-cost, fully automatable, and the only thing a free publishing URL is *unconditionally* good for. Write.as bans it by name — "This isn't a free place for building backlinks" — and Bear bans marketing material outright: "Bear isn't a content distribution channel" [both fetched]. Two of the five comparables name it first | `X-Robots-Tag: noindex` on every free-tier page; `rel="nofollow ugc"` on all outbound links; publish gated behind a paid or aged account; per-account publish rate limit |
| 2 | **Phishing lures** | APWG observed **989,123 phishing attacks in Q4 2024 alone** [fetched, published 19 Mar 2025]. Your settled "no arbitrary client-side code execution" kills the JS vector but **not** this one — a static page with a borrowed logo and one outbound link is a working lure. Cloudflare bans it explicitly and terminates for it [fetched] | Strip raw HTML and `<form>` at render; check published URL + outbound links against a reputation feed on publish; block deceptive subdomain names (Cloudflare requires this of you anyway) |
| 3 | **Copyright infringement** (pasted articles, chapters, paywalled text) | Highest-volume *legitimate* complaint class for any text host; markdown paste is the natural interaction | DMCA agent + notice/counter-notice + repeat-infringer termination. Cheap, well-defined, already law |
| 4 | **Doxxing / targeted harassment page** | The vector with the harshest clock: 72 h under the Rule 3(2)(a) proviso, 24 h if it shades into impersonation. GitHub maintains a standalone "Private Information Removal Policy" for exactly this [fetched] | Named category in the report form so it routes to the 24/72 h lane; unpublish-first, adjudicate-second |
| 5 | **NCII / morphed sexual imagery** | Rule 3(2)(b) gives **24 hours** and no discretion. Bear permits NSFW but bans explicit pornography and pushes it off the shared surface [fetched] | Ban explicit sexual imagery on the published surface entirely in v1 — a policy line is cheaper than a 24-hour clock |
| 6 | **Malware / payload staging** | R2 makes you a file host the moment you allow attachments | Published assets restricted to rendered HTML + an image allowlist verified by magic bytes; no arbitrary file publishing |
| 7 | **Brand impersonation on a subdomain** | Cloudflare terminates *your* account for user-chosen deceptive subdomains [fetched] | Random or reserved slugs in v1; no user-chosen vanity subdomain |
| 8 | **Defamation** | No §230; it is inside Rule 3(1)(d)'s list and a court order starts a 36 h clock | Court-order intake path; do not adjudicate truth |
| 9 | **CSAM** | Lowest likelihood on a text-first surface, unbounded consequence. CyberTipline received **20.5 million reports in 2024**, down from **36.2 million in 2023**; 2025 ESP reports carried **61.8 million files** [fetched] | Written runbook, hash-matching only if images are allowed at all. Do not allow arbitrary image upload on a free tier in v1 |
| 10 | **Resource abuse / hotlinking** | R2 egress is free; Workers requests are not | Per-account request cap; cache aggressively |

---

### 4. Honest cost

**Build (one-time), founder-hours** [derived, arithmetic shown]:

`ToS/Privacy/AUP drafting 12 + DSA Art 14 T&C 4 + report form & ticket store 10 + Art 17 statement generator 8 + moderation console 12 + preservation store & action log 8 + reputation check on publish + noindex 8 + DMCA registration & notice page 2 + Grievance Officer page & 24 h auto-ack 4 + repeat-infringer/counter-notice flow 6 = **74 hours**`

**Money, one-time**: DMCA agent registration **$6** [fetched]. Indian counsel review of ToS/privacy/IT-Rules posture ₹40,000–₹1,20,000 [SS, **unverified** — not fetched]. EU Art 13 legal representative €200–€500/month [SS, **unverified**].

**Run-rate — this is the real cost, and it is not money**:
- Rule 3(2)(a)(i) requires acknowledgement **within 24 hours**, every day, forever. [fetched]
- [derived] 24 h ack × 365 days = **no unbroken 48-hour offline window in a calendar year**. A single missed acknowledgement on a grievance that later matters is an argued breach of due diligence, and due diligence is the s.79(2)(c) condition on safe harbour itself.
- Per-report handling: triage + decide + write an Art 17 statement of reasons ≈ **20–40 min** [inference, no measured baseline].
- Volume is unknowable in advance. Stated as a replaceable assumption: **at 1 report per 500 published pages** [assumption, unverified], 5,000 published pages/year → 10 reports/year → ~5 hours. At 1 per 50 → 100 reports → ~50 hours plus the on-call tax. The variance, not the mean, is what kills a solo founder.
- Renewal tax: DMCA designation every 3 years [fetched]; annual user notification under Rule 3(1)(c) and 3(1)(f) [fetched].
- Third-party termination risk is the uninsured line item: Cloudflare may act "without notice," at account level, on its "sole judgment" [fetched]. One user's phishing page can take the *editor* offline for every paying customer.

**What comparables actually ship**: Bear Blog — a ~350-word ToS from 21 Aug 2022, a code of conduct, no takedown SLA, no appeals procedure, and an explicit refusal to give one ("No-one owes you a ruling on which sub-clause of the code of conduct you breached") [fetched]. Mataroa — **no terms-of-service page at all**, HTTP 404 [measured]. Write.as — guidelines with a remedy ladder that de-indexes rather than deletes, plus an appeals promise [fetched]. GitHub Pages — roughly fifteen separate policy documents including CSAM, NCII, Doxxing, Impersonation, Synthetic Media, Government Takedown, and a published Appeal and Reinstatement policy [fetched]. **The floor and the ceiling are two orders of magnitude apart, and neither Bear's operator nor Mataroa's is an Indian intermediary carrying a 24-hour statutory acknowledgement clock.**

---

### 5. Recommendation

**Ship in v1 — but only the narrow surface**: publishing available to **paying accounts only**, `noindex` by default, system-assigned slugs (no vanity subdomains), no arbitrary file or image upload, raw HTML and `<form>` stripped at render, hard per-account page cap. Ship the Grievance Officer page, the report form, the 24-hour auto-acknowledgement, the DMCA agent, the preservation store, and the Art 17 template **before** the first stranger publishes — not after.

- **Strongest argument for shipping in v1**: the abuse economics of a *paid* publishing surface are inverted. Every vector ranked 1, 2, 6 and 7 above depends on free, automatable, indexable, vanity-named pages; a credit card plus `noindex` plus a random slug removes the entire commercial motive, and what remains is the low-volume, legally well-defined DMCA lane. The 74 build-hours are one-time and mostly reusable plumbing (ticket store, action log, templated notices). Meanwhile "the file is the only source of truth, and here is its permanent public projection" is the thesis — a byte-preserving engine whose output nobody can *see* is a claim without a demonstration.
- **Strongest argument for v2 (the anti-recommendation)**: the 24-hour acknowledgement clock is not a feature you can descope. It is a **permanent, unbounded, personal on-call obligation for a solo founder**, it starts the day the first stranger publishes, and it never ends — and the penalty for missing it is not a fine but the collapse of the s.79 safe harbour that separates "user posted defamation" from "founder is a co-defendant in an Indian court." Add the third-party risk: Cloudflare terminates at account level, without notice, on sole judgment, for the acts of *your* end users — so one phishing page published by a stranger can take the paying editor customers offline. A markdown editor with deep engine guarantees has a complete, sellable product **without** publishing; adding publishing converts a software business into a moderation business with a software attachment, and no amount of gating removes the on-call.
- **The disagreement to record, not resolve**: whether a publish feature makes you a DSA "online platform" at all turns on the Art 3(i) "minor and purely ancillary feature" carve-out, which has not been tested for editor-with-publish products [fetched text; application = inference]. If the carve-out holds, Arts 19–28 were never in play and this decision was cheaper than modelled. If it does not, Art 19's micro/small exclusion covers you anyway **until you have 50 employees or €10m turnover** [fetched] — so the EU is not the binding constraint in either reading. **India is.** The decision is entirely about whether a solo founder in India will accept a 24-hour, 365-day acknowledgement duty, and that is a question about the founder's life, not about the law.