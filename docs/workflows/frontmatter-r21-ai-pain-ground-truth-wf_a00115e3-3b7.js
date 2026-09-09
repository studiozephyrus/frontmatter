// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r21-ai-pain-ground-truth',
  description: 'What actually makes AI hard to use, counted from primary sources — then what we can ship against it, for B2B and D2C',
  phases: [
    { title: 'Pain', detail: 'observed complaints, counted, not imagined' },
    { title: 'Answer', detail: 'pain to feature, B2B versus D2C, and what renders earn their place' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const REC = FM + 'docs/FRONTMATTER-RECORD.md'

const HOUSE = [
  '',
  'THIS ROUND EXISTS BECAUSE THE FOUNDER CORRECTED US. The record so far is built largely on the founders\' own hypotheses about what users need. Your job is to go and find out what people ACTUALLY complain about, from primary sources, and let the evidence contradict the hypothesis if it does. A finding that refutes the product thesis is the most valuable thing you can return.',
  '',
  'THE STANDARD, and it is the whole point of this round:',
  '- COUNT things. "Users often struggle with context" is worthless. "Of 400 posts in r/ClaudeAI matching X between DATE and DATE, 112 describe Y" is evidence.',
  '- Quote real complaints verbatim, short, with a link and a date.',
  '- Report the DENOMINATOR every time. A count with no denominator is a vibe.',
  '- If you cannot count it, say so and label the finding [SS]. Do not dress an impression as data.',
  '- Actively look for evidence AGAINST the product thesis. Report it first if you find it.',
  '',
  'HOW TO REACH SOURCES. WebFetch is refused by a security gate here. `curl` is NOT — test it before concluding anything is unreachable. These work and are the backbone of this round:',
  '  HN search:   curl -sL "https://hn.algolia.com/api/v1/search?query=<q>&tags=comment&hitsPerPage=100"',
  '  HN by date:  add &numericFilters=created_at_i>UNIXTS',
  '  Reddit:      curl -sL -A "Mozilla/5.0" "https://www.reddit.com/r/<sub>/search.json?q=<q>&restrict_sr=1&sort=top&t=year&limit=100"',
  '  Reddit sub:  curl -sL -A "Mozilla/5.0" "https://www.reddit.com/r/<sub>/about.json"   (subscriber count)',
  '  GitHub:      curl -sL "https://api.github.com/search/issues?q=<q>+in:title&per_page=100"  (unauthenticated: 10 req/min, so batch)',
  '  arXiv:       curl -sL "http://export.arxiv.org/api/query?search_query=all:<q>&max_results=20"',
  '  Plain pages: curl -sL --compressed -A "Mozilla/5.0" "<url>" | sed -e \'s/<[^>]*>//g\' | tr -s "\\n" | head -300',
  'Parse JSON with python3 or node. If a host rate-limits or refuses, report the status code and use another.',
  '',
  'STYLE:',
  '- NO H2 heading and NO section number — you are returning a RESEARCH REPORT that will be synthesised, not a finished section. Start with a one-line finding, then the evidence.',
  '- Lead with the single most surprising or most inconvenient finding. Bury nothing.',
  '- Tables over prose. Evidence tags: [fetched] source opened · [measured] counted here · [derived] arithmetic shown · [inference] reasoning · [SS] could not verify.',
  '- End with "WHAT THIS MEANS FOR THE PRODUCT" — three to six bullets, each naming a feature to build, kill, or reshape. Be willing to write "this suggests we should not build X".',
  '',
  'THE PRODUCT, for context: a markdown editor whose engine does byte-preserving edits and refuses rather than guesses. The emerging thesis is that it generates the artefacts of product development — handovers, decision records, specs, flows — and hands the user a context pack their own AI (Claude, Codex, Cursor) acts on. Teams would connect their own provider keys. Two founders, India-based, very small AI budget, selling globally, Rs 299 / Rs 599 tiers.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands.',
  'EMIT EARLY: the full report as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL REPORT.',
  'Your entire final message IS the report.',
].join('\n')

phase('Pain')

const PAIN = [
  ['s1-ai-usage-pain',
   'FIND OUT WHAT ACTUALLY MAKES AI HARD TO USE, for people doing real work. This is the anchor report of the round; everything else leans on it, so the counting standard matters more here than anywhere.\n\n' +
   'Mine, quantitatively: r/ClaudeAI, r/ChatGPTCoding, r/LocalLLaMA, r/cursor, r/ExperiencedDevs, Hacker News comments, and GitHub issues on the major agent tools. Search terms to start from and expand: "loses context", "forgets", "hallucinated", "made up a file", "had to re-explain", "started over", "deleted my", "overwrote", "wrong file", "too much context", "context window", "re-prompt", "gave up on".\n\n' +
   'Produce a RANKED TAXONOMY of pain, each rank carrying a count and a denominator. For each: what the person was trying to do, what went wrong, what it cost them, and what they did instead.\n\n' +
   'Then answer the questions that decide our product:\n' +
   '- Which pains are about the MODEL (will be fixed by the labs in 18 months, do not build for them) versus about the WORKFLOW around the model (durable, ours to solve)? This split is the most important output of your report.\n' +
   '- How often is the complaint specifically about LOST WORK or CORRUPTED FILES, which is the one thing our engine already answers?\n' +
   '- How often is it about re-establishing context in a new session — the handover problem?\n' +
   '- What do people currently do about it? Copy-paste rituals, CLAUDE.md files, custom scripts, giving up. The existing workaround is the real competitor.\n\n' +
   'Target 2400-3200 words. Counts and quotes throughout.'],

  ['s2-agentic-dev-failures',
   'FIND OUT HOW AI-ASSISTED DEVELOPMENT FAILS IN PRACTICE, from people doing it daily with Claude Code, Cursor, Codex, Copilot, Aider, Windsurf.\n\n' +
   'Mine GitHub issues on those repos where public, plus HN and the relevant subreddits. Also open any published data on agent success rates and abandonment.\n\n' +
   'Answer:\n' +
   '- The failure taxonomy for MULTI-SESSION and MULTI-PERSON work specifically. A single prompt going wrong is a model problem. A project degrading over twenty sessions is a workflow problem, and that is our territory.\n' +
   '- What do people put in CLAUDE.md / AGENTS.md / .cursorrules today, and what goes wrong with those files? Sample real ones from public repos via the GitHub API and characterise them: how long, what sections, how stale. **Measure staleness if you can** — last commit to the rules file versus last commit to the repo. If those files rot, that is a product.\n' +
   '- The handoff problem: what happens when a second person, or the same person two weeks later, picks up AI-assisted work. Find real accounts.\n' +
   '- How much of the pain is context ASSEMBLY (finding what to give the model) versus context QUALITY (what you gave it was wrong or stale)? Different products.\n' +
   '- What have people built to fix this themselves? Every home-made tool is both validation and a competitor.\n\n' +
   'Target 2400-3000 words.'],

  ['s3-doc-and-decision-pain',
   'FIND OUT WHY TEAMS DO NOT WRITE THE DOCUMENTS THEY KNOW THEY SHOULD — and what it costs them. The product proposes to generate handovers, decision records, specs and flows. That only matters if their absence genuinely hurts.\n\n' +
   'Mine: r/ExperiencedDevs, r/ProductManagement, r/devops, HN, and any published research on documentation debt, onboarding time and knowledge loss. Look specifically for ADR (architecture decision record) adoption — search GitHub for `adr` and `decisions` directories and MEASURE how many repos have them and whether they are maintained after the first three.\n\n' +
   'Answer:\n' +
   '- The real reasons documents do not get written, ranked by how often they are cited. "No time" is the stated reason; find the structural ones underneath.\n' +
   '- Which documents, when missing, actually cost money? Be specific: onboarding, incident response, handover, procurement.\n' +
   '- **The ADR question, measured.** Sample public repos with an `adr/` or `decisions/` directory. How many records? Is the last one recent? A pattern of "three ADRs then silence" would be the single most important finding in this report — it would mean the ceremony is the problem and generating them is the product.\n' +
   '- Does AI change this? A document is cheaper to write now. Has adoption actually risen, or has AI simply produced more unread documents?\n' +
   '- The uncomfortable question, answered honestly: is a generated decision record VALUABLE, or is the value in the thinking that writing it forces — in which case generating it destroys the point? Argue both sides properly.\n\n' +
   'Target 2200-2800 words.'],
]

const pain = await parallel(PAIN.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Pain' })))

phase('Answer')

const painCtx = '\n\n=== THE PAIN RESEARCH THIS ROUND JUST PRODUCED — build on it, do not repeat it ===\n\n' +
  pain.filter(Boolean).map((r, i) => '--- pain report ' + (i + 1) + ' ---\n' + String(r).slice(0, 11000)).join('\n\n') +
  '\n=== END ===\n'

const ANSWER = [
  ['s4-pain-to-shippable',
   'MAP THE OBSERVED PAIN TO WHAT WE CAN ACTUALLY SHIP.' + painCtx + '\n' +
   'For every ranked pain in those reports, answer: can markdown-plus-a-byte-exact-engine-plus-a-context-pack solve it, partially solve it, or not touch it? Be honest about the third category — it is the most useful column, because it defines the product\'s edge.\n\n' +
   'Produce the central table: | Pain | How often (with denominator) | Can we solve it? | What we would ship | Size | Does it need the engine? | Would a user notice within one session? |\n\n' +
   'Then:\n' +
   '- **The shippable list, ranked by pain-relieved per unit of build.** Not by how interesting it is to build.\n' +
   '- **What we should NOT build even though we could**, because the pain is rare, the workaround is fine, or a lab will fix it in a year.\n' +
   '- **The one feature that, if it worked perfectly, would make someone switch tools.** One. Defend the choice.\n' +
   '- **The honest gap**: pain that is real, frequent, and that we cannot address. Naming it is how we avoid promising it.\n\n' +
   'Feature discipline is a hard rule: every feature must name the person who uses it and how often. If you cannot, cut it and say so.\n\n' +
   'Target 2400-3000 words.'],

  ['s5-b2b-vs-d2c',
   'DECIDE THE B2B QUESTION: what can we ship to a company that we cannot ship to an individual, is it the same product, and what is the trick.' + painCtx + '\n' +
   'Read for grounding: ' + REC + ' §21 (segments and ICPs), §24 (pricing), §26 (GTM), §44 (publishing), §51 (compliance).\n\n' +
   'Answer:\n' +
   '- **Same product or two products?** Argue it properly. A shared engine with two surfaces, one product with a team tier, or genuinely separate. Name the cost of each — the two-product answer doubles the surface for two founders and that may end the argument.\n' +
   '- **What only a company will pay for**, that is cheap for us because we already have it: audit trail, SSO, retention policy, on-prem or bring-your-own-key, seat management, an export guarantee, procurement answers. Which of these are close to free given the architecture already chosen, and which are a quarter of work? The gap between those two lists IS the B2B strategy.\n' +
   '- **The trick.** Where can a small team ship something disproportionately valuable to B2B — for example the fact that documents live in the customer\'s own repo means data residency and exit are already solved, which is normally an enterprise-grade feature costing months.\n' +
   '- **What kills a B2B deal for us**: SOC 2, a security questionnaire, no SSO, one-person support, an Indian entity selling to EU or US enterprises. Which are fatal, which are survivable, and at what deal size does each start to bite.\n' +
   '- **The buying trigger.** Not who benefits — who has budget and a reason to act this quarter.\n' +
   '- **D2C**: what makes an individual pay rather than use free forever, given the record already measures developer free-to-paid conversion as the hard half of freemium.\n' +
   '- The recommendation: which motion first, and what the second one costs if we defer it.\n\n' +
   'Target 2400-3000 words.'],

  ['s6-renders-that-earn-it',
   'DECIDE WHICH MARKDOWN RENDERS ACTUALLY EARN THEIR PLACE.' + painCtx + '\n' +
   'The founder keeps returning to this: markdown rendered as decision flows, and other views that do real work without heavy computation. The record has a rendering system (§9) and a carrier decision (a `> [!kind]` callout for prose, a fence for opaque data) but has never asked which renders are WORTH IT.\n\n' +
   'Read: ' + REC + ' §9 (the rendering system), §5 (the projection law), §14 (screens), §18 (simplicity).\n\n' +
   'The constraint that shapes everything: a render must be a deterministic, reversible projection of the file, owning no state — and the founders want things that are trickily cheap to compute, not a rendering engine.\n\n' +
   'Evaluate candidates honestly, each against: who looks at it, how often, what it replaces, what it costs to build, whether it round-trips, and whether it degrades acceptably when another markdown engine renders the same file.\n' +
   '- Decision flow / decision card — the founder\'s repeated example. Design it concretely: the source markdown, the rendered view, the interaction, the write-back.\n' +
   '- A flow or process diagram from a list. Mermaid already renders on GitHub — what do we add?\n' +
   '- Status/kanban from frontmatter. The record has refused project management; does a read-only view of state cross that line? Argue it.\n' +
   '- A roadmap or timeline from dated frontmatter.\n' +
   '- A checklist with real state, and where that state lives given the file is the only source of truth.\n' +
   '- A dependency or reference graph across files — this repo has one and it caught real defects.\n' +
   '- A diff or review view over a proposed AI edit. This may be the most load-bearing render in the product.\n' +
   '- A table editor over a markdown table.\n\n' +
   'Rank them. Cut at least half and say why. **Name the ONE render that ships in the MVP** and defend it against the other candidates.\n\n' +
   'Include one mermaid diagram showing the file-to-render-to-splice-back loop. Target 2400-3000 words.'],

  ['s7-flow-design',
   'DESIGN THE ACTUAL FLOWS. The founder asked for proper flow design and the record does not have it: there are screens (§14) and principles, but no end-to-end journeys.' + painCtx + '\n' +
   'Read: ' + REC + ' §14 (screens), §17 (onboarding), §18 (simplicity), §12-13 (the protocol).\n\n' +
   'Design these flows, each as a numbered step sequence with the state at every step, what the user sees, what the system does, what can fail and what the failure looks like:\n' +
   '1. **First run to first value.** Someone opens the product with an existing folder of markdown. What is the shortest path to them saying "oh". Name the number of steps and defend it — the record warns that a form at first run is the single change most likely to hurt conversion.\n' +
   '2. **The artefact flow**: from work already in the vault to a generated handover or decision record, reviewed and committed. Where does the human approve?\n' +
   '3. **The kickoff-prompt flow**: user has a task, wants their own Claude to do it well. What do they click, what do they get, where do they paste it, what comes back, and how does the result land back in the vault.\n' +
   '4. **The AI edit flow**: propose, review the diff, accept or refuse, commit. This is where refuse-rather-than-guess becomes visible to a user, and it is the product\'s soul made concrete.\n' +
   '5. **The conflict flow**: two devices, divergent edits, git merge produces a conflict. What does a non-expert see? This is T0, the trust surface.\n' +
   '6. **The team flow**: a second person joins and picks up the work.\n\n' +
   'For each, mark the ONE step most likely to lose the user, and what we do about it.\n\n' +
   'Include two mermaid diagrams: first run, and the AI edit loop. Target 2600-3200 words.'],
]

const answer = await parallel(ANSWER.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Answer' })))

return {
  pain: pain.filter(Boolean).length,
  answer: answer.filter(Boolean).length,
}
