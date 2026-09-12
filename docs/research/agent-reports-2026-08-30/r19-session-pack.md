## 97. The founding session — how to run it, and what to decide in what order

Two people, one room, one record of 104 sections. The failure mode of a session like this is not disagreement — it is re-opening a question that measured evidence already closed, and losing four hours to it. What follows is the agenda, the routing, and the AI briefing prompt, written so that either founder or a fresh Claude can run it cold.

### 97.1 Settled — do not reopen

Each row was closed on evidence that is in the record and re-checkable. Reopening one costs the session an hour and returns the same answer. If someone wants to reopen a row, the price of admission is naming a *new* fact, not a new preference.

| Settled | The decision | Closed by | Grade |
|---|---|---|---|
| Where documents live | The user's git repo. They never move to us | §5, thesis | Founding invariant |
| Sync mechanism | Git three-way merge + append-only splice journal + compare-and-swap. **Never a CRDT for document bytes** | Round 8–12; arXiv 2305.00583 — CRDTs interleave, so convergence yields byte-identical garbage; diff-match-patch measured non-idempotent while returning true | [fetched] + [measured] |
| Control plane | One Postgres, **zero document bytes**. Metering rows only | PRD v2 §29–35 | Architectural |
| Client-side code execution | Refused. The eval lane does not exist | PRD v2 §18 | Security, permanent |
| Render carrier | `> [!kind]` callout for prose, fence for data. Corrects PRD §9 | Round 8–12: an unclosed fence swallows the document; a callout has no closer | [measured] |
| Founding principle | Refuse rather than guess. Refusal is a typed value, not `return src` | §80.4; an 83% refusal rate ran silently because refusal was indistinguishable from a no-op | [measured] |
| AI credential model | Hybrid — BYO key is the default and the only unlimited path; a capped platform wallet funds first-run | §90.2 | Recommended, defended |
| Credit unit | Actions, not tokens; cheap surface unmetered | §93.1 | Recommended, defended |
| Enforcement at limit | Degrade to the cheap model. Never block, never overage-bill | §93.3; a Dodo dispute is $30 = 9.57× a ₹299 charge [fetched via §84.1] | Recommended, defended |
| Meter placement | The proxy *is* the meter. No second counter, so no reconciliation | §93.2 | Structural |
| INR ceiling | ₹15,000/txn forces on-session AFA — an architectural constant, not a pricing choice | RBI, §45.5 | [fetched] |
| Free tier's marginal cost | ₹0 — the deterministic engine runs on the user's CPU | §91.4 | [derived] |
| Project management | Refused. Three renders only: contracts, decisions, roadmap-as-projection | §92.3 | Product boundary |

The three that will be attacked hardest, and the pre-written answer: **"why not a CRDT"** — because convergence is not correctness, and the paper is opened in the record. **"why can't Pro have unlimited AI"** — because ₹200 of contribution buys 117 frontier rewrites and a motivated writer does that in a week [derived, §90.1]. **"why is the free tier so generous"** — because it costs us nothing, and §24.6 makes it un-takeable once shipped, so the generosity is a one-way door we already walked through.

### 97.2 The decision queue, in dependency order

Ordered so that no decision is taken before the one that re-scopes it. **What it unblocks** is the column that decides sequencing; a decision that unblocks nothing is not a session decision.

