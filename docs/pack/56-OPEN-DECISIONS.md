---
id: 56-OPEN-DECISIONS
title: Open decisions
mode: explanation
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [decisions, options, costs, recommendations]
---

# 56. Open decisions

**What this file is.** Fifteen things deliberately not fixed, because each is a decision somebody
has to take rather than a defect somebody has to fix. Each carries its options, what each option
actually costs, and a recommendation.

**What it is not.** A backlog. A defect goes in the defect register with a severity. A decision
goes here with options.

**How to read a row.** The recommendation is the default the pack is written to. If a founder
disagrees, the answer changes and the pack changes with it. **Silence is not agreement, and a
recommendation nobody has answered is still open.**

**Ids.** `D` plus two digits, per `65-CONVENTIONS.md` section 3. Never renumbered, never reused.

---

## 1. The index

Id | Decision | Blocks | Recommendation
`D01` | **What the product is, in one sentence.** And the contradiction in our own documents about which answer we took | Build order, and 23 other decision cards | Take option **a**, the sentence the plan already carries, and mark the 23 re-opened
`D02` | The pace, and which phases sit in Later | Every calendar date | The plan's default: 0, A, B, D and H at the measured pace
`D03` | Which bytes we hold, and from which phase | The architecture of phase A | Hold them from phase A, because the projection law needs a canonical copy
`D04` | **Whether the Model Context Protocol server moves out of Later** and becomes the Max tier | The Max tier's existence | **Move it.** Ship a read-and-propose server in phase D
`D05` | The name | The domain and every published URL | Run the trademark search first, then decide. Do not decide before the search
`D06` | **Whether to reopen authorship marking**, now that Google's Open Knowledge Format defines `generated` and `verified` | A small amount of phase D | **Reopen it**, and stamp front matter on accept
`D07` | The twenty-kit gate | Phase C | Keep the gate. It is cheap and it is the only real test of the funnel
`D08` | Trial and dunning behaviour | Phase H | No trial. The free tier is the trial. Dunning as specified in `53`
`D09` | The desktop's timing, and who signs Windows | The order of phases E and F | Desktop after sync. Price a Windows certificate before phase F
`D10` | Which accounts move to the company | Phase 0 | All of them, before the first stranger
`D11` | **The free document cap against the pilot cohort.** 50 documents, and a qualifying vault is 200 files | The pilot, before it recruits anybody | Exempt an import from the cap, and count imported files separately
`D12` | **Whether a link-edit holder needs an account.** The front door forbids anonymous editing and the permission matrix grants it | Phase D | Require an account. It is the front door's rule and the matrix is wrong
`D13` | **Database views over front matter.** Table stakes in one round, deferred in the plan | Phase G | State the test. Keep the deferral, and say why in one line
`D14` | **Voice typing.** A shipped Doc mode row, and the research's clearest negative | Phase B, one contractor row | Drop it. The operating system does it free
`D15` | **The data model says Postgres and the stack decision says Firestore** | Phase A, all of it | Rewrite section 18's storage column. This is the largest unflagged inconsistency in the plan

---

## 2. The seven the configuration panel cannot absorb

`docs/mvp0/PRODUCT-PLAN.md` section 29 lists these as the founder questions that a setting cannot hold,
because each is an architecture, an order or an ownership rather than a value.

### D01. What the product is, in one sentence

**Why it is open.** Two of our own documents disagree about which answer we took, and 23 other
decision cards were closed on the strength of the answer.

- `docs/mvp0/PRODUCT-PLAN.md` section 1 carries the sentence: a markdown editor for people whose
  documents are increasingly written with, and for, AI agents. **That is option a.**
- `docs/mvp0/PRODUCT-PLAN.md` section 29 says the plan is written to **recommendation b**.
- `decisions/v2/_final.json:16` is option b: "Where you write, review and keep current the files
  your agents obey", scoped to AGENTS.md, CLAUDE.md and rules files.
- The card's own reasoning at `decisions/v2/_final.json:31` rejects option a by name: "Options a
  and d put the product on the free-editor shelf, where the price is zero."

**What it costs, either way.**

