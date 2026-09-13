# New direction vs. earlier decisions and settled rules

## 1. "Zero document bytes" vs. deleting Firestore/public route

**CONFLICTS.** Four cards converge on the opposite of what the funnel needs:
- `decisions/v2/legal-privacy-data.json:5` (L1) recommends **deleting `firestore.rules`**, making "zero document bytes" an operating rule (rec b).
- `decisions/v2/business-operations.json:2798` (B16) same: delete the rules file now (rec d).
- `decisions/v2/product-definition.json:1639` (P8) recommends **deleting the public route** and stripping every content field from the rules (rec a): "No operating rule is writable until one of the three [contradicting files] goes."
- `decisions/v2/market-competition.json:3256` (MK18) recommends **permalink + export**, explicitly deleting `firestore.rules` and the publishing plan (rec a).

The founder's funnel requires the opposite: generate a full document kit, **store it** (Firestore + R2), serve it from a GUID link. That is precisely the "hold documents server-side" design these four cards say to kill. Nothing here is settled law either — CLAUDE.md's "Settled" list doesn't include a bytes-holding position, but `AGENTS.md` §0.4 rule 4 and the whole legal chapter (§22, PRODUCT-BRIEF.md:531-550) is built on the assumption we hold none. This is decision #1 below.

## 2. Public page, permalink, noindex; storing generated docs publicly at a link

**PARTIALLY SUPPORTS, mostly CONFLICTS.**
- `decisions/v2/go-to-market-channels.json:1444` (G10) recommends **keeping** the shipped public-note route, rendering from the repo, defaulting to **noindex** (rec b) — shape-compatible with "Free = public but unlisted."
- `decisions/v2/features.json:3532` (F19) currently has the shipped public-share route **disabled in the build**, decision deferred to week 2 (rec c): "nothing serves user content while that is open."
- MK18 above wants no hosted store at all, only permalink+export from the user's own repo — **not** a vendor-hosted GUID doc.

So "public but unlisted" as a *rendering* mode of a file the user already owns is compatible with G10. "Public but unlisted" as a *vendor-hosted, AI-generated document kit under a GUID* is not what any of these cards describe, and directly reopens the P8/L1/MK18/B16 contradiction closed by "delete Firestore." This funnel needs its own new decision card, not reuse of the old one.

## 3. Pricing tiers, ₹/$ anchors, what Pro/Max were meant to gate

**CONFLICTS on what Pro/Max gate.**
- `decisions/v2/pricing-tiers.json:3734` (PR24) rec c: editor free, **charge for state across people and devices** (not for storage location).
- `decisions/v2/pricing-tiers.json:3300` (PR21) rec a: **delete Max** as a third rung until someone asks — "Max holds one unbuilt feature."
- `decisions/v2/pricing-tiers.json:553` (PR3) and `decisions/v2/market-competition.json:1614` (MK10): **do not publish a price** ($4-5 or $30/editor/mo) until 20 team conversations return seat counts and gates.
- `decisions/v2/business-operations.json:803` (B4) rec c: take **$30/editor/month** into the 20 conversations, not $4-5.
- PRODUCT-BRIEF.md:288-289 records Pro at $4-5 gated on **retained splice journal + enforcement (CI gates)**, and flags that Exhibit 6/16 already disagree on what Max holds.

Founder's Free/Pro/Max split by **storage location** (public-unlisted / private / offline, user's own) is a third, un-reconciled axis. None of the existing cards price a tier on "where the bytes live" — they price on retention and enforcement. This needs a new pricing card, not a re-read of PR21/PR24.

## 4. Payment constraints (₹15,000/txn, one attempt for Indian cards)

**UNCHANGED.** `decisions/v2/pricing-tiers.json:1690` (PR11) directly confirms the constant is still live: "Retries on a failed debit: One attempt, no ladder" for both monthly (₹299) and annual (₹2,499), citing RBI/2022-23/73 at `pricing-tiers.json:1809`. The founder's message doesn't touch billing mechanics, so this remains an architectural constant per CLAUDE.md's settled list.

