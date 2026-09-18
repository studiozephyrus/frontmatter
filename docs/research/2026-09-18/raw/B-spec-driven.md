# Lens B: spec-driven development

Research file for the 18 September 2026 brief. Findings prefixed `FB`.
All sources opened 2026-09-18 (IST). Clock check: `date -u` returned
`2026-09-17T23:51:33Z` at the start of this run, which is 2026-09-18 05:21 IST.

Evidence discipline: every quoted string below was copied from a page or a file
that was actually fetched in this session. Anything not copied is marked
`INFERENCE:` or `UNVERIFIED:`. British spelling.

One deliberate exception to the house rule on dashes. My own prose uses plain hyphens
throughout. Twelve lines in this file contain a long dash, and every one of them sits
inside a string copied verbatim from a source: a capability table, a command-line
transcript, a GitHub issue title, a quoted sentence. The brief forbids dashes and also
forbids altering anything inside quotation marks; where those collide I kept the source
exact. The same applies to one adjective in a quoted spec-kit list that the house style
gate objects to. Nothing inside a pair of backticks or a quote block was edited.

---

## Part 1: the conventions themselves

### FB1. GitHub spec-kit is the centre of gravity, and its whole product is five markdown files in a folder

- **Demand:** 137,619 stars and 12,324 forks on `github/spec-kit`, 311 open issues, 706
  watchers. Created 2025-08-21, last push 2026-09-17. Read straight off the GitHub REST API,
  not off a badge. The README tagline is `Build with a spec, fix a bug, or assess an idea
  with your coding agent.` (hyphens in the original replaced per house style; the original
  uses an em dash). The three named processes are: `Spec-Driven Development`,
  `Bug fixing`, `Idea assessment`.
- **Source:** https://api.github.com/repos/github/spec-kit opened 2026-09-18;
  https://raw.githubusercontent.com/github/spec-kit/main/README.md opened 2026-09-18
- **The command flow, copied from the README:**
  `/speckit-constitution` then `/speckit-specify` then `/speckit-plan` then `/speckit-tasks`
  then `/speckit-implement` then `/speckit-converge`, repeated until convergence reports
  `Converged`. The README says in bold: `Constitution once per project; specify, plan,
  tasks, implement, converge per feature.` It also says these are agent skills, not terminal
  commands, and tells the user to `review the result before continuing`.
- **What the files actually are (from `templates/` in the repo, all fetched):**
  - `spec-template.md` (4,556 bytes): sections `User Scenarios & Testing (mandatory)` with
    prioritised user stories P1/P2/P3 each carrying `Why this priority`,
    `Independent Test` and Given/When/Then `Acceptance Scenarios`; `Edge Cases`;
    `Requirements (mandatory)` as numbered `FR-001` lines each of the form
    `System MUST [specific capability]`; `Key Entities`; `Success Criteria (mandatory)` as
    numbered `SC-001` lines; `Assumptions`. Unresolved points are written inline as
    `[NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]`.
  - `plan-template.md` (3,770 bytes): `Summary`, `Technical Context` (Language/Version,
    Primary Dependencies, Storage, Testing, Target Platform, Project Type, Performance
    Goals, Constraints, Scale/Scope, each allowed to read `NEEDS CLARIFICATION`),
    `Constitution Check` marked `GATE: Must pass before Phase 0 research`,
    `Project Structure`, `Complexity Tracking` as a three-column table
    (Violation, Why Needed, Simpler Alternative Rejected Because).
  - `tasks-template.md` (9,182 bytes): a checkbox list in the exact format
    `[ID] [P?] [Story] Description`, for example
    `- [ ] T012 [P] [US1] Create [Entity1] model in src/models/[entity1].py`.
    `[P]` means can run in parallel. Tasks are grouped into `Phase 1: Setup`,
    `Phase 2: Foundational (Blocking Prerequisites)`, one phase per user story, then
    `Phase N: Polish & Cross-Cutting Concerns`, with a `Checkpoint` line after each.
    It carries an explicit dependency graph section and a `Parallel Example` block.
  - `constitution-template.md` (2,346 bytes): numbered `Core Principles`, a `Governance`
    section, and a footer line `**Version**: [CONSTITUTION_VERSION] | **Ratified**:
    [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]`.
  - `checklist-template.md` (2,088 bytes): `- [ ] CHK001 First checklist item with clear
    action`. Its note says `__SPECKIT_COMMAND_IMPLEMENT__ reads checklist checkbox state as
    a gate and must not modify markers`.
- **Who ships it today:** GitHub, MIT licensed, free. No paid tier.
- **The problem it solves for us:** this is the exact artefact family idea mode produces,
  already standardised and already at six figures of stars. Every one of these files is
  plain markdown with heavy structure: numbered requirement ids, checkboxes, priority
  labels, Given/When/Then, a gate table. That structure is invisible in a code editor and
  is exactly what a document surface can render.
- **Fit:** perfect. These are files on disk in a `specs/<###-feature-name>/` folder. A
  byte-exact editor can open, project and splice them without owning the format.
- **Effort:** small for recognition and rendering of one template; medium to do all five
  well with the gate semantics.
- **Verdict:** must-have context, not a feature by itself. The features fall out of it below.

### FB2. The folder layout is a settled convention across the whole field, and it is always a folder of loose markdown files

- **Demand:** every tool below independently converged on a folder of three to five markdown
  files. No tool invented a container format, a database or a single-file format.
- **Source:** each row cites its own opened source, listed in the table.
- **Table, question 1 answered.** Every path here was read from a fetched file or page.

| Convention | Root folder | Files it creates | Where I read it |
|---|---|---|---|
| GitHub spec-kit | `.specify/` plus `specs/[###-feature-name]/` | `spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/`, `tasks.md`; plus `.specify/memory/constitution.md`, `.specify/templates/`, `.specify/scripts/`, `.specify/extensions.yml` | `templates/plan-template.md` prints the tree verbatim; `.specify/memory/constitution.md` exists in the repo tree; opened 2026-09-18 |
| spec-kit bug extension | `.specify/bugs/<slug>/` | assessment, fix and test reports per bug slug | README, opened 2026-09-18 |
| spec-kit assess extension | `.specify/assessments/<slug>/` | intake, research, define, shape, decide artefacts | README, opened 2026-09-18 |
| AWS Kiro | `.kiro/specs/<name>/` | `requirements.md` (or `bugfix.md`), `design.md`, `tasks.md` | https://kiro.dev/docs/specs.md names all three and prints `.kiro/specs/foo` in its mermaid diagram; opened 2026-09-18. See FB5 |
| OpenSpec | `openspec/` | `openspec/changes/<id>/` holding `proposal.md`, `specs/`, `design.md`, `tasks.md`; archived to `openspec/changes/archive/<date>-<id>/`; the living spec lives under `openspec/specs/` | The README prints the created tree and the archive path verbatim; `docs/cli.md` references `changes/archive/` and `.openspec.yaml`; both opened 2026-09-18. See FB10 |
| BMAD-METHOD v6 | skill-driven, no single fixed folder | `brief.md` and `addendum.md` from `bmad-product-brief`, a PRD from `bmad-prd`, one `SPEC.md` per epic, `deferred_work.md` from a voided run | https://docs.bmad-method.org/plan/define-requirements-and-a-specification/ says `every epic still ends up as a SPEC.md that Build reads` and `It produces brief.md plus addendum.md`; https://docs.bmad-method.org/build/build-a-change/ shows `deferred_work.md`; both opened 2026-09-18. **UNVERIFIED:** I did not find a page stating the parent directory for these files, so no root path is claimed. The older v4 layout of `docs/prd.md` plus sharded stories was NOT verified in this session and is not asserted here. |
| Task Master | `.taskmaster/` | `.taskmaster/docs/prd.txt` (note: `.txt`, not markdown), `.taskmaster/templates/example_prd.txt`, and a `tasks.json` store | README line `For **new projects**: Create your PRD at `.taskmaster/docs/prd.txt`.` and `An example PRD template is available after initialization in `.taskmaster/templates/example_prd.txt`.`, opened 2026-09-18. The `tasks.json` field list is from https://tryhamster.com/docs/taskmaster/capabilities/task-structure, opened 2026-09-18. **UNVERIFIED:** the exact path of `tasks.json` and of the per-task text files; the docs describe their contents, not their location. See FB16 |
| Agent OS | not verified | not verified | The README at https://raw.githubusercontent.com/buildermethods/agent-os/main/README.md, opened 2026-09-18, is 1,659 bytes and contains no file paths at all; it says `Docs, installation, usage, & best practices` are at buildermethods.com. **UNVERIFIED:** I did not open a page giving its layout. Its four named capabilities are `Discover Standards`, `Deploy Standards`, `Shape Spec`, `Index Standards`, and it has 5,423 stars. |
- **Nobody ships:** a single tool that can open any of these layouts and show it as a
  document. They are all authored by an agent into a code repo and read back by an agent.
