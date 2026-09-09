// SPAWN-GATE: q1=y q2=y q3=y  (nine independent market gaps, each needs primary-source opening + adversarial verify; scope not enumerable in one context)
export const meta = {
  name: 'gap-closing-round',
  description: 'Close the nine untested gaps in the frontmatter pilot plan: spec-kit real usage, Marketplace counts, comments/share/bookmarks state, AI-on-load, team features, generate, AI verb demand, retention, Reddit',
  phases: [
    { title: 'Research', detail: 'one agent per gap, primary sources only' },
    { title: 'Refute', detail: 'an adversarial second agent per gap' },
    { title: 'Critic', detail: 'what is still missing after this round' },
  ],
}

const TOOLS = `
TOOL NOTES, IMPORTANT:
- WebFetch is blocked by a security gate here. That is one tool's policy, not a capability gap. Use Bash + curl:
    curl -sL --compressed -A "Mozilla/5.0" "<url>" | head -c 300000
    curl -sL "https://api.github.com/repos/<owner>/<repo>"           (no auth needed)
    curl -sL "https://api.github.com/repos/<o>/<r>/issues?state=all&per_page=100&page=N"
    curl -sL "https://hn.algolia.com/api/v1/search?query=<q>&tags=story&hitsPerPage=100"
    curl -sL "https://hn.algolia.com/api/v1/search?query=<q>&tags=comment&hitsPerPage=100"
    curl -sL -A "Mozilla/5.0" "https://www.reddit.com/r/<sub>/search.json?q=<q>&restrict_sr=1&limit=100&sort=relevance"
    VS Code Marketplace query API (POST, returns installs/ratings):
      curl -sL -X POST "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery" \\
        -H "Content-Type: application/json" -H "Accept: application/json;api-version=3.0-preview.1" \\
        -d '{"filters":[{"criteria":[{"filterType":8,"value":"Microsoft.VisualStudio.Code"},{"filterType":10,"value":"<search terms>"}],"pageNumber":1,"pageSize":50}],"flags":914}'
      Statistics in the response carry "install" and "averagerating" per extension.
    Open VSX: curl -sL "https://open-vsx.org/api/-/search?query=<q>&size=50"
    PyPI downloads: curl -sL "https://pypistats.org/api/packages/<name>/overall"
- GitHub CODE search needs auth. To use it, run in ONE Bash command:
    source /Users/sagnikmitra/.config/codex-env/tokens.zsh && curl -sL -H "Authorization: Bearer $GH_TOKEN" -H "Accept: application/vnd.github+json" "https://api.github.com/search/code?q=<urlencoded>&per_page=1"
  NEVER print, echo, cat, or write the token or that file's contents. If the source line fails with
  "Operation not permitted", that is the Bash sandbox: retry that ONE command with
  dangerouslyDisableSandbox: true and say so in your notes. Unauthenticated repo/issue/HTML
  endpoints do not need this.
- If a host genuinely refuses after trying alternatives, mark the finding UNVERIFIABLE. Never guess a number.
`

const RULES = `
EVIDENCE RULES, hard:
- Every number comes from a response you fetched in this task. opened=true only for URLs you really retrieved.
- Always the denominator, always the fetch date. "500 installs" is nothing without "of what, out of what, when".
- Quote the source's own words for any claim that decides something.
- Counting beats impression. Titles beat bodies (GitHub free-text search matches comments; use in:title).
- When a count is a keyword artifact, say so — read the top 20 hits and report how many are actually about the thing.
- Where a prior finding exists, CHECK it rather than repeat it; you are permitted and expected to refute the plan.
- Do NOT run any destructive operation (db push, migrate, DROP, DELETE, push --force, rm -rf, paid-plan
  upgrades, outbound messages, posting anywhere). Read only. If a step seems to need one, stop and report.
`

