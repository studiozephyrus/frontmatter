# frontmatter
## The pilot plan — what we build first, what we cut, and how we sell it

> Amit — the plan for the meeting. Re-checked 2026-09-06 against 157 primary sources; 60 corrections, three of them to the previous version's own page one, each marked where it lands.

::keyfigures
≈75–85k — public repos hold superpowers specs and plans; ≈22–30k touched them in the last 30 days
11,072 — public repos hold a spec-kit constitution; ≈1,660 touched their specs in 30 days
0 — of the tools that write those files is an editor
6 — AI routes already live in our repo, wired to a five-provider fallback chain
97 / 53 / 7 — findings confirmed / revised / refuted in the round that produced this page
::

## PART I — The decision

### 1. What we build

> [!good] **frontmatter is the editor where you see what the agent changed that you did not ask for, and know what nobody has reviewed yet.** Open a spec the agent wrote. Every span changed since a person last reviewed it is tinted; one key reverts any of it; who wrote it and the prompt appear whenever the write carried them. Nothing else in the file moves.

**Three corrections to the last version's page one.**

- **"Who wrote it" shipped three years ago and did not sell.** iA Writer 7 has dimmed AI-pasted text since 2023-11-30. The Obsidian request to copy it got 65 likes and went quiet within a month; the port has 208 downloads; the best of twelve VS Code extensions has 366 installs; Reddit holds one ask in 107 matched posts, at 2 points.
- **What people upvote is changes they did not ask for and output they cannot review.** Claude Code's diff-review request: 262 reactions; "diff" in 463 of 89,761 issue titles. Requests to *remove* AI authorship marks from commits: 29 and 36. Review what changed. Do not tint who wrote it.
- **"Answer in place" is a small spec-kit feature.** The 62,976 figure was a template artifact: 49,408 of those files are spec-kit's own checklist line *"No [NEEDS CLARIFICATION] markers remain"*. Live markers: ≈1,500 public files, 2.7% of committed specs. superpowers has none. `/speckit.clarify` resolves most in chat.

**Why the surface is still ours.** Claude Code opens plans as markdown with inline comments (since 2.1.70), VS Code previews range feedback, git-ai records line attribution after the fact, Anthropic's models now carry signed provenance metadata in the EU. Each records a moment. None keeps the state: which spans a person has read, persisting across sessions, teammates and whatever tool wrote the file. That state is a byte-range record beside the file in the user's repo, and keeping it valid while the file changes is what our engine does.

**The fifteen-second demo.** Run your agent's spec command. Open the spec here: every paragraph tinted, because nobody has read it. Read one; it clears. Revert one; `git diff` shows only that. The panel lists what is still unread — today, next week, or when Amit opens it.

## PART II — The market, in one page

### 2. Who already does what, and where it stops

::exhibit 1 | Fetched 2026-09-06, denominators attached

| | Tool | Real reach | What it does | Where it stops |
|---|---|---|---|---|
| **Spec writers** | **obra/superpowers** | **≈75–85k public repos** with `docs/superpowers/specs` or `/plans`; ≈22–30k active in 30 days; marketplace counter shows 1,009,371 (cached, definition unknown) | Brainstorm → design → writes the spec, commits it, review gate | Terminal. Not an editor. No review state |
| | **github/spec-kit** | **11,072 public repos** with a committed constitution (82% real, not template); ≈1,660 active in 30 days | `/speckit.specify` · `/speckit.clarify` (chat-first) · plan · tasks · implement | Writes markdown, then leaves |
| | Plan mode — Claude Code, Cursor | Out-scores both named tools on Reddit (1,776 / 1,409 / 1,329 points vs ≤38); Cursor's markdown plan editor praised at 167 | Plans as markdown files | Where those files live on disk is untested |
| **Review surfaces** | **Claude Code (VS Code)** | 24.89M installs | **Plans as a full markdown document with inline comments since 2.1.70 (2026-03-06)** — it erased the third-party plan-review market (222 installs across three tools) | A moment, per session. Diff-review UI still open at 262 reactions |
| | git-ai · VS Code 1.118 | 61,517 installs · default AI co-author trailers | Line-level attribution after the fact; commit trailers | Commit granularity. Nothing persists per span |
| | SpecKit Companion | 9,367 installs | Keeps review state in `.spec-context.json` per spec — **our sidecar pattern, already shipped** | Spec-kit only |
| **Editors** | **Obsidian** | Free · Sync $4 · Publish $8/site · Commercial $50/yr | AI arrives as plugins: Copilot 1.83M downloads (*"run Claude Code, Codex and OpenCode inside your vault"*), Claudian 2.02M | None records what changed or what was reviewed |
| | Cursor · Zed | ~$20 · free | Strongest agent editing for code; Zed reviews per hunk | Whole-file rewrite; no markdown vault semantics |
| **Browser** | Obsidian Web Clipper · Markdown Viewer | **1,000,000 · 500,000** Chrome users | Capture and read markdown in the browser | A channel |

