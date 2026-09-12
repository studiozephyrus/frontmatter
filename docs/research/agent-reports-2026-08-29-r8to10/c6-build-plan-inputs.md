### 0. Baseline — what is actually on disk, 2026-08-29

| Fact | Value | Tag |
|---|---|---|
| `src/` TS+TSX files / lines | 226 / 25,407 | [measured] |
| Modules under `src/modules/` | 13 + README | [measured] |
| Test files under `test/` (excl. node_modules) | 98; `it(`/`test(` call sites = 934 | [measured] |
| API routes / pages | 26 `route.ts`, 4 `page.tsx` | [measured] |
| `.github/` | **absent** | [measured] |
| `specs/harness/` | **all 4 scripts md's `ci.yml` invokes exist** (`clean-architecture-report`, `import-boundary-report`, `server-folder-blocklist`, plus `analyze`, `route-inventory`) | [measured] |
| `npm run budget` | `echo 'No bundle budget configured yet — skipping'` — a stub that will pass CI green while blind | [measured] |
| md's `ci.yml` | 65 lines, `e2e` job gated `if: false`, no Playwright in frontmatter's `package.json` | [measured] |
| Commits on `engine/plan-and-diagnostics` | 37 ahead of `main`, spanning 2026-07-29 → 2026-08-29 across **8 distinct active days of 32 calendar days = 25.0%** | [measured] [derived] |
| Pinned home corpus | `docs/engine/research/corpus-manifest.json`: 1,084 files / 25,548,765 bytes / 3 roots, every file sha256-pinned | [measured] |
| Foreign corpus | 5 vault clones **survive only in the session `$TMPDIR` scratchpad, 505 MB**, 8,454 `.md` across the 5 kept vaults | [measured] |
| All 5 foreign vault repos reachable | `api.github.com/repos/...` → 200 ×5 | [fetched] |

**Three PRD claims this pass contradicts — record both, they disagree:**

1. §7.2 and §24 say *"`src/modules/mdmax/` is imported by zero product files."* **Refuted at import level:** `src/modules/vault/application/get-snapshot.ts:13` and `src/modules/vault/infrastructure/search-index.ts:16` both `import { decodeStrict } from "@/modules/mdmax/domain/shape-gate"`. **True at capability level:** 12 of 13 mdmax files (`certify`, `verdict`, `fold`, `constructs`, `cert-contract`, `targets`, `bench`, `offsets`, `placement`, `slug`, `normalize`, `frontmatter-prepass`) have **0** product importers. [measured]
2. §7.1 says mdmax has **11 tests**; `test/mdmax/` holds **10** `*.test.ts` + a `fixtures/` dir (1 golden JSON). [measured]
3. Foreign corpus: `h2-foreign-corpus.md` reports 8,452 md / oldwinter 959; the surviving clones count 8,454 / oldwinter 961. Delta **+2**. [measured] — the clone has drifted from the report, exactly the class §25 "corpus integrity" exists to catch.
4. §30 D3: `mdmax` on npm → **HTTP 404, unregistered**. `frontmatter` on npm → **taken, `dist-tags.latest = 0.0.3`**. `gray-matter` last-month downloads = **35,782,970** (2026-07-29→2026-08-27). [fetched]

### 1. Estimating basis — stated, then arithmetic

**Assumption (explicit):** PRD §29's *"~1 substantial shipped surface per 2–3 weeks alongside support, billing and compliance"* is taken as the definition of one **XL** unit = **14–21 calendar days, midpoint 17.5**. [inference]

Points ladder: `XS=1, S=2, M=4, L=8, XL=16`. Conversion **1 pt = 17.5 ÷ 16 = 1.09375 calendar days** [derived]. Calendar days, not working days — the 25.0% active-day density measured on the branch is *inside* this rate, not a multiplier on top of it.

**The two bases disagree and I do not reconcile them:** §29's rate claims to already absorb support/billing/compliance overhead; but §29 also lists legal/MoR/EU-rep as separate *founder-serial* items. Reading A prices legal at zero incremental; Reading B prices it as units. Both are carried below.

### 2. Work breakdown

**Lane R0 — engine truth (declared first lane). 58 pts.**

