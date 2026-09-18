---
id: 64-PORTABILITY-AND-HANDOVER
title: Portability and handover
mode: how-to
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [portability, handover, cold-start, health-check]
---

# 64. Portability and handover

**Read this first if you have just arrived.** You are an agent or a person who has never seen this
product, on a tool that is not the one that wrote this, in an account that is not the one that
paid for it, and **you cannot ask anybody a question.**

**This file assumes exactly that.** Everything below is either a command you can run or a file you
can open. Nothing here requires a person.

**Why this file exists.** The founder will move between accounts and between tools to manage cost.
**Development has to start, and continue, without the people who wrote this.** If following this
page sends you looking for a human, the page has failed.

---

## 1. Thirty seconds

```bash
cd <the repository>
git log --oneline -1          # where you are
git status --short            # what is uncommitted
cat docs/pack/00-README.md    # the product in seven lines
```

**Three sentences that carry the whole product**, so you can judge everything else against them:

1. **The file on disk is the only source of truth.** Every view is a deterministic, stateless
   projection of it.
2. **The engine locates a byte range and replaces exactly those bytes.** It never rewrites a whole
   file, and it **refuses** rather than guess when a range is ambiguous.
3. **Every change by a person, an AI edit or an agent enters a queue** where the owner accepts or
   rejects it one by one. **No silent merge, ever.**

**And the one sentence about the state of it.** **The editor is real, the engine is real and
unwired, and everything the product is sold on is a specification.** Hold that in front of every
screen picture you see.

---

## 2. What to read, in what order

**Do not browse.** This order is designed so that each file makes the next one legible, and it
stops at the point where you know enough to do the work.

### 2.1 The cold start, about ninety minutes

Order | File | Why | Rough size
1 | `docs/pack/00-README.md` | The product in seven lines, and the pack index | 7 KB
2 | **this file** | Where things are, what to run, what not to touch | |
3 | `docs/pack/65-CONVENTIONS.md` | The rules every file in the pack obeys | 5 KB
4 | `docs/pack/63-AGENT-CONTRACT.md` | **What you must and must not do.** Read before touching anything | |
5 | `docs/pack/51-PRODUCT-PLAN.md` | Position, defensible claims, what exists, the tiers, the never-build list | |
6 | `docs/pack/60-TRACEABILITY.md` | **What is actually built against what is drawn.** Section 6 is the reality check | |
7 | `docs/pack/50-ROADMAP.md` | The phases, the dependency spine, and the two honest answers about pace | |
8 | `docs/pack/56-OPEN-DECISIONS.md` | The fifteen things nobody has decided | |
9 | `docs/pack/10-FEATURE-REGISTER.md` | Every feature id. **The one home for them** | 53 KB
10 | `docs/pack/11-SCREEN-INDEX.md`, then the `12-screens/SNN.md` you need | Screen by screen | |

**Stop there.** That is enough to take a task. Everything else is looked up when a task needs it.

### 2.2 Then, by what you are doing

If your task is | Read
Writing code | `20-ARCHITECTURE.md`, `21-DATA-MODEL.md`, `30-ENVIRONMENT-AND-CONFIG.md`, `31-LOCAL-SETUP.md`
Touching the engine | `25-ENGINE-SPEC.md`, `26-ENGINE-REFUSAL-CATALOGUE.md`, `specs/engine/`
Building a screen | `12-screens/SNN.md`, `58-DESIGN-SYSTEM.md`, `16-COPY-DECK.md`, `14-COMPONENT-INVENTORY.md`
Anything about money | `53-PRICING-AND-ENTITLEMENTS.md`, then `54-COMPLIANCE-AND-LEGAL.md`
Anything a stranger will see | `54-COMPLIANCE-AND-LEGAL.md`, section 2.1 especially
Adding measurement | `55-MEASUREMENT-AND-EVENTS.md`
Deploying | `32-DEPLOYMENT-AND-OPS.md`, `33-RUNBOOK.md`
Arguing about the market | `52-MARKET-RESEARCH.md`, and its section 5, which is what is **not** established

### 2.3 The plan of record, underneath the pack

**`docs/mvp0/PRODUCT-PLAN.md`, revision 6, 31 sections.** The pack is written from it. Read the
sections your task touches, never the whole thing.

