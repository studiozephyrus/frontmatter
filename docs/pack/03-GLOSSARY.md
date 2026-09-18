---
id: 03-GLOSSARY
title: Glossary
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [vocabulary]
---

# 03. Glossary

**Alphabetical. One row per term.** Where a word means something narrower here than it does in
general use, the two meanings are in separate columns, and the narrow one wins inside this pack.

**How to read the last column.** A file path is where the term is defined or enforced. A plan
citation is `docs/mvp0/PRODUCT-PLAN.md:NNN` and every one was checked with `sed -n 'NNNp'` before it
was written.

## 1. The terms

Term | The general meaning | What it means here | Where it lives
AGENTS.md | A file at a repository root holding instructions for a coding agent | One of two instruction files the health panel checks, alongside CLAUDE.md. Not ours to invent, and followed as published | `docs/mvp0/PRODUCT-PLAN.md` section 20
Anchor | In markdown, the id a heading gets so a link can reach it | Two senses, and they are different things. Ours is the markdown sense, and it is one of the artefacts a rebuilding editor loses. Zed Delta uses the same word for a span identity that survives later edits, which we do not have | `specs/engine/splice-writer.md`
Appetite | An amount of time you are willing to spend | Shape Up's sense, used in the build plan. A phase has a fixed appetite in weeks and variable scope, so scope is cut to fit rather than time being added | `docs/mvp0/PRODUCT-PLAN.md` section 26
Blueprint | A plan or drawing | The fifteen-file output of Idea mode: twelve markdown documents and three data files, shaped as a skill folder an agent can read | `docs/mvp0/PRODUCT-PLAN.md` section 9
Byte range | A start offset and a length inside a file | The unit the engine writes through. A range, not a line number, because a line number moves when the line above it changes | `specs/engine/splice-writer.md`
Byte-exact | Identical when compared byte for byte | The guarantee the corpus gate enforces. One changed byte in one file fails the build | `npm run corpus`
CAS | Content-addressed storage. A thing is named by the hash of its contents | How a version is keyed. Two identical versions are one object, and a version's name proves its contents | `docs/mvp0/PRODUCT-PLAN.md` section 17
Callout | A block in some markdown dialects written as `> [!note]` | The chosen carrier for anything a render profile adds to prose. Picked over a fenced block because an unclosed fence swallows the rest of the document and a callout has no closer to lose | `CLAUDE.md`
Carrier | The thing that carries something else | The markdown construct chosen to hold a feature that plain markdown has no syntax for. A callout carries prose; a fence carries opaque data | `CLAUDE.md`
Change queue | Not a general term | Every change by a person, an AI edit or an agent enters a list where the owner accepts or rejects it one by one. It replaced the review-state sidecar on 17 September. **Specified, not built** | `docs/mvp0/PRODUCT-PLAN.md` section 17
Configuration panel | An admin screen | Screens S35 to S38, which only a founder sees. It sets plan limits, prices, model routing, the free provider chain, feature flags and pilot thresholds at run time, so changing one needs no deploy | `docs/mvp0/PRODUCT-PLAN.md` section 30
Corpus | A body of text collected for study | 8,513 markdown files this project did not write, pinned by hash. The word always means the foreign corpus here, never our own documents | `test/corpus/foreign`, `npm run corpus`
CRDT | Conflict-free replicated data type. A structure several people can edit at once with no coordination, which always converges | **The settled position is that sync is git-merge plus a splice journal and CAS, never a CRDT.** Two reasons. Convergence guarantees the copies agree, not that the text is right, and interleaved edits converge to byte-identical nonsense. And a CRDT's internal state is a second source of truth beside the file. **One exception:** Yjs may hold live-session state inside a Durable Object, and that state is discarded when the last person leaves and is never merged into a file | `CLAUDE.md`, `docs/mvp0/PRODUCT-PLAN.md` section 15
Credit | A unit of prepaid usage | The unit an AI action spends. Free carries 10 edits and 1 Low blueprint a month. Top-ups are 50 edits for ₹99 and 3 blueprints for ₹149 | `docs/mvp0/PRODUCT-PLAN.md` section 13
Degradation certificate | Not a general term | **Measured proof of how a file renders across real markdown engines.** Defined at `docs/FRONTMATTER-PRD-v2-2026-08-29.md:5075`, with a sidecar schema `mdmax/cert@1` at line 2814. It is the tested form of the stated degradation every invented format must carry. **UNVERIFIED that anything emits one today:** `mdmax cert` is not among the 26 npm scripts, which `CLAUDE.md` already records as a known gap | `docs/FRONTMATTER-PRD-v2-2026-08-29.md:5075`, `docs/mvp0/PRODUCT-PLAN.md` section 20
Depth | How deep something goes | One of three settings in Idea mode. Low is free and asks 10 to 15 questions. Medium is Pro and asks 20 to 30 with the forces behind each. High adds a research pass with sources opened and dated | `docs/mvp0/PRODUCT-PLAN.md` section 9
Doc mode | Not a general term | The Google-Docs-shaped face of the Live view. It ships 20 features that are plain markdown and 15 that need an extension, and refuses the 29 that cannot live in a text file. **Specified, not built** | `docs/mvp0/PRODUCT-PLAN.md` section 7
Durable Object | A Cloudflare primitive: a single-threaded object with storage, addressable by name | Where a live editing session lives while two people have a file open. Used with the Hibernation API, without which live sessions are the largest cost line | `docs/mvp0/PRODUCT-PLAN.md` section 15
Entitlement | What a contract entitles you to | A named limit a plan grants, written in dotted lower case, such as `limits.collab.live`. Exactly one function resolves them, and a cap read anywhere else is a defect | `docs/mvp0/PRODUCT-PLAN.md` section 30
Front matter | A YAML block at the top of a markdown file, fenced by three hyphens | The same, and the hardest thing in the product to write into safely. A column-zero list item inside it currently refuses about 83 per cent of real vaults | `specs/engine/nf-001-zero-indent-sequence.md`
Harness | A rig that holds a thing under test | The scripts under `specs/harness/` that read the specs, check the code against them, and write the `built` and `verified` states. **A person may not write those two states by hand** | `specs/harness/`
Key addressability | Not a general term | Whether a front-matter key can be named by the splice writer at all. The rule is `SAFE_KEY = /^[A-Za-z0-9_.$-]+$/`, which excludes a space, so a key like `date created` cannot be addressed. That is a design task about Unicode key equality, not a regex to widen | `specs/engine/splice-writer.md`
Kickoff prompt | Not a general term | The text a person pastes into Claude Code, Cursor or Codex to start a build from a kit. It verifies the kit against a hash printed on the published page before it unpacks anything, and it tells the agent to read before it builds | `docs/mvp0/PRODUCT-PLAN.md` section 5
Kit | A packaged set of parts | The published form of a blueprint: a tarball with a MANIFEST.json and SHA256SUMS, reachable at an unlisted link | `docs/mvp0/PRODUCT-PLAN.md` section 5
Ledger | A book of accounts | The append-only record of every credit granted and spent. Entries are never updated, so a balance is a sum over a collection and never a row two writers race for | `docs/mvp0/PRODUCT-PLAN.md` section 18
Live mode | Not a general term | One of four editor views, beside Edit, Reading and Split. It conceals markdown markers as you type. Markdown mode and Doc mode are the two faces of it | `src/modules/editor/presentation/CodeMirrorEditor.tsx:61`
Markdown mode | Not a general term | The face of the Live view for people who type markdown and want to see it | `docs/mvp0/PRODUCT-PLAN.md` section 4
Markdown twin | Not a general term | The raw markdown served beside a published HTML page, at `page.md`. It is never gated, never redirected and never given an interstitial, and the same rule covers `llms.txt` | `docs/mvp0/PRODUCT-PLAN.md` section 5
MAP.md | Not a general term | The index file in a kit, rebuilt from the files rather than written, and paired with a `graph.json` | `docs/mvp0/PRODUCT-PLAN.md` section 5
MCP | Model Context Protocol. A published way for a tool to expose capabilities to an agent | The same. Governed by "a Series of LF Projects, LLC", with a specification dated 2026-07-28. Our server is in the Later column, which the research of 18 September argues is wrong | `docs/mvp0/PRODUCT-PLAN.md` section 2
Projection | A mapping from one thing onto another | A view drawn from the file, holding no state of its own. Doc mode, the flow view, the published page and the portfolio are all projections | see The projection law
Proposal | A suggestion | A first-class object in the engine, not a transient. It carries a byte range, the proposed bytes, an author and an intent, and it lives until it is accepted or rejected | `docs/mvp0/PRODUCT-PLAN.md` section 17
Red proof | Not a general term | A test that fails against the unfixed code. Without one, a passing test on a rare fault proves nothing, and a spec may not reach `verified` | `specs/_schema/states.md:24`
Refusal | Declining to do something | The engine returning the input unchanged, with a reason, because it could not locate the target unambiguously. **It is a correct outcome, not an error.** Each named refusal has an id like `nf-001-zero-indent-sequence` | `specs/engine/`
Skill | An ability | A folder an agent loads, whose entry point is a SKILL.md the published guide asks to keep under 500 lines. A kit is shaped as one | `docs/mvp0/PRODUCT-PLAN.md` section 2
Span | A stretch of something | A stretch of bytes in a document, named by a byte range. The word appears mostly in what we do **not** do: per-span read state was dropped on 17 September | `docs/mvp0/PRODUCT-PLAN.md` section 17
Splice | To join two pieces of rope or film | To locate a byte range and replace exactly those bytes, leaving every other byte bit-identical. Never a regeneration from a parse tree | `specs/engine/splice-writer.md`
Splice journal | Not a general term | The record of splices that, with git-merge and CAS, is how sync works in place of a CRDT. UNVERIFIED: named in `CLAUDE.md` as a settled position and not yet specified in any file under `specs/` | `CLAUDE.md`
Version record | A history of versions | Where the decision on a change is written when it is accepted, carrying `author`, `source` with a value of person, ai or agent, `model`, `ask`, `accepted_by` and `at`. Nothing goes into the file itself by default | `docs/mvp0/PRODUCT-PLAN.md` section 20
llms.txt | A published convention: a text file listing a site's content for an agent | The same, served from a published page and never gated | `docs/mvp0/PRODUCT-PLAN.md` section 5

