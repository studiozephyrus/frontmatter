# Numbers the plan quotes, re-derived today. 18 September 2026.

The house rule is that every number is re-derived at write time. These are the plan's own figures,
measured again from the same sources, plus the ones it never had.

## Z5.1 The plan's figures hold, and one of them has moved a long way

Plan says | Where | Measured 2026-09-18 | Verdict
7,638 plugins, 147,920,815 downloads | section 2 | **7,706 plugins, 148,696,933 downloads** | Holds. Up 68 plugins and 776,118 downloads in about nine days.
Obsidian chief executive's skills repository, 48,440 stars since 2 January 2026 | sections 2 and 27 | `kepano/obsidian-skills`, **48,515 stars**, created 2026-01-02 | Holds. Up 75.
Claudian, 2,112,607 downloads since 5 December 2025 | section 2 | plugin id `realclaudian`, **2,135,277** | Holds. Up 22,670.
AGENTS.md "used by over 60,000 projects" | section 2 | **about 547,840** files named AGENTS.md at repository root, GitHub's own approximate count | **Stale by roughly nine times.** Fix it.

Method: `community-plugin-stats.json` from `obsidianmd/obsidian-releases` summed in one pass; the
GitHub repositories API for stars; the GitHub code search API for the file counts, which returns an
approximate total and should be quoted as such.

## Z5.2 The thing the plan has no number for at all: Obsidian users are bolting agents on

I filtered the live plugin registry for ids containing agent, claude or mcp. **About 95 plugins**
match. The largest:

Downloads | Plugin id
2,135,277 | realclaudian
267,218 | agent-client
79,408 | claude-sidebar
36,197 | mcp-tools-istefox
23,012 | semantic-vault-mcp
16,982 | claude-code-ide
10,601 | ai-agent
9,394 | hermes-agent
7,938 | vault-as-mcp
7,579 | agentfiles
5,505 | local-rest-api-second-brain-mcp-extension
3,299 | claudian-plus
3,192 | cli-rest-mcp
2,470 | mcp-rest
2,329 | claude-anywhere
2,241 | claude-code-skills
2,200 | claude-companion

**Why this is the strongest finding of the sweep.** Section 6 of the plan sets a rule: if a
capability is a top add-on in three or more ecosystems, it ships built in. Roughly ninety-five
separate people have shipped an Obsidian plugin to join an agent to a vault. Six of them clear ten
thousand downloads and the top one clears two million. By the plan's own rule this is not a Later
feature. It is the most-demanded add-on in the ecosystem we are copying our feature list from, and
we have it in the last column.

Note also what the popular ones do: `vault-as-mcp`, `mcp-tools`, `semantic-vault-mcp`,
`local-rest-api-...-mcp-extension`, `cli-rest-mcp`, `mcp-rest`. Six of the top seventeen exist for
one purpose, **to expose the person's notes to an agent over MCP.** That is a job people are
installing third-party software to do, inside a tool whose own maker has not done it for them.

## Z5.3 Obsidian's chief executive is already on this ground

`kepano/obsidian-skills`, description verbatim: "Agent skills for Obsidian. Teach your agent to use
Obsidian CLI and open formats including Markdown, Bases, JSON Canvas."

So Obsidian has a command line, and its chief executive is publishing the skills that teach an
agent to drive it, and 48,515 people have starred that. Section 27's risk line, that Obsidian takes
the agent position, is not a future risk. It is in progress.

## Z5.4 Spec-driven development, measured two ways, and the two disagree

Repository | Stars | Created
github/spec-kit | **137,619** | 2025-08-21
modelcontextprotocol/servers | 90,423 | 2024-11-19
Fission-AI/OpenSpec | **68,919** | 2025-08-05
bmad-code-org/BMAD-METHOD | **53,157** | 2025-04-13
eyaltoledano/claude-task-master | 28,083 | 2025-03-04
openai/agents.md | 24,432 | 2025-08-19
anthropics/skills | **176,889** | 2025-09-22

Against that, the number of public repositories actually carrying the Spec Kit file layout
(`path:.specify filename:spec.md`) is about **4,736**.

**Read those two together before deciding anything.** Spec Kit is one of the most-starred
repositories on GitHub and almost nobody has the files on disk in public. Either people star it and
never run it, or they run it in private repositories, or the code search count is unreliable.
I cannot tell which from here, and I am not going to guess. **INFERENCE, clearly labelled:** the
most likely reading is that the *idea* of writing a spec for an agent is enormously popular and the
*practice* is still thin, which is the best possible moment to sell a nicer way to do it, and the
worst possible moment to bet the company on it.

## Z5.5 The document quality tools are small, and that is good news

Repository | Stars
DavidAnson/markdownlint | 6,345
errata-ai/vale | 6,109
lycheeverse/lychee | 3,918
runmedev/runme | 2,168

Nobody has built a business here. These are utilities. Bundling them into the problems panel costs
us little and nobody will out-market us on it, because there is no them.
