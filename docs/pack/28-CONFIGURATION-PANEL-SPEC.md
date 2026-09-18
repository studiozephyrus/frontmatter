---
id: 28-CONFIGURATION-PANEL-SPEC
title: The configuration panel
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: e532e32
covers: [config-panel, S35, S36, S37, S38, audit]
---

# 28. The configuration panel

Screens S35 to S38. A surface only a founder sees, which sets what every tier allows, at run time,
without a deploy.

**The invariant, and everything else in this file serves it.**

> **This row is what the product reads, and there is no second copy in the source.**

It is written on S35 itself (`docs/mvp0/SCREENS.md:360`) and it has a mechanical consequence: **a cap
that appears anywhere else in the product is a defect**, and `npm run arch` is the place to catch it,
the same way it already catches a `process.env` read outside `src/config/` and `*/infrastructure/`.

**A note on the line citations in this file.** They were resolved against commit `e532e32` on
2026-09-18. `docs/mvp0/PRODUCT-PLAN.md` is being edited by other writers in the same pass, and its
line numbers moved by twelve while this file was being written. **Confirm a citation by the phrase
rather than by the number** if the two disagree.

---

## 1. Why it exists, and the decision that changed on 18 September

**The founders decided on 17 September that what a tier allows is set from a panel, not from
constants in the source** (`docs/mvp0/PRODUCT-PLAN.md` section 30). That turns most of the open questions
from decisions before the build into settings after it.

**On 18 September the founders reversed a deferral inside one document.** The screen review first
said `Later. Build the product first.` at `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:213`. The founders'
answers at the end of the same document say:

