---
id: 57-SUPPORT-AND-LIFECYCLE
title: Support and lifecycle
mode: how-to
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [support, export, deletion, shutdown, promises]
---

# 57. Support and lifecycle

**What this file is.** How a person reports a problem, what we promise back, how they get their
documents out, how they close their account, and **what happens to their documents if the product
stops.**

**Who it is for.** Two readers. The person answering a support message, who needs the promise and
the route. And the person who asks the last question, which is the one a file-first product owes
its users an answer to.

---

## 1. How to report a problem

### 1.1 The routes

Route | Where it appears | Who uses it | Goes to
**In the app** | Settings, and a link in the footer of every screen | A signed-in person | The support address
**The report link** | S18, the published page | **Anybody, with no account** | The grievance route
**The email address** | The public pages, the terms, the privacy notice | Anybody | The support address
**The grievance officer** | Named with a published address on every public page | A complaint about content or data | The officer of record

**The report link on a published page has no account requirement, and that is a legal
requirement rather than a courtesy.** See `54-COMPLIANCE-AND-LEGAL.md` row `L02`.

### 1.2 What a person should include, and what the app attaches for them

The app attaches these. **A person is never asked for a version number.**

Attached automatically | Why
The app version and the build commit | So a bug can be tied to a deploy
The surface: web, desktop or phone | Behaviours differ by shell
The browser or operating system | Rendering and storage differ
The document id, if one is open | **Never the document content**
The last refusal id, if the engine raised one | An `nf-` id turns a vague report into a reproducible one
The account id and plan | So a cap question can be answered without asking

**Never attached**, for the same reason they are never event properties: document content, a
document title, a file path, a share token or a model prompt. See
`55-MEASUREMENT-AND-EVENTS.md` section 5.

**If a person wants to send content, they attach it themselves.** The app never does it on their
behalf.

---

## 2. What we promise

### 2.1 The promises, by kind

Kind | First reply | Resolution or a plan | Where the clock comes from
**A data or content grievance** | **24 hours** | **7 days** | `54-COMPLIANCE-AND-LEGAL.md` section 3.3, and it is a legal clock
**A takedown on a published page** | 24 hours | **36 hours to remove** on a complaint, **3 hours** on a court or government order, **2 hours** for intimate imagery or impersonation | The same. Corrected 18 September from 15 days, 72 and 36 hours, the pre-2026 text
**Data loss, or a document that cannot be opened** | **Same day** | As long as it takes, with a daily update | Ours
**A payment problem** | **1 working day** | 3 working days | Ours
**A bug** | 3 working days | No promise. It goes in the register with a severity | Ours
**A question** | 3 working days | The same reply is the resolution | Ours
**A feature request** | 3 working days | **No promise, and we say so** | Ours

**Only the first two rows are legal clocks.** The rest are ours, and this file is where they are
written down so that nobody invents a different number in a reply.

### 2.2 The promises we do not make

- **No uptime promise to a person on Free.** The plan's target is 99.5 per cent a month and it is
  a target, not a service-level agreement.
- **No response time at the weekend.** Two founders, and saying so is better than missing it.
- **No promise that a feature request will be built.** Ever. A reply that says maybe is worse than
  a reply that says no.
- **No phone number.** There is no support telephone line and there will not be one.

### 2.3 The one promise that outranks the rest

**A person can always get their documents out.** Whatever else is broken, whatever the account
state, whatever the plan, whether or not the bill was paid.

That is not a support promise. It is an architectural one, and section 3 is how it is kept.

---

## 3. Getting your documents out

### 3.1 What export includes

From `docs/mvp0/PRODUCT-PLAN.md` section 18. Everything under Documents, Ideas and Settings leaves
as files a stranger's tool reads.

What | The format it leaves as
Documents | **Markdown**, byte for byte what is on disk
Uploads | The original files, in place under the document
Versions | A folder of files, one per version
Comments | A JSON file beside each document
Change-queue items | A JSON file beside each document
Decisions and blueprints | As they are, markdown
Templates, the person's own | Markdown
`MANIFEST.json` and `SHA256SUMS` | So the export verifies itself

