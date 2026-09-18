---
id: ADR-0007-stack
title: Next.js on Vercel, R2 for bytes, Firestore for records, Firebase Auth
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0007]
---

# ADR-0007. Next.js on Vercel, R2 for bytes, Firestore for records, Firebase Auth

**Decision id:** ADR-0007. **Decided:** by the founders on 17 September 2026 `[Z]`. **Source:**
`docs/mvp0/PRODUCT-PLAN.md` section 15. **Recorded here:** 18 September 2026.

## Context

- The founders asked whether Cloudflare R2 with a Firestore database is free to start, whether it
  scales, and what the right stack is.
- Revision 5 of the plan had recommended Supabase Pro for the database. The shipped code already ran
  on Firebase.
- The product needs four things from a stack: a byte store for documents, a record store for
  metadata and the ledger, sign-in, and a live session for two people in one document.

## Decision

Layer | Choice
Web app | The existing Next.js app on Vercel
Bytes: every version and every upload | Cloudflare R2
Records: metadata, the head pointer, the queue, the ledger | Firestore
Sign-in | Firebase Auth, Google or GitHub
Live sessions | Durable Objects with the Hibernation API

## Evidence

- `docs/mvp0/PRODUCT-PLAN.md` section 3, the Stack row, records the founders' decision of
  17 September and notes it is what the shipped code runs.
- `docs/mvp0/PRODUCT-PLAN.md` section 15 compares three stacks at 1,000 users a month, marked
  SIMULATED in the plan:

Stack | Month one, per the plan
R2 plus Firestore in Mumbai, Firebase Auth, Durable Objects, Vercel Pro | $43.07 with WebSocket hibernation
R2 plus Supabase Pro in Mumbai, Durable Objects, Vercel Pro | $65.19
Cloudflare only: R2, D1, Durable Objects, Workers | $1.49 to $6.49, plus $40 if the app stays on Vercel

- The same section: R2 is right for the bytes on every stack, at $0.015 a GB-month with free egress.
- The same section: phase A stops being a migration, because the shipped app already initialises a
  Firestore client and signs in through Firebase Auth for Google.

## Alternatives rejected and why

Alternative | Why rejected
Supabase Pro for records and auth, the revision 5 recommendation | $25 from day one, and the more expensive row. The founders decided otherwise on 17 September
Cloudflare only, with D1 | D1 is 10 GB a database and single-threaded, so tenants shard from the start, and Next.js would have to move to Workers
Document bytes inside Firestore | A Firestore document is capped at 1 MiB, so bytes live in R2 and Firestore holds metadata and a hash
Postgres, as the data model once said | `56-OPEN-DECISIONS.md` records D15 closed on 18 September: the data model now names Firestore collections

## Consequences

The plan carries Firestore's known objections as build constraints, not as reasons to reopen:

Objection | How the build handles it, per section 15
A Blaze billing account is required | Opened in Phase 0 with the company card
1 MiB per Firestore document | Bytes in R2, per ADR-0004
The free quota resets at midnight Pacific | Our caps live in our ledger, not in Google's quota
A credits ledger wants transactional writes | Append-only entries, and the balance is a sum

- **It is not free to start.** The plan quotes Vercel: the Hobby plan is for personal,
  non-commercial use. The first bill is $20 for one Vercel seat, per section 15.
- Where documents are held and mirrored is ADR-0012.

## A contradiction this record found

- `docs/mvp0/PRODUCT-PLAN.md` section 24 lists the Firebase project `frontmatter-md`, held by a studio
  Gmail account, as "retired in phase A".
- This record's decision keeps Firebase Auth and Firestore.
- `INFERENCE:` the project is replaced by a company-owned Firebase project, per ADR-0013. The plan
  does not say so, and the plan's owner should.

## What would reverse it

- Firestore's write limits or Mumbai prices turning out far above the plan's simulation at real
  usage. `UNVERIFIED:` the plan records two readings of the Mumbai storage price, and neither could be
  reproduced.
- The Blaze account being unobtainable on an Indian company card.

## Limits of this record

- Every cost figure is the plan's SIMULATED figure, not re-derived here.
- No provider pricing page was opened for this record.