> `The configuration panel ships, with hardcoded defaults.` Everything discussed goes into it,
> carrying our recommended values, and the values are revisited later. It is not deferred.
> (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:307`)

**So `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:307` supersedes `:213` inside one file.** Anyone reading the
change register top to bottom meets the deferral first, and it is no longer true.

**What "with hardcoded defaults" means here, precisely.** Every row below ships with a value already
in it, taken from the plan's recommendation. Nobody has to decide anything for phase A to start. The
row is editable from the first day it exists, and the value in it is a default rather than a
placeholder.

**And it is built in phase A, before the features that read it**, because retrofitting it later means
finding every hard-coded cap in the product.

---

## 2. The eleven questions this panel absorbs

Plan revision 6 moved **eleven of the eighteen founder questions** into the panel
(`docs/mvp0/PRODUCT-PLAN.md` section 30). They stop being decisions the build waits on and become rows
with defaults.

Q | The question | Where it lands | Rows
2 | The Pro price and the routing | S35 and S36 | `price.plan.pro.*`, `routing.*`
3 | The free chain and the sign-in promise | S36 | `provider.*.enabled`, `provider.*.order`. **The promise itself is locked, see section 8**
4 | The legal floor and the grievance officer | S37 | `legal.grievance.name`, `legal.grievance.address`, `legal.grievance.email`
8 | Live editing and the CRDT ban | S37 | `flag.collab.live`
9 | The free caps and the downgrade | S35 | every `limits.*` row
10 | Bring your own key | S37 | `flag.byok`
12 | The age floor | S37 | `legal.age.floor`, **locked once anybody has signed up under it**
15 | The pilot's stop and continue lines | S38 | `pilot.stop.*`, `pilot.continue.*`
16 | Which earlier positions stand | **nowhere** | see the gap below
17 | Whether published pages are indexed | S37 | `flag.publish.indexed`
18 | The fallback sign-in beside Google and GitHub | S37 | `flag.auth.magiclink`

**A gap this file has to name.** The plan lists the absorbed questions as eight bullets at
`docs/mvp0/PRODUCT-PLAN.md` section 29, and those eight bullets cover ten questions, not eleven. The
eleventh is question 16, and it arrives only by subtracting the seven the plan says the panel
**cannot** absorb from the eighteen. **Question 16 is not a settable value.** "Which earlier
positions stand" is a judgement about the record, and no row holds it. So either the count is eleven
and one of them has no home, or the count is ten. **This spec builds ten and says so**, rather than
inventing a row to make the arithmetic work.

**The seven the panel cannot absorb**, each with the plan's own reason
(`docs/mvp0/PRODUCT-PLAN.md` section 29).

Q | Why a setting cannot hold it
6 | Which bytes we hold, and from which phase. It is an architecture, not a value
5 | The one-sentence definition. It decides build order
1 | The pace. It decides which phases are Later
14 | The twenty-kit gate. It is a gate on phase C, not a switch
11 | The desktop's timing. It reorders phases E and F
7 | The name. It changes the domain and every published URL
13 | The accounts that move to the company. It is ownership, not configuration

---

## 3. How to read the row tables

Rows carry the columns below. Where a column would be identical for a whole block it is stated once
above the table rather than repeated, and a column that does not apply is left out.

Column | What it holds
**Key** or **Entitlement id** | The dotted identifier the code reads. Lower case, dotted, never renamed. A rename is a new key plus a migration
**Type** | `int`, `int \| null`, `money.inr`, `bool`, `enum`, `string`, `date`, `list<id>`
**Bounds** | What the panel refuses to save. A bound is enforced server side, never only in the browser
**Default** | The value the row ships with. **Only on rows this file owns.** For an entitlement or a price, the value is in `53-PRICING-AND-ENTITLEMENTS.md`
**Who** | Who may change it. `founder` for every row today, because super admin is the only role that reaches this panel
**Read by** | The exact caller. Not "the app", but the function or the screen
**On lowering** | What happens to an account already outside the new value

**There is no Free column and no Pro column in this file.** Two files carrying the same pair of
numbers is the defect the invariant exists to prevent, and it is the field-name mismatch class this
repository has been burned by before.

**`null` means unlimited, everywhere.** It is not zero, it is not a very large number, and every
comparison in `limitsFor` treats it as "no check". A row whose type is `int` and not `int | null`
cannot be set to unlimited, and that is deliberate for the rows where unlimited would be a defect.

---

## 4. S35. Plans and limits

**The values are not in this file, and that is deliberate.**
`53-PRICING-AND-ENTITLEMENTS.md` is the home for every entitlement id, every cap and every price, and
it says so in its own words: `An entitlement id and its cap live here and nowhere else.` Its section 7
is explicit that any other file in this pack may not hold a cap.

**So this section specifies the panel's behaviour over those rows**: the type, the bounds it refuses
to save outside, who may change it, and what happens to an account the change puts over the line. For
the value of any row, follow the link.

**Every limit in one table, Free against Pro, each cell editable.** Who: `founder`. Read by:
`limitsFor(account)` and nothing else.

### 4.1 Quantities

Ids are `53-PRICING-AND-ENTITLEMENTS.md` section 3.1. Nothing here repeats a number from it.

Entitlement id | Type | Bounds the panel enforces | On lowering
`limits.docs.cloud` | `int \| null` | 1 to 100,000, or null | S33 over the cap. Every document stays readable and exportable. Nothing new is created until under the cap
`limits.pages.published` | `int \| null` | 0 to 10,000, or null | Existing pages keep serving. No new page is published. **A published page is never taken dark by a limit change**, because a stranger's link would break
`limits.collab.live` | `int \| null` | 0 to 100, or null | A session already open finishes. No new session starts over the cap
`limits.history.days` | `int` | 0 to 3,650 | Versions outside the new window are pruned to the head **after a 30-day grace**, never on save. See 4.5
`limits.uploads.file` | `int`, bytes | 1 byte to 100 MB. See below | Existing files stay. A new upload over the new size is refused with the size named
`limits.uploads.total` | `int \| null`, bytes | 1 byte to 1 TB, or null | S33. Nothing is deleted
`limits.ai.edits` | `int \| null` | 0 to 100,000, or null | The bucket's capacity falls. **Credits already spent are never clawed back**
`limits.ai.blueprints` | `int \| null` | 0 to 10,000, or null | The same
`limits.blueprint.rewrites` | `int \| null` | 0 to 50, or null | Applies to the next blueprint, never to one in flight
`limits.github.repos` | `int \| null` | 0 to 1,000, or null | Existing connections keep working. No new repository is connected
`limits.github.pushes` | `int \| null` | 0 to 100,000, or null | Bucket capacity falls. Pushes already made stand

**Capabilities are the `features.*` ids** of `53-PRICING-AND-ENTITLEMENTS.md` section 3.2, all of
type `bool`. Their panel behaviour is uniform: turning one off leaves what exists working and stops
anything new. `features.portfolio` goes private rather than being deleted, and
`features.branding.remove` returns the Made with line to pages on a downgrade.

**Two rows the panel treats specially.**

- **`limits.uploads.file` may not be set above 100 MB**, because
  `docs/mvp0/PRODUCT-PLAN.md` section 15 records that Workers cap a request body at 100 MB and the plan
  routes large uploads straight to R2 with a presigned URL. Once that presigned path exists the bound
  can rise. **Until it does, the bound is 100 MB.** Say which is live in the row's help text.
- **The GitHub rows cannot be moved behind a higher tier**, whatever the numbers say. The plan's
  reason is at `docs/mvp0/PRODUCT-PLAN.md` section 13: the connection is the product. The panel allows the
  edit and the row carries that sentence.

**A contradiction the panel inherits.** Section 18's data model still carries `3 live on Free` at
`docs/mvp0/PRODUCT-PLAN.md` section 18, against section 13's decided 1. **The stored row is the answer**,
which is exactly what the invariant is for, and section 18's table owes a correction.

### 4.2 The panel's own rows, which are not entitlements

These have no home in `53-PRICING-AND-ENTITLEMENTS.md` because they are not caps on a person. They
are how the cap behaves, and they belong to the panel.

Key | Type | Bounds | Default | What reads it
`policy.ai.refill` | `enum` | `monthly`, `continuous` | **`continuous`** | The bucket, see 4.3
`policy.ai.newaccount.days` | `int` | 0 to 365 | **7** | The starting allowance of file 27 section 9.3
`policy.ai.newaccount.edits` | `int` | 0 to 100 | **3** | The same
`policy.ai.newaccount.blueprints` | `int` | 0 to 100 | **0** | The same
`policy.history.graceDays` | `int` | 0 to 365 | **30** | The prune delay of 4.5
`policy.trash.days` | `int` | 1 to 365 | **30** | The trash sweep

### 4.3 The refill row, and a disagreement worth naming

`53-PRICING-AND-ENTITLEMENTS.md` section 3.1 gives `limits.ai.edits`, `limits.ai.blueprints` and
`limits.github.pushes` a reset of `calendar month`. **This file recommends a token bucket instead**,
and the two cannot both be built. Stating it rather than picking silently.

**The argument for the bucket is arithmetic, in file 27 section 9.1.** A calendar counter lets every
free user spend a whole month on one day. At the free caps and Cloudflare's 10,000 free neurons a
day, only **4.94** of the 200 free users can do that before the daily wall is hit. A bucket forbids
that shape, and the person never sees a different number.

**A calendar counter lets every free user spend a whole month on one day.** At the free caps and
Cloudflare's 10,000 free neurons a day, only **4.94** of the 200 free users can do that before the
daily wall is hit. A bucket forbids that shape and the person never sees a different number.

Anthropic describes the same mechanism: `The API uses the token bucket algorithm to do rate limiting.
This means that your capacity is continuously replenished up to your maximum limit, rather than being
reset at fixed intervals.`

**The bucket holds the full month's allowance at signup**, so a first-time person can spend all ten
edits in their first hour, and refills at the monthly rate after that. Ten edits over thirty days is
one every 72 hours.

**The resolution to propose.** `policy.ai.refill` holds both behaviours, ships on `continuous`, and
`53-PRICING-AND-ENTITLEMENTS.md`'s `Resets` column becomes `continuous, at the monthly rate` for the
three rows. **Setting the row to `monthly` stays allowed and stays a mistake**, and the row carries
that sentence in its help text. Whoever reconciles the two files should change 53, because 53 owns
the column and this file owns the mechanism.

### 4.5 History is the one row where lowering deletes something

Every other entitlement leaves data alone and refuses new work. `limits.history.days` is
different, because versions outside the window are pruned to the head.

**So this row alone gets a second confirmation**, and it is worded as a deletion rather than as a
setting. The panel states the number of versions the change will prune, across how many accounts,
before it saves, and the prune runs **30 days after the save**, not at the save. That grace is what
makes the change reversible for a month.

### 4.6 Prices

**The prices themselves live in `53-PRICING-AND-ENTITLEMENTS.md` sections 2 and 3.4**, with their
net-of-tax working. The panel edits four rows and enforces three rules over them.

Key | Type | What reads it
`price.plan.pro.monthly` | `money.inr` | S29 plan page, and the Razorpay call
`price.plan.pro.annual` | `money.inr` | The same
`price.topup.edits.50` | `money.inr` | The same
`price.topup.blueprints.3` | `money.inr` | The same

**Rule one. The upper bound is not arbitrary.** `₹15,000` per transaction is an architectural
constant set by the Reserve Bank, and it is the mandate ceiling, so a price above it cannot be
charged on a recurring mandate at all. **The panel refuses the save** rather than letting a price be
set that the payment provider will decline.

**Rule two. Money is stored in paise as an integer.** A price row that holds a float is a defect, and
the bound is expressed in paise for the same reason.

**Rule three. A price is inclusive of tax, always**, because that is what the plan page shows and
what the invoice has to reconcile against.

**Changing a price does not change an existing subscription.** A live Razorpay mandate carries the
amount it was created at. The panel says how many active mandates are on the old price and states
plainly that they are unaffected until their own renewal, because the alternative is a founder
believing a price change took effect when it did not.

---

## 5. S36. Models and providers

**This is the screen the 18 September review called out for size.** `S36 needs more model layouts,
10 to 13 models` (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:214`). The three-model layout in the
current drawing is wrong.

