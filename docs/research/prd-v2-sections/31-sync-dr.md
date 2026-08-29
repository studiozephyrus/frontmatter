I made no writes, commits, or mutating commands — my run was two `Read` calls on the two research reports and nothing else; the dirty `~/.claude` skills/config and `~/.sgnk` bin state is not mine.

## 31. Sync architecture

**Decision: git three-way merge over a stored true base, mediated by server-issued revisions and compare-and-swap, with an append-only splice journal as a checkable derivative. Never a CRDT.** This is settled; the subsections below record why, so it is not re-litigated.

### 31.1 The decision and its three disqualifications

| # | Disqualification of a CRDT | Evidence |
|---|---|---|
| D1 | **A CRDT cannot own the file bytes.** The projection law says the file is the only source of truth and every view is a reversible projection owning no state. In a CRDT architecture the CRDT document *is* the record and the `.md` file becomes the projection — the axiom inverted. You also inherit history GC, snapshot compaction, and a second persistence format to back up. | [inference] on the stated product law; decision matrix scores CRDT 2/5 on byte fidelity for exactly this reason |
| D2 | **Convergence buys byte-identical garbage.** *The Art of the Fugue: Minimizing Interleaving in Collaborative Text Editing*, arXiv **2305.00583v3**, published 2023-04-30: when two users concurrently insert text at the same position, the merged outcome may interleave the inserted passages, "resulting in corrupted and potentially unreadable text… The problem has gone unnoticed for decades, and it affects both CRDTs and Operational Transformation." | [fetched] Loro's README credits Fugue for its text layer [fetched]; Yjs's YATA and Automerge's list algorithm predate it. Convergence is not the same property as zero loss [inference] |
| D3 | **A CRDT cannot refuse.** Refusal is not in the algebra — the entire design goal is that conflicts never surface. frontmatter's engine contract is locate-the-range, replace-those-bytes, REFUSE rather than guess. A substrate that structurally cannot refuse cannot implement that contract. | [inference]; CRDT scores 1/5 on both "conflict visibility" and "fit with refuse rather than guess" in the weighted matrix |

Weighted decision matrix (1–5, 5 best; weights ×3 for convergence, offline, byte fidelity, refuse-fit; ×2 for conflict visibility and solo-founder cost) [derived from the scored table]:

| Option | Weighted total /80 |
|---|---|
| **Git-merge + splice journal + CAS** | **74** |
| Git-only as transport | 69 |
| LWW + conflict copy (baseline) | 62 |
| CRDT (Yjs / Loro / Automerge) | 51 |
| Server-authoritative OT | 40 |
| Fuzzy patch — what Obsidian ships today | 32 |

**Measured: what fuzzy patching does to markdown.** `diff-match-patch@1.0.5` from unpkg, executed in node, instance defaults read live: `Match_Threshold 0.5, Match_Distance 1000, Patch_DeleteThreshold 0.5, Patch_Margin 4` [measured].

| Case | Setup | Result | Flag returned |
|---|---|---|---|
| Replay | Patch `one two three` → `one two three four`, applied to an already-advanced doc, then applied a **second** time | `one two three four four` | `results = [true]` **both times** [measured] |
| Fuzzy misapply through changed context | Base `The quick brown fox jumps…`; patch changes `jumps`→`leaps`; server text meanwhile says `brown cat` plus an appended sentence | `The quick brown cat leaps…` — applied an edit whose anchoring context no longer existed | `[true]` [measured] |
| Repetitive markdown | Six identical `- [ ] task` lines, tick the first; server has only three lines left | Ticks a line that is not the one that was ticked | `[true]` [measured] |

The library states the intent itself: "Use best-effort to apply patch even when the underlying text doesn't match", and its own API wiki concedes the success flags are unreliable because large patches "may get broken up internally… with no way to figure out which patch succeeded or failed" [fetched, github.com/google/diff-match-patch README + wiki/API]. The replay result reproduces the exact shape of forum.obsidian.md topic **94732** (created 2025-01-12, 105 posts, 4,342 views, "Obsidian Sync incorrectly duplicates sections of files", reporter in Restricted Mode with no plugins, **no merge-conflict notification and nothing in File Recovery**) [fetched]. Recorded disagreement, not resolved: Obsidian's docs say auto-merge "saves all edits"; topic 94732 reports content *added that was never typed* with no conflict logged [both fetched] — both cannot be true of the same algorithm.

**Measured: what git's three-way merge does to markdown.** `git version 2.50.1 (Apple Git-155)`, run via process substitution, no files written [measured].

