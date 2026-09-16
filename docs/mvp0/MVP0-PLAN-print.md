---
title: frontmatter MVP 0, the build sheet
version: print edition
date: 2026-09-16
note: The evidenced version, with every source and the market comparison, is MVP0-PLAN-v3.
---

# frontmatter MVP 0: the build sheet

Approved 16 September 2026. This is the version to print and build from. Decisions only, no argument. Numbers that carry a cost keep their source in brackets. Estimates say so.

## 1. What we are building

**An agent does better work when it is briefed properly. frontmatter writes the brief.**

A markdown editor that turns an idea into a complete, consistent set of documents a coding agent builds from, and keeps them correct while it builds.

**Sell it as:** the best AI blueprints for your agentic development.

**Who first:** people who build with coding agents and start from an idea, not a repository. Then anyone who writes markdown and wants AI that respects the file.

**The rule for the first five minutes.** The editor is the landing page. No wall, no tour, no puzzle. One sign-in prompt, once, at the first action that needs it. The draft made before signing in comes along. Saving is never a button.

**Where we win.** Four platforms already generate plan documents free. None of them serves a checksummed set at an unauthenticated URL, none ships a map, and none keeps the documents editable in a real editor afterwards. Those are ours.

The nine artefacts an agent needs | Who else ships it
---|---
Brief and product document | Spec Kit, Kiro, ChatPRD, CodeGuide
Data and API contract | Kiro and CodeGuide, partly
Per-area specs | Spec Kit, Kiro
Verify commands inside each spec | Nobody
Decision records | Through a constitution, steering or rules file
Instructions file | Kiro, Cursor, Claude Code, Codex
Glossary | Nobody. Ours is MVP 1
A map of what connects to what | Nobody
Manifest with checksums | Nobody
Fetchable cold, no repository, no licence | Nobody
Editable afterwards in a real editor | Nobody. This is the product

## 2. The twenty-two screens

Drawn to the shipped design system. Every value below was measured from the app on 16 September.

Element | Value
---|---
Header | 52px, panel background, 14px side padding, 1px bottom border
The mark | 26px square, 7px radius, accent fill, 13px at weight 800, wordmark beside it at 15.2px weight 650
Columns | 264px left, flexible centre, 304px right, both side panes on the subtle ground
Tabs | 38px tall, 13px at weight 450, right border, 2px accent underline when active
Toolbar | One row, 6 by 10px padding, 2px gaps, twelve buttons in a fixed order
Tool button | 28px minimum width, 26px tall, 12px mono, transparent border
Mode control | Segmented: Edit, Live, Reading, Split, 12px at weight 500
Tree row | 13px, 4 by 8px padding, 2px inset accent bar when active
Right pane | 12px padding, uppercase 12px semibold section headings
Colours | `#fafafa` ground, `#18181b` ink and accent, `#0044cc` links, `#1a1a1a` dark ground
Shadows | None

Icons are Material Symbols, inline. Desktop 1440 by 900, phone 390 by 844. Source in `docs/mvp0/screens/`, one command to re-render.

### S01. First run

<figure class="shot"><img src="screens/s01-first-run.png"><figcaption>S01 · The editor is the landing page.</figcaption></figure>

Opens in under two seconds, empty, box focused. Every keystroke saved to this device. Export without an account. Four chips: blueprint, clean up a paste, write a spec, notes into a plan. A second row: open from GitHub, drop a .md file, a template. Any chip, AI edit, Share or Save to cloud opens S02.

### S02. Sign in

<figure class="shot"><img src="screens/s02-sign-in.png"><figcaption>S02 · Shown once, at the first action that needs an account.</figcaption></figure>

Say what an account adds and what it does not change. Google first, GitHub second. The local draft moves in. "We never train on your documents", here and in the policy.

### S03. The workspace

<figure class="shot"><img src="screens/s03-workspace.png"><figcaption>S03 · The shape everything else inherits.</figcaption></figure>

