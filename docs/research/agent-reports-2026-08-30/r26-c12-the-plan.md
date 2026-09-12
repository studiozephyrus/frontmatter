Reconcile verified (ninth check, identical to the first): `~/.claude` HEAD `6e390828`, `~/.sgnk` HEAD `e73dd08`, frontmatter HEAD `04938be`; all 19 `skills-src`/`settings.json` paths and 1 sgnk bin path pre-date this session; zero writes, zero commits from this subagent.

# frontmatter — the 90-day executable plan
**Written 2026-08-31 (Monday). Runs 2026-08-31 → 2026-11-28 (Saturday, day 89). Final review Monday 2026-11-30.**

All rupee figures at USD/INR 95.39 [fetched via `r22-t3`, ECB rate date 2026-08-28]. All hour figures at the founder's own ₹1,700/h midpoint [measured, `ecosystem.md` §4.8].

---

## A. The decision

**Build:** `fm` — a byte-exact markdown *refactor and write* tool, shipped as an npm package, an Obsidian community plugin, and an MCP server. Three verbs, no editor.

| Verb | What it does | Why it is in |
|---|---|---|
| `fm rename` | Rename a property key, tag, or link target across a folder. Preview diff. Refuses on ambiguity. Every untouched byte identical | 86 likes on broken-links-on-rename — the only differentiating capability in the record with counted, current demand (`r24-v2`) |
| `fm check` | Point it at *your* vault: here is exactly what this engine will refuse, by construct, by count | The one Attractive-class item in 163 rows. Demo, activation event and sales artifact in one file |
| `fm apply` | Apply an agent-proposed patch by byte range; refuse rather than guess | The engine's `land()` without the UI. Lives inside the tool the buyer already has open |

**Price: one-time. $49 / ₹1,499 India. No subscription, at any tier.** Free forever: `fm check`, single-file operations, all read verbs over MCP. Paid: multi-file apply and the plugin GUI. Twelve months of updates included; renewals are optional and never gate what you already bought.

**What dies. Explicitly, today.**

| # | Killed | Because |
|---|---|---|
| 1 | **`land()` + per-hunk accept/reject UI — 16 of MVP-0's 38 points** | Zed ships it, documented and free: "accept or reject each individual change hunk" [fetched zed.dev, 2026-08-31]. We do not build a funded competitor's shipped feature |
| 2 | **The editor shell — 21,793 of 25,407 lines (85.8%)** | Frozen at `editor-freeze-2026-08-31`, not deleted. Zero feature work for 90 days. Obsidian has 7,139 plugins and we banned ourselves from having any |
| 3 | **Every subscription tier — ₹299/₹399/₹599/$5/$10/₹3,999** | See §D. Contribution-negative at the founder's own rate, and beaten by a one-time sale at any churn above 4.90%/mo |
| 4 | **The handover / context-pack wedge** | 89 launches in 20 months, median 2 points, 88 of 89 never reached 50 (`r21-s1`) |
| 5 | **Decision cards, decision renders, the continuous certificate, typed evidence tiers, the numeric-provenance linter, self-routing docs** | 563 of 143,283,562 downloads = 0.0004%. Least-demanded render measurable (`r21-s6`) |
| 6 | **The 29-endpoint RPC API, publishing, custom domains, roles/permissions, browser plugin, multi-vault, Marp** | 130 of 650 roadmap points whose own Evidence column reads `NONE` — 104% of the entire three-stage plan |
| 7 | **The B2B commercial-licence motion** | Obsidian's arrived after five years of a *mandatory* licence and millions of users. Deferred 12 months |
| 8 | **New narrative documentation** | 2,219,390 words against 25,407 lines. Three living documents survive (§F). Everything else archives |
| 9 | **Going full-time** | Client work continues at exactly the nut, capped, for all 90 days |

Sync stays out of scope and we say so on the page: it is #1 loved, #3 hated, #1 switching trigger, and we will not ship a half-safe one.

