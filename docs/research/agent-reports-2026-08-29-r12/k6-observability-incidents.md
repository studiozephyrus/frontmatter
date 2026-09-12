Verified again read-only: this session made zero writes and zero commits — `~/.claude` HEAD is still `6e390828` and `frontmatter` HEAD is still `e3f3b19`, and every dirty path (settings.json, 9 modified + 8 untracked `skills-src` entries, incl. a `.bak-20260810T013353Z` file) predates this run; my only commands were `curl`, `grep`/`sed`/`awk`, `python3` arithmetic, and read-only `git status`/`git log`.

### Evidence key
`[fetched]` primary source opened with curl on **2026-08-29 (UTC 01:17, Saturday** — `date -u`/`date -j`, verified `[measured]`). `[measured]` executed in this repo. `[derived]` arithmetic shown. `[SS]` search summary. `[inference]` reasoning.

### 0. Measured baseline — what frontmatter has today
| Fact | Value |
|---|---|
| Observability packages in `package.json` | **0** of 47 deps + 21 devDeps — no `@sentry/*`, `@opentelemetry/*`, pino, winston, axiom, logtail `[measured]` |
| Sentry/instrumentation config files at repo root | none (`sentry*.ts`, `instrumentation*.ts` absent) `[measured]` |
| `src` surface | 226 `.ts`/`.tsx` files; **15** `console.log|error|warn` call sites `[measured]` |
| Runtime | `next ^16.2.6`, `react ^19.2.6` `[measured]` |
| Stack mismatch | `firebase.json`, `firestore.rules`, `firestore.indexes.json` at root vs stated Cloudflare R2 + Workers stack — reconcile *before* instrumenting, or you will instrument two backends `[measured]` |

Consequence: greenfield. Every rule below is enforceable from commit one, which is the only time PII scrubbing is cheap `[inference]`.

### 1. Error tracking — priced 2026-08-29
| Vendor | Free tier | Paid entry | Retention | Overage |
|---|---|---|---|---|
| **Sentry** | Developer $0, **1 user**, 5k errors, 5 GB logs, 5 GB app metrics, 5M spans, 50 replays, 1 uptime monitor, 1 cron monitor | **Team $26/mo billed annually ($312/yr)**; Business $80/mo annual ($960/yr) `[fetched]` | Developer 30-day lookback; Team/Business **up to 90-day** lookback; backups deleted 90 days after creation `[fetched]` | errors 50K–100K **$0.0003625/error**; logs **+$0.50/GB**; uptime +$1.00/monitor; cron +$0.78/monitor `[fetched]` |
| **GlitchTip hosted** | $0 up to **1,000 events/mo**, unlimited projects + members | Small **$15/mo** ≤100k events; Medium **$50/mo** ≤500k; Large **$250/mo** ≤3M `[fetched]` | not published on pricing page `[fetched]` | event = Issues + Uptime checks + Performance txns + Releases (per MB) `[fetched]` |
| **GlitchTip self-hosted** | free, run on your own server; EU instance (Germany) offered for hosted `[fetched]` | infra only | you set it | — |
| **Rollbar** | $0, 5K occurrences + 1K replays, **30-day** retention `[fetched]` | Essentials: vendor worked example "5-person startup … 50K events/month pays roughly **$48/month** (events $29 + 5K session replays $14 + 15K AI credits $5)" `[fetched]` | Essentials **90 days**, Advanced **180 days** `[fetched]` | on-demand occurrences/sessions with overage budgets `[fetched]` |
| **Bugsnag / SmartBear Insight Hub** | $0 | page renders **"STARTING AT $0/month"** with an events slider; **no static price obtainable via curl** `[fetched]` — do not quote a number | not published statically | — |

**Recommend:** Sentry Developer ($0) until the first paying cohort, then Team at $312/yr. **Anti-recommend:** do *not* self-host GlitchTip. A solo founder self-hosting the thing that tells you production is broken has coupled the alarm to the building; and GlitchTip counts uptime checks as billable events, so its cheap tier evaporates the moment you add monitoring `[fetched + inference]`.