## 5. Privacy law (DPDP, GDPR Art 3(2), Art 27) for storing prompts + generated docs

**CONFLICTS if the funnel ships as described.** PRODUCT-BRIEF.md:541-550 (§22) states: DPDP §§3-17 commence 2027-05-13, but the **live regime today is IT Act §43A + SPDI Rules 2011** (naming exactly password/payment data), the **CERT-In six-hour breach clock binds now with no size floor**, and cross-border transfer needs a processor agreement in place today. GDPR Art 3(2)(a) catches a free tool regardless of payment (PRODUCT-BRIEF.md:550). All of this legal apparatus exists **because** the plan (in its current, settled form) holds identity+billing only. Storing user prompts and AI-generated documents server-side — even briefly, even at a GUID — makes those documents "content held," which is exactly what L1/B16/P8/MK18 (above) say to delete, and re-triggers the DPDP fiduciary duty (₹250 crore ceiling, DPDP §8(5), cited at `legal-privacy-data.json` L1 card) and intermediary status under IT Act §2(1)(w).

## 6. Measured build rate (1.21 eng-days/week) and MVP size

**CONFLICTS with the funnel as an MVP-0 addition; SUPPORTS the "bare editor first" instinct.**
- PRODUCT-BRIEF.md:227-231: measured **1.21 engineering days/calendar week** (10 of 58 days touched src/); 70 eng-days pilot scope = **58 calendar weeks** at that rate; the "10 weeks" schedule is withdrawn as "arithmetically impossible."
- `decisions/v2/product-definition.json:3070` (P18) rec a: **cut the pilot to fix-first plus review state only**; six features (including idea mode/decision flow/docs scan as full products) go to "the build after the pilot."
- `decisions/v2/form-factor-surfaces.json:5` (FF14): "One surface for the pilot… every other surface deleted."

Founder's MVP-1 instruction ("bare-bones editor, everything else beta-tested only if it earns it") **agrees** with this cut-hard instinct. But the funnel itself — decision-question engine, per-project document-kit generator, GUID storage, kickoff-prompt authoring — is **net new, unestimated scope** layered on top of a schedule that was already 4.8x too optimistic for the old (smaller) feature set. No card or brief estimates funnel engineering days; it must be re-derived at 1.21/week before any date is quoted (per AGENTS.md rule 3 and CLAUDE.md's numeric-verification rule).

## 7. Pilot definition (ten strangers), pass bar, kill switches

**UNCHANGED — not addressed by the new direction, and not in conflict.** `decisions/v2/plan-scope-sequencing.json` PL5 rec c: pass = "3 of 10 name the problem unprompted, 2 still using at day 30, booked call." Exhibit 19/20 (PRODUCT-BRIEF.md:347-369) and kill signals at day 14 stand. The founder's message doesn't redefine the pilot mechanics, only what ships into it — see #6.

## 8. Review state, attribution, engine, certificate, docs scan, extension — beta or later

**Mostly SUPPORTS the demotion, but exposes an identity conflict.**
- P18 (above) already demotes idea mode, decision flow, docs scan, MCP, vault-refactor etc. to "after the pilot" — consistent with founder's "beta only if it earns it."
- `decisions/v2/product-definition.json:3267` (P19) rec b: docs scan ships **only** broken-links/missing-docs in the pilot, staleness deferred.
- `decisions/v2/market-competition.json:5` (MK1) rec b: review state **narrows** to per-span state in the repo (not the whole product story).
- `decisions/v2/form-factor-surfaces.json:5` (FF1) rec c: **extension first**, standalone shell second — this actively **conflicts** with founder's implicit standalone-web/desktop-editor plan, which never mentions a VS Code extension.
- CLAUDE.md itself calls review state "the headline claim… under test, not proven" and PRODUCT-BRIEF.md:20-27 (§1) frames the whole product around it. Founder's message relegates review state to one of several things that must "earn it" behind a bare-editor MVP — a real narrowing of what frontmatter *is*, not just what ships first. This is an unresolved identity question, not a scoping detail.

## 9. Spec-driven development, Spec Kit, AGENTS.md, kickoff prompts, generating docs for users