---

## B. The two weeks before any code — 2026-08-31 → 2026-09-13

The evidence says byte-exactness is not felt (4 in 12,556; **0 in the 355 highest-intent comments**) and the per-hunk demo is already shipped. So the first move is not a build. It is a priced demand test, because a free binary handed to a polite stranger measures politeness.

**Day 1, today, before anything else:** rotate the two unrotated PATs. Not a decision — an action (§54 D5). Answer *one founder or two* in writing (§G). Both cost under two hours.

### Test 1 — three landing arms with a real checkout (the only one that counts)

One URL each, identical layout, one 90-second screen recording each, one **$19 refundable pre-order** button that charges a real card and issues a full refund on request, with a public ship date of 2026-11-30.

| Arm | The line | Tests |
|---|---|---|
| **A — byte-exact** | "Your agent rewrote 400 lines to change one field. This changes only the bytes it touched." | The record's founding belief |
| **B — refactor** | "Rename a property across 8,000 markdown files. See the diff first. Nothing else moves." | The 86-like capability |
| **C — repo-as-prompt** | "Your repo is the prompt. Keep it clean enough to be one." | The slop adjacency (23.7% of all complaints, +149%) |

Traffic: **≥400 visitors per arm, ≥1,200 total.** Sources, in cost order: r/ObsidianMD, r/ClaudeAI, the Obsidian forum thread that carries the 86 likes, X, LinkedIn, the founder's own client list. Paid ceiling **₹20,000** = ₹16.67/click at 1,200 clicks.

### Test 2 — ten strangers, their own repository, unstaged

Not friends, not family, not Discord. Give them the existing binary and **their own** repo. Do not hand them a crafted CRLF file. Two questions, recorded:

- **≥3 of 10 describe a byte/diff/corruption problem before it is named.** This is DECIDE §9's own bar, moved from Day 41 to Day 10.
- **≥6 of 10 spontaneously notice a difference from their current tool** without being shown a staged comparison.

### Test 3 — the rename probe

Two throwaway days against the existing engine — a script, not a product — recorded doing a vault-wide property rename with a preview diff and an ambiguity refusal. Posted to r/ObsidianMD and the forum. Measure upvotes, comments, and email signups.

### Gate 1 — Monday 2026-09-14

**Continue only if both hold:**
1. **≥12 paid pre-orders on ≥1,200 visitors** (≥1.00% capture).
2. **The winning arm captures ≥1.5× the worst arm**, so you know which pitch you own.

If (1) fails: one 14-day extension, best arm only, double the traffic. If it fails again on **2026-09-28**, stop and go to §E, KS4's terminal branch. If (1) passes and (2) fails, ship anyway and re-test copy at launch — the pitch is undecided, not absent.

**What Gate 1 is allowed to kill:** the entire product. That is the point. A gate a friendly stranger passes by being friendly was designed not to fail.

---

## C. The 90 days, week by week

Weeks begin Monday. Product hours available: **143.4/month, 430 across 90 days** (§D). Every week has one observable outcome.