**The price column, corrected.** The editor is worth ₹0. The one proven individual price is sync, ~$4. The last version called Obsidian's $50/year commercial licence a second proven price; it *"does not provide any functional benefits within the app"*, became optional on 2025-02-20, and its buyers are 25+ seat organisations. It says nothing about a five-person team.

### 3. What was jargon in the original plan, and what survives

::exhibit 2 | The audit of our own vocabulary, re-run

| It said | What it actually was | Verdict |
|---|---|---|
| "Context packs", "handover generation" | Free from GitHub and Anthropic now; median-2 launches were the platform baseline anyway | **Cut** |
| "Decision-flow renders" | A note-taker's plugin at 0.30× the median, wrong buyer | **Cut** |
| "Kickoff prompt", "our CDN files" | A copy-paste step worse than a slash command; a hop that breaks *we never hold your documents* | **Cut** |
| "Self-improving AIOS" | One feedback label from 6,884 decisions | **Internal only** |
| "Local LLM fallback" | Five *cloud* free tiers. A constrained small model fabricates rather than refuses (100% in 10 of 13 models) | **Defer** |
| "Byte-exactness" as the headline | 4 complaints in 12,556 | **Mechanism, never the pitch** |
| **"See what the AI wrote"** — authorship | **Shipped by iA Writer in 2023. 208 downloads for the port, 366 for the best of twelve extensions, one Reddit ask** | **Cut as the headline. Keep author when a write supplies it** |
| **"496,000 stars" as the channel** | Stars are attention to a CLI. Real: low tens of thousands of monthly-active public projects | **Resized, above** |
| "Uncopyable by anything that rewrites files" | False at commit granularity — trailers and git-ai do it after the fact | **Struck** |
| **What changed since you reviewed, kept as a state** | The upvoted pain. Nobody persists it | **The product — if the two-week test passes** |
| Answer in place | ≈1,500 public files, spec-kit only | **A feature** |
| File-scoped AI | Table stakes. Two verbs have demand (§4) | **Keep, bring-your-own-key, collapsed** |

## PART III — What we ship

### 4. Keep, cut, defer

::exhibit 3 | Every proposed component, decided — nine changed since the last version