**Cite it by section, never by line.** It is edited by other people, and a line citation into it
rots within the hour. This pack learnt that on 18 September, when the file gained twelve lines
mid-session and every line citation into it went wrong at once `[O]`.

---

## 3. What never to open

**Four documents will blow your context window on a single read.** Use `grep -n` for the term,
then `sed -n 'START,ENDp'` for the surrounding lines.

File | Size
`docs/FRONTMATTER-COMPLETE-RECORD-2026-08-30.md` | **3.4 MB**
`docs/FRONTMATTER-RECORD.md` | **2.1 MB**
`docs/FRONTMATTER-PRD-v2-2026-08-29.md` | **760 KB**
`ENGINE.md`, `CRITIQUE.md`, `DEV-PLAN.md` | about **250 KB** each

**And one trap that is worse than a large file.** `docs/MAP.md` opens by telling you it is the
index, and `AGENTS.md` sends you to it. **It was last updated on 2026-08-31** and it routes you to
`docs/DECIDE.md`, `docs/PRODUCT.md` and `docs/THESIS.md`, which are a previous generation of this
product.

> **`docs/MAP.md` is an archive. This pack supersedes it. Do not follow its routing.**

---

## 4. Canonical, archive, and how to tell

**Four tiers, and the front matter of every pack file names its own.**

Tier | What it means | Do you review it
`canonical` | The single home for its facts. Hand-written, dated, owned | **Yes**
`derived` | Generated from the code. A hand edit is reverted by the next build | **No. Regenerate**
`archive` | A record of what was true then | **Never.** Editing it destroys the record
`superseded` | Replaced. Kept so links do not rot | Never

```bash
# what tier is this file?
head -12 docs/pack/<file>.md
```

### 4.1 Canonical, by subject

Subject | The one home
Feature ids | `10-FEATURE-REGISTER.md`
Screen ids | `11-SCREEN-INDEX.md` and `12-screens/`
User-facing strings | `16-COPY-DECK.md`
Errors and refusals | `17-ERROR-AND-REFUSAL-CATALOGUE.md`
Engine refusals | `26-ENGINE-REFUSAL-CATALOGUE.md` and `specs/engine/`
Acceptance criteria | `19-ACCEPTANCE-CRITERIA.md`
Caps, prices, entitlements | `53-PRICING-AND-ENTITLEMENTS.md`
Events | `55-MEASUREMENT-AND-EVENTS.md`
Design tokens | `58-DESIGN-SYSTEM.md`
Open decisions | `56-OPEN-DECISIONS.md`

**If a number appears in two places, one of them is wrong.** The validator checks this, at the
`covers` key.

### 4.2 Archive, and it is most of `docs/`

Archive | What it records
`docs/research/2026-09-09/` | Nine lenses. **`VERIFIED-2026-09-09.md` overrides them where they disagree**
`docs/research/2026-09-13/` | The reset round
`docs/research/2026-09-18/` | Nine lenses, 178 findings. **The current evidence**
`docs/research/2026-09-18-llm/` | Free models, abuse guardrails, router design
`verify/2026-09-17/` | The independent audit, 77 findings
`docs/MAP.md`, `docs/DECIDE.md`, `docs/PRODUCT.md`, `docs/THESIS.md`, `docs/PRODUCT-BRIEF.md` | **A previous generation.** Historically useful, not current
The `HANDOFF-*.md` files at the root | Earlier handovers, superseded by this pack

**The rule that catches people out.** An archive is not stale because it is old. **It is a record
of what was believed then**, and a freshness review that updates it has destroyed the only copy.

**One exception, and it is the only one.** If an archive contains a live credential: **rotate
first, erase second, and accept the hole in the record.**

---

## 5. Where the secrets live

**No value appears in this pack, in any file, anywhere.** What follows is where to look and how to
use it, and nothing else.

### 5.1 The file

**One file holds every token**, at a path under the user's own configuration directory,
`.config/codex-env/tokens.zsh` in their home. It is **not** in this repository and must never be.

**Use it like this**, and only like this:

```bash
source <the token file> && <the command that needs it>
```

**Three rules, and the first one is absolute.**

1. **Never `cat`, `echo`, `printf` or otherwise print the file or any value in it.**
2. **Source it in the same shell invocation as the command.** Environment variables do not survive
   between tool calls.
