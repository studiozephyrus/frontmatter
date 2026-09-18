---
id: 37-BACKUP-AND-RECOVERY
title: Backup and recovery
mode: how-to
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [backup, restore, disaster-recovery, backup-retention, drills]
---

# 37. Backup and recovery

**The constraint that shapes everything below, and it is settled.**

> **Cloudflare R2 has no object versioning.** `PutBucketVersioning` and object-lock are absent from
> its S3 compatibility matrix. `DeleteObject` is a **free** operation. Emptying a bucket is
> irreversible. Data-plane audit logs do not exist by default, so `GetObject` and `PutObject` leave
> no forensic trail. R2's own durability page says it plainly: **"Durability does not prevent
> intentional or accidental deletion of data."**

**So the standard cloud recipe does not port.** Amazon's own guidance is cross-region replication
**with versioning**, so you can pick a restoration point. On R2, **versioning is built into the key
layout, not bought.**

**Do not design as if a versioning toggle will arrive.** If Cloudflare ships `PutBucketVersioning`,
treat it as defence in depth on top of the key layout, never as a replacement.

**Where the full design lives.** `docs/FRONTMATTER-PRD-v2-2026-08-29.md` section 32, lines 3039 to
3130. **Do not open that file with Read; it is 760 KB.** Use `sed -n '3039,3130p'`. This file is the
operational half: what is true today, what to do, and how a restore is proved.

---

## 1. What is actually backed up today

**Read this before anything else in the file. The answer is "almost nothing, by design, because
almost nothing is held yet."**

What | Where it lives at `0af3c90` | Backed up by | Recoverable
Documents | A GitHub repository, through the Contents API. `34-INTEGRATIONS.md` section 4 | **Git history**, plus whatever GitHub does for itself | Yes, to any commit, by anybody with the repository
Unsaved drafts | **The user's browser.** IndexedDB store `sgnk-md` / `drafts` | **Nothing** | No
Bookmarks, editor settings | The user's `localStorage` | **Nothing** | No
Open tabs | The user's `sessionStorage` | **Nothing**, deliberately | No, and it does not matter
Firestore records | Nothing is written. `34-INTEGRATIONS.md` section 5 | n/a | n/a
R2 objects | R2 is not built | n/a | n/a
Application code, this pack, the harness | Git, on `studiozephyrus/frontmatter` | Git, plus every clone | Yes

**Three things follow, and the third is the uncomfortable one.**

- **Version history for documents is git history today.** That is real recovery, and it is better
  than nothing by a wide margin.
- **A user's unsaved draft has no second copy anywhere.** The plan's own rule is "never let the
  browser be the only copy", and at `0af3c90` **it is**. The first connection pushing everything to
  the server is phase A work.
- **Storing documents in a GitHub repository contradicts the PRD's own anti-recommendation.** PRD
  section 32.3 says in as many words: **do not put per-user document repos on GitHub for the free
  versioning.** It adds a data processor, caps a file at 100 MiB, and buys a version store that a
  single `gc` can prune. **The shipped app does exactly that**, because it predates the decision and
  because there is one user. **It is not a plan to keep; R2 in phase B is where it goes.**

**Why git is not the document substrate**, from the same PRD section, so nobody re-argues it:

Limit | Value
A file over 100 MiB | **Blocked**
A file over 50 MiB | Warned
Browser upload | Capped at 25 MiB
Repository size | "ideally less than 1 GB, and less than 5 GB is strongly recommended"
Reflog expiry | `gc.reflogExpire` 90 days, `gc.reflogExpireUnreachable` 30 days, and `gc` calls `prune --expire 2.weeks.ago`
The reflog | **Local and unpushed.** A fresh clone of a force-pushed repository has no undo record at all
GitHub's own words | "Git is not designed to serve as a backup tool"

**And the one that matters most for a privacy law:** `git filter-repo` is simultaneously the correct
erasure tool and the correct data-destruction accident. **Same command shape, opposite intent.**

---

## 2. The target layout, and why each layer exists

**L0 is the decision the rest depends on.** Content-addressed, immutable keys that are never
overwritten, plus a tiny pointer object per document:

```
u/{uid}/d/{docid}/v/{ts}-{sha256}     one object per version, never overwritten
u/{uid}/d/{docid}/HEAD                a pointer to the current version
```

