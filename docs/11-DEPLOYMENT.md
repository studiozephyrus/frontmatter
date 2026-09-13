---
mode: reference
updated: 2026-09-09
verified_against: 6331b1b
---

# DEPLOYMENT

> **Method.** I read `AGENTS.md` §6b, §7 and §8, `vercel.json`, `.vercelignore`,
> `.vercel/project.json`, `scripts/vercel-ignore-build.sh` in full, `next.config.ts`,
> `src/proxy.ts`, `decisions/README.md`, and the deploy section of
> `HANDOFF-decisions-v2-2026-09-09.md` (§5.4). I probed the live surfaces with `curl -sSI`
> from this machine on 2026-09-09 and recorded the status codes and `location` headers
> verbatim. I confirmed the `POST /v13/deployments` request-body fields against Vercel's own
> REST API reference.
>
> **What this pass did NOT do.** I ran **no deploy, no promote and no rollback** — every
> mutating command below is written out but was not executed, and each is a RULE 2 operation
> requiring per-operation approval. I did not read any token file (the sandbox denies
> `/Users/sagnikmitra/.config/codex-env`), so I could not call the Vercel API and could not
> confirm which team the `frontmatter-decisions` and `frontmatter-prototype` projects
> actually sit in, nor list their deployment history. I did not verify the base64 `encoding`
> field on inlined deployment files. I did not inspect Cloudflare DNS.

## 1. The three deployed surfaces

There is not one deployment. There are three Vercel projects, and only the first one is
wired to git.

| Surface | Vercel project | Source in this repo | Trigger | Live check on 2026-09-09 |
|---|---|---|---|---|
| The app | `frontmatter` | the whole Next.js repo | git push to `main` | `https://frontmatter.in/` → **200** |
| The decisions site | `frontmatter-decisions` | `decisions/` — static, no build | manual `POST /v13/deployments` | `https://frontmatter-decisions-sagnik.vercel.app/` → **200** |
| The prototype | `frontmatter-prototype` (**name unverified**) | `docs/prototype/frontmatter-prototype.html` | manual, method unrecorded | `https://frontmatter-prototype-sagnik.vercel.app/` → **200** |

The `-sagnik` suffix on the second and third hostnames is Vercel's project-plus-owner
naming. I could not confirm which scope owns them without a token, so treat their ownership
as **unverified**; `HANDOFF-decisions-v2-2026-09-09.md` §5.4 states the decisions project is
in team `team_CDEATPKml1m8SIZSJ0DKdEjG`.

### Domains on the app project

```
$ curl -sSI https://frontmatter.in/        → HTTP/2 200
$ curl -sSI https://www.frontmatter.in/    → HTTP/2 307, location: https://frontmatter.in/
$ curl -sSI https://frontmatter.sgnk.ai/   → HTTP/2 200
```

`AGENTS.md` §8 says "`www` 301s to it". The live response is **307**, not 301. Functionally
equivalent for a browser; not equivalent for a crawler or for anything that caches
permanent redirects. Either the doc or the Vercel redirect rule should change; I have not
changed either.

## 2. Account ownership, and one contradiction to resolve

`AGENTS.md` §6b:

| Surface | Owner |
|---|---|
| GitHub | `studiozephyrus/frontmatter` (a personal User account, not an org) |
| Vercel | team `zsco` (`team_RSlKvg8AqX8hr5WIuKXlNXGE`), project `frontmatter` |
| Firebase | `frontmatter-md` under `studiozephyrus@gmail.com` |
| Cloudflare | Sagnik's personal account — zone `frontmatter.in`. A deliberate split. |

**The Vercel team id in `AGENTS.md` does not match the linked project.** `.vercel/project.json`
in this working tree reads:

```json
{"projectId":"prj_fdlYirEdleb91svwJwnWOz7XbiNj","orgId":"team_CDEATPKml1m8SIZSJ0DKdEjG","projectName":"frontmatter"}
```

`orgId` is `team_CDEATPKml1m8SIZSJ0DKdEjG`; `AGENTS.md` §6b says `team_RSlKvg8AqX8hr5WIuKXlNXGE`.
The handoff document independently gives `team_CDEATPKml1m8SIZSJ0DKdEjG` for
`frontmatter-decisions`. I could not call the API to establish which id belongs to the slug
`zsco`, so **which of the two is wrong is unverified** — but they cannot both be the team
that owns project `frontmatter`. Resolve this before scripting any deploy, because a wrong
`--scope` fails with a "project not found" that reads exactly like an auth failure.

