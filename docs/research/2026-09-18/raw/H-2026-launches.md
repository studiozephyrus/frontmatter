# Lens H: what shipped in 2026, and what the adjacent document products do about agents

Research pass, 18 September 2026. Finding ids are prefixed `FH`.

Scope: the document incumbents and their agent features, the AI-native writing surfaces and what
they do about files on disk, markdown launches in 2026, the memory layer, anyone claiming our
position, and the funding and shutdown record for 2026.

Every finding carries the URL and the date it was opened. `INFERENCE:` marks my reading rather
than the page's claim. `UNVERIFIED:` marks something I could not confirm. British spelling,
plain hyphens only.

Two notes on method, so the file can be audited.

**Quoted strings keep their source punctuation.** My own prose contains no long dashes. Four
quotations do, because the pages I copied them from do, and the brief's rule against inventing or
altering a quote outranks the rule about punctuation. They are at the four `>` block quotes in FH8,
FH9 and FH11, and every one is a verbatim copy.

**Tooling.** `WebFetch` and the browser tool both stopped working partway through this pass. The
session's own `sgnk-taint-gate` refused them after a short phrase about dispatching tokens to a
model appeared inside ordinary prose on a fetched page. It is a substring false positive of the
kind already recorded as Learned Rule 73.
I did not touch the gate. Everything after that point was read with `curl -sL --compressed`, which
is the fallback the brief itself specifies, plus the public Hacker News API for scores and dates.
Two sources were lost to it and are listed at the end.

---

### FH1. Ritemark has taken our exact position, in our exact words, and it is free

- **Demand:** This is not a demand finding. It is the answer to "has somebody already taken our
  position", and the answer is yes. The Ritemark home page headline reads, verbatim: "Markdown
  editor with AI agents." The subheadline reads: "Claude, Codex, and Gemini work alongside you in
  a visual editor. They read your files, edit them, create new ones. You stay in control."
  On files, verbatim: "No upload, no indexing, no copy-paste. The agent works on the same Markdown
  files you do, right where they already live." And the line that is closest to our own projection
  law, verbatim: "Drafts in ~/docs/q2-strategy/ stay in ~/docs/q2-strategy/." The page describes
  itself as "Local-first" and as "Open source & free", and on cost says: "Completely free to
  download and use. No subscription, no account, no hidden fees."
- **Source:** https://ritemark.app/en/ opened 2026-09-18
- **Second source, their own comparison page dated 4 August 2026:** describes Ritemark as a
  "free markdown editor for macOS and Windows with a terminal built into the app", where you
  "Run Claude Code, Codex CLI, or Gemini CLI inside that terminal" and the "agent reads, edits,
  and saves your files in place". Pricing line, verbatim: "Free. AI agents run on their own
  usage-based API pricing."
  https://ritemark.app/en/good-to-know/comparisons/best-markdown-editor-for-ai/ opened 2026-09-18
- **Code:** github.com/jarmo-productory/ritemark-public, plus a second repo
  github.com/ProductoryHQ/ritemark-native described in search results as a "VS Code OSS fork with
  RiteMark built-in markdown editor".
- **Who ships it today:** Ritemark, free, macOS and Windows, open source. No web app and no phone
  named on the pages I opened.
- **What they do NOT have, from their own pages:** no MCP mention anywhere in their comparison
  page. No change queue, no accept or reject of an agent edit, no byte-range splice, no refusal
  behaviour. Their control story is the terminal being visible, not the edit being reviewable.
  No web or mobile surface. No collaboration, no sharing, no publishing.
- **The problem it solves for us:** it tells us the category name is taken and the obvious version
  of it is already free. Our differentiation cannot be "an editor where agents can touch your
  markdown files". It has to be the change queue and the refusal, which is the part they skipped.
- **Fit:** not a feature to steal. It is a positioning constraint. INFERENCE: the headline
  "markdown editor with AI agents" is now a commodity claim and we should stop using it.
- **Effort:** none, this is a messaging decision.
- **Verdict:** must-have, as a repositioning. Their weakness is that a visible terminal is not
  review. Ours is that we are not free. The line that still separates us is: they let the agent
  write, we make you accept it.

### FH2. The top-voted markdown launch of 2026 is an Obsidian and Notion replacement for agents, and the question its own thread could not answer is byte-exactness

- **Demand:** OpenKnowledge, from Inkeep, posted as "Show HN: OpenKnowledge - open source AI-first
  alternative to Obsidian/Notion" on 2026-06-25. **381 points, 173 comments.** That is the highest
  score any markdown editor launch got in 2026 by the sweep below. The comment that matters most to
  us is from user `toozitax`, quoted verbatim and in full:

  > "Nice. the frontmatter question is the one i'd want answered before trusting it: when an agent
  > edits a file does it round-trip YAML frontmatter and nested code fences cleanly, or does that
  > stuff get mangled? every "wysiwyg markdown" tool i've tried falls apart there. Also is the CLI
  > cross-platform or mac-only like the app?"

  The founder's reply, verbatim: "Re:front-matter, we do optimistic parsing of it, haven't seen any
  issues with it. If we detect invalid markdown we return warnings to the agent in the MCP response
  so it knows it needs to fix it."
- **Source:** https://news.ycombinator.com/item?id=48675435 opened 2026-09-18, counts read from
  https://hn.algolia.com/api/v1/items/48675435 on 2026-09-18
- **Who ships it today:** OpenKnowledge, free and open source, Electron, macOS app with a
  cross-platform command line tool. Repo github.com/inkeep/open-knowledge. Inkeep is a Y Combinator
  company. The app auto-installs skills and an MCP server config into Claude, Codex and Cursor.
- **Nobody ships:** a guarantee. "Optimistic parsing" and "haven't seen any issues with it" is the
  honest state of the art. The single highest-value question a stranger asked at the top of the
  category was answered with a hope, not a test.
- **The problem it solves for us:** this is the receipt for the whole product. A person who had
  never heard of us named our differentiator, unprompted, in the first line of his comment, and
  called it "the frontmatter question". The thing we already built, byte-exact round-tripping with
  a corpus of 8,513 pinned files, is the thing the category leader cannot answer.
- **Fit:** it is already the core. What is missing is that we do not *say* it. Nothing in our
  material shows a side-by-side of a YAML block and a nested fence surviving an agent edit.
- **Effort:** small. A public round-trip test page, run against our own corpus, is days.
- **Verdict:** must-have. Not a feature, a proof. Publish the corpus result as a public claim, and
  invite comparison. INFERENCE: "the frontmatter question" is an available marketing phrase and it
  is already our name.

### FH3. People want an atomic changeset across several documents, not per-document versioning

- **Demand:** In the same OpenKnowledge thread, user `abdullin` describes the failure mode, verbatim:

  > "the tricky part there is in scenarios from a few AI Native teams. There often are a multiple
  > agents rolling out linked changesets to a bunch of documents on behalf of controlling humans. Eg
  > updating compliance policy, and references and change log and current procedures at the same
  > time.So changesets have to be atomic across multiple documents and semantic (so that agents can
  > resolve the changes). Weak per-document versioning isn't enough here."

  His stated requirements list, verbatim: "(1) versioned (a la git, not Notion) (2) usable from any
  chat (a la MCP) (3) basic access controls for team setup. (4) works through the interface that
  optimizes accuracy and token use across agentic architectures and LLMs." He then says: "Still
  figuring 1 and 3, though."
- **Source:** https://news.ycombinator.com/item?id=48675435 opened 2026-09-18
- **Who ships it today:** nobody in this thread. Git gives you the atomic commit but not the
  per-change accept or reject. Notion gives you neither.
- **Nobody ships:** a review queue where one agent run across six files is one reviewable unit that
  you accept or reject whole, with the option to open it up and take three of the six.
- **The problem it solves for us:** our change queue is one change at a time. An agent that updates
  a policy, its references, the changelog and the procedure has produced one logical edit in four
  files. Accepting three of four leaves the vault inconsistent, which is worse than rejecting all
  four.
- **Fit:** the queue already exists. This adds a grouping key, a run id, so changes from one agent
  run present as one card that expands. The splice engine is unchanged.
- **Effort:** medium. The data model needs a run identifier and the queue needs a grouped view with
  accept-all, reject-all and partial. A week or two on top of the existing queue.
- **Verdict:** good-to-have, and close to must-have the moment a second person uses it. A queue that
  can only reason about one file is a queue that breaks on the most common agent behaviour.