- **The problem it solves for us:** if frontmatter recognises `specs/*/spec.md`,
  `.kiro/specs/*/requirements.md` and `openspec/changes/*/proposal.md` by path, it can
  give each a purpose-built view without asking anyone to adopt a new format. The file on
  disk stays exactly what the agent wrote.
- **Fit:** native. Path-based recognition is a deterministic projection of the file tree.
- **Effort:** small. A path matcher plus a per-convention view is days, not weeks.
- **Verdict:** good-to-have, and the cheapest big win in this lens.

### FB3. spec-kit ships a spec-to-code checker, and it only pushes one way: code catches up to spec, never the reverse

- **Demand:** the `converge` command exists at all, and the README makes it part of the
  core loop, repeated until it reports `Converged`.
- **Source:** https://raw.githubusercontent.com/github/spec-kit/main/templates/commands/converge.md
  opened 2026-09-18
- **Exact strings from that file:**
  - description: `Assess the current codebase against the feature's spec, plan, and tasks,
    then append any remaining unbuilt work as new tasks to tasks.md so implement can
    complete it.`
  - `Read `spec.md`, `plan.md`, and `tasks.md` as the **sole source of intent**`
  - `This is **not** a diff tool and does **not** track changes. It assesses the present
    state of the code relative to the feature's artifacts - no git, no branch comparison,
    no history.`
  - `**APPEND-ONLY, NEVER REWRITE**: The command's **only** write is appending a new
    `## Phase N: Convergence` section to `tasks.md`. It MUST NOT: modify `spec.md` or
    `plan.md` in any way`
  - `When the codebase already satisfies everything, the command MUST leave `tasks.md`
    **byte-for-byte unchanged** (no empty Convergence header) and report a clean result.`
- **Who ships it today:** GitHub, free.
- **Nobody ships:** the other direction. If the code is right and the spec is stale,
  `converge` reads the stale spec as intent and generates tasks to break working code back
  towards it. There is no `the code taught us something, update the spec` command anywhere
  in spec-kit. The `analyze` command is explicitly `STRICTLY READ-ONLY` and compares only
  `spec.md`, `plan.md` and `tasks.md` to each other and to the constitution, never to code.
- **The problem it solves for us:** the whole field has a one-way valve. Reality flows into
  the code, and nothing carries it back into the document. That is a review problem, and a
  review queue is already the thing we build.
- **Fit:** directly. A change queue that can hold a proposed spec edit alongside the code
  change that motivated it is the missing half of converge.
- **Effort:** medium. The queue exists in the plan; the new part is sourcing a proposal
  from a code diff.
- **Verdict:** good-to-have, and it is the strongest product idea this lens produced.

### FB4. GitHub itself documents spec drift as an unsolved problem and hands it back to the team as a convention

- **Demand:** a whole concept page exists to name the problem, and it offers three coping
  strategies rather than a fix.
- **Source:** https://raw.githubusercontent.com/github/spec-kit/main/docs/concepts/spec-persistence.md
  opened 2026-09-18
- **Exact strings from that page:**
  - `Spec Kit intentionally leaves teams in control of what happens to `spec.md`,
    `plan.md`, and `tasks.md` after requirements change.`
  - `None is the default, and none is required by Spec Kit.`
  - On the flow-back model: `The main risk is silent divergence. If the team changes
    lower-level artifacts without reflecting the decision back into `spec.md`, future
    contributors may not know which artifact to trust.`
  - On the living-spec model: `The main risk is losing useful implementation rationale if
    derived artifacts are discarded without preserving important decisions elsewhere.`
  - `The model is a team convention, not a CLI setting.`
  - The summary table has a column literally headed `Watch out for`, whose three values are
    `Silent drift between artifacts`, `Duplicate or fragmented context`, and
    `Lost rationale in regenerated files`.
  - The page borrows a three-level lifecycle from Martin Fowler's site and names the levels
    `Spec-first`, `Spec-anchored`, `Spec-as-source`, citing
    https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
- **The lifecycle, question 2 answered:** the agent writes the spec from a one-line prompt;
  the human reviews it (`review the result before continuing`); the agent reads it back at
  plan, tasks, implement and converge time. When the code changes and the spec does not,
  spec-kit's own documentation says nothing automatic happens, you pick a convention and
  hope the team follows it, and the named failure is `Silent drift between artifacts`.
- **Who ships it today:** nobody ships a fix. GitHub documents the hole.
- **The problem it solves for us:** the market leader has published, in its own docs, that
  the number one risk in its own method is a document going quietly out of date. That is a
  document problem, not a code problem, and it is ours to take.
- **Fit:** exact. We already refuse to merge silently. `No silent merge, ever` is the
  answer to `silent divergence`, in the same words.
- **Effort:** medium to large depending on how far the detection goes.
- **Verdict:** must-have as positioning. The feature underneath it is FB3.

### FB5. Kiro from Amazon Web Services: three files, approval gates between each, and money on the table

- **Demand:** Kiro is a commercial product from Amazon Web Services with five paid tiers.
  Its docs treat specs as the headline feature, ahead of chat.
- **Source:** https://kiro.dev/docs/specs.md opened 2026-09-18;
  https://kiro.dev/docs/specs/feature-specs.md opened 2026-09-18;
  https://kiro.dev/pricing/ opened 2026-09-18
- **The layout, copied from the page:** `Every spec generates three key files that form the
  foundation of your specification:` then
  `**requirements.md** (or **bugfix.md**) - Captures user stories, acceptance criteria, or
  bug analysis in structured notation`,
  `**design.md** - Documents technical architecture, sequence diagrams, and implementation
  considerations`,
  `**tasks.md** - Provides a detailed implementation plan with discrete, trackable tasks`.
  The mermaid diagram on the same page shows the folder as `.kiro/specs/foo`.
- **The lifecycle, question 2 again:** the docs print a mermaid flowchart whose nodes are
  `requirements.md` then `{Happy?}` then on `no` an `Edit/Request changes` loop back to
  `requirements.md`, on `yes` forward to `design.md`, the same gate again, then
  `Implementation`. Approval is a hard gate between phases. There is a second variant,
  Design-First, that runs `design.md` then `requirements.md`. There is a third,
  Quick Spec, described as
  `runs all three phases automatically without approval gates between them`.
- **Pricing, question 6:** `KIRO FREE $0 per month 50 credits`;
  `KIRO PRO $20 per user / month 1,000 credits`;
  `KIRO PRO+ $40 per user / month 2,000 credits`;
  `KIRO PRO MAX $100 per user / month 5,000 credits`;
  `KIRO POWER $200 per user / month 10,000 credits`. Add-on credits are
  `$0.04/credit`. An enterprise tier is `Contact sales`. Free and paid are both listed
  `for teams up to 500`. The page also says
  `Kiro in GovCloud pricing is approximately 20% higher than commercial pricing and does not
  include the Free tier.` A credit is defined as
  `a unit of work in response to user prompts`, and the page says
  `More complex prompts, such as executing a spec task, typically cost more than 1 credit.`
- **Who ships it today:** Amazon Web Services. Prices above.
- **Nobody ships:** a way to open a `.kiro/specs/` folder outside Kiro and get the same
  three-file view. Kiro's own web product tells you to press a `Download` button to
  `save the .md file to your local machine` if you want to keep it or use it elsewhere.
- **The problem it solves for us:** the three-file spec is a product people already pay
  $20 to $200 a month to have generated. The generation is commoditised. The reading,
  reviewing and keeping-true of those files is not.
- **Fit:** frontmatter can open `.kiro/specs/<name>/` as one document with three tabs
  without owning any of the generation. Same bytes, better surface.
- **Effort:** small for the view; the value is in FB6 and FB3.
- **Verdict:** good-to-have.

### FB6. Somebody built per-line comments on a spec document, and they built it in a terminal, because there was no document to put them in

- **Demand:** this is the most telling thing in the whole lens. Amazon Web Services decided
  that reviewing a spec needs line-anchored comments badly enough to implement a full
  document reader with vim keys inside a command-line interface.
- **Source:** https://kiro.dev/docs/cli/terminal-ui.md opened 2026-09-18, section
  `### Spec review`
