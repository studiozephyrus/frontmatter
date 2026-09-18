---
id: 53-PRICING-AND-ENTITLEMENTS
title: Pricing and entitlements
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [pricing, entitlements, limits, billing, tax, dunning]
---

# 53. Pricing and entitlements

**What this file is.** Every plan, every entitlement with its numeric cap, and the billing
behaviour around them. It is the twin of screen **S35**, the configuration panel's plans-and-limits
table. What the panel shows, this file specifies.

**One fact, one home.** An entitlement id and its cap live here and nowhere else. A number that
appears anywhere else in the pack or the product is a defect.

**Sources.** `docs/mvp0/PRODUCT-PLAN.md` section 13 for the caps, section 22 for the money,
`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:305` for the one cap the founders changed on 18 September.

---

## 1. The one read path

`docs/mvp0/PRODUCT-PLAN.md` section 30 is the architectural rule, and it is the reason this file is a
reference rather than prose.

- A single function, **`limitsFor(account)`**, resolves a plan row plus any exception into the
  limit set.
- **Nothing else in the product reads a cap.**
- A number that appears anywhere else is a defect, and `npm run arch` is where it gets caught, the
  same way it already catches a `process.env` read outside `src/config/` and `*/infrastructure/`.
- The counter every check runs against is the usage ledger.

**So an entitlement id is a key, not a label.** The rows below are the schema.

---

## 2. The plans

Plan id | Name | Price, monthly | Price, annual | Both inclusive of tax
`plan.free` | Free | 0 | 0 | n/a
`plan.pro` | Pro | **299 rupees** | **2,499 rupees** | **Yes, inclusive**
`plan.max` | Max | unset | unset | **Not priced.** See `56-OPEN-DECISIONS.md` D04
`plan.team` | Team | unset | unset | Named, after Pro, no contents
`plan.enterprise` | Enterprise | unset | unset | Named, later

**The annual price is about 30 per cent off twelve months**, re-derived at write time `[O]`:

```
1 - (2499 / (299 x 12)) = 30.4 per cent
```

---

## 3. Every entitlement, with its cap

These are the machine-readable rows. `limitsFor(account)` returns exactly this shape.

### 3.1 Quantities

Entitlement id | What it counts | `plan.free` | `plan.pro` | Unit | Resets
`limits.docs.cloud` | Documents held in the cloud | **50** | unlimited | count | never, a stock not a flow
`limits.pages.published` | Published pages live at once | **5** | unlimited | count | never
`limits.collab.live` | People in one document at once, besides the owner | **1** | unlimited | count | never
`limits.history.days` | Days of version history a person can rely on | **7** | **90** | days | rolling
`limits.uploads.total` | Total upload bytes on the account | **1 GB** | **10 GB** | bytes | never
`limits.uploads.file` | Largest single upload | **5 MB** | **25 MB** | bytes | per file
`limits.ai.edits` | AI edits on a selection or a document | **10** | **100** | count | calendar month
`limits.ai.blueprints` | Blueprints started | **1** | **5** | count | calendar month
`limits.github.repos` | Connected GitHub repositories | **1** | unlimited | count | never
`limits.github.pushes` | Pushes to GitHub | **20** | unlimited | count | calendar month
`limits.blueprint.rewrites` | Question-set rewrites inside one blueprint | **3** | unlimited | count | per blueprint

**Two rows need their history explained.**

- **`limits.collab.live` was 3 until 18 September.** The market says three, at HackMD's "3
  invitees" and AFFiNE's "Up to 3 members per Workspace". **The founders chose 1, on cost:** a live
  session holds a Durable Object open for as long as two people are in it, and that is the one free
  cost that scales with time rather than with calls `[Z]`.
- **`limits.blueprint.rewrites` is new on 18 September**, from the dynamic-question decision. Three
  on Free bounds both the cost and the abuse surface. `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:355`

### 3.2 Capabilities, which are on or off

