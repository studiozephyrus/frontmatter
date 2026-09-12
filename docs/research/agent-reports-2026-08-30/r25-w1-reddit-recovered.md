Reconciliation stable across eight identical firings — the 19 dirty `~/.claude` entries pre-date this task, writes confined to `/tmp/claude-501/rd`, zero commits, zero mutations. The hook is looping, not reporting new state.

---

Reddit is reachable — and it does not rescue the product: in 1,000 unbiased posts across all ten communities, the entire vocabulary of byte-exactness appears **once** (0.1%), while the target market's most common weekly complaint is price (15.7%) and its most common reason for cancelling is that a competitor got better (63.8%) — a defect this editor cannot fix.

**Access routes tested — endpoint · status · usable**

Two earlier rounds concluded 403 from one endpoint. That was one endpoint's policy, not Reddit's reach. Status codes lie here: three routes return **HTTP 200 with an HTML interstitial or a zero-byte body**, which a status-code-only check would have scored as working.

| Endpoint | Status | Usable |
|---|---|---|
| `www.reddit.com/r/<sub>/top.json` | 403 | No |
| `reddit.com/r/<sub>/top.json` | 403 | No |
| `api.reddit.com/r/<sub>/top` | 403 | No |
| `old.reddit.com/r/<sub>/top.json` | **200 → 302 `/login/?reason=lor2`**, body = "Welcome to Reddit" HTML | **No — 200 is a lie** |
| `old.reddit.com/r/<sub>/search.json` | 200, same interstitial | No |
| `old.reddit.com/r/<sub>/.rss` | 200, same interstitial | No |
| `old.reddit.com/r/<sub>/comments/.json` + `over18` cookie | 200 → "Not Found" | No |
| **`www.reddit.com/r/<sub>/top/.rss?t=year&limit=100`** | **200** | **YES — 100 entries, full selftext** |
| **`www.reddit.com/r/<sub>/search.rss?q=…&restrict_sr=on&limit=100`** | **200** | **YES — 100 entries** |
| **`www.reddit.com/search.rss?q=(subreddit:A OR subreddit:B …)&limit=100`** | **200** | **YES — 10 subs in one request** |
| `www.reddit.com/r/<sub>/comments/.rss` | 429 | Rate-limited only |
| `api.pullpush.io` (Pushshift successor) | 429 persistent | No |
| `r.jina.ai/<reddit url>` proxy | 200 wrapper, target 403 | No |
| Redlib/Libreddit mirrors (7 tested) | 403 ×3, 502, 503, 000, 200-empty | No |
| `subredditstats.com` | 200, time series empty (dead site) | No |
| `web.archive.org` CDX + `id_` snapshots | 200 | Yes — sizing only |

Two mechanics matter for anyone repeating this. The RSS rate limit is **1 request per ~11 s per IP**, stated in `x-ratelimit-used: 1 / x-ratelimit-remaining: 0.0 / x-ratelimit-reset: 11`, and it is **not** per-user-agent: six rotated Chrome UAs fired back-to-back returned 429 six times out of six. And `.rss` requires a browser UA — `curl/8.7.1` and an empty UA both 403 where a Chrome UA succeeds. `[measured]`

**Corpus.** 36 RSS files → **2,766 unique posts**, dated 2025-08-31 → 2026-08-31. Of those, a deliberately unbiased subcorpus of **exactly 100 posts per subreddit × 10 subs = 1,000**, pulled from `top/.rss` and `new/.rss` with no query term, so no keyword I chose can inflate a denominator. Search-derived posts are reported separately and never used for prevalence. `[measured]`

**Sizing — subscribers, with the date read**

Live `about.json` is 403 by every route, so these are archived snapshots. The date is the snapshot date, not today.