- **Exact strings from that page:**
  - `When a spec run reaches a phase checkpoint, the checkpoint offers to open the phase
    document for review. Press `Ctrl+X` to read the document in place and stage comments
    against the lines you want changed. Returning to the checkpoint keeps your comments
    staged, and answering the checkpoint question sends them all to the agent as one
    revision request.`
  - `The review screen also supports the mouse: scroll to navigate the document and click to
    position the cursor on a line. Press `m` to toggle mouse support on or off.`
  - The shortcut table includes `Enter` / `e` for
    `Comment on this line, or edit the comment under the cursor`, `Del` for
    `Delete the comment under the cursor`, and `]` `[` for `Next / previous comment`.
  - `Because this surface owns the keyboard while it's open, `Ctrl+X`, `Ctrl+U`, and
    `Ctrl+D` act on the document here rather than toggling the activity tray or moving
    between subagents.`
- **Who ships it today:** Kiro, in the command-line interface only. The same docs page lists
  under `## Limitations`: `External diff tools (`chat.diffTool` setting) are not yet
  supported. All diffs use the built-in viewer.` The capability table on
  https://kiro.dev/docs/specs.md marks `Correctness` (property-based testing) as IDE only
  and `Analyze Requirements` as IDE and CLI only, with `-` for Web and Mobile.
- **Nobody ships:** this as a real document. It is a scrolling text pane with keyboard
  shortcuts, reimplementing Google Docs comments in a terminal, because the spec is a
  markdown file in a repo and the only tools that can reach it are code tools.
- **The problem it solves for us:** a person needs to say `this line is wrong` on a
  specific line of a generated document and have the agent revise from those comments as
  one batch. That is a comment thread anchored to a byte range, and a byte range is
  precisely what our splice engine already addresses.
- **Fit:** as close to native as anything in this research. Comments anchored to a byte
  range, batched into one revision request, each returned edit entering the change queue
  one by one. It reuses the splice addressing, the queue and doc mode, all three already
  in the plan.
- **Effort:** medium. Anchoring survives edits only if the anchor is a byte range plus a
  quoted excerpt, which is the same refuse-when-ambiguous rule we already have.
- **Verdict:** must-have. A commercial team shipped a worse version of this inside a
  terminal, which is the clearest demand signal a document product can get.

### FB7. Requirements have a real syntax now, EARS, and nothing renders it

- **Demand:** Kiro formalises every requirement into a fixed grammar and says why.
- **Source:** https://kiro.dev/docs/specs/feature-specs/requirements-first.md opened 2026-09-18
- **Exact strings:** `System behaviors in EARS format (WHEN...THE SYSTEM SHALL...)`. The page
  prints a worked example inside a markdown fence:
  ```
  WHEN a user submits valid registration data
  THE SYSTEM SHALL create a new user account
  ```
  And a rationale block: `Requirements in EARS format (WHEN...THE SYSTEM SHALL...) are:`
  `Unambiguous and testable`, `Easy to translate into test cases`,
  `Traceable through implementation`,
  `Clear for both technical and non-technical stakeholders`.
  EARS stands for Easy Approach to Requirements Syntax.
  UNVERIFIED: I did not open a primary source for that expansion in this session; Kiro's
  pages use the acronym without expanding it.
- **Who ships it today:** Kiro generates it. spec-kit uses a different but equally rigid
  grammar, `System MUST [capability]` numbered `FR-001`, plus Given/When/Then acceptance
  scenarios. Both are free-form markdown on disk with a grammar the tool expects but the
  file does not enforce.
- **Nobody ships:** any rendering, linting or completion for either grammar. A requirement
  written `WHEN x THE SYSTEM SHALL y` is plain text in every editor on earth. Nothing tells
  you that a line in the requirements section is not in the grammar, that `FR-014` is
  referenced by a task but does not exist, or that two requirements contradict.
- **The problem it solves for us:** a problems panel is already in the plan. Pointing it at
  a spec file gives us a requirements linter for free: unparsed requirement lines, dangling
  `FR-` and `SC-` ids, unresolved `[NEEDS CLARIFICATION: ...]` markers, tasks citing files
  the plan never names.
- **Fit:** a deterministic projection of the file, which is our whole architecture. No state
  is stored, the file is not rewritten, and the panel refuses rather than guesses when a
  line is outside the grammar.
- **Effort:** small. The grammars are tiny and both are published.
- **Verdict:** good-to-have, and cheap.

### FB8. Two products can check a spec for internal contradictions. One product can check a spec against the code that was built, and it offers to fix the spec

- **Demand:** question 5, and this is the richest answer in the lens.
- **Sources:** https://kiro.dev/docs/specs/analyze-requirements.md opened 2026-09-18;
  https://kiro.dev/docs/specs/correctness.md opened 2026-09-18;
  https://raw.githubusercontent.com/github/spec-kit/main/templates/commands/analyze.md
  opened 2026-09-18
- **What exists, exactly:**
  1. **Kiro Analyze Requirements.** The page lists what it catches:
     `**Logical inconsistencies** - two requirements that individually make sense but are
     collectively impossible`, `**Ambiguities** - language like "large files" or "fast
     response times" that would produce divergent implementations`,
     `**Conflicting constraints**`, `**Unstated assumptions**`, `**Missing edge cases**`.
     It warns `The analysis takes minutes, not seconds - cross-requirement reasoning is more
     computationally intensive than typical Kiro operations.` The capability table on
     https://kiro.dev/docs/specs.md marks it available in IDE and CLI, `-` in Web and Mobile.
  2. **spec-kit analyze.** Its own description: `Perform a non-destructive cross-artifact
     consistency and quality analysis across spec.md, plan.md, and tasks.md after task
     generation.` It is `**STRICTLY READ-ONLY**`, limits itself to
     `Limit to 50 findings total`, and emits a severity-ranked table plus a
     `**Coverage Summary Table:**` with columns `Requirement Key | Has Task? | Task IDs |
     Notes` and `**Metrics:**` including `Coverage % (requirements with >=1 task)`.
     Its detection passes are named `Duplication Detection`, `Ambiguity Detection`,
     `Underspecification`, `Constitution Alignment`, `Coverage Gaps`, `Inconsistency`.
     Under Ambiguity it says `Flag vague adjectives (fast, scalable, secure, intuitive,
     robust) lacking measurable criteria`. (That adjective list is quoted verbatim from
     spec-kit and is left exactly as written, even though the house style gate
     objects to one of the words in it.) Under Inconsistency:
     `Terminology drift (same concept named differently across files)`.
     Crucially it never reads the source code. It compares documents to documents.
  3. **Kiro Correctness, property-based testing.** This is the only spec-to-code check in
     the lens that can conclude the spec is the thing that is wrong. From the page:
     `"Spec correctness" helps answer a fundamental question: does your implementation
     actually do what you specified? When AI generates code, how do you know it matches your
     intent?` It extracts properties from the EARS requirements, then:
     `When it finds a violation, Kiro can automatically update your implementation or
     surface options to fix the spec, implementation, or test itself.`
     And on traceability:
     `Hovering over a property reveals its connection to the original requirement and linked
     task.`
     The honest limits are printed too:
     `It provides evidence of correctness, not a proof. It is not formal verification, so
     passing tests raise confidence but do not guarantee the absence of bugs.` and
     `A property that is too weak, or that states the wrong invariant, will pass while the
     real behavior is still wrong.`
     The capability table at the top of that page reads
     `| Property-based testing | ✓ | — | — | — |`, that is, the desktop IDE only.
- **Who ships it today:** Kiro, in the paid product, desktop only for the strongest version.
  spec-kit ships the weaker document-only version free.
- **Nobody ships:** a view of which requirement is covered, which is contradicted and which
  is orphaned, sitting next to the requirement, in the document. spec-kit prints the coverage
  table into a chat transcript that is gone when the session ends. Kiro shows it on hover
  inside one desktop application.
- **The problem it solves for us:** a person reading a spec wants to know, per requirement,
  whether anything in the repository actually implements it. That is a per-line status on a
  document, and a document is what we are.
- **Fit:** strong, and it is a projection, not stored state: recompute the coverage map from
  the files each time and never write it into the spec.
- **Effort:** large for a real one. Medium for the cheap version that maps `FR-` ids from
  `spec.md` to mentions in `tasks.md` and to checkbox state, which is most of the value.
- **Verdict:** good-to-have. Start with the cheap ids-and-checkboxes version.

### FB9. The company that made "the spec is the source of truth" its whole identity has quietly stopped selling it

- **Demand:** this is a negative finding, and it is the most important warning in the lens.
- **Sources:** https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry
  opened 2026-09-18 via WebFetch; https://docs.tessl.io/llms.txt opened 2026-09-18;
  https://docs.tessl.io/overview/readme.md opened 2026-09-18;
  https://docs.tessl.io/reference/glossary.md opened 2026-09-18;
  https://registry.tessl.io opened 2026-09-18 (it redirects to https://tessl.io/registry);
  https://tessl.io/pricing opened 2026-09-18
