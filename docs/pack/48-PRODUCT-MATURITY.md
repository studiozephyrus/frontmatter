---
id: 48-PRODUCT-MATURITY
title: Product maturity
mode: explanation
tier: canonical
status: living
verified_against: f237ece
updated: 2026-09-18
owner: sagnik
covers: [maturity-scores]
---

# 48. Product maturity

Seventeen dimensions, scored against what a product that holds somebody's documents and charges money
for it would need. Each score carries its evidence and the one change that would raise it.

**The bar is deliberately the hard one.** Not "is this good for a two-person studio before a pilot",
which would be a kind question and a useless document. The question is: **if a stranger paid for this
tomorrow and it lost their work, would anybody be able to say what happened?**

**Most scores are low. That is the correct result**, and a maturity file that flattered would be worth
nothing. The product is a specification with a working editor under it, which is a reasonable place to
be four weeks before a pilot.

## 1. The scale

Score | Meaning
**0** | Does not exist, and is not specified
**1** | **Specified. No working code**, or code that cannot be reached
**2** | Code exists and works for the person who wrote it. Single-tenant, or reachable only by hand
**3** | Works for somebody who did not build it, on a good day. No gate holds it
**4** | Works for a stranger, and a gate fails when it stops working
**5** | Works for a stranger who is paying. Measured, alerted, and recoverable when it fails

**The step from 3 to 4 is the expensive one**, and it is always the same step: something has to fail
automatically when the thing breaks. Nine of the seventeen dimensions below sit at 1 or 2 for want of
that, and `44-TECH-DEBT-REGISTER.md` `TD-023` records that **there is no continuous integration at
all**, so nothing in this repository can currently reach 4 by definition.

## 2. The scores

Dimension | Score | The one-line reason
`M01` Byte-fidelity engine | **2** | It works and it refuses about 83 percent of foreign frontmatter files
`M02` Accounts and tenancy | **1** | The allowlist permits exactly one login
`M03` The change queue | **1** | Specified in the plan, three greps find no code
`M04` AI governance | **1** | Two forbidden providers in the chain, no delimiter, no budget, no log
`M05` Security | **1** | Two reachable critical findings, six of eight named controls absent
`M06` Observability | **1** | One console call on a request error, and nothing else at all
`M07` Reliability and recovery | **1** | No availability measurement, no runbook, no restore ever tested
`M08` Billing | **1** | No payment code of any kind
`M09` Testing and verification | **3** | Genuinely good craft, held by nobody, because no gate runs on a push
`M10` Accessibility | **2** | Five contrast failures shipping, and three conformance features absent everywhere
`M11` Performance | **1** | One of fourteen budgets enforced, inside a module nothing calls
`M12` Data model and persistence | **1** | The plan gives two answers and the code gives a third
`M13` Documentation | **4** | The strongest dimension, and the only one above 3
`M14` Legal and compliance | **2** | A dated list with owners, and nothing built yet
`M15` Support and operations | **1** | No runbook. Nothing reports an error, and nothing tells a person we are down
`M16` Portability, import and export | **3** | Export works and is tested. Import is unproven at scale
`M17` The specification and screens | **3** | 38 screens with real substance, and five mechanical defects in them
`M18` The desktop build | **not scored** | `src-tauri/` was not opened. See section 5

**Seventeen scored. Mean 1.7.** The mean is in this file only so nobody computes a different one, and
it should not be used. Section 4 explains why the distribution matters and the average does not.

## 3. The dimensions

### M01 byte-fidelity engine, score 2

**Evidence for.** `src/modules/share/domain/splice-frontmatter.ts` exists and works. The 8,513-file
pinned corpus verifies clean, `changed 0`, in this session. Two red proofs are armed and the suite
reports exactly six expected failures.

