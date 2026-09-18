---
id: ADR-0001-compiler-not-format
title: Build a compiler and an IDE, not a new markdown format
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0001]
---

# ADR-0001. Build a compiler and an IDE, not a new markdown format

**Decision id:** ADR-0001. **Decided:** 29 July 2026, in the MDZ research session. **Recorded
here:** 18 September 2026.

## Context

- In July 2026 the founder wanted to invent a next-generation markdown. Working names were MD3, then
  MDZ, then mdbase.
- The question was whether frontmatter should ship its own file format, or work on plain markdown
  and add value in a layer above the file.
- A builder who adds syntax the rest of the world cannot read locks every document into this editor.

## Decision

**Do not build a new markdown format.** Build the layer above the file instead: a linker,
diagnostics, a type checker for front matter, and durable block identity. That is a compiler and an
IDE over ordinary markdown.

## Evidence

Every citation below was opened with `sed -n` on 18 September 2026.

- `CLAUDE.md:118` lists this under "Settled" as the markdown format verdict.
- `HANDOFF-mdz-markdown-format-2026-07-29.md:26` states the headline verdict: do not build a new
  format, because every format that added power lost.
- `HANDOFF-mdz-markdown-format-2026-07-29.md:29` names the unclaimed layer: a linker, diagnostics,
  a type checker for front matter and durable block identity.
- The adoption table at `HANDOFF-mdz-markdown-format-2026-07-29.md:257`, as measured on 29 July:

Format | Backing | Reach
MDX | Vercel | 3.07 percent of `.md` volume
Markdoc | Stripe | 0.136 percent
Obsidian `.base` | Obsidian | 0.028 percent
djot | CommonMark's own author | 848 downloads a week
SKILL.md | two front matter fields | 44 cross-vendor clients

- The pattern in that table: the formats with the least schema spread furthest.
- `HANDOFF-mdz-markdown-format-2026-07-29.md:383` records the front end as already solved. On the
  repository's own 50 files, 0 of 18,260 mdast nodes lacked a position.
- `docs/mvp0/PRODUCT-PLAN.md` section 17 closes the product-pieces table with the same conclusion:
  Doc mode, the flow view, the portfolio and Drive sync are projections over the same bytes, so none
  of them needed a new format.

## Alternatives rejected and why

Alternative | Why rejected
A new format with typed blocks (MD3, MDZ) | Every comparable format that added power stayed under a few percent of markdown volume
Adopt MDX as the carrier | 3.07 percent reach, and it ties documents to a JavaScript build
Markdown packaged as a ZIP container | `HANDOFF-mdz-markdown-format-2026-07-29.md:339` calls it arithmetically dead as bytes. Its section 2.2 measured base64 at 0.70 to 0.92 tokens a byte
Compete with `mdbase-spec` on the record layer | The handoff at line 349 recommends layering on it instead: mdbase holds records, frontmatter holds nodes

## Consequences

- Every document stays readable in GitHub, Obsidian and any CommonMark renderer.
- New capability arrives as a projection, a diagnostic or a carrier inside plain markdown. See
  ADR-0002 for how an extension is written on disk.
- The engine owns positions, not syntax, which is why ADR-0006 exists.
- `INFERENCE:` the competitive surface moves from syntax to tooling, where IWE and `mdbase-spec`
  already ship. The handoff names both.

## What would reverse it

- A new markdown dialect reaching a large share of `.md` volume within a few years.
  - `UNVERIFIED:` the share of `.md` volume has not been re-measured since 29 July. needs: the
    29 July GitHub code search rerun with an authenticated token, which this session did not use.
  - `[O]` the download half was rerun on 18 September 2026 with
    `curl -s https://api.npmjs.org/downloads/point/last-week/<package>`, for 10 to 16 September:
    `@djot/djot` 1,245, `@mdx-js/mdx` 9,844,723, `@markdoc/markdoc` 503,184, and `remark-parse`
    46,684,670. No dialect has moved towards the reversal line.
- A founder decision to trade portability for a feature that plain markdown cannot carry at all.

## Limits of this record

- The adoption figures are from one session on 29 July 2026 and were not re-derived here.
- The AGENTS.md row of that table is omitted on purpose. `52-MARKET-RESEARCH.md` records that the
  AGENTS.md count in circulation is stale, and the handoff's figure was not re-measured.
