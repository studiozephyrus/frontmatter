---
mode: reference
updated: 2026-09-09
verified_against: e318ab3
---

# DATA MODEL

> **Method.** I read `AGENTS.md`, `package.json`, `firebase.json`, `.firebaserc`,
> `firestore.rules` (header block plus every `match` line), `firestore.indexes.json`,
> and the source of every file that touches persistence:
> `src/modules/drafts/infrastructure/draft-store.ts`,
> `src/modules/vault/presentation/SnapshotProvider.tsx`,
> `src/modules/vault/application/dto.ts`, `src/modules/vault/application/ports.ts`,
> `src/modules/vault/infrastructure/snapshot-cache.ts`,
> `src/modules/vault/infrastructure/search-index.ts`,
> `src/modules/editor/presentation/editor-store.ts`,
> `src/modules/editor/presentation/editor-settings.ts`,
> `src/modules/editor/presentation/bookmarks.ts`,
> `src/modules/share/**` (all 16 files), `src/modules/repository/domain/commit.ts`,
> `src/modules/auth/domain/*` and `src/modules/auth/infrastructure/auth-options.ts`,
> `src/shared/infrastructure/firebase/client.ts`, `public/sw.js`, `public/theme-init.js`,
> and `src/app/api/vault/{snapshot,restore}/route.ts`. Every count below comes from a
> command reproduced inline.
>
> **What this pass did NOT do.** I did not run the application, the test suite,
> `npm run spec`, `npm run corpus`, or a browser. So no shape here has been observed in a
> live IndexedDB or localStorage; shapes are read off the type declarations and the writer
> code. I did not read the four large `docs/` artefacts (PRD v2, RECORD, ENGINE, CRITIQUE)
> beyond `grep -n` on `docs/PRODUCT-BRIEF.md`. I did not read any `.env` file — environment
> variable NAMES below come from the Zod schemas in `src/config/env.ts` and from
> `process.env.<NAME>` literals in source. I did not audit `src-tauri/src/` Rust for local
> persistence beyond reading `tauri.conf.json`. I did not verify the exact serialised byte
> shape the Zustand `persist` middleware writes.

---

## 1. There is no database

The single most useful thing to know about this product's data model is that it does not
have a database. It has a git repository, a browser, and a security-rules file for a
database that has never been written to.

```
STORE OF RECORD          a GitHub repository, over the REST API
                         ($GITHUB_REPO, branch $GITHUB_BRANCH)
                                  |
                                  |  read: zipball + per-file blob
                                  |  write: one commit per save
                                  v
SERVER (Vercel, stateless)   in-process caches only, lost on cold start
                                  |
                                  |  JSON over /api/*
                                  v
BROWSER                      IndexedDB   — unsaved draft bodies
                             localStorage — dirty index, prefs, snapshot cache
                             sessionStorage — open tabs, one-shot handoffs
                             Cache Storage — the PWA app shell

FIRESTORE                    419 lines of security rules, 7 composite indexes,
                             zero writes from application code
```

Everything a user would be upset to lose lives in git. Everything in the browser is either
(a) not yet committed, or (b) a preference or cache that can be rebuilt.

**Counts, all from `e318ab3`:**

| Thing | Count | Command |
|---|---|---|
| TypeScript files under `src/` | 226 | `find src -type f \( -name "*.ts" -o -name "*.tsx" \) \| wc -l` |
| Modules under `src/modules/` | 13 | `ls -d src/modules/*/ \| wc -l` |
| `route.ts` handlers under `src/app/` | 26 | `find src/app -name "route.ts" \| wc -l` |
| Test files under `test/` | 100 | `find test -type f \( -name "*.test.ts" -o -name "*.test.tsx" \) \| wc -l` |
| Domain-layer files | 20 | `find src/modules/*/domain -type f \| wc -l` |
| Firestore mutation calls in `src/` | **0** | see §7 |

The task brief for this document said 12 API route handlers and 81 test files. My counts at
`e318ab3` are 26 and 100. I report what the commands returned.

---

## 2. The store of record: a git repository

### 2.1 What identifies it

Three environment variable names, declared in `src/config/env.ts:85-87`:

