---
title: Decisions for the founders, 17 September 2026
status: nothing decided here; each row carries a default and what changes under each answer
source: the independent audit of plan v4 (verify/2026-09-17/CLAUDE-AUDIT-REPORT.md) and the response ledger (verify/2026-09-17/RESPONSE.jsonl)
---

# Decisions for Sagnik and Amit

One page. Sixteen questions the audit says only you can answer. Each has the auditor's evidence, my own check, a default the plan now carries, and what changes under each answer. Question 6 is first because its answer changes every other row. Approve the defaults or change them; revision 5 of the plan is written to the defaults.

## 1. The pace (plan question 6)

**Auditor.** Distinct days with a code commit: 10 in the last 58 days (1.21 a week), 4 in the last 30 (0.93), 12 in the last 90 (0.93). Since 1 September, 3 commits touched code and 111 touched documents. One author on every commit in 90 days (F032). Twenty-four weeks of full-time appetite is 99 to 129 calendar weeks at that pace.
**My check.** Reproducible from git log; the plan gave no default.
**Default.** Phases 0, A, B, D and H ship at the measured pace, with dates published every Friday; E, F and G move to Later; a contractor is engaged for D and F if the pace has not doubled by the pilot.
**If you answer otherwise.** Full time from both founders: the phase table stands as written. A contractor from day one: phases A and B run in parallel with D and the pilot comes forward by about eight weeks.

## 2. Pro price and routing

**Auditor.** At the caps, Pro on Sonnet 5 costs ₹321 a month against ₹246 net of GST and Razorpay (F001). Every twelve-month scenario loses money on that routing.
**My check.** Re-derived: ₹321.47 on the eleven-file blueprint; ₹367 on the fourteen-file blueprint the screens now show. Haiku 4.5 for edits and Sonnet 5 with batch for blueprints: ₹184. Haiku for everything: about ₹161.
**Default.** ₹299 stays. Pro edits run on Haiku 4.5; blueprints run on Sonnet 5 through the batch API; caching is measured in week one. Margin per Pro user before fixed costs is then about ₹60.
**If you answer otherwise.** Sonnet for everything: raise the price to at least ₹499 or cut the caps to 50 edits and 3 blueprints. Keep the caps and the price and the routing: Pro loses about ₹120 per active user per month.

## 3. The free chain and the sign-in promise

**Auditor.** The chain routes to OpenRouter's Nvidia-served free endpoints, whose data terms were never opened; the auditor's worker read a training flag on the endpoint (F006). The sign-in page promises "We never train on your documents".
**My check.** I could not reproduce the flag today, but the plan's own rule already excludes any link whose terms were not opened. Groq, Cloudflare Workers AI and SambaNova's production models state no training in pages opened by the research; Cerebras is a 30-day trial behind a payment method (F005).
**Default.** The chain is Groq, Cloudflare Workers AI, Cerebras while the trial lasts, SambaNova; the local model on the desktop. No OpenRouter endpoint until its provider's terms are opened and quoted. The promise stays, and links to the provider list. Paid Cloudflare neurons from about 260 active free users.
**If you answer otherwise.** Add a provider whose terms permit training: the sign-in line must change to "We do not train on your documents; some providers on the free plan may", which is a different product.

## 4. The legal floor, the public pages, the grievance officer

**Auditor.** Revision 3's legal floor was dropped without a marker; the live site sends /privacy, /terms and /pricing to the sign-in wall (F008, F054, F068, F069).
**My check.** Confirmed live with curl today: all four paths answer 307 to /login. The IT Rules and CERT-In quotations are the auditor's; the statutory dates could not be opened from this network.
**Default.** The legal section is back in the plan with an owner and a date per row. Placeholder public pages ship on this branch and say the text is pending. Sagnik is the grievance officer of record until you say otherwise. Nothing publishes for a stranger until the apparatus exists.
**If you answer otherwise.** Name the other founder, or counsel, as the owner; the dates move with them.

## 5. K1, what the product is in one sentence

**Auditor.** The decision set reserved K1 to you; the plan took it implicitly (F057).
**My check.** The plan's section 1 sentence is "a markdown editor for people whose documents are increasingly written with, and for, AI agents".
**Default.** That sentence, recorded as yours in section 21.
**If you answer otherwise.** "The best markdown note-taking app in the world" changes the customer from group one to group three and moves Ideas behind the editor in every phase.

## 6. K2, which bytes we hold, from which phase

**Auditor.** The plan holds every document on R2 and Supabase from day one; card K2's recommendation was to hold as little as possible for as long as possible.
**My check.** Sign-in first and cloud documents on Free make holding unavoidable from phase A.
**Default.** Every cloud document is held from phase A, with the deletion, export and retention rules the data model section now states.
**If you answer otherwise.** The desktop app carries the first pilot and the web holds only shared pages: phase F moves before phase A and the free caps become meaningless until sync exists.