Projects, folders, files, a badge for unread changes. Tabs coloured by project. Modes Edit, Live, Reading, Split. Twelve formatting buttons in the shipped order. Word count, bookmark, find, history, more. Right: outline always visible, then tags and bookmarks, backlinks, history (Pro), comments; Add file, Shortcuts, AI edit and the credits meter at the foot.

### S04. The AI writing box

<figure class="shot"><img src="screens/s04-ai-writing.png"><figcaption>S04 · Only while the document is empty.</figcaption></figure>

Appears on an empty document, disappears at the first character. The price in credits shown before anything is spent.

### S05. Idea mode

<figure class="shot"><img src="screens/s05-idea-mode.png"><figcaption>S05 · Six decisions, each with a recommendation. "Not sure" takes it.</figcaption></figure>

Four steps across the top. Left: the idea and the files that will be written. Right: six decisions, two or three options each, what each buys and costs, one marked recommendation.

### S06. The blueprint, ready

<figure class="shot"><img src="screens/s06-blueprint-ready.png"><figcaption>S06 · A skill folder: index first, instructions, documents, specs, manifest, checksums.</figcaption></figure>

Eleven files as a folder. `SKILL.md` is the index an agent loads first. `AGENTS.md` is emitted every time. The rail carries the file list, the consistency result in one sentence, the unlisted link, the kickoff prompt for the chosen agent, and the version. Publishing v2 writes a new path; a version never changes in place.

### S07. AI edit

<figure class="shot"><img src="screens/s07-ai-edit.png"><figcaption>S07 · A proposal in the document. Accept or reject on the span.</figcaption></figure>

AI never rewrites; it proposes. Old text struck, new text in the suggestion highlight the app already ships. The verb menu is the one already in the code: refine, expand, shorten, tone, translate, summarise, suggest links.

### S08. Document review

<figure class="shot"><img src="screens/s08-review.png"><figcaption>S08 · Everything waiting, from people and from AI, in one list.</figcaption></figure>

One list: collaborator suggestions and undecided AI edits, each with who, when, what, accept, reject. Accept all is one button. Comments sit beside it.

### S09. Share

<figure class="shot"><img src="screens/s09-share.png"><figcaption>S09 · People need accounts. Publishing needs nothing.</figcaption></figure>

Two halves. People, by email or Google account, can edit or can suggest. Publish, with a switch, the link, and the count used. Each cap states what Pro changes in one line, with no modal.

### S10. A published page

<figure class="shot"><img src="screens/s10-public-view.png"><figcaption>S10 · Renders like the public page we already ship. No comments.</figcaption></figure>

`noindex` by default with an owner switch. A dismissable "sign in with Google for a better view". A made-with line on free. Open in frontmatter, download .md. No comments, ever.

### S11. Live collaboration

<figure class="shot"><img src="screens/s11-live-collab.png"><figcaption>S11 · Presence, named cursors, the cap as a toast rather than a wall.</figcaption></figure>

One collaborator on free. The second invite shows the upgrade.

### S12. Plan and usage

<figure class="shot"><img src="screens/s12-plan-usage.png"><figcaption>S12 · Three meters, two plans, Team and Enterprise as coming.</figcaption></figure>

Meters for AI edits with the blueprint credit beside it, cloud documents, published pages. Two plans with the caps from section 3. Team and Enterprise visible but unpriced.

### S13. Offline

<figure class="shot"><img src="screens/s13-offline.png"><figcaption>S13 · A banner, not a modal. The desktop prompt on a schedule.</figcaption></figure>

Editing keeps working. Say where the text is and when it last synced. Surface a conflict; never merge silently. The desktop card appears after the third session, then every fourteen days until installed or dismissed twice.

### S14. The desktop app

<figure class="shot"><img src="screens/s14-desktop.png"><figcaption>S14 · The same interface, signed, with a folder on this Mac beside the cloud projects.</figcaption></figure>

One codebase, bundled. A local folder as a project. Files on disk written by the splice engine. Offline is complete here.

### S15. Document history

<figure class="shot"><img src="screens/s15-history.png"><figcaption>S15 · Pro. Every save is a version; a version is a diff you can restore.</figcaption></figure>