**Ten to thirteen is the layout minimum, not the catalogue.** Counted from the chain in file 27
section 2, the default set is already **17 rows across 7 providers**, and adding OpenRouter's free
list would take it past 30. The screen has to scroll, group by provider, and stay readable on a
phone.

### 5.1 The default model set, so the layout has real rows to hold

Provider | Model id | Used for | State
Cloudflare | `@cf/meta/llama-3.2-1b-instruct` | cheap edits | in the catalogue
Cloudflare | `@cf/meta/llama-3.2-3b-instruct` | default document and question set | in the catalogue
Cloudflare | `@cf/meta/llama-3.1-8b-instruct-fp8-fast` | larger edits | in the catalogue
Cloudflare | `@cf/qwen/qwen3-30b-a3b-fp8` | the plan's named edit fallback | in the catalogue
Cloudflare | `@cf/openai/gpt-oss-20b` | reserve | in the catalogue
Cloudflare | `@cf/openai/gpt-oss-120b` | reserve | in the catalogue
Groq | `openai/gpt-oss-120b` | default edit | in the catalogue
Groq | `openai/gpt-oss-20b` | edit fallback | in the catalogue
Groq | `qwen/qwen3.8-27b` | reserve | in the catalogue
Cerebras | `gpt-oss-120b` | default blueprint | trial, see file 27 section 2.4
Cerebras | `qwen-3.8-27b` | blueprint fallback | trial
Anthropic | `claude-haiku-4-5` | Pro edit and document | Pro only
Anthropic | `claude-sonnet-5` | Pro blueprint, through batch | Pro only
Ollama | `llama3.2:3b` | desktop edit, 2.0 GB | desktop only
Ollama | `qwen3:4b` | desktop, 2.5 GB | desktop only
Ollama | `gemma3:4b` | desktop, 3.3 GB | desktop only
Ollama | `qwen3:8b` | desktop, 5.2 GB | desktop only

