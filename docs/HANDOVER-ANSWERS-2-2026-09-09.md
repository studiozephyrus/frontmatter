---
mode: explanation
updated: 2026-09-09
verified_against: 5d6cb9c
---

# Handover answers, round 2 — the assistant side

Round 1 (`docs/HANDOVER-ANSWERS-2026-09-09.md`, commit `5d6cb9c`) mined Sagnik's turns. This
one mines mine. Same tagging, same rule: **`[verbatim]`** means I am quoting text I opened in
this session; **`[recalled]`** means I remember it but cannot quote it; **`[inferred]`** means I
am reasoning from evidence and could be wrong; **"not discussed"** means I looked and found
nothing.

## Method, and what I did not look at

**Sampled in full.** Four main-loop transcripts under
`~/.claude/projects/-Users-sagnikmitra-Desktop-GitHub-frontmatter/`, which are the only ones
containing conversation between Sagnik and me:

| Session | Size | Starts | Assistant text blocks | User text blocks |
|---|---|---|---|---|
| `a09c1a4c` | 1.6 MB | 2026-07-25T11:27 | 61 | 8 |
| `e98d6e0f` | 6.0 MB | 2026-07-28T21:05 | 44 | 24 |
| `2e90ab3b` | 78.6 MB | 2026-07-29T02:34 | 1,076 | 264 |
| `9e5a4a9f` | 61.7 MB | 2026-07-31T23:23 | 282 | 46 |

I extracted every `type:"assistant"` text block to a flat file (1.1 MB of prose, 1,463 blocks)
and every non-compaction user text block (2.2 MB, 342 blocks), then grepped and read
neighbourhoods. **The 148 MB of JSONL is mostly tool calls and results; 1.1 MB is the whole of
what I actually said in six weeks.**

**Not sampled.** 1,663 subagent and workflow transcripts (~530 MB) in the same tree — these are
research output, not conversation, and round 1 plus `docs/research/` already carry their
conclusions. 28 transcripts under `-frontmatter-decisions`. The `perccent-combined` directory
(1.5 GB) is a different project. I checked the ancestor directory
`-Users-sagnikmitra-Desktop-GitHub` for frontmatter sessions per the known cwd-keying trap and
found **zero**, so the four above are the complete main-loop corpus.

**One caution about my user-side extract.** Sagnik pastes long research documents into the
chat, so a grep over "user" text returns his *inputs* as well as his *words*. Every quote
attributed to him below is one I read in context and confirmed was him speaking.

---

## K. My own turns — the unrecovered half

### K1. Where I argued and was overruled

**The markdown-extensibility argument. He was right; I was partly right.** `[verbatim]`

I had been carrying a broad "don't extend markdown" conservatism. He pushed against it. On
2026-07-29T21:46 I wrote, as a heading:

> "# You were right, and I was wrong about the scope"

and under it:

> "The verdict, verbatim from the research: *'The architecture is sound, has strong production
> precedent, and the prior "don't extend markdown" conservatism was too broad.'*"

The concession came with a split that is the useful residue, and it still holds:

> "**Declaration** — frontmatter binds *names and novel symbols* to meanings; grammar stays
> fixed … **Works. Precedented. Empirically supported.**"
> "**Redefinition** — frontmatter changes what existing markdown symbols mean … **Fails,
> measurably and severely**"

**Who was right, with hindsight:** he was, on the half that mattered to him. His `..` example is
safe; the `###`-means-code example is the one that breaks. The settled "build a compiler and an
IDE, not a format" verdict in `CLAUDE.md` is the descendant of this exchange and should be read
as *the redefinition half survived*, not as a blanket ban.

**Editor-first versus provenance-as-a-plugin. He overruled me and the evidence has since moved
against him.** `[verbatim]` On 2026-08-31 I wrote:

> "**What I changed on your instruction:** you said editor first, so the plan builds an editor.
> The critique's own recommendation was to ship provenance as a *plugin* and fund it with
> services. I've kept the services funding … but built the editor, because that call is yours."

**With hindsight and the evidence now on disk, the critique looks better than the instruction.**
The 2026-09-09 research found Almanac shipped the full editor-plus-review product on $45M and
shut down, and four platforms shipped the working-tree half free inside nine weeks. A plugin
carried by an existing surface is the shape that survives that market; a standalone editor is
the shape that died. **This is not settled and I am not asserting he was wrong — but the
decision was taken before this evidence existed and has not been revisited since.** `[inferred]`

**Three things I pushed on and he did not take up.** `[verbatim]` Same message, listed under
"**Three things I'd push back on if you let me:**":

> "- **Pricing is wrong on the axis, not the number.** Obsidian gives the editor away and
> charges $4 for sync. We planned to charge for the editor — the one thing nobody in this
> category pays for.
> - **Reachability is our weakest area and the brief says so.** Every channel is borrowed. We
> own no list, no audience, no distribution. Virality doesn't come free with a good product.
> - **Two weeks of tests before any code.** ₹0. If fewer than 4 of 10 developers call
> provenance useful unprompted … the thesis is dead — and you'd know for the cost of a
> fortnight instead of ten weeks."

