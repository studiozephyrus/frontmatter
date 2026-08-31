LR#48 verified read-only: `~/.claude` HEAD unmoved at `6e39082` (2026-08-27), no commit created, all dirty paths predate this session.

The founder has already been running a full-time unpaid consulting engagement — for himself — for sixty-five days: 598 commits went into the orchestration substrate against 55 into the product, and the loop that substrate is built to sell has been dark since 3 August, which means the most sellable line in the pitch is the one line he currently cannot demonstrate running.

**What is broken, stale or abandoned — first, because it is the useful half**

| Thing | Live state | Evidence |
|---|---|---|
| **Eval loop** | Newest genuine eval artefact **2026-08-03** — 27 days dark. Reports by month: 1 Jun, **70 Jul, 8 Aug** | [measured] `find ~/.sgnk/evals -name "report-*.md" \| sed …\| uniq -c` |
| **The kappa number** | **κ = 0.1**, CI95 [−0.125, 0.40], bar 0.7, n=9, verdict `FAIL — gate is NOT calibrated`. Never re-run | [measured] `cat ~/.sgnk/evals/complexity-kappa-2026-07-17.json` |
| **Calibration record** | `sgnk-complexity-gate.last_run = 2026-06-27`, `meets_kappa_bar: false`, `trust: "plumbing-validated-only"` — the file's own words | [measured] parse of `~/.sgnk/calibration.json` |
| **Routing bandit** | `routing-bandit.json` mtime **2026-08-20 23:58** — 10 days stale while traces kept accruing | [measured] `stat -f %Sm` |
| **Preference log** | 241 rows, 2026-06-28→2026-08-30, **`accepted` null on all 241**; `skill` = `"unknown"` on 183 | [measured] parse of `PREFERENCE-LOG.jsonl` |
| **Trace attribution** | 5,135 lines; 5,049 parse; **32 unparseable**. `skill="unknown"` **79.1%** (3,993/5,049). `accepted` null **96.4%** (4,867). `assertion_pass` non-null on 694, of which **72.0% FALSE** | [measured] `cat ~/.sgnk/traces/*.jsonl \| python3 …` |
| **Ledger integrity** | Last nightly run emitted **4 `LEDGER-TAMPER`** (2026-08-13/15/16/17) and 23 `LEDGER-REPAIR` | [measured] `awk '/EOD run 2026-08-30T18:25:05Z/,0' eod.log \| grep -c` |
| **Studio register** | `ecosystem.md` mtime **2026-06-21** — 70 days stale, and contains **zero** line items for AI-enablement or developer-productivity consulting | [measured] `ls -la`; §4.5/§4.8 read in full |
| **`~/.sgnk` source** | Last commit **2026-08-13** — 17 days | [measured] `git -C ~/.sgnk log -1` |

Two things are genuinely alive and must not be lumped in: the **nightly EOD job** ran 2026-08-30T18:25:05Z, and **calibration-runs** wrote three files dated 2026-08-31 [both measured]. The plumbing fires. What stopped is the human half — labelling, judging, promoting. Learned Rule #32 applies as written: this is not a self-improving loop today.

**Dormant versus dead, per Learned Rule #51**

`skill-health.json` (generated 2026-08-30T18:27:44Z, 7-day window) gives its own verdict: **active 0 · dormant 7 · dead 115 · infrastructure 10**, total invocations 9, total human labels **1** [measured]. Rule #51 forbids reading "dead" literally over seven days — `browse`, `cso`, `autoplan` legitimately idle a quiet week. But the honest sellable claim is not "131 skills". It is **10 infrastructure components firing every turn through 28 hooks across 8 events** [measured, `settings.json`], plus a long tail unproven outside its author's machine.

**What is actually sellable today**

| Asset | Sellable? | Why |
|---|---|---|
| 28 hooks / 8 events — taint gate, spawn gate, bash-assert, digression guard, precompact | **Yes, strongest** | Fires every turn without invocation; visible in a client's first session |
| Trace ledger — 65 day-files, 1.81B in / 122.6M out tokens | **Yes** | Sell as instrumentation, not intelligence — the 79% attribution loss is a defect to disclose |
| 69 assertion gates | **Yes** | Newest 2026-08-13; executable and portable |
| `sgnk-handover` / `sgnk-snapshot` | **Yes** | Among the only 7 with any 7-day use |
| **Eval loop with kappa** | **Not today** | κ=0.1 FAILED, 27 days dark — selling it is the flattery failure this audit exists to prevent |
| 131-skill catalogue | **No** | 115 unused in 7 days; installing it exports dormancy |
| AIOS book (337,410 words) | **Credential, not deliverable** | [measured] `wc -w ~/.claude/AIOS-BOOK/book.md` |