**SambaNova and OpenRouter carry no model rows today**, because neither has a `termsOpenedOn` date
for the endpoints we would use. That is gate B of file 27 section 1 doing its job on the screen.

### 5.2 The provider rows

One block per provider. Who: `founder`.

Key | Type | Bounds | Default | Read by
`provider.<id>.enabled` | `bool` | **refused while `termsOpenedOn` is null** | per provider | the planner's catalogue filter
`provider.<id>.order` | `int` | 1 to 99, unique within a chain | per chain | the planner's sort
`provider.<id>.dailyCap.tokens` | `int \| null` | 0 upward | per provider | the quota ledger
`provider.<id>.dailyCap.requests` | `int \| null` | 0 upward | per provider | the quota ledger
`provider.<id>.dailyCap.neurons` | `int \| null` | Cloudflare only | 10,000 | the quota ledger
`provider.<id>.rpm` | `int \| null` | 0 upward | per provider | the planner's admission check
`provider.<id>.tpm` | `int \| null` | 0 upward | per provider | the planner's admission check
`provider.<id>.baseUrl` | `string` | an https URL | per provider | the executor
`provider.<id>.keyRef` | `string` | the name of an environment variable, **never a key** | per provider | the executor
`provider.<id>.trainsOnInputs` | `bool` | **read only in the panel** | per provider | gate A
`provider.<id>.termsOpenedOn` | `date \| null` | not in the future | per provider | gate B
`provider.<id>.termsQuote` | `string` | up to 2,000 characters | per provider | the row's own evidence, shown on hover

**`provider.<id>.keyRef` holds a name, never a value.** A panel that can hold an API key is a panel
that can leak one, and the audit log of section 9 would then hold it too. The key lives in the
deployment's environment and the panel names which variable to read.

### 5.3 The three controls that are disabled rather than hidden

1. **Enabling a provider with no `termsOpenedOn`.** The control is disabled and the row says
   `Nobody has opened this provider's terms.` Disabled and explained, never hidden, so a founder can
   see what is available and what it would take.
2. **Enabling a provider with `trainsOnInputs: true`.** Disabled permanently, with the quoted
   sentence beside it. **This is not a row a founder can override from the panel**, because it
   changes the sign-in promise rather than a number. Section 8.
3. **Disabling the paid link.** The last entry in every chain is a paid provider, and turning it off
   is what makes the router able to say "AI is unavailable". The control asks for a typed
   confirmation and states that consequence in those words.

### 5.4 The routing rows

Per call type, per plan. Twelve rows, because there are six call types including the desktop case and
two plans.

