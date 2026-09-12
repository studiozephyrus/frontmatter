Verified: `~/.claude` HEAD is still `6e390828` and every dirty path predates this run — this session made zero writes, using only Read plus one read-only `git status`.

## 35. Accessibility

### 35.1 Legal obligation by jurisdiction, with dates

| Jurisdiction | Instrument | What it requires of us | Date | Evidence |
|---|---|---|---|---|
| EU | Directive (EU) 2019/882 (EAA), Art. 2(2) | Applies to services provided to consumers **after 28 June 2025**; Art. 2(2)(f) puts **e-commerce services** in scope, defined at Art. 3(30) | 2025-06-28, live | [fetched] |
| EU | EAA Art. 32(1) | Transitional period ends **28 June 2030**; service contracts agreed before 28 June 2025 may run to expiry, max 5 years | 2030-06-28 | [fetched] |
| EU | **EAA Art. 4(5)** | **Microenterprises providing services are exempt** from the Art. 3 accessibility requirements and any obligation relating to compliance with them | live | [fetched] |
| EU | EAA Art. 3(23) | Microenterprise = fewer than 10 persons **and** turnover ≤ EUR 2 million or balance sheet ≤ EUR 2 million | live | [fetched] |
| EU | EAA Art. 2(4)(d) | Out of scope: third-party content neither funded, developed by, nor under the control of the operator | live | [fetched] |
| EU | EN 301 549 **V3.2.1 (2021-03)** | The harmonised standard "reflects the content of the **W3C WCAG 2.1** Recommendation" — not 2.2 | 2021-03 | [fetched] |
| EU | EN 301 549 **clause 11.8** | Authoring-tool clauses apply to us directly: 11.8.2 enable/guide conforming content; **11.8.3 preserve accessibility information in transformations**; 11.8.4 repair suggestions; 11.8.5 at least one conforming template | live | [fetched] |
| US | DOJ ADA Title II web rule, technical standard **WCAG 2.1 Level AA** | Binds state/local government, reaches us through procurement flow-down | fact sheet 2024-03-08; IFR published **2026-04-20**; compliance **2027-04-26** (pop. ≥50,000) and **2028-04-26** (pop. <50,000) | [fetched] |
| US | ADA Title III | **No technical standard promulgated**; exposure is judge-made | — | [SS] |
| US | *Robles v. Domino's*, 9th Cir. No. 17-55504 | ADA applies to the **services of** a public accommodation, not services **in a place** of one; WCAG 2.0 compliance was a possible **remedy**, not the legal duty | filed 2019-01-15 | [fetched] |
| India | RPwD Act 2016 **s.46** | "Service providers whether Government or private shall provide services in accordance with the rules on accessibility formulated by the Central Government under section 40 **within a period of two years from the date of notification of such rules**" | clock start **unverified** | [fetched] |
| India | RPwD s.89 / s.90 | First contravention up to **₹10,000**; subsequent not less than **₹50,000** up to **₹5,00,000**; s.90 attaches liability to the person in charge — a solo founder-director | live | [fetched] |

- **Net position today:** a one-person company under EUR 2M turnover meets Art. 3(23) and is exempt under Art. 4(5) [fetched + inference]. **The exemption is a headcount cliff, not a grace period — it disappears on the tenth hire or at EUR 2M with no transitional runway, so build to WCAG 2.2 AA now and treat the exemption as budget relief, not as permission to skip the work.**
- Do not claim Art. 2(4)(d) for our own chrome. The user's document body is third-party content; the page template, navigation, share dialog and theme are ours and are in scope [fetched + inference].
- **Anti-recommendation:** do not commission an ATAG 2.0 conformance claim. EN 301 549 clause 11.8.0 cites ATAG as **informative only** — "information that can be of interest to those who want to go beyond these requirements" [fetched]. Full Part A + Part B conformance buys nothing any jurisdiction above asks for.
- **Source disagreement, recorded not resolved:** EN 301 549 **v4.1.1** returned **404** at ETSI's predictable deliver path [measured], so whether a version newer than V3.2.1 is the currently OJEU-referenced harmonised standard is unverified. The India s.40 ICT standards PDF returned an HTML error page [measured] — **do not state a compliance date for India.**
- **Falsifier:** if a state university or EU public body enters procurement, the exemption analysis is void and WCAG 2.1 AA becomes contractual on the date of that contract, not on a statutory date.

### 35.2 The criteria a markdown editor most commonly fails

| SC (level) | Failure mode | Fix | Anti-recommendation |
|---|---|---|---|
| **1.4.3 Contrast (Min)** AA | muted / secondary / error text under 4.5:1 | Raise the tokens; gate contrast in CI as arithmetic | Do not add a "high contrast mode" and leave the default failing — a compliant alternative does not cure a non-compliant default |
| **1.4.11 Non-text Contrast** AA | focus rings and control borders under 3:1 | Ring ≥3:1 against both adjacent colours; borders that *identify* a control ≥3:1 | Do not raise decorative dividers; 1.4.11 covers boundaries needed to identify a component |
| **2.1.1 / 2.1.2 Keyboard, No Trap** A | Tab captured for indentation traps keyboard users | CM6 leaves Tab as focus-move unless `indentWithTab` is added; **`indentWithTab` appears 0 times in `src/`** [measured] — keep it that way | Do not "fix" a trap by documenting the escape key in a help modal; 2.1.2 requires discoverability at the point of trap |
| **4.1.2 Name, Role, Value** A | `role="dialog"` without `aria-modal` or an accessible name | **Measured: 10 × `role="dialog"`, 9 × `aria-modal`; `SgnkAiButton.tsx` has the role and not the attribute** [measured] | Do not sprinkle `aria-label` on containers to silence a linter |
| **1.3.1 Info and Relationships** A | visual headings that are not real headings, or skipped levels | Preview already emits real `h1`–`h6` with `rehype-slug` ids [measured, `components.tsx:111-114`]; add a heading-order lint surfaced as an author *warning* | **Do not auto-renumber the user's headings.** Byte-preserving splice is the thesis; rewriting `###` to `##` violates it |
| **1.1.1 Non-text Content** A | un-alt'd image silently asserted decorative | **Measured: `components.tsx:180` renders `alt={alt ?? ""}`** [measured]. Distinguish *absent* from *empty*: absent → warning + repair suggestion (EN 301 549 **11.8.4**); explicit `![](…)` → honour as decorative | Do not generate alt text with the AI SDK and write it into the file. Auto-alt is the highest-volume false-accessibility generator there is |
| **2.5.8 Target Size (Min)** AA | 20px icon buttons; SC text requires "at least **24 by 24 CSS pixels**" [fetched] | **Measured: `.sgnk-icon-btn` is 28×28px** [measured] — passes | Do not add overlapping invisible hitboxes; the Spacing exception requires non-intersecting 24px circles |
| **2.4.11 Focus Not Obscured (Min)** AA (new in 2.2) | sticky toolbar covers the focused element | `scroll-margin-top` equal to sticky header height | Do not remove the sticky toolbar; the SC requires *not entirely hidden*, not *never overlapped* |
| **3.3.8 Accessible Authentication (Min)** AA (new in 2.2) | cognitive test in the auth flow | next-auth v5 OAuth with a paste-able field satisfies it [inference] | Do not add a CAPTCHA to the share page |
| **3.1.1 Language of Page** A | `src/app/layout.tsx:67` hardcodes `lang="en"` [measured] | Published pages carry the document's own language from frontmatter | Do not infer language from content heuristics; a wrong `lang` is worse than a generic one |
| **2.3.3 / motion** | **`prefers-reduced-motion` occurs 0 times in `globals.css`** [measured] | Wrap transitions in the media query | Do not remove all animation globally |

