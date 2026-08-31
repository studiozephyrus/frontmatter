Read-only confirmed — no writes, commits, or mutations from this subagent; all commands were `curl` fetches and `python3` JSON parsing into `$TMPDIR/fmres`.

**The one problem worth solving is not "generate the document" — it is that nobody can hand an AI a document that carries a commitment and get back a change they can approve faster than making it themselves; and the single most important thing I found this round is that an independent team has already built our exact engine, given it away MIT, and pointed it at `.docx` instead of markdown.**

---

**What I could and could not open.** HN via the Algolia API: fully reachable, 19 queries run, all quotes below opened. GitHub API: reachable. **Reddit: unreachable from here.** `www.reddit.com/*.json` → **403**, `old.reddit.com` → **404**, `api.pushshift.io` → **403 "Not authenticated"**, `redlib.catsarch.com` → **403**, `safereddit.com` → 200 but a browser-challenge interstitial, `libreddit.privacydev.net` → **502**. So r/ExperiencedDevs, r/smallbusiness, r/agency, r/ProductManagement and r/consulting are **[SS]** this round. That matters: the segment I end up recommending lives in two of those subs, and I could not hear them. Treat the demand side of the final section as thinner than the supply side.

---

### 1. What the wild actually says

| Signal | Count | Quote (all [fetched] 2026-08-31, hn.algolia.com API) |
|---|---|---|
| "What do you still do manually in 2026 that should be automated?" (HN 48045237, 34 comments) | 1 answer names AI review | **"Reviewing AI generated slop."** — 2026-05-07 |
| same thread | | **"I still manually synthesize information from multiple sources (docs, blog posts and threads). LLMs help with summaries but merge into a reliable decision step is very human-heavy."** — 2026-05-07 |
| same thread, on pricing | | **"a business built on $20 problems is unlikely to be sustainable because it is not enough money to reliably reach small markets… 1000 customers would be $20,000/month, but you have to get there first and stay there second."** — 2026-05-07 |
| People want *detection*, not generation | 1, but decisive | **"Is there an option to just get notified that some docs are out of date? I'd rather write the documentation myself."** — 2026-02-24, on *Show HN: Tag Promptless on any GitHub PR* |
| Docs staleness as an AI-era failure | `"docs are out of date"` = 13 comments since 2025-01 | **"If your architecture is bad or not documented, your docs are out of date or the goal of the feature request is vague, how should the AI… develop high quality software"** — 2026-07-24 |
| Repetition of context by hand | `CLAUDE.md maintain` = 90 | **"Every few sessions I'd find myself typing the same thing again. 'Auth token expiry is 900s not 3600s.'… After the fifth time I stopped blaming myself for not writing it down."** — 2026-03-31 |
| Unbounded machine edits | `"unrelated changes" AI` = 10 | **"…the real bad ones that mix refactoring and tons of other unrelated changes with a fix?"** — 2026-06-24 |
| Prose diffing is bad | `"diff noise"` = 10 | **"My only problem using git and a text editor is deciding whether I want hard or soft wraps… you can change the git diff engine to something like difft, which makes it much more bearable than the default for hard wrap prose."** — 2026-05-26 |
| Compliance paperwork | `"security questionnaire"` = 10; `"vendor questionnaire"` = **0** | **"Companies will pay me to handle their compliance mapping but balk at paying an open source maintainer to fill out a security questionnaire."** — 2026-02-14 |
| `"I still do it by hand"` | **3 total, none software** | (taxes, times tables, WebGL) — the literal phrase is a dead end |

[measured] Two counts do the real work here. The phrase-shape the brief asked me to mine — "I still do X by hand" — returns **3 hits in HN's entire corpus**, none relevant. And "we ended up building our own" returns 55, but reading them, they are infrastructure (Bazel, data warehouses, RPC), not documents. **The document-pain literature on HN is thin.** That is itself a finding: the loud, countable pain is about *code*, and code is exactly where the free tools are best.

---

### 2. Filter one — can two people with a byte-exact markdown engine actually ship it?

| Candidate from the wild | Survives? | Why |
|---|---|---|
| Automated SOP / process-doc generation from screen recordings | **No** | Video ingest, vision spend. Kills the AI budget at 100 users. |
| "Merge multiple sources into a reliable decision" | **No** | This is judgement, not a projection of a file. Nothing byte-exact helps. |
| Cross-repo agent coordination / team CLAUDE.md | **No** | Needs to sit inside someone's IDE and CI. Two people cannot hold that surface. |
| Security-questionnaire answering | **No** | The buyer wants an attestation, not a document. Needs SOC 2 posture data we do not have. |
| Changelog / release notes by hand | Yes, trivially | But see filter two. |
| Docs-vs-code drift detection | Yes | Repo read + diff + one model call. Cheap. |
| Bounded, reviewable machine edits to a document | **Yes** | This *is* the engine. Locate range, replace exactly those bytes, refuse on ambiguity. |

