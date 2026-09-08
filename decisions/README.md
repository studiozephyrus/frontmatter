# frontmatter — decisions

Every decision pending on frontmatter, with the evidence behind each one.

Static: `index.html` + `app.css` + `app.js` + `questions.js`. No build, no server, no
dependency. Open the file, or serve the directory.

- **`build-questions.py`** regenerates `questions.js` from an extraction round's raw
  output: `python3 build-questions.py <round.json>`. Edit the source documents and re-run
  the round, not `questions.js`.
- **`questions.js`** sets `window.QUESTIONS` — an array in the tred decisions schema
  (`id, cat, sub, weight, q, lede, now, why, problem, evidence[], options[], rec, recCase, sources[]`).
  Everything else in the app is a projection of that array.
- **Answers** live in `localStorage` only. Export as markdown or JSON from the overview.
- **Import** takes a decision markdown file, pasted or dropped, and renders it as cards in
  the same schema — the sidecar idea in miniature: the file stays the source, the page is a view.

Design carries the tred decisions system forward: one accent (`#1a5cff`), square corners,
hairline borders, Mosvita for display and Google Sans for text, both embedded so the page
renders offline. Light and dark follow the system unless the reader chooses.

Layout has three breakpoints. Desktop is nav, content and a context rail. Below 1180 the
rail drops. Below 900 the nav becomes a drawer behind the menu button and a fixed action bar
carries prev/next within thumb reach. Measured on the live deployment at 375, 768 and 1440:
no horizontal scroll at any width, the rail hidden below 1180, the drawer opening on tap,
and the action bar sitting flush to the viewport bottom.

Every question states its own position as text — "Decision 2 of 319 · Product & definition
2/22" — and offers exactly one primary forward action, which appears as **Next decision**
once an option is picked and reads **Skip for now** before that. Clicking an area in the nav
opens an area index of every question in it, grouped open and answered, rather than jumping
to the first. Both follow a reference pass over twenty shipped question and review UIs.

Keyboard: `j`/`k` move, `a`–`d` pick an option, `↵` advances, `/` searches.

## What is in it

319 questions across 15 areas, 84 of them critical, with 588 evidence exhibits and 144
distinct source files cited. Produced by 30 agents: 15 extracted an area each from the
local corpus, 15 audited by re-opening every citation and removing anything that was a
research task rather than a decision.

Live at https://frontmatter-decisions-sagnik.vercel.app
