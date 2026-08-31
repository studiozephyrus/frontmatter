---
updated: 2026-08-31
status: the decision layer — read this first, and only this
tier: 0
---

# DECIDE — what we are building, and what the evidence says

**This is the only document you need for the founding session.** It carries no evidence of its
own; every claim points down to the section that holds it. That rule is what keeps it short, and
it is why you can trust a number here — it was measured somewhere you can go and check.

> **How to read it.** Twenty minutes, cover to cover. The record underneath is 297,614 words and
> 125 sections; you do not need it to decide, only to verify. When a line here matters enough to
> argue about, open the section it cites and argue with that.

---

## 1. The finding that changes the plan

Seven research rounds and ninety-two agents went out to test what we already believed. **Two of
our three central beliefs came back refuted, from counted public evidence.** That is the most
valuable outcome available, and it should be read before anything else in this document.

| What we believed | What the evidence says | Where |
|---|---|---|
| People will switch for byte-exactness | **4 complaints about mangled formatting in 12,556 editor comments.** One in 3,749 launch comments. One formatting-caused switch in eleven years. `"line endings"` appears in **1 of 43,656** GitHub issues | `r24-v2` |
| Generating handovers and context packs is the wedge | **89 such products launched on Hacker News in 20 months. Median 2 points. 88 of 89 never reached 50.** Four were named *Handoff* | `r21-s1` |
| Decision-flow renders are the obvious first render | **The least-demanded render measurable anywhere** — 563 downloads of 143,283,562 in the Obsidian registry (0.0004%), 3 plugins of 7,079, 0 of 1,600 Reddit posts | `r21-s6` |

**None of this kills the product. All of it changes the pitch.**

The mechanism was never the problem. A byte-exact engine that refuses rather than guesses is still
the right architecture — three days before we looked, **Cursor's own staff described doubled blank
lines and destroyed carriage returns on CRLF files as "a known issue we're tracking"** when their
agent does a full-file rewrite (`r24-v3`). The incumbents have the defect. We do not.

What changed is that *"we don't corrupt your bytes"* is a promise nobody is asking for. It has to
be sold as the thing it enables, not as the thing it prevents.

### 1.1 And the gap nobody is working on

| | |
|---|---|
| **Slop** — verbose, generic, unmaintainable AI output | **23.7% of all complaints, growing +149% in 20 months** |
| Classified | **WORKFLOW**, not model — durable, and ours to solve |
| Currently addressed by this product | **Nothing** |

This is the fastest-growing complaint in the entire corpus and the product does not touch it (`r21-s1`).
It is also the one thing the artefacts plausibly answer: a decision record, a spec and a flow are
not valuable as documents — they are valuable as **the context that makes the next AI output
reviewable instead of slop.** That is a different product story from "we generate your handovers",
and it is the one the evidence supports.

---

## 2. The product, in one paragraph

> **frontmatter is a markdown editor for people who build software with AI.** It opens a folder of
> `.md` files — in a GitHub repo or on disk — and edits them byte-exactly, changing only the bytes
> you touched. When an agent proposes a change, you see the exact diff and accept or reject it hunk
> by hunk, and what you rejected is bit-identical afterwards.

One line for someone who will not read that one: **it turns your repo into the prompt** (§104).

**What it is not:** not Notion, not a project manager, not a chat wrapper, not an IDE. Those are
refusals, not omissions (§103).

---

## 3. What we ship

### 3.1 MVP-0 — the proof · 38 pts ≈ 41 days

**The demo is a rejection.** Point an agent at a real repository. Let it make a six-file change.
Reject one hunk. Run `git diff` and show the rejected file is byte-identical.

*It is the only demo where the absence of an event is the product* (§95.2).

| Ships | pts | Why it is in |
|---|---|---|
| **NF-3** — bare-CR fence, set-destructive | 4 | A correctness demo cannot ship on a writer with a known silent-destruction path |
| **NF-1 + NF-2** — zero-indent sequence | 6 | 83% foreign-vault refusal. A stranger's repo *is* a foreign vault |
| **CI, with one deliberate red run first** | 2 | Four gates in this repo have already reported green while blind |
| **Real byte budget**, replacing the stub | 2 | Currently a literal `echo` in a product that wants to sell document CI |
| **Seams 2 + 3** — one splice behind every write | 8 | Today one symbol from one of thirteen engine files reaches product code |
| **`land()` + per-hunk accept/reject** | 16 | The demo itself |

