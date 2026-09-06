# frontmatter
## The pilot plan — what we build first, what we cut, and how we sell it

> Amit — the plan for the meeting. One decision on the first page, the market in one table, every component with a verdict, three tiers, the screens as they will actually look, the price, the channels, and ninety days. Nothing is said twice. Every number was fetched from a primary source this week, and the ones that failed a second check were removed.

::keyfigures
496,000 — stars on the free tools that already generate specs and plans from an idea
0 — of them is an editor. That is the product
6 — AI routes already live in our repo, wired to a five-provider fallback chain
83% — of real vaults refused today by one bug. Four days to fix
114 — paying seats at $8 covers the whole monthly nut
::

## PART I — The decision

### 1. What we build

> [!good] **frontmatter is the editor where your agent's specs and decisions get read, reviewed, and finished.** Open a spec the agent wrote. Everything it wrote is visibly marked until a person has read it; one key reverts any of it; and the questions it left open — `[NEEDS CLARIFICATION: auth method — email, SSO, OAuth?]` — are answered **in place**, one byte range replaced, nothing else in the file moved.

**One honest caveat, found while checking this page.** spec-kit's own `/speckit.clarify` is chat-first: it asks the questions in the agent, one at a time, and writes the answers back itself. So answering is not the front door — **reviewing is.** What makes answer-in-place real anyway: **62,976 public files under `specs/` paths carry an unanswered `NEEDS CLARIFICATION` today** (GitHub code search; the phrase is generic and template copies inflate it, so treat it as an upper bound). Questions survive into committed files. Someone has to find and close them, and nothing currently shows where they are.

The proposed pilot was: idea → decisions → generate every file → kickoff prompt → your agent executes. **That flow already ships, free, from GitHub and three others (§2).** What none of them has is a surface: they write markdown and hand it to whatever editor you happen to use, and that editor has no idea an agent wrote it. So we are not the generator. We are where the generated thing lives.

**Why this is the first framing that is actually ours.** Answering a question inside a file without disturbing the rest of it is a byte-range splice — the one thing our engine does and a whole-file rewriter cannot. It aims at slop, the fastest-growing complaint in the market (23.7%, +149% in 20 months) and the only one nobody is working on. And it turns half a million stars of free tooling from a competitor into a channel, which matters because every other channel we have is borrowed.

**The fifteen-second demo.** Run `/speckit.specify` in your agent. Open the spec it wrote, here: every paragraph is tinted, because nobody has read it yet. Hover one — who wrote it, when, the prompt. Revert one with a key; `git diff` shows only that. Then the panel on the right lists the two questions the agent left open; answer one inline, and `git diff` shows one line.

## PART II — The market, in one page

### 2. What exists, what it costs, and where it stops

::exhibit 1 | Who already does what, fetched 2026-09-06

| | Tool | Reach · price | What it does | Where it stops |
|---|---|---|---|---|
| **Generators** | **obra/superpowers** | **282,242 stars** — #13 on all of GitHub · free | Brainstorm → design → writes the spec to `docs/…/specs/`, commits it, review gate | Terminal. Not an editor |
| | **github/spec-kit** | **133,660 stars** — only 73 repos have more · free | `/speckit.specify` · **`/speckit.clarify`** · `/speckit.plan` · `/speckit.tasks` · `/speckit.implement` · a go/kill *assess* extension | Writes markdown, then leaves. No provenance |
| | Kiro (AWS) | GA · $0 tier | `requirements.md` · `design.md` · `tasks.md`, with ambiguity detection | Its own IDE, code-first |
| | BMAD · task-master | 52,719 · 28,053 · free | Planning and task breakdown inside the agent | Same |
| **Editors** | **Obsidian** | Editor **free** · Sync **$4** · Publish **$8/site** · $50/user/yr commercial | The category leader | No AI editing worth the name |
| | Cursor · Zed | ~$20 · free | The strongest agent editing for code; Zed reviews per hunk | **Whole-file rewrite.** Cursor staff admit destroying CRLF. No markdown vault semantics |
| | Notion | ~$10/user | Teams, databases | Files are not files. Export is named `blocksToMarkdownLossy` |
| **Builders** | Lovable · v0 · bolt | $100M+ ARR published · $25–30/mo | Idea → app, for people **without** an agent | A different buyer entirely. Their ARR does not validate us |
| **Browser** | Obsidian Web Clipper · Markdown Viewer | **1,000,000 · 500,000** Chrome users | Capture and read markdown in the browser | Reading only. A channel, not a competitor |
| **Hosted sites** | mdown.ai | Hosted, aimed at non-engineers | Markdown → live website, on their servers | The host role we refuse |

