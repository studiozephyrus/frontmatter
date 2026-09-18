---
id: 38-INCIDENT-AND-SEVERITY
title: Incident and severity
mode: how-to
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
covers: [incidents, severity, escalation, postmortem, communication]
verified_against: 0af3c90
---

# 38. Incident and severity

**Two people run this company. There is no on-call rota, no second shift, and nobody to escalate
to.** Every process below is written for that, and says so. **A ladder that describes an on-call
team we do not have would be worse than none**, because the first real incident would prove it
fiction and nobody would open it again.

---

## 1. The severity ladder

**Four levels, from `65-CONVENTIONS.md` section 7. The definitions are short on purpose.**

Level | Meaning | Examples in this product
`CRITICAL` | **Data loss, a security hole, or money moving wrongly** | A splice writes the wrong bytes. A document is readable by somebody who should not see it. A published page exposes a private document. A charge is taken twice. A free user generates a bill
`HIGH` | **A person cannot complete a core job** | Sign-in is down. Documents cannot be saved. The editor will not open a file. Export fails
`MEDIUM` | **A person can complete the job, badly** | Every AI provider is failing and the chain 502s. Drive sync is stuck. The map will not rebuild. Search returns nothing
`LOW` | **Cosmetic, or an internal annoyance** | A layout defect. A copy error. A gate that gives a false failure

**Two rules on assigning a level, and both exist because people get them wrong under pressure.**

1. **Assign for the worst plausible reading, then downgrade with evidence.** A report of "my
   document looks wrong" is CRITICAL until you have shown the bytes on disk are intact. Downgrading
   costs nothing; upgrading late costs the window.
2. **Reach and duration do not change the level, they change the urgency.** One person losing a
   document is CRITICAL. That does not mean it outranks a security hole affecting everybody; it
   means both are CRITICAL and you pick by blast radius.

**Availability, for context** `[O]`. The target is **99.5 percent a month**
(`docs/mvp0/PRODUCT-PLAN.md` section 21). Computed here: a 30-day month is 30 × 24 × 60 = 43,200 minutes,
and 0.5 percent of that is **216 minutes, or 3 h 36 m**. A 28-day month allows 201.6 minutes
(3 h 21 m) and a 31-day month allows 223.2 minutes (3 h 43 m).

**So a single four-hour HIGH incident spends the whole month's budget.** That is the honest scale of
what two people can absorb, and it is an argument for the degraded modes in section 6, not for
heroics.

---

## 2. Who is called

**There is no rota. There are two people and a written division of the standing duties.**

Level | Who acts | Who is told, and when | Reality check
`CRITICAL` | **Whoever finds it, immediately**, and both founders within the hour | Both founders at once. The affected people per section 5 | **Nobody waits for the other.** Waiting for the owner is how a window gets spent
`HIGH` | Whoever finds it | The other founder the same day | If it needs an account only one person holds, that is the escalation
`MEDIUM` | The owner of the area, in normal hours | The other founder in the weekly pass | No out-of-hours action
`LOW` | Goes on the list | Nobody | **A LOW that keeps recurring is a MEDIUM.** Count before you judge

**The standing owners, from `docs/mvp0/PRODUCT-PLAN.md` section 23:**

Duty | Owner | Due
Privacy notice, terms, consent wording, the age floor | Sagnik | 15 Oct 2026
**Named grievance officer with a published address on every public page** | **Sagnik, as officer of record** | 15 Oct 2026
**Breach contact filed; a six-hour incident runbook; an append-only security log kept 180 days in Indian jurisdiction** | **Amit** | 15 Oct 2026
Razorpay mandates; refund and cancellation page | Amit | 31 Oct 2026
Processor agreements | Amit | 31 Oct 2026
Accounts moved to the company | Sagnik | 15 Oct 2026

**So the incident runbook and the breach contact are Amit's, and the grievance route is Sagnik's.
Both are due before the first stranger, and neither exists at `0af3c90`.**

**The bus-factor problem, stated rather than hidden.** Several recoveries need an account only one
person holds: the Cloudflare zone is on a personal account, Vercel is split across two teams, and
the Firebase project sits under a studio Gmail address. **A credential recoverable by exactly one
person is a single point of failure disguised as security.** Fixing that is the account move, and
it is on the list above.

---

## 3. The first ten minutes

**Six steps, in order. Do not reorder them, and do not skip step 2 to move faster.**

