# CLAUDE.md — frontmatter

Claude Code reads **this** file and does **not** read `AGENTS.md`. Everything in `AGENTS.md`
still applies; the line below loads it. Keep this file short — long instruction files consume
context and reduce adherence. Path-specific guidance belongs in `.claude/rules/`, procedures
belong in a skill.

@AGENTS.md

---

## What this repo is

A byte-exact markdown editor for repositories whose documents are increasingly written by AI
agents. Studio Zephyrus. Next.js web app plus a Tauri v2 desktop build from one source tree.

Three things are load-bearing:

- **The projection law.** The file on disk is the only source of truth. Every view is a
  deterministic, stateless projection of it.
- **Splice-only writing.** The engine locates a byte range and replaces exactly those bytes.
  It never rewrites a whole file, and it **refuses** rather than guess when a range is
  ambiguous.
- **Review state.** A sidecar at `.frontmatter/review.jsonl` records which spans a person has
  read, keyed by content hash. This is the headline claim and it is **under test, not proven**
  — it failed an adversarial round on 2026-09-08 and the market moved against it again on
  2026-09-09.

## Read these before proposing anything

| File | Size | What it is |
|---|---|---|
| `docs/PRODUCT-BRIEF.md` | 560 lines | **The current plan, v15.** Short enough to read whole. §14 lists the seven open founder decisions. |
| `docs/research/2026-09-09/BRIEFING.md` | 24 KB | What nine research lenses found on 2026-09-09 and what it changed. |
| `docs/research/2026-09-09/VERIFIED-2026-09-09.md` | 6 KB | What was opened and checked by hand. **This overrides the research where they disagree.** |
| `docs/GAPS-2026-09-08.md` | 21 KB | The gap register and the adversarial round. |
| `decisions/v2/CONTRACT.md` | 11 KB | The decision-card shape, voice rules, and the ten diagram primitives. |

**Never open the large documents with Read.** `docs/FRONTMATTER-PRD-v2-2026-08-29.md` is
760 KB, `docs/FRONTMATTER-RECORD.md` is 2.1 MB, `docs/FRONTMATTER-COMPLETE-RECORD-2026-08-30.md`
is 3.4 MB, and `ENGINE.md` / `CRITIQUE.md` / `DEV-PLAN.md` are each around 250 KB. Use
`grep -n` for the term, then `sed -n 'START,ENDp'` for the surrounding lines. A single Read of
any of these will blow the context window.

## Run it

```bash
npm run dev          # Next.js web app
npm run verify       # typecheck + lint + test + build + arch — run before any commit
npm run arch         # clean-architecture gates
npm run tauri:dev    # desktop shell
```

Two known gaps, both recorded in `docs/PRODUCT-BRIEF.md` §9: `npm run budget` is an `echo`
with no real bundle budget, and `mdmax cert` is not among the 26 npm scripts.

## The decisions site

`decisions/` is a static, dependency-free page listing every open decision with its evidence.
It is deployed separately from the app at `frontmatter-decisions-sagnik.vercel.app`, and a
copy is served from `public/decisions/`.

- `questions.js` is **generated**. Never hand-edit it. Rebuild with
  `python3 decisions/tools/build-v2.py decisions/v2`.
- `decisions/v2/*.json` are the per-area sources. `decisions/v2/CONTRACT.md` is their spec.
- `python3 decisions/tools/validate.py decisions/v2` must return 0 errors before a rebuild.
- `decisions/diagram.js` renders ten inline-SVG primitives. Diagram data lives on each card
  under `visual`.

## Rules specific to this repo

**Never invent a citation.** Cards and documents cite `docs/FILE.md:NNN`. Check with
`sed -n 'NNNp' docs/FILE.md` before writing one. Fabricated citations have happened here and
are checked mechanically by `decisions/tools/validate.py`.

**Never invent a number.** Every figure in a document or a diagram comes from the corpus, from
the research briefing, or from a source opened in that session. If there is no number, choose
a form that needs none.

**Trust research substance, not its quotation marks.** A research pass on 2026-09-09
fabricated quotes from VS Code's documentation while getting the underlying facts right;
roughly one quotation in three across that run was a paraphrase in quotation marks. Before any
quote goes into a document, a slide or a card, re-fetch the page and match the string.

**Verify against the deployment, not the local file.** Three real defects in the decisions
site were invisible locally and only appeared when the live page was driven. When checking a
deployed URL use `curl -sI` — never `curl -sL`, because a login page returns 200 after a
redirect.

**Icons are Google Material Symbols delivered as inline SVG.** No emoji as UI, no icon web
fonts, no other icon library.

**British spelling** throughout prose: behaviour, licence (noun), recognise, artefact.

## Accounts and secrets

This repo lives at `studiozephyrus/frontmatter`, **not** on the personal accounts. Only
`GH_TOKEN_ZEPHYRUS` can fetch or push it; the general `GH_TOKEN` cannot.

Two Vercel homes, and they are not interchangeable — `AGENTS.md` §6b is authoritative:

| Surface | Vercel team | Token |
|---|---|---|
| The app (`frontmatter`) | `zsco` — `team_RSlKvg8AqX8hr5WIuKXlNXGE` | `VERCEL_TOKEN_ZEPHYRUS`, always with `--scope zsco` |
| The decisions site (`frontmatter-decisions`) | `team_CDEATPKml1m8SIZSJ0DKdEjG` | the bare `VERCEL_TOKEN` |

Never run `gh auth login` or `gh auth setup-git` with the Zephyrus token — both rebind every
repo on this machine to the wrong identity. Pass it per command instead.

Tokens live in `/Users/sagnikmitra/.config/codex-env/tokens.zsh`. Source it in the same Bash
invocation as the command that needs it. Never `cat`, `echo` or otherwise print the file or
any value from it.

## Settled — do not re-litigate

- **The markdown format verdict:** build a compiler and an IDE, not a new format.
- **The render carrier:** `> [!kind]` callout for prose, fenced block for opaque data. An
  unclosed fence swallows the document; a callout has no closer to lose.
- **Sync is git-merge plus a splice journal and CAS, never a CRDT.** One caveat added
  2026-09-09: Zed Delta now stakes span-level attribution on CRDTs in public, so this position
  needs a written rebuttal that names them rather than being restated as settled.
- **R2 has no object versioning**, so disaster recovery must be built into the key layout.
- **₹15,000 per transaction is an architectural constant** (RBI), and Indian cards get one
  payment attempt.
