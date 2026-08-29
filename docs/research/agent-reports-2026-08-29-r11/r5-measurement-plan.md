### Evidence legend

`[fetched]` I opened the primary source with curl on 2026-08-29 · `[measured]` I executed it on this machine · `[derived]` arithmetic shown · `[SS]` search-result summary, nobody opened it · `[inference]` my reasoning · `[brief]` supplied by the orchestrator, **not re-measured here** (RULE 5).

### The failure this plan exists to fix

| Channel | Rows | Kind |
|---|---|---|
| Explicit feedback field | 7 filled / 694 opportunities `[brief]` | human-written |
| `~/.sgnk/state/*.gate-tier.json` | 21,707 `[measured]` | machine-written |
| `~/.sgnk/state/*.turn-meta.json` | 15,786 `[measured]` | machine-written |
| `~/.sgnk/traces/*.jsonl` | 5,021 `[measured]` | machine-written |

- Fill rate = 7 ÷ 694 = **1.0086%** `[derived]`; machine total = 21,707 + 15,786 + 5,021 = **42,514**, a ratio of 42,514 ÷ 7 = **6,073×** `[derived]`.
- The numerator frozen at 7 across three measurements is the load-bearing fact, not the 1%. If fills arrived at 1.0086% of a growing denominator, measurement 3 would exceed measurement 1 by 0.010086 × Δopportunities. Observed Δ = 0 ⇒ **marginal fill rate is 0, not 1%** `[derived]`. 1.0086% is a stock left by early novelty, not a flow.
- Same shape reproduces locally in `~/.sgnk/PREFERENCE-LOG.jsonl` (232 rows) `[measured]`: `prompt_hash` 0/101 non-empty (0%), `skill_version` 0/99 (0%), `routing_path` 1/99 (**1.01%** — the same number, independently) `[derived]`, `output_hash` 2/101 (1.98%), vs `timestamp` 232/232 (100%) `[measured]`.
- **Design rule that follows:** a field only gets written if a machine writes it as a side effect of work the user wanted to do anyway `[inference]`.

### North-star metric

**WPSD — Weekly Projection-Survived Documents.** Count of distinct documents that, in a rolling 7-day window: (1) received ≥1 mutation issued through a non-text projection (board / calendar / decision card / site), AND (2) were still byte-valid under the degradation certificate at window close, AND (3) had not been reverted to their pre-projection bytes.

| Criterion | WPSD satisfies it? |
|---|---|
| Tracks customer value | Yes — the product's entire claim is that a projection edit is a safe, reversible byte-splice; a surviving projection edit is the claim being cashed `[inference]` |
| Measurable on a useful cadence | Weekly; derived from splice ledger + file re-read, zero UI `[inference]` |
| Decomposes into actionable inputs | WPSD = (foreign vaults opened) × (clean-cert rate) × (projection open rate) × (splice survival rate) `[inference]` |
| Resists gaming | Partially — survival is adversarial to the team, since shipping a lossy projection *reduces* it `[inference]` |

- Construction discipline follows the four-part test in Ova, *North-Star Metric Construction and Revision Discipline*, 17 Jan 2026 `[fetched]`.

### The strongest argument against WPSD

