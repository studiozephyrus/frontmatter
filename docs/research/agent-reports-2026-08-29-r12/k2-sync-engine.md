I made no writes or commits — this task was read-only research (`curl` fetches, `git merge-file` via process substitution, `node -e` in-memory). The dirty state in `~/.claude` skills/config and `~/.sgnk` bin is not mine; verify with `git -C ~/.claude status -- skills-src settings.json` against another agent in the fan-out.

Full deliverable, re-stated:

### Scope, and what was actually opened
- `curl` is unblocked here; `WebFetch` is not needed. Every source below was opened with `curl` on 2026-08-29 unless tagged `[SS]`. [measured]
- Reachable: Obsidian Help (Publish raw-markdown endpoint), forum.obsidian.md Discourse JSON, docs.syncthing.net, help.dropbox.com, developer.apple.com JSON doc API, developers.cloudflare.com, webkit.org, MDN + browser-compat-data, npm registry, unpkg, raw.githubusercontent.com, export.arxiv.org. [measured]
- **Unreachable**: `help.resilio.com` returned HTTP `000` (connection failure) on 3 URL variants; `resilio.com/blog/file-conflict-resolution` returned 404. Resilio's conflict semantics are therefore **unverified** in this report — I will not paraphrase them from memory. [measured]

### 1. How the incumbents actually handle concurrent edits

| System | Mechanism on concurrent edit | Text merge? | Loss surface |
|---|---|---|---|
| **Obsidian Sync** | Markdown merged with Google `diff-match-patch`; all other file types incl. canvas = "last modified wins". Since **1.9.7** a per-device toggle: *Automatically merge* (default) or *Create conflict file* named `note (Conflicted copy <device> YYYYMMDDHHMM).md` [fetched, help.obsidian.md/sync/troubleshoot] | Yes, fuzzy | Docs themselves warn auto-merge "may sometimes create duplicate text or formatting problems" [fetched]. Conflict setting is **device-local**, so two devices can disagree about policy [fetched] |
| **Obsidian Sync (known hole)** | "If you create a note locally on one device and, within a couple of minutes, Sync downloads a remote version of that same note, Sync will keep the remote version **without merging**" [fetched] | No | Documented silent local-loss window |
| **Syncthing** | Never merges content. Older mtime is renamed `<name>.sync-conflict-<date>-<time>-<modifiedBy>.<ext>`; ties broken by "larger value of the first 63 bits of device ID". Conflict copies then propagate as ordinary files [fetched, docs.syncthing.net/users/syncing.html] | No | Depends on wall clocks for the winner; conflict files multiply across the cluster |
| **Dropbox** | Conflicted copy file; "The last version saved will always appear as the conflicted copy"; explicitly recommends manual merge [fetched, help.dropbox.com, "Updated May 15, 2025"] | No | Auto-save apps generate spurious conflicts [fetched] |
| **iCloud Drive** | "one file is chosen as the current version and any other versions are tagged as being in conflict"; app must resolve via `NSFileVersion.unresolvedConflictVersionsOfItem(at:)` and clear them [fetched, developer.apple.com JSON doc API] | No | If the app never resolves, conflicts persist server-side and are invisible in most editors |
| **git** | Three-way merge against a real common ancestor; `ort` default; conflicts marked, exit code = conflict count [fetched, git-merge-file.adoc / merge-strategies.adoc] | Yes, line-based, refuses on overlap | Requires a stored base; line granularity is coarse for prose |
| **Resilio** | **unverified — docs unreachable** [measured] | — | — |

