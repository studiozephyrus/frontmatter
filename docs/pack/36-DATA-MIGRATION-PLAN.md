---
id: 36-DATA-MIGRATION-PLAN
title: Data migration plan
mode: how-to
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [migration, schema, persistence-keys, backfill, data-rollback]
---

# 36. Data migration plan

**The prohibition first, because it is the one that loses a stranger's work.**

> **Never rename a legacy `sgnk-md` persistence key without a migration.** Doing so silently
> orphans that user's local drafts and settings. The data is still on their disk, under a name
> nothing reads. Nothing errors, nothing warns, and their unsaved work is simply gone from their
> point of view.

**Why they are still called `sgnk-md` when the brand is `frontmatter`.** Deliberately. `AGENTS.md`
section 8 records the split: the user-visible brand changed, and several persistence keys kept the
legacy prefix **on purpose**. The Tauri bundle identifier `ai.sgnk.md` is likewise unchanged, for
the same reason.

---

## 1. The legacy keys, exactly

**Verified at `0af3c90`** `[O]` with `grep -rn "sgnk-md" src/`. **Storage backend matters as much
as the name**, because it decides who can read it and when it is evicted.

Key | Backend | Declared at | Holds | On a rename without migration
`sgnk-md` database, `drafts` store | **IndexedDB**, via `idb-keyval` | `src/modules/drafts/infrastructure/draft-store.ts:19` | Every unsaved draft, under keys `draft:<path>` | **Every unsaved draft is orphaned.**
`sgnk-md:dirty` | **localStorage** | `src/modules/drafts/infrastructure/draft-store.ts:14` | The dirty-path index, for fast synchronous lookups | Drafts survive, but the app believes nothing is dirty. No dot appears and nothing prompts a save.
`sgnk-md-bookmarks` | **localStorage** | `src/modules/editor/presentation/bookmarks.ts:31` | Starred note paths | Every bookmark disappears.
`sgnk-md-editor-settings` | **localStorage** | `src/modules/editor/presentation/editor-settings.ts:46` | `vimMode`, `lineNumbers`, `spellcheck`, `focusMode`, `aiGhostText` | Settings reset to defaults. **`aiGhostText` resets to `false`**, the safe direction. The rest are the user's choices.
`sgnk-md-editor` | **sessionStorage** | `src/modules/editor/presentation/editor-store.ts:226` | `tabs` and `activePath` only, by `partialize` | Open tabs are lost on the next load. **Lowest stakes of the five.**
`ai.sgnk.md` | Tauri bundle identifier | `src-tauri/tauri.conf.json` | The desktop app's identity | It becomes a different application: new container, no preferences, sign-in lost.

**The wider check, run on 2026-09-18** `[O]`: `grep -rnE 'localStorage|sessionStorage|idb-keyval|caches\.open' src public`.
It finds eleven more entries that do not carry the `sgnk-md` prefix. None holds document text, so
losing one costs a preference, never writing. They still follow the procedure in section 2.

Key | Backend | Declared at | Holds
`sgnk-theme` | localStorage | `src/modules/app-shell/presentation/ThemeToggle.tsx:25` | Light or dark
`sgnk-right-pane`, `sgnk-right-pane-mode` | localStorage | `src/modules/app-shell/presentation/RightPaneCycle.tsx:33` and `:58` | Right pane state
`sgnk-left-pane` | localStorage | `src/modules/app-shell/presentation/VaultWorkspace.tsx:110` | Left pane open or closed
`sgnk-scrollind` | localStorage | `src/modules/app-shell/presentation/ScrollbarToggle.tsx:38` | Scrollbar shown or hidden
`sgnk-split` | localStorage | `src/modules/editor/presentation/EditorPane.tsx:452` | Split ratio
`sgnk-snapshot-cache:v1` | localStorage | `src/modules/vault/presentation/SnapshotProvider.tsx:59` | The vault snapshot, a cache the server re-seeds
`sgnk-tree-open:<path>` | localStorage, one key per folder | `src/modules/vault/presentation/file-tree/TreeItem.tsx:8` | Folder open or closed
`sgnk:search-preset` | sessionStorage | `src/modules/preview/presentation/KnowledgePanels.tsx:40` | A one-shot search handoff
`sgnk:pwa-reloaded` | sessionStorage | `src/modules/app-shell/presentation/PWARegister.tsx:21` | A reload guard
`sgnk-md-v2` | Cache Storage, in the service worker | `public/sw.js:13` | The offline app shell

