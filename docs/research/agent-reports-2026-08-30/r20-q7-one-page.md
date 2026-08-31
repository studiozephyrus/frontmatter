## 104. The product in one page — the statement we execute against

### 104.1 The product, in one paragraph

> **frontmatter is a markdown editor for people who build software with AI. It opens a folder of `.md` files — in a GitHub repo or on disk — and edits them byte-exactly, changing only the bytes you touched. On top of that it writes five documents that AI-assisted product work needs and nobody writes: a map of the repo, a decision record, a spec, a handover, and a kickoff pack. The kickoff pack is a block of text you paste into Claude Code, Codex, or whatever agent you already pay for; it tells that agent what the project is, what has already been decided, and which files not to open. We do not run the model. We write the thing you feed it. Free to try, ₹299/month for one person, ₹599/month for a small team.**

Nine sentences, no adjective doing load-bearing work. The one-line version, for a stranger who will not read nine: **it turns your repo into the prompt.**

The word *editor* is deliberate and expensive. It commits us to an editing surface being good — tables, lists, links, drag-and-drop reorder, a preview — which is months of unglamorous work that no investor deck rewards. We take that cost because the alternative framing ("context tool", "AI memory") is a feature, and features get shipped by the platform that owns the chat box. An editor is a place you keep files.

---

### 104.2 The one thing nothing else does

> **It generates the prompt from the repository and cites every line back to a byte range in a file you own — no model summarised anything, so nothing in the pack can be invented.**

That sentence has two halves and they are load-bearing separately. *Generated from the repository* rules out prompt-template products. *Cited to byte ranges, nothing summarised* rules out the RAG-and-summarise products, and it is the half only a byte-exact engine can honestly say.

**The evidence it is true** is in §98–§101 and it is unusually good for a claim this early:

| Claim | Evidence | Tag |
|---|---|---|
| A block-store competitor cannot cite a byte range | Notion's unit of change is a block object; a one-word edit rewrites the whole `rich_text` array — 24 changed lines / 168 tokens vs markdown's 2 lines / 14 tokens | `[measured, §98.3]` |
| Markdown is the cheap carrier, so the pack fits | 18,439 tok markdown vs 194,752 tok block-JSON across three real docs — **10.56×**. 14.97 copies of a handover in a 200k window vs 1.59 | `[measured + derived, §98.3]` |
| Nobody in the category holds all three AI-native tests | Notion passes the delete test, fails addressability; Cursor and Windsurf regressed per-hunk control publicly; the largest file-native editor ships **zero** occurrences of "AI" across 9,502 chars of roadmap | `[fetched + measured, §98.2]` |
| The pack itself is buildable deterministically | The §99.3 worked example is 6 sources / 25,308 bytes / ≈6,327 tokens, every line a cited byte range | `[measured]` |

**The evidence anyone wants it — and here is the honest part: we do not have it.** What we have is *demand-shaped absence*, which is suggestive and is not proof:

| Signal | What it is | What it is not |
|---|---|---|
| This repo: 176 research files / 647,637 words, 4 handovers, 4 specs, and **exactly 1 ADR** `[measured, §99.1]` | Founders who believe in these documents, have written 647k words, and still wrote one decision record. The discipline gap is real and it is ours | A stranger's willingness to pay ₹299 |
| `CLAUDE.md` is a first-party documented convention `[fetched, raw.githubusercontent.com/anthropics/claude-code/main/README.md, HTTP 200, 2026-08-31]` | People are hand-writing context files by instruction, not folklore | A count. §102.3 could not get one without auth, and said so |
| Every wedge user already pays $20–200/mo for an agent | Budget exists in the category | Budget for *us* — same mental line item |

**Nobody has yet paid us anything, and no stranger has yet pasted a pack we generated.** Everything in 104.4 is designed to fix that in weeks, not quarters. Any founder reading this section who takes 104.2's first half as settled and skips 104.4 has misread the page.

---

### 104.3 The shape of the thing

**What you open.** A web app at `app.frontmatter.dev` for the GitHub path, and a Tauri desktop build for the local-folder path — one codebase, the desktop wrapper adding exactly two things the browser cannot do: direct filesystem bytes and an OS-keychain API key `[§100.2, §101.1]`.