## 2. The projection law, stated once

**The file on disk is the only source of truth. Every view is a deterministic, stateless
projection of it.** Deterministic means the same file always draws the same view. Stateless means
the view holds nothing the file does not hold. `02-PRODUCT-AND-DOMAIN.md` section 3 explains why.

## 3. Three terms this pack does not use

Word | Why not | Say instead
Review state | The per-span read state of the 9 September plan. It never existed in code and was dropped on 17 September | The change queue
Sidecar | An undocumented internal codename that leaked into prose | Name the file
Unreviewed badge | A percentage of the repository shown as unreviewed. The attention literature is hostile to it, and no such badge is in the plan | Name the document and the change

## 4. Status words, and who may write them

The full vocabulary is in `65-CONVENTIONS.md` section 6. Two of them are not yours to type.

Word | Domain | Who writes it
`specified` | Screen | A person
`building` | Screen or feature | A person
`built` | Screen | **The harness only**
`verified` | Screen or spec | **The harness only, and only after a red proof exists**

## 5. What is missing from this glossary

**Terms that will need a row once their file exists.** Grievance officer, the four render profiles,
the problems panel's check ids, and the event names under `55-MEASUREMENT-AND-EVENTS.md`.

**A term whose definition is older than this pack, and was nearly mis-recorded here.** Degradation
certificate. The first draft of this file called it a coinage of the pack's. It is not. It is
defined in the PRD v2 glossary and carries a sidecar schema. What is true is narrower: nothing in
the repository emits one, because `mdmax cert` is not among the 26 npm scripts.

**A term this pack inherits without a specification.** Splice journal. `CLAUDE.md` treats it as
settled and no file under `specs/` describes it. Anyone building sync should write that spec first.