Step | What | Why this order
1 | **Write down the time, from `date -u`, and what you saw.** Verbatim | Everything afterwards is measured from here, and memory of "about twenty minutes ago" is wrong by an hour by the evening
2 | **Assign a level from section 1, worst plausible reading** | It decides whether you may act alone
3 | **Stop the bleeding before you understand it.** Turn the feature off, revert the deploy, disable new sign-ups | **Understanding is not a prerequisite for stopping.** Diagnosis with the bleeding continuing is the expensive mistake
4 | **Preserve the evidence.** Never restore over the damaged thing. Never delete the corrupt artefact | `37-BACKUP-AND-RECOVERY.md` section 6, step 3: restore to a **new** bucket
5 | **Tell the other founder** at CRITICAL or HIGH | One person's judgement under pressure is one opinion
6 | **Only then diagnose** | Steps 1 to 5 take about three minutes and they are what make step 6 recoverable

**Step 3's levers, and which of them exists today:**

Lever | Exists at `0af3c90` | How
Revert and redeploy | **Yes** | `git revert`, push, or promote an earlier Vercel deployment. `32-DEPLOYMENT-AND-OPS.md` section 5
Turn off an AI provider | **Yes, bluntly** | Remove its key from the Vercel environment. **There is no finer control**
Turn off AI entirely | **Yes, bluntly** | Remove all five keys; calls then fall to the Gateway and 502
A feature flag | **No** | The configuration panel is phase A. `docs/mvp0/PRODUCT-PLAN.md` section 30
A per-account budget or a breaker | **No** | The research recommends both for phase A. `34-INTEGRATIONS.md` section 9.4
**Stop new sign-ups without touching existing accounts** | **No** | Recommended as "a flag, half a day, and it converts a bad night into a slow morning". **Build this one early**
A write-path freeze whose switch is not in the broken system | **No** | Required by `37-BACKUP-AND-RECOVERY.md` section 6, step 1

**The gap this table shows.** **At `0af3c90` the only real levers are revert, redeploy, and pull a
key.** Everything finer is phase A. **That is the strongest argument in this pack for building the
configuration panel before the features that read it**, which is exactly what the plan says.

---

## 4. Destructive operations during an incident

**An incident is precisely when people skip the confirmation, and precisely when they should not.**

**Every destructive operation still needs, in the same turn:**

1. **Name the operation in plain language**, with the target.
2. **State the blast radius**: how many rows, how many accounts, what cannot be undone.
3. **State what was checked to confirm safety**: the backup path, its size, its integrity.
4. **Ask, and wait for an explicit yes.** "Continue", "next", "ok", a thumbs-up and silence **do not
   count**.
5. **Execute, then verify the post-state and report it.**

**A previously approved session of destructive work does not carry over. Every operation is its own
confirmation.**

**Two more that apply during an incident specifically:**

- **Preview the match count before any filter that deletes rows.** `grep -c` first, delete second. A
  preview costs ten seconds; an over-broad filter costs the rows, and recovery then depends on how
  old the backup happens to be.
- **Take the pre-operation backup even under time pressure**, and show its path and size. **Even
  with approval, mistakes happen, and the pre-operation copy is the only durable safety net.**

**The one genuine exception, stated so it cannot be stretched.** **Stopping a bleed is not a
destructive operation.** Turning a feature off, reverting a deploy, pulling a key or disabling
sign-ups are all reversible and all take effect immediately. **Do them without asking.** What needs
asking is anything that changes or deletes stored data.

---

## 5. Communication

### 5.1 The clocks, and the conflict between two of them

**Three sets of obligations may apply, and two of them disagree.** Take the stricter number in every
row.

Source | Obligation | Clock
IT Rules 2021, rule 3, as the audit read it | Grievance acknowledgement | **24 hours**
IT Rules 2021, rule 3 | Grievance resolution | **15 days**
IT Rules 2021, rule 3 | Content removal | **72 hours and 36 hours**, per category
Consumer Protection (E-Commerce) Rules 2020, as this plan opened it | Grievance acknowledgement | 48 hours
Consumer Protection (E-Commerce) Rules 2020 | Grievance resolution | one month
CERT-In directions of 28 April 2022, as the audit read them | **A six-hour incident runbook** | **6 hours**
DPDP section 8(6) | Intimation to the regulator **and to each affected person** | **`UNVERIFIED:`** the deadline lives in rules that could not be opened

