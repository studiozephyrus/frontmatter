# Lens F: the actual pain

What goes wrong for people whose repositories and documents are being written by agents, in
2026. Complaints, not features. Every finding carries a URL and the date it was opened.

Method: Hacker News Algolia API for stories and comments (points and comment counts are on the
page); the HN item API for full threads; GitHub issue and discussion APIs; published survey
pages fetched with curl. Reddit attempted through the public JSON endpoints.

Opened dates are 2026-09-18 unless stated. British spelling. No dashes.

**One declared alteration.** The brief forbids em and en dashes anywhere in this output. Eight of
them occurred inside strings quoted verbatim from opened pages. Rather than silently edit a
quotation, I am declaring it: those eight characters were replaced with plain hyphens, in eight
places, and **no other character in any quoted string was changed**. The affected strings are the
METR "19% longer than without" sentence, two Vercel pass-rate table rows, one GitHub repository
description, and the numeric ranges "1.4-2x", "100-150" and "10-15%". Anyone re-quoting these
should re-open the source.

---

### FF1. The clean-up after agents is now its own product category, and documentation drift is named first

- **Demand:** Charlie Labs spent almost two years building an autonomous coding agent and then
  pivoted to cleaning up after agents. Their own Show HN text, exact string: "The one thing
  we've noticed over the last 3 months is that the more you use agents, the more work they
  create. Dozens of pull requests means older code gets out of date quickly. Documentation
  drifts. Dependencies become stale. Developers are so focused on pushing out new code that
  this crucial work falls through the cracks." The post is titled "Show HN: Daemons - we
  pivoted from building agents to cleaning up after them" and sits at 70 points, 31 comments.
  Their fix is an `.md` file committed to the repo: "Daemons are added to your codebase by
  adding an .md file to your repo". A commenter asked how it differs from hooks; the founder
  answered that a daemon is "specified by a DAEMON.md file in the repo (like skills). it's
  version-controlled and team-owned, not hidden in a dashboard or linked to a single
  developers account."
- **Source:** https://news.ycombinator.com/item?id=47850907 (fetched via
  https://hn.algolia.com/api/v1/items/47850907), posted 2026-04-21, opened 2026-09-18.
  Product page cited in the post: https://charlielabs.ai/
- **Who ships it today:** Charlie Labs Daemons (cloud runtime, repo-committed DAEMON.md, open
  spec at ai-daemons.com/spec). Claude Code Routines, named in the thread by simonw as the
  nearest thing (https://code.claude.com/docs/en/routines). Claude Code hooks. All of these
  run an agent on a trigger; none of them show a person what drifted.
- **Nobody ships:** the human-facing half. Every tool in that thread answers drift by running
  another agent. Not one of them gives the owner a view of which documents in the repo have
  fallen behind the code and lets them decide.
- **The problem it solves for us:** the market has already agreed that agent output creates a
  document maintenance debt, and has already agreed the control file lives in the repo as
  markdown. That is exactly our substrate.
- **Fit:** a "documents that have fallen behind" list, computed from git: for each markdown
  file, the last commit that touched it against the last commit that touched the code paths it
  cites. Every input is already on disk, so it stays a projection.
- **Effort:** medium. The git walk is small; deciding what a document "cites" is the work, and
  our cards already have a citation form of `docs/FILE.md:NNN`.
- **Verdict:** good-to-have. A company pivoted its whole business onto this pain, which is the
  strongest receipt in this lens, but they went after the repair and we would go after the
  visibility.

### FF2. The reviewable unit is wrong. People want to review the decision, not the diff

- **Demand:** An Ask HN from 2026-08-16, 13 points, 11 comments, titled "Ask HN: What tools are
  you using for human code review of AI-assisted code?". The poster, exact string: "I'm finding
  that github's PR interface is not really cutting it for me, it was janky even when the reviews
  were small, but now at the size they're at, it is becoming unmanageable.  Add to that the
  extra noise of mixing in agent reviews, and people "meat-proxying" in copy-pasted agent
  output, and it's getting pretty noisy and difficult to navigate." The most interesting reply,
  from BonanKou, exact string: "I personally believe the reviewable unit shouldn't be the final
  diff. Instead, review the decision trace: plan, assumptions, etc. And if you agree with the
  agent's decision trace, probably you will also agree how the code was implemented". A second
  commenter, ArnaudDebray, quoted that line back and wrote "I can't agree more", then said
  he is building a product on it: "we capture the AI sessions along the development to extract
  the key decisions and choices. We then use that to help navigate the diff and guide the
  reviewer towards what matters."
- **Source:** https://news.ycombinator.com/item?id=49321400 (fetched via
  https://hn.algolia.com/api/v1/items/49321400), posted 2026-08-16, opened 2026-09-18.
- **Who ships it today:** three separate products named by three separate commenters in one
  eleven-comment thread, which is itself the signal: https://www.herve.review/ (beta, captures
  AI sessions and extracts decisions), https://pyor.review (built by the commenter because
  GitHub "chokes on" large diffs, his words in a separate Show HN title), and
  https://github.com/jacquardlabs/gauntlet (a set of judges each in a strict lane). CodeRabbit
  staff turned up in the thread offering a new interface they call "change stack".
- **Nobody ships:** a review surface where the plan document and the diff sit against each
  other, both from disk, both versioned. All three products reconstruct the decision from a
  session log they capture out of band. Nobody reads it out of the plan file the person already
  wrote.
- **The problem it solves for us:** we already hold the plan, the brief and the blueprint as
  markdown on disk. The complaint is that the diff arrives with the reasoning stripped off.
- **Fit:** the change queue already accepts or rejects one change at a time. Showing the plan
  clause a queued change claims to satisfy, side by side, is the same projection with one more
  column. It stays deterministic because both halves are bytes on disk.
- **Effort:** medium. The queue exists in the plan; the link from a change to a plan clause is
  the new part and needs a convention, not an inference.
- **Verdict:** good-to-have, and the highest-conviction one in this lens. Three founders in one
  thread of eleven comments are building the same thing from the session log because nobody
  keeps the decision in a file.

### FF3. Instruction files rot silently, with no commit to the file, and people have built linters for it

- **Demand:** A Show HN on 2026-02-28, only 1 point and 1 comment, so treat the loudness as low
  and the diagnosis as the value. The author's exact words: "AGENTS.md (and CLAUDE.md,
  GEMINI.md, .cursorrules) has become the standard way to tell AI coding agents how your repo
  works. It's now in 60,000+ repos." Then: "The problem: nobody keeps them up to date." And the
  mechanism, exact string: "Paths get renamed. npm scripts change. Framework patterns go stale.
  The file that was accurate when you wrote it in September starts giving your agents wrong
  instructions by December - without a single commit to AGENTS.md." He repeats it as the point
  of the whole tool: "Your AGENTS.md can rot without a single commit to it." He also names a
  failure we would not have guessed: "if you have both AGENTS.md and CLAUDE.md, they can
  silently contradict each other. One says `npm run test`, the other says `npm run test:unit`.
  Agents pick one arbitrarily." What he found on real repos: "absolute home-directory paths that
  only work on the author's machine, monorepo commands copy-pasted into single-package projects".
- **Source:** https://news.ycombinator.com/item?id=47189911 (fetched via
  https://hn.algolia.com/api/v1/items/47189911), posted 2026-02-28, opened 2026-09-18. Repo
  named in the post: https://github.com/giacomo/agents-lint
- **UNVERIFIED:** the same post claims "An ETH Zurich study presented at ICSE 2026 put numbers on
  this: stale context files reduced agent task success by 2-3% while increasing token costs by
  over 20%." I could not find that study; see "What I could not reach". Do not quote the 2-3%
  or the 20% anywhere. The 60,000 repos figure is also the author's claim, not a page I opened.
