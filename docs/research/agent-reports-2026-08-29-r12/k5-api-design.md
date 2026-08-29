### Evidence ledger — what was actually opened (all `curl`, 2026-08-29)

| Source | Method | Status |
|---|---|---|
| RFC 9457 Problem Details (July 2023, obsoletes 7807) | `curl rfc-editor.org` | [fetched] |
| RFC 9745 Deprecation header (March 2025, Standards Track) | `curl rfc-editor.org` | [fetched] |
| RFC 8594 Sunset header (May 2019, **Informational**) | `curl rfc-editor.org` | [fetched] |
| `draft-ietf-httpapi-idempotency-key-header` rev **07**, expires 2026-04-18, `rfc_number: null` | IETF Datatracker API | [fetched] — **not an RFC** |
| `draft-ietf-httpapi-ratelimit-headers` rev **11**, expires 2026-11-24, `rfc_number: null` | IETF Datatracker API | [fetched] — **not an RFC** |
| GitHub supported versions = `["2026-03-10","2022-11-28"]` | `GET api.github.com/versions` | [measured] |
| GitHub unauth limit `x-ratelimit-limit: 60` | live response headers | [measured] |
| GitHub docs: api-versions.md, breaking-changes.md, rate-limits, pagination, REST-vs-GraphQL | raw.githubusercontent.com | [fetched] |
| Notion versioning + request-limits (`.md` variants) | developers.notion.com | [fetched] |
| Sanity `api-versioning.md` | sanity.io/docs | [fetched] |
| Stripe `versioning.md`, `upgrades.md`, idempotent_requests | docs.stripe.com | [fetched] |
| Contentful `x-contentful-ratelimit-second-limit: 78` on public demo space `cfexampleapi` | live response headers | [measured] |
| Contentful docs pages | blocked by **Vercel Security Checkpoint** | [measured] — unreachable |
| Dropbox performance guide (rate limits, namespace write lock) | developers.dropbox.com | [fetched] |
| Google Docs API limits (incl. **Docs MCP server quotas**) | developers.google.com | [fetched] |
| Slack Web API rate limits (4 tiers) | docs.slack.dev | [fetched] |
| Shopify rate limits (leaky bucket, points/sec) | shopify.dev | [fetched] |
| Cloudflare R2 pricing (page "Last updated Aug 7, 2026") | developers.cloudflare.com | [fetched] |
| Cloudflare Workers pricing (page "Last updated Aug 28, 2026") | developers.cloudflare.com | [fetched] |
| Linear rate-limiting page | JS-rendered, regex extraction timed out | [measured] — **not obtained; do not cite Linear numbers** |

### 1. Recommended shape — REST, resource-oriented, with three RPC verbs

- **REST for the noun layer, RPC for the three operations that are not CRUD.** Our unit is a file; files are a natural REST resource. But `locate`, `splice`, and `cert-check` are not creates or updates — they are *procedures with refusal semantics*. Modelling a refusal as a failed PUT loses the refusal reason. [inference]
- **Precedent for the hybrid:** Notion "follows RESTful conventions when possible" and still ships `POST /v1/search` and `POST .../query` as verbs [fetched]. Dropbox is RPC-only over POST [fetched].
- **Reject GraphQL.** GitHub's own comparison page argues GraphQL's win is *avoiding overfetch across nested collections* — 11 REST calls collapsing to 1 [fetched]. Our nesting depth is 2 (vault → file) and our payload is opaque bytes, which GraphQL cannot shape. GraphQL also forces cost-based rate limiting: Shopify runs 100 points/sec (Standard) → 200 (Advanced) → 1000 (Plus) → 2000 (enterprise) on a leaky bucket precisely because query cost is unbounded [fetched]. A solo founder should not be building a query-cost estimator. [inference]
- **Bytes are the response body, not a JSON string field.** `Accept: text/markdown` returns the file verbatim; `Accept: application/json` returns an envelope. A byte-preserving engine that base64s or JSON-escapes its own output has already broken its promise in the transport. [inference]