**So the working numbers are: acknowledge a grievance within 24 hours, resolve within 15 days, and
have a six-hour incident procedure.** **Do not write a 72-hour breach-notification figure from
memory.** The PRD records that the relevant pages returned empty bodies and 404s, and a number
invented here would end up in a public policy.

**Whether a subscription editor is an e-commerce entity is a counsel question**, and so is whether
the accessibility rules reach it. Both are on the legal-floor list. **Build to the stricter reading
meanwhile**, which costs nothing and is reversible.

### 5.2 The status message template

**For anything affecting people outside the studio. Plain, short, no apology theatre.**

```
<Product area> - <one line of what is not working>

What is happening: <what a person sees, in their words>
What we know: <verified facts only>
What is not affected: <name it, because people assume the worst>
Your data: <the sentence they actually want>
Next update: <a time, from `date -u`, not "shortly">

<time, UTC and IST>
```

**Five rules for that message.**

1. **"Your data" is the line that matters. Answer it in the first message, or people assume the
   worst.** If you do not yet know, say that you do not yet know and when you will.
2. **Every "what we know" line is verified.** Attribute anything that is not, or leave it out. "We
   believe" and "we have confirmed" are different sentences and must look different.
3. **Give a time for the next update and meet it, even to say nothing has changed.** A missed update
   is read as a worse incident.
4. **Never name a cause you have not proved.** A retracted cause costs more trust than an unknown
   one.
5. **Both timezones.** The team is in India and the readers may not be.

### 5.3 Telling the person whose data is affected

**Separate from a status message, and it does not get folded into one.**

- **It is individual.** The obligation is intimation to each affected person, not a banner.
- **It says what was affected, what was not, what we have done, and what they should do.**
- **It goes out on the legal clock, not on the fix.** **Waiting for a fix before telling somebody
  their data was exposed is the wrong order**, and it is the mistake that turns an incident into a
  penalty.
- **Sagnik is the officer of record**, so it goes out over a real name with a published address.

---

## 6. Degraded modes, which are cheaper than uptime

**Two people cannot buy availability with staffing, so the product buys it with design.** These are
plan positions, not inventions here.

Failure | The degraded mode | Where it comes from
We are down entirely | **The browser keeps every draft.** Nothing a person typed is lost | `docs/mvp0/PRODUCT-PLAN.md` section 21
A model provider fails | The chain advances silently on a 429, a 5xx or a timeout. The caller sees an error only if **every** provider fails | `src/modules/ai/infrastructure/gateway-client.ts:15`
The whole model layer is degraded, or a person is over their cap | **A standard question set, rather than an apology.** S32 | `docs/mvp0/PRODUCT-PLAN.md` section 14
A provider is slow | Ghost text hedges two providers under a 6 s timeout; quality calls use one under 15 s | `src/modules/ai/infrastructure/gateway-client.ts:96`
Drive sync conflicts | **Both versions kept, the person chooses.** S31. **Never a silent merge** | `docs/mvp0/PRODUCT-PLAN.md` section 11
A splice range is ambiguous | **The engine refuses and returns the input unchanged** | `AGENTS.md` rule 2
A connection is lost | **Exports never need a connection** | `docs/mvp0/PRODUCT-PLAN.md` section 27

**The principle underneath all seven, and it is the product's own: returning the input unchanged is
a correct outcome. Guessing is not.** **An incident is the moment that principle earns its keep**,
and the moment somebody will be tempted to add a fallback that guesses.

---

## 7. The postmortem

**Written for every CRITICAL, and for any HIGH that lasted over an hour or recurred.** Within a week
of the fix.

```markdown
# Postmortem: <one line> - <YYYY-MM-DD>

Severity: CRITICAL | HIGH
Detected: <UTC>, by <person, alert or report>
Mitigated: <UTC>
Resolved: <UTC>
Duration of impact: <computed, with the arithmetic shown>
People affected: <a number, and how it was counted>
Data lost: <bytes, documents, or "none, and here is how that was verified">

## What happened
<Plain narrative, in order. No blame, no rationalisation.>

## Timeline
<UTC> - <event>
<UTC> - <event>

## What went wrong
<The mechanism. Not the person.>

## Why it was not caught
<The gate, test or monitor that should have caught it, and why it did not.
 "Nobody was looking" is an acceptable and common answer here.>

## What went right
<Real, not decorative. A guard that held. A backup that existed.>

## Actions
| # | Action | Owner | Due | State |
|---|---|---|---|---|
| 1 | <the change> | <person> | <date> | open |

## The red proof
<The test that FAILS against the unfixed code, and the command that runs it.
 If there is none, say so plainly rather than claiming coverage.>
```

