**The most inconvenient finding first: in 33,647 Reddit posts across the three communities you named, written over a full year, missing documentation is almost never the complaint. Explicit "our docs are missing/outdated/nonexistent" posts number 25, 10 and 9 — 0.3%, 0.1% and 0.1%. Architecture decision records are mentioned in 30 posts total, 0.089% of the corpus. Meanwhile 745 posts (2.2%) discuss AI and documents together, and they run 6.7:1 negative. The market is not asking for more documents. It is complaining about the ones the machines already made.**

**Method and denominators** [measured]

| Source | Frame | N | Window |
|---|---|---|---|
| r/ExperiencedDevs | every post, arctic-shift archive API | 9,809 | 2025-09-01 → 2026-08-31 |
| r/ProductManagement | every post | 8,158 | same |
| r/devops | every post | 15,680 | same |
| **Reddit total** | | **33,647** | |
| GitHub | public repos with a live `adr/`-shaped dir, 6 code-search queries | 335 repos | measured 2026-08-31 |
| — pre-2024 sub-cohort | every individual record dated by its adding commit | 54 repos, 432 records | |
| HN | Algolia full-archive comment counts | all-time | |

Reddit's own API returns a login wall; `old.reddit` too. The archive at arctic-shift.photon-reddit.com served complete post bodies. WebFetch was refused; `curl` was not, per your note.

---

**The real reasons documents do not get written, ranked properly**

Raw counts mislead here, and my own first pass was wrong. Counting keywords inside documentation-mentioning posts put "not rewarded / no promotion credit" at the top of r/ExperiencedDevs (67/386, 17.4%). But r/ExperiencedDevs is a career subreddit — those words are everywhere. Computing **lift** (rate inside doc-posts ÷ base rate across all posts) collapses that finding and produces a different ranking [measured, self-corrected]:

| Cited reason | ED lift | PM lift | devops lift | Verdict |
|---|---|---|---|---|
| Tool friction (Confluence/Notion/wiki/SharePoint) | **8.9×** | **7.7×** | **12.7×** | the dominant co-occurrence |
| It goes stale immediately | 6.0× | 6.1× | 8.4× | second |
| Nobody reads it | 5.7× | 6.2× | 8.1× | third |
| Don't know what to write / need a template | 3.9× | 2.3× | 4.1× | fourth |
| Hoarding / job security | 3.1× | 3.4× | 3.3× | real but small |
| Not rewarded / no promo credit | 1.5× | 1.8× | 2.7× | mostly base rate |
| **No time / deadline** | **1.9×** | **1.7×** | 4.5× | **the stated reason is the weakest signal** |

"No time" is confirmed as a cover story — it is the least distinctive thing doc-posts say. The structural reasons underneath are: **the destination is hated, the artefact decays faster than it is read, and the author has no evidence anyone consumed it.** The canonical statement of all three, from HN [fetched, news.ycombinator.com/item?id=27009218, 2021-05-01]: *"Nobody asked for it - Nobody reads it - Nobody reviews it - Nobody updates it - It takes me over a day to write so I feel quite guilty wasting the time."*

Note what is *not* on that list: difficulty of writing. Nobody says the prose was hard. That is the first crack in a thesis whose core value is producing prose faster.

---

**The ADR question, measured**

I sampled 335 public repos that have an ADR-shaped directory today, then for the 54 repos created before 2024 I dated **every individual record** by the commit that first added it. This is the cleanest available test of "three then silence."

| Measurement | Result (54 repos, 432 dated records) |
|---|---|
| Median records per repo | **5.5** |
| Median share of a repo's records created within 30 days of its first | **100%** |
| Median share created within 7 days | 67% |
| Repos that added **zero** new records after the first 30 days | **32/54 = 59%** |
| Repos that added ≤3 after the first 30 days | 39/54 = 72% |
| Median span, first record → last record | **24.5 days** |
| Median age of the *newest* record in the repo | **360.5 days** |
| Repos still actively pushed (≤180d) | 40/54 |
| …of those live repos, newest record >365 days old | **13/40 = 32%** |

Across the full 335-repo sample: median directory lifespan **10 days**; **44% have a lifespan of ≤1 day** — every commit that ever touched the decision log landed on a single day.

So: your hypothesis is confirmed, but the shape is worse than "three ADRs then silence." It is **five or six records in one sitting, then silence, while the code keeps shipping.** The control matters — these are not dead repos. Three quarters are still being pushed to.

Two honest caveats, both of which make 59% a **lower bound**: repos that created an ADR directory and later deleted it are invisible to this frame (survivorship); and my multi-file queries over-sample repos with *many* records, which biases against the abandonment finding.