**The going rate — what I could and could not open**

Every rate-card aggregator refused: GSA CALC 404, Upwork 403, Clutch 403, consultancy.uk 404, DesignRush 403, Azure Marketplace 403, G-Cloud search 404. Contracts Finder's OCDS API returned 200 across 100 releases but ignores its own `keyword` parameter — 0 AI-titled notices [measured]. **I have no published day-rate benchmark.** What opened is the better anchor anyway — what companies verifiably pay per head for this knowledge:

| Source | Price | Read |
|---|---|---|
| Maven / Parlance Labs *AI Evals* cohort (Husain — the method these Learned Rules cite by name) | **$4,200/seat**, cohort Sep 5–Oct 3 | [fetched] maven.com/parlance-labs/evals, 2026-08-30 |
| Section, *AI Academy for Small Teams* (<100) | **$750/seat**; Teams tier quote-only | [fetched] sectionai.com/pricing, 2026-08-30 |
| Claude Team | **$20/seat/mo** standard annual; **$100/seat/mo** premium | [fetched] claude.com/pricing, 2026-08-30 |
| GitHub | Team $4/user/mo; **Enterprise $21/user/mo** | [fetched] github.com/pricing, 2026-08-30 |

A five-engineer team already spends **$21,000** to learn evals from one cohort course [derived: 5 × 4,200] and $1,200–6,000/yr on AI seats. His own rate card (§4.8) implies a build day-rate of **~₹20,000** [derived: ₹12L ÷ 60 working days on the 10–14-week ops-control-plane line]. Advisory prices above build rate.

**The honest tension, with the arithmetic**

