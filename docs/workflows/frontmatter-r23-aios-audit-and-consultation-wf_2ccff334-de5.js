// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r23-aios-audit-and-consultation',
  description: 'Audit the AIOS substrate honestly, mine the 5,135-row trace ledger as evidence, and decide what becomes product versus consulting',
  phases: [{ title: 'Audit', detail: 'what exists, what the data shows, what ships, what is sold as service' }],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const REC = FM + 'docs/FRONTMATTER-RECORD.md'
const H = '/Users/sagnikmitra/'

const HOUSE = [
  '',
  'YOU ARE THE THIRD CO-FOUNDER auditing the founder\'s own substrate. The failure mode here is flattery: describing an impressive-sounding system rather than measuring what actually runs. Assume nothing works until you have executed a check or read the code that makes it work.',
  '',
  'THE STANDARD:',
  '- EXECUTE read-only checks. Count files, read code, run scripts that only read. Do not describe a capability from its name or its README.',
  '- A skill that exists but has never been invoked is DORMANT, not working. A loop that is documented but whose state directory is empty is NOT RUNNING. Say so — the founder\'s own Learned Rule #32 forbids calling a loop "self-improving" when its eval directory is empty, and Rule #51 forbids calling a dormant on-demand skill dead. Distinguish the two carefully.',
  '- Every number you report must come from a command you ran. State the command.',
  '- Report what is broken, stale or abandoned FIRST. That is the useful half.',
  '',
  'STYLE:',
  '- NO H2 heading, NO section number — you return a RESEARCH REPORT to be synthesised.',
  '- Open with your single sharpest finding in one sentence.',
  '- Tables over prose. Evidence tags: [measured] executed here · [fetched] source opened · [derived] arithmetic shown · [inference] reasoning · [SS] unverified.',
  '',
  'HARD CONSTRAINTS (RULE 4): READ-ONLY, and this matters more than usual because you are inside the founder\'s live configuration. No writes, no commits, no mutating commands, no installs, nothing that touches launchctl or crontab, nothing that writes to ~/.claude or ~/.sgnk. Reading and counting only. If a check would require a write, describe it and stop.',
  'Never print, echo or cat a credential. If a file might hold one, report its path and permissions, never its contents.',
  '',
  'WHAT IS THERE, measured just now so you do not have to rediscover it:',
  '  ~/.claude/skills/        131 installed skills',
  '  ~/.claude/skills-src/    27 category directories (the authored source)',
  '  ~/.claude/settings.json  27 hooks wired across 8 events',
  '  ~/.sgnk/bin/             149 scripts',
  '  ~/.sgnk/traces/          65 day-files, 5,135 rows, fields: accepted, assertion_pass,',
  '                           correlation_id, failure_mode, input_tokens, output_tokens,',
  '                           latency_ms, ttft_ms, learning_mode, model, reasoning_effort,',
  '                           session_id, skill, tier, timestamp',
  '  ~/.sgnk/evals/           31 entries incl. complexity gold sets and a kappa measurement',
  '  ~/.sgnk/gates/           69 assertion scripts',
  '  ~/.sgnk/baselines/       2,469 entries',
  '  ~/.claude/AIOS-BOOK/     a book: book.md, book.tex, book.html',
  '  ~/Desktop/GitHub/        84 repos',
  '',
  'FRONTMATTER, the product this feeds: a markdown editor. The file is the only source of truth; every view is a deterministic reversible projection owning no state. The engine does byte-preserving splice edits — locate the range, replace exactly those bytes, REFUSE rather than guess. Emerging thesis: it generates the artefacts of product development and hands the user a context pack their own AI acts on. Two founders, India-based, very small AI budget, Rs 299 / Rs 599.',
  '',
  'FEATURE DISCIPLINE IS A HARD RULE: the founder does not want users buried in features. Anything you propose shipping must name the person who uses it and how often, or be cut with the cut recorded.',
  '',
  'EMIT EARLY: the full report as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL REPORT.',
  'Your entire final message IS the report.',
].join('\n')

phase('Audit')