### 2. Uptime & synthetic monitoring — priced 2026-08-29
| Vendor | Free | Paid | Interval | Data retention |
|---|---|---|---|---|
| **Better Stack** | $0 — 10 monitors & heartbeats, **1 status page**, 3 GB logs @ 3 days, 3 GB traces @ 3 days, 30 GB metrics, 3 GB web events @ 3 days `[fetched]` | page shows both **"Starts at just $34"** and **"$29"** (monthly vs annual, not disambiguated in static HTML — **unresolved**); +$9/responder/mo; extra public status page $15/mo ($12 annual) `[fetched]` | not in static HTML | per-source configurable `[fetched]` |
| **Checkly** | Hobby $0 — 10 uptime monitors, **10,000 API + 1,000 browser check runs/mo** `[fetched]` | Starter **$24/mo billed annually**; Team **$64/mo billed annually** `[fetched]` | — | — |
| **UptimeRobot** | $0 — **50 monitors**, 5-min interval, 1 status page, **3-month** retention `[fetched]` | Solo $10 mo / **$9 annual ($108/yr)**; Team $41/**$35 ($420/yr)**; Scale $77/**$65 ($780/yr)** `[fetched]` | 5 min → 60s → 30s → 15s `[fetched]` | 3 / **12** / 24 / 24 months `[fetched]` |
| **Cronitor** | $0 — 5 monitors, basic status page `[fetched]` | **$2/mo per monitor + $5/mo per user**, no minimum; status pages **$25/mo per page** ($50 tier); RUM $10/mo per 100k events; browser checks $1/mo per 1,000 `[fetched]` | — | — |

`[derived]` Checkly overages: browser $6.50/1k (Starter) vs $6.25/1k (Team); API $2.60/10k vs $2.50/10k; extra monitors $8 per block of 25 `[fetched]`.
**Source disagreement, recorded not resolved:** Checkly's own FAQ uses "$40 per month" and "$80 per month" for Team in a hypothetical about price changes, while the plan cards read $24 and $64 billed annually `[fetched]`. UptimeRobot page `dateModified 2026-08-10` `[fetched]`.

**Recommend:** UptimeRobot Solo ($108/yr) for external liveness + Sentry's 1 included cron monitor for the nightly job. **Anti-recommend:** Checkly at this stage. Monitoring-as-code with Playwright browser checks is the right answer at 10 engineers and pure overhead at one — every browser check you write is a second codebase that breaks when your editor UI changes, and a failing check you no longer trust is worse than no check `[inference]`.

### 3. Status pages — priced 2026-08-29
| Option | Price |
|---|---|
| Better Stack | 1 page included free; additional **$15/mo** ($12 annual) `[fetched]` |
| Atlassian Statuspage | Hobby **$29/mo**, Startup **$99/mo**, Business **$399/mo**, Enterprise **$1,499/mo**; audience-specific Starter $79 / Growth $249 / $599 / Enterprise $1,499 `[fetched]` |
| OpenStatus | free tier; Starter **$30/mo** ($300/yr ≈ $25/mo), Pro **$100/mo** ($1,000/yr ≈ $83/mo), Scale **$500/mo**; extra page +$20/mo; white-label $300/mo; SSO/SAML $250/mo `[fetched]` |
| Cronitor | **$25/mo per page** `[fetched]` |
| Instatus | only `freePlanPrice: "$0/month"` extractable; paid tiers are client-rendered — **not obtained**, do not quote `[fetched]` |

**Recommend:** the free Better Stack page on `status.frontmatter.<tld>`. **Anti-recommend:** Statuspage Hobby at $29/mo — that is 93% of a Sentry Team seat ($29 vs $26/mo `[derived]`) for a page nobody visits until the day it is down `[inference]`.

### 4. Log stores — priced 2026-08-29
| Option | Included | Retention | Beyond |
|---|---|---|---|
| **Cloudflare Workers Logs** | included in **both Free and Paid** Workers plans; Free **200,000 log events/day** | **Maximum log retention period: 7 days** `[fetched]` | `head_sampling_rate` default **1** (100%), settable to e.g. 0.01 `[fetched]` |
| Workers Paid | account minimum **$5/mo** `[fetched]` | — | Workers Logpush paid-only; requests 10M/mo, +$0.05/million `[fetched]` |
| **Axiom** | Personal **$0/mo**, 30-day retention; Axiom Cloud **$25/mo** platform fee incl. 1 TB data loading, 100 GB-hours query, 100 GB storage | configurable on Cloud | ingest **from $0.12/GB**; SSO +$100/mo, RBAC +$50/mo, Audit Log +$50/mo `[fetched]` |
| Sentry Logs | 5 GB on all tiers | tied to plan lookback | **+$0.50/GB** `[fetched]` |

### 5. The stack, and the bill
| Line | Cost |
|---|---|
| Sentry Team (annual) | $26.00/mo |
| Cloudflare Workers Paid (account minimum; Workers Logs included) | $5.00/mo |
| UptimeRobot Solo (annual) | $9.00/mo |
| Better Stack free (status page + 10 monitors as a second opinion) | $0.00 |
| Axiom Personal (30-day queryable app logs) | $0.00 |
| **Total** | **$40.00/mo → $480.00/yr** `[derived: 26+5+9+0+0]` |

Pre-revenue variant: Sentry Developer $0 + Workers Free + UptimeRobot Free + Better Stack Free = **$0/mo**, at the cost of 1 Sentry user, 5k errors/mo, 30-day lookback, 5-minute check interval `[derived from fetched tiers]`.
**Anti-recommendation:** do not buy Sentry Business ($960/yr) for the 90-day lookback. Team already carries "up to 90-day lookback" `[fetched]`; Business buys SAML/SCIM and advanced quota management, which a team of one cannot use `[fetched + inference]`.

### 6. What to instrument — the allowlist
Document content never enters telemetry. Instrument the **shape** of the operation, never its payload.

| Signal | Capture | Why |
|---|---|---|
| Splice edit | `doc_id` (opaque), `byte_len_before`, `byte_len_after`, `range_start`, `range_len`, `outcome ∈ {applied, refused}`, `refusal_code` | The engine's contract is "locate bytes, replace, or REFUSE" — offsets and a refusal code fully characterise a bug without a byte of text `[inference]` |
| Parse/round-trip | `bytes_in`, `ast_node_count`, `roundtrip_byte_identical: bool`, `first_divergence_offset: int` | An offset localises the defect; the bytes at that offset are the user's `[inference]` |
| Degradation cert | `engine_id`, `rule_id`, `severity`, `count` | Certification is per-rule, not per-document |
| Sync / R2 | `op`, `status`, `size_bucket`, `latency_ms`, `r2_key_hash` | Hash the key: object keys leak filenames, and filenames leak document subject matter `[inference]` |
| Auth | `user_id` (internal, not email), `provider`, `outcome` | next-auth v5 |
| AI SDK v6 | OTel `gen_ai.*` **Required/Recommended only** — see below |

### 7. What is forbidden — and the exact mechanism that enforces it
**Forbidden to capture, anywhere:** document bytes, document titles/filenames, markdown fragments, CodeMirror selection text, clipboard, R2 object keys in cleartext, AI prompts/completions, exception `.value` strings from the engine, `logentry.formatted`, DOM text in replays, request/response bodies, `abs_path` from user machines (Tauri), email addresses.

**Sentry mechanisms `[fetched docs.sentry.io 2026-08-29]`:**
- Server-side scrubbing is **on by default**; it scrubs credit-card-shaped values and any key *or value* containing: `password, secret, passwd, api_key, apikey, auth, credentials, mysql_pwd, privatekey, private_key, token, bearer`. **None of these match markdown**, so defaults protect you from nothing here.
- **Advanced Data Scrubbing** takes precedence over other server-side rules. The three rules that actually implement the document constraint:
  `[Remove] [Anything] from [exception.values.*.value]`
  `[Remove] [Anything] from [logentry.formatted]`
  `[Mask] [Anything] from [$frame.*]`
  Documented gotcha: `[Mask][Anything] from [$frame.**]` will **not** scrub `filename` or `abs_path` — they are not in the default PII fields; add them explicitly `[fetched]`.
- **"Additional Sensitive Fields" is substring-matched.** Sentry's own example: entering `exp` removes the string "Unexpected error" from events `[fetched]`. This is the substring-vs-boundary class; do not use it for short tokens.
- **Geo is derived from IP even when IP storage is off** — killing it requires an Advanced rule `[fetched]`.
- SDK-side: `beforeSend` (return `null` to drop), `beforeSendTransaction`, `beforeSendSpan`, **`beforeBreadcrumb`** (return `null` per-crumb), `ignoreErrors`, `allowUrls`/`denyUrls`, `thirdPartyErrorFilterIntegration` (browser SDKs ≥ v8) `[fetched]`.
- **`sendDefaultPii` defaults to `false`, is deprecated, and is removed in v11 — replaced by `dataCollection`, and "passing `dataCollection` opts you into the more permissive `dataCollection` defaults"** `[fetched, verbatim]`. This is a silent privacy regression on a major-version bump: pin the SDK and opt out of each category explicitly at migration.
- **Source maps:** Next.js SDK option `sourcemaps.deleteSourcemapsAfterUpload` defaults to **`true`**; client maps are deleted after upload, **server maps are kept for runtime error reporting** `[fetched]`. Keep the default; never ship client maps to the CDN.

**OpenTelemetry `gen_ai` `[fetched open-telemetry/semantic-conventions-genai, main, 2026-08-29]`** — the conventions **moved** out of `semantic-conventions` into `semantic-conventions-genai`, status **Development, not Stable**:
- Required: `gen_ai.operation.name`, `gen_ai.provider.name`. Span name `{gen_ai.operation.name} {gen_ai.request.model}`, kind CLIENT.
- Safe Recommended set: `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, `gen_ai.usage.reasoning.output_tokens`, `gen_ai.response.model`, `gen_ai.response.id`, `gen_ai.response.finish_reasons`, `gen_ai.response.time_to_first_chunk`, `gen_ai.request.temperature/max_tokens/top_p`.
- **Opt-In (off by default, and must stay off):** `gen_ai.input.messages`, `gen_ai.output.messages`, `gen_ai.system_instructions`, `gen_ai.prompt.variable`, `gen_ai.tool.definitions` `[fetched]`.
- Spec text, verbatim: *"OpenTelemetry instrumentations SHOULD NOT capture them by default, but SHOULD provide an option for users to opt in."* Pattern 1 of 3 is *"[Default] Don't record instructions, inputs, or outputs."* `[fetched]`

**Recommend:** pattern 1, permanently, in every environment including staging. **Anti-recommend:** pattern 2 ("only in pre-production") — staging in a solo shop is where you paste a real user's failing document to reproduce their bug, which is exactly how document content reaches a telemetry store `[inference]`.

### 8. SLOs a solo founder can honestly commit to
SLI form, from the source: *ratio of good events to valid events*; error budget = 100% − SLO; keep to **five or fewer** SLI types; use multiple latency thresholds `[fetched sre.google/workbook/implementing-slos]`.

| # | SLI (good/valid) | Internal SLO | Monthly budget |
|---|---|---|---|
| 1 | **Document durability** — saves acknowledged that survive a read-back | **99.99%** | 4.3 min `[derived: 0.0001×30×24×60]` |
| 2 | **Splice correctness** — splices that are byte-exact or an explicit REFUSE (never a silent wrong write) | **100%, zero-tolerance** | 0 — any breach is a P1 |
| 3 | Save/API availability — non-5xx on write path | **99.5%** | **216 min = 3.60 h** `[derived]` |
| 4 | Editor load latency — p90 < 1s, p99 < 3s | 99.0% | 432 min `[derived]` |
| 5 | Read availability (open a doc) | 99.9% | **43.2 min** `[derived]` |

**Publish only #3 and #5, as 28-day trailing measured numbers with the measurement method stated.** Publish "measured from an external prober every 60s from 1 region" — not "99.9% uptime guaranteed."
**Anti-recommendation:** never publish a *contractual* SLA with credits as a solo founder. A 99.9% availability SLA gives you 43.2 minutes/month `[derived]`; a single Cloudflare regional incident plus your sleep cycle exceeds it, and you will be paying credits for someone else's outage. Publish measured history, promise nothing `[inference]`.
**Anti-recommendation:** do not set an SLO on the AI features. They depend on a third-party model endpoint you do not control; an SLO you cannot defend is a lie with a dashboard.

### 9. Alerting — what earns a 3am wake-up
Burn-rate policy, from source: *"2% budget consumption in one hour and 5% budget consumption in six hours as reasonable starting numbers for paging, and 10% budget consumption in three days as a good baseline for ticket alerts"* `[fetched sre.google/workbook/alerting-on-slos]`.
`[derived]` burn rates: 2%/1h → **14.4×**; 5%/6h → **6×**; 10%/3d → **1×**. (The book's earlier fixed-window example, 5% of a 30-day budget in 1h, is a burn rate of **36** `[fetched]`.)

**Page (phone, DND-override, 3am):**
| Rule | Rationale |
|---|---|
| Write path 5xx burn rate **≥14.4× over 1h** AND ≥6× over 5m | Documents are failing to save; data at risk |
| **Any** splice integrity violation — a write that is neither byte-exact nor a REFUSE | Zero-budget SLI; silent corruption is unrecoverable |
| R2 write error rate > 1% for 5 min | The file is the source of truth |
| Auth totally down (0 successful logins in 10 min during a period with >0 attempts) | Nobody can reach their documents |
| Uptime prober: 3 consecutive failures from ≥2 regions | Kills single-prober false positives |

**Ticket (business hours, no notification sound):** 10% budget in 3 days (1× burn); read-path latency regression; cron/heartbeat miss on a non-critical job; new error *type* first seen; SSL/domain expiry (UptimeRobot alerts at 30/14/7 days `[fetched]`); Sentry quota at 80%.

**Never alert:** individual client-side JS exceptions; error *count* thresholds untied to a budget; single-region prober failure; CPU/memory on serverless; deploy notifications; any alert that has fired >2× without action.
**Anti-recommendation:** do not route pages through Slack or email. Both are DND-suppressed and neither escalates. **Anti-recommendation to the anti-recommendation:** do not buy PagerDuty either — Better Stack's free tier includes incident management and on-call with unlimited phone/SMS alerts, at +$9/responder/mo for additional responders `[fetched]`; for one responder that is $0.

### 10. Log retention, reconciled with DPDP / GDPR / CERT-In
| Instrument | Requirement | Direction |
|---|---|---|
| **GDPR Art 5(1)(e)** | personal data *"kept in a form which permits identification of data subjects for no longer than is necessary"* `[fetched gdpr-info.eu]` | ceiling |
| GDPR Art 5(1)(c) | *"limited to what is necessary"* (data minimisation) `[fetched]` | ceiling |
| **GDPR Art 33(1)** | breach notified to the supervisory authority *"without undue delay and, where feasible, not later than 72 hours"*; if late, **reasons for the delay** must accompany it (33(2)) `[fetched]` | clock |
| **DPDP Act 2023 s.8(7)** | erase personal data on consent withdrawal **or as soon as it is reasonable to assume the specified purpose is no longer being served, whichever is earlier**, unless retention is necessary for compliance with law; s.8(7)(b) **cause your processor to erase** too `[fetched, MeitY gazette PDF, Act No. 22 of 2023, assent 11 Aug 2023]` | ceiling + processor obligation |
| DPDP Act s.8(6) | intimation of breach to **the Board and each affected Data Principal**, form/manner as prescribed — the Act itself sets **no hour count** `[fetched]` | clock |
| **CERT-In Directions 28.04.2022 (s.70B(6) IT Act)** | report cyber incidents **within 6 hours of noticing**; **enable logs of all ICT systems and maintain them securely for a rolling period of 180 days, within Indian jurisdiction**, produced to CERT-In on incident or order `[fetched cert-in.org.in PDF]` | **floor** |

**The conflict is real:** CERT-In imposes a 180-day *floor* on security logs for an Indian body corporate; GDPR/DPDP impose *ceilings* on personal data. Resolution — two ledgers, different lifetimes:

| Class | Contents | Retention | Store |
|---|---|---|---|
| **Security/audit log** | timestamp (NTP-synced to NIC/NPL per the same directions `[fetched]`), request id, opaque `user_id`, action verb, source ASN, outcome. **No document bytes, no filenames, no email, no IP in cleartext.** | **180 days**, India region, write-once | R2 bucket, IN jurisdiction, object-lock |
| **Application/debug log** | structured JSON, no free-text user content | **7 days** (Cloudflare Workers Logs maximum `[fetched]`); mirror to Axiom Personal for 30 days if needed `[fetched]` | Workers Logs / Axiom |
| **Error events** | scrubbed per §7 | **30 days** on Developer, ≤90 on Team `[fetched]`; set the shortest that supports your debugging | Sentry |
| **Traces / gen_ai** | Required + Recommended attributes only | 7–30 days | Workers/Axiom |
| **Document content** | — | **never in telemetry** | R2 only |

`[inference]` The 180-day CERT-In log is defensible under GDPR Art 5(1)(e) only because it contains no content and its identifiers are opaque; the moment a filename lands in it, it becomes a 180-day personal-data retention you cannot justify.
**Anti-recommendation:** do not set Sentry retention to the maximum "because storage is free." Every extra day is 24 more hours in which a scrubbing gap you have not yet found is holding a user's paragraph `[inference]`.

### 11. Incident runbook skeleton
1. **Declare** — any page, or any user report of data loss. One-line declaration in the incident channel: `INC-YYYYMMDD-NN | sev | one-line symptom | commander: me`.
2. **Sev**: **SEV1** document loss/corruption or writes failing globally → status page within **15 min**. **SEV2** degraded (reads OK, writes slow) → status page within 60 min. **SEV3** cosmetic/single-user → no page.
3. **Stabilise before diagnose** — roll back the deploy first; the cause can wait, the user's file cannot.
4. **Is it a breach?** If personal data was exposed: start **two clocks** — CERT-In **6 hours** from noticing `[fetched]`, GDPR **72 hours** to the supervisory authority `[fetched]`, plus DPDP intimation to the Board *and each affected Data Principal* `[fetched]`. Do not wait for root cause to file; Art 33(2) permits a late filing only *with reasons* `[fetched]`.
5. **Evidence** — capture the 180-day security log slice **before** any remediation touches it.
6. **Comms** — status page updates every 30 min even when the update is "still investigating". Never name a customer.
7. **Resolve** — verify with the SLI, not with a page refresh.
8. **Post-mortem within 5 business days**, blameless, fixed sections: timeline (UTC, with the IST offset written out, `IST = UTC + 5:30`), impact in error-budget minutes consumed, detection latency (page fired at − incident began at), what worked, what did not, action items with owners and dates, and **"what would have caught this 10 minutes earlier."**
9. **Feed back** — every post-mortem either adds a burn-rate alert or deletes one. Net alert count must not grow monotonically.

### 12. Anti-recommendations (consolidated)
| Do not | Because |
|---|---|
| Enable Sentry **Session Replay** | It records the DOM. Your DOM *is* the user's document. The 5,000-free-replays promotion `[fetched]` is the most expensive free thing on this list `[inference]` |
| Turn on `sendDefaultPii` / accept `dataCollection` defaults on the v11 upgrade | Defaults get *more* permissive at that boundary, by Sentry's own doc `[fetched]` |
| Ship client source maps publicly to "debug faster" | `deleteSourcemapsAfterUpload` defaults `true` for a reason `[fetched]`; public maps hand an attacker your splice-engine internals |
| Use Sentry "Additional Sensitive Fields" for short tokens | Substring match; `exp` removes "Unexpected error" `[fetched]` |
| Log the R2 object key | Keys carry filenames; filenames carry subject matter `[inference]` |
| Adopt Datadog / New Relic / Grafana Cloud | Not priced here, and per-host + per-custom-metric models punish a Workers-shaped app; Better Stack's own comparison quotes a Datadog-equivalent at **$55,574** vs **$687** `[fetched — vendor-authored comparison, treat as marketing]` |
| Build a custom dashboard | Sentry Developer includes 10 custom dashboards, Team 20 `[fetched]`; a dashboard you built is a dashboard you maintain |
| Adopt the `gen_ai` conventions as stable | They are marked **Development** and **moved repositories** between the two OTel repos `[fetched]` — pin the version and expect churn |
| Alert on error *counts* | Decoupled from user impact; the source's own critique: *"A 0.1% error rate for 10 minutes would alert, while consuming only 0.02% of the monthly error budget"* `[fetched]` |
| Promise a contractual SLA | 99.9% = 43.2 min/month `[derived]`; you sleep |
| Enable `head_sampling_rate: 1` in production forever | Default is 1 (100%) `[fetched]`; Workers Free caps at 200,000 events/day `[fetched]` — sample before you hit the wall, not after |

### 13. Unresolved / not obtained (stated rather than invented)
- Better Stack paid entry price: page shows **both "$34" and "$29"** with no static monthly/annual label `[fetched]`.
- Bugsnag/Insight Hub and Instatus paid prices: client-rendered; **not obtained** `[fetched]`.
- Checkly Team price: plan card **$64/mo annual** vs FAQ hypothetical **$80/month** `[fetched]` — disagreement recorded.
- **DPDP Rules, 2025**: could not be opened (`meity.gov.in` candidate paths returned 404; `indiacode.nic.in` 404; `egazette.gov.in` failed TLS verification) `[measured]`. Any specific breach-notification hour count or class-based retention period attributed to the Rules here would be **unverified** — the Act text above is what was actually opened. Verify the Rules before writing a retention schedule into a DPA.
- Sentry monthly-vs-annual: page JSON-LD lists Team **$29/mo** and Business **$89/mo** monthly against $312/yr and $960/yr annual `[fetched]`; `[derived]` 312/12 = 26.0 and 960/12 = 80.0, matching the rendered annual cards.