| # | Proposed | Verdict | Why |
|---|---|---|---|
| 1 | The markdown editor — Live · Edit · Split · Read | **KEEP** | The free tier. Zed launched with zero AI words; Obsidian's first build had none |
| 2 | The design system | **KEEP** | Replace the sibling project's `globals.css` |
| 3 | **Review state** — tint since last reviewed, revert, the panel | **KEEP — the product** | The only thing in Exhibit 1 nobody persists |
| 4 | **Author and prompt on hover** | **RESHAPE** | Shown when a write carried them: an MCP write, a commit trailer, a git-ai note, signed metadata. **At MVP-0 a file the agent wrote with its own tools has no prompt to show** — the state is "changed since you reviewed", and the demo must say so |
| 5 | Answer `[NEEDS CLARIFICATION]` in place | **KEEP as a feature** | ≈1,500 live public files. Cheap, spec-kit only |
| 6 | The AI writing section, on load | **RESHAPE — collapsed by default, no model call on load, a "hide all AI" switch on day one** | No incumbent opens a panel at rest; Zed, VS Code and Telegram each shipped a global hide switch after 412-, 30- and 181-reaction issues. Our own record already refused ambient AI; the sketch was a regression |
| 7 | AI verbs in the panel | **RESHAPE to two** | Editor communities request AI at 0.13% of feature titles. Usage data: editing or critiquing text you supplied is 10.6% of all ChatGPT messages and Notion's #1 and #3. Ship **"Fix / critique this selection"**; **"Summarise this file"** provisionally. No translate, tag, outline, explain |
| 8 | Comments — drawn in the rail | **RESHAPE → repo sidecar, v1.5** | Every in-file syntax fails on GitHub: `%%` and CriticMarkup print verbatim, `> [!comment]` renders as a plain quote, HTML comments hide but put reviewer bytes inside the artifact. Anchor by byte range + content hash, relocated by the splice locator |
| 9 | Bookmarks — drawn in the rail | **CUT** | Per-user, per-device state with no measured demand |
| 10 | Share — drawn in the rail | **OPEN** | "Permalink + export" needs no state, but a plain folder has no commit and a private repo has no readable link — and our own record's distribution arithmetic assumed a hosted viewer. Decision #3 |
| 11 | Generate a site or deck | **MOVE to MVP-2 as Export** | Marp is 5.9% of the top markdown extension's installs; decks are 0.7% of Obsidian downloads; sites-from-a-folder are wanted *hosted*, which we refuse. Export (HTML, PDF, copy-as-HTML) leads decks 2:1 |
| 12 | Team tier: who-reviewed-what at $8 | **RESHAPE** | **GitHub Team sells required reviewers and CODEOWNERS on private repos at $4.** What small teams are gated on elsewhere: seats, history retention, shared-vault sync. Reprice §8 |
| 13 | Generate all files · kickoff prompt · CDN · local model | **CUT / DEFER** | Unchanged from the last version |

### 5. The three tiers

::exhibit 4 | MVP-0 pilot · MVP-1 pro · MVP-2 max

| | **MVP-0 · Pilot** — 10 weeks, free forever | **MVP-1 · Pro** — teams | **MVP-2 · Max** |
|---|---|---|---|
| **Engine** | NF-1 + NF-3 fixed · CI with one deliberate red run · engine wired behind every write · real byte budget | Vault-wide refactor with a reviewable diff, ambiguity refused | **Sync, provably safe** — git merge, never a CRDT |
| **Editor** | Four modes · tree with the unreviewed bar · tabs · quick-switch · palette · search · properties · tags | Conflict view | Multi-device |
| **Review state** | Span-level "changed since reviewed" by content hash, in a sidecar in *their* repo · tint · **one-key revert** · review panel · author when a trailer, note or MCP write supplies it | **Shared review state across a repo** — what each person has read · comments as a sidecar (v1.5) | Version-history retention |
| **Answer in place** | `[NEEDS CLARIFICATION]` markers, inline | — | — |
| **AI** | Collapsed panel, **bring-your-own-key only**, two verbs · **hide-all switch** · idea mode as it ships · structured output in the port | **MCP server** so the agent's writes carry the prompt · hosted AI metered, hard-capped, never default | Document gates in CI |
| **Output** | — | — | Single-document Export: HTML · PDF · copy-as-HTML. Decks if a pilot user asks |
| **Channels** | **Free Obsidian plugin, week 2** — kill signal under 200 installs in 14 days | Chrome extension: open any `.md` URL here | — |
| **Absent, on purpose** | Sign-up · billing · sync · mobile · hosting · hosted AI · local model · generation | Mobile · plugins · a chat sidebar | Plugins, still |
| **Exit criterion** | **6 of 10 strangers keep it after two weeks — observed, not felt (§10)** | A team pays within 20 qualified conversations | Sync passes the corpus byte-identical |

