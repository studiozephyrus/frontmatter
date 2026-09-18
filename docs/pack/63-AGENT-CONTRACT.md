---
id: 63-AGENT-CONTRACT
title: Agent contract
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [agent-contract, agent-rules, reconciliation]
---

# 63. Agent contract

**What this file is.** What an agent working in this repository must and must not do, gathered in
one place so that a tool which reads one file reads all of it.

**Its sources, both at the repository root.** `AGENTS.md` and `CLAUDE.md`. **Those two are the
operational contract and they are already true.** This file gathers them, adds what the pack has
learnt, and never contradicts them.

**Which file a tool reads.** Claude Code reads `CLAUDE.md` and does **not** read `AGENTS.md`.
`CLAUDE.md` loads it with an `@AGENTS.md` line. **Other tools read `AGENTS.md` directly.** So a
rule that lives in only one of them is invisible to half the tools, and that is why this file
exists.

---

## 1. The four rules that override everything

`AGENTS.md` section 0. If any other rule in any document conflicts with one of these, **these
win.**

### R1. Red proof before green

**A test on a rare fault proves nothing until it fails against the unfixed code.** If you cannot
make it fail, say the test does not cover the bug rather than reporting a pass.

**The repository already holds two of these**, and they are the model to copy:

- `test/corpus/foreign/nf-001-red-proof.test.ts`
- `test/corpus/foreign/nf-003-red-proof.test.ts`

**Why this is rule one.** A defect that needs an exact byte offset fires in a fraction of a per
cent of real files. A green suite is the expected result of running it, with or without the bug.

### R2. Refuse rather than guess

**Returning the input unchanged is a correct outcome for this product. Guessing is not.** This is
the whole differentiation, and it applies to the agent as much as to the engine.

**In practice, for an agent:** if you cannot locate a byte range unambiguously, if a citation
cannot be checked, if a number cannot be derived, **stop and say so.** A document that says "I
could not check this" is worth more than one that reads confidently and is wrong.

### R3. Re-derive every number at write time

Not carried forward. Not remembered. **Derived, with the command shown.**

**The evidence that this rule is necessary:** the plan's own section 57 lists twenty numbers that
went stale because somebody carried them forward.

### R4. Agents propose, the founder merges

**Capture `git rev-parse HEAD` before and after any agent run and reconcile the delta.**

> **The instruction not to commit is advisory. The reconciliation is the gate.**

Section 3 is how.

---

## 2. What an agent must never do

Each row says what it is and what happens if you do it anyway.