Note also that `.vercel/` is in `.gitignore`, so that file exists only on this machine and a
fresh clone will have no project link at all until someone runs `vercel link`.

### Credentials

Per `AGENTS.md` §6b: always `--scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"`, never the bare
`VERCEL_TOKEN`. Source the token file in the same shell invocation and never print a value:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && vercel ... --token "$VERCEL_TOKEN_ZEPHYRUS"
```

## 3. How the app ships

`main` is auto-deployed. There is no CI, no GitHub Action and no pre-deploy gate — `.github/`
does not exist. **The only thing standing between a commit and production is whoever ran the
gates locally.** Run them first (see `docs/10-LOCAL-SETUP.md` §6, and note that
`npm run verify` is red at `e318ab3` on lint).

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && git push origin main
```

### What Vercel is told to do

`vercel.json`, complete:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "ignoreCommand": "bash scripts/vercel-ignore-build.sh",
  "functions": {
    "src/app/api/export/pdf/[...path]/route.ts": { "memory": 1769, "maxDuration": 60 }
  }
}
```

The PDF export route gets 1,769 MB and 60 seconds because it launches headless chromium.
`next.config.ts` supports that with `serverExternalPackages: ["@sparticuz/chromium",
"puppeteer-core"]` and `outputFileTracingIncludes: {"/api/export/pdf/**":
["./node_modules/@sparticuz/chromium/**"]}`. The comment there records why the narrow
`bin/**` glob was widened: file tracing could not detect a binary resolved by runtime path,
and the lambda failed at runtime with `.../bin does not exist`. If you touch either field,
the failure mode is a 500 on PDF export in production only.

`.vercelignore` excludes `src-tauri`, `test` and `specs` from the upload.

### The ignored-build step

`scripts/vercel-ignore-build.sh` decides whether a push rebuilds. Its contract is inverted
and easy to misread: **exit 0 skips the build, exit 1 proceeds with it.**

It builds unconditionally when `VERCEL_GIT_PREVIOUS_SHA` is empty or unresolvable in the
clone (first deploy, fresh promote, cache wipe, force-push, rebase). Otherwise it diffs the
previous commit against the current one over this watched set, and builds only if something
in it changed:

```
src  public
package.json  package-lock.json
next.config.ts  tsconfig.json
eslint.config.mjs  postcss.config.mjs
vercel.json  scripts/vercel-ignore-build.sh
.nvmrc
```

Consequences worth internalising:

- A commit that only touches `docs/`, `decisions/`, `specs/`, `test/`, `src-tauri/` or
  `AGENTS.md` **will not redeploy**, and that is intended.
- `decisions/` is *not* watched. Editing the decisions source in this repo does not ship the
  decisions site. That site has its own deploy path — §4.
- `public/` **is** watched, so a new static asset does redeploy — but redeploying is not the
  same as being reachable. See §5 and `docs/29-RUNBOOK.md` §2.

### After a push

```bash
curl -sSI https://frontmatter.in/ | head -1
```

Expect `HTTP/2 200`. See §6 for why `-sI` and not `-sL`.

## 4. How the decisions site ships

`decisions/` is a static directory: `index.html`, `app.css`, `app.js`, `diagram.js`,
`questions.js`, `fonts.css`. No build step, no server, no dependency — `decisions/README.md`
says so and the file listing agrees. `fonts.css` is 271 KB because the typefaces are embedded
so the page renders offline. `questions.js` is 1.7 MB and sets `window.QUESTIONS`; everything
else in the app is a projection of that array.

It is a **different Vercel project** from the app: `frontmatter-decisions`. It is not on the
git integration, and its watched-paths guard (§3) would exclude it anyway.

**The deploy script does not exist in this repo.** `HANDOFF-decisions-v2-2026-09-09.md` §5.4
records that it lived in a scratch directory and did not survive the session, and instructs
whoever comes next to rewrite it. I grepped the whole repo for `v13/deployments` and the only
hit is that handoff document. So the procedure below is a reconstruction, and **it has not
been executed**.

### Before deploying, validate

```bash
cd /Users/sagnikmitra/Desktop/GitHub/frontmatter
python3 decisions/tools/validate.py decisions/v2       # 0 errors expected
python3 decisions/tools/build-v2.py decisions/v2 --dry # the assembly plan
node -e "new Function(require('fs').readFileSync('decisions/app.js','utf8'))"   # parse check
python3 scripts/css-cascade-check.py decisions/app.css # dead media-query rules
```

Those four are quoted from the handoff's "run basics". I did not run them.

### Path A — the CLI (preferred)

The CLI implements the upload protocol (sha negotiation, `/v2/files`) that a hand-written
`POST` has to reimplement. For a directory of static files with no framework:

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh
vercel deploy decisions \
  --prod \
  --scope zsco \
  --token "$VERCEL_TOKEN_ZEPHYRUS" \
  --name frontmatter-decisions
```

**Unverified** — I did not run this, and the exact flag set for Vercel CLI 50.13.2 (which is
what `npx vercel --version` reports here) should be checked with `vercel deploy --help`
before use. Note that `--name` is deprecated in recent CLI majors; if it is rejected, link
the directory once (`vercel link --scope zsco --project frontmatter-decisions`) and drop the
flag.

**Trap, from a prior incident recorded in the studio's learned rules:** a Vercel CLI prompt
cannot be answered by piping into it. If the command stops at an interactive question, do not
try `printf 'y\n' |` — either pass the flag that skips the prompt, or use Path B.

### Path B — the REST API

Confirmed against Vercel's REST reference: `POST /v13/deployments` takes `name` (required),
`files` (an array, mutually exclusive with `gitSource`), `projectSettings`, `target`, and
optional `gitMetadata`. Each file entry is `{ file, data }` where `file` is the path relative
to the deployment root. Whether binary files need `"encoding": "base64"` is **unverified** —
the reference snippet I read does not show that field. Every file in `decisions/` is text, so
it does not arise here.

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh

TEAM=team_CDEATPKml1m8SIZSJ0DKdEjG      # see §2 — reconcile against AGENTS.md first
FILES=(index.html app.css app.js diagram.js questions.js fonts.css)

node - "$TEAM" "${FILES[@]}" <<'JS' > "$TMPDIR/decisions-body.json"
const fs = require('node:fs');
const [, , team, ...names] = process.argv;
process.stdout.write(JSON.stringify({
  name: 'frontmatter-decisions',
  target: 'production',
  projectSettings: { framework: null, buildCommand: null, outputDirectory: null },
  files: names.map((n) => ({ file: n, data: fs.readFileSync('decisions/' + n, 'utf8') })),
}));
JS

curl -sS -X POST "https://api.vercel.com/v13/deployments?teamId=$TEAM" \
  -H "Authorization: Bearer $VERCEL_TOKEN_ZEPHYRUS" \
  -H "Content-Type: application/json" \
  --data-binary "@$TMPDIR/decisions-body.json" \
  -o "$TMPDIR/decisions-resp.json" -w '%{http_code}\n'

rm -f "$TMPDIR/decisions-body.json"
```

The six source files total 2,106,070 bytes (`ls -l`), dominated by `questions.js` (1.7 MB) and `fonts.css` (271 KB); JSON-escaped, the request body is larger still. If the API
rejects it for size, that is the point at which Path A stops being optional.

Read the response for the deployment url and id, never for the token:

```bash
node -e "const r=require(process.env.TMPDIR+'/decisions-resp.json');console.log(r.id,r.url,r.readyState)"
```

### Then verify — with `-sI`

```bash
curl -sSI https://frontmatter-decisions-sagnik.vercel.app/ | head -1
```

## 5. What deploying does not do

Shipping the app does not make a new asset reachable. `src/proxy.ts` gates page navigations
behind a session cookie and only allowlists top-level, single-segment static paths:

```
PUBLIC_STATIC_RE = /^\/[a-z0-9._-]+\.(svg|png|jpg|jpeg|gif|ico|webp|avif|webmanifest|xml|txt|json|js|map)$/i
```

`AGENTS.md` §1 spells out the recurring failure: an agent drops an asset into `public/`,
forgets the proxy, and the auth redirect 307s the URL to `/login`. **This is live right now**
for the two directories under `public/`. Measured against production on 2026-09-09:

```
/decisions/            308
/decisions/index.html  307   → location: /login
/decisions/app.js      307
/prototype/            308
/prototype/index.html  307   → location: /login
/favicon.png           200
/markdown-bitmap.svg   200
/theme-init.js         200
```

The single-segment assets are fine; anything one directory deep is not, because
`PUBLIC_STATIC_RE` cannot match a path containing a second `/`, and `isPublicSlugPath()`
matches exactly one segment. Fixing it means an explicit `isPublicPath()` clause for
`/decisions/` and `/prototype/`, in the same commit as any matcher change — `AGENTS.md` §1
requires `PUBLIC_STATIC_RE` and the `config.matcher` regex to be edited together, never one
alone. Full symptom-to-cause writeup in `docs/29-RUNBOOK.md` §2.

## 6. Verifying a deployed URL

**Use `curl -sSI`. Never `curl -sL`.** A login page returns 200 after a redirect, so `-L`
turns a broken asset into a green check. Demonstrated on this repo's own production host:

```
$ curl -sSI https://frontmatter.in/prototype/index.html | grep -iE '^HTTP|^location'
HTTP/2 307
location: /login

$ curl -sSL -o /dev/null -w 'final=%{http_code} url=%{url_effective}\n' \
    https://frontmatter.in/prototype/index.html
final=200 url=https://frontmatter.in/login
```

Same URL. One command says broken, the other says fine. The second one is lying to you by
following the redirect and reporting the status of a different page.

The rule, for any check anywhere: **assert on the first status line and, when it is a 3xx,
on the `location` header.** If you must follow redirects, print `%{url_effective}` and assert
on that too.

## 7. Rollback

Rollback is a RULE 2 destructive operation on shared state: name it, state the blast radius,
ask, wait for an explicit yes, then verify the post-state. Nothing below was run.

**Preferred — promote a known-good deployment.** This changes only the alias; it does not
rewrite git history and it does not rebuild.

```bash
source /Users/sagnikmitra/.config/codex-env/tokens.zsh
vercel ls frontmatter --scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"          # find the id
vercel promote <deployment-url-or-id> --scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"
```

`vercel rollback` also exists and targets the previous production deployment. Both are
**unverified** against CLI 50.13.2 here; check `vercel promote --help` first.

Then, immediately:

```bash
curl -sSI https://frontmatter.in/ | head -1        # expect HTTP/2 200
curl -sSI https://www.frontmatter.in/ | grep -i location   # expect the apex
```

**Do not roll back by reverting on `main` unless you also intend the code change.** A revert
commit is a new deploy: it goes through the ignored-build step, rebuilds, and takes as long as
a normal deploy. Promotion is seconds and is reversible by promoting the other way.

**A caution about the ignored-build step during a rollback.** The script builds
unconditionally when `VERCEL_GIT_PREVIOUS_SHA` is unresolvable, and a fresh promote is
listed in its own comments as one of the cases that produces an empty previous sha. So a
promote followed by a push can rebuild more than you expect. That is the safe direction of
the error, but do not read a long build as a sign something went wrong.

**For the decisions site**, rollback is the same promote against project
`frontmatter-decisions`. There is no git history behind that project — the only record of
what was deployed is the Vercel deployment list and the state of `decisions/` in this repo at
the time. That asymmetry is worth closing.

## 8. Commit and authorship discipline

From `AGENTS.md` §7: author commits as `Sagnik Mitra <sagnikmitra123@gmail.com>`, which
matches `AUTHOR` in `src/container/dependency-container.ts` — the identity the app itself uses
for GitHub commits made on a user's behalf. A mismatch there means commits the product makes
are attributed differently from commits the team makes.

And from `AGENTS.md` §0 rule 4: capture `git rev-parse HEAD` before and after any agent run
and reconcile the delta before pushing. At the time of writing, `git log origin/engine/plan-and-diagnostics..HEAD`
shows **6 unpushed commits** on `engine/plan-and-diagnostics`; the branch is not `main` and
nothing on it is deployed.