**Deliberately absent, and say so on the page:** no sign-up, no hosted anything, no billing, no
sync, no mobile, no kanban, no calendar, no publishing.

**Exit criterion, observable not felt:** ten people who are not friends, family or in our Discord,
each given the binary and their own repository. Six of ten run it on a real repo.

**The concession we make out loud:** for one person editing their own prose, there is no reason to
use this over a text editor and git. We should say that rather than pretend otherwise (§95.2).

### 3.2 What the new evidence adds to the roadmap

These are not in MVP-0 and they are the strongest candidates for MVP-1, because unlike
byte-exactness they are things people are complaining about **today**:

| Build | Evidence | § |
|---|---|---|
| **Vault-wide refactor** — rename a tag, a property key, a link target across the vault, with a preview diff and a refusal when a target is ambiguous | 86 likes on broken-links-on-rename. This is byte-exactness sold as a capability rather than a promise | `r24-v2` |
| **Nested-construct live preview** | **501 likes** — the single most-voted bug in Obsidian's history — plus 96 + 82 + 50 + 36 + 33 on siblings. Our OffsetMap makes it tractable | `r24-v2` |
| **Sync, reframed** as "provably safe on top of whatever you already use" | #1 loved, #3 hated, #1 switching trigger, 1,251 of 43,656 issues. Two top bugs are a competitor's sync **duplicating sections of files** | `r24-v2` |

### 3.3 What to cut from the copy, today

- **The markdown-flavour argument.** 17 of 3,749 launch comments (0.5%) mention CommonMark or GFM at all. It is an engineering constraint, not a message (`r24-v2`).
- **"Protection against lost work."** First-hand destruction is ~0.05% of comments (`r21-s1`).
- **Any roadmap item aimed at hallucination, mid-session incoherence, over-eagerness or wrong-file edits.** Measured decline of 19–67% in 20 months — the labs are fixing these (`r21-s1`).

---

## 4. The flows

Five of the six user flows begin with the same step, **and that step currently fails 83% of the
time** — it is the NF-1 zero-indent refusal (`r21-s7`). That single defect gates the product's entire
front door, which is why it sits in MVP-0 rather than in a backlog.

The handover flow, which the record was proudest of, should be **demoted from a button to an
outcome** (`r21-s7`). Nobody wants to press "generate handover". They want the next session to go well.

---

## 5. Who buys it

**The B2B finding is counter-intuitive and worth the whole section:** the closest structural
analogue to this product runs a nine-figure-logo B2B business **with zero B2B features** — the
entire enterprise offering is a $50/user/year licence (`r21-s5`).

The implication is that our B2B strategy is not SSO, SCIM and an audit trail. It is a commercial
licence and the fact that documents already live in the customer's own repository, which means data
residency and exit are solved by the architecture rather than by a roadmap.

**D2C** is the harder half: developer free-to-paid conversion is the hard half of freemium, and we
have zero paying users. That is a fact about us, not a market condition.

---

## 6. Money

**Services fund this. Not investors, not the product.** (`r22-t3`)

| | |
|---|---|
| Client hours covering the whole two-person nut | **54–78 per month** |
| A ₹4 Cr raise, expressed in that nut | **367 months of runway** |
| From a fund with a horizon of | ~7 years |

That mismatch is the argument against raising, stated in its own terms: thirty years of runway
bought with seven years of obligation.

**The contradiction you must settle before any of these numbers mean anything:** this document says
two founders. §53 says *"One person. This is the binding constraint on everything above."* Every
capacity, calendar and cost figure in the record derives from one or the other. They cannot both
hold.

---

## 7. What is already decided, and may not be reopened