Never | Why
**Commit or push unless a person asked in that turn** | R4. A prompt forbidding it is not a control, and this repository has watched five unauthored commits land mid-run
**Run `gh auth login` or `gh auth setup-git` with the Zephyrus token** | **Both rebind every repository on the machine to the wrong identity.** Pass it per command instead: `GH_TOKEN="$GH_TOKEN_ZEPHYRUS" gh <cmd>`
**Use the bare `VERCEL_TOKEN` for the app** | The app lives on team `zsco`. Always `--scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"`
**`cat`, `echo` or print the token file** | `/Users/sagnikmitra/.config/codex-env/tokens.zsh`. Source it in the same invocation as the command that needs it, and never read it
**Open a large document with a whole-file read** | `docs/FRONTMATTER-PRD-v2-2026-08-29.md` is 760 KB, `docs/FRONTMATTER-RECORD.md` is 2.1 MB, `ENGINE.md` and `DEV-PLAN.md` are each about 250 KB. **One read blows the context window.** Use `grep -n`, then `sed -n 'START,ENDp'`
**Invent a citation** | Check `docs/FILE.md:NNN` with `sed -n 'NNNp' <file>` first. Fabricated citations have happened here and are checked mechanically
**Invent a number** | R3. If there is no number, choose a form that needs none
**Trust a research quotation without re-fetching it** | A pass on 2026-09-09 fabricated quotes from VS Code's documentation while getting the facts right. **Roughly one quotation in three across that run was a paraphrase inside quotation marks**
**Use `curl -sL` to check a deployed URL** | **A login page returns 200 after a redirect.** Use `curl -sI`
**Hand-edit a Tier-1 derived document** | They are built from `docs/research/`. A hand edit is reverted by the next `npm run tree`
**Write `state: verified` by hand** | **Only the harness writes it**, and only after every `verify:` command exits 0 and a red proof exists
**Add a `src/server/`, `src/lib/` or `src/components/` folder** | Banned by the architecture gate
**Import `@/server/*`, `@/lib/*` or `@/components/*`** | Banned in `eslint.config.mjs` at `no-restricted-imports`
**Deep-import another module** | Cross-module imports go through the barrel, `@/modules/<name>`, never `@/modules/<name>/presentation/foo`, **even for types**
**Read `process.env` outside `src/config/` and `*/infrastructure/`** | The architecture gate catches it
**Return a new object, array or Set from a Zustand selector** | Zustand v5 compares with `Object.is` and an inline `new Set(...)` causes an infinite render loop. Derive in `useMemo` during render
**Use `force-dynamic` and `revalidate` together** | A contradiction. Pick one
**Import `react-dom/server`, chromium or `puppeteer-core` at module scope** | Import dynamically inside the server route handler, and list `@sparticuz/chromium` and `puppeteer-core` in `serverExternalPackages` **and** `outputFileTracingIncludes`
**Rename a persistence key** | `sgnk-md`/`drafts`, `sgnk-md:dirty`, `sgnk-md-bookmarks`, `sgnk-md-editor-settings`, `sgnk-md-editor`, and the Tauri bundle id `ai.sgnk.md`. **Renaming one silently orphans a user's local drafts and settings**
**Use an emoji as an icon, an icon web font, or a second icon library** | Google Material Symbols, Rounded, as inline SVG. Nothing else
**Use an em dash or an en dash** | Anywhere, ever. A full stop, a comma or brackets does the same work
**Re-litigate a settled position** | Section 6

---

## 3. The reconciliation gate

**This is R4 made operational, and it is the only rule in this file with a mechanism rather than
an instruction.**

### 3.1 The procedure

```bash
# before the agent runs
git rev-parse HEAD > /tmp/before.sha

# ... the agent runs ...

# after
git rev-parse HEAD
git log --oneline "$(cat /tmp/before.sha)"..HEAD
git status --short
```

**If the two hashes differ, the agent committed.** Read every commit in the range before doing
anything else.

### 3.2 Why the prohibition is not the gate

**Verified on 2026-06-30, elsewhere in this workspace:** five unauthored commits landed during a
run in which every subagent prompt carried an explicit instruction not to commit.

**So: treat the prohibition as advisory and the reconciliation as the control.** The damage was
nil only because that repository had no remote, and nobody should rely on that here, where
`origin` points at `studiozephyrus/frontmatter`.

### 3.3 The second half, which is easier to forget

**`git commit` commits the index, not the paths you just added.**

```bash
git show --name-only HEAD | grep -vcE '<paths that are mine>'   # must print 0
```

**If it does not, fix it with `git reset --mixed <upstream>`**, which touches the index only.
Never `git stash` somebody else's dirty files.

**And before building on `main` at all:** `git fetch`, then compare `origin/main` to `HEAD`. A
clone a hundred commits behind produces work that collides with what is already live.

---

## 4. Before you write code

From `AGENTS.md` section 0.1. **Run these, in this order.**

```bash
npm run spec      # the contract gate, must be 0 errors
npm run corpus    # 8,513 byte-pinned files, exits 1 on one changed byte
npm run verify    # typecheck, lint, test, build, arch, spec
```

### 4.1 The gates, one line each

Command | What it does | When it must be green
`npm run typecheck` | `tsc --noEmit` | Before every commit
`npm run lint` | `eslint --max-warnings=0` | Before every commit
`npm run test` | vitest | Before every commit
`npm run build` | `next build` | Before every commit, because **Vercel is stricter than local**
`npm run arch` | The clean-architecture report | Before every commit
`npm run spec` | The contract gate | Before every commit
`npm run corpus` | The byte-pinned corpus | Before touching the engine
`node specs/harness/restamp-prd.mjs --check` | Do the specs still cite sections that exist | Before touching a spec

