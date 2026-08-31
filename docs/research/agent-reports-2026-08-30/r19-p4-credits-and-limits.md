## 93. Credits, quotas and the refusal surface

§90 prices the AI. This section is the mechanism: what a credit *is*, where it is counted, what happens when it runs out, and why none of that may ever read as a billing bug. The record already contains the warning that governs this whole section — an INR charge above ₹15,000 forces on-session AFA on every renewal, which is *"a manual repurchase wearing a subscription costume"* (§45.5). A quota that stops working mid-sentence and asks for money is the same defect one layer up.

The unit is settled by §24.6, which publishes as a promise: **dollars not credits · BYO-key at every tier · one cheap surface unlimited · never reprice opaquely.** This section reads that as a constraint, not a slogan, and it produces an answer that is *not* the obvious one.

### 93.1 What a credit is

| Option | What it is | What it costs | What it buys | What it forecloses |
|---|---|---|---|---|
| **A. Tokens** | Meter the vendor's own unit; show "1,240,000 tokens left" | Zero build — the API returns it | Perfect cost coupling; never lose money | Leaks our margin and our model choice; unintelligible to a writer; forces a repricing every time a tokenizer changes. Anthropic's own pricing page warns Claude 4.7+ tokenizers emit "approximately 30% more tokens for the same text" [fetched, anthropic.com/pricing, 2026-08-31] — a silent 30% quota cut that we did not decide |
| **B. Actions** | "200 AI actions/month"; one verb = one credit | Low build; legible in one word | Instant comprehension; a user can predict tomorrow from today | Cost variance. §11.3 measured: summarise a p90 note **$0.0058**, restructure the same note **$0.0286** — 4.9× on Haiku 4.5 [derived, from §11.3]. Scoped multi-doc synthesis is $0.01–$0.10, so worst/best across the shipped verb set is **17×**, not 100× [derived] |
| **C. Weighted credits** | Actions, but a verb costs 1 / 3 / 10 | Medium build + a published weight table | Cost coupling *and* legibility | A second pricing page inside the product; every model swap re-opens the weights; the user now does arithmetic before pressing a button |
| **D. Rupees/dollars spent** | "₹40 of AI included; ₹12.20 used" | Low build; a running float | Honest; matches §24.6's *dollars not credits*; needs no repricing ever | Publishes our unit cost. A competitor reads our margin off the meter. A user compares ₹12.20 against the API price and asks why they are not just using the API |
| **E. Time-boxed unlimited** | "Unlimited on the cheap model" | Zero metering build for that surface | Removes the meter entirely from the common case | Uncapped downside on an automation loop; §93.5 is the whole reason this cannot stand alone |

**Recommendation: B + E — actions, with the cheap surface unmetered.** Ship one number, `200 AI actions` on Pro and `1,000` on Power, and put every rank-1/rank-2 verb from §11.2 (transformation on a selection, frontmatter fill and repair) on Haiku 4.5 where they are **free and uncounted**. The meter exists only for the frontier lane — Sonnet 5 / Opus 5 restructures and scoped multi-document synthesis — which is where §24.2 already puts "metered frontier" on Power.

The defence: the 17× spread is real but it is *bounded and one-sided*. At Haiku 4.5 rates — $1/MTok in, $5/MTok out [fetched, anthropic.com/pricing, 2026-08-31] — 200 restructures of a p90 note is 200 × $0.0286 = **$5.72**, which is 121% of the $4.72 net on a ₹299 Pro sub at ₹95.39/$ [derived: 299/95.39 = $3.13 gross… and that is the finding]. **₹299 Pro cannot carry 200 metered frontier actions.** The meter must therefore sit on a tier that can: Power at ₹599 = $6.28 gross, ~$4.50 net of the 2.36% Razorpay fee and support [derived]. So the shipped shape is: **Free and Pro get the unmetered cheap surface plus BYO-key; only Power carries a counted frontier meter, and it is counted in actions.**

The strongest argument against: actions-as-a-unit will eventually mis-price, because a user who only ever runs the expensive verb pays the same as one who only runs the cheap one. That is a cross-subsidy inside a cohort, and it is exactly what §11.3's arithmetic says we can afford *only while the frontier meter sits on the ₹599 tier*. The evidence that would change my mind: p90 frontier-verb consumption exceeding 60% of the included count in the first 90 days. At that point weights (option C) become unavoidable and the published weight table is the cost of having been wrong.

### 93.2 Where the meter lives

The control plane holds zero document bytes (settled). That is not an obstacle to metering — it is the reason metering is *cheap*. A meter needs `{account_id, verb, model, tokens_in, tokens_out, ts, request_id}`. None of those are document bytes.