Key | Type | Default (Free) | Default (Pro)
`routing.edit.free` / `routing.edit.pro` | `list<modelId>` | Groq `gpt-oss-120b`, Cloudflare `qwen3-30b-a3b-fp8`, Cerebras, paid | Anthropic `claude-haiku-4-5`, then the free chain
`routing.document.free` / `.pro` | `list<modelId>` | Cloudflare, Groq, paid | `claude-haiku-4-5`, then the free chain
`routing.questionset.free` / `.pro` | `list<modelId>` | Cloudflare, Groq, paid | the same as Free
`routing.questionrewrite.free` / `.pro` | `list<modelId>` | pinned to whoever served the set | the same
`routing.blueprint.free` / `.pro` | `list<modelId>` | Cerebras, Cloudflare, paid neurons | `claude-sonnet-5` through batch, then Haiku, then the free chain
`routing.desktop.edit` | `modelId` | Ollama `llama3.2:3b` | the same

**The question-set rows are identical across plans on purpose.** The founders decided on 18 September
that dynamic questioning is not a Pro feature, because the free product is the funnel and a worse
funnel is a worse business.

**Each row shows what one call costs**, computed from the model's published rate and the call's token
shape, so a founder reordering a chain sees the money move. `53-PRICING-AND-ENTITLEMENTS.md` section
3.3 holds the per-call cost in rupees and is the home for that number; file 27 section 8 holds the
token arithmetic behind it. Neither is re-typed here.

**One row in that file is already stale, and this is the place a reader will notice.**
`53-PRICING-AND-ENTITLEMENTS.md` section 3.3 says of the free chain: `No OpenRouter endpoint`,
because its terms were never opened. That was true at commit `0af3c90`, which is what that file was
verified against. **Commit `e532e32` opened the terms and admitted OpenRouter to the chain**, and
file 27 section 2.4 records the reconciliation. So the panel's provider list has an entry that file
53 says should not exist. **Fix 53, not the panel.**

### 5.5 The router's own parameters

These are configuration, not code, because file 27 says two of them are unmeasured guesses and a
guess in a deploy is worse than a guess in a row.

Key | Type | Bounds | Default | Note
`router.breaker.failureThreshold` | `int` | 1 to 100 | **3** |
`router.breaker.failureRatePct` | `int` | 1 to 100 | **50** |
`router.breaker.minimumRequests` | `int` | 1 to 1,000 | **5** | Without it, one cold start blacklists a healthy provider
`router.breaker.cooldownMs` | `int` | 1,000 to 600,000 | **15000** |
`router.breaker.slowCallMs` | `int` | 500 to 120,000 | **per model** | File 27 section 2.5: both opened incident histories are one model degrading, and a degraded model returns 200s slowly. Without this the breaker never fires on the commonest real failure
`router.breaker.slowCallRatePct` | `int` | 1 to 100 | **50** |
`router.stream.firstChunkMs` | `int` | 500 to 60,000 | **4000** | **Unmeasured.** The row says so, and names the measurement that would settle it
`router.stream.chunkMs` | `int` | 500 to 120,000 | **8000** |
`router.freeQueue.hourlyCeiling` | `int \| null` | 0 upward, or null | **null** | The service-wide breaker of file 27 section 9.2

---

## 6. S37. Features and flags

**Four flags, and two locked rows.** Who: `founder`.

Key | Type | Default | Turns on | Reaches | Question
`flag.collab.live` | `bool` | **false** | S19 live collaboration, and the Durable Object session | Free at `limits.collab.live`, Pro unlimited | 8
`flag.byok` | `bool` | **false** | The key field in S28 settings, and the bring-your-own-key rung of the exhaustion ladder | both plans | 10
`flag.auth.magiclink` | `bool` | **false** | A third sign-in beside Google and GitHub on S01 | everyone | 18
`flag.publish.indexed` | `bool` | **true** | Whether a new published page is indexable by default | Free and Pro | 17

**Each flag names the screens it turns on or off and the plans it reaches**, on the row, so nobody has
to guess what a switch does.

**Three notes that belong on the rows rather than in a document nobody opens.**

- **`flag.collab.live` is not only a screen.** Turning it on starts holding Durable Objects open, and
  that is the one free-tier cost that scales with time. The row says so and shows the current session
  count.
- **`flag.byok` has a security precondition.** The key must be stored encrypted, never rendered back
  after saving, and never written into any file the person's repository holds. The row refuses to
  turn on until `provider.byok.storage` reports `encrypted`.
- **`flag.publish.indexed` changes a page already published only from the next render.** Turning
  indexing off does not remove a page from a search engine that has already crawled it. The row says
  that in one line, because a founder toggling it will otherwise believe it did.

---

## 7. S38. Accounts, exceptions and the pilot

