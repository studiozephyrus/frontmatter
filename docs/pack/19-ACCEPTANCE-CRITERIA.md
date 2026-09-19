---
id: 19-ACCEPTANCE-CRITERIA
title: Acceptance criteria
mode: reference
tier: canonical
status: living
updated: 2026-09-19
owner: sagnik
verified_against: 31d3644
covers: [acceptance-criteria, testable-assertions]
---

# 19. Acceptance criteria

One testable criterion per feature, in one form.

## 0. Read this before using any id below

**`10-FEATURE-REGISTER.md` is authoritative for feature ids.** Where a feature id here disagrees with
the register, **the register wins and this file is wrong**.

**It landed while this file was being written, and the two agree.** The register's section 0 reaches
the same finding as section 0.1 below, independently: `F001` to `F077` are the audit findings, and
**product features start at `F101`**, so no feature can ever be mistaken for a finding. Its section 7
is the crosswalk from this file's slugs to those numbers, and **it keeps the slug as the key rather
than rewriting this file**. Section 11 below is the other half of that join.

### 0.1 What the grep actually returned, and why this file could not use it

The instruction was to take feature ids from the plan. The command, run on 18 September 2026 at
commit `f237ece`:

```bash
grep -o 'F0[0-9][0-9]' docs/mvp0/PRODUCT-PLAN.md | sort -u | wc -l     # 70
grep -o 'F0[0-9][0-9]' docs/mvp0/PRODUCT-PLAN.md | sort -u | head -1   # F001
```

**Seventy unique tokens, `F001` to `F077` with gaps. Not one of them is a feature.** They are the
audit findings of 17 September. The first, at `docs/mvp0/PRODUCT-PLAN.md` section 0, reads:

> Pro's model cost was wrong by a factor of three (F001).

A finding is a correction to the plan. A feature is a thing the product does. **Using `F001` as a
feature id would collide with a live identifier**, and `65-CONVENTIONS.md` section 3 says an id is
never reused.

### 0.2 So this file uses a provisional namespace, and says so

- **Feature ids here are `F-` plus a slug**: `F-signin`, `F-splice`, `F-docmode`.
- **A slug is the join key, and it stays.** Section 11 gives one row per slug, and
  `10-FEATURE-REGISTER.md` section 7 gives the numeric features each slug reaches. **Neither file
  rewrites the other**, which is what lets both be edited without a merge.
- **A slug never collides with `F001`**, which is exactly why the shape was chosen.
- **Where a plan finding is the evidence behind a criterion, it is cited as `finding F0NN`**, in
  words, so nobody mistakes it for a feature.

## 0.3 The form

`id | feature | given | when | then | test | spec`

- **`id`** is `A` plus three digits, per `65-CONVENTIONS.md` section 3.
- **`feature`** is the provisional slug of section 0.2.
- **`given`** is the starting state, stated precisely enough to build.
- **`when`** is one action.
- **`then`** is **one assertion a machine can make**. Section 0.4 is the test of that.
- **`test`** is a real test path, or `T` plus three digits where it is proposed. **`T001` to `T082`
  mean the same tests as in `17-ERROR-AND-REFUSAL-CATALOGUE.md`**, and neither file may renumber
  one. Acceptance-only tests start at `T100`.
- **`spec`** is `specs/<path>` where one exists, or a pack file and section, or `none yet`.

## 0.4 What mechanically checkable means here

**If you cannot write the check, the criterion is wrong, not the check.**

A `then` may assert exactly these things.

Kind | Example
A byte comparison | The file's bytes before and after compare equal
A count | The document contains exactly one front matter block
An exit code | `npm run corpus` exits 0
An HTTP status | The route answers 401
A stored value | The ledger balance is unchanged
A DOM query | Exactly one element carries the primary style in that region
A timing, at a stated percentile | Keystroke echo under 100 ms at p95 over 100 samples
A string match | The rendered text equals the string at `K.s22.refuse.gdoc.sub`

**A `then` may never assert:** that something feels fast, is clear, is intuitive, is simple, looks
good, or that a person understands it. Section 10 lists the criteria that were written and thrown out
for exactly this.

---

## 1. The front door

id | feature | given | when | then | test | spec
`A001` | `F-signin` | A signed-out browser | The sign-in page loads | The page contains zero elements of type `password` and zero iframes from a captcha vendor | `T100` | `18` §2.
`A002` | `F-signin` | A signed-out browser | The sign-in page loads | `grep -ri "captcha\|recaptcha\|hcaptcha\|turnstile" src/ package.json` returns zero matches | `T101` | `18` §10.
`A003` | `F-signin` | A signed-out browser | The sign-in page loads | Exactly two sign-in controls are present, labelled `K.s01.google` and `K.s01.github` | `T102` | `16` §3.
`A004` | `F-signin` | A signed-out browser | `/privacy` is requested with `curl -sI` | The status is 200 and not a 307 to `/login` | `T103` | `18` §2.
`A005` | `F-signin` | A signed-out browser | `/terms`, `/pricing` and `/refunds` are each requested with `curl -sI` | All three answer 200, none redirects | `T104` | `18` §2.
`A006` | `F-signin` | Any commit | `grep -ri "shepherd\|driver.js\|intro.js\|joyride" package.json` | Zero matches | `T105` | `18` §10.
`A007` | `F-signin` | A first-time signed-in account | Home loads | No modal, overlay or coach mark is in the DOM | `T106` | `18` §2.
`A008` | `F-firstrun` | A new account on a mid-range Android over 4G | The stopwatch runs from first paint of sign-in to the first save | The median of three runs is under 60 s | `T107` | `18` §1.

---

## 2. The engine

**This is the half of the file where the checks already exist.** Every `then` below is a number a
command prints.

id | feature | given | when | then | test | spec
`A010` | `F-splice` | The pinned corpus of 8,513 files | `npm run corpus` runs | The command exits 0, and exits 1 on a single changed byte | `scripts/corpus-foreign.mjs` | `specs/engine/splice-writer`.
`A011` | `F-splice` | The 7,969 front-matter-bearing corpus files | The writer runs a `set` over each | `changed = 0` | `scripts/corpus-foreign.mjs` | `specs/engine/splice-writer`.
`A012` | `F-splice` | The same run | The same | `threw = 0`. **The writer never throws; it returns the input or a spliced result** | `scripts/corpus-foreign.mjs` | `specs/engine/splice-writer`.
`A013` | `F-splice` | The same run, after the R0 fixes | The same | `refused` is 2 or fewer | `scripts/corpus-foreign.mjs` | `specs/engine/splice-writer`.
`A014` | `F-splice` | A file whose target key cannot be addressed | A `set` is attempted | The returned bytes compare equal to the input bytes | `test/share/frontmatter-splice.test.ts` | `17` `E001`.
`A015` | `F-splice` | A file with a duplicate top-level key | A `set` on that key | The returned bytes compare equal to the input, and no key was appended | `T003` | `17` `E003`.
`A016` | `F-splice` | A file with a zero-indent block sequence | A `set` on the key above it | After the fix: the key's value changes and every other byte is identical. **Before the fix this test must fail** | `test/corpus/foreign/nf-001-red-proof.test.ts` | `specs/engine/nf-001-zero-indent-sequence`.
`A017` | `F-splice` | A synthetic fixture whose fence ends in a bare carriage return | A `set` alone, with no delete after it | The document contains exactly two `^---` lines, being one open and one close | `test/corpus/foreign/nf-003-red-proof.test.ts` | `specs/engine/nf-003-bare-cr-fence`.
`A018` | `F-splice` | A carriage-return-only file, and a carriage-return-and-line-feed file | Any write | The line-ending style of every untouched line is byte-identical | `T007` | `specs/engine/nf-003-bare-cr-fence`.
`A019` | `F-splice` | A file with a byte-order mark before the fence | Any write | The mark is preserved and the fence is still recognised | `T008` | `specs/engine/splice-writer`.
`A020` | `F-splice` | The repository at any commit | A search for a second key scanner | There is one splice implementation. **This is a proxy check and must be labelled one** | `T109` | `specs/engine/splice-writer`.
`A021` | `F-shapegate` | A document over the byte budget | The shape gate runs | It returns `ok: false` with `reason: 'BUDGET_BYTES'` and the limit | `test/mdmax/shape-gate.test.ts` | `17` `E016`.
`A022` | `F-shapegate` | A file that is not valid UTF-8 | The shape gate runs | It returns `reason: 'INVALID_UTF8'` with a line and column, and **repairs nothing** | `test/mdmax/shape-gate.test.ts` | `17` `E019`.
`A023` | `F-vaultwrite` | A write path containing `..` | A commit is attempted | The call throws before any write, and the repository is unchanged | `test/repository/commit-changes.test.ts` | `17` `E024`.
`A024` | `F-splice` | Any operation | An oracle is written for it | The oracle asserts on that operation alone, never on set-then-delete | `T110` | `specs/engine/nf-003-bare-cr-fence`.

---

## 3. The editor and its modes

id | feature | given | when | then | test | spec
`A030` | `F-editor` | An open document | A character is typed | The buffer updates, and the echo is under 100 ms at p95 over 100 samples | `T111` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A031` | `F-editor` | A 10 MB document | It is opened | It paints in under 3 s, and the keystroke echo target of `A030` still holds | `T112` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A032` | `F-editor` | An open document with unsaved keystrokes | 500 ms passes on a 4G connection | The server holds the new version, and the pill reads `K.common.saved` | `T113` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A033` | `F-editor` | An open document | The mode segment is set to each of Edit, Live, Reading and Split | The bytes on disk are identical in all four | `T114` | `15` §3.
`A034` | `F-editor` | Ghost text is showing | `Tab` is pressed | The suggestion is inserted, and `indentWithTab` did not run | `T115` | `15` §4 C3.
`A035` | `F-editor` | Ghost text is not showing | `Tab` is pressed | The line indents | `T115` | `15` §4 C3.
`A036` | `F-editor` | The editor has focus and the find panel is open | The find-next chord is pressed | The match advances and the graph view does not open | `T116` | `15` §4 C1.
`A037` | `F-editor` | Two tabs are open | Undo is pressed in one | Only that document's buffer changes | `T117` | `15` §8.
`A038` | `F-editor` | A panel edit lands while the editor has focus | Undo is pressed | The panel edit is not undone, because it was dispatched with `addToHistory.of(false)` | `T118` | `15` §8.1.
`A039` | `F-editor` | A file row is dragged onto a folder row | The drop completes | The file's path changes and its bytes compare equal | `T119` | `15` §9.
`A040` | `F-editor` | An image file is dropped into the editor | The drop completes | An image link is inserted at the drop offset, and no other byte changes | `T120` | `15` §9.
`A041` | `F-docmode` | A document opened in Doc mode | Every first-level toolbar control is used once | The resulting file parses as plain markdown in a stranger's parser | `T121` | `docs/mvp0/PRODUCT-PLAN.md` section 7.
`A042` | `F-docmode` | A document opened in Doc mode | Nothing is typed | The bytes on disk are unchanged. **Opening a view never writes** | `T122` | `docs/mvp0/PRODUCT-PLAN.md` section 17.
`A043` | `F-docmode` | Doc mode, first open on this account | The mode is entered | `K.s05.toast` appears exactly once, and never again on this account | `T123` | `16` §6.
`A044` | `F-views` | A document with H2 and H3 headings | Each of Page, Flow, Slides, Mind map, Kanban and Outline is selected | The bytes on disk are identical after all six | `T124` | `docs/mvp0/PRODUCT-PLAN.md` section 17.
`A045` | `F-blocks` | A document containing an `fm-chart` block | It is rendered by a plain markdown parser | The block renders as a fenced code block and the table above it as a table | `T125` | `docs/mvp0/PRODUCT-PLAN.md` section 20.
`A046` | `F-blocks` | Any `fm-` block | It is parsed, rendered and serialised | The serialised bytes compare equal to the input | `T126` | `docs/mvp0/PRODUCT-PLAN.md` section 20.

---

## 4. The AI layer

id | feature | given | when | then | test | spec
`A050` | `F-aibox` | An empty document and an account with credits | The AI box is focused | `K.s06.cost` is visible before any control is pressed | `T127` | `16` §7.
`A051` | `F-aibox` | An empty document | The box is open | Its first line names the target document by name | `T128` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:274`.
`A052` | `F-aibox` | An idea is in progress | The box is scrolled | The target line stays on screen | `T129` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:278`.
`A053` | `F-aiedit` | A selection and an AI verb | The verb runs and returns a suggestion | The document bytes are unchanged until Accept is pressed | `T130` | `docs/mvp0/PRODUCT-PLAN.md` section 16.
`A054` | `F-aiedit` | A suggestion is showing | Accept and Reject are measured | Both carry the same computed font size, weight and background role | `T131` | `16` §2.
`A055` | `F-aiedit` | A suggestion is showing | Reject is pressed | The bytes compare equal to the pre-suggestion bytes | `T132` | `17` `E084`.
`A056` | `F-aiedit` | A model proposal whose range cannot be spliced | Accept is pressed | The document is unchanged and the proposal is dropped | `T052` | `17` `E084`.
`A057` | `F-airouter` | Every provider in the chain refusing | An AI edit is requested | The ledger balance is identical before and after | `test/ai/provider-race.test.ts` | `17` `E080`.
`A058` | `F-airouter` | The first provider rate-limited | An AI edit is requested | The second provider serves it, and the person sees no error | `test/ai/provider-race.test.ts` | `17` `E081`.
`A059` | `F-airouter` | An AI request | It is sent | It is acknowledged in under 1 s and the first token arrives in under 3 s | `T133` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A060` | `F-aisettings` | A fresh account | Settings is read | Ghost text is off | `T134` | `docs/mvp0/PRODUCT-PLAN.md` section 14.
`A061` | `F-aimark` | An accepted AI edit | The version record is read | It carries `author`, `source`, `model`, `ask`, `accepted_by` and `at` | `T135` | `docs/mvp0/PRODUCT-PLAN.md` section 20.
`A062` | `F-aimark` | Inline marking off, which is the default | An AI edit is accepted | The file contains no `<!-- ai:` comment | `T136` | `docs/mvp0/PRODUCT-PLAN.md` section 20.
`A063` | `F-aibudget` | An account at its per-account budget | A model call is attempted | The breaker opens and no provider is called | `T137` | `docs/mvp0/PRODUCT-PLAN.md` section 14.
`A064` | `F-aisafety` | Document text sent to a model | The request is inspected | The text sits inside a delimited data block | `T138` | `docs/mvp0/PRODUCT-PLAN.md` section 14.

