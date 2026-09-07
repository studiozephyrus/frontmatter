# frontmatter
## The pilot plan: what we build first, what we cut, and how we sell it

> Amit, this is the plan for our meeting. I checked it against 157 sources this week and had to correct 60 things, three of them on this very page. So the numbers here were opened, not remembered. Where I was wrong before, I have said so in the same place.

::keyfigures
75–85k — public repos hold superpowers specs and plans. 22–30k of them were touched in the last 30 days
11,072 — public repos hold a spec-kit constitution. About 1,660 touched their specs in 30 days
0 — of the tools that write those files is an editor
6 — AI routes already live in our repo, on a five-provider fallback chain
97 / 53 / 7 — findings confirmed, revised, refuted in the round behind this page
::

## PART I — The decision

### 1. What we build

> [!good] **frontmatter is the editor where you see what the agent changed without being asked, and know what nobody has reviewed yet.** Open a spec the agent wrote. Everything changed since a person last read it is tinted. One key reverts any of it. Who wrote it, and the prompt, show up whenever the write carried them. Nothing else in the file moves.

**Three things I got wrong on this page last time.**

- **"See what the AI wrote" was shipped three years ago, and nobody bought it.** iA Writer 7 has dimmed AI-pasted text since November 2023. The Obsidian request to copy it got 65 likes and went quiet within a month. The port has 208 downloads. The best of twelve VS Code extensions doing the same thing has 366 installs. On Reddit there is one ask for it in 107 matching posts, with 2 points.
- **What people actually upvote is changes they did not ask for, and output they cannot review.** In Claude Code's own tracker the diff-review request has 262 reactions and "diff" is in 463 of 89,761 issue titles. Requests to *remove* AI authorship marks from commits got 29 and 36. So: show what changed. Do not tint who wrote it.
- **"Answer in place" is a small spec-kit feature, not the product.** The 62,976 figure I quoted was a template artefact. 49,408 of those files are spec-kit's own checklist line, *"No [NEEDS CLARIFICATION] markers remain."* Real open markers: about 1,500 public files, 2.7% of committed specs. superpowers has no such marker, and `/speckit.clarify` settles most of them in chat anyway.

**Why the reading surface is still ours.** Claude Code now opens plans as markdown with inline comments. VS Code previews range feedback on markdown. git-ai records who wrote which line, after the fact. Anthropic's models carry signed provenance metadata in the EU. Each of these records a moment. None of them keeps the state: which spans a person has read, kept across sessions, across teammates, across whatever tool wrote the file. That state is a byte-range record sitting next to the file in the user's own repo, and keeping it valid while the file changes is exactly the job our engine does.

**The demo, fifteen seconds.** Run your agent's spec command. Open the spec here. Every paragraph is tinted, because nobody has read it. Read one, it clears. Revert one, `git diff` shows only that. The panel on the right lists what is still unread, today, next week, or when you open it.

## PART II — The market

### 2. Who already does what, and where each one stops

::exhibit 1 | Fetched 2026-09-06, with denominators

| | Tool | Real reach | What it does | Where it stops |
|---|---|---|---|---|
| **Spec writers** | **obra/superpowers** | **75–85k public repos** with `docs/superpowers/specs` or `/plans`, 22–30k active in 30 days. The marketplace counter says 1,009,371, cached, definition unknown | Brainstorm, design, write the spec, commit it, gate it for review | A terminal tool. Not an editor. No review state |
| | **github/spec-kit** | **11,072 public repos** with a committed constitution, 82% real. About 1,660 active in 30 days | `/speckit.specify`, `/speckit.clarify` (asks in chat), plan, tasks, implement | Writes markdown, then leaves |
| | Plan mode in Claude Code, Cursor | Out-scores both named tools on Reddit (1,776 / 1,409 / 1,329 points against 38 or fewer). Cursor's markdown plan editor is praised at 167 | Plans as markdown files | Where those files live on disk is untested |
| **Review surfaces** | **Claude Code, VS Code extension** | 24.89M installs | **Plans as a full markdown document with inline comments since 2.1.70, March 2026.** This wiped out the third-party plan-review market: 222 installs across three tools | A moment, per session. The diff-review request is still open at 262 reactions |
| | git-ai, VS Code 1.118 | 61,517 installs; AI co-author trailers on by default | Line-level attribution after the fact, commit trailers | Commit granularity. Nothing persists per span |
| | SpecKit Companion | 9,367 installs | Keeps review state in a `.spec-context.json` per spec. **Our sidecar idea, already shipped** | Spec-kit only |
| **Editors** | **Obsidian** | Free. Sync $4. Publish $8 per site. Commercial $50 a year | AI comes as plugins: Copilot 1.83M downloads (*"run Claude Code, Codex and OpenCode inside your vault"*), Claudian 2.02M | None records what changed or what was reviewed |
| | Cursor, Zed | About $20, free | The strongest agent editing for code. Zed reviews per hunk | Whole-file rewrite. No markdown vault semantics |
| **Browser** | Obsidian Web Clipper, Markdown Viewer | **1,000,000 and 500,000** Chrome users | Capture and read markdown in the browser | A channel for us |
| **Hosted sites** | mdown.ai, Obsidian Publish | Aimed at non-engineers; $8 a site a month | Markdown to a live website, on their servers | The host role we refuse. We export, they host |

