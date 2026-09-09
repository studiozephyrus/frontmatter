// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r22-ecosystem-fusion-and-money',
  description: 'The niche problem worth solving, which shipped products genuinely fuse with frontmatter, and how it gets funded',
  phases: [{ title: 'Fusion', detail: 'the niche problem, the fusion map, and the money' }],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const REC = FM + 'docs/FRONTMATTER-RECORD.md'
const ECO = '/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md'

const HOUSE = [
  '',
  'YOU ARE THE THIRD CO-FOUNDER and this round is about focus, not accumulation. The founder\'s exact words: "Don\'t make it cluttered or messy. Don\'t make it so much that it spoils the food."',
  '',
  'So the bar for this round is SUBTRACTION. A report that lists twelve opportunities has failed. A report that names one, defends it, and explains why the other eleven are distractions has succeeded.',
  '',
  'STYLE:',
  '- NO H2 heading, NO section number — you return a RESEARCH REPORT to be synthesised.',
  '- Open with your single sharpest conclusion in one sentence. Then the evidence.',
  '- Tables over prose. Evidence tags: [fetched] source opened · [measured] counted here · [derived] arithmetic shown · [inference] reasoning · [SS] unverified.',
  '- Numbers carry the date read and the URL.',
  '- Be willing to conclude that the answer is "none of these" or "do not do this". That is a valid and valuable finding.',
  '',
  'SOURCES: WebFetch is refused by a security gate here; `curl` is NOT. Test it before concluding anything is unreachable.',
  '  curl -sL --compressed -A "Mozilla/5.0" "<url>" | sed -e \'s/<[^>]*>//g\' | tr -s "\\n" | head -300',
  '  HN: curl -sL "https://hn.algolia.com/api/v1/search?query=<q>&tags=comment&hitsPerPage=100"',
  '  Reddit: curl -sL -A "Mozilla/5.0" "https://www.reddit.com/r/<sub>/search.json?q=<q>&restrict_sr=1&t=year&limit=100"',
  '  GitHub: curl -sL "https://api.github.com/search/repositories?q=<q>&per_page=50"',
  'If a host refuses, report the status code and use another. Unopened is [SS], never [fetched].',
  '',
  'THE FOUNDER\'S SHIPPED WORK, which is the raw material for any fusion argument. Read the studio source of truth at ' + ECO + ' — it is the authoritative register. The personal-portfolio slice, for orientation:',
  '  Own SaaS: HQ (ops control plane over GitHub/Vercel/Cloudflare/Supabase) · sgnk-md (GitHub-backed markdown vault, graph, search, inline AI; web + native macOS via Tauri) · sgnk CareerOS (AI career platform with credits and feature governance) · INW Invoices + API (GST invoicing/inventory for Indian SMBs) · Markex (social scheduler + cron publishing agent) · Advox (citation-gated legal AI for India, RAG, dual workspaces) · stock and trade (Indian-equity decision OS and screener) · pdf (~20 client-side PDF tools) · skills-registry (one canonical AI-skill registry synced to many surfaces)',
  '  Client-embedded: Perccent (fintech — docs hub, MDX knowledge base, brand microsite, BI/WhatsApp reports) · Travox (travel-agency TMS with AI-OCR) · GearUp (garage management) · Clinix/Dox (clinic ops) · Bricklynn',
  '  Community: Hack4Bengal (founder; eastern India\'s largest in-person hackathon, multi-season platforms)',
  '  Design: the sgnk design system · Brand OS (brand-book builder with AI copy) · several client brand sites',
  '  Research: adem (Steenrod algebra) · monograph (physics visualisation) · lossless',
  '  Also: an orchestration substrate (AIOS) — skills, hooks, evals, a trace ledger, a complexity gate, a shadow-promote ladder — that governs how the founder himself works with AI.',
  '',
  'FRONTMATTER, the product in question: a markdown editor. Simple surface, deep engine. The file is the only source of truth; every view is a deterministic reversible projection owning no state. The engine does byte-preserving splice edits — locate the range, replace exactly those bytes, REFUSE rather than guess — plus cross-engine degradation certification. Emerging thesis: it generates the artefacts of product development and hands the user a context pack their own AI acts on.',
  '',
  'CONSTRAINTS: two founders. India-based, selling globally. Very small AI budget. Near-zero cost at 100 users, predictable at 10,000. One person on call. Free / Rs 299 / Rs 599.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands.',
  'EMIT EARLY: the full report as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL REPORT.',
  'Your entire final message IS the report.',
].join('\n')

phase('Fusion')