---

## 5. Problems and instruction files

id | feature | given | when | then | test | spec
`A070` | `F-problems` | A document with a broken wikilink, a heading skip, a missing alt attribute and a malformed table row | The panel opens | Exactly four rows appear under the Checks filter | `T140` | `16` §11.
`A071` | `F-problems` | The same document | The panel opens | No network request is made by the structural checks | `T141` | `docs/mvp0/PRODUCT-PLAN.md` section 5.
`A072` | `F-problems` | A document with one long sentence | The panel opens | The row appears under Writing, never under Checks, and no control is disabled by it | `T142` | `16` §11.
`A073` | `F-problems` | Any document | Fix all safe runs | Every changed byte corresponds to a listed safe fix, and nothing else changed | `T143` | `16` §11.
`A074` | `F-instructions` | A project with five instruction files, one drifted | The panel opens | It reports 4 of 5 and names the drifted file and the line count | `T144` | `16` §12.
`A075` | `F-instructions` | The panel open | Its text is read | It contains `K.s11.honest` verbatim, including both studies | `T145` | `16` §12.

---

## 6. Ideas and the blueprint

id | feature | given | when | then | test | spec
`A080` | `F-ideas` | An idea and the Low depth | The arrow is pressed | Between 10 and 15 questions are generated, in one call | `T150` | `docs/mvp0/PRODUCT-PLAN.md` section 5.
`A081` | `F-ideas` | A generated question set | A page renders | It shows 4 questions or fewer | `T151` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:112`.
`A082` | `F-ideas` | A question marked non-branching | It is answered | No later page is regenerated and no model call is made | `T152` | `docs/mvp0/PRODUCT-PLAN.md` section 5.
`A083` | `F-ideas` | A question marked branching | It is answered | The affected cards show the rewriting state, and `K.s13.rewriting` names the question | `T153` | `16` §13.2.
`A084` | `F-ideas` | A Free account and three rewrites already fired | A fourth branching answer | No rewrite runs, and the standard set stands | `T047` | `17` `E077`.
`A085` | `F-ideas` | Any depth | The first page renders | The controls are identical to Low's: the same progress line, pill, Skip, recommendation and Next | `T154` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:104`.
`A086` | `F-ideas` | Page two or later | Skip all is pressed | A modal appears carrying `K.s14.skipall.body1` and `K.s14.skipall.body2` | `T155` | `16` §13.3.
`A087` | `F-ideas` | A question answered Not sure | The blueprint is written | `DECISIONS.md` records it as open, never as decided | `T156` | `docs/mvp0/PRODUCT-PLAN.md` section 5.
`A088` | `F-ideas` | A Low answer | The recommendation is shown | No percentage or confidence number appears anywhere on the card | `T157` | `docs/mvp0/PRODUCT-PLAN.md` section 9.
`A089` | `F-ideas` | A Medium answer | The evidence rows are read | Every row cites the person's own documents or the template, and each template row carries the date it was last checked | `T158` | `docs/mvp0/PRODUCT-PLAN.md` section 9.
`A090` | `F-blueprint` | A finished Low blueprint | The kit is listed | It contains exactly 15 files: 12 markdown and 3 data | `T159` | `docs/mvp0/PRODUCT-PLAN.md` section 9.
`A091` | `F-blueprint` | A finished blueprint | The consistency check runs | Every entity named in `specs/*.md` is defined in `02-DATA-AND-API.md` | `T160` | `16` §13.4.
`A092` | `F-blueprint` | A published kit | The page is read | The root hash is printed on the page, outside the tarball | `T161` | `docs/mvp0/PRODUCT-PLAN.md` section 5.
`A093` | `F-blueprint` | A published kit | The kickoff prompt is run | Step 1 stops when the computed hash differs from the printed one | `T162` | `docs/mvp0/PRODUCT-PLAN.md` section 14.
`A094` | `F-blueprint` | A Low blueprint | It is requested | Progress is shown past 10 s and the kit is complete in under three minutes | `T163` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A095` | `F-map` | A project of 12 documents | A document is saved | The map is rebuilt from the files and no model call is made | `T164` | `16` §13.5.

---

## 7. Sharing, review and history

id | feature | given | when | then | test | spec
`A100` | `F-share` | A document and an email that is not an account | The person is added | An invite is offered, and no error state is shown | `T027` | `17` `E039`.
`A101` | `F-share` | A link with a password | The link is opened | A hash is stored server-side and the plaintext password appears in no record | `T170` | `16` §14a.
`A102` | `F-share` | A link with a 7-day expiry | The clock passes the expiry | The link answers as expired, and the document still opens for its owner | `T171` | `16` §14a.
`A103` | `F-publish` | A published page | `curl -sI` requests the HTML route | The status is 200, with no redirect in the chain | `test/proxy.test.ts` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:324`.
`A104` | `F-publish` | A published page | `curl -sI` requests `page.md` and `llms.txt` | Both answer 200 with no redirect and no interstitial | `test/proxy.test.ts` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:325`.
`A105` | `F-publish` | A published page on Free | The footer is read | It carries `K.s18.made`, `K.s18.report`, Privacy, Terms and the markdown twin link | `T172` | `16` §14b.
`A106` | `F-publish` | A published page | The open-in bar is measured | It is added to the DOM only after first contentful paint | `T173` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:324`.
`A107` | `F-publish` | A published page | Third-party script tags are counted | The count is zero | `T174` | `docs/mvp0/PRODUCT-PLAN.md` section 14.
`A108` | `F-live` | Two people in one document on Free | A third attempts to join | The join is refused and `K.s19.toast` states the limit | `T046` | `17` `E076`.
`A109` | `F-live` | A live session | The last participant leaves | No shared-editing state is persisted to any store | `T175` | `docs/mvp0/PRODUCT-PLAN.md` section 15.
`A110` | `F-queue` | A queue with one person edit and two machine edits | The filter is set to People | Exactly one item is listed | `T176` | `16` §14d.
`A111` | `F-queue` | A queue with machine edits | Accept all is pressed | Only the named person's edits are applied, and a confirmation states the count first | `T082` | `17` `E117`.
`A112` | `F-queue` | An agent-written change | The queue is read | The row offers Show diff first and Reject, and no one-click Accept | `T177` | `16` §14d.
`A113` | `F-queue` | Any queue item | It is rejected | The document bytes compare equal to the pre-proposal bytes | `T178` | `17` §8.
`A114` | `F-history` | A Free account | A document is saved 12 times over 10 days | Versions older than the history window are pruned to the head, and the head is intact | `T179` | `docs/mvp0/PRODUCT-PLAN.md` section 18.
`A115` | `F-history` | Any version | Restore is pressed | A new version is written, and the restored-from version still exists | `T180` | `16` §14e.
`A116` | `F-export` | Any account | Export runs | Documents, uploads, versions, comments and queue items all leave as files a stranger's tool reads | `T181` | `docs/mvp0/PRODUCT-PLAN.md` section 18.

---

## 8. In, out and everywhere