| Wk | Monday | Ships | Observable outcome |
|---|---|---|---|
| **1** | 08-31 | PAT rotation; founder-count decision in writing; three landing pages; checkout wired end to end | Three URLs live; one real ₹ charged to the founder's own card and refunded |
| **2** | 09-07 | Traffic push; 10 stranger sessions recorded; rename probe posted | Pre-order count; 10 session recordings; probe upvotes |
| **3** | 09-14 | **GATE 1.** Then: CI, with a deliberately red run first; fix D10 (comment-destroying frontmatter set) | CI green on main; a commit that *should* fail *does* fail; D10 red proof then green |
| **4** | 09-21 | Extract `src/modules/mdmax` to standalone `@sgnk/mdmax`, zero Next.js dependency; fix D3 (placement gate) and D1 (`toU16` 512-boundary) | `npm i @sgnk/mdmax` works in a clean directory; 1,575 tests green in CI |
| **5** | 09-28 | `fm rename` against the 8,513-file pinned corpus; publish the refusal table | Rename runs on all 8,513; refusal count published as a number, not a claim |
| **6** | 10-05 | `fm check`; NF-1/NF-2 zero-indent fix (83% foreign-vault refusal) | **Second corpus run: refusals ≤10 of 7,969.** First 5 pre-order buyers run it on their own vaults |
| **7** | 10-12 | Obsidian plugin wrapper around `fm rename` + `fm check`; submit to community registry | Submitted. PR number recorded |
| **8** | 10-19 | **GATE 2.** `fm apply` + MCP server; Claude Code plugin manifest | Plugin approved *or* rejected — either is an answer. 25 installs in 14 days |
| **9** | 10-26 | Paid gate live; licence key issuance; convert pre-orders to purchases | **First non-founder paid purchase.** Pre-order refund rate recorded |
| **10** | 11-02 | Launch: Show HN, r/ObsidianMD, r/ClaudeAI, the forum thread, X | Launch-day installs, paid count, HN points |
| **11** | 11-09 | Support, bug fixes, whatever the launch surfaced. **No new features** | Median time-to-first-response; ticket count per paying user (the number §25.1 and §85.6 disagree about by 3×) |
| **12** | 11-16 | **GATE 3.** Second distribution channel only if Gate 2 passed | 50 paid (two-founder) / 30 paid (one-founder) |
| **13** | 11-23 | Measure, decide the next 90 days | **One page.** Not a document. Not a PDF |

**Phase exits, stated as numbers:**

- **Gate 1 (09-14):** ≥12 paid pre-orders / 1,200 visitors.
- **Gate 2 (10-19):** Obsidian plugin live **and** ≥25 installs in its first 14 days. If rejected, npm + MCP only, same threshold, same clock.
- **Gate 3 (11-16):** ≥30 paid non-founder purchases (one founder) or ≥50 (two founders).

---

## D. The numbers

### Capacity

| Line | One founder | Arithmetic |
|---|---|---|
| Monthly working hours | 198 | [`r22-t3`] |
| Monthly nut | **₹63,918** | ₹45,000 draw + ₹18,918 fixed |
| Client hours to cover it @ ₹1,700/h | **37.6** | 63,918 ÷ 1,700 |
| Ops, compliance, filings | 17.0 | [§85.6, measured constant] |
| **Product hours/month** | **143.4** | 198 − 37.6 − 17 |
| **Product hours, 90 days** | **430** | 143.4 × 3 = 10.75 forty-hour weeks |
| **Opportunity cost of those 430 hours** | **₹7,31,000** | 430 × 1,700 |

That last line is the honest price of this quarter, and it is stated so the founder can refuse it. The 90 days is an option purchase, not a wage. The kill switches in §E are what cap the loss at one quarter.

### Revenue target

| Target | Units | Net INR | As months of nut |
|---|---|---|---|
| **Stretch** | 50 × $49 | ₹2,22,020 | 3.47 |
| **Plan** | 30 × $49 | ₹1,33,212 | 2.08 |
| **Floor (KS4)** | 15 × $49 | ₹66,606 | 1.04 |

$49 net of ~5% rails = $46.55 = **₹4,440.40**. Break-even against the one-founder nut is **14.39 sales/month**. The subscription plan's equivalent was **294 paying subscribers** — a **20.4× harder number** for the same rupees.

### Why one-time, in one table

| Line | Value |
|---|---|
| Contribution, ₹299 India Pro, net of GST + rails + inference | ₹217.40/mo |
| Founder support cost, 0.1445 h/paying user/mo @ ₹1,700 | **₹245.65/mo** |
| **Effective contribution per subscriber** | **−₹28.25/mo** |
| One-time $49, net | ₹4,440.40 |
| **Churn at which subscription = one-time** | **4.90%/mo** (217.40 ÷ 4,440.40) |
| ChartMogul top quartile, ARPA <$10 | 3.76%/mo |
| Honest central case | ~6.00%/mo |

