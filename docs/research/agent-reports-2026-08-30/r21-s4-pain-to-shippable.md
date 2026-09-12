Reconcile verified (8th, unchanged): `~/.claude` HEAD `6e390828`, frontmatter HEAD `484f579`; all dirt pre-existing; session was read-only `curl`/`python3` into `$TMPDIR`.

---

**One line: the three pain reports rank the market's complaints, and the product's differentiator — a byte-exact engine that refuses rather than guesses — maps onto almost none of the top ones. In 2,052 Reddit posts and 1,147 HN comments I pulled specifically to find it, complaints about an editor or agent mangling a file's bytes number 0 and 13 respectively, and none of the 13 are about a markdown editor. The engine is real and it is invisible. The only place it converts into a feature someone would switch for is the one job in the corpus that is deterministic, verifiable, and currently unserved: compiling and *checking* the rules files, not generating more documents.**

---

**New measurements this round adds (the prior three did not cover these)**

| What | Result | Denominator | Tag |
|---|---|---|---|
| Reddit posts complaining a tool reformatted/mangled/reflowed their file | **0** | 2,052 posts, r/ClaudeAI + r/cursor + r/ChatGPTCoding, 2025-09→2026-08, arctic-shift | [measured] |
| Reddit posts about an edit failing to apply (`old_string`, "string to replace", "edit failed") | **3 (0.1%)** | same 2,052 | [measured] |
| HN comments literally containing mangled/reformatted/reflowed/clobbered | 13 (1.1%) | 1,147 comments pulled on 9 editor/edit-failure queries, ≥2025-01-01 | [measured] |
| …of those 13, about a **markdown editor** damaging a file | **0** | 13 | [measured] |
| `String to replace not found` anywhere in anthropics/claude-code | 70 | 88,108 issues | [measured] |
| `file has been modified` (agent-vs-human write collision) | 157 (0.18%) | 88,108 | [measured] |
| `markdown` / `trailing newline` / `whitespace` / `encoding` in issue titles | 324 / 66 / 76 / 94 | 88,108 | [measured] |
| Reddit: cost & rate-limit complaints | **68 (3.3%) — the largest single family I measured** | 2,052 | [measured] |
| Reddit: context/compaction | 37 (1.8%) | 2,052 | [measured] |
| Reddit: rules-file fragmentation | 11 (0.5%) | 2,052 | [measured] |
| GitHub repos named/described as agent context-handoff | **326**, top at **3,932 stars** (`parcadei/Continuous-Claude-v3`) | search API, 2026-08-31 | [measured] |
| Broader agent-memory category, free and permissive | 34,516 (`volcengine/OpenViking`, AGPL) · 26,366 (haystack, Apache) · 20,260 (`mksglu/context-mode`) · 1,954 (`cortexkit/magic-context`, MIT) | 2,970 repos | [measured] |

The last row is the commercial fact the three reports gestured at but did not price: **the crowded Show HN graveyard sits underneath four free, permissively licensed incumbents with 83,000 stars between them.** ₹299/month competes with MIT.

---

**THE CENTRAL TABLE**

Size is founder-weeks for a two-person team. "Engine?" means: does byte-preserving, refuse-rather-than-guess editing do actual work here, or would a naive writer be equally good?