id | feature | given | when | then | test | spec
`A120` | `F-import` | A folder of 2,000 markdown files | It is imported | Every file's bytes compare equal, and the whole import finishes in under two minutes | `T182` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A121` | `F-import` | An Obsidian vault | It is imported | Only the daily-note path and the templates folder are read from `.obsidian` | `T183` | `docs/mvp0/PRODUCT-PLAN.md` section 11.
`A122` | `F-import` | A Google Doc over 10 MB | Import is attempted | Nothing is created, and the text shown equals `K.s22.refuse.gdoc.sub` | `T024` | `17` `E035`.
`A123` | `F-import` | A `.docx` file | It is imported | No request carries the file's bytes off the machine | `T184` | `16` §14f.
`A124` | `F-github` | A connected repository | A write is attempted outside `docs/` | The write is refused server-side | `test/repository/github-writer.test.ts` | `17` `E056`.
`A125` | `F-github` | A file whose blob sha has moved | A push is attempted | The 409 is treated as a re-read, and no content is overwritten blind | `test/repository/github-writer.test.ts` | `17` `E111`.
`A126` | `F-drive` | A connected folder | A change is made in Drive | It appears in frontmatter within five minutes | `T185` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A127` | `F-drive` | A Drive edit and a web edit on the same paragraph | Both are synced | Both versions are kept, neither is merged, and the conflict screen is shown | `test/share/list-conflicts.test.ts` | `17` `E112`.
`A128` | `F-conflict` | A conflict on screen | Nothing is pressed | No merged version exists in the version store | `T186` | `docs/mvp0/PRODUCT-PLAN.md` section 17.
`A129` | `F-conflict` | A conflict on screen | Let AI decide is pressed | A proposal enters the change queue, and the file is unchanged until an item is accepted | `T081` | `17` `E114`.
`A130` | `F-offline` | The browser goes offline | Typing continues | Every keystroke reaches local storage, and the pending count rises | `test/drafts/draft-store.test.ts` | `17` `E100`.
`A131` | `F-offline` | The browser is offline | An AI edit is attempted | The control is disabled with `K.s24.aioff` beside it, and no request is made | `T055` | `17` `E087`.
`A132` | `F-offline` | A first connection after offline work | Sync runs | Every local draft reaches the server before any local copy is evicted | `T187` | `docs/mvp0/PRODUCT-PLAN.md` section 12.
`A133` | `F-desktop` | The desktop build | Documents are created past the cloud cap | No cap is enforced, and every document is a file on disk | `T188` | `docs/mvp0/PRODUCT-PLAN.md` section 12.
`A134` | `F-phone` | A viewport under 600 dp | Any screen loads | The bottom bar carries exactly five destinations | `T189` | `docs/mvp0/PRODUCT-PLAN.md` section 12.
`A135` | `F-phone` | A viewport under 600 dp | Any screen loads | No hover tip is registered | `T190` | `18` §7.

---

## 9. Entitlements, caps and the panel

id | feature | given | when | then | test | spec
`A140` | `F-limits` | The repository at any commit | The architecture gate runs | No cap literal is read outside the entitlements layer. **`limitsFor(account)` is the one read path** | `T191` | `docs/mvp0/PRODUCT-PLAN.md` section 30.
`A141` | `F-limits` | An account at the document cap | A new cloud document is attempted | Nothing is created, every existing document still opens and exports, and none is deleted | `T040` | `17` `E070`.
`A142` | `F-limits` | An account downgraded below what it holds | It signs in | Nothing is deleted, and creation is blocked until it is under the cap | `T048` | `17` `E078`.
`A143` | `F-limits` | A Free collaborator on a Pro owner's document | An action is taken | The owner's limits apply | `T034` | `docs/mvp0/PRODUCT-PLAN.md` section 19.
`A144` | `F-config` | A founder lowering a limit | Save is pressed | The count of accounts the change puts over the cap is shown, with their names, before the write | `T049` | `docs/mvp0/PRODUCT-PLAN.md` section 30.
`A145` | `F-config` | Any configuration write | It is submitted | The super-admin flag is checked server-side, never in the browser | `T037` | `docs/mvp0/PRODUCT-PLAN.md` section 30.
`A146` | `F-config` | Any configuration write | It succeeds | An audit row records who, which setting, from what, to what, when, and how many accounts moved | `T192` | `docs/mvp0/PRODUCT-PLAN.md` section 30.
`A147` | `F-config` | A provider whose terms have not been opened | Its switch is pressed | It does not enable, and the row states why | `T060` | `17` `E090`.
`A148` | `F-config` | The training promise row and the age floor row | Either is pressed | Neither changes. Both are locked, with the reason on the row | `T193` | `docs/mvp0/PRODUCT-PLAN.md` section 30.
`A149` | `F-ledger` | Any model call | It completes or fails | Exactly one ledger entry exists, carrying the account, kind, delta, model and cost | `T194` | `docs/mvp0/PRODUCT-PLAN.md` section 18.
`A150` | `F-ledger` | A failed model call | The ledger is read | The delta is zero | `T051` | `16` §1.
`A151` | `F-exception` | A time-boxed exception on one account | Its expiry passes | The account returns to its plan limits on the next read | `T195` | `docs/mvp0/PRODUCT-PLAN.md` section 30.

---

## 10. Criteria that were written and thrown out

**Nine were drafted and cut, because no machine can check them.** They are kept here so nobody
re-drafts them, and so the rule in section 0.4 has teeth.

Rejected `then` | Why it fails | What replaced it
The sign-in page feels fast | No assertion | `A008`, a stopwatch median
A person who knows Google Docs needs nothing explained | Needs a person, and a population | `A001` to `A007`, which check the absence of the things that would explain
The editor is pleasant to type in | No assertion | `A030`, keystroke echo at p95
Doc mode looks like Google Docs | Comparative and subjective | `A041`, the file still parses as plain markdown
The refusal message is clear | No assertion | `A122`, the string equals the copy id
Empty states are helpful | No assertion | `A200` below, one primary control
The blueprint is good | No assertion | `A090` and `A091`, file count and consistency
The map helps an agent | Needs an agent and a task | `A095`, rebuilt from files with no model call
AI edits are trustworthy | Needs a person's judgement | `A053` and `A055`, bytes unchanged until accepted

**The pattern in all nine:** the rejected form describes the intended effect, and the replacement
describes an observable consequence of it. **The effect is still the goal; it is just not the test.**

---

## 11. Feature slug map

One row per slug used above, saying what the slug is and where the plan defines it.

**The other half of the join is `10-FEATURE-REGISTER.md` section 7**, which lists the numeric
features each slug reaches. Read the two side by side: this table says what a slug means, that one
says which features it tests. **Forty-two slugs until 18 September, forty-three with `F-trial` added for D08, and the register records that they reach 137 of its
180 features**. The 43 that slugs left uncovered are now all covered: 21 by section 12a and 22 by
section 12b, and the register's `acceptance` column points at each.

Slug | What it is | Where the plan defines it | Criteria
`F-signin` | Sign in with Google or GitHub, one tap | §3 front door, `docs/mvp0/PRODUCT-PLAN.md` section 3 | `A001` to `A007`.
`F-firstrun` | The first sixty seconds | `18` §1 | `A008`.
`F-splice` | The splice writer | §17 invariant 2, `docs/mvp0/PRODUCT-PLAN.md` section 17 | `A010` to `A020`, `A024`.
`F-shapegate` | The shape gate | `src/modules/mdmax/domain/shape-gate.ts` | `A021`, `A022`.
`F-vaultwrite` | The vault write guard | `src/modules/repository/application/commit-changes.ts` | `A023`.
`F-editor` | The editor, four modes | §4, `docs/mvp0/PRODUCT-PLAN.md` section 4 | `A030` to `A040`.
`F-docmode` | Doc mode | §7 | `A041` to `A043`.
`F-views` | View as Flow, Slides, Mind map, Kanban, Outline | §8 | `A044`.
`F-blocks` | The `fm-` blocks | §20, `docs/mvp0/PRODUCT-PLAN.md` section 20 | `A045`, `A046`.
`F-aibox` | The AI box on an empty document | S06 | `A050` to `A052`.
`F-aiedit` | Seven verbs on a selection | S07 | `A053` to `A056`.
`F-airouter` | The provider chain | §14 | `A057` to `A059`.
`F-aisettings` | The two AI switches | S28 | `A060`.
`F-aimark` | The AI mark in the version record | §20, `docs/mvp0/PRODUCT-PLAN.md` section 20 | `A061`, `A062`.
`F-aibudget` | Per-account budget and breaker | §14 control 3 | `A063`.
`F-aisafety` | The delimited data block | §14 control 7 | `A064`.
`F-problems` | The problems panel | S10 | `A070` to `A073`.
`F-instructions` | The instruction-file set | S11 | `A074`, `A075`.
`F-ideas` | Idea mode, three depths | §9 | `A080` to `A089`.
`F-blueprint` | The fifteen-file kit | §9, `docs/mvp0/PRODUCT-PLAN.md` section 9 | `A090` to `A094`.
`F-map` | The project map | S16 | `A095`.
`F-share` | People and links | §10 | `A100` to `A102`.
`F-publish` | Published pages | §10, S18 | `A103` to `A107`.
`F-live` | Live editing | §15, `docs/mvp0/PRODUCT-PLAN.md` section 15 | `A108`, `A109`.
`F-queue` | The change queue | S20, §17 | `A110` to `A113`.
`F-history` | Document history | S21 | `A114`, `A115`.
`F-export` | Export | §18, `docs/mvp0/PRODUCT-PLAN.md` section 18 | `A116`.
`F-import` | Folder, Obsidian, Notion, Docs and Word import | §11 | `A120` to `A123`.
`F-github` | The GitHub App | §11 | `A124`, `A125`.
`F-drive` | Google Drive sync | §11 | `A126`, `A127`.
`F-conflict` | The conflict screen | S31 | `A128`, `A129`.
`F-offline` | Offline in the browser | §12 | `A130` to `A132`.
`F-desktop` | The desktop app | §12 | `A133`.
`F-phone` | The phone layouts | §12 | `A134`, `A135`.
`F-limits` | The entitlements layer | §30 | `A140` to `A143`.
`F-config` | The configuration panel | §30 | `A144` to `A148`.
`F-ledger` | The usage ledger | §18 | `A149`, `A150`.
`F-exception` | A time-boxed exception | §30 | `A151`.
`F-trial` | The one-month Pro trial and its lock, D08 | §13, and `53-PRICING-AND-ENTITLEMENTS.md` sections 5.1 and 5.5 | `A797` to `A814`, section 12c. No register id yet.
`F-empty` | Empty states | `18` §4 | `A200`.
`F-a11y` | Accessibility | §16 | `A201`, `A202`.
`F-perf` | Performance budgets | §21 | `A203`, `A204`.
`F-legal` | The legal floor | §23 | `A205`, `A206`.

---

## 12. Six criteria that cut across every feature

id | feature | given | when | then | test | spec
`A200` | `F-empty` | Each of the 22 empty states in `18` §4 | It is rendered | Exactly one control carries the primary style, or zero where `18` §6 says so | `T200` | `18` §3.
`A201` | `F-a11y` | Any screen | Contrast is computed for every text and background pair | Every pair is at or above 4.5:1 | `docs/mvp0/screens/gen.mjs:620` | `docs/mvp0/PRODUCT-PLAN.md` section 16.
`A202` | `F-a11y` | Any screen | It is walked by keyboard alone | Every action in `16-COPY-DECK.md` marked `label` is reachable | `T201` | `15` §13.
`A203` | `F-perf` | The editor's first load | The bundle is measured in continuous integration | The JavaScript is at or under 250 KB | `T202` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A204` | `F-perf` | A mid-range Android over 4G | The first load is measured | Largest contentful paint under 2.5 s at p75, interaction to next paint under 200 ms, cumulative layout shift under 0.1 | `T203` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A205` | `F-legal` | Any published page | It is rendered | A report route is present and resolves | `T204` | `docs/mvp0/PRODUCT-PLAN.md` section 23.
`A206` | `F-legal` | Any price shown to a person | It is read | It states that it is inclusive of tax | `T205` | `docs/mvp0/PRODUCT-PLAN.md` section 23.


---

## 12a. Criteria reconciled from the screen specs, 18 September 2026

The 38 screen specs cited `A` ids that this file never defined, and many reused numbers this file
already gives another meaning. `tools/acceptance-reconciliation.md` records every decision, and
`tools/acceptance-map.json` tells the coordinator what each screen token becomes.

- **New ids start at `A500`.** The screens used provisional ids up to `A428`, so no new id can be
  mistaken for a provisional one. No existing id was renumbered.
- **The feature column holds register ids** from `10-FEATURE-REGISTER.md`, not section 0.2 slugs.
- **The test column is `T` plus the same three digits as the criterion**, proposed, not written.
- **A `then` marked `Not yet checkable`** says what would make it checkable.

### 12a.1 The five that encode the differentiation

These must never regress silently. Each one names its red proof.

id | feature | given | when | then | test | spec
`A500` | `F276` | Every file in the pinned corpus, with a byte range `[s, e)` and a replacement `r` drawn from a fixed seed | The splice writer applies the replacement | The output bytes equal `input[0:s] + r + input[e:]` for every file and every seed, and one differing byte anywhere else fails the run. **Red proof: it must fail against a writer that re-serialises the file** | `T500` | `specs/engine/splice-writer`.
`A501` | `F276` | A document and a captured range whose bytes changed after capture, or whose anchor occurs more than once | A splice is attempted through each caller: AI accept, queue accept, a conflict proposal and a decision-record write | Each call returns bytes equal to the input and a refusal code, and zero versions are written. **Red proof: it must fail against a build that re-resolves offsets or takes the first match** | `T501` | `specs/engine/splice-writer`.
`A502` | `F280` | A document and one change from each source: a person's suggestion, an AI edit, an agent write through the API or the watched folder, a Tidy proposal and a conflict proposal | Each change is submitted and nobody presses Accept | The document bytes compare equal to the bytes before submission, exactly one change-queue item exists per change, and the accept handler is the only function whose call changes the bytes. **Red proof: a build with any auto-apply path must fail it** | `T502` | `12-screens/S20.md`.
`A503` | `F216`, `F217` | A published page | `page.md` and `llms.txt` are requested with `curl -sI` four times: with no cookie, with an expired session cookie, with a crawler user agent, and with the owner over the published-pages cap | All eight responses are 200 with zero 3xx in the chain and no interstitial body, and `isPublicPath()` in `src/proxy.ts` returns true for both paths in a unit test | `T503` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:325`.
`A504` | `F276` | The pinned corpus and a fixed seed choosing 100 single-byte positions across it | For each position one byte is flipped and `npm run corpus` runs, then the byte is restored | All 100 mutated runs exit 1 and name the changed file, and the restored corpus exits 0. **This is `A010`'s red proof made repeatable** | `T504` | `specs/engine/splice-writer`.

### 12a.2 From the screens

