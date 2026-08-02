---
mdmax: 1
section: 11
title: "The execution plan — every step, in order, with gates"
slug: 11-execution
lines: 1228
words: 12049
forward_links: [0, 1, 2, 3, 4, 5, 7, 9, 10]
backlinks: [0, 6, 9, 12, 13, 14]
prev: 10-engine-spec
next: 12-risks
---

[← Index](README.md) · [← §10 Engine spec](10-engine-spec.md) · [§12 Risks →](12-risks.md)

## 11. The execution plan — every step, in order, with gates

This section says what to do, in what order, who does it, which files it touches, what command
proves it done, and what happens if it does not get done. It is written for someone who has never
opened this repository. Every path is real and was read on 2026-08-01. Every number carries a source.

**Three words, used strictly.**

- **DECIDED** — settled. Do not re-litigate without new measurement.
- **RECOMMENDED** — the research points here, but a founder call has not been recorded. Make it.
- **OPEN** — genuinely unresolved. Named so it cannot be quietly assumed away.

**Evidence tags, used on every claim.** `[measured]` we ran it · `[primary]` we read the source ·
`[secondary]` · `[inference]` · `[SIMULATED]` replayed through code, not read from a live system.

**Effort unit.** One **founder-day** = one person, six focused hours. Estimates are for Sagnik at
current velocity. The measured baseline for calibration: **532 insertions into `src/` in the 19 days
between the clone and 2026-08-01**, across three commits — `8eb4de2` 364, `58322f7` 124, `6ef83a9`
44. `[measured, final-gate area premortem, N1]` That is roughly **28 lines of product source per
day**. Every estimate below assumes that number goes up by an order of magnitude once the work is
code instead of prose. If it does not, kill gate **K2** (§11.14) is the instrument that says so.

---

### 11.1 The sequence at a glance

| # | Step | Owner | Effort | Blocked by | Blocks | The gate that closes it |
|---|---|---|---|---|---|---|
| **0** | Repo hygiene — the vitest exclude, the stale records | Sagnik | 0.5 d | nothing | nothing (but poisons every gate below if skipped) | `npx vitest list --filesOnly \| wc -l` returns **83**, not 247 |
| **1** | **The second user** — signup, tenancy, per-user attribution | Sagnik (or Amit, see §11.13) | 8–12 d | nothing | 3, 4, 6, 7, 8 | `test/tenancy/second-user-writes.test.ts` green, having been committed RED |
| **2** | **The frontmatter splice** — fix the two shipped destroyers | Sagnik or one dispatched agent | 0.5 d | nothing (parallel with 1) | 6 (suggestions), 7 | publish→unpublish byte-identical on **907/907**, no 502 on the **171** |
| **3** | **Wedge A** — "your vault, in any browser" | Sagnik | 15–25 d | 1 | revenue | a stranger signs up, connects a repo, edits on phone and laptop |
| **4** | **Share links** with roles, expiry, comment box | Sagnik | 5–8 d | 1, and reopening D3 | 6 | a link with role `commenter` cannot edit; an expired link 410s |
| **5** | **`mdmax cert`** — the capped give-away | one dispatched agent | **2 d, hard cap** | 5 conversations (§11.12.7) | nothing | `npx mdmax cert` on a corpus we did not write; K5 evaluated |
| **6** | **The review loop** — sidecar comment threads | Sagnik + Amit | 20–30 d | 1, 2, 4 | the company | delete the sidecar → `git status` clean, every file byte-identical |
| **7** | **pack/unpack** — see §11.9, contested | nobody yet | 0 d until its precondition fires | 2, plus a founder answer and a live-model number | nothing | see §11.9 — it may never open |
| **8** | **Real-time collaboration** | — | — | **not this cycle** | — | — |

**Two research lenses disagree about the order of steps 1 and 2, and the disagreement does not
matter.** The `product-market` lens ranks the second user first and the splice writer third; the
`premortem-integrator` lens ranks the splice writer second and the second user third.
`[primary, final-gate synthesis lenses 1 and 3, ranked arrays]` They are disjoint: step 1 touches
`src/modules/auth`, `src/config`, `src/container`, `src/app/(auth)`; step 2 touches
`src/modules/share/infrastructure` and a new `src/modules/share/domain`. No shared file. Run them in
parallel — which is exactly what the module boundary in §11.11 exists to make safe. **DECIDED.**

---

### 11.2 Step 0 — Repo hygiene · half a day · do it before anything else

Nothing here is interesting. All of it invalidates a gate downstream if skipped, which is the only
reason it is first.

#### 11.2.0 What is already done — a correction to the record

The `premortem-integrator` lens ranks *"push the branch, commit the evidence base, and restore
`package.json`"* as item 0, on the evidence that `origin/main` had not moved since 2026-07-25 and
that `git branch -r --contains HEAD` returned zero remote branches.
`[primary, final-gate synthesis lens 3, ranked[0]]`

**That is now stale, and this document says so rather than repeating it.** Verified live 2026-08-01:

```
$ git for-each-ref --format='%(refname) %(objectname:short)'
refs/heads/engine/plan-and-diagnostics    1bd4dad
refs/remotes/origin/engine/plan-and-diagnostics 1bd4dad     ← the branch IS pushed
refs/remotes/origin/main                  8eb4de2

$ git rev-list --left-right --count origin/main...HEAD
0   17                                                       ← 17 ahead, 0 behind

$ wc -l package.json
97                                                           ← restored; every script present
```
`[measured, run 2026-08-01]`

`docs/mdmax/PLAN.md`, `docs/engine/research/` and the `HANDOFF-*.md` files are committed and pushed
in `1bd4dad`. Risk **N8 — the evidence base evaporated** is retired. What remains of item 0 is the
list below.

#### 11.2.1 The vitest exclude — the largest single stale record in the repo

**The problem, measured live rather than quoted:**

```
$ npx vitest list --filesOnly | wc -l
     247
$ npx vitest list --filesOnly | grep -c '\.claude/worktrees'
     164
```
`[measured, run 2026-08-01]` — **164 / 247 = 66.3968%**, i.e. **66.4% of the test files vitest
collects are not in this branch's source tree at all.**

They are in two abandoned git worktrees:

```
$ git worktree list
/Users/…/frontmatter                                   1bd4dad [engine/plan-and-diagnostics]
/Users/…/frontmatter/.claude/worktrees/competent-bassi-5da9a1  8eb4de2 [claude/competent-bassi-5da9a1]
/Users/…/frontmatter/.claude/worktrees/upbeat-euclid-60dbf4    8eb4de2 [claude/upbeat-euclid-60dbf4]
```
`[measured]` Both are pinned at **`8eb4de2`, dated 2026-07-25** — the commit *before* any of the
engine work. `[measured]` Both are 17 commits behind HEAD.

**Why vitest sees them and git does not.** `.gitignore:12` contains `.claude/worktrees/`, so git
ignores them. Vitest does not read `.gitignore`. Its entire default exclusion list is two entries:

```
$ node -e "const c=require('vitest/config'); console.log(JSON.stringify(c.defaultExclude))"
["**/node_modules/**","**/.git/**"]
```
`[measured; also readable at node_modules/vitest/dist/chunks/defaults.9aQKnqFk.js:6]`

`vitest.config.ts` sets `environment`, `setupFiles` and a `@` alias, and **does not set `exclude` at
all** `[primary, vitest.config.ts]`. So the default applies, `.claude/worktrees/**` is not in it, and
every `npm run test` in this repo has been running two copies of a month-old test suite alongside the
real one.

**Why this is a gate problem and not a tidiness problem.** Steps 1, 2, 4 and 6 below are all gated on
"a named test goes from red to green." A suite where two thirds of the files are frozen at a
pre-work commit can (a) go green on stale code while the live code is red, (b) go red on a stale
file and send someone hunting a regression that does not exist — which is Learned Rule #65's exact
failure mode, *"a harness that reports false FAILures trains you to ignore it"* — and (c) mask a
deleted test, because the deleted copy still exists in two worktrees.

**The fix.**

```ts
// vitest.config.ts
import { defineConfig, configDefaults } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    exclude: [
      ...configDefaults.exclude,   // **/node_modules/**, **/.git/**
      "**/.claude/**",             // agent worktrees, scratch, settings
      "**/src-tauri/**",           // Rust shell, its own toolchain
      "**/.next/**",
    ],
  },
  resolve: { alias: { "@": resolve(__dirname, "./src") } },
});
```

**Acceptance gate.** `npx vitest list --filesOnly | wc -l` returns **83**, and
`npx vitest list --filesOnly | grep -c worktrees` returns **0**. Then `npm run test` and record the
pass/fail count in the commit message — that is the first honest baseline this repo has had.

**Then deal with the worktrees themselves.** They are 17 commits behind and were created by agent
runs that finished. **RECOMMENDED:** remove both — `git worktree remove .claude/worktrees/<name>`
for each, then `git worktree prune` — and adopt the preflight in §11.11.4 so a stale worktree can
never be dispatched into again. This is a local, reversible operation on ignored directories; it is
still a deletion, so it goes through the RULE 2 confirmation in §11.12.5 like any other.

#### 11.2.2 The corpus derivation script

`corpus_id sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4` is cited by
every measurement in this plan. **`ls scripts/` shows no `derive/` directory and no derivation
script anywhere in the repo.** `[measured]` Two research areas (`moat`, `premortem`) failed to
reproduce the hash — `premortem` tried **64 serializations** and failed `[primary, final-gate area
premortem]` — and the `against` verifier succeeded, recovering the recipe:

> sha256 of newline-joined sorted `root/path:sha256`, with **no trailing newline**.
> `[primary, final-gate synthesis lens 3, ranked[0].ships_as]`

**Task.** Write `scripts/derive/corpus-id.mjs` (about ten lines), run it, and commit the script plus
its captured stdout next to `docs/engine/research/corpus-manifest.json`. Add a `derivation` field to
the manifest naming the script path.

