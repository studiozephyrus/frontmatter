I made no writes, commits, or mutating commands — only `wc` and three `Read` calls on the research files; the reported dirt predates this run.

## 37. Roles, permissions and sharing

### 37.1 The layering rule

Our data lives in the user's git repository, which already has a permission model. There are three candidate postures — defer to the provider, duplicate its ACL into our database, or intersect the two. **We intersect on write, defer on connect, and own read-and-comment outright; frontmatter never grants more than git grants on a write, and may freely grant less.**

| Operation | Posture | Mechanism | Why | Anti-recommendation |
|---|---|---|---|---|
| Connect a repo | **Defer** | Only a GitHub identity holding `admin` on the repository may install the App and connect it. GitHub already defines that role, and managing access is Admin-only [fetched 2026-08-29, docs.github.com repository-roles-for-an-organization] | The App installation outlives any individual's access, so the grant must come from the role that can already grant durable access | Do NOT let a frontmatter Owner connect a repo they hold only Write on. That reproduces the deploy-key hazard GitHub itself warns about: "any user who has the private key can read from or write to the repository… even if they're later removed from the organization" [fetched] |
| Write bytes (splice commit) | **Intersect, evaluated at commit time** | The commit succeeds only if the acting identity *also* resolves to write access on the repo at the instant of the commit | The commit is already a network round-trip to the provider, so the authorisation check costs nothing extra [inference] | Do NOT pre-compute and cache the intersection. That is Sourcegraph's mirror architecture, whose documented worst case is "as long as the time it takes to completely sync all user or repository permissions" — their own worked example is 5000 users ÷ 40 users/min = **125 minutes** [fetched 2026-08-29, sourcegraph.com/docs/admin/permissions/syncing; arithmetic re-derived: 5000/40 = 125] [derived] |
| Read and comment | **Own** | frontmatter's own grants apply to frontmatter's rendered projection, not to the repo. No git account required | Requiring a GitHub account converts every client review into a GitHub onboarding. Decap exists for this reason: "Editors don't need an account on your Git hosting platform at all" [fetched 2026-08-29, decapcms.org/docs/turbo-how-it-works] | Do NOT require GitHub OAuth for a Viewer or Commenter |
| Commit attribution | **Duplicate deliberately** | The human's identity goes in the commit trailer even when the API call is made by the App installation | A repo where every commit reads as the App destroys `git blame` for the user's own file — which contradicts the projection law [inference] | Do NOT rely on the App identity alone, as Decap Turbo's server-side model does [fetched] |

- Do NOT adopt Notion's resolution rule. Notion states "Notion respects the **broadest** level of access given to a user" [fetched 2026-08-29, notion.com/help/sharing-and-permissions]. With git underneath, max-wins means a frontmatter grant can exceed a *revoked* GitHub grant — that is a privilege-escalation bug wearing a UX rationale [inference].
- Sources disagree on resolution and we are not splitting the difference: Notion resolves broadest-wins, GitBook resolves "by **precedence, not by the highest role** across every level" and documents that this surprises people [fetched 2026-08-29, gitbook.com/docs roles]. We take neither; intersect-with-provider is a third rule that neither product needs because neither sits on top of someone else's ACL.
- **Falsifier for the intersect rule:** if commit-time provider checks add more than 150 ms p95 to a splice write, or if GitHub's rate limits make per-write checks infeasible at 20 concurrent editors, the rule must move to a short-TTL cache with an explicit staleness bound stated in the UI — not to a full mirror.

### 37.2 Role model — four roles, one scope, no inheritance tree

| Role | Can | Cannot | Grounding | Anti-recommendation |
|---|---|---|---|---|
| **Owner** | Everything: connect/disconnect the repo, publish, unpublish, billing, delete workspace | — | Every product surveyed has exactly one terminal role; Figma binds it to a person — "There is only one owner per team" [fetched 2026-08-29, help.figma.com] | Do NOT allow multiple Owners at launch. With two, either can disconnect the repo the other depends on and there is no arbiter. Add co-owners when a customer raises bus-factor, not before |
| **Editor** | Read; write bytes (splice edits commit to the repo) | Change repo connection, billing, publish/unpublish | Write is the meaningful boundary because a write is a commit — an irreversible external side effect [inference]. GitHub Write, Notion Can edit, Outline `read_write`, GitBook Editor all sit here [fetched ×4] | Do NOT split Editor into GitBook's Editor/Reviewer/Creator ladder. That ladder gates change-request merges, a workflow we do not have; it buys three roles and zero enforced invariants |
| **Commenter** | Read; attach comments, which live outside the file and never in the bytes | Write bytes, publish | Present in Notion, Google, GitBook, Figma [fetched ×4]. Preserves the projection law: a comment is not a byte in the file [inference] | Do NOT ship a **Suggester** role. Google documents suggestion as a *mode*: "People can suggest edits when you give them permission to **comment on or edit**" [fetched 2026-08-29, support.google.com/docs/answer/6033474]. A fifth role adds a cell to every future permission matrix and buys nothing an in-editor suggestion mode does not |
| **Viewer** | Read | Comment, write, publish | A Commenter writes *some* record; a Viewer writes nothing. Google, Outline, GitBook and Figma all keep the two distinct [fetched ×4] | Do NOT merge Viewer into Commenter to save a role. The merged role cannot express "share the doc, no annotation trail", which is the entire client-review case |

Deliberate omissions, each with its trigger for reconsideration:

