---
title: Response to the independent audit of plan v4
date: 17 September 2026
branch: audit-response/2026-09-17
status: deliverables A to G of the kickoff carried out; nothing pushed
---

# Response to the independent audit of plan v4

The founders' account read `verify/2026-09-17/CLAUDE-KICKOFF-v5-2026-09-17.md` and carried out deliverables A to G in order, on the branch `audit-response/2026-09-17`, with local commits only. Nothing was pushed, deployed, installed or sent.

## 1. The commits

HEAD before the first commit on this branch: `e0ac6fa`.
HEAD after the last content commit: `aee49d4`. The commit that carries this report and the final ledger follows it, and its hash is printed by the shell that made it.

Commit | What it carries
`a44b0c1` | The audit itself: the two briefs, the 31 research reports, the audit report and its 77 findings, the kickoff, the manifest and the first response ledger.
`4e93c44` | The decision sheet for the founders, sixteen questions with a default each.
`b2f5897` | The app: public legal pages, inline-SVG icons, third-party notices, a green lint gate.
`4f7d567` | The PDF builder embeds Google Sans and drops Mosvita (F070).
`4af3c50` | Product plan v5, the screens sheet, and the two v5 PDFs.
`f6b4466` | Screens v5: the generator and all 68 renders.
`90cb703` | The icon component reads no env, so the arch gate is green again.
`aee49d4` | CLAUDE.md names the change queue instead of review state.

## 2. Every file changed since `e0ac6fa`

File | One line
`CLAUDE.md` | The "review state" bullet replaced by a paragraph on the change queue, which is what the plan now builds.
`THIRD-PARTY-NOTICES.md` | New: the Open Font License for Google Sans Code and the Material Symbols licence.
`docs/mvp0/DECISIONS-FOR-FOUNDERS-2026-09-17.md` | New: sixteen founder questions, the pace first, each with evidence and a default.
`docs/mvp0/PRODUCT-PLAN.md` | v4 to v5: thirty sections, every finding answered in place, the legal floor restored with gazette ids and quotes.
`docs/mvp0/SCREENS.md` | Regenerated for 34 screens from the plan's own screen sections.
`docs/mvp0/build-pdf.mjs` | Embeds the Google Sans faces from the screens' fonts.css; Mosvita gone; display weight 700.
`docs/mvp0/frontmatter-Product-Plan-v5-2026-09-17-0738.pdf` | New: the plan, 45 pages, fonts GoogleSans-Regular, GoogleSans-Bold and GoogleSansCode-Regular only.
`docs/mvp0/frontmatter-Screens-v5-2026-09-17-0738.pdf` | New: the screens, 20 pages, same faces.
`docs/mvp0/screens/fonts.css` | The licence comment prepended.
`docs/mvp0/screens/gen.mjs` | Contrast tokens retuned and asserted, the toolbar folded into More at 1440, incl. GST on S29, four new states S31 to S34, the twelve-button toolbar, the doc switch.
`docs/mvp0/screens/render.mjs` | Empty catch blocks carry a comment, so lint passes.
`docs/mvp0/screens/s01 to s34, desktop and phone` | All 68 PNG renders regenerated (counted, not listed).
`eslint.config.mjs` | A Node-globals override for the scripts and the docs generators.
`public/llms.txt` | New: the machine-readable site description the plan promises.
`src/app/(public)/pending-legal-page.tsx` | New: one placeholder component for the four legal pages, due 15 October 2026.
`src/app/(public)/privacy/page.tsx`, `terms`, `pricing`, `refunds` | New: the four public pages, each rendering the placeholder.
`src/app/globals.css` | The Material Symbols web font import replaced by a comment; icons are inline SVG now.
`src/app/robots.ts` | Disallows `/p/` so unlisted pages stay unlisted.
`src/modules/share/domain/slug.ts` | The four legal paths added to the reserved slugs.
`src/proxy.ts` | The four legal paths added to the public paths.
`src/shared/presentation/GoogleIcon.tsx` | Renders inline SVG paths; the dev-only env check removed after the arch gate flagged it.
`src/shared/presentation/material-symbol-paths.ts` | New: 39 Material Symbol paths generated from the official SVGs.
`verify/2026-09-17/CLAUDE-AUDIT-BRIEF-v1`, `v2` | The brief the auditing account ran.
`verify/2026-09-17/CLAUDE-AUDIT-FINDINGS.jsonl` | The auditor's 77 findings.
`verify/2026-09-17/CLAUDE-AUDIT-REPORT.md` | The auditor's report, sixteen sections.
`verify/2026-09-17/CLAUDE-KICKOFF-v5-2026-09-17.md` | The kickoff this response follows.
`verify/2026-09-17/GPT6-AUDIT-BRIEF-v2`, `v2.1`, `v2.2`, `GPT6-VERIFY-PROMPT.md` | The earlier briefs written for the other model, kept for the record.
`verify/2026-09-17/MANIFEST.md` | What is in the folder and how it was made.
`verify/2026-09-17/research/` | The 31 research reports behind the audit (counted, not listed).
`verify/2026-09-17/RESPONSE.jsonl` | The ledger: 77 rows, one per finding, every row checked today.
`verify/2026-09-17/RESPONSE-REPORT.md` | This report.

## 3. The findings by decision

