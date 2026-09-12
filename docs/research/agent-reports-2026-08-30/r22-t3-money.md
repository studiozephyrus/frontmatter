**Conclusion: services fund this, not investors and not the product — one founder on ~60–80 client hours a month covers the entire two-person nut, and because the record's own roadmap is already scoped for a single person, those hours cost exactly zero product velocity.**

*(Reconcile, verified: read-only. Only `sed`, `grep`, `curl`, `python3`, `date`, `git status`, `git log` ran this session. `~/.claude` HEAD `6e390828`, unchanged; the 19 dirty skills/config paths and the frontmatter working-tree diff predate this session and were not touched.)*

**A discrepancy named first.** The brief says two founders. §53 says *"One person. This is the binding constraint on everything above."* §28.6's calendar — 1 pt ≈ 1.09 calendar days, R0 = 58 pts = 63 days — is derived from solo throughput `[measured, docs/FRONTMATTER-RECORD.md §28.6]`. A second founder is modelled nowhere in the plan, which makes the second founder free capacity against the published schedule. That is the finding.

---

## 1. The bootstrap path — what default-alive costs

| Input | Value | Source |
|---|---|---|
| USD/INR | 95.39 | `[fetched, §24.1/§85.3, ECB via api.frankfurter.app]` |
| Single person, Kolkata, excl. rent | ₹30,840.70/mo | `[fetched, numbeo.com/cost-of-living/in/Kolkata, 2026-08-31 IST]` |
| 1BR city centre / outside | ₹15,526.32 / ₹8,588.24 | `[fetched, same]` |
| **Minimum founder draw** | **₹45,000/mo each** | `[derived: 30,840.70 + 15,526.32 = ₹46,367; rounded down]` |
| CA retainer | ₹90,000/yr = ₹7,500/mo | `[SS, §85.1 range ₹35k–90k — get three written quotes]` |
| Apple Developer Program | $99/yr = ₹787/mo | `[fetched, §85.4]` |
| Error tracking + uptime + email | ~$80/mo = ₹7,631 | `[inference — §53 says buy these; no quote opened]` |
| Misc SaaS, domains, password manager | ₹3,000/mo | `[inference]` |
| Zoho Books | ₹0 while FY revenue ≤ ₹25L | `[fetched, §85.1]` |
| Contribution, India Pro ₹299, cheap-model | ₹217.40 | `[derived, §23.2 — net of Razorpay 2.36%, GST, inference, infra]` |

**Fixed monthly overhead = ₹18,918** `[derived: 7,500 + 787 + 7,631 + 3,000]`

| Draw scenario | Monthly nut | Annual | Paying @ ₹299 | @ ₹599 |
|---|---|---|---|---|
| **Survival — ₹45k each** | **₹1,08,918** | ₹13.07 L | **501** | **284** |
| Not-resentful — ₹75k each | ₹1,68,918 | ₹20.27 L | 777 | 441 |

All `[derived]`. **Default-alive is ~500 paying users, not 6,689.** The ₹20L/mo milestone the record orbits is 13× default-alive.

**The AI budget was never the problem.** At 400 paid, inference capped at $0.40/user is $160/mo = ₹15,262 `[derived, §25.1]`; on the cheap-model default ₹14.31/paid user = ₹7,155 `[derived, §23.2]`. Free tier is BYO-key, $0 by construction. Cloud + AI at 10,000 users totals **$271.83/mo = ₹25,933** `[derived]`.

**How long.** §82.1 supplies the churn term the milestones omit; stock asymptotes at `g/c`.

| Churn `c` | Gross adds/mo to reach 502 in 24m | Ceiling `g/c` | Signups/mo @5% | Visitors/mo @9% |
|---|---|---|---|---|
| 2% | 26.1 | 1,307 | 523 | 5,811 |
| **4%** | **32.1** | **804** | **642** | **7,133** |
| 6% | 38.9 | 649 | 778 | 8,644 |

`[derived]` from `N_T = g(1−(1−c)^T)/c`.

**Funnel sanity-check against the record's 1.26M.** At c=4%, g=32.1, T=24: 770 gross paying adds, 268 churn away, stock 502. Signups = 770/0.05 = **15,408**; cumulative visitors = **171,200** `[derived]`. Cross-check: 502/6,689 = 7.5%; 7.5% × 1,261,193 = 94,651 visitors for the *stock alone*. The 76,549 gap is exactly the churn replacement §25.3 leaves out. The two derivations agree. **Default-alive needs ~171,000 cumulative visitors over two years — about 7,100/month.** A blog with traction, not a distribution miracle.

**And it fits under the ops wall.** §85.6: 0.1445 founder-hours per paying user/month + 19 fixed.

| Paying users | Ops hours/mo | % of one 198h month |
|---|---|---|
| 285 | 60.2 | 30% |
| **502** | **91.5** | **46%** |
| 778 | 131.4 | 66% |
| 1,239 | 198.0 | **100% — the wall** |

`[derived]`. **The bootstrap target is operationally survivable; ₹20L/mo is not** — §85.6: *"the wall is crossed at roughly 1,240 paying users, not at 10,000."*

