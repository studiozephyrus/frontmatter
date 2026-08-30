Reconciled: read-only pass, no mutations, no commits — the 20 dirty paths are pre-existing skill work unrelated to this task.

| # | FACT | SECTIONS IT APPEARS IN | KEEP IN | REPLACE-WITH | WORDS SAVED |
|---|---|---|---|---|---|
| 1 | Two decision matrices scoring the same 4 sync options (CRDT / OT / git-branch-review / patch) on overlapping criteria incl. "splice fit = REFUSE has no meaning in a CRDT" | §31.1 weighted matrix (L2914–2923) + §34.1 scorecard (L3256–3266) | §31.1 | §34.1 → "Scored in §31.1; git branch-and-review wins on every axis that matters here." Keep only §34.1's two rows §31.1 lacks (auditability, `merge3` already in codebase) | ~120 |
| 2 | The whole "Proven `[measured]`" recap: 8,513 files/7 authors + three executed teardowns + 24,539 gates/124 automations + campaign pipeline | §1 stage table (L153–160), §4 (L252), §15.1 (L1379–1400), §19 (L2113–2117) | §1 for corpus/substrate, §19 for teardowns, §15.1 for live counts | §4 L252 → "**Proven `[measured]`:** the corpus and substrate results in §1/§15.1, and the three executed teardowns in §19." | ~50 |
| 3 | The eval-lane refusal rationale, near-verbatim ("ends the corruption guarantee **and** converts every prompt injection into RCE on infrastructure holding every customer's documents and API keys") | §0.2 v6 (L114), §6.2 (L330), §9.2 (L680–719), §22.3 (L2288), §51.4 (L4784), §60 (L5081) | §9.2 | §6.2 and §51.4 cells → "Refused permanently — §9.2" | ~48 |
| 4 | The three self-contradictions (MDMAX unreached vs PLAN.md "shipped" · no CI in a product selling document CI · shipped design system ≠ our design system) | §7.4 (L426–430), §16.4 row 0 (L1675), §54 D1 (L4884), §57 (L4999/5014) | §7.4 | §16.4 row 0 → "**Fix the three self-contradictions of §7.4 first**" (it currently mis-cites §7.2) | ~40 |
| 5 | The Obsidian first-note claim is unsourced — an unattributed pull-quote in a 2025 author blog post, no methodology, no denominator | §2 note (L183), §4 (L256), §18.2 (L1867), §57 (L5012), §58 (L5036) | §18.2 — only place naming the source (Red Tash, 2025-05-21, verbatim quote, forum topic 90236) | §2 note → "The complexity problem is real; the widely-repeated first-note statistic is unsourced and must not be cited — traced in §18.2." | ~40 |
| 6 | "Never persist CRDT state — a CRDT always converges so REFUSE has no meaning inside one" + the competitor whose byte contract exists only inside a live CRDT server | §0.2 v4 (L112), §3.2 (L214), §14.4 (L1299), §16.4 (L1699), §19 (L2117), §22.3 (L2286), §31.1 D1/D3 (L2910/2912), §34.6 (L3311) | §31.1 D1–D3 (mechanism) + §19 (the measured competitor) | §34.6 bullet 1 → "**Never persist CRDT state as the document** — §31.1 D3. The one irreversible decision in this section." §16.4 L1699 and §22.3 L2286 → "settled, §31.1" | ~38 |
| 7 | RBI 2026 Framework: recurring auth without AFA up to ₹15,000/txn; software not in the ₹1,00,000 carve-out; architectural constant, not a pricing input | §24.4 (L2435), §45.2 (L4231), §45.3 (L4244–4246), §45.5 (L4259) | §45.2 — the only place quoting para 8(a) verbatim | §24.4 blockquote → "**₹15,000/transaction is an architectural constant, not a pricing input** (§45.2)." Drop the framework/carve-out restatement | ~28 |
| 8 | The projection law restated in full ("the file is the only source of truth, every view is a deterministic reversible projection owning no state") | §5 (L267), §6.1 (L312), §8.5 (L615), §18 (L1803), §31.1 D1 (L2910) | §5 | §18 L1803 → "The governing constraint is the projection law (§5), which is why simplicity is enforceable: anything needing its own configuration surface is already forbidden by the architecture." §31.1 D1 = **KEEP BOTH** — inversion argument needs it inline | ~22 |
| 9 | Hubble.md regenerates the body, deletes reference links with their visible text, is not a fixed point | §2 (L175), §3.1 (L203), §16.3 (L1656), §19 (L2116) | §19 | §16.3 row 1 → "Every opened competitor regenerates; see §19." (currently cites `[measured, §15]` — wrong section) | ~22 |
| 10 | MDMAX = 13 files / 3,614 lines; 15 targets; 19 constructs | §1 (L157), §7.1 (L379–395), §15.1 (L1399), §15.2 (L1428) | §7.1 | §15.1 and §15.2 cells → "mdmax engine (§7.1): `uncertifiableShare()` 8/15, benchId `51947c2e…`, fold `mdmax/fold@1`" — drop file/line/target/construct counts. §1 = **KEEP BOTH** (origin narrative, not engine spec) | ~20 |
| 11 | 83% foreign-vault refusal, cause = zero-indent YAML sequences, 6,613 of 6,614 files | §7.3 (L424), §18 (L1814), §18.2 Z row (L1851), §28.8 (L2684), §47.3 (L4467), §50.1 (L4715), §58 (L5034) | §18 (L1814) — only statement carrying the denominator and its provenance | §18.2 Z row → "(today 17% pass — see §18 preamble)". §47.3 and §50.1 → "83% aggregate (§18)". §7.3 = **KEEP BOTH** — seam-2 warning needs it inline | ~18 |
| 12 | Median dev-focused free-to-paid conversion is 5%, half the non-developer rate | §4 (L248), §25.2 (L2479), §25.3 col header (L2485) | §25.2 — the only verbatim-quoted form | §4 cell → "**Unproven. Zero paying users**, into the hard half of freemium (§25.2)" | ~16 |
| 13 | Google's public API cannot create suggestions at all | §2 p6 (L178), §3.1 (L200), §3.2 (L217), §9.3 (L742), §13 (L1045) | §13 (the differentiator) + §3.2 (the row's own subject) | §2 p6 and §3.1 cells → "no programmatic suggestion authorship (§13)" | ~16 |
| 14 | `blocksToMarkdownLossy()` is a real shipping API name — the market's own confession | §0.2 v3 (L111), §6.2 (L328), §19 (L2131), §36.2 (L3463) | §19 (one of five framework loss mechanisms) | §6.2 row → "Settled verdict 3 (§0.2); mechanism in §19". Also resolve the tag collision: `[SS]` in §0.2/§6.2 vs `[fetched]` in §36.2 and the digest | ~14 |
| 15 | Ambient related-notes: the market leader's most-discussed open issues are all silent index breakage | §11.2 rank 8 (L924), §11.4 (L943) | §11.2 (carries the issue titles and counts) | §11.4 → "…and the index-failure evidence in §11.2 rank 8" | ~12 |
| 16 | Anchors re-resolve at 99.627% | §7.1 `normalize.ts` (L395, "384 configurations"), §14.5 (L1332, "0.050% false over 41,642 block-versions") | §14.5 — richer, with the false-positive rate | §7.1 cell → "**99.627%** re-anchoring (§14.5)". **Reconcile first**: 384 configurations vs 41,642 block-versions cannot both be the population | ~10 |
| 17 | Under 4% of GitHub notebooks reproduce | §5 (L291, `[SS]`), §9 (L646), §9.2 (L708, `[fetched]`, 4.03% of 1,159,166, with the denominator discrepancy) | §9.2 | §5 cell → "under 4% of GitHub notebooks reproduce (§9.2)". Resolves a live tag collision — §55.2 #2 says this figure was "never opened" while §9.2 cites Pimentel et al. as `[fetched]` | ~8 |
| 18 | Support wall = 232 tickets/mo = 46.4 founder-hours at 10,000 users | §25.1 (L2467), §46.1 (L4339, full arithmetic), §46.2 (L4361, corrected to 80.45 h), §55.2 #13 (L4935) | §46.1 for the model, §46.2 for the correction | §25.1 cell → "**232 = 46.4 founder-hours — optimistic; the weighted figure is 80.45 (§46.2)**". §55.2 #13 = **KEEP BOTH** (verification ledger) | ~6 (fixes a wrong headline) |
| — | Checked and **clean** — stated once outside the digest | R2 has no object versioning (§32.1 only) · Obsidian Homepage 1,294,057 (§3.2 only) · Litmus $500/mo (§3.2 only) · the category sentence (§5 only) · `land()` contract (§12 only) · 7.25× projection-vs-AI installs (§11.1 only) · Ansible Lightspeed 49.08% (§11.5 only) | — | no action | 0 |