**What that buys.** **Overwrite stops being a failure mode, because overwrites do not exist.**
Deletion becomes the only loss vector, and deletion on R2 is free and untraced. **Every layer below
exists to answer deletion.**

Layer | What it is | Protects against | Does **not** protect against
**L0** | R2 primary, content-addressed immutable keys plus `HEAD` | Disk and datacentre failure; accidental overwrite, because there are none | **Deletion of any kind.** Account compromise. Bucket empty
**L1** | Bucket lock, `Age`-bounded, on the `u/` prefix | Delete and overwrite of locked objects, for a stated period | Nothing once the lock is removed, **and removal is required before emptying a bucket**. A speed bump with a documented removal procedure, not a vault
**L2** | Lifecycle rules, moving `v/` older than 30 days to Infrequent Access | **Cost only** | **Data loss. Lifecycle is a deletion engine**, and misconfiguring it is itself a top-three loss scenario
**L3** | Nightly snapshot to a **second R2 bucket, separate account, separate write-only token** | Bugs in our own code; a single token compromised; the primary bucket emptied | A Cloudflare-wide account action. **One blast radius covers both buckets**
**L4** | Weekly full copy to **a different provider, in a different country, with a different credential store** | Provider-level loss or account termination | Ransomware resident longer than the retention window
**L5** | Encrypted monthly archive on physical media, offline | Everything above, plus total credential compromise | **Being forgotten.** It requires a human hand
**git** | Application code, schema, infrastructure definitions, runbooks. **Not customer documents** | Config and code loss, with an auditable history | **Customer documents**

**Two incidents justify L3 and L4 specifically, and they are not hypotheticals.**

- **A Cloudflare-wide event on 6 February 2025 took every R2 API down for 59 minutes**, because a
  routine abuse remediation disabled the gateway. **L3 and the primary share that blast radius.**
  That is why L4 is a different provider.
- **A cloud account was deleted because one input parameter was left blank**, taking a default
  one-year term to automatic deletion, with no customer notification. That is the failure L4
  answers and L3 cannot.

**One disagreement is recorded and unresolved.** The 3-2-1 rule asks for two different media types.
An all-object-storage stack from L0 to L4 gives three copies and one offsite, and **violates the
two-media clause literally**. **L5 exists only to satisfy that clause**, and whether the clause is
meaningful in 2026 is a judgement, not a fact.

---

## 3. Recovery objectives, by data class

**The two definitions, so nobody redefines them mid-incident.** Recovery time objective is the
maximum acceptable delay between the interruption of service and its restoration. Recovery point
objective is the maximum acceptable time after the last data recovery point.

**Arbitrary objectives are an anti-pattern**, which is why each row below carries its reasoning.

Class | Recovery point | One user, self-serve | Whole tenant | Platform | Why that number
**Document bytes** | 0 for any acknowledged write; 5 minutes for the off-provider copy | 60 s | 4 h | 24 h | The engine's contract is byte-preserving splice or refuse. **A backup that loses the last N minutes contradicts the product's own promise.** R2 returns 200 only when data has persisted to disk, so the recovery point under our control is the **second** copy, not the write
**Version history** | 5 minutes | 5 minutes | 4 h | 24 h | Undo across sessions is what people mean by "backup". Cheaper to keep as immutable objects than to reconstruct
**Metadata**: the document index, titles, folders, share state | 5 minutes | 5 minutes | 1 h | 4 h | **Make metadata a projection of the object keys**, rebuildable with `ListObjects`, exactly as every view is a projection of the file. **Metadata loss then becomes a rebuild, not a restore**
**Published pages** | equals the document objective | 15 minutes | 4 h | 24 h | Deterministic renders. **Regenerate, never restore.** The only irreducible state is the binding between a URL and a document, which is metadata
**Billing records** | 0 | not applicable | 24 h | 72 h | Keep the payment processor as the system of record and hold a read-mirror. Total loss of our copy is a re-sync
**Auth and identity** | 0 for identity rows; sessions are expendable | not applicable | 1 h | 4 h | A forced sign-in is an annoyance. **A lost identity row orphans a paying user's documents**

**The anti-recommendation that people get backwards: do not set a zero recovery point on the backup
tier.** Continuous replication does not protect against corruption or malicious deletion, because
**a zero-lag mirror faithfully replicates your `DELETE`**.

**Does the user holding their own copy reduce the obligation?**

- **Legally, no.** The duty to protect personal data in our possession or under our control sits
  with us, and no clause conditions it on whether the person holds a copy.