| Case | Input | Result | Exit |
|---|---|---|---|
| M1 | A edits line 1, B edits line 3 | both applied cleanly | 0 |
| M2 | **Both append at EOF** | conflict markers, nothing lost | 1 |
| M3 | A edits para 1, B edits para 2 | both applied cleanly | 0 |
| M4 | No trailing newline, identical sides | bytes `41 0a 42` — trailing-newline absence preserved | 0 |
| M5 | CRLF file, one side edits | bytes `41 0d 0a 42 32 0d 0a` — CRLF preserved verbatim | 0 |
| M6 | **`--union` on same-line conflict**, `title: mine` vs `title: theirs` | emits **both lines** — silently invents a document with two `title:` keys | 0 |
| M7 | Empty base, no common ancestor | conflict markers, no guessing | 1 |
| M8 | Whitespace-only divergence, `item\t` vs `item␣␣` | conflict markers — invisible-character divergence surfaced, not swallowed | rc masked by pipe |
| M9 | File already contains `<<<<<<< HEAD` | **nested markers**; result unparseable as a merge | 1 |

git's merge is byte-faithful and conservative: it preserves CRLF and missing-final-newline exactly (M4, M5) and refuses (M2, M7, M8) precisely where a splice writer would want to refuse [measured]. **`git merge-file --union` is BANNED in every code path — it is the one mode that guesses, and M6 shows it manufacturing a document with two `title:` keys and exit 0** [measured]. M9 is a live hazard for a markdown editor whose users write about git.

**Honest counter-argument.** The reason Obsidian uses diff-match-patch is that conservative merging produces conflicts users hate. M8 is the proof against our own position: a tab-versus-two-spaces divergence — invisible to the human — produces conflict markers and a scary artifact [measured]. If frontmatter's conflict rate is materially higher than Obsidian's, "refuses rather than guesses" reads to a paying user as "loses my flow", they churn, and the churn is never attributed to it. Mitigation that makes the counter-argument falsifiable: ship conflicts per 1,000 syncs, sliced by cause, as a first-class metric, publish it, and hold a budget. If the measured rate exceeds budget, the fix is **finer merge granularity, never a fuzzier apply**. What would falsify the whole decision: a measured conflict rate on real prose vaults that finer granularity cannot bring under budget. That number is currently **unmeasured** — `git merge-file` was not run against a large real vault.

Anti-recommendations, each with its evidence:

- Do not adopt Yjs, Automerge or Loro for the document body. Library facts read 2026-08-29: `yjs` **13.6.32** (published 2026-08-04T08:18:16Z), `loro-crdt` **1.15.0** (2026-08-27T01:45:21Z), `@automerge/automerge` **3.4.1** (2026-08-12T08:28:28Z) [fetched]. `yjs/dist/yjs.mjs` is 299,797 B raw / **62,586 B gzip**; `loro-crdt` bundler wasm is 3,181,087 B raw / **1,046,181 B gzip** — 1,046,181 ÷ 62,586 = **16.71×** [measured, derived]. Automerge 3.0's headline is cutting memory "by over 10x" versus Automerge 2, an admission of how heavy full-history CRDTs were [fetched]. *Narrow exception*: if live multi-cursor collaboration ships later, use Yjs **ephemerally** for the in-session channel and persist only splices to the file.
- Do not use diff-match-patch anywhere in the write path. It is acceptable as a read-only visual diff renderer only.
- Do not build server-authoritative OT: 1/5 on true-offline, 2/5 on refuse-fit, the transform-function matrix is the canonical solo-founder time sink, and per Fugue it does not escape interleaving anyway [fetched].
- Do not ship git-as-transport (`isomorphic-git` **1.41.9**, published 2026-08-23T11:26:35Z [fetched]) on mobile. Obsidian Git's own README: mobile is "very unstable", no SSH auth, limited repo size from memory restrictions, and "Obsidian may crash on clone/pull, create buffer overflow errors, run indefinitely… I don't know how to fix this" [fetched]. Use git's *merge algorithm*, not git's *transport*.
- Do not resolve conflicts by timestamp. Syncthing's documented last resort is the "larger value of the first 63 bits of device ID" [fetched] — that is what timestamp ordering degenerates into once clocks tie.
- Do not market "conflict-free". Visible conflicts are the deliberate choice; the honest line is that frontmatter will sometimes ask a question and will never answer one for you.

### 31.2 The design

