---
id: 01-EXECUTIVE-SUMMARY
title: Executive summary
mode: explanation
tier: canonical
status: draft
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [product, state-of-build, open-decisions]
---

# 01. Executive summary

**Read this first. It is the whole product in ten minutes, and it is deliberately unflattering
about how much of the product exists.**

## 1. The honest ratio, before anything else

Every number in this section was measured on 2026-09-18 in the session that wrote the file. The
command is printed beside each one so a stranger can re-run it `[O]`.

Measure | Value | Command
Screens specified | **38** | `grep -cE '^### S[0-9]{2}\.' docs/mvp0/SCREENS.md`
Page routes built | **8** | `find src/app -name 'page.tsx' \| wc -l`
API route handlers built | **26** | `find src/app -name 'route.ts' \| wc -l`
Module source files | **171** | `find src/modules -type f \( -name '*.ts' -o -name '*.tsx' \) \| wc -l`
Module files governed by a spec | **2 of 171** | `npm run spec`
Specs written | **4**, all at `state: draft` | `npm run spec`
Tests | **1,598 pass, 6 expected fail, 100 files** | `npm run test`
Foreign corpus | **8,513 of 8,513 byte-identical** | `npm run corpus`
Decision cards in `decisions/v2` | **275**, 0 errors, 5 warnings | `python3 decisions/tools/validate.py decisions/v2`
Commits ahead of `origin/main` | **203** at 07:20, and rising | `git rev-list --count origin/main..HEAD`
Date of the `origin/main` tip | **2026-07-25** | `git log -1 --format='%ci' origin/main`

**The eight page routes are not eight of the thirty-eight screens.** They are the login page, the
vault, four public legal pages and two public reader routes. The full list:

```
src/app/(auth)/login/page.tsx
src/app/(public)/[slug]/page.tsx
src/app/(public)/p/[slug]/page.tsx
src/app/(public)/pricing/page.tsx
src/app/(public)/privacy/page.tsx
src/app/(public)/refunds/page.tsx
src/app/(public)/terms/page.tsx
src/app/(vault)/page.tsx
```

**So: the pack is a specification for work not yet done.** The editor, the vault and the AI verbs
run. Doc mode, Idea mode, the change queue, sharing by role, publishing, import, offline and the
configuration panel are specified and not built.

## 2. What the product is

**frontmatter is a markdown editor for people whose documents are increasingly written with, and
for, AI agents.** Studio Zephyrus. One source tree serving a web app and a Tauri v2 desktop build.

Three things are load-bearing, and everything else in the pack derives from them.

Law | What it means | Why it exists
**The projection law** | The file on disk is the only source of truth. Every view is a deterministic, stateless projection of it | A view that holds state the file does not hold is a second source of truth, and the two drift
**Splice-only writing** | The engine locates a byte range and replaces exactly those bytes. It never rewrites a whole file, and it refuses when a range is ambiguous | Returning the input unchanged is a correct outcome. Guessing is not
**The change queue** | Every change by a person, an AI edit or an agent enters a queue where the owner accepts or rejects it one by one | No silent merge, ever

**What it is not**, decided and recorded at `docs/mvp0/PRODUCT-PLAN.md` section 1.

- **Not a new format.** The verdict is to build a compiler and an editor.
- **Not a plugin platform** in year one. An API and an MCP server sit in Later instead.
- **Not a chat app** with a document attached.

## 3. Who pays

The plan names three audiences at `docs/mvp0/PRODUCT-PLAN.md` section 1, and then says plainly which one
the evidence supports.

Audience | The job they hire it for | Proven to pay?
Founders, product people and developers who brief agents | Turn an idea into a brief an agent can build from | No
Writers who want Google Docs comfort over markdown files | Write without seeing syntax, keep a plain file | No
Obsidian and Notion people who want their notes on the web | Reach their vault from a browser, share it, let an agent read it | **The only group the audit reads as proven**