**Evidence against.** `specs/engine/nf-001-zero-indent-sequence.md` records a measured blast radius:
**6,613 of 6,614 foreign refusals, about 83 percent of the 7,969 frontmatter-bearing files in the
corpus.** A key at column zero, which is what a common YAML library emits by default, makes the writer
refuse the whole file. Both known defects are unfixed, and two more are named in the specs with no
spec of their own, per `44-TECH-DEBT-REGISTER.md` `TD-012`.

**Why 2 and not 3.** Refusing is the correct behaviour when a range is ambiguous, and this range is
not ambiguous. A writer that declines four documents in five is not one a stranger can rely on.

**To reach 3.** Fix NF-1, and re-measure rather than assuming the estimate. To reach 4, the corpus gate
has to run on a push.

### M02 accounts and tenancy, score 1

**Evidence.** `src/modules/auth/domain/allowlist.ts` compares one login against one configured value.
`src/config/env.ts` defaults that value to a single name. The vault is one repository from one
environment variable. No route checks ownership. The Firebase sign-in path is composed in
`src/container/client-container.ts` and **nothing calls it**.

**Why 1 and not 2.** The code works for one person, which would be a 2, but multi-tenancy is not a
feature that gets added later. Every route, the storage layout and the commit author all assume one
account, so the shipped code is a single-tenant application, not an early multi-tenant one.

**To reach 2.** A second account signing in and seeing only its own documents.

### M03 the change queue, score 1

**Evidence.** `AUTHOR-BRIEF.md` calls it one of three load-bearing ideas.
`docs/mvp0/PRODUCT-PLAN.md` section 14 lists it as a shipping control. `grep -rni
"change.queue\|changeQueue" src/` returns **nothing**. S20 specifies the screen in full detail, down to
the copy.

**Why this one is worth its own row.** It is the product's differentiation and its main security
control at the same time, per `43-THREAT-MODEL.md` section 4. A 1 here caps `M05` and `M04`.

**To reach 2.** Any working implementation, even one that only handles a person's own edits.

### M04 AI governance, score 1

**Evidence.** From `42-SECURITY-REVIEW.md`: two providers the plan forbids are in the chain and one
leads the ordering; five prompt sites concatenate document text with no delimiter; there is no
per-account budget. There is no breaker, and no model call is logged anywhere.

**One thing is right**, and it is worth naming because it is the only one: ghost text is off by
default, at `src/modules/editor/presentation/editor-settings.ts:41`.

**To reach 2.** The delimiter and the provider allowlist. Both are small. To reach 3, the budget.

### M05 security, score 1

**Evidence.** `42-SECURITY-REVIEW.md` records four critical findings. Two of them, the path traversal
through the version and merge readers, are reachable today by anybody holding a session. Six of the
plan's eight named controls have no code at all.

**The mitigating fact, stated because it is real.** One login exists, so the population of people who
can reach the critical findings is one. **That is not a control**, it is an accident of scale, and it
ends the day `M02` moves.

**To reach 2.** The traversal fix and the enforced content policy. Both are small, and both are
specified in `42-SECURITY-REVIEW.md` sections 3a and 3.

### M06 observability, score 1

**Evidence.** `src/instrumentation.ts` registers an empty `register()` and an `onRequestError` that
calls `console.error` with a structured object. Its own comments say it is the place a reporter would
go once an environment variable is set. Nothing else exists: no model-call log, no metric, no trace, no error reporter and no dashboard.

**Why it is not 0.** The hook exists and the error path is structured, which is most of the work.

**Why 1 and not 2.** A console call in a serverless function is a log nobody reads. The plan commits
to an append-only store in Indian jurisdiction, kept 180 days.

**To reach 3, and this is the highest-value move in the file.** One request record with a correlation
id, written before the work and completed after. `47-PERFORMANCE-BUDGET.md` section 8 and
`42-SECURITY-REVIEW.md` `SEC-006` both name the same missing mechanism. **One build closes three
dimensions.**

### M07 reliability and recovery, score 1

**Evidence.** The plan's target is 99.5 percent a month. Nothing measures it.