id | feature | given | when | then | test | spec
`A505` | `F101`, `F102` | A signed-out browser | The sign-in page loads | Both provider marks are inline `<svg>` elements, and the network log holds zero requests for an image or font serving either mark | `T505` | `12-screens/S01.md`.
`A506` | `F101` | A signed-out browser | The sign-in page loads | The Google mark's `<svg>` carries exactly four distinct `fill` values, each equal to a value in the source file under `docs/mvp0/screens/icons/` | `T506` | `12-screens/S01.md`.
`A507` | `F103` | Any route | It loads | The network log holds zero requests to `fonts.googleapis.com/icon` or for any font family containing `Material Symbols` | `T507` | `65-CONVENTIONS.md` section 9.
`A508` | `F101` | A signed-out browser | The sign-in page finishes loading | `document.activeElement` is the Google button | `T508` | `12-screens/S01.md`.
`A509` | `F101`, `F102` | The provider popup is open | The popup is closed without signing in | The sign-in card is in the DOM and both provider buttons have no `disabled` attribute | `T509` | `12-screens/S01.md`.
`A510` | `F101` | A browser holding a valid session | The sign-in route is requested | The route is replaced by home and the sign-in card element is never inserted into the DOM, checked by a mutation observer from first byte | `T510` | `12-screens/S01.md`.
`A511` | `F101` | A 390 px wide viewport | The sign-in page loads | The preview column has no rendered box, and `scrollWidth` is at or under `clientWidth` on the scrolling element | `T511` | `12-screens/S01.md`.
`A512` | `F101` | A first sign-in whose profile write is made to fail | The provider returns success | No session cookie is set, and the store holds zero account records for that identity | `T512` | `12-screens/S01.md`.
`A513` | `F105` | A signed-in account with zero documents | `/` is requested | The S02 root element is present and the S03 root element is absent | `T513` | `12-screens/S02.md`.
`A514` | `F105` | Home, first run, at 1,440 px | It renders | Exactly five start cards are in the DOM, and exactly one carries the accent class | `T514` | `12-screens/S02.md`.
`A515` | `F105` | Home, first run, at 390 px | It renders | Exactly four start cards are rendered, and `scrollWidth` is at or under `clientWidth` | `T515` | `12-screens/S02.md`.
`A516` | `F121` | Home, first run | A folder is dropped on any point of the page | An import job is created for that folder, and the import panel opens | `T516` | `12-screens/S02.md`.
`A517` | `F222` | A Free account on the seeded configuration | Home, first run, renders | The caps line's collaborator figure equals `limitsFor(account)` collaborators, and that value is 1 | `T517` | `12-screens/S02.md`.
`A518` | `F105` | Home, first run | It finishes loading | `document.activeElement` is the first start card | `T518` | `12-screens/S02.md`.
`A519` | `F105`, `F106` | An account with zero documents | One document is created and `/` is requested again | The S03 root element is present and the S02 root element is absent | `T519` | `12-screens/S03.md`.
`A520` | `F106` | An account that opened documents X then Y | Home loads | The first recent row is Y | `T520` | `12-screens/S03.md`.
`A521` | `F106` | A Pro account on the web, and any account on the desktop build | Home loads | The usage pill element is absent in both | `T521` | `12-screens/S03.md`.
`A522` | `F106`, `F107` | The ideas-count request delayed by 10 s | Home loads | Before the count resolves, the recent list is rendered and a click on its first row navigates to that document | `T522` | `12-screens/S03.md`.
`A523` | `F138` | A recent row | Every action in its menu is invoked in turn on a fresh fixture | No action removes the document from both the store and the trash; the only removing action moves it to the trash | `T523` | `12-screens/S03.md`.
`A524` | `F106` | Home at 390 px | It renders | Project and owner render inside the row's subline element, and `scrollWidth` is at or under `clientWidth` | `T524` | `12-screens/S03.md`.
`A525` | `F106` | An account with 200 documents | Home loads | Zero object reads for document bytes are made to storage, counted from the storage adapter's request log | `T525` | `12-screens/S03.md`.
`A526` | `F118`, `F119` | The workspace | It renders | The left rail contains exactly two `button` elements | `T526` | `12-screens/S04.md`.
`A527` | `F118`, `F121` | The workspace | Every control is enumerated and a folder is dropped on the tree | Exactly one Upload control exists, inside the Add file menu, and the drop creates the same import job as that control | `T527` | `12-screens/S04.md`.
`A528` | `F121` | The workspace with no pointer over the tree and nothing focused | It renders | The drop hint has a rendered box and computed `visibility: visible` | `T528` | `12-screens/S04.md`.
`A529` | `F120` | The workspace | It loads | The Ideas section has `aria-expanded="false"` and shows a count, and Notes has `aria-expanded="true"`, on the same load | `T529` | `12-screens/S04.md`.
`A530` | `F122`, `F123` | The right rail with all four collapsible rows closed | It renders | All four rows sit above the outline, the outline fills the remaining height, and zero reads are issued for any closed row | `T530` | `12-screens/S04.md`.
`A531` | `F122` | The workspace route | Its DOM is searched | The string `Shortcuts` occurs zero times in text nodes and in `title` and `aria-label` attributes | `T531` | `12-screens/S04.md`.
`A532` | `F208` | The workspace header | It renders | The Share control has a non-empty accessible name and zero visible text characters | `T532` | `12-screens/S04.md`.
`A533` | `F111` | The workspace header | It renders | It contains the brand mark element and zero wordmark elements | `T533` | `12-screens/S04.md`.
`A534` | `F114`, `F116` | The workspace at 1,440 px | It renders | The tab strip's top edge is above the toolbar's, and the toolbar holds twelve tools in the order listed in `12-screens/S04.md` | `T534` | `12-screens/S04.md`.
`A535` | `F253` | The workspace at 390 px | It renders | The toolbar holds exactly seven tools, and the mode segment is a descendant of the header | `T535` | `12-screens/S04.md`.
`A536` | `F115` | Doc mode | The toolbar renders | A face selector and a size stepper are both direct children of the first-level toolbar, not inside More | `T536` | `12-screens/S05.md`.
`A537` | `F115` | Doc mode | The face selector is opened | Exactly four options are listed | `T537` | `12-screens/S05.md`.
`A538` | `F276` | A document, then one edit: a face change in Doc mode, or an accepted AI splice | Undo is pressed once | The bytes on disk compare equal to the bytes before the edit | `T538` | `12-screens/S05.md`.
`A539` | `F112` | A document in Doc mode | A comment is added | The file's bytes compare equal to the bytes before, and the comment exists in the comment store | `T539` | `12-screens/S05.md`.
`A540` | `F128` | The properties panel on a file with a nested key | Invalid YAML is submitted, then a valid edit to the nested key | The first returns a refusal and the bytes are unchanged; the second changes only the nested key's value bytes | `T540` | `12-screens/S05.md`.
`A541` | `F112` | Doc mode | It renders | The right-rail element is absent | `T541` | `12-screens/S05.md`.
`A542` | `F112`, `F240` | A Doc-mode document with a set face, colour and page setup | It is exported to PDF, then rendered at 390 px | The PDF's font name, text colour and page size equal the settings, and at 390 px comments render inside the drawer with `scrollWidth` at or under `clientWidth` | `T542` | `12-screens/S05.md`.
`A543` | `F151` | The AI box in each of its states, on desktop and in the phone sheet | It renders | The target line is the first child element in every state | `T543` | `12-screens/S06.md`.
`A544` | `F151` | A selection from offset 120 to 180 | The box opens | Before any network request, the target line contains the selected range | `T544` | `12-screens/S06.md`.
`A545` | `F152` | Two fixtures: room below the content, and none | The box opens in each | Its top edge is below the content's bottom edge in the first, and its left edge is right of the content's right edge in the second | `T545` | `12-screens/S06.md`.
`A546` | `F152` | A selection | The box opens | The box's bounding rectangle does not intersect any client rectangle of the selection | `T546` | `12-screens/S06.md`.
`A547` | `F161` | Each AI failure path: provider refusal, chain exhausted, timeout, offline | It is forced | The rendered text includes the copy ids for document untouched and nothing charged | `T547` | `12-screens/S06.md`.
`A548` | `F150` | The workspace | The AI box is opened | `location.pathname` is unchanged and the workspace root element is the same node before and after | `T548` | `12-screens/S06.md`.
`A549` | `F155` | A collapsed selection, then a non-empty one | The menu chord is pressed in each | The menu is absent for the first and present for the second | `T549` | `12-screens/S07.md`.
`A550` | `F155` | A non-empty selection | The menu opens | It lists exactly seven verbs in the order in `12-screens/S07.md`, with Refine first | `T550` | `12-screens/S07.md`.
`A551` | `F154`, `F158` | The menu is open | Its foot is read | It contains the per-call cost, the ledger's remaining credits and the current provider's name, each equal to the stored value | `T551` | `12-screens/S07.md`.
`A552` | `F155` | A selection | Summarise into a callout is accepted | The selection's bytes are still present and unchanged, and one `> [!` callout is inserted next to them | `T552` | `12-screens/S07.md`.
`A553` | `F155` | A selection holding emphasis, links and a fenced block | Translate is accepted | The multiset of mark delimiters, every link target and every fence body compare equal before and after. **Red proof: it must fail against a build that sends the raw selection** | `T553` | `12-screens/S07.md`.
`A554` | `F180` | An `fm-chart` block with no table above it | It renders | The block's source text is displayed, and the reason string's copy id is present | `T554` | `12-screens/S08.md`.
`A555` | `F180` | An `fm-` block carrying a field the renderer does not know | It is parsed and serialised | The output bytes compare equal to the input | `T555` | `12-screens/S08.md`.
`A556` | `F176` | A `> [!unknownkind]` callout | It renders | It renders as a `blockquote`, and its text content equals the source text without the marker | `T556` | `12-screens/S08.md`.
`A557` | `F174` | A `mermaid` fence that fails to parse | It renders | The fence's source text is displayed in the block's place, and the block's rendered height is above zero | `T557` | `12-screens/S08.md`.
`A558` | `F180` | A new chart inserted from the toolbar | The file is read | The fence's info string is exactly `fm-chart@1` | `T558` | `12-screens/S08.md`.
`A559` | `F174`, `F180` | The production dependency tree | Licences are listed | Zero packages carry a GNU Affero General Public Licence (AGPL) identifier | `T559` | `12-screens/S08.md`.
`A560` | `F113` | A viewport under the phone breakpoint | The mode segment renders | Split is absent or carries `aria-disabled="true"` | `T560` | `12-screens/S08.md`.
`A561` | `F181` | A document with two H2 headings, each followed by two H3 headings | Flow view opens | Exactly two phase columns and four step cards render, with the heading texts in source order | `T561` | `12-screens/S09.md`.
`A562` | `F181` | A document with no H2 | Flow view is selected | The Page view offer and its reason copy id are rendered, and no phase column is | `T562` | `12-screens/S09.md`.
`A563` | `F181` | A document whose first heading is an H3 | Flow view opens | A leading column holds that step, and the count of rendered steps equals the count of H3 headings | `T563` | `12-screens/S09.md`.
`A564` | `F181` | Two steps, one starting `[api]` and one with no bracket | Flow view opens | The first step renders one badge reading `api`, and the second renders zero badges | `T564` | `12-screens/S09.md`.
`A565` | `F181` | A board wider than the viewport, with focus on it | The right arrow, then the left arrow, is pressed | `scrollLeft` increases after the first and decreases after the second | `T565` | `12-screens/S09.md`.
`A566` | `F181` | Flow view open | The toolbar and the tree foot are read | The phase count and the step count are equal in both places, and both equal the heading counts in the file | `T566` | `12-screens/S09.md`.
`A567` | `F181` | A step whose trailing reference names no existing document | Flow view opens | The reference renders as a text node with no enclosing `a` element | `T567` | `12-screens/S09.md`.
`A568` | `F181` | Flow view open on the fixture used by the drawn example | Badge colours and legend entries are collected | Every badge colour drawn appears in the legend on the same screen | `T568` | `12-screens/S09.md`.
`A569` | `F166` | The problems panel | It opens | The filter has exactly three segments, labelled All, Checks and Writing in that order | `T569` | `12-screens/S10.md`.
`A570` | `F166` | A document with one structural finding and one advisory note | The panel opens on All | The two rows sit under different group headings, and the filter element is present | `T570` | `12-screens/S10.md`.
`A571` | `F165` | An account and its ledger | The Checks segment runs | The ledger holds zero new entries and the credit balance is unchanged. **Red proof: it must fail against a build that routes a check through a model** | `T571` | `12-screens/S10.md`.
`A572` | `F165` | The document shown in the drawn example, as a fixture | The checks run on it | The set of findings produced equals the set of findings drawn | `T572` | `12-screens/S10.md`.
`A573` | `F168` | A document with three safe fixes | Fix all safe is pressed, confirmed, then undo is pressed once | The confirmation text contains the number 3 before any byte changes, and one undo restores the original bytes | `T573` | `12-screens/S10.md`.
`A574` | `F168` | A document with a missing alt text, a broken link and a misspelling, and nothing else | Fix all safe is offered | Zero safe fixes are listed and the bytes are unchanged | `T574` | `12-screens/S10.md`.
`A575` | `F165` | One check made to throw | The panel runs every check | Every other check's findings are present, and only the throwing check's findings are absent | `T575` | `12-screens/S10.md`.
`A576` | `F165` | The network disabled | The Checks segment runs | It returns the same findings as with the network enabled | `T576` | `12-screens/S10.md`.
`A577` | `F171` | A project with one instruction file of each relationship: source, import, copy and missing | The panel opens | Each row's relationship cell equals its fixture's relationship | `T577` | `12-screens/S11.md`.
`A578` | `F172` | The S11 copy ids in `16-COPY-DECK.md` | They are searched | No string matches a claim of improved agent task success, by the pattern list kept beside the test. **Red proof: it must fail on a planted string** | `T578` | `12-screens/S11.md`.
`A579` | `F172` | Instruction files for a tool with a known cap and a tool with none | The panel opens | The first row shows the cap for its tool only, and the second shows the copy id for unknown | `T579` | `12-screens/S11.md`.
`A580` | `F171` | A tool that supports imports | Add as an import is pressed | The written file contains the import line and not the source file's body | `T580` | `12-screens/S11.md`.
`A581` | `F172` | A copy carrying hand edits since generation | Regenerate is pressed | A refusal is returned, and the copy's bytes are unchanged | `T581` | `12-screens/S11.md`.
`A582` | `F171` | The network disabled | Every control on the panel except Tidy is used | Each returns a result and none makes a network request | `T582` | `12-screens/S11.md`.
`A583` | `F188` | The idea composer at 1,440 px | It renders | One centred column renders, with zero second columns and zero breadcrumb elements | `T583` | `12-screens/S12.md`.
`A584` | `F189` | The idea composer, and the ideas empty state | Each renders | The three depths are the options of one control in each, and no route exists per depth | `T584` | `12-screens/S12.md`.
`A585` | `F189` | The idea composer | The depth is changed through all three values | The bounding boxes of the composer and its bar row are identical after each change | `T585` | `12-screens/S12.md`.
`A586` | `F188` | An idea typed into the composer | Everything except the send arrow is used | Zero model calls are made, counted at the router | `T586` | `12-screens/S12.md`.
`A587` | `F188` | A typed idea and a send made to fail | The send arrow is pressed | The composer's value equals the typed text in full | `T587` | `12-screens/S12.md`.
`A588` | `F200` | An attachment added to an idea | Its chip renders | The chip contains the copy id stating what the attachment will be used for | `T588` | `12-screens/S12.md`.
`A589` | `F189` | An idea with three answers at Low | The depth is raised to Medium | All three answers are still stored with their values unchanged | `T589` | `12-screens/S12.md`.
`A590` | `F154` | The idea composer | It renders | The rail foot credit count and the cost foot credit count are equal, and both equal the ledger | `T590` | `12-screens/S12.md`.
`A591` | `F189` | The idea composer at 390 px | It renders | The depth pill is a descendant of the bar row | `T591` | `12-screens/S12.md`.
`A592` | `F190` | A sent idea | Page one renders | The full question set is already stored, and zero model calls are made on arrival | `T592` | `12-screens/S13.md`.
`A593` | `F191` | Pages one to three with page one answered | A branching question on page two is answered | Every answered question's stored text and answer are unchanged, and only questions on later pages differ | `T593` | `12-screens/S13.md`.
`A594` | `F195` | Page one, then page two | Each renders | Skip and Choose the recommendation are present on both, and Skip all is absent on page one and present on page two | `T594` | `12-screens/S13.md`.
`A595` | `F201` | The last question page | It renders | The fifteen file names are listed, and the ledger holds no blueprint entry yet | `T595` | `12-screens/S13.md`.
`A596` | `F198` | A High-depth decision card | Its evidence rows are read | Every row's URL appears in the research pass's fetch log with a 200 status, and every row carries an opened date | `T596` | `12-screens/S14.md`.
`A597` | `F195` | An idea with answers, skips and a rewrite, part way through | The page is reloaded | The same page renders, and every stored answer, skip and rewrite equals its value before the reload | `T597` | `12-screens/S14.md`.
`A598` | `F201` | A finished blueprint | The file list and the manifest are compared | The two sets of paths are equal | `T598` | `12-screens/S15.md`.
`A599` | `F203` | A revoked kit link | It is requested with `curl -sI` | The status is 404 or 410, and no response in the chain is a 3xx to sign-in | `T599` | `12-screens/S15.md`.
`A600` | `F206` | A blueprint published as v1, then as v2 | The v1 link is requested | It answers 200 and its bytes hash to v1's printed hash | `T600` | `12-screens/S15.md`.
`A601` | `F202` | A consistency check made not to run | The screen renders | The check renders the not-run state and zero passed marks | `T601` | `12-screens/S15.md`.
`A602` | `F203`, `F204` | A kit with one manifest file missing | The screen renders | The link element and the hash element are both absent | `T602` | `12-screens/S15.md`.
`A603` | `F186` | A built map | Each node's path is checked on disk | Every node's path exists as a file | `T603` | `12-screens/S16.md`.
`A604` | `F186` | A kit with three data files | The map is built | The file count includes the three, and zero nodes have their paths | `T604` | `12-screens/S16.md`.
`A605` | `F186` | A built map | The toolbar, tree foot and rail counts are read | The three values are equal and come from one function, checked by a spy that counts one call per render | `T605` | `12-screens/S16.md`.
`A606` | `F186` | A built map | It is walked by Tab alone | Every node receives focus, and every node's accessible name contains its kind | `T606` | `12-screens/S16.md`.
`A607` | `F187` | A built map, then a rebuild made to fail | The document is saved | The previous graph's nodes are still rendered, and the stale marker is present | `T607` | `12-screens/S16.md`.
`A608` | `F186` | A built map | It renders | The graph is an inline `svg` element, and the map region contains zero `img` and zero `canvas` elements | `T608` | `12-screens/S16.md`.
`A609` | `F208` | An address the directory reports as no account | Add is pressed | Zero people are added to the document's access list | `T609` | `12-screens/S17.md`.
`A610` | `F210` | An invite accepted, then the invited person signing in three times | The ledger is read | Exactly one invite grant exists for each side, dated at the first sign-in | `T610` | `12-screens/S17.md`.
`A611` | `F211` | The invite block and the referral entry point | Both render | They render the same component with equal terms strings | `T611` | `12-screens/S17.md`.
`A612` | `F214` | A Free account | The link password switch is pressed | The switch stays off, no password is stored, and the plan page link is present | `T612` | `12-screens/S17.md`.
`A613` | `F215` | A published page and a fresh browser | It loads | Zero requests to an auth, session or bot-detection endpoint start before first paint, from the network log | `T613` | `12-screens/S18.md`.
`A614` | `F218` | The open-in bar dismissed on one page | Another page on the same origin loads | The bar element is absent | `T614` | `12-screens/S18.md`.
`A615` | `F215` | A slug that was never published | The HTML route, `page.md` and `llms.txt` are requested with `curl -sI` | All three answer 404, and none answers a 3xx to sign-in | `T615` | `12-screens/S18.md`.
`A616` | `F215` | A published page | Every link and button is enumerated | Exactly one control leads to sign-in, and it is Edit | `T616` | `12-screens/S18.md`.
`A617` | `F214` | A password link and a slug that does not exist | A wrong password is submitted to each | The two response bodies and statuses are identical | `T617` | `12-screens/S18.md`.
`A618` | `F221` | A live session with two editors making ten edits | The session saves | Every write passes through the splice writer, counted by a spy, and each save adds exactly one version | `T618` | `12-screens/S19.md`.
`A619` | `F221` | A live session whose connection is dropped mid-edit | Typing continues | No dialog element opens, and every keystroke is in the saved bytes after reconnect | `T619` | `12-screens/S19.md`.
`A620` | `F221` | A live session with avatars, cursors and highlights shown | The file is saved | The bytes contain none of the presence markers, compared against a save with presence off | `T620` | `12-screens/S19.md`.
`A621` | `F221` | A remote edit that deletes the range under a remote cursor | The edit arrives | That cursor element is hidden until a new position arrives | `T621` | `12-screens/S19.md`.
`A622` | `F221`, `F231` | Queued offline edits whose ranges no longer exist | The connection returns | The conflict screen opens, and the version store holds zero merged versions | `T622` | `12-screens/S19.md`.
`A623` | `F156`, `F223` | An AI suggestion or a queue item showing Accept and Reject | It renders and Enter is pressed | Neither control is `document.activeElement` or has `autofocus`, and the Enter press changes no bytes and no queue state | `T623` | `12-screens/S20.md`.
`A624` | `F225` | A queue holding AI and agent items | The filter is set to each position in turn | In every position, Accept all is absent or carries `aria-disabled="true"` whenever an AI or agent item is in the listed set | `T624` | `12-screens/S20.md`.
`A625` | `F223` | A queue with one AI item | The rail renders | The item's diff element is rendered with no click | `T625` | `12-screens/S20.md`.
`A626` | `F226` | A queue with three proposed spans on the open document | The rail opens | Exactly three highlight elements render in the document, one over each span's range | `T626` | `12-screens/S20.md`.
`A627` | `F227` | A history with a person's version and an accepted AI edit | The list renders | Every row has a non-empty author cell, and the AI row's text contains the accepting person's name | `T627` | `12-screens/S21.md`.
`A628` | `F228` | A document and one of its versions | Copy as new is pressed | The source document's bytes compare equal to before, and one new document exists | `T628` | `12-screens/S21.md`.
`A629` | `F229` | A version outside the retention window | The screen renders | Its row text equals the out-of-window copy id, and the string `deleted` does not appear | `T629` | `12-screens/S21.md`.
`A630` | `F228` | A diff with one added and one removed line | It renders with colour disabled | Each line still carries a text marker or an accessible name saying added or removed | `T630` | `12-screens/S21.md`.
`A631` | `F234` | A project holding `a.md`, and an import containing a different `a.md` | The import runs | The original `a.md`'s bytes are unchanged, and the imported file exists under a second path | `T631` | `12-screens/S22.md`.
`A632` | `F234` | A browser with no directory input support | Upload a folder is chosen | A file picker opens, and zero controls on the screen are left without an action | `T632` | `12-screens/S22.md`.
`A633` | `F121` | The import screen | The drop area is reached by Tab and Enter is pressed | It receives focus and the Enter press opens the file picker | `T633` | `12-screens/S22.md`.
`A634` | `F239` | An import of 100 files cancelled after 40 are written | The store is read | The 40 written files are present with their bytes, and zero further files are created | `T634` | `12-screens/S22.md`.
`A635` | `F245` | The connections screen with every connection connected, then errored | Each state renders | The DOM contains zero strings matching the stored token or key values, checked against the fixture secrets | `T635` | `12-screens/S23.md`.
`A636` | `F245` | Each unconnected card | It renders | The scope text element precedes the connect control in DOM order | `T636` | `12-screens/S23.md`.
`A637` | `F245` | A connected GitHub repository and Drive folder | Disconnect is pressed on each | Our connection row is removed, a revoke call is recorded to the provider, and zero of the person's files or documents are deleted | `T637` | `12-screens/S23.md`.
`A638` | `F246` | The agents card | It renders | Its text contains the copy id saying an agent may propose, and no string offers apply or publish to an agent | `T638` | `12-screens/S23.md`.
`A639` | `F247` | Keystrokes typed offline | The page is reloaded with no connection | The editor's bytes equal the bytes typed before the reload | `T639` | `12-screens/S24.md`.
`A640` | `F249` | A fresh page load | The page loads, then the person types | `navigator.storage.persist` is never called during load, and is first called inside a user-gesture handler | `T640` | `12-screens/S24.md`.
`A641` | `F247` | Local storage made to throw on write | A key is typed | The interrupt element renders within the same task, and its text is the not-kept copy id | `T641` | `12-screens/S24.md`.
`A642` | `F247`, `F250` | The repository at any commit | The persistence names are searched | The IndexedDB store `sgnk-md` with object store `drafts`, the key `sgnk-md:dirty`, the key `sgnk-md-editor-settings` and the Tauri bundle id `ai.sgnk.md` each appear at their use site, and a rename fails the test | `T642` | `AGENTS.md` section 8.
`A643` | `F250` | A desktop account with one cloud project and one local folder | The tree renders | Both appear in one tree, under group labels that name cloud and local | `T643` | `12-screens/S25.md`.
`A644` | `F250` | A local document | It is saved | The file on disk has the editor's bytes, compared byte for byte | `T644` | `12-screens/S25.md`.
`A645` | `F252` | An update whose signature does not verify | The updater runs | The update is not installed and no prompt offering it is shown | `T645` | `12-screens/S25.md`.
`A646` | `F252` | The platform rows | They render | Every row has a non-empty state cell and a non-empty reason cell | `T646` | `12-screens/S25.md`.
`A647` | `F149` | The desktop app running in the background | The global chord is pressed | The box is visible within 100 ms at p95 over 100 samples, and zero network requests are made | `T647` | `12-screens/S26.md`.
`A648` | `F149` | A destination note of N bytes | A capture is saved | The first N bytes of the note are unchanged, and the capture follows them | `T648` | `12-screens/S26.md`.
`A649` | `F149` | Any capture path on this screen | A capture is saved | The ledger holds zero new entries and `limitsFor` is called zero times, counted by a spy | `T649` | `12-screens/S26.md`.
`A650` | `F149` | A capture with suggested chips, none tapped | It is saved | The saved bytes contain none of the chips' text | `T650` | `12-screens/S26.md`.
`A651` | `F149` | A capture whose save is made to fail | Save is pressed | The box is still open and its value equals the typed text | `T651` | `12-screens/S26.md`.
`A652` | `F149` | A capture with typed text | Escape is pressed | The box closes and the destination note's bytes are unchanged | `T652` | `12-screens/S26.md`.
`A653` | `F149` | A capture saved offline | The connection returns | The destination note ends with the captured text | `T653` | `12-screens/S26.md`.
`A654` | `F255` | The installed web app on iOS | The capture screen renders | The share-route copy id saying it is absent is present, and no share control exists | `T654` | `12-screens/S26.md`.
`A655` | `F149` | A global chord already claimed by another application | The desktop app launches | The named-conflict message element renders at launch | `T655` | `12-screens/S26.md`.
`A656` | `F109` | No stored preference and the system set to dark | The page loads | The first painted frame has the dark background token, and no frame with the light background is painted | `T656` | `12-screens/S27.md`.
`A657` | `F109` | Light mode | The theme toggle is pressed | `localStorage` key `sgnk-theme` and the `dark` class on `<html>` both change within the same task | `T657` | `12-screens/S27.md`.
`A658` | `F109` | An account preference of dark and a second device with no local key and the system light | The account signs in there | The page renders dark | `T658` | `12-screens/S27.md`.
`A659` | `F109` | A stored preference | Match the system is chosen | The `sgnk-theme` key is absent, and the theme follows the media query | `T659` | `12-screens/S27.md`.
`A660` | `F109` | `localStorage` made to throw on every access | The page loads and the toggle is pressed | The page renders light, and the toggle changes the theme for the session | `T660` | `12-screens/S27.md`.
`A661` | `F109` | The stylesheet | Custom properties under `:root` and under `.dark` are listed | Every token under `:root` has a counterpart under `.dark` | `T661` | `12-screens/S27.md`.
`A662` | `F109` | Every screen's source | Colour literals are searched outside the token file | Zero hex, rgb or hsl colour literals are found | `T662` | `12-screens/S27.md`.
`A663` | `F108` | Settings | Each of the ten slugs is requested, and each nav entry is clicked | All ten answer 200 and all ten nav entries reach their section | `T663` | `12-screens/S28.md`.
`A664` | `F108` | A toggle changed on device one | Device one reloads, and device two signs in | Both read the changed value | `T664` | `12-screens/S28.md`.
`A665` | `F108` | Settings with the network disabled | Every control is used | Every local preference changes, and every network-bound row carries `aria-disabled="true"` with a reason string | `T665` | `12-screens/S28.md`.
`A666` | `F108`, `F257` | Settings | Every control is used | Zero writes reach the configuration store, counted at its adapter | `T666` | `12-screens/S28.md`.
`A667` | `F108` | The delete-account control | It is pressed once, then confirmed with the wrong typed text | The account still exists after both | `T667` | `12-screens/S28.md`.
`A668` | `F266`, `F270`, `F272` | A running deployment | A limit, a routing cell and the indexing flag are each changed in the configuration store | The next request reflects each change, with no deploy and no restart between, checked by the deployment id being unchanged | `T668` | `12-screens/S35.md`.
`A669` | `F259` | A meter at 100 per cent | The screen renders | The meter carries the full marker and names the plan that lifts it, and every control on the screen is enabled | `T669` | `12-screens/S29.md`.
`A670` | `F262` | A failed payment | The account signs in | The past-due line renders, and the document count and every document's bytes are unchanged | `T670` | `12-screens/S29.md`.
`A671` | `F262` | The plan route | Its DOM is searched | Zero inputs have a card number, expiry or security code `autocomplete` value or name | `T671` | `12-screens/S29.md`.
`A672` | `F263` | Every mandate the checkout can create | Their amounts are read | None exceeds ₹15,000 | `T672` | `12-screens/S29.md`.
`A673` | `F230` | Two `portfolio.md` files with equal bytes, one typed by hand and one made from a template | Both are published | The two rendered HTML bodies compare equal | `T673` | `12-screens/S30.md`.
`A674` | `F230` | A `portfolio.md` | It is parsed by a plain CommonMark parser with front matter support | Every heading and paragraph of the product's render is present in the plain parse, and the front matter parses as YAML | `T674` | `12-screens/S30.md`.
`A675` | `F230` | A `portfolio.md` with a front matter key the product does not know | It is saved, then published | The stored bytes and the served `page.md` bytes both compare equal to the input | `T675` | `12-screens/S30.md`.
`A676` | `F230` | A publish of `portfolio.md` | It completes | Zero build jobs are recorded, and the stored object for the page is the file itself | `T676` | `12-screens/S30.md`.
`A677` | `F230` | A `portfolio.md` with no `handle` key | Publish is pressed | A refusal is returned and zero objects are written | `T677` | `12-screens/S30.md`.
`A678` | `F230` | An existing `portfolio.md` | A template is applied | A refusal is returned and the file's bytes are unchanged | `T678` | `12-screens/S30.md`.
`A679` | `F219` | A Free and a Pro portfolio | Both render, then the Pro entitlement is changed in the store | The made-with line is present on Free and absent on Pro, and it follows the stored entitlement on the next request | `T679` | `12-screens/S30.md`.
`A680` | `F231` | A document with an open conflict | It is opened from the tree | The conflict screen renders and the editor root element is absent | `T680` | `12-screens/S31.md`.
`A681` | `F233` | A proposal of three spans | One span is accepted | Only that span's range differs from the previous bytes, and the other two items are still queued | `T681` | `12-screens/S31.md`.
`A682` | `F232` | A conflict, resolved once by each of the four resolutions on fresh fixtures | History is read after each | The version not chosen is present in history each time, with bytes equal to its side | `T682` | `12-screens/S31.md`.
`A683` | `F232` | A conflict with one side unreadable | The screen renders | Zero keep controls render | `T683` | `12-screens/S31.md`.
`A684` | `F232` | Every provider made to fail | Keep left, keep right and keep both are each used on fresh fixtures | Each completes, and the ledger is unchanged | `T684` | `12-screens/S31.md`.
`A685` | `F280` | The full test suite | It runs | The merges-attempted counter reads zero at the end | `T685` | `12-screens/S31.md`.
`A686` | `F161` | An AI call made to fail in each way: refusal, timeout, error chunk, chain exhausted | It returns | The document bytes compare equal to the bytes before the call | `T686` | `12-screens/S32.md`.
`A687` | `F159`, `F161` | A chain of four providers, each made to fail differently | The screen renders | Four rows are listed in chain order, each with its own reason string | `T687` | `12-screens/S32.md`.
`A688` | `F159` | A recorded Cloudflare `3036` response, and a recorded `3040` | Each is shown | The first renders the exhausted copy id with a 00:00 UTC reset, the second the transient copy id, and the two strings differ. **Red proof against a recorded response** | `T688` | `12-screens/S32.md`.
`A689` | `F159` | A recorded exhaustion from a provider whose response carries no reset time, Cerebras among them | It is shown | No reset time element renders for that row | `T689` | `12-screens/S32.md`.
`A690` | `F159` | A provider marked exhausted with a stated reset | Retry is pressed ten times before the reset | Zero requests reach that provider | `T690` | `12-screens/S32.md`.
`A691` | `F194` | Idea mode with the chain down, and separately with the account over its allowance | The idea continues | The standard question set renders, zero model calls are made, and the ledger is unchanged | `T691` | `12-screens/S32.md`.
`A692` | `F159` | A recorded stream answering 200, then an error chunk with no content | It is consumed | The call is recorded as failed, and none of its partial text reaches the document or the suggestion | `T692` | `12-screens/S32.md`.
`A693` | `F260` | An account over its cap, with the chain healthy | An AI edit is attempted | S33 renders and S32 does not | `T693` | `12-screens/S32.md`.
`A694` | `F161`, `F248` | The network disabled | An AI edit is attempted | The offline line renders, and the provider list element is absent | `T694` | `12-screens/S32.md`.
`A695` | `F260` | An account over its published-pages cap with three live pages | Each page is requested | All three answer 200 | `T695` | `12-screens/S33.md`.
`A696` | `F266`, `F260` | Accounts holding more than a new, lower limit | The limit is lowered and saved | Each affected account renders S33 on its next request, and its document count and bytes are unchanged. **Red proof: it must fail against a build that trims to the cap** | `T696` | `12-screens/S35.md`.
`A697` | `F260`, `F161` | An account over its cap, with the chain down | An AI edit is attempted | **Not yet checkable:** S32 `A328` says an over-cap account never sees S32, and S33 `A337` says it does when the chain is down. The founders must pick the precedence; until then either result can be called a pass. Proposed assertion: S32 renders and S33 does not | `T697` | `12-screens/S33.md`.
`A698` | `F259`, `F260` | A monthly cap and a standing cap, each exceeded | S33 renders for each | The monthly one shows a reset date element and the standing one shows none | `T698` | `12-screens/S33.md`.
`A699` | `F207` | An account with no ideas | The ideas section is opened | Zero ideas and zero writes are recorded | `T699` | `12-screens/S34.md`.
`A700` | `F207` | The example kit | It is opened | Fifteen files are listed, and the ledger is unchanged | `T700` | `12-screens/S34.md`.
`A701` | `F189` | A Free account | The depth control is opened | Medium and High are listed, each carrying the Pro marker | `T701` | `12-screens/S34.md`.
`A702` | `F189` | The empty state before submit | The depth is changed through all three values | Zero ideas and zero writes are recorded | `T702` | `12-screens/S34.md`.
`A703` | `F207` | An account over its blueprint allowance | The empty state renders and the example is opened | Every section of the empty state renders, and the example lists fifteen files | `T703` | `12-screens/S34.md`.
`A704` | `F207` | An account with no ideas | The section renders | Zero list elements render, and the empty-state element has non-empty text | `T704` | `12-screens/S34.md`.
`A705` | `F267` | A lowered limit whose impact names K accounts | It is saved | Exactly those K accounts move over the cap, compared by account id | `T705` | `12-screens/S35.md`.
`A706` | `F266` | A row read by one founder, then changed by another | The first founder saves | The save is refused, the refusal names the row, and the row keeps the second founder's value | `T706` | `12-screens/S35.md`.
`A707` | `F268`, `F275` | A configuration save in S35, S36 or S37 whose audit write is made to fail, and one whose setting write is made to fail | Each is saved | In both cases neither the setting row nor an audit row is written | `T707` | `12-screens/S35.md`.
`A708` | `F271`, `F273` | A provider whose stored terms record permits training on inputs | It is enabled, through the screen and through a direct write | Both are refused, and the refusal names the clause. **Red proof against a real clause quoted in `docs/mvp0/PRODUCT-PLAN.md` section 14** | `T708` | `12-screens/S36.md`.
`A709` | `F270` | A routing cell | Its cost is read | It equals the token shape multiplied by the stored model price, and the component source holds no cost literal | `T709` | `12-screens/S36.md`.
`A710` | `F269` | A provider that reports no remaining pool | Its row renders | The pool cell equals the ledger's count and carries the copy id saying it is ours | `T710` | `12-screens/S36.md`.
`A711` | `F269` | Fourteen model rows at 1,440 px | The screen renders | Every row's text is untruncated, with `scrollWidth` equal to `clientWidth` on every cell and on the page | `T711` | `12-screens/S36.md`.
`A712` | `F269` | A chain with one enabled provider | It is disabled and saved | The save is refused and the provider stays enabled | `T712` | `12-screens/S36.md`.
`A713` | `F269` | A chain order shown on the screen | Every provider is made to fail and the router's attempts are logged | The logged order equals the shown order | `T713` | `12-screens/S36.md`.
`A714` | `F269`, `F161` | A provider disabled on S36 | S32 renders after a failed call | That provider appears in no row | `T714` | `12-screens/S36.md`.
`A715` | `F272` | The repository at any commit | Feature availability checks are searched | Every one reads the flag through the one flag gate, and zero components decide availability from a constant | `T715` | `12-screens/S37.md`.
`A716` | `F273` | A locked flag | A write is attempted through the screen and through a direct server call | Both are refused, and the writer's accepted id list does not contain the locked id | `T716` | `12-screens/S37.md`.
`A717` | `F272` | A flag turned off | Each screen it governs is requested | Each answers 200 with the explanation copy id, and none answers 404 | `T717` | `12-screens/S37.md`.
`A718` | `F273` | The training row and the sign-in page | Their promise text is read | Both render the same copy id | `T718` | `12-screens/S37.md`.
`A719` | `F272` | A running live session | Live editing is turned off | The session stays connected and its next edit saves | `T719` | `12-screens/S37.md`.
`A720` | `F273` | The locked block made unreadable | The screen renders | The locked block element is absent | `T720` | `12-screens/S37.md`.
`A721` | `F274` | An exception grant with no expiry | It is saved | The save is refused and no grant is stored | `T721` | `12-screens/S38.md`.
`A722` | `F274` | The accounts screen | Every control is used | Zero writes reach a plan row, counted at the configuration adapter | `T722` | `12-screens/S38.md`.
`A723` | `F258` | The accounts screen | Its meters and ledger render | Every figure equals the usage ledger's value, and the component source contains no summing code over ledger rows | `T723` | `12-screens/S38.md`.
`A724` | `F275` | The audit log | An update and a delete are attempted on a row through the panel and through a direct server call | All four are refused and the row is unchanged | `T724` | `12-screens/S38.md`.
`A725` | `F274` | A search string matching no account exactly | It is submitted | Zero results render | `T725` | `12-screens/S38.md`.
`A726` | `F233` | A conflict whose AI proposal is one pending change queue item, previewed on S31 | Accept AI suggestion is pressed by the owner | The file's new bytes equal the previewed bytes, exactly one queue item moves to accepted with that person as the accepter, and no other item changes | `T726` | `12-screens/S31.md`.
`A727` | `F233` | A conflict before Let AI decide, and separately a proposal that arrived only in part | Accept AI suggestion is pressed | The control is disabled with its reason shown, and zero bytes are written | `T727` | `12-screens/S31.md`.
`A728` | `F233` | A previewed proposal, then the file or the item changed before the accept | Accept AI suggestion is pressed | The accept is refused, zero bytes are written, and the preview is redrawn | `T728` | `12-screens/S31.md`.

