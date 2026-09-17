# The engine baseline, so the product scales with the agents

Twelve invariants. Each one is a thing that, if we get it wrong now, forces a rewrite later.
Each names what it buys when agents get more capable.

1. **The file is the record.** Markdown bytes are the truth; every view is a projection of them.
   No proprietary store, ever. Buys: any future agent can read the corpus with no adapter.
2. **Splice-only writes.** An edit locates a byte range and replaces exactly those bytes, and
   refuses when the range is ambiguous. Buys: an agent's edit is reviewable and reversible, and
   the rest of the file is untouched. A switcher on Hacker News asked for exactly this:
   whether an editor "round-trips YAML frontmatter and nested code fences cleanly", because
   "every 'wysiwyg markdown' tool i've tried falls apart there".
   **Where we stand: one branch refuses a column-zero list item in front matter, which is 83
   percent of real vaults, and the fix is estimated at four days. A trailing `# comment` is
   deleted on a set, measured. Both are fixed before any public claim.**
3. **Content-addressed versions.** Every save writes a new immutable key carrying its hash.
   Buys: history, rollback, provenance, and an agent that can cite the exact version it read.
4. **Every change carries an author and an intent.** Person or agent, the model, the task.
   Buys: "who wrote this" stays answerable. The research says people will not declare AI text
   themselves, so the file has to record it.
5. **A proposal is a first-class object.** A change can exist before it is applied. Agents
   propose, people accept. Buys: the "red lining as a channel for LLM input" that switchers
   ask for, and it is the only safe way to let an agent touch a document it does not own.
6. **Everything has a stable address.** File, heading, block and property each have an
   identifier that survives a rename. Buys: an agent can be told to edit one block rather than
   a whole file, which is the difference between a safe edit and a rewrite.
7. **Machine-readable exits.** Every document and every kit is retrievable as raw markdown over
   HTTP, by `Accept: text/markdown` and by a `.md` twin, with a manifest and checksums.
   Buys: no integration work for the next agent runtime.
8. **A capability surface, not a screen surface.** Every action the interface can take exists as
   a named operation: open, read, search, propose, apply, publish, export. Buys: an MCP server,
   a command line and a public API are thin adapters rather than parallel implementations.
9. **Permissions attach to the operation.** Read, propose, apply and publish are separate rights.
   Buys: an agent token that may propose but never apply, which is what makes agent access
   safe to give away.
10. **Budgets and breakers sit at the operation layer, not in the interface.** Every model call
    is metered, attributed and stoppable centrally. Buys: an agent loop cannot spend the month.
11. **Deterministic rendering.** The same bytes render the same way in every surface, and any
    block we invent degrades to readable text elsewhere. Buys: the file stays portable, which
    is the single most cited reason people choose a markdown app (28 mentions across 8 sources).
12. **No silent merge, ever.** Conflicting versions are shown and chosen between. Obsidian's own
    help admits its merge "may sometimes create duplicate text or formatting problems". Buys:
    trust, which is the thing lost data destroys fastest.

## What this makes the product, in the agent era

The vault is the agent's memory. The map is its index. The instructions file is its policy.
The blueprint is its brief. The proposal queue is how it is supervised. None of those is a
feature bolted on; each is a consequence of the twelve invariants above.
