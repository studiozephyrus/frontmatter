# Lens D: what markdown and document editor users ask for and do not get

Research file for the 18 September 2026 brief. Findings prefixed `FD`.

Clock check, run at the start of this lens: `date -u` returned
`2026-09-17T23:52:14Z`, which is 2026-09-18 05:22 IST. Every source below was
opened on 2026-09-18 IST.

Scope note from the tasking: the plugin-parity list already in the plan
(mermaid, katex, kanban, tasks, templates, backlinks, tags, drawing, slides,
OCR, citations) is excluded on purpose. What follows is the **unmet** ask.

Evidence discipline. Every count below was read out of a live API response or a
live page fetched in this session, and the command that produced it is shown so
it can be re-run. Quotation marks mean the string was copied. Anything not
copied is marked `INFERENCE:` or `UNVERIFIED:`. British spelling, plain hyphens
only, no dashes.

Method for the GitHub counts: the search API, unauthenticated, no token, paced
against a 10-requests-per-minute limit.

```
curl -sL --compressed "https://api.github.com/search/issues?q=repo:OWNER/REPO+is:issue+is:open+sort:reactions-%2B1-desc&per_page=25"
```

---

### FD1. The editor silently rewrites my file on open, and people hate it

- **Demand:** the single loudest *correctness* complaint in the MarkText tracker,
  and it is not a feature request, it is a betrayal report. Issue **#2189
  "Document is modified when opened/Markdown formatting"**, opened 2020-06-06,
  carries **43 plus-one reactions, 48 total reactions and 47 comments**, second
  only to Vim bindings across all 503 open issues. The maintainer's own words in
  the issue body: "Mark Text formats all content according CommonMark and GFM
  (+other extensions if enabled). The reason for this is that we don't store the
  document as string with spaces etc but as block structure with minimal
  information. As a side effect, we need to build the text file when saving the
  document." And the closing position: "It's currently not planned to change the
  markdown formatting as it's built-in into the editor".
  Two more issues are the same wound. **#1354 "[Compatibility] Automatic Removal
  of Empty Lines"** (**19 plus-ones, 17 comments**): "MarkText automatically
  trims empty lines. That sounds like a good idea, but factually, it's not always
  the case. When you open a file which is not formatted for the strict standards
  required by MarkText, it will usually break the layout. (And if autosave is on,
  that can lead to disastrous results.)" The same user reports non-breaking
  spaces being replaced with ordinary ones, "which again can lead to disastrous
  results."
  **#1849 "Optional rendering of soft breaks as spaces rather than newlines"**
  (**15 plus-ones, 21 comments**) is a user who cannot leave Typora because of
  it: "Since I use SemBr when writing all of my documents, this is a critical
  feature for me and the only thing preventing me from switching from Typora to
  Mark."
- **Source:** https://api.github.com/search/issues?q=repo:marktext/marktext+is:issue+is:open+sort:reactions-%2B1-desc&per_page=25 opened 2026-09-18;
  issue pages https://github.com/marktext/marktext/issues/2189 ,
  https://github.com/marktext/marktext/issues/1354 ,
  https://github.com/marktext/marktext/issues/1849 opened 2026-09-18
- **Who ships it today:** nobody ships *guaranteed* byte-exactness as a named
  promise. Typora (US$14.99 one-off, single licence, three devices) preserves
  more than MarkText does but still normalises. Obsidian (free personal, US$50
  per user per year commercial) keeps the file mostly intact because it edits
  text rather than a block tree, but its own community threads are full of
  formatting-on-save complaints from plugins. Every WYSIWYG that holds a block
  tree in memory has this defect by construction.
- **Nobody ships:** a *stated, tested, refusable* guarantee that opening and
  closing a file leaves the bytes identical, and a visible diff when the editor
  wants to change anything.
- **The problem it solves for us:** this is the thing we already built, and
  nobody has told these people it exists. The projection law plus splice-only
  writing is the direct answer to a complaint with 47 comments and five years of
  accumulated anger in one competitor alone.
- **Fit:** native. It is the premise, not a feature. What is missing is the
  *surfacing*: a byte-identical badge, and a "what would this editor change"
  preview before the first save, so a new user can verify the claim in ten
  seconds instead of trusting it.
- **Effort:** small. The engine exists. The badge and the pre-save diff are UI.
- **Verdict:** must-have as a **marketing surface**, good-to-have as a feature.
  We should ship the visible proof, because the promise is worthless if the user
  cannot check it. This is the one complaint where we can name a competitor's
  five-year-old open issue and say we closed it.

---

### FD2. Watch the file and reload it, because I am editing it somewhere else

- **Demand:** MarkText **#3652 "auto-reload"** (**14 plus-ones**, opened
  2023-07-14) asks for exactly one thing: "I would like to add an option to
  auto-reload the document. This is because, in certain occasions I use a text
  editor to create my Markdown file, and I split the window in two to have the
  preview of the document, but it is a bit annoying to have to refresh it
  manually to see the new changes."
  MarkText **#3688 "Locked/View only mode"** (**12 plus-ones, 7 comments**,
  opened 2023-10-04) is the same person shape, stated more completely: "I use
  MarkText mostly as a viewer and do my editing in Vim. When I want to read my
  notes I use MarkText for the clean and pretty syntax. Most of the time I'll
  have Vim and MarkText open side by side and type in Vim and view in MarkText.
  The requested mode would streamline this process (with the auto-reload) and
  prevent unintentional changes with the lock mode."
  A third, **#2451 "Open in read-only by default"** (**12 plus-ones**): "For
  exisisting md files, most of the time people would open them for reading and
  searching for information, not to edit them. Open in read-only mode helps
  prevent accidental change to the content."
- **Source:** https://github.com/marktext/marktext/issues/3652 ,
  https://github.com/marktext/marktext/issues/3688 ,
  https://github.com/marktext/marktext/issues/2451 , counts from the search API
  call above, all opened 2026-09-18
- **Who ships it today:** Obsidian reloads on external change and is the usual
  recommendation for this workflow. VS Code reloads. Typora reloads but is known
  to fight with the editing cursor. Three separate MarkText issues over four
  years say a popular WYSIWYG still does not.
- **Nobody ships:** a reload that is *safe while you are typing*. Everyone
  either clobbers the buffer or asks a modal question. Nobody treats the external
  write as a proposed change you accept or reject.
- **The problem it solves for us:** in 2026 the second writer is not Vim, it is
  an agent. These three issues are the pre-agentic version of the exact problem
  the change queue exists for, and they prove people already live this way and
  already know it is broken.
- **Fit:** the file watcher feeds the change queue rather than the buffer. An
  outside write becomes a queued change with an author of "on disk" and a diff,
  and the cursor never moves until it is accepted. A read-only mode falls out for
  free: it is the queue with accept disabled.
- **Effort:** small to medium. The watcher is small; routing it through the queue
  instead of the buffer is the week.
- **Verdict:** must-have. Not because of these fourteen votes, but because it is
  the same mechanism the agent case needs and it earns a second audience for one
  build.

---
## Question 3: suggesting mode. The long answer, because this one matters.

### FD3. Five people independently built a CriticMarkup suggesting mode for Obsidian in the last five months of 2026, and all five are tiny

- **Demand:** this is the strongest signal in the lens and it is not a vote
  count, it is a build count. Obsidian's public plugin registry holds **7,739
  plugins**, with download stats for **7,706** of them. Filtering the registry
  for suggestion and tracked-change review returns a cluster that did not exist
  a year ago. Descriptions copied verbatim from the registry JSON, downloads
  copied from the stats JSON:

  | Plugin id | Downloads | Repo created | Description, copied from the registry |
  |---|---|---|---|
  | `track-changes` | **1,768** | 2026-05-12 | "Review CriticMarkup suggestions in a side panel. Accept, reject, or reply." |
  | `redline` | **834** | 2026-05-18 | "Add PR-style review comments anchored to specific paragraphs, headings, images, code blocks, and tables. Comments live in a sibling .review.md sidecar so the source document stays clean." |
  | `review-comments` | **763** | 2026-05-14 | "Notion-style review comments stored as CriticMarkup. AI-friendly format for LLM-assisted editing." |
  | `review-critic` | **735** | 2026-04-17 | "Review and CriticMarkup-style comments for markdown notes." |
  | `live-coedit` | **101** | 2026-07-07 | "Co-edit notes live with an AI collaborator: it proposes edits, you review them as track changes and approve, reject, or pick per change. Includes chat, comments, per-word attribution, and snapshots." |
  | `review-comments-ai` | **97** | 2026-07-07 (pushed 2026-07-13) | "Review comments built to work with your AI coding assistant: threads live in the note as CriticMarkup, so Claude Code or a local agent reads the discussion, edits the text and replies in place." |

  Every repository in that table was created between **2026-04-17 and
  2026-07-07**. Five separate authors, none of whom appear to know about the
  others, all reaching for the same syntax in the same five months, three of them
  naming AI in the description and one naming Claude Code by name.

  For scale: the top plugin in the same registry, Excalidraw, has **8,021,467
  downloads**; Templater 5,620,218; Dataview 4,980,548; Git 3,152,557. Two AI
  plugins are in the top fifteen, Claudian at **2,135,277** and Copilot at
  **1,941,912**. So the audience is there and it is already AI-shaped. The
  suggesting-mode cluster peaks at 1,768. The demand is proven and the supply is
  failing.