**The plan's own words, at `docs/mvp0/PRODUCT-PLAN.md` section 1:** "The audit's reading of the evidence
is that only the third group is proven to pay today." The pilot recruits ten of them out of twenty.

**The price.** Free at zero. Pro at ₹299 a month or ₹2,499 a year, both GST inclusive, which the
plan puts at about $3.12. Top-ups are 50 edits for ₹99 and 3 blueprints for ₹149. Team, Max and
Enterprise are named as later and unpriced.

**No price has been tested with a person.** See section 6 and `05-USER-EVIDENCE.md`.

## 4. What exists today

Measured against the working tree at commit `0af3c90` on branch `audit-response/2026-09-17` `[O]`.

Capability | State | Evidence
Markdown editing, vault tree, tabs, preview | **built** | `src/modules/editor`, `src/modules/vault`, `src/modules/preview`
GitHub sign-in through Auth.js | **built** | `src/app/api/auth/[...nextauth]/route.ts`, `src/auth.ts`
Google sign-in through Firebase Auth | **built** | `NEXT_PUBLIC_FIREBASE_*` in `src/config/env.ts`
Six AI verbs over HTTP | **built** | `src/app/api/ai/` holds complete, generate-doc, link-doctor, refine, suggest-links, summarize
Vault file operations | **built** | sixteen handlers under `src/app/api/vault/`
Share links and conflict listing | **partly built** | `src/app/api/share/route.ts`, `src/app/api/share/conflicts/route.ts`
Front matter splice on share | **built** | `src/modules/share/domain/splice-frontmatter.ts`
PDF and vault export | **built** | `src/app/api/export/`
Public legal pages | **built on the branch, not on the deployment** | see section 7
Byte-exact foreign corpus gate | **built and green** | `npm run corpus`
Change queue | **specified, not built** | `grep -ril "change.queue\|changeQueue" src/` returns nothing
Doc mode | **specified, not built** | `docs/mvp0/PRODUCT-PLAN.md` section 7
Idea mode, blueprint, kit, kickoff prompt | **specified, not built** | `docs/mvp0/PRODUCT-PLAN.md` section 9
Roles and the permission matrix | **specified, not built** | `docs/mvp0/PRODUCT-PLAN.md` section 19
Live collaboration on Durable Objects | **specified, not built** | `docs/mvp0/PRODUCT-PLAN.md` section 15
The configuration panel, S35 to S38 | **specified, not built** | `docs/mvp0/PRODUCT-PLAN.md` section 30
R2 for bytes | **specified, not built** | no R2 client in `src/`
Razorpay and billing | **specified, not built** | no payment code in `src/`
MCP server and public API | **named as Later** | `docs/mvp0/PRODUCT-PLAN.md` section 26

**Two named engine defects are open**, both measured and both fixed before any public claim.

- A column-zero list item in front matter refuses about 83 per cent of real vaults. Specified at
  `specs/engine/nf-001-zero-indent-sequence.md`.
- A trailing comment is deleted on a set. Specified at `specs/engine/nf-003-bare-cr-fence.md`.
- The independent audit of 17 September names a third, unlabelled defect. It has no spec file yet.

**No spec has reached `state: verified`.** All four are `draft`, and only the harness may write
`verified`, and only after a red proof exists.

## 5. What the build plan says happens next

Nine phases, in fixed time with variable scope, at `docs/mvp0/PRODUCT-PLAN.md` section 26.