Entitlement id | What it allows | `plan.free` | `plan.pro`
`features.depth.low` | Low-depth idea mode | **yes** | yes
`features.depth.medium` | Medium depth | no | **yes**
`features.depth.high` | High depth | no | **yes**
`features.links.password` | A password on a share link | no | **yes**
`features.links.expiry` | An expiry on a share link | **yes** | yes
`features.portfolio` | The portfolio page | no | **yes**
`features.branding.remove` | Publish without the Made with line | no | **yes**
`features.drive.sync` | Google Drive sync | **yes** | yes
`features.github.connect` | The GitHub App connection | **yes** | yes
`features.offline` | Offline in the browser | **yes** | yes
`features.desktop` | The desktop app, uncapped | **yes** | yes
`features.export.all` | Every export format | **yes** | yes
`features.docmode` | Doc mode | **yes** | yes
`features.problems` | The problems panel and the formatter | **yes** | yes
`features.byok` | Bring your own model key | **open** | **open**

**The rule behind that table** `[Z]`, narrowed from the founders' original ask at
`docs/mvp0/PRODUCT-PLAN.md section 29`:

> Every editing feature free; password links, Medium and High, the portfolio and branding removal
> are Pro.

**So a person on Free and a person on Pro open the same editor.** Only quantities differ, plus the
four Pro capabilities above.

**Two rows are deliberately free although the market gates them.**

- **Google Drive** is the person's own storage and costs us nothing. Notion gates it to Plus at
  10 dollars.
- **GitHub** is the product. HackMD is free with 20 pushes a month; Notion gates GitHub to
  Business at 20 dollars. A connection that is the product cannot sit behind a higher tier.

**`features.byok` is open**, founder question 10. It is written here as `open` rather than as a
value, because a row with a guessed value reads as a decision.

### 3.3 Model routing, which is an entitlement too

Call | `plan.free` | `plan.pro` | One call costs
An edit | The free provider chain | **Haiku 4.5** | 0.68 rupees
A document | The free provider chain | **Haiku 4.5** | 1.20 rupees
A blueprint | The free provider chain | **Sonnet 5, batch API** | 31.40 rupees

Read from `docs/mvp0/screens/gen.mjs` at the `ROUTING` table, which is what S36 renders.

**The free chain, in fallback order**, is file 27 section 2.1's to state and S36 draws it: Cloudflare
Workers AI, Groq, Cerebras while its trial lasts, then OpenRouter. **OpenRouter was admitted on 18
September** (commit `e532e32`), once its terms were opened. SambaNova stays switched off until
somebody opens its terms. This line said otherwise until 18 September.

**A provider whose terms nobody has opened cannot be switched on.** The sign-in page promises we
never train on documents, and that promise is only as true as this list. See
`54-COMPLIANCE-AND-LEGAL.md`.

### 3.4 Top-ups

Product id | What it grants | Price, inclusive of tax | Net, re-derived `[O]`
`topup.edits.50` | 50 AI edits | **99 rupees** | 81.56 rupees
`topup.blueprints.3` | 3 blueprints | **149 rupees** | 122.75 rupees

```
99 / 1.18 - (99 x 0.0236) = 81.56
149 / 1.18 - (149 x 0.0236) = 122.75
```

**Top-ups are Pro only.** A free account over its cap sees S33 and the upgrade path, not a top-up.

---

## 4. What a price actually becomes

Every figure re-derived at write time `[O]`, matching `docs/mvp0/PRODUCT-PLAN.md` section 22.

### 4.1 Monthly

Step | Working | Result
Gross | 299 | **299.00**
Less tax at 18 per cent | 299 / 1.18 | 253.39
Less Razorpay, 2 per cent plus tax on the fee | 2.36 per cent of 299 | 7.06
**Net** | 253.39 - 7.06 | **246.33 rupees**, which is 2.57 dollars at 95.96

### 4.2 Annual

Step | Working | Result
Gross | 2,499 | **2,499.00**
Less tax at 18 per cent | 2499 / 1.18 | 2,117.80
Less Razorpay | 2.36 per cent of 2499 | 58.98
**Net a year** | | 2,058.82
**Net a month** | 2058.82 / 12 | **171.57 rupees**

### 4.3 What a user costs at full caps

