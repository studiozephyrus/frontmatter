---
id: 43-THREAT-MODEL
title: Threat model
mode: explanation
tier: canonical
status: living
verified_against: e532e32
updated: 2026-09-18
owner: sagnik
covers: [threat-model]
---

# 43. Threat model

What is worth protecting, who can reach it, where the boundaries are, and how each one is abused.

**This is not the findings list.** `42-SECURITY-REVIEW.md` says what is wrong today. This page says
what the shape of the system makes possible, so that a control can be argued for before a defect
proves it was needed. Where a finding already exists for a threat, its id is given.

## 1. Why this product needs its own model

Three properties, none of them common together, and each of them changes the answer.

- **The file on disk is the product.** A markdown editor holds the whole of what a person has
  written. There is no partial exposure: reading one file is reading the thought.
- **The agent is a first-class actor.** Documents are written by and for agents, which means an
  attacker's text and a trusted instruction arrive through the same channel. Most models of a
  document tool assume a human types and a machine renders. Here a machine types too.
- **Publishing is the point.** The product invites a stranger to read a document its author wrote.
  That single feature makes the author untrusted with respect to the reader, which is the inversion
  most editors never have to model.

## 2. Assets

Ranked by what its loss costs. The middle column names where it lives today, which is often not
where the plan says it will live.

Id | Asset | Where it lives at `e532e32` | Loss means
`A1` | **The document bytes** | A GitHub repository, through the contents API | The whole product's promise fails. There is no lesser version of this.
`A2` | **Byte fidelity of a foreign document** | The splice writer, `src/modules/share/domain/splice-frontmatter.ts` | The differentiation is gone. `40-TESTING-STRATEGY.md` explains why a silent corruption is worse than a refusal.
`A3` | **The repository token** | The `GITHUB_REPO_TOKEN` environment value | Every repository the token reaches. Its scope is **UNVERIFIED** and that is itself a finding.
`A4` | **The session cookie** | `authjs.session-token`, or the `__Secure-` form | Full account, because no route checks anything beyond a valid session.
`A5` | **Document text in transit to a model** | Whichever provider the chain picked | A private document on a third party's training set. `42-SECURITY-REVIEW.md` `SEC-002`.
`A6` | **The published page** | Rendered from the vault on request | A reader is attacked by an author, or tracked by a third party.
`A7` | **The model budget** | Nowhere. No ledger exists | Money, and a shared free pool drained for every other user.
`A8` | **Account and billing records** | Specified in the plan. No code | Personal data under the Act named in the plan's legal section.
`A9` | **The agent token** | Specified in the plan. No code | An integration with the owner's full authority, because no lesser credential exists.
`A10` | **The audit record** | Nowhere. No log exists | The ability to answer any question about an incident after it happens.

**Two assets stand out for the same reason.** `A7` and `A10` do not exist anywhere. A threat against
something that does not exist cannot be detected, which is why so many rows in section 6 read
"Nothing".

## 3. Actors

Ordered by how much the system trusts them. **Trust here means what the code lets them do**, not what
the plan intends.

Id | Actor | Authenticates as | What the code lets them do today
`T1` | **The owner** | GitHub OAuth, or the password provider | Everything. `src/modules/auth/domain/allowlist.ts` permits exactly one login, so the owner is the only account.
`T2` | **A collaborator** | Specified, not built | Nothing. There is no second account.
`T3` | **An agent** | Specified, not built | Nothing directly. See section 4, because the agent reaches the system another way.
`T4` | **A published-page reader** | Nobody | Reads a rendered note at `/<slug>`, unauthenticated, by design.
`T5` | **A document author, seen from the reader's side** | Whoever wrote the note | Supplies the bytes `T4` renders. **This actor is untrusted and is the same person as `T1`**.
`T6` | **A model provider** | An API key | Receives whatever the prompt carried.
`T7` | **An upstream package** | Nothing | Runs in the build and at request time.
`T8` | **A passer-by** | Nobody | Reaches `/`, `/login`, the four legal pages, `/<slug>`, and every API route's 401.

