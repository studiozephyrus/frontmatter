# frontmatter
## Critique and Plan

> What I found when I stopped agreeing with us. Twenty-six research rounds, 109 reports, and a twelve-part adversarial audit against our own case. The editor is the product — that decision is yours and it is made. This is about what the editor should *do*, what it should say, and what it should cost. Anything unmarked I checked against a primary source myself. Where our own record was wrong, I have said so.

::keyfigures
4 / 12,556 — complaints about mangled formatting, the thing we planned to sell
89 — context-pack products launched on HN in 20 months. Median 2 points
₹1.09L — monthly contribution from the 2-year success case. Same as 78 hours of consulting
23.7% — of all AI complaints are slop. Growing +149%. Nobody is on it
62% — of our own load-bearing claims were wrong when someone opened a source
::

## PART I — Start here

### 1. The one-paragraph version

- **The engine is right. Everything we said about it was wrong.**
- Byte-exactness is real, rare and correct — and users do not talk about it. Four complaints in 12,556.
- Our flagship demo, per-hunk accept/reject, is already shipped by Zed. Verbatim, in their docs.
- Our wedge, generating handovers and context packs, has been launched 89 times in 20 months. Median score: 2 points.
- **What survives is the mechanism, pointed at a different problem.** The engine records byte ranges. Slop is 23.7% of complaints and growing 149% a year. Nobody can tell which parts of a document a machine wrote. We can.
- **The product is still a markdown editor.** The USP is not that it preserves your bytes. It is that it is the only editor that knows which bytes are yours.

> [!risk] The uncomfortable arithmetic, and I am not going to bury it. The two-year success case — 502 paying users, 171,200 cumulative visitors — produces **₹1,09,135/month**. That is the same money as **78 hours of consulting** at your own measured rate, billable starting Monday. Building the product is not the fastest path to that number. It is the path to owning an asset. Decide with that in front of you, not behind you.

### 2. What changed, in one table

::exhibit 1 | Every belief we tested, and what the evidence returned

| # | What we believed | Verdict | What the source actually says |
|---|---|---|---|
| 1 | Byte-exactness makes people switch | REFUTED | 4 of 12,556 HN comments · 1 of 3,749 launch comments · once in 1,000 Reddit posts (0.1%) · `line endings` in 1 of 43,656 GitHub issues · one switch in 11 years |
| 2 | Per-hunk review is our demo | REFUTED | Zed docs: *"accept or reject each individual change hunk, or the whole set"* — I opened the page myself |
| 3 | Handovers and context packs are the wedge | REFUTED | 89 launches in 20 months, median 2 points, 88 of 89 never reached 50. Four were called *Handoff* |
| 4 | Decision-flow renders are the obvious first render | REFUTED | 563 of 143,283,562 Obsidian downloads. 0.0004%. 3 plugins of 7,079. 0 of 1,600 Reddit posts |
| 5 | ₹299 is a fair price | REFUTED | Obsidian gives the editor away and charges $4 for sync alone. We priced a whole editor at $3.13 |
| 6 | The engine is the differentiator | CONFIRMED | Cursor staff, three days before I looked: destroyed carriage returns on CRLF is *"a known issue we're tracking"* |
| 7 | The correctness work is real | CONFIRMED | 8,513-file pinned corpus, byte-identical verification, 1,575 tests |
| 8 | Sync is out of scope | REFUTED | #1 loved feature, #3 hated, #1 switching trigger, 1,251 of 43,656 issues |

> [!good] Read row 6 and 7 together. The incumbents have the defect we fixed, they know it, and they have not fixed it. That is a real edge. We were just selling it with the wrong sentence.

## PART II — The critique

### 3. Product and premise

**The deepest finding, and it is structural.**

- **We have two mutually exclusive buyers and have never picked one.** Every plan in the record serves the AI-native developer. Every problem statement that survives our own filtering serves a liable non-developer — someone who gets in trouble when a document is wrong.
- Those two people want different products. One wants speed. The other wants proof.
- The record reads as one product because nobody made us choose. **Choose.**

**On the chain of reasoning.**

| Link | Holds? | Why |
|---|---|---|
| Markdown is the right substrate | YES | Files, diffs, git, and every model is trained on it |
| Byte-exact editing is the differentiator | PARTIAL | True and unfelt. It is a mechanism, not a message |
| People building software with AI are the buyer | OPEN | They are the loudest. They may not be the ones who pay |
| An editor is the right form factor | YES | Your decision, and defensible — it is where the work happens |
| A subscription is the right model | NO | The category gives the editor away and charges for services |

- **Sunk cost is the biggest bias in the room.** 2.2 million words of documentation against 25,407 lines of code — 87 words per line. That ratio is what someone does when they are uncertain and writing feels like progress.
- **"Refuse rather than guess" is an engineering aesthetic that happens to also be right.** Do not confuse the two. Users do not buy refusal. They buy the confidence it produces.

### 4. Features and usability

::exhibit 2 | The features, graded honestly

