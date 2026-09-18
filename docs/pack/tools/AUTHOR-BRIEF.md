# Brief for anyone writing a file in this pack

Read this, then `docs/pack/65-CONVENTIONS.md`, then start. Both bind you.

## What this pack is for

**frontmatter is a markdown editor for people whose documents are increasingly written with, and
for, AI agents.** Studio Zephyrus. Next.js on Vercel, Cloudflare R2 for bytes, Firestore for
records, Firebase Auth, Tauri v2 for the desktop build from the same source tree.

This pack exists so that **development can start, and continue, without the people who wrote it.**
The founder will move between Claude accounts, and between Claude, Codex and other tools, to manage
cost. Every file has to work for an agent that has never seen this repository and cannot ask a
question. Write for that reader.

Three things are load-bearing and appear throughout:

- **The projection law.** The file on disk is the only source of truth. Every view is a
  deterministic, stateless projection of it.
- **Splice-only writing.** The engine locates a byte range and replaces exactly those bytes. It
  never rewrites a whole file, and it **refuses** rather than guess when a range is ambiguous.
- **The change queue.** Every change by a person, an AI edit or an agent enters a queue where the
  owner accepts or rejects it one by one. No silent merge, ever.

## Your sources, in order of authority

1. `docs/mvp0/PRODUCT-PLAN.md` revision 6, updated 18 September. **The plan of record.** 31
   sections. Read the ones your file touches.
2. `docs/mvp0/SCREENS.md`, 38 screens, generated from the plan.
3. `docs/mvp0/SCREEN-CHANGES-2026-09-18.md`. **The founders' review of 18 September**, and the two
   decisions handed back. Newer than the plan where they disagree.
4. `docs/research/2026-09-18/raw/*.md`. 178 findings on the agentic-era market, each with its source.
5. `docs/research/2026-09-18-llm/raw/*.md`. The free-model layer, abuse guardrails and router design.
6. `AGENTS.md` and `CLAUDE.md` at the repository root. Operational rules, already true.
7. The code itself, under `src/`, `specs/`, `src-tauri/`.

**Where two of these disagree, say so in the file rather than picking silently.**

## Hard rules

1. **Never invent a citation.** `docs/FILE.md:NNN` gets checked with `sed -n 'NNNp' <file>` before
   you write it. This repository has had fabricated citations and checks for them mechanically.
2. **Never invent a number.** Every figure comes from the plan, from the research, or from a command
   you ran in this session. Show the command. If there is no number, write a form that needs none.
3. **Never open the large documents with Read.** `docs/FRONTMATTER-PRD-v2-2026-08-29.md` is 760 KB,
   `docs/FRONTMATTER-RECORD.md` is 2.1 MB, and `ENGINE.md` and `DEV-PLAN.md` are each around 250 KB.
   Use `grep -n` then `sed -n 'START,ENDp'`. One Read of any of them blows the context window.
4. **British spelling. Plain hyphens only. No em dashes or en dashes anywhere, ever.**
5. **No paragraph over about forty words.** Bullets and tables carry the structure.
6. **Front matter on every file**, per `62-DOC-SCHEMA.md`. `owner: sagnik` unless told otherwise.
7. **Run the writing gate on every file before you finish:**
   `python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <path> --strict`
   It must print PASSED. Fix and re-run if it does not.
8. **Write one file at a time and save it before starting the next.** Do not hold several files in
   memory and write them at the end. A previous fan-out lost 1,087 edits that way.
9. **You are read-only outside your own assigned files.** No commits, no pushes, no installs, no
   destructive operations, no edits to files another writer owns.

## What "granular" means here

The founder's words: "Be as granular as you can. Any agent that picks it up should be looking into
that thing like a charm."

So:

- **A table beats a paragraph.** A row per thing, with columns that are the same for every row.
- **Name the file, the function, the route, the key, the command.** Not "the auth module" but
  `src/modules/auth/` and the barrel it exports.
- **Every claim about what exists gets checked against the repository.** If a thing is specified but
  not built, say `specified, not built` rather than describing it as though it exists. The pack is
  mostly a specification for work not yet done, and pretending otherwise is the worst thing it could
  do.
- **Where you are guessing, write `INFERENCE:`. Where you could not check, write `UNVERIFIED:`.**
- **End every judgement file with its own limits.** What was not assessed, what could not be
  verified, what would falsify it.

## The one thing that matters most

A person who has never seen this product should be able to read your file and build the thing it
describes, without asking anybody anything. If your file would send them looking for a person, it
is not finished.