const CONTEXT = `
THE PRODUCT (frontmatter): a markdown editor on a byte-exact splice engine — replaces only the exact byte
range of a change, refuses when it cannot locate it, never rewrites the file. Documents stay in the user's
own git repo; the vendor never holds them ("the projection law": every view is a stateless projection of
the file; no view may own state the file does not have — a sidecar file IN the user's repo is allowed, a
vendor database holding document-derived state is not). Two founders, funded by consulting, zero users.

THE PLAN AS IT STANDS (v10.1, 2026-09-06): the editor is free forever. The product is "the editor where an
agent's specs and decisions get read, reviewed and finished": provenance (which bytes a machine wrote,
tinted until a person reviews; one-key revert), plus answering [NEEDS CLARIFICATION] markers in place.
Team tier $8/user/mo (provenance across a shared repo, who-reviewed-what). Sync +$4 later.
Channels: a free Obsidian plugin (live-preview fix), the spec-driven toolchain (github/spec-kit 133,660
stars, obra/superpowers 282,242 stars — both MIT, both write markdown specs into the repo), a Chrome
extension later. Cut: generating project files, kickoff prompts, a vendor CDN. Deferred: local models.

ALREADY VERIFIED THIS WEEK (do not re-derive, but you may contradict with evidence):
- /speckit.clarify is chat-first (interactive one-question loop; the agent writes answers back).
- GitHub code search 2026-09-06: 62,976 files under specs/ paths contain "NEEDS CLARIFICATION" (generic
  phrase; template copies inflate it); 4,656 files named spec.md do.
- HN Show HN baseline n=4,000: median 2.0 points, 85% at or under 5. Launch points are near-worthless.
- Obsidian pricing 2026-09-06: editor free, Sync $4/user/mo, Publish $8/site/mo, Commercial $50/user/yr.
- Chrome Web Store 2026-09-06: Obsidian Web Clipper 1,000,000 users; Markdown Viewer 500,000.
- The editor sketch includes: Comments, Share, Bookmarks, Tags, Document history, an AI writing section
  that appears ON LOAD (the Google Docs pattern). None of these four has a state design or demand evidence.
`

const MARKET_SCHEMA = {
  type: 'object',
  required: ['verdict', 'findings', 'implication', 'recommendation'],
  properties: {
    verdict: { type: 'string', description: 'One line: what this gap turned out to be' },
    findings: { type: 'array', items: { type: 'object', required: ['claim', 'evidence', 'source_url', 'opened'],
      properties: { claim: { type: 'string' }, evidence: { type: 'string', description: 'number + denominator + date, or verbatim quote' }, source_url: { type: 'string' }, opened: { type: 'boolean' } } } },
    implication: { type: 'string', description: 'what it means for the plan, specifically' },
    recommendation: { type: 'string', description: 'KEEP / CUT / RESHAPE / DEFER for the plan element this gap touches, and the one-sentence reason' },
    still_unknown: { type: 'string', description: 'what you could not measure, and why' },
  },
}

const REFUTE_SCHEMA = {
  type: 'object',
  required: ['results', 'overall', 'missed'],
  properties: {
    results: { type: 'array', items: { type: 'object', required: ['claim', 'verdict', 'why'],
      properties: { claim: { type: 'string' }, verdict: { type: 'string', description: 'CONFIRMED | REVISED | REFUTED | UNVERIFIABLE' }, corrected: { type: 'string' }, why: { type: 'string' } } } },
    overall: { type: 'string', description: 'Does the verdict survive? Plainly.' },
    missed: { type: 'string', description: 'What the researcher did not look at that would change the answer' },
  },
}

const CRITIC_SCHEMA = {
  type: 'object',
  required: ['closed', 'still_open', 'new_gaps', 'plan_changes'],
  properties: {
    closed: { type: 'array', items: { type: 'string' }, description: 'gaps this round actually closed, with the settling number' },
    still_open: { type: 'array', items: { type: 'string' }, description: 'gaps that remain open after this round, and what would close each' },
    new_gaps: { type: 'array', items: { type: 'string' }, description: 'things nobody has asked yet that this round exposed' },
    plan_changes: { type: 'array', items: { type: 'string' }, description: 'specific lines in the v10.1 plan that must change, and to what' },
    untested_assumptions_ranked: { type: 'array', items: { type: 'string' }, description: 'the assumptions the plan still rests on, ranked by how much a wrong answer would cost' },
  },
}