- **Source:** https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json
  and https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json ,
  both opened 2026-09-18 (590,037 and 514,100 bytes);
  repo dates from https://api.github.com/search/repositories?q=user:rohrbachd+user:shotashirai1719+user:nicolasassi+user:kebl3541+user:mikegafert+user:Fevol&per_page=100
  opened 2026-09-18
- **Honest caveat so this is not overstated:** four of the six carry the
  registry's "This plugin has not been manually reviewed by Obsidian staff"
  suffix, but so do **5,148 of 7,739 plugins, 66.5 per cent**, so that marker
  means nothing about these six in particular. It is stated here only so the
  table above is not read as a quality signal.
- **Who ships it today:** in the plain-markdown world, effectively nobody at
  scale. Google Docs has Suggesting mode, Microsoft Word has Track Changes,
  Notion has suggested edits, and none of them writes a markdown file. See FD4
  for the one serious prior attempt.
- **Verdict:** must-have, and the single highest-conviction item in this lens.

---

### FD4. The serious prior attempt is Commentator, and after three years it is still not in the plugin store

- **Demand:** Fevol's Commentator is the reference implementation and its
  announcement thread is the most-read thing on this topic in the Obsidian
  forum: **14,535 views, 34 posts, 75 likes on the topic and 36 on the opening
  post**, posted 2023-08-30. The author's own framing, copied exactly: "For the
  past two years, I've been working on a plugin called 'Commentator', which aims
  to recreate Word's/Google Docs' suggestion and comment modi within Obsidian,
  using the common CriticMarkup syntax."
  The feature list in that post, copied exactly, is very close to a
  specification of what we would build: "A WYSIWYG suggestion mode tracking new
  additions/deletions", "Preview all suggestions being accepted/rejected", "An
  annotation panel showing all suggestions and comments", "Comment threads and
  replies", "Vault wide comments & suggestions view with search and filters for
  location and type", "Metadata on authorship, date, ...". The roadmap in the
  same post names "Improved collaborative workflows for shared vaults (comments
  linked to author, ...)" and "Generating automatic diffs with previous versions
  of your notes".
  The reception, copied exactly: "That is stunning!! I don't need the plugin
  itself, but you can bet I'll be going through your code trying to figure out
  how you did some of that. Well done, it looks amazing." And: "Since the topic
  came up in the forum and on Discord I was eagerly waiting for talented guys to
  develop this type of solution. Hats off to you!"
- **Source:** https://forum.obsidian.md/t/beta-plugin-commentator-suggestions-and-comments-with-criticmarkup/66013
  opened 2026-09-18; https://api.github.com/repos/Fevol/obsidian-criticmarkup opened 2026-09-18
- **The receipt that matters:** the repo `Fevol/obsidian-criticmarkup` was
  created **2023-02-20**, was last pushed **2026-08-07**, and has **255 stars,
  16 forks, 22 open issues**. It is still a **beta** plugin. Checking the
  registry directly: there is **no `commentator` entry and no Fevol
  CriticMarkup entry** in `community-plugins.json`; the only Fevol plugin in the
  store is `translate`. So the best suggesting mode anyone has built for
  markdown, after three and a half years of work by one person, still cannot be
  installed without a third-party beta installer, and therefore has no download
  number at all.
- **Nobody ships:** a suggesting mode that a normal person can turn on without
  installing a beta channel. The idea has been validated, admired and left
  unshipped.
- **The problem it solves for us:** it tells us the hard part is not the idea
  and not the syntax, it is being a product rather than a plugin. A plugin
  cannot own the editor's edit path, so it fights the host for every keystroke.
  We own the edit path. This is the classic case where the thing that is
  impossible as an extension is natural as the application.
- **Fit:** direct. Our change queue already accepts or rejects one change at a
  time. A suggesting mode is the same queue with the proposer being a person
  rather than an agent, and the accept action being a splice.
- **Effort:** medium for the core, large for the full Commentator feature list.
  The queue, the splice engine and the diff exist. The new parts are the
  suggestion overlay in the editor, the annotation panel and threads.
- **Verdict:** must-have. This is the one place where we can be the first
  shipped answer to a question five people asked this year.

---
### FD5. CriticMarkup is the syntax everyone reaches for, its own website is a parked domain, and I measured it breaking other readers

- **Demand:** CriticMarkup is the default answer in every one of these threads.
  The Obsidian feature request **"Support Critic markup"** (topic 18485, opened
  2021-05-19) has **81 likes on the topic, 36 on the opening post, 5,688 views,
  15 posts**, and is tagged `valuable` by the moderators. It is still in the live
  Feature requests category, not the archive, five years on.
  The most-liked reply, 19 likes, argues the interoperability case and is worth
  copying in full because it is also an argument against us inventing anything:
  "Due to its flexibility, Obsidian already suffers from the fact that too many
  new 'language elements' are introduced without thinking too much about the
  side effects. This makes it increasingly less compatible, and we start to
  build a locked-in platform-again." (an em dash in the original is written here
  as a hyphen, per house style.) The same reply continues: "I still think
  'critic markup' might find its use cases, but there is already a version out
  there, so why not adopt its syntax? And maybe make it a plugin (be it core or
  community), so users can make their own informed choice?"
  A reply with 8 likes adds the accept/reject ask directly: "Critic Markup
  support would be nice for us writers! (Maybe even with an 'Accept/Reject'
  feature? From the toolkit they offer, it should be easily adaptable, I think
  ...)"
- **Source:** https://forum.obsidian.md/t/support-critic-markup/18485 opened 2026-09-18
- **The syntax, copied from the toolkit README:** five marks. Addition
  `{++ ++}`, Deletion `{-- --}`, Substitution `{~~ ~> ~~}`, Comment `{>> <<}`,
  Highlight `{== ==}{>> <<}`. Its stated First Law: "Critic Markup shall be
  human readable. A human with a simple text editor can easily read and
  comprehend any text containing Critic Markup." Its Third Law: "Critic Markup
  shall be compatible with existing markup syntax for Markdown, MultiMarkdown
  and HTML except where it conflicts with rules one or two."
  Source: https://raw.githubusercontent.com/CriticMarkup/CriticMarkup-toolkit/master/README.md
  opened 2026-09-18, 3,767 bytes.
- **The state of the standard, and this is the part nobody in those threads
  knows:** `http://criticmarkup.com/` **302-redirects to the GitHub repo**
  (`curl -sL -o /dev/null -w '%{url_effective}'` returned
  `https://github.com/CriticMarkup/CriticMarkup-toolkit`, one redirect). The
  canonical spec URL that the Obsidian thread links to,
  `http://criticmarkup.com/spec.php`, returns **HTTP 200 with a domain-parking
  page**: "criticmarkup.com is a totally awesome idea still being worked on.
  Check back later." with a footer reading "Copyright (c) 2026 Hover". The
  repository `CriticMarkup/CriticMarkup-toolkit` has **848 stars, 60 forks, 25
  open issues**, was created **2013-01-10** and was **last pushed 2021-03-04**.
  Five years without a commit, and the spec site is a registrar holding page.
  Opened 2026-09-18.
- **I measured whether it breaks other readers, rather than assuming.** Three
  independent CommonMark implementations already in this repo's `node_modules`:
  marked 16.4.2, markdown-it 15.0.0, commonmark 0.31.2.

  | Input | marked | markdown-it | commonmark |
  |---|---|---|---|
  | `The quick{++ brown++} fox.` | raw markup visible | raw markup visible | raw markup visible |
  | `The quick {--brown --}fox.` | raw markup visible | raw markup visible | raw markup visible |
  | `The {~~quick~>slow~~} fox.` | **`{<del>quick~&gt;slow</del>}`** | **`{<s>quick~&gt;slow</s>}`** | raw markup visible |
  | `The quick fox.{>>is it brown?<<}` | visible as escaped text | visible as escaped text | visible as escaped text |
  | `The {==quick==}{>>too fast<<} fox.` | raw markup visible | raw markup visible | raw markup visible |
  | `The quick %%secret%% fox.` (Obsidian) | `%%secret%%` visible | `%%secret%%` visible | `%%secret%%` visible |
  | `The quick <!--secret--> fox.` | passes through as a real HTML comment, invisible | **`&lt;!--secret--&gt;`, the "hidden" comment is printed to the reader** | passes through, invisible |

  Two results are worth stating plainly.
  **One: the substitution mark collides with GFM strikethrough and is silently
  destroyed.** `{~~quick~>slow~~}` comes out of marked as
  `<p>The {<del>quick~&gt;slow</del>} fox.</p>`. The reader does not see a
  proposed edit; they see struck-through text reading `quick~>slow` wrapped in
  two stray curly braces. It is worse over multiple lines: `{~~old\nline~>new\nline~~}`
  becomes one `<del>` spanning both. That directly falsifies CriticMarkup's own
  Third Law, on the two most widely deployed markdown renderers in the world.
  **Two: HTML comments are not a safe hiding place either.** markdown-it's
  default configuration has `html: false`, and in that configuration the comment
  body is escaped and **printed to the reader**. With `html: true` it passes
  through invisibly. So whether your private editorial note is published to the
  world depends on one boolean in somebody else's static site generator.
  Commands and versions are in this file's method note; the test was run against
  the installed libraries, not from memory.
