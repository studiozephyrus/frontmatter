# frontmatter — Pain-Point Deep-Dive Playbook

Synthesized from 6 evidence drills (sync-integrity, collab-suggest, wysiwyg-editor, mobile-offline-pwa, capture-retrieval-ai, onboarding-trust). Every quote is verbatim from the cited source. Effort marks: **S** (≤1 day), **M** (batch item, days), **L** (multi-batch/engine work). Module keys: `merge3.ts`, `editor` (CodeMirror), `publish`, `sw.js` (PWA), `auth`, `new:*` (module that does not exist yet).

---

## Drill 1 — Sync Integrity

### 1.1 Failure mechanics

- **Mobile "resolve" = silent local-wins.** obsidian-git on iOS never renders conflict markers into the visible file after a conflicted pull; the user's next "Backup" commits the local side as the resolution — and the merge commit ALSO reverts unrelated files changed remotely since divergence (issue #558: note2's desktop edits vanished when only note1 conflicted).
- **Stale-device whole-repo rollback.** GitJournal's merge chose local-over-remote for the entire tree; a phone 10 days stale pushed a merge silently reverting 11,145 edits across 308 files — invisible in git log and the GitHub UI, discoverable only via reflog (GitJournal #241).
- **Failed-commit + checkout = deletion.** When commit fails (e.g. missing author name), files stay staged; isomorphic-git's checkout removes staged files, so the next auto-pull physically deletes new notes with no error (obsidian-git #396; upstream isomorphic-git #1741 unfixed).
- **Mobile merge dead-end.** Any non-fast-forward pull on obsidian-git mobile throws `MergeNotSupportedError`; push throws `PushRejectedError`. No in-app escape: users re-clone (lose local), force-push (lose remote), or drop to iSH/Working Copy (#340).
- **The unsynced-edit window.** Debounced auto-commit (5 min) means closing the app before the timer leaves the edit uncommitted; the eventual merge conflicts or clobbers — trigger is timing, not user error (#558 comment).
- **Last-write-wins with zero conflict detection.** SilverBullet's early sync and Joplin-over-WebDAV let a stale device overwrite newer server content "without notice or warning or conflict handling" (SilverBullet #5; Joplin forum 44644).
- **Autosave debounce truncation.** Joplin buffers keystrokes ~100ms; typing then closing within the window permanently drops the input — worse on slow phones (forum 44644, maintainer-confirmed).
- **mtime-as-version-hash race.** SilverBullet identifies versions by last-modified timestamp; an 11.6s PUT on slow storage races the file-list fetch → "Page changed elsewhere, reloading" discards the live editor buffer or spawns `page.conflicted.<ts>.md` copies (#479, #1040).
- **Edit-before-first-sync clobber.** Typing on a not-yet-synced device (daily-note pattern) makes the eventual sync overwrite the other device's version wholesale; recovery only per-file (Obsidian Sync forum 67946; sub-line truncation forum 94777).
- **Silent acceptance of truncation.** Obsidian auto-accepts an external change zeroing a file to 0 bytes — no snapshot-before-accept, no warning (forum 30000, 54 posts).
- **Conflict-dump recovery UX.** Joplin's Conflicts notebook drops raw copies with no diff/source-link; users found 11K notes reduced to a 1.5K "Conflicts" tab (forums 5062, 12331). Git tools require reflog literacy to even see loss.
- **Cross-device config divergence.** One device rebase, one merge → histories mobile cannot reconcile (#340). User-configurable merge strategy is itself a data-loss vector.

### 1.2 Best failure stories

1. > "there were 11,145 edits to 308 files. They were all silently rolled back."
   — GitJournal, stale phone pushed local-wins merge; loss invisible except in reflog. https://github.com/GitJournal/GitJournal/issues/241
2. > "we lose not only the macbook version of the conflicted file (note1), but we also lose the macbook changes to note2!"
   — obsidian-git iOS "resolve" reverting an *unconflicted* file. https://github.com/Vinzent03/obsidian-git/issues/558
3. > "all notes (>11K) where gone except a tab labeled as 'Conflicts' with a few notes (1.5K)."
   — Joplin, single device, local sync target; unrecoverable via re-sync. https://discourse.joplinapp.org/t/lost-all-notes-due-to-conflict/5062
4. > "My notes for the last 10 sessions and next 5 or so sessions of D&D planning all vanished into the zero-byte hole."
   — Obsidian silently accepting a truncation-to-zero; user left the product. https://forum.obsidian.md/t/0-byte-file-again-note-completely-destroyed/30000

### 1.3 Prior art — do-not-repeat

| Attempt | Approach | Why insufficient |
|---|---|---|
| obsidian-git | isomorphic-git on mobile, real git on desktop; auto commit-and-sync timers; user-configurable merge/rebase | Mobile can't render conflicts (#340 dead-end); silently commits local side and reverts unrelated files (#558); failed-commit→checkout deletes notes (#396); maintainer calls upstream library unfixable — https://github.com/Vinzent03/obsidian-git/issues/558 |
| GitJournal | Mobile-first; merge = always local-over-remote; later dart-git rewrite promising word-based merge | Local-wins caused invisible whole-repo rollbacks (#241); dart-only merge zeroed a remote file; proper 3-way merge/conflict dialog/stale-fetch banner never shipped — https://github.com/GitJournal/GitJournal/issues/241 |
| Joplin Conflicts folder + plugin + GSoC 3-way proposal | Losing note copied to a local "Conflicts" notebook; community 2-way diff plugin; GSoC draft for true 3-way with stored base | Conflicts folder loses context (11K→1.5K disasters); plugin desktop-only, 2-way; 3-way still a draft (note-history can't supply the base); 100ms autosave loss window open — https://discourse.joplinapp.org/t/gsoc-2026-proposal-draft-idea-10-automatic-conflict-resolution-sriram-varun-kumar/49197 |
| SilverBullet sync | mtime as version "hash"; conflicted-copy files; late save-in-flight guard; If-Match conditional PUT proposed | mtime breaks on slow/clock-skewed storage → false reloads discard the buffer (#479, #1040); conflicted-copy proliferation with Syncthing; CRDTs explicitly rejected, If-Match never fully implemented — https://github.com/silverbulletmd/silverbullet/issues/479 |
| Obsidian Sync (paid, first-party) | Proprietary E2E sync, automatic text merging, per-file version history, File Recovery | Clobbers on edit-before-initial-sync (67946); mid-line truncation attributed to unused devices (94777); restore UX confuses mid-incident; per-file recovery only, no bulk "undo this sync"; merge is a black box — https://forum.obsidian.md/t/obsidian-sync-seems-to-delete-files/11366 |
| Manual escape hatches (Working Copy/iSH, mobile-branch, `replace --graft`) | Power users route around broken mobile merges | Expert-only, multi-step, and still lost people days of notes; a sync layer requiring reflog/merge-base literacy has already failed the bar — https://github.com/Vinzent03/obsidian-git/issues/340 |

### 1.4 Requirements spec

1. **[S — editor]** Persistent per-file + per-device sync chip: synced (relative time of last pull AND push), pending (n ops), offline, error. Error state clickable → exact failed op + last-known-good sync time.
2. **[M — editor + sw.js]** Stale-edit guard: on editor focus with last revalidation older than threshold (or tab was hidden/offline), show inline banner "You may be editing a stale copy — last synced X ago" at the point of editing, and kick revalidation. Ambient icons alone are ignored (GitJournal #241).
3. **[M — merge3.ts + editor]** Loud failure invariant: any push/pull failure blocks all silent auto-resolution paths and surfaces a dismiss-resistant notice. A failed write must NEVER be followed by any operation that replaces/discards local buffer content (kills obsidian-git #396 class).
4. **[S — merge3.ts]** Version identity is content hash, never mtime/timestamp (timestamps advisory only). Every write remains baseSha-gated with 409 on mismatch (kills SilverBullet #479/#1040 class). Accept: clock-skewed client cannot trigger a false conflict.
5. **[M — editor + merge3.ts]** Single-writer discipline: sync/revalidate never runs against a file whose save is in flight; a save is never issued while a merge of the same file runs.
6. **[L — merge3.ts]** On 409, 3-way merge at hunk level against recorded base: non-overlapping hunks auto-merge; ONLY overlapping hunks escalate. Whole-file local-wins or remote-wins auto-resolution forbidden in every code path including bulk/initial sync (kills #241 and SilverBullet #5 classes).
7. **[M — merge3.ts]** Frontmatter/title conflicts resolve field-by-field (scalar: keep-mine/use-theirs chips; lists: union by default). Never conflict markers inside YAML (Joplin GSoC lesson).
8. **[M — merge3.ts]** Scope-isolation invariant: a sync from device A may only change files device A edited since its base; assert every other blob in the produced tree equals remote head, abort otherwise (kills #558 unrelated-file revert + #241 rollback). Accept: fault-injection test with concurrent clean edits to file B while file A conflicts — B untouched.
9. **[L — merge3.ts + editor]** Conflict UI: overlapping hunks land in a holding area with both versions preserved; per-hunk keep-mine / take-theirs / keep-both + side-by-side diff; identical on mobile-width. User is never told to hand-edit `<<<<<<<` markers; markers never committed to the visible note or the `public_slug` output (**touches publish**).
10. **[M — editor + new:conflict-inbox]** Unresolved conflicts are durable: badge + inbox (note title, devices, timestamps); survives reloads/sessions/devices until resolved; opening a conflicted note always shows the resolution flow, never one silent winner.
11. **[L — merge3.ts + new:journal]** Journal-before-overwrite: any op that replaces/deletes content (merge resolution, remote-wins, delete propagation, publish) first appends the losing version in full to an append-only recovery journal (IndexedDB + remote). Accept: pre-image of every replaced hunk retrievable via UI for ≥30 days.
12. **[M — merge3.ts]** Truncation quarantine: any write shrinking a note below 20% of prior size (or to 0 bytes) is held, snapshotted, and requires explicit confirmation with diff preview (the forum-30000 ask, never implemented there).
13. **[M — new:activity-timeline]** Recovery UX: vault-wide activity timeline (changes grouped by sync event, device attribution), one-click restore of a version AND bulk "undo everything this sync event did." No git literacy required.
14. **[M — editor + sw.js]** Local-first keystroke durability: buffer persists to IndexedDB ≤1s after last keystroke; synchronous flush on visibilitychange/pagehide; app kill loses ≤1s of typing (kills Joplin 100ms class). Queued offline writes survive restarts and replay with original baseSha.
15. **[M — merge3.ts + sw.js]** Reconnect after days/weeks: fetch-then-merge per changed file with visible progress; sync everything non-conflicting first, enqueue conflicts to the inbox; never block the whole sync on one conflict (#340) and never push a stale tree.
16. **[S — merge3.ts]** Engine invariants: append-only remote history, no force-push, no history rewriting, single hard-coded merge strategy for all clients (no configurable rebase-vs-merge, #340); every sync event = auditable commits with device+timestamp attribution.
17. **[L — merge3.ts + CI]** Operational "never lose data": (a) content visible in an editor ≥1s is recoverable; (b) content ever persisted on any device is recoverable ≥30 days; (c) no code path discards content except explicit user choice — and the discarded side lands in the journal; (d) failure modes degrade to "stale but intact", never "merged wrong." Verified by an automated two-client fault-injection suite (offline races, kill-mid-save, saves >10s, clock skew, simultaneous creation, case-only renames).
18. **[M — merge3.ts]** Same-file simultaneous creation (daily notes): treat empty-or-template content as trivially mergeable base and union the bodies; never let a near-empty template replace populated content (67946/94791 class).

### 1.5 Edge cases register

- Device offline for weeks reconnects and pushes a stale tree (only reflog showed the loss)
- Conflict on file A must not revert clean concurrent changes to file B (#558)
- Failed auth/misconfig followed by any checkout/revalidate — must not touch local buffers (#396)
- App killed within ~100ms–1s of last keystroke (Joplin autosave buffer)
- Save latency >10s racing background revalidation on slow storage (#479/#1040)
- Daily-note same-path auto-creation on two devices, then divergence (67946, 94791)
- Editing during a new device's initial sync before first pull completes
- Incoming write truncating to 0 bytes or <20% of prior size (forum 30000)
- Clock skew between client, server, and NAS-backed storage
- Case-only renames deleting files on case-insensitive filesystems (forum 47768)
- Conflicted-copy proliferation loop when an external syncer (Syncthing) also touches the store
- Title/frontmatter single-line conflicts where inline markers would corrupt parsing
- Divergent merge configuration across clients — forbid configurability entirely (#340)
- Very large notes (500+ checkboxes / 1000+ lines) opening edit-during-processing races (#1040)
- Conflict-on-conflict: third device pushes to the same region before a resolution lands
- Mobile Safari tab closed/backgrounded mid-flush (visibilitychange is the last reliable hook)

### 1.6 Sources

https://github.com/Vinzent03/obsidian-git/issues/558 · https://github.com/Vinzent03/obsidian-git/issues/396 · https://github.com/Vinzent03/obsidian-git/issues/340 · https://github.com/Vinzent03/obsidian-git/issues/51 · https://github.com/GitJournal/GitJournal/issues/241 · https://github.com/silverbulletmd/silverbullet/issues/5 · https://github.com/silverbulletmd/silverbullet/issues/479 · https://github.com/silverbulletmd/silverbullet/issues/1040 · https://github.com/silverbulletmd/silverbullet/issues/1728 · https://discourse.joplinapp.org/t/lost-all-notes-due-to-conflict/5062 · https://discourse.joplinapp.org/t/joplin-lost-90-of-my-notes/12331 · https://discourse.joplinapp.org/t/data-loss-with-joplin-android-app-and-nextcloud/44644 · https://discourse.joplinapp.org/t/gsoc-2026-proposal-draft-idea-10-automatic-conflict-resolution-sriram-varun-kumar/49197 · https://discourse.joplinapp.org/t/plugin-conflict-resolution/19204 · https://forum.obsidian.md/t/0-byte-file-again-note-completely-destroyed/30000 · https://forum.obsidian.md/t/obsidian-sync-from-phone-randomly-deleting-parts-of-a-note/94777 · https://forum.obsidian.md/t/when-i-add-a-note-to-a-page-before-it-has-synced-everything-on-that-page-gets-deleted-on-the-other-devices/67946 · https://forum.obsidian.md/t/obsidian-sync-seems-to-delete-files/11366

---

## Drill 2 — Collaboration & Suggest Mode

### 2.1 Failure mechanics

- **Character-level CRDT/OT merge is syntax-blind to markdown.** Concurrent bolding of overlapping ranges interleaves `**` delimiters into corrupted spans (Peritext: merges to `**The **fox** jumped.**`, un-bolding "fox"); two users prepending `#` to the same line converge to `##` — H1 silently demoted (Fugue). Markdown delimiters are content, not structure: a converged merge can still be semantically wrong.
- **External-write blindness.** When the .md is a real file mutated by non-editor actors (git pull, linters, AI agents, vault-wide rename, Obsidian Bases), the live CRDT state diverges from the file → false merge-conflict on every open (Relay #22, root-caused in PR #78: nothing updates the CRDT when an external tool writes the file).
- **Non-prose .md corrupts under text-merge.** Excalidraw stores JSON in .md; Relay's markdown sync "often leads to file corruption" (Relay #105). Any collab layer keyed on extension destroys canvas/base/plugin files.
- **The comments-storage deadlock (HedgeDoc #657, open 2020→2026).** Comments IN the markdown (CriticMarkup) pollute every other pipeline and make comment-only permission impossible ("for using critic markup you need to change the content"); comments OUTSIDE the file were vetoed by the core team ("we're strictly against meta data that are not part of the markdown code"). Neither shipped; users left for HackMD/Google Docs.
- **Comment anchors rot.** Plain text has no stable node IDs; offset/line anchors break under concurrent edits. Robust anchoring needs stable IDs (Peritext's immutable operation IDs; Weidner's "apply bold from ID X to ID Y"). Google Docs' anchored-comment resilience is the cited killer feature.
- **Suggest-mode is genuinely hard in real editors.** Intercepting a transaction and converting deletions into strikethrough overlays requires re-mapping every subsequent step — "one of the hardest things that you could try" (discuss.prosemirror.net #5033). The ecosystem monetizes it (CKEditor/TipTap paid add-ons); OSS markdown editors ship without it.
- **Git vs realtime impedance mismatch.** Per-keystroke ops don't map to commits (HedgeDoc #222, open since 2019); HackMD's answer is per-note manual push, gated at 20 GitHub pushes/month free — "non-starter for 100s or 1000s of notes."
- **Permission granularity forces the Google Docs fallback.** codimd #35 "invitee only" is the top-voted issue (51 votes, open since 2015); missing tiers: invitee-only, comment-only, suggest-only.
- **Frontmatter under text-merge** can yield duplicate keys / invalid YAML; correct behavior is per-key map merge. (Severity in the wild: unverified — no specific public bug found.)
- **Privacy/self-hosting objection** blocks cloud collab layers for vault owners; selective opt-in-per-folder sharing is table stakes.
- **Guest access is the adoption chokepoint.** Reviewers won't install an app or create an account; HackMD wins here; Relay requires Obsidian + login; Peerdraft's web-guest model is the differentiator.
- **Multiplayer undo must be op-scoped to the user.** Colibri's global undo deleted an entire document at launch.

### 2.2 Best failure stories

1. > "our org will likely have to switch off HedgeDoc to HackMD if there's no openness"
   — 6-year comments deadlock becomes terminal for an org deployment. https://github.com/hedgedoc/hedgedoc/issues/657
2. > "the commenting system in Google docs is the main killer feature for collaboration."
   — HN's most-agreed critique of CodiMD: the review layer, not sync quality. https://news.ycombinator.com/item?id=23997361
3. > "whenever CC makes an edit to any Obsidian file, it causes CRDT to show a merge conflict"
   — Relay user whose primary workflow is AI-agent edits; had to write a hook force-opening files to keep the CRDT in sync. https://github.com/No-Instructions/Relay/issues/22
4. > "I pressed Undo and all text disappeared and I couldn't get it back via Redo"
   — Colibri launch-day: global multiplayer undo as a data-loss primitive. https://news.ycombinator.com/item?id=47221706

### 2.3 Prior art — do-not-repeat

| Attempt | Approach | Why insufficient |
|---|---|---|
| HackMD | Hosted realtime OT-lineage editor; comments + suggest on all tiers; per-note manual GitHub push/pull | Right review layer, wrong storage: notes in HackMD's DB, git is per-note/manual/rate-limited (20 pushes/mo free); 10-version free history; closed source — https://hackmd.io/pricing |
| HedgeDoc | Self-hosted realtime md editor, markdown-as-single-source doctrine; HD2 = CM6 + Yjs | No comments/suggest/git backend after 6+ years of top-voted requests (#657, #2879, #222) — doctrinally deadlocked; no invitee-only/guest tiers — https://github.com/hedgedoc/hedgedoc/issues/657 |
| Relay (System 3) | Yjs CRDT sync of shared folders inside Obsidian; live cursors; closed auth server | CRDT parallel to filesystem → false conflicts on every external write (#22), corrupts JSON-in-.md (#105); requires Obsidian + login; no comments/suggest; privacy objections — https://github.com/No-Instructions/Relay/issues/22 |
| Peerdraft | E2E sessions + persistent shares; browser guests, no account; collaborators free | Right access model, tiny surface: no comments/suggest/git/self-hosting; single-maintainer risk — https://www.peerdraft.app/ |
| Colibri | GitHub .md URL → Docs-like realtime editor; merges back as a PR | Launch-day undo wiped a doc; single-file scope; private repos/permissions unshipped — https://www.get-colibri.com/ |
| CollabMD | Files-first, Yjs only as collab layer, source-anchored comments | Validates the architecture, but demo-stage: no adoption, no suggest mode, unclear anchor-rot handling — https://collabmd.dev/ |
| Etherpad | OT plain-text pads; md via plugin | Maintainers ruled out markdown-native editing permanently; plugin removed from releases — https://github.com/ether/etherpad-lite/issues/695 |
| CryptPad Code | E2EE CodeMirror md pad | E2EE tax stutters on large docs; md export bugs (#1760); no git/suggest; comments only in Rich Text app — https://github.com/cryptpad/cryptpad/issues/1760 |
| Nuclino | Commercial realtime wiki, md export | Markdown is export not storage (lossy round-trip); lock-in — the anti-pattern frontmatter opposes — https://docmost.com/blog/nuclino-selfhosting/ |
| CKEditor 5 / TipTap | Comments + track-changes as commercial add-ons | Proves buildability, prices it out of OSS/indie; HTML/JSON-doc-centric, not CommonMark-in-git — https://tiptap.dev/pricing |
| prosemirror-suggestion-mode | OSS accept/reject suggestions as PM marks | ProseMirror-only (frontmatter is CM6); marks live in the PM doc not the file; useful only as a state-machine design reference — https://discuss.prosemirror.net/t/implementing-google-docs-like-suggest-edit-mode/5033 |
| Automerge / Loro (Peritext, Fugue) | CRDT engines with rich-text intent preservation | Engines not products; their formatting model is marks-on-text — the main lesson is negative: character-level merge of markdown syntax cannot preserve intent — https://automerge.org/blog/rich-text/ |
| Moment | Local .md in jj/git + per-doc collab server; comments anchored to jj change IDs (planned) | Early, desktop-first, jj-based; comments behind flags; validates demand + anchor-to-change-ID design — https://news.ycombinator.com/item?id=47236374 |
| Google Docs | The benchmark review UX (anchored threads, suggesting mode, link roles for guests) | Wins every collaboration decision, loses every storage decision: md export drops comments/suggestions; copy-in creates version drift — https://workspaceupdates.googleblog.com/2024/07/import-and-export-markdown-in-google-docs.html |

### 2.4 Requirements spec

1. **[L — auth + new:share-links]** Share links with per-link roles {view, comment, suggest, edit}: view/comment/suggest work in-browser with no account/install (anonymous display-name prompt); edit requires auth; links revocable + optionally expiring; role change effective next op. Accept: a professor with no GitHub account leaves a comment from a link on a phone.
2. **[M — new:comments (Supabase) + publish]** Comments live OUTSIDE the .md — Supabase tables keyed on stable file ID, never path, never written into git content by default; the file stays clean CommonMark. Optional CriticMarkup export/import as interchange, not storage (resolves the HedgeDoc deadlock in both directions).
3. **[L — new:comments + merge3.ts]** Tri-redundant anchors: {doc-version/baseSha + quoted text span + structural position (block index/heading path)}; re-anchor via diff-match on every edit; if anchored text is deleted, thread degrades to "orphaned" pinned to nearest surviving block with the original quote preserved — never silently dropped. Accept: comment on a word → second user rewrites the paragraph → reload → thread visible and placed or explicitly orphaned.
4. **[L — editor + merge3.ts]** Suggest mode = overlay, not mutation: stored {range-anchor, delete-text, insert-text, author, thread} rendered via CM6 decorations; underlying .md and baseSha untouched until accept. Accept applies through the normal merge3 pipeline attributed "suggested-by X, accepted-by Y"; reject archives. Per-suggestion + accept-all; threads attachable; suggestions survive concurrent edits via remap or orphan gracefully. A suggest-role user has NO code path that mutates file content directly.
5. **[L — merge3.ts + new:live-layer]** Multiplayer via server-authoritative sequencing (Weidner insert-after-character-ID rebasing), NOT a full peer CRDT — composes with merge3 + baseSha 409 and avoids the CRDT-vs-file divergence class. Presence + remote cursors + per-user-scoped undo (Colibri lesson). Offline peers reconcile through merge3 on reconnect.
6. **[L — merge3.ts]** Markdown-aware merge rules: (a) frontmatter merges per-YAML-key, never line/char-wise; (b) code fences merge line-wise inside, fence markers immutable (never an odd fence count post-merge); (c) inline delimiter pairs (`**`, `_`, `[]()`, `$$`) validated post-merge — broken pairing or stacked block prefixes (`##` from two concurrent `#`) → explicit conflict UI, never silent interleaving. Accept: two clients bold overlapping ranges offline → merged doc renders both intents or flags conflict, never Peritext's corrupted output.
7. **[M — merge3.ts + sw.js]** External writes are first-class: GitHub pushes, webhooks, AI-agent edits enter the SAME merge pipeline as keystrokes; content-hash comparison suppresses conflict prompts when disk == live or change is self-origin. Accept (the Relay #22 killer): linter/agent rewrites 50 closed files → open each → zero false conflict prompts.
8. **[M — publish + merge3.ts]** Git mapping is vault-level and session-batched: commits on idle-timeout/explicit-save/pre-pull (Overleaf model) with `Co-authored-by` trailers; never per-keystroke, never per-note manual push. Optional: materialize an accepted suggestion batch from a suggest-only reviewer as a PR authored by them.
9. **[M — auth]** Permissions: repo-level defaults + per-folder/per-note overrides; explicit invitee-only access (codimd #35's 51-vote ask); comment-only and suggest-only as enforced roles, not UI conventions.
10. **[S — merge3.ts]** Non-prose .md safety: detect Excalidraw/canvas/base files and exclude from text merge — whole-file LWW with version history, or attachment treatment (Relay #105 lesson).
11. **[M — publish + new:comments]** Data ownership as the wedge: repo stays the user's on GitHub; every comment/suggestion exportable as JSON and reconstructible; deleting the Supabase layer leaves a fully valid markdown repo. Publish this guarantee (answers the Relay privacy objection).
12. **[S — auth/pricing]** Reviewers/commenters/suggesters never pay or sign up; charge owner/editor seats only. Never gate version history (git gives it away; HackMD gates at 10).
13. **[M — new:comments]** Notification loop: @-mentions, per-thread resolve/reopen with history, email/notify on mention or reply. (Requirement shape inferred from Docs-fallback stories — partially unverified as a single quotable source.)

### 2.5 Edge cases register

- Excalidraw/canvas/base JSON-in-.md files — text merge corrupts even single-user (Relay #105)
- Multiplayer undo must be scoped to the local user's own ops (Colibri wipe)
- AI agent/bulk formatter rewrites a file with pending comments/suggestions — anchors remap or orphan visibly, never vanish; self-origin hash check prevents prompt storms
- Concurrent frontmatter edits: different keys auto-merge per-key; same-key surfaces both values (naive merge → duplicate keys/invalid YAML; wild severity unverified)
- Two users concurrently prepending `#`/`-`/`>` to the same line → `##` heading corruption with no flag (Fugue anomaly)
- Concurrent overlapping inline formatting → delimiter interleaving; post-merge pairing validation required
- Merge across a code-fence boundary can flip fenced/unfenced state for the rest of the document
- Rename/move: share links, `public_slug`, and anchors key on stable file ID, not path (rename cascades touch dozens of unopened files — the Relay #22 trigger)
- Force-push/history rewrite/branch switch invalidates baseSha-anchored comments and suggestions — explicit re-basing pass or a frozen document-version table decoupled from SHAs
- Anonymous guests: name spoofing + comment spam (HedgeDoc #6131) — rate limits + owner moderation queue
- Comments anchored inside code blocks/frontmatter: verbatim quoting, no markdown normalization
- Whitespace/line-ending-only formatter runs: no visible diffs, no conflict prompts, no anchor invalidation (normalize before hash compare)
- 50+ page documents: round-trips and re-anchoring must stay responsive (CryptPad's stutter mode)
- Same-line list-item/table-row concurrent edits: char-merge inside a row silently breaks the table for both users

### 2.6 Sources

https://github.com/hedgedoc/hedgedoc/issues/657 · https://github.com/hedgedoc/hedgedoc/issues/2879 · https://github.com/hedgedoc/hedgedoc/issues/222 · https://github.com/hackmdio/codimd/issues/35 · https://github.com/hackmdio/codimd/issues/1223 · https://news.ycombinator.com/item?id=23997361 · https://news.ycombinator.com/item?id=36446045 · https://news.ycombinator.com/item?id=47236374 · https://news.ycombinator.com/item?id=47221706 · https://github.com/No-Instructions/Relay/issues/22 · https://github.com/No-Instructions/Relay/issues/105 · https://forum.obsidian.md/t/relay-multiplayer-plugin-for-obsidian-collaborative-editing-and-folder-sharing/87170 · https://forum.obsidian.md/t/obsidian-sync-live-team-collaborative-editing/6058 · https://forum.obsidian.md/t/suggestion-mode-for-obsidian-like-google-docs-word-for-editing-notes/50255 · https://relay.md/pricing · https://www.peerdraft.app/ · https://www.get-colibri.com/ · https://collabmd.dev/ · https://hackmd.io/pricing · https://www.inkandswitch.com/peritext/ · https://arxiv.org/pdf/2305.00583 · https://mattweidner.com/2025/05/21/text-without-crdts.html · https://automerge.org/blog/rich-text/ · https://loro.dev/ · https://discuss.prosemirror.net/t/implementing-google-docs-like-suggest-edit-mode/5033 · https://github.com/ether/etherpad-lite/issues/695 · https://github.com/cryptpad/cryptpad/issues/1760 · https://www.privacyguides.org/articles/2025/02/07/cryptpad-review/ · https://docmost.com/blog/nuclino-selfhosting/ · https://tiptap.dev/pricing · https://www.draftview.app/blog/docs-as-code-review-workflow-complete-guide · https://workspaceupdates.googleblog.com/2024/07/import-and-export-markdown-in-google-docs.html

---

## Drill 3 — WYSIWYG / Live-Preview Editor

### 3.1 Failure mechanics

- **Round-trip erosion with zero user edits.** Parse-to-node-tree engines rewrite untouched text on save: Tiptap drops one blank line after headings/tables/HTML blocks per cycle (#8007); Milkdown doubles autolink backslashes exponentially 1→2→4→8→16 (#2349, upstream in mdast-util-to-markdown); Joplin's rich editor converts reference links to inline and loses raw HTML (documented); Lexical exports "invalid markdown for overlapping formats" (#4895). For frontmatter this is a data-integrity bug: a serializer that reformats unedited lines poisons merge3/baseSha and produces giant git diffs.
- **Cursor-through-syntax microbehaviors decide "feel":** marks reveal when the selection enters the span, conceal on exit, without shifting any line but the active one; hidden marks cost zero extra arrow-key presses; vim/word motions break when marks expand mid-motion (Obsidian 41517); backspace at a concealed boundary deletes the pair Typora-style.
- **Viewport/cursor jump on widget collapse.** Rendered equation/table replacing its taller source teleports the viewport (Obsidian 66219); outline/search targets land at wrong scroll positions because rendered heights differ from source heights (41107); mode toggle loses scroll (74379).
- **Tables fail in BOTH directions.** Pre-1.5 Obsidian: rendered tables collapsed to raw markdown on edit (34110, 144 likes — off-screen horizontal scrolling). Post-1.5: WYSIWYG-only table editor revolt (73866, 112 likes) — removed plaintext editing, "breaks the vim key bindings," disabled multi-cursor, overrode Advanced Tables, "can't be deactivated." The demanded fix: per-block "edit this block" source toggle, not a global mode switch.
- **"Syntax highlighting sold as WYSIWYG" rage trigger.** OverType (471-pt HN) pilloried for visible asterisks; but full-hide is also hated by power users ("Showing the markdown on cursor focus... is an amazing feature"). Winning behavior: cursor-proximity reveal; never market it as WYSIWYG.
- **Textarea-overlay technique has hard physical limits:** monospace mandatory, bold-width mismatch breaks alignment, no images, no heading sizes. Dead end.
- **List editing expectations are absolute:** Enter continues `-`/`1.`/`- [ ]`; Enter on empty item outdents/removes; Tab/Shift-Tab indent with children; no cursor jumps (Obsidian 49369 class).
- **Paste is a spec, not a nicety.** Rich HTML → markdown in place; markdown text pasted verbatim (never double-escaped); image paste saves to a relative-path assets folder (absolute paths flagged on HN within hours); Tiptap still fails pasted heading conversion (#6713).
- **The Marijn ruling.** CodeMirror+ProseMirror's author: inline conceal in CM works, but "something like tables is probably not going to work"; ProseMirror = "less fighting" for full WYSIWYG. Hence the industry split — CM6 decoration live preview (fidelity guaranteed, text IS the document) vs ProseMirror-family WYSIWYG (tables/images at the cost of serializer round-trip).
- **Naive regex markdown pipelines get rewritten eventually.** Lexical is replacing @lexical/markdown with a micromark/mdast rebuild (#8794); BlockNote replaced unified.js with a custom parser for round-trip stability (#2624). Budget for spec-grade parsing + preserve-unknown-nodes from day one.
- **Editor data-loss is unforgivable.** Typora — the feel gold standard — has a years-long 0-KB-file trail where "auto-save…overwrit[es] manually saved checkpoint versions while content loss was occurring" (#1213/#1474/#4415), concentrated in long image-heavy docs.
- **Performance envelope:** viewport-scoped decoration work; keystroke→paint as a hard SLO (Obsidian table-perf complaints 90957; iPad active-line slowness 69646).

### 3.2 Best failure stories

1. > "This is not WYSIWYG because when I make something bold, I see a bunch of asterisks around it."
   — OverType Show HN definitional pile-on; "false advertising" verdict. https://news.ycombinator.com/item?id=44932651
2. > "it also breaks the vim key bindings, appears to override the previously functional Advanced Tables plugin, and can't be deactivated?"
   — Obsidian 1.5 WYSIWYG-table counter-revolt; a WYSIWYG widget without a per-block source escape subtracts capability. https://forum.obsidian.md/t/add-toggle-for-plaintext-table-editing-source-mode-in-live-preview/73866
3. > "Backslashes in autolink URLs double on every round-trip → exponential growth"
   — Milkdown: pure round-tripping corrupts a document exponentially, rooted in the shared mdast serializer half the ecosystem uses. https://github.com/Milkdown/milkdown/issues/2349
4. > "Data loss bugs exacerbated by auto-save!"
   — Typora's multi-year truncated/zeroed-file trail: WYSIWYG render state must never be the write source of truth. https://github.com/typora/typora-issues/issues/1213

### 3.3 Prior art — do-not-repeat

| Attempt | Approach | Why insufficient |
|---|---|---|
| Typora | Single custom contenteditable engine; per-block render↔source at cursor; WYSIWYG tables/math; Cmd+/ source toggle; rich-paste→md | Closed, desktop-only; years of data-loss bugs (0-KB, autosave over good checkpoints); no vim/plugins; no sync/merge layer — https://typora.io/ |
| Obsidian Live Preview | CM6 decorations, syntax shown around cursor; 1.5 added rendered table/property widgets | Still not full WYSIWYG (41517 filed AFTER it shipped); widget-collapse viewport jumps (66219, 41107); scroll loss on toggle (74379); 1.5 tables broke vim/multi-cursor with no opt-out (73866) — https://obsidian.md/blog/live-preview-update/ |
| OverType | Transparent textarea over styled preview | Monospace mandatory, bold-width breakage, no images/heading sizes; verdict: syntax highlighting, not WYSIWYG — https://news.ycombinator.com/item?id=44932651 |
| Milkdown | ProseMirror + remark/mdast WYSIWYG framework | Exponential backslash doubling (#2349); nested-mark corruption (#2403); alt-text overwritten (#2339); list-start dropped (#2292) — every doc rewritten on every update — https://github.com/Milkdown/milkdown/issues/2349 |
| Tiptap / GitLab content editor | PM wrapper, "bidirectional markdown"; GitLab dual-mode | Blank-line erosion (#8007), HTML comments dropped (#7720), phone numbers → ordered lists (#7968), cell newlines lost (#7746), paste headings unconverted (#6713); no documented strategy for preserving unsupported syntax — https://docs.gitlab.com/development/fe_guide/content_editor/ |
| Lexical | Regex-transformer markdown module | Invalid export for overlapping formats (#4895), nested-list import breakage (#7938), unknown nodes unhandled (#7212); team rebuilding on micromark (#8794) — an admission — https://github.com/facebook/lexical/issues/8794 |
| BlockNote | Notion-style blocks on PM/Tiptap; custom parser for round-trip | Block model opinionated (empty paragraphs removed #986); markdown is exchange, not the document model — wrong for a git-truth vault — https://github.com/TypeCellOS/BlockNote/pull/2624 |
| Joplin dual-engine | CodeMirror source + TinyMCE rich text over the same note | Officially lossy (HTML lost, ref links converted, vim gone); per-note warnings; undo breaks on toggle (#15309) — https://joplinapp.org/help/apps/rich_text_editor/ |
| Bear / Panda | Native TextKit hybrid, syntax hides when not editing | Apple-only, closed, own ecosystem; confirms the visibility-toggle requirement rather than solving it — https://9to5mac.com/2026/06/19/bear-app-developers-announce-lettera-a-beautiful-markdown-editor-for-mac/ |
| HyperMD (CM5) | Original WYSIWYG-inside-CodeMirror hack | Unmaintained; its ceiling (tables/layout) is exactly what Marijn flagged — https://discuss.codemirror.net/t/implementing-wysiwyg-markdown-editor-in-codemirror/2403 |

### 3.4 Requirements spec

1. **[decision — editor]** ARCHITECTURE: CM6 stays the only engine for v2. Every ProseMirror-family serializer in production has open round-trip corruption; frontmatter's merge3/baseSha + git-diff model makes serializer rewrites of unedited lines a data-integrity bug. "WYSIWYG mode" = live mode + optional conceal setting + block widgets (tables/images/math) — the Obsidian pattern pushed to Typora polish. Second engine only ever behind req 16.
2. **[M — editor + CI]** R-FIDELITY (non-negotiable): open any vault file in any mode, save without edits → byte-identical file, zero git diff, zero Supabase write. CI golden corpus (escaped autolinks, HTML comments, reference links, tight/loose lists, custom list starts, YAML frontmatter, embedded HTML) round-trips byte-identical through every mode.
3. **[M — editor]** R-CURSOR-1: inline marks (`**`, `*`, `==`, `~~`, `` ` ``, `[[]]`, `[]()`) conceal via decorations, reveal when selection touches the span; reveal/conceal never moves any line except the active one; completes <16ms.
4. **[M — editor]** R-CURSOR-2: concealed marker runs are zero-width for horizontal motion (no invisible extra presses); Backspace after a concealed closing marker reveals the pair and deletes markers as a unit (Typora behavior); word/vim motions operate on visible text.
5. **[S — editor]** R-CURSOR-3: three visibility levels — source / live (default) / clean (markers never shown, shortcuts only) — because the community is permanently split (41517); plus Mod+/ whole-doc source toggle preserving scroll and exact cursor mapping (74379 class).
6. **[M — editor]** R-VIEWPORT: any widget expand/collapse anchors scroll so the cursor's viewport-relative Y is unchanged (66219); outline/search/link navigation scrolls to rendered position, not raw-source position (41107).
7. **[L — editor]** R-TABLES, BOTH halves: (1) rendered table widget — per-cell in-place editing, Tab/Shift-Tab across cells, Enter down, typing `|` never breaks layout, hover row/column add/delete/align; (2) per-block source escape — "edit source" flips ONLY that table to inline plaintext, preserving multi-cursor and vim inside it. Never a forced global mode switch; widget never non-optional (73866 backlash).
8. **[M — editor]** R-LISTS: Enter continues `-`/`1.` (renumbering)/`- [ ]`; Enter on empty item removes marker (second Enter = blank line); Tab/Shift-Tab indent/outdent item+children, zero cursor displacement (49369); rendered checkbox click toggles `[x]` without stealing focus (96385 class).
9. **[M — editor]** R-PASTE: (1) text/html → clean markdown (headings, lists, links, tables); (2) plain text that is markdown → verbatim, never double-escaped; (3) image paste/drag → upload via existing GitHub/Supabase path to a vault-relative assets folder, relative link inserted; (4) copy offers markdown-source AND rich-text flavors.
10. **[M — editor]** R-IMAGES: `![]()` renders inline (lazy, viewport-scoped), alt/size preserved; broken images render an editable placeholder; cursor adjacency reveals raw form.
11. **[M — editor]** R-PERF: keystroke→paint P95 <50ms on a 10k-line doc with 50 images + 20 tables; viewport-only decorations with incremental Lezer reparse; a 20×20 table edits without whole-widget rebuild per keystroke; no full-document re-render on any keystroke.
12. **[S — editor + merge3.ts]** R-SAFETY: no autosave path may write render-derived content — saves serialize from the CM6 text buffer only; baseSha/409 + merge3 guard on every mode's save path; a failed/partial parse can never persist an empty or truncated document (Typora 0-KB class); autosave never overwrites a manual checkpoint while the buffer is in an error state.
13. **[M — editor]** R-UNKNOWN-SYNTAX: any construct the renderer doesn't understand (unknown directives, raw HTML blocks, plugin syntax, malformed tables) falls back to plain styled source text in place — never dropped, escaped, or normalized (Lexical #7212, Joplin, Tiptap failure classes). Also applies to publish rendering.
14. **[M — editor]** R-INPUT-PARITY: Mod+B/I/K, Mod+1..6 and any toolbar produce markdown edits in all three visibility levels; typed syntax keeps working in clean level; IME/composition never fights the conceal system (test zh/ja/ko + Android GBoard — where live previews die).
15. **[S — publish/marketing]** R-HONEST-NAMING: market as "Live" / "Clean writing"; reserve "WYSIWYG" for a mode with no visible markers ever, or the OverType pile-on is the predictable outcome.
16. **[L — gate, future]** R-ROUNDTRIP GATE for any future second engine: (1) serialize-splice — only user-edited blocks re-serialize, untouched bytes pass through; (2) golden-corpus byte-identity CI; (3) per-note capability warning before opening unsupported constructs (Joplin's honest pattern); (4) parse∘serialize idempotence fuzz test (catches the exponential-backslash class).

### 3.5 Edge cases register

- Backslash escapes inside autolinks — exponential doubling per cycle (Milkdown #2349)
- Blank lines after headings/tables/HTML blocks — one lost per round-trip (Tiptap #8007)
- HTML comments `<!-- -->` dropped on parse (Tiptap #7720) — templates/metadata often live there
- Reference-style links silently converted to inline (Joplin documented)
- Tight vs loose lists; custom ordered-list starts ("3.") normalized away (BlockNote #2715, Milkdown #2292)
- Lines starting with phone numbers misparsed as ordered lists (Tiptap #7968)
- Nested/overlapping inline marks → literal asterisks / invalid markdown (Milkdown #2403, Lexical #4895, Tiptap #7376)
- Line breaks inside table cells lost (`<br>` vs newline) (Tiptap #7746, #8012)
- Task-list items with wrapped continuations rendered as code blocks or dropped (Tiptap #7909, #8016)
- Intentional empty paragraphs removed by block models (BlockNote #986)
- The YAML frontmatter block must never enter the body parse/emit pipeline
- Bold glyphs wider than regular break overlay/conceal alignment (OverType Firefox/Android)
- Tall-widget collapse teleporting the viewport (Obsidian 66219)
- Mobile checkbox toggle cursor jump (96385); iOS selection-drag jumps (107976)
- RTL text + live-preview decorations (Obsidian 29029)
- Vim + concealed markers: motions landing inside invisible syntax; widgets disabling multi-cursor/rect selection (73866)
- 3k+ word, 30+ image documents: save-path stress under slow IO (Typora 0-KB history)
- Undo history must survive live↔source↔clean toggles (Joplin #15309)
- Markdown TEXT paste vs HTML-that-looks-like-markdown: double-escaping vs non-parsing ambiguity (Tiptap #6713, BlockNote #2661)
- IME composition active at a concealed span boundary — composition events race decoration updates

### 3.6 Sources

https://news.ycombinator.com/item?id=44932651 · https://forum.obsidian.md/t/a-typora-like-editing-mode-edit-and-preview-at-the-same-time/1953 · https://forum.obsidian.md/t/fully-visual-editor-mode-wysiwyg-wyswyg/41517 · https://forum.obsidian.md/t/add-toggle-for-plaintext-table-editing-source-mode-in-live-preview/73866 · https://forum.obsidian.md/t/live-preview-support-editing-a-table-cell-by-cell/34110 · https://forum.obsidian.md/t/when-collapsing-equations-for-live-preview-leave-cursor-at-the-same-position-relative-to-the-screen/66219 · https://forum.obsidian.md/t/jumping-to-the-wrong-viewport-position-in-live-preview/41107 · https://obsidian.md/blog/live-preview-update/ · https://discuss.codemirror.net/t/implementing-wysiwyg-markdown-editor-in-codemirror/2403 · https://github.com/Milkdown/milkdown/issues/2349 · https://github.com/ueberdosis/tiptap/issues/8007 · https://github.com/ueberdosis/tiptap/issues/7720 · https://github.com/ueberdosis/tiptap/issues/7968 · https://github.com/facebook/lexical/issues/4895 · https://github.com/facebook/lexical/issues/7212 · https://github.com/facebook/lexical/issues/8794 · https://github.com/TypeCellOS/BlockNote/pull/2624 · https://github.com/TypeCellOS/BlockNote/issues/986 · https://joplinapp.org/help/apps/rich_text_editor/ · https://docs.gitlab.com/development/fe_guide/content_editor/ · https://docs.gitlab.com/user/rich_text_editor/ · https://news.ycombinator.com/item?id=29360720 · https://news.ycombinator.com/item?id=12646511 · https://github.com/typora/typora-issues/issues/1213 · https://github.com/typora/typora-issues/issues/4415 · https://github.com/typora/typora-issues/issues/1474 · https://typora.io/ · https://9to5mac.com/2026/06/19/bear-app-developers-announce-lettera-a-beautiful-markdown-editor-for-mac/ · https://tiptap.dev/blog/release-notes/introducing-bidirectional-markdown-support-in-tiptap · https://forum.obsidian.md/t/toggle-live-preview-source-mode-does-not-preserve-scroll/74379

---

## Drill 4 — Mobile / Offline / PWA

### 4.1 Failure mechanics

- **Safari ITP 7-day eviction:** no tap/click on the origin during 7 days of Safari use → ALL script-writable storage (IDB, localStorage, Cache API, SW registrations) deleted at once. Home-screen-installed apps have their own days-of-use counter (WebKit calls deleting their data "a serious bug") — the risky path is the un-installed Safari-tab user, exactly how most users first try frontmatter.
- **Eviction is all-or-nothing per origin,** LRU under storage pressure. `navigator.storage.persist()` is granted silently by heuristic (home-screen install is the main iOS signal) — the app must check the boolean and adapt; it cannot prompt.
- **Quota is NOT the bottleneck** for a 10k-note vault: iOS 17+ gives a Safari/home-screen origin ~60% of disk. BUT in-app WebViews (Slack/Gmail/Twitter link opens) get ~15% AND a partitioned storage container — "my vault vanished" that is actually a different browser context.
- **IndexedDB write durability is broken at scale on mobile:** Obsidian devs confirmed IDB transactions "are not actually flushed to disk when they are complete (even when using strict mode)" on Android WebView; user bisected to a ~9,845-note cliff; no flush API exists. Result: a 98k-file vault re-indexes ~40 min on EVERY cold start (forum 88470).
- **iOS process eviction:** standalone PWAs and Capacitor apps are killed seconds-to-minutes after backgrounding. Every foreground = potential full cold boot — multiplying any slow-boot/reindex problem.
- **No Background Sync / Periodic Background Sync on iOS at all.** Sync runs only foregrounded; offline edits queue until reopen. Architecture must assume foreground-flush.
- **No Web Share Target on iOS** (WebKit bug 194593 open since 2019). Share-INTO-vault needs a Shortcuts/URL-scheme fallback.
- **Install friction:** no beforeinstallprompt on Safari; manual Add-to-Home-Screen ritual. iOS 26 improves it (home-screen adds open as web apps by default); Web Push exists since 16.4 but subscriptions silently disappear.
- **Safari-tab vs installed-PWA storage are separate instances on iOS** — vault built in the tab appears empty post-install; must auto-detect and re-hydrate. [Widely documented; re-verify on iOS 26 hardware.]
- **Offline boot dies on auth redirects:** SilverBullet blanks offline when cached boot config is missing or an auth proxy 302s the fetch. Any boot path requiring OAuth/token refresh blank-screens on a plane unless the shell + last-auth state are cached and network auth is bypassable (issues 1554, 1687).
- **OS upgrades invalidate SW caches:** fresh iOS 26 installs got a permanently blank SilverBullet page. Empty/invalid cache must be a first-class boot path with recovery UI.
- **Cloud-file-sync as the offline layer loses data:** Obsidian+iCloud overwrites instead of merging; boots block minutes on "Waiting for iCloud."
- **Notion's offline ceiling even as a native app:** per-page manual opt-in, first 50 rows of the first view only, Wi-Fi-only mobile sync, database conflicts silently overwrite — a working requirements anti-spec.
- **OPFS is the fast path** (Safari/iOS 17+): ~2x faster inserts, up to 4x faster reads than IDB (RxDB); sync access handles only in a dedicated Worker; same quota/eviction domain.
- **localStorage: 5MiB cap** — flags only, never vault content; handle QuotaExceededError mid-write.

### 4.2 Best failure stories

1. > "Indexing vault content took ~40 mins. Nothing is stored to IndexedDB, files and metadata tables are empty"
   — Obsidian Android, 98k files: IDB silently never persists; battery drains faster than USB charges. https://forum.obsidian.md/t/unpractical-vault-load-time-for-large-vaults-on-mobile-indexeddb-transactions-are-not-flushed-to-disk/88470
2. > "Turn off data on your phone... Try to run Silverbullet, you get error: offline and app is unusable."
   — The closest existing product to frontmatter failing its own headline promise on iOS. https://github.com/silverbulletmd/silverbullet/issues/1687
3. > "GIVE UP ON ICLOUD. It is the worst piece of garbage you will ever encounter when it comes to sync."
   — Veteran Obsidian forum verdict on OS file-sync as the offline engine: duplicate, mangled, empty files. https://forum.obsidian.md/t/ios-app-extremely-slow-to-load/67031
4. > "Only the first 50 rows of the first view sync to your device. That's it."
   — Notion's shipped offline mode as anti-spec: caps that break the primary mobile use case. https://notionbackups.com/guides/notion-offline-mode

### 4.3 Prior art — do-not-repeat

| Attempt | Approach | Why insufficient |
|---|---|---|
| Notion offline (native, Aug 2025) | Per-page opt-in cached mirror; CRDT text merge; auto-download of recent pages (paid) | 50-row cap; Wi-Fi-only mobile sync; property conflicts silently overwrite; no browser offline; it's a cache not an offline-first store — corruption syncs INTO your copy — https://news.ycombinator.com/item?id=44954665 |
| Obsidian mobile (Capacitor) | Web core wrapped natively for real filesystem; index cache in WebView IDB | Even WITH native file access, IDB index silently fails past ~10k notes (dev-confirmed, no platform fix) → multi-minute boots, 40-min reindexes; iOS kills on background; iCloud loses data; 40k notes freeze an iPhone 14 Pro. A native wrapper alone doesn't fix it — incremental journaled indexing does — https://forum.obsidian.md/t/unpractical-vault-load-time-for-large-vaults-on-mobile-indexeddb-transactions-are-not-flushed-to-disk/88470 |
| SilverBullet (offline-first md wiki PWA) | SW + full space copy in IDB; sync-on-reconnect to self-hosted server | Offline boot fragile exactly where frontmatter is exposed: auth 302s + missing boot config → blank screens; iOS 26 broke fresh installs; sync-mode toggle users must remember; blind installed-PWA debugging — https://github.com/silverbulletmd/silverbullet/issues/1554 |
| Eidos / sqlite-wasm+OPFS clones | Browser-native personal data apps, everything in the origin | Validates OPFS perf, but origin storage is the WHOLE durability story — eviction = total loss; no hardened iOS path. GitHub-repo-as-truth is precisely the missing layer — https://github.com/mayneyao/eidos |
| PWA push/notification SaaS guides (MagicBell, OneSignal) | Industry mitigation patterns for iOS PWAs | Document rather than remove the ceilings: no background sync, no share target, no install prompt, vanishing push subscriptions — https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide |

### 4.4 Requirements spec

1. **[M — sw.js + auth]** OFFLINE BOOT IS AUTH-FREE: shell, editor, and vault index cold-start from cache with zero network and zero token refresh. Expired GitHub/Supabase token degrades to local read-write with a "will re-auth on reconnect" banner — never a 302-poisoned blank screen. Accept: airplane-mode cold start after 14 days idle renders the vault list <3s on a mid-range phone.
2. **[M — sw.js + merge3.ts]** EVICTION IS SURVIVABLE: GitHub repo is the durable source of truth; on boot with empty/corrupt origin storage, auto-detect and re-hydrate (shallow tree fetch) with progress UI. Accept: manually wiping site data and relaunching yields a working vault with no user action; loss bounded to the outbox, never the vault.
3. **[S — sw.js + editor]** STORAGE HEALTH UI: call `storage.persist()` at vault init; surface `persisted()` + `estimate()` in a vault-health panel. If persisted=false AND running in a Safari tab, show eviction warning + Add-to-Home-Screen walkthrough (note iOS 26 default). Detect in-app WebView (15% quota, partitioned) and steer to Safari.
4. **[M — sw.js]** Vault files in OPFS (dedicated worker, sync access handles; 2–4x faster per RxDB), search/link index in IDB, flags only in localStorage (5MiB cap).
5. **[L — sw.js + new:indexer]** INDEXING NEVER RESTARTS FROM ZERO (the Obsidian lesson): incremental index persistence with a write-ahead journal + per-file content-hash validity markers — an unflushed IDB transaction costs a delta replay, not a rebuild. Accept: 10k-note cold boot to editable <3s; force-kill mid-index → next boot resumes; tested at 10k and 50k notes on Android WebView (the ~9,845-note durability cliff is real, dev-confirmed).
6. **[M — sw.js + merge3.ts]** SYNC IS FOREGROUND-FLUSH: no Background Sync dependency (absent on iOS). Durable outbox journal; flush on visibilitychange/foreground, `online` events, manual pull-to-sync. Per-note pending/synced state + always-visible unsynced count ("plane badge"). Accept: edit 20 notes offline, force-kill, reconnect, reopen — all 20 reach GitHub via merge3/baseSha, zero loss.
7. **[M — merge3.ts]** CONFLICTS NEVER SILENTLY OVERWRITE (anti-Notion): body conflicts via merge3 + 409; frontmatter keys field-level merged with explicit diff UI when both sides changed the same key; last resort a conflict copy with a visible banner.
8. **[M — sw.js]** ATTACHMENTS PINNABLE, not all-or-nothing: hydrate all note text + attachment metadata by default; lazy-fetch blobs; per-folder/per-file "available offline" pinning with size readouts. Cellular sync on by default with a size-aware deferral toggle (contra Notion's Wi-Fi-only).
9. **[M — new:capture-endpoint + auth]** CAPTURE WITHOUT SHARE TARGET on iOS: inbox-append URL scheme/universal link + documented iOS Shortcut (share sheet → Shortcut → authenticated endpoint); manifest `share_target` on Android. Do not promise iOS share-sheet presence (WebKit 194593).
10. **[S — sw.js]** PUSH OPTIONAL AND SELF-HEALING: installed-PWA-only on iOS (16.4+); on every launch re-check `pushManager.getSubscription()` and silently re-subscribe. Nothing critical (sync, conflicts) depends on push.
11. **[S — sw.js]** INSTALLED-PWA OBSERVABILITY: opt-in client-log ring buffer uploadable to the server (SilverBullet retrofitted exactly this). Log estimate(), persisted(), IDB open failures, detected evictions.
12. **[L — CI]** AIRPLANE CI GATE on real devices: (Safari tab, installed PWA, Android Chrome) × (fresh install, post-OS-upgrade, 7-days-idle) × (online, offline cold start), asserting: no blank screen ever, edits durable across force-kill, storage-empty boot recovers.
13. **[decision]** HONEST NATIVE-WRAPPER LINE: PWA ceiling is acceptable for the core (foreground editor + foreground sync + GitHub durability). A Capacitor iOS wrapper ships only when a requirement crosses: background sync while closed, iOS share-sheet target, Files-app integration, non-evictable multi-GB attachment stores, App Store distribution. The wrapper does NOT fix WebView IDB durability (Obsidian is Capacitor and hit it) — req 5 stands regardless.

### 4.5 Edge cases register

- Vault built in a Safari tab, then installed to Home Screen → separate storage container, vault appears empty; auto-detect, re-hydrate, warn about unsynced tab-side edits [re-verify on iOS 26 hardware]
- Link opened inside Slack/Gmail/Instagram WebView: 15% quota, partitioned storage, no install — detect and steer to Safari
- iOS major upgrade (18→26) invalidates SW caches — missing/invalid cache is a normal boot path with recovery UI
- Storage-pressure LRU eviction WHILE offline: re-hydration impossible until reconnect and the outbox dies with the origin — persisted-mode + export escape hatch + explicit "unsynced work at risk" indicator
- Force-kill (or iOS auto-kill) mid-index or mid-outbox-flush: journal makes both resumable
- QuotaExceededError mid-write (huge attachment, full phone): atomic-or-aborted, never a half-written index; storage-full prompt with pin-eviction suggestions
- Private/incognito: ephemeral/blocked IDB — detect, run memory-only with a warning
- Push subscription silently vanishing between launches — re-check every launch
- 7-day ITP eviction of the passive Safari-tab reader (dwell without interaction may not count)
- Pre-iOS-17 devices: ~1GiB quota then permission prompt — graceful handling or an iOS version floor
- Multiple desktop tabs on one vault: OPFS sync handles are exclusive-lock per file — Web Locks / leader election so tab #2 doesn't deadlock the vault worker

### 4.6 Sources

https://webkit.org/blog/14403/updates-to-storage-policy/ · https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ · https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria · https://forum.obsidian.md/t/unpractical-vault-load-time-for-large-vaults-on-mobile-indexeddb-transactions-are-not-flushed-to-disk/88470 · https://forum.obsidian.md/t/performance-issues-on-iphone-14-pro-with-large-vault-40-000-notes-using-obsidian-sync/98759 · https://forum.obsidian.md/t/ios-app-extremely-slow-to-load/67031 · https://forum.obsidian.md/t/constant-data-loss-between-mobile-and-desktop/66663 · https://news.ycombinator.com/item?id=44954665 · https://notionbackups.com/guides/notion-offline-mode · https://www.xda-developers.com/notion-offline-mode-launched/ · https://github.com/silverbulletmd/silverbullet/issues/1554 · https://github.com/silverbulletmd/silverbullet/issues/1687 · https://github.com/silverbulletmd/silverbullet/issues/1676 · https://rxdb.info/rx-storage-opfs.html · https://caniuse.com/background-sync · https://developer.apple.com/forums/thread/694805 · https://bugs.webkit.org/show_bug.cgi?id=194593 · https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide · https://www.idownloadblog.com/2025/06/17/apple-ios-26-safari-web-apps-home-screen-bookmarks/ · https://www.macrumors.com/how-to/save-safari-bookmark-web-app-iphone-home-screen/ · https://github.com/mayneyao/eidos · https://www.noteapps.ca/silverbullet/ · https://lwn.net/Articles/1030941/ · https://webscraft.org/blog/pwa-pushspovischennya-na-ios-u-2026-scho-realno-pratsyuye?lang=en

---

## Drill 5 — Capture, Retrieval & AI

### 5.1 Failure mechanics

- **Capture dies above ~1s / one decision.** Keep's widget reaches typing in ~0.5s vs Notion's 3.1s; users route around slower apps (capture into Keep, re-file into Obsidian days later). Any destination/folder/template/tag prompt AT capture time gets skipped.
- **DIY mobile pipelines break silently at the seams:** iOS Shortcuts + Templater + Advanced URI fail when the daily note doesn't exist yet (t/112619, t/115637), when the vault name says "iCloud", on the vault root folder. The 195-like share-sheet FR existed because every workaround was this fragile.
- **Capture without triage produces an unmanageable pile:** users run monthly "ruthless delete" rituals; the surviving pattern is capture-fast → review-inbox-like-email, not capture → auto-organize.
- **Web clipper failure modes are specific and repeated:** images saved as remote URLs that 404 later (#1 issue, +32); per-site extraction breakage (YouTube #905, CJK #893); silent regressions (empty note after 1.7.0, #895); no already-clipped signal (#112, +13).
- **AI resurfacing is praised ONLY when anchored to working context and verifiable moments** (Rewind's meeting recall; Mem's related-notes while writing); gimmick verdict when it's a global feed ("pattern-matching on superficial keyword proximity"). Readwise proves deterministic spaced-repetition resurfacing retains users for years without AI.
- **RAG-over-notes trust collapses on the first confidently-wrong answer about the user's OWN notes** (Notion AI Q&A); stale-index answers after doc edits. MindForger's author abandoned local-LLM RAG over notes entirely.
- **Vault-wide cloud embedding causes bill shock** — one day of Smart Connections use multiplied a monthly OpenAI bill; the plugin later moved to local embeddings. Cost must be visible BEFORE bulk runs, or local by default.
- **Cloud-AI dependency is a hard privacy dealbreaker** for a large cohort (Rewind's GPT-4 dependency poisoned its "private by design" pitch).
- **BYO-key + custom OpenAI-compatible base URL is the single most-demanded AI config** across every tracker examined (SC #302/+18, #559/+20, #104; khoj #407) — users hand-edited minified source to swap endpoints. Keys must be encrypted at rest (SC #1347); connection-test before save (khoj #1361).
- **MCP is the new demand vector:** users want the vault exposed to agents they already run, not a chat inside the notes app (khoj #1023, #1364; HN users' whole stack = markdown folder + Claude Code).
- **Vendor/plugin abandonment anxiety governs adoption** (Reflect "burned too many times"; Mem 1.0 collapse; Smart Connections presumed abandoned mid-cycle). Plain-markdown-in-user-owned-repo is the antidote — frontmatter's architecture.
- **AI auto-filing is actively rejected by the review-discipline cohort** — triage is the thinking step. Suggestions at review time OK; autonomous vault reorganization is not; AI text never lands inside notes uninvited (Smart Connections' praised design choice).

### 5.2 Best failure stories

1. > "my bill was already up by multiples than it usually is... I'm scared of running the plugin"
   — Smart Connections cloud-embedding bill shock → uninstall out of fear. https://forum.obsidian.md/t/introducing-smart-chat-a-game-changer-for-your-obsidian-notes-smart-connections-plugin/56391
2. > "For the love of god don't have an AI review your thoughts."
   — Johnny.Decimal author: manual review IS the value-extraction step; auto-organizing removes the judgment moment. https://forum.obsidian.md/t/how-do-you-capture-thoughts-before-they-disappear/115660
3. > "after being burned too many times I am (incredibly) reluctant to tie my second brain to a box"
   — Reflect launch: lock-in trauma bounces the ideal customer off the landing page. https://news.ycombinator.com/item?id=35303670
4. > "There is no privacy until they eliminate the GPT-4 dependency."
   — Rewind: local-storage marketing undone by cloud inference; the thread's dominant takeaway. https://news.ycombinator.com/item?id=36877000

### 5.3 Prior art — do-not-repeat

| Attempt | Approach | Why insufficient |
|---|---|---|
| Heynote | Single persistent scratch buffer, instant desktop capture, plain buffer.txt | Desktop-only; no mobile/share-sheet/vault sync; capture surface with no retrieval layer — https://news.ycombinator.com/item?id=38733968 |
| Google Keep | Sub-second widget capture, voice, OCR, zero decisions | Silo dead-end: no markdown, no export, no linking — wins capture, loses everything downstream — https://www.androidpolice.com/why-still-use-google-keep-along-with-favorite-note-taking-tool/ |
| Strflow | Chat-with-yourself timestamped append timeline; scheduled notes resurface | Apple-only, proprietary store, no web/AI — but the append-stream + gentle-resurfacing model is the capture UX to copy — https://strflow.app/ |
| Obsidian mobile + QuickAdd/Shortcuts | DIY lock-screen shortcuts + Templater macros | Every seam breaks (daily-note-missing, iCloud names, root-folder bugs, plugin updates); 195-like FR proves demand outstripped DIY for years — https://forum.obsidian.md/t/feature-ios-share-sheet-extension/14873 |
| Evernote clipper + email-in (legacy benchmark) | Multi-mode clipping, tag-at-clip, OCR, per-account email address | Proprietary, restricted free tier, bloated — but the capture bar it set is unmatched by anything markdown-native — https://web2md.org/blog/web-clipper-tools-compared |
| Obsidian Web Clipper | Official extension, md-native, templates, highlights | Remote-URL images (+32), no duplicate signal (+13), per-site breakage, empty-note regression — capture reliability untrusted — https://github.com/obsidianmd/obsidian-clipper/issues/37 |
| Mem 1.0→2.0 | AI-native, no folders, auto-connections, SMS capture | 1.0 collapsed on reliability; 2.0 dropped features in migration; resurfacing oscillates insight↔keyword-proximity; weak offline — https://www.saner.ai/blogs/mem-ai-reviews |
| Reflect | Polished E2EE daily notes + GPT assistant | Closed subscription → lock-in refusal; E2EE excludes files/images; Apple Notes still beats it on create-and-find speed — https://news.ycombinator.com/item?id=35303670 |
| Rewind.ai | Passive total capture + AI recall | Privacy story broke on GPT-4; metered pricing disliked — but its meeting-recall praise defines valuable resurfacing: grounded, moment-anchored, citable — https://news.ycombinator.com/item?id=36877000 |
| Khoj | Self-hosted semantic search + chat over markdown | Docker/WSL2 pain, RAM-hungry, abandonment doubt, no index-coverage visibility, no endpoint health check, MCP unmet — ops burden exceeds what note-takers accept — https://github.com/khoj-ai/khoj/issues/1023 |
| Smart Connections | Local transformers.js embeddings, related-notes panel scoped to open note | Bill-shock history, abandonment scare, no mobile, plaintext keys (#1347) — but the scoped related-notes panel is the most-loved AI retrieval pattern found — https://github.com/brianpetro/obsidian-smart-connections/issues/302 |
| Notion AI Q&A | Workspace-wide RAG chat | Confidently-wrong answers + stale-doc drift; "first draft requiring verification" verdict — the trust-collapse case study — https://workflowautomation.net/reviews/notion-ai |
| Readwise Daily Review | Deterministic decay-based spaced-repetition resurfacing | Only imported highlights, not authored notes — but the strongest evidence that scheduled, explainable, non-LLM resurfacing retains users for years and should ship first — https://docs.readwise.io/readwise/docs/faqs/reviewing-highlights |

### 5.4 Requirements spec

1. **[M — new:capture surface + sw.js]** C1 Sub-second zero-decision capture: dedicated /capture PWA surface (installable) reaching a focused input <1s warm / <2s cold, NO destination/template/tag prompt. Accept: median time-to-first-keystroke <1s on mid-range Android.
2. **[M — new:capture + merge3.ts]** C2 Append-stream inbox: captures append as timestamped blocks to a single inbox stream (daily note or inbox.md), auto-creating the file if absent (the #1 DIY failure). Accept: 100 consecutive captures, zero file-not-found or ordering errors.
3. **[M — sw.js + merge3.ts]** C3 Offline-first async commit: capture writes to a local queue instantly, commits in background via merge3/baseSha; append-append conflicts on the inbox file resolve by timestamp-ordered concatenation, never a surfaced 409. Accept: airplane capture → reconnect → both devices' captures present.
4. **[M — sw.js + auth + new:capture-endpoint]** C4 Web Share Target (Android manifest) + iOS Shortcut fallback (POST to authenticated endpoint). Shared images committed INTO the repo (assets/) — never remote hotlinks (+32 clipper issue). Accept: Chrome-Android share and iOS Shortcut both land well-formed inbox blocks with in-repo images.
5. **[M — new:edge function + auth]** C5 Email-to-note: unique per-user address appending subject+body as an inbox block with source metadata; rotatable, rate-limited, HTML sanitized.
6. **[L — new:clipper]** C6 Clipper v1 hard requirements (from obsidian-clipper's ranked backlog): clean extraction with fall-back-to-selection; images downloaded into the repo; frontmatter records source URL/date/author/title; duplicate-URL warning (+13); a clip NEVER silently produces an empty note (regression #895 class).
7. **[M — new:triage view + editor]** C7 Triage view: unprocessed inbox blocks with single-keystroke archive / move-to-note / merge / delete. AI may SUGGEST destination + tags as accept/reject chips — auto-filing without confirmation is forbidden. Accept: 20 captures processed <2 min keyboard-only.
8. **[M — new:ai]** R1 Citation-or-silence: every AI answer cites exact source notes with deep links (file + block anchor); below-threshold retrieval → "not found in your notes," never generation. Accept: 0 uncited factual claims.
9. **[L — new:ai]** R2 Local-first embeddings with cost visibility: default index computed client-side (transformers.js/WebGPU) or against a user endpoint; any cloud bulk-embed shows estimated tokens+cost and requires confirmation. Embeddings versioned by model id; model change → incremental re-embed.
10. **[M — new:ai + auth]** R3 BYO key + custom base URL as table stakes: {base_url, api_key, model} supporting OpenAI, Anthropic, OpenRouter, Ollama, LM Studio; keys encrypted at rest (SC #1347); test-connection before save (khoj #1361); mid-chat endpoint failure surfaces a clear state, not a hang (khoj #1362).
11. **[M — new:ai + editor]** R4 Related-notes panel scoped to the open note (the loved pattern), local embeddings, per-suggestion useful/not-useful feedback. NO global AI serendipity feed in v1 (where Mem's gimmick verdicts concentrate).
12. **[M — new:digest]** R5 Deterministic scheduled resurfacing BEFORE AI resurfacing: daily digest of N inbox-aged / long-untouched notes by explainable age/decay rules ("shown because: created 90d ago, never linked") — Readwise's retained-for-years pattern. LLM ranking only as a later layer.
13. **[M — new:mcp-server + auth]** R6 MCP server: vault search/read (read-only default, token-scoped) so existing agents (Claude Code, Cursor, Claude Desktop) consume the vault — the demand Khoj left unmet. Accept: Claude Code answers a vault question via MCP with zero custom glue.
14. **[S — new:ai]** R7 AI output containment: AI text renders in chat/panel surfaces and enters notes only via explicit user action; AI never mutates vault files autonomously.
15. **[S — new:ai]** R8 Index health visibility: per-file coverage + last-indexed time (khoj #1363); results flag when a cited note changed after indexing (the Notion stale-answer guard).

### 5.5 Edge cases register

- Two devices append to the same inbox note while one is offline — merge3 special-cases append-append as timestamp-ordered concatenation, never a 409 UI
- iOS PWA cannot register as a Web Share Target — Shortcut→API fallback or the feature silently doesn't exist for half of mobile
- Daily/inbox file missing at capture time — auto-create (the exact community-shortcut breakage)
- Paywalled/JS-rendered clip → detect low-content extraction, fall back to selection, never save an empty note
- Same URL clipped twice — dedupe prompt linking the existing note
- Large clipped/shared images bloat a GitHub repo — size cap, compression, documented LFS/asset strategy
- Embedding model/provider switch invalidates the vector index — version by model id, incremental re-embed
- CJK content breaks whitespace token counters (khoj #1354) — use a real tokenizer
- RAG citing a note edited after indexing — show changed-since-indexed state
- Secret/credential pasted into quick capture — token-shaped-string warning before commit (vault is a GitHub repo)
- "OpenAI-compatible" endpoints that deviate (DeepSeek response_format, bare /v1 paths) — per-provider quirks table + conformance test on save
- Email-in address leaked/spammed — rotatable, rate-limited, sanitized
- 10k+ notes on a mid-range phone — lazy chunked client-side embedding, defer to charger/Wi-Fi, show partial-index coverage (R8)
- Triage AI suggestion targets a note another device just deleted/renamed — re-validate at apply time against baseSha

### 5.6 Sources

https://news.ycombinator.com/item?id=38733968 · https://news.ycombinator.com/item?id=36933452 · https://news.ycombinator.com/item?id=35303670 · https://news.ycombinator.com/item?id=36877000 · https://news.ycombinator.com/item?id=45458904 · https://news.ycombinator.com/item?id=39372159 · https://forum.obsidian.md/t/how-do-you-capture-thoughts-before-they-disappear/115660 · https://forum.obsidian.md/t/feature-ios-share-sheet-extension/14873 · https://forum.obsidian.md/t/quick-capture-mac-ios-and-inbox-processing/21808 · https://forum.obsidian.md/t/introducing-smart-chat-a-game-changer-for-your-obsidian-notes-smart-connections-plugin/56391 · https://github.com/obsidianmd/obsidian-clipper/issues/37 · https://github.com/brianpetro/obsidian-smart-connections/issues/302 · https://github.com/khoj-ai/khoj/issues/1023 · https://www.saner.ai/blogs/mem-ai-reviews · https://www.fahimai.com/mem-ai (promotional, LOW trust — pattern-shape only) · https://get.mem.ai/blog/mem-2-dot-0-transition-guide · https://strflow.app/ · https://www.androidpolice.com/why-still-use-google-keep-along-with-favorite-note-taking-tool/ · https://www.atlasworkspace.ai/blog/google-keep-alternatives (capture-speed numbers: unverified single-outlet measurement, directionally corroborated) · https://web2md.org/blog/web-clipper-tools-compared · https://docs.readwise.io/readwise/docs/faqs/reviewing-highlights · https://blog.readwise.io/adding-intention-to-spaced-repetition/ · https://workflowautomation.net/reviews/notion-ai · https://super.work/blog/super-vs-notion-ai · https://smartconnections.app/smart-connections/

---

## Drill 6 — Onboarding & Trust (GitHub auth)

### 6.1 Failure mechanics

- **OAuth-app `repo` scope = all-repos access.** The consent screen literally says full access to all public AND private repositories; users abandon at that exact screen. Decap hardcodes `scope=repo` (#1423); Pages CMS wrote a front-page FAQ apologizing for it.
- **GitHub App consent shows "Act on your behalf" even with ZERO permissions** — the documented #1 reason users stop at the first screen (community #37117: 204 upvotes; Cirrus CI #751: 49 reactions). Staff acknowledged the wording in 2022; still shown.
- **Org-owned repos hard-block OAuth flows:** with third-party restriction on, an OAuth app needs org-wide approval — dead end or refusal (Decap #4329, open since 2020).
- **Fine-grained-PAT fallback leaks non-developers:** a ready-to-convert user bounced solely because "Fine-Grained PATs" meant nothing to them. obsidian-git's PAT setup spawned a 311,992-view tutorial plus token-confusion issues.
- **Git plumbing errors at the LAST onboarding step are refund events:** GitJournal iOS threw `MissingPluginException` during gitClone right after a good OAuth flow → immediate refund request; "Setup Git Host stuck on cloning" issues abound.
- **Empty-repo edge kills connect flows:** cloning before an initial commit exists fails with an opaque error (GitJournal #298).
- **Repo-picker blindness after single-repo App install:** repo not included at install → empty list that looks broken (Tina docs and Vercel KB both carry dedicated rescue copy).
- **Over-grant panic:** users who clicked "All repositories" later read normal bot commits as a security breach (community #193208 — resolved as self-misconfiguration, damage done publicly).
- **Exposed merge-conflict UX blocks non-git users entirely;** GitJournal's survival tactic: NEVER surface a conflict — auto-resolve local-wins, "no data is lost since the history is there in Git."
- **Git vocabulary itself is a filter** ("I personally wouldn't put easy and git in one sentence"); Working Copy keeps clone/commit/push wording and self-selects developers only.
- **Time-to-first-value for note tools is minutes:** onboarding tours >5 steps lose >50% completion; a git-credential detour in the first session blows the budget.

### 6.2 Best failure stories

1. > "There is no way I could grant anything access to all my repos. Moving on..."
   — Decap evaluation abandoned at the consent screen; issue open since 2020. https://github.com/decaporg/decap-cms/issues/4329
2. > "I hadn't heard of \"Fine-Grained PATs\" before so I just ignored it."
   — Pages CMS Show HN: the ideal customer bounced by the PAT fallback. https://news.ycombinator.com/item?id=39467132
3. > "the prompt below is too scary to agree to"
   — GitHub App with read-only email+metadata: users refuse install over "act on your behalf" (204 upvotes). https://github.com/orgs/community/discussions/37117
4. > "It failed with the error - MissingPluginException ... I've requested a refund."
   — GitJournal iOS: OAuth succeeded, gitClone crashed at the finish line — an eager user became a refund. https://news.ycombinator.com/item?id=31914003

### 6.3 Prior art — do-not-repeat

| Attempt | Approach | Why insufficient |
|---|---|---|
| Decap CMS GitHub backend | OAuth App, hardcoded `scope=repo`, external OAuth server | All-repos + org-wide demands drive refusals (#1423, #4329); a community GitHub-App single-repo proxy proved the fix but core never shipped it — https://github.com/decaporg/decap-cms/issues/4329 |
| Pages CMS | OAuth App + honest FAQ + PAT alternative + best invisibility copy ("all changes are still tracked like regular commits") | The apology doesn't stop consent-screen drop-off (bounce documented in its own Show HN); PATs invisible to non-devs; later migrated to a GitHub App — proving the OAuth start was a mistake — https://news.ycombinator.com/item?id=39467132 |
| TinaCMS / TinaCloud | GitHub App, per-repo selection, arm's-length git wording | Repo-not-in-list confusion needs dedicated support copy; Tina Cloud + in-repo config gates setup to developers; no create-repo-for-me — https://tina.io/docs/tinacloud/dashboard/projects |
| Working Copy | Full git vocabulary as features | Deliberately not for non-git users — the terminal of the space, not the funnel; proves the vocabulary ceiling — https://workingcopy.app/ |
| GitJournal | Hides git: auto commit+push per change, pull-to-refresh, never surfaces a conflict | Fragile last-step plumbing (clone exceptions, empty-repo failures, iOS auth bugs) burned users at minute one; no LFS; single-dev — https://github.com/GitJournal/GitJournal |
| obsidian-git | DIY PATs inside Obsidian | PAT creation/storage IS the failure mode (Android token fields not saved #1029, update confusion #760); needed a 312k-view tutorial; the anti-pattern for a mainstream funnel — https://forum.obsidian.md/t/the-easiest-way-to-setup-obsidian-git-to-backup-notes/51429 |
| Stackbit / Netlify Create | Repo created under a Stackbit-managed account (zero-permission onboarding), optional later transfer | Data doesn't start in the user's account — "your data is yours" becomes a deferred migration; product sunset. Right pattern, wrong ownership order — https://docs.stackbit.com/guides/transfer-repo |
| Vercel / Retool git integrations | GitHub App, "Only select repositories" recommended; admin-configured connections | Over-grant is one click away and produces breach-panic posts (#193208); Retool's enterprise model doesn't solve consumer first-session onboarding — https://github.com/orgs/community/discussions/193208 |

### 6.4 Requirements spec

1. **[M — auth]** GitHub App only (never OAuth App): Contents:Read/Write + Metadata:Read; install lands on repo-selection with "Only select repositories" and exactly one repo pre-suggested. Accept: consent screen never shows all-repositories or admin/org scopes; post-install Settings shows access == 1 repo.
2. **[S — auth]** Consent pre-brief interstitial: list in plain words what GitHub will ask; pre-translate the scary strings — "GitHub will say frontmatter can act on your behalf; that phrase is GitHub boilerplate; concretely we can only read and write the ONE notes repo you choose." Accept: both risky strings explained before the user sees them; GitHub-screen drop-off instrumented as its own funnel step.
3. **[M — auth]** Default path = create-repo-for-me: primary CTA creates a private `<username>/notes` in the USER'S account, seeded with an initial commit (README + Welcome note) so empty-repo clone failures are impossible (GitJournal #298); connect-existing is secondary with a single-repo picker. Accept: repo lives under the user's account from commit #1 (anti-Stackbit).
4. **[M — auth + editor]** Time-to-first-note ≤90s: landing → auth → repo created → editor open on an editable Welcome note, ≤4 decisions. Activation event = first keystroke saved; P50 <90s measured.
5. **[M — editor + publish]** Git-invisible vocabulary layer: "Saved to your GitHub" (not committed), "History" (not commits), "Up to date / Syncing" (not push/pull), "Someone edited this elsewhere — both versions kept" (not merge conflict). "Power mode" toggle reveals real git nouns + SHAs. Keep the honesty line visible: "every save is a normal commit in your repo, under your name." Accept: zero clone/commit/push/merge/branch in default first-session UI.
6. **[M — merge3.ts]** Never surface a blocking conflict in the first-run path: merge3 + baseSha resolves silently where safe; on true conflict, default local-wins **with the losing version preserved in history/journal** and a non-modal notice (GitJournal's validated pattern, made safe by Drill 1 req 11). Accept: no first-90-days user sees a screen requiring hunk choices.
7. **[S — auth]** Repo-picker empty-state rescue: "Don't see your repo? Update what frontmatter can access on GitHub" deep-linking the App configure page. Never a bare empty list.
8. **[S — auth]** Over-grant detection: post-install API check of grant breadth; if "All repositories," one-time prompt to narrow with a deep link (prevents Vercel-#193208 panic).
9. **[S — auth]** No PATs in the primary funnel: PAT entry only on an Advanced/self-host page with a copy-pasteable fine-grained recipe (single repo, Contents RW, 90-day expiry). Accept: the word "token" does not appear in default signup.
10. **[M — publish/marketing]** Trust page, every claim mechanically true: (1) "Your notes are plain Markdown files in a GitHub repo you own. We can't read your other repos."; (2) file-over-app durability framing; (3) exit ramp: "Leave anytime — delete frontmatter and your repo still works in Obsidian, VS Code, or any editor"; (4) honest architecture disclosure (what Supabase caches, repo is truth, what deletion removes); (5) an annotated screenshot of the actual GitHub permission screen.
11. **[S — auth]** Org-repo graceful degradation: detect install restriction → "ask your admin" state with prefilled request link (Decap #4329's six-year dead end). Never an unexplained error.
12. **[S — auth]** Permission audit surface in-app: the single accessible repo, last sync time, one-click GitHub configure/revoke links.

### 6.5 Edge cases register

- "All repositories" selected at install (over-grant) — detect and narrow, don't silently accept
- Existing repo empty (no initial commit) — seed a commit before first sync (GitJournal #298)
- Org with third-party/App restrictions — pending-admin-request waiting state
- App revoked/uninstalled mid-session — calm re-auth prompt, not a data-loss scare
- Connect-existing repo already containing an Obsidian vault (.obsidian/, thousands of files) — skip config dirs, survive large trees
- Binary/large files — LFS effectively unavailable in browser git stacks; size caps or Supabase-side media
- GitHub API rate limits under autosave — batch commits, never per-keystroke
- Two devices editing the same note pre-sync — merge3 local-wins with both versions retained, never a blocking UI
- User has no GitHub account — the funnel's biggest cliff; defer GitHub to after first local note (value-before-auth) or guided account-creation branch
- App suspended, or granted repo later deleted from selection — rescue link covers it
- Advanced-path fine-grained PAT expires silently — sync failures name the expiry cause and link the recipe

### 6.6 Sources

https://github.com/decaporg/decap-cms/issues/1423 · https://github.com/decaporg/decap-cms/issues/4329 · https://github.com/orgs/community/discussions/37117 · https://github.com/cirruslabs/cirrus-ci-docs/issues/751 · https://news.ycombinator.com/item?id=39467132 · https://news.ycombinator.com/item?id=31914003 · https://stephango.com/file-over-app · https://news.ycombinator.com/item?id=36566323 · https://obsidian.md/ · https://workingcopy.app/ · https://decapcms.org/docs/github-backend/ · https://tina.io/docs/tinacloud/dashboard/projects · https://docs.retool.com/source-control · https://forum.obsidian.md/t/the-easiest-way-to-setup-obsidian-git-to-backup-notes/51429 · https://github.com/Vinzent03/obsidian-git (token issues #1029, #760, #649, #646) · https://github.com/GitJournal/GitJournal (setup issues #974, #646, #484, #298, #1017) · https://docs.stackbit.com/guides/transfer-repo · https://github.com/orgs/community/discussions/193208 · https://vercel.com/kb/guide/unable-to-find-github-repository · https://www.appcues.com/blog/user-onboarding-metrics-and-kpis · https://www.digitalapplied.com/blog/customer-onboarding-time-to-value-2026-saas-metrics-framework · https://github.com/PalmEmanuel/decap-github-proxy

---

## Cross-Drill Contradictions & Tensions — with Recommended Resolutions

### T1 — CRDT/realtime collab vs clean git diffs and merge3 integrity
Drill 2 needs live multiplayer; Drill 1 forbids anything that diverges live state from the file (Relay #22's entire failure class), and per-keystroke ops don't map to commits (HedgeDoc #222).
**Resolution:** No peer CRDT. Server-authoritative sequencing (Weidner-style insert-after-ID rebasing) over the existing merge3 + baseSha engine, with session-batched commits (idle-timeout / explicit-save / pre-pull) carrying `Co-authored-by` trailers. The file remains the document; the live layer is ephemeral and deletable. External writes and offline peers reconcile through merge3 — one merge pipeline for keystrokes, git pushes, and AI agents.

### T2 — WYSIWYG ambition vs round-trip fidelity
Drill 3's demand signal (1,130-like Typora thread) pulls toward a ProseMirror-style engine; but every production PM-family serializer has open corruption bugs, and under frontmatter's baseSha/git model a serializer rewrite of unedited lines is a *sync-integrity* bug (poisons Drill 1's 3-way merge and Drill 2's anchors).
**Resolution:** Single CM6 engine; "clean" visibility level + block widgets = the WYSIWYG offer. R-FIDELITY (byte-identical no-edit round-trip) is a permanent CI gate; any future second engine must pass serialize-splice + golden corpus + idempotence fuzz (R-ROUNDTRIP). Never market it as WYSIWYG until markers are truly never visible.

### T3 — PWA offline-first vs iOS eviction and process-kill
Drill 4 shows origin storage can vanish wholesale (ITP 7-day, LRU, OS upgrades) and the app is killed on backgrounding — while Drills 1 and 5 promise "never lose data" and instant capture.
**Resolution:** Accept eviction as normal, make it survivable: GitHub repo is the durability layer, origin storage is a rebuildable cache (auto-rehydrate on empty boot), and unsynced-loss is bounded to a durable, aggressively-flushed outbox (foreground-flush on visibilitychange, persist() + install steering, "unsynced work at risk" indicator). The one non-negotiable: never depend on background execution on iOS.

### T4 — Git-invisible onboarding ("never show a conflict") vs sync-integrity ("never silently auto-resolve")
Drill 6 validates GitJournal's never-surface-a-conflict UX; Drill 1's worst catastrophes came from exactly that policy (silent local-wins, #241, #558).
**Resolution:** Split by overlap, not by audience. Non-overlapping hunks auto-merge silently (safe, invisible). True overlapping conflicts: default resolution keeps the local side *visible* but **journals the losing version (Drill 1 req 11) and posts a non-modal "both versions kept" notice + conflict-inbox entry** — GitJournal's calm surface with GitJournal's data-loss removed. The blocking hunk-picker UI exists but is opt-in via Power mode. Scope-isolation (req 1.8) makes the silent path structurally unable to revert unrelated files.

### T5 — Zero-decision sub-second capture vs baseSha optimistic concurrency
Drill 5 demands capture that never waits on network/auth/conflict; Drill 1 demands every write be 409-gated.
**Resolution:** Captures are pure appends to an inbox stream: local queue first (instant), async commit, and merge3 special-cases append-append as timestamp-ordered concatenation — the 409 machinery still runs underneath but is definitionally resolvable, so it never surfaces. Capture is thus the one write path with a guaranteed no-conflict UX without violating the no-silent-overwrite rule.

### T6 — Comments/suggestions outside the file (Supabase) vs data-ownership/exit-ramp promise
Drill 2's resolution of the HedgeDoc deadlock puts review data in Supabase; Drills 5 and 6 show users refuse anything whose deletion loses data ("burned too many times"; file-over-app).
**Resolution:** Sidecar storage + guaranteed materialization: comments/suggestions exportable as JSON and via an optional CriticMarkup exporter into the repo; the trust page states mechanically that deleting the Supabase layer leaves a fully valid markdown repo. This answers HedgeDoc's "lost on export" veto without their in-file pollution.

### T7 — Local-first / BYO-key AI privacy vs cloud features (email-in, MCP endpoint, share links)
Drill 5's cohort rejects cloud inference; but email capture, guest share links, and a hosted MCP endpoint require servers.
**Resolution:** Tier by data class: note *content* inference defaults to local (transformers.js) or user-configured endpoints with pre-run cost display; server-side features handle transport/anchoring only, never third-party inference on vault content without explicit BYO configuration. Publish which surfaces touch which servers on the trust page.

### T8 — 90-second onboarding with repo-from-commit-#1 vs the no-GitHub-account user
Drill 6 requires the repo in the user's account from the first commit (anti-Stackbit), but the biggest funnel cliff is users with no GitHub account at all.
**Resolution:** Value-before-auth: a local-only vault (IndexedDB/OPFS) works immediately with a visible "not yet backed up" state; connecting GitHub (create-repo-for-me) migrates the local vault as its first commits — into the user's own account, preserving the ownership order Stackbit got wrong. Drill 4's outbox/durability machinery already makes the pre-auth window safe.