- **What they said then.** The launch post is dated `23 Sept 2025` and says:
  `The Tessl Framework lets teams define what to build before they start coding, using
  carefully crafted specifications ("specs") or AI-generated "vibe-specs." These
  instructions live in the codebase as long-term memory, guiding agents as the app evolves
  and pairing with tests to enforce guardrails so existing functionality isn't broken.` and
  `The Tessl Spec Registry helps agents use open source libraries correctly, with more than
  10,000 pre-built specs that explain how to avoid API hallucinations and version mixups.`
  The post shows a spec file path with the extension `.spec.md`, for example
  `./big-int.spec.md`.
- **What the product says now.** The current docs index at `docs.tessl.io/llms.txt` lists
  about 60 pages. Not one is about specs. The overview page names
  `six components`: `Registry & package manager`, `Governance`, `Evals`, `Observability`,
  `Context and Findings`, `Tessl Agent`. The glossary defines `Tessl CLI`,
  `Tessl Registry`, `Skill`, `Tessl package (Plugin)`, `Tessl project`, `Repository`,
  `Codebase`, `Working directory`, `Project link`, `Rules`, `Evaluations (evals)`.
  There is no entry for spec. The registry that was a `Spec Registry` in September 2025 now
  loads as `Skills Registry` with the strap line
  `Find skills that make AI agents work correctly.` and the site title
  `Tessl • The package manager for agent skills`.
- **Pricing, question 6:** `Free $0 / month`, `1,000 credits included each month`,
  `Single workspace`; `Team $100 / month`, `5x the monthly credits of Free`;
  `Enterprise Custom`, `Platform fee plus credits`. The page says
  `Publishing and installing plugins is always free, so credits only go to reviews, evals,
  and agent runs`.
- **The blog is still full of the old thesis,** which is how the pivot is visible: the
  sitemap still carries `/blog/from-vibe-coding-to-spec-driven-development`,
  `/blog/from-code-centric-to-spec-centric`,
  `/blog/spec-driven-development-10-things-you-need-to-know-about-specs`,
  `/blog/the-most-valuable-developer-skill-in-2025-writing-code-specifications` and
  `/podcast/revolutionising-spec-driven-development-with-tessl-s-framework-registry`.
- **The problem it solves for us:** it tells us what not to build. The strong version of
  spec-driven development, where the spec is the only human-edited artefact and code is
  regenerated from it, was tried commercially by its loudest advocate and the product moved
  to governing agent context instead. INFERENCE: the durable business was in reviewing and
  governing what agents produce, not in owning the source of truth. That is the same
  conclusion the change queue already encodes.
- **Fit:** as a constraint. frontmatter should be the best place to read, review and keep a
  spec honest. It should not claim the spec replaces the code.
- **Effort:** none. This is a position, not a feature.
- **Verdict:** skip the strong claim, keep the surface. Do not build regeneration-from-spec.

### FB10. OpenSpec already models a spec change as a reviewable delta that is merged on archive, which is our change queue applied to a document

- **Demand:** 68,919 stars, 4,729 forks, 119 open issues and 109 open pull requests on
  `Fission-AI/OpenSpec`, read from the repository page. It is published on npm as
  `@fission-ai/openspec`. The README calls it
  `The most loved spec framework.` and lists a philosophy block that opens
  `→ fluid not rigid`.
- **Source:** https://github.com/Fission-AI/OpenSpec opened 2026-09-18;
  https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/README.md opened 2026-09-18;
  https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/docs/cli.md opened 2026-09-18
- **The layout, copied from the README transcript:**
  ```
  Created openspec/changes/add-dark-mode/
  ✓ proposal.md — why we're doing this, what's changing
  ✓ specs/       — requirements and scenarios
  ✓ design.md    — technical approach
  ✓ tasks.md     — implementation checklist
  ```
  and on archive: `Archived to openspec/changes/archive/2025-01-23-add-dark-mode/`
  followed by `Specs updated. Ready for the next feature.`
- **The format, and this is the part that matters.** A change does not contain a whole spec.
  It contains a delta. The README prints it verbatim:
  ```markdown
  ## ADDED Requirements

  ### Requirement: Theme selection
  The app SHALL let users switch between light and dark themes,
  defaulting to the system preference.

  #### Scenario: User toggles dark mode
  - **WHEN** the user clicks the theme toggle
  - **THEN** the app switches to dark mode and persists the choice
  ```
  The README introduces it as `Plain Markdown — requirements with concrete scenarios, no
  special syntax to learn.` and adds `Your AI writes these; you review the plan before any
  code is written.` The counterpart verb appears in the validate documentation, which says
  it will `check a change's MODIFIED requirements against the main specs they would
  replace.` So a spec edit is expressed as `ADDED` and `MODIFIED` sections that are applied
  to the living spec at archive time.
- **Who ships it today:** OpenSpec, MIT licensed, free. Stores, its cross-repo planning
  feature, is in beta.
- **Nobody ships:** a visual review of that delta. The delta is a markdown heading
  convention. To see what the change does to the living spec you either read two files side
  by side by hand, or you run `openspec validate` and read a text report.
- **The problem it solves for us:** a change to a document, proposed by an agent, reviewed
  as a delta, accepted or rejected, then merged into the source of truth. That sentence
  describes OpenSpec's archive flow and it also describes our change queue, word for word.
  The difference is that OpenSpec does it with a filename convention and a command-line
  interface, and we would do it on the document.
- **Fit:** exact, and it is the closest external validation of the queue in the whole brief.
  A queue entry that renders `## ADDED Requirements` against the current `openspec/specs/`
  file, shows the before and after, and accepts or rejects one requirement at a time.
- **Effort:** medium. The delta grammar is three heading levels and two verbs.
- **Verdict:** good-to-have, with the strongest strategic read of anything here. Supporting
  one named convention is worth more than a generic diff view.

### FB11. The only honest statement anyone has published about spec drift is in OpenSpec's docs, and it says reconcile in whichever direction is true

- **Demand:** the question is asked so often that the docs use the question itself as a
  heading.
- **Source:** https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/docs/editing-changes.md
  opened 2026-09-18
- **Exact strings, and these are the quotes worth keeping:**
  - Heading: `## "I edited the code by hand. How do I reconcile that with OpenSpec?"`
  - `This happens constantly and it's fine. You tweaked something in your editor, and now the
    code and the artifacts disagree. Bring them back in sync in whichever direction is true:`
  - `**The code is now correct, the spec is stale.** Update the delta spec (and tasks, if
    relevant) to describe the behavior you actually shipped. The spec should match reality
    before you archive, because archiving merges the spec into your source of truth.`
  - `**The spec is correct, the code drifted.** Keep building or fixing until the code
    matches the spec.`
  - `A fast way to surface mismatches is `/opsx:verify`: it reads your artifacts and your
    code and tells you where they diverge. Treat its output as a to-do list for
    reconciliation, then archive once they agree.`
  - `The principle: at archive time, your specs become the truth of record. So before you
    archive, make the specs honest about what the code does. Manual edits are welcome; just
    don't let them quietly desync the spec.`
  - On the artefacts themselves: `**Every artifact in a change is just a Markdown file you
    can edit at any time.** There is no locked "planning phase," no approval gate, no
    special edit mode to enter.` and `The mental model: artifacts are the live plan, not a
    signed contract.`
  - On the task list: ``tasks.md` is a living checklist, not a frozen plan.` and
    `The AI checks items off as it completes them during `/opsx:apply`, and it resumes from
    the first unchecked task if you come back later.`
- **Who ships it today:** OpenSpec is the only one of the five that will admit the code can
  be right and the spec wrong, and `/opsx:verify` is the only free tool that reads both and
  reports divergence. Kiro's property-based testing reaches the same conclusion by a
  different route and is desktop-only and paid. spec-kit's `converge` explicitly refuses to
  touch the spec.
- **Nobody ships:** the reconciliation itself as a reviewable thing. Every tool tells you to
  go and fix it by hand. `Treat its output as a to-do list` is a to-do list in a chat
  transcript that disappears.
- **The problem it solves for us:** when the code and the document disagree, somebody has to
  decide which one is wrong, one disagreement at a time. That is a queue of decisions over a
  document, which is the product.
- **Fit:** exact. Each divergence becomes a queue entry with two accept buttons rather than
  one: change the document, or record that the code is wrong.
- **Effort:** large to detect divergence properly, medium to present divergences that an
  agent or an external tool has already found.
- **Verdict:** must-have as the product story. Build the presentation first and let the
  agent do the detecting.

### FB12. Everyone validates the spec on the way in, nobody keeps validating it afterwards, and the human view is always a terminal

- **Demand:** four of the five conventions ship a validator, and every one of them prints to
  a terminal.