3. **Do not source it when the command does not need it.** A read-only public endpoint needs
   nothing.

### 5.2 Which name does what, with no values

Name | What it opens | The trap
`GH_TOKEN_ZEPHYRUS` | `studiozephyrus/frontmatter` | **The general `GH_TOKEN` cannot fetch this repository at all**
`VERCEL_TOKEN_ZEPHYRUS` | The app, team `zsco` | **Always** with `--scope zsco`
`VERCEL_TOKEN`, bare | The decisions site, a different team | Using it for the app deploys to the wrong place
`CLOUDFLARE_API_TOKEN` | The zone `frontmatter.in` | It is on **a founder's personal account**, deliberately
Firebase credentials | Project `frontmatter-md` | Leaves the stack in phase A

**The one command that must never be run:**

```
gh auth login        # NO
gh auth setup-git    # NO
```

**Both rebind every repository on the machine to the wrong identity.** Pass the token per command
instead: `GH_TOKEN="$GH_TOKEN_ZEPHYRUS" gh <cmd>`.

### 5.3 Production environment

**Production environment lives in Vercel only. Never commit a secret.** For local development:

```bash
npx vercel env pull .env.local --environment=production
# then point auth at localhost
sed -i '' 's|^AUTH_URL=.*|AUTH_URL="http://localhost:3000"|' .env.local
```

**And register `http://localhost:3000/api/auth/callback/github`** on the GitHub OAuth App before
signing in locally, or sign-in fails with no useful message.

### 5.4 If you have no tokens at all

**Most of this pack is readable and most of the repository is buildable without any of them.**

Without tokens you can | You cannot
Read every document | Fetch or push the repository
Run `npm run verify`, `arch`, `spec`, `corpus`, `test` | Deploy
Regenerate the derived files | Pull the production environment
Write specifications and screens | Sign in to the running app

**So a cold agent with no credentials is not blocked.** Say what you could not do and hand it back.

---

## 6. Proving the repository is healthy

**Run these in this order.** Each prints a number, and the numbers below are what they printed on
18 September at commit `0af3c90` `[O]`. **Compare, do not assume.**

### 6.1 The five commands

```bash
node --version                 # matches .nvmrc
npm ci                         # or npm install on a first clone
npm run arch                   # the clean-architecture report
npm run spec                   # the contract gate
npm run corpus                 # the byte-pinned corpus
npm run test                   # vitest
npm run verify                 # all of the above plus typecheck, lint and build
```

### 6.2 What each one printed, measured

Command | Output on 18 September | What a difference means
`npm run arch` | `"total": 0`, `"filesScanned": 214`, no violations | **Any non-zero total is an inward-only breach.** Fix before anything else
`npm run spec` | `4 scanned, 0 errors, 0 warnings`, `ungoverned 169 of 171 module files`, `states draft=4` | **The ungoverned count is expected while bootstrapping.** Errors are not
`npm run corpus` | `CORPUS CLEAN 8513/8513 byte-identical`, 0 changed, 0 missing, 0 extra | **One changed byte fails it.** That is the point
`npm run test` | **100 test files, 1,598 passed, 6 expected fail**, 6.33 seconds | **The 6 expected failures are a known-bug ledger, not a break**
`npm run verify` | Runs typecheck, lint, test, build, arch and spec | A red gate stops the work

### 6.3 Two gates that look green and are not

- **`npm run budget` is an `echo`.** There is no bundle budget. It cannot fail, so it proves
  nothing.
- **`mdmax cert` is not among the 26 npm scripts.** If a document tells you to run it, the
  document is stale.

### 6.4 The pack's own gates

```bash
python3 docs/pack/tools/validate-pack.py           # front matter, one-home, citations, dashes
node docs/pack/tools/gen-codemap.mjs --check       # is the codemap stale
python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <f> --strict   # the writing gate
```

**The writing gate must print PASSED before any pack file is finished.** The validator must print
0 problems.

**A note on the codemap check.** It goes red the moment anybody adds a file, which is correct.
**Regenerate derived files last**, after everybody else has stopped.

---

## 7. Moving to another machine

### 7.1 The clone

```bash
source <the token file> && \
  GH_TOKEN="$GH_TOKEN_ZEPHYRUS" gh repo clone studiozephyrus/frontmatter
cd frontmatter
git fetch --all
git log --oneline -1
```