| ID | Deliverable | Size | Kind | Depends on |
|---|---|---|---|---|
| R0.1 | **NF-1** — treat a `-` item at column 0 as a continuation of the preceding key. Site: `splice-frontmatter.ts` L197–200, the `else if (text !== '' && !indented && !/^#/)` → `return src` branch [measured] | M | engine | — |
| R0.2 | **NF-2** — flow-seq closing `]` at column 0 (1 wild file) | S | engine | R0.1 |
| R0.3 | **NF-3** — `FM_OPEN = /^---[ \t]*(\r?\n)/` misses bare `---\r`; set-only prepends a second block. **Ship the red-proof first: make the set-only assertion fail against unfixed code** | M | engine | — |
| R0.4 | **NF-4** — quoted-key `SAFE_KEY`. Blocked on a *decision*: what key equality means for NFC vs NFD `café`, per the module's own comment [measured] | L | engine | founder decision |
| R0.5 | Port md `ci.yml` → typecheck·lint·test·build·arch. Near-mechanical: all 4 harness scripts present | S | infra | — |
| R0.6 | Foreign-corpus standing gate: vendor + sha256-pin the 5 vaults **out of `$TMPDIR` before it is reaped**, add runner, wire into CI | L | infra | R0.5 |
| R0.7 | Six construct-detector defects (gate the AEO linter and kill-condition 4) | M | engine | — |
| R0.8 | CJK: `countWords` (`EditorPane.tsx:31`) segmenter swap + MiniSearch tokenizer | M | engine | D17 |
| R0.9 | **Wire MDMAX in** — 12 of 13 files currently unreached by product code | L | engine+product | R0.1–R0.4 |
| R0.10 | Reconcile `globals.css` with the canonical design system (§16.3) | M | product | — |
| R0.11 | mdmax audit Tier 3/4 residue (Tier 1+2 landed `f47555f`…`9e84628`) | M | engine | — |
| R0.12 | Replace the `npm run budget` stub with a real bundle budget | S | infra | R0.5 |
| R0.13 | Close D1–D17 (§30). D5 PAT rotation is **today**, not a milestone | M | founder | — |

**Lane T0 — trust surface. 32 pts.** sync chip `S` · conflict inbox `M` · named-version history `M` · since-you-last-opened banner `S` (two-sha diff) · background auto-sync `L` · local history + 10s merge window + section-level restore `L` · two-device convergence rig `M`. Existing: `/api/vault/history`, `get-history.ts`, `HistoryModal.tsx`, `list-conflicts.ts` (**slug**-conflicts, not edit-conflicts) [measured].

**Lane T1 — tenancy + launch. 42 pts.** identity + multi-tenancy `XL` · GitHub App `L` (D11; zero `octokit` in `package.json` [measured]) · multi-vault `M` · mobile pass `M` · HOME.md `M` · quick capture `S` · "Open in frontmatter" plugin `M`.

**Lane T3 — AI protocol. 44 pts v1 subset.** MCP server + `land()` `L` (zero `modelcontextprotocol` refs in `src/` [measured]) · review loop `L` · provenance + implicit telemetry `M` · differ `M` · cert distribution ×4 channels `L` · citation-gated answers `M` · session continuity `M` · publish session-interchange format `M`. **ACP client `L` deferred to T6.**

**Lane T4 — capture funnel. 20 pts.** chat-side skill + paste inbox `M` · ChatGPT/Claude ZIP importers `L` · promotion loop `M` · retro-capture `M`.

**Lane T2 — renders. 42 pts, OUT of v1.** `components.tsx:133` regex `XS` · delete `editable-table.tsx` `XS` · kanban read-only `M` · kanban bidirectional + zero-dirty oracle `L` · decision `M` · calendar `M` · corkboard `M` · compile profiles `L` · publish-with-profiles `M` · `mdmap check` CLI `M`.

**Lane INFRA/LEGAL — 25 pts.** MoR select+integrate `M` (before first *paid* signup) · auth buy `S` · error tracking + uptime `S` · R2 + CDN `S` · EU Art. 27 rep `S` (before first EU *free* signup) · CA + lawyer engagement `M` · ToS/DPDP/privacy `L` · PAT rotation `XS`.

**Lane GTM — 34 pts.** Land Markex's uncommitted tree `M` (RULE-2/3 gated) · LinkedIn Documents-API probe `S` · post-as-document `L` · in-product launch calendar `M` · 20 posts `XL`.

### 3. Critical path

`R0.3 → R0.1 → R0.2 → R0.4 → R0.9 → T0(auto-sync → local history → convergence rig) → T1(identity → GitHub App → HOME.md) → T3(MCP+land() → review loop → cert distribution) → T4(importers → promotion loop) → public v1`