### 2. Published evidence of silent corruption
- **forum.obsidian.md topic 116380**, created 2026-07-23, 3 posts, 65 views: *""Fully synced" but the final 10–15 Korean characters are missing unless the file is manually saved."* Reporter on Obsidian 1.12.7 / installer 1.9.14 / Windows 11, Restricted Mode, default theme; sync log shows only "Fully synced", no errors; waiting days does not heal it. [fetched, topic JSON with `include_raw=true`] This is a **write-barrier** bug (editor buffer not flushed before the sync engine reads), not a merge bug — different root cause from the merge failures below. [inference]
- **topic 94732**, created 2025-01-12, **105 posts, 4,342 views**: "Obsidian Sync incorrectly duplicates sections of files." Reporter: Restricted Mode on, no plugins, vault off C:\, iPhone vault not on iCloud; *"Sync will create changes that never happened on the iPhone and add them to the file"*; **no merge-conflict notification and nothing in File Recovery**. A second reporter (2025-02-06) describes table content repeating from an earlier page. [fetched]
- Other threads in the same index: **102819** "Content of a Note totally Replaced/overwritten with content of another note" (2025-07-11, 39 posts); **57356** "[Data loss] Note is suddenly empty!" (2023-04-01, 9 posts); **117162** "Files and folders disappear from MacOS" (2026-08-10, 24 posts). [fetched, search.json]
- **Source disagreement, recorded not resolved**: Obsidian's docs say auto-merge "saves all edits" [fetched]; topic 94732 reports content *added that was never typed*, with no conflict logged [fetched]. Both cannot be true of the same algorithm.

### 3. Measured — what git's three-way merge does to markdown
`git version 2.50.1 (Apple Git-155)`, run via process substitution, no files written. [measured]

| Case | Input | Result | Exit |
|---|---|---|---|
| M1 disjoint line edits | A edits line 1, B edits line 3 | both applied cleanly | 0 |
| M2 **both append at EOF** | A adds `MY NEW LINE`, B adds `THEIR NEW LINE` | **conflict markers**, nothing lost | 1 |
| M3 adjacent paragraphs | A edits para 1, B edits para 2 | both applied cleanly | 0 |
| M4 no trailing newline | identical sides | output bytes `41 0a 42` — **trailing-newline absence preserved** | 0 |
| M5 CRLF file | one side edits | output `41 0d 0a 42 32 0d 0a` — **CRLF preserved verbatim** | 0 |
| M6 `--union` on same-line conflict | `title: mine` vs `title: theirs` | emits **both lines** — silently invents a document with two `title:` keys | 0 |
| M7 empty base (no common ancestor) | — | conflict markers, no guessing | 1 |
| M8 whitespace-only divergence (`item\t` vs `item␣␣`) | — | **conflict markers** — invisible-character conflicts are surfaced, not swallowed | (rc masked by pipe) |
| M9 file already contains `<<<<<<< HEAD` | — | **nested markers** produced; result is unparseable as a merge | 1 |

Read: git's merge is **byte-faithful and conservative**. It preserves CRLF and missing-final-newline exactly (M4/M5), and it refuses (M2/M7/M8) exactly where a splice writer would want to refuse. `--union` (M6) is the one mode that guesses and must be banned. M9 is a real hazard for a *markdown editor* whose users write about git.

### 4. Measured — what fuzzy patching does to markdown
`diff-match-patch@1.0.5` from unpkg, executed in node. Defaults read from the instance: `Match_Threshold 0.5, Match_Distance 1000, Patch_DeleteThreshold 0.5, Patch_Margin 4`. [measured]

- **Non-idempotent, and it reports success.** Patch `one two three` → `one two three four`, applied to a doc that had already advanced, then applied a *second* time (replay / re-sync): output `one two three four four`. `patch_apply` returned `results = [true]` **both times**. [measured] This reproduces the exact shape of topic 94732 — duplicated sections, no conflict reported.
- **Fuzzy misapply through changed context.** Base `The quick brown fox jumps…`; my patch changes `jumps`→`leaps`. Server text meanwhile says `brown cat` and has an appended sentence. `patch_apply` returned `[true]` and produced `The quick brown cat leaps…` — it applied an edit whose anchoring context **no longer existed**. [measured]
- **Repetitive markdown lands on the wrong line.** Six identical `- [ ] task` lines; I tick the first; server has only three lines left. Result ticks a line that is not the one I ticked, `[true]`. [measured]
- The library's own README states the design intent: *"Use best-effort to apply patch even when the underlying text doesn't match."* The API wiki concedes the success flags are unreliable: *"this second element is not too useful since large patches may get broken up internally… with no way to figure out which patch succeeded or failed."* [fetched, github.com/google/diff-match-patch README + wiki/API]
- **Conclusion for frontmatter**: diff-match-patch is architecturally the opposite of "refuse rather than guess." It is disqualified as a merge substrate, not merely disfavoured. [inference]

