## KEY FINDINGS
- Sweep complete with zero UNREACHABLE: all 12 claim groups verified as [fetched] via curl against api.github.com and api.npmjs.org on 2026-08-28 (npm window 2026-08-21 to 2026-08-27).
- agents.md: canonical repo is agentsmd/agents.md (23,964 stars, created 2025-08-19, pushed 2026-08-25), and openai/agents.md now 301-redirects to it - the transfer out of OpenAI's org into a neutral org is fresh structural evidence consistent with the vendor-neutral-stewardship narrative, though the Linux Foundation donation itself remains [SS].
- obsidian-kanban 'unmaintained ~2 years' CONFIRMED and strengthened: repo was transferred to an org literally named community-archive, last release 2.0.51 was 2024-05-31 (26.9 months ago), 600 open issues, and the only 2026 commit is 'Remove funding' housekeeping.
- inkeep/open-knowledge is the fastest-moving direct competitor: 3,673 stars (CHANGED from 3,239 on 08-01, +434 in 27 days = ~16/day) and release v0.64.1 published 2026-08-27 - shipping daily.
- vercel/streamdown EXISTS and is much bigger than the thesis assumed: 6,551,190 npm downloads/week at ~1 year old (repo created 2025-08-15, 5,567 stars) - the strongest now-[fetched] evidence for the 'AI output = markdown stream' premise.
- Agent-skills directory grew 42% since the prior measurement: topic:agent-skills 12,804 -> 18,187 and topic:claude-skill 4,043 -> 4,793 (+18.6%) - the 'less than a year old and compounding' framing is confirmed with larger numbers.
- djot gap ratio CHANGED but conclusion intact: @djot/djot 1,332/week (prior ~848) vs remark-parse 50,948,894/week (prior ~44.6M) = 38,250x (prior claim 52,610x); the unscoped npm package 'djot' does not exist, so any citation must name @djot/djot.
- Front Matter CMS name-collision competitor is real and active: estruyf/vscode-front-matter, 2,539 stars, pushed 2026-08-21, homepage frontmatter.codes, self-described 'CMS running straight in Visual Studio Code'.
- CRDT layer: yjs 8,428,245/week vs @automerge/automerge 46,348/week = 182x gap (legacy unscoped automerge is 7,970/week and misleading if cited alone).
- Freshness re-checks: mdbase-dev/mdbase-spec active but tiny (97 stars, pushed 2026-08-16), silverbullet alive (5,945 stars, pushed 2026-08-27), obsidianmd/jsoncanvas 3,669 stars (pushed 2026-07-24), AnswerDotAI/llms-txt 2,587 stars, jgm/djot pushed 2026-07-01 and jgm/djot.js pushed 2026-08-19 - none dead.

---

# GAP 1 — Verification Fetch Sweep (SS → fetched)

**Method:** curl against `api.github.com` and `api.npmjs.org` only (the two allowlisted hosts needed). Observation timestamp: **2026-08-28T11:47Z** (verified via `date -u`). npm figures are the API's last-week window **2026-08-21 → 2026-08-27**. Every number below is **[fetched]** — I opened the API response myself. All derived ratios/deltas were computed via python3, shown in §13. Zero items UNREACHABLE.

---

## 1. agents.md standardization — VERDICT: CONFIRMED (canonical repo identified; org transfer is new evidence)

