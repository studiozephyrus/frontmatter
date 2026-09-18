# Lens A. What users of agentic coding tools are loudest about missing

Where it touches documents, markdown, specs, context files, or reviewing what the agent did.

Opened and counted on 2026-09-18 (local IST; `date -u` at the start of the run read
2026-09-17 23:51 UTC, so the UTC stamp on some API reads is 17 September).

Method: GitHub REST search API, unauthenticated, `sort=reactions-+1&order=desc` over
`is:issue is:open` per repository. Every reaction count below was read off the API response
for that issue, not off a rendered page and not from memory. Where a count comes from a
comment thread rather than the issue reaction block, it says so.

Counts move. Each one is a reading taken on the date stated.

One deliberate exception to the brief's no-dashes rule. Three long dashes survive in this file, on
two lines, and **both lines are block quotes copied character for character from a source page**.
Editing a quotation to satisfy a house style rule would make it a paraphrase inside quotation marks,
which is the exact failure the brief's rule 2 exists to prevent. Evidence wins over style. Every
dash outside a block quote is a plain hyphen.

---

### FA1. Undo the agent, and undo it for files git never saw

- **Demand:** openai/codex#9203, titled `Please make "/undo" back`, carries **452 thumbs-up, 497 total
  reactions and 76 comments**, opened 2026-01-14, still open on the day this was read. It is the
  second most reacted open issue in the whole `openai/codex` repository. The body names the two
  cases exactly, and this is copied from the page:
  > It quite useful when:
  > 1. codex unintenally deletes some files which is not tracked by git.
  > 2. codex unintenally modify something when something is not git committed.
  > It bites me several times in recent days and I miss the /undo feature each time.

  The same want shows up all over the neighbouring repositories: codex#19205 `Undo functionality
  should never depend on Git repository presence` (9 thumbs-up), codex#2379 `Undo / redo typing`
  (33), codex#15367 `VS Code extension should show exact in-editor change locations like Copilot,
  and Undo/Revert must be reliable` (13), anomalyco/opencode#33940 `Undo in one session reverts all
  sessions` (2), anthropics/claude-code#93262 `[Bug] File edits via bash bypass version tracking and
  break undo functionality` (2). A search across the nine repositories for `undo in:title` on open
  issues returns **47** results.
- **Source:** https://api.github.com/repos/openai/codex/issues/9203 and
  https://github.com/openai/codex/issues/9203, both opened 2026-09-18. Cross-repository count from
  the GitHub search API, query `is:issue is:open undo in:title` over the nine repositories, same day.
- **Who ships it today:** Cursor ships checkpoint restore. Claude Code ships `/rewind`. Cline ships
  a checkpoint system. All three are priced inside the assistant subscription, not separately.
- **Nobody ships:** undo that survives the two cases the issue names, a file git was never tracking
  and a change never committed. Every implementation above leans on git or on a shadow git, and the
  bug reports attached to each of them are about exactly the moment the git assumption breaks.
- **The problem it solves for us:** a person lets an agent loose on a folder of notes and wants the
  last twenty minutes back. Notes are almost never in git, which is precisely the population the
  codex issue is complaining about.
- **Fit:** very close. The change queue already holds each change as a discrete unit awaiting accept
  or reject. Keeping the pre-image bytes of an accepted change, keyed by byte range, turns the queue
  into a timeline you can walk backwards, with no git anywhere. Splice-only writing means the
  pre-image is a byte range and not a whole-file copy.
- **Effort:** medium. The queue and the splice journal exist in the plan. What is new is retention
  policy, a restore path that refuses on conflict, and a visible timeline.
- **Verdict:** good-to-have, and the strongest single receipt in this lens. Undo is not on the
  decided list, and it is the loudest document-shaped ask in any of these repositories.

### FA2. Rewind that moves the conversation and the files together, with a preview before it reverts

- **Demand:** openai/codex#11626, `CLI: Add /rewind checkpoint restore that reverts both chat context
  and Codex-applied code edits`, **221 thumbs-up, 222 total, 42 comments**, opened 2026-02-12. The
  body is unusually specific and the following is copied from the page:
  > **Current behavior**: Esc rewind only rewinds conversation/history (fork point), but does not revert code changes made after that point.

  and the requested shape, again copied:
  > - `/rewind` shows recent checkpoints with:
  >     - timestamp
  >     - prompt snippet
  >     - files changed
  > - Selecting a checkpoint rewinds chat and reverts Codex-made edits after that checkpoint.
  > - Provide a pre-apply preview of file changes to be reverted.
  > - Allow editing the restored prompt before resubmitting.

  and the safety clause, copied:
  > - Only revert Codex-created edits after the selected checkpoint.
  > - Do not touch unrelated local changes that existed before checkpoint creation.
  > - If any file cannot be cleanly restored, show conflicts and require explicit confirmation before partial apply.

  and the author's own verdict on the present state, copied:
  > Workarounds today (`/diff`, `!git diff`, manual `git restore/reset`) are useful but fragmented.

  Related open issues: codex#2788 `History-linked checkpoints and file state restore` (43), codex#3585
  `Support restore to checkpoint automatically just like Cursor?` (31), codex#27636 `Add a rewind
  workflow for context and code timeline management` (8), codex#22100 `Add Claude Code-style
  rewind/remind with file-state-safe branching` (1). The shipped implementations are visibly leaky:
  anthropics/claude-code#87575 `[Bug] Auto mode system prompt causes /rewind to silently fail on
  Bash-edited files` (39), claude-code#24471 `Rewind history lost after compaction in sessions with
  many rewinds (branching tree)` (18), claude-code#14002 `[BUG] /rewind shows "Restore code" option
  intermittently or fails to restore files` (11), claude-code#91733 `[Bug] Rewind does not restore
  file content for untracked files edited in session` (1). A `checkpoint in:title` search over the
  nine repositories returns **64** open issues, `rewind in:title` returns **38**.
- **Source:** https://api.github.com/repos/openai/codex/issues/11626 opened 2026-09-18; cross-repo
  counts from the GitHub search API the same day.
- **Who ships it today:** Cursor and Claude Code ship a version. Both ship it without the
  pre-apply preview and without the "only revert what the agent did" guarantee, which is what the
  bug reports above are about.
- **Nobody ships:** the preview before the revert, and the refusal on conflict. Note how closely the
  safety clause the author wrote matches our own refusal rule.
- **The problem it solves for us:** a person wants to say "put it back to before I asked for that"
  and see what putting it back will cost before it happens.
- **Fit:** strong, and it is nearly the change queue read in reverse. Each queue entry already has a
  byte range and an author. A rewind is a queue of reverse splices, presented for accept or reject
  one by one, refusing where the range has moved.
- **Effort:** medium, and mostly shared with FA1.
- **Verdict:** good-to-have. FA1 and FA2 are one feature with two names; build the timeline once.

### FA3. Review all the agent's changes together, in the editor, before any of them land

- **Demand:** two separate repositories, two separate crowds, same ask.
  openai/codex#2998 `IDE-integrated diff / approval`, **233 thumbs-up, 233 total, 67 comments**,
  opened 2025-08-31, still open. Copied from the page:
  > Codex CLI already has a good approval flow: it can show red/green diffs in the terminal and ask the user to approve or reject changes. This works well, but currently it only happens in the terminal.

  and:
  > Let the user approve, approve for session, or reject from there

  anthropics/claude-code#33932 `[FEATURE] VS Code Extension: Diff review UI similar to GitHub Copilot
  Edits Review`, **194 thumbs-up, 271 total reactions**. Its meta description, copied from the
  rendered page, begins:
  > When Claude Code modifies files in the VS Code extension, there i...

  (truncated by GitHub's own meta tag; I could not open the full body, see the unreachable list).

  Also open: anthropics/claude-code#31888 `Add batch diff review mode: show all changes together
  before approval (like Cursor's native agent)` (53), claude-code#18541 `[FEATURE] Improve diff view
  to show session changes only (exclude read files)` (18), claude-code#29388 `[FEATURE] VS Code
  Extension: Option to always show file diffs in VS Code editor panel instead of inline chat` (68),
  claude-code#8660 `[BUG] Edit preview/diff not showing in VSCode extension UI when confirming
  changes` (92), anomalyco/opencode#17076 `CLI/TUI multi-file apply_patch approval only shows first
  file diff` (26), codex#35156 `Codex not showing diff` (40), codex#10503 `Codex "Review" panel
  intermittently loses diff list ("No diff data") and "Undo" does nothing` (5). A `diff in:title`
  search over the nine repositories returns **294** open issues; `review in:title` returns **513**.
- **Source:** https://api.github.com/repos/openai/codex/issues/2998 and
  https://github.com/anthropics/claude-code/issues/33932, both opened 2026-09-18.
- **Who ships it today:** Cursor ships a native batch review. GitHub Copilot ships Edits Review, and
  it is named as the thing to copy in the title of claude-code#33932. Both are inside the
  subscription.
- **Nobody ships:** batch review over prose. Every implementation above is a code diff in a code
  editor. Nothing here reviews a paragraph an agent rewrote in a document.
- **The problem it solves for us:** this is our change queue, and it is the single most requested
  interaction pattern in the lens after undo. It is worth knowing that the thing we already decided
  to build is the thing 233 and 194 people respectively are asking two different vendors for.
- **Fit:** already decided, so this is a confirmation rather than a gap. The transferable part is the
  detail: **approve for session** as a third option next to accept and reject, and
  claude-code#18541's point that a review view should show what changed and not what was merely read.
- **Effort:** small as an increment on the decided queue. "Approve for session", scoped to one
  document or one kind of change, is a policy on the queue, not new machinery.
- **Verdict:** good-to-have as an increment. The queue is decided; **approve for session** and
  **changed-only, not read-only** are the two details worth stealing.

### FA4. One instruction file, composable, with includes, that every tool reads

- **Demand:** the loudest context-file thread in this lens, by a distance.
  anthropics/claude-code#31005 `Support for AGENTS.md and .agents/skills/, the community has been
  asking since August 2025`, **376 thumbs-up, 506 total reactions, 23 comments**, opened 2026-03-05,
  open. Copied from the body:
  > **Not a single one has received a response from anyone at Anthropic.** The main issue (#6235) has over three thousand upvotes and two hundred comments from the community, and the only responses are from a bot closing duplicates. 7 months. 3,020 upvotes. Zero acknowledgment.

  The 3,020 figure is that issue author's claim about a different issue, #6235; I record it as their
  claim and verify #6235 separately below rather than repeating it as mine.

  Alongside it: anthropics/claude-code#34235 `Feature request: support AGENTS.md as a native context
  file alongside CLAUDE.md` (111 thumbs-up, 130 total); claude-code#78977 `Feature Request: native
  AGENTS.md support (duplicate of #6235, filed deliberately)` (15). And on the composition side,
  which is the part nobody has:
  openai/codex#12115 `Dynamically loading nested AGENTS.md` (**113**), codex#6038 `Ability to include
  files in AGENTS.md` (37), codex#17401 `feat: @include directive for composable AGENTS.md files`
  (23), codex#23788 `feat: auto-load all .md files from ~/.codex/instructions/ (modular companion to
  ~/.codex/AGENTS.md)` (9), codex#3853 `Support global/centralized instructions/AGENTS.md +
  configuration` (11), RooCodeInc/Roo-Code#11368 `[ENHANCEMENT] Support .agents/skills folder` (3),
  Aider-AI/aider#4363 `Documentation Suggestion: Recommend AGENTS.md for Coding Conventions to
  Support Agent Rules Standard` (19), aider#3303 `Feature suggestion: implement Cursor Rules support,
  or equivalent` (23 thumbs-up, 37 total). Failure modes people report:
  openai/codex#13386 `AGENTS.md is silently truncated and instructions near the end ignored` (11),
  google-gemini/gemini-cli#13852 `` `GEMINI.md` instructions are ignored `` (16),
  anthropics/claude-code#53223 `[BUG][SECURITY] CLAUDE.md/AGENTS.md instruction compliance is
  architecturally unenforced` (5), claude-code#89825 `Root AGENTS.md not auto-loaded at session start
  when no CLAUDE.md exists` (2). An `AGENTS.md in:title` search across the nine repositories returns
  **86** open issues.
- **Source:** https://api.github.com/repos/anthropics/claude-code/issues/31005 opened 2026-09-18;
  cross-repository counts from the GitHub search API the same day.
- **Who ships it today:** every tool ships its own file. Claude Code reads CLAUDE.md, Gemini CLI
  reads GEMINI.md, Codex and Cursor and Aider and Roo read AGENTS.md or their own rules format.
  Copilot ships custom instructions, which is its own second most reacted open feature request,
  microsoft/vscode-copilot-release#563 `Custom Instructions`, **151 thumbs-up, 199 total**.
- **Nobody ships:** an editor for these files. Every request above is aimed at the runtime that
  reads the file. Nobody is offering the writer of the file a place to write it, see what a given
  tool will actually load, see the include graph, or see that the tail got truncated. codex#13386 is
  literally a person discovering after the fact that the end of their file was dropped.
- **The problem it solves for us:** the instruction-files screen is already on the decided list. The
  receipt says the screen needs three things beyond listing the files: resolve the includes, show the
  merge order across the nested files, and show the size against the limit that truncates them.
- **Fit:** native. These are markdown files on disk. A projection that shows the resolved, merged,
  ordered text with each line attributed to its source file is exactly a deterministic projection.
- **Effort:** small to medium. Listing is decided; resolving `@include` and nesting and showing a
  byte budget is a week on top.
- **Verdict:** good-to-have, and the cheapest high-signal upgrade in this lens, because the screen is
  already in the plan and the receipts say what it is missing.

### FA5. Plan files the person controls: where they live, what they are called, how they are reused

- **Demand:** anthropics/claude-code#12619 `[FEATURE] Allow setting plan naming scheme per-repo`,
  **120 thumbs-up, 167 total reactions, 10 comments**, opened 2025-11-28. The body is a description
  of an entire markdown-plan workflow that a vendor broke. Copied from the page:
  > I have established a discipline around using plan files:
  > - I place them in a plans/ directory in my repo
  > - I name them `PLAN-xxxx-some-description.md`
  > - I leave them around and refer to them by name in future prompts even after completion: "In PLAN-XYZU we did this in a certain way, lets do it again that way"

  and, copied:
  > I keep them checked in and can refer to how they've changed over time
  > I can review and iterate them before actually implementing them

  and the complaint, copied:
  > The new plans feature places plans in a hidden my home directory with meaningless names, it also places them outside the repo where I am doing work, and plan mode now seems confused when I refer to "plan files" in planning mode, thinking I am referencing the home directory location.

  Alongside: anthropics/claude-code#14866 `Feature Request: Configurable Plan File Storage Path &
  Plan Templates` (44), openai/codex#10486 `Plan mode: add "Export plan to Markdown" option` (23),
  codex#10561 `[Feature Request] Plan Mode: Add "Copy Plan" button & "Clear Context and Start Coding"
  workflow` (38), anthropics/claude-code#18599 `[FEATURE] Change Default Plan Mode Exit Option` (39).
- **Source:** https://api.github.com/repos/anthropics/claude-code/issues/12619 opened 2026-09-18.
- **Who ships it today:** Claude Code, Codex and Cline all have a plan mode. All three keep the plan
  in the tool. Codex users are asking for a button to get the plan out as markdown, which tells you
  where it currently is not.
- **Nobody ships:** the plan as a first-class document that lives in the repository, has a stable
  name, is diffable over time, and is re-openable by name a month later. The person in #12619 built
  that by hand out of a directory and a naming convention, and a vendor took it away.
- **The problem it solves for us:** this is the clearest description in the lens of a user who wants
  a markdown editor and does not know it. Everything they list is a file property: a location, a
  name, a history, a review pass before execution.
- **Fit:** direct. Idea mode already produces a brief and a blueprint. The transferable detail is
  that the artefact must be a named file in the user's own tree with a history, not a thing held
  inside the product, and that a person wants to iterate it before anything executes.
- **Effort:** small. A naming scheme, a folder, a template list and a "this plan, previous versions"
  view over files that already exist.
- **Verdict:** good-to-have. It also argues that the idea-mode kit should be writable into the
  repository under the user's naming scheme, not only published to an unlisted link.

---

**Note on FA1 to FA5.** These were written before the coordinator redirected this lens away from
the GitHub issues API, which had already been swept into `Z3-agent-tool-demand.md`. They overlap
Z3 on four issues (codex#9203, codex#2998, codex#11626, copilot#563) and I have left them in
because they carry material Z3 does not: the verbatim bodies, the cross-repository counts for
`undo`, `checkpoint`, `rewind`, `AGENTS.md`, `diff` and `review`, and two clusters Z3's twelve-row
cut did not reach, the composable instruction file (FA4) and the plan file as a document (FA5).
Everything from FA6 onward is off the tracker and covers what Z3 could not.

---

## Part two. The Cursor forum, and the other places without an API

**Method for this part.** forum.cursor.com runs Discourse, which serves JSON at the same paths as
HTML. I read `/site.json` for the category map, `/c/ideas/feature-requests/5/l/top.json?period=all`
for the ranked list, `/search.json` for terms, and `/t/<id>.json` for each thread. Discourse reports
two like numbers and I give both: `topic_like_count` is likes on every post in the thread,
`OP_likes` is likes on the first post alone. Feature Requests is category 5 under Ideas and holds
**6,610 topics** (from `/site.json`, read 2026-09-18).

**An honest calibration first.** The top of Cursor's Feature Requests by likes is almost entirely
model availability, pricing and platform: `Student Verifications outside USA and organizations
without .edu email` (2,435 likes), `Jupyter Notebook support` (362), `Add GLM 4.5 as a Cursor /
Auto model` (404), `Kimi K2 in Cursor` (269), `Seamless Account Switching in Cursor` (276). The
brief excludes all of that. The document-shaped asks on this forum are real but they are an order
of magnitude quieter, in the tens of likes, not the hundreds. I am reporting them as tens.
Source for the ranked list: https://forum.cursor.com/c/ideas/feature-requests/5/l/top.json?period=all
opened 2026-09-18.

### FA6. Get the session out as a document, because the session *is* the document

- **Demand:** forum.cursor.com topic 144, `How do I export chat with AI?`, **154 topic likes, 30 on
  the first post, 55 posts, 10,920 views**, opened 2023-08-25 and still the forum's loudest
  document-shaped thread. Copied from the page:
  > Screenshot is not an option, as I need to be able to search through it, and copy/paste content.

  Topic 1578, `Exporting and Renaming "Chats"`, **52 topic likes, 14 on the first post, 18 posts**,
  opened 2023-11-11. Copied, and this is the sentence that matters most in this entire lens:
  > I want to store my understanding of code somewhere else as documentation, can you guys provide a way to export the chat and also to rename them so that we can keep track of which chat has which questions rather than just the first question.

  Topic 36454, `Sharing chat/composer sessions`, 10 topic likes, opened 2024-12-21. Copied:
  > Any plans to implement this, or even let me save the session as a .md or something I could share?

  The same ask on the trackers: anomalyco/opencode#9387 `[FEATURE]: opencode session export to
  markdown or json` (16 thumbs-up), anthropics/claude-code#54670 `[FEATURE] VSCode extension: Copy
  chat response as markdown source` (38).
- **Source:** https://forum.cursor.com/t/how-do-i-export-chat-with-ai/144,
  https://forum.cursor.com/t/exporting-and-renaming-chats/1578,
  https://forum.cursor.com/t/sharing-chat-composer-sessions/36454, all opened 2026-09-18.
- **Who ships it today:** almost nobody, three years after the first thread. Cursor has no native
  export; the thread is full of third-party extensions. Claude Code has no export to markdown.
  opencode's export request is open.
- **Nobody ships:** an export that is a document rather than a transcript dump. All three requests
  above name the same three properties, and they are properties of a file, not of a log: a
  **name you chose**, **searchable text**, and **a place it lives**.
- **The problem it solves for us:** the transcript of a working session is the most valuable
  undocumented artefact in agentic work, and every tool treats it as exhaust. Turning a session into
  a named, editable, searchable markdown file in the user's own tree is a five-line import away from
  a product we already have.
- **Fit:** native, and it is an import rather than a feature. Import from Notion, Obsidian, Word and
  Drive is on the decided list. A session transcript is one more importer, and the output is an
  ordinary markdown file that then gets the editor, the search, the backlinks and the tags for free.
- **Effort:** small per source, and it multiplies. One parser per tool's transcript format.
- **Verdict:** good-to-have, and cheap. INFERENCE: this is also a distribution wedge rather than
  only a feature, because the person arrives with a file they already care about.

### FA7. Markdown preview, and the moment a coding tool accidentally becomes a document tool

- **Demand:** Cursor shipped an inline markdown preview you can type into, and the forum immediately
  filled with requests to make it a real editor. Topic 151125, `Show images in markdown 'Preview'
  mode`, **19 topic likes, 9 on the first post, 11 posts**, opened 2026-02-07. Copied:
  > It is great that you can edit Markdown files directly in ‘Preview’ mode!
  >
  > However when an image is referenced in the md file it is not rendered in preview mode

  Topic 155395, `[Feature Request] Allow Searching in the Markdown Preview Rendering`, **11 topic
  likes, 7 on the first post**, opened 2026-03-20. Copied:
  > Right now, searching can only be done in the raw file.

  Topic 159934, `Expose customization settings for inline Markdown Preview`, **8 topic likes, 8 on
  the first post**, opened 2026-05-06. Copied:
  > Cursor appears to have two separate Markdown preview paths

  Topic 7190, `Render mermaid markdown in chat`, **12 topic likes, 10 on the first post**, opened
  2024-08-07. Copied, and note the workflow it describes:
  > I find my self often asking for a mermaid diagram of the data and control flow and then copying into a blank markdown file to preview it.

  On the trackers: anthropics/claude-code#13600 `[FEATURE][CLI] Markdown renderer support in Claude
  Code CLI` (61 thumbs-up), claude-code#43113 `[FEATURE] Add a flag that tells Claude Code to emit
  long lines for prose/markdown content and let the terminal wrap` (68), openai/codex#18906 `TUI:
  support Markdown math rendering for inline and block LaTeX` (27), codex#23402 `Codex App: inline
  LaTeX using $...$ does not render in conversations or Markdown preview` (13). A `markdown in:title`
  search over the nine agent repositories returns **184** open issues.
- **Source:** the four forum URLs above under `https://forum.cursor.com/t/<slug>/<id>`, and the
  GitHub search API, all opened 2026-09-18.
- **Who ships it today:** VS Code and Cursor ship a preview webview. Cursor ships an inline preview
  you can edit in. Neither renders a referenced image in that inline mode, neither lets you search
  the rendered text, and one of them has two preview paths that disagree about settings.
- **Nobody ships:** a preview that is the editor. Every complaint above is a symptom of preview and
  source being two different surfaces that fall out of sync.
- **The problem it solves for us:** doc mode over the same file is already the decided headline. The
  receipts say what specifically to be good at from day one: render referenced local images, make
  the rendered text searchable with the cursor landing in the source, and render mermaid where the
  person is rather than in a scratch file they open to preview it.
- **Fit:** this is the projection law doing the work it was designed for. One file, one cursor
  position, two renderings.
- **Effort:** small as an acceptance test, since doc mode is being built anyway. Write the three as
  gates: image renders, find-in-rendered-text maps to a byte offset, mermaid renders in place.
- **Verdict:** good-to-have as a gate rather than a feature. The value here is knowing exactly where
  the incumbent's version breaks.

### FA8. Lock a file so the agent cannot touch it

- **Demand:** forum.cursor.com topic 53563, `Protect Files from Accidental Changes with a Lock
  Feature`, **16 topic likes, 12 on the first post, 9 posts**, opened 2025-02-23. Copied:
  > I would love to see a feature that allows me to lock certain files from my codebase in Cursor AI, preventing them from being accidentally modified by the AI.

  and:
  > Data Integrity: Ensures that critical files are not altered un

  (the body is cut at that point in the excerpt I extracted; the sentence continues on the page).

  The adjacent damage reports: topic 150376, `Add confirmation before executing "Undo All" from chat
  bar button`, opened 2026-01-30, 1 like. Copied:
  > I’ve accidentally clicked the Undo All button in the chat’s bottom bar several times and lost all changes made in that session.
  > Asking the chat to recover everything doesn’t work reliably: some edits are restored, but others stay different or unchanged.

  Topic 67695, `How to stop automatic application of changes to files`, **4 topic likes**, opened
  2025-03-21. Copied:
  > Then it automatically applies the changes of that chat to my current files. This is not intended and my current progresses are lost.
- **Source:** https://forum.cursor.com/t/protect-files-from-accidental-changes-with-a-lock-feature/53563,
  https://forum.cursor.com/t/add-confirmation-before-executing-undo-all-from-chat-bar-button/150376,
  https://forum.cursor.com/t/how-to-stop-automatic-application-of-changes-to-files/67695,
  all opened 2026-09-18.
- **Who ships it today:** nothing in this set ships a per-file lock the agent respects. Permission
  systems in Claude Code and Codex gate the *tool*, not the *file*.
- **Nobody ships:** a mark on a file that says "an agent may read this and may not write it", which
  the editor enforces rather than asks a model to respect.
- **The problem it solves for us:** in a documents repository the thing you most want protected is
  not code, it is the one page that is already right: the signed contract, the published post, the
  instruction file itself.
- **Fit:** very good, and it is enforceable rather than advisory precisely because we own the write
  path. Splice-only writing means there is exactly one place a write happens, so a lock is a check
  at that one place and a refusal is already the house behaviour on ambiguity.
- **Effort:** small. A per-path flag, a check in the splice, a refusal message, a lock state in the
  file list. The design question is where the flag lives so that it survives a clone, and the honest
  answer is a line in the instruction file rather than a hidden sidecar.
- **Verdict:** good-to-have, and unusually cheap for how much it differentiates. Nobody enforces
  this, and we are one of the few products architecturally able to.

### FA9. Rules as a folder of human-readable markdown, not one hidden file

- **Demand:** forum.cursor.com topic 14056, `Multiple .cursorrules`, **23 topic likes, 12 on the
  first post, 9 posts, 4,419 views**, opened 2024-08-31. Copied, and the second sentence is the
  whole finding:
  > It would be great to create an folder .cursorrules and inside we could put system of deifned per project cursor rules. It could be way of documenting the project.
  >
  > Also it would be great if we could create .cursorrules files with markdown extension, they could be easy to read from github as a regular docs not only for AI but for “Human inteligence” also

  Topic 40566, `Subdirectory-Specific .cursorrules Support`, **19 topic likes, 10 on the first post,
  17 posts, 4,086 views**, opened 2025-01-10. Copied:
  > Context management is the core challenge when working with AI coding assistants. The .cursorrules file is a critical part of this context management, but currently limited by its project-wide scope.

  Topic 23300, `Can we reference docs/files in the rules?`, **19 topic likes, 14 on the first post,
  15 posts**, opened 2024-10-17. Copied:
  > However, we cannot reference docs or files in the rules, so that’s a no go?

  This is the same cluster as FA4 from the other side of the market, and the forum version adds the
  part the trackers do not say out loud: people want the instruction file to be **a document humans
  read**, not a config file.
- **Source:** https://forum.cursor.com/t/multiple-cursorrules/14056,
  https://forum.cursor.com/t/subdirectory-specific-cursorrules-support/40566,
  https://forum.cursor.com/t/can-we-reference-docs-files-in-the-rules/23300, opened 2026-09-18.
- **Who ships it today:** Cursor now ships `.cursor/rules/*.mdc`, so the folder part landed. Claude
  Code ships nested CLAUDE.md. Codex is still being asked for includes.
- **Nobody ships:** the resolved view. Having a folder of rule files is not the same as being able to
  see what the agent will actually load for this file, in what order, and whether the total fits.
- **The problem it solves for us:** see FA4. The forum evidence adds the acceptance criterion: the
  instruction files screen must be pleasant to read as prose, because that is what people are asking
  their tools for and not getting.
- **Fit:** native, same as FA4.
- **Effort:** small on top of the decided screen.
- **Verdict:** good-to-have. Merge with FA4 and build one screen.

### FA10. Fork the thread, keep the file

- **Demand:** forum.cursor.com topic 101012, `Can we Fork Chats pls`, **16 topic likes, 6 on the
  first post, 10 posts**, opened 2025-06-06. Copied, and the tangle in this sentence is the point:
  > You need to be able to restore checkpoints but i don’t want to lose my prompts i have already written and that have generated either code and a text response or both, I don’t want to lose the work already done by Cursor but want to try a different prompt from a checkpoint.

  Topic 59826, `Chat History Search & Branching Conversations`, **16 topic likes, 9 on the first
  post**, opened 2025-03-05. Copied:
  > It would be super handy if chats could search through other chats to reference past info without having to copy and paste.

  On the trackers, the same want with much bigger numbers is FA2's codex#11626 (221) and
  openai/codex#41796 `historical message actions only show Copy; Edit/Fork/Rewind unavailable` (11).
- **Source:** https://forum.cursor.com/t/can-we-fork-chats-pls/101012,
  https://forum.cursor.com/t/chat-history-search-branching-conversations/59826, opened 2026-09-18.
- **Who ships it today:** Claude Code and Codex ship a conversation fork. Neither forks the files
  with it, which is what codex#11626 is 221 reactions of.
- **Nobody ships:** two candidate versions of a document, side by side, both kept, neither lost.
- **The problem it solves for us:** the honest read is that people are using checkpoint restore as
  a branching tool and hating it, because restore is destructive and what they want is a second
  draft.
- **Fit:** INFERENCE, and it is mine rather than theirs: in a document editor the answer to "fork the
  chat" is "keep both versions of the paragraph", which is a change queue with two pending entries on
  the same byte range rather than one. That is a real design question for us, since our queue accepts
  or rejects one by one and does not currently hold two rival proposals for the same range.
- **Effort:** medium, and mostly a queue-model question rather than a UI one.
- **Verdict:** good-to-have, low confidence on the shape. Worth noting as a question the queue design
  has to answer anyway: what happens when two proposals touch the same bytes.

### FA11. Show me what is in the context window, by file

- **Demand:** forum.cursor.com topic 152223, `Context Window Inspector & Agent Usage Profiler`,
  **11 topic likes, 8 on the first post, 6 posts**, opened 2026-02-18. Copied:
  > Expose a per-request breakdown of how the context window is consumed — by rules, tools, referenced files, and user input — so users can diagnose degraded responses, optimize their setups, and manage the rapidly expanding plugin ecosystem.

  On the trackers: openai/codex#4106 `Control over auto-compaction parameters` (**112 thumbs-up**),
  codex#13386 `AGENTS.md is silently truncated and instructions near the end ignored` (11),
  anthropics/claude-code#27242 `[BUG] No working mechanism to review previous context after
  compaction, plan-mode clear, or branch navigation` (**86**), codex#41622 `Add a setting to disable
  automatic conversation recaps in Codex CLI` (82), cline/cline#13263 `Cline truncates tool output &
  file content in context (forces splitting large files into chunks)` (5).
- **Source:** https://forum.cursor.com/t/context-window-inspector-agent-usage-profiler/152223 and the
  GitHub search API, opened 2026-09-18.
- **Who ships it today:** Claude Code shows a percentage remaining. Codex shows a percentage.
  Nobody itemises it by file.
- **Nobody ships:** a byte budget per instruction file, shown next to the file, before the run.
- **The problem it solves for us:** codex#13386 is a person who wrote instructions that were silently
  dropped. A document editor is the natural place to show "this file is 14 KB and the tool you are
  pointing at reads the first 8".
- **Fit:** good, and it belongs on the instruction-files screen from FA4 rather than as its own
  thing. It is a number next to a file.
- **Effort:** small, and honestly mostly research: the per-tool limits have to be found and kept
  current, and a wrong number here is worse than no number.
- **Verdict:** skip as a standalone, fold the byte-budget line into FA4. UNVERIFIED: I did not find a
  published per-tool truncation limit for any of these tools, which is itself the reason a number
  here would be hard to keep honest.

## Part three. GitHub Discussions

**Availability check, done first.** `https://github.com/anthropics/claude-code/discussions` returns
**HTTP 404** and `https://github.com/anomalyco/opencode/discussions` returns **HTTP 404** (both
`curl -sI`, 2026-09-18 00:04 UTC), so neither repository has Discussions enabled and there is
nothing to read. `sst/opencode` now redirects to `anomalyco/opencode` (the GitHub API for
`sst/opencode` returns `full_name: anomalyco/opencode`, 208,190 stars, 5,853 open issues, read
2026-09-18), which is probably why the coordinator's authenticated sweep got HTTP 422 for it.

That leaves **github/spec-kit** and **block/goose**, both read as HTML from
`/discussions?discussions_q=is%3Aopen+sort%3Atop` and parsed for the `aria-label="Upvote: N"`
attribute GitHub puts on each row's vote button. block/goose's whole discussion board tops out at
**13 upvotes** and is mostly roadmap announcements, so it is thin and I say so rather than padding
it. github/spec-kit is the richest source in this entire lens, and it is the one that is explicitly
about documents.

### FA12. The spec drifts from the system, and nobody has an answer

- **Demand:** github/spec-kit discussion #152, `Evolving specs`, **72 upvotes and 132 comments**,
  which is the most-replied thread on that board by a wide margin. The whole opening post, copied:
  > Using the spec kit I create a spec and implement it.
  >
  > What is the process when I now have a change request. Spec driven development would seem to indicate that the spec is the source of truth for the system, but spec kit leads me to create a new spec with the variation. That doesn't seem to be in keeping with spec driven development, as now to know what the system does I need to read both specs.
  >
  > Or should I be getting the AI to update the master spec as well?

  The first reply argues for never touching the master, copied:
  > You should not change the master spec, if you create a feature you just add the spec with the new feature.

  A later reply, copied, shows where that lands:
  > The way I am thinking about it, for an existing mono repo project, is to have a spec project per broad feature, then each feature will have a trail of specs that will define its truth.

  The same question, separately: discussion #501, `What's the correct workflow after executing the
  plan to refine/fix implementation`, **32 upvotes**. Copied from a reply:
  > im also wondering this - since the specs are meant to be the ssot - if we find something out during implementation - do we back out and update the specs / plan and redo everything?

  And discussion #775, `How do you refine a spec after having generated plan and/or tasks?`,
  **13 upvotes**.
- **Source:** https://github.com/github/spec-kit/discussions/152,
  https://github.com/github/spec-kit/discussions/501,
  https://github.com/github/spec-kit/discussions/775, and the board listing at
  https://github.com/github/spec-kit/discussions?discussions_q=is%3Aopen+sort%3Atop,
  all opened 2026-09-18.
- **Who ships it today:** nobody. Spec Kit is GitHub's own spec-driven development toolkit and this
  is the top question on its own board, unresolved. The workaround in the thread is "a trail of
  specs", which the original poster correctly identifies as the failure: you now have to read two
  documents to know one truth.
- **Nobody ships:** a way to fold a delta back into the document it amends and keep the record of
  what changed and who asked for it. That is a merge with attribution, on prose.
- **The problem it solves for us:** this is the strongest confirmation in the lens that our change
  queue is aimed at a real and currently unsolved problem, and it points at a specific shape we do
  not yet have: an amendment that **supersedes a range of an existing document** rather than being
  appended as a new document. The person wants one readable spec plus a history, and the tool gives
  them N documents and no history.
- **Fit:** central. Splice-only writing plus an accept-or-reject queue plus a version record is
  precisely the machinery for "apply this change request to the master spec, show me what it
  replaced, keep the trail". Nothing about it is code-specific.
- **Effort:** medium. The mechanics are decided; what is new is presenting the queue as an
  amendment history on one document, and rendering a superseded range as superseded rather than
  deleting it.
- **Verdict:** must-have to understand, good-to-have to build. INFERENCE, and it is mine: 72
  upvotes and 132 comments on "how do I keep one document true" is the clearest statement in this
  research that spec-driven development has a document problem and no document tool.

### FA13. Where the generated documents live, and whether to commit them

- **Demand:** github/spec-kit discussion #769, `Managing Spec-Kit Artifacts in a Monorepo`,
  **26 upvotes**. Copied:
  > The constitution file stays the same across features, but the spec/plan/tasks are created anew even for minor changes.

  and the three questions, copied:
  > - Should we commit all these generated files to the repo, or only keep the core docs (e.g. constitution.md and the high-level spec) and ignore the rest?
  > - Do you typically include the full feature folder (spec, plan, tasks) in version control, or just parts of it?
  > - How do you avoid repository bloat while still retaining useful documentation of each feature’s spec and plan?

  The answer in the thread, copied, and note the second line:
  > - Everything gets committed to the repo.
  > - You can't colocate them into subprojects next to your monorepo pkgs.

  and, copied:
  > It uses the branch name to know what spec you're working on.

  The same problem: discussion #1743, `Multi-Repository Setup: Separate Specs Repo with FE and BE as
  Independent Repos`, **18 upvotes**; #1119, `Testing Spec Kit in a multi-repo, brownfield project`,
  **11 upvotes**; #331, `Recommended approach for brownfield development`, **17 upvotes**; #746,
  `Spec-kit for a complex brownfield project`, **12 upvotes**.
- **Source:** https://github.com/github/spec-kit/discussions/769 and the board listing, opened
  2026-09-18.
- **Who ships it today:** Spec Kit generates `spec.md`, `plan.md`, `tasks.md` and `constitution.md`
  per feature and keys the current feature off the **git branch name**. That is the whole state
  model, and it is what the monorepo users are hitting.
- **Nobody ships:** a home for agent-generated documents that is not a git branch and not a folder
  convention people argue about on a forum.
- **The problem it solves for us:** four document types, generated per change, growing without
  bound, with no agreed place to live and no agreed lifecycle. That is a documents product's whole
  job description, written by someone who did not know they were writing one.
- **Fit:** good, and it lands on the **outline, tags, backlinks and templates** already in the plan
  rather than needing anything new. A spec, a plan and a task list that link to each other and roll
  up into one readable view is a backlinks-and-outline feature, not a new subsystem.
- **Effort:** small if scoped to "recognise this family of files and show them as one thing".
  Large if scoped to owning the lifecycle.
- **Verdict:** good-to-have, scoped small. The cheap version is a template set plus a linked view;
  resist owning spec-kit's state model.

### FA14. One repository, several agents, and a pile of duplicated instruction files

- **Demand:** github/spec-kit discussion #534, `Multiple coding agents in the same codebase`,
  **35 upvotes**. Copied in full:
  > If I have a code base where developers are using multiple different coding agents e.g. copilot, cursor and claude code, could we initialize spec-kit to create all the necessary files for all of these?
  >
  > In our own experience we have created symlinks between the claude/cursor commands and claude.md and AGENTS.md.

  Replies, copied:
  > agreed, I may switch between copilot, gemini, codex multiple times in same day when their quirks annoy me.

  and:
  > +1. Different people in our team use different agents

  This is FA4 and FA9 again, from a third direction, and it is the version with the clearest
  symptom: **people are managing their instruction files with symlinks.**
- **Source:** https://github.com/github/spec-kit/discussions/534 opened 2026-09-18.
- **Who ships it today:** Spec Kit's `init` takes an agent flag and writes that agent's files.
  Nobody writes one canonical file and projects it to the others.
- **Nobody ships:** one source document, many tool-specific projections, kept in sync. Which is,
  word for word, the projection law.
- **The problem it solves for us:** a team with three agents has three instruction files that drift.
  An editor that treats one of them as the source and the rest as generated views, with a queue for
  reconciling a change made in the wrong one, is a straight application of what the product already
  is.
- **Fit:** excellent, and arguably the single best fit in this research to the architecture we
  already chose. The instruction-files screen from FA4 becomes: one canonical file, N projections,
  a warning when a projection has drifted, a queue entry to fold it back.
- **Effort:** medium. Projection is easy. Detecting that someone edited the projection by hand and
  offering the fold-back is the real work, and it is the change queue again.
- **Verdict:** good-to-have and strategically the most interesting one here. It converts the
  instruction-files screen from a list into a product.

### FA15. Diagrams inside the spec, and the quiet news that Mermaid is not enough

- **Demand:** github/spec-kit discussion #694, `Embedding Visual Diagrams (UML / Mermaid / PlantUML)
  Across Spec Kit Workflows`, **16 upvotes, 9 comments**. Copied from the proposal:
  > Text-only documentation can be verbose and harder to parse.

  The replies are the interesting part, because they are practitioners reporting where the tools
  break. Copied:
  > I found that PlanUML is too limited in expression. Mermaid may not produce readable layout beyond toy problems.
  >
  > Graphviz' layout capability is so far the most capable and versatile.

  and, copied:
  > However, when attempting to represent a complete architecture view that integrates services, databases, API gateways, and external systems, even Mermaid’s C4 model support remains somewhat limited. The notation lacks fine-grained layout control and expressive depth

  and one reply that is a product thesis on its own, copied:
  > I would like to use Mermaid to very efficiently specify project layout, or even an abstract layer above to define how and app or service is put together logically.

  Adjacent, from the Cursor forum: topic 7190, `Render mermaid markdown in chat`, 12 topic likes,
  where the user's current workflow is copying the diagram into a scratch markdown file to preview it.
- **Source:** https://github.com/github/spec-kit/discussions/694 and
  https://forum.cursor.com/t/render-mermaid-markdown-in-chat/7190, opened 2026-09-18.
- **Who ships it today:** GitHub renders Mermaid in markdown. Mermaid is the default everywhere.
- **Nobody ships:** nothing missing that we have not already decided. Mermaid and Excalidraw are
  both on the decided list.
- **The problem it solves for us:** none new. I am recording this as a **caveat on a decided item**
  rather than a gap: the people who use diagrams in specs report that Mermaid stops being readable
  above toy size, and they name Graphviz and PlantUML as what they reach for. If diagram support is
  a selling point, Mermaid alone will meet this complaint.
- **Fit:** n/a, decided.
- **Effort:** n/a.
- **Verdict:** skip as a feature, keep as a note. UNVERIFIED: I have not tested any of these
  renderers myself, so the "Mermaid does not scale" claim is three practitioners' reports on one
  thread, not a measurement.

### FA16. block/goose is thin, and here is the honest reading of it

- **Demand:** block/goose has Discussions enabled and sorted by top the entire board maxes at
  **13 upvotes**: `goose OSS Roadmap (Feb-Apr 2026)` (13), `Goose the SDK - and some future
  directions (not a roadmap!)` (13), `Intermediate Roadmap Update (May 2026)` (12), `goose grant
  program` (12). The only document-shaped idea on the board is #1869, `Cursor Rules`, **7 upvotes
  with 13 comments**, which is the instruction-file cluster again and at a volume not worth
  quoting as demand.
- **Source:** https://github.com/block/goose/discussions?discussions_q=is%3Aopen+sort%3Atop opened
  2026-09-18.
- **Who ships it today:** n/a.
- **Nobody ships:** n/a.
- **The problem it solves for us:** none. I am recording this so the absence is on the record rather
  than looking like I did not check. goose does publish a **public roadmap as discussions**, which
  is what the coordinator asked for; the roadmap threads themselves are announcements from the team,
  not ranked demand, so there is no vote signal to report.
- **Fit:** n/a.
- **Effort:** n/a.
- **Verdict:** skip. Lens is genuinely thin here.

## Part four. Zed, and the competitor who moved two days ago

### FA17. Zed Delta went to public beta on 16 September 2026 and turned pull requests off

- **Demand:** this is not a user request, it is a shipped competitor, and it is two days old. From
  `https://zed.dev/blog/delta-public-beta`, by Nathan Sobo, dated on the page **September 16th,
  2026**. Copied:
  > Today, we're launching the public beta of Delta , a multiplayer environment for coding with agents and reviewing what they build.

  Copied:
  > Last week, we crossed a key milestone: we disabled pull requests on Delta's own repository. We now build and collaborate on Delta entirely within Delta.

  Their statement of the problem, copied, and it is our problem statement with the word "code" in it:
  > But with agents generating so much code, the diffs we're asking each other to review have mushroomed.

  and:
  > Why should your teammate's agent have to guess how you got there?

  On the storage model, copied:
  > Delta is built on DeltaDB , which extends Git's content-based versioning with incremental versions based on deltas . It records edits between commits alongside messages from humans and agents, preserving how the code evolved throughout a thread. A commit remains the checkpoint you push, pull, and build from. DeltaDB retains the work between those checkpoints.

  On the review surface, copied:
  > In Delta, you can invite anyone to pick up a thread where you left off, or create a dedicated review subthread. A review guides you through your branch's changes with access to the original agent's context. Each review gets its own isolated copy of the parent thread's worktrees

  Their own usage number, copied:
  > 33 of us have landed 570 changes to main since we turned off pull requests.

  Pricing, copied:
  > During the public beta, Delta is free. We'll introduce paid plans soon for individuals and teams. There will always be a free version of Delta.

  Their bet, copied:
  > We believe that threads will be the new fundamental unit of software development, and the best way to model their state is with deltas.
- **Source:** https://zed.dev/blog/delta-public-beta opened 2026-09-18. Blog index at
  https://zed.dev/blog opened the same day, which lists the post as the newest, dated 2026-09-16.
- **Who ships it today:** Zed, now, free, on macOS, Linux, Windows, the web and a mobile browser
  (all named in the post).
- **Nobody ships:** Delta is code. Every surface described is a worktree, a branch, a commit, a diff.
  Nothing in the post is about a document that is not source code, and nothing in it is about a
  person who is not an engineer.
- **The problem it solves for us:** this updates a line in `CLAUDE.md` that is now out of date. The
  settled position records that Zed Delta "stakes span-level attribution on CRDTs in public" and that
  a written rebuttal is owed. As of 2026-09-16 they have gone further than a position: they have
  turned their own pull requests off, published a usage number, and put a free tier on it.
  **The rebuttal is now more urgent, and it has to be narrower than "CRDTs are wrong".** The honest
  distinction is the audience and the artefact, not the algorithm.
- **Fit:** this is competitive intelligence rather than a feature. The transferable observation is
  that Zed's review surface is a **thread with its own worktree copy**, so a reviewer can run the
  agent against the change without disturbing the author. Our equivalent for documents is a review
  view over a pending queue that the reviewer can experiment inside without accepting anything.
- **Effort:** n/a.
- **Verdict:** must-have to know, not a feature. One line of the settled-decisions section needs
  redating and the rebuttal needs writing against a shipped product rather than a blog post.

### FA18. Zed's own argument is that documents should be views over permanent content, which is our argument inverted

- **Demand:** `https://zed.dev/blog/agentic-xanadu`, `Xanadu Was Waiting for Agents`, Nathan Sobo,
  dated on the page **September 1st, 2026**. Copied:
  > He imagined a system that could keep every version of a document; hypertext links would know both their source and destination, and quotations would be kept by reference (rather than copy) so any included text maintained its identity and source. Everything, in this version of computing, would be intertwingled and xanalogical . We're talking about attribution down to the span.

  The two rules, copied:
  > To be xanalogical is to follow two rules: Never copy, always reference (also known by a Nelsonism, transclusion ). Never overwrite, always version.

  Why agents change the argument, copied:
  > What makes an agent an awkward collaborator also makes it a perfect citizen for Nelson's system. Agents can follow more layers of subtext than people can hold in their heads at once

  and:
  > A fragment-based representation makes those references lossless, so each layer stays attached to the same span as the text changes.

  And the sentence that is the exact inverse of our projection law, copied:
  > A Delta thread is a live projection of its permanent structured history, recomputed rather than stored as a flattened document.
- **Source:** https://zed.dev/blog/agentic-xanadu opened 2026-09-18.
- **Who ships it today:** Zed, in Delta.
- **Nobody ships:** n/a.
- **The problem it solves for us:** it names the fork in the road precisely, and both sides of it are
  defensible. **Zed:** the permanent structured history is the truth and the document is a
  projection of it. **Us:** the file on disk is the truth and every view is a projection of it.
  Theirs keeps everything and can attribute every span forever; ours means a person can open the
  file in any other program, forever, and there is nothing to lose when the vendor goes away.
- **Fit:** n/a, this is positioning.
- **Effort:** n/a.
- **Verdict:** must-have to know. INFERENCE, mine: the strongest version of our position against
  this is not technical, it is about ownership. A document whose truth lives in DeltaDB is a
  document you cannot read without Delta. That is the sentence the rebuttal should be built on, and
  it is already the product's stated principle: the editor is sold, the files never are.

### FA19. Zed's public roadmap, and the one item on it that is our lens exactly

- **Demand:** `https://zed.dev/roadmap` lists what the team is building with a GitHub upvote count
  next to each triaged issue. Read 2026-09-18, **Currently Working On** holds six items and the one
  that matters here is, copied:
  > Code History as Context
  > In Progress
  > See exactly how the code evolved, and the conversations that shaped it.

  The other five: `Instant Sharing` (in progress), `Async Collaboration` (in progress),
  `Edit Tool Improvements` (done), `Skills` (done), `UI for Terminal Agents` (done).
  **Coming Up Next** holds five: `ACP improvements`, `Zed on the Web`, `Plan Mode`
  (copied: `Let the Zed agent plan before making changes to your code.`), `Notebooks`,
  `Hands-Free Coding`.

  The triage and planned lists carry live upvote counts, and these are the review-shaped ones:
  **#59157 `Add PR-style review comments in Git Diff UI that feed into the active agent thread`,
  97 upvotes**, in Triage; **#45295 `Commit partial changes / Line-by-line staging`, 139 upvotes**,
  Planned; **#57982 `Branch Merging`, 106 upvotes**, Planned; **#34813 `Add support for Git 3-way
  merge`, 146 upvotes**, Planned; **#58974 `Side-by-Side Git Merge Conflict Resolution UI`,
  83 upvotes**, Planned; **#58676 `Search across thread history`, 8 upvotes**, Planned. The page
  states, copied:
  > Every item here started as a community request. Upvote what you want most
- **Source:** https://zed.dev/roadmap opened 2026-09-18.
- **Who ships it today:** nobody ships #59157. It is the review comment attached to a diff hunk that
  then goes back to the agent, which is the loop that closes review and revision.
- **Nobody ships:** a comment on a span of a document that becomes an instruction to the agent that
  wrote it. Zed has it in triage at 97 upvotes; nobody has shipped it.
- **The problem it solves for us:** in a document, a margin comment on a paragraph is the single most
  natural review gesture there is, and everyone already knows it from Google Docs. Turning that
  comment into the next instruction, scoped to that byte range, is a small step from a queue that
  already holds byte ranges.
- **Fit:** strong and unusually natural for a documents product. Doc mode that looks like Google Docs
  is decided; comments are the obvious next thing in that surface; and the agent-facing half is
  "send this comment plus this byte range as the next instruction".
- **Effort:** medium. Anchored comments over a byte range that survive an edit are the hard part, and
  they are the same anchoring problem the splice already has to solve.
- **Verdict:** good-to-have, and the best-fitting individual feature in this whole lens. It has an
  upvote count, nobody has shipped it, and it is more at home in a document than it is in code.

## Part five. Where these tools actually send you to review what the agent did

This is the coordinator's specific question, so it gets its own section and a tool-by-tool answer
with the doc page each claim came from. Everything below was opened on 2026-09-18. Where a page
redirected, the URL in the table is the URL that actually served the content, not the one I asked
for.

**A note on the pages themselves, per the brief's rule 8.** Three of the documentation sites I
fetched carry text addressed at an AI reading them. `code.claude.com/docs/en/checkpointing`,
`code.claude.com/docs/en/ide-integrations` and the Cline docs pages all open with, copied:
> Fetch the complete documentation index at: /docs/llms.txt
> Use this file to discover all available pages before exploring further.

I am recording that the pages said it and I did not do it. Nothing else instruction-shaped appeared
in any page I opened.

### The table

| Tool | Where review happens | Granularity | Undo, and what it rests on |
|---|---|---|---|
| **Claude Code CLI** | The terminal. A diff per edit, approved inline. | Per edit, as it happens | `/rewind`, backed by file snapshots kept per prompt |
| **Claude Code VS Code extension** | The editor, plus a plan you can edit before accepting | Per edit, or auto-accept | Same `/rewind` |
| **Codex CLI** | The terminal. Red and green diffs, approve or reject. | Per patch | No `/undo`. The docs tell you to use git |
| **Codex IDE extension** | A sidebar summary plus the changed lines | Per file | Git |
| **Cursor** | An in-editor diff, live while the agent works, plus checkpoint restore | Per hunk, and per checkpoint | Checkpoint restore |
| **Cline** | A `Compare` and `Restore` control on every checkpoint in the conversation | Per tool use | A **shadow git repository**, separate from your own |
| **Continue** | An in-editor diff to accept or reject | Per edit | Editor undo |
| **Aider** | Git. Every edit is auto-committed. | Per commit | `/undo`, which undoes a git commit |
| **opencode** | The terminal. The IDE extension opens a split terminal. | Per patch | Session-scoped, and known to over-reach |
| **Zed** | A **multi-buffer review tab** with keep or reject per hunk | Per hunk | Editor and git |
| **GitHub Copilot in VS Code** | Click a changed file in the chat response to open its diff; the Agents window has a Changes panel | Per file | Editor undo, then git |
| **Zed Delta** | A **review subthread** with its own copy of the worktree | Per thread, with the agent's context attached | DeltaDB keeps everything |

### What each cell rests on

**Claude Code.** Checkpointing is documented at
`https://code.claude.com/docs/en/checkpointing`. Copied:
> As you work with Claude, checkpointing automatically captures the state of your code before each prompt you send that starts a turn.

The menu options, copied:
> Restore code and conversation : revert both code and conversation to that point
> Restore conversation : rewind to that message while keeping current code
> Restore code : revert file changes while keeping the conversation

The page lists **six named limitations**, and they are the same six things users file bugs about.
Copied:
> Checkpointing does not track files modified by Bash commands.

> A subagent makes edits with Claude’s file editing tools, but Claude Code usually doesn’t capture those edits in your session’s checkpoints.

> Checkpointing only tracks files that have been edited within the current session.

> Checkpointing doesn’t rewind symlinked or hard-linked files.

and the retention rule, copied:
> Claude Code deletes a session’s file snapshots in the retention sweep , by default about 30 days after the session last saved one.

The VS Code extension is documented at `https://code.claude.com/docs/en/ide-integrations`. Copied:
> you can review and edit Claude’s plans before accepting them, auto-accept edits as they’re made

**Codex.** `https://learn.chatgpt.com/docs/codex/ide` (redirected from
`developers.openai.com/codex/ide`). The review pitch, copied:
> Review a concise summary and the changed lines without an extra nav

and the undo story, in OpenAI's own words in their own quickstart, copied:
> Create Git checkpoints before and after a task so you can revert changes.

That single sentence is the whole explanation for why `Please make "/undo" back` sits at 452
reactions. The vendor's documented answer to "how do I undo this" is "you should have committed
first", which is exactly what the issue author said does not work for them.

**Cursor.** `https://cursor.com/learn/reviewing-testing` (redirected from `cursor.com/docs/agent/review`).
Cursor's documented answer to reviewing agent work is, in order: watch the diff while it happens,
then **ask the agent to review itself**, then **prepare a pull request**. Copied:
> Watch the agent work. The diff view shows changes as they happen.

> Ask the agent to review all changes at once. Tag @Branch in your prompt to give the agent the full diff of your current branch.

> Agents can produce many code changes at once. This can result in one large commit with hundreds of changed lines. That's hard for anyone to review.

> We recommend using small, semantic commits with clear descriptions. Each commit represents one logical change. A human reviewer can step through the history of commits rather than parsing a wall of code changes.

Their recommended fix for that is a skill that rewrites the branch's commit history so a human can
read it. Copied from the skill body on the page:
> Rework a branch into a sequence of small, semantic commits for review.

**So Cursor's review surface is a pull request, reached through a commit history the agent rewrote
for you.** That is the clearest possible statement of the gap.

**Cline.** `https://docs.cline.bot/core-workflows/checkpoints`. Copied:
> Cline maintains a shadow Git repository separate from your project’s actual Git history.

> Checkpoints capture everything, including files not tracked by Git

and the design philosophy, which is the most quotable sentence in this section and the direct
opposite of a change queue, copied:
> This changes how you work with Cline. Instead of carefully reviewing every change before approving, you can let Cline move fast and roll back if something goes wrong. The cost of a mistake drops to nearly zero.

Note what Cline's shadow repository solves that Claude Code's checkpointing does not: untracked
files. That is FA1's first bullet, solved, by one vendor, in the one product that then argues you
should stop reviewing.

**Aider.** `https://aider.chat/docs/usage/commands.html`. Copied:
> /diff Display the diff of changes since the last message

> /undo Undo the last git commit if it was done by aider

> /commit Commit edits to the repo made outside the chat (commit message optional)

Aider's review surface is git, with no exceptions and no pretence otherwise.

**Zed.** `https://zed.dev/docs/ai/agent-panel`. This is the best in-editor review surface of the
eleven. Copied:
> To see which files specifically have been edited, expand the accordion bar that shows up right above the message editor or click the Review Changes button ( shift-ctrl-r|ctrl-shift-r ), which opens a special multi-buffer tab with all changes.

> You can accept or reject each individual change hunk, or the whole set of changes made by the agent.

> Edit diffs can also appear inline in individual files with the same keep/reject hunk controls as the multi-buffer review pane. This temporarily overrides the buffer’s git diff while review is active. Enable it by setting agent.single_file_review to true in your settings.

**GitHub Copilot in VS Code.** `https://code.visualstudio.com/docs/chat/chat-overview` (redirected
from both `/docs/copilot/chat/chat-agent-mode` and `/docs/copilot/chat/copilot-edits`). Copied:
> Review and manage changes  After the AI changes files, review and validate the result before you commit or integrate it. In the Chat view, select a changed file in the response to open its diff. In the Agents window, use the Changes panel.

**opencode.** `https://opencode.ai/docs/ide/`. There is no IDE review surface at all. Copied:
> OpenCode integrates with VS Code, Cursor, or any IDE that supports a terminal. Just run opencode in the terminal to get started.

> Quick Launch : Use Cmd+Esc (Mac) or Ctrl+Esc (Windows/Linux) to open OpenCode in a split terminal view

The extension's contribution is a split terminal. Review is the terminal, and the one review bug
on their tracker is anomalyco/opencode#17076, `CLI/TUI multi-file apply_patch approval only shows
first file diff` (26 thumbs-up), which says the terminal review is incomplete for multi-file patches.

**Zed Delta.** `https://zed.dev/blog/delta-public-beta`, and this is the only one of the twelve that
is not a diff at all. Copied:
> In Delta, you can invite anyone to pick up a thread where you left off, or create a dedicated review subthread. A review guides you through your branch's changes with access to the original agent's context. Each review gets its own isolated copy of the parent thread's worktrees

### The answer to the question

**Every one of these tools sends you to one of three places, and none of them is a document.**

1. **A terminal diff, at the moment of the edit.** Claude Code CLI, Codex CLI, opencode, Aider.
   It is per-edit, it is transient, and once you have said yes it is gone. It answers "should this
   edit happen", never "what has happened to this file today".
2. **An editor diff pane.** Zed, Cursor, Copilot, Continue, Cline, the Claude Code extension.
   Better, and Zed's multi-buffer keep-or-reject is the best of them. All of them are diffs of
   **code in a code editor**, hunk by hunk, and all of them are gone once accepted.
3. **A pull request, or the vendor telling you to use git.** Cursor documents the PR as the
   destination and ships a skill to rewrite your commits so a human can read them. Codex documents
   git checkpoints as the undo. Aider is git. Zed Delta's entire pitch is that the pull request has
   broken under agent volume and should be replaced.

**The gap, stated plainly.** There is no surface anywhere in this set where a person reviews what an
agent did **to a document**, over a **span of time longer than one turn**, with the change still
**attributable and reversible after it was accepted**. Every tool reviews a code hunk, at the moment
it is proposed, and then forgets. Two of the twelve keep any history at all and both of them are
git-shaped: Cline's shadow repository and Delta's DeltaDB.

INFERENCE, and it is mine rather than any page's: the change queue is not a nicer diff view. The
diff view already exists in six of these products and is not what people are missing. What is
missing is the **register**: the change, who made it, what it replaced, whether anyone accepted it,
and the ability to ask that question a week later about a paragraph rather than about a commit.
That is a document feature and it is why none of the twelve has it.

## Part six. Roadmap and most-wanted boards, and the one that has moved

- **Windsurf.** `https://windsurf.com/changelog` **redirects to `https://docs.devin.ai/desktop/changelog`**
  (`curl -L`, 2026-09-18). Windsurf's changelog is now served from Cognition's Devin documentation
  under a `/desktop/` path. There is no separate public Windsurf feature-request board reachable from
  that domain. Separately, the Claude Code IDE documentation at `code.claude.com/docs/en/ide-integrations`
  lists the editors its extension installs into and names, copied:
  > The extension also installs in other VS Code forks like Devin Desktop or Kiro.

  INFERENCE: Windsurf as an independently roadmapped product appears to have been folded into Devin
  Desktop. I did not find a Windsurf voting board to report, and I am recording the redirect rather
  than guessing at what replaced it.
- **Cline.** `https://cline.bot` serves a marketing page. No public voting board; demand lives on
  the GitHub tracker, which the coordinator has already swept.
- **Continue.** `https://continue.dev` serves a marketing page. No public voting board. Its tracker
  is thin for this lens: the whole top of `continuedev/continue` by reactions is IDE support
  requests (`Neovim support needed`, 245; `Visual Studio (not Code) Continue extension?`, 108;
  `Support Sublime Text`, 23) with one document-adjacent entry, #7544 `Error streaming edit diffs:
  Token limit reached. File/range likely too large for this edit` (17).
- **GitHub Copilot.** `microsoft/vscode-copilot-release` is the public request tracker and the
  coordinator has it. Its second most reacted open issue is #563 `Custom Instructions` (151
  thumbs-up, 199 total), which is the FA4 cluster.
- **Zed.** The only one of the five with a real public roadmap that carries vote counts, at
  `https://zed.dev/roadmap`. Covered in FA19.
- **block/goose.** Publishes its roadmap as GitHub Discussions. Covered in FA16, and thin.

## Part seven. The verification I promised in FA4, and it changes the number

### FA20. The single loudest feature request in this entire research is a request for a markdown file

- **Demand:** in FA4 I recorded, as the claim of issue #31005's author rather than as my own, that
  anthropics/claude-code#6235 had "3,020 upvotes, 224 comments, still open". I said I would verify it
  separately. I have, and **their number was right for the day they wrote it and is now wrong in
  both directions.** Read off the GitHub search API on 2026-09-18:

  **anthropics/claude-code#6235, `Feature Request: Support AGENTS.md.`**
  - **5,161 thumbs-up**
  - **6,644 total reactions** (`+1` 5,161, heart 438, rocket 361, hooray 326, eyes 289, laugh 48, confused 8, `-1` 13)
  - **396 comments**
  - created **2025-08-21**, closed **2026-08-17** with `state_reason: completed`, last updated
    **2026-09-17**, which is the day before this was read
  - state: **closed**

  The whole body, copied from the API response:
  > Codex, Amp, Cursor, and others are starting to standardize around AGENTS.md (https://agents.md/) — a unified Markdown file that coding agents can use to understand a codebase.
  >
  > By contrast, CLAUDE.md feels too specific to Claude Code. It doesn’t work as well when collaborating with other developers who aren’t using Claude Code.

  For scale: 5,161 is **eleven times** the 452 on codex#9203, which was the loudest thing in the
  coordinator's sweep and in my Part one. It is the largest single demand number anywhere in this
  research by an order of magnitude.

  It was closed as completed on 2026-08-17, and yet **#31005 (376 thumbs-up), #34235 (111) and
  #78977 (15) are all still open**, along with #89825 `Root AGENTS.md not auto-loaded at session
  start when no CLAUDE.md exists` (2). So the headline feature shipped and the long tail of "it does
  not actually load my file" did not close with it.
- **Source:** https://api.github.com/search/issues?q=repo:anthropics/claude-code+%22Support+AGENTS.md%22+in:title
  and https://github.com/anthropics/claude-code/issues/6235, opened 2026-09-18.
- **Who ships it today:** everyone, now. agents.md is the de facto standard and Claude Code closed
  its own request as completed in August 2026.
- **Nobody ships:** see FA4, FA9 and FA14. The **format** is settled and the **tooling around the
  format** is not. Nobody edits it, resolves its includes, shows its merge order, shows its byte
  budget, projects it to the other tools' filenames, or tells you when a projection drifted.
- **The problem it solves for us:** it sizes the audience. Five thousand people upvoted a request
  for a shared markdown instruction file, on one tracker, for one tool. That is the population who
  already believe markdown is the interface between people and agents, and they proved it with a
  vote before anyone sold them anything.
- **Fit:** the instruction-files screen is already decided. This finding does not add a feature, it
  changes how much the screen is worth.
- **Effort:** n/a.
- **Verdict:** must-have to know. **Correction to FA4:** the count is 5,161 not 3,020, and the issue
  is closed as completed, not open. FA4's argument survives unchanged, because FA4's argument was
  never about #6235's state; it was that the requests about **composing and resolving** these files
  are all still open, and they are.

---

## What I could not reach

- **anthropics/claude-code#33932** (`Diff review UI similar to GitHub Copilot Edits Review`, 194
  thumbs-up). I have the title, the reaction counts and the first 130 characters of the body from
  GitHub's own `<meta name="description">` tag, which truncates. Four attempts to read the full body
  failed: the API read hit `IncompleteRead`, the core API was rate-limited, the search-API fallback
  hit `IncompleteRead`, and the rendered page's embedded JSON did not carry `bodyText`. I quoted only
  the truncated fragment and said so in FA3.
- **The full body of openai/codex#12115** (`Dynamically loading nested AGENTS.md`, 113 thumbs-up).
  Same `IncompleteRead` failure. I have the title and counts only.
- **The tail of `https://zed.dev/blog/agentic-xanadu`.** The served HTML ends mid-sentence at "The
  final dependency", so the closing section, headed `Avoiding Xanadu's curse` in the page's own table
  of contents, is not in the markup I received. Everything I quoted from that post is from the part
  that did arrive.
- **`https://zed.dev/delta`.** Returns HTTP 200 with a JavaScript shell and no server-rendered
  content, so there is no product copy or pricing on it to read. What I have about Delta comes from
  the two blog posts, which are server-rendered.
- **A Windsurf feature-request board.** `windsurf.com/changelog` redirects to
  `docs.devin.ai/desktop/changelog`. I did not find a public voting board for Windsurf and I have not
  claimed one exists.
- **The GitHub core API**, after about six calls. The unauthenticated limit is 60 per hour and this
  egress appears to share it, so it was exhausted almost immediately and reset at 00:51 UTC. Every
  body quote in Part one came through the search API instead, which returns the body field. I have
  said where each one came from.
- **Reddit, Hacker News and Discord**, which I did not attempt. They have no vote counts I can attach
  to a specific feature request in the way the brief asks for, and the coordinator did not name them.

## What surprised me

1. **The loudest ask in the whole market is for a markdown file.** anthropics/claude-code#6235 has
   **5,161 thumbs-up** for "let my instructions live in a file every tool reads". That is eleven
   times the loudest undo request and it is a document ask, not a code ask.
2. **Cursor's documented answer to reviewing an agent is a pull request**, reached via a skill that
   rewrites your commit history so a human can read it. Codex's documented answer to undo is "you
   should have made a git checkpoint first". Both vendors have written down that they do not solve
   this.
3. **Cline argues you should stop reviewing.** Their checkpoints page says the cost of a mistake
   drops to nearly zero so you can let it move fast and roll back. That is a coherent rival thesis to
   a change queue and it deserves a real answer rather than being ignored.
4. **Zed turned its own pull requests off nine days ago** and put Delta into free public beta on
   2026-09-16, two days before this was written, with 33 people and 570 landed changes as the
   evidence. The `CLAUDE.md` line calling Delta a public position is now out of date; it is a
   shipped product.
5. **spec-kit's top thread is "Evolving specs", 72 upvotes and 132 comments, and it has no answer.**
   GitHub's own spec-driven-development tool cannot say what happens to the master spec when the
   system changes. That is a document merge problem sitting unanswered at the centre of the category
   this product is aimed at.