| Name | Zod declaration | Note |
|---|---|---|
| `GITHUB_REPO_TOKEN` | `z.string().min(1)` | required, no default |
| `GITHUB_REPO` | `.default("sagnikmitra/md")` | **the default is the sibling product's vault, not a frontmatter one** |
| `GITHUB_BRANCH` | `.default("main")` | |

That default is worth naming plainly: a deployment that forgets to set `GITHUB_REPO` reads
and writes `sagnikmitra/md`. It is a leftover of the fork described in
`docs/PRODUCT-BRIEF.md:223`, and it is a data-model fact, not a config nit — it decides
which repository receives commits.

### 2.2 What a document is

A document is a `.md` file at a vault-relative path inside that repository. There is no
document id, no row, no primary key. The path *is* the identity, and it is the identity
everywhere: IndexedDB draft keys, the dirty index, tab records, the link index, the
snapshot, and the tree are all keyed on the same string.

Consequence: a rename is a re-key across five stores at once. The code knows this —
`src/modules/editor/presentation/path-rename.ts:18-21` moves the IndexedDB draft
(`getDraft(oldPath)` → `saveDraft(newPath, …)` → `deleteDraft(oldPath)`), and
`editor-store.ts:190-199` re-keys `contentByPath` and `baseShaByPath` and rewrites the tab
list in the same transition.

### 2.3 Reserved folder names

Two path prefixes carry meaning. Both are conventions in the repository, not schema.

| Prefix | Meaning | Read at |
|---|---|---|
| `_Trash/` | soft delete. A delete moves the file here in one commit; a second delete of a path already under `_Trash/` is the hard delete | `src/app/api/vault/delete/route.ts:58,71`; `restore/route.ts:18` |
| `_Archive/` | excluded from the graph and from the link doctor; sorted last in the tree | `markdown-parser.ts:175`; `LinkDoctorModal.tsx:39`; `tree-order.ts:26-29` |

`get-snapshot.ts:201` sets `excludeFromGraph` for either prefix; `get-snapshot.ts:230`
additionally filters `_Trash/` out of the rendered tree while leaving those notes in
`notes[]`, so the trash modal can list them.

### 2.4 The one field the product writes into a user's file

`public_slug`, in the note's own YAML frontmatter. That is the entire server-side share
model — there is no share table.

- Written by `src/modules/share/infrastructure/share-writer.ts:25`, through
  `spliceFrontmatterValue(file.content, "public_slug", slug)` and then a commit whose
  message is `share: set public_slug=<slug> on <path>` or `share: unpublish <path>`.
- Read back by `get-snapshot.ts:212`, which lifts `frontmatter["public_slug"]` into
  `NoteMeta.publicSlug`.
- Listed by `share-snapshot-port.ts`, which filters the snapshot rather than querying
  anything.
- Uniqueness is checked in `set-share.ts:34-36` against the current snapshot and throws
  `SlugConflictError`. This is a read-then-write check with no lock, so two concurrent
  publishes can both pass it — which is exactly why `DuplicateConflictModal.tsx` exists,
  and why `use-share-conflicts.ts` surfaces duplicates introduced by Obsidian or a git sync
  that bypassed the app entirely.

The splice writer is the interesting part and it is documented in
`src/modules/share/domain/splice-frontmatter.ts`. Its own header records the measurement
that justifies it: the regenerating path left 33 of 907 corpus files byte-identical after a
no-op publish/unpublish cycle; the splice leaves 907 of 907. It also exports `SAFE_KEY`
(`/^[A-Za-z0-9_.$-]+$/`, line 53), the only key shapes it can locate. Anything else is
refused rather than guessed.

### 2.5 Commit shapes

From `src/modules/repository/domain/commit.ts`, unchanged and complete:

```ts
type FileChange   = { path: string; content: string; baseSha: string }
type Deletion     = { path: string; baseSha: string }
type CommitRequest = { files: FileChange[]; deletions?: Deletion[]; message: string }
type CommitResult  = { commitSha: string }
type CommitAuthor  = { name: string; email: string }
class ConflictError extends Error { readonly paths: string[] }
```

`baseSha` on every change is the optimistic-concurrency token. It is the blob SHA the
editor loaded, and a mismatch upstream is what raises `ConflictError`. This is the
product's entire conflict model: no CRDT, no operational transform, a three-way merge
offered through `/api/vault/merge` (`src/modules/repository/domain/merge3.ts`) when the
base has moved.