**What exists.** Documents live in a GitHub repository, which gives version history for free, and
`test/vault/get-history.test.ts` covers reading it. Drafts are kept in browser storage. That is a real
recovery story for the document bytes.

**What does not.** No backup of anything else, because there is nothing else yet. No restore has been
attempted. No incident runbook, and the plan's legal section has one due 15 October. No status page.

**A known constraint worth carrying forward**, from `CLAUDE.md`: the intended object store has **no
object versioning**, so recovery has to be built into the key layout rather than assumed. Today that
is a future problem; it should not become a surprise.

**To reach 2.** Restore something from a backup, once, then write down how long it took.

### M08 billing, score 1

**Evidence.** `grep -rni "razorpay\|stripe\|billing" src/` matches only a reserved-slug list.
`firestore.rules` describes a billing collection that no code writes. The plan sets the pricing out in detail, with the tax position beside it and the payment
constraints that follow from the card rules.

**To reach 2.** One test transaction end to end.

### M09 testing and verification, score 3

**The strongest engineering dimension, and it still is not 4.**

**Evidence for.** 100 test files, 1,598 passing tests and 6 armed expected failures. A byte-pinned
8,513-file corpus with an upstream commit and a hash per file. Two red proofs written before their
fixes, each explaining why a passing suite would not have proved anything. A spec harness. An
architecture report. The discipline in `40-TESTING-STRATEGY.md` section 1 is better than most
production teams manage.

**Evidence against.** **No continuous integration**, so none of it runs unless somebody remembers.
No coverage tool. Seven test files a spec names do not exist. Ten tests mock a barrel against a
written rule. The corpus is not inside `npm run verify`.

**To reach 4.** One workflow file. That is genuinely the whole gap, and it is the cheapest score
increase available anywhere in this document.

### M10 accessibility, score 2

**Evidence for.** The application uses 49 `aria-label` attributes, 13 distinct roles, modal dialogues,
a live region and a slider with its three value attributes. A contrast assertion exists and throws.
The plan names both WCAG 2.2 AA and the Indian standard, and dates the legal question.

**Evidence against.** `46-ACCESSIBILITY-SPEC.md` section 3.4: five shipped tokens fail their
threshold, including `--muted` at 2.64 to 1 and the light-mode focus indicator at 2.14 to 1. The
contrast gate checks a palette the application does not ship. Three conformance features appear nowhere in the repository: a reduced-motion
query, a high-contrast query, and any response to a browser's own text-size setting. The focus indicator removes the outline it
needs under high contrast. The 76-screen specification contains zero semantic controls.

**To reach 3.** Fix the five tokens and make the check read them rather than restate them.

### M11 performance, score 1

**Evidence.** `47-PERFORMANCE-BUDGET.md` section 2: fourteen budgets, one enforced, and the enforced
one lives in a module nothing calls. `npm run budget` is an echo that always exits 0. No profile, no
field data, no synthetic run.

**To reach 2.** Make `npm run budget` measure something. Section 4 of that file specifies it.

### M12 data model and persistence, score 1

**Evidence.** `44-TECH-DEBT-REGISTER.md` `TD-005`: the plan says Firestore 22 times and Postgres 12
times, and the code uses neither. Records are markdown files in a GitHub repository. `firestore.rules`
governs collections nothing writes.

**Why this is a maturity question and not a documentation one.** Three answers means no answer.
Everything downstream, migrations, backup, query budgets, per-tenant isolation, waits on it.

**To reach 2.** A decision, written once, with the plan corrected to match.

### M13 documentation, score 4

**The only dimension above 3, and it is above 3 by a distance.**

**Evidence.** A plan of record with numbered sections and evidence tags. A 38-screen sheet generated
from it. Four engine and render specs with invariants, refusal messages and named executable checks.
A corpus with pinned commits and hashes. `AGENTS.md` and `CLAUDE.md` with operational rules that are
already true. A document schema with a validator. A conventions file. This pack.