| # | The question, in one sentence | Options | Record recommends | Settled by | Unblocks |
|---|---|---|---|---|---|
| **D1** | Which process holds a file descriptor on the user's files? | A browser+FSA · B Tauri real fs · C git transport · D local daemon · E hybrid | **B now, E later.** The current Tauri shell is a remote-URL wrapper with no `fs` capability — calling it "we have a desktop app" is the most expensive false premise available [measured, §91.1] | Founders, whiteboard. No further research needed | **Everything.** MVP scope, free-tier cost, DPDP surface, whether offline is a claim |
| **D2** | Is MVP-0 the rejection demo, or something that looks like a product? | Rejection demo · editor-with-kanban · hosted beta | **Rejection demo.** It is the only demo where the *absence* of an event is the product; every alternative re-categorises us as a note app [§95.2] | Founders, 30 min, after D1 | The 38-pt cut list; what may be argued back in |
| **D3** | Nine weeks of engine before anything visible — accept, or run the market in parallel? | Engine-first serial · engine + priced landing page in parallel | **Parallel from week one.** The honest pre-launch figure is R0+T0+T1 = 132 pts = **20.6 weeks**, not 9 [derived, §96.2]. Nobody in the record ever summed the lanes | Founders. Decide with the 20.6 number on the whiteboard, not the 9 | Whether the 20 persona conversations happen in week 1 or month 6 |
| **D4** | Who is v1 for, and can we name one reachable person tomorrow? | P4 AI-heavy knowledge worker · developers-with-agents · technical writers | **P4, with the concession printed**: "a market of one plus a hypothesis; the only measured instance is the founder's own machine" [§63.4]. Population estimate: **UNANSWERED anywhere in the record** | The 20 conversations. Falsifier: <5 of 20 naming whole-file rewrites kills P4 | The landing-page copy, the MVP-0 tester list, MVP-1's paid line |
| **D5** | What is actually on the paid side of the ₹299 line? | A hosted metered agent review · B hosted sync · C publish · D team seats | **A.** It is the only line with real marginal cost, so charging for it is honest. §24's free tier is generous and Pro is thin — three of its four current items a developer declines on principle [§95.3] | Founders, but only after D4 | MVP-1's 53 pts; the billing rail; ToS |
| **D6** | Does the frontier meter sit on ₹299 or ₹599? | Pro · Power only | **Power only.** 200 metered frontier actions = $5.72 against $4.72 net on Pro — **121% of the tier** [derived, §93.1]. Pro cannot carry it | Arithmetic. Already done; re-derive before quoting | The pricing page, the meter UI, §90's wallet caps |
| **D7** | Do we publish the engine as a package? | A `mdmax` on npm + corpus · B certificate-as-a-service · C publish lane as SKU | **A now, B at first team customer, C never first.** A costs 2–3 weeks and is the only asset that compounds without distribution [§96.1] | Founders, 15 min. Reversible in one direction only | The second-product answer, which is currently **UNANSWERED** |
| **D8** | NFC or NFD for Unicode key equality? | NFC · NFD · refuse non-ASCII keys | Write the one-page decision during MVP-0; **do not build against it**. NF-4 is a Unicode decision wearing a regex costume [§95.2] | One founder, 1 hour, offline | NF-4 quoted keys — `date created` appears in 812 of 957 files in one real vault [measured, §50.1] |
| **D9** | How do we reach a paying user at all? | Email field · in-app channel · neither | Currently **no route to tell a user about a price change or a security incident** [§101 gap 16] — and it conflicts with §38's 15-minute status obligation. §17 separately bans the weekly digest | Defer to MVP-1. It is a launch blocker, not a session decision | Dunning, breaking-change comms, incident response |

**D1 is first because it re-scopes six of the other eight.** If the answer is C (git transport), the free tier stops being free, DPDP applies to document bytes, and MVP-0's demo has to run on our servers. If it is B, the engine is offline, the free tier costs ₹0/user, and the only online thing is intelligence. That single fork changes the arithmetic in §90, §91, §93 and §95 simultaneously.

### 97.3 The session agenda

| Time | What | Mode | Output |
|---|---|---|---|
| 09:00–09:20 | Read §97.1 aloud. Agree the settled list, or name a new fact | Talk | A signed-off do-not-reopen list |
| 09:20–10:30 | **D1 — file access.** Open `tauri.conf.json` on the screen first, so nobody argues from the false premise | **Whiteboard.** Draw the three processes; there is no fourth | One letter: A/B/C/D/E |
| 10:30–11:15 | **D2 — MVP-0.** Re-scope against D1's answer | Whiteboard | The 38-pt list, and the three things explicitly argued back out |
| 11:15–12:00 | **D3 — sequencing.** Put **20.6 weeks** on the board, not 9 | Talk + calendar | A date for the priced landing page |
| 12:00–13:00 | Lunch. **No decisions.** | | |
| 13:00–14:00 | **D4 — audience.** Write the 20 names. Actual names, on paper | Whiteboard | 20 names, 20 dates, one outreach script |
| 14:00–15:00 | **D5 + D6 — the paid line and where the meter sits** | **Spreadsheet.** Re-derive every number live; do not quote §90 or §93 from memory | The pricing page, in three rows |
| 15:00–15:30 | **D7 — publish the engine?** | Talk | Yes/no + a date |
| 15:30–16:00 | Write the decisions as ADRs — the question, the choice, **what it forecloses**, superseded-by | Keyboard | `docs/adr/0002…0008` |