### FH4. The thing that keeps people on Obsidian is querying across documents, and no rival has it

- **Demand:** user `jfim`, verbatim, in the OpenKnowledge thread:

  > "Obsidian is a lot more than "just markdown" though.For example, with the appropriate plugins
  > like dataview and charts, it's possible to create dashboards, lists, and tables that update
  > automatically based on data elements present in documents or documents themselves. I use it to
  > have views over my to-do lists (daily routine items, tasks that are overdue, upcoming tasks,
  > etc), make dashboards, and show lists of documents edited on a particular date.I'd love to
  > migrate away from Obsidian towards something that's not proprietary, but I haven't seen anything
  > that allows querying other documents."

  The founder conceded it, verbatim: "Yes makes sense, the database site of it is the primary point
  we don't support yet."

  Two other commenters in the same thread said the same in different words. `altmanaltman`: "I have
  been trying to replace Obsidian with something for over 4 years now ever since I started using it.
  But I am just too comfortable now and I have it set up exactly the way I like and extended it with
  plugins etc."
- **Source:** https://news.ycombinator.com/item?id=48675435 opened 2026-09-18
- **Who ships it today:** Obsidian, via the Dataview community plugin, free. Nobody else in the
  thread.
- **Nobody ships:** a query view that an agent can also write into. INFERENCE: this matters more in
  the agent era than it did before, because a query result is a cheap, always-current context file
  for an agent, and today people hand-maintain those.
- **The problem it solves for us:** it is the single named blocker on migration away from Obsidian.
  Our plan has tasks, kanban, calendar, tags and backlinks, which are each a fixed query. A general
  query is the same machinery with the predicate exposed.
- **Fit:** good, and it stays inside the projection law. A query block is a deterministic projection
  of the files, computed at render, never written back unless the user asks for it to be written
  back, at which point it goes through the splice engine like anything else.
- **Effort:** large. An index, a query language, a renderer, and a decision about whether results are
  ever materialised into the file. A month or more.
- **Verdict:** good-to-have, and the highest-value large item in this lens. It is the named reason
  people do not leave Obsidian, which means it is the named reason they will not arrive.

### FH5. Coda no longer exists as a brand. It became Superhuman Docs on 8 July 2026, and it sells per Doc Maker

- **Demand:** not a demand finding, a competitor-list correction. `coda.io/pricing` now returns a
  307 redirect to `superhuman.com/plans/docs?source=coda.io`. The destination page is titled
  "Superhuman Docs | Pricing & Plans". Any competitor slide of ours naming Coda is out of date.
- **Source:** redirect observed 2026-09-18 via WebFetch on https://coda.io/pricing. Page text read
  from https://superhuman.com/plans/docs on 2026-09-18 with a real browser, because the page is
  JavaScript rendered and returns no prices to curl.
- **Prices, verbatim from the page, shown in Indian rupees because the page geolocates:**
  Free "₹ 0". Pro "₹ 983 / month" "per Doc Maker, billed annually", and "₹ 1250 when billed
  monthly". Business "₹ 2700 / month" "per Doc Maker, billed annually", "₹ 3299 when billed
  monthly". Enterprise "Custom".
- **The pricing model is the interesting part:** they bill per "Doc Maker", not per seat. The page
  carries an FAQ entry titled, verbatim, "What is a 'Doc Maker'?" and another, "Who do I pay for and
  why?". INFERENCE: readers are free and writers are paid.
- **Agent claims, verbatim from the plan lists:** Free gets "Try Docs AI - an AI assistant that
  helps you write confidently, build docs, and automate tasks" and "Try MCP". Pro gets "Write, edit,
  and ask with AI" marked "Beta", "Build AI trackers, pages, and views" marked "Beta", and "Create
  with Claude and more via MCP". Business gets "Databases" marked "Beta" and "Sync and take actions
  across docs". The product summary line reads: "Docs - The best place for teams and AI to work
  together". The page also states "Docs AI is available during Beta for Doc Makers." and claims
  "Trusted by 40M+ people and 50K+ organizations".
- **Who ships it today:** Superhuman, the company formerly called Grammarly, which acquired Coda and
  then the Superhuman mail client and took that name.
- **The problem it solves for us:** two things. Our competitor list is stale and must be corrected.
  And the per-writer pricing model is worth copying: it lets a whole team read and comment for free
  while only the people who create pay, which is a much softer sell than per seat.
- **Fit:** the tier configuration panel already exists in the plan, so a writer-versus-reader split
  is a configuration question, not an architecture question.
- **Effort:** small to medium. Counting writers rather than seats is a billing rule.
- **Verdict:** good-to-have. INFERENCE: for a tool whose main use is an agent writing and a person
  reviewing, charging for the reviewer is the wrong end. Charging per writing surface is closer to
  the value.

### FH6. The incumbents have all built search and chat over documents. None of them has built review of a machine edit

- **Demand:** this is the hole finding, drawn from reading the incumbents' own pages on 2026-09-18.
  - **Confluence.** The pricing comparison table lists "Atlassian Rovo" as a row, with, verbatim,
    "25 Rovo credits per user per month / 100 indexed objects per user" on Standard, "70 Rovo
    credits per user per month / 250 indexed objects per user" on Premium and "150 Rovo credits per
    user per month / 625 indexed objects per user" on Enterprise. Free gets no Rovo row.
    https://www.atlassian.com/software/confluence/pricing read 2026-09-18 with a browser.
  - **Dropbox Dash.** The home page headline is, verbatim, "Find answers across your work" and the
    body reads "Dash helps you search for shared team knowledge across all your apps to get clear
    answers and move projects forward, faster." The feature tabs are, verbatim, "Find", "Answer",
    "Organize", "Share". There is no write or edit tab.
    https://dash.dropbox.com/ read 2026-09-18.
  - **Slite.** Pro at "$20 per user/month (billed yearly)" is described, verbatim, as "An
    agent-powered knowledge base that stays in sync with your tools", and includes "The Slite
    Agent", "Doc fact-checking with suggested fixes", "Agent workflows" and "50 monthly credits per
    seat". Basic is "$10 per user/month (billed yearly)".
    https://slite.com/pricing opened 2026-09-18.
  - **Notion.** Free $0, Plus $10, Business $20, Enterprise custom, per seat per month. Business is
    the first tier with "Notion Agent (chat, generate, autofill, translate)". Usage pricing is,
    verbatim, "Free to try, then $10 per 1,000 monthly Notion credits" for Custom Agents, and
    Workers are "Free to try now. Starts using credits on October 15".
    https://www.notion.com/pricing opened 2026-09-18.
  - **Craft.** Prices shown in rupees: Free ₹0, Plus ₹526.7/month monthly or ₹658.3/month yearly,
    Family ₹986.7/month, Team ₹3,792/month. AI is metered as credits, "15 credits" free and
    "50 credits/month" on Plus. The page does not mention markdown or local files at all.
    https://www.craft.do/pricing opened 2026-09-18.
- **Nobody ships:** an accept or reject step on a machine-written change. Every one of the five
  above has shipped retrieval, chat and generation. Not one of them shows you a diff of what the
  model changed and makes you approve it. Confluence and Notion have page version history, which is
  after the fact, not before it. Slite has "suggested fixes", which is the closest, and it is scoped
  to fact-checking rather than to any agent edit.
- **The problem it solves for us:** it confirms the position is empty at the top of the market even
  though it is crowded at the bottom. The free open source tools (FH1, FH2) took "agents can edit
  your markdown". The paid incumbents took "ask your documents a question". Neither took "approve
  what the machine wrote".
- **Fit:** it is already the plan. The change queue is the product.
- **Effort:** already committed.
- **Verdict:** must-have, and it is the only defensible claim left. INFERENCE: the credits pricing
  across Notion, Slite, Confluence and Craft is a second hole. Every one of them meters the AI, so
  the customer is billed for the thing that generates work and not for the thing that reviews it.

### FH7. Google shipped a markdown and YAML frontmatter standard in June 2026, and in July it added the authorship and review fields we dropped

