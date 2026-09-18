---
id: STORAGE-BENCHMARK-2026-09-18
title: Where documents live, the industry benchmark for D03
status: draft, written progressively
updated: 2026-09-18
owner: sagnik
answers: docs/pack/56-OPEN-DECISIONS.md section 0, D03
---

# Where documents live: the industry benchmark for D03

**The question.** The founder's D03 answer: a person signed in with GitHub keeps documents in GitHub, one signed in with Google keeps them in Drive, and we keep a synced copy for sync and offline.

Two things are open. Do online documents also go to the person's drive, and what happens past about 5 GB?

**How to read this.** Every quoted string was seen in a page fetched with `curl` on 18 September 2026. The URL sits beside it. `UNVERIFIED:` marks what was not opened. `INFERENCE:` marks reasoning, not a source.

**Where the plan stands today.** `docs/pack/21-DATA-MODEL.md` section 21.2 puts every document's bytes in R2, write once, keyed by content hash. The plan's Free tier holds 1 GB of uploads; Pro holds 10 GB (`docs/mvp0/PRODUCT-PLAN.md:240-241`).

---

## 1. How comparable products store documents

### 1.1 The survey

"Canonical" below means the copy the product treats as the truth when two copies disagree.

Product | Canonical copy | What syncs, and through whom | Conflicts | Source, fetched 18 Sep 2026
Obsidian | Local vault files on each device | Paid Sync to Obsidian's servers, or any third-party folder sync | Markdown merged with diff-match-patch by default; other files last-modified-wins; since 1.9.7 a "Create conflict file" option | help source, `obsidian-help` repo, `Troubleshoot Obsidian Sync.md`
Obsidian Git (plugin) | Local vault, pushed to the person's GitHub | git, run by the person | git merge, by the person | plugin README
Logseq (database version) | A local database graph | Its own Sync, "paid", "invite only", "can also be self hosted" | Real-time collaboration protocol | `logseq/docs` `db-version.md`
StackEdit | Browser storage | "Google Drive, Dropbox and GitHub" | "StackEdit takes care of merging the changes" | stackedit.io
Typora | Plain files on disk | None of its own: "you can use any 3rd party sync tools" | None of its own | support.typora.io/Sync
Bear | Apple CloudKit, in the person's iCloud | CloudKit | `UNVERIFIED:` not opened | bear.app/faq/syncing-privacy
Anytype | Encrypted objects on device and "syncing nodes" | Its own nodes, "blind data sync" | `UNVERIFIED:` not opened | doc.anytype.io, data-and-security page
Excalidraw+ | Its own cloud; free scenes "Stored in browser" | Its cloud | `UNVERIFIED:` not opened | plus.excalidraw.com/pricing
Craft | Its own cloud | Its cloud | `UNVERIFIED:` not opened | craft.do/pricing
Notion | Its own database | Its servers; export to "Markdown & CSV" on request | Server-side | notion.com help, export
Google Docs | Google's servers | Offline through a Chrome extension | Server-side | support.google.com/docs/answer/6388102

**Not opened, so not in the table as fact.** `UNVERIFIED:` iA Writer (three ia.net support URLs returned 404 or empty).

`UNVERIFIED:` HackMD (every hackmd.io page returned an empty body to curl). `UNVERIFIED:` Dropbox Paper's status (the help page is a script shell).

### 1.2 The quotes that matter most

- **Obsidian's storage limit, verbatim:** "When you reach your account's storage limit, the Sync plugin will cease syncing files, and you will be prompted to prune your remote vault(s)."

  And: "Version history and attachments are also counted towards your account's storage limit." (wiki-link brackets removed)
- **Obsidian's tiers:** Sync Standard is 1 GB total at 5 MB a file with 1 month of history. Sync Plus is "10 GB to 100 GB" at 200 MB a file with 12 months.
- **Obsidian's price page** (obsidian.md/pricing) lists Sync at "$4 USD Per user, per month, billed annually" and "$5" billed monthly. The app itself is "Free without limits." `UNVERIFIED:` the Sync Plus price, which the static page does not show.
- **Bear on why it avoided file sync:** "We chose CloudKit instead of a file based solution like iCloud, DropBox, or Google Drive because it performs much faster."
- **StackEdit's Drive scope**, from its source, `src/services/providers/helpers/googleHelper.js`: `drive.file` by default, full `drive` only when `token.driveFullAccess` is set, and `drive.appdata` for its own workspace data.
- **Anytype's remote quotas** (anytype.io/pricing): 100 MB, 1 GB, 10 GB and 100 GB of remote storage across its tiers.

