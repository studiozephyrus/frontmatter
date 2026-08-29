I made no writes, commits, or mutating commands — the working tree changes flagged by the hook are not mine; my entire run was `curl` fetches, read-only `git config --get` / `man` reads, in-memory `bash -c` and `python3` heredocs, and `find`/`stat` measurements. Full deliverable re-stated below.

### Evidence ledger — what I opened, what I could not

| Source | Accessed | Status |
|---|---|---|
| Cloudflare R2 Pricing (page "Last updated Aug 7, 2026") | 2026-08-29 | [fetched] |
| R2 S3 API compatibility (page "Last updated Jul 31, 2026") | 2026-08-29 | [fetched] |
| R2 Object lifecycles / Bucket locks / Durability / Audit logs / Delete buckets / Event notifications / Data location | 2026-08-29 | [fetched] |
| Cloudflare blog, "Cloudflare incident on February 6, 2025" | 2026-08-29 | [fetched] |
| GitLab, "Postmortem of database outage of January 31", pub. 2017-02-10 | 2026-08-29 | [fetched] |
| Google Cloud blog, GCVE/UniSuper incident, pub. 2024-05-25 | 2026-08-29 | [fetched] |
| DPDP Act 2023 gazette PDF (meity.gov.in, 182,082 bytes) | 2026-08-29 | [fetched] |
| GitHub Docs, "About large files on GitHub" | 2026-08-29 | [fetched] |
| git-gc(1) + local `man git-config`, git 2.50.1 (Apple Git-155) | 2026-08-29 | [fetched]+[measured] |
| CISA/US-CERT "Data Backup Options" (Ruggiero & Heckathorn) | 2026-08-29 | [fetched] |
| AWS Well-Architected Reliability Pillar REL13; AWS DR whitepaper | 2026-08-29 | [fetched] |
| restic docs, "Checking integrity and consistency" | 2026-08-29 | [fetched] |
| Backblaze B2 pricing page | 2026-08-29 | [fetched] |
| **DPDP Rules 2025** (breach-notification deadline, prescribed inactivity period under §8(8)) | — | **NOT OPENED.** meity.gov.in returned empty bodies; PRS and egazette 404/000. Do not quote a 72-hour figure from memory. |

### The finding that reorders this whole plan

- R2 **has no object versioning**. `GetBucketVersioning` ❌, `PutBucketVersioning` ❌, `GetObjectLockConfiguration` ❌, `PutObjectLockConfiguration` ❌ on the S3 compatibility matrix [fetched]. No versioning page exists in the R2 sidebar or in `r2/llms.txt` [fetched].
- `DeleteObject`, `DeleteBucket`, `AbortMultipartUpload` are **free operations** [fetched]. A runaway delete loop costs the bug nothing.
- "Emptying a bucket is irreversible. All objects in the bucket are permanently deleted." "Objects removed during this process cannot be recovered." Bucket lock rules **must be removed first** [fetched].
- Audit logs cover control-plane only; "Logs for data access operations, such as `GetObject` and `PutObject`, are not included" [fetched]. There is no object-level forensic trail by default.
- R2 durability doc, verbatim: "Durability does not prevent intentional or accidental deletion of data" [fetched]. 11 nines protects against disks, not against you.
- Consequence [inference]: the standard cloud DR recipe — AWS's own whitepaper recommends S3 Cross-Region Replication "while providing versioning for the stored objects so that you can choose your restoration point" [fetched] — **does not port to R2**. Versioning must be built in the key layout, not bought.

### 1. RPO / RTO targets by data class

Definitions used, verbatim from AWS Well-Architected REL13 [fetched]: RTO is "the maximum acceptable delay between the interruption of service and restoration of service"; RPO is "the maximum acceptable time after the last data recovery point". The same page lists "You select arbitrary recovery objectives" as an anti-pattern — hence a reason column.

