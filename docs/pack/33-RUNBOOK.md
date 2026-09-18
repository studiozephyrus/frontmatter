---
id: 33-RUNBOOK
title: Runbook
mode: how-to
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [operations, troubleshooting, symptoms, known-failures]
---

# 33. Runbook

Symptom to cause. **Every entry here happened at least once.** Nothing is invented, nothing is a
hypothetical, and each row names where the evidence lives: a comment in the code that records the
failure it fixes, a rule in `AGENTS.md` or `CLAUDE.md` that exists because of an incident, or a
check in a tool.

**How to use it.** Find the symptom. Read the **first reading** column before the **actual cause**
column, because the entries in this file were chosen for the gap between the two. The expensive
failures here are not the hard ones; they are the ones whose obvious explanation is wrong.

---

## 1. The ones whose first reading misleads

**These cost the most, every time. Read this section before you start debugging anything.**

Symptom | What it looks like | What it almost always is | Evidence
`Repository not found` on `git push` or `gh repo clone` | The repository was deleted, or you lost access | **The token file was not sourced.** macOS keychain answered with the personal account, which gets a 404 rather than a 403 on a private repository it cannot see | `AGENTS.md` section 6b: "almost always means you forgot to source it"
A push produces **no Vercel deployment at all** | The git integration stopped firing; check the project's link settings | **`vercel.json` is invalid.** Vercel's router rejects it and the webhook records nothing: no failed build, no dashboard entry. The command-line deploy names the error in about a second | `CLAUDE.md`, and section 2.2 of `32-DEPLOYMENT-AND-OPS.md`
A deployed URL returns `200 OK` but shows a login page | The page is fine | **You used `curl -sL`.** It followed the redirect to the login page, which is itself a 200. **Use `curl -sI`** | `CLAUDE.md`; `decisions/tools/deploy.mjs:59` carries the same note beside the protection check
A Vercel entry is green but nothing changed | The build silently failed | **The ignored-build step skipped it**, correctly, because only unwatched paths changed. The log says `[ignore] no watched-path changes` | `scripts/vercel-ignore-build.sh`
Local sign-in sends you to production and never comes back | The OAuth app is misconfigured | **`AUTH_URL` still holds the production origin** after `vercel env pull`. Nothing errors | `AGENTS.md` section 6
An AI call returns a 502 | The provider is down | **No provider key is set**, so the chain fell through to the Vercel AI Gateway, which is credit gated and 502s on the free tier | `src/modules/ai/infrastructure/gateway-client.ts:22`
A provider you configured is not in the chain | The key is wrong | **Another AI variable is malformed.** `parseAiEnv` returns `{}` on any parse failure rather than throwing, so one typo disables all eleven | `src/config/env.ts:150`
The battery or the test suite says something broke, and the thing is demonstrably fine | A regression | **Check the harness before the system.** A false failure trains people to ignore the harness, which is the same disease as a false pass | `AGENTS.md` section 0, rule 1

---

## 2. Getting in and out of the repository

Symptom | Cause | Fix
`Repository not found` | Token not sourced. See section 1 | `source /Users/sagnikmitra/.config/codex-env/tokens.zsh && git push`
Every repository on the machine suddenly authenticates as the wrong user | Somebody ran `gh auth login` or `gh auth setup-git` with `GH_TOKEN_ZEPHYRUS` | Re-authenticate `gh` with the personal identity. **Then never do it again**: pass the token per command. `AGENTS.md` section 6b
A Vercel command says the project does not exist | Wrong token or missing scope | The app needs `VERCEL_TOKEN_ZEPHYRUS` **and** `--scope zsco`. The decisions site needs the bare `VERCEL_TOKEN`. See `32-DEPLOYMENT-AND-OPS.md` section 1
A commit contains files you never touched | `git commit` commits the **index**, not the paths you just added. A stale index from an earlier session carried them | `git reset --mixed <upstream>` resets the index only. **Never `git stash` somebody else's work.** Prove it with `git show --name-only HEAD \| grep -vcE '<your paths>'`, which must print `0`
You built on a branch that is a hundred commits behind, and collided with work already live | No `git fetch` before starting | `git fetch` and compare `origin/main` to `HEAD` **before** choosing a version number, a path or a directory name
An agent committed despite being told not to | The prohibition in a prompt is advisory, not a control | Capture `git rev-parse HEAD` before and after every agent run and reconcile the delta. `AGENTS.md` rule 4

---

## 3. Local development

