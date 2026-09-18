# Brief for resolving open points, 18 September 2026

Read `docs/pack/tools/AUTHOR-BRIEF.md` and `docs/pack/65-CONVENTIONS.md` first. Both bind you.

The founder asked for **every open point to be completed before he reviews and development starts**.
You own a set of files. In them, close every open point. The founder's answers of 18 September are in
`docs/pack/56-OPEN-DECISIONS.md` section 0 and `docs/pack/adr/`; they override anything older.

## Three kinds of open point, three treatments

1. **A decision** (`open:` markers, rows in an open-questions table such as `D30`, "to be decided").
   Decide it on the evidence. Write the resolution in place, and mark it
   `resolved (proposed 18 Sep, founder review)`. Never mark it `[Z]`: only the founder decides. Give the
   reasoning in one or two lines, and the alternative you rejected. If a decision truly cannot be made
   without the founder (money, legal risk, brand, a promise to users), write your recommendation anyway
   and mark it `needs founder`.
2. **An `UNVERIFIED:` claim.** Check it now against the code (`grep`, `sed`), git, or a primary source
   (`curl -sL --compressed <url>`, which works when WebFetch is refused). If it holds, replace the tag
   with the evidence (`[O]` with the command, or `[M]` with the URL and date). If it is false, fix the
   claim and say what changed. If it genuinely cannot be checked from here (a paid console, a legal
   opinion, a live device), keep `UNVERIFIED:` and add "needs:" naming what would check it.
3. **`INFERENCE:`** is allowed to stay. Only touch one if checking it is cheap.

## Log every item

Append one row per item to your log file under `docs/pack/review/`, saving after each item:

`file | id or line | the open point | what you did | basis | needs founder (yes/no)`

The log is how the founder reviews. An item missing from the log did not happen.

## Rules

- Save after every item. Never hold work in memory; a fan-out here lost 1,087 edits that way.
- Never invent a citation or number. Never renumber an id. Keep ids resolving:
  `python3 docs/pack/tools/validate-pack.py` must print `problems: 0` when you finish.
- `python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <f> --strict` must print PASSED on every
  file you touched, including your log. British spelling, plain hyphens, no em or en dashes, no
  paragraph over forty words.
- Touch only your files and your log. Commit only them with `git add <paths>` and a message ending
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. Do not push. Other agents are working
  on other files at the same time.
- Do NOT run any destructive operation (db push, migrate, DROP, DELETE, push --force, rm -rf,
  paid-plan upgrades, outbound messages). If one seems required, report it and stop.

Final reply: counts of decisions resolved, needs-founder items, unverified checked, confirmed, fixed,
still unverified, and the commit. No em or en dashes.