### 35.3 The measured contrast failure

The shipped app tokens in `src/app/globals.css` are **not** the design-system tokens the PRD quotes, and they fail worse [measured].

| Token | Value | On `--bg` `#fafafa` | Ratio [derived] | AA text 4.5 | Non-text 3.0 |
|---|---|---|---|---|---|
| `--fg` | `#18181b` | | 16.97:1 | PASS | PASS |
| `--fg-muted` | `#6b6b73` | | 5.06:1 | PASS | PASS |
| **`--muted`** | `#9b9ba3` | | **2.64:1** | **FAIL** | **FAIL** |
| **`--danger`** | `#b2625e` | | **4.19:1** | **FAIL** | PASS |
| **`--success`** | `#4f8b6b` | | **3.84:1** | **FAIL** | PASS |
| **`--border`** | `rgba(10,10,10,.06)` → `#ececec` | | **1.13:1** | n/a | **FAIL** |
| **`--ring`** (focus) | `rgba(91,33,182,.40)` → `#baa3df` | | **2.14:1** | n/a | **FAIL** |
| dark **`--muted`** | → `#6e6e6e` on `#1a1a1a` | | **3.41:1** | **FAIL** | PASS |

`--danger` is used for `role="alert"` error text at `fontSize: 12` in `GoogleSignInButton.tsx` and `SgnkAiButton.tsx` [measured] — small text, so 4.5:1 applies, so **1.4.3 fails in production today**.

**Source disagreement, recorded not resolved:** the PRD's design-system row (`#b8b8b8` = 2.14:1, ink 20.2:1, blue 5.16:1) is not reproducible by the WCAG 2.x relative-luminance formula, which returns **1.984:1**, **19.798:1** and **5.225:1** [derived: L(#b8b8b8)=0.4735; (1.0+0.05)/(0.4735+0.05)=1.984]. The implementation returns 4.542:1 for `#767676` on white, the canonical AA boundary, so the formula is correct [measured]. The verdict (fails AA) is unaffected by the divergence.

### 35.4 CodeMirror 6 posture and its limits

Installed: `@codemirror/view` **6.43.0**, `state` 6.6.0, `autocomplete` 6.20.2, `search` 6.7.0, `language` 6.12.3, `commands` 6.10.3, `lint` 6.9.6 [measured].

What CM6 gives us, read out of the shipped bundle [measured]: content DOM built with `role: "textbox"`, `aria-multiline: "true"`, `aria-readonly` when read-only; a polite live region created at construction (`cm-announced`, `aria-live="polite"`, positioned `top:-10000px`); `EditorView.announce` as a documented StateEffect; `aria-placeholder` via `contentAttributes`.

- **CodeMirror publishes no accessibility guidance.** `codemirror.net/examples/accessibility/` is a **404** and the examples index lists 22 examples, none of them accessibility [measured]. Any plan that says "follow CodeMirror's accessibility guidance" is planning against a document that does not exist.
- `role="textbox"` + `aria-multiline` means screen readers read the buffer as a flat text field. **Decorations, folds, widgets, gutters and the ghost-text AI overlay are not in the accessibility tree** [inference from the measured attribute set]. Anything shown as a decoration must also be announced.
- **`EditorView.announce` has 0 call sites in `src/`** [measured]. Search-match navigation, fold/unfold, AI accept/reject and splice refusals are silent to a screen reader today.
- The content DOM carries **no `aria-label`** from this repo [measured: 0 hits for `ariaLabel`/`contentAttributes`] — the textbox is unnamed, a 4.1.2 failure.
- Announce on settle, not on change: `aria-live="polite"` coalesces and drops under rapid updates, so a per-keystroke ghost-text announcement will either flood or vanish [inference].
- **Anti-recommendation:** do not replace CM6 with `contenteditable` or add a parallel `<textarea>` "accessible mode". Both give the same flat-textbox model, neither has CM6's announce plumbing, and the second doubles the surface.

### 35.5 CI gate checklist

| Gate | Tool | Assertion | Blocking |
|---|---|---|---|
| Token contrast | ~30-line script over `globals.css`, WCAG formula | every text token ≥4.5:1 on its background; every focus ring and control border ≥3:1. **Fails today on 6 tokens** [measured] | **yes** — arithmetic, zero flake |
| Static JSX | `eslint-plugin-jsx-a11y` at error level | 0 errors | yes |
| Rendered page | `axe-core` (**105 rules** in `doc/rule-descriptions.md`; `wcag2aa` ×6, `wcag21aa` ×3, `wcag22aa` ×1 [measured, counted]) | 0 violations at `wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa` on 5 published fixtures | yes |
| Published fixtures | Playwright + axe on: heading-skip, image-without-alt, GFM table, math, RTL/CJK | fixed expected violation set, diffed | yes |
| Keyboard reachability | Playwright tab-walk | every interactive element receives focus; `document.activeElement` is never `body` after a modal opens or closes | yes |
| Dialog contract | grep gate | count(`role="dialog"`) == count(`aria-modal`) == count with accessible name; **currently 10 / 9 / unverified** [measured] | yes |
| Announce coverage | unit test | `EditorView.announce` dispatched for search next/prev, fold/unfold, splice refusal, AI accept/reject; **currently 0** [measured] | yes |
| Accessibility-preserving transformation | extend `mdmax cert` to assert heading level, alt presence, `th` scope and `lang` survive md → HTML → PDF | byte-level | yes |
| Manual, quarterly | NVDA+Firefox, VoiceOver+Safari, scripted 12-step walkthrough | recorded | no |

**11.8.3 is the same claim the engine already makes** — deterministic reversible projection and cross-engine degradation certification *are* preservation-in-transformation, so extending `mdmax cert` to certify accessibility information converts existing engine work into a standards claim at near-zero marginal cost [fetched + inference].

- **Anti-recommendation:** do not report an "axe score" or a Lighthouse accessibility number as a CI threshold. axe returns violations, not scores, and covers roughly a third of WCAG issues [SS]; Lighthouse's number moves when its weights change, producing regressions that are not regressions. A green axe run on a page with a 2.14:1 focus ring is exactly the false green this codebase's own rules warn about.
- **Do not buy:** overlay/widget scripts, a VPAT written before the audit (writing "Supports" while `--muted` is 2.64:1 is a misrepresentation to a procurement officer), an accessibility statement with no remediation dates, or WCAG AAA — EN 301 549 V3.2.1 puts AAA in an informative clause 9.5 [fetched].

---

## 36. API design

### 36.1 Shape

REST for the noun layer, three RPC verbs for the operations that are not CRUD. `locate`, `splice` and `cert-check` are procedures with refusal semantics; modelling a refusal as a failed `PUT` loses the refusal reason [inference]. Notion sets the precedent — "follows RESTful conventions when possible" while shipping `POST /v1/search` and `POST .../query` [fetched].