**What the price column settles.** The editor is worth ₹0 in this category. The two things people have proven they pay for are **sync (~$4)** and a **commercial team licence (~$50/user/year)**. Our buyer already spends $20–40 a month on AI tooling, so we ask for a share of an existing budget, not a new line.

### 3. What was AI jargon in the original plan, and what survives

::exhibit 2 | The audit of our own vocabulary

| It said | What it actually was | Verdict |
|---|---|---|
| "Context packs" and "handover generation" | A category with 89 launches and one hit. And now free from GitHub | **Cut** |
| "Decision-flow renders" | A note-taker's plugin at 0.30× the median. Wrong buyer | **Cut** |
| "Kickoff prompt", "reads our CDN files" | A copy-paste step worse than a slash command; a hop that contradicts *we never hold your documents* | **Cut** |
| "Self-improving AIOS" | 6,884 routing decisions produced one feedback label | **Cut from the pitch. Internal tooling stays internal** |
| "Local LLM fallback" | Five *cloud* free-tier providers, not a local model. And a constrained small model **fabricates rather than refuses** (fields drive fabrication to 100% in 10 of 13 models) | **Defer. Keep the cloud chain for testing** |
| "Byte-exactness" as the headline | 4 complaints in 12,556. Nobody asks for it by name | **Keep as the mechanism, never the pitch** |
| "Degradation certificate", "byte-level time travel", "projection law" | Engineering vocabulary | **Internal only** |
| **Provenance** — see what the machine wrote, undo any of it | Answers slop. Uncopyable by anything that rewrites files | **The product** |
| **Answer in place** | A byte splice into a file 496k stars of tooling already produce | **The pilot's point** |
| **File-scoped AI** | Table stakes — 5 of 6 incumbents ship it | **Keep, bring-your-own-key** |

## PART III — What we ship

### 4. Keep, cut, defer

::exhibit 3 | Every proposed component, decided

| # | Proposed | Verdict | Why |
|---|---|---|---|
| 1 | The markdown editor — Live · Edit · Split · Read | **KEEP** | The free tier. Zed's launch page had zero AI words in 6,851 characters; Obsidian's first build had no AI. Editors ship the editor first |
| 2 | The design system | **KEEP** | Written down already. The shipped `globals.css` is a sibling project's — replace it |
| 3 | Decisions generated from the idea | **RESHAPE** | Demand is real, +40% year on year — and `/speckit.clarify`, Kiro and superpowers ship it free. **We answer; we do not ask** |
| 4 | Generate every project file | **CUT** | `/speckit.plan` + `/speckit.tasks`, free, inside the agent. Our idea mode (one document from one idea, five kinds) already ships — keep that |
| 5 | Kickoff prompt | **CUT** | The slash commands are the kickoff prompt |
| 6 | Agent reads files from our CDN | **CUT** | Buys nothing (spec-kit writes to the repo, where every agent looks) · Codex ships with network **off** · context7 at 61,691 stars refuses this pattern and ships MCP instead · breaks our one promise |
| 7 | AI scoped to folder / file | **RESHAPE** | Keep, **file-first**. A folder is a pointer, not a content dump — Claude Code itself reduces a directory to "file listings, not contents" |
| 8 | Local model | **DEFER** | See §3. The cloud chain is right for pre-launch |

### 5. The three tiers

::exhibit 4 | MVP-0 pilot · MVP-1 pro · MVP-2 max