**Where your files live.** In your git repo, at the paths they already have, and they never move — we hold zero document bytes in Postgres; the control plane stores installation ids, subscriptions and preferences, and if we vanish you lose an editor, not a corpus.

**First run.** Install the GitHub App on one repo — three permission lines, `contents: write`, `metadata: read`, `emails: read`, zero organisation permissions so a repo admin can install it alone in forty seconds without a ticket `[fetched, docs.github.com install-from-third-party, 2026-08-31]` — we read the tree, and the first thing you see is a generated `MAP.md` you did not write, listing your superseded files.

**No network.** The desktop build is fully functional — splice, preview, generate the map, generate a kickoff pack, all local and all deterministic, because none of it requires a model; the web build is dead offline and we will not pretend otherwise with a service worker that half-works.

**No AI key.** Nothing breaks. Every artefact generator is deterministic assembly from files and git, the pack is text you paste elsewhere, and the only thing a key buys is the in-editor toolbar for the ~10% who want it — that is the delete test of §98.2, and it is enforced by the projection law rather than by our good intentions.

---

### 104.4 What has to be true

Ranked by *how much dies if it is false* × *how cheaply it can be tested*. The top three are one week of work between two people and no code.

| # | Assumption | If false | Cheapest falsifying test | Cost | Kill signal |
|---|---|---|---|---|---|
| **1** | **A generated pack materially improves an agent's output vs. the user's own prompt.** The whole thesis | We are a nicer Obsidian. Stop | **Hand-build 5 packs for 5 real tasks in this repo.** Run each task twice on the same model — bare prompt vs pack. Score on: did it open a superseded file, did it re-litigate a settled decision, did the diff need rework | ~1 day, <$20 of tokens | Fewer than 3 of 5 show a visible difference a third party can see in the transcripts |
| **2** | **A stranger pastes it.** §98.1's own falsifier: paste-rate < 1/user/month at day 90 | Real problem, wrong artefact. Pivot to the map only | **Ship nothing.** Hand-generate packs for 10 wedge users from §102.3 — recruit from repos containing `CLAUDE.md` + `HANDOFF*.md`. Send the pack, ask one question a week later: *did you paste it, and did you paste it twice?* | ~3 days of two founders' time, ₹0 | 10 packs delivered, fewer than 3 second pastes |
| **3** | **They pay us and not the agent vendor.** §102.3's uncomfortable clause: they already pay $20–200/mo | Free tool, no company | In the same 10 conversations: *"₹299/month, card now, for this generated for you automatically."* Not a survey — a link | ₹0, same calls | Fewer than 2 of 10 convert. Zero of 10 = kill the price, not the product |
| **4** | **Byte-exactness is why the pack is trusted, not a private engineering virtue.** §102.1 demoted it to proof | The engine lane is a nine-month detour we cannot afford | In test 1, deliberately feed one agent a pack with a plausible model-written summary in place of two cited ranges. See whether the output degrades or nobody notices | ½ day, inside test 1 | Nobody notices. Then fidelity is our taste, not the customer's need — and it must stop being the roadmap's first lane |
| **5** | **Two founders can ship engine + editor + pack + App before the money runs out.** §104.6 | Slower, not dead — but the sequence is wrong | Week 1: build the *fake* pack generator — 200 lines of shell walking `docs/`, no engine, no UI. If that shell script already helps in test 1, the engine is not on the critical path for validation | 1 day | The shell script works as well as the planned product |
| **6** | **B2B and D2C are one motion** (§26–27, and §102.1 flags it as the unverified load-bearing GTM claim) | ₹599 tier is fiction; solo-only company | Ask the 2–5-person teams in the 10 whether a second person would use the same pack, or want their own | ₹0 | Every team says "just me" |

Assumption 1 is the one that should be tested first and it does not require a single line of product code. If it fails, everything above §104 was a well-evidenced answer to a question nobody asked.

---

### 104.5 What we are deliberately not doing

