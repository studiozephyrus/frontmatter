---
id: 09-CHANGELOG
title: Changelog
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [changelog, decision-history]
---

# 09. Changelog

**What changed in this pack and in the plan, newest first.** Every entry names its evidence and what
was deliberately not done, because a change record that only lists what was done hides the decision
that mattered.

## 1. How to read an entry

Each entry carries four things. An entry missing the fourth is not finished.

Part | What it holds
When | The date, and the time where two changes on one day disagree
What changed | One sentence, in the past tense
Evidence | The commit, the file or the command. Never "as discussed"
Deliberately not done | What was considered and left out, and why

**Dates are ISO and times are IST.** The repository's commit times are IST.

## 2. 2026-09-18, the documentation pack

### 2.1 The pack was created

**What changed.** A documentation pack was started under `docs/pack/`, with a front matter contract,
a conventions page and a validator.

**Evidence.**

Commit | Time | What it carried
`6271499` | 06:58 | The foundation, the contract and the validator
`f237ece` | 07:13 | 57 files, and the validator green
Uncommitted | 07:00 to 07:16 | The ORIENT band, files 01 to 09, written against this record

**State at 07:16**, measured with `python3 docs/pack/tools/validate-pack.py` `[O]`: **67 files, 154
covered ids, 2 problems**.

The pack is still being written, so re-run the command rather than quoting those numbers. Neither
open problem is in the ORIENT band. Both are two-homes clashes, over the ids `onboarding` and
`retention`.

**Deliberately not done.** The pack does not restate the plan. `docs/mvp0/PRODUCT-PLAN.md` stays the
plan of record, and the pack links to it rather than copying it, because a copy is a second source
of truth that drifts.

**Two ids were handed to their proper homes** when later files claimed them. `08-ECOSYSTEM.md` gave
up `domains` to `32-DEPLOYMENT-AND-OPS.md` and kept `domain-ownership`. `02-PRODUCT-AND-DOMAIN.md`
gave up `splice` and `projection-law` to `25-ENGINE-SPEC.md` and now says on its own first page that
the specification wins where the two disagree.

### 2.2 The pack cites the plan by section, not by line

**What changed.** Every citation into `docs/mvp0/PRODUCT-PLAN.md` in files 01 to 09 is a section
number. Line citations are kept only for files nobody is editing.

**Evidence.** The plan was edited at 07:08 by commit `e532e32`, which added twelve lines inside
section 14 and moved every line after it. Three citations written before 07:08 were wrong by 07:10,
and all were re-derived before the files were saved `[O]`.

**Deliberately not done.** `65-CONVENTIONS.md` section 4 was not changed to make this the rule for
the whole pack. That is a convention change, and conventions belong to whoever owns that file.

### 2.3 Eight findings the ORIENT band turned up

Each was checked in the session that recorded it, with the command shown.

Ref | Finding | How it was checked
F01 | **The four public legal routes still redirect to `/login` on the live apex.** The pages exist on the branch | `curl -sI https://frontmatter.in/privacy` returns `HTTP/2 307`, and the same for `/terms`, `/pricing`, `/refunds`
F02 | **The plan's data model names `Postgres rows` while the stack decision is Firestore.** Revision 6 chose Firestore on 17 September and section 18 was not updated | `grep -c 'Postgres row' docs/mvp0/PRODUCT-PLAN.md`
F03 | **The decision cards number 275, not 210.** The plan's revision 6 correction is behind the sources | `python3 decisions/tools/validate.py decisions/v2` prints `275 cards · 0 errors · 5 warnings`
F04 | **`decisions/questions.js` is older than its sources**, dated 2026-09-15 and carrying 213 id keys | `ls -la decisions/questions.js`
F05 | **The `GITHUB_REPO` default is already fixed** and the plan still lists it as phase 0 work | `sed -n '85,91p' src/config/env.ts`
F06 | **The working tree's `.vercel/project.json` points the app project name at the decisions team.** Gitignored, so local state rather than a committed defect | `cat .vercel/project.json`, `git ls-files .vercel`
F07 | **`ALLOWED_GH_LOGIN` defaults to one login.** A deployment left at the default admits exactly one person | `src/config/env.ts:47`, `src/modules/auth/infrastructure/auth-options.ts:82`
F08 | **The plan's AGENTS.md adoption figure is stale by roughly nine times** | `docs/research/2026-09-18/raw/Z-measured-by-me.md`

**Deliberately not done.** None of the eight was fixed. The ORIENT band is read-only outside its own
nine files, and a fix to the plan, to `CLAUDE.md` or to `src/` belongs to the owner of that file.

### 2.4 One error was made and corrected inside the band

