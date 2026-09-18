# Measured in this session, 18 September 2026

Numbers I took myself, not from an agent report. Method is written next to each so they can be re-run.

## Z1. How many public repositories carry an agent instruction file

**Method.** GitHub code search REST API, `GET /search/code`, authenticated with a personal token,
one query per row, run 2026-09-18 at about 05:35 IST. The exact queries are in the table.

**Caveat, and it matters.** GitHub's code search returns an *approximate* `total_count`. Every
figure below came back as a suspiciously round number, which is the signature of an estimate
rather than a count. Treat these as orders of magnitude, not as counts. They are also file
counts, not repository counts, and only the public half of GitHub.

Query | GitHub's reported count
`path:/ filename:AGENTS.md` | 547,840
`path:/ filename:CLAUDE.md` | 527,360
`filename:SKILL.md` (any path) | 6,111,232
`path:.kiro filename:requirements.md` | 33,216
`path:/ filename:GEMINI.md` | 27,072
`path:/ filename:llms.txt` | 21,120
`path:/ filename:.cursorrules` | 20,096
`path:.specify filename:spec.md` (GitHub Spec Kit layout) | 4,736

**What follows from it.**

- The instruction file is not a niche. Two of them clear half a million files at repository root.
- **Our plan's number is stale.** Section 2 says AGENTS.md "is used by over 60,000 projects",
  sourced from agents.md. The root-level file count today is about nine times that. Even allowing
  for the two measures counting different things, the direction is unambiguous and the plan is
  quoting a figure that has been overtaken.
- AGENTS.md and CLAUDE.md are within four per cent of each other. Neither has won. A team that
  uses both tools maintains both files. That is the fragmentation the editor could absorb.
- The Spec Kit layout at 4,736 is two orders of magnitude below the instruction files. Spec-driven
  development is real but early, which is the good news and the bad news at once.

**Re-run it with:** the script in this session's transcript, or by hand against
`https://api.github.com/search/code?q=<url-encoded query>&per_page=1` with any token.
