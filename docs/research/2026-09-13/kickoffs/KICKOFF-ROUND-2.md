Second round. Your first answer document is committed at 5d6cb9c and I have read all 787 lines.
It was good, and the reason it was good is that you mined transcripts instead of recalling, and
tagged every answer. Keep both habits exactly.

Write this one to: /Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/HANDOVER-ANSWERS-2-2026-09-09.md
Commit it on `engine/plan-and-diagnostics`. Change nothing else.

## Why there is a round 2

Your §F5 ended with this, and it is the reason for most of what follows:

> "And one thing I could not recover: my own turns. Everything I proposed, argued for, or got
> wrong across six weeks is in those 92 MB of JSONL and is not in this document."

Round 1 mined 174 of Sagnik's messages. That gave me what he wanted. It did not give me what was
BUILT IN RESPONSE, what was argued, what was overruled, or what is wrong and still standing.
**Round 2 mines the assistant side.** ~779 MB under
`~/.claude/projects/-Users-sagnikmitra-Desktop-GitHub-frontmatter/` plus the four sibling dirs.

Same tagging: [verbatim] / [recalled] / [inferred] / "not discussed". Same rule — do not
reconstruct something plausible; say you do not know. Do not re-answer round 1.

**Sampling is fine and expected.** 779 MB will not fit in context. Grep for the thing, read the
neighbourhood, quote it. Say which sessions you sampled and which you did not, so I know the
shape of what you looked at. A partial answer with its method stated beats a complete-sounding
one without.

**Do NOT run a large agent fan-out for this.** He stopped one at ~150 agents for cost and was
right. This is grep and read.

---

## K. Your own turns — the unrecovered half

K1. Where did you argue for something and get overruled? For each: what you argued, what he
    said, and — with hindsight and the evidence now on disk — who was right.
K2. Where were you wrong, and it was caught? What was the error, who caught it, what did it cost.
K3. **Where were you wrong and it was NOT caught?** Anything you now believe is mistaken and is
    still sitting in a document, a card, or the code, unchallenged. Highest-value question here.
K4. What did you propose that he neither took up nor rejected? Round 1's A3 deferred this to
    exactly this extraction.
K5. Where did you change your own position across the six weeks without flagging it? A
    recommendation that quietly reversed is worse than one that visibly did.
K6. What did you refuse to do, and why? RULE-2 refusals, scope refusals, anything you pushed back on.
K7. If you were staying on this project, what is the first thing you would change about how the
    work has been done?

## L. Research archaeology — nine directories, thirty-seven workflows

L1. `docs/research/` holds nine directories spanning 2026-08-28 to 2026-09-09, and
    `docs/workflows/` holds 37 scripts covering r3–r26. For each round: what question it asked,
    what it concluded, and whether that conclusion is STILL LOAD-BEARING, SUPERSEDED, or DEAD.
    A table is fine. This is the single largest body of work I cannot navigate.
L2. Which round produced a conclusion that a later round overturned? Name both.
L3. Round 1's F2 said dead ends were unevidenceable without reading each output. Read enough to
    answer it now — which rounds produced nothing that survived?
L4. `docs/research/prd-v2-sections/` and `agent-reports-*` — are these inputs to a document that
    now supersedes them, or do they still hold material that never made it into any doc?
L5. Any research finding that CONTRADICTS the current plan and was never reconciled.

## M. The 201 cards — I have to present these and defend them

M1. Who set the `rec` field on each card — one agent per area, unreviewed? Was any human or
    second pass sanity-checking recommendations, or is each an agent's own judgement?
M2. P1's evidence cites "41 of 43", which your round 1 §G3 lists as **unverified**. How many
    cards rest their recommendation on a figure that is unverified or that does not reproduce?
    If you can only sample, sample and say so.
M3. Were the fifteen area agents given the same evidence, or did each research its own? If the
    latter, two cards could recommend opposite things from different evidence.
M4. The `flip` field names what would overturn each recommendation. Was that written honestly —
    a real falsifier — or does it sometimes restate the question?
M5. Which cards do you think are BADLY framed, leading, or missing the real option? You wrote
    them; you are the best-placed critic.
M6. Any card whose options are not genuinely exhaustive — where the right answer is "none of
    these"?
M7. The seven orphans (D13 L22 MK17 MK21 PR19 R5 R6) I have checked and they look legitimate.
    Do you agree, or were any of them meant to link to something?

## N. Documents — which of the forty-three are alive

