// SPAWN-GATE: q1=y q2=y q3=y  (eleven independent gaps from docs/GAPS-2026-09-08.md, each needs primary sources or hands-on runs plus adversarial verification; explicitly authorised by the founder: "go ahead with all the batches")
export const meta = {
  name: 'solidify-round',
  description: 'Close the seven founder-independent gaps in docs/GAPS-2026-09-08.md: attack the review-state thesis, weigh the form factor, run the toolchains hands-on, spike the Obsidian plugin, restore fundamentals and DPDP, measure velocity, define the Pro offer, the name collision, export for developers, the Chrome extension',
  phases: [
    { title: 'Research', detail: 'one agent per gap; primary sources, hands-on runs, local git' },
    { title: 'Refute', detail: 'an adversarial second agent per gap' },
    { title: 'Critic', detail: 'what closed, what is still open, what the plan must change' },
  ],
}

const TOOLS = `
TOOL NOTES:
- WebFetch and MCP connectors are blocked by a security gate in this session. Use Bash + curl:
    curl -sL --compressed -A "Mozilla/5.0" "<url>" | head -c 300000
    curl -sL "https://api.github.com/repos/<o>/<r>"        (unauthenticated is fine for repo metadata)
    curl -sL "https://api.github.com/search/repositories?q=<q>&sort=stars&per_page=10"
    curl -sL "https://hn.algolia.com/api/v1/search?query=<q>&tags=comment&hitsPerPage=100"
    VS Code Marketplace (POST): curl -sL -X POST "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery" -H "Content-Type: application/json" -H "Accept: application/json;api-version=3.0-preview.1" -d '{"filters":[{"criteria":[{"filterType":8,"value":"Microsoft.VisualStudio.Code"},{"filterType":10,"value":"<terms>"}],"pageNumber":1,"pageSize":30}],"flags":914}'
    raw files: https://raw.githubusercontent.com/<o>/<r>/<branch>/<path>
- GitHub CODE search needs auth, in ONE command: source /Users/sagnikmitra/.config/codex-env/tokens.zsh && curl -sL -H "Authorization: Bearer $GH_TOKEN" -H "Accept: application/vnd.github+json" "https://api.github.com/search/code?q=<urlencoded>&per_page=1"
  NEVER print or write the token. If "Operation not permitted" appears, that is the sandbox: retry that ONE command with dangerouslyDisableSandbox: true and note it.
- Local reads of this repo (/Users/sagnikmitra/Desktop/GitHub/frontmatter) and the sibling (/Users/sagnikmitra/Desktop/GitHub/md) are allowed and encouraged. Read-only.
- If a host refuses after alternatives, mark UNVERIFIABLE. Never guess a number.
`
const RULES = `
EVIDENCE RULES:
- Every number from a response you fetched or a command you ran in this task; opened=true only for URLs actually retrieved. Denominator and date always. Quote the source's words for anything decisive. Read the hits, do not count keywords blindly.
- You are expected to REFUTE the plan where the evidence says so.
- Do NOT run any destructive operation: no git commit/push/reset/clean, no rm -rf outside a temp dir you created, no writes inside /Users/sagnikmitra/Desktop/GitHub, no paid actions, no messages or PRs to anyone. Package installs and repo clones are allowed ONLY inside a fresh directory under $TMPDIR. If a step seems to need more, stop and report.
`
const CONTEXT = `
THE PRODUCT (frontmatter, Studio Zephyrus): a markdown editor on a byte-exact splice engine (replace only the requested byte range; refuse when ambiguous; 8,513-file pinned corpus). Documents stay in the user's own repo. Plan v14 (docs/PRODUCT-BRIEF.md) says: the product is REVIEW STATE — every span changed since a person last read it is tinted, one-key revert, a review panel with a counter; state kept as a plain-text sidecar .frontmatter/review.jsonl in the repo, spans anchored by byte range + content hash. Author/prompt shown when the write carried them. Free editor (web + desktop); Team $4-5/user/mo (shared review state, comments, MCP); Max later (sync, CI gates). Channels: a free Obsidian plugin fixing nested live preview (week 2), the spec-driven toolchains (superpowers ~75-85k public repos, spec-kit 11,072), a Chrome extension later. Founder-validated features: idea mode (PRD/FRD/BRD from an idea) and a decision flow (questions before generating). Repo docs scan: stale sections by git dates, broken links, missing AGENTS.md/CHANGELOG.
VERIFIED THIS WEEK (may be contradicted with evidence): authorship marking alone did not sell (iA Writer 7 since 2023; 208-download Obsidian port; best VS Code ext 366 installs; 1 Reddit ask in 107); Claude Code diff-review request open at 262 reactions; Claude Code 2.1.70 opens plans as markdown with inline comments; VS Code Copilot Chat 78.06M installs, Claude Code ext 24.89M, markdown-all-in-one 14.45M; GitHub Team $4 sells required reviewers/CODEOWNERS on private repos; Obsidian Sync $4, Publish $8, commercial licence confers nothing; sub-$50 ARPA band retains 60-70% top quartile, 23% AI-native; File System Access API only on desktop Chrome/Edge; api.github.com supports CORS.
THE GAP REGISTER: docs/GAPS-2026-09-08.md in the repo — read it first.
`
const RESEARCH_SCHEMA = { type:'object', required:['verdict','findings','implication','recommendation'], properties:{
  verdict:{type:'string'}, findings:{type:'array', items:{type:'object', required:['claim','evidence','source','opened'], properties:{claim:{type:'string'}, evidence:{type:'string'}, source:{type:'string', description:'URL, file path, or the command run'}, opened:{type:'boolean'}}}},
  implication:{type:'string'}, recommendation:{type:'string', description:'KEEP / CUT / RESHAPE / DECIDE-BY-FOUNDERS for the plan element, with one sentence'}, still_unknown:{type:'string'} } }
