## 102. Who this is for, now that we know what it is

The personas in §63 and the segments in §21 were written when the product was "a markdown editor with a byte-exact engine." They describe people who care about round-trip fidelity. Almost nobody buys round-trip fidelity. The artefact-factory thesis moves the buyer: from someone who is annoyed that their editor mangles a table, to someone whose AI keeps producing confidently wrong work because it was never told what the project is. That is a different person, a smaller number of them, and — this is the honest part — a person who is already paying for three other things.

### 102.1 What the record said before, and what changes

| Source | Old claim | Status after the thesis |
|---|---|---|
| §21 segments | Five segments, led by "technical writers and docs teams" | **Demoted.** Docs teams buy a docs pipeline (Docusaurus, Mintlify), not an artefact factory. Their AI problem is retrieval, not context authoring. |
| §21 ICP "developers with vaults" | Obsidian/Foam users with 500+ note repos | **Retained as the wedge population, narrowed by one predicate:** they must also be running an agent CLI daily. Vault size alone predicts nothing about willingness to pay. |
| §63 personas | Six personas incl. "the researcher", "the student" | **Cut four.** Researcher and student have the fidelity problem and zero budget; they are the free tier's population, not the buyer's. |
| §63 JTBD | "Edit markdown without losing my formatting" | **Replaced.** The job is: *when I start a new session or hand this to someone else, the receiving intelligence should not have to re-derive what we already decided.* |
| §64 positioning | "The markdown editor that never lies about your file" | **Kept as the proof, demoted as the pitch.** Byte-exactness is why the artefacts can be trusted; it is not why anyone opens the app. |
| §26–27 GTM/moats | Two-motion D2C + B2B, moat = engine correctness | **The two-motion claim is the unverified load-bearing assumption.** Named in §102.4. |

The uncomfortable through-line: every segment the record ranked highly was ranked on *fidelity pain*, which is a wide, shallow pain. The artefact pain is narrow and deep. Narrow and deep is what a two-person company can sell.

### 102.2 Ranking the five candidates

Ranked by *pain × ability to sign × distance from us*, not by market size.

| Candidate | Trigger that makes them look | Who signs | Compared to | Will NOT pay for | Verdict |
|---|---|---|---|---|---|
| **Solo builder shipping with Claude Code** | Third session in a row where the agent re-litigated a decision made last week; a `/compact` ate the constraint that mattered | Themselves, on a personal card, in under 90 seconds | Hand-written `CLAUDE.md`; Obsidian + a prompt template; `git log`; nothing | Seats, SSO, an admin console, a "team workspace", anything with an onboarding call | **WEDGE. Build for this person only.** |
| **2–5 person startup, no PM** | A founder and an engineer give the same feature to two different agents and get two incompatible implementations | The technical founder, same card, ₹599 × 3 without a procurement thought | Notion + Linear + whatever they paste into chat | Approval workflows, roles beyond "everyone can edit", per-seat pricing that punishes adding a contractor | **Second. Same product, one feature added (shared context pack).** |
| **Agency handing projects between people and clients** | A project changes hands and the new person spends two days reconstructing why the API looks like that; a client asks "what did we decide in March" | Studio owner / delivery lead. Buys tools, but buys *time-saving* tools, and evaluates against billable hours | Confluence, Google Docs, a Notion template they already built | A tool that only the technical half of the studio can open. Client-facing output must be a PDF or a link, not a repo | **Third, and the highest revenue per logo. Deliberately deferred — see 102.6.** |
| **Platform / DX team maintaining docs** | Their `docs/` drifts from the code and an internal agent starts citing stale pages | Eng manager, needs a vendor review | Mintlify, Docusaurus, Backstage TechDocs, an internal script | A second editor. They have an editor. They will not migrate writers. | **Fourth. Wrong shape — they want a pipeline, we are a surface.** |
| **Enterprise with compliance-driven documentation** | An audit, or an AI-governance policy that requires provenance on generated artefacts | Procurement, security review, 4–9 months | Confluence + a GRC tool | Anything without SOC 2, a DPA, SSO, and an SLA — all of which cost more than two founders have | **Explicitly not for us. See 102.7.** |

The ranking inverts the record's §21 order almost exactly. That is the finding, not a formatting accident.

### 102.3 The wedge user, specifically enough to email ten of them this week

Not a persona. A person.

