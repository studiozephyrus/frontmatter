---
id: 54-COMPLIANCE-AND-LEGAL
title: Compliance and legal
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 4de879d
covers: [data-protection, provider-terms, training, licences, constraints]
---

# 54. Compliance and legal

**What this file is.** Every constraint that binds the build, what it forbids in plain words, who
owns it, and by when. It is a register, so a reader can check one row without reading the rest.

**What it is not.** Legal advice. **Nobody in this pack is a lawyer.** Every row says how it was
read and by whom, and a row marked `UNVERIFIED:` has not been read by counsel or could not be
opened at all.

**Seed:** `docs/mvp0/PRODUCT-PLAN.md` section 23. That section's rows are carried here with their
owners and dates intact, and the provider-terms half is extended from
`docs/research/2026-09-18-llm/raw/L1-free-providers.md`.

---

## 1. The three things that bring the law in

`docs/mvp0/PRODUCT-PLAN.md` section 23 states the trigger, and it is worth reading before the rows:

- **Holding documents.** Somebody else's private text on our disk.
- **Publishing strangers' pages.** Content we did not write, served from our domain.
- **Taking money.** A rupee changes what we are.

**Nothing in phase 0 or phase A is optional because of that.** Two of the three fire before the
first stranger, and the third before the first rupee.

---

## 2. The register

Every row: what it forbids or requires, the owner, the date, and how it was read. Dates are the
plan's, and this file does not move them.

### 2.1 Before the first stranger

Id | Requirement | **What it forbids** | Owner | Due
`L01` | Privacy notice, terms and consent wording, with the age floor stated | Publishing a sign-up form with no notice behind it | Sagnik | 15 Oct 2026
`L02` | A named grievance officer with a published address on every public page. 24-hour acknowledgement, 7-day resolution, and the 36-hour, 3-hour and 2-hour removal clocks of section 3.3, and a report link on S18 | Serving a stranger's page with no route to complain about it | Sagnik, as officer of record | 15 Oct 2026
`L03` | **Every** account in `docs/mvp0/PRODUCT-PLAN.md` section 24 moved to the company, not only the Cloudflare zone, the domain and Razorpay. Widened 18 September by D10 `[Z]` | Holding a stranger's data on a personal account | Sagnik | 15 Oct 2026
`L04` | European Union sign-ups blocked, or a representative engaged | Accepting a European sign-up with neither | Sagnik | 15 Oct 2026

### 2.2 Before the first deploy that holds a document

Id | Requirement | **What it forbids** | Owner | Due
`L05` | Breach contact filed; a six-hour incident runbook; an append-only security log kept 180 days in Indian jurisdiction | Storing a document with no incident path and no log | Amit | 15 Oct 2026

**`L05`'s source** `[M]`: CERT-In directions under section 70B(6), 28 April 2022, opened 18 September
2026 at `https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf`. Direction (ii):
report "within 6 hours of noticing such incidents". Direction (iv): keep logs "for a rolling period of
180 days and the same shall be maintained within the Indian jurisdiction".

### 2.3 Before the first rupee

Id | Requirement | **What it forbids** | Owner | Due
`L06` | Tax position confirmed by a chartered accountant; the price shown inclusive; invoice lines | Charging with a guessed tax heading | Sagnik | 31 Oct 2026
`L07` | Razorpay mandates under 15,000 rupees, one attempt on Indian cards; a refund and cancellation page | A mandate above the ceiling, or a retry ladder the rail does not allow | Amit | 31 Oct 2026
`L08` | Processor agreements with Cloudflare, Google, Anthropic and Razorpay, each read for commercial use | Sending a user's document to a provider whose terms nobody opened | Amit | 31 Oct 2026
`L09` | A trademark search for "frontmatter" on the Indian register | Going live on a name with a known collision and no search | Sagnik | 31 Oct 2026
`L10` | A written agreement on intellectual property between the founders | Taking money into an entity with no ownership record | Sagnik | Before the first rupee

### 2.4 Before the pilot