const REFUTE_SCHEMA = { type:'object', required:['results','overall','missed'], properties:{
  results:{type:'array', items:{type:'object', required:['claim','verdict','why'], properties:{claim:{type:'string'}, verdict:{type:'string', description:'CONFIRMED | REVISED | REFUTED | UNVERIFIABLE'}, corrected:{type:'string'}, why:{type:'string'}}}},
  overall:{type:'string'}, missed:{type:'string'} } }
const CRITIC_SCHEMA = { type:'object', required:['closed','still_open','plan_changes','founder_decisions'], properties:{
  closed:{type:'array', items:{type:'string'}}, still_open:{type:'array', items:{type:'string'}}, new_gaps:{type:'array', items:{type:'string'}},
  plan_changes:{type:'array', items:{type:'string'}, description:'specific v14 section and the replacement text'}, founder_decisions:{type:'array', items:{type:'string'}} } }

const GAPS = [
 { key:'attack-review-state', title:'Adversarial: is "changed since you last reviewed, persisted per span, across tools and people" wanted and purchasable?', prompt:`
This is the plan's page one and it has never been attacked. Attack it.
- Read anthropics/claude-code issue #33932 (the diff-review UI request, 262 reactions) IN FULL via the API (issues/33932 and its comments): what exactly do commenters ask for — a per-session diff, or persistence across sessions/people? Count the comments that ask for each.
- Shipped precedents of "what changed since I last looked": Google Docs "See new changes" / "show changes since last visit" (open Google's help page and quote it); GitHub pull requests' per-file "Viewed" checkbox that persists (open GitHub docs, quote); Notion page-update badges; Confluence "unread". For each: does it persist per span, per file, or per page; across people; across tools? If Google Docs and GitHub already ship this, what is left for frontmatter and is it worth switching editors for?
- Demand: HN Algolia and GitHub issues for "unread changes", "since I last viewed", "what changed since", "mark as reviewed" in editor/doc tools — counts with denominators, top 20 read.
- Purchase: any product that charges specifically for review/unread state? (Reviewable, Graphite, Google Workspace tiers). Quote pricing pages.
Decisive: state the strongest case that review state is a feature of existing tools, not a product; then what survives.` },
 { key:'form-factor', title:'Standalone editor vs VS Code extension vs Obsidian plugin vs all three — with numbers', prompt:`
The plan builds a standalone editor without weighing the extension. Weigh it.
- VS Code extension capability: can an extension tint byte/character ranges in a markdown file (TextEditorDecorationType), persist a sidecar file, intercept saves, add a review panel (TreeView/Webview)? Open the VS Code API docs and quote. Can it do byte-exact writes (the API edits UTF-16 text; the engine has an offset map)? Any blocker?
- Precedents: extensions that became the product (GitLens installs and Acquisition; Foam, Dendron installs; Front Matter CMS installs) vs standalone editors (Obsidian, Zed). Marketplace API for installs, dated.
- Cost: what table stakes does a standalone editor need that an extension gets for free (tabs, tree, search, palette, keymaps, settings, updater, signing)? Estimate from the plan's own day table.
- Distribution: how do users find extensions (Marketplace search, recommendations) vs standalone apps? Any data on install conversion from Marketplace listing views (unverifiable probably — say so).
- What an extension CANNOT do: the Obsidian audience, non-VS-Code users, the "open a folder, no install" web trial, the desktop MCP server story.
Decisive: a decision table — standalone-only / extension-only / extension-first-then-standalone / both-from-one-core — with reach, cost, and what is lost; and a recommendation.` },
 { key:'toolchains-hands-on', title:'Run spec-kit, superpowers, Kiro-style and plan mode on a scratch repo; record exactly what files a human is left with', prompt:`
Nobody has run these. Do it, inside a fresh directory under $TMPDIR only.
- spec-kit: check for uv/uvx (which uvx) or pip; then in $TMPDIR/sk run: uvx --from git+https://github.com/github/spec-kit.git specify init demo --ai claude --ignore-agent-tools (or the documented equivalent; read the README first). List every file it creates (find . -type f), print the spec template and the clarify command file, and note every [NEEDS CLARIFICATION] and Q:/A: convention. Do NOT run any agent; just the CLI init.
- superpowers: git clone --depth 1 https://github.com/obra/superpowers into $TMPDIR/sp; read skills/brainstorming/SKILL.md and writing-plans; record the exact output paths (docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md, plans) and what the human is asked to do at the review gate; does anything persist as "unreviewed"?
- Kiro: cannot run headless; open kiro.dev/docs/specs and quote the file layout (.kiro/specs/<name>/requirements.md, design.md, tasks.md) and whether the human edits those files or answers in chat.
- Claude Code plan mode: open the docs page for plan mode; where are plans stored on disk? Check this machine read-only: ls ~/.claude/plans 2>/dev/null and any plan-file convention; do NOT open private plan contents beyond filenames/sizes.
Decisive: a table — tool → files written → path → does a human open them in an editor afterwards → is any question left in the file → is anything marked unreviewed. Then: which of these produce a real "open it in frontmatter" moment.` },
 { key:'obsidian-plugin-spike', title:'Can a community plugin fix nested-construct live preview in Obsidian?', prompt:`
The week-2 channel assumes yes. Find out.
- Read obsidianmd/obsidian-api obsidian.d.ts (raw): registerEditorExtension (CodeMirror 6 extensions), registerMarkdownPostProcessor (reading view only), editorLivePreviewField, livePreviewState. Can a plugin re-render nested code blocks inside list items in LIVE PREVIEW, or only decorate?
- Forum thread forum.obsidian.md/t/31352 (501 likes): fetch the JSON (append .json) and read the posts: has anyone shipped a plugin workaround? What do Obsidian staff say?
- Community plugin registry (raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json and community-plugin-stats.json): plugins that modify live preview rendering (search names/descriptions for "live preview", "render", "code block", "list"); their downloads.
- Obsidian's own changelogs (obsidian.md/changelog) for recent live-preview fixes to nested constructs: is the bug still open?
Decisive: FEASIBLE (mechanism), PARTIAL (what a plugin can and cannot fix), or NOT FEASIBLE — and what replaces the week-2 channel if not.` },
 { key:'fundamentals', title:'Markdown fundamentals: Djot, the CommonMark ambiguity catalogue, dialects, and the per-construct expectations the certificate needs', prompt:`
The plan says "no new format" without showing why. Provide the evidence.
- Djot: djot.net and github jgm/djot (stars, created, activity); what it changes vs CommonMark (quote the rationale); who supports it (editors, static site generators); adoption signals. Why frontmatter should read it or not.
- CommonMark: spec.commonmark.org version and example count; the known ambiguous/underspecified areas (tabs, HTML blocks, link reference definitions, list item indentation, emphasis rules); the CommonMark "known issues"/talk discussions. Which of these bite a byte-exact editor?
- Dialects: GFM extensions (tables, task lists, strikethrough, autolinks, footnotes), Obsidian additions (wikilinks, callouts, embeds, properties, comments %%), MDX, Pandoc, kramdown. For each construct in frontmatter's 19 (read src/modules/mdmax/domain/constructs.ts in the repo): which spec defines it, which engines implement it. This is the per-construct expectation table the certificate needs instead of modal consensus.
Decisive: the table, plus the one-paragraph "why not a new format" with Djot's numbers.` },
 { key:'dpdp-and-law', title:'DPDP and the other statutes for a vendor that holds identity and billing but no documents', prompt:`
The record has 33 files on DPDP; the plan has none. Restore it from primary text.
- India DPDP Act 2023: fetch the Act text (meity.gov.in or indiacode); quote §8(5), §8(6), §8(7), §8(8), §12(3); Schedule penalties. DPDP Rules 2025: notified? breach-intimation timeline (hours), consent manager, data retention/erasure periods, cross-border transfer rules. Quote.
- Our posture: identity + billing only, documents never held. What is still required: notice, consent, breach intimation to Board and each Data Principal, erasure on withdrawal/inactivity/request, grievance officer, retention schedule. Which apply at the pilot (10 users) and which at scale.
- GDPR for EU users of a free tool (lawful basis, DPA with processors, representative), and IT Act s.79 / IT Rules 2021 intermediary status for a tool that hosts nothing.
- GST RCM (already known: no floor) — one line.
Decisive: the operating-rule lines to add to the plan (each with the section), and the runbook items (breach clock, erasure job, grievance contact).` },
 { key:'velocity', title:'Measured velocity from this repo and the sibling, replacing inspected day estimates', prompt:`
Read-only git analysis. In /Users/sagnikmitra/Desktop/GitHub/frontmatter and /Users/sagnikmitra/Desktop/GitHub/md:
- git log --since=90.days --shortstat --format=... : commits per week, lines added/removed, files, distinct authors; split docs/ vs src/ vs test/.
- Identify 5-8 completed feature-sized units in the last 90 days (from commit messages and diffs) and how many calendar days each took from first to last commit.
- The plan's estimates (docs/PRODUCT-BRIEF.md Exhibit 1 and section 9): compare against the measured rate; the audits found the earlier 41-day estimate 2.5x optimistic — does the 90-day history support that factor?
Decisive: a velocity number with its method (src lines/week, commits/week, feature-days), and a re-estimate of MVP-0 with a range.` },
 { key:'pro-offer', title:'What the Pro tier must contain to be worth $4-5 when GitHub Team already sells reviewers at $4', prompt:`
Pro at MVP-1 is shared review state, comments, MCP — thin. Define it from what comparables charge for.
- GitHub pricing page: exactly which features are Free vs Team ($4) for private repos (required reviewers, code owners, draft PRs, protected branches, pages); GitHub PR per-file "Viewed" persistence. Quote.
- Obsidian Sync: version history duration (1 year? per plan), device limits, vault count, storage — quote help.obsidian.md/sync/... pages. Obsidian Publish features.
- HackMD ($5), Confluence Standard ($6.70), Notion Plus: what gates the paid tier (history days, guests, storage, seats). Quote pricing pages.
- Data: any published evidence on which gate converts (Notion's block limit history; Obsidian's sync take-rate — likely unverifiable, say so).
Decisive: a Pro feature set that is not bundled free elsewhere, priced against the gates that comparables actually charge for; and what must move from Max to Pro to make it thick.` },
 { key:'name-collision', title:'"frontmatter" vs Front Matter CMS and the wider namespace', prompt:`
- VS Code Marketplace API: Front Matter CMS (publisher eliostruyf) installs, rating, last updated; any other "frontmatter" extensions and their installs.
- GitHub: estruyf/vscode-front-matter stars/created; npm packages named frontmatter/front-matter (registry.npmjs.org/front-matter, /frontmatter, /gray-matter downloads via api.npmjs.org/downloads/point/last-month/<name>); domains (frontmatter.codes is theirs — confirm by fetching).
- Search visibility: what "frontmatter" returns as a product term (DuckDuckGo html endpoint: https://html.duckduckgo.com/html/?q=frontmatter+editor) — top 10 results.
- Trademark: note that USPTO/IP India cannot be queried here; say UNVERIFIABLE.
Decisive: severity of the collision for (a) a VS Code extension, (b) a standalone app, (c) SEO; and three naming options with what each keeps.` },
 { key:'export-for-developers', title:'Export, sites and decks re-decided on the developer population, not note-takers', prompt:`
The cut used Obsidian download ratios. Re-decide with developers:
- GitHub code search (auth): counts of root CNAME files, mkdocs.yml, docusaurus.config.*, astro.config.*, _config.yml (Jekyll) — dated. Developers already deploy docs from repos: what does that make "export from the editor" worth?
- What dev teams ask for around docs publishing: GitHub issues in:title on docusaurus/mkdocs/astro-starlight for "preview", "edit", "wysiwyg", "review" — do they want an editor for their docs site sources?
- Marp/Slidev demand among developers specifically (npm downloads monthly, VS Code installs — already known: Marp 850k installs).
- What frontmatter could uniquely add to a docs-as-code pipeline: the review-state gate ("no unreviewed machine text ships") as a CI check — is there any precedent (docs linters in CI: Vale, markdownlint in GitHub Actions — usage counts via code search for their workflow YAML).
Decisive: KEEP export as single-doc HTML/PDF only, or RESHAPE into a CI gate for docs-as-code, or CUT — with the numbers.` },
 { key:'chrome-extension', title:'What the Chrome extension would actually do, and whether it is worth a week', prompt:`
"Open any .md URL in frontmatter" is undefined. Define or cut it.
- Markdown Viewer (500k users) and MarkDownload / Obsidian Web Clipper (1M): read their Chrome Web Store listings and top reviews/issues (GitHub issues for simov/markdown-viewer, obsidianmd/obsidian-clipper): what do people use them for; what do they complain about.
- GitHub already renders .md; raw.githubusercontent serves text/plain. Where does a developer meet an unrendered .md in the browser? (raw URLs, gists, S3, internal wikis?) Count precedents if possible.
- What could the extension add that is ours: review state for files whose sidecar the user has (needs the repo locally — contradiction?), a "review this in frontmatter" button on GitHub PR markdown diffs, clipping a page into the vault as markdown (Web Clipper already does).
Decisive: a one-sentence purpose that is not already served, or CUT; and if kept, the cheapest version.` },
]