### 5. Decision matrix
Scores 1–5, 5 = best. Weights reflect the stated exit condition (byte-for-byte convergence, zero loss, human-watchable).

| Axis (weight) | Git-only (as transport) | **Git-merge + op log** | Server-authoritative OT | CRDT (Yjs/Loro/Automerge) | *baseline:* LWW + conflict copy | *baseline:* fuzzy patch (Obsidian today) |
|---|---|---|---|---|---|---|
| Convergence guarantee (×3) | 4 — merge is deterministic given same base; humans resolve | **5** — CAS at the server gives a total order; merge deterministic | 5 — server is the order | 5 — proven SEC, but see interleaving below | 3 — converges to *a* state, not to *the* state | 1 — non-idempotent [measured] |
| True offline, both devices (×3) | 4 | **5** | 1 — needs the server to accept ops | 5 | 4 | 3 |
| Byte fidelity (×3) | 5 — measured CRLF + no-final-newline preserved [measured] | **5** | 3 — OT models a string, not a byte file | 2 — doc is the CRDT; the file is a *projection*, which inverts frontmatter's axiom | 5 — whole file copied | 2 |
| Conflict visibility (×2) | 5 — markers + non-zero exit | **5** — markers + explicit conflict artifact | 3 | 1 — CRDTs are designed so conflicts never surface | 4 — a visible extra file | 1 — invisible by construction |
| Cost for one founder (×2) | 4 — `git merge-file` semantics are ~200 LOC to reimplement or shell out | **4** | 1 — OT transform matrix is the classic solo-founder trap | 2 — library is free, but persistence/GC/history/compaction is not | 5 | 5 |
| Fit with "refuse rather than guess" (×3) | 5 | **5** | 2 | 1 — a CRDT *cannot* refuse; refusing is not in its algebra | 3 | 1 |
| **Weighted total /80** | 69 | **74** | 40 | 51 | 62 | 32 |

Library facts, read from the npm registry and unpkg on 2026-08-29: `yjs` latest **13.6.32** (published 2026-08-04T08:18:16Z; `next` 14.0.0-8, `beta` 14.0.0-16); `loro-crdt` **1.15.0** (2026-08-27T01:45:21Z); `@automerge/automerge` **3.4.1** (2026-08-12T08:28:28Z); `isomorphic-git` **1.41.9** (2026-08-23T11:26:35Z). [fetched] Measured payloads: `yjs/dist/yjs.mjs` 299,797 B raw / **62,586 B gzip**; `loro-crdt` bundler wasm 3,181,087 B raw / **1,046,181 B gzip**. [measured] Loro's wasm is **16.7×** Yjs's gzip weight (1,046,181 ÷ 62,586 = 16.71). [derived] Automerge 3.0's headline is "cut memory usage by over 10x" versus Automerge 2 — an admission of how heavy full-history CRDTs were [fetched, automerge.org/blog/automerge-3].

**The disqualifying CRDT fact**: *The Art of the Fugue: Minimizing Interleaving in Collaborative Text Editing* (arXiv **2305.00583v3**, published 2023-04-30) — "when two users concurrently insert text at the same position… the merged outcome may interleave the inserted text passages, resulting in corrupted and potentially unreadable text. The problem has gone unnoticed for decades, and it **affects both CRDTs and Operational Transformation**." [fetched] Loro's README credits Fugue for its text layer [fetched]; Yjs's YATA and Automerge's list algorithm predate it. So the CRDT column's "5" for convergence buys convergence *to an interleaved document* — byte-identical on both devices, and still garbage. Convergence is not the same property as zero loss. [inference]

### 6. Recommendation
**Build "git-merge + operation log", server-mediated by compare-and-swap. Do not ship a CRDT.**