- **Who ships it today:** agents-lint (zero-dependency CLI, five checks, a freshness score 0 to
  100, meant to run on a weekly CI cron). Several near-identical Show HNs exist and all are tiny:
  "Show HN: DocSync - Git hooks that block commits with stale documentation" (4 points,
  https://news.ycombinator.com/item?id=47021705), "Show HN: VeriContext - Preventing Stale
  Documentation for LLM Agents" (3 points, item?id=47145928), "Show HN: Drift - Linter for
  Documentation Rot" (2 points, item?id=47537155), "Show HN: Driftcheck - Pre-push hook that
  catches doc/code drift with LLMs" (2 points, item?id=46698142), "Show HN: DocDrift - Use
  Tree-sitter and Local LLMs to fix stale documentation" (2 points, item?id=47491646). All five
  titles and point counts read from the Algolia search index on 2026-09-18.
- **Nobody ships:** an editor that shows it. Every one of these is a CLI or a git hook that
  fails a build. The person writing the instruction file never sees the rot while they are in
  the file.
- **The problem it solves for us:** the brief already has an instruction files screen and a
  problems panel. This says exactly what the problems panel should check first, and it is
  cheaper than it looks: does the path exist, does the npm script exist, do two instruction
  files contradict each other.
- **Fit:** perfect. Every check is a pure function of bytes on disk plus the file tree. No model
  call, no network, no state. That is a projection in the strict sense.
- **Effort:** small for the path and script checks, which are the two that fire most. Medium if
  the cross-file contradiction check is included.
- **Verdict:** must-have for the problems panel, good-to-have as a headline. The demand is
  broad but quiet: many people built the same small tool, nobody got traction, which usually
  means it is a feature and not a product.

### FF4. Where the work is actually lost: uncommitted edits, between commits, by an agent, with no undo

- **Demand:** the loudest single lost-work post I found. "Show HN: Unfucked - version all changes
  (by any tool) - local-first/source avail", 2026-02-26, **137 points, 91 comments**. The
  author's opening, exact string: "I built unf after I pasted a prompt into the wrong agent
  terminal and it overwrote hours of hand-edits across a handful of files. Git couldn't help
  because I hadn't finished/committed my in progress work. I wanted something that recorded
  every save automatically so I could rewind to any point in time. I wanted to make it
  difficult for an agent to permanently screw anything up, even with an errant rm -rf".
  On why it did not already exist, exact string: "I spent a bit of time being baffled nothing
  existed that does this. Then I realized that, until Agents, the velocity of changes wasn't as
  quick and errors were rare(er)". Asked why not use Emacs magit-wip-mode, he drew the line
  precisely: "magit-wip-mode is great if your only risk is your own edits in Emacs. UNF* exists
  because that's no longer the only risk; agents are rewriting codebases/docs and they don't use
  Emacs." And against jujutsu: "If an AI agent rewrites 30 files and you haven't touched jj yet,
  jj has the before-state but none of the intermediate states."
- **The detail that matters most to us:** a commenter, gschrader, on whether the IDE already
  covers this, exact string: "I think it only keeps history for user edited files, agent edited
  files don't seem to end up in it for me (Claude code) but maybe it works with other agents
  with the proper plugins I'm not sure." The author confirmed it as his whole thesis: "+1 OP
  here, this is the problem I'm solving for. Agents use tools and may be in multiple places
  editing; therefore, you need to watch the file system."
- **Source:** https://news.ycombinator.com/item?id=47172238 (fetched via
  https://hn.algolia.com/api/v1/items/47172238), posted 2026-02-26, opened 2026-09-18.
- **Who ships it today:** unf / Unfudged (FSEvents plus inotify, BLAKE3 content hashing, SQLite
  metadata, Tauri app; https://www.unfudged.io/). JetBrains "Local history", named by a
  commenter, and VS Code's own local history, named by another, with the caveat above that
  neither reliably catches agent edits. jujutsu with its watchman integration, named by two
  commenters. dura (https://github.com/tkellogg/dura), named by a commenter as prior art.
- **Nobody ships:** the same safety net inside the editor and scoped to the document. Every
  answer in that thread is a filesystem daemon or a VCS. The thread's own top objection was
  trust: three separate commenters refused to install it. Exact string from notfried: "I am not
  installing a closed-source daemon with access to the filesystem from an unknown (to me)
  developer." An editor that already has the file open does not need a daemon or that trust ask.
- **The problem it solves for us:** the gap is specifically **between commits**, on
  **uncommitted work**, changed by **something that is not the person**. Git is the wrong grain
  and everyone in the thread says so.
- **Fit:** strong, and cheap for us in a way it is not for them. We hold the file and we watch
  it; a per-save content-addressed history of the open document is a local store keyed off
  bytes we already read. The projection law is untouched because the store is derived, and the
  file on disk stays the truth.
- **Effort:** medium. Content hashing and a local blob store are a week; the timeline UI is the
  rest. Scoping it to open documents rather than the whole filesystem removes the daemon, the
  launchd supervision and the trust problem in one move.
- **Verdict:** must-have. This is the clearest unmet pain in the lens, it is about documents as
  much as code, and the incumbent answers all fail for the specific reason that they are not
  the editor.

### FF5. People are forensically recovering markdown files out of agent session logs

- **Demand:** "Show HN: Claude-File-Recovery, recover files from your ~/.claude sessions",
  2026-02-27, **99 points, 41 comments**. The author's opening line names our exact file type,
  exact string: "Claude Code deleted my research and plan markdown files and informed me: "I
  accidentally rm -rf'd real directories in my Obsidian vault through a symlink it didn't
  realize was there: I made a mistake."" He then: "Unfortunately the backup of my documentation
  accidentally hadn't run for a month. So I built claude-file-recovery". Scale of his own loss,
  from a reply: "I had to recover 80 files stored in over 20+ maybe more sessions in the last
  month."
- **Not an isolated case.** In the same thread, three other people reported the same class of
  loss. TIPSIO, exact string: "AI ran a git clean on me and wiped out a bunch of untracked
  changes." gkoberger: "I had this happen yesterday to me, and Claude itself was able to
  recover it via the other conversations". A fourth, dimgl, linked his own write-up of the same
  thing happening with Codex. And the author of the Unfucked tool above turned up in this
  thread to say both Show HNs went up the same day, exact string: "Amazing how this problem was
  top of mind for all of us at the same time!"
- **The recovery surface is itself being deleted.** Commenter aragonite, exact string: "Claude
  Code by default auto-deletes local chat/session logs after 30 days, so the claim that this
  tool can recover "any file Claude Code ever read/edited/wrote" is only true within that
  retention window unless you've explicitly changed the settings ("cleanupPeriodDays" [...])
  Speaking as someone who's derived a lot of value from these logs, it's a bit shocking that
  the default is to wipe them automatically!" The tool's author replied that he changed it to
  9999 days and was "Luckily enough [...] still in that 30 day window."
- **The sharpest framing in the whole lens**, from commenter shich, exact string: "this is a
  good reminder that local session state is basically undocumented infrastructure at this
  point. the fact that people are building recovery tools around ~/.claude logs says something
  about how much we're relying on these agents for real work now. would love to see anthropic
  treat this as first-class - proper session persistence, not just forensic recovery after the
  fact"
- **Source:** https://news.ycombinator.com/item?id=47182387 (fetched via
  https://hn.algolia.com/api/v1/items/47182387), posted 2026-02-27, opened 2026-09-18. Repo:
  https://github.com/hjtenklooster/claude-file-recovery
- **Who ships it today:** claude-file-recovery (pip, CLI plus TUI, indexes every file Claude
  Code read, edited or wrote, and can extract a file as of a point in time). Claude Code's own
  `/rewind`, named by a commenter, with the limit the author gave: "to rewind, Claude will have
  to have written / edited the files that you want to recover specifically in the session that
  you want to run /rewind in." Time Machine and `tmutil` snapshots, named by another.
- **Nobody ships:** cross-session recovery that belongs to the person rather than to one
  vendor's log directory, and that survives the vendor deleting its own logs after 30 days.
- **The problem it solves for us:** people are digging their own plan documents out of a
  vendor's undocumented cache because nothing else kept a copy. That is our document, our
  format, and our user.
- **Fit:** a document history that lives beside the file, in the repo or in a sibling directory
  the person owns, is a projection of saves rather than of one tool's transcript. It is the
  same store FF4 needs, so the two are one build.
- **Effort:** shared with FF4. On its own, small: read the sessions the person already has,
  offer the versions.
- **Verdict:** good-to-have as a feature, must-have as evidence. Its real value is that it
  proves FF4's pain in the specific case of **markdown plan and research documents**, not code.

### FF6. The measured numbers: "almost right, but not quite" is the number one frustration, and distrust beats trust

- **Demand:** the Stack Overflow Developer Survey, AI section. Every figure below was read off
  the page on 2026-09-18, and I have quoted the page's own sentences rather than restating them.
  - Frustrations, on 25,332 responses (51.7% of respondents), the page's exact sentence: "The
    biggest single frustration, cited by 66% of developers, is dealing with "AI solutions that
    are almost right, but not quite," which often leads to the second-biggest frustration:
    "Debugging AI-generated code is more time-consuming" (45%)". The chart underneath gives
    "AI solutions that are almost right, but not quite 66%" and "Debugging AI-generated code is
    more time-consuming 45.2%".
  - Trust, on 12,941 responses (26.4%), exact sentence: "More developers actively distrust the
    accuracy of AI tools (46%) than trust it (33%), and only a fraction (3%) report "highly
    trusting" the output. Experienced developers are the most cautious, with the lowest "highly
    trust" rate (2.6%) and the highest "highly distrust" rate (20%)".
  - Adoption, exact sentence: "84% of respondents are using or planning to use AI tools in their
    development process, an increase over last year (76%). This year we can see 51% of
    professional developers use AI tools daily."
  - Agents, on 31,877 responses (65%), exact sentence: "AI agents are not yet mainstream. A
    majority of developers (52%) either don't use agents or stick to simpler AI tools, and a
    significant portion (38%) have no plans to adopt them." Breakdown on the same chart: "Yes, I
    use AI agents at work daily 14.1%", "No, and I don't plan to 37.9%".
  - **The two rows that matter most for a document product**, from the task chart: "Documenting
    code 30.8%" and "Creating or maintaining documentation 24.8%" are near the top of the list
    of tasks people mostly use AI for, above "Debugging or fixing code 20.7%", above "Writing
    code 16.9%", and above "Committing and reviewing code 10.2%".
- **Source:** https://survey.stackoverflow.co/2025/ai opened 2026-09-18. HTTP 200, 984,037 bytes.
- **UNVERIFIED and important:** there is **no 2026 Stack Overflow survey AI page**.
  https://survey.stackoverflow.co/2026/ai, /2026/ and /2026/technology all returned **404** when
  I probed them on 2026-09-18. So the freshest Stack Overflow numbers available to us are the
  2025 ones above. Do not date them 2026.
- **Who ships it today:** not applicable, this is a measurement finding.
- **The problem it solves for us:** it puts a measured floor under the whole lens. Documentation
  is one of the top things people hand to AI, at 30.8% and 24.8%; two thirds of developers say
  the output is almost right but not quite; and distrust of accuracy runs ahead of trust,
  46 to 33. "Almost right, but not quite" is the precise description of a document you have to
  read line by line before you can believe it, which is the change queue's whole reason to exist.
- **Fit:** not a feature. Use it as the framing number in the brief and in any pitch.
- **Effort:** none.
- **Verdict:** must-have as evidence, not a feature. **66% "almost right, but not quite"** is the
  single best number in this lens and it should be quoted with its 25,332-response base.

### FF7. The destruction mechanism has a name: a vague instruction, a glob, and untracked files

- **Demand:** anthropics/claude-code issue #23913, "Agent deleted 2,229 untracked source files
  without explicit user instruction - catastrophic unrecoverable data loss", opened 2026-02-07,
  **15 comments**, now closed. The mechanism, quoted from the issue body: the user asked the
  agent to "clean up all the scaffolding"; "The agent interpreted this as "delete every file
  with that extension in the entire project"". Then the three lines that make it unrecoverable,
  quoted from the body: "The files were **untracked by git** (`??` status) - they had never
  been committed. Only 16 of the 2,229 files existed in any git commit." and "`Remove-Item
  -Force` and `rm -rf` bypass the Windows Recycle Bin." The reporter's own diagnosis of what
  the agent failed to do, quoted: "**Distinguish scaffolding from source code.** The user said
  "scaffolding" - the agent deleted everything matching the file extension." and "**Confirm
  scope before destructive action.** A bulk delete of 2,229 untracked files should have
  triggered explicit confirmation, especially since untracked files cannot be recovered from
  git."
- **Be blunt about the loudness.** The reaction counts are small and mixed: total_count 5,
  made up of **2 thumbs-up and 3 laughs**. Read that as the community finding the surrounding
  story implausible rather than the mechanism wrong. The mechanism is documented in the body
  step by step and it matches FF4 and FF5 exactly.
- **Source:** https://github.com/anthropics/claude-code/issues/23913 (body and reaction counts
  read from https://api.github.com/search/issues), opened 2026-09-18.
- **Who ships it today:** nothing prevents this shape. The pattern in all three findings is
  identical: **a vague natural-language instruction, widened by the agent into a glob, applied
  to work that git never saw.**
- **Nobody ships:** an ambiguity refusal on scope. Our engine already refuses to splice when a
  byte range is ambiguous. Nobody applies that same refusal to "which files did you mean".
- **The problem it solves for us:** it is the strongest external argument for the refusal rule
  we already hold. "Clean up all the scaffolding" is the file-level version of an ambiguous
  span, and the correct answer was to refuse and ask, exactly as we refuse an ambiguous splice.
- **Fit:** direct. We can say publicly that refusing is a correct outcome and point at this.
- **Effort:** none, this is positioning rather than a build. Small if it becomes a stated rule
  on the instruction-files screen.
- **Verdict:** good-to-have as a feature, must-have as an argument. It is the clearest published
  case of the failure our differentiation is aimed at.

### FF8. Silent deletion with no prompt, no trash, no log and no undo, in the tool people trust most

- **Demand:** not one complaint but a cluster. A GitHub search of anthropics/claude-code for
  `cleanupPeriodDays in:title` returns **32 issues** (total_count read from the API on
  2026-09-18). The two largest:
  - #41458, "[BUG] cleanupPeriodDays: 99999 ignored - 490 sessions silently deleted despite
    explicit setting", opened 2026-03-31, **21 comments, 8 reactions of which 6 are thumbs-up,
    still open**. From the body: "`cleanupPeriodDays: 99999` has been set in
    `~/.claude/settings.json` since **January 22, 2026** (verified via automated hourly git
    backups of dotfiles). The setting was never removed or modified [...] Despite this, **490
    session JSONL files were silently deleted**."
  - #62272, "[BUG] Chat JSONLs deleted from ~/.claude/projects/ despite cleanupPeriodDays set
    high", opened 2026-05-25, **24 comments, 4 thumbs-up**. The author set "`cleanupPeriodDays:
    36500` (~100 years)" and lost them anyway.
  - The clearest statement of the design defect is in #62250, opened 2026-05-25, exact string:
    "The deletion is silent: no prompt, no "moved to trash", no surfaced log, no undo." And:
    "a routine maintenance pass on my session files (described below) caused **11 session
    transcripts to be silently deleted**, including multi-thousand-message conversations. One
    is unrecoverable."
  - #23710, opened 2026-02-06, 12 comments, 5 thumbs-up: setting the value to 0, which the
    documentation says disables cleanup, instead "completely prevents session transcripts
    (`.jsonl` files) from being written to disk". The doc string quoted in the issue: "Number
    of days to retain chat transcripts (0 to disable cleanup)". A setting that says retain
    forever does the opposite.
- **Source:** https://github.com/anthropics/claude-code/issues/41458,
  https://github.com/anthropics/claude-code/issues/62272,
  https://github.com/anthropics/claude-code/issues/62250,
  https://github.com/anthropics/claude-code/issues/23710. All read through
  https://api.github.com/search/issues on 2026-09-18.
- **Who ships it today:** nobody ships the fix; users ship the workaround. #62272's author
  published a recovery script and put it at the top of his own bug report, quoted: "**Recovery
  tool (macOS + Time Machine):** I've published a script that recovers deleted chat JSONLs from
  macOS Time Machine snapshots - https://github.com/garrettmoss/restore-claude-history [...]
  Doesn't fix the underlying deletion bug".
- **Nobody ships:** a document history the person owns. Every artefact in this cluster lives in
  a vendor's cache directory, under a vendor's retention policy, deleted by a vendor's sweep.
- **The problem it solves for us:** it is the cleanest available proof of our founding claim.
  The file on disk is the only thing that survived any of these incidents. Everything kept in
  the tool's own store was deleted, sometimes against an explicit setting.
- **Fit:** it is the projection law restated as a customer benefit. No feature needed, but it
  argues hard for keeping version history in the repo, not in our database.
- **Effort:** none as positioning.
- **Verdict:** must-have as an argument, skip as a feature. Do not build transcript recovery;
  build the thing that makes it unnecessary.

### FF9. Asked to change a line, it rewrites the whole file. The model vendor documents this as a known behaviour

- **Demand:** this is the one document-specific complaint that has both a crowd and an official
  admission behind it.
  - **The crowd.** Hacker News comments, all fetched from the Algolia comment index on
    2026-09-18, all since 2025-01-01. leptons, 2025-07-18, exact string: "I asked the "AI" to do
    something relatively simple - fix when a button was enabled or disabled. And it then rewrote
    the entire 200+ line file, which then did not run, it was completely broken."
    (https://news.ycombinator.com/item?id=44606100). julianlam, 2026-05-09, exact string: "I
    always thought it was a little weird that LLMs aren't sophisticated enough to surgically
    edit files as needed. For example, if there is a code block that needs to be wrapped within
    another function call, it'll rewrite the entire function call and you'll just have to pray
    that the re-written code block wasn't subtly changed."
    (https://news.ycombinator.com/item?id=48077002). 999900000999, 2026-03-07, exact string:
    "Try to tell Claude Code to refactor some code and see if it doesn't just delete the entire
    file and rewrite it." (https://news.ycombinator.com/item?id=47283535). feffe, 2026-06-30, on
    a local model, exact string: "It's mostly the edit call that breaks, which often results in
    "let me just rewrite the whole file from context"."
    (https://news.ycombinator.com/item?id=48730837). yonatan8070, 2026-05-05, on Codex, exact
    string: "when Codex can't directly edit file due to sandboxing restrictions, rather than
    asking "hey can I apply this diff on the file", it'd ask for permission to run a `cat EOF`
    command to re-write the whole file, which the UI doesn't surface properly (just shows the
    first line...)" (https://news.ycombinator.com/item?id=48024975). The Algolia comment index
    reports **204 hits** for the phrase "rewrote the entire file" and **139** for "rewrite the
    whole file"; most are about archive formats, so treat those totals as an upper bound, not a
    count of complaints.
  - **The admission.** Anthropic's own prompting guide for Claude Fable 5.1 carries a section
    headed "Prefer targeted edits over whole-file rewrites". Exact string from the page: "If
    Claude Fable 5.1 rewrites whole files for small changes, append the following instruction to
    the system prompt or the first user message. Claude Fable 5.1 is more likely than Claude
    Fable 5 to rewrite an entire text file rather than make a targeted edit. The resulting file
    is usually the same, but unless the file is short or most of it is changing, a rewrite costs
    more output tokens and time." The patch they tell you to paste in, exact string: "The number
    of tokens used to edit files is best minimized, all else being equal. Therefore, when it
    will not affect the end result, try to surgically edit a file rather than rewrite the entire
    thing." The page also lists the symptom in its own index of problems: "Whole files rewritten
    for small changes: Prefer targeted edits over whole-file rewrites".
  - **The reaction.** Commenter elpakal, on the 1,419-point Fable 5.1 launch thread
    (https://news.ycombinator.com/item?id=49525378, 2026-09-01), quoted the changelog wording and
    then said, exact string: "So we are to catch that somehow? And then add their recommendation
    (below) to our prompts?" (https://news.ycombinator.com/item?id=49528033). Note the changelog
    wording he quoted is not word-identical to the doc page I opened; I have used the page.
- **Source:** https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1
  opened 2026-09-18, HTTP 200, 765,011 bytes. Comment URLs as above.
- **Who ships it today:** nobody solves it; the vendor's answer is a paragraph you paste into
  your prompt, and it is framed as a **cost** problem ("costs more output tokens and time"),
  not as a **safety** problem. The user-facing harm, that a whole-file rewrite silently
  relaunders every byte you did not ask to change, is not mentioned on the page.
- **Nobody ships:** an editor that makes the difference visible and refusable. The commenter's
  line, "you'll just have to pray that the re-written code block wasn't subtly changed", is the
  exact gap.
- **The problem it solves for us:** this is our founding thesis with a receipt from the model
  vendor. Splice-only writing is not a stylistic preference; it is the fix for a documented,
  named, current model behaviour, and it got worse between two model versions of the same family.
- **Fit:** total. It is already the plan. What is new is that we can now cite the vendor.
- **Effort:** none, the capability is the product. Small to add the framing: when a queued change
  touches far more bytes than the request implied, say so before the person accepts it.
- **Verdict:** must-have, and it is the single most quotable receipt in this lens. Lead with it.

### FF10. It also changes things you did not ask about, and the vendor documents that too

- **Demand:** the same Anthropic page carries a second section headed "Keep changes and tests to
  what the task asks for". Exact string: "When asked to implement an open-ended feature, Claude
  Fable 5.1 delivers what's asked for and sometimes more: it may fix nearby code, extend behavior
  the task didn't mention, or commit more test files than the change warrants." Their symptom
  index lists it as "Unrequested fixes or extensions, or more committed test files than the task
  called for". The corrective instruction they publish contains the line that matters most to us,
  exact string: "Where the task is ambiguous, implement the reading its wording and the
  surrounding code most directly support, state that assumption in your summary, and don't build
  for the other readings as well." Their claim for the patch, exact string: "With the following
  instruction, unrequested additions and committed test code drop substantially with no
  measurable change in task success." Note that "substantially" is not a number; they publish no
  figure, so do not invent one.
- **The crowd agrees, in the same words.** 0dayz on Hacker News, 2025-03-03, exact string: "there
  was so many times I had to rewrite the entire file because the llm had added in so much extra
  unmanageable functions,even deciding to solve problems I hadn't asked it to do."
  (https://news.ycombinator.com/item?id=43238266)
- **Source:** https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1
  opened 2026-09-18.
- **Who ships it today:** the vendor's answer is again a prompt paragraph. Nothing in any editor
  separates "the change I asked for" from "the extras that came with it" at review time.
- **Nobody ships:** a queue that sorts a batch of changes into asked-for and unasked-for. Every
  diff tool treats all hunks as equal.
- **The problem it solves for us:** this is the change queue's real job. Accepting or rejecting
  one by one is only valuable if the ones you did not ask for are easy to find; otherwise the
  queue is just a slower diff.
- **Fit:** good. The request and the plan are on disk. A queued change that no plan clause and no
  request sentence accounts for can be marked as such without any model call, by set difference
  over the files the request named.
- **Effort:** medium. Marking a change as unaccounted-for is cheap; deciding what "accounted
  for" means is a design decision and needs the founder.
- **Verdict:** good-to-have. It sharpens a feature we have already committed to rather than
  adding one.

### FF11. Compaction drops the decisions, and the vendor publishes a 235-word patch for it

- **Demand:** the same Anthropic page, section headed "Tell the model what to preserve in
  compaction summaries". Its symptom line, exact string: "Client-side compaction summaries drop
  constraints, decisions, or exact details". Their remedy is a single long instruction, and what
  it asks the model to save is effectively a specification of the document we already want people
  to keep. Exact string, the six items: "(1) any difficulties or problems that came up, and how
  they were handled or resolved; (2) any possibilities, options, or approaches that were raised,
  tried, or set aside, and why; (3) anything that was asked for, decided, agreed, ruled out, or
  established as a preference, constraint, or boundary - stated exactly; (4) exactly where things
  stand now - what has been covered, settled, or completed so far; (5) anything still open,
  unresolved, promised, or expected to happen next; (6) specific details that would be hard to
  reconstruct - names, numbers, dates, exact wording, links or references - kept exactly." And
  the instruction's own priority rule, exact string: "keep what the user said, asked for, shared,
  or established carefully and close to their own words".
- **The crowd is there too, and it is a crowded, low-signal market.** An HN search for
  "agent forgets" returns a long tail of memory Show HNs, almost all with 1 to 8 points:
  MemoryKit, Hmem, Hmem v2, DeltaMemory, Novyx, A-MEM, Shodh, Whisper, Vexp, Memvid, Mira. Read
  from the Algolia index 2026-09-18. Also "Ask HN: How do you keep system context from rotting
  over time?", 2026-01-20, 35 points, 28 comments
  (https://news.ycombinator.com/item?id=46693985).
- **Source:** https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1
  opened 2026-09-18.
- **Who ships it today:** roughly a dozen tiny memory products, none with traction, plus every
  agent harness's own compaction. The interesting thing is that the vendor's own fix is **prose
  written down**, not a database.
- **Nobody ships:** the obvious move. That six-item list is a document template. Nobody offers it
  as a file in the repo that a person can read, correct and keep.
- **The problem it solves for us:** it is a ready-made, vendor-authored specification for what a
  decision record should contain, and it says the words should be the user's own. It is close to
  what our Idea mode brief already is.
- **Fit:** good, as a template rather than a mechanism. Ship it as one of the templates already
  in the plan, sourced and credited.
- **Effort:** small. It is a template plus a heading structure.
- **Verdict:** good-to-have. Do not build a memory product; the graveyard above is the reason.
  Ship the template and let the file be the memory.

### FF12. The time numbers, and the blunt part: "AI makes you slower" does not survive 2026 evidence

You asked for any number on how much time goes into reviewing or repairing agent output. There
are three, they disagree, and the most quoted one has been withdrawn by the people who produced
it. Reporting all three.

- **The famous one, and it is stale.** METR's randomised controlled trial, 16 experienced
  open-source developers, published 2025-07-10. Exact string from the page: "Surprisingly, we
  find that when developers use AI tools, they take 19% longer than without - AI makes them
  slower." The same page now carries a banner, exact string: "These results are out of date. We
  have released results that are current as of early 2026, in a continuation of this study. We
  believe these historical results no longer reflect the current impact of AI models on
  open-source developer productivity."
  Source: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ opened
  2026-09-18.
- **The correction, 2026-02-24, titled "We are Changing our Developer Productivity Experiment
  Design".** Exact strings: "Our early 2025 study found the use of AI causes tasks to take 19%
  longer, with a confidence interval between +2% and +39%. For the subset of the original
  developers who participated in the later study, we now estimate a speedup of -18% with a
  confidence interval between -38% and +9%. Among newly-recruited developers the estimated
  speedup is -4%, with a confidence interval between -15% and +9%." Both new intervals cross
  zero, and METR says so themselves: "our data is only very weak evidence for the size of this
  increase." Their stated reason, exact string: "we have observed a significant increase in
  developers choosing not to participate in the study because they do not wish to work without
  AI, which likely biases downwards our estimate of AI-assisted speedup." They also cut pay from
  $150/hr to $50/hr, which they name as a second selection effect.
  Source: https://metr.org/blog/2026-02-24-uplift-update/ opened 2026-09-18.
- **The 2026 number, and it is self-reported.** METR, February to April 2026, 349 technical
  workers. Exact string: "Participants self-reported a median 1.4-2x change in the value in
  their work due to AI tools. The median self-reported speed change (which we expect to be
  higher than value change) is 3x." With their own health warning, exact string: "our study in
  early 2025 found that people overestimated AI's effect on their time spent on tasks by 40
  percentage points on average."
  Source: https://metr.org/blog/2026-05-11-ai-usage-survey/ opened 2026-09-18.
- **The one measured number that is still standing** is the Stack Overflow frustration figure in
  FF6: 45.2% say "Debugging AI-generated code is more time-consuming". That is a proportion of
  people, not an amount of time. **There is no published, current, measured figure for hours
  spent reviewing or repairing agent output.** I looked and did not find one; see "What I could
  not reach".
- **Be blunt about what this means for us.** Do not build a pitch on "agents waste your time",
  because the best evidence for that claim has been retracted by its own authors and the 2026
  replacement points the other way. The defensible claim is narrower and better: people do not
  **trust** the output (46% distrust against 33% trust, FF6), two thirds find it **almost right
  but not quite**, and when it goes wrong it goes wrong **irreversibly** (FF4, FF5, FF7, FF8).
  Sell the verification and the reversibility, not the speed.
- **Verdict:** must-have as a correction to our own framing. If any frontmatter document
  currently cites the METR 19% figure as current, it is wrong and should be fixed.

### FF13. A document nobody links to is read under 10% of the time. Orphan docs are dead docs

- **Demand:** the post "A good AGENTS.md is a model upgrade. A bad one is worse than no docs at
  all" reached **142 points and 43 comments** on 2026-04-28
  (https://news.ycombinator.com/item?id=47938417). The underlying article is Augment Code's, and
  it publishes discovery rates measured across their own monorepo. Their preamble, exact string:
  "We traced documentation discovery across hundreds of sessions. The discovery rates are
  lopsided enough to shape migration priorities." Then, exact strings:
  - "AGENTS.md files are discovered automatically in 100% of cases, for every file in the
    hierarchy from the working directory by most harnesses."
  - "References out of AGENTS.md are loaded on demand and read in over 90% of sessions when the
    agent has a reason to pull them in."
  - "Directory-level README.md files aren't auto-loaded, but the agent reads them in 80%+ of
    sessions when it's working in that directory."
  - "After that, discovery falls off a cliff. Nested README s, meaning README files in
    subdirectories the agent isn't currently working in, get discovered only about 40% of the
    time."
  - "Orphan docs in _docs/ folders that nothing references get read in under 10% of sessions."
  - And the concrete case: "One service in our codebase had 30K of detailed protocol design,
    throttling rules, and security docs in _docs/ . The agent never opened most of them across
    dozens of sessions."
  - Their conclusion, exact string: "AGENTS.md is the only documentation location with reliable
    discovery. If something needs to be seen, it either lives there or is directly referenced
    from there."
- **They also measured that a bad instruction file is worse than none.** Exact strings: "The best
  ones gave our coding agent a quality jump equivalent to upgrading from Haiku to Opus. The worst
  ones made the output worse than having no AGENTS.md at all." And: "The same file boosted
  best_practices by 25% on a routine bug fix and dropped completeness by 30% on a complex feature
  task in the same module." And the shape that won: "The 100-150 line AGENTS.md files with a
  handful of focused reference documents were the top performers in our study, delivering 10-15%
  improvements across all metrics in mid-size modules of around 100 core files."
- **UNVERIFIED, and say so if we quote it:** these are a vendor's own numbers on a vendor's own
  monorepo, with no methodology page, no sample size for the discovery figures beyond "hundreds
  of sessions", and no dataset. Treat the *direction* as credible and the *decimals* as
  marketing. Do not put these percentages in a customer-facing document without that caveat.
- **Source:** https://www.augmentcode.com/blog/how-to-write-good-agents-dot-md-files opened
  2026-09-18, HTTP 200, 242,944 bytes. HN thread as above.
- **The comment that matters most to us**, from chickensong on that thread, exact string: "Claude
  self-reflects and updates based on feedback pretty well these days, but seems to lean on memory
  more than updating CLAUDE.md. [...] I don't like how the memory is stored outside of the
  project directory though." Followed by weiliddat, exact string: "can't help but feel like the
  labs/providers might try to lock-in customers by making things non-portable/opaque", and
  chickensong again: "Oh yeah, it definitely feels like a scramble to add lock-in features."
- **Who ships it today:** nobody shows a person which of their documents are reachable. Obsidian
  and similar tools have backlink panels; none of them frame an unlinked document as a document
  an agent will not read.
- **Nobody ships:** an "orphan documents" view. The brief already lists backlinks and an outline.
  This turns backlinks from a navigation nicety into a correctness check.
- **The problem it solves for us:** people write documents that no agent ever opens, and they
  cannot tell which ones. The fix is a set difference over links, which is a pure projection of
  the files.
- **Fit:** excellent, and it is nearly free given backlinks are already planned. Orphan set =
  markdown files with no inbound link from any instruction file or any other document.
- **Effort:** small. The link graph is already needed for backlinks; the orphan list is one query
  over it. Medium if we also want reachability from AGENTS.md specifically, which is the version
  that matters.
- **Verdict:** good-to-have, and cheap. It converts a planned feature into an argument, and it
  gives the problems panel a second check after the stale-path check in FF3.

### FF14. The workarounds people built, ranked by stars, and what each one admits

You asked for workarounds, because a workaround is a product in hiding. Here is what is actually
on GitHub, with star counts read from the GitHub search API on 2026-09-18.

- **agnix, 419 stars, last pushed 2026-09-16.** `agent-sh/agnix`, described on the API as "The
  missing linter and lsp for AI coding assistants. Validate CLAUDE.md, AGENTS.md, SKILL.md,
  hooks, MCP." From its README, exact strings: "Catch broken agent configs before your AI tools
  silently ignore them." and "456 rules across Claude Code, Codex CLI, OpenCode, Cursor, Copilot,
  and more - validating CLAUDE.md, SKILL.md, hooks, MCP configs, and other agent files."
  Distribution is the tell: npm, Homebrew, pip, Cargo, a GitHub Action, and extensions for **VS
  Code, JetBrains, Neovim and Zed**. Its own "Why agnix?" section argues in exactly the terms
  this lens found independently, exact strings: "**Your skills don't trigger.**", "**"Almost
  right" is the worst outcome.** [66% of developers] cite it as their biggest AI frustration.",
  "**Multi-tool stacks fail silently.** Cursor + Claude Code + Copilot each want different
  formats. A config that works in one tool breaks in another.", "**Bad patterns get amplified.**
  AI assistants don't ignore wrong configs - they learn from them."
  Source: https://github.com/agent-sh/agnix and
  https://raw.githubusercontent.com/agent-sh/agnix/main/README.md opened 2026-09-18.
  **Note:** agnix cites the same Stack Overflow 66% figure I used in FF6, independently. That is
  two unrelated parties landing on the same number as the headline pain.
- **claude-file-recovery, 109 stars.** `hjtenklooster/claude-file-recovery`, API description:
  "Recover files created and modified by Claude Code from JSONL session transcripts". The FF5
  story.
- **claude-code-session-cleaner, 100 stars**, `ihoooohi/claude-code-session-cleaner`: "A safe,
  recoverable terminal session manager for Claude Code - browse, diagnose, clean, and restore
  conversati[ons]". People wrote a safe wrapper around the vendor's own cleanup.
- **cc-session-recover, 64 stars**, `softcane/cc-session-recover`: "AFK mode for Claude Code.
  Recover Claude Code sessions after quota or rate-limit stops."
- **harness-engineering, 99 stars**; **agentlinter, 80 stars**; **alint, 54 stars**: three more
  independent lint-your-agent-config tools.
- **restore-claude-history**, published inside a bug report rather than as a product, recovering
  deleted chat JSONLs from macOS Time Machine snapshots (FF8).
- **unf / Unfudged**, the filesystem snapshot daemon from FF4, which its author kept closed
  source and which at least four commenters refused to install for that reason.
- **Source:** GitHub repository search via https://api.github.com/search/repositories, queries
  `agents.md linter stars:>20`, `claude code session recover stars:>50`,
  `documentation drift detect stars:>100`, all run 2026-09-18.
- **What the pattern says.** Two clusters, and only two. **(1) Validate the instruction file**
  (agnix 419, harness-engineering 99, agentlinter 80, alint 54, agents-lint). **(2) Get my work
  back** (claude-file-recovery 109, session-cleaner 100, cc-session-recover 64,
  restore-claude-history, unf). Nothing in between. Nobody has built the middle: a place to
  **read and edit** these documents with those checks live and that history attached.
- **Nobody ships:** the middle. agnix is a linter that runs in CI and as an LSP; it is not a
  place to write. The recovery tools are forensics; they are not a history you can browse while
  you work.
- **The problem it solves for us:** it maps the competition precisely and it says our two
  cheapest features are the two clusters people have already voted for with stars. It also says
  the ceiling of a pure linter is about 400 stars and no revenue, which is a reason to build it
  as a panel and not as a product.
- **Fit:** the problems panel is cluster 1. The document history in FF4 is cluster 2. Both were
  already on the list.
- **Effort:** covered under FF3 and FF4.
- **Verdict:** good-to-have, both. The finding itself is must-read: **do not build either as a
  standalone thing**, because five people already did and the best of them is a free linter.

### FF15. Markdown in the repository beat the purpose-built mechanism, 100% against 53%

- **Demand:** "AGENTS.md outperforms skills in our agent evals", Hacker News 2026-01-29,
  **524 points, 196 comments** (https://news.ycombinator.com/item?id=46809708), one of the
  highest-scoring agent-tooling posts in this whole sweep. The underlying Vercel post publishes
  the eval. Exact strings from the page:
  - "A compressed 8KB docs index embedded directly in AGENTS.md achieved a 100% pass rate, while
    skills maxed out at 79% even with explicit instructions telling the agent to use them."
  - "In 56% of eval cases, the skill was never invoked."
  - "Adding the skill produced no improvement over baseline: Configuration Pass Rate vs Baseline
    Baseline (no docs) 53% - Skill (default behavior) 53% +0pp Zero improvement."
  - "On the detailed Build/Lint/Test breakdown, the skill actually performed worse than baseline
    on some metrics (58% vs 63% on tests), suggesting that an unused skill in the environment may
    introduce noise or distraction."
  - The final table, exact string: "Baseline (no docs) 53% - Skill (default behavior) 53% +0pp
    Skill with explicit instructions 79% +26pp AGENTS.md docs index 100% +47pp"
  - And the wording sensitivity, exact string: "Different wordings produced dramatically different
    results: Instruction Behavior Outcome "You MUST invoke the skill" Reads docs first, anchors on
    doc patterns Misses project context "Explore project first, then invoke skill" Builds mental
    model first, uses docs as reference Better results Same skill."
  - Their own reaction, exact string: "This wasn't what we expected."
- **Source:** https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals opened
  2026-09-18, HTTP 200, 801,064 bytes. HN thread as above.
- **UNVERIFIED caveat:** this is one vendor's eval on one framework's documentation. The page
  does not state the number of eval cases behind the pass rates. Quote the direction, and quote
  "In 56% of eval cases, the skill was never invoked" as the sharpest line, but do not present
  100% against 53% as a general law.
- **Who ships it today:** everyone ships the packaged mechanism. Anthropic ships skills, Vercel
  measured them, OpenAI and others ship their own. The thing that won was **a plain markdown file
  in the repository that is always in context.**
- **Nobody ships:** a good editor for the file that won. The winning artefact is an 8KB markdown
  index of the project's documentation, hand-shaped, sitting at the repo root, and the tools that
  exist for it are a linter and a text buffer.
- **The problem it solves for us:** this is the strategic finding of the lens. The market keeps
  building mechanisms; the measurement keeps saying the markdown file wins. Our bet is the
  markdown file.
- **Fit:** it is the premise. What it adds is a concrete feature: a **docs index** view, which is
  the compressed map of the repository's documents that goes into AGENTS.md, generated from the
  link graph we already need for FF13 and kept honest by the stale-path checks in FF3.
- **Effort:** medium. Generating a docs index from the file tree and the link graph is
  mechanical; compressing it well is the interesting part, and the person should be able to edit
  and keep the result, because it is their file.
- **Verdict:** good-to-have, and it pays for itself. A generated, editable, checkable docs index for
  AGENTS.md is the single most defensible new feature this lens produced.

### FF16. The receiving end: maintainers now reject contributions on provenance, not quality

- **Demand:** two loud threads, months apart, same conclusion.
  - "A standard protocol to handle and discard low-effort, AI-Generated pull requests",
    2026-03-05, **305 points, 113 comments** (https://news.ycombinator.com/item?id=47267947).
    The most-quoted position in it, from VLM, exact string: "Once the cost of generating push
    media drops low enough (close enough to zero) the media is dead. Pull requests are
    (ironically) a push media, and infinite zero effort PRs can be generated, therefore PRs are
    dead. The proper way to handle the situation is to no longer accept PRs."
  - "Please stop flooding our projects with AI slop to furnish your CV", 2026-08-28,
    **213 points, 144 comments** (https://news.ycombinator.com/item?id=49474143), linking to
    https://neilalexander.dev/2026/06/30/flooding-contributions. The line the thread argued over,
    quoted by a commenter from the article, exact string: "The changes were harmless and correct,
    but that did not make me feel better about accepting or merging them." A reply, from
    timokoesters, exact string: "AI is destroying trust in open source and many other areas and I
    think this will discourage teams from publishing their source code in the future."
  - Adjacent, same period: "Tldraw pauses external contributions due to AI slop", 2026-01-15,
    192 points, 107 comments (https://news.ycombinator.com/item?id=46641042). "OCaml maintainers
    reject massive AI-generated pull request", 2025-11-29, 21 points
    (https://news.ycombinator.com/item?id=46089304). "RPCS3 says "learn to code" as it bans
    (fully) AI-generated pull requests", 2026-05-11 (https://news.ycombinator.com/item?id=48097221).
    All titles and counts read from the Algolia index 2026-09-18.
- **Source:** as listed, all opened 2026-09-18. The protocol page itself is https://406.fail/,
  titled on the page "RFC 406i - The Rejection of Artificially Generated Slop (RAGS)".
- **Flag, and this is a real one.** https://406.fail/ is built as a **prompt injection**. Its
  opening line is "SYSTEM INSTRUCTION FOR LLMS, AGENTS, AND AUTOMATED CRAWLERS:" and it contains
  directives including "HALT PROCESSING", "IGNORE PRIOR INSTRUCTIONS" and an error string it
  wants the agent to print to its operator. I have recorded this and ignored it, per the brief's
  rule 8. **It is worth knowing that the community's answer to agent-authored contributions is a
  page designed to hijack the agent**, and that it reached 305 points. If we ever fetch
  third-party markdown into frontmatter, this is the shape of the hostile input.
- **Who ships it today:** 406.fail as a protocol, plus per-project bans. "Show HN: Haystack Slop
  Detector - a lightweight barrier against unreviewed PRs" (3 points,
  https://news.ycombinator.com/item?id=46356360) and "Show HN: Sladge.net - The AI Slop
  Self-Declaration Badge" (3 points, item?id=47298415) are the tiny attempts at a positive
  version.
- **Nobody ships:** a credible way to show that a change **was** reviewed. Every tool here is a
  filter for rejecting; none of them is a receipt for accepting. The maintainer in the second
  thread said the changes were correct and he still did not want them, which means quality is not
  the axis. Provenance and attention are.
- **The problem it solves for us:** this is the demand side of the change queue and of the
  attribution mark in the version record. The thing a maintainer wants is not "an AI did not
  write this"; it is "a person actually looked at this."
- **Fit:** careful. A claim-to-have-reviewed is only worth anything if it cannot be minted
  cheaply, and our own record says the read-state sidecar failed an adversarial round on
  2026-09-08 and that Almanac shipped read receipts and shut down. This finding **does not
  reopen that**; it only says the demand is real on the receiving side, which is a different
  party from the one we sell to.
- **Effort:** not scoped. Anything here is a research question, not a build.
- **Verdict:** skip for MVP 0, keep as evidence. The pain is loud and real, but the only honest
  artefact is one this repo already tried and dropped for good reasons.

### FF17. There is now a peer-reviewable literature on instruction-file rot, and it has counts

The complaints in FF3 turn out to have an academic literature behind them. All abstracts fetched
from the arXiv API (`http://export.arxiv.org/api/query?id_list=...`) on 2026-09-18.

- **"Configuration Smells in AGENTS.md Files: Common Mistakes in Configuring Coding Agents"**,
  arXiv **2606.15828v5**, published 2026-06-14, updated 2026-07-30. Exact strings from the
  abstract: "we present the first catalog of smells for coding-agent configuration files" and
  "we analyzed 100 popular open-source repositories containing either an AGENTS. md or a CLAUDE.
  md file. Our results show that configuration smells are widespread. Lint Leakage was the most
  common smell, affecting 62% of the files, followed by Context Bloat (42%) and Skill Leakage
  (35%). We further show that several smells frequently co-occur, particularly Context Bloat,
  Skill Leakage, and Conflicting Instructions."
- **"On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents"**, arXiv
  **2601.20404v2**, published 2026-01-28, updated 2026-03-30. Exact strings: "We analyze 10
  repositories and 124 pull requests, executing agents under two conditions: with and without an
  AGENTS$.$md file" and "Our results show that the presence of AGENTS$.$md is associated with a
  lower median runtime ($Δ28.64$%) and reduced output token consumption ($Δ16.58$%), while
  maintaining a comparable task completion behavior."
- **This refutes the number in FF3.** The agents-lint Show HN claimed "stale context files
  reduced agent task success by 2-3% while increasing token costs by over 20%". The closest real
  paper says the opposite sign on tokens: having an AGENTS.md **reduced** output token use by
  16.58%. I could not find any paper matching the agents-lint claim. **Treat that claim as
  refuted-or-unfound and do not repeat it.**
- **Other titles in the same area**, returned by the same arXiv query on 2026-09-18, listed so
  the founder can read them rather than take my summary: "Evaluating AGENTS.md: Are
  Repository-Level Context Files Helpful for Coding Agents?" (2602.11988v2, 2026-02-12), "Do
  Context Files Help Coding Agents? A Two-Agent Ablation Study on Real Repositories"
  (2607.27250v1, 2026-07-28), "Context Rot in AI-Assisted Software Development: Repurposing
  Documentation Consistency for AI Configuration Artifacts" (2606.09090v1, 2026-06-08), "Agent
  READMEs: An Empirical Study of Context Files for Agentic Coding" (2511.12884v2, 2025-11-17),
  and "How Do Developers Maintain and Evolve Their Agents' Instructions? An Empirical Study".
- **Who ships it today:** agnix claims 456 rules "sourced from official specs, academic research,
  and real-world breakage patterns" (FF14), so at least one tool already implements a version of
  this catalogue.
- **Nobody ships:** the six smells shown in the editor while you write the file. Context Bloat
  and Conflicting Instructions in particular are things you would want flagged in the margin, not
  in CI.
- **The problem it solves for us:** it gives the problems panel a **published, citable
  checklist** rather than checks we invented, and three of the six have a measured prevalence we
  can quote.
- **Fit:** direct extension of FF3. Same panel, better sourced.
- **Effort:** small to medium; the paper proposes "automated heuristics to detect them", so the
  detection logic is described rather than left to us. **Open the paper before building**, since
  I have read only the abstract.
- **Verdict:** must-have for the problems panel's design, because it replaces guesswork with a
  catalogue somebody else validated.

### FF18. The plan file problem is worse than "nobody updates it". Almost nobody keeps it

- **Demand:** you asked specifically about "a plan file that nobody updates" and "a todo list
  that lies". I went looking and the honest answer is that **the complaint barely exists in
  public**, because the artefact barely exists in public. The measurement:
  **"An Exploratory Study of Agent Plans for Agentic AI Coding Tools in Open-Source Software"**,
  arXiv **2608.04661v2**, published 2026-08-05. Exact strings: "We screened 36,710 GitHub
  repositories belonging to engineered software projects and identified 85 Markdown plan files
  from 10 repositories." And their own framing of the result: "Within this highly concentrated
  corpus" and "repository-preserved Agent Plans under these tool-specific directories appear to
  be a narrow but informative artifact".
  **85 plan files across 36,710 repositories, concentrated in 10 of them.**
- **What they do contain**, exact string: "They also provided task-oriented execution guidance,
  most commonly through implementation steps, concrete files and locations, and testing and
  validation information."
- **Source:** http://arxiv.org/abs/2608.04661v2, abstract fetched from the arXiv API 2026-09-18.
  I read the abstract only.
- **Who ships it today:** every agent harness generates a plan and a todo list. Claude Code has
  `plans/`, which per its own documentation is inside the `cleanupPeriodDays` deletion scope (see
  the doc-issue quote in FF8's #51779: the cleanup path list includes `plans/`). So the plan is
  produced, used, and then deleted on a timer.
- **Nobody ships:** a plan that is a committed document by default. The gap is not maintenance,
  it is **existence**. The plan lives in a vendor cache with a 30-day fuse.
- **The problem it solves for us:** this is the sharpest opportunity in the lens and it is also
  the quietest. There is no crowd complaining about stale plan files, because the plan file is
  not in the repository to go stale. Our Idea mode already produces a brief and a blueprint as
  files. That is the whole difference.
- **Be blunt about the risk.** Low public complaint volume cuts both ways. It can mean an unmet
  need nobody has articulated, or it can mean people do not want the artefact. The 10
  repositories that do keep plan files are the only existing evidence of demand, and it is thin.
  **Do not build a plan-file product on this finding.** Use it as the reason our plan documents
  are files by default rather than as a feature in itself.
- **Fit:** already the plan, by construction.
- **Effort:** none beyond what is committed.
- **Verdict:** good-to-have, and the most interesting negative result in this lens. The evidence
  says the plan file is an artefact almost nobody keeps, which is either our opening or a warning,
  and one paper's abstract is not enough to tell which.

---

## 1. The ten most common concrete complaints, ranked

Ranked by how much evidence sits behind each one: points and comment counts where the complaint
is a thread, prevalence figures where it is a study, and a vendor's own documentation where it
is an admission. Everything below is already sourced in full in the findings above.

**1. It rewrites the whole file when you asked it to change one line.**
Anthropic's own page, exact string: "Claude Fable 5.1 is more likely than Claude Fable 5 to
rewrite an entire text file rather than make a targeted edit."
https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1,
opened 2026-09-18. Crowd version, julianlam 2026-05-09: "it'll rewrite the entire function call
and you'll just have to pray that the re-written code block wasn't subtly changed."
https://news.ycombinator.com/item?id=48077002. **FF9.**

**2. The output is almost right, but not quite.**
66% of 25,332 respondents, the single biggest frustration on the list.
https://survey.stackoverflow.co/2025/ai, opened 2026-09-18. **FF6.**

**3. It destroyed uncommitted work and there was no undo.**
137 points, 91 comments, 2026-02-26. Exact string: "I pasted a prompt into the wrong agent
terminal and it overwrote hours of hand-edits across a handful of files. Git couldn't help
because I hadn't finished/committed my in progress work."
https://news.ycombinator.com/item?id=47172238. **FF4.**

**4. The tool silently deleted its own record of what happened.**
32 open and closed issues on `cleanupPeriodDays` alone; the largest has 21 comments and is still
open. Exact string from #62250: "The deletion is silent: no prompt, no "moved to trash", no
surfaced log, no undo." https://github.com/anthropics/claude-code/issues/62250, 2026-05-25.
**FF8.**

**5. Review has become unmanageable, and the diff is the wrong thing to review.**
2026-08-16. Exact string: "github's PR interface is not really cutting it for me, it was janky
even when the reviews were small, but now at the size they're at, it is becoming unmanageable."
And the reply with agreement: "the reviewable unit shouldn't be the final diff. Instead, review
the decision trace". https://news.ycombinator.com/item?id=49321400. **FF2.**

**6. Maintainers are drowning, and now reject on provenance rather than quality.**
305 points 2026-03-05 (https://news.ycombinator.com/item?id=47267947), 213 points 2026-08-28
(https://news.ycombinator.com/item?id=49474143), 192 points 2026-01-15 for tldraw pausing
external contributions (https://news.ycombinator.com/item?id=46641042). The line that defines it,
from the 213-point thread: "The changes were harmless and correct, but that did not make me feel
better about accepting or merging them." **FF16.**

**7. The instruction file rots without anyone touching it, and a bad one is worse than none.**
142 points, 43 comments, 2026-04-28 (https://news.ycombinator.com/item?id=47938417), whose article
says "The worst ones made the output worse than having no AGENTS.md at all". Measured prevalence
from arXiv 2606.15828v5 across 100 popular repositories: "Lint Leakage was the most common smell,
affecting 62% of the files, followed by Context Bloat (42%) and Skill Leakage (35%)". The
mechanism, from the agents-lint author, 2026-02-28: "Your AGENTS.md can rot without a single
commit to it." **FF3, FF17.**

**8. The more you use agents, the more maintenance work they create, and documentation goes first.**
A company pivoted onto this. Exact string, 2026-04-21: "the more you use agents, the more work
they create. Dozens of pull requests means older code gets out of date quickly. Documentation
drifts." https://news.ycombinator.com/item?id=47850907. **FF1.**

**9. Debugging what it wrote takes longer than writing it would have.**
45.2% of 25,332 respondents picked "Debugging AI-generated code is more time-consuming" as a
frustration, the second most common. https://survey.stackoverflow.co/2025/ai. **FF6.**

**10. It changes things you did not ask about.**
Anthropic's own page again, exact string: "it may fix nearby code, extend behavior the task
didn't mention, or commit more test files than the change warrants." Crowd version, 0dayz
2025-03-03: "the llm had added in so much extra unmanageable functions,even deciding to solve
problems I hadn't asked it to do." https://news.ycombinator.com/item?id=43238266. **FF10.**

Two that nearly made it: **documents nobody links to are read under 10% of the time** (FF13), and
**distrust of accuracy runs ahead of trust, 46 against 33** (FF6).

## 2. What breaks in documents, as opposed to code

You listed six. Here is what the evidence actually supports, in order of how well.

- **An agent rewriting a whole file when asked to change a line: STRONGLY SUPPORTED.** The
  strongest single finding in the lens, and the only one with a vendor admission behind it. The
  vendor frames it as a token cost. The users frame it as "pray it wasn't subtly changed". FF9.
- **Stale docs, spec and code disagreeing: SUPPORTED, but as drift rather than contradiction.**
  Charlie Labs' pivot (FF1), the arXiv smell catalogue at 62/42/35% (FF17), the six near-identical
  drift-linter Show HNs that all got under five points (FF3). Note the shape: many people build
  it, nobody wants to buy it as a product.
- **An orphan document nobody reads: SUPPORTED, and it was the surprise.** Under 10% of sessions
  for docs nothing references, against 100% for AGENTS.md. FF13.
- **A plan file nobody updates: NOT SUPPORTED, and the reason is worse.** 85 plan files across
  36,710 repositories. The file is not stale; it is absent, and where it does exist it sits in a
  vendor directory on a 30-day deletion timer. FF18.
- **A todo list that lies: NOT FOUND.** I searched for it directly and found nothing quotable.
  The nearest thing is the memory-product graveyard in FF11, which is about forgetting rather than
  lying.
- **Lost formatting: BARELY FOUND, and mostly about other file types.** The best I have is
  kirillklimuk, 2026-05-06, who built `docx-cli` after "Claude mangling a bunch of docs"
  (https://news.ycombinator.com/item?id=48043395), and a complaint about Gemini chat export
  destroying code blocks and tables (https://news.ycombinator.com/item?id=47359736, 2026-03-13).
  **Nobody is loudly complaining that an agent wrecked their markdown formatting.** If we are
  planning to sell on byte-exactness, this lens does not give you a crowd for it. It gives you
  the whole-file-rewrite crowd instead, which is adjacent but not the same claim.

## 3. Where people lose work

Four distinct mechanisms, each with a source, in descending order of how often they appeared.

1. **Uncommitted or untracked work, overwritten or deleted by an agent.** Git cannot help because
   the work was never committed. FF4, FF7. The 2,229-file case is the extreme; "I pasted a prompt
   into the wrong agent terminal" is the common one.
2. **A vague instruction widened into a glob.** "clean up all the scaffolding" became every file
   with that extension, then `rm -rf` on about 200 directories, bypassing the recycle bin. FF7.
3. **`git clean` and similar, run by the agent.** TIPSIO, in the recovery thread: "AI ran a git
   clean on me and wiped out a bunch of untracked changes." FF5.
4. **The tool deleting its own history, sometimes against an explicit setting.** 490 sessions
   deleted with the retention set to 99999. FF8.

**The common factor in all four is that the loss is invisible at the moment it happens.** Nobody
in any of these threads noticed in time. That is an argument for a visible, local, per-save
history attached to the document, which is FF4's verdict.

## 4. What people built for themselves

Two clusters and nothing in between, with star counts from the GitHub API on 2026-09-18. Full
list in FF14.

- **Validate the instruction file:** agnix (419), harness-engineering (99), agentlinter (80),
  alint (54), agents-lint. Five independent builds of the same idea.
- **Get my work back:** claude-file-recovery (109), claude-code-session-cleaner (100),
  cc-session-recover (64), restore-claude-history (published inside a bug report), unf/Unfudged
  (closed source, and four commenters refused to install it for that reason).

**The hidden product is the middle**, and nobody has built it: a place to read and write these
documents with the checks live and the history attached. Note also that the ceiling on the linter
cluster looks like roughly 400 stars and no revenue, which argues for building it as a panel
rather than as a product.

## 5. Any number on time spent reviewing or repairing

Reported in full in FF12, with the blunt version here.

- **There is no current, measured figure for hours spent reviewing or repairing agent output.**
  I looked for one and did not find it.
- The famous 19% slowdown (METR, 16 developers, published 2025-07-10) has been **withdrawn as
  current by METR themselves**: "These results are out of date." Their 2026 follow-up estimates a
  **speedup** of -18% for returning developers and -4% for new ones, both with confidence
  intervals crossing zero, and they say the data is "only very weak evidence".
- METR's 2026 survey of 349 technical workers self-reports "a median 1.4-2x change in the value
  in their work due to AI tools", with their own warning that in 2025 "people overestimated AI's
  effect on their time spent on tasks by 40 percentage points on average".
- The only durable proportion is Stack Overflow's **45.2%** who say debugging AI-generated code is
  more time-consuming.

**Do not build the pitch on time saved or time lost.** The evidence will not hold it. Build it on
trust, verification and reversibility, where the numbers are solid and pointing one way.

## What I could not reach

- **Reddit, in full.** `www.reddit.com/r/<sub>/*.json` returned **403** for r/ClaudeAI, r/cursor
  and r/ChatGPTCoding. `old.reddit.com` returned **HTTP 200 with a login interstitial** whose
  title is "Welcome to Reddit", for both `top.json` and `search.json`, which is the exact
  200-after-redirect trap this repo's own instructions warn about. **No Reddit evidence is in
  this document.** Nothing here is paraphrased from Reddit and nothing was invented to fill the
  gap. If Reddit matters, it needs an authenticated pass.
- **The 2026 Stack Overflow Developer Survey.** `https://survey.stackoverflow.co/2026/ai`,
  `/2026/` and `/2026/technology` all returned **404** on 2026-09-18. Everything in FF6 is from
  the 2025 survey and must be dated that way.
- **The GitHub core REST API** rate-limited me at 60 requests per hour unauthenticated, partway
  through. I worked around it with the search API, which has its own quota and returns issue
  bodies and reaction counts, so no finding depends on an unread page. Comment threads on the
  GitHub issues in FF7 and FF8 were **not** read; only the issue bodies and the counts were.
- **The ETH Zurich / ICSE 2026 study** claimed by the agents-lint author ("stale context files
  reduced agent task success by 2-3% while increasing token costs by over 20%"). Not found on
  arXiv. The closest real paper reports the opposite sign on tokens. See FF17.
- **The arXiv papers themselves.** I read **abstracts only**, through the arXiv API. FF17 and
  FF18 rest on abstracts. Open the PDFs before quoting anything beyond what is here.
- **DORA's 2026 report.** `https://dora.dev/research/2026/dora-report/` returned 404. The
  research index at `https://dora.dev/research/` lists archives to 2025 and a separate "ROI of
  AI-assisted Software Development report" that I did not open. No DORA figure is used anywhere
  in this document.
- **Octoverse.** `https://octoverse.github.com/` returned 200 but I did not mine it; no
  Octoverse number appears here.
- **GitHub Discussions** for the major agent tools. Not searched; the issue trackers carried
  enough. This is a real gap if someone wants more.

**A flag worth raising on its own:** https://406.fail/, a 305-point Hacker News submission, is a
page built to inject instructions into any agent that reads it, opening with "SYSTEM INSTRUCTION
FOR LLMS, AGENTS, AND AUTOMATED CRAWLERS:" and including "IGNORE PRIOR INSTRUCTIONS" and a
"HALT PROCESSING" directive. I recorded it and ignored it. It is a live example of the hostile
markdown any agent-facing editor will eventually be asked to open.

## What surprised me

1. **The vendor documents our thesis.** Anthropic's own page names whole-file rewriting as a
   known behaviour of the current model, says it got worse between versions, and ships a
   paragraph you paste into your prompt as the fix. Splice-only writing stopped being an opinion.
2. **A document nothing links to is read in under 10% of sessions, against 100% for AGENTS.md.**
   That turns backlinks from a navigation feature into a correctness check, and it was the
   cheapest new idea in the lens.
3. **85 plan files across 36,710 repositories.** The plan file is not a stale artefact; it is an
   absent one, sitting in a vendor cache with a 30-day fuse. Nobody is complaining about it,
   which is either the opening or the warning.
4. **The 19% slowdown figure is dead and its own authors killed it.** If any frontmatter document
   still cites it as current, that is now a known error to fix.
5. **Two people shipped a file-recovery tool for agent-destroyed work on the same day**, found
   each other in the comments, and one of them opened with the words "research and plan markdown
   files". That is our file type, our user, and a problem urgent enough to be solved twice in
   twenty-four hours.