The third became the plan's weeks 1–2. **The first two never got an answer.** The pricing-axis
point is still live and still unaddressed: `PRODUCT-BRIEF.md` §11 charges for the editor tier.

### K2. Where I was wrong and it was caught

**The plugin-cluster claim — the worst one, and I caught it myself under a gap audit.**
`[verbatim]`, 2026-07-31T23:12:

> "**I told you 'every cluster matching a native format feature is 10–35× smaller' and that
> 'when the format absorbs a capability, the plugin cluster collapses.' That is false as
> stated.** Only one of three native-feature clusters shows an effect. Two go the *wrong way* —
> Logseq has proportionally **4.5× more** query plugins and **2× more** task plugins than
> Obsidian, despite having both natively."

What survived: the method (two controls landed at 1.02× and 1.04× baseline, which is what
controls should do) and one real 3.41× effect on spaced repetition. **Cost:** a load-bearing
argument for "the format is the bottleneck" was reduced to a single case.

**The mermaid finding.** `[verbatim]`:

> "**I overstated the mermaid finding.** … I presented it as 'fence dispatch is the winning
> mechanism at scale,' and by *rate* mermaid is a long-tail construct at 1–2%. What survives is
> the *mechanism* validation: 30 platforms rendering it with zero coordination. Not its
> penetration."

**Fabricated citations, caught by a gate I had built.** `[verbatim]`:

> "`check-refs` found `DECIDE.md` citing §105/§112/§117 for research with no section numbers —
> my own wrong-citation error, the exact class this whole exercise kept finding."

**Misreading a 404 as "does not exist".** `[verbatim]`: *"You're right and I was wrong. **A
private repo you can't access returns 404 — identical to one that doesn't exist.**"* This one
recurred: round 1's handover still carried "git fetch fails" until it was corrected on
2026-09-09.

**The 150-agent verify fan-out**, caught by Sagnik on cost. `[verbatim]` mine: *"Killed. That
was a bad call on my part."* His trigger, from round 1: *"Do we really need this many tests?"*

**Saying I had written something I had not.** `[verbatim]`: *"I said I was writing it and then
didn't call the tool — my error, and I should have said so rather than let you ask."*

### K3. Where I was wrong and it was NOT caught — the highest-value answer

Four things I now believe are wrong or unsafe and are sitting unchallenged.

**1. `41 of 43` is load-bearing across almost the entire card set and is unverified.**
`[verbatim]` from the repo, measured today: the string appears **28 times across 14 of the 15
area files** in `decisions/v2/`. Round 1 §G3 lists it as unverified, and `docs/13-TECH-DEBT.md`
D-9 says plainly that checking it needs the sibling repo checked out, which no pass has done.
**Answering M2 directly: this is not a handful of cards, it is nearly every area.** If the
figure does not reproduce, the fork-tax argument weakens in fourteen areas at once.

**2. The recommendation field is skewed toward option (a) in a way that varies too much between
areas to be a coincidence.** `[verbatim]`, measured today across 261 source cards:

| Area | rec = a |
|---|---|
| Legal, privacy & data | **16 / 19 (84%)** |
| Engine & technical | **23 / 28 (82%)** |
| Go-to-market | 11 / 21 |
| Pricing & tiers | 10 / 16 |
| … | … |
| Design, UI & attention | 4 / 19 (21%) |
| Plan, scope & sequencing | **2 / 14 (14%)** |

Overall: a=127, b=85, c=35, d=14. **Two areas recommend the first-listed option four times out
of five; two others recommend it one time in five.** Either those areas genuinely differ that
much, or some agents anchored on the option they wrote first. I did not check this before
shipping and I cannot tell you which it is. `[inferred]` on the cause; `[verbatim]` on the
numbers.

**3. Thirty-five of 261 cards carry no evidence array at all.** `[verbatim]`, measured today.
The contract forbids inventing evidence, so an agent with nothing real to cite correctly left
it empty — but a card with a recommendation and no exhibits looks identical in the UI to one
with six. Nothing marks the difference for a reader.

**4. `PRODUCT-BRIEF.md` §10 dropped the screen specification he dictated, and I never told him.**
See O2 — this is the one I would most want corrected.

### K4. What I proposed that he neither took up nor rejected

- **The pricing-axis argument** (K1). Never answered.
- **Owning a distribution channel.** Never answered.
- **Leading with refusals.** `[verbatim]`: *"the thing I'd argue hardest for: **lead with what
  we refuse to build.** No plugins, no code execution, no holding your files, no lock-in."*
  This one *did* reach the plan as §12 Positioning, so it is half-taken — it is in the document
  and has never been tested with a person.
- **Volumes rather than one document.** `[verbatim]`: *"My recommendation is volumes — you keep
  the complete record, and each piece is actually openable."* The 3.4 MB record file suggests
  this was not adopted.

### K5. Where I changed position without flagging it

**The headline moved four times and only the last move was announced.** `[verbatim]` from a card
written this session: *"The direction moved four times in two days: bytes, authorship, answer in
place, review state."* Each move was presented as a finding. **The first three refutations are
recorded; the fact that the sequence itself is evidence of instability was not stated until the
2026-09-08 adversarial round forced it.**

