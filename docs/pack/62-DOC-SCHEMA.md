---
id: 62-DOC-SCHEMA
title: The front matter contract
mode: reference
tier: canonical
status: living
verified_against: 0af3c90
updated: 2026-09-18
owner: sagnik
covers: [doc-schema]
---

# 62. The front matter contract

Every file in this pack opens with YAML front matter. This page is the contract, and
`docs/pack/tools/validate-pack.py` enforces it.

**Why it is worth the trouble.** A validator over these keys gives, for nothing, the six things a
documentation set otherwise maintains by hand and gets wrong: the freshness table, the canonical
against superseded list, the stale-file report, the orphan-id report, the two-homes report, and a
gate that fails a build on drift. Every one of those is a list that rots the moment somebody forgets
to update it.

## The keys

Key | Required | Type | Notes
`id` | yes | string | The filename without `.md`. Inside `12-screens/` it is the screen id, `S04`.
`title` | yes | string | Sentence case. Not the filename again.
`mode` | yes | enum | `tutorial`, `how-to`, `reference` or `explanation`. One only.
`tier` | yes | enum | `canonical`, `derived`, `archive` or `superseded`.
`status` | yes | enum | From the vocabulary in `65-CONVENTIONS.md` section 6.
`updated` | yes | date | ISO, `YYYY-MM-DD`. The day the content last changed, not the day a typo was fixed.
`owner` | yes | string | A person. Never a team, never `studio`.
`verified_against` | when `tier: canonical` | string | The commit whose state the claims were checked against.
`generated_by` | when `tier: derived` | string | The exact command that rebuilds the file.
`superseded_by` | when `tier: superseded` | string | The id of the file that replaced it.
`spec` | screens only | string | The spec path this screen is governed by.
`review_by` | no | date | A weak signal, but cheap.
`for` | no | list | The audience.
`supersedes` | no | list | Ids this file replaced.
`sources` | no | list | Paths under `sources/`.
`covers` | no | list | The ids this file is the single home for, so a validator can prove every id has exactly one home.

## The four modes, and why the distinction is kept

Taken from the Diátaxis split, because mixing them is the most common way a documentation set
becomes unusable.

Mode | Answers | Written for
`tutorial` | Take me through it once | Somebody who has never done it
`how-to` | I need to do this specific thing | Somebody with a task in hand
`reference` | What exactly is it | Somebody who needs a fact, fast
`explanation` | Why is it like this | Somebody deciding whether to change it

**A file is one mode.** A reference that starts explaining belongs in two files.

## The four tiers

Tier | Meaning | Freshness
`canonical` | The single home for its facts. Hand-written and dated. | Reviewed. `verified_against` is required.
`derived` | Generated from the code. A hand edit is reverted by the next build. | Regenerated, never reviewed.
`archive` | A record of what was true then. | **Never freshness-reviewed.** Editing it destroys the record.
`superseded` | Replaced. Kept so links do not rot. | Never reviewed. Says what replaced it.

**The archive rule is the one people break.** A decision record from March is not stale because it
is old. It is a record of a decision taken in March, and a freshness review that "updates" it has
destroyed the only copy of what was believed at the time.

## What the validator checks

1. Every `.md` file under `docs/pack/` has front matter, and it parses.
2. Every required key is present, and every enum value is in its list.
3. `verified_against` is present when the tier is `canonical`.
4. `generated_by` is present when the tier is `derived`.
5. `superseded_by` is present when the tier is `superseded`, and it points at a file that exists.
6. `id` matches the filename.
7. `updated` is a real date and is not in the future.
8. **No id is covered by two files.** This is the two-homes check, and it is the one that has
   already caught a real defect: the feature ids currently live in both `PRODUCT-PLAN.md` and
   `PRODUCT-GUIDE.md`, and neither knows about the other.
9. Every `file.md:NNN` citation points at a file that exists and has at least that many lines.
10. No em dash and no en dash, anywhere.

Run it with:

```bash
python3 docs/pack/tools/validate-pack.py
```

It exits 1 on any breach and prints one line per problem.

## What it deliberately does not check

- Whether a claim is true. No validator can do that, and pretending otherwise is how a green build
  becomes a false comfort.
- Whether a `verified_against` commit is recent. That is a judgement, and it belongs to the owner.
- Prose quality. The writing gate does that, separately, and it is advisory on everything except
  dashes and model artefacts.
