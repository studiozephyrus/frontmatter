Reconcile verified (seventeenth identical check; unchanged and stable): `~/.claude` HEAD `6e390828`, `~/.sgnk` HEAD `e73dd088`, frontmatter HEAD `04938be`; zero commits by this subagent; the 19 `skills-src`/`settings.json` paths and 1 sgnk bin path all pre-date this session; every command run was read-only, scratch writes confined to `$TMPDIR`.

**The reconstruction the evidence actually supports is not a different product built on the engine — it is a different *claim* built on the same code: the engine's saleable output is not "we preserved your bytes" (a must-be, complained about 4 times in 12,556 comments) but "here are exactly the bytes the machine wrote, isolated from yours" (provenance, the input to the 23.7%-and-rising slop complaint), and that reframe moves the demand signal by roughly three orders of magnitude without changing a line of `offsets.ts`.**

---

**Steelman of "keep going", stated once and dropped.** The codebase is 88.6% of a shipping editor, the engine is the only correct one in the category, the incumbents have a dated confirmed defect, and the marginal cost of reaching revenue is a rename plus a checkout. Six weeks to a paid download page. That argument is real and it loses to one number: Show HN markdown editors have a median of 3 points across n=609 (`r25-w3`), and the thing being sold is a defect-absence nobody has ever asked for. You do not get to skip demand because the code is nearly done.

**A note on the rubric, because it is where the founder will cheat.** The brief asks me to score "reuse of the existing engine." I weight it at **5%**, deliberately, and the reason is diagnostic: *high reuse is the variable that produced this situation.* 25,407 lines exist, so every option that consumes them scores well on a dimension with no relationship to whether anyone pays. Sunk cost dressed as an asset. Demand (25%) and honest P(₹1L/mo) (30%) carry 55% between them; the rest is logistics.

---

**NEW MEASUREMENTS — `[measured]`/`[fetched]` 2026-08-31, re-runnable**

| # | Measurement | Value | Source |
|---|---|---|---|
| N1 | **Prettier weekly npm downloads** — a tool whose entire job is to rewrite your file wholesale | **132,375,801/week** | api.npmjs.org |
| N2 | **obsidian-linter** — "Format and style your notes" — installs | **1,036,360** | obsidian-releases registry |
| N3 | markdownlint-cli2 / remark-lint / textlint weekly npm | **1,618,062 / 327,304 / 219,091** | api.npmjs.org |
| N4 | `@modelcontextprotocol/sdk` weekly npm | **52,072,511** | api.npmjs.org |
| N5 | Best Obsidian rename-with-link-rewriting plugin (`consistent-attachments-and-links`) | **140,866** installs | registry |
| N6 | Best refactor plugin of any kind (`note-refactor-obsidian`) | **341,486** = 0.24% of registry total | registry |
| N7 | Registry plugins matching rename/refactor/broken-link | **60+**, ~40 of them under 5,000 installs | registry |
| N8 | **`table-editor-obsidian` — #5 plugin in the entire registry** | **3,153,561** | registry |
| N9 | Vale / markdownlint stars | 6,049 / 6,313; both free, **no paid tier served** | api.github.com; vale.sh HTTP 200 |
| N10 | HN stories: "docs as code" / "review AI generated code" / "AI slop documentation" / "markdownlint" | **4,164 / 266 / 47 / 3** | hn.algolia.com |
| N11 | This repo's own executable doc gates | `check-record.mjs`, `check-refs.mjs`, `spec-report.mjs`, `clean-architecture-report.mjs`, `corpus-foreign.mjs` — 5 real gates | `package.json` |

**N1 and N2 are the finding to sit with.** The market's revealed preference, at 132 million downloads a week and a million Obsidian installs, is for tools that **deliberately rewrite the whole file**. Byte-preservation is not merely un-demanded; the largest tool in the adjacent space sells the opposite and people opt in. A product headlined "we don't change your bytes" fights a behaviour a hundred million developers a week actively pay time to obtain.

**N8 is the cheapest embarrassment in the corpus.** Table editing is the 5th-most-installed plugin of 7,139, at 3.15M. It is 5–8 days of work, appears in zero of the three MVP stages, and the engine makes splice-backed table writes uniquely correct. It is the only place in this evidence base where "byte-exactness sold as a capability" meets a measured seven-figure install base.