---

## 3. Browser: IndexedDB — the draft store

One database, one object store, one record shape. All of it in
`src/modules/drafts/infrastructure/draft-store.ts` (the module has exactly two files:
that one and `index.ts`).

| Property | Value | Line |
|---|---|---|
| Database name | `sgnk-md` | `:19` |
| Object store | `drafts` | `:19` |
| Key | `` `draft:${path}` `` | `:22-24` |
| Value | `{ content: string; baseSha: string; updatedAt: number }` | `:12` |
| Created via | `createStore("sgnk-md", "drafts")` from `idb-keyval` | `:10,19` |

`idbStore` is `undefined` on the server (`typeof window !== "undefined"` guard), so the
module is import-safe during SSR and the async functions are client-only.

**Lifecycle.** A draft is created on the first keystroke after load and destroyed when its
content reaches git.

| Event | Call | Site |
|---|---|---|
| debounced keystroke | `saveDraft` | `CodeMirrorEditor.tsx:261`, `:435` |
| AI insert / refine | `saveDraft` | `AIMenu.tsx:161`, `:177` |
| paste or programmatic set | `saveDraft` | `EditorPane.tsx:495`, `:501` |
| new note created in tree | `saveDraft(path, {content, baseSha: ""})` | `FileTreeActions.tsx:110` |
| load a note | `getDraft` (draft wins over remote) | `use-note-content.ts:63` |
| commit succeeds | `deleteDraft` per committed path | `CommitBar.tsx:109` |
| discard / revert to a version | `deleteDraft` | `CommitBar.tsx:221`, `HistoryModal.tsx:96` |
| rename | `getDraft` → `saveDraft(new)` → `deleteDraft(old)` | `path-rename.ts:18-21` |

A draft with `baseSha: ""` (the new-note case) is a create, not an update.

There is no expiry, no quota handling, and no cap on the number of drafts. A draft persists
across sessions and across devices only in the sense that it does not — IndexedDB is
per-browser-profile, so an uncommitted draft exists on exactly one machine.

---

## 4. Browser: localStorage

Eleven keys, plus one unbounded prefix. Every one was located by grepping the literal;
sites are given so each can be checked.

| Key | Shape | Written by | Read by | Loss if cleared |
|---|---|---|---|---|
| `sgnk-md:dirty` | JSON `string[]` of vault paths | `draft-store.ts:99` | `:47` | index only — rebuilt from IndexedDB, see below |
| `sgnk-md-bookmarks` | Zustand `persist` envelope over `{ paths: string[] }` | `bookmarks.ts:31` | same | starred notes |
| `sgnk-md-editor-settings` | Zustand `persist` envelope over `{ vimMode, lineNumbers, spellcheck, focusMode, aiGhostText }`, all boolean | `editor-settings.ts:46` | same | editor prefs revert to defaults (`spellcheck: true`, the rest `false`) |
| `sgnk-snapshot-cache:v1` | `VaultSnapshot` as JSON (§5.1) | `SnapshotProvider.tsx:78` | `:63` | nothing — first paint waits for the network |
| `sgnk-right-pane-mode` | one of the pane-mode strings | `RightPaneCycle.tsx:61`, `VaultWorkspace.tsx:70,94` | `VaultWorkspace.tsx:43` | layout preference |
| `sgnk-right-pane` | `"open"` / `"closed"` | `RightPaneCycle.tsx:58` | `RightPaneToggle.tsx:25` | layout preference |
| `sgnk-left-pane` | `"open"` / `"closed"` | `VaultWorkspace.tsx:110` | `:61` | layout preference |
| `sgnk-theme` | `"dark"` / `"light"` | `ThemeToggle.tsx:25` | `public/theme-init.js:5` | theme falls back to system |
| `sgnk-scrollind` | `"hidden"` / `"shown"` | `ScrollbarToggle.tsx:38`, `RightPaneCycle.tsx:54` | same | preference |
| `sgnk-split` | a float as a string (split ratio) | `EditorPane.tsx:452`, reset to `"0.5"` at `:627` | `:432` via `parseFloat` | split reverts |
| `sgnk-tree-open:<path>` | `"open"` / `"closed"`, **one key per folder** | `TreeItem.tsx:77` | `:66` | tree collapses |