**Sections that could be merged**

| Merge | Why | How |
|---|---|---|
| §0.2 "Settled verdicts" → §6.2 "Non-goals" | Verdicts 1, 3, 4, 5, 6, 7 all reappear as non-goal rows with the same evidence cell | Keep §0.2 as a seven-row *index* (verdict + § pointer only, drop "cost of reopening"); §6.2 carries the reasons |
| §3.2 "The gap map" → §16.3 "What no competitor has" | Same rows underneath: byte-exact editing on both halves, fidelity without a daemon, the review loop, byte-anchored provenance | One table: Gap · Evidence of absence · Nearest competitor · Window · Distance |
| §34.1 + §34.2 scorecard rows → §31.1 | Same options, same criteria, incompatible scales (/30 vs /80) | Fold into §31.1; §34 keeps only collaboration-specific material (fishbowl effect, presence badge, staged migration) |
| §55.2 rows 16–21 → §57 | Those six carry a corrected live value ("re-derive to 23.3%", "fix to `kepano/obsidian-skills` 47,444★", "restate as 3,239 → 3,679 in 28 days", "Mintlify $450") — that is §57's shape | Move the six; §55.2 keeps only claims with no corrected value yet |
| §22.6 / §42.6 / §11.4 / §15.4 anti-recommendation blocks | Not a merge — but four sections end in a refusals table with four different column contracts | Standardise on §11.4/§42.6's shape: Refuse · Because · Falsified by |