- **Who ships it today:** MultiMarkdown Composer has it built in, per the
  Obsidian thread. Pandoc reads and writes tracked changes for `docx` via
  `--track-changes`, and `pandiff` emits CriticMarkup. Six small Obsidian
  plugins, per FD3. No mainstream editor.
- **Nobody ships:** a suggestion carrier that is invisible to readers who do not
  understand it. Every plain-text option leaks, and one of them corrupts.
- **The problem it solves for us:** it tells us which syntax to speak, and it
  warns us not to trust it as the storage format. Reading and writing
  CriticMarkup is how we interoperate with the six plugins above and with
  pandiff. Storing the truth in it is how we inherit a five-year-dead spec and a
  strikethrough collision.
- **Fit:** as an import and export format, excellent, and cheap. As the
  on-disk representation of a pending suggestion, no. Our change queue can hold
  the proposal outside the file, splice on accept, and offer "export as
  CriticMarkup" for anyone who needs to hand the file to Commentator, pandiff or
  a colleague.
- **Effort:** small. Five regular expressions in, five out, plus the collision
  test above as a fixture.
- **Verdict:** good-to-have, with a hard line: speak it, do not store in it.
  And the collision finding is publishable on its own.

---

### FD6. iA Writer already built the byte-range-plus-hash annotation model we use, aimed it at AI authorship, and asked people not to copy it

- **Demand:** the Obsidian feature request **"Support Markdown Annotations a la
  iA Writer 7"** (topic 72232, opened 2023-11-30) has **65 likes on the topic,
  28 on the opening post, 3,417 views and 38 posts**. The ask, copied exactly:
  "Alongside their release of iA Writer 7, the developers make an argument for
  clearly delineating pasted text (in this case, ChatGPT output) from original
  text via an open source format they're calling Markdown Annotations, which
  greys out the pasted text and allows the user to indicate (via contextual
  menu) its source."
  The replies are the collaboration case, not just the AI case. With 8 likes:
  "+1 from me. This would greatly help with collaborative writing as well as the
  AI stuff. Although Obsidian is my primary notetaking app, I frequently write
  long form in IA Writer because of the focus and excellent UX. interoperability
  would be great. Also, Obsidian has a big audience now and this would help
  establish the standard." With 3 likes: "I would love to have something
  explicitly for indicating material that came from somewhere else... but I love
  the idea of something that explicitly marks text as coming from another
  source, and identifies that source."
  Obsidian has not shipped it in the two years and ten months since.
- **Source:** https://forum.obsidian.md/t/support-markdown-annotations-a-la-ia-writer-7/72232
  opened 2026-09-18; spec at
  https://raw.githubusercontent.com/iainc/Markdown-Annotations/master/README.md
  opened 2026-09-18 (2,634 bytes, `Version: 0.2`);
  https://ia.net/topics/ia-writer-7 opened 2026-09-18
- **The spec, and why it should stop us in our tracks.** A Markdown Annotations
  file is "a text, followed by an annotation block, followed by the end of file."
  The block opens with `---` and closes with `...`. It must begin with a hash
  annotation: "a character range, followed by one or more spaces", then
  "the name of the hashing algorithm which must be `SHA-256`", then a hash of
  the UTF-8 data in that range. Author keys are `@` for human contributions,
  `&` for AI-generated text, `*` for reference material, and their values are
  lists of `location,length` ranges. The spec insists: "Character ranges must
  always refer to grapheme cluster indexes in text to ensure that annotations
  remain valid regardless of environment or file encoding."
  The error handling is our refusal rule, written by someone else: "When the
  hash annotation is omitted or invalid, tools that support annotations should
  warn users that annotations may be misplaced, and allow users to review
  annotations. Users must choose to discard or keep the annotations before
  continuing editing the file."
  That is a byte-range splice model with a content hash that refuses when stale.
  It is our engine, applied to authorship instead of editing.
- **Their reason for not putting the marks inline, copied exactly, because it is
  the argument we would otherwise have to discover ourselves:** "We experimented
  with authorship markup directly in text. The markup always got in the way when
  editing because every other word can have a different author. And the markup
  made the text difficult to read. We store authorship as a separate block at
  the end of a file. This keeps texts easy to read and share, but requires a
  tool to update and show authorship. We think it's the right tradeoff."
- **I measured what that end block does to a reader who does not know it.**
  Same three parsers.
  - With a blank line before `---`, all three render `<hr>` followed by a
    visible paragraph containing `Annotations: 0,95 SHA-256 1132bf...`,
    `@Human: 0,20 33,4`, `&AI: 20,13 37,8`, `...`. Ugly but harmless.
  - **Without a blank line, all three turn the last line of the document into a
    setext `<h2>` heading.** Input `Some prose here.\n---\nAnnotations: ...`
    produced `<h2>Some prose here.</h2>` in marked, markdown-it and commonmark
    alike. The spec anticipates exactly this and says the blank line "prevents
    tools that are not aware of annotations from rendering the last line of the
    file as a heading". Verified, all three, this session.
- **The licence position, recorded verbatim because it is load-bearing and
  because I am treating the page as data, not as instruction:** "While the
  format is open, avoid cloning our work. Draw inspiration from what we made.
  Change it. Improve it. Design it yourself. Work on it until it is
  substantially better. If you can't beat our design, then let it be and do
  something else." The repo `iainc/Markdown-Annotations` has **124 stars, 3
  forks, 5 open issues**, was created **2023-11-30** and **last pushed
  2025-11-05**.
- **Who ships it today:** iA Writer only. iA Writer is a paid app; the spec is
  open at v0.2 and has drawn 124 stars and three forks in nearly three years,
  which is the receipt for "admired, not adopted".
- **Nobody ships:** human-versus-AI authorship marking anywhere except one
  paid writing app on Apple platforms, despite a named open spec and a
  three-year-old request against the largest markdown audience there is.
- **The problem it solves for us:** in 2026 the honest question about a document
  is not what changed, it is **who wrote which words**. We already record that
  in the version record when a change is accepted. This spec is the portable
  projection of it: the file can carry its own authorship map without a database,
  and any other tool can read it.
- **Fit:** very good, with one correction. We should not write a trailing block
  into a file that a user did not ask for, because that violates our own
  premise. It belongs as an **export** and an **import**: read the block when it
  is there, offer to write it when the user wants portable authorship, never by
  default. Our splice engine already speaks in ranges, and their hash rule is
  our ambiguity refusal.
- **Effort:** medium. The parser is small. Keeping the ranges correct across
  splices is the real work, and it is work our engine already does.
- **Verdict:** good-to-have, and strategically important. Also note the licence
  sentence above before anyone builds it; the right move is to read and write
  their format for interoperability and to make our own internal model better,
  which is precisely what they asked for.

---
## Question 5: editing the same file from two places

### FD7. Someone asked for our change queue in March 2021, by name, and it is still open

- **Demand:** Obsidian feature request **"Editor: Add a toggle to disable
  automatic merging of changes (non-obsidian sync)"**, topic 14874, opened
  2021-03-18. **12,360 views, 73 posts, 83 likes on the topic and 39 on the
  opening post.** Last activity 2025-08-22, still in the live Feature requests
  category.
  The opening post, copied exactly: "Is there any way to alter this behavior so
  Obsidian does not auto-merge them? I want to disable this (IMO) dangerous
  behavior." The author then quotes Obsidian's own 0.11.6 release notes, copied
  exactly as it appears in the thread: "When a change is made to a note on disk,
  but you also have changes in Obsidian that hasn't been auto-saved (within 2
  seconds), the two versions will now be merged automatically."
  The third post proposes the design. It is our change queue, written by a user
  five and a half years ago, copied exactly:
  "Merge Changes: Automatically / User Confirmation Required (Perhaps with the
  ability to review changes before confirming.) / Never"
  And the reason it matters, copied exactly from the fifth post: "I am now again
  fearful of losing information that I'm putting into Obsidian. I have backups
  but it's not enough, even losing 1-2 hours of work/research is really not
  nice."
- **Source:** https://forum.obsidian.md/t/editor-add-a-toggle-to-disable-automatic-merging-of-changes-non-obsidian-sync/14874 opened 2026-09-18
- **The neighbouring evidence, from a forum search on the same day:** topic
  14943 "Obsidian Sync: Add a notification warning when Sync Merge with
  conflicts happens" (feature request, 9 replies); topic 94468 "Option to let
  user manually resolve sync conflicts" (in the **Feature archive**, meaning
  declined or superseded); topic 94732 "Obsidian Sync incorrectly duplicates
  sections of files" (**bug report, 55 replies**); topic 85214 "Obsidian Sync on
  iPhone Overwrites Newer Data, Causing Data Loss" (bug report, 31 replies);
  topic 65655 "Obsidian sync rewrites note without merging"; topic 33007
  "Obsidian Sync: updates from one device overwritten by another". Titles copied
  from the search API response, https://forum.obsidian.md/search.json?q=sync+conflict+data+loss
  opened 2026-09-18.
  And the same wound in a second product: SilverBullet issue **#1040 "Page
  Changed Elsewhere, Reloading Error & Data Loss"** (5 plus-ones, 9 comments),
  from the reactions sweep of `silverbulletmd/silverbullet` opened 2026-09-18.
  MarkText **#3688** in FD2 is the same person, before sync was even involved.