`sgnk-tree-open:` is the only unbounded one. `FileTreeActions.tsx:234-241` sweeps the
prefix and all descendants when a folder is deleted, walking `localStorage.key(i)`
backwards. That sweep runs on folder delete only — a folder renamed or removed outside the
app (Obsidian, a git pull) leaves its keys behind.

### 4.1 The dirty index is a cache with a real recovery path

`sgnk-md:dirty` is a denormalised index of "which paths have a draft". It exists so
`hasDraft()` and `listDirtyPaths()` can answer synchronously, on the keystroke path,
without touching IndexedDB. It is duplicated state, and the code treats it as such:

- an in-memory mirror keyed on the raw localStorage string detects external mutation by
  string compare and skips the `JSON.parse` when nothing changed (`:36-45`);
- on corrupt JSON it does **not** silently return `[]` — that would orphan every unsaved
  draft, because callers would believe nothing is dirty. It removes the bad value and
  schedules `rebuildDirtyIndexFromIDB()` (`:60-72`), which scans the IndexedDB store's
  keys and reconstructs the list from every key with a `draft:` prefix (`:76-92`).

So the truth is IndexedDB and the index is recoverable from it. That asymmetry is the
correct one and it should survive any refactor.

---

## 5. Browser: sessionStorage and Cache Storage

| Store | Key | Shape | Site |
|---|---|---|---|
| sessionStorage | `sgnk-md-editor` | Zustand `persist`, `partialize`d to `{ tabs, activePath, secondaryPath, mode }` | `editor-store.ts:226-244` |
| sessionStorage | `sgnk:search-preset` | a single string, e.g. `#tagname` | write `KnowledgePanels.tsx:40`, read-and-delete `SearchPanel.tsx:72-73` |
| sessionStorage | `sgnk:pwa-reloaded` | `"1"` | `PWARegister.tsx:22-24` |
| Cache Storage | `sgnk-md-v2` | the PWA app shell | `public/sw.js:13` |

Two things are load-bearing here.

**`contentByPath` is deliberately not persisted.** `editor-store.ts:236-239` says why: it
is large, it goes stale across commits, and it is re-seeded from `/api/vault/snapshot` and
`/api/vault/file` when a note loads. The tab *list* survives a reload; the tab *content*
does not, and comes back from git or from the IndexedDB draft.

**`sgnk-md-v2` self-heals.** `sw.js:24-25` deletes every cache whose name is not the
current `CACHE` on activate. So bumping that name is the intended upgrade mechanism, and it
is the one `sgnk-md`-prefixed name in the codebase that is safe to rename. It is not in the
same category as the four below.

---

## 6. The legacy `sgnk-md` prefixes, and what renaming them costs

`AGENTS.md` §8 names five persistence keys that keep the legacy prefix on purpose. All five
verified present at `e318ab3`. Adding the two the section does not name, and the service
worker cache for completeness:

| Name | Kind | Site | Renaming it |
|---|---|---|---|
| `sgnk-md` / `drafts` | IndexedDB database and object store | `draft-store.ts:19` | **orphans every uncommitted draft body.** A new database name is a new, empty database; the old one stays on disk, invisible to the app, holding the user's unsaved work |
| `sgnk-md:dirty` | localStorage | `draft-store.ts:14` | on its own, recoverable — `rebuildDirtyIndexFromIDB()` reconstructs it. Rename it *together with* the database and the recovery has nothing to read |
| `sgnk-md-bookmarks` | localStorage | `bookmarks.ts:31` | silently empties the user's starred list |
| `sgnk-md-editor-settings` | localStorage | `editor-settings.ts:46` | silently resets vim mode, line numbers, spellcheck, focus mode, AI ghost text |
| `sgnk-md-editor` | **sessionStorage** | `editor-store.ts:226` | loses open tabs for the current session only. `AGENTS.md` lists this alongside the localStorage keys; it is the least costly of the five because sessionStorage is per-tab and short-lived |
| `sgnk-snapshot-cache:v1` | localStorage | `SnapshotProvider.tsx:59` | harmless — it is a cache and already carries its own `:v1` version segment, which is the pattern the others lack |
| `sgnk-md-v2` | Cache Storage | `public/sw.js:13` | harmless and in fact the intended upgrade path (§5) |