- **Operationally, yes, partly.** For a desktop user the canonical file is on their disk and R2 is
  our backup of their primary, so the objective that matters is re-sync. **For a browser-only user,
  our copy is the primary and no relief exists.**
- **Commercially it is the strongest claim available and the easiest to void.** So make the local
  copy a **tested** export: a scheduled, verified, plain directory of `.md` files, with a visible
  last-verified timestamp per device.

**The counterexample to remember.** In one well-documented outage every user held a local clone,
the repositories survived because they were stored separately, **and the company still lost about
5,000 projects, 5,000 comments and 700 users of database state.** The local copy never substitutes
for L3 and L4.

---

## 4. Retention, from the plan

`docs/mvp0/PRODUCT-PLAN.md` section 18 sets what a person can rely on. **Retention is a promise, and a
backup layer that keeps data longer than the promise is a liability, not a bonus.**

Thing | Retention | On account deletion
Account | Until deleted | Removed within 30 days
Document head | Until deleted; **30 days in trash** | Removed
Version | **7 days on Free, 90 on Pro**, then pruned to the head | Removed
Upload | With the document | Removed
Published page | Until unpublished | Removed, and **the URL goes dark**
Ledger entry | **180 days**, then aggregated | Aggregates kept **without the account id**
Plan and invoice | As the accountant requires, at least the statutory period | Kept as the law requires, **unlinked from the profile**
**Security log** | **180 days rolling, append-only, in Indian jurisdiction** | **Kept for the period**
Local draft | Until synced or evicted | **Not ours**

**Cross-checked on 2026-09-18 against the plan and the DPDP Rules.** Every row matches
`docs/mvp0/PRODUCT-PLAN.md` section 18 [O]. Two rows conflict with rule 8(3) of the Rules [M], which
from May 2027 requires `personal data, associated traffic data and other logs of the processing` to be
kept `for a minimum period of one year`, and whose illustration adds `even if X deletes her account`.

- **Security log: resolved (proposed 18 Sep, founder review).** 365 days rolling, not 180. Rejected:
  keeping 180, which falls short of the floor. The plan's 180 came from CERT-In's reading, a lower floor.
- **Ledger and account deletion: needs founder.** Recommendation: keep the processing-log part of a
  ledger entry and the security log for one year after deletion, unlinked from the profile, and say so
  in the privacy notice. Rejected: "removed within 30 days" for logs. It is a promise to users.

**The security log is its own store and its own line.** Free tiers of the usual error and analytics
vendors may not pin to India, so it is R2 in Mumbai
(`docs/mvp0/PRODUCT-PLAN.md` section 15). **Do not treat an error tracker as the security log.**

---

## 5. The erasure conflict, which must be named rather than resolved quietly

**Two rules point in opposite directions, and both are real.**

Rule | What it asks
**Retain and index** | A derived artefact must never delete the record it came from, because no downstream retrieval recovers what the distillation dropped
**Erase on request** | Personal data is erased on withdrawal of consent, when the purpose is no longer served, or on request

**An indefinite bucket lock makes erasure impossible.** So:

1. **Bucket-lock only the backup prefixes, with a bounded `Age` equal to the stated retention
   window. Never `Indefinite`.**
2. **Make a deletion a scheduled tombstone that propagates to L3 and L4 within that window.**
3. **The maximum lag between an erasure request and true erasure then becomes a number that can be
   stated publicly**, which is the point of doing it this way.

**A secret is the exception to "never delete the raw record".** If a credential lands in a store,
**rotate first and erase second**, and accept the hole in the record. Redacting at write time in the
collector, so it never lands, is the only version of this that is not a trade.

**The breach-notification deadline and the inactivity period, opened on 2026-09-18 `[M]`** in the
DPDP Rules 2025, G.S.R. 846(E) (`https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf`):

- Rule 7(2)(b): detail to the Board `within seventy-two hours of becoming aware of the breach`.
- Rule 8 and the Third Schedule: erasure after `Three years` of inactivity binds only e-commerce and
  social media platforms with `not less than two crore` users, and gaming with fifty lakh. Not us.
- Rule 8(2): warn the person `At least forty-eight hours before` such an erasure.
- Rule 8(3): keep processing logs `for a minimum period of one year`. This binds every fiduciary.
- Rules 7 and 8 come into force eighteen months after publication, so 13 or 14 May 2027. The
  masthead says 13 November 2025; the Gazette number `CG-DL-E-14112025-267650` carries the 14th.