| Component | Rule | Rationale |
|---|---|---|
| **Server role** | A byte store with compare-and-swap. It never merges. | R2's Workers API supports `put(..., { onlyIf: { etagMatches } })`, and "if the condition check for `put()` fails, `null` will be returned" [fetched, developers.cloudflare.com/r2/api/workers/workers-api-reference] — a real optimistic-concurrency primitive |
| **Serialization point** | Durable Object per document for the monotonic revision counter and per-document lock | DOs are "single-threaded and cooperatively multi-tasked" with "durable, transactional, and strongly consistent storage… accessible only within that object" [fetched] |
| **Ordering** | Server-issued revision, total. No wall clock on any correctness path. | Removes clock skew, VM resume and travelling users from the ordering decision entirely [inference] |
| **Client state per document** | `base_bytes` (verbatim bytes of the last synced revision), `working_bytes`, and an append-only splice journal of `{seq, base_digest, offset, deleted_len, inserted_bytes, result_digest}` | These are the records the splice engine already produces — no second document model [inference] |
| **Journal authority** | The journal is a **checkable derivative, never authority.** `fold(journal, base_bytes) == working_bytes` must hold at every boundary; if it does not, refuse to sync and fall back to whole-file conflict copy | Preserves "the file is the only source of truth" while still yielding an oracle [inference] |
| **Merge granularity** | line-based diff3 over a *sentence-normalised* token stream, then re-emit original bytes for unchanged regions | Markdown prose is often one paragraph per line, so raw-line diff3 conflicts on every co-edited paragraph [inference] |
| **Clocks** | HLC-style timestamps for display and tie-breaking only | Hybrid Logical Clocks give causality plus bounded closeness to physical time without TrueTime's GPS/atomic infrastructure and its 6 ms ε [fetched, Kulkarni & Demirbas]. In practice unused, because the server revision is total |

Reconnect protocol, ordered:

1. Fetch server bytes and etag.
2. If `etag == my base etag` → CAS-upload `working_bytes`. Done.
3. Otherwise run a three-way merge **with the true base that was stored** — never a diff against the winner, which is what fuzzy patching does.
4. Clean merge → CAS-upload merged bytes. CAS failure → return to step 1 (another device won the race).
5. Conflict → **REFUSE.** Write `note (conflict <device> <server-rev>).md` holding *your* bytes untouched, leave the server bytes as the file, surface it in the UI.
6. Never write conflict markers into the user's `.md`. M9 shows why: a document already containing `<<<<<<< HEAD` produces nested markers and an unparseable result [measured].

Mobile and background sync:

- **Background Sync API is unavailable on the two hardest targets.** browser-compat-data `api/SyncManager`: Chrome 49, Edge/Opera mirrored, **Firefox `false`**, **Safari `false`** (WebKit bug 182565), `safari_ios` mirrors Safari, `webview_android` `false` (crbug 40449796); MDN labels it "Limited availability… not Baseline" [fetched].
- **Safari storage is evictable by default.** WebKit policy (Aug 10, 2023; Safari 17 / iOS 17): origin quota up to 60% of disk for browser apps and 15% for other apps, overall quota 80% / 20%, eviction LRU by origin and whole-origin, triggered by overall quota, storage pressure, or ITP-driven non-interaction; persistence "based on heuristics like whether the website is opened as a Home Screen Web App" [fetched].
- Native iOS gives no guaranteed window either: `BGAppRefreshTaskRequest` is "a short refresh task", `BGProcessingTaskRequest` "a processing task that can take minutes" — both are requests the system schedules [fetched]. The market leader does not attempt it: Obsidian's FAQ answers "Is my data being synced in the background?" with **"No"** [fetched].
- Do therefore: sync on `visibilitychange`, on `pagehide`, and on foreground focus; use Background Sync only as a Chrome-only optimisation behind a feature check; attempt `BGProcessingTask` in the Tauri v2 iOS app as best-effort, never as a correctness dependency; call `navigator.storage.persist()` and **surface the result** in plain words when it is denied.
- **Never display "Fully synced" unless the server has ACKed a revision whose digest equals the local file's digest.** Forum topic **116380** (created 2026-07-23, 3 posts, 65 views; Obsidian 1.12.7 / installer 1.9.14 / Windows 11, Restricted Mode, default theme) reports the final 10–15 Korean characters missing while the log said only "Fully synced", healing never [fetched]. That is a UI that lied.
- **Anti-recommendation**: do not build Web Push–triggered sync to work around the missing Background Sync API. It requires notification permission for a non-notification purpose, will be denied by most users, and yields a worse funnel than an honest "open the app to sync."

### 31.3 The convergence oracle — proving zero loss, not observing it

Two devices, offline, reconnect, human watching is a *demonstration*. The proof is five mechanical layers.

