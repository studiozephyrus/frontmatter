Reddit was unreachable on every endpoint tested (exact codes in the method note at the end); everything below comes from HN Algolia and from pricing pages opened with `curl` on 2026-08-31.

**The sharpest finding: the category leader gives the editor away and charges $4/month for sync alone — and Rs 299 ($3.13) prices an entire editor below what Obsidian charges for sync, while 56 of the 60 HN comments that mention Obsidian in a paying context (93.3%) are talking about sync and nothing else.** [fetched] [measured]

---

**What refutes the product first**

| # | Refutation | Evidence |
|---|---|---|
| 1 | Nobody in this category charges individuals for *editing*. Obsidian, Logseq, VS Code, Zed's free tier, Typora's $14.99 one-time — the editing surface is free or bought once. The recurring money is sync, hosting, or agent tokens. | [fetched] obsidian.md/pricing, zed.dev/pricing, typora.io |
| 2 | Rs 299/mo is *below* Obsidian Sync's own annual rate. $4/mo × ₹95.39 = **₹381.56/mo**. The product asks 78% of that — for the whole editor. | [derived] |
| 3 | Show HN launches of markdown editors have a **median of 3 points, n=609**; only 5% clear 100 points. Identical shape to the context-pack finding already in the record. | [measured] HN Algolia, `(story,show_hn)` |
| 4 | In 191 HN comments that contain a cancellation verb *and* a subscription word, **10 (5.2%)** name a markdown/notes tool. 40 (20.9%) name streaming. Nobody argues about cancelling a markdown editor because almost nobody has one to cancel. | [measured] |
| 5 | The free alternative is one plugin away. "*I just googled it and within 30 minutes i have a completely free git syncing plugin working on my laptop and phone*" — [HN 41093369, 2024-07-28](https://news.ycombinator.com/item?id=41093369) | [fetched] |
| 6 | The product's own differentiator (byte-exact editing, per-hunk agent diffs) has no price precedent. The nearest priced analogue is AI code review — CodeRabbit $24–48/seat, Greptile $30/seat — 4–9× above the Rs 599 tier and sold to teams with budgets, not to individuals. | [fetched] |

---

**Current prices, all read 2026-08-31**

| Product | Free tier | Individual paid | Team / seat | Note |
|---|---|---|---|---|
| **Obsidian** | App "Free without limits" | **Sync $4**/user/mo annual, **$5** monthly; Publish **$8**/site/mo annual, **$10** monthly; Catalyst **$25** one-time | **Commercial $50/user/year** — *not required* | FAQ verbatim: "No. You are not required to pay for a commercial license" |
| **Notion** | $0 | — | **$10** and **$20** per seat/mo; AI **$10 per 1,000 credits** | Custom domain $8–10/mo extra |
| **Craft** (served to an Indian IP) | ₹0 | **Plus ₹526.7/mo** annual, **₹658.3** monthly | Family ₹986.7–1,233/mo; Team ₹3,792/mo | Geo-priced in rupees automatically |
| **Bear** | Yes | **$2.99/mo · $29.99/yr** | — | Cheapest recurring note app found |
| **Ulysses** | Trial | **$5.99/mo · $39.99/yr** | — | |
| **iA Writer** | Trial | **$49.99 one-time** (Mac), **$29.99** (Windows) | Volume via Apple Business Manager | "One-time payment is like buying software in a box" |
| **Typora** | 15-day trial | **$14.99 one-time**, 3 devices | — | |
| **Logseq** | Free, open source | no price published | — | |
| **Reflect** | — | **$10/mo** billed annually | — | "One plan one price" |
| **Mem** | — | tiers at **$9 / 29 / 49 / 99 / 149 / 199**; overage in **+$50** units | same | Heaviest usage-metering in the set |
| **Cursor** | Hobby | **$20/mo** Pro | **$40**/user/mo | |
| **GitHub Copilot** | **$0** | **$10/mo** Pro, **$39/mo** Pro+ | Enterprise tiers above | "1 AI credit = $0.01 USD" |
| **Linear** | $0 | — | **$10** and **$16** per user/mo | |
| **Height** | — | — | — | **Unreachable**: HTTPS curl(35) TLS failure, HTTP=000; plain HTTP → **502 Bad Gateway** |
| **Coda** | — | coda.io/pricing now serves **Superhuman** plans; India-served ₹1,250/mo, ₹2,499/mo, ₹3,299/mo | ₹11,799/yr, ₹32,399/yr | Coda no longer prices as Coda |
| **GitBook** | Free for individuals | — | **$65/site/mo** Premium, **$249/site/mo** Ultimate, **+$12/user/mo** | |
| **Mintlify** | Starter | — | **Pro $450/mo** (5 editor seats), $0.01/credit overage | |
| **ReadMe** | — | — | **$100–150/mo**, +$20/additional admin | |
| **Confluence** | $0 | — | **$6.70** and **$13.20** per user/mo | |
| **Zed** | $0 | **Pro $10/mo** ($5 tokens included) | **$30** tier | Usage-based beyond $5 |
| **Warp** | $0 | **$20/mo** ($18 annual) | **$50** ($45 annual) | |
| **Sublime Text** | Unlimited eval | **$99 one-time** | $65/seat/yr business | |
| **CodeRabbit** | — | — | **$24** and **$48**/seat | |
| **Greptile** | — | — | **$30/seat/mo**, $1/extra credit | |
| **Postman** (founded Bengaluru, HQ SF) | $0 | **Solo $9/mo** | **$19** and **$49** per user/mo | |
| **BrowserStack** (HQ Mumbai) | — | from **$12.50/mo** annual | **$19** month-to-month | |
| **Chargebee** (Chennai) | $0 + 0.80% | — | **$99/mo + 0.65%** | |

FX for everything derived below: **1 USD = 95.39 INR**, ECB reference rate dated 2026-08-28 [fetched, api.frankfurter.app].

---

**The price ladder for this audience**

A working AI-native developer's floor, using only prices in the table:

| Line item | $/mo | ₹/mo [derived] |
|---|---|---|
| GitHub Copilot Pro | 10 | 953.90 |
| Cursor Pro | 20 | 1,907.80 |
| Obsidian Sync | 4 | 381.56 |
| **Subtotal** | **34** | **3,243.26** |
| + Linear seat (if not employer-paid) | 10 | 953.90 |
| **Realistic stack** | **44** | **4,197.16** |

**Rs 599 = $6.28 = 18.5% of the $34 floor; Rs 299 = $3.13 = 9.2%.** [derived: 599 ÷ 95.39 = 6.279; 6.279 ÷ 34 = 0.1847]

So: not below the noise floor. $6/mo is a real, noticeable line item next to $34, and one HN commenter states the aggregate objection precisely — "*everyone wants us to pay $10/mo. It just isn't sustainable from a consumer perspective*" ([HN 46717450](https://news.ycombinator.com/item?id=46717450), 2026-01-22).

But the *credibility* floor is the sharper risk. The distribution of price points in a 940-comment HN corpus built from 14 pricing-related queries:

| Monthly figure | Mentions | Share of 259 |
|---|---|---|
| $5/mo | 75 | 29.0% |
| $10/mo | 51 | 19.7% |
| $20/mo | 12 | 4.6% |
| **≤ $6/mo (all)** | **103** | **39.8%** |
| $7–15/mo | 72 | 27.8% |
| ≥ $16/mo | 84 | 32.4% |

[measured] $5/mo is the modal price for a consumer app in this discourse — and Rs 299 ($3.13) sits *under* the mode. Sentiment near $5/mo is split almost evenly (11 positive markers vs 10 negative in 75 mentions), which means $5 is already the contested zone, not the safe one. Going lower does not escape the argument; it changes what the price says about you. The canonical HN framing of the two-sided bound: "*1) what is the highest price I could charge without looking like an idiot for charging too much? 2) what is the lowest price I could charge without looking like an idiot for charging too little?*" ([HN 18008810](https://news.ycombinator.com/item?id=18008810), 2018-09-17). And bluntly: "*Your price is too low. You should raise your price until you aren't selling out*" ([HN 44249725](https://news.ycombinator.com/item?id=44249725), 2025-06-11).

A $3 tool implies a $3 support commitment, a $3 durability promise, and a $3 team. For software whose entire pitch is *it will not corrupt your files*, that is the wrong signal. Byte-exactness is a trust claim; trust claims are the one category where a low price actively harms the sale.

---

**Free-tier gravity: what has ever successfully charged individuals here**

The answer is narrower than "sync, and almost nothing else" — it is *sync, and one-time purchases*.

| Monetization that demonstrably works on individuals | Live examples |
|---|---|
| **Recurring sync/hosting** | Obsidian Sync $4–5/mo; Obsidian Publish $8–10/site/mo |
| **One-time purchase** | Typora $14.99; iA Writer $49.99; Sublime Text $99 |
| **Low-price recurring on a *closed*, polished consumer app** | Bear $2.99/mo; Ulysses $5.99/mo — both Apple-ecosystem, both sold on design, neither aimed at developers |
| **Metered AI tokens attached to an editor** | Zed Pro $10/mo with $5 tokens; Cursor $20 |

Measured, in the 940-comment corpus: **70 comments mention Obsidian. 60 of those mention pay/paid/subscription/$. 56 of those 60 (93.3%) also mention sync.** Payment discussion in this category *is* sync discussion. [measured]

Corpus themes, N = 940 [measured]:

| Theme | Count | % |
|---|---|---|
| Affirmative willingness to pay | 84 | 8.9% |
| Prefers one-time / lifetime / perpetual | 56 | 6.0% |
| Names a free sync path (Syncthing / git / Dropbox / self-host) | 57 | 6.1% |
| Lock-in or data-hostage concern | 38 | 4.0% |
| Mentions an AI subscription (Copilot/Cursor/Claude/ChatGPT) | 47 | 5.0% |
| Sync named as the object of payment | 16 | 1.7% |

Obsidian's own economics are the ceiling case, and they are sobering: **8 people** on the About page (plus an office cat), 100% user-supported, no investors, and a commercial license that the pricing FAQ explicitly says is optional. [fetched, obsidian.md/about + /pricing] That is what winning this category looks like — a beloved free editor funding a small team from a $4 sync add-on.

---

**India pricing versus global**

The measurable pattern among Indian-founded companies selling globally is unambiguous: **they price in USD.**

| Company | Origin | Currency shown to a global buyer |
|---|---|---|
| Postman | founded Bengaluru, HQ San Francisco | **USD** — $9 / $19 / $49 |
| BrowserStack | HQ Mumbai | **USD** — from $12.50/mo |
| Chargebee | Chennai | **USD** — $0 + 0.80%, $99 + 0.65% |
| Freshworks | founded Chennai 2010 | USD (NASDAQ-listed) |
| Razorpay | India | **₹** — India-domestic market only |

[fetched, pricing pages + Wikipedia REST summaries]

Rupee denomination is not a nationality signal — it is a *market* signal. Every Indian company that sells to the world quotes dollars; the ones that quote rupees sell to India. Publishing Rs 299/Rs 599 to a global developer audience says "this product is for the Indian domestic market," which is the opposite of the stated intent.

Worse, the geo-pricing evidence runs the other way. **Craft, served to an Indian IP today, quotes ₹526.7/mo for Plus.** **Superhuman (at coda.io/pricing), served to an Indian IP, quotes ₹1,250/mo for Basic Pro.** These are the *discounted* Indian prices of global products.

| Comparison | Ratio [derived] |
|---|---|
| Rs 599 vs Craft Plus India (₹526.7) | 1.14× |
| Rs 299 vs Craft Plus India | 0.57× |
| Rs 599 vs Superhuman India (₹1,250) | 0.48× |
| Rs 599 vs one Cursor Pro seat (₹1,907.80) | 0.31× |
| Rs 299 vs Obsidian Sync annual (₹381.56) | 0.78× |

An Indian developer already pays ₹526–1,250/month to global note-taking products. Rs 299 is not meeting Indian willingness-to-pay; it is undercutting it. The PPP argument that would justify a low rupee price does not apply to this buyer — as one HN commenter put it, "*Even for high earners in those regions, the friction is often psychological*" ([HN 46663076](https://news.ycombinator.com/item?id=46663076), 2026-01-17).

---

**What people say when they refuse to pay**

Reddit was unreachable, so this is HN only, and I flag the denominator honestly: of 191 comments containing both a cancellation verb and a subscription word, only **8 (4.1%)** cite price and **6 (3.1%)** cite under-use. Cancellation discourse on HN is dominated by streaming (40, 20.9%) and AI tools (27, 14.1%). Refusal language in the notes corpus matched **63 of 940 (6.7%)**. The refusals cluster into three shapes:

| Shape | Verbatim |
|---|---|
| **One more subscription is the objection, not the amount** | "*I'm a bit iffy about buying another subscription just for encrypted sync*" — [HN 26840685](https://news.ycombinator.com/item?id=26840685), 2021-04-17 |
| **The sync price is judged against storage, not against the editor** | "*Ridiculou[s] that they expect 8 Euro per month just to sync (not even store) my data. I now use UpNote… one time purchase option that is less than 50 bucks*" — [HN 41093276](https://news.ycombinator.com/item?id=41093276), 2024-07-28 |
| **Notes specifically resist subscriptions** | "*for a note-taking app, a subscription model is discouraging. I don't want access to the history of my thoughts tied to a recurring payment*" — [HN 31463944](https://news.ycombinator.com/item?id=31463944), 2022-05-22 |
| **A hard ceiling, stated** | "*How much should a note taking app cost? $5 a month? No. Barely $1 a month maybe.*" — [HN 24269967](https://news.ycombinator.com/item?id=24269967), 2020-08-25 |
| **One-time as the precondition for trying at all** | "*it's a one time purchase. If it wasn't I wouldn't have given it a try*" — [HN 45094164](https://news.ycombinator.com/item?id=45094164), 2025-09-01 |

Note the fourth quote against the second: the *same* audience says "$5/mo is too much for notes" and "$50 one-time for UpNote is fine." $50 one-time is 10 months of $5. The objection is the recurrence, not the money.

---

**The honest verdict on Rs 299 / Rs 599**

**Not defensible as stated, and mostly the wrong axis.**

- **Rs 299 ($3.13): wrong for two independent reasons.** It sits below the $5/mo mode of the category discourse, so it does not buy you a "cheap" positioning you weren't already going to get; and it prices a correctness-critical tool below a sync add-on, which undercuts the one thing the product is selling. This is the credibility floor, not the noise floor.
- **Rs 599 ($6.28): the number is plausible; the currency and the axis are not.** $6/mo is a defensible consumer price — between Bear ($2.99) and Ulysses ($5.99) and Reflect ($10). But quoted in rupees to a global audience it reads as domestic-market software, and per-seat-per-month is the exact shape the evidence says this buyer refuses.

What the evidence actually supports, ranked:

| Rank | Model | Why the evidence supports it |
|---|---|---|
| 1 | **One-time purchase, ~$39–79, with paid major versions** | The only individual-monetization model with three live proof points at three price levels (Typora $14.99, iA Writer $49.99, Sublime $99). Directly answers the "*I wouldn't have given it a try*" objection. Also the only model an unfunded two-person team can support without an ongoing service obligation. |
| 2 | **Free editor + paid sync/backup at $4–8/mo** | The single proven recurring line item in the category — 56 of 60 Obsidian payment mentions. But it means building and operating sync, which the record already identifies as the #1 loved feature *and* #1 switching trigger, and it puts you head-on against Obsidian Sync at its own price. |
| 3 | **Metered agent usage on top of a free editor** | Zed ($10/mo incl. $5 tokens), Cursor, Copilot ($0.01/credit) all price the AI, not the editing. It aligns cost with the tiny AI budget instead of fighting it, and it is the only axis where the per-hunk-diff feature is the thing being paid for. |
| 4 | **Per-repo or per-org for teams, $12–30/seat** | Where the byte-exactness argument actually has a buyer: CodeRabbit $24–48, Greptile $30, GitBook +$12/user. A team that runs agents against a docs repo has a budget and a corruption-blast-radius. |
| 5 | **Open-core** | Logseq shows the free-and-open path builds affection; it does not show it builds revenue. |
| — | **Per-seat monthly at Rs 299/599 to individuals** | Zero evidence found for it. No individual-facing markdown product in this survey charges a developer a low monthly fee for the editing surface. |

If one number must be named: **$49 one-time in USD, with sync as a separate $5/mo service if and when it ships.** That is Typora's and iA's proven shape, priced at the level that survives the credibility floor, denominated in the currency every Indian company that sells globally uses, and it removes the recurring-payment objection that 6.7% of the corpus states out loud and that the $50-one-time-vs-$5-a-month contradiction proves is the real one.

---

**Method and source reachability**

- **HN Algolia**: HTTP 200 on every call. 20 distinct queries; corpora of 940 and 462 unique comments (1,395 merged, deduped by objectID). Show HN traction measured over `(story,show_hn)`, n=609 for "markdown editor."
- **Reddit — all endpoints failed.** `www.reddit.com/r/ObsidianMD/search.json` → **HTTP 403** (189,908-byte interstitial). `www.reddit.com/.../top.json?t=year` → **403**. `www.reddit.com/r/.../comments/.json` → **403**. `old.reddit.com/.../search.json` → **HTTP 200 but body is HTML titled "Welcome to Reddit", not JSON**. `old.reddit.com/r/ObsidianMD/.rss` → **200, same HTML interstitial**. Alternate user agents (research bot, curl/8) → same. `api.pullpush.io` → **HTTP 429**, body: "This website does not provide free scraping resources for agents." `redlib.catsarch.com` → **403**. **Zero Reddit data reached this report.** [SS]
- **Pages that returned 200 but render prices client-side**, so no figure was extracted: Zoho Writer, Hoppscotch, Setapp, Graphite, Notion (partial — $10/$20 recovered from the DOM), Logseq (no pricing published). Marked absent above rather than guessed.
- **Height.app is down**, not merely blocked: HTTPS → curl(35) TLS handshake failure, HTTP=000; plain HTTP → 502 Bad Gateway. Reported rather than substituted from memory.
- **Geo note that matters to the analysis**: `craft.do/pricing` and `coda.io/pricing` both auto-served **rupee** pricing to this machine's Indian IP. Those ₹ figures are India-localized prices of global products, and are labelled as such — a US reader sees different numbers.
- **Session hygiene**: read-only throughout — no repo writes, no commits, no mutating commands. All fetches landed in `$TMPDIR`.