[inference] Only three of seven survive, and two of the three are one feature, not a company. That is the expected shape and it is fine — the filter is doing its job.

---

### 3. Filter two — will a lab or an incumbent do it free within eighteen months?

This is where almost everything dies, and the evidence is unusually hard.

**The spec/artefact thesis is already GitHub's, free.** [fetched, api.github.com, 2026-08-31] `github/spec-kit` — **132,331 stars, 11,911 forks, MIT, created 2025-08-21, last push 2026-08-28**. `Fission-AI/OpenSpec` — **66,715 stars**, pushed 2026-08-28. `gsd-build/get-shit-done` — 64,622. A GitHub search for `spec driven development` returns **4,422 repositories**. [derived] spec-kit went 0 → 132k stars in **372 days**. The emerging thesis in the brief — "it generates the artefacts of product development" — is a category that the platform owner has already commoditised, at scale, for free, and is still shipping to weekly. **Do not enter it.**

**The docs-drift lane is a graveyard with a funded incumbent.** [measured, HN story search 2026-08-31] Seven launches, with their scores:

| Launch | Date | Points | Comments |
|---|---|---|---|
| Launch HN: **Promptless (YC W25)** — automatic updates for customer-facing docs | 2025-02-18 | 107 | 61 |
| Show HN: Tag Promptless on any GitHub PR/Issue | 2026-02-24 | 35 | 7 |
| Show HN: I built a GitHub AI app to automate fixing outdated docs | 2025-07-16 | **2** | 1 |
| Show HN: Fix your outdated GitHub docs on autopilot | 2025-07-28 | **2** | 0 |
| Show HN: Driftcheck — pre-push hook catching doc/code drift with LLMs | 2026-01-20 | **2** | 0 |
| Show HN: DocSync — git hooks that block commits with stale docs | 2026-02-15 | **4** | 0 |
| Show HN: Doksnet — keep docs and code in sync with hash verification | 2026-02-20 | **1** | 0 |

[derived] Five independent builders shipped the same product in thirteen months and collectively earned **11 points and 1 comment**. A YC-backed company sits on top of the lane. This is not an unsolved problem; it is an unwanted one.

**And the engine itself is already free, for the format that actually carries money.** This is the finding that should change the plan.

[fetched, github.com/dealfluence/adeu + raw README, 2026-08-31] **`dealfluence/adeu`** — *"docx ↔ LLM translator. Projects .docx office files to Markdown for editing. Projects edits back to OOXML as tracked changes (redlines)."* **149 stars, MIT, created 2025-12-30, last push 2026-08-30.** Its README, verbatim: *"LLMs speak Markdown; reviewers speak 'Track Changes.'"* Its middle stage: *"**Validate:** Acts as a strict safety gate. It protects the document's integrity by **automatically blocking ambiguous text matches** or invalid structural changes before they touch the file."*

Read that again. That is refuse-rather-than-guess, shipped, MIT, eight months old, distributed as a **Claude Code plugin, an MCP server, an Agent Skills package, a PyPI package and an npm package**, with a company (adeu.ai, from a team named Dealfluence — contracts) behind it. They made three decisions we have not:

1. Markdown is the **intermediate representation**, not the destination. The user never sees it.
2. The output is **native Word Track Changes**, because the reviewer is a lawyer with Word, not a developer with git.
3. The engine is a **free plugin**; whatever they sell is above it.

[inference] Independent convergence on a design is the strongest evidence that the design is right *and* the weakest possible moat. Our byte-exact splice engine is, as a standalone claim, now a commodity — installable in one line inside the same agent our users would run.

---

### 4. What survives

**One.** Not twelve.

Everything that generates dies to spec-kit and the labs. Everything docs-drift dies to Promptless and to five corpses. Everything context-pack dies to a crowded Show HN field (`"context pack"` = 5 comments, of which 3 are launches of that exact product) plus lab-shipped memory. Questionnaires die to Vanta/Drata/Conveyor and to our lack of posture data. Changelogs die to the $20-problem argument.

What survives is the thing the engine is actually for, stated without the word "markdown" in it:

> **A machine edit to a document that carries a commitment is currently unreviewable, so the accountable human re-reads the whole document — every time — and that re-read is the entire cost of using AI on documents that matter.**

The review cost is O(document). The change is O(bytes). Every generator on the market widens that gap; nothing narrows it. "Reviewing AI generated slop" was, verbatim, one person's answer to *what do you still do manually in 2026*.

