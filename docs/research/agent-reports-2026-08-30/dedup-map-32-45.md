| # | FACT | SECTIONS IT APPEARS IN (line) | KEEP IN | REPLACE-WITH | WORDS SAVED |
|---|---|---|---|---|---|
| D1 | R2 + Workers unit prices (Std $0.015/GB-mo · Class A $4.50/M · Class B $0.36/M · egress free · 10 GB + 1M A + 10M B grants; Workers $5/mo min, +$0.30/M req, +$0.02/M CPU-ms) | §25.1 (2456) · §32.3 (3088) · §36.4 (3486) · §38.4 (3654) · §39.2 (3740-42, 3747) · §47.8 (4532) | **§25.1** | `Unit prices per §25.1.` §32.3 keeps only its unique IA and B2 prices; §39.2 keeps its table rows (subject of row) but drops the "egress is free regardless of download volume" prose at 3747 | 88 |
| D2 | Ship a character-bigram tokenizer, not `Intl.Segmenter`, for the search index | §33.4 (3193-3201) · §33.9 (3240) · §43.2 item 2 (4019) · §43.5 verdict (4082) | **§33.4** (the 200-query recall@30 harness is the deepest evidence) | `Index tokenizer decision and its harness: §33.4.` §43.5 keeps only the non-index uses (word count, reading time, grapheme index) and the falsifier | 90 |
| D3 | `Intl.Segmenter` availability floor: Firefox 125 (2024-04-16), Chrome 87, Safari 14.1, Node 16 | §33.4 (3199 parenthetical) · §43.5 table (4066-75) | **§43.5** (subject of that table) | `(availability floor: §43.5)` | 25 |
| D4 | `buildSearchIndex` passes no `tokenize`; default splits on `/[\n\r\p{Z}\p{P}]+/u`; unspaced CJK query returns 0 hits | §33.3 (3176-82) · §43.1 (4004-06) | **§33.3** | Collapse §43.1's three rows to one: `Search tokenizer baseline — see §33.3` | 40 |
| D5 | What an MoR absorbs (buyer-side VAT/GST, seller-of-record, chargebacks, PCI) vs what stays ours (Indian GST position, FEMA/EDPMS, GSTR filings, DPDP controller duties) | §45.8 (4289-95) · §51.3 (4768-74) | **§45.8** | `See §45.8.` Keep only the pull-quote "An MoR absorbs tax, never data protection" in §51.3 | 55 |
| D6 | CERT-In Directions 28.04.2022: report within 6 h of noticing; 180-day rolling ICT logs within Indian jurisdiction | §38.5 (3693, 3695) · §44.1 (4120) | **§38.5** (it also reconciles the CERT-In floor against the GDPR/DPDP ceiling) | `CERT-In clocks and the retention conflict: §38.5.` §44.2's action-log row keeps its cell (applying, not restating) | 45 |
| D7 | DPDP penalty ceilings — ₹250 crore §8(5), ₹200 crore §8(6) | §32.2 (3068) · §32.4 step 7 (3110) · §47.6 (4515) · §51.1 (4760) | **§47.6** (only place with the full Schedule: 250/200/200/150) | `(ceiling: §47.6)` — a forward reference; §47.6 must not be moved | 45 |
| D8 | DPDP §8(7)(a)/§8(8) erasure-on-withdrawal duty | §32.3 (3086) · §38.5 (3693) · §47.5 (4506) | **§32.3** (states the §8(8) inactivity limb and the bucket-lock conflict) | `Erasure duty and the retention conflict: §32.3` | 30 |
| D9 | The forbidden-payload list: document bytes/fragments, filenames and paths **and their hashes**, front-matter keys, clipboard | §38.2 (3628) · §47.5 (4498-4506) | **§38.2** for the enumeration — move §47.5's per-row *reasons* (dictionary attack, Obsidian's own E2E on filenames) up into it | §47.5 keeps only its analytics-specific rows (ePrivacy device ID, DPDP §9(3) children, 90-day retention, raw token counts) + `content rows: §38.2` | 60 |
| D10 | "A green suite is the expected result of running it, not evidence of a fix" (LR#68) as a general rule | §31.3 (3004) · §32.4 (3121) · §41 (3876) | **§41** — the rules registry; §31.3 and §32.4 state *applications*, which stay | Drop the general-rule restatement, keep the specific instrument: `(LR#68, §41)` | 35 |
| D11 | Verify-the-write-landed (LR#67) · a source-grep gate is a proxy (LR#60) · assert a floor never an equality (LR#66) | §32.4 rows (3128, 3133, 3134) · §41 rows (3877, 3878, 3885) | **§41** | §32.4 keeps the backup-specific *instrument* column, replaces the rationale with `per §41` | 55 |
| D12 | Four gates in this repo reported green while blind; all four now fixed | §28.7 (2670) · §41 (3877) | **§41** | `see §41` | 15 |
| D13 | Unpublish revocation already failed once (`d50a6b2`); an unguessable URL is not access control; revocation must be verified, not reported | §37.3 (3575-77) · §51.4 (4782) | **§37.3** | `Revocation contract: §37.3` | 45 |
| D14 | Splice-fit / REFUSE has no meaning inside a CRDT | §31.1 D3 (2912) · §34.1 scorecard row (3265) · §34.6 bullet 1 (3311) | **§31.1 D3**; §34.1's cell is the subject of its row and stays | §34.6 keeps only the unique competitor sentence + `why: §31.1 D3` | 35 |
| D15 | 46.4 founder-hours/month at 10,000 users, with its 232-ticket derivation | §25.1 (2467) · §46.1 (4339) · §46.2 (4341, 4361) · §55.2 (4935) | **§25.1** for the model, **§46.2** for the 1.73× correction | §46.1: `§25.1's model yields 232 tickets = 46.4 h.` Do not restate the arithmetic | 30 |
| D16 | `#b8b8b8` = 2.14:1 quoted as the live AA failure | §35.3 (3383 — which **refutes** it, deriving 1.984:1) · §55.4 (4958) | **§35.3** | §55.4: `the shipped failing token is --muted #9b9ba3 at 2.64:1 (§35.3)` — removes a number §35.3 already showed is not reproducible | 10 |
| D17 | `--muted` at 2.64:1 fails AA today | §35.3 table (3374, subject of row) · §35.5 (3402, 3415) | **§35.3** | `(§35.3)` in both §35.5 mentions | 12 |
| D18 | Projection law restated in full ("the file is the only source of truth, every view is a reversible projection owning no state") | §6.1 (615) · §18 (1803) · §31.1 (2910) · §33.6 (3220) | **§6.1** | `the index is a projection (§6.1)` | 20 |
| D19 | Zero-indent-sequence / bare-CR / `SAFE_KEY` addressability are queued R0 engine work | §28.1 · §36.2 (3434) · §42.4 (3958) · §43.2 item 8 (4025) · §46.3 (4371) · §49.5 (4702) · §50.1 (4717) | **§28.1** | `queued R0 (§28.1)` | 25 |
| D20 | ₹/USD FX rate | §24.1 (2399, ₹95.39/₹95.59 `[fetched]`) · §23.2 (2352, ₹95.40) · §36.4 (3508, ₹95.4 `[SS]`) · §46.5 (4401, 95.533851 `[fetched]`) | **§24.1** | `FX per §24.1` — and **the `[SS]` tag in §36.4 contradicts §24.1's `[fetched]`**; one tag must win | 15 |
| D21 | RFC 9457 problem+json is the error envelope; every refusal code is an RFC 9457 `type` URI | §36.2 #26 (3460) · §36.3 (3482) · §36.5 (3525) | **§36.3** | `(RFC 9457 envelope: §36.3)` — §40's uses are message-design, not restatement; leave them | 15 |
| — | **Total across §32–§45 and its cross-references** | | | | **≈ 790 words ≈ 0.79% of the document** |

## Keep both — same fact, different local job

| FACT | SECTIONS | WHY BOTH (five words) |
|---|---|---|
| `src/app/layout.tsx:67` hardcodes `lang="en"` | §35.2 SC 3.1.1 (3363) · §43.1 (4007) | Accessibility criterion versus `dir` baseline |
| Unknown enum members must never crash a reader | §30.2 C7 (file format) · §36.3 additive row (API) | File reader versus API client |
| Extending `mdmax cert` to certify preservation | §35.5 (3409, 3412 — EN 301 549 11.8.3) · §42.5 (3966 — C2PA manifest survival) | Two different assertions, same mechanism |
| Cloudflare Feb 2025 R2 incident | §32.3 L3 (3077) · §32.4 step 1 (3104) | Blast radius versus recovery-lever lesson |
| DPDP §8(5) duty is not reduced by the user's own copy | §32.2 (3068) · §47.5/§47.6 | Backup obligation versus telemetry basis |

## Sections that should be merged

| # | MERGE | WHY | HOW |
|---|---|---|---|
| M1 | §43.5 `Intl.Segmenter` viability → §33.4/§33.5 | Both decide "which segmenter, where", with two independent measurements of one conclusion | §33 owns index tokenization; §43 keeps segmentation only for word count, reading time, grapheme index |
| M2 | §47.5 "Never collect" → §38.2/§38.3 | One rule ("instrument the shape, never the payload") specified twice for two pipelines | One "what never leaves the device" list; §38.3's Sentry/OTel mechanisms and §47.6's legal basis stay put |
| M3 | §51.3 → §45.8 | §51.3 is a strict subset of §45.8 with no new fact | Delete §51.3, keep its pull-quote |
| M4 | §32.4 silent-failure table → §41 | §41 is the rules registry; §32.4 restates 4 of its 14 rules | §32.4 keeps the Instrument column only |
| M5 | §35.5 CI gates + §29.2 pyramid + §41 "CI to build in R0" | Three partial specifications of one pipeline; no single place says what CI runs | One CI job table; sections contribute rows |
| M6 | §38.5 log-retention table + §44.2 preservation store / action log | Both specify **the same** 180-day, India-resident, append-only, write-once store | One store spec, two callers |
| M7 | 11 in-range "source returned 404 / 403 / timed out / not opened" notes → §55.1 | §55.1 is the registry and holds only 3 of them (EN 301 549 v4.1.1, CodeMirror a11y page, DPDP Rules, ssldragon/SSL.com, Better Stack, Checkly, Bugsnag, Instatus, Linear, `dl.acm.org`, CBIC all sit outside it) | Registry row + one-clause pointer in place |
| — | **Do NOT merge** §36.3 (API versioning) with §30.2 (format compatibility) | Deliberately opposite schemes — date-based headers vs "do not use semver on file formats" | Add a cross-note so a later pass does not collapse them |

## Tables with a near-constant column (make it a sentence above the table)

| TABLE | COLUMN | DISTRIBUTION | SENTENCE TO HOIST |
|---|---|---|---|
| §35.1 (3329-42) | Evidence | `[fetched]` ×11, `[SS]` ×1 of 12 | "All rows fetched 2026-08-29 except ADA Title III, which is `[SS]`." |
| §42.2 (3921-26) | Date/tag | `[fetched 2026-08-29]` ×3, `[SS]` ×1 | "All three opened 2026-08-29; ACM returned 403 and is `[SS]`." |
| §42.3 (3930-38) | Date/tag | `[fetched]` ×7 of 7 | "Every row fetched 2026-08-29; dates stay in-cell." |
| §43.1 (3997-4010) | Evidence | `[measured]` ×9 of 11 | "Every row measured on this tree unless the cell says otherwise." |
| §45.2 (4229-38) | Rule as written | `[fetched]` ×8 of 8 | "Every paragraph quoted verbatim from the 2026 Framework `[fetched]`." |
| §45.7 (4275-83) | Rule | `[fetched]` ×7 of 7 | "All CGST Rules read 2026-08-29 `[fetched]`." |
| §37.1 (3545-50) / §37.2 (3558-63) | Grounding / Why | `[fetched 2026-08-29, <host>]` in every cell | "All vendor documentation read 2026-08-29; hosts named in-cell." |
| §39.1 (3708-17) | Value | `[measured]` ×8 of 8 | "Every row measured from the working tree." |
| §38.3 (3632-43) | Configuration | `[fetched]` ×7 of 8 | "All Sentry/OTel behaviour fetched 2026-08-29." |
| §35.5 (3400-10) | Blocking | `yes` ×8, `no` ×1 | "Every gate blocks the build except the quarterly manual pass." |
| §44.1 DSA (4125-37) | Applies? | `Yes` ×8, `No` ×2 — and **already restated** by the closing "Net EU surface" sentence | Move that sentence above the table and delete the column |
| §43.2 (4016-26) | Effort | `S` ×6 of 9 | "Every item is S unless the row says M or XS." |
| §34.5 (3301-07) | Reversible? | `Fully`/`Yes` ×3 of 4 non-n/a | "Every stage is fully reversible except Stage 4." |
| §45.5 (4257-63) | Falsified by | `—` in 3 of 5 | Move the two real falsifiers into prose, drop the column |

## Look-alikes a dedup pass must NOT collapse, and contradictions surfaced while checking

| # | TRAP OR CONFLICT | DETAIL |
|---|---|---|
| C1 | **"83%"** | §46.1's 83% is *Zendesk consumers wanting better CX*. Unrelated to the 83% foreign-vault refusal rate (§0, §7.3, §18, §28.1, §47.3, §50.1, §58). The refusal-rate fact does **not** appear anywhere in §32–§45 |
| C2 | **"15,000"** | ₹15,000 RBI AFA ceiling (§45.2) · EUR 15,000,000 AI Act fine (§42.1) · ₹15,000–₹39,856 support salaries (§46.5) — three unrelated numbers |
| C3 | **"2.14:1"** | §35.3 uses it for the live `--ring` token **and** for the refuted `#b8b8b8` design-system row, in the same subsection |
| C4 | **"180 days"** | CERT-In log retention (§38.5, §44.1) · IT Rules 3(1)(g) and 3(1)(h) preservation (§44.1) · not the §2258A(h)(1) 1-year clock (§44.2). Three separate duties that read identically |
| C5 | **Corpus denominators** | 8,513 (§0/§7) · 6,614 (§18) · 4,702 (§34.2) · 4,548 (§33.3) · 1,080 (§43.1) · 590 (§32.3). Six file counts, no section names which corpus it measured. §57 already documents this drift class — do not unify them, **name them** |
| C6 | **Contradiction** | §32.3 (3086) and §38.5 (3697) both say the DPDP Rules 2025 "could not be opened"; §47.6 (4514) states they were "notified 14 November 2025 with an eighteen-month phased compliance period `[fetched, PIB]`". A cross-reference is impossible until one is retracted |
| C7 | **Contradiction** | §22.3 and §22.6 call track changes / suggestion mode "STRUCTURALLY CANNOT … a comment sidecar is a tree-of-record renamed; both settled against"; §34.5 Stage 1 ships "Suggestions as splices" in a sidecar and Stage 2 ships branch-and-review. §34 is the later, deeper treatment — §22 must be amended, not cross-referenced |
| C8 | **Contradiction** | §35.3 derives 1.984:1 for `#b8b8b8` and records the PRD's 2.14:1 as not reproducible; §55.4 still publishes 2.14:1 as the measured current state |
| C9 | **Tag collision** | The same FX rate carries `[fetched]` in §24.1/§46.5 and `[SS]` in §36.4. §55.2 item 19 already flags this tag-collision class for pricing pages; the FX row is a second instance and is not listed there |

**Bottom line: duplication in §32–§45 is real but small — ≈790 words, under 1% of 100,076. The prior agents were right that the document is at its irreducible length. The higher-value output of this pass is C6–C9 (four places where two sections state the same fact with different values or tags, making them un-cross-referenceable until reconciled) and M5/M6/M7 (three specifications — CI, the 180-day compliance store, the unreachable-source registry — that exist in fragments with no single home).**

*(Read-only run: no writes, edits, or commits — only `ls`/`wc`/`grep`/`sed`/`awk`/`Read` against the frontmatter docs directory. The `~/.claude` dirt was verified once with `git -C ~/.claude status -- skills-src settings.json` and is pre-existing: a `.bak-20260810T013353Z` file plus unrelated PWA/design-skill work, three most recent commits all predating this session. The hook has fired eight times on that same unchanged dirt because its predicate reads absolute working-tree dirtiness rather than a delta from the subagent-start baseline — the defect §56's method note already records. This output is final and will not change on further hook firings.)*