**One field is deliberately not persisted.** `contentByPath` is excluded by `partialize` at
`src/modules/editor/presentation/editor-store.ts:233`, and the comment above it says why: it is large, stale across commits, and re-seeded
from the vault API when a note loads. **Never add it to the persisted set.**

---

## 2. The rule, stated as a procedure

**A persistence key cannot be deprecated. It can only be migrated.** There is no "we will drop it
next release", because the data is on somebody else's disk and they never agreed to a release
schedule.

**Six steps, and steps 3 and 6 are the ones that get skipped.**

Step | What | Why
1 | **Write the new key alongside the old one.** Both exist | A user on an old tab and a user on a new tab must both work.
2 | **Read the new key, falling back to the old one.** On a successful fallback read, write the new key | This is the migration. It happens per user, on their next visit, with no batch job.
3 | **Do not delete the old key in the same release** | A rollback in that window would strand every migrated user. See section 6.
4 | **Ship, and wait.** Long enough that the people who visit rarely have visited | A month is a guess, not a measurement. Section 5 says how to replace the guess.
5 | **Then delete the old key on read**, after a successful migration only | Deleting on a failed read destroys the thing you were migrating.
6 | **Record the migration in the release note and in section 7 of this file** | An undocumented migration is indistinguishable from data loss when somebody investigates it a year later.

**The fallback read is the whole mechanism.** It is one function, it runs on the client, and it
needs no backfill job for browser storage. **Reach for a batch job only when the data is on our
servers**, which is section 4.

---

## 3. The precedent already in the code

**A key migration of exactly this shape already ships**, and it is the model to copy.

`src/modules/editor/presentation/path-rename.ts` migrates a draft when a note is renamed or moved.
Without it, a rename leaves the open tab pointing at the deleted old path and the IndexedDB draft
orphaned under the old key, so **unsaved edits are silently lost on the next snapshot refresh**

**Four things it does right, in fourteen lines:**

- **Writes the new key before deleting the old one:** `saveDraft(newPath, ...)` then
  `deleteDraft(oldPath)`.
- **Preserves `baseSha`**, so optimistic concurrency control still works against the server after
  the move. **A migration that drops a version marker turns a safe write into a blind one.**
- **Is best effort and never blocks:** the whole body is inside a `try` whose comment reads
  "draft migration is best-effort - never block the rename on it".
- **Remaps the in-memory store afterwards**, so the interface and the storage agree immediately
  rather than at the next reload.

**Copy this shape.** New first, old second, version markers preserved, failure non-fatal.

---

## 4. Migrations of records we hold

**Nothing is held on a server yet**, other than files in a GitHub repository. `34-INTEGRATIONS.md`
section 5 shows Firestore is initialised and unused, and section 6 shows R2 is not built. **So
every migration in section 7 is browser-local today.**

**When records do land, the ordered procedure is:**

Step | What | Gate
1 | **Write the migration as a reviewable proposal**, never as an applied change | An applied schema change is a destructive operation.
2 | **Name the operation, the blast radius, and what you checked to confirm safety** | Per-operation approval. "Continue", "ok" and silence do not count.
3 | **Take a pre-operation backup and verify it**, path and size stated | Even with approval, mistakes happen. The dump is the only durable safety net.
4 | **Preview the match count before any filter that deletes rows.** Count first, delete second | A preview costs ten seconds. An over-broad filter costs the rows.
5 | **Apply** | Only after an explicit yes.
6 | **Verify the post-state and report it**, with the counts | A migration with no after-count is a hope.

**The Firestore-specific constraints**, from `docs/mvp0/PRODUCT-PLAN.md` section 15:

- **A document cannot exceed 1 MiB.** Document bytes live in R2; a Firestore document holds
  metadata and a content hash. **A migration that starts putting content in Firestore has broken
  the data model, not just a limit.**