**One thing is not in the list.** The review sidecar of the earlier plan does not exist, so it
cannot be exported. `docs/mvp0/PRODUCT-PLAN.md` section 25 records why.

### 3.2 How to export

Route | What it does | Needs
**Settings, Export everything** | Builds the full archive and gives a download link | An account
**Per document, Download** | One file, immediately | Read access
**The `.md` twin of a published page** | One file, over the network, no account | Nothing
**`git clone`, if GitHub is connected** | The whole repository, ours or not | The GitHub connection
**The Drive folder, if Drive is connected** | The files, in the person's own storage | The Drive connection
**The desktop app's folder** | The files, already on disk | The desktop app

**Four of those six do not involve us at all.** That is the design, not an accident. The two
connections and the desktop folder put the files somewhere we cannot reach, which is what makes
the promise in section 2.3 credible rather than a policy.

### 3.3 What export does when the account is over its cap or lapsed

**It works.** `53-PRICING-AND-ENTITLEMENTS.md` section 5.3 is explicit: every document stays
readable and exportable in every state. Export is never gated by a plan, a cap or an unpaid bill.

### 3.4 How long it takes

Size | What happens
A single document | Immediate
Under about 200 documents | Built while the person waits
More | Built in the background, and an email carries the link

`UNVERIFIED:` the 200-document line. **No export has been built or timed**, and the performance
targets in `docs/mvp0/PRODUCT-PLAN.md` section 21 do not cover export. needs: a timed export on the
built builder. **The rule is decided even though the number is not**, `resolved (proposed 18 Sep,
founder review)`: an export goes to the background when building it would outlast one request.
Rejected: a fixed count with no measurement behind it.

---

## 4. Closing an account

### 4.1 The steps

1. **Settings, Delete account.**
2. The app says exactly what will be removed and what will be kept, using the table in section 4.2.
3. **It offers an export first**, and does not require one.
4. The person confirms by typing the word delete.
5. A confirmation email goes out, naming the date the removal completes.
6. **Removal completes within 30 days.**

**There is no cooling-off period longer than that**, and there is no dark pattern in step 4. The
confirmation exists because deletion is irreversible, not to talk anybody out of it.

### 4.2 What is removed and what is kept

Thing | On account deletion
Account and profile | **Removed within 30 days**
Documents, versions, uploads | Removed
Share links and published pages | Removed, and the published URLs go dark
Comments and change-queue items | Removed
Connections to GitHub and Drive | **Revoked at the provider**, then removed
Agent tokens | Revoked, then removed
Collaborator rows | Their rows removed. **Documents they were invited to stay with the owner**
Ledger entries | **Aggregates kept, without the account id**
Plan and invoice records | **Kept as the law requires, unlinked from the profile**
Security log | Kept for its 180 days
Local drafts on the device | **Not ours.** They stay until the browser or the person removes them

**Two rows are exceptions to a clean sweep and both are deliberate.** An invoice is a statutory
record. An aggregate stops being personal data once the account id is gone. **Say both in the
privacy notice rather than promising a sweep that cannot happen.**

### 4.3 What a person should do first, and what we say

**Tell them, on the deletion screen, in this order:**

1. Export, if they have not.
2. **Disconnect GitHub and Drive last, not first.** Those two hold copies that survive us, and
   disconnecting first removes the copy before the export runs.
3. Unpublish anything they want to keep private, because a published URL goes dark rather than
   being redirected.
4. Warn any collaborators, because their access ends without a message from us.

---

## 5. What happens to documents if the product stops

**This is the honest question a file-first product owes its users, and the answer is good.**

### 5.1 The short answer

**The files are markdown and they are already theirs.**

- Every document is a markdown file. **Not a database row rendered as markdown. The file is the
  record**, and every view is a projection of it.
- A person with GitHub connected already has every document in a repository they own.
- A person with Drive connected already has every document in their own storage.
- A person with the desktop app already has every document in a folder on their machine.
- A person with none of those has an export that is a folder of markdown files, and nothing in it
  needs us to read it.

**So the worst case is inconvenience, not loss.** That is the whole reason the projection law
exists, and it is worth saying out loud rather than leaving implied.