Versions with who and when, which were AI edits, a diff, restore, copy. Ninety days on Pro. Free sees the row and the pill.

### S16. Custom blocks

<figure class="shot"><img src="screens/s16-custom-blocks.png"><figcaption>S16 · A plain table, a chart block that reads it, Mermaid, a callout, maths.</figcaption></figure>

Split view, source on the left and render on the right, plus a note on how each block looks elsewhere.

### S17. The phone

<figure class="shot"><img src="screens/s17-mobile.png"><figcaption>S17 · Read, edit, outline, AI on a selection, share. Nothing else.</figcaption></figure>

Installable. Chrome prompts on its own criteria; Safari needs an instruction sheet.

### S18. Dark

<figure class="shot"><img src="screens/s18-workspace-dark.png"><figcaption>S18 · The dark ground the app already ships.</figcaption></figure>

Both themes ship. Nothing is light-only.

### S19. Instruction files

<figure class="shot"><img src="screens/s19-instruction-files.png"><figcaption>S19 · The instructions file with a health panel and the agents that read it.</figcaption></figure>

See and edit `AGENTS.md`, `CLAUDE.md` and rules files in the tree. Health panel: one file rather than two, size against Codex's 32 KiB cap, setup commands present, claims not verified recently. The agents that read it, listed. "Tidy this file" is one AI edit. The tool teaches the `@AGENTS.md` import; it does not diff two copies.

### S20. The problems panel

<figure class="shot"><img src="screens/s20-problems.png"><figcaption>S20 · Structural problems with line numbers, and one advisory writing note.</figcaption></figure>

Broken wiki links, heading skips, missing alt text, table column mismatches, unknown front-matter keys. Structural checks run on the device and cost nothing. The writing note never blocks.

### S21. A drawing on the idea

<figure class="shot"><img src="screens/s21-idea-drawing.png"><figcaption>S21 · Attach a sketch, screenshot or repository before the questions.</figcaption></figure>

The drawing is read once, described in words in the front-end spec, and never sent again, so the token cost is bounded and the privacy line stays honest.

### S22. The map

<figure class="shot"><img src="screens/s22-map.png"><figcaption>S22 · What governs what, and which decision explains which spec.</figcaption></figure>

Documents as nodes, what each governs as edges, decisions attached to the specs they explain. Counts that mean something: documents, links, orphans. Two files ship in the kit, `MAP.md` for a person and `graph.json` for an agent. Structure is read from the files, so it rebuilds on every save at no credit cost.

## 3. Free and Pro

Free is free to try. Pro is do it properly. Every cap is server-side and changes without a release.

### The editor, all free

Four modes. Twelve formatting buttons in the shipped order. Undo, redo, export to .md, HTML and PDF. Tree with projects, folders and an unread badge. Tabs coloured by project. Search across documents. Outline, tags, bookmarks, backlinks, properties. Shortcuts panel. Light and dark. Autosave on every keystroke. Problems panel.

### Everything with a cap

Feature | Where | Free | Pro
---|---|---|---
Documents in the cloud | Tree | 10 | Unlimited
Image uploads | In the document | 5 MB a file, 100 MB an account | 25 MB, 5 GB
Document history, diff, restore | S15 | No | 90 days
Trash | Tree | 30 days | 30 days
AI edits, eight verbs | S07 | 10 a month | 100 a month
Careful mode, larger model | S07 | 2 credits | 2 credits
Blueprints | S05, S06 | 1 a month | 5 a month
Top-ups | S12 | 50 edits ₹99, 3 blueprints ₹149 | Same
Live collaborators a document | S11 | 1 | Unlimited
Comments and suggestions | S08 | Yes | Yes
Published pages | S09, S10 | 5 | Unlimited
Custom slug | S10 | No | Yes
Made-with line on published pages | S10 | Shown | Removed
GitHub repositories connected | S01, tree | 1 | Unlimited
Pushes to a branch | S06 | 20 a month | Unlimited
Instruction-file editor and health panel | S19 | Yes | Yes
Offline, PWA, desktop app | S13, S14, S17 | Yes | Yes
The map, `MAP.md` and `graph.json` | S22 | Yes | Yes