| Pain | How often (denominator) | Can we solve it? | What we would ship | Size | Engine? | Noticed in 1 session? |
|---|---|---|---|---|---|---|
| **Rules-file fragmentation** — same knowledge in N tool files that diverge | 177/1,827 HN rules-file comments (9.7%) — most-discussed topic, 4× staleness · 67/224 repos (30%) carry two substantive divergent files · 11/2,052 Reddit | **Solve** | One source → byte-exact projection into CLAUDE.md / AGENTS.md / .cursor/rules / copilot-instructions, plus a divergence report | 3–4 wk | **Yes** — four hand-edited files cannot survive a reformatting writer | **Yes** — it names files you didn't know disagreed |
| **Dead references inside rules files** | 230/1,317 backticked path citations dead (17.5%); 45% of 243 repos have ≥1 | **Solve** | Resolve every path/command/symbol against HEAD; refuse to emit a file citing something absent | 1–2 wk | Partly — the check doesn't, the *repair* does | **Yes** — a number on first run |
| **Silent failure** — unresolvable `@import`, unloaded file, no warning | claude-code #88813, #90572 · A-class 47/857 (5.5%) | **Solve** | Lint: resolve every import, report what will actually be in context | 1 wk | No | **Yes** |
| **Human-and-agent writing the same file** | 157/88,108 (0.18%) "file has been modified" | **Solve** | Splice journal + CAS: editor open while agent writes, no lost update, no reformat | 2–3 wk | **Yes** — the engine's literal job | Only when it bites |
| Context fills / compaction destroys the thread | 1,227/42,175 (2.91%), 40.4% of pain corpus · 4,150/88,108 titles (4.71%) · 37/2,052 Reddit | **Partial, low confidence** | "What changed since your last session" — a diff-scoped brief, not a document | 2 wk | No (git does the diff) | Yes |
| Handover / re-explaining every session | 198/42,175 (0.47%), flat ±0% across 18 months · 22/2,052 Reddit | **Partial, commoditised** | Nothing new — 326 repos, one at 3,932 stars, free | — | No | Yes, and so does the free one |
| Rules loaded but **not obeyed** | 292/857 CLAUDE.md issues (34.1%), 6.2:1 over never-loaded · HANDBOOK best model 36.2%/824 criteria | **Cannot touch** | — | — | — | — |
| Slop / unmaintainable output | 720/42,175 (1.71%), 23.7% of pain, **+149%** and rising fastest | **Cannot touch** | — | — | — | — |
| Cost / rate limits | 285/42,175 (0.68%) HN · **68/2,052 (3.3%) Reddit, largest family** | **Cannot touch** (a pack *adds* tokens) | — | — | — | — |
| Lost / destroyed work | 214/42,175 (0.51%); first-hand ~0.05% of N · but 101 HN stories, 5,023 points | **Partial — markdown only** | Nothing beyond CAS above; the destruction is in code, DBs, git | — | Yes, in scope | No |
| Non-determinism | 143/42,175 (0.34%) | **Partial — documents only** | Same generation → same bytes, provable | in above | **Yes** | No |
| Hallucination | 315 (0.75%), **−67%** into 26H2, 0/88,108 titles | **Cannot touch, and shrinking** | — | — | — | — |
| Loses the plot mid-session | 195 (0.46%), **−36%** | **Cannot touch** | — | — | — | — |
| Over-eager / wrong-file edits | 60 + 20 (0.19%), **−42% / −30%** | **Cannot touch** | — | — | — | — |
| Verification burden | 28/42,175 (0.07%) · 1/2,052 Reddit | **Cannot touch** | — | — | — | — |
| ADR / decision records not written | 30/33,647 Reddit posts (0.089%) · 59% of repos add zero after day 30 · 23 HN mentions all-time | **Solvable, should not be** | — | — | — | — |

---

**THE SHIPPABLE LIST — ranked by pain relieved per unit of build**

1. **The rules-file linter (1–2 weeks).** Who: the solo developer or tech lead who maintains an AGENTS.md — 348/1,000 top repos have one. How often: every commit that touches the rules file, plus once loudly on install. Reports dead paths, unresolvable imports, divergence between sibling files. A pure function of the repo — zero AI tokens, which matters at a very small AI budget selling ₹299 globally.

2. **The projection compiler (3–4 weeks).** Who: the same person, the moment their team adds a second agent tool. How often: every time they edit the rules. One source of truth, byte-exact fan-out to four destinations, divergence report as the before-picture. The only item that structurally requires the engine.

3. **Concurrent-write safety (2–3 weeks).** Who: anyone who leaves the document open while an agent works — the product's own core loop. How often: silently, continuously. 157 issues say the collision is real; nobody will buy for it, but the product cannot ship without it.

4. **The session diff-brief (2 weeks).** Who: the returning solo developer, daily. Not "here is your context pack" but "here are the 9 files that changed since you last worked, and the 3 assertions in your rules file that are no longer true." The handover reframed as a *delta* — the only version not already free.

5. **Everything else — cut.** Generated decision records, specs, flows: the two things this product proposed to author are the two rarest sections in the corpus (decisions 10.9%, handoff 4.8% of 312 AGENTS.md files), the ADR log dies at day 30 in 59% of repos, and the only empirical study of these files finds LLM-generated ones **net negative**. I cannot name a person who opens a generated decision record twice.

---

**WHAT WE SHOULD NOT BUILD, EVEN THOUGH WE COULD**