### 5.2 What we commit to, if it stops

Commitment | Detail
**Notice** | **90 days** before anything is switched off, by email to every account with a document
**Export stays on** | Export is the **last** thing to be switched off, after publishing, after AI, after sharing
**Published pages get a grace period** | They keep serving for the 90 days, so a link in somebody else's document does not break the day we stop
**No ransom** | Export is never moved behind a payment. Not at the end, not at any point
**The format is documented** | `docs/mvp0/PRODUCT-PLAN.md` section 20 specifies every format we invented, each with a version field, a rule for unknown fields, a stated degradation in a plain markdown reader, and a test

**The last row is the one that matters most and it is the least obvious.** Our own block formats
(`fm-chart`, `fm-flow`, `fm-draw`) each degrade to a code block in any plain reader, and the table
above a chart stays a table. **So even the parts we invented survive us**, as readable text rather
than as a broken embed.

### 5.3 What we do not commit to

- **We do not commit to open-sourcing the code.** That is a decision nobody has taken, and
  promising it here would be inventing one.
- **We do not commit to running a read-only service forever.** The 90 days is the commitment.
- **We do not commit to a successor.** If somebody buys it, they inherit the commitments and not
  the promise that they will keep them.

### 5.4 The test for this section

**A person who has never used the product should be able to open their export in any text editor
and read every word of every document.** No converter, no importer, no account, no network.

If a future feature would break that test, **it is the feature that is wrong**, and
`51-PRODUCT-PLAN.md` section 5 already refuses the ones that would.

---

## 6. Who answers, and with what

### 6.1 Today

Role | Person | What they hold
Support, first reply | Either founder | The routes in section 1
**Grievance officer of record** | **Sagnik** | The 24-hour and 7-day clocks and the removal clocks, `L02`
Breach contact | Amit | The six-hour incident runbook, `L05`
Payments | Amit | Razorpay, refunds, the mandate rules

**Two founders is the whole support organisation.** Section 2.2's honesty about weekends follows
from that, and the promises in section 2.1 were written to be keepable by two people rather than
to sound generous.

### 6.2 The support record

Every support message is a document. **The person's own words are kept verbatim**, and the reply
beneath it.

**And the rule that keeps this from becoming a data problem:** a support record is subject to the
same retention and deletion rules as anything else in section 4.2. **A deleted account's support
history is deleted with it**, except where an invoice dispute makes it a financial record.

---

## 7. Limits of this file

**What was not assessed.**

- **Nothing in this file is built.** There is no support inbox, no deletion flow, no export
  builder, no grievance route in code. This is a specification.
- No help centre, no documentation site, no frequently-asked-questions page. `[O]` none of the
  three appears in `docs/mvp0/PRODUCT-PLAN.md` section 26's phases.
- No volume estimate, so the promises in section 2.1 have not been tested against a real inbox.
- Localisation of any support text.

**What could not be verified.**

- `UNVERIFIED:` the export timings in section 3.4. needs: a timed export once the builder exists.
- **The 90-day shutdown notice**, section 5.2. `resolved (proposed 18 Sep, founder review)`,
  **needs founder**, because it is a promise to users. Recommended: 90 days. Rejected: 30 days,
  which is shorter than one monthly billing cycle plus the time to move a published site.
- **Support records are documents in our own product**, section 6.2. `resolved (proposed 18 Sep,
  founder review)`: one retention and deletion path covers them, so no second store can leak a
  deleted account's words. Rejected: a separate help-desk store, which needs its own deletion rule.
- `INFERENCE:` the promise ladder in section 2.1, apart from the two legal rows, is mine.

**What would falsify it.**

- A support volume that two people cannot answer inside the promises would make section 2.1 a
  set of broken promises rather than a policy, and the right response would be to change the
  numbers here rather than to miss them quietly.
- A person unable to read their export in a plain text editor would falsify section 5.4 and, with
  it, the projection law.
- If a future block format cannot degrade to readable text, section 5.2's last row stops being
  true and `docs/mvp0/PRODUCT-PLAN.md` section 20's four requirements have failed.