### 7.1 Exceptions

**A temporary limit granted to one account, with an expiry.** The honest answer to one support mail,
without moving the plan for everyone else.

**The record's shape is `53-PRICING-AND-ENTITLEMENTS.md` section 5.4**, which gives it the fields
`account`, `entitlement`, `value`, `expires` and `reason`. This section adds only what the panel
enforces over them.

Field | Type | The bound the panel enforces
`account` | `string` | An account that exists. The panel resolves it and shows the person before saving
`entitlement` | `string` | **One id from `53-PRICING-AND-ENTITLEMENTS.md` section 3**, and no other string. A free-text key is how a typo becomes a silent no-op
`value` | the entitlement's own type | The entitlement's own bounds, unchanged. **An exception is not a way past a bound**
`expires` | `date` | **Required, and at most 365 days out**
`reason` | `string` | 1 to 500 characters, **required**, and copied into the audit row

**An exception with no expiry is refused.** The plan requires it to expire
(`docs/mvp0/PRODUCT-PLAN.md` section 5b), and a permanent exception is a plan change wearing a disguise.

**On expiry the account returns to its plan's value**, which may put it over the cap, which is S33 and
not an error. The panel warns at the point of granting if the exception is large enough that its
expiry will do that.

**An exception may never raise a locked row.** It cannot grant a training provider, and it cannot
lower the age floor for one person.

### 7.2 What else the screen holds

- **One account against every limit**, with its current usage beside each.
- **That account's ledger**: what it spent, on which model, and what it cost us. This is a **view of
  the ledger of section 18**, not a second store.
- **The audit log across every setting**, newest first, read only in the panel.

### 7.3 The pilot thresholds

Question 15. These are read by the measurement dashboard, never by a cap check.

Key | Type | Default | From
`pilot.stop.activeWeek2` | `int` | **4** of 20 | `docs/mvp0/PRODUCT-PLAN.md` section 28
`pilot.stop.kickoffRuns` | `int` | **2** of 10 | the same
`pilot.stop.namesProblem` | `int` | **3** of 20 | the same
`pilot.continue.activeWeek2` | `int` | **6** of 20 | `docs/mvp0/PRODUCT-PLAN.md` section 28
`pilot.continue.kickoffRuns` | `int` | **3** of 10 | the same
`pilot.continue.asksToPay` | `int` | **1** | the same

**Each of these is a stop line, so lowering one is a decision to keep going on weaker evidence.** The
panel shows the current measured value beside the threshold at the moment of the edit, which makes
the temptation visible rather than preventing it.

### 7.4 The legal rows

Question 4, and they are the only rows on this panel that appear on a public page.

Key | Type | Bounds | Default | Read by
`legal.grievance.name` | `string` | 1 to 120 characters | **Sagnik Mitra**, as officer of record | every public page footer, and S18
`legal.grievance.address` | `string` | 1 to 500 characters | **pending, due 15 October 2026** | the same
`legal.grievance.email` | `string` | a valid address | **pending** | the same
`legal.grievance.ackHours` | `int` | 1 to 168 | **24** | the support flow's clock
`legal.grievance.resolveDays` | `int` | 1 to 90 | **15** | the same

**These rows are published the moment they are saved.** The panel says so above the block, because
every other row on this panel is internal and these are not.

---

## 8. What the panel cannot do

Three things stay outside it, because a setting cannot undo a promise
(`docs/mvp0/PRODUCT-PLAN.md` section 30). Two of them are shown on S37 **as locked rows with the reason on
the row**, rather than being absent.

Locked row | Why | What it would take
`locked.promise.training` | The sign-in page says we never train on documents. That is a claim about which providers are in the chain, not a number. **Adding a training provider changes the sentence, not a row** | A founder decision on question 3, a change to the sign-in copy in `16-COPY-DECK.md`, and a deploy
`locked.age.floor` | The panel can hold the number. **It cannot re-consent the people who accepted the old terms** | New terms, and a re-consent flow for existing accounts
Whether bytes are held at all | That is section 18's architecture and phase A's shape, not a setting | Question 6

**`legal.age.floor` is a live row until the first signup and locked afterwards.** Before anybody has
signed up it is editable and defaults to eighteen. From the first account onward the row shows the
number, shows the count of accounts that consented under it, and refuses the edit. **That transition
is a behaviour, not a deploy**, and the code has to implement it or the lock is a comment.

---

## 9. The one read path

**A single function resolves everything.**

```ts
// src/modules/entitlements/application/limits-for.ts
limitsFor(account): Limits
```

- It takes the account, reads its plan row, applies any unexpired exception, and returns the limit
  set (`docs/mvp0/PRODUCT-PLAN.md` section 30).