## 12b. Criteria for the features that had none, 18 September 2026

`10-FEATURE-REGISTER.md` listed 43 features whose `acceptance` cell read `none yet`. Section 12a
already covered 21 of them and the register had not caught up. **The other 22 get their criteria
here.** The working list is `tools/feature-criteria-gap.md`.

- **New ids start at `A729`**, after the highest id in this file. Nothing was renumbered.
- **The feature column holds register ids**, as in section 12a.
- **The test column is `T` plus the same three digits**, proposed and not written, as in section 12a.
- **A `then` marked `Not yet checkable`** says what is missing and what the assertion becomes once it
  is there.
- **Where the plan, a screen and the register disagree, the row says so** rather than picking.

id | feature | given | when | then | test | spec
`A729` | `F110` | A document shared with one principal for each of the eight roles in the plan's section 19 table | Each principal calls the server action behind each of the table's eleven columns once | All 88 allow or refuse results equal the table's cells, compared against a fixture generated from the table, where `own copy` and `never` are their own expected values | `T729` | `docs/mvp0/PRODUCT-PLAN.md` section 19.
`A730` | `F110` | A pending change-queue item proposed by an agent token | The same token calls apply on that item | The call is refused, the document bytes compare equal before and after, and the item's state is still pending | `T730` | `docs/mvp0/PRODUCT-PLAN.md` section 19.
`A731` | `F110` | A Pro owner's document shared at edit with an account on Free | The collaborator triggers a limit check on that document | The limit set the resolver returns carries the owner's account id and not the collaborator's | `T731` | `docs/mvp0/PRODUCT-PLAN.md` section 19.
`A732` | `F110` | A document with one owner and an agent token that can propose on it | The token requests an ownership transfer | The request is refused and the document's owner field is unchanged | `T732` | `docs/mvp0/PRODUCT-PLAN.md` section 19.
`A733` | `F110` | A project of three documents, and a fourth document in another project | The project is shared at edit with one account, then the fourth document alone is shared at read with the same account | The role resolver returns editor for that account on each of the three and read on the fourth, and the second share changed none of the first three results | `T733` | `docs/mvp0/PRODUCT-PLAN.md` section 19.
`A734` | `F125` | A vault where note B names note A's title in plain text, note C links `[[A]]`, and note D does not name A | `/api/vault/unlinked` is requested for A's title and path | The response lists exactly one path, B's, and lists neither A, C nor D | `T734` | `12-screens/S04.md`.
`A735` | `F125` | An open note with the unlinked mentions section collapsed | The right pane renders and stays collapsed | The network log holds zero requests to `/api/vault/unlinked`, and one after the section is expanded | `T735` | `12-screens/S04.md`.
`A736` | `F126` | One document tagged `draft` in its front matter `tags:` list and again as `#draft` in its body, and a second tagged only `#draft` in its body | The tags panel renders | `draft` appears exactly once, with a count of 2 | `T736` | `12-screens/S04.md`.
`A737` | `F126` | The same two documents | The tag `draft` is renamed to `review` | Zero tag tokens read `draft`, and in each document the bytes outside the changed tag tokens compare equal before and after | `T737` | `12-screens/S04.md`.
`A738` | `F126` | Tag `wip` on three documents and tag `draft` on two, one document carrying both | `wip` is merged into `draft` | Zero documents carry `wip`, and the documents tagged `draft` are exactly the union of the two sets before the merge | `T738` | `12-screens/S04.md`.
`A739` | `F127` | One account signed in on two browsers, with no bookmarks | A document is bookmarked in the first browser and the second is reloaded | The second browser's bookmarks list contains that document's path. **Red proof: today's build fails it**, because `src/modules/editor/presentation/bookmarks.ts` keeps the list in `localStorage` under `sgnk-md-bookmarks`, per browser and not per account as the register says | `T739` | `12-screens/S04.md`.
`A740` | `F127` | A bookmarked document | Its bookmark is toggled again | The list no longer contains its path, and no path appears in the list more than once | `T740` | `12-screens/S04.md`.
`A741` | `F135` | The template text `{{title}} {{date}} {{date:YYYY/MM}}`, a title of `Plan`, and a fixed local time of 2026-09-18 10:05 | `substituteTemplateVars` runs | The output equals `Plan 2026-09-18 2026/09` | `T741` | `src/modules/vault/presentation/template-vars.ts`.
`A742` | `F135` | The template text `{{title}}` and a title containing `$&` and `$1` | `substituteTemplateVars` runs | The output equals the title, byte for byte | `T742` | `src/modules/vault/presentation/template-vars.ts`.
`A743` | `F135` | A template file and a fixed time and title | A new document is created from that template | The new file's bytes equal `substituteTemplateVars` applied to the template's bytes, and the template file's bytes compare equal before and after | `T743` | `12-screens/S04.md`.
`A744` | `F136` | A vault with no daily note and a local date of 2026-09-18 | Today's daily note is opened twice | Exactly one file exists at `Daily/2026-09-18.md`, the path `dailyNotePath` returns for that date | `T744` | `src/modules/vault/presentation/daily-notes.ts`.
`A745` | `F136` | An existing daily note whose bytes differ from the daily template | Today's daily note is opened again | Its bytes compare equal before and after | `T745` | `12-screens/S04.md`.
`A746` | `F136` | A vault with daily notes on three dates in September 2026 | The month panel renders September 2026 | It renders exactly 30 day cells, and exactly three carry the has-a-note marker, on those three dates | `T746` | `12-screens/S04.md`.
`A747` | `F139` | An open document and a PNG on the clipboard | The image is pasted | Exactly one new image file exists in the document's folder, the inserted link resolves to it, and its size in bytes is at or under the pasted image's | `T747` | `12-screens/S04.md`.
`A748` | `F139` | A document holding one image | The image is resized to 320 px wide | The only bytes that change are a `{width=320}` attribute directly after that image, the carrier the plan's section 7 names for a resized image | `T748` | `docs/mvp0/PRODUCT-PLAN.md` section 7.
`A749` | `F140` | The spellcheck setting on, then off | The editor surface renders after each change | The editable element's `spellcheck` attribute reads `true`, then `false` | `T749` | `12-screens/S28.md`.
`A750` | `F140` | The Editor section of settings | It renders | The spellcheck row's help text equals the string at `K.s28.editor.spellcheck`, and with spellcheck on, typing 100 characters makes zero requests from the page's own code | `T750` | `12-screens/S28.md`.
`A751` | `F142` | A document holding a `[toc]` line and five headings at levels 2 and 3 | It renders in Reading mode | The rendered table of contents has exactly five entries in document order, each linking to an id that exists on its heading, and the file's bytes compare equal before and after | `T751` | `66-FORMAT-SPECIFICATIONS.md`.
`A752` | `F142` | The same document | It is exported as markdown | The export contains the `[toc]` line byte for byte, which is its degradation in a plain reader | `T752` | `66-FORMAT-SPECIFICATIONS.md`.
`A753` | `F143` | A document with one reference `[^1]` and its definition `[^1]: a note` | It renders in Reading mode | Exactly one footnote reference and one footnote list item render, and each links to an id the other carries | `T753` | `12-screens/S04.md`.
`A754` | `F143` | The same document | It is exported as HTML and as Word | The HTML contains `a note` exactly once, and the Word file's `word/footnotes.xml` contains it exactly once | `T754` | `12-screens/S04.md`.
`A755` | `F143` | A reference `[^2]` with no definition | It renders | No footnote list is rendered, the reference shows as its literal text, and the file's bytes compare equal before and after | `T755` | `12-screens/S04.md`.
`A756` | `F144` | A document and a caret at byte offset `n` | An emoji is chosen from the picker | The file's bytes equal the input's first `n` bytes, then the emoji's UTF-8 bytes, then the rest of the input | `T756` | `docs/mvp0/PRODUCT-PLAN.md` section 7.
`A757` | `F144` | The emoji picker | It opens and one emoji is chosen | The network log holds zero requests for an image or a font, since the plan's section 7 carries an emoji as Unicode text | `T757` | `docs/mvp0/PRODUCT-PLAN.md` section 7.
`A758` | `F145` | A document with one external link to a URL on a local test server | The preview card is shown twice, then again after a reload | The test server records exactly one request for that URL | `T758` | `12-screens/S04.md`.
`A759` | `F145` | A document whose external link has rendered a preview card | The file is read from disk | Its bytes compare equal to the bytes before the preview was fetched | `T759` | `12-screens/S04.md`.
`A760` | `F145` | An external link whose URL answers 404, and a second whose URL never answers | Previews are attempted for both | Zero preview card elements render, both links render as ordinary links, and the file's bytes compare equal before and after | `T760` | `12-screens/S04.md`.
`A761` | `F146` | A fixture PNG showing a known string, and a fixture PDF carrying that string only as a scanned image | The string is searched for once OCR has finished | Both files appear in the results, and the network log holds zero requests that carry image bytes, PDF bytes or the extracted text | `T761` | `docs/mvp0/PRODUCT-PLAN.md` section 6.
`A762` | `F146` | The same two fixtures | OCR finishes | Both files' bytes compare equal before and after, and no document in the vault changed | `T762` | `docs/mvp0/PRODUCT-PLAN.md` section 6.
`A763` | `F147` | A document, a caret at byte offset `n`, and a DOI answered by a recorded Crossref response | The DOI lookup in the slash menu completes | Exactly one citation in Pandoc's `[@key]` form is inserted at `n`, and every byte outside the insertion compares equal | `T763` | `docs/mvp0/PRODUCT-PLAN.md` section 7.
`A764` | `F147` | A DOI the recorded provider answers with 404 | The lookup runs | Zero bytes change in the document, and the outgoing request carries the DOI and no other text from the document | `T764` | `docs/mvp0/PRODUCT-PLAN.md` section 11.
`A765` | `F147` | A completed DOI lookup | The formatted reference is looked for | **Not yet checkable:** the register says the lookup writes a formatted reference, and the plan's section 7 names only Pandoc's citation syntax as the carrier. Nothing says where the reference entry lives: front matter, a bibliography file beside the document, or a references section. Once `66-FORMAT-SPECIFICATIONS.md` names the home, the assertion is that exactly one entry with the key exists there | `T765` | `66-FORMAT-SPECIFICATIONS.md`.
`A766` | `F164` | `flag.byok` false, then true with `provider.byok.storage` reporting `encrypted` | The AI section of settings renders each time | It holds zero key input elements, then exactly one | `T766` | `28-CONFIGURATION-PANEL-SPEC.md`.
`A767` | `F164` | A key saved through settings | Settings are reloaded, and the account's files and an account export are read | The key string occurs zero times in the DOM, in any response body sent to the browser, in any file the account's repository or storage prefix holds, and in the export | `T767` | `27-MODEL-ROUTING-SPEC.md` section 7.2.
`A768` | `F164` | `provider.byok.storage` reporting anything other than `encrypted` | `flag.byok` is turned on in the panel | The write is refused and the stored flag still reads false | `T768` | `28-CONFIGURATION-PANEL-SPEC.md`.
`A769` | `F164` | A saved key and a recording stub in place of the provider | One AI edit runs | The stub records exactly one call authorised with the person's key, and the account's AI edit allowance reads the same before and after | `T769` | `27-MODEL-ROUTING-SPEC.md` section 7.2.
`A770` | `F164` | A fresh configuration | `flag.byok` is read | **Not yet checkable:** `28-CONFIGURATION-PANEL-SPEC.md` gives the default as false, and the S37 drawing shows it on. Either value passes one source and fails the other. Once the founders pick, the assertion is that the stored default equals their value | `T770` | `12-screens/S37.md`.
`A771` | `F173` | An account with credits left and an instruction file open on S11 | The panel renders | The Tidy control's accessible name contains its cost in credits, and zero model calls have been made | `T771` | `12-screens/S11.md`.
`A772` | `F173` | An account with zero credits left | Tidy is pressed | The control carries `disabled` with its reason shown, zero model calls are made, and `E071` is the reason given | `T772` | `12-screens/S11.md`.
`A773` | `F173` | An account with credits left | Tidy runs to completion | The ledger holds exactly one debit of one credit for it, and exactly one change-queue item exists for the file | `T773` | `12-screens/S11.md`.
`A774` | `F173` | A viewer or commenter on the document | S11 renders | The Tidy control is absent from the DOM | `T774` | `12-screens/S11.md`.
`A775` | `F173` | An account with credits left and every provider in the chain stubbed to refuse | Tidy is pressed | `E080` is shown, the ledger holds zero debits for it, and zero change-queue items are created | `T775` | `12-screens/S11.md`.
`A776` | `F179` | A document holding one `fm-draw` block that points at a stored drawing | The document is exported as markdown | The block survives as a fenced code block whose info string and body compare equal to the source's, which is its degradation in a plain reader | `T776` | `66-FORMAT-SPECIFICATIONS.md`.
`A777` | `F179` | The same document | The drawing is edited on its own surface and saved | The markdown file's bytes compare equal before and after, and exactly one other file, the stored drawing, changes | `T777` | `12-screens/S08.md`.
`A778` | `F179` | A saved drawing | Its stored file is validated | **Not yet checkable:** the register says the drawing is saved as JSON Canvas 1.0, while S08 and the plan's section 20 name an `fm-draw` block pointing at an Excalidraw drawing and give no file format. Once `66-FORMAT-SPECIFICATIONS.md` names one, the assertion is that the stored file validates against that schema | `T778` | `66-FORMAT-SPECIFICATIONS.md`.
`A779` | `F199` | A fresh deployment | `TemplateReader.listIndustry()` is called | It returns exactly seven descriptors, one for each industry the plan's section 9 names, and each carries a non-empty question bank, comparables list and sources list | `T779` | `docs/mvp0/PRODUCT-PLAN.md` section 9.
`A780` | `F199` | An idea in the composer and the seven shipped templates | Generate one for my industry completes | Exactly one new template exists, it carries the generated marker, and the seven shipped templates' bytes compare equal before and after | `T780` | `12-screens/S12.md`.
`A781` | `F199` | Every provider in the chain stubbed to refuse | Generate one for my industry is pressed | `E080` is shown and zero templates are written | `T781` | `12-screens/S12.md`.
`A782` | `F251` | The desktop build watching a folder that holds a document with an accepted version | Another process rewrites that file on disk | Exactly one change-queue item with source `agent` exists for it, and the document's latest accepted version is unchanged until the owner accepts | `T782` | `12-screens/S25.md`.
`A783` | `F251` | The same watched folder | Another process writes an unparseable file into it, then edits a second, valid file | `E509` names the first file and its queue item is held, and the second file's change still enters the queue | `T783` | `12-screens/S25.md`.
`A784` | `F251` | A very large watched folder | Watching starts | **Not yet checkable:** S25 narrows watching to the folders in the tree when the folder is very large, and no threshold is written anywhere. Once a file or byte count is set, the assertion is that above it the watched set equals the tree's folders and the notice renders | `T784` | `12-screens/S25.md`.
`A785` | `F256` | The desktop app installed | The operating system's handler for the app's scheme is queried | **Not yet checkable:** no scheme is chosen, which is `D41` in S18. Once one is, the assertion is that the query returns the frontmatter app on each signed platform | `T785` | `12-screens/S18.md`.
`A786` | `F256` | A published page in a browser where no handler is detected | The page loads | The open-in bar holds zero app options and exactly one web option, and zero custom-scheme navigations happen before the load event | `T786` | `12-screens/S18.md`.
`A787` | `F256` | A registered handler stubbed never to answer | The app option on the bar is pressed | `E803` is logged and the browser ends on the page's web route in the app | `T787` | `12-screens/S18.md`.
`A788` | `F264` | A Pro account | The 50-edit top-up is bought and the payment webhook lands | The edits meter's remaining value rises by exactly 50, the ledger holds one grant of 50, and the amount charged equals `price.topup.edits.50` | `T788` | `53-PRICING-AND-ENTITLEMENTS.md`.
`A789` | `F264` | A Pro account | The 3-blueprint top-up is bought and the payment webhook lands | The blueprints meter's remaining value rises by exactly 3, the ledger holds one grant of 3, and the amount charged equals `price.topup.blueprints.3` | `T789` | `53-PRICING-AND-ENTITLEMENTS.md`.
`A790` | `F264` | A top-up whose checkout returns but whose webhook never lands | The plan route is read | Both meters and the ledger read the same as before the checkout | `T790` | `12-screens/S29.md`.
`A791` | `F264` | An account on Free | `SubscriptionWriter.startCheckout` is called for a top-up through a direct server call | The call is refused, no hosted checkout URL is returned, and the ledger is unchanged, since the plan's section 13 puts top-ups on Pro | `T791` | `docs/mvp0/PRODUCT-PLAN.md` section 13.
`A792` | `F264` | The payment provider stubbed to fail | A top-up is clicked | `E754` is shown, zero charges are recorded, and both meters are unchanged | `T792` | `12-screens/S29.md`.
`A793` | `F265` | The plan route at 1,440 px | It renders | Exactly two plan cards render, Free and Pro, and the coming strip renders the strings at `K.s29.team` and `K.s29.enterprise` | `T793` | `12-screens/S29.md`.
`A794` | `F265` | The same route | The coming strip's DOM is searched | It holds zero buttons, zero form inputs and zero links to a checkout, and `startCheckout` refuses any plan id other than Pro and the two top-ups | `T794` | `12-screens/S29.md`.
`A795` | `F265` | The configuration panel's `price.plan.pro.monthly`, `price.plan.pro.annual` and both `price.topup` values changed to test values | The plan route renders | Every price on the page equals the new values, and the route's component source holds no rupee amount as a literal | `T795` | `28-CONFIGURATION-PANEL-SPEC.md`.
`A796` | `F265` | The plan route at 390 px | It renders | The coming strip is a single column, and `scrollWidth` is at or under `clientWidth` on the scrolling element | `T796` | `12-screens/S29.md`.