The founder-time model is §85.6, not §46 (§46 is Support and deflection — the prompt's numbering is off by seven). It gives a **198-hour month** minus 17 h fixed compliance ⇒ **181 engineering hours** [record, derived there].

Cash burn today, from §85 and §25.1 at ₹95.39/$: Workers $5 = ₹477 · Apple $99/yr = ₹787/mo · CA ₹35–90k/yr = ₹2,917–7,500/mo · misc ₹500 ⇒ **₹4,700–9,300/month** [derived].

At the bottom of his own AMC band (₹50,000/mo for ~20 h) one consulting hour is ₹2,500. Against a ₹7,000/mo midpoint burn (₹230/day), **one consulting hour buys 10.9 days of runway** [derived: 2,500 ÷ 230].

That kills the usual argument: **runway is not the constraint, because there is almost no burn.** Consulting can only be justified on founder salary, learning, or distribution — never on survival.

The ceiling: §53 gives one shipped surface per 2–3 weeks ⇒ 1.74/month ⇒ **104 h per surface** [derived: 181 ÷ 1.74]. Nominal headroom = 181 − 104 = **77 h/month**. But measured behaviour refuses even distribution: in the 65-day window frontmatter got **13 active days** against `~/.claude`'s **32** [measured]. He does not interleave; he swaps whole weeks. Practical ceiling: **40 h/month in one contiguous week** [inference from the active-day clustering].

Break-even: at ₹3,00,000 per 10-day engagement, four a year yields **₹12,00,000 = ₹1,00,000/month** — exactly the record's ₹1L/mo milestone, which otherwise needs **284 paying users, 5,675 free signups, 63,060 cumulative visitors** [§25.3, derived]. **One client equals 63,060 visitors of funnel.** Cost: 4 × 90 = 360 h = **16.6% of 2,172 annual engineering hours** [derived], moving cadence from one surface per 2.5 weeks to one per 3.0.

**What it feeds**

Every §26 channel is borrowed — HN, r/ObsidianMD, the Obsidian Discord, X, YouTube, Instagram, TikTok — and the plugin play lives inside Obsidian's ecosystem under a code of conduct the record notes will remove a launch rather than debate it. The record concedes **"exactly two posts have ever shipped"**. A paid engagement is the only channel he owns outright.

It also lands the ICP already named: §21 ICP #2 is *"Agencies and studios, 2–15 — Zephyrus's own shape — we can dogfood it honestly."* A consulting client is a paid ICP-2 install, and their real repository is the corpus the engine needs — zero-indent sequences currently refuse on **83% of foreign vaults** [memory, measured].

**What it poisons — symptoms he can grep for**

| Symptom | The check | Status now |
|---|---|---|
| Bespoke feature | `git -C frontmatter log --grep="<client>"` returns anything | Clean |
| Roadmap capture | §54 D8 (documents leaving the device) or D14 (agent write authority) closed by a client's demand rather than the record — both are exactly what a client will insist on | Both open |
| Agency slide | A new §5 project card in `ecosystem.md` before frontmatter v1 ships | File 70 days stale — the register is already the neglected side |
| **Substrate capture — already happened** | 459 + 139 substrate commits vs 55 product | **10.9 : 1 against the product** [measured] |
| **Loop abandonment — already happened** | Newest eval artefact older than 14 days | **27 days** [measured] |

The last two are not risks. They are the diagnosis. Consulting will not cause this failure mode; it will be its second instance.

**The productised service, designed**

**"Ten Days to a Measured Agent Practice."** Fixed scope, fixed price: **₹3,00,000 India / $8,000 international**. ₹3,00,000 = **$3,145** [derived at ₹95.39/$] — **6.7× cheaper** than sending the same five engineers to one Maven cohort at list; the $8,000 price is still **2.6× under** it.

| Days | Delivered | Who uses it | How often | Repeatable |
|---|---|---|---|---|
| 1–2 | Trace ledger in their harness: one JSONL row per task with `correlation_id`, `accepted`, tokens, latency | Eng lead | Reads weekly | **100%** — it is `sgnk-trace-append.sh` |
| 3–4 | Complexity gate + model/effort ladder tuned to their cost profile | Every dev | Every turn, silently | 80% |
| 5–6 | 8–12 assertion gates over *their* real failure modes, wired to CI | CI | Every PR | 30% — harness ports, assertions do not |
| 7–8 | Binary pass/fail eval set + judge, kappa-measured against 40 labels **from their team** | Eng lead | Before each prompt change | 60% |
| 9 | Hooks: taint gate, spawn gate, bash-assert, digression guard, precompact | Every dev | Continuous | **95%** |
| 10 | A handoff record generated by the system — markdown, in their repo | Whole team | Every handoff | **100%** — `sgnk-handover` |

**Repeatable fraction: 73.5%** [derived: (2×1.0 + 2×0.8 + 2×0.3 + 2×0.6 + 1×0.95 + 1×1.0) ÷ 10]. Ninety founder hours; 2.25 months of the 40 h/month budget; four per year maximum.

Day 10 is the strategic hinge: the engagement ends by handing the client a document that only frontmatter renders well — the §21 wedge, installed at a paying customer, through a channel he owns.

**Days 7–8 cannot be sold until his own kappa is re-run.** κ=0.1 against a 0.7 bar, dark 27 days. Re-run it against a real gold set before the first invoice, or cut days 7–8 and sell **8 days at ₹2,40,000** with evals named as phase 2.

**Cuts, recorded.** No public "AIOS SaaS" (§15) — no named user, no frequency. No shipping the 131-skill catalogue — 115 unused in 7 days; installing them exports dormancy. Ship the 10 infrastructure components plus the 6 they will touch.

**Recommendation: do it, in a hard-bounded form.**

Four engagements a year, 40 h/month, one contiguous week, ₹3,00,000 / $8,000, days 7–8 withheld until the kappa is honest. It is a separate business with a separate unit economic and needs its own line in `ecosystem.md` §4.8 — which has none today, meaning he cannot quote this even if asked tomorrow.

**The trigger that changes the answer.** Stop or refuse the moment any of these is true: one client exceeds 30% of consulting revenue; a client asks for a change inside the frontmatter repository; or product MRR crosses **₹50,000/month** — past that the product's marginal hour compounds and consulting's does not. And take the *first* engagement only after the eval loop has produced one dated artefact newer than seven days, because the alternative is charging a company for a discipline you have visibly stopped practising.