### Integrations

Open any public GitHub markdown at `/gh/owner/repo/path.md`, no token needed. Import a Google Doc, capped at 10 MB by the Drive export. Import a Word .docx, converted in the browser. Serve every published page and kit as markdown at `page.md` and by `Accept: text/markdown`, plus `/llms.txt`. Open a folder on disk, including an Obsidian vault. Paste from ChatGPT or Claude and clean it up.

### Not in MVP 0

Code review. Per-span "changed since you last read", which returns in MVP 1 as a diff over history. Book mode, slide mode, note insights. Multi-column layouts through raw HTML and CSS. An image puzzle anywhere. A student tier. A community beyond an opt-in index. Two-way GitHub sync, a glossary, an MCP server, a reverse blueprint from a repository and a signed Windows build, all MVP 1.

## 4. The blueprint

````
booking-blueprint/
  SKILL.md              the index: what this is, when to load what
  AGENTS.md             house rules every agent reads
  00-BRIEF.md           the project in one page, the first user, the one metric
  01-PRODUCT.md         what ships first, what is cut
  02-DATA-AND-API.md    entities, relationships, operations
  03-ARCHITECTURE.md    one short decision record per structural choice
  04-SETUP.md           environment, local setup, the commands that gate a commit
  specs/booking.md      files governed, verify commands, an exit condition
  specs/payments.md
  MAP.md + graph.json   what governs what, which decision explains which spec
  MANIFEST.json + SHA256SUMS
````

Every `specs/*.md` carries verify commands and a numeric exit condition, so an agent can check its own work. The link is an unlisted address of at least 120 bits, `noindex`, `no-referrer`, revocable, never edited in place. A free kit unvisited for 30 days expires. `curl` needs no account.

## 5. AI, credits, cost

Two credit types. An **edit credit** buys one AI edit, one generated document, one summary, one link suggestion. A **blueprint credit** buys one blueprint with its questions, writing and consistency pass.

Sonnet 5 is $2 and $10 per million tokens; Haiku 4.5 is $1 and $5. At ₹95.96 to the dollar. Token counts are assumed, so every line is an estimate.

Task | Tokens in / out | Sonnet | Haiku
---|---|---|---
One edit | 4,000 / 800 | ₹1.54 | ₹0.77
One document | 2,000 / 1,500 | ₹1.82 | ₹0.91
One blueprint, eleven files plus a review pass | 60,000 / 23,000 | ₹33.6 | ₹16.8
Blueprint, mixed: Haiku questions, Sonnet writing | 20,000 / 3,000 then 40,000 / 20,000 | ₹30.2 |

Edits run on Haiku by default, with a two-credit careful option on Sonnet. Blueprints run mixed. Prompt caching applies to the instructions, the question set and the templates, which are identical every time, so the marginal blueprint costs less than ₹30; measure it in week one.

At full use a free user costs about ₹37.9 a month and a Pro seat about ₹228, both estimates. Re-derive from measured usage after month one.

**Ships with the credits:** a daily spend breaker per user and one global, a per-task token ceiling, rate limits, and the six AI routes behind sign-in and metering.

## 6. Rendering

A callout for prose, a fenced block for data, non-standard kinds prefixed `fm-`. No custom marker pairs: three hyphens already mean a thematic break and the front-matter fence, and an unclosed pair swallows the rest of the document.

The table stays a plain table; the block sits under it and reads it.

````
| Channel   | Bookings |
|-----------|---------:|
| Instagram |      312 |
| WhatsApp  |      186 |

```fm-chart
kind: pie
table: above
```
````

Here the chart draws and the table folds. Anywhere else the table is still a table and the block is two lines of code. Kinds: pie, bar, line. "Convert to Mermaid" writes the portable version.

