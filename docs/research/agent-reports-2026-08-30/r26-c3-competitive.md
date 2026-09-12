Read-only, verified 9 times, unchanged: `~/.claude` HEAD `6e390828` (2026-08-27), frontmatter HEAD `04938be`, zero commits by this agent, all dirty paths pre-date the session, writes confined to `$TMPDIR`. This hook is re-firing on pre-existing dirt; the verification will not change on further repetitions.

---

The single most damaging finding, in one sentence: **an unpaid solo developer shipped this product inside Obsidian nine months ago, gave it away, and has 15,064 GitHub stars and 1.96M registry downloads — while the plan spends 242 days reaching its first paying stranger and has explicitly banned itself from the channel that produced him.**

**The steelman, first and honestly.** There is a real, non-obvious, technically hard thing here that nobody else has built: a splice writer that changes only the bytes you touched, verified against an 8,513-file pinned corpus, with 1,575 tests and a refusal path where every competitor guesses. The incumbents genuinely have the defect — Cursor's own staff call doubled blank lines and destroyed carriage returns "a known issue" (`r24-v3`), Cline has shipped four line-ending fixes in eight months and issue #13504 is still open (`r25-w2`), and Obsidian's own sync doc concedes auto-merge "may sometimes create duplicate text or formatting problems" (§88.1). Agent-written markdown is growing, CRLF reports in this ecosystem are up 290% year over year (`r25-w2`), and when an LLM writes to a file, byte-preservation stops being invisible plumbing and becomes the reviewable diff. Under that reading, frontmatter is early to a defect class that is about to matter, holding the only correct implementation, and the failure of the market to ask for it yet is timing rather than absence. That is the strongest version. It is coherent, it is technically true, and it is not enough.

---

**NEW MEASUREMENTS TAKEN FOR THIS CRITIQUE** — all `[fetched]`/`[measured]` 2026-08-31, sources named so they can be re-run.

| # | Measurement | Value | Source |
|---|---|---|---|
| M1 | Obsidian community registry | **7,139 plugins · 143,290,675 cumulative downloads** | `raw.githubusercontent.com/obsidianmd/obsidian-releases` `community-plugins.json` + `community-plugin-stats.json`, HTTP 200 |
| M2 | Plugins whose name/description matches an AI/agent token | **782 plugins · 9,002,085 downloads · 6.28% of registry** | derived from M1 |
| M3 | **Claudian** — "Embeds Claude Code/Codex and other local Agents as AI collaborators in your vault" | **1,958,668 downloads · 15,064 stars**; repo created **2025-12-05**, 269 days → **7,281 dl/day, 56 stars/day** | registry + `api.github.com/repos/YishenTu/claudian` |
| M4 | **Copilot** (Brevilabs LLC) — "Run AI agents such as Claude Code, Codex, and OpenCode inside your vault" | **1,783,652 downloads · 7,651 stars**, live since **2023-03-31** | registry + GitHub API |
| M5 | Its price | Free BYOK **$0** · Lite **$7.99/mo or $74.99/yr** · Plus **$14.99/mo or $139.99/yr** · Supporter **$349.99** | `obsidiancopilot.com/en/pricing`, HTTP 200 |
| M6 | **Drift** — "Detects external file changes and shows side-by-side diffs with per-chunk…" — *our MVP-0 demo, as an Obsidian plugin* | **893 downloads · 8 stars**, created 2026-02-15 | registry + GitHub API |
| M7 | Star ratio, agent-in-vault : per-hunk-diff | **15,064 : 8 = 1,883 : 1** | derived M3/M6 |
| M8 | **Schema Refactor** — "Safely rename properties across Markdown frontmatter and Bases" — *DECIDE §3.2's flagship* | **66 downloads** | registry |
| M9 | Tag Wrangler (tag rename/merge) · Global Search and Replace | **1,067,863** · **65,569** | registry |
| M10 | Obsidian **Git** plugin — the JTBD incumbent, already installed | **3,075,875 downloads** | registry |
| M11 | Obsidian changelog, **484 releases 2020-07 → 2026-08**: occurrences of `llm` / `copilot` / `agent` | **0 / 0 / 0**. `artificial intelligence` = 1 (a 2020 alias example). `crlf` = 1, `line ending` = 2, `properties` = 383 | `obsidian.md/changelog.json`, HTTP 200 |
| M12 | Obsidian conflict-resolution setting actually shipped | **1.9.10, early access 2025-08-05, public 2025-08-18** — not the 2025-11-28 doc commit §88.1 dated it from. It is **12.5 months old**, not 9 | changelog JSON |
| M13 | Obsidian still actively fixing nested-construct live preview | **51 `live preview` hits in the 142 releases of 2025–26**; 2026-08-12 *"Fixed inline math in a list item or callout not rendering correctly"*; 2026-07-30 *"Fixed embeds inside Markdown lists not showing the correct indentation"* | changelog JSON |
| M14 | Stack Overflow 2025, IDE usage | VS Code **75.9%** · Cursor 17.9% · **Sublime Text 10.5%** · Claude Code 9.7% · **Zed 7.3%** | `survey.stackoverflow.co/2025/technology`, HTTP 200 |
| M15 | SO's own editorial verdict | *"Subscription-based, AI-enabled IDEs weren't able to topple the dominance of Visual Studio and Visual Studio Code this year… while relying on extensions as optional, paid AI services."* | same |
| M16 | This repo, today | **no `.github/workflows`**; 28-day file-changes `docs/` **292** vs `src/` **10** = **29.2:1**; **5 active commit-days in 28 (17.9%)**; `docs/` **2,343,005 words** vs `src/` **25,407 lines** = **92.2 words per line** | `git log` / `find` in the working tree |

