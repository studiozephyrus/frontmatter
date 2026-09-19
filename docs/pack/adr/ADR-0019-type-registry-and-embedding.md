---
id: ADR-0019-type-registry-and-embedding
title: One type registry, and embedding by reference
mode: explanation
tier: canonical
status: open
verified_against: ee73929
updated: 2026-09-19
owner: sagnik
covers: [ADR-0019]
---

# ADR-0019. One type registry, and embedding by reference

**Decision id:** ADR-0019. **Status: open, proposed.** The ask is `[Z]`, 18 September 2026: one
platform joining docs, sheets, boards, notes and sites, with presentations later
(`56-OPEN-DECISIONS.md` section 0).

The model below is a recommendation from research, awaiting the founder. **Recorded here:**
19 September 2026.

The full specification is `70-PLATFORM-AND-TYPES.md`. This record keeps only the decision and its
reasons.

## Context

- The product has one law for markdown: the file is the only truth, and every view is a projection
  (ADR-0006). The ask adds four more types to it.
- `[O]` Four places in `src/` hard-code `.md` today: search, the snapshot, the vault zip and the link
  index (`70` section 2.5).
- A sheet in a report, or a board card that links a spec, needs one type to show inside another.

## Decision, proposed

- **Every content type is a text file with one canonical format**, registered in one registry the
  product owns.
- **The extension picks the family; inside `.md`, one reserved profile key picks the profile.** No key
  means a note. Two keys is a conflict, shown, never resolved by a guess. Content is never sniffed.
- **Every registry entry implements `locate()`.** A type that cannot say which bytes an edit touches
  stays read-only.
- **One queue, one search, one link index, one history and one mirror serve every type.**
- **An embed is a reference by path and anchor, in an `fm-embed@1` fence.** It is never a copy. An edit
  inside it is a queue item on the source file.
- **A viewer sees an embed only if they can read the source**, and publishing never publishes an
  unpublished source.
- **Slides and sites are views of markdown**, with no new file type.

## Evidence

All from `docs/research/2026-09-18-sheets-boards/ONE-PLATFORM.md`, opened 18 September 2026, unless
marked.

- **Deep fusion has always cost the file** in Notion, Coda, AFFiNE, Anytype and Craft; **keeping the
  file has always cost the fusion** in Google Workspace and Zoho (section 1.9).
- **Obsidian keeps files and fuses views**, but each plugin owns its own format (section 1.7).
- **Google's linked objects show the source to readers never given it** (section 1.3), which is why
  an embed takes the source's permission.
- **Every type the founder named has a plain-text form in the wild** (section 2.7), so no new format is
  needed, which keeps ADR-0001.
- `[O]` **`type:` is taken.** Re-measured for `70` at `cb7c16f`: 34 of the 7,969 corpus files with
  front matter use a top-level `type:` key for their own meaning.

## Alternatives rejected and why

Alternative | Why rejected
A private block or object store, as Notion and Anytype use | It gives up the file, which is the product
Separate apps behind one login, as Google and Zoho do | The fusion stops at the share dialog
A `type:` front matter key as the switch | 34 corpus files already use it for their own meaning
Detecting a type from content | A guess
An embed that copies content into the host | Google's linked-object leak, and a second truth
A third-party plugin API that defines formats | `INFERENCE:` where Obsidian's formats fray. Not before the registry has shipped four types of its own

## Consequences

- **The registry lands early, in batch 3**, while there are four `.md` checks to replace rather than
  more (`ONE-PLATFORM.md` section 4.1). `50-ROADMAP.md` owns the placement.
- **`67-SYNC-AND-CONFLICT.md` section 7.1's "Markdown only" widens** to every registered text type.
- **The queue needs a `create` kind**, as `67` section 8.4 proposes, for new cards and imported sheets.
- **New reserved profile keys**: `board`, `view`, `slides` and `site`, beside the four `66-FORMAT-SPECIFICATIONS.md` section 3.9 holds.
- **Import-only formats** (`.xlsx`, `.pptx`, `.docx`) convert into text types as proposals, never edited
  in place.

## What would reverse it

- A sheet or board operation the founders need that cannot be a splice into one text file.
- A view that needs state the bytes do not hold.

## Limits of this record

- **Not decided.** The founder asked for one platform; he has not chosen this model.
- **The registry interface, `fm-view@1` and `fm-embed@1` are inference.** None has a prototype or a
  test.
- **The survey was not re-run.** Its claims are `ONE-PLATFORM.md`'s, from 18 September 2026.