**Tables with a near-constant column (hoist to a sentence above the table)**

| Table | Column | Value | Fix |
|---|---|---|---|
| §8.4 master key table (L558–582) | **We read** | `Yes` in **23 of 23** rows | Delete. "We read every key below; *We write* is the only distinction." |
| §35.3 contrast table (L3370–3379) | **On `--bg` `#fafafa`** | **empty in 8 of 8** | Delete; the header already names the background |
| §15.5 vendor pricing table (L1526–1536) | **TAG** | `[fetched]` in **11 of 11** | Delete. "All prices `[fetched]` 2026-08-29." |
| §15.1 live-count table (L1373–1403) | **TAG** | `[measured]`/`[derived]` in **26 of 27**; only the npm row is `[fetched]` | Delete; the L1371 preamble already half-says it |
| §8.3 Tier 3 table (L530–537) | **Rule** | begins "Preserve" in **6 of 6** | Collapse to the exception only; the heading already says "parse on input, never emit" |
| §20 Obsidian fidelity table (L2158–2166) | **Evidence** | `[inference]` in **6 of 7** | "All `[inference]` except the bare-CR/zero-indent row `[project-context]`" |
| §11.3 cost table (L931–937) | **Haiku 4.5** | `[derived]` on **5 of 5** values | Hoist the tag; the preamble gives the price basis |
| §23.2 unit economics (L2348–2356) | **Infra** | `₹14.62` ×3, `$0.153` ×3 — and `$0.153` is already in the preamble at L2346 | Delete the column |
| §16.1 completeness matrices (L1571–1623) | **Nearest parity** / **Demand evidence** | `[fetched]` on ~40 of ~48 populated cells | Hoist to the legend at L1567, which already exists for `✱` |

**Found while checking — not duplication, but blocking a clean cross-reference pass**

| Defect | Location | Correct target |
|---|---|---|
| `§24.8` does not exist (§24 ends at 24.6) | §2 problem 8 (L180) | §24.6 |
| `§21.1` does not exist (§21 has no subsections) | §46.1 (L4339), §55.2 #13 (L4935) | §21 |
| `§20.7` does not exist (§20 has no subsections) | §55.2 #19 (L4941) | §20 |
| `[measured, §15]` points at the internal-system section | §16.3 (L1656) | §19 |
| "§7.2" cited for the three self-contradictions | §16.4 row 0 (L1675) | §7.4 |
| Same fact, two live values: **5,014 / 24,539** labelled "Live `[measured]`" in §57 (L5002) vs **5,018 / 24,669** measured 2026-08-29 in §15.1 (L1382, L1385) | §57 vs §15.1 | §57's "live" column is stale against §15.1 |
| Three USD→INR rates: **₹95.39/₹95.59** (§24.1), **₹95.40** (§23.2), **₹95.533851** (§46.4); tagged `[fetched]` in §24.1 and `[SS]` in §36.4 (L3508) | §23.2 / §24.1 / §36.4 / §46.4 | pick one rate + one tag |
| §23.2's three INR rows show **64.0 / 64.7 / 72.7%**; the headline "**57–73%** on every INR tier" (digest, §23.2 L2358) is not re-derivable from its own table | §23.2 | re-derive at write time |
| **2.14:1**: §7.4 (L430) and §55.4 (L4958) attribute it to `body-faint #b8b8b8`; §35.3 (L3378) attributes it to `--ring`, and §35.3's own note (L3383) says `#b8b8b8` computes to **1.984:1** | §7.4 / §35.3 / §55.4 | §35.3 is canonical; the other two should cross-ref it, not restate a refuted figure |