| Refusal | The real cost we accept |
|---|---|
| **We do not run models for you by default** (§98.1: a 40-turn Haiku session = **87%** of a month of ₹599 gross; Sonnet = **174%**) `[measured/derived]` | The demo is worse. "Paste this into Claude" is a weaker sell than a button, and every competitor's screenshot will look more magical than ours |
| **We never store your API key on our servers** (§100.2) | No team key sharing, no server-side batch jobs, no "run it overnight". Enterprise buyers will ask for exactly this and we will lose those deals |
| **Zero organization GitHub permissions** (§101.2) | No org-wide install, no admin dashboard, no seat provisioning — the shapes B2B procurement is built around. We chose the forty-second solo install instead |
| **We cut File System Access API on web** (§101.1: Firefox no, Safari no, iOS no, still flagged experimental) | Local-folder users on the web must download the desktop build. A real conversion step at the worst possible moment |
| **Four of nine artefacts cut** — changelog, runbook, meeting note, standalone flow (§99.2) | Every cut is a demo we cannot give and a comparison table cell we lose. Meeting notes especially: the highest-frequency artefact in most teams, and Granola owns it |
| **Enterprise is explicitly not our buyer** (§102.2) | We forgo the highest revenue per logo and, with it, the venture-scale story. Two founders cannot carry SOC 2, a DPA, SSO and an SLA |
| **Agency segment deliberately deferred** despite ranking third and highest revenue per logo (§102.2) | We leave real money on the table for at least two quarters, and someone may take it |
| **Refuse rather than guess, everywhere** | The product will visibly fail on files it cannot address, in front of a user, on day one. A guessing competitor demos better and is wrong quietly |

Every row costs something a founder would want. That is the test a refusal has to pass to count as one.

---

### 104.6 The first ninety days

Two people. Small AI budget. Engine lane ships before anything visible, which means the first thing anyone can *look at* is roughly six weeks away — that is the shape of the bet, and it is the biggest risk in this plan.

| Weeks | Founder A (engine) | Founder B (thesis + surface) | Sacrificed |
|---|---|---|---|
| **1** | Splice writer + refusal path; the **red proof** before the fix, per LR#68 | **Tests 1 and 5.** Five hand-built packs, the 200-line shell generator, transcripts A/B'd | Nothing. Week 1 is the cheapest week we will ever have |
| **2–3** | Zero-indent-sequence refusals (83% of foreign vaults), bare-CR set-destruction, `SAFE_KEY` addressability — the queued `[measured]` R0 defects | **Test 2 and 3.** Recruit and talk to 10 wedge users. Deliver hand-made packs. Ask for the card | Any UI work. Deliberately |
| **4–6** | GitHub App: tarball read, blob/tree/ref write, per-repo scoped tokens. **Delete `GITHUB_REPO_TOKEN`** — the single largest unshipped liability in the repo `[measured, §101.2]` | `MAP.md` generator against real repos; pack generator promoted from shell to product | Desktop build. Keychain. Anything AI-in-editor |
| **7–9** | Editor surface: tables, lists, links, preview. Boring, unavoidable, and the reason we said "editor" | Decision-record + handover generators; onboarding down to install→map in under 60s | Search. Publishing. Calendar. Board views |
| **10–12** | Tauri desktop + OS keychain; the offline story becomes true | 30 more users from the same predicate. First paid cohort. **Re-run test 2 as the day-90 paste-rate falsifier** | The ₹599 team tier, unless test 6 passed |

**Sacrificed outright for the whole ninety days:** the AI toolbar inside the editor (§100 is engineering for a minority case and must not become the majority case by accident), collaborative presence, mobile, the agency segment, SEO and content, and every AI feature we would build because it demos well rather than because a named person uses it weekly.

**The recommendation.** Build the wedge product for the §102.3 solo builder, in the order above, and treat the kickoff pack as the product and the editor as its factory. Spend week 1 on tests 1, 2 and 3 before writing a line of engine code — the tests are cheap enough that not running them is the only genuinely irrational thing available to us.

**The strongest argument against it.** *The pack is a feature of the agent, not a product beside it, and the agent vendor will ship it.* Anthropic documents `CLAUDE.md` as first-party `[fetched]`; Claude Code already reads the repo; a first-party "generate your project context" command costs Anthropic one engineer-month and ships to their whole base for free. If that lands, our editor's remaining reason to exist is byte-exact markdown editing — assumption 4's failure case — and §102.1 has already told us almost nobody buys round-trip fidelity. The counter is thin but real: the vendor's version reads the repo at request time inside their context window and their pricing, ours produces a *durable, citable, reviewable file* the user owns and can hand to a different vendor tomorrow. Whether a user can feel that difference is exactly test 1, which is why test 1 comes first and why it is worth failing fast on.