Option | What it costs
**a**, the broad editor | **23 cards re-open**, because each carries `[["K1","b"]]` in its dependency map. Three of them are live findings: the writing gate, agent write scoping, and whether instruction files are the reason the product exists
**b**, the instruction-file editor | The whole of Doc mode, the portfolio and most of sharing stop being justified by the sentence. The product narrows to a developer tool, which is the market with the review surface it already has

**Recommendation: take a, and mark the 23 re-opened.** The evidence in
`52-MARKET-RESEARCH.md` section 1.3 is that documentation is the top AI task and the review
surface is missing for people who do not use git. Option b aims at the people who do.

**It costs one sentence to settle and it is the cheapest decision in this file.**

### D02. The pace, and which phases sit in Later

**The default**, `docs/mvp0/PRODUCT-PLAN.md` section 26: phases 0, A, B, D and H at the measured pace,
with E, F and G in Later, and a contractor for D and F if the pace has not doubled by the pilot.

Option | Calendar cost, re-derived in `50-ROADMAP.md` section 5
The default, five phases | **about 60 to 79 calendar weeks**
Everything | **about 116 to 151 calendar weeks**

**What the default silently drops.** **Phase C is not in it.** So the blueprint funnel, which is
one of the two funnels and the thing Phase 0's gate exists to test, is not built.

**Recommendation: keep the default, and notice what it does to C.** Either C joins the list or
Phase 0's twenty-kit gate has nothing downstream to gate.

### D03. Which bytes we hold, and from which phase

**Why a setting cannot hold it.** It is an architecture. Holding a canonical copy changes the
data model, the backup story, the deletion story and the legal register at once.

Option | Cost
**Hold them from phase A** | R2 storage from day one. Every row in `54-COMPLIANCE-AND-LEGAL.md` section 2.2 fires immediately
**Hold nothing, project from GitHub and Drive** | No storage cost, no breach surface. **But the projection law has no canonical file to project from**, and offline, history and the change queue all need one
**Hold them from phase B** | Delays the compliance rows by four weeks and makes phase A a prototype

**Recommendation: hold them from phase A.** The product is the editor, and an editor with no
canonical copy is a client for somebody else's storage.

### D05. The name

**Why it is open.** Front Matter CMS exists at 82,819 installs, and the Indian trademark register
has not been searched because the search needs an interactive login.

**What it costs to change later.** The domain, every published URL, every screen, the Razorpay
registration and the app bundle id.

**Recommendation: run the search first.** `L09` in `54-COMPLIANCE-AND-LEGAL.md` owns it, due
31 October. **A decision before the search is a guess, and a decision after it is cheap.**

### D07. The twenty-kit gate

**What it is.** Phase 0 makes twenty blueprints by hand for twenty people outside the studio, and
phase C is justified only if five run the kickoff and two of ten edit a kit again.

Option | Cost
**Keep the gate** | Two weeks of Phase 0, and a real risk that it fails
**Drop it and build C anyway** | Four weeks of phase C plus 2 to 2.5 weeks of the idea redesign, on an untested hypothesis

**Recommendation: keep it.** It is the cheapest test in the plan and the only one that measures
the funnel rather than the feature. **And if it fails, that is the gate working.**

### D09. The desktop's timing, and who signs Windows

Option | Cost
Desktop after sync, as planned | Phase F sits behind E
Desktop before sync | The desktop has no server-side history or sharing to show, so its advantage is only the local model and the watched folder
**Windows signing** | `UNVERIFIED:` unpriced. The plan says a commercial certificate is priced before phase F, and nobody has priced it

**Recommendation: keep the order.** Price the Windows certificate in Phase 0, because an unpriced
requirement in phase F is a surprise rather than a plan.

### D10. Which accounts move to the company

**Every row is in `docs/mvp0/PRODUCT-PLAN.md` section 24.** The repository, the Vercel project, the
Cloudflare zone, the domain, Razorpay, the Apple programme, the model provider accounts and the
founders' own intellectual property agreement.

**Recommendation: all of them, before the first stranger.** `L03` and `L10` in
`54-COMPLIANCE-AND-LEGAL.md`. Holding a stranger's documents on a personal account is the row
that is hardest to explain afterwards.