- **Demand:** Google Cloud published the Open Knowledge Format on 2026-06-13. Their description,
  verbatim: "an open specification that formalizes the LLM-wiki pattern into a portable,
  interoperable format. This is a vendor-neutral, agent- and human-friendly standard for
  representing the metadata, context, and curated knowledge that modern AI systems need."
  On the shape, verbatim: OKF v0.1 "represents knowledge as a directory of markdown files with YAML
  frontmatter, with a small set of agreed-upon conventions that let wikis written by different
  producers be consumed by different agents without translation." The three bullets on the page,
  verbatim: "Just markdown - readable in any editor, renderable on GitHub, indexable by any search
  tool"; "Just files - shippable as a tarball, hostable in any git repo, mountable on any
  filesystem"; "Just YAML frontmatter - for the small set of structured fields that need to be
  queryable: type, title, description, resource, tags, and timestamp". And on why agents change the
  economics, verbatim: "LLMs don't get bored, don't forget to update a cross-reference, and can
  touch 15 files in one pass".
- **Source:** https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/
  opened 2026-09-18
- **Then v0.2, published 2026-07-25, added exactly what we cut.** The post frames it as five
  questions, quoted verbatim: "What was this created from? (provenance)", "How much should I trust
  it? (trust)", "Is it still true? (freshness)", "Is it the current version? (lifecycle)", "Was this
  number produced the way we said it must be? (attestation)". The new frontmatter fields, verbatim:
  `generated: { by, at }` for "how the current content was produced, and when it last meaningfully
  changed", and `verified: [ { by, at } ]` for "a list of independent confirmations against the
  sources or the underlying resource", plus `sources`, `stale_after`, `status` which "moves a
  concept through `draft → stable → deprecated`", and `attester` and `executor`. The compatibility
  promise, verbatim: "It adds vocabulary, not rules: `type` is still the only always-required field,
  every new field is opt-in, custom keys are still preserved rather than rejected, and a bundle that
  adopts none of the additions is exactly as valid as it was under v0.1."
- **Source:** https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals
  opened 2026-09-18
- **Spec repo:** https://github.com/GoogleCloudPlatform/open-knowledge-format, described in its own
  README, verbatim, as "a universal, vendor-neutral format for representing knowledge as plain
  markdown files with YAML frontmatter", "not tied to any particular agent, framework, model
  provider, or serving system", "Human- and agent-readable.", "Minimally opinionated, freely
  extensible." README read 2026-09-18 via raw.githubusercontent.com.
- **Who ships it today:** the spec is free. Inkeep's OpenKnowledge says its templates are compliant
  and it ships an OKF quickstart, from the founder's own words in the HN thread, verbatim: "Our
  templates are Open Knowledge Format compliant and we have an explicit quickstart around making an
  OKF knowledge base. You can think of OKF as a format/standard for the content, and OpenKnowledge
  (our app) as an IDE/editor for any type of markdown based content." Third-party tooling has
  appeared: github.com/scaccogatto/okf-skills, a Claude Code plugin, and
  github.com/Sudhakaran88/okf-conformance. There is an open Hugo issue asking for support,
  gohugoio/hugo#15035.
- **Nobody ships:** a validating editor. The OKF README, as fetched, describes a `visualize`
  subcommand but no validator. INFERENCE from that plus the separate third-party conformance repo:
  people are writing conformance checkers by hand because the spec ships without one.
- **The problem it solves for us:** two things, and the second is bigger than the first.
  1. There is now a named, Google-backed target format that is literally our file format, and it has
     required and optional frontmatter keys, a lifecycle field, and a staleness date. An editor that
     validates a bundle live, shows the problems panel against the spec, and refuses to corrupt the
     frontmatter is an obvious product. We already have the problems panel and the formatter in the
     plan.
  2. `generated: { by, at }` and `verified: [ { by, at } ]` are authorship marking and a review
     receipt, standing in a Google specification, three months after we dropped the same idea from
     our own plan on 2026-09-17. The reason we dropped it was that Almanac shipped read receipts and
     died. That reasoning was about a *product feature*. This is a *file field*, which is a different
     thing: it survives in the file, it is portable, and we do not have to invent it or defend it.
- **Fit:** excellent, and unusually cheap, because it is frontmatter, and frontmatter is the part of
  a markdown file we already promise not to mangle. Writing `verified: [{by, at}]` when a human
  accepts a change in the queue is a two-line splice into a YAML block. The change queue becomes the
  thing that produces the trust signal.
- **Effort:** small for frontmatter stamping on accept. Medium for a real OKF validator plus the
  problems panel wiring. Large if we build the whole bundle authoring experience.
- **Verdict:** must-have for the stamping, good-to-have for the validator. This is the single most
  useful thing in this lens. It is a standard, it is in our format, it is backed by Google, it
  rehabilitates the attribution idea we cut, and nobody has built the editor for it.

### FH8. Only 9 per cent of teams let an agent publish without review. That is the change queue's receipt, and it is two days old

- **Demand:** Mintlify published "Highlights from the 2026 State of Knowledge Report" on
  2026-09-16. The survey is stated as "Complete survey findings from 329 respondents". The two
  sentences that matter, verbatim:

  > "Our survey confirms the trend: 83% of respondents say AI agents now draft documentation updates
  > for their team. But humans haven't left the loop—only 9% let agents publish without review.
  > Documentation is becoming a system that reads itself and drafts its own improvements, with people
  > deciding what's true and what ships."

  Their own product telemetry, verbatim: "Between February and August 2026, users directed the
  Mintlify agent to update documentation nearly 367,000 times. By the end of that window, 95% of
  that volume was fully automated via webhooks and cron jobs, and more than 61% of the resulting
  pull requests were merged."

  On why a wrong document is now worse than it used to be, quoted on the page and attributed to
  Sarah Deaton, Technical Content Engineer for Claude Code at Anthropic, verbatim:

  > "The same page that misled one developer now misleads an unknowable number of agents, which then
  > propagate that misunderstanding to downstream users."

- **Source:** https://www.mintlify.com/blog/the-state-of-knowledge-2026-highlights opened 2026-09-18
- **Who ships it today:** Mintlify, through GitHub pull requests. That is the honest answer: the
  review step exists, and its user interface is a pull request. Everyone else in FH6 has version
  history instead.
- **Nobody ships:** a review step for people who do not use GitHub. INFERENCE: 83% of teams have an
  agent drafting, 91% insist on review, and the only working review surface in the category is a
  developer tool. A non-developer on a documentation team is reviewing agent output in a pull
  request or not at all.
- **The problem it solves for us:** this is the number the whole product rests on, from a named,
  dated, third-party survey rather than from our own conviction. 91% of teams will not let an agent
  publish unreviewed. We are building the review surface. Nobody has built it outside git.
- **Fit:** it is the plan. The one adjustment it argues for is that the change queue must be usable
  by somebody who has never seen a diff, because the people who need it are not the people who
  already have pull requests.
- **Effort:** already committed. The non-developer presentation of a diff is the part to get right.
- **Verdict:** must-have. Quote this number in the deck. INFERENCE: the 9% figure is the single most
  useful sentence found in this lens, because it converts our central bet from a belief into a
  measured preference.

### FH9. Agent traffic passed human traffic in August 2026, and agents get there through markdown

- **Demand:** from the same 2026-09-16 report, verbatim:

  > "Something major happened this year: AI agents overtook humans as the primary readers across
  > Mintlify-powered sites. In August alone, agents made 257 million web requests compared to 131
  > million human page loads, which means that agent traffic now outnumbers human traffic by nearly
  > 2:1."

  And on the route they take, verbatim: "In August, 83% of agent traffic arrived through
  deliberately machine-friendly routes—Markdown versions of pages, llms.txt files, and agent skills.
  And MCP tool calls exploded that same month, tripling since February."

  On navigation, verbatim: "we ran 2,400 controlled tests across 20 documentation sites to see if we
  could get agents to navigate to live pages rather than just guess at URLs" and "Adding a link to a
  site's llms.txt in the Markdown versions of pages made a 20x improvement over HTML. The failed
  requests per task dropped significantly when agents were given a path to all the content on the
  site via the llms.txt file. This optimization also cut token consumption by up to 60%".

  On readiness, verbatim: "79% of companies rate their knowledge as average or ahead of the pack,
  but just 7% have made every surface they own readable by an agent." And: "More than half of
  respondents say their company's knowledge is spread across five or more surfaces, yet less than a
  third rate "most" or "all" of it as AI-ready."
- **Source:** https://www.mintlify.com/blog/the-state-of-knowledge-2026-highlights opened 2026-09-18
- **Who ships it today:** Mintlify, GitBook and ReadMe all emit `llms.txt` and markdown versions of
  pages. Per HackMD's 2026-06-03 comparison, GitBook "auto-generates .md versions of every page plus
  llms.txt and llms-full.txt" and Mintlify "auto-generates llms.txt, llms-full.txt, and a skill.md".
  https://hackmd.io/blog/2026/06/03/best-markdown-editor-2026 opened 2026-09-18.