**A red gate stops the work.** Do not accumulate violations.

### 4.2 Why `npm run build` is not optional

Production `tsconfig.json` has `strict`, `noUncheckedIndexedAccess` **and**
`exactOptionalPropertyTypes`. **Local `npm run typecheck` can pass while Vercel fails.**

**The rule that follows:** an optional property that can be explicitly `undefined` is declared
`?: T | undefined`, never bare `?: T`. Under `exactOptionalPropertyTypes` the bare form rejects
`undefined` as a passed value.

### 4.3 Two gates that are not what they look like

- **`npm run budget` is an `echo`.** There is no bundle budget. Do not read a green from it.
- **`mdmax cert` is not among the 26 npm scripts.** Counted at write time `[O]`.

---

## 5. The architecture, as an agent has to obey it

### 5.1 The dependency direction

```
domain  <-  application  <-  infrastructure
                ^                 ^
          presentation        container
                ^
              app
```

**Inward only.** Application never imports infrastructure; it names a port.
App routes never import infrastructure; they use the composition root at
`src/container/dependency-container.ts`.

### 5.2 Always-green, and what breaks them

Gate output | Must be | Broken by
`clean-architecture-report` total | **0** | An inward-only breach
`server-folder-blocklist` | **empty** | A `src/server/` folder
`import-boundary-report` | **empty** | A deep cross-module import

### 5.3 Public static assets, which is the recurring failure

**Any new file in `public/`, and any Next metadata route emitting a file, is auto-allowlisted by
extension** in `src/proxy.ts`. The rule is one regex, `PUBLIC_STATIC_RE` at line 15, plus a
matcher exclusion that mirrors it.

**The extensions, read from the file** `[O]`:

```
svg png jpg jpeg gif ico webp avif webmanifest xml txt json js map
```

**The failure that keeps happening.** An agent drops an asset, forgets the proxy, the auth
redirect sends the URL to `/login` with a 307, and the browser shows a broken image.

**Verify every new public asset:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/<asset>
# 200 is right. 307 means the proxy is redirecting it.
```

**Two rules around it.** If you need an extension that is not in the list, **edit both the regex
and the matcher in the same commit**; they must mirror. And a public route that is not at
`/<name>.<ext>`, such as `/login` or `/p/<slug>`, goes into `isPublicPath()` explicitly, at line
59.

---

## 6. Settled, and not to be re-litigated

From `CLAUDE.md`. **An agent that reopens one of these is burning a turn.**

Settled | The position
The markdown format | **Build a compiler and an editor, not a new format**
The render carrier | **`> [!kind]` callout for prose, a fenced block for opaque data.** An unclosed fence swallows the document; a callout has no closer to lose
Sync | **git-merge plus a splice journal and content-addressed storage, never a conflict-free replicated data type.** One caveat: Zed Delta now stakes span attribution on one in public, so **a written rebuttal is owed**, naming them
Object versioning | **R2 has no object versioning**, so disaster recovery is built into the key layout
The payment ceiling | **15,000 rupees a transaction is architectural**, a Reserve Bank of India limit, and Indian cards get one attempt
Review state | **Dropped.** The per-span read sidecar never existed in code, failed an adversarial round, and Almanac shipped it and shut down. **The change queue replaces it**

---

## 7. What a blocked tool means

**A blocked tool is one tool's policy. It is never the machine's reach.**

**The evidence, and it cost a whole research round** `[O]`. A taint gate refused `WebFetch`. A
round of eighteen agents across eight lenses therefore opened **zero** primary sources, wrote that
limitation into its conclusions, and its own critic named the resulting unverifiability as the
largest structural risk in the record.

**`curl` was never blocked.** One command would have shown it. Once tested, arXiv, the arXiv API,
`raw.githubusercontent.com`, `docs.claude.com` and PubMed were all reachable, and the next round
hit 72 of 72 findings from opened sources.

### 7.1 The rule

**When a tool is refused, test the alternatives before concluding the capability is gone.**

Refused | Try
A fetch tool | `curl -sL --compressed`, and `curl -sI` for a status check
A search tool | The provider's API over `curl`, or a public JSON endpoint
A write outside the sandbox | Write inside it, and hand the path back
A shell command the sandbox denies | Read the violation message. It names the host or the path

### 7.2 And the other half of the rule

**A denial on a credential, a file or a host the task does not involve is the boundary working.**
Report it and stop. Do not route around it.

**The difference is whether the thing was given to you for this task.** A refused fetch of a
public documentation page is a tool's policy. A refused read of somebody's private key is not.

---

## 8. Accounts, and the two Vercel homes

**This repository is not on the personal accounts.** From `CLAUDE.md` and `AGENTS.md` section 6b,
which is authoritative.

Surface | Owner | Token
GitHub | `studiozephyrus/frontmatter` | **only** `GH_TOKEN_ZEPHYRUS`. The general `GH_TOKEN` cannot fetch it
The app on Vercel | team `zsco`, `team_RSlKvg8AqX8hr5WIuKXlNXGE` | `VERCEL_TOKEN_ZEPHYRUS`, **always** with `--scope zsco`
The decisions site on Vercel | `team_CDEATPKml1m8SIZSJ0DKdEjG` | the **bare** `VERCEL_TOKEN`
Firebase | `frontmatter-md` | a studio account
Cloudflare | **a founder's personal account**, zone `frontmatter.in` | a deliberate split

**A push that fails with "Repository not found" almost always means the token file was not
sourced**, and the keychain answered with the personal account instead.

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && git push
```