- **Sources:** https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/docs/cli.md
  opened 2026-09-18; the spec-kit and Kiro sources already cited in FB8.
- **What OpenSpec validate does, copied from the page:**
  `Validate changes and specs for structural issues, and check a change's MODIFIED
  requirements against the main specs they would replace.`
  `A change with zero spec deltas fails validation unless its `.openspec.yaml` declares
  `skip_specs: true``.
  Its flags include `--all`, `--changes`, `--specs`, `--strict`, `--json`,
  `--concurrency <n>` and `--archived`, of which the last is described as:
  `it verifies that every change under `changes/archive/` has all of its `tasks.md`
  checkboxes ticked, exiting non-zero if any are unchecked. This catches changes that were
  archived with unfinished work — handy in a pre-commit hook.`
  The text output is a checklist: `✓ proposal.md valid`, `✓ specs/ui/spec.md valid`.
- **The human and agent split, which nobody else writes down so plainly.** OpenSpec's command
  reference has two tables, headed `### Human-Only Commands` and
  `### Agent-Compatible Commands`. The human-only list is
  `openspec init`, `openspec view`, `openspec workset open <name>`, `openspec config edit`,
  `openspec feedback`, `openspec completion install`. `openspec view` is described as
  `Interactive dashboard`. Every agent-compatible command exists mainly so it can be run
  with `--json`.
- **Nobody ships:** a dashboard that is not a terminal. The one command they set aside for
  humans is a text user interface. INFERENCE: they set it aside because a terminal is what
  they had, not because a terminal is what a human wants.
- **The problem it solves for us:** the validator output is the raw material for a problems
  panel that already exists in our plan. A JSON flag exists on every one of these tools, so
  we do not have to reimplement the checking, only display it against the lines it refers to.
- **Fit:** a problems panel over `openspec validate --all --json`, per-file, per-line, live.
  No state stored, nothing written back.
- **Effort:** small if we consume the existing JSON. Large if we write our own checker.
- **Verdict:** good-to-have. Consume the JSON, do not compete with the checker.

## Part 2: what people say goes wrong

Note on counts: Hacker News story scores below are read from the Algolia item API.
Per-comment scores come back as `null` from that API for these threads, so no comment
vote count is claimed anywhere below. Where I name a commenter it is their Hacker News
username as returned by the API.

### FB13. The loudest complaint is that nothing ever merges the specs into one truth, and the second loudest is that there are too many files

- **Demand:** two Hacker News threads, opened through the Algolia item API.
- **Sources:** https://news.ycombinator.com/item?id=45610996 opened 2026-09-18, titled
  `Understanding Spec-Driven-Development: Kiro, Spec-Kit, and Tessl`, **128 points**,
  33 nodes, posted 2025-10-16, linking
  https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html ;
  https://news.ycombinator.com/item?id=45798473 opened 2026-09-18, titled
  `Toolkit to help you get started with Spec-Driven Development`, **84 points**, 43 nodes,
  posted 2025-11-03, linking https://github.com/github/spec-kit
- **The quotes, copied exactly:**
  - `iamdeedubs`: `In my experiments with SpecKit I was always left wondering "when does it
    merge all this specs into a single ground truth". I never got there and it felt like a
    huge missing step.`
  - `gsadaka`: `Following a BDD approach with a coding CLI works a lot better, as it
    documents the features as code rather than verbose markdown files no one will read.`
  - `tharkun__`: `And I simply can't read all the documents the AIs write for themselves to
    correct all of them and even if I did I wouldn't be sure enough that they'd improve
    significantly enough for me to try and spend this mind bogglingly boring amount of time`
  - `ctxc`: `I was excited to use spec-kit. I had to dump it eventually when it generated
    steps that were the equivalent of Tony Stark building a robot from scratch in a cave
    when "just screw this bolt on" would have sufficed.`
  - `hatmanstack`: `In my experience with Kiro's spec-driven approach it generated massive
    task lists (12+ tasks with 4+ sub-tasks each). The workflow was decent but it deleted
    code unpredictably and wouldn't revert changes.`
  - `iamsaitam`, quoting the article: `The requirements document turned this small bug into
    4 "user stories" with a total of 16 acceptance criteria`
  - `yodon`: `All the tutorials I've found are little more than "here's how to install it -
    now let's make a todo list app from scratch!!"` and
    `Would be great to see how others are handling real world use cases like making
    incremental improvements or refactorings to a huge legacy code base that didn't start
    out as a spec driven development hello world project.`
  - `fabianlindfors`: `The note on how all those tools seem to mostly be spec-first and vague
    about spec maintenance was interesting to me.`
  - `trjordan`, in the spec-kit thread: `I don't think we ever get away from the code being
    the source of truth. There has to be one source of truth.` and
    `If you want to go all in on specs, you must fully commit to allowing the AI to
    regenerate the codebase from scratch at any point. I'm an AI optimist, but this is a
    laughable stance with current tools.`
  - `Marazan`: `it is _unbelievably_ frustrating to see the Agent get 99% of the code right
    in the first pass only to misunderstand why a test is now failing and then completely
    mangle both it's own code and the existing tests as it tries to "fix" the "problem".`
  - `shubhamjain`: `You need code. You will need it for a long time.`
  - `insin`, on spec-kit's own methodology document: `This isn't just me not reading your
    comprehensive guide [1]. It's me recognising you couldn't even be bothered to write it
    yourself.` with the footnote pointing at
    https://github.com/github/spec-kit/blob/main/spec-driven.md
- **What the complaints are actually about, sorted:**
  1. Volume. Too many documents, too long, nobody reads them. Named by `gsadaka`,
     `tharkun__`, `ctxc`, `hatmanstack`, `iamsaitam`.
  2. No merge step. The artefacts never become one thing. Named by `iamdeedubs` in the
     single sharpest sentence in either thread.
  3. Maintenance is undefined. Named by `fabianlindfors`, and it matches what GitHub's own
     docs admit in FB4.
  4. Nothing works on an existing codebase. Named by `yodon`.
  5. The strong claim is not believed. Named by `trjordan` and `shubhamjain`.
- **Who ships it today:** nobody solves 1, 2 or 3. OpenSpec's archive step is the closest
  thing to a merge that exists, and it is a filename move plus a text report.
- **The problem it solves for us:** complaints 1 and 2 are document problems. A person
  cannot read eight files and 1,300 lines in a code editor. They can read one document with
  an outline, a progress bar and a coverage marker per requirement. And `when does it merge
  all this specs into a single ground truth` is the change queue.
- **Fit:** direct. Outline, backlinks, tasks and doc mode are all already in the plan; what
  is new is pointing them at a spec folder and treating the folder as one document.
- **Effort:** medium. A folder-as-one-document view with a working outline across files.
- **Verdict:** must-have. This is the demand with a receipt the brief asked for.

## Part 3: question 3, the editing surface. Nobody has one.

### FB14. There is no product anywhere that gives a spec a good editing surface. The best attempt is a sidebar that, when you click a document, hands the file to your operating system

- **Demand:** I went looking for a single product that lets a person write and revise these
  markdown files in something other than a code editor. I did not find one. Everything I
  found either lives inside a code editor as a sidebar, or is a terminal, or is a viewer
  that opens the file somewhere else.
- **Sources, all opened 2026-09-18:**
  - https://specs.md/ and https://specs.md/llms.txt
  - https://specs.md/getting-started/ide-extension.md
  - https://specs.md/getting-started/specs-md-dashboard.md
  - https://kiro.dev/docs/cli/terminal-ui.md (already cited in FB6)
  - https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/docs/cli.md (FB12)
- **The state of the art, and the sentence that says it all.** specs.md ships the most
  developed viewing surface anyone has built for these files: a VS Code sidebar extension
  published to the Microsoft VS Code Marketplace as `fabriqaai.specsmd` and to Open VSX,
  plus a local web dashboard started with `npx specsmd@latest dashboard`. The extension is
  described as `a visual dashboard for tracking your development progress` whose job is to
  `Monitor runs/bolts, browse specs, and see project metrics—all from your IDE sidebar.`
  Its tabs are `Runs Tab`, `Intents Tab`, `Overview Tab`. The web dashboard
  `reuses the same dashboard UI components as the VS Code extension, runs against the
  current workspace, and watches for changes as your project state updates.` And then:
  > `When you click a document, story, standard, or artifact, specsmd asks your operating
  > system to open that local file from the current workspace.`
  That is the ceiling. The most advanced spec dashboard in existence cannot show you the
  document. It hands the file to the operating system and lets something else open it.
- **The three shapes everyone has landed on, and none of them is a document:**
  1. A sidebar inside a code editor. specs.md. It tracks, it browses, it counts. It does
     not render the spec and it does not edit it.
  2. A terminal. Kiro's spec review pane (FB6), OpenSpec's `openspec view`, which its own
     docs file under `### Human-Only Commands` and label `Interactive dashboard` (FB12),
     and specs.md's `dashboard-cli`, whose docs say
     `Use `dashboard-cli` when you specifically want the interactive terminal UI.`
  3. A proprietary desktop application. Kiro's own editor, where the spec pane and the
     property hover live, at $20 to $200 a person a month.