Id | Requirement | **What it forbids** | Owner | Due
`L11` | A counsel question on the Rights of Persons with Disabilities Act section 46 with rule 15. WCAG 2.2 AA adopted meanwhile, and IS 17802 tested alongside | Shipping a screen that has not been contrast-tested | Amit | 31 Oct 2026
`L12` | Consumer Protection (E-Commerce) Rules 2020 rule 4 duties built in whether or not counsel says they bind | A pre-ticked consent box. A grievance route slower than the rule | Sagnik | 31 Oct 2026

### 2.5 Now, and done

Id | Requirement | State
`L13` | Third-party notices: the Open Font Licence texts and the Apache notices in `THIRD-PARTY-NOTICES.md`; the licence line atop the screens' font file; Mosvita no longer embedded in the print files | **Done on this branch**, 17 Sep 2026

---

## 3. Data protection, in India

### 3.1 What the Act says and when it bites

**Digital Personal Data Protection Act 2023, section 9**, the children's-data section, read by the
audit on indiacode.

**Commencement, opened from the Gazette by the plan on 17 September** `[M]`:

Instrument | What it does
G.S.R. 843(E) of 13 November 2025, CG-DL-E-14112025-267647 | Brings sections 7 to 10, section 9 among them, into force "eighteen months from the date of publication of this gazette". Published 14 November 2025, **so 14 May 2027**
G.S.R. 846(E), CG-DL-E-14112025-267650, rule 1 | Rules 1, 2 and 17 to 21 at once. Rule 4 after one year. Rules 3, 5 to 16, 22 and 23 after eighteen months

**So the pilot runs before the duty bites.** That is a fact about timing, not a permission. **The
terms carry the floor from day one** `docs/mvp0/PRODUCT-PLAN.md` section 23.

### 3.2 The age floor

- **Default eighteen**, founder question 12.
- **The configuration panel cannot change this retroactively.** `docs/mvp0/PRODUCT-PLAN.md` section 30:
  the panel can hold the number, and it cannot re-consent the people who accepted the old terms.
- **So the number is a setting and the promise is not.** Raising the floor after somebody has
  signed up under a lower one is a consent problem, not a configuration change.

### 3.3 The grievance route

Clock | Duration | Where it appears | Rule
Acknowledge a complaint | **24 hours** | The grievance route, S18's report link | 3(2)(a)(i)
Resolve it | **7 days** | The same | 3(2)(a)(i), "seven days" substituted for "fifteen days"
Remove on a complaint about a rule 3(1)(b) class of content | **36 hours** | The published page | 3(2)(a)(i) proviso, "thirty-six hours" substituted for "seventy-two hours"
Remove on a court order or a government notice | **3 hours** | The same | 3(1)(d), "three hours" substituted for "thirty-six hours"
Remove intimate imagery or impersonation, on the person's complaint | **2 hours** | The same | 3(2)(b), "two hours" substituted for "twenty-four hours"

**Source** `[M]`: the MeitY consolidated text "updated as on 10.02.2026", opened 18 September 2026 at
`https://www.meity.gov.in/static/uploads/2026/02/550681ab908f8afb135b0ad42816a1c9.pdf`. Every
change above is footnoted there "Subs. by G.S.R. 120(E), dated 10.02.2026".

**Corrected 18 September.** This table used to read 15 days, 72 hours and 36 hours. Those were the
6 April 2023 text, which G.S.R. 120(E) replaced. **The 2-hour and 3-hour clocks cannot be met by a
person reading email.** `INFERENCE:` they need an unpublish switch the officer can reach from a phone.
The same stale figures sit in `38-INCIDENT-AND-SEVERITY.md` and the plan's section 23, outside this file.

`UNVERIFIED:` whether frontmatter is an intermediary for published pages at all, and which of the
five clocks bind a service of our size. needs: legal opinion. **Build to all five meanwhile.**

**The consumer rules add a second, slower set**, at a 48-hour acknowledgement and a one-month
resolution. **Build to the tighter of the two**, which is the IT Rules set above, and the slower
one is satisfied automatically.

### 3.4 Retention and deletion, as promised in the data model

