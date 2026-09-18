---
id: files-40-65
title: Resolution log for files 40 to 65
mode: reference
tier: canonical
status: living
verified_against: e0f6f89
updated: 2026-09-18
owner: sagnik
covers: [review]
---

# Resolution log for files 40 to 65

Every `UNVERIFIED:` claim and `open:` marker in the numbered files `40-` to `65-`, excluding
`56-OPEN-DECISIONS.md`, and how each was treated on 18 September 2026 under
`docs/pack/tools/RESOLVE-BRIEF.md`. Line numbers are those before the edit.

file | id or line | the open point | what you did | basis | needs founder (yes/no)
--- | --- | --- | --- | --- | ---
54 | line 19 | Definition of the `UNVERIFIED:` tag in the file's preamble | Not an open point. Left as written | none needed | no
54 | 113, section 3.3 | IT Rules 2021 rule 3 clocks not re-opened | **Fixed.** Re-opened the MeitY consolidated text of 10 February 2026. G.S.R. 120(E) cut resolution to 7 days, complaint removal to 36 hours, order removal to 3 hours, intimate imagery to 2 hours. Table and `L02` rewritten. Whether we are an intermediary kept `UNVERIFIED:` with needs legal opinion | [M] `https://www.meity.gov.in/static/uploads/2026/02/550681ab908f8afb135b0ad42816a1c9.pdf`, 2026-09-18 | yes, the 2-hour and 3-hour clocks need an on-call unpublish path
54 | 388, limits | IT Rules and CERT-In readings not re-opened | CERT-In **confirmed**: 6 hours and 180 days in Indian jurisdiction, quoted under `L05`. IT Rules fixed as above. Limits line rewritten | [M] `https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf`, 2026-09-18 | no
54 | 145, section 3.5 | R2 and Durable Objects data-location pages not re-opened | **Fixed.** Both pages re-opened. Neither offers India: R2 has an `apac` hint only, and both have only `eu` and `fedramp` jurisdictions. Firestore lists `asia-south1` Mumbai. Proposed that the CERT-In security log lives in Firestore `asia-south1`, not R2. The plan's "R2 in Mumbai" is therefore wrong, outside this file | [M] the three Cloudflare and Firebase URLs in section 3.5, 2026-09-18 | yes, the log store moves and the plan's section 23 needs the same fix
53 | 202, section 5.1 | Whether a trial is intended at all | Resolved as proposed: no trial, the free tier is the trial. Rejected a 14-day Pro trial, because one card attempt makes a failed conversion final. Mirrors D08's recommendation | [P] `56-OPEN-DECISIONS.md` D08, [L] RBI one-attempt constant | yes, D08 is his
53 | 238, section 5.2 | Every number in the dunning ladder | Resolved as proposed: days 0, 3, 7, 14 adopted. Rejected a 7-day downgrade | [P] D08 | yes, D08 is his
53 | 300, section 6.2 | Which tax heading a subscription editor falls under | Kept `UNVERIFIED:` and added needs chartered accountant's opinion | cannot be checked from here | yes
53 | 302, section 6.2 | The single 2026 rate notification | **Checked.** 01/2026-Central Tax (Rate) of 30 April 2026 amends 9/2025, goods only, beverage lines under 2202. 11/2017 has no 2026 amendment on record. CBIC refused curl, so a Gazette-copy index was used and the notification text read | [M] `https://nityalegal.com/notifications.html` and its copy of 01/2026, 2026-09-18 | no
53 | 342, limits | Sections 5.1 and 5.2 decided nowhere | Rewritten: now proposed resolutions awaiting D08 | [P] | yes
53 | 344, limits | The tax heading | Kept `UNVERIFIED:`, needs chartered accountant | cannot be checked from here | yes
54 | 291, section 5.1 | The 2026 rate notification and the tax heading | Notification closed as in 53; heading kept `UNVERIFIED:` with needs | [M] as above | yes, for the heading
54 | 390, limits | The tax heading | Kept, needs chartered accountant | cannot be checked from here | yes
53 | 345, limits | Notesnook's India page below 299 rupees | **Confirmed.** Essential ₹225.20 a month including tax, ₹188.52 billed annually; Pro ₹791.04 | [M] `https://notesnook.com/pricing`, 2026-09-18, served in rupees | no
52 | 328, section 5.3 | Notesnook's India pricing page | **Confirmed**, same reading as 53 | [M] as above | no
52 | 110, section 1 | No 2026 Stack Overflow AI page exists | **Confirmed** by re-probing the three 2026 paths (404) and the 2025 page (200) | [O] `curl -s -o /dev/null -w "%{http_code}"` against `survey.stackoverflow.co`, 2026-09-18 | no
52 | 327, section 5.3 | Every GitHub code search count in section 2 | **Partly checked and one claim fixed.** Re-ran three queries: AGENTS.md 501,760 (was 547,840), CLAUDE.md 532,480 (was 527,360), GEMINI.md 27,072 (unchanged). The "within four per cent" line was wrong in direction, rewritten to "about six per cent, and the order flipped". Counts stay `UNVERIFIED:` because the API total is approximate by design | [O] `gh api -X GET search/code -f q=... --jq .total_count`, 2026-09-18 | no
52 | 325, section 5.3 | OpenKnowledge beyond Tech Times: no repo, no stars | **Confirmed and extended.** Repo `inkeep/open-knowledge`, GPL-3.0, 4,251 stars, created 3 June 2026; uses Yjs (`get-ydoc.ts`, 323 code hits for `yjs`), so the CRDT claim holds. Added to section 3.1 | [O] `gh api repos/inkeep/open-knowledge` and `gh api search/code -f q="repo:inkeep/open-knowledge yjs"`, 2026-09-18 | no
54 | 391 and section 4.3 | Mistral free-tier training default unresolved, page 404 | **Resolved.** Opened the help article and commercial terms 4.2: Studio Free mode trains by default with an opt-out, and Labs or Preview models always train. Proposed: Mistral disqualified from the chain. Rejected: enabling with the opt-out recorded | [M] `https://help.mistral.ai/en/articles/347617-...` and `https://legal.mistral.ai/terms/commercial-terms-of-service`, 2026-09-18 | yes, it removes a provider the founder may want
54 | 328, section 7.1 | "Google Sans" family licence not found | **Resolved.** `google/fonts/ofl/googlesans/OFL.txt` exists: OFL 1.1, "Copyright 2025 The Google Sans Project Authors", no Reserved Font Name. Commits date from 11 September, so the earlier search missed it. `THIRD-PARTY-NOTICES.md` needs the text added, not my file | [O] `gh api repos/google/fonts/contents/ofl/googlesans` and its commit history, 2026-09-18 | no
54 | 392, limits | The same | Limits line rewritten | [O] as above | no
54 | 393, limits | Firebase terms page did not render | **Checked.** Renders now, last modified 2 September 2026. Firestore and Firebase Auth fall under the Google Cloud Platform Terms; footnote 1 says data is stored anywhere unless a location is selected. Tied to the section 3.5 fix. Whether Auth records honour the location kept `UNVERIFIED:` with needs counsel | [M] `https://firebase.google.com/terms`, 2026-09-18 | no
54 | 395, limits | Whether a subscription editor is an e-commerce entity | Opened the Gazette text and quoted rules 2(1)(a), 3(1)(b) and the 48-hour and one-month clocks. The reading points to yes, marked `INFERENCE:`. Kept `UNVERIFIED:` with needs legal opinion; `L12` builds the duties regardless | [M] `consumeraffairs.gov.in` Gazette PDF of G.S.R. 462(E), 2026-09-18 | no
54 | 396, limits | DPDP Rules 2025 and any section 16 transfer restriction, as they bear on the mirror | Opened Act section 16 and Rules rule 15 and quoted both: a negative list, no rule-15 requirement in force until 14 May 2027. Whether any country is notified kept `UNVERIFIED:` (secondary sources say none), needs legal opinion | [M] indiacode Act PDF and egazette 267650, 2026-09-18 | no
54 | section 3.6, Deletion row | "Not yet a founder decision": whether account deletion removes the mirror | Resolved as proposed: mirror files left in place, our grant revoked. Rejected deleting the mirror first. Also clears the `INFERENCE:` in the section 3.4 table row by reference | [P] D03 (the mirror is the person's copy), section 8 of this file | yes, a promise to users
57 | 64 to 65, section 2.1 | Grievance and takedown clocks carried from 54 | **Fixed** to match 54 section 3.3: 7 days, and 36, 3 and 2 hours. Section 6.1 row updated too. Not an `UNVERIFIED:` marker, but stale on the same evidence | [M] MeitY consolidated text of 10 February 2026 | no
57 | 139, section 3.4 | Export thresholds proposed, never timed | Rule decided as proposed: background when the build outlasts one request. Rejected a fixed count. The 200 figure kept `UNVERIFIED:` with needs a timed export | [P] no export exists to time | no
57 | 279, limits | The export timings | Kept `UNVERIFIED:`, needs a timed export on the built builder | cannot be checked, not built | no
57 | 280, limits | The 90-day shutdown notice has no founder agreement | Recommended 90 days, rejected 30. Marked needs founder, a promise to users | [P] section 5.2 | yes
57 | 283, limits | Support records: separate store or our own documents | Resolved as proposed: our own documents, one deletion path. Rejected a separate help-desk store | [P] section 6.2 and section 4.2 retention | no