`38-INCIDENT-AND-SEVERITY.md` section 5.1 carries the same figure.

---

## 6. The restore drill

**Seven steps. Every one names its verification, because a step with no verification is a hope.**

Step | What | How it is verified
1 | **Declare and freeze.** Disable the write path with a flag whose store is **not R2** | The flag flips while R2 is unreachable. **The recovery lever must not sit behind the broken thing**, which is exactly what failed in the February 2025 incident
2 | **Classify**: one document, one tenant, metadata only, whole bucket, or provider level | Pick the shallowest layer that covers it. **An L4 restore is not for one deleted file**
3 | **Restore to a NEW bucket, never over the damaged one** | Prevents compounding, and preserves the corrupt artefact as evidence
4 | **Verify before cutover, byte level, not object count** | `sha256` every restored object against the manifest recorded at backup time. **Refuse cutover on any mismatch.** An object count alone passes when every object is zero bytes, which is precisely how one well-known restore failed
5 | **Rebuild metadata from keys. Do not restore it** | A `ListObjects` sweep, because L0's key layout **is** the addressing scheme
6 | **Cut over, and record the actual recovery point and time in wall-clock** | Not "we met target". A real published example: 6 h 10 m of lost writes and roughly 18 h of copying
7 | **Notify** | Intimation is owed to the regulator **and to each affected person**, in the prescribed form. The deadline lives in rules that could not be opened. **Confirm it before writing it in**

---

## 7. The drill calendar, and how a restore is proved

**A restore is proved by doing one, on a schedule, with a machine recording the result.**

Cadence | Drill | What it proves | Who confirms
**Every backup run** | Restore one randomly chosen object and compare its `sha256` to the source | The write landed, with these bytes | **Machine.** The run refuses and raises an alert on a mismatch
**Weekly** | Restore one synthetic tenant, about 200 documents, into a scratch bucket; diff the whole tree; measure seconds | Single-tenant recovery time is real | **Machine.** Publishes a signed `last-good-restore` record with its duration
**Monthly** | Verify the pack files themselves, not just the index | The bytes, not the catalogue | Machine
**Quarterly** | Cold restore into a brand-new provider account, **from the runbook only**, with the laptop wiped of ambient credentials, timed | **The runbook is complete and the credentials are recoverable** | Founder, timed, written up
**Annually** | Full recovery assuming the Cloudflare account is gone, from L5 media | Independence from the primary provider | Founder plus one named external witness
**Annually** | **Restore-refusal drill: corrupt one pack deliberately and confirm the gate goes red** | **The verifier can fail** | Founder

**The rule that makes the calendar worth anything.** **A drill that has never failed is not evidence
the drill works.** Break it on purpose once a year, or the green is uninterpretable. A green suite
is the expected result of running it, not evidence of a fix.

**Two people run this company, so no drill's outcome may be a human judgement.** Every drill emits a
machine-readable record, and **a second, separately hosted watcher raises an alarm when that record
goes stale**. **Absence of an alarm is not a pass.**

**Do not host that watcher on Cloudflare.** A Cloudflare-wide event takes the storage and the
watcher together, which is the exact shape of the February 2025 incident.

---

## 8. The silent-failure modes, which are how backups actually die

**Every row here is a real, observed mechanism.** A backup rarely fails loudly; it fails by
reporting success.

Mode | How it stays silent | The instrument
A trailing `[ cond ] && cmd` as a function's last line, under `set -e` | The function returns 1, `set -e` kills the caller before the upload, and **the exit code is 1 with no output and nothing watching it**. This studio lost nightly backups for weeks to exactly this | `bash -n` in the pipeline; ban trailing conditionals; **assert bytes written, never an exit code**
A write silently denied by a sandbox, a permission or a quota | The append fails and the tool prints its success line having stored nothing | **Count objects and bytes before and after. Refuse if the count did not move**
A major-version tool mismatch between dump and database | One published case: the dump tool was 9.2 against a 9.6 database, and the bucket was simply empty | **Restore and diff on every run. A dump you have not read back is a file, not a backup**
**The alarm channel is the broken thing** | One published case: the failure emails were rejected by the receiver, and nobody knew the backups were failing until it was too late | **A dead-man switch.** The backup pushes a heartbeat; an independent watcher on a different provider raises an alarm on its **absence**. **Test the pager monthly by not sending**