Block | Here | GitHub | Obsidian
---|---|---|---
Mermaid | Rendered, ships today | Rendered | Rendered
`fm-chart` over a table | Chart, table folded | Table then two lines of code | Same
Callout | Rendered, ships today | Rendered for five kinds | Rendered
Maths | Rendered, ships today | Rendered | Rendered
Tasks, tables, images, wiki links, properties | Ship today | Standard parts render | Rendered

## 7. Storage

R2 is the bucket, Firestore is the database, never the reverse. R2 has no query, no transactions and no bucket versioning. Firestore cannot hold a body past 1 MiB and charges per read.

Thing | Where | Shape
---|---|---
Document bytes, every version | R2 | `u/<uid>/d/<docId>/v/<n>-<sha256>.md`, never overwritten
Uploads | R2 | `u/<uid>/a/<sha256>.<ext>`
Kit files, map, tarball | R2 | `k/<kitId>/v<n>/…` plus checksums
Users, plan, credits ledger | Firestore, Mumbai | One ledger row per credit with task, model, tokens, cost
Index, projects, shares, publishes, comments | Firestore | Records only
Live session state | Durable Objects, one per open document | While the session lives
Security logs, 180 days | Mumbai | Legal floor

Mumbai because the breach rules want logs held in India. Storage is not the cost; the model is. Move the R2 bucket to a Studio Zephyrus account before the first stranger's document lands in it.

## 8. Offline, sync, live editing, desktop

**Offline.** This device first, cloud second. The service worker caches the shell. Saving compares versions: if the cloud moved, both are shown and the person chooses. Nothing merges silently. Safari deletes script-writable storage after seven days without interaction, so on Safari the promise holds only for the installed app. Chrome allows up to 60 percent of the disk.

**Live editing.** The document of record stays markdown bytes, one version per save. A live session is a shared document in a Durable Object that exists only while two people have the file open; every save writes a new version; when the last person leaves it is gone. It never owns the bytes, never decides a conflict between versions, never touches files on disk.

**Desktop.** Bundle the frontend, scope the file-system capability to folders the user picks, set a content policy, rename the identifier to something name-free, sign and notarise. macOS at $99 a year. Linux needs no certificate but needs a Linux CI runner, because macOS cannot cross-compile. Windows waits for MVP 1. In-app version check, no auto-updater.

## 9. Accounts, sharing, publishing

Google first, GitHub second, through the auth client already in the repository. Everyone who edits or comments needs an account, which is what makes suggestions attributable. Editing without an account exists only for the local draft and export. A published page is readable by anyone with the link, `noindex` by default, five free, custom slug on Pro, made-with line on free.

## 10. Money

₹299 a month, ₹2,499 a year, India first. No dollar price in MVP 0.

A consumer price includes GST at 18 percent: 299 ÷ 1.18 = ₹253.39. The gateway takes 2 percent plus GST, ₹7.06. **Net about ₹246 a month**, about ₹172 on the annual plan.

Card mandates register up to ₹15,000 without a fresh authorisation each time, and both prices clear it. UPI AutoPay needs a notice at least 24 hours before every debit, so the product emails first and offers a manual retry. An Indian card gets one attempt.

International payments are not a same-week switch: they need bank approval, video identity checks, and four published pages, terms, privacy, refund and cancellation, and shipping.

Carry both ₹299 and ₹399 into the first twenty conversations. Build at ₹299.

## 11. Before the first stranger

Due before launch | What
---|---
Privacy policy, terms, consent at sign-up | The 2011 rules are live now; the newer act's penalties start 13 May 2027
Named grievance officer | The page and the address
Breach contact filed, six-hour runbook | Six hours from noticing, no size floor
Security logs, 180 days, in India | Minimal append-only log
Processor agreements | Cloudflare, Google, Anthropic, the payment gateway
Report form, 24-hour acknowledgement, takedown, preservation log, moderation page | Public pages by strangers make us an intermediary. About 74 founder-hours, and all of it ships before the first stranger publishes
Retention table, 18-plus line | One sentence now, awkward later
Four policy pages for international payments | Terms, privacy, refund and cancellation, shipping
EU sign-ups blocked | A representative costs €39 to €160 a month
GST position confirmed by a chartered accountant | Reverse charge on imported AI services
R2 bucket moved to the company account | Section 7