---

## 2. The raise path — and the number that ends the conversation

| Source | Terms | Stage | Read |
|---|---|---|---|
| **Antler India** | **₹4 Cr (~$425K) for 11%**, decision in 3 weeks; 2 weeks in-person Bengaluru; ₹2L relocation grant; invests in 50–75% of residency teams; ~50% of deals outside the programme | *"pre-launch, pre-product, or pre-revenue"* — AI-first, 115+ India portfolio | `[fetched, antler.co/residency/india, 2026-08-31 IST]` |
| **Y Combinator** | **$500K on two SAFEs**: $125K for a fixed 7% post-money + $375K uncapped with MFN. At a $15M cap the MFN is 2.5% → **~9.5% total** | Pre-seed/seed | `[fetched, ycombinator.com/deal, 2026-08-31 IST]` |
| India VC market | ~**$16B** deployed 2025; fund-raising doubled to **~$5.4B**; theme is *"AI, deeptech, climate, space, and industrial technology"* | Macro | `[fetched, bain.com India VC Report 2026, 2026-08-31 IST]` |
| Peak XV Surge, Blume | Terms absent from served HTML — both JS-rendered | — | `[SS — not opened]` |

Antler's implied post-money: ₹36.4 Cr ≈ **$3.81M** `[derived: 4/0.11]`. YC's $125K tranche implies **$1.79M** post `[derived]`.

**Is this fundable?** A seed fund underwrites to $100M+. Take the softest bar — $10M ARR at a 10× multiple.

| Step | Value | |
|---|---|---|
| ₹20L/mo milestone | ₹2.4 Cr/yr = **$251,599 ARR** | `[derived @95.39]` |
| $10M ARR | ₹95.4 Cr/yr = **₹7.95 Cr/mo** | `[derived]` |
| Paying users at ₹299 | **265,858** | `[derived]` |
| Free users @5% dev-median conversion | 5,317,168 | `[derived]` |
| Cumulative visitors @9% | **59.1 million** | `[derived]` |
| × the ₹20L milestone | **39.7×** | `[derived]` |
| × the founder-capacity wall (1,239) | **215×** | `[derived]` |

India has 21.9M GitHub contributors `[SS, §24.5]`. The venture-scale version at ₹299 needs 2.7× that entire population as cumulative visitors, and 215× the point where one founder's month is fully consumed by support.

**Verdict: not fundable in its current shape — and don't spend a month learning that from a partner meeting.** Blockers, ranked by how badly they read in a first pitch:

1. **Zero users.** M7 — *"one paying non-founder account"* — is dated **2027-04-28** `[§28.6]`. Eight months of pre-revenue to explain.
2. **ARPU is 40× too low for the outcome**, with a deliberate no-lock-in stance (§82.2: *"our file-is-the-source-of-truth stance deliberately removes lock-in… That is the right ethical choice and it raises churn"*).
3. **The category's best comparable rejected the raise.** Obsidian: *"we are 100% supported by our users, not investors"* `[fetched, obsidian.md/about, 2026-08-31 IST]`.
4. **The thesis is a correctness guarantee** — byte-preserving splice, refuse-rather-than-guess, degradation certification. The most defensible engineering in the record; the least legible slide in a deck.
5. **Antler's live filter is AI-first.** An editor whose distinguishing claim is *not* generating tokens is off-thesis for the one investor whose stage matches.

On cash terms the raise looks attractive — ₹4 Cr is **367 months of the ₹1.09L nut** `[derived: 4e7 ÷ 108,918]`. That is precisely the trap: 30 years of runway bought with a 7-year fund clock, against a roadmap whose R0 lane alone is 9 weeks.

---

## 3. The third path — services, with real arithmetic

**Effective rate, derived from shipped work.** `md/Zephyrus/ecosystem.md` §4.8: Framer marketing site ₹50k–1.5L in 2–4 weeks; bespoke Next.js content-as-code site ₹1.5–3.5L in 3–6 weeks; **AMC ₹15–40k/mo SLA-only, ₹50k–2L/mo active development** `[measured]`.

₹1L over ~70 h = **₹1,429/h**. ₹3.5L over 6 weeks × 30 h/wk = 180 h = **₹1,944/h**. Band: **₹1,400–2,000/hour** `[derived]`.

| Nut to cover | @ ₹1,400/h | @ ₹2,000/h |
|---|---|---|
| ₹1,08,918 (survival) | **78 h/mo — 18.0 h/wk** | **54 h/mo — 12.6 h/wk** |
| ₹1,68,918 (comfortable) | 121 h/mo — 27.9 h/wk | 84 h/mo — 19.5 h/wk |

`[derived]`. In retainer terms: **three SLA-only AMCs at ₹30k, or one active-development retainer at ₹1.1L.** The register lists 60 live URLs and five client-embedded engagements (Perccent, Travox, GearUp, Clinix/Dox, Bricklynn) with *"AMC contract signed (if applicable)"* already in the phase-2 SOP `[measured]`. Not a hypothetical pipeline — asking existing clients for maintenance.