> **She runs Claude Code (or Codex) daily on a codebase she owns end to end. Solo or the technical half of a two-person team. She has a `CLAUDE.md` in her repo that she has edited at least three times and that she privately knows is stale. She has at least one file in her repo named `HANDOFF*.md`, `DECISIONS.md`, `ADR-*.md`, or `context/*.md` that she wrote by hand for an AI to read. She has hit context compaction and lost something. She pays for at least one AI subscription already.**

Every clause is a search predicate, which is the point.

The last clause matters most and it is the one that hurts: she already pays $20–200/month for Claude, plus maybe Cursor. Our ₹599 (~$6.80 [derived]: ₹599 ÷ ₹88/USD, rate unverified at time of writing — mark before quoting) is small against that, which helps, but it competes for the same "AI tools" mental budget, which does not.

**Where to find ten of them, with real numbers.**

[fetched] GitHub code search API, read 2026-08-31 (endpoint `api.github.com/search/code` returned HTTP 401 without auth as expected; counts below are from the authenticated `gh api` path and from repo-level search which needs no auth):

- [fetched] `api.github.com/search/repositories?q=CLAUDE.md+in:path` — read 2026-08-31. Repository-scoped search does not index file paths, so this returns name/description matches only and is **not** the right instrument; the honest instrument is code search, which requires auth. Reporting the method rather than a number I cannot stand behind (RULE 5).
- [fetched] `raw.githubusercontent.com/anthropics/claude-code/main/README.md` — read 2026-08-31, HTTP 200. Confirms the CLAUDE.md convention is documented and first-party, i.e. the file exists in the wild by instruction, not by folklore.
- [fetched] `registry.npmjs.org/@anthropic-ai/claude-code` — read 2026-08-31, HTTP 200. The package is published and versioned; download counts live on `api.npmjs.org/downloads/point/last-week/@anthropic-ai/claude-code` and are the single best public proxy for wedge-population size. **Fetch it before quoting a TAM in any investor-facing document.**
- [SS] Obsidian's forum and the `r/ObsidianMD` subreddit are large (six figures), but vault owners are not agent operators; do not reuse §21's Obsidian sizing as a proxy for this wedge. It was the wrong denominator then and it is the wrong denominator now.

Where she actually is, in descending order of reachability by two people with no budget:

1. **Her own repo.** A public repo containing both `CLAUDE.md` and a hand-written handover file is a qualified lead with a visible email in `git log`. Ten of these are findable in an afternoon with one authenticated code-search query. This is the only channel that costs nothing and converts on relevance.
2. **The `anthropics/claude-code` issue tracker and discussions** — people filing issues about context loss are describing our product's reason to exist, in their own words, publicly, with timestamps.
3. **`modelcontextprotocol.io` ecosystem repos** — the population that writes MCP servers overlaps almost perfectly with the population that hand-maintains context files.
4. Hacker News "Show HN", once — not as a channel, as a single event.

Not on the list: Product Hunt, LinkedIn, paid anything. [inference] A ₹599 product cannot fund paid acquisition at any CAC an Indian two-founder company can absorb; §26's own arithmetic (₹20L/mo requiring ~1.26M visitors) is the record's own refutation of a traffic-led motion.

### 102.4 D2C versus B2B, decided

**Decision: one product, one motion — D2C self-serve — for the first twelve months. B2B is a later packaging of the same product, not a parallel track. Do not build both.**

The record's §26–27 assumes two motions can run at once. **The unverified claim underneath it is that the same surface satisfies both a solo self-serve buyer and a team buyer, so the second motion is nearly free.** Nobody has tested that. It is the assumption I would most want falsified before a line of team code is written, because if it is wrong, the cost is not a wasted feature — it is a surface cluttered with team affordances that the wedge user has to navigate past, which is exactly the "buried in features nobody uses" failure the founders named.

What actually differs, if both were run:

| Dimension | D2C (₹0 / ₹299 / ₹599) | B2B (would be ₹2,000–8,000/mo) |
|---|---|---|
| Surface | One repo, one person, no sharing UI | Shared context pack, member list, per-member provider keys, audit of who changed the decision record |
| Billing | Card, self-serve, monthly | Invoice, GST, annual, procurement email |
| Support load | Async, one founder, GitHub issues | Named contact, response-time expectation, a call when it breaks |
| Cost per user | Near zero — user's own model calls or none | Provider-key proxying, key storage, per-org isolation, one Postgres tenant model that now must be right |
| Failure mode | Churn quietly | Escalates to a human at 2am, and there are two humans total |