Every row here is a promise made in `docs/mvp0/PRODUCT-PLAN.md` section 18 and has to survive contact
with a deletion request.

Thing | Retention | On account deletion
Account and profile | Until deleted | **Removed within 30 days**
Documents and versions | Until deleted; 30 days in trash | Removed
Ledger entries | 180 days, then aggregated | **Aggregates kept without the account id**
Plan and invoice records | At least the statutory period | **Kept as the law requires, unlinked from the profile**
Security log | 180 days rolling | Kept for the period
Local drafts | Until synced or evicted | **Not ours.** They live on the device
The mirror's files in the person's GitHub or Drive | Theirs | **Left in place**, proposed 18 September for founder review. We revoke our access and stop writing. Section 3.6
The mirror's records on our side | Until disconnected | Removed, after the grant is revoked at the provider

**Two of those rows are exceptions to "delete everything", and both are deliberate.** An invoice
is a statutory record and an aggregate is not personal data once the account id is gone. **Say so
in the privacy notice rather than promising a clean sweep.**

### 3.5 Where the bytes physically sit

The plan's stack puts storage and compute in Mumbai. `docs/mvp0/PRODUCT-PLAN.md` section 23 requires the
security log in Indian jurisdiction, so the location is a compliance fact rather than a latency
one.

**Corrected 18 September: Cloudflare cannot pin R2 or Durable Objects to India** `[M]`. Opened on
18 September 2026:

Service | What its data-location page offers | Source
R2 | Location hints `wnam`, `enam`, `weur`, `eeur`, `apac`, `oc`. A hint is "only honored the first time a bucket with a given name is created". Jurisdictions `eu` and `fedramp` only | `https://developers.cloudflare.com/r2/reference/data-location/`
Durable Objects | Jurisdictions `eu` and `fedramp` only | `https://developers.cloudflare.com/durable-objects/reference/data-location/`
Firestore | `asia-south1` is listed as Mumbai, `asia-south2` as Delhi | `https://firebase.google.com/docs/firestore/locations`

**So "R2 in Mumbai" is not a setting that exists.** The nearest is the `apac` hint, which names a
region, not a country, and guarantees nothing. **The security log that CERT-In direction (iv) wants
"within the Indian jurisdiction" therefore goes to Firestore in `asia-south1`**, not to R2.
`resolved (proposed 18 Sep, founder review)`. The rejected alternative was an `apac` R2 bucket,
which cannot show a country.

`UNVERIFIED:` whether "maintained within the Indian jurisdiction" is about where the bytes sit or
about being producible to CERT-In on demand. needs: legal opinion. Firestore in Mumbai satisfies both
readings, which is why it is chosen.

### 3.6 What the mirror changes, decided 18 September

**D03** `[Z]`: our copy in R2 and Firestore is canonical, and a full mirror sits in the person's own
GitHub repository or Drive folder, on both plans. `56-OPEN-DECISIONS.md` section 0.

Question | Answer
Does the mirror reduce our exposure? | **No.** We still hold every byte, so we are still the Data Fiduciary for all of it. DPDP section 8(1) keeps us responsible "irrespective of any agreement to the contrary"
What does it add? | A scoped grant stored in `users/{uid}/connections`. Drive's refresh token is encrypted at rest; GitHub stores no token, `34-INTEGRATIONS.md`
Whose are the mirror's files? | **The person's**, in their own account, under their provider's terms. They survive our shutdown
Deletion | Account deletion revokes our grant and removes our records. **The mirror's files are left in place**, `resolved (proposed 18 Sep, founder review)`, because they are the person's copy in their own account, and deleting them would need a grant we have just revoked. Rejected: deleting the mirror first, which destroys the one copy that survives us. The privacy notice says it in plain words, and section 8 already forbids promising otherwise
Erasure of one document | Removed from our copy. `INFERENCE:` whether the mirror copy is also removed is a product choice for `67-SYNC-AND-CONFLICT.md`; the notice must match it
Export | The mirror is a standing export in markdown, which meets GDPR Article 20's "machine-readable". Export on request still works without a connection
Drive scope | `drive.file` only. The full `drive` scope would bring a yearly CASA assessment, and is never requested

