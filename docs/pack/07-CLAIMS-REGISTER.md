---
id: 07-CLAIMS-REGISTER
title: Claims register
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [public-claims, marketing-guardrails, corrections]
---

# 07. Claims register

**What we may say in public, what we may not, and the artefact behind each.** Every row names the
artefact, the state that artefact must be in, and who owns the ground if somebody else owns it.

**The rule this file exists to enforce.** A claim is a factual statement about the world. It is
checked the same way any other number is checked: at write time, against the artefact, by running
the command in the row.

## 1. How a row works

Column | What it holds
`id` | `C` plus three digits. Never reused, never renumbered
Claim | The sentence, as it would appear in public
Artefact | The file, command or page that makes it true
Required state | What that artefact must show. **A claim whose artefact is not in this state may not be published**
Verdict | `MAY SAY`, `MAY NOT SAY`, `RE-CHECK EACH USE` or `CORRECT ON SIGHT`

**Who may add a row.** Anybody. **Who may change a verdict from `MAY NOT SAY` to `MAY SAY`.** Only
somebody who has run the command in the row in that session and can paste the output.

## 2. The prior register, which is still in force

This file does not replace `docs/FRONTMATTER-PRD-v2-2026-08-29.md` section 58, at line 5022. It
carries it forward and adds what the research of 18 September changed.

**Its `May say` list**, at line 5025, is four items, "each `[measured]` or `[fetched]` and
re-derivable by anyone".

**Its `May not say, yet` list**, at line 5032, is seven rows. All seven stand. They are CL201 to
CL207 below.

## 3. Claims we may make today

Id | Claim | Artefact | Required state | Verdict
CL001 | "0 corruption and 0 throws across 8,513 third-party markdown files from 7 vaults, byte-pinned by sha256 manifest and upstream commit" | `npm run corpus` | Prints `CORPUS CLEAN`, `changed 0`, `missing 0`, `extra 0`. **Verified 2026-09-18: 8513/8513** | **MAY SAY**
CL002 | "Re-verify it yourself: clone the repository and run one command" | `scripts/corpus-foreign.mjs`, `test/corpus/foreign` | Both present and the manifest pinned | **MAY SAY**
CL003 | "Three competitors' write paths were executed, and we can name the exact bytes each destroys" | The teardowns recorded in `specs/engine/splice-writer.md` | The spec present. UNVERIFIED in this session: the teardown evidence files were not opened | **MAY SAY**, with the teardown named
CL004 | "Every mainstream rich-text framework is lossy by design, in the vendors' own words" | PRD v2 section 58 | Quotations present in the source | **MAY SAY**
CL005 | "Git's three-way merge preserves CRLF and a missing final newline exactly" | PRD v2 section 58, marked `[measured]` | As recorded | **MAY SAY**
CL006 | "We refuse rather than guess when a range is ambiguous" | `specs/engine/splice-writer.md`, invariant 3 | Spec present and the refusal-path tests passing | **MAY SAY**
CL007 | "No captchas, no puzzles, no tour" | The founders' promise at `docs/mvp0/PRODUCT-PLAN.md` section 1 | It stays true of every screen shipped | **MAY SAY**
CL008 | "Your file stays a markdown file that any other tool can open" | The projection law, and the absence of a proprietary store | No format is introduced that a plain reader cannot read | **MAY SAY**

**One distinction that has to be held, because it is the easiest honest claim to turn into a
dishonest one.** CL001 is about **round-trip fidelity on files the writer could address**. It is not
a claim about **coverage**, which is what share of real front matter the writer can address at all.
Coverage is CL201, and coverage is blocked.

## 4. Claims we may not make

### 4.1 Because somebody else got there first