**What changed.** The first draft of `03-GLOSSARY.md` recorded "degradation certificate" as a
coinage of this pack's, with no definition behind it.

**Evidence that it was wrong.** The term is defined in `docs/FRONTMATTER-PRD-v2-2026-08-29.md:5075`
as "Measured proof of how a file renders across real markdown engines", and carries a sidecar schema
`mdmax/cert@1` at line 2814 of the same file.

**What the entry says now.** The definition, plus the narrower true statement: nothing in the
repository emits one, because `mdmax cert` is not among the 26 npm scripts.

**Deliberately not done.** The `mdmax cert` gap was not opened as a defect anywhere. `CLAUDE.md`
already records it.

### 2.5 A rule conflict was resolved without altering a quotation

**What changed.** Two quotations in `02-PRODUCT-AND-DOMAIN.md` and `06-COMPETITIVE-LANDSCAPE.md`
are now split at the point where their source carries a long dash. Each side is quoted exactly, and
the break is declared on the page.

**Why.** Two rules collided. `docs/pack/tools/validate-pack.py` treats any long dash in a pack file
as a problem. The repository forbids altering a quotation, and a research pass on 2026-09-09
already put paraphrases inside quotation marks here once.

**Evidence that the first draft broke the second rule.** The drafts of those two files had replaced
the source's long dash with a plain hyphen inside three block quotations, silently. It was found by
comparing the quoted strings byte for byte against
`docs/research/2026-09-18/raw/H-2026-launches.md` `[O]`.

**Deliberately not done.** The dash was not kept and the validator was not changed. Quoting each
side exactly and declaring the break satisfies both rules and loses no evidence, which neither of
the other two options does.

## 3. 2026-09-18, the product

### 3.1 The founders' screen review, and the five answers

**What changed.** The founders reviewed the 38 screens at about 06:00 and the review was captured as
a register rather than applied silently. Five questions were asked back and all five were answered
the same day.

**Evidence.** `docs/mvp0/SCREEN-CHANGES-2026-09-18.md`, commits `e844f0b` at 06:08 and `92aa47a` at
06:34.

**The five answers**, from section 10.1 of that register.

Q | Question | The answer
A1 | Were the two toggles meant for the problems panel or only for review | **Both, and everywhere.** Wherever human and AI work sit together, split them with a toggle. Stated as a general rule, on cognitive load
A2 | Where do Ideas live | **A bottom tab in the workspace.** Notes expanded, Ideas collapsed. This removes the separate route into ideas
A3 | Keep the one-file instruction health panel, against the research | **Follow the research.** S11 becomes the whole instruction-file set
A4 | Confirm one live collaborator on Free | **Confirmed, on cost.** A live session holds a Durable Object open, which is the one free-tier cost that scales with time rather than calls
A5 | Defer the configuration panel and answer eleven questions now | **Ship the panel, with hardcoded defaults.** The eleven become rows with a default

**Deliberately not done.** The founder's first instruction was to defer the configuration panel. The
register showed the consequence, which is that eleven of the eighteen founder questions come back
as values needing answers before phase A, and the instruction was reversed the same morning. **The
reversal is the entry, not a footnote.**

### 3.2 Two decisions handed back, and their reasoning

**S18, decided content first, invitation second.** The published page renders immediately with no
gate, no redirect and no probe before first paint. `page.md` and `llms.txt` are never gated, never
redirected and never given an interstitial, and that rule is absolute. A quiet dismissible bar
offers the app after first paint. **The gate belongs on editing, not on reading.**

**Evidence.** In August 2026 agents made 257 million requests against 131 million human page loads
on comparable sites, and 83 per cent of agent traffic arrives by the markdown route. An
app-detection gate is invisible to every one of those readers.

**Dynamic questions, decided dynamic for everyone, bounded.** The whole question set is generated
once, each question carries a branching flag, and only a branching answer rewrites the later pages.
Rewrites are capped at three per blueprint on Free.

**Evidence.** It was costed rather than guessed: three tenths of a cent per blueprint, or about
₹3.51 a month more across 200 free users at three regenerations.

**Deliberately not done.** Dynamic questioning was **not** made a Pro feature. The stated reason is
that the free product is the funnel, and a paywall there would make the free product ask worse
questions.

### 3.3 Other changes the same morning