**Why not 5.** Three reasons, all of them in this pack.
`44-TECH-DEBT-REGISTER.md` `TD-004` found a documented defect that was already fixed.
`TD-005` found the plan contradicting itself. And `46-ACCESSIBILITY-SPEC.md` section 3.5 found the
plan claiming a contrast property the shipped code does not have. **Documentation that drifts from the
code is the failure mode of good documentation**, and all three instances are of that kind.

**To reach 5.** Make the validator run on a push, and make the derived documents actually derived.

### M14 legal and compliance, score 2

**Evidence for.** The plan's legal section is a dated table with an owner per row, the statutory
instruments opened and quoted with their gazette references, and the unverified rows marked. That is
better than most products at this stage manage, and considerably better than most do at launch.

**Evidence against.** Nothing is built. The four public routes serve placeholders. No grievance
officer is named on any page. No breach contact is filed. The earliest deadline is 15 October 2026.

**To reach 3.** The four public pages carrying real text.

### M15 support and operations, score 1

**Evidence.** No runbook. No error reporter wired, though the hook is there. No status page. No
support inbox in the code. `docs/mvp0/PRODUCT-PLAN.md` section 23 requires a named grievance officer
with an acknowledgement clock before the first stranger.

**To reach 2.** One page that says how to reach a human, and one document that says what to do when
the product is down.

### M16 portability, import and export, score 3

**Evidence for.** `/api/export/vault` produces an archive and `test/vault/export-vault-zip.test.ts`
covers it. `/api/export/pdf` exists, with four test files behind the export module. `ImportModal` is
wired into the workspace. The product's whole position is that the file on disk is the truth, which is
the strongest possible portability story, and it is true rather than claimed.

**Evidence against.** The plan's import budget is 2,000 files under two minutes, byte-exact, and
`47-PERFORMANCE-BUDGET.md` `PB-08` records that only the byte-exact half has a measure. Import from
the four named sources was not exercised. A round trip out and back in was not tested.

**To reach 4.** A test that exports a vault, imports it into an empty one and then asserts that
every byte came back.

### M17 the specification and screens, score 3

**Evidence for.** 38 screens, both widths, generated from tokens, with copy written rather than
placeholder, real empty and error states, and a contrast assertion at generation time. A founders'
review applied. This is a serious specification.

**Evidence against.** `45-UX-AUDIT.md` finds five high-severity mechanical defects in what it
produced, The worst is on the front door, where the primary sign-in control's mark renders as a
single blue wedge. The review screen truncates the diff a person is asked to accept, and the over-cap
dialogue dims only the editor column. The renderer asserts only that a file exists and
ends correctly, so **a completely blank screen would pass**.

**To reach 4.** Any check that looks at the pixels.

## 4. How to read the distribution, and not the mean

Score | Dimensions | Count
4 | `M13` | 1
3 | `M09`, `M16`, `M17` | 3
2 | `M01`, `M10`, `M14` | 3
1 | `M02` to `M08`, `M11`, `M12`, `M15` | 10

**The mean of 1.7 is not useful and should not be quoted.** Three reasons.

- **A product is bounded by its lowest relevant dimension, not by its average.** Documentation at 4
  does not compensate for security at 1 in any way that a paying customer would recognise.
- **The dimensions are not independent.** `M05` cannot rise far above `M03`, because the change queue
  is a security control. `M04` cannot rise above `M06`, because a budget you cannot measure is not a
  budget. Averaging correlated scores overstates the total.
- **An average invites the wrong move**, which is raising the cheapest dimension to lift the number.

**The binding constraint, stated plainly.** It is `M02`, accounts. Nine of the ten dimensions at 1 are
things that only need to exist once there is a second person, and several of them are only urgent
because of that. **The order of work is therefore not the order of the scores.**

## 5. What was not scored, and why

