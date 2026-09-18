---
id: 00-FOUNDER-REVIEW
title: Founder review of every open point
mode: reference
tier: derived
status: living
updated: 2026-09-18
owner: sagnik
generated_by: python3 docs/pack/tools/build-review.py
---

# Founder review of every open point

Generated from the resolution logs of 18 September 2026. Every open point in the pack was
resolved as a proposal, checked, or routed to the founder. Read section 1, then skim section 2.

## 1. What needs the founder

Log | Where | The point | What was proposed or done
---|---|---|---
[66-formats.md](66-formats.md) | 66 section 3.10 (line 360). | Whether to stamp `verified` at all (D06). | Needs founder. Recommendation written: stamp on accept, in phase D, as D06 recommends. Rejected: deciding it here, because D06 sits in the founder's list and was not among the four answered on 18 Sep.
[66-formats.md](66-formats.md) | 66 section 3.10 (line 383). | What `by` holds in the `verified` stamp. | Needs founder, recommendation written: `human:<handle>`. Rejected: an email (published with every page) and a uid (meaningless to a reader). A privacy promise to users, so the founder decides.
[66-formats.md](66-formats.md) | 66 section 5.4 (line 714). | The public origin in `llms.txt`, which waits on the name (D05). | Resolved (proposed) for the format: `{origin}` is `APP_URL`, the validated config value, never a request header. Needs founder for the value only, since D05 (the name) is his; today's live apex is `frontmatter.in`.
[67-14-adr.md](67-14-adr.md) | 67 section 7.2, `open:` | Does an automatic mirror push on Free spend the 20-push quota. | Resolved (proposed): Free has no automatic GitHub push; each push is pressed by the person and counts. Drive on Free stays automatic. The cadence table is adopted. Rejected automatic Free pushes against the quota.
[67-14-adr.md](67-14-adr.md) | 67 section 15 row | The mirror cadence table. | Closed with the 7.2 item above: adopted as proposed by the benchmark.
[67-14-adr.md](67-14-adr.md) | 67 section 10.1, `open:` | A moved upload lives only in Drive, against "our copy is canonical". | Resolved (proposed): the moved upload becomes a link we no longer guarantee, told before the move; checksum-verified copy, link rewrite, logged key delete, a tombstone record per upload; offered only with a Drive connection. Rejected keeping an R2 copy.
[67-14-adr.md](67-14-adr.md) | 67 section 13, `open:` | Does a hard deletion in our copy ever delete the mirror file. | Resolved (proposed): never. At trash expiry our mirror record goes and the file stays with the person; the confirmation says so. Corrected the section 13 bullet that said the delete reached the mirror. Rejected deleting the mirror after 30 days.
[67-14-adr.md](67-14-adr.md) | ADR-0005 Two disagreements, `UNVERIFIED:` | Does Razorpay also allow only one attempt. | Checked. False: Razorpay Subscriptions retry automatically from the next day until `halted`, and the card recurring API allows a manual retry every 36 hours. The RBI framework has no attempt rule, so the rule is Stripe's. Fixed the claim, flagged the decision bullet as corrected, narrowed the build rule to "no scheduler of our own", and updated the limits.
[67-14-adr.md](67-14-adr.md) | ADR-0013 Inventory, IP row, `UNVERIFIED:` | Intellectual property agreement between the founders. | Cannot be checked from here; kept `UNVERIFIED:` with a needs naming the founders.
[files-01-39.md](files-01-39.md) | 38 334, limits. | Which clock governs, IT Rules or consumer rules, or both. | A legal reading. Kept `UNVERIFIED:` with a needs (a lawyer's opinion); the stricter reading stays meanwhile.
[files-01-39.md](files-01-39.md) | 37 333, limits. | Retention rows not cross-checked against the legal section. | Cross-checked. All rows match plan section 18. Two conflict with rule 8(3): security log raised to 365 days, resolved (proposed 18 Sep, founder review); keeping processing logs a year after account deletion needs founder, since it changes a promise to users.
[files-01-39.md](files-01-39.md) | 30 297, rotation. | No rotation schedule, owner or runbook for the eleven secrets. | Confirmed absent. Found two exposed, unrotated tokens recorded in the 13 September handover. Proposed a policy (on leak, on departure, yearly; owner as the plan's security-log row), resolved (proposed 18 Sep, founder review). The two exposed tokens need the founder.
[files-01-39.md](files-01-39.md) | 18 section 12, row 1. | A third sign-in route (magic link) and second 2. | Recommended: flag off at launch; when on, a third button, never a form. Needs founder, since it is his question 18.
[files-01-39.md](files-01-39.md) | 18 section 12, row 3. | Whether the age floor appears in the first sixty seconds. | Recommended one line under the buttons, no birth date. Needs founder, since it is legal risk and his question 12.
[files-01-39.md](files-01-39.md) | 08 47, section 1. | Whether a separate `frontmatter` project exists on the personal team. | Checked read-only with the CLI's login: it exists, id matches the local link, newest deployment 48 days old, so it is the pre-migration project. Deleting it is destructive, so the recommendation (re-link to `zsco`, then retire it) needs founder. Limits list updated.
[files-40-65.md](files-40-65.md) | 54 113, section 3.3 | IT Rules 2021 rule 3 clocks not re-opened. | **Fixed.** Re-opened the MeitY consolidated text of 10 February 2026. G.S.R. 120(E) cut resolution to 7 days, complaint removal to 36 hours, order removal to 3 hours, intimate imagery to 2 hours. Table and `L02` rewritten. Whether we are an intermediary kept `UNVERIFIED:` with needs legal opinion.
[files-40-65.md](files-40-65.md) | 54 145, section 3.5 | R2 and Durable Objects data-location pages not re-opened. | **Fixed.** Both pages re-opened. Neither offers India: R2 has an `apac` hint only, and both have only `eu` and `fedramp` jurisdictions. Firestore lists `asia-south1` Mumbai. Proposed that the CERT-In security log lives in Firestore `asia-south1`, not R2. The plan's "R2 in Mumbai" is therefore wrong, outside this file.
[files-40-65.md](files-40-65.md) | 53 202, section 5.1 | Whether a trial is intended at all. | Resolved as proposed: no trial, the free tier is the trial. Rejected a 14-day Pro trial, because one card attempt makes a failed conversion final. Mirrors D08's recommendation.
[files-40-65.md](files-40-65.md) | 53 238, section 5.2 | Every number in the dunning ladder. | Resolved as proposed: days 0, 3, 7, 14 adopted. Rejected a 7-day downgrade.
[files-40-65.md](files-40-65.md) | 53 300, section 6.2 | Which tax heading a subscription editor falls under. | Kept `UNVERIFIED:` and added needs chartered accountant's opinion.
[files-40-65.md](files-40-65.md) | 53 342, limits | Sections 5.1 and 5.2 decided nowhere. | Rewritten: now proposed resolutions awaiting D08.
[files-40-65.md](files-40-65.md) | 53 344, limits | The tax heading. | Kept `UNVERIFIED:`, needs chartered accountant.
[files-40-65.md](files-40-65.md) | 54 291, section 5.1 | The 2026 rate notification and the tax heading. | Notification closed as in 53; heading kept `UNVERIFIED:` with needs.
[files-40-65.md](files-40-65.md) | 54 390, limits | The tax heading. | Kept, needs chartered accountant.
[files-40-65.md](files-40-65.md) | 54 391 and section 4.3 | Mistral free-tier training default unresolved, page 404. | **Resolved.** Opened the help article and commercial terms 4.2: Studio Free mode trains by default with an opt-out, and Labs or Preview models always train. Proposed: Mistral disqualified from the chain. Rejected: enabling with the opt-out recorded.
[files-40-65.md](files-40-65.md) | 54 section 3.6, Deletion row | "Not yet a founder decision": whether account deletion removes the mirror. | Resolved as proposed: mirror files left in place, our grant revoked. Rejected deleting the mirror first. Also clears the `INFERENCE:` in the section 3.4 table row by reference.
[files-40-65.md](files-40-65.md) | 57 280, limits | The 90-day shutdown notice has no founder agreement. | Recommended 90 days, rejected 30. Marked needs founder, a promise to users.
[files-40-65.md](files-40-65.md) | 50 206, batch 3 | The 11 days added. | Marked as an appetite, proposed. Nothing to verify until built.
[files-40-65.md](files-40-65.md) | 50 248, batch 4 | The 7 days added. | Same treatment.
[files-40-65.md](files-40-65.md) | 50 313, batch 6 | The 10 to 12.5 days for the idea redesign. | Same treatment.
[files-40-65.md](files-40-65.md) | 50 360, batch 8 | The 2 days for phone theming. | Same treatment.
[files-40-65.md](files-40-65.md) | 50 400, batch 10 | The 2 days for `wait_for_change`. | Same treatment.
[files-40-65.md](files-40-65.md) | 50 623, limits, and section 5.2 | Every 18 September addition in days; the brief's headline is lower. | Traced the headline: it is this file's own revision `f237ece` (3 to 4 weeks, about 1 week), so both figures are ours. Adopted the itemised rows as the appetite, proposed. Kept the range floor at 20 days so `ADR-0011` and section 5.4 stay consistent. Rejected re-deriving the total, which would split this file from `ADR-0011`.
[files-40-65.md](files-40-65.md) | 51 363, limits | The Max price: none exists. | Confirmed there is none. Proposed: metered per agent request, the rate set in the configuration panel from measured cost when batch 10 starts. Rejected a flat price now.
[files-40-65.md](files-40-65.md) | 51 364, limits | Whether the tagline test can tell three lines apart; no sample size. | Derived: 15 a line to tell 80 from 30 per cent, 39 for 80 from 50, at 5 per cent significance and 80 per cent power. The pilot gives about 7 a line, so the test can only screen. Proposed: retire any line that 2 or fewer of 7 pass. Rejected ranking lines at that size.
[files-40-65.md](files-40-65.md) | 58 447, section 7.4 | What "the same theme treatment" for phone means. | Proposed three concrete changes: surface layering, desktop heading steps, desktop density. Rejected a phone palette. Needs his confirmation, it is taste.
[files-40-65.md](files-40-65.md) | 41 223, section 7, NF-4 | Open question: does an NFC key equal its NFD form for addressing. | Resolved as proposed: equal only when bytes are equal; a normalised near-match is refused with the match named. Rejected NFC equality, which guesses. Unblocks the NF-4 fixture. Found by `grep -n -i "open question"`, not by the brief's grep.
[screens-S01-S13.md](screens-S01-S13.md) | S04 D01 | Where does the wordmark sit?. | needs founder (brand). Recommendation: mark alone in the workspace and in-app headers; wordmark on the front door and published page only.
[screens-S01-S13.md](screens-S01-S13.md) | S01 resolutions, wordmark note | The plan's S01 line puts the wordmark on the card; S01 and the generator draw the mark. | recorded in S01 and carried with S04 D01.
[screens-S01-S13.md](screens-S01-S13.md) | S04 D11 | Which five collapsibles?. | needs founder on "Commands" only. Recommendation: the four drawn rows plus Outline; Commands read as the existing Command K palette.
[screens-S14-S26.md](screens-S14-S26.md) | S17 D38 | The invite credit value, and its abuse. | Needs founder for the number. Recommended: keep 5 as the panel default, add a monthly per-inviter ceiling. A panel row is needed in file 28 for that ceiling, for its owner.
[screens-S14-S26.md](screens-S14-S26.md) | S18 D42 | Are published pages indexed by default. | Needs founder: a promise to users, and plan section 29 wants it answered before the pilot. Recommended: keep `flag.publish.indexed` true, say "findable" on S17's publish row. File 66 section 5.2 sends `noindex` on the twin and should follow the flag, for its owner.
[screens-S14-S26.md](screens-S14-S26.md) | S23 D57 | Does the MCP server leave the Later column. | Needs founder: it is D04 in file 56, still open, and it moves a phase. Recommended: move it to batch 4 as a read-and-propose server.
[screens-S14-S26.md](screens-S14-S26.md) | S25 D63 | Who signs Windows, and at what price. | Needs founder: money, and D09 in file 56 is open. Recommended two written quotes in batch 1; Windows stays "coming" until signed. Price kept `UNVERIFIED:` with what would check it.
[screens-S27-S38.md](screens-S27-S38.md) | S29 `D60` | Annual offered here?. | needs founder. Recommend offering it as a choice. Flagged that annual loses 19.39 rupees a month per user at full caps (171.57 - 190.96), SIMULATED.
[screens-S27-S38.md](screens-S27-S38.md) | S30 `D61` | Valid handle, and who arbitrates a dispute. | Format resolved (proposed 18 Sep, founder review): reuse `validateSlug`. Dispute outcome needs founder, routed through the grievance process.
[screens-S27-S38.md](screens-S27-S38.md) | S34 `D81` | Over the blueprint allowance: standard set or block?. | needs founder. Recommend: questions allowed on the standard set, files wait for the reset or a top-up. Named the clash with `53` section 5.3.
[screens-S27-S38.md](screens-S27-S38.md) | S37 S37 `D92` | Indexing flag global or per page. | needs founder on the default. Shape proposed: global default plus a per-page choice on S17. Recommend off; three sources disagree.
[screens-S27-S38.md](screens-S27-S38.md) | S37 S37 `D86` | Does turning off bring-your-own key revoke stored keys?. | needs founder. Recommend: stop using, keep stored, tell people, restore on re-enable. It moves calls onto our cost.

**49 items need the founder.** Everything else below is resolved as a
proposal or checked, and is listed in its log for review.

## 2. Every log

Log | Items | Need the founder
---|---|---
[16-copy.md](16-copy.md) | 24. | 0.
[66-formats.md](66-formats.md) | 41. | 3.
[67-14-adr.md](67-14-adr.md) | 38. | 6.
[files-01-39.md](files-01-39.md) | 55. | 6.
[files-40-65.md](files-40-65.md) | 63. | 22.
[screens-S01-S13.md](screens-S01-S13.md) | 58. | 3.
[screens-S14-S26.md](screens-S14-S26.md) | 63. | 4.
[screens-S27-S38.md](screens-S27-S38.md) | 74. | 5.

Every resolved decision in the pack is marked `resolved (proposed 18 Sep, founder review)`
where it sits, so `grep -rn "resolved (proposed" docs/pack` finds each one in context.