- **Nothing else in the product reads a cap.** A number that appears anywhere else is a defect.
- The usage ledger of section 18 is the counter each check runs against.

**How the gate catches a breach.** `npm run arch` already runs
`specs/harness/clean-architecture-report.mjs` and already enforces a `process.env` rule of exactly
this shape. Add a rule with the same mechanism: **a numeric literal compared against a usage count,
outside `src/modules/entitlements/`, fails the build.** A grep for the limit key names outside that
module is the cheap first version, and it is better than nothing on day one.

**Caching.** The panel's rows are read on nearly every request, so they are cached in the function's
process with a short time to live, and the cache key includes a version counter the panel bumps on
every save. **A save takes effect on the next read**, which is seconds, not on a deploy and not after
a manual purge. State the actual time to live in the row's help text so a founder who saves and then
tests knows how long to wait.

**The failure mode to design against.** If the configuration store is unreachable, `limitsFor` must
**fail closed to the Free row's defaults**, not open to unlimited, and it must say in the log which
path served the value. A cap check that silently returns unlimited on a read error is the worst
possible bug on this surface.

---

## 10. What happens to accounts outside a changed limit

**Raising a limit takes effect on the next read, and nobody notices.**

**Lowering one is a downgrade**, and the plan states the rule
(`docs/mvp0/PRODUCT-PLAN.md` section 30): everything stays readable and exportable, and nothing new is
created until the account is under the cap. That is S33.

### 10.1 The save flow

The panel does five things in order, and skipping any of them is how a founder deletes somebody's
work by moving a number.

1. **Compute the blast radius before saving.** How many accounts the change moves over their cap, and
   **name them**. The plan requires the count and the names
   (`docs/mvp0/PRODUCT-PLAN.md` section 30).
2. **Show what each affected account loses.** Not "12 accounts affected", but the account, the
   current value, the new value, and what stops working.
3. **Require a second confirmation when the count is above zero.** A typed confirmation when the row
   is `limits.history.days`, because that row is the only one that deletes.
4. **Write the audit row**, including the count, before the value takes effect.
5. **Notify the affected accounts.** The plan does not require this and it should. A person who finds
   out by being refused has a worse day than one who was told.

### 10.2 The state table

Account state | What still works | What stops
Over `limits.docs.cloud` | Every document opens, edits, exports. Sync continues | No new cloud document. Import is refused with the count named
Over `limits.pages.published` | Every published page keeps serving its URL | No new page is published
Over `limits.uploads.total` | Every upload downloads | No new upload
Over `limits.ai.edits` | Everything that never touches a model, which is most of the editor | The AI box says the entitlement message, **never the outage message**
Over `limits.collab.live` | The open session finishes | No new session
Outside `limits.history.days` | The head version, always | Older versions are pruned 30 days after the change
A Pro account that lapses to Free | All of the above | The same, and the portfolio goes private rather than being deleted

**The entitlement message and the outage message are different messages.** File 27 section 7 says the
same thing from the router's side, and this is the panel side of the same rule. Conflating them
teaches a person that the product is broken when it is merely full.

---

## 11. The audit record

**Every change writes one row** (`docs/mvp0/PRODUCT-PLAN.md` section 30): who, which setting, from what, to
what, when, and how many accounts it moved.

```ts
type ConfigAuditRow = {
  id: string;
  at: string;              // ISO 8601, UTC, from the server clock, never the browser's
  actorAccountId: string;
  actorEmail: string;      // captured at write time, because an account can change its address
  key: string;             // 'limits.docs.cloud'
  plan: 'free' | 'pro' | null;   // null for a row that is not per plan
  scope: 'global' | { accountId: string };  // an exception names its account
  from: unknown;           // the previous value, verbatim
  to: unknown;             // the new value, verbatim
  accountsMoved: number;   // how many accounts the change put over a cap
  accountsMovedIds: string[];    // capped at 1,000, with a truncated flag
  truncated: boolean;
  reason: string | null;   // required for an exception, optional otherwise
  configVersion: number;   // the counter that invalidates the read cache
};
```

**Five properties this record has to have.**

1. **Append only.** No update, no delete, no edit in the panel. It is read only there.
2. **Written before the value takes effect**, inside the same transaction as the value. A change with
   no audit row is a change that did not happen.
3. **Kept as long as the security log of section 23**, which is 180 days rolling in Indian
   jurisdiction.
4. **Never holds a secret.** No key, no token, no password. `provider.<id>.keyRef` holds a variable
   name, so its `from` and `to` are safe by construction, and that is the reason for the design in
   5.2.
5. **`accountsMoved` is computed, never typed.** It is the number from step 1 of the save flow, and it
   is what makes a later reader able to ask whether a support complaint came from a config change.