Phase | Appetite | The headline
Phase 0 · Before code | 2 weeks | Legal floor, accounts moved, format specs drafted, twenty hand-made kits for twenty people outside the studio
A · The door and the home | 3 weeks | Firestore and R2 adapters, entitlements, the usage ledger, the configuration panel
B · The editor, plus Doc mode | 4 weeks | The engine defects fixed with red proofs, Doc mode, the AI box on the free model chain
C · Ideas | 4 weeks | Low depth, the fifteen-file blueprint, the unlisted link, the kickoff prompt
D · Sharing | 3 weeks | Roles, expiring links, published pages, **the change queue**, history
E · In and out | 3 weeks | Folder upload, Obsidian and Notion import, the GitHub App, Drive sync
F · Everywhere | 3 weeks | Offline, the desktop app, phone layouts, quick capture, dark mode
G · Views and blocks | 3 weeks | Flow, slides, mind map, Excalidraw, Mermaid, KaTeX, templates
H · Pro | 2 weeks | Razorpay, Medium and High depth, Claude routing, password links

**Twenty-seven weeks of appetite at full time.** The audit recomputed the measured pace at 0.93 to
1.21 days a week, which is 99 to 129 calendar weeks. That gap is founder question 1.

## 6. What is unresolved

The plan's own list is eighteen questions at `docs/mvp0/PRODUCT-PLAN.md` section 29. Revision 6 moved
eleven of them into the configuration panel. The founder review of 18 September then confirmed the
panel ships with hardcoded defaults, so all eleven become rows with a default rather than blockers.

**Seven that a setting cannot hold**, listed at `docs/mvp0/PRODUCT-PLAN.md` section 29.

Q | Question | Why a setting cannot hold it | Where it stands
Q1 | The pace, and which phases are Later | It decides which phases exist at all | **Open.** Default is phases 0, A, B, D and H at the measured pace
Q5 | K1, the one-sentence definition | It decides build order | **Deferred on purpose** to the build, with a default sentence in use
Q6 | K2, which bytes we hold, and from which phase | It is an architecture, not a value | **Open.** Blocks the shape of phase A
Q7 | K3, the name | It changes the domain and every published URL | **Open.** A trademark search is due before Razorpay goes live
Q11 | The desktop's timing, and who signs Windows | It reorders phases E and F | **Open**
Q13 | The accounts that move to the company | It is ownership, not configuration | **Open.** See `08-ECOSYSTEM.md`
Q14 | The twenty-kit gate | It is a gate on phase C, not a switch | **Open.** Phase 0 exists to run it

**Eleven the panel absorbs**, each now a row with a default: the Pro price and model routing, the
free provider chain, the free caps, the age floor's number, the pilot thresholds, the grievance
officer's name, the indexing default, and the four feature flags.

**Three deferred on purpose**, at `docs/mvp0/PRODUCT-PLAN.md` section 29: the tagline, the positioning
and the product-market read. The stated reason is that twenty people using the thing answers them
better than another research round.

**Two the founder review of 18 September reopened**, recorded in
`docs/mvp0/SCREEN-CHANGES-2026-09-18.md`.

- **Live collaborators on Free falls from three to one**, on cost. Section 13 of the plan still
  carried three when it was written, and the review says the two must agree.
- **S09 flow view is deferred.** It stays in the screen set and leaves the near build.

## 7. Where the sources disagree

The brief for this pack says to name a disagreement rather than pick a side silently. Six are live
today. Each was checked in this session.

**A note on how this pack cites the plan.** `docs/mvp0/PRODUCT-PLAN.md` was edited by another
writer while this pack was being written, at 07:08 on 2026-09-18, which moved every line after
section 14 by twelve. So the pack cites the plan **by section number**, which does not rot, and
keeps `file:line` only for files nobody is editing. Three citations in the first draft of this file
were wrong for exactly that reason and were re-derived before it was saved `[O]`.

