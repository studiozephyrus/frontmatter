## 103. Feature discipline — what we refuse to build, and why the refusal is the product

Every section before this one adds. This one is the only section with subtraction authority, and without it the other 102 compound into the product that §18 already names as the failure: nine controls over a file the engine refuses to open. The claim here is narrow and testable: **feature discipline only works if it is a written test with named artifacts, applied to the change in surface rather than to the feature, with the default set to no.** A principle two founders can both quote at each other is not a rule. A rule is a thing that ends the argument in under a day, in favour of the person who is not talking.

### 103.1 The admission test

Five gates. All five must pass. Each gate is answered by an artifact, not an opinion — that is the whole mechanism.

| Gate | The question, stated as a binary | The artifact that answers it | Fails when |
|---|---|---|---|
| **G1 — Named user, named frequency** | Which of P1–P5 (§63.1) uses this, and how often — per session, per week, or per quarter? | `U` (§18.2): support requests + issue mentions per command per quarter. Substitute metric, declared as one | No persona, or a frequency below quarterly, or "power users" as an answer |
| **G2 — Entailment** | Do the file's own bytes entail it, with nothing stored outside the file? | The projection law (§6.1.1). Grep the proposal for any new persistent store | It needs a sidecar, an index, a `.base`-equivalent, or a row in the control plane |
| **G3 — Route and budget** | Which of the four disposal routes (§16.5) does it land in — Visible, Invoked, Ambient, Contextual — and does V0 stay ≤ 9, C ≤ 4, D ≤ 2? | The CI DOM assertion on the shell subtree; the first-run copy word-count for C | It lands in two routes, or "Visible" with no displacement named |
| **G4 — Refusal path** | What does it refuse, what does the user see when it refuses, and does one keystroke undo it? | The refusal-copy string and the undo test, both written *before* the feature | The failure mode is a guess, a silent no-op, or an unreversible write |
| **G5 — One-person operability** | Does it add an always-on process, a provider dependency, a configuration surface, or a p99 outside budget? | §29 budget table; the on-call runbook diff | Any yes. A configuration surface is an automatic fail, not a trade |

**The tie-break clause.** When the two founders disagree, they must first say *which gate* they disagree on. That converts "I think users want this" into "we disagree about G1", which has an artifact. If the disputed gate cannot be answered by its artifact **within one working day**, the feature is deferred by default. The proposer carries the burden and the clock; the objector carries neither. This is deliberately asymmetric, because the cost of a wrong refusal is a feature shipped one quarter late and the cost of a wrong admission is permanent surface.

**The pool clause.** Passing all five does not admit anything when the budget is full. It admits it *in exchange for* a named displacement. There is no "and also".

### 103.2 Ten features run through it

Two of these ten are features the founders are attached to. The test rejects both, and rejects a third that would have made money.