- **Who ships it today:** nobody offers "user confirmation required" as a merge
  policy. Obsidian auto-merges after a two-second window. Dropbox makes a
  conflicted copy, which a user in the thread prefers to what Obsidian does.
  Git refuses and leaves markers, which is correct but unreadable inside an
  editor. VS Code asks a modal question and throws away the loser.
- **Nobody ships:** a third option between silent merge and a conflict file:
  hold the outside change, show it as a reviewable diff, let the person take it
  line by line.
- **The problem it solves for us:** this is the change queue, and here is a
  five-year-old request for it with a vote count, from before agents existed.
  It means the queue is not a bet on the agentic era; it is an overdue fix that
  the agentic era makes urgent. When the second writer is a coding agent editing
  `AGENTS.md` while you have the file open, "merged automatically after two
  seconds" stops being a nuisance and becomes a correctness failure.
- **Fit:** it is what we already decided to build. What this finding adds is the
  **naming**: "no silent merge, ever" is the phrase these 12,360 readers have
  been waiting for, and the third merge policy should be spelled out in the
  settings the way the user in post three spelled it out.
- **Effort:** none beyond the plan. Days for the settings surface.
- **Verdict:** must-have, already planned. Use it as proof, not as a new build.

---

### FD8. Auto-save is the most-liked complaint I found anywhere, and the ask is a save model, not a toggle

- **Demand:** Obsidian feature request **"Disable auto-save or change
  frequency"**, topic 14230, opened 2021-03-08. **28,157 views, 134 posts, 459
  likes on the topic, 69 on the opening post**, and **still being posted in on
  2026-07-31**, five years and four months later. By topic likes this is the
  largest single thread I opened in this lens.
  The opening argument, copied exactly: "Paradoxically the auto-save feature is
  something that makes it much more likely to lose data than not having
  auto-save. I'm always anxious when I move text between files, thinking 'let's
  just hope the app won't crash now'. After using Obsidian for 2 months, I
  finally lost a note to this. Instead of hitting Ctrl+X, I hit X, didn't
  notice, moved to a new document and I couldn't paste the data. I go back to
  the previous file, there's an 'x' in place of the notes, it was auto-saved and
  there's no undo."
  Later, with 4 likes, the developer's version of the argument, copied exactly:
  "As a developer, I'm used to the code editor not auto-saving files (it would
  be terrible if it did). There's a very clear indicator of whether the file is
  saved or not."
  A reply with 6 likes adds a reason nobody in a product meeting would think of:
  "auto-save creates unnecessary disk write (worn SSD) and network traffic (I
  sync the vault with cloud storage)".
  And, with 2 likes, on the silence: "I wonder if there is any official
  indication whether disabling autosave and/or setting autosave frequency might
  be implemented in the future (however long it takes to work out), or the 2s
  autosave is a conscious and final design decision. There's enough threads about
  it in the FR forum already, but I don't think I've ever seen a response from
  the devs."
- **Source:** https://forum.obsidian.md/t/disable-auto-save-or-change-frequency/14230 opened 2026-09-18
- **Who ships it today:** code editors do. VS Code ships `files.autoSave` with
  `off`, `afterDelay`, `onFocusChange` and `onWindowChange`, and a dirty-dot
  indicator. Note apps almost universally do not, and MarkText's #1354 in FD1
  names the combination as the danger: an editor that reformats plus autosave
  equals "disastrous results".
- **Nobody ships:** in the markdown-notes category, a visible dirty state and a
  user-controlled commit point.
- **The problem it solves for us:** every argument in that thread is an argument
  about **when a change becomes real**, which is the same question the change
  queue answers. The correct reading is not "add a toggle". It is that people
  want a moment where they decide, and they want to see, before that moment,
  what is about to be written. We already have the mechanism.
- **Fit:** natural, and it composes with FD1. A dirty indicator, a save point
  the user controls, and a pre-save view of exactly which bytes will change.
  The last one is the part nobody has, and it is nearly free once splice-only
  writing exists, because we already know the byte range.
- **Effort:** small. The indicator and the save policy are days. The byte-level
  pre-save preview is already computable.
- **Verdict:** good-to-have, and disproportionately cheap. 459 likes for a
  setting we can ship in a week, on top of machinery we already built.

---
### FD9. Open any markdown file anywhere, with no vault, no import and no folder ceremony

- **Demand:** Obsidian feature request **"Have Obsidian be the handler of .md
  files / Add ability to use Obsidian as a markdown editor on files outside
  vault (file association)"**, topic 314, opened **2020-05-23**. **29,157 views,
  168 posts, 552 likes on the topic, 114 on the opening post**, and the last
  post is **2026-09-15**, three days before this research. Six years and four
  months of continuous asking. The opening post is one sentence: "A suggestion
  to have the possibility to make Obsidian the default app to open .md files,
  when accessing them in Finder."
  The neighbouring request is the biggest one on the whole forum by readership:
  **"Obsidian for web"**, topic 2049, opened 2020-06-17, **257,898 views, 247
  posts, 949 likes on the topic, 273 on the opening post**, last activity
  2026-09-04.
  The mobile version of the same complaint is **"Full File System Access For
  The iOS App (Open Existing Vault/Folder)"**, topic 28266, opened 2021-12-08,
  **35,540 views, 81 posts, 157 likes on the topic, 70 on the opening post**,
  last activity 2026-08-29. From the opening post: "On iOS the only place where
  I can store my Vault is the 'Obsidian' folder... My use case: I want to be
  able to freely interact with the Obsidian markdown files from other apps."
  And the willingness to pay, copied exactly, 14 likes: "This is my most desired
  feature and I would pay for it as an in-app purchase if needed."
- **Source:** https://forum.obsidian.md/t/have-obsidian-be-the-handler-of-md-files-add-ability-to-use-obsidian-as-a-markdown-editor-on-files-outside-vault-file-association/314 ,
  https://forum.obsidian.md/t/obsidian-for-web/2049 ,
  https://forum.obsidian.md/t/full-file-system-access-for-the-ios-app-open-existing-vault-folder/28266 ,
  all opened 2026-09-18
- **Who ships it today:** Typora, MarkText and every code editor open a loose
  file. The whole notes category, Obsidian, Logseq, Joplin, Trilium and AFFiNE,
  makes you adopt a vault, a graph or a database first.
- **Nobody ships:** a document-grade editing surface, with review and history,
  over a single loose file that lives in somebody else's repository.
- **The problem it solves for us:** in the agentic era the file you want to look
  at is almost never in your notes app. It is `AGENTS.md` in a client repo, a
  `spec.md` an agent just wrote, a `README` in a checkout. A vault is a tax on
  exactly the file that matters most. We already hold the right premise, that
  the file on disk is the only source of truth, so we should make sure the front
  door matches it: open one file, from anywhere, and be useful immediately.
- **Fit:** it is the premise stated as an entry point. INFERENCE: the web
  surface can do this today through the File System Access API on Chromium and
  through drag-and-drop everywhere else, and the desktop build can register as a
  `.md` handler; I have not checked the current code for either.
- **Effort:** small on desktop (file association plus open-single-file).
  Medium on web (a permission-granting picker and a re-grant flow). The iOS
  document-picker route is medium and is the same work as FD10.
- **Verdict:** good-to-have, bordering on must-have for positioning. 552 likes
  over six years for a thing our architecture gives us almost free.

---

## Question 6: mobile

### FD10. Mobile markdown is a second-class citizen and the complaints are structural, not cosmetic

- **Demand:** the mobile requests that reach the top of the Obsidian feature
  board are not about features, they are about the phone's own rules. Counts
  read from the all-time top listing at
  https://forum.obsidian.md/c/feature-requests/8/l/top.json?period=all ,
  opened 2026-09-18, where the sortable field is likes on the opening post:
  - **"Make Obsidian Sync work in background (on Mobile)"**, topic 25906:
    **108 opening-post likes, 67 replies, 16,550 views.**
  - **"Mobile PDF Export"**, topic 15753: **100 opening-post likes, 17 replies,
    23,897 views.**
  - **"Full File System Access For The iOS App"**, topic 28266: **70
    opening-post likes**, see FD9.
  - **"Android: Add a camera tool in the toolbar to quickly add images using the
    phone camera"**, topic 30351: 24 replies, 12,894 views.
  - **"[Mobile] Make Sync icon always visible"**, topic 31780: 43 replies.
  - **"Split Down & Split right command for Obsidian Mobile on phone"**, topic
    45865: 17 replies.
  - **"Preserve heading/indent foldings on desktop after file is edited on
    mobile, and vice versa"**, topic 34998.
  For comparison, the same board's number one all-time request has 386
  opening-post likes, so 108 and 100 are genuinely high, not noise.
  The other kind of mobile complaint is memory. Obsidian's developer forum
  carries **"Enable largeHeap in Obsidian Android app to avoid OOMs"**, topic
  108119, opened 2025-11-18: "On many Android devices the heap size allocated to
  an app is too small, and out-of-memory (OOM) errors can occur when processing
  large files. In the worst case (for example, if heavy work is scheduled after
  onLayoutReady), the app can enter a crash loop. When that happens users must
  either reinstall the app or perform a cumbersome workaround such as shifting
  the device time in the background to make the brief Safe Mode button appear
  and then tap it." The thread cites logcat output, "Throwing OutOfMemoryError",
  and links crash reports in three separate plugins.
  AFFiNE's tracker has the raw-editing version of the same story: **#13447
  "[Bug]: Deleting text on Android causes text to duplicate."** (11 plus-ones,
  19 comments) and **#13927 "[Bug]: Cannot type normal text in Android app"**
  (10 plus-ones, 15 comments), both in the top twenty by reactions. Joplin has
  **#3872 "background sync on mobile devices"** (21 plus-ones, 26 comments),
  **#2287 "View starts at top, Edit at bottom [Android]"** (12 plus-ones, 30
  comments) and **#2389 "No way to search from inside a note on Android"** (7
  plus-ones, 23 comments).
