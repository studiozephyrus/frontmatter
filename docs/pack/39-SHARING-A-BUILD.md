---
id: 39-SHARING-A-BUILD
title: Sharing a build
mode: how-to
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [preview-deploys, demos, desktop-distribution, auth-traps]
---

# 39. Sharing a build

Getting the product in front of somebody who is not you. **The honest headline first: at `0af3c90`
a stranger cannot sign in, on any surface, by design.** `ALLOWED_GH_LOGIN` defaults to one login
and Firebase's authorised domains do not include a preview URL. **So "share a build" today means
"show a build", and the two are different problems.**

**This file is ordered by how likely each route is to work**, rather than by how impressive it is.

---

## 1. What you can actually share, ranked

Route | Works for a stranger today | Effort | Section
**A published page** at `/<slug>` or `/p/<slug>` | **Yes.** No account needed | None, once a document is published | 2
**The decisions site** | **Yes.** Deliberately public | None | 3
**The public routes** on production: `/`, `/pricing`, `/privacy`, `/terms`, `/refunds` | **Yes**, and they are placeholders | None | 4
**A preview deploy** | **No.** Two separate walls, section 5 | Hours, and it touches shared configuration | 5
**Screenshots or a recording** | Yes | Minutes | 6
**A tunnel to your laptop** | **No.** The dev bypass refuses a tunnel host | Hours, and it is the worst option | 7
**A desktop build** | **No.** It shows a different product, and it is unsigned | Blocked until phase F | 8

**Read that table before planning a demo.** The two routes that work need no engineering, and the
two that look most like "sharing the product" are the two that do not work.

---

## 2. A published page

**The only path by which a stranger reaches real content today.**

Detail | Value
Modern URL | `/<slug>`, one segment, filtered against `RESERVED_SLUGS`
Legacy URL | `/p/<slug>`, **301 redirected by the handler**, kept public so the redirect does not bounce through `/login`
Route | `src/app/(public)/[slug]/page.tsx`
Caching | `revalidate = 60`, `dynamicParams = true`. **Not `force-dynamic`**, which contradicts `revalidate`
What makes a note public | Its front matter `public_slug:` matches
Security headers | A **tight, enforced** content security policy on `/p/:slug*`, in `next.config.ts`

**Two behaviours that look like bugs and are not.**

- **A 404 on a slug you know exists** means either the slug is unknown **or it is claimed by more
  than one note**. On a conflict the page **stays hidden until the owner resolves it**. Refusing is
  the correct outcome.
- **The slug you chose is rejected.** `RESERVED_SLUGS` covers every internal route prefix the app
  owns, including `decisions` and `prototype`, so a note cannot shadow them.

**Why the content security policy is tighter here than in the editor.** A published page shows
untrusted, attacker-authored content to anonymous visitors, and there is no editor on it, so it
needs no `unsafe-eval`. The authed editor stays report-only, because it is a single trusted tenant.
**Do not relax the published-page policy to make a demo look better.**

---

## 3. The decisions site

**Live at `frontmatter-decisions-sagnik.vercel.app`, deliberately public, and the single best thing
to send somebody who wants to understand the product rather than use it.**

- It needs no account and no build step.
- `decisions/tools/deploy.mjs` actively **turns deployment protection off** for that project,
  because protection defaults on for a new Vercel project.
- A copy is served from `public/decisions/` by the app, so `frontmatter.in/decisions/` works too.

**Check it with `curl -sI`, never `curl -sL`.** A protected deployment returns 200 after
redirecting to a login page, so `-L` reports health that is not there. `32-DEPLOYMENT-AND-OPS.md`
section 3.2 carries the rule.

**If you mirror into `public/decisions/`, run the `rsync` step**, or the app's copy and the live
site disagree and nothing warns you.

---

## 4. The public routes on production

**From `isPublicPath()` at `src/proxy.ts:59`**, these work signed out:

Path | What a stranger sees
`/` | **The login screen.** The home page *is* the sign-in surface when signed out, by design
`/login` | The same
`/pricing`, `/privacy`, `/terms`, `/refunds` | **Placeholder pages.** The real texts are pending and due by 15 October 2026
`/<slug>`, `/p/<slug>` | A published page, section 2
`/decisions`, `/decisions/*` | Section 3
`/prototype`, `/prototype/*` | Static prototype pages served out of `public/`
`/opengraph-image`, `/opengraph-image.*` | For crawlers and image consumers

**Two things to know before pointing anybody at them.**

- **The legal pages say the text is pending.** That is deliberate and recorded in the plan. **Do not
  send a prospective customer to `/terms` and hope they do not read it.**
- **`/` is public in the proxy on purpose**, so `(vault)/layout.tsx` owns the auth decision rather
  than the proxy 307-ing to `/login` first. A stranger therefore lands on a clean sign-in rather
  than a redirect chain, which is the Google Docs feel the founders asked for.

---