- **What none of them do:**
  - Render the document properly. No outline across the four or five files of one feature.
    No rendered Given/When/Then. No rendered task tree. No diagram from the design file.
  - Let a non-developer read it. Every one of these requires a checkout, a terminal or an
    editor install. The spec-kit template asks for requirements
    `Clear for both technical and non-technical stakeholders` in Kiro's words, and then the
    only way to read them is `git clone`.
  - Comment on a line and keep the comment. Kiro stages comments and then throws them away
    after one revision request. There is no thread and no history.
  - Show the spec and the code side by side.
  - Work on a phone.
- **Who ships it today:** nobody. This is the clean negative result the brief asked for and
  I am stating it plainly: **as of 2026-09-18 there is no product that gives a
  spec-driven-development specification a good editing surface outside a code editor.**
  The closest, specs.md, is explicitly a tracker that delegates opening the file.
- **The problem it solves for us:** every one of these tools writes markdown into a repo and
  then has no way to show it. frontmatter is a markdown editor for exactly those files, on
  web, desktop and phone, on one account, with a published page and a share link. The gap
  is not a feature we would add. It is the product, pointed at a folder that already exists
  on tens of thousands of machines.
- **Fit:** total. Doc mode over `specs/*/spec.md`. Outline across the feature folder.
  Tasks view over `tasks.md`. Mermaid over `design.md`, which Kiro says contains
  `sequence diagrams`. Share by link so a product manager can read the requirements without
  a checkout. None of it requires owning the format or changing a byte.
- **Effort:** medium, and most of the parts are already in the plan. The new work is
  recognising the folder shape and stitching several files into one reading surface.
- **Verdict:** must-have. If one thing comes out of this lens, it is this: the whole field
  generates documents it cannot display.

### FB15. The single most upvoted request on the biggest spec tool is, in its own title, that you cannot edit a spec once it exists

- **Demand:** issue **#1191** on `github/spec-kit`, titled
  `Spec-Driven Editing Flow: Can't Easily Update or Refine Existing Specs`, carries
  **115 reactions** made up of **105 thumbs up, 6 hearts and 4 hooray**, with 8 comments.
  Opened 2025-11-15 by `dialedin2014`, closed 2026-04-08. Reaction breakdown read from the
  GitHub search API, which returns the per-emoji counts.
- **Source:** https://github.com/github/spec-kit/issues/1191 opened 2026-09-18 through
  https://api.github.com/search/issues
- **Exact strings from the issue body:**
  - `Multiple users find it difficult to update, refine, or iterate on existing specs in
    Spec Kit without creating new branches and redundant specification artifacts.`
  - `The current workflow for `/speckit.specify` is optimized for net-new feature creation`
  - `There's no dedicated command (e.g. `/speckit.update`, `/speckit.refine`,
    `/speckit.edit`, `/speckit.bugfix`) to refine existing specs within the same
    branch/artifact.`
  - `Workarounds (manual file edit, running `/speckit.clarify`, copying files) are unclear,
    error-prone, and not universally documented.`
  - The four bullets under `real-world projects often require`:
    `Refining specs after feedback or implementation`,
    `Editing requirements after clarification, planning, or bugfixes`,
    `Iterating on small changes without repeating all steps or generating a new branch`,
    `Keeping specs in sync as features evolve (see linked/discussion issues)`.
  - Under `## Impact`: `Would make Spec Kit safer for iterative, production development;
    easier to onboard brownfield teams; encourage living spec workflows; reduce
    confusion/friction from current approach.`
- **It is a hub issue, and the cluster is the receipt.** #1191 links ten other issues by
  number and title, all opened independently:
  - #1130 `Right way to change Spec after /implement`
  - #620 `How to keep specs consistent and up-to-date with spec-kit?`
  - #1136 `Enable incremental planning and development through distinct feature plans as artifacts`
  - #1118 `Documentation Request - How to iterate?`
  - #1173 `Docs for using speckit in brownfield projects and GitHub custom agents integration`
  - #1066 `bug: automatic branch naming repeats numbering prefix such as 001-second-branch after 001-first-branch`
  - #1165 `Different commands produce/expect different branch name syntax`
  - #1151 `Specs Directory Created at Git Root Instead of Project Root`
  - #619 `New slash command /bugfix`
  - #1174 `Proposal: speckit.tinySpec: a lightweight workflow for small tasks`
- **The related issues I opened, with their own numbers:**
  - **#620**, still **open** as of 2026-09-18, 13 comments, 12 reactions, opened 2025-09-27
    by `elebescond`, titled `How to keep specs consistent and up-to-date with spec-kit?`.
    Its body gives the cleanest worked example of drift anyone has written down:
    `Feature **001 – User Login** defines that a user can log in with email + password.`
    `A few months later, feature **009 – Two-Factor Authentication** enhances the login by
    adding an extra step (OTP code).`
    `In this case, the original spec of feature 001 becomes partially outdated or needs to
    be complemented by feature 009.`
    And the questions it asks and nobody answered:
    `Is there a recommended approach to **consolidate specs over time**?`
    `Should the original feature be modified, or is it better to keep the historical record
    and add links to subsequent evolutions?`
    That issue has been open for close to a year.
  - **#1063**, closed, 5 comments, **24 reactions**, opened 2025-10-27, titled
    `Feature: /speckit.reconcile — close post‑implementation gaps by asking clarifying
    questions, then amending spec.md, plan.md, and tasks.md`. Someone asked for exactly the
    reverse-direction command described in FB3, and asked for it by name.
  - **#1323**, closed, 3 comments, **28 reactions**, opened 2025-12-11, titled
    `Add /speckit.review as a final, constitution-aware quality gate`.
  - A search for `repo:github/spec-kit is:issue drift` returns **total_count: 143**.
- **Who ships it today:** nobody, and #1191 is closed. UNVERIFIED: I did not read the
  closing comment, so I cannot say whether it was closed by shipping something, by the
  `converge` command, or as stale.
- **Nobody ships:** an edit surface. Read the list of what users want again:
  `A clear, supported workflow to refine specs in place`. They are asking a command-line
  tool for an editor.
- **The problem it solves for us:** 105 people pressed thumbs up on the sentence
  `Can't Easily Update or Refine Existing Specs`. We are an editor. Editing existing
  markdown files in place, byte-exactly, is the one thing we do that no spec tool does.
- **Fit:** total, and it needs no new engine work. Open the file, edit it, splice it.
- **Effort:** small. The capability already exists. What is missing is knowing the folder
  shape so the edit lands in a useful view.
- **Verdict:** must-have, and it is the number to quote in any pitch: 115 reactions on
  `Can't Easily Update or Refine Existing Specs`.

### FB16. Task Master is the one that kept its state in JSON rather than markdown, and it is the outlier worth copying

- **Demand:** 28,083 stars, 2,621 forks, 163 open issues, 49 open pull requests on
  `eyaltoledano/claude-task-master`, read from the repository page 2026-09-18. It is now
  documented under the Hamster product at tryhamster.com.
- **Sources:** https://github.com/eyaltoledano/claude-task-master opened 2026-09-18;
  https://raw.githubusercontent.com/eyaltoledano/claude-task-master/main/README.md
  opened 2026-09-18;
  https://tryhamster.com/docs/taskmaster/capabilities/task-structure opened 2026-09-18
- **What is different:** everyone else writes the task list as a markdown checkbox list that
  an agent has to parse and rewrite. Task Master keeps tasks in `tasks.json` with a declared
  field list, copied from the docs page: `id`, `title`, `description`, `status`
  (`"pending"`, `"done"`, `"deferred"`), `dependencies` (`[1, 2]`), `priority`
  (`"high"`, `"medium"`, `"low"`), `details`, `testStrategy`, `subtasks`, and `metadata`,
  which the page describes as `Optional user-defined data` useful for
  `External IDs : Link tasks to GitHub issues`. Separately it renders per-task text files
  whose format the page prints as `# Task ID: <id>`, `# Title: <title>`,
  `# Status: <status>`, `# Dependencies: <comma-separated list of dependency IDs>`,
  `# Priority: <priority>`, `# Description:`, `# Details:`, `# Test Strategy:`.
  The requirements document is `.taskmaster/docs/prd.txt`, a plain text file rather than
  markdown, with a starter at `.taskmaster/templates/example_prd.txt`.