- **No Admin distinct from Owner.** At solo-founder scale the two resolve to the same person. Add when a customer has more than one workspace administrator [inference].
- **No Triage/Maintain analogue.** GitHub needs them because issues and releases exist; we have neither [inference].
- **No per-folder or per-document roles at launch.** Every surveyed product with three or more scope levels ships a permissions debugger — Confluence ships two, "People who can view" and "Inspect permissions" [fetched 2026-08-29, confluence.atlassian.com/doc/permissions-and-restrictions-139557.html]. **A model that needs a debugger is a model too complex to reason about unaided** [inference]; if we ever need one, the model is already wrong.
- **No groups or teams.** Groups are the mechanism behind Confluence's documented union trap: "You may have revoked permission for that individual user to add pages… but if they're a member of a group that *is* allowed to add pages, they'll still be able to create new pages" [fetched]. Add groups when per-person grants become tedious, which is above roughly 15 people [inference].
- **No subtractive per-document restriction.** Google removed downward file-level overrides — "You can no longer give someone **less** access to an individual file if they have higher access to its parent folder" [fetched 2026-08-29, support.google.com/drive/answer/2494822]. Two of the three surveyed products that had subtraction have restricted or removed it [derived].

### 37.3 Sharing and revocation

- **Exactly two published states, never three:** `private` and `published-at-slug`. Do NOT ship an "anyone with the secret link" third mode. Notion documents the failure in its own help text: "Even if your Notion Site has been unpublished, it's possible your page's general access settings have been set to Anyone on the w[eb]" [fetched] — unpublishing one channel revokes nothing on the other.
- **We have already paid for a dual-channel revocation gap once.** `unpublish` called `revalidatePath('/p/<slug>')` while the live ISR page served at `/<slug>` with `revalidate = 60`, so unpublishing purged nothing and the note kept serving from cache [fetched 2026-08-29, commit `d50a6b2`, message §6.4].
- **Revocation is a purge and must be verified, not reported.** The DELETE handler already reads the slug before removal specifically so it can purge [measured 2026-08-29, `src/app/api/share/route.ts`]. Add a post-unpublish fetch of `/<slug>` asserting HTTP 404, and refuse to report "unpublished" until it does. Do NOT treat the `revalidatePath` return value as success.
- **Slug entropy.** The slug field is currently 1–60 characters of user-chosen text [measured, `postSchema` in `route.ts`]. If any unlisted-URL mode ever ships, its token must be ≥128 bits: 5–6 character tokens "can be scanned using brute-force search… effectively public", and 7% of exposed OneDrive accounts in that study were **writable** [fetched 2026-08-29, arXiv 1604.02734, Georgiev & Shmatikov, published 2016-04-10].
- **Slug reuse:** never free a slug on unpublish. Notion refuses reuse after deletion [fetched]; a freed slug means a stale inbound link resolves to a different document.
- **Publish exactly one file, never a subtree.** Notion's rule — "Publishing a Notion page to the web means all of its subpages will be published too" [fetched] — in a git repo means publishing the rest of the user's repository.
- **Strip commit-author email addresses from the public projection by default.** A published projection of a git repo leaks them by construction; Notion warns about exactly this class, noting published-page metadata includes contributors' "names, profile photos, and **email addresses**" [fetched]. Do NOT expose a per-document toggle — a default-off privacy control that can be flipped per document is a leak generator.
- **Link expiry is a safety default, not an upsell.** Google gates expiry to eligible work/school accounts [fetched], with the result that most links never expire.

### 37.4 Invites and billing