Commit | Time | What changed | Deliberately not done
`567b6f2` | 06:43 | Idea mode rebuilt as one column | The three depths did not become three routes. They read like a model selector, and Medium and High keep Low's interface
`6e282a6` | 06:39 | Review toggles, and S11 became the instruction-file set | S09, the flow view, was **deferred**. It stays in the screen set and leaves the near build
`3bdaaa8` | 06:38 | The founder review applied, first batch | Shortcuts were removed from the workspace rather than moved
`16855f2` | 05:48 | The research round, 178 findings across nine branches | The round opened no page on Product Hunt, and the Y Combinator directory returned nothing. Both gaps are recorded in the research file itself
`a242831` | 05:44 | What the market asks for that plan v6 does not have | Nothing from that list was added to the plan the same day

## 4. 2026-09-17, the plan reached revision 6

**What changed.** Two founder decisions, taken after revision 5 was read end to end.

Decision | What it settled
The stack | Next.js with Cloudflare R2 and Firestore, not Supabase. The cheaper of the two costed rows, and what the shipped code already runs, so phase A stops being a migration
Tier contents | Set from a configuration panel, not from constants in the source. Eleven of the eighteen founder questions become rows in a table

**Evidence.** `ba437d7` at 18:12, and the plan's own section 0.

**Two consequences recorded in the same revision.** The fixed monthly cost fell from $54.50 to
$29.50, and the audit's proposal to delete `firestore.rules` was withdrawn, because that file became
live work.

**Deliberately not done.** The structural objections revision 5 raised against Firestore were **not**
dropped. They are carried as build constraints in sections 15 and 18, and explicitly not as
arguments to reopen the decision.

**Deliberately deferred.** The tagline, the positioning and the product-market read, on the stated
reasoning that twenty people using the thing answers them better than another research round.

## 5. 2026-09-17, the earlier changes

Commit | Time | What changed | Deliberately not done
`0f88b93` | 22:54 | The final screens for print, plus the tools that make and check them | The tools were committed with the output, so a regenerated file has a generator
`604825b` | 18:25 | The product guide, one printable document | Its generator was lost earlier, so the guide is hand-maintained
`99d2ee7` | 15:15 | A second decisions site, holding just the eighteen founder questions | The 275-card site was not replaced
`bb11f5f` | 14:30 | The eighteen founder decisions as multiple choice, each with the revision 5 default | No default was presented as a decision
`2f1aebb` | 13:46 | The audit response report and the final ledger, every finding checked | No finding was closed without being checked that day
`aee49d4` | 13:43 | **`CLAUDE.md` names the change queue instead of review state** | The reason given for dropping review state was **not** re-checked, and it turned out to be wrong. See section 6
`90cb703` | 13:43 | The icon component reads no environment variable, so the architecture gate is green | |
`f6b4466` | 13:43 | Screens v5, four new states, contrast tokens, the toolbar fits at 1440 | |

## 6. The corrections owed, and not yet made

**These are changes the evidence requires and nobody has made.** Each has a home in
`07-CLAIMS-REGISTER.md` section 6.

Id | What is wrong | Where | Owner
CL401 | `CLAUDE.md` says review state was dropped partly because Almanac "shipped the same read receipts and shut down". Almanac's own farewell page gives a different reason | `CLAUDE.md` | The owner of `CLAUDE.md`
CL402 | The AGENTS.md adoption figure is stale by roughly nine times | The plan, section 2 | The plan's owner
CL403 | The decision-card count says 210 and the validator says 275 | The plan, section 0 | The plan's owner
CL404 | The legal floor says placeholder pages serve. True of the branch, false of the deployment | The plan, section 23 | The plan's owner
CL405 | The `GITHUB_REPO` default fix is listed as phase 0 work and is already done | The plan, section 26 | The plan's owner

**Two older debts, both still open.**

- **The written rebuttal to Zed Delta is owed**, recorded in `CLAUDE.md` and due before phase D. As
  of 2026-09-18 it now owes a second name, because OpenKnowledge is a second public CRDT bet.
- **The Model Context Protocol server sits in the Later column**, and the research of 18 September
  argues by the plan's own rule that it belongs in the build. Nobody has moved it or written down
  why not.

## 7. The limits of this file

**What was not assessed.** Anything before 2026-09-17. The record of the 9 September decisions site,
the 13 September product reset and the 29 August technical plan lives in `docs/GAPS-2026-09-08.md`,
`docs/research/2026-09-09/` and `docs/FRONTMATTER-PRD-v2-2026-08-29.md`, and none was read in full
for this file.

**What could not be verified.** The commit times are the repository's own and were not checked
against an independent clock. The claim that `main` is the deploying branch is taken from
`AGENTS.md` section 7.

**What is not established.** That any entry here is complete. A changelog is only as good as the
habit behind it, and this is the first one.

**What would falsify this file.** A commit between 2026-09-17 and 2026-09-18 that is not in section
4 or 5. Check with `git log --oneline --since=2026-09-17` and add the missing row.
