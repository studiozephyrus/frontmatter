---
title: The questions that are yours, before the final plan
date: 2026-09-14
time: 02:57 IST
for: Sagnik and Amit
status: the penultimate step. Fifteen questions. Answer by number, in chat or in this file. The final plan is written from these answers and nothing else.
---

# The questions that are yours

There are 208 decisions on the site and 65 of them block the MVP. After this weekend's
research and the audit, most of those 65 have an evidenced recommendation and I am not going
to make you sit through them before we can start. They stay on the site for the build phase,
where the person building needs them.

What is left is fifteen things. Five are facts that only you know and no research can find.
Ten are decisions where I have a position and evidence, and you either confirm it or overrule
it. Overruling is fine and expected on some of these. Say why in a sentence so the plan can
carry the reason.

Answer by number. `unknown` is a valid answer and is better than a guess, because a guess here
becomes a date in the plan.

---

## A. Facts only you know

**1. Is Amit building, and at what rate?**
Every date in every plan so far assumed two people, and git shows one author on 80 of 80
commits at 1.21 engineering days a week. If Amit is writing code, say how many hours a week
and from when. If not, say so and the plan is built on one person, which is fine, but it has to
be the truth.
*Card `B1`.*
**Your answer:**

**2. How is the build funded?**
Client work alongside, and if so how many hours a week does it take. A runway, and if so how
long. Something else. The answer sets how many hours a week Phase 0 actually gets.
*Card `B2`.*
**Your answer:**

**3. Does sgnk-md have any user who is not you?**
The register calls it production and it shares 202 of 228 files with frontmatter. If anyone
else has signed in, ever, the privacy and grievance clocks started when they did, not at the
pilot. Yes, no, or unknown.
*Card `L3`.*
**Your answer:**

**4. Do the founder test notes exist?**
Idea mode, decision flow and repo docs scan are recorded as founder-tested. Nobody has seen
the notes. If they exist, where. If they do not, the three get relabelled untested and it costs
nothing except honesty.
*Card `R17`.*
**Your answer:**

**5. Name the twenty.**
Phase 0 is judged by twenty named people outside the studio. Not a category, names. If you can
write ten now, write ten. If you cannot write any, that is the most important answer on this
page and it changes what Phase 0 is.
*Card `G15`.*
**Your answer:**

---

## B. Confirm or overrule

Each has my position, the evidence in one line, and the card it settles.

**6. The sentence.**
*frontmatter is where you write, review and keep current the files your agents obey.*
Evidence: 60,000 projects use `AGENTS.md`, 77 commits to one in `openai/codex`, two files in
LibreChat drifted 3x apart, the vendor documents "too large" as a failure, and your own
`CLAUDE.md` is 10,033 words. Spec Kit and Kiro generate and leave; nobody holds this ground.
*Cards `P1`, `P2`.*
**Confirm, or your sentence:**

**7. Phase 0 holds no document bytes. Storage arrives in Phase 2 as the Pro tier.**
Evidence: local only costs no storage and no legal surface; the draft store on idb-keyval
already exists in the code; six legal cards collapse if we hold nothing in the pilot.
*Card `L1`.*
**Confirm or overrule:**

**8. Web first at `/`, no account until the first save. The Mac app is the paid or desktop
surface later, built from the same tree.**
Evidence: dillinger, StackEdit and Excalidraw all show zero sign-in words and an editor on
arrival; our home page is the login screen; the Tauri .dmg was built on 27 May and exists. I
know you want it downloaded. The web one is what a stranger meets and can be judged in four
weeks.
*Cards `FF1`, `FF8`, `AC20`.*
**Confirm or overrule:**

**9. The editor is free. Storage, sync and the Team view are what people pay for.**
Evidence: Obsidian gives the editor away and charges for Sync and Publish; HackMD runs Free,
Prime, Enterprise; Kiro is $20 per user on its Pro row. Nobody in this market charges for an
editor.
*Card `PR24`.*
**Confirm or overrule:**

**10. Sharing is read and comment on a link. Not live editing.**
Evidence: live editing needs operational transforms or CRDTs, which this repo settled against
on evidence; a document kit is reviewed asynchronously by nature; read and comment is weeks,
live is months against Google Docs.
*Card `F36`.*
**Confirm or overrule:**

**11. Phase 1 is the instruction-file view.** Every `AGENTS.md` and `CLAUDE.md` in a
repository, which one wins for a path, size against the vendor's limit, what an agent changed
that nobody read.
Evidence: the strongest market signal found all week, and the only thing none of the four
competitors does. The main OpenAI repository holds 88 of these files.
*Card `F35`.*
**Confirm or overrule:**

**12. The writing gate ships as a feature: does this read like you, with the tell named.**
Evidence: it is measured against 2,710 dictation entries and 196,522 of your own words, it
caught me three times this session, and no editor has it. It exists.
*New. No card yet; I will add one on your answer.*
**Confirm or overrule:**

**13. The AIOS is not a product. Three things from it ship as templates: the learned-rule
format, the file gate, the skill shape. The orchestrator, the 128 skills and the 156 scripts
stay yours.**
Evidence: 43 of 128 skills are about running the system itself; the preference log the loop
learns from holds zero pairs; `aios-site` has no commits since it was made. It is the best
thing you built and nobody can install it in a day.
I know this is the one you feel most strongly about. Say so if I have it wrong.
*New. Cards `FF14`, `P15` touch it.*
**Confirm or overrule:**

**14. Archive eight repositories with a date, park two, and move snapshots out of the repos.**
`agentube`, `skills-registry`, `claude-setup`, `aios-site`, `rawl`, `sgnkos`, `sgnk-pwa`,
`zs-agents` archived. `hq` and `content` parked. Snapshots either written outside the
repositories or ignored by git.
Evidence: 15,349 snapshot markdown files in 21 repositories; the eight are dead by their own
git logs. After this, five things remain and they are all alive.
*New.*
**Confirm or overrule:**

**15. The name.**
"frontmatter" is taken in the VS Code store your buyer uses. Keep it bare, qualify it, or coin
a new one and keep "frontmatter" as the word for the block we edit. This goes on the landing
page, the launcher and every export, so it is due before Phase 0 ships, and a register check
is cheap.
My position is to coin, because a name we own from day one costs less than a collision
managed forever. But this is the one decision in the list I would not make for you.
*Cards `N1`, `N3`.*
**Your answer:**

---

## C. The state of the code you would be starting from

`npm run verify` on `frontmatter` at `d3d27af`, run tonight: typecheck, lint and tests pass.
**The build step failed**, and it failed on fetching Google Sans from `fonts.googleapis.com` at
build time. The first run was inside a network sandbox, so I re-ran it with the sandbox off to
find out whether that is an artefact of where I ran it or a real defect.

**Result of the re-run:** `build exit=0` with the sandbox off. The failure was the sandbox
blocking `fonts.googleapis.com`, not the code. **The codebase at `d3d27af` is green to start
from**: typecheck, lint, tests and build all pass with network.

It also sharpens card `D13` past what the card says. `next/font` fetches Google Sans from
Google's CDN at build time, so the build itself cannot run offline or in any CI that
restricts the network, which is a stronger dependency than icons and export fonts. That goes
on the Phase 0 list.

---

## How this becomes the plan

You answer the fifteen. I write the final plan from the answers: the sentence, the tiers, three
phases with the asset lifted from each project named beside it, the kill line for each phase,
the archive list executed, and the first week's work in enough detail that the first commit is
obvious. That is the document from which building starts, and it will not contain a number
that came from anywhere but these answers and the evidence already cited.

Then we build.
