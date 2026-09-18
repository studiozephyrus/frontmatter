---
id: 65-CONVENTIONS
title: Conventions
mode: reference
tier: canonical
status: living
verified_against: 0af3c90
updated: 2026-09-18
owner: sagnik
covers: [conventions]
---

# 65. Conventions

Read this before writing anything else in this pack. Every rule here is checkable, and
`docs/pack/tools/validate-pack.py` checks most of them.

## 1. The four rules the pack keeps about itself

1. **Generated beats written, dated beats undated, owned beats orphaned.** Anything derivable from
   the code is generated and diff-gated. Anything not derivable is dated and owned, and kept small.
2. **One fact, one home.** A feature id lives in `10-FEATURE-REGISTER.md` and nowhere else. A
   user-facing string lives in `16-COPY-DECK.md` and nowhere else. Everything else links.
3. **Never renumber. Supersede, and name the successor in the old record.** This applies to
   decision records, feature ids, screen ids and filenames. Insert with a suffix letter if you must.
4. **Every judgement document ends with its own limits.** What was not assessed, what could not be
   verified, what is not established, and what would falsify it.

## 2. Front matter

Every file in this pack opens with YAML front matter. The contract is `62-DOC-SCHEMA.md`, and the
validator fails a build on a breach. The short version:

Key | Required | Notes
`id` | yes | The filename without `.md`, or the screen id inside `12-screens/`.
`title` | yes | Plain text, the heading the file opens with.
`mode` | yes | `tutorial`, `how-to`, `reference` or `explanation`.
`tier` | yes | `canonical`, `derived`, `archive` or `superseded`.
`status` | yes | See the vocabulary below.
`updated` | yes | ISO date.
`owner` | yes | A person, never a team.
`verified_against` | when `tier: canonical` | The commit the claims were checked against.
`generated_by` | when `tier: derived` | The exact command.

**An `archive` is never freshness-reviewed.** It is a record of what was true then, and editing it
destroys the record.

## 3. Identifier formats

Kind | Format | Example | Home
Feature | `F` plus three digits | `F001` | `10-FEATURE-REGISTER.md`.
Screen | `S` plus two digits | `S04` | `12-screens/S04.md`.
Component | `C` plus three digits | `C014` | `14-COMPONENT-INVENTORY.md`.
Copy string | `K` plus a dotted path | `K.s04.addfile` | `16-COPY-DECK.md`.
Error or refusal | `E` plus three digits | `E007` | `17-ERROR-AND-REFUSAL-CATALOGUE.md`.
Acceptance criterion | `A` plus three digits | `A042` | `19-ACCEPTANCE-CRITERIA.md`.
Engine refusal | `nf-` plus three digits plus a slug | `nf-001-zero-indent-sequence` | `specs/engine/`.
Decision record | `ADR-` plus four digits | `ADR-0007` | `adr/`.
Open decision | `D` plus two digits | `D11` | `56-OPEN-DECISIONS.md`.
Claim we may or may not make | `CL` plus three digits | `CL201` | `07-CLAIMS-REGISTER.md`. It was `C` until 18 September 2026, which collided with components: `C001` to `C008` were both a claim and a component.
Event | dotted, lower case | `doc.change.accepted` | `55-MEASUREMENT-AND-EVENTS.md`.
Entitlement | dotted, lower case | `limits.collab.live` | `53-PRICING-AND-ENTITLEMENTS.md`.

**An id is never reused and never renumbered.** If `F031` is withdrawn, its row stays and says so.

## 4. Citation

- **A file:** `docs/mvp0/PRODUCT-PLAN.md`
- **A line:** `docs/mvp0/PRODUCT-PLAN.md` section 3, and **check it with `sed -n '238p' <file>` before
  writing it.** Fabricated citations have happened in this repository and are checked mechanically.
- **A source opened on the web:** the full URL and the date it was opened.
- **A number:** never carried forward. Re-derive it at write time and say how.

## 5. Evidence tags

These come from the plan and mean the same thing here.

Tag | Meaning
`[Z]` | A founders' decision, given directly.
`[M]` | A page was opened and the string quoted.
`[R]` | Earlier research of ours.
`[O]` | Measured in the session that wrote the line.
`[L]` | An external constraint we do not control.
`[P]` | Follows from another decision in this pack.

Anything that is inference is written `INFERENCE:`. Anything unchecked is written `UNVERIFIED:`.
Both are allowed. Silence dressed as fact is not.

## 6. Status vocabulary

Domain | Values
Document | `draft`, `living`, `frozen`, `superseded`.
Screen | `specified`, `building`, `built`, `verified`.
Feature | `planned`, `building`, `shipped`, `withdrawn`.
Defect | `open`, `fixed`, `wontfix`, `duplicate`.
Decision | `open`, `decided`, `reversed`.

**`verified` and `built` are written by the harness, never by hand.** A hand edit is reverted by the
next build.

## 7. Severity

Level | Meaning
`CRITICAL` | Data loss, a security hole, or money moving wrongly.
`HIGH` | A person cannot complete a core job.
`MEDIUM` | A person can complete the job, badly.
`LOW` | Cosmetic, or an internal annoyance.

## 8. Prose

- **British spelling.** Behaviour, licence as the noun, recognise, artefact.
- **Plain hyphens. No em dashes and no en dashes**, anywhere, ever. A full stop, a comma or brackets
  does the same work.
- **No long paragraphs.** Nothing over about forty words. Bullets and tables carry the structure.
- Short sentences. Every claim carries its caveat.
- The writing gate is `python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <f> --strict` and it
  must pass before a file is committed.

## 9. Icons and images

- **Google Material Symbols, Rounded, delivered as inline SVG.** Nothing else.
- **No emoji as an icon. No icon web font. No second icon library.**
- Brand marks are not Material Symbols. They live in `docs/mvp0/screens/icons/brand-*.svg`.

## 10. Diagrams

Mermaid, in a fenced block, so a diagram diffs as text. No binary image of a diagram is ever the
source of truth.