The counter-pattern is real and worth naming. ADRs survive where governance culture already exists: apache/airflow (13 records added after the first month, span 1,724 days), elsa-workflows/elsa-core (25 after), alphagov/govuk-infrastructure (16 after, span 5 years), microsoft/semantic-kernel (79 records, 1,066-day span), JabRef/jabref (72 records, 1,540 days). These teams did not need a tool to make them write. They are also, notably, not paying ₹599/month for anything.

**And then the finding I did not expect.** 61.5% of the 335 ADR repos carry an AI agent configuration file (`AGENTS.md`, `CLAUDE.md`, `.claude/`, `.cursor/`) beside the decision log. Among repos created in 2026: **139/187 = 74%**. Agentic repos hold a median of 12 records against 4 for non-agentic ones [measured].

| Repo | Records | Span of the whole log | Rate |
|---|---|---|---|
| kirtiarya05/wifi-human-sensing | 247 | **0 days** | 247/day |
| evan-2005/ruview-esp32 | 185 | 0 days | 185/day |
| 0xAeterNova/RuVigil | 182 | 0 days | 182/day |
| hiroshiyui/afterschool_pascal | 268 | 6 days | 38/day |

I opened the first one's tree to check rather than infer. It contains `.claude/agents/v3/adr-architect.md` and `.claude/helpers/adr-compliance.sh` [fetched]. The 247 decision records were written by a Claude subagent purpose-built to write decision records. 9% of the whole sample produces ≥10 records/day sustained across the log's entire life; 79% of repos with ≥30 records are under 400 days old.

**The ADR renaissance of 2026 is machine-authored, produced at a rate no human decision process generates, and abandoned the same week.** On Hacker News, "architecture decision record" has 23 comment mentions in the site's entire history, against 1,833 for "bus factor," 1,088 for "design doc," and 1,037 for "tribal knowledge" [measured]. As recently as 2026-08-01 a commenter wrote *"I had to search these terms, does ADR mean 'Architecture decision record'?"* [fetched, id=49139391].

---

**Which missing documents actually cost money**

Only one document type produced a genuine, high-engagement pain post in 33,647 posts, and it is not the one the product leads with.

**The runbook.** r/devops, 2025-10-15, 695 points, 262 comments — the highest-scoring authentic documentation-pain post in the entire corpus [fetched, redd.it/1o7p2bq]: *"had a p1 last night. database failover wasnt happening automatically. nobody knew the manual process. spent 45min digging through old slack messages… found a google doc from 2 years ago. half the commands dont work anymore… one step just says 'you know what to do here'."* It ends by refuting its own remedy: *"documenting everything sounds great in theory but nobody maintains docs and they go stale immediately."*

**Search-and-interrupt time.** Stack Overflow's 2024 Developer Survey [fetched, survey.stackoverflow.co/2024/professional-developers]: 61% of respondents spend more than 30 minutes a day searching for answers, *including asking a colleague and waiting for a response*. Band midpoints weighted: 9.3%×7.5 + 27%×22.5 + 37.9%×45 + 18.3%×90 + 7.6%×150 = **51.6 min/day** → ×230 working days ÷ 60 = **198 hours/year ≈ 4.9 working weeks per developer** [derived]. An honest upper bound: much of that is third-party API research no internal document would fix.

**DORA's moderation effect** is the strongest published evidence, and it is about *quality*, not existence [fetched, dora.dev]:

| Capability | Lift to org performance, below-average docs | above-average docs |
|---|---|---|
| Trunk-based development | 36% | **1,525%** |
| Continuous integration | 34% | 750% |
| Continuous delivery | 63% | 656% |
| Supply chain security | 37% | 451% |

Read that carefully before quoting it. DORA scored documentation on **clarity, findability and reliability** — three properties that a large pile of freshly generated markdown actively degrades. Volume is not the axis they measured.

Handover and procurement, the other two you asked about: handover/KT appears in 34/9,809, 42/8,158 and 15/15,680 posts (0.3%/0.5%/0.1%), even though "quitting/laid off/leaving" appears in 5.3% of r/ExperiencedDevs. **People talk about turnover constantly and almost never connect it to a handover document.** Procurement/security-questionnaire pain: I could not isolate it in this corpus. [SS]

---

**Does AI change this? Yes — in the wrong direction**

745/33,647 posts (2.2%) discuss AI and documents together. Using a deliberately balanced six-term lexicon on each side, 107 carry a negative marker and 16 a positive one — **6.7:1** [measured]. The unbalanced, wider lexicon gives 6.1:1, so the ratio is robust to lexicon choice.

The representative post, r/ProductManagement 2026-07-06 [fetched, redd.it/1up64mw]: *"we now produce 3x the PRDs, specs, and analysis docs. Leadership loves the velocity. The quality of the decision behind them is worse. The hard part of the job was never writing the PRD. It was sitting with ambiguous customer feedback and making judgment call… now I spend my days reviewing AI generated garbage and re-writing it."*

