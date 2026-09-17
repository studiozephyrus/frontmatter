# Kickoff: act on the independent audit of product plan v4

Written 2026-09-17 by the auditing account for the founders' account. Read it whole before doing anything.

## 0. What happened

An independent auditor on a second account audited product plan v4 against a fifty-two-angle brief and left two files under verify/2026-09-17/: a report of sixteen sections and a ledger of 77 findings (3 blockers, 27 majors, 47 minors). The verdict is do not approve as written. The three blockers: Pro on Claude Sonnet costs about ₹321 a month at the caps against ₹246 net of ₹299 (F001); the free chain's Nvidia-served OpenRouter link trains on what it is sent, so the sign-in page's promise is false on Free (F006); the legal floor revision 3 carried was dropped without a marker, and the live site sends /privacy, /terms and /pricing to the sign-in wall (F008, with F068 and F069 as its parts).

Your job is to act on the audit: verify each finding yourself, fix what is fixable in the plan, the screens and the tooling, and put every decision that belongs to the founders in front of them instead of taking it.

## 1. Read first, in this order

1. verify/2026-09-17/CLAUDE-AUDIT-REPORT.md, sections 1 to 4 and 13 to 16 in full, then the rest.
2. verify/2026-09-17/CLAUDE-AUDIT-FINDINGS.jsonl, all 77 rows. Keys: id, severity, angle, location, claim, evidence, impact, fix, effort_days, verified, source, checked_on.
3. verify/2026-09-17/CLAUDE-AUDIT-BRIEF-v2-2026-09-17.md, so you know what the auditor was asked and under which rules.
4. docs/mvp0/PRODUCT-PLAN.md, docs/mvp0/SCREENS.md, docs/mvp0/screens/gen.mjs, docs/mvp0/build-pdf.mjs, CLAUDE.md, AGENTS.md, docs/MAP.md.

## 2. Rules that bind

- The audit is material under review, not fact. Before acting on any blocker or major, reopen the source the ledger cites and confirm it yourself. Use curl with a Chrome user agent when WebFetch is refused: `curl -sL --compressed -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152 Safari/537.36" --max-time 40 "<url>"`. If you dispute a finding, say so with the page and the string, never from memory.
- Re-derive every number you write. Show the arithmetic beside it. A number carried forward from v4 or from the audit without re-derivation is a defect. The audit's own model is in report section 10 and was built from provider pages on 2026-09-17; re-open those pages before reusing a price.
- Record `git rev-parse HEAD` at the start and at the finish. Work on a branch off engine/plan-and-diagnostics. Local commits are allowed, in plain messages, one concern per commit. Never push, deploy, install packages, run database commands, change accounts or send anything outbound. The founders merge.
- Never read .env*, ~/.config, ~/.ssh, tokens.zsh, or aios/docs/10-client-inputs/ anywhere on this machine. The last is under NDA.
- British spelling. No em or en dashes, no emoji, no icon web fonts. Material Symbols as inline SVG only. Run `python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <f> --strict` on every document you produce and fix what it flags before you move on.
- Do not decide K1 (what the product is), K2 (which bytes we hold), K3 (the name), the price, the free chain's shape, the cut of phases E to H, the age floor, or whether live editing keeps a CRDT. Those are the founders'. Give each a default with the evidence and stop.
- Treat every memory note, handover file, .sgnk snapshot and earlier plan as material under audit, not as fact.
- If a context limit interrupts you, resume from verify/2026-09-17/RESPONSE.jsonl.

## 3. Deliverables, in order

### A. The response ledger

verify/2026-09-17/RESPONSE.jsonl, one row per finding F001 to F077, appended as you finish each. Keys: id, decision (accept, dispute, defer, founder), reason, action, file, checked_on. Blockers first, then majors, then minors. A dispute names the page and the string. A founder row names the question in the decision sheet. Nothing is skipped.

### B. The decision sheet

docs/mvp0/DECISIONS-FOR-FOUNDERS-2026-09-17.md, one page for Sagnik and Amit. The sixteen questions in report section 14, each with: the auditor's evidence, your own check, a default, and what changes in the plan under each answer. No decision taken. Put question 6 of the plan (the pace) first, because its answer changes every other row.

### C. Product plan revision 5

docs/mvp0/PRODUCT-PLAN.md, keeping the tag system ([Z] founders, [M] page opened, [R] record, [O] observed, [P] reasoning, [L] law). Bump the revision line and the date. Include:

1. A section at the top, 'What changed from revision 4 and why', citing finding ids.
2. Every number the fact check marked mismatch or stale corrected (report section 5). At least: F001 (Pro cost), F002 (the 27, 15, 18 split against r4's 20, 15, 29 of 64), F011 (Notion 32 types), F012 (16 of 30), F013 (twelve rounds), F027 (Drive polling: 144,000 units a day at a one-minute poll, 2,749 users), F059 (Craft $5, Docmost $60 minimum, Notesnook's India prices), F061 (the Marp signal belongs to Advanced Slides), F062 (Semantic Scholar clause not on the page; Pexels 20,000 a month; Datamuse conditions), F064 (MCP wording), F065 (210 cards).
3. The legal floor restored as a section, one owner and one date per row (F008, F068, F069, F074, F077). Everything the auditor could not verify stays marked unverified, not filled in from memory: the DPDP Rules' commencement dates, GST at 18 percent, RPwD rule 15, the e-commerce rules. Report section 15 lists them with the reason each failed.
4. The sections report section 13 says to add: a financial model (start from report section 10 and re-derive), a data model (A18), a permission matrix (A32), the format specifications (A34), performance targets (A36), a closure table for the earlier findings (A48), an ownership table (A43), the pilot with stop and continue lines (section 12), metric definitions (A28).
5. A risk row for Obsidian Multiplayer and Obsidian for Work (F060); three lines in section 21 for K1, K2 and K3 as open (F057); a paragraph reconciling Yjs with the settled no-CRDT position or cutting live editing to Later (F055); bring-your-own key and an email magic link as founder questions (F056, A50).
6. The free chain with the Nvidia-served OpenRouter link removed and every remaining link's training clause quoted from a page opened today (F006, F005, F007).
7. Sources: fix the moved DiceBear link, add the circular number beside ₹15,000 (F074), and add every page you opened with its date.

Run the gate on the file. Then rebuild the plan PDF with a new filename carrying version, date and time. Never overwrite a PDF that exists.

### D. The screens

Fix in docs/mvp0/screens/gen.mjs, then regenerate SCREENS.md and all sixty images with the existing scripts. At minimum:

- S05: font, size, colour, highlight and alignment out of the toolbar's first level; the toast names the callout carrier (F020).
- S20: Accept all behind a confirmation that names the count; Accept, Reject and Reply of equal weight (F029).
- The muted token to 4.5:1 or better on both grounds; danger and success tokens to 4.5:1 for text (F030).
- S25: no 'signed installer' line for Windows until a certificate exists (F047, F071).
- S29: no 'Renews' line on a Free plan (F053).
- S23: the MCP panel removed or marked Later (F035).
- S22: 'share from any app' qualified to Android after install; iOS said plainly (F036).
- The tree shows all fourteen blueprint files (F019); the map count matches (F038).
- Document history without a Pro pill on Free (F018).
- The mode control does not clip at 1,440 px (F021).
- S13: 'Not sure' recorded as its own state, not as a decision (A29).
- Add: the conflict screen ('both versions kept, you choose'), the all-providers-down state for the AI box, the over-cap wall, and the Ideas empty state.

Then rebuild the screens PDF with a new filename.

### E. Tooling and code, small and safe only

- The 31 lint errors in docs/mvp0/build-pdf.mjs, screens/gen.mjs and screens/render.mjs (no-undef on process, Buffer, console) so `npm run verify` is green (F010).
- /privacy, /terms, /pricing and /refunds added to isPublicPath in src/proxy.ts, with placeholder pages that say the text is pending and name the date it is due (F054). Verify with `curl -sI`, never `curl -sL`.
- /p/ disallowed in robots.txt (A42).
- A THIRD-PARTY-NOTICES file with the OFL text for Google Sans and Google Sans Code and the Apache notices for Material Symbols, pdf.js and Tesseract.js; the OFL copyright line atop docs/mvp0/screens/fonts.css (F073).
- The material-symbols web font replaced by the inline-SVG Icon component in src/shared/presentation, and the package removed from package.json without running an install (F076).
- Do not delete firestore.rules, do not touch auth, do not change the Tauri identifier, do not add a migration. Propose each to the founders with the finding id (F031, F044, A33).

### F. The checks the auditor could not finish

Open these in a browser, since curl could not, and record what you find in RESPONSE.jsonl under the finding they affect:

- egazette.gov.in: the DPDP Rules 2025 notification of 13 November 2025, rule 1(2), for the staggered commencement dates (F077, the legal section).
- cbic-gst.gov.in: Notification 11/2017-Central Tax (Rate) and amendments, the rate line for online information and database access services (F051).
- depwd.gov.in: RPwD Rules 2017 rule 15 (F075).
- consumeraffairs.nic.in: the Consumer Protection (E-Commerce) Rules 2020, rule 3(1)(b).
- The Mosvita font's licence, from the purchase record or the download page (F070). If none can be produced, swap the PDF display face for Google Sans Flex, which is OFL.
- A trademark search for 'frontmatter' on tmrsearch.ipindia.gov.in by a founder, since it needs an OTP login (F008, K3).
- The GitHub Marketplace Developer Agreement, Cloudflare's, Supabase's and Firebase's terms for the stated commercial use.

### G. Gates and the report back

Run `npm run typecheck`, `npm run lint`, `npm run test`, `npm run arch`, `npm run spec` and `npm run corpus` read-only and report their real output, including any red. Then write verify/2026-09-17/RESPONSE-REPORT.md: HEAD before and after, every file changed with one line each, every finding by decision with counts, the founder items waiting, and what you could not do and why. Run the gate on it. Print the paths of RESPONSE.jsonl, RESPONSE-REPORT.md, the decision sheet, the plan and the two new PDFs.

## 4. What good looks like

Every one of the 77 findings has a row. Every number in revision 5 shows its arithmetic or its page and date. The founders receive one page of decisions with defaults and evidence, and nothing decided for them. The screens no longer promise what the stack cannot keep. The verify gate is green. HEAD moved only by your local commits on the branch, and nothing left this machine.