| Decision | Settled by |
|---|---|
| **frontmatter *is* sgnk-md** — 202 of 228 shared source files byte-identical, 0 files exist only in `md`. One codebase; `md` is parked | Measured, `r22-t2` |
| **Nothing else in the ecosystem fuses.** HQ, CareerOS, Markex, Advox, Brand OS, INW, skills-registry, stock, trade — all NO. Most share a founder and nothing else | `r22-t2` |
| **AIOS does not ship as a product**, and §15's "yes" is deferred, not honoured | `r22-t2`, `r23-u3` |
| Sync is git merge + splice journal + compare-and-swap. **Never a CRDT** | §31.1 |
| Documents live in the user's repo and never move | §5 |
| No arbitrary client-side code execution, ever | §9.2 |

---

## 8. Open decisions, in dependency order

Ordered by what each unblocks, not by how interesting it is.

| # | Question | Why it is first | Unblocks |
|---|---|---|---|
| 1 | **One founder or two?** | Every capacity number in the record depends on it | The entire calendar |
| 2 | **Do we accept the repositioning** — mechanism not pitch, refactor not byte-purity? | MVP-0's demo assumes the old pitch | The demo, the copy, the launch |
| 3 | **Offline-first desktop, or web?** | Determines file access, the legal surface, and where AI keys live | §91, §100, §101 |
| 4 | **BYO key or platform key?** | Sets the free tier's arithmetic limit | §90, §93 |
| 5 | Does the agent get write authority? | The flagship demo and the liability posture | §14, §100 |
| 6 | Publishing in v1? | A permanent, personal, unbounded on-call obligation | §44 |
| 7 | CJK in v1? | Engine scope | §33 |
| 8 | **The two unrotated PATs** | Only you. Today. Not a decision — an action | §54 D5 |

---

## 9. What would tell us we are wrong

Each of these is observable, dated, and cheap enough to check before committing the next quarter.

| Bet | Falsified when | By |
|---|---|---|
| Byte-exactness is a felt need | Fewer than **3 of 10** strangers care, given the binary and their own repo | Day 41 |
| The 83% refusal is one bug, not a class | First patched corpus run still refuses **>10 of 7,969** | Day 10–14 |
| Our own gates can see | CI passes on a **deliberately broken** commit | Day 2 |
| Someone pays for hosted inference over a file they own | 60 days, working checkout, **zero** non-founder paid signups | Day 130 |
| Free is not too generous | Free-to-paid **under 2%** at n≥200 free users | Day 160 |
| The certificate is a standard | **90 days** after publishing the spec, **zero** third-party runs | Day 220 |

---

## 10. Things that are true about us, not about the market

Stated plainly because they will otherwise be discovered at a worse moment.

- **62% of the record's load-bearing claims needed correction when someone opened a primary source.** 13 confirmed, 13 revised, 5 refuted, 3 unverifiable (§89). Re-derive before quoting.
- **Reverse charge has no turnover floor.** CGST §24(iii) compels GST registration for anyone liable under RCM. Buying Claude API access is importing a service. Registration starts at the first rupee, not at ₹20 lakh (§89.3).
- **The learning loop is not running.** 6,884 routing decisions in seven days, one reward label — 0.01%. The instrumentation is alive; the learning is not (`r23-u1`). "Self-improving" may not be claimed.
- **We have no CI**, in a product that wants to sell document CI. `md` has it; frontmatter does not. Port it first, ~1 day (`r22-t2`).
- **Our own table editor destroys bytes** — editing one cell in a 4-line CRLF table rewrites 3 lines and destroys 3 carriage returns [measured here]. It is dead code and already slated for deletion. Delete the UI, **keep the measurement as a test**: it is a working demonstration, in our own repo, of exactly what regenerating costs.
- **The documentation outgrew the product.** 2,219,390 words of markdown against 25,407 lines of source — 87 words per line [measured]. This document exists because of that ratio.

---

## Where everything else lives

`docs/MAP.md` routes the rest. The short version:

| Question | Open |
|---|---|
| What is this, in one page | `THESIS.md` §104 |
| Every feature ever proposed, and the ones refused | `PRODUCT.md` §94 |
| Where the MVP line falls | `PRODUCT.md` §95 |
| How to attack all of it | `PRODUCT.md` §96 |
| Is this number trustworthy? | **`VERIFICATION.md` §89, always** |
| What the engine is and what is wrong with it | `ENGINE.md` §67–80 |
| The stack | `DEV-PLAN.md` |
| The raw research | `docs/research/` — open it to check a claim, never to find an answer |