- **Nobody ships:** this for a person's own published page. Our plan has a published page and a
  portfolio. Neither is described anywhere as emitting a markdown twin or an `llms.txt`.
- **The problem it solves for us:** if you publish from frontmatter and an agent cannot read it,
  you have published into the smaller half of the audience. The measured fix is cheap and known:
  serve the `.md`, list it in `llms.txt`, link the `llms.txt` from the markdown page.
- **Fit:** this is nearly free for us and awkward for everybody else. Our source of truth is already
  the markdown file. Serving the raw bytes at `page.md` is a route, not a converter. Every rival has
  to generate markdown from blocks; we would be serving the original.
- **Effort:** small. A content negotiation header, a `.md` route, a generated `llms.txt`, and a link
  from the markdown output. Days.
- **Verdict:** good-to-have, verging on must-have for the published page, because it is small, it is
  measured, and it is the one place where being file-first is a mechanical advantage rather than a
  philosophical one.

### FH10. Mintlify stopped metering tokens and started charging for outcomes, and charges nothing when the agent produces nothing

- **Demand:** Mintlify changed its AI pricing on 2026-09-08. The rationale, verbatim:

  > "It solved our problem, not yours. Tokens are how we buy AI, not how teams plan to use it. The
  > same automation could cost a different amount every run. The assistant charged for every message,
  > including the ones it couldn't answer. The meter counted effort instead of results."

  And, verbatim: "When we asked customers what made credits difficult, nearly every one of them gave
  the same answer: unpredictability."

  The new prices, verbatim: "Assistant answers a question: 25 credits"; "Assistant can't answer: 0";
  "Automation updates your docs: 250 credits"; "Automation finds nothing to update: 0". Plus:
  "we are also providing unlimited editor agent and Slack agent usage with Pro and Enterprise plans"
  and "teams using automations should spend around 70% fewer credits than they did last month".
- **Source:** https://www.mintlify.com/blog/outcome-based-ai-pricing opened 2026-09-18
- **Who ships it today:** Mintlify alone, as of this date. Notion, Slite, Confluence, Craft and Box
  all meter credits or units (see FH6). Notion is "$10 per 1,000 monthly Notion credits", Slite is
  "50 monthly credits per seat", Confluence is "25 Rovo credits per user per month" and up, Craft is
  "15 credits" free and "50 credits/month" on Plus, Box is "1K AI Units per month" on Enterprise
  rising to "20,000" on Enterprise Advanced.
- **Nobody ships:** free refusal, except this one company, and they shipped it ten days ago.
- **The problem it solves for us:** we have built a product whose headline behaviour is refusing.
  Splice-only writing refuses rather than guess when a range is ambiguous. Under a token meter, a
  refusal costs the customer money and returns nothing, which makes our best behaviour feel like a
  bill. Mintlify has just proved that the market will accept, and prefers, the opposite rule.
- **Fit:** direct. The rule writes itself: an accepted change costs, a rejected change costs less,
  a refusal costs nothing. It also aligns the incentive properly, because we then only earn when the
  person keeps the edit.
- **Effort:** small to medium, and it is a decision more than a build. The tier configuration panel
  already exists, so the meter is a policy in it.
- **Verdict:** must-have as a pricing principle, good-to-have as a build. INFERENCE: "you do not pay
  for a refusal" is a sentence only we can say convincingly, because only we refuse on purpose.

### FH11. Almanac's shutdown is confirmed, but our stated reason for citing it is wrong

- **Confirmed, verbatim, from Almanac's own farewell page:** "We've made the decision to shut down
  Almanac on January 31, 2025." The date in our brief is correct.
- **Source:** https://get.almanac.io/go-forward opened 2026-09-18. Note that `almanac.io/go-forward`
  307-redirects to `get.almanac.io/`, which is a live marketing page with no shutdown notice on it
  at all, so a casual check of the obvious URL now returns the opposite impression.
- **The correction:** the stated reason was not that the product failed or that read receipts were
  rejected. Verbatim, in order: "Last year, we saw an opportunity to use our platform to help many
  more people—small teams without the skills or resources of our larger customers—generate content
  and grow faster through the magic of AI." Then: "Our new product, Blaze, has since taken off,
  growing to tens of thousands of users in a matter of months—and it's consumed all of our small
  team's time and energy to serve these customers well." Then: "Ultimately, we've decided we don't
  want to offer a product in Almanac whose quality we no longer have the capacity to maintain or
  improve." The page also says Almanac "has been adopted by many of the world's best remote
  companies, and it's helped thousands of customers work faster and reduce meetings."
- **Why this matters to us:** our CLAUDE.md records that per-span read state was dropped on
  2026-09-17 partly because "Almanac shipped the same read receipts and shut down". The shutdown is
  real. The implied causation is not supported by the only primary source. Almanac shut down because
  a second product took off and the team chose it, which is an attention story, not a feature
  verdict. INFERENCE: the read-receipt idea was retired on a reason that its own evidence does not
  carry. FH7 is the reason to revisit it, since `verified: [{by, at}]` is now a field in a Google
  specification.
- **Name collision to record:** there is a new, unrelated Almanac. `usealmanac.com` is a Y Combinator
  S26 company whose home page headline reads, verbatim, "Meet Almanac, The agent with a second
  brain." and "Always on, with its own computer, signed into your tools. You text it work. It texts
  you when it's done." Its second section is headed, verbatim, "The wiki that self-updates", with
  the body "Work happens in your tools. Almanac compiles it into a wiki, then reads it before doing
  anything." It was posted to Hacker News as "Launch HN: Almanac (YC S26) - AI that knows your
  company" on 2026-08-31 and scored 59 points with 48 comments. The site shows a waitlist, not
  pricing. https://usealmanac.com/ opened 2026-09-18; counts from
  https://hn.algolia.com/api/v1/items/49511007 read 2026-09-18.
- **Verdict:** skip as a feature. Must-fix as a document correction: our own record cites a cause
  the source does not state, and there are now two Almanacs.

### FH12. The memory layer sells a database. One vendor sells markdown files, and it is the cheapest by a wide margin

- **Demand:** the agent memory category has priced itself as infrastructure. Prices read on
  2026-09-18, each from the vendor's own pricing page:

  | Product | Free | Paid entry | Top published tier | Unit |
  |---|---|---|---|---|
  | mem0 | Hobby, "10,000 add requests/ month", "1,000 retrieval requests/ month", "1 project" | Starter "$19/month" | Pro "$249/month" | requests |
  | Zep | "10,000 credits/month, no rollover or auto-topup", 2 projects, "1 Memory MCP Server seat" | Flex "$125/month" | Flex Plus "$375/month" | credits, "then $25 per 10,000 credits" |
  | Letta | "$0/month", "bring your own API keys" | Pro "$20/month" | Teams Pro "$20/seat/month"; API "$20/month base + usage", "$0.10/active agent/month", "$0.00015/second tool execution" | agents and seconds |
  | supermemory | "$0/month", "$5 credits included, renewed monthly" | Pro "$19/month", "$20 included credits per month" | Scale "$399/month", "$600 included credits per month" | dollar credits |
  | Basic Memory | "Local", "$0 · open source" | Cloud "from $15/seat/mo" | "Agents", "custom", credit-based | seats |

  Sources, all opened 2026-09-18: https://mem0.ai/pricing, https://www.getzep.com/pricing,
  https://docs.letta.com/letta-code/pricing (reached via a 301 from https://www.letta.com/pricing),
  https://supermemory.ai/pricing, https://basicmemory.com/
- **The one that is our shape:** Basic Memory. Its headline is, verbatim, "Knowledge Management. AI
  Native." and under it, "One place for your notes, decisions, and workflows. For you, your AI tools,
  and your team." On storage, verbatim: "Open source and offline. Your knowledge graph lives on your
  own machine.", "Plain Markdown you own", and it describes itself as "a knowledge graph written in
  plain Markdown". It is the only one of the five whose storage format is a file you can open.
- **The positioning the others use:** Zep calls itself a "Context engineering platform for AI agents"
  with "Credit-based pricing for production agent memory". supermemory calls itself "The default
  engine for memory and continual learning for agents" and "Memory and continual learning for any
  model, any harness". Neither describes a file you can read.