**On price, corrected.** The editor is worth ₹0 in this category. The one thing individuals have proven they pay for is sync, about $4. Last time I called Obsidian's $50 commercial licence a second proven price. It is not. It *"does not provide any functional benefits within the app"*, became optional in February 2025, and its buyers are organisations with 25 or more seats. It says nothing about a five-person team.

### 3. What was just AI vocabulary, and what survives

::exhibit 2 | Our own words, checked

| We said | What it turned out to be | Verdict |
|---|---|---|
| "Context packs", "handover generation" | Free now from GitHub and Anthropic. And the "median 2 points" graveyard was the Hacker News baseline all along | Cut |
| "Decision-flow renders" | A note-taker's plugin at 0.30 of the median, and the wrong buyer | Cut |
| "Kickoff prompt", "our CDN files" | A copy-paste step worse than a slash command, and a hop that breaks "we never hold your documents" | Cut |
| "Self-improving AIOS" | One feedback label from 6,884 decisions | Internal only |
| "Local LLM fallback" | Five cloud free tiers, not local. A constrained small model makes things up rather than refusing, in 10 of 13 models | Defer |
| "Byte-exactness" as the headline | 4 complaints in 12,556 | Mechanism, never the pitch |
| "See what the AI wrote" | Shipped by iA Writer in 2023. 208 downloads for the port, 366 for the best extension, one Reddit ask | Cut as the headline. Show the author when a write supplies it |
| "496,000 stars" as our channel | Stars are attention to a CLI. Real usage is low tens of thousands of active projects a month | Resized, above |
| "Uncopyable by anything that rewrites files" | False at commit level. Trailers and git-ai do it after the fact | Struck |
| **What changed since you reviewed, kept as a state** | The pain people upvote. Nobody persists it | **The product, if the two-week test passes** |
| Answer in place | About 1,500 public files, spec-kit only | A feature |
| File-scoped AI | Table stakes. Two verbs have real demand | Keep, your own key, collapsed |

## PART III — What we ship

### 4. Keep, cut, defer

::exhibit 3 | Every proposed piece, decided. Nine changed since last time

