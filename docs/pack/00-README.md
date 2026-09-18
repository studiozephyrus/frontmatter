---
id: 00-README
title: Start here
mode: reference
tier: canonical
status: living
verified_against: 0af3c90
updated: 2026-09-18
owner: sagnik
covers: [pack-index]
---

# 00. Start here

**This is the pre-development pack for frontmatter.** It exists so that the product can be built,
and kept being built, by somebody who was not in the room, on a tool that is not this one, in an
account that is not this account.

If you are an agent picking this up cold, read **`64-PORTABILITY-AND-HANDOVER.md`** next. It tells
you what to read in what order, what to run to prove the repository is healthy, and what not to
touch.

## The product in seven lines

1. **frontmatter is a markdown editor for people whose documents are increasingly written with, and
   for, AI agents.** Studio Zephyrus, two founders, Sagnik and Amit.
2. **The projection law.** The file on disk is the only source of truth. Every view is a
   deterministic, stateless projection of it.
3. **Splice-only writing.** The engine locates a byte range and replaces exactly those bytes. It
   refuses rather than guess when a range is ambiguous.
4. **The change queue.** Every change by a person, an AI edit or an agent is accepted or rejected
   one by one. No silent merge, ever.
5. **The editor is what we sell. The files never are.**
6. Web, desktop and phone on one account. Next.js on Vercel, Cloudflare R2 for bytes, Firestore for
   records, Firebase Auth, Tauri v2 for the desktop build.
7. Free, Pro at 299 rupees a month, and Max later, where **your agents work here**.

## Ground truth, measured at commit `0af3c90` on 18 September 2026

Every number here was produced by the command beside it. **Re-run them rather than trusting the
number.** A carried-forward figure is how this pack would start lying.

What | Count | Command
Screens specified | 38 | `grep -c '^### S[0-9]' docs/mvp0/SCREENS.md`
Page routes built | 8 | `find src/app -name 'page.tsx' \| wc -l`
API routes built | 26 | `find src/app -name 'route.ts' \| wc -l`
Modules | 14 | `ls src/modules \| wc -l`
First-party source files | 232 | `find src -type f \( -name '*.ts' -o -name '*.tsx' \) \| wc -l`
Spec files | 7 | `find specs -name '*.md' \| wc -l`
npm scripts | 26 | `node -e "console.log(Object.keys(require('./package.json').scripts).length)"`
Byte-pinned corpus | 8,513 files | `npm run corpus`

**Read the first two rows together and do not look away from them.** Thirty-eight screens are
specified and eight page routes exist. `(vault)/page.tsx` almost certainly hosts several screens as
internal states, so the built count is higher than eight and lower than thirty-eight, and **nobody
can currently say what it is.** `49-BUILD-STATUS-AUDIT.md` is where that gets resolved, and until it
does, **this pack is mostly a specification for work not yet done.** Treat every screen file as a
thing to build, not a thing to maintain.

## The map

Band | What it answers | Files
`00`-`09` | What is this, who is it for, what do the words mean | Orient
`10`-`19` | **What exactly gets built** | Specify
`20`-`29` | How it is built | Engineer
`30`-`39` | How it is configured, shipped and repaired | Run
`40`-`49` | What is wrong with it and how we would know | Judge
`50`-`59` | What to build, what to charge, what we may claim | Steer
`60`-`69` | How the pack points at itself and stays alive | Trace and meta

**Numbers are stable. File names are the navigation.** A number is never reused and never
renumbered; a new file takes a free slot in its band, and there are free slots in every band on
purpose.

## Routing, by what you are trying to do

I want to | Read
Understand the product at all | `01`, then `02`
Build a screen | `11-SCREEN-INDEX.md`, then `12-screens/SNN.md`, then `14`, `16`, `17`
Know what a word means | `03-GLOSSARY.md`
Know whether something is built | `49-BUILD-STATUS-AUDIT.md`
Touch the editor engine | `25-ENGINE-SPEC.md` and `26-ENGINE-REFUSAL-CATALOGUE.md`. **Read both before writing a line.**
Touch anything that calls a model | `27-MODEL-ROUTING-SPEC.md`
Change a limit or a price | `53-PRICING-AND-ENTITLEMENTS.md` and `28-CONFIGURATION-PANEL-SPEC.md`
Deploy | `32-DEPLOYMENT-AND-OPS.md`. **The two Vercel homes are a real trap.**
Fix something broken | `33-RUNBOOK.md`
Add a document to this pack | `65-CONVENTIONS.md` and `62-DOC-SCHEMA.md`
Hand this to another tool or account | `64-PORTABILITY-AND-HANDOVER.md`
Know what is still undecided | `56-OPEN-DECISIONS.md`

## The four rules that override everything in this pack

Taken from `AGENTS.md` at the repository root, which is authoritative and shorter.

1. **Red proof before green.** A test on a rare fault proves nothing until it fails against the
   unfixed code. If you cannot make it fail, say the test does not cover the bug rather than
   reporting a pass.
2. **Refuse rather than guess.** Returning the input unchanged is a correct outcome for this
   product. Guessing is not. This is the whole differentiation.
3. **Re-derive every number at write time.** Twenty numbers have already gone stale in this
   repository because somebody carried one forward.
4. **Agents propose, the founder merges.** Capture `git rev-parse HEAD` before and after any agent
   run and reconcile the delta. The instruction not to commit is advisory. The reconciliation is
   the gate.

## Gates

Nothing is done until these are green. Run them before any commit.

```bash
npm run verify     # typecheck, lint, test, build, arch, spec
npm run corpus     # 8,513 byte-pinned files, exits 1 on one changed byte
python3 docs/pack/tools/validate-pack.py                       # this pack's own contract
python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <f> --strict   # the writing gate
```

## Canonical, and what is not

**Canonical.** This pack, plus `AGENTS.md`, `CLAUDE.md`, `docs/mvp0/PRODUCT-PLAN.md` revision 6,
`docs/mvp0/SCREENS.md`, and `docs/mvp0/SCREEN-CHANGES-2026-09-18.md`.

**Newer than the plan where they disagree:** `SCREEN-CHANGES-2026-09-18.md`, because it is the
founders' review of 18 September and its section 10 carries decisions taken that day.

**Archive. Read for history, never cite as current.** Everything under `docs/research/`, the
earlier plan revisions, `docs/PRODUCT-BRIEF.md`, and the large records. An archive is never
freshness-reviewed, because editing it destroys the only copy of what was believed at the time.

**Never open these with Read.** `docs/FRONTMATTER-PRD-v2-2026-08-29.md` is 760 KB,
`docs/FRONTMATTER-RECORD.md` is 2.1 MB, and `ENGINE.md`, `CRITIQUE.md` and `DEV-PLAN.md` are each
around 250 KB. Use `grep -n` for the term, then `sed -n 'START,ENDp'`. One Read of any of them blows
the context window.

## What this pack does not contain

- **Any secret.** Variables are named. Values are never written, and no `.env` file is ever opened.
- **Any evidence from a real user.** There is none yet, and `05-USER-EVIDENCE.md` says so as a dated
  empty state rather than pretending otherwise.
- **Any claim that something is built when it is not.** Where that is unclear, the file says it is
  unclear and names the check that would settle it.