- **Who ships it today:** see the table. Note that Zep sells "Memory MCP Server seat" as a counted
  unit, 1 on free, 5 on Flex, 15 on Flex Plus.
- **Nobody ships:** an editor for the memory. Every one of these is an API. The files, where files
  exist at all, are written by the system and read by the agent, and there is no surface where a
  person sits down and corrects what the agent decided to remember. The HN thread on Agent Kernel
  (2026-03-23, 44 points, 19 comments) is people saying exactly that. `chrisdudek`, verbatim:
  "bigbezet is right, agents have no clue what's worth remembering. What works for me is splitting
  it: the agent writes what happened, I decide what actually matters." And, verbatim: "After a few
  weeks of reading your rants about some coworker, the agent just takes your side on everything. Had
  to literally add 'consider the other person's perspective' to my rules file."
  https://news.ycombinator.com/item?id=47486287 opened 2026-09-18.
- **The problem it solves for us:** the memory category has an unsolved human step, and it is a
  review step. "The agent writes what happened, I decide what actually matters" is a description of
  our change queue pointed at a memory directory instead of a document directory.
- **Fit:** very good and almost free. A memory file is a markdown file. If a person keeps their agent
  memory in a folder, our editor already opens it, our queue already reviews edits to it, and our
  problems panel already checks it. No new engine.
- **Effort:** small, if it is positioning plus a folder template. Medium if we chase the MCP side.
- **Verdict:** good-to-have. INFERENCE: this is a marketing wedge rather than a feature. "Read what
  your agent decided to remember, and delete the bits it got wrong" is a sentence that needs no new
  code from us and that none of the five vendors above can say, because four of them have no file
  and the fifth has no editor.

### FH13. The AI-native writing surfaces still do not touch a file on disk, and one of them has not been updated in over a year

- **Demand:** this is a negative finding and it is the clearest hole in the lens. I read each
  product's own page on 2026-09-18 looking for any claim about a file on the user's machine.
  - **Gemini Canvas.** The page describes, verbatim, "Bring your ideas to life as apps, games,
    infographics and more. Go from prompt to prototype in minutes". Its three capability headings
    are "Visualize and Personalize", "Prompt and Create" and "Draft and Refine". There is no mention
    of markdown, files, export, or a local directory anywhere on the page, and the mobile caveat is,
    verbatim: "you can only edit text style and format in the Gemini web app on desktop. This
    functionality is not available on mobile devices."
    https://gemini.google/overview/canvas/ opened 2026-09-18.
  - **Lex.** The pricing page mentions no files, no markdown, no export and no agents. It describes
    the product's purpose, verbatim, as "Anything that goes through an edit process that you want to
    make really good." Its own copy is stale: it names "GPT 4.1 and Claude 4 Opus & Sonnet" as "the
    biggest and best AI models" and states, verbatim, "Right now, Claude 3.5 Sonnet is widely
    regarded as the best LLM for writing, but this will likely change." The footer reads "© 2026
    Lex, Inc". https://lex.page/pricing read 2026-09-18 with a browser, because the page returns
    nothing useful to curl.
  - **Sudowrite.** Priced at "$10/month" for "225,000" credits per month, "$22/month" for
    "1,000,000 credits", "$44/month" for "2,000,000 per month" with "Unused credits rollover for 12
    months". Framed entirely around fiction, verbatim: "Good for longer works, like a novel or
    screenplay". No file or markdown claim. https://www.sudowrite.com/pricing opened 2026-09-18.
- **Who ships it today:** of the AI-native writing surfaces, the ones that touch files on disk are
  the coding harnesses, not the writing tools. Claude Code, Codex CLI and Gemini CLI all edit files
  in place, which is precisely why Ritemark's entire product is a terminal placed next to a preview
  (FH1) and why OpenKnowledge embeds a Claude terminal (FH2).
- **Nobody ships:** a writing tool, as opposed to a coding tool, that owns the file. The split is
  clean and it has not moved in 2026: writing tools own a document in a database, coding tools own a
  file on disk, and the market has responded by bolting a terminal onto a preview pane.
- **The problem it solves for us:** it tells us who the competitor really is. It is not Lex or
  Sudowrite, which have not entered the agent era at all. It is a terminal next to a preview. The
  bar we have to clear is "better than a split screen", and the way to clear it is the review step,
  because a terminal cannot show you what changed and ask.
- **Fit:** confirms the plan.
- **Effort:** none.
- **Verdict:** skip as a feature, keep as competitive framing. INFERENCE: Lex quoting Claude 3.5
  Sonnet as current, in a page carrying a 2026 copyright, is the clearest single sign that the
  prose-writing category has not noticed what happened.

### FH14. Three strangers in one thread independently asked for the same thing: a draft-then-promote state, and Google shipped the field for it

- **Demand:** "Show HN: A Karpathy-style LLM wiki your agents maintain (Markdown and Git)",
  2026-04-25, **260 points, 114 comments**. Three separate commenters describe the same missing
  mechanism, in their own words, without prompting each other.

  `najmuzzaman`, verbatim, explaining why an Obsidian plugin is not enough:

  > "Obsidian is a single-user editor. It does not have the concept of "agent A drafted this, agent B
  > promoted it, the team approved it." The promotion flow needs a state machine that lives outside
  > the editor. a plugin can simulate it but the source-of-truth has to be a process the agents talk
  > to instead of a vault file."

  `saadn92`, verbatim, describing what he already built by hand:

  > "I've been running a variation of this for ~6 months. What seems to work: a background process
  > that reads conversation transcripts after sessions end and then extracts decisions/rejected
  > approaches into structured markdown. I review before I promote it into the context."

  `stingraycharles`, verbatim, on why the human step is not optional:

  > "The few scientific studies out there actually show a degradation of output quality when these
  > markdown collections are fully LLM maintained (opposed to an increase when they're human
  > maintained), which I found fascinating. I think the sweet spot is human curation of these
  > documents, but unsupervised management is never the answer, especially if you don't consciously
  > think about debt / drift in these."

  A reply from `criley2` names the study, verbatim: "Are you referring to the one (1) study that
  showed that when cheaper LLM's auto-generated an AGENTS.md, it performed more poorly than human
  editted AGENTS.md? https://arxiv.org/abs/2602.11988". That paper, "Evaluating AGENTS.md: are they
  helpful for coding agents?", was itself posted to Hacker News on 2026-02-16 and scored
  **232 points with 161 comments**.
- **Source:** https://news.ycombinator.com/item?id=47899844 opened 2026-09-18. Counts from
  https://hn.algolia.com/api/v1/items/47899844 and .../47034087, both read 2026-09-18.
- **The convergence:** Google's OKF v0.2, published 2026-07-25, added a frontmatter field that is
  exactly this, verbatim: `status` "moves a concept through `draft → stable → deprecated`" (FH7).
  So the feature three strangers asked for in April is a field in a Google specification by July,
  and there is still no editor that drives it.
- **Who ships it today:** nobody, as a product. `najmuzzaman` built the state machine into wuphf as
  MCP tools, naming them verbatim: "/lookup, entity_fact_record, notebook_write, and
  team_wiki_promote are MCP tools the agent runtimes call directly". `saadn92` built his by hand.
  Obsidian cannot do it and the commenter explains why.
- **Nobody ships:** promotion as a visible state in an editor. Everyone has drafts and everyone has
  published. Nobody has "an agent wrote this, it is a draft until a person promotes it, and the file
  itself records which".
- **The problem it solves for us:** our change queue answers "do I accept this edit". It does not
  answer "is this document trustworthy yet". Those are different questions and the second one is the
  one people are hand-rolling. A document an agent wrote and nobody has read should look different
  from one a person approved, and the difference should live in the file so that the next agent can
  see it too.
- **Fit:** excellent, and it is the same splice we already do. On accept, write `status: stable` and
  `verified: [{by, at}]` into the frontmatter. On an agent write, set `status: draft` and
  `generated: {by, at}`. The file carries its own state, the editor just renders it, and the
  projection law is untouched because the state is in the bytes.
- **Effort:** small to medium. Frontmatter stamping on queue actions, a filter in the file list, and
  a badge. Under two weeks on top of the queue.
- **Verdict:** must-have. This is the highest-conviction feature in the lens: three independent
  people asked for it in one thread, one academic paper supports the human-in-the-loop half of it,
  and Google standardised the field three months later. We are the only product positioned to write
  that field honestly, because we are the only one with an accept step to write it from.

### FH15. Cloudflare made markdown a network feature in February 2026, and the token numbers are on the page