| Layer | Assertion | What it catches — and what it does not |
|---|---|---|
| 1. Digest equality | SHA-256 of final bytes equal on both devices **and** on the server | Catches divergence. Catches **no loss** — both devices can converge on a truncated file |
| 2. **Splice-conservation invariant** | For every journal record acknowledged to the user, `inserted_bytes` occurs as a contiguous byte subsequence of the converged document **or** appears byte-identically inside a named conflict artifact with a stable id. Formally `⋃ inserted(A) ∪ ⋃ inserted(B) ⊆ bytes(converged) ⊎ bytes(conflict artifacts)`, each element attributable to exactly one destination | Loss = any inserted run present in neither. **This is what "zero loss" means; digest equality is not it** |
| 3. Deletion-intent invariant | Bytes a device deleted are absent from the converged doc unless concurrently re-inserted by the peer; a byte reappearing with no re-insertion record is a resurrection bug | The M6 / `--union` failure class [measured] |
| 4. Seeded deterministic network simulator | Single process, virtual clock, scriptable partition schedule. Random splice programs against a corpus of **real** markdown: frontmatter, CRLF files, no-final-newline files, files containing `<<<<<<<`, mixed indentation, emoji/CJK spanning multi-byte boundaries. ≥10,000 seeded schedules per release; every failure checked in as a fixture with its seed | Rare faults that a live demo will never draw (LR#68) |
| 5. Permutation-invariance and idempotence | Apply the same op set in k sampled orders, assert identical digests. Assert explicitly that replaying an already-applied op is a no-op | Non-commutativity is a bug even when nothing is lost. The measured `four four` result is an idempotence violation that DMP's own `true` flag hid [measured] |

**The rule for the harness itself: the oracle must first be shown to FAIL against a deliberately broken merger.** Wire diff-match-patch in as a known-bad backend in CI; if the suite goes green on it, the suite is measuring nothing (LR#60, LR#68). Anti-recommendation: do not accept a passing suite as evidence of correctness until that red run is on record for the current release.

### 31.4 Failure modes to test

| # | Failure | Trigger | Assertion |
|---|---|---|---|
| F1 | Editor buffer not flushed before sync reads the file | forum 116380 [fetched] | Bytes handed to the sync engine == bytes in CodeMirror's doc, digest-compared, on every upload |
| F2 | Patch replay duplication | Reconnect retries, at-least-once delivery | Idempotence: applying rev N twice yields an identical digest [measured failure in DMP] |
| F3 | Fuzzy apply into changed context | Base drifted | Merge refuses unless base digest matches exactly |
| F4 | Both append at EOF | Classic offline case | Conflict artifact, both texts recoverable (M2 shows git does this correctly) |
| F5 | Torn or partial write | Crash mid-save, iOS jetsam | Write temp → `fsync` file → atomic `rename` → `fsync` directory; SQLite's rollback-journal discipline is the reference model [fetched, sqlite.org/atomiccommit.html] |
| F6 | Conflict markers already in the user's prose | Markdown about git | Refuse to auto-merge any file matching `^(<<<<<<< \|=======$\|>>>>>>> )` (M9) |
| F7 | Multi-byte character split at a splice offset | CJK / emoji, LR#68 | Every offset lands on a UTF-8 boundary; the corpus must contain the Korean case from 116380 |
| F8 | Frontmatter duplicate keys | Any union-style merge | Post-merge parse: duplicate top-level YAML key ⇒ refuse (M6) |
| F9 | Whitespace-only divergence | Tab vs spaces | Must be classified, not silently resolved (M8) |
| F10 | Delete-vs-edit race | One device deletes, other edits | Never delete; materialise as a conflict artifact (Syncthing's documented behaviour) [fetched] |
| F11 | Third-party sync layered on the vault | User has iCloud or Dropbox over the folder | Detect and warn — Obsidian documents that on-demand / online-only files are read as *deleted* and removed from the remote vault [fetched] |
| F12 | Clock skew, device clock set backwards | Travelling user, VM resume | No correctness path may read `Date.now()` |
| F13 | Storage evicted under the app | Safari / PWA, LRU whole-origin eviction [fetched] | Unsynced local edits must be detectable as missing, never silently treated as "nothing to sync" |

Incumbent behaviour, for reference when specifying these tests [all fetched 2026-08-29]:

| System | Mechanism on concurrent edit | Text merge | Loss surface |
|---|---|---|---|
| Obsidian Sync | Markdown merged with `diff-match-patch`; all other types including canvas are last-modified-wins. Since **1.9.7**, a per-device toggle: *Automatically merge* (default) or *Create conflict file* named `note (Conflicted copy <device> YYYYMMDDHHMM).md` | Yes, fuzzy | Docs warn auto-merge "may sometimes create duplicate text or formatting problems". The setting is **device-local**, so two devices can disagree about policy. Documented hole: a note created locally and re-downloaded within a couple of minutes keeps the remote version "without merging" |
| Syncthing | Never merges. Older mtime renamed `<name>.sync-conflict-<date>-<time>-<modifiedBy>.<ext>`; ties broken by device-ID bits | No | Wall clocks decide the winner; conflict copies propagate as ordinary files and multiply across the cluster |
| Dropbox | Conflicted copy; "The last version saved will always appear as the conflicted copy"; manual merge recommended (page updated May 15, 2025) | No | Auto-save apps generate spurious conflicts |
| iCloud Drive | "one file is chosen as the current version and any other versions are tagged as being in conflict"; the app must resolve via `NSFileVersion.unresolvedConflictVersionsOfItem(at:)` | No | If the app never resolves, conflicts persist server-side, invisible in most editors |
| git | Three-way merge against a real common ancestor, `ort` default, conflicts marked, exit code = conflict count | Yes, line-based, refuses on overlap | Needs a stored base; line granularity is coarse for prose |
| Resilio | **Unverified.** `help.resilio.com` returned HTTP `000` on 3 URL variants and `resilio.com/blog/file-conflict-resolution` returned 404 [measured] — not paraphrased from memory | — | — |

Open questions carried into build, none of which may be reported as settled: Obsidian's *server-side* algorithm beyond the docs' DMP claim (no post-mortem published for topic 94732); whether the 116380 loss is a CodeMirror flush bug, an IME-composition boundary bug, or a sync-read race (no maintainer diagnosis in the thread as of fetch); and the conflict rate of `git merge-file` on a large real prose vault — the single number that decides whether §31.1's counter-argument survives.

## 32. Backup, restore and disaster recovery

### 32.1 The finding that reorders this — R2 has no object versioning

| Fact | Evidence |
|---|---|
| `GetBucketVersioning` ❌, `PutBucketVersioning` ❌, `GetObjectLockConfiguration` ❌, `PutObjectLockConfiguration` ❌ on the R2 S3 API compatibility matrix (page "Last updated Jul 31, 2026"). No versioning page exists in the R2 sidebar or in `r2/llms.txt` | [fetched 2026-08-29] |
| `DeleteObject`, `DeleteBucket`, `AbortMultipartUpload` are **free operations** — a runaway delete loop costs the bug nothing | [fetched] |
| "Emptying a bucket is irreversible. All objects in the bucket are permanently deleted." "Objects removed during this process cannot be recovered." Bucket lock rules **must be removed first** | [fetched] |
| Audit logs are control-plane only: "Logs for data access operations, such as `GetObject` and `PutObject`, are not included." There is no object-level forensic trail by default | [fetched] |
| R2 durability doc, verbatim: "Durability does not prevent intentional or accidental deletion of data." Eleven nines protects against disks, not against you | [fetched] |

**The standard cloud DR recipe does not port. AWS's own whitepaper recommends S3 Cross-Region Replication "while providing versioning for the stored objects so that you can choose your restoration point" [fetched] — on R2, versioning must be built in the key layout, not bought.** Consequence for the build: L0 is content-addressed immutable keys `u/{uid}/d/{docid}/v/{ts}-{sha256}` that are never overwritten, plus a tiny `HEAD` pointer object per document. Overwrite ceases to be a failure mode because overwrites do not exist; deletion becomes the only loss vector, and it is free and untraced. Every layer below exists to answer deletion. Anti-recommendation: do not design as if a versioning toggle will arrive — if Cloudflare ships `PutBucketVersioning`, treat it as defence in depth on top of the key layout, never as a replacement for it.

### 32.2 RPO and RTO by data class

Definitions verbatim from AWS Well-Architected REL13 [fetched]: RTO is "the maximum acceptable delay between the interruption of service and restoration of service"; RPO is "the maximum acceptable time after the last data recovery point". The same page names "You select arbitrary recovery objectives" as an anti-pattern — hence the reasoning column.

| Class | RPO | RTO single user, self-serve | RTO whole tenant | RTO platform | Reasoning |
|---|---|---|---|---|---|
| **Document bytes** | 0 for any acknowledged write; ≤5 min for the off-provider copy | ≤60 s | ≤4 h | ≤24 h | The engine's contract is byte-preserving splice-or-REFUSE; a backup that loses the last N minutes contradicts the product's own promise [inference]. R2 returns 200 "only when data has been persisted to disk" [fetched], so RPO 0 on the write path needs no extra work — the RPO actually under our control is the *second* copy |
| **Version history** | ≤5 min | ≤5 min | ≤4 h | ≤24 h | Undo across sessions is what customers think "backup" means; cheaper to keep as immutable content-addressed objects than to reconstruct [derived] |
| **Metadata** (doc index, titles, folders, share state) | ≤5 min | ≤5 min | ≤1 h | ≤4 h | Make metadata a *projection of the object keys*, rebuildable by `ListObjects`, exactly as every view is a projection of the file. Metadata loss then becomes a rebuild, not a restore [inference] |
| **Published pages** | = document RPO | ≤15 min | ≤4 h | ≤24 h | Deterministic renders. Regenerate, never restore. The only irreducible state is the URL↔document binding, which belongs in metadata [inference] |
| **Billing records** | 0 | n/a | ≤24 h | ≤72 h | Keep the payment processor as system of record and hold a read-mirror only; total loss of our copy is a re-sync, not a reconstruction [inference]. Retention period is a statutory question **not verified** — check Companies Act 2013 §128 before setting it |
| **Auth / identity** | 0 for identity rows; sessions expendable | n/a | ≤1 h | ≤4 h | Forced re-login is an annoyance; a lost identity row orphans a paying user's documents [inference] |

- **Anti-recommendation: do not set RPO 0 on the backup tier.** Continuous replication "may not protect against disaster events such as data corruption or malicious attack (such as unauthorized data deletion) as well as point-in-time backups" [fetched, AWS DR whitepaper]. A zero-lag mirror faithfully replicates your DELETE.
- Does the user holding their own copy reduce the obligation? **Legally no**: DPDP §8(5) places the duty on the Data Fiduciary to protect personal data in its possession or under its control by taking reasonable security safeguards; Schedule item 1 penalty "May extend to two hundred and fifty crore rupees"; no clause conditions the duty on whether the Data Principal holds a copy [fetched, §8 and Schedule read in full]. **Operationally yes**: for a Tauri v2 desktop user the canonical file is on their disk and R2 is our backup of their primary, so the RTO that matters is re-sync; for a browser-only user R2 *is* the primary and no relief exists [inference]. **Commercially it is the strongest claim available and the easiest to void** — make the local copy a *tested* export, a scheduled verified plain-directory-of-`.md` mirror with a visible last-verified timestamp per device. Anti-recommendation: the export never substitutes for L3/L4. GitLab's users all held local clones and repositories survived because they were stored separately, and the company still lost roughly 5,000 projects, 5,000 comments and 700 users of database state [fetched].

### 32.3 The layered architecture and what each layer does NOT cover

| Layer | Protects against | Does NOT protect against |
|---|---|---|
| **L0 — R2 primary, content-addressed immutable keys** `u/{uid}/d/{docid}/v/{ts}-{sha256}`, never overwritten, plus a `HEAD` pointer per doc | Disk and datacentre failure (eleven nines, erasure coding, synchronous writes) [fetched]; accidental overwrite, because there are none | **Deletion of any kind.** `DeleteObject` is free [fetched]. Account compromise. Bucket empty |
| **L1 — Bucket lock**, `Age`-bounded, on the `u/` prefix | Delete and overwrite of locked objects per prefix, "for a specified period — or indefinitely" [fetched] | Nothing once the lock is removed — and removal is *required* before emptying a bucket [fetched], so this is a speed bump with a documented removal procedure, not a vault. `Indefinite` also blocks DPDP §8(7)(a) erasure |
| **L2 — Lifecycle rules**, transition `v/` older than 30 d to Infrequent Access | Cost only | Data loss. Lifecycle is a *deletion engine*: "the expire (or delete) lifecycle transition takes precedence" on conflict, and `LifecycleDeletion` is one of only two delete triggers [fetched]. Misconfiguring L2 is itself a top-3 loss scenario |
| **L3 — Nightly restic-format repo → second R2 bucket**, separate account, separate API token, write-only | Bugs in our own code; single-token compromise; bucket-empty on the primary | Cloudflare-wide account action. The Feb 6 2025 incident took 100% of R2 APIs down 08:14→09:13 UTC because a *routine abuse remediation* disabled the Gateway [fetched] — one blast radius covers both buckets |
| **L4 — Weekly full → Backblaze B2**, different provider, different country, different credential store | Provider-level loss or account termination — the UniSuper failure mode: "one input parameter was left blank", default 1-year term, automatic deletion, "No customer notification was sent" [fetched] | Ransomware resident longer than retention. Correlated encryption-key loss |
| **L5 — Encrypted monthly archive on physical media, offline** | Everything above, plus total credential compromise | Being forgotten. Requires a human hand [inference] |
| **git — application code, schema, IaC, runbooks; NOT customer documents** | Config and code loss; auditable change history | Customer documents. GitHub Docs, verbatim: "Git is not designed to serve as a backup tool" [fetched] |

Why git is not the document substrate [all fetched unless marked]: files >100 MiB are **blocked**, >50 MiB warned, browser upload capped at 25 MiB, repos "ideally less than 1 GB, and less than 5 GB is strongly recommended"; pasted images and attachments defeat delta compression and grow packs monotonically [inference]; history rewrite destroys silently, since `gc.reflogExpire` defaults to **90 days**, `gc.reflogExpireUnreachable` to **30 days**, and `gc` calls `prune --expire 2.weeks.ago` [fetched; confirmed unset locally on git 2.50.1 [measured]]; the reflog is local and unpushed, so a fresh clone of a force-pushed repo has no undo record at all [inference]; and `git filter-repo` is simultaneously the correct DPDP erasure tool and the correct data-destruction accident — same command shape, opposite intent [inference]. **Anti-recommendation: do not put per-user document repos on GitHub for the free versioning** — it adds a data processor under DPDP, caps documents at 100 MiB, and buys a version store a single `gc` can prune.

Recorded disagreement, unresolved: CISA's 3-2-1 rule requires "2 different media types to protect against different types of hazards" [fetched]. An all-object-storage stack (L0–L4) satisfies three copies and one offsite but violates the two-media clause literally. L5 exists only to satisfy that clause; whether the clause is meaningful in 2026 is a judgement call, not a fact.

The statutory conflict, which must be named in the runbook: DPDP §8(7)(a) requires erasure on withdrawal of consent or when the purpose is no longer served, §8(8) deems the purpose no longer served after a prescribed inactivity period, and §12(3) adds erasure on request [fetched]. An `Indefinite` bucket lock makes compliance impossible. Resolution [inference]: bucket-lock only the *backup* prefixes with a bounded `Age` equal to the stated retention window, never `Indefinite`, and make deletion a scheduled tombstone that propagates to L3/L4 within that window — the maximum lag between an erasure request and true erasure then becomes a number that can be stated publicly. **The DPDP Rules 2025 breach-notification deadline and the prescribed inactivity period under §8(8) were NOT opened** — meity.gov.in returned empty bodies, PRS and egazette returned 404/000 [measured]. Do not write a 72-hour figure into the runbook from memory.

Cost, so no layer is skipped on a price argument. Assumptions stated so they can be attacked: 200 docs/user, 5 active docs/user/day, mean doc 25 KB [**measured** — 590 markdown files in the local corpus: mean 24,851 B, median 4,023 B, p90 25,916 B], 8 coalesced saves/active doc/day, 40 GETs/active doc/day, 30-day version retention, nightly snapshot to IA ≈ 1× live, one B2 copy of live+snapshot. Prices [fetched 2026-08-29]: Standard $0.015/GB-mo, IA $0.010/GB-mo, Class A $4.50/M (IA $9.00/M), Class B $0.36/M (IA $0.90/M), egress free, free tier 10 GB-mo + 1 M Class A + 10 M Class B (Standard only); B2 $6.95/TB/30-day = $0.006787/GB-mo.

| Users | Live | Versions (30 d) | Std storage | Class A | Class B | IA snapshots | B2 | **Total/mo** | **Per user** |
|---|---|---|---|---|---|---|---|---|---|
| 100 | 0.48 GB | 2.86 GB | $0.00 | $0.00 | $0.00 | $0.18 | $0.01 | **$0.19** | $0.0019 |
| 1,000 | 4.77 GB | 28.61 GB | $0.35 | $1.80 | $0.00 | $1.85 | $0.06 | **$4.06** | $0.0041 |
| 10,000 | 47.68 GB | 286.10 GB | $4.86 | $58.50 | $18.00 | $18.48 | $0.65 | **$100.48** | $0.0100 |

[derived; arithmetic executed on the inputs above]

At 10,000 users storage is $23.34 and operations are $76.50 [derived] — save granularity, not bytes, is the cost model: 48 saves/active doc/day = 72,000,000 writes/mo = $319.50 Class A; 8 = 12,000,000 = $49.50; 1 = 1,500,000 = $2.25 [derived]. Per-object snapshot copies cost 2,000,000 Class A (IA) = $18.00/mo against $2.70/mo for one packed archive per user per night [derived]. Do coalesce versions on a debounce plus a semantic boundary and pack nightly snapshots — a ~6× swing at 10 k users. **Anti-recommendation: do not coalesce past the stated RPO** — every minute of coalescing sells a minute of the customer's RPO for roughly a hundredth of a cent [derived] — and do not put anything needing a hurried restore into Infrequent Access, which carries a **30-day minimum storage duration** and $0.01/GB retrieval [fetched]; a full 48 GB restore at 10 k users is $0.48, trivial, but a monthly verification pass that reads all data pays it every time, and that is the fee that quietly discourages the drill that must not be skipped. Total backup spend at 10,000 users is ~$100/mo against a DPDP §8(5) ceiling of ₹250 crore — that ratio is not an argument to spend more, it is the reason no cost argument may ever appear in a decision to skip a drill.

### 32.4 The restore drill

Runbook, ordered; every step names its verification.

1. **Declare and freeze.** Disable the write path via a flag whose store is *not* R2. The Feb 2025 lesson, verbatim: "this tooling was unavailable because it relies on R2" [fetched] — the recovery lever must not sit behind the broken thing.
2. **Classify**: single-doc | single-tenant | metadata-only | whole-bucket | provider-level. Pick the shallowest layer that covers it; L4 restores are not for one deleted file.
3. **Restore to a NEW bucket**, never over the damaged one. Prevents compounding and preserves the corrupt artifact as evidence.
4. **Verify before cutover, byte-level, not object-count.** `sha256` every restored object against the manifest recorded at backup time; refuse cutover on any mismatch. Object count alone passes when every object is zero bytes — GitLab's S3 bucket was simply *empty* [fetched; inference].
5. **Rebuild metadata from keys**, do not restore it. If L0's key layout is the addressing scheme, this is a `ListObjects` sweep.
6. **Cut over and record actual RPO and RTO in wall-clock**, not "we met target". GitLab's honest numbers: 6 h 10 m of lost writes (17:20→23:30 UTC) and roughly 18 h of copying at ~60 Mbps [fetched].
7. **Notify.** DPDP §8(6) requires intimation to the Board *and each affected Data Principal* in the prescribed form and manner; failure carries a ceiling of **two hundred crore rupees** (Schedule item 2) [fetched]. The prescribed deadline lives in the Rules, which could not be opened — confirm before writing it in.

| Cadence | Drill | Proves | Confirmed by |
|---|---|---|---|
| Every backup run | Restore one randomly chosen object, compare sha256 to source | The write landed, with these bytes | Machine gate; the run *refuses* and pages on mismatch |
| Weekly | Restore 1 synthetic tenant (~200 docs) into a scratch bucket, diff the whole tree, measure seconds | Single-tenant RTO is real | Machine; publishes a signed `last-good-restore` record with duration |
| Monthly | `restic check --read-data` on L3 and L4 — default `check` verifies structure only; `--read-data` is required to verify pack files on disk [fetched] | The bytes, not just the index | Machine |
| Quarterly | Cold restore from L4 into a brand-new provider account, from the runbook only, laptop wiped of ambient credentials, timed | The runbook is complete and the credentials are recoverable | Founder, timed, written up |
| Annually | Full DR assuming the Cloudflare account is gone; restore from L5 media | Independence from the primary provider | Founder plus one named external witness |
| Annually | **Restore-refusal drill** — corrupt one pack deliberately, confirm the gate goes red | The verifier can fail | Founder |

**A drill that has never failed is not evidence the drill works — break it on purpose once a year, or the green is uninterpretable** (LR#68: a green suite is the expected result of running it, not evidence of a fix). For a solo founder, no drill's outcome may be a human judgement: every drill emits a machine-readable record and a *second, separately-hosted* watcher pages when that record goes stale, because absence of an alarm is not a pass. **Anti-recommendation: do not host that watcher on Cloudflare** — a Cloudflare-wide event takes storage and watcher together, which is exactly the shape of the Feb 2025 incident [fetched].

Silent-failure modes to instrument against. This studio has already lived the canonical one; reproduced read-only [measured, 2026-08-29]: under `set -e`, a `log()` whose last line is a trailing `[ "$QUIET" = "0" ] && echo "$1"` returns 1, kills the caller, and produces exit 1 with zero output and neither subsequent line run; rewritten as `if [ … ]; then … fi`, both lines run and exit is 0. Nightly backups were disabled for weeks by exactly this (LR#55).

| Mode | How it stays silent | Instrument |
|---|---|---|
| Trailing `[ ] && cmd` under `set -e` | Function returns 1, `set -e` kills the caller before the upload; exit code is 1 but nothing watches it [measured] | `bash -n` in CI; lint-ban trailing conditionals; **assert bytes written**, never exit code |
| Write silently denied (sandbox, permission, quota) | `>>` fails and the tool prints its success line having stored nothing (LR#67) | Count objects and bytes before and after; refuse if the count did not move |
| Major-version tool mismatch | GitLab: `pg_dump` 9.2 against PostgreSQL 9.6; "S3 bucket was empty" [fetched] | Restore-and-diff every run. A dump you have not read back is a file, not a backup |
| The alarm channel is the broken thing | GitLab: cron failure emails "rejected by the receiver" because DMARC was not enabled — "we were never aware of the backups failing, until it was too late" [fetched] | Dead-man switch: the backup *pushes* a heartbeat, an independent watcher on a different provider pages on *absence*. Test the pager monthly by not sending |
| Field-name mismatch producer↔consumer | `bool(missing_key)` is False, indistinguishable from a real failure (LR#59) | Versioned manifest schema; the verifier reports **which key carried the number**; missing ⇒ UNKNOWN ⇒ refuse, never a falsy default |
| Substring gate | `grep -qE '0 FAIL'` matches inside `10 FAIL` (LR#60, LR#73) | Word-boundary anchors; numeric comparison, never text match |
| Green because the check is a proxy | A check that greps source proves nothing about behaviour (LR#60) | Every gate must **execute** a restore; label any source-grep check as PROXY in its own output |
| Backing up nothing | Source path moved or renamed; the job succeeds over an empty tree | Assert object count within ±X% of live, and assert a **floor**, never an equality (LR#66) |
| Correlated deletion | A lifecycle rule plus a delete-propagating sync remove from every tier at once | L4 uses a write-only, delete-denied token and lags L3 by ≥7 days by design [inference] |
| No forensic trail | R2 audit logs exclude `GetObject` / `PutObject` [fetched] | Wire R2 **event notifications** (`object-create`, `object-delete`) to a Queue and archive them, up to 100 rules per bucket [fetched]; alarm on delete-rate anomaly |