---

## 12c. The trial and its lock, 18 September 2026

D08 `[Z]`: a one-month Pro trial for new accounts, reminders at 15, 10, 5, 3 and 2 days before the
end, and if unpaid, editing, copy and export lock while reading stays. The spec is
`53-PRICING-AND-ENTITLEMENTS.md` sections 5.1 and 5.5, and the events are
`55-MEASUREMENT-AND-EVENTS.md` section 6.11a.

- **New ids start at `A797`**, after the highest id in this file, `A796`. Nothing was renumbered.
- **The feature column is the slug `F-trial`**, per section 0.2, because `10-FEATURE-REGISTER.md`
  has no trial feature yet. That file owns the number, and adding it is its call.
- **The test column is `T` plus the same three digits**, proposed and not written.
- **Every day count is read from configuration**, `trial.length.days` and `trial.reminders.days`.
  The defaults 30 and 15, 10, 5, 3, 2 appear only where a criterion pins the defaults.

id | feature | given | when | then | test | spec
`A797` | `F-trial` | No account for a Google `sub` or a GitHub user id, and `trial.length.days` at its default | The first sign-in creates the account | `trial.started_at` is set, `trial.ends_at` equals it plus `trial.length.days` times 86,400 seconds, exactly one `trial.started` event exists, and `limitsFor` returns the `plan.pro` row | `T797` | `53-PRICING-AND-ENTITLEMENTS.md` section 5.1.
`A798` | `F-trial` | An account whose trial has started, converted or lapsed | The same `sub` or GitHub id signs in again, and the account is deleted and re-created with the same id | `trial.started_at` is unchanged, or refused on re-creation, and the count of `trial.started` events for that id is still 1 | `T798` | `53` section 5.1.1.
`A799` | `F-trial` | An account with a running trial | `trial.length.days` is lowered on the panel | That account's stored `trial.ends_at` compares equal before and after the save | `T799` | `28-CONFIGURATION-PANEL-SPEC.md` section 4.2.
`A800` | `F-trial` | An account with a running trial, the default reminder list, and a test clock | The clock advances one day at a time to `trial.ends_at`, running the reminder job twice each day | Exactly 5 `trial.reminder.sent` events exist, with `days_left` equal to 15, 10, 5, 3 and 2 in that order, and the email stub received exactly 5 messages | `T800` | `53` section 5.1.2.
`A801` | `F-trial` | The same, with the job not run on the day `days_left` is 3 | The clock reaches `trial.ends_at` | No event with `days_left` 3 exists, and one with `days_left` 2 exists | `T801` | `53` section 5.1.2.
`A802` | `F-trial` | A trial account that paid with 10 days left | The clock advances to `trial.ends_at` | Zero `trial.reminder.sent` events are dated after the `trial.converted` event, and no `trial.expired` or `trial.locked` event exists | `T802` | `53` section 5.1.2.
`A803` | `F-trial` | A trial account with no payment | The clock passes `trial.ends_at` and the job runs | Exactly one `trial.expired` and one `trial.locked` exist, and `limitsFor` returns `access.docs.read` true and `access.docs.edit`, `access.docs.copy`, `access.export` and `access.ai` false | `T803` | `53` section 5.5.
`A804` | `F-trial` | A locked account and one of its documents | An edit is submitted through the web editor, the API and an agent token | Each is refused with `K.trial.locked.edit` or its error row, the document's bytes compare equal before and after, and the change queue holds no new item | `T804` | `53` section 5.5.
`A805` | `F-trial` | A locked account with a document open and the clipboard holding a known string | The copy command runs | The clipboard still holds the known string, and the rendered text equals `K.trial.locked.copy` | `T805` | `53` section 5.5.
`A806` | `F-trial` | A locked account | Every export route, the history `.zip` and the account export are called | Each answers 403 with the string at `K.trial.locked.export`, and no response body contains any byte sequence of 32 or more bytes from the account's documents | `T806` | `53` section 5.5.
`A807` | `F-trial` | A locked account with one shared link and one published page | Every document is opened, the link is fetched signed out, and the page is fetched | Every document renders, and the link and the page each answer 200 | `T807` | `53` section 5.5.
`A808` | `F-trial` | A locked account with a GitHub mirror and N documents | The lock applies and 7 days pass on the test clock | The document count is N, every document's hash is unchanged, the GitHub App installation token is not revoked, and the mirror adapter records zero writes and zero pulls in that window | `T808` | `53` section 5.5, the proposed mirror rule.
`A809` | `F-trial` | A locked account | A Pro payment completes | `trial.converted` and `trial.unlocked` each fire once, `limitsFor` returns the `plan.pro` row on the next read, and an edit then writes | `T809` | `53` section 5.5.
`A810` | `F-trial` | A paying Pro account with no trial state, and its debit stubbed to fail | The clock walks the dunning ladder past day 14 | `access.docs.edit`, `access.docs.copy` and `access.export` are true at every day, and no `trial.locked` event exists | `T810` | `53` section 5.2.
`A811` | `F-trial` | A trial account whose `trial.ends_at` is known, and a client clock set 3 days wrong | The plan route renders | The date inside `K.trial.countdown` equals the stored `trial.ends_at` date, not the client's | `T811` | `12-screens/S29.md`.
`A812` | `F-trial` | Two locked accounts, one with a Drive mirror and one with none | The trial-locked state renders for each | `K.trial.locked.mirror` renders exactly once for the first and zero times for the second, and the cap exits `K.s33.do.delete` and `K.s33.do.desktop` render zero times for both | `T812` | `12-screens/S33.md`.
`A813` | `F-trial` | The repository and this pack at any commit | `grep -rn "readable and exportable" src` runs, and the standing-promise rows in section 1 of `16-COPY-DECK.md` are read | The grep returns zero lines, and no standing-promise string contains the word export without also containing "trial" | `T813` | `16-COPY-DECK.md` section 1.
`A814` | `F-trial` | The panel with `trial.length.days` at 30 | `trial.reminders.days` is saved as [2, 31, 5, 5] | The save is refused server side, naming 31 as over the length and 5 as repeated, and a save of [2, 15, 5] is stored as [15, 5, 2] | `T814` | `28-CONFIGURATION-PANEL-SPEC.md` section 4.2.