**If the clone fails with "Repository not found"**, the token was not sourced and the keychain
answered with the personal account. That error message is always this cause.

### 7.2 What comes with the repository and what does not

Comes with it | Does not
Every document, including this pack | Any secret
The whole source tree | The production environment
The fonts, embedded in `docs/mvp0/screens/fonts.css` | Deploy access
The Material Symbols, committed as SVG in `docs/mvp0/screens/icons/` | The Firebase project
The 8,513-file byte-pinned corpus | Razorpay, which is not opened

**Two of those are deliberate and worth knowing.** The fonts and the icons are committed rather
than fetched, **so the screens build with no network.** An earlier version cached icons in a
session scratchpad, the scratchpad was wiped on resume, and the generator threw "icon missing".

### 7.3 What has no second copy

**Say this out loud before assuming anything is safe.**

- **Nothing in this pack is published anywhere.** The repository is the only copy.
- **The founders' review of 18 September exists only as
  `docs/mvp0/SCREEN-CHANGES-2026-09-18.md`.** It was spoken, then written down once.
- **The research rounds are the only record of what was opened.** The pages themselves change.

---

## 8. Moving to another tool or account

### 8.1 What a different tool needs to know

Fact | Why it matters
**Claude Code reads `CLAUDE.md` and not `AGENTS.md`** | `CLAUDE.md` loads it with an `@AGENTS.md` line. Other tools read `AGENTS.md` directly
Neither `.cursorrules` nor `GEMINI.md` exists here | A tool that reads only those gets nothing. **Point it at `63-AGENT-CONTRACT.md`**
The four overriding rules are in `AGENTS.md` section 0 | And gathered in `63-AGENT-CONTRACT.md` section 1
A blocked tool is one tool's policy | **Test the alternative before concluding the capability is gone.** `63-AGENT-CONTRACT.md` section 7
A knowledge graph of this pack exists, but only on the machine that built it | `docs/pack/graphify-out/` is git-ignored. Rebuild it with `cd docs/pack && graphify update .`, outside any OS sandbox that denies `.env.*` files. Then `graphify query "<question>"` answers from the graph instead of a read of every file

### 8.2 The paragraph to paste into a new tool

Copy this verbatim into the first message of a fresh session on any tool.

> You are working in the `frontmatter` repository, a byte-exact markdown editor for documents
> written with and for AI agents. Read `docs/pack/64-PORTABILITY-AND-HANDOVER.md` first, then
> `docs/pack/63-AGENT-CONTRACT.md`, and follow both. Four rules override everything: a test on a
> rare fault must fail against the unfixed code before it proves anything; refuse rather than
> guess; re-derive every number at write time; and propose rather than commit, because the
> reconciliation of `git rev-parse HEAD` before and after is the gate rather than the instruction.
> Never open `docs/FRONTMATTER-RECORD.md`, `docs/FRONTMATTER-PRD-v2-2026-08-29.md`,
> `docs/FRONTMATTER-COMPLETE-RECORD-2026-08-30.md`, `ENGINE.md` or `DEV-PLAN.md` with a whole-file
> read. Cite `docs/mvp0/PRODUCT-PLAN.md` by section and never by line. British spelling, no em
> dashes, and run the writing gate before finishing any document.

### 8.3 What breaks when an account changes

What | What to do
The token file is on the old machine | It is the user's, outside the repository. **Ask them to bring it. Do not reconstruct it**
The tool cannot reach a host | Read the refusal. If the host is one the task needs, say so and stop
A model provider changes its terms | `54-COMPLIANCE-AND-LEGAL.md` section 4. **A provider whose terms nobody has opened cannot be switched on**
Line citations into the plan have rotted | Cite the section. `61-DOCUMENTATION-PRACTICE.md` section 7, rule 4

---

## 9. The handover template

**Copy this, fill every line, and leave nothing blank.** A blank line in a handover is a question
the next person cannot ask.