| # | Proposed | Verdict | Why |
|---|---|---|---|
| 1 | The editor: Live, Edit, Split, Read | **Keep** | The free tier. Zed launched with zero AI words on its page. Obsidian's first build had none |
| 2 | The design system | **Keep** | Replace the sibling project's `globals.css` |
| 3 | **Review state**: tint since last read, revert, the panel | **Keep. This is the product** | The only thing in Exhibit 1 nobody persists |
| 4 | Author and prompt on hover | **Reshape** | Shown when the write carried them: an MCP write, a commit trailer, a git-ai note, signed metadata. **At MVP-0 a file the agent wrote with its own tools has no prompt to show.** The state is "changed since you reviewed", and the demo has to say so |
| 5 | Answer `[NEEDS CLARIFICATION]` in place | **Keep as a feature** | About 1,500 live public files. Cheap. Spec-kit only |
| 6 | The AI writing section, open on load | **Reshape: collapsed, no model call on load, a "hide all AI" switch from day one** | No incumbent opens a panel at rest. Zed, VS Code and Telegram each shipped a hide switch after 412, 30 and 181-reaction issues. Our own record had already refused ambient AI; the sketch was a step back |
| 7 | AI verbs in the panel | **Reshape to two** | Editor communities ask for AI in 0.13% of feature titles. Usage data says editing or critiquing text you supplied is 10.6% of all ChatGPT messages, and Notion's #1 and #3. Ship **"fix or critique this selection"**. **"Summarise this file"** provisionally. No translate, tag, outline or explain |
| 8 | Comments, drawn in the rail | **Reshape: a sidecar in the repo, v1.5** | Every in-file syntax fails on GitHub. `%%` and CriticMarkup print as literal text, `> [!comment]` renders as a plain quote, HTML comments hide but put reviewer bytes inside the artefact. Anchor by byte range plus content hash, moved by the splice locator |
| 9 | Bookmarks, drawn in the rail | **Cut** | Per-user, per-device state with no measured demand |
| 10 | Share, drawn in the rail | **Open** | "Permalink plus export" needs no state, but a plain folder has no commit and a private repo has no readable link. And our old record's distribution maths assumed a hosted viewer. Decision 3 |
| 11 | Generate a site or a deck | **Move to MVP-2, as export** | Marp is 5.9% of the top markdown extension's installs. Decks are 0.7% of Obsidian downloads. Sites from a folder are wanted hosted, which we refuse. Export (HTML, PDF, copy as HTML) beats decks 2 to 1 |
| 12 | Team tier: who reviewed what, at $8 | **Reshape** | **GitHub Team sells required reviewers and code owners on private repos at $4.** What small teams are actually gated on elsewhere: seats, history retention, shared-vault sync. Repriced in §8 |
| 13 | Generate all files, kickoff prompt, CDN, local model | **Cut or defer** | Unchanged |

### 5. The three tiers

::exhibit 4 | MVP-0 pilot, MVP-1 pro, MVP-2 max

| | **MVP-0, the pilot.** 10 weeks, free forever | **MVP-1, pro.** Teams | **MVP-2, max** |
|---|---|---|---|
| **Engine** | NF-1 and NF-3 fixed. CI, with one deliberate red run. Engine wired behind every write. A real byte budget | Vault-wide refactor with a reviewable diff, ambiguity refused | **Sync, provably safe.** Git merge, never a CRDT |
| **Editor** | Four modes. Tree with the unreviewed bar. Tabs, quick-switch, palette, search, properties, tags | Conflict view | Multi-device |
| **Review state** | Span-level "changed since reviewed" by content hash, in a sidecar in *their* repo. Tint. **One-key revert.** The review panel. Author when a trailer, note or MCP write supplies it | **Shared review state across a repo**: what each person has read. Comments as a sidecar (v1.5) | Version-history retention |
| **Answer in place** | `[NEEDS CLARIFICATION]` markers, inline | | |
| **AI** | Collapsed panel, **your own key only**, two verbs. **Hide-all switch.** Idea mode as it ships today. Structured output in the port | **MCP server**, so the agent's writes carry the prompt. Hosted AI metered and hard-capped, never the default | Document gates in CI |
| **Output** | | | Single-document export: HTML, PDF, copy as HTML. Decks if a pilot user asks |
| **Channels** | **Free Obsidian plugin, week 2.** Kill signal: under 200 installs in 14 days | Chrome extension: open any `.md` URL here | |
| **Absent, on purpose** | Sign-up, billing, sync, mobile, hosting, hosted AI, local model, generation | Mobile, plugins, a chat sidebar | Plugins, still |
| **Exit test** | **6 of 10 strangers keep it after two weeks, measured, not felt (§10)** | A team pays within 20 real conversations | Sync passes the corpus byte-identical |

**Before any stranger touches it, three things that do not exist today have to.** Bring-your-own-key (settings expose one boolean today, and every request bills us). Structured output in the LLM port (it returns a bare string). And CI (four of our gates have reported green while blind). Also one thing the research exposed: nobody has written down the byte path for the web trial. Does "connect a repo" fetch document bytes in the browser with the user's token, or through our server? "Zero document bytes in our control plane" depends on the answer.

### 6. How it is built, and the plugin question