The trust mechanism, r/ProductManagement 2026-02-10 [fetched, redd.it/1r0vhfc]: *"The problem with LLM is that the cost of generating bullshit now vastly undercuts the cost of detecting and correcting it."*

And the direct attack on the artefact-as-product thesis, HN 2026-07-22 [fetched, id=49008803]: *"why would I read your AI-generated documentation when I can ask my AI… to read the code?"* With HN 2026-08-30 [id=49496011]: *"Nobody reads the docs. This will be even more true soon as LLM generated docs become more popular."*

Adoption has risen. Reading has not. The GitHub data is the same story in a second medium.

---

**The uncomfortable question, argued both ways**

*The case that generating a decision record destroys the point.* An ADR's value was never the file. It was the forcing function: writing "Consequences" makes you enumerate what you are giving up, and you cannot fake that from the outside. A generator sees the diff and the chat log, so it can only reconstruct the decision that *was* made — never surface the option that should have been considered and wasn't. The PM above named this exactly: the hard part was the judgment, not the prose. And a generated record inherits no author accountability, which is why the 2026-02-10 complaint exists: an unreviewed generated document is a *liability* that costs a reader 30 minutes to disprove. HN, 2023-06-12: *"stale documentation is worse than no documentation"* [id=36290604]. The measurement supports this: 247 records in one day is not 247 decisions. It is ceremony at machine speed, and 44% of all sampled logs were touched on exactly one day.

*The case that it is genuinely valuable.* The forcing-function argument assumes a counterfactual where the document gets written. My data says it does not: 59% of teams that adopted ADRs wrote zero after month one. The real comparison is not *thoughtful record vs. generated record*; it is *generated record vs. nothing*, and nothing is what 59% chose. Second — and this is the part that actually rescues the thesis — **the reader has changed.** The 2026-03-11 HN comment [fetched, id=47333698]: *"I usually keep an 'adr' folder in my repo… These allow the agent to get the 'why' when it needs to. Useful for humans too."* A document written for an agent does not need to survive human attention economics; it needs to be retrievable and correct. 74% of 2026-created ADR repos are agent repos. That is a real, measurable, brand-new demand curve.

The synthesis the evidence actually supports: **the value is not in producing the record, and not in the thinking either. It is in the record still being true six months later** — which is precisely the axis DORA measured (reliability, findability) and precisely the axis on which every sampled log fails, with a median newest-record age of 360 days.

---

**WHAT THIS MEANS FOR THE PRODUCT**

- **Do not sell "we generate your handovers, decision records and specs."** Generation is the commodity — 74% of 2026 ADR repos already do it free with a subagent — and the market response is 6.7:1 negative. You would be entering the category people are complaining about.
- **Kill the "artefact suite" framing; build the freshness gate instead.** The measured failure is never authoring (median 5.5 records written), always maintenance (median 100% of them written in one month, 360 days since the newest). A product that watches the diff and says *"ADR-004 claims Postgres; you moved to DynamoDB in commit abc123 — this record is now false"* attacks the one thing nobody has solved. Your engine's refuse-rather-than-guess property is the exact right primitive for this, and it is not a generation feature.
- **Lead with the runbook, not the decision record.** It produced the only 695-point, 262-comment pain post in 33,647; ADRs produced 30 mentions total. Incident context has a dollar figure attached (45 minutes of P1) and a buyer with a budget line. "Decision record" as a headline term is unknown enough that HN readers were still asking what the acronym meant three weeks ago.
- **Treat Confluence/Notion, not the blank page, as the competitor.** Tool friction carries the highest lift in all three communities (8.9×/7.7×/12.7×) — higher than staleness, higher than time. A local markdown file that is diffable and greppable is a genuinely differentiated answer to that specific complaint, and it is an argument you can make without mentioning AI at all.
- **The agent-context pack is the strongest surviving piece of the thesis — make it the whole product, and make it verifiable.** It is the only use case with rising, measured, primary-source demand, and it sidesteps every "nobody reads it" objection because the reader is a machine. But ship provenance: line-level links back to the commit or thread each claim came from. The 6.7:1 hostility is a trust problem, and unverifiable generated context is exactly what people are refusing.
- **Reprice the discovery risk.** Documentation pain is real but almost never *spoken*, at 0.1–0.3% of posts. That means near-zero organic search demand and near-zero word-of-mouth for a product named after the problem. For two founders selling globally on a small budget, "sell the runbook-freshness gate to SRE teams who just lost someone" is a findable buyer; "sell documents to people who have not asked for documents" is not.
