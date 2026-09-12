I mutated nothing: no repo files created, edited, or committed; all writes went to `$TMPDIR` scratch (curl outputs plus a synthetic 3-way-merge fixture), and the `~/.claude` dirt predates this task.

### Sources opened (all via `curl`; WebFetch never used)

- `curl` works here unauthenticated; the GitHub REST API is rate-limited (403) but `github.com` HTML and `registry.npmjs.org` are open `[measured]`. `~/.config/codex-env` is in the sandbox read-deny list, so no token-authenticated API calls were possible `[measured]`.
- **Evidence-hygiene flag:** three fetched pages (radicle.dev, git-send-email.io, pijul.org) contain shell-install one-liners piped to `sh`. These are page text quoted as research data. None was executed. The session injection-scan hook fired on them; treat as expected noise from fetching developer-tool homepages, not a live chain.

### OT vs CRDT — the tradeoffs that survive contact

| Axis | OT (server-authoritative) | CRDT (peer) |
|---|---|---|
| Field record | "CRDT solutions are rarely found in working co-editors, while OT solutions remain the choice for building the vast majority of co-editors" — Sun et al., arXiv 1810.02137, 2018-10-04 `[fetched]` | Yjs 22,717★, Automerge 6,541★, Loro 6,081★ `[fetched 2026-08-29]` — library adoption, not co-editor adoption |
| Long offline divergence | "slow to merge files that have diverged substantially due to offline editing" — Eg-walker paper, arXiv 2409.14252, 2024-09-21 `[fetched]` | Merges cheaply, but "slow to load and consume a lot of memory" (same source) `[fetched]` |
| Interleaving corruption | **Affects both.** "The problem has gone unnoticed for decades, and it affects both CRDTs and Operational Transformation" — Fugue, arXiv 2305.00583 v3 2025-10-21 `[fetched]` | Same |
| Server requirement | Requires one. That is the design | Doesn't require one — but in practice OpenKnowledge's byte contract "exists only inside a live CRDT server; agent edits error out without it" `[measured, PRD §competitors]` |
| Semantic merge quality | 3-way / OT surfaces the conflict | CRDT merges *silently and wrongly*: "white"→"frosty" and "white"→"soft" merges to **"frostysoft"** or **"softfrosty"**; a paragraph deleted in one draft keeps the other draft's inserted characters floating where the paragraph used to be — Ink & Switch, Upwelling, March 2023 `[fetched]` |