| Placement | Survives offline? | Survives a hostile client? | Cost | Verdict |
|---|---|---|---|---|
| Client-side counter, synced | Yes | **No** — trivially editable, and the vault is on the user's disk | ~0 | Refused. A local counter on a local-first app is an honour system with a UI |
| Server-side at the proxy: every hosted call goes through our Worker, which is the only holder of our API key | No (by construction — no network, no hosted call) | Yes, structurally: the key never leaves the server | +1 hop, ~15ms | **Recommended** |
| Vendor-side (per-user API sub-keys) | No | Yes | Ties us to one vendor's key model; no cross-model unit | Refused |

**The meter is the proxy.** There is no reconciliation problem because there is no second counter: a hosted AI call *is* a call to our Worker, and a call that did not reach the Worker did not happen. This is the one place where "no offline hosted AI" is a feature rather than a limitation — it makes the client/server disagreement case **structurally impossible** rather than merely handled.

Offline, then, is answered by tier, not by sync: **BYO-key AI is unmetered at every tier including Free** (§24.2, settled), and BYO-key works offline against whatever endpoint the user points at. A user on a plane has full AI — theirs. A user on a plane has zero hosted AI, and the copy says so before takeoff, not after.

Three engineering consequences, all small:

1. **Reserve-then-settle.** Debit the credit at request start, not at response end. A 40-second Opus call that the user cancels still consumed input tokens; settling only on success is a free-retry loop. Settle the delta (usually zero, occasionally a refund) on completion.
2. **`request_id` is the idempotency key**, and it is client-generated. A retried request with the same id never double-debits. This is the same compare-and-swap discipline the sync layer already uses (settled) — one mechanism, two places.
3. **Ledger, not a counter.** Append-only rows in the one Postgres; the balance is a materialised sum. A counter cannot answer "what did I spend it on", and §93.7's refusal copy needs that answer. At 400 paid users × 200 actions = 80,000 rows/month [derived], this is free.

The one real disagreement case is a **Worker that debits and then fails to reach Anthropic**. Rule: a 5xx from the vendor, a timeout, or our own error refunds the reservation automatically, logged, no support ticket. A 4xx caused by the user's prompt (context too long) does *not* refund, and the refusal names why. Do not build a manual credit-restore console at this scale; §45.10's anti-recommendation applies verbatim — 2.9 founder-hours a month is cheaper than any system we would write.

### 93.3 Enforcement, and what the user sees

| Model | Behaviour at limit | What the user sees | Risk |
|---|---|---|---|
| **Hard cap** | Verb refuses | A refusal | Reads as broken mid-task |
| **Soft cap + overage billing** | Keeps working, bills the excess | Nothing, until the invoice | The bill shock is ours to eat or theirs to dispute. §84.6: a Dodo dispute is $30 = **9.57× a ₹299 charge** [fetched, dodopayments.com/pricing, 2026-08-30, via §84.1] |
| **Degrade to the cheap model** | Frontier meter exhausts → verb keeps working on Haiku | A one-line notice, and the work continues | Quality drop the user did not choose |
| **Degrade + explicit opt-in to buy more** | As above, plus a top-up affordance that is never modal | Continuity, with a door | Two states to explain |

**Recommendation: degrade, never block, never bill silently.** When the frontier meter hits zero, the verb still runs — on Haiku 4.5, unmetered, which is the *same surface Free and Pro use all month*. The product does not stop. What changes is one line of copy and a badge on the model selector.

This is the only option consistent with the record. §84.9 already establishes that a lapsed *subscription* keeps the editor working at Free-tier features; a lapsed *quota* cannot be harsher than a lapsed payment. And degradation is the only enforcement that cannot be mistaken for a billing bug, because nothing failed — a cheaper engine answered.

Overage billing is refused outright, and this is the strongest recommendation in the section. A metered charge appended to an Indian mandate whose max was set at signup either exceeds the mandate max and **refuses at the network**, or forces a mandate recreation with on-session AFA (§45.9, §84.7) — the manual repurchase in a subscription costume, arriving as a surprise. There is no version of usage-based overage that works on the Indian rail for a ₹299 product. Top-ups, if they ever ship, are one-off charges the user initiates, never an automatic debit.

The strongest argument against degradation: it makes the paid frontier meter feel optional, which suppresses the top-up revenue that would justify building it. That is true, and it is the reason I would not build top-ups in MVP at all. The evidence that would change my mind: users hitting zero and *asking* for more, at a rate above ~5% of Power subscribers per month.

### 93.4 What the user sees, all month

- **Nothing, by default.** No meter in the chrome. §11.4 already refuses ambient AI buttons on trust grounds; a permanent counter is the same tax, paid in anxiety instead of clicks.
- The count appears **in the model selector**, at the moment of choosing frontier, and nowhere else.
- **One notification, at 80%, in-app, dismissible, never email.** Not at 50, 90 and 100 — three notices about a thing that will not break anything is how you teach people to ignore you.
- Settings → AI shows the ledger: date, verb, model, and the file it touched. Local telemetry only (§11.5); nothing published.

