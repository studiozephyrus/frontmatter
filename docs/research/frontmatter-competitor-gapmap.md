# frontmatter — Competitor Gap Map
*(sourced strictly from the research corpus; "⚠" = price not verified from an official page in this research; "—" = not present in corpus)*

## 1. Competitor table

| App | Price | Sync model | Git sync | Real-time collab | Offline | Mobile | Open / exportable | #1 complaint |
|---|---|---|---|---|---|---|---|---|
| **Obsidian** | Free core; Sync $4/mo (annual), $5 monthly; Publish $8/site/mo (official, verified) | Paid E2EE add-on; or DIY iCloud/Syncthing/git | Community plugin only (obsidian-git); broken merges + silent overwrites on mobile | No (third-party Relay plugin only) | Yes, offline-native | Weak: 1–5+ min cold starts on large vaults; explicit quit-driver | Plain .md files on disk — the category benchmark | Sync price + multi-minute mobile vault loads; no web app at all |
| **Notion** | Free; Plus $10/user/mo; Business $20; AI $10 per 1,000 credits (official, verified) | Cloud-only, vendor servers | No | Yes — its widely-conceded strength | Half-measure (Aug 2025): manual page marking, excludes browser, 50-row DB cap | Slow on big databases | Lossy: relations→text, rollups/views vanish, DB→CSV; export-link failures documented | Offline unreliability + AI-first pricing ("three price increases for the same capability") |
| **Evernote** | ~$130–180/yr user-reported ⚠ (post-Bending-Spoons hikes; no official page verified) | Vendor cloud | No | — | "No longer has a functioning offline mode" (user report) | v10 Electron: 10–30s to clip, 20s cold open on Android | ZIP export "you'll be lucky if it opened" | Price hikes + billing hostility; Trustpilot ~1.2–1.3/5 |
| **OneNote** | Free (bundled M365) | OneDrive cloud | No | — | Yes (desktop) | Android silently stops syncing, flips read-only; reinstall destroys unsynced notes | Proprietary format; export nearly impossible (PDF only on Mac) | Silent sync failure → catastrophic data loss ("DO NOT LOG IN/OUT OR REINSTALL") |
| **Joplin** | Free OSS; Cloud €2.99–9.99/mo; Teams €7.99/user/mo (official, verified) | Any backend (Dropbox/WebDAV/S3) + E2EE | No (file backends, not git) | No | Yes | Laggy, dated; iOS sync config wipes itself | Markdown-in-a-database; non-standard markdown criticized | Sync conflicts/deletions over WebDAV + "can't get past how ugly it is" |
| **Logseq** | Free OSS; hosted Sync in beta, pricing unannounced ⚠ | iCloud (unreliable) or paid sync beta | Git-friendly plain files | No | Yes | Mediocre; first sync fails on tens of thousands of notes | Plain .md/.org, but %2F-encoded filenames offend purists | "Increasingly worried it's abandonware" (silent DB rewrite) |
| **Bear** | Free; Pro $2.99/mo or $29.99/yr (official, verified) | iCloud only, Pro-gated | No | None | Yes | Apple-only; web beta "not intended as standalone" | Pseudo-markdown; export-rich but Apple-locked | No Windows/Android/full web |
| **Craft** | Free (1,500 blocks); Plus $10/mo or $96/yr; Team $60/mo (official, verified) | Mandatory company-server sync (no iCloud-only option) | No | Yes | Cloud+local | No Android — "most consistent complaint" | Blocks, not plain markdown; lossy md round-trip | Android absence + block limits + export breakage |
| **Anytype** | Free (1GB); Builder $99/yr; Co-creator $299/yr ⚠ (official page JS-blocked; search-corroborated) | Local-first P2P E2EE — but forced vendor backup node | No | — | Yes | Weaker parity than desktop | Protobuf objects, not markdown; export friction; free tier cut 1GB→100MB | "Can't just use raw Markdown or CSV with Anytype" |
| **Capacities** | Core free; Pro ~$10–12/mo ⚠ (official page JS-blocked; third-party figures) | Cloud-first | No | — | "Not truly offline first" | Android app "rage-inducing" (cursor jumping) | Object model over plain files; weak imports | Learning curve + limited offline |
| **Reflect** | $10/mo annual, no free tier (official, verified) | E2EE vendor cloud | No | Limited (PH cons cite it) | — | iOS + desktop | — | Price hard to justify; backlink-first model alienates folder-thinkers |
| **Tana** | Free tier; Pro $20/mo early-bird (reg. $30); Max $80/mo (official, verified) | Cloud-only | No | — | None for years; offline shipped as 2025 relaunch headline | "Better mobile apps" = lead con | Proprietary outliner; API/integrations missing | No offline + premium pricing + learning curve |
| **UpNote** | $1.99/mo or $39.99 lifetime (official, verified) | Proprietary sync (reliable per reviews) | No | None | Yes | All 5 platforms | No API/plugins; lock-in concerns | No web version (top request) + no collaboration |
| **Notesnook** | Free; paid geo-localized (INR verified; USD ⚠) | Zero-knowledge E2EE; self-hostable server | No | — | Yes | All platforms; features land desktop-first | Open source; publish via Monographs | Sync latency: "a change on mobile takes minutes" |
| **Standard Notes** | ~$63–90/yr Productivity ⚠ (official page JS-rendered, unverified) | E2EE vendor cloud | No | No (encryption precludes it) | Yes | All platforms | Open source, but markdown/rich editors paywalled | Basic formatting behind a ~$50–90/yr paywall |
| **HackMD / HedgeDoc** | Free (3 team members, 20 GitHub pushes/mo); Prime $5/seat/mo (official, verified) | Server-side docs; HedgeDoc self-host (single-instance, stateful) | GitHub push/pull — capped 20/mo free | Yes — best-in-class md collab | No offline-first | Web-only | Markdown-native docs; web-only publishing | It's a doc pad, not a vault; raw-markdown UI scares non-devs; no comments (HedgeDoc) |
| **SilverBullet** | Free OSS, self-hosted only | Your own server; PWA offline "mostly" | Files on your server (git-able) | No (CRDTs only "considered", #1728) | Mostly | No official apps; mobile browser | Plain .md folder | You must run your own server; conflicted-copy cleanup fatigue + mid-typing page wipes |
| **Typora** | $14.99 one-time (official, verified) | None | No | No | Yes (local) | None | Local plain files, gorgeous WYSIWYG | Single-machine editor; went paid after 6-yr free beta |
| **iA Writer** | One-time $29.99–49.99 per platform (official, verified) | iCloud/Dropbox (no own service) | No | No | Yes | Android crippled (can't set a folder) | Plain files | Platform-inconsistent feature set |
| **Google Docs** | Free personal; Workspace ~$7–8.40/user/mo ⚠ (not re-verified) | Vendor cloud | No | Yes — the collab benchmark (share links, suggest mode, anonymous access) | Via Chrome only | Yes | Proprietary; "supports Markdown just enough to frustrate the life out of you" | Lock-in + terrible search + slow big docs + privacy distrust |
| **Simplenote** | Free | Vendor cloud | No | — | Yes | Yes | Plain text only | Silent sync data loss (forced logout wiped 2 years of notes) |
| **Octarine** | One-time license, amount — (indie, early-access) | Local folder; built-in gitsync | Yes — built-in GitHub/GitLab sync | No | Yes | None yet | Plain local markdown, "nothing proprietary" | No mobile, no sync service — desktop-only |

Plugin-tier context (the "free git sync" incumbents frontmatter actually displaces): **obsidian-git** — mobile merges impossible (isomorphic-git), silent overwrites (#558, #819), PAT-only auth; **GitJournal** — auto-sync overwrites desktop pushes, open since 2020 (#241).

---

## 2. Whitespace — combinations no one ships

1. **Real-time collab + plain markdown files + git history.** HackMD has collab + GitHub push but is a doc pad (no vault, no offline, 20 free pushes/mo). Obsidian has files + git but zero multiplayer — its own forum documents users round-tripping to Google Docs for comments. The corpus is explicit: *"Shipping CRDT merge over a git-backed markdown vault is the unclaimed combination — HedgeDoc and SilverBullet are both only 'considering' it."* CollabMD/Peerdraft/colibri exist as demand evidence, none productized.

2. **Obsidian-compatible vault, fully editable in the browser, zero self-hosting.** SilverBullet/SiYuan/Affine require running a server; Obsidian has no web client; Bear's web beta is a Pro-only companion; UpNote's top request is a web version. A dedicated 63-comment r/PKMS thread asks verbatim: *"I don't understand why Obsidian or third party haven't already made a business out of making vaults accessible via browser anywhere."*

3. **Offline-capable browser app + instant load at scale.** Notion's offline mode *excludes the browser entirely* and caps databases at 50 rows; Obsidian mobile takes 1–5 minutes on big vaults. Nobody occupies "PWA that opens a 10k-note vault in seconds and works on a plane."

4. **Git-backed sync that a non-git-user can trust: visible sync status + in-app conflict UI + never-lose-data merges.** Every existing path fails one leg: obsidian-git overwrites silently on mobile, GitJournal overwrites by design, SilverBullet spams conflicted copies, Obsidian Sync has no visible status and undeletes files. obsidian-git issue #803 is literally a spec for the missing conflict-resolution modal; no one has built it.

5. **Google-Docs-grade sharing (link + Viewer/Commenter/Editor + anonymous access + comments + suggest mode) on files stored in a repo the user owns.** The gdocs-collab slice shows this is the exact loop devs abandon markdown for — and that indie attempts fail on product polish, not CRDT plumbing.

6. **Cheap honest pricing + self-owned storage as the trust product.** Post-Evernote/Bending-Spoons, vendor trust is purchasable: "just markdown files I own" is the most-repeated reason switchers stay switched, and users explicitly price app-death risk. Since the user's GitHub repo carries storage, frontmatter's marginal cost undercuts every $4–10/mo sync add-on.

---

## 3. Positioning — three candidate wedges

**Wedge A — "Your markdown vault, in any browser."** The web front-end to an Obsidian-format GitHub-backed vault, no self-hosting, no plugin hunt, opens instantly on locked-down work machines and phones.
> Evidence: *"it's almost perfect for me except one thing - I would like to be able to access my files remotely without headaches"* + *"the wish for web accessible vaults is around for years"* — r/PKMS, https://www.reddit.com/r/PKMS/comments/1ucfmib/ (43 pts, 63 comments); reinforced by Obsidian's #1 quit-driver being mobile vault load times.

**Wedge B — "Google Docs for markdown you own."** Real-time collab, comments, suggest-mode, and share links — on plain .md files whose source of truth stays a git repo the user controls. Attacks the one thing local-first tools concede to Notion/Docs.
> Evidence: *"I love Markdown but collaboration is a pain. Whenever I work on a document with others, I end up switching to Google Docs"* — HN, https://news.ycombinator.com/item?id=47221706; and *"collaborating with others usually means dealing with Git merge conflicts or abandoning local files to use a proprietary SaaS"* — CollabMD launch, r/selfhosted.

**Wedge C — "Sync you can see, history you can't lose."** Free git-native sync (vault = repo) with an always-visible sync status, default-on version history, and a non-destructive merge UI — sold against paid, opaque, occasionally destructive Obsidian Sync and the "dangerously broken" free git plugins.
> Evidence: *"The git plugin is dangerously broken. I've had pushes from different computers overwrite one another."* — HN, https://news.ycombinator.com/item?id=36610268; plus *"Obsidians sync price is nutty"* (HN 33219781) and the 14-upvote ask to *"put the sync status somewhere easily visible"* (r/ObsidianMD).

---

## 4. Head-start inventory — what md-repo-state already gives each wedge

**Wedge A (vault in browser)** — largest head start:
- Already shipped: Next 16 web editor deployed at md.sgnk.ai; CodeMirror 6 with edit/reading/split + Live mode v1 (click-to-edit preview); full Obsidian-dialect rendering (wikilinks + alias/#heading, transclusion, callouts, tags, KaTeX, Mermaid, GFM tables, task toggles); vault ops (virtualized tree, rename with auto-relink, daily notes, templates, attachments); MiniSearch + Cmd+K/Cmd+P; force-graph + backlinks + outline; GitHub repo IS the vault (snapshot zipball + sha cache, atomic Git Data commits); PWA manifest + Tauri macOS app.
- Missing for the wedge: multi-tenant auth (today: single-login allowlist `sagnikmitra` + password fallback, no user table), repo-picker/multi-vault (K5 deferred), any Supabase layer (zero references in src/), mobile-optimized layout (desktop three-pane only), proven instant-load at scale.

**Wedge B (Google Docs for md)** — smallest head start; mostly greenfield:
- Already shipped: Live/WYSIWYG-ish editing v1, in-preview editable tables, publish-to-public-URL via `public_slug` frontmatter with slug-conflict handling, export (.md/HTML/PDF/ZIP), IndexedDB draft autosave.
- Missing for the wedge: everything multiplayer — CRDT/shared cursors (B4 marked XL/deferred; no yjs/automerge in package.json), presence (K3 deferred), comments/annotations (C10 deferred, "needs product decision"), per-person sharing/ACLs/invites (only public publish exists), suggest-mode/track-changes (not in any plan doc).

**Wedge C (trustworthy git sync)** — strong engine, missing the trust surface:
- Already shipped: conservative 3-way merge engine (`repository/domain/merge3.ts`, 14 conflict-matrix tests) + non-destructive Merge button replacing "override remote"; baseSha 409 optimistic-concurrency on every commit; git-based version history/restore endpoints (`/api/vault/history|version|restore`); atomic multi-file commits; ~1,168 vitest tests + architecture gates behind it.
- Missing for the wedge: the background auto-pull/auto-push engine (B8 second half explicitly deferred — sync today is manual clicks + a local cron script); an always-visible sync-status indicator (the corpus's most concrete trust ask); an in-app conflict-resolution UI (the obsidian-git #803 spec); invisible auth for non-devs (today assumes GitHub OAuth; corpus says PAT/OAuth friction is the first wall); Supabase persistence for anything beyond the repo.

Ranked by (demand × head start): **A > C > B** — Wedge A is nearly sellable from the existing codebase once multi-tenancy lands; Wedge C's hard part (merge engine) is done but its visible trust layer is not; Wedge B is the biggest long-term moat and the biggest remaining build.