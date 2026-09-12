`[measured]` `git -C ~/.claude status` shows 18 dirty paths, all PWA/design/docs skills and a `.bak` dated 20260810 — none touched by this session, whose only tools were Read, grep/find/wc, and curl; last commit is `6e390828`, unchanged.

### A. Measured baseline — what the architecture *is* on disk today (2026-08-29)

| Fact | Value | Tag |
|---|---|---|
| Module dirs under `src/modules/` | **13** (`ai, ai-tools, app-shell, auth, drafts, editor, export, graph, mdmax, preview, repository, share, vault`) + `README.md`. PRD §7.2 says "14" | `[measured]` — record the disagreement |
| `src/` TypeScript files / lines | 226 / 25,407 | `[measured]` — agrees with PRD |
| Test files | 98 under `./test`; **262** if `.claude/worktrees/*` are counted | `[measured]` — reproduces PRD §32's correction |
| Routes | 26 `route.ts` + 4 `page.tsx` = 30 | `[measured]` |
| `.github/` | absent | `[measured]` |
| **Database** | **None.** `firestore()` is exported in `src/shared/infrastructure/firebase/client.ts` and called by **zero** files | `[measured]` |
| **Tenancy** | Single, by env: `GITHUB_REPO` default `sagnikmitra/md`, one server-side `GITHUB_REPO_TOKEN`, `ALLOWED_GH_LOGIN` default `sagnikmitra` | `[measured]` |
| Read model | Whole-repo **zipball** → `unzipSync` in memory → parse every `.md` → LRU `Map` of **3** snapshots at module scope. 7 API routes reach it | `[measured]` |
| Write model | GitHub Git Data API; OCC on `baseSha`, 409 on conflict; ≤500 files, ≤10 MB/file per commit; `merge3` line-LCS 3-way merge with git-style markers | `[measured]` |
| **MDMAX wiring** | **2 product files import it** — `vault/application/get-snapshot.ts` and `vault/infrastructure/search-index.ts`, both importing only `decodeStrict` from `shape-gate`. **11 of 13 mdmax files are imported by zero product files.** PRD's "zero product files" is literally refuted; directionally right | `[measured]` |
| Desktop | `src-tauri/tauri.conf.json`: `frontendDist`, `devUrl`, and window `url` are all `https://md.sgnk.ai`; `productName: sgnk-md`, `identifier: ai.sgnk.md` — a remote webview, no local bundle, no offline path | `[measured]` |
| Security config | Enforced CSP on `/[slug]` public renderer only; editor CSP is report-only, commented **"single trusted tenant"** | `[measured]` — tenancy assumption is compiled into the security posture |
| First customer's vault (`md`) | 4,548 `.md` files, **77,549,893 bytes** of markdown; `.git` 247 MB | `[measured]` |
| Avg file | 77,549,893 ÷ 4,548 = **17,052 B** | `[derived]` |

**Platform ceilings that bound every decision below** `[fetched 2026-08-29]`: Vercel function request/response body **4.5 MB**; memory Hobby 2 GB / Pro 4 GB; duration 300 s default. GitHub REST: **5,000 req/hr** per user PAT; GitHub App **installation** minimum 5,000/hr, +50/hr per repo over 20 and +50/hr per user over 20, **hard cap 12,500/hr**; unauthenticated 60/hr (confirmed live: `x-ratelimit-limit: 60`). GitHub files: warn >50 MiB, **block >100 MiB**; repos "ideally <1 GB, <5 GB strongly recommended". Cloudflare R2: **$0.015/GB-mo**, Class A $4.50/M, Class B $0.36/M, **egress free**, 10 GB-month free.

**The single hardest derived number:** a 77.5 MB snapshot is **16.4×** the Vercel 4.5 MB response cap (77,549,893 ÷ 4,718,592) `[derived]`. The current read model cannot serve its own first customer through its own hosting platform.

---

### D-A1. Offline-first and sync — resolving the PRD contradiction

| Option | What it means here | Tradeoff |
|---|---|---|
| **Server-authoritative** | Server holds latest, client posts with `baseSha`, 409 on stale | Built today. Zero-loss only if the client keeps the losing text |
| **CRDT (Yjs / Loro / Automerge)** | Merge is a function of the op graph, not of bytes | Yjs 13.6.32, 33,055,939 downloads 2026-07-29→2026-08-27; loro-crdt 1.15.0, 443,469; **automerge's latest published tag is `2.0.0-alpha.3`** (modified 2026-04-13) at 30,364 — **0.092% of Yjs** `[fetched/derived]` |
| **Git-as-sync** | The repo is the sync protocol; conflicts are hunks | Already 80% built (`merge3`, OCC, `/api/vault/merge`) |