const GAPS = [
  { key: 'speckit-real-usage', title: 'Is anyone actually USING spec-kit and superpowers, or just starring them?', prompt: `
Stars are bookmarks. Measure usage. Open, with dates:
- github.com/github/spec-kit/network/dependents (HTML, no auth) — count dependents/packages if shown.
- Issues API, all states, paginate: count unique issue authors per month for the last 6 months; count issues opened per month. A tool people USE generates a steady stream of distinct reporters; a starred-and-forgotten one does not. Do the same for obra/superpowers.
- PyPI: pypistats overall for specify-cli, but ONLY count from 2026-06-05 onward (GitHub's first upload; earlier rows belong to an unaffiliated package). Report the daily/weekly rate now.
- GitHub code search (auth): count repos, not files, that contain a committed .specify/memory/constitution.md (try: "constitution" path:.specify, and filename:constitution.md path:.specify/memory). Also count files matching path:specs/ filename:plan.md "Implementation Plan" (spec-kit's plan template title) as a second usage proxy. Report total_count per query and read 20 hits to estimate what share are template copies vs real projects.
- For superpowers: code search for path:docs/superpowers/specs (its committed design-spec path).
- Releases: cadence over the last 90 days for both.
Decisive: give a defensible ESTIMATE, with the method, of monthly active projects using each tool. If you cannot, say what number you CAN stand behind.` },
  { key: 'vscode-marketplace', title: 'The population the pilot sells to: VS Code Marketplace and Open VSX install counts', prompt: `
Use the Marketplace query API (POST, see tool notes) and Open VSX. Get INSTALL counts, ratings and last-updated for:
- Anything spec-driven / plan-mode: search "spec kit", "spec-driven", "specify", "kiro", "plan mode", "BMAD".
- Agent extensions the pilot's buyer already runs: Cline, Roo Code, Continue, GitHub Copilot Chat, Claude Code (VS Code extension), Codex.
- Markdown editing in VS Code: "Markdown All in One", "Markdown Preview Enhanced", Foam, Dendron, "markdown" generally (top 10 by installs).
- Provenance-adjacent: search "AI generated", "track changes", "review", "who wrote", "highlight AI".
Report installs with the fetch date. Then answer: how large is the population that (a) edits markdown in VS Code, (b) runs an agent extension, (c) has any provenance-like tool today? Are (a) and (b) the same people? What does the top-installed markdown extension's feature list tell us about table stakes?` },
  { key: 'comments-share-bookmarks', title: 'Comments, Share and Bookmarks are drawn on the screen and have no state design', prompt: `
Three features in the editor sketch would each need state. Research how markdown-native tools handle each, then test every option against the projection law (state may live IN the markdown, or in a sidecar file in the user's repo; never in a vendor database).

COMMENTS: CriticMarkup ({>> <<}, {++ ++}, {-- --}) — spec and adoption; HTML comments <!-- -->; Obsidian %% comments %%; Typora/HackMD/Zettlr/iA Writer comment features; GitHub PR review comments on .md; Google Docs comment anchoring. For each: does it survive rendering on GitHub? Does it keep the file valid markdown everywhere? Can a comment be anchored to a byte range and survive edits around it (the same anchor problem provenance already solves)? Find complaint/request volume for "comments in markdown" (GitHub issues in:title on Obsidian, Zettlr, HackMD; forum posts).
SHARE: what does "share" mean for a local-first, no-hosting tool? Options: a git permalink; a read-only rendered page (hosting — refused); an export (PDF/HTML file); Obsidian's Publish ($8/site) and its Share-note community plugins (count installs on the Obsidian registry: "Share Note", "Obsidian Publish alternatives", "Digital Garden" — the registry JSON is at raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json). What do people actually use to share a note?
BOOKMARKS: Obsidian's core Bookmarks stores state in .obsidian/bookmarks.json (a dotfile in the vault) — verify; VS Code bookmarks extensions (installs); is a per-user bookmark list acceptable as a sidecar in the repo, or is it per-user state that should stay local?
Deliver a decision table: feature → where the state lives → valid-markdown-everywhere? → verdict (ship in markdown / ship as repo sidecar / ship local-only / cut) → evidence of demand.` },
  { key: 'ai-on-load', title: 'The AI writing section that appears on load — do people want AI present before they ask?', prompt: `
The sketch shows a Google-Docs-style AI writing panel visible when a document opens. Test the pattern.
- Google Docs "Help me write" / Gemini side panel: when does it appear, and is it dismissible/disable-able? Open Google's help pages.
- Notion AI: on-load presence, and the documented ways to turn it off. Notion's own help pages.
- Cursor / Zed / Obsidian Copilot: is AI hidden until invoked (Cmd-K/Cmd-J) or visible at rest?
- Backlash evidence, counted: HN stories and comments for "turn off AI" / "disable copilot" / "AI button" / "unwanted AI features" / "Gemini in Docs" with counts and points; Reddit r/ObsidianMD and r/Notion for "disable AI"; GitHub issues in:title "disable AI" across popular editors. Read the top 20 and classify: is the complaint about AI existing, or about AI being IN THE WAY?
- Any A/B or usage data published by a vendor on invoked-vs-ambient AI? (Likely none — say so.)
Decisive: should the panel be visible on load, collapsed on load, or hidden until Cmd-J? Ground it in what the incumbents converged on and what the complaint corpus says.` },
  { key: 'team-features', title: 'What 2–5 person teams actually pay for in a document tool, and whether who-reviewed-what is wanted', prompt: `
The $8/seat tier rests on an inference from Obsidian's commercial licence. Test it.
- Obsidian commercial licence: open obsidian.md/license and the pricing FAQ; what does the licence ACTUALLY grant beyond permission? Any published numbers on commercial customers or logos?
- Notion, Linear, GitBook, HackMD, Nuclino team plans: which team features do they charge for (permissions, history, comments, admin, SSO, guests)? Fetch their pricing pages and list features by tier.
- Demand for review/provenance features in teams: GitHub issues in:title and HN/Reddit for "who wrote this", "AI-generated flag", "mark as reviewed", "review status", "unreviewed", "generated by AI badge" in doc/wiki tools; count and read.
- GitHub's own signals: PR review features, CODEOWNERS, "requires review" — adoption evidence.
- Evidence on what makes a small team pay for a second tool at all (willingness-to-pay studies, dev-tool pricing posts with data).
Decisive: is "provenance across a shared repo + who reviewed what" a feature teams pay for, a nice-to-have, or something they expect from GitHub already? What would the paid tier need instead?` },
  { key: 'generate-in-editor', title: 'Site and deck generation from inside the editor — real demand or a feature we like?', prompt: `
Measure the category from inside the editor's position, not the SSG market.
- Markdown slides: Marp (marp-team/marp-vscode installs on the Marketplace via the query API; marp-core stars), Slidev stars + npm downloads (npm registry API: registry.npmjs.org/-/package/<name>/… or api.npmjs.org/downloads/point/last-month/<name>), reveal-md downloads. Is "deck from markdown" used, and by whom?
- Markdown → site from a vault: Obsidian Publish adoption signals (forum, plugin-stats for Digital Garden / Quartz users), Quartz stars, "Obsidian Publish alternative" search volume on HN/Reddit with counts.
- Docs generators that live IN an editor vs beside it: Typora export, iA Writer export, Zettlr; GitBook's editor.
- Complaints: "export markdown to website" / "publish my notes" request counts on Obsidian forum / GitHub issues in:title.
Decisive: is generation (a) a wanted feature that pulls users, (b) a checkbox people expect, or (c) a distraction? Where should it sit: MVP-1, MVP-2, or cut?` },
  { key: 'ai-verb-demand', title: 'What people actually ask an editor AI to do — measured by requests, not English usage', prompt: `
A prior count (rewrite 215, search 161, tag 110, summarise 41 of 1,325) matched issue BODIES and comments, so it counted English usage. Re-measure with in:title on real request streams:
- GitHub issues in:title is:issue for the Obsidian Copilot plugin (logancyang/obsidian-copilot), Continue (continuedev/continue), Cline, Zettlr, and any markdown-AI tool with a public tracker: count titles containing each verb family — rewrite/improve/edit, summarise/summary, ask/chat/question, search/find, explain, generate/draft/write, translate, fix links/format, outline, tag. Give the denominator (total issues) per repo.
- Feature-request labels only, where the repo uses them.
- Obsidian forum "Feature requests" category search counts for the same verbs (forum.obsidian.md/search.json?q=… if reachable).
- Any vendor-published usage data on which AI actions get used (Notion, Grammarly, Google have published some — find primary posts).
Decisive: rank the verbs by evidenced demand, with the method, and say which two belong in the pilot's file-scoped panel and which are noise.` },
  { key: 'retention-churn', title: 'Retention and churn in editors and dev tools — what is actually published', prompt: `
Find every PRIMARY published retention/churn number for products comparable to a free editor with a paid team tier:
- Obsidian: any published MAU/DAU/retention (their blog, interviews with the founders, the 2023–2026 "Obsidian is X years old" posts).
- Zed, Cursor, Notion, Linear, Raycast, Warp, Bear, Ulysses: blog posts, investor letters, podcast transcripts with numbers.
- Dev-tool benchmarks with denominators: OpenView/ICONIQ/Lenny's freemium conversion and retention benchmarks; a16z consumer-vs-prosumer retention curves; the "vibe coding churn" analyses (Brodzinski) — quote exactly what is and is not known.
- App-store review velocity as a proxy for churn where nothing else exists — explain the method and its weakness.
Decisive: what retention assumption can the plan defensibly make for (a) free individuals and (b) $8 team seats, with the source for each — and label clearly what is UNVERIFIABLE.` },
  { key: 'reddit-sweep', title: 'Reddit, properly: provenance-adjacent asks, spec-driven sentiment, and switching triggers', prompt: `
Reddit was intermittently blocked in earlier rounds. Try again, with fallbacks (old.reddit.com JSON, .json on comment threads, redditsearch alternatives). Subreddits: r/ObsidianMD, r/ClaudeAI, r/cursor, r/ChatGPTCoding, r/ExperiencedDevs, r/Notion, r/vibecoding.
Count, with denominators (total posts matched per query, top-20 read and classified):
- Provenance-adjacent: "which part did the AI write", "AI wrote", "track AI changes", "highlight AI text", "know what AI changed", "review AI edits", "AI edited my", "mark AI generated".
- Spec-driven: "spec kit", "spec-driven", "superpowers", "kiro", "plan mode", "write a spec first".
- Editor switching triggers: "switched from Obsidian", "left Notion", "moved to", "looking for a markdown editor that".
- Slop: "AI slop", "unmaintainable", "verbose code" — to check the 23.7% finding holds on Reddit.
For each, report: matched count, share that is actually about the thing after reading, top post score and date, and 3 verbatim quotes that show what people want.
Decisive: does Reddit support, complicate, or refute the provenance thesis and the spec-driven channel?` },
]

