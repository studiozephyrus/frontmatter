---
id: 32-DEPLOYMENT-AND-OPS
title: Deployment and operations
mode: how-to
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [deployment, vercel, domains, deploy-rollback, ignored-build-step]
---

# 32. Deployment and operations

**Two surfaces deploy from this repository, to two different Vercel teams, with two different
tokens. Mixing them is the trap that has burned this repository more than once.** Read section 1
before running any Vercel command.

---

## 1. The two homes, and which token each needs

Surface | Vercel team | Team id | Project | Token | Scope flag
The app | `zsco` | `team_RSlKvg8AqX8hr5WIuKXlNXGE` | `frontmatter` | `VERCEL_TOKEN_ZEPHYRUS` | **always `--scope zsco`**
The decisions site | (unnamed in the repository) | `team_CDEATPKml1m8SIZSJ0DKdEjG` | `frontmatter-decisions` | the bare `VERCEL_TOKEN` | none; the script passes `teamId`

**The rule in one line.** `VERCEL_TOKEN_ZEPHYRUS` plus `--scope zsco` for anything to do with the
product. The bare `VERCEL_TOKEN` for the decisions site, and for nothing else.

**Why it matters and not just tidiness.** The bare token can see a project called
`frontmatter-decisions` and cannot see `frontmatter`. A command with the wrong token does not fail
usefully; it reports that the project does not exist, or it succeeds against the wrong surface.

**The team ids are verifiable in the repository, not from memory:**

- `zsco` and `team_RSlKvg8AqX8hr5WIuKXlNXGE` are in `CLAUDE.md` and `AGENTS.md` section 6b.
- `team_CDEATPKml1m8SIZSJ0DKdEjG` is a literal at `decisions/tools/deploy.mjs:8`, beside
  `const NAME = 'frontmatter-decisions'` at `:9`.

### 1.1 The GitHub trap, which is worse

**Never run `gh auth login` or `gh auth setup-git` with `GH_TOKEN_ZEPHYRUS`.**

Both rebind **every repository on the machine** to the wrong identity. It is not scoped to this
repository, it is not scoped to this shell, and undoing it means re-authenticating everything else
the person owns.

**Pass the token per command instead:**

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && \
  GH_TOKEN="$GH_TOKEN_ZEPHYRUS" gh <command>
```

**For git itself, sourcing is enough.** `.git/config` holds a credential helper that reads
`$GH_TOKEN_ZEPHYRUS` from the environment, so the token is never written into the repository:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && git push
```

**A push that fails with `Repository not found` almost always means the token file was not
sourced**, and the macOS keychain answered with the personal account instead. `33-RUNBOOK.md`
carries that entry.

**Never print the token file or any value from it.** Not with `cat`, not with `echo`, not into a
log, not into a commit message, not into this pack.

---

## 2. How the app deploys

**Branch `main` is auto-deployed.** A push to `main` on `studiozephyrus/frontmatter` triggers a
Vercel build on team `zsco`. There is **no GitHub Actions workflow**: `.github/` does not exist at
`0af3c90` `[O]`. Vercel's git integration is the whole pipeline.

**`vercel.json` configures three things and nothing else:**

```json
{
  "framework": "nextjs",
  "ignoreCommand": "bash scripts/vercel-ignore-build.sh",
  "functions": {
    "src/app/api/export/pdf/[...path]/route.ts": { "memory": 1769, "maxDuration": 60 }
  }
}
```

**The PDF function's two numbers are load-bearing.** `1769` MB and `60` seconds. Headless Chromium
does not fit in the default allocation, and a PDF of a long document does not finish in the default
timeout. Changing either is a change you prove by rendering a PDF on a deploy, not by reading.

### 2.1 The ignored build step, and how to read its decision

`scripts/vercel-ignore-build.sh` runs **before** clone-deps and build. Its exit codes are inverted
from what most people expect:

Exit | Meaning
`0` | **Skip** the build. The previous deployment is reused
`1` | **Proceed** with the build

**Three rules, in the order the script applies them:**

1. `VERCEL_GIT_PREVIOUS_SHA` empty (first deploy, fresh promote, build cache wipe) means **build**.
2. The previous sha unresolvable in this clone (shallow checkout, force push, rebased history)
   means **build**.
3. Otherwise `git diff --quiet PREV CUR` over the watched paths. A difference means **build**.

**The watched paths, exactly:**