The cheapest shape is the one where we run no model, hold no document, and sit inside the tools the user already pays for.

::exhibit 5 | The delivery surfaces

| Surface | Role | Cost to us | When |
|---|---|---|---|
| **Web app** | The trial. Visit a URL, connect a repo. Byte path to be decided (§5) | About $0 | MVP-0 |
| **Desktop, Tauri** | The daily surface. Local folders. Works offline for everything except language AI. Same build as the web app | $99 a year for Apple notarisation. Windows signing $150–400 a year, now with a hardware token | MVP-0 |
| **Review state from content hashes** | Works for files written by any tool, which matters because the toolchains write with the agent's own tools, not ours | About $0 | MVP-0 |
| **Their agent, over MCP** | The write carries the prompt. This is an assumption: agents own Write and Edit, and the toolchains tell them to write files directly. Whether any agent routes through us is untested | About $0 | MVP-1 |
| **Bring-your-own-key panel** | Their key, their machine to their provider. Never through us | About $0 | MVP-0 |
| **Obsidian plugin** | Distribution only | 4 days | Week 2 |
| **Chrome extension** | Distribution. 1.5M people already read markdown in a browser | About a week | MVP-1 |
| **Vendor CDN, hosting** | | | **Never** |

So, do we ask people to install a plugin? No. The plugin is a channel. The product is the web app and the desktop build, and the AI is theirs.

A few rules keep this cheap and honest. Documents never enter our control plane. Nothing runs in the background, so spend follows use, not time. Cap output, not input: output is 75.8% of spend. The byte-to-UTF-16 seam is the riskiest thing we own. And review state and comments anchor to bytes plus a content hash and get moved by the splice locator, never by our own journal, because git, other editors and agents all bypass the journal. SpecKit Companion's `.spec-context.json` is the pattern we have to be visibly better than.

## PART IV — The screens

### 7. As they will actually look