Never train on documents. Free kits expire. Delete on request. A published page is the only thing a stranger can read.

## 12. Security

We render untrusted markdown, run a model over private documents, and write to GitHub. That is all three legs of the prompt-injection problem. Six controls ship in MVP 0.

1. **Untrusted content is never instruction.** Document text reaches the model inside a delimited data block with a standing rule that content inside it is data.
2. **No silent outbound fetch from a document.** Remote images in a shared document are proxied or click-to-load. The published page allows no third-party image or script origin.
3. **The AI proposes, never acts.** No AI-initiated share, push or publish, ever.
4. **A GitHub push is always explicit**, always to a branch, never a merge.
5. **The daily spend breaker** bounds an injection loop.
6. **No puzzle at the door.** Abuse checks run invisibly: app attestation on the AI routes, and an invisible challenge on anonymous publishing only if abuse appears.

## 13. What we already have

Already built | What it saves
---|---
Complete payment integration: order verification, webhook signing, refunds, a browser test | Most of the payments item
The credit engine: plans, entitlements, billing tables, a three-tier AI cost model, kill switches | The ledger and server-side caps
A ten-primitive inline SVG renderer, one of them already a bar chart | Most of `fm-chart`
19 browser-side PDF tools, no uploads | The browser export path
Two scoring engines, standard library only | The problems panel
A named-app auth client with a refresh guard | Sign-in
A numbered document convention proved on three sets, 61 files | The kit spine
A map of a whole system, rebuilt from files at no token cost | S22
A public skills registry with 184 skills and a sync engine | The community route

Genuinely new: the offline outbox, live editing, the GitHub App, the kit writer, the consistency check.

## 14. The build

**S** is 1 to 2 engineering days, **M** 3 to 5, **L** 6 to 10. Every phase ends green, with a failing test first for anything that fixes a defect.

**Phase 0, weeks 0 to 2, before code.** Settle section 17. Move the R2 bucket to the company. File the breach contact, publish policy, terms and grievance pages, sign the processor agreements, ask the accountant, publish the four payment policy pages. Fix the repository default that still points at the sibling's vault. Publish the pace every Friday. Make twenty blueprints by hand for twenty people outside the studio and watch whether five run the kickoff.

Phase A, the launch core | Size
---|---
Editor at the root with a local draft, no wall | S
Google and GitHub sign-in for strangers, a users record | M
Per-user storage: versions, index, projects, documents | L
Projects in the tree, tabs with project colours | M
Right pane: history and comments rows, shortcuts, AI edit, credits | M
AI writing box on an empty document | S
Export: wire the browser PDF path, delete the server route | S
Published page, noindex, sign-in card, made-with line | M
Report form, 24-hour acknowledgement, takedown, moderation page | M
Markdown twins and `/llms.txt` | S
Problems panel | M
**27 to 46 days** |

Phase B, AI and credits | Size
---|---
Suggestion mode: proposals in place, accept and reject per span | L
Credits ledger, two types, caps, breaker | M
Routes behind sign-in and metering, model routing, prompt caching | S
Injection controls: delimited data block, image proxy, page policy | S
**11 to 19 days** |

Phase C, the blueprint | Size
---|---
Six decisions from a prompt, in the card shape | L
Kit writer: eleven files, one review pass, consistency check | L
Skill folder, index file, instructions file, verify arrays | S
The map: `MAP.md` and `graph.json`, rebuilt on save | M
Storage, link, manifest, tarball, checksums, revoke, expiry | M
Kickoff prompt, agent picker, copy | S
A kit opens as a project; edit then publish v2 | S
Attach a drawing, document or repository to an idea | M
GitHub App: connect, open a repository, push to a branch, caps | L
**30 to 51 days** |