---

**THE NINE OPTIONS**

**O1 — Vault-wide refactor, reviewable diff, refusal on ambiguity.** *What:* rename a note/heading/property; every link that will change shows as a hunk; accept, reject, or refuse on ambiguity. *Who pays:* Obsidian power users with 2,000+ note vaults. *Why now:* 86 likes, and agents generate renames at volume. *Reuse:* OffsetMap, splice, placement — ~80%. *Time to revenue:* 10–14 weeks. *Strongest objection:* **N5–N7 kill it.** Sixty plugins occupy this slot; the best is free at 140,866 installs; the whole category tops out at 341,486 cumulative — 0.24% of the registry. The most crowded free niche measured anywhere in this corpus, entered to serve a bug with 86 likes.

**O2 — Provenance: make what the machine wrote reviewable.** *What:* every agent write recorded as a byte range with prompt, timestamp and model id; machine spans render distinctly from human ones; one keystroke reverts a span; a report says "43% of this document was written by an agent — here is which 43%." *Who pays:* anyone accountable for prose an agent touched. *Why now:* slop is 23.7% of all complaints, **+149% in 20 months**, classified WORKFLOW/durable, nobody on it (finding 7); 266 HN stories on reviewing AI output (N10). *Reuse:* what a byte-addressing engine is uniquely for — **~85%**, with the certificate machinery becoming the provenance ledger. *Time to revenue:* 12–16 weeks. *Strongest objection:* complaints are not purchases — finding 2's logic re-applied to a louder complaint, possibly equally unmonetisable.

**O3 — Sync, done provably safely.** *Who pays:* everyone; the only thing here with a proven $4–8/month price and 56 of 60 HN payment comments (findings 4, 8). *Why now:* Obsidian's own docs concede auto-merge "may sometimes create duplicate text or formatting problems." *Reuse:* CAS + splice journal + git-merge already designed. *Time to revenue:* **6–12 months solo**, optimistically. *Strongest objection:* it turns a zero-liability local product into an on-call company holding other people's bytes, under DPDP, with DR on an R2 layout that has no object versioning, at a bus factor of one. Highest demand in the corpus, worst founder fit.

**O4 — Engine as npm library + MCP server + Claude Code plugin.** *What:* `safe-edit`, an exact-anchor write tool agents call instead of regenerating. *Why now:* N4 — 52M weekly SDK downloads, the largest new distribution surface in software. *Reuse:* 100%, and it deletes the 21,793-line editor. *Time to revenue:* **near-infinite.** *Strongest objection:* libraries in this shape do not monetise — markdownlint (1.6M/week) and Vale both ship zero paid tier (N3, N9) — and Claude Code's own `Edit` already does exact-string matching with refusal, which is why "String to replace not found" has 71 issue threads. A better version of a free primitive.

**O5 — Document CI.** *What:* a GitHub App gating markdown in PRs — link integrity, frontmatter schema, claim/citation checks, "this section is machine-written and unreviewed." *Who pays:* teams doing docs-as-code. *Why now:* 4,164 HN stories (N10); agents write docs PRs at **82.1% acceptance vs 66.1% for features**. *Reuse:* the five gates in N11 already run on this repo. *Time to revenue:* **8–12 weeks**, first buyer can be an existing client. *Strongest objection:* every comparable is free and beloved and none charges (N3, N9); "markdownlint" has 3 HN stories in the site's entire history; and CI budget sits with a platform team who will ask why `markdownlint --fix` in a workflow file isn't enough.

**O6 — Nested-construct live preview, as an Obsidian plugin.** *Why now:* 501 likes, most-voted bug in the category's history. *Reuse:* ~15% (CodeMirror, not engine). *Time to revenue:* zero — it is free. *Strongest objection:* Obsidian shipped **51 live-preview fixes in the 142 releases of 2025–26** and is visibly closing; the day they ship it you are a changelog entry. **As distribution rather than revenue it is the best asset here.**