**The source.** `docs/research/2026-09-18-storage/STORAGE-BENCHMARK.md` section 5, which opened the
Act and GDPR on 18 September. `INFERENCE:` its reading that mirroring is a trust argument, not a
compliance one, is carried here. No lawyer has read it.

---

## 4. Model providers, and what we may never train on

### 4.1 The promise

**The sign-in page says we never train on documents.** That is not a setting. It is a claim about
which providers are in the chain, and `docs/mvp0/PRODUCT-PLAN.md` section 30 names it as one of the
three things the configuration panel cannot absorb.

**So the rule is absolute: a provider whose terms nobody has opened cannot be switched on.** S36
renders that as a row that cannot be enabled.

### 4.2 Providers that state they do not train

Each sentence copied from the provider's own page, opened 2026-09-18, recorded at
`docs/research/2026-09-18-llm/raw/L1-free-providers.md:918`.

Provider | The sentence
**Groq** | "For clarity, Groq is not permitted to use Inputs or Outputs for training or fine-tuning any AI Model Services or other models, unless explicitly granted permission or instructed by Customer."
**Cloudflare Workers AI** | "Cloudflare does not use your Customer Content to (1) train any AI models made available on Workers AI or (2) improve any Cloudflare or third-party services, and would not do so unless we received your explicit consent."
**Scaleway** | "Your data is not used for training, retraining, or improving the base models." And: "We do not collect, read, reuse, or analyze the content of your inputs, prompts, or outputs generated by the API."
**Cerebras** | "For clarity, the foregoing does not grant Cerebras the right to use Service Content for the purpose of training or fine-tuning models."

**Cloudflare's developer platform terms carry a second, separate clause**, opened by the plan on
17 September: "Unless otherwise agreed, Cloudflare does not use any Customer Content to train
generative AI tools".

### 4.3 Providers that are disqualified, and the exact reason

Provider | The sentence that disqualifies it
**Google AI Studio and the Gemini free tier** | "Google uses the content you submit to the Services and any generated responses to provide, improve, and develop Google products and services and machine learning technologies". And: "To help with quality and improve our products, human reviewers may read, annotate, and process your API input and output." And: "Do not submit sensitive, confidential, or personal information to the Unpaid Services."
**Cohere trial keys** | Grants itself the right to "IMPROVE AND ENHANCE THE SERVICES AND COHERE'S OTHER OFFERINGS AND BENCHMARK THE FOREGOING, INCLUDING BY SHARING API DATA AND FINETUNING DATA WITH THIRD PARTIES"
**NVIDIA NIM** | "modify and improve NVIDIA products or services". And separately bans the data class outright: "does not include any confidential information"
**Mistral** | **Trains by default on the free tier**, opened 18 September 2026 `[M]`. The help article at `https://help.mistral.ai/en/articles/347617-do-you-use-my-user-data-to-train-your-artificial-intelligence-models` says of Mistral Studio Free mode: "we may use your data (input and output) to train our artificial intelligence models", with a right to opt out. The commercial terms, section 4.2, train on a product "set to opt-out by default" unless you opted out, and always on "Labs or Preview Models". `resolved (proposed 18 Sep, founder review)`: disqualified. An opt-out is a toggle nobody audits, and the Labs clause ignores it. Rejected: enabling it with the opt-out recorded
**OpenRouter free endpoints** | OpenRouter's own logging is off by default, but it disclaims the providers behind it: "OPENROUTER MAKES NO REPRESENTATION OR WARRANTY REGARDING ANY MODEL PROVIDER'S DATA HANDLING, RETENTION, TRAINING, SECURITY, AVAILABILITY, OR INTELLECTUAL PROPERTY PRACTICES."

### 4.4 The audit rule that came out of this, and it is the useful part

**Every disqualification above uses the same three words: improve our products.** Not one says it
will train on your data.

- Google says "improve and develop".
- Cohere says "IMPROVE AND ENHANCE".
- NVIDIA says "modify and improve".

