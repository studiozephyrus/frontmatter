# frontmatter — decisions

Every decision pending on frontmatter, with the evidence behind each one.

Static: `index.html` + `app.css` + `app.js` + `questions.js`. No build, no server, no
dependency. Open the file, or serve the directory.

- **`questions.js`** sets `window.QUESTIONS` — an array in the tred decisions schema
  (`id, cat, sub, weight, q, lede, now, why, problem, evidence[], options[], rec, recCase, sources[]`).
  Everything else in the app is a projection of that array.
- **Answers** live in `localStorage` only. Export as markdown or JSON from the overview.
- **Import** takes a decision markdown file, pasted or dropped, and renders it as cards in
  the same schema — the sidecar idea in miniature: the file stays the source, the page is a view.

Design carries the tred decisions system forward: one accent (`#1a5cff`), square corners,
hairline borders, Mosvita for display and Google Sans for text, both embedded so the page
renders offline. Light and dark follow the system unless the reader chooses.

Layout has three breakpoints — phone (single column, bottom action bar so the decision is
thumb-reachable), tablet (nav + content), desktop (nav + content + context rail). Verified
with `scrollWidth == viewport` at 500, 820, 1180 and 1440.

Keyboard: `j`/`k` move, `a`–`d` pick an option, `/` searches.
