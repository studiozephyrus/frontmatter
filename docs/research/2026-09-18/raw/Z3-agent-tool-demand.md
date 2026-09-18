# What agent-tool users are actually asking for. Measured 18 September 2026.

**Method.** GitHub search API, `GET /search/issues`, query `repo:<R> is:issue is:open
sort:reactions-+1-desc`, authenticated, twelve rows per repository, run 2026-09-18 at about
05:45 IST. The counts below are the thumbs-up reaction count GitHub returned for each issue.
`sst/opencode` and `block/goose` both returned HTTP 422 and are missing from this sweep.

I have thrown away every row about model availability, pricing, accounts and platform support.
What is left is the part a document editor could answer.

## The single loudest theme: take it back

Reactions | Repo | Issue | Title
452 | openai/codex | #9203 | Please make "/undo" back
233 | openai/codex | #2998 | IDE-integrated diff / approval
221 | openai/codex | #11626 | CLI: Add /rewind checkpoint restore that reverts both chat context and Codex-applied code edits
41 | Aider-AI/aider | #649 | Add option to force the AI to ask the user to confirm each change before doing it

Nine hundred and forty-seven reactions across four issues, in two repositories, all saying one
thing: **let me see what the agent did, approve it, and put it back if I do not like it.**

This is the strongest external evidence the plan has ever had for the change queue on S20 and the
history on S21, and it arrived from people who are not our users and have never heard of us.
Note what #11626 asks for that we do not do: rewinding **the conversation and the file together**.
Our history restores the document. It does not restore the state of the thing that wrote it.

## The second theme: the instruction file is a first-class object

Reactions | Repo | Issue | Title
196 | Aider-AI/aider | #3314 | MCP SUPPORT
151 | microsoft/vscode-copilot-release | #563 | Custom Instructions
137 | Aider-AI/aider | #2525 | Please add support for model context protocol from anthropic
78 | microsoft/vscode-copilot-release | #8018 | Model selection hints in a prompt file
28 | Aider-AI/aider | #1005 | Add ability to add documentation for larger projects
21 | microsoft/vscode-copilot-release | #2354 | Feature Request: Prompt library for Github Copilot Chat
16 | RooCodeInc/Roo-Code | #8119 | [ENHANCEMENT] Support MCP OAuth 2.1 for HTTP MCP servers (discovery + PKCE)
3 | RooCodeInc/Roo-Code | #11368 | [ENHANCEMENT] Support .agents/skills folder

Two conclusions. **MCP is the thing users demand of their tools**, at 333 reactions across the two
aider issues alone, which is why parking our MCP server in Later is the wrong call. And **people
want a library of prompts and instructions**, not one file: a prompt library, model hints in a
prompt file, a skills folder. That is a document collection with structure, which is what we are.

## The third theme: connect the agent to my documents

Reactions | Repo | Issue | Title
409 | anthropics/claude-code | #2511 | Feature request: Connect Claude code to Claude projects
189 | openai/codex | #1797 | PDF support
44 | google-gemini/gemini-cli | #19430 | Feature Request: Parallel Agent Teams / Multi-Agent Collaboration (like Claude Code Agent Teams)

#2511 is the interesting one. Four hundred and nine people want the coding agent joined to the
place their documents live. Nobody has joined them. That join is our product.

## What I am NOT claiming

- These are open issues on public trackers. They measure the loudness of the people who file
  issues, not the market.
- Reaction counts are cumulative since the issue opened, so an old issue has had longer to gather
  them. I did not normalise by age.
- The two repositories that returned 422 may well hold more of this.
- INFERENCE: the undo cluster reads to me as the same need our change queue serves. That is my
  reading of it, not something any of those issues says.