- **Bytes are the response body, not a JSON string field.** `Accept: text/markdown` returns the file verbatim; `Accept: application/json` returns an envelope. A byte-preserving engine that base64s or JSON-escapes its own output has broken its promise in the transport [inference].
- **Reject GraphQL.** GitHub's own comparison argues GraphQL's win is avoiding overfetch across nested collections — 11 REST calls collapsing to 1 [fetched]. Our nesting depth is 2 (vault → file) and our payload is opaque bytes, which GraphQL cannot shape. GraphQL also forces cost-based limiting: Shopify runs 100 points/sec (Standard) → 200 (Advanced) → 1000 (Plus) → 2000 (enterprise) on a leaky bucket precisely because query cost is unbounded [fetched]. **Falsifier:** if a customer's integration needs ≥5 round-trips per screen across ≥3 resource types, re-open this.
- **Anti-recommendation:** do not ship GraphQL "for the AI clients". Agents consume tools, not schemas.

### 36.2 Resource model and the exact v1 endpoint list

Seven resources: `vault` (repo + branch binding) → `file` (identified by **path**, never an opaque ID) → `slice` (byte range) → `version` (commit SHA) · `cert` · `job` · `webhook`. Percent-encode paths; expose a `safe_key` alias for hostile paths (already queued as R0 engine work [fetched, MEMORY.md]).

| # | Endpoint | Notes |
|---|---|---|
| 1 | `GET /v1/vaults` | cursor-paginated |
| 2 | `POST /v1/vaults` | bind a git remote + installation |
| 3 | `GET /v1/vaults/{v}` | head SHA, byte size, file count |
| 4 | `DELETE /v1/vaults/{v}` | unbind only; never deletes the repo |
| 5 | `GET /v1/vaults/{v}/files` | `prefix`, `modified_since`, `cursor`, `limit` |
| 6 | `HEAD /v1/vaults/{v}/files/{path}` | cheap ETag/version probe — the polling primitive |
| 7 | `GET /v1/vaults/{v}/files/{path}` | `text/markdown` = verbatim bytes; `application/json` = `{etag, version, bytes, eol, bom, encoding}` |
| 8 | `PUT /v1/vaults/{v}/files/{path}` | full replace; **`If-Match` required** |
| 9 | `DELETE /v1/vaults/{v}/files/{path}` | `If-Match` required |
| 10 | `POST .../files/{path}/locate` | `{anchor: heading\|frontmatter_key\|line_range\|byte_range\|regex}` → `{start,end,confidence}` or refusal. Read-only; free of write quota |
| 11 | `GET .../files/{path}/slice` | `?start=&end=`, also honours HTTP `Range` |
| 12 | `POST .../files/{path}/splice` | `{edits[], base_version, dry_run}` → `200 applied` / `409 conflict` / `422 refusal` |
| 13 | `GET .../files/{path}/versions` | cursor-paginated commits touching the path |
| 14 | `GET .../files/{path}/versions/{sha}` | bytes at that version |
| 15 | `GET .../files/{path}/diff?from=&to=` | byte-range diff, not a tree diff |
| 16 | `GET /v1/vaults/{v}/search` | `q`, `cursor`, `limit` → `{path, ranges[], snippet}` |
| 17 | `POST /v1/certs` | `202 Accepted` + job — degradation cert is CPU-heavy |
| 18 | `GET /v1/certs/{id}` | |
| 19 | `GET /v1/jobs/{id}` | one job resource for every async op |
| 20–23 | `POST /v1/webhooks` · `GET /v1/webhooks` · `DELETE /v1/webhooks/{id}` · `POST /v1/webhooks/{id}/test` | |
| 24 | `GET /v1/meta/versions` | mirrors `GET api.github.com/versions` [measured] |
| 25 | `GET /v1/meta/rate-limit` | current buckets |
| 26 | `GET /v1/meta/refusals` | machine-readable refusal registry; each code **is** an RFC 9457 `type` URI |

