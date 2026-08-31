LR#48 verified — nothing under `~/.claude` modified within 3h, HEAD `6e390828` (2026-08-27), all writes in `$TMPDIR/cat`.

---

**Zed's documentation already describes our MVP-0 demo, verbatim, as a shipped feature: "You can accept or reject each individual change hunk, or the whole set of changes made by the agent."** ([fetched] https://zed.dev/docs/ai/agent-panel, 2026-08-31) — in a free-tier editor, on files we do not own, in a category we have never studied.

---

**WHAT REFUTES THE PRODUCT, FIRST**

| Claim in our record | Refuting evidence | Tag |
|---|---|---|
| Per-hunk reviewable diff is our novel MVP-0 demo | Zed ships it and documents it in one sentence. Free tier. | [fetched] |
| We refuse rather than guess; that is our discipline | Claude Code already refuses. 71 issues contain "String to replace not found", 102 contain "File has been unexpectedly modified", 150 match `"not unique" edit` — 323 issue-threads about refusal messages across 7 repos | [measured] |
| Refusal is a feature users will pay for | Every one of those 323 is a **complaint about being refused**, not a request for it | [inference] |
| Byte-exactness is unaddressed | 396 CRLF-related issues/PRs across the same 7 repos; 103 name a line-ending term in the title; the incumbents are actively shipping fixes (7 merged PRs found) | [measured] |
| Markdown is our uncontested ground | Markdown *is* their config substrate (`CLAUDE.md`, `AGENTS.md`, `SKILL.md`, `prompts.md`). Continue merged PR #12588, "normalize CRLF line endings **before frontmatter split**", 2026-06-10 | [fetched] |

---

**THE CATEGORY: PRICE AND FILE BEHAVIOUR**

All prices [fetched] 2026-08-31 unless tagged.

| Tool | Free tier | Paid (USD/mo) | Writes files as | Refuses ambiguity? |
|---|---|---|---|---|
| **Cursor** | Hobby $0 | Pro **$20**, Pro+ $60, Ultra $200, Teams $40/seat | Apply-model rewrite + inline diff overlay | Not documented |
| **Windsurf** | — | **UNREACHABLE** — see source log | — | — |
| **Zed** | $0, "Free forever" | Pro **$10** ($5 tokens included), Business $30/seat | Agent edits → multi-buffer review, **per-hunk keep/reject** | Not documented |
| **GitHub Copilot** | Free $0 | Pro **$10**, Pro+ $39, Max $100; Business $19/user, Enterprise $39/user | Copilot Edits; doc says only "Review diffs" | Not documented |
| **Claude Code** | — | Pro **$20**, Max $100 / $200; Team ~$20–25/seat | `Edit` = exact string replace; `Write` = whole file | **Yes** — hard-refuses on no-match and on non-unique match |
| **Codex CLI** | — | inside ChatGPT plans [SS] exact SKU | `apply_patch` (V4A patch format) | Yes — patch context must match |
| **Aider** | free OSS | BYO keys, inference at cost | Two formats, documented: **`whole`** = "return a full, updated copy of each source file"; **`diff`** = SEARCH/REPLACE blocks | Yes, in diff mode |
| **Cline** | free OSS | usage-based inference, no seat fee | `apply_patch` + `write_to_file`, VS Code diff view | Partial |
| **Continue** | continue.dev/pricing → **404** [SS] | — | — | — |
| **JetBrains AI** | AI Free | AI Pro **$10** personal / $20 commercial; AI Ultimate $30 / $60 | IDE-native diff | Not documented |

Aider's `whole` format is the only place a vendor documents full-file rewrite as a *design choice* rather than a bug: "The LLM is instructed to return a full, updated copy of each source file that needs changes" ([fetched] aider.chat/docs/more/edit-formats.html).

---

**Q1 — DOES ANYONE ALREADY DO PER-HUNK REVIEW? YES. PRECISELY:**

| Tool | Per-hunk accept | Evidence |
|---|---|---|
| **Zed** | **Yes, twice over** | "accept or reject each individual change hunk"; and inline: "the same keep/reject hunk controls as the multi-buffer review pane" [fetched] |
| **Cursor** | **Partial — and worse than Zed** | Its published keybinding reference lists exactly **2** accept/reject bindings: "Accept all changes", "Reject all changes". **0 are hunk-scoped.** [measured, cursor.com/docs/configuration/kbd] |
| Cursor, user-reported | Chunk-level exists in inline edit | HN 2025-05-08: *"I can reject suggestions easily, or accept partial diffs. I can approve certain chunks but instruct it to rethink other parts"* |
| Cursor, agent mode | File-level, and it hurts | HN 2026-03-13: *"way too tedious having to Accept every change… clicking 'Accept file' 20x"* |
| Copilot / Cline / Continue | Diff view; hunk granularity not documented on the pages opened | [SS] |

Ecosystem demand for the feature is measurable and modest: `hunk accept` = 126 issues, `"accept hunk"` = 51, `"partial accept"` = 62 across the 7 repos [measured].