The "everything operable by one person on call" constraint is the decider, not the revenue. [inference] B2B converts a soft SLA into a hard one; two founders selling globally from India cannot hold a hard SLA across timezones without a third person, and a third person is not in the constraint set.

**Strongest argument against this decision:** the agency and the small startup are where the money is, and D2C-only caps us at a price point where 1,000 paying users is ₹5.99L/mo gross [derived: 1,000 × ₹599] — real, but slow, and it postpones learning whether teams pay *at all* until we have already shaped the product around a solo user who may be unrepresentative. If teams turn out to be the only durable buyer, twelve months of solo-shaped decisions become twelve months of rework. I hold the recommendation anyway, on one condition: **the team question gets answered by conversation, not by code.** Ten agency conversations in the same period the solo product ships. Zero team features until five of them say the same sentence about the same missing thing.

### 102.5 Feature discipline: who uses each thing, how often

Every feature named, with its person and its frequency. Anything I could not name a person for, I cut — and I say so.

| Feature | Who | How often |
|---|---|---|
| Generate a handover / decision record from the repo's actual state | Wedge user | End of a working session — 3–5×/week |
| **Kickoff prompt, copyable in one action** | Wedge user | Start of every session — daily, the single highest-frequency action in the product |
| Byte-exact splice edit + refuse-rather-than-guess | Wedge user, invisibly | Every write. She never thinks about it; it is why she trusts the output |
| Cross-engine degradation certification | Wedge user | Rarely — but at the moment her file must survive GitHub's renderer, which is when trust is won or lost |
| Shared context pack (one file, one repo, many readers) | 2–5 person startup | Weekly |
| Provider keys, models run inside the editor | 2–5 person startup | Only once they exist — **defer until five ask** |

**Cut, and named as cut:** client-facing PDF export (agency-only, and agencies are deferred); approval workflows (nobody in the wedge); templates gallery (an empty gallery is worse than no gallery); analytics dashboard (I cannot name the person who opens it twice); real-time collaborative cursors (settled architecture forbids it and no wedge user asked); mobile app; comment threads; roles and permissions. Eight features cut. That is the discipline working.

### 102.6 Deferred, not rejected

The agency is the best business and the wrong first customer. They pay more, they churn less, and they need exactly one thing we would have to build badly to ship early: a client-facing artefact that a non-technical person can open. Getting there through a solo product is possible; starting there means building a document-delivery product with an editor attached, which is a different company. **Revisit at 300 paying solo users or ten unsolicited agency inbounds, whichever comes first.**

### 102.7 Who this is explicitly not for

- **Enterprises with compliance-driven documentation.** No SOC 2, no DPA, no SSO, no SLA. Saying this out loud stops us from half-building an audit log that satisfies nobody.
- **Docs and DX teams looking for a publishing pipeline.** We do not build, host, version, or search a docs site. They should use Mintlify or Docusaurus.
- **Non-technical writers.** The file lives in a git repo, which is a hard prerequisite and not a soft one. Softening it would break the settled architecture.
- **People who want the AI to write the document for them unattended.** We refuse rather than guess; a user who wants confident output regardless of correctness will hate this product, and should.
- **Teams wanting real-time co-editing.** Settled: git merge, splice journal, CAS. Not a CRDT, so not Google Docs. Someone will ask. The answer is no.

Saying no to five populations makes the product better in one mechanical way: it collapses the surface to a single screen and one button that matters. The wedge user opens the editor, and there is a copyable kickoff prompt. Everything else is a drawer. A product that serves the enterprise cannot look like that, and looking like that is the whole advantage a two-person company has.

**The recommendation in one line:** build only for the solo builder running an agent CLI daily, price it at ₹599, sell it by emailing ten people found in public repos this week, and answer the team question with ten conversations rather than ten features.

**The strongest case against it:** she is the least loyal buyer in the list. She can reproduce a rough version of the kickoff prompt with a shell script and a heredoc, she has already tried, and the reason she stopped was effort, not capability. Our defensibility against her own scripting rests entirely on the engine being right where a script is sloppy — refusing rather than guessing, splicing rather than rewriting, certifying that the artefact survives the renderer it will be read in. If the artefacts we generate are merely *good*, she will keep the script. They have to be *provably correct in a way she cannot casually reproduce*, or this ICP has no floor under it.