`M18`, the desktop build. `src-tauri/` was not opened in the session that wrote this pack, so there is
no evidence to score. It is listed rather than omitted, because a dimension nobody looked at should be
visible as such and not absent.

**Four more that arguably deserve a dimension and did not get one.**

- **The supply chain.** 47 runtime dependencies, no audit run. A real dimension with no evidence.
- **The model economics as an operational capability.** The plan costs it carefully and nothing meters
  it. It sits inside `M04` here and could be its own row.
- **Team resilience.** A two-person studio where one person owns most rows in the legal table. That is
  a maturity question, and this pack has no evidence about people.
- **The decisions site.** It has its own deployment and its own tooling, and it was out of scope
  for this pack.

## 6. Re-scoring procedure

**Re-score when one of these happens, not on a calendar.**

- A dimension's evidence changes, which usually means a commit.
- A new dimension is added, which means the register is renumbered upward and never renumbered inside.
- Three months pass with no re-score, which is itself a finding.

**The procedure, and the whole point is that it is the same every time.**

1. **Re-derive every number before reading the old score.** Every count in section 3 comes from a
   command in `40-TESTING-STRATEGY.md`, `42-SECURITY-REVIEW.md`, `44-TECH-DEBT-REGISTER.md`,
   `46-ACCESSIBILITY-SPEC.md` or `47-PERFORMANCE-BUDGET.md`. Run them first. A score defended from
   memory is a score nobody can check.
2. **Score each dimension independently, without looking at its previous value.** Then compare. A
   score that moved without a commit behind it is a scoring error, not progress.
3. **A dimension may only reach 4 with a named gate**, and the gate must be one that runs without a
   person. Write the gate's command in the row.
4. **A dimension may only reach 5 with a named measurement and a named alert.** Write both.
5. **Never round up for effort.** Work in progress is the score it was before.
6. **Record every change in one line**: the dimension, the old score, the new score, the commit, and
   the evidence. Append only.
7. **If the average rose while no dimension at 1 moved, stop.** That is the failure mode this section
   exists to catch.

**One rule that overrides the six above.** If a dimension cannot be scored because nobody looked, it
is **not scored**, like `M18`. It does not get a 0, because 0 means something specific and a guess
dressed as a zero is worse than a gap.

## 7. Limits of this file

**What was not assessed.**

- **The desktop build**, `M18`.
- **The supply chain**, and the three other candidate dimensions in section 5.
- **Anything about people, process or operations beyond what is in the repository.** Response times, who is on call, who holds which account, and what happens when one of two
  people is unavailable. `docs/mvp0/PRODUCT-PLAN.md` section 24 covers ownership and it was
  read as a list, not audited.
- **The deployed application.** Every score is from the code and the documents. Nothing was fetched and no page was driven.
  No deployment was inspected. A score can therefore be wrong in either direction.
- **Any comparison with another product.** These scores are absolute against a stated bar. They do not
  say whether this product is ahead of or behind anybody.

**What could not be verified.**

- **`M07` and `M15` rest partly on absence**, and absence is the hardest thing to prove. Each rests on
  a grep and a directory listing, both stated so they can be re-run.
- **`M16`'s import half.** `ImportModal` exists and is wired. Whether an import of 2,000 files works
  was not tested and cannot be from the code.
- **Every score's boundary.** The difference between a 1 and a 2 is a judgement, and a second reader
  would move two or three of these by one. The evidence is given so that the argument can be about the
  evidence rather than about the number.

**What would falsify this file.**

- A workflow file appearing, which moves `M09` towards 4 and unblocks the 3-to-4 step everywhere.
- A second account signing in, which moves `M02` and makes several 1s urgent rather than theoretical.
- The traversal fix landing, which moves `M05`.
- Any count in section 3 coming back different when re-run, which means the file has drifted and
  every score should be re-derived rather than adjusted.
- A reader scoring the same evidence differently and being able to say why. **That is the outcome this
  file is built for**, and a disagreement with the evidence attached is more useful than agreement
  without it.