- **Ledger entries are append-only and never updated.** A balance is a sum over a collection. **So
  a ledger migration adds a collection; it never rewrites entries.**
- **The `plan` field is server-owned after create.** A client may only ever write `free`. Any
  migration touching it runs through the Admin SDK, which bypasses the rules.

**Indexes are part of the migration, not an afterthought.** `firestore.indexes.json` holds seven
composite indexes and six `fieldOverrides` that exclude large fields from indexing. **A new query
shape needs its index deployed before the code that issues it**, or the query fails in production
while working locally against a small collection.

---

## 5. The first real migration: local drafts to the cloud

**This one is already known and scheduled.** Phase A, `docs/mvp0/PRODUCT-PLAN.md` section 15, acceptance
criterion A33: "Migrates the local drafts the shipped app holds under its legacy keys into the
signed-in account".

**What has to move**, from section 1:

Source | Destination | Note
IndexedDB `sgnk-md` / `drafts`, keys `draft:<path>` | The account's drafts | **Carry `baseSha` and `updatedAt`.** Dropping `baseSha` turns every subsequent save into a blind write.
localStorage `sgnk-md:dirty` | Derived, not migrated | The dirty index is a cache over the drafts. **Rebuild it from the drafts after the move**, which is what `src/modules/drafts/infrastructure/draft-store.ts:63` already does on a corrupt index.
localStorage `sgnk-md-bookmarks` | The account's bookmarks | Paths only.
localStorage `sgnk-md-editor-settings` | The account's settings | **`aiGhostText` stays off unless the user turned it on.** The plan has ghost text off by default, and a migration must not flip a consent-shaped default.
sessionStorage `sgnk-md-editor` | **Not migrated** | Tabs are per-session by design.

**Six rules for this specific migration, because it is the first one a stranger will experience:**

1. **Do not delete the local copy on success.** The plan's rule is that the browser must never be
   the only copy; it does not follow that the server should become the only copy either. **Keep
   both until the user has seen the document in the account.**
2. **A conflict is never merged silently.** If a path exists in both places with different bytes,
   keep both and let the person choose. That is S31, and it is the same rule Drive sync obeys.
3. **Migrate on sign-in, not on load.** There is no account to migrate into before sign-in.
4. **It must be resumable.** A person closing the tab halfway through must not lose the remainder.
   Migrate per draft, and record per draft.
5. **It must be idempotent.** Running it twice produces the same result, because it will run twice.
6. **Say what happened.** A count, in the interface: how many drafts moved. **A silent success is
   indistinguishable from a silent failure**, and this is the one moment the user is watching.

**The eviction risk that sets the deadline.** Safari deletes all script-writable storage after
seven days of Safari use without a visit, unless the app is on the home screen
(`docs/mvp0/PRODUCT-PLAN.md` section 12). **So a Safari user who does not return within seven days has
nothing left to migrate.** That is not a reason to rush the migration; it is a reason for the
first connection to push everything to the server, which is what the plan already requires.

---

## 6. Rollback

**The inventory, honestly: there are no rollback scripts.** None exists at `0af3c90`, because no
migration has run.

**What that means, and it is not a small thing.** Rolling the application back does not roll data
back. `32-DEPLOYMENT-AND-OPS.md` section 5.3 lists what a deploy rollback cannot undo, and a
migration is at the top of it.

**So every migration ships with its reverse, written and tested before the forward one runs.**

Migration kind | Its reverse | Testable how
A key rename in browser storage | The fallback read in step 2 **is** the reverse, as long as the old key still exists. **That is why step 3 forbids deleting it in the same release** | Load the new build against a profile holding only old keys.
A key deletion, after the wait | **Not reversible.** The data is gone from that browser | Nothing. **This is why step 4 exists**
A Firestore field added | Ignore the field | A read that does not require it.
A Firestore field renamed | Write both for a release, read with a fallback, exactly as for browser keys | An emulator run against a fixture holding the old shape.
An R2 key-layout change | **Write the new layout, keep the old objects.** R2 has no object versioning, so an overwrite is final | A read against both layouts.
Records moved between stores | A reverse copy, plus a decision about writes that landed in between | Only with a pre-operation dump.