**Acceptance gate.** `node scripts/derive/corpus-id.mjs` prints
`sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4` and nothing else. Until it
does, **`corpus_id` is a bare hash over a file list, not a pin**, and every `[measured]` tag in this
document that cites it is one step weaker than it looks. Say so if asked before this lands.

#### 11.2.3 The `docs/engine/PLAN.md` §1.1a contradiction

The same section states two incompatible false-match counts. 12.9% of 32,919 block-versions is
4,247, and 2.66% of that is **~113** false matches; the same section states 0.050% false on 28,170
anchorable blocks and *"All 14 false matches were hand-audited, not sampled"* — **113 versus 14.**
`[primary, final-gate synthesis lens 3, ranked[7]]` One is wrong and the document does not say which.

**Task.** Read `docs/engine/PLAN.md` §1.1a, decide which figure is real, correct the other, and add a
one-line note recording that the two disagreed. **Do not delete the losing number silently** — the
whole point of P2 (§11.12.2) is that a corrected record is more credible than a clean one.

**Effort:** under an hour. **Blocks:** any republication of the 99.627% figure (see K3, §11.14).

#### 11.2.4 The agent litter and the false-failing guards

Untracked at the repo root right now, verified live: `arx.xml`, `cx.html`, `.scratch-carrier.mjs`,
`.scratch-lossy.mjs`, `polyg.yml`, `docs/engine/build/__pycache__/`. `[measured, git status
--porcelain -uall, 2026-08-01]` None is referenced by any build step. **Task:** delete or gitignore,
one commit. Add `__pycache__/` and `.scratch-*` to `.gitignore`.

Separately, two tooling guards are recorded as reporting **false failures**: `workflow-lint.sh`
inverts on files larger than the pipe buffer (`grep -q` plus `pipefail` gives SIGPIPE 141), and the
loop-guard reports denials for calls that succeeded. `[primary, docs/mdmax/PLAN.md v2.0.0 §9.9]`
Both live outside this repo, in the AIOS toolchain. **RECOMMENDED:** do not fix them here. Fix them
where they live, or stop running them against this repo. A guard that cries wolf is worse than no
guard — Learned Rule #65 again.

#### 11.2.5 One stale record that step 1 will create

`AGENTS.md` §7 currently instructs every agent: *"Author commits as `Sagnik Mitra
<sagnikmitra123@gmail.com>` (matches `AUTHOR` in `src/container/dependency-container.ts` for GitHub
commits the app makes on behalf of the user)."* `[primary, AGENTS.md]` **Step 1 deletes that
constant.** Put a line in step 1's definition of done that updates AGENTS.md in the same commit,
or the next agent to read it will helpfully re-hardcode the author.

---

### 11.3 Step 1 — THE SECOND USER · 8–12 founder-days · the only step that matters this month

**DECIDED.** This is item 1 in both the `product-market` lens and (as its cheapest high-leverage
intervention) the `premortem-integrator` lens. `[primary, final-gate synthesis lenses 1 and 3]`

#### 11.3.1 The state today, verified live

```
src/modules/auth/domain/allowlist.ts:9
    return login.trim().toLowerCase() === allowed.trim().toLowerCase();

src/config/env.ts:47
    ALLOWED_GH_LOGIN: z.string().min(1).default("sagnikmitra"),
src/config/env.ts:85-86
    GITHUB_REPO_TOKEN: z.string().min(1),
    GITHUB_REPO:       z.string().min(1).default("sagnikmitra/md"),
src/config/env.ts:252
    const allowedLogin = process.env["ALLOWED_GH_LOGIN"] ?? "dev";

src/container/dependency-container.ts:42
    const AUTHOR = { name: "Sagnik Mitra", email: "sagnikmitra123@gmail.com" } as const;
    → fed to commitChanges, createNote, renameNote, uploadAttachment (lines 66, 70, 75, 80)

src/modules/auth/infrastructure/auth-options.ts:82
    return isAllowed(ghProfile?.login, authEnv.ALLOWED_GH_LOGIN);

src/shared/infrastructure/github/client.ts:30      Bearer ${repoEnv.GITHUB_REPO_TOKEN}
src/modules/repository/infrastructure/github-writer.ts:33  Bearer ${repoEnv.GITHUB_REPO_TOKEN}