Ref | The disagreement | How it was checked
X1 | **The plan's data model says `Postgres rows` while the stack decision says Firestore.** Revision 6 chose Firestore on 17 September; section 18's entity table still names Postgres in eleven rows | `grep -c 'Postgres row' docs/mvp0/PRODUCT-PLAN.md`
X2 | **The four public legal pages serve on the branch and 307 to `/login` on the deployment.** The plan says placeholder pages "serve on this branch", which is true. The live apex still redirects | `curl -sI https://frontmatter.in/privacy` returns `HTTP/2 307`, `location: /login`. The same for `/terms`, `/pricing` and `/refunds`
X3 | **The `GITHUB_REPO` default is listed as phase 0 work and is already fixed.** The plan puts it in phase 0 at line 1656; the code already refuses to boot without it | `sed -n '85,91p' src/config/env.ts`
X4 | **The decision-card count.** Plan revision 6 records 210 cards. The validator counts 275 today | `python3 decisions/tools/validate.py decisions/v2` prints `275 cards · 0 errors · 5 warnings`
X5 | **`decisions/questions.js` is older than its sources.** The generated file is dated 2026-09-15 and carries 213 id keys, against 275 in the sources | `ls -la decisions/questions.js`
X6 | **The AGENTS.md adoption figure is stale by roughly nine times.** The plan says "over 60,000 projects"; GitHub's own code-search count, which the API states is approximate, is about 547,840 files at repository root | `docs/research/2026-09-18/raw/Z-measured-by-me.md`

## 8. The three claims that changed this week

The research round of 18 September contradicted three things the product has been saying. Each is
carried in full in `07-CLAIMS-REGISTER.md`.

- **The change queue is not novel.** Google Docs ships per-change accept, accept all and reject all
  for Gemini edits, quoted from Google's own help page. The defensible claim is narrower.
- **We are not first to review markdown prose.** CodeRabbit has run prose review on changed `.md`
  files since March 2024, and added Vale on 24 August 2026. The gap is the workflow, not the
  capability.
- **Almanac did not shut down because read receipts failed.** Its own farewell page gives a
  different reason. Our record cites a cause the source does not state.

## 9. The one sentence a stranger needs

**The free tools took "an agent can edit your markdown". The paid tools took "ask your documents a
question". The step in between, a person saying yes to a machine edit, is the only ground in this
market that nobody has built and somebody has measured demand for.** The measurement is Mintlify's
2026 State of Knowledge Report, published 2026-09-16 from 329 respondents: 83 per cent say agents
now draft documentation for their team, and only 9 per cent let agents publish without review.

## 10. Where to go next

You want | Read
Why a byte-exact editor exists, in a non-developer's language | `02-PRODUCT-AND-DOMAIN.md`
A term you do not recognise | `03-GLOSSARY.md`
Who the readers are and what each one wants | `04-PERSONAS-AND-JOBS.md`
What a real user has said | `05-USER-EVIDENCE.md`, which is an empty state today
Who else is in this market | `06-COMPETITIVE-LANDSCAPE.md`
What we may and may not say in public | `07-CLAIMS-REGISTER.md`
Repositories, teams, domains and the two-Vercel-homes trap | `08-ECOSYSTEM.md`
What changed and when | `09-CHANGELOG.md`
The plan of record, 31 sections | `docs/mvp0/PRODUCT-PLAN.md`
The 38 screens | `docs/mvp0/SCREENS.md`

## 11. The limits of this file

**What was not assessed.** Code quality, security, accessibility and performance. None of the four
has been audited by anyone, and the plan says so at `docs/mvp0/PRODUCT-PLAN.md` section 2.

**What could not be verified.** Whether `frontmatter.in` is served from `main` was taken from
`AGENTS.md` section 7 and not confirmed against the Vercel project settings, because doing so needs
a token this file does not use. UNVERIFIED: the causal link between the stale `main` tip and the
four redirecting legal routes is an inference from those two facts.

**What is not established.** That anyone will pay. No customer has been interviewed, no prototype
tested and no price tested.

**What would falsify this summary.** A pilot in which fewer than four of twenty people are active
in week two, or fewer than two of ten kit recipients run the kickoff, or fewer than three of twenty
name the problem the product solves without being prompted. Those three stop lines are the plan's
own, at `docs/mvp0/PRODUCT-PLAN.md` section 28.