Id | Claim | Who owns the ground | Verdict
CL101 | "Markdown editor with AI agents", as a headline | **Ritemark**, whose home page headline is that exact sentence, free, macOS and Windows, open source | **MAY NOT SAY.** The category name is taken and the obvious version is free
CL102 | "Accept or reject every AI change, one by one", as the differentiator | **Google Docs.** Their help page ships "To apply changes individually, click Accept suggestion", "To apply all changes, click Accept all" and "To reject all changes, click Reject all" for Gemini edits | **MAY NOT SAY.** It is table stakes. The narrower claims in CL302 are available
CL103 | "Nobody reviews AI-written prose" | **CodeRabbit**, which has reviewed markdown prose since 2024-03-02 and added Vale on changed `.md` files on 2026-08-24 | **MAY NOT SAY.** False as stated. CL303 is the true version
CL104 | "First AI attribution" | **Cursor and Grammarly**, per PRD v2 section 58 line 5039. **And iA Writer**, which published an open byte-range-plus-hash annotation spec with iA Writer 7 in November 2023 | **MAY NOT SAY.** The PRD's narrower form is the one to use
CL105 | "Built for you and your agent" | **OpenMarkdown**, whose subheadline is that sentence | **MAY NOT SAY.** Not a legal problem, a sameness problem
CL106 | "The only editor where an agent can touch your files without clobbering your edit" | **OpenMarkdown** ships a `CONFLICT` response on a concurrent section write, which is our refusal law by another name | **MAY NOT SAY.** Ours is byte-range rather than section-scoped, and that difference has to be shown rather than asserted

### 4.2 Because the artefact is not in the required state

Id | Claim | Artefact | Why not
CL201 | **Any fidelity or coverage percentage** | `specs/engine/nf-001-zero-indent-sequence.md` | At the measured 83 per cent refusal rate on real vaults, a headline coverage number is false until NF-1 and NF-3 land. Publishing first converts a defect into a public claim
CL202 | "NF-1 recovers 99.98 per cent" | The same | An inference from bucketing refusal causes, not a measurement
CL203 | Anything about Obsidian's onboarding funnel | None | The widely-repeated claim is unsourced
CL204 | "Serve markdown to agents and get cited" | None | Measurably refuted
CL205 | Any number tagged `[SS]` in inherited material | PRD v2 | 47 remain in that document
CL206 | Anything about a learning loop | None | Never market "it learns you" before a decision demonstrably bends on real data
CL207 | "The change queue is shipped" | `grep -ril "change.queue\|changeQueue" src/` | Returns nothing. **Specified, not built**
CL208 | "Doc mode works" | `src/` | No Doc mode code exists. **Specified, not built**
CL209 | "Our published pages are readable by agents" | `page.md` and `llms.txt` routes | Neither route exists in `src/app/`. The rule is written and the code is not
CL210 | Any performance number | `docs/mvp0/PRODUCT-PLAN.md` section 21 | Section 21 states targets, and the plan's own list in section 2 says there has been no performance measurement of the shipped editor
CL211 | "99.5 per cent availability" | None | A target, not a record. There is no uptime history to quote
CL212 | Any accessibility conformance claim | None | The plan's own list in section 2 says no accessibility audit has been done

## 5. Claims that need a re-check before every use

Id | Claim | What to re-check | Why it moves
CL301 | "We never train on your documents" | Which providers are in the live free chain, and each one's current terms | It is a claim about the chain, not a number. **The configuration panel cannot absorb it**, and adding a provider whose terms permit training changes the sentence. See `docs/mvp0/PRODUCT-PLAN.md` section 30
CL302 | "The change queue covers changes an external agent made while the editor was closed, and the decision survives the accept in a version record" | That the queue is built, and that the version record carries `author`, `source`, `model`, `ask`, `accepted_by` and `at` | This is the true, narrower form of CL102. It is available **only once built**
CL303 | "Nobody has built a review step for a machine edit outside a pull request" | That no incumbent has shipped one since the last check | True on 2026-09-18 across Notion, Confluence, Craft, Box, Slite, Dropbox Dash and Mintlify. It is the kind of claim a competitor can refute in a week
CL304 | "frontmatter" as the product name | The Indian trademark register, and the Front Matter CMS collision at 82,819 installs | The search needs a founder's own login and has not been run. It is founder question 7
CL305 | Any competitor price | The vendor's own pricing page, on the day | Nine of the prices in `06-COMPETITIVE-LANDSCAPE.md` changed inside the last year
CL306 | "8,513 files" | `npm run corpus` | The corpus can grow. Quote the number the gate printed in the session you are writing in