- **Who ships it today:** free and open source, with a commercial home at tryhamster.com.
  UNVERIFIED: I did not open the Hamster pricing page, so no price is claimed for it.
- **Nobody ships:** a good editing view over a JSON task store. That is precisely the case
  where a projection earns its keep, because nobody wants to hand-edit JSON and nobody
  should let a model rewrite a whole JSON file to tick one box.
- **The problem it solves for us:** it is the counter-example that proves the rule from the
  rest of this lens. Structured state that an agent must not rewrite belongs in a machine
  format; narrative that a person needs to restructure belongs in markdown. Every other tool
  here put the checkbox state in markdown and then had to write careful rules forbidding the
  agent from reordering it, for example spec-kit's checklist note
  `reads checklist checkbox state as a gate and must not modify markers` and its converge
  rule `rewrite, renumber, reorder, or delete any existing task`.
- **Fit:** a tasks view that reads `tasks.json` and writes back one field, plus a rendered
  markdown view for the narrative files. Splice-only writing over JSON is the same operation
  as over markdown: find the byte range, replace those bytes, refuse when ambiguous.
- **Effort:** medium. A second, non-markdown projection is genuinely new work.
- **Verdict:** good-to-have, low priority, but it settles a design question: do not put
  accept-or-reject state in prose.

### FB17. Somebody measured the cost, and it is roughly five lines of markdown per line of code and six minutes of reading per minute of generating

- **Demand:** a named engineer ran spec-kit on a real feature in a real application and
  published every number, step by step, with links to the commits.
- **Source:** https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html
  opened 2026-09-18 with curl. By `Colin Eberhardt`, dated `26 November 2025`,
  marked `12 min read`, filed under `Artificial Intelligence`.
- **The verdict, in his words, from the opening paragraph:**
  `The experience wasn't great, a sea of markdown documents, long agent run-times and
  unexpected friction. While SDD is an interesting thought experiment, I'm not sure it is a
  practical approach.`
  And at the end of the walkthrough:
  `Ultimately a lot of time spent reviewing markdown or waiting for the agent to churn out
  more markdown. I didn't see any qualitative benefit to justify the overhead.`
- **His published totals, copied from the post:**
  - First increment: `33m30 - of agent execution time`, `689 loc`,
    `2,577 lines of markdown`, `3.5 hrs review time`.
  - Second increment: `23m30 - of agent execution time`, `~300 loc`,
    `2,262 lines of markdown`, `~2 hrs review`.
  - The plan step alone produced, in his list: a `444-line module contract`, a
    `395-line data model`, a `285-line plan`, a `500-line quick start` and a
    `406-line research document`.
- **The arithmetic, computed here from his numbers, not taken from the page:**
  - Increment one, markdown to code: 2,577 / 689 = **3.74 lines of markdown per line of
    code**.
  - Increment two: 2,262 / 300 = **7.54**.
  - Both together: 4,839 / 989 = **4.89**.
  - Increment one, review time to generation time: 210 minutes / 33.5 minutes = **6.27**.
  - Increment two: 120 / 23.5 = **5.11**.
  - Note on one inconsistency: the five plan-step documents he lists sum to 2,030 lines,
    while the stats block for that step reads `2,067 lines of markdown generated`. The same
    stats block is printed twice in the post, once under Plan and once under Tasks, which
    looks like a copy-and-paste. I am reporting both numbers rather than choosing one.
- **His sharpest observation, and it is the one that matters most to us.** He hit a trivial
  bug after implementation and wrote:
  `Given that I am following SDD, I should clarify my specification, then repeat the above
  steps. But how to express this bug from a specification perspective? It was a trivial and
  clumsy mistake. I asked Copilot, and it concurred, this isn't an issue with the spec.`
  followed by
  `There is a lot of debate on the GitHub Discussions board about how to refine / fix the
  implementation. It isn't entirely clear.`
  That is the same hole as FB3, FB4 and FB11, found independently by measurement.
- **One more line worth keeping,** on the plan step's module contract:
  `Ironically this is 4x the length of the actual module itself (once implemented).`
- **Who ships it today:** nobody addresses the volume. Every tool in this lens produces more.
- **The problem it solves for us:** four to five thousand lines of generated markdown per
  feature, reviewed at five to six minutes per minute of generation, in a code editor. That
  is a reading problem and a reviewing problem, and it is the exact shape of the product.
  An outline, a progress bar, a change queue and a document view are not conveniences at
  that volume, they are the difference between reviewing it and not.
- **Fit:** it argues for the reading surface over any new generation feature. We should not
  add another document generator to a field drowning in documents.
- **Effort:** none, this is evidence rather than a feature.
- **Verdict:** must-have as the number to lead with. Four thousand eight hundred lines of
  markdown for nine hundred and eighty nine lines of code, with three and a half hours of
  human reading, is the market.

### FB18. A Thoughtworks Distinguished Engineer wrote the product requirement for us, in one sentence, on martinfowler.com, and GitHub's own documentation links to her article

- **Demand:** this is the authoritative write-up of the field, by `Birgitta Böckeler`,
  described on the page as `a Distinguished Engineer and AI-assisted delivery expert at
  Thoughtworks` with `over 20 years of experience as a software developer, architect and
  technical leader`. Dated `15 October 2025`. spec-kit's own
  `docs/concepts/spec-persistence.md` cites this exact URL as
  `One overview of SDD tooling`, and the article was the subject of the 128-point Hacker
  News thread in FB13.
- **Source:** https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
  opened 2026-09-18 with curl
- **The sentence, and it is the whole brief in fourteen words:**
  > `To be honest, I'd rather review code than all these markdown files. An effective SDD
  > tool would have to provide a very good spec review experience.`
  Her section heading above it is `Reviewing markdown over reviewing code?`
- **The rest of that section, copied exactly:**
  `spec-kit created a LOT of markdown files for me to review. They were repetitive, both
  with each other, and with the code that already existed. Some contained code already.
  Overall they were just very verbose and tedious to review.`
  and
  `In Kiro it was a little easier, as you only get 3 files, and it's more intuitive to
  understand the mental model of "requirements > design > tasks".`
- **Her three levels, which the whole field including GitHub now uses:**
  `Spec-first: A well thought-out spec is written first, and then used in the AI-assisted
  development workflow for the task at hand.`
  `Spec-anchored: The spec is kept even after the task is complete, to continue using it for
  evolution and maintenance of the respective feature.`
  `Spec-as-source: The spec is the main source file over time, and only the spec is edited
  by the human, the human never touches the code.`
  Followed by the finding that matters:
  `All SDD approaches and definitions I've found are spec-first, but not all strive to be
  spec-anchored or spec-as-source. And often it's left vague or totally open what the spec
  maintenance strategy over time is meant to be.`
- **Her definition of a spec,** which is the best one I found anywhere:
  `A spec is a structured, behavior-oriented artifact - or a set of related artifacts -
  written in natural language that expresses software functionality and serves as guidance
  to AI coding agents.`
- **The two vendor claims she quotes, which answer the Tessl part of the brief:**
  GitHub: `In this new world, maintaining software means evolving specifications. […] The
  lingua franca of development moves to a higher level, and code is the last-mile approach.`
  Tessl: `A development approach where specs — not code — are the primary artifact. Specs
  describe intent in structured, testable language, and agents generate code to match them.`
  That second quote is the `spec is the source of truth` claim the brief asked me to find.
  It is quoted here from her article, which attributes it to Tessl. It no longer appears
  anywhere in Tessl's current documentation, per FB9.
- **What she saw inside Tessl's spec-as-source mode,** worth recording because nobody else
  documented it: `A Tessl spec can serve as the main artifact that is being maintained and
  edited, with the code even marked with a comment at the top saying
  // GENERATED FROM SPEC - DO NOT EDIT. This is currently a 1:1 mapping between spec and
  code files, i.e. one spec translates into one file in the codebase.` And the honest result:
  `Even at this low abstraction level I have seen the non-determinism in action though, when
  I generated code multiple times from the same spec.`
- **Her other three criticisms, each a section heading:** `One workflow to fit all sizes?`
  (`the workflow was like using a sledgehammer to crack a nut`; the same small bug produced
  `4 "user stories" with a total of 16 acceptance criteria`), `False sense of control?`
  (`the agent ignored the notes that these were descriptions of existing classes, it just
  took them as a new specification and generated them all over again, creating duplicates`),
  and `How to effectively separate functional from technical spec?`.
- **Who ships it today:** nobody. She wrote the requirement in October 2025 and as of
  2026-09-18 the answer is still a sidebar, a terminal or a proprietary desktop application,
  per FB14.
- **Nobody ships:** `a very good spec review experience`. Those are her words, and they are
  a product specification for frontmatter.
