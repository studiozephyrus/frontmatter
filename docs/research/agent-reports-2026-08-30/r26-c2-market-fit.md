Reconcile verified read-only earlier this session: `~/.claude` HEAD `6e390828`, unchanged; no commits or mutations from me; frontmatter HEAD `04938be` untouched.

---

**Byte-exactness is a Kano must-be — an attribute class whose own definition says presence yields neutrality and absence yields defection — and a must-be shipped free by a $0 incumbent with 16.1% developer penetration cannot be a value proposition at any price, which is why the honest Sean Ellis answer is not "under 40%" but "structurally unmeasurable, because the product is designed so nobody can be very disappointed."**

---

**The steelman, first, in full.** Agents now write into files humans are accountable for. The write path every incumbent uses is a full-file regeneration, and that path demonstrably destroys bytes it was not asked to touch — Cursor staff called doubled blank lines and destroyed carriage returns on CRLF "a known issue we're tracking" three days before this research began (`r24-v3`), Cline shipped four separate line-ending fixes in eight months with issue #13504 still open (`r25-w2`), and 75.8% of all 396 CRLF reports across seven agent repos were filed in the last eight months (`r25-w2`). arXiv 2605.14478 proves causally that context quality changes model output — stale-only retrieval produced stale references in 15/17 samples versus 0/17 with no retrieval (`r25-w5`). So: the substrate agents read and write is markdown, it is being corrupted, corruption changes what the next agent does, and one team has an engine that provably does not corrupt across 8,513 third-party files with 0 throws, re-runnable by the buyer in an afternoon. A real mechanism, a real incumbent defect, and a claim a prospect can falsify himself in five minutes. This is not a fake company.

Now take it apart.

---

**Kano classification of every major capability.** Five categories: Must-be (present → neutral, absent → defection), One-dimensional (monotone), Attractive (absent → neutral, present → delight), Indifferent, Reverse (present → dissatisfaction). Classified against counted evidence, not against how the feature feels to build.