```
src  public
package.json  package-lock.json
next.config.ts  tsconfig.json
eslint.config.mjs  postcss.config.mjs
vercel.json  scripts/vercel-ignore-build.sh
.nvmrc
```

**What this means in practice.**

Change | Rebuilds
Anything under `src/` or `public/` | yes
A dependency or a lockfile change | yes
A config file in the list | yes
`vercel.json` or the ignore script itself | yes
**Anything under `docs/`** | **no**
`specs/`, `test/`, `src-tauri/`, `scripts/` other than the ignore script | no
`.obsidian/` | no

**So a docs-only commit produces a green Vercel entry that did not build.** That is correct
behaviour, and it will look like a failed deploy to somebody who does not know. The log line is
`[ignore] no watched-path changes - skipping build.`

**`.vercelignore` is a second layer**, and it holds three lines: `src-tauri`, `test`, `specs`.

### 2.2 Deploying the app by hand

Almost never needed, because `main` auto-deploys. Two cases justify it: the git integration is not
firing, or you want the config validated before pushing.

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && \
  npx vercel --prod --scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"
```

**The reason this is in the file at all.** A push that produces **no deployment at all**, with no
failed build and no dashboard entry, is usually an invalid `vercel.json`. Vercel's router rejects
it and the webhook records nothing. **The command-line deploy validates the config and prints the
reason in about a second.** Reach for it before touching the git integration or the project's link
settings, which are almost never the cause.

---

## 3. How the decisions site deploys

**It is a separate deployment, to a separate team, with no build step.** The source is
`decisions/`, and a copy is mirrored into `public/decisions/` so the app serves it too.

**The full sequence, from `decisions/README.md`:**

```bash
# 1. Edit the per-area sources
$EDITOR decisions/v2/features.json

# 2. Validate against the contract; must be 0 errors
python3 decisions/tools/validate.py decisions/v2

# 3. Rebuild. --links is REQUIRED
python3 decisions/tools/build-v2.py decisions/v2 \
  --links decisions/v2/_links.json --out decisions/questions.js

# 4. Mirror into the app's public copy
rsync -a --delete --exclude=README.md --exclude=v2 --exclude=tools \
  decisions/ public/decisions/