---

## 9. Prose, when an agent writes any

- **British spelling.** Behaviour, licence as the noun, recognise, artefact.
- **No em dash and no en dash.** Anywhere, ever.
- **Nothing over about forty words in a paragraph.** Bullets and tables carry the structure.
- **Every claim carries its caveat**, and every judgement file ends with its limits.
- **Run the writing gate before finishing:**
  `python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <path> --strict`. It must print PASSED.
- **Run the pack validator** if you touched `docs/pack/`:
  `python3 docs/pack/tools/validate-pack.py`. It must print 0 problems.
- **Write one file at a time and save it before starting the next.** A previous fan-out held
  several in memory and lost 1,087 edits.

---

## 10. The contract, as one page

If an agent reads nothing else in this file, these nine lines.

1. **Red proof before green.**
2. **Refuse rather than guess.**
3. **Re-derive every number at write time.**
4. **Propose. Do not commit. Expect to be reconciled anyway.**
5. **Never open the four large documents with a whole-file read.**
6. **Check every citation with `sed -n 'NNNp'` before writing it.**
7. **`npm run verify` must be green before a commit exists at all.**
8. **A blocked tool is one tool's policy. Test the alternative.**
9. **British spelling, no em dashes, and the writing gate must print PASSED.**

---

## 11. Limits of this file

**What was not assessed.**

- Whether any agent follows it. Nothing here is enforced by a hook, and section 3.2 is the record
  of a prompt-level prohibition failing.
- The other tools' own configuration. `.cursorrules`, `GEMINI.md` and their equivalents do not
  exist in this repository, so a tool that reads neither `AGENTS.md` nor `CLAUDE.md` gets nothing.
- Anything about what an agent may do at run time **inside the product**. That is the propose
  scope in `51-PRODUCT-PLAN.md` section 4.3 and the role matrix, not this file.

**What could not be verified.**

- `UNVERIFIED:` the claim that Claude Code does not read `AGENTS.md`. It comes from `CLAUDE.md`'s
  own first line and was not tested.
- `INFERENCE:` section 7's rule is general and its evidence is from another repository in the same
  workspace, not from this one.
- The five unauthored commits in section 3.2 are recorded elsewhere in the workspace and were not
  re-read for this file. **They are cited as a class of failure, not as a fact about this
  repository.**

**What would falsify it.**

- An agent run that reconciles clean every time for a month would suggest section 3 is heavier
  than it needs to be. **One that does not would prove it is not heavy enough.**
- If `AGENTS.md` or `CLAUDE.md` changes and this file does not, this file is wrong and they are
  right. **They are the contract and this is the gathering of it.**