---

## 3. The two the research opened

### D04. Whether the Model Context Protocol server moves out of Later

**Where it sits today.** `docs/mvp0/PRODUCT-PLAN.md` section 26 has the server and the API in the Later
column, behind eight phases.

**What the research found**, from `52-MARKET-RESEARCH.md`:

- **About 95 Obsidian plugins** exist to join an agent to a vault. Six of the top seventeen exist
  for that one purpose.
- **Our own plan's rule** at `docs/mvp0/PRODUCT-PLAN.md` section 6 says a capability that is a top
  add-on in three or more ecosystems ships built in.
- **Two products shipped in mid-2026** that are, functionally, an editor plus a server, and both
  got written about for it.
- **Agent traffic outnumbers human traffic close to two to one**, and tool calls tripled between
  February and August.

Option | Cost | What it buys
**Leave it in Later** | Nothing now | The Max tier does not exist, and the agent story is a promise
**A read-only server in phase D** | About 1 week | An agent can read the vault. No write path, so no refusal surface to get wrong
**Read and propose, in phase D** | **About 2 to 3 weeks** | Agent tokens, propose scope, staleness anchors, the multi-file reviewable change. **This is the Max tier**
**The full capability surface with a command line** | 4 weeks or more | Everything above plus the command line, which is a thin adapter over the same ports

**Recommendation: read and propose, in phase D.** Three reasons.

1. **The change queue already exists in phase D.** An agent proposal is a queue item with a
   different `source`, so most of the work is done by the thing phase D builds anyway.
2. **It is the only tier with a cost that justifies a price.** `51-PRODUCT-PLAN.md` section 4.3
   makes that argument in full.
3. **Leaving it in Later means competing on the editor alone**, against a free local editor that
   already has the agent bridge.

**What it costs that nobody has counted.** Every Max call is our compute and our egress, running
on a schedule while nobody watches. **So it needs a meter before it needs a price**, and
`55-MEASUREMENT-AND-EVENTS.md` section 6.13 specifies the events for exactly that.

### D06. Whether to reopen authorship marking

**Why it was cut.** The 6 September reading demoted it on the iA Writer comparison: the feature is
shipped and unsold. Then the 9 September round dropped the whole review-state product after Almanac
shipped read receipts and shut down.

**What changed.** Google published the **Open Knowledge Format**, and v0.2 on 2026-07-25 added
front matter trust signals: `generated`, `verified`, `sources`, `stale_after`, `status`.

**Why that is different from what was cut.**

- It is **a standard**, not our invention, so it is not a format we have to sell.
- It lives **in front matter**, which is the part of a markdown file our engine already promises
  not to mangle.
- **Writing `verified` when a person accepts a change in the queue is a small splice**, and the
  change queue is the thing that produces the signal.
- **Nobody has built the editor for it.** Google shipped the format without one.

Option | Cost | Risk
**Do nothing** | Nothing | Somebody else builds the validating editor for a Google standard
**Stamp on accept** | **About 2 days** | The stamp is wrong if the queue is bypassed
**Stamp, plus a validator in the problems panel** | About 1 week | A validator that disagrees with Google's is worse than none
**The whole bundle-authoring experience** | Large, unscoped | It is a different product

**Recommendation: stamp on accept, in phase D.** Two days, inside the phase that already builds
the queue.

**And the thing that must not happen.** This is **not** a reopening of the per-span read state.
That is on the never-build list in `51-PRODUCT-PLAN.md` section 5.1 and stays there. A front
matter key saying a human accepted this document is a different claim from a sidecar tracking who
read which span.

---

## 4. The contradictions inside our own documents

**On the count.** The brief for this pack names four contradictions. The research's own section 2
at `docs/research/2026-09-18/raw/I-internal-reconciliation.md:440` carries **five rows**, FI14 to
FI18, of which **FI17 restates FI11** from earlier in the same file. **Counting FI17 as a
restatement gives four.** All five are carried below, plus a sixth found while writing this pack.