## 7. K3, the name

**Auditor.** Front Matter CMS holds the store name with 82,819 installs; the Indian register needs an OTP login a founder must do (F008).
**My check.** Not re-checked; the register is behind a login.
**Default.** The name stays, the search is run by a founder before Razorpay goes live, and the plan carries the collision as a risk.
**If you answer otherwise.** A new name changes the domain, the published-page URLs and the portfolio path; the plan's screens change in a day.

## 8. Live editing and the CRDT ban

**Auditor.** Yjs is a CRDT; the plan says never a CRDT and uses Yjs on different pages (F055). The Zed rebuttal is still owed.
**My check.** Revision 3 carried the exception paragraph; revision 5 restores it: the session state lives only while two people have the file open, every save is a splice, nothing from the session persists.
**Default.** Live editing stays in phase D on that rule.
**If you answer otherwise.** Cut live editing to Later: phase D shrinks by about a week and the three-collaborator cap becomes a sharing cap, not a live one.

## 9. The free caps

**Auditor.** The plan's 50 documents, 5 pages and 3 collaborators against your 5, 2 and 1; the audit accepts the plan's evidence and adds the downgrade case (question 9).
**My check.** The market floor of 50 and the comparables stand; a blueprint alone is fifteen files.
**Default.** 50, 5 and 3; a downgraded account keeps every document readable and exportable and cannot create new ones until under the cap.
**If you answer otherwise.** 5, 2 and 1: the import and idea funnels block on day one; the plan says so and the screens change in an hour.

## 10. Bring-your-own key

**Auditor.** Card F10 and the 8 September round rated a key field as evidence-backed; the plan dropped it (F056).
**My check.** Not in the plan; the abuse risk of the free chain is carried by the sign-in wall alone.
**Default.** A key field in Settings AI in phase B, for Anthropic and any OpenAI-compatible endpoint; a person's calls run through their key when present; the operator-paid chain is the fallback.
**If you answer otherwise.** Operator-paid only: budget the free pools for abuse and keep the per-account breaker tight.

## 11. Desktop before or after sync, and who signs Windows

**Auditor.** Azure Artifact Signing excludes Indian entities; Apple is 99 USD a year (F071).
**My check.** Consistent with the plan's own S25 note.
**Default.** The desktop app ships after Drive sync, signed for macOS on the Apple programme, unsigned on Linux by choice, Windows shown as coming until a commercial certificate is priced.
**If you answer otherwise.** Desktop first: phase F moves before E and the Windows question must be answered before, not after.

## 12. The age floor

**Auditor.** DPDP section 9 requires verifiable parental consent for a child under eighteen; the plan states no age (F077).
**My check.** Section text verified by the auditor; the commencement date could not be opened.
**Default.** Eighteen, stated in the terms and on the sign-in page's fine print.
**If you answer otherwise.** Thirteen with a consent path once the rules' commencement is confirmed by counsel.

## 13. Accounts that move to the company

**Auditor.** The Cloudflare zone sits on a personal account; the domain, Razorpay, Apple and the provider accounts are unnamed (A43).
**My check.** AGENTS.md section 6b records the split as deliberate.
**Default.** An ownership table in the plan; the zone, the domain and Razorpay move to the company before the first rupee; Apple and the providers at phase F.
**If you answer otherwise.** State which stay personal and why, and the risk row records it.

## 14. The twenty hand-made kits

**Auditor.** The 13 September plan and revision 3 gated everything on twenty hand-made kits; revision 4 dropped the gate (F009).
**My check.** Confirmed by grep on both earlier plans.
**Default.** Phase 0 returns: twenty kits by hand for twenty people outside the studio, five of twenty run the kickoff, two of ten edit the kit again, before phase C starts.
**If you answer otherwise.** Ideas ships on conviction; the kill line moves to the pilot.

## 15. The pilot's stop and continue lines

**Auditor.** Section 20 listed measures with no thresholds (F067).
**My check.** The audit's pilot design is sound and sized to twenty people.
**Default.** Stop if fewer than four of twenty are active in week two, fewer than two of ten kit recipients run the kickoff, or fewer than three of twenty name the problem unprompted. Continue on six of twenty, three of ten, and one person asking how to pay.
**If you answer otherwise.** Set your own numbers; the plan carries whichever you choose.

## 16. Which earlier positions stand

**Auditor.** The Zed rebuttal, the review sidecar, the extension form factor, the community, the Max tier (F023, F058).
**My check.** Review state is dropped in favour of the change queue and the plan now says so; community and Max are deferred and named; the Zed rebuttal is owed.
**Default.** Rebuttal written before phase D; sidecar dropped; extension not planned; community and Max Later.
**If you answer otherwise.** Say which returns and the phase table absorbs it.