| | **MVP-0 · Pilot** — 10 weeks, free forever | **MVP-1 · Pro** — teams, $8/user/mo | **MVP-2 · Max** — +$4/user/mo |
|---|---|---|---|
| **Engine** | NF-1 + NF-3 fixed · CI with one deliberate red run · engine wired behind every write · real byte budget | Vault-wide refactor with a reviewable diff, ambiguity refused | **Sync, provably safe** — git merge, never a CRDT; the #1 loved feature and the one proven price |
| **Editor** | Four modes · tree with the unreviewed bar · tabs · quick-switch · palette · search · properties panel | Conflict view | Multi-device |
| **Provenance** | Store (range, prompt, model, time, in a sidecar in *their* repo) · tinted spans · hover card · **one-key revert** · review panel | **Across a shared repo**: who reviewed what, per person · commercial licence | Team admin, seats, roles |
| **Answer in place** | `[NEEDS CLARIFICATION]` and `Q: → A:` markers answered inline, one line changed | Questions panel across the whole repo | — |
| **AI** | File-scoped panel, **bring-your-own-key only** · idea mode as it ships today · structured output in the port | Hosted AI, metered, hard-capped, never default | Document gates in CI: link integrity, stale sections, unreviewed machine text |
| **Output** | — | Site · page · deck from the folder. **We never host it** | Push to Vercel / GitHub Pages / Netlify, their account |
| **Channels** | **Free Obsidian plugin, week 2** (the 501-like live-preview fix) | **MCP server** so their agent writes into frontmatter directly · Chrome extension that opens any `.md` URL here | — |
| **Deliberately absent** | Sign-up · billing · sync · mobile · hosting · hosted AI · local model | Mobile · plugins · a chat sidebar | Plugins, still. Mobile as a reader only |
| **Exit criterion** | **6 of 10 strangers keep it after two weeks** | A team pays within 20 qualified conversations | Sync passes the corpus byte-identical |

**Before any stranger touches the pilot, three things that do not exist today must:** bring-your-own-key (settings expose one boolean; every request bills us), structured output in the LLM port (it returns a bare string), and CI (four of our gates have reported green while blind).

### 6. How it is built — the plugin question, answered

The most cost-efficient shape is the one where **we run no model, hold no document, and sit inside the tools the user already pays for.**

::exhibit 5 | The delivery surfaces, and what each is for

| Surface | Role | Cost to us | When |
|---|---|---|---|
| **Web app** | The trial. Visit a URL, connect a repo, nothing to install | ~$0 | MVP-0 |
| **Desktop (Tauri)** | The daily surface. Local folders, offline everything except language AI. **Same build as the web app** — one filesystem adapter apart, so we never maintain two products | $99/yr Apple notarisation; Windows signing $150–400/yr with a hardware token | MVP-0 |
| **Their agent, via MCP** | **The AI runs in Claude Code / Cursor / Codex on their subscription.** frontmatter is the surface the agent writes into and the record of what it wrote. Zero inference cost, zero key handling, and the agent they already trust | ~$0 | MVP-1 |
| **Bring-your-own-key panel** | For AI inside the editor. Their key, their provider, their machine → provider. Never through us | ~$0 | MVP-0 |
| **Obsidian plugin** | Distribution only. The live-preview fix in their store, permanently | 4 days | Week 2 |
| **Chrome extension** | Distribution. Open any `.md` on GitHub in frontmatter, provenance shown. 1.5M users already read markdown in the browser | ~1 week | MVP-1 |
| **Our hosted AI** | Optional, metered, hard-capped, never the default | Pass-through | MVP-1 |
| **Vendor CDN · hosting** | — | — | **Never** |

**So the answer to "do we ask them to install a plugin":** no. The plugin is a channel. The product is the web app and the desktop build, and the AI is theirs — through MCP or their own key — which is why the pilot's AI cost is zero and its trust story is "the request never touches us."

**The rules that keep the architecture cheap and honest:** documents never enter our control plane, which holds identity, teams and billing and zero document bytes · nothing runs in the background, so spend follows use rather than time · **cap output, not input** — output is 75.8% of spend · the byte↔UTF-16 seam is the highest-risk thing we own, and anything crossing it without the mapping layer corrupts non-English text silently · provenance is a plain-text sidecar in *their* repo, readable without us.

## PART IV — The screens

### 7. As they will actually look