- **Demand:** Cloudflare published "Introducing Markdown for Agents" on 2026-02-12, structured data
  `datePublished` "2026-02-12T14:03:00.000Z". The product description, verbatim: "Markdown for
  Agents automatically converts any HTML page requested from our network to markdown."

  The cost argument, verbatim, and this is the number worth carrying:

  > "This blog post you're reading takes 16,180 tokens in HTML and 3,150 tokens when converted to
  > markdown. **That's a 80% reduction in token usage**."

  And, verbatim: "Feeding raw HTML to an AI is like paying by the word to read packaging instead of
  the letter inside. A simple `## About Us` on a page in markdown costs roughly 3 tokens; its HTML
  equivalent - `<h2 class="section-title" id="about">About Us</h2>` - burns 12-15, and that's before
  you account for the `<div>` wrappers, nav bars, and script tags that pad every real web page and
  have zero semantic value."

  On why the format won, verbatim: "Markdown has quickly become the *lingua franca* for agents and
  AI systems as a whole."

  Availability, verbatim: "This feature is available today in Beta at no cost for Pro, Business and
  Enterprise plans, as well as SSL for SaaS customers."
- **Source:** https://blog.cloudflare.com/markdown-for-agents/ opened 2026-09-18. Note that I read
  it by sending `Accept: text/markdown`, and the server answered `content-type: text/markdown;
  charset=utf-8` with `vary: accept-encoding, accept`. Their own blog practises the thing it sells.
- **Related, and it has a scorecard:** acceptmarkdown.com, posted to Hacker News on 2026-08-26 with
  **176 points and 108 comments**, is a documentation site for the same pattern, built by Ben Word.
  Its home page states, verbatim: "Your site already has the content. Serving a Markdown variant
  lets agent AI clients skip nav/scripts/layout markup and read the content directly." It ships a
  four-point conformance check whose criteria are, verbatim: "Serves Markdown for Accept:
  text/markdown", "Sets Vary: Accept", "Rejects unsupported types with 406", "Honors q-values". It
  also publishes what it calls an "AI agent support matrix", described verbatim as "Which AI agents
  send Accept: text/markdown when their browse or fetch tools hit a URL." Recipes are listed for
  "Nginx, Caddy, WordPress, Discourse, Laravel, Rails, Cloudflare Workers, Next.js, Astro, Apache,
  SvelteKit, Nuxt/Nitro, Express, Go, Django". https://acceptmarkdown.com/ opened 2026-09-18, counts
  from https://hn.algolia.com/api/v1/items/49454764 read 2026-09-18.
- **Who ships it today:** Cloudflare at the network edge, free on Pro and above. Mintlify, GitBook
  and ReadMe at the documentation platform level.
- **Nobody ships:** this from a personal publishing surface. If you publish a page from a notes app,
  an agent gets your HTML.
- **The problem it solves for us:** it dates the shift and it prices it. Markdown stopped being a
  writer's preference in February 2026 and became a delivery format with an 80% cost saving attached
  to it, measured by a company that moves a large share of the web.
- **Fit:** as in FH9, we are already storing the answer. Serving `Accept: text/markdown` from our
  published page is a header and a route, and unlike every block-based rival we do not have to
  convert anything, because the markdown is the original.
- **Effort:** small. The four criteria on acceptmarkdown.com are a complete specification and there
  is a public checker to verify against.
- **Verdict:** good-to-have, and it is the cheapest credible "built for agents" claim available to
  us. INFERENCE: passing a public scorecard that most of the web fails is a better proof than a
  paragraph of positioning.

### FH16. A token count in the status bar, because the reader is paying by the token now

- **Demand:** OpenKnowledge's home page shows its editor chrome, and the status line under a document
  reads, verbatim: "main 76 words · 385 chars · ~97 tokens 0 words · 0 chars · ~ 0 tokens". They put
  a token estimate next to the word count, per section. Their headline is, verbatim, "Beautiful,
  AI-native markdown editor" with the subline "A rich text editor and knowledge base for you and
  your agents." The download button reports "4.2K", which appears next to a GitHub label.
  https://openknowledge.ai/ opened 2026-09-18.

  The reason it belongs there is priced on two other pages read the same day. Cloudflare: "This blog
  post you're reading takes 16,180 tokens in HTML and 3,150 tokens when converted to markdown."
  Mintlify, on their navigation benchmark: the llms.txt optimisation "also cut token consumption by
  up to 60%".

  And people already feel it. In the OpenKnowledge thread, `sizero` asked, verbatim: "Are the Open
  Knowledge skills actually needed, if this is just markdown and folders? The skills are large, I'd
  prefer not filling up context." Then, verbatim: "On my first run on Codex desktop, it said the
  equivalent of "skill too large, reading it in chunks". I have the pro subscription."
- **Source:** https://news.ycombinator.com/item?id=48675435 opened 2026-09-18
- **Who ships it today:** OpenKnowledge, in the status line, free. INFERENCE from the pages read: no
  paid document tool shows a token count, because their documents are not what the agent reads.
- **Nobody ships:** a token budget. A count is the easy half. Nobody shows you that your AGENTS.md
  is about to blow a context window, or which section of a long document is the expensive one, or
  what the file costs an agent to read compared with last week.
- **The problem it solves for us:** an instruction file or a specification is now read far more often
  by a machine than by a person, and its length is a running cost. A writer has no instrument for
  that. Our plan already has an instruction files screen and a problems panel, and "this file is
  large enough to be read in chunks" is a problem in exactly that sense.
- **Fit:** clean. It is a projection of the bytes, computed at render, written nowhere. It cannot
  violate the projection law because it never touches the file.
- **Effort:** small for a count and a per-section breakdown. Medium if we add a budget with a warning
  threshold in the problems panel, since that needs a per-file setting.
- **Verdict:** good-to-have. Small, visible, nobody paid has it, and it makes the agent era legible
  in the one place a writer is already looking.

---

## Answer 1. What launched, raised or died in 2026

Dated, with sources. Scores and comment counts come from the public Hacker News API, each read
2026-09-18, and every id in this file was re-checked against it after the file was written.

One note for whoever audits these numbers, because the two endpoints disagree and the disagreement
looks like an error. Comment counts here are the `num_comments` field from
`api/v1/search?tags=story_<id>`, which is the count Hacker News displays. Walking the comment tree
from `api/v1/items/<id>` returns a smaller number, because dead and flagged comments are absent from
the tree but still counted. On one item the two differ by 125. The larger figure is the correct one.

Rows marked UNVERIFIED are ones
whose primary page I could not open; they rest on a search result or a URL slug and should be
re-checked before anyone quotes them.