| Feature | Who uses it, how often | Verdict |
|---|---|---|
| Per-hunk accept/reject on AI edits | Every AI user, daily | SHIP — but Zed has it. Not a differentiator, a table stake |
| Provenance: which bytes the machine wrote | Everyone reviewing AI output | SHIP — nobody has this. **This is the product** |
| Vault-wide refactor with reviewable diff | Anyone with >100 notes, monthly | SHIP — 86 likes on broken-links-on-rename |
| Nested-construct live preview | Every Obsidian user, constantly | LATER — 501 likes, the most-voted bug in the category. Free wedge |
| Sync | Everyone, daily | LATER — #1 loved, and the only proven price in the category |
| Degradation certificate, live | Almost nobody | KILL — technically lovely, commercially irrelevant |
| Decision-flow renders | 0.0004% of the market | KILL — the least-wanted render measurable |
| Byte-level time travel | Nobody asked | KILL |
| Two-way renders | Nobody asked | KILL |

**Usability problems nobody has solved, including us.**

- **Diff review is work.** We treat it as a feature. A 40-hunk change is a chore, not a delight. If our review is not faster than `git add -p` — which is free — we have added a step.
- **Refusal is a "no" to a paying user.** Model the moment: the editor says it cannot address something unambiguously. What does the user do? If the answer is "edit it by hand", we removed nothing.
- **The table-stakes gap is real.** A reviewer who cannot find quick-switch stops writing the review. That gap ranks above every novel feature on this list.

### 5. Business and reachability

**Pricing is wrong on the axis, not the number.**

- Obsidian: **editor free, sync $4/user/month, publish per site.** I opened the page.
- We planned to charge for the editor. In this category that is the one thing nobody pays for.
- ₹299 is not "cheap". It is **below the credibility floor** — a whole editor for less than one competitor's single add-on reads as unserious.

::exhibit 3 | The three routes to revenue, scored

| Route | Evidence of demand | Time to revenue | Reuses the engine | Verdict |
|---|---|---|---|---|
| Services, productised | 9/10 | This month | ~10% | Highest expected value. Not an asset |
| Provenance in the editor | 9/10 | ~5 months | ~90% | **The build** |
| Sync | 9/10 | ~12 months | ~60% | The only proven price. Hard, later |

**Reachability — and this is our weakest area.**

- Every channel we have identified is **borrowed**: HN is one shot, the Obsidian plugin lives under someone else's policy, and our brand term is the substrate's generic name.
- **We own nothing.** No list, no audience, no distribution.
- The record has never answered *"what do you do on Monday morning to get the first hundred users?"* — and a channel list is not an answer.

> [!warn] Virality does not come free with a good product. The things that spread in this category are: a free tool people recommend, a visible artefact with a mark on it, and a plugin in someone else's store. We currently plan none of them.

### 6. Execution and capacity

- **The record contradicts itself on the most important number.** This plan says two founders. §53 says *"One person. This is the binding constraint on everything above."* Every calendar in the record derives from one or the other. **You must settle this.**
- **No CI**, in a product that wants to sell document CI. The other codebase has it. Porting is one day.
- **Four gates in this repo have reported green while blind.** That is not a process problem, it is a trust problem — our own tooling has lied to us.
- **The learning loop is not running**: 6,884 routing decisions in seven days, one reward label. 0.01%. It may not be described as self-improving.
- **The 41-day MVP estimate assumes full-time work.** With 54–78 hours a month of client work, real elapsed time is roughly **2.5× the estimate.**

## PART III — What to build

### 7. The product, restated

> [!good] **frontmatter is a markdown editor that knows which bytes a machine wrote.** Every AI edit is recorded as a byte range with its prompt, model and timestamp. Machine-written spans look different from yours. One keystroke reverts any of them. Nothing else in the file moves.

**Why this and not the other things.**

- It is the **only** use of the engine that answers a complaint people are actually making — slop, 23.7% and rising 149% a year.
- It cannot be copied by a regenerating editor. Cursor and Zed rewrite whole files; they cannot tell you which bytes were theirs because they do not know.
- It reuses about **90%** of what already exists.
- It is a feature of an editor, which is the form factor you have chosen.

### 8. MVP-0 — the proof · 6 weeks

**One demo:** open a document an agent has been editing. Every machine-written span is visibly marked. Hover shows the prompt and the model. One key reverts it. `git diff` shows nothing else changed.

| Ships | Why |
|---|---|
| NF-1 + NF-2 + NF-3 engine fixes | 83% of foreign vaults are refused today. Five of six user flows start with this step |
| Provenance store — byte range, prompt, model, timestamp | The product |
| Provenance rendering — machine spans marked | The demo |
| One-key revert of any span | The proof |
| CI, with a deliberate red run first | Four gates have reported green while blind |
| Quick-switch, command palette, search | Table stakes. Without them nobody finishes the review |

**Not in it:** sign-up, billing, sync, mobile, publishing, hosted AI, renders of any kind.

**Exit criterion:** ten strangers, their own repos. **Six of ten say they would keep it.** Not "like it" — keep it.

### 9. MVP-1 — the first money · +8 weeks