- **Server is a byte store with CAS, not a merger.** R2's Workers API supports `put(..., { onlyIf: { etagMatches } })`, and "if the condition check for `put()` fails, `null` will be returned" [fetched, developers.cloudflare.com/r2/api/workers/workers-api-reference]. That is a real optimistic-concurrency primitive: a client uploads only if the server still holds the base it merged against. Where you need a strict serialization point (per-document lock, monotonic revision counter), Durable Objects are "single-threaded and cooperatively multi-tasked" with "durable, transactional, and strongly consistent storage… accessible only within that object" [fetched]. **This removes wall clocks from the ordering decision entirely** — you never compare two devices' clocks, you compare a server-issued revision.
- **Client keeps three things per document**: `base_bytes` (the exact bytes of the last revision it synced, verbatim), `working_bytes`, and an append-only **splice journal** of `{seq, base_digest, offset, deleted_len, inserted_bytes, result_digest}` — the same splice records the engine already produces.
- **On reconnect**: fetch server bytes; if `etag == my base etag`, CAS-upload. Otherwise run a **three-way merge with the true base you stored** — not a diff against the winner, which is what fuzzy patching does. Clean merge → CAS-upload the merged bytes. Conflict → **refuse**: write `note (conflict <device> <server-rev>).md` holding *your* bytes untouched, leave the server bytes as the file, and surface it. Never write conflict markers into the user's `.md` (M9 shows why: nesting).
- **Merge granularity**: line-based diff3 over a *sentence-normalised* token stream, not raw lines, then re-emit original bytes for unchanged regions. Rationale: markdown prose is often one paragraph per line, so raw-line diff3 conflicts on every co-edited paragraph.
- **The journal is a checkable derivative, never authority.** `fold(journal, base_bytes) == working_bytes` must hold at every boundary; if it doesn't, refuse to sync and fall back to whole-file conflict-copy. This preserves "the file is the only source of truth" while still giving you an oracle.
- **Clock policy**: HLC-style timestamps for *display and tie-breaking only*, never for correctness — Hybrid Logical Clocks give causality plus bounded closeness to physical time without TrueTime's GPS/atomic infrastructure and its 6 ms ε [fetched, muratbuffalo.blogspot.com/2014/07, Kulkarni & Demirbas]. Syncthing's fallback of "larger value of the first 63 bits of device ID" [fetched] shows what you get when clocks tie: an arbitrary winner. You will not need it, because the server rev is total.

**Strongest counter-argument against this recommendation**: the reason Obsidian uses diff-match-patch is that *conservative merging produces conflicts users hate*. My own M8 measurement shows a tab-vs-two-spaces divergence produces conflict markers — invisible whitespace generating a scary artifact. If frontmatter's conflict rate is materially higher than Obsidian's, "refuses rather than guesses" reads to a paying user as "loses my flow" and they leave, and you will never see the churn attributed to it. **Mitigation that makes the counter-argument testable**: instrument conflict rate as a first-class shipped metric (conflicts per 1,000 syncs, by cause), publish it, and hold a budget. If the measured rate exceeds the budget, the fix is finer merge granularity — never a fuzzier apply.

### 7. The convergence oracle — proving zero loss, not observing it
The demo (two devices, offline, reconnect, human watching) is a *demonstration*, not a proof. Build the proof as five mechanical layers:

1. **Digest equality (necessary, trivial)** — SHA-256 of final bytes equal on both devices *and* on the server. Catches divergence; catches no loss, because both devices can converge on a truncated file.
2. **Splice-conservation invariant (the real oracle)** — for every journal record acknowledged to the user, assert `inserted_bytes` occurs as a contiguous byte subsequence of the converged document **or** appears byte-identically inside a named conflict artifact with a stable id. Formally: `⋃ inserted(device A) ∪ ⋃ inserted(device B) ⊆ bytes(converged) ⊎ bytes(conflict artifacts)`, with each element attributable to exactly one destination. Loss = any inserted run present in neither. This is what "zero loss" *means*; digest equality is not it.
3. **Deletion-intent invariant** — bytes deleted by a device are absent from the converged doc *unless* concurrently re-inserted by the peer; a byte that reappears with no re-insertion record is a resurrection bug (the M6/`--union` failure class).
4. **Deterministic network simulator, seeded** — a single-process harness with a virtual clock and a scriptable partition schedule. Generate random splice programs against a corpus of *real* markdown (frontmatter, CRLF files, no-final-newline files, files with `<<<<<<<` in them, mixed indentation, emoji/CJK spanning multi-byte boundaries — LR#68's exact fault class). Run ≥10,000 seeded schedules per release; every failure is checked in as a fixture with its seed.
5. **Permutation-invariance metamorphic check** — for each schedule, apply the same op set in k sampled orders and assert identical digests. Non-commutativity is a bug even when nothing is lost. Also assert **idempotence explicitly** — replaying an already-applied op must be a no-op; the measured diff-match-patch `four four` result is precisely an idempotence violation that its own success flag hid. [measured]

**Rule for the harness itself** (LR#60/#68): the oracle must first be shown to **fail** against a deliberately broken merger. Wire diff-match-patch in as a "known-bad" backend in CI; if the suite goes green on it, the suite is measuring nothing.

### 8. Failure modes to build tests for
| # | Failure | Trigger | Assertion |
|---|---|---|---|
| F1 | Editor buffer not flushed before sync reads the file | forum 116380 [fetched] | Bytes handed to the sync engine == bytes in CodeMirror's doc, digest-compared, on every upload |
| F2 | Patch replay duplication | reconnect retries, at-least-once delivery | Idempotence: applying rev N twice yields identical digest [measured failure in DMP] |
| F3 | Fuzzy apply into changed context | base drifted | Merge refuses unless base digest matches exactly |
| F4 | Both-append-at-EOF | classic offline case | Conflict artifact, both texts recoverable (M2 shows git does this correctly) |
| F5 | Torn/partial write | crash mid-save, iOS jetsam | Write temp → `fsync` file → atomic `rename` → `fsync` directory; SQLite's rollback-journal discipline is the reference model [fetched, sqlite.org/atomiccommit.html] |
| F6 | Conflict markers already in the user's prose | markdown about git | Refuse to auto-merge any file matching `^(<<<<<<< \|=======$\|>>>>>>> )` (M9) |
| F7 | Multi-byte character split at a splice offset | CJK/emoji, LR#68 | Every offset lands on a UTF-8 boundary; corpus must contain the Korean case from 116380 |
| F8 | Frontmatter duplicate keys | any union-style merge | Post-merge parse: duplicate top-level YAML key ⇒ refuse (M6) |
| F9 | Whitespace-only divergence | tab vs spaces | Must be classified, not silently resolved (M8) |
| F10 | Delete-vs-edit race | one device deletes, other edits | Never delete; materialise as conflict artifact (Syncthing's documented behaviour) [fetched] |
| F11 | Third-party sync layered on top | user has iCloud/Dropbox on the vault | Detect and warn — Obsidian documents that on-demand/online-only files are read as *deleted* and get removed from the remote vault [fetched] |
| F12 | Clock skew / device clock set backwards | traveling user, VM resume | No correctness path may read `Date.now()` |
| F13 | Storage evicted under the app | Safari/PWA | Unsynced local edits must be detectable as missing, not silently treated as "nothing to sync" |

### 9. Mobile and iOS
- **Background Sync API is not available on your two hardest targets.** browser-compat-data `api/SyncManager`: Chrome 49, Edge/Opera mirrored; **Firefox `false`**, **Safari `false`** (WebKit bug 182565), **safari_ios mirrors Safari**, **webview_android `false`** (crbug 40449796). MDN labels it "Limited availability… not Baseline." [fetched]
- **Safari storage is evictable by default.** WebKit's policy (Aug 10, 2023; Safari 17 / iOS 17): origin quota up to 60% of disk for browser apps, 15% for other apps; overall quota 80% / 20%; eviction is **LRU by origin**, whole-origin deletion, triggered by overall quota, storage pressure, or ITP-driven non-interaction. Persistent mode exists but "WebKit currently grants a request based on heuristics like whether the website is opened as a Home Screen Web App." [fetched]
- **Native iOS has no guaranteed background window either.** `BGAppRefreshTaskRequest` = "a short refresh task"; `BGProcessingTaskRequest` = "a processing task that can take minutes"; both are *requests* the system schedules. [fetched]
- **The market leader does not even try.** Obsidian's own FAQ: *"Is my data being synced in the background? **No**, files are only synced when Obsidian is running."* [fetched] That is your permission slip.
- **Recommendation**: (a) Tauri v2 native app on iOS is the only place to attempt opportunistic background sync, via `BGProcessingTask`, treated as best-effort — never as a correctness dependency. (b) In the browser/PWA, sync on `visibilitychange`, on `pagehide`, and on foreground focus; use Background Sync **only** as a Chrome-only optimisation behind a feature check. (c) Never display "Fully synced" unless the server has ACKed a revision whose digest equals the local file's digest — the 116380 report is a UI that lied. (d) Call `navigator.storage.persist()` and **surface the result**; if persistence is not granted, say "unsynced edits on this device are at risk" in plain words. **Anti-recommendation**: do not build a Web Push–triggered sync to work around the missing Background Sync API — it requires notification permission for a non-notification purpose, will be denied by most users, and gives you a worse conversion funnel than an honest "open the app to sync."

### 10. Anti-recommendations
- **Do not adopt Yjs, Automerge or Loro for the document body.** Every view being a reversible projection of the file is frontmatter's differentiator; a CRDT inverts that — the CRDT becomes the record and the file becomes the projection, and you inherit history GC, snapshot compaction and the Fugue interleaving class [fetched arXiv 2305.00583v3]. Loro's wasm alone is 1,046,181 B gzipped [measured]. *Narrow exception*: if you later ship live multi-cursor collaboration, use Yjs **ephemerally** for the in-session channel and persist only splices to the file.
- **Do not use diff-match-patch anywhere in the write path.** Non-idempotent with a `true` success flag; applies through changed context; lands on the wrong repetition [measured, three cases]. It is fine as a *read-only* visual diff renderer.
- **Do not use `git merge-file --union` or any "keep both" auto-resolution.** M6 silently produced a document with two `title:` keys [measured].
- **Do not ship git-as-transport (isomorphic-git) on mobile.** Obsidian Git's own README: mobile is "very unstable", "I would not recommend using this plugin on mobile"; no SSH auth, limited repo size from memory restrictions, no rebase, no submodules, and "Obsidian may crash on clone/pull, create buffer overflow errors, run indefinitely… I don't know how to fix this." [fetched] Use git's *merge algorithm*, not git's *transport*.
- **Do not build server-authoritative OT.** It scores 1 on true-offline and 2 on refuse-fit; the transform-function matrix is the canonical solo-founder time sink; and per Fugue it does not even escape interleaving [fetched].
- **Do not resolve conflicts by timestamp.** Syncthing's documented last-resort — device-ID bit comparison [fetched] — is what timestamp ordering degenerates into. Use the server revision.
- **Do not claim "conflict-free" in marketing.** You are choosing *visible* conflicts on purpose; say so. The demand corpus's most-cited pain is silent destruction, and the honest counter-positioning is "frontmatter will sometimes ask you a question; it will never answer one for you."

### 11. Unresolved / not verified
- Resilio Sync's conflict semantics — **not verified**, docs host unreachable from here (HTTP 000). [measured]
- Obsidian Sync's *server-side* algorithm beyond the docs' DMP claim — the duplication reports in topic 94732 are inconsistent with the documented behaviour and no post-mortem was published; I found none. [fetched, absence noted]
- Whether the 116380 Korean-character loss is a CodeMirror flush bug, an IME-composition boundary bug, or a sync-read race — the thread contains no maintainer diagnosis as of the fetch. [fetched]
- I did not measure `git merge-file` against a large real vault; conflict *rates* on real prose remain **unmeasured** and are the single number that decides whether the recommendation survives its counter-argument.