**Before any stranger touches it, three things that do not exist today must:** bring-your-own-key (settings expose one boolean; every request bills us), structured output in the LLM port (it returns a bare string), and CI (four gates have reported green while blind). **And one decision the round exposed:** the byte path for the web trial — whether "connect a repo" fetches document bytes client-side with the user's token or through our server. Nobody has written it down, and "zero document bytes in our control plane" depends on the answer.

### 6. How it is built — the plugin question, answered

The cheapest shape is the one where **we run no model, hold no document, and sit inside the tools the user already pays for.**

::exhibit 5 | The delivery surfaces

| Surface | Role | Cost to us | When |
|---|---|---|---|
| **Web app** | The trial. Visit a URL, connect a repo. **Byte path to be decided (§5)** | ~$0 | MVP-0 |
| **Desktop (Tauri)** | The daily surface. Local folders; offline everything but language AI. Same build as the web app | $99/yr Apple; Windows signing $150–400/yr with a hardware token | MVP-0 |
| **Review state from content hashes** | Works for files written by *any* tool — the toolchains write with the agent's own tools, not ours | ~$0 | MVP-0 |
| **Their agent, via MCP** | The write carries the prompt. **An assumption:** agents own Write/Edit and the toolchains instruct direct writes; whether one routes through us is untested | ~$0 | MVP-1 |
| **Bring-your-own-key panel** | Their key, their machine → provider. Never through us | ~$0 | MVP-0 |
| **Obsidian plugin** | Distribution only | 4 days | Week 2 |
| **Chrome extension** | Distribution. 1.5M people already read markdown in the browser | ~1 week | MVP-1 |
| **Vendor CDN · hosting** | — | — | **Never** |

**So, "do we ask them to install a plugin":** no. The plugin is a channel. The product is the web app and the desktop build; the AI is theirs.

**The rules that keep it cheap and honest:** documents never enter our control plane · nothing runs in the background, so spend follows use · **cap output, not input** — output is 75.8% of spend · the byte↔UTF-16 seam is the highest-risk thing we own · review state and comments anchor to **bytes plus a content hash and are relocated by the splice locator, never by our journal** — git, other editors and agents bypass the journal, and the shipped competitor's `.spec-context.json` is the pattern we must be visibly better than.

## PART IV — The screens

### 7. As they will actually look