The honest statement of the rule: **renaming any of these keys orphans a user's local
drafts and settings, because none of them is read under both the old and the new name.**
There is no migration code anywhere in `src/` — a grep for a second, older key name next to
any of these returns nothing. Changing them requires writing that migration first: read
old, write new, delete old, and keep the reader for at least one release.

The user-visible brand is `frontmatter`; these keys are not user-visible. The Tauri bundle
identifier `ai.sgnk.md` (`src-tauri/tauri.conf.json:5`, `productName: "sgnk-md"` at `:3`)
is a third case — it is user-visible, it must change before a public desktop build, and
changing it will move the app's OS-level data directory. `docs/PRODUCT-BRIEF.md:222` lists
it as a one-day fix.

---

## 7. Firestore: the design is committed, and nothing writes to it

`firestore.rules` is 419 lines (`wc -l firestore.rules`), committed once, in `8eb4de2`
(2026-07-25, "feat: Firebase backend foundation, product docs, Tauri shell, frontmatter
rebrand"). `firestore.indexes.json` declares seven composite indexes and six
`fieldOverrides` that exempt large fields from indexing. `firebase.json` points at both and
configures emulator ports. `.firebaserc` names the project `frontmatter-md`.

**No application code writes a Firestore document.** The evidence:

```
$ grep -rEnw "setDoc|addDoc|updateDoc|deleteDoc|writeBatch|runTransaction|arrayUnion|serverTimestamp" src/ | wc -l
0
$ grep -rn "firebase/firestore" src/ | wc -l
1          # src/shared/infrastructure/firebase/client.ts:14
$ grep -rn "firestore()" src/ | grep -v "shared/infrastructure/firebase/client.ts" | wc -l
0          # the only match is the definition itself
```

The whole of the Firestore surface in application code is one exported factory:

```ts
// src/shared/infrastructure/firebase/client.ts:38-40
export function firestore(): Firestore {
  return getFirestore(firebaseApp());
}
```

with zero callers. Firebase Auth *is* used — `firebase-auth-gateway.ts` calls
`signInWithPopup`, `signOut`, `onAuthStateChanged` — but Firestore is not.

A caution for anyone re-running this check: `git log -S"setDoc" -- src/` returns a hit on
`0c1b427`, the fork commit. That is a false positive. The match is `setDoctorOpen` in
`KnowledgeUI.tsx`, and `setDoc` is a substring of it. The word-boundary grep (`-w`) above
returns 0 at `HEAD` and is the one to trust.

**So the design is committed and unbuilt.** What it designs, from the rules file's own
header block (`firestore.rules:11-88`) and the `match` statements at lines 207, 228, 237,
241, 271, 326, 357, 389, 415:

| Collection | Doc id | Notable fields | Access designed |
|---|---|---|---|
| `users/{uid}` | Firebase Auth uid | `email` (immutable after create), `displayName`, `photoURL`, `providers` (≤8), `plan` (`free\|pro\|team`, server-owned after create), `defaultVaultId`, `createdAt`, `lastSeenAt` | owner; client may only ever write `plan: "free"` |
| `billing/{uid}` | uid | `status`, `priceId`, `currentPeriodEnd`, `provider`, `customerId` | owner-read; **no client writes at all** |
| `usage/{uid}/months/{YYYY-MM}` | month | `aiTokens`, `noteCount`, `bytesUsed` | owner-read; metered server-side |
| `vaults/{vaultId}` | auto-id | `ownerUid` (immutable), `name`, `rev`, `memberUids` (≤100), `roles` map (≤100 keys), `createdAt`, `updatedAt` | members read; only the owner changes membership |
| `vaults/{vaultId}/notes/{noteId}` | auto-id | `path`, `pathLower`, `title`, `tags`/`outbound`/`backlinks`/`embeds`, `frontmatter` (≤100 keys), `excludeFromGraph`, `publicSlug` (≤60), **`content` (≤900000 bytes)**, `storagePath`, `size`, `createdAt`, `updatedAt`, `deletedAt` | members read, editors write |
| `.../notes/{noteId}/revisions/{revId}` | rev id | `noteId`, `content`, `authorUid`, `message`, `createdAt`, `parentRev` | append-only; no update, no delete |
| `shares/{slug}` | the public slug | `vaultId`, `noteId`, `ownerUid` (immutable), `title`, **`contentSnapshot` (≤900000)**, `visibility` (`public\|unlisted`), `createdAt`, `renderedAt` | **unauthenticated GET when `visibility == "public"`**; LIST is owner-only |
| `/{document=**}` | — | — | catch-all deny |

Three observations that matter more than the schema itself.

1. **The header of the rules file calls itself a PROTOTYPE** (lines 7-9): "Reviewed against
   the attack list in the firebase-firestore skill, but not yet exercised against the
   emulator or a live client. Harden before taking paid signups." That is the file's own
   assessment, not mine.
2. **This design contradicts the shipped one.** The shipped product stores note bodies in
   the user's git repository and never holds them. This design stores `content` (up to
   900 KB) and `contentSnapshot` in a database Studio Zephyrus operates, with
   unauthenticated public reads. `docs/PRODUCT-BRIEF.md:365` records this as open question
   7 and says every legal rule in its §22 is a function of the answer, including
   intermediary status under IT Act §2(1)(w). Do not resolve it in this document.