**Anti-recommendation:** do *not* ship GraphQL "for the AI clients." Anthropic's July 2026 MCP revision went stateless and deprecated Roots/Sampling/Logging — tools are the lowest common denominator [fetched, repo plan §L2]. Agents consume tools, not schemas.

### 2. What the comparable document APIs actually did

| Product | Versioning | Mechanism | Support window | Read |
|---|---|---|---|---|
| **Stripe** | Date + codename; current `2026-08-26.dahlia` | `Stripe-Version` header, account-level default set on first request | Not published in the pages opened | [fetched] |
| **GitHub** | Date; 2 live versions today | `X-GitHub-Api-Version`; unsupported → **410 Gone** | **≥24 months** after successor ships | [fetched] |
| **Notion** | Date; current `2026-03-11` | `Notion-Version` header, **required on every request** | Not stated on the page | [fetched] |
| **Sanity** | Date **in the URL path** (`/v2026-06-24/...`); any past date valid | Client config `apiVersion` | Old versions frozen "to the best of our ability" | [fetched] |
| **Dropbox** | Major in path (`/2/`), stable for a decade | Path | n/a | [fetched] |
| **Google Docs** | `v1` path, no date versioning | Path | n/a | [fetched] |
| **Contentful** | Media type `application/vnd.contentful.delivery.v1+json` | Content negotiation | n/a | [measured, response header] |

**Recorded source disagreement — the pin guarantee is not honoured identically:**
- Notion: additive changes "apply to **every** API version at the same time, including older ones: pinning `Notion-Version` does not delay them" [fetched].
- Sanity: "we try very hard"… "we may choose to introduce it also in older versions" — hedged, and explicitly admits preserving "wrong" behaviour [fetched].
- GitHub: additive changes reach all supported versions, **but** reserves the right to "introduce a breaking change to an existing version to protect users and platform integrity," possibly "without advance notice" [fetched].
- Stripe: monthly releases are backward-compatible; *major* releases (Acacia, Basil, dahlia) are not [fetched].
→ Nobody offers an unconditional freeze. Do not promise one.

### 3. Resource model and the exact v1 endpoint list

**Model (7 resources).** `vault` (repo+branch binding) → `file` (identified by **path**, never an opaque ID) → `slice` (byte range) → `version` (commit SHA) · `cert` · `job` · `webhook`.

- **Path is identity.** [inference, grounded in repo plan §L2: "identity is the *path*, stated explicitly in every call — because on claude.ai, where identity is inferred from phrasing, 'it made a new artifact instead of updating mine' is the single most documented failure" [fetched, internal].] Percent-encode; expose a `safe_key` alias for hostile paths (already queued as R0 engine work [fetched, MEMORY.md]).

| # | Endpoint | Notes |
|---|---|---|
| 1 | `GET /v1/vaults` | cursor-paginated |
| 2 | `POST /v1/vaults` | bind a git remote + installation |
| 3 | `GET /v1/vaults/{v}` | head SHA, byte size, file count |
| 4 | `DELETE /v1/vaults/{v}` | unbind only; never deletes the repo |
| 5 | `GET /v1/vaults/{v}/files` | `prefix`, `modified_since`, `cursor`, `limit` |
| 6 | `HEAD /v1/vaults/{v}/files/{path}` | cheap ETag/version probe — the polling primitive |
| 7 | `GET /v1/vaults/{v}/files/{path}` | `text/markdown` = verbatim bytes; `application/json` = envelope `{etag, version, bytes, eol, bom, encoding}` |
| 8 | `PUT /v1/vaults/{v}/files/{path}` | full replace; **`If-Match` required** |
| 9 | `DELETE /v1/vaults/{v}/files/{path}` | `If-Match` required |
| 10 | `POST /v1/vaults/{v}/files/{path}/locate` | `{anchor: heading\|frontmatter_key\|line_range\|byte_range\|regex}` → `{start,end,confidence}` or a refusal. **Read-only; free of write quota.** |
| 11 | `GET /v1/vaults/{v}/files/{path}/slice` | `?start=&end=`, also honours HTTP `Range` |
| 12 | `POST /v1/vaults/{v}/files/{path}/splice` | `{edits[], base_version, dry_run}` → `200 applied` / `409 conflict` / `422 refusal` |
| 13 | `GET .../files/{path}/versions` | cursor-paginated commits touching the path |
| 14 | `GET .../files/{path}/versions/{sha}` | bytes at that version |
| 15 | `GET .../files/{path}/diff?from=&to=` | byte-range diff, not a tree diff |
| 16 | `GET /v1/vaults/{v}/search` | `q`, `cursor`, `limit` → `{path, ranges[], snippet}` |
| 17 | `POST /v1/certs` | `202 Accepted` + job — degradation cert is CPU-heavy |
| 18 | `GET /v1/certs/{id}` | |
| 19 | `GET /v1/jobs/{id}` | one job resource for every async op |
| 20 | `POST /v1/webhooks` · 21 `GET /v1/webhooks` · 22 `DELETE /v1/webhooks/{id}` · 23 `POST /v1/webhooks/{id}/test` | |
| 24 | `GET /v1/meta/versions` | mirrors `GET api.github.com/versions` [measured] |
| 25 | `GET /v1/meta/rate-limit` | current buckets, mirrors `GET /rate_limit` |
| 26 | `GET /v1/meta/refusals` | machine-readable refusal registry; each code **is** an RFC 9457 `type` URI |