- The Eg-walker result (Kleppmann's own group) is the tell: **both families were bad enough that the CRDT authors published a third algorithm.** Loro already adopted it — "The Event Graph Walker (Eg-walker) algorithm from @josephg has been adapted to reduce the computation and space usage of CRDTs" `[fetched, Loro README]`. `[inference]` A field where the leading researchers replaced their own primitive twice in three years is not a stable dependency for a byte-fidelity moat.

### The three CRDT projects — current state, 2026-08-29

| | Yjs | Automerge | Loro |
|---|---|---|---|
| npm latest / published | `yjs` **13.6.32**, 2026-08-04 `[fetched]` | `@automerge/automerge` **3.4.1**, 2026-08-12 `[fetched]` | `loro-crdt` **1.15.0**, 2026-08-27 `[fetched]` |
| Stars / forks | 22,717 / 799 `[fetched]` | 6,541 / 266 `[fetched]` | 6,081 / 168 `[fetched]` |
| npm unpacked size | 2,307,010 B `[fetched]` | 46,545,434 B `[fetched]` | 19,353,217 B `[fetched]` |
| First published | 2015-01-26, 313 versions `[fetched]` | 2022-10-04, 137 versions `[fetched]` | 2023-04-07, 170 versions `[fetched]` |
| Algorithm | YATA | RGA-family | Fugue + Eg-walker `[fetched]` |

- OT comparison: `sharedb` **6.0.2**, 6,535★ `[fetched]` — one star-order-of-magnitude below Yjs, still the reference OT server.

### Benchmark reality check — and its staleness

Source: `dmonad/crdt-benchmarks` README, authored by Kevin Jahns (**the Yjs author** — vendor-run benchmark, weigh accordingly) `[fetched]`. B4 replays 259,778 real single-character ops producing a 104,852-character document `[fetched]`.

| B4 metric | Yjs | ywasm | Loro | Automerge |
|---|---|---|---|---|
| Apply time | 5,714 ms | 28,675 ms | **3,089 ms** | 14,326 ms |
| parseTime | 39 ms | 16 ms | **13 ms** | 1,805 ms |
| docSize | 159,929 B | 159,929 B | 258,228 B | **129,116 B** |
| Bundle (gzip) | **20,100 B** | 213,833 B | 399,276 B | 604,118 B |

- **Encoded-size overhead vs the plain text** `[derived]`: Yjs 159,929/104,852 = **1.53× (+52.5%)**; Loro 258,228/104,852 = **2.46× (+146.3%)**; Automerge 129,116/104,852 = **1.23× (+23.1%)**. At B4×100 the ratios hold (Yjs 1.525×, Loro 2.461×) `[derived]`.
- **The table is stale and must not be quoted as current.** Its pinned versions are yjs 13.6.11, ywasm 0.9.3, loro 0.10.1, automerge 2.1.10 `[fetched]` — against today's 13.6.32 / 1.15.0 / 3.4.1 `[fetched]`. **Recorded disagreement:** Automerge's own 3.0 post claims "memory usage cut by over 10x", Moby Dick going **700 MB → 1.3 MB**, and one document that "hadn't loaded after 17 hours loading in 9 seconds" `[fetched, automerge.org/blog/automerge-3]`. The benchmark's Automerge column predates all of it.

### Git-native document collaboration — who actually tried it

| Project | State on 2026-08-29 | Mechanism |
|---|---|---|
| **Prose.io** | **Effectively dead.** Last commit `9ef717ea94d1`, **2024-02-09**; README: "Prose project is currently looking for new maintainers"; still links IRC/freenode `[fetched]` | Direct commits to GitHub |
| **Decap CMS** (ex-Netlify CMS, renamed Feb 2023) | 19.3k★ on their own site nav `[fetched]` | `publish_mode: editorial_workflow` → **Save draft = commit to branch `cms/collectionName/entrySlug` + open PR; Edit draft = another commit; Approve = merge PR + delete branch** `[fetched]` |
| **Front Matter CMS** | v**10.12.0**, updated 2026-08-21, **80,591 installs**, 5.0★/20 ratings `[fetched, VS Marketplace API]` | Local files; git is the user's own |
| **GitBook** | Live product. Ships **Git Sync (bi-directional), Change requests, Merge rules, Comments, AND Live edits** as separate nav items `[fetched]` | "A change request is a copy of your main content. It's based on the concept of branching, and feels familiar to anyone who uses pull requests" `[fetched]` |
| **Obsidian Git** | v2.39.0, **3,067,376 downloads, rank 6 of 7,020 community plugins** `[fetched, obsidian-releases stats]` | Commit/pull/push a vault |

- **The single most important adoption number in this report** `[fetched 2026-08-29, derived ratios]`: in the PRD's own beachhead (Obsidian power users), `obsidian-git` **3,067,376** vs `system3-relay` (Relay, the commercial real-time-multiplayer plugin) **190,728** = **16.08×**; vs `peerdraft` **18,796**; vs both real-time plugins combined (209,524) = **14.64×**. `obsidian-livesync` (async replication, not co-typing) 894,228 = rank 29. Git ranks 6; Relay ranks 118 of 7,020.
- `[inference]` GitBook is the existence proof that a commercial docs product **ships both** and treats change-requests as the primary named collaboration surface, with live edits as a secondary mode — not the reverse.

### Patch exchange — why it persists

- **git send-email** is alive as the on-ramp for "email-driven projects like the Linux kernel, PostgreSQL, or even git itself" `[fetched, git-send-email.io]`; the kernel's `submitting-patches.rst` remains the canonical process doc `[fetched, 15,500 B]`.
- **Radicle 1.10.2**, released 2026-08-26 (commit `7f5de25223c43ee90365fbbca85fc1bdfb41797f`) `[fetched]`. "All social artifacts are stored in Git, and signed using public-key cryptography"; patches and issues are git objects, gossiped between peers `[fetched]`.
- **Pijul** still ships as **`~1.0.0-beta`** `[fetched]` after years. Its claim is the interesting one for prose: "The order between lines is always **preserved**, unlike 3-way merge which can silently shuffle content… When order is genuinely unknown, Pijul surfaces a conflict — never silently wrong output" `[fetched]`.
- **Sourcehut** is still self-described as **"currently available as a public alpha"**; latest blog post 2026-08-27 is about LLM terms of service `[fetched]`.
- `[inference]` Patch exchange persists because it is the only model with **zero shared infrastructure and full authorship attestation**. It does not persist because it is pleasant. Every project above is either beta, alpha, or maintained by a single ideological author. **This is a source of design ideas, not a shippable UX.**

### Async review vs real-time presence — the evidence for documents

- Ink & Switch interviewed professional writers and editors and named the finding the **"fishbowl effect"** `[fetched, Upwelling, McKelvey / Jenson / Wagner / Cook / Kleppmann, March 2023]`:
  - "Writers don't want first drafts visible to the editor." — Journalist `[fetched]`
  - "If you don't want the editor or writer to see what you're doing until you're done, sometimes you make a copy of the doc and work in the copy, then paste it back (otherwise you have 17 canonical documents and people are editing the wrong thing)." — Newspaper Editor `[fetched]`
  - Interviewees reported **putting devices into airplane mode to stop their edits being shared** `[fetched]`.
- Their finding heading is explicit: **"Both real-time and asynchronous collaboration are needed"** — and "most existing software supports only one of the two modes. Google Docs is real-time–only" `[fetched]`.
- Supporting citation they lean on: **Wang, Tan, Lu (2017), "Why Users Do Not Want to Write Together When They Are Writing Together"**, DOI `10.1145/3134742`, 53 citations `[fetched, Crossref]`.
- `[inference]` The demand signal is asymmetric: real-time presence is **wanted for meeting notes and live-call co-editing**, and actively **resisted for drafting**. A markdown editor's users are drafters.

### Google Docs suggesting mode — the incumbent, correctly described

- Mechanics `[fetched, support.google.com/docs/answer/6033474]`: proposed change stored as an overlay in a distinct colour, deletions struck through; owner is **emailed**; accept/reject one-by-one, or Tools → Review suggested edits → **Accept all / Reject all**, with a preview toggle.
- `[inference]` **Suggesting mode is asynchronous review implemented on top of a real-time substrate.** It is the incumbent model precisely because Google found that real-time alone was insufficient for documents with an approver. The substrate (OT) is not what users are buying; the **proposal → adjudication loop** is.
- Markdown's equivalent, **CriticMarkup**, is orphaned: `criticmarkup.com` now resolves to a **Hover domain-parking page**, and `CriticMarkup/CriticMarkup-toolkit` (848★) last committed **2021-02-27** `[fetched 2026-08-29]`. The PRD's §4b plan to materialise suggestions "optionally as CriticMarkup into repo" is building on an unmaintained spec — usable as a byte format, unusable as an ecosystem bet.

### Local-first — what the essay actually claims

Kleppmann, Wiggins, van Hardenberg, McGranaghan, *Local-first software* `[fetched, inkandswitch.com/essay/local-first]`. Seven ideals: no spinners; work not trapped on one device; network optional; seamless collaboration; the long now; security and privacy by default; you retain ultimate ownership.

Their own scorecard row — this is the load-bearing quote for this decision:

| System | Fast | Multi-device | Offline | Collaboration | Longevity | Privacy | User control |
|---|---|---|---|---|---|---|---|
| **Git + GitHub** | ✓ | — | ✓ | — | ✓ | — | ✓ |

- "We think the Git model points the way toward a future for local-first software. However, as it currently stands, Git has two major weaknesses" — (1) no real-time fine-grained collaboration; (2) "highly optimized for code and similar line-based text files; other file formats are treated as binary blobs" `[fetched]`.
- **What the essay does NOT claim:** it does not claim CRDTs are ready, nor that real-time is required for local-first. It claims CRDTs are "a foundational technology" and that Git already satisfies 4 of 7 ideals `[fetched]`. `[inference]` frontmatter's file-is-truth architecture already inherits Fast / Offline / Longevity / User control, and closes Multi-device and Privacy with plain git hosting — leaving exactly one unchecked box, Collaboration.

### Deliverable 1 — model comparison scorecard

Scored 1–5, 5 = best. "Splice fit" = compatibility with `locate byte range → replace those bytes only → every untouched byte bit-identical → else REFUSE` `[measured, PRD §7.1]`.

| | Real-time CRDT (peer) | Server-authoritative OT | Git branch-and-review | Patch exchange |
|---|---|---|---|---|
| Conflict handling | 3 — never blocks, but merges wrongly and silently ("frostysoft") `[fetched]` | 4 — one authority, no divergence, but degrades on long offline branches `[fetched]` | 4 — **0 conflicts on disjoint paragraphs, 1 on same-line edits, 1 on reflow-vs-edit** `[measured]` | 4 — same engine, explicit sender-side rebase |
| Offline | **5** — the whole point `[fetched]` | 2 — divergence is the failure mode `[fetched]` | **5** — a git repo is a primary copy `[fetched, local-first essay]` | **5** |
| Byte fidelity | **1** — the CRDT becomes the source of truth; **+52.5% (Yjs) to +146.3% (Loro)** encoded overhead over the text `[derived]`; the `.md` degrades to a projection | 2 — server holds authoritative op log; file still regenerated | **5** — bytes on disk *are* the document; splice never leaves the file | **5** |
| Auditability | 2 — per-keystroke ops, no human-legible unit; **"keystrokes should be grouped meaningfully"** is an open Upwelling finding `[fetched]` | 3 — server log, not user-facing | **5** — commit, author, message, signature, `Co-authored-by`; Radicle proves social artifacts can be signed git objects `[fetched]` | **5** |
| Implementation cost | 1 — new sync engine + relay + storage; **Liveblocks Pro $25/mo, Team $500/mo, $0.002 per realtime-minute, $1/1M updates, 10 MB per room on Free/Pro, SOC 2 only from the $500 tier** `[fetched]` | 2 — bespoke server, the hardest thing on this list to get right | **4** — `merge3 + baseSha` **already exists in the codebase** `[measured, PRD §4b]` | 3 — engine free, UX expensive |
| Splice fit | **1 — actively hostile.** A CRDT is a second source of truth; REFUSE has no meaning inside it | 3 | **5 — native.** Splice *is* a patch | **5** |
| **Total /30** | **13** | **16** | **28** | **27** |

### Deliverable 2 — RECOMMENDATION

**Resolve D2 as (a) — §4b governs, server-authoritative — and then correct §4b's own label: what §4b describes is not OT. It is git-branch-and-review with a server as sequencer. Name it that, and stop calling it "server-authoritative CRDT-adjacent."**

§4b already specifies: "No peer CRDT. Server-authoritative sequencing over the existing **merge3 + baseSha** engine; **session-batched commits with `Co-authored-by`**; live layer ephemeral, **file remains the document**" `[measured, PRD §4b, dated 2026-07-13]`. `[inference]` merge3 + baseSha *is* three-way merge — the git model. Session-batched commits with `Co-authored-by` *is* a commit. The third option the PRD never examined is the one it accidentally built.

Reasoning, in the order that decides it:

1. **Splice and CRDT are mutually exclusive claims about who owns the bytes.** The moat is `REFUSE and return input unchanged` when a byte range can't be located safely `[measured, §7.1]`. A CRDT has no refuse — it always converges. Adopting one demotes the `.md` to a projection of the op log, which is exactly the failure the PRD measured in OpenKnowledge ("byte contract exists only inside a live CRDT server; agent edits error out without it") `[measured]`.
2. **The audience data is 16:1 against.** obsidian-git 3,067,376 vs Relay 190,728 in the exact beachhead `[fetched/derived]`.
3. **The unit economics forbid it.** At $0.002/realtime-minute, a writer at 2 h/day × 22 days = 2,640 min = **$5.28/user/month** `[derived]` — above the PRD's **$4/mo individual** price and above the **$5/seat** team price, before any other COGS. Even 1 h/day × 20 d = $2.40 = 60% of the $4 plan `[derived]`. SOC 2 begins at the $500/mo tier `[fetched]`.
4. **The category's own users resist it.** Fishbowl effect, airplane mode, copy-paste-into-a-private-doc `[fetched]`.
5. **Line discipline in the real corpus makes 3-way merge work.** Across **4,702 markdown files / 445,836 prose lines**: median line 52 chars, mean 74.8, **81.96% ≤ 100 chars**, only 5.99% > 200 `[measured]`. `[inference]` This corpus is already near semantic-linefeed; git's line-granular merge is a good fit, not a poor one.

**Strongest counter-argument, stated at full strength.** Ink & Switch — the most credible primary source in this report, and the one whose conclusions I am otherwise leaning on — found the opposite of asynchronous-only: *"As we developed Upwelling, we experimented with an **asynchronous-only** collaboration model but found that while drafts often have a single primary author, those authors often find it useful to be able to share an in-progress draft for initial feedback, or to ask for help with wording or copyediting before merging a draft"* `[fetched]`. They shipped layers precisely because async-only failed in testing. GitBook, the closest commercial analogue, independently ships Live edits alongside Change requests `[fetched]`. `[inference]` The honest reading is that async-only is wrong at the limit — but the failure mode is *"two people on one draft for twenty minutes"*, which is served by an **ephemeral live layer over a shared branch**, exactly what §4b already permits, and **not** by peer CRDT, per-keystroke persistence, or a bespoke sync engine.

### Deliverable 3 — what we lose without real-time cursors

- **Lost, genuinely:** live-call co-editing of meeting notes; the "I'm on line 40, you take line 80" coordination signal; the trust cue that a doc is not stale; a demo moment that sells screenshots.
- **Not lost:** everything the audience actually pays for. Multi-device (git sync), no data loss (commits), review (PRs), attribution (`Co-authored-by`, signatures), offline (repo is primary).
- **Does this category ask for it?** `[fetched/derived]` No, at 14.6:1 against in the beachhead. The PRD's own segment reading is consistent: "**Writers/editors wait for suggest mode**" — suggest mode, not cursors `[measured, §4b]`. The demand is for *proposal-and-adjudication*, which is Google's suggesting mode `[fetched]`, GitBook's change requests `[fetched]`, and Decap's editorial workflow `[fetched]` — three independent products converging on the same shape.
- **Anti-recommendation:** do not build live cursors as a trust signal. Ship a **presence badge without a cursor** ("Priya has this file open, last edit 2m ago") — the coordination value at ~1% of the cost, and it does not create the fishbowl.

### Deliverable 4 — migration path

| Stage | Ship | Reversible? |
|---|---|---|
| **0 — now** | Delete the Yjs rows from Pillars 3 and 5. Rename §4b's model **"branch and review"**. Move `Multi-user concurrent state, presence` from SERVER to **SERVER · not this cycle** in the client/server/LLM table (PRD line 404) | n/a |
| **1** | **Suggestions as splices.** A suggestion = `{baseSha, byteRange, replacement, author}` in the Supabase sidecar; accept = a splice; reject = a delete. Materialise to JSON always, CriticMarkup optionally — but treat CriticMarkup as a **byte format we own**, not an ecosystem (`criticmarkup.com` is a parked domain; toolkit last commit 2021-02-27 `[fetched]`) | Fully — sidecar deletion leaves a valid repo, per §4b |
| **2** | **Branch and review.** Drafts as real git branches, `Co-authored-by` on session-batched commits, review UI = per-hunk accept over the splice list — the same surface the PRD already calls a breaking-API contract (line 598) | Fully — it is git |
| **3 — only if evidence demands** | **Ephemeral live layer.** Presence + a short-lived shared buffer over *one* branch. Persist on session close as one splice batch, never per keystroke | Yes, by design |
| **4 — the exit hatch** | If Stage 3 proves insufficient, adopt **Loro** (Eg-walker + Fugue, smallest merge-time cost, `1.15.0` published 2026-08-27 `[fetched]`) — but **only as an ephemeral in-session buffer**, never as storage. The persisted artifact stays the `.md` | The one-way door is persisting CRDT state. Never cross it |

**Anti-recommendations, explicit:**

- **Never persist CRDT state as the document.** That is the single irreversible decision here and it deletes the splice guarantee.
- **Do not adopt Automerge for a text editor on the strength of the 3.0 blog post alone.** The 10× memory claim is the vendor's `[fetched]`; the only independent table available still pins 2.1.10 `[fetched]` — the numbers are not reconciled and must not be quoted as if they were.
- **Do not build a bespoke OT server.** Sun et al.'s point cuts both ways: OT won because Google, Microsoft and ShareDB *already paid for it* `[fetched]`. A three-person team should not.
- **Do not ship Pijul-style "first-class conflicts" as a user-facing concept.** It is the right theory (`1.0.0-beta` after years `[fetched]`) and the wrong surface for a "very simplified surface" product.
- **Do not model collaboration on Prose.io.** Dead since 2024-02-09 and openly seeking maintainers `[fetched]` — the git-CMS graveyard is real, and Decap/GitBook survived by adding **review**, not by adding **real-time**.