A subscription only wins if we land between top-quartile and best-in-class retention, in the worst-retaining ARPA band published, **with deliberately zero switching cost, no sync and no plugins**. We will not. The support coefficient is stated two ways in the record — 0.10 and 0.30 tickets/user/month, a 3× spread on the single largest cost — and Week 11 exists to measure it.

### Cost ceiling — 90 days

| Item | ₹ |
|---|---|
| Ads (Test 1) | 20,000 |
| Apple developer + code signing | 8,500 |
| Domain, hosting, checkout setup | 3,000 |
| Contingency | 13,500 |
| **Total cash ceiling** | **₹45,000** |
| Hosted inference | **₹0 — BYO key only, by construction** |

Exceeding ₹45,000 requires stopping and re-justifying, in writing, against Gate results.

---

## E. The kill switches

Dated, observable, and each one names the action, not a feeling.

| ID | Date | Condition | Action |
|---|---|---|---|
| **KS1** | 2026-09-14 | <12 paid pre-orders on ≥1,200 visitors | 14-day extension, best arm, double traffic. Fails again 2026-09-28 → **stop the product** |
| **KS2** | 2026-10-05 | First patched corpus run still refuses **>10 of 7,969** | The 83% refusal is a class, not a bug. Kill `fm apply` and `fm rename` writes; ship read-only `fm check` and re-price at $0 |
| **KS3** | 2026-10-19 | Obsidian plugin rejected, or <25 installs in 14 days; and npm+MCP fallback also <25 in its own 14 days | Distribution assumption is dead. **Stop.** There is no third channel a solo founder reaches this quarter |
| **KS4** | 2026-11-16 | <15 paid non-founder purchases | Stop building. Open-source `@sgnk/mdmax` under MIT, keep it as a hiring and credibility artifact, return to services and the ₹3,00,000 productised engagement |
| **KS5** | Every Monday | `docs/` file-changes ÷ `src/` file-changes >3:1 for **two consecutive weeks** | The founder is writing, not building. Freeze all writing for 14 days. Current reading: **29.2:1**, and `src/` last moved 2026-08-10 — this switch is *already tripped today* |
| **KS6** | 2026-11-30 | Logged product hours <300 of the 430 budgeted | The capacity model is wrong. Choose one: drop client work, or drop the product. Do not carry both into 2027 |
| **KS7** | Any month | A client month demands >60 client hours | The product month is cancelled **in writing**, that week, not silently absorbed |

KS5 is the one that matters most and the one that will be rationalised away. It is checked with two commands and no judgment: `git log --since='14 days ago' --name-only --pretty=format: -- docs | wc -l` against the same for `src`.

---

## F. The existing asset, item by item