- **Source:** the top listing above;
  https://forum.obsidian.md/t/enable-largeheap-in-obsidian-android-app-to-avoid-ooms/108119 ;
  and the GitHub reactions sweeps of `toeverything/AFFiNE` and `laurent22/joplin`,
  all opened 2026-09-18
- **Who ships it today:** everyone has a phone app; nobody has a phone app that
  people describe as finished. The two recurring structural gaps are background
  sync and access to files outside the app's own sandbox.
- **Nobody ships:** text input on Android that is simply correct. Two of
  AFFiNE's top twenty issues are that typing and deleting are broken, which is
  an editor failing at being an editor.
- **The problem it solves for us:** our mobile surface does not have to win on
  features. It has to be the one that does not lose your text, does not run out
  of heap on a big file, and can open a file that lives somewhere else. That is
  a low bar that the incumbents are measurably not clearing.
- **Fit:** good, and it argues for a specific discipline. A phone build that
  projects a byte range rather than holding a parsed tree of the whole document
  is exactly the architecture that survives a 512 MB heap. Our splice model is
  the memory story, not just the correctness story.
- **Effort:** medium to large, and mostly it is a decision about what NOT to
  load on a phone.
- **Verdict:** good-to-have. Not a new feature so much as a constraint to hold
  while building the phone surface we already planned. INFERENCE: the
  window-at-a-time reading of a large file is the single most valuable mobile
  decision available to us.

---

## Question 7: performance, with the numbers people actually quote

### FD11. Nobody can tell you when a markdown tool breaks, and the honest answer is that it depends on plugins, not size

- **Demand:** people ask this constantly and get contradictory answers with real
  numbers attached. From **"Performance on large vaults"**, topic 114864, opened
  **2026-06-01**, 859 views, 14 posts:
  - The complaint: "I have a fairly large vault (or at least I think it's failry
    large) with almost 1000 notes (993 to be exact)... Lately I started noticing
    huge performace issues".
  - A moderator's reply, copied exactly: "I would not call this a large vault."
  - The same user's own two startup traces, pasted into the thread, from the
    same machine and the same Obsidian 1.12.7 on Windows 11 Pro 10.0.26200:
    **"Total startup time: 2,016ms"** with "Vault (999 files): 233ms", and on
    another day **"Total startup time: 10,317ms"** with "Vault (1,009 files):
    3,806ms" and "Community plugins (8 active): 4,247ms". A five-fold swing on
    ten extra files, with plugins costing more than the vault.
  - Another user's counter-example: "I have over 23,000 journals alone, not
    including all the PDFs, images, and none-journal notes, and things generally
    work well. Dataview is defintely one to look out for, you can do some stuff
    with it that will bring Obsidian to it's knees".
  - And a hardware data point: "I'm using a standard Mac mini M4 (16GB). My main
    Obsidian vault is 75GB and contains 7,000 files and a few thousand photos,
    screenshots, audio files and videos. No slowdowns. But I don't have a theme
    and only have 4 plugins".
- **Source:** https://forum.obsidian.md/t/performance-on-large-vaults/114864 opened 2026-09-18
- **More numbers, all opened 2026-09-18:**
  - **"Testing Obsidian's Limits: Performance Advice Needed for 10 Years of
    Instagram Data"**, topic 116296, opened 2026-07-20. The corpus: "1,842 posts
    and 7,487 media files have already been output", with "Tens of thousands" of
    auto-generated wiki-links. The failure, copied exactly: "When importing
    around 300 notes, the migration process runs safely and successfully.
    However, once we exceed 700 notes, we start encountering errors." Their
    workaround is six-month batches to keep every import under 300 files.
    Note what this person is: "I am a non-engineer, trying to develop a system
    with the help of AI to migrate my 10 years of Instagram history". An agent
    generated the corpus and the editor could not swallow it.
  - A reply in the same thread on the ceiling: "10,000 notes is big, but I
    wouldn't call it massive by Obsidian standards. With media files you're up
    to ~20,000 files, which is for sure on the big side", and then the known
    limit: "An older version of Obsidian was shown to handle 100,000 notes
    pretty well (once indexed) aside from the graph, which crashes."
  - **"Can Obsidian handle 100's of thousands of notes?"**, topic 112785, opened
    2026-03-28. The most useful answer, copied exactly: "Anything involving
    moving or renaming folders with hundreds or thousands of notes in them will
    lock up Obsidian for several minutes." The same reply describes a rename
    being interpreted as a delete-and-recreate that re-uploads the whole folder.
  - Android memory, topic 108119 in FD10: OOM crash loops on large files, with
    "Throwing OutOfMemoryError" in the pasted log.
  - Outline's tracker carries the document-level version: **#12589 "Sidebar
    large document tree scrolling lags"** and **#10697 "Auto flatten large
    documents"**, both open, both low-vote, from the reactions sweep of
    `outline/outline`.
- **Who ships it today:** nobody publishes a number. Every answer in every
  thread is anecdote plus hardware plus a plugin list.
- **Nobody ships:** a stated, testable performance contract. Not one of these
  tools says "this is the file size we open without degrading, here is how we
  measured it, here is the machine".
- **The problem it solves for us:** the honest finding is that **file count is
  not the limit; what the tool does per file is the limit**. Plugins outweigh
  the vault in the one trace above. That is good news for a byte-exact editor
  that parses lazily, and it means our story should be about the **single large
  file** and the **single large import**, which is where agents actually hurt.
  Two concrete agentic failure shapes appear in this evidence: a bulk import of
  agent-generated notes failing above 700 files, and a rename or move across a
  large folder locking the app for minutes.
- **Fit:** directly. Publish a measured number for the two operations that
  matter, opening one large markdown file and accepting a large queued change,
  on named hardware, and re-run it in CI. That is a claim nobody else in this
  category can make, and it is cheap because the corpus gate already exists in
  this repo.
- **Effort:** small for a benchmark and a published number; medium if the
  measurement forces engine work.
- **Verdict:** good-to-have, and it is a **marketing asset disguised as an
  engineering task**. UNVERIFIED: I did not find any tool in this sweep
  publishing a performance contract, but I did not exhaustively check every
  vendor's documentation, so treat "nobody publishes a number" as strongly
  indicated rather than proven.

---
## Back to the cross-tool themes

### FD12. A real read-only mode, asked for in four separate trackers, and nobody has shipped a good one

- **Demand:** this theme turned up independently in four products, which is why
  it is here rather than in the long tail.
  - Typora **#710 "may i read-only the markdown article?"**: **62 plus-one
    reactions, 47 comments**, opened **2017-05-18**, last updated **2026-06-23**.
    Nine years open and still being commented on this year. The ask, copied
    exactly, typos and all: "when i read some article that is myself or
    everybody. i don't want to change anything i don't want to change.
    read-only state just like static web page. it don't changed."
  - MarkText **#2451 "Open in read-only by default"** (12 plus-ones) and
    **#3688 "Locked/View only mode"** (12 plus-ones, 7 comments), quoted in FD2.
  - SilverBullet **#994 "Toggle Edit Mode - checkboxes, command palette,
    desktop"** (7 plus-ones, 8 comments).
  - Obsidian feature request **"Bases: Readonly Mode"**, topic 101202, 8
    replies.
  Combined, that is **93 plus-one reactions across three GitHub trackers** plus
  two forum threads, for a feature that is a single boolean in every one of
  these codebases.
- **Source:** https://github.com/typora/typora-issues/issues/710 ,
  https://github.com/marktext/marktext/issues/2451 ,
  https://github.com/marktext/marktext/issues/3688 , and the reactions sweeps
  of `silverbulletmd/silverbullet` and the Obsidian forum search, all opened
  2026-09-18
- **Who ships it today:** Obsidian has a per-vault Restricted mode for plugins,
  not a per-file read-only. VS Code can mark a file read-only. No markdown
  document editor ships an obvious per-document lock.
- **Nobody ships:** read-only as the **default** for a file you did not create,
  which is what MarkText #2451 actually asked for.