Symptom | Cause | Fix
A new file in `public/` 307s to `/login` | Its extension is not one of the fourteen in `PUBLIC_STATIC_RE`, or its path has more than one segment | Check `src/proxy.ts:15`. Nested directories are named explicitly in `isPublicPath()`. **Verify with `curl -s -o /dev/null -w "%{http_code}"`; 200 is correct, 307 is not**
`/decisions/app.css` redirects to the login page | Same class. `.css` is not in the list and the path is nested | Already fixed: `/decisions` and `/decisions/` are named in `isPublicPath()`. The comment at `src/proxy.ts:85` records the incident
The middleware stops running on a path that should be gated | `PUBLIC_STATIC_RE` and the `matcher` in `config` drifted apart | They mirror each other. **Edit both in the same commit**, `src/proxy.ts:15` and `:153`
`npm run typecheck` passes, the Vercel build fails on types | Production `tsconfig.json` adds `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` | Declare optional props that can be `undefined` as `?: T \| undefined`. **Run `npm run verify`, which includes `next build`, not `typecheck` alone**
The test suite is much bigger than expected and runs duplicates | Abandoned agent worktrees under `.claude/` were being collected | Already fixed by the `exclude` in `vitest.config.ts`. The comment records the size: the suite was inflated by 66.4 percent
A mock stops applying after a refactor | The test mocks the **deep** path, not the barrel | Keep the indirection module. The suite mocks `@/modules/vault/presentation/use-snapshot`
An infinite render loop after touching a selector | A Zustand selector returned a new object, array or `Set`. Zustand v5 compares by `Object.is` | Derive sets in `useMemo` during render. `AGENTS.md` section 9
`npm run tauri:dev` shows a product that is not this one | `devUrl` and `frontendDist` in `src-tauri/tauri.conf.json` both point at `https://md.sgnk.ai` | That is the shipped state. See `31-LOCAL-SETUP.md` section 5
PDF export cannot find a browser locally | `LOCAL_CHROME_PATH` is unset | Export it. `src/app/api/export/pdf/[...path]/route.ts:128`

---

## 4. The editor, where the bugs are quiet

**Every entry in this section is a case where the wrong behaviour produced no error.** That is why
each one has a guard in the code with a comment explaining it.

Symptom | Cause | The guard that exists
An edit made from outside the editor pane (the properties panel, an AI apply, a history restore) is silently reverted, and the reverted text is persisted as the draft | The live document never learned about the write, so the next keystroke pushed the stale document back into the store | The store subscriber at `src/modules/editor/presentation/CodeMirrorEditor.tsx:294`. **Do not remove it.** It diffs the common prefix and suffix rather than replacing the document, because a full replace collapses the cursor even when the user is typing somewhere untouched
Content from tab A appears under tab B after a fast switch | A stale closure: the fetch resolved for path A while the component already had path B | `toResult` in `src/modules/editor/presentation/use-note-content.ts:28` records the path each state was loaded for, and reports `loading` when it does not match the current path. `AGENTS.md` section 9 names it the editor tab race
Every unsaved draft disappears | The dirty index in `localStorage` held corrupt JSON, and returning `[]` made callers believe nothing was dirty | `src/modules/drafts/infrastructure/draft-store.ts:63` wipes the bad value and schedules a background scan to rebuild the index from the real drafts
A user on a shared machine is signed in as somebody else's Google account | Without a chooser, Google silently uses whichever account the browser last used | `provider.setCustomParameters({ prompt: "select_account" })` at `src/modules/auth/infrastructure/firebase-auth-gateway.ts:35`
A note's bytes change on save without the user editing anything | A lossy `TextDecoder` turned an invalid byte into `U+FFFD`, and that mojibake got committed | `decodeStrict` at `src/modules/vault/application/get-snapshot.ts:170`. **It refuses.** The file stays untouched on disk and simply cannot appear in that snapshot
A properties-panel edit rewrites bytes the user authored | The panel used to serialise from the parsed document rather than splicing | `src/modules/preview/presentation/PropertiesPanel.tsx:80`. A refusal reaches `emit` as an unchanged string and is dropped, which is the intended outcome
A public page is not cached and regenerates on every request | `force-dynamic` and `revalidate` were both set, and they contradict | `force-dynamic` was dropped. `src/app/(public)/[slug]/page.tsx:16` records it. **Pick one**

---

## 5. Deployment