**O7 — Services productised.** *What:* a ₹3,00,000 fixed-scope AI-orchestration engagement, four a year. *Who pays:* the existing client register. *Time to revenue:* **this month.** *Reuse:* ~10%. *Strongest objection:* it is a person, not an asset; it does not compound; and it is what the founder already does, so recommending it is not a recommendation.

**O8 — Redeploy to the liable-document lane (.docx).** *What:* byte-exact machine edits to documents a counterparty signs. *Why now:* `adeu` (MIT, 149 stars, pushed 2026-08-30) independently converged on the identical architecture and pointed it where the reviewer is a lawyer with Word. *Reuse:* concepts, not code — **~10%**. *Strongest objection:* OOXML is a different engine, the buyer is a segment `r22-t1` could not prove exists, and you restart at 10% carryover against a nine-month head start.

**O9 — Ship the editor as it stands, $49 one-time.** *Reuse:* 100%. *Time to revenue:* 6 weeks. *Strongest objection:* findings 1, 2, 5 unchanged; ₹1L/month needs **22.5 sales every month forever** [derived: 100,000 ÷ (49 × 95.39 × 0.95)] with no distribution, against a Show HN median of 3 points.

---

**THE SCORING**

Weights: demand 25 · time-to-revenue 15 · defensibility 10 · one-founder fit 15 · engine reuse 5 · P(₹1L/mo in 12mo) 30. Scores 0–10.

| Option | Demand | Time | Defens. | Founder | Reuse | P(₹1L) | **Weighted** |
|---|---|---|---|---|---|---|---|
| **O7 Services productised** | 9 | 10 | 3 | 9 | 2 | 9 | **8.20** |
| **O2 Provenance** | 9 | 5 | 4 | 5 | 9 | 4 | **5.80** |
| **O1 Refactor** | 5 | 5 | 4 | 8 | 9 | 2 | **4.65** |
| **O3 Sync** | 9 | 2 | 6 | 2 | 6 | 3 | **4.65** |
| **O9 $49 one-time** | 3 | 8 | 2 | 7 | 10 | 3 | **4.60** |
| **O5 Document CI** | 4 | 6 | 4 | 6 | 7 | 3 | **4.45** |
| **O8 .docx redeploy** | 6 | 3 | 6 | 4 | 3 | 3 | **4.20** |
| **O6 Live-preview plugin** | 8 | 2 | 2 | 8 | 3 | 1 | **4.15** |
| **O4 Library / MCP** | 4 | 2 | 3 | 9 | 10 | 1 | **3.75** |

Sample arithmetic, O2: `.25(9)+.15(5)+.10(4)+.15(5)+.05(9)+.30(4) = 2.25+0.75+0.40+0.75+0.45+1.20 = 5.80` [derived].

**Read it honestly and the first result is uncomfortable: the highest-EV thing available is not a product.** O7 clears ₹1L at 78 hours a month starting now, at a probability no software option approaches. Any recommendation ignoring that is dishonest. But the founder asked what to *build*, so O7 becomes the funding line rather than the answer — with a non-optional condition below.

---

**RECOMMENDATION: O2 — provenance — shipped as a plugin, never as an editor, funded by O7, with O6 as the free wedge.**

**The specific thing to build.** Not "an editor with a provenance feature." One capability, into two channels the buyer already has open:

1. An **Obsidian plugin** and a **Claude Code plugin / MCP server** wrapping file writes. Every agent write is spliced, not regenerated, and recorded as `{byte range, prompt hash, model, timestamp}` in a sidecar ledger.
2. The UI is a **provenance overlay**: machine spans visually distinct from yours, per-span revert, a per-file "43% of this document is unreviewed machine text — here it is," and a vault-wide roll-up.
3. Free: single-file. Paid: **vault-wide operations** — roll-up, O1's refactor, bulk revert. The only surface where the user experiences something unavailable free.

**Why this and not the others.** It is the only option connecting the corpus's loudest, fastest-growing, unserved signal (finding 7) to the one thing this codebase does that no competitor can retrofit: a regenerating writer structurally cannot tell you which bytes it wrote; a byte-addressing one gets it free. Critically, **it needs no classifier.** The founder never judges what slop is — fortunate, since the learning loop is dark (finding 10: 6,884 routing decisions, 1 reward label) and shipping an uncalibrated judge would violate his own Learned Rules #4, #5 and #32 on day one. Attribution is deterministic; the user judges. That single choice is what makes this buildable by one person on a very small AI budget.