3. **The two share models are unrelated.** The shipped one is a `public_slug` key in the
   user's own file (§2.4), rendered from git at `/[slug]`. The designed one is a `shares`
   collection keyed on the slug with a rendered `contentSnapshot`. They agree only on the
   slug and on `RESERVED_SLUGS`, and the rules file explicitly delegates reservation to
   `src/modules/share/domain/slug.ts` because the list is too large for a rules file.

The `fieldOverrides` in `firestore.indexes.json` exempt `notes.content`,
`notes.frontmatter`, `notes.backlinks`, `notes.embeds`, `revisions.content` and
`shares.contentSnapshot` from indexing. That is a correct instinct for large fields and it
is the one part of this design that is cheap to keep whether or not the rest ever ships.

---

## 8. The `.frontmatter/` sidecar does not exist

`docs/PRODUCT-BRIEF.md` describes `.frontmatter/review.jsonl` at lines 39, 56, 64, 115,
135, 455, 492 and 508 — one JSON line per span carrying file path, byte start, byte end,
content hash, reviewed-by, reviewed-at, and where known author, model and prompt. §135
calls it the only thing frontmatter adds.

It is unbuilt. Not partially built — absent.

```
$ grep -rn "\.frontmatter/\|review\.jsonl" src/ | wc -l
0
$ grep -rn "reviewedBy\|reviewed_by\|reviewed-at" src/ | wc -l
0
$ ls .frontmatter 2>/dev/null || echo "no such directory"
no such directory
```

There is no writer, no reader, no type, no test. `src/modules/mdmax` contains the machinery
the sidecar would need — `offsets.ts` (315 lines, the byte-to-UTF-16 offset map),
`placement.ts` (154 lines), the splice locator — but nothing consumes it for review state.
The brief's own status column marks this MVP-0 and prices it at 6+5+3+4 days.

Two design constraints from the brief are worth carrying forward into whoever builds it,
because they are already settled and re-litigating them is waste:

- the sidecar is **beside** the file, in the repository, never inside the `.md`
  (`PRODUCT-BRIEF.md:492`: "The artefact is a JSON sidecar, never written into the `.md`");
- spans are anchored by byte range **plus** content hash and relocated by the splice
  locator on every edit, because git, Obsidian and agents all bypass the journal
  (`:135`).

---

## 9. Server-side: two caches, and neither is persistence

Vercel functions are stateless between cold starts. Both server caches are module-level
`Map`s and both are correctly keyed on the vault HEAD SHA, so a stale entry is impossible
rather than merely unlikely.

| Cache | Key | Bound | Site |
|---|---|---|---|
| snapshot LRU | commit SHA | `MAX_ENTRIES = 3`, evicts oldest | `src/modules/vault/infrastructure/snapshot-cache.ts` |
| MiniSearch index | commit SHA | not stated in the header comment | `src/modules/vault/infrastructure/search-index.ts:1-6` |