- **The problem it solves for us:** the reason this keeps being asked is the
  same reason FD1 and FD8 exist. People do not trust a WYSIWYG markdown editor
  not to touch their file, so they ask for a lock. Ours is the one editor that
  can say the lock is unnecessary, and then ship it anyway for the case that
  matters in 2026: a file an agent owns, or a file you are reviewing rather than
  writing.
- **Fit:** trivial. It is the change queue with accept disabled, exactly as in
  FD2, plus a per-file setting and a visible state.
- **Effort:** small. Days.
- **Verdict:** good-to-have. Cheap, asked for in four places, and it pairs with
  the review surface rather than sitting on its own.

---

### FD13. Drive the editor from the command line, because in 2026 the thing typing the command is an agent

- **Demand:** Typora **#1999 "[Summary] Advanced command line interface
  support"**: **100 plus-one reactions, 166 total reactions, 29 comments**,
  opened **2018-12-02**, last updated **2025-03-17**. It is a roll-up of five
  earlier issues, and the body is copied here in full because the list is short
  and specific:
  "Use command line to let Typora: Export file #715 / Open files in one window
  (multi-tabs) #979 / Create file if not exist #721 / Option for keep foreground
  (e.g: support edit git commit message) #649 / Option for showing/hiding views
  (like sidebar)"
  Alongside it, Typora **#3196 "[FEATURE REQUEST] Source control integration"**:
  **76 plus-ones, 28 comments**, opened 2020-01-23, **last updated 2026-08-13**.
  Copied exactly: "I am sure that many other people use Typora to generate md
  for git repos, wikis e.t.c is it possible to have integrated support for git
  repos so that we can have multiple users all the other useful tools that come
  with source integration".
  Zettlr **#1050 "feat: Integrate basic git functionality into Zettlr"**: **29
  plus-ones, 31 total reactions, 30 comments**. MarkText **#3616 "Adding Github
  Integration with MarkText"**: 10 plus-ones.
  And the receipt that outweighs all of those put together: the **Obsidian Git**
  community plugin has **3,152,557 downloads**, the **sixth most installed
  plugin** of 7,739, ahead of Calendar and Kanban. Its registry description,
  copied exactly: "Integrate Git version control with automatic backup and other
  advanced features."
- **Source:** https://github.com/typora/typora-issues/issues/1999 ,
  https://github.com/typora/typora-issues/issues/3196 ,
  the `Zettlr/Zettlr` and `marktext/marktext` reactions sweeps, and
  https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json ,
  all opened 2026-09-18
- **Who ships it today:** VS Code has `code <file>` and `code --wait`, and the
  `--wait` flag is what makes it a valid `$EDITOR` for git.
  **CORRECTION, made while writing this file:** I first wrote that no markdown
  editor has the equivalent and that Obsidian has only a URI scheme. That is
  wrong. **Obsidian ships a CLI**, documented at https://obsidian.md/help/cli
  (opened 2026-09-18; the page is rendered by JavaScript, so `curl` returned
  only the title "Obsidian CLI - Obsidian Help", which confirms it exists but
  not its full command list). Its commands include `obsidian property:set` and
  `obsidian move`, named in the bug reports quoted in FD18. The corrected
  position is in FD18, and it is a better finding than the one it replaces.
- **Nobody ships:** a markdown editor you can invoke from a script and **block
  on**, so an agent can hand a document to a human for review and wait for the
  verdict. UNVERIFIED: I could not read Obsidian's full CLI command list because
  the docs page needs JavaScript, so I cannot say whether it has a blocking
  mode; treat this row as unconfirmed rather than established.
- **The problem it solves for us:** this is the piece that makes the change
  queue reachable from an agent's world. Today the flow is: an agent writes a
  file, and later a human happens to notice. With a blocking command, the flow
  becomes: the agent proposes, opens the review surface, and waits for accept or
  reject before continuing. Typora's own list already names the git-commit-message
  case, seven years before anyone called it agentic.
  The plan already defers the MCP server and the public API to Later. INFERENCE:
  a command-line entry point is a much smaller thing than either, it needs no
  auth and no network, and it delivers most of the same value for a local
  coding agent.
- **Fit:** natural on desktop, where we already have a shell. `frontmatter
  <file>` opens it, `--wait` blocks until the queue is empty, and the exit code
  says accepted or rejected. It reads a file on disk and writes it by splice,
  which is exactly what we already do.
- **Effort:** small for open-and-wait; medium if it grows export and window
  control the way Typora's list does.
- **Verdict:** good-to-have, and the best-value item in this lens after
  suggesting mode. 100 reactions on the Typora issue plus 3.15 million installs
  of a git plugin say the audience is developers who live at a prompt, and it is
  a days-to-weeks build rather than the months that MCP and a public API imply.

---
### FD14. Change many files at once, and show me what it will do before it does it

- **Demand:** **"Global (Mass / Vault-wise) search & replace"**, Obsidian topic
  4395, opened **2020-08-15**. **48,201 views, 140 posts, 650 likes on the
  topic, 267 on the opening post**, last activity 2026-03-10. Six years.
  The use case, copied exactly: "I'd like to search and replace, but have 200+
  notes with [[documentation]] and there seems to be no bulk search & replace,
  only on a per-file basis."
  A moderator, 28 likes: "I think this is a key feature that seems core to a
  text editor."
  And the reply that is really the design brief, 3 likes: "General find and
  replace would be very handy, but would require careful thought to make the
  results transparent and avoid unexpected changes."
  The neighbouring requests say the same thing about different objects. **"Tag
  Mass Action: Add, Rename, and Delete a tag in multiple files"**, topic 567:
  **290 opening-post likes**. **"Properties Wrangler: Add a way to 'Insert',
  'Rename' and 'Remove' properties and values in all files"**, topic 63806,
  opened 2023-07-26: **18,521 views, 68 posts, 431 likes on the topic, 210 on
  the opening post**, last activity 2026-08-21, and carrying a moderator note
  copied exactly: "As of ver 1.10, mass delete and mass rename of a property are
  possible. This feature request remains open for mass operation (vault-wise) on
  a property's values." Three years to ship half of it.
- **Source:** https://forum.obsidian.md/t/global-mass-vault-wise-search-replace/4395 ,
  https://forum.obsidian.md/t/properties-wrangler-add-a-way-to-insert-rename-and-remove-properties-and-values-in-all-files/63806 ,
  and the all-time top listing, all opened 2026-09-18
- **Who ships it today:** VS Code does multi-file search and replace properly,
  with a per-match preview and per-match accept. Obsidian does not, six years
  on. The notes category as a whole does not.
- **Nobody ships:** a multi-file edit that arrives as a **reviewable set** you
  take match by match, rather than a button that rewrites 200 files and hopes.
  VS Code comes closest and still applies to the buffer, not to a queue.
- **The problem it solves for us:** this is the bridge between the pre-agentic
  and the agentic complaint, and it is the same complaint. A person asking to
  rename `[[documentation]]` across 200 notes, and an agent rewriting 200 notes,
  are the same event from the file's point of view. "Careful thought to make the
  results transparent and avoid unexpected changes" is a user, in 2020,
  specifying our change queue for a multi-file operation.
  There is a second, sharper reading. The reason nobody ships it is that a
  multi-file rewrite is terrifying without a way to take it back. We have the
  mechanism that makes it safe.
- **Fit:** strong, and it is the natural extension of the queue from one file to
  a set. Same accept and reject, same splice, same refusal on ambiguity, applied
  across a match list. It is also the exact shape of an agent's output, so one
  build serves the human bulk edit and the agent diff review.
- **Effort:** medium. The engine and the queue exist; the work is the match
  list, the cross-file preview and grouping.
- **Verdict:** good-to-have, and strategically the most interesting item here
  after suggesting mode, because it is the change queue's second customer and
  costs far less than the first.

---

### FD15. The two most-wanted things on the largest markdown forum are both about frontmatter, and one of them is a round-trip bug

- **Demand:** the number one and number two requests of all time in Obsidian's
  Feature requests category, by likes on the opening post, are both about
  YAML frontmatter.
  - **Number one: "Use H1 or YAML property 'title' instead of or in addition to
    filename as display name"**, topic 687, opened **2020-05-28**. **54,840
    views, 149 posts, 712 likes on the topic, 386 on the opening post**, last
    activity 2026-03-14. Copied exactly: "I'm interested in a setting that would
    use a note's H1 or front-matter title instead of or in addition to the
    filename as the display name everywhere: links, backlinks, graph view,
    search, etc." The reasons given include "For users who use IDs as filenames
    or who generally want more concise filenames" and "Use illegal filename
    characters and emojis in note titles".
  - **Number two: "Properties & Bases: Support multi-level YAML (Mapping of
    Mappings, nested attributes, nested properties)"**, topic 63826, opened
    **2023-07-27**. **30,559 views, 182 posts, 790 likes on the topic, 293 on
    the opening post**, last activity **2026-08-24**. The opening post is four
    lines of YAML and one sentence: "We need to be able to support multi-level
    YAML. Especially for Dataview users". A reply with 14 likes: "+1 most of my
    yaml is nested".
  Add **"Properties: let the user customize the way Dates/Times are displayed"**
  (topic 64139, **197 opening-post likes**, 67 replies) and **Properties
  Wrangler** from FD14 (**210**), and four of the top fourteen all-time requests
  are frontmatter.
  TriliumNext has the export version of the same ask, **#8452 "Export note
  attributes as Markdown metadata"** (5 plus-ones). SilverBullet's single
  most-reacted open issue is **#1058 "Add a option to SETTINGS to let the
  frontmatter folded status be persistent"** (**17 plus-ones**), which is a
  request to stop having to look at it.
