# Scratch probes

Throwaway scripts written to answer one question about the markdown toolchain. They are
not tests and nothing runs them; they are kept because each one produced a number that a
plan document now cites, and a reader should be able to re-run the measurement.

| File | The question it answered |
|---|---|
| `carrier-probe.mjs` | Whether a `> [!kind]` callout or a fenced block is the safer carrier for content markdown has no syntax for. Round-trips both through remark and shows what survives. This is the measurement behind the carrier decision — a fence has a closing marker that can be lost and an unclosed fence swallows the rest of the document; a callout has no closer |
| `lossy-probe.mjs` | What a parse-and-restringify cycle changes in a file that was not touched. The measurement behind "we never build a tree and write it back" |

Run either with `node test/scratch/<file>` from the repo root. They need `unified`,
`remark-parse`, `remark-gfm`, `remark-stringify` and `remark-frontmatter`, all already in
the project's dependency tree.