# 5. Deploy
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && node decisions/tools/deploy.mjs
```

**Four things will bite you here.**

- **`questions.js` is generated.** Hand-editing it is lost on the next build. `CLAUDE.md` says so
  and so does `decisions/README.md`.
- **`--links` is not optional.** Without it, the 60 cross-area duplicates that were removed come
  back silently.
- **Step 4 is easy to skip**, and then the live site and the copy the app serves at `/decisions/`
  disagree. Nothing warns you.
- **Step 5 needs the bare `VERCEL_TOKEN`**, not the Zephyrus one. `decisions/tools/deploy.mjs:6`
  reads `process.env.VERCEL_TOKEN` and exits `2` if it is missing.

### 3.1 What the deploy script does, and why each part exists

`decisions/tools/deploy.mjs` posts a static deployment to `POST /v13/deployments` with
`projectSettings` all `null`, so Vercel runs no framework, no build command and no install.

**It ships a fixed list of sixteen files** (`decisions/tools/deploy.mjs:17` to `:25`), and the comments record why
each group is there:

Group | Files | Why the list is fixed
Page | `index.html`, `app.css`, `app.js`, `diagram.js`, `questions.js`, `fonts.css` | The six that render the site
Cache | `vercel.json` | Without it every asset returns `max-age=0, must-revalidate`, so all six revalidate on every visit. Six round trips before paint
Mockups | `mockups.html`, `mockups-data.js` | `mockups-data.js` is loaded by **both** `index.html` and `mockups.html`. Omit either and a card links nowhere
Installability | `manifest.webmanifest`, `sw.js`, and four icons | The manifest names the icons, the icons make it installable, `sw.js` makes it a page that installs rather than a bookmark. Omit one and the other two cannot do their job

**Adding a file to `decisions/` does not ship it.** Add it to `SHIP` in `deploy.mjs` in the same
change, or it silently 404s in production while working locally.

**Two operational behaviours worth knowing:**

- **It polls the deployment's own `readyState`, not a URL**, up to 60 times at 2 second intervals,
  and exits `1` on anything other than `READY`. That is the right shape: the artefact's state, not
  a guess from the outside.
- **It turns deployment protection off if it is on.** Protection defaults to on for a new project.
  The comment at `decisions/tools/deploy.mjs:59` records the reason it is checked through the API rather than by
  fetching the page: **a login page returns 200 after a redirect.**

### 3.2 Checking a deployed page, and the one-character mistake

**Use `curl -sI`. Never `curl -sL`.**

```bash
curl -sI https://frontmatter-decisions-sagnik.vercel.app/ | head -1
```

`-L` follows redirects, so a protected deployment redirecting to a login page returns `200 OK` and
you conclude the site is fine. `-I` shows the actual status of the URL you asked for.

**Three real defects in the decisions site were invisible locally and only appeared when the live
page was driven.** `CLAUDE.md` records this as a rule: **verify against the deployment, not the
local file.**

---

## 4. Domains

Domain | Where it points | Status
`frontmatter.in` | The app, apex | Live. The brand domain
`www.frontmatter.in` | 301 to the apex | Live
`frontmatter.sgnk.ai` | The app | Attached as a secondary
`frontmatter.vercel.app` | The app | The Vercel default
`frontmatter-decisions-sagnik.vercel.app` | The decisions site | Live, deliberately public
`frontmatter-md.firebaseapp.com` and `frontmatter-md.web.app` | Firebase Auth handler | Authorised domains only
`md.sgnk.ai` | **The desktop shell loads this**, not the app | See `31-LOCAL-SETUP.md` section 5

**The zone is not on the company's account.** `frontmatter.in` is a Cloudflare zone on **Sagnik's
personal account**, by deliberate choice (`AGENTS.md` section 6b). The plan moves it to the company
before the first stranger (`docs/mvp0/PRODUCT-PLAN.md` section 24), and records the domain registration
itself as **unverified**.

**The six authorised domains for Firebase Auth** are listed in `firebase.json`: `localhost`,
`frontmatter-md.firebaseapp.com`, `frontmatter-md.web.app`, `frontmatter.in`, `www.frontmatter.in`,
`frontmatter.vercel.app`. **A Vercel preview URL is not among them**, so Google sign-in fails on a
preview. That is `39-SHARING-A-BUILD.md`'s problem and it is not a bug.

**Adding a domain is a Vercel dashboard action plus, for Google sign-in, a Firebase authorised
domain.** Doing one without the other produces a site that loads and cannot sign anybody in.

---

## 5. Rollback

**There is no tagged release to roll back to.** `git tag` returns nothing at `0af3c90` `[O]`, and
`35-RELEASE-AND-VERSIONING.md` proposes the scheme. Until that lands, rollback means promoting an
earlier Vercel deployment.

### 5.1 Roll the app back

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && \
  npx vercel ls frontmatter --scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"
```

Pick the deployment URL you want, then promote it in the Vercel dashboard, or:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && \
  npx vercel promote <deployment-url> --scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"
