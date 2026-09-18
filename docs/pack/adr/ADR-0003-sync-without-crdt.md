---
id: ADR-0003-sync-without-crdt
title: Sync is git-merge plus a splice journal plus compare-and-swap, never a CRDT
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0003]
---

# ADR-0003. Sync is git-merge plus a splice journal plus compare-and-swap, never a CRDT

**Decision id:** ADR-0003. **Decided:** in PRD v2, 29 August 2026, section 31. **Caveat added:**
9 September 2026. **Recorded here:** 18 September 2026.

## Context

- Two devices, or a person and an agent, can change the same document while apart. Sync decides
  what the file holds afterwards.
- A CRDT (conflict-free replicated data type) is the industry's usual answer for live text. It
  guarantees that every replica converges on the same state.
- This product's contract is different. It must own the bytes, and refuse when it cannot place a
  change. See ADR-0006.

## Decision

**Git three-way merge over a stored true base, mediated by server-issued revisions and
compare-and-swap, with an append-only splice journal as a checkable record. Never a CRDT.**

## Evidence

Every citation below was opened with `sed -n` on 18 September 2026.

- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:2904` states the decision in those terms.
- Three disqualifications, `docs/FRONTMATTER-PRD-v2-2026-08-29.md:2910` to line 2912:

Id | Disqualification | Tag in the PRD
D1 | A CRDT cannot own the file bytes. The CRDT document becomes the record and the `.md` file becomes the projection, which inverts ADR-0006 | inference
D2 | Convergence buys byte-identical garbage. Concurrent inserts at one position can interleave, per arXiv 2305.00583v3, "The Art of the Fugue" | fetched
D3 | A CRDT cannot refuse. Its design goal is that conflicts never surface | inference

- The PRD's weighted matrix, out of 80, `docs/FRONTMATTER-PRD-v2-2026-08-29.md:2918` to line 2921:
  git-merge with journal and compare-and-swap scored 74, a CRDT 51.
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:2925` measured `diff-match-patch@1.0.5` applying the same
  patch twice and reporting success both times. That is why fuzzy patching is rejected too.

## Zed Delta, named as the caveat requires

`CLAUDE.md:121` to line 123 says this position needs a written rebuttal that names Zed Delta, not a
restatement.

- `docs/research/2026-09-09/BRIEFING.md:60` records Zed Delta as the same thesis with the opposite
  architecture. Its 1 September post stakes attribution "down to the span" on CRDTs, at
  https://zed.dev/blog/agentic-xanadu, opened by that research on 9 September.
- `06-COMPETITIVE-LANDSCAPE.md` section 3 records a public beta from 16 September 2026.
- `INFERENCE:` from the same section, Zed partitions rather than contradicts. Its CRDT governs the
  live session and git governs the durable artefact. We put a splice journal where they put a CRDT.
- `06-COMPETITIVE-LANDSCAPE.md` section 3 also adds OpenKnowledge as a second CRDT bet. `UNVERIFIED:` its own pages were not
  opened.

## Alternatives rejected and why

Option | Score out of 80 | Why rejected
CRDT, Yjs or Loro or Automerge | 51 | D1 to D3 above
Git only, as transport | 69 | Scored lower. `INFERENCE:` no journal to check a merge against
Last writer wins with a conflict copy | 62 | Scored lower. `INFERENCE:` the losing edit leaves the file for a side copy
Server-authoritative operational transform | 40 | Interleaves too, per the same paper
Fuzzy patch, as Obsidian ships | 32 | Reports success on a misapplied patch

## Consequences

- Every client keeps the base bytes, the working bytes and a journal of splices, per
  `docs/FRONTMATTER-PRD-v2-2026-08-29.md:2969`.
- A conflict the merge cannot settle goes to the change queue as an item, per ADR-0008, never into
  the file as markers.
- Live editing on Durable Objects rides on this substrate. It does not replace it.
- **The written rebuttal is owed.** `50-ROADMAP.md` lists it in batch 4, sharing and the change
  queue, with no feature id. It is not written.

## What would reverse it

- `51-PRODUCT-PLAN.md` section 5.1 names it: a measured demonstration that a CRDT preserves byte-exactness on a
  real vault.
- A CRDT design that can refuse a change and surface it, rather than converge silently.

## Limits of this record

- The matrix weights are the PRD's judgement, not a measurement.
- The rebuttal to Zed Delta does not exist yet. This record names the owed work and does not do it.
