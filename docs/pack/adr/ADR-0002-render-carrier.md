---
id: ADR-0002-render-carrier
title: Callouts carry prose, fenced blocks carry opaque data
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0002]
---

# ADR-0002. Callouts carry prose, fenced blocks carry opaque data

**Decision id:** ADR-0002. **Decided:** in PRD v2, 29 August 2026, section 8.2. **Recorded here:**
18 September 2026.

## Context

- ADR-0001 keeps documents in plain markdown. So every extension frontmatter adds, a decision, a
  task, a board, a query, has to be written inside ordinary CommonMark.
- CommonMark defines no front matter and no extension syntax. `docs/FRONTMATTER-PRD-v2-2026-08-29.md:5682`
  records a count of zero for "front matter" in CommonMark 0.31.2, and zero for "YAML" too.
- The carrier is the literal form on disk. It decides what a person sees in a renderer that has
  never heard of frontmatter, and what one lost line does to the rest of the file.

## Decision

- **Prose a person reads goes in a blockquote callout**, `> [!kind]`, for example `> [!NOTE]` or
  `> [!DECISION]`.
- **Opaque machine data goes in a fenced code block** with a reserved info string, for example
  ` ```fm-board `.
- `:::` directives are accepted on input and never emitted.

## Evidence

Every citation below was opened with `sed -n` on 18 September 2026.

- `CLAUDE.md:119` lists the carrier under "Settled".
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:475` scores the callout: an unclosed state is structurally
  impossible, because a block quote has no closing marker. It ends when the `>` prefix stops.
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:476` scores the fence: an unclosed fence runs to the end
  of the containing block, per CommonMark section 4.5, and swallows the rest of the document.
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:469` records that this corrects PRD v1.1, which had made the
  fence info string the single dispatch mechanism.
- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:486` names the ecosystem that already reads callouts:
  GitHub, Obsidian, Zed and Docusaurus all recognise the marker.

The asymmetry, in one table:

Failure | Callout | Fence
Closer lost | Cannot happen | The rest of the file becomes code
Marker not understood by a renderer | Shows as an ordinary quote, content survives | Shows as a code block, content survives
Wrong content type inside | One stray unprefixed line ends it, payload orphaned | Prose renders monospaced and drops out of search

## Alternatives rejected and why

Alternative | Why rejected
Fence for everything, the PRD v1.1 position | One dropped closing line turns the rest of a long note into code
Callout for everything | A machine payload breaks at the first line that lacks `>`
`:::` directives as the output form | Not CommonMark. Rewriting them on save would be a whole-file rewrite, which ADR-0006 forbids
Invisible HTML comments, `<!--fm ... -->` | `docs/FRONTMATTER-PRD-v2-2026-08-29.md:744` records them visible as escaped text under markdown-it's default `html:false`. Clean in two of three certified configurations only
Markdoc `{% tag %}` | Studied and rejected as a carrier, `docs/FRONTMATTER-PRD-v2-2026-08-29.md:450`

## Consequences

- The fence writer emits the opening and closing lines in one splice, never two.
- The callout writer prefixes every line it emits, and the reader treats the first unprefixed line
  as the end.
- A tab or space indent the engine cannot resolve inside a container is refused, per ADR-0006.
- `25-ENGINE-SPEC.md` section 25.9 names a `callout-body` span kind for this carrier.

## What would reverse it

- `docs/FRONTMATTER-PRD-v2-2026-08-29.md:498` states it. A measured sweep showing callout markers
  recognised by fewer than about half of the certified engines, and those engines mangling rather
  than ignoring the `[!NOTE]` line, moves prose to plain bold-labelled blockquotes.
- The fence half falls only if a CommonMark release changes unclosed-fence behaviour.

## Limits of this record

- `INFERENCE:` the "about half" threshold is the PRD's own and was not re-measured here.
- No new renderer sweep was run for this record.