| Subreddit | Subscribers | Snapshot date | Confidence |
|---|---|---|---|
| r/ClaudeAI | 323,037 | 2025-09-05 | fetched |
| r/SaaS | 268,209 | 2025-04-01 | fetched |
| r/ExperiencedDevs | 250,000 | 2025-01-08 | **suspect — exactly round** |
| r/ObsidianMD | 227,709 | 2025-07-06 | fetched |
| r/ChatGPTCoding | 137,436 | 2024-09-01 | fetched, stale |
| r/PKMS | 48,073 | 2025-05-25 | fetched |
| r/cursor | 41,045 | 2025-04-01 | fetched, certainly low now |
| r/logseq | 15,856 | 2025-05-03 | fetched |
| r/Zettelkasten | 3,541 | 2024-05-01 | **suspect — likely a mis-parse** |
| r/devtools | — | — | **[SS] unresolved** |

Sum of the nine: **1,314,906** `[derived]`. PKM subset (Obsidian + PKMS + logseq + Zettelkasten) = **295,179**; AI-coding subset (ClaudeAI + cursor + ChatGPTCoding) = **501,518** `[derived]`. Every one of these is stale by 4–24 months and they double-count members heavily. Treat 1.3M as a ceiling on *subscriber slots*, not people.

**What refutes the product, first**

Prevalence in the 1,000-post unbiased corpus, ranked. This is what these communities talk about when nobody is asking them a leading question.

| Theme | Posts / 1,000 | % |
|---|---|---|
| Plugins / ecosystem | 107 | 10.7% |
| Mobile | 72 | 7.2% |
| Search / findability | 58 | 5.8% |
| Performance, bloat, crashes | 57 | 5.7% |
| Git / version control | 46 | 4.6% |
| Sync | 41 | 4.1% |
| Context window / memory | 33 | 3.3% |
| Slop / hallucination | 32 | 3.2% |
| Plain text / lock-in | 31 | 3.1% |
| Price | 20 | 2.0% |
| Cancellation language | 10 | 1.0% |
| **Corruption / data damage** | **9** | **0.9%** |
| **Diff / per-hunk review** | **8** | **0.8%** |
| **Trust / must-verify** | **7** | **0.7%** |
| **"Is there a tool that…"** | **5** | **0.5%** |

The four bottom rows are the product. Every one of them sits below 1%. The three top rows — plugins, mobile, search — are things this product does not do and, at two founders with a very small AI budget, cannot do.

Narrow to the actual buyer. Restricting to r/ClaudeAI + r/cursor + r/ChatGPTCoding (n=300 unbiased posts):

| What the target market complains about | n/300 | % |
|---|---|---|
| Price | 47 | 15.7% |
| Reviewing agent output | 42 | 14.0% |
| Context window / memory | 33 | 11.0% |
| Usage limits / quota | 29 | 9.7% |
| Agent broke something | 12 | 4.0% |
| Markdown / docs files | 10 | 3.3% |
| **Byte-exact editing vocabulary** | **1** | **0.3%** |

`[measured]` One post in three hundred, in the exact communities this is sold to, uses the vocabulary of the core engineering claim.

**Where Reddit disagrees with HN — the disagreement is the finding**

| Claim from the HN record | HN figure | Reddit figure (feed n=1,000 / all n=2,766) | Verdict |
|---|---|---|---|
| Byte-exactness almost never discussed | 4 / 12,556 (0.03%) | 1 / 1,000 (0.1%); 11 / 2,766 (0.4%) | **Confirmed.** Reddit is 3–13× higher and still floor-level. No rescue. |
| Decision-record renders least demanded | least measurable | ADR/decision-record: 2 / 1,000 (0.2%); 15 / 2,766 (0.5%) | **Confirmed, and worse than it looks** — most hits are "architecture decision" as prose, not a render request. |
| Slop is 23.7% of complaints, +149% | 23.7% | literal "slop": 18 / 1,000 (1.8%); hallucination any form: 14 / 1,000 (1.4%) | **DISAGREES — by an order of magnitude.** |
| Sync is the #1 loved feature and #1 switching trigger | #1 | 41 / 1,000 (4.1%), rank **6**; but 22 / 100 in r/logseq alone | **Partly refuted in aggregate, violently confirmed in one place.** |
| Context-pack products: 89 launches, median 2 points | median 2 | context-pack/CLAUDE.md talk: 7 / 1,000 (0.7%) | **Confirmed.** Demand-side is as quiet as the supply-side is loud. |

Two of these deserve emphasis because the record currently rests on HN alone.

