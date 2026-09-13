You are being asked to write ONE document for the account that is taking over frontmatter.

Write it to: /Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/HANDOVER-ANSWERS-2026-09-09.md
Commit it on `engine/plan-and-diagnostics`. Do not change anything else.

I have already read, in full: HANDOFF-decisions-v2-2026-09-09.md (804 lines), docs/README.md,
docs/13-TECH-DEBT.md, docs/PRODUCT-BRIEF.md, decisions/README.md, the BRIEFING and VERIFIED
research files, and the v2 card sources. I have re-verified live state myself: HEAD 1b3121a,
18 unpushed, 0 behind, tree clean, docs gate exit 0, verify green (the build's "Failed to fetch
Google Sans" is Node's fetch ignoring HTTP_PROXY in a sandbox — it compiles in 9.4s outside).
I confirmed 201 live cards all carrying diagrams, 261 in source with 60 dropped by _links.json,
six of seven PRODUCT-BRIEF §14 decisions mapped to cards, all seven orphans legitimate, and
deploy.mjs tracked (so §8 trap 3 is stale).

SO: do not re-summarise the repo. I need what is ONLY in your transcripts and your memory of a
month of conversation — intent, rejections, corrections, and taste. Answer every question below.
Where you genuinely do not know, write "not discussed" rather than reconstructing something
plausible. Tag every answer [verbatim] (you can quote the user), [recalled] (you remember it but
cannot quote), or [inferred] (you are reasoning). Those tags are the point; an inferred answer
presented as recalled is worse than no answer.

## A. Rejections and corrections — the highest-value section

A1. Every substantive correction Sagnik gave you over the month, verbatim where possible, and
    what each changed. The handover quotes six asks from one session; I want the rest.
A2. What did he explicitly REJECT? Designs, features, framings, names, pricing shapes, research
    directions. For each: what was proposed, what he said, and whether the rejection still holds.
A3. What did you propose that he ignored rather than rejected? Silence is data.
A4. Which of your recommendations did he push back on and you conceded — and were you right?
A5. Anything he asked for MORE than once. Repetition means I got it wrong the first time.

## B. The decisions UI — I will be changing it, so this is operational

B1. What does he want from that interface that is NOT built? Wish list, in his words.
B2. What annoyed him about it? Anything he called clunky, slow, ugly, confusing.
B3. Which UI choices were HIS and which were yours? I need to know what is load-bearing taste
    versus what I can freely change.
B4. Card shape: was "diagram first, bulleted context, per-option gains/costs" his instruction or
    your design? Same for the ten diagram primitives — did he approve the vocabulary explicitly?
B5. What did he say about answering ergonomics — keyboard, ordering, area-per-sitting, the note
    box, the recommendation line?
B6. Anything about the site that is deliberately unfinished and should stay that way.

## C. The product idea itself — where his head actually is

C1. In his own words, what IS frontmatter? Not the plan's sentence — his.
C2. What is he most confident about, and what is he privately unsure of?
C3. Has his position moved over the month? On the headline claim, form factor, pricing, the
    Firebase design, the name. Where did it start and where is it now?
C4. What does he think the product is NOT? Boundaries he has stated.
C5. Which of the 201 does he already effectively know the answer to? Answering is faster if I
    know which are real questions and which are formalities.
C6. Is there anything he wants built that never became a card?

## D. Amit, the meeting, and how decisions actually get made

D1. Who is Amit, what does he own, and what is his position on the product?
D2. Where do he and Sagnik disagree?
D3. §14 marks D1/D6/D7 as "The meeting". What is that meeting — when, who, what format,
    has it happened?
D4. Is this answering session replacing that meeting or feeding it? It changes how I record a
    pick that goes against a recommendation.
D5. Who decides when they disagree?

## E. Money, time, and constraint

E1. Runway, and how it bounds scope. What is the actual deadline pressure?
E2. How much time per week is he putting into this, and is Amit paid or contributing?
E3. Is there revenue anywhere yet? Consulting hours funding it?
E4. What would make him stop? He has kill conditions in the plan — does he believe them?
E5. Anything about the sibling product sgnk-md: is frontmatter replacing it, forking from it,
    or coexisting? What happens to sgnk-md's users?

## F. The month's work — the shape of it

F1. A chronological list of what happened, week by week, at a level the repo does not record:
    what you tried, what worked, what was abandoned and why.
F2. Which research rounds produced nothing? I want the dead ends so I do not repeat them.
F3. What was expensive in tokens and NOT worth it? What was cheap and high-yield?
F4. Any session that ended badly — a limit, a bad direction, work lost. What was lost.
F5. What is in your transcripts that never reached a file and would be lost if your account
    went away tomorrow? This is the single most important question in this document.

## G. Claims, numbers, and confidence

G1. Which numbers in PRODUCT-BRIEF and the PRDs does he actually believe, and which are
    placeholders nobody has challenged?
G2. The 51 `**unverified**` markers across docs/ — which matter and which are noise?
G3. NF-1, NF-3, and the 41-of-43 fork figure are carried and unverified. What are they, what
    would settle them, and does it matter before the SRS?
G4. §5.8 says "whether VS Code's reviewed state persists outside the editor" is THE
    differentiation axis and is unanswered. Was it ever discussed? What does he believe?
G5. Anything you now think is wrong in the plan but never got round to correcting.

## H. Constraints I would violate without knowing

H1. Anything he has told you never to do. Tone, tooling, spend, scope, branding.
H2. Naming: is "frontmatter" settled? The Name area has 8 cards, and there is an 82,265-install
    incumbent in the VS Code store. Where does he stand?
H3. Any commitment made to anyone outside — a user, a prospect, a partner, a deadline.
H4. Anything sensitive I should know but not write into a repo document. Say only that it exists
    and that I should ask him directly. Do NOT put a credential, a token, or a private third
    party's details in this file.

## I. The deliverable after the answers

I1. §7b specifies six things. Did he say anything else about the SRS/PRD/BRD/FRD — length,
    format, audience, who reads which, whether they are for investors, Amit, or a build team?
I2. Does he want them as markdown in the repo, as PDFs, as a site, or all three?
I3. Is anyone else going to build this, or is it him and Amit?

## J. Working relationship

J1. How does he prefer to work — long autonomous runs or tight check-ins? How much does he want
    to be asked versus told?
J2. What makes him say "this is good"? What makes him say "you missed the point"?
J3. Any format he likes for updates. He is clearly allergic to padding; what else?
J4. Any standing rule he gave you that is not in CLAUDE.md or the Learned Rules.

## Format

Answer under these exact headings and numbers so I can map answers to questions. Prose, not
bullets, where the answer has nuance. Quote him wherever you can — his phrasing carries
information that a paraphrase loses. If a section is genuinely empty, write the heading and
"not discussed" underneath it rather than deleting it, so I know it was considered.

Length is not a constraint. Fidelity is. This replaces a month of context I do not have.