Symptom | Cause | Fix
No deployment from a push | Invalid `vercel.json`. See section 1 | `npx vercel --prod --scope zsco --token "$VERCEL_TOKEN_ZEPHYRUS"` and read the error
A header rule is rejected | An optional path segment written `/?` rather than `/(index.html)?` | Vercel names the failing index: `Header at index N has invalid source pattern`
The PDF function fails at runtime with a path that does not exist | The chromium brotli pack was not traced into the lambda. A narrow `bin/**` glob did not land it | Fixed in `next.config.ts`: `serverExternalPackages` plus `outputFileTracingIncludes` over the **whole** package under a glob route key. **Do not narrow either**
PDF export times out or runs out of memory in production | The defaults are too small for headless Chromium | `vercel.json` gives the route `1769` MB and `60` s. **Prove any change by rendering a PDF on a deploy**
A newly added file in `decisions/` 404s in production but works locally | `deploy.mjs` ships a **fixed list**, not a directory | Add it to `SHIP` at `decisions/tools/deploy.mjs:17` in the same change
The decisions site paints slowly and re-fetches everything on each visit | `vercel.json` was not among the shipped files, so every asset returned `max-age=0, must-revalidate`: six round trips before paint | Already fixed. The comment at `decisions/tools/deploy.mjs:11` records it. **Keep `vercel.json` in `SHIP`**
A card in the decisions site links to a page that does not exist | `mockups-data.js` was omitted. It is loaded by **both** `index.html` and `mockups.html` | Both files ship. `decisions/tools/deploy.mjs:18`
The decisions site is installable-looking but is really a bookmark | One of `manifest.webmanifest`, `sw.js` or the icons was omitted | All three groups ship together. `decisions/tools/deploy.mjs:21`
The live decisions site and the copy at `/decisions/` disagree | The `rsync` mirror step was skipped | Run step 4 of `32-DEPLOYMENT-AND-OPS.md` section 3
A deployed page is behind a login you did not configure | Deployment protection defaults **on** for a new Vercel project | `decisions/tools/deploy.mjs:62` patches `ssoProtection` to `null` for the decisions site. For the app, check the dashboard

---

## 6. Content, documents and the decisions site

Symptom | Cause | Fix
`questions.js` edits vanish | It is **generated**. `decisions/README.md` and `CLAUDE.md` both say so | Edit `decisions/v2/*.json`, validate, rebuild
60 duplicate cards reappear after a rebuild | `--links` was omitted from `build-v2.py` | It is required: `--links decisions/v2/_links.json`
An area deep link falls through to the overview | `fromHash()` and `go()` disagreed about the routes they know | **Both must know any new route.** `decisions/README.md` records the incident
A new button does nothing, with a handler that is clearly correct | Click handling is delegated through one `closest()` selector list. Adding an id and its branch is not enough | **The id must also go in that selector list** near the bottom of `app.js`. This cost a debugging round on the restore control
A control shipped invisible with every handler working | A colour's only definition lived inside a media or `[data-theme]` block, and a later base rule overrode it at equal specificity | `python3 scripts/css-cascade-check.py decisions/app.css` must print `clean`. It was the phone action bar
A citation in a document points at a line that says something else | The citation was written from memory | **Check with `sed -n 'NNNp' <file>` before writing it.** `decisions/tools/validate.py` checks mechanically
A quotation in a document is a paraphrase in quotation marks | A research pass on 2026-09-09 fabricated quotes from VS Code's documentation while getting the facts right. Roughly one quotation in three across that run | **Re-fetch the page and match the string** before any quote enters a document, a slide or a card

---

## 7. PDF and print output

`python3 docs/mvp0/tools/check-pdf.py <file>.pdf` measures what a reader sees rather than what the
markdown says. **It exits 1 on a bleed or a broken table.** A sparse final page is normal.

What it reports | What a failure means | What to do
`trailer MISSING` | The file does not end in `%%EOF`. **The PDF is incomplete**, whatever its size | Re-render. A size check alone would have passed this
`pages with ink past a margin` | Ink outside 15 mm at the sides and top, or 14 mm at the bottom, with 1.2 mm of slack | An image too wide, an overflowing table, or a code block that will not wrap
`nearly empty pages` | Under 1.2 percent ink coverage | A page break fell somewhere wasteful. Normal on the last page
`headings stranded at the foot of a page` | A `PART`, a section marker or a screen heading is the last line on its page | Adjust the break. It reads as a heading with nothing under it
`tables: N, broken M` | A table rendered with no body rows, or rows whose cell count does not match the header | Usually a malformed source row. Read the printed fragment

