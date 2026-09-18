---
id: 61-DOCUMENTATION-PRACTICE
title: Documentation practice
mode: explanation
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [practice, freshness, generated, theatre]
---

# 61. Documentation practice

**What this file is.** How this pack keeps itself honest: which parts are generated and gated by a
diff, which are hand-written and dated, which are archives that must never be freshness-reviewed,
and what we are deliberately not doing because it would be theatre.

**Why it exists at all.** A documentation set with no practice rots in a known order. First the
counts go stale, then the file list, then the claims, and by the time anybody notices, the
document reads confidently and is wrong. **The practice is the thing that stops the confidence
outliving the accuracy.**

---

## 1. The three kinds of file, and the rule for each

`62-DOC-SCHEMA.md` names four tiers. Two of them are the working pair and two are endings.

Tier | Who writes it | How it stays true | Freshness review
`derived` | **A script** | Regenerated, and a diff gate fails a build if it is stale | **Never reviewed.** Regenerate instead
`canonical` | **A person** | Dated, owned, and checked against a named commit | **Reviewed**
`archive` | Nobody, any more | It was true then | **Never.** Editing it destroys the record
`superseded` | Nobody, any more | It says what replaced it | **Never**

**Counted at write time** `[O]`, across 102 files in `docs/pack/` including `12-screens/`:

```
tier: canonical  100
tier: derived      2
mode: reference   76, explanation 15, how-to 10, tutorial 1
```

**That ratio is the finding.** **100 canonical against 2 derived** means the pack is almost
entirely hand-written, and almost every claim in it has to be re-checked by a person rather than
re-run by a script. Section 5 says which of those should become derived and why the rest cannot.

---

## 2. What is generated, and what gates it

### 2.1 The two generated files today

File | Command | What it reads
`22-API-REFERENCE.md` | `node docs/pack/tools/gen-api-reference.mjs > docs/pack/22-API-REFERENCE.md` | The route handlers under `src/app/api/`
`59-CODEMAP.md` | `node docs/pack/tools/gen-codemap.mjs` | `git ls-files`, plus the first line of each file

**Both carry `generated_by` in their front matter, and the validator requires it.** A file with
`tier: derived` and no command is a file nobody can rebuild.

### 2.2 How a diff gate works, and why it is the only honest gate

`gen-codemap.mjs --check` regenerates into memory and compares. **If the bytes differ it exits 1
and names the command.** It does not repair the file, because a gate that silently fixes things
teaches nobody anything.

```
node docs/pack/tools/gen-codemap.mjs --check
# codemap up to date: <n> files
# or
# codemap is STALE. Run: node docs/pack/tools/gen-codemap.mjs
```

**The determinism requirement that makes it possible.** Everything sorted, sizes exact, and the
header's date taken from the git commit rather than from the clock. **A generator that reads the
clock cannot be diff-gated**, because every run differs.

### 2.3 What we learnt building the second one, in this session

Three things, each of which would have bitten somebody later `[O]`.