| Step | Rule | Anti-recommendation |
|---|---|---|
| Invite | Owner enters an email, picks one of four roles, sends. Expires in **7 days** (GitHub's documented value [fetched 2026-08-29]) and is retryable | Do NOT ship a secret join link or allowed-domain auto-join. Both of Notion's automatic paths convert a person into a **billable member** without per-person approval [fetched]; for a solo founder selling globally that is a refund and a chargeback, not a growth loop |
| First read | A Viewer or Commenter reads the document **before authenticating** | Do NOT gate reading behind signup. Notion requires the guest to hold an account [fetched]; that is where a client review dies |
| Auth | Editor authenticates with GitHub OAuth (required by the write-time intersect). Viewer/Commenter uses email auth, no GitHub [inference from §37.1] | — |
| Billing: Owner, Editor | Billed per seat. These identities write bytes and consume commit budget [inference] | Do NOT bill per repo or per document; per-repo pricing punishes exactly the git-native user we want |
| Billing: Commenter, Viewer | **Never billed.** Figma: "you can let others **view and comment** on your files without purchasing extra seats"; Notion: "Guests are free of charge" [both fetched 2026-08-29] | Do NOT copy GitBook (guests and readers billed) or GitHub ("adding an outside collaborator to a private repository will **use one of your paid licenses**") [both fetched]. But free commenters are an abuse surface — cap comment volume **per workspace**, never silently convert the cap into a seat charge |
| Billing: external Editor who already has GitHub write | Billed as an Editor seat | Do NOT exempt them because "GitHub already authorised them". That gives any org with a large GitHub team unlimited free Editors |
| Time-boxed collaborator | Editor-equivalent, hard expiry ≤1 year, **no seat** — Notion's "Temporary members don't use a paid seat" pattern [fetched] | Do NOT make it renewable in-product. A renewable free Editor is a free plan with extra steps |

Recorded and unresolved: Figma's pricing page simultaneously states view-and-comment needs no extra seat *and* sells a Collab seat at $3/mo Professional, $5/mo Organization, $5/mo Enterprise against Full seats of $16/$55/$90 [fetched 2026-08-29, figma.com/pricing]. Collab as a fraction of Full: 3/16 = 18.8%, 5/55 = 9.1%, 5/90 = 5.6% [derived]. There is no industry norm on guest billing to copy — two of six surveyed products bill guests, three do not, one is self-contradictory [derived].

No invite-to-activation conversion figure appears in this section, because no primary source for one was reachable; every available number was a vendor marketing page or a secondhand blog [SS — must not be published as fact].

## 44. Trust, safety and abuse

### 44.1 What is legally required the day a stranger publishes a page

**India — binding, because the founder is an Indian intermediary.** s.79(1) IT Act 2000 grants immunity for third-party information; s.79(2)(c) makes it conditional on due diligence "and also such other guidelines as the Central Government may prescribe" — the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, G.S.R. 139(E) dated 25.2.2021, MeitY PDF updated as on 6.4.2023 [fetched 2026-08-29]. s.79(3)(b) removes immunity if, on actual knowledge, removal is not expeditious "without vitiating the evidence in any manner" [fetched]. There is no §230 equivalent; losing safe harbour makes the founder a co-defendant on the underlying claim [inference].

| Obligation | Rule | Clock |
|---|---|---|
| Publish rules, privacy policy, user agreement | 3(1)(a) | at launch |
| Reasonable efforts not to host the 11 enumerated categories, incl. (xi) "violates any law for the time being in force" | 3(1)(b) | continuous |
| Inform users of termination right | 3(1)(c) | annually |
| Remove on court order / Government notification | 3(1)(d) | **≤36 hours** |
| Preserve removed information and associated records | 3(1)(g) | **180 days** |
| Retain registration info after cancellation | 3(1)(h) | **180 days** |
| Provide info/assistance to a lawfully authorised agency on written order | 3(1)(j) | **≤72 hours** |
| Publish Grievance Officer name and contact on the home page (or one click from it, per the Explanation) | 3(2)(a) | at launch |
| **Acknowledge every grievance** | 3(2)(a)(i) | **≤24 hours** |
| Resolve grievance | 3(2)(a)(i) | **≤15 days** |
| Resolve a 3(1)(b) removal request, except sub-clauses (i), (iv), (xi) | 3(2)(a)(i) proviso | **≤72 hours** |
| Remove NCII / nudity / sexual act / impersonation incl. morphed images, on the individual's complaint | 3(2)(b) | **≤24 hours** |
| Provide the complaint mechanism for 3(2)(b) | 3(2)(c) | at launch |

- Rule 4 (Chief Compliance Officer, 24×7 nodal contact, Resident Grievance Officer, monthly compliance report) binds only a **significant social media intermediary**, defined by a threshold "as notified by the Central Government" (Rule 2(1)(v)) that is not in the Rules [fetched]. The commonly cited 50 lakh figure is [SS] and must not be published as fact. It is also unsettled whether a publishing tool is a "social media intermediary" at all under Rule 2(1)(w), which requires a service that "primarily or solely enables online interaction between two or more users" — publishing is one-to-many [inference].
- CERT-In Directions under s.70B(6) dated 28.04.2022: report listed incident types **within 6 hours of noticing**; maintain ICT logs for a **rolling 180 days, within Indian jurisdiction** [fetched]. That last clause conflicts with a default Cloudflare R2 + Workers stack, which does not pin storage to India by default [inference].
- Rule 3(1)(g)'s 180-day preservation duty contradicts a "we delete what you delete" promise. Name the conflict in the privacy policy rather than let a user discover it [inference].

**European Union — DSA, Regulation (EU) 2022/2065, applicable from 17 February 2024 (Art 93(2))** [fetched 2026-08-29, EUR-Lex CELEX 32022R2065].

| Applies? | Article | Substance |
|---|---|---|
| Yes | 11 | Single point of contact for Member State authorities, Commission, Board; state the languages accepted |
| Yes | 12 | Single point of contact for users, "not solely rely on automated tools" |
| Yes | **13** | **Legal representative in a Member State**, mandatory with no EU establishment; notify the Digital Services Coordinator; the representative can be held liable |
| Yes | 14 | T&Cs disclosing restrictions, moderation policies, procedures, tools, algorithmic decision-making, human review; machine-readable |
| **No** — Art 15(2) | 15 | Annual transparency report |
| Yes | **16** | Notice-and-action: easy, electronic-only, four required elements; confirm receipt without undue delay; Art 16(3) — a compliant notice **creates actual knowledge for Art 6** |
| Yes | **17** | Statement of reasons for *every* restriction, six specified elements |
| Yes | 18 | Notify law enforcement on suspicion of an offence threatening life or safety |
| **No** — Art 19(1) | 20–28 | Internal complaint system, out-of-court dispute settlement, trusted flaggers, misuse suspensions, transparency reports, dark patterns, ads, recommenders, minors — all excluded |
| Yes | 24(3) | Supply average monthly active EU recipients on request |

Micro/small per Commission Recommendation 2003/361/EC Art 2: small = fewer than 50 persons **and** turnover or balance sheet ≤ €10m; micro = fewer than 10 **and** ≤ €2m; the exclusion survives 12 months past losing the status [fetched, CELEX 32003H0361 + DSA Art 19(1) second sub-paragraph]. Maximum fine 6% of annual worldwide turnover, 1% for incorrect or incomplete information (Art 52(3)) [fetched]. Net EU surface: **Arts 11, 12, 13, 14, 16, 17, 18, 24(3)** — materially smaller than the popular reading of the DSA.

**United States.**

| Obligation | Cite | Detail |
|---|---|---|
| Designate a DMCA agent | 17 U.S.C. §512(c)(2) | Publish contact on the site **and** register with the Copyright Office [fetched] |
| Fee | copyright.gov fee schedule | **$6** per designation, amendment or resubmission [fetched 2026-08-29] |
| Renewal | 37 CFR §201.38(c)(4) | Expires and becomes invalid **three years** after registration unless renewed [fetched] |
| Repeat-infringer policy | §512(i)(1)(A) | Adopted, **reasonably implemented**, users informed [fetched] |
| Counter-notice restore window | §512(g)(2) | "not less than 10, nor more than 14, business days" [fetched] |
| CSAM reporting | 18 U.S.C. §2258A(a)(1) | Report to the NCMEC CyberTipline "as soon as reasonably possible after obtaining **actual knowledge**" [fetched] |
| No monitoring duty | §2258A(f) | Nothing requires monitoring, screening or scanning [fetched] |
| Preservation | §2258A(h)(1) | A submitted report is a request to preserve **1 year**, raised from 90 days by Pub. L. 118–59 (REPORT Act, 2024) [fetched] |
| Penalty | §2258A(e) | First knowing and wilful failure up to **$600,000** (<100M MAU); second or subsequent **$850,000** [fetched] |

Whether §2258A reaches an India-incorporated provider with no US establishment is genuinely contested — the statute defines "provider" by service type, not nationality [fetched text; extraterritorial reach = inference]. Do not state it as settled either way; it is practically moot because the US host contractually requires the same outcome.

**Hosting terms transfer the liability to us.** Cloudflare Service-Specific Terms, last updated **June 02, 2026**: "you are solely responsible for the acts of your End Users"; phishing prohibited; deceptive subdomains prohibited with immediate suspension or termination; content Cloudflare deems illegal "may be blocked or removed… without notice"; Cloudflare "has the right, but not the obligation" to act; 30 days' content access post-termination [fetched]. Vercel ToS, last updated **June 1, 2026**: §15 indemnity for claims arising out of Your Content; §8 permits prohibiting use Vercel believes may be "(or is **alleged** to be)" in violation; on Hobby or trial-Pro plans Vercel "may use Your Content to train our artificial intelligence… and share Your Content with third parties" — disqualifying for a product whose pitch is that the file is the user's source of truth [fetched].

### 44.2 Minimum viable apparatus

| Component | Driven by | Minimum shape |
|---|---|---|
| Grievance Officer page: name, email, postal address, on the home page or one click from it | Rule 3(2)(a) + Explanation | Static page; the founder is the officer |
| Report form at a stable URL, linked from every published page footer | DSA Art 16 + Rule 3(2)(c) | Captures URL, category, reason, reporter name and email (optional for CSAE), good-faith attestation. Electronic only. Writes a ticket row |
| Auto-acknowledgement **within 24 h** | Rule 3(2)(a)(i) | Fires on submit, not on triage — the clock runs on acknowledgement, not on judgement |
| Statement of reasons on every enforcement action | DSA Art 17 | Templated email with the six Art 17(3) fields; fires on unpublish, demote, suspend, terminate |
| Takedown SLA ladder | strictest clock wins | NCII/impersonation **24 h**; most 3(1)(b) categories **72 h**; court or Government order **36 h**; everything else **15 days**; DMCA "expeditiously" |
| Preservation store | Rule 3(1)(g), §2258A(h)(1) | Removed bytes plus metadata, **180 days** (India) / **1 year** (post-CyberTipline), write-once, separate from the live bucket |
| Action log | Rule 3(1)(j), CERT-In | Append-only: who, what URL, what action, what time, on whose notice. **180 days rolling, stored in India** — a second store, not R2's default region |
| DMCA agent page, Copyright Office registration, repeat-infringer policy, counter-notice flow | §512(c)(2), (i), (g) | $6, renewed every 3 years |
| CSAM runbook | §2258A | Written: preserve, do not re-review, report to CyberTipline, hold 1 year, notify Cloudflare |
| EU legal representative | DSA Art 13 | Contracted third party in one Member State; notify that state's DSC |
| Appeals | *not* required — Art 20 excluded by Art 19 | One reply-to address. Write.as's "we're happy to listen to your appeal" is the ceiling [fetched] |
| **Do not build**: internal complaint-handling system, ODR membership, trusted-flagger channel, transparency report, statements-of-reasons database feed | Art 15(2), Art 19(1) | Excluded while micro/small |

### 44.3 Abuse vectors ranked for this product

| # | Vector | Control |
|---|---|---|
| 1 | **SEO spam / backlink farms** — zero-cost, automatable, the one thing a free publishing URL is unconditionally good for. Write.as: "This isn't a free place for building backlinks"; Bear: "Bear isn't a content distribution channel" [both fetched] | `X-Robots-Tag: noindex` on every page; `rel="nofollow ugc"` on outbound links; publishing gated behind a paid account; per-account publish rate limit |
| 2 | **Phishing lures** — APWG observed **989,123 phishing attacks in Q4 2024** [fetched, report published 19 March 2025]. The settled no-client-side-execution rule kills the JS vector but not this one; a static page with a borrowed logo and one outbound link is a working lure | Strip raw HTML and `<form>` at render; reputation-check the outbound links on publish; block deceptive slugs (Cloudflare requires this of us anyway) |
| 3 | **Copyright infringement** — highest-volume legitimate complaint class for any text host | DMCA agent, notice/counter-notice, repeat-infringer termination |
| 4 | **Doxxing / targeted harassment** — harshest clock: 72 h under the 3(2)(a) proviso, 24 h if it shades into impersonation | Named category in the report form routing to the 24/72 h lane; unpublish first, adjudicate second |
| 5 | **NCII / morphed sexual imagery** — Rule 3(2)(b) gives **24 hours** and no discretion | Ban explicit sexual imagery on the published surface in v1. A policy line is cheaper than a 24-hour clock |
| 6 | **Malware / payload staging** | Published assets limited to rendered HTML plus an image allowlist verified by magic bytes; no arbitrary file publishing |
| 7 | **Brand impersonation on a subdomain** — Cloudflare terminates *our* account for user-chosen deceptive subdomains [fetched] | System-assigned slugs in v1; no vanity subdomain |
| 8 | **Defamation** — no §230; a court order starts a 36 h clock | Court-order intake path. Do not adjudicate truth |
| 9 | **CSAM** — lowest likelihood on a text-first surface, unbounded consequence. CyberTipline received **20.5 million reports in 2024**, down from **36.2 million in 2023**; 2025 ESP reports carried **61.8 million files** [fetched] | Written runbook; no arbitrary image upload on any free tier in v1 |
| 10 | **Resource abuse / hotlinking** — R2 egress is free, Workers requests are not | Per-account request cap; cache aggressively |

### 44.4 Honest cost

Build, one-time founder-hours [derived, arithmetic shown]: ToS/Privacy/AUP drafting 12 + DSA Art 14 T&C 4 + report form and ticket store 10 + Art 17 statement generator 8 + moderation console 12 + preservation store and action log 8 + reputation check and noindex 8 + DMCA registration and notice page 2 + Grievance Officer page and 24 h auto-ack 4 + repeat-infringer/counter-notice flow 6 = **74 hours**.

Money, one-time: DMCA agent registration **$6** [fetched]. Indian counsel review ₹40,000–₹1,20,000 [SS, unverified]. EU Art 13 legal representative €200–€500/month [SS, unverified].

Run-rate is the real cost and it is not money. Rule 3(2)(a)(i) requires acknowledgement within 24 hours, every day, permanently [fetched] — **24 h × 365 days means no unbroken 48-hour offline window in a calendar year** [derived]. Per-report handling, triage plus decision plus an Art 17 statement, is roughly 20–40 minutes [inference, no measured baseline]. Volume is unknowable; stated as a replaceable assumption, at 1 report per 500 published pages [assumption, unverified] 5,000 pages/year yields 10 reports and about 5 hours, while 1 per 50 yields 100 reports, about 50 hours, plus the on-call tax. The variance, not the mean, is what breaks a solo founder. Add the renewal tax (DMCA every 3 years, annual user notification under 3(1)(c) and 3(1)(f)) and the uninsured line item: Cloudflare may act without notice, at account level, on its sole judgment, for our users' acts.

Comparables span two orders of magnitude. Bear Blog ships a roughly 350-word ToS dated 21 Aug 2022 plus a Code of Conduct v2 (28 Mar 2025), no takedown SLA, no appeals procedure, and an explicit refusal to provide one [fetched]. Mataroa has **no terms-of-service page at all** — HTTP 404 [measured 2026-08-29]. GitHub Pages carries roughly fifteen separate policy documents [fetched]. Neither Bear's operator nor Mataroa's is an Indian intermediary carrying a 24-hour statutory acknowledgement clock.

### 44.5 Recommendation

**Ship publishing in v1, but only the narrow surface:** paying accounts only, `noindex` by default, system-assigned slugs, no arbitrary file or image upload, raw HTML and `<form>` stripped at render, hard per-account page cap. The Grievance Officer page, report form, 24-hour auto-acknowledgement, DMCA agent, preservation store and Art 17 template all ship **before** the first stranger publishes.

The case for shipping: the abuse economics of a *paid* surface are inverted. Vectors 1, 2, 6 and 7 all depend on free, automatable, indexable, vanity-named pages; a credit card plus `noindex` plus a random slug removes the commercial motive, leaving the low-volume, legally well-defined DMCA lane. The 74 hours are one-time and mostly reusable plumbing. And a byte-preserving engine whose output nobody can see is a claim without a demonstration.

**The strongest counter-argument, which is the anti-recommendation: the 24-hour acknowledgement duty is not a feature that can be descoped.** It is a permanent, unbounded, personal on-call obligation; it starts the day the first stranger publishes and never ends; and the penalty for missing it is not a fine but the collapse of the s.79 safe harbour that separates "a user posted defamation" from "the founder is a co-defendant in an Indian court". Layer on the account-level third-party risk — one stranger's phishing page can take every paying editor customer offline without notice — and the shape is clear: a markdown editor with deep engine guarantees is a complete, sellable product without publishing, and adding publishing converts a software business into a moderation business with a software attachment. No amount of gating removes the on-call.

Record, do not resolve: whether publishing makes us a DSA "online platform" turns on the Art 3(i) "minor and purely ancillary feature" carve-out, untested for editor-with-publish products [fetched definition; application = inference]. Either way the EU is not the binding constraint, because Art 19's micro/small exclusion holds until 50 employees or €10m turnover. **India is the binding constraint, and the decision is about whether a solo founder will accept a 24-hour, 365-day acknowledgement duty.**

**Falsifier:** if a single month of live operation produces more than 8 reports per 1,000 published pages, or any acknowledgement is missed while the founder is asleep or travelling, publishing moves behind a manual approval queue — a human-reviewed publish request — rather than staying self-serve.

## 43. Internationalisation

### 43.1 Measured baseline

| Fact | Value | Evidence |
|---|---|---|
| `countWords` implementation | `src/modules/editor/presentation/EditorPane.tsx:31` → `trimmed.split(/\s+/).length` | [measured, read] |
| Pure-CJK paragraph, 41 code points, no spaces | `countWords` = **1**; `Intl.Segmenter('zh',{granularity:'word'})` `isWordLike` = **23** → **23× under** | [measured] |
| Japanese sample | 1 vs 15 → **15× under** | [measured] |
| Thai sample | 1 vs 8 → **8× under** | [measured] |
| Arabic sample | 4 vs 4 → **no error** | [measured] |
| MiniSearch default tokenizer | `SPACE_OR_PUNCTUATION = /[\n\r\p{Z}\p{P}]+/u`, `minisearch/dist/es/index.js:2002` | [measured] |
| `buildSearchIndex` tokenizer override | **none** — `search-index.ts:124` passes `fields/storeFields/idField` only | [measured] |
| Query `学习` against a doc containing `深度学习模型…` | default **0 hits**; bigram **1**; Segmenter **1** | [measured] |
| `<html lang="en">`, no `dir` | `src/app/layout.tsx:67` | [measured] |
| Installed `@codemirror/view` | 6.43.0 (npm latest 6.43.9, published 2026-08-16) | [measured] / [fetched] |
| Byte vs UTF-16 offset divergence | 67 of 1,080 corpus files have bytes == UTF-16 units → **93.80% diverge** (67/1080 = 0.06204) | [derived from measured header, `offsets.ts`] |
| CJK frontmatter keys rejected by `SAFE_KEY` | **905** oldwinter files | [measured] |

**Source disagreement, recorded not resolved:** the master plan records `countWords` as "1.7–2× under" for Chinese; direct measurement on unspaced CJK gives 8–23×. Both can be true — `\s` includes `\n`, so a real multi-line document scores roughly one word per line, which compresses the ratio at corpus scale. Do not average or merge these numbers; re-derive the corpus figure with a script that names the file set it measured.

### 43.2 Work items, ordered by measured breakage per unit of work

| Order | Item | Fix | Standard | Effort |
|---|---|---|---|---|
| 1 | H-3 + H-4 (below) | Composition-gate the 400 ms debounce and the ghost-text/AI trigger | — | S |
| 2 | I-2 search tokenizer | Character-bigram tokenizer in `buildSearchIndex`; takes CJK body recall from 0 hits to 1 on the measured query | — | M |
| 3 | I-1, I-3, I-4 | One shared segmenter factory serving word count, reading time and grapheme index. Reading time: locale-branch the `words/200` divisor, or drop reading time for non-space-delimited scripts (the convention is ~300–500 characters/min) | **UAX #29 §4** word boundaries, **§3** extended grapheme clusters, via `Intl.Segmenter` | S |
| 4 | I-7 formatting | Route every date through `Intl.DateTimeFormat` and every number through `Intl.NumberFormat` at the resolved locale. Measured: `en-IN` → **12,34,567.89**, `INR` → **₹499.00**, `ar` long date → **29 أغسطس 2026**, `ar-EG` numerals → **١٬٢٣٤٬٥٦٧٫٨٩** | **ECMA-402 §11 / §16** | S |
| 5 | I-6 tree sort | `Intl.Collator(locale,{numeric:true, sensitivity:'base'})`. Today `Array.prototype.sort()` gives UTF-16 order: `note1, note10, note2` | **UTS #10 / CLDR** | S |
| 6 | I-9 + §43.4 partial RTL | `dir="auto"` on both panes, `perLineTextDirection`, `bidiIsolates()` | **UAX #9 P2/P3** | S |
| 7 | I-10 snippet truncation | Reuse `findClusterBreak` from `@codemirror/state` rather than slicing at a UTF-16 index, which can split a surrogate pair or a ZWJ emoji sequence | UAX #29 grapheme | S |
| 8 | I-5 frontmatter key addressability | A YAML quoting decision, not a Unicode one; tracked with the engine work | — | M |
| — | I-8 line breaking | Do nothing beyond setting `lang`; the rendering engine tailors it | **UAX #14** | XS |

Do NOT implement UAX #9 or UAX #14 by hand. UAX #9 tracks Unicode 17.0.0 with six classes of explicit formatting characters and six higher-level protocols HL1–HL6 [fetched, unicode.org/reports/tr9]; UAX #14 §7 now reads "Deleted. (Formerly was: Pair Table-Based Implementation)" [fetched, tr14] — the shortcut people copy was withdrawn. CodeMirror 6 already ships a UBA: `computeOrder` at `@codemirror/view/dist/index.js:1245`, `BidiSpan` at :874 [measured]. Do NOT create a "unicode module" that owns all ten items either: items 1, 3, 4 and 7 are three-line call sites against one shared segmenter factory, and a module invites a second offset vocabulary — exactly what `offsets.ts` exists to prevent.

### 43.3 IME composition hazards — React 19 + CodeMirror 6 + 400 ms debounced save

The hot path: `EditorView.updateListener` fires on every `docChanged` → `useEditorStore.setContent(path, content)` synchronously, then re-arms a 400 ms timer to `saveDraft` (`CodeMirrorEditor.tsx:245–262`) [measured]. IME composition emits `docChanged` per keystroke of the *provisional* string.

| # | Hazard | Mechanism | Required test |
|---|---|---|---|
| H-1 | Preview thrash mid-composition | `setContent` fires per pinyin keystroke; the split preview re-renders half-composed runs | CDP `Input.imeSetComposition` `nihao` → `你好`; assert no committed save contains a provisional run |
| H-2 | Composition destroyed by re-render | Any React re-render touching `contentDOM` while `view.inputState.composing >= 0` destroys the browser's composition anchor. CM6 defends internally but cannot stop a parent remount | Toggle a parent state (theme, settings, `livePreviewForced`) mid-composition; assert the doc equals `你好`, not `nihao你好` or `你` |
| H-3 | **Debounced save captures a provisional buffer** | The 400 ms timer is not composition-aware, and a 400 ms pause with the candidate window open is entirely normal → IndexedDB draft plus `setDirty(true)` for text the user never committed | Compose, hold 600 ms with the candidate window open, read the draft from IndexedDB; assert it does not contain the pre-conversion Latin run |
| H-4 | Autocomplete/ghost-text firing mid-composition | `@codemirror/autocomplete` already guards: `if ((android ? view.composing : view.compositionStarted) \|\| view.state.readOnly) return` (`autocomplete/dist/index.js:1841`) [measured]. Our custom `aiSuggestion`/`ghostText` extensions carry no such guard | Compose `nihao`; assert zero completion sources invoked and zero ghost-text requests before `compositionend` |
| H-5 | Undo granularity | CM6 tags composition transactions `userEvent: "input.type.compose"` [fetched]. A custom transaction dispatched during composition without that annotation makes one Ctrl-Z delete a paragraph or a single code unit | Compose three words, undo three times, assert three distinct doc states at word boundaries |
| H-6 | Vim mode × IME | `@replit/codemirror-vim` loads first in the extension array and installs its own key handling; CM6 issue **#829** ("keymap not called during/after composition (android)") is the known shape | Compose in insert mode, press Escape mid-composition; assert the text commits and the mode changes exactly once |
| H-7 | Decoration boundaries garbling composition | Three CM6 issues in **2026-03 alone** — **#1688** "Text visually disappears after IME composition inside brackets on Chrome", **#1650** "IME composition at the boundary of syntax highlight nodes garbles the content", **#1654** "IME composition problem in decoration"; all closed, filed 2025-12→2026-03 [measured, api.github.com]. Our live-preview decorations sit exactly there | Compose inside `**bold**`, inside a fenced block, and at a `[[wikilink]]` boundary; assert a byte-identical expected doc for each |
| H-8 | Safari dead-key / missing `compositionend` | CM6 carries an explicit workaround (`view/dist/index.js:5294–5296`: on Safari, `insertText` while composing fires a synthetic `compositionend` after 20 ms) [measured] | Run the whole matrix on WebKit as well as Chromium; a Chromium-only IME suite proves nothing |
| H-9 | Tauri webview divergence | **`EditContext` is Chrome 121+, Firefox `false`, Safari `false`** [fetched, MDN BCD] — CM6 runs its DOM-mutation composition path on two of our three Tauri targets and its EditContext path on one | Same matrix inside `tauri dev` on macOS WKWebView, Linux WebKitGTK and Windows WebView2; do not infer from the browser build |
| H-10 | No upstream escape hatch | The public `codemirror` GitHub org was archived 2026-04-15/16; npm remains current but issues and PRs cannot be filed [fetched]. 26 IME issues exist, all closed, newest 2026-03-26 [measured] | Budget vendoring; pin `@codemirror/view` and diff on every bump |

Two fixes, both small: gate the debounce on `update.view.composing` (public API [fetched, CM ref `2047`]) and re-arm rather than save; and gate `aiSuggestion`/`ghostText` on `view.compositionStarted`, copying autocomplete's predicate verbatim including the Android branch — on Android, `compositionStarted` is true merely from placing the cursor on a word [fetched, CM ref `2049`], which is why the library branches.

**Suppress the persistence side, never the projection side: do NOT gate `setContent` on composition, because blanking the preview while a CJK user types is a worse defect than a few extra renders.** And do NOT write IME tests with `keyboard.type()` — it dispatches key events without a composition session and will pass against a fully broken editor. Reproduce CM6 #1650 against our decoration set and confirm it garbles *before* claiming it does not.

### 43.4 RTL scope — partial, content only; UI mirroring explicitly out for v1

In scope, because dependencies already do the work:

- `dir="auto"` on the editor content element and on preview block containers, which is exactly UAX #9 P2/P3 first-strong-character resolution [fetched, W3C qa-html-dir].
- `EditorView.perLineTextDirection` set true, so CM6 resolves direction per rendered line — correct for a mixed Hebrew/English vault [fetched, CM ref `2481`].
- `bidiIsolates()` from `@codemirror/language` for constructs that must not reorder: link destinations, fence info strings, inline code. `bidiIsolatedRanges` supports only `unicode-bidi: isolate` [fetched, CM ref `4875`, `2576`].
- `Intl.Locale.prototype.getTextInfo()` (ECMA-402 §15.3.21) to resolve base direction: measured `ar/he/fa/ur → {"direction":"rtl"}`, `en/hi/ja → ltr` [measured, node 24.6.0].

Out of scope for v1: mirroring the chrome (sidebar side, gutter side, icon flips, tree indentation) needs a CSS logical-properties pass across every surface plus an icon direction review — weeks, not days. Bidi-aware markdown *authoring* affordances are also out: `>`, `- ` and `# ` are LTR-anchored syntax inside an RTL paragraph and CommonMark says nothing about the convention. Bidi control characters in stored content are out permanently: `LRI U+2066 / RLI / FSI / PDI U+2069` are the recommended isolates over legacy `RLE U+202B / LRE U+202A / PDF U+202C` [fetched, W3C qa-bidi-unicode-controls], but they are invisible bytes and injecting them collides head-on with byte-preserving splice.

RTL is a **layout** problem for us, not a text-processing one — Arabic word counting already measures correct at 4 vs 4 because Arabic is space-delimited [measured]. CJK is the text-processing problem. Every CM6 bidi issue is closed, 9 total, newest 2023-11-30 [measured] — but do NOT read that as "bidi works here": the org is archived, so closure means nobody can file. **Anti-recommendation:** do not ship `dir="auto"` on the editor while leaving the preview LTR, or vice versa. Two panes disagreeing on base direction is worse than uniformly LTR, because the user cannot tell which pane is lying about their document. Ship both or neither.

### 43.5 `Intl.Segmenter` viability

| Engine | First version | Release date |
|---|---|---|
| Chrome | 87 | 2020-11-17 |
| Safari | 14.1 | 2021-04-26 |
| **Firefox** | **125** | **2024-04-16** |
| Node | 16.0.0 | — |
| Deno / Bun | 1.8 / 1.0.0 | — |
| Edge/Opera/Samsung/WebView | mirror Chromium | — |

[all fetched, MDN BCD]

- Baseline newly available **2024-04-16** (Firefox is the gate); widely available = +30 months = **2026-10-16, 48 days from 2026-08-29** [derived].
- Spec: ECMA-402 §19, draft dated **August 7, 2026** (ES2027 edition); `granularity` enum is «`grapheme`, `word`, `sentence`», default `grapheme` [fetched, tc39.es/ecma402].
- `supportedLocalesOf(['zh','ja','th','en','ar','hi'])` returns all six [measured, node 24.6.0].
- We already ship the dependency: `@codemirror/commands/dist/index.js:660` constructs a word-granularity segmenter for subword motion [measured]. CM6 does *not* use it for word selection — `EditorState.charCategorizer` is `/\S/` plus a `hasWordChar` regex plus a `wordChars` language-data string (`@codemirror/state/dist/index.js:2498`) [measured] — so double-click-to-select-word on CJK stays category-based until we change it.

**Verdict: use `Intl.Segmenter` unpolyfilled everywhere except the search index.** Measured Segmenter output for `深度学习模型的训练过程` is `["深度","学习","模型","的","训练","过程"]` — linguistically right, but it makes recall depend on the segmenter agreeing with the query, and the index is built server-side (Node, full ICU) while queries may run client-side (browser ICU, possibly trimmed). Use character bigrams for the index: measured `["深度","度学","学习","习模","模型"]`, with both `学习` and `训练` retrieving 1 hit [measured]. Bigrams over-generate but are deterministic across engines. Do NOT ship `@formatjs/intl-segmenter`; it carries ICU segmentation data, a large payload whose only remaining gap is a Firefox older than 2024-04-16 — feature-detect and fall back to `\s+` with a UI note.

**Falsifier for the bigram decision:** if index size on a 1,080-file corpus grows more than 2.5× versus the Segmenter tokenizer, or client-side query latency p95 exceeds 120 ms, revisit with a hybrid (Segmenter server-side, bigram fallback) — but never with a Segmenter on both sides, because an index-time/query-time segmenter mismatch produces silent zero-recall, the exact failure measured today.

### 43.6 UI localisation — do not do it for v1

The v1 UI is a file tree, a status bar, a command palette and a settings sheet; the content is the user's and is already in their language. Adoption is not the question — `i18next` 21,709,896 weekly downloads, `react-i18next` 15,672,474, `next-intl` 5,421,207, `@formatjs/intl` 3,611,428, `@lingui/core` 1,610,658 for the week 2026-08-21→2026-08-27 [fetched, api.npmjs.org] — **translation supply** is: solo founder, no localisation budget, no reviewers for `ar`/`ja`/`zh` copy. Do item I-7 instead, now, at near-zero cost; India-first pricing display is the immediate commercial payoff for one utility module. At v1.1, if demand appears, adopt `next-intl` (native App Router integration, matches the Next 16 stack) with **one** locale file in English, so adding `zh` later is a translation job and not a refactor.

Do NOT add a locale switcher or locale-prefixed routes (`/zh/...`) with a single language shipped: a half-populated switcher is a promise we cannot keep, and locale routing changes every URL, breaking share links — a settled product surface. Do NOT machine-translate the UI and ship it unreviewed; an editor's refusal copy is the product's voice, and a bad translation of "REFUSE rather than guess" reads as a crash.

Two invariants that hold across all of §43: do NOT normalise stored content — no NFC/NFD, no bidi-control injection, no BOM insertion, because every one mutates bytes and byte-preserving splice is settled; normalise only in derived projections such as search-index keys. And do NOT use a collator for identity: macOS APFS decomposes where Linux does not, and measured German and Swedish sort `['z','ä','a']` differently (`aäz` vs `azä`) [measured], so `Intl.Collator` is a locale-dependent function fit for display order and never for keying a store.