src/app/(workspace)/     contains exactly one file: .gitkeep
src/app/**               no signup, register or onboard route exists
```
`[measured, all read live 2026-08-01]`

`firestore.rules` — **17,304 bytes, committed 2026-07-25** — already declares the entire multi-tenant
model: `vaults/{vaultId}/notes/{noteId}/revisions/{revId}`, `memberUids`, `roles[uid]`,
`canEditVault`, immutable parent-linked revisions with `allow update: if false`, `billing/{uid}`,
`usage/{uid}/months/{month}`, `shares/{slug}` with an `isValidShare` validator. It contains the
string `comments` **zero times**, and the exported `firestore()` helper has **zero callers anywhere
in `src`**. `[primary + measured, final-gate synthesis lens 3, ranked[2]]`

**The schema exists. Zero lines implement it.** That is the whole of step 1: implement a
specification that is already written down.

#### 11.3.2 What ships — the RED test, committed first

**Path:** `test/tenancy/second-user-writes.test.ts` — a new directory, no eslint change needed
(`boundaries/elements` matches `src/modules/*/…` by glob, and `test/**` is not an element at all
`[primary, eslint.config.mjs:80-96]`).

**Commit it RED on day one, before any implementation.** The commit message must say `RED:` and name
the assertion. It asserts, in one test:

1. A GitHub login that is **not** `sagnikmitra` completes sign-in and reaches a workspace. *(Fails
   today at `auth-options.ts:82`.)*
2. That user opens a document in a vault whose `memberUids` includes them but whose owner is someone
   else, and writes one character.
3. The persisted commit's author is **their** name and email — asserted by reading the commit back —
   **not** `{ name: "Sagnik Mitra", email: "sagnikmitra123@gmail.com" }`. *(Fails today at
   `dependency-container.ts:42`.)*
4. The write was authorised by **their** credential, not a shared server token. *(Fails today at
   `client.ts:30` and `github-writer.ts:33`.)*
5. The same user receives **403** on a vault where they hold no role. *(No role model is wired
   today.)*

> **Why this shape and not "write a multi-tenancy epic".** A standing rule that says *"one committed
> assertion goes red to green against engine code"* **can be satisfied by writing a compiler.** An
> assertion that names a second human cannot be satisfied by prose and cannot pass without deleting
> the allowlist, the single server token and the `AUTHOR` constant simultaneously.
> `[primary, final-gate area premortem, "the single cheapest intervention"]`

#### 11.3.3 The work, decomposed

| # | Task | Files | Effort |
|---|---|---|---|
| 1a | Commit the RED test | `test/tenancy/second-user-writes.test.ts` | 0.5 d |
| 1b | Delete the allowlist; replace the `signIn` callback with account creation | `src/modules/auth/domain/allowlist.ts` (delete), `…/infrastructure/auth-options.ts`, `test/auth/allowlist.test.ts` (delete) | 1 d |
| 1c | User + vault documents on first login | new `src/modules/tenancy/{domain,application,infrastructure}`, `src/shared/infrastructure/firebase/` | 2 d |
| 1d | Per-user GitHub credential — replace one server token with the signed-in user's OAuth token | `src/config/env.ts` (drop `GITHUB_REPO_TOKEN` default path), `src/shared/infrastructure/github/client.ts`, `src/modules/repository/infrastructure/github-writer.ts` | 2–3 d |
| 1e | Per-user attribution — `AUTHOR` becomes a parameter | `src/container/dependency-container.ts:42,66,70,75,80`, the four use-cases, `AGENTS.md` §7 | 1 d |
| 1f | Repo picker + onboarding route | `src/app/(auth)/`, `src/app/(workspace)/` (currently `.gitkeep` only) | 2–3 d |
| 1g | Role enforcement — `canEditVault` server-side, matching `firestore.rules` | `src/modules/tenancy/application/`, every `src/app/api/**` write route | 1–2 d |

`src/` today is **212 files, 21,415 LOC** `[primary, final-gate area product-gap, effort block]`.
Step 1 touches roughly a dozen of them and adds one module.

#### 11.3.4 The backend contradiction, resolved here

`docs/FRONTMATTER-PRODUCT-PLAN.md` §4 Phase 1 specifies *"Supabase foundation: users, vaults,
sessions, share-links tables"* and names Supabase eleven times `[primary]`. The shipped code and
`firestore.rules` are **Firestore** `[measured]`. **These contradict, and Firestore governs** —
because 17,304 bytes of Firestore security rules exist, are committed, and already model exactly the
schema step 1 needs, whereas the Supabase design exists only as prose. `[DECIDED; matches
docs/mdmax/PLAN.md v2.0.0 §10.1]` **Correct `FRONTMATTER-PRODUCT-PLAN.md` in the same week** so the
next reader does not build the wrong half.

#### 11.3.5 What could go wrong, and what would falsify this step

- **The estimate is the weakest number in this section.** 8–12 founder-days is an `[inference]` from
  the task decomposition above. It is not measured, it has no comparable, and the only velocity
  datum available — 532 lines in 19 days — argues it will take longer. If step 1 is not green by
  2026-08-31, **K1 fires** (§11.14) and the honest reading is that the estimate was wrong by more
  than a factor of two.
- **1d is the risky task, not 1b.** Deleting a string equality is trivial. Replacing one server token
  with per-user OAuth tokens touches every read and write path in the product and changes the rate
  limit model, the error surface and the offline story at once. If it stalls, an acceptable interim
  is a GitHub App installation token per vault — but say out loud that it is interim.
- **What would falsify the whole step:** if a second login can already write under their own
  attribution, the premise is wrong. Test it before believing this section. It cannot today —
  `auth-options.ts:82` rejects them before anything else runs `[measured]`.

---

### 11.4 Step 2 — THE FRONTMATTER SPLICE · half a founder-day · parallel with step 1

**DECIDED.** This is a live data-corruption defect in the feature the company is named after, firing
on every publish and every unpublish.

#### 11.4.1 The defect, read live

`src/modules/share/infrastructure/share-writer.ts` — its own file header says the adapter works by
*"splicing the key into the YAML frontmatter."* Its body does this:

```ts
const parsed = matter(file.content);
const data: Record<string, unknown> = { ...(parsed.data as Record<string, unknown>) };
if (slug === null) { delete data["public_slug"]; } else { data["public_slug"] = slug; }
const next = matter.stringify(parsed.content, data);   // ← regenerates the entire block
```
`[measured, read live 2026-08-01]`

**The header and the code contradict each other, verbatim.** `matter.stringify` re-serialises the
whole YAML block from a parsed object, which is regeneration, not splicing — and it violates **D7
(splice-only writing)**.

**What it costs, measured:**

| measurement | figure | source |
|---|---|---|
| frontmatter-bearing files whose bytes change on a **no-op** | **84.5% of 737** (623 files; 197 change line count) | area `rendering-frontier` |
| frontmatter blocks rewritten | **94.3%** | area `product-gap` |
| byte-identical after publish | **33 / 907 = 3.64%** | area `product-gap` |
| byte-identical after **publish then unpublish** | **17 / 736 = 2.31%** (verifier re-derivation) | `product-gap` verifier |
| bare `YYYY-MM-DD` silently coerced to an ISO timestamp | **624 / 736 = 84.78%** of parsed files | area `product-gap` |
| files that **502** because `gray-matter` throws and `share-writer` has no `try/catch` | **170 of 907** | areas `product-gap`, `premortem` |
| silent body loss: `gray-matter/index.js:161` re-parses a **string** first argument, so passing `parsed.content` means a body opening with a `---` block has that block consumed as frontmatter and **dropped** | qualitative, verifier-found, unreported before this run | `premortem` verifier |

`[measured, corpus_id sha256:3a010b16…]`

The 171-file failure has a named cause: Obsidian's `related: [[a]], [[b]]` is **not valid YAML**, and
**170 of 907 blocks (18.7%) parse under neither YAML library.** `[measured]`

#### 11.4.2 What ships

`spliceFrontmatterValue(src: string, key: string, value: string | null): string` — locate the byte
range of the `key`'s value node (or the insertion point after the last key), replace **only** those
bytes, return the string. **Never call `matter.stringify`. Never call `toString()` on a YAML
Document.** `[DECIDED]`

**Where it lives.** New module `src/modules/share/domain/splice-frontmatter.ts`, exported from a new
barrel `src/modules/mdmax/index.ts`. It is a pure function, so it belongs in `domain` — which under
`eslint-plugin-boundaries` may import only `domain` and `shared-domain`
`[primary, eslint.config.mjs:109-111]`, and that constraint is a feature: it makes the splice writer
impossible to contaminate with I/O. `share-writer.ts` is `infrastructure`, which **is** allowed to
import `domain` `[primary, eslint.config.mjs:123-125]`, and per `AGENTS.md` §2 it must import
through the barrel `@/modules/mdmax`, never the deep path.

`yaml@2.9.0` is **already a dependency** `[primary, package.json]` and exposes `node.range` on every
AST node — use it to find the byte range, then throw the Document away without ever serialising it.

> **DO NOT take the shortcut of swapping `gray-matter` for `yaml` and calling `toString()`.** The
> `yaml` library's own no-edit round trip is byte-identical on only **114 of 907** blocks, and
> **170 files do not parse at all.** `[measured]` It is a different regenerator, not a splicer.

#### 11.4.3 The gate

**Committed RED first.** Against the current writer the test will fail at **33/907**.

```
Given every one of the 907 frontmatter-bearing files in corpus_id sha256:3a010b16…
  publish(file)  → unpublish(file)  must be BYTE-IDENTICAL to the original — 907/907.
  publish(file)  must not throw — including on the 171 that no YAML parser reads.
Checked by an oracle that shares NO code with the writer.
```

**"Shares no code with the writer" is load-bearing.** Learned Rule #60: a verifier written in the
same session as its subject inherits that session's blind spots. Concretely: the oracle re-reads the
file from disk and compares raw bytes with `Buffer.compare`; it must not import
`spliceFrontmatterValue`, `yaml`, or `gray-matter`.

**Register it in the gate registry (§11.12.3) with its `--broke` written first:** the `--broke`
reintroduces `matter.stringify` and **must go red**. A gate that cannot be proven to fail is not a
gate.

#### 11.4.4 The three parsing defects, same commit series

The `parsing-robustness` area's own honest verdict: *"this entire area was a code review wearing a
research costume and should be re-run as one."* `[primary]` Take the code review:

| defect | file | measurement |
|---|---|---|
| `WIKILINK_RE` is strictly quadratic, k=2.00 | `src/modules/vault/infrastructure/markdown-parser.ts:12` | verifier reproduced 577.4 / 2,282.5 / 9,258.1 ms at 20k/40k/80k occurrences; **11,012.9 ms on a realistic 749 KB half-typed vault**. `parseMarkdown` is **server-only**, so this blocks the Node event loop, not the browser main thread |
| `gray-matter`/`js-yaml` (YAML 1.1) vs `eemeli/yaml` (1.2 core) diverge | both parsers | **625 of 737 parsed files** across **973 occurrences**; one class — dates coerced to `Date` |
| `share-writer` | above | step 2 proper |

`[measured, final-gate synthesis lens 3, ranked[10]]`

**Ships as:** three commits plus an `eslint-plugin-redos` run in CI. **Then close the area.**

**The architectural finding worth keeping:** do not build an mdast tree for a whole document —
`mdast-util-from-markdown` is super-linear on flat bullet lists where micromark and Lezer are not.
**But the numbers do not survive:** the verifier measured **359,959 ms against a claimed 196,096**
(1.84×), found two runs of identical code disagreeing by 1.8×, and found micromark **also**
super-linear on nested blockquotes at k=2.42. `[measured]` The parser that stayed near-linear on
every shape tested was **Lezer, already in the dependency tree via CodeMirror**
`[primary, package.json: @codemirror/*]`. Quote the prescription, never the milliseconds.

---

### 11.5 Step 3 — WEDGE A: "your vault, in any browser" · 15–25 founder-days · the paid beachhead

**DECIDED as the first revenue step.** The founders wrote this ranking themselves, before the engine
programme started: `docs/FRONTMATTER-PRODUCT-PLAN.md:51-53` ranks the wedges **A > C > B** and says
of Wedge A: *"Nearly sellable from the existing codebase once multi-tenancy lands."* `[primary]`

**Demand:** pain 9 (*No browser access / platform gaps*) carries severity **"Kills at evaluation"**,
with a 63-comment thread that *"asks for exactly this."* `forum.obsidian.md/t/2049` stands at
**246,568 views / 928 likes** (a second area recorded 249,616 views — the discrepancy is a fetch a
few hours apart; quote the range, not a point). `[primary]`

**Already shipped and reusable** `[primary, repo inventory]`: CodeMirror 6, the full Obsidian
dialect, `merge3` with 14 conflict tests, git history and restore, MiniSearch, PWA + Tauri.

**Blocked by:** step 1, entirely. **Exit criterion**, taken verbatim from the product plan:
*"a stranger signs up, connects a repo, edits on phone + laptop, and their Obsidian desktop app sees
the same files."* `[primary, FRONTMATTER-PRODUCT-PLAN.md §4 Phase 1]`

**Pricing — RECOMMENDED, not decided.**

| tier | price | anchor |
|---|---|---|
| Free | browser vault + git sync + publish | — |
| Pro | **$4/mo billed annually** | exact parity with Obsidian Sync Standard; inside the forum-stated $2–4 ceiling |
| Work | **$50/user/year** | mirrors Obsidian Commercial; aimed at the population pain 9 defines — cannot install software on a work machine, can expense a licence |

`[primary, final-gate synthesis lens 1, ranked[1].ships_as]`

**One contradiction to settle before the pricing page is written.** `FRONTMATTER-PRODUCT-PLAN.md:171`
promises *"Free git-backed sync forever (user's own repo = backend; marginal cost ~0)"* against pain
theme T3, **ranked #3 of 14**. **D4 explicitly rejects "your git repo is the backend."** `[primary]`
The `premortem` area logs this as risk **N10 — two decisions deleted the wedge the demand research
identified** and notes it *"is not logged anywhere."* `[primary]` **RECOMMENDED resolution:** D4
governs as a **durability promise** (we owe an export and a migration, not an architecture), and the
free-tier sentence is rewritten to promise free sync into a repo the user owns without claiming the
repo is the backend. **OPEN** until a founder writes it down.

---

### 11.6 Step 4 — SHARE LINKS with enforced roles, expiry and a comment box · 5–8 days

**The state today:** `grep` across `src/modules/share` for `expiry|expires|password|role` returns
**only a reserved-slug list and ARIA dialog roles** — no capability exists. `[measured]` Share is a
public slug with no roles, no expiry, no password. `firestore.rules` already has
`match /shares/{slug}` with an `isValidShare` validator, so the storage layer is specified.
`[primary]`

**Ships as:** roles `viewer | commenter | editor`, revocable, expiring, optional password, plus a
comment box that writes into the sidecar of step 6.

**This step reopens D3.** D3 says reviewers must log in. The competitive research names
**anonymous, no-account share links** as the wedge — HedgeDoc (working proof of concept with a live
demo, 2026-04-04), **Relay at 176,247 installs** (a second area recorded 175,904 — again, a fetch
gap; quote the range), Peerdraft, HackMD. `[primary]` D3 removes exactly that property.

**RECOMMENDED, and both lenses that touched it agree:** reopen D3 as a **tier split**, not a global
rule — **anonymous read-and-comment on a share link; login required to resolve a thread or to
edit.** Owner seats bill; commenters do not. This preserves the wedge and the account model at once.
`[primary, final-gate synthesis lens 1 ranked[3].ships_as and lens 3 N4 countermeasure]`

**A pre-registered prediction that can settle it empirically:** the `product-gap` area predicts that
**four of five reviewers stall at the login wall** `[primary, prediction M3]`. Run the five
conversations (§11.12.7) **before** this step. If M3 fires, D3 becomes a product decision made at
auth, not an auth decision deferred.

**Gate:** a link issued with role `commenter` returns 403 on write; an expired link returns 410; a
revoked link returns 404 within one cache TTL. **Blocked by:** step 1, and a written D3 decision.

---

### 11.7 Step 5 — `mdmax cert` · **two days, hard cap** · the capped give-away

**DECIDED: build it. DECIDED: it is never the spearhead.**

**Why it exists.** It is the only capability in the programme that four independent adversarial
prior-art searches could not find shipped:

- `moat` ran three GitHub repo searches returning `total_count` **0, 0 and 1** (the 1 an unrelated
  MCP tool); npm lookups for `babelmark` / `markdown-compat` / `markdown-conformance` all not-found.
- `market-and-gift` enumerated `markdownguide.org`'s `_data/tools.yml`: **exactly 28 construct ids**,
  and `frontmatter`, `wikilink`, `callout`, `mermaid`, `math`, `directive`, `embed` and `attribute`
  appear **zero times** — against **83.67%** frontmatter prevalence in the pinned corpus and
  **56.75%** in an independent one.
- `premortem` ran four npm searches (markdown+conformance, markdown+compatibility, commonmark+diff,
  markdown+renderer+comparison) → **32 results, zero conformance tools**.
- `rendering-frontier` measured **GitHub's own two renderers disagreeing on identical bytes, live**:
  `POST /markdown` renders mermaid as highlighted source while `github.com` blob renders the
  diagram, and inline `<svg>` is **deleted to an empty paragraph**.

`[primary + measured, all four areas]`

**Why it is capped.** It targets the founders' own pain themes **13 and 14 of 14**. The
`market-and-gift` verifier found T13's severity is *"Churns the purist early adopters"* — **worse**
than the headline's "Annoys", which is T14 on the next line — and **still ranked 13th**, while the
pains that make people pay rank 1–9. `[primary]` The `degradation-certificate` area's own unverified
block opens: *"TARGETS I NEVER RAN — this is the biggest gap and it is more than half the brief's
list"*, and admits **no empirical Obsidian data at all**; **7 of ~12 target surfaces cannot be probed
at all.** `[primary]` One prior art the searches missed: `ArchieCur/MARKDOWN_FLAVORS`, a **14-flavor
× 17-construct** matrix — static, not per-document, which narrows the novelty claim without
eliminating it. `[primary, moat verifier]`

**Ships as:** `npx mdmax cert`, plus a GitHub Action and a Claude Agent Skill. Per document, per
target, per construct: **PASS · STRIP · CORRUPT**. Targets modelled as `(product, surface)` pairs.
`--json`, exit codes, version-pinned **offline** renderers.

**Two labels are mandatory in the output:** a **PROBED** tier (offline, vendored, version-stamped)
and a **DECLARED** tier (contract-plus-canary for closed SaaS), so the certificate never manufactures
confidence about Obsidian, Notion, Slack or Discord. `[primary, premortem N9 countermeasure]`

**Diagnosis free, repair paid.** The last output line reads: *"N of your files will CORRUPT on
GitHub Pages — fix them at frontmatter."*

**Blocked by:** the five conversations (§11.12.7). They can tell you nobody wants it.

**Its own kill numbers** — both are in §11.14 as **K5** and **K5b**, and both previously had no
threshold, which meant they could never fire.

---

### 11.8 Step 6 — THE REVIEW LOOP · 20–30 founder-days · the thing twelve months buys

**DECIDED as the destination.** Highest defensibility in the set, and the only intersection four
competitor sweeps found empty.

**The single most consequential correction in the entire research corpus.** The `against` area
reported demand favouring real-time collaboration over commenting **6.9:1** and built its whole
strategic recommendation on it. **Its own verifier recounted symmetrically** (de-confounding URL and
score metadata) and got **review-loop 169 leaves to collaboration 95 — 1.78:1 the other way.**
`[measured, final-gate synthesis lens 3, contradictions[3]]` That flips the recommendation from
*"build Yjs"* to *"build comments"*. **Anyone quoting `against`'s strategic conclusion is quoting a
regex artifact.**

> **A caution the honest version of this plan must carry.** A second, tighter count in the same
> corpus gives **108 leaves** for realtime/multiplayer/collab against **25** for the unambiguous
> suggestion/track-changes/annotate family — i.e. 4.3:1 back toward multiplayer.
> `[measured, final-gate synthesis lens 1, ranked[5].evidence]` **The two counts contradict, and the
> difference is what counts as a "review loop" leaf.** The symmetric recount governs the *decision*,
> because it is the one that was adversarially audited. But do not present 1.78:1 as settled. This is
> **defensibility-led, not demand-led** — build it because the intersection is empty, not because
> the corpus proves people asked.

**The empty intersection, from live fetches** `[primary, area product-gap]`: HackMD ships the full
loop free but has no local files or vault. Moment.dev ships realtime on git-backed `.md` and
`grep -ioE 'comment|suggest'` over its homepage, docs and pricing returns **0**. Obsidian's own help
file for shared vaults states plainly: no cursors, no fine-grained permissions, no comments. Craft
and Bear homepages contain **0** occurrences of "comment".

**The clock.** `inkeep/open-knowledge` (**3,239 stars, 14,790 npm downloads/week, GPL-3.0**) merged
content-derived comment anchoring on **2026-07-30** and published `0.46.0-beta.32` at
**2026-08-01T02:38:33Z** — six minutes before the researcher's first tool call. Its own changeset
says the comment is *"a note to your own agent, not a message to a teammate."*
`[primary, area competitive-live]` **They have the hard engineering and have declined the market.
That gap closes the day they change their mind.**

**Ships as.** A `comments` collection — **absent from `firestore.rules` today**, so this data model
must be written — with `{ anchor: { prefix, exact, suffix }, quotedFileContent, resolved, replies[] }`.
**Copy Google Drive v3's field set rather than inventing one.** The anchor is a **W3C
`TextQuoteSelector`, a Recommendation since February 2017** — not an invention. `[primary]`

**The resolver: a three-tier cascade, and delete everything else.** `[DECIDED]`

| tier | mechanism | when | evidence |
|---|---|---|---|
| 1 | `ChangeSet.mapPos` | in-session edits | exact by construction; CodeMirror is already a dependency `[primary]` |
| 2 | LCS over normalized block text | across revisions | **86.658%** (verifier independently re-derived **85.036%**) vs hash-alone **77.297%**, on **29,217 anchorable block-versions** from the pinned corpus `[measured]` |
| 3 | content-derived, **scoped to blocks of ≤10 tokens**, refusing rather than guessing | last resort | the short-block stratum is where everything fails: **44–47% of 3–5 token blocks are ambiguous**; **0 of 13,426 twenty-plus-token blocks are** `[measured]` |

**Never a position tiebreak.** Measured at **22.20% false** — and it is the exact thing the shipped
competitor still does. `[measured]`

**Orphan visibly, never guess. Ship the orphan rate as a visible product metric from the first
comment written**, and instrument the refusal path *before* the resolve path.
`[primary, premortem N4 countermeasure]` The stated threshold: *"if orphaned threads exceed ~10% of
all threads per week of normal editing, the honest-refusal design is correct and unshippable at the
same time."* `[primary, area collab-primitives]`

**D2 gate, non-negotiable:** delete the entire sidecar → `git status` is clean and every `.md` file
is byte-identical. Nothing about comments is ever written into the file.

**Do NOT sell it as Google Docs suggestions.** Google Docs carries `suggestedInsertionIds` on every
`TextRun` and supports nesting; a plain `.md` under **D6** cannot. Ship suggestions as **base-sha
plus hunks, accepted by the step-2 splice writer**, and say so in the marketing copy.
`[primary, final-gate synthesis lens 3, ranked[6].ships_as]`

**Blocked by:** step 1 (absolutely), step 2 (for the suggestion path), step 4 (for the surface), and
**§11.12.8 before anyone quotes a reliability number to a customer.**

---

### 11.9 Step 7 — pack / unpack · sequenced here, and contested

**Sequenced at position 7 per Section 3 — after the splice writer, never before it.** And this
document must state plainly that **the research disagrees with sequencing it at all.**

**The contradiction, both sides named.** The `container-thesis` area recommends shipping `mdmax pack`
beside `mdmax cert`. The `against`, `premortem` and `founder-thesis` areas — and `founder-thesis`'s
**own verifier** — say never. The `premortem-integrator` lens lists it under **"NEVER BUILD"**, and
**that lens governs**, for four reasons that are measurements and not opinions:

1. **The round trip is unsafe.** `container-thesis` proved the engineering (**1084/1084
   byte-identical, +0.892% overhead, 120× cheaper than a zip per git edit**) and then killed its own
   product in the same report: on the realistic merge-across case, **boundary repair is 119/120
   WRONG** — it returns a confident position that does not contain the true split. `[measured]`
2. **Revealed demand is 846:1 against.** `llm-code-format` already ships pack **and** unpack, zero
   dependencies, nine LLM output conventions — **387 downloads/month against repomix's 327,543.**
   `repomix` issue #71 has been open **23 months**; the maintainer gated it on evidence, the
   contributor reported back *"not quite what I hoped"*, and the last comment is **2025-09-08**.
   `[primary]`
3. **The scale is wrong at our own vault.** Container **25,548,765 B** vs a one-line-per-doc index
   **105,538 B** — **242×**. A 200K-token window holds **2.82%** of the container and **682%** of the
   index; even a 1M window holds **14.1%**. `[measured, corpus_id sha256:3a010b16…]`
4. **The only live-model measurement of a projection bundle anywhere** (okf-skills, 2026-07-27)
   found the bundle arm spent **+5.2% MORE tokens** and opened **MORE** files. `[primary]`

**Therefore step 7 is not a task. It is a precondition with a task behind it**, and both parts of the
precondition must fire before a line is written:

- **P7a — the founder question, asked verbatim.** *"Was the export you meant always a zip of clean
  `.md` files?"* `[primary, founder-thesis kill-decision K-D]` If yes, this closes in ten minutes,
  and what survives is the **D4 escape-hatch zip** — which the container's disqualifying properties
  do not apply to, and which is what a departing human actually wants. `export-vault-zip` already
  exists (`src/modules/vault/…`, `test/vault/export-vault-zip.test.ts`) `[measured]`.
- **P7b — a live-model number, on a corpus the model cannot read whole**, showing a packed projection
  costs **fewer** task tokens than the file tree. Zero live model calls have been made anywhere in
  this programme `[primary, stated in every area's unverified block]`, so this number does not exist
  in either direction. Until it does, **§4.4's 25–168× figures must be stated as artifact-size
  ratios and must never imply a token saving in an agent loop.**

**If P7a returns "no, I meant one file" and P7b returns a positive number, then and only then:**
`mdmax pack` ships as a **read-only projection** — never the write surface, never with boundary
repair, and unpack is exercised by the step-2 splice writer, which is why it is sequenced after it.

**Effort until then: zero.** Effort after: 3–5 days, and it should be re-estimated, not inherited.

---

### 11.10 Step 8 — REAL-TIME COLLABORATION · not this cycle

**DECIDED: not this cycle.** `[final-gate synthesis lens 1, ranked[6].ships_as: "Not this cycle."]`

It is the largest remaining build, it fights **D6** and **D7** hardest, and there is a specific
architectural fact to be paid for knowingly: **Outline solves the whole loop with a ProseMirror
comment mark inside a Yjs document and markdown as a projection — which makes anchoring vanish
entirely.** `[primary]` Refusing that is defensible under D6, but it is a cost, not a free choice.

**Competitive floor if it is ever built:** Moment.dev ships realtime on git-backed `.md` at **$30/mo
for five seats**; a Teams tier at **$5–8/seat/mo** sits under HackMD Prime at $5 and far under Notion
Business at $20. `[primary]`

**Revisit after step 6 reports an orphan rate**, not before. If the orphan rate is intolerable
(**K6**), the answer may be that this product needs Yjs after all — and that is a decision made on
data instead of on preference.

---

### 11.11 Where the work happens

#### 11.11.1 The repo and the accounts

| Surface | Owner | Note |
|---|---|---|
| GitHub | `studiozephyrus/frontmatter` | a personal User account, **not an org** |
| Vercel | team `zsco` (`team_RSlKvg8AqX8hr5WIuKXlNXGE`), project `frontmatter` | |
| Firebase | `frontmatter-md` under `studiozephyrus@gmail.com` | |
| Cloudflare | **Sagnik's personal account**, zone `frontmatter.in` | a deliberate split |
| `origin` | studiozephyrus | |
| `sagnik-old` | pre-migration remote, kept as rollback | `refs/remotes/sagnik-old/main` = `8eb4de2` `[measured]` |

`[primary, AGENTS.md §6b]`

**Credentials.** `.git/config` holds a credential helper reading `$GH_TOKEN_ZEPHYRUS` from the
environment; the token is never written into the repo. Source it in the **same** shell invocation:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && git push
```

A push failing with *"Repository not found"* almost always means the token was not sourced and the
macOS keychain answered with the personal account. **Never** run `gh auth login` or
`gh auth setup-git` with the Zephyrus token — both rebind every repo on the machine to the wrong
identity. Pass it per command: `GH_TOKEN="$GH_TOKEN_ZEPHYRUS" gh <cmd>`. Same for Vercel: always
`--scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"`, never the bare `VERCEL_TOKEN`.
`[primary, AGENTS.md §6b]` **Never print a token value.**

#### 11.11.2 Branch strategy

- `main` is **auto-deployed** by Vercel. The ignored-build-step diffs the commit range and skips
  redeploys when only docs change; app code always redeploys. `[primary, AGENTS.md §7,
  scripts/vercel-ignore-build.sh]`
- **One branch per step**, named `step-N/<slug>` (`step-1/second-user`, `step-2/frontmatter-splice`).
  Small enough to review, large enough to carry its gate.
- **The RED commit is the first commit on the branch**, and its message begins `RED:`.
- Merge to `main` only when `npm run verify` is green **and** the step's registered gate is green
  **and** that gate has been proven to go red under its `--broke` (§11.12.3).
- `engine/plan-and-diagnostics` (currently HEAD, `1bd4dad`, 17 commits ahead of `origin/main`) is the
  documentation branch. **RECOMMENDED:** merge it to `main` this week so `main` stops being a month
  stale and so the plan is the thing everyone reads.

#### 11.11.3 The module boundaries — the thing that makes parallelism safe

Hexagonal modular monolith, enforced by `eslint-plugin-boundaries` **as errors**, not warnings
`[primary, eslint.config.mjs:100-146]`. Element types are matched by glob, so **a new module needs
no config change**:

```
domain           src/modules/*/domain            → may import: domain, shared-domain
application      src/modules/*/application       → + application, config          (never infra)
infrastructure   src/modules/*/infrastructure    → + infrastructure, config
presentation     src/modules/*/presentation      → domain, application, presentation  (never infra/container)
container        src/container                   → everything except app
app              src/app                         → presentation, DTOs, container, config
middleware       src/proxy.ts (file)             → application, infrastructure, config
```

Direction is **inward only**:

```
domain  ←  application  ←  infrastructure
              ↑                ↑
        presentation       container
              ↑
            app
```

Cross-module imports go **through the barrel** `@/modules/<name>`, never the deep path — including
for types. `@/server/*`, `@/lib/*`, `@/components/*` are permanently banned by `no-restricted-imports`.
`[primary, AGENTS.md §2-3, eslint.config.mjs:148-152]`

**Existing modules** `[measured, ls src/modules]`: `ai`, `ai-tools`, `app-shell`, `auth`, `drafts`,
`editor`, `export`, `graph`, `preview`, `repository`, `share`, `vault`.
**Two new ones are proposed here:** `tenancy` (step 1) and `mdmax` (step 2).

**The disjoint-artifact map — this is the parallelism contract.** Learned Rule #20: any parallel
branch must operate on disjoint, explicitly-named artifacts.

| step | modules it owns | must not touch |
|---|---|---|
| 1 second user | `auth`, new `tenancy`, `config`, `container`, `app/(auth)`, `app/(workspace)` | `share/**` |
| 2 splice | ~~new `mdmax/domain`~~ — **SHIPPED in `4f97129` as `share/domain/splice-frontmatter.ts`** | — |
| 4 share links | `share/application`, `share/presentation`, `app/api/share` | **`share/domain/splice-frontmatter.ts`** and `share/infrastructure/share-writer.ts` |
| 5 cert | `scripts/` + fixtures only — **no `src/` writes at all** | everything |
| 6 review loop | new `comments` module, `firestore.rules` | `share/domain` |

**One agent per module boundary, never two agents on the same file.**

> **Corrected 2026-08-02.** Step 4 previously claimed `share` (all layers). The splice writer now
> lives at `src/modules/share/domain/splice-frontmatter.ts`, so that grant would have let a step-4
> agent overwrite the one file with a 907/907 gate on it. Step 4 is now scoped to `application` and
> `presentation`, and `share/domain` is explicitly off-limits to it.
`[primary, final-gate area aios-transfer, design item 4]`

#### 11.11.4 Worktrees

Two exist and both are stale (§11.2.1). The rule going forward, from `aios-transfer`:

1. **A preflight refuses to dispatch an agent into a worktree more than N commits behind `main`.**
   Set **N = 0** for any step that touches `src/`; a stale worktree is how step 2's gate silently
   measures the wrong writer. Set N = 5 for docs-only work.
2. **Capture `git rev-parse HEAD` before AND after every parallel run and reconcile the delta.**
   Learned Rule #48 measured that a prompt-level *"do not commit"* is **advisory, not a gate**:
   five subagent commits landed against an explicit prohibition. `[primary]`
3. **Environment fingerprint on every gate row.** Learned Rule #65: the same battery scored 67/0 from
   one directory and 55/12 from another, same code, same commit, because macOS `/bin/bash` 3.2 writes
   heredoc temp files to `/tmp` and the sandbox denies it under some working directories. A green
   from a different environment is a **different measurement** and must be visibly so.

Effort for the worktree preflight and HEAD reconciliation: **~3 hours, and it lands *before* the
first parallel agent run, not after.** `[primary, aios-transfer effort block]`

---

### 11.12 The workflow — how a task goes from backlog to merged

#### 11.12.1 The research→build boundary rule

**Nothing enters the build backlog on a headline.** A backlog item requires three fields:

```yaml
- id: S2-splice
  claim: "publish-then-unpublish is byte-identical on 33/907 files"
  corpus_id: sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
  repro: "node scripts/derive/roundtrip.mjs --corpus corpus-manifest.json"
  verifier_verdict: CONFIRMED        # or OVERSTATED / REFUTED / UNAUDITED
```

**The backlog refuses any item whose headline appears in the run's own `killed` list.** That single
conditional is what the previous run was missing, and it costs one `if`.
`[primary, aios-transfer design item 5 — "highest leverage per minute of anything here", under an hour]`

**Why this rule and not "read carefully":** the 18-area capability run had a **100% headline defect
rate** — every headline refuted by its own verifier, always flatteringly. The 16-area final gate,
after structural fixes, produced **CONFIRMED 5 · OVERSTATED 10 · REFUTED 1**, with a kill audit over
105 sampled kills giving false-kill rates of **17.2% / 3.4% / 19.0% / 0%**. `[primary,
docs/mdmax/PLAN.md v2.0.0 §0]` **The verifiers are roughly 88% reliable, not 100%.** A kill is strong
evidence, not proof — which is why **P4** below exists.

#### 11.12.2 The standing rules, and the failure each one came from

| # | rule | the failure that produced it |
|---|---|---|
| P1 | Every figure names a `corpus_id` | seven irreproducible file counts |
| P2 | No headline without a committed derivation script **and its captured output** | a `101.1×` ratio propagated with no script anywhere |
| P3 | Parallel work only over disjoint artifacts, through one reconciliation gate | five designs built on a carrier two measurements had already broken |
| P4 | Verifier kills get **sampled and re-audited** before anything is removed | measured false-kill rate up to **19%** |
| P5 | Every byte written into a user's file passes a **placement fixture** first | a marker next to a setext heading silently turned a heading into a paragraph plus a rule |
| P6 | A design rule may only be derived from an operation the engine **performs** | a normative rule derived from a `stringify` round trip, in a splice-only engine |
| P7 | Freeze and **version `normalize()`** before persisting a single anchor | it appears in no effort estimate anywhere |
| P8 | Every novelty claim carries the search that produced it | "no precedent" claimed five times; one refuted by three sources this programme had already downloaded and dropped |
| P9 | A replayed number says **SIMULATED** in the same sentence | every comprehension claim in the corpus |
| P10 | **The unit of progress is step 1's test going green** — not *a* test, *that* test | a rule saying "one assertion red to green" can be satisfied by writing a compiler |
| P11 | Push before you think | the entire programme lived on one laptop, untracked, until 2026-08-01 |

`[primary, docs/mdmax/PLAN.md v2.0.0 §11]`

**P2 binds this plan, not only the research.** Every number in `docs/mdmax/PLAN.md` gets a committed
script under `scripts/derive/` plus its captured output, **or it is deleted from the plan.** Start
with §11.2.2's `corpus-id.mjs`, because it is the number every other number stands on.

#### 11.12.3 The gate registry — port it, do not copy it

**What to build:** `specs/harness/gate.mjs`, storing rows to `specs/gates.jsonl`. It is a Node port
of `sgnk-regression-gate.sh` (9,232 bytes), whose entire contract is five refusal codes plus a
`REPRO_NOOP` sentinel. `[primary, aios-transfer]` **Effort: ~1 founder-day**, most of it the selftest
— port the selftest **first**, and the tool is not trusted until it passes.

**The contract, kept verbatim:**

- `--add` requires **both** `--assert` and `--broke`.
- Refuse with distinct exit codes: **2** already-red assertion · **3** vacuous gate · **4** missing
  repro · **5** write-did-not-land.
- `--verify-all` re-proves that **every** registered gate can still fail, and treats a reserved
  `REPRO_NOOP` as **INCONCLUSIVE, never as proof**.

**Two deliberate changes from the shell original:**

1. **Node, not bash.** This deletes the entire bash-3.2 / zsh / heredoc false-RED class (Learned
   Rules #64, #65, #66) at the root instead of papering it with a preflight.
2. **Add the environment fingerprint** the shell version lacks (§11.11.4).

**Exit code 5 exists because of a real incident.** The first version of `sgnk-regression-gate.sh` —
the tool built specifically to eliminate false greens — printed `REGISTERED` twice for gates that
were never persisted, because the destination directory was sandbox-denied and `>>` failed silently.
`[primary, Learned Rule #67]` **A tool that writes must verify the write landed: count before, count
after, refuse if the count did not move.**

**The first three gates to register, each with its `--broke` written first:**

| gate | assertion | `--broke` must make it go red by |
|---|---|---|
| **splice conformance** | bytes written == bytes requested, every splice | reintroducing `matter.stringify` / AST regeneration |
| **anchor safety** | `resolve()` never returns a wrong index | reintroducing content-hash-plus-nearest-position, measured **22.20% false** |
| **UTF-8 integrity** | no artifact leaves a writer undecodable | swapping `perl -CSD` for `head -c`, red on a Devanagari fixture (reproduction exists: **216 bytes in, 200 out, decode error at position 198**) |

`[primary, aios-transfer design item 3]` The first two are **not harness work — they are the
definition of done for steps 2 and 6.** The UTF-8 gate is ~2 hours and can land immediately.

#### 11.12.4 The verify ladder

`npm run verify` already exists and is already a cheapest-first ladder that stops at first failure:

```
npm run typecheck   # tsc --noEmit
npm run lint        # eslint . --max-warnings=0
npm run test        # vitest run --passWithNoTests
npm run build       # next build  — catches Vercel-side exactOptionalPropertyTypes
npm run arch        # specs/harness/clean-architecture-report.mjs
```
`[primary, package.json]` It was measured passing in **3.17 s on this repo** by an external harness
`[measured, aios-transfer]` — note that predates the vitest exclude fix and therefore ran the 247-file
suite; re-measure after §11.2.1.

**Import the one rule it lacks, verbatim from `verify-ladder.sh`: a rung that TIMES OUT is `infra`,
never `fail`** — a wedged candidate must not be able to masquerade as a quality failure. Emit one
JSON line per run: `{verdict, rung_reached, pass, timeout, rungs}`. **Effort: ~2 hours.**

**Always-green invariants** `[primary, AGENTS.md §2]`: `clean-architecture-report` total **0**,
`server-folder-blocklist` **empty**, `import-boundary-report` **empty**. Red gate → stop and fix.
Do not accumulate violations.

**One local-vs-CI trap that will bite:** production `tsconfig` has `strict`,
`noUncheckedIndexedAccess` **and** `exactOptionalPropertyTypes`. Local `npm run typecheck` can pass
while Vercel fails. Declare optional props that can be explicitly `undefined` as `?: T | undefined`,
not bare `?: T`. `[primary, AGENTS.md §5]`

#### 11.12.5 Dispatching an agent — what it may and may not do

Every agent prompt carries this block verbatim:

```
SCOPE:      you own <module list>. You may not create, edit or delete a file outside it.
FORBIDDEN:  git commit, git push, npm install, rm, any write outside $TMPDIR and your module,
            any outbound message, any change to .claude/settings.json or CLAUDE.md.
            If something seems to need one of these, describe it and STOP.
DELIVERABLE: a diff plus the command that proves it, not a summary.
GATE:       your work is not done until <named gate> goes green AND has been proven red
            under its --broke.
```

**Three things the dispatcher does, not the agent:**

1. `git rev-parse HEAD` **before and after**, reconciled. The prohibition is advisory (Learned Rule
   #48); the reconciliation is the gate.
2. **Cap the agent's tool count at 20.** Past ~30 tools, quality degrades. `[Learned Rule #26]`
3. **A claim that a defect is fixed does not close a ticket.** A **registered gate that goes red
   under the old code** closes a ticket. Adversarial review stays — as a gate, not as a report.
   `[primary, aios-transfer design item 4]`

**What NOT to import from AIOS**, on its own authors' evidence: the bash guard (it blocks read-only
greps on token match), the routing bandit, the model router, the calibration curve (their own author
says the loop cannot close), the judge panels (no measured Cohen's kappa), and the trace ledger's
reward path. Import the trace ledger **only** as a one-line-per-build-run record, if build telemetry
is wanted at all. `[primary, aios-transfer design item 7]`

#### 11.12.6 Red-to-green, defined per class of change

| class | RED means | GREEN means |
|---|---|---|
| **defect fix** (step 2, the three parsing defects) | a test reproducing the defect on the *current* code fails | it passes, **and** the `--broke` that reintroduces the defect makes it fail again |
| **capability** (steps 1, 4, 6) | the named integration test fails because the capability does not exist | it passes end-to-end against a real second identity, not a mock |
| **tenancy** (step 1 only) | `test/tenancy/second-user-writes.test.ts` fails | it passes, and `grep -rn "sagnikmitra" src/` returns **nothing outside a comment** |
| **diagnostic** (step 5, `mdmax vocab`) | the tool reports 0 findings on a corpus known to contain them | it reports them on a corpus **this team did not write**, with `--json` and a nonzero exit |
| **documentation** | — | **there is no green.** A doc change is never progress under **P10.** Ship it, do not count it |

**A test on a rare fault proves nothing until it reproduces the fault.** Learned Rule #68: a UTF-8
truncation fix passed a live end-to-end run **and** a differential over 120 real artifacts with zero
failures under **both** the old and the new code, because the defect fires in ~0.34% of cases. Before
trusting a passing test, **make it fail against the unfixed code.** If you cannot, say the test does
not cover the bug.

#### 11.12.7 The five conversations — one week of calendar, zero engineering

**Across 34 research areas and roughly 8 million tokens: live model calls run zero, user
conversations run zero.** `[primary, stated in every area's unverified block]` Every claim about what
a user will feel about an orphaned comment, a login wall or a degradation certificate is
`[inference]`. **This is the cheapest instrument in the programme that can invalidate the most
expensive decisions, and it has never been picked up.**

**Recruit from three enumerable frames the research already named:**

1. posters on `forum.obsidian.md/t/2049` (246,568–249,616 views, 928 likes),
2. commenters on `obsidian-git` issues **340 / 396 / 558**,
3. authors of repos carrying an `llms.txt`.

`[primary, final-gate synthesis lens 3, ranked[4]]`

**Five calls, one question each, scored against the 14 pain themes.** Three pre-registered
predictions ride on them:

- **M3** (`product-gap`): *four of five reviewers stall at the login wall.* If it fires, **D3 is
  reopened as a product decision made at auth** (§11.6).
- **K-V3** (`custom-pointers`): *one user asking unprompted to name their own construct would
  outweigh every corpus number in that area.*
- **K-D** (`founder-thesis`): the one question that settles the mother-markdown — ask Sagnik whether
  the export he meant was always a zip of clean `.md` files (§11.9).

**Run these BEFORE steps 4 and 5, because they can cancel both.** They gate nothing else, so they run
in calendar parallel with steps 1 and 2.

#### 11.12.8 Re-derive 99.627%, or stop quoting it

Eight research areas rest on a number **nobody has reproduced**, measured on a corpus dominated by
revisions that delete nothing, at **BLOCK** level, when the product anchors **RANGES**.
`[primary, docs/mdmax/PLAN.md v2.0.0 §5.2 — "Nobody has re-derived the number. Not one of the areas
that quoted it."]`

The corpus is append-dominated, measured: in the `md` root (82.5% of corpus bytes) **4,948 of 5,715
`.md` file-revision pairs (86.6%) delete zero lines** — a figure the verifier corrected to **67.2%**
under the manifest's own exclusion policy, and **6.1%** on genuine consecutive pairs. `[measured]`
**A zero-deletion revision leaves every prior block byte-identical, so exact-hash resolves it by
construction** — which is why §1.1a's S1 figure of 87.0% and the append rate agree to within half a
point.

**Ships as:** a committed script under `scripts/derive/` with its captured output, reporting
**correct / false / refusal in four strata** (0 deleted lines · 1–2 · more than 2 · reflow), with
**n stated per stratum**, plus a **diff3-assisted baseline arm**.

**Blocked on a real acquisition task:** a corpus selected by **EDIT SHAPE, not authorship.** None of
the three pinned roots qualifies — the fraction of revision pairs deleting more than two lines is
**md 0.9%, knowledge 9.9%, frontmatter 8.3%**, against a 25% bar. `[measured]`

**If the >2-lines stratum yields under 200 block-versions on every available corpus, that is the
finding**, and the claim must be restated as *"exact-hash resolution over an append-dominated
corpus"* — true, defensible, and much smaller. **Until then, do not publish 99.627% anywhere.** It is
a credibility kill, not a market kill: the first competent outside reader will check it.

---

### 11.13 The 30-day test, written as a gate

**Due: Monday 2026-08-31.** `[verified: date -j -f "%Y-%m-%d" "2026-08-31" "+%A" → Monday]`

**The two conditions, evaluated by command, not by feeling:**

```bash
# Condition 1 — has a second GitHub login written to a document?
npx vitest run test/tenancy/second-user-writes.test.ts     # must exit 0
git log --format='%an <%ae>' --since=2026-08-01 -- src/ \
  | sort -u                                                 # must contain a non-Sagnik author

# Condition 2 — has Amit committed code?
git log --format='%an' --since=2026-08-01 -- src/ test/ | sort -u | grep -qi amit
```

**If either command fails on 2026-08-31:**

> **This is a library and not a company, and the honest move is to say so out loud.**

**"Out loud" is defined, so it cannot be softened into another document:**

1. Sagnik writes one paragraph in `docs/mdmax/PLAN.md` under a heading dated `2026-08-31`, stating
   which condition failed and what the number was.
2. The positioning changes in the same commit: MDMAX is described as a standalone markdown library,
   not as the capability layer of a collaboration product. The plan already describes this as the
   honest alternative.
3. One of three choices is made **that week**, not deferred: **(a)** Amit owns step 1 end to end with
   his own commits; **(b)** step 1 is contracted out; **(c)** the collaboration product is shelved and
   the library is shipped as a library. *"We will see"* is not on the list.

**Why 30 days and why these two conditions.** The `premortem` area ranks its top two risks — **N2 the
editor floor never shipped** and **N1 the research never became code** — both at severity **TOTAL**,
and notes that **N11 bus-factor-one is a multiplier on both rather than an independent failure**:
all 20 commits in `frontmatter` and all 416 in `md` are `Sagnik Mitra <sagnikmitra123@gmail.com>`;
Amit is named as co-author in the plan's frontmatter and as co-decider on D1–D5, and **has committed
nothing.** `[measured]` A gate that only tests the code tests one founder's calendar. A gate that
tests both tests the company.

**The falsifier for this gate itself:** if step 1 is green on 2026-08-31 but nobody outside the two
founders has ever opened the product, K1 passed and the company still has no evidence. Do not let a
green K1 substitute for the five conversations in §11.12.7.

---

### 11.14 The kill gates, complete, each with the number that trips it

| # | if this is true | measured how | then |
|---|---|---|---|
| **K1** | **No second GitHub login has written to a document by 2026-08-31** | §11.13, condition 1 | this is a library, not a company. Say so out loud |
| **K2** | **Amit has not committed code by 2026-08-31** | §11.13, condition 2 | same |
| **K3** | The re-derived anchor number is materially below **99.627%**, **or** the 30-line LCS diff baseline matches it (baseline stands at **86.658%**, re-derived **85.036%**, vs hash-alone **77.297%**) | §11.12.8 stratified script | the anchor is a fallback only. Re-scope the claim and **never publish the number** |
| **K4** | The **range** resolver's hand-audited false-match rate exceeds **~0.5%** | hand audit, n stated | comments cannot use it. Fall back to quote-plus-digest with visible orphaning |
| **K5** | Fewer than **5 of 30** probed users say they would install `cert` | §11.12.7, extended probe | cut `mdmax cert` |
| **K5b** | Semantic **BROKEN** falls **below 1% of blocks** on a corpus this team did not write (the honest measured figure on our own corpus is **4.28%** — a 4× margin, not 40×) | `mdmax cert` on an external corpus | cut `mdmax cert`. **This threshold did not exist before; K5 as previously written could never fire** |
| **K5c** | At **60 days**, recapturing the DECLARED (closed-SaaS) rows shows **zero cells moved** | re-run the cert matrix on 2026-10-01 | the dataset does not decay, a single copy is permanently level with ours, and the certificate is **a lead, not a moat** |
| **K6** | The orphan rate in the pilot is intolerable — threshold **>10% of all threads per week of normal editing** | the visible product metric shipped with the first comment | the review loop needs a different anchor, or a different product |
| **K7** | Multi-tenancy does not ship | step 1 gate | there is no Google-Docs story. Position the engine as a standalone library |
| **K8** | `mdmax cert` promotes itself: **15 of 30** probed users name the certificate as their reason to pay | §11.12.7 | **the inverse kill** — promote it and re-sequence the whole plan |
| **K9** | `inkeep/open-knowledge` ships the teammate model (today its changeset says a comment is *"a note to your own agent, not a message to a teammate"*) | watch the repo; it merged anchoring **2026-07-30** and published at **2026-08-01T02:38:33Z** | the empty intersection is no longer empty. Re-decide step 6 within a week, do not discover it in a demo |
| **K10** | P7a returns *"a zip of clean `.md` files"* **or** P7b (live-model tokens) fails to beat the file tree | §11.9 | pack/unpack is deleted, permanently. Keep only the D4 export zip |

**K1 and K2 are the ones that matter.** They fall due in thirty days. Everything else is a course
correction; those two are the company.

---

### 11.15 What we do not build — with the reason and the measurement

This table exists so nobody re-opens these. Each row is a measurement, not a preference.

| do not build | the measurement that closed it |
|---|---|
| **The container / mother-markdown / `mdmax pack` as a write surface** | boundary repair **119/120 WRONG** on the realistic merge case; container **25,548,765 B** vs index **105,538 B** = **242×**; revealed demand **846:1** against (`llm-code-format` 387/mo vs `repomix` 327,543); the only live-model measurement went **+5.2% tokens the wrong way** |
| **The markdown-as-graph / knowledge-graph thesis** | **46.8% of files sit in zero resolved edges**; **median out-degree 2** (median *document* degree 0); **45 transclusions in 25.5 MB**; max transitive blast radius **54 files** |
| **A format profile or any spec document** | MDMAX is a library with **two callers**, not a format with an ecosystem |
| **The declared-vocabulary mechanism, `fm:vocab`, any registry** | user-invention rate **0.31% across 5,245 files** in five corpora; where a spec *forced* a `type` field (four real OKF bundles) it produced **29 values across four incompatible naming conventions with ~42% mutual collisions** — drift, not vocabulary |
| **Every new carrier** | the best carrier on every objective axis (orphan link reference definition — wins capacity, wins invisibility in **6/6** renderer configs, byte-identical through remark **and** prettier) has **ZERO uses in 1,084 files and 25.5 MB**. The market's verdict: `markdown-it-decorate`, **1,094 downloads/week, unshipped since 2017** |
| **The folder compiler's incremental engine and rebuilder** | **507 of 1,084 files affect nothing downstream**; **530** have no dependents; max blast radius **54**; a full cold lex of all 25.5 MB is **1,056 ms**. Keep only the symbol table, the affected-target query and the orphan report — all useful at cold-build time |
| **Per-span confidence / uncertainty annotation** | **16 of 1,084 files** carry any evidence tier at all — in a corpus whose authors *mandate* tier tagging on every number. OKF explicitly refuses to store a credibility score |
| **A competing provenance vocabulary** | emit **OKF v0.2 §5.1** fields and move on. Being the third entrant behind Google and C2PA is not a position. The one genuine opening: a **PRODUCER-side checker**, which OKF explicitly declines to require and which nobody in its 287-repo ecosystem ships |
| **The streaming prefix-parse mode with stable block ids** | its own kill condition P3 predicts the failure (real model output is fence-heavy); and the "new category" is **one vendor counted up to four times** — `streamdown`, `remend`, `rehype-harden`, `harden-react-markdown` are all Vercel, with `streamdown@2.5.0` pinning `remend@1.3.0` as a **direct dependency**, halving the market signal to ~16M/mo |
| **The AI projection tier sold as a token saving** | the **25–168×** figures are ratios between *artifact sizes*; the only measurement of *task* tokens found **+5.2%** and **more** files opened. Restate as a compression ratio or delete the sentence |
| **The graph view** (it ships today, and carries a runtime dependency: `react-force-graph-2d`) | `graph` appears **0 times** across 89 sourced feature requests and **0 times** in the round-2 corpus; **median document degree in the founder's own vault is 0** |
| **`EditableTable` / `setTableCell`** | dead code today — imported by nothing, callback named `_onEdit` — with a measured **13.4% no-op dirty rate** and silent escaped-pipe corruption. **Delete rather than fix** |
| **The claim that markdown volume is exploding** | repository share fell **12.68% → 10.41%** on one measurement and rose on an independent ten-repo test — **unproven in both directions, so say nothing.** The defensible claim is that markdown's **reader** changed |
| **Any further research fan-out** | two workflows, 34 areas, ~8 million tokens, **6,233 documentation lines against 365 code lines**, **zero live model calls**, **zero user conversations.** The marginal research hour is now provably worth less than the marginal test |

`[all measured, corpus_id sha256:3a010b16… where the figure concerns our own files; final-gate
synthesis lens 3, what_to_cut, and lens 1]`

**Two cheap wins that survive the cull**, because both are diagnostics that write no bytes and cannot
flatter the team — the same rule that selected `mdmax cert`:

1. **The placeholder linter.** **1,431 bare angle-bracket tokens in 219 of 1,084 files (20.2%)** that
   GitHub silently **DELETES** from rendered output. One-backtick fix, verified remediation.
   `[measured]`
2. **`mdmax vocab`** (~2 days): report the enum a corpus already uses, plus case and morphology
   drift, plus the **18.91% of frontmatter blocks that no YAML parser reads.** `[measured]`

---

### 11.16 The first week — Monday 2026-08-03 to Friday 2026-08-07

`[all weekdays verified: date -j -f "%Y-%m-%d" "<date>" "+%A"]`

**Monday 2026-08-03**

| time | what | proof it happened |
|---|---|---|
| 09:00–09:30 | Read this section and §11.14 out loud, together. Agree the 2026-08-31 date. | nothing to commit; if this is skipped, the rest is theatre |
| 09:30–10:00 | **§11.2.1** — add `exclude` to `vitest.config.ts` | `npx vitest list --filesOnly \| wc -l` → **83** |
| 10:00–10:30 | Run `npm run test` on the real 83 files. **Record the pass/fail count in the commit message.** | first honest baseline |
| 10:30–11:00 | Remove both stale worktrees; `git worktree prune` | `git worktree list` shows one entry |
| 11:00–12:00 | **§11.2.2** — `scripts/derive/corpus-id.mjs`, run it, commit script + output | prints `sha256:3a010b16…` exactly |
| 13:00–14:00 | **§11.2.3** — resolve the §1.1a **113 vs 14** contradiction; **§11.2.4** — delete the litter | one commit each |
| 14:00–17:00 | **Write and commit `test/tenancy/second-user-writes.test.ts`, RED.** Commit message begins `RED:` | the test fails, for the right reason, and that reason is in the commit body |
| 17:00–17:30 | Send five recruiting messages for **§11.12.7** | five sent, replies expected by Wednesday |

**Tuesday 2026-08-04**

| time | what | proof |
|---|---|---|
| 09:00–13:00 | **Step 2 in one sitting.** `src/modules/share/domain/splice-frontmatter.ts` + barrel; rewrite `share-writer.ts` to use it; `try/catch` around the read so the 171 unparseable files stop 502-ing | the gate test, committed RED first, moves from **33/907** toward 907/907 |
| 13:00–15:00 | Build the **oracle** that shares no code with the writer (`Buffer.compare` on re-read bytes) | oracle imports neither `yaml` nor `gray-matter` nor the splicer |
| 15:00–16:00 | Register the **splice-conformance gate**; write its `--broke` (reintroduce `matter.stringify`) and prove it goes red | `gate.mjs --verify-all` green |
| 16:00–18:00 | Step 1 task **1b** — delete `allowlist.ts` and its test; rewrite the `signIn` callback | typecheck green, the RED test fails one assertion later than yesterday |

**Wednesday 2026-08-05**

| time | what | proof |
|---|---|---|
| 09:00–12:00 | Step 1 task **1c** — the `tenancy` module: user + vault documents on first login, matching `firestore.rules` field-for-field | `firestore()` finally has callers |
| 12:00–13:00 | **Conversation 1 and 2.** One question each. Score against the 14 pain themes | written notes, same day, before memory edits them |
| 14:00–18:00 | Step 1 task **1d** begins — per-user GitHub credential. **The riskiest task in the plan** | `GITHUB_REPO_TOKEN` no longer appears in `client.ts:30` or `github-writer.ts:33` |

**Thursday 2026-08-06**

| time | what | proof |
|---|---|---|
| 09:00–13:00 | Task **1d** continues | every read and write path uses the signed-in user's token |
| 13:00–14:00 | **Conversation 3 and 4** | notes |
| 14:00–16:00 | Task **1e** — `AUTHOR` becomes a parameter; update the four use-cases at `dependency-container.ts:66,70,75,80`; **update `AGENTS.md` §7 in the same commit** (§11.2.5) | `grep -rn "sagnikmitra" src/` returns nothing outside a comment |
| 16:00–18:00 | **§11.12.3** — port `gate.mjs`, selftest first | selftest 10/10; four distinct REFUSED exit codes reproduce |

**Friday 2026-08-07**

| time | what | proof |
|---|---|---|
| 09:00–11:00 | The three parsing defects: `WIKILINK_RE` (k=2.00), the YAML 1.1/1.2 divergence, plus `eslint-plugin-redos` in CI | three commits; **then close the `parsing-robustness` area** |
| 11:00–12:00 | **Conversation 5.** Ask Sagnik **K-D** verbatim: *"was the export you meant always a zip of clean `.md` files?"* | §11.9's P7a resolved, or explicitly still open |
| 13:00–15:00 | Task **1f** — the signup / repo-picker route into `src/app/(workspace)/` (today: one `.gitkeep`) | a route exists |
| 15:00–16:00 | **§11.11.4** — worktree preflight + before/after HEAD reconciliation, wired before any parallel agent run | preflight refuses a stale worktree |
| 16:00–17:00 | **Week review against this table.** Anything not done moves to Monday **with its estimate revised**, not silently carried | one paragraph in `docs/mdmax/PLAN.md`, dated |
| 17:00–17:30 | Merge `engine/plan-and-diagnostics` into `main` so `main` stops being a month stale | `git rev-list --left-right --count origin/main...HEAD` → `0 0` |

**What this week deliberately does NOT contain:** any work on `mdmax cert`, any work on the review
loop, any work on pack/unpack, and any further research. If step 1 is not visibly closer by Friday,
that is the signal — not a reason to go and measure something else.

---

### 11.17 What this section does not cover, and what would falsify it

**Not covered here.** Pricing mechanics and billing integration (step 3 names anchors, not a
payments implementation). Marketing, launch sequencing and the landing page. Legal, terms and the
data-processing agreement for a product that will hold other people's documents. Hiring. Anything
about AIOS beyond the four mechanisms §11.12 imports — AIOS is a **separate track** (**D5**) that
benefits from MDMAX and is not part of it. Mobile-native wrappers. Importers. Search at scale.
Anything in `FRONTMATTER-PRODUCT-PLAN.md` Phases 2, 4 and 5.

**The weakest parts of this section, named.**

1. **The effort estimates are `[inference]`, not `[measured]`.** They come from decomposing tasks, not
   from having done them. The one velocity datum available — **28 lines of product source per day
   over 19 days** — argues every estimate here is optimistic. Treat them as hypotheses that K1 and K2
   test.
2. **The 66.4% vitest figure is measured; the consequence is inferred.** I ran
   `npx vitest list --filesOnly` and counted 164 of 247 files in `.claude/worktrees/`. I did **not**
   run the suite and observe a false pass or a false failure caused by them. The mechanism is
   certain; a specific incident has not been demonstrated. Run `npm run test` before and after the
   exclude and record both numbers.
3. **Two lenses of the same research run disagree on the order of the first two steps** (§11.1). This
   section resolves the disagreement by making them parallel and disjoint. If they turn out to share
   a file, the resolution is wrong and one of them must go first — check the disjoint-artifact map in
   §11.11.3 before dispatching.
4. **Step 7's placement contradicts the evidence, and this section says so** rather than quietly
   dropping it (§11.9). If Section 3 of this plan sequences pack/unpack unconditionally, Section 3
   and Section 11 disagree, and **the measurements in §11.9 govern** until someone produces P7b.
5. **The verifiers behind roughly half these numbers have a measured false-kill rate of 0–19%.**
   Where a kill drives a "do not build" row in §11.15, that row is strong evidence, not proof. The
   rows I would re-check first if someone pushed back: the graph view (a `grep` for the word "graph"
   is a crude demand instrument) and the streaming prefix mode (its kill is a prediction about model
   output that nobody has measured on model output).

**What would falsify this section, concretely.**

- **Step 1 goes green in under three days.** Then the 8–12 day estimate was wrong by 4×, the whole
  premise that tenancy is the bottleneck deserves a second look, and step 3 should start immediately.
- **The splice gate passes at 907/907 on the *first* run against the *current* writer.** Then the
  measured 33/907 is wrong and every downstream claim about frontmatter corruption needs re-deriving
  before it is repeated to anyone.
- **Three of the five conversations say the login wall is fine.** Then M3 did not fire, D3 stands as
  written, and step 4 simplifies.
- **A second GitHub login writes a document and nothing else on this list changes.** Then K1 passed
  and the plan still has no customer — which is the failure mode §11.13's falsifier exists to catch.


---

---

### Links

**This section references:** [§0 Status](00-status.md) · [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§5 Rendering](05-rendering.md) · [§7 Product](07-product.md) · [§9 AIOS](09-aios.md) · [§10 Engine spec](10-engine-spec.md)

**Referenced by:** [§0 Status](00-status.md) · [§6 Conventions](06-conventions.md) · [§9 AIOS](09-aios.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