- **Source:** https://forum.obsidian.md/t/use-h1-or-yaml-property-title-instead-of-or-in-addition-to-filename-as-display-name/687 ,
  https://forum.obsidian.md/t/properties-bases-support-multi-level-yaml-mapping-of-mappings-nested-attributes-nested-properties/63826 ,
  the all-time top listing, and the `TriliumNext/Trilium` and
  `silverbulletmd/silverbullet` reactions sweeps, all opened 2026-09-18
- **The part that is not a feature request but a defect, and it is ours to
  win:** a properties editor that cannot represent nested YAML has to do
  something when it meets a file that contains nested YAML. INFERENCE, and I am
  marking it as such because I did not reproduce it: the reason topic 63826 has
  182 posts over three years is that the structured editor and the file
  disagree, which is FD1 wearing a different hat. UNVERIFIED: I did not test
  Obsidian's Properties editor against a nested-YAML file in this session, so
  the claim that it mangles such files is not established here; what is
  established is that 293 people asked for nested support and it is still open
  after three years and one month.
- **Who ships it today:** Obsidian has a Properties editor that covers the flat
  case. Most markdown editors show frontmatter as raw text or hide it. Nobody
  offers a structured editor that is honest about what it cannot represent.
- **Nobody ships:** a frontmatter editor that **refuses** rather than flattens.
  That is our whole differentiation, applied to the one block of a markdown file
  that is not prose.
- **The problem it solves for us:** we are called frontmatter. The largest
  markdown community in the world has put frontmatter at numbers one, two, four
  and eleven of its all-time requests, and the open ones have been open for
  three to six years. If there is a single feature where the product name and
  the demand meet, it is this.
- **Fit:** excellent and unusually clean. Project the frontmatter block as a
  structured editor. When a value is something the structured view cannot
  represent, show it read-only with a plain note saying so, and let the person
  drop to text. Never rewrite the block to fit the widget. The display-title
  request (topic 687) is a projection question and nothing else: read `title`
  from the block, show it in the file list and the tab, leave the filename alone.
- **Effort:** small for display-title. Medium for a structured editor that
  handles nesting and refuses cleanly.
- **Verdict:** must-have. This is the highest-demand, best-named, most
  on-brand thing in the entire lens, and the refusal behaviour is something only
  we would think to build.

---
### FD16. Outside writing tools cannot reach inside a markdown editor, and the 2026 version of that problem is an agent

- **Demand:** the same request in three unrelated trackers, totalling **192
  plus-one reactions**.
  - Typora **#1453 "Grammarly Integration"**: **145 plus-ones, 206 total
    reactions, 54 comments**, opened 2018-04-29. The whole body: "Some users
    might be keen on integration with 'Grammarly'. It's a popular and very good
    spelling and grammar checker, (that has some privacy trade-offs, and a paid
    version). Is integration planned?" It is the third most-reacted open issue
    in that tracker.
  - HackMD **#122 "work with Grammarly"**: **34 plus-ones, 17 comments**, opened
    2019-09-27, **last updated 2026-04-05**. The whole body, one sentence: "My
    students would benefit by being able to use Grammarly on hackmd." It is the
    **most-reacted open issue in HackMD's public tracker**, of 202 open.
  - MarkText **#2789 "add grammar checkers like Grammarly or language tool"**:
    13 plus-ones, 8 comments, opened 2021-12-24.
- **Source:** https://github.com/typora/typora-issues/issues/1453 ,
  https://github.com/hackmdio/hackmd-io-issues/issues/122 ,
  https://github.com/marktext/marktext/issues/2789 , all opened 2026-09-18
- **Who ships it today:** plain textareas and ordinary contenteditable surfaces
  get Grammarly for free, because the browser extension can reach them. Rich
  editors built on CodeMirror, ProseMirror or a custom block tree do not.
  UNVERIFIED as a mechanism: I did not test a Grammarly extension against these
  editors in this session; the mechanism is the standard explanation and I am
  marking it as unconfirmed rather than asserting it.
- **Nobody ships:** a documented way for an outside tool to read the document,
  propose a change against a location in it, and have the person accept or
  reject. Every one of these three issues is that request wearing 2018 clothes.
- **The problem it solves for us:** this is the same shape as FD13 and as the
  deferred MCP work, and it reframes all three. The ask is not "add Grammarly".
  The ask is **a proposal port**: a stable way for something that is not the
  editor to suggest an edit to a byte range. Once that exists, Grammarly, a
  language tool, a local agent, Claude Code and a colleague are all the same
  kind of client, and the change queue is the one place their proposals land.
- **Fit:** very good, and it is an argument for how to shape the MCP and API
  work when it comes off the Later list. The unit of the interface should be a
  **proposal against a byte range**, not a document write. That is the same
  primitive as splice-only writing, exposed outward.
- **Effort:** medium for a local proposal port; the full API is the Later item
  already in the plan.
- **Verdict:** good-to-have as a feature, must-have as a **design constraint**.
  The lesson is free: whatever we expose to the outside world should propose,
  never write. Eight years of Grammarly requests across three editors say the
  demand for a proposal port predates agents entirely.

---
## Question 1: the top twenty, deduplicated into themes, with real counts

Two vote systems appear below and **they are not the same unit**, so they are
never added together. GitHub counts are plus-one reactions on open issues, read
from the search API. Obsidian counts are likes on the opening post of a topic in
the Feature requests category, which is how that forum registers a vote; the
topic-wide like total is given separately where it is larger. Everything in this
table was re-derived from the cached API responses at the moment of writing, not
carried forward from earlier in this file.

Items already in the plan (mermaid, KaTeX, kanban, tasks, templates, backlinks,
tags, drawing, slides, OCR, citations) are excluded, with one deliberate
exception noted at row 3.

| # | Theme | Count | Where the count comes from | In our plan? |
|---|---|---|---|---|
| 1 | **Frontmatter and properties: display title, nested YAML, date display, bulk property edit** | **386 + 293 + 210 + 197 opening-post likes** (topic likes 712, 790, 431, 657) | Obsidian topics 687, 63826, 63806, 64139. Numbers one, two, eleven and fourteen all-time | Partly. FD15 |
| 2 | **Vim and modal editing** | **345 plus-ones**, 194 comments | marktext#596 (+101), typora#187 (+239), silverbullet#1566 (+5) | No |
| 3 | **Bulk edit across many files, with a preview** | **267 + 290 opening-post likes** (topic likes 650, 811); 140 and 36 replies | Obsidian topics 4395, 567. Row 3 includes the tag request because the unmet part is the *bulk operation*, not tags | No. FD14 |
| 4 | **A plugin or extension system** | **285 plus-ones**, 133 comments | typora#162 (+250), marktext#375, Trilium#986, logseq#8836 | No, and deliberately so |
| 5 | **Edit an embedded or transcluded block in place** | **279 opening-post likes**, topic likes **1,078**, 117 replies | Obsidian topic 15339 | No |
| 6 | **Run it in a browser** | **273 opening-post likes**, topic likes 949, **257,898 views** | Obsidian topic 2049, the most-read request on the forum | Yes, we are web-first |
| 7 | **Command line and git inside the editor** | **228 plus-ones**, 96 comments, plus **3,152,557 installs** of the Obsidian Git plugin | typora#1999 (+100), typora#3196 (+76), Zettlr#1050 (+29), hackmd#8 (+13), marktext#3616 (+10) | Git push yes. CLI no. FD13, corrected by FD18 |
| 8 | **Let an outside tool reach in and propose a change (the Grammarly class)** | **192 plus-ones**, 79 comments | typora#1453 (+145), hackmd#122 (+34, the most-reacted open issue in that tracker), marktext#2789 (+13) | MCP and API are deferred to Later. FD16 |
| 9 | **Open any file anywhere, no vault** | **114 opening-post likes**, topic likes **552**, 168 posts, six years, plus **70** for the iOS version | Obsidian topics 314 and 28266 | Implied by the premise, not surfaced. FD9 |
| 10 | **Folding and collapsing** | **165 plus-ones**, 165 comments | typora#499 (+133), marktext#1869 (+28), silverbullet#695 | Outline yes, folding no |
| 11 | **Do not rewrite my file** | **123 plus-ones**, 128 comments | marktext#2189 (+43), typora#369 (+36), marktext#1354 (+19), marktext#1849 (+15), logseq#9266 (+10) | **Yes, it is the premise.** FD1 |
| 12 | **Auto-save is dangerous: give me a save point** | topic likes **459**, **69 opening-post likes**, 134 posts, 28,157 views, still live in 2026 | Obsidian topic 14230 | No. FD8 |
| 13 | **No silent merge: review the outside change** | topic likes **83**, **39 opening-post likes**, 73 posts; plus 19 plus-ones on GitHub | Obsidian topic 14874; marktext#3652, silverbullet#1040 | **Yes, the change queue.** FD7 |
| 14 | **Read-only and locked modes** | **93 plus-ones**, 64 comments | typora#710 (+62, nine years open), marktext#2451, marktext#3688, silverbullet#994 | No. FD12 |
| 15 | **Suggesting mode and CriticMarkup** | **36 + 28 opening-post likes** (topic likes 81 and 65); **six plugins built in five months of 2026**, best one at 1,768 installs | Obsidian topics 18485, 72232, 50255, 66013; the plugin registry | No. **FD3, FD4, FD5** |
| 16 | **Mobile: background sync, files outside the sandbox, correct typing** | **108 + 100 + 70 opening-post likes**; **61 plus-ones** on GitHub | Obsidian topics 25906, 15753, 28266; joplin#3872, AFFiNE#13447, AFFiNE#13927 | Partly. FD10 |
| 17 | **Approval, multi-user and permissions** | **66 plus-ones**, 142 comments | Trilium#4956 (+39, 111 comments), AFFiNE#13517 (+15), outline#1084 (+12, "page creation and edit approvals") | Change queue is the single-owner half. FD7 |
| 18 | **Encryption and local privacy** | **59 plus-ones**, 78 comments | AFFiNE#5491 (+23), joplin#13573 (+17), joplin#289 (+14), Trilium#7411 (+5) | No |
| 19 | **Authorship marking, human versus AI** | **28 opening-post likes**, topic likes 65, 38 posts; spec repo at 124 stars | Obsidian topic 72232; `iainc/Markdown-Annotations` | No. FD6 |
| 20 | **A performance contract anyone can check** | no vote count; **five threads of contradictory anecdote** with numbers from 993 files to 100,000 notes | Obsidian topics 114864, 116296, 112785, 108119; outline#12589, #10697 | No. FD11 |