### 93.5 Abuse: one account, a loop, $4,000 overnight

Detection is not a control. The structural preventions, in order of how much they actually remove:

| Control | Removes | Cost |
|---|---|---|
| **1. There is no bulk API.** The AI verbs are user-gestures against an open selection. No "run on vault", no scriptable endpoint, no eval lane (settled) | The loop's *reason to exist*. §11.4 already refuses whole-vault operations on cost grounds — $38.79/user/month for ambient re-rank [derived, §11.3] — and that refusal doubles as the abuse control | Zero. Already settled |
| **2. Hard per-account daily ceiling on hosted spend, in dollars, server-side.** Not a quota — a circuit breaker. Set at ~4× the p99 legitimate day | The overnight bill, absolutely. This is the single line that makes $4,000 impossible | ~20 lines in the Worker |
| **3. Concurrency = 1 per account, hosted lane.** A human runs one verb at a time | Parallel fan-out, which is how a loop gets to $4,000 in hours rather than weeks | ~10 lines |
| **4. Rate limit: N/minute, and a 402 on breach, not a 429 queue** | The retry storm. Queueing an abusive client is buying its tokens on credit | Trivial |
| **5. Hosted AI requires a payment instrument on file.** Free tier gets **zero hosted credits** (§24.2, settled) — not "a few" | Anonymous-signup farming, entirely. §44.5 made the same call for publishing: "the abuse economics of a *paid* surface are inverted" | Zero. Already settled |
| **6. Prompt-caching on the system preamble** | Not abuse, but cost: cache read is **$0.10/MTok on Haiku 4.5 vs $1 input** [fetched, anthropic.com/pricing, 2026-08-31] — a 10× cut on the repeated half | One header |

The daily dollar breaker is the load-bearing one and it must be **in dollars, server-side, checked before the vendor call**, because it is the only control that stays correct when the unit (actions) and the cost (tokens) come apart — which is precisely the failure mode option B in §93.1 accepted. It is the hedge that lets us ship the legible unit.

Worked ceiling: Power's 1,000 frontier actions at the p90 restructure cost on Sonnet 5 ($0.0572, §11.3) = **$57.20/month worst case**, against $6.28 gross at ₹599 [derived]. That is a −$50 month if a single user runs every credit at maximum size. So the included count is *not* the economic limit — **the daily breaker is**, and it should be set at roughly $0.60/day = $18/month, which is still 2.9× the tier's gross and only reachable by someone genuinely working. Publish the breaker's existence in the ToS; do not publish its value.

### 93.6 BYO key

| Question | Position |
|---|---|
| Unlimited? | **Yes, at every tier including Free** — settled, §24.2. Their key, their bill, their rate limits |
| Do we count it? | Locally, for the §11.5 accept/reject instrumentation. Never transmitted, never billed against |
| Where is the key? | Client-side only, OS keychain. It never reaches our Postgres. Obsidian ships exactly this — a "Keychain for plugin API keys" [fetched, §11.1] — and it is the settled shape |
| Their key leaks | **We cannot be the cause, because we never hold it.** Support posture: one documented page — rotate at the vendor, we hold nothing to revoke. We do not offer to help debug their vendor account |
| Their bill explodes | Not our liability, and it is not a posture we can take *unless* the app cannot cause it. Therefore: **§93.5's controls 1, 3 and 4 apply identically to the BYO lane.** No bulk verb, concurrency 1, rate limited. What differs is that there is no dollar breaker — we cannot see their prices — so instead the client shows an estimated token count before any BYO call above a threshold |
| ToS wording | "You are responsible for charges incurred on keys you supply. frontmatter never transmits or stores your key, and never calls your provider except in response to an action you take." Three clauses, no lawyering |

The uncomfortable part, stated rather than buried: BYO-key-unmetered-at-Free is a genuinely generous position that costs us nothing in COGS and **removes our own upsell for the AI lane entirely**. The paid tiers must therefore sell hosted *convenience* — no key to obtain, no vendor account, works on a phone — not AI capability. If the pricing page ever implies otherwise it is lying, and §24.6's "never reprice opaquely" is the promise it breaks.

### 93.7 Rollover, expiry, refunds