- **It is an engine-usage metric wearing a value metric's clothes.** A user who buys frontmatter purely for byte-preserving plain-text editing and never opens a projection gets the full promised value and contributes **zero** to WPSD `[inference]`.
- Goodhart, in Goodhart's own 1975 formulation: "Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes" `[fetched, en.wikipedia.org/wiki/Goodhart's_law]`. The cheapest way to move WPSD is to make projections the default surface — which directly contradicts the settled "deliberately SIMPLE surface" constraint `[inference]`.
- Surrogation risk (Choi, Hecht & Tayler 2012, cited in Ova) `[fetched, cited-not-opened]`: within two quarters a solo founder optimises *for board views* rather than *for the file being trustworthy* `[inference]`.
- **Guard, not a fix:** pair WPSD with a hard counter-metric — **Projection Abstention Rate** (share of weekly-active users who edit files but never open a projection). A rising WPSD alongside a falling abstention-rate is growth; a rising WPSD alongside a *rising* abstention rate means the projection users are a shrinking, self-selected cult and the metric is lying `[inference]`.
- **Revision trigger, set now:** re-open the NSM if abstention >55% for two consecutive months, or if the paid-conversion correlation with WPSD drops below the correlation with plain `doc_write` `[inference]`.

### Activation

- **Definition:** within 7 days of first launch, a user has (a) opened a folder containing ≥3 `.md` files frontmatter did not author, (b) written to ≥1 of those files with `cert_status=clean`, (c) opened ≥1 projection at least once.
- **Proving event: `foreign_vault_write`** with `authored_by_us=false`, `cert_status=clean`. One event, no UI, unfakeable.
- **Why this and not "created a file":** the queued R0 engine work says zero-indent-sequence refusals hit **83% of foreign vaults** `[brief]`. A user who only creates *new* files never touches the failure mode that decides whether the product survives contact with reality `[inference]`.
- Precedent for "first irreversible-feeling success" activation definitions in dev tools (first deploy, first error received, first Zap enabled) is widely repeated but I opened no primary source for any specific company's number `[SS]` — do not quote Slack's "2,000 messages" or Dropbox's "1 file in 1 folder" as verified.

### Retention

- **Definition (W4 return-with-a-file):** user is retained in week N if they write to ≥1 document whose `doc_first_seen_week < N`. Returning and creating only new files is **not** retention — that is a fresh trial, not a habit `[inference]`.
- **Proving event: `doc_write`** with `doc_age_weeks ≥ 1`.
- **Secondary: `vault_reopen_after_gap`** with `gap_days` bucketed — separates "churned" from "seasonal writer", which matters enormously for a document tool and is invisible in DAU `[inference]`.

### Event schema

Every row must name a decision. Properties are all bucketed/hashed; none carry document bytes.

| Event | Fires when | Properties | Decision it changes |
|---|---|---|---|
| `app_open` | Launch | `os`, `app_version`, `cold_start_ms_bucket` | Which OS/version to keep supporting; whether to fund startup perf |
| `vault_open` | Folder opened | `file_count_bucket`, `authored_by_us_ratio_bucket`, `max_depth_bucket` | Whether to invest in large-vault indexing |
| `foreign_vault_write` | First write to a file we didn't author | `cert_status`, `refusal_code`, `file_size_bucket` | **Activation gate**; ranks which R0 engine refusal to fix first |
| `cert_refusal` | Degradation cert refuses a save | `refusal_code`, `construct` (e.g. `zero_indent_seq`, `bare_cr`), `vault_share_affected` | Direct priority order for engine work; the 83% claim becomes live |
| `cert_downgrade` | Cert passes but flags lossy round-trip | `construct`, `severity` | Whether a construct needs full support or a documented limitation |
| `splice_apply` | Any byte-splice lands | `splice_kind` (`human`/`ai`/`projection`), `byte_len_bucket`, `doc_id_hash`, `splice_id` | Ledger row; parent of all survival derivation |
| `splice_outcome` | T+1h/24h/7d re-read | `splice_id`, `outcome` ∈ {`accepted`,`edited`,`reverted`,`superseded`}, `edit_ratio_bucket`, `survival_bucket` | Ship/kill an AI capability; tune projection write-back |
| `projection_open` | Board/calendar/card/site opened | `projection_kind`, `doc_size_bucket` | Which projections to keep; which to cut |
| `projection_write` | Mutation issued via projection | `projection_kind`, `field_kind`, `roundtrip_ok` | **NSM numerator**; catches non-reversible projections |
| `projection_abandon` | Projection opened, closed, zero writes, <20s | `projection_kind` | Distinguishes "unused" from "tried and rejected" — different fixes |
| `doc_write` | Any save | `doc_age_weeks`, `doc_size_bucket`, `write_source` | **Retention gate** |
| `vault_reopen_after_gap` | Session after ≥7 idle days | `gap_days_bucket` | Seasonal vs churned; changes dunning and re-engagement |
| `undo_after_splice` | Undo within 60s of a splice | `splice_kind`, `splice_id` | Fast negative signal on a projection or AI edit |
| `perf_slow_op` | Any op >p95 budget | `op_name`, `duration_bucket`, `doc_size_bucket` | Where to spend engine perf time |
| `crash` / `engine_panic` | Unhandled fault | `stack_hash`, `op_name`, `app_version` | Hotfix trigger |
| `export_run` | Export/site publish | `target`, `doc_count_bucket`, `ok` | Whether the site projection is load-bearing or decorative |
| `license_state` | Trial→paid, paid→lapsed | `state`, `days_since_activation` | Pricing and trial-length changes |
| `update_check` | Version check (user-disableable) | `from_version`, `to_version` | Version-support sunset dates |

- **Volume ceiling, enforced in the emitter:** `splice_apply` sampled 1-in-10 above 200/day; `doc_write` collapsed to one row per doc per hour. Per-DAU-day ceiling ≈ **12 events** `[inference]`.
- At 600 DAU: 600 × 12 × 30 = **216,000 events/month** `[derived]`.

### Events explicitly cut (they change no decision)

- `button_click`, `menu_open`, `settings_viewed`, `keystroke_count`, `time_in_app` — none of these change a ship/kill call for an engine-first product `[inference]`.
- `session_replay`, heatmaps, scroll depth — structurally impossible to run over a document surface without capturing content `[inference]`.
- Any NPS / thumbs / star / "was this helpful?" widget — see anti-recommendations.

### What we must NOT collect

| Never | Why |
|---|---|
| Document bytes, fragments, diffs, or clipboard | We hold user documents; a leak is the whole business `[inference]` |
| File names, folder names, vault paths, or their hashes | Hashes of names are re-identifiable by dictionary attack against public repos `[inference]`; Obsidian treats file names as needing E2E encryption even in its own paid Sync `[fetched, obsidian.md/privacy]` |
| Headings, tags, front-matter keys or values | Front-matter keys are project names and client names `[inference]` |
| Token counts or prose length in raw form (bucket only) | Length + timestamp is a fingerprint against a published artefact `[inference]` |
| Stable cross-install device identifiers, MAC, serial, IP beyond coarse country | ePrivacy Art 5(3) engages on *terminal-equipment access* regardless of whether the data is personal `[fetched, EUR-Lex 02002L0058-20091219]` |
| Any data from a user we believe to be a child | DPDP §9(3): "A Data Fiduciary shall not undertake tracking or behavioural monitoring of children or targeted advertising directed at children" `[fetched, DPDP Act 2023]` |
| Retention beyond 90 days at row level | DPDP §8(7)(a) requires erasure once the specified purpose is no longer served `[fetched]` |

### Legal basis

- **GDPR Art 6(1)(f)** legitimate interests is available: "processing is necessary for the purposes of the legitimate interests pursued by the controller… except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject" `[fetched, gdpr-info.eu/art-6-gdpr]`. Bucketed, non-identifying product telemetry with an opt-out clears the balancing test `[inference]`.
- **ePrivacy Art 5(3) is the harder gate, and it is about the device, not about personal data:** storing information or gaining access to information already stored in terminal equipment requires consent, save for what is "strictly necessary in order for the provider of an information society service explicitly requested by the… user to provide the service" `[fetched]`. Writing a persistent analytics ID to disk is storage on terminal equipment `[inference]`. **Practical consequence:** derive the install ID from a rotating, salted, non-recoverable value regenerated every 90 days, and surface a first-run toggle. Whether a rotating local ID falls inside the strict-necessity carve-out is contested and I opened no regulator guidance resolving it — the CNIL audience-measurement exemption page timed out on two attempts `[measured: curl exit 28]`.
- **DPDP applies to frontmatter regardless of where it is sold.** §3(b): the Act "also apply[ies] to processing of digital personal data outside the territory of India, if such processing is in connection with any activity related to offering of goods or services to Data Principals within the territory of India" `[fetched, DPDP Act 2023, No. 22 of 2023, assent 11 Aug 2023]`. Selling globally from India means both limbs of §3 engage `[inference]`.
- **DPDP §7(a)** "certain legitimate uses" covers data the Data Principal "has voluntarily provided… for the specified purpose" — telemetry is **not** voluntarily provided, so §4(1)(a) **consent** is the realistic basis in India `[fetched + inference]`. This is stricter than GDPR here: India has no legitimate-interests limb for analytics.
- **Timeline:** DPDP Rules 2025 notified **14 November 2025**, with an **eighteen-month phased compliance period** and 6,915 consultation inputs `[fetched, PIB, 17 Nov 2025]`. 14 Nov 2025 + 18 months = **14 May 2027** `[derived]`. The Rules' gazette number is cited as G.S.R. 846(E) `[SS]`.
- **Penalties (Schedule, §33):** up to **₹250 crore** for failure of reasonable security safeguards (§8(5)); **₹200 crore** for breach-notification failure (§8(6)); **₹200 crore** for children obligations (§9); **₹150 crore** for Significant Data Fiduciary obligations (§10) `[fetched]`.

### What the privacy-focused competitors actually collect

| Product | Stated collection | Date on the document |
|---|---|---|
| **Obsidian** | "We do not collect any personal data." / "We do not collect any telemetry data." All app data local, never sent to their servers. Update check exists and is disableable in Settings → About. Sync/Publish store data; Sync is E2E-encrypted **including file names**. Account requires email; shared only with Stripe, WeChat, Alipay, PayPal. Third-party plugin directory policy **prohibits** capturing client-side telemetry. | "Last updated November 1, 2023" `[fetched]` |
| **Bear** | Personal data collected: **email address only**. Purposes: contact form, and Mailchimp for contacts/messaging (processed in the US). **No app-telemetry section exists at all.** Controller: "Shiny Frog Ltd, 60-63 Dawson St Dublin". | No last-updated date exposed; site footer reads "Shiny Frog © 2025" `[fetched]` |
| **iA Writer** | Writer notice: "Writer does not collect your personal data. All data is processed by Writer on your device." Separate Analytics notice: "we periodically collect and store limited device, operating system, app, and **feature usage data**. None of the collected information identifies you personally. Personal data is not logged at all." | "Last revised: September 26, 2025" (both notices) `[fetched]` |

**Source disagreements, recorded not resolved:**
1. iA publishes two notices that pull against each other — the Writer notice reads as "no collection", the Analytics notice discloses feature-usage collection from the same app. Both are dated 26 Sep 2025 `[fetched]`. This is the single most useful competitive fact: the most design-purist competitor in this exact niche **does** collect implicit feature-usage telemetry, and survives saying so in plain words `[inference]`.
2. obsidian.md/privacy serves **two stacked policies** — the current one (1 Nov 2023) and an older "Privacy Policy, Last updated December 11, 2020" from **Dynalist Inc.** invoking Canadian PIPEDA `[fetched]`. Which governs is not stated on the page.

### Stack recommendation and cost

| Option | Price read 2026-08-29 | Fit |
|---|---|---|
| **PostHog Cloud (recommended, phase 1)** | Free tier **1M events/month**, 5K replays, 1M flag requests, 1-year retention, 1 project, no card `[fetched]` | 216,000 ÷ 1,000,000 = **21.6% of free allowance** `[derived]`; 4.63× headroom `[derived]` → **$0/mo** |
| PostHog self-hosted | MIT, Docker Compose, needs "4 vCPU, 16GB RAM, and more than 30GB storage"; **"officially unsupported"**, no tagged releases, no CVEs published `[fetched]` | DO General Purpose dedicated 4 vCPU/16 GB from **$0.181/hour** `[fetched]` = 0.181 × 730 = **$132.13/mo** `[derived]`, plus solo-founder ops time. Reject at this scale |
| **Own store (recommended, phase 2)** | Cloudflare Workers Paid: **$5/mo minimum**, 10M requests included, +$0.30/M `[fetched]`; Free plan 100,000 req/day = 3,000,000/mo `[derived]` | 216,000 ÷ 10,000,000 = **2.16% of included requests** `[derived]` → **$5/mo**; add Supabase Pro **from $25/mo** if SQL is wanted `[fetched]` |
| OpenPanel Cloud | 250K events **$30/mo**, 500K $50, 1M $90; self-host free, unlimited events; 30-day trial; page shows "4.8k stars" `[fetched]` | Correct event shape, $30/mo, viable fallback |
| Plausible | 10k pageviews $9/$14/$19 (starter/growth/business); 100k $19/$29/$39; 1M $69/$104/$139; 10M $169/$254/$339. EU-hosted, EU-owned infrastructure `[fetched, from the page's `volumesWithPrices` array]` | **Anti-recommendation** — pageview-shaped, no per-document survival model |
| Fathom | Up to **500,000 pageviews $45/month**; 7-day trial; yearly = 2 months free; 50 sites; API 600 req/hr; forever retention `[fetched]` | **Anti-recommendation** — same shape mismatch, 9× the cost of OpenPanel at this volume `[derived: 45 ÷ 5 ≈ 9]` |

- **Recommendation:** phase 1 PostHog Cloud on the free tier, **$0/mo**, with the emitter written against a 4-field internal interface so the backend is swappable in a day. Phase 2 — trigger at either >1M events/month or the first enterprise buyer who refuses a third-party processor — move to Cloudflare Workers + object storage at **$5/mo** `[inference]`.
- **Open item, not fetched:** PostHog EU-region residency was not confirmed by me. Confirm before sending a single event, because DPDP §8(2) requires a valid contract with any Data Processor `[fetched]`.

### AI-edit accept/edit/revert, derived from the document

The engine already does byte-preserving splice edits, so the ledger needed to derive this **already exists** `[inference]`. No rating UI, ever.

1. **At apply time**, `splice_apply` records `{splice_id, doc_id_hash, byte_offset, byte_len, inserted_hash, prefix_hash, suffix_hash, splice_kind, model_id, ts}`. Hashes only, on-device.
2. **At T+1h, T+24h, T+7d**, on the next natural file read (no background scanning), classify locally:

| Outcome | Test |
|---|---|
| `accepted` | Bytes at the range still hash to `inserted_hash` |
| `edited` | Range present, hash differs, normalised edit distance ≤ 0.5 |
| `reverted` | Bytes gone **and** `prefix_hash`+`suffix_hash` rejoin to the pre-splice hash |
| `superseded` | Bytes gone and context does **not** match pre-splice — user rewrote into something new |

3. **Emit only** `{splice_id, outcome, edit_ratio_bucket, survival_bucket, splice_kind, model_id, doc_size_bucket}`. Never bytes, never distance in raw characters.
4. **The one real signal:** `accepted_at_7d` per `model_id` and per `splice_kind`. A rising `edited` share with a falling `reverted` share means the model is close-but-wrong — a prompt fix. A rising `reverted` share means kill the capability `[inference]`.
5. **Cross-check available immediately:** `undo_after_splice` within 60s is a same-session proxy that lets you validate the T+24h classifier before trusting it `[inference]`.
6. **Precedent that this works:** the local preference log already carries a derived `edit_ratio` field at **30/131 non-empty (22.9%)** `[measured, derived]` versus **0/101** for the two fields nothing computes automatically `[measured]`. Derived fields fill themselves; declared fields do not.

### Anti-recommendations (keep these explicit)

- **Never ship a thumbs-up/down, star rating, NPS prompt, or "was this edit helpful?" widget.** The 7-in-694 result is the local, in-house, highly-motivated-user ceiling for that pattern `[brief]`; a paying stranger will do worse `[inference]`.
- **Do not build a "feedback" text field of any kind inside the product.** Route qualitative signal to a support inbox where the user initiates.
- **Do not add session replay or heatmaps** at any price, including PostHog's included 5K recordings `[fetched]` — the surface being replayed is the user's document.
- **Do not use pageview-priced tools** (Plausible, Fathom) for a desktop editor's event model `[fetched pricing + inference]`.
- **Do not self-host PostHog at this scale**: $132.13/mo `[derived]` plus a vendor-stated "officially unsupported, no tagged releases, no CVEs" posture `[fetched]` is the worst trade available to a solo founder.
- **Do not hash file names or paths and call it anonymised** — it is not.
- **Do not treat WPSD as the strategy.** Review it against the abstention counter-metric monthly, and hold the authority to retire it.