**The verdict is blunt.** Per-hunk diff review is not novel; it is a 2022-era `git add -p` idea that Zed shipped and documents in one line. What is *not* solved is the second half of the Cursor complaint — hunk review does not scale past a few files, so users abandon it and click "Accept file". A demo that shows per-hunk review will read to this audience as **a feature they already have and already stopped using.**

---

**Q2 — WHAT THEY DO TO A CRLF MARKDOWN FILE WITH FRONTMATTER**

396 issues/PRs mention CRLF across the seven repos [measured].

| Repo | CRLF issues | Total issues | Rate | |
|---|---:|---:|---:|---|
| cline/cline | 76 | 4,465 | **1.70%** | worst |
| continuedev/continue | 21 | 6,677 | 0.31% | |
| openai/codex | 70 | 25,090 | 0.28% | |
| zed-industries/zed | 64 | 22,698 | 0.28% | |
| anthropics/claude-code | 155 | 88,118 | 0.18% | largest absolute |
| Aider-AI/aider | 5 | 4,387 | 0.11% | |
| microsoft/vscode-copilot-release | 5 | 13,716 | 0.04% | best |
| **Total** | **396** | **165,151** | **0.24%** | [derived] |

By filing year: 2022 = 4, 2024 = 15, 2025 = 77, **2026 = 300** [measured]. 75.8% of all CRLF reports in this ecosystem were filed in the last eight months [derived: 300/396].

**The public admission you were told about is Cline's, and it is worse than "carriage returns".** PR #8341, merged 2026-01-03: *"Previously, tool handlers were aggressively trimming trailing newlines while the `DiffViewProvider` attempted to manually add them back. This conflict triggered a truncation bug in the diff editor where line counts were calculated from the trimmed content, causing the editor to immediately delete any newlines it just wrote."* [fetched]

It did not hold. Cline shipped **three more** line-ending fixes after that: #12305 (2026-07-15, "preserve file line endings in the editor tool executor"), #13512 (2026-08-24, "preserve a file's own CRLF line endings across apply_patch updates"), #13521 (2026-08-24, "create new files with the platform-native line ending"). Eight months, four PRs, still open issue #13504.

The most damaging titles, all [fetched]:

| Date | Repo | Title |
|---|---|---|
| 2026-05-27 | claude-code | **"Built-in Edit tool silently converts line endings (CRLF → LF) in unrelated lines"** (#62713) |
| 2026-05-27 | claude-code | "VS Code extension truncates HTML files on save (LF→CRLF rewrite chops trailing scripts)" (#62926) |
| 2026-08-24 | claude-code | **"System directive causes CRLF line endings in markdown files on Windows despite project LF convention"** (#89307) |
| 2026-06-10 | continue | **"fix(prompts): normalize CRLF line endings before frontmatter split"** (PR #12588) |
| 2026-01-23 | claude-code | "Investigate markdown delimiter hiding on CRLF" (#20208) |
| 2026-01-18 | codex | "Diff view shows a lot of line ending changes" (#9455) |
| 2026-06-29 | zed | "Staging hunks in CSVs change line endings" (#60063) |

So: **it is widespread, it is getting worse, and it is being fixed.** That last clause is the problem. Every one of these is a closed issue or a merged PR. We would be entering a market where the incumbents have already been embarrassed into caring, with four full-time-engineering-quarters of head start on the exact defect class we planned to sell against.

---

**Q3 — ADJACENT, SUBORDINATE, OR INVISIBLE?**

**Subordinate, and the evidence is unambiguous.** Markdown in this ecosystem is not a document format, it is a *configuration* format, and the tools own the parser:

- `claude-code` #80890 (2026-07-24): "Agent .md silently skipped when file has CRLF line endings AND unquoted description contains ': '"
- `claude-code` #16995: "session-start.sh has CRLF line endings, fails on macOS/Linux"
- `continue` #11876: "Continue fails to parse prompts.md file when EOL sequence is CRLF"
- `claude-code` #60580: "Scheduled tasks silently gray out 'Run now' when SKILL.md uses CRLF line endings"

`frontmatter` appears in **2,122** issues across these 7 repos [measured] — more than five times the CRLF count. Frontmatter is *their* surface. When their frontmatter parser breaks, the bug is filed against them and fixed by them, and a third-party editor that opens the same file is not in the loop.

There is no adjacency argument available. A markdown-first tool sitting beside a code-first tool does not get a second seat at the same budget line; it gets compared against the free markdown preview the code-first tool already has.

---

**Q4 — COMPETE, INTEGRATE, OR BE THE THING THEIR AGENT WRITES INTO?**

Mindshare, HN comments since 2025-01-01 [measured, Algolia]:

| Query | Comments | Note |
|---|---:|---|
| `claude code` | 41,222 | |
| `cline` | 45,399 | **inflated** — matches "decline", "incline" |
| `aider` | 20,581 | likely inflated |
| `cursor` | 16,735 | **inflated** — matches "cursor position" |
| `codex cli` | 15,890 | |
| `github copilot` | 3,439 | |
| `windsurf` | 1,972 | clean token |
| `zed editor` | 982 | clean token |
| `jetbrains ai` | 553 | |
| `continue.dev` | 126 | |

Even taking the two clean tokens only, Windsurf out-mentions Zed 2:1 and both are dwarfed by the CLI agents. Competing on attention is not available to a two-person team with no users.

Distribution the incumbents already hold, from Cline's own embedded page data [fetched, cline.bot/pricing]: `vscodeDownloads: 5,154,024`, `githubStars: 67,192`, marketing copy "Trusted by 8M+ developers worldwide". Cline gives all of that away free and monetises only inference.

**The only defensible play in this list is the third one: be the thing their agent writes into.** Compete is refuted by mindshare. Integrate-as-extension puts us inside a marketplace where the host ships the same feature free. But "the agent writes markdown, we own the review-and-repair of that markdown" is the one position where their distribution is our distribution. It also has a hard ceiling: it makes us a plugin, priced like a plugin.

---

**Q5 — PRICING ANCHORS, AND WHAT THAT MEANS**

| Anchor | Monthly | What it buys |
|---|---:|---|
| Zed Pro | $10 | full editor + per-hunk agent review + $5 inference |
| Copilot Pro | $10 | full agent, IDE-integrated |
| JetBrains AI Pro (personal) | $10 | IDE AI across all JetBrains IDEs |
| **JetBrains AI Pro, priced to India** | **$11.80** incl. 18% GST | JetBrains served `countryCode: "IN"` and quoted this [fetched] |
| Cursor Pro | $20 | the category's reference price |
| Claude Code Pro | $20 | the terminal agent itself |
| Cursor Ultra / Claude Max | $200 | the ceiling this audience pays |
| **Our Rs 599** | ≈ **$6.8** | at ₹88/USD [inference; rate unverified] |
| **Our Rs 299** | ≈ **$3.4** | markdown editing, no inference |

**State it plainly.** This audience is trained to pay $10–$20/month, and a meaningful slice pays $200. Our top tier is roughly **half the cheapest anchor** and **one-third of Cursor**. Price is therefore not our obstacle and never was — and pricing *below* the anchor in a category defined by developer-tool machismo signals "accessory", not "bargain". The JetBrains India datapoint is the sharpest of the set: a global vendor is already selling AI tooling into our home market at $11.80 with GST included, so the "India price" argument is not a moat either.

The arithmetic consequence is unchanged from the record: at ₹599 we are collecting under $7 for a tool with no inference cost to hide behind, against incumbents whose free tier includes the demo feature. Volume must do all the work, and the record already computed that ₹20L/mo requires 1.26M visitors.

---

**SOURCE REACHABILITY LOG** (per instruction — no silent fallbacks)

| Source | Result |
|---|---|
| cursor.com/pricing, /docs/agent/review, /docs/configuration/kbd, /docs/tab/overview | 200 |
| cursor.com/docs/agent/apply, /docs/agent/chat/agent | **404** |
| forum.cursor.com/search.json | 200, usable |
| zed.dev/pricing, zed.dev/docs/ai/agent-panel | 200 |
| github.com/features/copilot/plans | 200 |
| jetbrains.com/ai-ides/buy | 200, full price JSON incl. India GST |
| cline.bot/pricing, aider.chat/docs | 200 |
| **windsurf.com/pricing** | **429 × 3 user-agents** (Vercel bot challenge) |
| **codeium.com/pricing** | **429** |
| **docs.windsurf.com/windsurf/accounts/plans**, **/desktop/accounts/plans** | **404 × 2** |
| **continue.dev/pricing** | **404** |
| GitHub search API, unauthenticated | 200; **rate-limited at 10/min** — paced with sleeps. `gh` CLI failed TLS through the proxy (`x509: OSStatus -26276`) |
| hn.algolia.com API | 200 throughout |
| **Reddit — 7 variants, 0 usable** | `www.reddit.com/r/cursor/top.json` → **403**; `old.reddit.com/*/search.json` (browser UA) → **403 "Blocked"**; `old.reddit.com/*/.rss` → **403**; `www.reddit.com/*/search.rss` → **403**; `api.reddit.com/*` → **403**; Googlebot UA → **403**; `old.reddit.com/search.json` with `python-requests` UA → **HTTP 200 but body is an HTML "Welcome to Reddit" interstitial, not JSON** — a false-positive 200 |

Windsurf's pricing, Continue's pricing, and all Reddit sentiment are **[SS]** — not verified, not substituted from memory.

---

**THE ONE-LINE POSITION THIS FORCES**

Our MVP-0 demo is a shipped feature of a free editor; our refusal discipline is a shipped behaviour of the $20 agent our users already run, and it generates 323 complaint threads rather than praise; the byte-corruption we were going to sell against is real, growing (+290% year over year), and *already being fixed by the people who caused it*. What survives contact with this evidence is narrow: not "the editor that refuses", but possibly "the review surface for the markdown their agent writes" — a plugin-shaped business, priced like a plugin, in a market that pays $20 for the thing the plugin attaches to.
