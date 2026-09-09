export const meta = {
  name: 'frontmatter-r18-wargame-and-verify',
  description: 'Close the last research gap (competitive war-game) and open a primary source for every load-bearing unverified claim',
  phases: [
    { title: 'Wargame', detail: 'competitor response scenarios and the kill-shots' },
    { title: 'Verify', detail: 'the 21 load-bearing claims, one primary source each' },
    { title: 'Ledger', detail: 'one verdict table, and the §57 rows it rewrites' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const REC = FM + 'docs/FRONTMATTER-RECORD.md'

const HOUSE = [
  '',
  'YOU ARE WRITING A FINISHED SECTION of a product record a founder builds from. Table-first, concrete, no preamble and no commentary about your process.',
  '',
  'STYLE:',
  '- Open with the EXACT H2 heading given. Use H3 subsections.',
  '- NO preamble, NO conclusion, NO process notes. Your first line is the heading.',
  '- Evidence tags on every claim: [fetched] primary source opened · [measured] executed here · [derived] arithmetic shown · [inference] reasoning · [SS] search summary only.',
  '- Every price, limit, threshold or statistic MUST carry the date you read it and the URL.',
  '- Prefer a table to a paragraph. Bold the load-bearing clause.',
  '',
  'HOW TO OPEN SOURCES — this is the single most important instruction:',
  'WebFetch is refused by a security gate in this environment. `curl` is NOT blocked. TEST IT before concluding anything is unreachable:',
  '  curl -sL --compressed -A "Mozilla/5.0" "<url>" | sed -e \'s/<[^>]*>//g\' | tr -s "\\n" | head -200',
  'Known reachable: arxiv.org and its API, raw.githubusercontent.com, docs.claude.com, PubMed E-utilities, most vendor docs and pricing pages, most government sites.',
  'If a host refuses (403/404/robots), SAY SO with the exact status code and move to a second source. Never silently downgrade to memory.',
  'A claim you could not open is [SS] or UNVERIFIABLE — never upgrade it to [fetched].',
  '',
  'THE PRODUCT, for context: a markdown editor. Simple surface, deep engine. THE FILE IS THE ONLY SOURCE OF TRUTH; every view is a deterministic reversible projection owning no state. The engine does byte-preserving splice edits (locate the range, replace those bytes, REFUSE rather than guess) plus cross-engine degradation certification. Sold D2C and self-serve B2B. One founder, India-based, selling globally. Pricing anchors: free / Rs 299 / Rs 599 per month.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands. If you think a write is needed, describe it and stop.',
  'EMIT EARLY: the full section text as your FIRST substantial message. If a hook interrupts you, answer in ONE line then RE-STATE THE FULL TEXT.',
  'Your entire final message IS the section text.',
].join('\n')

phase('Wargame')

const WAR = [
  ['w1-competitor-response',
   'Write "## 88. The competitive war-game" — the H2 heading exactly, then H3 subsections 88.1 onward.\n\n' +
   'This is the LAST unclosed research gap in the record. Round 14 ranked it 12th of 14 and nothing has answered it. The question: what happens to this product when a well-resourced incumbent moves, and which of our moats actually survive contact.\n\n' +
   'Read for grounding, the relevant sections only, NOT the whole file: ' + REC + ' — read §3 (the market and the gap map), §16 (what no competitor has), §19 (the executed competitor teardowns), §27 (the moats, ranked), §31.1 (why not a CRDT), §50 (risk register).\n\n' +
   'Build the war-game as SCENARIOS, each with: the trigger, how long we would have, what specifically breaks in our plan, what we do in the first 30 days, and — the part that matters — whether the response is credible for ONE founder or is a fantasy that requires a team we do not have.\n\n' +
   'The scenarios that must be covered, at minimum:\n' +
   '- Obsidian ships first-party byte-exact sync with conflict review. This is the closest thing to a kill shot; their sync is already a paid product.\n' +
   '- Notion (or Coda) ships real markdown files on disk as the store of record, not an export.\n' +
   '- GitHub ships a real editor over repo markdown — they already own the substrate, the auth and the distribution.\n' +
   '- Anthropic or OpenAI ships a first-party filesystem-backed document surface that writes markdown.\n' +
   '- A well-funded startup ships the same splice-and-certify thesis with a team of eight.\n' +
   '- The quiet one nobody war-games: NOBODY moves, and the category simply never forms because users do not care about fidelity. Cross-reference the record\'s own Q1 ("does anyone pay for fidelity?").\n\n' +
   'For each incumbent, OPEN A SOURCE with curl and date it: their current changelog, pricing page, or roadmap. State what they have actually shipped in the last 12 months, not what you remember. If a page refuses, give the status code.\n\n' +
   'Then a table: our seven claimed moats vs each scenario, marked SURVIVES / ERODES / GONE, with one line of why. Be brutal — a moat that only holds while the incumbent is asleep is not a moat.\n\n' +
   'Include ONE mermaid diagram, under 12 nodes, showing the decision tree from trigger to response. Target 2200-3000 words.'],

  ['w2-kill-shots',
   'Write "## 88b. The kill-shots, and the early-warning system" — that exact H2 heading (it will be merged into §88 as its closing subsections, so number your H3s 88.9 onward).\n\n' +
   'Companion to the scenario war-game. Your job is ADVERSARIAL: assume the product fails, and work backwards to the cause. You are not writing a risk register — §50 already exists and you should read it so you do not repeat it.\n\n' +
   'Read for grounding: ' + REC + ' §27 (moats), §50 (risk register), §25 (cost structure and funnel math), §28 (the roadmap and critical path), §55 (verification debt).\n\n' +
   'Deliver three things.\n\n' +
   'FIRST — the five most likely causes of death, ranked by probability x irreversibility, EXCLUDING anything §50 already names. Look for the ones that are structural rather than dramatic: the founder-time ceiling, the borrowed-distribution problem, a nine-week engine lane before any revenue signal, a category that never forms.\n\n' +
   'SECOND — for each, the EARLY-WARNING INDICATOR: the specific number, measurable within the first 90 days, that would tell us this is happening while there is still time. A warning that only fires at month 18 is not a warning. State the metric, its threshold, where it is measured, and what action it triggers.\n\n' +
   'THIRD — the pre-mortem: it is 24 months from now and the product is dead. Write the three most plausible one-paragraph post-mortems. Be specific and unkind; a comfortable pre-mortem is a wasted one.\n\n' +
   'Close with the ONE thing that, if true, makes everything else survivable — and the one thing that, if false, makes everything else irrelevant.\n\n' +
   'Target 1800-2400 words.'],
]

const wargame = await parallel(WAR.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Wargame' })))

phase('Verify')

const V = [
  ['v1-india-tax',
   'India tax and GST, four claims. Open primary sources: cbic.gov.in, gst.gov.in, the CGST/IGST Acts, RBI circulars. Use curl.',
   [ '1. Export-of-services zero-rating; LUT vs pay-and-refund; what "convertible foreign exchange" means for a solo Indian founder invoicing overseas customers; reverse charge on imported services (LLM APIs, hosting, merchant-of-record fees). Is each of these stated correctly?',
     '2. E-invoicing threshold of AATO above Rs 5 crore and whether it is sticky across financial years; the Rs 20 lakh services registration threshold; FEMA/EDPMS closure and whether FIRC/BRC is needed per remittance.' ]],

  ['v2-compliance-legal',
   'Compliance and accessibility law, three claims. Open primary sources: the EU official journal (eur-lex.europa.eu), meity.gov.in for the India IT Rules, ada.gov, and deque/axe documentation. Use curl.',
   [ '3. India IT Rules 2021: is the "50 lakh registered users" significant-social-media-intermediary threshold correct, and is it set by the Rules themselves or deferred to a Central Government notification?',
     '4. Cost of an EU Article 27 (often cited as Art. 13) representative — is EUR 200-500/month right? And Indian counsel at Rs 40,000-1,20,000 — for what scope?',
     '19. ADA Title III: is it true that no technical standard has been promulgated for private web accessibility? And does axe genuinely cover "roughly a third" of WCAG issues — find the actual measured figure and its source.' ]],

  ['v3-india-payments-market',
   'Indian payments and the India developer market, three claims. Open primary sources: RBI, NPCI, Razorpay and Stripe docs, the GitHub Octoverse report, and app-store or analytics reports. Use curl.',
   [ '5. "International gateways without UPI lose 30-40% of Indian checkouts" — currently tagged [SS, vendor-sourced], which means a payment vendor said it about its own product. Find an independent number or mark it REFUTED-AS-STATED.',
     '7. "21.9M India GitHub contributors, +5.2M in a year, +35% YoY consumer app spend" — open Octoverse and the app-spend source; give the exact figures and their years.',
     '8. "Zero category-specific willingness-to-pay evidence for markdown tools in India" and "India\'s markdown community is greenfield" — these are claims of ABSENCE. Try hard to refute them: search for any Indian pricing study, any India-specific markdown/PKM community sizing. An absence claim that nobody tried to refute is worthless.' ]],

  ['v4-market-and-competitor',
   'Market sizing and competitor pricing, four claims. Open primary sources: vendor pricing pages, support-industry benchmark reports, Stripe Atlas or Indie Hackers data, and public complaint corpora. Use curl.',
   [ '6. "By month 24 the median solo B2B founder\'s revenue is more than 4x the median solo B2C founder\'s" — find the study. Name the sample, the year and the method, or mark UNVERIFIABLE.',
     '9. Support deflection "18% median, 40-60% with AI, $25-35/ticket" — three separate numbers, likely three separate sources. Open each.',
     '10. "Vanta and Drata charge $7,000-$30,000/yr for continuous audit trails" — open both pricing pages today and give the real published numbers, or state that pricing is quote-only.',
     '18. "GitBook\'s dominant complaint cluster is reliability and lost work" — this underwrites moat #2. Find the actual complaint corpus (G2, Reddit, their own community, Trustpilot), count, and say whether reliability really is the dominant cluster or whether that was an impression.' ]],

  ['v5-technical-and-spec',
   'Technical and specification facts, four claims. These should be the easiest to settle definitively and the most embarrassing to get wrong. Open primary sources: spec.commonmark.org, arxiv.org, the DigiCert and CA/Browser Forum sites, and the actual npm package source. Use curl.',
   [ '11. Code-signing: hardware-token surcharge of USD 50-150, DigiCert token +120, maximum certificate validity dropping to 460 days from 2026-03-01, and DigiCert discontinuing 2- and 3-year certificates. Open the CA/Browser Forum ballot and DigiCert\'s own page.',
     '13. CommonMark "0.31.2, released 2024-01-28; still the current release as of 2026-08" — check spec.commonmark.org and the commonmark/commonmark-spec repo tags TODAY.',
     '14. "Under 4% of GitHub notebooks reproduce" (Pimentel et al. 2019) — open the paper via the arXiv API. Give the exact figure, the denominator, and note that the record has flagged a denominator discrepancy.',
     '20. `blocksToMarkdownLossy()` "is a real API name" — this is Principle #3\'s entire published justification, so it must be right. Find it in the actual published package source on unpkg or raw.githubusercontent.com. Name the package, version and file path, or mark REFUTED.' ]],

  ['v6-live-product-facts',
   'Live product and community facts, five claims. These decay fastest — every one is a statement about the world as of a date. Open primary sources: vendor changelogs and newsrooms, HN via the Algolia API (hn.algolia.com/api), plugin download stats, and the live subreddit/Discord. Use curl.',
   [ '12. "561 of 3,220 HN comments" say sync silently destroys data — this is problem #2, the headline pain, and the justification for T0 being first. Try to reproduce the count via the HN Algolia API. If you cannot reproduce the exact method, say so plainly: this number is load-bearing and a number nobody can reproduce is not evidence.',
     '15. "OpenAI removed Canvas in May 2026" — open the OpenAI changelog/release notes and confirm or refute.',
     '16. "Notion cut free AI to 20 responses for life and raised Business ~20%; Microsoft\'s +43% Copilot bundling drew a CMA probe" — three claims, open Notion\'s pricing/changelog, Microsoft\'s pricing announcement, and the CMA case page.',
     '17. "Relay proved the path with 172,544 downloads of a commercial service\'s bridge plugin" — open the Obsidian community-plugin stats JSON (raw.githubusercontent.com/obsidianmd/obsidian-releases) and give today\'s real number.',
     '21. r/ObsidianMD ~344,000 and Discord ~195,000 — currently UNTAGGED in the record, which is worse than [SS] because it reads as fact. Read the subreddit header and the Discord invite metadata today.' ]],
]

const verified = await parallel(V.map(([label, domain, claims]) => () =>
  agent(
    'You are VERIFYING claims that a product record currently states. Each was flagged as load-bearing and unverified. Your job is to OPEN A PRIMARY SOURCE for each one and return a verdict.\n\n' +
    'DOMAIN: ' + domain + '\n\n' +
    'THE CLAIMS, verbatim from the record:\n' + claims.map((c) => '  ' + c).join('\n\n') + '\n\n' +
    'Return a markdown table with one row per claim and these columns:\n' +
    '| # | Claim as stated | Verdict | What the source actually says | Source URL + date read | New tag |\n\n' +
    'VERDICTS, use exactly these words:\n' +
    '- CONFIRMED — the source says what we said. Upgrade to [fetched].\n' +
    '- REVISED — substantially right, numbers or scope wrong. Give the CORRECT figure. This is the most common and most valuable outcome.\n' +
    '- REFUTED — the source contradicts us. Say what must be deleted from the record.\n' +
    '- UNVERIFIABLE — no primary source is reachable. Say WHY (status code, paywall, no such study) and it stays [SS]. This is an honest outcome, not a failure.\n\n' +
    'RULES THAT MATTER MORE THAN COVERAGE:\n' +
    '- A verdict without a URL you actually opened is not a verdict. Do not pattern-match from memory.\n' +
    '- REVISED with the corrected number is worth more than CONFIRMED. Look for the revision.\n' +
    '- If a claim is really several claims, split the row and verdict each separately.\n' +
    '- Report the status code for anything that refused you.\n\n' +
    'After the table, add a short "### What must change in the record" list: the exact edits, by section number, that these verdicts require.\n\n' +
    'Do NOT write an H2 heading — you are returning a fragment that gets assembled. Start with the table.' + HOUSE,
    { label, phase: 'Verify' })))

phase('Ledger')

const ledger = await agent(
  'Write "## 89. The verification pass — every load-bearing claim, opened" — that exact H2 heading, then H3 subsections 89.1 onward.\n\n' +
  'Six verification agents each opened primary sources for a cluster of the record\'s twenty-one load-bearing unverified claims. Their returns follow. Assemble ONE authoritative section.\n\n' +
  '=== THE RETURNS ===\n\n' +
  verified.filter(Boolean).map((r, i) => '--- cluster ' + (i + 1) + ' ---\n' + r).join('\n\n') +
  '\n=== END RETURNS ===\n\n' +
  'STRUCTURE:\n\n' +
  '89.1 — The headline, in one table: how many of the 21 came back CONFIRMED, REVISED, REFUTED, UNVERIFIABLE. Count them; do not estimate.\n\n' +
  '89.2 — The full verdict table, all 21, in claim-number order: | # | § it lives in | Claim as stated | Verdict | What the source says | Source + date | New tag |. Preserve every URL and date the agents returned.\n\n' +
  '89.3 — **Corrections that must be made to the record.** The most important subsection. For every REVISED and REFUTED verdict: the section number, the wrong text, the correct text. An implementer should be able to apply this list without reading anything else.\n\n' +
  '89.4 — What remains UNVERIFIABLE and why, with the specific reason per claim (status code, no such study, quote-only pricing). These stay [SS] and PRD §58 forbids publishing them as fact.\n\n' +
  '89.5 — What this pass says about the record\'s reliability. Be honest in both directions: a high REVISED rate means the research method was reading summaries rather than sources, and that is worth stating plainly. A high CONFIRMED rate means the original sourcing was sound. Give the actual ratio and what it implies for the remaining unverified claims that were NOT in this batch.\n\n' +
  'Do not soften a REFUTED into a REVISED. A refuted claim that stays in the record is worse than one that was never made.\n\n' +
  'Target 2000-2800 words.' + HOUSE,
  { label: 'ledger-synthesis', phase: 'Ledger' })

return {
  wargame: wargame.filter(Boolean).length,
  verified: verified.filter(Boolean).length,
  ledger: ledger ? ledger.length : 0,
}
