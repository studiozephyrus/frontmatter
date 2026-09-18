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

## Can development start? Yes, from batch 1. Decided 18 September 2026

**The green signal is given.** The four founder answers the build was waiting on were given on 18
September and are recorded in `56-OPEN-DECISIONS.md` section 0:

Decision | Answer `[Z]`
`D01` the product | The broad markdown editor for the agentic era. Internal name `fmd`, which stands for nothing
`D02` the pace | Everything, in batches, each used internally before the next. The order is `50-ROADMAP.md`
`D03` storage | Our copy canonical; the person's GitHub or Drive a full mirror; a soft cap over storage limits
`D10` accounts | All of them move to the company before the first stranger

**Before development: the founder reviews `review/00-FOUNDER-REVIEW.md`**, one generated file over every
open point, with the 44 that need him at the top. Every other open point is resolved as a proposal
and marked `resolved (proposed 18 Sep, founder review)` where it sits. D04 to D14 were answered too.

**Then start with batch 1 in `50-ROADMAP.md` section 3.1**, which is work before code: accounts, the legal
floor, the public pages, format specifications and twenty hand-made blueprints.

What was green when this was written, each re-run on 18 September:

- `python3 docs/pack/tools/validate-pack.py` prints `problems: 0`.
- `npm run verify` exits 0: typecheck, lint, 1,598 tests with 6 expected failures, build, arch, spec.
- Every pack file passes `gate.py --strict`.
- All 38 screens are specified here and drawn in `docs/mvp0/`, newest PDF first by its date.

Still open, none blocking batch 1: `D11` runs as an A/B test (`28-CONFIGURATION-PANEL-SPEC.md`); the
tagline is tested three ways first (`docs/research/2026-09-18-name/`); 152 copy strings marked
`proposed` in `16-COPY-DECK.md` await the founders.

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

## Every file

<!-- INDEX:START -->

**Generated by `tools/gen-index.py`. Do not edit between the markers.**

### 00 to 09. Orient

File | What it is | Mode | Tier | Status
[00-README.md](00-README.md) | Start here. | reference | canonical | living
[01-EXECUTIVE-SUMMARY.md](01-EXECUTIVE-SUMMARY.md) | Executive summary. | explanation | canonical | draft
[02-PRODUCT-AND-DOMAIN.md](02-PRODUCT-AND-DOMAIN.md) | The product and its domain. | explanation | canonical | draft
[03-GLOSSARY.md](03-GLOSSARY.md) | Glossary. | reference | canonical | living
[04-PERSONAS-AND-JOBS.md](04-PERSONAS-AND-JOBS.md) | Personas and jobs. | explanation | canonical | draft
[05-USER-EVIDENCE.md](05-USER-EVIDENCE.md) | User evidence. | reference | canonical | living
[06-COMPETITIVE-LANDSCAPE.md](06-COMPETITIVE-LANDSCAPE.md) | Competitive landscape. | reference | canonical | living
[07-CLAIMS-REGISTER.md](07-CLAIMS-REGISTER.md) | Claims register. | reference | canonical | living
[08-ECOSYSTEM.md](08-ECOSYSTEM.md) | Ecosystem. | reference | canonical | living
[09-CHANGELOG.md](09-CHANGELOG.md) | Changelog. | reference | canonical | living

### 10 to 19. Specify

File | What it is | Mode | Tier | Status
[10-FEATURE-REGISTER.md](10-FEATURE-REGISTER.md) | Feature register. | reference | canonical | living
[11-SCREEN-INDEX.md](11-SCREEN-INDEX.md) | Screen index. | reference | canonical | living
[13-SCREEN-STATE-MATRIX.md](13-SCREEN-STATE-MATRIX.md) | Screen state matrix. | reference | canonical | living
[14-COMPONENT-INVENTORY.md](14-COMPONENT-INVENTORY.md) | Component inventory. | reference | canonical | living
[15-INTERACTION-AND-KEYBOARD.md](15-INTERACTION-AND-KEYBOARD.md) | Interaction and keyboard. | reference | canonical | living
[16-COPY-DECK.md](16-COPY-DECK.md) | Copy deck. | reference | canonical | living
[17-ERROR-AND-REFUSAL-CATALOGUE.md](17-ERROR-AND-REFUSAL-CATALOGUE.md) | Error and refusal catalogue. | reference | canonical | living
[18-FIRST-RUN-AND-EMPTY.md](18-FIRST-RUN-AND-EMPTY.md) | First run and empty states. | how-to | canonical | living
[19-ACCEPTANCE-CRITERIA.md](19-ACCEPTANCE-CRITERIA.md) | Acceptance criteria. | reference | canonical | living
[12-screens/](12-screens/S01.md) | One specification per screen, S01 to S38, 38 files. | reference | canonical | specified

### 20 to 29. Engineer

