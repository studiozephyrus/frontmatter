### 1. RISK REGISTER

**Legend:** L = likelihood, I = impact (both 1–5). Owner is a role, not a hire — for a solo founder every owner is the founder until the "must buy/hire" column in §4 says otherwise.

#### 1a. Technical

| Risk | L | I | Early-warning signal | Mitigation | Owner |
|---|---|---|---|---|---|
| Parser refuses real-world vaults on import | 5 | 5 | Import-failure rate per vault; support tickets saying "it won't open my notes". [measured] zero-indent block sequences (`tags:\n- item`, PyYAML's default shape, idiomatic CJK) drive **6,613/6,614 foreign refusals — 83% aggregate, 4.7–19.5% on real personal vaults**; recognizing `-` continuations recovers **99.98%** | Ship NF-1 before any marketing number; standing foreign-corpus gate in CI | Founder (engine) |
| Silent data destruction on edit | 3 | 5 | Round-trip diff non-empty on corpus; user reports of lost keys. [measured] **NF-3 bare-CR fence is set-destructive AND oracle-blind** — sibling of the shipped BOM bug | Fix + upgrade oracle to a set-only assertion (LR#68: make the test fail against unfixed code first) | Founder (engine) |
| Addressability gaps make edits unroutable | 4 | 4 | [measured] `SAFE_KEY` too narrow: `date created` in **812/957 files** of one real vault; CJK keys in **905** | Quoted-key support — a design task, not a regex patch | Founder (engine) |
| Non-Latin correctness debt | 4 | 3 | [measured] `countWords` **1.7–2× under** on CJK; MiniSearch CJK recall **18.1%** | Segmenter swap; scope CJK explicitly in or out of v1 | Founder |
| No CI at all | 5 | 4 | [measured] `.github/` absent — "a document CI can't be sold by a repo without any" | Add CI before any external contributor or paid customer | Founder |
| LLM vendor price/model deprecation breaks unit economics | 4 | 4 | Provider changelog; cost-per-active-user drift >20% | BYO-key lane + provider abstraction; never hardcode one model id | Founder |
| Published-page hosting cost blowout | 2 | 3 | Egress bill slope; single page going viral | Per-account bandwidth cap + cache | Founder |
| Editor state corruption (CodeMirror ↔ model sync) | 3 | 5 | Undo/redo divergence reports; Tier-1 class already fixed once (`d50a6b2`) | Property-based sync tests | Founder |

#### 1b. Market

| Risk | L | I | Early-warning signal | Mitigation | Owner |
|---|---|---|---|---|---|
| Incumbent (Obsidian/Notion/Cursor-class) ships the same feature free | 4 | 5 | Competitor changelog; feature-parity blog posts | Compete on the engine guarantee (round-trip fidelity, degradation certificate) not on the feature list | Founder |
| Markdown-editor category is crowded and low-willingness-to-pay | 4 | 4 | Trial→paid conversion <2%; free-tier ratio climbing | Price on the workspace/publishing/agent lane, not on "an editor" | Founder |
| Publishing lane cannibalises the editor value prop (two products) | 3 | 3 | Split usage cohorts with near-zero overlap | Pick one wedge for v1; the other is a roadmap item | Founder |
| No distribution channel | 4 | 5 | Zero organic signups for 60 days | Ship the engine research publicly; the foreign-corpus numbers are the marketing asset | Founder |

#### 1c. Legal / compliance

| Risk | L | I | Early-warning signal | Mitigation | Owner |
|---|---|---|---|---|---|
| Export-of-services GST position wrong → zero-rating denied retrospectively | 3 | 5 | First GST notice; bank unable to close an EDPMS entry | CA opinion **before** first invoice; LUT vs pay-and-refund decided in writing | CA (not agent) |
| FEMA non-realisation of export proceeds | 3 | 4 | Open EDPMS entries ageing | [fetched] realisation/repatriation period is **nine months from date of export** for all exporters (RBI Master Direction – Export of Goods and Services, updated as on **July 17, 2026**; inserted by **A.P. (DIR Series) Circular No. 08 dated August 05, 2025**) | CA/AD bank |
| DPDP obligations on user documents | 3 | 5 | Any data-subject request; any breach | See §2 | Lawyer (not agent) |
| GDPR exposure from EU customers | 3 | 5 | First EU signup; first DSAR | See §2 | Lawyer |
| Content liability on published pages (defamation, CSAM, DMCA, IT Rules intermediary duties) | 2 | 5 | First abuse report | Abuse policy + takedown path + logging **before** publishing ships | Lawyer |

#### 1d. Operational & key-person

| Risk | L | I | Early-warning signal | Mitigation | Owner |
|---|---|---|---|---|---|
| Founder is the single point of failure for engine, product, support, billing | 5 | 5 | Response-time drift; unshipped weeks | Runbooks; bus-factor doc; MoR absorbs billing support | Founder |
| Burnout / illness with paying customers live | 3 | 5 | Consecutive zero-commit weeks | Explicit degraded-service SLA in ToS; escrow of deploy credentials | Founder |
| Credential loss (single laptop, single account) | 2 | 5 | No recovery drill in 90 days | Hardware key + recovery codes offline; documented account inventory | Founder |
| Support volume from BYO-key misconfiguration | 4 | 3 | Ticket mix >30% "my key doesn't work" | Key-validation UX at entry; provider-specific error mapping (LR#19: ≤200-char actionable errors) | Founder |
| Unauthorised destructive ops by agents/subagents | 3 | 4 | Commits not authored in-session (LR#48: 5 unauthored commits observed) | Capture `git rev-parse HEAD` before/after every workflow; prohibition is advisory, never the gate | Founder |

### 2. LEGAL AND COMPLIANCE (India Pvt Ltd, selling globally)

**All of §2 is an issue list to confirm with a chartered accountant and a lawyer. None of it is advice.**

#### 2a. GST and the export-of-services position

| Item | Status | Note |
|---|---|---|
| Export of services treated as a zero-rated supply under the IGST Act; two routes — supply under **LUT/bond without payment of IGST**, or **pay IGST and claim refund** | [SS] | Primary text **not verifiable this session**: `cbic-gst.gov.in` failed TLS verification and returned 404 on every IGST-Act PDF path tried; `legislative.gov.in` and `indiacode.nic.in` 404'd. **Needs CA confirmation against the current bare act.** |
| "Export of services" definition requires, among other conditions, that **payment is received in convertible foreign exchange** and that supplier and recipient are not merely establishments of the same person | [SS] | If an MoR is the contracting counterparty, *who* the recipient is and *what currency lands in the Indian bank account* changes the answer. This is the single highest-value CA question. |
| GST registration threshold for services (commonly cited ₹20 lakh; ₹10 lakh special-category states) | [SS] | Unverified. Exporters may face a separate registration trigger irrespective of turnover — confirm. |
| Reverse charge on **imported services** (LLM APIs, hosting, MoR fees billed from abroad) | [SS] | A real recurring cost/compliance line for this exact product. Confirm rate, RCM applicability, and input-credit position. |
| Equalisation levy changes (2% e-commerce levy; 6% advertising levy) | [SS] | Reported as withdrawn in recent Finance Acts. **Do not rely on memory** — confirm current status. |
| SOFTEX / EDPMS for software-and-services exports | [fetched] | RBI Master Direction: SOFTEX filed via STPI/SEZ; exporters "have to provide information about **all the invoices including the ones lesser than US$25000**, in the bulk statement in excel format". Long-duration contracts: bill **at least once a month** or at milestone, last invoice **not later than 15 days** from completion; one-shot operations: invoice within **15 days** of transmission. Realisation/repatriation: **nine months**. |
| Other RBI limits in the same Master Direction | [fetched] | Reduction in invoice value permitted where it "does not exceed **25 per cent** of invoice value"; self write-off gated on outstandings "not exceed[ing] **5 per cent** of exports made"; and a limit of "**USD one million or 10 per cent** of the average export" realisation. |

#### 2b. India DPDP Act 2023 — obligations for stored user documents

- [fetched] User documents containing personal data make the company a **Data Fiduciary**. Penalties are in **The Schedule [See section 33(1)]** of the gazetted Act (MeitY PDF, digitally signed 2023-08-12):

| Breach | Penalty ceiling |
|---|---|
| Failure to take reasonable security safeguards to prevent a personal data breach — **s.8(5)** | **may extend to ₹250 crore** |
| Failure to give the Board or affected Data Principal notice of a breach — **s.8(6)** | **may extend to ₹200 crore** |
| Additional obligations in relation to children — **s.9** | **may extend to ₹200 crore** |
| Additional obligations of a **Significant Data Fiduciary** — **s.10** | **may extend to ₹150 crore** |
| Breach of Data Principal duties — **s.15** | **may extend to ₹10,000** |
| Breach of a voluntary undertaking accepted under **s.32** | up to the extent applicable to the underlying breach (s.28 proceedings) |
| **Any other provision** of the Act or rules | **may extend to ₹50 crore** |

- [fetched] **s.16(1)**: the Central Government "may, by notification, **restrict the transfer** of personal data by a Data Fiduciary for processing to such country or territory outside India as may be so notified" — i.e. a **blacklist model**, not a whitelist. **s.16(2)**: any other Indian law with a *higher* degree of protection or restriction still applies.
- [fetched] **s.17** exempts Chapter II (except s.8(1) and s.8(5)), Chapter III and s.16 for legal-claim enforcement, judicial/regulatory bodies, and offence prevention/detection/investigation.
- [SS] **DPDP Rules** operationalising consent notices, breach-notification timelines, SDF designation and verifiable parental consent — **status not verified this session** (MeitY `data-protection-framework` page returned a 1,155-byte shell). Breach-notification timing, the consent-manager regime, and whether this product is designated an SDF all hinge on the Rules. **Lawyer question.**
- [SS] Pre-DPDP **SPDI Rules 2011 / s.43A of the IT Act** may still bite until fully superseded — confirm.

#### 2c. GDPR exposure for EU customers

- [fetched] **Art. 3(2)**: GDPR applies to a controller/processor **not established in the Union** where processing relates to (a) "the offering of goods or services, **irrespective of whether a payment of the data subject is required**, to such data subjects in the Union", or (b) "the monitoring of their behaviour" in the Union. A free tier reachable from the EU is enough to trigger (a); product analytics is (b).
- [fetched] **Art. 27**: where Art. 3(2) applies, the controller/processor "**shall designate in writing a representative in the Union**", established in a Member State where the data subjects are. Exception: processing that is "occasional", not large-scale special-category or criminal data, and "unlikely to result in a risk" — **a document workspace is unlikely to qualify as occasional.** This is a real recurring cost line (an EU-rep service).
- [fetched] **Art. 83(4)**: fines up to **€10,000,000 or 2% of total worldwide annual turnover** of the preceding financial year, **whichever is higher** (Arts 8, 11, **25–39**, 42, 43 — i.e. security under Art. 32, breach notification under Arts 33/34, DPIA under Art. 35, records under Art. 30).
- [fetched] **Art. 83(5)/(6)**: up to **€20,000,000 or 4%**, whichever is higher — basic principles and consent (Arts 5, 6, 7, 9), data-subject rights (Arts **12–22**), third-country transfers (Arts **44–49**), and non-compliance with a supervisory-authority order under Art. 58(2).
- **Contradiction to record:** DPDP s.16 restricts transfers only to *notified* countries (permissive by default); GDPR Chapter V restricts transfers *out of the EU* unless a safeguard exists (restrictive by default). A single storage architecture cannot satisfy both by accident — the two regimes pull in opposite directions and must be reconciled deliberately.

#### 2d. What a merchant of record absorbs vs. what the founder still owes

| Provider | Fee | Tag |
|---|---|---|
| **Paddle** | **5% + 50¢**; add-ons listed as "Add on **0.5%**", "Add-on **$0.02 to $0.07**", "Add up to **3.9%**", "Add up to **4.4%**", "Add up to **0.4%**", "Add on **2.9%**"; page's own stacked comparison "**~7% and above**" | [fetched] |
| **Lemon Squeezy** | **5% + 50¢**; comparison column "+ **2.9% — 12% + 50¢**", "+ **0.5% — 1%**", "+ **0.5%**", "+ **10% — 30%**" for a non-MoR stack | [fetched] |
| **Polar** | tiered **5.00% + 50¢ → 3.80% + 40¢ → 3.60% + 35¢ → 3.40% + 30¢** per transaction, MoR | [fetched] |

- **Absorbed by the MoR (per their own marketing):** sales-tax/VAT/GST **calculation, collection, filing and payment liability** across jurisdictions; the MoR is the seller of record; payment-related buyer support; chargeback/fraud handling; subscription billing plumbing. Paddle states "no migration fees, monthly fees, or hidden extras" and that data is portable.
- **Still owed by the founder regardless of MoR** [SS, confirm with CA/lawyer]: Indian **corporate income tax** on the net remittance; Indian **GST treatment of the MoR relationship** (is the MoR the recipient of your service? does that still qualify as export?); **FEMA/EDPMS/SOFTEX** filings on the inbound foreign exchange; **TDS/withholding** questions on payouts; **DPDP and GDPR controller obligations over the documents themselves** — an MoR absorbs *tax*, never *data protection*. The MoR is a payment counterparty, not a data-processing shield.
- **Anti-recommendation:** do not assume MoR = "no Indian tax compliance". It changes *who remits sales tax*; it does not remove a single Indian filing.

#### 2e. Data residency

- [fetched] DPDP s.16 does **not** mandate India-resident storage; it enables a **notified-country restriction**. [SS] Sectoral rules (RBI payment data, any future SDF-specific rules) may impose residency independently — lawyer question.
- Practical consequence: a **single US/EU region** is defensible today but creates a migration liability if a country is later notified. **Decision, not a default** — see §5.

### 3. SECURITY POSTURE

#### 3a. BYO-API-key storage

- Threat: the key is a bearer credential for a **metered, billable** third-party account. Compromise = direct financial loss to the *user*, and a public incident for the product.
- Controls: encrypt at rest with a per-user key (envelope encryption, KMS-held root); **never** return the key to the client after entry (write-only field, show last-4 only); never log it; never place it in a URL or query string; scrub it from error traces and from any LLM prompt context.
- **Anti-recommendation:** do **not** proxy BYO keys through a server that also stores documents without isolating the key store — that co-locates the two highest-value assets.
- If keys are held client-side only (browser/desktop), state plainly that server-side agent features **cannot** work — this is a product constraint, not a security detail.

#### 3b. GitHub OAuth scopes

- [fetched] `repo` "Grants **full access to public and private repositories** including read and write access to code, commit statuses, repository invitations, collaborators, deployment statuses, and repository webhooks… also grants access to manage **organization-owned resources** including projects, invitations, team memberships and webhooks." This is far broader than a markdown sync needs.
- [fetched] Narrower scopes exist: `public_repo`, `repo:status`, `repo_deployment`, `repo:invite`, `security_events`, `admin:repo_hook` / `write:repo_hook` / `read:repo_hook`, `admin:org` / `write:org` / `read:org`.
- [fetched] GitHub's own docs: "**Consider building a GitHub App instead of an OAuth app.** GitHub Apps use **fine-grained permissions instead of scopes**… If you're building a GitHub App, you don't provide scopes in your authorization request."
- **Recommendation:** ship a **GitHub App** with contents-scoped fine-grained permissions on user-selected repositories. **Anti-recommendation:** do not ship an OAuth App requesting `repo` — it is an all-repos, all-orgs grant and will fail enterprise review.

#### 3c. Published-page access control and revocation

- Required properties: unguessable URL is **not** access control; publish state must be a server-side authorisation check on every request.
- **Revocation must invalidate CDN/edge cache, search-engine access, and any signed URL already issued** — the mdmax work already fixed an **unpublish revocation** defect (commit `d50a6b2`), which is evidence this class is live in this codebase.
- Add: `noindex` on unlisted pages, per-page expiry, audit log of publish/unpublish, and a "what is public right now" inventory screen.

#### 3d. LLM prompt-injection exposure

- [fetched] **OWASP GenAI LLM Top 10 (2025)**: **LLM01:2025 Prompt Injection**, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain, LLM04 Data and Model Poisoning, LLM05 Improper Output Handling, **LLM06 Excessive Agency**, LLM07 System Prompt Leakage, LLM08 Vector and Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption.
- Product-specific exposure: an agent that reads a user's markdown vault is reading **untrusted content** — imported notes, pasted web clippings, synced GitHub READMEs authored by third parties. Any instruction inside a document is **data, never a command**.
- The "lethal trifecta" applies exactly: untrusted content + private data access + an outbound capability (publish, GitHub write, email) in the same turn. Gate any outbound action behind explicit per-operation user confirmation.
- Controls: strict separation of instruction and document channels; deny-by-default tool loadout; no auto-publish, no auto-commit, no auto-send; render model output as text, never as executable markup (LLM05); cap tokens/spend per user (LLM10).

#### 3e. The eval / arbitrary-code lane that must be **refused**

- **Do NOT build:** in-product `eval()`, user-supplied JS/Python plugin execution, arbitrary shell in a document, or "run this code block" against server infrastructure. A markdown workspace with code fences invites it; it converts every prompt-injection into remote code execution on infrastructure holding every customer's documents and API keys.
- If code execution is ever a requirement, it is a **separate, sandboxed, network-isolated, ephemeral** service with no access to the document store or the key store — and that is a build-vs-buy decision (§4), not a feature toggle.

### 4. EXECUTION CAPACITY

| Question | Assessment |
|---|---|
| Realistic solo throughput | ~1 substantial shipped surface per 2–3 weeks alongside support, billing and compliance. The engine backlog alone (NF-1 → NF-3 → NF-2 → NF-4 + mdmax Tier 3/4 + CI) is a multi-month R0 lane before any customer-visible feature. [measured] |
| Non-negotiable overhead | Support, incident response, invoicing/FEMA filings, and security patching are **recurring** and do not compress with skill. Budget them as fixed load, not as slack. |

**Must BUY (do not build):**

| Capability | Why | Cost signal |
|---|---|---|
| Merchant of record | Global sales-tax registration/filing is unbuildable solo | 5% + 50¢ (Paddle, Lemon Squeezy) / 3.40–5.00% + 30–50¢ (Polar) [fetched] |
| Auth (OAuth/session/MFA) | Credential handling is a liability, not a differentiator | — |
| Error tracking + uptime | You are the on-call rota of one | — |
| EU Art. 27 representative | Statutory, cannot be self-appointed from India [fetched] | recurring subscription [SS] |
| CA (GST/FEMA/EDPMS/SOFTEX) and a lawyer (DPDP/GDPR/ToS/abuse policy) | Every item in §2 is outside an agent's competence | — |
| Object storage + CDN for published pages | — | — |

**Must BUILD (the moat):** the markdown engine and its round-trip guarantee; the degradation certificate (`mdmax cert`, already shipped inside its two-day cap, commit `f0603c2`); addressability/SAFE_KEY design; the agent-over-documents UX and its injection boundary.

**Must HIRE (first two, in order):** (1) a part-time **support/community** person once ticket volume crosses ~10/week — it is the first thing that destroys engineering blocks; (2) a **second engineer** only after CI exists, otherwise onboarding cost exceeds output.

**Sequencing consequence:** R0 engine truth **precedes marketing any number** — publishing a fidelity claim before NF-1/NF-3 land converts a technical bug into a false public claim. CI must exist before hire #2. MoR must be chosen before the first paid signup, because migrating billing counterparties mid-flight breaks the FEMA paper trail. The EU representative must exist before the first EU *free* signup, since Art. 3(2) triggers "irrespective of whether a payment… is required" [fetched].

### 5. OPEN DECISIONS BEFORE DEVELOPMENT STARTS

1. **Do documents leave the user's device?** — *Local-first/E2E encrypted*: kills server-side agents, search and publishing, but collapses DPDP/GDPR surface to near-zero. *Server-stored*: enables the whole product, and buys the full §2b/§2c obligation set including the ₹250 crore s.8(5) ceiling [fetched].
2. **BYO key or platform key?** — *BYO*: no COGS, no model-margin, high support load, key-custody risk. *Platform key*: clean UX, real gross-margin exposure to provider price changes, and unbounded-consumption risk (LLM10).
3. **MoR or direct Stripe?** — *MoR*: 5% + 50¢ (or Polar's 3.40–5.00% tier) and global tax liability absorbed [fetched]; changes the GST export analysis. *Direct*: cheaper headline, but you personally own VAT/GST registration in every jurisdiction you sell into.
4. **GitHub App or OAuth App?** — *App*: fine-grained, per-repo, enterprise-acceptable, more build work. *OAuth with `repo`*: fastest, and requests full read/write on **all** repos and org resources [fetched] — a likely deal-breaker for any team customer.
5. **Which region for document storage?** — *Single US/EU region*: simplest, cheapest; exposed if India notifies a restricted country under DPDP s.16 [fetched]. *India + one foreign region*: doubles ops cost now, insures against a notification and against EU-customer objections.
6. **Free tier reachable from the EU — yes or no?** — *Yes*: triggers GDPR Art. 3(2) and the Art. 27 representative obligation immediately [fetched]. *No (geo-gated until compliant)*: delays revenue, defers cost.
7. **Does the agent get write/publish authority?** — *Yes*: the flagship demo, and the full lethal-trifecta exposure. *Read-only + human-confirmed writes*: slower demo, and the only defensible posture against LLM01/LLM06.
8. **Publishing in v1 or v2?** — *v1*: doubles the product and adds content-liability/abuse/takedown obligations. *v2*: narrower wedge, and the editor must carry the price alone.
9. **Ship a fidelity/coverage number publicly before or after NF-1?** — *Before*: the current [measured] foreign-refusal rate makes the claim false. *After*: delays the strongest marketing asset the project has.
10. **CJK in scope for v1?** — *In*: must fix `countWords` (**1.7–2× under**) and MiniSearch recall (**18.1%**) [measured]. *Out*: say so explicitly in positioning rather than shipping a silent failure.

**No destructive operation was required or performed; this pass was read-only. Every GST/threshold/levy claim above is [SS] because the CBIC and legislative sources were unreachable this session — those specific lines need a chartered accountant, and the DPDP Rules status and GDPR applicability call need a lawyer, not an agent.**