**`T5` is the actor most easily missed.** The same person is trusted as `T1` and untrusted as `T5`,
depending on whose browser is executing the result. Every control on the published page exists
because of that split, and every argument that starts "but it is our own user's content" ignores it.

## 4. The agent, which is the interesting actor

The plan gives an agent a row in the permissions table at `docs/mvp0/PRODUCT-PLAN.md` section 19, with
`never` in the apply and publish columns. That row describes a credential that does not exist.

### Three things an agent can do, and the third is the problem

1. **Read documents.** Intended. An agent is given a vault so it can work.
2. **Propose changes.** Intended, and the change queue exists to gate it. The queue has no code.
3. **Be steered by what it reads.** Not intended, and nothing prevents it.

### Why the third is structural and not a bug

An agent reads a document to do its job. A document is text. An instruction is text. The agent cannot
tell them apart from the inside, and no amount of instructing the agent to be careful changes that,
because the instruction to be careful arrives through the same channel.

**So the control has to be outside the model.** Two shapes work, and this product needs both.

- **Delimiting**, so the model is told which region is data. `42-SECURITY-REVIEW.md` `SEC-004` records
  that all five prompt sites concatenate without one.
- **Capability limits**, so what a steered agent can do is bounded by the credential rather than by
  its judgement. That is the agent token, and it does not exist.

**A worked example, using only what is in the repository today.**

Step | What happens | What stops it today
1 | An agent writes a document into the vault. It contains a line that reads like an instruction | Nothing, and nothing should. It is a document.
2 | The document sits there. A person opens it a week later and presses refine | Nothing.
3 | `src/modules/ai/application/refine-text.ts:17` puts it into the prompt under a prose label | Nothing. `SEC-004`.
4 | The model follows the document's line rather than the person's | Nothing.
5 | The result is written back | The person has to accept it. **This is the only control that fires, and the change queue that is supposed to carry it does not exist**, so in practice the editor's own accept step carries the whole weight.

**The plan names the risk in one sentence** at `docs/mvp0/PRODUCT-PLAN.md` section 14, quoting a memory
vendor: persistent memory makes prompt injection durable. The document store **is** the persistent
memory here.

### The inversion worth stating once

For a chat product, an injection lasts one conversation. For a document product, the injected text is
**saved**, and it fires again on every future read, by every future agent, for as long as the document
exists. The blast radius is not the session. It is the vault's lifetime.

## 5. Trust boundaries

Each row is a place where data crosses from something that cannot be trusted into something that
acts. **The check belongs at the boundary**, and the middle column says what is there now.

Id | Boundary | What enforces it at `e532e32` | Gap
`B1` | Browser to application | `src/proxy.ts` for page navigations, `getActor()` in each route for the rest | Sound. All 25 non-auth routes gate on `getActor()`.
`B2` | Application to GitHub | `src/shared/infrastructure/github/client.ts` | **Broken.** The traversal guard is one layer up, so two call sites skip it. `SEC-017`, `SEC-018`.
`B3` | Document bytes to the renderer | `html-policy.ts`, the sanitiser | Partly sound. `style` survives, two plugins run after it. `SEC-009`, `SEC-010`.
`B4` | Rendered page to the reader's browser | Should be the content policy | **Missing.** The enforced policy is on a redirect. `SEC-001`.
`B5` | Document text to a model | Should be a delimiter | **Missing.** Five sites, none delimited. `SEC-004`.
`B6` | Model output back into a document | The person accepting it, and per-use-case output checks | Partly sound. `src/modules/ai/application/suggest-links.ts:55` validates the model's choice against the candidate set; the others do not.
`B7` | Document content to the export browser | Should be a network policy on the renderer | **Missing.** `SEC-019`.
`B8` | Account to account | Should be ownership and role checks | **Does not exist**, because there is one account. This is the boundary that has to be built before the second user.
`B9` | Request to spend | Should be a budget and breaker | **Missing.** `SEC-003`.
`B10` | Anything to the record | Should be the audit log | **Missing.** `SEC-006`.