### 1.3 What the survey says

1. **Nobody in the survey makes a third party's storage the only copy and edits it live.** Every product holds its own working copy, on the device or on its own servers.

   Sync to someone else's store is a second step.
2. **Two families exist.** Local-first tools (Obsidian, Typora, Logseq) hold files on the device and treat the cloud as transport. Cloud tools (Notion, Craft, Google Docs, Excalidraw+) hold the truth on their own servers and offer export.
3. **The person's own storage appears as a sync target, not a database.** StackEdit and Obsidian Git write to Drive or GitHub, but work from a local copy.
4. **Bear is the one exception that uses the person's cloud as the store**, and it chose Apple's database, not files, for speed.
5. **The 5 GB question has a market answer.** Obsidian stops syncing and asks the person to prune or upgrade, and counts history and attachments against the cap. Anytype and Obsidian both sell tiers from 1 GB to 100 GB.

`INFERENCE:` the founder's model, own storage plus our synced copy, is the StackEdit and Obsidian Git shape.

It is proven for markdown. It is not proven for a product that also needs a queue, history and refusal on a stale base.

---

## 2. Google Drive: what the API lets us do, and what it costs

### 2.1 The three scope classes

Source: https://developers.google.com/workspace/drive/api/guides/api-specific-auth, fetched 18 September 2026.

Scope | Google's class | What it reaches
`drive.file` | Non-sensitive | Files our app created, or files the person opened with us or picked in the Google Picker
`drive.appdata` | Non-sensitive | A hidden per-app folder the person cannot browse
`drive.apps.readonly` | Sensitive | Only the list of apps authorised on the Drive
`drive` | Restricted | "View and manage all your Drive files."
`drive.readonly` | Restricted | "View and download all your Drive files."
`drive.metadata`, `drive.activity` | Restricted | Metadata and the activity record

- Google's own recommendation, verbatim: "Whenever possible, use non-sensitive scopes as they grant per-file access".
- On `drive.file`: "Since drive.file is non-sensitive, it allows for a more streamlined verification process."
- On restricted scopes: "If you store restricted scope data on servers (or transmit), then you must go through a security assessment."
- A note-taking app qualifies for restricted scopes in principle. The page lists "note-taking" under "Productivity and education".

**What this means for us.** `drive.file` is enough to create a `frontmatter` folder in the person's Drive and write every document into it.

It is not enough to open a markdown file the person made elsewhere, unless they pick it in the Picker first.

`INFERENCE:` A person who edits our files in Drive's own UI or on another device keeps them reachable, because the files were created by our app. This is how Google describes `drive.file`, but it was not tested live.

### 2.2 The restricted-scope bill: an annual third-party assessment

Source: https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification, fetched 18 September 2026.

- "Apps accessing restricted data from or through a third-party server must undergo an annual security assessment by a Google-approved third party."
- The framework is the App Defense Alliance's CASA.
- Renewal: "complete a security assessment at least every 12 months after your assessor's Letter of Assessment (LOA) approval date."
- Timeline: "the restricted scopes verification process can potentially take several weeks to complete."
- Brand verification comes first and "typically takes 2-3 business days".

**Our server stores the bytes in R2, so the full `drive` scope triggers CASA every year.**

### 2.3 What CASA costs

- Google's page and the App Defense Alliance pages opened this session state no price. Pages opened: https://appdefensealliance.dev/casa and https://appdefensealliance.dev/casa/tier-2/tier2-overview.
- The ADA FAQ says the "CASA self scanning process is deprecated", so a lab-verified scan is now the route.
- `UNVERIFIED:` the price. Two assessor pages (DEKRA, TAC Security) were fetched and carry no figure in their static HTML. Treat it as a quote to request, not a number to plan with.

**The cost that is certain is time and recurrence.** Several weeks the first time, then every 12 months, for as long as we hold the scope.

