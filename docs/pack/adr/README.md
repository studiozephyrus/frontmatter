---
id: README
title: Architecture decision records
mode: reference
tier: canonical
status: living
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [adr-index]
---

# Architecture decision records

**What this folder is.** One file per settled decision: what was decided, why, what was rejected, and
what would reverse it. Written so a builder on any tool can see the decision without asking anybody.

**What it is not.** The open decisions live in `56-OPEN-DECISIONS.md`, with their options and costs.
When one of those is answered, it gets a record here.

**Ids.** `ADR-` plus four digits, per `65-CONVENTIONS.md` section 3. Never renumbered and never
reused. A reversed decision keeps its file, its status becomes `reversed`, and it names the record
that replaced it.

**A note on the `id` key.** Each file's front matter `id` is its filename, such as
`ADR-0001-compiler-not-format`, because `docs/pack/tools/validate-pack.py` requires the id to match
the filename.

The bare `ADR-NNNN` id sits in the `covers` key, so the validator can prove each has
exactly one home. This index is `README` for the same reason, and covers `adr-index`.

## The records

ADR | Decision in one line | Source of the decision
[ADR-0001](ADR-0001-compiler-not-format.md) | Build a compiler and an IDE over plain markdown, never a new format | MDZ research, 29 July 2026
[ADR-0002](ADR-0002-render-carrier.md) | A `> [!kind]` callout carries prose, a fenced block carries opaque data | PRD v2 section 8.2
[ADR-0003](ADR-0003-sync-without-crdt.md) | Sync is git-merge plus a splice journal plus compare-and-swap, never a CRDT. The rebuttal to Zed Delta is owed | PRD v2 section 31
[ADR-0004](ADR-0004-r2-recovery-in-key-layout.md) | R2 has no object versioning, so a key is never overwritten and recovery lives in the key layout | PRD v2 section 32.1
[ADR-0005](ADR-0005-inr-mandate-ceiling.md) | ₹15,000 a charge is an architectural constant, and an Indian card gets one attempt | PRD v2 sections 24.4 and 45
[ADR-0006](ADR-0006-projection-law-and-splice-only.md) | The file is the only truth, writes splice exact byte ranges, and the engine refuses rather than guess | `specs/engine/splice-writer.md`
[ADR-0007](ADR-0007-stack.md) | Next.js on Vercel, R2 for bytes, Firestore for records, Firebase Auth, Durable Objects for live sessions | Founders, 17 September 2026
[ADR-0008](ADR-0008-change-queue-replaces-review-state.md) | Every change enters a queue the owner accepts or rejects one by one, and review state is dropped | Founders, 17 September 2026
[ADR-0009](ADR-0009-sign-in-first-no-captcha-no-tour.md) | Sign in first with Google or GitHub in one tap, with no captcha and no tour | Plan section 3
[ADR-0010](ADR-0010-broad-editor-internal-name-fmd.md) | The product is the broad markdown editor for the agentic era, called `fmd` internally, tagline untested | D01, 18 September 2026
[ADR-0011](ADR-0011-everything-in-batches.md) | Build every phase, in twelve batches run in sequence, each used internally before the next | D02, 18 September 2026
[ADR-0012](ADR-0012-canonical-copy-with-mirror.md) | Our R2 and Firestore copy is canonical, and the person's GitHub or Drive holds a full mirror | D03, 18 September 2026
[ADR-0013](ADR-0013-accounts-to-the-company.md) | Every account moves to the company before the first stranger's document is stored | D10, 18 September 2026
[ADR-0014](ADR-0014-free-cap-as-tested-panel-value.md) | The Free document cap is a panel value, A/B tested on new accounts before it is fixed | D11, 18 September 2026
[ADR-0015](ADR-0015-one-live-collaborator-on-free.md) | Free allows one live collaborator per document, on cost | Founders' screen review, 18 September 2026
[ADR-0016](ADR-0016-free-model-chain-and-training-gate.md) | Free AI runs on a fallback chain of free providers, and any provider that trains on inputs is barred | `27-MODEL-ROUTING-SPEC.md`, 18 September 2026
[ADR-0020](ADR-0020-voice-typing.md) | Voice typing on free speech-to-text, restructured in three levels plus raw, with a hybrid command mode, every edit a proposal | D14, widened 19 September 2026

## Contradictions these records found

Writing the records surfaced disagreements in the sources. None is settled here. Each record names
its owner.

Record | The disagreement
ADR-0004 | `21-DATA-MODEL.md` and `37-BACKUP-AND-RECOVERY.md` give different R2 key layouts and head pointers
ADR-0005 | The PRD cites the RBI framework of April 2026 and calls the 2022 ceiling repealed. `34`, `53` and the plan cite the 2022 circular
ADR-0007 and ADR-0013 | The plan's section 24 retires the Firebase project in phase A, while the stack keeps Firebase
ADR-0008 | The recorded Almanac reason is wrong. Its shutdown page gives capacity as the cause
ADR-0014 | The A/B test does not by itself stop pilot recruits meeting the cap when they import a vault
ADR-0016 | The plan's section 3 still excludes OpenRouter. Its section 14 and `27` admit it

## How to add one

1. Take the next unused number. Never reuse one.
2. Copy the front matter of any record here, with `status: decided` and `verified_against` set to
   the commit you checked against.
3. Write the six sections: Context, Decision, Evidence, Alternatives rejected and why, Consequences,
   and What would reverse it. End with the record's own limits.
4. Check every `file.md:NNN` citation with `sed -n` before writing it. Cite the plan by section, never
   by line.
5. Run `python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <f> --strict` and
   `python3 docs/pack/tools/validate-pack.py`.
6. Add the row above.

## Limits of this index

- The one-line decisions compress each record. Read the record before acting on it.
- The validator checks front matter and citations. It does not check that a decision is still true.