File | What it is | Mode | Tier | Status
[20-ARCHITECTURE.md](20-ARCHITECTURE.md) | Architecture. | explanation | canonical | living
[21-DATA-MODEL.md](21-DATA-MODEL.md) | Data model. | reference | canonical | living
[22-API-REFERENCE.md](22-API-REFERENCE.md) | API reference. | reference | derived | living
[23-WEB-APP-SPEC.md](23-WEB-APP-SPEC.md) | Web app specification. | reference | canonical | living
[24-SERVER-SPEC.md](24-SERVER-SPEC.md) | Server specification. | reference | canonical | living
[25-ENGINE-SPEC.md](25-ENGINE-SPEC.md) | Engine specification. | reference | canonical | living
[26-ENGINE-REFUSAL-CATALOGUE.md](26-ENGINE-REFUSAL-CATALOGUE.md) | Engine refusal catalogue. | reference | canonical | living
[27-MODEL-ROUTING-SPEC.md](27-MODEL-ROUTING-SPEC.md) | The model routing layer. | reference | canonical | living
[28-CONFIGURATION-PANEL-SPEC.md](28-CONFIGURATION-PANEL-SPEC.md) | The configuration panel. | reference | canonical | living
[29-PLATFORM-AND-DESKTOP-SPEC.md](29-PLATFORM-AND-DESKTOP-SPEC.md) | Platform, desktop and phone. | reference | canonical | living

### 30 to 39. Run

File | What it is | Mode | Tier | Status
[30-ENVIRONMENT-AND-CONFIG.md](30-ENVIRONMENT-AND-CONFIG.md) | Environment and configuration. | reference | canonical | living
[31-LOCAL-SETUP.md](31-LOCAL-SETUP.md) | Local setup. | tutorial | canonical | living
[32-DEPLOYMENT-AND-OPS.md](32-DEPLOYMENT-AND-OPS.md) | Deployment and operations. | how-to | canonical | living
[33-RUNBOOK.md](33-RUNBOOK.md) | Runbook. | how-to | canonical | living
[34-INTEGRATIONS.md](34-INTEGRATIONS.md) | Integrations. | reference | canonical | living
[35-RELEASE-AND-VERSIONING.md](35-RELEASE-AND-VERSIONING.md) | Release and versioning. | how-to | canonical | living
[36-DATA-MIGRATION-PLAN.md](36-DATA-MIGRATION-PLAN.md) | Data migration plan. | how-to | canonical | living
[37-BACKUP-AND-RECOVERY.md](37-BACKUP-AND-RECOVERY.md) | Backup and recovery. | how-to | canonical | living
[38-INCIDENT-AND-SEVERITY.md](38-INCIDENT-AND-SEVERITY.md) | Incident and severity. | how-to | canonical | living
[39-SHARING-A-BUILD.md](39-SHARING-A-BUILD.md) | Sharing a build. | how-to | canonical | living

### 40 to 49. Judge

File | What it is | Mode | Tier | Status
[40-TESTING-STRATEGY.md](40-TESTING-STRATEGY.md) | Testing strategy. | explanation | canonical | living
[41-FIXTURE-REGISTER.md](41-FIXTURE-REGISTER.md) | Fixture register. | reference | canonical | living
[42-SECURITY-REVIEW.md](42-SECURITY-REVIEW.md) | Security review. | explanation | canonical | living
[43-THREAT-MODEL.md](43-THREAT-MODEL.md) | Threat model. | explanation | canonical | living
[44-TECH-DEBT-REGISTER.md](44-TECH-DEBT-REGISTER.md) | Technical debt register. | explanation | canonical | living
[45-UX-AUDIT.md](45-UX-AUDIT.md) | Screens audit. | explanation | canonical | living
[46-ACCESSIBILITY-SPEC.md](46-ACCESSIBILITY-SPEC.md) | Accessibility specification. | reference | canonical | living
[47-PERFORMANCE-BUDGET.md](47-PERFORMANCE-BUDGET.md) | Performance budget. | reference | canonical | living
[48-PRODUCT-MATURITY.md](48-PRODUCT-MATURITY.md) | Product maturity. | explanation | canonical | living
[49-BUILD-STATUS-AUDIT.md](49-BUILD-STATUS-AUDIT.md) | Build status audit. | reference | canonical | living

### 50 to 59. Steer

File | What it is | Mode | Tier | Status
[50-ROADMAP.md](50-ROADMAP.md) | Roadmap. | explanation | canonical | living
[51-PRODUCT-PLAN.md](51-PRODUCT-PLAN.md) | Product plan. | explanation | canonical | living
[52-MARKET-RESEARCH.md](52-MARKET-RESEARCH.md) | Market research. | explanation | canonical | living
[53-PRICING-AND-ENTITLEMENTS.md](53-PRICING-AND-ENTITLEMENTS.md) | Pricing and entitlements. | reference | canonical | living
[54-COMPLIANCE-AND-LEGAL.md](54-COMPLIANCE-AND-LEGAL.md) | Compliance and legal. | reference | canonical | living
[55-MEASUREMENT-AND-EVENTS.md](55-MEASUREMENT-AND-EVENTS.md) | Measurement and events. | reference | canonical | living
[56-OPEN-DECISIONS.md](56-OPEN-DECISIONS.md) | Open decisions. | explanation | canonical | living
[57-SUPPORT-AND-LIFECYCLE.md](57-SUPPORT-AND-LIFECYCLE.md) | Support and lifecycle. | how-to | canonical | living
[58-DESIGN-SYSTEM.md](58-DESIGN-SYSTEM.md) | Design system. | reference | canonical | living
[59-CODEMAP.md](59-CODEMAP.md) | Codemap. | reference | derived | living

