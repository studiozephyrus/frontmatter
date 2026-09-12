> **SUPERSEDED — do not build from this file.** It is kept for provenance only.
> The current record is `docs/FRONTMATTER-PRD-v2-2026-08-29.md`. See `docs/MAP.md`.

# frontmatter — Build Plan

**v1.0 · 2026-08-29 · owner: Sagnik Mitra**
**Companion to `docs/FRONTMATTER-PRD-2026-08-29.md`. The PRD says what and why. This says in what order, proven how.**

---

## 0. How to use this

This plan is executed through `specs/`, not through this document. A lane is not "done" because it feels done; it is done when its spec reaches `state: verified`, which the harness will only write after every `verify:` command exits 0 **and** a red proof exists that fails against the unfixed code.

```bash
npm run spec      # the contract gate
npm run corpus    # the fidelity corpus, 8,513 files, byte-pinned
npm run verify    # typecheck → lint → test → build → arch → spec
```

**Three rules that govern every unit below.**

1. **Red proof before green.** A test on a rare fault proves nothing until it fails against the unfixed code. If you cannot make it fail, the test does not cover the bug — record that in the spec's `## Open` rather than reporting a pass.
2. **Agents propose, the founder merges.** Capture `git rev-parse HEAD` before and after every agent run and reconcile the delta. The instruction not to commit is advisory; the reconciliation is the gate.
3. **Re-derive every number at write time.** The PRD's §32 exists because we did not.

---

## 1. Decisions that unblock everything

These were open. They are now answered with reasoning, and each has an "evidence that would flip it" so the answer stays falsifiable.

| # | Decision | Answer | Why it holds |
|---|---|---|---|
| **A1** | Sync engine | **Git-as-sync, server-authoritative at the commit boundary.** ~80% already built: `merge3`, optimistic concurrency, `/api/vault/merge` | **A CRDT must never own the file's bytes.** "Every untouched byte bit-identical" is unassertable across a CRDT merge, because the result derives from the operation graph, not the bytes. Adopting a CRDT adopts precisely the architectural gap we cite against OpenKnowledge. If per-keystroke co-editing is ever required, run it as an ephemeral session whose only output is **one splice at session end** — a scratch buffer, never a store of record |
| **A1b** | T0's exit condition | **Rewritten.** From "two-device convergence" to **"zero bytes lost, every divergence surfaced as a reviewable hunk"** | "Convergence" is a CRDT word; the architecture that must satisfy it is merge3 + OCC. The PRD promised a property its own chosen architecture does not provide. This is a new contradiction, not the one D2 named |
| **A2** | Where state lives | Git repo = document truth, never moves. **One Postgres as control plane only, holding zero document bytes.** R2 for attachments >1 MB and derived artifacts | Publish-slug uniqueness currently works by scanning the whole snapshot. Identity, entitlements, billing, audit have no home at all |
| **A3** | Multi-tenancy | `workspace_id` on every row, pooled RLS. GitHub App installation is the **connector**, never the tenant identity | Users connect two repos, transfer repos, and uninstall. Identity must survive all three. **Retrofitting `workspace_id` after launch is the highest-cost change on the board** |
| **A5** | Search | Stop shipping the whole snapshot → Postgres FTS + trigram as the server tier → MiniSearch client-side only. CJK via a **bigram tokenizer**, not a dictionary segmenter | 77.5 MB parsed per cold start, and the snapshot response is 16.4× the platform body cap. No stateful search cluster before 1,000 tenants |
| **A14** | MDMAX wiring | **Four seams, in order:** ingress gate (live) → write gate → splice engine → certificate. MDMAX exports pure functions over bytes and imports nothing from `src/modules` | Currently 1 symbol from 1 of 13 files is used. **Do not wire the write gate before NF-1/NF-3** — at the measured refusal rate it would reject 83% of foreign publishes, an availability incident wearing a correctness costume |
| **R-carrier** | How a render profile is written on disk | **Callout `> [!kind]` for prose, fenced code for opaque data. Nothing else.** `:::` accepted on input, normalised away on save | Measured across four engines plus GitHub live: an unclosed fence swallows the rest of the document (CommonMark §4.5, spec-mandated); a callout **has no closing marker to lose**. This corrects PRD §9 |
| **A15.1** | Dual identity | **Collapse to one.** Keep NextAuth + the GitHub App; delete Firebase | Two auth paths is two session-fixation surfaces for one operator, plus an unused Firestore import in the client bundle |