**The contradiction is bigger than PRD D2 states.** D2 frames it as "§4b vs stale Yjs rows." The live contradiction is between **§24 T0's exit condition** — *"two-device offline-edit convergence, zero loss"* — and **§24 T6**, which lists "offline-first" as a *scale* item shipped three tracks later. "Convergence" is a CRDT word; the architecture that must satisfy it in T0 is `merge3` + OCC `[measured]`.

- **Recommendation: git-as-sync, server-authoritative at the commit boundary, and redefine T0's exit condition to "zero bytes lost, every divergence surfaced as a reviewable hunk" — not "automatic convergence."** `[inference]`
- **Anti-recommendation, load-bearing: a CRDT must never own the file's bytes.** The moat sentence is "every untouched byte bit-identical." A CRDT merge result is derived from the operation graph; that property is unassertable across a merge. The PRD's own teardown makes this argument against OpenKnowledge — *"fidelity without a running daemon"* is listed as their **durable, architectural** gap `[PRD §3.2 line 102]`. Adopting a CRDT adopts their gap.
- **The escape hatch that keeps multiplayer alive:** if per-keystroke co-editing is ever required, run it as an **ephemeral session layer whose only output is one splice applied at session end** — the CRDT document is a scratch buffer, never a store of record. This resolves D2's (a)-vs-(b) without deleting the feature.
- **Cost of changing later:** git-as-sync → CRDT is a **rewrite of the write path plus the guarantee** (very high). CRDT → git-as-sync is worse: you must migrate live op-graphs. Choosing git-as-sync now costs the least optionality.
- **Evidence that would flip it:** a measured user cohort where >30% of sessions produce merge3 conflicts on two-device use; or a byte-preserving CRDT with a published proof that untouched regions are bit-stable across merge (none found).

---

### D-A2. Data model and where state lives

**Three stores, and today only 1.5 exist** `[measured]`: (1) the git repo = document truth; (1.5) client IndexedDB drafts + localStorage dirty index; (2) *missing* — a relational store; (3) *missing* — object storage.

| State class | Today | Recommended home |
|---|---|---|
| Document bytes, frontmatter, body | git repo | **unchanged — never move** |
| Spatial/canvas positions | — | JSON Canvas sidecar in-repo (PRD §8 already decides this) |
| Publish slug → path | **inside the file's frontmatter**, uniqueness checked by scanning the whole snapshot in `set-share.ts` `[measured]` | **Postgres** — see D-A11 |
| Identity, tenancy, entitlements, billing, API keys, jobs, audit log | nowhere | **Postgres** |
| Search index, render cache, cert artifacts | rebuilt per cold start | R2 + Postgres |
| Binary attachments | git blobs | **R2** |

- **Recommendation: one Postgres (Neon or Supabase) as the *control plane only*, holding zero document bytes; R2 for attachments and derived artifacts; the repo remains the sole document truth.** `[inference]`
- **Cost of changing later:** low now (there is nothing to migrate); high after the first 100 paying tenants, because publish-slug uniqueness, entitlements and audit logs all become retro-fittable only with downtime.
- **Evidence that would flip it:** if D8 resolves to local-first/E2E, the control plane shrinks to identity + billing and the search/render/cert tiers move to the client entirely.

---

### D-A3. Multi-tenancy