- **Vault-wide refactor** — rename a tag, a heading, a property key; every affected link shows as a reviewable hunk; refuse on ambiguity. This is the 86-like problem.
- **Free forever** for the editor. Charge for what the category pays for.
- **First paid line: teams.** Provenance across a shared repo, with a per-seat licence — the Obsidian commercial model, which is $50/user/year and has no enterprise features at all.
- Billing, a support channel, ToS, and a way to tell users about a breaking change. None exist today.

### 10. MVP-2 — the moat · +12 weeks

- **Sync, done provably safely.** The #1 loved feature, the #1 switching trigger, and the only price this category has ever proven. A competitor's sync duplicates sections of files; ours cannot, and that is demonstrable.
- **The free wedge**: nested-construct live preview, shipped as an Obsidian plugin. 501 likes. It is the cheapest audience we will ever buy.

## PART IV — The money

### 11. What it costs and what it pays

| Line | Number | Basis |
|---|---|---|
| Monthly nut, two people | ~₹1.09L | Kolkata cost of living + infra + tooling |
| Consulting hours to cover it | 54–78/month | At your measured ₹1,400–2,000/hour |
| Hours left for product | ~120/month | Out of ~198 |
| MVP-0 at that rate | **~10 weeks elapsed**, not 6 | 2.5× the full-time estimate |
| Two-year success case | ₹1,09,135/month | 502 paying users, 171,200 cumulative visitors |

> [!test] **Fund it with services, not a raise.** ₹4 Cr is 367 months of the nut, from a fund with a seven-year horizon. That mismatch is the argument. Four fixed-scope engagements a year at ₹3,00,000 covers everything and costs roughly one week a month.

### 12. Before you write any code

**Two weeks. ₹0. This is the highest-value fortnight available.**

| # | Test | Kill signal |
|---|---|---|
| 1 | Show 10 AI-heavy developers a mock: machine-written spans marked, one-key revert. Ask what they would pay | Fewer than 4 of 10 call it useful without prompting |
| 2 | Post the live-preview fix as an Obsidian plugin | Under 200 installs in 14 days |
| 3 | Ask 5 people who bill for documents whether "which parts did the machine write" is a real problem | Nobody has been asked for it |
| 4 | Price test: three landing pages — free, $8, $20/seat | No email captures at any price |

- If tests 1 and 3 both fail, **the provenance thesis is dead** and the answer is services plus a free plugin.
- If test 2 succeeds, you have an audience before you have a product. That has never been true before.

## PART V — What our own review disproved

### 13. Corrections to the record

::exhibit 4 | Our own review, against our own case

| # | What we believed | The correction | Effect |
|---|---|---|---|
| C1 | RCM starts after ₹20 lakh | **CGST §24(iii): no turnover floor.** Buying Claude API access is importing a service | GST registration starts at the first rupee, not at ₹20 lakh |
| C2 | IT Rules set a 50 lakh threshold | The Rules carry **no number** — "as notified by the Central Government" | The threshold is not ours to plan against |
| C3 | EU representative under GDPR Art. 27 | **DSA Art. 13** is a separate mandate with no small-enterprise exemption | Different obligation, different cost |
| C4 | Vanta/Drata charge $7,000–30,000 | **Neither publishes a price.** drata.com/pricing returns 403 | Our B2B ROI headline had no source |
| C5 | GitBook's top complaint is lost work | Of 1,190 discussions, **51.3% are feature requests** | Moat #2's only external evidence |
| C6 | frontmatter and sgnk-md are siblings | **202 of 228 files byte-identical. 0 files exist only in `md`** | They are one codebase. Park `md` |
| C7 | The corpus holds 7,959 frontmatter files | **7,969.** Counted four ways | Not definitional. Just wrong |
| C8 | Our table editor is fine | **It rewrites 3 of 4 lines and destroys 3 of 4 carriage returns** [measured here] | Dead code. Keep the measurement as a test |
| C9 | Ghost text is refused | It ships, defaulting to **off**, exactly as specified | No contradiction. An agent got this wrong; I checked |

> [!note] **62% of our load-bearing claims needed correction** when someone opened a primary source: 13 confirmed, 13 revised, 5 refuted, 3 unverifiable. Re-derive before quoting anything in the record.

### 14. The decisions only you can make

| # | Decision | Why it is first |
|---|---|---|
| 1 | **One founder or two?** | Every calendar and cost number depends on it. The record contradicts itself |
| 2 | **Which buyer** — the AI-native developer, or the person who is liable when a document is wrong? | They want different products. We have been building for both |
| 3 | **Do you accept provenance as the product**, and byte-exactness as the mechanism rather than the pitch? | It changes the demo, the copy and the price |
| 4 | Editor free, charge for teams and sync? | Inverts the revenue plan |
| 5 | The two unrotated PATs | Not a decision. An action. Today |

> [!risk] **What would make me tell you to stop.** If the two-week tests come back with fewer than 4 of 10 developers calling provenance useful, and nobody who bills for documents has ever been asked for it, then there is no product here — only an engine, a consulting business, and a free plugin that makes people happy. That is not a failure. It is a smaller, truer version of the same work, and it pays better sooner.