**The clean four are clean because they name the act.** Groq says "training or fine-tuning".
Cloudflare says "train any AI models". Scaleway says "training, retraining, or improving the base
models". Cerebras says "training or fine-tuning models".

> **When auditing a new provider, search its terms for "improve", not for "train".**

### 4.5 Two commercial-use traps that cost a provider you could have used

Both providers carry a personal, non-commercial clause **that binds the website, not the API**.

- **Groq's** Terms of Use grant a licence "to access and use the Websites for your personal,
  non-commercial use only". Three paragraphs above, the same document says: "These Terms do not
  apply to you in connection with your use of Groq's cloud services, including GroqChat, Groq
  Playground, and GroqCloud."
- **Cerebras's** site terms say the same about "Site Content", and then add in the same paragraph:
  "The foregoing provision does not apply to the Service or Service Content."

**Read who the clause binds before believing it.** `INFERENCE:` this is the most-repeated error in
third-party summaries of free model tiers, and it errs in the direction that costs you a provider.

### 4.6 What actually restricts us

Constraint | Provider | **What it forbids**
Geography, absolutely | Google | "You may use only Paid Services when making API Clients available to users in the European Economic Area, Switzerland, or the United Kingdom"
Data class | NVIDIA | Sending anything confidential at all
Competitor clause | Cohere | Use "for the use or benefit of any direct competitor to Cohere", which includes any entity offering large language models
**Indemnity, not prohibition** | Groq | Section 15.3 excludes free cloud services from the intellectual-property indemnity. Free use is allowed, and if an output attracts a claim, Groq does not defend you
Revocability | Cerebras, NVIDIA | Either may stop the free tier with no notice

**The indemnity row is the real commercial cost of a free tier, and it is the same on every one of
them.** Nobody defends you on the free plan.

### 4.7 A machine-readable starting filter, with its caveat

`https://openrouter.ai/api/frontend/v1/all-providers` carries a `training` boolean and a retention
period for **88 providers**, opened 2026-09-18. Exactly **four** are flagged as training:
DeepSeek, Liquid, NVIDIA, Thinking Machines. **41 of the other 84** are flagged zero retention.

**Use it as the starting filter and never as the final one.** OpenRouter disclaims it, and it
already contradicts Google's own terms about Google AI Studio.

`INFERENCE:` a nightly job could diff that endpoint and raise an alert when a provider in our
chain changes its answer. That is cheap and nobody has built it.

### 4.8 Two providers that left

- **GitHub Models was retired on 30 July 2026**, and directories still list it.
- **Chutes.ai's free tier is gone**, in the provider's own words.

**So the chain needs a re-read on a schedule, not once.** The plan already says terms are re-read
monthly and the date recorded.

---

## 5. Payments

Constraint | Value | Source | **What it forbids**
Mandate ceiling without an additional factor | **15,000 rupees a transaction** | Reserve Bank of India circular RBI/2022-23/73 of 16 June 2022, re-opened by the plan on 17 September | Any single recurring debit above it
Attempts on an Indian card | **One** | The same circular | A retry ladder
Pre-debit notice | **24 hours** | Razorpay mandate rules | Debiting without notice
Card data on a free Cloudflare property | **Forbidden** | Cloudflare self-serve agreement clause 2.2.1(h): you may not "process or collect personal or business credit card information on any web property that is receiving Free Services" | Any card field on our own pages. Card entry stays on Razorpay's own checkout, or the zone moves to a paid plan

**That Cloudflare clause is the one most likely to be tripped by accident**, because it reads like
a payments rule and is actually a hosting rule. A card field anywhere on a zone on the free plan
breaches it, whoever processes the card.

### 5.1 Tax

**18 per cent is the working assumption**, opened by the plan on CBIC's tax information portal on
17 September because `cbic-gst.gov.in` refused `curl`:

- Notification 11/2017-Central Tax (Rate) of 28 June 2017, serial 22, "Heading 9984
  Telecommunications, broadcasting and information supply services", central tax 9, so 18 per cent
  with the state half.
- The two 2025 amendments, 05/2025 of 16 January and 15/2025 of 17 September, carry **no entry**
  for heading 9984.