**The general form, and it is the reason this section exists at all: a tool that writes must verify
the write landed before reporting success.**

---

## 9. Cost, so no layer is skipped on a price argument

**These figures are quoted from PRD section 32.3, derived on 2026-08-29. RE-DERIVE BEFORE QUOTING
THEM ANYWHERE.** Provider prices change, and the plan's own rule is that a number is never carried
forward.

Users | Total a month | Per user
100 | $0.19 | $0.0019
1,000 | $4.06 | $0.0041
10,000 | $100.48 | $0.0100

**The shape matters more than the number, and it is counterintuitive.** At 10,000 users, storage is
about $23 and **operations are about $77**. **Save granularity, not bytes, is the cost model.**

- 48 saves per active document per day is roughly $320 a month in write operations.
- 8 saves is roughly $50.
- 1 save is roughly $2.

**So coalesce versions on a debounce plus a semantic boundary, and pack nightly snapshots.** That is
about a sixfold swing.

**Two anti-recommendations attached to that.**

- **Do not coalesce past the stated recovery point.** Every minute of coalescing sells a minute of
  somebody's recovery point for about a hundredth of a cent.
- **Do not put anything needing a hurried restore into Infrequent Access.** It carries a 30-day
  minimum storage duration and a retrieval fee, and **that fee is what quietly discourages the drill
  that must not be skipped.**

**The ratio to keep in mind.** Backup spend at 10,000 users is about $100 a month, against a
statutory penalty ceiling in the hundreds of crore. **That is not an argument to spend more. It is
the reason no cost argument may ever appear in a decision to skip a drill.**

---

## 10. What to do first, in order

**Nothing in sections 2 to 9 is built.** The order below is the dependency order, not a wish list.

1. **Phase A: stop the browser being the only copy.** The first connection pushes every local draft
   to the account. `36-DATA-MIGRATION-PLAN.md` section 5 is the migration.
2. **Phase B, with R2: L0 first, and get the key layout right.** Every layer above depends on it,
   and it cannot be retrofitted without rewriting every key.
3. **L3 next, not L1.** A second bucket on a separate account with a write-only token answers the
   most likely loss, which is our own bug.
4. **The per-run object check from section 7**, on the first night L3 runs. It is one comparison and
   it is what makes the rest interpretable.
5. **The dead-man switch from section 8**, on a different provider, immediately after.
6. **L1, L2 and L4** once there is a tenant worth the effort.
7. **L5** when the two-media clause is worth satisfying, or never, with the reason recorded.

---

## 11. Limits of this file

**What was not assessed.**

- **No backup exists, so no restore was tested.** Every drill in section 7 is a specification.
- What GitHub does for its own durability, and what that means for section 1's "recoverable"
  column. **Somebody else's backup is not your backup.**
- Firestore's own backup and point-in-time options. **Nothing is written to Firestore yet**, so it
  was not investigated, and it will need its own row in section 2 when it is.
- Vercel's environment variables, which are **not versioned with a deployment** and have no backup.
  A lost variable is an outage with no restore path other than re-entering it.

**What could not be verified.**

- **Every R2 fact in the opening block and every figure in section 9 is quoted from PRD section 32,
  which fetched them on 2026-08-29.** None was re-fetched here. **RE-DERIVE BEFORE QUOTING
  EXTERNALLY**, and note the PRD itself says R2's Mumbai pricing page is a script shell that two
  readers disagreed about.
- The breach-notification deadline and the inactivity period, opened in the Rules and quoted in
  section 5. The one-year log floor of rule 8(3) is handled in section 4.
- The section 4 rows were cross-checked against plan section 18 and the Rules on 2026-09-18. They match
  the plan; two conflict with rule 8(3), and section 4 now says how.

**What is not established.**

- Whether L5 is worth doing. Section 2 records the disagreement and does not settle it.
- Whether the shipped GitHub-as-storage arrangement should be given a real backup, or simply
  retired at phase B. **Section 1 names the contradiction; the answer depends on how long phase B
  takes, and the measured pace says that could be a long time.**

**What would falsify this file.**

- A restore drill that has never been run appearing in a status report as though it had.
- An R2 key in production that is not content-addressed, which would mean L0 was not built as
  specified and every layer above it is weaker than this file claims.
- A backup job reporting success on a run where the object count did not move.