## 6. Claims already made that must be corrected

Id | Where it appears | The claim | The correction
CL401 | `CLAUDE.md`, the settled-positions block | That per-span read state was dropped partly because "Almanac shipped the same read receipts and shut down" | **The shutdown is real and the implied cause is not supported.** Almanac's own farewell page gives a different reason: a second product, Blaze, took the team's capacity. Verbatim: "Ultimately, we've decided we don't want to offer a product in Almanac whose quality we no longer have the capacity to maintain or improve." Keep the drop, change the reason
CL402 | `docs/mvp0/PRODUCT-PLAN.md` section 2 | "AGENTS.md is used by over 60,000 projects" | GitHub's own code-search count, which its API states is approximate, returns about **547,840** files named AGENTS.md at repository root, measured 2026-09-18. Roughly nine times the quoted figure
CL403 | `docs/mvp0/PRODUCT-PLAN.md`, revision 6 section 0 | "The decision cards number 210" | `python3 decisions/tools/validate.py decisions/v2` prints **275 cards, 0 errors, 5 warnings** on 2026-09-18
CL404 | `docs/mvp0/PRODUCT-PLAN.md` section 23 and the legal floor | That placeholder pages for the four public routes "serve on this branch" | True of the branch, false of the deployment. `curl -sI https://frontmatter.in/privacy` returns `HTTP/2 307` to `/login`, and the same for `/terms`, `/pricing` and `/refunds`, checked 2026-09-18
CL405 | `docs/mvp0/PRODUCT-PLAN.md` section 26 | That fixing the `GITHUB_REPO` default is Phase 0 work | Already done. `src/config/env.ts` has no default and fails at boot without the variable

## 7. Before any public sentence

Six steps, in order. None takes more than a minute.

1. **Find the claim in this register.** If it is not here, add a row before you publish.
2. **Run the command in the Required state column.** Paste the output into the pull request or the
   session record.
3. **Re-derive every number at write time.** Never carry one forward from a previous draft.
4. **Check the quotation against the page.** A research pass on 2026-09-09 put fabricated quotes
   from Visual Studio Code's documentation into a document, and roughly one quotation in three
   across that run was a paraphrase inside quotation marks.
5. **Check `06-COMPETITIVE-LANDSCAPE.md` section 6.** It is the list of sentences somebody else
   already owns.
6. **Run the writing gate.** `python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <path> --strict`

## 8. The one claim worth building the launch on

**CL001, said plainly, with the invitation to check it.**

The reasoning, from `docs/research/2026-09-18/raw/H-2026-launches.md`. The highest-value question
asked at the top of the biggest markdown launch of 2026 was whether front matter and nested fences
survive an agent edit. The founder answered "optimistic parsing". We have 8,513 pinned files, a
gate that fails on one changed byte, and we have never said so in public.

**What that claim needs before it ships**, and neither is optional.

- The two named engine defects fixed with red proofs, because a coverage question follows a
  fidelity claim within one reply.
- A public page that runs the comparison, so the invitation is real rather than rhetorical.

## 9. The limits of this file

**What was not assessed.** Trademark, advertising law and comparative-advertising rules in any
jurisdiction. Naming a competitor and quoting their page is treated here as ordinary evidence, and
counsel has not been asked.

**What could not be verified.** CL003's teardown evidence. The claim is inherited from PRD v2 and
the underlying files were not opened in this session. UNVERIFIED.

**What is not established.** That CL001 persuades anybody. It is a correct claim about a real
artefact, and nobody outside the studio has been shown it. `05-USER-EVIDENCE.md` is empty.

**What would falsify this file.** Any competitor shipping a byte-exactness gate over a public
corpus. CL001 is the last claim in section 6 of `06-COMPETITIVE-LANDSCAPE.md` with nobody standing
on it, and it is the one that would move first.