- **Today:** single tenant, hard-coded at three layers — one repo env, one server PAT, one allowlist login, plus a CSP comment asserting it `[measured]`.
- **Options:** (a) tenant = a GitHub App installation on user-selected repos; (b) tenant = a row in Postgres owning N vault connections; (c) tenant = a container/namespace per customer.
- **Recommendation: (b) with (a) as the connector.** `workspace_id` on every row, pooled RLS (PRD §24 T1 already names HQ's pooled-RLS spine as the lift), leading composite index on `workspace_id`. **Never** a per-tenant container — a solo founder cannot operate N runtimes.
- **Anti-recommendation:** do not let the GitHub installation *be* the tenant identity. Users will connect two repos, transfer a repo, or uninstall; identity must survive all three.
- **Cost of changing later: the highest on this page.** Retrofitting `workspace_id` after launch touches every table, every query, every route.
- **Evidence that would flip it:** an enterprise deal requiring data isolation at the infrastructure level — then a dedicated-instance tier is priced separately, not the default.

---

### D-A4. Storage — git repo vs object store vs both

- **Recommendation: both, with a strict split.** Git holds `.md` + small sidecars. R2 holds attachments >1 MB, export artifacts, cert JSON sidecars, and search index blobs.
- **Rationale `[fetched]`:** GitHub blocks files >100 MiB and asks repos to stay under 1 GB; a vault with images will cross that. R2 egress is free and storage is $0.015/GB-mo, so 100 tenants × 1 GB = $1.50/mo `[derived: 100 × 0.015]`.
- **Anti-recommendation: do not put attachments in the repo "for portability."** It converts a 77 MB text vault into a multi-GB repo and makes every clone and zipball worse for the user who wanted portability.
- **Cost of changing later:** medium — a one-time rewrite pass per vault, mechanical.
- **Evidence that would flip it:** a measured cohort whose vaults are >95% text under 5 MB total — then R2 is premature.

---

### D-A5. Search architecture at scale

- **Today:** MiniSearch 7.2.0 (published 2025-09-16, 9,725,309 downloads last month `[fetched]`), index rebuilt from the whole zipball, cached in a module-level `Map` `[measured]`. PRD §24 records **MiniSearch CJK recall 18.1%** `[measured, PRD]`.
- **The scaling wall `[derived]`:** 77.5 MB parsed per cold start, inside a 2–4 GB function, and the snapshot response is 16.4× the 4.5 MB body cap.
- **Recommendation, in this order:** (1) **stop shipping the snapshot** — serve tree metadata and fetch file bodies on demand; (2) **Postgres full-text (`tsvector`) plus trigram** as the server tier — it reuses the control plane, costs no new service, and gives one operator one thing to run; (3) keep MiniSearch **client-side only**, over the open vault, as the instant-feedback tier; (4) for CJK, a bigram tokenizer — not a dictionary segmenter.
- **Anti-recommendation: do not adopt Meilisearch/Typesense/Elastic before 1,000 tenants.** A solo founder adding a stateful search cluster adds a second on-call surface for a query volume Postgres will not notice.
- **Cost of changing later:** low. Search is the most swappable subsystem here — the index is derived, never authoritative.
- **Evidence that would flip it:** p95 search latency >400 ms on Postgres FTS at real corpus size, or a measured requirement for typo-tolerant instant search that `pg_trgm` cannot hit.

---

### D-A6. Real-time collaboration

- **Recommendation: presence and awareness in v1 (who is in the file, where their cursor is); no shared text buffer.** Presence has no bytes at stake. Ship it over a single WebSocket/SSE channel; do not run a Yjs document server.
- **Anti-recommendation:** no Google-Docs-style co-editing before teams revenue exists — it is the single feature most likely to force the CRDT decision the moat forbids (D-A1).
- **Cost of changing later:** low if presence is kept strictly non-authoritative; catastrophic if a shared buffer is added and later removed.
- **Evidence that would flip it:** paying teams churning explicitly on simultaneous editing, with the alternative (suggest-mode hunks, PRD §12) tried and rejected.

---

### D-A7. API surface and versioning

- **Today:** 26 unversioned route handlers, session-authenticated, no public contract `[measured]`. But §24 T3 ships an **MCP server**, `land()`, and **cert distribution via npx / GitHub Action** — all external consumers.
- **Recommendation: two surfaces, different rules.** (i) `/api/**` stays unversioned, private, cookie-only, free to break. (ii) A new **`/v1/**`** public surface — token-authenticated, additive-only, one version live at a time, deprecation announced at least 6 months out. `land()` and MCP tools live only in (ii).
- **The third API nobody has versioned: the frontmatter key vocabulary (§8.2).** It is called "the API" in the PRD's own words and has no version key. **Recommendation: reserve `fm: 1` now**, read tolerantly, never require it.
- **Cost of changing later:** versioning after third-party MCP clients exist means either breaking them or supporting an unversioned contract forever.
- **Evidence that would flip it:** none — this is nearly free today and expensive on any later day.

---

### D-A8. Background jobs

- **Today: none.** Every route is synchronous; `/api/export/pdf` runs headless chromium in-process (`serverExternalPackages`, `outputFileTracingIncludes` `[measured]`).
- **Work that must move off the request path:** index builds, `mdmax cert` runs, ChatGPT/Claude ZIP importers, PDF/site rendering, CDN invalidation on unpublish, staleness detection, scheduled publish.
- **Recommendation: a `jobs` table in Postgres + a cron-triggered worker, single queue, at-least-once, idempotency key = `(tenant, kind, input_sha)`.** Not a broker.
- **Anti-recommendation: do not run PDF/chromium in the same function as the editor API.** It is the memory-heaviest thing in the repo sharing a limit with everything else.
- **Cost of changing later:** medium; job semantics are contained.
- **Evidence that would flip it:** if importers stay under 300 s at p99, cron-only may suffice without a queue for a year.

---

### D-A9. Caching

- **Today:** module-level `Map` capped at 3 snapshots, per function instance, invalidated by `clear()` after commit `[measured]`. In serverless this is a per-instance coincidence, not a cache.
- **Recommendation: content-addressed, three tiers.** (1) Browser/IndexedDB keyed by blob sha — files are immutable by sha, so cache-forever is correct. (2) A shared KV/Redis keyed by `sha` for parsed metadata. (3) CDN only for published pages, with **explicit purge on unpublish** — PRD §28.3 already names a fixed unpublish-revocation defect (`d50a6b2`), so this class is live here `[PRD, measured]`.
- **Anti-recommendation: never cache a *path* — only a *sha*.** Path-keyed caching is how a revoked publish stays live.
- **Cost of changing later:** low.

---

### D-A10. Desktop / Tauri

- **Today: the desktop app is not a desktop app.** All three URL fields point at `https://md.sgnk.ai`; it is a chrome-less browser window, still named `sgnk-md`/`ai.sgnk.md` `[measured]`. It cannot work offline, cannot read a local folder, and is branded for the wrong product.
- **Options:** (a) keep the remote webview; (b) bundle the frontend locally and talk to the API; (c) full local-first with a local vault on the filesystem and the Rust side owning file I/O.
- **Recommendation: (c), but only after D-A1 lands and only as the *paid* desktop tier.** (c) is the only version that makes the product's own core claim ("the file is the truth, on your disk") literally true, and it is the natural home for a local MDMAX binary. Rename the bundle before any external build ships.
- **Anti-recommendation: do not ship (a) to customers.** A webview wrapper that dies without network, on a product sold on file ownership, is a trust defect, not a shortcut.
- **Cost of changing later:** (a)→(c) is a near-total desktop rewrite but touches no server code. Deferring is cheap; shipping (a) publicly is not.
- **Evidence that would flip it:** if <10% of trial users open the desktop app, drop it and keep the PWA.

---

### D-A11. Publish/share state — an unresolved contradiction the PRD does not list

- **Measured:** `set-share.ts` writes the slug into the note's frontmatter and enforces uniqueness by scanning the whole snapshot's `listShares()` `[measured]`. **§28.3 requires "a server-side authorisation check on every request."**
- **Conflict:** if publish state is a file byte, then authorisation requires reading the vault on every anonymous page hit — O(vault) per request, and revocation depends on a git write propagating.
- **Recommendation: dual-write with the DB authoritative for *access*, the file authoritative for *intent*.** The frontmatter keeps `share: <slug>` (portable, greppable, survives export); a Postgres row is the thing the request path checks and the thing revocation deletes. Divergence resolves toward **deny**.
- **Cost of changing later:** low today; after the first public-page incident, it is a security postmortem.
- **Evidence that would flip it:** if publishing stays single-tenant and hand-operated, the file scan is adequate — but it does not survive D-A3.

---

### D-A12. Mobile

- **Recommendation: PWA only through v1** — the codebase already registers one (`PWARegister` `[measured]`), and the mobile job-to-be-done is capture + read, not authoring.
- **Anti-recommendation: no React Native / Capacitor app before revenue.** It is a second build, store, review cycle and crash surface for one operator, and the App Store IAP question collides with the merchant-of-record decision (D10).
- **Cost of changing later:** low — a native shell can wrap the same API at any time.
- **Evidence that would flip it:** measured share-sheet capture demand, or iOS Safari blocking a needed capability.

---

### D-A13. Migrations — two kinds, one specified

| Kind | Status | Recommendation |
|---|---|---|
| App schema (Postgres) | does not exist yet | Plain SQL files, forward-only, RLS co-located in the same migration; apply gated by human approval |
| **Vault content (frontmatter vocabulary v1→v2)** | **completely unspecified** | **Never batch-migrate user files.** Read tolerantly forever; write the new shape only on a file the user already touched; any bulk change arrives as **reviewable hunks in the review surface** — PRD §6 principle 6, "one grammar for every change" |

- **Cost of changing later:** a single silent bulk rewrite of customer vaults would refute the product's central claim in one release. This is the migration policy that must be written down *before* the vocabulary ships, not after.
- **Evidence that would flip it:** none identified.

---

### D-A14. The MDMAX ↔ app boundary — the wiring spec

- **Measured:** 2 product files, 1 symbol (`decodeStrict`), 1 of 13 mdmax files. `certify.ts`, `verdict.ts`, `constructs.ts`, `fold.ts`, `offsets.ts`, `placement.ts`, `targets.ts`, `slug.ts`, `normalize.ts`, `frontmatter-prepass.ts`, `bench.ts` are imported by **zero** product files.
- **Recommendation: MDMAX becomes a versioned internal package with exactly four seams, in this order.** `[inference]`

| # | Seam | Call site | Contract | Blocked by |
|---|---|---|---|---|
| 1 | **Ingress gate** | already live — `get-snapshot`, `search-index` | `decodeStrict` refuses, never repairs | done |
| 2 | **Write gate** | `repository/application/commit-changes.ts` and `share/infrastructure/share-writer.ts` | every write passes `shape-gate` + `placement` before the blob is created; a refusal is a 4xx with a reason string, never a silent pass | NF-1..NF-4 (83% publish-refusals, PRD §24) |
| 3 | **Splice engine** | replace `share/domain/splice-frontmatter.ts`'s single-key scanner | one splice implementation for kanban drag, calendar drag, `land()`, and share — `SAFE_KEY` widened per NF-4 (`date created` in 812/957 files of one vault) | NF-4 design work |
| 4 | **Certificate** | a background job (D-A8) writing a JSON sidecar to R2, surfaced in Doc Health | `certify.ts` never throws; artifact never enters the `.md` (`cert-contract.ts`) | D-A8 |

- **The boundary rule:** MDMAX exports **pure functions over bytes** and imports nothing from `src/modules/*` or `src/config`. It is already positioned to satisfy this — `eslint-plugin-boundaries` plus `clean-architecture-report.mjs` (with `MIN_SCANNED_FILES=50` so the gate cannot pass by going blind) enforce the direction `[measured]`.
- **Anti-recommendation: do not wire seam 2 before NF-1/NF-3 land.** At the measured refusal rate the write gate would reject 83% of foreign vaults' publishes — an availability incident wearing a correctness costume. This is the same ordering §29 states for marketing claims, applied to code.
- **Cost of changing later:** rises sharply. Every week the product ships a second write path is a week where seam 3 has two implementations to reconcile — `splice-frontmatter.ts` is already that second implementation.
- **Evidence that would flip it:** if `fold@1` re-measured over the pinned corpus shows the folded divergence is materially worse than the prototype's 4.28%, seam 4 ships as advisory-only rather than as a gate.

---

### D-A15. Under-specified items that need a decision before code

| # | Item | Recommendation | Cost of deferring |
|---|---|---|---|
| **A15.1** | **Dual identity** — NextAuth v5 *and* a Firebase gateway both live `[measured]`, with Firestore imported and unused | **Collapse to one.** Keep NextAuth + the GitHub App; delete the Firebase dependency (it also removes a client bundle and a second vendor) | Two auth paths = two session-fixation surfaces for one operator |
| **A15.2** | **Compute platform** | Stay on Vercel for the app; move chromium/PDF and jobs to a separate function or a container. Do **not** design anything that returns >4.5 MB | The 16.4× overrun is already reachable with the first real vault |
| **A15.3** | **GitHub rate-limit budget** (D11's hidden cost) | A GitHub App installation caps at **12,500 req/hr** `[fetched]`. Every per-request `getFile`/`getBlobSha` spends from it. **Recommendation: a per-tenant token bucket plus sha-keyed caching (D-A9), sized before launch** | Silent 403s under load, attributed to "GitHub being slow" |
| **A15.4** | **BYO-key custody boundary** (D9's architecture half) | If keys are server-side, they live in a **separate store with separate credentials from the document store** (§28.1). If client-side, server-side agents are impossible — say it in the pricing table, not a footnote | Co-locating them makes one breach two breaches |
| **A15.5** | **Idempotency on writes** | Extend the existing OCC (`baseSha` → 409) with a client-supplied `Idempotency-Key` on `/api/commit` | A retried commit on a flaky mobile network duplicates a note |
| **A15.6** | **CI as an architectural gate, not a task** | `typecheck → lint → test → build → arch (with its file floor) → corpus oracle → foreign-corpus suite`, on every push, before hire #2 (§29) | Every gate in §25 is currently opt-in and locally run |
| **A15.7** | **Observability** | Error tracking + one structured request log with `workspace_id` and `correlation_id` from day one; it is the only way a solo on-call reconstructs an incident | Retrofitting correlation IDs after launch means the first incident is unreconstructable |