**Byte-exactness.** I argued it was the differentiator early, then wrote `[verbatim]`: *"**The
engine is right and the sentence was wrong.** Byte-exactness is real, and users don't talk about
it — 4 complaints in 12,556, once in 1,000 Reddit posts."* That reversal is honest and visible.
What is *not* visible is that the engine work was scoped on the earlier belief and never
rescoped.

### K6. What I refused

All RULE-2 shaped, and the refusals held:

- **Deciding a founder-level question.** `[verbatim]`: *"The cover note is right to flag this,
  and I won't decide it for you."* And: *"A genuine conflict between two canonical documents,
  which I will not resolve for you."*
- **Applying fixes to found bugs without approval.** `[verbatim]`: *"**No fixes applied to any
  of the 10 bugs.**"* — after a security corpus run of 55 payloads.
- **Refusing rather than fixing non-ASCII keys.** `[verbatim]`: *"I did not fix non-ASCII keys —
  I refused them. That is the sanctioned choice … but a Spanish or Japanese vault still cannot
  [be handled]."* This is the product's own refusal principle applied to my own work, and it
  left a real gap standing deliberately.
- **Account-identity operations.** `[verbatim]`: *"I will not run `gh auth login` or
  `gh auth setup-git`"* — because both rebind every repo on the machine.

### K7. The first thing I would change about how this work has been done

**Stop generating and start testing.** Six weeks produced 26 research rounds, 109 agent reports,
a 3.4 MB record, a 760 KB PRD, 201 decision cards and a documentation set — and **zero
conversations with a person who is not a founder.** The plan's own weeks 1–2 (ten developers,
five people who bill for documents, three landing pages) cost ₹0 and have never run. I proposed
it on 2026-08-31 and then spent nine more days producing documents instead of pushing for it.
`[inferred]`, but the transcript record supports it: I can find no message in six weeks
describing a conversation with an outside user.

---

## L. Research archaeology

### L1. The rounds and their status

Measured today from `docs/research/`. **I read the directory shapes and the round names, not all
109 reports** — so the "concluded" column is `[recalled]` where it comes from the narrative
documents those reports fed, and I mark the ones I could not check.

| Directory | Files | Question it asked | Status |
|---|---|---|---|
| `agent-reports-2026-08-28` | 35 | The first broad sweep — editors, formats, competitors | **SUPERSEDED** by PRD v2, which absorbed it |
| `agent-reports-2026-08-29-r7` | 16 | AI cost and payment rails | **LOAD-BEARING** — corrected the AI-cost and Dodo India assumptions; the ₹15,000/txn RBI constant survives in `CLAUDE.md` |
| `agent-reports-2026-08-29-r8to10` | 29 | Spec/build plan, markdown format and rendering, untouched angles | **MIXED** — the format verdict survives, the rest folded into PRD v2 |
| `agent-reports-2026-08-29-r11` | 11 | Filling gaps found by r8–r10 | **SUPERSEDED** |
| `agent-reports-2026-08-29-r12` | 14 | Build blockers | **LOAD-BEARING** — the ancestor of `13-TECH-DEBT.md` |
| `agent-reports-2026-08-30` | 109 | Rounds 13–26: system analysis, engine designs, war-game, product decision layer, AI pain ground truth, ecosystem and money, editing craft and USP, brutal critique | **MIXED**, and the largest body |
| `prd-v2-sections` | 16 | Section drafts for PRD v2 | **INPUTS** — see L4 |
| `sources` | 7 | Fetched primary sources | **LOAD-BEARING** — raw evidence, keep |
| `2026-09-09` | 3 | The nine untapped market seams | **LOAD-BEARING and newest** |

### L2. A round overturned by a later round