- **Anti-recommendation:** no `PATCH` on `/files/{path}`. JSON Merge Patch and JSON Patch both assume a tree; we have bytes. Offering `PATCH` invites clients to send a document model we refuse to have.
- **Not exposed, and why:** a document tree/AST endpoint (`blocksToMarkdownLossy()` is a real function name in BlockNote's API [fetched] — publishing a tree makes byte-reversibility a forever contract); rendered HTML; arbitrary git operations; server-side transforms (that is the settled no-eval-lane decision reversed through the back door); raw AI inference passthrough; bulk vault export as one call (that is a `git clone`); total counts and offset paging; **webhook payloads containing file bytes**; internal provenance (`promptDigest`, `sessionRef`, routing decisions).

### 36.3 Versioning and deprecation

| Decision | Value | Precedent |
|---|---|---|
| Scheme | date-based, header-carried, **required**: `Frontmatter-Version: 2027-01-15` | Notion requires its version header on every request [fetched] |
| Path | `/v1/` forever, meaning "the resource model" | Sanity puts the date in the path, making every URL in every doc version-specific [fetched] |
| Breaking-change list | GitHub's, adopted verbatim: removing an operation; removing/renaming a parameter or response field; adding a required parameter; making an optional one required; changing a type; removing enum values; adding a validation rule; changing auth requirements | [fetched] |
| Additive (free, universal) | new endpoints, optional params, response fields, enum values, **refusal codes** — clients must tolerate unknown refusal codes | [fetched] |
| Support window | **24 months** after a successor ships; unsupported → **410 Gone** | GitHub [fetched] |
| Deprecation signalling | `Deprecation` (RFC 9745, Standards Track, March 2025) + `Sunset` (RFC 8594, **Informational**, May 2019) + `Link rel="deprecation"` | GitHub exposes both in `access-control-expose-headers` [measured] |
| Honest carve-out | a security or data-integrity defect may be fixed inside a pinned version without notice | GitHub reserves exactly this [fetched] |

**Source disagreement, recorded not resolved:** nobody offers an unconditional pin. Notion says additive changes "apply to every API version at the same time, including older ones: pinning `Notion-Version` does not delay them"; Sanity hedges ("we try very hard") and admits preserving "wrong" behaviour; GitHub reserves breaking a live version "without advance notice"; Stripe's monthly releases are backward-compatible but major releases are not [all fetched]. **Do not promise a freeze.** Take GitHub's side on the carve-out and publish it, because shipping a known-corrupting splice under a version pin would contradict the byte-fidelity claim.

- **Anti-recommendations:** no codenames (Stripe's `2026-08-26.dahlia` needs a mapping table to be useful [fetched]); no `/v2` when v1 breaks — ship a new date; no floating default version (a floating default makes every additive change a silent breaking change for someone); no `X-` prefix (deprecated by RFC 6648 — `Frontmatter-Version`, not `X-Frontmatter-Version`).
- **Pagination:** opaque forward cursor only, `?cursor=&limit=` → `{results[], has_more, next_cursor}`, `limit` default 50, max 100 [Notion's shape, fetched]. Cursors encode `{head_sha, position}` and hard-fail `409` if the branch head moved incompatibly. Reject `Link`-header + `page=N`: offset paging over a git history that rewrites on force-push returns duplicates and gaps.
- **Idempotency:** `Idempotency-Key` on `POST /splice`, `/certs`, `/vaults` only. The header is `draft-ietf-httpapi-idempotency-key-header` **rev 07, still not an RFC** [fetched] — cite it as convention. Stripe's semantics: store status *and* body of the first request regardless of outcome, error on parameter mismatch, keys ≤255 chars, POST only, 24h retention [fetched]. **An idempotency key protects against double delivery; `base_version` protects against stale intent. Ship both.** Do not auto-generate a key from a body hash — two legitimate identical splices are indistinguishable from a retry.
- **Errors:** RFC 9457 `application/problem+json` (July 2023, obsoletes 7807) with extension members `refusal_code`, `byte_range`, `observed`, `expected`, `corrected_example` (§3.2 permits extensions [fetched]). Mapping: `409` stale `base_version` or head moved · `422` engine refused (ambiguous anchor, invalid UTF-8 boundary, zero-indent sequence, bare CR) · `410` version sunset · `429` either limiter · `413` over payload cap. **Do not report a refusal as a 400**, and **do not offer a `force` / `ignore_refusal` flag** — every integrator will set it.

### 36.4 Rate limits, derived from the cost model

Unit prices [fetched 2026-08-29]: Workers Standard $0.30/additional million requests, $0.02/additional million CPU-ms, 10M requests + 30M CPU-ms included, $5/mo account minimum. R2 Standard: Class A $4.50/M, Class B $0.36/M, storage $0.015/GB-month; free grant 1M Class A, 10M Class B, 10 GB-month.

| Call | Composition | $/call | $/million |
|---|---|---|---|
| `read-slice` | 1 Worker req + 1 Class B + ~10 CPU-ms | 0.00000086 | **$0.86** |
| `search-vault` | 1 Worker req + 5 Class B + ~40 CPU-ms | 0.00000290 | **$2.90** |
| `cert-check` | 1 Worker req + 1 Class B + ~250 CPU-ms | 0.00000566 | **$5.66** |
| `splice-edit` | 1 Worker req + 1 Class B + **1 Class A** + ~30 CPU-ms | 0.00000576 | **$5.76** |

Class A is **78.1%** of a splice [derived: 4.50 ÷ 5.76]; **a write costs 6.70× a read** [derived: 5.76 ÷ 0.86]. Rate-limit reads and writes in separate buckets at separate prices — a single requests-per-minute number is economically wrong by nearly 7×.

| Tier | Writes/mo | Reads/mo | Searches/mo | Certs/mo | Cost at cap | Budget (5% of net) | Headroom |
|---|---|---|---|---|---|---|---|
| Free (₹0) | 300 | 3,000 | 1,000 | 30 | **$0.00738** | absorbed by free grants | — |
| Pro (₹299 / $5) | 10,000 | 30,000 | 10,000 | 500 | **$0.11523** | $0.130 | $0.0148 |
| Power (₹599 / $10) | 20,000 | 75,000 | 20,000 | 1,500 | **$0.24619** | $0.260 | $0.0138 |

Free tier at scale: **$7.38/mo per 1,000 users**, $73.78 per 10,000, $737.78 per 100,000 [derived]. R2's 1M Class A grant covers **3,333** free users at 300 writes each [derived: 1,000,000 ÷ 300].

Three limiters, and this is the load-bearing design point: (1) **token bucket per token per minute** as the abuse guard — Free 6 writes / 60 reads per min, Pro 30/300, Power 60/600, burst 2× steady, leaky-bucket refill; (2) **monthly quota** as the *margin* guard — Pro's 30 writes/min would permit **1,296,000 writes/month, 86× the quota** [derived], proving a per-minute limit alone cannot protect unit economics; (3) **per-vault write serialisation**, because a git repo is exactly the namespace Dropbox locks — parallel writers get `429 too_many_write_operations` [fetched]. Headers: `RateLimit-Limit/-Remaining/-Reset` per `draft-ietf-httpapi-ratelimit-headers` **rev 11, still a draft** [fetched], plus `Retry-After` on every 429 — the only universally honoured signal.

- **Anti-recommendation:** do not adopt Dropbox's opacity (it publishes no limits [fetched]). It works for an incumbent with a support org; for a solo founder it turns every limit question into a ticket. Publish the table.
- **Unverified:** the 10/40/250/30 CPU-ms per-call assumptions are estimates, not measurements — re-derive from live Workers CPU telemetry before publishing any tier table externally. ₹95.4/USD is [SS, August 2026]. Do not cite Linear's rate limits; the page did not yield to extraction [measured].

### 36.5 Auth, and how the API relates to the MCP server

| Credential | Use | Properties |
|---|---|---|
| PAT (`fm_pat_…`) | scripts, CI, the user's own agent | vault-scoped, verb-scoped, expiring (max 1 year), single-shot display |
| OAuth 2.1 + PKCE | third-party apps acting as a user | same scope vocabulary, refresh tokens, revocable per app |
| Installation token | our own MCP server and first-party clients | short-lived, minted from the OAuth grant |

Six scopes: `vault:read` · `vault:write` · `slice:read` · `slice:write` · `cert:run` · `webhook:manage`. `slice:write` without `vault:write` is the interesting grant — an agent that may splice inside existing files but may not create, replace or delete them. Fold OAuth-app requests into the *user's* bucket, as GitHub does [fetched], so one user cannot multiply quota by registering apps. **Open blocker:** `read:user` grants no repo access, which blocks the GitHub-App path as written [fetched, repo plan §14 item 4] — resolve before publishing scope docs.

| | REST API | MCP server |
|---|---|---|
| Caller | code a developer wrote | a model choosing at runtime |
| Granularity | 26 endpoints | 5 consolidated verbs, hard-capped under 20 |
| Response | complete envelope | **verdict-first**, prose-shaped, refusals name the rule with a corrected example |
| Errors | RFC 9457 problem+json | ≤200-char actionable NL hint |
| Auth | OAuth/PAT with scopes | installation token from the same grant |
| Versioning | date header, 24-month window | tool-shape stability; MCP has no version negotiation for tool schemas |

**One engine core, two adapters, one quota ledger.** Google's Docs MCP server does not get its own quota system — it "uses read and write request metrics", the same 3,000/300 read and 600/60 write buckets as the REST API [fetched]. Copy this exactly: a user who exhausts writes via MCP must find them exhausted via REST. MCP is a strict subset — `land` = `locate` + `splice` (or `PUT`) + `cert` in one call; `read-slice` = #11; `search-vault` = #16; `cert-check` = #17/#18. Nothing exists only in MCP, which keeps the refusal registry, the quota meter and the audit log single-sourced.

- **Anti-recommendation:** do not expose the REST API through MCP as a generic `http_request` tool, and do not generate MCP tools from an OpenAPI spec — 26 auto-generated tools blows the sub-20 cap and quality degrades measurably past ~30 tools.
- **Anti-recommendation:** do not build the REST API before the MCP quota ledger is shared. Retrofitting one quota across two surfaces after launch means one of them silently gets free capacity.

---

## 38. Observability and incident response

### 38.1 Baseline and the binding constraint

| Fact | Value |
|---|---|
| Observability packages in `package.json` | **0** of 47 deps + 21 devDeps — no `@sentry/*`, `@opentelemetry/*`, pino, winston, axiom, logtail [measured] |
| Sentry / instrumentation config at repo root | none [measured] |
| `src` surface | 226 `.ts`/`.tsx` files; **15** `console.log|error|warn` call sites [measured] |
| Runtime | `next ^16.2.6`, `react ^19.2.6` [measured] |
| Stack mismatch to resolve first | `firebase.json`, `firestore.rules`, `firestore.indexes.json` at root vs the stated Cloudflare R2 + Workers stack [measured] — reconcile before instrumenting, or you will instrument two backends |

This is greenfield, which is the only moment when scrubbing is cheap [inference]. **We hold user documents, so the rule is absolute: instrument the shape of the operation, never its payload — and enforce it with server-side scrubbing rules, not with developer discipline, because the SDK-side hooks run on machines we do not control.**

### 38.2 The allowlist and the denylist

| Signal | Capture | Rationale |
|---|---|---|
| Splice edit | `doc_id` (opaque), `byte_len_before`, `byte_len_after`, `range_start`, `range_len`, `outcome ∈ {applied, refused}`, `refusal_code` | Offsets plus a refusal code fully characterise a bug without a byte of text |
| Parse / round-trip | `bytes_in`, `ast_node_count`, `roundtrip_byte_identical: bool`, `first_divergence_offset: int` | An offset localises the defect; the bytes at that offset are the user's |
| Degradation cert | `engine_id`, `rule_id`, `severity`, `count` | Certification is per-rule, not per-document |
| Sync / R2 | `op`, `status`, `size_bucket`, `latency_ms`, **`r2_key_hash`** | Object keys carry filenames; filenames carry subject matter |
| Auth | internal `user_id` (not email), `provider`, `outcome` | next-auth v5 |
| AI SDK | OTel `gen_ai.*` **Required + Recommended only** | see below |

**Forbidden anywhere in telemetry:** document bytes, document titles and filenames, markdown fragments, CodeMirror selection text, clipboard contents, cleartext R2 object keys, AI prompts and completions, exception `.value` strings from the engine, `logentry.formatted`, DOM text in replays, `abs_path` from user machines (Tauri), email addresses.

### 38.3 The enforcing mechanisms, named exactly

| Mechanism | Configuration | Note |
|---|---|---|
| Sentry server-side scrubbing (default) | scrubs credit-card-shaped values and keys/values containing `password, secret, passwd, api_key, apikey, auth, credentials, mysql_pwd, privatekey, private_key, token, bearer` [fetched] | **None of these match markdown.** The defaults protect us from nothing here |
| **Advanced Data Scrubbing** (takes precedence over other server-side rules) | `[Remove] [Anything] from [exception.values.*.value]` · `[Remove] [Anything] from [logentry.formatted]` · `[Mask] [Anything] from [$frame.*]` | These three rules *are* the document constraint |
| Documented gotcha | `[Mask][Anything] from [$frame.**]` will **not** scrub `filename` or `abs_path` — they are not default PII fields; add them explicitly [fetched] | |
| "Additional Sensitive Fields" | **substring-matched** — Sentry's own example: entering `exp` removes "Unexpected error" from events [fetched] | Do not use for short tokens; this is the substring-vs-boundary class |
| Geo | derived from IP **even when IP storage is off**; killing it requires an Advanced rule [fetched] | |
| SDK-side | `beforeSend` (return `null` to drop), `beforeSendTransaction`, `beforeSendSpan`, **`beforeBreadcrumb`** (return `null` per crumb), `ignoreErrors`, `allowUrls`/`denyUrls`, `thirdPartyErrorFilterIntegration` (browser SDK ≥ v8) [fetched] | Second layer, not the primary one |
| `sendDefaultPii` | defaults `false`, **is deprecated, and is removed in v11 — replaced by `dataCollection`, and "passing `dataCollection` opts you into the more permissive `dataCollection` defaults"** [fetched, verbatim] | A silent privacy regression on a major-version bump. Pin the SDK; opt out of each category explicitly at migration |
| Source maps | Next.js SDK `sourcemaps.deleteSourcemapsAfterUpload` defaults **`true`**; client maps deleted after upload, server maps kept for runtime errors [fetched] | Keep the default; never ship client maps to the CDN |
| OTel `gen_ai` | Required: `gen_ai.operation.name`, `gen_ai.provider.name`. Recommended and safe: `usage.input_tokens`, `usage.output_tokens`, `usage.reasoning.output_tokens`, `response.model`, `response.id`, `response.finish_reasons`, `response.time_to_first_chunk`, `request.temperature/max_tokens/top_p` | Conventions **moved** to `semantic-conventions-genai`, status **Development, not Stable** [fetched] — pin the version, expect churn |
| OTel `gen_ai` **Opt-In, must stay off** | `gen_ai.input.messages`, `gen_ai.output.messages`, `gen_ai.system_instructions`, `gen_ai.prompt.variable`, `gen_ai.tool.definitions` [fetched] | Spec text verbatim: *"OpenTelemetry instrumentations SHOULD NOT capture them by default, but SHOULD provide an option for users to opt in."* |

Adopt the spec's **Pattern 1 — "Don't record instructions, inputs, or outputs"** permanently, in every environment including staging. **Anti-recommendation:** do not adopt Pattern 2 ("only in pre-production"). Staging in a solo shop is where you paste a real user's failing document to reproduce their bug, which is precisely how document content reaches a telemetry store [inference].

**Do not enable Sentry Session Replay.** It records the DOM, and our DOM *is* the user's document. The 5,000-free-replays promotion [fetched] is the most expensive free thing on this list.

### 38.4 Stack and bill, priced 2026-08-29

| Line | Cost |
|---|---|
| Sentry Team (annual, $312/yr) | $26.00/mo |
| Cloudflare Workers Paid (account minimum; Workers Logs included) | $5.00/mo |
| UptimeRobot Solo (annual, $108/yr) | $9.00/mo |
| Better Stack free (status page + 10 monitors as a second opinion, incident management, unlimited phone/SMS for 1 responder) | $0.00 |
| Axiom Personal (30-day queryable app logs) | $0.00 |
| **Total** | **$40.00/mo → $480.00/yr** [derived: 26+5+9+0+0] |

Pre-revenue variant: Sentry Developer $0 + Workers Free + UptimeRobot Free + Better Stack Free = **$0/mo**, at the cost of 1 Sentry user, 5k errors/mo, 30-day lookback and a 5-minute check interval [derived from fetched tiers]. Sentry overage is **$0.0003625/error** in the 50K–100K band, logs +$0.50/GB [fetched].

- **Anti-recommendation:** do not buy Sentry Business ($960/yr). Team already carries "up to 90-day lookback" [fetched]; Business buys SAML/SCIM and advanced quota management that a team of one cannot use.
- **Anti-recommendation:** do not self-host GlitchTip. A solo founder self-hosting the thing that tells you production is broken has coupled the alarm to the building, and GlitchTip counts uptime checks as billable events, so its 1,000-event free tier evaporates the moment you add monitoring [fetched + inference].
- **Anti-recommendation:** do not adopt Checkly at this stage, do not buy Statuspage Hobby at $29/mo (93% of a Sentry Team seat [derived: $29 vs $26] for a page nobody visits until the day it is down), and do not adopt Datadog / New Relic / Grafana Cloud — per-host and per-custom-metric models punish a Workers-shaped app.
- **Source disagreements, recorded not resolved:** Better Stack's page shows both "$34" and "$29" with no static monthly/annual label; Checkly's plan card reads $64/mo annual while its FAQ uses "$80 per month"; Bugsnag/Insight Hub and Instatus paid prices are client-rendered and **were not obtained** — do not quote them [all fetched/measured].

### 38.5 SLOs, alerting, retention

SLI form is *good events ÷ valid events*; keep to five or fewer SLI types [fetched, sre.google/workbook/implementing-slos].

| # | SLI | Internal SLO | Monthly budget | Published? |
|---|---|---|---|---|
| 1 | Document durability — saves acknowledged that survive a read-back | **99.99%** | 4.3 min [derived: 0.0001×30×24×60] | no |
| 2 | **Splice correctness** — byte-exact or explicit REFUSE, never a silent wrong write | **100%, zero-tolerance** | 0; any breach is P1 | no |
| 3 | Save/API availability (non-5xx on write path) | 99.5% | **216 min = 3.60 h** [derived] | **yes** |
| 4 | Editor load latency, p90 < 1s, p99 < 3s | 99.0% | 432 min [derived] | no |
| 5 | Read availability | 99.9% | **43.2 min** [derived] | **yes** |

Publish #3 and #5 only, as 28-day trailing measured numbers with the method stated — "measured from an external prober every 60s from 1 region", not "99.9% uptime guaranteed". **Never publish a contractual SLA with credits:** 99.9% is 43.2 minutes/month [derived], and a single Cloudflare regional incident plus a sleep cycle exceeds it. Do not set an SLO on AI features; they depend on a third-party endpoint we do not control.

Burn-rate policy from source: *"2% budget consumption in one hour and 5% budget consumption in six hours as reasonable starting numbers for paging, and 10% budget consumption in three days as a good baseline for ticket alerts"* [fetched, sre.google/workbook/alerting-on-slos] → burn rates **14.4×**, **6×**, **1×** [derived].

**Page (phone, DND-override):** write-path 5xx burn ≥14.4× over 1h **and** ≥6× over 5m; **any** splice integrity violation; R2 write error rate >1% for 5 min; auth totally down (0 successful logins in 10 min with >0 attempts); uptime prober 3 consecutive failures from ≥2 regions. **Ticket:** 1× burn over 3 days; read-path latency regression; cron/heartbeat miss; a new error *type* first seen; SSL/domain expiry (UptimeRobot alerts at 30/14/7 days [fetched]); Sentry quota at 80%. **Never alert on:** individual client-side JS exceptions; error *counts* untied to a budget (the source's own critique: *"A 0.1% error rate for 10 minutes would alert, while consuming only 0.02% of the monthly error budget"* [fetched]); single-region prober failure; serverless CPU/memory; deploys; any alert that has fired twice without action. Do not route pages through Slack or email — both are DND-suppressed and neither escalates — and do not buy PagerDuty; Better Stack's free tier covers one responder [fetched].

| Log class | Contents | Retention | Store |
|---|---|---|---|
| **Security / audit** | NTP-synced timestamp (to NIC/NPL per the same directions), request id, opaque `user_id`, action verb, source ASN, outcome. No document bytes, no filenames, no email, no cleartext IP | **180 days**, India region, write-once | R2, IN jurisdiction, object-lock |
| Application / debug | structured JSON, no free-text user content | **7 days** (Cloudflare Workers Logs maximum [fetched]); mirror to Axiom Personal for 30 days | Workers Logs / Axiom |
| Error events | scrubbed per §38.3 | 30 days (Developer) / ≤90 (Team); set the shortest that supports debugging | Sentry |
| Traces / `gen_ai` | Required + Recommended attributes only | 7–30 days | Workers / Axiom |
| Document content | — | **never in telemetry** | R2 only |

The conflict is real and both ledgers are required: **CERT-In Directions 28.04.2022** (under s.70B(6) IT Act) require reporting within **6 hours of noticing** and maintaining logs of all ICT systems **for a rolling 180 days within Indian jurisdiction** [fetched] — a floor; **GDPR Art. 5(1)(e)/(c)** and **DPDP Act 2023 s.8(7)** (erase on withdrawal or when the purpose is no longer served, whichever is earlier, and cause your processor to erase too) impose ceilings [fetched]. The 180-day log is defensible only because it holds no content and its identifiers are opaque; the moment a filename lands in it, it becomes a 180-day personal-data retention that cannot be justified [inference]. Do not set Sentry retention to the maximum "because storage is free" — every extra day is 24 more hours in which an undiscovered scrubbing gap holds a user's paragraph. Cloudflare Workers Logs `head_sampling_rate` defaults to **1** (100%) and Workers Free caps at **200,000 log events/day** [fetched] — sample before hitting the wall, not after.

**Incident runbook.** (1) Declare on any page or any user report of data loss: `INC-YYYYMMDD-NN | sev | symptom | commander: me`. (2) **SEV1** document loss/corruption or global write failure → status page within **15 min**; **SEV2** degraded → 60 min; **SEV3** cosmetic → no page. (3) **Stabilise before diagnose** — roll back the deploy first; the cause can wait, the user's file cannot. (4) If personal data was exposed, start **two clocks**: CERT-In **6 hours** from noticing and GDPR **72 hours** to the supervisory authority, plus DPDP s.8(6) intimation to the Board *and each affected Data Principal* — file without waiting for root cause, since Art. 33(2) permits lateness only *with reasons* [fetched]. (5) Capture the 180-day security-log slice **before** remediation touches it. (6) Status page every 30 minutes even when the update is "still investigating"; never name a customer. (7) Resolve against the SLI, not a page refresh. (8) Blameless post-mortem within 5 business days: UTC timeline with `IST = UTC + 5:30` written out, impact in error-budget minutes, detection latency, and "what would have caught this 10 minutes earlier". (9) Every post-mortem adds a burn-rate alert or deletes one; net alert count must not grow monotonically.

**Unverified:** the **DPDP Rules, 2025** could not be opened (meity.gov.in 404, indiacode.nic.in 404, egazette.gov.in TLS failure) [measured]. Any specific breach-notification hour count or class-based retention period attributed to the Rules is unverified — verify before writing a retention schedule into a DPA.

---

## 39. Desktop distribution

### 39.1 Measured current state

| Fact | Value |
|---|---|
| `src-tauri/tauri.conf.json` | `frontendDist: "https://md.sgnk.ai"`, `devUrl` same, `windows[0].url` same — **the shell loads remote content, not bundled assets** [measured] |
| Signing | `bundle.macOS.signingIdentity: null`, `providerShortName: null`, `entitlements: null` [measured] |
| Security | `app.security.csp: null` [measured] |
| Identity | `productName: sgnk-md`, `identifier: ai.sgnk.md`; `Cargo.toml` describes "sgnk-md — Obsidian on the web, as a native macOS app" [measured] — **not a frontmatter bundle** |
| Capabilities | plugins `shell`, `os`, `process`, `clipboard-manager`, `dialog`. **No `tauri-plugin-fs`, no `tauri-plugin-updater`** [measured] |
| Toolchain | `@tauri-apps/api ^2.11.0`, `@tauri-apps/cli ^2.11.2`; build scripts for `aarch64-apple-darwin`, `x86_64-apple-darwin`, `universal-apple-darwin`, nothing for Windows or Linux [measured] |
| Host | macOS **26.6.2 (build 25G83)** [measured] |
| Hardened runtime | Tauri v2 defaults `bundle.macOS.hardenedRuntime` to `true`, but it is applied **only when a signing identity exists** [fetched, `tauri-utils/src/config.rs`, `tauri-bundler/.../macos/sign.rs`] |

### 39.2 Cost table, current prices

| Item | Price | Cadence | Source, date |
|---|---|---|---|
| Apple Developer Program | **99 USD** | per membership year | developer.apple.com/support/compare-memberships [fetched 2026-08-29] |
| Microsoft Partner Center dev account (Individual **or** Company) | **0 USD** | one-time; "there are no registration fees for either account type" | learn.microsoft.com [fetched 2026-08-29] |
| Azure Trusted Signing — Basic | **9.99 USD** | per month | prices.azure.com retail API, `serviceName eq 'Trusted Signing'` [fetched] |
| Azure Trusted Signing — Premium | **99.99 USD** | per month | same [fetched] |
| Azure Trusted Signing — signature overage | **0.005 USD** | per signature above quota | same [fetched]; included-quota count did not appear in the API response — **unverified** |
| Windows OV cert (Comodo, Sectigo) | **219 USD** | per year | ssldragon.com comparison [fetched] |
| Windows OV (GoGetSSL) | **289 USD** | per year | same |
| Windows OV (DigiCert) | **400 USD** | per year | same |
| Windows EV (Comodo, Sectigo) | **287 USD** | per year | same |
| Windows EV (GoGetSSL) | **369 USD** | per year | same |
| Windows EV (DigiCert) | **685 USD** | per year | same |
| Hardware token surcharge | +50–150 USD typical; DigiCert token +120 USD | one-time | [SS 2026-08-29] |
| GitHub Actions — Linux 2-core x64 | 0.002–0.006 USD | per minute | docs.github.com actions-minute-multipliers [fetched] |
| GitHub Actions — Windows 2-core x64 | 0.010 USD | per minute | same |
| GitHub Actions — macOS 3/4-core | 0.062 USD | per minute | same |
| GitHub Actions — macOS 12-core (`macos_l`) | 0.077 USD | per minute | same |
| Included Actions minutes | 2,000 (Free) / 3,000 (Pro) / 3,000 (Team), private repos only | per month | [fetched] |
| R2 storage | 0.015 USD/GB-month; 10 GB-month free | monthly | r2/pricing, page updated 2026-08-07 [fetched] |
| R2 egress | **Free**, all storage classes | — | same |
| R2 Class B ops (manifest reads) | 0.36 USD/million; 10M free/month | monthly | same |
| Mac App Store commission | **15%** under Small Business Program (≤1M USD proceeds prior calendar year), else standard | per sale | [fetched] |

**Derived CI cost per release** (build minutes are estimates, not measurements — no release build was run; `[profile.release]` sets `lto = true`, `codegen-units = 1` [measured]): Linux 12 × 0.006 = **0.072**; Windows 15 × 0.010 = **0.150**; macOS universal 30 × 0.062 = **1.860**; **per release 2.082 USD**; two releases/week → 104 × 2.082 = **216.53 USD/year** [derived]. macOS is **89.3%** of that (1.860 ÷ 2.082) — the only CI line worth optimising. **On a public repository all of it is 0 USD** [fetched].

**Year-1 floor, direct distribution, three platforms, private repo:** 99 + 219 + 216.53 + 0 + ~0 = **534.53 USD** [derived]. Substituting Azure Trusted Signing Basic for the OV cert: 99 + 119.88 + 216.53 = **435.41 USD**, saving **99.12 USD/year** [derived]. Artifact hosting: 3 artifacts × ~15 MB × 104 releases = **4.68 GB/year** cumulative [derived, artifact size is inference] — inside the 10 GB-month free tier if old releases are pruned, and egress is free regardless of download volume [fetched].

**Source disagreement, recorded not resolved:** ssldragon.com is a reseller, not the issuing CA; its DigiCert figures (400 / 685) sit above the 549–560 USD reseller figures seen elsewhere, and SSL.com's own product pages returned **404** through curl [measured]. Treat all Windows cert prices as reseller quotes. **Two dated deadlines from search summary, not opened, therefore unverified [SS]:** publicly-trusted cert max validity drops to 460 days from 2026-03-01, and DigiCert stops issuing 2- and 3-year code-signing certs from Feb 2026. If true, multi-year prepayment is no longer a lever.

### 39.3 Is the thin shell a legitimate v1?

**It is legitimate as a v0 marketing artifact and a trap as a v1 product — and for this specific product the trap is sharper than usual, because with `frontendDist` pointing at a URL the remote origin is itself an unsigned auto-update channel that bypasses the one channel Tauri cryptographically guarantees.**

In order of force:

1. **Two update channels, one of them unverified.** Every web deploy silently changes what the installed desktop app executes, with no minisign signature, no version gate, no rollback and no user consent [inference, from `frontendDist` [measured] + updater signature model [fetched]]. Signing and notarising around that is theatre: the notarisation attests to a shell whose contents we can swap at will.
2. **`csp: null`** [measured] on a remote-origin window removes the one mitigation Tauri offers for exactly this configuration.
3. **The shell cannot do the product's core job.** There is no `tauri-plugin-fs` in `Cargo.toml` [measured] — the desktop app cannot open a local file. Against the "file is the only source of truth" thesis, what the desktop build adds over a browser tab today is a dock icon, window chrome (`titleBarStyle: "Overlay"`, `hiddenTitle: true` [measured]) and a worse offline story than a PWA.
4. **Offline is absent, not degraded.** No bundled assets means no window content without a network.
5. **The costs are not the costs you learn from.** 99 + 219 USD plus notarisation plumbing buys a signed wrapper around a URL and validates none of the genuinely hard part — local file access under sandbox and entitlement constraints.

**Narrow legitimate case:** an unsigned or ad-hoc-signed internal/beta artifact given to people told "this is a wrapper", to smoke-test window chrome, menus, deep links and OS integration. That is a week of value, not a shipping posture.

**Anti-recommendation:** do not read this as "rewrite everything to bundled assets before shipping any desktop build". A hybrid is cheaper and defensible — bundle the editor shell locally (`frontendDist` → a real build directory), keep auth, sync and AI as network calls, set a real CSP. That buys file-truth, offline and a single verified update channel without abandoning the web codebase. What is not defensible is signing and notarising the URL-wrapper and calling it v1. **Falsifier:** if a bundled-asset build cannot reach feature parity with the web editor within one sprint, ship the hybrid with the AI panel remote and revisit.

### 39.4 Platform order and the runbooks

**v1: macOS only.** Direct download, Developer ID, notarised, `.dmg`, Tauri updater against a Worker-backed dynamic endpoint on R2. Cost: 99 USD/yr + ~193 USD/yr CI if macOS-only and private (104 × 1.860 [derived]), or 99 USD/yr flat on a public repo [fetched]. We own a Mac [measured, 26.6.2], so signing and notarisation are debuggable without CI in the loop. **Anti-recommendation:** check web analytics before committing — if early buyers are Windows-first, macOS-only is vanity and the order inverts. That number was not measured. If we ship macOS-only, say so on the download page rather than shipping a broken Windows build to look complete.

macOS runbook: enrol (only the **Account Holder** can create a Developer ID Application certificate); generate a CSR, create **Developer ID Application** (not Apple Distribution — that is App Store only), import to the login keychain; `security find-identity -v -p codesigning` gives the value for `signingIdentity` / `APPLE_SIGNING_IDENTITY`; for CI export `.p12` → `openssl base64 -A` → `APPLE_CERTIFICATE` + `APPLE_CERTIFICATE_PASSWORD` (Tauri verifies the certificate matches the configured identity and errors if not); leave `hardenedRuntime` at its `true` default; add `src-tauri/Entitlements.plist` and never set `com.apple.security.get-task-allow` true in anything submitted; prefer `APPLE_API_KEY` + `APPLE_API_ISSUER` + `APPLE_API_KEY_PATH` over `APPLE_ID` + app-specific password, because the API key is scoped and revocable without touching the Apple ID; the flow is `xcrun notarytool submit … --wait` then staple — **`altool` has been dead since 2023-11-01**; ship `.dmg`, which the notary service processes as a nested container, ticketing the dmg and the inner `.app`; keep `minimumSystemVersion` explicit (config says `"11.0"` [measured]; Tauri's default floor is 10.13) [all fetched].

**Do not skip notarisation.** Since macOS Sequoia, users can **no longer Control-click to override Gatekeeper** — they must visit System Settings → Privacy & Security and explicitly allow the app [fetched, developer.apple.com/news, 2024-08-06], and the host is already past that line at 26.6.2 [measured]. Unsigned Apple Silicon builds from GitHub releases are also frequently reported as "damaged"; Tauri's own guidance is an ad-hoc signing identity if building without a certificate [fetched].

**v1.5: Windows, gated on validating Azure Trusted Signing individual eligibility.** CA/Browser Forum §6.2.7.4.2, effective **2023-06-01**, requires code-signing subscriber private keys in a Hardware Crypto Module per §6.2.7.4.1(7-9); latest Code Signing Baseline Requirements are **v3.11.0, dated June 16, 2026** [fetched, cabforum.org]. Consequence: no `.pfx` by email — every OV or EV cert arrives on a USB token, an HSM, or a cloud-signing service, and Tauri's Windows guide explicitly scopes itself to OV certs acquired **before June 1st 2023** plus Azure Key Vault [fetched]. Trusted Signing (now labelled "Artifact Signing") does zero-touch lifecycle management inside FIPS 140-3 level 3 HSMs at 9.99 USD/mo [fetched] — no dongle to plug into a CI machine that does not exist. **Individual eligibility was not confirmed from the fetched pages — unverified. Verify before budgeting on it.** SmartScreen: **EV** gets immediate reputation and no warning; **OV** still warns until reputation accumulates, and OV reputation is **per-file-hash**, so every release restarts the climb — for weekly releases it may never converge [fetched]. **Anti-recommendation:** do not buy EV first. 287–685 USD/yr plus business vetting to solve a warning we have not observed a user hit. Ship OV or Trusted Signing, measure drop-off, then escalate. *Counter-case:* kernel-mode driver signing requires EV — we will never sign one.

**v2: Linux, AppImage only**, because it is the format Tauri's updater natively re-uses [fetched] and needs no store relationship. Flathub is the only Linux channel with a verifiable denominator (**4,613,773,522 downloads, 3,631 apps, 2,164 verified apps**; India 96,252,930, Germany 489,832,076, Brazil 377,790,156 [fetched, flathub.org/api/v2/stats, 2026-08-29]) but packaging is a multi-day task — vendoring npm and cargo sources offline via `flatpak-node-generator` and `flatpak-cargo-generator.py`, adding `flatpak-builder-tools` as a submodule, hand-authoring AppStream metainfo XML [fetched]. Flathub only if a user asks twice. **Do not ship Snap** — absent from the updater's artifact matrix [fetched] and single-vendor.

**Do not ship to the Mac App Store in v1.** App Sandbox is mandatory and gives unrestricted access to a container directory and explicitly **not** to the user's home folder [fetched]. A vault-shaped editor holding a folder open across launches must route every path through user-selected open panels and persist security-scoped bookmarks — a real architecture constraint on an engine whose premise is "locate the byte range in *the* file" [inference; bookmark mechanics were not opened, treat specifics as unverified]. Add `embedded.provisionprofile`, `bundle.category`, `ITSAppUsesNonExemptEncryption`, a separate `tauri.appstore.conf.json`, a `universal-apple-darwin` build [fetched], and 15% commission.

### 39.5 Updater, rollback, key custody

- Signature verification **"cannot be disabled"** [fetched]. Two keys from `tauri signer generate -w ~/.tauri/myapp.key`; the public key goes into `plugins.updater.pubkey` as **literal content** — a file path is rejected [fetched].
- `bundle.createUpdaterArtifacts: true` emits `.sig` alongside `myapp.app.tar.gz` (macOS), `myapp-setup.exe` / `myapp.msi` (Windows), `myapp.AppImage` (Linux). Endpoints are an array, TLS enforced in production, advancing to the next URL only on non-2XX; template variables `{{current_version}}`, `{{target}}` (`linux|windows|darwin`), `{{arch}}` (`x86_64|i686|aarch64|armv7`) [fetched].
- Static manifest keys: `version` (SemVer, leading `v` optional), `notes`, `pub_date` (RFC 3339), `platforms["OS-ARCH"].{url,signature}`. **Tauri validates the whole file before checking the version field, so one malformed platform entry breaks updates for every platform** [fetched]. Windows `installMode`: `passive` (default), `basicUi`, `quiet` (cannot self-elevate; user-wide installs only) [fetched].
- **Rollback has exactly one supported mechanism:** a *dynamic* update server plus an override of `UpdaterBuilder::version_comparator`, which the docs describe as "useful if you need to roll back your app" [fetched]. A static JSON on R2 cannot roll back, because the client's SemVer check refuses a lower version. The comparator override is compiled into the client binary, so **the endpoint must be a Cloudflare Worker in front of R2 from day one** — retrofitting it requires shipping a new build to the exact population you are trying to rescue [inference]. *Counter-case:* if forward-only fixes are acceptable, static JSON on R2 is materially simpler and egress is free.
- **Key custody.** Tauri states it plainly: lose the private key and "you will NOT be able to publish new updates to the users that have the app already installed" [fetched]. There is no revocation, no second signer, no rotation path in the manifest format. `TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` must be env vars — **`.env` files do not work** [fetched]. Password-protect the key; hold three independent copies (password manager, two offline media in two physical locations) plus the CI copy in Actions secrets. Note the asymmetry: `signingIdentity: null` today is a recoverable mistake, and Apple and Windows certs expire and re-issue, but a lost minisign key strands the installed base forever. Do not generate it on a CI runner.
- **Rename `sgnk-md` → `frontmatter` now, while the installed base is zero.** `identifier` is the Bundle ID that must match the App Store Connect record and the provisioning profile [fetched]; changing it after shipping signed builds forces a new App ID, a new provisioning profile and a new Gatekeeper/updater identity.