- **The problem it solves for us:** it removes the guesswork. We do not have to argue that
  the market wants a spec reading and reviewing surface. The most credible independent
  reviewer in the field named it as the missing requirement, and the market leader links to
  her article from its own documentation.
- **Fit:** total, and it is the sentence to put at the top of any deck.
- **Effort:** none, this is evidence.
- **Verdict:** must-have as the quote. Everything else in this lens is a way of building
  what that sentence asks for.

---

## Direct answers to the six questions

**1. File names and folder layouts.** The table in FB2, corrected against opened sources.
Short version: everyone uses a folder of loose markdown files, three to five per feature,
under a dot-prefixed root. `spec.md` or `requirements.md` for the what, `design.md` or
`plan.md` for the how, `tasks.md` for the checkbox list, plus a project-wide memory file
that spec-kit calls a constitution and Kiro calls steering. Task Master is the only outlier,
keeping tasks in `tasks.json` and the requirements document in a `.txt` file.

**2. The lifecycle.** The agent writes the spec from a one-line prompt. The human reviews it
at a gate, which is hard in Kiro and deliberately absent in OpenSpec. The agent reads it back
at plan, tasks and implement time. When the code changes and the spec does not, the answer
across the whole field is: nothing happens automatically, and you are told to pick a
convention. GitHub names the failure `Silent drift between artifacts` and calls the choice
`a team convention, not a CLI setting` (FB4). OpenSpec is the only one honest enough to say
`This happens constantly and it's fine` and to allow the spec to be the wrong one (FB11).
spec-kit's `converge` only ever pushes code towards the spec and `MUST NOT modify spec.md or
plan.md in any way` (FB3). Kiro's property-based testing is the only mechanism anywhere that
will offer to `fix the spec` (FB8).

**3. Tooling for editing these specs.** **Nobody has one.** Stated plainly, because the
brief asked for it plainly: as of 2026-09-18 there is no product that gives a
spec-driven-development specification a good editing surface outside a code editor. The
three shapes that exist are a VS Code sidebar, a terminal pane, and one proprietary desktop
application. The most advanced of them, specs.md, hands the file to the operating system
when you click a document (FB14). The demand is not theoretical: spec-kit issue #1191,
`Spec-Driven Editing Flow: Can't Easily Update or Refine Existing Specs`, carries 115
reactions and links ten sibling issues (FB15), and the field's most credible independent
reviewer wrote `An effective SDD tool would have to provide a very good spec review
experience` (FB18).

**4. What is measurably painful.** FB13, FB15, FB17 and FB18 carry the quotes and the URLs.
The three measured or counted facts: 4,839 lines of markdown for 989 lines of code across
two features, with 5.5 hours of human review against 57 minutes of agent time
(blog.scottlogic.com, FB17); 115 reactions on an issue about being unable to edit a spec
(github.com/github/spec-kit/issues/1191, FB15); and an issue asking how to keep specs
up to date, open since 2025-09-27 (issue #620, FB15).

**5. Validating, testing or checking a spec against the code.** FB8 and FB12. Three
mechanisms exist. Kiro's Analyze Requirements finds contradictions inside the requirement
set. spec-kit's `analyze` compares the three documents to each other and to the constitution
and prints a coverage percentage, never touching the code. Kiro's Correctness turns EARS
requirements into property-based tests and is the only one that reads the code and can
conclude the spec is wrong. OpenSpec's `validate` checks structure and checks a change's
`MODIFIED` requirements against the specs they would replace, with `--strict`, `--json` and
a non-zero exit for a pre-commit hook. Every one of them prints to a terminal.

**6. Pricing.** Kiro: free with 50 credits, then $20, $40, $100 and $200 a person a month,
add-on credits at $0.04 each, enterprise on request, GovCloud about 20% higher (FB5).
Tessl: free with 1,000 credits a month on a single workspace, Team $100 a month, enterprise
custom (FB9). Everything else in this lens is free and open source: spec-kit (MIT),
OpenSpec (MIT), BMAD-METHOD, Task Master, Agent OS, specs.md. UNVERIFIED: I did not open
pricing pages for Hamster, fabriqa or Builder Methods Pro, so no price is claimed for those.

---

## What I could not reach

- **WebFetch was refused for the rest of the session** after one call. The local taint gate
  fired at `2026-09-18T00:00:07Z` on a `WebFetch` of the Scott Logic URL, reporting a repeat
  prompt-injection pattern. `~/.sgnk/state/injection-hits.jsonl` records the tool name and
  timestamp only, not the URL or the matched pattern, so I cannot say what tripped it. I
  reached everything afterwards with `curl` instead, including that same Scott Logic page,
  which became FB17. Two findings, FB9 and the Tessl launch post, used WebFetch before the
  gate fired; both are attributed as such.
- **The GitHub core REST API rate limit** (60 per hour, unauthenticated) was exhausted, and
  `gh` failed with a TLS certificate error through the proxy. Star counts for BMAD-METHOD,
  Task Master and Agent OS therefore come from the repository HTML pages rather than the
  API. Cross-checked where possible: spec-kit reads 137,619 stars in both, and its HTML
  `139 open issues + 172 open pull requests` sums to the API's `open_issues_count: 311`.
- **Agent OS's file layout.** Its README contains no paths and its docs live behind
  buildermethods.com, which I did not open. Marked UNVERIFIED in the table rather than
  guessed.
- **BMAD-METHOD's root folder.** The v6 documentation site is client-rendered; I extracted
  two pages and got the artefact names (`brief.md`, `addendum.md`, `SPEC.md`,
  `deferred_work.md`) but never a parent path. The older v4 `docs/prd.md` sharding is
  widely repeated elsewhere and I did not verify it, so I did not assert it.
- **Why spec-kit issue #1191 was closed** on 2026-04-08. The core API was exhausted before I
  could read the closing comment. INFERENCE only, and flagged as such: the
  `docs/guides/evolving-specs.md` page and the `converge` command both now exist and both
  address what #1191 asked for, so the two are plausibly connected, but I did not confirm it.
- **Conductor and specflow**, named in the brief. I found no repository for either that I
  could confidently identify as the spec-driven tool intended, and I did not want to open a
  same-named project and pass it off as the right one. Searching turned up specs.md instead,
  which was a better find and is FB14.
- **Kiro's actual product surface.** Everything about Kiro here is from its documentation.
  I did not run it, so the screenshots described on the Correctness page are second hand.
- **Two pages asked me to do things.** Tessl's GitBook pages end with an `Agent Instructions`
  block telling the reader to make HTTP requests with an `ask` query parameter, and both
  Tessl and specs.md pages begin by telling the reader to fetch `llms.txt` first. I recorded
  that they did and used only ordinary reads. Kiro's own docs carry a warning aimed at their
  users that is worth repeating here: `Only select repositories you trust, especially when
  mixing public and private repos. The agent follows instructions in the repository code.`

## What surprised me

1. The most advanced spec dashboard anyone has built, specs.md, cannot display a spec. Its
   own documentation says that when you click a document it `asks your operating system to
   open that local file`. That one sentence is the market.
2. Amazon Web Services built line-anchored comments with vim keys inside a terminal so people
   could review a markdown document, because there was no document surface to put them in.
3. Tessl, which defined `specs — not code — are the primary artifact`, has removed the word
   spec from its entire product documentation and now sells a package manager for agent
   skills. Their registry moved from 10,000 specs to skills. specific.dev, pitched on Hacker
   News as a spec-as-source tool in October 2025, is now a cloud infrastructure platform.
4. GitHub's own documentation names `Silent drift between artifacts` as a risk of its own
   method, offers three coping conventions, and says none is the default.
5. 105 people pressed thumbs up on an issue whose title is `Can't Easily Update or Refine
   Existing Specs`, and the one person who measured the whole workflow found it produced
   4,839 lines of markdown for 989 lines of code and concluded he would `rather review code
   than all these markdown files`.

---

## Link check

Every URL in this file was re-checked with `curl -sI` at the end of the run, 2026-09-18.
41 distinct URLs, all resolving. Four return a non-200 to a bare HEAD request for reasons
that are not broken links, and are listed here so nobody mistakes them for one:
`api.github.com/repos/github/spec-kit` answers 403 to HEAD once the hourly rate limit is
spent, though it answered a GET earlier in this run and that is where the star count came
from; `api.github.com/search/issues` answers 422 without its `q` parameter;
and the two `news.ycombinator.com/item` pages answer 405 because that host refuses HEAD.
Those two threads were read through `hn.algolia.com/api/v1/items/<id>`, and the
`news.ycombinator.com` addresses are given because they are the human-readable ones.
`registry.tessl.io` answers 301 and redirects to `tessl.io/registry`, which is itself the
finding in FB9.
