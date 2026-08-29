Verified already this session — `git -C ~/.claude status -- skills-src settings.json` shows 10 modified + 8 untracked files, all pre-existing skills/config unrelated to this research task; I issued zero writes, zero commits, and only read-only `curl`/`ls`/`find`/GitHub-API/`git status` commands.

### A0 — Evidence base actually opened (2026-08-29)

| Source | Method | Result |
|---|---|---|
| BUSL-1.1, Elastic-2.0, SSPL-1.0, PolyForm-NC/SB 1.0.0 | `curl` raw SPDX text | [fetched] full terms |
| FSL-1.1-ALv2 template + fsl.software | `curl` raw + HTML | [fetched] |
| PolyForm-Shield-1.0.0 (SPDX path) | `curl` | [measured] returned **empty**; polyformproject.org/licenses/* returned GitHub-Pages **404** — Shield terms unverified here |
| W3C Software & Document License 2023 | `curl` | [fetched] |
| CC0 1.0 deed; CommonMark 0.31.2 | `curl` | [fetched] |
| OWFa 1.0 | `curl` | [measured] page returned nav chrome only — **terms not opened**, treated as [SS] below |
| Redis AGPL blog; Elastic "open source again"; opentofu.org | `curl` | [fetched] |
| Obsidian pricing; forum `about.json`; Discord widget; plugin/theme JSON; `obsidian-help` via GitHub API | `curl` | [measured] |
| Stack Overflow Dev Survey 2025 (docs-as-purchase-input) | `curl` | [measured] **JS-rendered, 271 chars of text** — no primary quantitative docs-purchase datum obtained. All B1 numbers are [SS]/[inference], per RULE 5 |

### A1 — Source-available terms, as written

| Licence | Core restriction | Reversion | OSI-approved | Notes |
|---|---|---|---|---|
| BUSL 1.1 | Grants copy/modify/redistribute + **non-production use** only; production needs an Additional Use Grant or a paid licence [fetched] | Change Date, capped at **4th anniversary of first public distribution of that version**; per-version [fetched] | No [SS] | Text is a MariaDB trademark; reuse permitted under "Covenants of Licensor" [fetched] |
| FSL 1.1 | Any purpose except **Competing Use** = substitutes for the Software, or for any product/service we offer using it *existing as of the date we make it available*, or "same or substantially similar functionality" [fetched] | **2 years** → Apache-2.0 or MIT [fetched] | No [SS] | Explicitly permits internal use, non-commercial education/research, professional services; authored by Sentry [fetched] |
| Elastic 2.0 | No hosted/managed service exposing "any substantial set of the features"; no circumventing **licence-key functionality**; no notice removal [fetched] | None [fetched] | No [SS] | Patent grant + patent-defence termination; **30-day cure with retroactive reinstatement** [fetched] |
| SSPL 1.0 | §13: offering the Program's functionality as a service obliges publishing **Service Source Code** — the whole management/orchestration stack — under SSPL [fetched, line 478] | None; GPL-derived [fetched] | No — Redis's own blog states OSI "clarified it lacks the requisites" [fetched] | Dated Oct 16 2018 [fetched] |
| PolyForm Noncommercial 1.0.0 | Any **noncommercial** purpose; personal use, charitable/educational/government orgs permitted [fetched] | None [fetched] | No [SS] | Cleanest short text of the set [inference] |
| PolyForm Small Business 1.0.0 | Permitted if company has **<100 total** people and **<USD 1,000,000 (2019)** revenue prior tax year, inflation-adjusted [fetched] | None [fetched] | No [SS] | Threshold is self-assessed — unenforceable at solo-founder scale [inference] |

### A2 — Adoption and the reversal record

- Redis: Redis Stack split → **SSPL March 2024** → **AGPLv3 with Redis 8**; antirez rejoined Nov 2024 [fetched].
- Elastic: ELv2/SSPL 2021 → **AGPL added as a third option, Aug 2024**; founder states the fork (OpenSearch) was foreseen, "3 years later, Amazon is fully invested in their fork… market confusion has been (mostly) resolved" [fetched].
- HashiCorp BUSL 2023 → OpenTofu, now Linux Foundation, **3,900+ providers, 23,600+ modules, v1.12.0** [fetched 2026-08-29].
- Pattern: restrictive relicensing of *infrastructure others embed* reliably produces a funded fork; two of three majors then partially reverted [derived from the three fetched sources].
- Non-pattern: none of these firms is a solo-founder desktop editor. The hyperscaler free-rider threat that justifies BUSL/SSPL **does not exist for a markdown editor** [inference].

### A3 — Open-core: worked / failed

| Worked [SS] | Failed [SS] |
|---|---|
| GitLab, Grafana, Sentry, Docker Desktop, Elastic (post-fork revenue intact) | MongoDB/Elastic pre-fork attempts to stop hyperscalers *by licence alone*; Redis SSPL (reverted in 14 months) |
| Common shape: **open the runtime/engine, close the collaboration, hosting, SSO/audit, and management surface** | Failure shape: open the *whole product*, monetise a feature flag; or restrict a component others already build on |
| Sentry's FSL is the clean solo-analogue: permissive-in-practice, competing-use-only carve-out [fetched] | Open-core where the closed part is "the good bits users already had" — reads as bait-and-switch [inference] |

### A4 — Engine open, app closed: the argument for frontmatter

- The engine's value is **verifiability**, not secrecy. A byte-preserving splice engine that "refuses rather than guesses" is only credible if a third party can run the refusal cases [inference].
- A degradation certificate is a **claim about other people's software**. An unauditable certificate is a marketing asset; an auditable one is evidence [inference].
- Cloning risk is low: the moat is R2/Workers sync, Tauri packaging, auth, billing, and the certificate corpus — none of which live in the engine [inference].
- Dependency reality: `unified@11.0.5`, `remark-parse@11.0.0`, `micromark@4.0.2`, `@codemirror/state@6.6.0`, `next@16.2.6`, `react@19.2.6` are **all MIT** [measured 2026-08-29]. No copyleft obligation constrains any choice below.
- **Repo has no LICENSE file and `package.json` has no `license` field** [measured] — currently the default is "all rights reserved", which is the worst position for a spec you intend others to implement.

### A5 — Spec licences: what a format spec needs

| Instrument | Grant | Patent grant | Fit for an interchange format |
|---|---|---|---|
| CC0 1.0 | Waives copyright to the extent possible [fetched] | **No** patent grant [SS] | Maximum implementability; no attribution signal |
| CC-BY 4.0 | Copy/adapt with attribution [SS] | No patent grant [SS] | Good; attribution keeps provenance |
| CC-BY-SA 4.0 | + ShareAlike [fetched — CommonMark 0.31.2 (2024-01-28) uses it] | No | **Viral on derivative specs**; discourages vendors embedding your text |
| W3C Software and Document License 2023 | Copy/modify/distribute **for any purpose, no fee**, provided full NOTICE, pre-existing IP notices, and notice of changes [fetched] | Separate W3C patent policy [SS] | Purpose-built for spec + reference code together |
| OWFa 1.0 | Copyright + patent grants for implementations [SS — page not opened] | Yes [SS] | Heaviest; designed for multi-party consortia |

- Requirement for "others implement it freely": (1) permission to **copy the spec text into their docs and tests**, (2) permission to **implement without patent risk**, (3) no ShareAlike on the implementation. Only a permissive-code licence on the *test suite* plus a permissive-doc licence on the *prose* delivers all three [inference].
- CommonMark's CC-BY-SA choice is a precedent, not an endorsement — it is the reason downstream specs quote it sparingly [inference, disagreement recorded: widely implemented anyway].

### A6 — Recommendation per artifact

| Artifact | Recommendation | Reasoning | Anti-recommendation |
|---|---|---|---|
| **App** (Next 16 + Tauri client, sync, billing) | Proprietary, closed. Publish a plain-English **data-portability promise** instead of source [inference] | Nothing about the app is a credibility claim; all deps are MIT so no obligation to open [measured] | Do **not** BUSL the app. BUSL's Change Date forces publication of source you never intended to publish [fetched]; you get the openness cost with none of the trust benefit |
| **Engine** (splice, OffsetMap, refusal logic) | **Apache-2.0** [inference] | Explicit patent grant + trademark reservation; the only asset whose value *rises* with third-party verification; permissive keeps it embeddable in the MIT ecosystem it already sits in [measured] | Do **not** use FSL/BUSL here. FSL's "same or substantially similar functionality" bars exactly the reimplementation that would prove the engine correct [fetched]; a converting licence also means the restriction expires anyway (2y FSL / ≤4y BUSL) [fetched] |
| **Certificate CLI** | **Apache-2.0**, same repo as engine [inference] | A certifier nobody can run is not evidence. Must be installable in CI at zero friction | Do **not** gate the CLI on a licence key (the Elastic-2.0 mechanic) [fetched] — key-gating a *verification* tool destroys the artefact's purpose |
| **Format spec** (session-interchange) | **Prose: CC-BY 4.0. Conformance test-suite + reference parser: Apache-2.0.** Add a one-line "no patent assertion against conforming implementations" pledge [inference] | Satisfies copy-into-your-docs, implement-freely, and no-ShareAlike simultaneously; W3C-2023 is the alternative if you want one instrument for both [fetched] | Do **not** use CC-BY-SA (CommonMark's choice [fetched]) — ShareAlike on spec prose deters the vendors you need to adopt it. Do **not** use CC0 — you lose the attribution that makes the spec a distribution channel |
| **Certificate dataset** | **CC-BY 4.0** for the data; **ODbL is the anti-choice**; keep the *generation harness* Apache-2.0; retain raw run artefacts privately [inference] | Attribution is the whole marketing mechanism; a cited dataset is a permanent backlink | Do **not** licence it non-commercially (PolyForm-NC) — the competitors you certify are commercial, and a non-commercial dataset cannot be quoted in their release notes [fetched terms]. Do **not** publish per-vendor "fail" verdicts without a documented dispute path [inference] |
| **Repo hygiene** | Add `LICENSE`, set `package.json.license`, add per-directory `LICENSE` for engine/CLI/spec | Currently no licence file exists anywhere [measured] | Do **not** apply one licence at repo root and assume it covers the spec prose — mixed-licence repos need per-path declaration |

### B1 — Documentation as purchase input

- **Honest state**: the attempt to open a primary quantitative source failed (SO 2025 survey is client-rendered; 271 chars of extractable text) [measured]. Everything in this sub-section is [SS]/[inference], not verified.
- Dev-tool buyers evaluate by reading docs *before* signing up; docs function as the trial for anything with a non-trivial setup [SS].
- For frontmatter specifically the load-bearing doc is not a tutorial — it is **"what will this tool refuse to do, and why"**. The refusal contract *is* the product claim [inference].
- Beachhead ICP = dev-tool startups → they will read the spec and the CLI README before they read a feature page [inference].

### B2 — Diátaxis, as published

- Four kinds: tutorials, how-to guides, reference, explanation — different purposes, different writing [fetched].
- The compass, verbatim structure [fetched]: informs action + acquisition → tutorial; informs action + application → how-to; informs cognition + application → reference; informs cognition + acquisition → explanation.
- Author's own instruction: "You don't need to read everything… I recommend that you don't" — apply it to something small [fetched].

### B3 — Docs-as-code

- Same workflow as development; writers integrated into the product team; **merges can be blocked on missing docs** [fetched, Write the Docs].
- Repo already has 159 markdown files under `docs/` across `adr/`, `engine/`, `mdmax/`, `research/`, `build/` [measured] — the substrate exists; it is engineering notes, not user docs [inference].

### B4 — What docs cost to maintain (measured proxy)

| Metric | Value | Source |
|---|---|---|
| `obsidianmd/obsidian-help` English pages | **175 `.md` under `en/`** | [measured 2026-08-29] |
| All-locale markdown files | **6,357** | [measured] |
| Localisation multiplier | 6,357 ÷ 175 = **36.3×** | [derived] |
| Commits since 2026-05-31 (90 days) | **83** | [measured] |
| Commit rate | 83 ÷ 90 = **0.92/day** | [derived] |
| Churn per English page per quarter | 83 ÷ 175 = **0.47 commits** | [derived] |

- [inference] A 30-page English docs site at Obsidian's churn rate ≈ 0.47 × 30 ≈ **14 doc commits/quarter** ≈ ~1/week. At 30 min each that is **~2 h/month steady-state**, plus a one-off build cost.
- [inference] Build cost for 30 pages at 2 h/page = **60 h**, spread over 8–10 weeks alongside engineering.

### B5 — What competitors ship

| Product | Docs posture | Evidence |
|---|---|---|
| Obsidian | Public help repo, community-editable, 36 locales, ~1 commit/day [measured] | [measured] |
| CommonMark | Versioned spec 0.31.2 (2024-01-28), executable examples, CC-BY-SA [fetched] | [fetched] |
| Sentry | Ships its *licence* as a product (fsl.software) with an FAQ answering "why not open source / why not AGPL / why not open core" [fetched] | [fetched] |
| Elastic / Redis | Licence pages are canonical, versioned, and quotable — legal text as documentation [fetched] | [fetched] |

### B6 — Docs plan

| Diátaxis quadrant | Pages | Priority | Owner cost |
|---|---|---|---|
| Reference | Splice contract; **refusal catalogue** (every REFUSE with its byte-level cause); certificate schema; CLI flags; session-format spec | **P0** — this is the purchase input for the ICP [inference] | ~12 pages, generated from tests where possible |
| Explanation | "The file is the only source of truth"; why reversible projection; why we refuse rather than guess; what a degradation certificate does and does not claim | P0 | ~6 pages, hand-written, low churn |
| How-to | Run `mdmax cert` in CI; certify a vault; migrate from Obsidian; recover a refused edit | P1 | ~8 pages |
| Tutorial | One 15-minute "certify your first vault" | P2 | 1 page |

- Structure: `docs/` in-repo, docs-as-code, PR-gated (merge blocked when a refusal code changes without a reference-page update) [fetched pattern].
- **Generate the refusal catalogue from the test fixtures** — a hand-maintained catalogue drifts and drift here is a credibility failure, not a typo [inference; LR#59 class].
- Anti-recommendations: do **not** localise (36.3× file multiplier for zero ICP value) [derived]; do **not** build a tutorial before the reference exists (Diátaxis's own advice is to start small and applied) [fetched]; do **not** put docs on a separate CMS — it decouples them from the merge gate that keeps them true [fetched].

### C1 — Community platform tradeoffs

| Platform | Cost (read 2026-08-29) | Searchable/indexed | Moderation burden | Fit |
|---|---|---|---|---|
| GitHub Discussions | $0 [SS] | Yes, indexed, permanent | **Lowest** — same identity + block/report as the repo; categories + marked answers [fetched docs] | **Best first move**: co-located with the spec, CLI, and issues [inference] |
| Discourse (hosted) | **$100/mo** standard, **$500/mo** Business, free plan exists [fetched] | Yes, excellent | Medium — needs categories, trust levels, a mod team | Premature at pre-revenue [derived: $1,200/yr and $6,000/yr] |
| Discord | $0 | **No** — invisible to search, answers evaporate | **Highest** — synchronous, always-on, expectation of instant reply | Highest cost per unit of durable value for a solo founder [inference] |
| Reddit | $0 | Yes | Low (you moderate nothing; you have no control either) | Distribution channel, not a home [inference] |

- [measured] Reddit's JSON API refused both user-agents attempted — subscriber counts for r/ObsidianMD and r/Markdown are **unverified**.

### C2 — Moderation load for one founder

- Obsidian forum, 30 days [fetched 2026-08-29]: **3,629 active users, 956 participating, 2,921 posts, 432 topics, 1,330 likes**.
- [derived] 2,921 ÷ 956 = **3.06 posts per participating user/month**; 956 ÷ 3,629 = **26.3%** of active users post at all — the 90-9-1 shape, measured.
- Obsidian Discord (OMG) **presence_count 20,851 online** at fetch time [measured] — a synchronous surface an order of magnitude larger than the forum's monthly participants.
- [derived, assumption stated] At 1% of Obsidian's forum volume: 29 posts/mo × 3 min triage = **~1.5 h/month**. At 10%: 292 posts × 3 min = **~15 h/month** — the point where a solo founder is choosing between community and the engine.
- Discord has no equivalent floor: presence is continuous, so load scales with *hours online*, not posts [inference].

### C3 — When community becomes a moat

- Moat conditions [inference, from the fetched cases]: (a) third parties invest artefacts you don't maintain, (b) those artefacts are worthless elsewhere, (c) search indexes the answers so the community compounds.
- Obsidian satisfies all three: **7,062 community plugin entries** and **716 themes** [measured 2026-08-29, `"id":`-key count proxy].
- OpenTofu shows the inverse: a community with **3,900+ providers, 23,600+ modules** [fetched] can be *transplanted* off you in months when the licence provokes it.
- Frontmatter cannot use the plugin route — no plugin marketplace, no arbitrary client-side execution (settled). The only compounding artefact available is **certificates and conformance cases contributed against the spec** [inference].

### C4 — Obsidian / markdown community dynamics

- Obsidian's commercial licence is now **optional**: "No. You are not required to pay for a commercial license… we encourage you to purchase" [fetched 2026-08-29]. Pricing: Sync $4/user/mo annual ($5 monthly), Publish $8/site/mo annual ($10 monthly), Commercial $50/user/year, Catalyst $25 [fetched].
- Consequence: the community's norm is **voluntary payment for a closed app with open files** — a closed frontmatter app is *not* a norm violation there; a proprietary *format* would be [inference].
- The community's live grievances are plugin-induced file corruption and lossy round-trips [SS] — which is precisely the certificate's subject matter [inference].
- Entering as "the tool that refuses to corrupt your vault, and here is the proof for the other tools too" is a contribution; entering as "Obsidian but better" is a fight with 7,062 plugins [inference].

### C5 — Community plan, sized to one founder

| Phase | Surface | Time cap | Trigger to advance |
|---|---|---|---|
| 0 (now) | GitHub Discussions on the **spec/engine/CLI** repo only; categories: Spec, Refusals, Certificates, Q&A | **2 h/week**, batched to two fixed windows | — |
| 1 | Publish certificate results as a versioned dataset; invite conformance-case PRs | +1 h/week | ≥10 external conformance cases |
| 2 | Reddit/Obsidian-forum *participation* (answer, don't recruit) | 1 h/week | Certificates cited by a third party |
| 3 | Discourse at $100/mo | — | Only when Discussions exceeds ~150 posts/mo [derived from the 3 min/post model] |

- Written policy from day one: response-time expectation ("weekdays, within 2 business days"), scope ("spec and engine here; app support by email"), and a **conflict-of-interest note** on certificate disputes [inference].
- Anti-recommendations: do **not** open a Discord (unindexed, synchronous, unbounded — worst ratio of the four [inference]); do **not** open Discourse before revenue ($1,200–$6,000/yr [derived] for a room that will be empty); do **not** run a community and a docs site and a licence launch in the same month; do **not** promise 24h response.

### D — How the three reinforce or compete

| Pair | Reinforces | Competes for |
|---|---|---|
| Licence ↔ Docs | Apache-2.0 engine only earns trust if the refusal catalogue is public; the licence is what makes the docs *quotable* by the ICP [inference] | Nothing — the reference docs are the same artefacts the licence makes useful. **Strongest coupling** |
| Docs ↔ Community | GitHub Discussions answers become doc issues; every repeat question is a missing reference page [fetched, docs-as-code] | Both consume the same "explain the engine clearly" hours; a good refusal catalogue *reduces* moderation load [inference] |
| Licence ↔ Community | A permissive spec is the only thing that makes external conformance cases legally clean to accept [inference] | CLA/DCO admin is new solo overhead |
| All three ↔ Engine | — | **Direct competition.** ~60 h docs build + ~2 h/mo docs upkeep + ~8 h/mo community = the same hours as the R0 engine work already queued (zero-indent-sequence refusals, bare-CR, SAFE_KEY) |

- Ordering that minimises contention [inference]: **licence files first (≈2 h, unblocks everything)** → reference docs generated from tests (amortised into engineering) → Discussions (2 h/wk cap) → dataset publication → *only then* explanation/tutorial prose.

### E — Consolidated anti-recommendations

- Do not BUSL or SSPL anything. Both exist to defend against hyperscaler resale of infrastructure; neither threat model applies, and both provoked forks or reversals at three of three majors examined [fetched].
- Do not adopt FSL for the engine despite its solo-founder fit — its Competing-Use clause forbids the independent reimplementation that would validate the engine [fetched].
- Do not use PolyForm Small Business — self-assessed <100 people / <$1M revenue thresholds [fetched] are unenforceable by a solo founder in India against a global user base.
- Do not licence the spec CC-BY-SA; do not licence the dataset non-commercially.
- Do not ship a certificate CLI with licence-key enforcement.
- Do not localise docs, do not write the tutorial first, do not host docs off-repo.
- Do not open Discord; do not pay for Discourse pre-revenue.
- Do not publish adversarial per-vendor certificate verdicts without a dispute process and a stated methodology version.
- Do not claim "open source" for anything but the Apache-2.0 artefacts — Redis's own post records OSI's position that SSPL is not open source [fetched]; loose usage is the reputational failure mode in this exact community.

### F — Disagreements and unverified items

- Elastic's founder frames the fork as survivable and the licence change as correct in hindsight; Redis frames its own SSPL period as something to move on from [both fetched] — **not reconciled here**.
- OWFa 1.0 terms, PolyForm Shield 1.0.0 terms, and all Reddit community sizes: **unverified** (fetch failures logged in A0/C1).
- All Part-B purchase-input claims: **[SS]/[inference] only** — no primary survey opened.
- Plugin count 7,062 is a `"id":`-key occurrence count, not a parsed record count [measured, proxy].