Built from the two hand-drawn layouts, with real content. **Clickable prototype:** [claude.ai/code/artifact/f6baec30-9d0f-4e4f-a231-50f178f0e65e](https://claude.ai/code/artifact/f6baec30-9d0f-4e4f-a231-50f178f0e65e) — also in the repo at `docs/prototype/frontmatter-prototype.html`. Every screen is reachable from the strip at the bottom.

::exhibit 6 | S0 · The launcher — blank, four templates, existing edits sorted unreviewed-first

![S0 launcher](screens/s0-launcher.png)

**The bar on every card is the product showing itself before anything is open.** Templates are markdown skeletons, not a gallery: spec, decision record, handover, changelog — the four document types the research found actually recur.

::exhibit 7 | S2 · The editor — tree, coloured tabs, four modes, provenance, and the AI section on load

![S2 editor](screens/s2-editor.png)

Machine-written text that nobody has read carries a light tint and nothing else — no border, no icon, so it can be ignored. Click a span for the card: who wrote it, when, which bytes, the prompt, **mark reviewed** or **revert**. The AI section at the bottom is the Google-Docs-style writing panel from the sketch: it shows on load, it proposes marked spans, it writes nothing until you keep it, and it runs on **your** key.

::exhibit 8 | S3 · Answer in place — a spec-kit spec, three questions, one answered

![S3 answer in place](screens/s3-clarify.png)

The moment the pilot exists for. `spec-kit` wrote the file eleven minutes ago; FR-006 is answered, FR-007 is being typed. The status bar reads `git · +1 −1` — one line, nothing else moved.

::exhibit 9 | S4 · The review panel — catching up on a file you did not watch being written

![S4 review](screens/s4-review.png)

Every unreviewed span in order, `j k` to move, `a r s` to accept, revert or skip, and a counter that reaches zero. Provenance is a state, not a moment: these stay marked until a person deals with them.

::exhibit 10 | S2 · Split — source and rendered, the same bytes

![S2 split](screens/s2-split.png)

::exhibit 11 | S11 · Settings — one page, and the key field that does not exist yet

![S11 settings](screens/s11-settings.png)

::exhibit 12 | S8 · Refactor preview (MVP-1) — the engine made visible

![S8 refactor](screens/s8-refactor.png)

Eight files, six change, two are **refused** with the reason — a tag inside a code fence, an ambiguous flow-form key. Nothing moves until you accept.

::exhibit 13 | S12 · Generate (MVP-1) — a site from the folder, never hosted by us

![S12 generate](screens/s12-generate.png)

## PART V — Money, market, and the plan

### 8. Price

::exhibit 14 | What we charge, and what it covers

| Tier | Price | What it is |
|---|---|---|
| **Individual** | **Free, forever, no limits** | The whole editor, provenance, answer-in-place, BYO key. This *is* the distribution strategy |
| **Pro · Team** | **$8/user/month** | Provenance across a shared repo, who-reviewed-what, admin, commercial licence, MCP, generation |
| **Max · Sync** | +$4/user/month | Multi-device sync, provably safe. Document gates in CI |
| Hosted AI | Metered, at cost plus a margin | Optional, never the default |

**The arithmetic:** monthly nut ~₹1.09L for the two of us plus infrastructure, covered by 54–78 consulting hours; infrastructure is ~$0 at 100 users and ~$390/month at 10,000, because we store no documents. **114 paying seats at $8 covers everything** — about twenty small teams. Funded by four fixed-scope engagements a year at ₹3,00,000, not a raise. **The real cost at scale is support, ~90 founder-hours a month at 10,000 users**, which is why the free tier carries no service commitment and we say so.

> [!test] **We give away the differentiator, deliberately.** Provenance free is what makes anyone try it. The paid thing is not the feature — it is the feature *across people*. Downgrading loses features, never files.

### 9. What grabs users, and how we reach them

**The message.** Five words: *See what the AI wrote.* One line: *A markdown editor that shows which parts of your document a machine wrote — and lets you undo any of them.* For a team: *Know what nobody has reviewed yet, across the whole repo.* The proof line: *`git diff` after an edit shows your change and nothing else. Tested on 8,513 real files, every release.*

**Lead with the refusals, not the features** — this audience is sceptical of AI tooling: no plugins, no code execution, no holding your files, no lock-in, and if we disappear you lose nothing because nothing was ever taken. Never say *revolutionary*, *seamless*, *AI-native*, or *byte-preserving* in a headline.

::exhibit 15 | Channels, in the order we use them

| When | Channel | Why it is in this order |
|---|---|---|
| **Week 2** | **Free Obsidian plugin** — the live-preview fix | 501 likes on the bug. The cheapest audience we will ever buy. Installs measurable by day 14 |
| Week 2 → | **The spec-driven toolchain** | spec-kit and superpowers are MIT and agent-agnostic. A README line, an MCP entry, and "open the spec in frontmatter" in their docs turns 496k stars into an input |
| Now → | Our own writing | The research behind this document is the marketing. Nobody has published it |
| MVP-0 exit | Show HN | After 6 of 10 strangers keep it. One shot. Zed's scored 43, Cursor's 9 — launch points are near worthless as a signal |
| MVP-1 | Chrome extension · Product Hunt | The extension reaches 1.5M people who already read markdown in a browser. PH is backlinks and a spike, not a strategy |
| Always | Generated pages with an honest mark | The only fully owned channel. A shared artefact is a feature and a channel at once |

**How we use the users we get.** The ten pilot strangers are the research we have never done — zero user interviews to date. Every accept and revert is a preference signal we log. The plugin's installers are the list we do not have. And every generated page carries a small mark, which is the one loop that compounds without us.

### 10. Challenges, and what we do about each

::exhibit 16 | Ranked by what would actually stop us

| Challenge | What we do |
|---|---|
| **Provenance turns out to be a nice-to-have** | Two-week test before code. Kill gate: fewer than 4 of 10 call it useful unprompted |
| **spec-kit or Kiro ship a review surface** | Go deeper where they cannot follow: signing, export, an audit trail. Our provenance record is designed so it *can* become that without a rewrite |
| **Zed or Cursor add markdown vault semantics — one sprint** | Depth in markdown, not speed. They still cannot do provenance without abandoning whole-file rewriting |
| **Distribution** | The plugin, the toolchain, the extension — three channels that are cheap and two of which we did not have last month |
| **The 83% refusal is a class, not a bug** | Falsified if a patched corpus still refuses over 10 of 7,969, by day 24 |
| **Every AI call bills us** | BYO key before any stranger; MCP so most AI never touches us at all |
| **Client work crowds out product** | Capped at 78 hours a month between us, written down |
| **Two founders, no on-call** | Free tier has no SLA and the page says so. One email address, a published response window |
| **GST** | Reverse charge has no turnover floor — registration starts with the first API purchase |

### 11. Ninety days, and the two decisions

::exhibit 17 | An observable outcome every fortnight

| Weeks | What happens | Outcome |
|---|---|---|
| **0** | Rotate the two access tokens · decide the buyer | Done, written down |
| **1–2** | Four tests, **build nothing**: 10 developers shown a provenance mock · plugin shipped · 5 people who bill for documents asked · 3 landing pages at three prices | Kill signals read at day 14 |
| **3** | Go / no-go | A written decision either way |
| **3–4** | CI with a deliberate red run · NF-3, then NF-1 | CI fails a broken commit. Refusals fall from 83% |
| **5–7** | Provenance store and rendering · BYO key · structured output | A document shows machine spans on a stranger's key |
| **8–9** | Revert · answer-in-place · engine wired behind every write | The fifteen-second demo works end to end |
| **10–12** | Table stakes · ten strangers, their own repos and agents | **6 of 10 keep it** |

::exhibit 18 | The decisions

| # | Decision | By |
|---|---|---|
| 1 | **Accept the reshape** — the editor *for* spec-driven work, not the generator *of* it. Everything above follows from this | **The meeting** |
| 2 | Which buyer first — the AI-native developer (reachable, pays little) or the person liable when a document is wrong (pays properly, hard to reach). My recommendation: the developer, with the provenance record built so it can become the liable buyer's audit trail later | Week 1 |
| 3 | The two unrotated access tokens — an action, not a decision | **Today** |

> [!risk] **What would make me say stop.** Fewer than 4 of 10 developers calling provenance useful, and nobody who bills for documents having ever been asked for it. Then there is no product here — only an engine, a services business, and a free plugin people like. That is not a failure; it is a smaller, truer version of the same work, and it pays sooner.

### 12. What I think

- **The engine is the best thing either of us has built**, and the funded competitors have admitted the defect it fixes.
- **We were selling it wrong twice** — as a promise about bytes nobody asked for, then as a generator competing with half a million stars of free tooling.
- **The third framing is the first one that is ours.** Everyone can generate a spec; nobody has a good place to read and answer one. Surfaces are sticky.
- **The two weeks of testing matter more than the ten weeks of building.**
- **Distribution is still the thing I am least sure of** — but for the first time we have three cheap channels and one we would own.