**Before lunch:** D1, D2, D3 — everything that re-scopes. **After lunch:** the arithmetic, which needs a spreadsheet and a calculator and no whiteboard at all. The one rule that saves the day: **when a number is disputed, nobody argues — someone runs the command.**

### 97.4 Using the record in the room

The standing rule, and it is the product's own thesis applied to its own documentation: **never open a lower tier when a higher one answers.** Tier 3 is 523,124 words; the router is 2,524. That is **207× the tokens for the same answer** [derived, §92.4].

| Question shape | Open this | Never open |
|---|---|---|
| "Where does X live?" | `AGENTS.md` + `docs/MAP.md` (Tier 0 router) | Anything else |
| "What did we decide about Y?" | `docs/FRONTMATTER-RECORD.md`, `## N.` section | The source reports |
| Engine behaviour, refusals, splice | `docs/ENGINE.md` | |
| Pricing, tiers, rails, margin | `docs/BUSINESS.md` | |
| Schedule, lanes, points | `docs/DEV-PLAN.md` | |
| "Is this claim real?" | `docs/REFERENCES.md`, then the one report | |
| Only when verifying a challenged claim | `docs/research/agent-reports-*/` | — this is the *last* resort |

Three warnings the room needs: the Tier-1 documents are **projections** — `build-tree.mjs` regenerates them from the reports, so a hand-edit is silently reverted. `MAP.md`'s own Tier-3 row says "105 files, 374,866 words" and the truth is **155 files, 523,124 words** [measured, §92.2] — the router is stale and nothing checks a count in prose. And seven superseded files sit in `docs/`, marked only by a hand-written table.

```bash
npm run refs     # 662 refs, 0 broken; reports 5/7 missing files then passes anyway
npm run record   # 104 sections — currently 4 FAILURES, the record is stale
npm run spec     # 169 of 171 module files ungoverned; 4 specs, all draft
npm run corpus   # 8,518 byte-pinned files
node docs/build/build-tree.mjs      # regenerate the four Tier-1 documents
node docs/build/assemble-tree.mjs   # regenerate FRONTMATTER-RECORD.md
```

All three read-only gates run in **0.166 s total** [measured, §92.2]. Run them at 09:00. If `npm run record` is red, rebuild before anyone quotes a number from the record.

### 97.5 The AI briefing prompt

Copy this whole block into a fresh Claude before asking it anything about frontmatter. It is self-contained.