**Seven of ten boundaries have no enforcement.** That is a fair description of a product before its
pilot, and it is the reason the pilot cannot start by handing somebody else a login.

## 6. Abuse cases

Each row is an actor, a goal, the path, and what stops it. **"Nothing" is written where nothing does**,
because a table of threats where every row is handled is a table nobody checked.

Id | Actor | Goal | Path | What stops it now
`AB1` | `T5` author | Run script in a reader's browser | Publish a note whose raw HTML survives the sanitiser | The sanitiser alone. The second layer is on a redirect. `SEC-001`.
`AB2` | `T5` author | Learn who read a note, and when | A remote image or media url in the note | **Nothing.** `SEC-005`.
`AB3` | `T5` author | Deface the page, or fake product chrome | A `style` attribute | **Nothing.** `SEC-009`.
`AB4` | `T1` session holder | Read a repository they were never given | `..` in a path on the version or merge route | **Nothing.** `SEC-017`, `SEC-018`.
`AB5` | `T1` session holder | Read the application's own build configuration | `/api/vault/raw/next.config.ts` | **Nothing.** The read denylist has no file entries. `SEC-020`.
`AB6` | `T8` passer-by | Exhaust the deployment's compute | Repeated posts to the password provider, each running scrypt | **Nothing.** `SEC-003`.
`AB7` | `T1` session holder | Spend the owner's model budget | Any AI route, in a loop | **Nothing.** `SEC-003`.
`AB8` | `T3` agent, steered | Make an edit the owner did not ask for | Injected text in a document | The person accepting the edit. The queue that should carry this has no code. `SEC-008`.
`AB9` | `T3` agent, steered | Exfiltrate another document's contents | Ask the model to include them in its output | Partly: only `suggest-links` validates its output. Nothing else does.
`AB10` | `T5` author | Make the server fetch an internal address | A remote reference in a note, then an export to PDF | **Nothing.** `SEC-019`.
`AB11` | `T6` provider | Retain a private document | Be in the chain | The chain is meant to exclude providers that train on input. Two forbidden ones are in it. `SEC-002`.
`AB12` | `T1` session holder | Upload something enormous | The upload route's unbounded body | **Nothing.** `SEC-021`.
`AB13` | Anyone | Act without leaving a trace | Any of the above | **Nothing. There is no log.** `SEC-006`.
`AB14` | `T2` collaborator, once built | Read a document they were removed from | Any read route, because no route checks ownership | **Nothing would**, today. `B8` has to exist first.
`AB15` | `T7` package | Run code at build or request time | The dependency tree | Not assessed. See section 9.

**`AB13` deserves its own sentence.** Every other row in this table would, after the fact, be
answerable from a log. There is no log, so every row is also undetectable. That makes the audit record
the thing to build first, ahead of most of the controls it would record.

## 7. Data classification

Four classes. The rule for each is what may be done with it, and the last column is the one that gets
broken.

Class | What is in it | May be stored | May leave the system
**Secret** | The repository token, the session signing secret, provider API keys, the password hash | Environment only, never in the repository, never in a log | **Never**
**Private** | Document bytes, uploads, version history, the graph, drafts | Vault and browser storage | **Only when the person asks**, and only to an approved provider
**Restricted** | Account email, login, plan, billing records, usage counts, the security log | The records store named in the plan's data model | Only to the processor that needs it, under an agreement
**Public** | A published note, its rendered page, the four legal pages | Anywhere | Yes, by definition, and **that is a decision the owner takes per document**