Two honest notes on this table. First, rows 2, 4, 5 and 10 are real demand that I
am reporting because the question asked for the top twenty, not because they suit
us; vim bindings and a plugin system are the two largest single asks in the GitHub
data and neither is a good fit for this product. Second, the Obsidian counts come
from one forum, so theme 1 is partly an artefact of Obsidian having shipped a
Properties feature that people then wanted more of. That does not make the demand
unreal, but it is not evidence about markdown users in general.

---

## Question 2: which of these themes nobody ships at all

Ranked by how completely absent they are.

1. **Suggesting mode over a plain markdown file, shipped as a product.** Six
   plugins exist and the best has 1,768 installs; the reference implementation
   is not in the plugin store after three and a half years. Google Docs and Word
   have it, and neither writes markdown. **Nobody.**
2. **A suggestion carrier that is invisible to a reader who does not understand
   it.** I measured all of them leaking and one, the CriticMarkup substitution
   mark, being silently corrupted by GFM strikethrough in two of three parsers.
   **Nobody, and it may not be possible in plain markdown; see FD5.**
3. **A merge policy of "ask me first".** Everything on the market either merges
   silently, makes a conflicted copy, or leaves git markers. **Nobody.**
4. **A stated and testable byte-exactness guarantee.** Several tools are better
   than others. None makes a promise you can check. **Nobody.**
5. **A frontmatter editor that refuses rather than flattens what it cannot
   represent.** **Nobody.**
6. **A markdown editor you can invoke from a script and block on**, the way
   `code --wait` makes VS Code a valid `$EDITOR`. **Nobody**, with a correction:
   Obsidian does ship a CLI, and I could not confirm whether it blocks. What is
   confirmed is that its exit codes do not report failure, which is worse than
   not having one; see FD18.
7. **Human-versus-AI authorship marking outside one paid app.** iA Writer ships
   it, published the spec, and nobody adopted it in nearly three years.
   **Effectively nobody.**
8. **A published performance contract.** Not one number, on named hardware, from
   any vendor in this sweep. **Nobody.** (Marked UNVERIFIED in FD11: strongly
   indicated, not exhaustively proven.)
9. **Multi-file edit that arrives as a reviewable set rather than an applied
   rewrite.** VS Code comes closest and still writes to buffers. **Nobody, in
   this category.**
10. **A per-document read-only mode that is the default for files you did not
    create.** **Nobody.**

Everything else in the table is shipped somewhere. These ten are the white space,
and six of the ten fall out of machinery this repo has already built.

---
## Question 3, second half: how a suggestion could actually live in a plain markdown file

The tasking asked how suggesting mode "could be represented in a plain markdown
file". There are only four candidate carriers in existence, and I tested all of
them against marked 16.4.2, markdown-it 15.0.0 and commonmark 0.31.2 rather than
reasoning about them. Results, with what an unaware reader sees:

| Carrier | Example | What a foreign reader sees | Destructive? |
|---|---|---|---|
| **CriticMarkup inline** | `The {~~quick~>slow~~} fox.` | `{<del>quick~&gt;slow</del>}` in marked and markdown-it; raw text in commonmark | **Yes.** The proposal is silently turned into struck-through text with stray braces. See FD5 |
| **iA Writer end block** | `---` then `@Human: 0,20` then `...` | `<hr>` plus a visible paragraph of offsets; and **`<h2>` swallowing the last prose line** if the blank line is missing | Yes when the blank line is missing, in all three parsers. See FD6 |
| **Obsidian `%%` / HTML comment** | `The quick %%note%% fox.` | `%%note%%` printed, always. HTML comments are invisible in marked and commonmark but **printed** by markdown-it in its default `html: false` configuration | No, but it leaks, and unpredictably |
| **Callout block** | `> [!suggestion] alice` | a plain blockquote reading `[!suggestion] alice`, identically in all three | **No** |
| **Fenced block** | ```` ```frontmatter-suggestion ```` | an inert code block, identically in all three | No while closed. **An unclosed fence swallows every following line into the code block**, in all three |

Two of those rows were measured this session specifically for this question. The
callout degrades to a blockquote in marked, markdown-it and commonmark alike. The
fenced block degrades to a code block in all three, and an unclosed one ate the
sentence "More prose that should still be prose." in all three. That is
independent confirmation, from three parsers, of the carrier decision already
recorded as settled in this repo, and it is the first time I have seen it
measured rather than argued.

**What this implies for our design,** and this is inference, not a finding:

`INFERENCE:` the right answer is that a **pending suggestion should not be in the
file at all**. The file is the accepted text. A suggestion is a proposal about a
byte range, and it lives in the change queue until someone accepts it, at which
point it becomes a splice and stops being a suggestion. Everything in the table
above is a compromise forced on tools that had nowhere else to put the proposal.
We have somewhere else to put it. That is the advantage, and it is worth saying
out loud rather than copying CriticMarkup because it is what exists.

`INFERENCE:` where a suggestion *must* travel in the file, because it is being
handed to someone who does not run frontmatter, the two safe carriers are the
callout for anything a human should read and the closed fenced block for machine
data, exactly as the repo already decided, with CriticMarkup offered as a lossy
export for the six plugins in FD3 and for pandiff. The substitution mark should
be exported as a separate deletion and addition rather than `{~~ ~> ~~}`, because
the substitution form is the one that collides.

---

## Question 4: comments and annotations that survive round-tripping

Who does it, how, in what syntax, and does it break other readers.

| Who | Syntax | Where it is stored | Survives a foreign reader? |
|---|---|---|---|
| **Obsidian** (core) | `%%comment%%` | inline in the file | No. `%%comment%%` is printed verbatim by all three parsers I tested |
| **Commentator** (Obsidian beta, FD4) | CriticMarkup `{>> <<}` and friends | inline in the file | Comments survive as visible escaped text; **substitutions corrupt**, FD5 |
| **`redline`** (Obsidian, 834 installs) | its own, unstated here | **a sibling `.review.md` sidecar**, per its registry description: "Comments live in a sibling .review.md sidecar so the source document stays clean" | The source file is untouched, so yes. The comments are a second file that other tools do not know to carry |
| **`review-comments-ai`** (97 installs) | CriticMarkup | inline, explicitly so an agent can read it: "threads live in the note as CriticMarkup, so Claude Code or a local agent reads the discussion, edits the text and replies in place" | Same as Commentator |
| **iA Writer** | `@`, `&`, `*` keys with `location,length` ranges and a SHA-256 guard | **a block at the end of the file** | Visible as a paragraph of offsets; **turns the last prose line into an `<h2>`** if the blank line is lost |
| **Google Docs, Notion, Outline** | not markdown at all | a database | Not applicable. The comment cannot leave the product |
| **HTML comment** | `<!-- -->` | inline | Invisible in marked and commonmark; **printed** by markdown-it in its default configuration |

**The finding under the table.** There are exactly two architectures: put it
inline and accept that it leaks, or put it beside the file and accept that it
gets separated. Every product in this sweep picked one and lived with the
consequence. Note for the record that this repo **dropped the sidecar approach on
2026-09-17**, and `redline` is the live counter-example rather than an argument
to revisit it; it has 834 installs and its own description concedes the trade by
calling the untouched source "clean".

`INFERENCE:` the third architecture, which nobody in this sweep has, is to hold
the comment outside the file **and** make it portable on demand, by exporting to
whichever inline syntax the recipient understands at the moment it leaves. That
is a conversion problem, not a storage problem, and we would be the only tool
treating it that way.

---