**`A804`, `A806` and `A808` need a red proof** before they count, per `AGENTS.md` rule 1. Each
describes a path where the tempting implementation is to hide a control in the interface and leave
the route open, and a test that only clicks the interface would pass against that defect.

## 12d. Sheets, boards, one platform, voice and PDF, 19 September 2026

From `68-SHEETS-SPEC.md` to `72-PDF-TO-MARKDOWN-SPEC.md` and screens S39 to S42. The slug each id
replaced is in `tools/new-ids-allocation.md` section 6.

- **New ids start at `A815`**, after the highest id in this file, `A814`. Nothing was renumbered.
- **The feature column is the register's id**, `F281` to `F323`, since those rows now exist.
- **The test column is `T` plus the same three digits**, proposed and not written.
- **`A815` and `A816` need a red proof first.** Each is a defect already in the shipped table
  editor, `TD-024` and `TD-025`, and a test that passes on the unfixed code proves nothing.

id | feature | given | when | then | test | spec
`A815` | `F281` | A document holding a GFM table whose columns are padded with spaces to align. | One cell's value is changed through the grid | A byte diff of the file shows exactly one changed line, and every byte outside that cell's range on that line compares equal. | `T815` | `68-SHEETS-SPEC.md` section 5.1. Red proof first, `TD-024`.
`A816` | `F281` | A table row holding an escaped pipe inside a cell. | The cell to the right of the escaped pipe is edited | The new value lands in that cell, and the cell holding the escaped pipe compares equal before and after. | `T816` | `68-SHEETS-SPEC.md` section 5.2. Red proof first, `TD-025`.
`A817` | `F287` | A sheet whose computed cells disagree with their `col.` formula. | The sheet is opened and closed with no edit | The file's bytes compare equal before and after, and zero splices are recorded. | `T817` | `68-SHEETS-SPEC.md` section 4.6.
`A818` | `F287` | One fixed sheet file and its formulas. | The evaluator runs in two browsers on two machines | The four sets of computed values compare equal, value by value. | `T818` | `68-SHEETS-SPEC.md` section 4.3.
`A819` | `F293` | A table with cells beginning `=`, `+`, `-`, `@`, a tab and a carriage return. | The table is downloaded as CSV | Each of those six cells in the download begins with an apostrophe, and the document's bytes compare equal before and after. | `T819` | `68-SHEETS-SPEC.md` section 6.3.
`A820` | `F281` | A table of N rows, where N is the row count to be recorded in `68-SHEETS-SPEC.md` section 8. | 100 keystrokes are typed into one cell | Keystroke echo is under 250 ms at p95 over the 100 samples. **Not yet checkable**: N has not been measured. | `T820` | `68-SHEETS-SPEC.md` section 8.
`A821` | `F284` | A sheet open in the grid. | It is sorted, filtered, a column resized, and Grid and MD toggled | The file's bytes compare equal before and after each of the four actions. | `T821` | `12-screens/S39.md`.
`A822` | `F281` | S39 rendered at 1,440 px and at 390 px, with a computed cell focused. | The text of the formula bar, the column headers and every control is searched for a cell address such as `B2` | Zero matches of `[A-Z]{1,2}[0-9]+` as a whole word. | `T822` | `12-screens/S39.md`.
`A823` | `F286` | A sheet with a `foot.` sum whose value appears nowhere else in the file. | The sheet renders and the file is read | The summary row renders the value exactly once, and the file contains it zero times. | `T823` | `12-screens/S39.md`.
`A824` | `F287` | A row with Qty 400 and Price 0.8 under `col.Total: "Qty * Price"`. | The column is computed and written | The Total cell's bytes are exactly `320`. | `T824` | `68-SHEETS-SPEC.md` section 4.5.
`A825` | `F297` | A board and a card file in the column Doing. | The card is moved to Review and the move is accepted | A byte diff of the card file shows exactly one changed line, its `status` line, and every other file in the folder compares equal. | `T825` | `69-BOARDS-SPEC.md` section 3.1.
`A826` | `F297` | Two branches of one vault, each moving a different card. | The branches are merged with `git merge` | The merge exits 0 and no card file contains a conflict marker. | `T826` | `69-BOARDS-SPEC.md` section 2.4.
`A827` | `F305` | A card file and an agent token. | The agent proposes a move through the agent server | The card file's bytes compare equal until the item is accepted, and the queue holds exactly one item for that card. | `T827` | `69-BOARDS-SPEC.md` section 5.
`A828` | `F301` | A column whose limit is 3, holding 3 cards. | A fourth card is moved into it and accepted | The card's `status` line is written, the column renders 4 cards, and zero refusal events exist for the move. | `T828` | `69-BOARDS-SPEC.md` section 4.1.
`A829` | `F305` | A board with one pending move from Doing to Review. | The board renders | Each column's count equals the number of card files whose key holds that column, so neither count includes the ghost. | `T829` | `12-screens/S40.md`.
`A830` | `F304` | A board with 15 card files. | Each filter chip and a text search are applied and then cleared | The board file and every card file compare equal before and after. | `T830` | `12-screens/S40.md`.
`A831` | `F296` | Card files whose bodies hold text. | The board renders | Zero characters of any card body appear inside any card face element. | `T831` | `12-screens/S40.md`.
`A832` | `F307` | The repository at the commit before the registry lands and at the commit after. | `npm run corpus` runs at both | Both exit 0 with changed 0, and the snapshot's file count is equal at both. | `T832` | `70-PLATFORM-AND-TYPES.md` section 2.
`A833` | `F308` | A host document embedding a section of a source file. | A word inside the embed is edited | The host's bytes compare equal, and exactly one new queue item exists, on the source file. | `T833` | `70-PLATFORM-AND-TYPES.md` section 4.2, rule 1.
`A834` | `F308` | A published page embedding an unpublished source. | The page is fetched signed out | The response holds the placeholder element and zero byte sequences of 32 or more bytes from the source. | `T834` | `70-PLATFORM-AND-TYPES.md` section 4.2, rules 2 and 3.
`A835` | `F290` | A `.csv` file in a vault mirrored to GitHub. | The mirror runs | The mirrored file's bytes compare equal to R2's head for that file. | `T835` | `70-PLATFORM-AND-TYPES.md` section 9.
`A836` | `F307` | An agent change touching one document and one sheet. | It is proposed | The queue holds exactly two items sharing one change id, and accepting one leaves the other pending. | `T836` | `70-PLATFORM-AND-TYPES.md` section 10.
`A837` | `F313` | A pending voice block and a test clock. | The clock advances 10 minutes with no key pressed | The block is still pending and the file's bytes compare equal. | `T837` | `12-screens/S41.md`.
`A838` | `F315` | A document with a selection and a recognised voice command on it. | The proposal renders | The file's bytes compare equal to their bytes before the command, until Accept. | `T838` | `12-screens/S41.md`.
`A839` | `F313` | A completed voice turn. | IndexedDB, the Cache API and the server's object store are listed | Zero entries have an audio media type. | `T839` | `71-VOICE-SPEC.md` section 13.
`A840` | `F315` | A stored voice command proposal. | Its `intent` field is read | It equals the command's number and contains zero words of the transcript. | `T840` | `71-VOICE-SPEC.md` section 8.3.
`A841` | `F313` | Hold mode and a stubbed microphone sampled every 50 ms. | The voice key goes down and then up | The track's `readyState` is `live` only at samples between key down and key up, and `ended` at every other sample. | `T841` | `71-VOICE-SPEC.md` section 6.2.
`A842` | `F314` | Voice settings with the level set to Low, then Medium, then High. | The tone control renders at each level | It is disabled with its reason text present at Low and Medium, and enabled at High. | `T842` | `71-VOICE-SPEC.md` section 5.2.
`A843` | `F318` | A text PDF and a scanned PDF, with every network request recorded. | Each is converted in the browser | Zero requests carry a body holding 1 KB or more of the PDF's bytes, the shape of `A123`. | `T843` | `72-PDF-TO-MARKDOWN-SPEC.md` section 10.
`A844` | `F322` | A document open with the AI panel. | A PDF is converted there | The document's bytes compare equal, and the queue holds exactly one new item. | `T844` | `72-PDF-TO-MARKDOWN-SPEC.md` section 4.2.
`A845` | `F318` | A scanned PDF whose preview shows low-confidence marks and page labels. | The result is accepted | The written file holds zero page labels and zero marks, and each low-confidence word exactly as read. | `T845` | `72-PDF-TO-MARKDOWN-SPEC.md` section 6.
`A846` | `F321` | A converted PDF. | File into Notes, Discard, or closing the panel is done | A heap snapshot and IndexedDB hold zero copies of the PDF's first 1 KB. | `T846` | `72-PDF-TO-MARKDOWN-SPEC.md` section 10.
`A847` | `F321` | The three frames of S42. | Each renders | Zero text inputs accept a question about the PDF. | `T847` | `72-PDF-TO-MARKDOWN-SPEC.md` section 12.