### 2.4 Quotas and rate limits

Source: https://developers.google.com/workspace/drive/api/guides/limits, fetched 18 September 2026.

Limit | Value
Per minute per project | 1,000,000 quota units
Per minute per user per project | 325,000 quota units
Daily billing threshold per project | 400,000,000 quota units
Egress per day per project | 1 TB
Units per `files.get` / `files.list` / `files.download` / `files.update` | 5 / 100 / 200 / 50
Error on excess | 403 "User rate limit exceeded", or 429

- The page is new. It opens: "As of May 1, 2026, the usage limits for this API were updated."
- On billing: "Full billing details will be shared later in 2026 with at least 90 days' notice".
- **This is a live risk.** A per-project daily threshold now exists, and the charge past it is not yet published.

**The arithmetic for one save.** One `files.update` costs 50 units. `INFERENCE:` 400,000,000 / 50 = 8,000,000 saves a day before charges, for the whole project.

At 1,000 active people that is 8,000 saves each a day. Autosave every few seconds would need debouncing, but a write on pause fits.

### 2.5 Change notifications, and how sync would be driven

Sources: https://developers.google.com/workspace/drive/api/guides/push and https://developers.google.com/workspace/drive/api/guides/manage-changes, fetched 18 September 2026.

- A watch channel needs a public HTTPS webhook. It expires: "86400 seconds (1 day) after the current time for the files resource and 604800 seconds (1 week) for changes."
- The default, if unset, is 3,600 seconds.
- "Notifications delivered to the address specified when opening a notification channel don't count against your quota limits."
- The changes feed is a cursor: `changes.getStartPageToken`, then page through `changes.list`.

**So Drive sync is a cursor plus a webhook we renew weekly.** A notification says only that something changed; we then read the changes feed and fetch the bytes.

`UNVERIFIED:` whether `files.update` in Drive v3 honours an `If-Match` precondition. The v3 `files.update` reference was fetched and its text carries no `If-Match` or precondition string.

`INFERENCE:` without one, a write to Drive cannot be made conditional on the version we last saw, so a concurrent edit in Drive can be overwritten silently unless we read the revision first and accept a race window.

### 2.6 The hidden app folder, and why it is the wrong home

Source: https://developers.google.com/workspace/drive/api/guides/appdata, fetched 18 September 2026.

- "This folder is only accessible by your app and its contents are hidden".
- "The application data folder is deleted when a user uninstalls your app from their My Drive."
- It "can't be accessed using the Drive user interface (UI)".

**This defeats the founder's purpose.** The person cannot see or open their own documents there, and uninstalling deletes them. It suits settings, not documents.

### 2.7 How much room the person has

Source: https://support.google.com/googleone/answer/9312312, fetched 18 September 2026.

- "Each Google Account includes up to 15 GB of storage, which is shared across Gmail, Google Drive, and Google Photos."
- `INFERENCE:` a person's free Drive is usually partly full of mail and photos. Markdown is small, so the text rarely matters. Uploads are what fill it.

---

## 3. GitHub as storage

### 3.1 Rate limits for a token acting for a person

Sources: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api and https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api, fetched 18 September 2026.

Limit | Value, as GitHub states it
REST, a person's budget | "your personal rate limit of 5,000 requests per hour"
GraphQL, a person's budget | "5,000 points per hour per user"
REST, secondary, per endpoint | "No more than 900 points per minute"
Content creation, secondary | "no more than 80 content-generating requests per minute and no more than 500 content-generating requests per hour"
GitHub App installation token | 5,000 an hour, rising with repos and users, "cannot increase beyond 12,500 requests per hour"

- **The person's budget is shared.** Every app acting for them draws on the same 5,000. An editor that polls greedily starves the person's other tools.
- Secondary limits "are subject to change without notice", and may fire "for undisclosed reasons".

### 3.2 The contents API: size, and it is compare-and-swap

Source: https://docs.github.com/en/rest/repos/contents, fetched 18 September 2026.