Built from the two hand-drawn layouts, with real content. **Clickable prototype:** [claude.ai/code/artifact/f6baec30-9d0f-4e4f-a231-50f178f0e65e](https://claude.ai/code/artifact/f6baec30-9d0f-4e4f-a231-50f178f0e65e), also in the repo at `docs/prototype/frontmatter-prototype.html`.

::exhibit 6 | S0, the launcher. Blank, four templates, existing edits sorted unreviewed-first

![S0 launcher](screens/s0-launcher.png)

The bar on every card is the product showing itself before anything is open. Templates are markdown skeletons: spec, decision record, handover, changelog.

::exhibit 7 | S2, the editor. Tree, coloured tabs, four modes, the review tint, the AI panel collapsed

![S2 editor](screens/s2-editor.png)

Text changed since you last reviewed it gets a light tint and nothing else. Click a span and you get when it changed, which bytes, the author from the commit trailer, and, to be honest, "prompt not recorded" for a file the agent wrote outside frontmatter. The AI panel is one collapsed line. Nothing runs until you ask, ⌘J opens it, and Settings can hide it completely.

::exhibit 8 | S3, answer in place. A spec-kit feature, kept because it is cheap

![S3 answer in place](screens/s3-clarify.png)

::exhibit 9 | S4, the review panel. Catching up on a file you did not watch being written

![S4 review](screens/s4-review.png)

Every changed span in order. `j` and `k` to move, `a`, `r`, `s` to accept, revert or skip, and a counter that goes to zero. This is the state nobody else keeps.

::exhibit 10 | S2, split. Source and rendered, the same bytes

![S2 split](screens/s2-split.png)

::exhibit 11 | S11, settings. The hide-all-AI switch, and the key field that does not exist yet

![S11 settings](screens/s11-settings.png)

::exhibit 12 | S8, refactor preview (MVP-1). The engine, made visible

![S8 refactor](screens/s8-refactor.png)

::exhibit 13 | S12, export (MVP-2). A site or a page from the folder, never hosted by us

![S12 generate](screens/s12-generate.png)

## PART V — Money, market, plan

### 8. Price, with the churn maths attached

::exhibit 14 | What we charge, corrected against what teams are actually gated on

| Tier | Price | What it is |
|---|---|---|
| **Individual** | **Free, forever, no limits** | The editor, review state, revert, answer in place, your own key. This is the distribution |
| **Pro, team** | **$4–5 per user a month.** Priced against GitHub Team $4, Obsidian Sync $4, HackMD $5, Confluence $6.70 | **Shared-vault sync, version-history retention, shared review state, comments, MCP.** Not "who reviewed what": GitHub sells that at $4 |
| **Max** | Later, per team | Document gates in CI, retention beyond a year, admin |
| Hosted AI | Metered, at cost plus a margin | Optional, never the default |

The maths, plainly. Our monthly nut is about ₹1.09L, covered by 54–78 consulting hours. Infrastructure is about $0 at 100 users and about $390 a month at 10,000, because we store no documents. Support is the real cost, roughly 90 founder-hours a month at scale. **I withdraw "114 seats at $8".** The feature it priced is GitHub's at $4, and accounts under $50 a month sit in the worst-retaining band there is: top-quartile annual gross retention 60–70% across 2,100 businesses, and 23% for AI-native products. Holding 114 seats would mean replacing 34–46 of them every year, at best. Nobody comparable publishes retention. Obsidian says on record, *"we don't know what suddenly causes someone to churn."* So the team tier is a hypothesis until the 20 conversations in §11 tell us seat counts and what teams are gated on.

> [!test] Give away what the category has proven is free. Charge for what small teams are gated on elsewhere: seats, history, sync. Never for a feature GitHub bundles. Downgrading loses features, never files.

### 9. What grabs users, and how we reach them

The message is now three versions, tested in weeks 1–2 instead of one line picked by us: *See what the AI wrote.* **See what the agent changed without asking.** **Know what nobody has reviewed yet.** Reddit's top twenty "AI wrote" posts contain zero asks for authorship; the upvoted pain is the second and third. Under any of them, the proof line: *`git diff` after an edit shows your change and nothing else. Tested on 8,513 real files, every release.*

Lead with what we refuse, because this audience is tired of AI tooling: no plugins, no code execution, no holding your files, no lock-in, and a switch that hides every AI feature, which the incumbents only shipped after a backlash. Never say revolutionary, seamless, AI-native, or byte-preserving in a headline.

::exhibit 15 | Channels, resized to real usage, in the order we use them

| When | Channel | Size, measured | What we do |
|---|---|---|---|
| **Week 2** | **Free Obsidian plugin**, the live-preview fix | 501 likes, 117 posts, open since 2022. Against it: Obsidian patches live preview monthly, and the nearest plugin-level render fix has 1,454 downloads | Ship it. **Kill signal: under 200 installs in 14 days** |
| Week 2 on | **superpowers first, spec-kit second, plan-mode files third** | 22–30k, then about 1,660 active public projects a month. Plan-mode size untested | A README line, an MCP entry, "open the spec here" in their docs. A PR to a maintainer is an outbound act, so we ask you first |
| Now on | Our own writing | | The research behind this document. Nobody has published it |
| MVP-0 exit | Show HN | Zed's scored 43, Cursor's 9 | After 6 of 10 strangers keep it. One shot |
| MVP-1 | Chrome extension, Product Hunt | 1.5M browser readers | Backlinks and a spike |
| MVP-2 | Exported pages with an honest mark | Not a channel until a deploy count exists | Withdrawn from "always" |

How we use the users we get. The ten pilot strangers are the interviews we have never done. Every accept and revert is a preference signal, logged only in a local sidecar they can read, because the same architecture that keeps their documents out of our hands keeps their usage out too. The plugin's installers are the list we do not have.

### 10. Challenges, and what we do about each

::exhibit 16 | Ranked by what would actually stop us. Two rows are new

| Challenge | What we do |
|---|---|
| **Review state turns out to be nice-to-have** | Two-week test, three headline versions, kill gate: fewer than 4 of 10 call it useful unprompted |
| **Anthropic ships the review surface.** Plan-as-markdown with comments exists since 2.1.70; the diff-review request is open at 262 reactions | Persistence is what they do not build: across sessions, people and tools. If they build that too, we are a feature, and we should know by week 12 |
| **The MVP-0 exit test cannot be observed.** Under our own architecture we cannot see who "keeps it". Obsidian cannot either | A written measurement decision before week 10. Opt-in, local sidecar counts they can read. Never a vendor usage database |
| **Nobody pays for the team tier** | Run the 20 conversations in weeks 1–2, not at MVP-1. Ask what they are gated on and how many seats they are |
| Zed or Cursor add vault semantics, one sprint | Depth in markdown, and the state they do not keep |
| Distribution | Three cheap channels, resized to real numbers. The private-repo multiplier is unmeasured; ask the ten strangers |
| The 83% refusal is a class, not one bug | Falsified if a patched corpus still refuses more than 10 of 7,969, by day 24 |
| Every AI call bills us | Your own key before any stranger |
| Client work crowds out product | Capped at 78 hours a month, written down |
| GST | Reverse charge has no turnover floor. Registration starts with the first API purchase |

### 11. Ninety days, and the decisions

::exhibit 17 | Something observable every fortnight

| Weeks | What happens | Outcome |
|---|---|---|
| **0** | Rotate the two access tokens. Decide the buyer. Write the web byte-path and the measurement decision | Done, written down |
| **1–2** | Four tests, **build nothing**. 10 developers shown the review mock in both framings (who wrote it, versus changed since you reviewed) and asked which toolchain they use. Plugin shipped. 5 people who bill for documents asked about approval and sign-off, not provenance. 3 landing pages, one per headline. 20 team conversations on seats and gating | Kill signals read at day 14 |
| **3** | Go or no-go | A written decision either way |
| **3–4** | CI with a deliberate red run. NF-3, then NF-1. Prototype content-hash review state on one spec-kit repo and one superpowers repo | CI fails a broken commit. Refusals fall from 83%. The tint works on files we did not write |
| **5–7** | Review state store and rendering. Your own key. Structured output | A stranger's key, a stranger's repo, tinted spans |
| **8–9** | Revert, the review panel, answer in place, engine wired behind every write | The fifteen-second demo from §1 |
| **10–12** | Table stakes. Ten strangers with their own repos and agents | **6 of 10 keep it, by the measure written in week 0** |

::exhibit 18 | The decisions

| # | Decision | By |
|---|---|---|
| 1 | **Accept the change of direction.** Review state is the product, authorship is a detail, answer in place is a feature, the team tier is a hypothesis | **The meeting** |
| 2 | Which buyer first: the developer (reachable, but AI-native products under $50 keep 23% of revenue a year) or the person who is liable when a document is wrong | Week 1 |
| 3 | **Share.** A hosted read-only viewer (our old record's assumption, and a hosting obligation) or permalink plus export (stateless, but nothing for a plain folder or a private repo) | Week 2 |
| 4 | The two unrotated access tokens. An action, not a decision | **Today** |

> [!risk] **What would make me say stop.** Fewer than 4 of 10 developers finding review state useful under either framing, and the 20 team conversations turning up nothing they are gated on that GitHub does not already sell. Then there is no product here, only an engine, a services business and a free plugin people like. Not a failure. A smaller, truer version of the same work, and it pays sooner.

## PART VI — The rest, in one page

### 12. The engine: what exists, what is broken, what needs work

::exhibit 19 | Built, broken, to be optimised

| | |
|---|---|
| **Built** | 25,407 lines, 1,575 tests. 8,513 real files from strangers' vaults, byte-pinned, zero corruption. `git diff` after an edit shows only the edit, tested every release. Six AI routes, a five-provider chain, idea mode |
| **Broken** | **NF-1**: a column-zero list item in frontmatter refuses 83% of real vaults. 4 days. **NF-3**: a bare-CR fence adds a second frontmatter block. 3 days. **No CI**, and four gates have reported green while blind. 1 day. **Engine unwired**: one symbol from one of thirteen files reaches product code. 8 days. **Byte budget is an `echo`.** 2 days |
| **Optimise** | **Incremental parsing**, a vendored `@lezer/markdown`, so review spans survive every keystroke cheaply. **The offset map**, bytes to UTF-16, our riskiest seam; crossing it unmapped corrupts Chinese, Japanese, Korean and Arabic text silently. **Search**: today the whole vault ships to the client, 77 MB parsed per cold start; move to server full-text, client only for the open file. **Refusal and conflict rates** published, with budgets |
| **What we publish** | Time to first keystroke, cold. Typing latency on a 10,000-word document. Corpus refusal rate (83% to near zero). Merge conflict rate |

### 13. What we render, and the markdown rules

::exhibit 20 | Custom rendering, and what we never do to a file

| | |
|---|---|
| **Modes** | Live, Edit, Split, Read. Nested constructs inside list items render properly: the 501-like bug, shipped as the free plugin first |
| **We render** | Callouts `> [!kind]`. Mermaid, rendered, not extended. **MADR and Nygard** decision records. **RFC 7322.** **Keep a Changelog 1.1.0.** Frontmatter as a properties panel |
| **We do not pretend** | Runbooks and PRDs have no standard body. We offer a structure and say so. Every "PRD standard" claim out there is unsourced |
| **The rule** | We add nothing to markdown that breaks it somewhere else. A file we touch still renders on GitHub, in Obsidian, in a plain editor, next year |
| **How** | Prose annotations as callouts, which have no closing marker to lose; an unclosed fence swallows the rest of the document. Tags and links written back in the shape the file already uses, never converted. Wikilinks and normal links both read. Review state and comments in a plain-text sidecar next to the file, readable without us |
| **What we join** | Read `AGENTS.md` and `CLAUDE.md`, never compete with them. Be an MCP server the user's agent connects to. We are a git client, never our own versioning. Obsidian conventions preserved |

### 14. Where we stand

::exhibit 21 | Strengths, weaknesses, opportunities, threats

| | |
|---|---|
| **Strengths** | The engine is real and correct where the incumbents admit they are not. 88.6% of a shipping editor exists. Six AI routes live. Two founders funded by services, not a clock |
| **Weaknesses** | Zero users, zero interviews. No CI, no BYO key, no structured output. 83% of vaults refused today. Every channel is borrowed. No evidence yet for the paid tier. Three published numbers failed a second check |
| **Opportunities** | Tens of thousands of active projects generating specs with nowhere to review them. Review state is the one thing no incumbent persists. A 501-like bug we can fix in a week. A hide-all-AI switch the incumbents shipped only after backlash |
| **Threats** | **Anthropic ships persistent review.** Plan-as-markdown exists since 2.1.70 and diff review is open at 262 reactions. Zed or Cursor add vault semantics in a sprint. Obsidian ships first-party AI editing. We run out of attention before revenue |

### 15. Operating rules

::exhibit 22 | The lines we hold

| | |
|---|---|
| **D2C and B2B** | Free to build the audience, paid to build revenue. **No enterprise feature until a customer refuses to pay without it.** SSO at about 20 seats when asked, SOC 2 above about 50 or for a regulated buyer, a merchant of record for EU and US procurement |
| **How users hear from us** | We collect an email only when there is a reason to: a payment, an invite, a recovery request. Never at first run. Breaking changes get two weeks' notice in the product. Price changes are emailed before the next charge. Every notice also lives in a quiet in-product list, so "we told you" is something they can check |
| **How they reach us** | One address, a published response window, and the free tier has no service commitment, said plainly on the page |
| **What we refuse to measure** | Session replay, keystroke telemetry, document content. The DOM would be their private document. Usage counts live in a local sidecar they can read |
| **Mobile** | About 15% of complaints are mobile. Not in v1. When it comes, a reader and reviewer, never a byte-exact editor on a phone keyboard |
| **Accessibility, non-English** | WCAG 2.2 AA, all or nothing. Our `body-faint` token fails at 1.984:1 and gets fixed in MVP-0. The tint is never colour alone; the panel and the keyboard carry the same information. CJK: the byte map, a bigram search tokeniser, and a written decision on v1 scope |
| **Security** | No plugins, no code execution: the biggest single protection we have. The AI never gets ambient repo access. A malformed repo is refused, not repaired. Reverse charge under CGST §24(iii) has no turnover floor |

### 16. What I think

- The engine is the best thing either of us has built. Two rounds of checking did not touch it.
- We were wrong about the pitch three times: bytes, then authorship, then a generator. Each time the evidence was public and we had not opened it. What survives is narrower. A state nobody keeps, on files everyone now generates, in a place nobody owns. It is a product only if ten strangers say so in two weeks.
- The open question is not distribution any more. It is whether anyone pays. We have a free product with a channel and no evidence for the paid tier. The twenty conversations settle it, in week one.