`snapshotCache.clear()` exists specifically to be called after a successful commit
(`snapshot-cache.ts:35`). `/api/vault/snapshot` additionally sets `ETag: "<sha>"` and
`Cache-Control: private, must-revalidate` and answers 304 when the client already holds
that revision (`route.ts:29-33`).

Neither survives a deploy or a cold start. Neither needs to: both are pure functions of a
commit SHA and the repository.

**Unverified:** whether the MiniSearch cache has a size bound. The header comment says
"SHA-keyed module-level cache" without naming a limit, and I did not read past line 30 of
that file. If it is unbounded, a long-lived warm function accumulates one full-text index
per commit it has seen, which is a memory-growth risk rather than a correctness one.

---

## 10. The snapshot: the shape everything else is derived from

One DTO carries the entire vault's metadata. From `src/modules/vault/application/dto.ts`,
which declares both the TypeScript interface and the Zod schema for each:

```ts
interface VaultSnapshot {
  sha: string            // the commit this snapshot is of
  generatedAt: string
  tree: TreeNode         // recursive; _Trash/ filtered out
  notes: NoteMeta[]      // _Trash/ retained here
}

interface TreeNode { name: string; path: string; type: "folder" | "file"; children?: TreeNode[] }

interface NoteMeta {
  path: string
  title: string
  tags: string[]
  outbound: string[]
  backlinks: string[]
  excludeFromGraph: boolean
  publicSlug?: string    // from frontmatter public_slug
}
```

It carries **no file content**. `SnapshotProvider.tsx:55-57` states that as the reason it
is safe to keep in localStorage: metadata only, so it stays within quota even for a large
vault.

It is built by `get-snapshot.ts` from a single GitHub zipball, parsed into `ParsedNote`
(`src/modules/vault/domain/note.ts`) and then folded into a `LinkIndex`
(`src/modules/vault/domain/link-index.ts`). Two domain decisions there are worth knowing
because they are silent otherwise:

- **Wikilink resolution is deterministic by construction.** When two notes share a
  basename, shortest path wins, then lexicographic (`link-index.ts:28-34`). Without that,
  `[[Daily]]` would resolve differently across refreshes as zip iteration order changed.
- **There is a case-insensitive fallback index** (`link-index.ts:37-41`), Obsidian-style,
  so `[[hq]]` backlinks to `HQ.md`.

`ParsedNote` also carries `embeds` and the raw `frontmatter` record, neither of which
survives into `NoteMeta`. So the snapshot is lossy relative to the parse, and anything
needing raw frontmatter must re-read the file through `/api/vault/file`.

**Client cache invalidation.** `SnapshotProvider` deletes `sgnk-snapshot-cache:v1` on a 401
(`:121-124`) so a signed-out user's tree cannot be shown to whoever signs in next, and
keeps the cached tree on a transient 5xx. It also carries a monotonic request token
(`:104-107`) so an earlier slow response cannot clobber a later fast one after the several
`sgnk:vault-changed` events a commit or import fires.

---

## 11. Identity

Two identity systems exist. Only one gates the vault.

**Auth.js (NextAuth v5) — the live path.** `src/modules/auth/infrastructure/auth-options.ts`:
`session: { strategy: "jwt" }`, so the session is a signed cookie and there is no session
table. Two providers: GitHub OAuth with scope `read:user`, and a credentials provider
(`id: "sgnk-password"`) that verifies a scrypt hash. The JWT carries `login`, `name` and
`picture` and nothing else — the `jwt` callback stores identity only, and `ActorContext`
(`src/modules/auth/domain/actor.ts`) is three fields with a comment saying access tokens
are deliberately absent and stay server-side.

Access is a single-login allowlist. `ALLOWED_GH_LOGIN` defaults to `"sagnikmitra"`
(`env.ts:47`) and `isAllowed` (`allowlist.ts`) is an exact case-insensitive compare against
one string, not a list. The credentials path bypasses it because only the configured
`SGNK_AUTH_USER` can reach the callback.

Environment variable names on this path: `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`,
`AUTH_SECRET`, `ALLOWED_GH_LOGIN`, `SGNK_AUTH_USER`, `SGNK_AUTH_HASH`.