**One thing the plan's list does not name and should.** The audit row carries `configVersion`, which
is the same counter the read cache keys on. Without it, nobody can answer "which value was live when
this request ran", and that is the first question anybody asks after an incident.

---

## 12. Who holds it

- **Super admin is a flag on an account, not a plan**, and both founders hold it
  (`docs/mvp0/PRODUCT-PLAN.md` section 30).
- **It is checked server side on every write, never in the browser.** A disabled control is a
  courtesy; the server check is the gate.
- The panel's routes are not in `isPublicPath()` and never become so. Every route under the panel
  requires the flag, and the check happens in the route handler, not in a layout.

**A note on the shipped code.** `src/config/env.ts` carries
`ALLOWED_GH_LOGIN: z.string().min(1).default("sagnikmitra")`, which is a single-login allowlist from
the pre-product app. **That is not the super-admin flag and must not be reused as one**, because it
is a GitHub login rather than an account, one founder rather than two, and a default rather than a
decision.

---

## 13. What exists, and what does not

`[O]` Checked against the repository at commit `0af3c90` on 2026-09-18.

Item | State | Evidence
The panel, any screen of it | `specified, not built` | No route, no module. `src/modules/` has no entitlements module
`limitsFor(account)` | `specified, not built` |
Any `limits.*` value in the source | **none, which is the good case** | There is nothing to migrate, because the caps do not exist in code yet. **This is the cheapest moment to build the panel and it will never be cheaper**
The usage ledger the caps count against | `specified, not built` |
The audit collection | `specified, not built` |
A super-admin flag | `specified, not built` | `ALLOWED_GH_LOGIN` exists and is not it
The architecture gate that would catch a second copy | **partly built** | `npm run arch` runs and enforces the `process.env` rule. The cap rule is not written
Firestore rules for the panel's collections | `specified, not built` | `firestore.rules` exists as a prototype and the plan says phase A hardens it

**The build order.**

1. The entitlements module, with `limitsFor` and the row defaults as a typed constant. **This alone
   removes the risk of a second copy**, because there is no cap anywhere else yet.
2. The Firestore collection and rules, with the row defaults seeded.
3. The audit collection and the write path, before any write path that changes a value.
4. S35, because it is the screen the other three are shaped like.
5. The architecture gate rule, so the invariant is mechanical rather than remembered.
6. S36, S37, S38.

**The test that matters most.** A test that asserts `limitsFor` is the only symbol in the codebase
compared against a usage count. It will feel like overkill on the day it is written and it is the
only thing standing between this design and a hard-coded 50 somewhere in an import route.

---

## 14. The limits of this document

**What was not assessed.**

- The panel's own interface. This file specifies rows, bounds and behaviour, not layout. S36's
  ten-to-thirteen-model layout is a design task with a stated constraint, and this file supplies the
  constraint.
- Firestore security rules for the configuration collections, which decide whether the server check
  of section 12 is actually the gate.
- What a second founder seeing a mid-edit change looks like. Two super admins editing one row at once
  is not addressed, and a last-write-wins race on a cap table is a real hazard.
- Whether the read cache's time to live is right, because nobody has measured how often `limitsFor`
  is called.

**What could not be verified.**

- Whether question 16 was meant to be among the eleven. The plan's bullet list covers ten, and
  section 2 says so rather than inventing a row.
- The `limits.uploads.file` upper bound, which depends on whether the presigned R2 upload path
  exists. It does not exist today, so the live bound is 100.
- Whether a Razorpay mandate's amount is genuinely fixed at creation. That is stated from the plan's
  constraint and has not been checked against Razorpay's own documentation in this session.

**What is not established.**

- That `continuous` is the right default for `policy.ai.refill`, against `53-PRICING-AND-ENTITLEMENTS.md`'s `calendar month`. The arithmetic in file 27
  says a calendar counter breaks, and nobody has watched a real person hit a bucket.
- That eleven questions genuinely stop being decisions. A row with a default is a decision somebody
  made quietly, and the panel makes it cheap to change rather than making it disappear. **The
  founders still have to answer them before the pilot meets a stranger**
  (`docs/mvp0/PRODUCT-PLAN.md` section 29); the panel only moves when.

**What would falsify this document.**

- A second copy of any cap appearing in the source and nothing failing. That would mean the gate of
  section 9 is a comment.
- An account losing data because a limit was lowered. Section 10 says only `limits.history.days` can
  delete, and only after 30 days. Any other row deleting something means the state table is wrong.
- A price change appearing to take effect on existing mandates, which would mean the warning in 4.7
  is describing a behaviour the payment provider does not have.