```markdown
# Handover, <date>, <from> to <to>

## 1. Where things are
- Repository: studiozephyrus/frontmatter
- Branch: <branch>
- HEAD: <git rev-parse --short HEAD>, dated <git log -1 --format=%cs>
- Unpushed commits: <git log --oneline origin/<branch>..HEAD | wc -l>
- Uncommitted files: <git status --short | wc -l>
- Worktrees: <git worktree list>

## 2. Health, measured just now
- npm run arch   -> total <n>, filesScanned <n>
- npm run spec   -> <n> scanned, <n> errors, <n> warnings
- npm run corpus -> <n>/<n> byte-identical
- npm run test   -> <n> files, <n> passed, <n> expected fail
- validate-pack  -> <n> problems
- gen-codemap --check -> up to date / STALE

## 3. What I did
One line per change, with the file path. No summaries.

## 4. What I did NOT do, and why
The list that matters more than section 3.

## 5. What is in flight
Anything half-finished, with the exact file and the exact line.

## 6. Decisions I took that somebody may disagree with
With the reasoning, so it can be reversed rather than re-derived.

## 7. Decisions I did not take, and who has to
Cross-referenced to 56-OPEN-DECISIONS.md by id.

## 8. Numbers I quoted, and how each was derived
The command beside each one. A number with no command is not a number.

## 9. What I could not verify
Everything marked UNVERIFIED, gathered.

## 10. Dead ends
What I tried that did not work, so nobody repeats it.

## 11. What to do next, in order
Three to five items. Not a backlog.
```

### 9.1 The three sections people skip, and why they are the valuable ones

- **Section 4, what I did not do.** A handover that lists only accomplishments hands over a
  distorted picture of the state.
- **Section 10, dead ends.** The single highest-value part of any handover. It is the only thing
  the next person cannot rediscover cheaply.
- **Section 8, the derivations.** Without it, every number becomes folklore in one hop.

---

## 10. The ten things that will trip you up

Gathered from the whole pack, because each of these has already cost somebody a round.

1. **`docs/MAP.md` routes you to a previous generation of the product.** Section 3.
2. **`npm run budget` is an echo.** It cannot fail.
3. **A line citation into `docs/mvp0/PRODUCT-PLAN.md` rots within the hour.** Cite the section.
4. **`curl -sL` on a deployed URL returns 200 from a login page.** Use `curl -sI`.
5. **A new file in `public/` needs the proxy's extension list**, or it 307s to `/login`.
6. **Vercel's TypeScript is stricter than local.** `npm run build` or be surprised in production.
7. **A Zustand selector that returns a new object loops forever.** Derive in `useMemo`.
8. **The persistence keys keep the legacy `sgnk-md` prefix on purpose.** Renaming one orphans a
   user's drafts.
9. **The engine is built and wired to nothing.** A screen picture is not a running interface.
10. **Two Vercel teams, two GitHub tokens.** The wrong one deploys to the wrong place, silently.

---

## 11. Limits of this file

**What was not assessed.**

- Whether a cold agent can actually follow this. **Nobody has tried it.** That is the test this
  file most needs and it has not been run.
- Recovery from a lost repository. Section 7.3 says there is no second copy and stops there.
- Onboarding a person rather than an agent. The order in section 2 assumes a reader who can hold
  ninety minutes of documents at once.

**What could not be verified.**

- **Confirmed: Claude Code reads `CLAUDE.md`, not `AGENTS.md`** `[M]`. Anthropic's memory page,
  `https://code.claude.com/docs/en/memory.md`, opened 18 September 2026: "Claude Code reads
  `CLAUDE.md`, not `AGENTS.md`." It recommends a `CLAUDE.md` that imports `@AGENTS.md`, which is
  what this repository's `CLAUDE.md` does.
- `UNVERIFIED:` section 7.1's clone command. It was not run, because the tokens are deliberately
  unreadable from here. Its target matches `[O]`: `git remote get-url origin` prints
  `https://github.com/studiozephyrus/frontmatter.git`. needs: one run of section 7.1 by a founder in
  a fresh directory.
- The health numbers in section 6.2 were measured at one moment `[O]` and the repository is being
  edited by several writers. **Re-run them.**
- `INFERENCE:` the reading order in section 2 is mine. It is reasoned from which file makes which
  other file legible, and it has not been tested on anybody.

**What would falsify it.**

- **A cold agent following section 2 and then asking a question a human has to answer.** That is
  the falsification test, and it is cheap to run: give a fresh session this file and a task, and
  watch for the first question.
- A command in section 6 printing something this file does not predict would mean the health check
  measures the wrong things.
- If the pack outgrows a ninety-minute cold start, section 2 stops being a reading order and
  becomes a wish.