const R = [
  ['u1-aios-honest-state',
   'AUDIT AIOS HONESTLY. What is actually built, what actually runs, and what is aspiration with a filename.\n\n' +
   'Read ' + H + '.claude/CLAUDE.md (it documents the intended system, including 74 Learned Rules), then GO AND CHECK whether the system it describes exists.\n\n' +
   'Do this concretely:\n' +
   '- **The hooks.** `jq .hooks ' + H + '.claude/settings.json`. For each, does the script it points at exist and is it executable? Does it write anywhere, and is that directory non-empty and recently touched? A hook bound to a path that no longer exists is a silent failure — the founder has been bitten by exactly this before (Learned Rule #49).\n' +
   '- **The skills.** 131 installed. Read `' + H + '.claude/skills-src/` for the authored source. Classify: actively invoked · dormant but legitimate on-demand · genuinely abandoned. Use `~/.sgnk/traces/*.jsonl` to see which skill names actually appear — that is the only real evidence of invocation. Report the count in each class and name the abandoned ones.\n' +
   '- **The loops.** CLAUDE.md claims a learning loop: trace → eval → calibrate → preference → drift → digression → promote. For EACH stage, is there data proving it ran? Check the state directory, check recency, check whether output feeds anything downstream. Be rigorous: the founder\'s own rule says "self-improving" is forbidden as a claim unless the loop is running and feeding routing.\n' +
   '- **The gates.** 69 assertion scripts in ~/.sgnk/gates. How many are wired into anything that runs them automatically versus sitting there? Run two or three of the safest read-only ones and report the actual result.\n' +
   '- **Staleness.** For the key state files, when were they last written? A bandit file whose mtime has not moved in six weeks is not learning.\n\n' +
   'Deliver: a table of subsystem · what it claims · what is measurably true · verdict LIVE / PARTIAL / DORMANT / DEAD. Then the three things most worth fixing and the three worth deleting.\n\n' +
   'Target 2400-3000 words.'],

  ['u2-trace-ledger-evidence',
   'MINE THE TRACE LEDGER. ~/.sgnk/traces holds 65 day-files and 5,135 rows of REAL measured AI-assisted work. This is proprietary data almost nobody has, and it can answer the question the whole product rests on: does structured context actually make AI output better?\n\n' +
   'Analyse with python3 or node over `' + H + '.sgnk/traces/*.jsonl`. Be careful about field-name drift — the founder\'s Learned Rule #59 records that `tokens_in` versus `input_tokens` and `pass` versus `assertion_pass` mismatches silently published wrong numbers for weeks. ACCEPT EVERY KEY THE PRODUCERS ACTUALLY WROTE, and treat a missing key as UNKNOWN, never as a falsy default. Report which key carried each number.\n\n' +
   'Answer, with distributions and denominators rather than single numbers:\n' +
   '- **Coverage.** Rows, date span, how many carry `accepted`, how many carry `assertion_pass`, how many carry token counts, how many carry `skill`. What fraction of rows are usable for each question — a field present in 12% of rows cannot support a headline.\n' +
   '- **Acceptance.** Overall accepted rate, and split by model, by `reasoning_effort`, by `tier`, by `skill`. Where the sample is too small to matter, say so rather than reporting a percentage of four.\n' +
   '- **Failure modes.** What is in `failure_mode` and how is it distributed? This is the most product-relevant field in the ledger: it is a taxonomy of how AI-assisted work actually fails, measured on real sessions rather than scraped from complaints.\n' +
   '- **Cost.** Real input/output token distributions. What does a unit of accepted work actually cost? This directly grounds frontmatter\'s AI economics, which are currently undefined.\n' +
   '- **Latency.** `ttft_ms` and `latency_ms` distributions — what a user actually waits.\n' +
   '- **The big one: is there a measurable relationship between structure and outcome?** Does `skill` being set correlate with acceptance versus unattributed rows? Does higher `reasoning_effort` earn its cost? Be honest if the data cannot support the inference — confounded observational data is not an experiment, and saying so is worth more than a spurious correlation.\n\n' +
   'Close with: which findings are strong enough to PUBLISH, which are internal-only, and what experiment the ledger suggests but cannot itself settle.\n\n' +
   'Target 2400-3200 words. Numbers throughout, every one from a command you ran.'],

  ['u3-aios-to-product',
   'DECIDE WHAT OF AIOS BECOMES A FRONTMATTER FEATURE — and be ruthless, because most of it should not.\n\n' +
   'Read ' + H + '.claude/CLAUDE.md and the skills-src tree, and ' + REC + ' §15 (the internal system productised) and §62 (AIOS inside the product). §15 already productised this once; check whether that framing survives contact with the current thesis, and say plainly if it does not.\n\n' +
   'The test each candidate must pass: does a NORMAL user — not this founder — hit the problem it solves, often enough to notice, without having to understand the machinery? Most of AIOS fails that test. It is a power-user substrate built by and for someone with 74 Learned Rules, and shipping it wholesale would be the clutter the founder is explicitly trying to avoid.\n\n' +
   'Evaluate candidates concretely: | Capability | What it does for the founder | Does a normal user have this problem? | Shippable shape | Who uses it, how often | Size | Verdict SHIP / LATER / INTERNAL-ONLY / KILL |\n\n' +
   'Consider at least:\n' +
   '- The trace ledger → "did the AI actually help?" as a user-visible feature\n' +
   '- The eval loop with binary pass/fail and a judge → quality gates on generated documents\n' +
   '- The complexity gate / model router → automatically using a cheap model when a cheap model suffices, which is directly the AI-budget answer\n' +
   '- The gates and assertions → document CI, which the record already positions as a product\n' +
   '- Skills → templates or generators, and whether that is just a template gallery with a better name (the record has refused template galleries)\n' +
   '- Snapshot/recall and handover → the artefact factory, the strongest candidate\n' +
   '- Hooks → automation triggers, and the hard question of whether a user should ever author one\n' +
   '- The Learned-Rules mechanism → a project that accumulates its own rules over time\n\n' +
   'Then the honest part: **name the capabilities that are genuinely only useful to this founder** and should never ship. A list with nothing on it means you did not apply the test.\n\n' +
   'Close with the ONE AIOS capability that most deserves to be in the MVP, defended against the others.\n\n' +
   'Target 2400-3000 words.'],

  ['u4-consultation-and-services',
   'DECIDE THE CONSULTING QUESTION. The founder said the consultation part is different, and it is: it is a separate business with a different unit economic, and conflating it with the product is a classic way to kill both.\n\n' +
   'Read ' + REC + ' §21 (segments), §24-25 (pricing and cost), §46 (founder capacity), §53 (execution capacity), and BUSINESS §85 (business operations) if present. Also read the studio register at /Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md — the founder already does client-embedded delivery, so this is not hypothetical.\n\n' +
   'Answer:\n' +
   '- **What is actually sellable as AI consulting today**, given what has been built: an orchestration substrate, 131 skills, an eval loop, gates, and measured traces from 65 days of real use. Companies are currently paying for exactly this knowledge. Research the going rate with curl — open real published rates for AI-enablement and developer-productivity consulting, dated.\n' +
   '- **The honest tension.** Consulting pays now and costs the thing the product needs most: founder hours. The record derives a founder-time ceiling already. Do the arithmetic: how many consulting hours per month before the product stops moving, and what that buys in runway. Give the break-even.\n' +
   '- **What consulting FEEDS the product**, if run deliberately: real customers, real failure modes, a design partner, and a distribution channel that is not borrowed — the record notes every identified channel currently is.\n' +
   '- **What it POISONS**: bespoke features, a roadmap owned by one client, and the slow slide into an agency. Name the specific early symptoms so the founders can see it happening.\n' +
   '- **The productised-service middle path**: a fixed-scope, fixed-price engagement that installs the product and the practice together. Design one concretely — what is delivered, in how many days, at what price, and what fraction is repeatable.\n' +
   '- **The recommendation**: do it, do it in a bounded form, or refuse it. Name the trigger that would change the answer.\n\n' +
   'Target 2200-2800 words.'],
]

const out = await parallel(R.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Audit' })))

return { reports: out.filter(Boolean).length }