- `https://api.github.com/repos/agentsmd/agents.md` → **full_name `agentsmd/agents.md`, stars 23,964, created 2025-08-19T17:22:54Z, pushed 2026-08-25T16:41:55Z, open_issues 169, homepage https://agents.md**, desc "AGENTS.md — a simple, open format for guiding coding agents". [fetched]
- `https://api.github.com/repos/openai/agents.md` → returns **Moved Permanently**; followed with `curl -sL` it resolves to **agentsmd/agents.md** (same stars/dates). [fetched] The repo has been **transferred out of the `openai` org into the neutral `agentsmd` org** — structurally consistent with the thesis's `[SS]` "donated to a Linux Foundation Agentic AI Foundation" claim, but the API only proves the org transfer, **not** the LF donation; that specific claim stays [SS].
- `https://api.github.com/search/repositories?q=agents.md&sort=stars&order=desc&per_page=6` → total_count 4,580. Top hits by stars are query-pollution (VoltAgent/awesome-design-md 111,001★; google-labs-code/design.md 27,572★ — unrelated repos matching the string); **agentsmd/agents.md is the top hit that IS the standard** (#3 overall). [fetched]
- Created **Aug 2025** matches the thesis's "formalized Aug 2025"; pushed 3 days ago = actively maintained.

## 2. obsidianmd/jsoncanvas — VERDICT: CONFIRMED

- `https://api.github.com/repos/obsidianmd/jsoncanvas` → **stars 3,669, created 2024-02-28T17:20:36Z, pushed 2026-07-24T15:53:51Z, open_issues 28**, homepage https://jsoncanvas.org. [fetched] Official obsidianmd org; slow-moving spec (last push ~5 weeks ago) but not dead.

## 3. mgmeyers/obsidian-kanban — VERDICT: CONFIRMED (and strengthened, with one nuance)

- `https://api.github.com/repos/mgmeyers/obsidian-kanban` → **Moved Permanently**; resolves to **`community-archive/obsidian-kanban`** — the repo now lives in an org literally named *community-archive*. [fetched]
- Resolved repo: **stars 4,483, created 2021-04-16, pushed 2026-03-06T17:40:01Z, open_issues 600, archived=false**. [fetched]
- Last commit: `5134c05ad` 2026-03-06 "Remove funding" (housekeeping only) — `https://api.github.com/repos/community-archive/obsidian-kanban/commits?per_page=1`. [fetched]
- **Latest release 2.0.51 published 2024-05-31T01:08:28Z** = **26.9 months before today** — `https://api.github.com/repos/community-archive/obsidian-kanban/releases/latest`. [fetched]
- Nuance: by `pushed_at` alone it looks 6-months-fresh, but that push is the funding-removal commit around the archive transfer. The honest evidence for "unmaintained ~2 years" is the **release date (2y 2.9mo), 600 open issues, and the transfer to a community-archive org** — the claim is CONFIRMED in substance. Cite the release date, not pushed_at.

## 4. mdbase-dev/mdbase-spec — VERDICT: CONFIRMED (active but tiny)

- `https://api.github.com/repos/mdbase-dev/mdbase-spec` → **stars 97, created 2026-01-30, pushed 2026-08-16T08:16:59Z, open_issues 16**, homepage https://mdbase.dev/spec/. [fetched] Freshness re-check: maintained (pushed 12 days ago), adoption still very small — consistent with the standing "layer, don't compete" verdict.

## 5. silverbulletmd/silverbullet — VERDICT: CONFIRMED

- `https://api.github.com/repos/silverbulletmd/silverbullet` → **stars 5,945, pushed 2026-08-27T07:14:42Z** (yesterday), created 2022-02-16, open_issues 332, homepage https://silverbullet.md, desc "…personal productivity platform built on Markdown, turbo charged with the scripting power of Lua". [fetched] Live, actively developed rival.

## 6. estruyf/vscode-front-matter (name-collision competitor) — VERDICT: CONFIRMED

- `https://api.github.com/repos/estruyf/vscode-front-matter` → **stars 2,539, created 2019-08-23, pushed 2026-08-21T14:20:26Z, homepage https://frontmatter.codes**, desc: **"Front Matter is a CMS running straight in Visual Studio Code. Can be used with static site generators like Hugo, Jekyll, Hexo, NextJs, Gatsby, and many more..."**. [fetched] The "Front Matter" name collision is real, branded, active (pushed 7 days ago), and owns frontmatter.codes.

## 7. inkeep/open-knowledge — VERDICT: CHANGED (3,239 → 3,673)

- `https://api.github.com/repos/inkeep/open-knowledge` → **stars 3,673** (prior claim 3,239 on 08-01 → **+434 in 27 days ≈ 16.1 stars/day**), created 2026-06-03, **pushed 2026-08-28** (today), open_issues 30, homepage https://openknowledge.ai, desc "Beautiful, AI-native markdown IDE and LLM wiki". [fetched]
- Latest release: **v0.64.1 published 2026-08-27T23:26:23Z** — `https://api.github.com/repos/inkeep/open-knowledge/releases/latest`. [fetched] Released *yesterday*; v0.64.x at under 3 months old = very high shipping cadence. This is the sweep's most competitively significant fetch.

## 8. jgm/djot + djot.js — VERDICT: CONFIRMED (alive, not thriving)

- `https://api.github.com/repos/jgm/djot` → stars 2,033, **pushed 2026-07-01** (~8.5 weeks ago), open_issues 118. [fetched]
- `https://api.github.com/repos/jgm/djot.js` → stars 206, **pushed 2026-08-19** (9 days ago), open_issues 30. [fetched]
- Repos are maintained; adoption remains negligible (see §11).

## 9. vercel/streamdown — VERDICT: CONFIRMED (exists; larger than assumed)

- `https://api.github.com/repos/vercel/streamdown` → **exists: stars 5,567, created 2025-08-15T01:52:01Z, pushed 2026-08-26**, homepage https://streamdown.ai, desc "A drop-in replacement for react-markdown, designed for AI-powered streaming." [fetched]
- Paired with §11's **6.55M npm downloads/week at ~1 year old**, the thesis's `[SS]` "clearest structural evidence that AI output = markdown stream" line is now **[fetched]** and *understated*.

## 10. AnswerDotAI/llms-txt — VERDICT: CONFIRMED (observed 2,587★; no prior star figure in the doc extract to diff against)

- `https://api.github.com/repos/AnswerDotAI/llms-txt` → **stars 2,587, created 2024-09-01, pushed 2026-08-26**, homepage http://llmstxt.org/. [fetched] Note: this verifies only repo vitals; the thesis's separate "llms.txt measurably failed" efficacy claims (Otterly, 300k-domain study) remain [SS] as flagged in the doc's own priority list.

## 11. npm weekly downloads (api.npmjs.org, window 2026-08-21 → 2026-08-27) — all [fetched]

| Package | Downloads/week | URL suffix (`https://api.npmjs.org/downloads/point/last-week/`) | Verdict vs prior |
|---|---|---|---|
| **@djot/djot** | **1,332** | `@djot%2Fdjot` | CHANGED (~848 → 1,332) |
| djot (unscoped) | **package not found** | `djot` | REFUTED as a package name — only @djot/djot exists; cite it, not "djot" |
| remark-parse | 50,948,894 | `remark-parse` | CHANGED (~44.6M → 50.9M) |
| micromark | 56,793,570 | `micromark` | fetched (no prior in extract) |
| marked | 71,970,387 | `marked` | fetched |
| markdown-it | 30,053,020 | `markdown-it` | fetched |
| unified | 54,815,190 | `unified` | fetched |
| gray-matter | 8,989,723 | `gray-matter` | fetched |
| yjs | 8,428,245 | `yjs` | fetched |
| automerge (legacy) | 7,970 | `automerge` | fetched — legacy package; misleading alone |
| **@automerge/automerge** (modern) | 46,348 | `@automerge%2Fautomerge` | fetched (added for fairness) |
| **streamdown** | **6,551,190** | `streamdown` | fetched — new hard evidence |
| mermaid | 15,313,390 | `mermaid` | fetched |

- **djot gap ratio: 50,948,894 ÷ 1,332 = 38,250×** — the thesis's headline "52,610×" is **CHANGED (52,610× → 38,250×)** because djot grew faster in relative terms off a microscopic base; the *conclusion* (4+ orders of magnitude, no-new-format) is fully CONFIRMED. Update the number when quoting.
- **CRDT gap: yjs 8,428,245 ÷ @automerge/automerge 46,348 = 181.8×** (vs legacy `automerge` it would be a misleading 1,057×).

## 12. GitHub topic counts — VERDICT: CHANGED (both grew)

- `https://api.github.com/search/repositories?q=topic:agent-skills&per_page=1` → **total_count 18,187** vs claim 12,804 → **CHANGED (12,804 → 18,187), +5,383 = +42.0%** since the prior measurement. [fetched]
- `https://api.github.com/search/repositories?q=topic:claude-skill&per_page=1` → **total_count 4,793** vs claim 4,043 → **CHANGED (4,043 → 4,793), +750 = +18.6%**. [fetched]
- Direction confirms the thesis's "agent-skills directory less than a year old" momentum framing; refresh the figures wherever 12,804 appears (e.g., thesis doc line 108).

## 13. Calculation work (RULE 6; computed via python3)

- 50,948,894 / 1,332 = **38,249.9** (djot gap)
- 3,673 − 3,239 = **434** over 27 days (08-01→08-28) = **16.1/day** (inkeep)
- 18,187 − 12,804 = **5,383** = **+42.0%**; 4,793 − 4,043 = **750** = **+18.6%** (topics)
- 2026-08-28 − 2024-05-31 = **819 days = 26.9 months** (kanban release age)
- 8,428,245 / 46,348 = **181.8×**; 8,428,245 / 7,970 = **1,057.5×** (CRDT)

## Corrections the thesis doc should absorb

1. Replace "52,610×" with **38,250×** (or "~4.6 orders of magnitude") and name the package **@djot/djot**.
2. Replace 12,804 with **18,187** (topic:agent-skills) and 4,043 with **4,793** (topic:claude-skill), dated 2026-08-28.
3. obsidian-kanban: cite **community-archive/obsidian-kanban, last release 2024-05-31 (26.9 months), 600 open issues, transferred to a community-archive org** — stronger and more precise than "unmaintained ~2 years"; do not cite pushed_at.
4. agents.md: the repo now lives at **agentsmd/agents.md** (openai/agents.md redirects); the org transfer may be cited as [fetched]; the Linux Foundation donation itself is still unverified [SS].
5. streamdown adoption can now be stated hard: **6.55M downloads/week, 5,567★, ~1 year old** — upgrade that whole paragraph from [SS] to [fetched].
6. inkeep/open-knowledge: ~16 stars/day and a release published 2026-08-27 — the "fast-moving direct competitor" framing should carry these fresh numbers.