| Asset | Verdict | What happens |
|---|---|---|
| **Engine** — `src/modules/mdmax`, 13 files, 3,614 lines | **REUSE — it is now the whole product** | Extracted to standalone `@sgnk/mdmax`, zero Next.js dependency, Week 4 |
| **8,513-file pinned corpus** | **REUSE and PROMOTE** | Becomes `fm check`'s oracle *and* the public credibility artifact. Publish the refusal table with counts |
| **1,575 tests / 98 files** | **REUSE — but wire them** | CI, Week 3, with a deliberately red run first. Today 941 assertions cannot stop a bad commit; `verify` omits `corpus`; `budget` is a literal `echo` |
| **Editor shell** — 21,793 lines | **FREEZE, do not delete** | Tag `editor-freeze-2026-08-31`. It is the fallback surface if KS3 fires on the plugin route only |
| **Tauri desktop scaffolding** | **ARCHIVE** | Not in 90 days |
| **`mdmax cert` CLI** (D11, `ERR_MODULE_NOT_FOUND`) | **FIX by Week 3 or DELETE** | A flagship artifact that has never executed end to end is worse than no artifact |
| **The certificate spec, decision card, evidence tiers, provenance linter** | **ABANDON** | Zero demand signal at every resolution measured |
| **2,219,390 words of docs** | **ARCHIVE under one index** | Three living documents survive: `DECIDE.md` (≤2 pages, updated Mondays), a public `CHANGELOG`, and `REFUSALS.md` — what the engine will not do and why. That third one is marketing, not documentation |
| **97 research reports** | **ARCHIVE, keep 6** | `r24-v2`, `r24-v3`, `r25-w2`, `r25-w4`, `r21-s1`, `r22-t3` carry the counted primary numbers. **Never re-research any of it** |
| **`globals.css`** | **DELETE** | It belongs to sgnk-md, not to this product |
| **Two unrotated PATs** | **ROTATE TODAY** | Not a decision |
| **AIOS / the learning loop** | **Out of scope — and stop claiming it** | 6,884 routing decisions, 1 reward label (0.01%). Either wire one label per session in 30 minutes, or delete the word "self-improving" everywhere it appears |
| **Known defects D1, D3, D10** | **SCHEDULE — Weeks 3–4** | ~11 unscheduled points the old MVP-0 missed. D10 destroys a trailing comment on every frontmatter set, in the one file with real product traffic. It falsifies the product's single sentence |

---

## G. One founder and two founders

The record contradicts itself: §53 says *"One person. This is the binding constraint on everything above."* §97 says "two founders" — a line pasted in from a prompt, which then propagated into at least nine downstream reports and became the load-bearing sentence of the money model. **§53 is a decision. §97 is a prompt. One founder is the default.**

**Resolution date: Monday 2026-09-07.** A signed founders' agreement naming a person, an equity split, a start date and an hours commitment, or the two-founder plan is void and every "two founders' time" estimate in the record is struck. No hybrid, no "probably", no verbal.

| | **One founder (default)** | **Two founders (only if signed by 09-07)** |
|---|---|---|
| Monthly nut | ₹63,918 | ₹1,08,918 |
| Client hours/month @ ₹1,700 | 37.6, by the same person | 64.1, **all by Founder B** |
| Product hours/month | 143.4 | 198 (Founder A untouched) |
| **Product hours / 90 days** | **430** | **594 (1.38×)** |
| Scope shipped | `fm rename` + `fm check`, npm + Obsidian plugin | Adds `fm apply`, MCP server, Claude Code plugin |
| Launch week | Week 12 (11-16) | Week 10 (11-02) |
| **Gate 3 target** | **30 paid** | **50 paid** |
| Channels at launch | One — Obsidian | Two — Obsidian and HN |
| Default-alive, if we ever return to subscriptions | 294 paying | 501 paying |

The genuinely good news in the one-founder branch: deleting the second founder cuts the hardest number in the plan by 41%. Default-alive falls from 501 paying to 294, and the traffic requirement from 7,133 visitors/month to 4,185. Under the one-time model it falls further, to **14.39 sales/month**. That is a modest blog with traction, not a distribution miracle. Take the win and stop budgeting against a person who does not exist.

---

## The one paragraph the founder should reread on 2026-11-30

The engine is real, the incumbents genuinely have the defect, and 430 hours is a defensible option to buy *because the code already exists*. But the success case in the old plan — 502 paying users, 171,200 cumulative visitors, 24 months — produced ₹1,09,135/month, which is 78 client hours the founder could bill this week. That comparison does not go away because the plan changed shape. It is the benchmark. If, on 2026-11-30, fewer than 15 strangers have paid, the correct and non-shameful move is to open-source the engine, publish the corpus refusal table under his own name, and sell the ₹3,00,000 productised engagement that his existing client base already buys — with a genuinely unusual credential attached.