**The 2026 rate notification is closed** `[M]`: 01/2026-Central Tax (Rate) of 30 April 2026 amends
only the goods schedule 9/2025, and 11/2017 has no 2026 amendment on record. Opened 18 September
2026 at `https://nityalegal.com/notifications.html`, a Gazette-copy index.

**One thing stays open.** `UNVERIFIED:` which heading a subscription editor falls under. needs: a
chartered accountant's opinion. It sits in `L06`.

---

## 6. Accessibility

Standard | State
**WCAG 2.2 AA** | **Adopted as the target for every screen.** The screen generator asserts contrast at 4.5 to 1 and throws below it, which is a real gate rather than an intention
**IS 17802 (Part 1): 2021, tested to (Part 2): 2022** | Added as a second target, because the draft rule names it
Rights of Persons with Disabilities Act 2016, section 46, with rule 15 | **A counsel question**, `L11`

**The draft amendment that would settle it the wide way**, opened by the plan from the Gazette:
the draft Rights of Persons with Disabilities (Amendment) Rules, 2026, CG-DL-E-23072026-274669 of
23 July 2026. It would replace rule 15(1)(c) with accessibility standards for "websites, mobile
applications, tablet applications, other touch-based applications, softwares" made available "to
persons in India for public or consumer use, whether such establishment is located within India or
outside India", on IS 17802, with an Accessibility Conformance Report "in both human-readable and
machine-readable formats".

**It is a draft under consultation, not law.** The plan's response is to test to IS 17802
alongside WCAG from the first screen rather than wait, which costs nothing now and a great deal
later.

---

## 7. Licences we carry

From `THIRD-PARTY-NOTICES.md` at the repository root, which the published-page footer and the
desktop About panel link once those ship.

### 7.1 Fonts

Font | Licence | Note
**Google Sans Code** | SIL Open Font License 1.1 | Copyright 2025 The Google Sans Code Project Authors. Licence text is carried in full in the notices file
**Google Sans Flex** | SIL Open Font License 1.1 | Copyright 2015 The Google Sans Flex Authors
**"Google Sans"**, the family the app loads through Google Fonts | **SIL Open Font License 1.1** `[O]` | `google/fonts` holds `ofl/googlesans/OFL.txt`: "Copyright 2025 The Google Sans Project Authors", licensed under OFL 1.1, with no Reserved Font Name per its `TRADEMARKS.md`. The file has commits from 11 September 2026, so the 17 September search missed it. Checked with `gh api repos/google/fonts/contents/ofl/googlesans` on 18 September. `THIRD-PARTY-NOTICES.md` should gain this text, outside this file
**Mosvita** | **None producible** | Was embedded in print files before 17 September. **Removed.** Do not re-embed it

### 7.2 Icons

**Material Symbols**, the Rounded set at weight 400, **Apache License 2.0**. Delivered as SVG path
data in `src/shared/presentation/material-symbol-paths.ts` and inline in the screens.

### 7.3 Libraries

Licence | Libraries
Apache 2.0 | pdf.js, Tesseract.js
MIT | KaTeX, Mermaid, Excalidraw, Marp core, markmap, Paged.js
BSD-2-Clause | mammoth
**GPL-2.0** | **Pandoc**, server side only

**The Pandoc row is the one to watch.** A copyleft licence on a server-side binary is fine while it
stays a separate process and is never linked into the application. **Linking it would change our
obligations**, so do not.

**And one row that is not a licence at all.** Shapes, not code, were taken from `obsidian-kanban`
(GPL-3.0) and `obsidian-charts` (AGPL-3.0). **No code from either is in this repository**, and
copying code from either would import their copyleft.

---

## 8. What this forbids, as one list

For a reader who wants the constraints without the reasoning.

