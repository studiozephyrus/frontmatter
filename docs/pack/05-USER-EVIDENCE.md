---
id: 05-USER-EVIDENCE
title: User evidence
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [user-research, pilot, evidence-ledger]
---

# 05. User evidence

**Every conversation, session and quotation from a real user of this product, dated and
attributed.**

## 1. The register

**Entries: 0. As of 2026-09-18.**

This file is empty, and that is the finding. It is not empty because the work was not written down.
It is empty because it has not happened.

**The plan says so in its own words**, at `docs/mvp0/PRODUCT-PLAN.md` section 2, under the heading "What
the research never did", with the instruction "Read this list before trusting anything above it".

**All five lines, verbatim, from that list.**

- No customer was interviewed.
- No prototype was tested with a user.
- No price was tested.
- No legal review, no accessibility audit, no security test.
- No performance measurement of the shipped editor.

Re-read them with `grep -n -A6 'What the research never did' docs/mvp0/PRODUCT-PLAN.md`.

## 2. What this file is not for

**Market evidence is not user evidence, and the two must never share a table.** There is a great
deal of the first kind and none of the second.

Kind | Where it lives | What it can support
Strangers' public words about the category | `docs/research/2026-09-18/raw/` | That a problem exists in the world
Competitors' own published pages | `06-COMPETITIVE-LANDSCAPE.md` | That a claim is or is not available to us
Third-party survey numbers | `06-COMPETITIVE-LANDSCAPE.md`, Mintlify's 2026 report | That a preference is widely held
**What a person said after using frontmatter** | **This file** | **That the product works for somebody**

**Why the separation is strict.** A quotation from a stranger on a competitor's launch thread is
about their problem, not about our solution. Reading it as approval of our design is the mistake
this file exists to prevent.

## 3. The schema every future entry follows

One row per encounter. A person may appear many times, and each encounter is its own row.

Field | Required | Notes
`id` | yes | `UE` plus three digits, never reused, never renumbered
`date` | yes | ISO date of the encounter, not of the write-up
`person` | yes | A short stable handle, never a full name and never an email address
`persona` | yes | `P1` to `P3` from `04-PERSONAS-AND-JOBS.md`, or `unclassified`
`channel` | yes | `call`, `screen share`, `message`, `survey`, `session recording` or `support ticket`
`consent` | yes | `yes` with the date consent was given, or `no`. **An entry with `no` may not be quoted**
`context` | yes | What they were doing, in one sentence
`verbatim` | when consent is `yes` | Their exact words, in quotation marks, unedited
`paraphrase` | when consent is `no` | What they meant, with no quotation marks and no invented detail
`evidence_for` | yes | The one claim it supports, named
`evidence_against` | yes | What it does **not** support. Left blank only when nothing was overclaimed
`recorded_by` | yes | A person, never a team
`artefact` | no | A path to a recording, a transcript or a screenshot, if one exists

**Three rules on top of the schema.**

- **A quotation is copied, never tidied.** Spelling, punctuation and grammar stay as the person
  typed or said them.
- **`evidence_against` is not optional politeness.** A session where one person liked Doc mode is
  not evidence that Doc mode is right, and the row must say so.
- **No personal data beyond the handle.** No full name, no email address, no employer, no location.

## 4. A worked example, clearly marked as fictional

**This row is an illustration of the schema and is not evidence of anything.** It is here so an
agent filling the first real row has a shape to copy. Delete it once `UE001` exists.

```yaml
id: UE000
date: 2026-10-01
person: obsidian-a
persona: P3
channel: screen share
consent: "yes, 2026-10-01"
context: First run, importing a 340-file vault
verbatim: "wait, it kept my dataview blocks? every other thing i tried ate those"
evidence_for: Byte-exact import is noticed, and noticed first, by a large-vault user
evidence_against: >-
  Not evidence that import is correct. One vault, one person, watched.
  The corpus gate is the correctness claim, not this.
recorded_by: sagnik
artefact: null
```

## 5. What will fill this file first

**The pilot, twenty people**, specified at `docs/mvp0/PRODUCT-PLAN.md` section 28.

Group | How many | The qualifier
Obsidian users | 10 | A vault of at least 200 files, and a post in the web-version or sync threads
Founders and product people | 5 | Have run Claude Code, Cursor or Codex on a project in the last month
Google Docs writers | 5 | Write there and share by link

**How they are recruited.** A founder's own posts and the studio's network. Each person receives a
hand-made kit for a real idea of theirs, which is what earns the hour.

**The first five minutes are scripted**, so twenty sessions compare.

1. Sign in.
2. Import a vault, or write a document.
3. Share it by link.
4. Run one AI edit, and accept or reject it.
5. Group one fetches the kit and runs the kickoff.

**The first week is open**, with three prompts on days 2, 4 and 7.

**Before the pilot, Phase 0 runs a smaller test.** Twenty blueprints made by hand for twenty people
outside the studio, watched for whether five run the kickoff and two of ten edit a kit again. That
is a gate on phase C, at `docs/mvp0/PRODUCT-PLAN.md` section 26.

## 6. The lines that read the result

These are the plan's, at `docs/mvp0/PRODUCT-PLAN.md` section 28, and they are written so two people
counting cannot disagree.

**Stop.** Any one of these three stops the next phase.

- Fewer than four of twenty active in week two.
- Fewer than two of ten kit recipients run the kickoff.
- Fewer than three of twenty name the problem the product solves, without being prompted.

**Continue.** All three justify phase C and the Pro build. Two of three justify phase C alone.

- Six of twenty active in week two.
- Three of ten run the kickoff and edit the kit again.
- One person asks how to pay before being told the price.

**The definitions those lines depend on**, at `docs/mvp0/PRODUCT-PLAN.md` section 28.

Term | What counts
An active user | Opened a document they own on two distinct days in seven
A finished blueprint | Reached Hand off with all fifteen files present and the consistency check passing
A conversion | A Razorpay mandate approved, not a click on Pro
An accepted proposal | An item accepted individually in the change queue. Accept all counts separately
A byte-exact import | The bytes compare equal after a round trip

## 7. What must be ready before the first entry

Nothing here is a research task. Each one is a small piece of work that has to exist before a
session can be recorded honestly.

Item | Why | State
A consent line, written and shown before recording | An entry with no consent may not be quoted | **Not written**
A place to keep recordings that is not a personal drive | `08-ECOSYSTEM.md` names no store for research artefacts | **Resolved (proposed 18 Sep, founder review):** a private R2 bucket of its own, on the company's account per D10, readable by the founders only, never the product bucket. Rejected: the product bucket, which would mix research recordings with user data
The five-minute script, written out | Twenty sessions only compare if they start the same way | Specified in the plan, not written as a script
The three day-prompts for days 2, 4 and 7 | Same reason | Specified, not written
A handle scheme | So a person can be followed across entries without naming them | **Resolved (proposed 18 Sep, founder review):** `U01` to `U20` in order of first session. The key from handle to person lives only beside the signed consent, never in an entry. Rejected: initials, which identify people in a small pilot

## 8. The limits of this file

**What was not assessed.** Everything about real users. That is the point of the file.

**What could not be verified.** Nothing needed verifying. The claim is an absence, and it is
sourced to the plan's own list at `docs/mvp0/PRODUCT-PLAN.md` section 2.

**What is not established.** That the pilot's twenty people can be recruited at all. The plan names
the channel as a founder's own posts and the studio's network, and no count of reachable people
exists in any document in this repository.

**What would falsify this file.** A single dated, consented entry. Add it, and the honest answer
changes from none to one.