Decision | Count | Which
accept | 72 | Every finding not named below; each row carries the reason, the action taken and the file it landed in.
founder | 4 | F056 bring-your-own key (question 10), F057 K1, K2 and K3 (questions 5 to 7), F045 the stale firestore.rules the kickoff forbids deleting (question 13's account move covers it), F077 the age floor (question 12).
dispute | 1 | F040, partly: the Firestore Mumbai pricing page is a JavaScript shell to curl, so neither the research's reading nor the auditor's can be matched to the page today; both readings are shown in the plan with the difference stated.

Total 77. Every row's `checked_on` is 17 September 2026.

## 4. The checks the auditor could not finish (deliverable F)

The four government pages refused curl from this machine as they had refused the auditor's. They were opened in the browser pane instead, and where a site would not answer at all, the Gazette of India's own search and PDFs were used, read in place with a PDF text extractor loaded into the page.

- DPDP Rules 2025 (F077). Gazette CG-DL-E-14112025-267650, G.S.R. 846(E) of 13 November 2025: rules 1, 2 and 17 to 21 in force on publication; rule 4 one year after; rules 3, 5 to 16, 22 and 23 "eighteen months after the date of publication of this Gazette". The Act's commencement, CG-DL-E-14112025-267647, G.S.R. 843(E): sections 7 to 10, section 9 among them, eighteen months from publication on 14 November 2025, so 14 May 2027, computed in Python.
- GST rate (F051). The Central Board of Indirect Taxes and Customs' tax information portal, through the portal's own download route: Notification 11/2017-Central Tax (Rate), serial 22, "Heading 9984 Telecommunications, broadcasting and information supply services", central tax 9, so 18 percent with the state half. The 2025 amendments 05/2025 and 15/2025 carry no entry for heading 9984.
- RPwD rule 15 (F075). depwd.gov.in loaded and links the 2017 rules to upload.indiacode.nic.in, which refused every route, as did divyangjan.depwd.gov.in. The Gazette gave the draft Rights of Persons with Disabilities (Amendment) Rules, 2026, CG-DL-E-23072026-274669 of 23 July 2026, which replaces rule 15(1)(c) with IS 17802 accessibility standards for every website, app or piece of software offered to persons in India, with a published conformance report. A draft under consultation.
- E-Commerce Rules 2020. consumeraffairs.nic.in answered nothing from the sandbox or the browser. The Gazette gave G.S.R. 462(E), CG-DL-E-23072020-220661: rule 2(1)(a), rule 3(1)(b) and the rule 4 duties, and an amendment of 10 September 2026, CG-DL-E-10092026-276125, that makes the National Consumer Helpline partnership a duty.
- Mosvita (F070). No licence field in the font and no purchase record available, so the PDF display face is now Google Sans, which the screens already embed under the Open Font License. The v5 PDFs carry no Mosvita, checked by reading their font entries.
- Trademark (F008, K3). Needs an OTP login by a founder; it stays on the decision sheet as question 7.
- Provider terms. GitHub's Marketplace Developer Agreement governs "publishing Listings on GitHub Marketplace", and the plan lists nothing there. Cloudflare's self-serve agreement, clause 2.2.1(h), bars collecting card details on a property receiving Free Services, so card entry stays on Razorpay's checkout or the zone moves to a paid plan; its developer platform terms say "Unless otherwise agreed, Cloudflare does not use any Customer Content to train generative AI tools". Supabase's terms restrict reselling the Services, not building on them. Firebase's terms page did not render outside a browser, and Firebase leaves the stack in phase A.

## 5. The gates (deliverable G)

Gate | Result
typecheck | exit 0.
lint | exit 0, zero warnings.
test | 100 files, 1,598 passed, 6 expected failures, 4.9 seconds.
arch | red on the first run: one `process.env` read in `GoogleIcon.tsx`, a file from this branch. The read was removed; second run 0 violations across 214 files.
spec | 4 specs, 0 errors, 0 warnings.
corpus | 8,513 of 8,513 byte-identical.

The writing gate passed on the plan, the screens sheet, the decision sheet and this report, with zero dashes in each.

## 6. Founder items waiting

The sixteen questions on `docs/mvp0/DECISIONS-FOR-FOUNDERS-2026-09-17.md`, the pace first: the pace, the Pro price and routing, the free chain and the sign-in promise, the legal floor and the grievance officer, K1, K2, K3, live editing and the ban on conflict-free replicated data types, the free caps, bring-your-own key, desktop before or after sync and who signs Windows, the age floor, the accounts that move to the company, the twenty hand-made kits, the pilot's stop and continue lines, and which earlier positions stand. Beyond the sheet: the trademark search, the Mosvita purchase record if they want the face back, the chartered accountant's reading of which GST heading a subscription editor falls under, and counsel's reading of section 46 with rule 15 and of the e-commerce rules.

## 7. What could not be done, and why

- consumeraffairs.nic.in, upload.indiacode.nic.in and divyangjan.depwd.gov.in answered nothing from the sandbox or the browser pane, so their documents were read from the Gazette instead; the 2017 disabilities rules themselves were not opened, only the 2026 draft that restates rule 15's history.
- Firebase's terms and Firestore's Mumbai prices are JavaScript shells to curl, so F040 stays a partial dispute with both readings shown.
- The single 2026 Central Tax (Rate) notification was not opened.
- The e-commerce amendment's commencement date extracted as "st January" with no year, so the plan does not state it.
- The trademark search needs a founder's OTP.
- The OpenRouter training flag the auditor's worker read could not be reproduced; F006 was accepted on the plan's own rule that an unopened term excludes a provider.
- Every replayed number in the plan is labelled SIMULATED in its sentence, per the standing rule.

## 8. Paths

- `verify/2026-09-17/RESPONSE.jsonl`.
- `verify/2026-09-17/RESPONSE-REPORT.md`.
- `docs/mvp0/DECISIONS-FOR-FOUNDERS-2026-09-17.md`.
- `docs/mvp0/PRODUCT-PLAN.md`.
- `docs/mvp0/frontmatter-Product-Plan-v5-2026-09-17-0738.pdf`.
- `docs/mvp0/frontmatter-Screens-v5-2026-09-17-0738.pdf`.