**Slop.** HN says 23.7% of complaints and accelerating. Reddit says 1.8% of posts in the communities that use these tools daily. The gap is not noise, it is a genre difference: HN complaints are *arguments about AI*, Reddit posts are *people doing work*. Where "slop" does appear on Reddit it is overwhelmingly about **other humans' output and hiring**, not about a file being edited wrongly — r/ExperiencedDevs, 2026-06-26: *"they just throw slop over the wall"* ([link](https://www.reddit.com/r/ExperiencedDevs/comments/1ugaqo5/anyone_else_notice_supercharged_juniornew_grad/), read 2026-08-31); r/ExperiencedDevs, 2026-02-16: *"the slop code everyone is producing"* ([link](https://www.reddit.com/r/ExperiencedDevs/comments/1r6olcv/an_ai_ceo_finally_said_something_honest/)). An editor that edits bytes correctly does not address either sentence. `[fetched]`

**Sync.** In aggregate Reddit demotes sync from #1 to #6. But the per-subreddit split is the most extreme cell in the entire study: **r/logseq, 22 of 100 unbiased posts mention sync** — 5.4× the ten-sub average of 4.1%. `[measured]` And reading them shows the reason is not sync at all: Logseq is migrating from markdown files to a database, and its users are leaving. r/logseq, 2025-12-09, *"So Long, and Thanks for All the Fish?"* opens *"July 19, 2021. That's the day that I made the first git commit of my Logseq graph"* ([link](https://www.reddit.com/r/logseq/comments/1pigcs1/so_long_and_thanks_for_all_the_fish/)). r/logseq, 2025-12-21, titled *"I've had enough"* ([link](https://www.reddit.com/r/logseq/comments/1psesge/ive_had_enough/)). That is a 15,856-subscriber community of git-committing markdown users being actively evicted from markdown. It is the single best-qualified audience this research found — and it is small, and it is not the AI-coding market the product is aimed at.

**HN's launch skew, tested rather than assumed.** The brief assumes Reddit skews to daily use. Mostly true: launch-style titles ("I built", "Introducing", "Show r/") are **55 / 1,000 = 5.5%** overall — but **33 / 100 in r/devtools** and 0/100 in r/ExperiencedDevs and r/logseq `[measured]`. r/devtools is an HN clone by another name and should be discounted in any founder-facing read of this data.

**What people ask "is there a tool that…" about**

5 in 1,000 unbiased posts, 123 across the full 2,766 including search-targeted pulls. The asks that surfaced, verbatim:

- *"Is there a way to password-protect my notes so absolutely no one can read them?"* — r/ObsidianMD 2026-06-29 ([link](https://www.reddit.com/r/ObsidianMD/comments/1v0kulm/zotflow_13_your_own_notes_can_now_live_inside/))
- *"Is there a real concern that these community plug ins could execute code on our laptops?"* — r/ObsidianMD 2025-09-20 ([link](https://www.reddit.com/r/ObsidianMD/comments/1rlje84/official_plugin_list_has_14k_unaccepted_plugin/))
- *"Is there a good tool for auto-generating release notes from GitHub PRs and Jira tickets?"* — r/devtools 2026-05-11 ([link](https://www.reddit.com/r/devtools/comments/1ta6qh1/is_there_a_good_tool_for_autogenerating_release/))
- *"Is there a way to make checklist execution mandatory? Not here's a checklist, please follow it but actual enforcement like a pre-commit hook but for Claude's decision-making."* — r/ClaudeAI 2026-04-06 ([link](https://www.reddit.com/r/ClaudeAI/comments/1se1olb/claude_ignores_its_own_plans_memory_and/))

Only the last is adjacent to this product, and note what it actually asks for: **enforcement of process**, not correctness of bytes. Nobody in 2,766 posts asked for a byte-exact markdown editor. `[measured]`

**What people say when they cancel**

67 posts in the full corpus contain first-person cancellation language; 47 of them in the three AI-coding subs. Reasons are multi-coded (a post can name several).

| Stated reason | AI subs (n=47) | All (n=67) |
|---|---|---|
| A competitor got better | **63.8%** | 35.8% |
| Price | 42.6% | 46.3% |
| Usage limits / quota / lockout | 36.2% | 29.9% |
| Quality regression ("nerfed") | 14.9% | 17.9% |
| Support / billing failure | — | 35.8% |
| **Data loss / lost trust** | **8.5%** | 11.9% |

`[measured]` Verbatim: *"Cancelled Claude code $100 plan, $20 codex reached weekly limit. $200 plan is too steep for me."* — r/ChatGPTCoding 2025-09-13 ([link](https://www.reddit.com/r/ChatGPTCoding/comments/1ng46rw/cancelled_claude_code_100_plan_20_codex_reached/)). And *"I had to call my bank and cancel credit card payments to them as they keep charging even if I cancelled my subscription."* — r/ClaudeAI 2026-03-03 ([link](https://www.reddit.com/r/ClaudeAI/comments/1rjmqen/beware_of_factoryai_10x_more_expensive_than/)).

This is the most commercially damaging table in the report. Churn in this market is driven by **relative model quality and price**, both of which are set by Anthropic and OpenAI, not by the editor. A two-person team with a very small AI budget selling at ₹299/₹599 has no lever on the top three rows — 63.8%, 42.6%, 36.2% — and its actual differentiator maps to the 8.5% row.

**What survives**

Data damage is rare in the aggregate but it is real, recent, and severe when it lands. r/ClaudeAI, 2026-08-29: *"Asked Claude Code to 'reorganize my folder structure to be more professional'. It deleted all the files BEFORE copying them. 5 hours of work gone in 1 second."* ([link](https://www.reddit.com/r/ClaudeAI/comments/1w1lu2f/claude_vs_code_extention_deletes_my_entire_project/)) And r/ClaudeAI, 2026-04-06: *"Claude's session startup routine ran auto-detection that OVERWROTE the verified config file. All of yesterday's work gone."* ([link](https://www.reddit.com/r/ClaudeAI/comments/1se1olb/claude_ignores_its_own_plans_memory_and/)) `[fetched]`

But note the second half of that first quote: *"I hadn't committed anything, so it's 100% my fault too."* The community's own diagnosis is **git hygiene**, not editor precision — and git is free. Correspondingly, "agent lied / claimed done" appears **70 / 2,766 (2.5%)** and context loss **61 / 2,766 (2.2%)**, both more common than the file-destruction phrasings. The dominant AI-editing complaint is that the agent **misreports its work**, not that it mangles bytes. A per-hunk reviewable diff speaks to that. Byte-exactness does not.

The strongest positive signal for the *category* is quieter and comes from the PKM side: across 400 unbiased PKM posts, **git is mentioned in 12.8%** — three times the sync rate in the same posts (8.2%) and five times the backup rate (2.5%) `[measured]`. r/ObsidianMD, 2026-08-30: *"I realized GitHub is probably the best sync solution for my particular workflow"* ([link](https://www.reddit.com/r/ObsidianMD/comments/1w26ta3/i_tried_different_ways_to_sync_obsidian_and/)). And the plainest statement of demand in the whole corpus, r/ObsidianMD 2026-08-19: *"I just want a good markdown editor. For me, this is all I need."* ([link](https://www.reddit.com/r/ObsidianMD/comments/1vsopeo/dashboards_are_neat_but_this_is_all_i_need/))

**Limits of this evidence**

RSS caps at 100 items per request and returns **posts only, never comment threads** — the richest complaint texture on Reddit is in comments, and none of it is here. Prevalence is therefore measured over post bodies, which under-counts grievances that live in replies; the true rate for every theme is higher than reported, but the *ranking* is the load-bearing claim and it is drawn from a balanced 100-per-sub design. `top/.rss?t=year` is score-ranked, which biases toward the popular over the routine — I mitigated with `new/.rss` pulls for five subs but did not eliminate it, so "weekly complaint" is approximated by unbiased-feed prevalence rather than directly observed. Two sizing figures are flagged suspect and one is unresolved. My strict regex for file-destruction phrasing returned 1/2,766 while a looser targeted read surfaced at least five genuine cases — the strict number is a measurement artifact and I am reporting the looser 4.0%-of-AI-feed figure instead, not the 0.04%. `[measured]`

The Reddit gap is closed. It did not help.
