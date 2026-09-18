---
id: ADR-0006-projection-law-and-splice-only
title: The projection law and splice-only writing, refuse rather than guess
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0006]
---

# ADR-0006. The projection law and splice-only writing, refuse rather than guess

**Decision id:** ADR-0006. **Spec of record:** `specs/engine/splice-writer.md`, last updated
29 August 2026. **Recorded here:** 18 September 2026. `UNVERIFIED:` the date the law was first
adopted. It predates the PRD v2 and was not traced for this record.

## Context

- Most markdown editors parse a file into a tree, edit the tree, and write the tree back out. The
  round trip normalises spacing, drops comments and rewrites reference links in lines nobody touched.
- In a repository where agents and people both write, a diff full of untouched lines hides the one
  change that matters.
- The product exists to be trusted with the file. So it needs a rule for what a view is, and a rule
  for how a write happens.

## Decision

- **The projection law.** The file on disk is the only source of truth. Every view is a
  deterministic, stateless projection of it.
- **Splice-only writing.** The engine locates the byte range of a target and replaces exactly those
  bytes. Every other byte stays bit-identical. It never regenerates a file from a parse tree.
- **Refuse rather than guess.** When the range cannot be located unambiguously, the engine returns
  the input unchanged and says why.

## Evidence

Every citation below was opened with `sed -n` on 18 September 2026.

- `CLAUDE.md:19` to line 23 lists the law and splice-only writing as two of the three load-bearing
  ideas.
- `AGENTS.md:13` makes refusal a rule for every agent: returning the input unchanged is correct, and
  guessing is not.
- `specs/engine/splice-writer.md:32` is the contract, and calls it the single guarantee the product
  is sold on.
- `25-ENGINE-SPEC.md` section 25.4 lists the six invariants, each with its check. Two of them:

Invariant | Check
Bytes outside the target range are bit-identical after any write | corpus run, `changed = 0`
The writer never throws. It returns the input or a spliced result | corpus run, `threw = 0`

- `[O]` the live writer exists: `src/modules/share/domain/splice-frontmatter.ts` is 13,324 bytes,
  measured with `wc -c` for this record.

## Alternatives rejected and why

Alternative | Why rejected
Parse, edit the tree, serialise | A normalising round trip touches every line, per `25-ENGINE-SPEC.md` section 25.1
A best-effort guess when a range is ambiguous | A confident wrong answer is the one failure the product exists not to have
Throw an error on an ambiguous range | A caller's error path is written for a network failure. `25-ENGINE-SPEC.md` section 25.4 explains why a throw turns a refusal into data loss
A view that keeps its own state | A second source of truth, and a future disagreement with the file

## Consequences

- **Refusal is a counted outcome.** The R0 exit condition is refused at most 2, changed 0, threw 0
  over the corpus, per `25-ENGINE-SPEC.md` section 25.7.
- `npm run corpus` pins 8,513 files byte for byte and fails on one changed byte, per `AGENTS.md`
  section 0.1.
- Correctness defects are fixed ahead of availability defects even when rarer,
  `specs/engine/splice-writer.md:81`.
- **Today the law holds for front matter only.** `25-ENGINE-SPEC.md` section 25.2 records that the
  body below it is a read-only projection until a body locator exists.
- Sync, ADR-0003, and the carrier, ADR-0002, are both shaped by this record.

## What would reverse it

- Nothing planned. Giving up byte fidelity would remove the product's stated differentiation.
- A measured refusal rate that stays high on real vaults would not reverse the rule. It would make
  fixing refusals, such as `nf-001-zero-indent-sequence`, the top engine priority.

## Limits of this record

- The date of first adoption was not traced.
- No corpus run was made for this record. The invariants are carried from the spec.