- **A context/handover pack as the headline product.** 326 repos, 89–373 Show HN launches at a median of 2 points, a 3,932-star free incumbent, 34.5k/26k/20k-star free infrastructure above it. Durable pain (flat ±0% for 18 months), infinite free supply.
- **A decision-record generator.** 24.5-day median lifespan, 32% of *live* repos have a newest record over a year old, and the 2026 revival is a Claude subagent emitting 247 records in one day. On the wrong side of the AGENTS.md finding and of the 6.7:1 negative sentiment on AI-and-documents.
- **Anything aimed at hallucination, mid-session incoherence, over-eager edits, or wrong-file edits.** All four falling (−67%, −36%, −42%, −30%) without us. A year of building lands into a shrinking problem.
- **A slop detector or review assistant.** Fastest-growing complaint, 23.7% of all pain — and it needs to compile, test, and run code. We are a markdown editor. Wanting the biggest problem is not the same as being able to take it.
- **Marketing the byte-exact engine.** 0/2,052 and 0/13. Build it; do not put it on the landing page. Nobody is shopping for it.

---

**THE ONE FEATURE**

**A rules-file compiler with a refusal gate: one source, projected byte-exactly into every agent's file, where every path, command, and symbol it cites is resolved against the repo at HEAD — and the compiler refuses to emit a file that references something that does not exist.**

1. **Targets the most-discussed complaint in the rules-file corpus.** 177/1,827 (9.7%) across 119 distinct stories, ~4× staleness talk and ~4× handoff talk. Every other candidate targets something smaller or something falling.
2. **Produces a falsifiable number in under a minute.** Expected first-run finding is non-zero: 17.5% of path citations dead, 45% of repos with citations have ≥1. "Your AGENTS.md tells the agent to run a script you deleted in March" is a demo that closes; "here is a nicely formatted context pack" is 89 Show HNs at 2 points.
3. **Deterministic.** No model call, no per-user inference cost, no hallucination surface — the only shape two founders with a very small budget can sell globally at ₹299 without inverting the unit economics.
4. **Genuinely needs the engine.** Round-tripping four independently hand-edited files through a generator that reflows, renumbers, or normalises destroys the hand edits, and the user notices immediately. Byte-preservation is what makes the projection safe enough to run on every commit.
5. **Nobody in the 326 repos does it.** They all *generate* context; none *verify* it. The category's entire supply sits on the authorship side of a problem whose measured failure is on the correctness-and-delivery side — 333/857 (38.9%) delivery-or-adherence failures against essentially zero complaints that the prose was hard to write.

---

**THE HONEST GAP**

**Adherence.** The largest gap, and it sits directly under the product thesis. Loaded-but-ignored outnumbers never-loaded 6.2 to 1 (292 vs 47 of 857). The HANDBOOK benchmark grades a frontier model against 824 deterministic criteria with an expert-written standing policy in context: the best evaluated model passes **36.2%**, most stay under 25%. We can guarantee a document is correct, byte-exact, delivered, and free of dead references. We cannot make the model obey it. Any copy saying "so your agent follows your rules" is unsupportable and will be refuted in week one.

**Slop.** 23.7% of the pain corpus and **+149%** over eighteen months — the fastest-growing complaint anywhere in the data, and the one everything else is downstream of. It requires reading, running, and judging code. We do not touch it.

**Cost.** The largest family in my own Reddit measurement, 68/2,052 (3.3%), rising +108% on HN. Our product makes it marginally *worse* by adding tokens per session. One counter-signal — r/cursor 1qqcq3j, 71 points: "Persistent Architectural Memory cut our Token costs by ~55%" — title only, number unverified [SS].

---

**WHAT THIS MEANS FOR THE PRODUCT**

- **Reshape the headline from "generates the artefacts" to "verifies the artefacts you already have."** Authorship is not the constraint (nobody says the prose was hard); correctness is (17.5% dead citations, 38.9% delivery-or-adherence failures, silent import failure with no warning). Ship the linter first — smallest build, largest measured audience.
- **Build the byte-exact engine, do not sell it.** It is the enabling condition for the projection compiler and concurrent editing, and it is not a value proposition anyone is shopping for.
- **Kill the decision-record and spec generators.** 0.089% of 33,647 posts, 59% abandonment after 30 days, 23 all-time HN mentions, and a published study saying LLM-generated context files are net negative.
- **Do not lead with the context pack.** 326 repos, a 3,932-star free incumbent, 83,000 stars of free infrastructure above it, median Show HN score of 2. If it ships, it ships as a delta, not a document.
- **Write the adherence limit into the marketing, not just the docs.** 36.2% is the ceiling on anything that works by putting text in a context window.
- **Before any of this, measure the token claim.** If a scoped, verified rules file measurably cuts spend, that speaks to the largest complaint family I measured — the only bridge this product has to a pain it otherwise cannot touch.