## 5. A preview deploy, and the two walls

**A Vercel preview builds fine. Then a stranger cannot get in, for two independent reasons, and
fixing one does not fix the other.**

### 5.1 Wall one: Firebase authorised domains

**Google sign-in fails on a preview URL, and it is configuration rather than an outage.**

`firebase.json` lists six authorised domains: `localhost`,
`frontmatter-md.firebaseapp.com`, `frontmatter-md.web.app`, `frontmatter.in`, `www.frontmatter.in`,
`frontmatter.vercel.app`. **A per-deploy preview URL is not among them and cannot be, because it
changes on every deploy.**

**Two ways round it, and both have a cost:**

Option | Cost
Add the **stable** preview alias for a branch to the authorised domains | It is a change to a shared Firebase project, and every added domain widens where a sign-in can be initiated
Give the demo a real subdomain of `frontmatter.in` and authorise that | A DNS change on a zone that sits on a personal Cloudflare account. **Cleaner, and it is the one to prefer**

**Do not add a wildcard.** The authorised-domain list is a security control, not a convenience list.

### 5.2 Wall two: the allowlist

**Even with a working callback, a stranger is rejected.** `ALLOWED_GH_LOGIN` defaults to
`sagnikmitra` (`src/config/env.ts:47`), and `isAllowed()` runs inside the `signIn` callback.

**The rejection is clean and gives no error**, which means a person you invited will report "it just
sent me back to the login page" and you will look at OAuth configuration for an hour.

**Adding somebody means changing the variable for that environment**, which is an account-settings
change, not a code change.

### 5.3 The third thing, which is not a wall but is a trap

**`NEXT_PUBLIC_SITE_URL` falls back to `https://frontmatter.in`** at `src/app/robots.ts:3`,
`src/app/sitemap.ts:3`, `src/app/layout.tsx:21` and `src/container/dependency-container.ts:134`.

**So a share link created on a preview points at production, where the document does not exist.**
The result is a 404 that looks like a data bug. **Set it per preview, or expect that.**

### 5.4 Deployment protection

**Protection defaults on for a new Vercel project.** If a preview asks a stranger to log in to
Vercel, that is why, and no amount of application configuration fixes it.

**Checked from outside on 2026-09-18 `[O]`:** an anonymous request to the branch alias
`https://frontmatter-git-audit-response-2026-09-17-zsco.vercel.app/` returns `HTTP/2 200` with the
app's own `<title>frontmatter</title>`, and no Vercel login redirect. So previews on this project are
not behind protection today. The dashboard setting itself was not read. **Re-run that request before
promising somebody a link**, because a dashboard change would flip it.

### 5.5 So, the honest recipe

**If you must do a preview demo, in order:**

1. Give it a **stable** hostname, ideally a subdomain of `frontmatter.in`.
2. Add that hostname to Firebase's authorised domains.
3. Add the callback `https://<host>/api/auth/callback/github` to the GitHub OAuth App.
4. Set `NEXT_PUBLIC_SITE_URL` to that hostname for the preview environment.
5. Add the guest's GitHub login to `ALLOWED_GH_LOGIN`.
6. Confirm deployment protection is off for that deployment.
7. **Test the whole path yourself, signed out, in a private window.** Not signed in, not on your
   own machine.

**Step 7 is the one that catches all of the above**, and it is the one people skip because the
build is green.

**Then undo steps 2, 3 and 5 afterwards.** A demo guest left on a production allowlist is an access
grant nobody remembers making.

---

## 6. Screenshots and recordings, which are usually the right answer

**For most "can I see it?" requests, this is the correct route and not a lesser one.** It needs no
shared credential, no configuration change and no cleanup.

**Four rules, because a screenshot is a claim about the product.**

1. **Show the real build, not a mock**, and say which commit it is from.
2. **No real document content** unless it is yours.
3. **State what is not built.** A screen the pack marks `specified, not built` must not be shown as
   though it works. `34-INTEGRATIONS.md` section 1 is the list.
4. **If it is a recording, cut nothing that hides a failure.** A demo that edits out a refusal is
   showing a different product, and **refusing well is the differentiation.**

**The screens set** is `docs/mvp0/SCREENS.md`, 38 screens generated from the plan. **That is a
better artefact to send than a screenshot of a half-built page**, and it is honest about being a
specification.

---

## 7. A tunnel to your laptop

**Do not.** Three reasons, and the first is mechanical rather than a preference.

**The dev bypass refuses a tunnel host.** `isLocalDevBypass()` at `src/proxy.ts:33` requires the
request host to be `localhost`, `127.0.0.1`, `::1`, `192.168.`, `10.` or `172.16.` to `172.31.`. **A
tunnel hostname is none of those, so `DEV_BYPASS_AUTH=1` does nothing over a tunnel.** That guard is
correct and must not be widened.