**Firebase Auth — wired, unused for authorisation.** `AuthUser`
(`src/modules/auth/domain/auth-user.ts`) is `{ uid, email, displayName, photoURL, providers }`
and its own doc comment says `uid` "is what Firestore security rules match against
(`request.auth.uid`)". Since nothing reads or writes Firestore (§7), that uid currently
keys nothing. Google sign-in is configured in `firebase.json`; anonymous and
email/password are `false`.

Environment variable names on this path, all read as literals so Next's build-time
substitution works (`env.ts:202-211`): `NEXT_PUBLIC_FIREBASE_API_KEY`,
`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`,
`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`,
`NEXT_PUBLIC_FIREBASE_APP_ID`, `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`.

So the product has two identity models, keyed differently (`login` vs `uid`), and the
document-holding question in §7 is also the question of which one becomes primary.

---

## 12. Test fixtures as a persisted shape

Worth naming because it is a data contract with a version pin, even though no user sees it.

`test/corpus/foreign/` holds the fidelity gate for the splice writer:

| File | Content |
|---|---|
| `SOURCES.json` | seven third-party Obsidian vaults, each with remote, commit SHA, commit timestamp, `md_files`, `md_bytes`. Totals: 8,513 files, 19,047,891 bytes, `pinned_on: 2026-08-29` |
| `MANIFEST.sha256` | 8,513 lines (`wc -l`), each `<sha256>  <bytes>  <vault/relative/path.md>` |
| `_vendor/` | the clones — **gitignored** (`test/corpus/foreign/.gitignore:1`), so `npm run corpus` re-clones at the pinned commit and verifies |

`SOURCES.json` states the rule for a mismatch: "A mismatch means upstream moved — that is a
finding, not a failure to paper over." The `_vendor/` directory is present on this machine
with all seven vaults.

---

## 13. Where each shape lives, one table

| Shape | Store | Durability | Rebuildable from |
|---|---|---|---|
| Note body (committed) | git repository | permanent, versioned | — (this is the record) |
| Note body (uncommitted) | IndexedDB `sgnk-md`/`drafts` | one browser profile, no expiry | **nothing** |
| `public_slug` | note frontmatter, in git | permanent | — |
| Soft-deleted note | `_Trash/` in git | permanent until hard delete | — |
| Dirty-path index | localStorage `sgnk-md:dirty` | one browser profile | IndexedDB (`rebuildDirtyIndexFromIDB`) |
| Vault snapshot | localStorage `sgnk-snapshot-cache:v1` + server LRU | cache | git zipball |
| Search index | server module `Map` | cold-start lifetime | git zipball |
| Open tabs | sessionStorage `sgnk-md-editor` | one tab, one session | — (structural only) |
| Bookmarks | localStorage `sgnk-md-bookmarks` | one browser profile | **nothing** |
| Editor settings | localStorage `sgnk-md-editor-settings` | one browser profile | defaults |
| Pane / theme / split prefs | localStorage, 6 keys | one browser profile | defaults |
| Folder open state | localStorage `sgnk-tree-open:<path>` | one browser profile, unbounded | defaults |
| App shell | Cache Storage `sgnk-md-v2` | until version bump | network |
| Session | signed JWT cookie | cookie lifetime | re-login |
| Review state | — | **does not exist** | — |
| Users, vaults, notes, revisions, shares | — | **designed in `firestore.rules`, zero writes** | — |

Two rows have no recovery: uncommitted drafts and bookmarks. Both live in exactly one
browser profile, and neither is backed up anywhere. That is the data-loss surface of this
product as built, and it is worth deciding about deliberately rather than by default.

---

## 14. Open questions this document does not answer

1. **Does the Firestore design ship?** §7. Everything about legal exposure, the second
   identity model, and whether "we never hold your documents" is sayable follows from it.
   `docs/PRODUCT-BRIEF.md:365` has it as an open decision for the founder meeting.
2. **Is the MiniSearch cache bounded?** §9, marked **unverified**.
3. **What migrates the `sgnk-md` keys?** §6. Nothing today. The migration has to be written
   before any rename, and the reader has to accept both names for at least one release.
4. **Does `GITHUB_REPO`'s default need to change?** §2.1. Shipping with a default that
   points at the sibling product's vault is a latent misconfiguration.
