// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r25-close-the-gaps',
  description: 'The five research gaps that would make a brutal critique unfair: Reddit, the AI-editor category, willingness to pay, retention, and owned distribution',
  phases: [{ title: 'Gaps', detail: 'what we never tested, tested' }],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const REC = FM + 'docs/FRONTMATTER-RECORD.md'
const DEC = FM + 'docs/DECIDE.md'

const HOUSE = [
  '',
  'YOU ARE CLOSING A RESEARCH GAP so that a brutal critique which follows cannot be dismissed as uninformed. The critique will be as harsh as the evidence permits, so your job is to make the evidence real.',
  '',
  'THE STANDARD:',
  '- COUNT things, with denominators. An impression is not a finding.',
  '- Quote verbatim, short, with a link and a date.',
  '- Report what refutes the product FIRST.',
  '- If a source refuses you, give the exact status code and try another. Never silently fall back to memory.',
  '- Evidence tags: [fetched] opened · [measured] counted here · [derived] arithmetic shown · [inference] reasoning · [SS] could not verify.',
  '',
  'SOURCES. WebFetch is gate-refused here; `curl` is NOT. Test before concluding anything is unreachable.',
  '  HN:      curl -sL "https://hn.algolia.com/api/v1/search?query=<q>&tags=comment&hitsPerPage=100"',
  '  GitHub:  curl -sL "https://api.github.com/search/issues?q=<q>&per_page=100"',
  '  arXiv:   curl -sL "http://export.arxiv.org/api/query?search_query=all:<q>&max_results=20"',
  '  Pages:   curl -sL --compressed -A "Mozilla/5.0" "<url>" | sed -e \'s/<[^>]*>//g\' | tr -s "\\n" | head -300',
  '',
  'NOTE ON REDDIT: `www.reddit.com` returned HTTP 403 to two earlier rounds. Before accepting that, TRY: `old.reddit.com/r/<sub>/search.json`, `www.reddit.com/r/<sub>/top.json?t=year`, a different `-A` user agent, `.rss` endpoints, and `r/<sub>/comments/<id>.json`. Report exactly which of these work. If none do, say so with status codes — an untested assumption of unreachability is the mistake this round exists to avoid.',
  '',
  'THE PRODUCT: a markdown editor for people who build software with AI. It opens a folder of `.md` files in a git repo, edits them byte-exactly (locate the byte range, replace only those bytes, REFUSE rather than guess), and shows agent-proposed changes as a reviewable per-hunk diff. Two founders (possibly one — the record contradicts itself), India-based, selling globally, very small AI budget, free / Rs 299 / Rs 599 per month, zero users, zero revenue.',
  '',
  'WHAT THE RESEARCH ALREADY FOUND, so you do not repeat it: byte-exactness is almost never discussed by users (4 complaints in 12,556); context-pack products have launched 89 times on HN in 20 months with a median of 2 points; decision-record renders are the least-demanded render measurable; slop is 23.7% of complaints and growing +149%; sync is the #1 loved feature and #1 switching trigger.',
  '',
  'STYLE: NO H2 heading, NO section number — you return a RESEARCH REPORT. Open with your sharpest finding in one sentence. Tables over prose.',
  'HARD CONSTRAINTS (RULE 4): read-only. No writes, no commits, no mutating commands.',
  'EMIT EARLY: full report as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL REPORT.',
  'Your entire final message IS the report.',
].join('\n')

phase('Gaps')