Research id | Decision id | What disagrees
FI14 | **D01** | The plan says it is written to K1 rec b and the sentence it carries is option a
FI15 | **D11** | Free is capped at 50 documents and the pilot recruits vaults of at least 200 files
FI16 | **D13** | Database views are table stakes in one round and a thing that waits in the plan
FI17 | **D12** | The front door forbids anonymous editing and the permission matrix grants it
FI18 | **D14** | Voice typing is a shipped Doc mode row and the research's clearest negative
**New** | **D15** | The data model says Postgres and the stack decision says Firestore

### D11. The free document cap against the pilot cohort

**The three lines that cannot all be true.**

- `docs/mvp0/PRODUCT-PLAN.md` section 13 caps Free at 50 cloud documents.
- `docs/mvp0/PRODUCT-PLAN.md` section 28 qualifies a pilot participant as having a vault of **at least
  200 files**.
- `docs/mvp0/PRODUCT-PLAN.md` section 28 scripts step 2 of the first five minutes as **import a vault**.

**So half the pilot cohort hits the over-cap wall in the first five minutes.**

Option | Cost
Give pilot accounts Pro | Free, and it means the pilot never tests the free tier
**Exempt an import from the cap** | Small. The ledger counts imported files under a separate key
Count imported files at a discount | Arbitrary, and impossible to explain on S33
Raise the cap | Changes the whole free-tier cost model in `53-PRICING-AND-ENTITLEMENTS.md`

**Recommendation: exempt an import, and count imported files separately.** The cap exists to bound
our cost, and an imported vault is bytes the person already had. **Decide it before the pilot
recruits anybody**, because the first five minutes are scripted around it.

### D12. Whether a link-edit holder needs an account

- `docs/mvp0/PRODUCT-PLAN.md` section 3 reads: sign in first, no anonymous editing.
- `docs/mvp0/PRODUCT-PLAN.md` section 19 grants the link-edit role read, edit, propose, apply and
  comment.
- **Whether that link holder must hold an account is stated nowhere.**

Option | Cost
**Require an account** | One more step for an invited editor. Consistent with the front door
Allow anonymous editing on a link | Contradicts the front door, and every change queue item has an author who is nobody
Allow anonymous **proposing** but not applying | Interesting, and it makes the queue's author field meaningless

**Recommendation: require an account.** The change queue's whole value is that every change
carries an author, and an anonymous editor breaks the fourth engine invariant.

### D13. Database views over front matter

- `docs/research/2026-09-09/BRIEFING.md:87` lists them under **what is now table stakes**.
- `docs/mvp0/PRODUCT-PLAN.md` section 8 disposes of them in one line: they have no open renderer.

**The two statements use different tests.** The briefing asks what a competitor shipped. The plan
asks whether a renderer can be borrowed. **Both are reasonable and neither cites the other**, so
a reader cannot tell whether the plan considered the briefing or never saw it.

**And the plan builds kanban and chart blocks itself**, for exactly the reason it uses to defer
this one.

**Recommendation: state the test in one line and keep the deferral.** This is not a build
decision. It is a one-sentence decision about which test governs, and without it the deferral
reads as an oversight.

### D14. Voice typing

- `docs/mvp0/PRODUCT-PLAN.md` section 7 classifies it as lossless and therefore in scope.
- `docs/mvp0/PRODUCT-PLAN.md` section 7 calls that table the specification a contractor builds from.
- `docs/research/2026-09-09/BRIEFING.md:84` records the reason not to: Apple gave every app
  on-device speech-to-text at the operating-system layer.

**The plan is probably right in substance and the table says build.** A contractor handed section
7 reads that row as work.

**Recommendation: drop it, and annotate the row.** A browser dictating into a text field is the
operating system's job. **Leave the row in place with a note, because the table is a
specification and a silently deleted row is worse than a marked one.**

### D15. The data model says Postgres and the stack decision says Firestore

**Found while writing this pack** `[O]`, not in any research round.

- `docs/mvp0/PRODUCT-PLAN.md` section 15 states the decision: R2 for bytes, **Firestore for records**.
- `docs/mvp0/PRODUCT-PLAN.md` section 18, the data model, says **"Postgres rows"** in twelve places.