**Still yours to decide, and each re-scopes a lane:** D3 the name (see §7), D8 do documents leave the device, D9 BYO vs platform key, D14 does the agent get write authority, D15 publishing in v1 or v2, D17 CJK in or out.

---

## 2. Work breakdown

Points: `XS=1 · S=2 · M=4 · L=8 · XL=16`. One XL ≈ one substantial shipped surface ≈ 14–21 calendar days solo, so **1 pt ≈ 1.09 calendar days**. Calendar days, not working days — the measured 25% active-day density on this branch is *inside* that rate, not a multiplier on it.

### R0 — engine truth · 58 pts · the declared first lane

| ID | Deliverable | Size | Spec |
|---|---|---|---|
| R0.1 | **NF-1** — a `-` item at column 0 is a continuation of the preceding key | M | `engine/nf-001-zero-indent-sequence` |
| R0.2 | NF-2 — flow-seq closing `]` at column 0 | S | — |
| R0.3 | **NF-3** — `FM_OPEN` misses a bare `---\r`; a lone set **prepends a second frontmatter block**. Set-destructive and invisible to a round-trip oracle. **Red proof first** | M | to write |
| R0.4 | NF-4 — quoted-key `SAFE_KEY`. **Blocked on a decision**, not on code: what key equality means for NFC vs NFD | L | founder |
| R0.5 | CI. Port md's `ci.yml`; all four harness scripts already exist | S | `platform/ci` |
| R0.6 | Foreign-corpus standing gate | — | **DONE** — 8,513 files pinned, verify red-proofed |
| R0.7 | Six construct-detector defects | M | — |
| R0.8 | CJK — `countWords` segmenter, MiniSearch bigram tokenizer | M | gated on D17 |
| R0.9 | Wire MDMAX seams 1–3 | L | `engine/mdmax-seams` |
| R0.10 | Reconcile `globals.css` with the design system | M | — |
| R0.11 | mdmax audit Tier 3/4 residue | M | — |
| R0.12 | Replace the `npm run budget` stub with a real byte ceiling | S | — |
| R0.13 | Close the open decisions. **D5 PAT rotation is today, not a milestone** | M | founder |

### The rest

| Lane | Pts | Contents |
|---|---|---|
| **T0 Trust surface** | 32 | sync chip `S` · conflict inbox `M` · named-version history `M` · since-you-last-opened banner `S` · background auto-sync `L` · local history + section restore `L` · the two-device rig `M` |
| **T1 Tenancy + launch** | 42 | identity + multi-tenancy `XL` · GitHub App `L` · multi-vault `M` · mobile pass `M` · HOME.md `M` · quick capture `S` · companion plugin `M` |
| **T3 AI protocol** | 44 | MCP server + `land()` `L` · review loop `L` · provenance + implicit telemetry `M` · differ `M` · cert distribution `L` · citation-gated answers `M` · session continuity `M` · publish the session format `M` |
| **T4 Capture** | 20 | chat-side skill + paste inbox `M` · ChatGPT/Claude importers `L` · promotion loop `M` · retro-capture `M` |
| **T2 Renders** | 42 | **out of v1** except two `XS` cleanups: the `/language-(\w+)/` hyphen fix and deleting dead `editable-table.tsx` |
| **INFRA/LEGAL** | 25 | MoR before the first *paid* signup · EU Art. 27 rep before the first EU *free* signup · CA + lawyer · ToS/privacy · auth, error tracking, R2 — all **buy** |
| **GTM** | 34 | land Markex's tree (RULE-2 gated) · LinkedIn Documents-API probe `S` · post-as-document `L` · launch calendar in-product `M` · 20 posts `XL` |

