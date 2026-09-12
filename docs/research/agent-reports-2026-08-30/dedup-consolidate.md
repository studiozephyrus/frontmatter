Read-only run; the dirty `~/.claude` tree is pre-existing and verified — no writes or commits from this session.

## 1 · Deduplication plan — one canonical home per fact

Digest (lines 15–81) excluded throughout. Row-subject numbers inside tables are not flagged. Word savings are measured against the actual text, not estimated from mention counts — most "repeat offenders" turn out to be subject-of-row uses, so the honest figures are far below the four analysts' claims.

| # | FACT | KEEP IN § | REMOVE FROM § | REPLACEMENT TEXT | WORDS SAVED |
|---|---|---|---|---|---|
| 1 | Eval-lane refusal = corruption guarantee ends **and** every prompt injection becomes RCE over all documents and keys | **§9.2** (deepest: CVEs, Livebook, blast-radius verdict) | §51.4 (L4784) | `**Refused — §9.2.** The blast radius, not the sandbox, is the argument.` | 18 |
| 2 | The "Proven `[measured]`" four-part recap | §1 · §19 · §15.1 · §26 | §4 (L252) | `**Proven `[measured]`:** the engine does not corrupt foreign data (§1); competitors do (§19); the internal substrate works at scale (§15.1); the campaign pipeline produces multi-surface output from one file (§26).` | 25 |
| 3 | MDMAX = 13 files / 3,614 lines / 15 targets / 19 constructs | **§7.1** (per-file table; A1 & A4 agree, A4 also wanted §1 cut — *rejected, §1 is origin narrative*) | §15.1 (L1399) · §15.2 (L1428) | §15.1 → `mdmax engine (§7.1); \`uncertifiableShare()\` = **8 of 15 (53.3%)**; benchId \`51947c2e…\`; fold \`mdmax/fold@1\``; §15.2 → `mdmax (§7.1), \`mdmax/fold@1\` [measured]` | 16 |
| 4 | 83% foreign-vault refusal, cause = zero-indent YAML sequences, 6,613/6,614 | **§18 preamble** (only place with denominator **and** provenance; A4 wanted §7.3 — *denominator and source live here*) | §18.2 Z row (L1851) · §47.3 (L4467) | §18.2 → `(today 17% pass — §18 preamble)`; §47.3 → `…because zero-indent-sequence refusals dominate foreign vaults (§18)` | 11 |
| 5 | The three self-contradictions (PLAN.md "shipped" · no CI in a document-CI product · shipped design system ≠ ours) | **§7.4** | §16.4 row 0 (L1675) | `**Fix the three self-contradictions of §7.4 first** — any one of them, found by a first customer, costs more than every feature below it.` *(also repairs the wrong `§7.2` cite)* | 30 |
| 6 | The Obsidian first-note statistic is unsourced | **§18.2** (L1867 — only place naming Red Tash, 2025-05-21, verbatim quote, topic 90236) | §2 note (L183) | `The complexity problem is real; the widely-repeated first-note statistic is **unsourced** and must not be cited — traced to its origin in §18.2.` | 35 |
| 7 | Hubble regenerates the body, deletes reference links with their visible text, is not a fixed point | **§19** | §16.3 row 1 (L1656) | `Every opened competitor regenerates the file; see §19.` *(repairs the wrong `[measured, §15]` cite)* | 18 |
| 8 | CRDT disqualification (cannot own bytes · interleaves · cannot refuse) + library versions | **§31.1 D1–D3** | §18.6 anti-rec (L2102) · §34.6 bullet 1 (L3311) | §18.6 → `do not introduce a CRDT (§31.1 D1) — both impose an internal document model, a tree-of-record through the back door`; §34.6 → `**Never persist CRDT state as the document** — the one irreversible decision in this section; why in §31.1 D3.` *(keep §34.6's competitor sentence)* | 47 |
| 9 | RBI: recurring auth without AFA to ₹15,000/txn; software not in the ₹1,00,000 carve-out | **§45.2** (para 8(a)/8(b) verbatim) | §24.4 blockquote (L2435) | `> **₹15,000 per transaction is an architectural constant, not a pricing input.** Full text and every consequence in §45.2.` | 24 |
| 10 | Median dev-focused free-to-paid = 5%, half the non-dev rate | **§25.2** (verbatim quote) | §4 (L248) | `**Unproven. Zero paying users.** Developers are the hard half of freemium — §25.2` | 14 |
| 11 | Google's public API cannot create suggestions | **§13** (the differentiator) | §9.3 v2 shortlist (L742) | `\`render: review\` (suggestions as a projection over a sidecar of hunks — §13; CriticMarkup's toolkit last moved 2021-03-04)` | 8 |
| 12 | `blocksToMarkdownLossy()` is a real shipping API name | **§19** (one of five framework loss mechanisms) | §6.2 (L328) | `Settled verdict 3 (§0.2); the framework evidence is in §19.` **Also retag `[SS]`→`[fetched]` at L111 and L328** — §19/§36.2 opened it | 8 |
| 13 | 232 tickets/mo = 46.4 founder-hours at 10,000 users, with its arithmetic | **§25.1** for the model · **§46.2** for the 1.73× correction | §46.1 (L4339) | `The §25.1 model gives 232 tickets/month = **46.4 founder-hours** at a flat 12 min. Blended **2.32 tickets per 100 users/month**.` *(repairs the non-existent `§21.1` cite)*; add to §25.1 → `— optimistic; the weighted figure is 80.45 (§46.2)` | 15 |
| 14 | `#b8b8b8` = 2.14:1 quoted as the live AA failure | **§35.3** (which *refutes* it: the formula returns 1.984:1) | §7.4 #3 (L430) · §55.4 (L4958) | §7.4 → `A \`body-faint\` token in the shipped set **fails WCAG AA** (§35.3).`; §55.4 → `the shipped \`body-faint\` token already fails AA (§35.3)` — **drops a number §35.3 shows is not reproducible** | 13 |
| 15 | Market leader's most-discussed related-notes issues are all silent index breakage | **§11.2 rank 8** (carries issue titles and comment counts) | §11.4 row 1 (L943) | `…it costs **$38.79/user/month** at 100 saves/day \`[derived]\`, and the index-failure evidence is in §11.2 rank 8` | 10 |
| 16 | R2 + Workers unit prices and free grants | **§25.1** (states the assumptions the prices serve) | §36.4 preamble (L3486) · §39.2 prose (L3747) | §36.4 → `Unit prices per §25.1; R2 free grants 1M Class A, 10M Class B, 10 GB-month.`; §39.2 → delete the trailing `and egress is free regardless of download volume` (the table row above already says it) | 33 |
| 17 | DPDP penalty ceilings, ₹250 cr §8(5) / ₹200 cr §8(6) | **§47.6** (only place with the full Schedule 250/200/200/150 — forward reference, do not move §47.6) | §32.2 (L3068) · §32.4 step 7 (L3110) · §51.1 (L4760) | each → `(ceiling per §47.6)` | 25 |
| 18 | CERT-In 28.04.2022: report ≤6 h of noticing; 180-day rolling ICT logs in Indian jurisdiction | **§38.5** (also reconciles the CERT-In floor against the GDPR/DPDP ceiling) | §44.1 (L4120) | `CERT-In Directions 28.04.2022 (§38.5) — the 180-day India-jurisdiction log clause conflicts with a default Cloudflare R2 + Workers stack [inference].` | 25 |
| 19 | Forbidden telemetry payload list (bytes, filenames **and their hashes**, front-matter keys, clipboard) | **§47.5** (A3 wanted §38.2 — *§47.5 alone carries legal basis*) | §38.2 (L3628) | `Base denylist: §47.5. Error-telemetry-specific additions: exception \`.value\`, \`logentry.formatted\`, cleartext R2 keys, \`abs_path\`, DOM text in replays.` | 25 |
| 20 | No session replay — the DOM replayed is the user's document | **§38.3** (first, Sentry-specific, with the 5,000-free-replays sting) | §47.8 (L4539) | `Do not add session replay or heatmaps at any price, including PostHog's included 5K recordings (§38.3).` | 10 |
| 21 | LR#68 as a general rule ("a green suite is the expected result of running it") | **§41** (rules registry) | §32.4 (L3121) | `**A drill that has never failed is not evidence the drill works — break it on purpose once a year** (LR#68, §41).` | 18 |
| 22 | Four §41 rules restated as silent-failure rationales | **§41** | §32.4 rows L3128, L3132, L3133, L3134 | keep each row's backup-specific **Instrument** cell; replace the rationale with `per §41` | 30 |
| 23 | `Intl.Segmenter` availability floor (Chrome 87 · Safari 14.1 · Firefox 125) | **§43.5** (subject of that table) | §33.4 (L3199 parenthetical) | `(availability floor: §43.5, which requires a bigram fallback regardless)` — **surfaces the live Node 16-vs-24 conflict between the two** | 12 |
| 24 | Ship a character bigram, not `Intl.Segmenter`, for the search index | **§33.4** (the 200-query recall@30 harness) | §43.5 verdict (L4082) | `**Use \`Intl.Segmenter\` unpolyfilled everywhere except the search index — index tokenizer decision and its harness: §33.4.**` *(keep §43.5's own bigram measurement and its falsifier)* | 25 |
| 25 | Safari storage 60/80% browser vs 15/20% wrapped, LRU eviction, `persist()` | **§31.2** (adds ITP, whole-origin eviction, the persist heuristic) | §18.6 (L2074) | `A Home Screen Web App gets the full origin/overall quota; a wrapped WKWebView gets a quarter of it — strictly worse, inverting the usual intuition (§31.2)` | 12 |
| 26 | Background Sync absent on Safari and Firefox (WebKit 182565) | **§31.2** (browser-compat-data, all targets) | §18.6 (L2079) | `no Background Sync or Periodic Sync (§31.2) — sync on foreground/visibilitychange only, and this is precisely Obsidian's 124-post complaint` | 12 |
| 27 | `tauri.conf.json` loads the live URL (`frontendDist`, `windows[0].url`) | **§39.1** (measured current state) | §18.6 posture table (L2047) | delete the row → `\`src-tauri/tauri.conf.json\` | a remote-URL macOS wrapper (§39.1)` *(keep §18.6's 4.2 anti-recommendation)* | 20 |
| 28 | Front Matter CMS VS Code installs | **§52.1** (80,605, and it records the +78 delta from the older read) | §19 (L2115, 80,527) | `**80,605 installs** (§52.1), VS Code, since 2019, owns our name` — **replaces a stale number** | 3 |
| 29 | OpenKnowledge star trajectory | **§19**, restated per §55.2 #18 as **3,239 → 3,679 in 28 days** | §3.3 (L228) | `OpenKnowledge ships ~100 releases/week; star trajectory in §19` | 8 |
| 30 | `countWords` CJK undercount · MiniSearch CJK recall | **§43.1** (word count) · **§33.4** (recall) | §50.1 row 4 (L4718) | `\`countWords\` undercounts CJK 8–23× (§43.1); MiniSearch CJK recall (§33.4)` — **removes the superseded 1.7–2× and 18.1%** | 10 |
| 31 | The corpus contains zero bare-CR fences, so it cannot red-prove NF-3 | **§57** (contradictions ledger) | §28.8 day 2 (L2683) | `Set-then-delete cancels out; that is how NF-3 stayed invisible. **The corpus cannot prove it (§57)** — a synthetic fixture is required` | 8 |
| 32 | FX rate ₹/USD | **§24.1** | tag only | §36.4 (L3508) → `₹95.4/USD per §24.1 \`[fetched]\``; §46.5 → `…÷ 95.533851 [fetched 2026-08-29T00:02:31 UTC; §24.1 for the rate]`. **Tag collision `[SS]` vs `[fetched]` must be resolved to one** | 5 |
| — | **Subtotal, cross-references** | | | | **573** |

---

## 2 · Section merges

| Merge | Merged heading | Why | Est. words |
|---|---|---|---|
| **§16.2 → §16.1** | *16.1 The completeness matrix* (add a `Churn rank` column) | All 18 "Why it is a gap" cells are compressions of §16.1's own **In PRD** / **Nearest parity** / **Demand evidence** cells, verified row by row. The only genuinely new content is the ranking itself (preserved as a column) and row 8's shipped-but-undocumented aggregate (preserved as a note). | ~250 |
| **§51.3 → §45.8** | *45.8 MoR boundary — what it absorbs and what stays ours* | §51.3 is a subset with three items to carry forward: `payment-related buyer support`, and **GDPR** alongside DPDP in the "still ours" list. Keep only the pull-quote in §51.3: *"An MoR absorbs tax, never data protection."* | ~100 |
| **§38.5 log-retention table + §44.2 preservation store + action log** | *One 180-day India-resident, append-only, write-once store — two callers* | Both specify the same store (180 days, Indian jurisdiction, write-once) from two duties. Today the spec exists twice with two shapes. | ~50 |
| **§35.5 CI gates + §29.2 pyramid + §41 "CI to build in R0"** | *One CI job table; sections contribute rows* | Three partial specifications of one pipeline. No single place currently says what CI runs — the highest-value merge for the build team, and it is the fix for §7.4's own "no CI" contradiction. | ~40 |
| **§54 D5 → §28.8 + §50.3** | delete D5 | §54's preamble is *"Each re-scopes a lane. None is researchable."* A PAT rotation is an action, not a decision; it already lives in §28.1 R0.13, §28.5, §28.8 day 1 and §50.3. | ~15 |
| **§55.2 rows 16–21 → §57** | *57 Contradictions ledger* | Those six already carry a **corrected live value** ("re-derive to 23.3%", "`kepano/obsidian-skills` 47,444★", "3,239 → 3,679 in 28 days", "Mintlify $450"). That is §57's shape. §55.2 then holds only claims with no corrected value yet. | 0 net (a move that removes a category error) |
| **Do NOT merge** §36.3 (API versioning) with §30.2 (format compatibility) | — | Deliberately opposite schemes: date-based headers vs *"do not use semver on file formats."* Add a cross-note so a later pass does not collapse them. | — |
| **Do NOT merge** §22.6 / §42.6 / §11.4 / §15.4 anti-recommendation blocks | — | Not a merge, but four sections end in a refusals table with four different column contracts. Standardise on §11.4/§42.6's shape: **Refuse · Because · Falsified by**. | — |
| — | **Subtotal, merges** | | **~455** |

---

## 3 · Near-constant table columns → a sentence above the table

| § | Table | Column | Distribution | Sentence to hoist | Words |
|---|---|---|---|---|---|
| 8.4 | Master key table (L558–582) | **We read** | `Yes` in **23 of 23** | "We read every key below; *We write* is the only distinction." | 11 |
| 16.1 | Completeness matrices (L1571–1623) | Nearest parity / Demand evidence tags | `[fetched]` on ~40 of ~48 populated cells | Add to the existing legend at L1567: "All parity and demand cells are `[fetched]` unless the cell says otherwise." | 40 |
| 44.1 | EU DSA table (L4125–4137) | **Applies?** | `Yes` ×9, `No` ×2 — and the closing *"Net EU surface: Arts 11, 12, 13, 14, 16, 17, 18, 24(3)"* already restates it exactly | Move that sentence above the table; delete the column; put the Art 15(2) and Art 19(1) exemption cites into the two excluded rows' Substance cells | 18 |
| 37.1 / 37.2 | Layering rule / role model | Grounding, Why | `[fetched 2026-08-29, <host>]` in every cell | "All vendor documentation read 2026-08-29; hosts named in-cell." | 18 |
| 52.2 | Shortlist (L4810–4817) | **Product collision** | `None found` on 5 of 6 | "No product collision was found for any candidate except bare `stet`." Keep only the `stet` cell. | 13 |
| 20 | Notion fidelity (L2170–2187) | Evidence | `[fetched]` ×14 of 16 | "Every row `[fetched]` except the relations/rollups and synced-blocks rows, which are `[inference]`." | 6 |
| 15.5 | Vendor pricing (L1526–1536) | **TAG** | `[fetched]` in **10 of 10** | "All prices `[fetched]` 2026-08-29." | 6 |
| 45.5 | Pricing and dunning (L4257–4263) | **Falsified by** | `—` in 3 of 5 | Move the two real falsifiers into prose; delete the column | 10 |
| 35.3 | Contrast table (L3370–3379) | **On `--bg` `#fafafa`** | **empty in 8 of 8** | Delete — the header already names the background | 4 |
| 8.3 | Tier 3 (L530–537) | **Rule** | begins `Preserve` in **6 of 6** | "Preserve byte-for-byte; never emit." Keep only each row's exception. | 0 (legibility) |
| 20 | Obsidian fidelity (L2158–2166) | Evidence | `[inference]` ×6 of 7 | "All `[inference]` except the bare-CR / zero-indent row, `[project-context]`." | 0 |
| 11.3 | Cost table (L931–937) | **Haiku 4.5** | `[derived]` on 5 of 5 | Hoist the tag; the preamble already gives the price basis | 0 |
| 35.1 · 39.1 · 43.1 · 45.2 · 45.7 · 38.3 · 42.2 · 42.3 · 35.5 · 43.2 · 50.2 | evidence / tag / L / Blocking / Effort columns | 8–12 of each | Hoist one sentence per table; name the single exception in-cell where one exists (e.g. §35.1 ADA Title III `[SS]`; §35.5 the quarterly manual pass; §50.2 "every market risk is likelihood 4") | ~10 total |
| — | **Subtotal, columns** | | | Legibility first; length second | **~130** |

---

## 4 · Honest total

| Component | Words |
|---|---|
| Cross-references (32 rows above) | **573** |
| Section merges | **~455** |
| Near-constant column collapses | **~130** |
| **Total** | **≈ 1,160** |
| **As a share of 100,076** | **≈ 1.16%** |

Range, honestly stated: **1,050–1,300 words, 1.0–1.3%.** The four analysts' row-level claims (~1,900 · ~1,600 · ~790 · ~1,400) over-count because they treated every *mention* of a number as a restatement; most are the subject of the row they sit in. The measured figures above are taken against the actual text.

**This is a cross-referencing pass, not a compression pass, and its value is not the 1.16%.** The higher-value output is (a) six broken cross-references that make a link pass impossible, (b) two refuted numbers still being published as measured, and (c) three specifications — CI, the 180-day compliance store, the MoR boundary — that exist in fragments with no single home. A previous pass was right: the document is at its irreducible length.

---

## 5 · Considered and REJECTED as not genuine duplication

| Proposal | Why rejected |
|---|---|
| **§0.3 rule 1 "Red proof before green" → §41** (A4, ~35 w) | §0.3 is the three-rule governance contract at the entry point; §41 is the standards registry. Both are read by different readers at different moments. **KEEP BOTH — governance preamble versus standards registry.** |
| **§47.1 machine-vs-human row counts → §15.1** (A4, ~55 w) | The numbers **differ** (21,707/15,786/5,021 vs 21,679/15,758/5,018) and §47.1's derived 42,514 and 6,073× come from *its* set. Replacing them would publish a wrong total. This is contradiction C8, not duplication. **Reconcile, do not collapse.** |
| **§29.1 MiniSearch ceiling → §33.6** (A2, ~90 w) | §29.1 says 100k ≈ 55 s / 2.07 GB; §33.6 says ~27 min / 5.1 GB. Different corpora (400-word synthetic vs 17,051 B/note). Collapsing them would delete a measurement. **Name the assumption in both.** |
| **`WIKILINK_RE` quadratic → one home** (A2) | Three disagreeing values are on record (36,865 ms/k=1.98 in `shape-gate.ts`; 42,679 ms/k=1.991 in §18.4; 96,890.7 ms/exp 2.37 in §29.1). The disagreement *is* the finding. |
| **`MAX_BYTES 4 MB` / `MAX_LINES 200,000` → §29.1 P3** (A2) | §7.1's is the file inventory, §29.1 P3 is the budget. Both subject-of-row. |
| **§7.3's 83% → pointer only** (A1 flagged, A4 wanted §7.3 canonical) | The seam-2 warning needs the number inline to be an instruction. Keep the bare number plus `(§18)`. |
| **§31.1 D1's full statement of the projection law → §5** (A1/A2/A3) | D1's argument is that a CRDT *inverts* the axiom; the inversion is unreadable without the axiom on the page. **KEEP BOTH — inversion argument needs it inline.** |
| **§15.1 `TAG` column collapse** (A1) | The column distinguishes `[measured]` from `[derived]`, which is exactly what RULE 6 requires of a table of live counts. Deleting it destroys the distinction. |
| **§23.2 `Infra` column collapse** (A1) | Contribution margin is only re-derivable with the infra number present. Three distinct values, not near-constant. |
| **DPDP §8(7)(a) erasure duty in §32.3 / §38.5 / §47.5** (A3) | Three *applications* of one duty — bucket-lock conflict, log-retention ceiling, telemetry retention. **KEEP ALL — three duties, three surfaces.** |
| **Obsidian forum topic 94732 in §18.6 and §31.1** (A2) | §18.6 uses it as mobile-complaint volume; §31.1 uses it as the diff-match-patch replay signature. **KEEP BOTH — volume evidence versus mechanism proof.** |
| **`d50a6b2` unpublish defect in §51.4** (A3) | One clause, already pointer-length; §37.3 carries the mechanism. |
| **"Never miss twice; queue depth ≥ 2" in §50.3** (A2) | The mitigation cell is six words. |
| **8,513 in §28.7, §28.8, §58, §0.4** | Subject of the risk row, the day-2 instruction, the public-claim wording, and a shell comment respectively. Only §4's recap was a restatement. |

---

## 6 · Cross-reference repairs the plan depends on

The replacement text above is cross-references; six current pointers do not resolve.

| Pointer as written | Where | Correct target |
|---|---|---|
| `§24.8` | §2, problem 8 (L180) | **§24.6** (§24 ends at 24.6) |
| `§21.1` | §46.1 (L4339) · §55.2 #13 (L4935) | **§25.1** (§21 has no subsections) |
| `§20.7` | §55.2 #19 (L4941) | **§21** (§20 has no subsections; §21 carries the Mintlify/GitBook/Statuspage wedge) |
| `[measured, §15]` | §16.3 row 1 (L1656) | **§19** |
| `§7.2` for the three self-contradictions | §16.4 row 0 (L1675) | **§7.4** |
| `the engine matrix in §5` | §8.1 (L454) | **§7.1** (`bench.ts`, 7 engines) or §9.1 |

**Live contradictions that must be resolved before any of these facts is quoted:** §57's "5,014 / 24,539" against §15.1's "5,018 / 24,669" (§57's *live* column is stale against §15.1) · three FX rates and two tags · `[SS]` vs `[fetched]` on Pimentel and on `blocksToMarkdownLossy()` · §32.3/§38.5 "DPDP Rules could not be opened" against §47.6 "notified 14 November 2025 `[fetched, PIB]`" · §22.3/§22.6 "track changes STRUCTURALLY CANNOT" against §34.5 Stage 1 shipping suggestions-as-splices (§34 is later and deeper — **§22 must be amended, not cross-referenced**) · §55's `[SS]` census of 52 against §58's 47 · §16.1's **IN PRD** column measures the superseded v1.1 PRD.