---

## 13. Counts

Counted from the tables above on 18 September 2026, with these three commands:

```bash
# criteria
grep -oE '^`A[0-9]{3}`' docs/pack/19-ACCEPTANCE-CRITERIA.md | sort -u | wc -l
# distinct real test paths cited
grep -oE '`(test/[^`]+|scripts/[^`]+|docs/mvp0/screens/gen\.mjs:[0-9]+)`' \
  docs/pack/19-ACCEPTANCE-CRITERIA.md | sort -u | wc -l
# criteria whose test column is a real path rather than a T id
grep -E '^`A[0-9]{3}` \|' docs/pack/19-ACCEPTANCE-CRITERIA.md \
  | grep -cE '\| `(test/|scripts/|docs/mvp0/screens/gen)'
```

- **477 criteria**: 129 written first, 226 added in section 12a on 18 September, 3 more for S31 (`A726` to `A728`) the same day, 68 in section 12b (`A729` to `A796`), 18 in section 12c for the trial (`A797` to `A814`), and 33 in section 12d on 19 September (`A815` to `A847`).
- **12 distinct real test paths.**
- **19 criteria carry one.** The remaining 458 carry a `T` id and do not exist. Worked: 477 - 19 = 458.
- **Seven criteria are marked `Not yet checkable`**: one in section 12a.2, because two screens disagree, five in section 12b, each naming what is missing, and `A820` in section 12d, whose row count is unmeasured. Counted with `grep -cE '^.A[0-9]{3}. \|.*Not yet checkable' docs/pack/19-ACCEPTANCE-CRITERIA.md`.

**That ratio is the honest state of the product.** The engine has tests; almost nothing else does.

---

## 14. Limits of this document

- **What was not assessed.** No criterion here was executed. The commands in sections 0.1 and 13 were
  run; the criteria themselves were not.
- **What could not be verified.** Every `T` id. Every `spec` cell reading `none yet` or naming a pack
  section that another owner is writing.
- **What is not established.** Whether one to five criteria per feature is enough. Every register
  feature now has at least one, after section 12b, but a feature with one criterion has a definition
  of done that tests one thing. The thinnest are listed in `tools/feature-criteria-gap.md`.
- **What would falsify it.** The register changing which features a slug reaches, which is its call
  and not this file's. Or the NF-1 and NF-3 fixes landing, which change `A013`, `A016` and `A017` on
  the day they do.
- **Section 12a's ids are now joined for the 43 features that had none.** For the other register
  rows the `acceptance` column still lists the section 0.2 range, not the `A500` onward rows that
  also cite them. That file owns the join.
- **Section 12a's rows were drafted from the screens' own wording**, one screen at a time. Where a
  screen's row carried two facts, the second fact's home is named in `tools/acceptance-reconciliation.md`
  section 4, not added to the screen.
- **One thing a reader must not conclude.** A criterion here is not a passing test. **477 criteria,
  19 of them covered by a real test** is the number that matters, and section 13 gives the commands
  that re-derive it rather than asking anyone to trust this sentence.
- **The rule this file exists to enforce, restated.** If a criterion cannot be checked by a machine,
  the criterion is wrong. Section 10 holds nine that were cut for that reason, and the next person to
  add one should expect the same treatment.