**What it costs in velocity — the part that decides everything.** If ONE person splits time, §28.6's calendar stretches by 1/(1−fraction):

| Client share of a 198h month | Stretch | R0 (63 days) becomes |
|---|---|---|
| 20% | 1.25× | 79 days |
| 35% | 1.54× | 97 days |
| 50% | 2.00× | 126 days |

`[derived]`. **But no split is required.** The 63-day R0 and 2027-03-31 code-complete are *already* a one-person schedule `[§53, §28.6]`. So:

- **Founder A: 100% on the R0 critical path.** Hits the published calendar exactly — it never assumed help.
- **Founder B: 54–78 h/month of client retainer work** covering the whole nut, plus the ~91.5 ops hours §85.6 demands at 502 users, plus the §53 "hire this first" support role. ~170 of 198 hours: full, not overloaded.

**Cost against the published plan: zero.** Counterfactual cost — what two full-time founders could have done — is real: roughly one founder-quarter per year forgone `[inference]`.

HN is unanimous on the failure mode, and it is time-allocation, not strategy: *"The startup failed because so much time was spent consulting to bring in revenue… If you're going to fund your company with consulting, make sure you have a very strict rule about how much time you spend consulting"* `[fetched, hn.algolia.com comment 2018-09-18]`. The rule here is numeric and checkable: **founder B's client hours never exceed 90/month, and founder A's never exceed zero.**

---

## 4. Where the money goes, and the three levers

At 502 paying / ~10,000 total users:

| Line | ₹/mo | Share |
|---|---|---|
| **Founder draws (2 × ₹45,000)** | **90,000** | **66.7%** |
| Fixed overhead (CA, Apple, observability, misc) | 18,918 | 14.0% |
| Cloud + hosted inference | 25,933 | 19.2% |
| **Total** | **1,34,851** | |

`[derived, §25.1 + above]`. **Two-thirds of burn is people; infra and AI together are 19%.** Every hour shaving cloud cost is an hour not spent on the two-thirds.

1. **Refuse the surfaces that manufacture support hours.** Support is the wall (§25.1: *"support, not compute, is the wall"*). The no-plugin decision already deletes 22.79% of Obsidian's help volume before it exists `[derived, §46.2 — 7,076 of 31,048 tagged topics]`. Extend it: no iOS/Android until the time budget has slack (§85.4), and ship the Mac app outside the Mac App Store — Developer ID + notarization is **$99/yr and 0% commission** against a 15% cut equal to **27.2% of contribution** on a ₹299 sub `[fetched + derived, §85.4]`.
2. **Annual-default INR pricing.** ₹2,499/yr cuts the Dodo all-in fee from **9.29% to 4.63% — 466 bps** — and reduces renewal events from 12 to 1 against a rail that gets **one debit attempt** at an 8% single-attempt failure rate `[derived + fetched, §85.3, §82.3, §85.6]`.
3. **Prompt caching, and BYO-key everywhere.** Caching is *"the single largest COGS lever"* — 2.8× more assists per rupee on Sonnet 5 `[fetched, §23.2]`; free tier is $0 by construction. Together these hold the AI line under ₹8,000/mo at default-alive scale.

The record flags its own contradiction: infra per paid user is $0.153 at 1,000-user scale (§23.2) but $0.280 at 10,000 (§25.1) `[§32 contradictions ledger]`. The pessimistic figure moves default-alive from 501 to ~530. No decision here changes.

---

## 5. The decision

**Take the third path. Bootstrap, funded by client retainers, with a hard split of labour. Do not raise.**

**The eleven other things, and why they are distractions now:** an angel round, friends-and-family, revenue-based financing, venture debt, a Kickstarter/lifetime-deal pre-sale, an AppSumo listing, GitHub Sponsors, a paid beta, an Indian government startup grant, a hackathon-prize war chest, equity crowdfunding. Each either (a) costs ownership at the moment of minimum leverage — zero users, eight months from M7 — or (b) buys less cash than 60 hours of client work at a rate the founder already commands. None survives contact with the ₹1,400–2,000/hour number.

**What would change it.** One trigger: **the Team tier finding B2B pull.** At $30/editor/month, $10M ARR needs **27,778 seats**, not 265,858 individuals `[derived]` — a 9.6× reduction in required humans, and a shape a seed fund can underwrite. The evidence to watch for: three unsolicited inbound teams asking for multi-editor access, arriving without outbound. Then reopen immediately, because the pitch becomes *"the artefact layer teams' agents write into"* — and §14/§62 already contain that product.

**Reopen regardless at 550 paying users** — §85.6's first-support-hire trigger — **with six months of measured cohort churn below 5%/month.** At that point you have an ARR number, a retention curve defensible without citing a single `[SS]` benchmark (§82.2 forbids that in a pitch), and a capital need that is a *hire*, not a salary. Raising to pay yourself is the worst reason to give away 11%; raising to buy the support engineer who moves the wall from 1,239 to 2,478 is a defensible one.

Until then: **rotate the two PATs today, port `ci.yml` this week, and send three AMC proposals to existing clients on Monday.** The last one funds the first two.