const G = [
  ['w1-reddit-recovered',
   'RECOVER THE REDDIT EVIDENCE that two earlier rounds could not reach, then use it.\n\n' +
   'First, systematically test the access routes listed above and report a table of endpoint · status · usable. Then, whatever works, mine these communities for what people actually complain about and actually want: r/ObsidianMD, r/ClaudeAI, r/ChatGPTCoding, r/cursor, r/ExperiencedDevs, r/PKMS, r/logseq, r/Zettelkasten, r/SaaS, r/devtools.\n\n' +
   'Target the questions HN could not answer, because HN skews to launches and hot takes while Reddit skews to daily use:\n' +
   '- What do people complain about WEEKLY, not at launch?\n' +
   '- What do they ask "is there a tool that…" about?\n' +
   '- What do they say when they cancel a subscription?\n' +
   '- Sizing: subscriber counts for each community, with the date read.\n\n' +
   'Cross-check the HN-derived findings above. Where Reddit disagrees with HN, that disagreement is the finding — report it prominently, because the record currently rests on HN alone.\n\n' +
   'If Reddit is genuinely unreachable by every route, spend the remaining effort on a substitute corpus (Lobsters, Discourse forums, Stack Overflow, product Discords with public web archives) and say plainly that the Reddit gap stands.\n\n' +
   'Target 2400-3000 words.'],

  ['w2-ai-editor-teardown',
   'TEAR DOWN THE CATEGORY WE WOULD ACTUALLY COMPETE IN. The record has researched markdown editors and general document tools. It has never seriously examined the AI coding/editing tools this product would sit beside — which is where the buyer, the budget and the attention already are.\n\n' +
   'Open, date, and characterise: **Cursor · Windsurf · Zed (and its AI features) · GitHub Copilot and Copilot Workspace · Claude Code · Codex CLI · Aider · Cline · Continue · JetBrains AI**. For each, open pricing, docs and changelog with curl.\n\n' +
   'For each: what it costs today, what it does with files on disk, whether it writes whole files or diffs, whether it has any concept of refusing an ambiguous edit, what it does with markdown specifically, and what its users complain about most.\n\n' +
   'Then the questions that decide our position:\n' +
   '- **Do any of them already do the per-hunk reviewable diff we plan as our MVP-0 demo?** Be precise. If Cursor already shows a diff you can accept per hunk, our demo is not novel and we must know that today rather than at launch.\n' +
   '- **What do they do to a CRLF markdown file with frontmatter?** One of them has publicly admitted destroying carriage returns on full-file rewrite. Find how widespread that is.\n' +
   '- **Where does a markdown-first tool sit next to a code-first tool?** Is our category adjacent, subordinate, or invisible to them?\n' +
   '- **The distribution question**: they are where our users already are. Is the play to compete, to integrate (MCP, an extension), or to be the thing their agent writes into?\n' +
   '- **Pricing anchors**: what has this audience already been trained to pay? Our Rs 299/599 sits against Cursor at $20 and Claude Code inside a $20-200 plan. State the implication plainly.\n\n' +
   'Target 2600-3200 words.'],

  ['w3-willingness-to-pay',
   'ESTABLISH WHAT THIS AUDIENCE ACTUALLY PAYS FOR, because the record prices at Rs 299/599 with zero evidence from a single human.\n\n' +
   'Open real pricing pages and real published numbers with curl. Cover: Obsidian (free, Sync $4-8, Catalyst, Commercial $50/user/yr), Notion, Craft, Bear, Ulysses, iA Writer, Typora, Logseq, Reflect, Mem, Cursor, Copilot, Linear, Height, Coda, GitBook, Mintlify, Readme, Confluence. Give current prices with the date read.\n\n' +
   'Then the analysis that matters:\n' +
   '- **The price ladder for this audience.** What is a developer already paying monthly for tools, in aggregate? Where does a new Rs 299 (~$3) or Rs 599 (~$6) subscription sit — is it below the noise floor, or below the *credibility* floor? A price can be too low to be believed.\n' +
   '- **Free-tier gravity.** Obsidian is free for personal use and beloved. What has ever successfully charged individuals in this category, and for what? Find the actual answer — it may be "sync, and almost nothing else".\n' +
   '- **India pricing versus global.** The record sells globally from India. Is a rupee-denominated price a signal problem for a global developer product? Find comparable Indian dev-tool companies and what they charge.\n' +
   '- **What people say when they refuse to pay** — mine cancellation and "not worth it" discussions.\n' +
   '- **The honest verdict on Rs 299/599**: defensible, too low, or the wrong axis entirely? If per-seat is wrong, what is right — usage, per-repo, one-time, open-core?\n\n' +
   'Target 2400-3000 words.'],

  ['w4-retention-and-growth',
   'MODEL WHETHER THIS PRODUCT CAN RETAIN AND GROW, which the record has never done.\n\n' +
   'Read ' + REC + ' §25 (cost structure and funnel math) and BUSINESS §82 (churn) — then challenge them.\n\n' +
   'Answer:\n' +
   '- **What actually drives retention in an editor?** Find published or measurable evidence: switching costs, vault lock-in, habit, network effects. An editor with files on the user\'s own disk has the LOWEST possible lock-in by design — we made exit free on purpose. Confront that: it is an ethical win and a retention problem, and the record has never said so.\n' +
   '- **Benchmarks, opened and dated**: SaaS churn for prosumer dev tools, free-to-paid conversion for developer products, DAU/MAU for editors. Cite the sources.\n' +
   '- **The growth loops available to us**, ranked by whether we control them: published pages with SEO, a shared artefact carrying a mark, an Obsidian plugin, GitHub presence, content. For each: does it compound, and who owns the channel?\n' +
   '- **The cold-start problem.** Every loop above needs users. What is the first hundred, concretely, and what does the record\'s own "every channel is borrowed" finding mean for that?\n' +
   '- **What kills growth for this specific product**, ranked with the earliest observable signal.\n\n' +
   'Target 2400-3000 words.'],

  ['w5-frameworks-and-precedent',
   'ASSEMBLE THE ANALYTICAL FRAMEWORKS AND PRECEDENTS the critique will be graded against, so it is judged by external standards rather than our own.\n\n' +
   'Open primary sources with curl where they exist. Deliver a working toolkit, not a reading list — each item must come with how it applies to THIS product.\n\n' +
   '- **Product frameworks**: the Kano model, Jobs-to-be-Done, the RICE and ICE scoring rubrics, Sean Ellis\'s product-market-fit test and the 40% benchmark, Rahul Vohra\'s Superhuman PMF engine, the "hair on fire / hard fact / future vision" segmentation, Y Combinator\'s guidance on making something people want. For each: what it would say about a byte-exact markdown editor with zero users.\n' +
   '- **Business frameworks**: unit economics and payback period, the LTV/CAC rule of thumb and its critics, the 40% rule, Bessemer and OpenView benchmarks for developer tools, PLG versus sales-led, open-core, bottom-up adoption. Find current published benchmark numbers with dates.\n' +
   '- **Research**: anything empirical on developer tool adoption, documentation practice, code-review acceptance of AI suggestions, and context quality effects on model output. Use the arXiv API.\n' +
   '- **Precedents, honestly told**: developer tools that succeeded (Obsidian, Linear, Raycast, Warp, Fig, Zed) and that failed or were absorbed. What separated them? Be specific about the ones that had good technology and no business.\n' +
   '- **The graded rubric**: assemble a scoring rubric a serious investor or operator would apply to this product, criterion by criterion, with what "pass" looks like for each. The critique that follows will be scored against it, so make it demanding.\n\n' +
   'Target 2800-3400 words.'],
]

const out = await parallel(G.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Gaps' })))

return { reports: out.filter(Boolean).length }