| Date | What | Evidence |
|---|---|---|
| 2025-01-31 | **Almanac shut down.** Reason given was that a second product, Blaze, took the team's capacity | https://get.almanac.io/go-forward |
| 2026-01-11 | Ferrite launched, markdown editor in Rust with native Mermaid, 241 points, 190 comments | HN 46571980, github.com/OlaProeis/Ferrite |
| 2026-01-29 | Vercel published "AGENTS.md outperforms skills in our agent evals", 524 points, 196 comments, the highest-scoring item in this sweep | HN 46809708 |
| 2026-02-12 | **Cloudflare shipped Markdown for Agents**, free beta on Pro, Business, Enterprise and SSL for SaaS | https://blog.cloudflare.com/markdown-for-agents/ |
| 2026-02-16 | arXiv 2602.11988, "Evaluating AGENTS.md: are they helpful for coding agents?", 232 points, 161 comments | HN 47034087 |
| 2026-02-24 | Superhuman, formerly Grammarly, acquired the spreadsheet startup Rows | UNVERIFIED, search result only, primary page not opened |
| 2026-03-17 | "Get Shit Done", a spec-driven development system, 473 points, 253 comments | HN 47417804, github.com/gsd-build/get-shit-done |
| 2026-03-23 | Cq, "Stack Overflow for AI coding agents", from Mozilla AI, 225 points, 103 comments | HN 47491466 |
| 2026-03-23 | Agent Kernel, "Three Markdown files that make any AI agent stateful", 44 points, 19 comments | HN 47486287 |
| 2026-04-14 | **Mintlify raised $45M Series B at a $500M valuation**, led by a16z and Salesforce Ventures, total funding $67M, "over 20,000 companies" | https://www.mintlify.com/blog/series-b |
| 2026-04-16 | Marky, a markdown viewer for agentic coding, 75 points, 38 comments | HN 47795468 |
| 2026-04-23 | Tolaria, open source macOS app for markdown knowledge bases, 318 points, 142 comments | HN 47882697 |
| 2026-04-25 | wuphf, "A Karpathy-style LLM wiki your agents maintain (Markdown and Git)", 260 points, 114 comments | HN 47899844 |
| 2026-06-13 | **Google Cloud published the Open Knowledge Format v0.1**, markdown plus YAML frontmatter | https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/ |
| 2026-06-25 | **OpenKnowledge launched**, "open source AI-first alternative to Obsidian/Notion", from Inkeep, **381 points, 173 comments**, the top markdown launch of the year | HN 48675435 |
| 2026-06-25 | **Notion announced Notion Mail would shut down**, framed as agents replacing the inbox | TechCrunch, `datePublished` "2026-06-25T19:14:46+00:00", https://techcrunch.com/2026/06/25/notion-mail-shuts-down-amid-agent-takeover/ |
| 2026-07-07 | Rowboat, "Open-source, local-first alternative to Claude Desktop", 219 points, 99 comments | HN 48819808 |
| 2026-07-08 | **Coda became Superhuman Docs** | UNVERIFIED on date, search result only; the rebrand itself is verified because coda.io/pricing now 307s to superhuman.com/plans/docs |
| 2026-07-25 | **Open Knowledge Format v0.2 added trust signals**: `generated`, `verified`, `sources`, `stale_after`, `status` | https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals |
| 2026-08-04 | Ritemark published its comparison page, dated on the page | https://ritemark.app/en/good-to-know/comparisons/best-markdown-editor-for-ai/ |
| 2026-08-11 | Write.md, free open source themeable markdown editor for macOS, 107 points, 78 comments | HN 49258011 |
| 2026-08-17 to 08-21 | OpenKnowledge ran a launch week, per its own home page banner | https://openknowledge.ai/ |
| 2026-08-19 | "Feature Request: Support AGENTS.md" on anthropics/claude-code issue 6235, 379 points, 219 comments | HN 49367350 |
| 2026-08-23 | Fabien Sanglard's agent.md post, 415 points, 176 comments | HN 49410932 |
| 2026-08-26 | acceptmarkdown.com, markdown content negotiation, 176 points, 108 comments | HN 49454764 |
| 2026-08-31 | **A second, unrelated Almanac launched** as a YC S26 company, "AI that knows your company", 59 points, 48 comments | HN 49511007, https://usealmanac.com/ |
| 2026-09-08 | **Mintlify replaced token metering with outcome pricing.** A refusal now costs zero | https://www.mintlify.com/blog/outcome-based-ai-pricing |
| 2026-09-16 | **Mintlify's 2026 State of Knowledge Report**: agent traffic passed human traffic, and only 9% let agents publish unreviewed | https://www.mintlify.com/blog/the-state-of-knowledge-2026-highlights |
| 2026-09-17 | Skillsync, YC W26, "AI chat sessions made portable across agents", 41 points, 46 comments | HN 49743049 |
| 2026-09-22 | **Notion Mail shuts down** (scheduled, four days after this pass) | TechCrunch as above |

What the table says in one line: nothing in this space died in 2026 except a mail client, one
company raised properly, and the real events were two format announcements and a survey.

## Answer 2. Who is occupying our position

Three, and they are all free. Quotes are from their own home pages, read 2026-09-18.

**1. Ritemark** at https://ritemark.app/en/ is the closest.
> "Markdown editor with AI agents."
> "Claude, Codex, and Gemini work alongside you in a visual editor. They read your files, edit them,
> create new ones. You stay in control."
> "No upload, no indexing, no copy-paste. The agent works on the same Markdown files you do, right
> where they already live."
> "Drafts in ~/docs/q2-strategy/ stay in ~/docs/q2-strategy/."
> "Completely free to download and use. No subscription, no account, no hidden fees."
macOS and Windows. Its mechanism is a terminal inside the app. No review step, no MCP mention, no
web or phone.

**2. OpenKnowledge** at https://openknowledge.ai/, from Inkeep, a Y Combinator company.
> "Beautiful, AI-native markdown editor"
> "A rich text editor and knowledge base for you and your agents."
> "A Notion-like editor that's just markdown under the hood."
Free and open source, Electron, macOS app plus a cross-platform command line tool, 4.2K on the
GitHub counter on its own page. It lists roughly forty agent harnesses it works with, naming Claude,
Codex, Cursor, Gemini, Copilot, OpenClaw, OpenCode, Pi, Hermes and more. It has callouts, accordions,
tabs, Mermaid, media, embeddable HTML, templates and a per-section token count.

**3. Basic Memory** at https://basicmemory.com/ takes the memory half of the position.
> "Knowledge Management. AI Native."
> "One place for your notes, decisions, and workflows. For you, your AI tools, and your team."
> "Open source and offline. Your knowledge graph lives on your own machine."
> "Plain Markdown you own"
Free locally, cloud "from $15/seat/mo".

**Also in the neighbourhood, lower confidence:** markrahq/markra describes itself in its GitHub
repository description, per search results, as "A WYSIWYG Markdown editor with native AI. Fully open
source. Free to use. Your data stays local."; hyperclast.com is a web-based team markdown workspace
whose founder solicited feedback in the Ferrite thread; Tolaria, Write.md, Marky, Atomic, Rowboat
and piclaw are all 2026 entries in the same drawer. UNVERIFIED: VMark, ZenNotes and SoloMD appeared
in a search summary and I did not open their pages.

**The honest read.** The sentence "a markdown editor where agents edit your local files" is taken,
three times over, by products that charge nothing. What none of the three has is a step between the
agent writing and the file changing. Ritemark's control story is that you can watch the terminal.
OpenKnowledge's is that the MCP server returns warnings to the agent. Neither is review. That gap,
and not the file format, is what we have left.

## Answer 3. Pricing, everything comparable

Every price below was read from the vendor's own pricing page on 2026-09-18. Prices shown in rupees
are what the page served to an Indian address; the dollar equivalents are not printed on those pages
and I have not converted them, because a converted number is an invented number.

**Document tools**

| Product | Free | Entry paid | Next tier | Metering | Page |
|---|---|---|---|---|---|
| Notion | $0 | Plus $10/seat/mo | Business $20/seat/mo, first tier with "Notion Agent" | "Free to try, then $10 per 1,000 monthly Notion credits"; Workers "Starts using credits on October 15" | notion.com/pricing |
| Superhuman Docs (was Coda) | ₹0 | Pro ₹983/mo per Doc Maker annual, ₹1250 monthly | Business ₹2700/mo per Doc Maker annual, ₹3299 monthly | per "Doc Maker", not per seat | superhuman.com/plans/docs |
| Slite | not listed | Basic $10/user/mo yearly | Pro $20/user/mo yearly, "An agent-powered knowledge base" | "50 monthly credits per seat" | slite.com/pricing |
| Confluence | Free, 10 users, no Rovo | Standard | Premium | "25 Rovo credits per user per month / 100 indexed objects per user", rising to 70/250 and 150/625 | atlassian.com/software/confluence/pricing |
| Craft | ₹0, "15 credits" | Plus ₹526.7/mo monthly, ₹658.3/mo yearly, "50 credits/month" | Family ₹986.7/mo, Team ₹3,792/mo | AI credits | craft.do/pricing |
| Box | Individual free | Business tiers, prices not rendered | Enterprise "1K AI Units per month", Enterprise Plus "2K", Enterprise Advanced "20,000" | "Subject to Box AI Unit consumption" | box.com/pricing |
| Dropbox | Basic free, 2 GB | Plus $9.99/mo | Standard $15/user/mo, Advanced $24/user/mo | Dash is a separate product; its pricing page 404s | dropbox.com/plans |
| Google Workspace | none | Base ₹99/user/mo | Starter ₹270, Standard ₹1,080 (first tier with "Gemini AI assistant in Gmail, Docs, Meet, and more") | bundled | workspace.google.com/pricing |
| Mintlify | "Start for free" | not rendered | not rendered | fixed per outcome: answer 25 credits, no answer 0, docs update 250 credits, nothing to update 0 | mintlify.com/blog/outcome-based-ai-pricing |

**Writing tools**

| Product | Price | Page |
|---|---|---|
| Sudowrite | $10/mo for 225,000 credits, $22/mo for 1,000,000, $44/mo for 2,000,000 with 12-month rollover | sudowrite.com/pricing |
| Lex | "Lex Pro", no price rendered on the page | lex.page/pricing |