> You are helping two founders decide what a product is. The product is a markdown editor with a simple surface and a deep engine. **The file is the only source of truth; every view is a deterministic, reversible projection that owns no state.** The engine does byte-preserving splice edits — locate the byte range, replace exactly those bytes, **refuse rather than guess** — plus cross-engine degradation certification. The ambition is larger than an editor: AI-OS features and industry automation over files the user owns.
>
> **Read in this order and stop when answered.** (1) `AGENTS.md` and `docs/MAP.md` — the router; it also lists files you must NOT open. (2) `docs/FRONTMATTER-RECORD.md` §97 — the session agenda; §97.1 is the settled list. (3) Only then the topic file: `ENGINE.md` (splice, refusals), `BUSINESS.md` (pricing, rails), `DEV-PLAN.md` (schedule), `REFERENCES.md` (claims). (4) `docs/research/agent-reports-*/` only to verify a challenged claim. Tier 3 is 523,124 words and the router is 2,524 — opening the wrong tier costs 207× the tokens and, per NoLiMa (ICML 2025) and Liu et al. (TACL, arXiv 2307.03172), you will read it *worse*, and confidently.
>
> **Settled. Do not re-litigate, do not "improve":** documents live in the user's git repo and never move; sync is git three-way merge + append-only splice journal + compare-and-swap, **never a CRDT** for document bytes; one Postgres control plane holding **zero document bytes**; **no arbitrary client-side code execution, ever**; refuse rather than guess. If you think one is wrong, say so in one line and move on — do not rebuild the argument.
>
> **Constraints that shape every answer:** two founders, India-based, selling globally. Very limited AI budget — a real constraint, not a preference. Near-zero cost at 100 users, predictable at 10,000. Every component operable by one person on call. Price anchors free / ₹299 / ₹599 per month. ₹15,000 per transaction is an RBI ceiling above which every renewal forces on-session authentication.
>
> **Evidence tags are load-bearing. Use them on every claim:** `[fetched]` = you opened the primary source, and you state the URL and the date you read it. `[measured]` = you executed something here and can show the command. `[derived]` = arithmetic, and you show the inputs and the operation. `[inference]` = reasoning from stated premises. `[SS]` = search-summary or recall only. **An `[SS]` claim may never be published as fact.** Note that `WebFetch` is refused by a security gate in this environment but `curl` is not — test it before concluding anything is unreachable: `curl -sL --compressed -A "Mozilla/5.0" "<url>" | sed -e 's/<[^>]*>//g' | tr -s "\n" | head -200`. Most vendor pricing pages are JS shells and return no price text; say so rather than filling the gap from memory.
>
> **Rules.** Re-derive every number at write time — the record contains a contradictions ledger (§32) because a previous round published a wrong cost. Never quote a figure from an earlier answer without recomputing it. If a document count, a price, or a date cannot be verified in the moment, mark it unverified or omit it. Prefer refusing to answer over guessing — that is the product's principle and it is also how you should behave. When you recommend, **choose**: give the options as a table with what it is / what it costs / what it buys / what it forecloses, name your recommendation, then state the strongest honest argument against it. Three options and no choice is half the work.
>
> **Currently open** (do not treat these as decided): file-access architecture; MVP-0 scope; whether the engine ships as a package; NFC vs NFD for Unicode key equality; the population of the target persona; and how we contact a paying user at all — there is presently **no email field and no in-app channel**, which conflicts with a stated 15-minute status obligation.

### 97.6 The parking lot

Interesting, genuinely open, and every one of them is a way to lose the afternoon.

| Question | Why it waits |
|---|---|
| Multiplayer / real-time collaboration | Presupposes D1. Under Option B it is a different product; under C it is nearly free. Cannot be answered before file access is |
| Mobile / iOS | Foreclosed by Option A and B alike [§91.2]. Revisit only if D1 lands on C |
| Team seats and enterprise pricing | §23.2 rates Work at 90.3% contribution — the best line in the model — and never addresses that the category norm is voluntary (Obsidian tells commercial users they need not pay [fetched, obsidian.md/pricing, 2026-08-30]). Needs one real team customer, not a session |
| The eval lane / plugin execution | Settled as refused. Reopening it reopens the entire security posture |
| Localisation, CJK tokenizer, diacritic folding | Real defects — CJK-only recall is 20.0% today [measured, §94] — but they are engineering, not identity. R1 |
| Which model provider to standardise on | All eight pricing pages were unreadable on 2026-08-31 [measured, §90.1]. Any answer today is `[SS]`. The architecture depends only on the 30–60× frontier:small **ratio**, which is stable |
| Notion/Obsidian importers | Acquisition tooling. Meaningless before there is something to import into |
| The second product | D7 answers the near half (publish the engine). The rest is a company question, and companies get to answer it after their first ten customers |
| A/B testing the price | §83.2: detecting a 20% lift needs 95,455 visitors per arm; three arms is **57 months** at 5,000/month [derived]. The test is impossible. Decide by interview and cohort switch |
| Design-system reconciliation | The shipped `globals.css` is sgnk-md's, not ours [measured]. A real defect, a genuine embarrassment, and not a founding decision |