phase('Research')
const results = await pipeline(
  GAPS,
  (g) => agent(`You are closing one untested gap in a product plan with live primary evidence. Be right, not encouraging.
${CONTEXT}
YOUR GAP: ${g.title}
${g.prompt}
${TOOLS}
${RULES}
Open at least 6 distinct primary sources. Every finding carries a number with a denominator, a date, and a URL you fetched.`,
    { label: `research:${g.key}`, phase: 'Research', schema: MARKET_SCHEMA }),
  (research, g) => {
    if (!research) return null
    return agent(`You are an adversarial verifier. Another researcher produced the findings below on "${g.title}". Assume each is wrong until you re-open the source yourself.
${TOOLS}
FINDINGS TO ATTACK:
${JSON.stringify(research, null, 2)}
For EACH finding: if opened=false, open it or mark UNVERIFIABLE. If opened=true, re-fetch and check the claim is what the source says — watch for a missing denominator, a stale date, a keyword artifact (read the hits), a metric that is not what it is called, and the misapplied-analogy error (does it bear on THIS plan?). Then say what the researcher did not look at. Default to REFUTED or UNVERIFIABLE when uncertain.
${RULES}`,
      { label: `refute:${g.key}`, phase: 'Refute', schema: REFUTE_SCHEMA })
      .then((v) => ({ gap: g.key, title: g.title, research, verification: v }))
  }
)

const gaps = results.filter(Boolean)
log(`gaps researched and refuted: ${gaps.length}/${GAPS.length}`)

phase('Critic')
const critic = await agent(`You are the completeness critic for a research round. Nine gaps were researched and each was then adversarially verified. Read all of it and answer: what did this round actually close, what is still open, what new gaps did it expose, and which specific lines of the plan must change.
${CONTEXT}
THE ROUND'S OUTPUT (research + verification per gap):
${JSON.stringify(gaps, null, 2)}
Rules: only count a gap as CLOSED if the refuter CONFIRMED the settling number. A REVISED number closes the gap only at its revised value. Anything UNVERIFIABLE stays open. Rank the plan's remaining untested assumptions by how much a wrong answer would cost the founders. Be specific: name the plan section and the sentence.
${RULES}`,
  { label: 'critic:completeness', phase: 'Critic', schema: CRITIC_SCHEMA })

return { gaps, critic }