- Size: "1 MB or smaller: All features of this endpoint are supported." Between 1 and 100 MB, raw media type only. "Greater than 100 MB: This endpoint is not supported."
- A directory listing caps at 1,000 files.
- **An update must name the blob it replaces.** The `sha` field is "Required if you are updating a file. The blob SHA of the file being replaced." A stale sha returns 409 Conflict.
- Writes must be serial: "the concurrent requests will conflict and you will receive errors. You must use these endpoints serially instead."

`INFERENCE:` the 409 is exactly the refusal our engine wants. GitHub will not let a write land on a version we did not see. Drive, by contrast, offered no such precondition in the pages opened (section 2.5).

### 3.3 Commit per save is the expensive part

Every contents-API write is one commit. Sources for the limits below: https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits and the rate-limit page above, fetched 18 September 2026.

- Push rate: "The recommended maximum limit is 6 pushes per minute per repository."
- Content creation: 500 an hour, per the secondary limit.
- `INFERENCE:` autosave as commit is ruled out. At one commit every ten seconds a person reaches 360 an hour, most of the 500 budget, and fills their history with noise.
- **So GitHub gets a batched commit**, on an explicit save, on close, or on a timer of minutes. Our own copy carries the keystroke-level durability in between.

The plan already caps Free at "1 GitHub repository with 20 pushes a month" (`docs/mvp0/PRODUCT-PLAN.md:240`), which is HackMD's quota by the plan's own record.

### 3.4 Repository size guidance

Source: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github, fetched 18 September 2026.

- "We recommend repositories remain small, ideally less than 1 GB, and less than 5 GB is strongly recommended."
- Files over 50 MiB warn; "GitHub blocks files larger than 100 MiB."
- The repository-limits page recommends an on-disk maximum of 10 GB and at most 3,000 entries in one directory.

**The founder's 5 GB line is GitHub's own line.** Past it, GitHub says it may email "asking you to take corrective action". Git also keeps every past version, so a repository of uploads only grows.

`INFERENCE:` GitHub is a fine home for markdown and a poor one for uploads. Images and PDFs belong in our store, linked from the markdown, not committed.

### 3.5 GitHub App or OAuth App

Source: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps, fetched 18 September 2026.

Property | GitHub App | OAuth App
Permissions | "fine-grained permissions", repository by repository | Broad `repo` scope, "OAuth apps can't use granular permissions"
Token life | Installation tokens "expire after a predefined amount of time (currently 1 hour)" | "long-lived by default", or eight hours if configured
Webhooks | "centralized webhooks" across every installed repo | "must configure webhooks individually for each repository"
GitHub's advice | "In general, GitHub Apps are preferred over OAuth apps." | 

**Use a GitHub App.** The person grants one repository, not all of them, and a push to it reaches us by webhook without polling.

Signing in with GitHub can stay on Firebase Auth; the App install is a second, explicit step.

### 3.6 How existing products use GitHub