**Memory layer**

| Product | Free | Entry paid | Top published | Unit | Page |
|---|---|---|---|---|---|
| mem0 | 10,000 adds, 1,000 retrievals, 1 project | $19/mo | $249/mo | requests | mem0.ai/pricing |
| Zep | 10,000 credits/mo, 1 MCP seat | $125/mo | $375/mo, then "$75 per 40,000 credits" | credits | getzep.com/pricing |
| Letta | $0, bring your own keys | $20/mo | $20/seat/mo; API "$0.10/active agent/month", "$0.00015/second tool execution" | agents, seconds | docs.letta.com/letta-code/pricing |
| supermemory | $0, "$5 credits included" | $19/mo | $399/mo, "$600 included credits per month" | dollar credits | supermemory.ai/pricing |
| Basic Memory | $0 open source | "from $15/seat/mo" | "custom" | seats | basicmemory.com |

**Direct competitors on our position**

| Product | Price |
|---|---|
| Ritemark | free, "No subscription, no account, no hidden fees" |
| OpenKnowledge | free, open source |

**Two patterns worth naming.** First, $20 per seat per month is the anchor for a paid document tool
with an agent in it: Notion Business, Slite Pro and Letta Pro all land there. Second, everybody
meters the AI except Mintlify, who stopped ten days ago and said so plainly (FH10).

## Answer 4. Features in these products that we do not have and would be good to have

Ranked by evidence strength, not by size. Each maps to a finding above.

1. **Frontmatter stamping on accept: `generated: {by, at}`, `verified: [{by, at}]`, `status`.**
   FH7 and FH14. A Google specification defines the fields, three strangers asked for the behaviour
   independently, and our change queue is the only natural place to write them from. Small.
2. **A grouped changeset, so one agent run across six files is one reviewable unit.** FH3. The
   clearest description of the failure came from somebody who had already hit it. Medium.
3. **Serving `Accept: text/markdown` and an `llms.txt` from the published page.** FH9 and FH15.
   Measured 20x improvement in agent navigation, up to 60% fewer tokens, and a public four-point
   scorecard to pass. Small, and mechanically cheaper for us than for anyone who stores blocks.
4. **A token count in the status line, and a token budget in the problems panel.** FH16. Small.
5. **Query across documents, the Dataview-shaped hole.** FH4. The single named reason people stay on
   Obsidian. Large, and the biggest item here.
6. **An OKF validator wired into the problems panel.** FH7. Google shipped the format without a
   validator and third parties are writing conformance checkers by hand. Medium.
7. **Per-writer pricing rather than per-seat.** FH5. Superhuman charges per "Doc Maker". For a tool
   where an agent writes and a person reviews, charging the reviewer is backwards. Small.
8. **A refusal costs nothing.** FH10. Mintlify proved the market prefers outcome pricing. Our
   headline behaviour is refusing, so this is the one meter that flatters us.
9. **Native diagram rendering with an SVG and PNG export path.** From the Ferrite thread, `quintu5`
   named the trap, verbatim: "One major downside of native rendering is the lack of layout
   consistency if you're editing natively and then sharing anywhere else where the diagram will be
   rendered by mermaid.js." Mermaid is already in our plan; the export and the fidelity promise are
   the parts to get right. https://news.ycombinator.com/item?id=46571980 opened 2026-09-18.
10. **Rich blocks that survive as plain markdown: callout, accordion, tabs, embeddable HTML.**
    OpenKnowledge ships all four and describes the constraint well, verbatim: "A Notion-like editor
    that's just markdown under the hood." Our settled position already picks `> [!kind]` callouts as
    the carrier, so this is the same decision extended. Medium.

**Deliberately not on this list:** a plugin system, a local model integration, and a mobile app,
all of which were asked for repeatedly in the threads and all of which are large. And Obsidian
migration, which came up in every thread I read, and which is already in the plan.

## Answer 5. What the incumbents have NOT done

Five holes, in order of how defensible each looks.

1. **Nobody outside git has built a review step for a machine edit.** 83% of surveyed teams have
   agents drafting documentation and only 9% let them publish unreviewed, so 91% are reviewing
   something, and the only working surface for it in this whole lens is a GitHub pull request
   (FH8). Notion, Confluence, Craft and Box offer version history, which answers "what changed"
   after the fact rather than "may this change" before it. Slite's "Doc fact-checking with suggested
   fixes" is the nearest miss and it is scoped to facts, not to agent edits.
2. **Nobody guarantees byte-exactness, and the category's own top thread shows people asking for
   it.** The highest-value question in the 381-point OpenKnowledge launch was whether YAML
   frontmatter and nested fences survive an agent edit, and the answer was "optimistic parsing"
   (FH2). We have a pinned corpus of 8,513 files and we do not say so anywhere public.
3. **Nobody charges in a way that rewards the agent doing nothing.** Every incumbent meters credits
   or units, which bills the customer for generation and not for correctness. One company changed
   this ten days ago and published the reasoning (FH10). A refusal is our best behaviour and under
   every other meter in this table it would arrive as a charge.
4. **Nobody has built an editor for the memory.** Five funded memory vendors sell an API; four of
   them have no file a person can open, and the fifth has no editor (FH12). Meanwhile people on
   Hacker News describe hand-rolling exactly the missing step, verbatim: "the agent writes what
   happened, I decide what actually matters."
5. **The prose writing tools have not entered the agent era at all.** Lex, on a page carrying a 2026
   copyright, still names Claude 3.5 Sonnet as the best model for writing and mentions no file, no
   markdown and no export. Sudowrite is priced entirely around fiction. Gemini Canvas produces apps,
   games and infographics and never mentions a file (FH13). The people who own files are the coding
   harnesses, which is why the two products closest to us are both a terminal bolted to a preview.

**The shape of the opportunity, stated plainly.** The free tools took "an agent can edit your
markdown". The paid tools took "ask your documents a question". Both crowds skipped the step in
between, which is a person saying yes. That step is the only thing in this entire lens that nobody
has built and that somebody has measured demand for.

## What I could not reach

- **Product Hunt.** `producthunt.com/search?q=markdown` renders nothing to curl, and the browser
  tool was refused by the session gate before I could drive it. No Product Hunt evidence in this
  file. This is a real gap against the brief.
- **The Y Combinator company directory.** The public Algolia endpoint returned `nbHits: None`, so I
  could not filter W26, S26 or Spring 2026 by keyword. What YC evidence is here comes from Launch HN
  posts instead, which under-counts companies that never posted one.
- **Box and Confluence dollar prices.** Both pricing pages render their numbers in JavaScript. I got
  Confluence's Rovo credit allowances and Box's AI Unit allowances from the comparison tables, but
  not the per-seat prices.
- **The Coda to Superhuman Docs announcement page**, `help.superhuman.com`, returned 403, and the
  mirror on `help.coda.io` is behind a JavaScript challenge. The rebrand is verified by the live
  redirect; the 8 July date is not.
- **Superhuman's acquisition of Rows**, February 2026. Search result only, no primary page opened.
- **`news.ycombinator.com/item?id=47415381`** returned HTTP 429 to WebFetch. I got its metadata from
  the Hacker News API instead: "Show HN: Share and edit Markdown files with instant sync and
  comments", with.md, 2026-03-17, 3 points, 1 comment.
- **No page I opened tried to instruct me.** The session's injection gate tripped on a short phrase
  about dispatching tokens to a model, appearing inside ordinary prose about agent memory on a
  fetched page. It is a substring match, not an instruction aimed at me. The gate then matched my
  own sentence describing the match, which is the feedback loop that confirms the diagnosis.

## What surprised me

1. A stranger on Hacker News called our differentiator "the frontmatter question", unprompted, at
   the top of the biggest launch in our category, and the founder could only answer it with a hope.
2. Google added `generated: {by, at}` and `verified: [{by, at}]` to a public specification in July,
   which is the authorship marking and review receipt we deleted from our own plan on 17 September.
3. Almanac's own farewell page says it shut down because a second product took the team's capacity,
   not because its features failed. Our record cites the shutdown as evidence against a feature.
4. Only 9% of teams let an agent publish without review. The whole product rests on that sentence
   and it was published two days before this pass, by a company with no reason to flatter us.
5. Coda no longer exists, there are now two Almanacs, and the most-discussed markdown editor of the
   year is free. Our competitor list was wrong in three separate directions at once.