---

## 3. Critical path

```
R0.3 → R0.1 → R0.2 → R0.4 → R0.9 → T0(auto-sync → local history → two-device rig)
     → T1(identity → GitHub App → HOME.md) → T3(MCP+land() → review loop → cert distribution)
     → T4(importers → promotion loop) → v1
```

- **R0.5 (CI) is not on the path but gates the credibility of everything after it.** Do it in the first 48 hours so every later unit lands under a gate.
- **T2 is off the path entirely.** Its only path-touching items are the two `XS` cleanups.
- **Legal items are date-gates, not effort-gates.** They are other people's calendars.
- **R0.4 is the one engine unit an agent cannot start** — it needs a written decision on Unicode key equality first.

---

## 4. Milestones — every definition of done is executable

| M | Gate | Done means |
|---|---|---|
| **M0** | CI live | A PR runs typecheck·lint·test·build·arch·spec and **fails on a deliberately broken commit**. `npm run budget` asserts a real byte ceiling, not `echo`. **One red run is required before the first green is trusted** |
| **M1** | Engine truth | Over the pinned corpus: **refused ≤ 2 of 7,959** (from 6,614), **changed = 0, threw = 0**. NF-3's set-only assertion **fails on `HEAD~1`** and passes on `HEAD`. `date created` set + rename succeed on ≥812 files. `npm run corpus` exits 0 at gate time |
| **M2** | MDMAX wired | Seams 1–3 live; ≥8 of the 12 unreached mdmax files have a product importer; `npx mdmax cert <file> --fail-on=BROKEN` exits 1 on a seeded BROKEN fixture inside CI |
| **M3** | Trust surface | Two devices, both offline, both edit the same file, both reconnect: **zero bytes lost and every divergence surfaced as a reviewable hunk**, watched by a human, recorded. Section-level restore returns the file to a prior sha with every untouched byte identical |
| **M4** | Tenancy | A second GitHub account, never used in development, signs in via the **GitHub App**, connects one repo, edits, commits — no founder intervention, no shared secret |
| **M5** | Agent protocol | An external agent edits a real vault through `land()`; every change appears in the review surface and is rejectable; a rejected change leaves the file **byte-identical** to pre-edit |
| **M6** | Capture | One ChatGPT export ZIP → durable typed documents in one click, and **the verification report enumerates every dropped construct by count** |
| **M7** | v1 public | M0–M6 green + MoR live + EU rep appointed + ToS published + **one paying non-founder account** |

**Reject these if proposed as a DoD:** "kanban feels good" · "import works" · "fidelity is high" · anything whose evidence is a screenshot · anything a `grep` over source can satisfy.

---

## 5. Who does what

| An AI agent can own (disjoint artifacts) | Only the founder can do |
|---|---|
| NF-1/NF-2 walk change + fixtures | The NF-4 key-equality decision |
| Corpus runner and gates | All open decisions |
| The six construct detectors, one agent each | **PAT rotation** |
| CJK segmenter + tokenizer | GitHub App registration, secrets, callback |
| CSS reconciliation | MoR, CA, lawyer, EU representative |
| Tier 3/4 residue | Watching the M3 two-device run |
| Test authoring for every unit | Accepting or rejecting every agent diff |
| Doc and spec sync | Any RULE-2 operation |

**Do not parallelise:** NF-1 and NF-4 against the same file — both touch the key walk. And do not fan out T0's sync work; it is one creative target carrying implicit architecture decisions.

---

## 6. Calendar

Assumption stated so it can be disagreed with: 1 pt = 1.09 calendar days, from 2026-08-29.