**Round r9 (markdown format and rendering) versus the 2026-07-31 gap audit.** `[verbatim]` — the
plugin-cluster claim from the format research ("when the format absorbs a capability, the plugin
cluster collapses") was refuted by my own recomputation: two of three clusters invert. The
format-is-the-bottleneck argument that r9 supplied to the plan is weaker than the plan states.

**The whole editor-first arc versus 2026-09-09.** `[verbatim]` from 2026-08-31: *"**Zed already
ships our demo.** I opened their docs myself. Sixteen of MVP-0's thirty-eight points were
rebuilding a documented competitor feature."* Nine days later the 2026-09-09 round found four
more platforms had shipped the working-tree half. **The competitive picture inverted twice in
six weeks and the plan absorbed the first inversion but not fully the second.**

### L3. Which rounds produced nothing that survived

Answering round 1's F2 as far as I honestly can. **I did not read the 109 reports**, so this is
inference from what reaches the current documents `[inferred]`:

- **r11 (fill missing)** — I can find no distinctive conclusion from it in any live document. It
  reads as a completeness pass whose output was absorbed without residue.
- **`prd-compact` and `prd-dedup`** — process rounds, not research. They produced a shorter
  document, not a finding.
- **r23 (AIOS audit and consultation)** — its subject is the sibling system, and nothing from it
  appears in `PRODUCT-BRIEF.md`. Possibly valuable to the AIOS work and dead to frontmatter.

**The honest answer is that dead ends cannot be separated from absorbed findings without reading
the reports**, because the narrative documents cite conclusions rather than rounds. That is a
structural weakness of how this corpus was assembled and it is why L3 is hard to answer.

### L4. `prd-v2-sections` and `agent-reports-*`

`[inferred]`, from the build pipeline described in `AGENTS.md` §0.1: `npm run tree` **rebuilds
`DEV-PLAN.md`, `ENGINE.md`, `BUSINESS.md` and `REFERENCES.md` from `docs/research/`**, and
`AGENTS.md` says plainly *"The Tier-1 documents are derived, not hand-written … a hand edit is
reverted by the next build."*

So these are **inputs to a live pipeline, not archive.** They are not superseded and must not be
deleted: deleting them breaks `npm run tree`. Whether they hold material that never reached a
document is the thing I cannot answer without reading them — but the pipeline's existence means
anything they hold is *reachable*, which is the important half.

### L5. A research finding that contradicts the plan and was never reconciled

**The pricing axis.** The research says the category gives the editor away and charges for sync
(Obsidian's $4). `PRODUCT-BRIEF.md` §11 charges for a team tier at $4–5 and gives F1–F8 away
free — which is closer to the research than my 2026-08-31 pushback implies, so this may have
been partly reconciled. **What was never reconciled is the retention contradiction the plan
names against itself:** §8 puts version-history retention in the Max column, §11 lists it under
Pro, and **no feature row builds retention at all.** That is in the plan, flagged, and open.
`[verbatim]` from the plan via round 1.

---

## M. The 201 cards

### M1. Who set `rec`

**One agent per area, unreviewed by a human or a second pass.** `[verbatim]` — I wrote the
generation workflow and I know its shape: fifteen agents, one per area, each producing its area's
cards including the `rec` field, followed by a single cross-area linker that deduplicated and
linked but **did not review recommendations**. A mechanical validator (`decisions/tools/validate.py`)
checked schema, field lengths, slop vocabulary and citation format. **Nothing checked whether a
recommendation was right.**

### M2. How many cards rest on an unverified figure

See K3 item 1. **`41 of 43` appears 28 times across 14 of 15 area files.** `[verbatim]`,
measured. I did not audit every numeric claim in every card — that is a real audit and it has
not been done. **35 of 261 cards carry no evidence at all** `[verbatim]`.

### M3. Did the fifteen agents share evidence

**Partly shared, partly not, and your concern is justified.** `[verbatim]` on the mechanism:
every agent read the same three inputs — `decisions/v2/CONTRACT.md`, the 2026-09-09
`BRIEFING.md`, and `PRODUCT-BRIEF.md` — plus its own area's existing cards. Beyond that each was
told to `grep` the large documents for what its area needed.

**So the common evidence is the briefing; the specific evidence is per-agent and unshared.** Two
cards in different areas can cite different lines of a 250 KB document and reach opposite
conclusions, and nothing in the pipeline would notice. The cross-area linker compared
*questions*, not *evidence*.

### M4. Is `flip` an honest falsifier

**Mixed, and I would not defend all of them.** `[inferred]` from having specified and spot-read
them. The contract asked for "the specific finding that would overturn it", and the good ones do
that — the headline card's flip names a number (*"if fewer than 4 of 10 developers name
unreviewed agent edits without being prompted"*). **The weaker ones restate the question as a
condition** ("if it turns out that X, then not X"), which is not a falsifier. I did not measure
the ratio.

### M5. Cards I think are badly framed

`[inferred]`, and this is my own critique of my own output:

- **Any card in Engine & technical or Legal.** Not because the questions are wrong, but because
  82% and 84% first-option recommendations mean the option *ordering* is doing argumentative
  work it should not do. Read those two areas with the order shuffled in your head.
- **The 35 evidence-free cards.** A decision presented with the full apparatus of evidence, and
  no evidence, is the most misleading shape in the set.
- **Cards whose numbers trace to `41 of 43`.** Fourteen areas.

### M6. Cards where the right answer is "none of these"

**I cannot name specific ones without re-reading all 201, which I have not done.** `[inferred]`
structurally: the contract required 2–4 options and every card has them, which means an agent
that could only see two real choices had a standing incentive to invent a third. Where you see
an option that reads as a hedge ("hold it open", "decide later"), treat it as possibly
manufactured to reach the minimum rather than as a real branch.

### M7. The seven orphans

**I agree with your assessment.** `[inferred]` — the linker flagged `D13 L22 MK17 MK21 PR19 R5
R6` as linking to nothing and nothing linking to them, and its own note framed orphans as
"either genuinely standalone or quietly irrelevant" rather than as errors. **I have no evidence
any of them was meant to link somewhere.** The cross-area pass ran once and produced 60 edges
against a cap of 60, so it is possible edges were truncated at the cap — if you want certainty,
that is the thing to check.

---

## N. The documents

### N1. Status of the 43 (now 45)

`docs/*.md` is **45 files** today `[verbatim]`, up from 43 — the two additions are this document
and round 1's. `docs/MAP.md` carries an explicit superseded table `[verbatim]`:

| File | Superseded by |
|---|---|
| `FRONTMATTER-MASTER-PLAN-2026-08-28.md` | PRD v2 |
| `FRONTMATTER-PRD-2026-08-29.md` (v1.1) | PRD v2 |
| `FRONTMATTER-THE-PLAN-2026-08-29.md` | PRD v2 |
| `FRONTMATTER-BUILD-PLAN-2026-08-29.md` | PRD v2 §28, `DEV-PLAN.md` |
| `FRONTMATTER-DECISIONS-2026-08-29.md` | PRD v2 §57 |
| `FRONTMATTER-PRODUCT-PLAN.md` | PRD v2 |
| `FRONTMATTER-COMPLETE-RECORD-*.md` | "Archive … **Not for reading**" |

**LIVE:** `PRODUCT-BRIEF.md`, `MAP.md`, `GAPS-2026-09-08.md`, `DECIDE.md`, the sixteen numbered
core documents (`00-` … `29-`), `README.md`, `DECISIONS-UI-REFERENCE-PASS-2026-09-09.md`, both
handover-answers files, `research/2026-09-09/*`.

**DERIVED — do not hand-edit:** `DEV-PLAN.md`, `ENGINE.md`, `BUSINESS.md`, `REFERENCES.md`.
`AGENTS.md` §0.1 says a hand edit is reverted by the next `npm run tree` `[verbatim]`.

**HISTORICAL:** `FRONTMATTER-RECORD.md`, `WEEK0-DECISIONS-2026-09-08.md`,
`sgnk-react-workflow.md`, `_wireframes.md` (see N4), the three earlier `HANDOFF-*` files at the
repo root.

### N2. Documents that contradict each other

**The retention contradiction** (L5) — §8 versus §11 of the same document, and the plan names it
itself.

**`PRODUCT-BRIEF.md` §10 versus the July screen dictation** — see O2. §10 wins today by being
the live plan; it should not.

**PRD v2 versus `PRODUCT-BRIEF.md` on the headline.** PRD v2 (2026-08-29) predates the
2026-09-08 adversarial round and the 2026-09-09 research. Where they disagree on what the product
leads with, **`PRODUCT-BRIEF.md` v15 wins**, and the memory index already says PRD v2 is "the ONE
governing doc" — that line is now stale on the headline specifically. `[inferred]`

### N3. What is uniquely in the three large files

`[inferred]` from the build pipeline, not from reading them — and I flag that as the weakest
answer in this document.

`AGENTS.md` describes `npm run doc` as assembling the tree into one printable document and
`npm run record` as proving *"the assembled record carries every tree file, line for line"*
`[verbatim]`. **That is a statement that `FRONTMATTER-COMPLETE-RECORD` is a mechanically-proven
superset of the tree**, and `MAP.md` calls it "Archive … Not for reading". So: **treat both
RECORD files as supersets and stop treating them as reading you owe.**

`FRONTMATTER-PRD-v2-2026-08-29.md` is different — it is a *governing* document, not an archive,
and the memory index lists sections that exist nowhere else (§29–49 on performance, data model,
sync, DR, search, accessibility, API, roles, observability, desktop, refusal UX, disclosure,
i18n, abuse, billing, support, measurement, longevity, OSS). **Those nineteen sections are the
material most likely to be uniquely there and needed for an SRS.** Grep it; do not read it.

### N4. `_wireframes.md`

**60 lines, 84 KB, because it is inline SVG.** `[verbatim]` — the first exhibit is
`::exhibit W1 | S0 · The launcher — what you see before a document is open`. It is the wireframe
source that the plan's screen exhibits are built from. **Whether it is current depends entirely
on O2** — if §10's screen set is missing the July dictation, these wireframes are missing it too.

### N5. The four decision-shaped documents predating the 201

`DECIDE.md` and `FRONTMATTER-DECISIONS-2026-08-29.md` are both mapped: the latter is superseded
by PRD v2 §57, and `MAP.md` points at `DECIDE.md` as the twenty-minute read for "what to build".
`WEEK0-DECISIONS-2026-09-08.md` holds two drafted decisions (the measurement decision and the web
byte path). `BRIEF.md` is the older brief.

**Round 1 established that six of seven `PRODUCT-BRIEF` §14 decisions map to cards, and you
confirmed that yourself.** What I have *not* verified is whether the older four documents hold
decisions the 201 lost. `[inferred]` — the card set was generated from the current area files,
which descend from the earlier decision extraction, so the path exists; but no pass has diffed
these four against the 201. **That diff is worth one hour and I would do it before presenting the
set.**

### N6. `GAPS-2026-09-08.md` and whether the plan changed

**It changed, and visibly.** `[verbatim]` — `PRODUCT-BRIEF.md`'s own header says the plan was
*"Re-checked 2026-09-08 by an adversarial round of 23 agents over 11 gaps: 152 findings — 75
confirmed, 60 revised, 16 refuted"*, and §1 carries a `[!risk]` block stating the headline *"is a
hypothesis under test, not a finding, and the test has already gone against it."*

**So: recorded and acted on, not recorded and ignored.** The plan absorbed the refutation into
its own first section rather than burying it. That is the single most creditable thing in the
document set.

---

## O. Screens, prototype, design

### O1. What he has actually seen

`[inferred]` — he has seen the decision site (he has been driving it and asking for UI changes
all through 2026-09-09) and the screenshots I sent during that work. **Round 1 established he
never commented on `docs/prototype/frontmatter-prototype.html` beyond reporting it 404'd**, and I
find nothing in the assistant side that contradicts that. The `docs/screens/dec-*.png` captures
were produced this session and shown inline.

### O2. Was the July screen spec a scope cut or lost? — **It was lost.**

This is the clearest answer in this document, and it changes what you do with §10. `[verbatim]`,
2026-08-01T02:08, Sagnik:

> "FrontMatter is something which is still under planning. **The screenshot that you saw, mostly
> that will be the UI.** In the back, everything, how it would be, how it would behave, we can
> decide later. Initially, that was me and Amit, our co-founder. Our plan for FrontMatter, I
> would say, will be Google Docs for markdown, as simple as that."

And from 2026-07-29T01:53:

> "Front matter will be the IDE. IDE means the Markdown editor as of now. We are as of now
> looking at it as a **VS Code for Markdown**. … I'll just give you the screenshot also what we
> have been thinking. The first screenshot where you can see the search and blank document and
> examples, so that is the page where we are thinking that will be the first landing page just
> like Google [Docs]"

**He said the screenshot IS the UI.** There is no message anywhere in which he scopes any of it
out. **The omission of outline, tags, bookmarks, backlinks, comments, search, profile, menu bar,
share and download from §10 is a loss in transmission, not a decision.** `[verbatim]` on his
words; `[inferred]` only on the conclusion, and the inference is short.

**What I would do:** diff the July dictation against §10 before any screen work, and treat §10 as
incomplete rather than as the scope.

### O3. The two hand-drawn layouts

`[verbatim]` — they are screenshots he sent, not drawings I made: *"I'll just give you the
screenshot also what we have been thinking."* They came from him and describe a landing page
modelled on Google Docs (search, blank document, examples). **Where the image files live now I
could not determine** — transcripts reference attachments that are not in the repo. Ask him for
the originals; they are the most authoritative design artefact in the project and they exist
outside version control.

### O4. What the Mobbin pass concluded

`docs/DECISIONS-UI-REFERENCE-PASS-2026-09-09.md` is 3.9 KB because it is a findings table, not a
narrative. It concluded six things, each cited to a shipped screen: state the position as text
rather than only a bar; exactly one primary forward action; put the keyboard hint with the
action; label the meter with the current area; use weight rather than glyphs in a dense list; and
make clicking an area open an index rather than jumping to its first question. **It also recorded
what it rejected** — a right-rail decision panel, step dots, per-row avatars. `[recalled]`, from
having written it; the file is short and you have read it.

### O5. Anything he said about colour, spacing, density, typography

**Not discussed**, beyond what is already in `AGENTS.md` §8 (accent `#0055ff` light,
`#60a5fa` dark) and the standing global rule that icons are Material Symbols as inline SVG. I
grepped his side for colour, font, typography, spacing, density and dark/light mode and found no
instruction of his on any of them — the hits were all research he pasted. The design system in
`decisions/app.css` is mine, inherited from the tred decisions system, and he has not commented
on its specifics.

---

## P. The engine and the code

### P1. `src/modules/mdmax` beyond the debt register

**Not discussed** in the main-loop transcripts beyond what `13-TECH-DEBT.md` already records. The
engine's own research is in `agent-reports-2026-08-30` (round r15) and `ENGINE.md`, neither of
which I read this session. **What I can add is provenance, not internals:** `mdmax` is the only
part of `src/` this product owns rather than inherits, and the `[measured]` R0 work queued
against it — zero-indent-sequence refusals at 83% of foreign vaults, bare-CR set destruction,
SAFE_KEY addressability — comes from that round.

### P2. Was `mdmax cert` never running known, or news?

**Known, and stale by 37 days at the time it was written into the plan.** `[verbatim]` from
`PRODUCT-BRIEF.md` §9 item 10, which states the command exits `ERR_MODULE_NOT_FOUND` *"37 days
after the commit whose message claims it landed 'inside its two-day cap'"*. So the plan knew.
**What was news on 2026-09-09 was that it is still true**, and that `entities` being undeclared
is item 11 of the same list. Neither is a discovery; both are unfixed known debt.

### P3. Was there ever a plan for wiring the engine?

**Yes, and it is sequenced.** `[verbatim]` — `PRODUCT-BRIEF.md` §9 lists "Engine unwired: one
symbol from one of thirteen files reaches product code" as fix #4 at 8 days, and the sequence
line puts fix-first (24 days) before everything else. So it is not "later"; it is item four of
eleven in a written order. **It has simply never been started**, which is the same observation as
K7.

### P4. Code I believe is wrong and is not in the debt register

`[verbatim]`, all found this session and all now *in* the register or fixed, except where noted:

- `GITHUB_REPO` defaults to the **sibling product's vault**. In the register.
- One Firestore write in a `presentation` component, violating the layer rule. In the register.
- **`decisions/questions.js` is committed and 1.3 MB.** It is generated, and committing a
  generated 1.3 MB artefact means every regeneration produces a large diff. Not in the register;
  arguably correct for a static deploy, but nobody decided it.
- **No migration exists for any `sgnk-md`-prefixed persistence key.** In the register via the
  data model doc, but worth repeating because it is a silent data-loss path.

### P5. `sgnk-md` — live, users, sync

`[verbatim]` for the facts, `[inferred]` for the relationship. `AGENTS.md` §8 says the Tauri
bundle id `ai.sgnk.md` is **deliberately unchanged** and that several persistence keys keep the
`sgnk-md` prefix **on purpose**, because renaming them "silently orphans a user's local drafts
and settings". **That is only a meaningful concern if there are users**, so I read it as evidence
that sgnk-md has real installed users whose local state must survive.

There is a `sgnk-md-update` skill that rebuilds and reinstalls it, which implies it is live and
maintained. **Nothing is automatically kept in sync between the repos** — round 1 established
frontmatter is a fork, and `13-TECH-DEBT.md` D-9 frames the open question as "merge, vendor, or
fork-and-own". **What happens to sgnk-md's users is genuinely undecided and is one of the seven
founder decisions.**

---

## Q. AIOS, the studio, the wider system

### Q1. The AIOS fusion, in his words

`[verbatim]`, and this is the longest single piece of product vision he has dictated:

> "Basically, our AI OS, this front matter, this markdown capability, this markdown base, we can
> fuse them into generating something crazy, something new thing. AOS, we are enhancing the AI
> markdown base, something that we might be building to enhance the markdown capability to
> generate a new generation of markdown, new generation of MDX."

He named concrete mechanisms in the same message:

> "Then we can have our compiler directly trigger into the rapid web building platforms like
> framer or laval when the MDX engine builds the page. It reads the YAML tokens, generates the
> CSS variable natively, and instantly renders high-fidelity prototype components inside the
> document using those tokens. **If a product designer updates the primary brand color in the
> markdown file … the entire live application updates automatically.**"

> "Next is **Semantic Self-Healing Code**: The biggest problem with treating documentation as a
> codebase is that code rots. If you change a database schema in one section of your markdown
> base, the frontend component in another section breaks. … You wrap the code blocks in a
> testing framework that runs headless in the background using the web container concept … The
> error is piped into your local Claude code or any coding agent."

And the framing he uses for the whole thing:

> "i wanna introduce a new concept we have to push towards a new concept of markdown"

**None of this is in `PRODUCT-BRIEF.md`.** It is a considerably larger product than the plan
describes, and it sits against the settled "build a compiler and an IDE, not a format" verdict —
though not necessarily in contradiction, since a compiler is exactly what he is describing.
**This is the biggest gap between what he says he wants and what the plan scopes.**

### Q2. Is frontmatter funded by or shared with client work

`[verbatim]` from the plan: the monthly nut is *"about ₹1.09L, covered by 54–78 consulting
hours"*, and my own 2026-08-31 note said the two-year success case earns *"the same as 78 hours
of consulting you could bill Monday"*. **So consulting funds it, and the plan says so.** Whether
any specific client engagement shares code or people with frontmatter: **not discussed.**

### Q3. `md` and `knowledge` as corpora

`[inferred]`. `~/Desktop/GitHub/md` is the sibling product's repo and is referenced in
`AGENTS.md` §6b as the pre-migration remote's neighbour; the global `CLAUDE.md` describes
`~/Desktop/GitHub/knowledge` as a personal knowledge base to consult before writing. **For
frontmatter specifically, `md` is load-bearing** — it is the fork parent, and the 8,513-file
byte-pinned corpus that `npm run corpus` gates on is drawn from real vaults. `knowledge` is
**incidental** to frontmatter; it is a studio-wide resource.

### Q4. Other repositories frontmatter depends on

`[verbatim]`: the fork relationship with `sgnk-md` (`~/Desktop/GitHub/md`) is the only hard
dependency, and it is unresolved. `13-TECH-DEBT.md` D-9 needs that repo checked out beside this
one to settle the `41 of 43` figure — **which is exactly the unverified number that 28 card
citations rest on.** Those two facts are the same fact.

---

## R. Operational memory

### R1. What breaks regularly

`[verbatim]`, all observed:

- **zsh aborts on an unmatched glob** where bash passes it through. Bit me this session on
  `docs/0*.md`. Use `find`.
- **The sandbox denies writes outside an allowlist**, including `~/.claude/skills-src`. The
  symptom is a silent `Operation not permitted` from `cp`, and the fix is a deliberate
  sandbox-disabled retry — not a workaround to reach for casually.
- **`git status` on this repo prints `.env.example: Operation not permitted`** every time. It is
  harmless sandbox noise and it is *not* a dirty tree. Filter it or you will misread the tree as
  unclean.
- **`npm run verify` includes a build that fetches Google Sans** and fails in-sandbox on the
  fetch while compiling fine outside. You diagnosed that yourself; it is not a regression.
- **Headless Chrome does not exit after writing a file.** Wait on the artefact's own trailer
  (`IEND` for PNG, `%%EOF` for PDF), never on the process.

### R2. The decisions-site deploy in practice

`[verbatim]` — deployed roughly **six times in one day** on 2026-09-09, always by me, always via
`decisions/tools/deploy.mjs` (a direct `POST /v13/deployments`). What has gone wrong:
**Vercel Authentication defaults ON for a new project**, which serves a login page that returns
HTTP 200 *after* a redirect — so `curl -sL` reports success on a broken deploy. The script now
clears `ssoProtection` and you must check with `curl -sI`. Separately, **the browser caches
`app.css`**, so a redeploy can look unchanged until you bust the cache.

### R3. What a new session gets wrong about this machine

- Shell is **zsh**, but scripts are bash. The two disagree on globs, `[ a \> b ]`, and `$0`.
- **`~/.claude/projects` keys on the launch cwd**, so transcripts for a repo can live under an
  ancestor directory. For frontmatter they do not, but do not assume that generally.
- **Sourcing the token file is per-Bash-invocation**; env vars do not persist between calls.
- The **scratchpad directory is session-specific and does not survive.** Everything that matters
  must be committed. This session lost nothing only because it was rescued deliberately.

### R4. Which of the six traps have actually bitten

`[verbatim]`, counted from this session:

| Trap | Times it bit |
|---|---|
| Product looks further along than it is | Once, and it was the reason the first handover draft was wrong |
| `questions.js` is generated | Zero — the rule held |
| Never `Read` the big docs | Zero this session; the rule exists because it bit earlier |
| `curl -sI` not `-sL` | Once, on the first decisions deploy |
| A workflow reporting failures may still have written files | **Once, decisively** — 15 of 16 agents "failed" and five complete files were on disk |
| A new button id must go in the delegated selector | **Once** — I hit it building the restore control, in the same session I wrote the rule |

---

## S. My own read

### S1. The biggest risk not written down anywhere

**That the product is being designed for the founder's taste rather than a buyer's problem, and
nobody has checked.** Every artefact in this repo is internally generated: 26 research rounds, 12
adversarial audits, 201 decision cards, 45 documents — and **zero conversations with a person who
is not a founder.** The plan's own weeks 1–2 exist precisely to fix this, cost nothing, and have
never run.

The written risks are all *competitive* (Almanac, Zed, VS Code). The unwritten one is
**epistemic**: six weeks of increasingly sophisticated reasoning about a market, conducted
entirely without contact with it. The adversarial rounds are not a substitute — they interrogate
the documents, and the documents share the founding assumption. `[inferred]`, and I hold it
strongly.

### S2. If he answers all 201 and says build, what breaks first

**The schedule, immediately and arithmetically.** `PRODUCT-BRIEF.md` §9 measures 1.21 engineering
days per calendar week against about 41.5 days of enumerated debt *before* the headline feature
starts, and review state itself is 18 more. That is roughly 58 calendar weeks at the measured
rate. **The first thing that breaks is the belief that answering the decisions unblocks
building.** It unblocks *specifying*; the engine is still unwired and review state still does not
exist in the code.

**Second: the SRS will be written against decisions whose evidence includes an unverified figure
cited 28 times.** If `41 of 43` does not reproduce, fourteen areas need revisiting after the SRS
is written, not before.

### S3. What I would tell you not to bother with

- **Reading the two RECORD files.** They are mechanically-proven supersets of the tree (N3).
- **Re-running any research round.** The corpus is deep enough that the marginal round has been
  producing corrections to earlier rounds rather than new findings — which is the signal to stop.
- **Auditing the seven orphans.** You checked them; I agree; the cap question in M7 is the only
  loose end and it is small.
- **Perfecting the card set before he answers it.** The set is good enough to decide from. The
  skew in M5 matters when you *present* it, not when you fix it.

### S4. What neither round asked that you will need

**Who reads the SRS, and whether "start building" means him.** Round 1 §I3 left this open and it
determines the document's whole shape. He said *"we have team, but we are the founders as of
now"* `[verbatim]`, which implies people beyond the two — but I have no evidence any of them has
touched this repo. `git log` shows a single author on 80 of 80 commits. **If the team is real,
the SRS is for them and must be buildable by someone with no context; if it is aspirational, the
SRS is a thinking document and should be much shorter.** Ask before writing.

**The AIOS fusion (Q1) has no home.** It is the largest thing he has described wanting, it is not
in the plan, and it is not a decision card. Whatever you do with the 201, that vision needs
somewhere to live or it will keep surfacing and keep being dropped.

**And one thing about this document.** Round 1 and round 2 together are two accounts of a project
written by the same participant. Where I say a thing was lost, or that a recommendation was
skewed, or that nobody talked to a user — those are my readings of my own work, and a fresh
reader may weigh them differently. **The transcripts are on disk. Everything here is checkable,
and where I could not check it I have said so.**