**One honesty caveat that makes the rest credible:** Obsidian's registry `downloads` is cumulative across releases and includes updates. Claudian has 71 published versions, so a conservative floor is ~27,600 distinct installs, not 1.96M. **15,064 GitHub stars is the hard floor of distinct interested humans.** Frontmatter's is zero, and MVP-0's exit criterion is ten.

---

**FATAL — 1. There is nothing a user can perceive in the first session on a normal file, and the demo that would show it is free in two places.**

You asked me to be willing to say "nothing." Here is the precise, defensible version, which is slightly worse than "nothing":

| Session-one scenario | What frontmatter shows | What the user already has |
|---|---|---|
| LF file, ASCII, flat structure, agent edits 2 hunks | a reviewable diff | Zed: "accept or reject each individual change hunk" (finding 1). Claude Code: exact-string `Edit` that refuses on no-match |
| Same, inside Obsidian | — | Claudian / Copilot / Agent Client — **4,165,249 cumulative downloads across four plugins** (M3, M4, registry) |
| Same, in a git repo | byte-identical rejected file | `git diff` / `git add -p`, already installed **3,075,875 times inside Obsidian alone** (M10) |
| **CRLF file, or nested fence-in-callout-in-list, or a 6-file change** | **a visible, real, unmatched difference** | nothing equivalent |

So the differentiation is real and it is **conditional on an adversarial file**. That is a demo that requires you to hand the user a file crafted to break the competitor. Every operator who has watched a founder do that on a call knows what the room thinks. And the record already concedes it: *"for one person editing their own prose, there is no reason to use this over a text editor and git"* (DECIDE §3.1).

Combined with finding 2 — 4 complaints in 12,556, `"line endings"` in **1 of 43,656** issue titles — the position is: a difference that is invisible unless staged, in a defect class 0.03% of users have ever mentioned.

**Falsifier:** hand ten strangers their own real repository and the binary, unstaged, with no CRLF setup. If ≥6 of 10 spontaneously notice a difference from their current tool *without* being shown the corrupted-file comparison, I am wrong. This is already DECIDE §9's day-41 test; run it at day 5 with a prototype instead.

---

**FATAL — 2. Obsidian does not need to ship markdown-aware AI editing. Its ecosystem shipped it, for free, and we banned ourselves from that ecosystem.**

You asked what happens to us if Obsidian ships better markdown-aware AI editing. The answer is that **the question is already resolved and we lost it**, in a way §88.2's Scenario A did not model.

- Obsidian has shipped **zero** first-party AI in 484 releases across six years (M11). They will not build it.
- They do not have to. **Claudian** put Claude Code inside the vault in 269 days and took 15,064 stars (M3). **Copilot** has been doing it since March 2023 and charges **$14.99/mo** (M4, M5).
- Obsidian captures 100% of the resulting retention, pays zero engineers, and takes zero support load. This is the strongest structural position in the category and it is unavailable to us **by our own decision** — BUSINESS §86 bans third-party plugins on security grounds.

§86 scores that ban against community cost. It does not price the thing that actually matters: **the plugin registry is not our community risk, it is our competitor's distribution engine, and it is 143,290,675 downloads deep.** §88.2 asks "what if Obsidian ships conflict review" and answers "reposition." The real question is "what if a volunteer ships our whole product inside Obsidian," and the answer is that he did, in December, and neither §86 nor §88 mentions him.

**Falsifier:** show me an Obsidian plugin with >1M downloads that a standalone competitor beat by being outside the ecosystem. I could not construct one. If Files.md (730 HN points, 2026-05-18, `[fetched]`) or any 2026 standalone converts a meaningful paid base against the plugin incumbents within 12 months, this downgrades to SEVERE.