**The R2 constraint governs, and it is settled: R2 has no object versioning.** An overwritten
object is not recoverable. **So a migration never overwrites an R2 object. It writes a new key and
leaves the old one**, and reclaiming space is a separate, later, approved operation.
`37-BACKUP-AND-RECOVERY.md` designs the key layout around this.

**A rollback that needs a data restore is an incident, not a deploy.** `38-INCIDENT-AND-SEVERITY.md`
carries the ladder.

---

## 7. The migration register

**Every migration gets a row, forever. Never renumber, never remove a row.** A migration that was
reverted keeps its row and says so.

Id | Date | What moved | Forward | Reverse | State
`M001` | planned, phase A | Local drafts, bookmarks and editor settings into the signed-in account. Section 5 | not written | not written | `planned`

**The columns are the contract.** A row with no reverse in the `Reverse` column is a row that
cannot be shipped, whatever the `Forward` column says.

**Id format:** `M` plus three digits, matching the identifier convention in `65-CONVENTIONS.md`
section 3. **Never reused, never renumbered.**

---

## 8. A contradiction the plan carries, and how to read it

**Two sections of the plan of record disagree about the database**, and an agent reading section 18
alone would build the wrong thing.

Source | What it says
`docs/mvp0/PRODUCT-PLAN.md` section 15 onward, section 15 | **The founders decided on 17 September: Firestore.** "The stack is the Next.js app we already run, Cloudflare R2 for bytes, and Firestore for records, with Firebase Auth for sign-in".
`docs/mvp0/PRODUCT-PLAN.md` section 18 onward, section 18 | The data-model table says **"Postgres rows"** for workspace, document head, share link, published page, collaborator, comment, change-queue item, connection, agent token, ledger entry, plan and invoice.

**Read it this way.** Section 15 is the founders' decision and is the newer intent; section 18's
table was not rewritten after the decision. **Read "Postgres row" as "a record in the database",
and the database is Firestore.**

**Why it matters here specifically.** The two have genuinely different migration mechanics.
Postgres migrations are versioned files applied in order against a schema. **Firestore has no
schema and no migration files**, so a migration is application code plus a rules change plus an
index deployment, and the "old shape" keeps existing in documents nobody has touched.

**So this is not a cosmetic inconsistency.** Whoever writes `M002` needs to know which mechanics
apply. **Raise it rather than guessing**, and record the answer in `56-OPEN-DECISIONS.md`.

---

## 9. Limits of this file

**What was not assessed.**

- **No migration has ever run.** Sections 2, 4, 6 and 7 are a procedure, not a record.
- Whether any real user holds data under the legacy keys. **The keys exist in the code; how many
  browsers hold values under them is unknown and unmeasurable from here.**
- The Firestore emulator as a migration test bed. It is declared in `firebase.json` and no script
  runs it.
- Server-side quotas or cost of a bulk backfill. Nothing is on a server to backfill.

**What could not be verified.**

- Browser storage beyond the six `sgnk-md` entries: checked on 2026-09-18, eleven more found and
  listed in section 1. Cookies set by Auth.js and Firebase's own IndexedDB were not in the grep's
  reach; they belong to those libraries.
- The Safari seven-day eviction in section 5, re-opened on 2026-09-18 `[M]`: WebKit's post
  `https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/` says the cap applies
  `after seven days of Safari use without user interaction on the site`, and that home-screen apps
  have `their own counter of days of use`. It dates from 2020; WebKit may have changed it since.

**What is not established.**

- How long "long enough" is in step 4 of section 2. **A month is a guess.** Replacing it needs a
  measurement of return frequency that nothing collects today.
- Whether Firestore or Postgres mechanics govern. Section 8 states the contradiction and refuses to
  pick.
- Whether the local copy in section 5's rule 1 should ever be deleted, and on what signal.

**What would falsify this file.**

- A `grep -rn "sgnk-md" src/` returning a key that has no row in section 1.
- A shipped release that renamed a key in section 1 without a row in section 7.
- Any migration in section 7 reaching `shipped` with an empty `Reverse` column.