Counted at write time:

```
grep -c "Postgres" docs/mvp0/PRODUCT-PLAN.md  ->  12
```

**Why this is the most expensive row in this file.** Section 18 is the specification a builder
reads to create the schema, and **Firestore is not Postgres in any respect that matters here**. A
Firestore document caps at 1 MiB. There are no joins. A ledger is a collection to sum, not a table
to aggregate. The plan itself says so at `docs/mvp0/PRODUCT-PLAN.md` section 15, in the constraints it
carries from the decision, and then the data model two sections later ignores it.

Option | Cost
**Rewrite section 18's storage column to Firestore collections** | Half a day of writing. It is the only correct option
Leave it | A builder creates a Postgres schema that cannot be built on the chosen stack
Reopen the stack decision | Reverses a founders' decision of 17 September on a documentation defect

**Recommendation: rewrite section 18.** This is a defect in a document rather than a decision, and
it is listed here only because it is the kind of thing that survives unnoticed until somebody
builds from it.

---

## 5. The one this pack opened

### D08. Trial and dunning behaviour

**Why it is open.** `53-PRICING-AND-ENTITLEMENTS.md` section 5 specifies a dunning ladder and
states plainly that every number in it is proposed rather than decided. **There is no trial
anywhere in the plan.**

**The constraint that shapes both** `[L]`: an Indian card gets **one payment attempt**, so there
is no retry ladder to design. Dunning is a person asking a person to pay again.

Option | Cost
**No trial. The free tier is the trial** | Nothing. It is what the product already is
A 14-day Pro trial with a card | The card is charged once at the end, and a failure has no retry. **A failed trial conversion is final**
A 14-day Pro trial with no card | A conversion step at the end, with no card on file, which is a worse moment than a cap

**Recommendation: no trial.** The free tier is a whole editor with quantities capped, and the
upgrade moment is a cap rather than a clock. **A cap is a better moment than a deadline, because
the person is in the middle of doing something they want to finish.**

**On dunning: adopt the ladder in `53` section 5.2 as written**, and treat its day numbers as the
decision. They are 0, 3, 7 and 14, and nothing about them is load-bearing except that the last one
is far enough out that a person on holiday does not lose Pro.

---

## 6. What happens when one of these is answered

1. **Answer it in one line**, in this file, changing `status` in the index from open to decided.
2. **Never delete the row.** Supersede it, per `65-CONVENTIONS.md` section 1.
3. **Name every file the answer changes.** D01 changes `51-PRODUCT-PLAN.md`. D04 changes
   `50-ROADMAP.md` and `53-PRICING-AND-ENTITLEMENTS.md`. D15 changes a document outside this pack.
4. **If the answer re-opens other decisions, say which.** D01 re-opens 23 cards in `decisions/v2`
   and that is the point of the rule.

---

## 7. Limits of this file

**What was not assessed.**

- The eleven founder questions the configuration panel absorbed. They are rows with defaults now,
  in `53-PRICING-AND-ENTITLEMENTS.md` and in the panel, and they still need answers before the
  pilot meets a stranger.
- The three the founders deferred on purpose: the tagline, the positioning and the product-market
  read. None blocks a phase, and none is a decision this pack should take.
- The costs in every option table. They are appetites of the same kind as `50-ROADMAP.md`, not
  estimates, and none has been costed against the code.

**What could not be verified.**

- `UNVERIFIED:` the Windows certificate price in D09.
- `UNVERIFIED:` whether the 23 cards D01 re-opens are still the right 23. The list comes from
  `decisions/v2/_final.json` and was not re-read for this file.
- `INFERENCE:` every recommendation here is mine unless it repeats a founders' default. Where the
  plan already carries a default, the recommendation says so.

**What would falsify it.**

- A founder answering D01 as **b** would make most of `51-PRODUCT-PLAN.md` wrong rather than
  incomplete, and would re-open 23 cards.
- The twenty-kit gate failing would remove D04's best argument, because the agent story and the
  blueprint funnel are the same bet seen from two ends.
- A pilot participant hitting a cap this file did not anticipate would say D11's recommendation
  fixed the wrong wall.