**So you are back to real sign-in**, which means walls one and two from section 5, plus `AUTH_URL`
pointing at the tunnel, plus a callback registered for a hostname that changes when the tunnel
restarts.

**And you are serving your own machine, with your own `.env.local` and your own repository token, to
the public internet.** **That is the actual objection.** The first two are inconvenience; this one
is a security decision that nobody made deliberately.

---

## 8. The desktop build

**It cannot be shared today, for two independent reasons.**

**Reason one: it shows a different product.** `src-tauri/tauri.conf.json` sets `devUrl` and
`frontendDist` to `https://md.sgnk.ai`, with empty `beforeDevCommand` and `beforeBuildCommand`. **A
build from this tree opens a remote site that is not this app.** `31-LOCAL-SETUP.md` section 5 has
the detail; the phase F rebuild is where it changes.

**Reason two: it is unsigned.** `signingIdentity`, `providerShortName` and `entitlements` are all
`null`, and the Apple Developer Program is recorded as "not opened"
(`docs/mvp0/PRODUCT-PLAN.md` section 24).

**So a `.dmg` built today triggers a Gatekeeper warning.**

> **Do not send somebody an unsigned build and tell them how to click past the warning.** It teaches
> a person to override a security control, which is a worse outcome than not shipping. **Send the
> web app, a published page, or screenshots instead.**

**When it does ship**, per the plan: macOS signed on the Apple programme at 99 USD a year, Linux
unsigned by choice, **Windows shown as coming** until a commercial certificate is priced, because
Azure Artifact Signing's public trust is closed to organisations in India. **Each target builds on
its own runner**, because Tauri calls cross-compiling Windows from macOS "a last resort".

---

## 9. What to do before any demo, whatever the route

**Six checks. They take about five minutes and each has caught a real failure.**

Check | Command or action | Pass
The URL is actually reachable, not redirecting | `curl -sI <url> \| head -1` | A 200. **Never `-sL`**
Every asset loads | Open it signed out in a private window | No broken image, no failed manifest. A 307 on an asset means the proxy caught it. `33-RUNBOOK.md` section 3
Sign-in works **for the guest**, not for you | A private window, the guest's account if you have one | They reach the app
Share links point at the right host | Create one, read it | The host matches the demo, not production
Nothing shown is `specified, not built` | `34-INTEGRATIONS.md` section 1 | You can name what is real
Access is removed afterwards | The allowlist, the authorised domains, the callback | Nobody keeps a grant they were given for an hour

**The one that gets skipped is the last one.** A demo grant that is never removed is how a
temporary allowlist becomes permanent, and nobody audits it because nobody remembers it exists.

---

## 10. Limits of this file

**What was not assessed.**

- **No sharing route was exercised.** Nothing here was tested against a live preview, a live
  published page or a real guest in the session that wrote it. Every claim comes from
  `src/proxy.ts`, `firebase.json`, `next.config.ts`, `src-tauri/tauri.conf.json`, `src/config/env.ts`
  and the plan.
- Vercel preview alias behaviour and whether a branch gets a stable hostname on this project.
- Whether the published-page route currently has any published page to point at.

**What could not be verified.**

- Deployment protection, checked from outside only (section 5.4): a branch preview answered an
  anonymous request with 200 on 2026-09-18. The dashboard value was not read.
- `UNVERIFIED:` the GitHub OAuth App's registered callback list. Needs: the OAuth App's settings
  page on GitHub, which needs the owner's sign-in.
- The legal placeholder pages, checked `[O]` on 2026-09-18. On the branch preview `/privacy` returns
  200 and reads `This text is being written and is due by 15 October 2026`, from
  `src/app/(public)/pending-legal-page.tsx`. **On production, `https://frontmatter.in/privacy`
  returns 307 to `/login`**. `INFERENCE:` the cause is that `origin/main` as last fetched (`8eb4de2`)
  has neither the page (`src/app/(public)/privacy/page.tsx` is absent there) nor `"/privacy"` in
  `src/proxy.ts`, while this branch has both, the proxy entry at `src/proxy.ts:69`.
  A stranger on production cannot read the privacy notice until this branch merges.

**What is not established.**

- Whether a demo should use a subdomain of `frontmatter.in` or a preview alias. Section 5.5 prefers
  the subdomain, and that touches a zone on a personal Cloudflare account, which `38-INCIDENT-AND-SEVERITY.md`
  section 2 names as a single point of failure.
- Whether the allowlist should stay a single login through the pilot. It is the wall that makes
  every demo hard, and it is also the cheapest abuse control the product has.

**What would falsify this file.**

- A stranger signing in successfully on a preview without steps 1 to 6 of section 5.5, which would
  mean one of the two walls has been removed and nobody wrote it down.
- `npm run tauri:build` producing a bundle that opens this app rather than `md.sgnk.ai`, which would
  mean section 8's first reason has been fixed.
- An unsigned build reaching somebody outside the studio, which would mean the rule in section 8 was
  treated as advice.