Plan | Model cost at full caps | Source
`plan.pro` | **1.99 dollars** on the default routing | `docs/mvp0/PRODUCT-PLAN.md` section 14
`plan.free` | **0.0194 dollars**, on paid Cloudflare neurons once the free pools are exhausted, and nothing before | the same

**So Pro's margin at full caps is 0.58 dollars**, and at half use 1.57 dollars. The fixed cost is
29.50 dollars a month, so 51 Pro users at full use or 19 at half use clear it.

**And the warning that goes with those numbers.** They are SIMULATED, computed from the caps and
list prices, not from live usage. Nobody has paid anything yet.

---

## 5. Trial, dunning and downgrade

### 5.1 Trial

**There is no trial, and that is a gap rather than a decision.**

- `docs/mvp0/PRODUCT-PLAN.md` section 13 specifies no trial period, and the plan's pricing
  paragraph does not mention one.
- **No trial. The free tier is the trial.** `resolved (proposed 18 Sep, founder review)`, and it is
  D08 in `56-OPEN-DECISIONS.md`. Reason: an Indian card gets one attempt, so a card-on-file trial
  ends in a charge with no retry. Rejected: a 14-day Pro trial, with or without a card.
- **What the product does instead today:** the free tier is the trial. It is a whole editor with
  quantities capped, and the upgrade moment is a cap, not a clock.

`INFERENCE:` for an Indian card that gets one payment attempt, a free tier is a safer funnel than
a card-on-file trial, because a failed attempt at the end of a trial has no retry.

### 5.2 Dunning, and why it is short

**`[L]` The payment-rail constants make this unusual and they are not negotiable.**

Constant | Value | Source
Mandate ceiling without an additional factor | **15,000 rupees a transaction** | Reserve Bank of India circular RBI/2022-23/73 of 16 June 2022
Attempts on an Indian card | **One** | The same circular
Pre-debit notice | **24 hours** before the debit | Razorpay mandate rules

**What that means in practice.**

- A recurring debit is announced 24 hours ahead. `docs/mvp0/PRODUCT-PLAN.md section 15` budgets Resend
  at 3,000 emails a month for exactly those notices.
- **A failed debit is final for that cycle.** There is no automatic retry ladder, because the rail
  does not give one.
- So the dunning sequence is a person asking a person to pay again, not a machine retrying.

**The dunning ladder, specified here, not built** `INFERENCE:` this is the shape the constants
force rather than a decision anybody has taken:

Day | What happens | Entitlement state
0 | Debit attempted, fails | Pro, unchanged
0 | An email: the debit did not go through, here is a link to pay | Pro, unchanged
3 | A second email, and a banner in the app | Pro, unchanged
7 | A third email naming the date access changes | Pro, unchanged
14 | Plan moves to `plan.free` | **Downgrade, section 5.3**
44 | The 30-day trash empties as normal | Unchanged by dunning

**The ladder is adopted as written, days 0, 3, 7 and 14.** `resolved (proposed 18 Sep, founder
review)`, carried by D08. Reason: the only load-bearing number is day 14, far enough out that a
person on holiday keeps Pro. Rejected: a 7-day downgrade, which punishes one missed email.

### 5.3 Downgrade, which is the behaviour that matters most

**The rule** `docs/mvp0/PRODUCT-PLAN.md` section 30, and it applies to a lapsed subscription and to a
lowered limit in the configuration panel alike.

- **Every document stays readable and exportable.** Always. There is no state in which a person
  cannot get their files out.
- **Nothing new is created until the account is under the cap.** That is screen S33.
- **Raising** a limit takes effect on the next read and nobody notices.
- **Lowering** one below what an account already holds puts that account into the over-cap state.

**So the panel names the damage before it saves.** `docs/mvp0/PRODUCT-PLAN.md` section 30: the panel says
how many accounts a change puts over the line, and names them, before it saves.

**What the over-cap state allows and forbids.**

Action | Over the cap
Open any document | **Allowed**
Edit any existing document | **Allowed**
Export anything | **Allowed**
Create a new document | Refused, with the count and the cap named
Publish a new page | Refused
Start a blueprint | Refused
An AI edit | Refused
A GitHub push | Refused

### 5.4 Exceptions