| Question | Position | Why |
|---|---|---|
| Rollover | **No.** Included actions reset monthly | Rollover turns a subscription into a stored-value instrument. In India that risks the prepaid-payment-instrument perimeter; the whole §45.1 RBI framework is about instruments we do not want to be [inference — not a fetched legal opinion; get one before publishing any purchasable-credit product] |
| Expiry of *included* actions | Monthly, stated on the pricing page in the same sentence as the count | Never a surprise if it is in the noun: "200 actions a month", not "200 actions" |
| Expiry of *purchased* top-ups (if ever built) | **Never expire** | An expiring purchased balance is the single most disputed construct in consumer SaaS, and §84.11 already promises "we will refund it the same day" rather than fight a chargeback that costs 9.57× the charge |
| Refund on unused included actions | **No** — they were never separately sold. §84.11's 30-day first-payment refund covers the whole subscription, including the AI | A per-credit refund path implies credits are property. They are a service allowance |
| Refund on unused *purchased* top-ups | **Full refund on request, no proration, no questions** | Cheaper than a dispute, and consistent with §84.11 |
| EU / EEA / UK | The 14-day withdrawal right is **offered unconditionally; we never ask for the waiver** (§84.4, recommended and settled). Credits consumed inside the window are not clawed back | Art 14(4)(b) makes the supply free if any of the three checkout artefacts is missing [fetched, EUR-Lex CELEX:02011L0083-20220528, via §84.3]. Not asking removes the surface |
| India | Consumer Protection (E-Commerce) Rules 2020 require the refund/cancellation policy to be displayed and a named grievance officer with defined windows — **rule numbers and time limits are [SS] in the record and unverified; verify against indiacode.nic.in before publication** (§84.3) | The grievance-officer page already exists for §44.2; the credit policy links to the same page rather than creating a second one |

One paragraph on the pricing page, not a credits policy document: *"Included AI actions reset on your billing date and do not roll over. We do not sell credits separately. If you want your money back, the whole subscription is refundable for 30 days and we do not ask why."*

### 93.8 The refusal surface

§40 is the governing spec and this section adds nothing to it. Four slots, fixed order — **OUTCOME · OBJECT+CAUSE · AFFORDANCE · DISCLOSURE** — 280 visible characters, headline ≤80, sentence case with periods, `block` / `warning` as inline-SVG Material Symbols, never a modal, never a badge, never humour on a repeatable event.

Two properties make a credit refusal different from the eleven in §40's taxonomy and both must be honoured. First, **it is not the engine refusing** — no byte was at risk, so "Nothing changed." is technically true but semantically wrong; the correct outcome line names what *did* happen. Second, **it is the only refusal in the product with a commercial remedy**, and §40's rule that a refusal names one imperative the user can perform right now collides with the rule that we do not sell inside the document. Resolution: the affordance is always the *work*, never the purchase. The purchase, if offered at all, lives in the disclosure tier.

Three refusal moments. Copy, as shipped.

**A. Frontier meter exhausted, mid-task.** Code `QUOTA_FRONTIER_EXHAUSTED`. Not a refusal at all — a substitution notice, inline, non-modal, on the result:

> Done on the fast model. Your 1,000 frontier actions for this month are used up, so this ran on Haiku — same verbs, same review step, shorter reasoning. Resets on 14 Sep.
> `Why?` · `Compare on the frontier model next month`

*(163 chars visible. The verb ran. There is no button that takes money. The reset date is a real date, not "next month".)*

**B. Daily spend breaker tripped.** Code `SPEND_LIMIT_DAY`. Persistent strip on the AI panel, not inline — this changes what the surface can do:

> Hosted AI is paused until midnight. This account ran an unusually large amount of AI today, so we stopped it automatically to protect your bill and ours. Your files and every other feature are untouched. Your own API key still works.
> `Why?` · `Use my own key`

*(233 chars. Names the protection as mutual, not as suspicion. Offers the lane that has no ceiling. Does not offer to sell the ceiling away, because we cannot know yet whether this is a person or a loop.)*

**C. Free tier, hosted AI requested for the first time.** Code `NO_HOSTED_CREDITS`. Inline on the model selector, first time only, silenceable:

> Hosted AI needs a paid plan. Free includes every AI verb through your own API key — unlimited, offline, and we never see the key. Hosted just means we supply the model, so you don't have to.
> `Add my key` · `See plans`

*(190 chars. `Add my key` is first and is the primary. §24.6 published "BYO-key at every tier" as a promise; this is the moment the promise is either kept or revealed as a funnel.)*

The anti-pattern this section exists to prevent, named so it can be checked in review: **any of these three rendered as a modal, or with the paid action as the primary button, is a paywall wearing a refusal's clothes**, and it converts the product's founding principle into a sales mechanic. §40 already bans the modal on refusals. The addition here is that the credit refusal is the one most likely to have that ban quietly relaxed by a future growth argument, so it is written down: **the meter never interrupts, never blocks, and never sells.**

**Falsified by:** frontier-action consumption exceeding 60% of the included count at p90 in the first 90 days (forces weighted credits, §93.1C); or a single account reaching the daily breaker more than twice while demonstrably legitimate (the breaker is set wrong, not the design); or measured demand for purchasable top-ups above ~5% of Power subscribers per month, which reopens the stored-value question and requires the Indian legal opinion §93.7 currently marks as missing.