**Anti-recommendation:** no `PATCH` on `/files/{path}`. JSON Merge Patch and JSON Patch both assume a tree; we have bytes. Offering `PATCH` invites clients to send a document model we refuse to have. [inference]

### 4. Versioning and deprecation policy

- **Date-based, header-carried, required.** `Frontmatter-Version: 2027-01-15`. Copy Notion's *required* header over Stripe's account-default: an account-level implicit default means the same request from two accounts behaves differently, which is unanswerable in support [fetched, Stripe: "Your version gets set the first time you make an API request"].
- **Path stays `/v1/` forever** and means "the resource model." Sanity puts the date in the path; that makes every URL in every doc, log and cURL example version-specific [fetched]. Header for behaviour, path for shape.
- **Breaking = GitHub's list, adopted verbatim** [fetched]: removing an operation; removing/renaming a parameter or response field; adding a required parameter; making an optional one required; changing a type; removing enum values; adding a validation rule; changing auth requirements.
- **Additive = free and universal**: new endpoints, new optional params, new response fields, new enum values, new refusal codes. Clients must tolerate unknown refusal codes — state this in the contract.
- **Support window: 24 months** after a successor ships (GitHub's number [fetched]). Unsupported version → `410 Gone`.
- **Deprecation signalling: `Deprecation` (RFC 9745, Standards Track, March 2025) + `Sunset` (RFC 8594, Informational, May 2019) + `Link rel="deprecation"`.** GitHub already exposes `Deprecation` and `Sunset` in `access-control-expose-headers` [measured].
- **Honest carve-out, published in the policy:** a security or data-integrity defect may be fixed inside a pinned version without notice. GitHub reserves exactly this [fetched]; Sanity admits preserving "wrong" behaviour instead [fetched]. Pick GitHub's side and say so, because our engine's whole claim is byte fidelity — shipping a known-corrupting splice under a version pin would contradict the product.

**Anti-recommendation:** do not ship codenames. Stripe's `2026-08-26.dahlia` requires a mapping table to be useful [fetched]; one founder cannot maintain a release-naming vocabulary.

### 5. Pagination and cursors

- **Opaque forward cursor only.** `?cursor=&limit=` → `{results[], has_more, next_cursor}` — Notion's shape, with `next_cursor` present only when `has_more` is true [fetched]. `limit` default 50, max 100 (Notion caps `page_size` at 100 [fetched]).
- **Reject `Link`-header + `page=N`.** GitHub's own docs show four rel targets and a `page=515`-style deep offset [fetched]; offset pagination over a git history that rewrites on force-push returns duplicates and gaps.
- **Cursors encode `{head_sha, position}`** and hard-fail with `409` if the branch head moved incompatibly — a listing that silently spans two trees is the same class of lie as an import report claiming success while losing files.

**Anti-recommendation:** do not expose total counts on `/files` or `/search`. A count forces a full tree walk per call and becomes a promise you must keep as vaults grow.

### 6. Idempotency

- **`Idempotency-Key` on `POST /splice`, `POST /certs`, `POST /vaults` only.** Header name per `draft-ietf-httpapi-idempotency-key-header`, which is **rev 07 and still not an RFC** as of 2026-08-29 [fetched] — cite it as convention, not standard.
- **Stripe's semantics, adopted:** store status code *and* body of the first request for a given key regardless of success or failure; compare incoming parameters against the original and error on mismatch; keys ≤255 chars; POST only, never GET/DELETE [fetched]. Retention: 24h (state the number in our docs — the draft says the resource "MUST publish" its expiry policy [fetched]).
- **Status codes from the draft:** `422` for a missing/malformed key where one is required or where the payload differs; `409` for a request still in flight under the same key [fetched].
- **Our addition — the key is not enough.** `base_version` on every splice is the real guard: it enforces read-before-patch and structurally kills the drift bug where a user hand-edits and the model keeps acting on remembered bytes [fetched, repo plan §L2]. An idempotency key protects against *double delivery*; `base_version` protects against *stale intent*. Ship both.

**Anti-recommendation:** do not auto-generate a server-side key from a request-body hash. The draft's "idempotency fingerprint" is optional and MAY-level [fetched]; two legitimately identical splices (append the same line twice) are indistinguishable from a retry.

### 7. Webhooks vs polling

- **Ship both; polling is the contract, webhooks are the optimisation.** `HEAD /files/{path}` returning `ETag` + `Frontmatter-Version` costs $0.00000086/call [derived, §8] — cheap enough to be the documented baseline.
- **Webhook events (5 only):** `file.spliced`, `file.replaced`, `file.deleted`, `cert.completed`, `vault.head_moved`. Payload carries `{vault, path, version, ranges[]}` — **never the file bytes**. Bytes in a webhook body means user documents sitting in third-party logs, which is a real exposure for a solo operator storing customer documents.
- **Delivery:** HMAC-SHA256 signature over the raw body, timestamp in the signed material, at-least-once with exponential backoff, replay window 5 minutes. Slack's Events API allows 30,000 deliveries per workspace per app per 60 minutes [fetched] — a useful order of magnitude for a delivery ceiling.
- **Dropbox's warning applies directly:** its guide names "excessive polling" as a common cause of rate limiting and points users at a change-detection API instead [fetched]. Publish `vault.head_moved` early to give heavy pollers somewhere to go.

**Anti-recommendation:** no WebSocket or SSE stream in v1. Cloudflare bills a WebSocket `Upgrade` as a request [fetched] and a persistent connection turns a stateless Worker into a stateful one — the exact thing MCP's July 2026 revision walked away from [fetched, repo plan].

### 8. Rate limits by tier, with the arithmetic

**Unit prices [fetched 2026-08-29]:** Workers Standard $0.30 per additional million requests, $0.02 per additional million CPU-ms, 10M requests + 30M CPU-ms included, $5/mo account minimum. R2 Standard: Class A $4.50/M, Class B $0.36/M, storage $0.015/GB-month; free grant 1M Class A, 10M Class B, 10 GB-month.

**Marginal cost per call [derived — computed with `python3`, workload assumptions stated]:**

| Call | Composition | $/call | $/million |
|---|---|---|---|
| `read-slice` | 1 Worker req + 1 Class B + ~10 CPU-ms | 0.00000086 | **$0.86** |
| `search-vault` | 1 Worker req + 5 Class B + ~40 CPU-ms | 0.00000290 | **$2.90** |
| `cert-check` | 1 Worker req + 1 Class B + ~250 CPU-ms | 0.00000566 | **$5.66** |
| `splice-edit` | 1 Worker req + 1 Class B + **1 Class A** + ~30 CPU-ms | 0.00000576 | **$5.76** |

- **Class A is 78.1% of a splice** [derived: 4.50 ÷ 5.76]. **A write costs 6.70× a read** [derived: 5.76 ÷ 0.86]. → Rate-limit reads and writes in *separate buckets with separate prices*. A single request-per-minute number is economically wrong by nearly 7×.

**Revenue anchor [fetched, repo plan §8]:** Pro ₹299/mo nets ≈₹246–249 ≈ **$2.60**; inference budget $0.40–0.60/mo. Allocate **5% of net revenue to API infra** → Pro $0.130/mo, Power $0.260/mo [derived].

| Tier | Writes/mo | Reads/mo | Searches/mo | Certs/mo | Cost at cap | Budget | Headroom |
|---|---|---|---|---|---|---|---|
| Free (₹0) | 300 | 3,000 | 1,000 | 30 | **$0.00738** | absorbed by free grants | — |
| Pro (₹299 / $5) | 10,000 | 30,000 | 10,000 | 500 | **$0.11523** | $0.130 | $0.0148 |
| Power (₹599 / $10) | 20,000 | 75,000 | 20,000 | 1,500 | **$0.24619** | $0.260 | $0.0138 |

- Free tier at scale [derived]: **$7.38/mo per 1,000 users**, $73.78 per 10,000, $737.78 per 100,000. R2's 1M Class A grant covers **3,333** free users at 300 writes each [derived: 1,000,000 ÷ 300]; Workers' 10M included requests covers **2,309** at 4,330 calls each [derived].
- **Two independent limiters, and this is the load-bearing design point:**
  1. **Token bucket per token per minute** — the abuse guard. Free 6 writes / 60 reads per min; Pro 30/300; Power 60/600. Burst = 2× steady, leaky-bucket refill (Shopify's algorithm [fetched]).
  2. **Monthly quota** — the *margin* guard. Pro's 30 writes/min would permit **1,296,000 writes/month, 86× the quota** [derived] — proof that a per-minute limit alone cannot protect unit economics.
  3. **Per-vault write serialisation.** Dropbox: write ops acquire a namespace lock and parallel writers get `429 too_many_write_operations` [fetched]. A git repo is exactly such a namespace. Queue per vault, return `429` with `Retry-After` rather than racing commits.
- **Headers:** `RateLimit-Limit / -Remaining / -Reset` per `draft-ietf-httpapi-ratelimit-headers` **rev 11, still a draft** [fetched] — plus `Retry-After` on every 429, which is the only universally honoured signal (Notion, Slack, Dropbox all mandate it [fetched]).
- **Comparable published limits [fetched]:** Notion 3 req/s per connection + a per-workspace bucket scaled to plan, payloads capped at 1,000 block elements / 500 KB. Google Docs 3,000 reads + 600 writes per minute per project, 300/60 per user per project. Slack 1+/20+/50+/100+ per minute across four tiers, per method per workspace. GitHub 5,000/hr authenticated, 60/hr unauthenticated [measured], 100 concurrent, 900 points/min per REST endpoint (GET=1, POST/PATCH/PUT/DELETE=5), 80 content-creating requests/min and 500/hr, 90s CPU per 60s wall. Contentful demo space `x-contentful-ratelimit-second-limit: 78` [measured]. **Dropbox deliberately publishes nothing** [fetched] — a live disagreement in industry practice.

**Anti-recommendation:** do not adopt Dropbox's opacity. It works for an incumbent with a support org; for a solo founder it converts every limit question into a support ticket. Publish the table.

### 9. Authentication for third-party apps

| Credential | Use | Scopes |
|---|---|---|
| **PAT** (`fm_pat_…`) | scripts, CI, the user's own agent | vault-scoped, verb-scoped, expiring (max 1 year), single-shot display |
| **OAuth 2.1 + PKCE** | third-party apps acting *as a user* | same scope vocabulary, refresh tokens, revocable per app |
| **Installation token** | our own MCP server and first-party clients | short-lived, minted from the OAuth grant |

- **Scope vocabulary (6):** `vault:read` · `vault:write` · `slice:read` · `slice:write` · `cert:run` · `webhook:manage`. `slice:write` without `vault:write` is the interesting grant — an agent that may splice inside existing files but may not create, replace or delete them.
- **Open blocker, already logged internally:** `read:user` grants no repo access, "which blocks the GitHub-App path as written" [fetched, repo plan §14 item 4]. Resolve before publishing scope docs; the API's write path depends on it.
- **Precedent:** Notion accepts three credential types — internal installation token, OAuth token, PAT [fetched]. GitHub folds OAuth-app requests into the *user's* 5,000/hr bucket, shared with the user's own PAT [fetched] — copy this, so one user cannot multiply quota by registering apps.

**Anti-recommendation:** no long-lived non-expiring PATs, and no API keys in query strings. Contentful's demo space passes `?access_token=` in the URL [measured] — that value lands in every proxy log on the path.

### 10. Error format — RFC 9457, with a refusal extension

- **`Content-Type: application/problem+json`**, members `type`, `title`, `status`, `detail`, `instance` (RFC 9457, July 2023, obsoletes RFC 7807) [fetched].
- **Extension members are where our product lives:** `refusal_code`, `byte_range`, `observed`, `expected`, `corrected_example`. RFC 9457 §3.2 explicitly permits extension members [fetched].
- **The refusal registry at `/v1/meta/refusals` makes `type` dereferenceable** — every refusal URI resolves to a page explaining the rule and showing a corrected call, which is already the stated MCP behaviour [fetched, repo plan §L2].
- **Status mapping:** `409` = `base_version` stale or vault head moved · `422` = engine refused (ambiguous anchor, invalid UTF-8 boundary, zero-indent sequence, bare CR) · `410` = version sunset · `429` = either limiter · `413` = payload over cap.

**Anti-recommendation:** do not ship a bespoke `{error: {code, message}}` envelope. Notion's is `{"object":"error","code":"rate_limited"}` with `additional_data.rate_limit_reason` [fetched] — perfectly good, and exactly the kind of house format RFC 9457 exists to stop proliferating.

### 11. API and MCP — two surfaces, one engine

- **One engine core, two adapters, and the split is real.** [inference]

| | REST API | MCP server |
|---|---|---|
| Caller | code the developer wrote | a model choosing at runtime |
| Granularity | 26 endpoints | 5 consolidated verbs, hard-capped well under 20 [fetched, repo plan] |
| Response | complete envelope, client formats it | **verdict-first**, prose-shaped, refusals name the rule with a corrected example [fetched, repo plan] |
| Errors | RFC 9457 problem+json | ≤200-char actionable NL hint |
| Auth | OAuth/PAT with scopes | installation token derived from the same grant |
| Versioning | date header, 24-month window | tool-shape stability; MCP has no version negotiation for tool schemas |

- **Precedent that this is normal:** Google's Docs MCP server does **not** get its own quota system — "the Docs MCP server uses read and write request metrics," the same 3,000/300 read and 600/60 write buckets as the REST API [fetched]. Copy this exactly: **one quota ledger, two front doors.** A user who exhausts writes via MCP must find them exhausted via REST.
- **MCP is a strict subset.** Every MCP tool maps to REST endpoints — `land` = `locate` + `splice` (or `PUT`) + `cert` in one call; `read-slice` = #11; `search-vault` = #16; `cert-check` = #17/#18. Nothing exists only in MCP. This keeps the refusal registry, the quota meter, and the audit log single-sourced.

**Anti-recommendation:** do not expose the REST API *through* MCP as a generic `http_request` tool, and do not generate MCP tools from an OpenAPI spec. Twenty-six auto-generated tools blows the sub-20 cap [fetched, repo plan] and past ~30 tools quality degrades measurably.

### 12. What NOT to expose

| Not exposed | Why |
|---|---|
| A **document tree / AST** endpoint | `blocksToMarkdownLossy()` is a real function name in BlockNote's API — "the market confessing" [fetched, repo plan §14]. Publishing a tree makes it a contract we must keep byte-reversible forever. |
| **Rendered HTML** | Every view is a deterministic projection of the file; shipping the projection as an API resource invites clients to treat it as canonical and round-trip through it. [inference] |
| **Arbitrary git operations** (force-push, branch delete, rebase, `git gc`) | Destructive, unbounded blast radius, and unrelated to the product's unit. |
| **Server-side code execution / templates / user-supplied transforms** | Settled product constraint: no arbitrary client-side code execution, no plugin marketplace [fetched, repo plan §14]. An API `transform` endpoint is that decision reversed via the back door. |
| **Raw AI inference passthrough** | At $0.40–0.60/mo of inference budget per Pro subscriber [fetched, repo plan §8], an unmetered `/complete` endpoint is unbounded loss. AI stays BYO-key or metered in-product. |
| **Bulk vault export as one call** | Egress is free on R2 [fetched] but Class B and CPU are not; a whole-vault dump is a git clone, and git already does it better. Offer `GET /files` + per-file reads, or a signed `git clone` URL. |
| **Total counts, offset paging, cross-vault search** | Each forces a full walk per request; all three are promises that get more expensive as customers grow. |
| **Webhook payloads containing file bytes** | Puts user documents into third-party logs. |
| **Internal provenance records** (`promptDigest`, `sessionRef`, routing decisions) | Byte ranges + contributor are the user's data and should be readable; prompt digests and routing internals are ours, and "none of the AIOS internal machinery as consumer UI" is already settled [fetched, repo plan §14]. |

### 13. Anti-recommendations, consolidated

1. **Do not ship a `/v2` when v1 breaks.** Ship a new date. Sanity's own page credits Stripe for exactly this reasoning — frequent small versions over "a huge `v2` release" [fetched].
2. **Do not let the SDK compute the version from `new Date()`.** Sanity documents this failure explicitly: "a change to the API can alter your app's behavior without you deploying anything" [fetched].
3. **Do not make `Frontmatter-Version` optional with a floating default.** GitHub defaults unversioned requests to a fixed version [fetched]; a *floating* default means every additive change is a silent breaking change for someone.
4. **Do not implement cost-based rate limiting.** Shopify needs it because GraphQL query cost is unbounded [fetched]; our 26 endpoints have four known cost classes, priced above. Two buckets beat a cost estimator you have to defend.
5. **Do not use `x-` prefixed custom headers.** Deprecated by RFC 6648; use `Frontmatter-Version`, not `X-Frontmatter-Version`. (GitHub still ships `X-GitHub-Api-Version` [fetched] — a legacy choice, not a model.)
6. **Do not report a refusal as a 400.** `422` with a refusal code is the whole product; collapsing it into a generic validation error erases the differentiator at the protocol layer.
7. **Do not offer a "force" or "ignore_refusal" parameter.** The engine refuses rather than guesses; a flag that turns that off makes the guarantee conditional, and every integrator will set it.
8. **Do not publish rate limits you cannot enforce per-vault.** Without the Dropbox-style namespace write lock [fetched], two concurrent splices on one file race at the git layer regardless of what the token bucket says.
9. **Do not build the REST API before the MCP quota ledger is shared.** Google proves the ledger comes first [fetched]; retrofitting one quota across two surfaces after launch means one of them silently gets free capacity.
10. **Do not cite Linear's rate limits.** The page did not yield to extraction here [measured] — no number from it is verified.

### Unverified / open

- Contentful's *documented* rate limits were unreachable (Vercel Security Checkpoint [measured]); the only Contentful figure above is a measured response header from one public demo space, which is **not** a published plan limit.
- Stripe's and Notion's version support windows were not stated on the pages opened — the 24-month figure is GitHub's alone [fetched].
- The 10/30/40/250 CPU-ms per-call assumptions in §8 are **estimates, not measurements**; re-derive from live Workers CPU-time telemetry before publishing any tier table externally.
- ₹95.4/USD is `[SS, August 2026]` per the repo plan and is flagged there as "re-check live before publishing" [fetched, internal].
- The `read:user`-scope blocker on the GitHub-App path [fetched, repo plan §14 item 4] gates the entire auth section.