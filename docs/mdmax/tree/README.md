---
mdmax: 1
title: MDMAX — the plan, as a connected markdown tree
sections: 14
lines: 15445
words: 175379
forward_edges: 99
backlinks: 99
corpus_id: sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
---

# MDMAX — the plan

> **frontmatter is Google Docs for markdown. MDMAX is the small library underneath it that makes
> writing to those files safe.**

This is the plan as **14 connected markdown files** rather than one 15,504-line document.
Every section links forward to the sections it depends on and carries a **backlinks** block listing
what points at it. Those 99 edges were **derived by parsing the prose**, not hand-authored — which
makes this tree a live test of the cross-reference resolver specified in [§3 Capabilities](03-capabilities.md).

**It is also the argument.** A plan about what markdown can represent, expressed as connected
markdown: frontmatter carrying typed metadata, tables, fenced code, diagrams, hyperlinks, backlinks,
and a machine-readable [`graph.json`](graph.json) — none of which requires a syntax any other
markdown tool has to understand. That is [D6](01-orientation.md) demonstrated rather than asserted.

---

## The sections

| § | what it covers | lines | words | → | ← |
|---|---|---:|---:|---:|---:|
| **[§1 Orientation](01-orientation.md)** | Orientation — what we are building, why now, what is settled, and how to read this | 760 | 7,231 | 8 | 11 |
| **[§2 Chronology](02-chronology.md)** | The complete chronological record: what we researched, in order, and what each round concluded | 1,093 | 12,605 | 12 | 9 |
| **[§3 Capabilities](03-capabilities.md)** | What MDMAX is: every capability, specified | 1,646 | 14,820 | 7 | 10 |
| **[§4 Representation](04-representation.md)** | Representation — what a markdown file can be made to hold, convey and mean | 1,262 | 12,716 | 3 | 11 |
| **[§5 Rendering](05-rendering.md)** | Rendering — functional and visual, custom rendering, custom formatting, custom parsing | 1,197 | 11,996 | 3 | 12 |
| **[§6 Conventions](06-conventions.md)** | Our own conventions: the library model, custom definitions, reference pointers, and whether any of it ships | 1,117 | 11,325 | 4 | 4 |
| **[§7 Product](07-product.md)** | frontmatter the product: features, the gap, and what it needs on top of MDMAX | 880 | 13,391 | 8 | 9 |
| **[§8 Market](08-market.md)** | The market — USP, what competitors lack, what we solve, what we cannot solve | 1,111 | 12,505 | 3 | 4 |
| **[§9 AIOS](09-aios.md)** | AIOS: what to import, what to refuse, and how it makes the build faster and safer | 1,035 | 10,206 | 7 | 8 |
| **[§10 Engine spec](10-engine-spec.md)** | The engine specification: passes, offset model, robustness, and the hazards that will bite | 1,357 | 13,903 | 3 | 8 |
| **[§11 Execution](11-execution.md)** | The execution plan — every step, in order, with gates | 1,223 | 11,992 | 8 | 5 |
| **[§12 Risks](12-risks.md)** | Risks, the pre-mortem, and the incompatible wants | 1,095 | 12,051 | 10 | 3 |
| **[§13 Appendix](13-appendix.md)** | Appendix — the evidence base, the corpus, and where everything lives | 1,164 | 12,924 | 10 | 2 |
| **[§14 Verification](14-verification.md)** | Verification record | 505 | 17,714 | 13 | 3 |
| | **total** | **15,445** | **175,379** | | |

---

## Where to start

- **Never seen this project** → [§1 Orientation](01-orientation.md), then [§11 Execution](11-execution.md).
- **Building it** → [§10 Engine spec](10-engine-spec.md) and [§11 Execution](11-execution.md).
- **Deciding whether to** → [§8 Market](08-market.md) and [§12 Risks](12-risks.md).
- **Sceptical** → [§12 Risks](12-risks.md), then [§14 Verification](14-verification.md), which lists
  every defect four independent fact-checkers found in the other thirteen.
- **What markdown can hold** → [§4 Representation](04-representation.md) and [§5 Rendering](05-rendering.md).

## Reading conventions

Every claim carries a tier — `[measured]` we ran it · `[primary]` read the source · `[secondary]` ·
`[inference]` · `[SIMULATED]` replayed through code rather than read from a live system. Every number
about our own files cites `corpus_id sha256:3a010b16…` — 1,084 files, 25,548,765 bytes, each with a
sha256. **A number with no source is a defect**, and the ones we found are listed in
[§14](14-verification.md).

## Other formats

The same content is also a single file (`../PLAN.md`), a website (`../site/index.html`) and a PDF.
All three are generated from these 14 files. **The markdown is the source; everything else is a
projection** — which is [the invariant](01-orientation.md) the engine is built on.