**The classification the code gets wrong today.** Document bytes are Private, and `SEC-002` sends them
to a provider whose terms permit training. `SEC-017` and `SEC-018` let Private bytes from an unrelated
repository be read through a route. And the Public class is the only one whose boundary is a person's
deliberate act, which is why publishing needs a confirmation step and a way to see what is published.

**One rule that is easy to state and easy to break.** A refusal message, an error body and a log line
are all outputs. `src/shared/infrastructure/github/client.ts:48` already does the right thing: it logs
the detail server-side and throws a generic message, so a route body never leaks the repository
layout. Keep that pattern.

## 8. What to build, in the order the model implies

Not the order of severity. The order in which each one makes the next one possible.

Order | Build | Why it comes first
1 | **The audit log** (`A10`, `AB13`) | Every other control is unverifiable without it, and it is the cheapest of the ten.
2 | **The traversal check inside `githubFetch`** (`B2`) | It is a defect, not a feature, and it is reachable today.
3 | **The enforced policy on the page that serves** (`B4`) | One line, and it retires three abuse cases.
4 | **The budget and breaker** (`B9`) | Bounds `AB6`, `AB7` and `AB12` at once.
5 | **The delimited data block** (`B5`) | Bounds every agent-steering case to what the capability allows.
6 | **The agent token** (`A9`, `T3`) | The capability limit that step 5 then bounds against.
7 | **The change queue** (`AB8`) | The product's third load-bearing idea, and its only control on an applied edit.
8 | **Ownership and role checks** (`B8`) | The precondition for a second account existing at all.

**Steps 6, 7 and 8 are product work, not security work**, and they are on this list because the
threat model cannot be closed without them. That is the honest reading: three of this product's
headline features **are** its security controls.

## 9. Limits of this file

**What was not assessed.**

- **The supply chain.** `AB15` is a row with no analysis behind it. No dependency audit, no lockfile
  review, no build-step review. For a product that ships a desktop binary this is a real gap.
- **The desktop build.** `src-tauri/` was not opened. A desktop shell has its own boundary list: what
  commands the bridge exposes, what filesystem scope it grants, and whether a remote page can reach
  it. None of that is modelled here.
- **Physical and operational threats.** Who holds the accounts, what happens when a founder's laptop
  is lost, how a token is rotated. `docs/mvp0/PRODUCT-PLAN.md` section 24 covers ownership; this file does
  not model the operator.
- **Regulatory exposure as a threat.** The plan's legal section is a deadline list, and the classes in
  section 7 were not mapped onto the statutory duties it names.
- **Availability as an asset.** There is no row for the product being down. That is deliberate, since
  the plan's reliability target lives in `47-PERFORMANCE-BUDGET.md`, and it means denial of service
  appears here only where it is also an abuse of a credential.
- **Threats from the founders.** An insider model was not written. For a two-person studio holding
  customers' documents, it eventually has to be.

**What could not be verified.**

- **The token's scope**, which decides the blast radius of `A3`, `AB4` and half of section 5.
- **Which providers are live**, which decides whether `AB11` is happening now or is latent.
- **Whether `T2` and `T3` are absent or merely unwired.** Each rests on a grep over `src/`, recorded
  in `42-SECURITY-REVIEW.md` section 9 so it can be re-run.
- **Every claim in this file is about the code, not the deployment.** Nothing was fetched and no page
  was driven.

**What would falsify this file.**

- A second account signing in, which invalidates the "one account" premise under `T1`, `T2` and `B8`
  and makes several rows in section 6 reachable by somebody other than the owner.
- An agent token or a change queue appearing in code, which changes `T3` from a specification into an
  actor with a credential and rewrites section 4.
- A log appearing, which turns most of section 6 from undetectable into detectable and moves `AB13`
  off the list.
- A narrowly scoped token, which downgrades `AB4` from a cross-repository read to an in-repository
  one.
- Any boundary in section 5 gaining enforcement, each of which should be struck from that table with
  the commit that did it named in its place.