`docs/mvp0/PRODUCT-PLAN.md section 30` gives the panel one more row: **a temporary limit granted to one
account, with an expiry.**

Field | What it holds
`account` | The account the exception applies to
`entitlement` | One id from section 3
`value` | The temporary value
`expires` | An instant, never open-ended
`reason` | Free text, for the audit row

**An exception with no expiry is a plan change by another name**, so the field is required.

---

## 6. Tax

### 6.1 What we charge

- **The price is shown inclusive of tax**, everywhere, on the pricing page and in the app.
- **Goods and services tax at 18 per cent** is the working assumption, which is 9 per cent central
  plus 9 per cent state.

**The source, opened by the plan on 17 September** `[M]`: Notification 11/2017-Central Tax (Rate)
of 28 June 2017, serial 22, "Heading 9984 Telecommunications, broadcasting and information supply
services", central tax 9.

**Two 2025 amendments**, 05/2025 of 16 January and 15/2025 of 17 September, carry no entry for
heading 9984.

### 6.2 What is not settled

- **`UNVERIFIED:` which heading a subscription editor actually falls under.** needs: a chartered
  accountant's written opinion. Not obtainable from here.
- **The 2026 rate notification does not touch services** `[M]`. It is 01/2026-Central Tax (Rate) of
  30 April 2026, and it amends 9/2025, the goods schedule, for beverage tariff lines under 2202. The
  services notification 11/2017 has no 2026 amendment on record. Opened 18 September 2026 at
  `https://nityalegal.com/notifications.html`, a Gazette-copy index, because `cbic-gst.gov.in`
  refused `curl` again.
- **Owner and date:** Sagnik, by **31 October 2026**, per `54-COMPLIANCE-AND-LEGAL.md`.

### 6.3 Invoice lines

**Required before the first rupee.** An invoice carries the legal name, the address, the tax
registration, the period, the plan, the gross, the tax component and the net. Nothing here has
been built or reviewed by an accountant.

---

## 7. Where each number is allowed to appear

This table exists because the one-read-path rule is only real if it is enforceable.

Place | May it hold a cap?
`53-PRICING-AND-ENTITLEMENTS.md`, this file | **Yes. This is the home**
The configuration panel's stored rows | **Yes. This is the runtime copy**
`limitsFor(account)` | Reads the stored rows. Holds no literal
S29, the plan and usage screen | Renders what `limitsFor` returns. Holds no literal
S33, over the cap | Renders what `limitsFor` returns. Holds no literal
S35, configuration | Edits the stored rows
Marketing copy, the pricing page | Reads the stored rows
Anywhere in `src/` outside the panel's own module | **No. A literal there is a defect**
Any other file in this pack | **No. Link here instead**

---

## 8. Limits of this file

**What was not assessed.**

- Willingness to pay. No pricing study, no interviews, no test. `52-MARKET-RESEARCH.md` section 5
  says so explicitly.
- Whether 299 rupees is the right number. It sits under every collaboration and AI peer and above
  the single-user note apps, which is a position rather than a measurement.
- Refund policy contents. The route exists at `src/app/(public)/refunds` and serves a placeholder.

**What could not be verified.**

- Section 5.1 and 5.2 are now proposed resolutions, not decisions. The founder settles them in D08.
- `UNVERIFIED:` the tax heading, section 6.2. needs: a chartered accountant's opinion.
- Notesnook's India page **confirmed below 299 rupees** `[M]`. Opened 18 September 2026 at
  `https://notesnook.com/pricing`, served in rupees: Essential at "₹225.20 / month including tax",
  or ₹188.52 a month billed annually. Pro is ₹791.04 a month. So one peer does sit under our price.
- **Every figure in section 4.3 is SIMULATED.** Computed from caps and list prices. No user has
  paid and no model bill has arrived.

**What would falsify it.**

- A real month of usage showing free users consuming more than 0.0194 dollars each would move
  every row in section 4.3 and the break-even with it.
- A chartered accountant reading a different tax heading would change the net on every line.
- A pilot participant tripping a cap other than documents or AI edits first would say the caps are
  wrong, and `55-MEASUREMENT-AND-EVENTS.md` records which cap tripped for exactly that reason.