| Class | RPO | RTO (single user, self-serve) | RTO (whole tenant) | RTO (platform) | Reasoning |
|---|---|---|---|---|---|
| **Document bytes** | 0 for any acknowledged write; ≤5 min for the off-provider copy | ≤60 s | ≤4 h | ≤24 h | The engine's contract is byte-preserving splice-or-REFUSE. A backup that loses the last N minutes contradicts the product's own promise that the file is the source of truth [inference]. R2 returns 200 "only when data has been persisted to disk" [fetched] — so RPO 0 on the write path is achievable without extra work; the RPO you actually control is the *second* copy. |
| **Version history** | ≤5 min | ≤5 min | ≤4 h | ≤24 h | Undo across sessions is what customers think "backup" means. Cheaper to keep as immutable content-addressed objects than to reconstruct [derived, §6]. |
| **Metadata** (doc index, titles, folders, share state) | ≤5 min | ≤5 min | ≤1 h | ≤4 h | Make metadata a *projection of the object keys*, rebuildable by `ListObjects`, exactly as every view is a projection of the file. Then metadata loss is a rebuild, not a restore [inference]. |
| **Published pages** | = document RPO | ≤15 min | ≤4 h | ≤24 h | Deterministic renders of documents. Regenerate, never restore. The only irreducible state is the URL↔document binding, which belongs in metadata [inference]. |
| **Billing records** | 0 | n/a | ≤24 h | ≤72 h | Keep the payment processor as system of record and hold only a read-mirror; then a total loss of our copy is a re-sync, not a reconstruction [inference]. Retention period is a statutory question I did **not** verify — check Companies Act 2013 §128 before setting it. |
| **Auth / sessions** | 0 for identity rows; sessions expendable | n/a | ≤1 h | ≤4 h | Forced re-login is an annoyance; a lost identity row orphans a paying user's documents [inference]. |

- Anti-recommendation: do not set RPO 0 on the *backup* tier. Continuous replication "may not protect against disaster events such as data corruption or malicious attack (such as unauthorized data deletion) as well as point-in-time backups" [fetched, AWS DR whitepaper]. A 0-lag mirror faithfully replicates your DELETE.

### 2. Architecture on git + R2 — and what each layer does not cover

| Layer | Protects against | Does NOT protect against |
|---|---|---|
| **L0 — R2 primary, content-addressed immutable keys.** `u/{uid}/d/{docid}/v/{ts}-{sha256}`, never overwritten; a tiny `HEAD` pointer object per doc | Disk/DC failure (11 nines, erasure coding, synchronous writes) [fetched]; accidental overwrite (there are none) | Deletion — of any kind. Free `DeleteObject` [fetched]. Account compromise. Bucket empty. |
| **L1 — Bucket lock**, `Age`-bounded on the `u/` prefix | Delete and overwrite of locked objects, per prefix, "for a specified period — or indefinitely" [fetched] | Nothing, once the lock is removed — and removal is required before emptying the bucket [fetched], so it is a speed bump with a documented removal procedure, not a vault. `Indefinite` also blocks DPDP §8(7)(a) erasure [fetched] — see §4. |
| **L2 — Lifecycle rules**: transition `v/` older than 30 d to Infrequent Access | Cost | Data loss. Lifecycle is a *deletion engine*; "the expire (or delete) lifecycle transition takes precedence" on conflict, and `LifecycleDeletion` is one of only two delete triggers [fetched]. Misconfiguring L2 is itself a top-3 loss scenario. |
| **L3 — Nightly restic-format repo → second R2 bucket**, separate account, separate API token, write-only | Bugs in our own code; single-token compromise; bucket-empty on the primary | Cloudflare-wide account action. R2's Feb 2025 incident took 100% of R2 APIs down 08:14→09:13 UTC because a *routine abuse remediation* disabled the Gateway [fetched]. Same blast radius covers both buckets. |
| **L4 — Weekly full → Backblaze B2**, different provider, different country, different credential store | Provider-level loss or account termination; the UniSuper failure mode — "one input parameter was left blank", default 1-year term, automatic deletion, "No customer notification was sent" [fetched] | Ransomware resident longer than retention. Correlated encryption-key loss. |
| **L5 — Encrypted monthly archive on physical media, offline** | Everything above, plus total credential compromise | Being forgotten. Requires a human hand [inference]. |
| **git (application code, schema, IaC, runbooks — NOT customer documents)** | Config/code loss; auditable change history | Customer documents. GitHub Docs, verbatim: "Git is not designed to serve as a backup tool" [fetched]. |