- **A generated file must pass the writing gate too.** The first codemap run blocked, because one
  research file's leading sentence contained a marketing phrase and the generator imported it
  verbatim. **The fix was to print the extracted sentence in quotation marks**, which is both
  honest (it is somebody else's sentence) and gate-safe (the gate strips short quoted spans).
- **Stale is the normal state while other people are writing.** The check went red seconds after a
  green write, because another writer added files. That is the gate working, and it means a
  derived file is regenerated **last**, after everybody else has stopped.
- **A purpose the generator guessed must look different from one it read.** The codemap prints
  `~` in front of a path-derived label for exactly that reason, and counts them in its own header.

---

## 3. What is hand-written and dated

### 3.1 The four keys that do the work

Key | What it buys
`updated` | The day the content last changed. **Not the day a typo was fixed**
`owner` | A person, never a team. An orphan file is a file nobody re-checks
`verified_against` | **The commit the claims were checked against.** This is the strongest key in the schema
`covers` | The ids this file is the single home for, so a validator can prove every id has exactly one home

**`verified_against` is what makes a hand-written claim auditable.** It converts "this was true" into
"this was true at `0af3c90`, and here is the command that would check it again".

### 3.2 The rule every judgement file follows

`65-CONVENTIONS.md` section 1: **every judgement document ends with its own limits.** What was not
assessed, what could not be verified, what is not established, and what would falsify it.

**Why that section is not optional.** A file without it reads as though everything in it was
checked. **The limits section is the difference between a document that can be trusted and one
that merely sounds confident.**

### 3.3 The tags, and what they are for

Tag | Meaning
`[Z]` | A founders' decision, given directly
`[M]` | A page was opened and the string quoted
`[R]` | Earlier research of ours
`[O]` | Measured in the session that wrote the line
`[L]` | An external constraint we do not control
`[P]` | Follows from another decision in this pack
`INFERENCE:` | A guess, marked as one
`UNVERIFIED:` | Could not be checked

**Silence dressed as fact is the only thing this vocabulary forbids.** An inference is allowed. An
unchecked claim is allowed. **Both must say so.**

---

## 4. What is an archive, and why it must never be touched

### 4.1 The archives this pack reads

Archive | What it records
`docs/research/2026-09-09/` | Nine research lenses and the briefing, plus `VERIFIED-2026-09-09.md`, which overrides them where they disagree
`docs/research/2026-09-13/` | The reset round
`docs/research/2026-09-18/` | Nine lenses, 178 findings
`docs/research/2026-09-18-llm/` | The free-model layer, abuse guardrails, router design and the pack anatomy
`verify/2026-09-17/` | The independent audit, 77 findings, and the responses
`docs/mvp0/SCREEN-CHANGES-2026-09-18.md` | The founders' screen review and the decisions handed back

### 4.2 The rule, and the reason

**An archive is never freshness-reviewed.** A research round from 9 September is not stale because
it is old. **It is a record of what was believed on 9 September**, and a review that updates it has
destroyed the only copy of that.

**The 9 September round is the case in point.** A research agent in it fabricated quotations from
VS Code's documentation while getting the underlying facts right. **The right response was to write
`VERIFIED-2026-09-09.md` beside it, naming what was refuted**, not to correct the original. The
original is now evidence about how a research round can fail, which is worth more than a tidy file.

### 4.3 What you do instead of editing one

Situation | What to do
An archive is wrong | Write a newer file that says so, and cite both
An archive is superseded | Mark the successor, and leave the archive alone
An archive contains a secret | **This is the one exception.** Rotate the credential first, erase second, and accept the hole in the record

**That last row is a genuine conflict between two rules and it is named here so nobody has to
discover it under pressure.** Retain-the-record loses to rotate-the-credential, every time.

---

## 5. What is not generated, and which of those should be

### 5.1 The honest reading of 95 against 2

**Most of this pack cannot be generated, and a few parts can and are not.**

Cannot be generated | Why
`50-ROADMAP.md`, `51-PRODUCT-PLAN.md`, `56-OPEN-DECISIONS.md` | Judgements. A script cannot decide what to build
`52-MARKET-RESEARCH.md` | Quotations from pages a person opened
`54-COMPLIANCE-AND-LEGAL.md` | Readings of law, by people who are not lawyers
`58-DESIGN-SYSTEM.md` | **Arguable.** The token table could be extracted from `gen.mjs`. The reasoning could not
`12-screens/` | Specifications for screens that do not exist

**Should be generated and is not** `INFERENCE:`, and each of these is a number that will go stale:

Candidate | What a generator would read | What it would kill
The route inventory | `src/app/**/route.ts` | Every hand-counted route in the pack
The test index in `60-TRACEABILITY.md` section 5.1 | `test/**` | A count that changed twice while this pack was being written
The module and port table in `60-TRACEABILITY.md` section 3 | `src/modules/*/application/ports.ts` | A table that is right today and drifts on the first refactor
The colour tokens in `58-DESIGN-SYSTEM.md` section 1 | The `:root` block in `gen.mjs` | A copy of forty values
The entitlement rows in `53-PRICING-AND-ENTITLEMENTS.md` section 3 | The configuration panel's stored rows, once they exist | The pack's own copy of every cap

**A harness script already exists for one of them.** `specs/harness/route-inventory.mjs` is in the
tree and nothing in this pack is generated from it.

### 5.2 The rule for deciding

**Generated beats written, dated beats undated, owned beats orphaned.**

- If a fact can be read out of the code, **generate it**.
- If it can be read out of the code but the reasoning cannot, **generate the table and write the
  reasoning beside it**, in two files rather than one.
- If it is a judgement, **write it, date it, own it, and end it with its limits**.

---

## 6. What we are choosing not to do, because it would be theatre

**Theatre is a practice that produces a green signal without producing a true one.** Each row below
is something a documentation set is normally expected to have, and each is refused with a reason.

### 6.1 Refused

Practice | Why it would be theatre here
**A coverage percentage on the documentation** | There is no denominator. Ninety per cent of what? A number that measures nothing is worse than no number, because people act on it
**A quarterly review of every file** | 97 files, two people. A review that cannot actually happen produces a review date that is a lie. **`review_by` exists in the schema and is optional for exactly this reason**
**A changelog for every file** | Git is the changelog. A hand-maintained one diverges within a month, and then the reader has two histories and no way to pick
**A documentation site with search** | The readers are agents and two founders. **Agents read markdown over the network**, and a search index is a second thing to keep true
**A style guide beyond `65-CONVENTIONS.md`** | That file is checkable and short. A longer one would be advice nobody runs
**A required review by a second person** | There is no second person. Naming one in a process document does not create one
**A documentation coverage gate in continuous integration that counts words** | Length is not truth. A gate on word count rewards padding, which is the opposite of what this pack needs
**Auto-generated prose from the code** | A generator can extract a fact. It cannot say why the fact matters, and a document full of extracted facts with no reasoning is a worse codemap

### 6.2 Kept, because each one is checkable

Practice | What it checks | The command
**Front matter validation** | Every required key, every enum, id against filename, `verified_against` on canonical, `generated_by` on derived | `python3 docs/pack/tools/validate-pack.py`
**The one-home check** | No id covered by two files | The same
**The citation check** | Every `file.md:NNN` points at a file with at least that many lines | The same
**The dash check** | No em dash and no en dash, anywhere | The same
**The writing gate** | Model artefacts, invisible unicode, attested rejects, and six promoted checks | `python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <f> --strict`
**The diff gate on derived files** | Whether a generated file is stale | `node docs/pack/tools/gen-codemap.mjs --check`

**Every one of those exits non-zero on a breach and names the file.** That is the whole test for
whether a practice is worth keeping.

### 6.3 What the validator deliberately does not check, and why that is right

- **Whether a claim is true.** No validator can, and pretending otherwise is how a green build
  becomes a false comfort.
- **Whether a `verified_against` commit is recent.** That is a judgement and it belongs to the
  owner.
- **Prose quality.** The writing gate does that, separately, and it is advisory on everything
  except dashes and model artefacts.

---

## 7. The practice, as a short list

For somebody who has to follow it rather than read about it.

1. **Before writing:** read `tools/AUTHOR-BRIEF.md`, then `65-CONVENTIONS.md`.
2. **Write one file at a time and save it before starting the next.** A previous fan-out lost
   1,087 edits by holding several files in memory.
3. **Check every citation before writing it.** `sed -n 'NNNp' <file>`, or cite the section.
4. **Cite a section rather than a line when the file is being edited by somebody else.** A line
   number into a moving file rots within the hour, and this pack learnt that the hard way
   `[O]`: `docs/mvp0/PRODUCT-PLAN.md` gained twelve lines mid-session and every line citation into
   it went wrong at once.
5. **Re-derive every number at write time**, and show the command.
6. **Run the writing gate.** It must print PASSED.
7. **Run the validator.** It must print 0 problems.
8. **Regenerate the derived files last**, after everybody else has stopped.
9. **End a judgement file with its limits.**

---

## 8. Limits of this file

**What was not assessed.**

- Whether anybody will follow this. A practice document is a hope until somebody runs the gates.
- Whether 97 files is the right size for a pack two people maintain. `INFERENCE:` it is probably
  too many to freshness-review and about right to read once, which is why section 6.1 refuses the
  quarterly review rather than promising it.
- The corpus outside `docs/pack/`. `docs/` holds 828 tracked files and this practice governs the
  pack alone.

**What could not be verified.**

- `UNVERIFIED:` whether `gen-api-reference.mjs` is deterministic and diff-gateable. It was written
  by another author in this session and this file did not run it.
- `INFERENCE:` section 5.1's list of things that should be generated is mine. Nobody has agreed to
  build any of those generators.
- The counts in section 1 were taken at one moment while other writers were still working, and
  will not match by the time anybody reads this. **Re-run the command rather than trusting the
  number.**

**What would falsify it.**

- A file in this pack going a month without anybody noticing it was wrong would show the
  hand-written tier is too large, and section 5.1's candidates should be built.
- A generated file that nobody regenerates would show the diff gate is not wired into anything
  that runs, which is currently true: **no continuous-integration job runs
  `gen-codemap.mjs --check`**.
- If the validator's 0 problems ever coincides with a document somebody finds materially wrong,
  section 6.3's honesty about what it does not check becomes the most important paragraph here.