### 60 to 69. Trace and meta

File | What it is | Mode | Tier | Status
[60-TRACEABILITY.md](60-TRACEABILITY.md) | Traceability. | reference | canonical | living
[61-DOCUMENTATION-PRACTICE.md](61-DOCUMENTATION-PRACTICE.md) | Documentation practice. | explanation | canonical | living
[62-DOC-SCHEMA.md](62-DOC-SCHEMA.md) | The front matter contract. | reference | canonical | living
[63-AGENT-CONTRACT.md](63-AGENT-CONTRACT.md) | Agent contract. | reference | canonical | living
[64-PORTABILITY-AND-HANDOVER.md](64-PORTABILITY-AND-HANDOVER.md) | Portability and handover. | how-to | canonical | living
[65-CONVENTIONS.md](65-CONVENTIONS.md) | Conventions. | reference | canonical | living
[66-FORMAT-SPECIFICATIONS.md](66-FORMAT-SPECIFICATIONS.md) | Format specifications. | reference | canonical | draft
[67-SYNC-AND-CONFLICT.md](67-SYNC-AND-CONFLICT.md) | Sync and conflict. | reference | canonical | draft

### Decision records

File | What it is | Mode | Tier | Status
[adr/ADR-0001-compiler-not-format.md](adr/ADR-0001-compiler-not-format.md) | Build a compiler and an IDE, not a new markdown format. | explanation | canonical | decided
[adr/ADR-0002-render-carrier.md](adr/ADR-0002-render-carrier.md) | Callouts carry prose, fenced blocks carry opaque data. | explanation | canonical | decided
[adr/ADR-0003-sync-without-crdt.md](adr/ADR-0003-sync-without-crdt.md) | Sync is git-merge plus a splice journal plus compare-and-swap, never a CRDT. | explanation | canonical | decided
[adr/ADR-0004-r2-recovery-in-key-layout.md](adr/ADR-0004-r2-recovery-in-key-layout.md) | R2 has no object versioning, so recovery lives in the key layout. | explanation | canonical | decided
[adr/ADR-0005-inr-mandate-ceiling.md](adr/ADR-0005-inr-mandate-ceiling.md) | ₹15,000 a transaction is an architectural constant, and an Indian card gets one attempt. | explanation | canonical | decided
[adr/ADR-0006-projection-law-and-splice-only.md](adr/ADR-0006-projection-law-and-splice-only.md) | The projection law and splice-only writing, refuse rather than guess. | explanation | canonical | decided
[adr/ADR-0007-stack.md](adr/ADR-0007-stack.md) | Next.js on Vercel, R2 for bytes, Firestore for records, Firebase Auth. | explanation | canonical | decided
[adr/ADR-0008-change-queue-replaces-review-state.md](adr/ADR-0008-change-queue-replaces-review-state.md) | The change queue replaces review state. | explanation | canonical | decided
[adr/ADR-0009-sign-in-first-no-captcha-no-tour.md](adr/ADR-0009-sign-in-first-no-captcha-no-tour.md) | Sign in first, with no captcha and no tour. | explanation | canonical | decided
[adr/ADR-0010-broad-editor-internal-name-fmd.md](adr/ADR-0010-broad-editor-internal-name-fmd.md) | The product is the broad markdown editor, and its internal name is fmd. | explanation | canonical | decided
[adr/ADR-0011-everything-in-batches.md](adr/ADR-0011-everything-in-batches.md) | Build everything, one batch at a time, each used internally before the next. | explanation | canonical | decided
[adr/ADR-0012-canonical-copy-with-mirror.md](adr/ADR-0012-canonical-copy-with-mirror.md) | Our copy is canonical, and the person's GitHub or Drive holds a full mirror. | explanation | canonical | decided
[adr/ADR-0013-accounts-to-the-company.md](adr/ADR-0013-accounts-to-the-company.md) | Every account moves to the company before the first stranger's document is stored. | explanation | canonical | decided
[adr/ADR-0014-free-cap-as-tested-panel-value.md](adr/ADR-0014-free-cap-as-tested-panel-value.md) | The Free document cap is a panel value, A/B tested before it is fixed. | explanation | canonical | decided
[adr/ADR-0015-one-live-collaborator-on-free.md](adr/ADR-0015-one-live-collaborator-on-free.md) | One live collaborator on Free. | explanation | canonical | decided
[adr/ADR-0016-free-model-chain-and-training-gate.md](adr/ADR-0016-free-model-chain-and-training-gate.md) | A free-model fallback chain, behind a training gate. | explanation | canonical | decided
<!-- INDEX:END -->

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