**Where git fails as a document substrate** — all [fetched] unless marked:
- Hard limits: files >100 MiB **blocked**; >50 MiB warned; browser upload capped at 25 MiB; repos "ideally less than 1 GB, and less than 5 GB is strongly recommended."
- Pasted images/attachments in markdown defeat delta compression and grow packs monotonically [inference].
- History rewrite destroys silently: `gc.reflogExpire` defaults to **90 days**, `gc.reflogExpireUnreachable` to **30 days**, `gc` calls `prune --expire 2.weeks.ago` [fetched; defaults confirmed unset locally, git 2.50.1 [measured]]. After a force-push plus gc, the old objects are gone.
- The reflog is local and unpushed [inference] — a fresh clone of a force-pushed repo has no undo record at all.
- `git filter-repo` is simultaneously the correct DPDP erasure tool and the correct data-destruction accident. Same command shape, opposite intent [inference].
- Recommendation: git for everything *except* documents. **Anti-recommendation**: do not put per-user document repos on GitHub for the "free versioning". It adds a data processor under DPDP, caps document size at 100 MiB, and buys you a version store that a single `gc` can prune.
- Recorded disagreement, unresolved: CISA's 3-2-1 requires "2 different media types to protect against different types of hazards" [fetched]. An all-object-storage stack (L0–L4) satisfies "3 copies, 1 offsite" but violates "2 media" literally. L5 exists only to satisfy that clause; whether the clause is meaningful in 2026 is a judgement call, not a fact.

### 3. Restore runbook and drill schedule

**Runbook, ordered. Every step names its verification.**