| Milestone | Cum. pts | Date |
|---|---|---|
| R0 complete | 58 | **2026-10-31** |
| + T0 | 90 | 2026-12-05 |
| + T1 | 132 | 2027-01-20 |
| + T3 (v1 subset) | 176 | 2027-03-09 |
| + T4 = **code-complete** | 196 | **2027-03-31** |
| + legal/infra = **shippable** | 221 | **2027-04-28** |
| + full GTM | 255 | 2027-06-04 |

R0 alone is **9 weeks**. That is consistent with the PRD's own "multi-month R0 lane before any customer-visible feature", and it is the part most likely to be wished away.

---

## 7. The ten things most likely to blow this

| # | Risk | Early warning — check weekly |
|---|---|---|
| 1 | **"NF-1 recovers 99.98%" is an inference from bucketing refusal causes, not a measured result of the patched writer** | First patched run refuses >10 files. If the residual is >2, NF-1 was never one bug |
| 2 | Corpus loss or drift | Any run whose file count ≠ 8,513. **Mitigated: pinned and red-proofed** |
| 3 | NF-4 is a design task wearing a regex costume | Two weeks pass with no written NFC/NFD decision |
| 4 | "Wire MDMAX in" is an integration surface, not a wiring task — 12 files with zero call sites | Week 2 of R0.9 still has 0 new product importers. Count them |
| 5 | **CI's first green will be false.** `budget` is `echo`, `e2e` is `if: false`, and four gates in this repo already reported green while blind | CI passes on a deliberately broken commit |
| 6 | Cadence is bursty — 8 active days in 32 | Two consecutive weeks with zero commits |
| 7 | T1 identity is the only XL, scored from analogy not from this repo | A week of schema churn instead of a signed-in second account |
| 8 | Open decisions gate scheduled work; D8 alone can delete T3 | Any lane started before its gating decision is written down |
| 9 | Legal lead times are vendor-clock | EU-reachable free tier with no Art. 27 representative |
| 10 | The name is unresolved | **Any brand spend before D3 closes.** See below |

**On the name.** The strongest candidate found is **`stetfile`** — *stet* is the one word in English meaning "let it stand, preserve the original exactly", which is literally the engine's contract. Clean on all four measured axes: npm 404, GitHub 404, zero repos, no product. Tracked risk: an agent-oriented package `stetmark` shipped 2026-08-05 with ~5,753 downloads/month, so bare `stet` branding is contested even though `stetfile` is not.

If you keep "frontmatter", the honest finding is that the collision is **narrower than the raw install count suggests** — Front Matter CMS is a VS Code *extension*, a plugin inside another editor, at 2,539 stars. But the compromise to avoid is explicit: **do not ship "Frontmatter" bare while quietly holding qualified handles.** That takes the full trademark and SEO exposure and buys nothing. Either qualify the spoken name or leave the word. Nothing here is trademark clearance; that needs counsel.

---

## 8. The first week, concretely

| Day | Do | Proves |
|---|---|---|
| 1 | **Rotate the two PATs.** Then CI: port `ci.yml`, add `spec` and `corpus` to the workflow | Only you can do the first. The second gates everything after it |
| 1 | Make CI fail on purpose, once, before trusting any green | That the gate can see |
| 2 | NF-3 red proof — a **set-only** assertion that fails on today's code | Set-then-delete cancels out; that is how NF-3 stayed invisible |
| 2–4 | NF-3 fix, then NF-1 red proof and fix | The 83% refusal rate is the number the whole fidelity claim rests on |
| 4 | Re-derive the recovery rate from the patched writer. **Replace the 99.98% inference with a measurement** | Risk #1 |
| 5 | Write the NF-4 decision — one page on NFC/NFD key equality | Unblocks the only agent-blocked unit |
| 5 | The two `XS` cleanups: the `/language-(\w+)/` hyphen fix, delete `editable-table.tsx` | Unblocks every render profile later |
| Ongoing | One spec per unit, `draft → verified`, never hand-written | The plan is executed through `specs/`, or it is not executed |

---

*The engine work is unglamorous and it is first for a reason: every fidelity number we intend to market is currently false at the measured refusal rate, and publishing before the fix converts a bug into a public claim.*
