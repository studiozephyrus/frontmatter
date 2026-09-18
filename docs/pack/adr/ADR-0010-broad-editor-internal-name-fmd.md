---
id: ADR-0010-broad-editor-internal-name-fmd
title: The product is the broad markdown editor, and its internal name is fmd
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0010]
---

# ADR-0010. The product is the broad markdown editor, and its internal name is fmd

**Decision id:** ADR-0010. **Open decision closed:** D01 in `56-OPEN-DECISIONS.md`. **Decided:**
18 September 2026 `[Z]`. **Pack commits:** `dd048fe` and `473c6b3`, both 18 September.

## Context

- Two of our documents disagreed on what the product is.
- `docs/mvp0/PRODUCT-PLAN.md` section 1 carries
  option a, a markdown editor for people whose documents are increasingly written with and for AI
  agents. Section 29 said the plan was written to option b.
- Option b was an editor for the instruction files agents obey: AGENTS.md, CLAUDE.md and rules files.
- 23 decision cards in `decisions/v2` had been closed on the strength of option b.

## Decision

- **The product is the markdown editor for the agentic era**, option a, sharpened.
- One editor with Doc mode and Markdown mode, switchable. Rough ideas become blueprints and flows
  through questions. From one markdown file a person can publish, share and use every feature.
- **Internally the product is called `fmd`.** The public name stays frontmatter.
- **`fmd` stands for nothing.** No binary, package or public handle uses it.
- **The tagline is not decided.** Three shortlisted lines are tested, one line per person.

## Evidence

- `56-OPEN-DECISIONS.md` section 0, D01, records the founder's answer in summary, `[Z]`.
- `56-OPEN-DECISIONS.md` section 2, D01, gives the recommendation it followed: take a, because
  documentation is the top AI task and people who do not use git lack a review surface.
- `docs/research/2026-09-18-name/TAGLINE-AND-FMD.md` section 5 opened the registries on 18 September:

Where | What holds `fmd` | Risk the research gave
npm `fmd` | "Factory Module Definition", created 2013 | Low, but the name is not available
crates.io `fmd` | "Find Markdown files by metadata" | Medium, same field
GitHub `franken_markdown` | Ships a CLI binary named `fmd`, a markdown renderer | High for any binary
GitHub user `fmd` | An individual's account since 2012 | Blocks `github.com/fmd`

- That table is why `fmd` stays internal and names no artefact.

## The tagline test

`docs/research/2026-09-18-name/TAGLINE-AND-FMD.md` section 4 shortlists three lines:

Rank | Line | Angle
1 | Everything starts as one markdown file. | One file, many outputs
2 | Looks like a document. Saves as markdown. | The editor
3 | From rough idea to blueprint. | Ideas to blueprints

- Section 4.1 is the test: five seconds on a plain page, then a next-day recall question.
- `UNVERIFIED:` the research derived no sample size. It says to fix one before the test starts.

## Alternatives rejected and why

Alternative | Why rejected
Option b, the instruction-file editor | Doc mode, the portfolio and most of sharing stop being justified. The product narrows to a developer tool
A public `fmd` brand or command | The names above are taken, one of them by a markdown renderer's command
An expansion such as "free markdown" | The research drops it: it makes a pricing claim we have not decided

## Consequences

- **The 23 cards that assumed option b re-open**, per `56-OPEN-DECISIONS.md` section 6.
- `51-PRODUCT-PLAN.md` and `docs/mvp0/PRODUCT-PLAN.md` section 29 change to match.
- Code, packages and commands keep the public name or the legacy `sgnk-md` keys. `AGENTS.md` section
  8 explains why those keys must not be renamed.

## What would reverse it

- The public name decision, D05, which waits on a trademark search. A new public name would not
  change the product, but it could change what `fmd` pairs with.
- Pilot evidence that the broad editor finds no users outside developers.

## Limits of this record

- The founder's words are summarised in `56`, not quoted. This record summarises that summary.
- The 23 re-opened cards were not listed or re-counted here.