**The general lesson from this tool, which applies far beyond PDFs.** It checks the **artefact**,
not the process that made it. An exit code reports the runner's state; a trailer reports the
deliverable's. **When a tool's job is to produce a file, verify the file.**

---

## 8. Model providers and the free chain

Symptom | Cause | What to check
Every AI call 502s | No provider key set, so the Gateway is serving | `configuredAiProviders()` at `src/config/env.ts:164` returns the **names** of set keys and never a value. It is safe to log
One provider silently absent from the chain | A malformed value elsewhere in the AI schema emptied it. See section 1 | Same helper
Ghost text is slow or stalls | A cold provider | Already handled: `speedFirst` hedges two providers under a 6 s timeout; quality calls use one provider under 15 s. `src/modules/ai/infrastructure/gateway-client.ts:96`
A free pool is exhausted and everybody is affected, not one account | **Every provider meters at the organisation level.** Groq says so explicitly | The research names this: one abuser drains the pool for all. The defence is a per-account budget plus a service-wide hourly breaker, `docs/research/2026-09-18-llm/raw/L2-abuse-guardrails.md` FL2-31
A usage number looks wrong in a report | A producer wrote one field name and a consumer read another | **Pin field names in one place**, and treat a missing key as unknown rather than coercing it to a falsy default. The same research file names this as a known-expensive class

**Status of the guardrails.** `INFERENCE:` none of the five phase A layers in FL2-31 exist in the
code at `0af3c90`. There is no per-account budget, no service-wide breaker, no usage row per call
and no history-based starting allowance. **So the current answer to "a free user is burning the
pool" is to remove the provider key, and nothing finer.**

---

## 9. When an entry does not appear here

**Two rules, and they are the point of this file.**

1. **A symptom whose cause you guessed is not an entry.** Add it only once you have seen the cause.
   A runbook full of plausible entries is worse than a short one, because it spends a reader's
   trust on guesses.
2. **When you find a new one, write the guard and the entry together.** Every row in sections 3 to
   6 has a comment in the code beside its fix. That is what makes the fix survive the next
   refactor, and it is why this file could be written at all.

**For a genuinely new failure**, `38-INCIDENT-AND-SEVERITY.md` carries the severity ladder and who
is called. **For anything destructive**, name the operation, state the blast radius, say what you
checked, ask, and wait for an explicit yes. Speed is not a reason to skip that, and an incident is
exactly when people think it is.

---

## 10. Limits of this file

**What was not assessed.**

- **Production behaviour.** Nothing here was reproduced against a live deployment in the session
  that wrote it. The entries come from guards in the code, from `AGENTS.md`, from `CLAUDE.md`, from
  `decisions/README.md` and from `docs/mvp0/tools/check-pdf.py`.
- Firestore, Cloudflare R2, Razorpay and the GitHub App at runtime. **None of the four is wired at
  `0af3c90`**, so there are no observed failures to record. `34-INTEGRATIONS.md` says what each
  will need.
- Alerting. There is none. No Sentry project is wired in the code, so **every entry here is found
  by a person noticing**.

**What could not be verified.**

- `UNVERIFIED:` the exact wording of the Vercel error for an invalid `vercel.json`. The phrasing in
  section 5 is the shape of the message, taken from the repository's own record, not re-fetched.
  Checked 2026-09-18 `[O]`: the string is not in the installed CLI 50.13.2 bundle, so Vercel's
  server writes it. Needs: a CLI deploy of a deliberately invalid config to a scratch project.
- The 66.4 percent figure in section 3 is historical, not current. Measured 2026-09-18 `[O]` with
  `find`: `.claude/worktrees` now holds 2 worktrees and 164 test files, against 100 outside `.claude/`.
  So without the exclusion the suite would now more than double by file count. The exclusion at
  `vitest.config.ts:9` matters more than the comment says.
- Whether any entry in section 4 can still reproduce. Each has a guard, and **a guard's presence is
  not proof the guard works.** Making each one fail against the unguarded code is the red proof
  `AGENTS.md` rule 1 asks for, and it was not done here.

**What is not established.**

- Which of these belong in a monitor rather than a runbook. Several, probably. That is a decision
  for `38-INCIDENT-AND-SEVERITY.md` and for whoever wires observability.

**What would falsify this file.**

- An entry in section 1 whose "actual cause" turns out not to be the usual cause, measured over
  real occurrences rather than remembered ones.
- A guard named in section 4 that is no longer at the cited line, which would mean the fix was
  refactored away and the symptom can return.