N1. `docs/` holds 43 markdown files. `docs/MAP.md` says five are superseded. Give me the full
    status of all 43: LIVE / HISTORICAL / SUPERSEDED-BY-X / SCRATCH.
N2. Which documents contradict each other today, and which wins?
N3. `FRONTMATTER-RECORD.md` (2.1 MB), `FRONTMATTER-COMPLETE-RECORD-2026-08-30.md` (3.4 MB),
    `FRONTMATTER-PRD-v2-2026-08-29.md` (760 KB) — what is in each that is in no other file? If
    they are pure supersets, say so and I will stop treating them as reading I owe.
N4. `docs/_wireframes.md` is 60 lines but 84 KB — what is it, and is it current?
N5. `docs/DECIDE.md`, `docs/BRIEF.md`, `docs/WEEK0-DECISIONS-2026-09-08.md`,
    `docs/FRONTMATTER-DECISIONS-2026-08-29.md` — four decision-shaped documents predating the
    201. Are they folded in, or do they hold decisions the card set lost?
N6. `docs/GAPS-2026-09-08.md` and the adversarial round — what did it conclude, and did the plan
    actually change in response, or was the conclusion recorded and ignored?

## O. The screens, the prototype, the design

O1. `docs/screens/` holds the decision-site captures and `docs/prototype/frontmatter-prototype.html`
    is the clickable one. Which of these has he actually seen, and what did he say about each?
O2. Round 1 §F5 item 6 says his 2026-07-29 dictated screen spec is the most detailed design
    instruction in the corpus and is in no document. I compared it to `PRODUCT-BRIEF.md` §10:
    §10 is built from two hand-drawn layouts and omits outline, tags, bookmarks, backlinks,
    comments, search, profile, menu bar, share and download. **Was that omission deliberate —
    a v1 scope cut — or did the July spec simply get lost?**
O3. The two hand-drawn layouts §10 is built from — where are they, and did he draw them?
O4. What did the Mobbin reference pass actually conclude? `docs/DECISIONS-UI-REFERENCE-PASS`
    is 3.9 KB, which seems thin for a pass that reshaped the UI.
O5. Anything he said about colour, spacing, density or typography beyond Google Sans / Mosvita /
    single blue.

## P. The engine and the code

P1. Neither of us has read `src/modules/mdmax` internals. What do you know about its state that
    is not in `13-TECH-DEBT.md`?
P2. `mdmax cert` has never run (ERR_MODULE_NOT_FOUND). Was that known and deferred, or is it
    news? Same for `entities` being undeclared in `package.json`.
P3. The engine is unwired — no product write goes through it. Was there ever a plan for wiring
    it, or has it always been "later"?
P4. What in the code do you believe is wrong but never got written into the debt register?
P5. The sibling `sgnk-md` — is it still live, does it have users, and is anything being kept in
    sync between the two repos?

## Q. AIOS, the studio, and the wider system

Q1. Round 1 §C6 item 5 says fusing frontmatter with AIOS / sgnkai was raised at least three
    times. What exactly did he say, and what would the fusion be?
Q2. Is any part of the frontmatter work funded by, or shared with, the studio's client work?
Q3. `~/Desktop/GitHub/md` and `~/Desktop/GitHub/knowledge` are referenced as corpora. Are they
    load-bearing for frontmatter, or incidental test data?
Q4. Anything in another repository on this machine that frontmatter depends on or was extracted
    from.

## R. Operational memory

R1. What breaks regularly? Commands that fail, gates that false-red, tools that need a
    workaround. Round 1 gave me the lessons; I want the specific recurring failures.
R2. What is the deploy story for the decisions site in practice — how often, who triggers it,
    what has gone wrong?
R3. Anything about this machine's setup that a new session gets wrong. Shell, sandbox, proxy,
    fonts, paths.
R4. Which of the six traps in the handover's §8 have actually bitten, and how many times?

## S. Your own read

S1. What is the single biggest risk to this project that is not written down anywhere?
S2. If Sagnik answers all 201 and asks you to build, what breaks first?
S3. What would you tell me not to bother with?
S4. Anything I have not asked about in either round that you think I will need.

---

## Format

Same as round 1 — exact headings and numbers, prose where there is nuance, quotes wherever you
can. Say what you sampled and what you skipped. If a question is unanswerable from the
transcripts, say so and name where the answer would live instead.

Two hard rules, both from round 1's own findings:
- **No credential, token, prefix or file path to one** goes in this document. If something
  sensitive is relevant, say only that it exists.
- **Do not write AI-slop prose.** It is the constraint he polices hardest, and this document
  goes in his repo.