Built from the two hand-drawn layouts, with real content. **Clickable prototype:** [claude.ai/code/artifact/f6baec30-9d0f-4e4f-a231-50f178f0e65e](https://claude.ai/code/artifact/f6baec30-9d0f-4e4f-a231-50f178f0e65e) — also in the repo at `docs/prototype/frontmatter-prototype.html`.

::exhibit 6 | S0 · The launcher — blank, four templates, existing edits sorted unreviewed-first

![S0 launcher](screens/s0-launcher.png)

**The bar on every card is the product showing itself before anything is open.** Templates are markdown skeletons: spec, decision record, handover, changelog.

::exhibit 7 | S2 · The editor — tree, coloured tabs, four modes, the review tint, and the AI panel collapsed

![S2 editor](screens/s2-editor.png)

Changed-since-reviewed text carries a light tint and nothing else. Click a span: **when it changed, which bytes, the author from the commit trailer — and, honestly, "prompt not recorded" for a file the agent wrote outside frontmatter.** The AI panel is a collapsed line: nothing runs until you ask, ⌘J opens it, Settings hides it entirely.

::exhibit 8 | S3 · Answer in place — a spec-kit feature, kept because it is cheap

![S3 answer in place](screens/s3-clarify.png)

::exhibit 9 | S4 · The review panel — catching up on a file you did not watch being written

![S4 review](screens/s4-review.png)

Every changed span in order, `j k` to move, `a r s` to accept, revert or skip, a counter that reaches zero. **This is the state nobody else keeps.**

::exhibit 10 | S2 · Split — source and rendered, the same bytes

![S2 split](screens/s2-split.png)

::exhibit 11 | S11 · Settings — the hide-all-AI switch, and the key field that does not exist yet

![S11 settings](screens/s11-settings.png)

::exhibit 12 | S8 · Refactor preview (MVP-1) — the engine made visible

![S8 refactor](screens/s8-refactor.png)

::exhibit 13 | S12 · Export (MVP-2) — a site or page from the folder, never hosted by us

![S12 generate](screens/s12-generate.png)

## PART V — Money, market, and the plan

### 8. Price, with the churn arithmetic attached

::exhibit 14 | What we charge, corrected against what teams are gated on

| Tier | Price | What it is |
|---|---|---|
| **Individual** | **Free, forever, no limits** | The editor, review state, revert, answer-in-place, BYO key. This is the distribution |
| **Pro · Team** | **$4–5/user/month** — priced against GitHub Team $4, Obsidian Sync $4, HackMD $5, Confluence $6.70 | **Shared-vault sync, version-history retention, shared review state, comments, MCP.** Not "who reviewed what" — GitHub sells that at $4 |
| **Max** | Later, per team | Document gates in CI, retention beyond a year, admin |
| Hosted AI | Metered, at cost plus a margin | Optional, never the default |

**The arithmetic.** Monthly nut ~₹1.09L, covered by 54–78 consulting hours. Infrastructure ~$0 at 100 users, ~$390/month at 10,000; support is the real cost, ~90 founder-hours a month at scale. **"114 seats at $8" is withdrawn:** the feature it priced is GitHub's at $4, and accounts under $50 a month sit in the worst-retaining band there is — top-quartile annual gross retention 60–70% across 2,100 businesses, 23% for AI-native products. Holding 114 seats means replacing 34–46 a year at best. Nobody comparable publishes retention; Obsidian says on record *"we don't know what suddenly causes someone to churn."* **The tier is a hypothesis until the 20 conversations in §11 return seat counts and what teams are gated on.**

> [!test] **Give away what the category has proven is free. Charge for what small teams are gated on elsewhere — seats, history, sync — and never for a feature GitHub bundles.** Downgrading loses features, never files.

### 9. What grabs users, and how we reach them

**The message is now three arms, tested in weeks 1–2, not one line chosen by us:** *See what the AI wrote* · **See what the agent changed that you did not ask for** · **Know what nobody has reviewed yet.** Reddit's top twenty "AI wrote" posts contain zero provenance asks; the upvoted pain is the second and third. The proof line under any of them: *`git diff` after an edit shows your change and nothing else. Tested on 8,513 real files, every release.*

**Lead with the refusals** — this audience is sceptical of AI tooling: no plugins, no code execution, no holding your files, no lock-in, **and a switch that hides every AI feature**, which the incumbents each shipped only after a backlash. Never *revolutionary*, *seamless*, *AI-native*, or *byte-preserving* in a headline.

::exhibit 15 | Channels, resized to real usage, in the order we use them

| When | Channel | Size, measured | What we do |
|---|---|---|---|
| **Week 2** | **Free Obsidian plugin** — the live-preview fix | 501 likes, 117 posts, still open since 2022. Counter-evidence: Obsidian patches live preview monthly; the nearest plugin-level render fix has 1,454 downloads | Ship it; **kill signal under 200 installs in 14 days** |
| Week 2 → | **superpowers first, spec-kit second, plan-mode files third** | ≈22–30k · ≈1,660 active public projects a month · plan-mode size untested | A README line, an MCP entry, "open the spec here" in their docs. Maintainer PRs are outbound acts — we ask before sending |
| Now → | Our own writing | — | The research behind this document. Nobody has published it |
| MVP-0 exit | Show HN | Zed's scored 43, Cursor's 9 | After 6 of 10 strangers keep it. One shot |
| MVP-1 | Chrome extension · Product Hunt | 1.5M browser readers | Backlinks and a spike |
| MVP-2 | Exported pages with an honest mark | **Not a channel until a deploy count exists** | Withdrawn from "always" |

**How we use the users we get.** The ten pilot strangers are the interviews we have never done. Every accept and revert is a preference signal — logged **only** in a local sidecar they can read, because the same architecture that keeps their documents out of our hands keeps their usage out too (§10). The plugin's installers are the list we do not have.

### 10. Challenges, and what we do about each

::exhibit 16 | Ranked by what would stop us — two rows new this round

| Challenge | What we do |
|---|---|
| **Review state turns out to be a nice-to-have** | Two-week test, three headline arms, kill gate: fewer than 4 of 10 call it useful unprompted |
| **Anthropic ships the review surface** — plan-as-markdown with comments already exists since 2.1.70; the diff-review UI request is open at 262 reactions | Persistence is what they do not build: across sessions, across people, across tools. If they build that too, we are a feature, and we should know by week 12 |
| **The MVP-0 exit gate is unobservable** — under our own architecture we cannot see who "keeps it", and Obsidian cannot either | A written measurement decision before week 10: opt-in, local sidecar counts they can read; never a vendor usage database |
| **Nobody pays for the team tier** | Run the 20 conversations in weeks 1–2, not at MVP-1. Ask what they are gated on, and how many seats they are |
| Zed or Cursor add markdown vault semantics — one sprint | Depth in markdown, and the state they do not keep |
| Distribution | Three cheap channels, resized to real numbers. The private-repo multiplier is unmeasured — ask the ten strangers |
| The 83% refusal is a class, not a bug | Falsified if a patched corpus still refuses over 10 of 7,969, by day 24 |
| Every AI call bills us | BYO key before any stranger |
| Client work crowds out product | Capped at 78 hours a month, written down |
| GST | Reverse charge has no turnover floor |

### 11. Ninety days, and the decisions

::exhibit 17 | An observable outcome every fortnight

| Weeks | What happens | Outcome |
|---|---|---|
| **0** | Rotate the two access tokens · decide the buyer · **write the web byte-path and the measurement decision** | Done, written down |
| **1–2** | Four tests, **build nothing**: 10 developers shown the review mock **with both framings** (who-wrote-it vs changed-since-reviewed) and asked which toolchain they use · plugin shipped · 5 people who bill for documents asked about **approval and sign-off**, not provenance · **3 landing pages, one per headline arm** · **20 team conversations on seats and gating** | Kill signals at day 14 |
| **3** | Go / no-go | A written decision either way |
| **3–4** | CI with a deliberate red run · NF-3, then NF-1 · **prototype content-hash review state on one spec-kit and one superpowers repo** | CI fails a broken commit. Refusals fall from 83%. The tint works on files we did not write |
| **5–7** | Review state store and rendering · BYO key · structured output | A stranger's key, a stranger's repo, tinted spans |
| **8–9** | Revert · review panel · answer-in-place · engine wired behind every write | The fifteen-second demo, as written in §1 |
| **10–12** | Table stakes · ten strangers, their own repos and agents | **6 of 10 keep it, by the measure written in week 0** |

::exhibit 18 | The decisions

| # | Decision | By |
|---|---|---|
| 1 | **Accept the reshape** — review state as the product, authorship as a detail, answer-in-place as a feature, the team tier as a hypothesis | **The meeting** |
| 2 | Which buyer first — the developer (reachable; AI-native products under $50 retain 23% of revenue a year) or the person liable when a document is wrong | Week 1 |
| 3 | **Share** — a hosted read-only viewer (our old record's assumption, and a hosting obligation) or permalink-plus-export (stateless, but nothing for a plain folder or a private repo) | Week 2 |
| 4 | The two unrotated access tokens — an action, not a decision | **Today** |

> [!risk] **What would make me say stop.** Fewer than 4 of 10 developers calling review state useful under either framing, and the 20 team conversations returning nothing they are gated on that GitHub does not already sell. Then there is no product here — only an engine, a services business, and a free plugin people like. That is not a failure; it is a smaller, truer version of the same work, and it pays sooner.

### 12. What I think

- **The engine is the best thing either of us has built.** Two verification rounds did not touch it.
- **We were wrong about the pitch three times** — bytes, then authorship, then a generator — and each time the evidence was public and unopened. What survives is narrower: a state nobody keeps, on files everyone now generates, in a surface nobody owns. It is a product only if ten strangers say so in two weeks.
- **The open question is no longer distribution. It is whether anyone pays.** A free product with a channel and no evidence for the paid tier. The twenty conversations settle it, in week one.