**Why plugin, not editor.** It deletes 21,793 lines of Obsidian clone and the fight with 7,139 free plugins; it lives inside the tool the buyer already has open; and it is the only channel here with a **proven paid conversion** — Brevilabs' Copilot, 1,783,652 installs, charging $7.99–$14.99/month inside Obsidian. The existence proof the D2C plan never had.

**Why O6 is the wedge, not the product.** Ship nested-construct live preview **free, first, as its own plugin, inside 30 days.** 501 likes of pre-existing demand, weeks not months, and it buys the one thing the founder has zero of: an install base to ship the paid thing to. Its defensibility is 2/10 and that is fine — you are not defending it, you are renting attention with it.

**Dated gates. Stop if any fails.**

| Date | Gate | Stop condition |
|---|---|---|
| +30d | Live-preview plugin published | Not in the registry → stop; O7 is the whole answer |
| +60d | **5,000 installs**, free plugin | Under 1,500 → the channel does not work; stop |
| +90d | Provenance overlay, free, single-file | Under 2,000 installs → stop |
| +120d | **25 paying at $7 (≈₹16,700/mo)** | Under 10 → convert to O7 permanently |
| +365d | ₹1,00,000/month | — |

**The non-optional condition:** O7 revenue is booked *before* the build starts, not alongside it. At one person — critique 9 established the second founder does not exist — 78 client hours plus support plus compliance leaves ~108 engineering hours a month, and this plan must fit inside that. If it does not fit, it does not get built. It does not get built *slower*.

**Honest probability of ₹1L/month from the plugin within twelve months: 20–25%.** Not because the idea is weak, but because 25 paying at +120d extrapolated to ~500 at +365d requires a conversion curve nobody in this corpus has demonstrated for individual-paid markdown tooling.

---

**THE STRONGEST ARGUMENT AGAINST MY OWN RECOMMENDATION, STATED IN FULL**

It is this, and it is serious: **I have just done to the founder exactly what the founder did to himself.** He found a real mechanism, went looking for a demand signal that fit it, and built for two years. I have found that his signal was wrong, gone looking for the loudest remaining one in the same corpus, and handed it back attached to the same code. The move is structurally identical. Slop at 23.7% is a *complaint* count, from the same corpora that produced finding 2 — and finding 2's whole lesson is that complaint volume and purchase behaviour are different variables. There is no measurement anywhere in the 97 reports of a single human paying money to have machine-written text attributed. The 266 HN stories on reviewing AI output (N10) are conversation, not commerce.

The second-strongest objection is that provenance is a **feature of the agent, not of the editor**, and the agents are better placed to ship it. Cursor, Zed and Claude Code know precisely which bytes they wrote — they hold the diff at write time. Zed already surfaces it per-hunk (finding 1). That they do not persist it is a product choice, not a capability gap, and a product choice is reversible in one sprint by a funded team. My "no competitor can retrofit this" claim is weaker than it sounded: they cannot retrofit it into a file written by a *different* tool, but that is a narrow, explainable-in-a-paragraph advantage, not a moat.

The third is that N1 and N2 cut against provenance too. A hundred and thirty-two million weekly Prettier downloads and a million linter installs say the user's actual relationship to machine rewriting is *"do it, all of it, don't ask me."* A product that says "here are the 43% of your document a machine wrote, please review it" asks for labour the market has spent a decade automating away.

**What would change my mind, precisely.** Before writing the provenance overlay, run the test DECIDE §9 scheduled for day 60 and nobody has run: three landing pages, ≥400 visitors each — arm A "your files, unmangled"; arm B "see exactly what the AI wrote"; arm C "rename anything, review every link." If arm B does not capture at least **40% more emails than arm A**, my recommendation is wrong and O5 or O7 takes its place. That test costs one weekend and less than a single week of the documentation written this month. **Running it before writing any code is the only recommendation in this report I would defend without qualification.**