---

### 5. The top candidate, examined

**Who has it.** The person personally on the hook for a written document that a client, regulator, or counterparty will hold them to, who is not a developer, and whose accountability is personal rather than institutional. Concretely, and closest to the founder's reach: the **one-to-five-person professional services operator** — the independent consultant, the small studio principal, the boutique agency owner — whose deliverable *is* a priced document. Scope of work. Statement of work. Change order. Monthly status report. Handover. India-based selling globally is over-represented in exactly this population.

**How often.** [inference] Every engagement produces 3–6 such documents and every engagement mutates them 2–4 times. For someone running 4–8 live engagements, that is a weekly ritual, not an annual one. Recurring: yes, structurally.

**What they do today.** Open the last one. Find-and-replace the client name, the dates, the numbers. Paste it into an AI, ask for a revision. Get back a full rewrite. Then read the whole thing, top to bottom, hunting for the sentence the model quietly improved. [SS on frequency — this is the part r/consulting and r/agency would have told me, and both returned 403.]

**What being wrong costs.** This is the part that makes it a business rather than an annoyance. A scope clause that the model "cleaned up" from *"two rounds of revisions"* to *"revisions until approval"* is unbounded free labour. A payment-terms line silently normalised from 50% advance to net-30 is a cash-flow hole. A deliverable list that gained one plausible-sounding item is a dispute. **The failure mode is not a hallucinated fact you would notice; it is a fluent, reasonable-sounding edit you would not.** That is precisely the class of error a byte-exact engine can make impossible: if the machine may only replace bytes 4,412–4,461 and must refuse when the anchor is ambiguous, the improvement it was going to make never happens.

**What they pay for the workaround.** Nothing, in cash. Everything, in time — and that is a warning, not an opportunity. The honest read of the HN comment above is that **a $20/month problem is not reliably a business**, and Rs 599 is $7. [derived] At Rs 599/month, 1,000 paying users is ₹5.99L/month ≈ $7,200 — real for two people, and the founder's cost structure (near-zero at 100, predictable at 10,000) can carry it. But the same comment's second half is the trap: *"getting there is probably more money and calendar pages than you think."*

**Why the obvious incumbent has not taken it.** Microsoft has had the answer since 1990 — Track Changes — and Copilot writes into it. Google has Suggesting mode and Gemini. The reason neither has closed this is not capability; it is that **their AI writes suggestions but does not refuse.** An incumbent whose product is measured on assistance-acceptance rate cannot ship a feature whose headline behaviour is *"I declined to make your edit because I could not locate it unambiguously."* Refusal is a negative metric inside a big company and a positive metric for a liable individual. That asymmetry is the only durable thing in this report — and adeu has already found it too.

---

### 6. The problem statement

> **A person who is personally liable for a document cannot let an AI edit it, because they have no way to verify that the AI changed only what they asked — so they either re-read the entire document every time, or they do not use AI on the documents that matter most.**

---

### 7. The strongest argument that this is not a problem

It is this, and it is strong enough that I would not fund this round on my own evidence:

**The people with this problem do not have their documents in markdown, and the people with their documents in markdown do not have this problem.** The liable consultant's SOW is a `.docx` or a Google Doc, because that is what the client signs. The developer's spec is in a repo, where `git diff` plus a PR review already bounds every machine edit — which is why the docs-drift Show HNs scored 1, 2, 2, 2 and 4 points. Markdown-native *and* personally-liable *and* non-developer is the intersection of three sets, and I could not open a single source this round that proves anyone is standing in it.

Worse, the one team that clearly saw the same mechanism we did — same refusal, same exact-match gate, same markdown-as-projection insight — **looked at that intersection and walked around it**: they projected `.docx` *through* markdown and back out to Track Changes, gave the engine away MIT, and shipped it into Claude Code as a plugin. If they are right, the correct move is not to build a markdown editor with a byte-exact engine. It is to accept that the engine is table stakes, that markdown is plumbing the user must never see, and that the product is whatever sits above a commodity engine and gets a liable person to pay — which is a question this round did not answer and the next one must.

And a second, quieter argument: [fetched, 2026-05-07] the honest answer to *"what do you still do manually in 2026"* was, mostly, **laundry, dishes, and packing for a trip**. Thirty-four people, and one of them named an AI-review problem. If this were burning, more than one would have said so.

**Recommendation for the next round:** do not research another opportunity. Take the one problem statement above, install `adeu` (`npx skills add dealfluence/adeu`), run our own SOW through it, and find out in an afternoon whether the remaining gap is a product or a footnote.