- **R0.5 (CI) is not on the path but gates everything downstream's credibility** — run it in the first 48h so every later unit lands under a gate.
- **R0.6 (foreign corpus) is on the path in practice**: NF-1's DoD is a corpus number, and the corpus lives in a temp dir.
- **T2 is off the path entirely.** Its only path-touching items are the two `XS` cleanups.
- **Legal gates are date-gates, not effort-gates**: EU rep must exist before the first EU free signup; MoR before the first paid signup; CI before hire #2.
- **R0.4 is blocked by a design decision, not by code** — it is the one engine unit an agent cannot start.

### 4. Milestones with a testable definition of done

| M | Gate | Definition of done — executable, no adjectives |
|---|---|---|
| **M0** | CI live | A PR to `main` runs typecheck·lint·test·build·arch and **fails** on a deliberately broken commit. `npm run budget` asserts a real byte ceiling, not `echo`. Proof required: one red run before the first green. |
| **M1** | Engine truth | `rt-runner` over the pinned 5-vault corpus reports **refused ≤ 2 of 7,959** (from 6,614), **changed = 0, threw = 0**. NF-3 red-proof: the set-only assertion **fails on `HEAD~1`** and passes on `HEAD`. `date created` set + rename succeed on ≥812 oldwinter files. Corpus sha256 manifest re-hashes clean at gate time. |
| **M2** | MDMAX wired | ≥8 of the 12 currently-unreached mdmax files have ≥1 product importer; `npx mdmax cert <file> --fail-on=BROKEN` exits 1 on a seeded BROKEN fixture inside CI. |
| **M3** | Trust surface | Two devices, both offline, both edit the same file, both reconnect: **byte-for-byte convergence, zero loss, watched by a human, recorded**. Section-level restore returns the file to a prior sha with every untouched byte identical. |
| **M4** | Tenancy | A second GitHub account, never used in development, signs in via the **GitHub App** (not OAuth `repo`), connects one repo, edits, commits — with no founder intervention and no shared secret. |
| **M5** | Agent protocol | An external agent edits a real vault through `land()`; **every change appears in the review surface with a diff and is rejectable**; a rejected change leaves the file byte-identical to pre-edit. |
| **M6** | Capture | One ChatGPT export ZIP → durable documents in one click, and the **verification report enumerates every dropped construct by count** (the report is the demo). |
| **M7** | v1 public | M0–M6 green + MoR live + EU rep appointed + ToS published + one paying non-founder account. |

**Anti-DoD (reject these if proposed):** "kanban feels good"; "import works"; "fidelity is high"; any DoD whose evidence is a screenshot; any DoD satisfied by a `grep` over source (§25: a check that greps source is a proxy and must be labelled one).

### 5. Parallelisation split