Phase D, sharing and collaboration | Size
---|---
Share dialog, roles, invites by account | M
Comments on spans | M
Suggestions from collaborators into the review panel | M
Live editing: shared session per document, presence, the cap | L
**15 to 25 days** |

Phase E, offline, PWA, desktop | Size
---|---
Local-first outbox, compare-and-swap save, conflict prompt | L
PWA: cached shell and documents, icons, install prompt, Safari sheet | S
Desktop nudge on its schedule | S
Bundle, file-system scope, content policy, identifier, macOS signing and notarisation, version check | L
Linux targets on a CI runner | S
**15 to 26 days** |

Phase F, Pro and the rest | Size
---|---
Subscriptions, webhooks, GST invoices, one-attempt retry | S
Plan and usage page, upgrade, top-ups | M
Document history, 90 days, diff, restore | M
`fm-chart` over a table, convert to Mermaid, elsewhere preview | M
Instruction-file editor with the health panel | M
Imports: Google Docs and Word | M
Retention table, 18-plus line, EU block | S
**17 to 29 days** |

**The sums.** Everything: **115 to 196 engineering days**. The launch core, what a stranger meets on day one, is phases A, B and C plus payments and the plan page: **72 to 123 days**.

At this pace | Launch core | Everything
---|---|---
1.21 days a week, the measured rate | 60 to 102 weeks | 95 to 162 weeks
3 days a week | 24 to 41 weeks | 38 to 65 weeks
5 days a week | 14 to 25 weeks | 23 to 39 weeks

**If the date slips**, cut from the bottom: live editing, then the desktop build, then GitHub, into releases after launch. The PWA covers the download prompt.

## 15. Risks, and where we stop

Risk | Kill line
---|---
Nobody keeps a blueprint alive after the first build | Fewer than two of ten pilot users edit a kit after its first build: keep the editor, stop the generator
Free AI costs more than assumed | Model cost per active free user over ₹60 in a month: halve the free caps that week
Pro loses money at full use | Measured cost per Pro seat over ₹200: ₹399 for new seats
Three unfamiliar technologies at once | If the live-editing spike runs past ten days, buy it instead
Injection through a shared document | One confirmed leak: sharing goes invite-only until fixed
A breach in the first month | Six hours to the authority; the runbook is written before launch
A platform absorbs the kit | If a major platform ships a public shareable project link, the pitch narrows to the editor and the desktop app
Pace | Launch core not done in 30 weeks: cut blueprint automation, launch the editor with hand-made kits

## 16. What we measure

The funnel: visits, documents created, sign-ups, blueprints started, finished, kickoff copied, kit fetched by an agent, **kit edited again within seven days**, pages published, second collaborator invited, Pro.

**The one number: blueprints edited after their first build, per week.** It tests the only claim that separates us from every generator.

**Also:** the acceptance rate of AI suggestions, accepted against proposed.

**The pilot passes** when three of ten strangers name the problem unprompted, two of ten are still editing at day 30, one call is booked, and five of ten run the kickoff.

**Published every Friday:** engineering days, the running rate, the re-forecast date, model cost per active user, suggestion acceptance, and conversion once it exists.

## 17. Answer before phase 0 ends

1. **The pace, and who builds.** At the measured 1.21 days a week the launch core is a year out. The largest decision in this file.
2. **₹299 or ₹399.**
3. **The name.** No trademark search has succeeded: the registers need a login and a puzzle. Free if we coin: `getfrontmatter.com`, `usefrontmatter.com`, `mdmax.in`, `mdmax.ai`, and the `mdmax` package name.
4. **Windows:** the PWA now, a certificate in MVP 1?
5. **EU sign-ups** blocked for MVP 0?
6. **The templates source.** No "box project" repository exists on this machine. Default is the eleven-file kit in section 4.
7. **The free caps** as written?
8. **Who makes the twenty hand-made blueprints, and by when.**
9. **Which of the 184 skills may be public.**
10. **The map's role:** a view plus two files in the kit, and does the kickoff prompt tell the agent to read it first?
11. **Project colour:** chosen or assigned?
12. **The kit shape for larger projects:** one folder, or one per area?
