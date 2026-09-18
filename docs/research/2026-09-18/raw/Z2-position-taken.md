# Somebody has started building our product. Opened 18 September 2026.

Two products shipped in mid-2026 that sit on our ground. Neither is a commercial threat today.
Both are a warning about sequencing, and both hand us a free specification for the part of our
plan that is currently parked in Later.

## Z2.1 OpenMarkdown

- **Tagline, verbatim:** "Feather-light. Light-speed."
- **Subheadline, verbatim:** "A local-first Markdown editor built for you and your agent."
- **On the Product Hunt page, verbatim:** "A fast, light markdown editor that opens any `.md`
  file instantly. Your agent reads, writes, and co-edits the same file you're in through a CLI,
  an agent plugin, and MCP. Local-first: no account, no telemetry, your files never leave your disk."
- **Its own line on models, verbatim:** "No AI inside. That's the point. It runs on the agent you
  already have."
- **Launched** 18 July 2026 on Product Hunt, 190 upvotes.
- **Size:** the releases repository has 61 stars, 1 fork, 2 open issues. Source is not published;
  it is a releases-only repository.
- **Price:** free. No paid tier named.
- **Platforms:** macOS and Linux get the agent bridge. Windows is an editor and viewer, with
  agent co-editing marked coming soon.
- Sources, all opened 2026-09-18: https://openmarkdown.dev/ , https://openmarkdown.dev/faq ,
  https://github.com/OpenMarkdown-dev/OpenMarkdown-releases ,
  https://www.producthunt.com/products/openmarkdown

**The eight MCP tools it gives an agent**, verbatim from the FAQ: `open_file`, `open_folder`,
`reveal`, `get_context`, `execute_command`, `read_section`, `write_section`, `wait_for_change`.

**How it stops the agent clobbering you**, verbatim: writes are "section-scoped with optimistic
concurrency", and "if you and the agent touch the same section at the same time, the agent's
write comes back as a `CONFLICT` so your unsaved edit is never clobbered  the agent re-reads
the section and retries."

**Why this matters to us.**

- That conflict rule is our refusal law, arrived at independently by somebody else, and shipped.
  It is evidence the law is right, and evidence that it is not by itself a moat.
- `read_section` and `write_section` are splice-only writing under different names.
- `wait_for_change` is the one idea in the set we have not had: the agent parks and waits for
  the person to edit, instead of finishing and leaving. It turns the editor into the meeting
  point rather than the drop box.
- `reveal` scrolls the human's window to the heading the agent is discussing. That is the
  cheapest possible version of shared attention, and it needs no collaboration engine.

**What it does not have**, which is the whole of our plan: no web app, no account, no sharing, no
publishing, no live collaboration, no import, no idea mode or blueprint, no doc mode, no phone,
no history, no problems panel, no tiers because it has no business model.

## Z2.2 OpenKnowledge

- Described by Tech Times on 27 June 2026, verbatim, as "a free, open-source, WYSIWYG markdown
  editor that builds direct integrations with Claude Code, OpenAI Codex, and Cursor directly into
  the application", letting agents "read and rewrite a user's local markdown files without routing
  data through a cloud server".
- **It uses a CRDT.** The article says a dual-observer CRDT architecture lets the agent "write
  directly to the markdown file and see those changes reflected immediately in the WYSIWYG editor".
- GPL-3.0. Free.
- Source, opened 2026-09-18: https://www.techtimes.com/articles/319223/20260628/open-source-ai-markdown-editor-openknowledge-wires-claude-codex-local-files.htm
- UNVERIFIED: the article gives no repository link and no star count, and I did not open the
  project's own pages. Anything beyond the quotes above needs a second pass.

**Why this matters to us.** It is the second public bet on CRDTs for agent and human co-editing
of markdown, after Zed Delta. Our position that sync is git-merge plus a splice journal and CAS
and never a CRDT is now outnumbered in public by two shipped products. The position may still be
right. It is no longer uncontested, and the rebuttal the plan already owes for Zed now owes a
second name.

## What I take from both

1. **The MCP server is not a Later feature. It is the product surface.** Both of these products
   are, functionally, an editor plus an MCP server, and that was enough to get written about.
   Our plan has the MCP server in the Later column of section 26, behind eight phases.
2. **Nobody has done the web, the account, the sharing, the brief or the business model.** The
   whole hard half of frontmatter is still empty ground.
3. The positioning language is already in use. "Built for you and your agent" is taken. We should
   not arrive with a near-copy of that sentence.