| AI-agent parallel (disjoint artifacts, LR#20) | Founder-serial (irreducible) |
|---|---|
| R0.1/R0.2 walk change + its fixture set | R0.4 key-equality decision (NFC/NFD semantics) |
| R0.6 corpus vendoring, hashing, runner | D1–D17, all 17 (§30) |
| R0.7 six construct detectors (one agent each) | D5 PAT rotation — **only the founder can do this** |
| R0.8 CJK segmenter + tokenizer | GitHub App registration, secrets, callback |
| R0.10 CSS reconciliation | MoR account, CA, lawyer, EU rep |
| R0.11 Tier 3/4 residue | M3 two-device convergence *observation* |
| T2's two `XS` cleanups | The 20 posts (voice is the asset) |
| Test authoring for every unit above | Accepting/rejecting every agent diff |
| Doc/readme sync | Any RULE-2 op (Markex landing, deploys) |

**Hard rule:** agents produce proposals; the founder gates merges (LR#21/#22). **Capture `git rev-parse HEAD` before and after every agent workflow** — the prohibition on committing is advisory, never the gate (§26.3, 5 unauthored commits observed once).

**Do not parallelise:** R0.1 and R0.4 against the same file — both touch `splice-frontmatter.ts`'s key walk. **Do not** fan out T0's sync work; it is one creative target with implicit architecture decisions.

### 6. Calendar

At 1 pt = 1.09375 calendar days, from 2026-08-29 [derived]:

| Milestone | Cumulative pts | Days | Date | Weekday |
|---|---|---|---|---|
| R0 complete | 58 | 63 | **2026-10-31** | Sat |
| + T0 | 90 | 98 | **2026-12-05** | Sat |
| + T1 | 132 | 144 | **2027-01-20** | Wed |
| + T3 (v1 subset) | 176 | 192 | **2027-03-09** | Tue |
| + T4 = **v1 code-complete (Reading A)** | 196 | 214 | **2027-03-31** | Wed |
| + legal/infra = **v1 shippable (Reading B)** | 221 | 242 | **2027-04-28** | Wed |
| + full GTM (20 posts) | 255 | 279 | **2027-06-04** | Fri |

R0 alone = **9.06 weeks**, consistent with §29's "multi-month R0 lane before any customer-visible feature". Reading A and Reading B differ by **28 days**; the spread is entirely legal/infra double-counting and is not resolvable from the PRD.

### 7. Top 10 estimate-killers, each with an early-warning signal

| # | Risk | Early-warning signal (check weekly) |
|---|---|---|
| 1 | **NF-1's "recovers 99.98%" is an inference from buckets, not a measured fix result.** The bucketer reproduced counts; it did not run the patched writer | First patched run over the 5 vaults refuses **>10** files. If the residual is >2, NF-1 is not one bug |
| 2 | **The foreign corpus lives in a session `$TMPDIR` (505 MB) and will be reaped.** Re-cloning gives *different bytes* — the clone already drifted +2 files from the report | Any corpus run whose file count ≠ the pinned manifest count. Fix cost is `L`, not `S`, once the temp dir is gone |
| 3 | **R0.4 is a design task masquerading as a regex** (PRD says so; the module's own comment says so). Unicode key equality has no cheap answer | Two weeks pass with no written decision on NFC/NFD equality. Symptom: the branch has `SAFE_KEY` widened but no equality test |
| 4 | **"Wire MDMAX in" is 12 files with zero call sites** — an integration surface, not a wiring task. `certify`/`verdict`/`fold` each need a product boundary invented | Week 2 of R0.9 still has 0 new product importers. Count them: `grep -rl "mdmax/" src \| grep -v '^src/modules/mdmax'` |
| 5 | **CI's first green will be false.** `npm run budget` is `echo`; `e2e` is `if: false`; four gates in this repo already reported green while blind (§25) | CI passes on a commit that deliberately breaks a gate. **Require one red run before trusting any green** |
| 6 | **Measured cadence is bursty: 8 active days in 32 (25.0%).** A 2–3 week estimate assumes work spread evenly; the record shows 8 commits on one day and 26 empty days | Two consecutive calendar weeks with 0 commits. §26.3 names this as the burnout signal |
| 7 | **T1 identity + multi-tenancy is the only `XL` in the plan and is scored from analogy** (HQ pooled-RLS + CareerOS entitlements), not from this repo | Any week where T1 produces schema churn rather than a signed-in second account |
| 8 | **17 open decisions gate work already scheduled.** D8 (do documents leave the device), D9 (BYO vs platform key), D11 (App vs OAuth), D14 (agent write authority), D17 (CJK) each re-scope a whole lane | Any lane started before its gating D is written down. D8 alone can delete T3 |
| 9 | **Legal lead times are vendor-clock, not founder-clock.** EU Art. 27 rep cannot be self-appointed from India; MoR must precede the first paid signup; the CA/lawyer engagement is other people's calendars | Free-tier reachable from the EU with no Art. 27 rep appointed. This is a *legal* trip, not a slip |
| 10 | **The name is unresolved and `frontmatter` is taken on npm** (`0.0.3`) while `mdmax` is 404 [fetched]; `gray-matter` at 35,782,970/month makes the term generic | Any brand spend, domain purchase, or public post using bare "Frontmatter" before D3 is closed with counsel |

### 8. Anti-recommendations — do not do these

- **Do not publish any fidelity number before NF-1 and NF-3 land** (§29, D16). The current measured aggregate is 83.10% refusal; publishing before the fix converts a bug into a false public claim.
- **Do not start T2 renders before M2.** Kanban write-back without the zero-dirty oracle is exactly the silent-rewrite failure the engine exists to prevent.
- **Do not treat the 2 existing `decodeStrict` imports as "MDMAX is wired."** It is one utility from one of 13 files.
- **Do not hire engineer #2 before M0.** §29 is explicit: onboarding cost exceeds output without CI.
- **Do not build auth, billing tax, error tracking, or CDN.** §29 classes all four as BUY.
- **Do not run a corpus gate against re-cloned vaults without re-pinning** — the +2 drift already observed is the exact failure §25 "corpus integrity" catches.
- **Do not let an agent hold write authority in T3 until D14 is decided** — the lethal-trifecta exposure is the whole flagship demo and the whole liability.
- **Do not ship publishing in v1** (D15) unless the editor alone cannot carry the price; it doubles the product and adds takedown/abuse obligations.
- **Do not assert equality-pinned pass counts in the new CI** (§25, LR#66) — assert `passes ≥ N and failures == 0`, or adding coverage will read as a regression.

**Read-only confirmation: no file was created, edited, or deleted, and no git or otherwise mutating command was run in this session.**