const R = [
  ['t1-the-niche-problem',
   'NAME THE ONE PROBLEM. Not a market, not a category — a specific thing a specific person cannot do today, which AI automation over markdown could actually solve, and which nobody has solved well.\n\n' +
   'Method, and do it in this order:\n' +
   '1. Go find unsolved problems in the wild. Mine HN "Ask HN", r/ExperiencedDevs, r/smallbusiness, r/agency, r/ProductManagement, r/consulting and GitHub issues for the shape "I still do X by hand" / "there is no good tool for" / "we ended up building our own". Count and quote.\n' +
   '2. Filter that list HARD against what a two-person team with a byte-exact markdown engine can actually deliver. Most will fail this filter — say so.\n' +
   '3. Filter again against: will a lab or an incumbent solve this for free within eighteen months? If yes, it is not a business.\n' +
   '4. What survives both filters is the candidate set. It should be small. If it is empty, SAY SO — that is the most important finding this round could produce.\n\n' +
   'Then, for the top candidate: who has it, how often, what they do today, what they pay for the workaround, and why the obvious incumbent has not taken it.\n\n' +
   'Be specific about the shape of a problem worth solving here: recurring rather than one-off · painful enough to pay for rather than merely annoying · currently solved by a manual ritual rather than by nothing · and where being WRONG is expensive, because that is where refuse-rather-than-guess is worth money.\n\n' +
   'Close with the one-sentence problem statement, and the strongest argument that it is not actually a problem.\n\n' +
   'Target 2400-3000 words.'],

  ['t2-fusion-map',
   'DECIDE WHAT FUSES AND WHAT MUST BE LEFT ALONE. Read ' + ECO + ' properly — it is the authoritative register of what has actually shipped.\n\n' +
   'The founder has roughly twenty shipped things. The instinct to combine them is exactly how a focused product becomes an unsellable platform, so your default answer for each is NO, and each YES must be earned.\n\n' +
   'Produce the map: | Product | What it does | Does it fuse with frontmatter? | If yes, the MECHANISM (not the theme) | If no, why not | What it costs to fuse |\n\n' +
   'A real mechanism is a shared file format, a shared engine, or a shared buyer. "They are both AI" is not a mechanism. "Both write markdown into a git repo the user owns" is.\n\n' +
   'Pay particular attention to these, because they are the plausible ones and deserve a real answer rather than a reflex:\n' +
   '- **sgnk-md** — a GitHub-backed markdown vault with graph, search and inline AI. This is either frontmatter\'s predecessor, its competitor, or the same product under two names. The record already flags "sgnk-md vs frontmatter" as open decision D1, with 145 byte-identical files and 12 diverged. **Settle it.** Merge, supersede, or keep separate — and say what happens to the existing users and the native macOS app either way.\n' +
   '- **skills-registry** — one canonical registry synced to many surfaces. That is structurally the same problem as one canonical document projected into many views. Same engine?\n' +
   '- **HQ** — an ops control plane. Is it the B2B admin surface frontmatter would otherwise have to build?\n' +
   '- **AIOS** — the orchestration substrate. Is it a product, a moat, or purely internal tooling? The record has productised it once already (§15); check whether that survives contact with this thesis.\n' +
   '- **Brand OS, Advox, CareerOS, Markex, INW, Travox, GearUp, Clinix, stock, trade, pdf** — for most of these the honest answer is that they share a founder and nothing else. Say so plainly where true.\n\n' +
   'Then the subtraction, which is the point of the report:\n' +
   '- **What to actively kill, park, or sell** so the founders can focus. A product that is not being developed is not free — it carries support, hosting, domain and attention cost. Name them.\n' +
   '- **The ONE fusion worth doing**, if any, with the argument for it and the honest cost.\n' +
   '- **The trap**: describe precisely how this ecosystem becomes an unfocused platform nobody buys, so the founders can recognise it happening.\n\n' +
   'Target 2400-3000 words.'],

  ['t3-money',
   'ANSWER HOW THIS GETS PAID FOR — bootstrap or raise — with arithmetic rather than preference.\n\n' +
   'Read for grounding: ' + REC + ' §24 (pricing), §25 (cost structure and funnel math), §28 (roadmap and calendar), §46 (founder capacity), §53 (execution capacity), and BUSINESS §82 (churn) and §85 (business operations).\n\n' +
   'Answer:\n' +
   '- **The bootstrap path.** What does default-alive look like: revenue needed to cover infra plus two founders\' minimum draw in India. Derive it — state the assumptions for cost of living, infra at the relevant scale, and the AI budget. How many paying users at Rs 299 and at Rs 599, and how long at a plausible growth rate. The record already derives that Rs 20L/month implies 1.26M cumulative visitors; sanity-check the smaller number the same way.\n' +
   '- **The raise path.** For an Indian dev-tools company in this category: who actually writes the first cheque, at what stage, what they need to see, typical size and dilution. Open real sources — accelerator pages (YC, Antler, Surge, Blume), Indian seed reports. Give current numbers with dates. Then the honest bit: is this company FUNDABLE? A byte-exact markdown editor with no users is a hard first pitch, and you should say so if the evidence supports it.\n' +
   '- **The third path nobody lists**: services and client work funding the product. The founder already does client-embedded delivery. What is the actual trade — how many hours of client work buys a month of runway, and what does it cost in product velocity? This may be the honest answer and it deserves real arithmetic rather than dismissal.\n' +
   '- **The cost-effective build.** Where the money actually goes at this scale, and the three biggest levers to spend less without shipping worse.\n' +
   '- **The decision**, stated: which path, what would change it, and the specific milestone at which the question should be reopened.\n\n' +
   'Target 2400-3000 words.'],
]

const out = await parallel(R.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Fusion' })))

return { reports: out.filter(Boolean).length }