| Capability | Kano class | The evidence that fixes the class |
|---|---|---|
| Byte-exact splice / no corruption (#40, #51, #55) | **MUST-BE** | 4 complaints in 12,556 editor comments; **0 of 355** comments in the highest-intent Obsidian-alternative thread mention corruption, byte, fidelity or round-trip (`r25-w4`); "byte-exact" = **30 comments in HN's entire all-time index** [measured, hn.algolia.com, 2026-08-31]. Nobody praises an editor for not corrupting files. They leave when it does. |
| Sync (#97–105) | **MUST-BE with a one-dimensional tail** | #1 loved, #3 hated, #1 switching trigger, 1,251 of 43,656 issues (`r24-v2`). **Not built.** Disqualification precedes delight. |
| Mobile (#150) | **MUST-BE** | "**Every** product opened has a first-class mobile story" [fetched, `r19-p5` #150]. Not built. |
| Per-hunk accept/reject (#124) | **MUST-BE, and recently so** | Zed: "You can accept or reject each individual change hunk, or the whole set of changes made by the agent" [fetched, zed.dev/docs/ai/agent-panel, 2026-08-31]. Free tier. Attractive in 2024; Kano's own drift (Attractive → One-dimensional → Must-be) has already run. |
| Nested-construct live preview | **ONE-DIMENSIONAL** | 501 likes — most-voted bug in Obsidian history — plus 96+82+50+36+33 (`r24-v2`). |
| Vault-wide refactor / rename with link rewriting (#14, #28) | **ONE-DIMENSIONAL** | 86 likes on broken-links-on-rename (`r24-v2`). The one place byte-exactness sells as a *capability* rather than a promise. |
| Import report — "here is exactly what will not survive in *your* vault" (#139, #145) | **ATTRACTIVE — the only credible one in 163 rows** | Nobody ships it; enumerates dropped constructs by count; demo, activation event and sales artifact in one file (`r19-p5`). |
| Refusal as a typed value (#41) | **REVERSE** | 323 issue-threads across 7 repos about being refused — "String to replace not found" 71, "File has been unexpectedly modified" 102, `"not unique" edit` 150 — **every one a complaint about the refusal, not a request for it** (`r25-w2`). |
| Decision card (#83), continuous certificate (#56), typed evidence tiers (#77), numeric-provenance linter (#78), machine-write regions (#91), locked sections (#107), tamper-evident export (#111), self-routing docs (#137), NF-4 key addressability (#45) | **INDIFFERENT** | Evidence column: `NONE` or `Categorical — no competitor does it`. Decision renders: 563 of 143,283,562 Obsidian downloads = 0.0004% (`r21-s6`). |

**The prediction "most features are INDIFFERENT" is refuted — and what replaces it is worse.** Counted over all 163 rows of `r19-p5` [measured by me, 2026-08-31]: **69 rows (42.3%) carry no `[measured]` or `[fetched]` demand evidence; 36 (22.1%) say literally `NONE`; 5 say `Categorical`; 3 say `Universal`.** The split is not random. Pile one of the `NONE` rows is commodity table stakes — view modes, sort controls, spellcheck, HTML export, Windows builds, roles, observability — where "no evidence" means *nobody complains about what everyone assumes*, i.e. **Must-be**. Pile two is ~17 rows that are precisely the product's distinguishing capabilities, and there "no evidence" means **Indifferent**.

> **Most features are Must-be. The *differentiators* are Indifferent.** A product whose commodity half is table stakes it hasn't built, and whose distinctive half has zero demand signal, has inverted the two piles.

*Falsifier:* a real Kano survey (functional/dysfunctional pairs) on 40 agent-CLI users. If ≥25% classify byte-exactness Attractive, I am wrong and the positioning stands.

---

**The Sean Ellis test, run as the thought experiment.** Instrument, verbatim [fetched, review.firstround.com, 2026-08-31]: *"After benchmarking nearly a hundred startups with his customer development survey, Ellis found that the magic number was 40%"*; screen on users who "used the product at least twice in the last two weeks"; ~40 respondents for directional validity.

| Step | The answer |
|---|---|
| Would 40% be very disappointed? | **The product is architected so the answer cannot be yes.** §27 ranks switching cost moat #7: *"Near zero, by design — This is the anti-moat."* §82.2: *"our file-is-the-source-of-truth stance deliberately removes lock-in… That is the right ethical choice and it raises churn."* Ellis measures the felt cost of losing the product; the architecture sets that cost to the price of reopening VS Code. |
| What do they fall back to? | Zed, free, which documents per-hunk accept/reject; or `git add -p`, which has done hunk review since 2007. Their files are untouched — that is the promise. |
| My predicted unsegmented score | **Under 10%.** Superhuman began at 22% *with* a beloved product; Slack cleared 40% at ~half a million paying users (First Round, verbatim). A product whose headline concern appears 4 times in 12,556 comments and 0 times in 355 high-intent ones does not start at 22%. |
| The steelman rescue | Superhuman's engine segments first: 22% → 33% by segmentation alone, 58% in three quarters. Segment to daily unattended-agent-on-markdown users and 40% is plausible **in that slice**. |
| Why the rescue fails | The slice is the TAM problem below. 40% of 400 people is 160 people. |

*Falsifier, dated:* by **2026-12-31**, 40 non-friend users who ran it twice in two weeks, surveyed. ≥40% very disappointed downgrades every FATAL below to SERIOUS. <20%, stop.

---

**Which segment is on fire.** Six personas (`r13-s3`), ranked by how badly they actually hurt:

| Rank | Persona | Cost of the pain today | Verdict |
|---|---|---|---|
| 1 | **P5 Ondrej, compliance-adjacent writer** | Real: a signed artifact that doesn't match its source is an audit finding | Fire exists. **Unreachable** — no SOC 2, no attorney review, 9–18 month cycle; §63.6 calls it a trap |
| 1= | **The liable services operator** (`r22-t1` — *not one of the six*) | Real and priceable: "two rounds of revisions" silently improved to "revisions until approval" is unbounded free labour | Fire exists. **Wrong substrate** — their document is `.docx`; `dealfluence/adeu` already ships this engine, MIT, as a Claude Code plugin |
| 3 | **P2 Nina, startup docs owner** | Docs/changelog/roadmap drift. Annoying, budgeted ($20–40/seat) | Warm. Needs multiplayer presence first — a second product |
| 4 | **P3 Kabir, agency lead** | Notion export = 900 files of `Untitled 3.md` | Warm. Blocked: **83% publish-refusal** from one YAML defect gates their entire job |
| 5 | **P4 Sena, AI-heavy knowledge worker** | Unreviewable agent diffs | The record's v1 target, and `r13-s3` states its own falsifier: *"the only measured instance of this persona is the founder's own machine"* |
| 6 | **P1 Devraj, solo dev** | He has `git diff`. 0 of 355 in the highest-intent thread mention his pain | Cold |

**Verdict: none of the six is burning.** Two adjacent segments are, both outside the product. Sequoia's Arc framework [fetched, sequoiacap.com/article/pmf-framework, 2026-08-31] settles the archetype: not Hair on Fire ("customers are actively wrestling with the problem") but **Hard Fact** — *"Your customers have resigned themselves to just living with the problem… The challenge to overcome is force of habit."* Hard Fact's operating requirement is market education. The education budget is ₹0 and two shipped blog posts, one defective since 2026-08-10 (`r25-w4`).

*Falsifier:* 20 outreach conversations. If ≥5 name whole-file rewrites as a real cost unprompted, P4 is a segment and this ranking is wrong.

---

**Positioning: what shelf does the buyer put this on.** "Byte-exact markdown editor" has no search volume, no G2 grid, no budget line. The buyer does not invent a category; he files you under one he has.

| Shelf the buyer reaches for | Who owns it | The number |
|---|---|---|
| **Markdown editor / notes app** | **Obsidian** | 16.1% of 30,065 SO2025 devs; editor free "without limits"; 7,092 plugins; 8 people, no investors. Free OSS floor: AppFlowy 76,040★, AFFiNE 71,976★, SiYuan 46,023★, Logseq 44,669★ |
| **AI code editor / agent surface** | **Cursor** ($20 reference price), **Zed** ($10, ships our demo free) | HN mindshare since 2025-01: `claude code` 41,222 comments, `cursor` 16,735, `zed editor` 982 (`r25-w2`) |
| **AI review of machine changes** — the only shelf where the JTBD is actually ours | **CodeRabbit $24–48/seat, Greptile $30/seat** | 4–9× our top tier, sold to teams with budgets (`r25-w3`) |
| **Docs platform** | Mintlify $450/mo, GitBook $65–249/site, ReadMe $100–150 | Not a shelf a solo founder enters |
| "Source-of-truth workspace" (§64.3's pick) | **Nobody — that is the problem** | The record concedes it: *"an unrecognised category has no search volume, no G2 grid, no budget line and no comparison page"* |

**The buyer files this under "another markdown editor" and the price on that shelf is $0.** Rs 299 = **$3.13** at ₹95.39/USD [ECB via frankfurter.app, rate date 2026-08-28] — 78% of what Obsidian charges for *sync alone*, in a category where 56 of 60 HN comments about paying Obsidian (93.3%) are about sync. And the evidence base carries **two FX rates 8.4% apart** — 95.39 in `r25-w5`/`r22-t3` versus ₹88 in `r25-w2`/`r25-w4` — silently moving every derived dollar figure. [measured] Fix that before quoting any of them.

*Falsifier:* if 25 sales conversations produce prospects who repeat the category noun back unprompted, the rename works and I am wrong.

---

**The TAM, with the arithmetic shown.** Four gates: (i) builds software with AI, (ii) keeps markdown in git in a way that creates the problem, (iii) bothered enough to switch editors, (iv) pays.

*Gates (i)–(ii), bottom-up, live-measured by me* [api.github.com, unauthenticated, 2026-08-31]:

| Quantity | Value |
|---|---|
| Public repos, `AGENTS.md in:path` | **4,649** |
| Public repos, `CLAUDE.md in:path` | **6,834** (`r25-w5` measured 6,836 yesterday — 2 repos of drift, so the count is stable) |
| Union at 15% assumed overlap | **≈ 10,800 public repos** [derived] |
| Private-repo multiplier | **Unmeasurable.** Sensitivity 3× / 5× / 10× / 20× |
| Humans per repo | 1.5 [inference — most agent-config repos are personal] |
| **Qualified population at 5×** | **81,000 humans** [derived: 10,800 × 5 × 1.5] |

*Gates (iii)–(iv):* switch-rate band 2% / 10% / 20% (the measured spontaneous-concern rate is **0.032%**, so even 2% is 62× the observed signal); pay-rate band 2.5% / 5% / 8% (developer free-to-paid median 5%, "half the non-dev rate"; Growth Unhinged median 8%; **25% of freemium products convert below 2.5%**, and a BYO-key, unmetered, no-signup, no-card free tier is structurally in that bottom band).

| Scenario | Payers | MRR at ₹599 | vs ₹20L/mo goal (3,339 payers) |
|---|---|---|---|
| Pessimistic (2% × 2.5%) | **41** | ₹24,260 / $254 | 1.2% |
| **Central (10% × 5%)** | **405** | **₹2,42,595 / $2,543** | **12.1%** |
| Optimistic (20% × 8%) | **1,296** | ₹7,76,304 / $8,138 | 38.8% |
| Generous branch (20× private multiplier, optimistic rates) | **5,184** | ₹31,05,216 / $32,553 = **$390,637 ARR** | 155% |

*Independent top-down cross-check:* 30.9% of developers use agents at work (SO2025) × 34.8% who use markdown files as a documentation tool (n=30,065) applied to a ~30M professional-developer base [SS — not fetched this session] = 3.23M; × the measured 0.032% spontaneous-concern rate = **1,032 people**; assume that rate understates felt need by 100× → 103,200; × 5% pay = **5,160 payers**. **Two independent routes land within 0.5% of each other at the generous end.** That agreement is the finding.

**How small? The plausible buyer population is 41 to 5,184 people, central estimate ~400.** Consequences, all [derived]:

- Central 405 payers × ₹383.5 contribution at ₹599 = **₹1,55,318/mo**, clearing the ₹1,08,918 survival nut (`r22-t3`) with ₹46,400 spare. **This is a real, if small, business.**
- Central 405 is **12.1%** of the ₹20L/mo target and **0.152%** of the 265,858 payers a $10M-ARR outcome needs.
- The generous branch's $390,637 ARR is **3.9% of $10M**. Not fundable, and `r22-t3` reaches that verdict by a different route.
- Retention binds twice: **only 2.7% of SaaS businesses with ARPA under $10/month** ever clear 100% NRR, top-quartile customer retention in the band is **63.1%**, and at c=4%/mo the stock asymptotes at **g/c = 804 payers** forever — *inside* my TAM band.
- Rule of 40 is not a defence: Feld's own framing is "at least $50 million in revenue" (`r25-w5`).

*Falsifier:* a measured public/private ratio for agent-config repos, or a demonstration that the qualifying population is "anyone with `.md` in a repo" (effectively all 180M+ GitHub developers — [fetched, github.blog Octoverse, 2026-08-31: "more than 180 million developers"; 1.1M public repos use an LLM SDK, 693,867 created in 12 months]) rather than "anyone with agent-context `.md`". If the wider set is real, every number rises 3–4 orders and this section collapses. I do not believe it: the wider set has no problem — `git diff` bounds their machine edits, which is why the five docs-drift Show HNs scored 1, 2, 2, 2 and 4 points (`r22-t1`).

---

**Ranked findings.**

| Sev | Finding | Quantified | What would change my mind |
|---|---|---|---|
| **FATAL** | **The differentiator is a Must-be shipped free by the category owner, so it cannot generate willingness to pay at any price.** Kite is the precedent and the record has no answer: 500,000 monthly-active developers, near-zero marketing, best technology in category, **$0** — *"Our 500k developers would not pay to use it"* | 4/12,556 · 0/355 · 30 HN comments all-time | 40 users Kano-surveyed, ≥25% classify byte-exactness Attractive |
| **FATAL** | **No segment is on fire; the two adjacent segments that are burning are unreachable (compliance) or on the wrong substrate** — `.docx`, where `dealfluence/adeu` shipped the same refuse-on-ambiguity engine MIT eight months ago, as a Claude Code plugin | 6 personas, 0 burning; adeu 149★, created 2025-12-30 | 5 of 20 agent-CLI users naming whole-file rewrites unprompted |
| **SEVERE** | **TAM ceiling is 41–5,184 buyers, central ~405. The ₹20L/mo goal needs 3,339 — 8.2× the central case** | See arithmetic | A measured private multiplier ≥20× **and** a switch rate ≥20% |
| **SEVERE** | **Price is wrong on three axes at once:** wrong *level* (₹299 = $3.13, below the $5/mo modal price and below Obsidian Sync's ₹381.56), wrong *axis* (56/60 Obsidian payment comments are about sync — unbuilt), wrong *currency* (every Indian company selling globally quotes USD; Craft serves Indian IPs ₹526.70, Superhuman ₹1,250, so ₹299 undercuts Indian WTP too) | `r25-w3` | A cohort paying ₹599/mo for 6 months at <5% churn |
| **SEVERE** | **The Sean Ellis instrument cannot pass on a product that deliberately sets switching cost to zero.** §27 rank 7 and §82.2 say so in the record's own words; §25's funnel and §82's ceilings never absorbed it | 2.7% of <$10-ARPA businesses clear 100% NRR | ≥40% very-disappointed at n≥40 |
| **SERIOUS** | **The refusal discipline is a measured REVERSE-quality attribute** — 323 issue-threads across 7 repos, all complaints about being refused, while the record markets refusal as the differentiator | 71 + 102 + 150 | A support corpus where refusal messages generate thanks, not tickets |
| **SERIOUS** | **42.3% of 163 features carry no measured or fetched demand evidence, and the differentiators cluster inside that 42.3%** | 69/163 · 36 literal `NONE` · 5 `Categorical` [measured by me] | Any one of the nine drawing unprompted demand from 3 of 20 interviews |
| **SERIOUS** | **The chosen v1 persona is the founder's own machine** — `r13-s3` says it outright | n=1 | The 20-conversation test above |
| **MINOR** | **Two FX rates in one evidence base** (95.39 vs 88.00, 8.4% apart) silently move every derived dollar figure | Fix before quoting | — |

Findings counted elsewhere and not re-litigated: Zed shipping MVP-0 (1), context-pack table stakes (5), decision renders undemanded (6), slop untouched (7), sync out of scope (8), 62% claim-correction rate (9), the learning loop (10), the 87-words-per-line ratio (11).

---

**What is genuinely good, specifically.**

1. **The engine is real and adversarially falsifiable by the buyer** — 8,513 third-party files, 7 vaults, 0 corruption, 0 throws, sha256-pinned, re-runnable via `npm run corpus`. Most founders cannot hand a sceptic a command that proves them right in five minutes.
2. **`DECIDE.md` §9 is a dated, observable kill-list** — "Fewer than 3 of 10 strangers care, Day 41"; "zero non-founder paid signups in 60 days, Day 130". Better falsification hygiene than most Series A companies practise, and the reason this critique could be written at all.
3. **`r19-p5`'s recommended cut is the best single idea in 2.2M words** — MVP = the file, the engine, and *the import report on a stranger's own vault*. The only Attractive-class candidate in 163 features; needs no new capability; demo, activation event and sales artifact in one file.
4. **`r22-t3`'s services path is arithmetically sound.** 54–78 client hours/month at ₹1,400–2,000/hr covers the whole nut, and the R0 calendar was always a one-person schedule, so the cost against the plan is zero. **This company cannot die of cash — only of time.** That reframes every FATAL above: the stake is not bankruptcy, it is a founder-year.
5. **The refuse-over-guess architecture is right even though it is commercially a reverse attribute.** An independent team converged on the identical design. Independent convergence is the strongest available evidence that a design is correct and the weakest possible evidence of a moat — and `r22-t1` says exactly that, to its credit.

---

**The one kill condition I would hold this to.** By **2026-12-31**: forty people who are not friends, family, or in the Discord, each running it on their own repository, surveyed with Ellis's exact wording. **If fewer than 40% say "very disappointed" and fewer than 5 of 40 name whole-file agent rewrites as a cost they already pay — stop the editor, keep the engine, and ship it as `adeu` shipped: a free MIT plugin inside the agent the buyer already runs, with the paid product built above it.** That is not a retreat; it is the only shape in this evidence base where our distribution is someone else's distribution, and it costs nine weeks instead of a year to find out.