phase('Research')
const results = await pipeline(
  GAPS,
  (g) => agent(`You are closing one gap from the register with primary evidence or hands-on work. Be right, not encouraging.
${CONTEXT}
YOUR GAP: ${g.title}
${g.prompt}
${TOOLS}
${RULES}
Return findings where each carries a number with a denominator and a date, or a command you ran and its output.`,
    { label: `research:${g.key}`, phase: 'Research', schema: RESEARCH_SCHEMA }),
  (research, g) => {
    if (!research) return null
    return agent(`You are an adversarial verifier. A researcher produced the findings below on "${g.title}". Assume each is wrong until you re-open the source or re-run the command yourself.
${TOOLS}
FINDINGS TO ATTACK:
${JSON.stringify(research, null, 2)}
For EACH finding: opened=false → open it or mark UNVERIFIABLE; opened=true → re-fetch/re-run and check the claim is what the source says. Watch for missing denominators, stale dates, keyword artifacts (read the hits), metrics that are not what they are called, and misapplied analogies (does it bear on THIS plan?). Then say what the researcher did not look at. Default to REFUTED or UNVERIFIABLE when uncertain.
${RULES}`,
      { label: `refute:${g.key}`, phase: 'Refute', schema: REFUTE_SCHEMA })
      .then((v) => ({ gap: g.key, title: g.title, research, verification: v }))
  }
)
const gaps = results.filter(Boolean)
log(`gaps researched and refuted: ${gaps.length}/${GAPS.length}`)

phase('Critic')
const critic = await agent(`You are the completeness critic. Eleven gaps from docs/GAPS-2026-09-08.md were researched and adversarially verified. Read all of it and the register, and answer: what is CLOSED (only where the refuter CONFIRMED the settling number, or at the REVISED value), what is STILL OPEN and what would close it, what NEW gaps were exposed, the specific v14 plan sections that must change (name the section, give the replacement text), and which decisions can only be made by the founders.
${CONTEXT}
THE ROUND'S OUTPUT:
${JSON.stringify(gaps, null, 2)}
${RULES}`,
  { label: 'critic:completeness', phase: 'Critic', schema: CRITIC_SCHEMA })

return { gaps, critic }