- **Never** send a user's document to a model provider whose terms have not been opened and quoted.
- **Never** enable a provider in the chain on the strength of a third-party summary.
- **Never** put a card field on any page of a Cloudflare zone on a free plan.
- **Never** attempt a recurring debit above 15,000 rupees, or retry a failed one on an Indian card.
- **Never** pre-tick a consent box.
- **Never** serve a published page without a route to complain about it.
- **Never** accept a European sign-up while `L04` is open.
- **Never** promise a clean deletion sweep, because invoices and aggregates survive it by law.
- **Never** promise that deleting an account deletes the person's GitHub or Drive mirror. It does not.
- **Never** request the full `drive` scope. It brings a yearly third-party assessment.
- **Never** re-embed Mosvita.
- **Never** link Pandoc into the application, or copy code from `obsidian-kanban` or
  `obsidian-charts`.
- **Never** change the age floor retroactively for people who signed up under the old one.
- **Never** ship a screen whose contrast has not been asserted.

---

## 9. Limits of this file

**What was not assessed.**

- **No lawyer has read any of this.** Every reading is a founder's or a research agent's, from a
  primary page, and that is not the same thing.
- No jurisdiction outside India, beyond the European blocking row `L04`.
- No employment, contractor or data-processing agreement templates exist.
- No cyber-insurance position.

**What could not be verified.**

- The IT Rules 2021 and CERT-In readings were re-opened on 18 September. The IT Rules clocks were
  stale and are corrected in section 3.3. CERT-In's six hours and 180 days held, below `L05`.
- `UNVERIFIED:` the tax heading, section 5.1. needs: a chartered accountant's opinion.
- Mistral's default was opened on 18 September: opt-out, so it trains. Section 4.3.
- The "Google Sans" family licence was found on 18 September: OFL 1.1, section 7.1.
- Firebase's terms page rendered to `curl` on 18 September `[M]`, `https://firebase.google.com/terms`,
  "Terms last modified: September 02, 2026". Cloud Firestore and Firebase Authentication sit under
  the **Google Cloud Platform Terms of Service**, and use must be for "trade, business, craft, or
  profession". Footnote 1: without a Data Location Selection, "Google may process and store Customer
  Data anywhere". **So Firestore's location must be chosen as `asia-south1` at creation**, section 3.5.
  `UNVERIFIED:` whether Firebase Authentication's user records honour that selection. needs: the
  Google Cloud location terms read by counsel under `L08`.
- Whether a subscription editor is an e-commerce entity under the consumer rules. The text was
  opened on 18 September `[M]`, `https://consumeraffairs.gov.in/public/upload/files/E%20commerce%20rules_1732703966.pdf`.
  Rule 2(1)(a) applies them to "all goods and services bought or sold over digital or electronic
  network including digital products". Rule 3(1)(b) defines the entity as "any person who owns,
  operates or manages digital or electronic facility or platform for electronic commerce". Rule 4
  sets the 48-hour acknowledgement and one-month resolution. `INFERENCE:` a paid subscription sold
  on our own site reads as inside rule 2(1)(a). `UNVERIFIED:` whether it binds us. needs: legal
  opinion. `L12` already builds the duties either way.
- The DPDP transfer texts were opened on 18 September `[M]`. Act section 16(1), from
  `https://www.indiacode.nic.in/bitstream/123456789/22037/1/a2023-22.pdf`: the government "may, by
  notification, restrict the transfer" to a notified country. It is a negative list. Rules 2025
  rule 15, from the Gazette copy `https://egazette.gov.in/WriteReadData/2025/267650.pdf`, allows
  transfer subject to requirements the government may "specify in respect of making such personal
  data available to any foreign State". Rule 15 commences with rules 5 to 16, on 14 May 2027.
  `UNVERIFIED:` that no country is notified today. A search found secondary sources saying none as
  of August 2026, and no primary list exists to open. needs: legal opinion, rechecked before 14 May
  2027. The plan's position is to build to the duties either way.

**What would falsify it.**

- Counsel reading section 46 narrowly would remove `L11`'s urgency. Reading it widely, or the draft
  rule landing as drafted, would make an Accessibility Conformance Report a shipping requirement.
- A provider in section 4.2 changing its terms would break the training promise on the sign-in page
  without any code changing. **That is why section 4.7's nightly diff is worth building.**
- A chartered accountant reading a different tax heading would change every net figure in
  `53-PRICING-AND-ENTITLEMENTS.md`.