1. **Declare and freeze.** Disable the write path via a flag whose store is *not* R2. The Feb 2025 lesson, verbatim: "this tooling was unavailable because it relies on R2" [fetched] — the recovery lever must not sit behind the broken thing.
2. **Classify:** single-doc | single-tenant | metadata-only | whole-bucket | provider-level. Pick the shallowest layer that covers it; L4 restores are not for one deleted file.
3. **Restore to a NEW bucket**, never over the damaged one. Prevents compounding, preserves the corrupt artifact as evidence.
4. **Verify before cutover** — byte-level, not object-count: `sha256` of every restored object against the manifest recorded at backup time; refuse cutover on any mismatch. Object count alone passes when every object is zero bytes [inference; GitLab's S3 bucket was simply *empty* [fetched]].
5. **Reconcile metadata by rebuilding it from keys**, not by restoring it — if L0's key layout is the addressing scheme, this is a `ListObjects` sweep.
6. **Cut over. Record actual RPO and RTO in wall-clock**, not "we met target". GitLab's honest numbers: 6 h 10 m of lost writes (17:20→23:30 UTC), and ~18 h of copying at ~60 Mbps to restore [fetched].
7. **Notify.** DPDP §8(6) requires intimation to the Board *and each affected Data Principal* in the prescribed form and manner [fetched]; failure carries a ceiling of **two hundred crore rupees** (Schedule item 2) [fetched]. The prescribed deadline lives in the Rules, which I could not open — confirm before writing it into the runbook.

**Drill schedule.**

| Cadence | Drill | Proves | Confirmed by |
|---|---|---|---|
| Every backup run | Restore one randomly-chosen object, compare sha256 to source | The write actually landed, with these bytes | Machine gate; run *refuses* and pages on mismatch |
| Weekly | Restore 1 synthetic tenant (~200 docs) into a scratch bucket, diff whole tree, measure seconds | Single-tenant RTO is real | Machine; publishes a signed `last-good-restore` record with duration |
| Monthly | `restic check --read-data` on L3 and L4. Default `check` verifies structure only; `--read-data` is required to verify pack files on disk [fetched] | The bytes, not just the index | Machine |
| Quarterly | Cold restore from L4 into a brand-new provider account, from the runbook only, laptop wiped of ambient credentials. Timed | The runbook is complete and the credentials are recoverable | Founder, timed, written up |
| Annually | Full DR: assume the Cloudflare account is gone. Restore from L5 media | Independence from the primary provider | Founder + one named external witness |
| Annually | **Restore-refusal drill**: corrupt one pack deliberately, confirm the gate goes red | The verifier can fail | Founder |

- Anti-recommendation to the last row, and it is the important one: a drill that has never failed is not evidence the drill works. LR#68 — "a green suite is the expected result of running it, not evidence of a fix". Break it on purpose once a year, or the green is uninterpretable.
- Who confirms, for a solo founder [inference]: no drill's outcome may be a human judgement. Every drill emits a machine-readable record; a *second, separately-hosted* watcher pages when that record is stale. Absence of an alarm is not a pass.

### 4. Does "the user already has their own copy" reduce the obligation?

- **Legally, no.** DPDP §8(5) places the duty on the Data Fiduciary to "protect personal data in its possession or under its control … by taking reasonable security safeguards to prevent personal data breach" [fetched]. Schedule item 1: penalty "May extend to two hundred and fifty crore rupees" [fetched]. No clause conditions that duty on whether the Data Principal holds a copy [fetched — read §8 and the Schedule in full].
- **Operationally, yes — it changes which failures are survivable.** With Tauri v2 local-first, for a desktop user the canonical file is on their disk and R2 is *our* backup of *their* primary; the RTO that matters is re-sync, not reconstruction [inference]. For a browser-only user, R2 *is* the primary and no such relief exists.
- **Commercially, it is the strongest claim you have and the easiest to void.** Recommendation: make the local copy a *tested* export — a scheduled, verified, plain-directory-of-`.md` mirror with a visible last-verified timestamp per device. **Anti-recommendation**: never let the export promise substitute for L3/L4. GitLab's users also all held local clones — repositories survived precisely because they were stored separately [fetched] — and the company still lost ~5,000 projects, ~5,000 comments and ~700 users of database state [fetched]. The parts the customer holds survive; everything *about* those parts still dies.
- **The hard conflict, name it in the runbook**: §8(7)(a) requires erasure on withdrawal of consent or when the purpose is no longer served, §8(8) deems the purpose no longer served after a prescribed inactivity period, and §12(3) adds erasure on request [fetched]. An `Indefinite` bucket lock [fetched] makes compliance impossible. Resolution [inference]: bucket-lock only the *backup* prefixes with a bounded `Age` equal to your stated retention window, never `Indefinite`, and make deletion a scheduled tombstone that propagates to L3/L4 within that window — then the maximum lag between an erasure request and true erasure is a number you can state. This also reconciles with LR#71: retain the raw record, except for secrets and except where a statutory erasure duty bites.

### 5. Silent-failure modes to instrument against

This studio has already lived the canonical one. Reproduced here, read-only [measured, 2026-08-29]:

```
set -e; QUIET=1
log() { [ "$QUIET" = "0" ] && echo "$1"; }        # trailing conditional
backup() { log "starting"; echo "THIS LINE NEVER RUNS"; }
backup; echo "reached end"
→ exit=1, zero output, neither line ran
```
With `if [ … ]; then … fi` instead: both lines run, `exit=0` [measured]. Nightly backups were disabled for weeks by exactly this (LR#55).

| Mode | How it stays silent | Instrument |
|---|---|---|
| Trailing `[ ] && cmd` under `set -e` | Function returns 1, `set -e` kills the caller before the upload; exit code is 1 but nothing watches it [measured] | `bash -n` in CI; lint-ban trailing conditionals; **assert bytes written**, never exit code |
| Write silently denied (sandbox, permission, quota) | `>>` fails, tool prints its success line having stored nothing (LR#67) | Count objects and bytes **before and after**; refuse if the count did not move |
| Major-version tool mismatch | GitLab: pg_dump 9.2 against PostgreSQL 9.6; "S3 bucket was empty" [fetched] | Restore-and-diff every run. A dump you have not read back is a file, not a backup |
| The alarm channel is the broken thing | GitLab: cron failure emails "rejected by the receiver" because DMARC was not enabled — "we were never aware of the backups failing, until it was too late" [fetched] | **Dead-man switch**: backup *pushes* a heartbeat; an independent watcher on a different provider pages on *absence*. Test the pager monthly by not sending |
| Field-name mismatch producer↔consumer | `bool(missing_key)` is False, indistinguishable from a real failure (LR#59) | Versioned manifest schema; the verifier reports **which key carried the number**; missing ⇒ UNKNOWN ⇒ refuse, never a falsy default |
| Substring gate | `grep -qE '0 FAIL'` matches inside `10 FAIL` (LR#60/#73) | Word-boundary anchors; numeric comparison, not text match |
| Green because the check is a proxy | A check that greps source proves nothing about behaviour (LR#60) | Every gate must **execute** a restore; label any source-grep check as PROXY in its own output |
| Backing up nothing | Source path moved/renamed; job succeeds over an empty tree | Assert object count within ±X% of live, and assert a **floor**, never an equality (LR#66) |
| Correlated deletion | Lifecycle rule plus a delete-propagating sync remove from every tier at once | L4 uses a write-only, delete-denied token and lags L3 by ≥7 days by design [inference] |
| No forensic trail | R2 audit logs exclude `GetObject`/`PutObject` [fetched] | Wire R2 **event notifications** (`object-create`, `object-delete`) to a Queue and archive them; up to 100 rules per bucket [fetched]. Alarm on delete-rate anomaly |

- Anti-recommendation to the dead-man switch: do not host the watcher on Cloudflare. A Cloudflare-wide event takes storage and watcher together — the Feb 2025 incident is exactly that shape [fetched].

### 6. Cost at 100 / 1,000 / 10,000 users

Assumptions, stated so they can be attacked: 200 docs/user, 5 active docs/user/day, mean doc 25 KB [**measured** — 590 markdown files in the local knowledge corpus: mean 24,851 B, median 4,023 B, p90 25,916 B], 8 coalesced saves/active doc/day (each = 1 new immutable version = 1 Class A), 40 GETs/active doc/day, 30-day version retention, nightly snapshot to IA ≈ 1× live, one B2 copy of live+snapshot. Prices [fetched 2026-08-29]: Standard $0.015/GB-mo, IA $0.010/GB-mo, Class A $4.50/M (IA $9.00/M), Class B $0.36/M (IA $0.90/M), egress free, free tier 10 GB-mo + 1 M Class A + 10 M Class B (Standard only); B2 $6.95/TB/30-day = $0.006787/GB-mo.

| Users | Live | Versions (30 d) | Std storage | Class A | Class B | IA snapshots | B2 | **Total/mo** | **Per user** |
|---|---|---|---|---|---|---|---|---|---|
| 100 | 0.48 GB | 2.86 GB | $0.00 (under free 10 GB) | $0.00 (140 k < 1 M) | $0.00 | $0.18 | $0.01 | **$0.19** | $0.0019 |
| 1,000 | 4.77 GB | 28.61 GB | $0.35 (23.38 GB billable) | $1.80 (400 k over) | $0.00 (6 M < 10 M) | $1.85 | $0.06 | **$4.06** | $0.0041 |
| 10,000 | 47.68 GB | 286.10 GB | $4.86 (323.79 GB) | $58.50 (13 M over) | $18.00 (50 M over) | $18.48 | $0.65 | **$100.48** | $0.0100 |

[derived; arithmetic executed, all inputs above]

**The load-bearing sensitivity — operations, not bytes.** At 10,000 users, storage is $23.34 and operations are $76.50 [derived]. Save granularity is the entire cost model:

| Saves/active doc/day | Writes/mo (10 k users) | Class A cost |
|---|---|---|
| 48 (near-keystroke) | 72,000,000 | $319.50 |
| 8 (coalesced ~3 h) | 12,000,000 | $49.50 |
| 1 (daily) | 1,500,000 | $2.25 |

Snapshot packing, same scale: per-object copy = 2,000,000 Class A (IA) = $18.00/mo; one packed archive per user per night = 300,000 = $2.70/mo [derived].

- Recommendation: coalesce versions on a debounce plus a semantic boundary, and pack nightly snapshots — a ~6× swing at 10 k users [derived].
- **Anti-recommendation**: do not coalesce past your stated RPO. Every minute of coalescing sells a minute of the customer's RPO for roughly a hundredth of a cent [derived]. And do not put anything you may need to restore in a hurry into Infrequent Access: IA carries a **30-day minimum storage duration**, Class A at $9.00/M, Class B at $0.90/M, and $0.01/GB retrieval [fetched] — a full 48 GB restore at 10 k users costs $0.48, trivial, but a monthly *verification* pass that reads all data pays it every time, and that is the fee that quietly discourages the drill you must not skip.
- Scale note: total backup spend at 10,000 users is ~$100/mo [derived] against a DPDP §8(5) ceiling of ₹250 crore [fetched]. That ratio is not an argument to spend more; it is the reason no cost argument may ever appear in a decision to skip a drill.