- **Obsidian Git** (community plugin). Its README, https://raw.githubusercontent.com/Vinzent03/obsidian-git/master/README.md, fetched 18 September 2026, says of mobile: "The Git implementation on mobile is **very unstable**!" It runs real git on desktop and isomorphic-git on mobile.
- **StackEdit** syncs files with "Google Drive, Dropbox and GitHub" (https://stackedit.io/, fetched 18 September 2026).
- `UNVERIFIED:` HackMD's GitHub sync. Both hackmd.io pages tried returned an empty body to curl. The plan's record of HackMD's 20-push free quota is carried from `docs/mvp0/PRODUCT-PLAN.md:240`, not re-opened.

---

## 4. Our side: R2, and whether we must hold the canonical copy

### 4.1 R2 prices and limits, opened this session

Sources: https://developers.cloudflare.com/r2/pricing/, https://developers.cloudflare.com/r2/platform/limits/ and https://developers.cloudflare.com/r2/reference/consistency/, fetched 18 September 2026.

Item | Value
Standard storage | $0.015 / GB-month
Class A operations (writes, lists) | $4.50 / million requests
Class B operations (reads) | $0.36 / million requests
Egress | "There are no charges for egress bandwidth for any storage class."
Free each month | 10 GB-month, 1 million Class A, 10 million Class B
Object size | 5 TiB per object
Concurrent writes to one key | "1 per second"; faster returns HTTP 429
Consistency | "strongly consistent"; read-after-write sees "the latest object globally"

- The extensions page says `CopyObject` conditions work "akin to the similarly named conditional headers supported on PutObject", failing with "412 PreconditionFailed".
- The one-write-a-second limit does not bite us. Every version key is its content hash (`21-DATA-MODEL.md` section 21.8), so two writers never race on one key with different bytes.

### 4.2 What storage costs us, per person

Rate: the plan's ₹95.96 to the dollar (`docs/mvp0/PRODUCT-PLAN.md:1149`). Working: GB × $0.015, then × 95.96.

Held | USD a month | INR a month
1 GB, the Free cap | 0.015 | 1.44
5 GB, the founder's line | 0.075 | 7.20
10 GB, the Pro cap | 0.15 | 14.39
100 GB | 1.50 | 143.94

SIMULATED: 1,000 people each at a full 1 GB is (1,000 - 10 free) × 0.015 = $14.85 a month. At a full 10 GB each, (10,000 - 10) × 0.015 = $149.85.

**Storage is not what makes 5 GB expensive.** Holding 5 GB costs us ₹7.20 a month against a ₹299 Pro price.

The real costs of a large account are sync traffic, the version history multiplier and the person's patience, not the bucket.

### 4.3 Where the person's drive as the canonical copy breaks our engine

The plan's four load-bearing mechanisms, tested against each canonical choice. `INFERENCE:` throughout; each cell reasons from the API facts in sections 2 and 3.

Mechanism | Our R2 canonical | GitHub canonical | Drive canonical
Change queue: refuse when `baseHash` is not the head | We own the head, so the check is local and exact | Holds: a stale `sha` returns 409 | **Breaks.** No write precondition was found in the v3 reference. An edit in Drive lands between our read and our write
History: content-addressed versions, 7 or 90 days | Every save is a version | Only as fine as our commits. Batched commits lose the saves between | Drive keeps its own revisions. `UNVERIFIED:` their retention and whether we can pin them
Offline | The device holds a copy of our head and reconciles against it | The device reconciles against a remote that moved while away | Same, with no conditional write to catch the move
Splice-only writing | The splice result is the new version | Each push rewrites the whole file through the contents API. Fine, as long as the bytes are our splice result | Same: `files.update` sends the whole body
Refuse rather than guess | Possible at every step | Possible, because of 409 | Possible only after a read, with a race window

**The pattern.** GitHub can be a canonical peer because git and the contents API are compare-and-swap. Drive cannot, on the evidence opened, because nothing stops a write landing on bytes we never saw.

**Three more breaks, whichever drive.**

- **Revoked access.** If the person revokes our app or deletes the folder, a Drive-canonical document vanishes from under the queue. Our copy survives it.
- **Byte exactness.** `UNVERIFIED:` whether Drive preserves a `text/markdown` upload byte for byte, including line endings and a byte-order mark. It was not tested.
- **Latency.** A Drive push notification tells us "something changed", then we read the changes feed and fetch the file. Every open editor waits on that round trip.

### 4.4 The answer to "is our own canonical copy required"

**Yes, for everything the plan sells.** The change queue, per-save history, offline and refusal all need one place where the head is decided.

That place must be one we can compare-and-swap against. R2 plus the Firestore head pointer is that place already, per `21-DATA-MODEL.md`.

**The person's drive can still hold a real, readable, complete copy.** It becomes a mirror we write to, and read back from, with conflicts routed through the change queue. That is the StackEdit and Obsidian Git shape from section 1.

---

## 5. Privacy and compliance, briefly

Sources: the Digital Personal Data Protection Act, 2023, as published in the Gazette, fetched from https://prsindia.org/files/bills_acts/acts_parliament/2023/Digital_Personal_Data_Protection_Act,_2023.pdf. GDPR Articles 17, 20 and 28 from https://gdpr-info.eu/. All fetched 18 September 2026.

### 5.1 What each law says that bears on this

- **DPDP section 8(1):** the Data Fiduciary stays responsible "irrespective of any agreement to the contrary", including for processing "on its behalf by a Data Processor".
- **DPDP section 8(5):** it must protect data "in its possession or under its control" by "reasonable security safeguards to prevent personal data breach".
- **DPDP section 8(7)(b):** it must "cause its Data Processor to erase any personal data" made available to it.
- **DPDP section 16(1):** the Government "may, by notification, restrict the transfer" of personal data to a country outside India.
- **GDPR Article 28(1):** a controller uses "only processors providing sufficient guarantees".
- **GDPR Article 20:** a person may receive their data "in a structured, commonly used and machine-readable format".

### 5.2 The consequence for each model

Model | Our exposure | What it buys the person
We hold the canonical copy in R2 | We are the Data Fiduciary for every byte. Breach notice, erasure through Cloudflare, and the R2 location hint question from `21-DATA-MODEL.md` section 21.8 | One place to export from; markdown already satisfies Article 20's "machine-readable"
Their drive is canonical, we cache | Still a fiduciary for the cache. Holding restricted Drive data on our server also triggers CASA yearly (section 2.2) | The main copy sits in an account they control
Their drive is a mirror of our canonical | Same as the first row, plus a scoped token in `users/{uid}/connections` | A copy they can open without us, which survives our shutdown

`INFERENCE:` mirroring to the person's drive does not reduce our legal exposure. We still hold the bytes. What it reduces is lock-in and the shutdown risk, which is a trust argument, not a compliance one.

`INFERENCE:` holding the bytes and not mirroring is no worse legally than mirroring. The compliance rows in `54-COMPLIANCE-AND-LEGAL.md` section 2.2 fire the moment we store a document, which D03 already accepts.

`UNVERIFIED:` the DPDP Rules, 2025, and any notified transfer restriction under section 16. Neither was opened this session.

---

## 6. Recommendation

### 6.1 The architecture, in one line

**Our copy is canonical. The person's GitHub or Drive holds a complete, readable mirror of their markdown, written by us and read back through the change queue.**

### 6.2 What lives where

Layer | Holds | Canonical?
R2, keyed by content hash | Every version of every document, and every upload | **Yes, for bytes**
Firestore `docs/{docId}` | The head pointer, `headHash`, and the queue | **Yes, for which version is current**
Device (IndexedDB, or disk in Tauri) | The working copy and unsynced edits | No. Reconciled against the head on reconnect
The person's GitHub repository | The markdown files, one commit per batch | No. A mirror, and an inbound source of edits
The person's Drive folder | The markdown files, in a visible `frontmatter` folder | No. A mirror, and an inbound source of edits

### 6.3 How each mirror is wired

**GitHub.**

- A GitHub App, installed on one repository the person chooses or we create. Not an OAuth App (section 3.5).
- Markdown only. Uploads stay in R2 and are linked, because GitHub blocks files over 100 MiB and asks repositories to stay under 5 GB (section 3.4).
- Outbound: one commit per batch, with the stored `sha`. A 409 means someone pushed; we fetch, and their change enters the queue as an edit against its base.
- Inbound: the App's webhook. A push becomes a queue item, never a silent overwrite of our head.

**Google Drive.**

- `drive.file` only. Never the full `drive` scope, which would bring a yearly CASA assessment (section 2.2).
- A visible folder, not the hidden app folder, because that folder is invisible to the person and deleted on uninstall (section 2.6).
- Outbound: write on the same batch cadence. Inbound: the changes feed, woken by a watch channel renewed weekly (section 2.5).
- Because Drive offered no write precondition in the pages opened, read the file's current revision before each write. A mismatch routes to the queue. `INFERENCE:` this narrows the race but does not close it; section 4.3.
- Existing Drive files come in through the Google Picker, which is what `drive.file` permits.

### 6.4 When, and on which plan

`INFERENCE:` the cadence and plan split below are proposals for the founder. The API costs behind them are small enough that the split is a pricing choice, not a cost one.

Event | Free | Pro
Edit | Saved to our copy on pause; offline on device | Same
Mirror to GitHub | On explicit push, within the plan's existing "20 pushes a month" | Automatic, batched, at most every few minutes of idle
Mirror to Drive | On close of a document, and once a day | Automatic, batched, same cadence as GitHub
Inbound edits from the mirror | Enter the queue | Enter the queue
Uploads mirrored | Never to GitHub; not to Drive | Never to GitHub; optional to Drive

**The answer to the open question.** Yes, online documents also go to the person's drive, on both plans, as a mirror.

It is cheap, it answers lock-in, and it survives our shutdown. It is not the canonical copy, because on the evidence opened Drive cannot be one.

### 6.5 The 5 GB question

- **The cap measures what we hold, not what sits in their drive.** Their drive's own quota is between them and Google or GitHub.
- **Text will almost never reach it.** `INFERENCE:` 5 GB of markdown is about five billion characters. What reaches 5 GB is uploads plus version history.
- **Keep the plan's caps:** 1 GB on Free, 10 GB on Pro (`docs/mvp0/PRODUCT-PLAN.md:240-241`). They match Craft and Obsidian Sync Standard at 1 GB, and Obsidian Sync Plus and Anytype at 10 GB.
- **At the cap, follow Obsidian's shape and soften it.** Obsidian stops syncing. We should stop accepting new uploads only, never stop saving text, and offer three ways out: prune history, move uploads to the Drive mirror, or upgrade.
- **Past 10 GB on Pro, sell storage in blocks.** Our cost is ₹14.39 a month per 10 GB (section 4.2), so a block price has a wide margin. The price is a configuration-panel row, not set here.
- **GitHub users over 5 GB are a warning, not a block.** GitHub itself says "less than 5 GB is strongly recommended". Show it; do not enforce it.

### 6.6 Two alternatives, and what each costs

Option | What it is | What it costs
**Recommended: our canonical, their mirror** | As above | R2 at ₹1.44 to ₹14.39 a person a month at the caps. A mirror worker for two providers. A `connections` record per provider, already in `21-DATA-MODEL.md`
**A. Their drive canonical, our copy a cache** | The founder's literal model | We still store every byte, so no storage saving. Drive's race stays open unless a precondition exists. Reading files we did not create needs full `drive`, so a yearly CASA assessment, price `UNVERIFIED:`, "several weeks" the first time. The queue and history lean on GitHub commits and Drive revisions we do not control
**B. Our canonical, no mirror, export on request** | The Notion and Craft shape | Cheapest to build: no mirror worker, no webhooks, no Drive verification beyond sign-in. It loses the founder's promise that documents live in the person's own storage, and GDPR Article 20 is met by export alone

`INFERENCE:` alternative A saves no money. Our copy exists in every option, because offline and the queue need it. What A changes is who wins a conflict, and on Drive it hands that to a store with no compare-and-swap.

### 6.7 The falsification test

The recommendation is wrong if either of these fails. Both can run in a day against the project's own corpus.

1. **Byte round trip.** Write each file of the 8,513-file byte-pinned corpus (`npm run corpus`) to Drive through `drive.file` as `text/markdown`, read it back, and compare SHA-256.

   One changed byte means Drive cannot hold even a faithful mirror, and the Drive half of this design falls.
2. **Concurrent edit.** Edit one file 100 times from our app and from Drive's own UI or a second client, interleaved. Count edits lost without a queue item. Anything above zero means the read-before-write guard is not enough.

**And the test that would reopen alternative A for Drive.** If Drive v3 `files.update` is shown to honour an `If-Match` precondition, Drive gains compare-and-swap. Then a Drive-canonical design deserves a second look.

---

## 7. Limits: what was not checked

- **CASA's price.** No Google, ADA or assessor page opened this session stated one.
- **Drive write preconditions.** Only the absence of `If-Match` in the fetched v3 reference text was seen. The API was not called.
- **Drive byte fidelity** for `text/markdown` uploads. Not tested; it is falsification test 1.
- **Drive revision retention**, and whether we could pin revisions. The revisions guide was not opened.
- **Google's billing past the 400,000,000-unit daily threshold.** Google says details come "later in 2026".
- **iA Writer, HackMD and Dropbox Paper.** Their pages returned 404, an empty body or a script shell.
- **Conflict handling at Bear, Anytype, Craft and Excalidraw+.** Not opened.
- **The DPDP Rules, 2025,** and any notified transfer restriction. Only the Act was opened.
- **Obsidian Sync Plus's price.** The static pricing page shows only the entry Sync price.
- **No API was exercised live.** Every limit here is as documented on 18 September 2026, not as measured.