```

**`vercel rollback` and `vercel rm` are destructive.** Under this workspace's rules they need
per-operation approval before they run: name the operation, state the blast radius, say what was
checked, ask, and wait for an explicit yes. `38-INCIDENT-AND-SEVERITY.md` carries the ladder that
says when it is worth asking at speed.

**A promote does not revert the repository.** The next push to `main` deploys `main` again, over
the promotion. **Revert the commit too**, or the rollback lasts until somebody pushes anything.

### 5.2 Roll the decisions site back

Re-run `node decisions/tools/deploy.mjs` from a checkout at the older commit. The script always
deploys the working tree, so the way back is to check out the good state and run it again. **It
posts a new deployment rather than reverting one**, which is slower and safer.

### 5.3 What a rollback cannot undo

Thing | Why not
A Firestore write | Rolling the app back does not roll data back. There is no point-in-time restore configured. See `37-BACKUP-AND-RECOVERY.md`
A GitHub commit the app made on a user's behalf | It is in their repository's history
An environment variable change | Vercel env is not versioned with the deployment
A renamed persistence key | The user's local state is already orphaned. See `36-DATA-MIGRATION-PLAN.md`

---

## 6. The checks that gate a deploy

**Before any commit**, per `AGENTS.md` section 4:

```bash
npm run verify    # typecheck, lint, test, build, arch, spec
```

**Also, and not inside `verify`:**

```bash
npm run corpus    # 8,513 byte-pinned files; exits 1 on one changed byte
```

**There is no continuous integration running these.** No `.github/workflows` exists, so **the gates
run where a person or an agent runs them, and nowhere else.** A push that skipped `npm run verify`
reaches production if it builds on Vercel, and Vercel only runs `next build`.

**That is the single largest operational gap in this file.** It is not a defect to be fixed in
passing; it is a decision about where the gates live, and it belongs in `56-OPEN-DECISIONS.md`.
`docs/mvp0/PRODUCT-PLAN.md` section 21 already assumes a continuous-integration measurement for the
bundle budget, which implies one is coming.

---

## 7. Agents, and the reconciliation that is the real gate

**`AGENTS.md` rule 4:** agents propose, the founder merges.

```bash
git rev-parse HEAD     # before any agent run
# ... the agent runs ...
git rev-parse HEAD     # after
git log --oneline <before>..<after>
```

**The instruction not to commit is advisory. The reconciliation is the gate.** This is written from
experience: agents have committed despite an explicit prohibition in every prompt.

**Before any push, prove the commit holds only your paths:**

```bash
git show --name-only HEAD | grep -vcE '<your paths>'   # must print 0
```

`git commit` commits the **index**, not the paths you just added. A stale index from an earlier
session puts other people's files in your commit. Fix with `git reset --mixed <upstream>`, which
touches the index only. **Never `git stash` somebody else's dirty tree.**

**Author commits as `Sagnik Mitra <sagnikmitra123@gmail.com>`**, which matches `AUTHOR` in
`src/container/dependency-container.ts` for the GitHub commits the app makes on a user's behalf.

---

## 8. A deploy checklist that fits on one screen

1. `git fetch` and compare `origin/main` to `HEAD`. **Building on a stale clone is how a version
   collision happens.**
2. `npm run verify`. Six gates, all green.
3. `npm run corpus` if the engine or any fixture changed.
4. `git show --name-only HEAD | grep -vcE '<your paths>'` prints `0`.
5. `source ... && git push`. Never `git push --force` on a shared branch.
6. Watch for a Vercel entry. **No entry at all means `vercel.json` is probably invalid.** Run the
   command-line deploy from section 2.2 and read the error.
7. `curl -sI https://frontmatter.in/` and check the first line. **Never `-sL`.**
8. If the decisions site changed, run steps 2 to 5 of section 3, including the `rsync` mirror.

---

## 9. Limits of this file

**What was not assessed.**

- **No Vercel command was run in the session that wrote this file.** Every command here is
  constructed from `AGENTS.md`, `CLAUDE.md`, `vercel.json`, `scripts/vercel-ignore-build.sh` and
  `decisions/tools/deploy.mjs`. The flags are the documented ones, not ones observed working.
- Deployment protection state on the `frontmatter` project. `decisions/tools/deploy.mjs` handles it
  for the decisions site; nothing in the repository says what the app's setting is.
- The Cloudflare side of `frontmatter.in`: records, proxy status, page rules. **Not opened.**
- Whether `sagnik-old` still exists on GitHub, or should be deleted.

**What could not be verified.**

- The `vercel promote` syntax, checked on 2026-09-18 `[O]` with Vercel CLI 50.13.2 (`vercel
  --version`). `vercel promote --help` prints `vercel promote url|deploymentId [options]`, and lists
  `--scope` and `--token` as global options, so section 5.1's command is valid. One caveat: the repo
  does not pin `vercel` in `package.json`, so `npx vercel` runs whatever version npm serves that day.
- `UNVERIFIED:` the domain registration owner. The registry's RDAP record, read 2026-09-18 `[O]` at
  `https://rdap.nixiregistry.in/rdap/domain/frontmatter.in`, shows registrar `GoDaddy`, registered
  `2026-06-24`, expiring `2029-06-24`, and a registrant redacted except `West Bengal`. Needs: the
  GoDaddy account that holds it. Decision D10 moves it to the company either way.
- The name of the Vercel team holding `frontmatter-decisions`. Only the id appears in the
  repository.

**What is not established.**

- Where the gates should run once there is more than one person pushing. Section 6 states the gap
  and does not resolve it.
- Whether the app's ignored-build-step allowlist should include `specs/`. A spec change can change
  a gate's verdict without changing the artefact, so both readings are defensible.

**What would falsify this file.**

- A `vercel` command in section 1's table succeeding with the other team's token.
- A docs-only push producing a Vercel build, which would mean the ignore script stopped working.
- `git tag` returning a tag, which would mean section 5's premise has changed and
  `35-RELEASE-AND-VERSIONING.md` has landed.