| # | Feature | G1 user · frequency | G2 | G3 | G4 | G5 | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | Search operators `path:` `file:` `OR` | P1, P4 · per session | pass | Invoked, 0px | unparsed operator echoes the parsed query, refuses | pass | **ADMIT** |
| 2 | Saved searches | P2, P3 · weekly | **conditional** — passes only if the saved search *is* a `.md` file whose frontmatter holds the query | Invoked | pass | pass | **ADMIT, redesigned by G2** |
| 3 | Sort / group on tree | P3 · weekly | pass | **fails as a dropdown** (V0 9→10); passes as palette + `.frontmatter/state.json` | pass | pass | **ADMIT as Invoked only** |
| 4 | Multi-select → bulk set frontmatter field | P3 · per engagement; P4 · weekly | pass | Contextual on selection | all-or-nothing splice, one review surface, one undo | pass | **ADMIT** |
| 5 | Vault-wide find and replace | P1 · quarterly; P3 · per handoff | pass | Invoked | pass, if every hunk is shown pre-write | p99 unknown on a 10k-file vault | **DEFER** — passes the test, loses the pool to mobile |
| 6 | **Graph view** *(built; attached)* | **none** — 0 of 89 feature requests mention it; our own 3,848-node graph produced 45 transclusions, all of them documentation of the feature `[measured, §6.2]` | pass | pass | pass | pass | **FAILS G1.** Demote to Invoked, never marketed. Delete at the next `U` read if mentions stay at 0 for two quarters |
| 7 | **Degradation certificate as a persistent panel** *(our most categorical differentiator; attached)* | P5 · per sign-off — but P5 is the slowest cycle of six and v1 is built for P4 (§63.4) | pass | **panel fails G3** | pass | pass | **Capability ADMITTED, surface REFUSED.** It renders Contextual — before a risky act — and writes a `.md` file into the vault. Zero at-rest pixels |
| 8 | Per-note encryption / lock | P5, P3 · rare; Bear *monetises* exactly this `[fetched, §16.1]` | **FAILS** — encrypted bytes no other engine can read, which voids "opens in anything" and the certificate for that file | — | — | key recovery is an on-call surface one person cannot carry; Bear's own line is "we cannot see or reset it" | **REFUSE.** Revenue-positive and still refused |
| 9 | Mobile read + light-edit PWA | P1, P4 · daily capture | pass | **separate surface, own budget V0 ≤ 4** — do not port the rail | pass | pass | **ADMIT** |
| 10 | **Kickoff-prompt export** (this round's thesis) | P2 · per kickoff; P3 · weekly `[inference, not measured]`; P4 · daily | pass — assembled from the document's own bytes plus a template that is itself a `.md` file in the vault | Contextual + one palette command | refuses when the document lacks the sections the template names, and says which | **zero model calls by default** — the prompt is a string splice, not an inference | **ADMIT** |

Rows 6, 7 and 8 are the load-bearing ones. A rule that only ever ratifies what you already wanted is a mood. Row 8 refuses a feature a direct competitor sells; row 7 refuses the *display* of the thing we are proudest of; row 6 refuses code that already exists and looks good in a screenshot. Row 2 and row 3 are the more common outcome and the more useful one: the test did not reject them, it **redesigned** them, and in both cases the redesign is strictly better than the original proposal.

### 103.3 The refusal list

| Refused | Reason | What reverses it — with a number |
|---|---|---|
| **Project management** (assignees, due dates, notifications) | Founder boundary (§6.2). A1 Priya is the declared anti-persona. AI-for-project-planning is the second-most-refused task among developers: **69.2% say "don't plan to use AI for this"** `[fetched, §11.4]` | Nothing reverses it. This is a company-identity constraint, not a product one — say so publicly so nobody re-opens it quarterly |
| **Plugins / the eval lane** | Arbitrary client-side execution ends the corruption guarantee and turns every prompt injection into RCE on infrastructure holding customer documents *and* provider keys (§6.2, §9.2) | Reversed only by a capability model with no filesystem, no network and no `eval`, plus a published audit. Cost is a quarter of two founders' time. Not before 1,000 paying users |
| **Live cursors / real-time multiplayer** | Costs a CRDT layer that fights byte-preserving splices head-on; CRDT sync is settled out (§16.4). HackMD and Docmost lead with it, which is a positioning fact, not a demand fact | Reversed if **≥3 of the first 20 paying teams cancel citing presence by name** in the churn reason field (§16.4 falsification) |
| **A chat sidebar** | It duplicates the agent the user already has open, and it is the surface that trains users to ask *the app* instead of pointing verbs at *the file*. P4's whole pain is that her agent and her editor disagree about who owns the bytes | Reversed if the kickoff-prompt loop measurably fails: **<20% strong acceptance across all verbs at 90 days** (§11.5 kill rule). Then the paste step was the problem, not the model |
| **Template galleries** | §17 records that templates are the single strongest onboarding lever we have two independent sources for — and that is templates *in the vault*, not a gallery. A gallery is a second store (G2), a browse UI (G3) and a curation job (G5) | Reversed by a `U` reading where "where do I get templates" is a top-3 support string for two quarters. Even then the answer is a git repo, not a gallery |
| **Dashboards** | A dashboard is a view with no file behind it — the exact thing the projection law forbids. Every number worth showing already has a home: word count is Ambient, doc health opens only when non-green, the token meter is one line | Never as a screen. A dashboard *file* — a `.md` whose projection is a set of counters over the vault — is already legal today and needs no feature |
| **Anything with its own configuration surface** | S-4 and G5. The existing seven toggles are the ceiling; an eighth must displace one (§16.5). Typora needed **8 sub-settings** for attachment paths alone `[fetched]` — that is what a dial costs when you start with one | Reversed only by a default that is wrong for a *majority* cohort. A default wrong for a minority is a documented rule plus an escape hatch in the versioned settings **file**, never a UI control |

### 103.4 The surface budget

**Hard number: four top-level nouns in session one — file, folder, view, prompt.** Plus the standing counters V0 ≤ 9, D ≤ 2, S0 ≤ 6, P ≤ 2 (§18.2).

Four is one more than §18.2's C ≤ 3. The fourth noun is bought by this round's thesis and it is paid for in full: *vault*, *projection*, *certificate*, *graph*, *tag*, *template*, *workspace* and *space* are all now explicitly **not** first-session nouns. They exist; they are simply not introduced. "Prompt" earns the slot because it is the only noun in the list that the user brings with them — they already have Claude or Codex open.

**When the budget is exceeded, we do not debate. We demote, in three fixed stops:** Visible → Invoked (palette only) → a `.md` file in the vault → deleted below 1% `U`. Nothing skips a stop, and nothing is deleted from Visible in one move — which is what makes the rule survivable for the founder who loves the feature.

What is actually known, and its honest limits:

| Source | What it says | What it does **not** license |
|---|---|---|
| NN/g, *Progressive Disclosure* `[fetched 2026-08-31, HTTP 200]` | "designs that go beyond 2 disclosure levels typically have low usability because users often get lost… If you have so many features that you need 3 or more levels, consider simplifying your design." Also: "it's rarely a good idea to offer multiple ways to progress to secondary options" | A number for *concepts*. It bounds depth, not breadth |
| Thompson, Hamilton & Rust, "Feature Fatigue", *JMR* 42(4), Nov 2005, DOI `10.1509/jmkr.2005.42.4.431`, cited 535× `[fetched — Crossref metadata and abstract only; the paper is paywalled and was not opened]` | Consumers "give more weight to capability and less weight to usability before use than after use", so choosing the feature count that maximises *initial choice* includes too many features and "potentially decreas[es] customer lifetime value"; "as the emphasis on future sales increases, the optimal number of features decreases" | A count. It gives us a *direction* — a subscription business should ship fewer features than a one-time-purchase business — which is precisely our shape |
| The Browser Company, *Letter to Arc members 2025*, 2025-05-26 `[fetched 2026-08-31, HTTP 200]` | "Only **5.52%** of DAUs use more than one Space regularly. Only **4.17%** use Live Folders… It's **0.4%** for one of our favorite features, Calendar Preview on Hover." And: "for most people, Arc was simply too different, with **too many new things to learn**, for too little reward" | Abandonment. These are adoption rates from a company explaining a strategic retreat — first-party, dated, and self-serving in a knowable direction |
| Note-taking abandonment | **Nothing.** §17 records that no published quantitative abandonment study for note apps was found, and the widely circulated Obsidian claim is refuted at source `[measured]` | Any churn percentage in any deck |

Two citation hazards worth writing down. "Hick's law" is routinely invoked to justify small menus; the DOI most often attached to it, `10.1037/h0056940`, resolves to **Hyman, "Stimulus information as a determinant of reaction time", *JEP* 45(3):188–196, 1953** `[fetched, Crossref]` — a choice-reaction-time result measured in milliseconds, which says nothing about whether a person adopts a feature. We will not cite it. And **four is a budget we chose, not a number the literature gives.** Stating that plainly is cheaper than being caught.

### 103.5 The "one more feature" failure mode

The mode is not "we shipped too many features". It is **each feature was individually justified, and the justification was made before use while the cost is paid after use** — which is exactly the asymmetry Thompson et al. model `[fetched]`.

| Product | What happened | The fair caveat |
|---|---|---|
| **Arc** | Its own team named the "novelty tax" and published the adoption numbers above; D1 retention was strong but "our metrics were more like a highly specialized professional tool (like a video editor) than a mass-market consumer product" `[fetched]` | Arc is not dead. The company redirected to Dia and continues to maintain Arc. This is a strategic retreat with unusually honest telemetry attached, not a tombstone — which is what makes it the most useful case here |
| **Google Wave** | Google's own shutdown post lists the wins — real-time media sharing, context-aware spellcheck, third-party robots — then: "despite these wins, and numerous loyal fans, Wave has not seen the user adoption we would have liked" `[fetched, official Google Blog, 2010-08-04, Urs Hölzle]` | Google blames **adoption**, not complexity. Using Wave as a bloat parable is an over-read of the primary source, and I am flagging it rather than borrowing the rhetorical force. What it does show cleanly: loyal fans are not adoption |
| **Evernote** | The canonical accretion story — Peek, Market, Work Chat layered onto a note app `[SS; §18.2's own source is a vendor blog, and I did not open a primary]` | Evernote still operates under Bending Spoons `[SS]`. Everything in this row is weaker evidence than the two rows above it and must not be quoted as fact |
| **Notion** *(counter-example)* | **44 block types on the basics page alone** `[derived, §18.2]` and it won the market | Both things are true and we record it unresolved. Notion's business is breadth; ours is a guarantee. A rule that would have refused Notion's roadmap is working as intended *for us*, and that is a claim about fit, not about their judgment |

### 103.6 What earns a place anyway

Six things. Each names a user and a frequency, because that is G1 and the rule applies to this list too.

1. **The splice writer and its refusal** — P4, dozens of times a day, every unattended agent run; it is the only claim in the product a customer can independently verify.
2. **Instant, exact-match-first search** — P1, every session; §17's retrieval finding says intended retrieval determines how people create and organise, so search is not a feature but the substrate of the ones above it.
3. **The four projections behind one entailed selector** — P2 and P3, weekly; the selector shows disabled-but-visible states, so the product teaches its own capability without a tour.
4. **The three-state save chip and the conflict inbox** — P1, rarely, and decisively; one silent corruption ends the relationship permanently, so the cheapest surface in the product guards the most expensive failure.
5. **The kickoff prompt** — P3 weekly `[inference]`, P4 daily; it is the whole thesis of this round compressed into one palette command with zero model calls and zero at-rest pixels.
6. **Trash, restore, and undo on 100% of mutating actions** — everyone, seldom; reversibility is non-negotiable when the file is the source of truth, and delete-with-no-undo is a churn cause we can eliminate outright.

Cut from an earlier draft of this list and named so nobody re-adds it silently: a "recent documents" rail (P? · unknown — the file switcher already does it), an onboarding checklist (fails §17's ban outright), and a per-verb AI settings pane (G5, automatic fail).

### 103.7 Recommendation, and the strongest case against it

**Recommendation: adopt the five gates and the four-noun budget as written, with the one-working-day deadlock clause, and put row 6 and row 7 of §103.2 into the v1 build plan on day one** — demote graph view to Invoked, and refuse the certificate panel while keeping the certificate. Doing the two painful ones first is what makes the rule credible in month three, when the argument is about something neither founder has yet imagined.

**The strongest argument against, stated properly.** G1 is the gate that does most of the rejecting, and G1 is powered by `U` — support requests and issue mentions — which §18.2 already declares is a *substitute* for usage data, because we ship no telemetry. So the most consequential gate in the system runs on the weakest instrument in the system, and it is biased in a knowable direction: it counts the users who complain, which over-weights P1 and P4 and systematically under-counts P2 and P3, the two personas who pay per seat. The two features most likely to be wrongly refused by this test are **team presence** and **mobile-first capture** — and those are exactly the two churn reasons §63.2 records for P2 and P3. A rule that quietly optimises for the personas who file GitHub issues is a rule that builds a beloved single-player tool with no revenue, which is Arc's shape with none of Arc's funding.

The mitigation is not to weaken the gates. It is to name the bias in the rule itself: **any refusal that rests on G1 alone, against P2 or P3, expires after two quarters and must be re-argued from churn reasons rather than from mention counts.** Row 5 (vault-wide replace) and row 9 (mobile) are already tagged that way.

**Falsification.** If, among the first 20 paying customers, more than two cancel citing a feature this section refused, the test is over-fitted to the founders' taste and G1's frequency thresholds must be re-derived from churn reasons before another refusal is issued. If the first 20 cancel citing complexity, `U` was right and we were still too slow to demote.