---

**SEVERE — 3. The asymmetry is not what you think, and the honest answer to "how long would it take them" is worse than "one sprint."**

| Party | What erasing us requires | Elapsed time | Evidence |
|---|---|---|---|
| **Zed** | **Nothing for the demo — shipped and documented.** For fidelity: preserve line endings on the apply path. Bounded bugfix; they already have the issue (#60063, "Staging hunks in CSVs change line endings", 2026-06-29) | **0 days for the demo · 1–2 sprints for fidelity** | finding 1; `r25-w2` |
| **A single unpaid volunteer** | **Nothing. Done.** Claudian, one developer, 269 days, 15,064 stars, no CI required, no PRD, no corpus | **already happened** | M3 |
| **Obsidian** | Flip the existing *Create conflict file* default. The setting shipped **2025-08-18** | **0 days (config change)** | M12 |
| **Brevilabs (Copilot plugin)** | Nothing — already monetising at 2.5–4.8× our price with 1.78M downloads and 3.4 years of head start | **already happened** | M4, M5 |
| **Anthropic** | Add a diff-review affordance to Claude Code; the `Edit` tool already exact-matches and hard-refuses | **one release** | `r25-w2` |
| **Cursor** | Fix the defect their own staff already call known | **1–2 quarters, and they are incentivised** | `r24-v3` |
| **GitHub** | Ship a prose mode over `github.dev` | **12–24 months, and they don't need to** | §88.4 |
| **A funded 8-person rival** | Build it; every dependency is free (`yaml` 202M/wk) | **6–9 months to parity, 0 to the claim** | §88.6 |

**The finding is not "one sprint." It is that the shortest fuse on this table already burned down, and it was lit by someone with less capital than you.** The plan's implicit theory of defensibility — hard engineering that a big team would not bother to do — is refuted by a solo developer who did not do the hard engineering at all and won anyway, because he did not ask anyone to move.

Note what §88's moat matrix already concedes and what this adds: moat #2 (byte-fidelity) survives outright in **2 of 6** columns; #7 is GONE in all six; #6 in all six. This adds a seventh column — *volunteer inside the incumbent* — in which #1, #2, #5, #6 and #7 are all GONE on day one.

**Falsifier:** if Claudian's star growth (56/day) collapses below 5/day by 2026-12-31 while its issue tracker fills with fidelity complaints, the volunteer threat is a fad and this is SERIOUS not SEVERE. Track `api.github.com/repos/YishenTu/claudian` monthly; it costs one curl.

---

**SEVERE — 4. "We are more correct" has a measured, dated losing record in this exact market.**

You asked for real precedents and what they had in common. Here they are, with the outcome quantified rather than asserted.

| Tool | Superior on | Outcome, dated | Margin |
|---|---|---|---|
| **Sublime Text** | native, order-of-magnitude faster startup, lower memory than Electron | **10.5%** usage vs VS Code **75.9%**, SO 2025, n=49k+ `[fetched]` | **7.2 : 1 against** |
| **Kite** | best ML completion of its era; 500,000 MAU, near-zero marketing | dead 2022-11. *"Our 500k developers would not pay to use it."* | 500,000 → $0 |
| **Atom** | the editor that created the category | sunset by its own owner, 2022-12 | absorbed |
| **Fig** | beloved, precise, narrow | acquired by Amazon 2023-08-28, folded into CodeWhisperer 2024-02 | feature, not company |
| **Arc** | most-praised browser design of its generation | **Atlassian acquires The Browser Company, 2025-09-04** (HN 523 pts) `[fetched]`; product deprioritised for Dia | absorbed |
| **Obsidian Drift** | literally our demo, correctly built | **893 downloads, 8 stars** in 197 days | 1,883 : 1 against Claudian |

**What they have in common, stated as a mechanism rather than a moral:**

1. Each was better on an axis the buyer ranked **below** free, ecosystem, and habit. Kano puts byte-exactness in Must-be — "done well, customers are just neutral" (`r25-w5`). You cannot build a value proposition on a disqualifier avoided.
2. **None of them owned a distribution surface.** VS Code had Microsoft and the marketplace; Sublime had a download page. Claudian has the Obsidian registry; frontmatter has a Show HN slot with a **median of 3 points across 386 launches** (`r25-w5` R3).
3. **Each asked the user to move.** Every survivor in `r25-w5` — Zed, Raycast, Linear, Obsidian, Warp — either replaced a daily-frequency surface or monetised an axis on top of an existing habit. None monetised correctness.
4. Stack Overflow's own 2025 conclusion is the epitaph, verbatim: subscription AI IDEs *"weren't able to topple the dominance of Visual Studio and Visual Studio Code this year… while relying on extensions as optional, paid AI services"* (M15). **The winning pattern in this market is the incumbent plus a paid extension.** That is the exact shape §86 forbids us from being.

**Falsifier:** name a prosumer or developer tool since 2015 that beat a free, well-distributed incumbent primarily on correctness, with the incumbent's category-leading position intact at the time. I looked and could not find one. One credible example moves this to SERIOUS.

---

**SERIOUS — 5. The MVP-1 wedges promoted in DECIDE §3.2 are already occupied, and the unoccupied slice has 66 users.**

DECIDE §3.2 responds to the byte-exactness refutation by promoting three replacements. Measured against the registry, where the users actually are:

| DECIDE §3.2 wedge | Measured occupancy | Verdict |
|---|---|---|
| Vault-wide refactor — **rename a tag** | Tag Wrangler, **1,067,863 downloads**, free (M9) | occupied |
| Vault-wide refactor — **search & replace** | Global Search and Replace, **65,569**, free (M9) | occupied |
| Vault-wide refactor — **rename a property key** | **Schema Refactor, 66 downloads** (M8) | *unoccupied and unwanted* |
| Nested-construct live preview (501 likes) | Obsidian shipped **51 live-preview fixes in 24 months**, three in the last five weeks (M13) | actively contested by the incumbent, on their surface |
| Sync, reframed | the one with real demand — and out of scope (finding 8) | see below |

The 1,461 likes on tag-rename and vault-wide replace are real. They are also **already served by a free plugin with a million installs**, which is why the likes stopped converting into anything. The slice that is genuinely ours — frontmatter-key rename, done provably — has a measured audience of 66 people.

And the live-preview wedge asks you to ship an entire editor in order to win a rendering bug **in someone else's application**, on a surface they patch monthly. That is not a wedge; it is a bug report with a business plan attached.

**Falsifier:** if Schema Refactor crosses 5,000 downloads by 2027-02, or if a "property rename" request crosses 200 likes on forum.obsidian.md, the demand exists and I am wrong.

---

**SERIOUS — 6. The revealed willingness-to-pay for exactly this product is 2.5–4.8× your price, and it is charged by a plugin.**

Findings 3 and 4 established that price is the #1 complaint and that ₹299 sits below Obsidian Sync. The new number sharpens it in the opposite direction from what the record assumes: **Brevilabs charges $7.99–$14.99/month and $349.99 lifetime for AI-in-your-vault, on top of a free app, with 1.78M plugin downloads** (M5). Against ₹599 = $6.28 (§88.1, FX 95.39 on 2026-08-28).

So the market does pay for this. It pays **more than you are asking**, to a plugin, on top of a free editor, with no editor to maintain. Pricing below the plugin that runs inside your competitor is not a bargain; it is a statement that you believe you are worth less than an add-on. Cross-reference `r25-w5` R1: at $3.13–$6.28 ARPA, the top quartile NRR ceiling is **70%** — best-in-class 110% retention is arithmetically unreachable before a line of code is written.

**Falsifier:** if Brevilabs' paid conversion is under 0.5% of 1.78M downloads, the WTP signal is weak and this is MINOR. I could not measure their paid base; that is `[SS]` and should be treated as such.

---

**SERIOUS — 7. The early-warning signal that does not need a customer got worse while this research round ran.**

§88.11 EW-2 fires at doc:src >3:1 or density <20%. Measured 2026-08-30 in the record: **22.3:1** and 17.9%. Measured by me today, one day later:

| Metric | 2026-08-30 (record) | **2026-08-31 (measured here)** |
|---|---|---|
| `docs/` : `src/` file-changes, 28d | 22.3 : 1 | **29.2 : 1** (292 vs 10) |
| Active commit-days in 28 | 17.9% | **17.9%** (5 of 28) |
| Words of docs per line of source | 87 | **92.2** (2,343,005 / 25,407) |
| CI | absent | **absent** — no `.github/workflows` |

§88.12's second pre-mortem is titled *"The document became the product."* It was written on 2026-08-30 and the ratio it warns about worsened by 31% in the twenty-four hours after it was written, **by the act of writing about it**. That is not irony; it is the measurement doing its job and being ignored in real time. Finding 11 (87 words per line) is now 92.2.

**Falsifier:** none needed — this is a live counter. Re-run the two commands in §88.11 weekly. If the ratio is under 3:1 across two consecutive 14-day windows by 2026-10-15, the concern is retired.

---

**MINOR — 8. A dating correction to §88.1, offered so it is not quoted wrong again.**

§88.1 dates Obsidian's conflict-resolution setting from a help-doc commit of 2025-11-28 and derives "roughly nine months" of maintenance from it. The changelog shows it shipped in **1.9.10, early access 2025-08-05, public 2025-08-18** (M12). The feature is **12.5 months old**, and §88.2's "prior work already done — the hard half" is 40% more done than stated. This is finding 9's pattern (62% of load-bearing claims need correction) reproducing on the war-game itself; the correction makes Scenario A slightly worse for us, not better.

---

**WHAT IS GENUINELY GOOD, specifically.**

1. **§88 is the best document in the corpus and the pre-mortem is better than most funded companies produce.** §88.7's line — *"Four thousand views over nineteen months is a real problem that did not produce a market"* — is the correct reading of your own strongest evidence, against interest. §88.13's "irrelevant if false" is exactly the right terminal question.
2. **The engine is real and the corpus is the one asset nobody can copy by claiming.** 8,513 pinned files, 1,575 tests, byte-identical verification. §88.6 is right that a funded team can *say* byte-exact on day one and cannot *show* it. Executed measurement is a durable asset even when the product is not.
3. **`r24-v2` and `r25-w2` are the two best research artefacts here** because both open by refuting the thing that commissioned them. The 4-in-12,556 measurement and the Zed sentence are the two facts that should have been bought first and were bought anyway.
4. **frontmatter is sgnk-md** (202 of 228 files byte-identical). This is not a greenfield bet with a sunk-cost problem; it is a rename. The cost of abandoning the *pitch* is close to zero, which is the single most valuable structural fact in the whole file.
5. **§88.13's survivable-if-true is correct and I would build only that.** The engine sold as a CLI and library, priced, in month two.

---

**THE WEDGE, JUDGED AGAINST THE INCUMBENTS RATHER THAN IN ISOLATION.**

| Candidate wedge | Demand, measured | Nearest incumbent | Survives? |
|---|---|---|---|
| Per-hunk review of agent edits | Drift: **8 stars** (M6) | Zed, free; Claudian, free | **No** |
| Byte-exactness as a promise | 4 / 12,556 (finding 2) | Kano Must-be | **No** |
| Vault-wide property refactor | 66 downloads (M8) | Tag Wrangler, 1.07M | **No** |
| Nested-construct live preview | 501 likes, real | Obsidian, patching monthly (M13) | **No — wrong battlefield** |
| **The merge that does not lie** — provably safe conflict resolution over sync you already have | #1 loved, #3 hated, **#1 switching trigger**, 1,251/43,656 issues (finding 8); Obsidian's own doc admits auto-merge duplicates text (§88.1); a *paid* category at $4/mo | Obsidian Sync, Remotely Save (2.19M dl) | **Yes — and the record declared it out of scope** |
| **The certificate / engine as a paid CLI + MCP tool the agents call** | unmeasured, but it converts every competitor into a channel (`r25-w2` Q4, §88.13) | none | **Yes — and it is priced like a plugin** |

**The genuine wedge, if one exists, is the second-to-last row, and it is the one thing you have refused.** Sync is the only axis in the entire evidence base where demand is #1, the incumbent's own documentation concedes the defect, there is a proven paid category, and your engine is the literal mechanism of the fix. The record's refusal of CRDTs was correct and is not the same decision as refusing sync — you refused the *transport* and then, in the same move, gave away the *merge*, which was the only part you were uniquely qualified to own.

The second wedge is real but honest about its ceiling: `r25-w2` already named it — *"be the thing their agent writes into"* — and named the price of it: **a plugin-shaped business, priced like a plugin.** Given M4 and M5, plugin-shaped is not an insult. It is the only business in this category anyone has been measured getting paid for.

---

**THE ONE FALSIFIABLE KILL CONDITION.** Not "keep building and see":

> **By 2026-10-15 — six weeks, not 242 days — twenty competent markdown users are asked one unprompted question ("can you name the last time a tool ate your work?") and ten strangers are shown a priced page with a real checkout. If fewer than 4 of 20 name an unprompted incident, and there are 0 paid checkouts, stop building the editor and ship the engine as a priced CLI.**

Everything in §88.11 already says this. §88.7 says the test costs days. EW-1's threshold is *0 strangers asked by day 45*. Today is day 0 of that clock and the counter reads zero.

**The sentence I would say on the call:** you have spent 2,343,005 words proving that you are right, in a market where a volunteer proved in 269 days that being right is not the thing being bought — and the most expensive fact in this critique is that he built it inside the competitor you decided not to build inside.