**DIRECT CONFLICT.** PRODUCT-BRIEF.md:171 (§6, vocabulary audit): **"Kickoff prompt, vendor CDN | Worse than a slash command; breaks 'no document bytes on our server' | Cut."** This is the exact mechanism step 3 of the new funnel re-proposes ("gives the user a kickoff prompt … the documents are at this link"). The existing spec-kit/superpowers engagement plan (`decisions/v2/business-operations.json` B17, `decisions/v2/go-to-market-channels.json` G6, `decisions/v2/market-competition.json` MK5) is a **README-line integration with existing agent-toolchains that write to the user's own repo** — not a hosted document-generation-and-handoff product. `AGENTS.md` §0.1 treats generated docs (DEV-PLAN, ENGINE, etc.) as **derived from `docs/research/` and rebuilt by `npm run tree`/`npm run doc`**, i.e. repo-local build artefacts, not a user-facing SaaS feature. Nothing in the corpus supports "generate 00-EXECUTIVE-SUMMARY…29-RUNBOOK for an end user and host it" as a product; it was explicitly the thing that got cut.

## 10. R2 no object versioning; AI model prices with dates

**UNCHANGED, and load-bearing if the funnel proceeds.** `docs/DEV-PLAN.md:3085` and `docs/FRONTMATTER-DECISIONS-2026-08-29.md:63`: R2 has no `PutBucketVersioning`/object-lock; a `PUT` to an existing key is silent, irreversible destruction; versioning must be built into the **key layout** (content-addressed immutable keys, e.g. `{doc_sha}.pdf`, never overwritten) — `docs/DEV-PLAN.md:1692`. If generated document kits are stored in R2 under a GUID, this constraint applies directly and is not optional. AI prices, fetched 2026-08-30: **Claude Sonnet 5 $2/MTok input, $10/MTok output** (`decisions/v2/business-operations.json:2682`); Cloudflare Workers Paid $5/mo minimum; R2 $0.015/GB-month; Dodo Payments 4%+15¢ on Indian cards (same block, `business-operations.json:2682`-2700). PRODUCT-BRIEF.md:137: "output tokens are 75.8% of model spend" — relevant because a document-kit generator (many long documents) is output-token-heavy, and no cost model exists yet for that funnel specifically.

---

## The five conflicts the founder must settle first, in order

1. **Do we hold document bytes at all, ever?** L1 / B16 / P8 / MK18 all say delete Firestore and hold nothing; the funnel's core deliverable (a stored, linkable document kit) requires holding documents. Every downstream legal, pricing, and architecture answer is a function of this one choice — restating LR#... the same finding decisions/v2 already made about the old Firebase design (`decisions/v2/legal-privacy-data.json:5`).

2. **Is the kickoff-prompt/hosted-handoff mechanism un-cut?** PRODUCT-BRIEF.md:171 cut it by name for breaking the no-bytes rule. The founder's funnel step 3 reintroduces it. This can't be silently reopened — it needs an explicit reversal, on the record, with the legal cost (item 5 below) named.

3. **What do Pro and Max actually gate?** Existing cards (PR21, PR24, PR3, MK10) price Pro on shared review state + retention and recommend deleting Max; the founder's storage-location-based Free/Pro/Max needs its own new decision, not a re-read of the old one.

4. **Re-derive the funnel's engineering-day cost at 1.21 days/week before any timeline is quoted.** The 58-week estimate already applies to a *smaller* MVP-0 than what's now proposed (bare editor **plus** a new decision-engine/generator/storage funnel). No number exists yet for the funnel; AGENTS.md rule 3 requires one before the plan moves forward.

5. **Decide what frontmatter fundamentally is.** CLAUDE.md and PRODUCT-BRIEF §1 call review state the headline claim under active adversarial test. The founder's message treats review state (and attribution, the engine, the certificate, the docs scan) as optional things to "beta test… if they earn it" behind a bare editor clone. Those are two different products with two different reasons to exist; the identity question has to be answered before scope, pricing, or legal posture can be finished.