**Six rules, and the first three are where postmortems usually go wrong.**

1. **Re-derive every number at write time.** Do not carry a figure forward from the incident chat.
   **Twenty numbers in this repository's own record went stale exactly that way.**
2. **The red proof is not optional, and "the test passes now" is not one.** A test on a rare fault
   proves nothing until it fails against the unfixed code. **If you cannot make it fail, write that
   the test does not cover the bug.**
3. **If a number came from replaying data through code rather than from the system's own files,
   write SIMULATED in the same sentence.**
4. **Acknowledge the mistake in one sentence and move on.** Do not re-explain why it happened, and
   do not rationalise. The mechanism section covers the cause.
5. **"Why it was not caught" is the section that produces the next gate.** It is the reason to write
   the document at all.
6. **Every action has one named person and a date.** An action owned by "the team" is owned by
   nobody, and there are two people here.

**Where a postmortem lands.** A file in this pack, numbered and never renumbered, with the incident
date in its name. **Supersede, never overwrite**, and never edit an old one to look better: an
archive is a record of what was true then.

---

## 8. What does not exist, and what to build first

**There is no detection.** No Sentry, no PostHog, no uptime monitor, no alert of any kind at
`0af3c90`. **Every incident is found by a person noticing**, which means the clocks in section 5
start whenever somebody happens to look.

**The order to fix that, cheapest and most load-bearing first:**

Order | What | Why first
1 | **An uptime check on `frontmatter.in`, hosted somewhere that is not Vercel** | **A monitor that shares a blast radius with the thing it watches is not a monitor.** One check, minutes of work
2 | **The stop-new-sign-ups flag** | "A flag, half a day, and it converts a bad night into a slow morning"
3 | **A usage row per AI call**, with the field names pinned in one place | It is the layer that caught every incident in the published record of model abuse
4 | **A per-account budget and a service-wide hourly breaker** | Every free provider meters per organisation, so one abuser drains the pool for everybody
5 | **Error reporting** | Useful, but it tells you about errors that were thrown. Items 1 to 4 tell you about the ones that were not
6 | **The append-only security log, 180 days, in Indian jurisdiction** | A legal-floor row with a named owner and a date, and it is R2 in Mumbai rather than a vendor free tier

**Item 1 before item 5, and that ordering is deliberate.** An error tracker reports failures the
code noticed. **The failures that hurt in this product are the silent ones**, and section 8 of
`37-BACKUP-AND-RECOVERY.md` lists four mechanisms by which a system reports success having done
nothing.

---

## 9. Limits of this file

**What was not assessed.**

- **No incident has ever been run through this process.** Sections 3, 5 and 7 are a specification.
- The actual reachability of both founders out of hours. Section 2 assumes both are reachable and
  nothing tests that.
- Which accounts each founder can recover alone. Section 2 names the problem and does not enumerate
  it, because doing so needs a dashboard login per service.

**What could not be verified.**

- **Every legal clock in section 5.1 is quoted from the plan's reading, not re-opened here.** The
  plan marks several of its own sources as read by an audit rather than by the current revision.
  **RE-DERIVE BEFORE PUBLISHING ANY OF THEM.**
- `UNVERIFIED:` the breach-notification deadline. It is the one number most likely to be filled in
  from memory, and it must not be.
- `UNVERIFIED:` whether the IT Rules or the Consumer Protection Rules clock governs, or both.
  Section 5.1 takes the stricter reading, which is safe but is not a legal answer.

**What is not established.**

- Whether a MEDIUM should ever wake somebody. Section 2 says no; a reader could reasonably argue
  that a stuck sync during a customer's deadline is different.
- Whether the availability target of 99.5 percent is the right one for a two-person company. The
  arithmetic in section 1 shows one bad afternoon spends the month.
- Where postmortems live once there are more than a handful.

**What would falsify this file.**

- An incident handled without a written time from `date -u` at step 1, which would mean the process
  is not being used.
- A postmortem with no "why it was not caught" section, which would mean the loop that produces
  gates is not closing.
- A published breach-notification deadline that nobody re-derived, which is the specific failure
  section 5.1 exists to prevent.
